package expo.modules.munibfocuslock

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat

/**
 * NF-3.13 foreground service (type `specialUse`) that runs only during a focus
 * window: every 750 ms it reads the latest ACTIVITY_RESUMED event from
 * UsageStatsManager; when the foreground app is on the blocklist it shows the
 * full-screen Salah overlay, otherwise it hides it. It stops at the window end
 * or when the window is ended (marked prayed / unlocked). No Accessibility API.
 */
class FocusLockService : Service() {
  private val handler = Handler(Looper.getMainLooper())
  private var overlay: FocusLockOverlay? = null
  private var lastForeground: String? = null
  private var defaults: FocusLockAllowlist.Defaults? = null

  private val tick = object : Runnable {
    override fun run() {
      if (!step()) return
      handler.postDelayed(this, POLL_MS)
    }
  }

  override fun onBind(intent: Intent?): IBinder? = null

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    startInForeground()
    defaults = FocusLockAllowlist.defaults(this)
    if (overlay == null) overlay = FocusLockOverlay(this) { windowId -> unlocked(windowId) }
    handler.removeCallbacks(tick)
    handler.post(tick)
    return START_NOT_STICKY
  }

  override fun onDestroy() {
    handler.removeCallbacks(tick)
    overlay?.hide()
    overlay = null
    super.onDestroy()
  }

  /** One poll. Returns false when the service stopped itself. */
  private fun step(): Boolean {
    val window = FocusLockStore.activeWindow(this)
    if (window == null || !FocusLockScheduler.hasCorePermissions(this)) {
      stopSelf()
      return false
    }
    foregroundPackage()?.let { lastForeground = it }
    val d = defaults ?: FocusLockAllowlist.defaults(this).also { defaults = it }
    val blocked = FocusLockAllowlist.effective(FocusLockStore.blocked(this), d)
    val fg = lastForeground
    if (fg != null && fg in blocked) overlay?.show(window) else overlay?.hide()
    return true
  }

  private fun foregroundPackage(): String? {
    val usm = getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager ?: return null
    val now = System.currentTimeMillis()
    val events = usm.queryEvents(now - LOOKBACK_MS, now)
    val event = UsageEvents.Event()
    var latest: String? = null
    while (events.hasNextEvent()) {
      events.getNextEvent(event)
      // ACTIVITY_RESUMED (API 29+) has the same value as the older MOVE_TO_FOREGROUND.
      if (event.eventType == UsageEvents.Event.ACTIVITY_RESUMED) latest = event.packageName
    }
    return latest
  }

  private fun unlocked(windowId: String) {
    FocusLockStore.markEnded(this, windowId)
    overlay?.hide()
    FocusLockScheduler.rearm(this)
    stopSelf()
  }

  private fun startInForeground() {
    val config = FocusLockStore.config(this)
    val labels = config.optJSONObject("labels")
    val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    if (Build.VERSION.SDK_INT >= 26 && manager.getNotificationChannel(CHANNEL_ID) == null) {
      val channel = NotificationChannel(
        CHANNEL_ID,
        labels?.optString("channelName")?.ifEmpty { null } ?: "Salah focus",
        NotificationManager.IMPORTANCE_LOW,
      )
      channel.setShowBadge(false)
      manager.createNotificationChannel(channel)
    }
    val launch = packageManager.getLaunchIntentForPackage(packageName)
    val content = launch?.let {
      PendingIntent.getActivity(this, 0, it, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
    }
    val notification = NotificationCompat.Builder(this, CHANNEL_ID)
      .setSmallIcon(applicationInfo.icon)
      .setContentTitle(labels?.optString("ongoingTitle")?.ifEmpty { null } ?: "Salah focus")
      .setContentText(labels?.optString("ongoingBody") ?: "")
      .setOngoing(true)
      .setOnlyAlertOnce(true)
      .setPriority(NotificationCompat.PRIORITY_LOW)
      .setCategory(NotificationCompat.CATEGORY_SERVICE)
      .setContentIntent(content)
      .build()
    val type = if (Build.VERSION.SDK_INT >= 34) ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE else 0
    ServiceCompat.startForeground(this, NOTIFICATION_ID, notification, type)
  }

  companion object {
    private const val CHANNEL_ID = "munib_focus_lock"
    private const val NOTIFICATION_ID = 0x4D46 // "MF"
    private const val POLL_MS = 750L
    private const val LOOKBACK_MS = 10_000L
  }
}
