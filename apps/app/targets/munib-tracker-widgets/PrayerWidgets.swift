import WidgetKit
import SwiftUI
import AppIntents

// MARK: - Next Prayer

struct NextPrayerWidgetHomeView: View {
  @Environment(\.widgetFamily) private var family
  @Environment(\.colorScheme) private var colorScheme
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.NextPrayerSection? { snapshot?.nextPrayer }
  private var theme: ResolvedWidgetTheme { WidgetPalette.theme(from: snapshot, colorScheme: colorScheme) }
  private var compact: Bool { WidgetLayout.isSmall(family) }
  private var medium: Bool { WidgetLayout.isMedium(family) }

  var body: some View {
    WidgetCard(
      theme: theme,
      accent: theme.primary,
      title: section?.title ?? "Next Salah",
      summary: compact ? "" : (section?.displayDate ?? ""),
      footer: nil,
      updatedAgo: WidgetReloadSchedule.updatedAgoLabel(from: snapshot),
      deepLink: section?.deepLink ?? "munib-tracker://",
      accessibilityLabelText: section?.accessibilityLabel,
      compactChrome: compact,
      markLabel: section?.markLabel ?? "Mark Salah",
      showMark: !compact && snapshot?.locationDenied != true,
      markPrayerId: section?.prayerId
    ) {
      VStack(alignment: .leading, spacing: compact ? 2 : 4) {
        Text(section?.prayerName ?? "—")
          .font(compact ? .headline.weight(.bold) : .title2.weight(.bold))
          .foregroundStyle(theme.textPrimary)
          .widgetFittingText(maxLines: 2)
          .invalidatableContent()
        Text(section?.prayerTime ?? "—")
          .font(compact ? .title2.weight(.bold) : .title.weight(.bold))
          .foregroundStyle(theme.primary)
          .widgetFittingText(maxLines: 1)
          .invalidatableContent()
        WidgetLiveCountdown(
          targetTimeMs: section?.targetTimeMs,
          fallback: section?.countdownLabel ?? "",
          theme: theme
        )
        if medium, let following = section?.followingName, !following.isEmpty {
          Text("\(following) · \(section?.followingTime ?? "")")
            .font(.caption2)
            .foregroundStyle(theme.textSecondary)
            .widgetFittingText(maxLines: 1)
        }
        if !compact, let location = section?.location, !location.isEmpty {
          Text(location)
            .font(.caption2)
            .foregroundStyle(theme.textSecondary)
            .privacySensitive()
            .widgetFittingText(maxLines: 1)
        }
      }
    }
    .widgetLocale(snapshot?.locale, isRtl: snapshot?.isRtl)
  }
}

struct NextPrayerWidgetView: View {
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.NextPrayerSection? { snapshot?.nextPrayer }

  var body: some View {
    WidgetEntryRouter(
      lockLine: section?.lockScreenLine ?? section?.title ?? "Next Salah",
      lockDetail: section?.lockScreenDetail ?? section?.countdownLabel ?? "—",
      deepLink: section?.deepLink ?? "munib-tracker://",
      circularLabel: section?.prayerName ?? section?.prayerTime ?? "—",
      circularGauge: WidgetReloadSchedule.countdownFraction(minutesUntil: section?.minutesUntil)
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
    .configurationDisplayName(LocalizedStringResource("widget.gallery.nextPrayer.label", defaultValue: "Next Salah"))
    .description(LocalizedStringResource("widget.gallery.nextPrayer.description", defaultValue: "Next Salah name, time, and countdown."))
    .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular, .accessoryInline, .accessoryCircular])
  }
}

// MARK: - Schedule

