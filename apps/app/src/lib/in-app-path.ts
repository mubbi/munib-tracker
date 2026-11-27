/**
 * In-app route guard for hrefs that arrive from outside the JS bundle: push /
 * local notification payloads (`data.route`) and the native command queue
 * (`open-route` from widgets, Siri, Wear). Expo Router hands an absolute URL to
 * the OS browser (native) or to `location` (web), so only an app path — a single
 * leading `/`, no backslashes or control characters — is let through.
 */
const MAX_IN_APP_PATH_LENGTH = 2048;

// biome-ignore lint/suspicious/noControlCharactersInRegex: control characters are what we reject.
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

export function toInAppPath(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const path = value.trim();
  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.includes("\\") ||
    CONTROL_CHARS.test(path) ||
    path.length > MAX_IN_APP_PATH_LENGTH
  ) {
    return null;
  }
  return path;
}
