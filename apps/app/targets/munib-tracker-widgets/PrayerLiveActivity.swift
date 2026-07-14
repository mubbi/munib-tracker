import ActivityKit
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
    remainingLabel.isEmpty ? countdownLabel : remainingLabel
  }
}

// MARK: - Countdown

/// Live countdown. Never apply `.fixedSize` to `Text(timerInterval:)` — it can
/// collapse Lock Screen layouts to an empty tinted banner on ActivityKit.
@available(iOS 16.2, *)
private struct CountdownText: View {
  let state: PrayerActivityAttributes.ContentState
  var font: Font = .headline
  var color: Color = .primary
  var width: CGFloat? = nil
  var alignment: TextAlignment = .trailing

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
        Text(state.countdownLabel.isEmpty ? state.prayerTime : state.countdownLabel)
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

@available(iOS 16.2, *)
private struct SalahProgressBar: View {
  let state: PrayerActivityAttributes.ContentState
  let accent: Color
  let secondary: Color
  var showLabel: Bool = true

  var body: some View {
    HStack(spacing: 8) {
      ProgressView(value: state.progressFraction)
        .progressViewStyle(.linear)
        .tint(accent)
      if showLabel, !state.progressLabel.isEmpty {
        Text(state.progressLabel)
          .font(.caption2.weight(.semibold))
          .foregroundStyle(secondary)
          .monospacedDigit()
      }
    }
  }
}

// MARK: - Lock Screen (+ StandBy fullscreen)

/// Lock Screen presentation — unique salah layout (not a notification card),
/// 14pt margins, glanceable hierarchy, and a progress track (Apple HIG).
@available(iOS 16.2, *)
struct PrayerLiveActivityLockScreen: View {
  let state: PrayerActivityAttributes.ContentState
  @Environment(\.isActivityFullscreen) private var isFullscreen

  private var palette: LiveActivityPalette { LiveActivityPalette(state) }

  var body: some View {
    VStack(alignment: .leading, spacing: isFullscreen ? 14 : 10) {
      HStack(alignment: .center, spacing: 12) {
        leadingColumn
        Spacer(minLength: 8)
        trailingColumn
      }

      if !state.locationDenied {
        SalahProgressBar(
          state: state,
          accent: palette.accent,
          secondary: palette.textSecondary,
          showLabel: true
        )
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
        Text(state.title.isEmpty ? "Next prayer" : state.title)
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
      Text(state.remainingCaption)
        .font(.caption2.weight(.semibold))
        .foregroundStyle(palette.textSecondary)
        .lineLimit(1)

      CountdownText(
        state: state,
        font: .system(isFullscreen ? .title : .title2, design: .rounded).weight(.bold),
        color: palette.accent,
        width: isFullscreen ? 110 : 88,
        alignment: .trailing
      )
    }
    .accessibilityElement(children: .combine)
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

  var body: some View {
    VStack(alignment: .trailing, spacing: 1) {
      Text(state.remainingCaption)
        .font(.caption2.weight(.semibold))
        .foregroundStyle(.white.opacity(0.7))
        .lineLimit(1)
      CountdownText(
        state: state,
        font: .title3.weight(.bold),
        color: palette.accent,
        width: 78,
        alignment: .trailing
      )
    }
  }
}

@available(iOS 16.2, *)
private struct IslandExpandedCenter: View {
  let state: PrayerActivityAttributes.ContentState

  var body: some View {
    Text(state.title.isEmpty ? "Next prayer" : state.title)
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
    VStack(alignment: .leading, spacing: 6) {
      if !state.locationDenied {
        SalahProgressBar(
          state: state,
          accent: palette.accent,
          secondary: .white.opacity(0.65),
          showLabel: true
        )
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
    }
  }
}

// MARK: - Widget

@available(iOS 16.2, *)
struct PrayerLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: PrayerActivityAttributes.self) { context in
      PrayerLiveActivityLockScreen(state: context.state)
        .widgetURL(URL(string: context.state.deepLink))
    } dynamicIsland: { context in
      let palette = LiveActivityPalette(context.state)
      return DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          IslandExpandedLeading(state: context.state, palette: palette)
        }
        DynamicIslandExpandedRegion(.trailing) {
          IslandExpandedTrailing(state: context.state, palette: palette)
        }
        DynamicIslandExpandedRegion(.center) {
          IslandExpandedCenter(state: context.state)
        }
        DynamicIslandExpandedRegion(.bottom) {
          IslandExpandedBottom(state: context.state, palette: palette)
        }
      } compactLeading: {
        // Snug against the camera; SF Symbol without a container (HIG).
        PrayerGlyph(prayerId: context.state.prayerId, color: palette.accent, size: 14)
      } compactTrailing: {
        // Narrow countdown — balanced with leading (HIG: Compact).
        CountdownText(
          state: context.state,
          font: .caption2.weight(.bold),
          color: palette.accent,
          width: 42,
          alignment: .trailing
        )
      } minimal: {
        // Prefer live status over a static logo (HIG: Minimal / Timer example).
        if context.state.locationDenied {
          PrayerGlyph(prayerId: context.state.prayerId, color: palette.accent, size: 12)
        } else if context.state.targetDate > Date() {
          ProgressView(timerInterval: context.state.timerRange, countsDown: true) {
            EmptyView()
          } currentValueLabel: {
            EmptyView()
          }
          .progressViewStyle(.circular)
          .tint(palette.accent)
        } else {
          ProgressView(value: context.state.progressFraction)
            .progressViewStyle(.circular)
            .tint(palette.accent)
        }
      }
      .keylineTint(palette.accent)
      .widgetURL(URL(string: context.state.deepLink))
    }
  }
}
