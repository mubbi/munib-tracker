import Foundation
#if canImport(WidgetKit)
import WidgetKit
#endif

/// Keys shared between iPhone ↔ Apple Watch snapshot mirrors.
enum WatchSnapshotSync {
  static let contextKey = "widget_snapshot_v1"

  /// Persist snapshot JSON into the App Group and refresh WidgetKit timelines.
  static func applyLocally(_ json: String) {
    UserDefaults(suiteName: WidgetSnapshotStore.appGroup)?.set(json, forKey: WidgetSnapshotStore.key)
    #if canImport(WidgetKit)
    WidgetCenter.shared.reloadAllTimelines()
    #endif
  }
}
