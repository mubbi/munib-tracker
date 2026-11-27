import { fireEvent, screen } from "@testing-library/react-native";

import { AyahActionSheet } from "@/components/quran/ayah-action-sheet";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

// The shared sheet mock skips `title`; this one renders it so the sheet's heading is testable.
jest.mock("@/components/ui/sheet", () => {
  const { createElement } = require("react");
  const { Text, View } = require("react-native");
  return {
    __esModule: true,
    Sheet: ({
      visible,
      title,
      children,
    }: {
      visible: boolean;
      title?: string;
      children: unknown;
    }) =>
      visible
        ? createElement(
            View,
            { testID: "sheet" },
            title ? createElement(Text, null, title) : null,
            children,
          )
        : null,
  };
});

jest.mock("@/components/content-report/content-report-button", () => {
  const { createElement } = require("react");
  const { View } = require("react-native");
  return {
    ContentReportButton: ({ contentRef }: { contentRef: { contentId: string } }) =>
      createElement(View, { testID: `report-${contentRef.contentId}` }),
  };
});

type Props = Parameters<typeof AyahActionSheet>[0];

async function renderSheet(overrides: Partial<Props> = {}) {
  const props: Props = {
    visible: true,
    surah: 2,
    ayah: 255,
    isBookmarked: false,
    isPlaying: false,
    onPlay: jest.fn(),
    onBookmark: jest.fn(),
    onShare: jest.fn(),
    onClose: jest.fn(),
    ...overrides,
  };
  await renderWithTheme(<AyahActionSheet {...props} />);
  return props;
}

describe("AyahActionSheet", () => {
  it("titles a bare ayah by its reference", async () => {
    await renderSheet();
    expect(screen.getAllByText("2:255")).toHaveLength(2);
  });

  it("titles by surah name with juz and English name in the meta line", async () => {
    await renderSheet({ surahName: "Al-Baqarah", surahNameEnglish: "The Cow", juz: 3 });
    expect(screen.getByText("Al-Baqarah 255")).toBeTruthy();
    expect(screen.getByText("2:255 · Juz 3 · The Cow")).toBeTruthy();
  });

  it("shows the ayah body texts", async () => {
    await renderSheet({
      arabic: "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ",
      transliteration: "Allahu la ilaha illa huwa",
      translation: "Allah — there is no deity except Him",
      secondTranslation: "اللہ، اس کے سوا کوئی معبود نہیں",
      translationDir: "rtl",
      secondTranslationDir: "rtl",
    });
    expect(screen.getByText("ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ")).toBeTruthy();
    expect(screen.getByText("Allahu la ilaha illa huwa")).toBeTruthy();
    expect(screen.getByText("Allah — there is no deity except Him")).toBeTruthy();
    expect(screen.getByText("اللہ، اس کے سوا کوئی معبود نہیں")).toBeTruthy();
  });

  it.each([
    ["ltr", "ltr"],
    ["rtl", "rtl"],
  ] as const)("lays out %p translations", async (dir, writingDirection) => {
    await renderSheet({
      translation: "Translation",
      secondTranslation: "Second",
      translationDir: dir === "rtl" ? "rtl" : undefined,
      secondTranslationDir: dir === "rtl" ? "rtl" : undefined,
    });
    for (const text of ["Translation", "Second"]) {
      const style = flattenStyle(screen.getByText(text).props.style);
      expect(style.writingDirection ?? "ltr").toBe(writingDirection);
    }
  });

  it.each([
    [false, "Play ayah 255", "Play"],
    [true, "Pause verse", "Pause"],
  ])("plays or pauses (isPlaying=%p)", async (isPlaying, label, text) => {
    const props = await renderSheet({ isPlaying });
    expect(screen.getByText(text)).toBeTruthy();
    await fireEvent.press(screen.getByLabelText(label));
    expect(props.onPlay).toHaveBeenCalled();
  });

  it.each([
    [false, "Save ayah", "Save"],
    [true, "Remove from saved", "Saved"],
  ])("toggles the bookmark (isBookmarked=%p)", async (isBookmarked, label, text) => {
    const props = await renderSheet({ isBookmarked });
    expect(screen.getByText(text)).toBeTruthy();
    await fireEvent.press(screen.getByLabelText(label));
    expect(props.onBookmark).toHaveBeenCalled();
  });

  it.each([
    [undefined, "Mark needs review", "Hifz"],
    ["review", "Mark memorized", "Review"],
    ["memorized", "Clear memorization", "Done"],
  ] as const)("offers the hifz action for status %p", async (hifzStatus, label, text) => {
    const props = await renderSheet({ hifzStatus, onHifz: jest.fn() });
    expect(screen.getByText(text)).toBeTruthy();
    await fireEvent.press(screen.getByLabelText(label));
    expect(props.onHifz).toHaveBeenCalled();
  });

  it("hides optional actions without handlers", async () => {
    await renderSheet();
    expect(screen.queryByText("Hifz")).toBeNull();
    expect(screen.queryByText("Practise")).toBeNull();
    expect(screen.queryByText("Tafsir")).toBeNull();
  });

  it("opens practice", async () => {
    const props = await renderSheet({ onPractise: jest.fn() });
    await fireEvent.press(screen.getByLabelText("Practice ayah 255"));
    expect(props.onPractise).toHaveBeenCalled();
  });

  it("opens tafsir", async () => {
    const props = await renderSheet({ onTafsir: jest.fn() });
    await fireEvent.press(screen.getByLabelText("Open tafsir for this ayah"));
    expect(props.onTafsir).toHaveBeenCalled();
  });

  it("shares", async () => {
    const props = await renderSheet();
    await fireEvent.press(screen.getByLabelText("Share verse"));
    expect(props.onShare).toHaveBeenCalled();
  });

  it.each([
    [{ isGesturePending: true }, "Tap to share"],
    [{ isSharing: true }, "Sharing…"],
  ])("labels the share state %j", async (overrides, text) => {
    await renderSheet(overrides);
    expect(screen.getByText(text)).toBeTruthy();
  });

  it("shows the report button when given a report ref", async () => {
    await renderSheet({ reportRef: { contentId: "255" } as Props["reportRef"] });
    expect(screen.getByTestId("report-255")).toBeTruthy();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("hides share", async () => {
      await renderSheet();
      expect(screen.queryByLabelText("Share verse")).toBeNull();
    });
  });
});
