/**
 * Jest network guard for `apps/app` — loaded by `jest.setup.ts` for every suite.
 *
 * No test may reach a real API, CDN or service. Every egress path is closed:
 *
 * - `global.fetch` defaults to a `jest.fn` that **rejects** with a
 *   `NetworkBlockedError` naming the URL (Expo's lazy `fetch` getter is replaced
 *   too, which also keeps it from throwing after a suite tears down).
 * - `WebSocket` / `XMLHttpRequest` / `EventSource` constructors throw.
 * - Node's `net.Socket#connect` (under `http`, `https`, `tls`, `http2`, undici)
 *   throws for any non-loopback host — covers scripts and Node-only helpers.
 *
 * Every blocked attempt is also recorded, and the `afterEach` installed by
 * `installNoNetworkGuard()` fails the test that made it — even when product code
 * swallowed the rejection (best-effort syncs, prefetches). Mock the boundary
 * instead: `mockFetch` / `mockFetchByUrl` (`@/test-support/fetch`), the
 * `api-client` mock (`@/test-support/mocks/api-client`), or `jest.mock` the
 * loader module.
 *
 * Escape hatch for opt-in, local-only evals: `TEST_ALLOW_NETWORK=1`.
 */
import net from "node:net";

export class NetworkBlockedError extends Error {
  constructor(targets: string, attempted = false) {
    super(
      `[no-network] ${attempted ? "This test attempted" : "Blocked"} a real network call to ${targets}. ` +
        "Mock it (mockFetch / mockFetchByUrl from @/test-support/fetch, the api-client mock, or jest.mock the loader) — tests must never reach a real API or service.",
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

type GuardState = { violations: string[]; firstStack?: string };

/** One list per worker: patched builtins outlive a suite's module registry. */
function guardState(): GuardState {
  const host = process as unknown as { [GUARD]?: GuardState };
  host[GUARD] ??= { violations: [] };
  return host[GUARD];
}

function isLoopbackHost(host: string | undefined | null): boolean {
  if (host == null || host === "") return true;
  const h = host.toLowerCase().replace(/^\[|\]$/g, "");
  return (
    h === "localhost" ||
    h.endsWith(".localhost") ||
    h === "::1" ||
    h === "0.0.0.0" ||
    /^127(\.\d{1,3}){3}$/.test(h)
  );
}

function describeTarget(input: unknown): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  if (input && typeof input === "object" && "url" in input) return String(input.url);
  return String(input);
}

/** Records the attempt and returns the error to throw / reject with. */
export function blockNetwork(target: string): NetworkBlockedError {
  const state = guardState();
  state.violations.push(target);
  const error = new NetworkBlockedError(target);
  // Keep the app frames of the first attempt: swallowed calls are otherwise
  // hard to trace back to the product code that made them.
  state.firstStack ??= (error.stack ?? "")
    .split("\n")
    .filter((line) => /[\\/]src[\\/]/.test(line) && !line.includes("no-network"))
    .slice(0, 8)
    // Not "at …": Jest strips stack-shaped lines out of failure messages.
    .map((line) => `  <- ${line.trim().replace(/^at /, "")}`)
    .join("\n");
  return error;
}

/** The default `global.fetch`: rejects every call. Reinstalled per suite. */
export function createBlockedFetch(): jest.Mock {
  return jest.fn((input: unknown) =>
    Promise.reject(blockNetwork(`fetch ${describeTarget(input).split("?")[0]}`)),
  );
}

function blockedConstructor(name: string) {
  return class Blocked {
    constructor(url?: unknown) {
      throw blockNetwork(`${name} ${describeTarget(url)}`);
    }
  };
}

function patchNodeSockets() {
  const proto = net.Socket.prototype as net.Socket & { [GUARD]?: boolean };
  if (proto[GUARD]) return;
  const realConnect = proto.connect;
  proto.connect = function guardedConnect(this: net.Socket, ...args: unknown[]) {
    const first = Array.isArray(args[0]) ? args[0][0] : args[0];
    let host: string | undefined;
    let path: string | undefined;
    let port: unknown;
    if (first && typeof first === "object") {
      ({ host, path, port } = first as { host?: string; path?: string; port?: unknown });
    } else if (typeof first === "string" && !/^\d+$/.test(first)) {
      path = first;
    } else {
      port = first;
      host = typeof args[1] === "string" ? args[1] : undefined;
    }
    if (!path && (!isLoopbackHost(host) || LOCAL_SERVICE_PORTS.has(Number(port)))) {
      throw blockNetwork(`${host ?? "localhost"}:${String(port)}`);
    }
    return (realConnect as (...a: unknown[]) => net.Socket).apply(this, args);
  } as typeof proto.connect;
  proto[GUARD] = true;
}

/**
 * Installs the guard for the current suite. Called once from `jest.setup.ts`;
 * tests never call it themselves.
 */
export function installNoNetworkGuard(): void {
  if (process.env.TEST_ALLOW_NETWORK === "1") return;

  patchNodeSockets();

  const define = (name: string, value: unknown) =>
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  define("fetch", createBlockedFetch());
  define("WebSocket", blockedConstructor("WebSocket"));
  define("XMLHttpRequest", blockedConstructor("XMLHttpRequest"));
  define("EventSource", blockedConstructor("EventSource"));

  const state = guardState();
  // A previous suite's straggling background work must not fail this one.
  state.violations.length = 0;
  state.firstStack = undefined;

  afterEach(() => {
    if (state.violations.length === 0) return;
    const seen = [...new Set(state.violations)];
    const stack = state.firstStack;
    state.violations.length = 0;
    state.firstStack = undefined;
    const error = new NetworkBlockedError(seen.join(", "), true);
    if (stack)
      error.message += `
First attempt from:
${stack}`;
    throw error;
  });
}
