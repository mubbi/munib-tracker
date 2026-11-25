import ActivityKit
import AppIntents
import SwiftUI
import WidgetKit

// MARK: - Palette & helpers

/// Resolved colors for the Live Activity, parsed from the JS-provided hex state.
/// Lock Screen may use a custom tint; Dynamic Island always sits on opaque black —
/// keep accent bold so compact/minimal stay recognizable (HIG: Choosing colors).
@available(iOS 16.2, *)
private struct LiveActivityPalette {
  let accent: Color
  let background: Color
  let textPrimary: Color
  let textSecondary: Color

  init(_ state: PrayerActivityAttributes.ContentState) {
    accent = Color(hex: state.primary) ?? .green
    background = Color(hex: state.cardBackground) ?? (state.isDark ? .black : .white)
    textPrimary = Color(hex: state.textPrimary) ?? (state.isDark ? .white : .primary)
    textSecondary = Color(hex: state.textSecondary) ?? .secondary
  }
}

@available(iOS 16.2, *)
private enum PrayerLiveActivitySymbol {
  static func name(for prayerId: String) -> String {
    switch prayerId.lowercased() {
    case "fajr": return "sunrise.fill"
    case "dhuhr", "zuhr": return "sun.max.fill"
    case "asr": return "sun.haze.fill"
    case "maghrib": return "sunset.fill"
    case "isha": return "moon.stars.fill"
    default: return "moon.stars.fill"
    }
  }
}

@available(iOS 16.2, *)
private extension PrayerActivityAttributes.ContentState {
  var timerRange: ClosedRange<Date> {
    let end = targetDate
    let remaining = max(end.timeIntervalSinceNow, 1)
    let window = TimeInterval(max(minutesUntil, 1)) * 60
    let start = end.addingTimeInterval(-max(window, remaining))
    if start < end { return start...end }
    let now = Date()
    return now...now.addingTimeInterval(1)
  }

  var progressFraction: Double {
    min(1, max(0, progressPercent / 100))
  }

  var metaLine: String {
    let time = prayerTimeLabel.isEmpty ? prayerTime : prayerTimeLabel
    if time.isEmpty { return location }
    if location.isEmpty { return time }
    return "\(time) · \(location)"
  }

  var remainingCaption: String {
    if phase != "upcoming" {
      return actionLabel
    }
    return remainingLabel.isEmpty ? countdownLabel : remainingLabel
  }

  /// Caption above the countdown: the stale warning wins while ActivityKit
  /// reports `isStale`, so a late push never shows a confident wrong time.
  func caption(isStale: Bool) -> String {
    if isStale, let staleLabel, !staleLabel.isEmpty { return staleLabel }
    return remainingCaption
  }

  var primaryActionLabel: String {
    actionLabel.isEmpty ? (prepareLabel.isEmpty ? "Prepare" : prepareLabel) : actionLabel
  }

  var primaryActionURL: URL {
    URL(string: actionDeepLink) ?? URL(string: "munib-tracker://zikr/before_prayer")!
  }

  var primaryActionSymbol: String {
    switch phase {
    case "markSalah": return "checkmark.circle"
    case "afterSalah": return "hands.sparkles"
    default: return "figure.stand"
    }
  }

  /// Phase glyph for the compact / minimal island when there's no countdown.
  var phaseSymbol: String {
    if phase == "afterSalah", displayedSalahDone { return "checkmark.seal.fill" }
    return primaryActionSymbol
  }

  var qiblaActionLabel: String {
    qiblaLabel.isEmpty ? "Qibla" : qiblaLabel
  }

  var showsConfirmation: Bool {
    phase == "afterSalah" && displayedSalahDone && !(confirmationLabel ?? "").isEmpty
  }

  var days: [PrayerActivityAttributes.DaySalah] {
    daySalah ?? []
  }
}

// MARK: - Countdown

