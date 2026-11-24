import type { ExportDocumentOptions, ExportDocumentResult } from "./export-document-types";

export type {
  ExportDocumentMode,
  ExportDocumentOptions,
  ExportDocumentResult,
} from "./export-document-types";

/**
 * Web: renders the printable HTML in a hidden iframe and opens the browser's
 * print dialog (where "Save as PDF" is offered) for every mode (D30). Nothing
 * is uploaded or stored.
 */
export async function exportPrintableDocument(
  html: string,
  _fileName: string,
  _dialogTitle: string,
  _options?: ExportDocumentOptions,
): Promise<ExportDocumentResult> {
  if (typeof document === "undefined") return "unavailable";
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.position = "fixed";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  document.body.appendChild(frame);
  const doc = frame.contentDocument;
  const win = frame.contentWindow;
  if (!doc || !win) {
    frame.remove();
    return "unavailable";
  }
  doc.open();
  doc.write(html);
  doc.close();
  await new Promise<void>((resolve) => setTimeout(resolve, 50));
  win.focus();
  win.print();
  // Keep the frame until the dialog has had time to read it.
  setTimeout(() => frame.remove(), 60_000);
  return "printed";
}
