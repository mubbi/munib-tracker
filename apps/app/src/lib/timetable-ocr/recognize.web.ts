import type { OcrResult, OcrToken } from "@munib-tracker/shared/timetable-parser";

import { type EnhanceOptions, enhanceForOcr } from "./enhance";
import { type FractionRect, toPixels, voteReadings } from "./regions";

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
type TesseractWorker = Awaited<ReturnType<TesseractModule["createWorker"]>>;
type RecognizeData = Awaited<ReturnType<TesseractWorker["recognize"]>>["data"];

async function loadTesseract(): Promise<TesseractModule> {
  const mod = await import("tesseract.js");
  return ((mod as { default?: TesseractModule }).default ?? mod) as TesseractModule;
}

/** The picked photo, decoded locally (never uploaded). */
function loadImage(uri: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (typeof Image === "undefined") {
      resolve(null);
      return;
    }
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = uri;
  });
}

function context2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D is not available");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return ctx;
}

function tokensOf(data: RecognizeData): OcrToken[] {
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
  return tokens;
}

async function recognizeSource(
  source: string | HTMLCanvasElement,
  options: { arabic?: boolean },
  size: { width: number; height: number },
): Promise<OcrResult> {
  const Tesseract = await loadTesseract();
  const worker = await Tesseract.createWorker(options.arabic ? ["eng", "ara"] : ["eng"]);
  try {
    const { data } = await worker.recognize(source, {}, { blocks: true });
    markAccepted();
    return { tokens: tokensOf(data), ...size };
  } finally {
    await worker.terminate().catch(() => undefined);
  }
}

export async function recognizeImage(
  uri: string,
  options: { arabic?: boolean } = {},
): Promise<OcrResult> {
  const img = await loadImage(uri);
  const size = img
    ? { width: img.naturalWidth, height: img.naturalHeight }
    : { width: 0, height: 0 };
  return recognizeSource(uri, options, size);
}

/** Long side the enhanced read upscales a small photo to (Tesseract wants ~20 px+ glyphs). */
const ENHANCED_LONG_SIDE = 1600;
const ENHANCED_MAX_SCALE = 4;
/** LED dot spacing fused by the enhanced read, in pixels of the original photo. */
const ENHANCED_DILATE = 2;

/**
 * Second read for a bright-on-dark board (LED / dot-matrix): upscaled, dots
 * fused into strokes, binarised. Null for an ordinary light sheet (the first
 * read was already the best one). Token boxes are in the upscaled pixel space
 * that `width` / `height` describe.
 */
export async function recognizeEnhanced(
  uri: string,
  options: { arabic?: boolean } = {},
): Promise<OcrResult | null> {
  const img = await loadImage(uri);
  if (!img || typeof document === "undefined") return null;
  const scale = Math.max(
    1,
    Math.min(
      ENHANCED_MAX_SCALE,
      ENHANCED_LONG_SIDE / Math.max(img.naturalWidth, img.naturalHeight),
    ),
  );
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = context2d(canvas);
  ctx.drawImage(img, 0, 0, width, height);
  const enhanced = enhanceForOcr(ctx.getImageData(0, 0, width, height), {
    dilate: ENHANCED_DILATE * scale,
  });
  if (!enhanced) return null;
  ctx.putImageData(new ImageData(enhanced.data, width, height), 0, 0);
  return recognizeSource(canvas, options, { width, height });
}

// ── Marked areas (guided mode) ──────────────────────────────────────────────

/** Height a marked area is scaled to before reading (digits ~40–50 px tall). */
const REGION_HEIGHT = 64;
const REGION_PADDING = 16;
/**
 * Enhancement variants read for each marked area; the readings vote. Chosen on
 * real board photos: plain binarising reads segment digits, blur + lit-only
 * reads dot-matrix digits, neither wins everywhere.
 */
const REGION_VARIANTS: readonly EnhanceOptions[] = [
  { force: true },
  { force: true, litOnly: true },
  { force: true, blur: 2 },
  { force: true, blur: 3, litOnly: true },
  { force: true, blur: 4 },
  { force: true, blur: 5, litOnly: true },
];

let regionWorker: Promise<TesseractWorker> | null = null;

function getRegionWorker(): Promise<TesseractWorker> {
  regionWorker ??= (async () => {
    const Tesseract = await loadTesseract();
    const worker = await Tesseract.createWorker(["eng"]);
    await worker.setParameters({
      tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE,
      tessedit_char_whitelist: "0123456789:.",
    });
    return worker;
  })();
  regionWorker.catch(() => {
    regionWorker = null;
  });
  return regionWorker;
}

/** Stops the marked-area reader (leaving the import screen). Never throws. */
export async function releaseRegionReader(): Promise<void> {
  const pending = regionWorker;
  regionWorker = null;
  const worker = await pending?.catch(() => null);
  await worker?.terminate().catch(() => undefined);
}

/** Reads the time inside one marked area of the photo (null when nothing time-shaped is found). */
export async function readRegion(uri: string, rect: FractionRect): Promise<string | null> {
  const img = await loadImage(uri);
  if (!img || typeof document === "undefined") return null;
  const px = toPixels(rect, { width: img.naturalWidth, height: img.naturalHeight });
  const width = Math.max(1, Math.round((px.w * REGION_HEIGHT) / px.h));
  const crop = document.createElement("canvas");
  crop.width = width;
  crop.height = REGION_HEIGHT;
  const cropCtx = context2d(crop);
  cropCtx.drawImage(img, px.x, px.y, px.w, px.h, 0, 0, width, REGION_HEIGHT);
  const source = cropCtx.getImageData(0, 0, width, REGION_HEIGHT);

  const page = document.createElement("canvas");
  page.width = width + REGION_PADDING * 2;
  page.height = REGION_HEIGHT + REGION_PADDING * 2;
  const pageCtx = context2d(page);
  const worker = await getRegionWorker();
  const readings: Array<{ text: string; conf: number }> = [];
  for (const variant of REGION_VARIANTS) {
    const enhanced = enhanceForOcr(source, variant);
    if (!enhanced) continue;
    pageCtx.fillStyle = "#ffffff";
    pageCtx.fillRect(0, 0, page.width, page.height);
    pageCtx.putImageData(
      new ImageData(enhanced.data, width, REGION_HEIGHT),
      REGION_PADDING,
      REGION_PADDING,
    );
    const { data } = await worker.recognize(page);
    readings.push({ text: data.text.trim(), conf: data.confidence / 100 });
  }
  return voteReadings(readings);
}
