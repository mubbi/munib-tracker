import WidgetKit
import SwiftUI

// MARK: - Timeline

struct WatchComplicationEntry: TimelineEntry {
  let date: Date
  let snapshot: WidgetSnapshotPayload
}

struct WatchComplicationProvider: TimelineProvider {
  func placeholder(in context: Context) -> WatchComplicationEntry {
    WatchComplicationEntry(date: Date(), snapshot: WidgetSnapshotStore.placeholder())
  }

  func getSnapshot(in context: Context, completion: @escaping (WatchComplicationEntry) -> Void) {
    let snapshot = WidgetSnapshotStore.load() ?? WidgetSnapshotStore.placeholder()
    completion(WatchComplicationEntry(date: Date(), snapshot: snapshot))
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<WatchComplicationEntry>) -> Void) {
    let snapshot = WidgetSnapshotStore.load() ?? WidgetSnapshotStore.placeholder()
    let dates = WidgetReloadSchedule.timelineDates(from: snapshot)
    let entries = dates.map { WatchComplicationEntry(date: $0, snapshot: snapshot) }
    let reload = WidgetReloadSchedule.nextReloadDate(from: snapshot)
    completion(Timeline(entries: entries, policy: .after(reload)))
  }
}

// MARK: - Shared chrome

private extension View {
  func watchComplicationURL(_ link: String?) -> some View {
    widgetURL(URL(string: link ?? "munib-tracker://"))
  }

  @ViewBuilder
  func watchContainerBackground() -> some View {
    if #available(watchOS 10.0, *) {
      containerBackground(for: .widget) {
        AccessoryWidgetBackground()
      }
    } else {
      background(AccessoryWidgetBackground())
    }
  }
}

private struct DeniedOrEmpty: View {
  let message: String

  var body: some View {
    Text(message)
      .font(.caption2)
      .foregroundStyle(.secondary)
      .multilineTextAlignment(.center)
  }
}

// MARK: - Next Salah

struct WatchNextPrayerComplicationView: View {
  @Environment(\.widgetFamily) private var family
  @Environment(\.showsWidgetLabel) private var showsWidgetLabel
  @Environment(\.isLuminanceReduced) private var isLuminanceReduced
  let snapshot: WidgetSnapshotPayload

  private var section: WidgetSnapshotPayload.NextPrayerSection? { snapshot.nextPrayer }
  private var deepLink: String { section?.deepLink ?? "munib-tracker://" }
  private var prayerName: String { section?.prayerName ?? "—" }
  private var prayerTime: String { section?.prayerTime ?? "—" }
  private var countdown: String {
    section?.countdownLabel ?? section?.lockScreenDetail ?? ""
  }
  private var urgency: Double {
    WidgetReloadSchedule.countdownFraction(minutesUntil: section?.minutesUntil)
  }

  var body: some View {
    Group {
      if snapshot.locationDenied == true {
        DeniedOrEmpty(message: "Set location")
      } else {
        switch family {
        case .accessoryInline:
          inlineBody
        case .accessoryCircular:
          circularBody
        case .accessoryCorner:
          cornerBody
        case .accessoryRectangular:
          rectangularBody
        default:
          rectangularBody
        }
      }
    }
    .watchComplicationURL(deepLink)
  }

  private var inlineBody: some View {
    let line = section?.lockScreenLine
      ?? [prayerName, countdown].filter { !$0.isEmpty }.joined(separator: " · ")
    return Text(isLuminanceReduced ? prayerName : line)
  }

  private var circularBody: some View {
    Gauge(value: urgency) {
      VStack(spacing: 0) {
        Text(prayerName)
          .font(.caption2.weight(.semibold))
          .widgetAccentable()
          .minimumScaleFactor(0.6)
          .lineLimit(1)
        Text(isLuminanceReduced ? prayerTime : (countdown.isEmpty ? prayerTime : countdown))
          .font(.caption2)
          .minimumScaleFactor(0.55)
          .lineLimit(1)
      }
    }
    .gaugeStyle(.accessoryCircularCapacity)
    .widgetLabel {
      Text(countdown.isEmpty ? prayerTime : countdown)
    }
  }

  private var cornerBody: some View {
    ZStack {
      AccessoryWidgetBackground()
      Image(systemName: "moon.stars.fill")
        .font(.title3.weight(.semibold))
        .widgetAccentable()
    }
    .widgetLabel {
      if showsWidgetLabel {
        Gauge(value: urgency) {
          Text(prayerName)
        } currentValueLabel: {
          Text(countdown.isEmpty ? prayerTime : countdown)
        }
        .gaugeStyle(.accessoryLinearCapacity)
      } else {
        Text(prayerName)
      }
    }
  }

