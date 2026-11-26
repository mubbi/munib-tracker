import { hashAyahText } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, screen } from "@testing-library/react-native";

import {
  AnnotatedAyahText,
  AyahNoteActions,
  AyahNoteMarker,
} from "@/components/quran/ayah-annotations";
import { QuranNotesSheetHost } from "@/components/quran/quran-notes-sheet-host";
import { getSurahAyahs } from "@/lib/quran";
import {
  closeQuranNoteEditor,
  openQuranNoteEditor,
  quranNotesStore,
} from "@/stores/quran-notes-store";
import { mockToast } from "@/test-support/mocks/toast-provider";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

// Shared sheet mock + the visible `title` heading the real Sheet draws.
jest.mock("@/components/ui/sheet", () => {
  const { createElement } = require("react");
  const { Text } = require("react-native");
  const { sheetMock } = require("@/test-support/mocks/sheet");
  return {
    __esModule: true,
    Sheet: ({ title, children, ...props }: { title?: string; children?: unknown }) =>
      createElement(
        sheetMock.Sheet,
        props,
        title ? createElement(Text, null, title) : null,
        children,
      ),
  };
});
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);

const AYAH_TEXT = getSurahAyahs(1)[1]?.arabic ?? "";

async function save(body: string, extra: Record<string, unknown> = {}) {
  await act(async () => {
    await quranNotesStore.getState().save({ surah: 1, ayah: 2, body, tags: [], ...extra });
  });
}

beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
  await act(async () => {
    await quranNotesStore.getState().load();
  });
  closeQuranNoteEditor();
});

