import { fireEvent, screen } from "@testing-library/react-native";

import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
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

  it("blocks presses while loading", async () => {
    const onPress = jest.fn();
    await renderButton({ onPress, loading: true });

    await fireEvent.press(button());

    expect(onPress).not.toHaveBeenCalled();
    expect(flattenStyle(button().props.style).opacity).toBe(0.4);
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

  it("uses larger captions and requests focus", async () => {
    await renderButton({ preferredFocus: true, iconSize: 30 });

    expect(button().props.hasTVPreferredFocus).toBe(true);
    expect(flattenStyle(screen.getByText("Play").props.style).fontSize).toBe(13);
  });
});