struct PrayerScheduleWidgetHomeView: View {
  @Environment(\.widgetFamily) private var family
  @Environment(\.colorScheme) private var colorScheme
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.ScheduleSection? { snapshot?.schedule }
  private var theme: ResolvedWidgetTheme { WidgetPalette.theme(from: snapshot, colorScheme: colorScheme) }
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
      updatedAgo: WidgetReloadSchedule.updatedAgoLabel(from: snapshot),
      deepLink: section?.deepLink ?? "munib-tracker://tracker",
      accessibilityLabelText: section?.accessibilityLabel,
      compactChrome: compact,
      summaryPrivacySensitive: true
    ) {
      if displayRows.isEmpty {
        Text(section?.summary ?? "Open the app to sync")
          .font(.caption)
          .foregroundStyle(theme.textSecondary)
          .widgetFittingText(maxLines: 3)
      } else {
        VStack(spacing: compact ? 3 : 5) {
          ForEach(Array(displayRows.enumerated()), id: \.offset) { _, row in
            HStack(spacing: 6) {
              HStack(spacing: 6) {
                Circle()
                  .fill(scheduleStatusColor(row.status, theme: theme))
                  .frame(width: 7, height: 7)
                  .accessibilityHidden(true)
                  .invalidatableContent()
                Text(row.name)
                  .font(.caption.weight(.semibold))
                  .foregroundStyle(scheduleStatusColor(row.status, theme: theme))
                  .widgetFittingText(maxLines: 1)
                Text(row.statusLabel ?? row.status ?? "")
                  .font(.caption2)
                  .foregroundStyle(theme.textSecondary)
                  .widgetFittingText(maxLines: 1)
                  .invalidatableContent()
                Spacer(minLength: 4)
                Text(row.time)
                  .font(.caption.monospacedDigit())
                  .foregroundStyle(theme.textSecondary)
                  .widgetFittingText(maxLines: 1)
              }
              .accessibilityElement(children: .combine)
              .accessibilityLabel("\(row.name), \(row.time), \(row.statusLabel ?? row.status ?? "")")

              if !compact, row.status != "completed", #available(iOS 17.0, *) {
                Button(intent: MarkNamedSalahIntent(prayerId: row.id)) {
                  Image(systemName: "checkmark.circle")
                    .font(.callout)
                    .foregroundStyle(theme.textSecondary)
                    .frame(width: 22, height: 22)
                }
                .buttonStyle(.plain)
                .accessibilityLabel("\(section?.markLabel ?? snapshot?.strings?.markSalah ?? "Mark") \(row.name)")
              }
            }
          }
        }
      }
    }
    .widgetLocale(snapshot?.locale, isRtl: snapshot?.isRtl)
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
    .configurationDisplayName(LocalizedStringResource("widget.gallery.schedule.label", defaultValue: "Schedule"))
    .description(LocalizedStringResource("widget.gallery.schedule.description", defaultValue: "Today's obligatory Salah times."))
    .supportedFamilies([.systemSmall, .systemMedium, .systemLarge, .accessoryRectangular, .accessoryInline])
  }
}

// MARK: - Progress

struct PrayerProgressWidgetHomeView: View {
  @Environment(\.widgetFamily) private var family
  @Environment(\.colorScheme) private var colorScheme
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.ProgressSection? { snapshot?.progress }
  private var theme: ResolvedWidgetTheme { WidgetPalette.theme(from: snapshot, colorScheme: colorScheme) }
  private var compact: Bool { WidgetLayout.isSmall(family) }

  var body: some View {
    WidgetCard(
      theme: theme,
      accent: theme.success,
      title: section?.title ?? "Today's progress",
      summary: compact ? "" : (section?.lockScreenDetail ?? ""),
      footer: nil,
      updatedAgo: WidgetReloadSchedule.updatedAgoLabel(from: snapshot),
      deepLink: section?.deepLink ?? "munib-tracker://tracker",
      accessibilityLabelText: section?.accessibilityLabel,
      compactChrome: compact,
      markLabel: section?.markLabel ?? "Mark Salah",
      showMark: !compact
    ) {
      VStack(alignment: .leading, spacing: compact ? 6 : 8) {
        Text(section?.progressLabel ?? "0/5")
          .font(compact ? .title.weight(.bold) : .largeTitle.weight(.bold))
          .foregroundStyle(theme.success)
          .widgetFittingText(maxLines: 1)
        WidgetProgressBar(
          percent: section?.progressPercent ?? 0,
          fill: theme.success,
          track: theme.border
        )
      }
    }
    .widgetLocale(snapshot?.locale, isRtl: snapshot?.isRtl)
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
      circularLabel: section?.progressLabel ?? "0/5",
      circularGauge: (section?.progressPercent ?? 0) / 100
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
    .configurationDisplayName(LocalizedStringResource("widget.gallery.progress.label", defaultValue: "Progress"))
    .description(LocalizedStringResource("widget.gallery.progress.description", defaultValue: "Today's obligatory Salah progress."))
    .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular, .accessoryCircular])
  }
}

// MARK: - Streak

