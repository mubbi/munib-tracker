import ActivityKit
import Foundation

/// Shared Live Activity attributes for the next-prayer countdown (NF-1.19).
///
/// IMPORTANT: this file is duplicated verbatim in
/// `targets/munib-tracker-widgets/PrayerActivityAttributes.swift`. ActivityKit
/// matches a running activity to the widget extension's `ActivityConfiguration`
/// by this type's name and Codable shape, so both copies MUST stay identical.
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

    // Optional fields (added after the first release): pushes and app builds that
    // predate them still decode, because synthesized `Decodable` treats a missing
    // Optional key as nil.

    /// Today's obligatory Salah in order, for the five-dot status row.
    public var daySalah: [DaySalah]?
    /// "May be out of date" caption shown while `context.isStale`.
    public var staleLabel: String?
    /// Localized "Done" badge, shown while the displayed Salah's dot is filled.
    public var confirmationLabel: String?
    /// Precomputed content for the Mark Salah button (`markSalah` phase only), so
    /// `MarkSalahLiveActivityIntent` can update the activity at once without JS.
    public var markedActionLabel: String?
    public var markedActionDeepLink: String?
    public var markedProgressLabel: String?
    public var markedProgressPercent: Double?

    /// The next-prayer instant, used for a self-updating `Text(timerInterval:)`.
    public var targetDate: Date {
      Date(timeIntervalSince1970: targetTimeMs / 1000.0)
    }

    /// The displayed Salah is already marked (drives the "Done" badge).
    public var displayedSalahDone: Bool {
      daySalah?.first(where: { $0.id == prayerId })?.done ?? false
    }

    /// True when the Mark Salah button can run in place (no app launch).
    public var canMarkInPlace: Bool {
      phase == "markSalah" && !(markedActionLabel ?? "").isEmpty
    }

    /// The state after the Mark Salah button: after-Salah adhkar, progress +1, and
    /// the current dot filled. Nil when the activity isn't offering Mark Salah.
    public func markedState() -> ContentState? {
      guard canMarkInPlace, let label = markedActionLabel else { return nil }
      var next = self
      next.phase = "afterSalah"
      next.actionLabel = label
      next.title = label
      if let link = markedActionDeepLink, !link.isEmpty {
        next.actionDeepLink = link
        next.deepLink = link
      }
      if let progress = markedProgressLabel { next.progressLabel = progress }
      if let percent = markedProgressPercent { next.progressPercent = percent }
      next.daySalah = daySalah?.map { day in
        day.id == prayerId ? DaySalah(id: day.id, done: true) : day
      }
      next.markedActionLabel = nil
      next.markedActionDeepLink = nil
      next.markedProgressLabel = nil
      next.markedProgressPercent = nil
      return next
    }
  }

  /// One obligatory Salah in the status row.
  public struct DaySalah: Codable, Hashable {
    public var id: String
    public var done: Bool

    public init(id: String, done: Bool) {
      self.id = id
      self.done = done
    }
  }
}
