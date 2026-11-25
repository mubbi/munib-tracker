import { screen } from "@testing-library/react-native";

import DuaDetailScreen from "@/app/dua/detail/[id]";
import { renderWithProviders } from "@/test-support/render";

const mockParams = jest.fn(() => ({ id: "does-not-exist-yet" }));
jest.mock("expo-router", () => ({
  ...jest.requireActual("expo-router"),
  useLocalSearchParams: () => mockParams(),
  useFocusEffect: jest.fn(),
}));

// A corpus that never resolves: the screen must still show its chrome.
jest.mock("@/hooks/use-content-corpus", () => ({
  useContentCorpus: () => ({ items: [], ready: false }),
}));

describe("Dua detail while the corpus loads (P5-35)", () => {
  it("renders the header and a back control instead of a blank screen", async () => {
    await renderWithProviders(<DuaDetailScreen />);
    expect(screen.getByText("Dua")).toBeTruthy();
    expect(screen.getByLabelText("Go back")).toBeTruthy();
  });
});
