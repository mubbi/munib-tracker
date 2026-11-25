package expo.modules.munibwear

import androidx.wear.protolayout.ActionBuilders
import app.munibtracker.wear.R
import androidx.wear.protolayout.DeviceParametersBuilders.DeviceParameters
import androidx.wear.protolayout.DimensionBuilders.dp
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

/** Clickable id for marking a Salah: `mark:<prayerId>` (shared with the Today tile). */
internal const val CLICK_MARK_PREFIX = "mark:"
/** Re-request the tile at least this often so the next Salah doesn't go stale. */
internal const val FRESHNESS_MS = 15L * 60L * 1000L

/**
 * Applies a tile tap that marks a Salah. Idempotent: a Salah already marked
 * (or not begun yet) is never sent again, so a re-delivered click id is harmless.
 */
internal fun handleMarkClick(
  service: TileService,
  clickId: String,
  snapshot: WearSnapshot?,
  nowMs: Long,
): WearSnapshot? {
  if (!clickId.startsWith(CLICK_MARK_PREFIX) || snapshot == null) return snapshot
  val prayerId = clickId.removePrefix(CLICK_MARK_PREFIX)
  val today = WearDayResolver.localDate(nowMs)
  val day = WearDayResolver.resolve(snapshot, nowMs, WearMarks.pending(service, today))
  if (day.isMarkable(prayerId)) {
    WearDataLayer.sendMark(service, prayerId, snapshot.date.ifEmpty { today })
    WearRefresh.requestAll(service)
  }
  return snapshot
}

