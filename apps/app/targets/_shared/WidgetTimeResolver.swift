#if !os(watchOS)
import Foundation

// Phone widgets + Siri: the snapshot the app wrote, re-derived for a moment in
// time, so widgets stay right between app syncs (next Salah after its Adhan,
// midnight rollover to tomorrow's times, the adhkar set that is due, and marks
// still waiting in the command queue).
//
// Works on the raw JSON (dictionary in, dictionary out, then the usual
// `WidgetSnapshotPayload` decode) so the shared payload structs used by the
// watch targets stay untouched. TS mirror: `src/lib/appSurfaces/widgets/
// resolveSnapshotAt.ts` — keep both in step.

// MARK: - Phone-only snapshot sections (decoded beside `WidgetSnapshotPayload`)

struct WidgetAdhkarSetPayload: Decodable {
  let key: String?
  let title: String?
  let completed: Int?
  let total: Int?
  let progressLabel: String?
  let startMs: Double?
  let endMs: Double?
  let nextLabel: String?
  let deepLink: String?
}

struct WidgetAdhkarPayload: Decodable {
  let title: String?
  let summary: String?
  let deepLink: String?
  let lockScreenLine: String?
  let lockScreenDetail: String?
  let accessibilityLabel: String?
  let dueLabel: String?
  let allDoneLabel: String?
  let sets: [WidgetAdhkarSetPayload]?
}

struct WidgetEventItemPayload: Decodable {
  let id: String?
  let name: String?
  let date: String?
  let dateLabel: String?
  let relativeLabel: String?
  let daysUntil: Int?
}

struct WidgetEventsPayload: Decodable {
  let title: String?
  let summary: String?
  let deepLink: String?
  let lockScreenLine: String?
  let lockScreenDetail: String?
  let accessibilityLabel: String?
  let items: [WidgetEventItemPayload]?
}

struct WidgetExtraStrings: Decodable {
  let voiceNextSalah: String?
  let voiceSalahTime: String?
  let openAppToSync: String?
  let allDone: String?
  let markSalah: String?
}

/// Sections only the phone widgets / Siri read (adhkar, events, voice templates).
struct WidgetExtrasPayload: Decodable {
  let date: String?
  let locale: String?
  let adhkar: WidgetAdhkarPayload?
  let events: WidgetEventsPayload?
  let strings: WidgetExtraStrings?
}

struct ResolvedWidgetData {
  let snapshot: WidgetSnapshotPayload?
  let extras: WidgetExtrasPayload?
}

enum WidgetTimeResolver {
  typealias JSON = [String: Any]

  // MARK: Loading

  static func rawSnapshot() -> JSON? {
    guard let raw = UserDefaults(suiteName: WidgetSnapshotStore.appGroup)?
      .string(forKey: WidgetSnapshotStore.key),
      let data = raw.data(using: .utf8) else { return nil }
    return (try? JSONSerialization.jsonObject(with: data)) as? JSON
  }

  /// Marks still in the App Group queue (widget button, Siri, watch bridge).
  static func pendingCommands() -> [JSON] {
    ExternalCommandQueue.peekAll().compactMap { item in
      guard let data = item.data(using: .utf8) else { return nil }
      return (try? JSONSerialization.jsonObject(with: data)) as? JSON
    }
  }

  /// The stored snapshot resolved for `date` (nil snapshot when the app never synced).
  static func load(at date: Date = Date()) -> ResolvedWidgetData {
    guard let raw = rawSnapshot() else { return ResolvedWidgetData(snapshot: nil, extras: nil) }
    return decode(resolve(raw, at: date, pending: pendingCommands()))
  }

  static func decode(_ json: JSON) -> ResolvedWidgetData {
    guard let data = try? JSONSerialization.data(withJSONObject: json) else {
      return ResolvedWidgetData(snapshot: nil, extras: nil)
    }
    let decoder = JSONDecoder()
    return ResolvedWidgetData(
      snapshot: try? decoder.decode(WidgetSnapshotPayload.self, from: data),
      extras: try? decoder.decode(WidgetExtrasPayload.self, from: data)
    )
  }

