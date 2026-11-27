import SwiftUI
import WatchConnectivity
import WatchKit
import WidgetKit

@main
struct MunibTrackerWatchApp: App {
  @StateObject private var model = WatchPrayerModel()

  init() {
    // Activate before any UI exists: a background launch for a phone push (application
    // context / complication transfer) then still lands in the App Group and reloads
    // the complications. The model re-attaches the same delegate when the UI builds.
    if WCSession.isSupported() {
      WCSession.default.delegate = WatchSessionDelegate.shared
      WCSession.default.activate()
    }
  }

  var body: some Scene {
    WindowGroup {
      WatchRootView()
        .environmentObject(model)
    }
  }
}

/// Vertical pages of the companion app (watchOS 10 `verticalPage` TabView).
enum WatchPage: Hashable {
  case now
  case today
  case tasbeeh
  case overview
}

/// Pushed screens on top of the pages.
enum WatchRoute: Hashable {
  case tasbeeh
}

final class WatchPrayerModel: ObservableObject {
  @Published private(set) var snapshot: WidgetSnapshotPayload?
  /// Salah marked on the watch that the phone hasn't echoed back yet (id → epoch s).
  @Published private(set) var localMarks: [String: Double] = [:]
  @Published var feedback: String?
  /// The Salah marked in the last few seconds, still revertible with Undo.
  @Published private(set) var undoable: WatchSalahRow?
  @Published var page: WatchPage = .now
  @Published var path: [WatchRoute] = []

  private let session: WCSession? = WCSession.isSupported() ? WCSession.default : nil
  /// Marks made before the session finished activating (sent once it has).
  private var outbox: [[String: Any]] = []
  private var marksDay = ""
  private var feedbackClear: DispatchWorkItem?
  private var pendingMark: (id: String, message: [String: Any])?
  private var commitWork: DispatchWorkItem?
  private static let undoWindowSeconds: Double = 4

  private static let marksKey = "munib.watch.localMarks.v1"
  /// A snapshot written this long after a watch mark that still shows the Salah
  /// pending means the phone declined it (excused, locked…): drop the optimistic tick.
  private static let echoGraceSeconds: Double = 120

  init() {
    restoreMarks()
    WatchSessionDelegate.shared.onSnapshotApplied = { [weak self] in
      DispatchQueue.main.async { self?.reload() }
    }
    WatchSessionDelegate.shared.onActivated = { [weak self] in
      DispatchQueue.main.async { self?.flushOutbox() }
    }
    session?.delegate = WatchSessionDelegate.shared
    session?.activate()
    reload()
  }

  var localMarkIds: Set<String> { Set(localMarks.keys) }

  /// Snapshot accent (the app's theme colour); the generated brand accent before the first snapshot.
  var accent: Color {
    WidgetPalette.color(snapshot?.theme?.primary, fallback: MunibTokens.darkAccent)
  }

  /// Snapshot label with an English fallback (the watch has no catalogs of its own).
  func text(_ key: KeyPath<WidgetSnapshotPayload.SurfaceStrings, String?>, _ fallback: String) -> String {
    guard let value = snapshot?.strings?[keyPath: key], !value.isEmpty else { return fallback }
    return value
  }

  func reload() {
    snapshot = WidgetSnapshotStore.load()
    pruneMarks()
  }

  /// Marks one Salah. The tick and haptic are immediate, but the phone command is held for
  /// `undoWindowSeconds` so Undo reverts cleanly on watch and phone (nothing was sent).
  /// Sent as an explicit `mark-prayer` with the snapshot's day: a queued `transferUserInfo`
  /// can be delivered much later, when a "mark current" would resolve to a different Salah
  /// (and the phone drops a `mark-prayer` whose date is no longer today).
  /// Callers only offer rows the resolver reports as `.due`; this guards again anyway.
  func mark(_ row: WatchSalahRow) {
    guard row.state == .due, localMarks[row.id] == nil else { return }
    commitPendingMark()  // a second mark inside the window sends the first one now
    let message: [String: Any] = [
      "command": "mark-prayer",
      "prayerId": row.id,
      "date": WatchSalahResolver.markDate(snapshot),
    ]
    marksDay = WatchSalahResolver.markDate(snapshot)
    localMarks[row.id] = Date().timeIntervalSince1970
    persistMarks()
    WKInterfaceDevice.current().play(.success)
    pendingMark = (row.id, message)
    undoable = row
    let work = DispatchWorkItem { [weak self] in self?.commitPendingMark() }
    commitWork = work
    DispatchQueue.main.asyncAfter(deadline: .now() + Self.undoWindowSeconds, execute: work)
  }

  /// Reverts the last mark if it hasn't been sent yet.
  func undoMark() {
    guard let pending = pendingMark else { return }
    commitWork?.cancel()
    commitWork = nil
    pendingMark = nil
    undoable = nil
    localMarks[pending.id] = nil
    persistMarks()
    WKInterfaceDevice.current().play(.click)
  }

  /// Sends the held mark (window elapsed, another mark, or the app leaving the foreground).
  func commitPendingMark() {
    commitWork?.cancel()
    commitWork = nil
    guard let pending = pendingMark else { return }
    pendingMark = nil
    undoable = nil
    let live = sendToPhone(pending.message)
    showFeedback(
      live
        ? text(\.sentToPhone, "Sent to your phone")
        : text(\.willSync, "Will sync when your phone is nearby")
    )
  }

