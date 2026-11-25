#if !os(watchOS)
import SwiftUI
import WidgetKit
import AppIntents

enum WidgetLayout {
  static func isSmall(_ family: WidgetFamily) -> Bool {
    family == .systemSmall
  }

  static func isLarge(_ family: WidgetFamily) -> Bool {
    family == .systemLarge
  }

  static func isMedium(_ family: WidgetFamily) -> Bool {
    family == .systemMedium
  }

  static func isAccessory(_ family: WidgetFamily) -> Bool {
    switch family {
    case .accessoryInline, .accessoryRectangular, .accessoryCircular:
      return true
    default:
      return false
    }
  }

  /// Content budgets: small = glance hero; medium+ = full obligatory set.
  static func scheduleRowLimit(for family: WidgetFamily) -> Int {
    switch family {
    case .systemSmall: return 3
    case .systemMedium, .systemLarge: return 5
    default: return 3
    }
  }

  static func hadithMeaningLines(for family: WidgetFamily) -> Int {
    switch family {
    case .systemSmall: return 2
    case .systemMedium: return 3
    case .systemLarge: return 5
    default: return 2
    }
  }
}

private extension View {
  @ViewBuilder
  func widgetCardBackground(_ color: Color) -> some View {
    if #available(iOS 17.0, *) {
      containerBackground(for: .widget) {
        color
      }
    } else {
      background(color)
    }
  }
}

private struct OptionalPrivacySensitive: ViewModifier {
  let enabled: Bool
  func body(content: Content) -> some View {
    if enabled {
      content.privacySensitive()
    } else {
      content
    }
  }
}

extension View {
  func widgetFittingText(maxLines: Int = 2) -> some View {
    lineLimit(maxLines)
      .minimumScaleFactor(0.55)
      .allowsTightening(true)
      .truncationMode(.tail)
  }

  @ViewBuilder
  func widgetLocale(_ locale: String?, isRtl: Bool?) -> some View {
    if let locale, let isRtl {
      environment(\.locale, Locale(identifier: locale))
        .environment(\.layoutDirection, isRtl ? .rightToLeft : .leftToRight)
    } else {
      self
    }
  }
}

struct WidgetEntryRouter<Home: View>: View {
  @Environment(\.widgetFamily) private var family
  let lockLine: String
  let lockDetail: String
  let deepLink: String
  var circularLabel: String?
  var circularGauge: Double?
  @ViewBuilder let home: () -> Home

  var body: some View {
    switch family {
    case .accessoryInline:
      WidgetLockInline(line: lockLine, deepLink: deepLink)
    case .accessoryRectangular:
      WidgetLockRectangular(title: lockLine, detail: lockDetail, deepLink: deepLink)
    case .accessoryCircular:
      WidgetLockCircular(
        label: circularLabel ?? lockLine,
        deepLink: deepLink,
        gaugeValue: circularGauge
      )
    default:
      home()
    }
  }
}

struct WidgetCard<Content: View>: View {
  @Environment(\.widgetFamily) private var family
  let theme: ResolvedWidgetTheme
  let accent: Color
  let title: String
  let summary: String
  let footer: String?
  let updatedAgo: String?
  let deepLink: String
  var accessibilityLabelText: String? = nil
  var compactChrome: Bool = false
  var markLabel: String? = nil
  var showMark: Bool = false
  /// When set, the Mark button targets this specific prayer instead of the generic "current" one.
  var markPrayerId: String? = nil
  var summaryPrivacySensitive: Bool = false
  @ViewBuilder let content: Content

  private var compact: Bool { WidgetLayout.isSmall(family) || compactChrome }
  private var showsHeader: Bool { !compact }
  private var showsHeaderSummary: Bool { showsHeader && !summary.isEmpty }
  private var showsFooter: Bool { !compact && footer != nil && !(footer ?? "").isEmpty && !showMark }
  private var showsUpdatedAgo: Bool {
    WidgetLayout.isLarge(family) && updatedAgo != nil && !(updatedAgo ?? "").isEmpty
  }
  private var stackSpacing: CGFloat { compact ? 4 : 8 }

