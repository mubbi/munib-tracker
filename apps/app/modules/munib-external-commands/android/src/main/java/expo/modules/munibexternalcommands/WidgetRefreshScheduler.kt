package expo.modules.munibexternalcommands

import android.app.AlarmManager
import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.content.BroadcastReceiver
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Build

/**
 * Redraws every home-screen widget at the moments its content changes on its own
 * (each Adhan, adhkar window edges, local midnight). `updatePeriodMillis` is only
 * a 30-minute fallback, so without these alarms "Next Salah" kept showing a
 * Salah whose time had begun until the app was opened.
 *
 * The redraw is the platform's own `ACTION_APPWIDGET_UPDATE`, sent to each of our
 * providers: react-native-android-widget then runs the JS task handler, which
 * re-derives the snapshot for "now" (`resolveSnapshotAt.ts`). Exact alarms are
 * used only when the user already granted them (precise Adhan, NF-1.36);
 * otherwise `setAndAllowWhileIdle` lands within the Doze window, which is fine
 * for a glanceable surface.
 */
internal object WidgetRefreshScheduler {
  const val ACTION_REFRESH = "app.munibtracker.action.REFRESH_WIDGETS"
  private const val REQUEST_CODE_BASE = 7300
  private const val MAX_ALARMS = 8
  /** Fire just after the boundary so "now" is past the Adhan instant. */
  private const val LATE_MS = 5_000L

  fun schedule(context: Context, timesMs: List<Long>) {
    val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager ?: return
    cancelAll(context, alarmManager)
    val now = System.currentTimeMillis()
    timesMs
      .filter { it > now }
      .distinct()
      .sorted()
      .take(MAX_ALARMS)
      .forEachIndexed { index, at ->
        val pendingIntent = pendingIntent(context, index)
        val triggerAt = at + LATE_MS
        try {
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && alarmManager.canScheduleExactAlarms()) {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC, triggerAt, pendingIntent)
          } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setAndAllowWhileIdle(AlarmManager.RTC, triggerAt, pendingIntent)
          } else {
            alarmManager.set(AlarmManager.RTC, triggerAt, pendingIntent)
          }
        } catch (_: Exception) {
          /* OEM alarm restrictions: the 30-minute updatePeriodMillis still applies. */
        }
      }
  }

  /** Sends `ACTION_APPWIDGET_UPDATE` to every widget provider in this package. */
  fun refreshAll(context: Context) {
    val manager = AppWidgetManager.getInstance(context) ?: return
    val providers = try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        manager.getInstalledProvidersForPackage(context.packageName, null)
      } else {
        manager.installedProviders.filter { it.provider.packageName == context.packageName }
      }
    } catch (_: Exception) {
      emptyList()
    }
    for (info in providers) {
      val component: ComponentName = info.provider
      val ids = manager.getAppWidgetIds(component)
      if (ids.isEmpty()) continue
      val intent = Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE)
        .setComponent(component)
        .putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
      context.sendBroadcast(intent)
    }
  }

  private fun pendingIntent(context: Context, index: Int): PendingIntent {
    val intent = Intent(context, WidgetRefreshReceiver::class.java).setAction(ACTION_REFRESH)
    val flags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    return PendingIntent.getBroadcast(context, REQUEST_CODE_BASE + index, intent, flags)
  }

  private fun cancelAll(context: Context, alarmManager: AlarmManager) {
    for (i in 0 until MAX_ALARMS) alarmManager.cancel(pendingIntent(context, i))
  }
}

/** Alarm target (not exported): redraws all widgets at a scheduled boundary. */
class WidgetRefreshReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action != WidgetRefreshScheduler.ACTION_REFRESH) return
    WidgetRefreshScheduler.refreshAll(context)
  }
}
