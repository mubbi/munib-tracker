package expo.modules.munibwear

import android.icu.text.RelativeDateTimeFormatter
import android.icu.util.ULocale
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale
import org.json.JSONArray
import org.json.JSONObject

/** One obligatory Salah row of the phone's `schedule.rows`. */
internal data class WearRow(
  val id: String,
  val name: String,
  val time: String,
  val status: String,
  val statusLabel: String,
  /** Adhan instant (epoch ms); 0 in snapshots from phone builds before the watch contract. */
  val atMs: Long,
)

/** One after-Salah tasbeeh phrase (text from the phone's adhkar dataset). */
internal data class WearZikrStep(
  val zikrId: String,
  val title: String,
  val arabic: String,
  val transliteration: String,
  val target: Int,
)

/**
 * Read model over the phone's `widget_snapshot_v1` JSON (`buildWidgetSnapshot.ts`).
 * Every label comes from the snapshot (the phone's app locale) with an English fallback.
 */
internal class WearSnapshot private constructor(private val root: JSONObject) {
  private val strings = root.optJSONObject("strings")
  private val nextPrayer = root.optJSONObject("nextPrayer")
  private val progress = root.optJSONObject("progress")
  private val streak = root.optJSONObject("streak")
  private val qaza = root.optJSONObject("qaza")
  private val hijri = root.optJSONObject("hijriDate")
  private val afterSalah = root.optJSONObject("afterSalahTasbeeh")

  /** Local day (YYYY-MM-DD) the phone built the schedule for; "" from older phone builds. */
  val date: String = root.text("date")
  val locale: String = root.text("locale").ifEmpty { "en" }
  val isRtl: Boolean = root.optBoolean("isRtl", false)
  val locationDenied: Boolean = root.optBoolean("locationDenied", false)

  val rows: List<WearRow> = root.optJSONObject("schedule")?.optJSONArray("rows").objects().map {
    WearRow(
      id = it.text("id"),
      name = it.text("name"),
      time = it.text("time"),
      status = it.text("status"),
      statusLabel = it.text("statusLabel"),
      atMs = it.optDouble("atMs", 0.0).toLong(),
    )
  }.filter { it.id.isNotEmpty() }

  val nextTitle: String = nextPrayer.text("title")
  val nextPrayerId: String = nextPrayer.text("prayerId")
  val nextPrayerName: String = nextPrayer.text("prayerName")
  val nextPrayerTime: String = nextPrayer.text("prayerTime")
  val nextPrayerAtMs: Long = nextPrayer?.optDouble("targetTimeMs", 0.0)?.toLong() ?: 0L
  val currentPrayerId: String = nextPrayer.text("currentPrayerId")

  val progressCompleted: Int = progress?.optInt("completed", 0) ?: 0
  val progressTotal: Int = progress?.optInt("total", 5) ?: 5

  val streakDays: Int = streak?.optInt("streakDays", 0) ?: 0
  val streakTitle: String = streak.text("title")
  val streakSummary: String = streak.text("summary")
  val qazaRemaining: Int = qaza?.optInt("remaining", 0) ?: 0
  val qazaTitle: String = qaza.text("title")
  val qazaRemainingLabel: String = qaza.text("remainingLabel")
  val hijriDate: String = hijri.text("hijriDate")
  val weekday: String = hijri.text("weekday")

  val afterSalahTitle: String = afterSalah.text("title")
  val afterSalahSteps: List<WearZikrStep> = afterSalah?.optJSONArray("steps").objects().map {
    WearZikrStep(
      zikrId = it.text("zikrId"),
      title = it.text("title"),
      arabic = it.text("arabic"),
      transliteration = it.text("transliteration"),
      target = it.optInt("target", 0),
    )
  }.filter { it.target > 0 }

  /** Snapshot label for [key], or [fallback] (English) when the phone hasn't sent it. */
  fun str(key: String, fallback: String): String = strings.text(key).ifEmpty { fallback }

  companion object {
    fun parse(json: String?): WearSnapshot? {
      if (json.isNullOrBlank()) return null
      return try {
        WearSnapshot(JSONObject(json))
      } catch (_: Exception) {
        null
      }
    }
  }
}

private fun JSONObject?.text(key: String): String {
  if (this == null || !has(key) || isNull(key)) return ""
  return optString(key, "")
}

private fun JSONArray?.objects(): List<JSONObject> {
  if (this == null) return emptyList()
  return (0 until length()).mapNotNull { optJSONObject(it) }
}

internal enum class RowPhase { COMPLETED, BEGUN_PENDING, UPCOMING }

internal data class RowState(
  val row: WearRow,
  val phase: RowPhase,
  /** The next Salah whose Adhan hasn't come yet. */
  val isNext: Boolean,
)

/** What a surface shows for one instant: resolved from the snapshot without the phone. */
internal data class DayState(
  /** The snapshot is for another day: times and marks would be wrong. */
  val stale: Boolean,
  val rows: List<RowState>,
  val nextName: String,
  val nextTime: String,
  /** Epoch ms of the next Adhan, 0 when unknown. */
  val nextAtMs: Long,
  /** The latest Salah whose time has begun, while it is still unmarked. */
  val markable: RowState?,
  val completed: Int,
  val total: Int,
) {
  val allDone: Boolean get() = total > 0 && completed >= total
  val progress: Float get() = if (total > 0) (completed.toFloat() / total).coerceIn(0f, 1f) else 0f

  /** Rows the user may mark: begun and not yet marked (never a future Salah). */
  fun isMarkable(prayerId: String): Boolean =
    !stale && rows.any { it.row.id == prayerId && it.phase == RowPhase.BEGUN_PENDING }
}

