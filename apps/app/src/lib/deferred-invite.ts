import { restorableSharePath } from "@/lib/app-links";

/**
 * Deferred deep links: a shared / QR link (circle or group-khatm invite,
 * child-device QR, TV sign-in QR) opened on a phone WITHOUT the app goes to the
 * store (`OpenInAppBanner`). After install, the first launch picks the link up:
 *
 * - Android: the web hand-off puts the path in the Play URL's `referrer`
 *   (`mt_link=<path>`), which the Play Install Referrer API returns once installed.
 * - iOS: there is no install referrer, so the web hand-off copies the link to the
 *   clipboard; the app only *checks* that the clipboard holds something (no
 *   prompt) and offers the system Paste button — the user decides to share it.
 *
 * One check per install, only before onboarding is complete, and only within
 * {@link DEFERRED_INVITE_WINDOW_MS} of install, so updating users never see it.
 */

/** Play `referrer` key carrying the app path (set by `open-in-app.ts`). */
export const REFERRER_LINK_KEY = "mt_link";

/** How long after install a deferred link is still picked up. */
export const DEFERRED_INVITE_WINDOW_MS = 24 * 60 * 60 * 1000;

export type DeferredInvite = { kind: "open"; path: string } | { kind: "askPaste" };

export type DeferredInviteDeps = {
  os: "ios" | "android" | "other";
  /** True once this install has already been checked (persisted). */
  alreadyChecked: () => Promise<boolean>;
  markChecked: () => Promise<void>;
  installedAt: () => Promise<Date | null>;
  now: () => number;
  /** The URL the app was cold-started with, if any (a real link wins). */
  initialUrlPath: () => Promise<string | null>;
  /** Android: raw Play Install Referrer string. */
  installReferrer: () => Promise<string>;
  /** iOS: whether the clipboard holds a URL or text — must not read it. */
  clipboardHasContent: () => Promise<boolean>;
};

/** `mt_link=%2Fcircle%2Fjoin%2FABC&utm_source=…` → `/circle/join/ABC` (validated). */
export function pathFromInstallReferrer(referrer: string | null | undefined): string | null {
  if (!referrer) return null;
  for (const part of referrer.split("&")) {
    const [key, ...rest] = part.split("=");
    if (key !== REFERRER_LINK_KEY) continue;
    try {
      return restorableSharePath(decodeURIComponent(rest.join("=").replace(/\+/g, " ")));
    } catch {
      return null;
    }
  }
  return null;
}

async function safe<T>(task: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await task();
  } catch {
    return fallback;
  }
}

/**
 * Decide, once per install, whether a deferred invite should open. Marks the
 * install as checked before reading anything, so it can never fire twice.
 */
export async function checkDeferredInvite(
  deps: DeferredInviteDeps,
): Promise<DeferredInvite | null> {
  if (deps.os === "other") return null;
  if (await safe(deps.alreadyChecked, true)) return null;
  await safe(deps.markChecked, undefined);

  const installedAt = await safe(deps.installedAt, null);
  if (!installedAt || deps.now() - installedAt.getTime() > DEFERRED_INVITE_WINDOW_MS) return null;
  if (await safe(deps.initialUrlPath, null)) return null;

  if (deps.os === "android") {
    const path = pathFromInstallReferrer(await safe(deps.installReferrer, ""));
    return path ? { kind: "open", path } : null;
  }
  return (await safe(deps.clipboardHasContent, false)) ? { kind: "askPaste" } : null;
}
