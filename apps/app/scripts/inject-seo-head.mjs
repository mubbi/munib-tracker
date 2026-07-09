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
 * All 23 locales get `hreflang` + `og:locale:alternate` tags (SPA — same URL).
 *
 * Run after `expo export --platform web`, before `generate-seo-files.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

function itemsByRoute(L) {
  return {
    "/quran": surahItems(L),
    "/dua": catItems(L.duaCat, "/dua"),
    "/zikr": catItems(L.zikrCat, "/zikr"),
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
      "morning",
      "evening",
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

  const contentMatch = key.match(/^\/([a-z-]+)\/(.+)$/);
  const lastSeg = contentMatch?.[2].split("/").pop() ?? "";
  const isUtilitySeg = /^(progress|quiz|journal)$/.test(lastSeg);
  if (contentMatch && CONTENT_SECTION_NS[contentMatch[1]] && !isUtilitySeg) {
    const section = contentMatch[1];
    const sectionTitle = L[CONTENT_SECTION_NS[section]]?.title ?? humanizeSlug(section);
    const title = humanizeSlug(lastSeg || contentMatch[2]);
    return {
      title,
      description: `${title} — part of ${sectionTitle} on ${APP_NAME}, with evidence from the Qur'an and authentic Sunnah.`,
      keywords: [title, sectionTitle],
      index: true,
      type: "article",
      breadcrumbs: [home, { name: sectionTitle, path: `/${section}` }, { name: title, path: key }],
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
  const url = absolute(route);
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
  const url = absolute(route);
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
  ];

  for (const entry of LOCALE_META) {
    if (entry.code === (meta.locale ?? SEO_LOCALE)) continue;
    tags.push(`<meta data-rh="true" property="og:locale:alternate" content="${entry.ogLocale}"/>`);
    tags.push(`<link data-rh="true" rel="alternate" hreflang="${entry.hreflang}" href="${url}"/>`);
  }
  tags.push(`<link data-rh="true" rel="alternate" hreflang="x-default" href="${url}"/>`);

  for (const block of buildJsonLd(route, meta)) {
    tags.push(
      `<script data-rh="true" type="application/ld+json">${JSON.stringify(block)}</script>`,
    );
  }
  return { fullTitle: escapeHtml(fullTitle), tags: tags.join("") };
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

function main() {
  if (!fs.existsSync(distDir)) {
    console.error(`[seo] dist/ not found — run the web export first.`);
    process.exit(1);
  }
  let injected = 0;
  for (const file of collectHtmlFiles(distDir)) {
    let route = routeForFile(file);
    route = route.replace(/\/\([^)]*\)/g, "") || "/";
    const meta = resolveMeta(route, SEO_LOCALE);
    const { fullTitle, tags } = buildHeadTags(route, meta);

    let html = fs.readFileSync(file, "utf8");
    html = html.replace(/<title[^>]*>.*?<\/title>/i, `<title data-rh="true">${fullTitle}</title>`);
    html = html.replace(
      /<html([^>]*)lang="[^"]*"/i,
      `<html$1 lang="${localeMetaByCode.get(SEO_LOCALE)?.hreflang ?? "en"}"`,
    );
    if (!html.includes('rel="canonical"')) {
      html = html.replace("</head>", `${tags}</head>`);
      injected += 1;
    }
    fs.writeFileSync(file, html, "utf8");
  }
  console.log(
    `[seo] Injected per-route head into ${injected} HTML files (locale=${SEO_LOCALE}, hreflang×${LOCALE_META.length}).`,
  );
}

main();
