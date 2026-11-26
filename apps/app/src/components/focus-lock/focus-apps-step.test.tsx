import { fireEvent, screen, within } from "@testing-library/react-native";

import {
  FocusAlwaysAvailableCard,
  FocusIosAppsPicker,
} from "@/components/focus-lock/focus-apps-step";
import { renderWithTheme } from "@/test-support/render";

describe("FocusAlwaysAvailableCard", () => {
  it("lists what Salah focus never blocks, with a reason each", async () => {
    await renderWithTheme(<FocusAlwaysAvailableCard />);
    const card = screen.getByTestId("focus-always-available");
    expect(within(card).getByText("Always available")).toBeTruthy();
    for (const [label, hint] of [
      ["Phone", "Calls always ring through."],
      ["Messages", "Texts still arrive."],
      ["Emergency calls", "Emergency calling always works."],
      ["Munib Tracker", "So you can mark your Salah."],
    ]) {
      expect(within(card).getByText(label as string)).toBeTruthy();
      expect(within(card).getByText(hint as string)).toBeTruthy();
    }
  });
});

describe("FocusIosAppsPicker", () => {
  it("leads with a full-width Choose apps button before anything is picked", async () => {
    const onPick = jest.fn();
    await renderWithTheme(<FocusIosAppsPicker count={0} onPick={onPick} />);
    expect(screen.getByText("No apps chosen yet.")).toBeTruthy();
    await fireEvent.press(screen.getByText("Choose apps"));
    expect(onPick).toHaveBeenCalledTimes(1);
  });

  it("summarises the selection and offers Edit afterwards", async () => {
    const onPick = jest.fn();
    await renderWithTheme(<FocusIosAppsPicker count={13} onPick={onPick} />);
    expect(screen.getByText("13 items selected")).toBeTruthy();
    expect(
      screen.getByText("Apps, categories and websites you picked. A whole category counts as one."),
    ).toBeTruthy();
    expect(screen.queryByText("Choose apps")).toBeNull();
    await fireEvent.press(screen.getByText("Edit"));
    expect(onPick).toHaveBeenCalledTimes(1);
  });

  it("uses the singular for one item", async () => {
    await renderWithTheme(<FocusIosAppsPicker count={1} onPick={() => {}} />);
    expect(screen.getByText("1 item selected")).toBeTruthy();
  });
});
