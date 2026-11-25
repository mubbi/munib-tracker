import WidgetKit
import SwiftUI

// MARK: - Timeline

struct WatchComplicationEntry: TimelineEntry {
  let date: Date
  let snapshot: WidgetSnapshotPayload
  /// Smart Stack hint: highest around an Adhan, when marking is most likely.
  var relevance: TimelineEntryRelevance? = nil
}

struct WatchComplicationProvider: TimelineProvider {
  func placeholder(in context: Context) -> WatchComplicationEntry {
    WatchComplicationEntry(date: Date(), snapshot: WidgetSnapshotStore.placeholder())
  }

  func getSnapshot(in context: Context, completion: @escaping (WatchComplicationEntry) -> Void) {
    let snapshot = WidgetSnapshotStore.load() ?? WidgetSnapshotStore.placeholder()
    completion(WatchComplicationEntry(date: Date(), snapshot: snapshot))
  }

  /// One entry per upcoming Adhan (plus the run-up steps of the urgency gauge and
  /// local midnight). Each view re-resolves the next Salah for its entry's date, so
  /// the face moves on at every Adhan without waiting for a phone push.
  func getTimeline(in context: Context, completion: @escaping (Timeline<WatchComplicationEntry>) -> Void) {
    let snapshot = WidgetSnapshotStore.load() ?? WidgetSnapshotStore.placeholder()
    let now = Date()
    let dates = WatchComplicationSchedule.entryDates(for: snapshot, now: now)
    let entries = dates.map {
      WatchComplicationEntry(
        date: $0,
        snapshot: snapshot,
        relevance: WatchComplicationSchedule.relevance(at: $0, snapshot: snapshot)
      )
    }
    completion(Timeline(entries: entries, policy: .after(WatchComplicationSchedule.reloadDate(dates, now: now))))
  }
}

enum WatchComplicationSchedule {
  /// Minutes before an Adhan at which the circular / corner urgency gauge steps.
  private static let runUpMinutes: [Double] = [60, 45, 30, 15, 5]

  static func entryDates(for snapshot: WidgetSnapshotPayload, now: Date) -> [Date] {
    var dates: Set<Date> = [now]
    let instants = WatchSalahResolver.upcomingInstants(snapshot, after: now)
    if instants.isEmpty {
      // No Adhan ahead in this snapshot (older format, or after the day's last
      // Adhan): keep the previous ~15-minute cadence until the phone pushes.
      dates.formUnion(WidgetReloadSchedule.timelineDates(from: snapshot, now: now))
    }
    for at in instants {
      dates.insert(at)
      for minutes in runUpMinutes {
        let step = at.addingTimeInterval(-minutes * 60)
        if step > now { dates.insert(step) }
      }
    }
    if let iftarOrSuhoor = WatchSalahResolver.instant(snapshot.ramadan?.targetTimeMs), iftarOrSuhoor > now {
      dates.insert(iftarOrSuhoor)
    }
    // Midnight flips the day: views switch to their stale state until the phone pushes.
    if let midnight = Calendar.current.nextDate(
      after: now,
      matching: DateComponents(hour: 0, minute: 0, second: 5),
      matchingPolicy: .nextTime
    ) {
      dates.insert(midnight)
    }
    return dates.filter { $0 >= now }.sorted()
  }

  /// 30 min before an Adhan → 60, the first 20 min of its time (the mark window) → 100,
  /// otherwise a low baseline so the widget stays eligible for the Smart Stack.
  static func relevance(at date: Date, snapshot: WidgetSnapshotPayload) -> TimelineEntryRelevance {
    let leadIn: TimeInterval = 30 * 60
    let markWindow: TimeInterval = 20 * 60
    let instants = (snapshot.schedule?.rows ?? []).compactMap { WatchSalahResolver.instant($0.atMs) }
    for at in instants.sorted() {
      let end = at.addingTimeInterval(markWindow)
      if date >= at, date < end {
        return TimelineEntryRelevance(score: 100, duration: end.timeIntervalSince(date))
      }
      let untilAdhan = at.timeIntervalSince(date)
      if untilAdhan > 0, untilAdhan <= leadIn {
        return TimelineEntryRelevance(score: 60, duration: untilAdhan)
      }
    }
    return TimelineEntryRelevance(score: 5)
  }

  static func reloadDate(_ dates: [Date], now: Date) -> Date {
    guard let last = dates.last, last > now.addingTimeInterval(60) else {
      return now.addingTimeInterval(900)
    }
    return last
  }