  /// Complication / notification deep links pick the matching page.
  func route(to url: URL) {
    let target = ((url.host ?? "") + url.path).lowercased()
    if target.hasPrefix("tasbeeh") {
      page = .tasbeeh
      path = [.tasbeeh]
    } else if target.hasPrefix("tracker") {
      path = []
      page = .today
    } else if ["statistics", "qaza", "ramadan", "calendar", "qibla", "friday", "quran"]
      .contains(where: { target.hasPrefix($0) }) {
      path = []
      page = .overview
    } else {
      path = []
      page = .now
    }
  }

  // MARK: - Phone link

  /// Returns true when the phone got the mark live; false when it was queued.
  private func sendToPhone(_ message: [String: Any]) -> Bool {
    guard let session else { return false }
    guard session.activationState == .activated else {
      outbox.append(message)
      session.activate()
      return false
    }
    if session.isReachable {
      session.sendMessage(message, replyHandler: nil) { _ in
        session.transferUserInfo(message)
      }
      return true
    }
    session.transferUserInfo(message)
    return false
  }

  private func flushOutbox() {
    guard let session, session.activationState == .activated, !outbox.isEmpty else { return }
    let pending = outbox
    outbox.removeAll()
    for message in pending { session.transferUserInfo(message) }
  }

  // MARK: - Optimistic marks

  private func pruneMarks() {
    let day = WatchSalahResolver.markDate(snapshot)
    if !marksDay.isEmpty, marksDay != day {
      localMarks.removeAll()
    }
    marksDay = day
    let rows = snapshot?.schedule?.rows ?? []
    var updated: Double?
    if let iso = snapshot?.updatedAt, let date = WatchSalahResolver.parseISO(iso) {
      updated = date.timeIntervalSince1970
    }
    localMarks = localMarks.filter { id, markedAt in
      if rows.contains(where: { $0.id == id && $0.status == "completed" }) { return false }
      if let updated, updated > markedAt + Self.echoGraceSeconds { return false }
      return true
    }
    persistMarks()
  }

  private func restoreMarks() {
    guard let stored = UserDefaults.standard.dictionary(forKey: Self.marksKey),
          let day = stored["day"] as? String,
          let marks = stored["marks"] as? [String: Double] else { return }
    marksDay = day
    localMarks = marks
  }

  private func persistMarks() {
    let stored: [String: Any] = ["day": marksDay, "marks": localMarks]
    UserDefaults.standard.set(stored, forKey: Self.marksKey)
  }

  private func showFeedback(_ message: String) {
    feedbackClear?.cancel()
    feedback = message
    let work = DispatchWorkItem { [weak self] in self?.feedback = nil }
    feedbackClear = work
    DispatchQueue.main.asyncAfter(deadline: .now() + 2.5, execute: work)
  }
}

final class WatchSessionDelegate: NSObject, WCSessionDelegate {
  static let shared = WatchSessionDelegate()
  var onSnapshotApplied: (() -> Void)?
  var onActivated: (() -> Void)?

  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
    if let json = session.receivedApplicationContext[WatchSnapshotSync.contextKey] as? String {
      WatchSnapshotSync.applyLocally(json)
      onSnapshotApplied?()
    }
    if activationState == .activated { onActivated?() }
  }

  func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String: Any]) {
    guard let json = applicationContext[WatchSnapshotSync.contextKey] as? String else { return }
    WatchSnapshotSync.applyLocally(json)
    onSnapshotApplied?()
  }

  func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any] = [:]) {
    guard let json = userInfo[WatchSnapshotSync.contextKey] as? String else { return }
    WatchSnapshotSync.applyLocally(json)
    onSnapshotApplied?()
  }
}

struct WatchRootView: View {
  @EnvironmentObject private var model: WatchPrayerModel
  @Environment(\.scenePhase) private var scenePhase

  var body: some View {
    NavigationStack(path: $model.path) {
      TabView(selection: $model.page) {
        WatchNowView()
          .tag(WatchPage.now)
        WatchTodayView()
          .tag(WatchPage.today)
        WatchTasbeehCard()
          .tag(WatchPage.tasbeeh)
        WatchOverviewView()
          .tag(WatchPage.overview)
      }
      .tabViewStyle(.verticalPage)
      .navigationDestination(for: WatchRoute.self) { route in
        switch route {
        case .tasbeeh:
          WatchTasbeehView(snapshot: model.snapshot)
        }
      }
    }
    .tint(model.accent)
    .onOpenURL { model.route(to: $0) }
    .onChange(of: scenePhase) { _, phase in
      if phase == .active { model.reload() } else { model.commitPendingMark() }
    }
    .environment(\.locale, Locale(identifier: model.snapshot?.locale ?? "en"))
    .environment(
      \.layoutDirection,
      model.snapshot?.isRtl == true ? .rightToLeft : .leftToRight
    )
  }
}

/// Muted one-liner for empty / stale / denied states.
struct WatchHint: View {
  let message: String

  var body: some View {
    Text(message)
      .font(.footnote)
      .foregroundStyle(.secondary)
      .multilineTextAlignment(.center)
      .frame(maxWidth: .infinity)
  }
}

/// Shown for a few seconds after a mark: the Salah and a one-tap Undo (nothing has been
/// sent to the phone yet, so Undo reverts watch and phone together).
struct WatchUndoBar: View {
  @EnvironmentObject private var model: WatchPrayerModel

  var body: some View {
    if let row = model.undoable {
      HStack(spacing: 6) {
        Label(row.name, systemImage: "checkmark.circle.fill")
          .font(.caption2)
          .foregroundStyle(.secondary)
          .lineLimit(1)
        Spacer(minLength: 4)
        Button(model.text(\.undo, "Undo")) { model.undoMark() }
          .font(.caption2.weight(.semibold))
          .buttonStyle(.bordered)
      }
      .sensoryFeedback(.success, trigger: row.id)
    }
  }
}
