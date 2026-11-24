import CoreBluetooth
import ExpoModulesCore
import UIKit

/// NF-3.25 "Nearby join" on iOS (D41). Foreground only, no GATT, no connections:
/// - host: `CBPeripheralManager` advertises ONE 128-bit service UUID (app prefix +
///   the opaque nearby-session id) — no local name, no other data;
/// - joiner: `CBCentralManager` scans while the "Join nearby" sheet is open and
///   reports service UUIDs that start with the app prefix.
/// Both stop on request, after the timeout (≤ 10 min), when Bluetooth turns off,
/// and when the app enters the background (no `bluetooth-*` background modes, per
/// Apple's Core Bluetooth background guidance). Managers are created lazily, so
/// the system permission prompt only appears after the in-app rationale.
public class MunibNearbyModule: Module {
  private lazy var radio = NearbyRadio { [weak self] name, body in
    self?.sendEvent(name, body)
  }
  private var backgroundObserver: NSObjectProtocol?

  // Expo Modules lifecycle hooks (SDK 58 replacements for the deprecated
  // `OnCreate` / `OnDestroy` / `OnAppEntersBackground` DSL components).
  public override func didCreate() {
    // No bluetooth-* background modes: leaving the foreground stops everything.
    backgroundObserver = NotificationCenter.default.addObserver(
      forName: UIApplication.didEnterBackgroundNotification, object: nil, queue: .main
    ) { [weak self] _ in
      self?.radio.stopAll(reason: "background")
    }
  }

  public override func willDestroy() {
    if let observer = backgroundObserver {
      NotificationCenter.default.removeObserver(observer)
      backgroundObserver = nil
    }
    let radio = self.radio
    DispatchQueue.main.async { radio.stopAll(reason: "destroyed") }
  }

  public func definition() -> ModuleDefinition {
    Name("MunibNearby")

    Events("onDiscovered", "onStateChange", "onStopped")

    Function("isSupported") { () -> Bool in
      return true
    }

    Function("authorizationStatus") { () -> String in
      return NearbyRadio.authorizationStatus()
    }

    Function("getState") { () -> String in
      return self.radio.state()
    }

    /// Location services never gate BLE on iOS.
    Function("locationServicesEnabled") { () -> Bool in
      return true
    }

    AsyncFunction("requestAuthorization") { (promise: Promise) in
      self.radio.requestAuthorization { promise.resolve($0) }
    }.runOnQueue(.main)

    AsyncFunction("startAdvertising") { (serviceUuid: String, timeoutMs: Double, promise: Promise) in
      self.radio.startAdvertising(uuid: serviceUuid, timeoutMs: timeoutMs) { error in
        if let error = error {
          promise.reject(error.code, error.message)
        } else {
          promise.resolve(nil)
        }
      }
    }.runOnQueue(.main)

    AsyncFunction("stopAdvertising") {
      self.radio.stopAdvertising(reason: "requested")
    }.runOnQueue(.main)

    AsyncFunction("startScanning") { (prefix: String, timeoutMs: Double, promise: Promise) in
      self.radio.startScanning(prefix: prefix, timeoutMs: timeoutMs) { error in
        if let error = error {
          promise.reject(error.code, error.message)
        } else {
          promise.resolve(nil)
        }
      }
    }.runOnQueue(.main)

    AsyncFunction("stopScanning") {
      self.radio.stopScanning(reason: "requested")
    }.runOnQueue(.main)
  }
}

struct NearbyError {
  let code: String
  let message: String
}

/// All state lives on the main queue (the managers are created with `queue: .main`).
final class NearbyRadio: NSObject, CBCentralManagerDelegate, CBPeripheralManagerDelegate {
  /// Hard cap on any advertise / scan run (the session TTL).
  private static let maxRunMs: Double = 10 * 60 * 1000
  /// Re-report the same beacon at most this often (we scan with duplicates on).
  private static let rediscoverInterval: TimeInterval = 1.0

  private let emit: (String, [String: Any]) -> Void
  private var central: CBCentralManager?
  private var peripheral: CBPeripheralManager?
  private var authWaiters: [(String) -> Void] = []

  private var pendingAdvert: CBUUID?
  private var pendingAdvertDone: ((NearbyError?) -> Void)?
  private var advertising = false
  private var advertTimer: DispatchWorkItem?

  private var scanPrefix: String?
  private var pendingScanDone: ((NearbyError?) -> Void)?
  private var scanning = false
  private var scanTimer: DispatchWorkItem?
  private var lastSeen: [String: TimeInterval] = [:]

  init(emit: @escaping (String, [String: Any]) -> Void) {
    self.emit = emit
    super.init()
  }

  // MARK: Authorization / state

