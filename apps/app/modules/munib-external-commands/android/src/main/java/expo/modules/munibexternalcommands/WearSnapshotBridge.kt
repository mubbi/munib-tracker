package expo.modules.munibexternalcommands

import android.content.Context
import com.google.android.gms.wearable.PutDataMapRequest
import com.google.android.gms.wearable.Wearable

object WearSnapshotBridge {
  private const val SNAPSHOT_PATH = "/munib/widget_snapshot"

  fun pushSnapshot(context: Context, json: String) {
    try {
      val request = PutDataMapRequest.create(SNAPSHOT_PATH)
      request.dataMap.putString("snapshot", json)
      request.dataMap.putLong("updatedAt", System.currentTimeMillis())
      val putRequest = request.asPutDataRequest().setUrgent()
      Wearable.getDataClient(context).putDataItem(putRequest)
    } catch (_: Exception) {
      // Wearable API unavailable without Google Play Services / paired watch.
    }
  }
}
