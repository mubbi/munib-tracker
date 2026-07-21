package expo.modules.munibexternalcommands

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.graphics.drawable.IconCompat
import org.json.JSONArray
import org.json.JSONObject

/**
 * Android counterpart to the iOS prayer Live Activity (NF-1.19): sticky ongoing
 * notification with chronometer + optional Android 16 Live Update / ProgressStyle
 * promotion when the user explicitly starts "Track this Salah".
 *
 * Driven by JS widget-snapshot sync plus multi-boundary AlarmManager phase flips
 * so updates continue while the app is killed. No foreground service.
 * See docs/NATIVE_SURFACES.md and Android Live Update docs.
 */
internal object OngoingSalahNotification {
  const val CHANNEL_ID = "prayerOngoing"
  private const val NOTIFICATION_ID = 4821
  private const val PREFS_NAME = "munib_ongoing_notification"
  private const val KEY_STATE_JSON = "last_state_json"
  private const val KEY_DISMISSED_SESSION = "dismissed_session_id"
  private const val REQUEST_CODE_CONTENT = 4822
  private const val REQUEST_CODE_ACTION = 4823
  private const val REQUEST_CODE_STOP = 4825
  private const val REQUEST_CODE_DELETE = 4826
  private const val REQUEST_CODE_BOUNDARY_BASE = 4900
  private const val MAX_BOUNDARY_ALARMS = 8
  private const val FALLBACK_CHANNEL_NAME = "Next Salah countdown"
  private const val FALLBACK_DEEP_LINK = "munib-tracker://tracker"
  private const val FALLBACK_PREPARE_LINK = "munib-tracker://zikr/before_prayer"
  private const val ACTION_STOP = "expo.modules.munibexternalcommands.STOP_ONGOING"
  private const val ACTION_DELETE = "expo.modules.munibexternalcommands.DELETE_ONGOING"
  private const val ACTION_BOUNDARY = "expo.modules.munibexternalcommands.BOUNDARY"
  private const val EXTRA_BOUNDARY_INDEX = "boundary_index"

  private data class ScheduleEntry(
    val executeAtMs: Long,
    val phase: String,
    val prayerName: String,
    val prayerTimeLabel: String,
    val title: String,
    val actionLabel: String,
    val actionDeepLink: String,
    val targetTimeMs: Long,
    val progressPercent: Int,
    val shortCriticalText: String,
  )

  private data class OngoingState(
    val sessionId: String,
    val prayerId: String,
    val title: String,
    val prayerName: String,
    val prayerTimeLabel: String,
    val countdownLabel: String,
    val remainingLabel: String,
    val targetTimeMs: Long,
    val deepLink: String,
    val phase: String,
    val actionLabel: String,
    val actionDeepLink: String,
    val prepareLabel: String,
    val prepareDeepLink: String,
    val stopLabel: String,
    val shortCriticalText: String,
    val progressPercent: Int,
    val progressSegments: List<Int>,
    val progressPoints: List<Int>,
    val requestPromoted: Boolean,
    val schedule: List<ScheduleEntry>,
    val followingName: String,
    val followingTime: String,
    val followingTargetTimeMs: Long,
    val channelName: String,
    val arrived: Boolean = false,
  )

  fun update(context: Context, json: String) {
    val state = parse(json) ?: return
    val dismissed = prefs(context).getString(KEY_DISMISSED_SESSION, null)
    if (state.requestPromoted && dismissed != null && dismissed == state.sessionId) {
      // User unpinned this session — do not silently recreate.
      return
    }
    persist(context, json)
    post(context, state)
    scheduleBoundaryAlarms(context, state)
  }

  /** Applies an FCM / alarm-driven phase payload (versioned JSON). */
  fun applyPhasePayload(context: Context, json: String) {
    update(context, json)
  }

  fun cancel(context: Context) {
    cancelAllBoundaryAlarms(context)
    NotificationManagerCompat.from(context).cancel(NOTIFICATION_ID)
    prefs(context).edit().remove(KEY_STATE_JSON).apply()
  }

  fun markDismissed(context: Context) {
    val raw = prefs(context).getString(KEY_STATE_JSON, null)
    val sessionId = raw?.let { parse(it)?.sessionId }
    cancel(context)
    if (!sessionId.isNullOrBlank()) {
      prefs(context).edit().putString(KEY_DISMISSED_SESSION, sessionId).apply()
    }
  }