describe("reader annotations (ayah mode)", () => {
  it("tints a highlighted ayah and shows the note glyph only for written notes", async () => {
    await renderWithTheme(
      <>
        <AyahNoteMarker surah={1} ayah={2} ayahText={AYAH_TEXT} />
        <AnnotatedAyahText surah={1} ayah={2} text={AYAH_TEXT} fontSize={26} />
      </>,
    );
    expect(screen.queryByTestId("ayah-note-marker")).toBeNull();
    expect(screen.queryByTestId("annotated-ayah-tint")).toBeNull();

    await act(async () => {
      await quranNotesStore.getState().setAyahHighlight(1, 2, "green");
    });
    expect(screen.getByTestId("annotated-ayah-tint")).toBeTruthy();
    expect(
      flattenStyle(screen.getByTestId("annotated-ayah-tint").props.style).backgroundColor,
    ).toMatch(/^#/);
    // Highlight-only: no "My note" glyph.
    expect(screen.queryByTestId("ayah-note-marker")).toBeNull();

    await save("Praise belongs to Allah alone");
    expect(screen.getByTestId("ayah-note-marker")).toBeTruthy();
  });

  it("draws a word span inline while the bundled text is unchanged", async () => {
    await save("", {
      color: "rose",
      words: { start: 1, end: 2 },
      textHash: hashAyahText(AYAH_TEXT),
    });
    await renderWithTheme(<AnnotatedAyahText surah={1} ayah={2} text={AYAH_TEXT} fontSize={26} />);
    expect(screen.getByTestId("annotated-ayah-spans")).toBeTruthy();
    expect(screen.queryByTestId("annotated-ayah-tint")).toBeNull();
  });

  it("marks a whole-ayah written note with a bar on the Arabic's starting edge", async () => {
    await renderWithTheme(<AnnotatedAyahText surah={1} ayah={2} text={AYAH_TEXT} fontSize={26} />);
    expect(screen.queryByTestId("annotated-ayah-note")).toBeNull();
    await save("A whole-ayah reflection");
    const bar = flattenStyle(screen.getByTestId("annotated-ayah-note").props.style);
    // LTR UI: the logical end is the right edge, where the Arabic begins.
    expect(bar.borderEndWidth).toBeGreaterThan(0);
    expect(bar.borderStartWidth).toBeUndefined();
    expect(String(bar.borderColor)).toMatch(/^#/);
  });

  it("does not draw the ayah bar for a word-span note (the words carry the mark)", async () => {
    await save("On these words", {
      words: { start: 1, end: 2 },
      textHash: hashAyahText(AYAH_TEXT),
    });
    await renderWithTheme(<AnnotatedAyahText surah={1} ayah={2} text={AYAH_TEXT} fontSize={26} />);
    expect(screen.getByTestId("annotated-ayah-spans")).toBeTruthy();
    expect(screen.queryByTestId("annotated-ayah-note")).toBeNull();
  });

  it("falls back to an ayah tint when the span's text hash is stale", async () => {
    await save("", { color: "rose", words: { start: 1, end: 2 }, textHash: hashAyahText("old") });
    await renderWithTheme(<AnnotatedAyahText surah={1} ayah={2} text={AYAH_TEXT} fontSize={26} />);
    expect(screen.queryByTestId("annotated-ayah-spans")).toBeNull();
    expect(screen.getByTestId("annotated-ayah-tint")).toBeTruthy();
  });
});

describe("note editor sheet (phone)", () => {
  it("opens from the Note action, saves offline and appears immediately", async () => {
    await renderWithTheme(
      <>
        <AyahNoteActions surah={1} ayah={2} />
        <QuranNotesSheetHost />
      </>,
    );
    await fireEvent.press(screen.getByLabelText("Write a note on ayah 1:2"));
    expect(screen.getByText("My note")).toBeTruthy();
    expect(screen.getByText("Your own reflection — not tafsir.")).toBeTruthy();
    await fireEvent.changeText(screen.getByTestId("ayah-note-body"), "یہ آیت شکر سکھاتی ہے");
    // RTL text gets an RTL writing direction automatically.
    expect(flattenStyle(screen.getByTestId("ayah-note-body").props.style).writingDirection).toBe(
      "rtl",
    );
    await fireEvent.changeText(screen.getByTestId("ayah-note-tag-input"), "Shukr,");
    await fireEvent.press(screen.getByTestId("annotation-swatch-gold"));
    await fireEvent.press(screen.getByText("Save note"));
    const [note] = quranNotesStore.getState().index.live;
    expect(note).toMatchObject({
      surah: 1,
      ayah: 2,
      body: "یہ آیت شکر سکھاتی ہے",
      tags: ["shukr"],
      color: "gold",
    });
    expect(mockToast.success).toHaveBeenCalledWith("Note saved");
  });

  it("highlight sheet sets and clears a whole-ayah colour", async () => {
    await renderWithTheme(<QuranNotesSheetHost />);
    await act(async () => openQuranNoteEditor({ mode: "highlight", surah: 1, ayah: 2 }));
    await fireEvent.press(screen.getByTestId("annotation-swatch-violet"));
    expect(quranNotesStore.getState().index.live[0]?.color).toBe("violet");
    await act(async () => openQuranNoteEditor({ mode: "highlight", surah: 1, ayah: 2 }));
    await fireEvent.press(screen.getByTestId("annotation-swatch-clear"));
    expect(quranNotesStore.getState().index.live).toHaveLength(0);
  });
});

describe("TV is read-only", () => {
  usePlatform({ isTV: true });

  it("hides Note/Highlight actions and opens a viewer instead of the editor", async () => {
    await save("Read me on TV", { tags: ["tv"] });
    await renderWithTheme(
      <>
        <AyahNoteActions surah={1} ayah={2} />
        <AyahNoteMarker surah={1} ayah={2} ayahText={AYAH_TEXT} />
        <QuranNotesSheetHost />
      </>,
    );
    expect(screen.queryByText("Note")).toBeNull();
    expect(screen.queryByText("Highlight")).toBeNull();
    expect(screen.getByTestId("ayah-note-marker")).toBeTruthy();
    await act(async () => openQuranNoteEditor({ mode: "note", surah: 1, ayah: 2 }));
    expect(screen.getByText("Read me on TV")).toBeTruthy();
    expect(screen.queryByTestId("ayah-note-body")).toBeNull();
    expect(screen.queryByText("Save note")).toBeNull();
  });
});