  static func authorizationStatus() -> String {
    switch CBManager.authorization {
    case .allowedAlways: return "granted"
    case .notDetermined: return "notDetermined"
    default: return "denied"  // .denied, .restricted
    }
  }

  static func describe(_ state: CBManagerState) -> String {
    switch state {
    case .poweredOn: return "poweredOn"
    case .poweredOff: return "poweredOff"
    case .unauthorized: return "unauthorized"
    case .unsupported: return "unsupported"
    case .resetting: return "resetting"
    default: return "unknown"
    }
  }

  private static func error(for state: CBManagerState) -> NearbyError {
    switch state {
    case .unauthorized: return NearbyError(code: "ERR_PERMISSION", message: "Bluetooth permission denied")
    case .unsupported: return NearbyError(code: "ERR_UNSUPPORTED", message: "Bluetooth LE isn't supported")
    default: return NearbyError(code: "ERR_BLUETOOTH_OFF", message: "Bluetooth is off")
    }
  }

  /// Never creates a manager before permission was granted (that would prompt).
  func state() -> String {
    switch Self.authorizationStatus() {
    case "granted": return Self.describe(ensureCentral().state)
    case "denied": return "unauthorized"
    default: return "unknown"
    }
  }

  func requestAuthorization(_ done: @escaping (String) -> Void) {
    let status = Self.authorizationStatus()
    if status != "notDetermined" {
      done(status == "granted" ? "granted" : "denied")
      return
    }
    authWaiters.append(done)
    _ = ensureCentral()  // shows the system prompt
  }

  private func ensureCentral() -> CBCentralManager {
    if let central = central { return central }
    let manager = CBCentralManager(
      delegate: self, queue: .main,
      options: [CBCentralManagerOptionShowPowerAlertKey: false])
    central = manager
    return manager
  }

  private func ensurePeripheral() -> CBPeripheralManager {
    if let peripheral = peripheral { return peripheral }
    let manager = CBPeripheralManager(
      delegate: self, queue: .main,
      options: [CBPeripheralManagerOptionShowPowerAlertKey: false])
    peripheral = manager
    return manager
  }

  private func schedule(_ timeoutMs: Double, _ block: @escaping () -> Void) -> DispatchWorkItem {
    let item = DispatchWorkItem(block: block)
    let ms = min(max(timeoutMs, 1000), Self.maxRunMs)
    DispatchQueue.main.asyncAfter(deadline: .now() + ms / 1000, execute: item)
    return item
  }

  private func resolveAuthWaiters() {
    guard CBManager.authorization != .notDetermined, !authWaiters.isEmpty else { return }
    let result = CBManager.authorization == .allowedAlways ? "granted" : "denied"
    let waiters = authWaiters
    authWaiters = []
    waiters.forEach { $0(result) }
  }

  // MARK: Advertising (host)

  func startAdvertising(uuid: String, timeoutMs: Double, done: @escaping (NearbyError?) -> Void) {
    guard Self.authorizationStatus() == "granted" else {
      done(NearbyError(code: "ERR_PERMISSION", message: "Bluetooth permission not granted"))
      return
    }
    guard let parsed = UUID(uuidString: uuid) else {
      done(NearbyError(code: "ERR_INVALID", message: "Invalid service UUID"))
      return
    }
    stopAdvertising(reason: "requested")
    pendingAdvert = CBUUID(nsuuid: parsed)
    pendingAdvertDone = done
    advertTimer = schedule(timeoutMs) { [weak self] in self?.stopAdvertising(reason: "timeout") }
    let manager = ensurePeripheral()
    switch manager.state {
    case .poweredOn: beginAdvertising()
    case .unknown, .resetting: break  // peripheralManagerDidUpdateState continues
    default: failPendingAdvert(Self.error(for: manager.state))
    }
  }

  private func beginAdvertising() {
    guard let uuid = pendingAdvert, let manager = peripheral else { return }
    // Service UUID only: no local name (the device name never leaves the phone).
    manager.startAdvertising([CBAdvertisementDataServiceUUIDsKey: [uuid]])
  }

  private func failPendingAdvert(_ error: NearbyError) {
    advertTimer?.cancel()
    advertTimer = nil
    pendingAdvert = nil
    let done = pendingAdvertDone
    pendingAdvertDone = nil
    done?(error)
  }

  func stopAdvertising(reason: String) {
    advertTimer?.cancel()
    advertTimer = nil
    if pendingAdvertDone != nil {
      let done = pendingAdvertDone
      pendingAdvertDone = nil
      pendingAdvert = nil
      done?(NearbyError(code: "ERR_CANCELLED", message: "Advertising cancelled"))
    }
    let wasActive = advertising
    advertising = false
    if peripheral?.isAdvertising == true { peripheral?.stopAdvertising() }
    if wasActive && reason != "requested" {
      emit("onStopped", ["role": "advertise", "reason": reason])
    }
  }