  fun canPostPromoted(context: Context): Boolean {
    return try {
      if (Build.VERSION.SDK_INT < 36) return false
      val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager
        ?: return false
      val method = manager.javaClass.getMethod("canPostPromotedNotifications")
      method.invoke(manager) as? Boolean ?: false
    } catch (_: Exception) {
      false
    }
  }

  fun openPromotedSettings(context: Context) {
    try {
      val intent = Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).apply {
        putExtra(Settings.EXTRA_APP_PACKAGE, context.packageName)
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      context.startActivity(intent)
    } catch (_: Exception) {
      /* Settings activity unavailable */
    }
  }

  fun refreshAtBoundary(context: Context, boundaryIndex: Int) {
    val raw = prefs(context).getString(KEY_STATE_JSON, null) ?: return
    val previous = parse(raw) ?: return
    val entry = previous.schedule.getOrNull(boundaryIndex)
    if (entry != null) {
      val next = previous.copy(
        phase = entry.phase,
        prayerName = entry.prayerName.ifBlank { previous.prayerName },
        prayerTimeLabel = entry.prayerTimeLabel.ifBlank { previous.prayerTimeLabel },
        title = entry.title.ifBlank { previous.title },
        actionLabel = entry.actionLabel.ifBlank { previous.actionLabel },
        actionDeepLink = entry.actionDeepLink.ifBlank { previous.actionDeepLink },
        targetTimeMs = if (entry.targetTimeMs > 0) entry.targetTimeMs else previous.targetTimeMs,
        progressPercent = entry.progressPercent,
        shortCriticalText = entry.shortCriticalText.ifBlank { previous.shortCriticalText },
        arrived = entry.phase != "upcoming",
      )
      persist(context, serialize(next))
      post(context, next)
      scheduleBoundaryAlarms(context, next)
      return
    }
    // Legacy single-boundary flip.
    if (previous.followingName.isBlank()) return
    post(
      context,
      previous.copy(
        prayerName = previous.followingName,
        prayerTimeLabel = previous.followingTime,
        targetTimeMs = previous.followingTargetTimeMs,
        phase = "markSalah",
        arrived = true,
      ),
    )
  }

  private fun parse(json: String): OngoingState? =
    try {
      val root = JSONObject(json)
      val prepareLabel = root.optString("prepareLabel").ifBlank {
        root.optString("markLabel")
      }
      val prepareDeepLink = root.optString("prepareDeepLink").ifBlank {
        FALLBACK_PREPARE_LINK
      }
      val segments = mutableListOf<Int>()
      val segArr = root.optJSONArray("progressSegments")
      if (segArr != null) {
        for (i in 0 until segArr.length()) segments.add(segArr.optInt(i, 0))
      }
      if (segments.isEmpty()) {
        segments.addAll(listOf(60, 15, 30))
      }
      val points = mutableListOf<Int>()
      val ptArr = root.optJSONArray("progressPoints")
      if (ptArr != null) {
        for (i in 0 until ptArr.length()) points.add(ptArr.optInt(i, 0))
      }
      if (points.isEmpty()) {
        points.addAll(listOf(60, 75))
      }
      val schedule = mutableListOf<ScheduleEntry>()
      val schedArr = root.optJSONArray("schedule")
      if (schedArr != null) {
        for (i in 0 until schedArr.length()) {
          val item = schedArr.optJSONObject(i) ?: continue
          schedule.add(
            ScheduleEntry(
              executeAtMs = item.optLong("executeAtMs", 0L),
              phase = item.optString("phase"),
              prayerName = item.optString("prayerName"),
              prayerTimeLabel = item.optString("prayerTimeLabel"),
              title = item.optString("title"),
              actionLabel = item.optString("actionLabel"),
              actionDeepLink = item.optString("actionDeepLink"),
              targetTimeMs = item.optLong("targetTimeMs", 0L),
              progressPercent = item.optInt("progressPercent", 0),
              shortCriticalText = item.optString("shortCriticalText"),
            ),
          )
        }
      }
      OngoingState(
        sessionId = root.optString("sessionId", "ambient"),
        prayerId = root.optString("prayerId"),
        title = root.optString("title"),
        prayerName = root.optString("prayerName"),
        prayerTimeLabel = root.optString("prayerTimeLabel"),
        countdownLabel = root.optString("countdownLabel"),
        remainingLabel = root.optString("remainingLabel"),
        targetTimeMs = root.optLong("targetTimeMs", 0L),
        deepLink = root.optString("deepLink", FALLBACK_DEEP_LINK),
        phase = root.optString("phase", "upcoming"),
        actionLabel = root.optString("actionLabel").ifBlank { prepareLabel },
        actionDeepLink = root.optString("actionDeepLink").ifBlank { prepareDeepLink },
        prepareLabel = prepareLabel,
        prepareDeepLink = prepareDeepLink,
        stopLabel = root.optString("stopLabel", "Stop"),
        shortCriticalText = root.optString("shortCriticalText"),
        progressPercent = root.optInt("progressPercent", 20),
        progressSegments = segments,
        progressPoints = points,
        requestPromoted = root.optBoolean("requestPromoted", false),
        schedule = schedule,
        followingName = root.optString("followingName"),
        followingTime = root.optString("followingTime"),
        followingTargetTimeMs = root.optLong("followingTargetTimeMs", 0L),
        channelName = root.optString("channelName", FALLBACK_CHANNEL_NAME),
      )
    } catch (_: Exception) {
      null
    }

