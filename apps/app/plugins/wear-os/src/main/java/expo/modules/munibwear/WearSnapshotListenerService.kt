package expo.modules.munibwear

import com.google.android.gms.wearable.CapabilityInfo
import com.google.android.gms.wearable.DataEvent
import com.google.android.gms.wearable.DataEventBuffer
import com.google.android.gms.wearable.DataMapItem
import com.google.android.gms.wearable.WearableListenerService

/**
 * Watch side (the manifest filters each event):
 * - a new phone snapshot: tiles and complications refresh at once instead of at their next
 *   freshness interval, and marks the phone has applied stop showing as pending;
 * - a `/munib/mark/<id>` DataItem deleted: the phone applied that mark (its delivery receipt);
 * - the phone app's `munib_phone_app` capability reachable again: retry queued marks.
 * Callbacks run on a background thread, so the bounded Data Layer calls are allowed here.
 */
class WearSnapshotListenerService : WearableListenerService() {
  override fun onDataChanged(dataEvents: DataEventBuffer) {
    var latest: String? = null
    val delivered = mutableListOf<String>()
    for (event in dataEvents) {
      val path = event.dataItem.uri.path ?: continue
      if (path.startsWith(WearDataLayer.MARK_PATH_PREFIX)) {
        // Our own writes arrive as TYPE_CHANGED too; only the phone's delete is a receipt.
        if (event.type == DataEvent.TYPE_DELETED) delivered.add(path.removePrefix(WearDataLayer.MARK_PATH_PREFIX))
        continue
      }
      if (event.type != DataEvent.TYPE_CHANGED || path != WearDataLayer.SNAPSHOT_PATH) continue
      // The buffer is released after this callback: read the payload now.
      latest = DataMapItem.fromDataItem(event.dataItem).dataMap.getString("snapshot") ?: latest
    }
    if (delivered.isNotEmpty()) WearMarks.acknowledge(applicationContext, delivered)
    val snapshot = WearSnapshot.parse(latest)
    if (snapshot != null) WearMarks.reconcile(applicationContext, snapshot)
    if (delivered.isEmpty() && snapshot == null) return
    WearDataLayer.syncMarks(applicationContext)
    WearRefresh.requestAll(applicationContext)
  }

  override fun onCapabilityChanged(capabilityInfo: CapabilityInfo) {
    if (capabilityInfo.nodes.isEmpty()) return
    // The phone is back: write anything still queued and refresh the "Will sync" surfaces.
    WearDataLayer.syncMarks(applicationContext)
    WearRefresh.requestAll(applicationContext)
  }
}
