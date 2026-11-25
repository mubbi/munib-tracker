import AppIntents
import Foundation
import SwiftUI
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

  static let typeDisplayRepresentation: TypeDisplayRepresentation = "Salah"

  static let caseDisplayRepresentations: [SalahOption: DisplayRepresentation] = [
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
  static let title: LocalizedStringResource = "Mark my Salah"
  static let description = IntentDescription(
    "Mark the current obligatory Salah as completed.",
    categoryName: "Tracking"
  )
  static let openAppWhenRun: Bool = false

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
  static let title: LocalizedStringResource = "Mark a Salah"
  static let description = IntentDescription(
    "Mark a specific obligatory Salah as completed for today.",
    categoryName: "Tracking"
  )
  static let openAppWhenRun: Bool = false

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

// MARK: - Answer intents (app + extension): Siri replies from the widget snapshot

/// Today's five obligatory times as a Siri / Shortcuts snippet (status + time).
struct SalahSnippetView: View {
  let snapshot: WidgetSnapshotPayload?
  let highlightId: String?

  var body: some View {
    let rows = snapshot?.schedule?.rows ?? []
    VStack(alignment: .leading, spacing: 6) {
      ForEach(Array(rows.enumerated()), id: \.offset) { _, row in
        HStack(spacing: 8) {
          Image(systemName: row.status == "completed" ? "checkmark.circle.fill" : (row.status == "active" ? "clock.fill" : "circle"))
            .foregroundStyle(row.status == "completed" ? Color.green : (row.status == "active" ? Color.accentColor : Color.secondary))
            .accessibilityHidden(true)
          Text(row.name)
            .font(row.id == highlightId ? .body.weight(.bold) : .body)
          Spacer(minLength: 8)
          Text(row.time)
            .font(.body.monospacedDigit())
            .foregroundStyle(row.id == highlightId ? Color.primary : Color.secondary)
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(row.name), \(row.time), \(row.statusLabel ?? "")")
      }
    }
    .padding()
    .environment(\.layoutDirection, snapshot?.isRtl == true ? .rightToLeft : .leftToRight)
  }
}

private enum SiriAnswer {
  static func noData(_ data: ResolvedWidgetData) -> String {
    data.extras?.strings?.openAppToSync ?? "Open Munib Tracker to sync today's Salah times."
  }

  static func hasTimes(_ data: ResolvedWidgetData) -> Bool {
    data.snapshot?.locationDenied != true && !(data.snapshot?.schedule?.rows ?? []).isEmpty
  }
}

/// "When is the next Salah in Munib Tracker?" — answered without opening the app.
struct NextSalahIntent: AppIntent {
  static let title: LocalizedStringResource = "Next Salah time"
  static let description = IntentDescription(
    "Say which Salah is next and when it begins.",
    categoryName: "Salah times"
  )
  static let openAppWhenRun: Bool = false

  func perform() async throws -> some IntentResult & ReturnsValue<String> & ProvidesDialog & ShowsSnippetView {
    let data = WidgetTimeResolver.load(at: Date())
    let next = data.snapshot?.nextPrayer
    guard SiriAnswer.hasTimes(data), let name = next?.prayerName, !name.isEmpty, name != "—",
          let time = next?.prayerTime, !time.isEmpty else {
      let text = SiriAnswer.noData(data)
      return .result(value: text, dialog: IntentDialog("\(text)"), view: SalahSnippetView(snapshot: nil, highlightId: nil))
    }
    let template = data.extras?.strings?.voiceNextSalah ?? "Next Salah is {{prayer}} at {{time}}."
    let text = WidgetTimeResolver.fill(template, prayer: name, time: time)
    return .result(
      value: text,
      dialog: IntentDialog("\(text)"),
      view: SalahSnippetView(snapshot: data.snapshot, highlightId: next?.prayerId)
    )
  }
}

/// "When is Asr in Munib Tracker?"
struct SalahTimeIntent: AppIntent {
  static let title: LocalizedStringResource = "Salah time"
  static let description = IntentDescription(
    "Say today's time for one obligatory Salah.",
    categoryName: "Salah times"
  )
  static let openAppWhenRun: Bool = false

  @Parameter(title: "Salah")
  var prayer: SalahOption

  static var parameterSummary: some ParameterSummary {
    Summary("Time of \(\.$prayer)")
  }

  init() {}

  init(prayer: SalahOption) {
    self.prayer = prayer
  }

  func perform() async throws -> some IntentResult & ReturnsValue<String> & ProvidesDialog & ShowsSnippetView {
    let data = WidgetTimeResolver.load(at: Date())
    guard SiriAnswer.hasTimes(data),
          let row = data.snapshot?.schedule?.rows?.first(where: { $0.id == prayer.rawValue }) else {
      let text = SiriAnswer.noData(data)
      return .result(value: text, dialog: IntentDialog("\(text)"), view: SalahSnippetView(snapshot: nil, highlightId: nil))
    }
    let template = data.extras?.strings?.voiceSalahTime ?? "{{prayer}} is at {{time}} today."
    let text = WidgetTimeResolver.fill(template, prayer: row.name, time: row.time)
    return .result(
      value: text,
      dialog: IntentDialog("\(text)"),
      view: SalahSnippetView(snapshot: data.snapshot, highlightId: row.id)
    )
  }
}

/// "How is my Salah today in Munib Tracker?" — progress + streak.
struct TodayProgressIntent: AppIntent {
  static let title: LocalizedStringResource = "Today's Salah progress"
  static let description = IntentDescription(
    "Say how many obligatory Salah are logged today and your streak.",
    categoryName: "Tracking"
  )
  static let openAppWhenRun: Bool = false

  func perform() async throws -> some IntentResult & ReturnsValue<String> & ProvidesDialog & ShowsSnippetView {
    let data = WidgetTimeResolver.load(at: Date())
    guard let snapshot = data.snapshot, let detail = snapshot.progress?.lockScreenDetail, !detail.isEmpty else {
      let text = SiriAnswer.noData(data)
      return .result(value: text, dialog: IntentDialog("\(text)"), view: SalahSnippetView(snapshot: nil, highlightId: nil))
    }
    var text = detail
    if let streakTitle = snapshot.streak?.title, let streak = snapshot.streak?.summary,
       (snapshot.streak?.streakDays ?? 0) > 0 {
      text += " \(streakTitle): \(streak)."
    }
    return .result(
      value: text,
      dialog: IntentDialog("\(text)"),
      view: SalahSnippetView(snapshot: SiriAnswer.hasTimes(data) ? snapshot : nil, highlightId: nil)
    )
  }
}

/// "Which way is the Qibla in Munib Tracker?" — the compass bearing from the snapshot.
struct QiblaDirectionIntent: AppIntent {
  static let title: LocalizedStringResource = "Qibla direction"
  static let description = IntentDescription(
    "Say the compass bearing toward the Kaaba from your saved location.",
    categoryName: "Salah times"
  )
  static let openAppWhenRun: Bool = false

  func perform() async throws -> some IntentResult & ReturnsValue<String> & ProvidesDialog {
    let data = WidgetTimeResolver.load(at: Date())
    guard data.snapshot?.locationDenied != true,
          let bearing = data.snapshot?.qibla?.bearingLabel, !bearing.isEmpty, bearing != "—" else {
      let text = SiriAnswer.noData(data)
      return .result(value: text, dialog: IntentDialog("\(text)"))
    }
    let hint = data.snapshot?.qibla?.lockScreenDetail ?? "Direction to the Kaaba"
    let text = "\(hint): \(bearing)"
    return .result(value: text, dialog: IntentDialog("\(text)"))
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
  static let title: LocalizedStringResource = "Open checklist"
  /// Superseded by `OpenFeatureIntent`; kept so saved Shortcuts keep working.
  static let isDiscoverable: Bool = false
  static let description = IntentDescription(
    "Open today's Salah checklist.",
    categoryName: "Navigation"
  )
  static let openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult {
    enqueueOpenRoute("/tracker")
    return .result()
  }
}

struct OpenQiblaIntent: AppIntent {
  static let title: LocalizedStringResource = "Open Qibla"
  /// Superseded by `OpenFeatureIntent`; kept so saved Shortcuts keep working.
  static let isDiscoverable: Bool = false
  static let description = IntentDescription(
    "Open the Qibla compass.",
    categoryName: "Navigation"
  )
  static let openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult {
    enqueueOpenRoute("/qibla")
    return .result()
  }
}

struct OpenTasbeehIntent: AppIntent {
  static let title: LocalizedStringResource = "Open Tasbeeh"
  /// Superseded by `OpenFeatureIntent`; kept so saved Shortcuts keep working.
  static let isDiscoverable: Bool = false
  static let description = IntentDescription(
    "Open the Tasbeeh counter.",
    categoryName: "Navigation"
  )
  static let openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult {
    enqueueOpenRoute("/tasbeeh/free")
    return .result()
  }
}

struct OpenRamadanIntent: AppIntent {
  static let title: LocalizedStringResource = "Open Ramadan"
  /// Superseded by `OpenFeatureIntent`; kept so saved Shortcuts keep working.
  static let isDiscoverable: Bool = false
  static let description = IntentDescription(
    "Open Ramadan suhoor and iftar times.",
    categoryName: "Navigation"
  )
  static let openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult {
    enqueueOpenRoute("/ramadan")
    return .result()
  }
}

struct OpenKhatmIntent: AppIntent {
  static let title: LocalizedStringResource = "Open Khatm plan"
  /// Superseded by `OpenFeatureIntent`; kept so saved Shortcuts keep working.
  static let isDiscoverable: Bool = false
  static let description = IntentDescription(
    "Open the Qur'an Khatm reading plan.",
    categoryName: "Navigation"
  )
  static let openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult {
    enqueueOpenRoute("/quran/khatm")
    return .result()
  }
}

struct OpenQazaIntent: AppIntent {
  static let title: LocalizedStringResource = "Open Qaza"
  /// Superseded by `OpenFeatureIntent`; kept so saved Shortcuts keep working.
  static let isDiscoverable: Bool = false
  static let description = IntentDescription(
    "Open the Qaza make-up tracker.",
    categoryName: "Navigation"
  )
  static let openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult {
    enqueueOpenRoute("/qaza")
    return .result()
  }
}

struct OpenQuranIntent: AppIntent {
  static let title: LocalizedStringResource = "Open Qur'an"
  /// Superseded by `OpenFeatureIntent`; kept so saved Shortcuts keep working.
  static let isDiscoverable: Bool = false
  static let description = IntentDescription(
    "Open the Qur'an reader.",
    categoryName: "Navigation"
  )
  static let openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult {
    enqueueOpenRoute("/quran")
    return .result()
  }
}

// MARK: - App Shortcuts (app only — Apple limit: 10 per app)

struct MunibShortcuts: AppShortcutsProvider {
  static let shortcutTileColor: ShortcutTileColor = .teal

  // Apple limit: 10 App Shortcuts per app, one parameter per phrase, and every
  // phrase names the app. Order = prominence in Spotlight / Shortcuts.
  @AppShortcutsBuilder
  static var appShortcuts: [AppShortcut] {
    AppShortcut(
      intent: MarkCurrentSalahIntent(),
      phrases: [
        "Mark my Salah in \(.applicationName)",
        "Mark Salah in \(.applicationName)",
        "Log my Salah in \(.applicationName)",
        "I prayed in \(.applicationName)",
      ],
      shortTitle: "Mark Salah",
      systemImageName: "checkmark.circle"
    )
    AppShortcut(
      intent: NextSalahIntent(),
      phrases: [
        "When is the next Salah in \(.applicationName)",
        "Next Salah in \(.applicationName)",
        "What time is the next Salah in \(.applicationName)",
      ],
      shortTitle: "Next Salah",
      systemImageName: "clock"
    )
    AppShortcut(
      intent: SalahTimeIntent(),
      phrases: [
        "When is \(\.$prayer) in \(.applicationName)",
        "What time is \(\.$prayer) in \(.applicationName)",
        "\(\.$prayer) time in \(.applicationName)",
      ],
      shortTitle: "Salah time",
      systemImageName: "clock.badge"
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
      intent: TodayProgressIntent(),
      phrases: [
        "How is my Salah today in \(.applicationName)",
        "Salah progress in \(.applicationName)",
        "What is my Salah streak in \(.applicationName)",
      ],
      shortTitle: "Today's progress",
      systemImageName: "chart.bar"
    )
    AppShortcut(
      intent: QiblaDirectionIntent(),
      phrases: [
        "Which way is the Qibla in \(.applicationName)",
        "Qibla direction in \(.applicationName)",
      ],
      shortTitle: "Qibla direction",
      systemImageName: "location.north.line"
    )
    AppShortcut(
      intent: OpenFeatureIntent(),
      phrases: [
        "Open \(\.$feature) in \(.applicationName)",
        "Show \(\.$feature) in \(.applicationName)",
        "Go to \(\.$feature) in \(.applicationName)",
      ],
      shortTitle: "Open a screen",
      systemImageName: "square.grid.2x2"
    )
  }
}

#endif
