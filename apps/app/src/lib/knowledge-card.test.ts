import {
  __setKnowledgeCardQuranForTests,
  pickKnowledgeCard,
  resolveKnowledgeCardEntry,
} from "@/lib/knowledge-card";
import {
  buildKnowledgeCardPool,
  isFriday,
  KNOWLEDGE_NAME_IDS,
  type KnowledgeCardEntry,
  MOTIVATION_QUOTES,
} from "@/lib/knowledge-card-data";
import { loadQuranSyncForTests } from "@/lib/knowledge-card-quran-test-loader";

describe("knowledge card", () => {
  it("resolves a curated quran ayah with arabic and translation", async () => {
    const card = await resolveKnowledgeCardEntry({ kind: "quran", surah: 112, ayah: 1 });
    expect(card?.kind).toBe("quran");
    expect(card?.arabic).toBeTruthy();
    expect(card?.body.length).toBeGreaterThan(0);
    expect(card?.href).toEqual({
      pathname: "/quran/[surah]",
      params: { surah: "112", ayah: "1" },
    });
  });

  it("resolves a bundled hadith with a deep link", async () => {
    const card = await resolveKnowledgeCardEntry({ kind: "hadith", id: "nawawi40:1" });
    expect(card?.kind).toBe("hadith");
    expect(card?.body).toContain("Actions are");
    expect(card?.href).toMatchObject({
      pathname: "/hadith/[collection]",
      params: { collection: "nawawi40" },
    });
  });

  it("adds extra Friday entries on Jumu'ah", () => {
    const weekday = buildKnowledgeCardPool(new Date("2026-07-02T12:00:00"));
    const friday = buildKnowledgeCardPool(new Date("2026-07-03T12:00:00"));
    expect(isFriday(new Date("2026-07-03T12:00:00"))).toBe(true);
    expect(friday.length).toBeGreaterThan(weekday.length);
  });

  it("picks a stable card for a fixed seed", async () => {
    const first = await pickKnowledgeCard(42, new Date("2026-07-02T12:00:00"));
    const second = await pickKnowledgeCard(42, new Date("2026-07-02T12:00:00"));
    expect(first.key).toBe(second.key);
  });
});

describe("knowledge card entry kinds", () => {
  it("resolves Friday Qur'an and hadith with Friday styling", async () => {
    const quran = await resolveKnowledgeCardEntry({ kind: "friday-quran", surah: 62, ayah: 9 });
    expect(quran).toEqual(
      expect.objectContaining({
        kind: "friday",
        titleKey: "home.knowledgeKind.friday",
        palette: "warning",
        key: "friday:62:9",
      }),
    );
    expect(quran?.icon.ios).toBe("sun.max.fill");
    const hadith = await resolveKnowledgeCardEntry({ kind: "friday-hadith", id: "nawawi40:1" });
    expect(hadith).toEqual(
      expect.objectContaining({ kind: "friday", palette: "warning", key: "friday:nawawi40:1" }),
    );
    expect(hadith?.icon.android).toBe("wb_sunny");
  });

  it("resolves a Name of Allah", async () => {
    const [id] = KNOWLEDGE_NAME_IDS;
    const card = await resolveKnowledgeCardEntry({ kind: "name", id });
    expect(card).toEqual(
      expect.objectContaining({ kind: "name", key: `name:${id}`, href: "/names-of-allah" }),
    );
    expect(card?.arabic).toBeTruthy();
    expect(card?.body).toBeTruthy();
  });

  it("resolves motivation quotes with a topic palette and optional source", async () => {
    const withSource = MOTIVATION_QUOTES.find((q) => q.source);
    const withoutSource = MOTIVATION_QUOTES.find((q) => !q.source);
    if (!withSource || !withoutSource) throw new Error("fixture quotes missing");
    const a = await resolveKnowledgeCardEntry({ kind: "motivation", id: withSource.id });
    expect(a).toEqual(
      expect.objectContaining({
        kind: "motivation",
        topic: withSource.topic,
        titleKey: `home.knowledgeTopic.${withSource.topic}`,
      }),
    );
    expect(a?.reference).toBeTruthy();
    const b = await resolveKnowledgeCardEntry({ kind: "motivation", id: withoutSource.id });
    expect(b?.reference).toBeUndefined();
    const palettes = new Set<string>();
    for (const quote of MOTIVATION_QUOTES) {
      const card = await resolveKnowledgeCardEntry({ kind: "motivation", id: quote.id });
      palettes.add(card?.palette ?? "");
    }
    expect(
      [...palettes].every((p) => ["info", "warning", "danger", "success", "accent"].includes(p)),
    ).toBe(true);
  });

  it("returns null for unknown or out-of-range entries", async () => {
    await expect(
      resolveKnowledgeCardEntry({ kind: "quran", surah: 999, ayah: 1 }),
    ).resolves.toBeNull();
    await expect(
      resolveKnowledgeCardEntry({ kind: "quran", surah: 1, ayah: 99 }),
    ).resolves.toBeNull();
    await expect(
      resolveKnowledgeCardEntry({ kind: "hadith", id: "nawawi40:9999" }),
    ).resolves.toBeNull();
    await expect(
      resolveKnowledgeCardEntry({ kind: "name", id: "no-such-name" }),
    ).resolves.toBeNull();
    await expect(resolveKnowledgeCardEntry({ kind: "motivation", id: "nope" })).resolves.toBeNull();
    await expect(
      resolveKnowledgeCardEntry({ kind: "bogus" } as unknown as KnowledgeCardEntry),
    ).resolves.toBeNull();
  });

  it("truncates long ayah translations", async () => {
    const card = await resolveKnowledgeCardEntry({ kind: "quran", surah: 2, ayah: 282 });
    expect(card?.body.endsWith("…")).toBe(true);
    expect(card?.body.length).toBeLessThanOrEqual(221);
  });
});

