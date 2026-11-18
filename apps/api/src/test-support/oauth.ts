import type { ConfigService } from "@nestjs/config";
import type { Mock } from "vitest";
import type { EnvironmentVariables } from "../config/env.schema";
import { jsonResponse, stubFetch } from "./fetch";

/** ConfigService double backed by a plain env map (OAuth / redirect allowlist specs). */
export function buildConfig(
  env: Partial<EnvironmentVariables> = {},
): ConfigService<EnvironmentVariables, true> {
  return {
    get: (key: keyof EnvironmentVariables) => env[key],
  } as unknown as ConfigService<EnvironmentVariables, true>;
}

/**
 * Stubs global `fetch` so each request is answered by the first route whose key
 * is a substring of the URL: a `Response` (cloned per call) or a JSON body
 * (200). Unrouted URLs get a 404. Pair with `vi.unstubAllGlobals()`.
 */
export function stubFetchRoutes(routes: Record<string, Response | object>): Mock {
  return stubFetch((url) => {
    const match = Object.keys(routes).find((fragment) => url.includes(fragment));
    if (match === undefined) return jsonResponse({ error: `unrouted ${url}` }, 404);
    const route = routes[match];
    return route instanceof Response ? route.clone() : jsonResponse(route);
  });
}
