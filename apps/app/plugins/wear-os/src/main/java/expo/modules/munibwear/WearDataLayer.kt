package expo.modules.munibwear

import android.content.Context
import app.munibtracker.wear.R
import com.google.android.gms.tasks.Task
import com.google.android.gms.tasks.Tasks
import com.google.android.gms.wearable.CapabilityClient
import com.google.android.gms.wearable.DataClient
import com.google.android.gms.wearable.DataMapItem
import com.google.android.gms.wearable.PutDataMapRequest
import com.google.android.gms.wearable.Wearable
import java.util.UUID
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import org.json.JSONArray
import org.json.JSONObject

/**
 * Data Layer access shared by the tiles, complications and activities. TileService
 * callbacks run on the main thread and Tasks.await() throws there, so everything
 * here runs on [executor] and every call is bounded well inside the tile request's
 * 10 s budget.
 */
internal object WearDataLayer {
  const val SNAPSHOT_PATH = "/munib/widget_snapshot"
  /** One DataItem per mark: `/munib/mark/<uuid>` (phone: `MunibWearListenerService`). */
  const val MARK_PATH_PREFIX = "/munib/mark/"
  private const val TIMEOUT_S = 3L
  /**
   * Declared by the phone app (`modules/munib-wear/.../res/values/wear.xml`); the watch
   * manifest listens for it coming back (`CAPABILITY_CHANGED /munib_phone_app`).
   */
  private const val PHONE_CAPABILITY = "munib_phone_app"

  val executor: ExecutorService = Executors.newSingleThreadExecutor()

  private fun <T> await(task: Task<T>): T = Tasks.await(task, TIMEOUT_S, TimeUnit.SECONDS)

  /** Raw JSON of the latest snapshot the phone pushed (`pushWearSnapshot`), or null. Worker thread only. */
  fun readSnapshotJson(context: Context): String? {
    return try {
      val items = await(
        Wearable.getDataClient(context).getDataItems(android.net.Uri.parse("wear://*$SNAPSHOT_PATH")),
      )
      try {
        if (items.count == 0) return null
        DataMapItem.fromDataItem(items.get(0)).dataMap.getString("snapshot")
      } finally {
        items.release()
      }
    } catch (_: Exception) {
      null
    }
  }

  /** Parsed snapshot, with local pending marks the phone has now confirmed dropped. Worker thread only. */
  fun readSnapshot(context: Context): WearSnapshot? {
    val snapshot = WearSnapshot.parse(readSnapshotJson(context)) ?: return null
    WearMarks.reconcile(context, snapshot)
    return snapshot
  }

  /** A paired phone is connected right now (marks go out immediately). Worker thread only. */
  fun isPhoneConnected(context: Context): Boolean {
    return try {
      await(Wearable.getNodeClient(context).connectedNodes).isNotEmpty()
    } catch (_: Exception) {
      false
    }
  }

  /**
   * Why there is no snapshot yet: no phone connected, a phone without the Munib
   * app (it declares the `munib_phone_app` capability), or the app simply hasn't
   * synced. Worker thread only.
   */
  fun phoneStatus(context: Context): PhoneStatus {
    return try {
      val connected = await(Wearable.getNodeClient(context).connectedNodes)
      if (connected.isEmpty()) return PhoneStatus.NOT_CONNECTED
      val capability = await(
        Wearable.getCapabilityClient(context).getCapability(PHONE_CAPABILITY, CapabilityClient.FILTER_ALL),
      )
      if (capability.nodes.isEmpty()) PhoneStatus.APP_MISSING else PhoneStatus.APP_INSTALLED
    } catch (_: Exception) {
      PhoneStatus.NOT_CONNECTED
    }
  }

