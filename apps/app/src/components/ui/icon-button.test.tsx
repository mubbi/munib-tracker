import { fireEvent, screen } from "@testing-library/react-native";

import { IconButton } from "@/components/ui/icon-button";
import { setMockLiquidGlass } from "@/test-support/mocks/glass-surface";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock(
  "@/components/ui/glass-surface",
  () => require("@/test-support/mocks/glass-surface").glassSurfaceMock,
);
jest.mock(
  "expo-glass-effect",
  () => require("@/test-support/mocks/expo-glass-effect").expoGlassEffectMock,
);

type Props = Parameters<typeof IconButton>[0];

const renderIconButton = (props: Partial<Props> = {}) =>
  renderWithTheme(<IconButton name="xmark" accessibilityLabel="Close" {...props} />);

const button = () => screen.getByLabelText("Close");

describe("IconButton", () => {
  afterEach(() => setMockLiquidGlass(false));

  it("fires onPress", async () => {
    const onPress = jest.fn();
    await renderIconButton({ onPress });

    await fireEvent.press(button());

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("keeps a 44pt target with a tinted well", async () => {
    await renderIconButton({ background: "#eeeeee", accessibilityState: { selected: true } });

    expect(flattenStyle(button().props.style)).toMatchObject({
      width: 44,
      backgroundColor: "#eeeeee",
    });
    expect(button().props.accessibilityState).toEqual({
      disabled: false,
      busy: false,
      selected: true,
    });
  });

  it("blocks presses and reports busy while loading", async () => {
    const onPress = jest.fn();
    await renderIconButton({ onPress, loading: true });

    await fireEvent.press(button());

    expect(onPress).not.toHaveBeenCalled();
    expect(button().props.accessibilityState).toMatchObject({ disabled: true, busy: true });
  });

  it("dims when disabled", async () => {
    await renderIconButton({ disabled: true });

    expect(flattenStyle(button().props.style).opacity).toBe(0.4);
  });

  it("moves the well into Liquid Glass when available", async () => {
    setMockLiquidGlass(true);
    await renderIconButton({ glass: true, background: "#000000", disabled: true });

    expect(screen.getByTestId("glass-view").props.isInteractive).toBe(false);
    expect(flattenStyle(button().props.style).backgroundColor).not.toBe("#000000");
  });
});

describe("IconButton on TV", () => {
  usePlatform({ isTV: true });

  it("grows the D-pad target and requests focus", async () => {
    await renderIconButton({ preferredFocus: true });

    expect(button().props.hasTVPreferredFocus).toBe(true);
    expect(flattenStyle(button().props.style).width).toBeGreaterThanOrEqual(56);
  });
});
