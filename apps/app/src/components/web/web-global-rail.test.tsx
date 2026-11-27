import { act, fireEvent, screen } from "@testing-library/react-native";

import { focusMainContent } from "@/components/web/skip-to-content-link";
import {
  RAIL_LOGO_SIZE_COMPACT,
  RAIL_LOGO_SIZE_EXPANDED,
  WebGlobalRail,
} from "@/components/web/web-global-rail";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { defined } from "@/test-support/assert";
import { pressableProps } from "@/test-support/fiber";
import { mockRouter, resetExpoRouterMock, setMockPathname } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderHookWithTheme, renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

const mockBlur = jest.fn();

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/lib/blur-active-element", () => ({ blurActiveElement: () => mockBlur() }));

type HoverProps = { onHoverIn: () => void };

const railLink = (label: string) => screen.getByLabelText(label);

async function themeTokens() {
  const { result } = await renderHookWithTheme(() => useThemeTokens());
  return result.current;
}

function fakeElement(visible: boolean) {
  const attrs = new Map<string, string>();
  return {
    attrs,
    focus: jest.fn(),
    hasAttribute: (name: string) => attrs.has(name),
    setAttribute: (name: string, value: string) => attrs.set(name, value),
    getClientRects: () => ({ length: visible ? 1 : 0 }),
  };
}

