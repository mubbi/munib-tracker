package expo.modules.munibwear

import android.app.Activity
import android.app.AlertDialog
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.Gravity
import android.view.InputDevice
import android.view.MotionEvent
import android.view.View
import android.view.ViewConfiguration
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import app.munibtracker.wear.R
import kotlin.math.abs

/**
 * Full-screen tasbeeh: tap anywhere or turn the crown / rotating bezel to count,
 * with a haptic tick per count and a stronger pattern at the target. Two modes:
 * a free counter (33 / 99 / 100 / ∞, shared with the Tasbeeh tile) and the
 * after-Salah sequence the phone sends from the adhkar dataset (33 / 33 / 34,
 * moving to the next phrase by itself). Watch-local: never talks to the phone.
 */
class TasbeehActivity : Activity() {
  private val handler = Handler(Looper.getMainLooper())
  private lateinit var haptics: WearHaptics
  private lateinit var root: FrameLayout
  private lateinit var ring: RingView
  private lateinit var column: LinearLayout
  private var snapshot: WearSnapshot? = null
  private var rotaryAccumulated = 0f

  private val steps: List<WearZikrStep> get() = snapshot?.afterSalahSteps.orEmpty()
  private val sequenceMode: Boolean
    get() = steps.isNotEmpty() && WearTasbeehStore.mode(this) == WearTasbeehStore.MODE_SEQUENCE