/// Live countdown. Never apply `.fixedSize` to `Text(timerInterval:)` — it can
/// collapse Lock Screen layouts to an empty tinted banner on ActivityKit. Give it
/// a fixed `width` instead: in widgets the timer text fills the available width.
@available(iOS 16.2, *)
private struct CountdownText: View {
  let state: PrayerActivityAttributes.ContentState
  var font: Font = .headline
  var color: Color = .primary
  var width: CGFloat? = nil
  var alignment: TextAlignment = .trailing
  /// Compact island: show the bare clock ("1:15 PM") instead of "at 1:15 PM".
  var preferShortTime: Bool = false

  private var clockLabel: String {
    if preferShortTime, !state.prayerTime.isEmpty { return state.prayerTime }
    return state.prayerTimeLabel.isEmpty ? state.prayerTime : state.prayerTimeLabel
  }

  var body: some View {
    let now = Date()
    Group {
      if state.locationDenied {
        Text(state.countdownLabel)
          .font(font)
          .foregroundStyle(color)
          .multilineTextAlignment(alignment)
          .lineLimit(2)
          .minimumScaleFactor(0.7)
      } else if state.phase != "upcoming" {
        Text(clockLabel)
          .font(font)
          .foregroundStyle(color)
          .multilineTextAlignment(alignment)
          .lineLimit(1)
          .minimumScaleFactor(0.7)
      } else if state.targetDate > now {
        Text(timerInterval: state.timerRange, countsDown: true)
          .font(font)
          .monospacedDigit()
          .foregroundStyle(color)
          .multilineTextAlignment(alignment)
          .lineLimit(1)
          .minimumScaleFactor(0.65)
          .contentTransition(.numericText(countsDown: true))
      } else {
        // Frozen "in 45 min" labels are worse than the prayer clock if a push
        // is late and ActivityKit re-renders after staleDate.
        Text(clockLabel)
          .font(font)
          .foregroundStyle(color)
          .multilineTextAlignment(alignment)
          .lineLimit(1)
          .minimumScaleFactor(0.7)
      }
    }
    .frame(width: width, alignment: alignment == .trailing ? .trailing : .leading)
  }
}

@available(iOS 16.2, *)
private struct PrayerGlyph: View {
  let prayerId: String
  let color: Color
  var size: CGFloat = 18

  var body: some View {
    Image(systemName: PrayerLiveActivitySymbol.name(for: prayerId))
      .font(.system(size: size, weight: .semibold))
      .foregroundStyle(color)
      .symbolRenderingMode(.hierarchical)
  }
}

// MARK: - Today's Salah row

/// Five dots for today's obligatory Salah (filled = marked, ring = the Salah the
/// activity is about). Says *which* Salah are done, which a 3/5 bar can't.
/// Falls back to the linear bar when the state predates `daySalah`.
@available(iOS 16.2, *)
private struct SalahDayRow: View {
  let state: PrayerActivityAttributes.ContentState
  let accent: Color
  let secondary: Color
  var dotSize: CGFloat = 8

  var body: some View {
    HStack(spacing: 8) {
      if state.days.isEmpty {
        ProgressView(value: state.progressFraction)
          .progressViewStyle(.linear)
          .tint(accent)
      } else {
        HStack(spacing: dotSize * 0.75) {
          ForEach(Array(state.days.enumerated()), id: \.offset) { _, day in
            Circle()
              .fill(day.done ? accent : secondary.opacity(0.28))
              .frame(width: dotSize, height: dotSize)
              .overlay(
                Circle()
                  .strokeBorder(accent, lineWidth: day.id == state.prayerId && !day.done ? 1.5 : 0)
              )
          }
        }
        Spacer(minLength: 4)
      }
      if !state.progressLabel.isEmpty {
        Text(state.progressLabel)
          .font(.caption2.weight(.semibold))
          .foregroundStyle(secondary)
          .monospacedDigit()
      }
    }
    // Dots are decorative; VoiceOver reads the "3/5" label instead.
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(state.progressLabel)
    // Greys out between a Mark tap and the refreshed state (iOS 17+).
    .invalidatableContent()
  }
}

// MARK: - Actions

