import { act, fireEvent, screen } from "@testing-library/react-native";
import type { TestInstance } from "test-renderer";

import { Stepper } from "@/components/ui/stepper";
import { Control, Opacity } from "@/constants/theme";
import { triggerHaptic } from "@/lib/haptics";
import { usePlatform } from "@/test-support/platform";
import { queryHostsByRole } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);

type Props = Parameters<typeof Stepper>[0];

const renderStepper = (props: Partial<Props> = {}) => {
  const handlers = { onIncrement: jest.fn(), onDecrement: jest.fn(), ...props };
  return renderWithTheme(<Stepper value={3} label="Fajr" {...handlers} />).then(() => handlers);
};

const adjustable = () => {
  const [group] = queryHostsByRole("adjustable");
  if (!group) throw new Error("no adjustable element");
  return group;
};
const runAction = (actionName: string) =>
  act(async () => adjustable().props.onAccessibilityAction({ nativeEvent: { actionName } }));
const decrease = () => screen.getByLabelText(/decrease/i);
const increase = () => screen.getByLabelText(/increase/i);
const hostStyle = (node: TestInstance) => flattenStyle(node.props.style);

beforeEach(() => jest.mocked(triggerHaptic).mockClear());

describe("Stepper", () => {
  it("shows the current value", async () => {
    await renderStepper();

    expect(screen.getByText("3")).toBeTruthy();
  });

  it.each([
    [/increase/i, "onIncrement"],
    [/decrease/i, "onDecrement"],
  ] as const)("%s calls %s", async (label, handler) => {
    const handlers = await renderStepper({ size: "md", buttonBackground: "#000000" });

    await fireEvent.press(screen.getByLabelText(label));

    expect(handlers[handler]).toHaveBeenCalledTimes(1);
    expect(triggerHaptic).toHaveBeenCalledWith("selection");
  });

  it("disables decrement at the minimum and says so", async () => {
    const { onDecrement } = await renderStepper({ value: 0 });

    await fireEvent.press(decrease());

    expect(onDecrement).not.toHaveBeenCalled();
    expect(decrease().props.accessibilityState).toMatchObject({ disabled: true });
    expect(hostStyle(decrease()).opacity).toBe(Opacity.disabled);
  });

  it("disables increment at the maximum", async () => {
    const onChange = jest.fn();
    await renderStepper({ value: 5, max: 5, onChange });

    await fireEvent.press(increase());

    expect(onChange).not.toHaveBeenCalled();
    expect(increase().props.accessibilityState).toMatchObject({ disabled: true });
  });

  it("makes the value tappable when onValuePress is set", async () => {
    const onValuePress = jest.fn();
    await renderStepper({ onValuePress, valueAccessibilityLabel: "Edit Fajr count" });

    await fireEvent.press(screen.getByLabelText("Edit Fajr count"));

    expect(onValuePress).toHaveBeenCalledTimes(1);
  });

  it("defaults to md step buttons (Control.md)", async () => {
    await renderStepper();

    expect(hostStyle(decrease())).toMatchObject({ width: Control.md, height: Control.md });
  });

  it("keeps sm buttons reachable with a hitSlop up to the touch minimum", async () => {
    await renderStepper({ size: "sm" });

    expect(hostStyle(decrease()).width).toBe(Control.sm);
    const slop = decrease().props.hitSlop as number;
    expect(Control.sm + slop * 2).toBeGreaterThanOrEqual(Control.minTouch);
  });

  it("dims once and blocks both buttons when disabled", async () => {
    const handlers = await renderStepper({ disabled: true });

    await fireEvent.press(increase());
    await fireEvent.press(decrease());

    expect(handlers.onIncrement).not.toHaveBeenCalled();
    expect(handlers.onDecrement).not.toHaveBeenCalled();
    expect(hostStyle(adjustable()).opacity).toBe(Opacity.disabled);
    expect(hostStyle(increase()).opacity).toBe(1);
    expect(adjustable().props.accessibilityState).toEqual({ disabled: true });
  });
});

describe("Stepper accessibility (adjustable)", () => {
  it("is one adjustable element with the label and a { min, max, now, text } value", async () => {
    await renderStepper({ value: 4, min: 1, max: 9, formatValue: (v) => `${v} days` });

    expect(adjustable().props.accessibilityLabel).toBe("Fajr");
    expect(adjustable().props.accessibilityValue).toEqual({
      min: 1,
      max: 9,
      now: 4,
      text: "4 days",
    });
    expect(screen.getByText("4 days")).toBeTruthy();
  });

  it("increment calls onChange(value + step)", async () => {
    const onChange = jest.fn();
    await renderStepper({ value: 4, step: 2, max: 10, onChange });

    await runAction("increment");

    expect(onChange).toHaveBeenCalledWith(6);
  });

  it("decrement calls onChange(value - step), clamped to min", async () => {
    const onChange = jest.fn();
    await renderStepper({ value: 1, step: 5, min: 0, onChange });

    await runAction("decrement");

    expect(onChange).toHaveBeenCalledWith(0);
  });

  it("increment is a no-op at max; legacy handlers work without onChange", async () => {
    const handlers = await renderStepper({ value: 3, max: 3 });

    await runAction("increment");
    await runAction("decrement");

    expect(handlers.onIncrement).not.toHaveBeenCalled();
    expect(handlers.onDecrement).toHaveBeenCalledTimes(1);
  });

  it("activate opens the value editor when onValuePress is set", async () => {
    const onValuePress = jest.fn();
    await renderStepper({ onValuePress });

    expect(adjustable().props.accessibilityActions).toContainEqual({ name: "activate" });
    await runAction("activate");

    expect(onValuePress).toHaveBeenCalledTimes(1);
  });
});

describe("Stepper on web", () => {
  usePlatform({ OS: "web" });

  it("is a labelled group with a polite live value instead of a slider", async () => {
    await renderStepper();

    expect(queryHostsByRole("adjustable")).toHaveLength(0);
    expect(screen.getByLabelText("Fajr").props.role).toBe("group");
    expect(screen.getByText("3").props.accessibilityLiveRegion).toBe("polite");
  });
});

describe("Stepper on TV", () => {
  usePlatform({ isTV: true });

  it("labels the tappable value with the stepper label by default", async () => {
    const onValuePress = jest.fn();
    await renderStepper({ onValuePress });

    await fireEvent.press(screen.getByLabelText("Fajr"));

    expect(onValuePress).toHaveBeenCalled();
  });

  it("dims a bound without disabling it, so D-pad focus stays", async () => {
    const { onDecrement } = await renderStepper({ value: 0 });

    await fireEvent.press(decrease());

    expect(onDecrement).not.toHaveBeenCalled();
    expect(decrease().props.accessibilityState).toEqual({ disabled: true });
    expect(hostStyle(decrease()).opacity).toBe(Opacity.disabled);
    expect(queryHostsByRole("adjustable")).toHaveLength(0);
  });
});
