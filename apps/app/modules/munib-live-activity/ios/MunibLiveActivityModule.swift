import ActivityKit
import ExpoModulesCore
import Foundation

/// JS-facing record for the prayer Live Activity content state. Mirrors
/// `LiveActivityState` in `src/lib/live-activity/state.ts`.
struct PrayerActivityRecord: Record {
  @Field var prayerId: String = ""
  @Field var prayerName: String = ""
  @Field var prayerTime: String = ""
  @Field var prayerTimeLabel: String = ""
  @Field var countdownLabel: String = ""
  @Field var remainingLabel: String = ""
  @Field var prepareLabel: String = ""
  @Field var actionLabel: String = ""
  @Field var actionDeepLink: String = ""
  @Field var phase: String = "upcoming"
  @Field var qiblaLabel: String = ""
  @Field var locale: String = "en"
  @Field var isRtl: Bool = false
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
  @Field var primary: String = "#2E7D32"
  @Field var background: String = "#F5F0E6"
  @Field var cardBackground: String = "#FFFDF9"
  @Field var textPrimary: String = "#152921"
  @Field var textSecondary: String = "#4A6157"
  @Field var daySalah: [DaySalahRecord]? = nil
  @Field var staleLabel: String? = nil
  @Field var confirmationLabel: String? = nil
  @Field var markedActionLabel: String? = nil
  @Field var markedActionDeepLink: String? = nil
  @Field var markedProgressLabel: String? = nil
  @Field var markedProgressPercent: Double? = nil
}

/// One obligatory Salah in the Live Activity status row (`daySalah`).
struct DaySalahRecord: Record {
  @Field var id: String = ""
  @Field var done: Bool = false
}

@available(iOS 16.2, *)
private extension PrayerActivityAttributes.ContentState {
  init(record: PrayerActivityRecord) {
    self.init(
      prayerId: record.prayerId,
      prayerName: record.prayerName,
      prayerTime: record.prayerTime,
      prayerTimeLabel: record.prayerTimeLabel,
      countdownLabel: record.countdownLabel,
      remainingLabel: record.remainingLabel,
      prepareLabel: record.prepareLabel,
      actionLabel: record.actionLabel,
      actionDeepLink: record.actionDeepLink,
      phase: record.phase,
      qiblaLabel: record.qiblaLabel,
      locale: record.locale,
      isRtl: record.isRtl,
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
      textSecondary: record.textSecondary,
      daySalah: record.daySalah?.map {
        PrayerActivityAttributes.DaySalah(id: $0.id, done: $0.done)
      },
      staleLabel: record.staleLabel,
      confirmationLabel: record.confirmationLabel,
      markedActionLabel: record.markedActionLabel,
      markedActionDeepLink: record.markedActionDeepLink,
      markedProgressLabel: record.markedProgressLabel,
      markedProgressPercent: record.markedProgressPercent
    )
  }
}

/// Optimistic refresh for the Live Activity's Mark Salah button.
///
/// `MarkSalahLiveActivityIntent` (`targets/munib-tracker-widgets/_shared/`) is a
/// `LiveActivityIntent`, so ActivityKit runs it in the app process — here — even
/// when the app is suspended or not running. The intent queues the mark for JS,
/// then calls this to flip the activity to its precomputed after-Salah state at
/// once (`ContentState.markedState()`), instead of waiting for the app to open.
/// The next JS sync (`syncLiveActivity`) replaces it with the authoritative state.
@available(iOS 16.2, *)
public enum PrayerLiveActivityMarkFeedback {
  @MainActor
  public static func applyMarked() async {
    for running in Activity<PrayerActivityAttributes>.activities {
      let current = running.content
      guard let marked = current.state.markedState() else { continue }
      await running.update(
        ActivityContent(
          state: marked,
          staleDate: current.staleDate,
          relevanceScore: current.relevanceScore
        )
      )
    }
  }
}

/// Owns the single next-prayer Live Activity: start, refresh, and end. Also
/// reconnects to an activity that outlived an app relaunch.
///
/// Main-actor isolated (D64): the Expo module calls arrive on the module queue and
/// the ActivityKit observers run in `Task`s, so every read/write of the cached
/// activity, the observer-task dictionaries and the JS callbacks is serialized on
/// the main actor. Module code reaches it through `await` (async functions) or
/// `MainActor.assumeIsolated` after a main-queue hop (listener hooks).
@available(iOS 16.2, *)
@MainActor
final class PrayerActivityController {
  static let shared = PrayerActivityController()

  private var activity: Activity<PrayerActivityAttributes>?
  private var pushTokenTasks: [String: Task<Void, Never>] = [:]
  private var stateTasks: [String: Task<Void, Never>] = [:]
  var onPushToken: ((String, String, String) -> Void)?
  var onActivityState: ((String, String) -> Void)?

  private var liveActivity: Activity<PrayerActivityAttributes>? {
    if let activity { return activity }
    let existing = Activity<PrayerActivityAttributes>.activities.first
    activity = existing
    return existing
  }

  var isRunning: Bool {
    liveActivity != nil
  }

  /// Synchronous `isRunning` for the JS `Function` (runs on the JS thread, where a
  /// main-actor hop could deadlock). Reads only ActivityKit's own list, never the
  /// main-actor cache: `activity` is always one of `activities` unless the system
  /// already removed it, so the answer matches `isRunning`.
  nonisolated static var hasRunningActivity: Bool {
    !Activity<PrayerActivityAttributes>.activities.isEmpty
  }