  // MARK: Resolution

  private static func ms(_ value: Any?) -> Double {
    (value as? NSNumber)?.doubleValue ?? 0
  }

  private static func str(_ value: Any?) -> String {
    value as? String ?? ""
  }

  /// Index of the latest row whose Adhan has begun.
  private static func currentIndex(_ rows: [JSON], nowMs: Double) -> Int? {
    rows.lastIndex { ms($0["atMs"]) > 0 && ms($0["atMs"]) <= nowMs }
  }

  /// The adhkar set to lead with: open + unfinished (started first, then earliest), else next to open.
  static func pickAdhkar(_ sets: [JSON], nowMs: Double) -> (due: Bool, set: JSON)? {
    func unfinished(_ set: JSON) -> Bool {
      ((set["completed"] as? NSNumber)?.intValue ?? 0) < ((set["total"] as? NSNumber)?.intValue ?? 0)
    }
    let open = sets
      .filter { ms($0["startMs"]) <= nowMs && nowMs < ms($0["endMs"]) && unfinished($0) }
      .sorted {
        let a = ((($0["completed"] as? NSNumber)?.intValue ?? 0) > 0)
        let b = ((($1["completed"] as? NSNumber)?.intValue ?? 0) > 0)
        return a != b ? a : ms($0["startMs"]) < ms($1["startMs"])
      }
    if let first = open.first { return (due: true, set: first) }
    let next = sets
      .filter { ms($0["startMs"]) > nowMs && unfinished($0) }
      .min { ms($0["startMs"]) < ms($1["startMs"]) }
    return next.map { (due: false, set: $0) }
  }

  /// Localized "in 42 min" relative to `now`, in the snapshot locale.
  private static func relative(_ target: Date, from now: Date, locale: String?) -> String {
    let formatter = RelativeDateTimeFormatter()
    if let locale, !locale.isEmpty { formatter.locale = Locale(identifier: locale) }
    formatter.unitsStyle = .short
    return formatter.localizedString(for: target, relativeTo: now)
  }