struct SalahStreakWidgetHomeView: View {
  @Environment(\.widgetFamily) private var family
  @Environment(\.colorScheme) private var colorScheme
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.StreakSection? { snapshot?.streak }
  private var theme: ResolvedWidgetTheme { WidgetPalette.theme(from: snapshot, colorScheme: colorScheme) }
  private var compact: Bool { WidgetLayout.isSmall(family) }

  var body: some View {
    WidgetCard(
      theme: theme,
      accent: theme.primary,
      title: section?.title ?? "Salah streak",
      summary: compact ? "" : (section?.lockScreenDetail ?? ""),
      footer: nil,
      updatedAgo: nil,
      deepLink: section?.deepLink ?? "munib-tracker://statistics",
      accessibilityLabelText: section?.accessibilityLabel,
      compactChrome: compact
    ) {
      VStack(alignment: .leading, spacing: 4) {
        Text(section?.streakLabel ?? "0")
          .font(.system(size: compact ? 36 : 42, weight: .bold, design: .rounded))
          .foregroundStyle(theme.primary)
          .widgetFittingText(maxLines: 1)
        Text(section?.summary ?? "")
          .font(.caption)
          .foregroundStyle(theme.textSecondary)
          .widgetFittingText(maxLines: 2)
      }
    }
    .widgetLocale(snapshot?.locale, isRtl: snapshot?.isRtl)
  }
}

struct SalahStreakWidgetView: View {
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.StreakSection? { snapshot?.streak }

  var body: some View {
    WidgetEntryRouter(
      lockLine: section?.lockScreenLine ?? section?.title ?? "Salah streak",
      lockDetail: section?.lockScreenDetail ?? section?.summary ?? "—",
      deepLink: section?.deepLink ?? "munib-tracker://statistics",
      circularLabel: section?.streakLabel ?? "0",
      circularGauge: min(1, Double(section?.streakDays ?? 0) / 40)
    ) {
      SalahStreakWidgetHomeView(snapshot: snapshot)
    }
  }
}

struct SalahStreakWidget: Widget {
  let kind = "SalahStreakWidget"
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: BasicWidgetProvider()) { entry in
      SalahStreakWidgetView(snapshot: entry.snapshot)
    }
    .configurationDisplayName(LocalizedStringResource("widget.gallery.streak.label", defaultValue: "Salah streak"))
    .description(LocalizedStringResource("widget.gallery.streak.description", defaultValue: "Current obligatory Salah streak."))
    .supportedFamilies([.systemSmall, .systemMedium, .accessoryCircular, .accessoryRectangular, .accessoryInline])
  }
}

// MARK: - Qaza

struct QazaDebtWidgetHomeView: View {
  @Environment(\.widgetFamily) private var family
  @Environment(\.colorScheme) private var colorScheme
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.QazaSection? { snapshot?.qaza }
  private var theme: ResolvedWidgetTheme { WidgetPalette.theme(from: snapshot, colorScheme: colorScheme) }
  private var compact: Bool { WidgetLayout.isSmall(family) }

  var body: some View {
    WidgetCard(
      theme: theme,
      accent: theme.warning,
      title: section?.title ?? "Qaza",
      summary: compact ? "" : (section?.todayLabel ?? ""),
      footer: nil,
      updatedAgo: nil,
      deepLink: section?.deepLink ?? "munib-tracker://qaza",
      accessibilityLabelText: section?.accessibilityLabel,
      compactChrome: compact
    ) {
      VStack(alignment: .leading, spacing: 6) {
        Text("\(section?.remaining ?? 0)")
          .font(.system(size: compact ? 32 : 36, weight: .bold, design: .rounded))
          .foregroundStyle(theme.warning)
          .widgetFittingText(maxLines: 1)
        Text(section?.remainingLabel ?? "")
          .font(.caption)
          .foregroundStyle(theme.textSecondary)
          .widgetFittingText(maxLines: 2)
        if (section?.todayTarget ?? 0) > 0 {
          WidgetProgressBar(
            percent: section?.progressPercent ?? 0,
            fill: theme.warning,
            track: theme.border
          )
        }
      }
    }
    .widgetLocale(snapshot?.locale, isRtl: snapshot?.isRtl)
  }
}

struct QazaDebtWidgetView: View {
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.QazaSection? { snapshot?.qaza }

