import { fireEvent, render, screen } from "@testing-library/react-native";

import { FavoritesOrderRow } from "@/components/ui/favorites-order-row";
import { MunibThemeProvider } from "@/providers/theme-provider";

describe("FavoritesOrderRow", () => {
  it("shows remaining progress and includes it in the accessibility label", () => {
    const onPress = jest.fn();
    render(
      <MunibThemeProvider>
        <FavoritesOrderRow
          index={0}
          total={2}
          title="Ayat al-Kursi"
          onPress={onPress}
          onMove={jest.fn()}
          onRemove={jest.fn()}
          removeAccessibilityLabel="Unfavorite"
          progressLabel="1/3"
        />
      </MunibThemeProvider>,
    );

    fireEvent.press(screen.getByLabelText("1. Ayat al-Kursi, 1/3"));
    expect(onPress).toHaveBeenCalled();
    expect(screen.getByText("1/3")).toBeTruthy();
  });

  it("shows a Done pill when the favorite is complete", () => {
    render(
      <MunibThemeProvider>
        <FavoritesOrderRow
          index={1}
          total={2}
          title="Ayat al-Kursi"
          onPress={jest.fn()}
          onMove={jest.fn()}
          onRemove={jest.fn()}
          removeAccessibilityLabel="Unfavorite"
          completed
        />
      </MunibThemeProvider>,
    );

    expect(screen.getByLabelText("2. Ayat al-Kursi, Done")).toBeTruthy();
    expect(screen.getByText("Done")).toBeTruthy();
  });
});
