import SwiftUI
import WatchConnectivity
import WidgetKit

@main
struct MunibTrackerWatchApp: App {
  @StateObject private var model = WatchPrayerModel()

  var body: some Scene {
    WindowGroup {
      WatchContentView()
        .environmentObject(model)
    }
  }
}

final class WatchPrayerModel: ObservableObject {
  @Published var snapshot: WidgetSnapshotPayload?
  @Published var markStatus: String?

  private let session: WCSession? = WCSession.isSupported() ? WCSession.default : nil

  init() {
    WatchSessionDelegate.shared.onSnapshotApplied = { [weak self] in
      DispatchQueue.main.async { self?.reload() }
    }
    session?.delegate = WatchSessionDelegate.shared
    session?.activate()
    reload()
  }

  func reload() {
    snapshot = WidgetSnapshotStore.load()
  }

  func markCurrent() {
    markStatus = nil
    let payload: [String: Any] = ["command": "mark-current"]
    sendToPhone(payload)
    let cmd: [String: Any] = ["type": "mark-current-obligatory", "source": "watch"]
    if let data = try? JSONSerialization.data(withJSONObject: cmd),
       let json = String(data: data, encoding: .utf8) {
      ExternalCommandQueue.appendCommandJson(json)
    }
    markStatus = snapshot?.strings?.done ?? "Done"
    DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
      self.reload()
      self.markStatus = nil
    }
  }

  func markPrayer(id: String) {
    markStatus = nil
    let date = ExternalCommandQueue.localDateString()
    let payload: [String: Any] = [
      "command": "mark-prayer",
      "prayerId": id,
      "date": date,
    ]
    sendToPhone(payload)
    let cmd: [String: Any] = [
      "type": "mark-prayer",
      "prayerId": id,
      "date": date,
      "source": "watch",
    ]
    if let data = try? JSONSerialization.data(withJSONObject: cmd),
       let json = String(data: data, encoding: .utf8) {
      ExternalCommandQueue.appendCommandJson(json)
    }
    markStatus = snapshot?.strings?.done ?? "Done"
    DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
      self.reload()
      self.markStatus = nil
    }
  }

  private func sendToPhone(_ message: [String: Any]) {
    guard let session, session.isReachable else { return }
    session.sendMessage(message, replyHandler: nil, errorHandler: nil)
  }
}

final class WatchSessionDelegate: NSObject, WCSessionDelegate {
  static let shared = WatchSessionDelegate()
  var onSnapshotApplied: (() -> Void)?

  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
    if let json = session.receivedApplicationContext[WatchSnapshotSync.contextKey] as? String {
      WatchSnapshotSync.applyLocally(json)
      onSnapshotApplied?()
    }
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

struct WatchContentView: View {
  @EnvironmentObject private var model: WatchPrayerModel

  var body: some View {
    NavigationStack {
      List {
        Section {
          NavigationLink {
            WatchTasbeehView(snapshot: model.snapshot)
          } label: {
            Label(model.snapshot?.strings?.tasbeeh ?? "Tasbeeh", systemImage: "circle.grid.2x2")
          }
        }
        if model.snapshot == nil {
          Section {
            Text(model.snapshot?.strings?.openAppToSync ?? "Open Munib on iPhone to sync Salah times.")
              .foregroundStyle(.secondary)
          }
        } else if model.snapshot?.locationDenied == true {
          Section {
            Text(model.snapshot?.strings?.setLocationHint ?? "Set location on iPhone")
              .foregroundStyle(.secondary)
          }
        } else if let next = model.snapshot?.nextPrayer {
          Section(next.title ?? "Next Salah") {
            Text(next.prayerName ?? "")
              .font(.headline)
            Text(next.prayerTime ?? "")
            if let detail = next.lockScreenDetail {
              Text(detail).font(.caption).foregroundStyle(.secondary)
            }
            Button(model.snapshot?.strings?.markSalah ?? next.markLabel ?? "Mark Salah") {
              model.markCurrent()
            }
          }
        }
        if let rows = model.snapshot?.schedule?.rows, !rows.isEmpty {
          Section(model.snapshot?.schedule?.title ?? "Today") {
            ForEach(rows, id: \.id) { row in
              Button {
                model.markPrayer(id: row.id)
              } label: {
                HStack {
                  Text(row.name)
                  Spacer()
                  Text(row.time).foregroundStyle(.secondary)
                  if row.status == "completed" {
                    Image(systemName: "checkmark.circle.fill").foregroundStyle(.green)
                  } else if row.status == "active" {
                    Image(systemName: "circle.fill")
                      .font(.caption2)
                      .foregroundStyle(.tint)
                  }
                }
              }
            }
          }
        }
        if let status = model.markStatus {
          Text(status).font(.caption2).foregroundStyle(.secondary)
        }
      }
      .navigationTitle("Munib")
      .onAppear { model.reload() }
      .environment(\.locale, Locale(identifier: model.snapshot?.locale ?? "en"))
      .environment(
        \.layoutDirection,
        model.snapshot?.isRtl == true ? .rightToLeft : .leftToRight
      )
    }
  }
}
