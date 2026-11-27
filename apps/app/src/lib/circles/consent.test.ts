import { makeChildProfile } from "@/test-support/circles";

import { consentDaysLeft, pendingConsentChildren } from "./consent";

describe("D34 re-consent", () => {
  it("lists only transferred profiles waiting for consent", () => {
    const pending = makeChildProfile({ id: "a", consentPending: true });
    const ok = makeChildProfile({ id: "b", consentPending: false });
    expect(pendingConsentChildren([pending, ok, makeChildProfile({ id: "c" })])).toEqual([pending]);
    expect(pendingConsentChildren(undefined)).toEqual([]);
  });

  it("counts whole days left before deletion, never negative", () => {
    const now = new Date("2026-11-24T12:00:00.000Z");
    const child = makeChildProfile({ consentPendingUntil: "2026-12-04T12:00:00.000Z" });
    expect(consentDaysLeft(child, now)).toBe(10);
    expect(
      consentDaysLeft(makeChildProfile({ consentPendingUntil: "2026-11-01T00:00:00.000Z" }), now),
    ).toBe(0);
    expect(consentDaysLeft(makeChildProfile(), now)).toBeNull();
  });
});
