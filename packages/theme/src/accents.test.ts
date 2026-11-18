import { describe, expect, it } from "vitest";
import { accentColorIds, defaultAccentColorId, resolveAccentColorId } from "./accents";

describe("resolveAccentColorId", () => {
  it.each(accentColorIds)("returns known accent id %s unchanged", (id) => {
    expect(resolveAccentColorId(id)).toBe(id);
  });

  it.each([null, "", "ultraviolet"])("returns null for %j", (stored) => {
    expect(resolveAccentColorId(stored)).toBeNull();
  });

  it("includes the default accent among the known ids", () => {
    expect(accentColorIds).toContain(defaultAccentColorId);
  });
});
