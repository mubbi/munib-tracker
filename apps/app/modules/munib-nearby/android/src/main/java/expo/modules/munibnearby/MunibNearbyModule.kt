package expo.modules.munibnearby

import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/**
 * NF-3.25 "Nearby join" on Android (D41). Foreground only, no GATT, no connections:
 * - host: `BluetoothLeAdvertiser` advertises ONE 128-bit service UUID (app prefix +
 *   the opaque nearby-session id), non-connectable, no device name, balanced
 *   interval, medium TX power (room-scale);
 * - joiner: `BluetoothLeScanner` with a hardware prefix filter (service UUID + mask),
 *   low-latency mode only while the "Join nearby" sheet is open.
 * Runtime permissions are requested by JS (`PermissionsAndroid`): Android 12+
 * `BLUETOOTH_SCAN` (neverForLocation) / `BLUETOOTH_ADVERTISE`; Android ≤ 11
 * scanning needs fine location + location services on. Everything stops on
 * request, after the timeout (≤ 10 min), when Bluetooth turns off and when the
 * activity goes to the background.
 */
class MunibNearbyModule : Module() {
  private var radio: NearbyRadio? = null

  private fun radio(): NearbyRadio {
    radio?.let { return it }
    val context = appContext.reactContext ?: throw Exceptions.ReactContextLost()
    return NearbyRadio(context.applicationContext) { name, body -> sendEvent(name, body) }
      .also { radio = it }
  }

  override fun definition() = ModuleDefinition {
    Name("MunibNearby")

    Events("onDiscovered", "onStateChange", "onStopped")

    Function("isSupported") { radio().isSupported() }

    Function("authorizationStatus") { radio().authorizationStatus() }

    Function("getState") { radio().state() }

    Function("locationServicesEnabled") { radio().locationServicesEnabled() }

    /** Android prompts from JS (PermissionsAndroid); this only reports the result. */
    AsyncFunction("requestAuthorization") { promise: Promise ->
      promise.resolve(radio().authorizationStatus())
    }

    AsyncFunction("startAdvertising") { serviceUuid: String, timeoutMs: Double, promise: Promise ->
      radio().startAdvertising(serviceUuid, timeoutMs.toLong(), promise)
    }.runOnQueue(Queues.MAIN)

    AsyncFunction("stopAdvertising") { radio?.stopAdvertising("requested") }
      .runOnQueue(Queues.MAIN)

    AsyncFunction("startScanning") { prefix: String, timeoutMs: Double, promise: Promise ->
      radio().startScanning(prefix, timeoutMs.toLong(), promise)
    }.runOnQueue(Queues.MAIN)

    AsyncFunction("stopScanning") { radio?.stopScanning("requested") }
      .runOnQueue(Queues.MAIN)

    OnActivityEntersBackground { radio?.stopAll("background") }

    OnDestroy {
      radio?.stopAll("destroyed")
      radio = null
    }
  }
}
