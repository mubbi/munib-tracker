import { fireEvent, screen } from "@testing-library/react-native";

import { Button } from "@/components/ui/button";
import { NAMES_OF_ALLAH_ICON } from "@/lib/names-of-allah-ui";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

type Props = Parameters<typeof Button>[0];

const renderButton = (props: Partial<Props> = {}) =>
  renderWithTheme(<Button label="Save" {...props} />);

const buttonStyle = () => flattenStyle(screen.getByRole("button").props.style);

describe("Button", () => {
  it("fires onPress", async () => {
    const onPress = jest.fn();
    await renderButton({ onPress, accessibilityHint: "Saves" });

    await fireEvent.press(screen.getByRole("button"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it.each(["primary", "secondary", "ghost"] as const)(
    "renders the %s variant with icons at full width",
    async (variant) => {
      await renderButton({
        variant,
        size: "sm",
        icon: "star",
        trailingIcon: "chevron.right",
        fullWidth: true,
      });

      expect(screen.getByText("Save")).toBeTruthy();
      expect(buttonStyle().alignSelf).toBe("stretch");
    },
  );

  it("blocks presses and announces disabled", async () => {
    const onPress = jest.fn();
    await renderButton({ disabled: true, onPress });

    await fireEvent.press(screen.getByRole("button"));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole("button").props.accessibilityState).toEqual({ disabled: true });
  });

  it("honours a label colour override", async () => {
    await renderButton({ labelColor: "#010203", icon: NAMES_OF_ALLAH_ICON });

    expect(flattenStyle(screen.getByText("Save").props.style).color).toBe("#010203");
  });
});

describe("Button on TV", () => {
  usePlatform({ isTV: true });

  it("requests preferred focus", async () => {
    await renderButton({ preferredFocus: true });

    expect(screen.getByRole("button").props.hasTVPreferredFocus).toBe(true);
  });

  it.each([
    ["sm", 48],
    ["md", 56],
  ] as const)("uses a %s focus target of at least %ipt", async (size, min) => {
    await renderButton({ size });

    expect(buttonStyle().minHeight).toBeGreaterThanOrEqual(min);
  });
});
