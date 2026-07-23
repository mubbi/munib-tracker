import { zikrQuranPath } from "@/lib/zikr-quran";

/** Custom URL scheme for widgets, shortcuts, and deep links (`app.json` → `scheme`). */
export const APP_SCHEME = "munib-tracker";

/** Product web origin (HTTPS shareable URLs). Mirrors SEO default. */
const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const APP_HTTPS_ORIGIN = trimTrailingSlash(
  (typeof process !== "undefined" ? process.env.EXPO_PUBLIC_APP_URL : undefined) ??
    "https://my.munibtracker.app",
);

export type AppLinkFormat = "scheme" | "https";

export type AppLinkUrls = {
  /** Expo Router path, always starting with `/` (query string included when present). */
  path: string;
  /** `munib-tracker://…` URL for native surfaces. */
  schemeUrl: string;
  /** `https://my.munibtracker.app/…` URL for web / campaigns. */
  httpsUrl: string;
};

/** Normalize a path or path+query into a leading-slash form without a trailing slash (except `/`). */
export function normalizeAppPath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed || trimmed === "/") return "/";
  const [rawPath, ...queryParts] = trimmed.split("?");
  const query = queryParts.length > 0 ? queryParts.join("?") : "";
  const withSlash = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  const noTrailing = withSlash.replace(/\/+$/, "") || "/";
  return query ? `${noTrailing}?${query}` : noTrailing;
}

function pathForScheme(path: string): string {
  const normalized = normalizeAppPath(path);
  return normalized === "/" ? "" : normalized.slice(1);
}

/** Build `munib-tracker://tracker` style URLs for native surfaces. */
export function buildAppUrl(path: string): string {
  return `${APP_SCHEME}://${pathForScheme(path)}`;
}

/** Build `https://my.munibtracker.app/tracker` style URLs for web / shareable campaigns. */
export function buildHttpsAppUrl(path: string): string {
  const normalized = normalizeAppPath(path);
  return normalized === "/" ? `${APP_HTTPS_ORIGIN}/` : `${APP_HTTPS_ORIGIN}${normalized}`;
}

/** Resolve both scheme and HTTPS URLs for a path. */
export function resolveAppLink(path: string): AppLinkUrls {
  const normalized = normalizeAppPath(path);
  return {
    path: normalized,
    schemeUrl: buildAppUrl(normalized),
    httpsUrl: buildHttpsAppUrl(normalized),
  };
}

export function formatAppLink(path: string, format: AppLinkFormat = "scheme"): string {
  return format === "https" ? buildHttpsAppUrl(path) : buildAppUrl(path);
}

function withQuery(path: string, query: Record<string, string | number | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === "") continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

/**
 * Static shareable destinations — supported surface for campaigns, notifications,
 * widgets, and native shortcuts. Any Expo Router path still works; this catalog
 * is the curated list we document and test.
 *
 * Keep in sync with `QUICK_ACTION_ROUTES` (asserted in `app-links.test.ts`).
 */
export const DEEP_LINK_DESTINATIONS = [
  // Tabs
  "/",
  "/tracker",
  "/library",
  "/settings",
  // Library / home quick-action hubs (mirror QUICK_ACTION_ROUTES)
  "/schedule",
  "/zikr",
  "/tasbeeh/free",
  "/ramadan",
  "/salah-guide",
  "/jannah",
  "/jahannam",
  "/last-day",
  "/battles",
  "/learn-quran",
  "/taharah",
  "/prophets",
  "/aqeedah",
  "/learn-dua",
  "/travel",
  "/hajj",
  "/hajj/checklist",
  "/umrah/checklist",
  "/seerah",
  "/events",
  "/zakat",
  "/qaza",
  "/quran",
  "/hadith",
  "/bookmarks",
  "/dua",
  "/duroods",
  "/names-of-allah",
  "/qibla",
  "/calendar",
  "/calendar/converter",
  "/last-third-night",
  "/achievements",
  "/statistics",
  "/journal",
  "/tahajjud",
  "/hayd",
  "/sick",
  "/adhkar-builder",
  "/sahaba",
  "/history",
  "/laylat-al-qadr",
  "/eid",
  "/friday",
  "/ruqyah",
  "/new-muslim",
  "/finance",
  "/flash-cards",
  "/fidyah",
  "/janazah",
  "/sadaqah",
  "/prophets/tree",
  "/login",
  "/tv-pair",
  // Qur'an extras
  "/quran/juz",
  "/quran/pages",
  "/quran/khatm",
  "/quran/hifz",
  "/quran/search",
  "/verse-detector",
  "/quran/bookmarks",
  // Hadith / qaza extras
  "/hadith/daily",
  "/hadith/bookmarks",
  "/qaza/history",
  "/qaza/calculator",
  "/qaza/planner",
  "/qaza/roza",
  // Discoverability
  "/search",
  "/notifications",
  "/profile",
  "/location",
  "/credits",
  "/tour",
  // Major settings
  "/settings/appearance",
  "/settings/language",
  "/settings/notifications",
  "/settings/home",
  "/settings/fonts",
  "/settings/offline-data",
  "/settings/backup",
  "/settings/app-lock",
  "/settings/reminder-offsets",
  "/settings/prayer-tuning",
  "/settings/voice-shortcuts",
  "/settings/about",
  // Special action bridges
  "/mark-current",
  "/open-review",
] as const;