  private val tileUpdate = Runnable { WearRefresh.requestTasbeehTile(applicationContext) }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    haptics = WearHaptics(this)
    ring = RingView(this).apply { setPadding(dpi(3f), dpi(3f), dpi(3f), dpi(3f)) }
    column = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      gravity = Gravity.CENTER
    }
    val side = (resources.displayMetrics.widthPixels * 0.14f).toInt()
    column.setPadding(side, dpi(22f), side, dpi(22f))
    // Tap anywhere counts (the column fills the screen); buttons consume their own taps.
    column.isClickable = true
    column.setOnClickListener { count(+1) }
    // Large font scales can outgrow the screen: scroll by touch instead of clipping.
    // The crown stays on the counter (the root keeps focus), not on scrolling.
    val scroll = ScrollView(this).apply {
      isFillViewport = true
      isFocusable = false
      isVerticalScrollBarEnabled = true
      addView(column, FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.WRAP_CONTENT))
    }
    root = FrameLayout(this).apply {
      setBackgroundColor(WearColors.BACKGROUND)
      isFocusable = true
      isFocusableInTouchMode = true
      setOnGenericMotionListener { _, event -> onRotary(event) }
      addView(ring, FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT))
      addView(scroll, FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT))
    }
    setContentView(root)
    render()
  }

  override fun onResume() {
    super.onResume()
    root.requestFocus()
    WearDataLayer.executor.execute {
      val next = WearDataLayer.readSnapshot(applicationContext)
      handler.post {
        snapshot = next
        render()
      }
    }
  }

  override fun onPause() {
    super.onPause()
    handler.removeCallbacks(tileUpdate)
    WearRefresh.requestTasbeehTile(applicationContext)
  }

  /** Crown / bezel: one count per detent-sized turn; turning back undoes. */
  private fun onRotary(event: MotionEvent): Boolean {
    if (event.action != MotionEvent.ACTION_SCROLL ||
      !event.isFromSource(InputDevice.SOURCE_ROTARY_ENCODER)
    ) {
      return false
    }
    val factor = ViewConfiguration.get(this).scaledVerticalScrollFactor
    rotaryAccumulated += -event.getAxisValue(MotionEvent.AXIS_SCROLL) * factor
    val step = dpPx(ROTARY_STEP_DP)
    while (abs(rotaryAccumulated) >= step) {
      if (rotaryAccumulated > 0) {
        count(+1)
        rotaryAccumulated -= step
      } else {
        count(-1)
        rotaryAccumulated += step
      }
    }
    return true
  }

  private fun count(delta: Int) {
    if (sequenceMode) countSequence(delta) else countFree(delta)
    handler.removeCallbacks(tileUpdate)
    handler.postDelayed(tileUpdate, TILE_UPDATE_DELAY_MS)
    render()
  }

  private fun countFree(delta: Int) {
    if (delta < 0) {
      if (WearTasbeehStore.count(this) > 0) {
        WearTasbeehStore.decrement(this)
        haptics.tick()
      }
      return
    }
    val target = WearTasbeehStore.target(this)
    if (target > 0 && WearTasbeehStore.count(this) >= target) return
    if (WearTasbeehStore.increment(this)) haptics.target() else haptics.tick()
  }

  private fun countSequence(delta: Int) {
    val all = steps
    var step = WearTasbeehStore.sequenceStep(this).coerceIn(0, all.size)
    var current = WearTasbeehStore.sequenceCount(this)
    if (delta < 0) {
      if (current > 0) {
        current -= 1
        haptics.tick()
      }
    } else {
      if (step >= all.size) return
      current += 1
      if (current >= all[step].target) {
        step += 1
        current = 0
        if (step >= all.size) haptics.done() else haptics.target()
      } else {
        haptics.tick()
      }
    }
    WearTasbeehStore.setSequence(this, step, current)
  }

  private fun render() {
    column.removeAllViews()
    column.gravity = Gravity.CENTER
    val snap = snapshot
    root.layoutDirection = if (snap?.isRtl == true) View.LAYOUT_DIRECTION_RTL else View.LAYOUT_DIRECTION_LTR
    val tasbeehLabel = snap?.str("tasbeeh", getString(R.string.wear_tasbeeh)) ?: getString(R.string.wear_tasbeeh)
    val freeLabel = snap?.str("freeCount", "Free count") ?: "Free count"
    val sequenceLabel = snap?.afterSalahTitle?.ifEmpty { null } ?: snap?.str("afterSalahAdhkar", "After Salah") ?: ""

    if (steps.isNotEmpty()) {
      val other = if (sequenceMode) freeLabel else sequenceLabel
      column.addSpaced(
        pill("⇄ $other", filled = false) {
          WearTasbeehStore.setMode(
            this,
            if (sequenceMode) WearTasbeehStore.MODE_FREE else WearTasbeehStore.MODE_SEQUENCE,
          )
          haptics.tick()
          render()
        }.small(),
        topDp = 0f,
        matchWidth = false,
      )
    }

    if (sequenceMode) renderSequence(snap) else renderFree(snap, tasbeehLabel)

    val actions = LinearLayout(this).apply {
      orientation = LinearLayout.HORIZONTAL
      gravity = Gravity.CENTER
    }
    if (!sequenceMode) {
      // One button cycles 33 → 99 → 100 → ∞: four 48 dp targets don't fit a small round screen.
      val target = WearTasbeehStore.target(this)
      actions.addView(
        pill("↻ ${if (target > 0) "$target" else "∞"}", filled = true) {
          val targets = WearTasbeehStore.TARGETS
          WearTasbeehStore.setTarget(this, targets[(targets.indexOf(target) + 1) % targets.size])
          haptics.tick()
          handler.removeCallbacks(tileUpdate)
          handler.postDelayed(tileUpdate, TILE_UPDATE_DELAY_MS)
          render()
        }.small(),
        LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply {
          marginEnd = dpi(6f)
        },
      )
    }
    actions.addView(pill(snap?.str("reset", "Reset") ?: "Reset", filled = false) { confirmReset(snap) }.small())
    column.addSpaced(actions, topDp = 8f, matchWidth = false)
  }

  private fun renderFree(snap: WearSnapshot?, title: String) {
    val count = WearTasbeehStore.count(this)
    val target = WearTasbeehStore.target(this)
    val done = target > 0 && count >= target
    ring.progress = if (target > 0) count.toFloat() / target else 0f
    ring.color = if (done) WearColors.SUCCESS else WearColors.WARNING

    column.addSpaced(label(title, 13f, WearColors.SECONDARY), topDp = 4f)
    column.addSpaced(label("$count", 44f, if (done) WearColors.SUCCESS else WearColors.TEXT, bold = true), topDp = 0f)
    val detail = when {
      target <= 0 -> snap?.str("tasbeehUnlimited", "Unlimited count") ?: "∞"
      count == 0 -> snap?.str("tapToCount", "Tap to count") ?: "Tap to count"
      else -> "${snap?.str("remaining", "Remaining") ?: "Remaining"}: ${maxOf(target - count, 0)}"
    }
    column.addSpaced(label(detail, 12f, WearColors.SECONDARY), topDp = 0f)
  }

  private fun renderSequence(snap: WearSnapshot?) {
    val all = steps
    val step = WearTasbeehStore.sequenceStep(this).coerceIn(0, all.size)
    val current = WearTasbeehStore.sequenceCount(this)
    val total = all.sumOf { it.target }
    val counted = all.take(step).sumOf { it.target } + current
    ring.progress = if (total > 0) counted.toFloat() / total else 0f
    ring.color = if (step >= all.size) WearColors.SUCCESS else WearColors.ACCENT

    if (step >= all.size) {
      column.addSpaced(label(snap?.str("sequenceDone", "Tasbeeh complete") ?: "", 18f, WearColors.SUCCESS, bold = true), topDp = 8f)
      column.addSpaced(label("$total", 30f, WearColors.TEXT, bold = true), topDp = 0f)
      return
    }
    val phrase = all[step]
    column.addSpaced(
      label(phrase.arabic, 20f, WearColors.TEXT).apply {
        textDirection = View.TEXT_DIRECTION_RTL
        maxLines = 2
      },
      topDp = 4f,
    )
    if (phrase.transliteration.isNotEmpty()) {
      column.addSpaced(label(phrase.transliteration, 12f, WearColors.SECONDARY).apply { maxLines = 1 }, topDp = 0f)
    }
    column.addSpaced(label("$current", 40f, WearColors.TEXT, bold = true), topDp = 0f)
    column.addSpaced(label("/ ${phrase.target} · ${step + 1}/${all.size}", 12f, WearColors.SECONDARY), topDp = 0f)
  }

  private fun confirmReset(snap: WearSnapshot?) {
    val reset = snap?.str("reset", "Reset") ?: "Reset"
    AlertDialog.Builder(this)
      .setTitle(reset)
      .setPositiveButton(reset) { _, _ ->
        if (sequenceMode) WearTasbeehStore.setSequence(this, 0, 0) else WearTasbeehStore.reset(this)
        haptics.target()
        WearRefresh.requestTasbeehTile(applicationContext)
        render()
      }
      .setNegativeButton(snap?.str("cancel", "Cancel") ?: "Cancel", null)
      .show()
  }

  /** Compact text, still a 48 dp tap target. */
  private fun TextView.small(): TextView = apply {
    textSize = 13f
    setPadding(dpi(12f), dpi(4f), dpi(12f), dpi(4f))
  }

  companion object {
    /** Turn needed for one count (a bezel detent / a short crown turn). */
    private const val ROTARY_STEP_DP = 28f
    private const val TILE_UPDATE_DELAY_MS = 800L
  }
}
