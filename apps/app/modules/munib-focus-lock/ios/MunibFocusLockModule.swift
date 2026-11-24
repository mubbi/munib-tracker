import ExpoModulesCore
import Foundation
import SwiftUI
#if canImport(FamilyControls)
import DeviceActivity
import FamilyControls
import ManagedSettings
#endif

// JS-facing records. Mirror `NativeFocusWindow` / `NativeFocusConfig` in
// `src/lib/focus-lock/native.ts`.
struct FocusWindowRecord: Record {
  @Field var id: String = ""
  @Field var prayer: String = ""
  @Field var title: String = ""
  @Field var body: String = ""
  @Field var start: String = ""
  @Field var end: String = ""
}

struct FocusLabelsRecord: Record {
  @Field var prayed: String = ""
  @Field var prayNow: String = ""
  @Field var holdHint: String = ""
  @Field var emergency: [String] = []
  @Field var confirmTitle: String = ""
  @Field var confirmBody: String = ""
  @Field var ongoingTitle: String = ""
  @Field var ongoingBody: String = ""
  @Field var channelName: String = ""
  @Field var done: String = ""
}

struct FocusThemeRecord: Record {
  @Field var accent: String = "#059669"
  @Field var accentForeground: String = "#FFFFFF"
  @Field var background: String = "#F5F0E6"
  @Field var foreground: String = "#152921"
  @Field var muted: String = "#5C7268"
}

struct FocusConfigRecord: Record {
  @Field var unlockMode: String = "gentle"
  @Field var emergencyPerDay: Int = 2
  @Field var confirmNotification: Bool = true
  @Field var confirmUrl: String = "munib-tracker://mark-current"
  @Field var labels: FocusLabelsRecord = FocusLabelsRecord()
  @Field var theme: FocusThemeRecord = FocusThemeRecord()
}

private let isoFormatter: ISO8601DateFormatter = {
  let f = ISO8601DateFormatter()
  f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
  return f
}()

private func parseDate(_ value: String) -> Date? {
  isoFormatter.date(from: value) ?? ISO8601DateFormatter().date(from: value)
}

extension FocusConfigRecord {
  func toConfig() -> FocusLockConfig {
    FocusLockConfig(
      unlockMode: unlockMode,
      emergencyPerDay: emergencyPerDay,
      confirmNotification: confirmNotification,
      confirmUrl: confirmUrl,
      labels: FocusLockLabels(
        prayed: labels.prayed,
        prayNow: labels.prayNow,
        holdHint: labels.holdHint,
        emergency: labels.emergency,
        confirmTitle: labels.confirmTitle,
        confirmBody: labels.confirmBody,
        ongoingTitle: labels.ongoingTitle,
        ongoingBody: labels.ongoingBody,
        channelName: labels.channelName,
        done: labels.done
      ),
      theme: FocusLockTheme(
        accent: theme.accent,
        accentForeground: theme.accentForeground,
        background: theme.background,
        foreground: theme.foreground,
        muted: theme.muted
      )
    )
  }
}

/// Scheduling shared by the module (setPlan / endWindowNow) and the
/// BGAppRefreshTask re-arm in `FocusLockAppDelegateSubscriber`.
enum FocusLockScheduling {
  static func rearm() {
    #if canImport(FamilyControls)
    guard #available(iOS 16.0, *) else { return }
    let center = DeviceActivityCenter()
    let ours = center.activities.filter { $0.rawValue.hasPrefix(FocusLockShared.activityPrefix) }
    if !ours.isEmpty { center.stopMonitoring(ours) }

    let now = Date()
    let ended = Set(FocusLockShared.loadState().endedIds)
    let windows = (FocusLockShared.loadPlan()?.windows ?? []).filter { $0.end > now && !ended.contains($0.id) }
    let calendar = Calendar.current
    let components: Set<Calendar.Component> = [.year, .month, .day, .hour, .minute, .second]

    for window in windows {
      let paddedEnd = max(window.end, window.start.addingTimeInterval(FocusLockShared.minimumInterval))
      let pad = Int(paddedEnd.timeIntervalSince(window.end).rounded())
      let schedule = DeviceActivitySchedule(
        intervalStart: calendar.dateComponents(components, from: window.start),
        intervalEnd: calendar.dateComponents(components, from: paddedEnd),
        repeats: false,
        warningTime: pad > 0 ? DateComponents(second: pad) : nil
      )
      do {
        try center.startMonitoring(
          DeviceActivityName(FocusLockShared.activityName(for: window.id)),
          during: schedule
        )
      } catch {
        // intervalTooShort / excessiveActivities: skip this window; the
        // in-app shield below still covers a window that is already running.
      }
    }

    // A window already in progress is shielded straight from the app process.
    if FocusLockShared.activeWindow(at: now) != nil {
      FocusLockShared.applyShield()
    } else {
      FocusLockShared.clearShield()
    }
    #endif
  }
}

