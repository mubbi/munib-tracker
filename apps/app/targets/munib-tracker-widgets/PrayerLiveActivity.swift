import ActivityKit
import SwiftUI
import WidgetKit

/// Resolved colors for the Live Activity, parsed from the JS-provided hex state.
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
private struct CountdownText: View {
  let state: PrayerActivityAttributes.ContentState
  var font: Font = .headline
  var color: Color = .primary
  var multilineAlignment: TextAlignment = .trailing

  var body: some View {
    let now = Date()
    // `Text(timerInterval:)` reports a greedy intrinsic width; without
    // `fixedSize`, it can crush sibling content in Live Activity HStacks.
    Group {
      if state.locationDenied {
        Text(state.countdownLabel)
          .font(font)
          .foregroundStyle(color)
          .multilineTextAlignment(multilineAlignment)
          .lineLimit(2)
          .minimumScaleFactor(0.75)
      } else if state.targetDate > now {
        Text(timerInterval: now...state.targetDate, countsDown: true)
          .font(font)
          .monospacedDigit()
          .foregroundStyle(color)
          .multilineTextAlignment(multilineAlignment)
          .lineLimit(1)
          .minimumScaleFactor(0.7)
      } else {
        Text(state.countdownLabel)
          .font(font)
          .foregroundStyle(color)
          .multilineTextAlignment(multilineAlignment)
          .lineLimit(1)
          .minimumScaleFactor(0.75)
      }
    }
    .fixedSize(horizontal: true, vertical: false)
  }
}

/// Secondary meta line: "at 4:23 AM · Karachi" (time format + location from prefs).
@available(iOS 16.2, *)
private struct PrayerMetaLine: View {
  let state: PrayerActivityAttributes.ContentState
  let color: Color

  private var text: String {
    let time = state.prayerTimeLabel.isEmpty ? state.prayerTime : state.prayerTimeLabel
    if time.isEmpty { return state.location }
    if state.location.isEmpty { return time }
    return "\(time) · \(state.location)"
  }

  var body: some View {
    if !text.isEmpty {
      Text(text)
        .font(.caption2)
        .foregroundStyle(color)
        .lineLimit(1)
        .minimumScaleFactor(0.85)
    }
  }
}

@available(iOS 16.2, *)
struct PrayerLiveActivityLockScreen: View {
  let state: PrayerActivityAttributes.ContentState
  private var palette: LiveActivityPalette { LiveActivityPalette(state) }

  var body: some View {
    HStack(alignment: .center, spacing: 12) {
      VStack(alignment: .leading, spacing: 4) {
        Text(state.title)
          .font(.caption.weight(.semibold))
          .foregroundStyle(palette.accent)
          .lineLimit(1)

        Text(state.prayerName)
          .font(.title2.weight(.bold))
          .foregroundStyle(palette.textPrimary)
          .lineLimit(1)
          .minimumScaleFactor(0.85)

        PrayerMetaLine(state: state, color: palette.textSecondary)

        if !state.displayDate.isEmpty {
          Text(state.displayDate)
            .font(.caption2)
            .foregroundStyle(palette.textSecondary.opacity(0.9))
            .lineLimit(1)
        }
      }
      .frame(maxWidth: .infinity, alignment: .leading)
      .layoutPriority(1)

      VStack(alignment: .trailing, spacing: 4) {
        Text(state.remainingLabel.isEmpty ? state.countdownLabel : state.remainingLabel)
          .font(.caption2.weight(.semibold))
          .foregroundStyle(palette.textSecondary)
          .lineLimit(1)

        CountdownText(
          state: state,
          font: .system(.title2, design: .rounded).weight(.bold),
          color: palette.accent
        )
      }
      .fixedSize(horizontal: true, vertical: false)
    }
    .padding(.horizontal, 16)
    .padding(.vertical, 14)
    .activityBackgroundTint(palette.background)
    .activitySystemActionForegroundColor(palette.accent)
  }
}

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
          VStack(alignment: .leading, spacing: 2) {
            Text(context.state.prayerName)
              .font(.headline.weight(.bold))
              .foregroundStyle(palette.textPrimary)
              .lineLimit(1)
            Text(
              context.state.prayerTimeLabel.isEmpty
                ? context.state.prayerTime
                : context.state.prayerTimeLabel
            )
            .font(.caption.weight(.semibold))
            .foregroundStyle(palette.accent)
            .lineLimit(1)
          }
        }
        DynamicIslandExpandedRegion(.trailing) {
          VStack(alignment: .trailing, spacing: 2) {
            Text(
              context.state.remainingLabel.isEmpty
                ? context.state.countdownLabel
                : context.state.remainingLabel
            )
            .font(.caption2.weight(.semibold))
            .foregroundStyle(palette.textSecondary)
            .lineLimit(1)
            CountdownText(
              state: context.state,
              font: .title3.weight(.bold),
              color: palette.accent
            )
          }
          .fixedSize(horizontal: true, vertical: false)
        }
        DynamicIslandExpandedRegion(.bottom) {
          HStack(spacing: 6) {
            if !context.state.location.isEmpty {
              Text(context.state.location)
                .lineLimit(1)
            }
            if !context.state.location.isEmpty, !context.state.displayDate.isEmpty {
              Text("·")
            }
            if !context.state.displayDate.isEmpty {
              Text(context.state.displayDate)
                .lineLimit(1)
            }
          }
          .font(.caption2)
          .foregroundStyle(palette.textSecondary)
          .frame(maxWidth: .infinity, alignment: .leading)
        }
      } compactLeading: {
        Image(systemName: "moon.stars.fill")
          .foregroundStyle(palette.accent)
      } compactTrailing: {
        CountdownText(
          state: context.state,
          font: .caption2.weight(.bold),
          color: palette.accent
        )
      } minimal: {
        Image(systemName: "moon.stars.fill")
          .foregroundStyle(palette.accent)
      }
      .widgetURL(URL(string: context.state.deepLink))
    }
  }
}
