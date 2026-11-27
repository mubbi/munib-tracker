package expo.modules.munibexternalcommands

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.SharedPreferences
import androidx.core.content.ContextCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.json.JSONArray
import org.json.JSONObject

internal object ExternalCommandQueue {
  const val PREFS_NAME = "munib_external_commands"
  const val QUEUE_KEY = "pending_commands_v1"
  const val ACTION_MARK_CURRENT = "app.munibtracker.action.MARK_CURRENT"
  const val ACTION_MARK_PRAYER = "app.munibtracker.action.MARK_PRAYER"
  const val ACTION_COMMANDS_QUEUED = "app.munibtracker.action.COMMANDS_QUEUED"
  const val EXTRA_PRAYER_ID = "prayerId"
  const val EXTRA_DATE = "date"
  private const val MAX_QUEUE = 32

  // append (receiver, main thread) and drain (module queue) read-modify-write the
  // same pref; synchronize so a mark landing mid-drain isn't lost.
  @Synchronized
  fun append(context: Context, payload: JSONObject) {
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    val raw = prefs.getString(QUEUE_KEY, "[]") ?: "[]"
    val array = try {
      JSONArray(raw)
    } catch (_: Exception) {
      JSONArray()
    }
    array.put(payload.toString())
    val trimmed = if (array.length() > MAX_QUEUE) {
      JSONArray().apply {
        for (i in array.length() - MAX_QUEUE until array.length()) {
          put(array.get(i))
        }
      }
    } else {
      array
    }
    prefs.edit().putString(QUEUE_KEY, trimmed.toString()).apply()
    notifyQueued(context)
  }

  fun notifyQueued(context: Context) {
    val intent = Intent(ACTION_COMMANDS_QUEUED).setPackage(context.packageName)
    context.sendBroadcast(intent)
  }

  /** Read without draining (widgets show queued marks as done before the app applies them). */
  @Synchronized
  fun peek(prefs: SharedPreferences): List<String> {
    val raw = prefs.getString(QUEUE_KEY, "[]") ?: "[]"
    return try {
      val array = JSONArray(raw)
      buildList {
        for (i in 0 until array.length()) {
          add(array.getString(i))
        }
      }
    } catch (_: Exception) {
      emptyList()
    }
  }

  @Synchronized
  fun drain(prefs: SharedPreferences): List<String> {
    val raw = prefs.getString(QUEUE_KEY, "[]") ?: "[]"
    prefs.edit().putString(QUEUE_KEY, "[]").apply()
    return try {
      val array = JSONArray(raw)
      buildList {
        for (i in 0 until array.length()) {
          add(array.getString(i))
        }
      }
    } catch (_: Exception) {
      emptyList()
    }
  }
}

class MunibExternalCommandsModule : Module() {
  private var commandsQueuedReceiver: BroadcastReceiver? = null

