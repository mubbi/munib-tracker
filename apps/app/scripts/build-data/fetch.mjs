// Cached HTTP GET helper for the data build pipeline.
//
// Every URL is fetched at most once and its raw body is stored under
// `.cache/` (gitignored). Re-runs read from the cache, so the pipeline is
// idempotent and offline-repeatable after a first successful run. Uses the
// global `fetch` available in Node >= 18.

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const CACHE_DIR = join(HERE, ".cache");

function cachePathFor(url) {
  const hash = createHash("sha256").update(url).digest("hex").slice(0, 40);
  return join(CACHE_DIR, `${hash}.body`);
}

/** Fetch a URL as text, using the on-disk cache when present. */
export async function fetchText(url) {
  const cachePath = cachePathFor(url);
  try {
    return await readFile(cachePath, "utf8");
  } catch {
    // cache miss → fetch below
  }

  const res = await fetch(url, { headers: { "user-agent": "munib-tracker-build" } });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  const body = await res.text();
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(cachePath, body, "utf8");
  return body;
}

/** Fetch a URL and parse it as JSON (cached). */
export async function fetchJSON(url) {
  return JSON.parse(await fetchText(url));
}

/**
 * Try each URL in order, returning the first that succeeds. Used to fall back
 * to an alternate mirror when a primary source is unreachable.
 */
export async function fetchJSONWithFallback(urls) {
  let lastErr;
  for (const url of urls) {
    try {
      return { url, data: await fetchJSON(url) };
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr ?? new Error("no urls provided");
}
