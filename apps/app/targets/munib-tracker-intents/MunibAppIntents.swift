import AppIntents
import Foundation
import WidgetKit

private func enqueueOpenRoute(_ href: String) {
  let payload: [String: Any] = [
    "type": "open-route",
    "href": href,
    "source": "siri",
  ]
  if let data = try? JSONSerialization.data(withJSONObject: payload),
     let json = String(data: data, encoding: .utf8) {
    ExternalCommandQueue.appendCommandJson(json)
  }
}

struct MarkCurrentSalahIntent: AppIntent {
  static var title: LocalizedStringResource = "Mark my Salah"
  static var description = IntentDescription("Mark the current obligatory Salah as completed.")
  static var openAppWhenRun: Bool = false

  func perform() async throws -> some IntentResult & ProvidesDialog {
    let payload: [String: Any] = [
      "type": "mark-current-obligatory",
      "source": "siri",
    ]
    if let data = try? JSONSerialization.data(withJSONObject: payload),
       let json = String(data: data, encoding: .utf8) {
      ExternalCommandQueue.appendCommandJson(json)
      WidgetCenter.shared.reloadAllTimelines()
      return .result(dialog: "Salah marked in Munib Tracker.")
    }
    return .result(dialog: "Could not mark Salah. Open Munib Tracker and try again.")
  }
}

struct OpenChecklistIntent: AppIntent {
  static var title: LocalizedStringResource = "Open checklist"
  static var description = IntentDescription("Open today's Salah checklist.")
  static var openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult {
    enqueueOpenRoute("/tracker")
    return .result()
  }
}

struct OpenQiblaIntent: AppIntent {
  static var title: LocalizedStringResource = "Open Qibla"
  static var openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult {
    enqueueOpenRoute("/qibla")
    return .result()
  }
}

struct OpenTasbeehIntent: AppIntent {
  static var title: LocalizedStringResource = "Open Tasbeeh"
  static var openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult {
    enqueueOpenRoute("/tasbeeh/free")
    return .result()
  }
}

struct MunibShortcuts: AppShortcutsProvider {
  @AppShortcutsBuilder
  static var appShortcuts: [AppShortcut] {
    AppShortcut(
      intent: MarkCurrentSalahIntent(),
      phrases: [
        "Mark my Salah in \(.applicationName)",
        "Mark Salah in \(.applicationName)",
      ],
      shortTitle: "Mark Salah",
      systemImageName: "checkmark.circle"
    )
    AppShortcut(
      intent: OpenChecklistIntent(),
      phrases: ["Open checklist in \(.applicationName)"],
      shortTitle: "Checklist",
      systemImageName: "checklist"
    )
    AppShortcut(
      intent: OpenQiblaIntent(),
      phrases: ["Open Qibla in \(.applicationName)"],
      shortTitle: "Qibla",
      systemImageName: "location.north.line"
    )
    AppShortcut(
      intent: OpenTasbeehIntent(),
      phrases: ["Open Tasbeeh in \(.applicationName)"],
      shortTitle: "Tasbeeh",
      systemImageName: "hand.tap"
    )
  }
}