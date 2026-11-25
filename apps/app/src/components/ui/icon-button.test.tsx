import { fireEvent, screen } from "@testing-library/react-native";

import { IconButton } from "@/components/ui/icon-button";
import { Opacity } from "@/constants/theme";
import i18n from "@/i18n";
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

const button = () => screen.getByRole("button");

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

    expect(screen.getByLabelText("Close")).toBe(button());
    expect(flattenStyle(button().props.style)).toMatchObject({
      width: 44,
      backgroundColor: "#eeeeee",
    });
    expect(button().props.accessibilityState).toEqual({ busy: false, selected: true });
  });

  it.each([24, 36])("raises hitTarget=%i to the 44pt floor", async (hitTarget) => {
    await renderIconButton({ hitTarget });

    expect(flattenStyle(button().props.style)).toMatchObject({ width: 44, height: 44 });
  });

  it("keeps a larger hitTarget", async () => {
    await renderIconButton({ hitTarget: 52 });

    expect(flattenStyle(button().props.style).width).toBe(52);
  });

  it("blocks presses and reports busy while loading, staying enabled for focus", async () => {
    const onPress = jest.fn();
    const onLongPress = jest.fn();
    await renderIconButton({ onPress, onLongPress, loading: true });

    await fireEvent.press(button());
    await fireEvent(button(), "longPress");

    expect(onPress).not.toHaveBeenCalled();
    expect(onLongPress).not.toHaveBeenCalled();
    expect(button().props.accessibilityState).toEqual({ busy: true });
    expect(flattenStyle(button().props.style).opacity).toBeUndefined();
  });

  it("dims to Opacity.disabled and announces disabled", async () => {
    await renderIconButton({ disabled: true });

    expect(flattenStyle(button().props.style).opacity).toBe(Opacity.disabled);
    expect(button().props.accessibilityState).toMatchObject({ disabled: true });
  });

  it("moves the well into Liquid Glass when available", async () => {
    setMockLiquidGlass(true);
    await renderIconButton({ glass: true, background: "#000000", disabled: true });

    expect(screen.getByTestId("glass-view").props.isInteractive).toBe(false);
    expect(flattenStyle(button().props.style).backgroundColor).not.toBe("#000000");
  });

  it("dims a disabled glass well once, not twice", async () => {
    setMockLiquidGlass(true);
    await renderIconButton({ glass: true, disabled: true });

    expect(flattenStyle(screen.getByTestId("glass-view").props.style).opacity).toBe(
      Opacity.disabled,
    );
    expect(flattenStyle(button().props.style).opacity).toBe(1);
  });
});

describe("IconButton badge", () => {
  it("folds the count into the label and hides the badge from assistive tech", async () => {
    await renderIconButton({ accessibilityLabel: "Notifications", badge: 3 });

    expect(button().props.accessibilityLabel).toBe("Notifications, 3 new");
    const badge = screen.getByTestId("icon-button-badge", { includeHiddenElements: true });
    expect(badge.props.accessibilityElementsHidden).toBe(true);
    expect(badge.props.importantForAccessibility).toBe("no-hide-descendants");
    expect(screen.queryByLabelText("3")).toBeNull();
    // The count still renders for sighted users.
    expect(screen.getByText("3", { includeHiddenElements: true })).toBeTruthy();
  });

  it("uses the singular plural form", async () => {
    await renderIconButton({ accessibilityLabel: "Notifications", badge: 1 });

    expect(button().props.accessibilityLabel).toBe(
      i18n.t("common.badgeA11y", { label: "Notifications", count: 1 }),
    );
  });

  it("prefers a caller-supplied badge label", async () => {
    await renderIconButton({
      accessibilityLabel: "Notifications",
      badge: 2,
      badgeAccessibilityLabel: "Notifications, 2 unread",
    });

    expect(button().props.accessibilityLabel).toBe("Notifications, 2 unread");
  });

  it.each([0, undefined])("draws no badge for %s", async (badge) => {
    await renderIconButton({ badge });

    expect(button().props.accessibilityLabel).toBe("Close");
    expect(screen.queryByTestId("icon-button-badge", { includeHiddenElements: true })).toBeNull();
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