  var body: some View {
    WidgetEntryRouter(
      lockLine: section?.lockScreenLine ?? section?.title ?? "Qaza",
      lockDetail: section?.lockScreenDetail ?? section?.todayLabel ?? "—",
      deepLink: section?.deepLink ?? "munib-tracker://qaza",
      circularLabel: "\(section?.remaining ?? 0)",
      circularGauge: (section?.progressPercent ?? 0) / 100
    ) {
      QazaDebtWidgetHomeView(snapshot: snapshot)
    }
  }
}

struct QazaDebtWidget: Widget {
  let kind = "QazaDebtWidget"
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: BasicWidgetProvider()) { entry in
      QazaDebtWidgetView(snapshot: entry.snapshot)
    }
    .configurationDisplayName(LocalizedStringResource("widget.gallery.qaza.label", defaultValue: "Qaza"))
    .description(LocalizedStringResource("widget.gallery.qaza.description", defaultValue: "Remaining qaza and today's make-up progress."))
    .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular, .accessoryCircular])
  }
}

// MARK: - Ramadan

struct RamadanWidgetHomeView: View {
  @Environment(\.widgetFamily) private var family
  @Environment(\.colorScheme) private var colorScheme
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.RamadanSection? { snapshot?.ramadan }
  private var theme: ResolvedWidgetTheme { WidgetPalette.theme(from: snapshot, colorScheme: colorScheme) }
  private var compact: Bool { WidgetLayout.isSmall(family) }

  var body: some View {
    WidgetCard(
      theme: theme,
      accent: theme.primary,
      title: section?.title ?? "Ramadan",
      summary: compact ? "" : (section?.dayLabel ?? ""),
      footer: nil,
      updatedAgo: nil,
      deepLink: section?.deepLink ?? "munib-tracker://ramadan",
      accessibilityLabelText: section?.accessibilityLabel,
      compactChrome: compact
    ) {
      VStack(alignment: .leading, spacing: 6) {
        HStack(alignment: .top, spacing: 10) {
          VStack(alignment: .leading, spacing: 2) {
            Text(section?.suhoorLabel ?? "Suhoor")
              .font(.caption2)
              .foregroundStyle(theme.textSecondary)
              .widgetFittingText(maxLines: 1)
            Text(section?.suhoorTime ?? "—")
              .font(.headline.weight(.bold))
              .foregroundStyle(theme.primary)
              .widgetFittingText(maxLines: 1)
          }
          .frame(maxWidth: .infinity, alignment: .leading)
          VStack(alignment: .leading, spacing: 2) {
            Text(section?.iftarLabel ?? "Iftar")
              .font(.caption2)
              .foregroundStyle(theme.textSecondary)
              .widgetFittingText(maxLines: 1)
            Text(section?.iftarTime ?? "—")
              .font(.headline.weight(.bold))
              .foregroundStyle(theme.primary)
              .widgetFittingText(maxLines: 1)
          }
          .frame(maxWidth: .infinity, alignment: .leading)
        }
        WidgetLiveCountdown(
          targetTimeMs: section?.targetTimeMs,
          fallback: section?.countdownLabel ?? "",
          theme: theme
        )
      }
    }
    .widgetLocale(snapshot?.locale, isRtl: snapshot?.isRtl)
  }
}

struct RamadanWidgetView: View {
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.RamadanSection? { snapshot?.ramadan }

  var body: some View {
    WidgetEntryRouter(
      lockLine: section?.lockScreenLine ?? section?.title ?? "Ramadan",
      lockDetail: section?.lockScreenDetail ?? section?.countdownLabel ?? "—",
      deepLink: section?.deepLink ?? "munib-tracker://ramadan"
    ) {
      RamadanWidgetHomeView(snapshot: snapshot)
    }
  }
}

struct RamadanWidget: Widget {
  let kind = "RamadanWidget"
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: BasicWidgetProvider()) { entry in
      RamadanWidgetView(snapshot: entry.snapshot)
    }
    .configurationDisplayName(LocalizedStringResource("widget.gallery.ramadan.label", defaultValue: "Ramadan"))
    .description(LocalizedStringResource("widget.gallery.ramadan.description", defaultValue: "Suhoor and iftar times with countdown."))
    .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular, .accessoryInline])
  }
}

// MARK: - Khatm

