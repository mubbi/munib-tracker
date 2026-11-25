import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import type { ReactElement } from "react";

import QuranSearchScreen from "@/app/quran/search";
import QuranVerseDetectorScreen from "@/app/verse-detector";
import {
  defaultFindAyahLang,
  FindAyahNoResults,
  FindAyahResultCard,
  FindAyahScreen,
} from "@/components/quran/find-ayah-screen";
import { ReadingTypographyProvider } from "@/components/reading-typography-context";
import i18n from "@/i18n";
import type { VerseDetectionHit } from "@/lib/quran-verse-detector";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock("@/lib/quran-verse-detector", () => ({
  ...jest.requireActual("@/lib/quran-verse-detector"),
  detectQuranVerses: jest.fn(async () => []),
}));

const t = (key: string, vars?: Record<string, unknown>) => i18n.t(key, vars);

const HIT: VerseDetectionHit = {
  surah: 2,
  ayah: 255,
  surahName: "Al-Baqarah",
  surahNameEnglish: "The Cow",
  arabic: "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ",
  translation: "Allah — there is no deity except Him, the Ever-Living",
  transliteration: "",
  confidence: 0.9,
  matchKind: "alias",
  query: "Allah",
  popularName: "Ayat al-Kursi",
};

beforeEach(() => {
  resetExpoRouterMock();
});

describe("Find an ayah — one screen, two routes (C-08)", () => {
  it("renders the same FindAyahScreen from /quran/search and /verse-detector", () => {
    const search = QuranSearchScreen() as ReactElement<{ entry: string }>;
    const detector = QuranVerseDetectorScreen() as ReactElement<{ entry: string }>;
    expect(search.type).toBe(FindAyahScreen);
    expect(detector.type).toBe(FindAyahScreen);
    expect(search.props.entry).toBe("search");
    expect(detector.props.entry).toBe("detector");
  });
});

describe("Find an ayah — one tuning for both entries (P5-30)", () => {
  const { detectQuranVerses } = jest.requireMock("@/lib/quran-verse-detector") as {
    detectQuranVerses: jest.Mock;
  };

  it.each([
    ["search", "quran.searchPlaceholder", false],
    ["detector", "quran.detector.textPlaceholder", true],
  ] as const)(
    "%s: same debounce and result cap (multi-line paste box only on the detector)",
    async (entry, key, multiline) => {
      jest.useFakeTimers();
      try {
        detectQuranVerses.mockClear();
        await renderWithTheme(<FindAyahScreen entry={entry} />);
        const field = screen.getByPlaceholderText(t(key));
        expect(Boolean(field.props.multiline)).toBe(multiline);
        await fireEvent.changeText(field, "ab");
        await act(async () => {
          jest.advanceTimersByTime(299);
        });
        expect(detectQuranVerses).not.toHaveBeenCalled();
        await act(async () => {
          jest.advanceTimersByTime(1);
          jest.runOnlyPendingTimers();
        });
        expect(detectQuranVerses).toHaveBeenCalledWith(
          "ab",
          expect.objectContaining({ limit: 20 }),
        );
      } finally {
        jest.useRealTimers();
      }
    },
  );
});

describe("Verse detector paste box", () => {
  const { detectQuranVerses } = jest.requireMock("@/lib/quran-verse-detector") as {
    detectQuranVerses: jest.Mock;
  };
  const actual = jest.requireActual("@/lib/quran-verse-detector") as {
    detectQuranVerses: (...args: unknown[]) => Promise<VerseDetectionHit[]>;
  };

  it("is a labelled multi-line field and a pasted multi-line passage still finds the ayah", async () => {
    detectQuranVerses.mockClear();
    detectQuranVerses.mockImplementation((...args: unknown[]) => actual.detectQuranVerses(...args));
    try {
      await renderWithTheme(<FindAyahScreen entry="detector" />);
      const field = screen.getByLabelText(t("quran.detector.textLabel"));
      expect(field.props.multiline).toBe(true);
      await fireEvent.changeText(
        field,
        "Allah! There is no deity save Him,\nthe Alive, the Eternal",
      );
      await waitFor(() => expect(detectQuranVerses).toHaveBeenCalled(), { timeout: 3000 });
      const [query] = detectQuranVerses.mock.calls.at(-1) as [string];
      expect(query).toContain("\n");
      const hits = (await detectQuranVerses.mock.results.at(-1)?.value) as VerseDetectionHit[];
      expect(hits[0]).toEqual(expect.objectContaining({ surah: 2, ayah: 255 }));
    } finally {
      detectQuranVerses.mockImplementation(async () => []);
    }
  });
});

describe("defaultFindAyahLang (G-10)", () => {
  it("starts on the reader's translation language when it is indexed", () => {
    expect(defaultFindAyahLang({ translationLocale: "en", locale: "ar" })).toBe("en");
    expect(defaultFindAyahLang({ translationLocale: "ar", locale: "en" })).toBe("ar");
  });

  it("starts an Arabic-script reader (Urdu has no index yet) on the Arabic index", () => {
    expect(defaultFindAyahLang({ translationLocale: "ur", locale: "ur" })).toBe("ar");
    expect(defaultFindAyahLang({ translationLocale: "fa", locale: "en" })).toBe("ar");
  });

  it("falls back to English for other languages", () => {
    expect(defaultFindAyahLang({ translationLocale: "fr", locale: "fr" })).toBe("en");
    expect(defaultFindAyahLang({ translationLocale: null, locale: undefined })).toBe("en");
  });
});

describe("FindAyahResultCard (G-09)", () => {
  it("opens the ayah when the body (not just the header) is pressed", async () => {
    const onOpen = jest.fn();
    await renderWithTheme(
      <ReadingTypographyProvider surface="quran">
        <FindAyahResultCard hit={HIT} onOpen={onOpen} onShare={jest.fn()} />
      </ReadingTypographyProvider>,
    );
    await fireEvent.press(screen.getByText(HIT.translation));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("keeps share a sibling of the open target and tags the Arabic as ar", async () => {
    const onOpen = jest.fn();
    const onShare = jest.fn();
    await renderWithTheme(
      <ReadingTypographyProvider surface="quran">
        <FindAyahResultCard hit={HIT} detailed featured onOpen={onOpen} onShare={onShare} />
      </ReadingTypographyProvider>,
    );
    await fireEvent.press(screen.getByLabelText(t("quran.shareAyah")));
    expect(onShare).toHaveBeenCalledTimes(1);
    expect(onOpen).not.toHaveBeenCalled();
    const arabic = screen.getByText(HIT.arabic);
    expect(arabic.props.accessibilityLanguage).toBe("ar");
  });
});

describe("FindAyahNoResults (C-36)", () => {
  it("offers search everywhere and example queries", async () => {
    const onExample = jest.fn();
    await renderWithTheme(<FindAyahNoResults query="zzq" onExample={onExample} />);
    await fireEvent.press(screen.getByText(t("quran.find.searchEverywhere")));
    expect(mockRouter.push).toHaveBeenCalledWith({ pathname: "/search", params: { q: "zzq" } });
    await fireEvent.press(screen.getByText(t("quran.detector.exampleKursi")));
    expect(onExample).toHaveBeenCalledWith("kursi");
  });
});
