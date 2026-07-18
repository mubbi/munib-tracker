import { cacheDirectory, downloadAsync, makeDirectoryAsync } from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Linking, Platform, Share } from "react-native";

import { runWhenIdle } from "@/lib/run-when-idle";

function waitForIdle(): Promise<void> {
  return new Promise((resolve) => {
    runWhenIdle(() => {
      setTimeout(resolve, 150);
    });
  });
}

function sanitizeFileName(fileName: string): string {
  const base = fileName.replace(/[/\\?%*:|"<>]/g, "_").trim() || "attachment";
  return base.slice(0, 120);
}

/**
 * Download a remote attachment (with optional auth headers) into the cache dir
 * so native share / open can use a local `file://` URI.
 */
async function downloadRemoteAttachment(
  remoteUri: string,
  fileName: string,
  headers?: Record<string, string>,
): Promise<string> {
  const baseDir = cacheDirectory;
  if (!baseDir) {
    throw new Error("No cache directory available");
  }
  const dir = `${baseDir}user-media-open/`;
  await makeDirectoryAsync(dir, { intermediates: true });
  const localUri = `${dir}${Date.now()}-${sanitizeFileName(fileName)}`;
  const result = await downloadAsync(remoteUri, localUri, {
    headers: headers ?? {},
  });
  return result.uri;
}

/**
 * Open or share an attachment outside the in-app viewer (share sheet / new tab).
 * Web fetches bytes (cookies + optional Bearer) then opens a blob URL.
 * Native downloads authenticated remotes first, then uses the share sheet.
 */
export async function openAttachmentExternally(options: {
  uri: string;
  mimeType?: string;
  fileName: string;
  dialogTitle: string;
  /** Auth headers for private API media (native Bearer; omit for web cookie sessions). */
  headers?: Record<string, string>;
}): Promise<void> {
  const { uri, mimeType, fileName, dialogTitle, headers } = options;

  if (Platform.OS === "web") {
    if (typeof window === "undefined") return;

    if (uri.startsWith("http")) {
      const response = await fetch(uri, {
        headers,
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Failed to open attachment (${response.status})`);
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, "_blank", "noopener,noreferrer");
      // Keep the blob alive long enough for the new tab to load.
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
      return;
    }

    window.open(uri, "_blank", "noopener,noreferrer");
    return;
  }

  await waitForIdle();

  let openUri = uri;
  if (uri.startsWith("http")) {
    openUri = await downloadRemoteAttachment(uri, fileName, headers);
  }

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(openUri, {
      mimeType: mimeType ?? "application/octet-stream",
      dialogTitle,
      UTI: mimeType === "application/pdf" ? "com.adobe.pdf" : undefined,
    });
    return;
  }

  try {
    await Share.share({ url: openUri, title: fileName });
  } catch {
    if (openUri.startsWith("http") || openUri.startsWith("file:")) {
      await Linking.openURL(openUri);
    }
  }
}
