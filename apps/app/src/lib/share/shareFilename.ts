const SHARE_FILENAME_NONCE_BYTES = 4;

function randomShareFilenameNonce(): string {
  const bytes = new Uint8Array(SHARE_FILENAME_NONCE_BYTES);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Safe PNG filename for a shared content snapshot (random suffix per share). */
export function contentShareFilename(
  slug = "content",
  nonce: string = randomShareFilenameNonce(),
): string {
  return `munib-tracker-${slug}-${nonce}.png`;
}
