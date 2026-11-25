#if os(watchOS)
import Foundation

/// How a Salah row reads on the watch at a given instant.
enum WatchSalahState: Equatable {
  /// Logged on the phone, or marked on the watch and not yet echoed back.
  case completed
  /// Its time has begun and it isn't logged: the watch may mark it.
  case due
  /// The next Salah to begin.
  case next
  /// Begins later today.
  case upcoming
}

struct WatchSalahRow: Identifiable, Equatable {
  let id: String
  let name: String
  let time: String
  /// Adhan instant; nil on snapshots written before the watch contract.
  let at: Date?
  let state: WatchSalahState
  let statusLabel: String?
}

/// The next Salah the watch counts down to.
struct WatchNextSalah: Equatable {
  let id: String
  let name: String
  let time: String
  let at: Date?
}

/// Pure resolver shared by the watch app and the face complications. The phone's
/// snapshot freezes statuses at the moment it was built; the watch re-reads them
/// from each row's Adhan instant so it moves on to the next Salah without a push.
enum WatchSalahResolver {
  /// Local calendar day (yyyy-MM-dd), same rules as `ExternalCommandQueue.localDateString`.
  static func localDay(_ date: Date = Date()) -> String {
    ExternalCommandQueue.localDateString(date)
  }

  /// The snapshot's schedule belongs to another day than the watch's (the phone
  /// hasn't pushed since midnight). Placeholders without dates are never stale.
  static func isStale(_ snapshot: WidgetSnapshotPayload?, now: Date = Date()) -> Bool {
    guard let snapshot else { return false }
    let today = localDay(now)
    if let day = snapshot.date, !day.isEmpty {
      return day != today
    }
    guard let iso = snapshot.updatedAt, let updated = parseISO(iso) else { return false }
    // Epoch placeholder (`new Date(0)`) means "never synced", not stale.
    if updated.timeIntervalSince1970 < 86_400 { return false }
    return localDay(updated) != today
  }

  /// Day to send with `mark-prayer`: the snapshot's own day, else the watch's.
  static func markDate(_ snapshot: WidgetSnapshotPayload?, now: Date = Date()) -> String {
    if let day = snapshot?.date, !day.isEmpty { return day }
    return localDay(now)
  }

  /// Rows with statuses for `now`, folding in marks made on the watch (`localMarks`).
  /// A stale snapshot keeps the phone's statuses and never offers marking.
  static func rows(
    _ snapshot: WidgetSnapshotPayload?,
    now: Date = Date(),
    localMarks: Set<String> = []
  ) -> [WatchSalahRow] {
    let raw = snapshot?.schedule?.rows ?? []
    guard !raw.isEmpty else { return [] }
    let stale = isStale(snapshot, now: now)
    let hasInstants = raw.allSatisfy { ($0.atMs ?? 0) > 0 }

    if hasInstants && !stale {
      let nextIndex = raw.firstIndex { instant($0.atMs).map { $0 > now } ?? false }
      return raw.enumerated().map { index, row in
        let at = instant(row.atMs)
        let completed = row.status == "completed" || localMarks.contains(row.id)
        let state: WatchSalahState
        if completed {
          state = .completed
        } else if let at, at <= now {
          state = .due
        } else if index == nextIndex {
          state = .next
        } else {
          state = .upcoming
        }
        return WatchSalahRow(
          id: row.id, name: row.name, time: row.time, at: at, state: state,
          statusLabel: phoneLabel(row, matching: state)
        )
      }
    }

    // Older snapshot (no Adhan instants) or a stale day: trust the phone's statuses.
    // Rows before the phone's "active" (next) row have begun; rows after it haven't.
    let activeIndex = raw.firstIndex { $0.status == "active" }
    return raw.enumerated().map { index, row in
      let completed = row.status == "completed" || (!stale && localMarks.contains(row.id))
      let state: WatchSalahState
      if completed {
        state = .completed
      } else if stale {
        state = .upcoming
      } else if let activeIndex {
        state = index < activeIndex ? .due : (index == activeIndex ? .next : .upcoming)
      } else {
        state = .due
      }
      return WatchSalahRow(
        id: row.id, name: row.name, time: row.time, at: instant(row.atMs), state: state,
        statusLabel: row.statusLabel
      )
    }
  }