/** Splits now → each upcoming boundary into tile timeline entries built by [layoutAt]. */
internal fun timelineFor(
  snapshot: WearSnapshot?,
  nowMs: Long,
  layoutAt: (Long) -> LayoutElementBuilders.LayoutElement,
): TimelineBuilders.Timeline {
  val timeline = TimelineBuilders.Timeline.Builder()
  val bounds = if (snapshot != null) WearDayResolver.boundaries(snapshot, nowMs).take(6) else emptyList()
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

/** Next Salah tile: today's progress ring, the next Salah, and a Mark chip for the current one. */
class MunibWearTileService : TileService() {
  override fun onTileRequest(requestParams: RequestBuilders.TileRequest): ListenableFuture<TileBuilders.Tile> =
    Futures.submit(Callable { buildTile(requestParams) }, WearDataLayer.executor)

  private fun buildTile(requestParams: RequestBuilders.TileRequest): TileBuilders.Tile {
    val nowMs = System.currentTimeMillis()
    val snapshot = handleMarkClick(
      this,
      requestParams.currentState.lastClickableId,
      WearDataLayer.readSnapshot(applicationContext),
      nowMs,
    )
    val device = requestParams.deviceConfiguration
    val outcome = WearMarks.recentOutcome(this, nowMs)

    return TileBuilders.Tile.Builder()
      .setResourcesVersion("1")
      .setFreshnessIntervalMillis(FRESHNESS_MS)
      .setTileTimeline(
        timelineFor(snapshot, nowMs) { at ->
          layout(device, snapshot, at, if (at == nowMs) outcome else null)
        },
      )
      .build()
  }

  private fun layout(
    device: DeviceParameters,
    snapshot: WearSnapshot?,
    nowMs: Long,
    outcome: MarkOutcome?,
  ): LayoutElementBuilders.LayoutElement {
    val openApp = clickable("open", launchMain(this))

    val message = when {
      snapshot == null -> getString(R.string.wear_open_phone)
      snapshot.locationDenied -> snapshot.str("setLocationHint", "Open the app to set your location")
      else -> null
    }
    if (snapshot == null || message != null) {
      return EdgeContentLayout.Builder(device)
        .setEdgeContent(progressRing(0f, ""))
        .setContent(
          LayoutElementBuilders.Box.Builder()
            .setModifiers(ModifiersBuilders.Modifiers.Builder().setClickable(openApp).build())
            .addContent(tileText(this, message ?: "", Typography.TYPOGRAPHY_BODY1, WearColors.SECONDARY, 3))
            .build(),
        )
        .build()
    }

    val today = WearDayResolver.localDate(nowMs)
    val day = WearDayResolver.resolve(snapshot, nowMs, WearMarks.pending(this, today))
    val ring = progressRing(day.progress, "${day.completed}/${day.total}")

    if (day.stale) {
      return EdgeContentLayout.Builder(device)
        .setEdgeContent(ring)
        .setContent(tileText(this, snapshot.str("staleData", "Open the app to refresh today's times"), Typography.TYPOGRAPHY_BODY1, WearColors.SECONDARY, 3))
        .build()
    }

    val content = LayoutElementBuilders.Column.Builder()
      .setHorizontalAlignment(LayoutElementBuilders.HORIZONTAL_ALIGN_CENTER)
      .setModifiers(ModifiersBuilders.Modifiers.Builder().setClickable(openApp).build())
    val markable = day.markable
    if (markable != null) {
      // The current Salah is due and unmarked: lead with it and offer Mark.
      content.addContent(tileText(this, markable.row.name, Typography.TYPOGRAPHY_TITLE1))
      content.addContent(tileText(this, markable.row.time, Typography.TYPOGRAPHY_BODY2, WearColors.SECONDARY))
      content.addContent(LayoutElementBuilders.Spacer.Builder().setHeight(dp(6f)).build())
      content.addContent(markChip(this, snapshot, markable.row, device))
    } else if (day.allDone && day.nextName.isEmpty()) {
      content.addContent(tileText(this, snapshot.str("allDone", "All Salah done today"), Typography.TYPOGRAPHY_TITLE3, WearColors.SUCCESS, 2))
    } else {
      content.addContent(tileText(this, snapshot.nextTitle.ifEmpty { getString(R.string.wear_next_salah) }, Typography.TYPOGRAPHY_CAPTION1, WearColors.SECONDARY))
      content.addContent(tileText(this, day.nextName.ifEmpty { "—" }, Typography.TYPOGRAPHY_DISPLAY3))
      content.addContent(tileText(this, day.nextTime, Typography.TYPOGRAPHY_TITLE3, WearColors.SECONDARY))
    }

    val builder = EdgeContentLayout.Builder(device)
      .setEdgeContent(ring)
      .setPrimaryLabelTextContent(
        tileText(this, snapshot.hijriDate.ifEmpty { "${day.completed}/${day.total}" }, Typography.TYPOGRAPHY_CAPTION2, WearColors.SECONDARY),
      )
      .setContent(content.build())
    val footer = when {
      outcome != null -> WearMarks.outcomeLabel(snapshot, outcome)
      // Short: the secondary label sits on the narrow bottom of a round screen.
      markable != null && day.nextName.isNotEmpty() -> "${day.nextName} · ${day.nextTime}"
      day.allDone -> snapshot.str("allDone", "All Salah done today")
      else -> ""
    }
    if (footer.isNotEmpty()) {
      builder.setSecondaryLabelTextContent(tileText(this, footer, Typography.TYPOGRAPHY_CAPTION2, WearColors.SECONDARY))
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

/** A tile clickable with the 48 dp minimum touch target (Wear quality WO-V2). */
internal fun clickable(id: String, action: ActionBuilders.Action = ActionBuilders.LoadAction.Builder().build()): ModifiersBuilders.Clickable =
  ModifiersBuilders.Clickable.Builder()
    .setId(id)
    .setOnClick(action)
    .setMinimumClickableWidth(dp(48f))
    .setMinimumClickableHeight(dp(48f))
    .build()

/** Mark chip for the current Salah (shared by the Next Salah and Today tiles). */
internal fun markChip(
  service: TileService,
  snapshot: WearSnapshot,
  row: WearRow,
  device: DeviceParameters,
): LayoutElementBuilders.LayoutElement =
  CompactChip.Builder(
    service,
    snapshot.str("markSalah", "Mark Salah"),
    clickable("$CLICK_MARK_PREFIX${row.id}"),
    device,
  )
    .setChipColors(ChipColors(WearColors.ACCENT, WearColors.BACKGROUND))
    .build()

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