  var body: some View {
    VStack(alignment: .leading, spacing: stackSpacing) {
      if showsHeader {
        HStack(alignment: .top, spacing: 8) {
          WidgetHeaderDot(accent: accent)
          VStack(alignment: .leading, spacing: 2) {
            Text(title)
              .font(.subheadline.weight(.semibold))
              .foregroundStyle(accent)
              .widgetAccentable()
              .widgetFittingText(maxLines: 1)
            if showsHeaderSummary {
              Text(summary)
                .font(.caption)
                .foregroundStyle(theme.textSecondary)
                .modifier(OptionalPrivacySensitive(enabled: summaryPrivacySensitive))
                .widgetFittingText(maxLines: 2)
            }
          }
          Spacer(minLength: 0)
        }
      }
      content
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
      if showMark, let markLabel, #available(iOS 17.0, *) {
        Group {
          if let markPrayerId, !markPrayerId.isEmpty {
            Button(intent: MarkNamedSalahIntent(prayerId: markPrayerId)) {
              markButtonLabel(markLabel)
            }
          } else {
            Button(intent: MarkCurrentSalahWidgetIntent()) {
              markButtonLabel(markLabel)
            }
          }
        }
        .buttonStyle(.plain)
      } else if showsFooter, let footer {
        Divider().overlay(theme.border)
        Text(footer)
          .font(.caption.weight(.semibold))
          .foregroundStyle(accent)
          .widgetFittingText(maxLines: 1)
      }
      if showsUpdatedAgo, let updatedAgo {
        Text(updatedAgo)
          .font(.caption2)
          .foregroundStyle(theme.textSecondary)
          .widgetFittingText(maxLines: 1)
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    .widgetCardBackground(theme.cardBackground)
    .widgetURL(URL(string: deepLink))
    .accessibilityElement(children: .combine)
    .accessibilityLabel(accessibilityLabelText ?? title)
  }

  @available(iOS 17.0, *)
  @ViewBuilder
  private func markButtonLabel(_ text: String) -> some View {
    Label(text, systemImage: "checkmark.circle")
      .font(.caption.weight(.semibold))
      .lineLimit(1)
      .minimumScaleFactor(0.7)
      .frame(maxWidth: .infinity, minHeight: 44)
      .foregroundStyle(accent)
      .background(accent.opacity(0.16), in: RoundedRectangle(cornerRadius: 12, style: .continuous))
      .widgetAccentable()
  }
}

/// Decorative header dot. Hidden where the system removes the widget background
/// (StandBy, CarPlay, iOS 26 clear / tinted Liquid Glass) so it doesn't float.
struct WidgetHeaderDot: View {
  let accent: Color

  var body: some View {
    if #available(iOS 17.0, *) {
      BackgroundAwareDot(accent: accent)
    } else {
      dot(accent)
    }
  }

  fileprivate static func make(_ accent: Color) -> some View {
    Circle()
      .fill(accent.opacity(0.18))
      .frame(width: 22, height: 22)
      .overlay(Circle().fill(accent).frame(width: 7, height: 7))
      .accessibilityHidden(true)
  }

  private func dot(_ accent: Color) -> some View { Self.make(accent) }
}

@available(iOS 17.0, *)
private struct BackgroundAwareDot: View {
  @Environment(\.showsWidgetContainerBackground) private var showsBackground
  let accent: Color

  var body: some View {
    if showsBackground {
      WidgetHeaderDot.make(accent)
    }
  }
}

struct WidgetProgressBar: View {
  let percent: Double
  let fill: Color
  let track: Color

  var body: some View {
    GeometryReader { geo in
      ZStack(alignment: .leading) {
        Capsule().fill(track)
        Capsule()
          .fill(fill)
          .frame(width: geo.size.width * CGFloat(min(max(percent, 0), 100) / 100))
          .widgetAccentable()
      }
    }
    .frame(height: 6)
    .accessibilityElement()
    .accessibilityValue("\(Int(min(max(percent, 0), 100)))%")
  }
}

struct WidgetLiveCountdown: View {
  let targetTimeMs: Double?
  let fallback: String
  let theme: ResolvedWidgetTheme