describe("knowledge card translation fallbacks", () => {
  const realQuran = loadQuranSyncForTests();
  afterEach(() => __setKnowledgeCardQuranForTests(realQuran));

  function fakeQuran(editions: Record<string, Record<string, string>>) {
    return {
      ...realQuran,
      getSurahAyahs: () => [{ arabic: "عربي" }],
      getBundledEdition: (id: string) => editions[id] ?? {},
    } as unknown as typeof import("@/lib/quran");
  }

  it.each([
    [{ "en-pickthall": { "1": "Pickthall" } }, "Pickthall"],
    [{ "en-transliteration": { "1": "Translit" } }, "Translit"],
    [{}, ""],
  ])("falls back through the edition chain (%#)", async (editions, expected) => {
    __setKnowledgeCardQuranForTests(fakeQuran(editions));
    const card = await resolveKnowledgeCardEntry(
      { kind: "quran", surah: 1, ayah: 1 },
      { locale: "en", translationLocale: "ur" },
    );
    expect(card?.body).toBe(expected);
    expect(card?.arabic).toBe("عربي");
  });
});

describe("pickKnowledgeCard fallbacks", () => {
  // jest.setup already loaded knowledge-card against the real pool, so load an
  // isolated copy whose pool is stubbed.
  function withPool(pool: KnowledgeCardEntry[]): typeof import("@/lib/knowledge-card") {
    let mod!: typeof import("@/lib/knowledge-card");
    jest.isolateModules(() => {
      jest.doMock("@/lib/knowledge-card-data", () => ({
        ...jest.requireActual("@/lib/knowledge-card-data"),
        buildKnowledgeCardPool: () => pool,
      }));
      mod = require("@/lib/knowledge-card");
    });
    jest.dontMock("@/lib/knowledge-card-data");
    mod.__setKnowledgeCardQuranForTests(loadQuranSyncForTests());
    return mod;
  }

  it("skips unresolvable pool entries", async () => {
    const valid = MOTIVATION_QUOTES[0].id;
    const mod = withPool([
      { kind: "motivation", id: "missing" },
      { kind: "quran", surah: 999, ayah: 1 },
      { kind: "motivation", id: valid },
    ]);
    // Every seed lands on the only resolvable entry eventually.
    for (const seed of [1, 2, 3]) {
      expect((await mod.pickKnowledgeCard(seed)).key).toBe(`motivation:${valid}`);
    }
  });

  it("returns the steadfastness fallback when nothing resolves", async () => {
    const mod = withPool([]);
    const card = await mod.pickKnowledgeCard(7, new Date("2026-07-02T12:00:00"));
    expect(card).toEqual(
      expect.objectContaining({ key: "fallback", kind: "motivation", topic: "steadfastness" }),
    );
    expect(card.body.length).toBeGreaterThan(0);
  });
});
