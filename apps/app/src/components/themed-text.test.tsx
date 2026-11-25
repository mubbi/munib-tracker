import { resolveTheme } from "@munib-tracker/theme/resolve";
import { render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { Text } from "react-native";

import { ThemedText, type ThemedTextProps } from "@/components/themed-text";
import { isolateWithSharedReact } from "@/test-support/isolate";
import { setPlatform, usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

// Phone window with fontScale 1 (RN's jest default is 2), so line heights read as authored.
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

const renderText = (props: ThemedTextProps) => renderWithTheme(<ThemedText {...props} />);
const textStyle = (label: string) => flattenStyle(screen.getByText(label).props.style);

describe("ThemedText arabic sanitization", () => {
  it("strips U+06DD from a scripture string", async () => {
    await renderText({ type: "arabic", children: "ءَامَنَ۝" });

    expect(screen.getByText("ءَامَنَ")).toBeTruthy();
    expect(screen.queryByText("۝")).toBeNull();
  });

  it("walks mixed children so `{arabic}{marker}` still sanitizes", async () => {
    await renderText({
      type: "arabic",
      children: [
        "ءَامَنَ۝",
        <Text key="m" testID="marker">
          x
        </Text>,
      ],
    });

    expect(JSON.stringify(screen.toJSON())).toContain("ءَامَنَ");
    expect(screen.getByTestId("marker")).toBeTruthy();
    expect(JSON.stringify(screen.toJSON())).not.toContain("۝");
  });

  it("keeps clean mixed children untouched", async () => {
    await renderText({ type: "arabic", children: ["بِسْمِ", <Text key="m">x</Text>] });

    expect(JSON.stringify(screen.toJSON())).toContain("بِسْمِ");
  });

  it("keeps non-string scripture children as they are", async () => {
    await renderText({ type: "arabic", children: <Text>nested</Text> });

    expect(screen.getByText("nested")).toBeTruthy();
  });

  it("leaves non-scripture copy unsanitized", async () => {
    await renderText({ children: "ءَامَنَ۝" });

    expect(screen.getByText("ءَامَنَ۝")).toBeTruthy();
  });
});

describe("ThemedText styling", () => {
  it.each([
    "default",
    "display",
    "title",
    "header",
    "subtitle",
    "bodyLarge",
    "button",
    "footnote",
    "small",
    "smallBold",
    "caption",
    "label",
    "linkPrimary",
    "code",
  ] as const)("renders the %s type", async (type) => {
    await renderText({ type, children: type });

    expect(textStyle(type).fontSize).toBeGreaterThan(0);
  });

  it.each([
    ["bodyLarge", 18, 28, "400"],
    ["button", 15, 20, "600"],
    ["footnote", 13, 18, "500"],
    ["title", 40, 48, "700"],
    ["linkPrimary", 14, 22, "600"],
  ] as const)("renders %s at %p/%p weight %p", async (type, fontSize, lineHeight, fontWeight) => {
    await renderText({ type, children: type });

    expect(textStyle(type)).toMatchObject({ fontSize, lineHeight, fontWeight });
  });

  it("gives code a line height", async () => {
    await renderText({ type: "code", children: "x = 1" });

    expect(textStyle("x = 1")).toMatchObject({ fontSize: 12, lineHeight: 18 });
  });

  it("paints linkPrimary in the AA accent text tone, not the raw accent", async () => {
    await renderText({ type: "linkPrimary", children: "Go" });

    const color = textStyle("Go").color;
    expect([
      resolveTheme("light", "light").accentText,
      resolveTheme("dark", "dark").accentText,
    ]).toContain(color);
  });

  it("accepts the new text colours through themeColor", async () => {
    await renderText({ themeColor: "accentText", children: "Accent" });

    expect(textStyle("Accent").color).toEqual(expect.stringMatching(/^#/));
  });

  it.each([
    ["regular", "400"],
    ["medium", "500"],
    ["semibold", "600"],
    ["bold", "700"],
  ] as const)("weight=%p sets fontWeight %p", async (weight, fontWeight) => {
    await renderText({ weight, children: weight });

    expect(textStyle(weight).fontWeight).toBe(fontWeight);
  });

  it("lets an explicit style weight win over the weight prop", async () => {
    await renderText({ weight: "bold", style: { fontWeight: "300" }, children: "Light" });

    expect(textStyle("Light").fontWeight).toBe("300");
  });

  it("never applies a synthetic weight to scripture", async () => {
    await renderText({ type: "arabic", weight: "bold", children: "الله" });

    expect(textStyle("الله").fontWeight).toBe("500");
  });

  it("derives the line height when a style passes fontSize alone", async () => {
    await renderText({ type: "caption", style: { fontSize: 20 }, children: "Big caption" });

    expect(textStyle("Big caption")).toMatchObject({ fontSize: 20, lineHeight: 28 });
  });

  it("keeps an explicit line height next to an inline fontSize", async () => {
    await renderText({ style: { fontSize: 20, lineHeight: 24 }, children: "Tight" });

    expect(textStyle("Tight")).toMatchObject({ fontSize: 20, lineHeight: 24 });
  });

  it.each([
    ["display", 1.3],
    ["title", 1.3],
    ["header", 1.5],
    ["subtitle", 1.5],
    ["button", 1.3],
    ["label", 1.3],
    ["default", undefined],
    ["bodyLarge", undefined],
    ["footnote", undefined],
    ["caption", undefined],
    ["arabic", undefined],
  ] as const)("caps %s font scaling at %p", async (type, cap) => {
    await renderText({ type, children: `cap-${type}` });

    expect(screen.getByText(`cap-${type}`).props.maxFontSizeMultiplier).toBe(cap);
  });

  it("lets a caller override the font-scale cap", async () => {
    await renderText({ type: "display", maxFontSizeMultiplier: 1.2, children: "99" });

    expect(screen.getByText("99").props.maxFontSizeMultiplier).toBe(1.2);
  });

  it("no longer offers the unused link variant", () => {
    // @ts-expect-error — `link` was removed from the ramp (use `linkPrimary`).
    const props: ThemedTextProps = { type: "link" };
    expect(props.type).toBe("link");
  });

  it("uses a caller font size for Arabic line height", async () => {
    await renderText({
      type: "arabic",
      style: { fontSize: 40, textAlign: "center" },
      children: "الله",
    });

    expect(textStyle("الله")).toMatchObject({ fontSize: 40, textAlign: "center" });
  });

  it("keeps an explicit text alignment for UI copy", async () => {
    await renderText({ style: { textAlign: "center" }, children: "Centered" });

    expect(textStyle("Centered").textAlign).toBe("center");
  });

  it("marks headings with the header trait on native", async () => {
    await renderText({ heading: 2, children: "Section" });

    expect(screen.getByText("Section").props.accessibilityRole).toBe("header");
  });
});

describe("ThemedText headings on web", () => {
  usePlatform({ OS: "web" });

  it("emits a semantic heading level", async () => {
    await renderText({ heading: 1, children: "Title" });

    expect(screen.getByText("Title").props).toMatchObject({ role: "heading", "aria-level": 1 });
  });
});

describe("ThemedText on tvOS", () => {
  /** TV density is fixed at import: load the component (and its theme) under tvOS. */
  const loadTv = () =>
    isolateWithSharedReact(() => {
      const restore = setPlatform({ OS: "ios", isTV: true });
      try {
        return {
          ThemedText: (
            require("@/components/themed-text") as typeof import("@/components/themed-text")
          ).ThemedText,
          Provider: (
            require("@/providers/theme-provider") as typeof import("@/providers/theme-provider")
          ).MunibThemeProvider,
          restore,
        };
      } catch (error) {
        restore();
        throw error;
      }
    });

  it("doubles the type ramp, including explicit metrics", async () => {
    const tv = loadTv();
    try {
      const wrap = (node: ReactNode) => <tv.Provider>{node}</tv.Provider>;
      await render(
        wrap(
          <tv.ThemedText style={{ fontSize: 10, lineHeight: 12, letterSpacing: 1 }}>
            TV
          </tv.ThemedText>,
        ),
      );

      expect(textStyle("TV")).toMatchObject({ fontSize: 20, lineHeight: 24, letterSpacing: 2 });
    } finally {
      tv.restore();
    }
  });

  it.each([
    ["bodyLarge", 40, 60, "400"],
    ["button", 36, 48, "600"],
    ["footnote", 28, 40, "500"],
  ] as const)(
    "renders %s from the TV ramp at %p/%p",
    async (type, fontSize, lineHeight, fontWeight) => {
      const tv = loadTv();
      try {
        await render(
          <tv.Provider>
            <tv.ThemedText type={type}>{type}</tv.ThemedText>
          </tv.Provider>,
        );

        expect(textStyle(type)).toMatchObject({ fontSize, lineHeight, fontWeight });
      } finally {
        tv.restore();
      }
    },
  );

  it("derives (then density-scales) the line height for an inline fontSize", async () => {
    const tv = loadTv();
    try {
      await render(
        <tv.Provider>
          <tv.ThemedText type="caption" style={{ fontSize: 20 }}>
            Inline
          </tv.ThemedText>
        </tv.Provider>,
      );

      expect(textStyle("Inline")).toMatchObject({ fontSize: 40, lineHeight: 56 });
    } finally {
      tv.restore();
    }
  });
});

describe("ThemedText on Android TV", () => {
  const loadAndroidTv = () =>
    isolateWithSharedReact(() => {
      const restore = setPlatform({ OS: "android", isTV: true });
      try {
        return {
          ThemedText: (
            require("@/components/themed-text") as typeof import("@/components/themed-text")
          ).ThemedText,
          Provider: (
            require("@/providers/theme-provider") as typeof import("@/providers/theme-provider")
          ).MunibThemeProvider,
          restore,
        };
      } catch (error) {
        restore();
        throw error;
      }
    });

  it.each([
    ["bodyLarge", 20, 30],
    ["button", 18, 24],
    ["footnote", 14, 20],
    ["linkPrimary", 16, 24],
  ] as const)("renders %s from the TV ramp at %p/%p dp", async (type, fontSize, lineHeight) => {
    const tv = loadAndroidTv();
    try {
      await render(
        <tv.Provider>
          <tv.ThemedText type={type}>{type}</tv.ThemedText>
        </tv.Provider>,
      );

      expect(textStyle(type)).toMatchObject({ fontSize, lineHeight });
    } finally {
      tv.restore();
    }
  });
});