struct KhatmProgressWidgetHomeView: View {
  @Environment(\.widgetFamily) private var family
  @Environment(\.colorScheme) private var colorScheme
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.KhatmSection? { snapshot?.khatm }
  private var theme: ResolvedWidgetTheme { WidgetPalette.theme(from: snapshot, colorScheme: colorScheme) }
  private var compact: Bool { WidgetLayout.isSmall(family) }

  var body: some View {
    WidgetCard(
      theme: theme,
      accent: theme.primary,
      title: section?.title ?? "Khatm plan",
      summary: compact ? "" : (section?.paceLabel ?? ""),
      footer: nil,
      updatedAgo: nil,
      deepLink: section?.deepLink ?? "munib-tracker://quran/khatm",
      accessibilityLabelText: section?.accessibilityLabel,
      compactChrome: compact
    ) {
      VStack(alignment: .leading, spacing: 6) {
        Text(section?.hasPlan == true ? (section?.progressLabel ?? "0%") : "—")
          .font(.title.weight(.bold))
          .foregroundStyle(theme.primary)
          .widgetFittingText(maxLines: 1)
        if section?.hasPlan == true {
          WidgetProgressBar(
            percent: section?.progressPercent ?? 0,
            fill: theme.primary,
            track: theme.border
          )
        }
        Text(section?.todayLabel ?? "")
          .font(.caption)
          .foregroundStyle(theme.textSecondary)
          .widgetFittingText(maxLines: 2)
      }
    }
    .widgetLocale(snapshot?.locale, isRtl: snapshot?.isRtl)
  }
}

struct KhatmProgressWidgetView: View {
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.KhatmSection? { snapshot?.khatm }

  var body: some View {
    WidgetEntryRouter(
      lockLine: section?.lockScreenLine ?? section?.title ?? "Khatm plan",
      lockDetail: section?.lockScreenDetail ?? section?.todayLabel ?? "—",
      deepLink: section?.deepLink ?? "munib-tracker://quran/khatm",
      circularLabel: section?.progressLabel ?? "0%",
      circularGauge: (section?.progressPercent ?? 0) / 100
    ) {
      KhatmProgressWidgetHomeView(snapshot: snapshot)
    }
  }
}

struct KhatmProgressWidget: Widget {
  let kind = "KhatmProgressWidget"
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: BasicWidgetProvider()) { entry in
      KhatmProgressWidgetView(snapshot: entry.snapshot)
    }
    .configurationDisplayName(LocalizedStringResource("widget.gallery.khatm.label", defaultValue: "Khatm"))
    .description(LocalizedStringResource("widget.gallery.khatm.description", defaultValue: "Qur'an Khatm plan progress."))
    .supportedFamilies([.systemSmall, .systemMedium, .accessoryCircular, .accessoryRectangular])
  }
}

// MARK: - Daily Hadith

struct DailyHadithWidgetHomeView: View {
  @Environment(\.widgetFamily) private var family
  @Environment(\.colorScheme) private var colorScheme
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.HadithSection? { snapshot?.dailyHadith }
  private var theme: ResolvedWidgetTheme { WidgetPalette.theme(from: snapshot, colorScheme: colorScheme) }
  private var compact: Bool { WidgetLayout.isSmall(family) }

  var body: some View {
    WidgetCard(
      theme: theme,
      accent: theme.primary,
      title: section?.title ?? "Daily hadith",
      summary: compact ? "" : (section?.reference ?? ""),
      footer: nil,
      updatedAgo: nil,
      deepLink: section?.deepLink ?? "munib-tracker://hadith/daily",
      accessibilityLabelText: section?.accessibilityLabel,
      compactChrome: compact
    ) {
      VStack(alignment: .leading, spacing: 6) {
        if !compact, let arabic = section?.arabic, !arabic.isEmpty {
          Text(arabic)
            .font(.caption.weight(.medium))
            .foregroundStyle(theme.textPrimary)
            .multilineTextAlignment(.trailing)
            .frame(maxWidth: .infinity, alignment: .trailing)
            .widgetFittingText(maxLines: 2)
        }
        Text(section?.meaning ?? "")
          .font(.caption)
          .foregroundStyle(theme.textSecondary)
          .widgetFittingText(maxLines: WidgetLayout.hadithMeaningLines(for: family))
      }
    }
    .widgetLocale(snapshot?.locale, isRtl: snapshot?.isRtl)
  }
}

struct DailyHadithWidgetView: View {
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.HadithSection? { snapshot?.dailyHadith }

