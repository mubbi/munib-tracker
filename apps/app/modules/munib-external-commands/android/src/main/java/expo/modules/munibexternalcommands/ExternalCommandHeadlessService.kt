package expo.modules.munibexternalcommands

import android.app.Service
import android.content.Intent
import android.os.IBinder

/**
 * Lightweight wake for the RN host to drain the command queue.
 * The actual processing happens in JS via useExternalCommandProcessor.
 */
class ExternalCommandHeadlessService : Service() {
  override fun onBind(intent: Intent?): IBinder? = null

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    stopSelf(startId)
    return START_NOT_STICKY
  }
}
