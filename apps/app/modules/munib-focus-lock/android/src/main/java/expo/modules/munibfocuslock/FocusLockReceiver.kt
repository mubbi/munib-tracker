package expo.modules.munibfocuslock

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/**
 * Window start / end alarms plus the system events that clear alarms
 * (reboot, app update, clock / timezone change, exact-alarm permission change):
 * those re-arm from the plan the JS cached in SharedPreferences.
 */
class FocusLockReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent?) {
    val id = intent?.getStringExtra(FocusLockScheduler.EXTRA_WINDOW_ID)
    when (intent?.action) {
      FocusLockScheduler.ACTION_START -> {
        val window = FocusLockStore.activeWindow(context) ?: return
        if (id == null || window.id == id) FocusLockScheduler.startService(context, window.id)
      }
      FocusLockScheduler.ACTION_END -> {
        if (FocusLockStore.activeWindow(context) == null) FocusLockScheduler.stopService(context)
      }
      else -> FocusLockScheduler.rearm(context)
    }
  }
}
