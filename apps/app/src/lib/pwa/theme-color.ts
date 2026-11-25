/**
 * Web: `<meta name="theme-color">` tints the browser toolbar (Android Chrome,
 * Safari) and the installed app's title bar (desktop Chrome / Edge). `+html.tsx`
 * ships light/dark metas keyed on `prefers-color-scheme` for first paint; once
 * the app knows the user's chosen theme (which may differ from the OS), every
 * theme-color meta follows the real page background.
 */
export function syncDocumentThemeColor(color: string): void {
  if (typeof document === "undefined" || typeof document.querySelectorAll !== "function") return;
  const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
  for (const meta of metas) {
    if (meta.getAttribute("content") !== color) meta.setAttribute("content", color);
  }
}
