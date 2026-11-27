import { fireEvent, screen } from "@testing-library/react-native";
import { useState } from "react";

import { asciiNumberInput, isNumberInRange, NumberField } from "@/components/ui/number-field";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

type HarnessProps = Partial<Parameters<typeof NumberField>[0]> & {
  onValue?: (v: number | undefined) => void;
};

function Harness({ onValue, ...rest }: HarnessProps) {
  const [v, setV] = useState<number | undefined>(rest.value);
  return (
    <NumberField
      label="Amount"
      {...rest}
      value={v}
      onChangeValue={(n) => {
        setV(n);
        onValue?.(n);
      }}
    />
  );
}

describe("NumberField", () => {
  it("groups, parses and reports the value; keeps trailing decimal", async () => {
    const onValue = jest.fn();
    await renderWithTheme(<Harness onValue={onValue} />);

    await fireEvent.changeText(screen.getByLabelText("Amount"), "1234.");

    expect(screen.getByLabelText("Amount").props.value).toBe("1,234.");
    expect(onValue).toHaveBeenLastCalledWith(1234);
  });

  it("honours the user's number format", async () => {
    const onValue = jest.fn();
    await renderWithTheme(<Harness onValue={onValue} numberFormat="dot_comma" />);

    await fireEvent.changeText(screen.getByLabelText("Amount"), "1234,5");

    expect(screen.getByLabelText("Amount").props.value).toBe("1.234,5");
    expect(onValue).toHaveBeenLastCalledWith(1234.5);
  });

  it("accepts Eastern Arabic digits and separators", () => {
    expect(asciiNumberInput("١٢٣٫٤", "comma_dot")).toBe("123.4");
    expect(asciiNumberInput("۱۲۳", "comma_dot")).toBe("123");
    expect(asciiNumberInput("١٢٣٫٤", "dot_comma")).toBe("123,4");
  });

  it("reports undefined for zero unless allowZero is set", async () => {
    const onValue = jest.fn();
    const view = await renderWithTheme(<Harness onValue={onValue} max={100} />);

    await fireEvent.changeText(screen.getByLabelText("Amount"), "0");
    expect(onValue).toHaveBeenLastCalledWith(undefined);
    expect(screen.getByLabelText("Amount").props.value).toBe("0");

    await view.rerender(<Harness onValue={onValue} max={30} allowZero maxFractionDigits={0} />);
    await fireEvent.changeText(screen.getByLabelText("Amount"), "0");
    expect(onValue).toHaveBeenLastCalledWith(0);
    expect(screen.queryByText(/Enter/)).toBeNull();
  });

  it("never clamps a value above max: reports it as typed and shows the range error (B-03)", async () => {
    const onValue = jest.fn();
    await renderWithTheme(<Harness onValue={onValue} max={100} maxFractionDigits={0} />);
    const input = screen.getByLabelText("Amount");

    await fireEvent.changeText(input, "500");

    expect(onValue).toHaveBeenLastCalledWith(500);
    expect(screen.getByLabelText("Amount").props.value).toBe("500");
    expect(screen.getByText("Enter 100 or less")).toBeTruthy();

    await fireEvent.changeText(screen.getByLabelText("Amount"), "50");
    expect(onValue).toHaveBeenLastCalledWith(50);
    expect(screen.queryByText("Enter 100 or less")).toBeNull();
  });

  it("flags a value below min (including a typed 0 that reports empty)", async () => {
    const onValue = jest.fn();
    await renderWithTheme(<Harness onValue={onValue} min={1} max={31} maxFractionDigits={0} />);

    await fireEvent.changeText(screen.getByLabelText("Amount"), "0");

    expect(onValue).toHaveBeenLastCalledWith(undefined);
    expect(screen.getByText("Enter a number from 1 to 31")).toBeTruthy();
  });

  it("lets the caller's error win over the range error", async () => {
    await renderWithTheme(<Harness max={10} maxFractionDigits={0} error="Too old" />);

    await fireEvent.changeText(screen.getByLabelText("Amount"), "99");

    expect(screen.getByText("Too old")).toBeTruthy();
    expect(screen.queryByText("Enter 10 or less")).toBeNull();
  });

  it("isNumberInRange checks optional bounds", () => {
    expect(isNumberInRange(undefined, 1, 10)).toBe(true);
    expect(isNumberInRange(0, 0, 10)).toBe(true);
    expect(isNumberInRange(11, 0, 10)).toBe(false);
    expect(isNumberInRange(0, 1)).toBe(false);
    expect(isNumberInRange(1e9)).toBe(true);
  });

  it("re-seeds the display from the value on a format switch without reporting a change (B-15)", async () => {
    const onChangeValue = jest.fn();
    const view = await renderWithTheme(
      <NumberField label="Amount" value={1234.5} onChangeValue={onChangeValue} />,
    );
    expect(screen.getByLabelText("Amount").props.value).toBe("1,234.5");

    await view.rerender(
      <NumberField
        label="Amount"
        value={1234.5}
        numberFormat="dot_comma"
        onChangeValue={onChangeValue}
      />,
    );
    expect(screen.getByLabelText("Amount").props.value).toBe("1.234,5");

    await view.rerender(
      <NumberField
        label="Amount"
        value={1234.5}
        numberFormat="dot_comma"
        maxFractionDigits={0}
        onChangeValue={onChangeValue}
      />,
    );
    expect(screen.getByLabelText("Amount").props.value).toBe("1.235");
    expect(onChangeValue).not.toHaveBeenCalled();
  });

  it("keeps mid-edit text while the format is unchanged", async () => {
    await renderWithTheme(<Harness value={5} />);
    await fireEvent.changeText(screen.getByLabelText("Amount"), "12.");
    expect(screen.getByLabelText("Amount").props.value).toBe("12.");
  });

  it("re-formats the text when the number format changes (B-15)", async () => {
    const onValue = jest.fn();
    const view = await renderWithTheme(<Harness onValue={onValue} numberFormat="comma_dot" />);
    await fireEvent.changeText(screen.getByLabelText("Amount"), "1234.5");
    expect(onValue).toHaveBeenLastCalledWith(1234.5);

    await view.rerender(<Harness onValue={onValue} numberFormat="dot_comma" />);
    expect(screen.getByLabelText("Amount").props.value).toBe("1.234,5");

    await fireEvent.changeText(screen.getByLabelText("Amount"), "1.234,56");
    expect(onValue).toHaveBeenLastCalledWith(1234.56);
  });

  it("uses a decimal keyboard for money and numeric for integers; shows affixes", async () => {
    const view = await renderWithTheme(<Harness prefix="$" suffix="USD" />);
    expect(screen.getByLabelText("Amount").props.keyboardType).toBe("decimal-pad");
    expect(screen.getByLabelText("Amount").props.inputMode).toBe("decimal");
    expect(screen.getByText("$")).toBeTruthy();
    expect(screen.getByText("USD")).toBeTruthy();

    await view.rerender(<Harness maxFractionDigits={0} />);
    expect(screen.getByLabelText("Amount").props.keyboardType).toBe("number-pad");
  });

  it("re-seeds from an external value change", async () => {
    const view = await renderWithTheme(
      <NumberField label="Amount" value={5} onChangeValue={() => {}} />,
    );
    expect(screen.getByLabelText("Amount").props.value).toBe("5");

    await view.rerender(<NumberField label="Amount" value={undefined} onChangeValue={() => {}} />);
    expect(screen.getByLabelText("Amount").props.value).toBe("");
  });

  describe("tv", () => {
    usePlatform({ OS: "android", isTV: true });
    it("steps with the - / + buttons", async () => {
      const onValue = jest.fn();
      await renderWithTheme(<Harness onValue={onValue} value={5} step={2} />);

      await fireEvent.press(screen.getByLabelText(/increase/i));

      expect(onValue).toHaveBeenLastCalledWith(7);
    });

    it("keeps − / + focusable at a bound but reports them disabled and ignores presses", async () => {
      const onValue = jest.fn();
      await renderWithTheme(<Harness onValue={onValue} value={10} max={10} allowZero />);

      const plus = screen.getByLabelText(/increase/i);
      const minus = screen.getByLabelText(/decrease/i);
      expect(plus.props.accessibilityState).toMatchObject({ disabled: true });
      // Still a live D-pad target: no `disabled` prop that would drop focus.
      expect(plus.props.focusable).not.toBe(false);
      expect(minus.props.accessibilityState).toMatchObject({ disabled: false });

      await fireEvent.press(plus);
      expect(onValue).not.toHaveBeenCalled();

      await fireEvent.press(minus);
      expect(onValue).toHaveBeenLastCalledWith(9);
    });

    it("puts − and + after the input so the D-pad reaches them from the field", async () => {
      await renderWithTheme(<Harness value={3} />);

      const order = screen.container
        .queryAll((node) => typeof node.type === "string" && node.props.accessibilityLabel != null)
        .map((node) => String(node.props.accessibilityLabel));
      const input = order.indexOf("Amount");
      expect(input).toBeGreaterThanOrEqual(0);
      expect(order.findIndex((l) => /decrease/i.test(l))).toBeGreaterThan(input);
      expect(order.findIndex((l) => /increase/i.test(l))).toBeGreaterThan(
        order.findIndex((l) => /decrease/i.test(l)),
      );
    });
  });
});
