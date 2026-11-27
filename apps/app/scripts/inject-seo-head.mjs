/**
 * Post-export SEO head injection (locale-aware).
 *
 * Resolves metadata from the same JSON sources as the app's `<Seo>` component:
 *   • static routes  → `src/config/seo-routes.data.json`
 *   • locale overlays → `src/config/seo-routes-locale/{locale}.json`
 *   • UI labels      → `src/i18n/{locale}.json`
 *   • locale meta    → `src/config/locale-seo-meta.json`
 *
 * Set `SEO_LOCALE` (default `en`) for the primary injected title/description.
 * All locales get distinct `hreflang` URLs (`/{locale}/…`, except `en`).
 *
 * Run after `expo export --platform web`, before `generate-seo-files.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { unregisteredRoutePolicy } from "./lib/seo-route-policy.mjs";

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(projectRoot, "dist");

const readJson = (p) => JSON.parse(fs.readFileSync(path.join(projectRoot, p), "utf8"));

const SEO_ROUTES = readJson("src/config/seo-routes.data.json");
const LOCALE_META = readJson("src/config/locale-seo-meta.json");
const appJson = readJson("app.json");
const en = readJson("src/i18n/en.json");

const SEO_LOCALE = process.env.SEO_LOCALE ?? "en";
const localeMetaByCode = new Map(LOCALE_META.map((e) => [e.code, e]));

/** @type {Record<string, object>} */
const I18N_BY_LOCALE = { en };
for (const entry of LOCALE_META) {
  if (entry.code === "en") continue;
  const file = path.join(projectRoot, "src/i18n", `${entry.code}.json`);
  if (fs.existsSync(file)) I18N_BY_LOCALE[entry.code] = readJson(`src/i18n/${entry.code}.json`);
}

/** @type {Record<string, Record<string, object>>} */
const SEO_LOCALE_ROUTES = {};
const seoLocaleDir = path.join(projectRoot, "src/config/seo-routes-locale");
for (const entry of LOCALE_META) {
  if (entry.code === "en") continue;
  const file = path.join(seoLocaleDir, `${entry.code}.json`);
  if (fs.existsSync(file)) {
    SEO_LOCALE_ROUTES[entry.code] = readJson(`src/config/seo-routes-locale/${entry.code}.json`);
  }
}

function i18n(locale) {
  return I18N_BY_LOCALE[locale] ?? en;
}

const APP_NAME = appJson.expo?.web?.name ?? "Munib Tracker";
const APP_TAGLINE =
  i18n(SEO_LOCALE).common?.appTagline ??
  en.common?.appTagline ??
  "Track Your Journey Back to Allah.";
const APP_DESCRIPTION = appJson.expo?.web?.description ?? `${APP_TAGLINE}`;
const APP_AUTHOR = en.about?.authorValue ?? "Mubbasher Ahmed Qureshi";

