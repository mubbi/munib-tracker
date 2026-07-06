import SwiftUI
import WidgetKit

enum WidgetLayout {
  static func isSmall(_ family: WidgetFamily) -> Bool {
    family == .systemSmall
  }

  static func isLarge(_ family: WidgetFamily) -> Bool {
    family == .systemLarge
  }

  static func isAccessory(_ family: WidgetFamily) -> Bool {
    switch family {
    case .accessoryInline, .accessoryRectangular, .accessoryCircular:
      return true
    default:
      return false
    }
  }

  static func scheduleRowLimit(for family: WidgetFamily) -> Int {
    switch family {
    case .systemSmall: return 2
    case .systemMedium: return 3
    case .systemLarge: return 5
    default: return 3
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

extension View {
  func widgetFittingText(maxLines: Int = 1) -> some View {
    lineLimit(maxLines)
      .minimumScaleFactor(0.7)
      .allowsTightening(true)
      .truncationMode(.tail)
  }
}

struct WidgetEntryRouter<Home: View>: View {
  @Environment(\.widgetFamily) private var family
  let lockLine: String
  let lockDetail: String
  let deepLink: String
  var circularLabel: String?
  @ViewBuilder let home: () -> Home

  var body: some View {
    switch family {
    case .accessoryInline:
      WidgetLockInline(line: lockLine, deepLink: deepLink)
    case .accessoryRectangular:
      WidgetLockRectangular(title: lockLine, detail: lockDetail, deepLink: deepLink)
    case .accessoryCircular:
      WidgetLockCircular(label: circularLabel ?? lockLine, deepLink: deepLink)
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
  @ViewBuilder let content: Content

  private var compact: Bool { WidgetLayout.isSmall(family) }
  private var showsHeaderSummary: Bool { !compact && !summary.isEmpty }
  private var showsFooter: Bool { !compact && footer != nil && !(footer ?? "").isEmpty }
  private var showsUpdatedAgo: Bool {
    WidgetLayout.isLarge(family) && updatedAgo != nil && !(updatedAgo ?? "").isEmpty
  }
  private var stackSpacing: CGFloat { compact ? 6 : 8 }
  private var showsHeaderDot: Bool { !compact }

  var body: some View {
    VStack(alignment: .leading, spacing: stackSpacing) {
      HStack(alignment: .top, spacing: compact ? 6 : 8) {
        if showsHeaderDot {
          Circle()
            .fill(accent.opacity(0.18))
            .frame(width: 24, height: 24)
            .overlay(Circle().fill(accent).frame(width: 7, height: 7))
        }
        VStack(alignment: .leading, spacing: 2) {
          Text(title)
            .font(compact ? .caption.weight(.semibold) : .subheadline.weight(.semibold))
            .foregroundStyle(accent)
            .widgetFittingText()
          if showsHeaderSummary {
            Text(summary)
              .font(.caption)
              .foregroundStyle(theme.textSecondary)
              .lineLimit(compact ? 1 : 2)
              .minimumScaleFactor(0.8)
          }
        }
      }
      content
      if showsFooter, let footer {
        Divider().overlay(theme.border)
        Text(footer)
          .font(.caption.weight(.semibold))
          .foregroundStyle(accent)
          .widgetFittingText()
      }
      if showsUpdatedAgo, let updatedAgo {
        Text(updatedAgo)
          .font(.caption2)
          .foregroundStyle(theme.textSecondary)
          .widgetFittingText()
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    .widgetCardBackground(theme.cardBackground)
    .widgetURL(URL(string: deepLink))
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
      }
    }
    .frame(height: 6)
  }
}

struct WidgetLockRectangular: View {
  let title: String
  let detail: String
  let deepLink: String

  var body: some View {
    VStack(alignment: .leading, spacing: 2) {
      Text(title)
        .font(.subheadline.weight(.semibold))
        .widgetFittingText()
      Text(detail)
        .font(.caption)
        .foregroundStyle(.secondary)
        .widgetFittingText()
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    .widgetURL(URL(string: deepLink))
  }
}

struct WidgetLockInline: View {
  let line: String
  let deepLink: String

  var body: some View {
    Text(line)
      .widgetFittingText()
      .widgetURL(URL(string: deepLink))
  }
}

struct WidgetLockCircular: View {
  let label: String
  let deepLink: String

  var body: some View {
    ZStack {
      if #available(iOS 16.0, *) {
        AccessoryWidgetBackground()
      }
      Text(label)
        .font(.caption2.weight(.semibold))
        .minimumScaleFactor(0.55)
        .lineLimit(2)
        .multilineTextAlignment(.center)
        .padding(4)
    }
    .widgetURL(URL(string: deepLink))
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
}

struct WidgetTimeline {
  static func entries() -> WidgetProviderEntry {
    WidgetProviderEntry(date: Date(), snapshot: WidgetSnapshotStore.load())
  }

  static func timeline() -> Timeline<WidgetProviderEntry> {
    let entry = entries()
    let minutes = entry.snapshot?.nextPrayer?.minutesUntil ?? 15
    let interval = max(min(Double(minutes) * 60, 900), 60)
    return Timeline(entries: [entry], policy: .after(Date().addingTimeInterval(interval)))
  }
}

struct BasicWidgetProvider: TimelineProvider {
  func placeholder(in context: Context) -> WidgetProviderEntry {
    WidgetProviderEntry(date: Date(), snapshot: nil)
  }

  func getSnapshot(in context: Context, completion: @escaping (WidgetProviderEntry) -> Void) {
    completion(WidgetTimeline.entries())
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<WidgetProviderEntry>) -> Void) {
    completion(WidgetTimeline.timeline())
  }
}
