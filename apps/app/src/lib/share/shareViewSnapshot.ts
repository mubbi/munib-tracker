import { Directory, File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import type { RefObject } from "react";
import { Platform, Share, type View, type ViewStyle } from "react-native";
import { captureRef } from "react-native-view-shot";

import { runWhenIdle } from "@/lib/run-when-idle";
import { resolveViewHostElement } from "@/lib/share/resolveViewHostElement";
import type { WebShareSnapshotResult } from "@/lib/share/shareViewSnapshotWeb";
import { shareSnapshotOnWeb } from "@/lib/share/shareViewSnapshotWeb";

/** Web-only: park the host far left so html2canvas can capture without flashing on screen. */
export const SHARE_SNAPSHOT_OFFSCREEN_LEFT = -12_000;

/** Web: fixed off-screen host so html2canvas can capture without flashing on screen. */
export const SHARE_SNAPSHOT_WEB_HOST_STYLE = {
  position: "fixed",
  left: SHARE_SNAPSHOT_OFFSCREEN_LEFT,
  zIndex: -1,
} as ViewStyle;

/** Native: park capture host off-screen on Android; iOS keeps opacity 0 in-tree for QR layout. */
export const SHARE_SNAPSHOT_NATIVE_HOST_STYLE =
  Platform.OS === "ios"
    ? ({ left: 0, opacity: 0, zIndex: -1 } as const)
    : ({
        left: SHARE_SNAPSHOT_OFFSCREEN_LEFT,
        opacity: 0,
        zIndex: -1,
      } as const);

const LAYOUT_WAIT_MAX_FRAMES = 120;

/** Poll until a capture ref is attached (e.g. after lazy-mounting an off-screen snapshot). */
export function waitForViewRef(ref: RefObject<View | null>): Promise<boolean> {
  return new Promise((resolve) => {
    let frames = 0;
    const step = () => {
      if (ref.current != null) {
        resolve(true);
        return;
      }
      frames += 1;
      if (frames >= LAYOUT_WAIT_MAX_FRAMES) {
        resolve(false);
        return;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

export type ShareViewSnapshotOptions = {
  filename: string;
  dialogTitle: string;
  /** Plain-text body to share alongside the image. */
  message?: string;
  snapshotContentContainer?: boolean;
  beforeCapture?: () => Promise<void>;
  afterCapture?: () => void | Promise<void>;
};

const SHARE_SNAPSHOTS_DIR = "share-snapshots";

function waitForIdle(): Promise<void> {
  return new Promise((resolve) => {
    runWhenIdle(() => {
      setTimeout(resolve, 150);
    });
  });
}

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

function shareSnapshotsDirectory(): Directory {
  const dir = new Directory(Paths.cache, SHARE_SNAPSHOTS_DIR);
  if (!dir.exists) {
    dir.create({ intermediates: true, idempotent: true });
  }
  return dir;
}

function deleteCachedSnapshot(uri: string): void {
  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {
    // Best-effort cleanup only.
  }
}

export function toLocalFileUri(pathOrUri: string): string {
  if (pathOrUri.startsWith("file://")) return pathOrUri;
  return `file://${pathOrUri.startsWith("/") ? pathOrUri : `/${pathOrUri}`}`;
}

function persistNamedSnapshot(sourceUri: string, filename: string): string {
  const source = new File(toLocalFileUri(sourceUri));
  const dest = new File(shareSnapshotsDirectory(), filename);
  if (dest.exists) dest.delete();
  source.copySync(dest);
  deleteCachedSnapshot(source.uri);
  return dest.uri;
}

function resolveCaptureTarget(target: View): View | HTMLElement {
  if (Platform.OS === "web") {
    const host = resolveViewHostElement(target);
    if (host == null) {
      throw new Error("SHARE_SNAPSHOT_NO_VIEW");
    }
    return host;
  }
  return target;
}

export type ShareViewSnapshotResult = {
  web?: WebShareSnapshotResult;
};

/** Capture a mounted view and open the system share sheet with image (+ optional text). */
export async function shareViewSnapshot(
  viewRef: RefObject<View | null>,
  options: ShareViewSnapshotOptions,
): Promise<ShareViewSnapshotResult> {
  if (Platform.OS !== "web") {
    await waitForIdle();
  }
  await options.beforeCapture?.();
  await waitForPaint();

  const target = viewRef.current;
  if (target == null) {
    throw new Error("SHARE_SNAPSHOT_NO_VIEW");
  }

  const captureTarget = resolveCaptureTarget(target);
  const capturedUri = await captureRef(captureTarget, {
    format: "png",
    quality: 1,
    result: Platform.OS === "web" ? "data-uri" : "tmpfile",
    snapshotContentContainer: options.snapshotContentContainer ?? false,
  });

  await options.afterCapture?.();

  if (Platform.OS === "web") {
    const web = await shareSnapshotOnWeb(capturedUri, options);
    return { web };
  }

  const shareUri = persistNamedSnapshot(capturedUri, options.filename);
  await waitForIdle();

  try {
    if (options.message) {
      if (Platform.OS === "ios") {
        await Share.share({ message: options.message, url: shareUri });
      } else {
        await Share.share({
          message: options.message,
          url: shareUri,
          title: options.dialogTitle,
        });
      }
      return {};
    }

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(shareUri, {
        mimeType: "image/png",
        dialogTitle: options.dialogTitle,
        UTI: "public.png",
      });
      return {};
    }

    await Share.share({ url: shareUri, title: options.dialogTitle });
  } finally {
    deleteCachedSnapshot(shareUri);
  }

  return {};
}