  static func resolve(_ json: JSON, at now: Date, pending: [JSON] = []) -> JSON {
    var root = json
    let nowMs = now.timeIntervalSince1970 * 1000
    let today = ExternalCommandQueue.localDateString(now)
    let snapDate = str(root["date"])
    var schedule = root["schedule"] as? JSON ?? [:]
    let tomorrowDate = str(schedule["tomorrowDate"])
    let tomorrowRows = schedule["tomorrowRows"] as? [JSON] ?? []
    let rolled = !snapDate.isEmpty && today != snapDate && today == tomorrowDate && !tomorrowRows.isEmpty
    let staleDay = !snapDate.isEmpty && today != snapDate && !rolled
    let locale = root["locale"] as? String

    // Adhkar: purely time-based.
    if var adhkar = root["adhkar"] as? JSON, let sets = adhkar["sets"] as? [JSON], !sets.isEmpty {
      let title = str(adhkar["title"])
      if let pick = pickAdhkar(sets, nowMs: nowMs) {
        let line = str(pick.set["title"])
        let detail = pick.due ? str(pick.set["progressLabel"]) : str(pick.set["nextLabel"])
        adhkar["lockScreenLine"] = line
        adhkar["lockScreenDetail"] = detail
        adhkar["summary"] = pick.due ? str(adhkar["dueLabel"]) : detail
        if pick.due { adhkar["deepLink"] = str(pick.set["deepLink"]) }
        adhkar["accessibilityLabel"] = "\(title). \(line). \(detail)"
      } else {
        let done = str(adhkar["allDoneLabel"])
        adhkar["lockScreenLine"] = title
        adhkar["lockScreenDetail"] = done
        adhkar["summary"] = done
        adhkar["accessibilityLabel"] = "\(title). \(done)"
      }
      root["adhkar"] = adhkar
    }

    if rolled, var hijri = root["hijriDate"] as? JSON, let tomorrow = hijri["tomorrow"] as? JSON {
      for (key, value) in tomorrow { hijri[key] = value }
      root["hijriDate"] = hijri
    }

    let todayRows = schedule["rows"] as? [JSON] ?? []
    if staleDay {
      // Days old: the running Salah from the sync day is not today's — never offer Mark for it.
      var nextPrayer = root["nextPrayer"] as? JSON ?? [:]
      nextPrayer["currentPrayerId"] = ""
      nextPrayer["currentPrayerAtMs"] = 0.0
      root["nextPrayer"] = nextPrayer
      return root
    }
    if (root["locationDenied"] as? Bool) == true || todayRows.isEmpty { return root }

    let rowsDate = rolled ? tomorrowDate : snapDate
    var rows: [JSON] = rolled ? tomorrowRows.map { var r = $0; r["status"] = "pending"; return r } : todayRows

    // Queued marks show as done straight away (the app applies them on its next drain).
    var marked = Set<String>()
    for command in pending {
      let type = str(command["type"])
      if type == "mark-prayer", str(command["date"]) == rowsDate { marked.insert(str(command["prayerId"])) }
      if type == "mark-current-obligatory", let index = currentIndex(rows, nowMs: nowMs) {
        marked.insert(str(rows[index]["id"]))
      }
    }

    let upcoming = (rows + (rolled ? [] : tomorrowRows)).filter { ms($0["atMs"]) > nowMs }
    let nextRow = upcoming.first
    let followingRow = upcoming.dropFirst().first
    let strings = root["strings"] as? JSON ?? [:]

    rows = rows.map { row in
      var r = row
      let id = str(row["id"])
      let completed = str(row["status"]) == "completed" || marked.contains(id)
      // Same Adhan instant = same row (tomorrow's Fajr has another instant).
      let isNext = nextRow != nil && ms(nextRow?["atMs"]) == ms(row["atMs"])
      let status = completed ? "completed" : (isNext ? "active" : "pending")
      r["status"] = status
      let label: String
      switch status {
      case "completed": label = str(strings["statusCompleted"])
      case "active": label = str(strings["statusActive"])
      default: label = str(strings["statusPending"])
      }
      if !label.isEmpty { r["statusLabel"] = label }
      return r
    }
    schedule["rows"] = rows
    if let nextRow {
      schedule["lockScreenLine"] = str(nextRow["name"])
      schedule["lockScreenDetail"] = str(nextRow["time"])
    }
    root["schedule"] = schedule

    var progress = root["progress"] as? JSON ?? [:]
    let completedCount = rows.filter { str($0["status"]) == "completed" }.count
    let total = rolled ? rows.count : ((progress["total"] as? NSNumber)?.intValue ?? rows.count)
    if rolled || completedCount != ((progress["completed"] as? NSNumber)?.intValue ?? -1) {
      let label = "\(completedCount)/\(total)"
      let detail = completedCount == 0 ? (progress["resetDetail"] as? String ?? label) : label
      progress["completed"] = completedCount
      progress["total"] = total
      progress["progressLabel"] = label
      progress["progressPercent"] = total > 0 ? Double(completedCount * 100 / total) : 0.0
      progress["summary"] = label
      progress["lockScreenLine"] = label
      progress["lockScreenDetail"] = detail
      progress["accessibilityLabel"] = "\(label). \(detail)"
      root["progress"] = progress
    }

    guard let nextRow else { return root }
    var nextPrayer = root["nextPrayer"] as? JSON ?? [:]
    let target = Date(timeIntervalSince1970: ms(nextRow["atMs"]) / 1000)
    let minutes = max(0, Int(ceil((ms(nextRow["atMs"]) - nowMs) / 60_000)))
    let countdown = relative(target, from: now, locale: locale)
    let snapshotTarget = ms(nextPrayer["targetTimeMs"])
    let passed = rolled || snapshotTarget <= 0 || nowMs >= snapshotTarget

    // The running Salah (latest begun row): Fajr through sunrise, like `resolve-markable-prayer`.
    if let index = currentIndex(rows, nowMs: nowMs) {
      nextPrayer["currentPrayerId"] = str(rows[index]["id"])
      nextPrayer["currentPrayerAtMs"] = ms(rows[index]["atMs"])
    } else {
      nextPrayer["currentPrayerId"] = ""
      nextPrayer["currentPrayerAtMs"] = 0.0
    }
    nextPrayer["minutesUntil"] = minutes
    nextPrayer["lockScreenDetail"] = countdown
    nextPrayer["countdownLabel"] = countdown
    if passed {
      let name = str(nextRow["name"])
      let time = str(nextRow["time"])
      nextPrayer["prayerId"] = str(nextRow["id"])
      nextPrayer["prayerName"] = name
      nextPrayer["prayerTime"] = time
      nextPrayer["targetTimeMs"] = ms(nextRow["atMs"])
      nextPrayer["lockScreenLine"] = "\(name) · \(time)"
      nextPrayer["accessibilityLabel"] = "\(name), \(time), \(countdown)"
      nextPrayer["followingName"] = str(followingRow?["name"])
      nextPrayer["followingTime"] = str(followingRow?["time"])
      if rolled, let summary = ((root["hijriDate"] as? JSON)?["summary"]) as? String {
        nextPrayer["displayDate"] = summary
      }
    } else {
      let name = str(nextPrayer["prayerName"])
      nextPrayer["accessibilityLabel"] = "\(name), \(str(nextPrayer["prayerTime"])), \(countdown)"
    }
    root["nextPrayer"] = nextPrayer
    return root
  }

