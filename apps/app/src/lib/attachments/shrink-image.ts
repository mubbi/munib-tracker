import { Platform } from "react-native";

export type ShrunkImage = {
  bytes: Uint8Array;
  /** Object URL for the re-encoded image (web). */
  uri: string;
  mimeType: "image/jpeg";
};

/** Longest edge / JPEG quality pairs, tried in order until the result fits. */
const STEPS: ReadonlyArray<readonly [maxEdge: number, quality: number]> = [
  [2048, 0.82],
  [1600, 0.76],
  [1280, 0.7],
  [1024, 0.62],
  [800, 0.5],
];

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

/**
 * Web: downscale + re-encode an oversized image so it fits the upload cap.
 * Browsers hand over the original file (phone photos are routinely 3–8 MB),
 * unlike the native pickers which compress at pick time.
 *
 * Returns null when it cannot help (native, no canvas, undecodable image, or
 * still too large) — callers then report the file as too large.
 */
export async function shrinkImageForUpload(
  bytes: Uint8Array,
  mimeType: string,
  maxBytes: number,
): Promise<ShrunkImage | null> {
  if (
    Platform.OS !== "web" ||
    typeof document === "undefined" ||
    typeof createImageBitmap !== "function"
  ) {
    return null;
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(new Blob([bytes as BlobPart], { type: mimeType }));
  } catch {
    return null;
  }

  try {
    for (const [maxEdge, quality] of STEPS) {
      const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      if (!context) return null;
      // JPEG has no alpha — flatten transparent PNG/WebP onto white, not black.
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      const blob = await canvasToJpeg(canvas, quality);
      if (blob && blob.size > 0 && blob.size <= maxBytes) {
        return {
          bytes: new Uint8Array(await blob.arrayBuffer()),
          uri: URL.createObjectURL(blob),
          mimeType: "image/jpeg",
        };
      }
    }
    return null;
  } finally {
    bitmap.close();
  }
}
