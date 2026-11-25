package expo.modules.munibwear

import android.app.Activity
import android.content.Context
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.RectF
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.widget.LinearLayout
import android.widget.TextView

/** Progress ring drawn around a counter / today's progress. */
internal class RingView(context: Context) : View(context) {
  var progress: Float = 0f
    set(value) {
      field = value.coerceIn(0f, 1f)
      invalidate()
    }
  var color: Int = WearColors.ACCENT
    set(value) {
      field = value
      invalidate()
    }

  private val stroke = context.dpPx(8f)
  private val track = Paint(Paint.ANTI_ALIAS_FLAG).apply {
    style = Paint.Style.STROKE
    strokeWidth = stroke
    color = WearColors.TRACK
  }
  private val arc = Paint(Paint.ANTI_ALIAS_FLAG).apply {
    style = Paint.Style.STROKE
    strokeWidth = stroke
    strokeCap = Paint.Cap.ROUND
  }
  private val bounds = RectF()

  override fun onDraw(canvas: Canvas) {
    super.onDraw(canvas)
    val inset = stroke / 2f + paddingLeft
    val size = minOf(width, height).toFloat()
    val left = (width - size) / 2f + inset
    val top = (height - size) / 2f + inset
    bounds.set(left, top, left + size - inset * 2, top + size - inset * 2)
    canvas.drawArc(bounds, 0f, 360f, false, track)
    if (progress > 0f) {
      arc.color = color
      // Clockwise from 12 o'clock; mirrored for RTL layouts.
      val sweep = 360f * progress * if (layoutDirection == LAYOUT_DIRECTION_RTL) -1f else 1f
      canvas.drawArc(bounds, -90f, sweep, false, arc)
    }
  }
}

internal fun Context.dpPx(value: Float): Float =
  TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, value, resources.displayMetrics)

internal fun Context.dpi(value: Float): Int = dpPx(value).toInt()

internal fun Context.label(
  text: String = "",
  sizeSp: Float = 14f,
  color: Int = WearColors.TEXT,
  bold: Boolean = false,
): TextView = TextView(this).apply {
  this.text = text
  setTextSize(TypedValue.COMPLEX_UNIT_SP, sizeSp)
  setTextColor(color)
  gravity = Gravity.CENTER
  textAlignment = View.TEXT_ALIGNMENT_CENTER
  if (bold) typeface = Typeface.DEFAULT_BOLD
}

/** Pill button styled like the tiles' chips. */
internal fun Context.pill(text: String, filled: Boolean, onClick: () -> Unit): TextView =
  label(text, 14f, if (filled) WearColors.BACKGROUND else WearColors.TEXT, bold = filled).apply {
    background = GradientDrawable().apply {
      cornerRadius = dpPx(24f)
      setColor(if (filled) WearColors.ACCENT else WearColors.ACCENT_DARK)
    }
    // Wear quality: every tap target is at least 48 dp.
    minHeight = dpi(48f)
    minWidth = dpi(48f)
    maxLines = 1
    ellipsize = android.text.TextUtils.TruncateAt.END
    setPadding(dpi(14f), dpi(6f), dpi(14f), dpi(6f))
    isClickable = true
    isFocusable = false
    setOnClickListener { onClick() }
  }

internal fun LinearLayout.addSpaced(view: View, topDp: Float = 6f, matchWidth: Boolean = true) {
  val params = LinearLayout.LayoutParams(
    if (matchWidth) LinearLayout.LayoutParams.MATCH_PARENT else LinearLayout.LayoutParams.WRAP_CONTENT,
    LinearLayout.LayoutParams.WRAP_CONTENT,
  )
  params.topMargin = context.dpi(topDp)
  params.gravity = Gravity.CENTER_HORIZONTAL
  addView(view, params)
}

/** Insets that keep content inside a round display (and a little off a square one's edges). */
internal fun Activity.roundSafePadding(view: View, bottomExtraDp: Float = 24f) {
  val metrics = resources.displayMetrics
  val round = resources.configuration.isScreenRound
  val side = if (round) (metrics.widthPixels * 0.146f).toInt() else dpi(8f)
  val top = if (round) (metrics.heightPixels * 0.1f).toInt() else dpi(8f)
  view.setPadding(side, top, side, top + dpi(bottomExtraDp))
}

/** Short haptic ticks for counting; a stronger pattern when a target is reached. */
internal class WearHaptics(context: Context) {
  private val vibrator: Vibrator? =
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      (context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager)?.defaultVibrator
    } else {
      @Suppress("DEPRECATION")
      context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
    }

  fun tick() = play(VibrationEffect.createPredefined(VibrationEffect.EFFECT_CLICK))

  fun target() = play(VibrationEffect.createWaveform(longArrayOf(0, 90, 70, 90), -1))

  fun done() = play(VibrationEffect.createWaveform(longArrayOf(0, 120, 80, 120, 80, 200), -1))

  private fun play(effect: VibrationEffect) {
    try {
      if (vibrator?.hasVibrator() == true) vibrator.vibrate(effect)
    } catch (_: Exception) {
      /* haptics unavailable */
    }
  }
}
