package expo.modules.munibtvhome

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.ContentResolver
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.util.Log
import androidx.tvprovider.media.tv.PreviewChannel
import androidx.tvprovider.media.tv.PreviewChannelHelper
import androidx.tvprovider.media.tv.PreviewProgram
import androidx.tvprovider.media.tv.TvContractCompat
import org.json.JSONObject

/**
 * Keeps one "Munib Tracker" preview channel on the Android TV home screen in sync
 * with the JSON payload built in JS (`src/lib/tv-home/tv-home-payload.ts`).
 *
 * Items carry validity windows (next Salah, adhkar, day-scoped rows). The payload
 * is stored, and an inexact RTC alarm re-runs [publishStored] at the next window
 * boundary, so the row stays correct while the app is closed.
 *
 * Fire TV ships the same APK but its launcher does not show preview channels, so
 * [isSupported] is false there.
 * https://developer.android.com/training/tv/discovery/recommendations-channel
 */
internal object TvHomeChannelPublisher {
  private const val TAG = "MunibTvHome"
  private const val PREFS = "munib_tv_home"
  private const val KEY_PAYLOAD = "payload"
  private const val KEY_CHANNEL_ID = "channelId"
  private const val KEY_PROGRAM_PREFIX = "program:"
  private const val CHANNEL_PROVIDER_ID = "munib-tracker-home"
  private const val MAX_PROGRAMS = 10
  const val ACTION_REFRESH = "expo.modules.munibtvhome.REFRESH"

  private val ART = mapOf(
    "salah" to R.drawable.tv_home_salah,
    "tracker" to R.drawable.tv_home_tracker,
    "quran" to R.drawable.tv_home_quran,
    "hadith" to R.drawable.tv_home_hadith,
    "adhkar" to R.drawable.tv_home_adhkar,
    "ramadan" to R.drawable.tv_home_ramadan,
    "friday" to R.drawable.tv_home_friday,
  )

