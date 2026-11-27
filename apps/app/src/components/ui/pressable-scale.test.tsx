import { act, fireEvent, screen } from "@testing-library/react-native";
import { Text, type ViewStyle } from "react-native";

import { PressableScale, tvAdaptiveFocusScale } from "@/components/ui/pressable-scale";
import { Opacity } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { blurActiveElement } from "@/lib/blur-active-element";
import { triggerHaptic } from "@/lib/haptics";
import { pressableProps as pressablePropsOf } from "@/test-support/fiber";
import { usePlatform } from "@/test-support/platform";
import { parentOf } from "@/test-support/queries";
import { captureAnimatedStyles } from "@/test-support/reanimated";
import { renderHookWithTheme, renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);
jest.mock("@/lib/blur-active-element", () => ({ blurActiveElement: jest.fn() }));

type Props = Parameters<typeof PressableScale>[0];
type PressableState = { pressed: boolean; hovered?: boolean; focused?: boolean };
type Handler = (event: object) => void;
type PressableProps = {
  android_ripple?: { color?: string; borderless?: boolean; foreground?: boolean };
  style: (state: PressableState) => ViewStyle;
  onPressIn: Handler;
  onPressOut: Handler;
  onFocus: Handler;
  onBlur: Handler;
  onHoverIn: Handler;
  onHoverOut: Handler;
};

const renderPressable = (props: Partial<Props> = {}) =>
  renderWithTheme(
    <PressableScale accessibilityLabel="Target" onPress={jest.fn()} {...props}>
      <Text>Child</Text>
    </PressableScale>,
  );

const target = () => screen.getByLabelText("Target");

/** Props handed to RN's `Pressable` (the style callback and resolved ripple). */
const pressableProps = () => pressablePropsOf<PressableProps>(target());

/** Invokes a handler RN's Pressable would call for a touch / focus event. */
const trigger = (
  name: "onPressIn" | "onPressOut" | "onFocus" | "onBlur" | "onLayout" | "onHoverIn" | "onHoverOut",
  event: object = {},
) => act(async () => pressableProps()[name](event));

const styleFor = (state: Partial<PressableState> = {}) =>
  flattenStyle(pressableProps().style({ pressed: false, ...state }));

/** Android's rounded clip wrapper is the Pressable host's parent. */
const clipWrapper = () => {
  const parent = target().parent;
  return parent && parent.props.accessibilityLabel === undefined && parent.type === "View"
    ? flattenStyle(parent.props.style)
    : null;
};

const innerStyle = () => flattenStyle(parentOf(screen.getByText("Child")).props.style);

const themeTokens = async () =>
  (await renderHookWithTheme(() => useThemeTokens())).result.current.tokens;

afterEach(() => jest.mocked(triggerHaptic).mockClear());