  private var rectangularBody: some View {
    VStack(alignment: .leading, spacing: 2) {
      Text(section?.title ?? "Next Salah")
        .font(.caption2)
        .foregroundStyle(.secondary)
      Text(prayerName)
        .font(.headline)
        .widgetAccentable()
        .minimumScaleFactor(0.7)
        .lineLimit(1)
      HStack(spacing: 4) {
        Text(prayerTime)
          .font(.caption.weight(.semibold))
        if !countdown.isEmpty, !isLuminanceReduced {
          Text("·")
            .foregroundStyle(.secondary)
          Text(countdown)
            .font(.caption)
            .foregroundStyle(.secondary)
        }
      }
      .minimumScaleFactor(0.7)
      .lineLimit(1)
      if let location = section?.location, !location.isEmpty, !isLuminanceReduced {
        Text(location)
          .font(.caption2)
          .foregroundStyle(.secondary)
          .privacySensitive()
          .lineLimit(1)
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    .watchContainerBackground()
  }
}

struct WatchNextPrayerComplication: Widget {
  let kind = "WatchNextPrayerComplication"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: WatchComplicationProvider()) { entry in
      WatchNextPrayerComplicationView(snapshot: entry.snapshot)
    }
    .configurationDisplayName("Next Salah")
    .description("Next Salah name, time, and countdown on the watch face.")
    .supportedFamilies([
      .accessoryCircular,
      .accessoryCorner,
      .accessoryInline,
      .accessoryRectangular,
    ])
  }
}

// MARK: - Schedule

struct WatchScheduleComplicationView: View {
  @Environment(\.widgetFamily) private var family
  @Environment(\.isLuminanceReduced) private var isLuminanceReduced
  let snapshot: WidgetSnapshotPayload

  private var section: WidgetSnapshotPayload.ScheduleSection? { snapshot.schedule }
  private var deepLink: String { section?.deepLink ?? "munib-tracker://tracker" }
  private var rows: [WidgetSnapshotPayload.ScheduleRow] {
    Array((section?.rows ?? []).prefix(family == .accessoryRectangular ? 3 : 2))
  }

  var body: some View {
    Group {
      if snapshot.locationDenied == true {
        DeniedOrEmpty(message: "Set location")
      } else {
        switch family {
        case .accessoryInline:
          Text(section?.lockScreenLine ?? section?.summary ?? "Today's Salah")
        case .accessoryRectangular:
          rectangularBody
        default:
          rectangularBody
        }
      }
    }
    .watchComplicationURL(deepLink)
  }

  private var rectangularBody: some View {
    VStack(alignment: .leading, spacing: 2) {
      Text(section?.title ?? "Today")
        .font(.caption2)
        .foregroundStyle(.secondary)
        .widgetAccentable()
      if rows.isEmpty {
        Text(section?.summary ?? "Open Munib")
          .font(.caption)
          .foregroundStyle(.secondary)
      } else {
        ForEach(rows, id: \.id) { row in
          HStack(spacing: 4) {
            if row.status == "completed" {
              Image(systemName: "checkmark")
                .font(.caption2.weight(.bold))
                .foregroundStyle(.secondary)
            } else if row.status == "active" {
              Circle()
                .fill(Color.accentColor)
                .frame(width: 5, height: 5)
            }
            Text(row.name)
              .font(.caption.weight(row.status == "active" ? .bold : .semibold))
              .foregroundStyle(rowStatusColor(row.status))
              .lineLimit(1)
            Spacer(minLength: 2)
            if !isLuminanceReduced {
              Text(row.time)
                .font(.caption2)
                .foregroundStyle(.secondary)
                .lineLimit(1)
            }
          }
        }
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    .watchContainerBackground()
  }

  private func rowStatusColor(_ status: String?) -> Color {
    switch status {
    case "completed": return .green
    case "active": return .primary
    default: return .secondary
    }
  }
}

struct WatchScheduleComplication: Widget {
  let kind = "WatchScheduleComplication"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: WatchComplicationProvider()) { entry in
      WatchScheduleComplicationView(snapshot: entry.snapshot)
    }
    .configurationDisplayName("Schedule")
    .description("Today's obligatory Salah times.")
    .supportedFamilies([.accessoryRectangular, .accessoryInline])
  }
}

// MARK: - Progress

