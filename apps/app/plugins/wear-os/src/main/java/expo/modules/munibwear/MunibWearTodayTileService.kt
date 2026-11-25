package expo.modules.munibwear

import androidx.wear.protolayout.ColorBuilders.argb
import androidx.wear.protolayout.DeviceParametersBuilders.DeviceParameters
import androidx.wear.protolayout.DimensionBuilders.dp
import androidx.wear.protolayout.DimensionBuilders.expand
import androidx.wear.protolayout.DimensionBuilders.weight
import androidx.wear.protolayout.LayoutElementBuilders
import androidx.wear.protolayout.ModifiersBuilders
import androidx.wear.protolayout.material.Typography
import androidx.wear.tiles.RequestBuilders
import androidx.wear.tiles.TileBuilders
import androidx.wear.tiles.TileService
import app.munibtracker.wear.R
import com.google.common.util.concurrent.Futures
import com.google.common.util.concurrent.ListenableFuture
import java.util.concurrent.Callable

/**
 * Today tile: the five obligatory Salah with their times and status, and a separate Mark
 * chip for the current Salah while it is unmarked (two taps: Mark, then Confirm). A future
 * Salah is never markable; the list itself opens the app (where any begun row can be marked).
 */
class MunibWearTodayTileService : TileService() {
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
    val armed = WearMarks.armed(this, nowMs)
    val outcome = WearMarks.recentOutcome(this, nowMs)
    val outcomeUntil = WearMarks.outcomeChangesAt(this, nowMs)
    val device = requestParams.deviceConfiguration

