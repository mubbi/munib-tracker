package expo.modules.munibnearby

import android.Manifest
import android.annotation.SuppressLint
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothManager
import android.bluetooth.le.AdvertiseCallback
import android.bluetooth.le.AdvertiseData
import android.bluetooth.le.AdvertiseSettings
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanFilter
import android.bluetooth.le.ScanResult
import android.bluetooth.le.ScanSettings
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.location.LocationManager
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.ParcelUuid
import android.os.SystemClock
import androidx.core.content.ContextCompat
import androidx.core.location.LocationManagerCompat
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import java.util.UUID

/**
 * BLE advertise / scan state machine for NF-3.25. Every public method and every
 * callback runs on the main looper, so the fields need no locking.
 */
@SuppressLint("MissingPermission") // Each entry point checks its permission first.
internal class NearbyRadio(
  private val context: Context,
  private val emit: (String, Map<String, Any?>) -> Unit,
) {
  private val main = Handler(Looper.getMainLooper())
  private val manager = context.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
  private val adapter: BluetoothAdapter? get() = manager?.adapter

  private var advertiseCallback: AdvertiseCallback? = null
  private var advertising = false
  private var scanCallback: ScanCallback? = null
  private var scanPrefix: String? = null
  private val lastSeen = HashMap<String, Long>()
  private var receiverRegistered = false

  private val advertiseTimeout = Runnable { stopAdvertising("timeout") }
  private val scanTimeout = Runnable { stopScanning("timeout") }

  private val stateReceiver = object : BroadcastReceiver() {
    override fun onReceive(c: Context, intent: Intent) {
      val state = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE, BluetoothAdapter.ERROR)
      emit("onStateChange", mapOf("state" to describe(state)))
      if (state != BluetoothAdapter.STATE_ON) {
        if (advertiseCallback != null) stopAdvertising("bluetoothOff")
        if (scanCallback != null) stopScanning("bluetoothOff")
      }
    }
  }

  fun isSupported(): Boolean =
    adapter != null && context.packageManager.hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)

  /** Both roles granted (JS checks per role with PermissionsAndroid before starting). */
  fun authorizationStatus(): String =
    if (canAdvertise() && canScan()) "granted" else "denied"

  fun state(): String {
    val a = adapter ?: return "unsupported"
    return describe(a.state)
  }

  /** Android ≤ 11 delivers no scan results while location services are off. */
  fun locationServicesEnabled(): Boolean {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) return true
    val lm = context.getSystemService(Context.LOCATION_SERVICE) as? LocationManager ?: return false
    return LocationManagerCompat.isLocationEnabled(lm)
  }

  // ---------------------------------------------------------------------------
  // Advertising (host)
  // ---------------------------------------------------------------------------

  fun startAdvertising(serviceUuid: String, timeoutMs: Long, promise: Promise) {
    val a = adapter ?: return promise.reject(error("ERR_UNSUPPORTED", "Bluetooth LE isn't available"))
    if (!canAdvertise()) return promise.reject(error("ERR_PERMISSION", "Bluetooth permission not granted"))
    if (!a.isEnabled) return promise.reject(error("ERR_BLUETOOTH_OFF", "Bluetooth is off"))
    val advertiser = a.bluetoothLeAdvertiser
    if (advertiser == null || !a.isMultipleAdvertisementSupported) {
      return promise.reject(error("ERR_UNSUPPORTED", "This phone can't advertise over Bluetooth LE"))
    }
    val uuid = try {
      ParcelUuid.fromString(serviceUuid)
    } catch (_: IllegalArgumentException) {
      return promise.reject(error("ERR_INVALID", "Invalid service UUID"))
    }
    stopAdvertising("requested")

    val settings = AdvertiseSettings.Builder()
      .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_BALANCED)
      .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_MEDIUM)
      .setConnectable(false)
      .setTimeout(0) // our own timer: the platform caps setTimeout at 3 minutes
      .build()
    // Service UUID only: no device name, no TX power, no other data.
    val data = AdvertiseData.Builder()
      .addServiceUuid(uuid)
      .setIncludeDeviceName(false)
      .setIncludeTxPowerLevel(false)
      .build()

    val callback = object : AdvertiseCallback() {
      private var settled = false

      override fun onStartSuccess(settingsInEffect: AdvertiseSettings) {
        main.post {
          if (settled) return@post
          settled = true
          if (advertiseCallback === this) advertising = true
          promise.resolve(null)
        }
      }

      override fun onStartFailure(errorCode: Int) {
        main.post {
          if (advertiseCallback === this) {
            advertiseCallback = null
            advertising = false
            main.removeCallbacks(advertiseTimeout)
            releaseReceiverIfIdle()
          }
          if (!settled) {
            settled = true
            promise.reject(error("ERR_ADVERTISE", "Advertising failed ($errorCode)"))
          }
        }
      }
    }
    advertiseCallback = callback
    registerReceiver()
    try {
      advertiser.startAdvertising(settings, data, callback)
    } catch (e: SecurityException) {
      advertiseCallback = null
      releaseReceiverIfIdle()
      return promise.reject(error("ERR_PERMISSION", e.message ?: "Bluetooth permission not granted"))
    }
    main.postDelayed(advertiseTimeout, clampTimeout(timeoutMs))
  }

  fun stopAdvertising(reason: String) {
    main.removeCallbacks(advertiseTimeout)
    val callback = advertiseCallback ?: return
    val wasActive = advertising
    advertiseCallback = null
    advertising = false
    try {
      adapter?.bluetoothLeAdvertiser?.stopAdvertising(callback)
    } catch (_: Exception) {
      // Bluetooth already off / permission revoked: nothing left to stop.
    }
    releaseReceiverIfIdle()
    if (wasActive && reason != "requested") {
      emit("onStopped", mapOf("role" to "advertise", "reason" to reason))
    }
  }

  // ---------------------------------------------------------------------------
  // Scanning (joiner)
  // ---------------------------------------------------------------------------

  fun startScanning(prefix: String, timeoutMs: Long, promise: Promise) {
    val a = adapter ?: return promise.reject(error("ERR_UNSUPPORTED", "Bluetooth LE isn't available"))
    if (!canScan()) return promise.reject(error("ERR_PERMISSION", "Bluetooth permission not granted"))
    if (!a.isEnabled) return promise.reject(error("ERR_BLUETOOTH_OFF", "Bluetooth is off"))
    if (!locationServicesEnabled()) {
      return promise.reject(error("ERR_LOCATION_OFF", "Location services are off"))
    }
    val scanner = a.bluetoothLeScanner
      ?: return promise.reject(error("ERR_UNSUPPORTED", "Bluetooth LE scanning isn't available"))
    val normalized = prefix.lowercase()
    val prefixUuid = try {
      UUID.fromString("$normalized-0000-000000000000")
    } catch (_: IllegalArgumentException) {
      return promise.reject(error("ERR_INVALID", "Invalid service UUID prefix"))
    }
    stopScanning("requested")

    // Hardware-offloaded prefix match where the chipset supports masks; the
    // callback re-checks the prefix for chipsets that ignore it.
    val filter = ScanFilter.Builder()
      .setServiceUuid(ParcelUuid(prefixUuid), ParcelUuid.fromString(PREFIX_MASK))
      .build()
    val settings = ScanSettings.Builder()
      .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY) // foreground, short, user-initiated
      .setCallbackType(ScanSettings.CALLBACK_TYPE_ALL_MATCHES)
      .setReportDelay(0)
      .apply { if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) setLegacy(true) }
      .build()

    val callback = object : ScanCallback() {
      override fun onScanResult(callbackType: Int, result: ScanResult) {
        main.post { handle(result) }
      }

      override fun onBatchScanResults(results: MutableList<ScanResult>) {
        main.post { results.forEach { handle(it) } }
      }

      override fun onScanFailed(errorCode: Int) {
        main.post {
          if (scanCallback !== this) return@post
          scanCallback = null
          scanPrefix = null
          main.removeCallbacks(scanTimeout)
          releaseReceiverIfIdle()
          emit("onStopped", mapOf("role" to "scan", "reason" to "error", "code" to errorCode))
        }
      }
    }
    scanCallback = callback
    scanPrefix = normalized
    lastSeen.clear()
    registerReceiver()
    try {
      scanner.startScan(listOf(filter), settings, callback)
    } catch (e: SecurityException) {
      scanCallback = null
      scanPrefix = null
      releaseReceiverIfIdle()
      return promise.reject(error("ERR_PERMISSION", e.message ?: "Bluetooth permission not granted"))
    }
    main.postDelayed(scanTimeout, clampTimeout(timeoutMs))
    promise.resolve(null)
  }

  fun stopScanning(reason: String) {
    main.removeCallbacks(scanTimeout)
    val callback = scanCallback ?: return
    scanCallback = null
    scanPrefix = null
    try {
      adapter?.bluetoothLeScanner?.stopScan(callback)
    } catch (_: Exception) {
      // Bluetooth already off / permission revoked.
    }
    releaseReceiverIfIdle()
    if (reason != "requested") emit("onStopped", mapOf("role" to "scan", "reason" to reason))
  }

  private fun handle(result: ScanResult) {
    val prefix = scanPrefix ?: return
    val uuids = result.scanRecord?.serviceUuids ?: return
    val now = SystemClock.elapsedRealtime()
    for (parcel in uuids) {
      val value = parcel.uuid.toString().lowercase()
      if (!value.startsWith(prefix)) continue
      val last = lastSeen[value]
      if (last != null && now - last < REDISCOVER_MS) continue
      lastSeen[value] = now
      emit("onDiscovered", mapOf("serviceUuid" to value, "rssi" to result.rssi))
    }
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  fun stopAll(reason: String) {
    stopAdvertising(reason)
    stopScanning(reason)
  }

  private fun granted(permission: String): Boolean =
    ContextCompat.checkSelfPermission(context, permission) == PackageManager.PERMISSION_GRANTED

  private fun canAdvertise(): Boolean =
    Build.VERSION.SDK_INT < Build.VERSION_CODES.S || granted(Manifest.permission.BLUETOOTH_ADVERTISE)

  private fun canScan(): Boolean =
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      granted(Manifest.permission.BLUETOOTH_SCAN)
    } else {
      granted(Manifest.permission.ACCESS_FINE_LOCATION)
    }

  private fun registerReceiver() {
    if (receiverRegistered) return
    ContextCompat.registerReceiver(
      context,
      stateReceiver,
      IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED),
      ContextCompat.RECEIVER_NOT_EXPORTED,
    )
    receiverRegistered = true
  }

  private fun releaseReceiverIfIdle() {
    if (!receiverRegistered || advertiseCallback != null || scanCallback != null) return
    try {
      context.unregisterReceiver(stateReceiver)
    } catch (_: IllegalArgumentException) {
      // Already unregistered.
    }
    receiverRegistered = false
  }

  private fun clampTimeout(ms: Long): Long = ms.coerceIn(1_000L, MAX_RUN_MS)

  private fun error(code: String, message: String) = CodedException(code, message, null)

  companion object {
    /** Hard cap on any advertise / scan run (the session TTL). */
    private const val MAX_RUN_MS = 10L * 60L * 1000L
    /** Re-report the same beacon at most this often. */
    private const val REDISCOVER_MS = 1_000L
    /** Match bytes 0–7 (the app prefix); bytes 8–15 carry the session id. */
    private const val PREFIX_MASK = "ffffffff-ffff-ffff-0000-000000000000"

    fun describe(state: Int): String = when (state) {
      BluetoothAdapter.STATE_ON -> "poweredOn"
      BluetoothAdapter.STATE_OFF -> "poweredOff"
      BluetoothAdapter.STATE_TURNING_ON, BluetoothAdapter.STATE_TURNING_OFF -> "resetting"
      else -> "unknown"
    }
  }
}
