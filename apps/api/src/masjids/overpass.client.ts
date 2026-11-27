import { Injectable } from "@nestjs/common";

/**
 * Thin Overpass API client (NF-3.11). Follows the public instances' usage
 * policy: one identifying, generic User-Agent (product + public site, no
 * personal data), a short server-side timeout, form-encoded POST, and only
 * coarse bounding boxes — never a user's precise coordinates.
 *
 * Public instances regularly answer 429/502/504 under load, so a transient
 * failure falls through to the next mirror (in order) within one overall
 * deadline. A 4xx other than 429 is a query problem and is not retried.
 */

export const DEFAULT_OVERPASS_URLS: readonly string[] = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];
export const OVERPASS_USER_AGENT =
  "MunibTrackerMasjidFinder/1.0 (+https://munibtracker.app; read-only cached proxy)";
/** Per-mirror cap. */
const REQUEST_TIMEOUT_MS = 20_000;
/** Whole query across every mirror (stays under serverless function limits). */
const TOTAL_DEADLINE_MS = 30_000;
/** Don't start another mirror with less time than this left. */
const MIN_ATTEMPT_MS = 3_000;

export class OverpassError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "OverpassError";
  }

  /** Busy / overloaded / unreachable — worth trying another mirror. */
  get transient(): boolean {
    return this.status === undefined || this.status === 429 || this.status >= 500;
  }
}

/**
 * Endpoints to try in order. `OVERPASS_URL` may hold one URL or a
 * comma-separated list (https only; anything else is ignored).
 */
export function overpassUrls(): string[] {
  const configured = (process.env.OVERPASS_URL ?? "")
    .split(",")
    .map((url) => url.trim())
    .filter((url) => /^https:\/\//.test(url));
  return configured.length > 0 ? [...new Set(configured)] : [...DEFAULT_OVERPASS_URLS];
}

@Injectable()
export class OverpassClient {
  async query(ql: string): Promise<unknown> {
    const deadline = Date.now() + TOTAL_DEADLINE_MS;
    const urls = overpassUrls();
    let lastError: OverpassError | null = null;
    let attempts = 0;
    for (const [index, url] of urls.entries()) {
      const remaining = deadline - Date.now();
      if (index > 0 && remaining < MIN_ATTEMPT_MS) break;
      attempts += 1;
      try {
        return await this.queryOne(url, ql, Math.min(REQUEST_TIMEOUT_MS, remaining));
      } catch (error) {
        const failure =
          error instanceof OverpassError ? error : new OverpassError("Overpass request failed");
        if (!failure.transient) throw failure;
        lastError = failure;
      }
    }
    const tried = urls.length > 1 ? ` (tried ${attempts} of ${urls.length} mirrors)` : "";
    throw new OverpassError(
      `${lastError?.message ?? "Overpass request failed"}${tried}`,
      lastError?.status,
    );
  }

  private async queryOne(url: string, ql: string, timeoutMs: number): Promise<unknown> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          "User-Agent": OVERPASS_USER_AGENT,
        },
        body: new URLSearchParams({ data: ql }).toString(),
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new OverpassError(`Overpass responded ${response.status}`, response.status);
      }
      // Overloaded instances sometimes answer 200 with an HTML/XML error page.
      try {
        return (await response.json()) as unknown;
      } catch {
        throw new OverpassError("Overpass returned a non-JSON body");
      }
    } catch (error) {
      if (error instanceof OverpassError) throw error;
      throw new OverpassError(
        controller.signal.aborted ? "Overpass request timed out" : "Overpass request failed",
      );
    } finally {
      clearTimeout(timer);
    }
  }
}
