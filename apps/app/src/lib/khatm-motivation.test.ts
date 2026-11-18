import i18n from "@/i18n";
import {
  dayMotivationSeed,
  KHATM_MOTIVATION_POOL,
  pickKhatmMotivation,
  resolveKhatmMotivationEntry,
  resolveKhatmQuote,
} from "@/lib/khatm-motivation";
import * as prayerInfo from "@/lib/prayer-info";
import * as quran from "@/lib/quran";
import { buildHadithItem } from "@/test-support/fixtures/hadith";

const t = (key: string) => key;

describe("khatm motivation", () => {
  it("has a non-empty curated pool", () => {
    expect(KHATM_MOTIVATION_POOL.length).toBeGreaterThan(8);
  });

  it("resolves bundled hadith entries", async () => {
    const resolved = await resolveKhatmMotivationEntry(
      { kind: "hadith", id: "riyad_assalihin:312" },
      t,
    );
    expect(resolved?.kind).toBe("hadith");
    expect(resolved?.body.length).toBeGreaterThan(20);
    expect(resolved?.reference).toBeTruthy();
  });

  it("shows full hadith text without truncation", async () => {
    const resolved = await resolveKhatmMotivationEntry(
      { kind: "hadith", id: "riyad_assalihin:320" },
      t,
    );
    expect(resolved?.body.endsWith("…")).toBe(false);
    expect(resolved?.body.length).toBeGreaterThan(220);
  });

  it("resolves bundled quran entries", async () => {
    const resolved = await resolveKhatmMotivationEntry({ kind: "quran", surah: 54, ayah: 17 }, t);
    expect(resolved?.kind).toBe("quran");
    expect(resolved?.arabic).toBeTruthy();
    expect(resolved?.body.length).toBeGreaterThan(10);
  });

  it("picks deterministically for a seed", async () => {
    const first = await pickKhatmMotivation(42, t);
    const second = await pickKhatmMotivation(42, t);
    expect(first.key).toBe(second.key);
  });

  it("changes with a different seed", async () => {
    const first = await pickKhatmMotivation(1, t);
    const second = await pickKhatmMotivation(99, t);
    expect(first.key).not.toBe(second.key);
  });

  it("derives a stable daily seed from the date string", () => {
    expect(dayMotivationSeed("2026-07-06")).toBe(dayMotivationSeed("2026-07-06"));
    expect(dayMotivationSeed("2026-07-06")).not.toBe(dayMotivationSeed("2026-07-07"));
  });
});

describe("khatm motivation edge cases", () => {
  const translate = (key: string) => i18n.t(key);

  afterEach(() => jest.restoreAllMocks());

  it("resolves app-copy quotes with their source", () => {
    expect(resolveKhatmQuote("steady", translate)).toEqual({
      key: "quote:steady",
      kind: "quote",
      body: i18n.t("khatm.motivationQuote.steady.text"),
      reference: i18n.t("khatm.motivationQuote.steady.source"),
    });
  });

  it("omits a missing quote source", () => {
    const onlyText = (key: string) => (key.endsWith(".text") ? "Keep going" : key);
    expect(resolveKhatmQuote("custom", onlyText)?.reference).toBeUndefined();
  });

  it("returns null for an untranslated quote", () => {
    expect(resolveKhatmQuote("unknown", t)).toBeNull();
    expect(resolveKhatmQuote("blank", () => "")).toBeNull();
  });

  it("returns null for a missing ayah or unknown entry kind", async () => {
    await expect(
      resolveKhatmMotivationEntry({ kind: "quran", surah: 1, ayah: 99 }, t),
    ).resolves.toBeNull();
    await expect(resolveKhatmMotivationEntry({ kind: "other" } as never, t)).resolves.toBeNull();
  });

  it("returns null when the hadith cannot be found", async () => {
    jest.spyOn(prayerInfo, "ensureHadithItem").mockResolvedValue(undefined);
    await expect(
      resolveKhatmMotivationEntry({ kind: "hadith", id: "riyad_assalihin:312" }, t),
    ).resolves.toBeNull();
  });

  it("omits Arabic for a hadith without it", async () => {
    jest
      .spyOn(prayerInfo, "ensureHadithItem")
      .mockResolvedValue(buildHadithItem({ arabic: "", english: "  Spaced   text " }));
    const resolved = await resolveKhatmMotivationEntry({ kind: "hadith", id: "x:1" }, t);
    expect(resolved).toMatchObject({ arabic: undefined, body: "Spaced text" });
  });

  it("falls back to the steady quote when nothing resolves", async () => {
    jest.spyOn(prayerInfo, "ensureHadithItem").mockResolvedValue(undefined);
    jest.spyOn(quran, "getSurahAyahs").mockReturnValue([]);
    const copy = (key: string) => (key.startsWith("khatm.motivationQuote.steady") ? key : "");
    await expect(pickKhatmMotivation(7, copy)).resolves.toEqual({
      key: "fallback",
      kind: "quote",
      body: "khatm.motivationQuote.steady.text",
      reference: "khatm.motivationQuote.steady.source",
    });
  });

  it("defaults the daily seed to today", () => {
    expect(dayMotivationSeed()).toBe(dayMotivationSeed(new Date().toLocaleDateString("en-CA")));
  });
});