describe("WebGlobalRail", () => {
  usePlatform({ OS: "web" });

  beforeEach(() => {
    resetExpoRouterMock();
    mockBlur.mockClear();
  });

  it.each([
    ["Home", "/"],
    ["Tracker", "/tracker"],
    ["Library", "/library"],
    ["Search", "/search"],
    ["Saved", "/bookmarks"],
    ["Settings", "/settings"],
  ])("renders %s as an anchor to %s", async (label, href) => {
    await renderWithTheme(<WebGlobalRail windowWidth={900} />);
    expect(railLink(label).props).toMatchObject({ role: "link", href });
  });

  it("is a labelled navigation landmark", async () => {
    await renderWithTheme(<WebGlobalRail windowWidth={900} />);
    expect(screen.getByLabelText("Primary").props.role).toBe("navigation");
  });

  it.each([
    ["/", "Home"],
    ["/search", "Search"],
    ["/bookmarks", "Saved"],
    ["/settings/fonts", "Settings"],
    ["/quran/2", "Library"],
  ])("marks the section for %s as the current page", async (pathname, label) => {
    setMockPathname(pathname);
    await renderWithTheme(<WebGlobalRail windowWidth={900} />);
    expect(railLink(label).props["aria-current"]).toBe("page");
    expect(
      screen.getAllByRole("link").filter((el) => el.props["aria-current"] === "page"),
    ).toHaveLength(1);
  });

  it.each([
    ["Tracker", "/tracker"],
    ["Library", "/library"],
  ])("navigates to %s in-app on a plain click and blurs focus", async (label, href) => {
    await renderWithTheme(<WebGlobalRail windowWidth={900} />);
    const preventDefault = jest.fn();
    await fireEvent.press(railLink(label), { button: 0, preventDefault });
    expect(preventDefault).toHaveBeenCalled();
    expect(mockBlur).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(href);
  });

  it.each([
    ["Ctrl", { ctrlKey: true }],
    ["Cmd", { metaKey: true }],
    ["Shift", { shiftKey: true }],
    ["middle", { button: 1 }],
  ])("leaves a %s-click to the browser (new tab)", async (_name, modifiers) => {
    await renderWithTheme(<WebGlobalRail windowWidth={900} />);
    const preventDefault = jest.fn();
    await fireEvent.press(railLink("Library"), { ...modifiers, preventDefault });
    expect(preventDefault).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it("links the brand home", async () => {
    await renderWithTheme(<WebGlobalRail windowWidth={900} />);
    const brand = screen.getByRole("link", { name: "Munib Tracker" });
    expect(brand.props.href).toBe("/");
    await fireEvent.press(brand, {});
    expect(mockRouter.navigate).toHaveBeenCalledWith("/");
  });

  it("puts the skip link first in the tab order", async () => {
    await renderWithTheme(<WebGlobalRail windowWidth={900} />);
    const [first] = screen.getAllByRole("link");
    expect(first).toBe(screen.getByRole("link", { name: "Skip to content" }));
    expect(first?.props.href).toBe("#main-content");
  });

  it("moves focus to the main landmark from the skip link", async () => {
    const hidden = fakeElement(false);
    const current = fakeElement(true);
    await renderWithTheme(<WebGlobalRail windowWidth={900} />);
    // Swap in a fake DOM only for the press (the theme provider writes to the real one on mount).
    const restore = Object.getOwnPropertyDescriptor(globalThis, "document");
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: { querySelectorAll: () => [hidden, current] },
    });
    try {
      const preventDefault = jest.fn();
      await fireEvent.press(screen.getByRole("link", { name: "Skip to content" }), {
        preventDefault,
      });
      expect(preventDefault).toHaveBeenCalled();
      expect(current.focus).toHaveBeenCalled();
      expect(current.attrs.get("tabindex")).toBe("-1");
      expect(hidden.focus).not.toHaveBeenCalled();
    } finally {
      if (restore) Object.defineProperty(globalThis, "document", restore);
      else delete (globalThis as { document?: unknown }).document;
    }
  });

  it("reveals the skip link only while it has focus", async () => {
    await renderWithTheme(<WebGlobalRail windowWidth={900} />);
    const skip = () => screen.getByRole("link", { name: "Skip to content" });
    expect(flattenStyle(skip().props.style).opacity).toBe(0);
    await fireEvent(skip(), "focus");
    expect(flattenStyle(skip().props.style).opacity).toBeUndefined();
    await fireEvent(skip(), "blur");
    expect(flattenStyle(skip().props.style).opacity).toBe(0);
  });

  it("stacks the logo above the wordmark when expanded", async () => {
    await renderWithTheme(<WebGlobalRail windowWidth={1400} />);
    const logo = flattenStyle(screen.getByTestId("rail-logo").props.style);
    expect(logo.width).toBe(RAIL_LOGO_SIZE_EXPANDED);
    expect(logo.height).toBe(RAIL_LOGO_SIZE_EXPANDED);
    expect(screen.getByText("Munib Tracker")).toBeTruthy();
    const brand = defined(screen.getAllByLabelText("Munib Tracker")[0], "brand link");
    const brandStyle = pressableProps<{ style: (s: object) => unknown }>(brand).style({
      pressed: false,
    });
    expect(flattenStyle(brandStyle).flexDirection).toBeUndefined();
    expect(flattenStyle(brandStyle).alignItems).toBe("center");
    expect(brand.props.href).toBe("/");
  });

  it("shows the compact logo without the wordmark", async () => {
    await renderWithTheme(<WebGlobalRail windowWidth={900} />);
    expect(flattenStyle(screen.getByTestId("rail-logo").props.style).width).toBe(
      RAIL_LOGO_SIZE_COMPACT,
    );
    expect(screen.queryByText("Munib Tracker")).toBeNull();
  });

  it("uses ≥ 12px labels in the compact rail and accentText for the current one", async () => {
    const { colors } = await themeTokens();
    setMockPathname("/tracker");
    await renderWithTheme(<WebGlobalRail windowWidth={900} />);
    for (const label of ["Home", "Tracker", "Library", "Search", "Saved", "Settings"]) {
      expect(flattenStyle(screen.getByText(label).props.style).fontSize).toBeGreaterThanOrEqual(12);
    }
    expect(flattenStyle(screen.getByText("Tracker").props.style).color).toBe(colors.accentText);
  });

  it("washes a hovered item", async () => {
    const { tokens } = await themeTokens();
    await renderWithTheme(<WebGlobalRail windowWidth={1400} />);
    const rowStyle = () =>
      flattenStyle(
        pressableProps<{ style: (s: object) => unknown }>(railLink("Library")).style({
          pressed: false,
        }),
      );
    expect(rowStyle().backgroundColor).toBe("transparent");
    await act(async () => pressableProps<HoverProps>(railLink("Library")).onHoverIn());
    expect(rowStyle().backgroundColor).toBe(tokens.hover);
  });
});

describe("focusMainContent", () => {
  it("returns false without a document or a landmark", () => {
    expect(focusMainContent(undefined)).toBe(false);
    expect(focusMainContent({ querySelectorAll: () => [] })).toBe(false);
  });

  it("keeps an existing tabindex", () => {
    const main = fakeElement(true);
    main.setAttribute("tabindex", "0");
    expect(focusMainContent({ querySelectorAll: () => [main] })).toBe(true);
    expect(main.attrs.get("tabindex")).toBe("0");
    expect(main.focus).toHaveBeenCalled();
  });
});