  var body: some View {
    if let targetTimeMs, targetTimeMs > 0 {
      let end = Date(timeIntervalSince1970: targetTimeMs / 1000)
      let start = Date()
      if end > start {
        Text(timerInterval: start...end, countsDown: true)
          .font(.caption.monospacedDigit())
          .foregroundStyle(theme.textSecondary)
          .widgetFittingText(maxLines: 1)
      } else {
        Text(fallback)
          .font(.caption)
          .foregroundStyle(theme.textSecondary)
          .widgetFittingText(maxLines: 1)
      }
    } else {
      Text(fallback)
        .font(.caption)
        .foregroundStyle(theme.textSecondary)
        .widgetFittingText(maxLines: 1)
    }
  }
}

struct WidgetLockRectangular: View {
  let title: String
  let detail: String
  let deepLink: String

  var body: some View {
    VStack(alignment: .leading, spacing: 2) {
      Text(title)
        .font(.headline)
        .widgetAccentable()
        .widgetFittingText(maxLines: 1)
      Text(detail)
        .font(.caption)
        .foregroundStyle(.secondary)
        .widgetFittingText(maxLines: 2)
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    .widgetURL(URL(string: deepLink))
    .accessibilityElement(children: .combine)
    .accessibilityLabel("\(title). \(detail)")
  }
}

struct WidgetLockInline: View {
  let line: String
  let deepLink: String

  var body: some View {
    Text(line)
      .widgetFittingText(maxLines: 1)
      .widgetURL(URL(string: deepLink))
  }
}

struct WidgetLockCircular: View {
  let label: String
  let deepLink: String
  var gaugeValue: Double? = nil

  var body: some View {
    ZStack {
      if #available(iOS 16.0, *) {
        AccessoryWidgetBackground()
      }
      if let gaugeValue {
        Gauge(value: min(max(gaugeValue, 0), 1)) {
          Text(label)
            .font(.caption2.weight(.semibold))
            .minimumScaleFactor(0.5)
            .lineLimit(2)
            .multilineTextAlignment(.center)
        }
        .gaugeStyle(.accessoryCircularCapacity)
      } else {
        Text(label)
          .font(.caption2.weight(.semibold))
          .minimumScaleFactor(0.5)
          .lineLimit(2)
          .multilineTextAlignment(.center)
          .padding(4)
      }
    }
    .widgetURL(URL(string: deepLink))
    .accessibilityLabel(label)
  }
}

func scheduleStatusColor(_ status: String?, theme: ResolvedWidgetTheme) -> Color {
  switch status {
  case "completed": return theme.success
  case "active": return theme.primary
  default: return theme.textSecondary
  }
}

struct WidgetProviderEntry: TimelineEntry {
  let date: Date
  let snapshot: WidgetSnapshotPayload?
  /// Phone-only sections (adhkar, events, voice strings) — `WidgetTimeResolver.swift`.
  var extras: WidgetExtrasPayload? = nil
}

struct WidgetTimeline {
  static func entries() -> WidgetProviderEntry {
    let data = WidgetTimeResolver.load(at: Date())
    return WidgetProviderEntry(date: Date(), snapshot: data.snapshot, extras: data.extras)
  }

  /// One entry per moment the content changes on its own (each Adhan, the run-up
  /// to the next one, adhkar windows, midnight), each resolved for its own date —
  /// so "Next Salah" moves on after the Adhan without the app running. Countdowns
  /// between entries tick via `Text(timerInterval:)`.
  static func timeline() -> Timeline<WidgetProviderEntry> {
    let now = Date()
    guard let raw = WidgetTimeResolver.rawSnapshot() else {
      return Timeline(
        entries: [WidgetProviderEntry(date: now, snapshot: nil)],
        policy: .after(now.addingTimeInterval(15 * 60))
      )
    }
    let pending = WidgetTimeResolver.pendingCommands()
    let dates = WidgetTimeResolver.timelineDates(raw, now: now)
    let entries = dates.map { date -> WidgetProviderEntry in
      let data = WidgetTimeResolver.decode(WidgetTimeResolver.resolve(raw, at: date, pending: pending))
      return WidgetProviderEntry(date: date, snapshot: data.snapshot, extras: data.extras)
    }
    let reload = dates.last.map { max($0, now.addingTimeInterval(15 * 60)) } ?? now.addingTimeInterval(900)
    return Timeline(entries: entries, policy: .after(reload))
  }
}

