package expo.modules.munibwear.tasbeeh

/**
 * Pure tasbeeh model shared by the Compose counter and the Tasbeeh tile. No Android types, so
 * it can be unit-tested on the JVM; persistence lives in `WearTasbeehStore` (SharedPreferences).
 *
 * Two modes: a free counter (33 / 99 / 100 / ∞) and the after-Salah sequence the phone sends
 * (`afterSalahTasbeeh.steps`, e.g. 33 / 33 / 34), which advances to the next step by itself.
 */
internal enum class TasbeehMode { FREE, SEQUENCE }

internal data class TasbeehState(
  /** Free-mode count. */
  val count: Int = 0,
  /** Free-mode target; 0 = no target (∞). */
  val target: Int = DEFAULT_TARGET,
  val mode: TasbeehMode = TasbeehMode.FREE,
  /** Sequence position: index of the current step (== steps when the sequence is done). */
  val step: Int = 0,
  /** Count within the current sequence step. */
  val stepCount: Int = 0,
  /** Local day (yyyy-MM-dd) the sequence progress belongs to; "" before the first save. */
  val date: String = "",
) {
  companion object {
    const val DEFAULT_TARGET = 33
  }
}

internal sealed interface TasbeehEvent {
  /** +1 (tap anywhere / one rotary detent). */
  data object Count : TasbeehEvent

  /** −1, never below zero; never asks. */
  data object Undo : TasbeehEvent

  /** 33 / 99 / 100 / 0 (∞). Like the phone: keeps the count, held at the new target. */
  data class SetTarget(val target: Int) : TasbeehEvent

  data class SetMode(val mode: TasbeehMode) : TasbeehEvent

  /** Free mode: count → 0. Sequence: back to the first step. The UI confirms first. */
  data object Reset : TasbeehEvent

  /** A new local day: the after-Salah sequence starts over (the free count is kept). */
  data class NewDay(val date: String) : TasbeehEvent
}

/** What the wrist should feel for an event. */
internal enum class TasbeehFeedback { NONE, TICK, TARGET, ADVANCE, DONE }

internal data class TasbeehResult(val state: TasbeehState, val feedback: TasbeehFeedback)

/** Everything a surface draws, derived from the state and the phone's step targets. */
internal data class TasbeehView(
  val sequence: Boolean,
  /** Number shown in the centre. */
  val count: Int,
  /** Target for [count]; 0 = ∞. */
  val target: Int,
  /** Arc fill, 0..1 (0 in ∞ mode). */
  val progress: Float,
  /** Free target reached, or the whole sequence done. */
  val reached: Boolean,
  /** Current step (0-based) and number of steps; 0 / 0 in free mode. */
  val stepIndex: Int,
  val stepTotal: Int,
)

internal object Tasbeeh {
  val TARGETS = listOf(33, 99, 100, 0)

  /** The sequence only applies while the phone has sent steps; otherwise the free counter. */
  fun isSequence(state: TasbeehState, stepTargets: List<Int>): Boolean =
    state.mode == TasbeehMode.SEQUENCE && stepTargets.isNotEmpty()

  fun reduce(state: TasbeehState, event: TasbeehEvent, stepTargets: List<Int>): TasbeehResult {
    val sequence = isSequence(state, stepTargets)
    return when (event) {
      TasbeehEvent.Count -> if (sequence) countSequence(state, stepTargets) else countFree(state)
      TasbeehEvent.Undo -> if (sequence) undoSequence(state, stepTargets) else undoFree(state)
      is TasbeehEvent.SetTarget -> {
        val target = event.target.coerceAtLeast(0)
        val count = if (target > 0) minOf(state.count, target) else state.count
        TasbeehResult(state.copy(target = target, count = count), TasbeehFeedback.NONE)
      }
      is TasbeehEvent.SetMode -> {
        val mode = if (event.mode == TasbeehMode.SEQUENCE && stepTargets.isEmpty()) TasbeehMode.FREE else event.mode
        TasbeehResult(state.copy(mode = mode), TasbeehFeedback.NONE)
      }
      TasbeehEvent.Reset -> {
        val next = if (sequence) state.copy(step = 0, stepCount = 0) else state.copy(count = 0)
        TasbeehResult(next, TasbeehFeedback.NONE)
      }
      is TasbeehEvent.NewDay -> {
        val next = if (event.date == state.date) state else state.copy(date = event.date, step = 0, stepCount = 0)
        TasbeehResult(next, TasbeehFeedback.NONE)
      }
    }
  }

