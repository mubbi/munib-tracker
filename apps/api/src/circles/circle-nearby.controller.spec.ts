import { UnauthorizedException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { buildRequest, TEST_ACCESS_TOKEN, TEST_BEARER } from "../test-support/http";
import type { CircleActorService } from "./circle-auth";
import { CircleNearbyJoinController } from "./circle-nearby.controller";
import type { CircleNearbyService } from "./circle-nearby.service";

const USER = { kind: "user" as const, userId: "u-1", accountType: "user" as const };
const SESSION = "0123456789abcdef";
const BODY = { matchCode: "0472" };

function setup(resolve: CircleActorService["resolve"] = vi.fn().mockResolvedValue(USER)) {
  const nearby = {
    preview: vi.fn().mockResolvedValue({}),
    createRequest: vi.fn().mockResolvedValue({}),
  };
  const actors = { resolve };
  const controller = new CircleNearbyJoinController(
    nearby as unknown as CircleNearbyService,
    actors as unknown as CircleActorService,
  );
  return { controller, nearby, actors };
}

describe("CircleNearbyJoinController", () => {
  it("keys the preview limit on the nearest proxy hop, not a spoofed first X-Forwarded-For", async () => {
    const { controller, nearby } = setup();
    await controller.preview(
      buildRequest({ headers: { "x-forwarded-for": "203.0.113.9, 10.0.0.7" } }),
      SESSION,
    );
    expect(nearby.preview).toHaveBeenCalledWith(SESSION, "10.0.0.7");
  });

  it("passes the account behind a bearer to the request", async () => {
    const { controller, nearby, actors } = setup();
    await controller.request(
      buildRequest({ headers: { authorization: TEST_BEARER }, ip: "192.0.2.4" }),
      SESSION,
      BODY,
    );
    expect(actors.resolve).toHaveBeenCalledWith(TEST_ACCESS_TOKEN, false);
    expect(nearby.createRequest).toHaveBeenCalledWith(USER, SESSION, BODY, "192.0.2.4");
  });

  it.each([
    ["no session at all", {}],
    ["a child-session bearer (re-linking a child device)", { authorization: "Bearer mtc_abc" }],
  ])("asks anonymously with %s", async (_label, headers) => {
    const { controller, nearby, actors } = setup();
    await controller.request(buildRequest({ headers, ip: "192.0.2.4" }), SESSION, BODY);
    expect(actors.resolve).not.toHaveBeenCalled();
    expect(nearby.createRequest).toHaveBeenCalledWith(undefined, SESSION, BODY, "192.0.2.4");
  });

  it("treats an expired account token as no account (the service answers 401 where one is needed)", async () => {
    const { controller, nearby } = setup(
      vi.fn().mockRejectedValue(new UnauthorizedException("expired")),
    );
    await controller.request(
      buildRequest({ headers: { authorization: TEST_BEARER }, ip: "192.0.2.4" }),
      SESSION,
      BODY,
    );
    expect(nearby.createRequest).toHaveBeenCalledWith(undefined, SESSION, BODY, "192.0.2.4");
  });
});
