/**
 * Vitest setup file: tests never reach a real network or remote service.
 *
 * Wired into every Vitest config via `setupFiles: [NO_NETWORK_SETUP]`
 * (`@munib-tracker/vitest-config/ci`). It closes every egress path a Node or
 * jsdom test can take:
 *
 * - `net.Socket#connect` — the chokepoint under `http`, `https`, `http2`, `tls`,
 *   `undici` / global `fetch`, database and Redis drivers, `web-push`, APNs …
 * - global `fetch`, `WebSocket`, `EventSource` and jsdom's `XMLHttpRequest`, so
 *   the failure names the URL instead of surfacing as a generic "fetch failed".
 *
 * Only loopback hosts are allowed (supertest / in-process Nest servers in the
 * API e2e suite listen on an ephemeral localhost port; SQLite is in-memory).
 * Every blocked attempt throws a `NetworkBlockedError` *and* is recorded; the
 * `afterEach` hook below fails the test even when product code swallowed the
 * error (e.g. a best-effort push send inside `try/catch`).
 *
 * Mock instead: `vi.stubGlobal("fetch", vi.fn(...))`, `vi.spyOn(globalThis,
 * "fetch")`, or `vi.mock()` the client module. Those replace the guarded global,
 * so a mocked test never sees the guard.
 *
 * Escape hatch for opt-in, local-only evals: `TEST_ALLOW_NETWORK=1`.
 */
import net from "node:net";
import { afterEach } from "vitest";

export class NetworkBlockedError extends Error {
  constructor(targets: string, attempted = false, cause?: Error) {
    super(
      `[no-network] ${attempted ? "This test attempted" : "Blocked"} a real network call to ${targets}. ` +
        "Mock it (vi.stubGlobal('fetch', …) / vi.mock the client) — tests must never reach a real API or service.",
      cause ? { cause } : undefined,
    );
    this.name = "NetworkBlockedError";
  }
}

const GUARD = Symbol.for("munib-tracker.no-network");

/**
 * Loopback is allowed for in-process test servers (supertest), but not for a
 * developer's locally running Postgres / Redis / MySQL / Mongo / Memcached:
 * those are real services too — tests use in-memory SQLite and mocks.
 */
const LOCAL_SERVICE_PORTS = new Set([5432, 6379, 6380, 3306, 27017, 11211]);

type GuardState = { violations: string[]; first?: Error };

/** Loopback only: in-process test servers, never a remote host. */
export function isLoopbackHost(host: string | undefined | null): boolean {
  if (host == null || host === "") return true; // net defaults to localhost
  const h = host.toLowerCase().replace(/^\[|\]$/g, "");
  return (
    h === "localhost" ||
    h.endsWith(".localhost") ||
    h === "::1" ||
    h === "::" ||
    h === "0.0.0.0" ||
    h === "::ffff:127.0.0.1" ||
    /^127(\.\d{1,3}){3}$/.test(h)
  );
}

function hostOfUrl(input: unknown): { host: string; label: string } | null {
  let raw: string;
  if (typeof input === "string") raw = input;
  else if (input instanceof URL) raw = input.href;
  else if (input && typeof input === "object" && "url" in input) raw = String(input.url);
  else raw = String(input);
  try {
    const base = (globalThis as { location?: { href?: string } }).location?.href;
    const url = base ? new URL(raw, base) : new URL(raw);
    if (url.protocol === "data:" || url.protocol === "blob:" || url.protocol === "file:") {
      return null;
    }
    return { host: url.hostname, label: url.origin + url.pathname };
  } catch {
    // Relative URL without a base: not a network target we can resolve.
    return null;
  }
}

function socketTarget(args: unknown[]): { host?: string; path?: string; port?: unknown } {
  // Node normalizes internal calls to `connect([options, cb])`.
  const first = Array.isArray(args[0]) ? args[0][0] : args[0];
  if (first && typeof first === "object") {
    const o = first as { host?: string; path?: string; port?: unknown };
    return { host: o.host, path: o.path, port: o.port };
  }
  if (typeof first === "string" && !/^\d+$/.test(first)) return { path: first };
  return { port: first, host: typeof args[1] === "string" ? args[1] : undefined };
}

function install(state: GuardState) {
  const block = (target: string) => {
    state.violations.push(target);
    const error = new NetworkBlockedError(target);
    state.first ??= error; // reported as the cause: its stack names the caller
    return error;
  };

  const proto = net.Socket.prototype as net.Socket & { [GUARD]?: boolean };
  if (!proto[GUARD]) {
    const realConnect = proto.connect;
    proto.connect = function guardedConnect(this: net.Socket, ...args: unknown[]) {
      const { host, path, port } = socketTarget(args);
      if (!path && (!isLoopbackHost(host) || LOCAL_SERVICE_PORTS.has(Number(port)))) {
        throw block(`${host ?? "localhost"}:${String(port)}`);
      }
      return (realConnect as (...a: unknown[]) => net.Socket).apply(this, args);
    } as typeof proto.connect;
    proto[GUARD] = true;
  }

  const g = globalThis as Record<string, unknown>;

  const realFetch = g.fetch as ((...a: unknown[]) => Promise<unknown>) | undefined;
  if (realFetch && !(realFetch as { [GUARD]?: boolean })[GUARD]) {
    const guardedFetch = (input: unknown, init?: unknown) => {
      const target = hostOfUrl(input);
      if (target && !isLoopbackHost(target.host)) {
        return Promise.reject(block(`fetch ${target.label}`));
      }
      return realFetch(input, init);
    };
    Object.assign(guardedFetch, { [GUARD]: true });
    g.fetch = guardedFetch;
  }

  for (const name of ["WebSocket", "EventSource"] as const) {
    const Real = g[name] as (new (...a: unknown[]) => object) | undefined;
    if (!Real || (Real as { [GUARD]?: boolean })[GUARD]) continue;
    const Guarded = class extends Real {
      static readonly [GUARD] = true;
      constructor(...args: unknown[]) {
        const target = hostOfUrl(args[0]);
        if (target && !isLoopbackHost(target.host)) throw block(`${name} ${target.label}`);
        super(...args);
      }
    };
    g[name] = Guarded;
  }

  const Xhr = g.XMLHttpRequest as { prototype: { open: (...a: unknown[]) => void } } | undefined;
  const xhrProto = Xhr?.prototype as
    | ({ open: (...a: unknown[]) => void } & { [GUARD]?: boolean })
    | undefined;
  if (xhrProto && !xhrProto[GUARD]) {
    const realOpen = xhrProto.open;
    xhrProto.open = function guardedOpen(this: unknown, ...args: unknown[]) {
      const target = hostOfUrl(args[1]);
      if (target && !isLoopbackHost(target.host)) {
        throw block(`XMLHttpRequest ${target.label}`);
      }
      return realOpen.apply(this, args);
    };
    xhrProto[GUARD] = true;
  }
}

if (process.env.TEST_ALLOW_NETWORK !== "1") {
  // One state per worker process: the patched builtins outlive a test file's
  // module graph, so the next file must read the same violation list.
  const host = process as unknown as { [GUARD]?: GuardState };
  host[GUARD] ??= { violations: [] };
  const state = host[GUARD];
  install(state);

  afterEach(() => {
    if (state.violations.length === 0) return;
    const seen = [...new Set(state.violations)];
    const cause = state.first;
    state.violations.length = 0;
    state.first = undefined;
    throw new NetworkBlockedError(seen.join(", "), true, cause);
  });
}
