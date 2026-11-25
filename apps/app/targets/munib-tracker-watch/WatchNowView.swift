import SwiftUI

/// First page: the next Salah with a live countdown, today's ring, and one-tap
/// marking of the Salah whose time is running.
struct WatchNowView: View {
  @EnvironmentObject private var model: WatchPrayerModel

  var body: some View {
    // Re-resolve each minute so the page moves on at every Adhan without a phone push.
    TimelineView(.everyMinute) { context in
      ScrollView {
        content(now: context.date)
          .padding(.horizontal, 2)
      }
    }
    .navigationTitle("Munib")
    .containerBackground(model.accent.opacity(0.35).gradient, for: .tabView)
  }

  @ViewBuilder
  private func content(now: Date) -> some View {
    if model.snapshot == nil {
      WatchHint(message: model.text(\.openAppToSync, "Open Munib on iPhone to sync Salah times."))
    } else if model.snapshot?.locationDenied == true {
      WatchHint(message: model.text(\.setLocationHint, "Set location on iPhone"))
    } else {
      hero(now: now)
    }
  }

  @ViewBuilder
  private func hero(now: Date) -> some View {
    let snapshot = model.snapshot
    let stale = WatchSalahResolver.isStale(snapshot, now: now)
    let marks = model.localMarkIds
    let next = WatchSalahResolver.next(snapshot, now: now)
    let progress = WatchSalahResolver.progress(snapshot, now: now, localMarks: marks)
    let allDone = WatchSalahResolver.allDone(snapshot, now: now, localMarks: marks)
    let markable = WatchSalahResolver.markableCurrent(snapshot, now: now, localMarks: marks)

    VStack(spacing: 8) {
      if !stale, let hijri = snapshot?.hijriDate?.hijriDate, !hijri.isEmpty, hijri != "—" {
        Text(hijri)
          .font(.caption2)
          .foregroundStyle(.secondary)
          .lineLimit(1)
          .minimumScaleFactor(0.7)
      }

      WatchProgressRing(completed: progress.completed, total: progress.total) {
        VStack(spacing: 1) {
          if allDone {
            Image(systemName: "checkmark")
              .font(.title3.weight(.bold))
              .foregroundStyle(.tint)
          }
          if let next {
            Text(next.name)
              .font(.headline)
              .lineLimit(1)
              .minimumScaleFactor(0.6)
            if !next.time.isEmpty {
              Text(next.time)
                .font(.caption2)
                .foregroundStyle(.secondary)
                .lineLimit(1)
            }
            if let at = next.at, at > now {
              Text(at, style: .timer)
                .font(.caption.monospacedDigit().weight(.semibold))
                .foregroundStyle(.tint)
                .lineLimit(1)
                .minimumScaleFactor(0.6)
            }
          } else if !allDone {
            Text("\(progress.completed)/\(progress.total)")
              .font(.title3.weight(.semibold))
          }
        }
        .padding(.horizontal, 10)
      }
      .accessibilityElement(children: .combine)
      .accessibilityLabel(accessibilityLabel(next: next, progress: progress))

      if allDone {
        Text(model.text(\.allDone, "All Salah done today"))
          .font(.footnote)
          .multilineTextAlignment(.center)
      }

      if let markable {
        Button {
          model.mark(markable)
        } label: {
          VStack(spacing: 0) {
            Text(model.text(\.markSalah, snapshot?.nextPrayer?.markLabel ?? "Mark Salah"))
              .font(.body.weight(.semibold))
            Text(markable.name)
              .font(.caption2)
              .opacity(0.85)
          }
          .frame(maxWidth: .infinity)
        }
        .buttonStyle(.borderedProminent)
      }

      if let feedback = model.feedback {
        Text(feedback)
          .font(.caption2)
          .foregroundStyle(.secondary)
          .multilineTextAlignment(.center)
          .transition(.opacity)
      }

      if stale {
        WatchHint(message: model.text(\.staleData, "Open the app to refresh today's times"))
      } else if let ago = freshness(now: now) {
        Text(ago)
          .font(.caption2)
          .foregroundStyle(.secondary)
      }
    }
    .animation(.easeOut(duration: 0.2), value: model.feedback)
  }

  /// Only worth showing once the snapshot is over an hour old.
  private func freshness(now: Date) -> String? {
    guard let iso = model.snapshot?.updatedAt,
          let updated = WatchSalahResolver.parseISO(iso),
          updated.timeIntervalSince1970 > 86_400,
          now.timeIntervalSince(updated) > 3_600 else { return nil }
    return WidgetReloadSchedule.updatedAgoLabel(from: model.snapshot, now: now)
  }

  private func accessibilityLabel(
    next: WatchNextSalah?,
    progress: (completed: Int, total: Int)
  ) -> String {
    var parts: [String] = []
    if let next {
      parts.append(model.snapshot?.nextPrayer?.title ?? "Next Salah")
      parts.append(next.name)
      if !next.time.isEmpty { parts.append(next.time) }
    }
    parts.append("\(progress.completed)/\(progress.total)")
    return parts.joined(separator: ", ")
  }
}

/// Closed ring of today's obligatory Salah with arbitrary centre content.
struct WatchProgressRing<Center: View>: View {
  let completed: Int
  let total: Int
  @ViewBuilder let center: () -> Center

  private var fraction: Double {
    guard total > 0 else { return 0 }
    return min(max(Double(completed) / Double(total), 0), 1)
  }

  var body: some View {
    ZStack {
      Circle()
        .stroke(Color.secondary.opacity(0.25), lineWidth: 7)
      Circle()
        .trim(from: 0, to: fraction)
        .stroke(.tint, style: StrokeStyle(lineWidth: 7, lineCap: .round))
        .rotationEffect(.degrees(-90))
        .animation(.easeOut(duration: 0.3), value: fraction)
      center()
    }
    .frame(width: 124, height: 124)
  }
}
