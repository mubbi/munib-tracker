import { afterEach, describe, expect, it, vi } from "vitest";
import { createExpoPushSender, isValidExpoPushToken } from "./expo.js";

describe("Expo surface push", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("validates Expo push tokens", () => {
    expect(isValidExpoPushToken("ExponentPushToken[abc_123]")).toBe(true);
    expect(isValidExpoPushToken("ExpoPushToken[abc-123]")).toBe(true);
    expect(isValidExpoPushToken("native-device-token")).toBe(false);
  });

  it("sends a silent high-priority data notification", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: { status: "ok", id: "ticket" } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const sender = createExpoPushSender();
    const result = await sender.send(
      "ExponentPushToken[abc_123]",
      JSON.stringify({ phase: "markSalah" }),
    );

    expect(result).toEqual({ ok: true });
    const request = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string);
    expect(request.title).toBeUndefined();
    expect(request.priority).toBe("high");
    expect(request.data.type).toBe("salah_surface_phase");
  });

  it("invalidates DeviceNotRegistered tickets", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            data: {
              status: "error",
              message: "Device not registered",
              details: { error: "DeviceNotRegistered" },
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    const result = await createExpoPushSender().send(
      "ExponentPushToken[abc_123]",
      JSON.stringify({ phase: "afterSalah" }),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.invalidateToken).toBe(true);
  });
});
