import { requireOptionalNativeModule } from "expo";
import { File } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { cacheDirectoryUri, deletePath, ensureDirectory, moveFile } from "@/lib/native-file-store";
import { isTV } from "@/lib/platform/is-tv";
import { captureAppException } from "@/lib/sentry";

import type { ExportDocumentOptions, ExportDocumentResult } from "./export-document-types";

export type {
  ExportDocumentMode,
  ExportDocumentOptions,
  ExportDocumentResult,
} from "./export-document-types";

type PrintModule = typeof import("expo-print");

/**
 * A4 in PostScript points with ~16 mm margins. Android and web honour the
 * printable page's CSS `@page` rule; iOS's renderer ignores it, so without
 * explicit margins the text would run to the paper's edge.
 */
const A4_PAGE = {
  width: 595,
  height: 842,
  margins: { top: 45, bottom: 45, left: 45, right: 45 },
} as const;

/**
 * `expo-print`, or null when this binary doesn't have it: TV builds exclude it
 * (records are hidden there), and a dev/store binary built before D30 has the
 * JS but not the native module — importing `expo-print` then throws, so it is
 * only required after the native module is confirmed.
 */
function loadPrint(): PrintModule | null {
  if (isTV() || !requireOptionalNativeModule("ExpoPrint")) return null;
  try {
    return require("expo-print") as PrintModule;
  } catch {
    return null;
  }
}

function safeName(fileName: string): string {
  return fileName.replace(/[^\w.-]+/g, "-").slice(0, 80) || "document";
}

function removeQuietly(uri: string): void {
  try {
    deletePath(uri);
  } catch {
    // already gone
  }
}

/**
 * Deletes the whole `printable/` cache folder — any PDF/HTML a crash or a killed
 * share sheet left behind (they hold plaintext wasiyyah / debt records). Called
 * by "Reset app data" and account deletion.
 */
export async function clearPrintableExports(): Promise<void> {
  const base = cacheDirectoryUri();
  if (base) removeQuietly(`${base}printable/`);
}

/** Opens the share sheet for `uri`, then deletes it (plaintext vault data stays off disk). */
async function shareThenDelete(
  uri: string,
  options: Parameters<typeof Sharing.shareAsync>[1],
): Promise<void> {
  try {
    await Sharing.shareAsync(uri, options);
  } finally {
    removeQuietly(uri);
  }
}

/** Renders `html` to a PDF in the cache, renamed to `<fileName>.pdf`. Null on failure. */
async function renderPdf(
  Print: PrintModule,
  html: string,
  dir: string,
  fileName: string,
): Promise<string | null> {
  let rendered: string | null = null;
  try {
    rendered = (await Print.printToFileAsync({ html, ...A4_PAGE })).uri;
    const target = `${dir}${safeName(fileName)}.pdf`;
    removeQuietly(target);
    await moveFile(rendered, target);
    return target;
  } catch (error) {
    if (rendered) removeQuietly(rendered);
    captureAppException(error, { tags: { area: "printable", phase: "pdf" } });
    return null;
  }
}

/** Pre-D30 path, kept for binaries without `expo-print`: share the HTML itself. */
async function shareHtml(
  html: string,
  dir: string,
  fileName: string,
  dialogTitle: string,
): Promise<void> {
  const uri = `${dir}${safeName(fileName)}.html`;
  removeQuietly(uri);
  await new File(uri).write(html);
  await shareThenDelete(uri, { mimeType: "text/html", UTI: "public.html", dialogTitle });
}

/**
 * Native (D30): renders the printable HTML to a real PDF with `expo-print` and
 * opens the share sheet (print, save to Files, send). `mode: "print"` opens the
 * system print dialog instead, which also offers "Save as PDF". The plaintext
 * file is deleted as soon as the share sheet closes (vault data stays encrypted
 * at rest). Without `expo-print` (stale binary) it falls back to sharing the
 * HTML file; on TV it reports "unavailable".
 */
export async function exportPrintableDocument(
  html: string,
  fileName: string,
  dialogTitle: string,
  { mode = "share" }: ExportDocumentOptions = {},
): Promise<ExportDocumentResult> {
  if (isTV()) return "unavailable";
  const Print = loadPrint();

  if (Print && mode === "print") {
    try {
      await Print.printAsync({ html, margins: A4_PAGE.margins });
      return "printed";
    } catch (error) {
      // Android rejects when the dialog is dismissed without printing; anything
      // else falls through to the share sheet so the person still gets a copy.
      if (/did not complete|cancel/i.test(error instanceof Error ? error.message : "")) {
        return "printed";
      }
      captureAppException(error, { tags: { area: "printable", phase: "print" } });
    }
  }

  const base = cacheDirectoryUri();
  if (!base || !(await Sharing.isAvailableAsync().catch(() => false))) return "unavailable";
  const dir = `${base}printable/`;
  ensureDirectory(dir);

  const pdf = Print ? await renderPdf(Print, html, dir, fileName) : null;
  if (pdf) {
    await shareThenDelete(pdf, { mimeType: "application/pdf", UTI: "com.adobe.pdf", dialogTitle });
  } else {
    await shareHtml(html, dir, fileName, dialogTitle);
  }
  return "shared";
}
