package expo.modules.munibwear.tasbeeh

import android.content.Context
import androidx.activity.compose.BackHandler
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.focusable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.rotary.onRotaryScrollEvent
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.wear.compose.foundation.lazy.ScalingLazyColumn
import androidx.wear.compose.foundation.lazy.items
import androidx.wear.compose.foundation.lazy.rememberScalingLazyListState
import androidx.wear.compose.foundation.requestFocusOnHierarchyActive
import androidx.wear.compose.material3.AlertDialog
import androidx.wear.compose.material3.AlertDialogDefaults
import androidx.wear.compose.material3.AppScaffold
import androidx.wear.compose.material3.Button
import androidx.wear.compose.material3.ButtonDefaults
import androidx.wear.compose.material3.CircularProgressIndicator
import androidx.wear.compose.material3.ColorScheme
import androidx.wear.compose.material3.EdgeButton
import androidx.wear.compose.material3.EdgeButtonSize
import androidx.wear.compose.material3.FilledTonalButton
import androidx.wear.compose.material3.ListHeader
import androidx.wear.compose.material3.MaterialTheme
import androidx.wear.compose.material3.ProgressIndicatorDefaults
import androidx.wear.compose.material3.RadioButton
import androidx.wear.compose.material3.ScreenScaffold
import androidx.wear.compose.material3.SwipeToDismissBox
import androidx.wear.compose.material3.Text
import app.munibtracker.wear.R
import expo.modules.munibwear.WearColors
import expo.modules.munibwear.WearSnapshot
import expo.modules.munibwear.WearZikrStep

/** One count per this much crown / bezel turn (the Views counter used the same threshold). */
private val ROTARY_STEP = 28.dp

/** The arc leaves a gap at 6 o'clock for the Options / Start again edge button. */
private const val ARC_START_DEGREES = 125f
private const val ARC_END_DEGREES = 55f

/** Dark-only Wear palette from `WearTokens.generated.kt` (via [WearColors]); OLED black canvas. */
private val tasbeehColors = ColorScheme(
  primary = Color(WearColors.ACCENT),
  primaryDim = Color(WearColors.ACCENT),
  primaryContainer = Color(WearColors.ACCENT_DARK),
  onPrimary = Color(WearColors.BACKGROUND),
  onPrimaryContainer = Color(WearColors.TEXT),
  secondaryContainer = Color(WearColors.ACCENT_DARK),
  onSecondaryContainer = Color(WearColors.TEXT),
  surfaceContainerLow = Color(WearColors.ACCENT_DARK),
  surfaceContainer = Color(WearColors.ACCENT_DARK),
  surfaceContainerHigh = Color(WearColors.TRACK),
  onSurface = Color(WearColors.TEXT),
  onSurfaceVariant = Color(WearColors.SECONDARY),
  outline = Color(WearColors.TRACK),
  outlineVariant = Color(WearColors.TRACK),
  background = Color(WearColors.BACKGROUND),
  onBackground = Color(WearColors.TEXT),
)

/**
 * Labels for the counter. A label the phone snapshot carries wins (the phone app's locale, 24
 * locales); otherwise the watch's own `values*` resources (en / ar / ur).
 */
internal class TasbeehStrings(private val context: Context, private val snapshot: WearSnapshot?) {
  private fun res(id: Int): String = context.getString(id)
  private fun snap(key: String, id: Int): String = snapshot?.str(key, res(id)) ?: res(id)