struct BasicWidgetProvider: TimelineProvider {
  func placeholder(in context: Context) -> WidgetProviderEntry {
    WidgetProviderEntry(
      date: Date(),
      snapshot: WidgetSnapshotStore.placeholder(),
      extras: WidgetExtrasPlaceholder.value
    )
  }

  func getSnapshot(in context: Context, completion: @escaping (WidgetProviderEntry) -> Void) {
    let data = WidgetTimeResolver.load(at: Date())
    if data.snapshot == nil, context.isPreview {
      completion(placeholder(in: context))
      return
    }
    completion(WidgetProviderEntry(date: Date(), snapshot: data.snapshot, extras: data.extras))
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<WidgetProviderEntry>) -> Void) {
    completion(WidgetTimeline.timeline())
  }
}

/// Gallery / first-install sample for the adhkar and events widgets.
enum WidgetExtrasPlaceholder {
  static let value: WidgetExtrasPayload? = {
    let now = Date().timeIntervalSince1970 * 1000
    let json = """
    {"date":"","locale":"en","adhkar":{"title":"Adhkar","dueLabel":"Due now","allDoneLabel":"You're all caught up","deepLink":"munib-tracker://zikr","sets":[{"key":"morning","title":"Morning Adhkar","completed":4,"total":12,"progressLabel":"4/12 done","startMs":\(now - 3_600_000),"endMs":\(now + 3_600_000),"nextLabel":"","deepLink":"munib-tracker://zikr/session/morning"}]},"events":{"title":"Islamic events","deepLink":"munib-tracker://events","items":[{"id":"ramadan","name":"First of Ramadan","date":"","dateLabel":"18 February","relativeLabel":"in 12 days","daysUntil":12},{"id":"laylatQadr","name":"Laylat al-Qadr (est.)","date":"","dateLabel":"16 March","relativeLabel":"in 38 days","daysUntil":38},{"id":"eidFitr","name":"Eid al-Fitr","date":"","dateLabel":"20 March","relativeLabel":"in 42 days","daysUntil":42}]}}
    """
    return try? JSONDecoder().decode(WidgetExtrasPayload.self, from: Data(json.utf8))
  }()
}

/// Widget-side mark intent — writes to the shared App Group command queue.
struct MarkCurrentSalahWidgetIntent: AppIntent {
  static let title: LocalizedStringResource = "Mark Salah"
  static let description = IntentDescription("Mark the current obligatory Salah as completed.")
  static let isDiscoverable: Bool = false
  static let openAppWhenRun: Bool = false

  func perform() async throws -> some IntentResult {
    let payload: [String: Any] = [
      "type": "mark-current-obligatory",
      "source": "widget",
    ]
    if let data = try? JSONSerialization.data(withJSONObject: payload),
       let json = String(data: data, encoding: .utf8) {
      ExternalCommandQueue.appendCommandJson(json)
      WidgetCenter.shared.reloadAllTimelines()
    }
    return .result()
  }
}

/// Widget-side mark intent for a specific prayer (Schedule row buttons, Next Salah).
/// Mirrors the `mark-prayer` command shape used by Siri/watch (`MunibWatchApp.swift`).
struct MarkNamedSalahIntent: AppIntent {
  static let title: LocalizedStringResource = "Mark Salah"
  static let description = IntentDescription("Mark a specific obligatory Salah as completed.")
  static let isDiscoverable: Bool = false
  static let openAppWhenRun: Bool = false

  @Parameter(title: "Prayer")
  var prayerId: String

  init() {
    self.prayerId = ""
  }

  init(prayerId: String) {
    self.prayerId = prayerId
  }

  func perform() async throws -> some IntentResult {
    guard !prayerId.isEmpty else { return .result() }
    let payload: [String: Any] = [
      "type": "mark-prayer",
      "prayerId": prayerId,
      "date": ExternalCommandQueue.localDateString(),
      "source": "widget",
    ]
    if let data = try? JSONSerialization.data(withJSONObject: payload),
       let json = String(data: data, encoding: .utf8) {
      ExternalCommandQueue.appendCommandJson(json)
      WidgetCenter.shared.reloadAllTimelines()
    }
    return .result()
  }
}

#endif
