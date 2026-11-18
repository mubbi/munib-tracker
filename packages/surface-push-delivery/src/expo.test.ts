import { afterEach, describe, expect, it, vi } from "vitest";
import { createExpoPushSender, isValidExpoPushToken } from "./expo.js";

const TOKEN = "ExponentPushToken[abc_123]";

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

/** Stubs `fetch` with one outcome and returns a sender bound to it. */
function setup(outcome: Response | Error | string = jsonResponse({ data: { status: "ok" } })) {
  const fetchMock =
    outcome instanceof Response
      ? vi.fn().mockResolvedValue(outcome)
      : vi.fn().mockRejectedValue(outcome);
  vi.stubGlobal("fetch", fetchMock);
  const send = (token = TOKEN, payload = JSON.stringify({ phase: "markSalah" })) =>
    createExpoPushSender().send(token, payload);
  return { fetchMock, send };
}

const ticketError = (ticket: Record<string, unknown>) =>
  jsonResponse({ data: { status: "error", ...ticket } });

describe("isValidExpoPushToken", () => {
  it.each([
    ["ExponentPushToken[abc_123]", true],
    ["ExpoPushToken[abc-123]", true],
    [" ExponentPushToken[abc] ", true],
    ["native-device-token", false],
  ])("%s -> %s", (token, valid) => {
    expect(isValidExpoPushToken(token)).toBe(valid);
  });
});

describe("Expo surface push", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends a silent high-priority data notification", async () => {
    const { fetchMock, send } = setup();

    await expect(send()).resolves.toEqual({ ok: true });

    const request = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string);
    expect(request.title).toBeUndefined();
    expect(request.priority).toBe("high");
    expect(request.data.type).toBe("salah_surface_phase");
  });

  it("rejects invalid tokens without calling fetch", async () => {
    const { fetchMock, send } = setup();

    await expect(send("bad-token")).resolves.toEqual({
      ok: false,
      reason: "Invalid Expo push token",
      retryable: false,
      invalidateToken: true,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects malformed payload JSON without calling fetch", async () => {
    const { fetchMock, send } = setup();

    await expect(send(TOKEN, "{not json")).resolves.toEqual({
      ok: false,
      reason: "Malformed Expo surface payload",
      retryable: false,
      invalidateToken: false,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([429, 503])("treats HTTP %i as transient", async (status) => {
    const { send } = setup(jsonResponse({}, status));

    await expect(send()).resolves.toEqual({
      ok: false,
      status,
      reason: `Transient Expo Push failure (${status})`,
      retryable: true,
      invalidateToken: false,
    });
  });

  it("treats other non-2xx statuses as permanent rejections", async () => {
    const { send } = setup(jsonResponse({}, 400));

    await expect(send()).resolves.toEqual({
      ok: false,
      status: 400,
      reason: "Expo Push rejected request (400)",
      retryable: false,
      invalidateToken: false,
    });
  });

  it.each([
    ["an array ticket", { data: [{ status: "ok" }] }],
    ["no ticket", {}],
  ])("succeeds with %s", async (_label, body) => {
    const { send } = setup(jsonResponse(body));

    await expect(send()).resolves.toEqual({ ok: true });
  });

  it.each([
    [
      "DeviceNotRegistered with message",
      { message: "Device not registered", details: { error: "DeviceNotRegistered" } },
      { reason: "Device not registered", retryable: false, invalidateToken: true },
    ],
    [
      "DeviceNotRegistered without message",
      { details: { error: "DeviceNotRegistered" } },
      { reason: "DeviceNotRegistered", retryable: false, invalidateToken: true },
    ],
    [
      "MessageRateExceeded",
      { message: "Slow down", details: { error: "MessageRateExceeded" } },
      { reason: "Slow down", retryable: true, invalidateToken: false },
    ],
    [
      "another error code",
      { details: { error: "MessageTooBig" } },
      { reason: "MessageTooBig", retryable: false, invalidateToken: false },
    ],
    [
      "no details",
      {},
      { reason: "Expo Push ticket failed", retryable: false, invalidateToken: false },
    ],
  ])("maps a %s ticket error", async (_label, ticket, expected) => {
    const { send } = setup(ticketError(ticket));

    await expect(send()).resolves.toEqual({ ok: false, ...expected });
  });

  it.each([
    [new Error("ECONNRESET"), "ECONNRESET"],
    ["boom", "Expo Push network error"],
  ])("returns a retryable failure when fetch rejects with %s", async (error, reason) => {
    const { send } = setup(error);

    await expect(send()).resolves.toEqual({
      ok: false,
      reason,
      retryable: true,
      invalidateToken: false,
    });
  });
});