function normalizePath(p) {
  if (!p) return "/";
  const trimmed = p.split(/[?#]/)[0].replace(/\/+$/, "");
  if (trimmed === "") return "/";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

const ORIGIN = (process.env.EXPO_PUBLIC_APP_URL ?? "https://my.munibtracker.app").replace(
  /\/+$/,
  "",
);
const OG_IMAGE = `${ORIGIN}/assets/images/icon-512.png`;
const OG_IMAGE_ALT = `${APP_NAME} — ${APP_TAGLINE}`;
const DEFAULT_KEYWORDS = [
  "Islamic app",
  "salah tracker",
  "prayer times",
  "dhikr counter",
  "qaza tracker",
  "Quran",
  "hadith",
  "duas",
  "qibla direction",
  "Muslim prayer app",
];

const surahMeta = readJson("assets/data/quran/meta.json");
const surahs = new Map(surahMeta.surahs.map((s) => [String(s.number), s]));
const FAQ_BY_ROUTE = readJson("src/config/seo-faq.data.json");

function surahItems(_L) {
  return surahMeta.surahs.map((s) => ({
    name: `${s.number}. ${s.nameTransliteration} (${s.nameEnglish})`,
    path: `/quran/${s.number}`,
  }));
}

function catItems(labels, base) {
  return Object.entries(labels ?? {}).map(([id, name]) => ({ name, path: `${base}/${id}` }));
}

/** Zakat hub: every guide topic (catalog order = ZAKAT_GUIDE_SECTIONS) + checklist / evidence. */
function zakatItems(L) {
  const guide = L.zakat?.guide ?? en.zakat?.guide ?? {};
  return [
    ...Object.entries(guide).map(([id, topic]) => ({
      name: topic?.title ?? humanizeSlug(id),
      path: `/zakat/${id}`,
    })),
    ...["/zakat/checklist", "/zakat/evidence"]
      .filter((p) => SEO_ROUTES[p])
      .map((p) => ({ name: SEO_ROUTES[p].title, path: p })),
  ];
}

function itemsByRoute(L) {
  return {
    "/quran": surahItems(L),
    "/dua": catItems(L.duaCat, "/dua"),
    "/zikr": catItems(L.zikrCat, "/zikr"),
    "/zakat": zakatItems(L),
  };
}

const CONTENT_SECTION_NS = {
  aqeedah: "aqeedah",
  prophets: "prophets",
  zakat: "zakat",
  jannah: "jannah",
  jahannam: "jahannam",
  "last-day": "lastDay",
  battles: "battles",
  "salah-guide": "salahGuide",
  taharah: "taharah",
  "learn-dua": "learnDua",
  "learn-quran": "learnQuran",
};

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const absolute = (routePath) => `${ORIGIN}${routePath === "/" ? "" : routePath}`;

/** Match `apps/app/src/lib/locale-path.ts` — default locale has no URL prefix. */
function prependLocalePath(routePath, locale) {
  const normalized = routePath === "/" || routePath === "" ? "" : routePath;
  if (locale === "en") return normalized || "/";
  return `/${locale}${normalized}`;
}

function absoluteLocalized(routePath, locale) {
  const localized = prependLocalePath(routePath, locale);
  return `${ORIGIN}${localized === "/" ? "" : localized}`;
}

/** Keep in sync with `LOCALE_PATH_BOOT_SCRIPT` in src/lib/locale-path.ts (fallback only). */
const LOCALE_BOOT_SCRIPT = `(function(){try{var p=location.pathname.replace(/\\/+$/,'')||'/';var m=p.match(/^\\/([a-z]{2})(\\/.*)?$/);if(!m||m[1]==='en')return;var loc=m[1];var appPath=m[2]||'/';sessionStorage.setItem('munib-locale-boot',loc);window.__MUNIB_ENTRY_LOCALE__={locale:loc,path:appPath};history.replaceState({munibLocale:loc},'',appPath+location.search+location.hash);}catch(e){}})();`;

function humanizeSlug(slug, stripPrefixes = []) {
  let s = decodeURIComponent(slug);
  for (const p of stripPrefixes) if (s.startsWith(`${p}-`)) s = s.slice(p.length + 1);
  return s
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function mergeRegistryRoute(key, locale) {
  const base = SEO_ROUTES[key];
  if (!base) return undefined;
  if (locale === "en") return base;
  const overlay = SEO_LOCALE_ROUTES[locale]?.[key];
  if (!overlay) return base;
  return {
    ...base,
    ...(overlay.title ? { title: overlay.title } : null),
    ...(overlay.description ? { description: overlay.description } : null),
    ...(overlay.imageAlt ? { imageAlt: overlay.imageAlt } : null),
  };
}

function resolveMeta(route, locale = SEO_LOCALE) {
  const key = normalizePath(route);
  const L = i18n(locale);

  if (/[[\]]/.test(key)) {
    return {
      title: `${APP_NAME} — ${APP_TAGLINE}`,
      description: APP_DESCRIPTION,
      keywords: [],
      index: false,
      breadcrumbs: [],
      locale,
    };
  }

  const registry = mergeRegistryRoute(key, locale);
  const home = { name: L.tabs?.home ?? "Home", path: "/" };

  if (registry) {
    return {
      title: registry.title ?? `${APP_NAME} — ${APP_TAGLINE}`,
      isHome: key === "/",
      description: registry.description,
      keywords: registry.keywords ?? [],
      index: registry.index ?? true,
      breadcrumbs: key === "/" ? [] : [home, { name: registry.title ?? key, path: key }],
      locale,
    };
  }

  let m = key.match(/^\/quran\/(\d+)$/);
  if (m && surahs.has(m[1])) {
    const s = surahs.get(m[1]);
    const revelation = s.revelationPlace === "makkah" ? "Makkah" : "Madinah";
    const title = `Surah ${s.nameTransliteration} — ${s.nameEnglish}`;
    return {
      title,
      description: `Read and listen to Surah ${s.nameTransliteration} (${s.nameEnglish}), chapter ${s.number} of the Qur'an — ${s.ayahCount} ayahs, revealed in ${revelation}. Arabic text, transliteration, translation, and recitation, offline.`,
      keywords: [`Surah ${s.nameTransliteration}`, s.nameEnglish, "read Quran online"],
      index: true,
      type: "article",
      breadcrumbs: [
        home,
        { name: L.quran?.title ?? "Qur'an", path: "/quran" },
        { name: s.nameTransliteration, path: key },
      ],
      locale,
    };
  }

  m = key.match(/^\/(dua|zikr)\/([a-z_]+)$/);
  if (m && (m[1] === "dua" ? L.duaCat : L.zikrCat)?.[m[2]]) {
    const kind = m[1];
    const label = (kind === "dua" ? L.duaCat : L.zikrCat)[m[2]];
    const root =
      kind === "dua"
        ? { name: L.dua?.title ?? "Duas", path: "/dua" }
        : { name: L.zikr?.title ?? "Zikr", path: "/zikr" };
    return {
      title: label,
      description: `${label} — authentic ${kind === "dua" ? "supplications" : "adhkar"} with Arabic, transliteration, and meaning, available offline.`,
      keywords: [label, kind === "dua" ? "islamic duas" : "daily adhkar"],
      index: true,
      breadcrumbs: [home, root, { name: label, path: key }],
      locale,
    };
  }

  m = key.match(/^\/(dua|zikr)\/detail\/(.+)$/);
  if (m) {
    const kind = m[1];
    const title = humanizeSlug(m[2], [
      "sunnah",
      "quranic",
      "daily",
      // morning / evening are kept: they tell the two versions of a zikr apart.
      "before_prayer",
      "after_prayer",
      "after_azan",
      "before_sleep",
      "anytime",
    ]);
    const root =
      kind === "dua"
        ? { name: L.dua?.title ?? "Duas", path: "/dua" }
        : { name: L.zikr?.title ?? "Zikr", path: "/zikr" };
    return {
      title,
      description: `${title} — read the Arabic, transliteration, and meaning of this ${kind === "dua" ? "dua" : "zikr"} on ${APP_NAME}.`,
      keywords: [title, kind === "dua" ? "islamic dua" : "zikr"],
      index: true,
      type: "article",
      breadcrumbs: [home, root, { name: title, path: key }],
      locale,
    };
  }

  m = key.match(/^\/hadith\/([^/]+)$/);
  if (m) {
    const title = humanizeSlug(m[1]);
    return {
      title,
      description: `Read hadith from ${title} — the sayings and traditions of the Prophet Muhammad ﷺ, with narrator and grading details, offline on ${APP_NAME}.`,
      keywords: [title, "hadith collection", "sunnah"],
      index: true,
      type: "article",
      breadcrumbs: [
        home,
        { name: L.hadith?.title ?? "Hadith", path: "/hadith" },
        { name: title, path: key },
      ],
      locale,
    };
  }

  // Topic pages of a content section (`/{section}/{slug}`): indexable when their
  // nearest registered hub is (scripts/lib/seo-route-policy.mjs). The real topic
  // title comes from the client <Seo>; this is the crawlable static baseline.
  const contentMatch = key.match(/^\/([a-z-]+)\/(.+)$/);
  const policy = unregisteredRoutePolicy(key, SEO_ROUTES);
  if (contentMatch && policy.index) {
    const section = contentMatch[1];
    const lastSeg = contentMatch[2].split("/").pop() ?? contentMatch[2];
    const hubEntry = policy.hub ? mergeRegistryRoute(policy.hub.path, locale) : undefined;
    const sectionTitle =
      L[CONTENT_SECTION_NS[section]]?.title ??
      hubEntry?.title ??
      policy.hubTitle ??
      humanizeSlug(section);
    // Short section name ("Duroods & Salawat" from "Duroods & Salawat — Blessings…")
    // keeps the title unique across sections (/aqeedah/introduction vs
    // /battles/introduction) and the description under ~170 chars.
    const sectionShort = sectionTitle.split(" — ")[0];
    const topic = humanizeSlug(lastSeg);
    const title = `${topic} — ${sectionShort}`;
    return {
      title,
      description: `${topic}, from ${sectionShort} on ${APP_NAME}: a clear, sourced guide drawn from the Qur'an and authentic Sunnah, free to read online or offline.`,
      keywords: [topic, sectionShort],
      index: true,
      type: "article",
      breadcrumbs: [
        home,
        ...(policy.hub ? [{ name: sectionShort, path: policy.hub.path }] : []),
        { name: topic, path: key },
      ],
      locale,
    };
  }

  return {
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
    keywords: [],
    index: false,
    breadcrumbs: [],
    locale,
  };
}

function buildJsonLd(route, meta) {
  const key = normalizePath(route);
  const url = absoluteLocalized(route, meta.locale ?? SEO_LOCALE);
  const L = i18n(meta.locale ?? SEO_LOCALE);
  const items = itemsByRoute(L)[key];
  const hreflang = localeMetaByCode.get(meta.locale ?? SEO_LOCALE)?.hreflang ?? "en";
  const primaryType = meta.type === "article" ? "Article" : items ? "CollectionPage" : "WebPage";
  const primary = {
    "@context": "https://schema.org",
    "@type": primaryType,
    "@id": `${url}#webpage`,
    url,
    name: meta.title,
    headline: meta.title,
    description: meta.description,
    isPartOf: { "@id": `${ORIGIN}/#website` },
    inLanguage: hreflang,
    isAccessibleForFree: true,
  };
  if (items?.length) {
    primary.mainEntity = {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: absolute(it.path),
      })),
    };
  }
  const blocks = [primary];

  if (meta.breadcrumbs?.length) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: meta.breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: absolute(b.path),
      })),
    });
  }

  const faq = FAQ_BY_ROUTE[key];
  if (faq?.length) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }
  return blocks;
}

