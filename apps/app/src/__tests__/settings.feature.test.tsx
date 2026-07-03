import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import AppearanceScreen from "@/app/settings/appearance";
import { MunibThemeProvider } from "@/providers/theme-provider";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), canGoBack: () => false }),
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

function renderSettings() {
  return render(
    <MunibThemeProvider>
      <AppearanceScreen />
    </MunibThemeProvider>,
  );
}

describe("Settings screen feature", () => {
  it("updates accent color when a swatch is selected", async () => {
    renderSettings();

    await waitFor(() => {
      expect(screen.getByText(/Current mode:/)).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("Teal"));

    await waitFor(() => {
      expect(screen.getByText(/accent: teal/i)).toBeTruthy();
    });
  });

  it("updates color mode when dark is selected", async () => {
    renderSettings();

    await waitFor(() => {
      expect(screen.getByText("Dark")).toBeTruthy();
    });

    fireEvent.press(screen.getByText("Dark"));

    await waitFor(() => {
      expect(screen.getByText(/Current mode: dark/i)).toBeTruthy();
    });
  });
});
