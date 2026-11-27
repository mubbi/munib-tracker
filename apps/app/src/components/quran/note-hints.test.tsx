import { hashAyahText } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, screen } from "@testing-library/react-native";
import { AyahActionSheet } from "@/components/quran/ayah-action-sheet";
import { AnnotatedAyahText, AyahNoteMarker } from "@/components/quran/ayah-annotations";
import { MushafLineRenderer } from "@/components/quran/mushaf-line-renderer";
import { TvNoteFocusPreview } from "@/components/quran/note-hints";
import { PageLayoutRenderer } from "@/components/quran/page-layout-renderer";
import { QuranNotesSheetHost } from "@/components/quran/quran-notes-sheet-host";
import { panelWindow, QuranNotesSidePanel } from "@/components/quran/quran-notes-side-panel";
import { useQcfPageFont } from "@/hooks/use-qcf-page-font";
import { getPageLayout, getSurahAyahs } from "@/lib/quran";
import {
  closeQuranNoteEditor,
  closeQuranNotePeek,
  openQuranNotePeek,
  quranNoteEditorStore,
  quranNotePeekStore,
  quranNotesStore,
  setQuranReaderViewport,
} from "@/stores/quran-notes-store";
import { pressWebKey, resetWebKeyHandlerMock } from "@/test-support/mocks/web-key-handler";
import { setPlatform, usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock("@/hooks/use-web-key-handler", () => ({
  ...require("@/test-support/mocks/web-key-handler").webKeyHandlerMock,
  useWebKeyHandler: () => {},
}));
jest.mock("@/hooks/use-qcf-page-font", () => ({ useQcfPageFont: jest.fn() }));
jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/content-report/content-report-button", () => ({
  ContentReportButton: () => null,
}));

const AYAH_2 = getSurahAyahs(1)[1]?.arabic ?? "";

async function saveNote(extra: Record<string, unknown>) {
  let id = "";
  await act(async () => {
    const result = await quranNotesStore
      .getState()
      .save({ surah: 1, ayah: 2, body: "", tags: [], ...extra });
    if (result.ok) id = result.note.id;
  });
  return id;
}