#if canImport(FamilyControls)
@available(iOS 16.0, *)
private struct FocusPickerView: View {
  @State var selection: FamilyActivitySelection
  let doneLabel: String
  let onDone: (FamilyActivitySelection) -> Void

  var body: some View {
    NavigationView {
      FamilyActivityPicker(selection: $selection)
        .toolbar {
          ToolbarItem(placement: .confirmationAction) {
            Button(doneLabel) { onDone(selection) }
          }
        }
    }
  }
}
#endif

public class MunibFocusLockModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MunibFocusLock")

    Function("isSupported") { () -> Bool in
      if #available(iOS 16.0, *) { return true }
      return false
    }

    AsyncFunction("authorizationStatus") { () -> String in
      #if canImport(FamilyControls)
      if #available(iOS 16.0, *) {
        switch AuthorizationCenter.shared.authorizationStatus {
        case .approved: return "granted"
        case .denied: return "denied"
        default: return "notDetermined"
        }
      }
      #endif
      return "denied"
    }

    AsyncFunction("requestAuthorization") { () async -> String in
      #if canImport(FamilyControls)
      if #available(iOS 16.0, *) {
        do {
          try await AuthorizationCenter.shared.requestAuthorization(for: .individual)
          return AuthorizationCenter.shared.authorizationStatus == .approved ? "granted" : "denied"
        } catch {
          return "denied"
        }
      }
      #endif
      return "denied"
    }

    AsyncFunction("pickApps") { (promise: Promise) in
      #if canImport(FamilyControls)
      if #available(iOS 16.0, *) {
        guard let presenter = self.appContext?.utilities?.currentViewController() else {
          promise.resolve(["count": FocusLockShared.selectionCount()])
          return
        }
        let done = FocusLockShared.loadPlan()?.config.labels.done
        var host: UIViewController?
        let view = FocusPickerView(
          selection: FocusLockShared.loadSelection() ?? FamilyActivitySelection(),
          doneLabel: (done?.isEmpty == false ? done : nil) ?? "OK"
        ) { selection in
          FocusLockShared.saveSelection(selection)
          host?.dismiss(animated: true)
          promise.resolve(["count": FocusLockShared.selectionCount()])
        }
        let controller = UIHostingController(rootView: view)
        controller.isModalInPresentation = true
        host = controller
        presenter.present(controller, animated: true)
        return
      }
      #endif
      promise.resolve(["count": 0])
    }.runOnQueue(.main)

    AsyncFunction("selectionCount") { () -> Int in
      #if canImport(FamilyControls)
      if #available(iOS 16.0, *) { return FocusLockShared.selectionCount() }
      #endif
      return 0
    }

    AsyncFunction("setPlan") { (windows: [FocusWindowRecord], cfg: FocusConfigRecord) in
      let parsed: [FocusLockWindow] = windows.compactMap { w in
        guard let start = parseDate(w.start), let end = parseDate(w.end), end > start else { return nil }
        return FocusLockWindow(id: w.id, prayer: w.prayer, title: w.title, body: w.body, start: start, end: end)
      }
      FocusLockShared.savePlan(FocusLockPlan(windows: parsed, config: cfg.toConfig()))
      FocusLockScheduling.rearm()
    }

    AsyncFunction("endWindowNow") { (id: String?) in
      let target = id ?? FocusLockShared.activeWindow()?.id
      if let target { FocusLockShared.markEnded(target) }
      #if canImport(FamilyControls)
      if #available(iOS 16.0, *) {
        if let target {
          DeviceActivityCenter().stopMonitoring([DeviceActivityName(FocusLockShared.activityName(for: target))])
        }
        if FocusLockShared.activeWindow() == nil { FocusLockShared.clearShield() }
      }
      #endif
    }

    AsyncFunction("status") { () -> [String: Any] in
      let active = FocusLockShared.activeWindow()
      let state = FocusLockShared.loadState()
      return [
        "active": active != nil,
        "windowId": active?.id as Any,
        "emergencyLeft": FocusLockShared.emergencyLeft(),
        "emergencyUnlocks": state.emergencyUnlocks.map { isoFormatter.string(from: $0) },
        "endedIds": state.endedIds,
      ]
    }

    AsyncFunction("reset") {
      FocusLockShared.savePlan(nil)
      FocusLockShared.saveState(FocusLockState())
      #if canImport(FamilyControls)
      if #available(iOS 16.0, *) {
        FocusLockShared.saveSelection(nil)
        FocusLockScheduling.rearm()
      }
      #endif
    }
  }
}
