import { fireEvent, screen, within } from "@testing-library/react-native";

import { ContentReportContext } from "@/components/content-report/content-report-context";
import type { AyahActionHandlers } from "@/components/quran/ayah-inline-actions";
import {
  AyahRow,
  type AyahRowProps,
  ayahRowPropsAreEqual,
} from "@/components/quran/surah-reader/ayah-row";
import { QuranWordStudyProviders } from "@/components/quran/word-by-word";
import { buildAyah } from "@/test-support/fixtures/quran";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

const ARABIC = "إِذَا ٱلسَّمَآءُ ٱنشَقَّتْ";
const TRANSLATION = "When the sky has split open";
const mockOpenReport = jest.fn();

async function renderRow(overrides: Partial<AyahRowProps> = {}) {
  const props: AyahRowProps = {
    ayah: buildAyah({ surah: 84, ayah: 21, arabic: ARABIC }),
    index: 20,
    surahNumber: 84,
    translation: TRANSLATION,
    translationDir: "ltr",
    isBookmarked: false,
    arabicSize: 28,
    translitSize: 14,
    translationSize: 16,
    secondTranslationDir: "ltr",
    onPlayAtIndex: jest.fn(),
    onBookmarkAyah: jest.fn(),
    onShareAyah: jest.fn(),
    isSharing: false,
    isGesturePending: false,
    onOpenActions: jest.fn(),
    ...overrides,
  };
  await renderWithTheme(
    <ContentReportContext.Provider value={{ openReport: mockOpenReport }}>
      <AyahRow {...props} />
    </ContentReportContext.Provider>,
  );
  return props;
}

/** Host text nodes of the row in render (= reading) order. */
function rowTexts() {
  return within(screen.getByTestId("ayah-row-21"))
    .getAllByText(/./)
    .map((node) => node.props.children);
}