  fun isSupported(context: Context): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return false
    if (Build.MANUFACTURER.equals("Amazon", ignoreCase = true) || Build.MODEL.startsWith("AFT")) {
      return false
    }
    val pm = context.packageManager
    if (!pm.hasSystemFeature(PackageManager.FEATURE_LEANBACK)) return false
    return pm.resolveContentProvider(TvContractCompat.AUTHORITY, 0) != null
  }

  fun savePayload(context: Context, json: String) {
    prefs(context).edit().putString(KEY_PAYLOAD, json).apply()
  }

  /** Install / boot / alarm entry point. Creates the (empty) channel when no payload exists yet. */
  @Synchronized
  fun publishStored(context: Context): Boolean {
    if (!isSupported(context)) return false
    val json = prefs(context).getString(KEY_PAYLOAD, null)
    if (json == null) {
      return runCatching {
        val label = context.applicationInfo.loadLabel(context.packageManager).toString()
        ensureChannel(context, JSONObject().put("channelName", label))
        true
      }.getOrElse { e ->
        Log.w(TAG, "channel init failed", e)
        false
      }
    }
    return publish(context, json)
  }

  @Synchronized
  fun publish(context: Context, json: String): Boolean {
    if (!isSupported(context)) return false
    return try {
      val payload = JSONObject(json)
      val now = System.currentTimeMillis()
      val channelId = ensureChannel(context, payload)
      syncPrograms(context, channelId, visibleItems(payload, now))
      scheduleRefresh(context, nextBoundary(payload, now))
      true
    } catch (e: Exception) {
      Log.w(TAG, "publish failed", e)
      false
    }
  }

  @Synchronized
  fun clear(context: Context) {
    val prefs = prefs(context)
    val helper = PreviewChannelHelper(context)
    val channelId = prefs.getLong(KEY_CHANNEL_ID, -1L)
    if (channelId > 0) runCatching { helper.deletePreviewChannel(channelId) }
    prefs.edit().clear().apply()
    scheduleRefresh(context, null)
  }

  private fun prefs(context: Context): SharedPreferences =
    context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

  private fun resourceUri(context: Context, resId: Int): Uri {
    val res = context.resources
    // Name-based URI: stays valid across builds (IDs can change), launchers cache by URI.
    return Uri.Builder()
      .scheme(ContentResolver.SCHEME_ANDROID_RESOURCE)
      .authority(res.getResourcePackageName(resId))
      .appendPath(res.getResourceTypeName(resId))
      .appendPath(res.getResourceEntryName(resId))
      .build()
  }

  private fun ensureChannel(context: Context, payload: JSONObject): Long {
    val helper = PreviewChannelHelper(context)
    val prefs = prefs(context)
    val channel = PreviewChannel.Builder()
      .setDisplayName(payload.optString("channelName", "Munib Tracker"))
      .setAppLinkIntentUri(Uri.parse(payload.optString("appLink", "munib-tracker://")))
      .setInternalProviderId(CHANNEL_PROVIDER_ID)
      .setLogo(resourceUri(context, R.drawable.tv_home_channel_logo))
      .build()

    val stored = prefs.getLong(KEY_CHANNEL_ID, -1L)
    if (stored > 0 && helper.getPreviewChannel(stored) != null) {
      helper.updatePreviewChannel(stored, channel)
      return stored
    }
    // App data was cleared but the provider still has our channel.
    helper.allChannels.firstOrNull { it.internalProviderId == CHANNEL_PROVIDER_ID }?.let { existing ->
      prefs.edit().putLong(KEY_CHANNEL_ID, existing.id).apply()
      helper.updatePreviewChannel(existing.id, channel)
      return existing.id
    }

    val id = helper.publishChannel(channel)
    check(id > 0) { "TvProvider rejected the channel" }
    prefs.edit().putLong(KEY_CHANNEL_ID, id).apply()
    // The first channel an app creates is its default channel and may be shown
    // without a user prompt.
    runCatching { TvContractCompat.requestChannelBrowsable(context, id) }
    return id
  }

  private fun visibleItems(payload: JSONObject, now: Long): List<JSONObject> {
    val out = mutableListOf<JSONObject>()
    val seen = mutableSetOf<String>()
    val sections = payload.optJSONArray("sections") ?: return out
    for (s in 0 until sections.length()) {
      val items = sections.getJSONObject(s).optJSONArray("items") ?: continue
      for (i in 0 until items.length()) {
        val item = items.getJSONObject(i)
        val id = item.optString("id")
        if (id.isEmpty() || id in seen) continue
        if (item.has("validFromMs") && now < item.getLong("validFromMs")) continue
        if (item.has("validUntilMs") && now >= item.getLong("validUntilMs")) continue
        seen += id
        out += item
        if (out.size >= MAX_PROGRAMS) return out
      }
    }
    return out
  }

  private fun nextBoundary(payload: JSONObject, now: Long): Long? {
    var next: Long? = null
    val sections = payload.optJSONArray("sections") ?: return null
    for (s in 0 until sections.length()) {
      val items = sections.getJSONObject(s).optJSONArray("items") ?: continue
      for (i in 0 until items.length()) {
        val item = items.getJSONObject(i)
        for (key in arrayOf("validFromMs", "validUntilMs")) {
          if (!item.has(key)) continue
          val at = item.getLong(key)
          if (at > now && (next == null || at < next)) next = at
        }
      }
    }
    return next
  }

  private fun syncPrograms(context: Context, channelId: Long, items: List<JSONObject>) {
    val helper = PreviewChannelHelper(context)
    val prefs = prefs(context)
    val editor = prefs.edit()
    val keep = mutableSetOf<String>()

    items.forEachIndexed { index, item ->
      val id = item.getString("id")
      keep += id
      val program = PreviewProgram.Builder()
        .setChannelId(channelId)
        .setType(TvContractCompat.PreviewPrograms.TYPE_CLIP)
        .setTitle(item.optString("title"))
        .setDescription(item.optString("description"))
        .setPosterArtUri(resourceUri(context, ART[item.optString("art")] ?: R.drawable.tv_home_tracker))
        .setPosterArtAspectRatio(TvContractCompat.PreviewPrograms.ASPECT_RATIO_16_9)
        .setIntentUri(Uri.parse(item.getString("deepLink")))
        .setInternalProviderId(id)
        // Higher weight sorts first — keep the payload order.
        .setWeight((MAX_PROGRAMS - index) * 10)
        .build()

      val key = KEY_PROGRAM_PREFIX + id
      val existing = prefs.getLong(key, -1L)
      if (existing > 0 && helper.getPreviewProgram(existing) != null) {
        helper.updatePreviewProgram(existing, program)
      } else {
        val programId = helper.publishPreviewProgram(program)
        if (programId > 0) editor.putLong(key, programId)
      }
    }

    for (key in prefs.all.keys) {
      if (!key.startsWith(KEY_PROGRAM_PREFIX) || key.removePrefix(KEY_PROGRAM_PREFIX) in keep) continue
      val programId = prefs.getLong(key, -1L)
      if (programId > 0) runCatching { helper.deletePreviewProgram(programId) }
      editor.remove(key)
    }
    editor.apply()
  }

  private fun scheduleRefresh(context: Context, at: Long?) {
    val alarms = context.getSystemService(AlarmManager::class.java) ?: return
    val intent = Intent(context, TvHomeReceiver::class.java).setAction(ACTION_REFRESH)
    val pending = PendingIntent.getBroadcast(
      context,
      0,
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )
    if (at == null) {
      alarms.cancel(pending)
      return
    }
    // Inexact, non-wakeup: no exact-alarm permission, and a sleeping TV refreshes on wake.
    alarms.set(AlarmManager.RTC, at + 1_000L, pending)
  }
}
