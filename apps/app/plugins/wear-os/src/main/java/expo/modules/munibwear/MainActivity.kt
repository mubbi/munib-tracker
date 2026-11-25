package expo.modules.munibwear

import android.app.Activity
import android.content.Intent
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.Gravity
import android.view.View
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.ScrollView
import app.munibtracker.wear.R
import com.google.android.gms.wearable.DataClient
import com.google.android.gms.wearable.DataEvent
import com.google.android.gms.wearable.Wearable

/**
 * The Wear app's home: today's progress ring, the next Salah with a live
 * countdown, Mark for the current Salah, today's five rows (a begun, unmarked row
 * asks once and marks on the second tap) and the way into the Tasbeeh counter.
 * Plain Views (no Compose) so the module stays small; the ScrollView keeps focus
 * so the crown / rotating bezel scrolls it.
 */
class MainActivity : Activity() {
  private val handler = Handler(Looper.getMainLooper())
  private var snapshot: WearSnapshot? = null
  private var phoneStatus = PhoneStatus.APP_INSTALLED
  private var loaded = false
  private var confirmingId: String? = null
  private var markingId: String? = null

  private lateinit var scroll: ScrollView
  private lateinit var content: LinearLayout
  private lateinit var haptics: WearHaptics

  private val ticker = object : Runnable {
    override fun run() {
      render()
      handler.postDelayed(this, TICK_MS)
    }
  }

