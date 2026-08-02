import { describe, expect, it } from "vitest";
import { buildTombstoneEmail, buildTombstoneValue, isTombstoneValue } from "./account-tombstone";

describe("isTombstoneValue", () => {
  it("returns false for empty values", () => {
    expect(isTombstoneValue(null)).toBe(false);
    expect(isTombstoneValue(undefined)).toBe(false);
    expect(isTombstoneValue("")).toBe(false);
  });

  it("returns false for normal identifiers", () => {
    expect(isTombstoneValue("user@example.com")).toBe(false);
    expect(isTombstoneValue("deleted_but_wrong_format")).toBe(false);
  });

  it("returns true for tombstone-prefixed values", () => {
    expect(isTombstoneValue("deleted_a1b2c3d4e5f6789012345678abcdef90_user@example.com")).toBe(
      true,
    );
  });
});

describe("buildTombstoneValue", () => {
  it("prefixes deleted_ token and original value", () => {
    const result = buildTombstoneValue("user@example.com", "fallback");
    expect(result).toMatch(/^deleted_[a-f0-9]{32}_user@example\.com$/);
    expect(isTombstoneValue(result)).toBe(true);
  });

  it("uses fallback when original is empty", () => {
    const result = buildTombstoneValue(null, "fallback-id");
    expect(result).toMatch(/^deleted_[a-f0-9]{32}_fallback-id$/);
  });

  it("strips an existing tombstone prefix before re-tombstoning", () => {
    const first = buildTombstoneValue("user@example.com", "fallback");
    const second = buildTombstoneValue(first, "fallback");
    expect(second).toMatch(/^deleted_[a-f0-9]{32}_user@example\.com$/);
    expect(second).not.toBe(first);
  });
});

describe("buildTombstoneEmail", () => {
  it("uses user id fallback when email is missing", () => {
    const result = buildTombstoneEmail(null, "abc-123");
    expect(result).toMatch(/^deleted_[a-f0-9]{32}_user_abc-123$/);
  });

  it("preserves original email in the tombstone suffix", () => {
    const result = buildTombstoneEmail("keep@example.com", "abc-123");
    expect(result).toMatch(/^deleted_[a-f0-9]{32}_keep@example\.com$/);
  });
});
