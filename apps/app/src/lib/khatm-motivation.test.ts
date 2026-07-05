import {
  dayMotivationSeed,
  KHATM_MOTIVATION_POOL,
  pickKhatmMotivation,
  resolveKhatmMotivationEntry,
} from "@/lib/khatm-motivation";

const t = (key: string) => key;

describe("khatm motivation", () => {
  it("has a non-empty curated pool", () => {
    expect(KHATM_MOTIVATION_POOL.length).toBeGreaterThan(8);
  });

  it("resolves bundled hadith entries", () => {
    const resolved = resolveKhatmMotivationEntry({ kind: "hadith", id: "riyad_assalihin:312" }, t);
    expect(resolved?.kind).toBe("hadith");
    expect(resolved?.body.length).toBeGreaterThan(20);
    expect(resolved?.reference).toBeTruthy();
  });

  it("shows full hadith text without truncation", () => {
    const resolved = resolveKhatmMotivationEntry({ kind: "hadith", id: "riyad_assalihin:320" }, t);
    expect(resolved?.body.endsWith("…")).toBe(false);
    expect(resolved?.body.length).toBeGreaterThan(220);
  });

  it("resolves bundled quran entries", () => {
    const resolved = resolveKhatmMotivationEntry({ kind: "quran", surah: 54, ayah: 17 }, t);
    expect(resolved?.kind).toBe("quran");
    expect(resolved?.arabic).toBeTruthy();
    expect(resolved?.body.length).toBeGreaterThan(10);
  });

  it("picks deterministically for a seed", () => {
    const first = pickKhatmMotivation(42, t);
    const second = pickKhatmMotivation(42, t);
    expect(first.key).toBe(second.key);
  });

  it("changes with a different seed", () => {
    const first = pickKhatmMotivation(1, t);
    const second = pickKhatmMotivation(99, t);
    expect(first.key).not.toBe(second.key);
  });

  it("derives a stable daily seed from the date string", () => {
    expect(dayMotivationSeed("2026-07-06")).toBe(dayMotivationSeed("2026-07-06"));
    expect(dayMotivationSeed("2026-07-06")).not.toBe(dayMotivationSeed("2026-07-07"));
  });
});
