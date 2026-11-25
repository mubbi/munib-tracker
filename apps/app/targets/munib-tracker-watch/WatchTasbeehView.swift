import SwiftUI
import WatchKit
import WidgetKit

/// Watch-local Tasbeeh — no ExternalCommand / phone sync. Two modes:
/// - **Free count**: the phone's 33 / 99 / 100 / unlimited targets, tap or Digital Crown.
///   Like the phone, changing the target keeps the count and Reset asks first.
/// - **After Salah**: the sequence the phone sends (`afterSalahTasbeeh`, phrases from the
///   adhkar dataset, D69), moving to the next phrase by itself.
/// Counts persist in the watch App Group (`WatchTasbeehStore`) so they survive leaving
/// the screen and the Tasbeeh complication can show them.
private let watchTasbeehModes: [(label: String, target: Int)] = [
  ("33", 33),
  ("99", 99),
  ("100", 100),
  ("∞", 0),
]

private enum WatchTasbeehMode: String {
  case free
  case sequence
}

struct WatchTasbeehView: View {
  let snapshot: WidgetSnapshotPayload?

  @AppStorage(WatchTasbeehStore.countKey, store: WatchTasbeehStore.defaults)
  private var storedCount = 0
  @AppStorage(WatchTasbeehStore.targetKey, store: WatchTasbeehStore.defaults)
  private var target = 33
  @AppStorage(WatchTasbeehStore.modeKey, store: WatchTasbeehStore.defaults)
  private var modeRaw = WatchTasbeehMode.free.rawValue
  /// Per-phrase counts of the after-Salah sequence, comma separated.
  @AppStorage(WatchTasbeehStore.sequenceKey, store: WatchTasbeehStore.defaults)
  private var sequenceRaw = ""

  @State private var crown: Double = 0
  @State private var restoring = true
  @State private var confirmingReset = false

  init(snapshot: WidgetSnapshotPayload? = nil) {
    self.snapshot = snapshot
  }

  // MARK: Derived state

  private var steps: [WidgetSnapshotPayload.ZikrStep] {
    (snapshot?.afterSalahTasbeeh?.steps ?? []).filter { ($0.target ?? 0) > 0 }
  }

  private var mode: WatchTasbeehMode {
    let stored = WatchTasbeehMode(rawValue: modeRaw) ?? .free
    return stored == .sequence && steps.isEmpty ? .free : stored
  }

  private var atLimit: Bool { target > 0 && storedCount >= target }
  private var crownThrough: Double {
    mode == .sequence ? 100_000 : (target > 0 ? Double(target) : 9_999)
  }

  private var sequenceCounts: [Int] {
    let parsed = sequenceRaw.split(separator: ",").map { Int($0) ?? 0 }
    return steps.indices.map { $0 < parsed.count ? parsed[$0] : 0 }
  }

  /// First phrase still short of its target; `steps.count` when the sequence is done.
  private var stepIndex: Int {
    let counts = sequenceCounts
    return steps.indices.first { counts[$0] < (steps[$0].target ?? 0) } ?? steps.count
  }

  private var sequenceDone: Bool { !steps.isEmpty && stepIndex >= steps.count }

  private var resetLabel: String { snapshot?.strings?.reset ?? "Reset" }

  /// The phone's theme accent (the pushed screen sits outside the root `.tint`).
  private var accent: Color { WidgetPalette.color(snapshot?.theme?.primary, fallback: .accentColor) }

  private var canReset: Bool {
    mode == .free ? storedCount > 0 : sequenceCounts.contains { $0 > 0 }
  }

  // MARK: Body