  private fun serialize(state: OngoingState): String {
    val root = JSONObject()
    root.put("sessionId", state.sessionId)
    root.put("prayerId", state.prayerId)
    root.put("title", state.title)
    root.put("prayerName", state.prayerName)
    root.put("prayerTimeLabel", state.prayerTimeLabel)
    root.put("countdownLabel", state.countdownLabel)
    root.put("remainingLabel", state.remainingLabel)
    root.put("targetTimeMs", state.targetTimeMs)
    root.put("deepLink", state.deepLink)
    root.put("phase", state.phase)
    root.put("actionLabel", state.actionLabel)
    root.put("actionDeepLink", state.actionDeepLink)
    root.put("prepareLabel", state.prepareLabel)
    root.put("prepareDeepLink", state.prepareDeepLink)
    root.put("stopLabel", state.stopLabel)
    root.put("shortCriticalText", state.shortCriticalText)
    root.put("progressPercent", state.progressPercent)
    root.put("progressSegments", JSONArray(state.progressSegments))
    root.put("progressPoints", JSONArray(state.progressPoints))
    root.put("requestPromoted", state.requestPromoted)
    val schedule = JSONArray()
    for (entry in state.schedule) {
      val item = JSONObject()
      item.put("executeAtMs", entry.executeAtMs)
      item.put("phase", entry.phase)
      item.put("prayerName", entry.prayerName)
      item.put("prayerTimeLabel", entry.prayerTimeLabel)
      item.put("title", entry.title)
      item.put("actionLabel", entry.actionLabel)
      item.put("actionDeepLink", entry.actionDeepLink)
      item.put("targetTimeMs", entry.targetTimeMs)
      item.put("progressPercent", entry.progressPercent)
      item.put("shortCriticalText", entry.shortCriticalText)
      schedule.put(item)
    }
    root.put("schedule", schedule)
    root.put("followingName", state.followingName)
    root.put("followingTime", state.followingTime)
    root.put("followingTargetTimeMs", state.followingTargetTimeMs)
    root.put("channelName", state.channelName)
    return root.toString()
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

  private fun actionIntent(context: Context, state: OngoingState): PendingIntent {
    val link = state.actionDeepLink.ifBlank { state.prepareDeepLink.ifBlank { FALLBACK_PREPARE_LINK } }
    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(link)).setPackage(context.packageName)
    val flags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    return PendingIntent.getActivity(context, REQUEST_CODE_ACTION, intent, flags)
  }

  private fun stopIntent(context: Context): PendingIntent {
    val intent = Intent(context, OngoingSalahActionReceiver::class.java).setAction(ACTION_STOP)
    val flags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    return PendingIntent.getBroadcast(context, REQUEST_CODE_STOP, intent, flags)
  }

