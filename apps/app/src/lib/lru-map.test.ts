import { LruMap } from "@/lib/lru-map";

function setup(maxSize = 2) {
  const map = new LruMap<string, number>(maxSize);
  map.set("a", 1);
  map.set("b", 2);
  return map;
}

describe("LruMap", () => {
  it("rejects a non-positive size", () => {
    expect(() => new LruMap(0)).toThrow("LruMap maxSize must be >= 1");
  });

  it("evicts the least recently set entry", () => {
    const map = setup();
    map.set("c", 3);
    expect([...map.entries()]).toEqual([
      ["b", 2],
      ["c", 3],
    ]);
  });

  it("refreshes recency on get", () => {
    const map = setup();
    expect(map.get("a")).toBe(1);
    map.set("c", 3);
    expect([map.has("a"), map.has("b")]).toEqual([true, false]);
  });

  it("refreshes recency when overwriting a key", () => {
    const map = setup();
    map.set("a", 10);
    map.set("c", 3);
    expect(map.get("a")).toBe(10);
    expect(map.has("b")).toBe(false);
  });

  it("misses unknown keys and clears", () => {
    const map = setup();
    expect(map.get("zzz")).toBeUndefined();
    map.clear();
    expect(map.size).toBe(0);
  });
});
