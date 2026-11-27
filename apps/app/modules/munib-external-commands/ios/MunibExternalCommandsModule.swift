import CryptoKit
import ExpoModulesCore
import Foundation
import WatchConnectivity

private final class WatchBridge: NSObject, WCSessionDelegate {
  static let shared = WatchBridge()
  var onCommand: (() -> Void)?

  private static let snapshotKey = "widget_snapshot_v1"
  /// SHA-256 of the complication-relevant part of the last snapshot handed to
  /// `transferCurrentComplicationUserInfo` (D64). Persisted so a relaunch doesn't
  /// spend a transfer on an unchanged snapshot.
  private static let complicationFingerprintKey = "munib.watch.complicationFingerprint.v1"
  /// Top-level snapshot sections the watch face complications read
  /// (`targets/munib-tracker-watch-widgets/PrayerComplications.swift`).
  private static let complicationSections = [
    "date", "locale", "isRtl", "locationDenied", "strings",
    "nextPrayer", "schedule", "progress", "streak", "qaza", "ramadan", "hijriDate",
  ]
  /// Countdown sections and their minute-ticking fields. A countdown-only change
  /// rides the latest-wins application context instead of the complication budget.
  private static let countdownSections: Set<String> = ["nextPrayer", "ramadan"]
  private static let countdownFields = ["countdownLabel", "minutesUntil", "lockScreenDetail", "accessibilityLabel"]

  func activate() {
    guard WCSession.isSupported() else { return }
    let session = WCSession.default
    session.delegate = self
    session.activate()
  }

  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {}

  func sessionDidBecomeInactive(_ session: WCSession) {}

  func sessionDidDeactivate(_ session: WCSession) {
    // Switched to another paired watch: its complications need a fresh transfer.
    UserDefaults.standard.removeObject(forKey: Self.complicationFingerprintKey)
    session.activate()
  }

  /// A failed complication transfer forgets its fingerprint so the next snapshot
  /// push retries it (unless a newer snapshot was already transferred).
  func session(_ session: WCSession, didFinish userInfoTransfer: WCSessionUserInfoTransfer, error: Error?) {
    guard error != nil, userInfoTransfer.isCurrentComplicationInfo,
          let json = userInfoTransfer.userInfo[Self.snapshotKey] as? String else { return }
    let defaults = UserDefaults.standard
    if defaults.string(forKey: Self.complicationFingerprintKey) == Self.complicationFingerprint(json) {
      defaults.removeObject(forKey: Self.complicationFingerprintKey)
    }
  }

  func session(_ session: WCSession, didReceiveMessage message: [String: Any], replyHandler: @escaping ([String: Any]) -> Void) {
    enqueueFromWatchMessage(message)
    onCommand?()
    replyHandler(["ok": true])
  }

