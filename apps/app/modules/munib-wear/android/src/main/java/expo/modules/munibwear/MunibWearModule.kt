package expo.modules.munibwear

import android.content.Context
import android.content.Intent
import com.google.android.gms.wearable.MessageClient
import com.google.android.gms.wearable.MessageEvent
import com.google.android.gms.wearable.WearableListenerService
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

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
    // Delegate to the shared ExternalCommandReceiver so the queue + JS notify stay in one place.
    val intent = Intent(ACTION_MARK_CURRENT)
      .setPackage(context.packageName)
      .putExtra(EXTRA_SOURCE, "wear")
    context.sendBroadcast(intent)
  }

  companion object {
    private const val ACTION_MARK_CURRENT = "app.munibtracker.action.MARK_CURRENT"
    private const val EXTRA_SOURCE = "source"
  }
}
