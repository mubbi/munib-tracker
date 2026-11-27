/**
 * IndexNow ping after a production deploy (https://www.indexnow.org).
 *
 * Bing, Yandex, Seznam, Naver and others share submissions, and ChatGPT
 * search uses Bing's index — so new and updated pages are picked up within
 * hours instead of waiting for a crawl.
 *
 *   node scripts/indexnow.ts                 # pages updated since the last ping (or the last 7 days)
 *   node scripts/indexnow.ts --since 2026-11-01
 *   node scripts/indexnow.ts --all           # every URL in the sitemap
 *   node scripts/indexnow.ts --dry-run       # print, don't submit
 *
 * Reads the LIVE sitemap (run it after `vercel deploy --prod`), keeps the URLs
 * whose `<lastmod>` is on/after the cut-off, checks the key file is served,
 * then POSTs them to api.indexnow.org. The last successful ping date is kept
 * in `.indexnow-last.json` (gitignored) on the machine that deploys.
 *
 * Plain Node (24+ strips the types); no dependencies.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/** Public key; also served as `/<key>.txt` from `public/`. */
export const INDEXNOW_KEY = "413e0ed5370853ba9114f22952893236";
const ENDPOINT = "https://api.indexnow.org/indexnow";
/** IndexNow accepts up to 10,000 URLs per request. */
const BATCH = 10_000;
const DEFAULT_LOOKBACK_DAYS = 7;

export type SitemapEntry = { loc: string; lastmod?: string };

/** `<url><loc>…</loc><lastmod>…</lastmod></url>` entries (alternate links and images ignored). */
export function parseSitemap(xml: string): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const [, body = ""] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = body.match(/<loc>\s*([^<\s]+)\s*<\/loc>/)?.[1];
    if (!loc) continue;
    const lastmod = body.match(/<lastmod>\s*([^<\s]+)\s*<\/lastmod>/)?.[1];
    entries.push(lastmod ? { loc, lastmod } : { loc });
  }
  return entries;
}

/** URLs changed on/after `since` (YYYY-MM-DD); entries without a date are always included. */
export function changedSince(entries: readonly SitemapEntry[], since: string | null): string[] {
  const urls = entries
    .filter((e) => since === null || !e.lastmod || e.lastmod.slice(0, 10) >= since)
    .map((e) => e.loc);
  return [...new Set(urls)];
}

/** The IndexNow request body for one host. */
export function indexNowPayload(siteUrl: string, urls: readonly string[]) {
  const { host, origin } = new URL(siteUrl);
  return {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${origin}/${INDEXNOW_KEY}.txt`,
    urlList: urls.filter((u) => new URL(u).host === host),
  };
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const flag = (name: string) => args.includes(name);
  const option = (name: string) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://munibtracker.app").replace(
    /\/$/,
    "",
  );
  const stateFile = resolve(dirname(fileURLToPath(import.meta.url)), "../.indexnow-last.json");
  const lastPing = existsSync(stateFile)
    ? (JSON.parse(readFileSync(stateFile, "utf8")) as { date?: string }).date
    : undefined;
  const since = flag("--all")
    ? null
    : (option("--since") ?? lastPing ?? daysAgo(DEFAULT_LOOKBACK_DAYS));

  const sitemap = await fetch(`${siteUrl}/sitemap.xml`);
  if (!sitemap.ok) throw new Error(`Sitemap: HTTP ${sitemap.status}`);
  const urls = changedSince(parseSitemap(await sitemap.text()), since);
  console.log(`${urls.length} URL(s) changed ${since ? `since ${since}` : "(all)"} on ${siteUrl}`);
  if (urls.length === 0) return;

  const keyFile = await fetch(`${siteUrl}/${INDEXNOW_KEY}.txt`);
  if (!keyFile.ok || (await keyFile.text()).trim() !== INDEXNOW_KEY) {
    throw new Error(`Key file ${siteUrl}/${INDEXNOW_KEY}.txt is not served — deploy first.`);
  }

  if (flag("--dry-run")) {
    for (const url of urls) console.log(`  ${url}`);
    return;
  }
  for (let i = 0; i < urls.length; i += BATCH) {
    const body = indexNowPayload(siteUrl, urls.slice(i, i + BATCH));
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    // 200 = accepted, 202 = accepted (key validation pending).
    if (res.status !== 200 && res.status !== 202) {
      throw new Error(`IndexNow: HTTP ${res.status} ${await res.text()}`);
    }
    console.log(`Submitted ${body.urlList.length} URL(s): HTTP ${res.status}`);
  }
  writeFileSync(stateFile, `${JSON.stringify({ date: new Date().toISOString().slice(0, 10) })}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