  val title: String get() = snap("tasbeeh", R.string.wear_tasbeeh)
  val tapToCount: String get() = snap("tapToCount", R.string.wear_tasbeeh_tap_to_count)
  val unlimited: String get() = res(R.string.wear_tasbeeh_unlimited)
  val options: String get() = res(R.string.wear_tasbeeh_options)
  val undo: String get() = res(R.string.wear_tasbeeh_undo)
  val target: String get() = res(R.string.wear_tasbeeh_target)
  val mode: String get() = res(R.string.wear_tasbeeh_mode)
  val free: String get() = snap("freeCount", R.string.wear_tasbeeh_free)
  val afterSalah: String
    get() = snapshot?.afterSalahTitle?.ifEmpty { null } ?: snap("afterSalahAdhkar", R.string.wear_tasbeeh_after_salah)
  val reset: String get() = snap("reset", R.string.wear_tasbeeh_reset)
  val resetQuestion: String get() = res(R.string.wear_tasbeeh_reset_confirm)
  val startAgain: String get() = res(R.string.wear_tasbeeh_start_again)
  val allDone: String get() = snap("sequenceDone", R.string.wear_tasbeeh_all_done)
  val targetReached: String get() = res(R.string.wear_tasbeeh_target_reached)
  val countOne: String get() = res(R.string.wear_tasbeeh_count_one)

  fun ofTarget(target: Int): String = context.getString(R.string.wear_tasbeeh_of_target, target)
  fun step(index: Int, total: Int): String = context.getString(R.string.wear_tasbeeh_step, index, total)
  fun counter(count: Int, target: Int): String =
    if (target > 0) {
      context.getString(R.string.wear_tasbeeh_a11y, count, target)
    } else {
      context.getString(R.string.wear_tasbeeh_a11y_unlimited, count)
    }
}

/**
 * Root of the Compose counter: the counter screen, and an Options screen over it (swipe right
 * or the back button returns to the counter; on the counter, the system swipe leaves the app).
 * Stateless: [state] comes from the activity, every change goes back through [onEvent].
 */
@Composable
internal fun TasbeehApp(
  state: TasbeehState,
  snapshot: WearSnapshot?,
  onEvent: (TasbeehEvent) -> Unit,
) {
  val context = LocalContext.current
  val strings = remember(context, snapshot) { TasbeehStrings(context, snapshot) }
  val steps: List<WearZikrStep> = snapshot?.afterSalahSteps.orEmpty()
  val stepTargets = remember(steps) { steps.map { it.target } }
  val view = Tasbeeh.view(state, stepTargets)
  val direction = when (snapshot?.isRtl) {
    true -> LayoutDirection.Rtl
    false -> LayoutDirection.Ltr
    null -> LocalLayoutDirection.current
  }

  CompositionLocalProvider(LocalLayoutDirection provides direction) {
    MaterialTheme(colorScheme = tasbeehColors) {
      AppScaffold {
        var showOptions by rememberSaveable { mutableStateOf(false) }
        var confirmReset by rememberSaveable { mutableStateOf(false) }
        BackHandler(enabled = showOptions) { showOptions = false }

        SwipeToDismissBox(onDismissed = { showOptions = false }, userSwipeEnabled = showOptions) { isBackground ->
          if (isBackground || !showOptions) {
            CounterScreen(
              view = view,
              strings = strings,
              stepTitle = steps.getOrNull(view.stepIndex)?.let { it.title.ifEmpty { it.transliteration } }.orEmpty(),
              onCount = { onEvent(TasbeehEvent.Count) },
              onOptions = { showOptions = true },
              onStartAgain = { confirmReset = true },
            )
          } else {
            OptionsScreen(
              state = state,
              strings = strings,
              sequence = view.sequence,
              hasSteps = stepTargets.isNotEmpty(),
              canUndo = Tasbeeh.canUndo(state, stepTargets),
              canReset = Tasbeeh.canReset(state, stepTargets),
              onEvent = onEvent,
              onReset = { confirmReset = true },
            )
          }
        }

        // Reset and "Start again" always ask; Undo never does.
        AlertDialog(
          visible = confirmReset,
          onDismissRequest = { confirmReset = false },
          confirmButton = {
            AlertDialogDefaults.ConfirmButton(
              onClick = {
                confirmReset = false
                showOptions = false
                onEvent(TasbeehEvent.Reset)
              },
            )
          },
          title = { Text(strings.resetQuestion, textAlign = TextAlign.Center) },
        )
      }
    }
  }
}

