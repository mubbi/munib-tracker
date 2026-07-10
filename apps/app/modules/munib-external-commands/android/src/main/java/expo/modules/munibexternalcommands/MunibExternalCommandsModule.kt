package expo.modules.munibexternalcommands

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.json.JSONArray
import org.json.JSONObject

class MunibExternalCommandsModule : Module() {
  private val prefsName = "munib_external_commands"
  private val queueKey = "pending_commands_v1"

  override fun definition() = ModuleDefinition {
    Name("MunibExternalCommands")

    Events("onCommandsAvailable")

    AsyncFunction("enqueueCommand") { json: String ->
      appendCommandJson(json)
      sendEvent("onCommandsAvailable")
    }

    AsyncFunction("drainCommands") {
      drainAll()
    }

    AsyncFunction("pushWearSnapshot") { json: String ->
      WearSnapshotBridge.pushSnapshot(appContext.reactContext ?: return@AsyncFunction, json)
    }

    AsyncFunction("activateWatchSession") {
      // iOS-only; no-op on Android.
    }
  }

  private fun prefs(): SharedPreferences? {
    return appContext.reactContext?.getSharedPreferences(prefsName, Context.MODE_PRIVATE)
  }

  private fun appendCommandJson(json: String) {
    val p = prefs() ?: return
    val raw = p.getString(queueKey, "[]") ?: "[]"
    val array = try {
      JSONArray(raw)
    } catch (_: Exception) {
      JSONArray()
    }
    array.put(json)
    val trimmed = if (array.length() > 32) {
      JSONArray().apply {
        for (i in array.length() - 32 until array.length()) {
          put(array.get(i))
        }
      }
    } else {
      array
    }
    p.edit().putString(queueKey, trimmed.toString()).apply()
  }

  private fun drainAll(): List<String> {
    val p = prefs() ?: return emptyList()
    val raw = p.getString(queueKey, "[]") ?: "[]"
    p.edit().putString(queueKey, "[]").apply()
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

/** Receives Google Assistant / app-action broadcasts for background mark. */
class ExternalCommandReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    val action = intent.action ?: return
    if (action != ACTION_MARK_CURRENT && action != ACTION_MARK_PRAYER) return

    val prefs = context.getSharedPreferences("munib_external_commands", Context.MODE_PRIVATE)
    val payload = when (action) {
      ACTION_MARK_PRAYER -> {
        val prayerId = intent.getStringExtra(EXTRA_PRAYER_ID) ?: return
        val date = intent.getStringExtra(EXTRA_DATE) ?: return
        JSONObject()
          .put("type", "mark-prayer")
          .put("prayerId", prayerId)
          .put("date", date)
          .put("source", "assistant")
      }
      else ->
        JSONObject()
          .put("type", "mark-current-obligatory")
          .put("source", "assistant")
    }

    val raw = prefs.getString("pending_commands_v1", "[]") ?: "[]"
    val array = try {
      JSONArray(raw)
    } catch (_: Exception) {
      JSONArray()
    }
    array.put(payload.toString())
    prefs.edit().putString("pending_commands_v1", array.toString()).apply()

    val headless = Intent(context, ExternalCommandHeadlessService::class.java)
    context.startService(headless)
  }

  companion object {
    const val ACTION_MARK_CURRENT = "com.munibtracker.app.action.MARK_CURRENT"
    const val ACTION_MARK_PRAYER = "com.munibtracker.app.action.MARK_PRAYER"
    const val EXTRA_PRAYER_ID = "prayerId"
    const val EXTRA_DATE = "date"
  }
}
