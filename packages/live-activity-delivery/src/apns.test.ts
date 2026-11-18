import { generateKeyPairSync, verify } from "node:crypto";
import { EventEmitter } from "node:events";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type FakeResponse = {
  status?: number;
  headers?: Record<string, unknown>;
  chunks?: string[];
  error?: Error;
  timeout?: boolean;
};

class FakeRequest extends EventEmitter {
  body = "";
  encoding: string | null = null;
  timeoutCb: (() => void) | null = null;
  destroyedWith: Error | null = null;
  constructor(
    readonly headers: Record<string, unknown>,
    private readonly response: FakeResponse,
  ) {
    super();
  }
  setEncoding(encoding: string) {
    this.encoding = encoding;
  }
  setTimeout(_ms: number, cb: () => void) {
    this.timeoutCb = cb;
  }
  destroy(error: Error) {
    this.destroyedWith = error;
    this.emit("error", error);
  }
  end(body: string) {
    this.body = body;
    queueMicrotask(() => {
      if (this.response.timeout) {
        this.timeoutCb?.();
        return;
      }
      if (this.response.error) {
        this.emit("error", this.response.error);
        return;
      }
      this.emit("response", {
        ...(this.response.status != null ? { ":status": this.response.status } : {}),
        ...this.response.headers,
      });
      for (const chunk of this.response.chunks ?? []) this.emit("data", chunk);
      this.emit("end");
    });
  }
}

class FakeSession extends EventEmitter {
  closed = false;
  destroyed = false;
  requests: FakeRequest[] = [];
  unref = vi.fn();
  constructor(
    readonly host: string,
    private readonly responses: FakeResponse[],
  ) {
    super();
  }
  request(headers: Record<string, unknown>) {
    const req = new FakeRequest(headers, this.responses.shift() ?? { status: 200 });
    this.requests.push(req);
    return req;
  }
  close() {
    this.closed = true;
  }
}

const http2State = vi.hoisted(() => ({
  sessions: [] as unknown[],
  queue: [] as unknown[],
}));

vi.mock("node:http2", () => ({
  connect: vi.fn((host: string) => {
    const session = new FakeSession(host, http2State.queue as FakeResponse[]);
    http2State.sessions.push(session);
    return session;
  }),
}));

import { ApnsLiveActivityClient, parseApnsReason } from "./apns.js";

const { privateKey, publicKey } = generateKeyPairSync("ec", { namedCurve: "P-256" });
const PRIVATE_PEM = privateKey.export({ type: "pkcs8", format: "pem" }).toString();

const CREDS = {
  teamId: "TEAM123",
  keyId: "KEY456",
  privateKey: PRIVATE_PEM,
};

const sessions = () => http2State.sessions as FakeSession[];
const queue = (...responses: FakeResponse[]) => {
  http2State.queue.push(...responses);
};

const update = (overrides: Partial<Parameters<ApnsLiveActivityClient["sendUpdate"]>[0]> = {}) => ({
  token: "abc123",
  environment: "sandbox" as const,
  contentState: { phase: "markSalah" },
  expiresAt: new Date("2026-01-01T08:00:00Z"),
  ...overrides,
});

/** Queues APNs responses (default: one 200) and returns a client bound to them. */
function setup(
  responses: FakeResponse[] = [{ status: 200 }],
  credentials: Partial<typeof CREDS> & { bundleId?: string } = {},
) {
  queue(...responses);
  const client = new ApnsLiveActivityClient({ ...CREDS, ...credentials });
  const send = (overrides?: Parameters<typeof update>[0]) => client.sendUpdate(update(overrides));
  const requests = () => sessions().flatMap((session) => session.requests);
  const authorizations = () => requests().map((req) => req.headers.authorization);
  return { client, send, requests, authorizations };
}

const OK: FakeResponse = { status: 200 };

describe("parseApnsReason", () => {
  it("extracts the APNs reason string", () => {
    expect(parseApnsReason('{"reason":"BadDeviceToken"}')).toBe("BadDeviceToken");
  });

  it.each(["", "not-json", '{"reason":5}', "{}"])("returns Unknown for %j", (body) => {
    expect(parseApnsReason(body)).toBe("Unknown");
  });
});

