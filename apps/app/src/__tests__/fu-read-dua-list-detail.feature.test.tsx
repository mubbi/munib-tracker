import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import BookmarksHubScreen from "@/app/bookmarks/index";
import DuaDetailScreen from "@/app/dua/detail/[id]";
import i18n from "@/i18n";
import { DUA_CORPUS } from "@/lib/content-loaders";
import { groupDuasByOccasion } from "@/lib/dua-browse";
import { ToastHost } from "@/providers/toast-provider";
import { duaFavoritesStore } from "@/stores/dua-favorites-store";
import {
  mockRouter,
  resetExpoRouterMock,
  setMockSearchParams,
} from "@/test-support/mocks/expo-router";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { renderWithProviders } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

async function categoryDuas() {
  const items = await DUA_CORPUS.load();
  const first = items[0];
  const category = groupDuasByOccasion(
    items.filter((item) => item.categoryId === first.categoryId),
  ).flatMap((section) => section.items);
  return { items, category };
}

describe("Dua list–detail (D-UX11)", () => {
  beforeEach(() => {
    resetExpoRouterMock();
    resetMockWindowSize();
  });
  afterAll(resetMockWindowSize);

  it("shows the category list beside the dua at wide width and replaces the route on pick", async () => {
    const { category } = await categoryDuas();
    expect(category.length).toBeGreaterThan(1);
    setMockWindowSize(1400);
    setMockSearchParams({ id: category[0].id });
    await renderWithProviders(<DuaDetailScreen />);

    const selected = await screen.findByLabelText(/^1\. /);
    expect(selected.props.accessibilityState).toEqual(expect.objectContaining({ selected: true }));
    fireEvent.press(screen.getByLabelText(/^2\. /));
    expect(mockRouter.replace).toHaveBeenCalledWith({
      pathname: "/dua/detail/[id]",
      params: { id: category[1].id },
    });
  });

  it("keeps the phone layout single column", async () => {
    const { category } = await categoryDuas();
    setMockWindowSize(390);
    setMockSearchParams({ id: category[0].id });
    await renderWithProviders(<DuaDetailScreen />);
    await screen.findAllByText(/./);
    expect(screen.queryByLabelText(/^2\. /)).toBeNull();
  });

  it("un-saving offers Undo that restores the saved position (B-30)", async () => {
    const { category } = await categoryDuas();
    const [a, b, c] = category;
    await duaFavoritesStore.getState().setOrder([a.id, b.id, c.id].filter(Boolean));
    setMockSearchParams({ id: b.id });
    await renderWithProviders(
      <>
        <DuaDetailScreen />
        <ToastHost />
      </>,
    );
    fireEvent.press(await screen.findByLabelText("Saved"));
    await waitFor(() => expect(duaFavoritesStore.getState().order).not.toContain(b.id));
    fireEvent.press(await screen.findByText(i18n.t("uiFeedback.undo")));
    await waitFor(() =>
      expect(duaFavoritesStore.getState().order).toEqual([a.id, b.id, c.id].filter(Boolean)),
    );
  });
});

describe("Saved hub Recent list (B-32)", () => {
  it("mounts the 20 most recent rows and expands with Show all", async () => {
    const items = await DUA_CORPUS.load();
    const ids = items.slice(0, 25).map((item) => item.id);
    await duaFavoritesStore.getState().setOrder(ids);
    await renderWithProviders(<BookmarksHubScreen />);
    const showAll = await screen.findByText(i18n.t("bookmarks.showAll", { total: 25 }));
    fireEvent.press(showAll);
    await waitFor(() =>
      expect(screen.queryByText(i18n.t("bookmarks.showAll", { total: 25 }))).toBeNull(),
    );
  });
});
