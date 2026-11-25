package expo.modules.munibwear

import androidx.wear.protolayout.ActionBuilders
import app.munibtracker.wear.R
import androidx.wear.protolayout.DeviceParametersBuilders.DeviceParameters
import androidx.wear.protolayout.DimensionBuilders.dp
import androidx.wear.protolayout.DimensionBuilders.expand
import androidx.wear.protolayout.LayoutElementBuilders
import androidx.wear.protolayout.ModifiersBuilders
import androidx.wear.protolayout.TimelineBuilders
import androidx.wear.protolayout.material.ChipColors
import androidx.wear.protolayout.material.CircularProgressIndicator
import androidx.wear.protolayout.material.CompactChip
import androidx.wear.protolayout.material.ProgressIndicatorColors
import androidx.wear.protolayout.material.Text
import androidx.wear.protolayout.material.Typography
import androidx.wear.protolayout.material.layouts.EdgeContentLayout
import androidx.wear.tiles.RequestBuilders
import androidx.wear.tiles.TileBuilders
import androidx.wear.tiles.TileService
import com.google.common.util.concurrent.Futures
import com.google.common.util.concurrent.ListenableFuture
import java.util.concurrent.Callable

/** First tap on a tile's Mark chip: `mark:<prayerId>:<renderMs>` (shared with the Today tile). */
internal const val CLICK_MARK_PREFIX = "mark:"
/** Second, confirming tap: `confirm:<prayerId>:<renderMs>`. */
internal const val CLICK_CONFIRM_PREFIX = "confirm:"
/**
 * Safety refresh only: the timeline already switches at every Adhan, midnight and when a
 * "Confirm" or "Marked ✓" lapses, and a new phone snapshot or a mark re-requests the tile
 * (N-27: a handful of builds a day instead of one every 15 minutes).
 */
internal const val FRESHNESS_MS = 6L * 60L * 60L * 1000L

/** Mark / confirm click id; the render time makes each rendered chip's id unique. */
internal fun markClickId(prefix: String, prayerId: String, renderMs: Long) = "$prefix$prayerId:$renderMs"

private fun clickPrayerId(clickId: String, prefix: String): String =
  clickId.removePrefix(prefix).substringBefore(':')

/**
 * Applies a tile tap on Mark. Marking takes two deliberate taps on the Mark chip (the tile body
 * only opens the app, E-37): the first asks "Mark as prayed?" and turns the chip into Confirm
 * for [WearMarks.ARM_MS]; the second sends the mark through the durable queue. Idempotent: a
 * re-delivered click id is ignored, and a Salah already marked (or not begun) is never sent.
 */
internal fun handleMarkClick(
  service: TileService,
  clickId: String,
  snapshot: WearSnapshot?,
  nowMs: Long,
): WearSnapshot? {
  if (snapshot == null) return snapshot
  val isMark = clickId.startsWith(CLICK_MARK_PREFIX)
  val isConfirm = clickId.startsWith(CLICK_CONFIRM_PREFIX)
  if (!isMark && !isConfirm) return snapshot
  if (!WearMarks.consumeClick(service, clickId)) return snapshot
  val prayerId = clickPrayerId(clickId, if (isMark) CLICK_MARK_PREFIX else CLICK_CONFIRM_PREFIX)
  val today = WearDayResolver.localDate(nowMs)
  val day = WearDayResolver.resolve(snapshot, nowMs, WearMarks.pending(service, today))
  if (!day.isMarkable(prayerId)) {
    WearMarks.disarm(service)
    return snapshot
  }
  if (isMark) {
    WearMarks.arm(service, prayerId, nowMs)
  } else if (WearMarks.armed(service, nowMs)?.first == prayerId) {
    WearMarks.disarm(service)
    WearDataLayer.sendMark(service, prayerId, snapshot.date.ifEmpty { today })
    WearRefresh.requestAll(service)
  }
  return snapshot
}

/**
 * Splits now → each upcoming boundary into tile timeline entries built by [layoutAt], with
 * contiguous validity. [extra] adds local boundaries (a lapsing Confirm or "Marked ✓").
 */
