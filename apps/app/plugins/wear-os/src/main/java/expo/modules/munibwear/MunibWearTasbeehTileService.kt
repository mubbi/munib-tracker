package expo.modules.munibwear

import androidx.wear.protolayout.DimensionBuilders.dp
import androidx.wear.protolayout.LayoutElementBuilders
import androidx.wear.protolayout.ModifiersBuilders
import androidx.wear.protolayout.TimelineBuilders
import androidx.wear.protolayout.material.ChipColors
import androidx.wear.protolayout.material.CircularProgressIndicator
import androidx.wear.protolayout.material.CompactChip
import androidx.wear.protolayout.material.ProgressIndicatorColors
import androidx.wear.protolayout.material.Typography
import androidx.wear.protolayout.material.layouts.EdgeContentLayout
import androidx.wear.tiles.RequestBuilders
import androidx.wear.tiles.TileBuilders
import androidx.wear.tiles.TileService
import app.munibtracker.wear.R
import com.google.common.util.concurrent.Futures
import com.google.common.util.concurrent.ListenableFuture
import expo.modules.munibwear.tasbeeh.Tasbeeh
import java.util.concurrent.Callable

/**
 * Tasbeeh tile: a glance at the watch-local counter (count / target and a progress ring) with one
 * Open button that launches the Compose counter ([TasbeehActivity]). No counting in the tile — a
 * tile reload per tap was too slow for counting (E-41). Never talks to the phone; the phone
 * snapshot only supplies labels and the after-Salah steps.
 */
private const val CLICK_OPEN = "tasbeeh_open"

class MunibWearTasbeehTileService : TileService() {
  override fun onTileRequest(requestParams: RequestBuilders.TileRequest): ListenableFuture<TileBuilders.Tile> =
    Futures.submit(Callable { buildTile(requestParams) }, WearDataLayer.executor)

  private fun buildTile(requestParams: RequestBuilders.TileRequest): TileBuilders.Tile {
    val snapshot = WearDataLayer.readSnapshot(applicationContext)
    val steps = snapshot?.afterSalahSteps.orEmpty()
    val view = Tasbeeh.view(WearTasbeehStore.load(this), steps.map { it.target })
    val device = requestParams.deviceConfiguration

    val tasbeehLabel = snapshot?.str("tasbeeh", getString(R.string.wear_tasbeeh)) ?: getString(R.string.wear_tasbeeh)
    val title = when {
      view.sequence && !view.reached ->
        steps.getOrNull(view.stepIndex)?.let { it.title.ifEmpty { it.transliteration } }?.ifEmpty { null } ?: tasbeehLabel
      else -> tasbeehLabel
    }
    val detail = when {
      view.reached -> "✓"
      view.sequence -> "/ ${view.target} · ${view.stepIndex + 1}/${view.stepTotal}"
      view.target > 0 -> "/ ${view.target}"
      else -> "∞"
    }
    val description = if (view.target > 0) {
      getString(R.string.wear_tasbeeh_a11y, view.count, view.target)
    } else {
      getString(R.string.wear_tasbeeh_a11y_unlimited, view.count)
    }

    val counter = LayoutElementBuilders.Column.Builder()
      .setHorizontalAlignment(LayoutElementBuilders.HORIZONTAL_ALIGN_CENTER)
      .setModifiers(
        ModifiersBuilders.Modifiers.Builder()
          .setSemantics(ModifiersBuilders.Semantics.Builder().setContentDescription(description).build())
          .build(),
      )
      .addContent(tileText(this, title, Typography.TYPOGRAPHY_CAPTION1, WearColors.SECONDARY))
      .addContent(tileText(this, "${view.count}", Typography.TYPOGRAPHY_DISPLAY2, if (view.reached) WearColors.SUCCESS else WearColors.TEXT))
      .addContent(tileText(this, detail, Typography.TYPOGRAPHY_CAPTION2, if (view.reached) WearColors.SUCCESS else WearColors.SECONDARY))
      .build()

    // The tile's only clickable.
    val open = CompactChip.Builder(
      this,
      getString(R.string.wear_open),
      clickable(CLICK_OPEN, launchActivity(this, TasbeehActivity::class.java.name)),
      device,
    )
      .setChipColors(ChipColors(WearColors.ACCENT, WearColors.BACKGROUND))
      .build()

    val content = LayoutElementBuilders.Column.Builder()
      .setHorizontalAlignment(LayoutElementBuilders.HORIZONTAL_ALIGN_CENTER)
      .addContent(counter)
      .addContent(LayoutElementBuilders.Spacer.Builder().setHeight(dp(6f)).build())
      .addContent(open)
      .build()

    val ring = CircularProgressIndicator.Builder()
      .setProgress(view.progress)
      .setCircularProgressIndicatorColors(
        ProgressIndicatorColors(if (view.reached) WearColors.SUCCESS else WearColors.ACCENT, WearColors.TRACK),
      )
      .setContentDescription(description)
      .build()

    val layout = EdgeContentLayout.Builder(device)
      .setEdgeContent(ring)
      .setContent(content)
      .build()

    return TileBuilders.Tile.Builder()
      .setResourcesVersion("1")
      .setTileTimeline(
        TimelineBuilders.Timeline.Builder()
          .addTimelineEntry(
            TimelineBuilders.TimelineEntry.Builder()
              .setLayout(LayoutElementBuilders.Layout.Builder().setRoot(layout).build())
              .build(),
          )
          .build(),
      )
      .build()
  }
}
