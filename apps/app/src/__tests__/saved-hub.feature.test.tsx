import { act, fireEvent, screen } from "@testing-library/react-native";

import i18n from "@/i18n";
import { quranNotesStore } from "@/stores/quran-notes-store";
import { quranStore } from "@/stores/quran-store";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

const t = (key: string) => i18n.t(key);

describe("Saved hub (/bookmarks)", () => {
  beforeEach(async () => {
    resetExpoRouterMock();
    await act(async () => {
      quranStore.setState({
        isReady: true,
        bookmarks: [
          { id: "b1", surah: 1, ayah: 2, createdAt: "2026-11-01T00:00:00.000Z" },
          { id: "b2", surah: 2, ayah: 255, createdAt: "2026-11-03T00:00:00.000Z" },
        ],
      });
    });
  });

  it("lists saved items recent-first and opens one", async () => {
    const { default: BookmarksHubScreen } = await import("@/app/bookmarks");
    await renderWithTheme(<BookmarksHubScreen />);
    const rows = await screen.findAllByText(/Al-Baqarah 2:255|Al-Fatihah 1:2/);
    expect(rows.map((r) => r.props.children)).toEqual(["Al-Baqarah 2:255", "Al-Fatihah 1:2"]);
    await fireEvent.press(rows[0] as never);
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/quran/[surah]",
      params: { surah: "2", ayah: "255" },
    });
  });

  it("filter chips narrow the list by type", async () => {
    const { default: BookmarksHubScreen } = await import("@/app/bookmarks");
    await renderWithTheme(<BookmarksHubScreen />);
    await screen.findAllByText("Al-Fatihah 1:2");
    await fireEvent.press(screen.getAllByText(t("bookmarks.filter.hadith"))[0] as never);
    expect(screen.queryByText("Al-Fatihah 1:2")).toBeNull();
    await fireEvent.press(screen.getAllByText(t("bookmarks.filter.quran"))[0] as never);
    expect(screen.getAllByText("Al-Fatihah 1:2").length).toBeGreaterThan(0);
  });

  it("a notes-only user sees the hub (not the empty state) with a View all notes row", async () => {
    await act(async () => {
      quranStore.setState({ isReady: true, bookmarks: [] });
      await quranNotesStore.getState().load();
      await quranNotesStore
        .getState()
        .save({ surah: 2, ayah: 255, body: "Reflection on the Throne verse", tags: [] });
    });
    const { default: BookmarksHubScreen } = await import("@/app/bookmarks");
    await renderWithTheme(<BookmarksHubScreen />);
    expect(await screen.findAllByText(t("bookmarks.filter.notes"))).not.toHaveLength(0);
    expect(screen.queryByText(t("bookmarks.emptyTitle"))).toBeNull();
    const viewAll = await screen.findByText(t("quranNotes.viewAll"));
    await fireEvent.press(viewAll as never);
    expect(mockRouter.push).toHaveBeenCalledWith("/quran/notes");
  });
});
