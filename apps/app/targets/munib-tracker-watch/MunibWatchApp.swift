import SwiftUI
import WatchConnectivity

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
    markStatus = "Sent"
    DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { self.reload() }
  }

  func markPrayer(id: String) {
    markStatus = nil
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withFullDate]
    let date = formatter.string(from: Date()).prefix(10)
    let payload: [String: Any] = [
      "command": "mark-prayer",
      "prayerId": id,
      "date": String(date),
    ]
    sendToPhone(payload)
    let cmd: [String: Any] = [
      "type": "mark-prayer",
      "prayerId": id,
      "date": String(date),
      "source": "watch",
    ]
    if let data = try? JSONSerialization.data(withJSONObject: cmd),
       let json = String(data: data, encoding: .utf8) {
      ExternalCommandQueue.appendCommandJson(json)
    }
    markStatus = "Sent"
    DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { self.reload() }
  }

  private func sendToPhone(_ message: [String: Any]) {
    guard let session, session.isReachable else { return }
    session.sendMessage(message, replyHandler: nil, errorHandler: nil)
  }
}

final class WatchSessionDelegate: NSObject, WCSessionDelegate {
  static let shared = WatchSessionDelegate()
  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {}
}

struct WatchContentView: View {
  @EnvironmentObject private var model: WatchPrayerModel

  var body: some View {
    NavigationStack {
      List {
        if model.snapshot?.locationDenied == true {
          Text("Set location on iPhone")
            .foregroundStyle(.secondary)
        } else if let next = model.snapshot?.nextPrayer {
          Section(next.title ?? "Next Salah") {
            Text(next.prayerName ?? "")
              .font(.headline)
            Text(next.prayerTime ?? "")
            if let detail = next.lockScreenDetail {
              Text(detail).font(.caption).foregroundStyle(.secondary)
            }
            Button("Mark current") { model.markCurrent() }
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
    }
  }
}
