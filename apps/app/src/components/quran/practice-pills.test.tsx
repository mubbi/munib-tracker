import { fireEvent, screen } from "@testing-library/react-native";

import { type PracticePillOption, PracticePills } from "@/components/quran/practice-pills";
import { renderWithTheme } from "@/test-support/render";

type Mode = "follow" | "check";

const OPTIONS: PracticePillOption<Mode>[] = [
  { id: "follow", label: "Follow", icon: { ios: "ear", android: "hearing", web: "hearing" } },
  { id: "check", label: "Check" },
];

async function renderPills(value: Mode = "follow") {
  const onChange = jest.fn();
  await renderWithTheme(
    <PracticePills options={OPTIONS} value={value} onChange={onChange} accessibilityLabel="Mode" />,
  );
  return { onChange };
}

describe("PracticePills", () => {
  it("labels the group for assistive tech", async () => {
    await renderPills();
    expect(screen.getByLabelText("Mode")).toBeTruthy();
  });

  it.each([
    ["follow", "Follow", "Check"],
    ["check", "Check", "Follow"],
  ] as const)("marks only the %s pill as selected", async (value, selected, other) => {
    await renderPills(value);
    expect(screen.getByLabelText(selected)).toBeSelected();
    expect(screen.getByLabelText(other)).not.toBeSelected();
  });

  it("reports the pressed option id", async () => {
    const { onChange } = await renderPills("follow");
    await fireEvent.press(screen.getByLabelText("Check"));
    expect(onChange).toHaveBeenCalledWith("check");
  });
});
