import { act, renderHook, screen } from "@testing-library/react-native";

import { ReligiousTextStack } from "@/components/content/religious-text-stack";
import { ScriptureMeaning } from "@/components/content/scripture-meaning";
import { ThemedText } from "@/components/themed-text";
import { useScriptureMeaning } from "@/hooks/use-scripture-meaning";
import i18n from "@/i18n";
import { resetPreferences, setPreferences } from "@/test-support/preferences";
import { renderWithTheme } from "@/test-support/render";

jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);

const mockFetchRemoteEditionSurah = jest.fn();
jest.mock("@/api/quran-remote", () => ({
  fetchRemoteEditionSurah: (editionId: string, surah: number) =>
    mockFetchRemoteEditionSurah(editionId, surah),
}));

const ENGLISH = "Zakat is only for the poor and the needy…";
const AYAH = { surah: 9, ayahFrom: 60 };
const labelText = () => i18n.t("scriptureMeaning.englishLabel");

async function setUiLanguage(lang: string) {
  await act(async () => {
    await i18n.changeLanguage(lang);
  });
}

/** Lets the (mocked) edition fetch resolve and the hook re-render. */
async function flushDatasetLoad() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

describe("D45 scripture meaning", () => {
  afterEach(async () => {
    await setUiLanguage("en");
    await resetPreferences();
    mockFetchRemoteEditionSurah.mockReset();
  });

  it("shows the English meaning without a label in an English UI", async () => {
    await renderWithTheme(
      <ScriptureMeaning english={ENGLISH}>
        {(text) => <ThemedText>{text}</ThemedText>}
      </ScriptureMeaning>,
    );
    expect(screen.getByText(ENGLISH)).toBeTruthy();
    expect(screen.queryByText(labelText())).toBeNull();
  });

  it("labels a hadith meaning as English in a non-English UI", async () => {
    await setPreferences({ locale: "fr", translationLocale: "fr" });
    await renderWithTheme(
      <ScriptureMeaning english={ENGLISH}>
        {(text) => <ThemedText>{text}</ThemedText>}
      </ScriptureMeaning>,
    );
    await setUiLanguage("fr");
    expect(screen.getByText(ENGLISH)).toBeTruthy();
    expect(screen.getByText(labelText())).toBeTruthy();
    expect(mockFetchRemoteEditionSurah).not.toHaveBeenCalled();
  });

  it("keeps the labelled English in ReligiousTextStack when the dataset fetch fails (offline)", async () => {
    mockFetchRemoteEditionSurah.mockRejectedValue(new Error("offline"));
    await setPreferences({ locale: "kk", translationLocale: "kk" });
    await renderWithTheme(<ReligiousTextStack translation={ENGLISH} quranRef={AYAH} compact />);
    await setUiLanguage("kk");
    await flushDatasetLoad();
    expect(screen.getByText(ENGLISH)).toBeTruthy();
    expect(screen.getByText(labelText())).toBeTruthy();
  });

  it("resolves a Qur'an excerpt from the user's dataset translation edition", async () => {
    mockFetchRemoteEditionSurah.mockResolvedValue({ "60": "Sadakalar ancak fakirler…" });
    await setPreferences({ locale: "tr", translationLocale: "tr" });
    await setUiLanguage("tr");
    const { result } = await renderHook(() => useScriptureMeaning(ENGLISH, AYAH));
    await flushDatasetLoad();
    expect(mockFetchRemoteEditionSurah).toHaveBeenCalledWith("tr-diyanet", 9);
    expect(result.current).toEqual({ text: "Sadakalar ancak fakirler…", englishFallback: false });
  });

  it("keeps long story spans on the labelled English (no dataset fetch)", async () => {
    await setPreferences({ locale: "tr", translationLocale: "tr" });
    await setUiLanguage("tr");
    const { result } = await renderHook(() =>
      useScriptureMeaning(ENGLISH, { surah: 2, ayahFrom: 30, ayahTo: 39 }),
    );
    expect(result.current).toEqual({ text: ENGLISH, englishFallback: true });
    expect(mockFetchRemoteEditionSurah).not.toHaveBeenCalled();
  });
});
