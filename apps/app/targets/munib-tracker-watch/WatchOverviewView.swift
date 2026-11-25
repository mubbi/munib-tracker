import SwiftUI

/// Last page: streak, Qaza, and the seasonal / plan cards that apply today.
struct WatchOverviewView: View {
  @EnvironmentObject private var model: WatchPrayerModel

  var body: some View {
    List {
      if let snapshot = model.snapshot {
        let stale = WatchSalahResolver.isStale(snapshot)

        if !stale, let hijri = snapshot.hijriDate, let date = hijri.hijriDate, !date.isEmpty, date != "—" {
          WatchOverviewRow(
            icon: "moon.stars.fill",
            title: hijri.title ?? "Islamic date",
            value: date,
            detail: [hijri.weekday, hijri.gregorianDate]
              .compactMap { $0 }
              .filter { !$0.isEmpty }
              .joined(separator: " · ")
          )
        }

        if let streak = snapshot.streak {
          WatchOverviewRow(
            icon: "flame.fill",
            title: streak.title ?? "Salah streak",
            value: streak.summary ?? streak.streakLabel ?? "\(streak.streakDays ?? 0)",
            detail: nil
          )
        }

        if let qaza = snapshot.qaza {
          WatchOverviewRow(
            icon: "clock.arrow.circlepath",
            title: qaza.title ?? "Qaza",
            value: qaza.remainingLabel ?? "\(qaza.remaining ?? 0)",
            detail: qaza.todayLabel
          )
        }

        if snapshot.locationDenied != true, let ramadan = snapshot.ramadan, ramadan.isRamadan == true {
          WatchOverviewRow(
            icon: "sunset.fill",
            title: ramadan.title ?? "Ramadan",
            value: "\(ramadan.suhoorLabel ?? "Suhoor ends") \(ramadan.suhoorTime ?? "—")",
            detail: "\(ramadan.iftarLabel ?? "Iftar") \(ramadan.iftarTime ?? "—")"
          )
        }

        if let friday = snapshot.friday, friday.isFriday == true, !stale {
          WatchOverviewRow(
            icon: "building.columns.fill",
            title: friday.title ?? "Jumu'ah",
            value: friday.lockScreenDetail ?? "\(friday.completed ?? 0)/\(friday.total ?? 0)",
            detail: nil
          )
        }

        if let khatm = snapshot.khatm, khatm.hasPlan == true {
          WatchOverviewRow(
            icon: "book.fill",
            title: khatm.title ?? "Khatm plan",
            value: khatm.todayLabel ?? khatm.progressLabel ?? "",
            detail: [khatm.progressLabel, khatm.paceLabel]
              .compactMap { $0 }
              .filter { !$0.isEmpty }
              .joined(separator: " · ")
          )
        }

        if snapshot.locationDenied != true, let qibla = snapshot.qibla,
           let bearing = qibla.bearingLabel, bearing != "—" {
          WatchOverviewRow(
            icon: "location.north.line.fill",
            title: qibla.title ?? "Qibla",
            value: bearing,
            detail: qibla.lockScreenDetail
          )
        }
      } else {
        WatchHint(message: model.text(\.openAppToSync, "Open Munib on iPhone to sync Salah times."))
          .listRowBackground(Color.clear)
      }
    }
    .navigationTitle(model.text(\.overview, "Overview"))
  }
}

struct WatchOverviewRow: View {
  let icon: String
  let title: String
  let value: String
  let detail: String?

  var body: some View {
    HStack(alignment: .top, spacing: 8) {
      Image(systemName: icon)
        .foregroundStyle(.tint)
        .frame(width: 18)
      VStack(alignment: .leading, spacing: 1) {
        Text(title)
          .font(.caption2)
          .foregroundStyle(.secondary)
          .lineLimit(1)
        Text(value)
          .font(.body.weight(.semibold))
          .lineLimit(2)
          .minimumScaleFactor(0.7)
        if let detail, !detail.isEmpty {
          Text(detail)
            .font(.caption2)
            .foregroundStyle(.secondary)
            .lineLimit(2)
        }
      }
    }
    .accessibilityElement(children: .combine)
  }
}
