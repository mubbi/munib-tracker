import SwiftUI

/// Second page: today's five obligatory Salah. Only a Salah whose time has begun
/// and isn't logged can be marked, and the watch asks first.
struct WatchTodayView: View {
  @EnvironmentObject private var model: WatchPrayerModel
  @State private var pending: WatchSalahRow?

  var body: some View {
    TimelineView(.everyMinute) { context in
      list(now: context.date)
    }
    .navigationTitle(model.text(\.today, model.snapshot?.schedule?.title ?? "Today"))
    .confirmationDialog(
      model.text(\.markConfirm, "Mark as prayed?"),
      isPresented: Binding(
        get: { pending != nil },
        set: { if !$0 { pending = nil } }
      ),
      titleVisibility: .visible,
      presenting: pending
    ) { row in
      Button(model.text(\.markSalah, "Mark Salah")) {
        model.mark(row)
        pending = nil
      }
      Button(model.text(\.cancel, "Cancel"), role: .cancel) {
        pending = nil
      }
    } message: { row in
      Text("\(row.name) · \(row.time)")
    }
  }

  @ViewBuilder
  private func list(now: Date) -> some View {
    let rows = WatchSalahResolver.rows(model.snapshot, now: now, localMarks: model.localMarkIds)
    let stale = WatchSalahResolver.isStale(model.snapshot, now: now)

    List {
      if rows.isEmpty {
        WatchHint(message: emptyMessage)
          .listRowBackground(Color.clear)
      } else {
        if stale {
          WatchHint(message: model.text(\.staleData, "Open the app to refresh today's times"))
            .listRowBackground(Color.clear)
        }
        ForEach(rows) { row in
          Button {
            pending = row
          } label: {
            WatchSalahRowLabel(row: row, now: now)
          }
          .disabled(row.state != .due)
          .accessibilityLabel(accessibility(for: row))
          .accessibilityHint(row.state == .due ? model.text(\.markSalah, "Mark Salah") : "")
        }
        if let feedback = model.feedback {
          Text(feedback)
            .font(.caption2)
            .foregroundStyle(.secondary)
            .listRowBackground(Color.clear)
        }
      }
    }
  }

  private var emptyMessage: String {
    if model.snapshot?.locationDenied == true {
      return model.text(\.setLocationHint, "Set location on iPhone")
    }
    return model.text(\.openAppToSync, "Open Munib on iPhone to sync Salah times.")
  }

  /// Status in words, not colour only (phone label while it still applies).
  private func accessibility(for row: WatchSalahRow) -> String {
    let status: String
    if let label = row.statusLabel, !label.isEmpty {
      status = label
    } else {
      switch row.state {
      case .completed: status = model.text(\.done, "Done")
      case .due: status = model.text(\.markSalah, "Mark Salah")
      case .next: status = model.snapshot?.nextPrayer?.title ?? "Next Salah"
      case .upcoming: status = model.text(\.notYet, "Not time yet")
      }
    }
    return "\(row.name), \(row.time), \(status)"
  }
}

struct WatchSalahRowLabel: View {
  let row: WatchSalahRow
  let now: Date

  var body: some View {
    HStack(spacing: 6) {
      icon
        .frame(width: 16)
      VStack(alignment: .leading, spacing: 0) {
        Text(row.name)
          .font(.body.weight(row.state == .due || row.state == .next ? .semibold : .regular))
          .lineLimit(1)
        if row.state == .next, let at = row.at, at > now {
          Text(at, style: .relative)
            .font(.caption2)
            .foregroundStyle(.tint)
            .lineLimit(1)
        }
      }
      Spacer(minLength: 4)
      Text(row.time)
        .font(.footnote.monospacedDigit())
        .foregroundStyle(.secondary)
        .lineLimit(1)
    }
    .opacity(row.state == .upcoming ? 0.6 : 1)
  }

  @ViewBuilder
  private var icon: some View {
    switch row.state {
    case .completed:
      Image(systemName: "checkmark.circle.fill")
        .foregroundStyle(.green)
    case .due:
      Image(systemName: "circle")
        .foregroundStyle(.tint)
    case .next:
      Image(systemName: "circle.fill")
        .font(.caption2)
        .foregroundStyle(.tint)
    case .upcoming:
      Image(systemName: "circle.dotted")
        .foregroundStyle(.secondary)
    }
  }
}
