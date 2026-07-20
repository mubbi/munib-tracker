import Foundation
import SwiftUI

struct WidgetThemePayload: Decodable {
  let isDark: Bool?
  let followsSystem: Bool?
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
  let accessibilityLabel: String?
}

struct WidgetSnapshotPayload: Decodable {
  struct ScheduleRow: Decodable {
    let id: String
    let name: String
    let time: String
    let status: String?
    let statusLabel: String?
  }

  struct NextPrayerSection: Decodable {
    let title: String?
    let summary: String?
    let deepLink: String?
    let lockScreenLine: String?
    let lockScreenDetail: String?
    let ctaLabel: String?
    let accessibilityLabel: String?
    let prayerId: String?
    let prayerName: String?
    let prayerTime: String?
    let prayerTimeLabel: String?
    let countdownLabel: String?
    let remainingLabel: String?
    let minutesUntil: Int?
    let targetTimeMs: Double?
    let displayDate: String?
    let location: String?
    let followingName: String?
    let followingTime: String?
    let markLabel: String?
  }

  struct ScheduleSection: Decodable {
    let title: String?
    let summary: String?
    let deepLink: String?
    let lockScreenLine: String?
    let lockScreenDetail: String?
    let ctaLabel: String?
    let accessibilityLabel: String?
    let rows: [ScheduleRow]?
  }

  struct ProgressSection: Decodable {
    let title: String?
    let summary: String?
    let deepLink: String?
    let lockScreenLine: String?
    let lockScreenDetail: String?
    let ctaLabel: String?
    let accessibilityLabel: String?
    let progressLabel: String?
    let progressPercent: Double?
    let completed: Int?
    let total: Int?
    let markLabel: String?
  }

  struct StreakSection: Decodable {
    let title: String?
    let summary: String?
    let deepLink: String?
    let lockScreenLine: String?
    let lockScreenDetail: String?
    let ctaLabel: String?
    let accessibilityLabel: String?
    let streakDays: Int?
    let streakLabel: String?
  }

  struct QazaSection: Decodable {
    let title: String?
    let summary: String?
    let deepLink: String?
    let lockScreenLine: String?
    let lockScreenDetail: String?
    let ctaLabel: String?
    let accessibilityLabel: String?
    let remaining: Int?
    let remainingLabel: String?
    let todayDone: Int?
    let todayTarget: Int?
    let todayLabel: String?
    let progressPercent: Double?
  }

  struct RamadanSection: Decodable {
    let title: String?
    let summary: String?
    let deepLink: String?
    let lockScreenLine: String?
    let lockScreenDetail: String?
    let ctaLabel: String?
    let accessibilityLabel: String?
    let isRamadan: Bool?
    let dayLabel: String?
    let suhoorLabel: String?
    let suhoorTime: String?
    let iftarLabel: String?
    let iftarTime: String?
    let countdownLabel: String?
    let minutesUntil: Int?
    let targetTimeMs: Double?
  }

  struct KhatmSection: Decodable {
    let title: String?
    let summary: String?
    let deepLink: String?
    let lockScreenLine: String?
    let lockScreenDetail: String?
    let ctaLabel: String?
    let accessibilityLabel: String?
    let hasPlan: Bool?
    let progressLabel: String?
    let progressPercent: Double?
    let todayLabel: String?
    let paceLabel: String?
  }

  struct HadithSection: Decodable {
    let title: String?
    let summary: String?
    let deepLink: String?
    let lockScreenLine: String?
    let lockScreenDetail: String?
    let ctaLabel: String?
    let accessibilityLabel: String?
    let reference: String?
    let arabic: String?
    let meaning: String?
  }

  struct HijriSection: Decodable {
    let title: String?
    let summary: String?
    let deepLink: String?
    let lockScreenLine: String?
    let lockScreenDetail: String?
    let ctaLabel: String?
    let accessibilityLabel: String?
    let hijriDate: String?
    let gregorianDate: String?
    let weekday: String?
  }

  struct QiblaSection: Decodable {
    let title: String?
    let summary: String?
    let deepLink: String?
    let lockScreenLine: String?
    let lockScreenDetail: String?
    let ctaLabel: String?
    let accessibilityLabel: String?
    let bearingDegrees: Int?
    let bearingLabel: String?
    let location: String?
  }

  struct TasbeehSection: Decodable {
    let title: String?
    let summary: String?
    let deepLink: String?
    let lockScreenLine: String?
    let lockScreenDetail: String?
    let ctaLabel: String?
    let accessibilityLabel: String?
    let hasActivity: Bool?
    let dhikrTitle: String?
    let count: Int?
    let target: Int?
    let countLabel: String?
    let progressPercent: Double?
  }