describe("ApnsLiveActivityClient", () => {
  beforeEach(() => {
    http2State.sessions.length = 0;
    http2State.queue.length = 0;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("fromEnv", () => {
    it.each([
      [{}],
      [{ APNS_TEAM_ID: "t", APNS_KEY_ID: "k" }],
      [{ APNS_TEAM_ID: "t", APNS_PRIVATE_KEY: "p" }],
      [{ APNS_KEY_ID: "k", APNS_PRIVATE_KEY: "p" }],
    ])("is unconfigured for %j", (env) => {
      expect(ApnsLiveActivityClient.fromEnv(env).isConfigured()).toBe(false);
    });

    it("is configured when team, key and private key are set", () => {
      const env = {
        APNS_TEAM_ID: "t",
        APNS_KEY_ID: "k",
        APNS_PRIVATE_KEY: "p",
        APNS_BUNDLE_ID: "b",
      };
      expect(ApnsLiveActivityClient.fromEnv(env).isConfigured()).toBe(true);
    });
  });

  it("throws NOT_CONFIGURED when sending without credentials", async () => {
    await expect(new ApnsLiveActivityClient(null).sendUpdate(update())).rejects.toMatchObject({
      code: "NOT_CONFIGURED",
    });
  });

  it("posts a liveactivity update to the sandbox host", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-01-01T07:00:00Z"));
    const { send, requests } = setup([{ status: 200, headers: { "apns-id": "id-1" } }]);

    await expect(send({ staleAt: new Date("2026-01-01T07:30:00Z") })).resolves.toEqual({
      ok: true,
      apnsId: "id-1",
    });

    expect(sessions()[0]?.host).toBe("https://api.sandbox.push.apple.com");
    expect(sessions()[0]?.unref).toHaveBeenCalled();
    const [req] = requests();
    expect(req?.encoding).toBe("utf8");
    expect(req?.headers).toMatchObject({
      ":method": "POST",
      ":path": "/3/device/abc123",
      "apns-push-type": "liveactivity",
      "apns-topic": "app.munibtracker.push-type.liveactivity",
      "apns-priority": "10",
      "apns-expiration": String(Date.parse("2026-01-01T08:00:00Z") / 1000),
    });
    expect(JSON.parse(req?.body ?? "{}")).toEqual({
      aps: {
        timestamp: Date.parse("2026-01-01T07:00:00Z") / 1000,
        event: "update",
        "content-state": { phase: "markSalah" },
        "stale-date": Date.parse("2026-01-01T07:30:00Z") / 1000,
      },
    });
  });

  it("authorizes with an ES256 provider JWT signed by the team key", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-01-01T07:00:00Z"));
    const { send, authorizations } = setup();

    await send();

    const jwt = String(authorizations()[0]).replace("bearer ", "");
    const [header = "", payload = "", signature = ""] = jwt.split(".");
    const decode = (part: string) => JSON.parse(Buffer.from(part, "base64url").toString());
    expect(decode(header)).toEqual({ alg: "ES256", kid: "KEY456" });
    expect(decode(payload)).toEqual({
      iss: "TEAM123",
      iat: Date.parse("2026-01-01T07:00:00Z") / 1000,
    });
    expect(
      verify(
        "sha256",
        Buffer.from(`${header}.${payload}`),
        { key: publicKey, dsaEncoding: "ieee-p1363" },
        Buffer.from(signature, "base64url"),
      ),
    ).toBe(true);
  });

  it("uses a custom bundle id, escaped PEM newlines and the production host", async () => {
    const { send, requests } = setup([OK], {
      bundleId: "com.example",
      privateKey: PRIVATE_PEM.replace(/\n/g, "\\n"),
    });

    await expect(send({ environment: "production" })).resolves.toEqual({ ok: true });

    expect(sessions()[0]?.host).toBe("https://api.push.apple.com");
    expect(requests()[0]?.headers["apns-topic"]).toBe("com.example.push-type.liveactivity");
    expect(JSON.parse(requests()[0]?.body ?? "{}").aps["stale-date"]).toBeUndefined();
  });

  it("takes the first value of a repeated apns-id header", async () => {
    const { send } = setup([{ status: 200, headers: { "apns-id": ["first", "second"] } }]);

    await expect(send()).resolves.toEqual({ ok: true, apnsId: "first" });
  });

  it("reuses the session and the cached provider token", async () => {
    const { send, authorizations } = setup([OK, OK]);

    await send();
    await send();

    expect(sessions()).toHaveLength(1);
    const [first, second] = authorizations();
    expect(first).toBe(second);
  });

  it("mints a new provider token after the TTL", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const { send, authorizations } = setup([OK, OK]);

    await send();
    vi.setSystemTime(new Date("2026-01-01T01:00:00Z"));
    await send();

    const [first, second] = authorizations();
    expect(first).not.toBe(second);
  });

  it.each([
    ["closed", (session: FakeSession) => Object.assign(session, { closed: true })],
    ["destroyed", (session: FakeSession) => Object.assign(session, { destroyed: true })],
    ["errored", (session: FakeSession) => session.emit("error", new Error("GOAWAY"))],
    ["closed by the peer", (session: FakeSession) => session.emit("close")],
  ])("reconnects after the cached session is %s", async (_label, breakSession) => {
    const { send } = setup([OK, OK]);
    await send();
    const [first] = sessions();
    if (!first) throw new Error("no session");

    breakSession(first);
    await send();

    expect(sessions()).toHaveLength(2);
  });

  it("ignores close events from a session that was already replaced", async () => {
    const { send } = setup([OK, OK, OK]);
    await send();
    const [stale] = sessions();
    stale?.emit("error", new Error("GOAWAY"));
    await send();

    stale?.emit("close");
    await send();

    expect(sessions()).toHaveLength(2);
  });

  it("closes and forgets every session", async () => {
    const { client, send } = setup([OK, OK, OK]);
    await send();
    await send({ environment: "production" });

    client.close();
    await send();

    expect(
      sessions()
        .slice(0, 2)
        .every((session) => session.closed),
    ).toBe(true);
    expect(sessions()).toHaveLength(3);
  });

  it.each([
    [{ status: 410, chunks: ['{"reason":"Unregistered"}'] }, 410, "Unregistered", false, true],
    [
      { status: 400, chunks: ['{"reason":', '"BadDeviceToken"}'] },
      400,
      "BadDeviceToken",
      false,
      true,
    ],
    [
      { status: 400, chunks: ['{"reason":"DeviceTokenNotForTopic"}'] },
      400,
      "DeviceTokenNotForTopic",
      false,
      true,
    ],
    [
      { status: 429, chunks: ['{"reason":"TooManyRequests"}'] },
      429,
      "TooManyRequests",
      true,
      false,
    ],
    [{ status: 503, chunks: ["not-json"] }, 503, "Unknown", true, false],
    [
      { status: 400, chunks: ['{"reason":"PayloadTooLarge"}'] },
      400,
      "PayloadTooLarge",
      false,
      false,
    ],
    [{}, 0, "Unknown", false, false],
  ] satisfies Array<[FakeResponse, number, string, boolean, boolean]>)(
    "maps APNs response %j",
    async (response, status, reason, retryable, invalidateToken) => {
      const { send } = setup([response]);

      await expect(send()).resolves.toEqual({
        ok: false,
        status,
        reason,
        retryable,
        invalidateToken,
      });
    },
  );

  it.each([
    ["ExpiredProviderToken", true],
    ["InvalidProviderToken", false],
  ] as const)("reports %s with retryable=%s", async (reason, retryable) => {
    const { send } = setup([{ status: 403, chunks: [JSON.stringify({ reason })] }]);

    await expect(send()).resolves.toEqual({
      ok: false,
      status: 403,
      reason,
      retryable,
      invalidateToken: false,
    });
  });

  it.each(["ExpiredProviderToken", "InvalidProviderToken"])(
    "mints a fresh provider token after %s",
    async (reason) => {
      vi.useFakeTimers({ toFake: ["Date"] });
      vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
      const { send, authorizations } = setup([
        { status: 403, chunks: [JSON.stringify({ reason })] },
        OK,
      ]);

      await send();
      vi.setSystemTime(new Date("2026-01-01T00:00:05Z"));
      await send();

      const [rejected, retried] = authorizations();
      expect(retried).not.toBe(rejected);
    },
  );

  it("rejects on request errors", async () => {
    const { send } = setup([{ error: new Error("ECONNRESET") }]);

    await expect(send()).rejects.toThrow("ECONNRESET");
  });

  it("destroys the request on timeout", async () => {
    const { send, requests } = setup([{ timeout: true }]);

    await expect(send()).rejects.toThrow("APNs request timed out");
    expect(requests()[0]?.destroyedWith?.message).toBe("APNs request timed out");
  });
});