  var body: some View {
    WidgetEntryRouter(
      lockLine: section?.lockScreenLine ?? section?.title ?? "Daily hadith",
      lockDetail: section?.lockScreenDetail ?? section?.meaning ?? "—",
      deepLink: section?.deepLink ?? "munib-tracker://hadith/daily"
    ) {
      DailyHadithWidgetHomeView(snapshot: snapshot)
    }
  }
}

struct DailyHadithWidget: Widget {
  let kind = "DailyHadithWidget"
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: BasicWidgetProvider()) { entry in
      DailyHadithWidgetView(snapshot: entry.snapshot)
    }
    .configurationDisplayName(LocalizedStringResource("widget.gallery.dailyHadith.label", defaultValue: "Daily hadith"))
    .description(LocalizedStringResource("widget.gallery.dailyHadith.description", defaultValue: "Today's hadith from Imam al-Nawawi's Forty."))
    .supportedFamilies([.systemSmall, .systemMedium, .systemLarge, .accessoryRectangular])
  }
}

// MARK: - Hijri date

struct HijriDateWidgetHomeView: View {
  @Environment(\.widgetFamily) private var family
  @Environment(\.colorScheme) private var colorScheme
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.HijriSection? { snapshot?.hijriDate }
  private var theme: ResolvedWidgetTheme { WidgetPalette.theme(from: snapshot, colorScheme: colorScheme) }
  private var compact: Bool { WidgetLayout.isSmall(family) }

  var body: some View {
    WidgetCard(
      theme: theme,
      accent: theme.primary,
      title: section?.title ?? "Islamic date",
      summary: compact ? "" : (section?.weekday ?? ""),
      footer: nil,
      updatedAgo: nil,
      deepLink: section?.deepLink ?? "munib-tracker://calendar",
      accessibilityLabelText: section?.accessibilityLabel,
      compactChrome: compact
    ) {
      VStack(alignment: .leading, spacing: 4) {
        Text(section?.hijriDate ?? "—")
          .font(.subheadline.weight(.bold))
          .foregroundStyle(theme.textPrimary)
          .widgetFittingText(maxLines: 2)
        Text(section?.gregorianDate ?? "—")
          .font(.caption)
          .foregroundStyle(theme.textSecondary)
          .widgetFittingText(maxLines: 2)
      }
    }
    .widgetLocale(snapshot?.locale, isRtl: snapshot?.isRtl)
  }
}

struct HijriDateWidgetView: View {
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.HijriSection? { snapshot?.hijriDate }

  var body: some View {
    WidgetEntryRouter(
      lockLine: section?.lockScreenLine ?? section?.hijriDate ?? "Islamic date",
      lockDetail: section?.lockScreenDetail ?? section?.gregorianDate ?? "—",
      deepLink: section?.deepLink ?? "munib-tracker://calendar",
      circularLabel: section?.hijriDate ?? "—"
    ) {
      HijriDateWidgetHomeView(snapshot: snapshot)
    }
  }
}

struct HijriDateWidget: Widget {
  let kind = "HijriDateWidget"
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: BasicWidgetProvider()) { entry in
      HijriDateWidgetView(snapshot: entry.snapshot)
    }
    .configurationDisplayName(LocalizedStringResource("widget.gallery.hijriDate.label", defaultValue: "Islamic date"))
    .description(LocalizedStringResource("widget.gallery.hijriDate.description", defaultValue: "Hijri and Gregorian date."))
    .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular, .accessoryInline, .accessoryCircular])
  }
}

// MARK: - Qibla bearing

struct QiblaBearingWidgetHomeView: View {
  @Environment(\.widgetFamily) private var family
  @Environment(\.colorScheme) private var colorScheme
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.QiblaSection? { snapshot?.qibla }
  private var theme: ResolvedWidgetTheme { WidgetPalette.theme(from: snapshot, colorScheme: colorScheme) }
  private var compact: Bool { WidgetLayout.isSmall(family) }

