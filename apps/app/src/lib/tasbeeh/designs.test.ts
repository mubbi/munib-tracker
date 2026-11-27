import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";

import {
  availableDesigns,
  DEFAULT_MISBAHA,
  DEFAULT_TASBEEH_APPEARANCE,
  getDesign,
  isDesignAvailable,
  mergeTasbeehAppearance,
  misbahaLayoutFor,
  resolveSoundPack,
  resolveTasbeehAppearance,
  strandModelFor,
  TASBEEH_DESIGNS,
} from "./designs";

describe("design registry", () => {
  it("lists every catalog design once, Ring first", () => {
    const ids = TASBEEH_DESIGNS.map((d) => d.id);
    expect(ids[0]).toBe("ring");
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(
      expect.arrayContaining([
        "ring",
        "misbaha",
        "clicker",
        "minimal",
        "fingers",
        "geometric",
        "stars",
        "pebbles",
      ]),
    );
  });

  it("ships P1 and P2 designs", () => {
    for (const design of TASBEEH_DESIGNS.filter((d) => d.priority !== "P3")) {
      expect(design.shipped).toBe(true);
    }
  });

  it("ships the v2 designs on phones and web only, Pebbles included (D16)", () => {
    const v2 = TASBEEH_DESIGNS.filter((d) => d.priority === "P3");
    expect(v2.map((d) => d.id).sort()).toEqual(["fingers", "geometric", "pebbles", "stars"]);
    for (const design of v2) {
      expect(design.shipped).toBe(true);
      expect(design.tv).toBe(false);
      expect(design.celebrates).toBe(false);
      expect(isDesignAvailable(design.id, { tv: false })).toBe(true);
    }
  });

  it("offers only TV-ready designs on TV", () => {
    expect(availableDesigns({ tv: true }).map((d) => d.id)).toEqual([
      "ring",
      "misbaha",
      "clicker",
      "minimal",
    ]);
    for (const design of availableDesigns({ tv: true })) expect(design.tv).toBe(true);
    expect(isDesignAvailable("fingers", { tv: true })).toBe(false);
  });

  it("falls back to Ring for unknown designs", () => {
    expect(getDesign("nope").id).toBe("ring");
    expect(getDesign(undefined).id).toBe("ring");
  });

  it("celebrates only on Ring and marks milestones on Focus / Night", () => {
    expect(TASBEEH_DESIGNS.filter((d) => d.celebrates).map((d) => d.id)).toEqual(["ring"]);
    expect(getDesign("minimal").milestones).toBe(true);
  });
});

describe("resolveTasbeehAppearance", () => {
  it("keeps existing users on Ring with no stored value (D10)", () => {
    expect(DEFAULT_USER_PREFERENCES.tasbeehAppearance).toBeUndefined();
    const resolved = resolveTasbeehAppearance(undefined, { tv: false });
    expect(resolved.design).toBe("ring");
    expect(resolved.haptics).toBe("subtle");
    expect(resolved.misbaha).toEqual(DEFAULT_MISBAHA);
  });

  it("defaults sound on for TV and off on phones (D16)", () => {
    expect(resolveTasbeehAppearance(undefined, { tv: true }).sound.enabled).toBe(true);
    expect(resolveTasbeehAppearance(undefined, { tv: false }).sound.enabled).toBe(false);
    const chosen = mergeTasbeehAppearance(undefined, {
      sound: { enabled: false, pack: "auto", volume: 0.6 },
    });
    expect(resolveTasbeehAppearance(chosen, { tv: true }).sound.enabled).toBe(false);
  });

  it("shows a phone-only design as Ring on TV without rewriting it", () => {
    const stored = { ...DEFAULT_TASBEEH_APPEARANCE, design: "fingers" as const };
    expect(resolveTasbeehAppearance(stored, { tv: true }).design).toBe("ring");
    expect(stored.design).toBe("fingers");
  });

  it("defaults the v2 options and drops unknown values", () => {
    const fresh = resolveTasbeehAppearance(undefined, { tv: false });
    expect(fresh.pebbles).toEqual({ item: "pits" });
    expect(fresh.fingers).toEqual({ layout: "tips" });
    const odd = resolveTasbeehAppearance(
      {
        design: "pebbles",
        pebbles: { item: "marbles" as never },
        fingers: { layout: "knuckles" as never },
        sound: { pack: "auto", volume: 0.5 },
        haptics: "subtle",
      },
      { tv: false },
    );
    expect(odd.design).toBe("pebbles");
    expect(odd.pebbles.item).toBe("pits");
    expect(odd.fingers.layout).toBe("tips");
  });

  it("merges v2 options without touching the rest", () => {
    const stored = mergeTasbeehAppearance(undefined, { design: "fingers" });
    const next = mergeTasbeehAppearance(stored, { fingers: { layout: "joints" } });
    expect(next.fingers).toEqual({ layout: "joints" });
    expect(next.design).toBe("fingers");
    expect(mergeTasbeehAppearance(next, { pebbles: { item: "stones" } }).fingers).toEqual({
      layout: "joints",
    });
  });

  it("sanitises volume, pack and haptics", () => {
    const resolved = resolveTasbeehAppearance(
      {
        design: "clicker",
        sound: { pack: "bells", volume: 7 },
        haptics: "loud" as never,
      },
      { tv: false },
    );
    expect(resolved.sound).toEqual({ enabled: false, pack: "auto", volume: 1 });
    expect(resolved.haptics).toBe("subtle");
  });
});

