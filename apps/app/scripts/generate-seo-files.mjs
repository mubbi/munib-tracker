/**
 * Post-export SEO artifacts: writes `dist/robots.txt`, the `dist/sitemap.xml`
 * sitemap index and one child sitemap per locale (`dist/sitemaps/{locale}.xml`),
 * by scanning the statically-exported HTML.
 *
 * Source of truth is the export itself — a page is listed iff it was
 * pre-rendered, does not carry a `noindex` robots meta, and its canonical is
 * itself (sitemaps must list canonical URLs only). This keeps robots/sitemap in
 * sync with per-page metadata with zero duplicated route lists.
 *
 * Why an index of small, plain sitemaps (Google sitemap rules):
 *  - one sitemap file is capped at 50,000 URLs / 50 MB uncompressed. Listing all
 *    24 hreflang alternates inside every <url> made the single file ~52 MB for
 *    ~19k URLs — at (or over) the cap, so Search Console could reject the lot.
 *    hreflang already ships in each page's <head>; one method is enough.
 *  - `<changefreq>` / `<priority>` are ignored by Google, and a `<lastmod>`
 *    stamped with the build date on every URL is not "verifiably accurate", so
 *    Google learns to ignore it — both are omitted.
 *
 * Run after `inject-seo-head.mjs` (see package.json `build:web`).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(projectRoot, "dist");

const ORIGIN = (process.env.EXPO_PUBLIC_APP_URL ?? "https://my.munibtracker.app").replace(
  /\/+$/,
  "",
);

const LOCALE_META = JSON.parse(
  fs.readFileSync(path.join(projectRoot, "src/config/locale-seo-meta.json"), "utf8"),
);
const LOCALE_CODES = new Set(LOCALE_META.map((entry) => entry.code));
const DEFAULT_LOCALE = "en";

/** Stay well under Google's 50,000-URL / 50 MB per-file limits. */
const MAX_URLS_PER_SITEMAP = 40_000;
const SITEMAP_DIR = "sitemaps";

/** Recursively collect every `.html` file under `dir`. */
function collectHtmlFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectHtmlFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

/** Map a dist HTML file path to its canonical route (respecting cleanUrls). */
export function routeForFile(file, root = distDir) {
  let rel = path.relative(root, file).split(path.sep).join("/");
  rel = rel.replace(/\.html$/, "");
  rel = rel.replace(/\/index$/, "");
  if (rel === "index") rel = "";
  return `/${rel}`.replace(/\/+$/, "") || "/";
}

const NOINDEX_RE = /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i;
const CANONICAL_RE = /<link(?=[^>]*\brel=["']canonical["'])[^>]*\bhref=["']([^"']+)["'][^>]*>/i;

export const absoluteUrl = (route) => `${ORIGIN}${route === "/" ? "" : route}`;

/** Locale a route belongs to: `/ar/quran` → `ar`, unprefixed → `en`. */
export function localeForRoute(route) {
  const first = route.split("/")[1] ?? "";
  return LOCALE_CODES.has(first) && first !== DEFAULT_LOCALE ? first : DEFAULT_LOCALE;
}

export function isRoutePublishable(route, html) {
  // Skip framework/dynamic/error artifacts and any page that opted out via noindex.
  if (/[[\]]/.test(route)) return false; // un-parameterized dynamic template
  if (/\([^)]*\)/.test(route)) return false; // route-group folder duplicate (e.g. "(tabs)")
  const segments = route.split("/").filter(Boolean);
  if (segments.some((segment) => segment.startsWith("+") || segment.startsWith("_"))) return false;
  if (segments.at(-1) === "404") return false;
  if (NOINDEX_RE.test(html)) return false;
  // Only self-canonical pages belong in a sitemap.
  const canonical = html.match(CANONICAL_RE)?.[1];
  if (canonical && canonical.replace(/\/+$/, "") !== absoluteUrl(route)) return false;
  return true;
}

const xmlEscape = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export function buildUrlset(routes) {
  const urls = routes.map((route) => `  <url><loc>${xmlEscape(absoluteUrl(route))}</loc></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

export function buildSitemapIndex(files) {
  const entries = files.map(
    (file) => `  <sitemap><loc>${xmlEscape(`${ORIGIN}/${file}`)}</loc></sitemap>`,
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</sitemapindex>\n`;
}

const sortRoutes = (a, b) => {
  const depth = (r) => (r === "/" ? 0 : r.split("/").length);
  return depth(a) - depth(b) || a.localeCompare(b);
};

export function buildRobots() {
  // Open to all crawlers; AI answer-engine bots named explicitly to signal intent.
  // Never disallow `/_expo/` — Google must fetch the JS bundles to render pages.
  const aiBots = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "PerplexityBot",
    "Google-Extended",
    "Applebot-Extended",
    "CCBot",
    "Bytespider",
    "Amazonbot",
  ];
  return [
    "# https://www.robotstxt.org/robotstxt.html",
    "User-agent: *",
    "Allow: /",
    "",
    ...aiBots.flatMap((bot) => [`User-agent: ${bot}`, "Allow: /", ""]),
    `Sitemap: ${ORIGIN}/sitemap.xml`,
    "",
    `# LLM-readable site guide (https://llmstxt.org/): ${ORIGIN}/llms.txt`,
    "",
  ].join("\n");
}

function main() {
  if (!fs.existsSync(distDir)) {
    console.error(`[seo] dist/ not found at ${distDir} — run the web export first.`);
    process.exit(1);
  }

  /** @type {Map<string, string[]>} */
  const byLocale = new Map();
  for (const file of collectHtmlFiles(distDir)) {
    const route = routeForFile(file);
    if (!isRoutePublishable(route, fs.readFileSync(file, "utf8"))) continue;
    const locale = localeForRoute(route);
    if (!byLocale.has(locale)) byLocale.set(locale, []);
    byLocale.get(locale).push(route);
  }

  const outDir = path.join(distDir, SITEMAP_DIR);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const locales = [...byLocale.keys()].sort((a, b) =>
    a === DEFAULT_LOCALE ? -1 : b === DEFAULT_LOCALE ? 1 : a.localeCompare(b),
  );
  const childFiles = [];
  let total = 0;
  for (const locale of locales) {
    const routes = [...new Set(byLocale.get(locale))].sort(sortRoutes);
    total += routes.length;
    for (let i = 0; i < routes.length; i += MAX_URLS_PER_SITEMAP) {
      const part = i / MAX_URLS_PER_SITEMAP;
      const name = `${SITEMAP_DIR}/${locale}${part ? `-${part + 1}` : ""}.xml`;
      fs.writeFileSync(
        path.join(distDir, name),
        buildUrlset(routes.slice(i, i + MAX_URLS_PER_SITEMAP)),
        "utf8",
      );
      childFiles.push(name);
    }
  }

  fs.writeFileSync(path.join(distDir, "sitemap.xml"), buildSitemapIndex(childFiles), "utf8");
  fs.writeFileSync(path.join(distDir, "robots.txt"), buildRobots(), "utf8");

  console.log(
    `[seo] Wrote sitemap.xml index → ${childFiles.length} sitemaps (${total} urls) and robots.txt → dist/`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
