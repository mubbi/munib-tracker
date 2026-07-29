import AppIntents
import Foundation
import WidgetKit

// This file lives in `targets/munib-tracker-intents/_shared/` so
// `@bacons/apple-targets` compiles it into BOTH the main app target and the
// MunibTrackerIntents App Intents extension:
//
// - Apple requires the `AppShortcutsProvider` and every intent it references
//   to be compiled into the MAIN APP target (App Shortcuts metadata is
//   extracted from the app bundle; extension-only intents fail in the
//   Shortcuts app with "could not run because an internal error occurred").
// - The background mark intents are ALSO compiled into the App Intents
//   extension so Siri can run them without launching the app (per Apple's
//   guidance: share the source file between the app and the extension).
// - Foreground intents (`openAppWhenRun = true`) and the provider are
//   app-only: extensions cannot open the app. They are excluded from the
//   extension via the `MUNIB_INTENTS_EXTENSION` compilation condition
//   (added by `plugins/withAppIntentsExtensionDefine.cjs`).

// MARK: - Command queue helpers (app + extension)

private func enqueue(_ payload: [String: Any]) {
  if let data = try? JSONSerialization.data(withJSONObject: payload),
     let json = String(data: data, encoding: .utf8) {
    ExternalCommandQueue.appendCommandJson(json)
  }
}

/// Mirrors the `mark-prayer` command shape used by the widgets
/// (`WidgetDesign.swift`) and the watch (`MunibWatchApp.swift`).
private func enqueueMarkPrayer(_ prayerId: String) {
  enqueue([
    "type": "mark-prayer",
    "prayerId": prayerId,
    "date": ExternalCommandQueue.localDateString(),
    "source": "siri",
  ])
}

// MARK: - Salah parameter (AppEnum)

/// The five obligatory prayers as a Shortcuts-visible enum. Raw values match
/// the JS `ObligatoryPrayer` ids consumed by the external-command drain.
enum SalahOption: String, AppEnum {
  case fajr
  case dhuhr
  case asr
  case maghrib
  case isha

  static var typeDisplayRepresentation: TypeDisplayRepresentation = "Salah"

  static var caseDisplayRepresentations: [SalahOption: DisplayRepresentation] = [
    .fajr: "Fajr",
    .dhuhr: "Dhuhr",
    .asr: "Asr",
    .maghrib: "Maghrib",
    .isha: "Isha",
  ]

  var displayName: String {
    switch self {
    case .fajr: return "Fajr"
    case .dhuhr: return "Dhuhr"
    case .asr: return "Asr"
    case .maghrib: return "Maghrib"
    case .isha: return "Isha"
    }
  }
}

// MARK: - Background mark intents (app + extension)

struct MarkCurrentSalahIntent: AppIntent {
  static var title: LocalizedStringResource = "Mark my Salah"
  static var description = IntentDescription(
    "Mark the current obligatory Salah as completed.",
    categoryName: "Tracking"
  )
  static var openAppWhenRun: Bool = false

  func perform() async throws -> some IntentResult & ProvidesDialog {
    enqueue([
      "type": "mark-current-obligatory",
      "source": "siri",
    ])
    WidgetCenter.shared.reloadAllTimelines()
    return .result(dialog: "Salah marked in Munib Tracker.")
  }
}

/// One parameterized intent replaces the five per-prayer intents, per Apple's
/// App Intents guidance ("use parameters to configure a single intent for
/// different data" instead of near-identical intents).
struct MarkSalahIntent: AppIntent {
  static var title: LocalizedStringResource = "Mark a Salah"
  static var description = IntentDescription(
    "Mark a specific obligatory Salah as completed for today.",
    categoryName: "Tracking"
  )
  static var openAppWhenRun: Bool = false

  @Parameter(title: "Salah")
  var prayer: SalahOption

  static var parameterSummary: some ParameterSummary {
    Summary("Mark \(\.$prayer) as completed")
  }

  init() {}

  init(prayer: SalahOption) {
    self.prayer = prayer
  }

  func perform() async throws -> some IntentResult & ProvidesDialog {
    enqueueMarkPrayer(prayer.rawValue)
    WidgetCenter.shared.reloadAllTimelines()
    return .result(dialog: "\(prayer.displayName) marked in Munib Tracker.")
  }
}

#if !MUNIB_INTENTS_EXTENSION

// MARK: - Foreground navigation intents (app only)

private func enqueueOpenRoute(_ href: String) {
  enqueue([
    "type": "open-route",
    "href": href,
    "source": "siri",
  ])
}

struct OpenChecklistIntent: AppIntent {
  static var title: LocalizedStringResource = "Open checklist"
  static var description = IntentDescription(
    "Open today's Salah checklist.",
    categoryName: "Navigation"
  )
  static var openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult {
    enqueueOpenRoute("/tracker")
    return .result()
  }
}

