import {
  __setContentLoaderCachesForTests,
  getDuaByIdFrom,
  getDuroodByIdFrom,
  getZikrByIdFrom,
  loadDuaItems,
  loadDuroodItems,
  loadNamesOfAllah,
  loadZikrItems,
} from "@/lib/content-loaders";

type Mod = typeof import("@/lib/content-loaders");

function fresh(): Mod {
  let mod!: Mod;
  jest.isolateModules(() => {
    mod = require("@/lib/content-loaders") as Mod;
  });
  return mod;
}

describe("content loaders", () => {
  it("returns the warm caches seeded by jest.setup", async () => {
    const names = await loadNamesOfAllah();
    expect(names.length).toBe(99);
    expect(await loadNamesOfAllah()).toBe(names);
    expect((await loadDuaItems()).length).toBeGreaterThan(0);
    expect((await loadZikrItems()).length).toBeGreaterThan(0);
    expect((await loadDuroodItems()).length).toBeGreaterThan(0);
  });

  it("only overrides the corpora that are passed", async () => {
    const mod = fresh();
    const duas = [{ id: "d1" }] as never;
    mod.__setContentLoaderCachesForTests({ duas });
    await expect(mod.loadDuaItems()).resolves.toBe(duas);
    const zikr = [{ id: "z1" }] as never;
    const duroods = [{ id: "r1" }] as never;
    const names = [{ id: 1 }] as never;
    mod.__setContentLoaderCachesForTests({ zikr, duroods, names });
    await expect(mod.loadZikrItems()).resolves.toBe(zikr);
    await expect(mod.loadDuroodItems()).resolves.toBe(duroods);
    await expect(mod.loadNamesOfAllah()).resolves.toBe(names);
    await expect(mod.loadDuaItems()).resolves.toBe(duas);
    mod.__setContentLoaderCachesForTests({});
    await expect(mod.loadDuaItems()).resolves.toBe(duas);
  });

  it("finds items by id", () => {
    const items = [{ id: "a" }, { id: "b" }] as never[];
    expect(getDuaByIdFrom(items, "b")).toEqual({ id: "b" });
    expect(getZikrByIdFrom(items, "a")).toEqual({ id: "a" });
    expect(getDuroodByIdFrom(items, "c")).toBeUndefined();
    expect(typeof __setContentLoaderCachesForTests).toBe("function");
  });
});
