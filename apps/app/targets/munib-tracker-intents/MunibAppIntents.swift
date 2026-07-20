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

/// Mirrors the `mark-prayer` command shape (`WidgetDesign.swift`'s `MarkNamedSalahIntent`)
/// for named-prayer Siri intents.
private func enqueueMarkPrayer(_ prayerId: String) {
  let formatter = ISO8601DateFormatter()
  formatter.formatOptions = [.withFullDate]
  let date = String(formatter.string(from: Date()).prefix(10))
  let payload: [String: Any] = [
    "type": "mark-prayer",
    "prayerId": prayerId,
    "date": date,
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

struct OpenRamadanIntent: AppIntent {
  static var title: LocalizedStringResource = "Open Ramadan"
  static var openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult {
    enqueueOpenRoute("/ramadan")
    return .result()
  }
}

struct OpenKhatmIntent: AppIntent {
  static var title: LocalizedStringResource = "Open Khatm plan"
  static var openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult {
    enqueueOpenRoute("/quran/khatm")
    return .result()
  }
}

struct OpenQazaIntent: AppIntent {
  static var title: LocalizedStringResource = "Open Qaza"
  static var openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult {
    enqueueOpenRoute("/qaza")
    return .result()
  }
}

struct OpenQuranIntent: AppIntent {
  static var title: LocalizedStringResource = "Open Qur'an"
  static var openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult {
    enqueueOpenRoute("/quran")
    return .result()
  }
}

struct MarkFajrIntent: AppIntent {
  static var title: LocalizedStringResource = "Mark Fajr"
  static var description = IntentDescription("Mark Fajr as completed.")
  static var openAppWhenRun: Bool = false

  func perform() async throws -> some IntentResult & ProvidesDialog {
    enqueueMarkPrayer("fajr")
    WidgetCenter.shared.reloadAllTimelines()
    return .result(dialog: "Fajr marked in Munib Tracker.")
  }
}

struct MarkDhuhrIntent: AppIntent {
  static var title: LocalizedStringResource = "Mark Dhuhr"
  static var description = IntentDescription("Mark Dhuhr as completed.")
  static var openAppWhenRun: Bool = false

  func perform() async throws -> some IntentResult & ProvidesDialog {
    enqueueMarkPrayer("dhuhr")
    WidgetCenter.shared.reloadAllTimelines()
    return .result(dialog: "Dhuhr marked in Munib Tracker.")
  }
}

struct MarkAsrIntent: AppIntent {
  static var title: LocalizedStringResource = "Mark Asr"
  static var description = IntentDescription("Mark Asr as completed.")
  static var openAppWhenRun: Bool = false

  func perform() async throws -> some IntentResult & ProvidesDialog {
    enqueueMarkPrayer("asr")
    WidgetCenter.shared.reloadAllTimelines()
    return .result(dialog: "Asr marked in Munib Tracker.")
  }
}

struct MarkMaghribIntent: AppIntent {
  static var title: LocalizedStringResource = "Mark Maghrib"
  static var description = IntentDescription("Mark Maghrib as completed.")
  static var openAppWhenRun: Bool = false

  func perform() async throws -> some IntentResult & ProvidesDialog {
    enqueueMarkPrayer("maghrib")
    WidgetCenter.shared.reloadAllTimelines()
    return .result(dialog: "Maghrib marked in Munib Tracker.")
  }
}

struct MarkIshaIntent: AppIntent {
  static var title: LocalizedStringResource = "Mark Isha"
  static var description = IntentDescription("Mark Isha as completed.")
  static var openAppWhenRun: Bool = false

  func perform() async throws -> some IntentResult & ProvidesDialog {
    enqueueMarkPrayer("isha")
    WidgetCenter.shared.reloadAllTimelines()
    return .result(dialog: "Isha marked in Munib Tracker.")
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
    AppShortcut(
      intent: OpenRamadanIntent(),
      phrases: ["Open Ramadan in \(.applicationName)"],
      shortTitle: "Ramadan",
      systemImageName: "moon.stars"
    )
    AppShortcut(
      intent: OpenKhatmIntent(),
      phrases: ["Open Khatm plan in \(.applicationName)"],
      shortTitle: "Khatm plan",
      systemImageName: "book.closed"
    )
    AppShortcut(
      intent: OpenQazaIntent(),
      phrases: ["Open Qaza in \(.applicationName)"],
      shortTitle: "Qaza",
      systemImageName: "clock.arrow.circlepath"
    )
    AppShortcut(
      intent: OpenQuranIntent(),
      phrases: ["Open Qur'an in \(.applicationName)"],
      shortTitle: "Qur'an",
      systemImageName: "book"
    )
    AppShortcut(
      intent: MarkFajrIntent(),
      phrases: [
        "Mark Fajr in \(.applicationName)",
        "Mark my Fajr in \(.applicationName)",
      ],
      shortTitle: "Mark Fajr",
      systemImageName: "sunrise"
    )
    AppShortcut(
      intent: MarkDhuhrIntent(),
      phrases: [
        "Mark Dhuhr in \(.applicationName)",
        "Mark my Dhuhr in \(.applicationName)",
      ],
      shortTitle: "Mark Dhuhr",
      systemImageName: "sun.max"
    )
    AppShortcut(
      intent: MarkAsrIntent(),
      phrases: [
        "Mark Asr in \(.applicationName)",
        "Mark my Asr in \(.applicationName)",
      ],
      shortTitle: "Mark Asr",
      systemImageName: "sun.min"
    )
    AppShortcut(
      intent: MarkMaghribIntent(),
      phrases: [
        "Mark Maghrib in \(.applicationName)",
        "Mark my Maghrib in \(.applicationName)",
      ],
      shortTitle: "Mark Maghrib",
      systemImageName: "sunset"
    )
    AppShortcut(
      intent: MarkIshaIntent(),
      phrases: [
        "Mark Isha in \(.applicationName)",
        "Mark my Isha in \(.applicationName)",
      ],
      shortTitle: "Mark Isha",
      systemImageName: "moon"
    )
  }
}