/** Unique sorted static destination paths (deduped). */
export const DEEP_LINK_PATHS: readonly string[] = [
  ...new Set(DEEP_LINK_DESTINATIONS.map((path) => normalizeAppPath(path))),
].sort((a, b) => a.localeCompare(b));

function link(path: string): AppLinkUrls {
  return resolveAppLink(path);
}

/**
 * Typed deep-link builders. Prefer these over hand-rolled strings so scheme and
 * HTTPS stay in sync with Expo Router params.
 */
export const appLink = {
  home: () => link("/"),
  tracker: () => link("/tracker"),
  library: () => link("/library"),
  settings: () => link("/settings"),
  qibla: () => link("/qibla"),
  qaza: () => link("/qaza"),
  quran: () => link("/quran"),
  hadith: () => link("/hadith"),
  dua: () => link("/dua"),
  zikr: () => link("/zikr"),
  tasbeeh: () => link("/tasbeeh/free"),
  search: () => link("/search"),
  schedule: () => link("/schedule"),
  calendar: () => link("/calendar"),
  location: () => link("/location"),
  notifications: () => link("/notifications"),
  profile: () => link("/profile"),
  login: () => link("/login"),
  tvPair: (code?: string) => link(code ? `/tv-pair?code=${encodeURIComponent(code)}` : "/tv-pair"),
  achievements: () => link("/achievements"),
  statistics: () => link("/statistics"),
  ramadan: () => link("/ramadan"),
  journal: () => link("/journal"),
  tahajjud: () => link("/tahajjud"),
  bookmarks: () => link("/bookmarks"),
  namesOfAllah: () => link("/names-of-allah"),
  duroods: () => link("/duroods"),
  adhkarBuilder: () => link("/adhkar-builder"),
  salahGuide: () => link("/salah-guide"),
  learnQuran: () => link("/learn-quran"),
  learnDua: () => link("/learn-dua"),
  jannah: () => link("/jannah"),
  jahannam: () => link("/jahannam"),
  lastDay: () => link("/last-day"),
  battles: () => link("/battles"),
  prophets: () => link("/prophets"),
  aqeedah: () => link("/aqeedah"),
  taharah: () => link("/taharah"),
  travel: () => link("/travel"),
  hajj: () => link("/hajj"),
  seerah: () => link("/seerah"),
  events: () => link("/events"),
  zakat: () => link("/zakat"),
  hayd: () => link("/hayd"),
  sick: () => link("/sick"),
  sahaba: () => link("/sahaba"),
  history: () => link("/history"),
  laylatAlQadr: () => link("/laylat-al-qadr"),
  eid: () => link("/eid"),
  friday: () => link("/friday"),
  ruqyah: () => link("/ruqyah"),
  newMuslim: () => link("/new-muslim"),
  finance: () => link("/finance"),
  flashCards: () => link("/flash-cards"),
  fidyah: () => link("/fidyah"),
  janazah: () => link("/janazah"),
  sadaqah: () => link("/sadaqah"),
  prophetsTree: () => link("/prophets/tree"),
  quranJuz: () => link("/quran/juz"),
  quranPages: () => link("/quran/pages"),
  quranKhatm: () => link("/quran/khatm"),
  quranHifz: () => link("/quran/hifz"),
  hadithDaily: () => link("/hadith/daily"),
  qazaHistory: () => link("/qaza/history"),

  /** `/quran/{surah}` with optional ayah focus (`?ayah=`). */
  quranSurah: (surah: number, options?: { ayah?: number }) =>
    link(withQuery(`/quran/${surah}`, { ayah: options?.ayah })),

  /** Mushaf page reader: `/quran/page/{page}`. */
  quranPage: (page: number) => link(`/quran/page/${page}`),

  /**
   * Hadith collection. Optional `q` seeds the in-collection search (same as
   * knowledge-card deep links — the screen does not accept a hadith number param).
   */
  hadithCollection: (collection: string, options?: { q?: string }) =>
    link(withQuery(`/hadith/${collection}`, { q: options?.q })),

  duaCategory: (category: string) => link(`/dua/${category}`),
  duaDetail: (id: string) => link(`/dua/detail/${id}`),
  zikrCategory: (category: string) => link(`/zikr/${category}`),
  /** Mushaf-backed remembrances (e.g. Al-Mulk) resolve to the Qur'an reader. */
  zikrDetail: (id: string) => link(zikrQuranPath(id) ?? `/zikr/detail/${id}`),
  tasbeehZikr: (zikrId: string) => link(`/tasbeeh/${zikrId}`),
  tasbeehDurood: (id: string) => link(`/tasbeeh/durood/${id}`),
  tasbeehCustom: (id: string) => link(`/tasbeeh/custom/${id}`),
  calendarDate: (date: string) => link(`/calendar/${date}`),
  tour: (tourId?: string) => link(withQuery("/tour", { tour: tourId })),

  /** App Actions / assistant: enqueue mark-current then open tracker. */
  markCurrent: () => link("/mark-current"),

  /** Opens the in-app review funnel (`ReviewDeepLinkBridge`). */
  openReview: (triggerId?: string) => link(withQuery("/open-review", { triggerId })),
} as const;