  /**
   * Marks [prayerId] for [date] on the phone and never drops it (E-38): the mark is first
   * queued durably in [WearMarks], then written as a `/munib/mark/<id>` DataItem (not a
   * fire-and-forget message) that the Data Layer delivers whenever the phone reconnects, with
   * an explicit Salah + day so a late delivery can never mark a different Salah. If the Data
   * Layer refuses the write, the mark stays queued and [syncMarks] retries it on the next
   * tile, app or reconnect event. Worker thread only.
   */
  fun sendMark(context: Context, prayerId: String, date: String): MarkOutcome {
    if (prayerId.isEmpty() || date.isEmpty()) return MarkOutcome.FAILED
    WearMarks.enqueue(context, date, prayerId)
    syncMarks(context)
    val outcome = if (!WearMarks.hasUnwritten(context) && isPhoneConnected(context)) {
      MarkOutcome.SENT
    } else {
      MarkOutcome.QUEUED
    }
    WearMarks.setLastOutcome(context, outcome)
    return outcome
  }

  /**
   * Retries queued marks and collects delivery receipts. A queued mark keeps its id, so a
   * retry rewrites the same DataItem path and can never double a mark. The phone deletes each
   * mark DataItem once applied, so a written mark whose item is gone has been delivered.
   * A no-op while nothing is queued. Worker thread only.
   */
  fun syncMarks(context: Context) {
    if (WearMarks.queue(context).isEmpty()) return
    val client = Wearable.getDataClient(context)
    for (mark in WearMarks.queue(context).filter { !it.written }) {
      try {
        val request = PutDataMapRequest.create("$MARK_PATH_PREFIX${mark.id}")
        request.dataMap.putString("type", "mark-prayer")
        request.dataMap.putString("id", mark.id)
        request.dataMap.putString("prayerId", mark.prayerId)
        request.dataMap.putString("date", mark.date)
        request.dataMap.putString("source", "wear")
        request.dataMap.putLong("requestedAt", mark.requestedAt)
        await(client.putDataItem(request.asPutDataRequest().setUrgent()))
        WearMarks.markWritten(context, mark.id)
      } catch (_: Exception) {
        // Data Layer unavailable: the mark stays queued ("Will sync") and is retried later.
        return
      }
    }
    try {
      val items = await(
        client.getDataItems(android.net.Uri.parse("wear://*$MARK_PATH_PREFIX"), DataClient.FILTER_PREFIX),
      )
      val present = try {
        (0 until items.count).mapNotNull { items.get(it).uri.path?.removePrefix(MARK_PATH_PREFIX) }.toSet()
      } finally {
        items.release()
      }
      val delivered = WearMarks.queue(context).filter { it.written && it.id !in present }.map { it.id }
      if (delivered.isNotEmpty()) WearMarks.acknowledge(context, delivered)
    } catch (_: Exception) {
      /* receipts arrive with the next sync or the phone's next snapshot */
    }
  }
}

internal enum class MarkOutcome { SENT, QUEUED, CONFIRMED, FAILED }

internal enum class PhoneStatus { NOT_CONNECTED, APP_MISSING, APP_INSTALLED }

/** A wrist mark not yet confirmed by the phone. [written] = the Data Layer accepted it. */
internal data class QueuedMark(
  val id: String,
  val prayerId: String,
  val date: String,
  val requestedAt: Long,
  val written: Boolean,
)

/**
 * Durable outbox of wrist marks (SharedPreferences `munib_wear_marks`, JSON) and what the
 * surfaces say about them. A mark leaves the queue only when the phone confirms it — its
 * DataItem deleted by the phone, or a snapshot showing that Salah completed — so nothing is
 * dropped silently: while anything is queued, the tiles and the app say "Will sync".
 *
 * Also holds the tiles' two-step Mark (arm, then confirm) and the last handled tile click,
 * since a tile request can re-deliver the previous click id.
 */
