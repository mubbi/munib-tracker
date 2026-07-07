import Foundation

/// App Group queue for external commands (Siri intents, watch, assistant).
enum ExternalCommandQueue {
  static let appGroup = "group.com.munibtracker.widgets"
  static let key = "pending_commands_v1"

  static func appendCommandJson(_ json: String) {
    guard let data = readRaw().data(using: .utf8),
          var array = (try? JSONSerialization.jsonObject(with: data) as? [String]) ?? [] else {
      writeRaw("[\(json)]")
      return
    }
    array.append(json)
    if array.count > 32 { array = Array(array.suffix(32)) }
    if let out = try? JSONSerialization.data(withJSONObject: array),
       let str = String(data: out, encoding: .utf8) {
      writeRaw(str)
    }
  }

  static func drainAll() -> [String] {
    let raw = readRaw()
    writeRaw("[]")
    guard let data = raw.data(using: .utf8),
          let array = try? JSONSerialization.jsonObject(with: data) as? [String] else {
      return []
    }
    return array
  }

  private static func readRaw() -> String {
    UserDefaults(suiteName: appGroup)?.string(forKey: key) ?? "[]"
  }

  private static func writeRaw(_ value: String) {
    UserDefaults(suiteName: appGroup)?.set(value, forKey: key)
  }
}
