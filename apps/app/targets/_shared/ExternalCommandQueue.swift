import Foundation

/// App Group queue for external commands (Siri intents, watch, assistant).
/// Also compiled into the `munib-external-commands` pod via a symlink in
/// `modules/munib-external-commands/ios/`.
enum ExternalCommandQueue {
  static let appGroup = "group.app.munibtracker.widgets"
  static let key = "pending_commands_v1"
  /// Darwin (cross-process) notification posted after every queue write so a
  /// running app instance drains immediately (Siri extension, widget buttons,
  /// watch bridge). Observed by `MunibExternalCommandsModule`.
  static let changedDarwinNotification = "app.munibtracker.commands.changed"

  static func appendCommandJson(_ json: String) {
    defer { notifyChanged() }
    guard let data = readRaw().data(using: .utf8),
          var array = try? JSONSerialization.jsonObject(with: data) as? [String] else {
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

  /// Local calendar date (yyyy-MM-dd) for `mark-prayer` commands. Must match
  /// the JS tracker's local "today" — `ISO8601DateFormatter` defaults to UTC,
  /// which flips the date around midnight in non-UTC timezones.
  static func localDateString(_ date: Date = Date()) -> String {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withFullDate]
    formatter.timeZone = .current
    return String(formatter.string(from: date).prefix(10))
  }

  private static func notifyChanged() {
    CFNotificationCenterPostNotification(
      CFNotificationCenterGetDarwinNotifyCenter(),
      CFNotificationName(changedDarwinNotification as CFString),
      nil,
      nil,
      true
    )
  }

  private static func readRaw() -> String {
    UserDefaults(suiteName: appGroup)?.string(forKey: key) ?? "[]"
  }

  private static func writeRaw(_ value: String) {
    UserDefaults(suiteName: appGroup)?.set(value, forKey: key)
  }
}
