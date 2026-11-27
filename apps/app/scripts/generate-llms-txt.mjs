/**
 * Post-export AI-readability artifacts (https://llmstxt.org/, spec v2):
 *
 *  - `dist/llms.txt`       — H1, blockquote summary, details, then H2 link lists
 *                            (`- [name](url): notes`); secondary pages under
 *                            `## Optional` so agents can skip them.
 *  - `dist/{route}.md`     — a clean markdown version of every indexable registry
 *                            page (title, summary, canonical URL, and the pages
 *                            under it). The app renders its bodies client-side, so
 *                            these give LLMs real text without running JS.
 *  - `dist/llms-full.txt`  — llms.txt followed by every `.md` page, one fetch.
 *  - `<link rel="alternate" type="text/markdown">` (pages with a `.md`) and
 *    `<link rel="describedby" href="/llms.txt">` (every page) in exported HTML,
 *    the discovery links the spec proposes.
 *
 * Source of truth: `seo-routes.data.json` (which pages + order) and the exported
 * HTML heads (titles / descriptions already injected by inject-seo-head.mjs), so
 * nothing here duplicates page copy. Only indexable, self-canonical pages listed
 * in the sitemaps are included.
 *
 * Run after generate-seo-files.mjs (see package.json `build:web`).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(projectRoot, "dist");
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(projectRoot, p), "utf8"));

const ORIGIN = (process.env.EXPO_PUBLIC_APP_URL ?? "https://my.munibtracker.app").replace(
  /\/+$/,
  "",
);
const MARKETING_ORIGIN = (process.env.EXPO_PUBLIC_SITE_URL ?? "https://munibtracker.app").replace(
  /\/+$/,
  "",
);
const REGISTRY = readJson("src/config/seo-routes.data.json");
const LOCALE_META = readJson("src/config/locale-seo-meta.json");
const appJson = readJson("app.json");
const APP_NAME = appJson.expo?.web?.name ?? "Munib Tracker";
const APP_DESCRIPTION = appJson.expo?.web?.description ?? "";
const BRAND_SUFFIX = ` · ${APP_NAME}`;

/** H2 sections of llms.txt: first matching section wins (by first path segment). */
const SECTIONS = [
  {
    title: "Qur'an & Hadith",
    match: ["quran", "hadith", "names-of-allah", "learn-quran"],
  },
  {
    title: "Duas, Adhkar & Zikr",
    match: ["dua", "zikr", "duroods", "tasbeeh", "ruqyah", "learn-dua"],
  },
  {
    title: "Salah, Fasting & Worship Guides",
    match: [
      "salah-guide",
      "qibla",
      "qaza",
      "rawatib",
      "tahajjud",
      "last-third-night",
      "friday",
      "janazah",
      "taharah",
      "travel",
      "sick",
      "hayd",
      "fasting",
      "white-days",
      "ramadan",
      "laylat-al-qadr",
      "eid",
      "dhul-hijjah",
      "hajj",
      "umrah",
      "habits",
      "focus-lock",
    ],
  },
  {
    title: "Zakat, Charity, Inheritance & Finance",
    match: ["zakat", "sadaqah", "fidyah", "finance", "mirath", "wasiyyah"],
  },
  {
    title: "Learn Islam: Belief, Prophets & History",
    match: [
      "aqeedah",
      "prophets",
      "seerah",
      "sahaba",
      "history",
      "events",
      "battles",
      "jannah",
      "jahannam",
      "last-day",
      "new-muslim",
      "flash-cards",
    ],
  },
  { title: "Tools & Library", match: ["calendar", "masjids", "library"] },
];

/** Deeper registry pages promoted out of `## Optional` (high-intent tools). */
const PRIMARY_SUBPAGES = new Set([
  "/quran/juz",
  "/hadith/daily",
  "/qaza/calculator",
  "/zakat/checklist",
  "/calendar/converter",
  "/tasbeeh/free",
  "/umrah/checklist",
  "/hajj/checklist",
]);

// ---------------------------------------------------------------------------

function collectHtmlFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectHtmlFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

