import DeviceActivity
import Foundation
import ManagedSettings

/// NF-3.13: applies the Salah shield when a focus window starts and clears it
/// when the window ends. Windows shorter than DeviceActivity's 15-minute
/// minimum are scheduled padded, with `warningTime` = the padding, so
/// `intervalWillEndWarning` marks the real end.
class DeviceActivityMonitorExtension: DeviceActivityMonitor {
  override func intervalDidStart(for activity: DeviceActivityName) {
    super.intervalDidStart(for: activity)
    guard let window = FocusLockShared.window(forActivity: activity.rawValue) else { return }
    if FocusLockShared.loadState().endedIds.contains(window.id) { return }
    FocusLockShared.applyShield()
  }

  override func intervalWillEndWarning(for activity: DeviceActivityName) {
    super.intervalWillEndWarning(for: activity)
    finish(activity)
  }

  override func intervalDidEnd(for activity: DeviceActivityName) {
    super.intervalDidEnd(for: activity)
    finish(activity)
  }

  /// Clears the shield unless another (non-ended) window is running now —
  /// a padded schedule can outlive its window and overlap the next one.
  private func finish(_ activity: DeviceActivityName) {
    let mine = FocusLockShared.window(forActivity: activity.rawValue)?.id
    if let other = FocusLockShared.activeWindow(), other.id != mine {
      FocusLockShared.applyShield()
    } else {
      FocusLockShared.clearShield()
    }
  }
}
