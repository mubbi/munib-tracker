import Foundation
import ManagedSettings
import UserNotifications

/// NF-3.13 shield buttons. A shield can't open the containing app, so the
/// primary button posts a local "Tap to confirm your Salah" notification that
/// deep-links to `munib-tracker://mark-current`; marking there ends the window
/// (JS → `endWindowNow`). Gentle mode also lifts the shield right away (iOS
/// has no press-and-hold on a shield). The secondary button is the counted
/// emergency unlock.
class ShieldActionExtension: ShieldActionDelegate {
  override func handle(
    action: ShieldAction,
    for application: ApplicationToken,
    completionHandler: @escaping (ShieldActionResponse) -> Void
  ) {
    respond(to: action, completionHandler)
  }

  override func handle(
    action: ShieldAction,
    for webDomain: WebDomainToken,
    completionHandler: @escaping (ShieldActionResponse) -> Void
  ) {
    respond(to: action, completionHandler)
  }

  override func handle(
    action: ShieldAction,
    for category: ActivityCategoryToken,
    completionHandler: @escaping (ShieldActionResponse) -> Void
  ) {
    respond(to: action, completionHandler)
  }

  private func respond(to action: ShieldAction, _ done: @escaping (ShieldActionResponse) -> Void) {
    guard let plan = FocusLockShared.loadPlan() else {
      done(.close)
      return
    }
    let active = FocusLockShared.activeWindow()
    switch action {
    case .primaryButtonPressed:
      if plan.config.confirmNotification { postConfirm(plan.config) }
      if plan.config.unlockMode == "gentle", let window = active {
        unlock(window.id)
        done(.defer)
      } else {
        done(.close)
      }
    case .secondaryButtonPressed:
      if let window = active, FocusLockShared.emergencyLeft() > 0 {
        FocusLockShared.recordEmergency()
        unlock(window.id)
        done(.defer)
      } else {
        done(.close)
      }
    @unknown default:
      done(.close)
    }
  }

  private func unlock(_ windowId: String) {
    FocusLockShared.markEnded(windowId)
    FocusLockShared.clearShield()
  }

  /// Generic, lock-screen-safe text (no app names, no state).
  private func postConfirm(_ config: FocusLockConfig) {
    let content = UNMutableNotificationContent()
    content.title = config.labels.confirmTitle
    content.body = config.labels.confirmBody
    content.sound = .default
    // expo-notifications reads `data` from userInfo["body"]; the provider routes `data.route`.
    content.userInfo = ["body": ["route": "/mark-current"], "url": config.confirmUrl]
    let request = UNNotificationRequest(
      identifier: FocusLockShared.confirmNotificationId,
      content: content,
      trigger: nil
    )
    UNUserNotificationCenter.current().add(request)
  }
}