  /// 0…1 fill for the last hour before `target` (same curve as the phone widgets).
  static func urgency(until target: Date?, now: Date, fallbackMinutes: Int?) -> Double {
    guard let target else {
      return WidgetReloadSchedule.countdownFraction(minutesUntil: fallbackMinutes)
    }
    let minutes = Int(max(0, target.timeIntervalSince(now)) / 60)
    return WidgetReloadSchedule.countdownFraction(minutesUntil: minutes)
  }
}

// MARK: - Shared chrome

private extension View {
  func watchComplicationURL(_ link: String?) -> some View {
    widgetURL(URL(string: link ?? "munib-tracker://"))
  }

  func watchSnapshotLocale(_ snapshot: WidgetSnapshotPayload) -> some View {
    environment(\.locale, Locale(identifier: snapshot.locale ?? "en"))
      .environment(
        \.layoutDirection,
        snapshot.isRtl == true ? .rightToLeft : .leftToRight
      )
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
  /// The timeline entry's date — the instant this rendering stands for.
  var now: Date = Date()

  private var section: WidgetSnapshotPayload.NextPrayerSection? { snapshot.nextPrayer }
  private var next: WatchNextSalah? { WatchSalahResolver.next(snapshot, now: now) }
  private var deepLink: String { section?.deepLink ?? "munib-tracker://" }
  private var prayerName: String { next?.name ?? "—" }
  private var prayerTime: String {
    let time = next?.time ?? ""
    return time.isEmpty ? "—" : time
  }
  private var target: Date? { next?.at }
  /// Frozen phone text, only for snapshots without an Adhan instant.
  private var frozenCountdown: String {
    target == nil ? (section?.countdownLabel ?? section?.lockScreenDetail ?? "") : ""
  }
  private var urgency: Double {
    WatchComplicationSchedule.urgency(until: target, now: now, fallbackMinutes: section?.minutesUntil)
  }

  var body: some View {
    Group {
      if snapshot.locationDenied == true {
        DeniedOrEmpty(message: snapshot.strings?.setLocationHint ?? "Set location")
      } else if next == nil {
        DeniedOrEmpty(message: snapshot.strings?.staleData ?? snapshot.strings?.openAppToSync ?? "Open Munib")
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
    .watchContainerBackground()
  }

  /// Live countdown to the Adhan; the frozen phone label on older snapshots.
  @ViewBuilder
  private var countdownText: some View {
    if let target, target > now {
      Text(target, style: .timer)
        .monospacedDigit()
    } else if !frozenCountdown.isEmpty {
      Text(frozenCountdown)
    } else {
      Text(prayerTime)
    }
  }

  private var inlineBody: some View {
    Text("\(prayerName) · \(prayerTime)")
  }

  private var circularBody: some View {
    Gauge(value: urgency) {
      VStack(spacing: 0) {
        Text(prayerName)
          .font(.caption2.weight(.semibold))
          .widgetAccentable()
          .minimumScaleFactor(0.6)
          .lineLimit(1)
        Group {
          if isLuminanceReduced {
            Text(prayerTime)
          } else {
            countdownText
          }
        }
        .font(.caption2)
        .minimumScaleFactor(0.5)
        .lineLimit(1)
      }
    }
    .gaugeStyle(.accessoryCircularCapacity)
    .widgetLabel {
      Text(prayerTime)
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
          Text(prayerTime)
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
        if !isLuminanceReduced, target != nil || !frozenCountdown.isEmpty {
          Text("·")
            .foregroundStyle(.secondary)
          countdownText
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
      WatchNextPrayerComplicationView(snapshot: entry.snapshot, now: entry.date)
        .watchSnapshotLocale(entry.snapshot)
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
  var now: Date = Date()

  private var section: WidgetSnapshotPayload.ScheduleSection? { snapshot.schedule }
  private var deepLink: String { section?.deepLink ?? "munib-tracker://tracker" }
  private var allRows: [WatchSalahRow] { WatchSalahResolver.rows(snapshot, now: now) }

  /// A window of 2–3 rows starting at the first Salah that isn't logged yet.
  private var rows: [WatchSalahRow] {
    let limit = family == .accessoryRectangular ? 3 : 2
    let all = allRows
    guard all.count > limit else { return all }
    let first = all.firstIndex { $0.state != .completed } ?? (all.count - limit)
    let start = min(first, all.count - limit)
    return Array(all[start..<(start + limit)])
  }

  var body: some View {
    Group {
      if snapshot.locationDenied == true {
        DeniedOrEmpty(message: snapshot.strings?.setLocationHint ?? "Set location")
      } else if WatchSalahResolver.isStale(snapshot, now: now) {
        DeniedOrEmpty(message: snapshot.strings?.staleData ?? "Open Munib")
      } else {
        switch family {
        case .accessoryInline:
          inlineBody
        case .accessoryRectangular:
          rectangularBody
        default:
          rectangularBody
        }
      }
    }
    .watchComplicationURL(deepLink)
    .watchContainerBackground()
  }

  private var inlineBody: some View {
    if let next = allRows.first(where: { $0.state == .next }) {
      return Text("\(next.name) · \(next.time)")
    }
    return Text(section?.lockScreenLine ?? section?.summary ?? "Today's Salah")
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
        ForEach(rows) { row in
          HStack(spacing: 4) {
            rowGlyph(row.state)
            Text(row.name)
              .font(.caption.weight(row.state == .next || row.state == .due ? .bold : .semibold))
              .foregroundStyle(rowStatusColor(row.state))
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

  @ViewBuilder
  private func rowGlyph(_ state: WatchSalahState) -> some View {
    switch state {
    case .completed:
      Image(systemName: "checkmark")
        .font(.caption2.weight(.bold))
        .foregroundStyle(.secondary)
    case .next:
      Circle()
        .fill(Color.accentColor)
        .frame(width: 5, height: 5)
    case .due:
      Circle()
        .stroke(Color.accentColor, lineWidth: 1)
        .frame(width: 5, height: 5)
    case .upcoming:
      EmptyView()
    }
  }

  private func rowStatusColor(_ state: WatchSalahState) -> Color {
    switch state {
    case .completed: return .green
    case .next, .due: return .primary
    case .upcoming: return .secondary
    }
  }
}

struct WatchScheduleComplication: Widget {
  let kind = "WatchScheduleComplication"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: WatchComplicationProvider()) { entry in
      WatchScheduleComplicationView(snapshot: entry.snapshot, now: entry.date)
        .watchSnapshotLocale(entry.snapshot)
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
  /// The timeline entry's instant: past midnight the phone's count is yesterday's.
  var now: Date = Date()

  private var section: WidgetSnapshotPayload.ProgressSection? { snapshot.progress }
  private var deepLink: String { section?.deepLink ?? "munib-tracker://tracker" }
  /// A new day starts with nothing logged until the phone pushes again.
  private var isStale: Bool { WatchSalahResolver.isStale(snapshot, now: now) }
  private var label: String {
    if isStale { return "0/\(section?.total ?? 5)" }
    return section?.progressLabel ?? "0/5"
  }
  private var fraction: Double { isStale ? 0 : (section?.progressPercent ?? 0) / 100 }

  var body: some View {
    Group {
      switch family {
      case .accessoryInline:
        Text(isStale ? label : (section?.lockScreenDetail ?? label))
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
    .watchContainerBackground()
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
      WatchProgressComplicationView(snapshot: entry.snapshot, now: entry.date)
        .watchSnapshotLocale(entry.snapshot)
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
    .watchContainerBackground()
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
        .watchSnapshotLocale(entry.snapshot)
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
    .watchContainerBackground()
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
        .watchSnapshotLocale(entry.snapshot)
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
        DeniedOrEmpty(message: snapshot.strings?.setLocationHint ?? "Set location")
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
    .watchContainerBackground()
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
        .watchSnapshotLocale(entry.snapshot)
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

// MARK: - Islamic date

struct WatchHijriDateComplicationView: View {
  @Environment(\.widgetFamily) private var family
  @Environment(\.isLuminanceReduced) private var isLuminanceReduced
  let snapshot: WidgetSnapshotPayload
  var now: Date = Date()

  private var section: WidgetSnapshotPayload.HijriSection? { snapshot.hijriDate }
  private var deepLink: String { section?.deepLink ?? "munib-tracker://calendar" }
  private var hijri: String {
    let value = section?.hijriDate ?? ""
    return value == "—" ? "" : value
  }
  /// After midnight the phone's date string belongs to yesterday: never show a wrong date.
  private var usable: Bool { !hijri.isEmpty && !WatchSalahResolver.isStale(snapshot, now: now) }

  var body: some View {
    Group {
      if !usable {
        switch family {
        case .accessoryInline:
          Text(section?.title ?? "Islamic date")
        case .accessoryCircular:
          ZStack {
            AccessoryWidgetBackground()
            Image(systemName: "moon.stars.fill")
              .font(.title3.weight(.semibold))
              .widgetAccentable()
          }
        default:
          DeniedOrEmpty(message: snapshot.strings?.openAppToSync ?? "Open Munib")
        }
      } else {
        switch family {
        case .accessoryInline:
          Text(hijri)
        case .accessoryCircular:
          circularBody
        case .accessoryRectangular:
          rectangularBody
        default:
          rectangularBody
        }
      }
    }
    .watchComplicationURL(deepLink)
    .watchContainerBackground()
  }

  /// Day number of the Hijri date (first run of digits) with the moon glyph.
  private var circularBody: some View {
    ZStack {
      AccessoryWidgetBackground()
      VStack(spacing: 0) {
        Image(systemName: "moon.stars.fill")
          .font(.caption.weight(.semibold))
          .widgetAccentable()
        Text(dayNumber ?? "")
          .font(.title3.weight(.bold))
          .minimumScaleFactor(0.6)
          .lineLimit(1)
      }
    }
    .widgetLabel {
      Text(hijri)
    }
  }

  private var rectangularBody: some View {
    VStack(alignment: .leading, spacing: 2) {
      Text(section?.title ?? "Islamic date")
        .font(.caption2)
        .foregroundStyle(.secondary)
      Text(hijri)
        .font(.headline)
        .widgetAccentable()
        .minimumScaleFactor(0.6)
        .lineLimit(2)
      if !isLuminanceReduced {
        Text([section?.weekday, section?.gregorianDate].compactMap { $0 }.filter { !$0.isEmpty }.joined(separator: " · "))
          .font(.caption2)
          .foregroundStyle(.secondary)
          .lineLimit(1)
          .minimumScaleFactor(0.7)
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    .watchContainerBackground()
  }

  /// Leading digits of the localized date (Latin or Arabic-Indic), nil when none.
  private var dayNumber: String? {
    let digits = hijri.drop { !$0.isNumber }.prefix { $0.isNumber }
    return digits.isEmpty ? nil : String(digits)
  }
}

struct WatchHijriDateComplication: Widget {
  let kind = "WatchHijriDateComplication"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: WatchComplicationProvider()) { entry in
      WatchHijriDateComplicationView(snapshot: entry.snapshot, now: entry.date)
        .watchSnapshotLocale(entry.snapshot)
    }
    .configurationDisplayName("Islamic date")
    .description("Today's Hijri date with the weekday.")
    .supportedFamilies([.accessoryCircular, .accessoryInline, .accessoryRectangular])
  }
}

// MARK: - Tasbeeh launcher

struct WatchTasbeehComplicationView: View {
  @Environment(\.widgetFamily) private var family
  @Environment(\.showsWidgetLabel) private var showsWidgetLabel
  let snapshot: WidgetSnapshotPayload

  /// The watch app's own counter (watch App Group) — never the phone's.
  private var count: Int { WatchTasbeehStore.count }
  private var target: Int { WatchTasbeehStore.target }
  private var label: String { target > 0 ? "\(count)/\(target)" : "\(count)" }
  private var title: String { snapshot.strings?.tasbeeh ?? "Tasbeeh" }
  private var fraction: Double {
    target > 0 ? min(max(Double(count) / Double(target), 0), 1) : 0
  }

  var body: some View {
    Group {
      switch family {
      case .accessoryCorner:
        cornerBody
      default:
        circularBody
      }
    }
    .widgetURL(URL(string: "munib-tracker://tasbeeh/free"))
    .watchContainerBackground()
  }

  private var circularBody: some View {
    Group {
      if target > 0 {
        Gauge(value: fraction) {
          Image(systemName: "circle.grid.2x2.fill")
            .widgetAccentable()
        } currentValueLabel: {
          Text("\(count)")
            .minimumScaleFactor(0.5)
        }
        .gaugeStyle(.accessoryCircular)
      } else {
        ZStack {
          AccessoryWidgetBackground()
          VStack(spacing: 1) {
            Image(systemName: "circle.grid.2x2.fill")
              .font(.caption.weight(.semibold))
              .widgetAccentable()
            Text("\(count)")
              .font(.caption2.weight(.bold))
              .minimumScaleFactor(0.5)
              .lineLimit(1)
          }
        }
      }
    }
    .widgetLabel {
      Text(title)
    }
    .accessibilityLabel("\(title), \(label)")
  }

  private var cornerBody: some View {
    ZStack {
      AccessoryWidgetBackground()
      Image(systemName: "circle.grid.2x2.fill")
        .font(.title3.weight(.semibold))
        .widgetAccentable()
    }
    .widgetLabel {
      if showsWidgetLabel, target > 0 {
        Gauge(value: fraction) {
          Text(title)
        } currentValueLabel: {
          Text(label)
        }
        .gaugeStyle(.accessoryLinearCapacity)
      } else {
        Text(label)
      }
    }
    .accessibilityLabel("\(title), \(label)")
  }
}

struct WatchTasbeehComplication: Widget {
  let kind = WatchTasbeehStore.complicationKind

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: WatchComplicationProvider()) { entry in
      WatchTasbeehComplicationView(snapshot: entry.snapshot)
        .watchSnapshotLocale(entry.snapshot)
    }
    .configurationDisplayName("Tasbeeh")
    .description("Open the watch Tasbeeh counter from the face.")
    .supportedFamilies([.accessoryCircular, .accessoryCorner])
  }
}
