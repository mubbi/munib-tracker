import ExpoModulesCore
import Foundation
import WatchConnectivity

private final class WatchBridge: NSObject, WCSessionDelegate {
  static let shared = WatchBridge()
  var onCommand: (() -> Void)?

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

    AsyncFunction("pushWearSnapshot") { (json: String) in
      // Wear snapshot push is implemented in the Android module (Wearable Data Layer).
      _ = json
    }
  }
}
