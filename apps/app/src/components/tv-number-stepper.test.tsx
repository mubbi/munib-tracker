import { fireEvent, screen } from "@testing-library/react-native";

import { TvNumberStepper } from "@/components/tv-number-stepper";
import { usePlatform } from "@/test-support/platform";
import { parentOf } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";

type Props = Parameters<typeof TvNumberStepper>[0];

const renderStepper = async (props: Partial<Props> = {}) => {
  const onChange = jest.fn();
  await renderWithTheme(<TvNumberStepper value={5} label="Age" onChange={onChange} {...props} />);
  return onChange;
};

const step = (label: string) => parentOf(screen.getByText(label), 2);

describe("TvNumberStepper", () => {
  it("shows the value between mirrored step buttons", async () => {
    await renderStepper({ steps: [10, 1] });

    expect(screen.getByLabelText("Age: 5")).toBeTruthy();
    expect(["−10", "−1", "+1", "+10"].map((label) => screen.getByText(label))).toHaveLength(4);
  });

  it.each([
    ["+10", 15],
    ["−1", 4],
  ])("%s changes the value to %i", async (label, next) => {
    const onChange = await renderStepper();

    await fireEvent.press(step(label));

    expect(onChange).toHaveBeenCalledWith(next);
  });

  it("clamps to the bounds", async () => {
    const onChange = await renderStepper({ value: 8, max: 10 });

    await fireEvent.press(step("+10"));

    expect(onChange).toHaveBeenCalledWith(10);
  });

  it("ignores presses at a bound but keeps the button focusable", async () => {
    const onChange = await renderStepper({ value: 0 });

    await fireEvent.press(step("−1"));

    expect(onChange).not.toHaveBeenCalled();
    expect(step("−1").props.accessibilityState).toEqual({ disabled: true });
  });

  it("focuses the smallest increment first", async () => {
    await renderStepper({ preferredFocus: true, buttonBackground: "#000000" });

    expect(step("+1").props.hasTVPreferredFocus).toBe(true);
    expect(step("+10").props.hasTVPreferredFocus).toBeUndefined();
  });
});

describe("TvNumberStepper on TV", () => {
  usePlatform({ isTV: true });

  it("names each step for the remote", async () => {
    await renderStepper();

    expect(step("+10").props.accessibilityLabel).toMatch(/10/);
  });
});
