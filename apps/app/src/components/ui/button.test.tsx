import { fireEvent, screen } from "@testing-library/react-native";

import { Button, buttonMinHeight } from "@/components/ui/button";
import { Control, Opacity } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";
import { NAMES_OF_ALLAH_ICON } from "@/lib/names-of-allah-ui";
import { pressableProps } from "@/test-support/fiber";
import { loadOnPlatform, usePlatform } from "@/test-support/platform";
import { queryHostsByType } from "@/test-support/queries";
import { renderHookWithTheme, renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);

type Props = Parameters<typeof Button>[0];

const renderButton = (props: Partial<Props> = {}) =>
  renderWithTheme(<Button label="Save" {...props} />);

const button = () => screen.getByRole("button");
/** The resolved host style (RN `Pressable` style callback, resting state). */
const buttonStyle = () =>
  flattenStyle(
    pressableProps<{ style: (state: { pressed: boolean }) => object }>(button()).style({
      pressed: false,
    }),
  );
const labelColor = () => flattenStyle(screen.getByText("Save").props.style).color;

const themeTokens = async () => (await renderHookWithTheme(() => useThemeTokens())).result.current;

describe("Button", () => {
  it("fires onPress", async () => {
    const onPress = jest.fn();
    await renderButton({ onPress, accessibilityHint: "Saves" });

    await fireEvent.press(button());

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it.each(["primary", "secondary", "ghost", "destructive"] as const)(
    "renders the %s variant with icons at full width",
    async (variant) => {
      await renderButton({
        variant,
        size: "sm",
        icon: "star",
        trailingIcon: "chevron.right",
        fullWidth: true,
      });

      expect(screen.getByText("Save")).toBeTruthy();
      expect(buttonStyle().alignSelf).toBe("stretch");
    },
  );

  it("paints the destructive variant with the AA danger fill and label", async () => {
    const { tokens } = await themeTokens();
    await renderButton({ variant: "destructive" });

    expect(buttonStyle().backgroundColor).toBe(tokens.status.danger.fill);
    expect(labelColor()).toBe(tokens.status.danger.onFill);
  });

  it("labels the secondary variant with the contrast-checked accentOnSoft", async () => {
    const { tokens } = await themeTokens();
    await renderButton({ variant: "secondary" });

    expect(labelColor()).toBe(tokens.accentOnSoft);
  });

  it("paints the ghost variant with the hover wash token", async () => {
    const { tokens } = await themeTokens();
    await renderButton({ variant: "ghost" });

    expect(buttonStyle().backgroundColor).toBe(tokens.hover);
  });

  it("blocks presses, dims and announces disabled", async () => {
    const onPress = jest.fn();
    await renderButton({ disabled: true, onPress });

    await fireEvent.press(button());

    expect(onPress).not.toHaveBeenCalled();
    expect(button().props.accessibilityState).toEqual({ disabled: true });
    expect(buttonStyle().opacity).toBe(Opacity.disabled);
  });

  it("honours a label colour override", async () => {
    await renderButton({ labelColor: "#010203", icon: NAMES_OF_ALLAH_ICON });

    expect(labelColor()).toBe("#010203");
  });

  it.each([
    ["sm", Control.sm],
    ["md", Control.md],
    ["lg", Control.lg],
  ] as const)("sizes %s to the Control token", async (size, height) => {
    await renderButton({ size });

    expect(buttonStyle().minHeight).toBe(height);
  });

  it("defaults to md (44pt)", async () => {
    await renderButton();

    expect(buttonStyle().minHeight).toBe(Control.md);
    expect(Control.md).toBeGreaterThanOrEqual(44);
  });

  it.each([
    ["sm", "footnote", 13],
    ["md", "button", 15],
    ["lg", "button", 15],
  ] as const)("uses a %s label of the %s type", async (size, _type, fontSize) => {
    await renderButton({ size });

    expect(flattenStyle(screen.getByText("Save").props.style).fontSize).toBe(fontSize);
  });

  it("extends sm to the minimum touch target with hitSlop", async () => {
    await renderButton({ size: "sm" });

    const slop = button().props.hitSlop as { top: number; bottom: number };
    expect(Control.sm + slop.top + slop.bottom).toBeGreaterThanOrEqual(Control.minTouch);
  });
});

describe("Button haptic", () => {
  beforeEach(() => jest.mocked(triggerHaptic).mockClear());

  it.each([
    [undefined, "light"],
    ["success", "success"],
  ] as const)("fires %s → %s on press-in", async (haptic, expected) => {
    await renderButton({ onPress: () => {}, haptic });

    await fireEvent(button(), "pressIn");

    expect(triggerHaptic).toHaveBeenCalledWith(expected);
  });

  it("stays silent with haptic={false} or while loading", async () => {
    await renderButton({ onPress: () => {}, haptic: false });
    await fireEvent(button(), "pressIn");
    await renderButton({ onPress: () => {}, haptic: "success", loading: true });
    await fireEvent(screen.getAllByRole("button")[0], "pressIn");

    expect(triggerHaptic).not.toHaveBeenCalled();
  });
});

describe("Button loading", () => {
  it("sets busy, blocks presses and keeps the button enabled for focus", async () => {
    const onPress = jest.fn();
    await renderButton({ loading: true, onPress });

    await fireEvent.press(button());

    expect(onPress).not.toHaveBeenCalled();
    expect(button().props.accessibilityState).toEqual({ busy: true });
    // react-native-web drops accessibilityState; the ARIA prop reaches the DOM.
    expect(pressableProps<Record<string, unknown>>(button())["aria-busy"]).toBe(true);
    expect(buttonStyle().opacity).toBeUndefined();
  });

  it("replaces the leading icon with a spinner", async () => {
    await renderButton({ loading: true, icon: "star" });

    expect(queryHostsByType("ActivityIndicator")).toHaveLength(1);
    expect(flattenStyle(screen.getByText("Save").props.style).opacity).toBeUndefined();
  });

  it("overlays the spinner on a transparent label when there is no icon, keeping its width", async () => {
    await renderButton({ loading: true });

    expect(screen.getByTestId("button-spinner")).toBeTruthy();
    expect(flattenStyle(screen.getByText("Save").props.style).opacity).toBe(0);
  });

  it("shows no spinner when idle", async () => {
    await renderButton({ icon: "star" });

    expect(queryHostsByType("ActivityIndicator")).toHaveLength(0);
  });
});

describe("Button on TV", () => {
  usePlatform({ isTV: true });

  it("requests preferred focus", async () => {
    await renderButton({ preferredFocus: true });

    expect(button().props.hasTVPreferredFocus).toBe(true);
  });

  it.each([
    ["sm", TvLayout.chipMinHeight],
    ["md", TvLayout.minFocusTarget],
    ["lg", TvLayout.minFocusTarget],
  ] as const)("uses the %s TV focus target", async (size, min) => {
    await renderButton({ size });

    expect(buttonStyle().minHeight).toBe(min);
    expect(button().props.hitSlop).toBeUndefined();
  });
});

describe("buttonMinHeight on tvOS (TV_DENSITY = 2)", () => {
  const tvOS = () =>
    loadOnPlatform({ OS: "ios", isTV: true }, () => ({
      button: require("./button") as typeof import("./button"),
      density: require("@/constants/tv-density") as typeof import("@/constants/tv-density"),
    }));

  it("scales sm to tvDp(48), not a bare 48 (E-26)", () => {
    const { button: mod, density } = tvOS();

    expect(density.TV_DENSITY).toBe(2);
    expect(mod.buttonMinHeight("sm", true)).toBe(density.tvDp(48));
    expect(mod.buttonMinHeight("md", true)).toBe(density.tvDp(64));
  });
});

describe("buttonMinHeight", () => {
  it.each(["sm", "md", "lg"] as const)("matches Control.%s off TV", (size) => {
    expect(buttonMinHeight(size, false)).toBe(Control[size]);
  });
});
