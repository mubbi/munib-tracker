import fs from "node:fs";
import path from "node:path";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { act } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { preferencesStore } from "@/stores/preferences-store";

import {
  DEFAULT_READING_DISPLAY,
  legacyReadingDisplay,
  migrateStoredReadingDisplay,
  readingDisplayOf,
} from "./reading-display-migration";
import { getSetting } from "./registry";
import { getSettingsSnapshot } from "./snapshot";

/**
 * D13: one app-wide `readingDisplay` pair replaces the Qur'an reader, practice,
 * hadith and dua/zikr translation + transliteration toggles (§4.5.4).
 */

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("legacyReadingDisplay (seed rule)", () => {
  it.each([
    [
      "the Qur'an reader wins",
      { showTranslation: false, showTransliteration: true },
      { showTranslation: true, showTransliteration: false },
      { showTranslation: false, showTransliteration: true },
    ],
    [
      "falls back to the dua/zikr visibility blob",
      { preferredReciterDir: "Alafasy_128kbps" },
      { showTranslation: true, showTransliteration: false },
      { showTranslation: true, showTransliteration: false },
    ],
    ["defaults with no legacy data", null, null, DEFAULT_READING_DISPLAY],
    [
      "treats a half-set Qur'an blob as on for the missing field",
      { showTransliteration: false },
      null,
      { showTranslation: true, showTransliteration: false },
    ],
    ["ignores malformed blobs", ["x"], "y", DEFAULT_READING_DISPLAY],
  ])("%s", (_case, quran, visibility, expected) => {
    expect(legacyReadingDisplay(quran, visibility)).toEqual(expected);
  });

  it("reads unset as both on", () => {
    expect(readingDisplayOf({})).toEqual(DEFAULT_READING_DISPLAY);
    expect(readingDisplayOf({ readingDisplay: { showTranslation: false } as never })).toEqual({
      showTranslation: false,
      showTransliteration: true,
    });
  });
});

describe("migrateStoredReadingDisplay", () => {
  it("seeds from the stored Qur'an prefs once, keeping the sync stamp", async () => {
    await writeJSON(DB_KEYS.userPreferences, { locale: "ur", updatedAt: "2026-01-01T00:00:00Z" });
    await writeJSON(DB_KEYS.quranPrefs, { showTranslation: false, showTransliteration: false });
    await writeJSON(DB_KEYS.readingTextVisibility, { showTranslation: true });

    const seeded = await migrateStoredReadingDisplay();

    expect(seeded).toEqual({ showTranslation: false, showTransliteration: false });
    expect(await readJSON(DB_KEYS.userPreferences, null)).toEqual({
      locale: "ur",
      updatedAt: "2026-01-01T00:00:00Z",
      readingDisplay: { showTranslation: false, showTransliteration: false },
    });
  });

  it("falls back to the dua/zikr visibility blob", async () => {
    await writeJSON(DB_KEYS.readingTextVisibility, { showTransliteration: false });
    expect(await migrateStoredReadingDisplay()).toEqual({
      showTranslation: true,
      showTransliteration: false,
    });
  });

  it("never overwrites an existing value (old fields are read once)", async () => {
    await writeJSON(DB_KEYS.userPreferences, {
      readingDisplay: { showTranslation: true, showTransliteration: false },
    });
    await writeJSON(DB_KEYS.quranPrefs, { showTranslation: false, showTransliteration: true });

    expect(await migrateStoredReadingDisplay()).toBeNull();
    expect(await readJSON(DB_KEYS.userPreferences, null)).toEqual({
      readingDisplay: { showTranslation: true, showTransliteration: false },
    });
  });

  it("runs when the preferences store hydrates", async () => {
    await writeJSON(DB_KEYS.quranPrefs, { showTranslation: false, showTransliteration: true });
    await act(async () => {
      preferencesStore.setState({ isReady: false });
      await preferencesStore.getState().load();
    });
    expect(preferencesStore.getState().prefs.readingDisplay).toEqual({
      showTranslation: false,
      showTransliteration: true,
    });
  });
});

