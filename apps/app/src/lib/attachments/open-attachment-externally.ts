import * as Sharing from "expo-sharing";
import { Linking, Platform, Share } from "react-native";

import { downloadAuthedFile, fetchAuthedBlob } from "@/lib/attachments/authed-media";
import { cacheDirectoryUri, ensureDirectory } from "@/lib/native-file-store";
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
  const baseDir = cacheDirectoryUri();
  if (!baseDir) {
    throw new Error("No cache directory available");
  }
  const dir = `${baseDir}user-media-open/`;
  ensureDirectory(dir);
  const localUri = `${dir}${Date.now()}-${sanitizeFileName(fileName)}`;
  return downloadAuthedFile(remoteUri, localUri, headers);
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
      const blob = await fetchAuthedBlob(uri, headers);
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
