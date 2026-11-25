import { fireEvent, screen } from "@testing-library/react-native";

import { Checkbox } from "@/components/ui/checkbox";
import { Control } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { pressableProps } from "@/test-support/fiber";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

type Props = Parameters<typeof Checkbox>[0];

const renderCheckbox = async (props: Partial<Props> = {}) => {
  const onChange = jest.fn();
  await renderWithTheme(
    <Checkbox label="I understand" checked={false} onChange={onChange} {...props} />,
  );
  return { onChange };
};

const box = () => screen.getByRole("checkbox", { name: "I understand" });
const minHeight = () =>
  flattenStyle(
    pressableProps<{ style: (s: { pressed: boolean }) => object }>(box()).style({
      pressed: false,
    }),
  ).minHeight;

describe("Checkbox", () => {
  it("exposes role checkbox with its checked state", async () => {
    await renderCheckbox({ checked: true, description: "This can't be undone" });

    expect(box().props.accessibilityState).toMatchObject({ checked: true, disabled: false });
    expect(box().props.accessibilityHint).toBe("This can't be undone");
  });

  it("toggles from the whole row", async () => {
    const { onChange } = await renderCheckbox();

    await fireEvent.press(screen.getByText("I understand"));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("does nothing while disabled", async () => {
    const { onChange } = await renderCheckbox({ disabled: true });

    await fireEvent.press(box());

    expect(onChange).not.toHaveBeenCalled();
    expect(box().props.accessibilityState).toMatchObject({ disabled: true });
  });

  it("meets the 44pt target", async () => {
    await renderCheckbox();

    expect(minHeight()).toBeGreaterThanOrEqual(Control.md);
  });
});

describe("Checkbox on TV", () => {
  usePlatform({ isTV: true });

  it("uses the TV focus target height", async () => {
    await renderCheckbox();

    expect(minHeight()).toBe(TvLayout.minFocusTarget);
  });
});
