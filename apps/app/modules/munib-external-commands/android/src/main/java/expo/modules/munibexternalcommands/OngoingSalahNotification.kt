package expo.modules.munibexternalcommands

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.net.Uri
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import org.json.JSONObject

/**
 * Android counterpart to the iOS prayer Live Activity (NF-1.19 Phase 4): a
 * sticky ongoing notification showing the next Salah + a live countdown + a
 * Mark action. Driven by the JS widget-snapshot sync (`use-widget-snapshot-sync`)
 * plus a lightweight one-shot alarm fired at the next-prayer boundary so the
 * notification does not freeze on a stale countdown while the app is
 * backgrounded. Deliberately has **no** foreground service: this object only
 * ever reacts to a JS-driven update or the boundary alarm, never runs its own
 * loop. See docs/NATIVE_SURFACES.md.
 */
internal object OngoingSalahNotification {
  const val CHANNEL_ID = "prayerOngoing"
  private const val NOTIFICATION_ID = 4821
  private const val PREFS_NAME = "munib_ongoing_notification"
  private const val KEY_STATE_JSON = "last_state_json"
  private const val REQUEST_CODE_CONTENT = 4822
  private const val REQUEST_CODE_MARK = 4823
  private const val REQUEST_CODE_BOUNDARY = 4824
  private const val FALLBACK_CHANNEL_NAME = "Next Salah countdown"
  private const val FALLBACK_DEEP_LINK = "munib-tracker://tracker"

  private data class OngoingState(
    val prayerId: String,
    val title: String,
    val prayerName: String,
    val prayerTimeLabel: String,
    val countdownLabel: String,
    val remainingLabel: String,
    val targetTimeMs: Long,
    val deepLink: String,
    val markLabel: String,
    val followingName: String,
    val followingTime: String,
    val channelName: String,
    val arrived: Boolean = false,
  )

  /** Posts or refreshes the ongoing notification from a JS-built [OngoingNotificationState] JSON payload. */
  fun update(context: Context, json: String) {
    val state = parse(json) ?: return
    persist(context, json)
    post(context, state)
    scheduleBoundaryAlarm(context, state.targetTimeMs)
  }

  /** Cancels the ongoing notification and any pending boundary alarm (preference turned off). */
  fun cancel(context: Context) {
    cancelBoundaryAlarm(context)
    NotificationManagerCompat.from(context).cancel(NOTIFICATION_ID)
    prefs(context).edit().remove(KEY_STATE_JSON).apply()
  }

  /**
   * Fired by [OngoingSalahBoundaryReceiver] exactly at the previously-known
   * next-prayer instant. The app may be backgrounded or killed, so this only
   * flips the notification to the already-known "following" Salah (no fresh
   * countdown target) — the next real JS sync (app resume, adhan/reminder
   * wake-up) replaces it with an accurate one.
   */
  fun refreshAtBoundary(context: Context) {
    val raw = prefs(context).getString(KEY_STATE_JSON, null) ?: return
    val previous = parse(raw) ?: return
    if (previous.followingName.isBlank()) return
    post(
      context,
      previous.copy(
        prayerName = previous.followingName,
        prayerTimeLabel = previous.followingTime,
        arrived = true,
      ),
    )
  }

  private fun parse(json: String): OngoingState? =
    try {
      val root = JSONObject(json)
      OngoingState(
        prayerId = root.optString("prayerId"),
        title = root.optString("title"),
        prayerName = root.optString("prayerName"),
        prayerTimeLabel = root.optString("prayerTimeLabel"),
        countdownLabel = root.optString("countdownLabel"),
        remainingLabel = root.optString("remainingLabel"),
        targetTimeMs = root.optLong("targetTimeMs", 0L),
        deepLink = root.optString("deepLink", FALLBACK_DEEP_LINK),
        markLabel = root.optString("markLabel"),
        followingName = root.optString("followingName"),
        followingTime = root.optString("followingTime"),
        channelName = root.optString("channelName", FALLBACK_CHANNEL_NAME),
      )
    } catch (_: Exception) {
      null
    }

  private fun prefs(context: Context): SharedPreferences =
    context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

  private fun persist(context: Context, json: String) {
    prefs(context).edit().putString(KEY_STATE_JSON, json).apply()
  }

