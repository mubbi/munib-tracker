package expo.modules.munibfocuslock

import android.content.Context
import android.content.SharedPreferences
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale
import java.util.TimeZone

/**
 * Device-local focus-lock state (SharedPreferences, never synced): the plan the
 * JS last wrote (so BOOT_COMPLETED can re-arm without JS), the blocked
 * packages, windows ended early and the emergency-unlock log.
 */
internal object FocusLockStore {
  private const val PREFS = "munib_focus_lock"
  private const val KEY_PLAN = "plan_v1"
  private const val KEY_BLOCKED = "blocked_v1"
  private const val KEY_ENDED = "ended_v1"
  private const val KEY_EMERGENCY = "emergency_v1"
  private const val KEY_ALARMS = "alarms_v1"
  private const val DAY_MS = 24L * 60 * 60 * 1000

  data class Window(
    val id: String,
    val prayer: String,
    val title: String,
    val body: String,
    val start: Long,
    val end: Long,
  )

  private fun prefs(ctx: Context): SharedPreferences =
    ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

  private fun isoFormat(): SimpleDateFormat =
    SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).apply {
      timeZone = TimeZone.getTimeZone("UTC")
    }

  fun parseIso(value: String?): Long? =
    try {
      value?.let { isoFormat().parse(it)?.time }
    } catch (_: Exception) {
      null
    }

  fun formatIso(ms: Long): String = isoFormat().format(java.util.Date(ms))

  // Plan ------------------------------------------------------------------

  fun savePlan(ctx: Context, windows: List<Window>, config: JSONObject) {
    val array = JSONArray()
    for (w in windows) {
      array.put(
        JSONObject()
          .put("id", w.id)
          .put("prayer", w.prayer)
          .put("title", w.title)
          .put("body", w.body)
          .put("start", w.start)
          .put("end", w.end),
      )
    }
    val plan = JSONObject().put("windows", array).put("config", config)
    prefs(ctx).edit().putString(KEY_PLAN, plan.toString()).apply()
  }

  private fun plan(ctx: Context): JSONObject? =
    try {
      prefs(ctx).getString(KEY_PLAN, null)?.let { JSONObject(it) }
    } catch (_: Exception) {
      null
    }

  fun windows(ctx: Context): List<Window> {
    val array = plan(ctx)?.optJSONArray("windows") ?: return emptyList()
    return (0 until array.length()).mapNotNull { i ->
      val o = array.optJSONObject(i) ?: return@mapNotNull null
      Window(
        o.optString("id"),
        o.optString("prayer"),
        o.optString("title"),
        o.optString("body"),
        o.optLong("start"),
        o.optLong("end"),
      ).takeIf { it.id.isNotEmpty() && it.end > it.start }
    }
  }

  fun config(ctx: Context): JSONObject = plan(ctx)?.optJSONObject("config") ?: JSONObject()

  fun activeWindow(ctx: Context, now: Long = System.currentTimeMillis()): Window? {
    val ended = ended(ctx)
    return windows(ctx).firstOrNull { now >= it.start && now < it.end && it.id !in ended }
  }

  // Blocklist ---------------------------------------------------------------

  fun blocked(ctx: Context): Set<String> = stringSet(ctx, KEY_BLOCKED)

  fun setBlocked(ctx: Context, packages: Collection<String>) = putStringSet(ctx, KEY_BLOCKED, packages)

  // Ended windows -----------------------------------------------------------

  fun ended(ctx: Context): Set<String> = stringSet(ctx, KEY_ENDED)

  fun markEnded(ctx: Context, id: String) {
    val next = (ended(ctx).toList() + id).distinct().takeLast(64)
    putStringSet(ctx, KEY_ENDED, next)
  }

  // Emergency unlocks -------------------------------------------------------

  fun emergencyLog(ctx: Context): List<Long> {
    val raw = prefs(ctx).getString(KEY_EMERGENCY, "[]") ?: "[]"
    return try {
      val a = JSONArray(raw)
      (0 until a.length()).map { a.getLong(it) }
    } catch (_: Exception) {
      emptyList()
    }
  }

  fun recordEmergency(ctx: Context, now: Long = System.currentTimeMillis()) {
    val keep = (emergencyLog(ctx) + now).filter { it >= now - 35 * DAY_MS }
    prefs(ctx).edit().putString(KEY_EMERGENCY, JSONArray(keep).toString()).apply()
  }

  fun emergencyLeft(ctx: Context, now: Long = System.currentTimeMillis()): Int {
    val perDay = config(ctx).optInt("emergencyPerDay", 0)
    val today = dayKey(now)
    val used = emergencyLog(ctx).count { dayKey(it) == today }
    return maxOf(0, perDay - used)
  }

  private fun dayKey(ms: Long): Int {
    val c = Calendar.getInstance().apply { timeInMillis = ms }
    return c.get(Calendar.YEAR) * 1000 + c.get(Calendar.DAY_OF_YEAR)
  }

  // Alarm bookkeeping (so a re-plan cancels the previous alarms) --------------

  fun armedIds(ctx: Context): Set<String> = stringSet(ctx, KEY_ALARMS)

  fun setArmedIds(ctx: Context, ids: Collection<String>) = putStringSet(ctx, KEY_ALARMS, ids)

  fun reset(ctx: Context) {
    prefs(ctx).edit().clear().apply()
  }

  private fun stringSet(ctx: Context, key: String): Set<String> {
    val raw = prefs(ctx).getString(key, "[]") ?: "[]"
    return try {
      val a = JSONArray(raw)
      (0 until a.length()).mapTo(LinkedHashSet()) { a.getString(it) }
    } catch (_: Exception) {
      emptySet()
    }
  }

  private fun putStringSet(ctx: Context, key: String, values: Collection<String>) {
    prefs(ctx).edit().putString(key, JSONArray(values.toList()).toString()).apply()
  }
}
