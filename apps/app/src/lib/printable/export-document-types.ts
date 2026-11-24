/**
 * `share` (default): native renders a PDF and opens the share sheet.
 * `print`: native opens the system print dialog (with "Save as PDF").
 * Web always opens the browser print dialog.
 */
export type ExportDocumentMode = "share" | "print";

export type ExportDocumentOptions = { mode?: ExportDocumentMode };

/** `unavailable`: no share sheet / print path on this device (e.g. TV). */
export type ExportDocumentResult = "shared" | "printed" | "unavailable";
