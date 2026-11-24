import { fireEvent, screen } from "@testing-library/react-native";

import { type MadhhabChoice, MadhhabPicker } from "@/components/fiqh/madhhab-picker";
import { renderWithTheme } from "@/test-support/render";

function renderPicker(props: Partial<Parameters<typeof MadhhabPicker>[0]> = {}) {
  const onChange = jest.fn<void, [MadhhabChoice]>();
  return renderWithTheme(<MadhhabPicker value={undefined} onChange={onChange} {...props} />).then(
    () => onChange,
  );
}

const option = (key: string) => screen.getByTestId(`madhhab-option-${key}`);

describe("MadhhabPicker", () => {
  it("offers the four schools and Show all views, none selected when never asked", async () => {
    await renderPicker();
    for (const name of ["Hanafi", "Shafi'i", "Maliki", "Hanbali", "Show all views"]) {
      expect(screen.getByText(name)).toBeTruthy();
    }
    expect(screen.getAllByRole("radio").every((r) => !r.props.accessibilityState?.selected)).toBe(
      true,
    );
  });

  it.each([
    ["maliki", "maliki"],
    ["all", null],
  ] as const)("reports %s on press", async (key, expected) => {
    const onChange = await renderPicker();
    await fireEvent.press(option(key));
    expect(onChange).toHaveBeenCalledWith(expected);
  });

  it.each([
    ["hanbali", "hanbali"],
    [null, "all"],
  ] as const)("marks value %s as selected", async (value, key) => {
    await renderPicker({ value });
    expect(option(key).props.accessibilityState).toMatchObject({ selected: true });
  });

  it("describes each option for screen readers", async () => {
    await renderPicker();
    expect(
      screen.getByLabelText(
        "Maliki. The school of Imam Malik ibn Anas (d. 179 AH). Widely followed in North and West Africa.",
      ),
    ).toBeTruthy();
  });

  it("explains how to choose without recommending a school", async () => {
    await renderPicker();
    await fireEvent.press(
      screen.getByRole("button", { name: "Not sure which to choose? Show guidance" }),
    );
    const body = screen.getByText(/Follow what your family/);
    expect(body).toBeTruthy();
    expect(body.props.children).not.toMatch(/Hanafi|Shafi'i|Maliki|Hanbali/);
  });

  it("can hide Show all views and the explainer", async () => {
    await renderPicker({ hideAllViews: true, hideNotSure: true });
    expect(screen.queryByTestId("madhhab-option-all")).toBeNull();
    expect(screen.queryByText("Not sure?")).toBeNull();
  });
});
