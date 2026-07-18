export const COOKIE_PREFERENCES_OPEN_EVENT = "openCookiePreferences";

export function openCookiePreferences(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(COOKIE_PREFERENCES_OPEN_EVENT));
  }
}