  /// `sendMessage(_:replyHandler: nil, …)` is delivered here, not to the
  /// reply-handler variant above — without it, watch marks were dropped.
  func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
    enqueueFromWatchMessage(message)
    onCommand?()
  }

  /// Queued `transferUserInfo` fallback the watch uses when the phone isn't
  /// reachable (app backgrounded / not running) — delivered once it is.
  func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any] = [:]) {
    enqueueFromWatchMessage(userInfo)
    onCommand?()
  }

  private func enqueueFromWatchMessage(_ message: [String: Any]) {
    if let command = message["command"] as? String, command == "mark-prayer",
       let prayerId = message["prayerId"] as? String,
       let date = message["date"] as? String {
      let payload: [String: Any] = [
        "type": "mark-prayer",
        "prayerId": prayerId,
        "date": date,
        "source": "watch",
      ]
      if let data = try? JSONSerialization.data(withJSONObject: payload),
         let json = String(data: data, encoding: .utf8) {
        ExternalCommandQueue.appendCommandJson(json)
      }
    } else if let command = message["command"] as? String, command == "mark-current" {
      let payload: [String: Any] = [
        "type": "mark-current-obligatory",
        "source": "watch",
      ]
      if let data = try? JSONSerialization.data(withJSONObject: payload),
         let json = String(data: data, encoding: .utf8) {
        ExternalCommandQueue.appendCommandJson(json)
      }
    }
  }

  /// Mirror widget snapshot to the paired watch for the companion app + face complications.
  ///
  /// The application context (latest wins) carries every snapshot. The budgeted
  /// complication transfer (50/day while a complication is on the active face) is
  /// spent only when the complication-relevant payload changed since the last
  /// transfer and budget remains: at 0 the system would silently downgrade the call
  /// to a queued `transferUserInfo`, which duplicates the context we just sent.
  func pushSnapshot(_ json: String) {
    guard WCSession.isSupported() else { return }
    let session = WCSession.default
    guard session.activationState == .activated else { return }
    let payload: [String: Any] = [Self.snapshotKey: json]
    try? session.updateApplicationContext(payload)
    let defaults = UserDefaults.standard
    guard session.isComplicationEnabled else {
      defaults.removeObject(forKey: Self.complicationFingerprintKey)
      return
    }
    let fingerprint = Self.complicationFingerprint(json)
    guard defaults.string(forKey: Self.complicationFingerprintKey) != fingerprint else { return }
    // Out of budget: leave the fingerprint unset so a push after the daily reset retries.
    guard session.remainingComplicationUserInfoTransfers > 0 else { return }
    session.transferCurrentComplicationUserInfo(payload)
    defaults.set(fingerprint, forKey: Self.complicationFingerprintKey)
  }

  /// Stable hash of the sections the complications render, minus minute-ticking
  /// countdown text (and minus `updatedAt` / `updatedAgoLabel`, which no
  /// complication shows). Unparseable JSON hashes as-is.
  private static func complicationFingerprint(_ json: String) -> String {
    var relevant: [String: Any] = [:]
    if let data = json.data(using: .utf8),
       let root = (try? JSONSerialization.jsonObject(with: data)) as? [String: Any] {
      for key in complicationSections {
        guard let value = root[key] else { continue }
        if countdownSections.contains(key), var section = value as? [String: Any] {
          for field in countdownFields { section.removeValue(forKey: field) }
          relevant[key] = section
        } else {
          relevant[key] = value
        }
      }
    } else {
      relevant["raw"] = json
    }
    let canonical = (try? JSONSerialization.data(withJSONObject: relevant, options: [.sortedKeys]))
      ?? Data(json.utf8)
    return SHA256.hash(data: canonical).map { String(format: "%02x", $0) }.joined()
  }
}

public class MunibExternalCommandsModule: Module {
  // Expo Modules lifecycle hooks (SDK 58 replacements for the deprecated
  // `OnCreate` / `OnDestroy` DSL components).
  public override func didCreate() {
    WatchBridge.shared.onCommand = { [weak self] in
      self?.sendEvent("onCommandsAvailable")
    }
    WatchBridge.shared.activate()
    startObservingQueueWrites()
  }

  public override func willDestroy() {
    stopObservingQueueWrites()
  }

  public func definition() -> ModuleDefinition {
    Name("MunibExternalCommands")

    Events("onCommandsAvailable")

    AsyncFunction("activateWatchSession") {
      WatchBridge.shared.activate()
    }

    AsyncFunction("enqueueCommand") { (json: String) in
      ExternalCommandQueue.appendCommandJson(json)
      self.sendEvent("onCommandsAvailable")
    }

    AsyncFunction("drainCommands") { () -> [String] in
      ExternalCommandQueue.drainAll()
    }

    AsyncFunction("pushWatchSnapshot") { (json: String) in
      WatchBridge.shared.activate()
      WatchBridge.shared.pushSnapshot(json)
    }

    AsyncFunction("pushWearSnapshot") { (json: String) in
      // Wear snapshot push is implemented in the Android module (Wearable Data Layer).
      _ = json
    }
  }

  /// Siri (App Intents extension), widget buttons, and the watch bridge post a
  /// Darwin notification after writing `pending_commands_v1`. Observing it lets
  /// a running app instance drain and apply the mark immediately instead of
  /// waiting for the next foreground transition.
  private func startObservingQueueWrites() {
    let observer = Unmanaged.passUnretained(self).toOpaque()
    CFNotificationCenterAddObserver(
      CFNotificationCenterGetDarwinNotifyCenter(),
      observer,
      { _, observer, _, _, _ in
        guard let observer else { return }
        let module = Unmanaged<MunibExternalCommandsModule>.fromOpaque(observer).takeUnretainedValue()
        module.sendEvent("onCommandsAvailable")
      },
      ExternalCommandQueue.changedDarwinNotification as CFString,
      nil,
      .deliverImmediately
    )
  }

  private func stopObservingQueueWrites() {
    let observer = Unmanaged.passUnretained(self).toOpaque()
    CFNotificationCenterRemoveObserver(
      CFNotificationCenterGetDarwinNotifyCenter(),
      observer,
      CFNotificationName(ExternalCommandQueue.changedDarwinNotification as CFString),
      nil
    )
  }
}