  var body: some View {
    WidgetCard(
      theme: theme,
      accent: theme.primary,
      title: section?.title ?? "Qibla",
      summary: compact ? "" : (section?.location ?? ""),
      footer: nil,
      updatedAgo: nil,
      deepLink: section?.deepLink ?? "munib-tracker://qibla",
      accessibilityLabelText: section?.accessibilityLabel,
      compactChrome: compact,
      summaryPrivacySensitive: true
    ) {
      VStack(alignment: .leading, spacing: 4) {
        Text(section?.bearingLabel ?? "—")
          .font(.system(size: compact ? 30 : 34, weight: .bold, design: .rounded))
          .foregroundStyle(theme.primary)
          .widgetFittingText(maxLines: 1)
        Text(section?.lockScreenDetail ?? "Direction to the Kaaba")
          .font(.caption)
          .foregroundStyle(theme.textSecondary)
          .widgetFittingText(maxLines: 2)
        if !compact, let location = section?.location, !location.isEmpty {
          Text(location)
            .font(.caption2)
            .foregroundStyle(theme.textSecondary)
            .privacySensitive()
            .widgetFittingText(maxLines: 1)
        }
      }
    }
    .widgetLocale(snapshot?.locale, isRtl: snapshot?.isRtl)
  }
}

struct QiblaBearingWidgetView: View {
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.QiblaSection? { snapshot?.qibla }

  var body: some View {
    WidgetEntryRouter(
      lockLine: section?.lockScreenLine ?? section?.bearingLabel ?? "Qibla",
      lockDetail: section?.lockScreenDetail ?? section?.location ?? "—",
      deepLink: section?.deepLink ?? "munib-tracker://qibla",
      circularLabel: section?.bearingLabel ?? "—"
    ) {
      QiblaBearingWidgetHomeView(snapshot: snapshot)
    }
  }
}

struct QiblaBearingWidget: Widget {
  let kind = "QiblaBearingWidget"
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: BasicWidgetProvider()) { entry in
      QiblaBearingWidgetView(snapshot: entry.snapshot)
    }
    .configurationDisplayName(LocalizedStringResource("widget.gallery.qibla.label", defaultValue: "Qibla"))
    .description(LocalizedStringResource("widget.gallery.qibla.description", defaultValue: "Compass bearing toward the Kaaba."))
    .supportedFamilies([.systemSmall, .systemMedium, .accessoryCircular, .accessoryRectangular, .accessoryInline])
  }
}

// MARK: - Tasbeeh glance

struct TasbeehGlanceWidgetHomeView: View {
  @Environment(\.widgetFamily) private var family
  @Environment(\.colorScheme) private var colorScheme
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.TasbeehSection? { snapshot?.tasbeeh }
  private var theme: ResolvedWidgetTheme { WidgetPalette.theme(from: snapshot, colorScheme: colorScheme) }
  private var compact: Bool { WidgetLayout.isSmall(family) }

  var body: some View {
    WidgetCard(
      theme: theme,
      accent: theme.primary,
      title: section?.title ?? "Tasbeeh",
      summary: compact ? "" : (section?.dhikrTitle ?? ""),
      footer: nil,
      updatedAgo: nil,
      deepLink: section?.deepLink ?? "munib-tracker://tasbeeh/free",
      accessibilityLabelText: section?.accessibilityLabel,
      compactChrome: compact
    ) {
      VStack(alignment: .leading, spacing: 6) {
        Text(section?.hasActivity == true ? (section?.countLabel ?? "0") : "—")
          .font(.system(size: compact ? 30 : 34, weight: .bold, design: .rounded))
          .foregroundStyle(theme.primary)
          .widgetFittingText(maxLines: 1)
        if section?.hasActivity == true, (section?.target ?? 0) > 0 {
          WidgetProgressBar(
            percent: section?.progressPercent ?? 0,
            fill: theme.primary,
            track: theme.border
          )
        }
        Text(section?.hasActivity == true ? (section?.dhikrTitle ?? "") : (section?.summary ?? ""))
          .font(.caption)
          .foregroundStyle(theme.textSecondary)
          .widgetFittingText(maxLines: 2)
      }
    }
    .widgetLocale(snapshot?.locale, isRtl: snapshot?.isRtl)
  }
}

struct TasbeehGlanceWidgetView: View {
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.TasbeehSection? { snapshot?.tasbeeh }

  var body: some View {
    WidgetEntryRouter(
      lockLine: section?.lockScreenLine ?? section?.title ?? "Tasbeeh",
      lockDetail: section?.lockScreenDetail ?? section?.summary ?? "—",
      deepLink: section?.deepLink ?? "munib-tracker://tasbeeh/free",
      circularLabel: section?.hasActivity == true ? (section?.countLabel ?? "0") : nil,
      circularGauge: (section?.target ?? 0) > 0 ? (section?.progressPercent ?? 0) / 100 : nil
    ) {
      TasbeehGlanceWidgetHomeView(snapshot: snapshot)
    }
  }
}

