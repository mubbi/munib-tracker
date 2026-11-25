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
 * Today tile: the five obligatory Salah with their times and status, and a Mark
 * chip for the current Salah while it is unmarked. A future Salah is never
 * markable; tapping elsewhere opens the app (where any begun row can be marked).
 */
class MunibWearTodayTileService : TileService() {
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
    val outcome = WearMarks.recentOutcome(this, nowMs)
    val device = requestParams.deviceConfiguration

    return TileBuilders.Tile.Builder()
      .setResourcesVersion("1")
      .setFreshnessIntervalMillis(FRESHNESS_MS)
      .setTileTimeline(
        timelineFor(snapshot, nowMs) { at ->
          layout(snapshot, at, if (at == nowMs) outcome else null, device)
        },
      )
      .build()
  }

  private fun layout(
    snapshot: WearSnapshot?,
    nowMs: Long,
    outcome: MarkOutcome?,
    device: DeviceParameters,
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
      return root(column.build())
    }

    val today = WearDayResolver.localDate(nowMs)
    val day = WearDayResolver.resolve(snapshot, nowMs, WearMarks.pending(this, today))
    column.addContent(
      tileText(this, "$title · ${day.completed}/${day.total}", Typography.TYPOGRAPHY_CAPTION1, WearColors.SECONDARY),
    )
    column.addContent(LayoutElementBuilders.Spacer.Builder().setHeight(dp(4f)).build())
    if (day.stale) {
      column.addContent(tileText(this, snapshot.str("staleData", "Open the app to refresh today's times"), Typography.TYPOGRAPHY_BODY2, WearColors.TEXT, 3))
      return root(column.build())
    }
    day.rows.forEach { column.addContent(row(it)) }
    // Rows are too short for 48 dp targets: the current Salah gets a Mark chip and
    // an earlier unmarked one is marked from the app (tap the tile).
    day.markable?.let {
      column.addContent(LayoutElementBuilders.Spacer.Builder().setHeight(dp(4f)).build())
      column.addContent(markChip(this, snapshot, it.row, device))
    }
    val footer = WearMarks.outcomeLabel(snapshot, outcome)
    if (footer.isNotEmpty()) {
      column.addContent(LayoutElementBuilders.Spacer.Builder().setHeight(dp(2f)).build())
      column.addContent(tileText(this, footer, Typography.TYPOGRAPHY_CAPTION2, WearColors.SECONDARY))
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

  private fun root(content: LayoutElementBuilders.LayoutElement): LayoutElementBuilders.LayoutElement =
    LayoutElementBuilders.Box.Builder()
      .setWidth(expand())
      .setHeight(expand())
      .setVerticalAlignment(LayoutElementBuilders.VERTICAL_ALIGN_CENTER)
      .setModifiers(
        ModifiersBuilders.Modifiers.Builder()
          .setClickable(clickable("open", launchMain(this)))
          .build(),
      )
      .addContent(content)
      .build()
}
