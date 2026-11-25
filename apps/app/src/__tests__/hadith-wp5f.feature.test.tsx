import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import HadithCollectionScreen from "@/app/hadith/[collection]";
import HadithBookmarksScreen from "@/app/hadith/bookmarks";
import HadithHomeScreen from "@/app/hadith/index";
import { HadithRepository } from "@/db";
import { useRemoteCollection } from "@/hooks/use-hadith";
import i18n from "@/i18n";
import { ensureBundledCollectionData } from "@/lib/hadith";
import { ToastHost } from "@/providers/toast-provider";
import {
  mockRouter,
  resetExpoRouterMock,
  setMockSearchParams,
} from "@/test-support/mocks/expo-router";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { renderWithProviders } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/content-report/content-report-button", () => ({
  ContentReportButton: () => null,
}));
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);
jest.mock("@/hooks/use-hadith", () => ({
  ...jest.requireActual("@/hooks/use-hadith"),
  useRemoteCollection: jest.fn(),
}));

const refetch = jest.fn();

describe("Hadith (P5-34)", () => {
  beforeEach(() => {
    resetExpoRouterMock();
    refetch.mockClear();
  });

  it("shows a Try again card wired to refetch when a remote collection fails offline", async () => {
    setMockSearchParams({ collection: "bukhari" });
    (useRemoteCollection as jest.Mock).mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      refetch,
    });
    await renderWithProviders(<HadithCollectionScreen />);
    fireEvent.press(await screen.findByText("Try again"));
    expect(refetch).toHaveBeenCalled();
  });

  it("marks bundled collections as available offline on the hub", async () => {
    await renderWithProviders(<HadithHomeScreen />);
    expect((await screen.findAllByText("Available offline")).length).toBeGreaterThan(0);
  });

  it("filters hub collections and offers a clear action when nothing matches", async () => {
    await renderWithProviders(<HadithHomeScreen />);
    fireEvent.changeText(await screen.findByPlaceholderText(/Search collections/i), "zzzzqq");
    expect(await screen.findByText("No matches found")).toBeTruthy();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});

describe("Hadith collection list–detail (D-UX11)", () => {
  beforeEach(() => {
    resetExpoRouterMock();
    (useRemoteCollection as jest.Mock).mockReturnValue({
      data: undefined,
      isPending: false,
      isError: false,
      refetch,
    });
  });
  afterEach(() => resetMockWindowSize());

  it("shows the books pane and a choose-a-book prompt at wide width without writing params", async () => {
    setMockWindowSize(1400);
    setMockSearchParams({ collection: "riyad_assalihin" });
    const data = await ensureBundledCollectionData("riyad_assalihin");
    const first = data?.sections[0];
    if (!first) throw new Error("expected bundled books");
    await renderWithProviders(<HadithCollectionScreen />);

    expect(await screen.findByText(i18n.t("hadith.chooseBookTitle"))).toBeTruthy();
    expect(mockRouter.setParams).not.toHaveBeenCalled();

    fireEvent.press(screen.getByLabelText(first.name));
    expect(mockRouter.setParams).toHaveBeenCalledWith({ book: first.id });
  });

  it("reads the book from ?book= in the detail pane and marks it selected in the list", async () => {
    setMockWindowSize(1400);
    const data = await ensureBundledCollectionData("riyad_assalihin");
    const first = data?.sections[0];
    const firstItem = data?.items.find((item) => item.chapterId === first?.id);
    if (!first || !firstItem) throw new Error("expected bundled books");
    setMockSearchParams({ collection: "riyad_assalihin", book: first.id });
    await renderWithProviders(<HadithCollectionScreen />);

    expect((await screen.findAllByText(firstItem.reference)).length).toBeGreaterThan(0);
    const row = screen.getByLabelText(first.name);
    expect(row.props.accessibilityState).toEqual(expect.objectContaining({ selected: true }));
    expect(screen.queryByText(i18n.t("hadith.chooseBookTitle"))).toBeNull();
  });

  it("keeps the phone book grid (no list–detail prompt) below the breakpoint", async () => {
    setMockSearchParams({ collection: "riyad_assalihin" });
    const data = await ensureBundledCollectionData("riyad_assalihin");
    const first = data?.sections[0];
    if (!first) throw new Error("expected bundled books");
    await renderWithProviders(<HadithCollectionScreen />);

    expect((await screen.findAllByText(first.name)).length).toBeGreaterThan(0);
    expect(screen.queryByText(i18n.t("hadith.chooseBookTitle"))).toBeNull();
  });
});

describe("Hadith saved list (P5-34 / B-26)", () => {
  beforeEach(async () => {
    resetExpoRouterMock();
    await AsyncStorage.clear();
  });

  it("un-saves with an Undo that restores the exact saved record", async () => {
    const data = await ensureBundledCollectionData("nawawi40");
    const item = data?.items[0];
    if (!item) throw new Error("expected bundled hadith");
    await HadithRepository.toggleBookmark(item);
    const [original] = await HadithRepository.getBookmarks();

    await renderWithProviders(
      <>
        <HadithBookmarksScreen />
        <ToastHost />
      </>,
    );
    fireEvent.press(await screen.findByLabelText(i18n.t("hadith.bookmarkRemove")));
    await waitFor(async () => expect(await HadithRepository.isBookmarked(item.id)).toBe(false));

    fireEvent.press(await screen.findByText(i18n.t("uiFeedback.undo")));
    await waitFor(async () => expect(await HadithRepository.getBookmarks()).toEqual([original]));
    expect(await screen.findByLabelText(i18n.t("hadith.bookmarkRemove"))).toBeTruthy();
  });

  it("offers Try again when the saved list fails to load", async () => {
    const spy = jest
      .spyOn(HadithRepository, "getBookmarkedHadiths")
      .mockRejectedValueOnce(new Error("disk"));
    await renderWithProviders(<HadithBookmarksScreen />);
    fireEvent.press(await screen.findByText("Try again"));
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(2));
    spy.mockRestore();
  });
});