struct OpenQiblaIntent: AppIntent {
  static var title: LocalizedStringResource = "Open Qibla"
  static var description = IntentDescription(
    "Open the Qibla compass.",
    categoryName: "Navigation"
  )
  static var openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult {
    enqueueOpenRoute("/qibla")
    return .result()
  }
}

struct OpenTasbeehIntent: AppIntent {
  static var title: LocalizedStringResource = "Open Tasbeeh"
  static var description = IntentDescription(
    "Open the Tasbeeh counter.",
    categoryName: "Navigation"
  )
  static var openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult {
    enqueueOpenRoute("/tasbeeh/free")
    return .result()
  }
}

struct OpenRamadanIntent: AppIntent {
  static var title: LocalizedStringResource = "Open Ramadan"
  static var description = IntentDescription(
    "Open Ramadan suhoor and iftar times.",
    categoryName: "Navigation"
  )
  static var openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult {
    enqueueOpenRoute("/ramadan")
    return .result()
  }
}

struct OpenKhatmIntent: AppIntent {
  static var title: LocalizedStringResource = "Open Khatm plan"
  static var description = IntentDescription(
    "Open the Qur'an Khatm reading plan.",
    categoryName: "Navigation"
  )
  static var openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult {
    enqueueOpenRoute("/quran/khatm")
    return .result()
  }
}

struct OpenQazaIntent: AppIntent {
  static var title: LocalizedStringResource = "Open Qaza"
  static var description = IntentDescription(
    "Open the Qaza make-up tracker.",
    categoryName: "Navigation"
  )
  static var openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult {
    enqueueOpenRoute("/qaza")
    return .result()
  }
}

struct OpenQuranIntent: AppIntent {
  static var title: LocalizedStringResource = "Open Qur'an"
  static var description = IntentDescription(
    "Open the Qur'an reader.",
    categoryName: "Navigation"
  )
  static var openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult {
    enqueueOpenRoute("/quran")
    return .result()
  }
}

// MARK: - App Shortcuts (app only — Apple limit: 10 per app)

struct MunibShortcuts: AppShortcutsProvider {
  static var shortcutTileColor: ShortcutTileColor = .teal

  @AppShortcutsBuilder
  static var appShortcuts: [AppShortcut] {
    AppShortcut(
      intent: MarkCurrentSalahIntent(),
      phrases: [
        "Mark my Salah in \(.applicationName)",
        "Mark Salah in \(.applicationName)",
        "Log my Salah in \(.applicationName)",
      ],
      shortTitle: "Mark Salah",
      systemImageName: "checkmark.circle"
    )
    AppShortcut(
      intent: MarkSalahIntent(),
      phrases: [
        "Mark \(\.$prayer) in \(.applicationName)",
        "Mark my \(\.$prayer) in \(.applicationName)",
        "Log \(\.$prayer) in \(.applicationName)",
      ],
      shortTitle: "Mark a Salah",
      systemImageName: "checkmark.circle.fill"
    )
    AppShortcut(
      intent: OpenChecklistIntent(),
      phrases: [
        "Open checklist in \(.applicationName)",
        "Show my checklist in \(.applicationName)",
      ],
      shortTitle: "Checklist",
      systemImageName: "checklist"
    )
    AppShortcut(
      intent: OpenQiblaIntent(),
      phrases: [
        "Open Qibla in \(.applicationName)",
        "Show Qibla direction in \(.applicationName)",
      ],
      shortTitle: "Qibla",
      systemImageName: "location.north.line"
    )
    AppShortcut(
      intent: OpenTasbeehIntent(),
      phrases: [
        "Open Tasbeeh in \(.applicationName)",
        "Start Tasbeeh in \(.applicationName)",
      ],
      shortTitle: "Tasbeeh",
      systemImageName: "hand.tap"
    )
    AppShortcut(
      intent: OpenQuranIntent(),
      phrases: [
        "Open Qur'an in \(.applicationName)",
        "Read Qur'an in \(.applicationName)",
      ],
      shortTitle: "Qur'an",
      systemImageName: "book"
    )
    AppShortcut(
      intent: OpenRamadanIntent(),
      phrases: [
        "Open Ramadan in \(.applicationName)",
        "Show suhoor and iftar in \(.applicationName)",
      ],
      shortTitle: "Ramadan",
      systemImageName: "moon.stars"
    )
    AppShortcut(
      intent: OpenKhatmIntent(),
      phrases: ["Open Khatm plan in \(.applicationName)"],
      shortTitle: "Khatm",
      systemImageName: "book.closed"
    )
    AppShortcut(
      intent: OpenQazaIntent(),
      phrases: [
        "Open Qaza in \(.applicationName)",
        "Show missed Salah in \(.applicationName)",
      ],
      shortTitle: "Qaza",
      systemImageName: "clock.arrow.circlepath"
    )
  }
}

#endif