  /// The next Salah after `now`. Falls back to the snapshot's own next prayer (which
  /// may be tomorrow's Fajr when the phone built it after Isha) while it's still ahead.
  static func next(_ snapshot: WidgetSnapshotPayload?, now: Date = Date()) -> WatchNextSalah? {
    if !isStale(snapshot, now: now),
       let row = rows(snapshot, now: now).first(where: { $0.state == .next }) {
      // Older snapshots carry the instant only on the next-prayer section.
      let at = row.at ?? (snapshot?.nextPrayer?.prayerId == row.id ? instant(snapshot?.nextPrayer?.targetTimeMs) : nil)
      return WatchNextSalah(id: row.id, name: row.name, time: row.time, at: at)
    }
    guard let section = snapshot?.nextPrayer, let name = section.prayerName, !name.isEmpty else {
      return nil
    }
    let at = instant(section.targetTimeMs)
    if let at {
      guard at > now else { return nil }
    } else if rows(snapshot, now: now).contains(where: { $0.at != nil }) {
      return nil
    }
    return WatchNextSalah(
      id: section.prayerId ?? "", name: name, time: section.prayerTime ?? "", at: at
    )
  }

  /// The Salah whose time is running now, when it can still be marked: the latest
  /// begun row, if it isn't logged (mirrors the phone's "current window" rule).
  /// Earlier missed rows stay markable from the Today page.
  static func markableCurrent(
    _ snapshot: WidgetSnapshotPayload?,
    now: Date = Date(),
    localMarks: Set<String> = []
  ) -> WatchSalahRow? {
    let all = rows(snapshot, now: now, localMarks: localMarks)
    guard let current = all.last(where: { $0.state == .due || isBegun($0, now: now) }) else {
      return nil
    }
    return current.state == .due ? current : nil
  }

  /// Completed / total for the ring, preferring live row states over the frozen summary.
  static func progress(
    _ snapshot: WidgetSnapshotPayload?,
    now: Date = Date(),
    localMarks: Set<String> = []
  ) -> (completed: Int, total: Int) {
    let all = rows(snapshot, now: now, localMarks: localMarks)
    if !all.isEmpty {
      return (all.filter { $0.state == .completed }.count, all.count)
    }
    return (snapshot?.progress?.completed ?? 0, snapshot?.progress?.total ?? 5)
  }

  /// Every obligatory Salah of the snapshot's day is logged.
  static func allDone(
    _ snapshot: WidgetSnapshotPayload?,
    now: Date = Date(),
    localMarks: Set<String> = []
  ) -> Bool {
    guard !isStale(snapshot, now: now) else { return false }
    let all = rows(snapshot, now: now, localMarks: localMarks)
    return !all.isEmpty && all.allSatisfy { $0.state == .completed }
  }

  /// Future Adhan instants (ascending) — complication timeline boundaries.
  static func upcomingInstants(_ snapshot: WidgetSnapshotPayload?, after now: Date) -> [Date] {
    var dates = (snapshot?.schedule?.rows ?? []).compactMap { instant($0.atMs) }
    if let target = instant(snapshot?.nextPrayer?.targetTimeMs) { dates.append(target) }
    return Array(Set(dates)).filter { $0 > now }.sorted()
  }

  static func instant(_ ms: Double?) -> Date? {
    guard let ms, ms > 0 else { return nil }
    return Date(timeIntervalSince1970: ms / 1000)
  }

  /// The phone's localized status only while it still describes the row.
  private static func phoneLabel(
    _ row: WidgetSnapshotPayload.ScheduleRow,
    matching state: WatchSalahState
  ) -> String? {
    switch state {
    case .completed: return row.status == "completed" ? row.statusLabel : nil
    case .next: return row.status == "active" ? row.statusLabel : nil
    case .due, .upcoming: return row.status == "pending" ? row.statusLabel : nil
    }
  }

  private static func isBegun(_ row: WatchSalahRow, now: Date) -> Bool {
    guard let at = row.at else { return row.state == .completed || row.state == .due }
    return at <= now
  }

  static func parseISO(_ iso: String) -> Date? {
    let precise = ISO8601DateFormatter()
    precise.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    return precise.date(from: iso) ?? ISO8601DateFormatter().date(from: iso)
  }
}

/// Watch-local tasbeeh state in the watch's App Group, so the face complication
/// can show the count the watch app keeps. Never synced to the phone.
enum WatchTasbeehStore {
  static let countKey = "munib.watch.tasbeeh.count"
  static let targetKey = "munib.watch.tasbeeh.target"
  static let modeKey = "munib.watch.tasbeeh.mode"
  static let sequenceKey = "munib.watch.tasbeeh.sequence"
  static let complicationKind = "WatchTasbeehComplication"

  static var defaults: UserDefaults? { UserDefaults(suiteName: WidgetSnapshotStore.appGroup) }

  static var count: Int { defaults?.integer(forKey: countKey) ?? 0 }

  /// 33 by default; 0 = unlimited.
  static var target: Int {
    guard let defaults, defaults.object(forKey: targetKey) != nil else { return 33 }
    return defaults.integer(forKey: targetKey)
  }
}
#endif
