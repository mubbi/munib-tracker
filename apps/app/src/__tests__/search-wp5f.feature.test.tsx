import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import SearchScreen from "@/app/search";
import * as search from "@/lib/search";
import { resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithProviders } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

async function typeQuery(text: string) {
  await waitFor(() => expect(screen.getByText("Try searching")).toBeTruthy(), { timeout: 15_000 });
  // Callers wait for the debounced (180 ms) results with `waitFor` / `findBy*`,
  // so there is no fixed sleep here.
  await fireEvent.changeText(screen.getByPlaceholderText(/Search Qur'an/i), text);
}

describe("Universal search (P5-33)", () => {
  beforeEach(() => {
    resetExpoRouterMock();
    jest
      .spyOn(search, "searchQuranAyahs")
      .mockReturnValue({ category: "quran", results: [], total: 0 });
  });
  afterEach(() => jest.restoreAllMocks());

  it("returns Library destinations as a result group", async () => {
    await renderWithProviders(<SearchScreen />);
    // The group only exists once the debounced search ran.
    expect(screen.queryAllByText("Library")).toHaveLength(0);
    await typeQuery("zakat");
    await waitFor(() => expect(screen.getAllByText("Library").length).toBeGreaterThan(0), {
      timeout: 5_000,
    });
  });

  it("offers two next steps when nothing matches", async () => {
    await renderWithProviders(<SearchScreen />);
    await typeQuery("qzxqzxqzxq");
    expect(await screen.findByText("Find an ayah", {}, { timeout: 5_000 })).toBeTruthy();
    expect(screen.getByText("Browse the Library")).toBeTruthy();
  });
});
