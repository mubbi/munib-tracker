import SwiftUI
import WatchKit

/// Watch-local Tasbeeh counter — no ExternalCommand / phone sync, mirrors the
/// phone's 33 / 99 / 100 / unlimited modes with tap-to-count + Digital Crown.
/// Like the phone, changing the target keeps the count and Reset asks first.
private let watchTasbeehModes: [(label: String, target: Int)] = [
  ("33", 33),
  ("99", 99),
  ("100", 100),
  ("∞", 0),
]

struct WatchTasbeehView: View {
  let snapshot: WidgetSnapshotPayload?
  @State private var target: Int = 33
  @State private var crownCount: Double = 0
  @State private var confirmingReset = false

  init(snapshot: WidgetSnapshotPayload? = nil) {
    self.snapshot = snapshot
  }

  private var count: Int { Int(crownCount.rounded()) }
  private var atLimit: Bool { target > 0 && count >= target }
  private var remaining: Int { target > 0 ? max(target - count, 0) : 0 }
  private var crownThrough: Double { target > 0 ? Double(target) : 9_999 }

  var body: some View {
    ScrollView {
      VStack(spacing: 10) {
        HStack(spacing: 4) {
          ForEach(watchTasbeehModes, id: \.target) { mode in
            Button {
              selectTarget(mode.target)
            } label: {
              Text(mode.label)
                .font(.caption2.weight(target == mode.target ? .semibold : .regular))
                .frame(maxWidth: .infinity)
            }
            .buttonStyle(.bordered)
            .tint(target == mode.target ? Color.accentColor : .secondary)
          }
        }

        counterDial
          .focusable()
          .digitalCrownRotation(
            $crownCount,
            from: 0,
            through: crownThrough,
            by: 1,
            sensitivity: .medium,
            isContinuous: false,
            isHapticFeedbackEnabled: true
          )
          .onChange(of: crownCount) { oldValue, newValue in
            handleCrownChange(oldValue: oldValue, newValue: newValue)
          }

        Text(remainingLabel)
          .font(.caption2)
          .foregroundStyle(.secondary)

        // Same as the phone: reset asks first, so a stray tap never wipes a count.
        Button(role: .destructive) {
          confirmingReset = true
        } label: {
          Label(resetLabel, systemImage: "arrow.counterclockwise")
        }
        .font(.caption2)
        .disabled(count == 0)
        .confirmationDialog(resetLabel, isPresented: $confirmingReset, titleVisibility: .hidden) {
          Button(resetLabel, role: .destructive) { reset() }
        }
      }
      .padding(.horizontal, 4)
    }
    .navigationTitle(snapshot?.strings?.tasbeeh ?? "Tasbeeh")
    .environment(\.locale, Locale(identifier: snapshot?.locale ?? "en"))
    .environment(\.layoutDirection, snapshot?.isRtl == true ? .rightToLeft : .leftToRight)
  }

  private var resetLabel: String { snapshot?.strings?.reset ?? "Reset" }

  private var remainingLabel: String {
    guard target > 0 else {
      return snapshot?.strings?.tasbeehUnlimited ?? "Unlimited"
    }
    return "\(snapshot?.strings?.remaining ?? "Remaining"): \(remaining)"
  }

  private var counterDial: some View {
    ZStack {
      Circle()
        .stroke(Color.secondary.opacity(0.25), lineWidth: 8)
      if target > 0 {
        Circle()
          .trim(from: 0, to: CGFloat(min(Double(count) / Double(target), 1)))
          .stroke(
            atLimit ? Color.green : Color.accentColor,
            style: StrokeStyle(lineWidth: 8, lineCap: .round)
          )
          .rotationEffect(.degrees(-90))
          .animation(.easeOut(duration: 0.2), value: count)
      }
      VStack(spacing: 0) {
        Text("\(count)")
          .font(.system(size: 34, weight: .bold, design: .rounded))
          .minimumScaleFactor(0.6)
          .lineLimit(1)
        if target > 0 {
          Text("/ \(target)")
            .font(.caption2)
            .foregroundStyle(.secondary)
        }
      }
    }
    .frame(width: 130, height: 130)
    .contentShape(Circle())
    .onTapGesture { increment() }
  }

  private func increment() {
    guard !atLimit else {
      WKInterfaceDevice.current().play(.click)
      return
    }
    crownCount = min(crownCount + 1, crownThrough)
    WKInterfaceDevice.current().play(.click)
    if target > 0, count >= target {
      WKInterfaceDevice.current().play(.success)
    }
  }

  private func handleCrownChange(oldValue: Double, newValue: Double) {
    guard target > 0 else { return }
    if Int(oldValue.rounded()) < target, Int(newValue.rounded()) >= target {
      WKInterfaceDevice.current().play(.success)
    }
  }

  /// Switching the target keeps the count (like the phone), held at the new target.
  private func selectTarget(_ next: Int) {
    target = next
    if next > 0 {
      crownCount = min(crownCount, Double(next))
    }
  }

  private func reset() {
    crownCount = 0
    WKInterfaceDevice.current().play(.notification)
  }
}

#Preview {
  NavigationStack {
    WatchTasbeehView()
  }
}
