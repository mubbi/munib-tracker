/** Google authorization codes are single-use, opaque strings — never short placeholders. */
export function isPlausibleGoogleAuthCode(code: string): boolean {
  const trimmed = code.trim();
  if (trimmed.length < 20) return false;
  if (/^fake[-_]?code$/i.test(trimmed)) return false;
  return true;
}
