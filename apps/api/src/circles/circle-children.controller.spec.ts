import { describe, expect, it, vi } from "vitest";
import { buildRequest } from "../test-support/http";
import type { ChildProfilesService } from "./child-profiles.service";
import { CircleChildSessionController } from "./circle-children.controller";

function setup() {
  const children = { redeemDeviceLink: vi.fn().mockResolvedValue({ token: "s" }) };
  const controller = new CircleChildSessionController(children as unknown as ChildProfilesService);
  return { controller, children };
}

describe("CircleChildSessionController.redeem", () => {
  it("rate-limits by the nearest proxy hop, ignoring a spoofed first X-Forwarded-For value", async () => {
    const { controller, children } = setup();
    for (const spoof of ["203.0.113.1", "203.0.113.2"]) {
      await controller.redeem(
        buildRequest({ headers: { "x-forwarded-for": `${spoof}, 10.0.0.7` } }),
        { linkToken: "link" },
      );
    }
    expect(children.redeemDeviceLink.mock.calls).toEqual([
      ["link", "10.0.0.7"],
      ["link", "10.0.0.7"],
    ]);
  });

  it("falls back to the socket address on a direct connection", async () => {
    const { controller, children } = setup();
    await controller.redeem(buildRequest({ ip: "192.0.2.4" }), { linkToken: "link" });
    expect(children.redeemDeviceLink).toHaveBeenCalledWith("link", "192.0.2.4");
  });
});
