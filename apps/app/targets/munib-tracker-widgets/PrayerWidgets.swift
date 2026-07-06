import WidgetKit
import SwiftUI

// MARK: - Next Prayer

struct NextPrayerWidgetHomeView: View {
  @Environment(\.widgetFamily) private var family
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.NextPrayerSection? { snapshot?.nextPrayer }
  private var theme: ResolvedWidgetTheme { WidgetPalette.theme(from: snapshot) }
  private var compact: Bool { WidgetLayout.isSmall(family) }

  var body: some View {
    WidgetCard(
      theme: theme,
      accent: theme.primary,
      title: section?.title ?? "Next prayer",
      summary: compact ? "" : (section?.displayDate ?? ""),
      footer: compact ? nil : section?.ctaLabel,
      updatedAgo: snapshot?.updatedAgoLabel,
      deepLink: section?.deepLink ?? "munib-tracker://"
    ) {
      VStack(alignment: .leading, spacing: compact ? 2 : 4) {
        Text(section?.prayerName ?? "—")
          .font(compact ? .headline.weight(.bold) : .title2.weight(.bold))
          .foregroundStyle(theme.textPrimary)
          .widgetFittingText()
        Text(section?.prayerTime ?? "—")
          .font(compact ? .title3.weight(.bold) : .title.weight(.bold))
          .foregroundStyle(theme.primary)
          .widgetFittingText()
        Text(section?.countdownLabel ?? "")
          .font(.caption)
          .foregroundStyle(theme.textSecondary)
          .widgetFittingText()
        if !compact, let location = section?.location, !location.isEmpty {
          Text(location)
            .font(.caption2)
            .foregroundStyle(theme.textSecondary)
            .widgetFittingText()
        }
      }
    }
  }
}

struct NextPrayerWidgetView: View {
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.NextPrayerSection? { snapshot?.nextPrayer }

  var body: some View {
    WidgetEntryRouter(
      lockLine: section?.lockScreenLine ?? section?.title ?? "Next prayer",
      lockDetail: section?.lockScreenDetail ?? section?.countdownLabel ?? "—",
      deepLink: section?.deepLink ?? "munib-tracker://",
      circularLabel: section?.prayerTime ?? "—"
    ) {
      NextPrayerWidgetHomeView(snapshot: snapshot)
    }
  }
}

struct NextPrayerWidget: Widget {
  let kind = "NextPrayerWidget"
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: BasicWidgetProvider()) { entry in
      NextPrayerWidgetView(snapshot: entry.snapshot)
    }
    .configurationDisplayName("Next prayer")
    .description("Next prayer name, time, and countdown.")
    .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular, .accessoryInline, .accessoryCircular])
  }
}

// MARK: - Schedule

struct PrayerScheduleWidgetHomeView: View {
  @Environment(\.widgetFamily) private var family
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.ScheduleSection? { snapshot?.schedule }
  private var theme: ResolvedWidgetTheme { WidgetPalette.theme(from: snapshot) }
  private var compact: Bool { WidgetLayout.isSmall(family) }
  private var displayRows: [WidgetSnapshotPayload.ScheduleRow] {
    Array((section?.rows ?? []).prefix(WidgetLayout.scheduleRowLimit(for: family)))
  }

  var body: some View {
    WidgetCard(
      theme: theme,
      accent: theme.primary,
      title: section?.title ?? "Today's schedule",
      summary: compact ? "" : (section?.summary ?? ""),
      footer: compact ? nil : section?.ctaLabel,
      updatedAgo: snapshot?.updatedAgoLabel,
      deepLink: section?.deepLink ?? "munib-tracker://tracker"
    ) {
      if displayRows.isEmpty {
        Text(section?.summary ?? "Open the app to sync")
          .font(.caption)
          .foregroundStyle(theme.textSecondary)
      } else {
        ForEach(Array(displayRows.enumerated()), id: \.offset) { _, row in
          HStack {
            Text(row.name)
              .font(.caption.weight(.semibold))
              .foregroundStyle(scheduleStatusColor(row.status, theme: theme))
              .widgetFittingText()
            Spacer(minLength: 4)
            Text(row.time)
              .font(.caption)
              .foregroundStyle(theme.textSecondary)
          }
        }
      }
    }
  }
}

struct PrayerScheduleWidgetView: View {
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.ScheduleSection? { snapshot?.schedule }

  var body: some View {
    WidgetEntryRouter(
      lockLine: section?.lockScreenLine ?? section?.title ?? "Today's schedule",
      lockDetail: section?.lockScreenDetail ?? section?.summary ?? "—",
      deepLink: section?.deepLink ?? "munib-tracker://tracker"
    ) {
      PrayerScheduleWidgetHomeView(snapshot: snapshot)
    }
  }
}

struct PrayerScheduleWidget: Widget {
  let kind = "PrayerScheduleWidget"
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: BasicWidgetProvider()) { entry in
      PrayerScheduleWidgetView(snapshot: entry.snapshot)
    }
    .configurationDisplayName("Schedule")
    .description("Today's obligatory prayer times.")
    .supportedFamilies([.systemSmall, .systemMedium, .systemLarge, .accessoryRectangular, .accessoryInline])
  }
}

// MARK: - Progress

struct PrayerProgressWidgetHomeView: View {
  @Environment(\.widgetFamily) private var family
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.ProgressSection? { snapshot?.progress }
  private var theme: ResolvedWidgetTheme { WidgetPalette.theme(from: snapshot) }
  private var compact: Bool { WidgetLayout.isSmall(family) }

  var body: some View {
    WidgetCard(
      theme: theme,
      accent: theme.success,
      title: section?.title ?? "Today's progress",
      summary: compact ? "" : (section?.lockScreenDetail ?? ""),
      footer: compact ? nil : section?.ctaLabel,
      updatedAgo: snapshot?.updatedAgoLabel,
      deepLink: section?.deepLink ?? "munib-tracker://tracker"
    ) {
      VStack(alignment: .leading, spacing: compact ? 4 : 8) {
        Text(section?.progressLabel ?? "0/5")
          .font(compact ? .title2.weight(.bold) : .largeTitle.weight(.bold))
          .foregroundStyle(theme.success)
          .widgetFittingText()
        if !compact {
          WidgetProgressBar(
            percent: section?.progressPercent ?? 0,
            fill: theme.success,
            track: theme.border
          )
        }
      }
    }
  }
}

struct PrayerProgressWidgetView: View {
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.ProgressSection? { snapshot?.progress }

  var body: some View {
    WidgetEntryRouter(
      lockLine: section?.lockScreenLine ?? section?.title ?? "Today's progress",
      lockDetail: section?.lockScreenDetail ?? section?.progressLabel ?? "0/5",
      deepLink: section?.deepLink ?? "munib-tracker://tracker",
      circularLabel: section?.progressLabel ?? "0/5"
    ) {
      PrayerProgressWidgetHomeView(snapshot: snapshot)
    }
  }
}

struct PrayerProgressWidget: Widget {
  let kind = "PrayerProgressWidget"
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: BasicWidgetProvider()) { entry in
      PrayerProgressWidgetView(snapshot: entry.snapshot)
    }
    .configurationDisplayName("Progress")
    .description("Today's obligatory prayer progress.")
    .supportedFamilies([.systemSmall, .accessoryRectangular, .accessoryCircular])
  }
}
