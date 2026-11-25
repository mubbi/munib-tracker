package expo.modules.munibwear

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.google.android.gms.tasks.Tasks
import com.google.android.gms.wearable.PutDataMapRequest
import com.google.android.gms.wearable.Wearable
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.TimeUnit
import org.json.JSONArray
import org.json.JSONObject

/**
 * Debug builds only (src/debug): writes a sample phone snapshot into the watch's
 * Data Layer so tiles / complications / the app can be checked and captured
 * without a paired phone (emulator QA, store tile previews):
 *
 *   adb shell am broadcast -n app.munibtracker/expo.modules.munibwear.DebugSnapshotReceiver
 *
 * Pass `--es json '<snapshot>'` to push a specific snapshot instead.
 */
class DebugSnapshotReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    val pending = goAsync()
    val app = context.applicationContext
    val json = intent.getStringExtra("json") ?: sample(System.currentTimeMillis()).toString()
    WearDataLayer.executor.execute {
      try {
        val request = PutDataMapRequest.create(WearDataLayer.SNAPSHOT_PATH)
        request.dataMap.putString("snapshot", json)
        request.dataMap.putLong("updatedAt", System.currentTimeMillis())
        Tasks.await(Wearable.getDataClient(app).putDataItem(request.asPutDataRequest().setUrgent()), 5, TimeUnit.SECONDS)
        WearRefresh.requestAll(app)
      } catch (_: Exception) {
        /* Data Layer unavailable */
      } finally {
        pending.finish()
      }
    }
  }

  /** Two Salah done, Asr due 20 min ago (markable), Maghrib next. */
  private fun sample(now: Long): JSONObject {
    val min = 60_000L
    // Instants are relative to now (so the states are live); labels are a typical
    // afternoon so captures read naturally.
    val rows = listOf(
      Triple("fajr", "Fajr", now - 660 * min) to ("5:12 AM" to "completed"),
      Triple("dhuhr", "Dhuhr", now - 224 * min) to ("12:34 PM" to "completed"),
      Triple("asr", "Asr", now - 20 * min) to ("4:18 PM" to "pending"),
      Triple("maghrib", "Maghrib", now + 143 * min) to ("7:01 PM" to "active"),
      Triple("isha", "Isha", now + 224 * min) to ("8:22 PM" to "pending"),
    )
    val rowsJson = JSONArray()
    rows.forEach { (row, label) ->
      rowsJson.put(
        JSONObject()
          .put("id", row.first).put("name", row.second).put("time", label.first)
          .put("status", label.second).put("statusLabel", label.second).put("atMs", row.third),
      )
    }
    val next = rows[3].first
    return JSONObject()
      .put("version", 1)
      .put("date", SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date(now)))
      .put("updatedAt", "")
      .put("locale", "en")
      .put("isRtl", false)
      .put("locationDenied", false)
      .put("strings", JSONObject().put("today", "Today").put("markSalah", "Mark Salah").put("tasbeeh", "Tasbeeh"))
      .put(
        "nextPrayer",
        JSONObject().put("title", "Next Salah").put("prayerId", next.first).put("prayerName", next.second)
          .put("prayerTime", "7:01 PM").put("targetTimeMs", next.third)
          .put("currentPrayerId", "asr"),
      )
      .put("schedule", JSONObject().put("title", "Today's schedule").put("rows", rowsJson))
      .put("progress", JSONObject().put("completed", 2).put("total", 5))
      .put("streak", JSONObject().put("title", "Salah streak").put("summary", "12 days").put("streakDays", 12))
      .put("qaza", JSONObject().put("title", "Qaza").put("remaining", 15).put("remainingLabel", "15 remaining"))
      .put("hijriDate", JSONObject().put("hijriDate", "4 Jumada al-Akhirah 1448").put("weekday", "Wednesday"))
  }
}
