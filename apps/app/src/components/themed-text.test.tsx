import { render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { Text } from "react-native";

import { ThemedText, type ThemedTextProps } from "@/components/themed-text";
import { isolateWithSharedReact } from "@/test-support/isolate";
import { setPlatform, usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

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
    "small",
    "smallBold",
    "caption",
    "label",
    "link",
    "code",
  ] as const)("renders the %s type", async (type) => {
    await renderText({ type, children: type });

    expect(textStyle(type).fontSize).toBeGreaterThan(0);
  });

  it("paints linkPrimary in the accent colour", async () => {
    await renderText({ type: "linkPrimary", children: "Go" });

    expect(textStyle("Go").color).toEqual(expect.stringMatching(/^#/));
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
});
