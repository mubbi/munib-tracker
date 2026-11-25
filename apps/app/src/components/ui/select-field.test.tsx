import { fireEvent, screen } from "@testing-library/react-native";

import { SelectField } from "@/components/ui/select-field";
import { renderWithTheme } from "@/test-support/render";

const options = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta", description: "Second" },
];

describe("SelectField", () => {
  it("shows the selected label or placeholder", async () => {
    const view = await renderWithTheme(
      <SelectField
        label="Letter"
        options={options}
        value={undefined}
        onChange={() => {}}
        placeholder="Pick one"
      />,
    );
    expect(screen.getByText("Pick one")).toBeTruthy();

    await view.rerender(
      <SelectField label="Letter" options={options} value="b" onChange={() => {}} />,
    );
    expect(screen.getByText("Beta")).toBeTruthy();
  });

  it("opens a sheet and selects", async () => {
    const onChange = jest.fn();
    await renderWithTheme(
      <SelectField label="Letter" options={options} value="a" onChange={onChange} />,
    );

    await fireEvent.press(screen.getByLabelText(/^Letter, Alpha/));
    await fireEvent.press(screen.getByLabelText("Beta"));

    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("shows an error as an alert", async () => {
    await renderWithTheme(
      <SelectField
        label="Letter"
        options={options}
        value={undefined}
        onChange={() => {}}
        error="Choose a letter"
      />,
    );

    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByText("Choose a letter")).toBeTruthy();
  });
});