internal object WearDayResolver {
  fun localDate(nowMs: Long): String =
    SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date(nowMs))

  fun resolve(snapshot: WearSnapshot, nowMs: Long, pendingIds: Set<String>): DayState {
    val stale = snapshot.date.isNotEmpty() && snapshot.date != localDate(nowMs)
    val rows = snapshot.rows
    val timed = rows.isNotEmpty() && rows.all { it.atMs > 0 }
    val activeIdx = rows.indexOfFirst { it.status == "active" }

    fun begun(index: Int, row: WearRow): Boolean = when {
      timed -> row.atMs <= nowMs
      // Older phone builds: rows before the phone's "next" row have begun.
      activeIdx >= 0 -> index < activeIdx
      else -> true
    }

    val nextIdx = when {
      timed -> rows.indexOfFirst { it.atMs > nowMs }
      else -> activeIdx
    }

    val states = rows.mapIndexed { index, row ->
      val done = row.status == "completed" || row.id in pendingIds
      val phase = when {
        done -> RowPhase.COMPLETED
        begun(index, row) -> RowPhase.BEGUN_PENDING
        else -> RowPhase.UPCOMING
      }
      RowState(row, phase, isNext = !stale && index == nextIdx)
    }

    val currentIdx = states.indices.lastOrNull { begun(it, rows[it]) } ?: -1
    val markable = if (!stale && currentIdx >= 0 && states[currentIdx].phase == RowPhase.BEGUN_PENDING) {
      states[currentIdx]
    } else {
      null
    }

    val nextRow = states.getOrNull(nextIdx)?.row
    val nextName: String
    val nextTime: String
    val nextAtMs: Long
    when {
      stale -> {
        nextName = ""
        nextTime = ""
        nextAtMs = 0L
      }
      nextRow != null -> {
        nextName = nextRow.name
        nextTime = nextRow.time
        nextAtMs = if (timed) nextRow.atMs else snapshot.nextPrayerAtMs
      }
      // After Isha: the phone's next-prayer section already points at tomorrow's Fajr.
      snapshot.nextPrayerAtMs > nowMs -> {
        nextName = snapshot.nextPrayerName
        nextTime = snapshot.nextPrayerTime
        nextAtMs = snapshot.nextPrayerAtMs
      }
      else -> {
        nextName = ""
        nextTime = ""
        nextAtMs = 0L
      }
    }

    val completed = if (rows.isNotEmpty()) {
      states.count { it.phase == RowPhase.COMPLETED }
    } else {
      snapshot.progressCompleted
    }
    val total = if (rows.isNotEmpty()) rows.size else snapshot.progressTotal

    return DayState(
      stale = stale,
      rows = states,
      nextName = nextName,
      nextTime = nextTime,
      nextAtMs = nextAtMs,
      markable = markable,
      completed = completed,
      total = total,
    )
  }

  /**
   * Instants after [nowMs] at which the resolved state changes (each upcoming
   * Adhan and the next local midnight), ascending. Tiles and complications use
   * them as timeline boundaries so they move on without a phone push.
   */
  fun boundaries(snapshot: WearSnapshot, nowMs: Long): List<Long> {
    val points = sortedSetOf<Long>()
    snapshot.rows.forEach { if (it.atMs > nowMs) points.add(it.atMs) }
    if (snapshot.nextPrayerAtMs > nowMs) points.add(snapshot.nextPrayerAtMs)
    points.add(nextMidnight(nowMs))
    return points.toList()
  }

  private fun nextMidnight(nowMs: Long): Long {
    val cal = Calendar.getInstance()
    cal.timeInMillis = nowMs
    cal.add(Calendar.DAY_OF_YEAR, 1)
    cal.set(Calendar.HOUR_OF_DAY, 0)
    cal.set(Calendar.MINUTE, 0)
    cal.set(Calendar.SECOND, 0)
    cal.set(Calendar.MILLISECOND, 0)
    return cal.timeInMillis
  }

  /** "in 42 minutes" / "in 2 hours" in the phone's app locale (ICU, no catalog needed). */
  fun relativeUntil(atMs: Long, nowMs: Long, locale: String): String {
    if (atMs <= nowMs) return ""
    val minutes = ((atMs - nowMs + 59_999L) / 60_000L).toDouble()
    val formatter = RelativeDateTimeFormatter.getInstance(ULocale.forLanguageTag(locale))
    return if (minutes < 90) {
      formatter.format(minutes, RelativeDateTimeFormatter.Direction.NEXT, RelativeDateTimeFormatter.RelativeUnit.MINUTES)
    } else {
      formatter.format(
        Math.round(minutes / 60.0).toDouble(),
        RelativeDateTimeFormatter.Direction.NEXT,
        RelativeDateTimeFormatter.RelativeUnit.HOURS,
      )
    }
  }
}