function routeForFile(file) {
  let rel = path.relative(distDir, file).split(path.sep).join("/");
  rel = rel.replace(/\.html$/, "").replace(/\/index$/, "");
  if (rel === "index") rel = "";
  return `/${rel}`.replace(/\/+$/, "") || "/";
}

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

function headInfo(html) {
  const head = html.split(/<\/head>/i)[0];
  const title = decode(head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim();
  const description = decode(
    head.match(/<meta(?=[^>]*\bname="description")[^>]*\bcontent="([^"]*)"/i)?.[1] ?? "",
  ).trim();
  return {
    title: title.endsWith(BRAND_SUFFIX) ? title.slice(0, -BRAND_SUFFIX.length) : title,
    description,
  };
}

/** English routes listed in the sitemaps (indexable + self-canonical). */
function indexableRoutes() {
  const xml = fs.readFileSync(path.join(distDir, "sitemaps", "en.xml"), "utf8");
  return new Set(
    [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].slice(ORIGIN.length) || "/"),
  );
}

/** Markdown-safe link text / notes (no brackets or line breaks). */
const mdText = (s) => s.replace(/[[\]]/g, "").replace(/\s+/g, " ").trim();
const absolute = (route) => `${ORIGIN}${route === "/" ? "" : route}`;
/** `.md` version of a clean-URL page: `/zakat` → `/zakat.md` (llms.txt spec: replace extension). */
const mdPath = (route) => (route === "/" ? "/index.md" : `${route}.md`);
const sectionFor = (route) => {
  const first = route.split("/")[1] ?? "";
  return SECTIONS.find((s) => s.match.includes(first));
};

/** inject-seo-head.mjs's generic topic description (see its content-section branch). */
const isFallbackDescription = (d) => /a clear, sourced guide drawn from the Qur'an/.test(d);

export function linkLine({ title, url, notes }) {
  return `- [${mdText(title)}](${url})${notes ? `: ${mdText(notes)}` : ""}`;
}

export function buildPageMarkdown({ route, title, description }, children) {
  const lines = [`# ${mdText(title)}`, "", `> ${mdText(description)}`, ""];
  lines.push(
    `Web page: ${absolute(route)} (part of ${APP_NAME}, a free Islamic companion app — see ${ORIGIN}/llms.txt).`,
  );
  if (children.length) {
    lines.push("", "## Pages", "");
    for (const child of children) {
      // Topic pages without a registry entry carry inject-seo-head's generic
      // fallback description — noise for a model, so list just the title.
      const notes = isFallbackDescription(child.description) ? undefined : child.description;
      lines.push(linkLine({ title: child.title, url: absolute(child.route), notes }));
    }
  }
  return `${lines.join("\n")}\n`;
}

export function buildLlmsTxt(pages) {
  const languages = LOCALE_META.map((e) => e.code).join(", ");
  const out = [
    `# ${APP_NAME}`,
    "",
    `> ${mdText(APP_DESCRIPTION)}`,
    "",
    `${APP_NAME} is a free, offline-first Islamic companion for Salah tracking, Qaza (missed prayers), Zikr and Tasbeeh, the Qur'an, hadith, duas, prayer times, Qibla and Islamic learning. It runs on the web at ${ORIGIN}, on iOS and Android, and on Apple TV / Android TV. The product site is ${MARKETING_ORIGIN}.`,
    "",
    "Notes for language models:",
    "",
    "- Every page below links to a clean Markdown version (`.md`); the HTML pages render their content with JavaScript. `/llms-full.txt` bundles all Markdown pages in one file.",
    "- Religious texts (Qur'an, hadith, duas, adhkar, the 99 Names) come from open, cited datasets, never written by hand; sources and licences are on the Credits page. Calculators (zakat, qaza, fidyah, inheritance) are educational estimates, not religious rulings — users should confirm with a qualified scholar.",
    `- The interface is available in ${LOCALE_META.length} languages (${languages}); non-English pages live under /{language}/ (for example ${ORIGIN}/ar/quran).`,
    "- Personal data (Salah logs, journals, wills, debts) stays on the user's device or in end-to-end encrypted sync; those pages are not indexed.",
  ];

  const optional = [];
  for (const section of SECTIONS) {
    // Hub order follows the section's `match` list (Qur'an before Hadith…).
    const rank = (route) => section.match.indexOf(route.split("/")[1]);
    const items = pages
      .filter((p) => sectionFor(p.route) === section)
      .sort((a, b) => rank(a.route) - rank(b.route));
    const primary = items.filter(
      (p) => p.route.split("/").length === 2 || PRIMARY_SUBPAGES.has(p.route),
    );
    optional.push(...items.filter((p) => !primary.includes(p)));
    if (!primary.length) continue;
    out.push("", `## ${section.title}`, "");
    for (const p of primary) {
      out.push(
        linkLine({ title: p.title, url: `${ORIGIN}${mdPath(p.route)}`, notes: p.description }),
      );
    }
  }
  optional.push(...pages.filter((p) => p.route !== "/" && !sectionFor(p.route)));
  if (optional.length) {
    out.push("", "## Optional", "");
    for (const p of optional) {
      out.push(
        linkLine({ title: p.title, url: `${ORIGIN}${mdPath(p.route)}`, notes: p.description }),
      );
    }
  }
  return `${out.join("\n")}\n`;
}

