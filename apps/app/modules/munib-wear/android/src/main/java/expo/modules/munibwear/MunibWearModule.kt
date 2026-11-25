package expo.modules.munibwear

import android.content.Context
import android.content.Intent
import com.google.android.gms.wearable.DataEvent
import com.google.android.gms.wearable.DataEventBuffer
import com.google.android.gms.wearable.DataMapItem
import com.google.android.gms.wearable.MessageEvent
import com.google.android.gms.wearable.Wearable
import com.google.android.gms.wearable.WearableListenerService
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class MunibWearModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MunibWear")
  }
}

/**
 * Receives marks from the Wear OS app, tiles and complications via the Data Layer
 * (the manifest filters the paths):
 * - `/munib/mark/<uuid>` DataItems (current watch builds): an explicit Salah + day,
 *   delivered by the Data Layer whenever the watch reconnects. Each id is turned
 *   into the shared `MARK_PRAYER` broadcast once, then deleted; the watch takes the
 *   delete as the delivery receipt and stops showing "Will sync".
 * - `/munib/mark_current` messages from older watch builds.
 */
class MunibWearListenerService : WearableListenerService() {
  override fun onMessageReceived(messageEvent: MessageEvent) {
    if (messageEvent.path != MARK_CURRENT_PATH) return
    // Delegate to the shared ExternalCommandReceiver so the queue + JS notify stay in one place.
    sendBroadcast(
      Intent(ACTION_MARK_CURRENT)
        .setPackage(packageName)
        .putExtra(EXTRA_SOURCE, SOURCE_WEAR),
    )
  }

  override fun onDataChanged(dataEvents: DataEventBuffer) {
    val handled = mutableListOf<android.net.Uri>()
    for (event in dataEvents) {
      if (event.type != DataEvent.TYPE_CHANGED) continue
      val item = event.dataItem
      val path = item.uri.path ?: continue
      if (!path.startsWith(MARK_PATH_PREFIX)) continue
      val map = DataMapItem.fromDataItem(item).dataMap
      val prayerId = map.getString("prayerId").orEmpty()
      val date = map.getString("date").orEmpty()
      // The watch retries a queued mark under the same id: apply each id once.
      val markId = path.removePrefix(MARK_PATH_PREFIX)
      if (map.getString("type") == "mark-prayer" && prayerId.isNotEmpty() && date.isNotEmpty() &&
        firstDelivery(applicationContext, markId)
      ) {
        enqueueMarkPrayer(applicationContext, prayerId, date)
      }
      handled.add(item.uri)
    }
    // Applied (or malformed): remove so it isn't redelivered on the next sync.
    val client = Wearable.getDataClient(applicationContext)
    handled.forEach { uri ->
      try {
        client.deleteDataItems(uri)
      } catch (_: Exception) {
        /* Wearable API unavailable */
      }
    }
  }

  /** Remembers the last [SEEN_LIMIT] mark ids; false when [markId] was already applied. */
  @Synchronized
  private fun firstDelivery(context: Context, markId: String): Boolean {
    if (markId.isEmpty()) return true
    val prefs = context.getSharedPreferences(SEEN_PREFS, Context.MODE_PRIVATE)
    val seen = prefs.getString(SEEN_KEY, "").orEmpty().split(',').filter { it.isNotEmpty() }
    if (markId in seen) return false
    prefs.edit().putString(SEEN_KEY, (seen + markId).takeLast(SEEN_LIMIT).joinToString(",")).apply()
    return true
  }

  private fun enqueueMarkPrayer(context: Context, prayerId: String, date: String) {
    // ExternalCommandReceiver (munib-external-commands) queues it for the JS drain;
    // the JS handler ignores a Salah that is already marked or from another day.
    context.sendBroadcast(
      Intent(ACTION_MARK_PRAYER)
        .setPackage(context.packageName)
        .putExtra(EXTRA_PRAYER_ID, prayerId)
        .putExtra(EXTRA_DATE, date)
        .putExtra(EXTRA_SOURCE, SOURCE_WEAR),
    )
  }

  companion object {
    private const val MARK_CURRENT_PATH = "/munib/mark_current"
    private const val MARK_PATH_PREFIX = "/munib/mark/"
    private const val ACTION_MARK_CURRENT = "app.munibtracker.action.MARK_CURRENT"
    private const val ACTION_MARK_PRAYER = "app.munibtracker.action.MARK_PRAYER"
    private const val EXTRA_SOURCE = "source"
    private const val EXTRA_PRAYER_ID = "prayerId"
    private const val EXTRA_DATE = "date"
    private const val SOURCE_WEAR = "wear"
    private const val SEEN_PREFS = "munib_wear_marks_seen"
    private const val SEEN_KEY = "ids"
    private const val SEEN_LIMIT = 64
  }
}
