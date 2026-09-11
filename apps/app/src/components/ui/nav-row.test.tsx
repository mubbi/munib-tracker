import { fireEvent, render, screen } from "@testing-library/react-native";

import { NavRow } from "@/components/ui/nav-row";
import { MunibThemeProvider } from "@/providers/theme-provider";

const ICON = { ios: "book.fill", android: "menu_book", web: "menu_book" } as const;

describe("NavRow", () => {
  it("announces a string badge and completed state", () => {
    const onPress = jest.fn();
    render(
      <MunibThemeProvider>
        <NavRow icon={ICON} label="Morning Adhkar" badge="Done" completed onPress={onPress} />
      </MunibThemeProvider>,
    );

    fireEvent.press(screen.getByLabelText("Morning Adhkar, Done"));
    expect(onPress).toHaveBeenCalled();
    expect(screen.getByText("Done")).toBeTruthy();
  });

  it("falls back to a numeric count when no badge is passed", () => {
    render(
      <MunibThemeProvider>
        <NavRow icon={ICON} label="Evening Adhkar" count={14} onPress={jest.fn()} />
      </MunibThemeProvider>,
    );

    expect(screen.getByLabelText("Evening Adhkar, 14")).toBeTruthy();
    expect(screen.getByText("14")).toBeTruthy();
  });
});