describe("AyahRow (P5-28)", () => {
  it("renders exactly four inline actions in the fixed order Play · Save · Share · More", async () => {
    await renderRow();
    const labels = within(screen.getByTestId("ayah-row-actions"))
      .getAllByRole("button")
      .map((node) => node.props.accessibilityLabel);
    expect(labels).toEqual([
      "Play ayah 21",
      "Save ayah",
      "Share verse",
      "More actions for ayah 21",
    ]);
  });

  it("reads the Arabic first, tagged as Arabic, then the translation, then the actions", async () => {
    await renderRow();
    const texts = rowTexts();
    expect(texts[0]).toBe(ARABIC);
    expect(texts.indexOf(TRANSLATION)).toBeGreaterThan(0);
    expect(screen.getByText(ARABIC).props.accessibilityLanguage).toBe("ar");
  });

  it("speaks the ayah badge as “Ayah N”", async () => {
    await renderRow();
    expect(screen.getByLabelText("Ayah 21")).toBeTruthy();
  });

  it("labels a sajda ayah in words, not with the ۩ sign alone", async () => {
    await renderRow({ ayah: buildAyah({ surah: 84, ayah: 21, arabic: ARABIC, sajda: true }) });
    expect(screen.getByTestId("ayah-sajda-pill").props.accessibilityLabel).toBe("Sajda ayah");
  });

  it("shows the hifz status as text", async () => {
    await renderRow({ hifzStatus: "review" });
    expect(screen.getByText("Needs review")).toBeTruthy();
  });

  it("wires each inline action", async () => {
    const props = await renderRow();
    await fireEvent.press(screen.getByLabelText("Play ayah 21"));
    await fireEvent.press(screen.getByLabelText("Save ayah"));
    await fireEvent.press(screen.getByLabelText("Share verse"));
    await fireEvent.press(screen.getByLabelText("More actions for ayah 21"));
    expect(props.onPlayAtIndex).toHaveBeenCalledWith(20);
    expect(props.onBookmarkAyah).toHaveBeenCalledWith(84, 21);
    expect(props.onShareAyah).toHaveBeenCalledWith(ARABIC, TRANSLATION, 84, 21, undefined);
    expect(props.onOpenActions).toHaveBeenCalledWith(20);
  });

  it("marks a saved ayah in words and state", async () => {
    await renderRow({ isBookmarked: true });
    const save = screen.getByLabelText("Remove from saved");
    expect(save.props.accessibilityState).toMatchObject({ selected: true });
    expect(screen.getByText("Saved")).toBeTruthy();
  });

  it("gives the play button the shared PlayButton states: pause while playing, busy while buffering (C-12)", async () => {
    const props: AyahRowProps = {
      ayah: buildAyah({ surah: 84, ayah: 21, arabic: ARABIC }),
      index: 20,
      surahNumber: 84,
      translation: TRANSLATION,
      translationDir: "ltr",
      isBookmarked: false,
      arabicSize: 28,
      translitSize: 14,
      translationSize: 16,
      secondTranslationDir: "ltr",
      onPlayAtIndex: jest.fn(),
      onBookmarkAyah: jest.fn(),
      onShareAyah: jest.fn(),
      isSharing: false,
      isGesturePending: false,
      onOpenActions: jest.fn(),
    };
    const tree = (playing: boolean, buffering: boolean) => (
      <QuranWordStudyProviders
        wordAudioEnabled={false}
        playingAyah={21}
        audioIsPlaying={playing}
        audioIsBuffering={buffering}
        activeWordIndex={null}
      >
        <AyahRow {...props} />
      </QuranWordStudyProviders>
    );
    const view = await renderWithTheme(tree(true, false));
    expect(screen.getByLabelText("Pause verse").props.accessibilityState).toMatchObject({
      selected: true,
    });
    await view.rerender(tree(false, true));
    const actions = within(screen.getByTestId("ayah-row-actions")).getAllByRole("button");
    expect(actions[0]?.props.accessibilityState).toMatchObject({ busy: true });
  });

  describe("inline More (phones / web)", () => {
    function handlers(): AyahActionHandlers {
      return {
        surahNumber: 84,
        locale: "en",
        onTafsir: jest.fn(),
        onHifz: jest.fn(),
        onPractise: jest.fn(),
        onCheckRecitation: jest.fn(),
        onNote: jest.fn(),
        onHighlight: jest.fn(),
      };
    }

    it("More toggles this ayah inline instead of opening the sheet", async () => {
      const actionHandlers = handlers();
      const onToggleExpanded = jest.fn();
      const props = await renderRow({ actionHandlers, onToggleExpanded });
      expect(screen.queryByTestId("ayah-inline-actions")).toBeNull();
      await fireEvent.press(screen.getByLabelText("More actions for ayah 21"));
      expect(onToggleExpanded).toHaveBeenCalledWith(21);
      expect(props.onOpenActions).not.toHaveBeenCalled();
    });

    it("expanded: shows the rest of the actions in order and More becomes Less", async () => {
      const actionHandlers = handlers();
      const onToggleExpanded = jest.fn();
      await renderRow({ actionHandlers, onToggleExpanded, expanded: true, hifzStatus: "review" });
      const row = screen.getByTestId("ayah-inline-actions");
      const labels = within(row)
        .getAllByRole("button")
        .map((node) => node.props.accessibilityLabel);
      expect(labels).toEqual([
        "Open tafsir for this ayah",
        "Write a note on ayah 84:21",
        "Highlight ayah 84:21",
        expect.any(String),
        "Practice ayah 21",
        "Check my recitation of ayah 21",
        "Report an issue",
      ]);
      expect(screen.getByText("Less")).toBeTruthy();
      await fireEvent.press(within(row).getByLabelText("Open tafsir for this ayah"));
      await fireEvent.press(within(row).getByLabelText("Practice ayah 21"));
      await fireEvent.press(within(row).getByLabelText("Check my recitation of ayah 21"));
      expect(actionHandlers.onTafsir).toHaveBeenCalledWith(21);
      expect(actionHandlers.onPractise).toHaveBeenCalledWith(21);
      expect(actionHandlers.onCheckRecitation).toHaveBeenCalledWith(21);
      await fireEvent.press(screen.getByLabelText("Fewer actions for ayah 21"));
      expect(onToggleExpanded).toHaveBeenCalledWith(21);
    });

    it("hides practise / check where they are unavailable", async () => {
      const actionHandlers = {
        ...handlers(),
        onPractise: undefined,
        onCheckRecitation: undefined,
      };
      await renderRow({ actionHandlers, onToggleExpanded: jest.fn(), expanded: true });
      expect(screen.queryByLabelText("Practice ayah 21")).toBeNull();
      expect(screen.queryByLabelText("Check my recitation of ayah 21")).toBeNull();
      expect(screen.getByLabelText("Open tafsir for this ayah")).toBeTruthy();
    });

    it("re-renders a memoised row only when its own expanded flag changes", () => {
      const base = {
        ayah: buildAyah({ surah: 84, ayah: 21, arabic: ARABIC }),
        index: 20,
        surahNumber: 84,
        translation: TRANSLATION,
        translationDir: "ltr",
        isBookmarked: false,
        arabicSize: 28,
        translitSize: 14,
        translationSize: 16,
        secondTranslationDir: "ltr",
        onPlayAtIndex: jest.fn(),
        onBookmarkAyah: jest.fn(),
        onShareAyah: jest.fn(),
        isSharing: false,
        isGesturePending: false,
        onOpenActions: jest.fn(),
        onToggleExpanded: jest.fn(),
        actionHandlers: handlers(),
        expanded: false,
      } satisfies AyahRowProps;
      expect(ayahRowPropsAreEqual(base, { ...base })).toBe(true);
      expect(ayahRowPropsAreEqual(base, { ...base, expanded: true })).toBe(false);
      expect(ayahRowPropsAreEqual(base, { ...base, actionHandlers: handlers() })).toBe(false);
    });
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("has no inline actions; the card speaks the scripture and opens the action sheet", async () => {
      const props = await renderRow({
        expanded: true,
        onToggleExpanded: jest.fn(),
        actionHandlers: {
          surahNumber: 84,
          locale: "en",
          onTafsir: jest.fn(),
          onHifz: jest.fn(),
          onNote: jest.fn(),
          onHighlight: jest.fn(),
        },
      });
      expect(screen.queryByTestId("ayah-inline-actions")).toBeNull();
      expect(screen.queryByTestId("ayah-row-actions")).toBeNull();
      const card = screen.getByRole("button");
      expect(card.props.accessibilityLabel).toBe(`84:21, ${ARABIC}. ${TRANSLATION}`);
      expect(card.props.accessibilityHint).toBe("Opens actions");
      await fireEvent.press(card);
      expect(props.onOpenActions).toHaveBeenCalledWith(20);
    });
  });
});
