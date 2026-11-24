import { fireEvent, screen } from "@testing-library/react-native";

import { PageReaderFooter } from "@/components/quran/page-reader-footer";
import { isRTL } from "@/lib/rtl";
import { setMockLiquidGlass } from "@/test-support/mocks/glass-surface";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

let mockDark = false;

jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

jest.mock("@/lib/rtl", () => ({
  ...jest.requireActual("@/lib/rtl"),
  isRTL: jest.fn(() => false),
}));

// Shared glass mock (switchable `hasLiquidGlass`) plus the GlassSurface component this file renders.
jest.mock("@/components/ui/glass-surface", () =>
  Object.defineProperties(
    { GlassSurface: () => null },
    Object.getOwnPropertyDescriptors(
      require("@/test-support/mocks/glass-surface").glassSurfaceMock,
    ),
  ),
);

jest.mock("@/hooks/use-theme-tokens", () => {
  const actual = jest.requireActual("@/hooks/use-theme-tokens");
  return {
    ...actual,
    useThemeTokens: () => {
      const value = actual.useThemeTokens();
      return { ...value, tokens: { ...value.tokens, isDark: mockDark } };
    },
  };
});

const isRTLMock = isRTL as jest.MockedFunction<typeof isRTL>;
const WIDE = 800;
const COMPACT = 360;

type Props = Parameters<typeof PageReaderFooter>[0];

async function renderFooter(overrides: Partial<Props> = {}) {
  const props: Props = {
    currentPage: 3,
    totalPages: 604,
    canGoPrev: true,
    canGoNext: true,
    onPrev: jest.fn(),
    onNext: jest.fn(),
    onPlay: jest.fn(),
    onOpenPage: jest.fn(),
    ...overrides,
  };
  await renderWithTheme(<PageReaderFooter {...props} />);
  return props;
}

function buttonOrder() {
  return screen.getAllByRole("button").map((node) => node.props.accessibilityLabel);
}

describe("PageReaderFooter", () => {
  beforeEach(() => {
    isRTLMock.mockReturnValue(false);
    mockDark = false;
    setMockLiquidGlass(false);
    setMockWindowSize(WIDE);
  });

  afterEach(resetMockWindowSize);

  it.each([
    ["Next page", "onNext"],
    ["Previous page", "onPrev"],
    ["Jump to page", "onOpenPage"],
    ["Play page", "onPlay"],
  ] as const)("%p fires %s", async (label, handler) => {
    const props = await renderFooter();
    await fireEvent.press(screen.getByLabelText(label));
    expect(props[handler]).toHaveBeenCalled();
  });

  it("disables navigation at the edges", async () => {
    const props = await renderFooter({ canGoPrev: false, canGoNext: false });
    await fireEvent.press(screen.getByLabelText("Previous page"));
    await fireEvent.press(screen.getByLabelText("Next page"));
    expect(props.onPrev).not.toHaveBeenCalled();
    expect(props.onNext).not.toHaveBeenCalled();
  });

  it.each([
    [WIDE, "Page 3 of 604"],
    [COMPACT, "3 / 604"],
  ])("labels the page chip at width %p", async (width, label) => {
    setMockWindowSize(width);
    await renderFooter();
    expect(screen.getByText(label)).toBeTruthy();
  });

  it.each([
    [WIDE, false, ["Next page", "Jump to page", "Play page", "Previous page"]],
    [WIDE, true, ["Previous page", "Jump to page", "Play page", "Next page"]],
    [COMPACT, false, ["Jump to page", "Play page", "Next page", "Previous page"]],
    [COMPACT, true, ["Jump to page", "Play page", "Previous page", "Next page"]],
  ])("orders controls at width %p with rtl=%p", async (width, rtl, order) => {
    setMockWindowSize(width);
    isRTLMock.mockReturnValue(rtl);
    await renderFooter();
    expect(buttonOrder()).toEqual(order);
  });

  it.each([
    [false, false],
    [false, true],
    [true, false],
    [true, true],
  ])("renders the frosted wash with dark=%p glass=%p", async (dark, glass) => {
    mockDark = dark;
    setMockLiquidGlass(glass);
    await renderFooter();
    expect(screen.getByLabelText("Play page")).toBeTruthy();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("keeps every control", async () => {
      await renderFooter();
      expect(buttonOrder()).toEqual(["Next page", "Jump to page", "Play page", "Previous page"]);
    });
  });

  it("shows Pause while page audio plays and still calls the one toggle", async () => {
    const props = await renderFooter({ playing: true });
    expect(screen.queryByLabelText("Play page")).toBeNull();
    const pause = screen.getByLabelText("Pause");
    expect(pause.props.accessibilityState).toMatchObject({ selected: true });
    await fireEvent.press(pause);
    expect(props.onPlay).toHaveBeenCalledTimes(1);
  });
});
