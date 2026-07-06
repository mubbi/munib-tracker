export type WebShareSnapshotOptions = {
  filename: string;
  dialogTitle: string;
  message?: string;
};

export function isNavigatorShareAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === "AbortError") ||
    (error instanceof Error && error.name === "AbortError")
  );
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

/** Decode a data URI to Blob without fetch (CSP connect-src blocks data: URLs). */
export function dataUriToBlob(dataUri: string, fallbackMime = "image/png"): Blob {
  if (!dataUri.startsWith("data:")) {
    throw new Error("INVALID_DATA_URI");
  }
  const commaIndex = dataUri.indexOf(",");
  if (commaIndex === -1) {
    throw new Error("INVALID_DATA_URI");
  }

  const header = dataUri.slice(5, commaIndex);
  const payload = dataUri.slice(commaIndex + 1);
  const mimeType = header.replace(/;base64$/i, "").replace(/;base64/i, "") || fallbackMime;

  if (/;base64/i.test(header)) {
    return base64ToBlob(payload, mimeType);
  }

  const decoded = decodeURIComponent(payload);
  const bytes = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; i += 1) {
    bytes[i] = decoded.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

export function downloadSnapshotOnWeb(dataUri: string, filename: string): void {
  const a = document.createElement("a");
  a.href = dataUri;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/** Web Share API when available (mobile browsers); otherwise download the PNG. */
export async function shareSnapshotOnWeb(
  dataUri: string,
  options: WebShareSnapshotOptions,
): Promise<void> {
  const blob = dataUriToBlob(dataUri);
  const file = new globalThis.File([blob], options.filename, { type: blob.type || "image/png" });
  const sharePayload: ShareData = {
    files: [file],
    title: options.dialogTitle,
    ...(options.message ? { text: options.message } : {}),
  };

  if (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    (typeof navigator.canShare !== "function" || navigator.canShare(sharePayload))
  ) {
    try {
      await navigator.share(sharePayload);
      return;
    } catch (error) {
      if (isNavigatorShareAbortError(error)) return;
    }
  }

  downloadSnapshotOnWeb(dataUri, options.filename);
}