function buildHeadTags(route, meta) {
  const pageLocale = meta.locale ?? SEO_LOCALE;
  const url = absoluteLocalized(route, pageLocale);
  const fullTitle = meta.isHome ? meta.title : `${meta.title} · ${APP_NAME}`;
  const robots = meta.index
    ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    : "noindex, follow";
  const keywords = [...new Set([...(meta.keywords ?? []), ...DEFAULT_KEYWORDS])].join(", ");
  const d = escapeHtml(meta.description);
  const rawTitle = escapeHtml(meta.title);
  const primaryOg = localeMetaByCode.get(meta.locale ?? SEO_LOCALE)?.ogLocale ?? "en_US";

  const tags = [
    `<meta data-rh="true" name="description" content="${d}"/>`,
    `<meta data-rh="true" name="keywords" content="${escapeHtml(keywords)}"/>`,
    `<meta data-rh="true" name="author" content="${escapeHtml(APP_AUTHOR)}"/>`,
    `<meta data-rh="true" name="robots" content="${robots}"/>`,
    `<meta data-rh="true" name="googlebot" content="${robots}"/>`,
    `<link data-rh="true" rel="canonical" href="${url}"/>`,
    `<meta data-rh="true" property="og:type" content="${meta.type === "article" ? "article" : "website"}"/>`,
    `<meta data-rh="true" property="og:site_name" content="${escapeHtml(APP_NAME)}"/>`,
    `<meta data-rh="true" property="og:title" content="${rawTitle}"/>`,
    `<meta data-rh="true" property="og:description" content="${d}"/>`,
    `<meta data-rh="true" property="og:url" content="${url}"/>`,
    `<meta data-rh="true" property="og:image" content="${OG_IMAGE}"/>`,
    `<meta data-rh="true" property="og:image:alt" content="${escapeHtml(OG_IMAGE_ALT)}"/>`,
    `<meta data-rh="true" property="og:locale" content="${primaryOg}"/>`,
    `<meta data-rh="true" name="twitter:card" content="summary_large_image"/>`,
    `<meta data-rh="true" name="twitter:title" content="${rawTitle}"/>`,
    `<meta data-rh="true" name="twitter:description" content="${d}"/>`,
    `<meta data-rh="true" name="twitter:image" content="${OG_IMAGE}"/>`,
    // Same set as <Seo> on the client, so Helmet adopts these instead of adding twins.
    `<meta data-rh="true" property="og:image:width" content="512"/>`,
    `<meta data-rh="true" property="og:image:height" content="512"/>`,
    `<meta data-rh="true" name="twitter:image:alt" content="${escapeHtml(OG_IMAGE_ALT)}"/>`,
  ];

  for (const entry of LOCALE_META) {
    if (entry.code === pageLocale) continue;
    tags.push(`<meta data-rh="true" property="og:locale:alternate" content="${entry.ogLocale}"/>`);
    tags.push(
      `<link data-rh="true" rel="alternate" hreflang="${entry.hreflang}" href="${absoluteLocalized(route, entry.code)}"/>`,
    );
  }
  tags.push(
    `<link data-rh="true" rel="alternate" hreflang="x-default" href="${absoluteLocalized(route, "en")}"/>`,
  );

  // JSON-LD is NOT Helmet-managed (no `data-rh`): on hydration Helmet deletes every
  // `data-rh` script the client did not re-emit, which stripped Article / FAQ /
  // ItemList data from the DOM Google indexes. `data-seo-static` lets <Seo> drop
  // these blocks itself once the client emits the same @type or navigates away.
  for (const block of buildJsonLd(route, meta)) {
    const json = JSON.stringify(block).replace(/</g, "\\u003c");
    tags.push(`<script data-seo-static="true" type="application/ld+json">${json}</script>`);
  }
  return { fullTitle: escapeHtml(fullTitle), tags };
}

