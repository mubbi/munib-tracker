/** Custom URL scheme for widgets, shortcuts, and deep links (`app.json` → `scheme`). */
export const APP_SCHEME = "munib-tracker";

/** Build `munib-tracker://tracker` style URLs for native surfaces. */
export function buildAppUrl(path: string): string {
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `${APP_SCHEME}://${normalized}`;
}