/// Capsule label so actions read as buttons (HIG: Live Activity buttons), not as
/// loose text. `.tint` alone doesn't color a Link's label in ActivityKit — the text
/// falls back to white and vanishes on light backgrounds, so style explicitly.
@available(iOS 16.2, *)
private struct ActionCapsule: View {
  let title: String
  let symbol: String
  let foreground: Color
  let fill: Color
  var font: Font = .caption.weight(.semibold)

  var body: some View {
    Label(title, systemImage: symbol)
      .font(font)
      .lineLimit(1)
      .minimumScaleFactor(0.8)
      .foregroundStyle(foreground)
      .frame(maxWidth: .infinity)
      .padding(.vertical, 7)
      .padding(.horizontal, 8)
      .background(Capsule().fill(fill))
  }
}

/// Primary action: an in-place **Mark Salah** button during the mark window (runs
/// `MarkSalahLiveActivityIntent`, no app launch), otherwise a deep link
/// (Prepare / after-Salah adhkar).
@available(iOS 16.2, *)
private struct PrimaryAction: View {
  let state: PrayerActivityAttributes.ContentState
  let accent: Color
  let fillOpacity: Double
  var font: Font = .caption.weight(.semibold)

  private var capsule: ActionCapsule {
    ActionCapsule(
      title: state.primaryActionLabel,
      symbol: state.primaryActionSymbol,
      foreground: accent,
      fill: accent.opacity(fillOpacity),
      font: font
    )
  }

  var body: some View {
    if state.canMarkInPlace {
      Button(intent: MarkSalahLiveActivityIntent()) { capsule }
        .buttonStyle(.plain)
    } else {
      Link(destination: state.primaryActionURL) { capsule }
    }
  }
}

@available(iOS 16.2, *)
private struct QiblaAction: View {
  let state: PrayerActivityAttributes.ContentState
  let foreground: Color
  let fillOpacity: Double
  var font: Font = .caption.weight(.semibold)

  var body: some View {
    Link(destination: URL(string: "munib-tracker://qibla")!) {
      ActionCapsule(
        title: state.qiblaActionLabel,
        symbol: "location.north.line.fill",
        foreground: foreground,
        fill: foreground.opacity(fillOpacity),
        font: font
      )
    }
  }
}

// MARK: - Lock Screen (+ StandBy fullscreen)

/// Lock Screen presentation — unique salah layout (not a notification card),
/// 14pt margins, glanceable hierarchy, today's Salah row (Apple HIG).
@available(iOS 16.2, *)
struct PrayerLiveActivityLockScreen: View {
  let state: PrayerActivityAttributes.ContentState
  var isStale: Bool = false
  @Environment(\.isActivityFullscreen) private var isFullscreen
  @Environment(\.isLuminanceReduced) private var isLuminanceReduced

  private var palette: LiveActivityPalette { LiveActivityPalette(state) }

  /// Always-On: drop the capsule fills so the dimmed Lock Screen keeps only text
  /// (HIG: check tint contrast with reduced luminance).
  private var fillOpacity: Double { isLuminanceReduced ? 0 : 0.14 }

  var body: some View {
    VStack(alignment: .leading, spacing: isFullscreen ? 14 : 10) {
      HStack(alignment: .center, spacing: 12) {
        leadingColumn
        Spacer(minLength: 8)
        trailingColumn
      }

      if !state.locationDenied {
        SalahDayRow(
          state: state,
          accent: palette.accent,
          secondary: palette.textSecondary,
          dotSize: isFullscreen ? 10 : 8
        )
      }

      HStack(spacing: 10) {
        PrimaryAction(state: state, accent: palette.accent, fillOpacity: fillOpacity)
        QiblaAction(state: state, foreground: palette.textSecondary, fillOpacity: fillOpacity * 0.8)
      }

      if isFullscreen, !state.displayDate.isEmpty {
        Text(state.displayDate)
          .font(.caption.weight(.medium))
          .foregroundStyle(palette.textSecondary)
          .lineLimit(1)
      }
    }
    .padding(.horizontal, 14)
    .padding(.vertical, isFullscreen ? 18 : 12)
    .activityBackgroundTint(palette.background)
    .activitySystemActionForegroundColor(palette.accent)
  }

