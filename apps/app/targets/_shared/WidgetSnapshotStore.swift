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
  static let appGroup = "group.com.munibtracker.widgets"
  static let key = "widget_snapshot_v1"

  static func load() -> WidgetSnapshotPayload? {
    guard let raw = UserDefaults(suiteName: appGroup)?.string(forKey: key),
          let data = raw.data(using: .utf8) else {
      return nil
    }
    return try? JSONDecoder().decode(WidgetSnapshotPayload.self, from: data)
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