  fun canUndo(state: TasbeehState, stepTargets: List<Int>): Boolean =
    if (isSequence(state, stepTargets)) state.step > 0 || state.stepCount > 0 else state.count > 0

  fun canReset(state: TasbeehState, stepTargets: List<Int>): Boolean = canUndo(state, stepTargets)

  fun view(state: TasbeehState, stepTargets: List<Int>): TasbeehView {
    if (!isSequence(state, stepTargets)) {
      val target = state.target.coerceAtLeast(0)
      val reached = target > 0 && state.count >= target
      return TasbeehView(
        sequence = false,
        count = state.count,
        target = target,
        progress = if (target > 0) (state.count.toFloat() / target).coerceIn(0f, 1f) else 0f,
        reached = reached,
        stepIndex = 0,
        stepTotal = 0,
      )
    }
    val step = state.step.coerceIn(0, stepTargets.size)
    if (step >= stepTargets.size) {
      val total = stepTargets.sum()
      return TasbeehView(true, total, total, 1f, true, stepTargets.size - 1, stepTargets.size)
    }
    val target = stepTargets[step]
    val count = state.stepCount.coerceIn(0, target)
    return TasbeehView(
      sequence = true,
      count = count,
      target = target,
      progress = if (target > 0) count.toFloat() / target else 0f,
      reached = false,
      stepIndex = step,
      stepTotal = stepTargets.size,
    )
  }

  private fun countFree(state: TasbeehState): TasbeehResult {
    val target = state.target
    if (target > 0 && state.count >= target) return TasbeehResult(state, TasbeehFeedback.NONE)
    val next = state.count + 1
    val feedback = if (target > 0 && next >= target) TasbeehFeedback.TARGET else TasbeehFeedback.TICK
    return TasbeehResult(state.copy(count = next), feedback)
  }

  private fun undoFree(state: TasbeehState): TasbeehResult =
    if (state.count > 0) {
      TasbeehResult(state.copy(count = state.count - 1), TasbeehFeedback.TICK)
    } else {
      TasbeehResult(state, TasbeehFeedback.NONE)
    }

  private fun countSequence(state: TasbeehState, stepTargets: List<Int>): TasbeehResult {
    val step = state.step.coerceIn(0, stepTargets.size)
    if (step >= stepTargets.size) return TasbeehResult(state, TasbeehFeedback.NONE)
    val next = state.stepCount + 1
    if (next < stepTargets[step]) {
      return TasbeehResult(state.copy(step = step, stepCount = next), TasbeehFeedback.TICK)
    }
    val nextStep = step + 1
    val feedback = if (nextStep >= stepTargets.size) TasbeehFeedback.DONE else TasbeehFeedback.ADVANCE
    return TasbeehResult(state.copy(step = nextStep, stepCount = 0), feedback)
  }

  private fun undoSequence(state: TasbeehState, stepTargets: List<Int>): TasbeehResult {
    val step = state.step.coerceIn(0, stepTargets.size)
    return when {
      state.stepCount > 0 && step < stepTargets.size ->
        TasbeehResult(state.copy(step = step, stepCount = state.stepCount - 1), TasbeehFeedback.TICK)
      // At the start of a step (or after the last one): back to the last count of the previous step.
      step > 0 -> TasbeehResult(
        state.copy(step = step - 1, stepCount = (stepTargets[step - 1] - 1).coerceAtLeast(0)),
        TasbeehFeedback.TICK,
      )
      else -> TasbeehResult(state, TasbeehFeedback.NONE)
    }
  }
}
