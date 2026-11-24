package expo.modules.munibfocuslock

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.util.TypedValue
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import org.json.JSONObject

/**
 * Full-screen Salah overlay (`TYPE_APPLICATION_OVERLAY`) shown over a blocked
 * app: "It's time for {prayer}", "I've prayed" (deep link into the app to mark
 * it), "I'll pray now" (gentle mode: hold 10 s) and the counted emergency
 * unlock. Built in code so the module ships no layout resources; copy and
 * colours come from the plan the JS wrote (already localised).
 */
internal class FocusLockOverlay(
  private val context: Context,
  private val onUnlocked: (windowId: String) -> Unit,
) {
  private val windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
  private val handler = Handler(Looper.getMainLooper())
  private var root: LinearLayout? = null
  private var shownWindowId: String? = null

  fun show(window: FocusLockStore.Window) {
    if (root != null && shownWindowId == window.id) return
    hide()
    val config = FocusLockStore.config(context)
    val view = build(window, config)
    val type = if (Build.VERSION.SDK_INT >= 26) {
      WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
    } else {
      @Suppress("DEPRECATION")
      WindowManager.LayoutParams.TYPE_PHONE
    }
    val params = WindowManager.LayoutParams(
      WindowManager.LayoutParams.MATCH_PARENT,
      WindowManager.LayoutParams.MATCH_PARENT,
      type,
      WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
      PixelFormat.OPAQUE,
    )
    try {
      windowManager.addView(view, params)
      root = view
      shownWindowId = window.id
    } catch (_: Exception) {
      // Overlay permission revoked mid-window; the service stops on its next poll.
    }
  }

  fun hide() {
    handler.removeCallbacksAndMessages(null)
    root?.let {
      try {
        windowManager.removeView(it)
      } catch (_: Exception) {
      }
    }
    root = null
    shownWindowId = null
  }

  private fun color(theme: JSONObject?, key: String, fallback: Int): Int =
    try {
      Color.parseColor(theme?.optString(key)?.ifEmpty { null } ?: return fallback)
    } catch (_: Exception) {
      fallback
    }

  private fun dp(value: Float): Int =
    TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, value, context.resources.displayMetrics).toInt()

  @SuppressLint("ClickableViewAccessibility")
  private fun build(window: FocusLockStore.Window, config: JSONObject): LinearLayout {
    val theme = config.optJSONObject("theme")
    val labels = config.optJSONObject("labels")
    val background = color(theme, "background", Color.BLACK)
    val foreground = color(theme, "foreground", Color.WHITE)
    val muted = color(theme, "muted", Color.GRAY)
    val accent = color(theme, "accent", Color.DKGRAY)
    val onAccent = color(theme, "accentForeground", Color.WHITE)
    val mode = config.optString("unlockMode", "gentle")

    val layout = LinearLayout(context).apply {
      orientation = LinearLayout.VERTICAL
      gravity = Gravity.CENTER
      setBackgroundColor(background)
      setPadding(dp(32f), dp(48f), dp(32f), dp(48f))
      // Swallow touches so the blocked app underneath can't be used.
      isClickable = true
    }

    fun text(value: String, sizeSp: Float, colorInt: Int, bold: Boolean = false) =
      TextView(context).apply {
        text = value
        setTextColor(colorInt)
        setTextSize(TypedValue.COMPLEX_UNIT_SP, sizeSp)
        gravity = Gravity.CENTER
        textAlignment = View.TEXT_ALIGNMENT_CENTER
        if (bold) setTypeface(typeface, android.graphics.Typeface.BOLD)
        setPadding(0, dp(8f), 0, dp(8f))
      }

    fun button(label: String, filled: Boolean) = Button(context).apply {
      text = label
      isAllCaps = false
      setTextColor(if (filled) onAccent else accent)
      background = GradientDrawable().apply {
        cornerRadius = dp(24f).toFloat()
        if (filled) setColor(accent) else setStroke(dp(1f), accent)
      }
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT,
        LinearLayout.LayoutParams.WRAP_CONTENT,
      ).apply { topMargin = dp(12f) }
    }

    layout.addView(text(window.title, 26f, foreground, bold = true))
    layout.addView(text(window.body, 16f, muted))

    val prayed = button(labels?.optString("prayed") ?: "", filled = true)
    prayed.setOnClickListener {
      val url = config.optString("confirmUrl", "munib-tracker://mark-current")
      try {
        context.startActivity(
          Intent(Intent.ACTION_VIEW, Uri.parse(url))
            .setPackage(context.packageName)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK),
        )
      } catch (_: Exception) {
      }
      hide()
    }
    layout.addView(prayed)

    if (mode == "gentle") {
      val hold = button(labels?.optString("prayNow") ?: "", filled = false)
      hold.contentDescription = "${labels?.optString("prayNow")}. ${labels?.optString("holdHint")}"
      val unlock = Runnable { onUnlocked(window.id) }
      hold.setOnTouchListener { v, event ->
        when (event.action) {
          MotionEvent.ACTION_DOWN -> {
            v.isPressed = true
            handler.postDelayed(unlock, HOLD_MS)
          }
          MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
            v.isPressed = false
            handler.removeCallbacks(unlock)
          }
        }
        true
      }
      layout.addView(hold)
      layout.addView(text(labels?.optString("holdHint") ?: "", 13f, muted))
    }

    val left = FocusLockStore.emergencyLeft(context)
    val emergencyLabels = labels?.optJSONArray("emergency")
    if (left > 0 && emergencyLabels != null && emergencyLabels.length() > 0) {
      val label = emergencyLabels.optString(minOf(left, emergencyLabels.length() - 1))
      val emergency = button(label, filled = false)
      emergency.setOnClickListener {
        FocusLockStore.recordEmergency(context)
        onUnlocked(window.id)
      }
      layout.addView(emergency)
    }
    return layout
  }

  companion object {
    private const val HOLD_MS = 10_000L
  }
}
