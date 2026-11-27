package expo.modules.munibappicon

import android.app.Activity
import android.app.Application
import android.content.ComponentName
import android.content.Context
import android.content.pm.PackageManager
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/**
 * Seasonal app icons (NF-2.23b) on Android: one launcher `activity-alias` per icon
 * (`.AppIconDefault`, `.AppIcon<Id>` — see app.plugin.js), exactly one enabled.
 *
 * Toggling launcher components while the app is on screen can close it, so
 * [setIconName] only records the choice; the swap happens once the whole app has
 * gone to the background (no started activity for [BACKGROUND_DELAY_MS]). Until then
 * [getIconName] reports the pending icon so JS never re-requests it.
 */
class MunibAppIconModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MunibAppIcon")

    OnCreate {
      val app = appContext.reactContext?.applicationContext as? Application ?: return@OnCreate
      BackgroundWatcher.register(app, hasStartedActivity = appContext.currentActivity != null) {
        applyPending(app)
      }
    }

    AsyncFunction("isSupported") { aliases(context).isNotEmpty() }

    /** The active (or pending) alternate icon id, or null for the default icon. */
    AsyncFunction("getIconName") {
      val queued = synchronized(lock) { pending }
      if (queued != null) queued.id else currentAlias(context)?.let { idForAlias(it) }
    }

    /**
     * Requests `name` (null = default icon). Resolves true when a change was queued,
     * false when that icon is already active. Rejects unknown ids.
     */
    AsyncFunction("setIconName") { name: String? ->
      val ctx = context
      val target = aliases(ctx).firstOrNull { idForAlias(it) == name }
        ?: throw IllegalArgumentException("Unknown app icon: $name")
      val current = currentAlias(ctx)
      synchronized(lock) {
        pending = if (current == target) null else Pending(name, target)
        pending != null
      }
    }
  }

  private val context: Context
    get() = requireNotNull(appContext.reactContext) { "React context is not available" }

  private data class Pending(val id: String?, val component: String)

  companion object {
    private const val TAG = "MunibAppIcon"
    private const val ALIAS_MARKER = ".AppIcon"
    private const val DEFAULT_SUFFIX = "Default"
    private const val BACKGROUND_DELAY_MS = 700L

    private val lock = Any()
    private var pending: Pending? = null

    /** Every launcher alias this module manages (fully-qualified class names). */
    private fun aliases(ctx: Context): List<String> {
      val flags = PackageManager.GET_ACTIVITIES or PackageManager.GET_DISABLED_COMPONENTS
      val activities = try {
        @Suppress("DEPRECATION")
        ctx.packageManager.getPackageInfo(ctx.packageName, flags).activities
      } catch (e: Exception) {
        Log.w(TAG, "Could not read activities", e)
        null
      }
      return activities.orEmpty()
        .filter { it.targetActivity != null && it.name.substringAfterLast('.').startsWith("AppIcon") }
        .map { it.name }
    }

    /** `….AppIconLastTen` → `lastTen`; `….AppIconDefault` → null. */
    private fun idForAlias(alias: String): String? {
      val suffix = alias.substringAfterLast(ALIAS_MARKER)
      if (suffix == DEFAULT_SUFFIX) return null
      return suffix.replaceFirstChar { it.lowercaseChar() }
    }

    private fun isEnabled(ctx: Context, alias: String): Boolean {
      val pm = ctx.packageManager
      val component = ComponentName(ctx.packageName, alias)
      return when (pm.getComponentEnabledSetting(component)) {
        PackageManager.COMPONENT_ENABLED_STATE_ENABLED -> true
        PackageManager.COMPONENT_ENABLED_STATE_DEFAULT -> try {
          @Suppress("DEPRECATION")
          pm.getActivityInfo(component, PackageManager.GET_DISABLED_COMPONENTS).enabled
        } catch (e: Exception) {
          false
        }
        else -> false
      }
    }

    private fun currentAlias(ctx: Context): String? = aliases(ctx).firstOrNull { isEnabled(ctx, it) }

    /** Enables the pending alias first (never zero launcher entries), then disables the rest. */
    private fun applyPending(ctx: Context) {
      val next = synchronized(lock) { pending.also { pending = null } } ?: return
      val pm = ctx.packageManager
      try {
        pm.setComponentEnabledSetting(
          ComponentName(ctx.packageName, next.component),
          PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
          PackageManager.DONT_KILL_APP,
        )
        for (alias in aliases(ctx)) {
          if (alias == next.component) continue
          pm.setComponentEnabledSetting(
            ComponentName(ctx.packageName, alias),
            PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
            PackageManager.DONT_KILL_APP,
          )
        }
      } catch (e: Exception) {
        Log.e(TAG, "Could not switch the app icon to ${next.id ?: "default"}", e)
      }
    }
  }

  /**
   * Process-wide "app went to the background" signal — the same rule as AndroidX
   * `ProcessLifecycleOwner` (no started activity for a short grace period, ignoring
   * configuration changes) without the extra dependency.
   */
  private object BackgroundWatcher : Application.ActivityLifecycleCallbacks {
    private val handler = Handler(Looper.getMainLooper())
    private var started = 0
    private var registered = false
    private var onBackground: (() -> Unit)? = null
    private val check = Runnable { if (started == 0) onBackground?.invoke() }

    fun register(app: Application, hasStartedActivity: Boolean, callback: () -> Unit) {
      handler.post {
        onBackground = callback
        if (registered) return@post
        registered = true
        // The module is created lazily, after MainActivity has already started.
        started = if (hasStartedActivity) 1 else 0
        app.registerActivityLifecycleCallbacks(this)
      }
    }

    override fun onActivityStarted(activity: Activity) {
      started += 1
      handler.removeCallbacks(check)
    }

    override fun onActivityStopped(activity: Activity) {
      started = (started - 1).coerceAtLeast(0)
      if (started == 0 && !activity.isChangingConfigurations) {
        handler.removeCallbacks(check)
        handler.postDelayed(check, BACKGROUND_DELAY_MS)
      }
    }

    override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) = Unit
    override fun onActivityResumed(activity: Activity) = Unit
    override fun onActivityPaused(activity: Activity) = Unit
    override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) = Unit
    override fun onActivityDestroyed(activity: Activity) = Unit
  }
}
