export type WebShareSnapshotOptions = {
  filename: string;
  dialogTitle: string;
  message?: string;
};

export type WebShareSnapshotResult =
  | { status: "shared" | "aborted" }
  | { status: "needsUserGesture"; file: File; payloads: ShareData[] }
  | { status: "unavailable" };

export function isNavigatorShareAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === "AbortError") ||
    (error instanceof Error && error.name === "AbortError")
  );
}

export function isNavigatorShareNotAllowedError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === "NotAllowedError") ||
    (error instanceof Error &&
      (error.name === "NotAllowedError" ||
        /not allowed|user gesture|activation/i.test(error.message)))
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

function canSharePayload(payload: ShareData): boolean {
  if (typeof navigator.canShare !== "function") return true;
  try {
    return navigator.canShare(payload);
  } catch {
    return false;
  }
}

type ShareAttempt = "shared" | "aborted" | "failed" | "notAllowed";

async function attemptNavigatorShare(payload: ShareData): Promise<ShareAttempt> {
  try {
    await navigator.share(payload);
    return "shared";
  } catch (error) {
    if (isNavigatorShareAbortError(error)) return "aborted";
    if (isNavigatorShareNotAllowedError(error)) return "notAllowed";
    return "failed";
  }
}

function buildSharePayloads(file: File, options: WebShareSnapshotOptions): ShareData[] {
  const fileOnly: ShareData = { files: [file], title: options.dialogTitle };
  if (!options.message) return [fileOnly];
  return [fileOnly, { files: [file], title: options.dialogTitle, text: options.message }];
}

async function tryAllSharePayloads(payloads: ShareData[]): Promise<ShareAttempt> {
  let sawNotAllowed = false;

  for (const payload of payloads) {
    if (!canSharePayload(payload)) continue;
    const result = await attemptNavigatorShare(payload);
    if (result === "shared" || result === "aborted") return result;
    if (result === "notAllowed") sawNotAllowed = true;
  }

  for (const payload of payloads) {
    const result = await attemptNavigatorShare(payload);
    if (result === "shared" || result === "aborted") return result;
    if (result === "notAllowed") sawNotAllowed = true;
  }

  return sawNotAllowed ? "notAllowed" : "failed";
}

/** Share a file that was already prepared (second tap after gesture timeout). */
export async function sharePreparedWebFile(payloads: ShareData[]): Promise<WebShareSnapshotResult> {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
    return { status: "unavailable" };
  }

  const result = await tryAllSharePayloads(payloads);
  if (result === "shared") return { status: "shared" };
  if (result === "aborted") return { status: "aborted" };
  if (result === "notAllowed") {
    return { status: "needsUserGesture", file: payloads[0]?.files?.[0] as File, payloads };
  }
  return { status: "unavailable" };
}

/**
 * Open the Web Share sheet with the branded image. File-only first — combining
 * files + text makes canShare() return false on many mobile browsers.
 *
 * When the browser rejects share because the user-gesture window expired (common
 * on the first cold capture), we return `needsUserGesture` instead of downloading
 * so the caller can prompt a quick re-tap with the already-prepared file.
 */
export async function shareSnapshotOnWeb(
  dataUri: string,
  options: WebShareSnapshotOptions,
): Promise<WebShareSnapshotResult> {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
    downloadSnapshotOnWeb(dataUri, options.filename);
    return { status: "unavailable" };
  }

  const blob = dataUriToBlob(dataUri);
  const file = new globalThis.File([blob], options.filename, { type: blob.type || "image/png" });
  const payloads = buildSharePayloads(file, options);

  const result = await tryAllSharePayloads(payloads);
  if (result === "shared") return { status: "shared" };
  if (result === "aborted") return { status: "aborted" };
  if (result === "notAllowed") {
    return { status: "needsUserGesture", file, payloads };
  }

  downloadSnapshotOnWeb(dataUri, options.filename);
  return { status: "unavailable" };
}
