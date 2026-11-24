package expo.modules.munibfocuslock

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.json.JSONArray
import org.json.JSONObject

/**
 * JS ↔ native contract for NF-3.13 on Android (see `src/lib/focus-lock/native.ts`).
 * The picker is a JS list fed by `listLaunchableApps` (launcher `<queries>` only,
 * no QUERY_ALL_PACKAGES); `pickApps` just reports the saved count.
 */
class MunibFocusLockModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  override fun definition() = ModuleDefinition {
    Name("MunibFocusLock")

    // TYPE_APPLICATION_OVERLAY + UsageEvents need API 26+; older devices get the soft prompt.
    Function("isSupported") { Build.VERSION.SDK_INT >= 26 }

    AsyncFunction("authorizationStatus") {
      if (FocusLockScheduler.hasCorePermissions(context)) "granted" else "notDetermined"
    }

    AsyncFunction("requestAuthorization") {
      val ctx = context
      when {
        !FocusLockPermissions.usageAccess(ctx) -> {
          FocusLockPermissions.open(ctx, "usageAccess")
          "denied"
        }
        !FocusLockPermissions.overlay(ctx) -> {
          FocusLockPermissions.open(ctx, "overlay")
          "denied"
        }
        else -> "granted"
      }
    }

    AsyncFunction("permissions") {
      val ctx = context
      mapOf(
        "usageAccess" to FocusLockPermissions.usageAccess(ctx),
        "overlay" to FocusLockPermissions.overlay(ctx),
        "exactAlarm" to FocusLockPermissions.exactAlarm(ctx),
        "notifications" to FocusLockPermissions.notifications(ctx),
        "batteryUnrestricted" to FocusLockPermissions.batteryUnrestricted(ctx),
      )
    }

    AsyncFunction("openSettings") { page: String -> FocusLockPermissions.open(context, page) }

    AsyncFunction("listLaunchableApps") {
      val ctx = context
      val pm = ctx.packageManager
      val launcher = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
      val infos = if (Build.VERSION.SDK_INT >= 33) {
        pm.queryIntentActivities(launcher, PackageManager.ResolveInfoFlags.of(0L))
      } else {
        @Suppress("DEPRECATION")
        pm.queryIntentActivities(launcher, 0)
      }
      val apps = infos
        .map { it.activityInfo.packageName to it.loadLabel(pm).toString() }
        .distinctBy { it.first }
        .map { (pkg, label) -> mapOf("packageName" to pkg, "label" to label) }
      val d = FocusLockAllowlist.defaults(ctx)
      mapOf(
        "apps" to apps,
        "context" to mapOf(
          "ownPackage" to d.ownPackage,
          "defaultDialer" to d.dialer,
          "defaultSms" to d.sms,
          "defaultLauncher" to d.launcher,
        ),
      )
    }

    AsyncFunction("blockedPackages") { FocusLockStore.blocked(context).toList() }

    AsyncFunction("setBlockedPackages") { packages: List<String> ->
      val ctx = context
      val effective = FocusLockAllowlist.effective(packages, FocusLockAllowlist.defaults(ctx))
      FocusLockStore.setBlocked(ctx, effective)
      mapOf("count" to effective.size)
    }

    AsyncFunction("pickApps") { mapOf("count" to FocusLockStore.blocked(context).size) }

    AsyncFunction("selectionCount") { FocusLockStore.blocked(context).size }

    AsyncFunction("setPlan") { windows: List<Map<String, Any?>>, cfg: Map<String, Any?> ->
      val ctx = context
      val parsed = windows.mapNotNull { w ->
        val start = FocusLockStore.parseIso(w["start"] as? String) ?: return@mapNotNull null
        val end = FocusLockStore.parseIso(w["end"] as? String) ?: return@mapNotNull null
        FocusLockStore.Window(
          id = w["id"] as? String ?: return@mapNotNull null,
          prayer = w["prayer"] as? String ?: "",
          title = w["title"] as? String ?: "",
          body = w["body"] as? String ?: "",
          start = start,
          end = end,
        ).takeIf { it.end > it.start }
      }
      FocusLockStore.savePlan(ctx, parsed, toJson(cfg))
      FocusLockScheduler.rearm(ctx)
    }

    AsyncFunction("endWindowNow") { id: String? ->
      val ctx = context
      val target = id ?: FocusLockStore.activeWindow(ctx)?.id
      if (target != null) FocusLockStore.markEnded(ctx, target)
      FocusLockScheduler.rearm(ctx)
    }

    AsyncFunction("status") {
      val ctx = context
      val active = FocusLockStore.activeWindow(ctx)
      mapOf(
        "active" to (active != null),
        "windowId" to active?.id,
        "emergencyLeft" to FocusLockStore.emergencyLeft(ctx),
        "emergencyUnlocks" to FocusLockStore.emergencyLog(ctx).map { FocusLockStore.formatIso(it) },
        "endedIds" to FocusLockStore.ended(ctx).toList(),
      )
    }

    AsyncFunction("reset") {
      val ctx = context
      FocusLockScheduler.cancelAll(ctx)
      FocusLockStore.reset(ctx)
    }
  }

  @Suppress("UNCHECKED_CAST")
  private fun toJson(value: Any?): Any? = when (value) {
    null -> JSONObject.NULL
    is Map<*, *> -> JSONObject().apply {
      for ((k, v) in value) put(k.toString(), toJson(v))
    }
    is List<*> -> JSONArray().apply { value.forEach { put(toJson(it)) } }
    else -> value
  }

  private fun toJson(map: Map<String, Any?>): JSONObject = toJson(map as Any?) as JSONObject
}
