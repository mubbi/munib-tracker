package expo.modules.munibwear

import android.content.Context
import com.google.android.gms.tasks.Task
import com.google.android.gms.tasks.Tasks
import com.google.android.gms.wearable.CapabilityClient
import com.google.android.gms.wearable.DataMapItem
import com.google.android.gms.wearable.PutDataMapRequest
import com.google.android.gms.wearable.Wearable
import java.util.UUID
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

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
  /** Declared by the phone app (`modules/munib-wear/.../res/values/wear.xml`). */
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
   * Marks [prayerId] for [date] on the phone. Written as a DataItem (not a
   * fire-and-forget message) so the Data Layer delivers it whenever the phone
   * reconnects, and with an explicit Salah + day so a late delivery can never
   * mark a different Salah. Worker thread only.
   */
  fun sendMark(context: Context, prayerId: String, date: String): MarkOutcome {
    if (prayerId.isEmpty() || date.isEmpty()) return MarkOutcome.FAILED
    WearMarks.add(context, date, prayerId)
    return try {
      val request = PutDataMapRequest.create("$MARK_PATH_PREFIX${UUID.randomUUID()}")
      request.dataMap.putString("type", "mark-prayer")
      request.dataMap.putString("prayerId", prayerId)
      request.dataMap.putString("date", date)
      request.dataMap.putString("source", "wear")
      request.dataMap.putLong("requestedAt", System.currentTimeMillis())
      await(Wearable.getDataClient(context).putDataItem(request.asPutDataRequest().setUrgent()))
      val outcome = if (isPhoneConnected(context)) MarkOutcome.SENT else MarkOutcome.QUEUED
      WearMarks.setLastOutcome(context, outcome)
      outcome
    } catch (_: Exception) {
      WearMarks.remove(context, date, prayerId)
      MarkOutcome.FAILED
    }
  }
}

internal enum class MarkOutcome { SENT, QUEUED, FAILED }

internal enum class PhoneStatus { NOT_CONNECTED, APP_MISSING, APP_INSTALLED }

/**
 * Marks sent from the watch that the phone hasn't confirmed in a snapshot yet,
 * for optimistic UI. Keyed by day: a new day (or a snapshot showing the Salah
 * completed) clears them.
 */
internal object WearMarks {
  private const val PREFS = "munib_wear_marks"
  private const val KEY_DATE = "date"
  private const val KEY_IDS = "ids"
  private const val KEY_OUTCOME = "outcome"
  private const val KEY_OUTCOME_AT = "outcome_at"
  /** How long "Sent to your phone" stays on a surface after a mark. */
  private const val OUTCOME_VISIBLE_MS = 2L * 60L * 1000L

  private fun prefs(context: Context) = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

  @Synchronized
  fun pending(context: Context, today: String): Set<String> {
    val prefs = prefs(context)
    if (prefs.getString(KEY_DATE, "") != today) return emptySet()
    return prefs.getStringSet(KEY_IDS, emptySet())?.toSet() ?: emptySet()
  }

  @Synchronized
  fun add(context: Context, date: String, prayerId: String) {
    val prefs = prefs(context)
    val ids = if (prefs.getString(KEY_DATE, "") == date) {
      prefs.getStringSet(KEY_IDS, emptySet())?.toMutableSet() ?: mutableSetOf()
    } else {
      mutableSetOf()
    }
    ids.add(prayerId)
    prefs.edit().putString(KEY_DATE, date).putStringSet(KEY_IDS, ids).apply()
  }

  @Synchronized
  fun remove(context: Context, date: String, prayerId: String) {
    val prefs = prefs(context)
    if (prefs.getString(KEY_DATE, "") != date) return
    val ids = prefs.getStringSet(KEY_IDS, emptySet())?.toMutableSet() ?: return
    ids.remove(prayerId)
    prefs.edit().putStringSet(KEY_IDS, ids).apply()
  }

  /** Drops marks the phone has applied (or that belong to another day). */
  @Synchronized
  fun reconcile(context: Context, snapshot: WearSnapshot) {
    val prefs = prefs(context)
    val date = prefs.getString(KEY_DATE, "") ?: ""
    if (date.isEmpty()) return
    val today = WearDayResolver.localDate(System.currentTimeMillis())
    if (date != today) {
      prefs.edit().remove(KEY_DATE).remove(KEY_IDS).apply()
      return
    }
    if (snapshot.date != date) return
    val completed = snapshot.rows.filter { it.status == "completed" }.map { it.id }.toSet()
    val ids = prefs.getStringSet(KEY_IDS, emptySet())?.toMutableSet() ?: return
    if (ids.removeAll(completed)) prefs.edit().putStringSet(KEY_IDS, ids).apply()
  }

  fun setLastOutcome(context: Context, outcome: MarkOutcome) {
    prefs(context).edit()
      .putString(KEY_OUTCOME, outcome.name)
      .putLong(KEY_OUTCOME_AT, System.currentTimeMillis())
      .apply()
  }

  /** The last mark's outcome while it is still worth showing, else null. */
  fun recentOutcome(context: Context, nowMs: Long): MarkOutcome? {
    val prefs = prefs(context)
    val at = prefs.getLong(KEY_OUTCOME_AT, 0L)
    if (at <= 0L || nowMs - at > OUTCOME_VISIBLE_MS) return null
    return try {
      MarkOutcome.valueOf(prefs.getString(KEY_OUTCOME, "") ?: "")
    } catch (_: Exception) {
      null
    }
  }

  fun outcomeLabel(snapshot: WearSnapshot?, outcome: MarkOutcome?): String = when (outcome) {
    MarkOutcome.SENT -> snapshot?.str("sentToPhone", "Sent to your phone") ?: "Sent to your phone"
    MarkOutcome.QUEUED ->
      snapshot?.str("willSync", "Will sync when your phone is nearby") ?: "Will sync when your phone is nearby"
    else -> ""
  }
}
