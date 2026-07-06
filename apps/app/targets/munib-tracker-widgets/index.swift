import WidgetKit
import SwiftUI

@main
struct MunibTrackerWidgetsBundle: WidgetBundle {
  var body: some Widget {
    NextPrayerWidget()
    PrayerScheduleWidget()
    PrayerProgressWidget()
  }
}