describe("mergeTasbeehAppearance", () => {
  it("round-trips through the preferences field", () => {
    const first = mergeTasbeehAppearance(undefined, { design: "misbaha" });
    expect(first.design).toBe("misbaha");
    const second = mergeTasbeehAppearance(first, {
      misbaha: { ...DEFAULT_MISBAHA, shape: "olive" },
    });
    expect(second.misbaha?.shape).toBe("olive");
    expect(second.design).toBe("misbaha");
    const third = mergeTasbeehAppearance(second, {
      sound: { enabled: true, pack: "stone", volume: 0.4 },
    });
    expect(third.sound).toEqual({ enabled: true, pack: "stone", volume: 0.4 });
    expect(third.misbaha?.shape).toBe("olive");
    expect(JSON.parse(JSON.stringify(third))).toEqual(third);
  });
});

describe("sound pack and layout", () => {
  it("follows the material for the misbaha and the design otherwise", () => {
    const misbaha = resolveTasbeehAppearance(
      { ...DEFAULT_TASBEEH_APPEARANCE, design: "misbaha" },
      { tv: false },
    );
    expect(resolveSoundPack(misbaha, "glass")).toBe("glass");
    const clicker = resolveTasbeehAppearance(
      { ...DEFAULT_TASBEEH_APPEARANCE, design: "clicker" },
      { tv: false },
    );
    expect(resolveSoundPack(clicker, "glass")).toBe("clicker");
    const amberLcd = resolveTasbeehAppearance(
      { ...DEFAULT_TASBEEH_APPEARANCE, design: "clicker", clicker: { backlight: "amber" } },
      { tv: false },
    );
    expect(resolveSoundPack(amberLcd, "glass")).toBe("lcd");
    const explicit = resolveTasbeehAppearance(
      { ...DEFAULT_TASBEEH_APPEARANCE, sound: { pack: "pearl", volume: 1 } },
      { tv: false },
    );
    expect(resolveSoundPack(explicit, "glass")).toBe("pearl");
  });

  it("picks horizontal on TV, tabletop and landscape", () => {
    expect(misbahaLayoutFor(undefined, { tv: false, tabletop: false, landscape: false })).toBe(
      "arc",
    );
    expect(misbahaLayoutFor(undefined, { tv: false, tabletop: true, landscape: false })).toBe(
      "horizontal",
    );
    expect(misbahaLayoutFor(undefined, { tv: false, tabletop: false, landscape: true })).toBe(
      "horizontal",
    );
    expect(misbahaLayoutFor("loop", { tv: true, tabletop: false, landscape: false })).toBe(
      "horizontal",
    );
    expect(misbahaLayoutFor("loop", { tv: false, tabletop: false, landscape: false })).toBe("loop");
  });

  it("builds the strand the shell and face share", () => {
    expect(strandModelFor(DEFAULT_MISBAHA, 100).unitsPerLap).toBe(100);
    expect(strandModelFor({ ...DEFAULT_MISBAHA, spacer: "off" }, 33).itemsPerLap).toBe(34);
  });
});