  private val dataListener = DataClient.OnDataChangedListener { events ->
    val changed = events.any {
      it.type == DataEvent.TYPE_CHANGED && it.dataItem.uri.path == WearDataLayer.SNAPSHOT_PATH
    }
    if (changed) reload()
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    haptics = WearHaptics(this)
    content = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      gravity = Gravity.CENTER_HORIZONTAL
    }
    roundSafePadding(content)
    scroll = ScrollView(this).apply {
      isFocusable = true
      isFocusableInTouchMode = true
      isVerticalScrollBarEnabled = true
      setBackgroundColor(WearColors.BACKGROUND)
      addView(content)
    }
    setContentView(scroll)
    render()
  }

  override fun onResume() {
    super.onResume()
    scroll.requestFocus()
    Wearable.getDataClient(this).addListener(dataListener)
    reload()
    handler.postDelayed(ticker, TICK_MS)
  }

  override fun onPause() {
    super.onPause()
    Wearable.getDataClient(this).removeListener(dataListener)
    handler.removeCallbacks(ticker)
  }

  private fun reload() {
    WearDataLayer.executor.execute {
      val next = WearDataLayer.readSnapshot(applicationContext)
      val status = if (next == null) WearDataLayer.phoneStatus(applicationContext) else PhoneStatus.APP_INSTALLED
      handler.post {
        snapshot = next
        phoneStatus = status
        loaded = true
        render()
      }
    }
  }

  private fun mark(prayerId: String) {
    val date = snapshot?.date?.ifEmpty { null } ?: WearDayResolver.localDate(System.currentTimeMillis())
    markingId = prayerId
    confirmingId = null
    haptics.tick()
    WearDataLayer.executor.execute {
      val outcome = WearDataLayer.sendMark(applicationContext, prayerId, date)
      WearRefresh.requestAll(applicationContext)
      handler.post {
        markingId = null
        if (outcome != MarkOutcome.FAILED) haptics.target()
        render()
      }
    }
  }

  private fun render() {
    content.removeAllViews()
    val snap = snapshot
    scroll.layoutDirection = if (snap?.isRtl == true) View.LAYOUT_DIRECTION_RTL else View.LAYOUT_DIRECTION_LTR
    if (!loaded) {
      content.addSpaced(label("…", 16f, WearColors.SECONDARY), topDp = 40f)
      return
    }
    if (snap == null) {
      message(
        getString(
          when (phoneStatus) {
            PhoneStatus.NOT_CONNECTED -> R.string.wear_connect_phone
            PhoneStatus.APP_MISSING -> R.string.wear_install_phone
            PhoneStatus.APP_INSTALLED -> R.string.wear_open_phone
          },
        ),
      )
      tasbeehEntry(null)
      content.addSpaced(label(getString(R.string.wear_tasbeeh_standalone), 12f, WearColors.SECONDARY).inset())
      return
    }

    val nowMs = System.currentTimeMillis()
    val today = WearDayResolver.localDate(nowMs)
    val day = WearDayResolver.resolve(snap, nowMs, WearMarks.pending(this, today))

    if (snap.hijriDate.isNotEmpty()) {
      val line = listOf(snap.weekday, snap.hijriDate).filter { it.isNotEmpty() }.joinToString(" · ")
      content.addSpaced(label(line, 12f, WearColors.SECONDARY), topDp = 0f)
    }

    when {
      snap.locationDenied -> message(snap.str("setLocationHint", "Open the app to set your location"))
      day.stale -> message(snap.str("staleData", "Open the app to refresh today's times"))
      else -> hero(snap, day, nowMs)
    }

    val outcome = WearMarks.outcomeLabel(snap, WearMarks.recentOutcome(this, nowMs))
    if (outcome.isNotEmpty()) content.addSpaced(label(outcome, 12f, WearColors.SECONDARY).inset())

    if (!snap.locationDenied && !day.stale && day.rows.isNotEmpty()) {
      content.addSpaced(label(snap.str("today", "Today"), 13f, WearColors.SECONDARY, bold = true), topDp = 14f)
      day.rows.forEach { content.addSpaced(row(snap, it), topDp = 4f) }
    }

    tasbeehEntry(snap)
    overview(snap)
  }

  private fun hero(snap: WearSnapshot, day: DayState, nowMs: Long) {
    val ring = RingView(this).apply {
      progress = day.progress
      color = if (day.allDone) WearColors.SUCCESS else WearColors.ACCENT
    }
    val center = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      gravity = Gravity.CENTER
    }
    val markable = day.markable
    if (markable != null) {
      center.addView(label(markable.row.name, 22f, WearColors.TEXT, bold = true))
      center.addView(label(markable.row.time, 13f, WearColors.SECONDARY))
    } else if (day.nextName.isNotEmpty()) {
      center.addView(label(snap.nextTitle.ifEmpty { getString(R.string.wear_next_salah) }, 12f, WearColors.SECONDARY))
      center.addView(label(day.nextName, 22f, WearColors.TEXT, bold = true))
      center.addView(label(day.nextTime, 13f, WearColors.SECONDARY))
      val until = WearDayResolver.relativeUntil(day.nextAtMs, nowMs, snap.locale)
      if (until.isNotEmpty()) center.addView(label(until, 12f, WearColors.ACCENT))
    } else if (day.allDone) {
      center.addView(label(snap.str("allDone", "All Salah done today"), 14f, WearColors.SUCCESS, bold = true))
    }
    center.addView(label("${day.completed}/${day.total}", 12f, WearColors.SECONDARY))
    center.setPadding(dpi(14f), 0, dpi(14f), 0)

    val frame = FrameLayout(this)
    val size = (resources.displayMetrics.widthPixels * 0.58f).toInt()
    frame.addView(ring, FrameLayout.LayoutParams(size, size, Gravity.CENTER))
    frame.addView(
      center,
      FrameLayout.LayoutParams(size, FrameLayout.LayoutParams.WRAP_CONTENT, Gravity.CENTER),
    )
    content.addSpaced(frame, topDp = 4f)

    if (markable != null) {
      val busy = markingId == markable.row.id
      content.addSpaced(
        pill(if (busy) "…" else snap.str("markSalah", "Mark Salah"), filled = true) {
          if (markingId == null) mark(markable.row.id)
        },
        topDp = 8f,
      )
      if (day.nextName.isNotEmpty()) {
        val title = snap.nextTitle.ifEmpty { getString(R.string.wear_next_salah) }
        content.addSpaced(label("$title · ${day.nextName} ${day.nextTime}", 12f, WearColors.SECONDARY))
      }
    }
  }

  private fun row(snap: WearSnapshot, state: RowState): View {
    val confirming = confirmingId == state.row.id
    val glyph = when {
      state.phase == RowPhase.COMPLETED -> "✓"
      state.phase == RowPhase.BEGUN_PENDING -> "○"
      state.isNext -> "•"
      else -> " "
    }
    val rowView = LinearLayout(this).apply {
      orientation = LinearLayout.HORIZONTAL
      gravity = Gravity.CENTER_VERTICAL
      minimumHeight = dpi(48f)
      setPadding(dpi(10f), dpi(4f), dpi(10f), dpi(4f))
      contentDescription = "${state.row.name}, ${state.row.time}, ${state.row.statusLabel}"
    }
    val glyphColor = when {
      state.phase == RowPhase.COMPLETED -> WearColors.SUCCESS
      state.phase == RowPhase.BEGUN_PENDING -> WearColors.WARNING
      else -> WearColors.ACCENT
    }
    rowView.addView(label(glyph, 14f, glyphColor), LinearLayout.LayoutParams(dpi(18f), LinearLayout.LayoutParams.WRAP_CONTENT))
    val name = label(
      if (confirming) snap.str("markConfirm", "Mark as prayed?") else state.row.name,
      14f,
      if (state.phase == RowPhase.UPCOMING && !state.isNext) WearColors.SECONDARY else WearColors.TEXT,
      bold = confirming,
    ).apply {
      gravity = Gravity.START or Gravity.CENTER_VERTICAL
      textAlignment = View.TEXT_ALIGNMENT_VIEW_START
    }
    rowView.addView(name, LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f))
    if (!confirming) rowView.addView(label(state.row.time, 13f, WearColors.SECONDARY))

    if (state.phase == RowPhase.BEGUN_PENDING) {
      rowView.background = GradientDrawable().apply {
        cornerRadius = dpPx(20f)
        setColor(if (confirming) WearColors.ACCENT_DARK else 0x22FFFFFF)
        if (confirming) setStroke(dpi(1f), WearColors.ACCENT)
      }
      rowView.isClickable = true
      rowView.setOnClickListener {
        if (confirmingId == state.row.id) {
          mark(state.row.id)
        } else {
          // First tap asks; a second tap within a few seconds marks.
          confirmingId = state.row.id
          haptics.tick()
          render()
          handler.postDelayed({
            if (confirmingId == state.row.id) {
              confirmingId = null
              render()
            }
          }, CONFIRM_MS)
        }
      }
    } else if (state.phase == RowPhase.UPCOMING) {
      rowView.setOnClickListener {
        android.widget.Toast.makeText(this, snap.str("notYet", "Not time yet"), android.widget.Toast.LENGTH_SHORT).show()
      }
    }
    return rowView
  }

  private fun tasbeehEntry(snap: WearSnapshot?) {
    val label = snap?.str("tasbeeh", getString(R.string.wear_tasbeeh)) ?: getString(R.string.wear_tasbeeh)
    content.addSpaced(
      pill("$label · ${WearTasbeehStore.count(this)}", filled = false) {
        startActivity(Intent(this, TasbeehActivity::class.java))
      },
      topDp = 14f,
    )
  }

  private fun overview(snap: WearSnapshot) {
    val lines = buildList {
      if (snap.streakSummary.isNotEmpty() && snap.streakDays > 0) {
        add(listOf(snap.streakTitle, snap.streakSummary).filter { it.isNotEmpty() }.joinToString(": "))
      }
      if (snap.qazaRemaining > 0 && snap.qazaRemainingLabel.isNotEmpty()) {
        add(listOf(snap.qazaTitle, snap.qazaRemainingLabel).filter { it.isNotEmpty() }.joinToString(": "))
      }
    }
    if (lines.isEmpty()) return
    content.addSpaced(label(snap.str("overview", "Overview"), 13f, WearColors.SECONDARY, bold = true), topDp = 14f)
    lines.forEach { content.addSpaced(label(it, 13f, WearColors.TEXT), topDp = 2f) }
  }

  private fun message(text: String) {
    content.addSpaced(label(text, 14f, WearColors.TEXT).inset(), topDp = 16f)
  }

  /** Extra side room for wrapped text that may sit on the narrow top / bottom of a round screen. */
  private fun android.widget.TextView.inset(): android.widget.TextView = apply {
    setPadding(dpi(10f), 0, dpi(10f), 0)
  }

  companion object {
    private const val TICK_MS = 30_000L
    private const val CONFIRM_MS = 4_000L
  }
}
