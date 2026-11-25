import { screen } from "@testing-library/react-native";

import { PinDotsRow, PinKeypad } from "@/features/pin-lock/components/pin-keypad";
import { pressPinBackspace, pressPinDigits } from "@/test-support/pin-lock";
import { queryHostsByType } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

type KeypadProps = Parameters<typeof PinKeypad>[0];
type DotsProps = Parameters<typeof PinDotsRow>[0];

async function renderKeypad(props: Partial<KeypadProps> = {}) {
  const onDigit = jest.fn();
  const onBackspace = jest.fn();
  await renderWithTheme(<PinKeypad onDigit={onDigit} onBackspace={onBackspace} {...props} />);
  return { onDigit, onBackspace };
}

/** Renders a dots row and returns each dot's flattened style. */
async function renderDots(props: DotsProps) {
  await renderWithTheme(<PinDotsRow {...props} />);
  return screen.container
    .queryAll((node) => node.type === "View" && flattenStyle(node.props.style).width === 14)
    .map((dot) => flattenStyle(dot.props.style));
}

describe("PinKeypad", () => {
  it("forwards every digit key", async () => {
    const { onDigit } = await renderKeypad();
    await pressPinDigits("1234567890");
    expect(onDigit.mock.calls.flat().join("")).toBe("1234567890");
  });

  it("forwards backspace", async () => {
    const { onBackspace } = await renderKeypad();
    await pressPinBackspace();
    expect(onBackspace).toHaveBeenCalledTimes(1);
  });

  it("ignores presses while disabled", async () => {
    const { onDigit, onBackspace } = await renderKeypad({ disabled: true });
    await pressPinDigits("5");
    await pressPinBackspace();
    expect(onDigit).not.toHaveBeenCalled();
    expect(onBackspace).not.toHaveBeenCalled();
  });

  it("gives every key a role and a spoken name (backspace is an icon, not a glyph)", async () => {
    await renderKeypad();
    for (const digit of "0123456789") {
      expect(screen.getByLabelText(digit).props.accessibilityRole).toBe("keyboardkey");
    }
    expect(screen.getByLabelText("Backspace").props.accessibilityRole).toBe("keyboardkey");
    expect(screen.queryByText("⌫")).toBeNull();
  });

  it("swaps the keys for a spinner while loading", async () => {
    await renderKeypad({ loading: true });
    expect(screen.queryByLabelText("1")).toBeNull();
    expect(queryHostsByType("ActivityIndicator")).toHaveLength(1);
  });
});

describe("PinDotsRow", () => {
  it("fills dots up to the filled count", async () => {
    const dots = await renderDots({ filledCount: 2 });
    expect(dots.map((d) => d.backgroundColor === "transparent")).toEqual([
      false,
      false,
      true,
      true,
      true,
      true,
    ]);
  });

  it("fills and fades every dot while loading", async () => {
    const dots = await renderDots({ filledCount: 0, isLoading: true });
    expect(dots.every((d) => d.backgroundColor !== "transparent")).toBe(true);
    expect(dots[0].opacity).toBeCloseTo(0.45);
  });

  it("uses a danger border on error, except while loading", async () => {
    const [plain] = await renderDots({ filledCount: 0 });
    const [errored] = await renderDots({ filledCount: 0, hasError: true });
    const [loading] = await renderDots({ filledCount: 0, hasError: true, isLoading: true });
    expect(errored.borderColor).not.toBe(plain.borderColor);
    expect(loading.borderColor).toBe(plain.borderColor);
  });
});