  func start(state: PrayerActivityAttributes.ContentState) -> String? {
    guard ActivityAuthorizationInfo().areActivitiesEnabled else { return nil }
    // Replace any stale activity so we never stack duplicates.
    if let running = liveActivity {
      Task { @MainActor in await running.end(nil, dismissalPolicy: .immediate) }
      activity = nil
    }
    let content = ActivityContent(state: state, staleDate: contentStaleDate(for: state))
    do {
      let created = try Activity.request(
        attributes: PrayerActivityAttributes(),
        content: content,
        pushType: .token
      )
      activity = created
      observe(created)
      return created.id
    } catch {
      return nil
    }
  }

  func update(state: PrayerActivityAttributes.ContentState) async {
    let content = ActivityContent(state: state, staleDate: contentStaleDate(for: state))
    guard let running = liveActivity else { return }
    await running.update(content)
  }

  func end() async {
    for running in Activity<PrayerActivityAttributes>.activities {
      await running.end(nil, dismissalPolicy: .immediate)
    }
    activity = nil
    cancelObservers()
  }

  /// Keep upcoming activities fresh past adhan. `Text(timerInterval:)` does not
  /// re-render SwiftUI at 00:00, so marking stale at `targetDate` froze the
  /// lock-screen timer until (or instead of) the remote markSalah push.
  private func contentStaleDate(for state: PrayerActivityAttributes.ContentState) -> Date {
    if state.phase == "upcoming" {
      return state.targetDate.addingTimeInterval(120)
    }
    return state.targetDate
  }

  func observeExisting() {
    for running in Activity<PrayerActivityAttributes>.activities {
      observe(running)
    }
  }

  func cancelObservers() {
    for task in pushTokenTasks.values { task.cancel() }
    for task in stateTasks.values { task.cancel() }
    pushTokenTasks.removeAll()
    stateTasks.removeAll()
  }

  private func observe(_ observed: Activity<PrayerActivityAttributes>) {
    let activityId = observed.id
    if pushTokenTasks[activityId] == nil {
      pushTokenTasks[activityId] = Task { @MainActor [weak self] in
        for await tokenData in observed.pushTokenUpdates {
          guard !Task.isCancelled else { return }
          let token = tokenData.map { String(format: "%02x", $0) }.joined()
#if DEBUG
          let environment = "sandbox"
#else
          let environment = "production"
#endif
          self?.onPushToken?(activityId, token, environment)
        }
      }
    }

    if stateTasks[activityId] == nil {
      stateTasks[activityId] = Task { @MainActor [weak self] in
        for await state in observed.activityStateUpdates {
          guard !Task.isCancelled else { return }
          let value: String
          switch state {
          case .active: value = "active"
          case .stale: value = "stale"
          case .ended: value = "ended"
          case .dismissed: value = "dismissed"
          @unknown default: value = "unknown"
          }
          self?.onActivityState?(activityId, value)
          if state == .ended || state == .dismissed {
            self?.pushTokenTasks.removeValue(forKey: activityId)?.cancel()
            self?.stateTasks.removeValue(forKey: activityId)
            if self?.activity?.id == activityId { self?.activity = nil }
            return
          }
        }
      }
    }
  }
}

public class MunibLiveActivityModule: Module {
  private static let observedEvents: Set<String> = ["onPushToken", "onActivityState"]
  /// Events that currently have at least one JS listener.
  private var listenedEvents = Set<String>()

  // Expo Modules lifecycle hooks (SDK 58 replacements for the deprecated
  // `OnStartObserving` / `OnStopObserving` DSL components). ActivityKit observers
  // run while any of the module's events has a listener.
  public override func didStartListening(event: String) {
    guard Self.observedEvents.contains(event) else { return }
    let wasIdle = listenedEvents.isEmpty
    listenedEvents.insert(event)
    if wasIdle { onMainActor { $0.startObservingActivities() } }
  }

  public override func didStopListening(event: String) {
    guard listenedEvents.remove(event) != nil, listenedEvents.isEmpty else { return }
    onMainActor { $0.stopObservingActivities() }
  }

  /// Hop to the main actor for controller access from the synchronous listener
  /// hooks. `DispatchQueue.main.async` keeps start/stop in call order (FIFO), which
  /// an unstructured `Task { @MainActor in }` does not guarantee.
  private func onMainActor(_ work: @escaping @MainActor (MunibLiveActivityModule) -> Void) {
    DispatchQueue.main.async { [weak self] in
      guard let self else { return }
      MainActor.assumeIsolated { work(self) }
    }
  }

  @MainActor
  private func startObservingActivities() {
    if #available(iOS 16.2, *) {
      let controller = PrayerActivityController.shared
      controller.onPushToken = { [weak self] activityId, pushToken, environment in
        self?.sendEvent("onPushToken", [
          "activityId": activityId,
          "pushToken": pushToken,
          "environment": environment,
        ])
      }
      controller.onActivityState = { [weak self] activityId, state in
        self?.sendEvent("onActivityState", [
          "activityId": activityId,
          "state": state,
        ])
      }
      controller.observeExisting()
    }
  }

  @MainActor
  private func stopObservingActivities() {
    if #available(iOS 16.2, *) {
      PrayerActivityController.shared.onPushToken = nil
      PrayerActivityController.shared.onActivityState = nil
    }
  }

  public func definition() -> ModuleDefinition {
    Name("MunibLiveActivity")
    Events("onPushToken", "onActivityState")

    Function("isSupported") { () -> Bool in
      if #available(iOS 16.2, *) {
        return ActivityAuthorizationInfo().areActivitiesEnabled
      }
      return false
    }

    Function("isRunning") { () -> Bool in
      if #available(iOS 16.2, *) {
        return PrayerActivityController.hasRunningActivity
      }
      return false
    }

    AsyncFunction("start") { (record: PrayerActivityRecord) -> String? in
      if #available(iOS 16.2, *) {
        let state = PrayerActivityAttributes.ContentState(record: record)
        return await MainActor.run { PrayerActivityController.shared.start(state: state) }
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
