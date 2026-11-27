import { describe, expect, it } from "vitest";
import { DUA_ITEMS } from "../content/duas";
import { DUA_COUNT } from "./content-counts";

describe("content counts", () => {
  it("DUA_COUNT matches the bundled duas", () => {
    expect(DUA_COUNT).toBe(DUA_ITEMS.length);
    expect(new Set(DUA_ITEMS.map((dua) => dua.id)).size).toBe(DUA_COUNT);
  });
});
