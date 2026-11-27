import Foundation
#if canImport(FamilyControls) && canImport(ManagedSettings) && os(iOS)
import FamilyControls
import ManagedSettings
#endif

// NF-3.13 Salah focus lock — state shared between the app module and the
// DeviceActivityMonitor / ShieldConfiguration / ShieldAction extensions through
// the App Group. Byte-identical copies live in:
//   modules/munib-focus-lock/ios/FocusLockShared.swift
//   targets/munib-tracker-focus-monitor/FocusLockShared.swift
//   targets/munib-tracker-focus-shield/FocusLockShared.swift
//   targets/munib-tracker-focus-action/FocusLockShared.swift
// (`src/lib/focus-lock/native-shared.sync.test.ts` fails if they drift).

struct FocusLockWindow: Codable, Equatable {
  var id: String
  var prayer: String
  var title: String
  var body: String
  var start: Date
  var end: Date
}

struct FocusLockLabels: Codable {
  var prayed: String
  var prayNow: String
  var holdHint: String
  var emergency: [String]
  var confirmTitle: String
  var confirmBody: String
  var ongoingTitle: String
  var ongoingBody: String
  var channelName: String
  var done: String
}

struct FocusLockTheme: Codable {
  var accent: String
  var accentForeground: String
  var background: String
  var foreground: String
  var muted: String
}

struct FocusLockConfig: Codable {
  var unlockMode: String
  var emergencyPerDay: Int
  var confirmNotification: Bool
  var confirmUrl: String
  var labels: FocusLockLabels
  var theme: FocusLockTheme
}

struct FocusLockPlan: Codable {
  var windows: [FocusLockWindow]
  var config: FocusLockConfig
}

struct FocusLockState: Codable {
  var endedIds: [String] = []
  var emergencyUnlocks: [Date] = []
}

enum FocusLockShared {
  static let appGroup = "group.app.munibtracker.widgets"
  static let planKey = "focus_lock_plan_v1"
  static let stateKey = "focus_lock_state_v1"
  static let selectionKey = "focus_lock_selection_v1"
  static let activityPrefix = "munib.focus."
  static let storeName = "munib.focus"
  static let confirmNotificationId = "munib.focus.confirm"
  /// DeviceActivity rejects intervals shorter than 15 minutes; shorter windows
  /// are padded and cleared early through `warningTime` (see the monitor).
  static let minimumInterval: TimeInterval = 15 * 60

  static var defaults: UserDefaults? { UserDefaults(suiteName: appGroup) }

  static func loadPlan() -> FocusLockPlan? {
    guard let data = defaults?.data(forKey: planKey) else { return nil }
    return try? JSONDecoder().decode(FocusLockPlan.self, from: data)
  }

  static func savePlan(_ plan: FocusLockPlan?) {
    guard let plan, let data = try? JSONEncoder().encode(plan) else {
      defaults?.removeObject(forKey: planKey)
      return
    }
    defaults?.set(data, forKey: planKey)
  }

  static func loadState() -> FocusLockState {
    guard let data = defaults?.data(forKey: stateKey),
          let state = try? JSONDecoder().decode(FocusLockState.self, from: data)
    else { return FocusLockState() }
    return state
  }

  static func saveState(_ state: FocusLockState) {
    if let data = try? JSONEncoder().encode(state) { defaults?.set(data, forKey: stateKey) }
  }

  static func activityName(for windowId: String) -> String { activityPrefix + windowId }

  static func window(forActivity name: String) -> FocusLockWindow? {
    guard name.hasPrefix(activityPrefix) else { return nil }
    let id = String(name.dropFirst(activityPrefix.count))
    return loadPlan()?.windows.first { $0.id == id }
  }

  /// The window running at `now` that hasn't been ended early.
  static func activeWindow(at now: Date = Date()) -> FocusLockWindow? {
    let ended = Set(loadState().endedIds)
    return loadPlan()?.windows.first { $0.start <= now && now < $0.end && !ended.contains($0.id) }
  }

  static func markEnded(_ id: String) {
    var state = loadState()
    if !state.endedIds.contains(id) { state.endedIds.append(id) }
    state.endedIds = Array(state.endedIds.suffix(64))
    saveState(state)
  }

  static func emergencyLeft(at now: Date = Date()) -> Int {
    guard let plan = loadPlan() else { return 0 }
    let used = loadState().emergencyUnlocks.filter { Calendar.current.isDate($0, inSameDayAs: now) }.count
    return max(0, plan.config.emergencyPerDay - used)
  }

  static func recordEmergency(at now: Date = Date()) {
    var state = loadState()
    let keepFrom = now.addingTimeInterval(-35 * 24 * 60 * 60)
    state.emergencyUnlocks = (state.emergencyUnlocks + [now]).filter { $0 >= keepFrom }
    saveState(state)
  }

  /// "#RRGGBB" → components (0…1); nil when malformed.
  static func rgb(_ hex: String) -> (Double, Double, Double)? {
    var s = hex.trimmingCharacters(in: .whitespaces)
    if s.hasPrefix("#") { s.removeFirst() }
    guard s.count == 6, let v = UInt32(s, radix: 16) else { return nil }
    return (Double((v >> 16) & 0xFF) / 255, Double((v >> 8) & 0xFF) / 255, Double(v & 0xFF) / 255)
  }
}

#if canImport(FamilyControls) && canImport(ManagedSettings) && os(iOS)
@available(iOS 16.0, *)
extension FocusLockShared {
  static var store: ManagedSettingsStore { ManagedSettingsStore(named: ManagedSettingsStore.Name(storeName)) }

  static func loadSelection() -> FamilyActivitySelection? {
    guard let data = defaults?.data(forKey: selectionKey) else { return nil }
    return try? JSONDecoder().decode(FamilyActivitySelection.self, from: data)
  }

  static func saveSelection(_ selection: FamilyActivitySelection?) {
    guard let selection, let data = try? JSONEncoder().encode(selection) else {
      defaults?.removeObject(forKey: selectionKey)
      return
    }
    defaults?.set(data, forKey: selectionKey)
  }

  static func selectionCount() -> Int {
    guard let s = loadSelection() else { return 0 }
    return s.applicationTokens.count + s.categoryTokens.count + s.webDomainTokens.count
  }

  /// Shields the user's picked apps, categories and web domains.
  static func applyShield() {
    guard let selection = loadSelection() else { return }
    let settings = store
    settings.shield.applications = selection.applicationTokens.isEmpty ? nil : selection.applicationTokens
    settings.shield.applicationCategories = selection.categoryTokens.isEmpty
      ? nil
      : .specific(selection.categoryTokens)
    settings.shield.webDomains = selection.webDomainTokens.isEmpty ? nil : selection.webDomainTokens
  }

  static func clearShield() {
    store.clearAllSettings()
  }
}
#endif
