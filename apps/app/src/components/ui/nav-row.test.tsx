import { fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { NavRow } from "@/components/ui/nav-row";
import { type ThemeTokens, useThemeTokens } from "@/hooks/use-theme-tokens";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

let seen: ThemeTokens;
function Probe() {
  seen = useThemeTokens().tokens;
  return null;
}

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

describe("NavRow tokens", () => {
  it("completed trailing text uses status.success.onSoft", async () => {
    await renderWithTheme(
      <>
        <Probe />
        <NavRow icon={ICON} label="Row" badge="Done" completed onPress={jest.fn()} />
      </>,
    );
    expect(flattenStyle(screen.getByText("Done").props.style).color).toBe(
      seen.status.success.onSoft,
    );
  });

  it("danger tone colours the title with status.danger.text", async () => {
    await renderWithTheme(
      <>
        <Probe />
        <NavRow
          icon={ICON}
          label="Sign out"
          tone="danger"
          subtitle="Ends session"
          onPress={jest.fn()}
        />
      </>,
    );
    expect(flattenStyle(screen.getByText("Sign out").props.style).color).toBe(
      seen.status.danger.text,
    );
    expect(screen.getByText("Ends session")).toBeTruthy();
    expect(screen.getByLabelText("Sign out, Ends session")).toBeTruthy();
  });

  it("renders custom trailing content", async () => {
    await renderWithTheme(
      <NavRow icon={ICON} label="Language" trailing={<Text>English</Text>} onPress={jest.fn()} />,
    );
    expect(screen.getByText("English")).toBeTruthy();
  });
});
