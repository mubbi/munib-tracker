package expo.modules.munibexternalcommands

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.SharedPreferences
import android.os.Build
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
      val filter = IntentFilter(ExternalCommandQueue.ACTION_COMMANDS_QUEUED)
      val reactContext = appContext.reactContext ?: return@OnCreate
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        reactContext.registerReceiver(receiver, filter, Context.RECEIVER_NOT_EXPORTED)
      } else {
        @Suppress("UnspecifiedRegisterReceiverFlag")
        reactContext.registerReceiver(receiver, filter)
      }
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

    AsyncFunction("activateWatchSession") {
      // iOS-only; no-op on Android.
    }
  }
}

/** Receives Google Assistant / app-action / Wear broadcasts for background mark. */
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

    ExternalCommandQueue.append(context, payload)

    val headless = Intent(context, ExternalCommandHeadlessService::class.java)
    context.startService(headless)
  }
}
