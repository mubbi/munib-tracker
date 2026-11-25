package expo.modules.munibwear

import com.google.android.gms.wearable.DataEvent
import com.google.android.gms.wearable.DataEventBuffer
import com.google.android.gms.wearable.DataMapItem
import com.google.android.gms.wearable.WearableListenerService

/**
 * Watch side: wakes when the phone pushes a new snapshot (manifest filters the
 * path) so tiles and complications refresh at once instead of at their next
 * freshness interval, and marks the phone has applied stop showing as pending.
 */
class WearSnapshotListenerService : WearableListenerService() {
  override fun onDataChanged(dataEvents: DataEventBuffer) {
    var latest: String? = null
    for (event in dataEvents) {
      if (event.type != DataEvent.TYPE_CHANGED) continue
      if (event.dataItem.uri.path != WearDataLayer.SNAPSHOT_PATH) continue
      // The buffer is released after this callback: read the payload now.
      latest = DataMapItem.fromDataItem(event.dataItem).dataMap.getString("snapshot") ?: latest
    }
    val snapshot = WearSnapshot.parse(latest) ?: return
    WearMarks.reconcile(applicationContext, snapshot)
    WearRefresh.requestAll(applicationContext)
  }
}
