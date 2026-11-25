import { fireEvent, screen } from "@testing-library/react-native";
import * as reanimated from "react-native-reanimated";

import { TasbeehCounterBar } from "@/components/tasbeeh/tasbeeh-counter-bar";
import { triggerHaptic } from "@/lib/haptics";
import { setMockLiquidGlass } from "@/test-support/mocks/glass-surface";
import { queryHostsByRole } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

const mockTheme = { dark: false };

/** Real theme tokens with a switchable `isDark` (the provider defaults to light). */
jest.mock("@/hooks/use-theme-tokens", () => {
  const actual = jest.requireActual("@/hooks/use-theme-tokens");
  return {
    ...actual,
    useThemeTokens: () => {
      const value = actual.useThemeTokens();
      return { ...value, tokens: { ...value.tokens, isDark: mockTheme.dark } };
    },
  };
});
/** Shared switchable `hasLiquidGlass` flag plus an inert `GlassSurface` (mounted by the bar). */
jest.mock("@/components/ui/glass-surface", () => {
  const { glassSurfaceMock } = require("@/test-support/mocks/glass-surface");
  return Object.defineProperties(
    { GlassSurface: () => null },
    Object.getOwnPropertyDescriptors(glassSurfaceMock),
  );
});
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);
// Imported transitively (reading typography → audio provider); never played here.

// The first render warms the theme + i18n graph, which is slow on a busy machine.

type Props = Parameters<typeof TasbeehCounterBar>[0];

async function renderBar(overrides: Partial<Props> = {}) {
  const props: Props = {
    count: 0,
    target: 33,
    onIncrement: jest.fn(),
    onDecrement: jest.fn(),
    ...overrides,
  };
  const view = await renderWithTheme(<TasbeehCounterBar {...props} />);
  return { props, view };
}

/** The bar's outer shell (the only host with role "text") owns `onLayout`. */
const layoutShell = async (height: number) =>
  await fireEvent(queryHostsByRole("text")[0], "layout", {
    nativeEvent: { layout: { height, width: 390 } },
  });

describe("TasbeehCounterBar", () => {
  afterEach(() => {
    jest.mocked(triggerHaptic).mockClear();
    mockTheme.dark = false;
    setMockLiquidGlass(false);
    jest.restoreAllMocks();
  });

  it("shows the count, target and remaining copy", async () => {
    await renderBar({ count: 4 });
    expect(screen.getByText("Count")).toBeTruthy();
    expect(screen.getByText("/ 33")).toBeTruthy();
    expect(screen.getByText("29 left")).toBeTruthy();
  });

  it("reports its measured height", async () => {
    const onHeightChange = jest.fn();
    await renderBar({ onHeightChange });
    await layoutShell(88);
    expect(onHeightChange).toHaveBeenCalledWith(88);
  });

  it("tolerates layout without a height callback", async () => {
    await renderBar();
    await layoutShell(70);
    expect(screen.getByText("33 left")).toBeTruthy();
  });

  it("increments with a light haptic", async () => {
    const { props } = await renderBar({ count: 4 });
    await fireEvent.press(screen.getByRole("button", { name: "Count" }));
    expect(props.onIncrement).toHaveBeenCalledTimes(1);
    expect(triggerHaptic).toHaveBeenCalledWith("light");
  });

  it("undoes instantly with no confirm dialog", async () => {
    const { props } = await renderBar({ count: 4 });
    await fireEvent.press(screen.getByRole("button", { name: "Undo" }));
    expect(screen.queryByText("Undo last count?")).toBeNull();
    expect(props.onDecrement).toHaveBeenCalledTimes(1);
    expect(triggerHaptic).toHaveBeenCalledWith("light");
  });

  it("shows the completion state and ignores taps at the target", async () => {
    const { props } = await renderBar({ count: 40 });
    expect(screen.getByText("33")).toBeTruthy();
    expect(screen.getByText("MashaAllah — target reached")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Count" }));
    expect(props.onIncrement).not.toHaveBeenCalled();
  });

  it("shows unlimited mode with undo disabled at zero", async () => {
    await renderBar({ target: 0 });
    expect(screen.getByText("unlimited")).toBeTruthy();
    expect(screen.queryByText(/^\/ /)).toBeNull();
    expect(screen.getByRole("button", { name: "Undo" })).toBeDisabled();
  });

  it.each([
    { dark: false, glass: false, alpha: "b3" },
    { dark: true, glass: false, alpha: "8c" },
    { dark: false, glass: true, alpha: "66" },
    { dark: true, glass: true, alpha: "47" },
  ])(
    "tints the shell overlay to $alpha (dark=$dark, liquid glass=$glass)",
    async ({ dark, glass, alpha }) => {
      mockTheme.dark = dark;
      setMockLiquidGlass(glass);
      await renderBar();
      const overlays = screen.container.queryAll((node) => {
        const style = flattenStyle(node.props.style);
        return style.pointerEvents === "none" && typeof style.backgroundColor === "string";
      });
      expect(
        overlays.map((node) => String(flattenStyle(node.props.style).backgroundColor)),
      ).toEqual([expect.stringMatching(new RegExp(`${alpha}$`))]);
    },
  );

  it.each([false, true])(
    "updates the count when it changes (reduced motion=%s)",
    async (reduced) => {
      jest.spyOn(reanimated, "useReducedMotion").mockReturnValue(reduced);
      const { props, view } = await renderBar({ count: 1 });
      await view.rerender(<TasbeehCounterBar {...props} count={2} />);
      expect(screen.getByText("31 left")).toBeTruthy();
    },
  );
});