  private fun deleteIntent(context: Context): PendingIntent {
    val intent = Intent(context, OngoingSalahActionReceiver::class.java).setAction(ACTION_DELETE)
    val flags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    return PendingIntent.getBroadcast(context, REQUEST_CODE_DELETE, intent, flags)
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
      .setDeleteIntent(deleteIntent(context))
      .setAutoCancel(false)
      .setPriority(NotificationCompat.PRIORITY_DEFAULT)

    if (!state.arrived && state.phase == "upcoming" && state.targetTimeMs > System.currentTimeMillis()) {
      builder.setSubText(state.remainingLabel)
      builder.setWhen(state.targetTimeMs)
      builder.setUsesChronometer(true)
      builder.setChronometerCountDown(true)
    } else {
      builder.setUsesChronometer(false)
      builder.setWhen(System.currentTimeMillis())
    }

    if (state.shortCriticalText.isNotBlank()) {
      try {
        builder.setShortCriticalText(state.shortCriticalText.take(6))
      } catch (_: Throwable) {
        /* androidx.core without shortCriticalText */
      }
    }

    if (state.requestPromoted) {
      try {
        builder.setRequestPromotedOngoing(true)
      } catch (_: Throwable) {
        /* androidx.core < 1.17 */
      }
      applyProgressStyle(context, builder, state)
    }

    val primaryLabel = state.actionLabel.ifBlank { state.prepareLabel }
    if (primaryLabel.isNotBlank()) {
      builder.addAction(0, primaryLabel, actionIntent(context, state))
    }
    if (state.requestPromoted && state.stopLabel.isNotBlank()) {
      builder.addAction(0, state.stopLabel, stopIntent(context))
    }

    try {
      NotificationManagerCompat.from(context).notify(NOTIFICATION_ID, builder.build())
    } catch (_: SecurityException) {
      /* POST_NOTIFICATIONS not granted */
    }
  }

  private fun applyProgressStyle(
    context: Context,
    builder: NotificationCompat.Builder,
    state: OngoingState,
  ) {
    try {
      val style = NotificationCompat.ProgressStyle()
      val segments = state.progressSegments.map { length ->
        NotificationCompat.ProgressStyle.Segment(length.coerceAtLeast(1))
          .setColor(Color.parseColor("#10B981"))
      }
      style.setProgressSegments(segments)
      val points = state.progressPoints.map { position ->
        NotificationCompat.ProgressStyle.Point(position.coerceAtLeast(0))
          .setColor(Color.parseColor("#E6C065"))
      }
      style.setProgressPoints(points)
      style.setProgress(state.progressPercent.coerceIn(0, 100))
      style.setStyledByProgress(true)
      try {
        style.setProgressTrackerIcon(IconCompat.createWithResource(context, smallIconRes(context)))
      } catch (_: Exception) {
        /* tracker icon optional */
      }
      builder.setStyle(style)
    } catch (_: Throwable) {
      /* ProgressStyle unavailable — Standard style still qualifies for promotion. */
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

  private fun boundaryPendingIntent(context: Context, index: Int): PendingIntent {
    val intent = Intent(context, OngoingSalahBoundaryReceiver::class.java)
      .setAction(ACTION_BOUNDARY)
      .putExtra(EXTRA_BOUNDARY_INDEX, index)
    val flags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    return PendingIntent.getBroadcast(context, REQUEST_CODE_BOUNDARY_BASE + index, intent, flags)
  }

  private fun scheduleBoundaryAlarms(context: Context, state: OngoingState) {
    cancelAllBoundaryAlarms(context)
    val now = System.currentTimeMillis()
    val entries = state.schedule
      .mapIndexed { index, entry -> index to entry }
      .filter { (_, entry) -> entry.executeAtMs > now }
      .take(MAX_BOUNDARY_ALARMS)
    if (entries.isEmpty() && state.targetTimeMs > now) {
      // Legacy single boundary at next prayer.
      scheduleOneAlarm(context, 0, state.targetTimeMs + 1_000L)
      return
    }
    for ((index, entry) in entries) {
      scheduleOneAlarm(context, index, entry.executeAtMs + 1_000L)
    }
  }

  private fun scheduleOneAlarm(context: Context, index: Int, triggerAt: Long) {
    val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager ?: return
    val pendingIntent = boundaryPendingIntent(context, index)
    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && alarmManager.canScheduleExactAlarms()) {
        alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent)
      } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent)
      } else {
        alarmManager.set(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent)
      }
    } catch (_: Exception) {
      /* OEM alarm restrictions */
    }
  }

  private fun cancelAllBoundaryAlarms(context: Context) {
    val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager ?: return
    for (i in 0 until MAX_BOUNDARY_ALARMS) {
      alarmManager.cancel(boundaryPendingIntent(context, i))
    }
  }
}

/** Fires at each scheduled phase boundary. */
class OngoingSalahBoundaryReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    val index = intent.getIntExtra("boundary_index", 0)
    OngoingSalahNotification.refreshAtBoundary(context, index)
  }
}

/** Stop / delete (unpin) actions for Live Updates. */
class OngoingSalahActionReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    when (intent.action) {
      "expo.modules.munibexternalcommands.STOP_ONGOING",
      "expo.modules.munibexternalcommands.DELETE_ONGOING",
      -> OngoingSalahNotification.markDismissed(context)
    }
  }
}
