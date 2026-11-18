import { fireEvent, screen } from "@testing-library/react-native";

import { NavRow } from "@/components/ui/nav-row";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

const ICON = { ios: "book.fill", android: "menu_book", web: "menu_book" } as const;

type Props = Parameters<typeof NavRow>[0];

const renderRow = (props: Partial<Props> = {}) =>
  renderWithTheme(<NavRow icon={ICON} label="Morning Adhkar" onPress={jest.fn()} {...props} />);

describe("NavRow", () => {
  it.each([
    [{ badge: "Done", completed: true }, "Morning Adhkar, Done", "Done"],
    [{ count: 14 }, "Morning Adhkar, 14", "14"],
    [{ badge: "3/14", count: 9 }, "Morning Adhkar, 3/14", "3/14"],
  ])("with %o is announced as %s and shows %s", async (props, label, trailing) => {
    await renderRow(props);

    expect(screen.getByLabelText(label)).toBeTruthy();
    expect(screen.getByText(trailing)).toBeTruthy();
  });

  it("navigates on press", async () => {
    const onPress = jest.fn();
    await renderRow({ onPress });

    await fireEvent.press(screen.getByRole("button"));

    expect(onPress).toHaveBeenCalled();
  });

  it("announces the New badge", async () => {
    await renderRow({ isNew: true, newLabel: "New" });

    expect(screen.getByLabelText("Morning Adhkar, New")).toBeTruthy();
  });

  it("has no trailing badge by default", async () => {
    await renderRow();

    expect(screen.getByLabelText("Morning Adhkar")).toBeTruthy();
  });
});

describe("NavRow on TV", () => {
  usePlatform({ isTV: true });

  it.each([
    [true, true],
    [false, undefined],
  ])("preferredFocus=%s sets hasTVPreferredFocus=%s", async (preferredFocus, expected) => {
    await renderRow({ preferredFocus });

    expect(screen.getByRole("button").props.hasTVPreferredFocus).toBe(expected);
  });
});
