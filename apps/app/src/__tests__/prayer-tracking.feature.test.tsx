import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, render, screen, waitFor } from "@testing-library/react-native";
import type React from "react";

import HomeScreen from "@/app/(tabs)/index";
import { MunibThemeProvider } from "@/providers/theme-provider";
import { trackerStore } from "@/stores/tracker-store";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), canGoBack: () => false }),
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

async function loadStore() {
  await act(async () => {
    await trackerStore.getState().load();
  });
}

beforeEach(async () => {
  await AsyncStorage.clear();
  await loadStore();
});

describe("Prayer tracking dashboard", () => {
  it("reflects a completed prayer in the Prayers stat card", async () => {
    render(
      <MunibThemeProvider>
        <HomeScreen />
      </MunibThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("0/6")).toBeTruthy();
    });

    await act(async () => {
      await trackerStore.getState().setPrayerStatus("fajr", "completed");
    });

    await waitFor(() => {
      expect(screen.getByText("1/6")).toBeTruthy();
    });
  });
});
