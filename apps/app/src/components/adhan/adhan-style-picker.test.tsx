import { fireEvent, screen } from "@testing-library/react-native";

import { AdhanStylePicker } from "@/components/adhan/adhan-style-picker";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

async function renderPicker(value = "default") {
  const onChange = jest.fn();
  await renderWithTheme(<AdhanStylePicker value={value} onChange={onChange} />);
  return onChange;
}

describe("AdhanStylePicker", () => {
  it("marks the current style", async () => {
    await renderPicker("mecca-fajr");
    expect(screen.getByLabelText("Mecca — Fajr").props.accessibilityState).toEqual({
      selected: true,
    });
    expect(screen.getByLabelText("Classic adhan").props.accessibilityState).toEqual({
      selected: false,
    });
  });

  it("selects another style", async () => {
    const onChange = await renderPicker();
    await fireEvent.press(screen.getByLabelText("Mecca — Fajr"));
    expect(onChange).toHaveBeenCalledWith("mecca-fajr");
  });

  it("ignores re-selecting the current style", async () => {
    const onChange = await renderPicker();
    await fireEvent.press(screen.getByLabelText("Classic adhan"));
    expect(onChange).not.toHaveBeenCalled();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("still selects styles", async () => {
      const onChange = await renderPicker();
      await fireEvent.press(screen.getByLabelText("Mecca — Fajr"));
      expect(onChange).toHaveBeenCalledWith("mecca-fajr");
    });
  });
});
