/**
 * Fake browser globals for web-only lib code under the native Jest preset
 * (where `window === globalThis` and `navigator` is Node's). Pair with
 * `usePlatform({ OS: "web" })` when the subject also checks `Platform.OS`.
 *
 *   useBrowser({ userAgent: IPHONE_SAFARI_UA, standalone: true });
 *   const restore = installBrowser({ notification: { permission: "granted" } });
 */

export const DESKTOP_CHROME_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
export const ANDROID_CHROME_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";
export const IPHONE_SAFARI_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
export const IPHONE_CHROME_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/124.0.6367.88 Mobile/15E148 Safari/604.1";
export const DESKTOP_FIREFOX_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0";

export type BrowserOptions = {
  userAgent?: string;
  /** `navigator.platform` (e.g. "MacIntel", "iPhone"). */
  platform?: string;
  maxTouchPoints?: number;
  userAgentData?: {
    platform?: string;
    mobile?: boolean;
    brands?: { brand: string; version: string }[];
  };
  /** `window.isSecureContext` (default true). */
  secureContext?: boolean;
  /** `matchMedia("(display-mode: standalone)")` matches. */
  standalone?: boolean;
  /** Legacy iOS `navigator.standalone`. */
  navigatorStandalone?: boolean;
  /** `navigator.serviceWorker`; omit for none. */
  serviceWorker?: unknown;
  /** `window.Notification` / global `Notification`; omit for none. */
  notification?: { permission: string; requestPermission?: jest.Mock };
  /** Adds `window.PushManager`. */
  pushManager?: boolean;
  /** Extra `navigator` properties. */
  navigator?: Record<string, unknown>;
  /** Extra `window` (global) properties. */
  window?: Record<string, unknown>;
};

const g = globalThis as Record<string, unknown>;

function override(target: object, key: string, value: unknown, restores: (() => void)[]): void {
  const previous = Object.getOwnPropertyDescriptor(target, key);
  Object.defineProperty(target, key, { configurable: true, writable: true, value });
  restores.push(() => {
    if (previous) Object.defineProperty(target, key, previous);
    else delete (target as Record<string, unknown>)[key];
  });
}

/** Installs browser globals; returns a restore function. */
export function installBrowser(options: BrowserOptions = {}): () => void {
  const restores: (() => void)[] = [];
  const nav = globalThis.navigator as object;
  const navValues: Record<string, unknown> = {
    userAgent: options.userAgent ?? DESKTOP_CHROME_UA,
    platform: options.platform ?? "Win32",
    maxTouchPoints: options.maxTouchPoints ?? 0,
    userAgentData: options.userAgentData,
    standalone: options.navigatorStandalone,
    ...options.navigator,
  };
  if (options.serviceWorker !== undefined) navValues.serviceWorker = options.serviceWorker;
  for (const [key, value] of Object.entries(navValues)) override(nav, key, value, restores);

  const winValues: Record<string, unknown> = {
    isSecureContext: options.secureContext ?? true,
    matchMedia: (query: string) => ({
      matches: options.standalone === true && query.includes("standalone"),
    }),
    ...options.window,
  };
  if (options.notification) winValues.Notification = options.notification;
  if (options.pushManager) winValues.PushManager = class {};
  for (const [key, value] of Object.entries(winValues)) override(g, key, value, restores);

  return () => {
    for (const restore of restores.reverse()) restore();
  };
}

/** `installBrowser` for every test in the enclosing `describe`. */
export function useBrowser(options: BrowserOptions = {}): void {
  let restore: () => void = () => {};
  beforeEach(() => {
    restore = installBrowser(options);
  });
  afterEach(() => restore());
}

/** In-memory Web Storage (`localStorage` / `sessionStorage`) for `installBrowser({ window: { localStorage } })`. */
export function createMemoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: jest.fn((key: string) => data.get(key) ?? null),
    setItem: jest.fn((key: string, value: string) => {
      data.set(key, String(value));
    }),
    removeItem: jest.fn((key: string) => {
      data.delete(key);
    }),
    clear: jest.fn(() => data.clear()),
    key: (index: number) => [...data.keys()][index] ?? null,
    get length() {
      return data.size;
    },
  };
}