    return TileBuilders.Tile.Builder()
      .setResourcesVersion("1")
      .setFreshnessIntervalMillis(FRESHNESS_MS)
      .setTileTimeline(
        timelineFor(snapshot, nowMs, listOfNotNull(armed?.second, outcomeUntil)) { at ->
          layout(snapshot, at, markUiAt(this, snapshot, at, armed, outcome, outcomeUntil), device, nowMs)
        },
      )
      .build()
  }

  private fun layout(
    snapshot: WearSnapshot?,
    nowMs: Long,
    mark: MarkUi,
    device: DeviceParameters,
    renderMs: Long,
  ): LayoutElementBuilders.LayoutElement {
    // Round screens: keep rows inside the inscribed square.
    val side = (device.screenWidthDp * 0.15f).coerceAtLeast(12f)
    val column = LayoutElementBuilders.Column.Builder()
      .setWidth(expand())
      .setHorizontalAlignment(LayoutElementBuilders.HORIZONTAL_ALIGN_CENTER)
      .setModifiers(
        ModifiersBuilders.Modifiers.Builder()
          .setPadding(ModifiersBuilders.Padding.Builder().setStart(dp(side)).setEnd(dp(side)).build())
          .build(),
      )

    val message = when {
      snapshot == null -> getString(R.string.wear_open_phone)
      snapshot.locationDenied -> snapshot.str("setLocationHint", "Open the app to set your location")
      snapshot.rows.isEmpty() -> snapshot.str("openAppToSync", "Open the app to sync")
      else -> null
    }
    val title = snapshot?.str("today", getString(R.string.wear_today)) ?: getString(R.string.wear_today)
    if (snapshot == null || message != null) {
      column.addContent(tileText(this, title, Typography.TYPOGRAPHY_CAPTION1, WearColors.SECONDARY))
      column.addContent(tileText(this, message ?: "", Typography.TYPOGRAPHY_BODY2, WearColors.TEXT, 3))
      return root(openArea(clickable("open", launchMain(this)), "$title, ${message ?: ""}", column.build()))
    }

    val today = WearDayResolver.localDate(nowMs)
    val day = WearDayResolver.resolve(snapshot, nowMs, WearMarks.pending(this, today))
    val heading = "$title · ${day.completed}/${day.total}"
    val list = LayoutElementBuilders.Column.Builder()
      .setWidth(expand())
      .setHorizontalAlignment(LayoutElementBuilders.HORIZONTAL_ALIGN_CENTER)
      .addContent(tileText(this, heading, Typography.TYPOGRAPHY_CAPTION1, WearColors.SECONDARY))
      .addContent(LayoutElementBuilders.Spacer.Builder().setHeight(dp(4f)).build())
    val openApp = clickable("open", launchMain(this))
    if (day.stale) {
      list.addContent(tileText(this, snapshot.str("staleData", "Open the app to refresh today's times"), Typography.TYPOGRAPHY_BODY2, WearColors.TEXT, 3))
      column.addContent(openArea(openApp, heading, list.build()))
      return root(column.build())
    }
    day.rows.forEach { list.addContent(row(it)) }
    // The list opens the app; the Mark chip is a sibling below it, never nested in it.
    // One TalkBack stop for the list (it is one clickable): the heading, then every row.
    val rowsDescription = day.rows.joinToString("; ") { "${it.row.name}, ${it.row.time}, ${it.row.statusLabel}" }
    column.addContent(openArea(openApp, "$heading; $rowsDescription", list.build()))
    // Rows are too short for 48 dp targets: the current Salah gets a Mark chip and
    // an earlier unmarked one is marked from the app (tap the list).
    val armed = day.markable != null && mark.armedId == day.markable.row.id
    day.markable?.let {
      column.addContent(LayoutElementBuilders.Spacer.Builder().setHeight(dp(4f)).build())
      column.addContent(markChip(this, snapshot, it.row, device, armed, renderMs))
    }
    // While Confirm is up, its question takes the footer line (same height on small screens).
    val footer = if (armed) snapshot.str("markConfirm", getString(R.string.wear_mark_confirm)) else mark.footer
    if (footer.isNotEmpty()) {
      column.addContent(LayoutElementBuilders.Spacer.Builder().setHeight(dp(2f)).build())
      column.addContent(tileText(this, footer, Typography.TYPOGRAPHY_CAPTION2, if (armed) WearColors.TEXT else WearColors.SECONDARY, 2))
    }
    return root(column.build())
  }

  private fun row(state: RowState): LayoutElementBuilders.LayoutElement {
    val (glyph, glyphColor) = when {
      state.phase == RowPhase.COMPLETED -> "✓" to WearColors.SUCCESS
      state.phase == RowPhase.BEGUN_PENDING -> "○" to WearColors.WARNING
      state.isNext -> "•" to WearColors.ACCENT
      else -> "" to WearColors.SECONDARY
    }
    val nameColor = if (state.phase == RowPhase.UPCOMING && !state.isNext) WearColors.SECONDARY else WearColors.TEXT
    val modifiers = ModifiersBuilders.Modifiers.Builder()
      .setPadding(ModifiersBuilders.Padding.Builder().setTop(dp(1f)).setBottom(dp(1f)).build())
      .setSemantics(
        ModifiersBuilders.Semantics.Builder()
          .setContentDescription("${state.row.name}, ${state.row.time}, ${state.row.statusLabel}")
          .build(),
      )
    if (state.phase == RowPhase.BEGUN_PENDING) {
      modifiers.setBackground(
        ModifiersBuilders.Background.Builder()
          .setColor(argb(WearColors.ACCENT_DARK))
          .setCorner(ModifiersBuilders.Corner.Builder().setRadius(dp(10f)).build())
          .build(),
      )
    }
    return LayoutElementBuilders.Row.Builder()
      .setWidth(expand())
      .setVerticalAlignment(LayoutElementBuilders.VERTICAL_ALIGN_CENTER)
      .setModifiers(modifiers.build())
      .addContent(
        LayoutElementBuilders.Box.Builder()
          .setWidth(dp(16f))
          .addContent(tileText(this, glyph, Typography.TYPOGRAPHY_CAPTION1, glyphColor))
          .build(),
      )
      .addContent(
        LayoutElementBuilders.Box.Builder()
          .setWidth(weight(1f))
          .setHorizontalAlignment(LayoutElementBuilders.HORIZONTAL_ALIGN_START)
          .addContent(tileText(this, state.row.name, Typography.TYPOGRAPHY_CAPTION1, nameColor))
          .build(),
      )
      .addContent(tileText(this, state.row.time, Typography.TYPOGRAPHY_CAPTION1, WearColors.SECONDARY))
      .build()
  }

  /** Not clickable itself: the list opens the app, the Mark chip marks. */
  private fun root(content: LayoutElementBuilders.LayoutElement): LayoutElementBuilders.LayoutElement =
    LayoutElementBuilders.Box.Builder()
      .setWidth(expand())
      .setHeight(expand())
      .setVerticalAlignment(LayoutElementBuilders.VERTICAL_ALIGN_CENTER)
      .addContent(content)
      .build()
}
