/**
 * NF-3.13 "never block" rules (Android). The focus lock must never block our
 * own app, the phone/dialer, SMS, emergency apps, or the default launcher and
 * settings. The Kotlin service enforces the same list
 * (`FocusLockAllowlist.kt`, kept in sync by `allowlist.test.ts`) plus the
 * device's *current* default dialer / SMS / launcher resolved at runtime.
 *
 * iOS needs no list: FamilyControls never shields Phone or emergency calls,
 * and the user picks apps through Apple's own picker.
 */

/** Packages that are never blocked, whatever the user selects. */
export const NEVER_BLOCK_PACKAGES: readonly string[] = [
  // Telephony + emergency
  "com.android.phone",
  "com.android.dialer",
  "com.google.android.dialer",
  "com.samsung.android.dialer",
  "com.android.server.telecom",
  "com.android.emergency",
  "com.google.android.apps.safetyhub",
  "com.android.cellbroadcastreceiver",
  "com.google.android.cellbroadcastreceiver",
  // SMS
  "com.android.mms",
  "com.google.android.apps.messaging",
  "com.samsung.android.messaging",
  // System UI, settings, launchers
  "android",
  "com.android.systemui",
  "com.android.settings",
  "com.android.launcher3",
  "com.google.android.apps.nexuslauncher",
  "com.sec.android.app.launcher",
];

export interface AllowlistContext {
  /** Our own application id. */
  ownPackage: string;
  /** Current defaults resolved on the device (may be null when unknown). */
  defaultDialer?: string | null;
  defaultSms?: string | null;
  defaultLauncher?: string | null;
}

export function isNeverBlocked(pkg: string, ctx: AllowlistContext): boolean {
  if (!pkg) return true;
  if (pkg === ctx.ownPackage) return true;
  if (pkg === ctx.defaultDialer || pkg === ctx.defaultSms || pkg === ctx.defaultLauncher) {
    return true;
  }
  return NEVER_BLOCK_PACKAGES.includes(pkg);
}

/** The user's selection minus anything that must stay reachable (deduped, order kept). */
export function effectiveBlocklist(selected: readonly string[], ctx: AllowlistContext): string[] {
  return [...new Set(selected)].filter((pkg) => !isNeverBlocked(pkg, ctx));
}

export interface LaunchableApp {
  packageName: string;
  label: string;
}

/** Apps offered in the Android picker: launchable, not on the never-block list, sorted by label. */
export function pickableApps(
  apps: readonly LaunchableApp[],
  ctx: AllowlistContext,
  locale?: string,
): LaunchableApp[] {
  const seen = new Set<string>();
  return apps
    .filter((app) => {
      if (seen.has(app.packageName) || isNeverBlocked(app.packageName, ctx)) return false;
      seen.add(app.packageName);
      return true;
    })
    .sort((a, b) => a.label.localeCompare(b.label, locale));
}
