/**
 * Post-export SEO head injection.
 *
 * The app is a client-rendered SPA: Expo's static export emits an HTML shell per
 * route with an empty body (the React tree renders on the client). JS-executing
 * crawlers (Googlebot, Bingbot) run the app and pick up the client-side `<Seo>`
 * head. Non-JS AI crawlers (GPTBot, ClaudeBot, PerplexityBot, …) read raw HTML,
 * so this script bakes each route's real `<head>` — title, description,
 * canonical, robots, Open Graph, Twitter, and JSON-LD — into the exported files.
 *
 * Metadata is resolved DRY from the SAME plain-JSON sources the app uses (no
 * duplicated route lists, Node-20 safe — no TS/loader needed):
 *   • static routes  → `src/config/seo-routes.data.json` (also imported by the app)
 *   • surahs         → `assets/data/quran/meta.json`
 *   • categories/labels → `src/i18n/en.json`
 *   • branding       → `app.json` + `src/i18n/en.json`
 *
 * Injected tags carry `data-rh="true"` so react-helmet-async cleanly reconciles
 * them on the client (mirroring what an SSR Helmet pass would have produced).
 *
 * Run after `expo export --platform web`, before `generate-seo-files.mjs`
 * (which reads the injected robots meta to decide sitemap inclusion).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(projectRoot, "dist");

const readJson = (p) => JSON.parse(fs.readFileSync(path.join(projectRoot, p), "utf8"));

// Registry shared verbatim with the app (`src/config/seo-routes.ts` imports the
// same JSON) — no duplication. Branding is sourced from the app's own config.
const SEO_ROUTES = readJson("src/config/seo-routes.data.json");
const appJson = readJson("app.json");
const en = readJson("src/i18n/en.json");
const APP_NAME = appJson.expo?.web?.name ?? "Munib Tracker";
const APP_TAGLINE = en.common?.appTagline ?? "Track Your Journey Back to Allah.";
const APP_DESCRIPTION = appJson.expo?.web?.description ?? `${APP_TAGLINE}`;
const APP_AUTHOR = en.about?.authorValue ?? "Mubbasher Ahmed Qureshi";

/** Normalize a pathname to a canonical registry key (mirrors seo-routes.ts). */
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

// ── Content data (read directly — plain JSON) ──────────────────────────────────
const surahMeta = readJson("assets/data/quran/meta.json");
const surahs = new Map(surahMeta.surahs.map((s) => [String(s.number), s]));

// FAQ + index ItemLists shared with the client `<Seo>` (same JSON / same data)
// so AI answer engines get them from the raw HTML too.
const FAQ_BY_ROUTE = readJson("src/config/seo-faq.data.json");
const SURAH_ITEMS = surahMeta.surahs.map((s) => ({
  name: `${s.number}. ${s.nameTransliteration} (${s.nameEnglish})`,
  path: `/quran/${s.number}`,
}));
const catItems = (labels, base) =>
  Object.entries(labels ?? {}).map(([id, name]) => ({ name, path: `${base}/${id}` }));
const ITEMS_BY_ROUTE = {
  "/quran": SURAH_ITEMS,
  "/dua": catItems(en.duaCat, "/dua"),
  "/zikr": catItems(en.zikrCat, "/zikr"),
};

// Learn/knowledge sections whose dynamic topic pages (pre-rendered via
// `generateStaticParams`) are indexable content. Maps the URL segment → the
// i18n namespace that holds the section's display title. Any route under these
// that isn't an explicit registry entry is treated as a content article.
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

