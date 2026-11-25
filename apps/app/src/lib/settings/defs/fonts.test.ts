import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import { READING_SURFACE_IDS, type UserPreferences } from "@munib-tracker/shared/types";

import { DB_KEYS } from "@/db/keys";
import { PreferencesRepository } from "@/db/repositories/preferences-repository";
import { writeJSON } from "@/db/store";
import i18n from "@/i18n";
import { resolveReadingFontSizes } from "@/lib/reading-typography";
import {
  customSurfaceCount,
  READING_SURFACE_TITLE_KEYS,
  READING_SURFACES,
} from "@/lib/settings/defs/fonts";

describe("per-screen text size surfaces", () => {
  it("lists every shared reading surface, finance included (G-72)", () => {
    expect([...READING_SURFACES].sort()).toEqual([...READING_SURFACE_IDS].sort());
    expect(READING_SURFACE_TITLE_KEYS.finance).toBe("settingsPanel.surfaceFinance");
    expect(i18n.t(READING_SURFACE_TITLE_KEYS.finance)).toBe("Zakat & finance guides");
  });

  it("counts a finance override and ignores keys this build doesn't know", () => {
    const fontPrefs = {
      ...DEFAULT_USER_PREFERENCES.fontPrefs,
      readingOverrides: {
        finance: { arabicDelta: 2 },
        jannah: { arabicDelta: 0, textDelta: 0 },
        futureSurface: { arabicDelta: 4 },
      } as UserPreferences["fontPrefs"]["readingOverrides"],
    };
    expect(customSurfaceCount(fontPrefs)).toBe(1);
  });

  it("falls back to the global sizes when stored prefs have no finance entry", async () => {
    await writeJSON(DB_KEYS.userPreferences, {
      fontPrefs: {
        arabic: { size: 30 },
        translation: { size: 18 },
        readingOverrides: { jannah: { arabicDelta: -2, textDelta: -2 } },
      },
    });
    const prefs = await PreferencesRepository.get();

    expect(prefs.fontPrefs.readingOverrides?.finance).toBeUndefined();
    expect(resolveReadingFontSizes("finance", prefs.fontPrefs)).toEqual({
      arabic: 30,
      translation: 18,
      transliteration: 17,
    });
    expect(resolveReadingFontSizes("jannah", prefs.fontPrefs).arabic).toBe(28);
  });
});
