package expo.modules.munibwear

import android.content.ComponentName
import android.content.Context
import android.content.SharedPreferences
import android.graphics.Color
import androidx.wear.protolayout.ColorBuilders.argb
import androidx.wear.tiles.TileService
import androidx.wear.watchface.complications.datasource.ComplicationDataSourceUpdateRequester
import expo.modules.munibwear.tasbeeh.TasbeehMode
import expo.modules.munibwear.tasbeeh.TasbeehState

/**
 * Dark Wear palette — values come from `WearTokens.generated.kt` (theme package). Only the
 * pure-black canvas is local: OLED black is intentional on Wear and not an app surface colour.
 */
internal object WearColors {
  const val TEXT = WearTokens.TEXT
  const val SECONDARY = WearTokens.SECONDARY
  const val ACCENT = WearTokens.ACCENT
  const val ACCENT_DARK = WearTokens.CARD
  const val TRACK = WearTokens.MUTED
  const val SUCCESS = WearTokens.SUCCESS
  const val WARNING = WearTokens.WARNING
  const val BACKGROUND = Color.BLACK

  val textProp get() = argb(TEXT)
  val secondaryProp get() = argb(SECONDARY)
  val accentProp get() = argb(ACCENT)
  val successProp get() = argb(SUCCESS)
}

/** Re-requests every tile and complication (new snapshot, a mark, or a tasbeeh change). */
internal object WearRefresh {
  private val tiles = listOf(
    MunibWearTileService::class.java,
    MunibWearTodayTileService::class.java,
    MunibWearTasbeehTileService::class.java,
  )
  private val complications = listOf(
    NextSalahComplicationService::class.java,
    ProgressComplicationService::class.java,
  )

  fun requestAll(context: Context) {
    val app = context.applicationContext
    tiles.forEach { requestTile(app, it) }
    complications.forEach {
      try {
        ComplicationDataSourceUpdateRequester.create(app, ComponentName(app, it)).requestUpdateAll()
      } catch (_: Exception) {
        /* no complication of this kind on the face */
      }
    }
  }

  fun requestTasbeehTile(context: Context) =
    requestTile(context.applicationContext, MunibWearTasbeehTileService::class.java)

  private fun requestTile(context: Context, cls: Class<out TileService>) {
    try {
      TileService.getUpdater(context).requestUpdate(cls)
    } catch (_: Exception) {
      /* tile not added */
    }
  }
}

/**
 * Watch-local tasbeeh shared by the Tasbeeh tile, the home screen and the Compose counter
 * (SharedPreferences `munib_wear_tasbeeh`). Never talks to the phone. The keys predate the
 * Compose counter, so counts made with older watch builds carry over.
 */
internal object WearTasbeehStore {
  private const val PREFS = "munib_wear_tasbeeh"
  private const val KEY_COUNT = "count"
  private const val KEY_TARGET = "target"
  private const val KEY_MODE = "mode"
  private const val KEY_SEQ_STEP = "seq_step"
  private const val KEY_SEQ_COUNT = "seq_count"
  private const val KEY_DATE = "date"

  private const val MODE_FREE = "free"
  private const val MODE_SEQUENCE = "sequence"

  private fun prefs(context: Context): SharedPreferences =
    context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

  /** Free-mode count (home screen entry). */
  fun count(context: Context) = prefs(context).getInt(KEY_COUNT, 0)

  fun load(context: Context): TasbeehState {
    val prefs = prefs(context)
    return TasbeehState(
      count = prefs.getInt(KEY_COUNT, 0).coerceAtLeast(0),
      target = prefs.getInt(KEY_TARGET, TasbeehState.DEFAULT_TARGET).coerceAtLeast(0),
      mode = if (prefs.getString(KEY_MODE, MODE_FREE) == MODE_SEQUENCE) TasbeehMode.SEQUENCE else TasbeehMode.FREE,
      step = prefs.getInt(KEY_SEQ_STEP, 0).coerceAtLeast(0),
      stepCount = prefs.getInt(KEY_SEQ_COUNT, 0).coerceAtLeast(0),
      date = prefs.getString(KEY_DATE, "") ?: "",
    )
  }

  /**
   * apply(): one write per count must not block the UI thread; Android flushes pending
   * apply() writes before an activity stops, so a count survives leaving the screen and
   * process death after it.
   */
  fun save(context: Context, state: TasbeehState) {
    prefs(context).edit()
      .putInt(KEY_COUNT, state.count)
      .putInt(KEY_TARGET, state.target)
      .putString(KEY_MODE, if (state.mode == TasbeehMode.SEQUENCE) MODE_SEQUENCE else MODE_FREE)
      .putInt(KEY_SEQ_STEP, state.step)
      .putInt(KEY_SEQ_COUNT, state.stepCount)
      .putString(KEY_DATE, state.date)
      .apply()
  }
}