  // MARK: Timeline

  /// Entry dates for the next ~24 h: each Adhan, 15 and 5 minutes before the next
  /// one, adhkar window edges and local midnight. Entries are cheap; reloads are
  /// what the WidgetKit budget counts, and this needs only about one a day.
  static func timelineDates(_ json: JSON?, now: Date = Date()) -> [Date] {
    let horizon = now.addingTimeInterval(24 * 3600)
    var dates: [Date] = [now]
    let schedule = json?["schedule"] as? JSON
    let rowInstants = ((schedule?["rows"] as? [JSON] ?? []) + (schedule?["tomorrowRows"] as? [JSON] ?? []))
      .map { ms($0["atMs"]) }
      .filter { $0 > 0 }
      .map { Date(timeIntervalSince1970: $0 / 1000) }
      .filter { $0 > now }
      .sorted()
    dates.append(contentsOf: rowInstants)
    if let next = rowInstants.first {
      for offset in [15.0, 5.0] {
        let point = next.addingTimeInterval(-offset * 60)
        if point > now { dates.append(point) }
      }
    }
    let sets = (json?["adhkar"] as? JSON)?["sets"] as? [JSON] ?? []
    for set in sets {
      for key in ["startMs", "endMs"] {
        let value = ms(set[key])
        if value > 0 { dates.append(Date(timeIntervalSince1970: value / 1000)) }
      }
    }
    if let midnight = Calendar.current.nextDate(
      after: now, matching: DateComponents(hour: 0, minute: 0, second: 30), matchingPolicy: .nextTime
    ) {
      dates.append(midnight)
    }
    if rowInstants.isEmpty { dates.append(now.addingTimeInterval(15 * 60)) }
    // Ascending, within the horizon, at least a minute apart.
    var out: [Date] = []
    for date in dates.filter({ $0 >= now && $0 <= horizon }).sorted() {
      if let last = out.last, date.timeIntervalSince(last) < 60 { continue }
      out.append(date)
    }
    return out
  }

  /// Fill `{{prayer}}` / `{{time}}` in a Siri answer template.
  static func fill(_ template: String, prayer: String, time: String) -> String {
    template
      .replacingOccurrences(of: "{{prayer}}", with: prayer)
      .replacingOccurrences(of: "{{time}}", with: time)
  }
}
#endif