struct WatchProgressComplicationView: View {
  @Environment(\.widgetFamily) private var family
  @Environment(\.showsWidgetLabel) private var showsWidgetLabel
  @Environment(\.isLuminanceReduced) private var isLuminanceReduced
  let snapshot: WidgetSnapshotPayload

  private var section: WidgetSnapshotPayload.ProgressSection? { snapshot.progress }
  private var deepLink: String { section?.deepLink ?? "munib-tracker://tracker" }
  private var label: String { section?.progressLabel ?? "0/5" }
  private var fraction: Double { (section?.progressPercent ?? 0) / 100 }

  var body: some View {
    Group {
      switch family {
      case .accessoryInline:
        Text(section?.lockScreenDetail ?? label)
      case .accessoryCircular:
        circularBody
      case .accessoryCorner:
        cornerBody
      case .accessoryRectangular:
        rectangularBody
      default:
        circularBody
      }
    }
    .watchComplicationURL(deepLink)
  }

  private var circularBody: some View {
    Gauge(value: min(max(fraction, 0), 1)) {
      Text(label)
        .font(.caption2.weight(.bold))
        .widgetAccentable()
        .minimumScaleFactor(0.6)
        .lineLimit(1)
    }
    .gaugeStyle(.accessoryCircularCapacity)
    .widgetLabel {
      Text(section?.title ?? "Progress")
    }
  }

  private var cornerBody: some View {
    ZStack {
      AccessoryWidgetBackground()
      Text(label)
        .font(.caption.weight(.bold))
        .widgetAccentable()
        .minimumScaleFactor(0.6)
        .lineLimit(1)
    }
    .widgetLabel {
      if showsWidgetLabel {
        Gauge(value: min(max(fraction, 0), 1)) {
          Text(section?.title ?? "Salah")
        }
        .gaugeStyle(.accessoryLinearCapacity)
      } else {
        Text(section?.title ?? "Progress")
      }
    }
  }

  private var rectangularBody: some View {
    VStack(alignment: .leading, spacing: 4) {
      Text(section?.title ?? "Today's progress")
        .font(.caption2)
        .foregroundStyle(.secondary)
      Text(label)
        .font(.headline)
        .widgetAccentable()
      if !isLuminanceReduced {
        ProgressView(value: min(max(fraction, 0), 1))
          .tint(.accentColor)
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    .watchContainerBackground()
  }
}

struct WatchProgressComplication: Widget {
  let kind = "WatchProgressComplication"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: WatchComplicationProvider()) { entry in
      WatchProgressComplicationView(snapshot: entry.snapshot)
    }
    .configurationDisplayName("Progress")
    .description("Today's obligatory Salah progress.")
    .supportedFamilies([
      .accessoryCircular,
      .accessoryCorner,
      .accessoryInline,
      .accessoryRectangular,
    ])
  }
}

// MARK: - Salah streak

struct WatchStreakComplicationView: View {
  @Environment(\.widgetFamily) private var family
  @Environment(\.showsWidgetLabel) private var showsWidgetLabel
  let snapshot: WidgetSnapshotPayload

  private var section: WidgetSnapshotPayload.StreakSection? { snapshot.streak }
  private var deepLink: String { section?.deepLink ?? "munib-tracker://statistics" }
  private var streakDays: Int { section?.streakDays ?? 0 }
  private var label: String { section?.streakLabel ?? "\(streakDays)" }

  var body: some View {
    Group {
      switch family {
      case .accessoryInline:
        Text(section?.lockScreenLine ?? "\(label) day streak")
      case .accessoryCircular:
        circularBody
      case .accessoryCorner:
        cornerBody
      case .accessoryRectangular:
        rectangularBody
      default:
        circularBody
      }
    }
    .watchComplicationURL(deepLink)
  }

  private var circularBody: some View {
    ZStack {
      AccessoryWidgetBackground()
      VStack(spacing: 1) {
        Image(systemName: "flame.fill")
          .font(.title3.weight(.semibold))
          .widgetAccentable()
        Text(label)
          .font(.caption2.weight(.bold))
          .minimumScaleFactor(0.6)
          .lineLimit(1)
      }
    }
    .widgetLabel {
      Text(section?.title ?? "Streak")
    }
  }

  private var cornerBody: some View {
    ZStack {
      AccessoryWidgetBackground()
      Image(systemName: "flame.fill")
        .font(.title3.weight(.semibold))
        .widgetAccentable()
    }
    .widgetLabel {
      Text(showsWidgetLabel ? "\(label) days" : label)
    }
  }

