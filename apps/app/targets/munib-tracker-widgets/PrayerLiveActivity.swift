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

  var body: some View {
    let now = Date()
    if state.locationDenied {
      Text(state.countdownLabel).font(font).foregroundStyle(color)
    } else if state.targetDate > now {
      Text(timerInterval: now...state.targetDate, countsDown: true)
        .font(font)
        .monospacedDigit()
        .foregroundStyle(color)
    } else {
      Text(state.prayerTime).font(font).foregroundStyle(color)
    }
  }
}

@available(iOS 16.2, *)
struct PrayerLiveActivityLockScreen: View {
  let state: PrayerActivityAttributes.ContentState
  private var palette: LiveActivityPalette { LiveActivityPalette(state) }

  var body: some View {
    HStack(alignment: .center, spacing: 14) {
      VStack(alignment: .leading, spacing: 3) {
        Text(state.title)
          .font(.caption.weight(.semibold))
          .foregroundStyle(palette.accent)
          .lineLimit(1)
        Text(state.prayerName)
          .font(.title3.weight(.bold))
          .foregroundStyle(palette.textPrimary)
          .lineLimit(1)
        if !state.location.isEmpty {
          Text(state.location)
            .font(.caption2)
            .foregroundStyle(palette.textSecondary)
            .lineLimit(1)
        }
      }
      Spacer(minLength: 8)
      VStack(alignment: .trailing, spacing: 3) {
        Text(state.prayerTime)
          .font(.title3.weight(.bold))
          .foregroundStyle(palette.accent)
          .lineLimit(1)
        CountdownText(state: state, font: .caption.weight(.semibold), color: palette.textSecondary)
      }
    }
    .padding(16)
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
            if !context.state.location.isEmpty {
              Text(context.state.location)
                .font(.caption2)
                .foregroundStyle(palette.textSecondary)
                .lineLimit(1)
            }
          }
        }
        DynamicIslandExpandedRegion(.trailing) {
          VStack(alignment: .trailing, spacing: 2) {
            Text(context.state.prayerTime)
              .font(.headline.weight(.bold))
              .foregroundStyle(palette.accent)
              .lineLimit(1)
            CountdownText(
              state: context.state,
              font: .caption.weight(.semibold),
              color: palette.textSecondary
            )
          }
        }
        DynamicIslandExpandedRegion(.bottom) {
          if !context.state.displayDate.isEmpty {
            Text(context.state.displayDate)
              .font(.caption2)
              .foregroundStyle(palette.textSecondary)
              .frame(maxWidth: .infinity, alignment: .leading)
          }
        }
      } compactLeading: {
        Image(systemName: "moon.stars.fill")
          .foregroundStyle(palette.accent)
      } compactTrailing: {
        CountdownText(state: context.state, font: .caption2.weight(.semibold), color: palette.accent)
      } minimal: {
        Image(systemName: "moon.stars.fill")
          .foregroundStyle(palette.accent)
      }
      .widgetURL(URL(string: context.state.deepLink))
    }
  }
}