  private var leadingColumn: some View {
    HStack(alignment: .center, spacing: 10) {
      // HIG: logo/glyph without a container chrome — integrates with the banner.
      PrayerGlyph(
        prayerId: state.prayerId,
        color: palette.accent,
        size: isFullscreen ? 26 : 22
      )

      VStack(alignment: .leading, spacing: 2) {
        Text(state.title.isEmpty ? state.prayerName : state.title)
          .font(.caption.weight(.semibold))
          .foregroundStyle(palette.accent)
          .lineLimit(1)

        Text(state.prayerName.isEmpty ? "—" : state.prayerName)
          .font((isFullscreen ? Font.title : Font.title3).weight(.bold))
          .foregroundStyle(palette.textPrimary)
          .lineLimit(1)
          .minimumScaleFactor(0.8)

        if !state.metaLine.isEmpty {
          Text(state.metaLine)
            .font(.caption2.weight(.medium))
            .foregroundStyle(palette.textSecondary)
            .lineLimit(1)
            .minimumScaleFactor(0.85)
        }
      }
    }
    .accessibilityElement(children: .combine)
  }

  private var trailingColumn: some View {
    VStack(alignment: .trailing, spacing: 2) {
      if state.showsConfirmation, let done = state.confirmationLabel {
        Label(done, systemImage: "checkmark.seal.fill")
          .font(.caption2.weight(.bold))
          .foregroundStyle(palette.accent)
          .lineLimit(1)
      } else {
        Text(state.caption(isStale: isStale))
          .font(.caption2.weight(.semibold))
          .foregroundStyle(palette.textSecondary)
          .lineLimit(1)
      }

      CountdownText(
        state: state,
        font: .system(isFullscreen ? .title : .title2, design: .rounded).weight(.bold),
        color: isStale ? palette.textSecondary : palette.accent,
        width: isFullscreen ? 110 : 88,
        alignment: .trailing
      )
    }
    .accessibilityElement(children: .combine)
    .invalidatableContent()
  }
}

// MARK: - Apple Watch Smart Stack / CarPlay (`.small` family, iOS 18+)

/// Small presentation for the Apple Watch Smart Stack and CarPlay
/// (`supplementalActivityFamilies([.small])`). Buttons are disabled there and
/// tapping opens the app, so this is a pure glance: Salah, countdown, today.
@available(iOS 18.0, *)
private struct PrayerLiveActivitySmall: View {
  let state: PrayerActivityAttributes.ContentState
  let isStale: Bool

  private var palette: LiveActivityPalette { LiveActivityPalette(state) }

  var body: some View {
    VStack(alignment: .leading, spacing: 4) {
      HStack(spacing: 6) {
        PrayerGlyph(prayerId: state.prayerId, color: palette.accent, size: 14)
        Text(state.prayerName.isEmpty ? "—" : state.prayerName)
          .font(.headline.weight(.bold))
          .foregroundStyle(palette.textPrimary)
          .lineLimit(1)
          .minimumScaleFactor(0.75)
        Spacer(minLength: 0)
        if state.showsConfirmation {
          Image(systemName: "checkmark.seal.fill")
            .font(.caption.weight(.bold))
            .foregroundStyle(palette.accent)
        }
      }

      CountdownText(
        state: state,
        font: .system(.title3, design: .rounded).weight(.bold),
        color: isStale ? palette.textSecondary : palette.accent,
        alignment: .leading
      )

      if !state.locationDenied, !state.days.isEmpty {
        SalahDayRow(state: state, accent: palette.accent, secondary: palette.textSecondary, dotSize: 6)
      } else {
        Text(state.caption(isStale: isStale))
          .font(.caption2.weight(.semibold))
          .foregroundStyle(palette.textSecondary)
          .lineLimit(1)
      }
    }
    .padding(.horizontal, 10)
    .padding(.vertical, 8)
    .activityBackgroundTint(palette.background)
  }
}

