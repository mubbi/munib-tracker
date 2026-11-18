import { fireEvent, screen } from "@testing-library/react-native";

import { Stepper } from "@/components/ui/stepper";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

type Props = Parameters<typeof Stepper>[0];

const renderStepper = (props: Partial<Props> = {}) => {
  const handlers = { onIncrement: jest.fn(), onDecrement: jest.fn(), ...props };
  return renderWithTheme(<Stepper value={3} label="Fajr" {...handlers} />).then(() => handlers);
};

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
  });

  it("disables decrement at the minimum", async () => {
    const { onDecrement } = await renderStepper({ value: 0 });

    await fireEvent.press(screen.getByLabelText(/decrease/i));

    expect(onDecrement).not.toHaveBeenCalled();
  });

  it("makes the value tappable when onValuePress is set", async () => {
    const onValuePress = jest.fn();
    await renderStepper({ onValuePress, valueAccessibilityLabel: "Edit Fajr count" });

    await fireEvent.press(screen.getByLabelText("Edit Fajr count"));

    expect(onValuePress).toHaveBeenCalledTimes(1);
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
});
