import { hashAyahText } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, screen } from "@testing-library/react-native";

import { MushafLineRenderer } from "@/components/quran/mushaf-line-renderer";
import { useQcfPageFont } from "@/hooks/use-qcf-page-font";
import { getPageLayout, getSurahAyahs } from "@/lib/quran";
import { quranNotesStore } from "@/stores/quran-notes-store";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("@/hooks/use-qcf-page-font", () => ({ useQcfPageFont: jest.fn() }));

const AYAH_2 = getSurahAyahs(1)[1]?.arabic ?? "";

beforeEach(async () => {
  jest
    .mocked(useQcfPageFont)
    .mockReturnValue({ ready: true, fontFamily: "QCF_P001", basmalaFontFamily: "QCF_BSML" });
  await AsyncStorage.clear();
  await act(async () => {
    await quranNotesStore.getState().load();
  });
});

async function renderPage(page: number, showAnnotations = true) {
  await renderWithTheme(
    <MushafLineRenderer
      layout={getPageLayout(page)}
      page={page}
      showAnnotations={showAnnotations}
    />,
  );
}

describe("mushaf page highlights (spike N1)", () => {
  it("tints exactly the words of a span on a word-exact page", async () => {
    await act(async () => {
      await quranNotesStore.getState().save({
        surah: 1,
        ayah: 2,
        body: "",
        tags: [],
        color: "blue",
        words: { start: 1, end: 2 },
        textHash: hashAyahText(AYAH_2),
      });
    });
    await renderPage(1);
    expect(screen.getByTestId("mushaf-word-tint-1:2:1")).toBeTruthy();
    expect(screen.getByTestId("mushaf-word-tint-1:2:2")).toBeTruthy();
    expect(screen.queryByTestId("mushaf-word-tint-1:2:0")).toBeNull();
    expect(screen.queryByTestId("mushaf-word-tint-1:2:3")).toBeNull();
    expect(
      flattenStyle(screen.getByTestId("mushaf-word-tint-1:2:1").props.style).backgroundColor,
    ).toMatch(/^#/);
  });

  it("tints a whole ayah word by word, end marker included", async () => {
    await act(async () => {
      await quranNotesStore.getState().setAyahHighlight(1, 3, "gold");
    });
    await renderPage(1);
    expect(screen.getByTestId("mushaf-word-tint-1:3:0")).toBeTruthy();
    expect(screen.getByTestId("mushaf-word-tint-1:3:end")).toBeTruthy();
  });

  it("falls back to a line tint on a page that does not map word-exactly (D24)", async () => {
    // Page 11 is one of the spike's fallback pages.
    const layout = getPageLayout(11);
    const line = layout.lines.find((l) => l.type === "text" && l.verseRange);
    const [start] = (line?.type === "text" ? (line.verseRange ?? "") : "").split("-");
    const [surah, ayah] = (start ?? "").split(":").map(Number);
    await act(async () => {
      await quranNotesStore.getState().setAyahHighlight(surah ?? 2, ayah ?? 1, "rose");
    });
    await renderPage(11);
    expect(screen.queryAllByTestId(/^mushaf-word-tint-/)).toHaveLength(0);
    const tinted = screen
      .getAllByRole("button")
      .filter((el) => typeof flattenStyle(el.props.style).backgroundColor === "string");
    expect(tinted.length).toBeGreaterThan(0);
  });

  it("draws nothing extra when annotations are off (practice) or absent", async () => {
    await act(async () => {
      await quranNotesStore.getState().setAyahHighlight(1, 3, "gold");
    });
    await renderPage(1, false);
    expect(screen.queryAllByTestId(/^mushaf-word-tint-/)).toHaveLength(0);
  });
});