/// Picks the presentation for the current `activityFamily` (iOS 18+ adds the
/// `.small` Smart Stack / CarPlay family; `.medium` is the iPhone Lock Screen).
@available(iOS 18.0, *)
private struct PrayerLiveActivityFamilyContent: View {
  let state: PrayerActivityAttributes.ContentState
  let isStale: Bool
  @Environment(\.activityFamily) private var family

  var body: some View {
    if family == .small {
      PrayerLiveActivitySmall(state: state, isStale: isStale)
    } else {
      PrayerLiveActivityLockScreen(state: state, isStale: isStale)
    }
  }
}

@available(iOS 16.2, *)
private struct PrayerLiveActivityContent: View {
  let state: PrayerActivityAttributes.ContentState
  let isStale: Bool

  var body: some View {
    if #available(iOS 18.0, *) {
      PrayerLiveActivityFamilyContent(state: state, isStale: isStale)
    } else {
      PrayerLiveActivityLockScreen(state: state, isStale: isStale)
    }
  }
}

// MARK: - Dynamic Island expanded regions

@available(iOS 16.2, *)
private struct IslandExpandedLeading: View {
  let state: PrayerActivityAttributes.ContentState
  let palette: LiveActivityPalette

  var body: some View {
    HStack(spacing: 8) {
      PrayerGlyph(prayerId: state.prayerId, color: palette.accent, size: 16)
      VStack(alignment: .leading, spacing: 1) {
        Text(state.prayerName.isEmpty ? "—" : state.prayerName)
          .font(.headline.weight(.bold))
          .foregroundStyle(.white)
          .lineLimit(1)
          .minimumScaleFactor(0.8)
        Text(state.prayerTimeLabel.isEmpty ? state.prayerTime : state.prayerTimeLabel)
          .font(.caption.weight(.semibold))
          .foregroundStyle(palette.accent)
          .lineLimit(1)
      }
    }
  }
}

@available(iOS 16.2, *)
private struct IslandExpandedTrailing: View {
  let state: PrayerActivityAttributes.ContentState
  let palette: LiveActivityPalette
  let isStale: Bool

  var body: some View {
    VStack(alignment: .trailing, spacing: 1) {
      if state.showsConfirmation, let done = state.confirmationLabel {
        Label(done, systemImage: "checkmark.seal.fill")
          .font(.caption2.weight(.bold))
          .foregroundStyle(palette.accent)
          .lineLimit(1)
      } else {
        Text(state.caption(isStale: isStale))
          .font(.caption2.weight(.semibold))
          .foregroundStyle(.white.opacity(0.7))
          .lineLimit(1)
      }
      CountdownText(
        state: state,
        font: .title3.weight(.bold),
        color: isStale ? .white.opacity(0.7) : palette.accent,
        width: 78,
        alignment: .trailing
      )
    }
    .invalidatableContent()
  }
}

@available(iOS 16.2, *)
private struct IslandExpandedCenter: View {
  let state: PrayerActivityAttributes.ContentState

  var body: some View {
    Text(state.title.isEmpty ? state.prayerName : state.title)
      .font(.caption2.weight(.semibold))
      .foregroundStyle(.white.opacity(0.55))
      .lineLimit(1)
  }
}

@available(iOS 16.2, *)
private struct IslandExpandedBottom: View {
  let state: PrayerActivityAttributes.ContentState
  let palette: LiveActivityPalette

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      if !state.locationDenied {
        SalahDayRow(state: state, accent: palette.accent, secondary: .white.opacity(0.65))
      }

      HStack(spacing: 6) {
        if !state.location.isEmpty {
          Text(state.location)
            .lineLimit(1)
        }
        if !state.location.isEmpty, !state.displayDate.isEmpty {
          Text("·")
        }
        if !state.displayDate.isEmpty {
          Text(state.displayDate)
            .lineLimit(1)
        }
      }
      .font(.caption2.weight(.medium))
      .foregroundStyle(.white.opacity(0.65))
      .frame(maxWidth: .infinity, alignment: .leading)

