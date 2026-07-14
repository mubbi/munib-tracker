import WidgetKit
import SwiftUI

@main
struct MunibTrackerWatchWidgetsBundle: WidgetBundle {
  var body: some Widget {
    WatchNextPrayerComplication()
    WatchScheduleComplication()
    WatchProgressComplication()
  }
}
