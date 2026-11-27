import { fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { MushafLineRenderer } from "@/components/quran/mushaf-line-renderer";
import { useQcfPageFont } from "@/hooks/use-qcf-page-font";
import {
  buildAyah,
  buildMushafPageLayout,
  buildMushafTextLine,
} from "@/test-support/fixtures/quran";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("@/hooks/use-qcf-page-font", () => ({ useQcfPageFont: jest.fn() }));

const fontState = jest.mocked(useQcfPageFont);

const [BANNER, BASMALA] = buildMushafPageLayout().lines;
const LINE_1 = buildMushafTextLine({ glyphs: "ﱁ", verseRange: "1:1-1:1" });
const LINE_2 = buildMushafTextLine({ glyphs: "ﱂ", verseRange: "1:2-1:3", alignment: "centered" });
const NO_REF = buildMushafTextLine({ glyphs: "ﱃ", verseRange: undefined });

type RendererProps = Partial<Parameters<typeof MushafLineRenderer>[0]>;

async function renderLines(props: RendererProps = {}, ready = true) {
  fontState.mockReturnValue({ ready, fontFamily: "QCF_P001", basmalaFontFamily: "QCF_BSML" });
  const onAyahPress = jest.fn();
  await renderWithTheme(
    <MushafLineRenderer
      layout={buildMushafPageLayout({ lines: [BANNER, BASMALA, LINE_1, LINE_2, NO_REF] })}
      page={1}
      onAyahPress={onAyahPress}
      {...props}
    />,
  );
  return { onAyahPress };
}

const preferredFocus = () =>
  screen.getAllByRole("button").filter((line) => line.props.hasTVPreferredFocus);

describe("MushafLineRenderer", () => {
  it("draws the surah banner, basmala and glyph lines once the page font is ready", async () => {
    await renderLines();
    expect(screen.getByText("سورة الفاتحة")).toBeTruthy();
    expect(screen.getByText("﷽")).toHaveStyle({ fontFamily: "QCF_BSML" });
    expect(screen.getByText("ﱁ")).toHaveStyle({ fontFamily: "QCF_P001" });
  });

  it("keeps only the banner while the font loads", async () => {
    await renderLines({}, false);
    expect(screen.getByText("سورة الفاتحة")).toBeTruthy();
    expect(screen.queryByText("﷽")).toBeNull();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("labels each line by its first ayah, or by page when it has none", async () => {
    await renderLines();
    expect(screen.getByLabelText("1:1")).toBeTruthy();
    expect(screen.getByLabelText("1:2")).toBeTruthy();
    expect(screen.getByLabelText("Page 1")).toBeTruthy();
  });

  it("speaks each ayah's Unicode Arabic once, on the line where it starts (G-01)", async () => {
    await renderLines({
      ayahs: [
        buildAyah({ surah: 1, ayah: 1, arabic: "ar-1" }),
        buildAyah({ surah: 1, ayah: 2, arabic: "ar-2" }),
        buildAyah({ surah: 1, ayah: 3, arabic: "ar-3" }),
      ],
    });
    expect(screen.getByLabelText("1:1, ar-1")).toBeTruthy();
    const line2 = screen.getByLabelText("1:2, ar-2, ar-3");
    expect(line2.props.accessibilityHint).toBe("Opens actions");
    // The basmala glyph line reads as Unicode Arabic, not private-use glyph codes.
    expect(screen.getByLabelText(/^بِسْمِ/).props.accessibilityLanguage).toBe("ar");
  });

  it("opens the line's first ayah on tap", async () => {
    const { onAyahPress } = await renderLines();
    await fireEvent.press(screen.getByLabelText("1:2"));
    expect(onAyahPress).toHaveBeenCalledWith(1, 2);
  });

  it("ignores taps on a line without an ayah", async () => {
    const { onAyahPress } = await renderLines();
    await fireEvent.press(screen.getByLabelText("Page 1"));
    expect(onAyahPress).not.toHaveBeenCalled();
  });

  it("highlights the line holding the highlighted ayah", async () => {
    await renderLines({ highlightAyah: { surah: 1, ayah: 3 } });
    const background = (label: string) =>
      flattenStyle(screen.getByLabelText(label).props.style).backgroundColor;
    expect(background("1:2")).not.toEqual(background("1:1"));
  });

  it("lets the caller draw a line's glyphs", async () => {
    await renderLines({
      renderLineGlyphs: (lineIndex, glyphs) =>
        lineIndex === 2 ? <Text>{`custom ${glyphs}`}</Text> : null,
    });
    expect(screen.getByText("custom ﱁ")).toBeTruthy();
    expect(screen.getByText("ﱂ")).toBeTruthy();
  });

  it("spreads a full page edge to edge", async () => {
    fontState.mockReturnValue({ ready: true, fontFamily: "F", basmalaFontFamily: "B" });
    const lines = Array.from({ length: 15 }, (_, i) =>
      buildMushafTextLine({ glyphs: `g${i}`, verseRange: `2:${i + 1}-2:${i + 1}` }),
    );
    await renderWithTheme(
      <MushafLineRenderer layout={buildMushafPageLayout({ page: 3, lines })} page={3} />,
    );
    expect(screen.getAllByRole("button")).toHaveLength(15);
  });

  it("does not request TV focus on phones", async () => {
    await renderLines({ tvFocusTarget: "first" });
    expect(preferredFocus()).toHaveLength(0);
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it.each([
      ["the first text line", "first" as const, "1:1"],
      ["the targeted ayah's line", { surah: 1, ayah: 3 }, "1:2"],
      ["the first text line for an off-page ayah", { surah: 9, ayah: 1 }, "1:1"],
    ])("focuses %s", async (_name, tvFocusTarget, label) => {
      await renderLines({ tvFocusTarget });
      expect(preferredFocus()).toEqual([screen.getByLabelText(label)]);
    });
  });
});
