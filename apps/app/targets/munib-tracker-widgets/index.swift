import WidgetKit
import SwiftUI

@main
struct MunibTrackerWidgetsBundle: WidgetBundle {
  var body: some Widget {
    NextPrayerWidget()
    PrayerScheduleWidget()
    PrayerProgressWidget()
    if #available(iOS 16.2, *) {
      PrayerLiveActivity()
    }
  }
}
