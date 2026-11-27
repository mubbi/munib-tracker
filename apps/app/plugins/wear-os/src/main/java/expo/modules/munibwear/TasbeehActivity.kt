package expo.modules.munibwear

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.mutableStateOf
import expo.modules.munibwear.tasbeeh.Tasbeeh
import expo.modules.munibwear.tasbeeh.TasbeehApp
import expo.modules.munibwear.tasbeeh.TasbeehEvent
import expo.modules.munibwear.tasbeeh.TasbeehFeedback
import expo.modules.munibwear.tasbeeh.TasbeehMode
import expo.modules.munibwear.tasbeeh.TasbeehState

/**
 * Full-screen tasbeeh (D-UX4, Compose for Wear OS / Material 3): tap anywhere or turn the crown /
 * rotating bezel clockwise to count, with a haptic tick per count and a stronger pattern at the
 * target. Free counter (33 / 99 / 100 / ∞) or the after-Salah sequence the phone sends.
 *
 * State lives in [WearTasbeehStore] (shared with the Tasbeeh tile) and is saved on every change,
 * so it survives leaving the screen, process death and reboot. Watch-local: never talks to the
 * phone. No keep-screen-on and no ambient support: on wrist-down the system shows the watch face
 * and the count is unchanged on return. The class name and manifest entry are unchanged, so the
 * tile's Open button and the home screen keep working.
 */
class TasbeehActivity : ComponentActivity() {
  private val handler = Handler(Looper.getMainLooper())
  private lateinit var haptics: WearHaptics
  private val state = mutableStateOf(TasbeehState())
  private val snapshot = mutableStateOf<WearSnapshot?>(null)
  /** Until the snapshot is read, a stored sequence can't be resolved: hold counts back. */
  private var snapshotLoaded = false

  private val tileUpdate = Runnable { WearRefresh.requestTasbeehTile(applicationContext) }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    haptics = WearHaptics(this)
    state.value = WearTasbeehStore.load(this)
    setContent {
      TasbeehApp(state = state.value, snapshot = snapshot.value, onEvent = ::dispatch)
    }
  }

  override fun onResume() {
    super.onResume()
    // Pick up any change made elsewhere (older builds' tile) and start a new day's sequence.
    state.value = WearTasbeehStore.load(this)
    dispatch(TasbeehEvent.NewDay(WearDayResolver.localDate(System.currentTimeMillis())))
    WearDataLayer.executor.execute {
      val next = WearDataLayer.readSnapshot(applicationContext)
      handler.post {
        snapshot.value = next
        snapshotLoaded = true
      }
    }
  }

  override fun onPause() {
    super.onPause()
    handler.removeCallbacks(tileUpdate)
    WearRefresh.requestTasbeehTile(applicationContext)
  }

  private fun dispatch(event: TasbeehEvent) {
    val current = state.value
    if (!snapshotLoaded && current.mode == TasbeehMode.SEQUENCE &&
      (event == TasbeehEvent.Count || event == TasbeehEvent.Undo)
    ) {
      return
    }
    val stepTargets = snapshot.value?.afterSalahSteps.orEmpty().map { it.target }
    val result = Tasbeeh.reduce(current, event, stepTargets)
    when (result.feedback) {
      TasbeehFeedback.NONE -> Unit
      TasbeehFeedback.TICK -> haptics.tick()
      TasbeehFeedback.TARGET -> haptics.target()
      TasbeehFeedback.ADVANCE -> haptics.advance()
      TasbeehFeedback.DONE -> haptics.done()
    }
    if (result.state == current) return
    state.value = result.state
    WearTasbeehStore.save(this, result.state)
    // Debounced: a burst of taps refreshes the tile once, shortly after the last one.
    handler.removeCallbacks(tileUpdate)
    handler.postDelayed(tileUpdate, TILE_UPDATE_DELAY_MS)
  }

  companion object {
    private const val TILE_UPDATE_DELAY_MS = 800L
  }
}