  override fun definition() = ModuleDefinition {
    Name("MunibExternalCommands")

    Events("onCommandsAvailable")

    OnCreate {
      val receiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
          sendEvent("onCommandsAvailable")
        }
      }
      commandsQueuedReceiver = receiver
      val reactContext = appContext.reactContext ?: return@OnCreate
      ContextCompat.registerReceiver(
        reactContext,
        receiver,
        IntentFilter(ExternalCommandQueue.ACTION_COMMANDS_QUEUED),
        ContextCompat.RECEIVER_NOT_EXPORTED,
      )
    }

    OnDestroy {
      val receiver = commandsQueuedReceiver ?: return@OnDestroy
      commandsQueuedReceiver = null
      try {
        appContext.reactContext?.unregisterReceiver(receiver)
      } catch (_: Exception) {
        /* already unregistered */
      }
    }

    AsyncFunction("enqueueCommand") { json: String ->
      val context = appContext.reactContext ?: return@AsyncFunction
      try {
        ExternalCommandQueue.append(context, JSONObject(json))
        // Direct emit in case the broadcast receiver is not registered yet.
        sendEvent("onCommandsAvailable")
      } catch (_: Exception) {
        /* malformed payload */
      }
    }

    AsyncFunction("drainCommands") {
      val prefs = appContext.reactContext?.getSharedPreferences(
        ExternalCommandQueue.PREFS_NAME,
        Context.MODE_PRIVATE,
      ) ?: return@AsyncFunction emptyList<String>()
      ExternalCommandQueue.drain(prefs)
    }

    AsyncFunction("peekCommands") {
      val prefs = appContext.reactContext?.getSharedPreferences(
        ExternalCommandQueue.PREFS_NAME,
        Context.MODE_PRIVATE,
      ) ?: return@AsyncFunction emptyList<String>()
      ExternalCommandQueue.peek(prefs)
    }

    AsyncFunction("scheduleWidgetRefresh") { timesMs: List<Double> ->
      val context = appContext.reactContext ?: return@AsyncFunction null
      WidgetRefreshScheduler.schedule(context, timesMs.map { it.toLong() })
      null
    }

    // Widgets cannot fire arbitrary broadcasts from react-native-android-widget's
    // clickAction (only OPEN_APP/OPEN_URI are handled natively there); this thin
    // helper lets the widget's headless click task re-send the same
    // ACTION_MARK_CURRENT / ACTION_MARK_PRAYER broadcast that Assistant/App Actions
    // use, so it is handled by the existing ExternalCommandReceiver.
    AsyncFunction("sendWidgetMarkBroadcast") { json: String ->
      val context = appContext.reactContext ?: return@AsyncFunction
      try {
        val payload = JSONObject(json)
        val isMarkPrayer = payload.optString("type") == "mark-prayer"
        val action = if (isMarkPrayer) {
          ExternalCommandQueue.ACTION_MARK_PRAYER
        } else {
          ExternalCommandQueue.ACTION_MARK_CURRENT
        }
        val intent = Intent(action)
          .setPackage(context.packageName)
          .putExtra("source", payload.optString("source", "widget"))
        if (isMarkPrayer) {
          intent.putExtra(ExternalCommandQueue.EXTRA_PRAYER_ID, payload.optString(ExternalCommandQueue.EXTRA_PRAYER_ID))
          intent.putExtra(ExternalCommandQueue.EXTRA_DATE, payload.optString(ExternalCommandQueue.EXTRA_DATE))
        }
        context.sendBroadcast(intent)
      } catch (_: Exception) {
        /* malformed payload */
      }
    }

    AsyncFunction("pushWearSnapshot") { json: String ->
      WearSnapshotBridge.pushSnapshot(appContext.reactContext ?: return@AsyncFunction, json)
    }

    AsyncFunction("publishAndroidWidgetPreviews") { json: String ->
      val context = appContext.reactContext ?: return@AsyncFunction false
      AndroidWidgetPreviewPublisher.publish(context, json)
    }

    // Phase 4: Android ongoing "next Salah" notification (Live Activity counterpart).
    AsyncFunction("updateOngoingNotification") { json: String ->
      val context = appContext.reactContext ?: return@AsyncFunction null
      OngoingSalahNotification.update(context, json)
      null
    }

    AsyncFunction("cancelOngoingNotification") {
      val context = appContext.reactContext ?: return@AsyncFunction null
      OngoingSalahNotification.cancel(context)
      null
    }

    AsyncFunction("applyOngoingPhasePayload") { json: String ->
      val context = appContext.reactContext ?: return@AsyncFunction null
      OngoingSalahNotification.applyPhasePayload(context, json)
      null
    }

    AsyncFunction("canPostPromotedNotifications") {
      val context = appContext.reactContext ?: return@AsyncFunction false
      OngoingSalahNotification.canPostPromoted(context)
    }

    AsyncFunction("openPromotedNotificationSettings") {
      val context = appContext.reactContext ?: return@AsyncFunction null
      OngoingSalahNotification.openPromotedSettings(context)
      null
    }

    AsyncFunction("activateWatchSession") {
      // iOS-only; no-op on Android.
    }
  }
}

/**
 * Receives the in-app mark broadcasts (Wear listener, widget click task) for a
 * background mark. Not exported: only this app sends them (App Actions open deep links).
 */
class ExternalCommandReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    val action = intent.action ?: return
    if (action != ExternalCommandQueue.ACTION_MARK_CURRENT &&
      action != ExternalCommandQueue.ACTION_MARK_PRAYER
    ) {
      return
    }

    val payload = when (action) {
      ExternalCommandQueue.ACTION_MARK_PRAYER -> {
        val prayerId = intent.getStringExtra(ExternalCommandQueue.EXTRA_PRAYER_ID) ?: return
        val date = intent.getStringExtra(ExternalCommandQueue.EXTRA_DATE) ?: return
        JSONObject()
          .put("type", "mark-prayer")
          .put("prayerId", prayerId)
          .put("date", date)
          .put("source", intent.getStringExtra("source") ?: "assistant")
      }
      else ->
        JSONObject()
          .put("type", "mark-current-obligatory")
          .put("source", intent.getStringExtra("source") ?: "assistant")
    }

    // The queue write also broadcasts COMMANDS_QUEUED, so a running JS instance drains
    // now; otherwise the next launch / foreground drains it. No service start here:
    // startService() from a background receiver throws on Android 8+.
    ExternalCommandQueue.append(context, payload)
  }
}
