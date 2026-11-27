import { act, fireEvent, screen } from "@testing-library/react-native";

import { StepperRow as LegacyStepperRow } from "@/components/settings/stepper-row";
import { StepperRow } from "@/components/ui/stepper-row";
import { Opacity } from "@/constants/theme";
import { usePlatform } from "@/test-support/platform";
import { parentOf, queryHostsByRole } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);

type Props = Parameters<typeof StepperRow>[0];

const renderRow = (props: Partial<Props> = {}) => {
  const onChange = jest.fn();
  return renderWithTheme(
    <StepperRow
      title="Fajr offset"
      subtitle="Minutes after the Adhan"
      value={10}
      min={0}
      max={30}
      step={5}
      format={(v) => `${v} min`}
      onChange={onChange}
      {...props}
    />,
  ).then(() => onChange);
};

const adjustable = () => {
  const [group] = queryHostsByRole("adjustable");
  if (!group) throw new Error("no adjustable element");
  return group;
};

describe("StepperRow", () => {
  it("shows the title, subtitle and formatted value", async () => {
    await renderRow();

    expect(screen.getByText("Fajr offset")).toBeTruthy();
    expect(screen.getByText("Minutes after the Adhan")).toBeTruthy();
    expect(screen.getByText("10 min")).toBeTruthy();
  });

  it.each([
    [/increase/i, 15],
    [/decrease/i, 5],
  ] as const)("%s steps by `step`", async (label, next) => {
    const onChange = await renderRow();

    await fireEvent.press(screen.getByLabelText(label));

    expect(onChange).toHaveBeenCalledWith(next);
  });

  it("exposes one adjustable element with the bounded value", async () => {
    const onChange = await renderRow();

    expect(adjustable().props.accessibilityLabel).toBe("Fajr offset");
    expect(adjustable().props.accessibilityValue).toEqual({
      min: 0,
      max: 30,
      now: 10,
      text: "10 min",
    });
    await act(async () =>
      adjustable().props.onAccessibilityAction({ nativeEvent: { actionName: "increment" } }),
    );
    expect(onChange).toHaveBeenCalledWith(15);
  });

  it("disables the minus at min with state", async () => {
    const onChange = await renderRow({ value: 0 });

    await fireEvent.press(screen.getByLabelText(/decrease/i));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/decrease/i).props.accessibilityState).toMatchObject({
      disabled: true,
    });
  });

  it("dims the copy and stepper and ignores touches when disabled", async () => {
    const onChange = await renderRow({ disabled: true });

    await fireEvent.press(screen.getByLabelText(/increase/i));

    expect(onChange).not.toHaveBeenCalled();
    expect(flattenStyle(adjustable().props.style).opacity).toBe(Opacity.disabled);
  });

  it("is still exported from the old settings path", () => {
    expect(LegacyStepperRow).toBe(StepperRow);
  });
});

describe("StepperRow on TV", () => {
  usePlatform({ isTV: true });

  it("keeps a bound focusable — dimmed and reported disabled, not disabled", async () => {
    const onChange = await renderRow({ value: 30 });

    await fireEvent.press(screen.getByLabelText(/increase/i));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/increase/i).props.accessibilityState).toEqual({
      disabled: true,
    });
    expect(screen.getByLabelText("Fajr offset, 30 min")).toBeTruthy();
  });
});

describe("StepperRow layout", () => {
  it("keeps the badge on the title line and lets the stepper wrap under the copy", async () => {
    const { Text } = require("react-native");
    await renderRow({ accessory: <Text>badge</Text> });

    const titleLine = parentOf(screen.getByText("Fajr offset"));
    expect(parentOf(screen.getByText("badge"))).toBe(titleLine);
    const control = parentOf(adjustable());
    const line = parentOf(control);
    expect(flattenStyle(line.props.style)).toEqual(
      expect.objectContaining({ flexDirection: "row", flexWrap: "wrap" }),
    );
    // Copy keeps ≥ 55% so "Volume + This device" stays on one line; the stepper
    // drops to its own line on the trailing edge instead of clipping "100%".
    expect(flattenStyle(parentOf(titleLine).props.style).minWidth).toBe("55%");
    expect(flattenStyle(control.props.style)).toEqual(
      expect.objectContaining({ flexShrink: 0, marginStart: "auto" }),
    );
  });
});
