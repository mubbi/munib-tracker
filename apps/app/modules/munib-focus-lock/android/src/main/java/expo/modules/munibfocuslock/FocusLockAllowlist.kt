package expo.modules.munibfocuslock

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.provider.Telephony
import android.telecom.TelecomManager

/**
 * NF-3.13 "never block": our own app, phone/dialer, SMS, emergency apps, the
 * default launcher and Settings. The static list mirrors `NEVER_BLOCK_PACKAGES`
 * in `src/lib/focus-lock/allowlist.ts` (kept in sync by `allowlist.test.ts`);
 * the device's current default dialer / SMS / launcher are resolved at runtime.
 */
internal object FocusLockAllowlist {
  val NEVER_BLOCK: Set<String> = setOf(
    "com.android.phone",
    "com.android.dialer",
    "com.google.android.dialer",
    "com.samsung.android.dialer",
    "com.android.server.telecom",
    "com.android.emergency",
    "com.google.android.apps.safetyhub",
    "com.android.cellbroadcastreceiver",
    "com.google.android.cellbroadcastreceiver",
    "com.android.mms",
    "com.google.android.apps.messaging",
    "com.samsung.android.messaging",
    "android",
    "com.android.systemui",
    "com.android.settings",
    "com.android.launcher3",
    "com.google.android.apps.nexuslauncher",
    "com.sec.android.app.launcher",
  )

  data class Defaults(
    val ownPackage: String,
    val dialer: String?,
    val sms: String?,
    val launcher: String?,
  )

  fun defaults(context: Context): Defaults {
    val dialer = try {
      (context.getSystemService(Context.TELECOM_SERVICE) as? TelecomManager)?.defaultDialerPackage
    } catch (_: Exception) {
      null
    }
    val sms = try {
      Telephony.Sms.getDefaultSmsPackage(context)
    } catch (_: Exception) {
      null
    }
    val home = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_HOME)
    val launcher = try {
      if (Build.VERSION.SDK_INT >= 33) {
        context.packageManager.resolveActivity(
          home,
          PackageManager.ResolveInfoFlags.of(PackageManager.MATCH_DEFAULT_ONLY.toLong()),
        )
      } else {
        @Suppress("DEPRECATION")
        context.packageManager.resolveActivity(home, PackageManager.MATCH_DEFAULT_ONLY)
      }?.activityInfo?.packageName
    } catch (_: Exception) {
      null
    }
    return Defaults(context.packageName, dialer, sms, launcher)
  }

  fun isNeverBlocked(pkg: String, defaults: Defaults): Boolean =
    pkg.isEmpty() ||
      pkg == defaults.ownPackage ||
      pkg == defaults.dialer ||
      pkg == defaults.sms ||
      pkg == defaults.launcher ||
      pkg in NEVER_BLOCK

  fun effective(selected: Collection<String>, defaults: Defaults): Set<String> =
    selected.filterTo(LinkedHashSet()) { !isNeverBlocked(it, defaults) }
}
