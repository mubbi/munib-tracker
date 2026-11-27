import { act, fireEvent, screen } from "@testing-library/react-native";

import {
  ScriptureReaderChrome,
  ScriptureReadingFilters,
  ScriptureReadingToolbar,
} from "@/components/content/scripture-reading-filters";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { setReadingDisplayState } from "@/test-support/settings";

const mockFullscreen = { supported: false, active: false, toggle: jest.fn(async () => undefined) };

jest.mock("@/hooks/use-reading-fullscreen", () => ({
  useReadingFullscreen: () => mockFullscreen,
}));
jest.mock("@/components/reading-font-controls", () => ({
  ReadingFontControls: () => null,
}));
jest.mock("@/components/ui/glass-surface", () =>
  require("@/test-support/mocks/glass-surface").glassSurfaceWithComponentMock(),
);

const progress = { value: 0.4 } as never;

function checked(label: string): boolean | undefined {
  const node = screen.getByLabelText(label);
  return node.props.accessibilityState?.checked ?? node.props.value;
}

async function resetVisibility() {
  await act(async () => {
    setReadingDisplayState({ showTransliteration: true, showTranslation: true });
  });
}

describe("ScriptureReadingFilters", () => {
  beforeEach(resetVisibility);

  it("shows the text size control", async () => {
    await renderWithTheme(<ScriptureReadingFilters />);
    expect(screen.getByText("Text size")).toBeTruthy();
  });

  it.each(["Show transliteration", "Show translation"])("toggles %s", async (label) => {
    await renderWithTheme(<ScriptureReadingFilters />);
    expect(checked(label)).toBe(true);
    await fireEvent(screen.getByLabelText(label), "valueChange", false);
    expect(checked(label)).toBe(false);
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it.each(["Show transliteration", "Show translation"])(
      "uses a whole-row %s switch",
      async (label) => {
        await renderWithTheme(<ScriptureReadingFilters />);
        expect(screen.getAllByText("On")).toHaveLength(2);
        await fireEvent.press(screen.getByLabelText(label));
        expect(checked(label)).toBe(false);
        expect(screen.getByText("Off")).toBeTruthy();
      },
    );
  });
});

describe("ScriptureReadingToolbar", () => {
  beforeEach(async () => {
    await resetVisibility();
    Object.assign(mockFullscreen, { supported: false, active: false });
    mockFullscreen.toggle.mockClear();
  });

  async function renderToolbar(props: Partial<Parameters<typeof ScriptureReadingToolbar>[0]> = {}) {
    const onBackToTop = jest.fn();
    await renderWithTheme(
      <ScriptureReadingToolbar visible progress={progress} onBackToTop={onBackToTop} {...props} />,
    );
    return onBackToTop;
  }

  it("scrolls back to top", async () => {
    const onBackToTop = await renderToolbar();
    await fireEvent.press(screen.getByLabelText("Back to top"));
    expect(onBackToTop).toHaveBeenCalled();
  });

  it("hides back-to-top when disabled", async () => {
    await renderToolbar({ showBackToTop: false, visible: false, progressLabel: "42%" });
    expect(screen.queryByLabelText("Back to top")).toBeNull();
  });

  it.each(["Show transliteration", "Show translation"])("toggles the %s chip", async (label) => {
    await renderToolbar();
    await fireEvent.press(screen.getByLabelText(label));
    expect(checked(label)).toBe(false);
  });

  it.each([
    [false, "Enter fullscreen"],
    [true, "Exit fullscreen"],
  ])("toggles fullscreen when active=%s", async (active, label) => {
    Object.assign(mockFullscreen, { supported: true, active });
    await renderToolbar({ visible: active === false });
    await fireEvent.press(screen.getByLabelText(label));
    expect(mockFullscreen.toggle).toHaveBeenCalled();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("drops back-to-top and the glass layer", async () => {
      await renderToolbar();
      expect(screen.queryByLabelText("Back to top")).toBeNull();
      expect(screen.getByLabelText("Show translation")).toBeTruthy();
    });
  });
});

describe("ScriptureReaderChrome", () => {
  beforeEach(() => {
    Object.assign(mockFullscreen, { supported: true, active: false });
    mockFullscreen.toggle.mockClear();
  });

  it("scrolls back to top while the toolbar is visible", async () => {
    const onBackToTop = jest.fn();
    await renderWithTheme(<ScriptureReaderChrome toolbarVisible onBackToTop={onBackToTop} />);
    await fireEvent.press(screen.getByLabelText("Back to top"));
    expect(onBackToTop).toHaveBeenCalled();
  });

  it.each([
    [false, "Enter fullscreen"],
    [true, "Exit fullscreen"],
  ])("toggles fullscreen when active=%s", async (active, label) => {
    mockFullscreen.active = active;
    await renderWithTheme(<ScriptureReaderChrome toolbarVisible={false} onBackToTop={jest.fn()} />);
    expect(screen.queryByLabelText("Back to top")).toBeNull();
    await fireEvent.press(screen.getByLabelText(label));
    expect(mockFullscreen.toggle).toHaveBeenCalled();
  });

  it("renders nothing actionable when fullscreen is unsupported and the toolbar hidden", async () => {
    mockFullscreen.supported = false;
    await renderWithTheme(<ScriptureReaderChrome toolbarVisible={false} onBackToTop={jest.fn()} />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