  private fun ensureChannel(context: Context, channelName: String) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
    val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    val channel = NotificationChannel(CHANNEL_ID, channelName, NotificationManager.IMPORTANCE_DEFAULT).apply {
      setSound(null, null)
      description = channelName
    }
    manager.createNotificationChannel(channel)
  }

  private fun contentIntent(context: Context, state: OngoingState): PendingIntent {
    val link = state.deepLink.ifBlank { FALLBACK_DEEP_LINK }
    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(link)).setPackage(context.packageName)
    val flags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    return PendingIntent.getActivity(context, REQUEST_CODE_CONTENT, intent, flags)
  }

  /** Re-sends the same real `ACTION_MARK_CURRENT` broadcast the widgets and Assistant use. */
  private fun markActionIntent(context: Context): PendingIntent {
    val intent = Intent(ExternalCommandQueue.ACTION_MARK_CURRENT)
      .setPackage(context.packageName)
      .putExtra("source", "ongoing")
    val flags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    return PendingIntent.getBroadcast(context, REQUEST_CODE_MARK, intent, flags)
  }

  private fun post(context: Context, state: OngoingState) {
    ensureChannel(context, state.channelName)

    val builder = NotificationCompat.Builder(context, CHANNEL_ID)
      .setSmallIcon(smallIconRes(context))
      .setContentTitle(state.prayerName.ifBlank { state.title })
      .setContentText(state.prayerTimeLabel)
      .setOngoing(true)
      .setOnlyAlertOnce(true)
      .setShowWhen(true)
      .setCategory(NotificationCompat.CATEGORY_ALARM)
      .setContentIntent(contentIntent(context, state))
      .setAutoCancel(false)
      .setPriority(NotificationCompat.PRIORITY_DEFAULT)

    if (!state.arrived && state.targetTimeMs > System.currentTimeMillis()) {
      builder.setSubText(state.remainingLabel)
      builder.setWhen(state.targetTimeMs)
      builder.setUsesChronometer(true)
      builder.setChronometerCountDown(true)
    } else {
      builder.setUsesChronometer(false)
      builder.setWhen(System.currentTimeMillis())
    }

    if (state.markLabel.isNotBlank()) {
      builder.addAction(0, state.markLabel, markActionIntent(context))
    }

    requestPromotedOngoingIfSupported(builder)

    try {
      NotificationManagerCompat.from(context).notify(NOTIFICATION_ID, builder.build())
    } catch (_: SecurityException) {
      /* POST_NOTIFICATIONS not granted; nothing to show until the user opts in. */
    }
  }

  /**
   * Requests Android 16 "Live Update" promotion
   * ([NotificationCompat.Builder.setRequestPromotedOngoing]) via reflection so
   * this compiles and runs unchanged on older androidx.core/OS versions that
   * lack the method — it simply falls back to a regular ongoing notification.
   */
  private fun requestPromotedOngoingIfSupported(builder: NotificationCompat.Builder) {
    try {
      val method = builder.javaClass.getMethod("setRequestPromotedOngoing", Boolean::class.javaPrimitiveType)
      method.invoke(builder, true)
    } catch (_: Exception) {
      /* androidx.core < 1.17 or OS < 36: no Live Update promotion available. */
    }
  }

  private fun smallIconRes(context: Context): Int {
    val fromNotificationsPlugin =
      context.resources.getIdentifier("notification_icon", "drawable", context.packageName)
    if (fromNotificationsPlugin != 0) return fromNotificationsPlugin
    val appIcon = context.resources.getIdentifier("ic_launcher_foreground", "mipmap", context.packageName)
    if (appIcon != 0) return appIcon
    return android.R.drawable.ic_dialog_info
  }

  private fun boundaryPendingIntent(context: Context): PendingIntent {
    val intent = Intent(context, OngoingSalahBoundaryReceiver::class.java)
    val flags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    return PendingIntent.getBroadcast(context, REQUEST_CODE_BOUNDARY, intent, flags)
  }

  /**
   * Schedules a single alarm at the next-prayer boundary — never a repeating
   * or exact-anywhere alarm — so the notification can flip state without a
   * foreground service. Prefers an exact alarm when the user has granted it
   * (Android 12+); otherwise degrades to an inexact-while-idle alarm, which
   * needs no special permission.
   */
  private fun scheduleBoundaryAlarm(context: Context, targetTimeMs: Long) {
    if (targetTimeMs <= System.currentTimeMillis()) {
      cancelBoundaryAlarm(context)
      return
    }
    val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager ?: return
    val pendingIntent = boundaryPendingIntent(context)
    val triggerAt = targetTimeMs + 1_000L
    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && alarmManager.canScheduleExactAlarms()) {
        alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent)
      } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent)
      } else {
        alarmManager.set(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent)
      }
    } catch (_: Exception) {
      /* Some OEMs restrict alarms; the next JS snapshot sync still refreshes the notification. */
    }
  }

  private fun cancelBoundaryAlarm(context: Context) {
    val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager ?: return
    alarmManager.cancel(boundaryPendingIntent(context))
  }
}

/** Fires exactly at the next-prayer instant to flip the ongoing notification to the following Salah. */
class OngoingSalahBoundaryReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    OngoingSalahNotification.refreshAtBoundary(context)
  }
}
