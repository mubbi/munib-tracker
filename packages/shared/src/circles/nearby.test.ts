import { describe, expect, expectTypeOf, it } from "vitest";
import type { CircleRole, CircleType } from "./index";
import {
  canOfferNearby,
  isValidNearbyMatchCode,
  isValidNearbySessionId,
  NEARBY_JOINER_STATUSES,
  NEARBY_LIMITS,
  NEARBY_SERVICE_UUID_MASK,
  NEARBY_SERVICE_UUID_PREFIX,
  nearbyNeedsLinkedAccount,
  nearbyRolesFor,
  nearbyServiceUuid,
  nearbySessionIdFromUuid,
  spellMatchCode,
} from "./nearby";

const SESSION = "0123456789abcdef";

describe("nearby service UUID (D41 beacon payload)", () => {
  it("embeds the 8-byte session id after the fixed app prefix", () => {
    const uuid = nearbyServiceUuid(SESSION);
    expect(uuid).toBe("9a3c5e71-2b84-4f06-0123-456789abcdef");
    expect(uuid.startsWith(NEARBY_SERVICE_UUID_PREFIX)).toBe(true);
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it("round-trips, case-insensitively (CoreBluetooth reports upper case)", () => {
    expect(nearbySessionIdFromUuid(nearbyServiceUuid(SESSION).toUpperCase())).toBe(SESSION);
    expect(nearbySessionIdFromUuid(` ${nearbyServiceUuid(SESSION)} `)).toBe(SESSION);
  });

  it("ignores every other service UUID", () => {
    expect(nearbySessionIdFromUuid("0000180f-0000-1000-8000-00805f9b34fb")).toBeNull();
    expect(nearbySessionIdFromUuid("9a3c5e71-2b84-4f07-0123-456789abcdef")).toBeNull();
    expect(nearbySessionIdFromUuid("not-a-uuid")).toBeNull();
  });

  it("rejects malformed session ids", () => {
    expect(() => nearbyServiceUuid("XYZ")).toThrow();
    expect(isValidNearbySessionId(SESSION)).toBe(true);
    expect(isValidNearbySessionId("0123456789ABCDEF")).toBe(false);
    expect(isValidNearbySessionId("0123456789abcde")).toBe(false);
  });

  it("masks exactly the prefix bytes for Android scan filters", () => {
    const masked = NEARBY_SERVICE_UUID_MASK.replace(/-/g, "");
    expect(masked).toBe(`${"f".repeat(16)}${"0".repeat(16)}`);
  });
});

describe("match code (D44)", () => {
  it("accepts exactly four digits", () => {
    expect(isValidNearbyMatchCode("0472")).toBe(true);
    expect(isValidNearbyMatchCode("472")).toBe(false);
    expect(isValidNearbyMatchCode("04a2")).toBe(false);
  });

  it("spells the code for screen readers", () => {
    expect(spellMatchCode("0472")).toBe("0 4 7 2");
  });
});

describe("scope (D43)", () => {
  it("uses the same circle type / role unions as the main circles module", () => {
    expectTypeOf<Parameters<typeof nearbyRolesFor>[0]>().toEqualTypeOf<CircleType>();
    expectTypeOf<ReturnType<typeof nearbyRolesFor>[number]>().toEqualTypeOf<CircleRole>();
  });

  it("offers member + parent (family), member (partner, khatm), never khatm admin", () => {
    expect(nearbyRolesFor("family")).toEqual(["parent", "member"]);
    expect(nearbyRolesFor("partner")).toEqual(["member"]);
    expect(nearbyRolesFor("khatm_group")).toEqual(["member"]);
    expect(canOfferNearby("khatm_group", "admin")).toBe(false);
    expect(canOfferNearby("partner", "parent")).toBe(false);
  });

  it("lets guests ask only for khatm groups and child-device links", () => {
    expect(nearbyNeedsLinkedAccount("khatm_group", "member")).toBe(false);
    expect(nearbyNeedsLinkedAccount("family", "member")).toBe(true);
    expect(nearbyNeedsLinkedAccount("partner", "member")).toBe(true);
    expect(nearbyNeedsLinkedAccount("family", "child_link")).toBe(false);
  });

  it("reports expiry to joiners on top of the stored states", () => {
    expect(NEARBY_JOINER_STATUSES).toContain("expired");
    expect(NEARBY_LIMITS.sessionTtlMinutes).toBe(10);
  });
});
