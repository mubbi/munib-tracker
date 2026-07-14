import Foundation
import SwiftUI

struct WidgetThemePayload: Decodable {
  let isDark: Bool?
  let primary: String?
  let background: String?
  let cardBackground: String?
  let textPrimary: String?
  let textSecondary: String?
  let border: String?
  let success: String?
  let warning: String?
}

struct WidgetSectionPayload: Decodable {
  let title: String?
  let summary: String?
  let deepLink: String?
  let lockScreenLine: String?
  let lockScreenDetail: String?
  let ctaLabel: String?
}

struct WidgetSnapshotPayload: Decodable {
  struct ScheduleRow: Decodable {
    let id: String
    let name: String
    let time: String
    let status: String?
  }

  struct NextPrayerSection: Decodable {
    let title: String?
    let summary: String?
    let deepLink: String?
    let lockScreenLine: String?
    let lockScreenDetail: String?
    let ctaLabel: String?
    let prayerId: String?
    let prayerName: String?
    let prayerTime: String?
    let countdownLabel: String?
    let minutesUntil: Int?
    let displayDate: String?
    let location: String?
  }

  struct ScheduleSection: Decodable {
    let title: String?
    let summary: String?
    let deepLink: String?
    let lockScreenLine: String?
    let lockScreenDetail: String?
    let ctaLabel: String?
    let rows: [ScheduleRow]?
  }

  struct ProgressSection: Decodable {
    let title: String?
    let summary: String?
    let deepLink: String?
    let lockScreenLine: String?
    let lockScreenDetail: String?
    let ctaLabel: String?
    let progressLabel: String?
    let progressPercent: Double?
    let completed: Int?
    let total: Int?
  }

  let version: Int?
  let updatedAt: String?
  let updatedAgoLabel: String?
  let locationDenied: Bool?
  let theme: WidgetThemePayload?
  let nextPrayer: NextPrayerSection?
  let schedule: ScheduleSection?
  let progress: ProgressSection?
}

enum WidgetSnapshotStore {
  static let appGroup = "group.app.munibtracker.widgets"
  static let key = "widget_snapshot_v1"

  static func load() -> WidgetSnapshotPayload? {
    guard let raw = UserDefaults(suiteName: appGroup)?.string(forKey: key),
          let data = raw.data(using: .utf8) else {
      return nil
    }
    return try? JSONDecoder().decode(WidgetSnapshotPayload.self, from: data)
  }

  /// Face-gallery / first-install placeholder when App Group has no snapshot yet.
  static func placeholder() -> WidgetSnapshotPayload {
    let json = """
    {"version":1,"locationDenied":false,"nextPrayer":{"title":"Next Salah","deepLink":"munib-tracker://","lockScreenLine":"Asr","lockScreenDetail":"in 42 min","prayerId":"asr","prayerName":"Asr","prayerTime":"4:18 PM","countdownLabel":"42 min","minutesUntil":42},"schedule":{"title":"Today","summary":"3 of 5","deepLink":"munib-tracker://tracker","lockScreenLine":"Today","lockScreenDetail":"3 of 5","rows":[{"id":"fajr","name":"Fajr","time":"5:12 AM","status":"completed"},{"id":"dhuhr","name":"Dhuhr","time":"12:34 PM","status":"completed"},{"id":"asr","name":"Asr","time":"4:18 PM","status":"active"},{"id":"maghrib","name":"Maghrib","time":"7:01 PM","status":"pending"},{"id":"isha","name":"Isha","time":"8:22 PM","status":"pending"}]},"progress":{"title":"Progress","deepLink":"munib-tracker://tracker","lockScreenLine":"Progress","lockScreenDetail":"3/5","progressLabel":"3/5","progressPercent":60,"completed":3,"total":5}}
    """
    let data = Data(json.utf8)
    return (try? JSONDecoder().decode(WidgetSnapshotPayload.self, from: data))
      ?? (try! JSONDecoder().decode(WidgetSnapshotPayload.self, from: Data("{\"version\":1}".utf8)))
  }
}

/// Budgeted WidgetKit reload points — current snapshot plus next Salah boundary.
enum WidgetReloadSchedule {
  static func nextReloadDate(from snapshot: WidgetSnapshotPayload?, now: Date = Date()) -> Date {
    timelineDates(from: snapshot, now: now).last ?? now.addingTimeInterval(900)
  }

  /// Returns ascending dates for timeline entries (always includes `now`).
  static func timelineDates(from snapshot: WidgetSnapshotPayload?, now: Date = Date()) -> [Date] {
    var dates: [Date] = [now]
    if let minutes = snapshot?.nextPrayer?.minutesUntil, minutes > 0 {
      let boundary = now.addingTimeInterval(TimeInterval(minutes * 60))
      dates.append(boundary)
      // Pre-Adhan glance window (~15 min) when the wait is longer.
      if minutes > 20 {
        dates.append(boundary.addingTimeInterval(-15 * 60))
      }
    } else {
      dates.append(now.addingTimeInterval(900))
    }
    let unique = Array(Set(dates.map { $0.timeIntervalSince1970 }))
      .sorted()
      .map { Date(timeIntervalSince1970: $0) }
      .filter { $0 >= now.addingTimeInterval(-1) }
    return unique.isEmpty ? [now] : unique
  }

  /// 0…1 urgency for the next Salah window (fills as Adhan approaches within ~60m).
  static func countdownFraction(minutesUntil: Int?) -> Double {
    guard let minutesUntil, minutesUntil >= 0 else { return 0 }
    let capped = min(Double(minutesUntil), 60)
    return max(0, min(1, 1 - capped / 60))
  }
}

enum WidgetPalette {
  static func color(_ hex: String?, fallback: Color) -> Color {
    guard let hex, hex.hasPrefix("#"), hex.count >= 7 else { return fallback }
    return Color(hex: hex) ?? fallback
  }

  static func theme(from payload: WidgetSnapshotPayload?) -> ResolvedWidgetTheme {
    let t = payload?.theme
    let isDark = t?.isDark ?? false
    return ResolvedWidgetTheme(
      isDark: isDark,
      primary: color(t?.primary, fallback: Color("accent")),
      cardBackground: color(t?.cardBackground, fallback: Color("widgetBackground")),
      textPrimary: color(t?.textPrimary, fallback: isDark ? .white : .primary),
      textSecondary: color(t?.textSecondary, fallback: .secondary),
      border: color(t?.border, fallback: Color.gray.opacity(0.25)),
      success: color(t?.success, fallback: Color("accent")),
      warning: color(t?.warning, fallback: .orange)
    )
  }
}

struct ResolvedWidgetTheme {
  let isDark: Bool
  let primary: Color
  let cardBackground: Color
  let textPrimary: Color
  let textSecondary: Color
  let border: Color
  let success: Color
  let warning: Color
}

extension Color {
  init?(hex: String) {
    var cleaned = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
    if cleaned.hasPrefix("#") { cleaned.removeFirst() }
    guard cleaned.count == 6, let value = UInt64(cleaned, radix: 16) else { return nil }
    let r = Double((value & 0xFF0000) >> 16) / 255
    let g = Double((value & 0x00FF00) >> 8) / 255
    let b = Double(value & 0x0000FF) / 255
    self.init(red: r, green: g, blue: b)
  }
}