internal fun timelineFor(
  snapshot: WearSnapshot?,
  nowMs: Long,
  extra: List<Long> = emptyList(),
  layoutAt: (Long) -> LayoutElementBuilders.LayoutElement,
): TimelineBuilders.Timeline {
  val timeline = TimelineBuilders.Timeline.Builder()
  val adhan = if (snapshot != null) WearDayResolver.boundaries(snapshot, nowMs).take(6) else emptyList()
  val bounds = (adhan + extra.filter { it > nowMs }).distinct().sorted()
  val starts = listOf(nowMs) + bounds
  starts.forEachIndexed { index, entryStart ->
    // The first entry is valid from the start of time so it shows immediately.
    val validity = TimelineBuilders.TimeInterval.Builder().setStartMillis(if (index == 0) 0L else entryStart)
    starts.getOrNull(index + 1)?.let { validity.setEndMillis(it) }
    timeline.addTimelineEntry(
      TimelineBuilders.TimelineEntry.Builder()
        .setValidity(validity.build())
        .setLayout(LayoutElementBuilders.Layout.Builder().setRoot(layoutAt(entryStart)).build())
        .build(),
    )
  }
  return timeline.build()
}

internal fun tileText(
  service: TileService,
  text: String,
  typography: Int,
  color: Int = WearColors.TEXT,
  maxLines: Int = 1,
): LayoutElementBuilders.LayoutElement =
  Text.Builder(service, text)
    .setTypography(typography)
    .setColor(androidx.wear.protolayout.ColorBuilders.argb(color))
    .setMaxLines(maxLines)
    .build()

/** What the mark-related parts of a tile show at one timeline instant. */
internal data class MarkUi(
  /** Salah awaiting the confirming tap, or null. */
  val armedId: String?,
  /** Footer about delivery ("Will sync…", "Marked ✓"), or "". */
  val footer: String,
)

/** Mark state for the entry starting at [at]; [armedUntil] / [outcomeUntil] end it. */
internal fun markUiAt(
  service: TileService,
  snapshot: WearSnapshot?,
  at: Long,
  armed: Pair<String, Long>?,
  outcome: MarkOutcome?,
  outcomeUntil: Long?,
): MarkUi {
  val armedId = armed?.takeIf { at < it.second }?.first
  // QUEUED / SENT persist until the phone confirms (a refresh follows); CONFIRMED lapses.
  val showOutcome = when (outcome) {
    null, MarkOutcome.FAILED -> false
    MarkOutcome.CONFIRMED -> outcomeUntil != null && at < outcomeUntil
    else -> true
  }
  return MarkUi(armedId, if (showOutcome) WearMarks.outcomeLabel(service, snapshot, outcome) else "")
}

/**
 * Next Salah tile: today's progress ring, the next Salah, and for the current unmarked Salah a
 * separate Mark chip (two taps: Mark, then Confirm). The tile body only opens the app.
 */
class MunibWearTileService : TileService() {
  override fun onTileRequest(requestParams: RequestBuilders.TileRequest): ListenableFuture<TileBuilders.Tile> =
    Futures.submit(Callable { buildTile(requestParams) }, WearDataLayer.executor)

  private fun buildTile(requestParams: RequestBuilders.TileRequest): TileBuilders.Tile {
    val nowMs = System.currentTimeMillis()
    WearDataLayer.syncMarks(applicationContext)
    val snapshot = handleMarkClick(
      this,
      requestParams.currentState.lastClickableId,
      WearDataLayer.readSnapshot(applicationContext),
      nowMs,
    )
    val device = requestParams.deviceConfiguration
    val armed = WearMarks.armed(this, nowMs)
    val outcome = WearMarks.recentOutcome(this, nowMs)
    val outcomeUntil = WearMarks.outcomeChangesAt(this, nowMs)

    return TileBuilders.Tile.Builder()
      .setResourcesVersion("1")
      .setFreshnessIntervalMillis(FRESHNESS_MS)
      .setTileTimeline(
        timelineFor(snapshot, nowMs, listOfNotNull(armed?.second, outcomeUntil)) { at ->
          layout(device, snapshot, at, markUiAt(this, snapshot, at, armed, outcome, outcomeUntil), nowMs)
        },
      )
      .build()
  }

