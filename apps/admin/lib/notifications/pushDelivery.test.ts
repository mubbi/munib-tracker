import { OFFICIAL_SUPPORT_EMAIL } from "@munib-tracker/shared";
import { describe, expect, it } from "vitest";
import { resolveVapidSubject } from "./pushDelivery";

describe("resolveVapidSubject", () => {
  it("uses VAPID_SUBJECT when set", () => {
    expect(resolveVapidSubject("  https://munibtracker.app ")).toBe("https://munibtracker.app");
  });

  it("falls back to the official support email", () => {
    expect(resolveVapidSubject(undefined)).toBe(`mailto:${OFFICIAL_SUPPORT_EMAIL}`);
    expect(resolveVapidSubject("   ")).toBe(`mailto:${OFFICIAL_SUPPORT_EMAIL}`);
  });
});
