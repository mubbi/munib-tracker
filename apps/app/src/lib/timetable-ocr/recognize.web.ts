import type { OcrResult, OcrToken } from "@munib-tracker/shared/timetable-parser";

/**
 * NF-3.12 web text recognition: Tesseract.js (WASM) running in this browser.
 * Lazy-loaded with a dynamic `import()` so it never lands in the common chunk
 * (docs/PROFILING.md). The engine + language data are downloaded once, after
 * the user agrees (sizes below), and cached by the browser (IndexedDB). The
 * photo itself is read locally and never uploaded (D3).
 */

export type OcrAvailability = "native" | "wasm" | "unavailable";

/** Bytes fetched on first use (jsDelivr, tesseract.js 7.0.0 + 4.0.0_best_int data). */
export const WEB_OCR_DOWNLOAD = {
  engine: 3_899_472 + 111_307,
  eng: 2_952_873,
  ara: 1_661_906,
} as const;

const READY_KEY = "munib.timetableOcr.dataAccepted";

export function ocrAvailability(): OcrAvailability {
  return typeof window !== "undefined" && typeof WebAssembly === "object" ? "wasm" : "unavailable";
}

export function ocrDownloadBytes(options: { arabic?: boolean } = {}): number {
  return (
    WEB_OCR_DOWNLOAD.engine + WEB_OCR_DOWNLOAD.eng + (options.arabic ? WEB_OCR_DOWNLOAD.ara : 0)
  );
}

/** True once the user accepted (and completed) the one-time download in this browser. */
export function ocrDownloadAccepted(): boolean {
  try {
    return globalThis.localStorage?.getItem(READY_KEY) === "1";
  } catch {
    return false;
  }
}

function markAccepted(): void {
  try {
    globalThis.localStorage?.setItem(READY_KEY, "1");
  } catch {
    /* private mode — ask again next time */
  }
}

/** IndexedDB database tesseract.js caches its language data in (`idb-keyval`'s default). */
export const TESSERACT_CACHE_DB = "keyval-store";

/**
 * "Reset app data": forgets the one-time download consent and deletes the
 * cached Tesseract language data from this browser. Never throws.
 */
export async function clearOcrBrowserData(): Promise<void> {
  try {
    globalThis.localStorage?.removeItem(READY_KEY);
  } catch {
    /* storage blocked */
  }
  const idb = (globalThis as { indexedDB?: IDBFactory }).indexedDB;
  if (!idb) return;
  await new Promise<void>((resolve) => {
    try {
      const request = idb.deleteDatabase(TESSERACT_CACHE_DB);
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
      request.onblocked = () => resolve();
    } catch {
      resolve();
    }
  });
}

type TesseractModule = typeof import("tesseract.js");

/** Image size, read locally (only used for diagnostics; the parser needs boxes, not size). */
function imageSize(uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    if (typeof Image === "undefined") {
      resolve({ width: 0, height: 0 });
      return;
    }
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = uri;
  });
}

export async function recognizeImage(
  uri: string,
  options: { arabic?: boolean } = {},
): Promise<OcrResult> {
  const mod = await import("tesseract.js");
  const Tesseract = ((mod as { default?: TesseractModule }).default ?? mod) as TesseractModule;
  const worker = await Tesseract.createWorker(options.arabic ? ["eng", "ara"] : ["eng"]);
  try {
    const [{ data }, size] = await Promise.all([
      worker.recognize(uri, {}, { blocks: true }),
      imageSize(uri),
    ]);
    markAccepted();
    const tokens: OcrToken[] = [];
    for (const block of data.blocks ?? []) {
      for (const paragraph of block.paragraphs) {
        for (const line of paragraph.lines) {
          for (const word of line.words) {
            const { x0, y0, x1, y1 } = word.bbox;
            tokens.push({
              text: word.text,
              conf: word.confidence / 100,
              box: { x: x0, y: y0, w: x1 - x0, h: y1 - y0 },
            });
          }
        }
      }
    }
    return { tokens, ...size };
  } finally {
    await worker.terminate().catch(() => undefined);
  }
}
