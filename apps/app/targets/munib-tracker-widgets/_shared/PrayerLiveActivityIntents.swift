import AppIntents
import Foundation
import WidgetKit
#if canImport(MunibLiveActivity)
// `internal` to match Expo's generated ExpoModulesProvider.swift (`internal import`) —
// Swift 6 rejects mixed implicit/explicit access levels for one module in the app target.
internal import MunibLiveActivity
#endif

// Compiled into BOTH the main app and the widget extension
// (`targets/munib-tracker-widgets/_shared`, @bacons/apple-targets). Apple runs a
// `LiveActivityIntent` in the app's process when the intent exists in the app
// target, so the main-app copy is the one that executes: it can update the
// activity through ActivityKit. `MunibLiveActivity` (the Expo pod with
// `PrayerLiveActivityMarkFeedback`) is only linked into the app, which is what
// `canImport` keys on — the widget-extension copy just queues the mark.

/// Live Activity "Mark Salah" button (NF-1.19): marks the current obligatory
/// Salah from the Lock Screen / Dynamic Island without opening the app.
///
/// Writes the same `mark-current-obligatory` command as the widget button and
/// Siri (App Group `pending_commands_v1`, drained by JS
/// `use-external-command-processor`), then flips the activity to its precomputed
/// after-Salah state so the tap has instant feedback.
@available(iOS 17.0, *)
struct MarkSalahLiveActivityIntent: LiveActivityIntent {
  static let title: LocalizedStringResource = "Mark Salah"
  static let description = IntentDescription(
    "Mark the current obligatory Salah as completed from the Live Activity."
  )
  static let isDiscoverable: Bool = false
  static let openAppWhenRun: Bool = false

  init() {}

  func perform() async throws -> some IntentResult {
    let payload: [String: Any] = [
      "type": "mark-current-obligatory",
      "source": "live_activity",
    ]
    if let data = try? JSONSerialization.data(withJSONObject: payload),
       let json = String(data: data, encoding: .utf8) {
      ExternalCommandQueue.appendCommandJson(json)
    }
#if canImport(MunibLiveActivity)
    await PrayerLiveActivityMarkFeedback.applyMarked()
#endif
    // Widgets peek the queue, so they show the Salah as done before JS applies it.
    WidgetCenter.shared.reloadAllTimelines()
    return .result()
  }
}
