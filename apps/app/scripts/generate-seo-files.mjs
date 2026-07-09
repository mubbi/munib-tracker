/**
 * Post-export SEO artifacts: writes `dist/robots.txt` and `dist/sitemap.xml`
 * by scanning the statically-exported HTML.
 *
 * Source of truth is the export itself — a page is included in the sitemap iff
 * it was pre-rendered AND does not carry a `noindex` robots meta (emitted by
 * <Seo> for utility/private/thin routes). This keeps robots/sitemap perfectly
 * in sync with per-page metadata with zero duplicated route lists.
 *
 * Run after `expo export --platform web` (see package.json `build:web`).
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
function routeForFile(file) {
  let rel = path.relative(distDir, file).split(path.sep).join("/");
  rel = rel.replace(/\.html$/, "");
  rel = rel.replace(/\/index$/, "");
  if (rel === "index") rel = "";
  return `/${rel}`.replace(/\/+$/, "") || "/";
}

const NOINDEX_RE = /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i;

function isRoutePublishable(route, html) {
  // Skip framework/dynamic/error artifacts and any page that opted out via noindex.
  if (/[[\]]/.test(route)) return false; // un-parameterized dynamic template
  if (/\([^)]*\)/.test(route)) return false; // route-group folder duplicate (e.g. "(tabs)")
  const base = route.split("/").pop() ?? "";
  if (base.startsWith("+") || base.startsWith("_")) return false;
  if (route === "/404" || route === "/_sitemap") return false;
  if (NOINDEX_RE.test(html)) return false;
  return true;
}

function main() {
  if (!fs.existsSync(distDir)) {
    console.error(`[seo] dist/ not found at ${distDir} — run the web export first.`);
    process.exit(1);
  }

  const files = collectHtmlFiles(distDir);
  const routes = new Set();
  for (const file of files) {
    const html = fs.readFileSync(file, "utf8");
    const route = routeForFile(file);
    if (isRoutePublishable(route, html)) routes.add(route);
  }

  const sorted = [...routes].sort((a, b) => {
    if (a === "/") return -1;
    if (b === "/") return 1;
    return a.localeCompare(b);
  });

  const lastmod = new Date().toISOString().slice(0, 10);
  const urlset = sorted
    .map((route) => {
      const loc = `${ORIGIN}${route === "/" ? "" : route}`;
      const priority = route === "/" ? "1.0" : route.split("/").length <= 2 ? "0.8" : "0.6";
      const hreflangLinks = LOCALE_META.map(
        (entry) => `    <xhtml:link rel="alternate" hreflang="${entry.hreflang}" href="${loc}"/>`,
      ).join("\n");
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        hreflangLinks,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>`,
        `    <lastmod>${lastmod}</lastmod>`,
        "    <changefreq>weekly</changefreq>",
        `    <priority>${priority}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urlset}\n</urlset>\n`;
  fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap, "utf8");

  // Open to all crawlers; AI answer-engine bots named explicitly to signal intent.
  const aiBots = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-Web",
    "PerplexityBot",
    "Google-Extended",
    "Applebot-Extended",
    "CCBot",
    "Bytespider",
    "Amazonbot",
  ];
  const robots = [
    "# https://www.robotstxt.org/robotstxt.html",
    "User-agent: *",
    "Allow: /",
    "",
    ...aiBots.flatMap((bot) => [`User-agent: ${bot}`, "Allow: /", ""]),
    `Sitemap: ${ORIGIN}/sitemap.xml`,
    "",
  ].join("\n");
  fs.writeFileSync(path.join(distDir, "robots.txt"), robots, "utf8");

  console.log(`[seo] Wrote sitemap.xml (${sorted.length} urls) and robots.txt → dist/`);
}

main();