  var body: some View {
    // Not a ScrollView: the Digital Crown belongs to the counter, and the page fits 41mm.
    GeometryReader { proxy in
      VStack(spacing: 4) {
        if mode == .sequence {
          phraseHeader
        }

        counterDial(diameter: max(min(proxy.size.width - 16, proxy.size.height - 44), 80))
          .focusable()
          .digitalCrownRotation(
            $crown,
            from: 0,
            through: crownThrough,
            by: 1,
            sensitivity: .medium,
            isContinuous: false,
            isHapticFeedbackEnabled: true
          )
          .onChange(of: crown) { oldValue, newValue in
            handleCrownChange(oldValue: oldValue, newValue: newValue)
          }

        Text(footerLabel)
          .font(.caption2)
          .foregroundStyle(.secondary)
          .multilineTextAlignment(.center)
          .lineLimit(1)
          .minimumScaleFactor(0.7)
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    .padding(.horizontal, 4)
    .navigationTitle(snapshot?.strings?.tasbeeh ?? "Tasbeeh")
    .toolbar {
      // Target, mode and reset live in a secondary menu so the count page stays one control.
      ToolbarItem(placement: .topBarTrailing) {
        Menu {
          if !steps.isEmpty {
            Picker(selection: Binding(get: { mode }, set: { setMode($0) })) {
              Text(snapshot?.strings?.freeCount ?? "Free count").tag(WatchTasbeehMode.free)
              Text(snapshot?.strings?.afterSalahAdhkar ?? snapshot?.afterSalahTasbeeh?.title ?? "After Salah")
                .tag(WatchTasbeehMode.sequence)
            } label: {
              Text(snapshot?.strings?.freeCount ?? "Free count")
            }
          }
          if mode == .free {
            Picker(selection: Binding(get: { target }, set: { selectTarget($0) })) {
              ForEach(watchTasbeehModes, id: \.target) { option in
                Text(option.label).tag(option.target)
              }
            } label: {
              Text(snapshot?.strings?.remaining ?? "Remaining")
            }
          }
          Button(role: .destructive) {
            confirmingReset = true
          } label: {
            Label(resetLabel, systemImage: "arrow.counterclockwise")
          }
          .disabled(!canReset)
        } label: {
          Image(systemName: "ellipsis.circle")
        }
      }
    }
    // Same as the phone: reset asks first, so a stray tap never wipes a count.
    .confirmationDialog(resetLabel, isPresented: $confirmingReset, titleVisibility: .hidden) {
      Button(resetLabel, role: .destructive) { reset() }
    }
    .onAppear { syncCrown() }
    .onDisappear { reloadComplication() }
    .environment(\.locale, Locale(identifier: snapshot?.locale ?? "en"))
    .environment(\.layoutDirection, snapshot?.isRtl == true ? .rightToLeft : .leftToRight)
  }

  private func setMode(_ value: WatchTasbeehMode) {
    guard mode != value else { return }
    modeRaw = value.rawValue
    syncCrown()
  }

  @ViewBuilder
  private var phraseHeader: some View {
    if sequenceDone {
      Text(snapshot?.strings?.sequenceDone ?? "Tasbeeh complete")
        .font(.headline)
        .multilineTextAlignment(.center)
    } else if stepIndex < steps.count {
      let step = steps[stepIndex]
      VStack(spacing: 1) {
        if let arabic = step.arabic, !arabic.isEmpty {
          Text(arabic)
            .font(.title3)
            .environment(\.layoutDirection, .rightToLeft)
            .multilineTextAlignment(.center)
            .lineLimit(2)
            .minimumScaleFactor(0.6)
        }
        if let latin = step.transliteration ?? step.title, !latin.isEmpty {
          Text(latin)
            .font(.caption2)
            .foregroundStyle(.secondary)
            .lineLimit(1)
            .minimumScaleFactor(0.7)
        }
      }
      .accessibilityElement(children: .combine)
    }
  }

  private func counterDial(diameter: CGFloat) -> some View {
    let (count, goal, complete) = dialValues
    // A Button (not a tap gesture) so Double Tap (watchOS 11+) counts hands-free.
    return Button {
      tap()
    } label: {
      dialFace(count: count, goal: goal, complete: complete, diameter: diameter)
    }
    .buttonStyle(.plain)
    .watchPrimaryDoubleTap()
    .accessibilityLabel(goal > 0 ? "\(count) / \(goal)" : "\(count)")
    .accessibilityHint(snapshot?.strings?.tapToCount ?? "Tap to count")
  }

  private func dialFace(count: Int, goal: Int, complete: Bool, diameter: CGFloat) -> some View {
    ZStack {
      Circle()
        .stroke(Color.secondary.opacity(0.25), lineWidth: 8)
      if goal > 0 {
        Circle()
          .trim(from: 0, to: CGFloat(min(Double(count) / Double(goal), 1)))
          .stroke(
            complete ? Color.green : accent,
            style: StrokeStyle(lineWidth: 8, lineCap: .round)
          )
          .rotationEffect(.degrees(-90))
          .animation(.easeOut(duration: 0.2), value: count)
      }
      VStack(spacing: 0) {
        if mode == .sequence && sequenceDone {
          Image(systemName: "checkmark")
            .font(.title.weight(.bold))
            .foregroundStyle(.green)
        } else {
          Text("\(count)")
            .font(.system(.largeTitle, design: .rounded).weight(.bold))
            .minimumScaleFactor(0.6)
            .lineLimit(1)
          if goal > 0 {
            Text("/ \(goal)")
              .font(.caption2)
              .foregroundStyle(.secondary)
          }
        }
      }
    }
    .frame(width: diameter, height: diameter)
    .contentShape(Circle())
  }

  /// (count, target, target reached) for the dial in the current mode.
  private var dialValues: (Int, Int, Bool) {
    if mode == .free {
      return (storedCount, target, atLimit)
    }
    guard stepIndex < steps.count else {
      let last = steps.last?.target ?? 0
      return (last, last, true)
    }
    let goal = steps[stepIndex].target ?? 0
    return (sequenceCounts[stepIndex], goal, false)
  }

  private var footerLabel: String {
    if mode == .sequence {
      guard !sequenceDone else { return "\(steps.count) / \(steps.count)" }
      let goal = steps[stepIndex].target ?? 0
      let left = max(goal - sequenceCounts[stepIndex], 0)
      return "\(stepIndex + 1) / \(steps.count) · \(snapshot?.strings?.remaining ?? "Remaining"): \(left)"
    }
    guard target > 0 else {
      return snapshot?.strings?.tasbeehUnlimited ?? "Unlimited"
    }
    return "\(snapshot?.strings?.remaining ?? "Remaining"): \(max(target - storedCount, 0))"
  }

  // MARK: Counting

  private func tap() {
    if mode == .sequence {
      advanceSequence()
      return
    }
    guard !atLimit else {
      WKInterfaceDevice.current().play(.click)
      return
    }
    // Moving the crown binding runs `handleCrownChange`, which stores the count.
    crown = min(crown + 1, crownThrough)
    WKInterfaceDevice.current().play(.click)
  }

  private func handleCrownChange(oldValue: Double, newValue: Double) {
    guard !restoring else { return }
    let old = Int(oldValue.rounded())
    let new = Int(newValue.rounded())
    guard old != new else { return }
    if mode == .sequence {
      // Forward only: winding the crown back never un-counts a phrase.
      if new > old {
        for _ in 0..<(new - old) { advanceSequence(haptic: false) }
      }
      return
    }
    storedCount = max(new, 0)
    if target > 0, old < target, new >= target {
      WKInterfaceDevice.current().play(.success)
      reloadComplication()
    }
  }

  private func advanceSequence(haptic: Bool = true) {
    let index = stepIndex
    guard index < steps.count else {
      if haptic { WKInterfaceDevice.current().play(.click) }
      return
    }
    var counts = sequenceCounts
    counts[index] += 1
    sequenceRaw = counts.map(String.init).joined(separator: ",")
    let goal = steps[index].target ?? 0
    if counts[index] >= goal {
      // Phrase finished: a distinct tap, then the next phrase (or the end).
      WKInterfaceDevice.current().play(index == steps.count - 1 ? .notification : .success)
    } else if haptic {
      WKInterfaceDevice.current().play(.click)
    }
  }

  /// Switching the target keeps the count (like the phone), held at the new target.
  private func selectTarget(_ next: Int) {
    target = next
    if next > 0, storedCount > next {
      storedCount = next
    }
    syncCrown()
  }

  private func reset() {
    if mode == .free {
      storedCount = 0
    } else {
      sequenceRaw = ""
    }
    syncCrown()
    WKInterfaceDevice.current().play(.notification)
    reloadComplication()
  }

  /// Points the crown at the stored count without counting the jump itself.
  private func syncCrown() {
    restoring = true
    crown = mode == .free ? Double(storedCount) : 0
    DispatchQueue.main.async { restoring = false }
  }

  private func reloadComplication() {
    WidgetCenter.shared.reloadTimelines(ofKind: WatchTasbeehStore.complicationKind)
  }
}

/// Tasbeeh page of the companion: today's watch count and a way in.
struct WatchTasbeehCard: View {
  @EnvironmentObject private var model: WatchPrayerModel
  @AppStorage(WatchTasbeehStore.countKey, store: WatchTasbeehStore.defaults)
  private var storedCount = 0
  @AppStorage(WatchTasbeehStore.targetKey, store: WatchTasbeehStore.defaults)
  private var target = 33

  var body: some View {
    VStack(spacing: 10) {
      Image(systemName: "circle.grid.2x2.fill")
        .font(.title2)
        .foregroundStyle(.tint)
      Text(target > 0 ? "\(storedCount) / \(target)" : "\(storedCount)")
        .font(.title2.weight(.bold).monospacedDigit())
      Button {
        model.path.append(.tasbeeh)
      } label: {
        Text(model.text(\.tasbeeh, "Tasbeeh"))
          .frame(maxWidth: .infinity)
      }
      .buttonStyle(.borderedProminent)
    }
    .padding(.horizontal, 4)
    .navigationTitle(model.text(\.tasbeeh, "Tasbeeh"))
  }
}

#Preview {
  NavigationStack {
    WatchTasbeehView()
  }
}

extension View {
  /// Double Tap (watchOS 11+) runs this button's action; a no-op on watchOS 10.
  @ViewBuilder
  func watchPrimaryDoubleTap(isEnabled: Bool = true) -> some View {
    if #available(watchOS 11.0, *) {
      handGestureShortcut(.primaryAction, isEnabled: isEnabled)
    } else {
      self
    }
  }
}
