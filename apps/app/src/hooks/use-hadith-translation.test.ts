import { renderHook } from "@testing-library/react-native";

import { resetPreferences, setPreferences } from "@/test-support/preferences";

import { useHadithTranslation } from "./use-hadith-translation";

const HADITH = {
  english: "Actions are by intentions",
  arabic: "إنما الأعمال بالنيات",
  translations: {},
};

afterEach(resetPreferences);

describe("useHadithTranslation", () => {
  it("shows the Arabic text for Arabic readers", async () => {
    await setPreferences({ translationLocale: "ar" });
    const { result } = await renderHook(() => useHadithTranslation(HADITH));
    expect(result.current).toBe("إنما الأعمال بالنيات");
  });

  it("falls back to English", async () => {
    await setPreferences({ translationLocale: "en" });
    const { result } = await renderHook(() => useHadithTranslation(HADITH));
    expect(result.current).toBe("Actions are by intentions");
  });
});
