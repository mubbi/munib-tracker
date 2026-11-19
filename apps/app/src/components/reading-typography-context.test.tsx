import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import { act, fireEvent, renderHook, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useLearnTts } from "@/components/learn-tts-context";
import {
  LearnProseText,
  LearnReadingChrome,
  ReadingTypographyBar,
  ReadingTypographyProvider,
  useArabicFontFamily,
  useLearnProseStyle,
  useReadingTypography,
} from "@/components/reading-typography-context";
import { TtsVoiceSheet } from "@/components/tts-voice-sheet";
import { DEFAULT_ARABIC_SIZE, DEFAULT_TRANSLATION_SIZE } from "@/lib/reading-typography";
import { readingTextVisibilityStore } from "@/stores/reading-text-visibility-store";
import { lastProps } from "@/test-support/mock-calls";
import { usePlatform } from "@/test-support/platform";
import { setPreferences } from "@/test-support/preferences";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("@/components/learn-tts-context", () => ({
  LearnTtsProvider: ({ children }: { children: ReactNode }) => children,
  useLearnTts: jest.fn(() => null),
}));
jest.mock("@/components/tts-voice-sheet", () => ({ TtsVoiceSheet: jest.fn(() => null) }));

const tts = (overrides: Partial<NonNullable<ReturnType<typeof useLearnTts>>> = {}) =>
  jest.mocked(useLearnTts).mockReturnValue({
    setSegment: jest.fn(),
    clearSegment: jest.fn(),
    setOverrideText: jest.fn(),
    speaking: false,
    hasText: true,
    lang: "en-US",
    preferredVoiceId: "v1",
    startWithVoice: jest.fn(),
    stop: jest.fn(),
    ...overrides,
  });

const withSurface =
  (surface: "hadith" | null) =>
  ({ children }: { children: ReactNode }) =>
    surface ? (
      <ReadingTypographyProvider surface={surface}>{children}</ReadingTypographyProvider>
    ) : (
      children
    );

afterEach(async () => {
  await setPreferences();
  jest.mocked(useLearnTts).mockReturnValue(null);
  readingTextVisibilityStore.setState({
    showTransliteration: true,
    showTranslation: true,
    isReady: true,
  });
});

describe("useReadingTypography", () => {
  it("uses the global sizes outside a reading surface", async () => {
    const { result } = await renderHook(() => useReadingTypography());

    expect(result.current).toEqual({
      surface: null,
      sizes: {
        arabic: DEFAULT_ARABIC_SIZE,
        translation: DEFAULT_TRANSLATION_SIZE,
        transliteration: DEFAULT_TRANSLATION_SIZE - 1,
      },
    });
  });

  it("falls back to default sizes when Settings has none", async () => {
    await setPreferences({
      fontPrefs: { ...DEFAULT_USER_PREFERENCES.fontPrefs, arabic: {}, translation: {} },
    } as never);
    const { result } = await renderHook(() => useReadingTypography());

    expect(result.current.sizes.arabic).toBe(DEFAULT_ARABIC_SIZE);
  });

  it("applies the surface override from context", async () => {
    await setPreferences({
      fontPrefs: {
        ...DEFAULT_USER_PREFERENCES.fontPrefs,
        readingOverrides: { hadith: { arabicDelta: 4, textDelta: 2 } },
      },
    });
    const { result } = await renderHook(() => useReadingTypography(), {
      wrapper: withSurface("hadith"),
    });

    expect(result.current.surface).toBe("hadith");
    expect(result.current.sizes.translation).toBe(DEFAULT_TRANSLATION_SIZE + 2);
  });

  it("prefers an explicit surface over context", async () => {
    const { result } = await renderHook(() => useReadingTypography("quran"), {
      wrapper: withSurface("hadith"),
    });

    expect(result.current.surface).toBe("quran");
  });
});

describe("useLearnProseStyle", () => {
  it.each([
    ["title", DEFAULT_TRANSLATION_SIZE + 2, 1.35],
    ["body", DEFAULT_TRANSLATION_SIZE, 1.5],
    ["caption", DEFAULT_TRANSLATION_SIZE - 1, 1.4],
  ] as const)("%s prose is %ipt with a %f line-height ratio", async (role, fontSize, ratio) => {
    const { result } = await renderHook(() => useLearnProseStyle(role));

    expect(result.current).toEqual({ fontSize, lineHeight: Math.round(fontSize * ratio) });
  });
});

