import { fireEvent, screen, within } from "@testing-library/react-native";

import { AyahRow, type AyahRowProps } from "@/components/quran/surah-reader/ayah-row";
import { QuranWordStudyProviders } from "@/components/quran/word-by-word";
import { buildAyah } from "@/test-support/fixtures/quran";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

const ARABIC = "إِذَا ٱلسَّمَآءُ ٱنشَقَّتْ";
const TRANSLATION = "When the sky has split open";

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
  await renderWithTheme(<AyahRow {...props} />);
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

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("has no inline actions; the card speaks the scripture and opens the action sheet", async () => {
      const props = await renderRow();
      expect(screen.queryByTestId("ayah-row-actions")).toBeNull();
      const card = screen.getByRole("button");
      expect(card.props.accessibilityLabel).toBe(`84:21, ${ARABIC}. ${TRANSLATION}`);
      expect(card.props.accessibilityHint).toBe("Opens actions");
      await fireEvent.press(card);
      expect(props.onOpenActions).toHaveBeenCalledWith(20);
    });
  });
});
