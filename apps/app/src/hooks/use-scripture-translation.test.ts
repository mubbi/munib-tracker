import { renderHook } from "@testing-library/react-native";

import { resetPreferences, setPreferences } from "@/test-support/preferences";

import { scriptureTranslationForPrefs, useScriptureTranslation } from "./use-scripture-translation";

const DUA = { translation: "O Allah", translations: { ur: "اے اللہ" } };

afterEach(resetPreferences);

describe("useScriptureTranslation", () => {
  it("uses the dataset translation for the preferred locale", async () => {
    await setPreferences({ translationLocale: "ur" });
    const { result } = await renderHook(() => useScriptureTranslation(DUA));
    expect(result.current).toBe("اے اللہ");
  });

  it("falls back to English", async () => {
    await setPreferences({ translationLocale: "fr" });
    const { result } = await renderHook(() => useScriptureTranslation(DUA));
    expect(result.current).toBe("O Allah");
  });

  it("resolves without the hook when prefs are at hand", () => {
    expect(scriptureTranslationForPrefs(DUA, { translationLocale: "ur" })).toBe("اے اللہ");
  });
});
