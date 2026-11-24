import BackgroundTasks
import ExpoModulesCore
import UIKit

/// Registers the focus-lock BGAppRefreshTask (plan: "re-plan … via a
/// BGAppRefreshTask"). The task re-arms DeviceActivity from the plan the JS
/// last wrote to the App Group (two days ahead), so windows keep firing even
/// if the app isn't opened for a while. JS re-plans fully on the next launch.
///
/// Registration happens only when the identifier is listed in
/// `BGTaskSchedulerPermittedIdentifiers` (added by the config plugin when the
/// hard block is on, D17) — registering an unlisted id would crash at launch.
public class FocusLockAppDelegateSubscriber: ExpoAppDelegateSubscriber {
  static let taskId = "app.munibtracker.focuslock.refresh"

  private static var isPermitted: Bool {
    let ids = Bundle.main.object(forInfoDictionaryKey: "BGTaskSchedulerPermittedIdentifiers") as? [String]
    return ids?.contains(taskId) == true
  }

  public func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    guard Self.isPermitted else { return true }
    BGTaskScheduler.shared.register(forTaskWithIdentifier: Self.taskId, using: nil) { task in
      FocusLockScheduling.rearm()
      Self.submit()
      task.setTaskCompleted(success: true)
    }
    Self.submit()
    return true
  }

  static func submit() {
    let request = BGAppRefreshTaskRequest(identifier: taskId)
    request.earliestBeginDate = Date(timeIntervalSinceNow: 6 * 60 * 60)
    try? BGTaskScheduler.shared.submit(request)
  }
}
