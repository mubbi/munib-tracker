import { beforeEach, describe, expect, it, vi } from "vitest";

const webPushMock = vi.hoisted(() => ({
  sendNotification: vi.fn(),
  setVapidDetails: vi.fn(),
}));

vi.mock("web-push", () => webPushMock);

import {
  buildExpoVisibleMessage,
  buildWebVisiblePayload,
  createExpoVisiblePushSender,
  createWebVisiblePushSender,
  EXPO_PUSH_BATCH_SIZE,
  type VisibleNotification,
} from "./visible.js";

const NOTE: VisibleNotification = {
  title: "Group khatm",
  body: "A part of your group khatm was completed.",
  tag: "circle:khatm:k1",
  data: { type: "circle", event: "khatm_part_done", route: "/khatm-groups/c1" },
  ttlSeconds: 600,
};
const TOKEN = "ExponentPushToken[abc]";
const SUB = JSON.stringify({
  endpoint: "https://fcm.googleapis.com/fcm/send/x",
  keys: { p256dh: "p", auth: "a" },
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

describe("visible Expo push", () => {
  it("builds a visible (not silent) message on the default channel", () => {
    const message = buildExpoVisibleMessage(TOKEN, NOTE);
    expect(message).toMatchObject({
      to: TOKEN,
      title: NOTE.title,
      body: NOTE.body,
      data: NOTE.data,
      channelId: "default",
      sound: "default",
      ttl: 600,
    });
    expect(message).not.toHaveProperty("_contentAvailable");
  });

  it("batches messages and maps tickets back in order", async () => {
    const fetchImpl = vi.fn(async (_url: unknown, init?: RequestInit) => {
      const sent = JSON.parse(String(init?.body)) as unknown[];
      return jsonResponse({
        data: sent.map((_, i) =>
          i === 1
            ? { status: "error", details: { error: "DeviceNotRegistered" } }
            : { status: "ok" },
        ),
      });
    });
    const sender = createExpoVisiblePushSender(fetchImpl as unknown as typeof fetch);
    const items = Array.from({ length: EXPO_PUSH_BATCH_SIZE + 2 }, () => ({
      target: TOKEN,
      notification: NOTE,
    }));
    items.splice(3, 0, { target: "not-a-token", notification: NOTE });
    const results = await sender.sendMany(items);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(results).toHaveLength(items.length);
    expect(results[0]).toEqual({ ok: true });
    expect(results[1]).toMatchObject({ ok: false, invalidateToken: true });
    expect(results[3]).toMatchObject({ ok: false, invalidateToken: true });
  });

  it("marks a whole chunk retryable on 5xx / network errors", async () => {
    const sender = createExpoVisiblePushSender(
      vi.fn(async () => jsonResponse({}, 503)) as unknown as typeof fetch,
    );
    expect(await sender.sendMany([{ target: TOKEN, notification: NOTE }])).toEqual([
      expect.objectContaining({ ok: false, retryable: true, status: 503 }),
    ]);
    const offline = createExpoVisiblePushSender(
      vi.fn(async () => {
        throw new Error("offline");
      }) as unknown as typeof fetch,
    );
    expect(await offline.sendMany([{ target: TOKEN, notification: NOTE }])).toEqual([
      expect.objectContaining({ ok: false, retryable: true }),
    ]);
  });
});

describe("visible Web Push", () => {
  beforeEach(() => {
    webPushMock.sendNotification.mockReset();
  });

  it("sends the service-worker payload with the tag and route data", async () => {
    webPushMock.sendNotification.mockResolvedValue({});
    const sender = createWebVisiblePushSender({
      publicKey: "pub",
      privateKey: "priv",
      subject: "mailto:ops@example.com",
    });
    const results = await sender.sendMany([
      { target: SUB, notification: NOTE },
      { target: "{bad", notification: NOTE },
    ]);
    expect(results[0]).toEqual({ ok: true });
    expect(results[1]).toMatchObject({ ok: false, invalidateToken: true });
    const [, payload, options] = webPushMock.sendNotification.mock.calls[0] ?? [];
    expect(JSON.parse(String(payload))).toMatchObject({
      title: NOTE.title,
      body: NOTE.body,
      tag: NOTE.tag,
      data: NOTE.data,
    });
    expect(options).toMatchObject({ TTL: 600 });
  });

  it("invalidates gone subscriptions", async () => {
    webPushMock.sendNotification.mockRejectedValue({ statusCode: 410 });
    const sender = createWebVisiblePushSender({ publicKey: "p", privateKey: "k", subject: "s" });
    expect(await sender.sendMany([{ target: SUB, notification: NOTE }])).toEqual([
      expect.objectContaining({ ok: false, invalidateToken: true, status: 410 }),
    ]);
  });

  it("payload JSON carries only the given fields", () => {
    expect(Object.keys(JSON.parse(buildWebVisiblePayload(NOTE, 1))).sort()).toEqual([
      "body",
      "data",
      "tag",
      "timestamp",
      "title",
    ]);
  });
});
