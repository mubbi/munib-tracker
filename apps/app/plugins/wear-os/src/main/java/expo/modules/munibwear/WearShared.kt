package expo.modules.munibwear

import android.content.ComponentName
import android.content.Context
import android.content.SharedPreferences
import androidx.wear.protolayout.ColorBuilders.argb
import androidx.wear.tiles.TileService
import androidx.wear.watchface.complications.datasource.ComplicationDataSourceUpdateRequester

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
  const val BACKGROUND = 0xFF000000.toInt()

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
 * Watch-local tasbeeh shared by the Tasbeeh tile and [TasbeehActivity]
 * (SharedPreferences `munib_wear_tasbeeh`). Never talks to the phone.
 */
internal object WearTasbeehStore {
  private const val PREFS = "munib_wear_tasbeeh"
  private const val KEY_COUNT = "count"
  private const val KEY_TARGET = "target"
  private const val KEY_MODE = "mode"
  private const val KEY_SEQ_STEP = "seq_step"
  private const val KEY_SEQ_COUNT = "seq_count"

  const val MODE_FREE = "free"
  const val MODE_SEQUENCE = "sequence"
  val TARGETS = listOf(33, 99, 100, 0)

  fun prefs(context: Context): SharedPreferences =
    context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

  fun count(context: Context) = prefs(context).getInt(KEY_COUNT, 0)
  fun target(context: Context) = prefs(context).getInt(KEY_TARGET, 33)
  fun mode(context: Context) = prefs(context).getString(KEY_MODE, MODE_FREE) ?: MODE_FREE
  fun sequenceStep(context: Context) = prefs(context).getInt(KEY_SEQ_STEP, 0)
  fun sequenceCount(context: Context) = prefs(context).getInt(KEY_SEQ_COUNT, 0)

  /** +1 (capped at the target when one is set). Returns true when this tap reached the target. */
  @Synchronized
  fun increment(context: Context): Boolean {
    val target = target(context)
    val current = count(context)
    if (target > 0 && current >= target) return false
    val next = current + 1
    prefs(context).edit().putInt(KEY_COUNT, next).apply()
    return target > 0 && next >= target
  }

  @Synchronized
  fun decrement(context: Context) {
    val current = count(context)
    if (current > 0) prefs(context).edit().putInt(KEY_COUNT, current - 1).apply()
  }

  /** Like the phone and Apple Watch: changing the target keeps the count, held at the new target. */
  @Synchronized
  fun setTarget(context: Context, target: Int) {
    val count = count(context)
    prefs(context).edit()
      .putInt(KEY_TARGET, target)
      .putInt(KEY_COUNT, if (target > 0) minOf(count, target) else count)
      .apply()
  }

  fun reset(context: Context) {
    prefs(context).edit().putInt(KEY_COUNT, 0).apply()
  }

  fun setMode(context: Context, mode: String) {
    prefs(context).edit().putString(KEY_MODE, mode).apply()
  }

  fun setSequence(context: Context, step: Int, count: Int) {
    prefs(context).edit().putInt(KEY_SEQ_STEP, step).putInt(KEY_SEQ_COUNT, count).apply()
  }
}