function routeForFile(file) {
  let rel = path
    .relative(distDir, file)
    .split(path.sep)
    .join("/")
    .replace(/\.html$/, "");
  rel = rel.replace(/\/index$/, "");
  if (rel === "index") rel = "";
  return `/${rel}`.replace(/\/+$/, "") || "/";
}

function collectHtmlFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectHtmlFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

function destFileForLocalizedRoute(route, locale) {
  const localized = prependLocalePath(route, locale);
  if (localized === "/") return path.join(distDir, "index.html");
  return path.join(distDir, localized.slice(1), "index.html");
}

const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`, "i"))?.[1];
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Regex matching an existing tag in the page that is "the same tag" as `tag`
 * (same meta name/property, canonical, or hreflang alternate). Attribute order
 * differs between Expo's generateMetadata output and ours, hence the lookaheads.
 * JSON-LD blocks have no identity beyond their exact content.
 */
function existingTagPattern(tag) {
  if (tag.startsWith("<script")) return null;
  if (tag.startsWith("<meta")) {
    const name = attr(tag, "name");
    if (name) return new RegExp(`<meta(?=[^>]*\\bname="${escapeRe(name)}")[^>]*>`, "i");
    const property = attr(tag, "property");
    if (!property) return null;
    if (property === "og:locale:alternate") {
      const content = attr(tag, "content") ?? "";
      return new RegExp(
        `<meta(?=[^>]*\\bproperty="og:locale:alternate")(?=[^>]*\\bcontent="${escapeRe(content)}")[^>]*>`,
        "i",
      );
    }
    return new RegExp(`<meta(?=[^>]*\\bproperty="${escapeRe(property)}")[^>]*>`, "i");
  }
  if (tag.startsWith("<link")) {
    const rel = attr(tag, "rel");
    if (rel === "canonical") return /<link(?=[^>]*\brel="canonical")[^>]*>/i;
    const hreflang = attr(tag, "hreflang");
    if (rel === "alternate" && hreflang) {
      return new RegExp(
        `<link(?=[^>]*\\brel="alternate")(?=[^>]*\\bhreflang="${escapeRe(hreflang)}")[^>]*>`,
        "i",
      );
    }
  }
  return null;
}

let tagsAdded = 0;
let tagsReplaced = 0;
let tagsAdopted = 0;

const STATIC_JSON_LD_RE =
  /<script\b(?=[^>]*\bdata-seo-static="true")[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi;

/**
 * Safety net after Expo Router's `generateMetadata` (SDK 58+):
 * - `mode: "fill"` (English pages): add only the tags a page is missing, so a route's
 *   own generateMetadata output always wins.
 * - `mode: "replace"` (`/{locale}/…` copies cloned from the English page): swap each
 *   matching tag for its localized version.
 */
function injectHeadIntoHtml(html, fullTitle, tags, htmlLang, { mode = "fill" } = {}) {
  // SDK 58 export only renders a <title> for routes whose generateMetadata returns
  // one (registry routes); every other page has none, so insert it.
  const titleTag = `<title data-rh="true">${fullTitle}</title>`;
  const titlePattern = /<title[^>]*>[\s\S]*?<\/title>/i;
  html = titlePattern.test(html)
    ? html.replace(titlePattern, titleTag)
    : html.replace(/<head([^>]*)>/i, `<head$1>${titleTag}`);
  html = html.replace(/<html([^>]*)lang="[^"]*"/i, `<html$1 lang="${htmlLang}"`);
  if (mode === "replace") {
    // Locale copies are cloned from the English page — drop its JSON-LD so the
    // localized blocks below are the only ones (no English + localized twins).
    // Repeat until stable: one pass over `<scr<script …>…</script>ipt …>` would
    // leave a freshly assembled block behind.
    let previous;
    do {
      previous = html;
      html = html.replace(STATIC_JSON_LD_RE, "");
    } while (html !== previous);
  }
  const missing = [];
  for (const tag of tags) {
    if (html.includes(tag)) continue;
    const pattern = existingTagPattern(tag);
    if (pattern?.test(html)) {
      if (mode === "replace") {
        html = html.replace(pattern, tag);
        tagsReplaced += 1;
      } else {
        // generateMetadata's own tag wins, but it is emitted without `data-rh`, so
        // client Helmet would not recognise it and would append a second canonical
        // / description / robots beside it (Google ignores conflicting canonicals).
        // Mark it as Helmet-managed so hydration reconciles it in place.
        html = html.replace(pattern, (existing) =>
          /\bdata-rh=/.test(existing)
            ? existing
            : existing.replace(/^<(meta|link)\b/i, '<$1 data-rh="true"'),
        );
        tagsAdopted += 1;
      }
      continue;
    }
    missing.push(tag);
  }
  if (missing.length > 0) {
    html = html.replace("</head>", `${missing.join("")}</head>`);
    tagsAdded += missing.length;
  }
  if (!html.includes("munib-locale-boot")) {
    html = html.replace("</head>", `<script>${LOCALE_BOOT_SCRIPT}</script></head>`);
  }
  return html;
}

function main() {
  if (!fs.existsSync(distDir)) {
    console.error(`[seo] dist/ not found — run the web export first.`);
    process.exit(1);
  }
  const htmlFiles = collectHtmlFiles(distDir).filter((file) => {
    const route = routeForFile(file).replace(/\/\([^)]*\)/g, "") || "/";
    return !route.match(/^\/[a-z]{2}(\/|$)/);
  });
  let injected = 0;
  let localeCopies = 0;
  const routes = new Map();

  for (const file of htmlFiles) {
    let route = routeForFile(file);
    route = route.replace(/\/\([^)]*\)/g, "") || "/";
    if (/[[\]]/.test(route)) continue;
    routes.set(route, file);
    const meta = resolveMeta(route, SEO_LOCALE);
    const { fullTitle, tags } = buildHeadTags(route, meta);

    let html = fs.readFileSync(file, "utf8");
    html = injectHeadIntoHtml(
      html,
      fullTitle,
      tags,
      localeMetaByCode.get(SEO_LOCALE)?.hreflang ?? "en",
    );
    fs.writeFileSync(file, html, "utf8");
    injected += 1;
  }

  for (const [route, sourceFile] of routes) {
    const template = fs.readFileSync(sourceFile, "utf8");
    for (const entry of LOCALE_META) {
      if (entry.code === "en") continue;
      const meta = resolveMeta(route, entry.code);
      const { fullTitle, tags } = buildHeadTags(route, meta);
      const dest = destFileForLocalizedRoute(route, entry.code);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      const html = injectHeadIntoHtml(template, fullTitle, tags, entry.hreflang, {
        mode: "replace",
      });
      fs.writeFileSync(dest, html, "utf8");
      localeCopies += 1;
    }
  }

  console.log(
    `[seo] Injected per-route head into ${injected} HTML files (locale=${SEO_LOCALE}, hreflang×${LOCALE_META.length}, locale copies=${localeCopies}; tags added=${tagsAdded}, localized=${tagsReplaced}, adopted=${tagsAdopted}).`,
  );
}

main();
