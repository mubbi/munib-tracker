import { act, fireEvent, screen } from "@testing-library/react-native";
import { Text, type ViewStyle } from "react-native";

import { PressableScale } from "@/components/ui/pressable-scale";
import { triggerHaptic } from "@/lib/haptics";
import { pressableProps as pressablePropsOf } from "@/test-support/fiber";
import { usePlatform } from "@/test-support/platform";
import { captureAnimatedStyles } from "@/test-support/reanimated";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);

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
const trigger = (name: "onPressIn" | "onPressOut" | "onFocus" | "onBlur") =>
  act(async () => pressableProps()[name]({}));

const styleFor = (state: Partial<PressableState> = {}) =>
  flattenStyle(pressableProps().style({ pressed: false, ...state }));

/** Android's rounded clip wrapper is the Pressable host's parent. */
const clipWrapper = () => {
  const parent = target().parent;
  return parent && parent.props.accessibilityLabel === undefined && parent.type === "View"
    ? flattenStyle(parent.props.style)
    : null;
};

const innerStyle = () => flattenStyle(screen.getByText("Child").parent!.props.style);

afterEach(() => jest.mocked(triggerHaptic).mockClear());

describe("PressableScale", () => {
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

  it("blurs the active element before firing onPress", async () => {
    const onPress = jest.fn();
    await renderPressable({ onPress });

    await fireEvent.press(target());

    expect(onPress).toHaveBeenCalled();
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

  it("draws an accent focus ring that grows outward", async () => {
    await renderPressable({ style: { borderRadius: 10 } });

    const focused = styleFor({ focused: true });
    expect(focused).toMatchObject({ borderRadius: 10, zIndex: 1 });
    expect(focused.margin).toBeLessThan(0);
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
});