/**
 * Accumulates clockwise crown / bezel scroll into counts: one count per [ROTARY_STEP] and at most
 * one per event, so a single bezel detent never counts twice. Anticlockwise does nothing.
 */
private class RotaryCounter {
  private var accumulated = 0f

  fun onScroll(pixels: Float, stepPx: Float): Boolean {
    if (pixels <= 0f) {
      accumulated = 0f
      return false
    }
    accumulated += pixels
    if (accumulated < stepPx) return false
    accumulated = (accumulated - stepPx).coerceAtMost(stepPx / 2f)
    return true
  }
}

@Composable
private fun CounterScreen(
  view: TasbeehView,
  strings: TasbeehStrings,
  stepTitle: String,
  onCount: () -> Unit,
  onOptions: () -> Unit,
  onStartAgain: () -> Unit,
) {
  val colors = MaterialTheme.colorScheme
  val typography = MaterialTheme.typography
  val success = Color(WearColors.SUCCESS)
  val stepPx = with(LocalDensity.current) { ROTARY_STEP.toPx() }
  val rotary = remember { RotaryCounter() }
  // The indicator animates from a lambda it keeps across recompositions, so the lambda must
  // read State: `{ view.progress }` captured the first `view` and the ring never left 0.
  val progress by rememberUpdatedState(view.progress)

  val title = when {
    view.sequence && !view.reached -> stepTitle.ifEmpty { strings.afterSalah }
    !view.sequence && view.count == 0 -> strings.tapToCount
    else -> strings.title
  }
  // Changes only at a target or a step change, so the polite live region announces exactly those.
  val status = when {
    view.reached && view.sequence -> "✓ ${strings.allDone}"
    view.reached -> "✓ ${strings.targetReached}"
    view.sequence -> "${strings.ofTarget(view.target)} · ${strings.step(view.stepIndex + 1, view.stepTotal)}"
    view.target > 0 -> strings.ofTarget(view.target)
    else -> "∞"
  }
  val description = strings.counter(view.count, view.target)

  // No TimeText here: the arc owns the bezel. The Options screen shows the time.
  ScreenScaffold(timeText = {}) { _ ->
    Box(
      modifier = Modifier
        .fillMaxSize()
        .onRotaryScrollEvent { event ->
          if (rotary.onScroll(event.verticalScrollPixels, stepPx)) onCount()
          true
        }
        .requestFocusOnHierarchyActive()
        .focusable(),
    ) {
      // The whole surface counts; long-press is a shortcut to Options (also at the target).
      Box(
        modifier = Modifier
          .fillMaxSize()
          .combinedClickable(
            interactionSource = null,
            indication = null,
            onClickLabel = strings.countOne,
            role = Role.Button,
            onLongClickLabel = strings.options,
            onLongClick = onOptions,
            onClick = onCount,
          )
          .semantics { contentDescription = description },
      )
      Box(modifier = Modifier.fillMaxSize().clearAndSetSemantics {}) {
        CircularProgressIndicator(
          progress = { progress },
          modifier = Modifier.fillMaxSize().padding(2.dp),
          startAngle = ARC_START_DEGREES,
          endAngle = ARC_END_DEGREES,
          colors = ProgressIndicatorDefaults.colors(
            indicatorColor = if (view.reached) success else colors.primary,
            trackColor = colors.surfaceContainerHigh,
          ),
          strokeWidth = 6.dp,
        )
      }
      Column(
        modifier = Modifier
          .align(Alignment.Center)
          .fillMaxWidth()
          // Round-safe: keeps text inside the inscribed square on small round screens.
          .padding(start = 28.dp, end = 28.dp, bottom = 20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
      ) {
        Text(
          text = title,
          modifier = Modifier.clearAndSetSemantics {},
          color = colors.onSurfaceVariant,
          textAlign = TextAlign.Center,
          overflow = TextOverflow.Ellipsis,
          maxLines = 2,
          style = typography.labelMedium,
        )
        Text(
          text = "${view.count}",
          modifier = Modifier.clearAndSetSemantics {},
          color = if (view.reached) success else colors.onSurface,
          textAlign = TextAlign.Center,
          maxLines = 1,
          style = if (view.count < 1000) typography.numeralExtraLarge else typography.numeralLarge,
        )
        Text(
          text = status,
          modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
          color = if (view.reached) success else colors.onSurfaceVariant,
          textAlign = TextAlign.Center,
          overflow = TextOverflow.Ellipsis,
          maxLines = 2,
          style = typography.labelSmall,
        )
      }
      EdgeButton(
        onClick = if (view.reached) onStartAgain else onOptions,
        modifier = Modifier.align(Alignment.BottomCenter),
        buttonSize = EdgeButtonSize.Small,
        colors = if (view.reached) ButtonDefaults.buttonColors() else ButtonDefaults.filledTonalButtonColors(),
      ) {
        Text(
          text = if (view.reached) strings.startAgain else strings.options,
          maxLines = 1,
          overflow = TextOverflow.Ellipsis,
        )
      }
    }
  }
}

@Composable
private fun OptionsScreen(
  state: TasbeehState,
  strings: TasbeehStrings,
  sequence: Boolean,
  hasSteps: Boolean,
  canUndo: Boolean,
  canReset: Boolean,
  onEvent: (TasbeehEvent) -> Unit,
  onReset: () -> Unit,
) {
  val listState = rememberScalingLazyListState()
  // Rotary scrolls this list (ScalingLazyColumn's own rotary behaviour), it never counts.
  ScreenScaffold(scrollState = listState) { contentPadding ->
    ScalingLazyColumn(
      modifier = Modifier.fillMaxSize(),
      state = listState,
      contentPadding = contentPadding,
    ) {
      item { ListHeader { Text(strings.options) } }
      item {
        Button(
          onClick = { onEvent(TasbeehEvent.Undo) },
          modifier = Modifier.fillMaxWidth(),
          enabled = canUndo,
          label = { Text(strings.undo, maxLines = 2, overflow = TextOverflow.Ellipsis) },
        )
      }
      if (!sequence) {
        item { ListHeader { Text(strings.target) } }
        items(Tasbeeh.TARGETS) { target ->
          RadioButton(
            selected = state.target == target,
            onSelect = { onEvent(TasbeehEvent.SetTarget(target)) },
            modifier = Modifier.fillMaxWidth(),
            label = { Text(if (target > 0) "$target" else "∞ ${strings.unlimited}", maxLines = 1) },
          )
        }
      }
      if (hasSteps) {
        item { ListHeader { Text(strings.mode) } }
        item {
          RadioButton(
            selected = !sequence,
            onSelect = { onEvent(TasbeehEvent.SetMode(TasbeehMode.FREE)) },
            modifier = Modifier.fillMaxWidth(),
            label = { Text(strings.free, maxLines = 2, overflow = TextOverflow.Ellipsis) },
          )
        }
        item {
          RadioButton(
            selected = sequence,
            onSelect = { onEvent(TasbeehEvent.SetMode(TasbeehMode.SEQUENCE)) },
            modifier = Modifier.fillMaxWidth(),
            label = { Text(strings.afterSalah, maxLines = 2, overflow = TextOverflow.Ellipsis) },
          )
        }
      }
      item {
        FilledTonalButton(
          onClick = onReset,
          modifier = Modifier.fillMaxWidth(),
          enabled = canReset,
          label = { Text(strings.reset, maxLines = 1, overflow = TextOverflow.Ellipsis) },
        )
      }
    }
  }
}