  private var rectangularBody: some View {
    VStack(alignment: .leading, spacing: 2) {
      Text(section?.title ?? "Salah streak")
        .font(.caption2)
        .foregroundStyle(.secondary)
      HStack(spacing: 4) {
        Image(systemName: "flame.fill")
          .widgetAccentable()
        Text(label)
          .font(.headline)
          .widgetAccentable()
      }
      if let summary = section?.summary, !summary.isEmpty {
        Text(summary)
          .font(.caption2)
          .foregroundStyle(.secondary)
          .lineLimit(1)
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    .watchContainerBackground()
  }
}

struct WatchStreakComplication: Widget {
  let kind = "WatchStreakComplication"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: WatchComplicationProvider()) { entry in
      WatchStreakComplicationView(snapshot: entry.snapshot)
    }
    .configurationDisplayName("Salah streak")
    .description("Current consecutive-day obligatory Salah streak.")
    .supportedFamilies([
      .accessoryCircular,
      .accessoryCorner,
      .accessoryInline,
      .accessoryRectangular,
    ])
  }
}

// MARK: - Qaza

struct WatchQazaComplicationView: View {
  @Environment(\.widgetFamily) private var family
  @Environment(\.showsWidgetLabel) private var showsWidgetLabel
  @Environment(\.isLuminanceReduced) private var isLuminanceReduced
  let snapshot: WidgetSnapshotPayload

  private var section: WidgetSnapshotPayload.QazaSection? { snapshot.qaza }
  private var deepLink: String { section?.deepLink ?? "munib-tracker://qaza" }
  private var remainingLabel: String { section?.remainingLabel ?? "\(section?.remaining ?? 0)" }
  private var fraction: Double { (section?.progressPercent ?? 0) / 100 }
  private var hasTodayTarget: Bool { (section?.todayTarget ?? 0) > 0 }

  var body: some View {
    Group {
      switch family {
      case .accessoryInline:
        Text(section?.lockScreenLine ?? remainingLabel)
      case .accessoryCircular:
        circularBody
      case .accessoryCorner:
        cornerBody
      case .accessoryRectangular:
        rectangularBody
      default:
        circularBody
      }
    }
    .watchComplicationURL(deepLink)
  }

  private var circularBody: some View {
    Group {
      if hasTodayTarget {
        Gauge(value: min(max(fraction, 0), 1)) {
          Text(remainingLabel)
            .font(.caption2.weight(.bold))
            .widgetAccentable()
            .minimumScaleFactor(0.6)
            .lineLimit(1)
        }
        .gaugeStyle(.accessoryCircularCapacity)
      } else {
        ZStack {
          AccessoryWidgetBackground()
          VStack(spacing: 1) {
            Image(systemName: "clock.arrow.circlepath")
              .font(.title3.weight(.semibold))
              .widgetAccentable()
            Text(remainingLabel)
              .font(.caption2.weight(.bold))
              .minimumScaleFactor(0.6)
              .lineLimit(1)
          }
        }
      }
    }
    .widgetLabel {
      Text(section?.title ?? "Qaza")
    }
  }

  private var cornerBody: some View {
    ZStack {
      AccessoryWidgetBackground()
      Image(systemName: "clock.arrow.circlepath")
        .font(.title3.weight(.semibold))
        .widgetAccentable()
    }
    .widgetLabel {
      if showsWidgetLabel, hasTodayTarget {
        Gauge(value: min(max(fraction, 0), 1)) {
          Text(section?.title ?? "Qaza")
        } currentValueLabel: {
          Text(remainingLabel)
        }
        .gaugeStyle(.accessoryLinearCapacity)
      } else {
        Text(remainingLabel)
      }
    }
  }

  private var rectangularBody: some View {
    VStack(alignment: .leading, spacing: 4) {
      Text(section?.title ?? "Qaza")
        .font(.caption2)
        .foregroundStyle(.secondary)
      Text(remainingLabel)
        .font(.headline)
        .widgetAccentable()
        .minimumScaleFactor(0.7)
        .lineLimit(1)
      if let todayLabel = section?.todayLabel, !todayLabel.isEmpty, !isLuminanceReduced {
        Text(todayLabel)
          .font(.caption2)
          .foregroundStyle(.secondary)
          .lineLimit(1)
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    .watchContainerBackground()
  }
}

struct WatchQazaComplication: Widget {
  let kind = "WatchQazaComplication"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: WatchComplicationProvider()) { entry in
      WatchQazaComplicationView(snapshot: entry.snapshot)
    }
    .configurationDisplayName("Qaza")
    .description("Remaining Qaza debt and today's make-up progress.")
    .supportedFamilies([
      .accessoryCircular,
      .accessoryCorner,
      .accessoryInline,
      .accessoryRectangular,
    ])
  }
}

