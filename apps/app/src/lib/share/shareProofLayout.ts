/** Horizontal inset on the share snapshot (matches Spacing.three). */
export const SHARE_PROOF_HORIZONTAL_PADDING = 16;
/** Inner padding of the share footer card (matches Spacing.three). */
export const SHARE_PROOF_FOOTER_PADDING = 16;
/** Gap between footer QR codes (matches Spacing.three). */
export const SHARE_PROOF_QR_GAP = 16;
export const SHARE_PROOF_QR_MIN = 88;
export const SHARE_PROOF_QR_MAX = 112;
export const SHARE_PROOF_QR_COUNT = 3;

/** Fits three branded QRs in the share footer without squashing modules. */
export function computeShareProofQrSize(frameWidth: number): number {
  const qrRowWidth =
    frameWidth - SHARE_PROOF_HORIZONTAL_PADDING * 2 - SHARE_PROOF_FOOTER_PADDING * 2;
  const available = qrRowWidth - SHARE_PROOF_QR_GAP * (SHARE_PROOF_QR_COUNT - 1);
  const perCell = available / SHARE_PROOF_QR_COUNT;
  return Math.min(SHARE_PROOF_QR_MAX, Math.max(SHARE_PROOF_QR_MIN, Math.floor(perCell)));
}

export function formatShareExportStamp(): string {
  return new Date().toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
