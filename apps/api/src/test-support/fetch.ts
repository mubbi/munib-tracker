import { type Mock, vi } from "vitest";

/** A real WHATWG `Response` carrying a JSON body, as returned by `fetch`. */
export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/**
 * Replaces global `fetch` with a spy. Pair with `vi.unstubAllGlobals()` in
 * `afterEach` so the stub never leaks between files.
 */
export function stubFetch(
  impl: (url: string, init?: RequestInit) => Response | Promise<Response> = () => jsonResponse({}),
): Mock {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) =>
    impl(String(input), init),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
