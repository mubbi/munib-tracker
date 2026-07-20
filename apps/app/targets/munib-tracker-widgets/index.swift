import WidgetKit
import SwiftUI

@main
struct MunibTrackerWidgetsBundle: WidgetBundle {
  var body: some Widget {
    MunibPrayerWidgetsBundle().body
    MunibDevotionWidgetsBundle().body
    MunibDiscoveryWidgetsBundle().body
    MunibContentWidgetsBundle().body
  }
}

/// Salah core widgets (count ≤ 5 for WidgetBundle limits).
struct MunibPrayerWidgetsBundle: WidgetBundle {
  var body: some Widget {
    NextPrayerWidget()
    PrayerScheduleWidget()
    PrayerProgressWidget()
    SalahStreakWidget()
    QazaDebtWidget()
  }
}

struct MunibDevotionWidgetsBundle: WidgetBundle {
  var body: some Widget {
    RamadanWidget()
    KhatmProgressWidget()
    QiblaBearingWidget()
    HijriDateWidget()
    DailyHadithWidget()
  }
}

/// Phase 8 discovery widgets — kept in their own bundle so each group stays ≤ 5.
struct MunibDiscoveryWidgetsBundle: WidgetBundle {
  var body: some Widget {
    TasbeehGlanceWidget()
    JumuahWidget()
  }
}

struct MunibContentWidgetsBundle: WidgetBundle {
  var body: some Widget {
    if #available(iOS 16.2, *) {
      PrayerLiveActivity()
    }
  }
}
