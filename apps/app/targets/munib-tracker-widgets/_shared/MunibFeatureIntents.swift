import AppIntents
import Foundation

// Compiled into BOTH the main app and the widget extension
// (`targets/munib-tracker-widgets/_shared`, @bacons/apple-targets): a control
// whose intent opens the app must have that intent in both targets, and Siri's
// `AppShortcutsProvider` (main app) uses the same intent for "Open … in Munib
// Tracker". The App Intents extension does not compile this folder — it cannot
// open the app anyway.

/// Screens reachable by voice and from Control Center. `href` values mirror the
/// JS intent registry (`src/lib/appSurfaces/intents/registry.ts`).
enum MunibFeature: String, AppEnum {
  case checklist
  case qibla
  case tasbeeh
  case quran
  case adhkar
  case duas
  case ramadan
  case khatm
  case qaza
  case calendar
  case events
  case dailyHadith
  case statistics
  case jumuah

  static let typeDisplayRepresentation: TypeDisplayRepresentation = "Screen"

  static let caseDisplayRepresentations: [MunibFeature: DisplayRepresentation] = [
    .checklist: DisplayRepresentation(title: "Checklist", image: .init(systemName: "checklist")),
    .qibla: DisplayRepresentation(title: "Qibla", image: .init(systemName: "location.north.line")),
    .tasbeeh: DisplayRepresentation(title: "Tasbeeh", image: .init(systemName: "hand.tap")),
    .quran: DisplayRepresentation(title: "Qur'an", image: .init(systemName: "book")),
    .adhkar: DisplayRepresentation(title: "Adhkar", image: .init(systemName: "sparkles")),
    .duas: DisplayRepresentation(title: "Duas", image: .init(systemName: "hands.sparkles")),
    .ramadan: DisplayRepresentation(title: "Ramadan", image: .init(systemName: "moon.stars")),
    .khatm: DisplayRepresentation(title: "Khatm plan", image: .init(systemName: "book.closed")),
    .qaza: DisplayRepresentation(title: "Qaza", image: .init(systemName: "clock.arrow.circlepath")),
    .calendar: DisplayRepresentation(title: "Islamic calendar", image: .init(systemName: "calendar")),
    .events: DisplayRepresentation(title: "Islamic events", image: .init(systemName: "star.circle")),
    .dailyHadith: DisplayRepresentation(title: "Daily hadith", image: .init(systemName: "text.quote")),
    .statistics: DisplayRepresentation(title: "Statistics", image: .init(systemName: "chart.bar")),
    .jumuah: DisplayRepresentation(title: "Jumu'ah", image: .init(systemName: "building.columns")),
  ]

  var href: String {
    switch self {
    case .checklist: return "/tracker"
    case .qibla: return "/qibla"
    case .tasbeeh: return "/tasbeeh/free"
    case .quran: return "/quran"
    case .adhkar: return "/zikr"
    case .duas: return "/dua"
    case .ramadan: return "/ramadan"
    case .khatm: return "/quran/khatm"
    case .qaza: return "/qaza"
    case .calendar: return "/calendar"
    case .events: return "/events"
    case .dailyHadith: return "/hadith/daily"
    case .statistics: return "/statistics"
    case .jumuah: return "/friday"
    }
  }

  var symbol: String {
    switch self {
    case .checklist: return "checklist"
    case .qibla: return "location.north.line"
    case .tasbeeh: return "hand.tap"
    case .quran: return "book"
    case .adhkar: return "sparkles"
    case .duas: return "hands.sparkles"
    case .ramadan: return "moon.stars"
    case .khatm: return "book.closed"
    case .qaza: return "clock.arrow.circlepath"
    case .calendar: return "calendar"
    case .events: return "star.circle"
    case .dailyHadith: return "text.quote"
    case .statistics: return "chart.bar"
    case .jumuah: return "building.columns"
    }
  }

  var title: LocalizedStringResource {
    Self.caseDisplayRepresentations[self]?.title ?? "Munib Tracker"
  }
}

/// One parameterized "open a screen" intent (Apple: parameters instead of
/// near-identical intents), shared by Siri and the Control Center control.
struct OpenFeatureIntent: AppIntent {
  static let title: LocalizedStringResource = "Open in Munib Tracker"
  static let description = IntentDescription(
    "Open a screen in Munib Tracker.",
    categoryName: "Navigation"
  )
  static let openAppWhenRun: Bool = true

  @Parameter(title: "Screen")
  var feature: MunibFeature

  static var parameterSummary: some ParameterSummary {
    Summary("Open \(\.$feature)")
  }

  init() {}

  init(feature: MunibFeature) {
    self.feature = feature
  }

  func perform() async throws -> some IntentResult {
    // Runs in the app process (openAppWhenRun); the JS drain navigates.
    let payload: [String: Any] = ["type": "open-route", "href": feature.href, "source": "siri"]
    if let data = try? JSONSerialization.data(withJSONObject: payload),
       let json = String(data: data, encoding: .utf8) {
      ExternalCommandQueue.appendCommandJson(json)
    }
    return .result()
  }
}