// ---------------------------------------------------------------------------

function injectDiscoveryLinks(htmlFiles, mdRoutes) {
  let touched = 0;
  for (const file of htmlFiles) {
    let html = fs.readFileSync(file, "utf8");
    if (html.includes('rel="describedby"')) continue;
    const route = routeForFile(file);
    const tags = [`<link rel="describedby" href="/llms.txt" type="text/plain"/>`];
    if (mdRoutes.has(route)) {
      tags.push(`<link rel="alternate" type="text/markdown" href="${mdPath(route)}"/>`);
    }
    html = html.replace("</head>", `${tags.join("")}</head>`);
    fs.writeFileSync(file, html, "utf8");
    touched += 1;
  }
  return touched;
}

function main() {
  if (!fs.existsSync(path.join(distDir, "sitemaps", "en.xml"))) {
    console.error("[llms] dist/sitemaps/en.xml not found — run generate-seo-files.mjs first.");
    process.exit(1);
  }
  const indexable = indexableRoutes();
  const htmlFiles = collectHtmlFiles(distDir);
  /** @type {Map<string, {route: string, title: string, description: string}>} */
  const info = new Map();
  for (const file of htmlFiles) {
    const route = routeForFile(file);
    if (!indexable.has(route)) continue;
    info.set(route, { route, ...headInfo(fs.readFileSync(file, "utf8")) });
  }

  // Registry order = curated order; only pages that actually exported indexable.
  const pages = Object.keys(REGISTRY)
    .filter((route) => route !== "/" && info.has(route))
    .map((route) => info.get(route));

  // Children of a page: indexable pages directly below it that are not
  // themselves registry pages with their own `.md` (those link separately).
  const childrenOf = (route) =>
    [...info.values()]
      .filter((p) => p.route.startsWith(`${route}/`) && !REGISTRY[p.route])
      .sort((a, b) => a.route.localeCompare(b.route, "en", { numeric: true }));

  const mdRoutes = new Set();
  const mdDocs = [];
  for (const page of pages) {
    const md = buildPageMarkdown(page, childrenOf(page.route));
    const dest = path.join(distDir, `${page.route.slice(1)}.md`);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, md, "utf8");
    mdRoutes.add(page.route);
    mdDocs.push(md);
  }

  const llms = buildLlmsTxt(pages);
  fs.writeFileSync(path.join(distDir, "llms.txt"), llms, "utf8");
  fs.writeFileSync(
    path.join(distDir, "llms-full.txt"),
    `${llms}\n---\n\n${mdDocs.join("\n---\n\n")}`,
    "utf8",
  );
  const touched = injectDiscoveryLinks(htmlFiles, mdRoutes);
  console.log(
    `[llms] Wrote llms.txt (${pages.length} pages), llms-full.txt, ${mdRoutes.size} .md pages; discovery links in ${touched} HTML files.`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
