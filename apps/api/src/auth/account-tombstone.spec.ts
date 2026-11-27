import { describe, expect, it } from "vitest";
import { buildTombstoneEmail, isTombstoneValue } from "./account-tombstone";

describe("isTombstoneValue", () => {
  it("is false for empty values", () => {
    expect(isTombstoneValue(null)).toBe(false);
    expect(isTombstoneValue(undefined)).toBe(false);
    expect(isTombstoneValue("")).toBe(false);
  });

  it("is false for real emails and look-alikes", () => {
    expect(isTombstoneValue("user@example.com")).toBe(false);
    expect(isTombstoneValue("deleted_but_wrong_format")).toBe(false);
  });

  it("recognises closed-account markers, including legacy ones", () => {
    expect(isTombstoneValue(buildTombstoneEmail())).toBe(true);
    // Rows closed before 2026-11-26 (scrubbed by EraseClosedAccountEmails).
    expect(isTombstoneValue("deleted_a1b2c3d4e5f6789012345678abcdef90_user@example.com")).toBe(
      true,
    );
  });
});

describe("buildTombstoneEmail", () => {
  it("contains no personal data", () => {
    const marker = buildTombstoneEmail();
    expect(marker).toMatch(/^deleted_[a-f0-9]{32}_closed$/);
    expect(marker).not.toContain("@");
  });

  it("is random, so the unique email index never collides", () => {
    expect(buildTombstoneEmail()).not.toBe(buildTombstoneEmail());
  });
});
