import { fireEvent, screen } from "@testing-library/react-native";

import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { Control, Opacity } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

type Props = Parameters<typeof LabeledIconButton>[0];

const renderButton = (props: Partial<Props> = {}) =>
  renderWithTheme(
    <LabeledIconButton name="play" label="Play" accessibilityLabel="Play audio" {...props} />,
  );

const button = () => screen.getByLabelText("Play audio");

describe("LabeledIconButton", () => {
  it("fires onPress", async () => {
    const onPress = jest.fn();
    await renderButton({ onPress });

    await fireEvent.press(button());

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("paints an optional background well", async () => {
    await renderButton({ background: "#ffeedd", accessibilityState: { selected: false } });

    expect(flattenStyle(button().props.style).backgroundColor).toBe("#ffeedd");
  });

  it("blocks presses and reports busy while loading, without dimming", async () => {
    const onPress = jest.fn();
    await renderButton({ onPress, loading: true });

    await fireEvent.press(button());

    expect(onPress).not.toHaveBeenCalled();
    expect(button().props.accessibilityState).toEqual({ busy: true });
    expect(flattenStyle(button().props.style).opacity).toBeUndefined();
  });

  it("dims to Opacity.disabled and announces disabled", async () => {
    const onPress = jest.fn();
    await renderButton({ onPress, disabled: true });

    await fireEvent.press(button());

    expect(onPress).not.toHaveBeenCalled();
    expect(flattenStyle(button().props.style).opacity).toBe(Opacity.disabled);
    expect(button().props.accessibilityState).toMatchObject({ disabled: true });
  });

  it("uses a caption label of at least 12pt (A-24)", async () => {
    await renderButton();

    expect(flattenStyle(screen.getByText("Play").props.style).fontSize).toBeGreaterThanOrEqual(12);
  });

  it("keeps a 44pt minimum target", async () => {
    await renderButton();

    expect(flattenStyle(button().props.style)).toMatchObject({
      minWidth: Control.md,
      minHeight: Control.md,
    });
  });

  it.each([
    ["Preparing", "Preparing"],
    [undefined, "Play"],
  ])("shows loadingLabel=%s as %s while loading", async (loadingLabel, shown) => {
    await renderButton({ loading: true, loadingLabel });

    expect(screen.getByText(shown)).toBeTruthy();
  });

  it("applies a custom label colour", async () => {
    await renderButton({ labelColor: "#112233" });

    expect(flattenStyle(screen.getByText("Play").props.style).color).toBe("#112233");
  });
});

describe("LabeledIconButton on TV", () => {
  usePlatform({ isTV: true });

  it("requests focus and grows the target to the TV focus size", async () => {
    await renderButton({ preferredFocus: true, iconSize: 30 });

    expect(button().props.hasTVPreferredFocus).toBe(true);
    expect(flattenStyle(button().props.style).minHeight).toBe(TvLayout.minFocusTarget);
    // The label is a plain `caption`: ThemedText applies the TV ramp
    // (TvType.caption) itself, resolved once at import on a TV build.
    expect(screen.getByText("Play").props.style).not.toContainEqual(
      expect.objectContaining({ fontSize: 13 }),
    );
  });
});
