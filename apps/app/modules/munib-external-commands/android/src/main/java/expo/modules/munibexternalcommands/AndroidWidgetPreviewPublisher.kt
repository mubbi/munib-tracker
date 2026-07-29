package expo.modules.munibexternalcommands

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProviderInfo
import android.content.ComponentName
import android.content.Context
import android.content.SharedPreferences
import android.os.Build
import android.widget.RemoteViews
import org.json.JSONObject

/**
 * Android 15+ personalized widget picker previews ([AppWidgetManager.setWidgetPreview]).
 * Rate-limited so snapshot sync does not hammer the system API.
 */
internal object AndroidWidgetPreviewPublisher {
  private const val PREFS = "munib_widget_previews"
  private const val LAST_PUBLISH_MS = "last_publish_ms"
  private const val MIN_INTERVAL_MS = 30 * 60 * 1000L // 30 minutes

  private val WIDGET_SECTIONS = listOf(
    "NextPrayerWidget" to "nextPrayer",
    "PrayerScheduleWidget" to "schedule",
    "PrayerProgressWidget" to "progress",
    "SalahStreakWidget" to "streak",
    "QazaDebtWidget" to "qaza",
    "RamadanWidget" to "ramadan",
    "KhatmProgressWidget" to "khatm",
    "DailyHadithWidget" to "dailyHadith",
    "HijriDateWidget" to "hijriDate",
    "QiblaBearingWidget" to "qibla",
  )

  fun publish(context: Context, snapshotJson: String, force: Boolean = false): Boolean {
    if (Build.VERSION.SDK_INT < 35) return false
    val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
    val now = System.currentTimeMillis()
    if (!force && now - prefs.getLong(LAST_PUBLISH_MS, 0L) < MIN_INTERVAL_MS) {
      return false
    }

    val root = try {
      JSONObject(snapshotJson)
    } catch (_: Exception) {
      return false
    }

    val packageName = context.packageName
    val manager = AppWidgetManager.getInstance(context)
    val layoutId = context.resources.getIdentifier(
      "widget_preview_glance",
      "layout",
      packageName,
    )
    if (layoutId == 0) return false

    var published = 0
    for ((widgetName, sectionKey) in WIDGET_SECTIONS) {
      val section = root.optJSONObject(sectionKey) ?: continue
      val title = section.optString("title", widgetName)
      val hero = heroText(sectionKey, section)
      val caption = section.optString("lockScreenDetail", section.optString("summary", ""))

      val views = RemoteViews(packageName, layoutId)
      val titleId = context.resources.getIdentifier("widget_preview_title", "id", packageName)
      val heroId = context.resources.getIdentifier("widget_preview_hero", "id", packageName)
      val captionId = context.resources.getIdentifier("widget_preview_caption", "id", packageName)
      if (titleId != 0) views.setTextViewText(titleId, title)
      if (heroId != 0) views.setTextViewText(heroId, hero)
      if (captionId != 0) views.setTextViewText(captionId, caption)

      val provider = ComponentName(packageName, "$packageName.$widgetName")
      try {
        manager.setWidgetPreview(
          provider,
          AppWidgetProviderInfo.WIDGET_CATEGORY_HOME_SCREEN,
          views,
        )
        published += 1
      } catch (_: Exception) {
        /* Provider missing until prebuild / unsupported device */
      }
    }

    if (published > 0) {
      prefs.edit().putLong(LAST_PUBLISH_MS, now).apply()
    }
    return published > 0
  }

  private fun heroText(sectionKey: String, section: JSONObject): String {
    return when (sectionKey) {
      "nextPrayer" ->
        listOf(section.optString("prayerName"), section.optString("prayerTime"))
          .filter { it.isNotBlank() }
          .joinToString(" · ")
          .ifBlank { section.optString("lockScreenLine") }
      "progress" -> section.optString("progressLabel", section.optString("summary"))
      "streak" -> section.optString("streakLabel", section.optString("summary"))
      "qaza" -> section.opt("remaining")?.toString() ?: section.optString("summary")
      "ramadan" ->
        listOf(section.optString("suhoorTime"), section.optString("iftarTime"))
          .filter { it.isNotBlank() }
          .joinToString(" / ")
          .ifBlank { section.optString("countdownLabel") }
      "khatm" -> section.optString("progressLabel", section.optString("summary"))
      "dailyHadith" -> section.optString("reference", section.optString("lockScreenLine"))
      "hijriDate" -> section.optString("hijriDate", section.optString("summary"))
      "qibla" -> section.optString("bearingLabel", section.optString("summary"))
      else -> section.optString("lockScreenLine", section.optString("summary"))
    }
  }
}
