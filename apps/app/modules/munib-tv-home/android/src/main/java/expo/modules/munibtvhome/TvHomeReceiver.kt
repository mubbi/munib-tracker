package expo.modules.munibtvhome

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.tvprovider.media.tv.TvContractCompat

/**
 * - `INITIALIZE_PROGRAMS`: the TV launcher asks a freshly installed app for its
 *   default channel.
 * - `BOOT_COMPLETED`: alarms are lost on reboot.
 * - [TvHomeChannelPublisher.ACTION_REFRESH]: a validity window ended (next Salah, …).
 *
 * All of them re-publish the stored payload off the main thread.
 */
class TvHomeReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    when (intent.action) {
      TvContractCompat.ACTION_INITIALIZE_PROGRAMS,
      Intent.ACTION_BOOT_COMPLETED,
      TvHomeChannelPublisher.ACTION_REFRESH -> {
        val pending = goAsync()
        val appContext = context.applicationContext
        Thread {
          try {
            TvHomeChannelPublisher.publishStored(appContext)
          } finally {
            pending.finish()
          }
        }.start()
      }
    }
  }
}