internal object WearMarks {
  private const val PREFS = "munib_wear_marks"
  private const val KEY_QUEUE = "queue"
  private const val KEY_OUTCOME = "outcome"
  private const val KEY_OUTCOME_AT = "outcome_at"
  private const val KEY_ARMED_ID = "armed_id"
  private const val KEY_ARMED_AT = "armed_at"
  private const val KEY_LAST_CLICK = "last_click"
  /** Keys of the pre-queue store (optimistic ids only); dropped on the first write. */
  private const val LEGACY_DATE = "date"
  private const val LEGACY_IDS = "ids"

  /** How long "Sent to your phone" / "Marked ✓" stays on a surface after a mark. */
  const val OUTCOME_VISIBLE_MS = 2L * 60L * 1000L
  /** How long a tile's "Confirm" stays up after the first tap on Mark. */
  const val ARM_MS = 8_000L
  /** Bound on the queue (days of marks with the phone away); the oldest go first. */
  private const val MAX_QUEUE = 40

  private fun prefs(context: Context) = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

  @Synchronized
  fun queue(context: Context): List<QueuedMark> {
    val raw = prefs(context).getString(KEY_QUEUE, null) ?: return emptyList()
    return try {
      val array = JSONArray(raw)
      (0 until array.length()).mapNotNull { index ->
        val item = array.optJSONObject(index) ?: return@mapNotNull null
        QueuedMark(
          id = item.optString("id"),
          prayerId = item.optString("prayerId"),
          date = item.optString("date"),
          requestedAt = item.optLong("requestedAt"),
          written = item.optBoolean("written"),
        ).takeIf { it.id.isNotEmpty() && it.prayerId.isNotEmpty() && it.date.isNotEmpty() }
      }
    } catch (_: Exception) {
      emptyList()
    }
  }

  /** commit(), not apply(): a mark must be on disk before anything else can go wrong. */
  private fun save(context: Context, marks: List<QueuedMark>) {
    val array = JSONArray()
    marks.takeLast(MAX_QUEUE).forEach {
      array.put(
        JSONObject()
          .put("id", it.id)
          .put("prayerId", it.prayerId)
          .put("date", it.date)
          .put("requestedAt", it.requestedAt)
          .put("written", it.written),
      )
    }
    prefs(context).edit()
      .putString(KEY_QUEUE, array.toString())
      .remove(LEGACY_DATE)
      .remove(LEGACY_IDS)
      .commit()
  }

  /** Queues a mark; one per Salah + day (a second mark of the same Salah reuses it). */
  @Synchronized
  fun enqueue(context: Context, date: String, prayerId: String): QueuedMark {
    val marks = queue(context)
    marks.firstOrNull { it.date == date && it.prayerId == prayerId }?.let { return it }
    val mark = QueuedMark(UUID.randomUUID().toString(), prayerId, date, System.currentTimeMillis(), written = false)
    save(context, marks + mark)
    return mark
  }

  @Synchronized
  fun markWritten(context: Context, id: String) {
    save(context, queue(context).map { if (it.id == id) it.copy(written = true) else it })
  }

  fun hasUnwritten(context: Context): Boolean = queue(context).any { !it.written }

  /** The phone applied these marks: drop them and show "Marked ✓" for a while. */
  @Synchronized
  fun acknowledge(context: Context, ids: Collection<String>) {
    val marks = queue(context)
    val remaining = marks.filter { it.id !in ids }
    if (remaining.size == marks.size) return
    save(context, remaining)
    setLastOutcome(context, MarkOutcome.CONFIRMED)
  }

  /** Salah queued for [today]: shown as done right away (optimistic). */
  fun pending(context: Context, today: String): Set<String> =
    queue(context).filter { it.date == today }.map { it.prayerId }.toSet()

  /** Drops marks the phone's snapshot already shows as completed. */
  @Synchronized
  fun reconcile(context: Context, snapshot: WearSnapshot) {
    if (snapshot.date.isEmpty()) return
    val completed = snapshot.rows.filter { it.status == "completed" }.map { it.id }.toSet()
    val confirmed = queue(context).filter { it.date == snapshot.date && it.prayerId in completed }.map { it.id }
    if (confirmed.isNotEmpty()) acknowledge(context, confirmed)
  }