  func peripheralManagerDidStartAdvertising(_ peripheral: CBPeripheralManager, error: Error?) {
    guard pendingAdvertDone != nil else { return }
    if let error = error {
      failPendingAdvert(NearbyError(code: "ERR_ADVERTISE", message: error.localizedDescription))
      return
    }
    advertising = true
    pendingAdvert = nil
    let done = pendingAdvertDone
    pendingAdvertDone = nil
    done?(nil)
  }

  func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
    resolveAuthWaiters()
    emit("onStateChange", ["state": Self.describe(peripheral.state)])
    switch peripheral.state {
    case .poweredOn:
      if pendingAdvert != nil { beginAdvertising() }
    case .unknown, .resetting:
      break
    default:
      if pendingAdvertDone != nil { failPendingAdvert(Self.error(for: peripheral.state)) }
      if advertising { stopAdvertising(reason: "bluetoothOff") }
    }
  }

  // MARK: Scanning (joiner)

  func startScanning(prefix: String, timeoutMs: Double, done: @escaping (NearbyError?) -> Void) {
    guard Self.authorizationStatus() == "granted" else {
      done(NearbyError(code: "ERR_PERMISSION", message: "Bluetooth permission not granted"))
      return
    }
    stopScanning(reason: "requested")
    scanPrefix = prefix.lowercased()
    lastSeen = [:]
    scanTimer = schedule(timeoutMs) { [weak self] in self?.stopScanning(reason: "timeout") }
    let manager = ensureCentral()
    switch manager.state {
    case .poweredOn:
      beginScan()
      done(nil)
    case .unknown, .resetting:
      pendingScanDone = done  // centralManagerDidUpdateState continues
    default:
      failPendingScan(Self.error(for: manager.state), done)
    }
  }

  private func beginScan() {
    guard scanPrefix != nil, let manager = central else { return }
    // The session id lives in the UUID itself, so we can't filter by one known
    // service UUID; scanning with `nil` services is allowed in the foreground,
    // and duplicates let the sheet drop phones that walked away.
    manager.scanForPeripherals(
      withServices: nil, options: [CBCentralManagerScanOptionAllowDuplicatesKey: true])
    scanning = true
  }

  private func failPendingScan(_ error: NearbyError, _ done: ((NearbyError?) -> Void)?) {
    scanTimer?.cancel()
    scanTimer = nil
    scanPrefix = nil
    done?(error)
  }

  func stopScanning(reason: String) {
    scanTimer?.cancel()
    scanTimer = nil
    if let done = pendingScanDone {
      pendingScanDone = nil
      done(NearbyError(code: "ERR_CANCELLED", message: "Scan cancelled"))
    }
    let wasActive = scanning
    scanning = false
    scanPrefix = nil
    if central?.isScanning == true { central?.stopScan() }
    if wasActive && reason != "requested" {
      emit("onStopped", ["role": "scan", "reason": reason])
    }
  }

  func centralManagerDidUpdateState(_ central: CBCentralManager) {
    resolveAuthWaiters()
    emit("onStateChange", ["state": Self.describe(central.state)])
    switch central.state {
    case .poweredOn:
      if let done = pendingScanDone {
        pendingScanDone = nil
        beginScan()
        done(nil)
      }
    case .unknown, .resetting:
      break
    default:
      if let done = pendingScanDone {
        pendingScanDone = nil
        failPendingScan(Self.error(for: central.state), done)
      }
      if scanning { stopScanning(reason: "bluetoothOff") }
    }
  }

  func centralManager(
    _ central: CBCentralManager, didDiscover peripheral: CBPeripheral,
    advertisementData: [String: Any], rssi RSSI: NSNumber
  ) {
    guard let prefix = scanPrefix else { return }
    let uuids =
      (advertisementData[CBAdvertisementDataServiceUUIDsKey] as? [CBUUID] ?? [])
      + (advertisementData[CBAdvertisementDataOverflowServiceUUIDsKey] as? [CBUUID] ?? [])
    let now = Date().timeIntervalSince1970
    for uuid in uuids {
      let value = uuid.uuidString.lowercased()
      guard value.hasPrefix(prefix) else { continue }
      if let last = lastSeen[value], now - last < Self.rediscoverInterval { continue }
      lastSeen[value] = now
      emit("onDiscovered", ["serviceUuid": value, "rssi": RSSI.intValue])
    }
  }

  // MARK: Lifecycle

  func stopAll(reason: String) {
    stopAdvertising(reason: reason)
    stopScanning(reason: reason)
  }
}