  struct FridaySection: Decodable {
    let title: String?
    let summary: String?
    let deepLink: String?
    let lockScreenLine: String?
    let lockScreenDetail: String?
    let ctaLabel: String?
    let accessibilityLabel: String?
    let isFriday: Bool?
    let completed: Int?
    let total: Int?
    let progressPercent: Double?
    let daysUntil: Int?
  }

  let version: Int?
  let updatedAt: String?
  let updatedAgoLabel: String?
  let locationDenied: Bool?
  let locale: String?
  let isRtl: Bool?
  let theme: WidgetThemePayload?
  let nextPrayer: NextPrayerSection?
  let schedule: ScheduleSection?
  let progress: ProgressSection?
  let streak: StreakSection?
  let qaza: QazaSection?
  let ramadan: RamadanSection?
  let khatm: KhatmSection?
  let dailyHadith: HadithSection?
  let hijriDate: HijriSection?
  let qibla: QiblaSection?
  let tasbeeh: TasbeehSection?
  let friday: FridaySection?
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
    {"version":1,"locale":"en","isRtl":false,"locationDenied":false,"theme":{"isDark":false,"primary":"#059669","cardBackground":"#FFFCF7","textPrimary":"#152921","textSecondary":"#5C7268","border":"#C9C0AE","success":"#059669","warning":"#D97706"},"nextPrayer":{"title":"Next Salah","deepLink":"munib-tracker://","lockScreenLine":"Asr","lockScreenDetail":"in 42 min","prayerId":"asr","prayerName":"Asr","prayerTime":"4:18 PM","countdownLabel":"in 42 min","minutesUntil":42},"schedule":{"title":"Today's schedule","summary":"3 of 5","deepLink":"munib-tracker://tracker","lockScreenLine":"Asr","lockScreenDetail":"4:18 PM","rows":[{"id":"fajr","name":"Fajr","time":"5:12 AM","status":"completed"},{"id":"dhuhr","name":"Dhuhr","time":"12:34 PM","status":"completed"},{"id":"asr","name":"Asr","time":"4:18 PM","status":"active"},{"id":"maghrib","name":"Maghrib","time":"7:01 PM","status":"pending"},{"id":"isha","name":"Isha","time":"8:22 PM","status":"pending"}]},"progress":{"title":"Today's progress","deepLink":"munib-tracker://tracker","lockScreenLine":"3/5","lockScreenDetail":"3 of 5","progressLabel":"3/5","progressPercent":60,"completed":3,"total":5},"streak":{"title":"Salah streak","summary":"12 days","deepLink":"munib-tracker://statistics","lockScreenLine":"12 days","streakDays":12,"streakLabel":"12"},"qaza":{"title":"Qaza","summary":"15 remaining","deepLink":"munib-tracker://qaza","lockScreenLine":"15 remaining","remaining":15,"remainingLabel":"15 remaining","todayDone":1,"todayTarget":3,"todayLabel":"1 / 3 today","progressPercent":33},"ramadan":{"title":"Suhoor & Iftar","summary":"Suhoor & Iftar","deepLink":"munib-tracker://ramadan","suhoorLabel":"Suhoor ends","suhoorTime":"5:12 AM","iftarLabel":"Iftar","iftarTime":"7:01 PM","countdownLabel":"Iftar in 2h","minutesUntil":120},"khatm":{"title":"Khatm plan","summary":"12 of 20 today","deepLink":"munib-tracker://quran/khatm","hasPlan":true,"progressLabel":"34%","progressPercent":34,"todayLabel":"12 of 20 today","paceLabel":"On track"},"dailyHadith":{"title":"Daily hadith","reference":"Nawawi 1","meaning":"Actions are but by intention.","deepLink":"munib-tracker://hadith/daily"},"hijriDate":{"title":"Islamic date","hijriDate":"25 Muharram 1448","gregorianDate":"July 20, 2026","weekday":"Monday","deepLink":"munib-tracker://calendar"},"qibla":{"title":"Qibla","bearingLabel":"292°","bearingDegrees":292,"location":"Karachi","deepLink":"munib-tracker://qibla"},"tasbeeh":{"title":"Tasbeeh","deepLink":"munib-tracker://tasbeeh/free","hasActivity":true,"dhikrTitle":"Durood Shareef","count":20,"target":100,"countLabel":"20 / 100","progressPercent":20},"friday":{"title":"Jumu'ah","deepLink":"munib-tracker://tracker?focus=friday","lockScreenDetail":"3/6 done","isFriday":true,"completed":3,"total":6,"progressPercent":50,"daysUntil":0}}
    """
    let data = Data(json.utf8)
    return (try? JSONDecoder().decode(WidgetSnapshotPayload.self, from: data))
      ?? (try! JSONDecoder().decode(WidgetSnapshotPayload.self, from: Data("{\"version\":1}".utf8)))
  }
}

/// Budgeted WidgetKit reload points — denser near Adhan so countdowns stay relevant.
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
      if minutes > 20 {
        dates.append(boundary.addingTimeInterval(-15 * 60))
      }
      // Extra glances in the last half-hour before Adhan (HIG: keep content fresh).
      if minutes > 5 {
        for offset in [5, 10, 20, 30] where minutes > offset {
          dates.append(boundary.addingTimeInterval(TimeInterval(-offset * 60)))
        }
      }
    } else {
      dates.append(now.addingTimeInterval(900))
    }
    if let minutes = snapshot?.ramadan?.minutesUntil, minutes > 0 {
      dates.append(now.addingTimeInterval(TimeInterval(minutes * 60)))
    }
    let unique = Array(Set(dates.map { $0.timeIntervalSince1970 }))
      .sorted()
      .map { Date(timeIntervalSince1970: $0) }
      .filter { $0 >= now.addingTimeInterval(-1) }
    return unique.isEmpty ? [now] : unique
  }

  static func countdownFraction(minutesUntil: Int?) -> Double {
    guard let minutesUntil, minutesUntil >= 0 else { return 0 }
    let capped = min(Double(minutesUntil), 60)
    return max(0, min(1, 1 - capped / 60))
  }

  /// Recompute freshness from `updatedAt` so the label ages between snapshot writes.
  /// Uses `RelativeDateTimeFormatter` so the string follows the snapshot locale.
  static func updatedAgoLabel(from snapshot: WidgetSnapshotPayload?, now: Date = Date()) -> String? {
    guard let iso = snapshot?.updatedAt,
          let updated = ISO8601DateFormatter().date(from: iso) else {
      return snapshot?.updatedAgoLabel
    }
    if now.timeIntervalSince(updated) < 60 {
      return snapshot?.updatedAgoLabel
    }
    let formatter = RelativeDateTimeFormatter()
    if let locale = snapshot?.locale, !locale.isEmpty {
      formatter.locale = Locale(identifier: locale)
    }
    formatter.unitsStyle = .abbreviated
    return formatter.localizedString(for: updated, relativeTo: now)
  }
}

enum WidgetPalette {
  /// Contrast-tuned palettes (mirrors JS `widgetTokens.ts`).
  private static let lightCard = Color(red: 1.0, green: 0.988, blue: 0.969) // #FFFCF7
  private static let lightText = Color(red: 0.082, green: 0.161, blue: 0.129) // #152921
  private static let lightSecondary = Color(red: 0.290, green: 0.373, blue: 0.337) // #4A5F56
  private static let lightBorder = Color(red: 0.788, green: 0.753, blue: 0.682) // #C9C0AE
  private static let darkCard = Color(red: 0.110, green: 0.196, blue: 0.173) // #1C322C
  private static let darkText = Color(red: 0.910, green: 0.863, blue: 0.784) // #E8DCC8
  private static let darkSecondary = Color(red: 0.639, green: 0.741, blue: 0.690) // #A3BDB0
  private static let darkBorder = Color(red: 0.165, green: 0.271, blue: 0.235) // #2A453C

  static func color(_ hex: String?, fallback: Color) -> Color {
    guard let hex, hex.hasPrefix("#"), hex.count >= 7 else { return fallback }
    return Color(hex: hex) ?? fallback
  }

  /// When Appearance is System (`followsSystem`), adapt card chrome to the
  /// widget environment color scheme while keeping the app accent.
  static func theme(
    from payload: WidgetSnapshotPayload?,
    colorScheme: ColorScheme? = nil
  ) -> ResolvedWidgetTheme {
    let t = payload?.theme
    let followsSystem = t?.followsSystem ?? true
    let primary = color(t?.primary, fallback: Color("accent"))
    let isDark: Bool = {
      if followsSystem, let colorScheme {
        return colorScheme == .dark
      }
      return t?.isDark ?? false
    }()

    if followsSystem {
      return ResolvedWidgetTheme(
        isDark: isDark,
        primary: primary,
        cardBackground: isDark ? darkCard : lightCard,
        textPrimary: isDark ? darkText : lightText,
        textSecondary: isDark ? darkSecondary : lightSecondary,
        border: isDark ? darkBorder : lightBorder,
        success: color(t?.success, fallback: primary),
        warning: color(t?.warning, fallback: .orange)
      )
    }

    return ResolvedWidgetTheme(
      isDark: isDark,
      primary: primary,
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