describe("the app-wide settings", () => {
  beforeEach(async () => {
    await act(async () => {
      preferencesStore.setState({ isReady: false });
      await preferencesStore.getState().load();
    });
  });

  it.each([
    ["fonts.reading.showTranslation", "showTranslation"],
    ["fonts.reading.showTransliteration", "showTransliteration"],
  ] as const)("%s writes readingDisplay only — never the retired fields", async (id, key) => {
    const def = getSetting(id);
    if (!def) throw new Error(id);
    await act(async () => {
      await def.write(false);
    });

    expect(def.read(getSettingsSnapshot())).toBe(false);
    const stored = await readJSON<{ readingDisplay?: Record<string, boolean> }>(
      DB_KEYS.userPreferences,
      {},
    );
    expect(stored.readingDisplay?.[key]).toBe(false);
    expect(await readJSON(DB_KEYS.readingTextVisibility, null)).toBeNull();
    const quran = await readJSON<Record<string, unknown> | null>(DB_KEYS.quranPrefs, null);
    expect(quran?.[key]).toBeUndefined();
  });

  it("is registered once, under Text & fonts", () => {
    for (const id of ["fonts.reading.showTranslation", "fonts.reading.showTransliteration"]) {
      expect(getSetting(id)?.group).toBe("fonts");
    }
    for (const retired of [
      "quran.reader.showTranslation",
      "quran.reader.showTransliteration",
      "quran.practice.showTranslation",
      "quran.practice.showTransliteration",
      "content.hadith.showTranslation",
      "content.duas.showTranslation",
      "content.duas.showTransliteration",
    ]) {
      expect(getSetting(retired)).toBeUndefined();
    }
  });
});

/**
 * Every reading surface reads (and its chips write) the merged value. Rendered
 * coverage lives in each component's test (reading-card, tasbeeh block, ayah
 * range cards, scripture filters, practice toolbar); this guards the screens.
 */
describe("every reading surface uses the merged value", () => {
  const SRC = path.resolve(__dirname, "../..");
  const SURFACES: Record<string, string[]> = {
    "Qur'an reader (ayah)": ["app/quran/[surah].tsx"],
    "Qur'an reader (page / mushaf)": ["app/quran/page/[page].tsx"],
    "Qur'an practice": ["app/quran/practice/session.tsx", "components/quran/practice-toolbar.tsx"],
    Hadith: ["app/hadith/[collection].tsx"],
    Duas: [
      "components/content/reading-card.tsx",
      "components/content/scripture-reading-filters.tsx",
    ],
    Adhkar: ["components/zikr/adhkar-reading-card.tsx"],
    Duroods: ["app/duroods/index.tsx", "app/duroods/favorites.tsx"],
    Tasbeeh: [
      "components/tasbeeh/tasbeeh-reading-block.tsx",
      "app/tasbeeh/[zikrId].tsx",
      "app/tasbeeh/durood/[id].tsx",
    ],
    "Learn / ranges": [
      "components/reading-typography-context.tsx",
      "components/quran/quran-ayah-range-cards.tsx",
    ],
  };
  const LEGACY = [
    /useReadingTextVisibility/,
    /reading-text-visibility-store/,
    // (QuranPrefs / HadithPrefs / companion fields are gone from the types, so a
    // stray `prefs.showTranslation` on them is a check-types error.)
    /\bquranPrefs\.showTransl/,
    /seedReadingToggles|readingTogglesSeeded/,
  ];

  it.each(Object.entries(SURFACES))("%s", (_surface, files) => {
    for (const file of files) {
      const source = fs.readFileSync(path.join(SRC, file), "utf8");
      expect({ file, merged: /useReadingDisplay(Toggles)?\(/.test(source) }).toEqual({
        file,
        merged: true,
      });
      expect({ file, legacy: LEGACY.filter((re) => re.test(source)).map(String) }).toEqual({
        file,
        legacy: [],
      });
    }
  });
});
