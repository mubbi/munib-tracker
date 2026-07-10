package expo.modules.munibwear

import android.content.Context
import com.google.android.gms.wearable.MessageClient
import com.google.android.gms.wearable.MessageEvent
import com.google.android.gms.wearable.Wearable
import com.google.android.gms.wearable.WearableListenerService
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.json.JSONObject

class MunibWearModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MunibWear")
  }
}

/** Receives mark commands from the Wear OS tile via the Data Layer. */
class MunibWearListenerService : WearableListenerService(), MessageClient.OnMessageReceivedListener {
  override fun onMessageReceived(messageEvent: MessageEvent) {
    if (messageEvent.path != "/munib/mark_current") return
    enqueueMarkCurrent(applicationContext)
  }

  private fun enqueueMarkCurrent(context: Context) {
    val prefs = context.getSharedPreferences("munib_external_commands", Context.MODE_PRIVATE)
    val payload = JSONObject()
      .put("type", "mark-current-obligatory")
      .put("source", "wear")
    val raw = prefs.getString("pending_commands_v1", "[]") ?: "[]"
    val array = org.json.JSONArray(raw)
    array.put(payload.toString())
    prefs.edit().putString("pending_commands_v1", array.toString()).apply()
  }
}