      HStack(spacing: 8) {
        PrimaryAction(
          state: state,
          accent: palette.accent,
          fillOpacity: 0.22,
          font: .caption2.weight(.semibold)
        )
        QiblaAction(
          state: state,
          foreground: .white.opacity(0.85),
          fillOpacity: 0.14,
          font: .caption2.weight(.semibold)
        )
      }
    }
  }
}

// MARK: - Widget

@available(iOS 16.2, *)
struct PrayerLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: PrayerActivityAttributes.self) { context in
      PrayerLiveActivityContent(state: context.state, isStale: context.isStale)
        .widgetURL(URL(string: context.state.deepLink))
        .widgetLocale(context.state.locale, isRtl: context.state.isRtl)
    } dynamicIsland: { context in
      let palette = LiveActivityPalette(context.state)
      let state = context.state
      // DynamicIsland has no `.environment`; apply locale/RTL on each region view.
      return DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          IslandExpandedLeading(state: state, palette: palette)
            .widgetLocale(state.locale, isRtl: state.isRtl)
        }
        DynamicIslandExpandedRegion(.trailing) {
          IslandExpandedTrailing(state: state, palette: palette, isStale: context.isStale)
            .widgetLocale(state.locale, isRtl: state.isRtl)
        }
        DynamicIslandExpandedRegion(.center) {
          IslandExpandedCenter(state: state)
            .widgetLocale(state.locale, isRtl: state.isRtl)
        }
        DynamicIslandExpandedRegion(.bottom) {
          IslandExpandedBottom(state: state, palette: palette)
            .widgetLocale(state.locale, isRtl: state.isRtl)
        }
      } compactLeading: {
        // Snug against the camera; SF Symbol without a container (HIG).
        PrayerGlyph(prayerId: state.prayerId, color: palette.accent, size: 14)
          .widgetLocale(state.locale, isRtl: state.isRtl)
      } compactTrailing: {
        // Narrow countdown — balanced with leading (HIG: Compact). Outside the
        // countdown, the phase glyph beats a truncated "at 1:1…" clock.
        Group {
          if state.phase == "upcoming" || state.locationDenied {
            CountdownText(
              state: state,
              font: .caption2.weight(.bold),
              color: palette.accent,
              width: 42,
              alignment: .trailing,
              preferShortTime: true
            )
          } else {
            Image(systemName: state.phaseSymbol)
              .font(.caption.weight(.bold))
              .foregroundStyle(palette.accent)
          }
        }
        .widgetLocale(state.locale, isRtl: state.isRtl)
      } minimal: {
        // Prefer live status over a static logo (HIG: Minimal / Timer example).
        Group {
          if state.locationDenied {
            PrayerGlyph(prayerId: state.prayerId, color: palette.accent, size: 12)
          } else if state.phase != "upcoming" {
            Image(systemName: state.phaseSymbol)
              .font(.caption2.weight(.bold))
              .foregroundStyle(palette.accent)
          } else if state.targetDate > Date() {
            ProgressView(timerInterval: state.timerRange, countsDown: true) {
              EmptyView()
            } currentValueLabel: {
              EmptyView()
            }
            .progressViewStyle(.circular)
            .tint(palette.accent)
          } else {
            ProgressView(value: state.progressFraction)
              .progressViewStyle(.circular)
              .tint(palette.accent)
          }
        }
        .widgetLocale(state.locale, isRtl: state.isRtl)
      }
      .keylineTint(palette.accent)
      .widgetURL(URL(string: state.deepLink))
    }
    .prayerSupplementalFamilies()
  }
}

private extension WidgetConfiguration {
  /// Opt into the `.small` family (Apple Watch Smart Stack + CarPlay) on iOS 18+.
  /// SE-0360 lets an opaque result differ across `if #available` branches.
  func prayerSupplementalFamilies() -> some WidgetConfiguration {
    if #available(iOS 18.0, *) {
      return supplementalActivityFamilies([.small])
    } else {
      return self
    }
  }
}
