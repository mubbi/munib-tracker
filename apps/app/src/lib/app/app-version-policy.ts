import type { AppVersionMeta, UpdateRequired } from "@munib-tracker/api-client";
import { isVersionLessThan } from "@/lib/semver";

export function isPendingUpdate(meta: AppVersionMeta | null): meta is AppVersionMeta {
  return meta != null && meta.updateRequired !== "none";
}

export function shouldShowUpdateModal(
  meta: AppVersionMeta | null,
  promptDismissed: boolean,
): boolean {
  if (!isPendingUpdate(meta)) return false;
  if (meta.updateRequired === "hard") return true;
  return !promptDismissed;
}

/** Hard update: replace app UI (not only a dismissible overlay). */
export function isHardUpdateBlockingApp(
  updateRequired: UpdateRequired,
  showUpdateModal: boolean,
  versionMeta: AppVersionMeta | null,
): boolean {
  return updateRequired === "hard" && showUpdateModal && versionMeta != null;
}

/** Settings tab dot + section: only after user dismissed the soft-update modal. */
export function shouldShowSettingsUpdateBadge(
  meta: AppVersionMeta | null,
  promptDismissed: boolean,
): boolean {
  if (!isPendingUpdate(meta)) return false;
  if (meta.updateRequired === "hard") return false;
  return promptDismissed;
}

export function clientNeedsUpdate(clientVersion: string, meta: AppVersionMeta): boolean {
  if (meta.updateRequired === "hard") {
    return isVersionLessThan(clientVersion, meta.minHardVersion);
  }
  if (meta.updateRequired === "soft") {
    return (
      isVersionLessThan(clientVersion, meta.minSoftVersion) ||
      isVersionLessThan(clientVersion, meta.latestVersion)
    );
  }
  return false;
}

export function normalizeIncomingVersionMeta(
  _prev: AppVersionMeta | null,
  incoming: AppVersionMeta,
  clientVersion: string,
): AppVersionMeta | null {
  if (incoming.updateRequired === "none") return null;
  if (!clientNeedsUpdate(clientVersion, incoming)) return null;
  return incoming;
}
