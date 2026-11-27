/**
 * SEO audit of a finished web export (`dist/`, after inject-seo-head +
 * generate-seo-files). Checks every exported English page — the locale copies
 * are generated from the same metadata — and prints what would hurt indexing:
 *
 *  - noindex pages that are NOT opted out in `seo-routes.data.json`
 *    (accidental noindex from a missing registry entry / section mapping)
 *  - generic fallback titles, missing / duplicate titles and descriptions,
 *    titles > 65 chars, descriptions < 70 or > 170 chars
 *  - missing, duplicate or non-self canonicals; missing hreflang
 *  - indexable pages missing from the sitemaps
 *
 * Usage: `node scripts/audit-seo.mjs [--json]` (exit 1 when errors are found).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { unregisteredRoutePolicy } from "./lib/seo-route-policy.mjs";

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(projectRoot, "dist");
const ORIGIN = (process.env.EXPO_PUBLIC_APP_URL ?? "https://my.munibtracker.app").replace(
  /\/+$/,
  "",
);
const REGISTRY = JSON.parse(
  fs.readFileSync(path.join(projectRoot, "src/config/seo-routes.data.json"), "utf8"),
);
const LOCALES = new Set(
  JSON.parse(
    fs.readFileSync(path.join(projectRoot, "src/config/locale-seo-meta.json"), "utf8"),
  ).map((e) => e.code),
);

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

function headOf(html) {
  const head = html.split(/<\/head>/i)[0];
  const all = (re) => [...head.matchAll(re)].map((m) => decode(m[1]));
  return {
    titles: all(/<title[^>]*>([\s\S]*?)<\/title>/gi),
    descriptions: all(/<meta(?=[^>]*\bname="description")[^>]*\bcontent="([^"]*)"/gi),
    canonicals: all(/<link(?=[^>]*\brel="canonical")[^>]*\bhref="([^"]*)"/gi),
    robots: all(/<meta(?=[^>]*\bname="robots")[^>]*\bcontent="([^"]*)"/gi),
    hreflangs: all(/<link(?=[^>]*\bhreflang=")[^>]*\bhreflang="([^"]*)"/gi),
  };
}

function sitemapUrls() {
  const dir = path.join(distDir, "sitemaps");
  const urls = new Set();
  if (!fs.existsSync(dir)) return urls;
  for (const f of fs.readdirSync(dir)) {
    const xml = fs.readFileSync(path.join(dir, f), "utf8");
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.add(m[1]);
  }
  return urls;
}

/** Resolve a same-origin URL to the dist file that serves it (cleanUrls), or null. */
function distFileFor(url) {
  if (!url.startsWith(`${ORIGIN}/`) && url !== ORIGIN) return null;
  const route = decodeURIComponent(url.slice(ORIGIN.length)) || "/";
  const rel = route.replace(/^\/+/, "");
  const cands = [
    path.join(distDir, rel),
    path.join(distDir, `${rel}.html`),
    path.join(distDir, rel, "index.html"),
  ];
  return cands.find((c) => fs.existsSync(c) && fs.statSync(c).isFile()) ?? null;
}

/**
 * Validates `dist/llms.txt` against the llmstxt.org spec (v2) using the
 * reference parser's regexes, plus every link and `.md` page it points to.
 */