struct TasbeehGlanceWidget: Widget {
  let kind = "TasbeehGlanceWidget"
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: BasicWidgetProvider()) { entry in
      TasbeehGlanceWidgetView(snapshot: entry.snapshot)
    }
    .configurationDisplayName(LocalizedStringResource("widget.gallery.tasbeeh.label", defaultValue: "Tasbeeh"))
    .description(LocalizedStringResource("widget.gallery.tasbeeh.description", defaultValue: "Today's tasbeeh count and target at a glance."))
    .supportedFamilies([.systemSmall, .accessoryCircular, .accessoryRectangular, .accessoryInline])
  }
}

// MARK: - Jumu'ah

struct JumuahWidgetHomeView: View {
  @Environment(\.widgetFamily) private var family
  @Environment(\.colorScheme) private var colorScheme
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.FridaySection? { snapshot?.friday }
  private var theme: ResolvedWidgetTheme { WidgetPalette.theme(from: snapshot, colorScheme: colorScheme) }
  private var compact: Bool { WidgetLayout.isSmall(family) }

  var body: some View {
    WidgetCard(
      theme: theme,
      accent: theme.primary,
      title: section?.title ?? "Jumu'ah",
      summary: compact ? "" : (section?.lockScreenDetail ?? ""),
      footer: nil,
      updatedAgo: nil,
      deepLink: section?.deepLink ?? "munib-tracker://friday",
      accessibilityLabelText: section?.accessibilityLabel,
      compactChrome: compact
    ) {
      VStack(alignment: .leading, spacing: 6) {
        Text(
          section?.isFriday == true
            ? "\(section?.completed ?? 0)/\(section?.total ?? 0)"
            : "\(section?.daysUntil ?? 0)"
        )
        .font(.system(size: compact ? 30 : 34, weight: .bold, design: .rounded))
        .foregroundStyle(theme.primary)
        .widgetFittingText(maxLines: 1)
        if section?.isFriday == true, (section?.total ?? 0) > 0 {
          WidgetProgressBar(
            percent: section?.progressPercent ?? 0,
            fill: theme.primary,
            track: theme.border
          )
        }
        Text(section?.summary ?? "")
          .font(.caption)
          .foregroundStyle(theme.textSecondary)
          .widgetFittingText(maxLines: 2)
      }
    }
    .widgetLocale(snapshot?.locale, isRtl: snapshot?.isRtl)
  }
}

struct JumuahWidgetView: View {
  let snapshot: WidgetSnapshotPayload?
  private var section: WidgetSnapshotPayload.FridaySection? { snapshot?.friday }

  var body: some View {
    WidgetEntryRouter(
      lockLine: section?.lockScreenLine ?? section?.title ?? "Jumu'ah",
      lockDetail: section?.lockScreenDetail ?? section?.summary ?? "—",
      deepLink: section?.deepLink ?? "munib-tracker://friday"
    ) {
      JumuahWidgetHomeView(snapshot: snapshot)
    }
  }
}

struct JumuahWidget: Widget {
  let kind = "JumuahWidget"
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: BasicWidgetProvider()) { entry in
      JumuahWidgetView(snapshot: entry.snapshot)
    }
    .configurationDisplayName(LocalizedStringResource("widget.gallery.friday.label", defaultValue: "Jumu'ah"))
    .description(LocalizedStringResource("widget.gallery.friday.description", defaultValue: "Friday checklist progress or a countdown to Jumu'ah."))
    .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular, .accessoryInline])
  }
}

#if DEBUG
#Preview("Next Salah") {
  NextPrayerWidgetView(snapshot: WidgetSnapshotStore.placeholder())
}

#Preview("Schedule") {
  PrayerScheduleWidgetView(snapshot: WidgetSnapshotStore.placeholder())
}

#Preview("Progress") {
  PrayerProgressWidgetView(snapshot: WidgetSnapshotStore.placeholder())
}

#Preview("Tasbeeh") {
  TasbeehGlanceWidgetView(snapshot: WidgetSnapshotStore.placeholder())
}

#Preview("Jumu'ah") {
  JumuahWidgetView(snapshot: WidgetSnapshotStore.placeholder())
}
#endif