  fun setLastOutcome(context: Context, outcome: MarkOutcome) {
    prefs(context).edit()
      .putString(KEY_OUTCOME, outcome.name)
      .putLong(KEY_OUTCOME_AT, System.currentTimeMillis())
      .apply()
  }

  private fun lastOutcome(context: Context): Pair<MarkOutcome, Long>? {
    val prefs = prefs(context)
    val at = prefs.getLong(KEY_OUTCOME_AT, 0L)
    if (at <= 0L) return null
    return try {
      MarkOutcome.valueOf(prefs.getString(KEY_OUTCOME, "") ?: "") to at
    } catch (_: Exception) {
      null
    }
  }

  /**
   * What to tell the user about their marks now: QUEUED for as long as anything is
   * unconfirmed (SENT just after a write reached a connected phone), then CONFIRMED briefly.
   */
  fun recentOutcome(context: Context, nowMs: Long): MarkOutcome? {
    val last = lastOutcome(context)
    val recent = last != null && nowMs - last.second <= OUTCOME_VISIBLE_MS
    if (queue(context).isNotEmpty()) {
      return if (recent && last?.first == MarkOutcome.SENT && !hasUnwritten(context)) {
        MarkOutcome.SENT
      } else {
        MarkOutcome.QUEUED
      }
    }
    if (!recent) return null
    return when (last?.first) {
      MarkOutcome.CONFIRMED, MarkOutcome.SENT -> MarkOutcome.CONFIRMED
      else -> null
    }
  }

  /** When [recentOutcome] next changes by itself (a tile timeline boundary), or null. */
  fun outcomeChangesAt(context: Context, nowMs: Long): Long? {
    val last = lastOutcome(context) ?: return null
    val end = last.second + OUTCOME_VISIBLE_MS
    return if (end > nowMs) end else null
  }

  fun outcomeLabel(context: Context, snapshot: WearSnapshot?, outcome: MarkOutcome?): String = when (outcome) {
    MarkOutcome.SENT -> snapshot?.str("sentToPhone", context.getString(R.string.wear_mark_sent))
      ?: context.getString(R.string.wear_mark_sent)
    MarkOutcome.QUEUED -> snapshot?.str("willSync", context.getString(R.string.wear_mark_will_sync))
      ?: context.getString(R.string.wear_mark_will_sync)
    MarkOutcome.CONFIRMED -> context.getString(R.string.wear_marked)
    else -> ""
  }

  /** First tap on a tile's Mark: a second, confirming tap is needed within [ARM_MS]. */
  fun arm(context: Context, prayerId: String, nowMs: Long) {
    prefs(context).edit().putString(KEY_ARMED_ID, prayerId).putLong(KEY_ARMED_AT, nowMs).apply()
  }

  fun disarm(context: Context) {
    prefs(context).edit().remove(KEY_ARMED_ID).remove(KEY_ARMED_AT).apply()
  }

  /** The Salah awaiting a confirming tap and when the offer lapses; null when none. */
  fun armed(context: Context, nowMs: Long): Pair<String, Long>? {
    val prefs = prefs(context)
    val id = prefs.getString(KEY_ARMED_ID, null) ?: return null
    val until = prefs.getLong(KEY_ARMED_AT, 0L) + ARM_MS
    return if (nowMs < until) id to until else null
  }

  /**
   * True the first time a tile click id is seen. Tile click ids carry their render time, so a
   * request that re-delivers the previous click is ignored while a real new tap gets through.
   */
  @Synchronized
  fun consumeClick(context: Context, clickId: String): Boolean {
    if (clickId.isEmpty()) return false
    val prefs = prefs(context)
    if (prefs.getString(KEY_LAST_CLICK, "") == clickId) return false
    prefs.edit().putString(KEY_LAST_CLICK, clickId).commit()
    return true
  }
}