describe("PressableScale", () => {
  it("ignores href on native (keeps button semantics)", async () => {
    const onPress = jest.fn();
    await renderPressable({ href: "/quran/1", onPress });

    expect(target().props.accessibilityRole).toBe("button");
    expect(pressablePropsOf<{ href?: string }>(target()).href).toBeUndefined();
    await fireEvent.press(target());
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("fires onPress", async () => {
    const onPress = jest.fn();
    await renderPressable({ onPress });

    await fireEvent.press(target());

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it.each(["onPressIn", "onPressOut", "onFocus", "onBlur"] as const)(
    "forwards %s",
    async (name) => {
      const handler = jest.fn();
      await renderPressable({ [name]: handler });

      await trigger(name);

      expect(handler).toHaveBeenCalledTimes(1);
    },
  );

  it("fires the configured haptic on press-in", async () => {
    await renderPressable({ haptic: "medium" });

    await trigger("onPressIn");

    expect(triggerHaptic).toHaveBeenCalledWith("medium");
  });

  it("stays silent by default", async () => {
    await renderPressable();

    await trigger("onPressIn");

    expect(triggerHaptic).not.toHaveBeenCalled();
  });

  it("paints near-invisible fills so Fabric keeps the hit target", async () => {
    await renderPressable({ style: { backgroundColor: "transparent" } });

    expect(styleFor().backgroundColor).toBe("rgba(0,0,0,0.002)");
  });

  it("keeps a real background colour", async () => {
    await renderPressable({ style: { backgroundColor: "#123456" } });

    expect(styleFor().backgroundColor).toBe("#123456");
  });

  it("moves flex layout to the inner wrapper and sizes fixed wells inside the border", async () => {
    await renderPressable({
      style: {
        flexDirection: "row",
        flex: 1,
        width: 40,
        height: 40,
        borderWidth: 2,
        padding: undefined,
      },
    });

    expect(innerStyle()).toMatchObject({ flexDirection: "row", flex: 1, width: 36, height: 36 });
    expect(styleFor()).toMatchObject({ flex: 1, width: 40 });
  });

  it("keeps percentage widths on the host only", async () => {
    await renderPressable({ style: { width: "50%" } });

    expect(innerStyle().width).toBeUndefined();
  });

  it("uses no Android ripple or clip wrapper on iOS", async () => {
    await renderPressable({ style: { borderRadius: 8 } });

    expect(pressableProps().android_ripple).toBeUndefined();
    expect(clipWrapper()).toBeNull();
  });

  it("does not add web hover styles on native", async () => {
    await renderPressable();

    expect(styleFor({ hovered: true }).cursor).toBeUndefined();
  });

  it("defaults to the button role when it has an onPress", async () => {
    await renderPressable();

    expect(screen.getByRole("button", { name: "Target" })).toBeTruthy();
  });

  it("defaults to the button role for long-press-only surfaces", async () => {
    await renderPressable({ onPress: undefined, onLongPress: jest.fn() });

    expect(screen.getByRole("button", { name: "Target" })).toBeTruthy();
  });

  it("keeps an explicit role", async () => {
    await renderPressable({ accessibilityRole: "link" });

    expect(target().props.accessibilityRole).toBe("link");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("keeps an explicit ARIA role", async () => {
    await renderPressable({ role: "tab" });

    expect(target().props.role).toBe("tab");
    expect(target().props.accessibilityRole).toBeUndefined();
  });

  it("adds no role to non-interactive surfaces", async () => {
    await renderPressable({ onPress: undefined });

    expect(target().props.accessibilityRole).toBeUndefined();
  });

  it("dims to Opacity.disabled and announces disabled", async () => {
    const onPress = jest.fn();
    await renderPressable({ disabled: true, onPress, accessibilityState: { selected: true } });

    await fireEvent.press(target());

    expect(onPress).not.toHaveBeenCalled();
    expect(styleFor().opacity).toBe(Opacity.disabled);
    expect(target().props.accessibilityState).toEqual({ selected: true, disabled: true });
  });

  it("leaves the opacity alone while enabled", async () => {
    await renderPressable({ accessibilityState: { selected: true } });

    expect(styleFor().opacity).toBeUndefined();
    expect(target().props.accessibilityState).toEqual({ selected: true });
  });

  it("reports an explicit disabled={false} as enabled", async () => {
    await renderPressable({ disabled: false });

    expect(target().props.accessibilityState).toEqual({ disabled: false });
  });

  it("keeps a caller's soft-disabled state on an enabled pressable (TV bounds)", async () => {
    await renderPressable({ disabled: false, accessibilityState: { disabled: true } });

    expect(target().props.accessibilityState).toEqual({ disabled: true });
  });

  it("lets an explicit style opacity win over the disabled dim", async () => {
    await renderPressable({ disabled: true, style: { opacity: 0.35 } });

    expect(styleFor().opacity).toBe(0.35);
  });

  it("skips the disabled dim when dimWhenDisabled is false", async () => {
    await renderPressable({ disabled: true, dimWhenDisabled: false });

    expect(styleFor().opacity).toBeUndefined();
    expect(target().props.accessibilityState).toEqual({ disabled: true });
  });

  it("washes unpainted surfaces with tokens.hover under a native pointer", async () => {
    const tokens = await themeTokens();
    await renderPressable();

    await trigger("onHoverIn");
    expect(styleFor().backgroundColor).toBe(tokens.hover);

    await trigger("onHoverOut");
    expect(styleFor().backgroundColor).toBe("rgba(0,0,0,0.002)");
  });

  it("forwards hover handlers", async () => {
    const onHoverIn = jest.fn();
    const onHoverOut = jest.fn();
    await renderPressable({ onHoverIn, onHoverOut });

    await trigger("onHoverIn");
    await trigger("onHoverOut");

    expect(onHoverIn).toHaveBeenCalledTimes(1);
    expect(onHoverOut).toHaveBeenCalledTimes(1);
  });

  it("does not hover while disabled", async () => {
    await renderPressable({ disabled: true });

    await trigger("onHoverIn");

    expect(styleFor().backgroundColor).toBe("rgba(0,0,0,0.002)");
  });
});

describe("PressableScale press animation", () => {
  let animated: ReturnType<typeof captureAnimatedStyles>;
  beforeEach(() => {
    animated = captureAnimatedStyles();
  });
  afterEach(() => jest.restoreAllMocks());

  it("rests at full scale and opacity", async () => {
    await renderPressable();

    expect(animated.latest()).toEqual({ transform: [{ scale: 1 }], opacity: 1 });
  });

  it("springs to scaleTo and dims while pressed", async () => {
    await renderPressable({ scaleTo: 0.9, dimOnPress: true });

    await trigger("onPressIn");

    expect(animated.latest()).toEqual({ transform: [{ scale: 0.9 }], opacity: 0.88 });
  });

  it("settles back on release", async () => {
    await renderPressable({ dimOnPress: true });

    await trigger("onPressIn");
    await trigger("onPressOut");

    expect(animated.latest()).toEqual({ transform: [{ scale: 1 }], opacity: 1 });
  });

  it("ignores focus for scaling off TV", async () => {
    await renderPressable();

    await trigger("onFocus");

    expect(animated.latest().transform).toEqual([{ scale: 1 }]);
  });
});

describe("PressableScale on Android", () => {
  usePlatform({ OS: "android" });

  it("draws a themed foreground ripple", async () => {
    await renderPressable();

    expect(pressableProps().android_ripple).toMatchObject({ borderless: false, foreground: true });
  });

  it("honours a custom ripple colour", async () => {
    await renderPressable({ rippleColor: "#ff0000" });

    expect(pressableProps().android_ripple?.color).toBe("#ff0000");
  });

  it.each([
    ["a uniform border radius", { style: { borderRadius: 20 } }, { borderRadius: 20 }],
    [
      "per-corner radii",
      { style: { borderTopLeftRadius: 6, borderBottomRightRadius: 12 } },
      { borderTopLeftRadius: 6, borderBottomRightRadius: 12 },
    ],
    ["an explicit ripple radius", { rippleRadius: 9 }, { borderRadius: 9 }],
    ["no radius at all", {}, { borderRadius: 14 }],
  ])("clips the ripple with %s", async (_case, props, expected) => {
    await renderPressable(props as Partial<Props>);

    expect(clipWrapper()).toMatchObject({ overflow: "hidden", ...expected });
  });

  it("moves margins and position onto the clip wrapper", async () => {
    await renderPressable({ style: { margin: 4, position: "absolute", top: 2, width: 30 } });

    expect(clipWrapper()).toMatchObject({ margin: 4, position: "absolute", top: 2, width: 30 });
    expect(styleFor().margin).toBeUndefined();
  });

  it.each([
    ["ripple={false}", { ripple: false }, undefined],
    [
      "a ripple config",
      { ripple: { color: "#00ff00", borderless: true } },
      { color: "#00ff00", borderless: true },
    ],
    [
      "an explicit android_ripple",
      { android_ripple: { color: "#0000ff", borderless: true } },
      { color: "#0000ff", borderless: true },
    ],
  ])("uses %s without a clip wrapper", async (_case, props, ripple) => {
    await renderPressable(props as Partial<Props>);

    expect(pressableProps().android_ripple).toEqual(ripple);
    expect(clipWrapper()).toBeNull();
  });

  it("skips the clip wrapper for borderless ripples", async () => {
    await renderPressable({ rippleBorderless: true });

    expect(pressableProps().android_ripple?.borderless).toBe(true);
    expect(clipWrapper()).toBeNull();
  });
});

describe("PressableScale on web", () => {
  usePlatform({ OS: "web" });

  describe("focus", () => {
    const g = globalThis as Record<string, unknown>;
    let restoreDom: () => void = () => {};
    afterEach(() => restoreDom());

    /** Minimal DOM: `element` is focused; its `blur()` would move focus to <body>. */
    function focusFakeElement() {
      const body = { blur: jest.fn() };
      const element = { blur: jest.fn() };
      const previous = g.document;
      const doc = { activeElement: element as unknown, body };
      element.blur.mockImplementation(() => {
        doc.activeElement = body;
      });
      g.document = doc;
      restoreDom = () => {
        g.document = previous;
      };
      return { doc, element };
    }

    it("keeps focus on the pressable after an in-place press (E-01 / F-41)", async () => {
      const onPress = jest.fn();
      await renderPressable({ onPress });
      const { doc, element } = focusFakeElement();

      await fireEvent.press(target());

      expect(onPress).toHaveBeenCalled();
      expect(blurActiveElement).not.toHaveBeenCalled();
      expect(element.blur).not.toHaveBeenCalled();
      expect(doc.activeElement).toBe(element);
    });
  });

  it("defaults to a real button (role) on web", async () => {
    await renderPressable();

    expect(target().props.accessibilityRole).toBe("button");
  });

  it("does not nest a defaulted button inside another web button", async () => {
    await renderWithTheme(
      <PressableScale accessibilityLabel="Outer" onPress={jest.fn()}>
        <PressableScale accessibilityLabel="Inner" onPress={jest.fn()}>
          <Text>Child</Text>
        </PressableScale>
      </PressableScale>,
    );

    expect(screen.getByLabelText("Outer").props.accessibilityRole).toBe("button");
    expect(screen.getByLabelText("Inner").props.accessibilityRole).toBeUndefined();
  });

  describe("href (crawlable link)", () => {
    const hrefOf = () => pressablePropsOf<{ href?: string }>(target()).href;

    it("renders a link with the href instead of a button", async () => {
      await renderPressable({ href: "/quran/1", accessibilityRole: "button" });

      expect(target().props.accessibilityRole).toBe("link");
      expect(hrefOf()).toBe("/quran/1");
    });

    it("runs onPress for a plain click and stops the full page load", async () => {
      const onPress = jest.fn();
      await renderPressable({ href: "/quran/1", onPress });
      const preventDefault = jest.fn();

      await fireEvent.press(target(), { button: 0, preventDefault });

      expect(preventDefault).toHaveBeenCalled();
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("leaves modified clicks (new tab) to the browser", async () => {
      const onPress = jest.fn();
      await renderPressable({ href: "/quran/1", onPress });
      const preventDefault = jest.fn();

      await fireEvent.press(target(), { button: 0, ctrlKey: true, preventDefault });

      expect(preventDefault).not.toHaveBeenCalled();
      expect(onPress).not.toHaveBeenCalled();
    });

    it("drops the href while disabled", async () => {
      await renderPressable({ href: "/quran/1", disabled: true });

      expect(hrefOf()).toBeUndefined();
    });

    it("never nests a link inside a web button", async () => {
      await renderWithTheme(
        <PressableScale accessibilityLabel="Outer" onPress={jest.fn()}>
          <PressableScale accessibilityLabel="Target" onPress={jest.fn()} href="/quran/1">
            <Text>Child</Text>
          </PressableScale>
        </PressableScale>,
      );

      expect(hrefOf()).toBeUndefined();
      expect(target().props.accessibilityRole).not.toBe("link");
    });

    it("keeps nested pressables inside a link from defaulting to buttons", async () => {
      await renderWithTheme(
        <PressableScale accessibilityLabel="Outer" onPress={jest.fn()} href="/dua">
          <PressableScale accessibilityLabel="Inner" onPress={jest.fn()}>
            <Text>Child</Text>
          </PressableScale>
        </PressableScale>,
      );

      expect(screen.getByLabelText("Inner").props.accessibilityRole).toBeUndefined();
    });
  });

  it("shows a pointer cursor on interactive surfaces", async () => {
    await renderPressable();

    expect(styleFor().cursor).toBe("pointer");
  });

  it("shows a pointer cursor for long-press-only surfaces", async () => {
    await renderPressable({ onPress: undefined, onLongPress: jest.fn() });

    expect(styleFor().cursor).toBe("pointer");
  });

  it("tints unpainted surfaces on hover", async () => {
    await renderPressable();

    expect(styleFor({ hovered: true }).backgroundColor).toMatch(/^#|rgba/);
  });

  it("brightens painted surfaces on hover", async () => {
    await renderPressable({ style: { backgroundColor: "#123456" } });

    expect(styleFor({ hovered: true }).filter).toMatch(/brightness/);
  });

  it("drops hover and cursor affordances when disabled", async () => {
    await renderPressable({ disabled: true });

    expect(styleFor({ hovered: true })).not.toHaveProperty("cursor");
    expect(styleFor({ hovered: true }).filter).toBeUndefined();
  });
});

describe("PressableScale on TV", () => {
  usePlatform({ isTV: true });

  it("never clips the host so the focus scale has room", async () => {
    await renderPressable({ style: { borderRadius: 10 } });

    expect(styleFor().overflow).toBe("visible");
  });

  it("draws a tokens.focusRing ring that grows outward", async () => {
    const tokens = await themeTokens();
    await renderPressable({ style: { borderRadius: 10 } });

    const focused = styleFor({ focused: true });
    expect(focused).toMatchObject({ borderRadius: 10, zIndex: 1, borderColor: tokens.focusRing });
    expect(focused.margin).toBeLessThan(0);
  });

  it("accepts focusScale as an alias of tvFocusScale", async () => {
    const animated = captureAnimatedStyles();
    await renderPressable({ focusScale: 1.06 });

    await trigger("onFocus");

    expect(animated.latest().transform).toEqual([{ scale: 1.06 }]);
  });

  it("ignores pointer hover on TV", async () => {
    await renderPressable();

    await trigger("onHoverIn");

    expect(styleFor().backgroundColor).toBe("rgba(0,0,0,0.002)");
  });

  it("keeps the margin when the resting border already matches the ring", async () => {
    await renderPressable({ style: { borderWidth: 10 } });

    expect(styleFor({ focused: true }).margin).toBeUndefined();
  });

  it("scales up while D-pad focused and back on blur", async () => {
    const animated = captureAnimatedStyles();
    await renderPressable({ tvFocusScale: 1.1 });

    await trigger("onFocus");
    expect(animated.latest().transform).toEqual([{ scale: 1.1 }]);

    await trigger("onBlur");
    expect(animated.latest().transform).toEqual([{ scale: 1 }]);
  });

  it("skips Android ripples", async () => {
    await renderPressable();

    expect(pressableProps().android_ripple).toBeUndefined();
  });

  it("lifts the focused surface with an accent glow", async () => {
    await renderPressable();

    expect(styleFor({ focused: true }).boxShadow).toEqual(expect.stringMatching(/px .+px .+px/));
    expect(styleFor().boxShadow).toBeUndefined();
  });

  it("adapts the default focus scale to the control's width", async () => {
    const animated = captureAnimatedStyles();
    await renderPressable();

    await trigger("onLayout", { nativeEvent: { layout: { width: 900, height: 64 } } });
    await trigger("onFocus");
    const [{ scale }] = animated.latest().transform as [{ scale: number }];
    expect(scale).toBeCloseTo(1 + 20 / 900, 5);
  });
});

describe("tvAdaptiveFocusScale", () => {
  it("caps small tiles at 1.08 and shrinks for wide rows", () => {
    expect(tvAdaptiveFocusScale(120)).toBeCloseTo(1.08, 5);
    expect(tvAdaptiveFocusScale(500)).toBeCloseTo(1.04, 5);
    expect(tvAdaptiveFocusScale(1000)).toBeCloseTo(1.02, 5);
  });

  it("falls back before the first layout", () => {
    expect(tvAdaptiveFocusScale(0)).toBe(1.04);
  });
});
