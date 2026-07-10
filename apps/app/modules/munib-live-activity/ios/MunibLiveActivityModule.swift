import ActivityKit
import ExpoModulesCore
import Foundation

/// JS-facing record for the prayer Live Activity content state. Mirrors
/// `LiveActivityState` in `src/lib/live-activity/state.ts`.
struct PrayerActivityRecord: Record {
  @Field var prayerId: String = ""
  @Field var prayerName: String = ""
  @Field var prayerTime: String = ""
  @Field var countdownLabel: String = ""
  @Field var minutesUntil: Int = 0
  @Field var targetTimeMs: Double = 0
  @Field var displayDate: String = ""
  @Field var location: String = ""
  @Field var progressLabel: String = ""
  @Field var progressPercent: Double = 0
  @Field var locationDenied: Bool = false
  @Field var title: String = ""
  @Field var deepLink: String = ""
  @Field var isDark: Bool = false
  @Field var primary: String = "#059669"
  @Field var background: String = "#F5F0E6"
  @Field var cardBackground: String = "#FFFCF7"
  @Field var textPrimary: String = "#152921"
  @Field var textSecondary: String = "#5C7268"
}

@available(iOS 16.2, *)
private extension PrayerActivityAttributes.ContentState {
  init(record: PrayerActivityRecord) {
    self.init(
      prayerId: record.prayerId,
      prayerName: record.prayerName,
      prayerTime: record.prayerTime,
      countdownLabel: record.countdownLabel,
      minutesUntil: record.minutesUntil,
      targetTimeMs: record.targetTimeMs,
      displayDate: record.displayDate,
      location: record.location,
      progressLabel: record.progressLabel,
      progressPercent: record.progressPercent,
      locationDenied: record.locationDenied,
      title: record.title,
      deepLink: record.deepLink,
      isDark: record.isDark,
      primary: record.primary,
      background: record.background,
      cardBackground: record.cardBackground,
      textPrimary: record.textPrimary,
      textSecondary: record.textSecondary
    )
  }
}

/// Owns the single next-prayer Live Activity: start, refresh, and end. Also
/// reconnects to an activity that outlived an app relaunch.
@available(iOS 16.2, *)
final class PrayerActivityController {
  static let shared = PrayerActivityController()

  private var activity: Activity<PrayerActivityAttributes>?

  private var liveActivity: Activity<PrayerActivityAttributes>? {
    if let activity { return activity }
    let existing = Activity<PrayerActivityAttributes>.activities.first
    activity = existing
    return existing
  }

  var isRunning: Bool {
    liveActivity != nil
  }

  func start(state: PrayerActivityAttributes.ContentState) -> String? {
    guard ActivityAuthorizationInfo().areActivitiesEnabled else { return nil }
    // Replace any stale activity so we never stack duplicates.
    if let running = liveActivity {
      Task { await running.end(nil, dismissalPolicy: .immediate) }
      activity = nil
    }
    let content = ActivityContent(state: state, staleDate: state.targetDate)
    do {
      let created = try Activity.request(
        attributes: PrayerActivityAttributes(),
        content: content,
        pushType: nil
      )
      activity = created
      return created.id
    } catch {
      return nil
    }
  }

  func update(state: PrayerActivityAttributes.ContentState) async {
    let content = ActivityContent(state: state, staleDate: state.targetDate)
    guard let running = liveActivity else { return }
    await running.update(content)
  }

  func end() async {
    for running in Activity<PrayerActivityAttributes>.activities {
      await running.end(nil, dismissalPolicy: .immediate)
    }
    activity = nil
  }
}

public class MunibLiveActivityModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MunibLiveActivity")

    Function("isSupported") { () -> Bool in
      if #available(iOS 16.2, *) {
        return ActivityAuthorizationInfo().areActivitiesEnabled
      }
      return false
    }

    Function("isRunning") { () -> Bool in
      if #available(iOS 16.2, *) {
        return PrayerActivityController.shared.isRunning
      }
      return false
    }

    AsyncFunction("start") { (record: PrayerActivityRecord) -> String? in
      if #available(iOS 16.2, *) {
        let state = PrayerActivityAttributes.ContentState(record: record)
        return PrayerActivityController.shared.start(state: state)
      }
      return nil
    }

    AsyncFunction("update") { (record: PrayerActivityRecord) in
      if #available(iOS 16.2, *) {
        let state = PrayerActivityAttributes.ContentState(record: record)
        await PrayerActivityController.shared.update(state: state)
      }
    }

    AsyncFunction("end") {
      if #available(iOS 16.2, *) {
        await PrayerActivityController.shared.end()
      }
    }
  }
}