export function auditLlmsTxt(errors, warnings) {
  const file = path.join(distDir, "llms.txt");
  if (!fs.existsSync(file)) {
    errors.push({ route: "/llms.txt", issue: "llms-missing" });
    return;
  }
  // Optional byte-order mark (allowed by the spec).
  const raw = fs.readFileSync(file, "utf8");
  const txt = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
  // Reference parser (llmstxt.org/intro.html): H1, optional blockquote, info.
  const head = txt.match(/^#\s*(?<title>.+?$)\n+(?:^>\s*(?<summary>.+?$)$)?\n+(?<info>.*)/ms);
  if (!txt.startsWith("# ") || !head?.groups?.title) {
    errors.push({ route: "/llms.txt", issue: "llms-no-h1" });
    return;
  }
  if (!head.groups.summary) warnings.push({ route: "/llms.txt", issue: "llms-no-summary" });
  if (/^#{3,}\s/m.test(txt)) errors.push({ route: "/llms.txt", issue: "llms-h3-heading" });
  if ((txt.match(/^#\s/gm) ?? []).length !== 1)
    errors.push({ route: "/llms.txt", issue: "llms-h1-count" });

  const parts = txt.split(/^##\s*(.*?$)/m);
  const sections = [];
  for (let i = 1; i < parts.length; i += 2)
    sections.push({ title: parts[i].trim(), body: parts[i + 1] });
  if (!sections.length) errors.push({ route: "/llms.txt", issue: "llms-no-sections" });
  const optionalAt = sections.findIndex((s) => s.title === "Optional");
  if (optionalAt !== -1 && optionalAt !== sections.length - 1)
    errors.push({ route: "/llms.txt", issue: "llms-optional-not-last" });

  const LINK_RE = /^-\s*\[(?<title>[^\]]+)\]\((?<url>[^)]+)\)(?::\s*(?<desc>.*))?$/;
  let links = 0;
  const mdFiles = new Set();
  for (const section of sections) {
    for (const line of section.body.split("\n").filter((l) => l.trim())) {
      const m = line.match(LINK_RE);
      if (!m) {
        errors.push({
          route: "/llms.txt",
          issue: "llms-bad-list-line",
          detail: `${section.title}: ${line}`,
        });
        continue;
      }
      links += 1;
      const target = distFileFor(m.groups.url);
      if (!target)
        errors.push({ route: "/llms.txt", issue: "llms-dead-link", detail: m.groups.url });
      else if (target.endsWith(".md")) mdFiles.add(target);
    }
  }
  if (links === 0) errors.push({ route: "/llms.txt", issue: "llms-no-links" });

  // Each linked Markdown page: H1 first, and its own links resolve.
  for (const md of mdFiles) {
    const body = fs.readFileSync(md, "utf8");
    const rel = `/${path.relative(distDir, md).split(path.sep).join("/")}`;
    if (!body.startsWith("# ")) errors.push({ route: rel, issue: "md-no-h1" });
    for (const m of body.matchAll(/\]\((https?:[^)]+)\)/g)) {
      if (!distFileFor(m[1])) errors.push({ route: rel, issue: "md-dead-link", detail: m[1] });
    }
  }

  const full = path.join(distDir, "llms-full.txt");
  if (!fs.existsSync(full) || !fs.readFileSync(full, "utf8").startsWith(txt.slice(0, 200)))
    errors.push({ route: "/llms-full.txt", issue: "llms-full-missing-or-stale" });

  // Discovery links (spec: rel="describedby" → llms.txt; rel="alternate" text/markdown).
  const home = fs.readFileSync(path.join(distDir, "index.html"), "utf8");
  if (!/rel="describedby" href="\/llms\.txt"/.test(home))
    errors.push({ route: "/", issue: "llms-no-describedby-link" });
  for (const md of mdFiles) {
    const route = `/${path.relative(distDir, md).split(path.sep).join("/")}`.replace(/\.md$/, "");
    const html = distFileFor(`${ORIGIN}${route}`);
    if (html && !fs.readFileSync(html, "utf8").includes(`type="text/markdown" href="${route}.md"`))
      errors.push({ route, issue: "llms-no-markdown-alternate" });
  }
  console.error(
    `[seo-audit] llms.txt: ${sections.length} sections, ${links} links, ${mdFiles.size} markdown pages checked`,
  );
}

function main() {
  if (!fs.existsSync(distDir)) {
    console.error("[seo-audit] dist/ not found — run `pnpm --filter app build:web` first.");
    process.exit(1);
  }
  const inSitemap = sitemapUrls();
  const pages = [];
  for (const file of collectHtmlFiles(distDir)) {
    const route = routeForFile(file);
    const first = route.split("/")[1] ?? "";
    if (LOCALES.has(first) && first !== "en") continue; // locale copies
    if (/[[\]()]/.test(route) || route.split("/").some((s) => /^[+_]/.test(s))) continue;
    pages.push({ route, ...headOf(fs.readFileSync(file, "utf8")) });
  }

  if (pages.length === 0) {
    console.error("[seo-audit] no exported pages found in dist/ — did the export fail?");
    process.exit(1);
  }

  const errors = [];
  const warnings = [];
  const byTitle = new Map();
  const byDesc = new Map();
  const genericTitle = REGISTRY["/"]?.title;

  for (const p of pages) {
    const url = `${ORIGIN}${p.route === "/" ? "" : p.route}`;
    const noindex = p.robots.some((r) => /noindex/i.test(r));
    // Intentional: registry opt-out, or utility / under a noindex hub (shared policy).
    const optedOut = REGISTRY[p.route]
      ? REGISTRY[p.route].index === false
      : unregisteredRoutePolicy(p.route, REGISTRY).intentional === true;
    const title = p.titles[0] ?? "";
    const desc = p.descriptions[0] ?? "";

    if (noindex && !optedOut) {
      errors.push({ route: p.route, issue: "accidental-noindex", detail: title });
    }
    if (noindex) continue;

    if (p.titles.length !== 1)
      errors.push({ route: p.route, issue: "title-count", detail: p.titles.length });
    if (!title || (p.route !== "/" && genericTitle && title.startsWith(genericTitle)))
      errors.push({ route: p.route, issue: "generic-title", detail: title });
    if (title.length > 65) warnings.push({ route: p.route, issue: "title>65", detail: title });
    if (p.descriptions.length !== 1)
      errors.push({ route: p.route, issue: "description-count", detail: p.descriptions.length });
    if (desc.length < 70 || desc.length > 170)
      warnings.push({ route: p.route, issue: `description-length(${desc.length})`, detail: desc });
    if (p.canonicals.length !== 1)
      errors.push({ route: p.route, issue: "canonical-count", detail: p.canonicals.length });
    else if (p.canonicals[0].replace(/\/+$/, "") !== url)
      errors.push({ route: p.route, issue: "canonical-not-self", detail: p.canonicals[0] });
    if (p.hreflangs.length < 2) warnings.push({ route: p.route, issue: "no-hreflang" });
    if (!inSitemap.has(url)) errors.push({ route: p.route, issue: "missing-from-sitemap" });

    byTitle.set(title, [...(byTitle.get(title) ?? []), p.route]);
    byDesc.set(desc, [...(byDesc.get(desc) ?? []), p.route]);
  }
  for (const [title, routes] of byTitle)
    if (routes.length > 1)
      warnings.push({ route: routes.join(", "), issue: "duplicate-title", detail: title });
  for (const [desc, routes] of byDesc)
    if (routes.length > 1)
      warnings.push({ route: routes.join(", "), issue: "duplicate-description", detail: desc });

  auditLlmsTxt(errors, warnings);

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify({ pages: pages.length, errors, warnings }, null, 2));
  } else {
    const print = (label, list) => {
      const grouped = new Map();
      for (const item of list) grouped.set(item.issue, [...(grouped.get(item.issue) ?? []), item]);
      for (const [issue, items] of grouped) {
        console.log(`\n${label} ${issue} (${items.length})`);
        for (const i of items.slice(0, 40))
          console.log(
            `  ${i.route}${i.detail != null ? `  — ${String(i.detail).slice(0, 110)}` : ""}`,
          );
        if (items.length > 40) console.log(`  … ${items.length - 40} more`);
      }
    };
    print("ERROR", errors);
    print("warn ", warnings);
    console.log(
      `\n[seo-audit] ${pages.length} English pages · ${errors.length} errors · ${warnings.length} warnings`,
    );
  }
  process.exit(errors.length ? 1 : 0);
}

main();