/** Desktop web with a mouse: `matchMedia("(hover: hover) and (pointer: fine)")` matches. */
function useFinePointerWeb() {
  let restore: () => void = () => {};
  beforeEach(() => {
    restore = setPlatform({ OS: "web" });
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: jest.fn(() => ({
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });
  });
  afterEach(() => {
    restore();
    delete (window as { matchMedia?: unknown }).matchMedia;
  });
}

beforeEach(async () => {
  jest.clearAllMocks();
  resetWebKeyHandlerMock();
  jest
    .mocked(useQcfPageFont)
    .mockReturnValue({ ready: true, fontFamily: "QCF_P001", basmalaFontFamily: "QCF_BSML" });
  await AsyncStorage.clear();
  await act(async () => {
    await quranNotesStore.getState().load();
  });
  closeQuranNoteEditor();
  closeQuranNotePeek();
  setQuranReaderViewport(null);
});

describe("note hints on phones", () => {
  usePlatform({ OS: "android" });

  it("marker announces the note and a tap opens a compact peek with Open note", async () => {
    const id = await saveNote({ body: "Gratitude first\nThen patience.", tags: ["shukr"] });
    await renderWithTheme(
      <>
        <AyahNoteMarker surah={1} ayah={2} ayahText={AYAH_2} />
        <QuranNotesSheetHost />
      </>,
    );
    const marker = screen.getByLabelText("My note on 1:2: Gratitude first");
    expect(marker.props.accessibilityHint).toBe(
      "Tap to preview the note. Long-press for more actions.",
    );
    await fireEvent.press(marker);
    expect(screen.getByTestId("note-peek-sheet")).toBeTruthy();
    expect(screen.getByText("Gratitude first")).toBeTruthy();
    expect(screen.getByText("Then patience.")).toBeTruthy();
    expect(screen.getByText("#shukr")).toBeTruthy();
    // The editor is not opened by the peek itself.
    expect(screen.queryByTestId("ayah-note-body")).toBeNull();

    await fireEvent.press(screen.getByText("Open note"));
    expect(quranNotePeekStore.getState().target).toBeNull();
    expect(quranNoteEditorStore.getState().target).toMatchObject({ noteId: id, mode: "note" });
    expect(screen.getByTestId("ayah-note-body").props.value).toBe(
      "Gratitude first\nThen patience.",
    );
  });

  it("long-press shows the note's actions (Material contextual sheet)", async () => {
    await saveNote({ body: "Reflection" });
    await renderWithTheme(
      <>
        <AyahNoteMarker surah={1} ayah={2} ayahText={AYAH_2} />
        <QuranNotesSheetHost />
      </>,
    );
    await fireEvent(screen.getByLabelText("My note on 1:2: Reflection"), "longPress");
    expect(screen.getByTestId("note-actions-sheet")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("note-action-highlight"));
    expect(quranNoteEditorStore.getState().target).toMatchObject({ mode: "highlight" });
  });

  it("delete from the actions sheet asks first, then removes the note", async () => {
    await saveNote({ body: "Delete me" });
    await renderWithTheme(<QuranNotesSheetHost />);
    await act(async () => openQuranNotePeek({ surah: 1, ayah: 2, via: "actions" }));
    await fireEvent.press(screen.getByTestId("note-action-delete"));
    expect(screen.getByText("Delete this note?")).toBeTruthy();
    expect(quranNotesStore.getState().index.live).toHaveLength(1);
    await fireEvent.press(screen.getAllByText("Delete").at(-1) as never);
    expect(quranNotesStore.getState().index.live).toHaveLength(0);
  });

  it("underlines the words of a written word-span note (no colour) and taps peek it", async () => {
    const id = await saveNote({
      body: "On these words",
      words: { start: 1, end: 2 },
      textHash: hashAyahText(AYAH_2),
    });
    await renderWithTheme(
      <>
        <AnnotatedAyahText surah={1} ayah={2} text={AYAH_2} fontSize={26} />
        <QuranNotesSheetHost />
      </>,
    );
    const run = screen.getByTestId(`noted-words-${id}`);
    const style = flattenStyle(run.props.style);
    expect(style.textDecorationLine).toBe("underline");
    // Native: solid (iOS draws a dotted underline under Arabic as one tiny dot) plus
    // a faint wash in the underline colour, since RN can't thicken the line.
    expect(style.textDecorationStyle).toBe("solid");
    expect(style.textDecorationColor).toBeTruthy();
    expect(String(style.backgroundColor)).toMatch(/^#[0-9a-f]{8}$/i);
    await fireEvent.press(run);
    expect(quranNotePeekStore.getState().target).toMatchObject({ noteId: id, via: "press" });
    expect(screen.getByText("On these words")).toBeTruthy();
  });
});

describe("note hints on desktop web", () => {
  useFinePointerWeb();

  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("hover shows a preview card after a short delay; click opens; Esc closes", async () => {
    const id = await saveNote({ body: "Hover me", tags: ["a", "b", "c", "d"], color: "blue" });
    await renderWithTheme(
      <>
        <AyahNoteMarker surah={1} ayah={2} ayahText={AYAH_2} />
        <QuranNotesSheetHost />
      </>,
    );
    const marker = screen.getByTestId("ayah-note-marker");
    await fireEvent(marker, "pointerEnter", {
      currentTarget: {
        getBoundingClientRect: () => ({ left: 10, top: 20, width: 30, height: 30 }),
      },
    });
    expect(screen.queryByTestId("note-hover-card")).toBeNull();
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    expect(screen.getByTestId("note-hover-card")).toBeTruthy();
    expect(screen.getByText("Hover me")).toBeTruthy();
    expect(screen.getByText(/#a\s+#b\s+#c\s+\+1/)).toBeTruthy();
    expect(screen.getByText("Click to open · Esc to close")).toBeTruthy();
    expect(quranNotePeekStore.getState().target?.anchor).toEqual({
      x: 10,
      y: 20,
      width: 30,
      height: 30,
    });

    expect(await pressWebKey("Escape")).toBe(true);
    expect(screen.queryByTestId("note-hover-card")).toBeNull();

    await fireEvent.press(screen.getByLabelText("My note on 1:2: Hover me"));
    expect(quranNoteEditorStore.getState().target).toMatchObject({ noteId: id });
  });

  it("pointer leave closes the card unless the pointer moves onto it", async () => {
    await saveNote({ body: "Stay open" });
    await renderWithTheme(
      <>
        <AyahNoteMarker surah={1} ayah={2} ayahText={AYAH_2} />
        <QuranNotesSheetHost />
      </>,
    );
    const marker = screen.getByTestId("ayah-note-marker");
    await fireEvent(marker, "pointerEnter", {});
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    await fireEvent(marker, "pointerLeave");
    await fireEvent(screen.getByTestId("note-hover-card"), "pointerEnter");
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByTestId("note-hover-card")).toBeTruthy();
    await fireEvent(screen.getByTestId("note-hover-card"), "pointerLeave");
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.queryByTestId("note-hover-card")).toBeNull();
  });

  it("keyboard focus shows the card at once and blur hides it", async () => {
    await saveNote({ body: "Focus me" });
    await renderWithTheme(
      <>
        <AyahNoteMarker surah={1} ayah={2} ayahText={AYAH_2} />
        <QuranNotesSheetHost />
      </>,
    );
    const marker = screen.getByTestId("ayah-note-marker");
    await fireEvent(marker, "focus", {});
    expect(screen.getByTestId("note-hover-card")).toBeTruthy();
    expect(screen.getByLabelText("My note on 1:2: Focus me").props.accessibilityHint).toBe(
      "Opens the note",
    );
    await fireEvent(marker, "blur");
    expect(screen.queryByTestId("note-hover-card")).toBeNull();
  });
});

describe("keyboard reach on desktop web", () => {
  useFinePointerWeb();

  it("a noted word run is a Tab stop; focus previews and Enter opens the note", async () => {
    const id = await saveNote({
      body: "Keyboard note",
      words: { start: 1, end: 2 },
      textHash: hashAyahText(AYAH_2),
    });
    await renderWithTheme(
      <>
        <AnnotatedAyahText surah={1} ayah={2} text={AYAH_2} fontSize={26} />
        <QuranNotesSheetHost />
      </>,
    );
    const run = screen.getByTestId(`noted-words-${id}`);
    // Web keeps the dotted underline (browsers draw it under Arabic) and no wash.
    const style = flattenStyle(run.props.style);
    expect(style.textDecorationStyle).toBe("dotted");
    expect(style.backgroundColor).toBeUndefined();
    expect(run.props.focusable).toBe(true);
    // No role: the run stays an inline span so Arabic letters keep joining.
    expect(run.props.accessibilityRole).toBeUndefined();
    await fireEvent(run, "focus", {});
    expect(screen.getByTestId("note-hover-card")).toBeTruthy();
    const preventDefault = jest.fn();
    await fireEvent(run, "keyDown", { key: "Enter", preventDefault });
    expect(preventDefault).toHaveBeenCalled();
    expect(quranNoteEditorStore.getState().target).toMatchObject({ noteId: id });
  });
});

describe("note hints on TV", () => {
  usePlatform({ isTV: true });

  it("shows a read-only preview for the focused card and never the peek / editor", async () => {
    await saveNote({ body: "Read on TV" });
    await renderWithTheme(
      <>
        <TvNoteFocusPreview surah={1} ayah={2} />
        <QuranNotesSheetHost />
      </>,
    );
    expect(screen.getByTestId("tv-note-focus-preview")).toBeTruthy();
    expect(screen.getByText("Read on TV")).toBeTruthy();
    await act(async () => openQuranNotePeek({ surah: 1, ayah: 2, via: "press" }));
    expect(screen.queryByTestId("note-peek-sheet")).toBeNull();
  });

  it("focusing a mushaf line with a note shows the preview over the page foot", async () => {
    await saveNote({ body: "Mushaf TV note" });
    await renderWithTheme(
      <MushafLineRenderer layout={getPageLayout(1)} page={1} showAnnotations />,
    );
    expect(screen.queryByTestId("tv-note-focus-preview")).toBeNull();
    const [line] = screen.getAllByLabelText(/Has my note/);
    await fireEvent(line as never, "focus");
    expect(screen.getByTestId("tv-note-focus-preview")).toBeTruthy();
    expect(screen.getByText("Mushaf TV note")).toBeTruthy();
    await fireEvent(line as never, "blur");
    expect(screen.queryByTestId("tv-note-focus-preview")).toBeNull();
  });

  it("renders nothing for an ayah without a written note", async () => {
    await saveNote({ color: "gold" });
    await renderWithTheme(<TvNoteFocusPreview surah={1} ayah={2} />);
    expect(screen.queryByTestId("tv-note-focus-preview")).toBeNull();
  });
});

describe("mushaf + page hints", () => {
  it("underlines a word-span note's words on a word-exact mushaf page", async () => {
    await saveNote({
      body: "Lord of the worlds",
      words: { start: 1, end: 2 },
      textHash: hashAyahText(AYAH_2),
    });
    await renderWithTheme(
      <MushafLineRenderer layout={getPageLayout(1)} page={1} showAnnotations />,
    );
    const word = screen.getByTestId("mushaf-word-note-1:2:1");
    expect(flattenStyle(word.props.style).textDecorationLine).toBe("underline");
    expect(screen.queryByTestId("mushaf-word-note-1:2:0")).toBeNull();
    expect(screen.getAllByLabelText(/Has my note/).length).toBeGreaterThan(0);
  });

  it("marks the ayah-end rosette for a whole-ayah note", async () => {
    await saveNote({ body: "Whole ayah" });
    await renderWithTheme(
      <MushafLineRenderer layout={getPageLayout(1)} page={1} showAnnotations />,
    );
    expect(screen.getByTestId("mushaf-word-note-1:2:end")).toBeTruthy();
  });

  it("falls back to a whole-line underline on pages without a word map (D24)", async () => {
    const layout = getPageLayout(11);
    const line = layout.lines.find((l) => l.type === "text" && l.verseRange);
    const [start] = (line?.type === "text" ? (line.verseRange ?? "") : "").split("-");
    const [surah, ayah] = (start ?? "").split(":").map(Number);
    await act(async () => {
      await quranNotesStore
        .getState()
        .save({ surah: surah ?? 2, ayah: ayah ?? 1, body: "Fallback", tags: [] });
    });
    await renderWithTheme(<MushafLineRenderer layout={layout} page={11} showAnnotations />);
    expect(screen.queryAllByTestId(/^mushaf-word-note-/)).toHaveLength(0);
    const [noted] = screen.getAllByLabelText(/Has my note/);
    expect(noted).toBeTruthy();
  });

  it("text page: noted ayahs are labelled and underlined", async () => {
    await saveNote({ body: "Page note" });
    await renderWithTheme(
      <PageLayoutRenderer
        ayahs={getSurahAyahs(1)}
        arabicSize={26}
        showTransliteration={false}
        showTranslation={false}
        translationDir="ltr"
        secondTranslationDir="ltr"
        showAnnotations
      />,
    );
    // The label carries the ayah's Arabic between the reference and the note (G-01).
    const noted = screen.getByLabelText(/^1:2, .*, Has my note$/);
    expect(flattenStyle(noted.props.style).textDecorationLine).toBe("underline");
  });
});

describe("ayah action sheet notes", () => {
  it("taps a note to open it and marks Highlight as selected", async () => {
    const id = await saveNote({ body: "Open from sheet", color: "green" });
    const onNote = jest.fn();
    await renderWithTheme(
      <AyahActionSheet
        visible
        surah={1}
        ayah={2}
        isBookmarked={false}
        isPlaying={false}
        onPlay={jest.fn()}
        onBookmark={jest.fn()}
        onShare={jest.fn()}
        onClose={jest.fn()}
        onNote={onNote}
        onHighlight={jest.fn()}
      />,
    );
    await fireEvent.press(screen.getByLabelText("Open my note on 1:2"));
    expect(onNote).toHaveBeenCalledWith(id);
    expect(screen.getByLabelText("Highlight ayah 1:2").props.accessibilityState).toMatchObject({
      selected: true,
    });
  });
});

describe("wide-screen notes panel", () => {
  it("highlights the notes on ayahs in view", async () => {
    const id = await saveNote({ body: "In view note" });
    await act(async () => {
      await quranNotesStore.getState().save({ surah: 1, ayah: 6, body: "Later", tags: [] });
    });
    await renderWithTheme(<QuranNotesSidePanel surah={1} onOpenAyah={jest.fn()} />);
    expect(screen.queryByText("In view")).toBeNull();
    await act(async () => setQuranReaderViewport({ surah: 1, from: 1, to: 3 }));
    expect(screen.getByText("In view")).toBeTruthy();
    expect(screen.getByTestId(`notes-panel-item-${id}`).props.accessibilityState).toMatchObject({
      selected: true,
    });
    await act(async () => setQuranReaderViewport({ surah: 2, from: 1, to: 3 }));
    expect(screen.queryByText("In view")).toBeNull();
  });

  it("panelWindow keeps the first in-view note visible", () => {
    const items = Array.from({ length: 30 }, (_, i) => i);
    expect(panelWindow(items, -1, 20)).toEqual(items.slice(0, 20));
    expect(panelWindow(items, 25, 20)).toEqual(items.slice(10, 30));
    expect(panelWindow(items, 12, 20)).toEqual(items.slice(10, 30));
    expect(panelWindow(items, 3, 20)).toEqual(items.slice(1, 21));
    expect(panelWindow(items.slice(0, 5), 4, 20)).toEqual(items.slice(0, 5));
  });
});
