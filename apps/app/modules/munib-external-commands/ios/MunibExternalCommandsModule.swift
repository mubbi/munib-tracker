import ExpoModulesCore
import Foundation
import WatchConnectivity

private final class WatchBridge: NSObject, WCSessionDelegate {
  static let shared = WatchBridge()
  var onCommand: (() -> Void)?

  private static let snapshotKey = "widget_snapshot_v1"

  func activate() {
    guard WCSession.isSupported() else { return }
    let session = WCSession.default
    session.delegate = self
    session.activate()
  }

  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {}

  func sessionDidBecomeInactive(_ session: WCSession) {}

  func sessionDidDeactivate(_ session: WCSession) {
    session.activate()
  }

  func session(_ session: WCSession, didReceiveMessage message: [String: Any], replyHandler: @escaping ([String: Any]) -> Void) {
    enqueueFromWatchMessage(message)
    onCommand?()
    replyHandler(["ok": true])
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
  func pushSnapshot(_ json: String) {
    guard WCSession.isSupported() else { return }
    let session = WCSession.default
    guard session.activationState == .activated else { return }
    let payload: [String: Any] = [Self.snapshotKey: json]
    try? session.updateApplicationContext(payload)
    if session.isComplicationEnabled {
      session.transferCurrentComplicationUserInfo(payload)
    }
  }
}

public class MunibExternalCommandsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MunibExternalCommands")

    Events("onCommandsAvailable")

    OnCreate {
      WatchBridge.shared.onCommand = { [weak self] in
        self?.sendEvent("onCommandsAvailable")
      }
      WatchBridge.shared.activate()
      self.startObservingQueueWrites()
    }

    OnDestroy {
      self.stopObservingQueueWrites()
    }

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
