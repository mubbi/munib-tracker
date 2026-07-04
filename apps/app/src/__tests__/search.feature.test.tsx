import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import SearchScreen from "@/app/search";
import * as search from "@/lib/search";
import { renderWithProviders } from "@/test-support/render";

/** Theme prefs hydrate from AsyncStorage before the screen paints. */
async function waitForSearchScreen() {
  await waitFor(
    () => {
      expect(screen.getByText("Try searching")).toBeTruthy();
    },
    { timeout: 15_000 },
  );
}

describe("Universal search screen", () => {
  jest.setTimeout(20_000);

  beforeEach(() => {
    // Skip the heavy Qur'an ayah index build in component tests; surah-name
    // matches (from the un-mocked light search) still exercise the Qur'an group.
    jest
      .spyOn(search, "searchQuranAyahs")
      .mockReturnValue({ category: "quran", results: [], total: 0 });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("shows suggestions when the field is empty", async () => {
    renderWithProviders(<SearchScreen />);
    await waitForSearchScreen();
    expect(screen.getByText("Forgiveness")).toBeTruthy();
  });

  it("groups results by section as the user types", async () => {
    renderWithProviders(<SearchScreen />);
    await waitForSearchScreen();
    const input = screen.getByPlaceholderText(/Search Qur'an/i);
    fireEvent.changeText(input, "rahman");

    await waitFor(() => {
      expect(screen.getAllByText("99 Names").length).toBeGreaterThan(0);
    });
    // A matching name row is present, labelled by its title (Ar-Rahman).
    expect(screen.getAllByLabelText(/Ar-Rahman/i).length).toBeGreaterThan(0);
    // The Qur'an group is present too (surah Ar-Rahman comes from light search).
    expect(screen.getAllByText("Qur'an").length).toBeGreaterThan(0);
  });

  it("clears the query and returns to suggestions", async () => {
    renderWithProviders(<SearchScreen />);
    await waitForSearchScreen();
    const input = screen.getByPlaceholderText(/Search Qur'an/i);
    fireEvent.changeText(input, "rahman");

    await waitFor(() => {
      expect(screen.getAllByText("99 Names").length).toBeGreaterThan(0);
    });

    fireEvent.press(screen.getByLabelText("Clear search"));

    await waitFor(() => {
      expect(screen.getByText("Try searching")).toBeTruthy();
    });
  });
});
