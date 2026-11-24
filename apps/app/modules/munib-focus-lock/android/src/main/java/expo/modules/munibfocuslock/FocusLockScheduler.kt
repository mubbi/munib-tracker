package expo.modules.munibfocuslock

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.content.ContextCompat

/**
 * Arms one exact alarm per window start and end (plan: `setExactAndAllowWhileIdle`
 * at the window start → the receiver starts the specialUse service). Exact
 * alarms also exempt the service start from Android 12+'s background FGS
 * restriction. Without the exact-alarm permission it falls back to an inexact
 * alarm (the NF-1.36 flow asks for the permission during setup).
 */
internal object FocusLockScheduler {
  const val ACTION_START = "app.munibtracker.focuslock.START"
  const val ACTION_END = "app.munibtracker.focuslock.END"
  const val EXTRA_WINDOW_ID = "windowId"

  fun rearm(context: Context) {
    val alarm = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    for (id in FocusLockStore.armedIds(context)) {
      alarm.cancel(pending(context, ACTION_START, id))
      alarm.cancel(pending(context, ACTION_END, id))
    }

    val now = System.currentTimeMillis()
    val ended = FocusLockStore.ended(context)
    val upcoming = FocusLockStore.windows(context).filter { it.end > now && it.id !in ended }
    for (w in upcoming) {
      if (w.start > now) setExact(context, alarm, w.start, pending(context, ACTION_START, w.id))
      setExact(context, alarm, w.end, pending(context, ACTION_END, w.id))
    }
    FocusLockStore.setArmedIds(context, upcoming.map { it.id })

    // A window already running (plan pushed mid-window, test window, reboot).
    FocusLockStore.activeWindow(context, now)?.let { startService(context, it.id) }
      ?: stopService(context)
  }

  fun cancelAll(context: Context) {
    val alarm = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    for (id in FocusLockStore.armedIds(context)) {
      alarm.cancel(pending(context, ACTION_START, id))
      alarm.cancel(pending(context, ACTION_END, id))
    }
    stopService(context)
  }

  private fun setExact(context: Context, alarm: AlarmManager, at: Long, pi: PendingIntent) {
    val exactAllowed = Build.VERSION.SDK_INT < 31 || alarm.canScheduleExactAlarms()
    try {
      if (exactAllowed) {
        alarm.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi)
      } else {
        alarm.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi)
      }
    } catch (_: SecurityException) {
      alarm.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi)
    }
  }

  private fun pending(context: Context, action: String, windowId: String): PendingIntent {
    val intent = Intent(context, FocusLockReceiver::class.java)
      .setAction(action)
      .putExtra(EXTRA_WINDOW_ID, windowId)
    val code = (action + windowId).hashCode()
    return PendingIntent.getBroadcast(
      context,
      code,
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )
  }

  fun hasCorePermissions(context: Context): Boolean =
    FocusLockPermissions.usageAccess(context) && FocusLockPermissions.overlay(context)

  fun startService(context: Context, windowId: String) {
    if (!hasCorePermissions(context)) return
    val intent = Intent(context, FocusLockService::class.java).putExtra(EXTRA_WINDOW_ID, windowId)
    try {
      ContextCompat.startForegroundService(context, intent)
    } catch (_: Exception) {
      // ForegroundServiceStartNotAllowedException (Android 12+) when not started
      // from the exact alarm / foreground — the next alarm or app open retries.
    }
  }

  fun stopService(context: Context) {
    context.stopService(Intent(context, FocusLockService::class.java))
  }
}
