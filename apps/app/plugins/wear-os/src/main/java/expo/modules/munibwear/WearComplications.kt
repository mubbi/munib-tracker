package expo.modules.munibwear

import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import androidx.wear.watchface.complications.data.ComplicationData
import androidx.wear.watchface.complications.data.ComplicationText
import androidx.wear.watchface.complications.data.ComplicationType
import androidx.wear.watchface.complications.data.LongTextComplicationData
import androidx.wear.watchface.complications.data.NoDataComplicationData
import androidx.wear.watchface.complications.data.PlainComplicationText
import androidx.wear.watchface.complications.data.RangedValueComplicationData
import androidx.wear.watchface.complications.data.ShortTextComplicationData
import androidx.wear.watchface.complications.datasource.ComplicationDataSourceService
import androidx.wear.watchface.complications.datasource.ComplicationDataTimeline
import androidx.wear.watchface.complications.datasource.ComplicationRequest
import androidx.wear.watchface.complications.datasource.TimeInterval
import androidx.wear.watchface.complications.datasource.TimelineEntry
import app.munibtracker.wear.R
import java.time.Instant

private fun text(value: String): ComplicationText = PlainComplicationText.Builder(value).build()

private fun openApp(context: Context): PendingIntent =
  PendingIntent.getActivity(
    context,
    0,
    Intent(context, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK),
    PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
  )

/**
 * Shared plumbing: reads the snapshot on the worker thread and answers with a
 * timeline that changes at every upcoming Adhan, so the face moves on to the
 * next Salah without waiting for a phone push.
 */
abstract class WearSnapshotComplicationService : ComplicationDataSourceService() {
  internal abstract fun build(
    type: ComplicationType,
    snapshot: WearSnapshot?,
    nowMs: Long,
  ): ComplicationData?

  override fun onComplicationRequest(
    request: ComplicationRequest,
    listener: ComplicationRequestListener,
  ) {
    WearDataLayer.executor.execute {
      try {
        val nowMs = System.currentTimeMillis()
        val snapshot = WearDataLayer.readSnapshot(applicationContext)
        val current = build(request.complicationType, snapshot, nowMs)
        if (current == null) {
          listener.onComplicationData(null)
          return@execute
        }
        val bounds = if (snapshot != null) WearDayResolver.boundaries(snapshot, nowMs).take(6) else emptyList()
        if (bounds.isEmpty()) {
          listener.onComplicationData(current)
          return@execute
        }
        val starts = listOf(nowMs) + bounds
        val entries = starts.zipWithNext().mapNotNull { (start, end) ->
          build(request.complicationType, snapshot, start)?.let {
            TimelineEntry(TimeInterval(Instant.ofEpochMilli(start), Instant.ofEpochMilli(end)), it)
          }
        }
        listener.onComplicationDataTimeline(ComplicationDataTimeline(current, entries))
      } catch (_: Exception) {
        listener.onComplicationData(null)
      }
    }
  }
}

/** Next Salah: SHORT_TEXT (name + time) and LONG_TEXT (name, time, countdown title). */
class NextSalahComplicationService : WearSnapshotComplicationService() {
  override fun build(type: ComplicationType, snapshot: WearSnapshot?, nowMs: Long): ComplicationData? {
    val tap = openApp(this)
    val (title, name, time) = when {
      snapshot == null -> Triple(getString(R.string.wear_next_salah), "—", "")
      snapshot.locationDenied -> Triple(snapshot.nextTitle, "—", "")
      else -> {
        val day = WearDayResolver.resolve(snapshot, nowMs, WearMarks.pending(this, WearDayResolver.localDate(nowMs)))
        when {
          day.stale -> Triple(snapshot.nextTitle, "—", "")
          day.nextName.isEmpty() && day.allDone -> Triple(snapshot.nextTitle, "✓", snapshot.str("allDone", "All Salah done today"))
          else -> Triple(snapshot.nextTitle, day.nextName.ifEmpty { "—" }, day.nextTime)
        }
      }
    }
    val heading = title.ifEmpty { getString(R.string.wear_next_salah) }
    val description = text(listOf(heading, name, time).filter { it.isNotEmpty() }.joinToString(", "))
    return when (type) {
      ComplicationType.SHORT_TEXT ->
        ShortTextComplicationData.Builder(text(time.ifEmpty { name }), description)
          .setTitle(text(name))
          .setTapAction(tap)
          .build()
      ComplicationType.LONG_TEXT ->
        LongTextComplicationData.Builder(text(listOf(name, time).filter { it.isNotEmpty() }.joinToString(" · ")), description)
          .setTitle(text(heading))
          .setTapAction(tap)
          .build()
      else -> NoDataComplicationData()
    }
  }

  override fun getPreviewData(type: ComplicationType): ComplicationData? {
    val description = text("Asr 4:18 PM")
    return when (type) {
      ComplicationType.SHORT_TEXT ->
        ShortTextComplicationData.Builder(text("4:18"), description).setTitle(text("Asr")).build()
      ComplicationType.LONG_TEXT ->
        LongTextComplicationData.Builder(text("Asr · 4:18 PM"), description)
          .setTitle(text(getString(R.string.wear_next_salah)))
          .build()
      else -> null
    }
  }
}

/** Today's obligatory Salah progress: RANGED_VALUE ring (n / 5) or SHORT_TEXT "n/5". */
class ProgressComplicationService : WearSnapshotComplicationService() {
  override fun build(type: ComplicationType, snapshot: WearSnapshot?, nowMs: Long): ComplicationData? {
    val tap = openApp(this)
    var completed = 0
    var total = 5
    if (snapshot != null) {
      val day = WearDayResolver.resolve(snapshot, nowMs, WearMarks.pending(this, WearDayResolver.localDate(nowMs)))
      if (!day.stale) {
        completed = day.completed
        total = day.total.coerceAtLeast(1)
      }
    }
    val label = "$completed/$total"
    val description = text("${getString(R.string.wear_progress)}: $label")
    return when (type) {
      ComplicationType.RANGED_VALUE ->
        RangedValueComplicationData.Builder(completed.toFloat(), 0f, total.toFloat(), description)
          .setText(text(label))
          .setTapAction(tap)
          .build()
      ComplicationType.SHORT_TEXT ->
        ShortTextComplicationData.Builder(text(label), description)
          .setTapAction(tap)
          .build()
      else -> NoDataComplicationData()
    }
  }

  override fun getPreviewData(type: ComplicationType): ComplicationData? {
    val description = text("3/5")
    return when (type) {
      ComplicationType.RANGED_VALUE ->
        RangedValueComplicationData.Builder(3f, 0f, 5f, description).setText(text("3/5")).build()
      ComplicationType.SHORT_TEXT ->
        ShortTextComplicationData.Builder(text("3/5"), description).build()
      else -> null
    }
  }
}