/** Title-case a slug segment ("daily-after-eating" → "After Eating"). */
function humanizeSlug(slug, stripPrefixes = []) {
  let s = decodeURIComponent(slug);
  for (const p of stripPrefixes) if (s.startsWith(`${p}-`)) s = s.slice(p.length + 1);
  return s
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Resolve SEO metadata for a route. Returns { title, description, keywords[],
 * index, breadcrumbs[], extra[] } where breadcrumbs/extra feed JSON-LD.
 */
function resolveMeta(route) {
  const key = normalizePath(route);

  // Un-parameterized dynamic template files (e.g. `/dua/detail/[id]`) are build
  // artifacts, not real pages — keep them out of the index.
  if (/[[\]]/.test(key)) {
    return {
      title: `${APP_NAME} — ${APP_TAGLINE}`,
      description: APP_DESCRIPTION,
      keywords: [],
      index: false,
      breadcrumbs: [],
    };
  }

  const registry = SEO_ROUTES[key];
  const home = { name: en.tabs?.home ?? "Home", path: "/" };

  if (registry) {
    return {
      title: registry.title ?? `${APP_NAME} — ${APP_TAGLINE}`,
      isHome: key === "/",
      description: registry.description,
      keywords: registry.keywords ?? [],
      index: registry.index ?? true,
      breadcrumbs: key === "/" ? [] : [home, { name: registry.title ?? key, path: key }],
    };
  }

  // Dynamic: /quran/<n>
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
        { name: en.quran?.title ?? "Qur'an", path: "/quran" },
        { name: s.nameTransliteration, path: key },
      ],
    };
  }

  // Dynamic: /dua/<cat> or /zikr/<cat>
  m = key.match(/^\/(dua|zikr)\/([a-z_]+)$/);
  if (m && (m[1] === "dua" ? en.duaCat : en.zikrCat)?.[m[2]]) {
    const kind = m[1];
    const label = (kind === "dua" ? en.duaCat : en.zikrCat)[m[2]];
    const root =
      kind === "dua"
        ? { name: en.dua?.title ?? "Duas", path: "/dua" }
        : { name: en.zikr?.title ?? "Zikr", path: "/zikr" };
    return {
      title: label,
      description: `${label} — authentic ${kind === "dua" ? "supplications" : "adhkar"} with Arabic, transliteration, and meaning, available offline.`,
      keywords: [label, kind === "dua" ? "islamic duas" : "daily adhkar"],
      index: true,
      breadcrumbs: [home, root, { name: label, path: key }],
    };
  }

  // Dynamic: detail / collection pages → readable title from the slug
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
        ? { name: en.dua?.title ?? "Duas", path: "/dua" }
        : { name: en.zikr?.title ?? "Zikr", path: "/zikr" };
    return {
      title,
      description: `${title} — read the Arabic, transliteration, and meaning of this ${kind === "dua" ? "dua" : "zikr"} on ${APP_NAME}.`,
      keywords: [title, kind === "dua" ? "islamic dua" : "zikr"],
      index: true,
      type: "article",
      breadcrumbs: [home, root, { name: title, path: key }],
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
        { name: en.hadith?.title ?? "Hadith", path: "/hadith" },
        { name: title, path: key },
      ],
    };
  }

  // Dynamic learn/knowledge topic pages (e.g. `/aqeedah/tawheed`,
  // `/prophets/musa`, `/learn-quran/story/adam`) that aren't explicit registry
  // entries. The per-topic title lives in TS content the client `<Seo>` resolves;
  // here we bake a readable slug title + Article JSON-LD so non-JS crawlers still
  // get an indexable, described page.
  const contentMatch = key.match(/^\/([a-z-]+)\/(.+)$/);
  const lastSeg = contentMatch?.[2].split("/").pop() ?? "";
  // Safety net: personal/interactive sub-pages stay out of the index even if a
  // registry entry is missing (they are normally registered as index:false).
  const isUtilitySeg = /^(progress|quiz|journal)$/.test(lastSeg);
  if (contentMatch && CONTENT_SECTION_NS[contentMatch[1]] && !isUtilitySeg) {
    const section = contentMatch[1];
    const sectionTitle = en[CONTENT_SECTION_NS[section]]?.title ?? humanizeSlug(section);
    const title = humanizeSlug(lastSeg || contentMatch[2]);
    return {
      title,
      description: `${title} — part of ${sectionTitle} on ${APP_NAME}, with evidence from the Qur'an and authentic Sunnah.`,
      keywords: [title, sectionTitle],
      index: true,
      type: "article",
      breadcrumbs: [home, { name: sectionTitle, path: `/${section}` }, { name: title, path: key }],
    };
  }

  // Fallback (unknown route) — app defaults, noindex to avoid thin pages.
  return {
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
    keywords: [],
    index: false,
    breadcrumbs: [],
  };
}

/** Build the JSON-LD blocks for a route (WebPage/CollectionPage + Breadcrumb [+ FAQ/ItemList]). */
function buildJsonLd(route, meta) {
  const key = normalizePath(route);
  const url = absolute(route);
  const items = ITEMS_BY_ROUTE[key];
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
    inLanguage: "en",
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

/** Compose the `<head>` tag string injected per route (all data-rh managed). */
function buildHeadTags(route, meta) {
  const url = absolute(route);
  const fullTitle = meta.isHome ? meta.title : `${meta.title} · ${APP_NAME}`;
  const robots = meta.index
    ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    : "noindex, follow";
  const keywords = [...new Set([...(meta.keywords ?? []), ...DEFAULT_KEYWORDS])].join(", ");
  const d = escapeHtml(meta.description);
  const rawTitle = escapeHtml(meta.title);
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
    `<meta data-rh="true" property="og:locale" content="en_US"/>`,
    // Content is also available in Arabic and Urdu via the in-app language switcher.
    `<meta data-rh="true" property="og:locale:alternate" content="ar_AR"/>`,
    `<meta data-rh="true" property="og:locale:alternate" content="ur_PK"/>`,
    `<meta data-rh="true" name="twitter:card" content="summary_large_image"/>`,
    `<meta data-rh="true" name="twitter:title" content="${rawTitle}"/>`,
    `<meta data-rh="true" name="twitter:description" content="${d}"/>`,
    `<meta data-rh="true" name="twitter:image" content="${OG_IMAGE}"/>`,
  ];
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
    const base = path.basename(file);
    if (base.startsWith("_") || base === "+not-found.html") {
      // Framework/util shells still get a noindex title so they aren't blank.
    }
    let route = routeForFile(file);
    // Strip a leading route-group segment so "(tabs)/settings" resolves like "/settings".
    route = route.replace(/\/\([^)]*\)/g, "") || "/";
    const meta = resolveMeta(route);
    const { fullTitle, tags } = buildHeadTags(route, meta);

    let html = fs.readFileSync(file, "utf8");
    // Replace the empty helmet title with the real one.
    html = html.replace(/<title[^>]*>.*?<\/title>/i, `<title data-rh="true">${fullTitle}</title>`);
    // Insert the metadata block right before </head>.
    if (!html.includes('rel="canonical"')) {
      html = html.replace("</head>", `${tags}</head>`);
      injected += 1;
    }
    fs.writeFileSync(file, html, "utf8");
  }
  console.log(`[seo] Injected per-route head into ${injected} HTML files.`);
}

main();