  private fun layout(
    device: DeviceParameters,
    snapshot: WearSnapshot?,
    at: Long,
    mark: MarkUi,
    renderMs: Long,
  ): LayoutElementBuilders.LayoutElement {
    val openApp = clickable("open", launchMain(this))

    val message = when {
      snapshot == null -> getString(R.string.wear_open_phone)
      snapshot.locationDenied -> snapshot.str("setLocationHint", "Open the app to set your location")
      else -> null
    }
    if (snapshot == null || message != null) {
      return EdgeContentLayout.Builder(device)
        // Never an empty description: the unpaired fallback with "" failed to inflate on the
        // Wear OS 4 renderer (tile showed only the app icon). The message doubles as the label.
        .setEdgeContent(progressRing(0f, message ?: getString(R.string.wear_open_phone)))
        .setContent(openArea(openApp, message ?: "", tileText(this, message ?: "", Typography.TYPOGRAPHY_BODY1, WearColors.SECONDARY, 3)))
        .build()
    }

    val today = WearDayResolver.localDate(at)
    val day = WearDayResolver.resolve(snapshot, at, WearMarks.pending(this, today))
    val ring = progressRing(day.progress, "${day.completed}/${day.total}")

    if (day.stale) {
      val stale = snapshot.str("staleData", "Open the app to refresh today's times")
      return EdgeContentLayout.Builder(device)
        .setEdgeContent(ring)
        .setContent(openArea(openApp, stale, tileText(this, stale, Typography.TYPOGRAPHY_BODY1, WearColors.SECONDARY, 3)))
        .build()
    }

    // The body (name / time) opens the app; the Mark chip below is a sibling, never nested.
    val info = LayoutElementBuilders.Column.Builder()
      .setHorizontalAlignment(LayoutElementBuilders.HORIZONTAL_ALIGN_CENTER)
    val markable = day.markable
    val armed = markable != null && mark.armedId == markable.row.id
    val description: String
    if (markable != null) {
      // The current Salah is due and unmarked: lead with it and offer Mark.
      info.addContent(tileText(this, markable.row.name, Typography.TYPOGRAPHY_TITLE1))
      val second = if (armed) snapshot.str("markConfirm", getString(R.string.wear_mark_confirm)) else markable.row.time
      info.addContent(tileText(this, second, Typography.TYPOGRAPHY_BODY2, if (armed) WearColors.TEXT else WearColors.SECONDARY, 2))
      description = "${markable.row.name}, ${markable.row.time}, ${markable.row.statusLabel}"
    } else if (day.allDone && day.nextName.isEmpty()) {
      val allDone = snapshot.str("allDone", "All Salah done today")
      info.addContent(tileText(this, allDone, Typography.TYPOGRAPHY_TITLE3, WearColors.SUCCESS, 2))
      description = allDone
    } else {
      val title = snapshot.nextTitle.ifEmpty { getString(R.string.wear_next_salah) }
      info.addContent(tileText(this, title, Typography.TYPOGRAPHY_CAPTION1, WearColors.SECONDARY))
      info.addContent(tileText(this, day.nextName.ifEmpty { "—" }, Typography.TYPOGRAPHY_DISPLAY3))
      info.addContent(tileText(this, day.nextTime, Typography.TYPOGRAPHY_TITLE3, WearColors.SECONDARY))
      description = "$title, ${day.nextName}, ${day.nextTime}"
    }

    val content = LayoutElementBuilders.Column.Builder()
      .setHorizontalAlignment(LayoutElementBuilders.HORIZONTAL_ALIGN_CENTER)
      .addContent(openArea(openApp, description, info.build()))
    if (markable != null) {
      content.addContent(LayoutElementBuilders.Spacer.Builder().setHeight(dp(6f)).build())
      content.addContent(markChip(this, snapshot, markable.row, device, armed, renderMs))
    }

    val builder = EdgeContentLayout.Builder(device)
      .setEdgeContent(ring)
      .setPrimaryLabelTextContent(
        tileText(this, snapshot.hijriDate.ifEmpty { "${day.completed}/${day.total}" }, Typography.TYPOGRAPHY_CAPTION2, WearColors.SECONDARY),
      )
      .setContent(content.build())
    val footer = when {
      mark.footer.isNotEmpty() -> mark.footer
      // Short: the secondary label sits on the narrow bottom of a round screen.
      markable != null && day.nextName.isNotEmpty() -> "${day.nextName} · ${day.nextTime}"
      day.allDone -> snapshot.str("allDone", "All Salah done today")
      else -> ""
    }
    if (footer.isNotEmpty()) {
      builder.setSecondaryLabelTextContent(tileText(this, footer, Typography.TYPOGRAPHY_CAPTION2, WearColors.SECONDARY, 2))
    }
    return builder.build()
  }