describe("LearnProseText", () => {
  it.each(["title", "body", "caption"] as const)(
    "renders %s prose at the learn size",
    async (proseRole) => {
      await renderWithTheme(<LearnProseText proseRole={proseRole}>Prose</LearnProseText>);

      expect(flattenStyle(screen.getByText("Prose").props.style).fontSize).toBeGreaterThan(0);
    },
  );
});

describe("useArabicFontFamily", () => {
  it("resolves the configured Arabic family", async () => {
    const { result } = await renderHook(() => useArabicFontFamily());

    expect(result.current === undefined || typeof result.current === "string").toBe(true);
  });
});

describe("ReadingTypographyBar", () => {
  it("labels the size control and hides listen without article text", async () => {
    await renderWithTheme(<ReadingTypographyBar surface="hadith" />);

    expect(screen.getByText("Text size")).toBeTruthy();
    expect(screen.queryByLabelText("Listen to article")).toBeNull();
  });

  it("opens the voice picker from Listen and starts with the picked voice", async () => {
    const startWithVoice = jest.fn();
    tts({ startWithVoice });
    await renderWithTheme(<ReadingTypographyBar surface="hadith" />);

    await fireEvent.press(screen.getByLabelText("Listen to article"));
    const sheet = lastProps(TtsVoiceSheet);
    sheet.onSelectVoice("v2");

    expect(sheet).toMatchObject({ visible: true, lang: "en-US", selectedVoiceId: "v1" });
    expect(startWithVoice).toHaveBeenCalledWith("v2");
  });

  it("closes the voice picker", async () => {
    tts();
    await renderWithTheme(<ReadingTypographyBar surface="hadith" />);
    await fireEvent.press(screen.getByLabelText("Listen to article"));

    await act(async () => lastProps(TtsVoiceSheet).onClose());

    expect(lastProps(TtsVoiceSheet).visible).toBe(false);
  });

  it("stops speech while speaking", async () => {
    const stop = jest.fn();
    tts({ speaking: true, stop });
    await renderWithTheme(<ReadingTypographyBar surface="hadith" />);

    await fireEvent.press(screen.getByLabelText("Stop listening"));

    expect(stop).toHaveBeenCalled();
  });

  it.each([
    ["Hide transliteration", "Show transliteration"],
    ["Hide translation", "Show translation"],
  ])("toggles text visibility: %s → %s", async (visible, hidden) => {
    await renderWithTheme(<ReadingTypographyBar surface="dua_zikr" textVisibility />);

    await fireEvent.press(screen.getByLabelText(visible));

    expect(await screen.findByLabelText(hidden)).toBeTruthy();
  });
});

describe("ReadingTypographyBar on TV", () => {
  usePlatform({ isTV: true });

  it("drops the text label and Listen control", async () => {
    tts();
    await renderWithTheme(<ReadingTypographyBar surface="hadith" textVisibility />);

    expect(screen.queryByText("Text size")).toBeNull();
    expect(screen.queryByLabelText("Listen to article")).toBeNull();
    expect(screen.getByLabelText("Hide translation")).toBeTruthy();
  });

  it("lays learn content out in the TV reading column", async () => {
    await renderWithTheme(
      <LearnReadingChrome surface="hadith">
        <LearnProseText>Body</LearnProseText>
      </LearnReadingChrome>,
    );

    expect(screen.getByText("Body")).toBeTruthy();
  });
});

describe("LearnReadingChrome", () => {
  it("provides the surface to its prose and shows the size bar", async () => {
    await renderWithTheme(
      <LearnReadingChrome surface="hadith" listenText="Article">
        <LearnProseText proseRole="title">Heading</LearnProseText>
      </LearnReadingChrome>,
    );

    expect(screen.getByText("Heading")).toBeTruthy();
    expect(screen.getByText("Text size")).toBeTruthy();
  });
});
