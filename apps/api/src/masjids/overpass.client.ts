import { Injectable } from "@nestjs/common";

/**
 * Thin Overpass API client (NF-3.11). Follows the public instances' usage
 * policy: one identifying, generic User-Agent (product + public site, no
 * personal data), a short server-side timeout, form-encoded POST, and only
 * coarse bounding boxes — never a user's precise coordinates.
 */

export const DEFAULT_OVERPASS_URL = "https://overpass-api.de/api/interpreter";
export const OVERPASS_USER_AGENT =
  "MunibTrackerMasjidFinder/1.0 (+https://munibtracker.app; read-only cached proxy)";
const REQUEST_TIMEOUT_MS = 25_000;

export class OverpassError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "OverpassError";
  }
}

export function overpassUrl(): string {
  const configured = process.env.OVERPASS_URL?.trim();
  return configured && /^https:\/\//.test(configured) ? configured : DEFAULT_OVERPASS_URL;
}

@Injectable()
export class OverpassClient {
  async query(ql: string): Promise<unknown> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(overpassUrl(), {
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
      return (await response.json()) as unknown;
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