  private fun progressRing(progress: Float, description: String): LayoutElementBuilders.LayoutElement =
    CircularProgressIndicator.Builder()
      .setProgress(progress)
      .setCircularProgressIndicatorColors(ProgressIndicatorColors(WearColors.ACCENT, WearColors.TRACK))
      .setContentDescription(description)
      .build()
}

/** The tile body: opens the app, read by TalkBack as [description] + "Open Munib Tracker". */
internal fun TileService.openArea(
  openApp: ModifiersBuilders.Clickable,
  description: String,
  content: LayoutElementBuilders.LayoutElement,
): LayoutElementBuilders.LayoutElement =
  LayoutElementBuilders.Box.Builder()
    .setWidth(expand())
    .setModifiers(
      ModifiersBuilders.Modifiers.Builder()
        .setClickable(openApp)
        .setSemantics(
          ModifiersBuilders.Semantics.Builder()
            .setContentDescription(listOf(description, getString(R.string.wear_open_app)).filter { it.isNotEmpty() }.joinToString(", "))
            .build(),
        )
        .build(),
    )
    .addContent(content)
    .build()

/** A tile clickable with the 48 dp minimum touch target (Wear quality WO-V2). */
internal fun clickable(id: String, action: ActionBuilders.Action = ActionBuilders.LoadAction.Builder().build()): ModifiersBuilders.Clickable =
  ModifiersBuilders.Clickable.Builder()
    .setId(id)
    .setOnClick(action)
    .setMinimumClickableWidth(dp(48f))
    .setMinimumClickableHeight(dp(48f))
    .build()

/**
 * Mark chip for the current Salah (shared by the Next Salah and Today tiles): "Mark Salah",
 * or "Confirm" while [armed]. Ids carry [renderMs] so a re-delivered click can't repeat.
 */
internal fun markChip(
  service: TileService,
  snapshot: WearSnapshot,
  row: WearRow,
  device: DeviceParameters,
  armed: Boolean,
  renderMs: Long,
): LayoutElementBuilders.LayoutElement {
  val label = if (armed) service.getString(R.string.wear_confirm) else snapshot.str("markSalah", "Mark Salah")
  val id = markClickId(if (armed) CLICK_CONFIRM_PREFIX else CLICK_MARK_PREFIX, row.id, renderMs)
  return CompactChip.Builder(service, label, clickable(id), device)
    .setChipColors(
      if (armed) {
        ChipColors(WearColors.SUCCESS, WearColors.BACKGROUND)
      } else {
        ChipColors(WearColors.ACCENT, WearColors.BACKGROUND)
      },
    )
    .build()
}

/** Opens [MainActivity] (tiles start activities through a LaunchAction). */
internal fun launchMain(service: TileService): ActionBuilders.Action =
  launchActivity(service, MainActivity::class.java.name)

internal fun launchActivity(service: TileService, className: String): ActionBuilders.Action =
  ActionBuilders.LaunchAction.Builder()
    .setAndroidActivity(
      ActionBuilders.AndroidActivity.Builder()
        .setPackageName(service.packageName)
        .setClassName(className)
        .build(),
    )
    .build()
