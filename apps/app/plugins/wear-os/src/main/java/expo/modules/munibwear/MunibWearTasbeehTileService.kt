package expo.modules.munibwear

import androidx.wear.protolayout.ColorBuilders.argb
import androidx.wear.protolayout.DimensionBuilders.dp
import androidx.wear.protolayout.LayoutElementBuilders
import androidx.wear.protolayout.ModifiersBuilders
import androidx.wear.protolayout.TimelineBuilders
import androidx.wear.protolayout.material.CircularProgressIndicator
import androidx.wear.protolayout.material.ProgressIndicatorColors
import androidx.wear.protolayout.material.Typography
import androidx.wear.protolayout.material.layouts.EdgeContentLayout
import androidx.wear.tiles.RequestBuilders
import androidx.wear.tiles.TileBuilders
import androidx.wear.tiles.TileService
import app.munibtracker.wear.R
import com.google.common.util.concurrent.Futures
import com.google.common.util.concurrent.ListenableFuture
import java.util.concurrent.Callable

/**
 * Second Wear tile: a local-only tasbeeh (zikr) counter. Unlike the next-Salah
 * tile, this never talks to the phone — the count and target live entirely on
 * the watch (SharedPreferences), shared with the full-screen [TasbeehActivity].
 */
private const val CLICK_INCREMENT = "tasbeeh_increment"
private const val CLICK_TARGET_NEXT = "tasbeeh_target_next"
private const val CLICK_OPEN = "tasbeeh_open"

class MunibWearTasbeehTileService : TileService() {
  override fun onTileRequest(requestParams: RequestBuilders.TileRequest): ListenableFuture<TileBuilders.Tile> =
    Futures.submit(Callable { buildTile(requestParams) }, WearDataLayer.executor)

  private fun buildTile(requestParams: RequestBuilders.TileRequest): TileBuilders.Tile {
    when (requestParams.currentState.lastClickableId) {
      CLICK_INCREMENT -> WearTasbeehStore.increment(this)
      CLICK_TARGET_NEXT -> {
        val targets = WearTasbeehStore.TARGETS
        val current = WearTasbeehStore.target(this)
        WearTasbeehStore.setTarget(this, targets[(targets.indexOf(current) + 1) % targets.size])
      }
    }

    val count = WearTasbeehStore.count(this)
    val target = WearTasbeehStore.target(this)
    val snapshot = WearDataLayer.readSnapshot(applicationContext)
    val tasbeehLabel = snapshot?.str("tasbeeh", getString(R.string.wear_tasbeeh)) ?: getString(R.string.wear_tasbeeh)
    val device = requestParams.deviceConfiguration
    val done = target > 0 && count >= target

    val counter = LayoutElementBuilders.Column.Builder()
      .setHorizontalAlignment(LayoutElementBuilders.HORIZONTAL_ALIGN_CENTER)
      .setModifiers(
        ModifiersBuilders.Modifiers.Builder()
          .setClickable(clickable(CLICK_INCREMENT))
          .setSemantics(
            ModifiersBuilders.Semantics.Builder()
              .setContentDescription("$tasbeehLabel, $count${if (target > 0) " / $target" else ""}")
              .build(),
          )
          .build(),
      )
      .addContent(tileText(this, tasbeehLabel, Typography.TYPOGRAPHY_CAPTION1, WearColors.SECONDARY))
      .addContent(tileText(this, "$count", Typography.TYPOGRAPHY_DISPLAY2, if (done) WearColors.SUCCESS else WearColors.TEXT))
      .addContent(
        tileText(
          this,
          if (target > 0) "/ $target" else (snapshot?.str("tasbeehUnlimited", "Unlimited count") ?: "∞"),
          Typography.TYPOGRAPHY_CAPTION2,
          WearColors.SECONDARY,
        ),
      )
      .build()

    // Two 48 dp buttons: cycle the target (33 → 99 → 100 → ∞) and open the full
    // counter (crown counting, the after-Salah sequence, reset with a confirm).
    val actions = LayoutElementBuilders.Row.Builder()
      .setVerticalAlignment(LayoutElementBuilders.VERTICAL_ALIGN_CENTER)
      .addContent(circle(if (target > 0) "$target" else "∞", clickable(CLICK_TARGET_NEXT), filled = false))
      .addContent(LayoutElementBuilders.Spacer.Builder().setWidth(dp(8f)).build())
      .addContent(
        circle("↗", clickable(CLICK_OPEN, launchActivity(this, TasbeehActivity::class.java.name)), filled = true),
      )
      .build()

    val content = LayoutElementBuilders.Column.Builder()
      .setHorizontalAlignment(LayoutElementBuilders.HORIZONTAL_ALIGN_CENTER)
      .addContent(counter)
      .addContent(LayoutElementBuilders.Spacer.Builder().setHeight(dp(4f)).build())
      .addContent(actions)
      .build()

    val ring = CircularProgressIndicator.Builder()
      .setProgress(if (target > 0) (count.toFloat() / target).coerceIn(0f, 1f) else 0f)
      .setCircularProgressIndicatorColors(
        ProgressIndicatorColors(if (done) WearColors.SUCCESS else WearColors.WARNING, WearColors.TRACK),
      )
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

  /** 48 dp round button. */
  private fun circle(
    label: String,
    clickable: ModifiersBuilders.Clickable,
    filled: Boolean,
  ): LayoutElementBuilders.LayoutElement =
    LayoutElementBuilders.Box.Builder()
      .setWidth(dp(48f))
      .setHeight(dp(48f))
      .setModifiers(
        ModifiersBuilders.Modifiers.Builder()
          .setClickable(clickable)
          .setBackground(
            ModifiersBuilders.Background.Builder()
              .setColor(argb(if (filled) WearColors.ACCENT else WearColors.ACCENT_DARK))
              .setCorner(ModifiersBuilders.Corner.Builder().setRadius(dp(24f)).build())
              .build(),
          )
          .build(),
      )
      .addContent(
        tileText(this, label, Typography.TYPOGRAPHY_BUTTON, if (filled) WearColors.BACKGROUND else WearColors.TEXT),
      )
      .build()
}
