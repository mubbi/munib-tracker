import ActivityKit
import Foundation

/// Shared Live Activity attributes for the next-prayer countdown (NF-1.19).
///
/// IMPORTANT: this file is duplicated verbatim in
/// `modules/munib-live-activity/ios/PrayerActivityAttributes.swift`. ActivityKit
/// matches a running activity to this extension's `ActivityConfiguration` by this
/// type's name and Codable shape, so both copies MUST stay identical.
/// Change one → change the other.
public struct PrayerActivityAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    public var prayerId: String
    public var prayerName: String
    public var prayerTime: String
    public var prayerTimeLabel: String
    public var countdownLabel: String
    public var remainingLabel: String
    public var prepareLabel: String
    public var actionLabel: String
    public var actionDeepLink: String
    public var phase: String
    public var qiblaLabel: String
    public var locale: String
    public var isRtl: Bool
    public var minutesUntil: Int
    public var targetTimeMs: Double
    public var displayDate: String
    public var location: String
    public var progressLabel: String
    public var progressPercent: Double
    public var locationDenied: Bool
    public var title: String
    public var deepLink: String
    public var isDark: Bool
    public var primary: String
    public var background: String
    public var cardBackground: String
    public var textPrimary: String
    public var textSecondary: String

    /// The next-prayer instant, used for a self-updating `Text(timerInterval:)`.
    public var targetDate: Date {
      Date(timeIntervalSince1970: targetTimeMs / 1000.0)
    }
  }
}