// MARK: - Ramadan

struct WatchRamadanComplicationView: View {
  @Environment(\.widgetFamily) private var family
  @Environment(\.showsWidgetLabel) private var showsWidgetLabel
  @Environment(\.isLuminanceReduced) private var isLuminanceReduced
  let snapshot: WidgetSnapshotPayload

  private var section: WidgetSnapshotPayload.RamadanSection? { snapshot.ramadan }
  private var deepLink: String { section?.deepLink ?? "munib-tracker://ramadan" }
  private var countdown: String { section?.countdownLabel ?? "" }
  private var urgency: Double {
    WidgetReloadSchedule.countdownFraction(minutesUntil: section?.minutesUntil)
  }

  var body: some View {
    Group {
      if snapshot.locationDenied == true {
        DeniedOrEmpty(message: "Set location")
      } else if section?.isRamadan == false {
        DeniedOrEmpty(message: section?.title ?? "Suhoor & Iftar")
      } else {
        switch family {
        case .accessoryInline:
          inlineBody
        case .accessoryCircular:
          circularBody
        case .accessoryCorner:
          cornerBody
        case .accessoryRectangular:
          rectangularBody
        default:
          rectangularBody
        }
      }
    }
    .watchComplicationURL(deepLink)
  }

  private var inlineBody: some View {
    Text(section?.lockScreenLine ?? countdown)
  }

  private var circularBody: some View {
    Gauge(value: min(max(urgency, 0), 1)) {
      VStack(spacing: 0) {
        Text(section?.iftarLabel ?? "Iftar")
          .font(.caption2.weight(.semibold))
          .widgetAccentable()
          .minimumScaleFactor(0.6)
          .lineLimit(1)
        Text(countdown.isEmpty ? (section?.iftarTime ?? "—") : countdown)
          .font(.caption2)
          .minimumScaleFactor(0.55)
          .lineLimit(1)
      }
    }
    .gaugeStyle(.accessoryCircularCapacity)
    .widgetLabel {
      Text(countdown.isEmpty ? (section?.iftarTime ?? "—") : countdown)
    }
  }

  private var cornerBody: some View {
    ZStack {
      AccessoryWidgetBackground()
      Image(systemName: "sunset.fill")
        .font(.title3.weight(.semibold))
        .widgetAccentable()
    }
    .widgetLabel {
      if showsWidgetLabel {
        Gauge(value: min(max(urgency, 0), 1)) {
          Text(section?.iftarLabel ?? "Iftar")
        } currentValueLabel: {
          Text(countdown.isEmpty ? (section?.iftarTime ?? "—") : countdown)
        }
        .gaugeStyle(.accessoryLinearCapacity)
      } else {
        Text(section?.iftarLabel ?? "Iftar")
      }
    }
  }

  private var rectangularBody: some View {
    VStack(alignment: .leading, spacing: 2) {
      Text(section?.title ?? "Suhoor & Iftar")
        .font(.caption2)
        .foregroundStyle(.secondary)
      HStack(spacing: 4) {
        Image(systemName: "sunrise.fill")
          .font(.caption2)
          .foregroundStyle(.secondary)
        Text(section?.suhoorTime ?? "—")
          .font(.caption.weight(.semibold))
      }
      HStack(spacing: 4) {
        Image(systemName: "sunset.fill")
          .font(.caption2)
          .foregroundStyle(.secondary)
        Text(section?.iftarTime ?? "—")
          .font(.caption.weight(.semibold))
      }
      if !countdown.isEmpty, !isLuminanceReduced {
        Text(countdown)
          .font(.caption2)
          .foregroundStyle(.secondary)
          .lineLimit(1)
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    .watchContainerBackground()
  }
}

struct WatchRamadanComplication: Widget {
  let kind = "WatchRamadanComplication"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: WatchComplicationProvider()) { entry in
      WatchRamadanComplicationView(snapshot: entry.snapshot)
    }
    .configurationDisplayName("Suhoor & Iftar")
    .description("Ramadan suhoor and iftar times with a live countdown.")
    .supportedFamilies([
      .accessoryCircular,
      .accessoryCorner,
      .accessoryInline,
      .accessoryRectangular,
    ])
  }
}
