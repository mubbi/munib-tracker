import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import DuroodDetailScreen from "@/app/duroods/[id]";
import DuroodsScreen from "@/app/duroods/index";
import { ContentReportProvider } from "@/components/content-report/content-report-provider";
import i18n from "@/i18n";
import { DUROOD_CORPUS } from "@/lib/content-loaders";
import { mockAudioPlayer, resetAudioPlayerMock } from "@/test-support/mocks/audio-player-provider";
import {
  mockRouter,
  resetExpoRouterMock,
  setMockSearchParams,
} from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithProviders } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock("@/hooks/use-is-online", () => ({ useIsOnline: () => true }));

async function duroods() {
  return DUROOD_CORPUS.load();
}

describe("Duroods list (WP7)", () => {
  beforeEach(() => {
    resetExpoRouterMock();
    resetAudioPlayerMock();
  });

  it("lists salawat then virtues as compact rows with grade, save and info", async () => {
    await renderWithProviders(<DuroodsScreen />);
    expect(await screen.findByText(i18n.t("duroods.sectionSalawat"))).toBeTruthy();
    expect(screen.getByText(i18n.t("duroods.sectionVirtues"))).toBeTruthy();
    expect(screen.getByText("Durood Ibrahim")).toBeTruthy();
    expect(screen.getAllByText(i18n.t("duroods.grade.sahih")).length).toBeGreaterThan(3);
    expect(screen.getAllByLabelText(i18n.t("common.save")).length).toBeGreaterThan(3);
  });

  it("offers Play only on duroods with a recorded recitation", async () => {
    const items = await duroods();
    const withAudio = items.filter((item) => item.audioUri);
    const withoutAudio = items.filter((item) => !item.audioUri);
    expect(withAudio.length).toBeGreaterThan(0);
    await renderWithProviders(<DuroodsScreen />);
    await screen.findByText("Durood Ibrahim");
    for (const item of withAudio) {
      expect(screen.getByLabelText(i18n.t("duroods.play", { title: item.title }))).toBeTruthy();
    }
    for (const item of withoutAudio) {
      expect(screen.queryByLabelText(i18n.t("duroods.play", { title: item.title }))).toBeNull();
    }
    await fireEvent.press(
      screen.getByLabelText(i18n.t("duroods.play", { title: "Durood Ibrahim" })),
    );
    expect(mockAudioPlayer.play).toHaveBeenCalledWith(
      [expect.objectContaining({ id: "durood-ibrahim", uri: expect.stringMatching(/53hm\.mp3$/) })],
      0,
      { sourceHref: "/duroods" },
    );
  });

  it("opens the detail on tap and the source narration from info", async () => {
    await renderWithProviders(<DuroodsScreen />);
    await fireEvent.press(await screen.findByLabelText(/^1\. Durood Ibrahim/));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/duroods/[id]",
      params: { id: "durood-ibrahim" },
    });
    await fireEvent.press(
      screen.getByLabelText(i18n.t("duroods.sourceInfo", { title: "Durood Ibrahim" })),
    );
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/duroods/[id]",
      params: { id: "durood-ibrahim", source: "1" },
    });
  });

  it("filters with search and shows the empty state", async () => {
    await renderWithProviders(<DuroodsScreen />);
    await screen.findByText("Durood Ibrahim");
    const search = screen.getByPlaceholderText(i18n.t("duroods.searchPlaceholder"));
    await fireEvent.changeText(search, "Ibrahim");
    await waitFor(() => expect(screen.queryByText(i18n.t("duroods.sectionVirtues"))).toBeNull());
    expect(screen.getByText("Durood Ibrahim")).toBeTruthy();
    await fireEvent.changeText(search, "qqxzqq");
    expect(await screen.findByText(i18n.t("duroods.noResults"))).toBeTruthy();
  });

  describe("on TV", () => {
    usePlatform({ OS: "android", isTV: true });

    it("gives the first row initial D-pad focus", async () => {
      await renderWithProviders(<DuroodsScreen />);
      const first = await screen.findByLabelText(/^1\. Durood Ibrahim/);
      expect(first.props.hasTVPreferredFocus).toBe(true);
    });
  });
});

describe("Durood detail (WP7)", () => {
  beforeEach(() => {
    resetExpoRouterMock();
    resetAudioPlayerMock();
  });

  async function renderDetail(id: string, extra: Record<string, string> = {}) {
    setMockSearchParams({ id, ...extra });
    await renderWithProviders(
      <ContentReportProvider>
        <DuroodDetailScreen />
      </ContentReportProvider>,
    );
  }

  it("shows the reader with citation, grade and the source narrations", async () => {
    await renderDetail("durood-ibrahim");
    expect(await screen.findAllByText("Durood Ibrahim")).not.toHaveLength(0);
    expect(await screen.findByText("Sahih al-Bukhari 3370")).toBeTruthy();
    expect(screen.getByText(i18n.t("duroods.sourceTitle"))).toBeTruthy();
    await fireEvent.press(screen.getByText(i18n.t("duroods.readHadith")));
    expect(await screen.findByText(i18n.t("duroods.hideHadith"))).toBeTruthy();
    expect(screen.getAllByText(/Ka`b bin Ujrah/).length).toBeGreaterThan(0);
  });

  it("opens the narrations straight away from the list's info button", async () => {
    await renderDetail("durood-abu-masud", { source: "1" });
    expect(await screen.findByText(i18n.t("duroods.hideHadith"))).toBeTruthy();
  });

  it("links salawat to Tasbeeh but not the virtue reports", async () => {
    await renderDetail("durood-abu-humayd");
    await fireEvent.press(await screen.findByText(i18n.t("duroods.openInTasbeeh")));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/tasbeeh/durood/[id]",
      params: { id: "durood-abu-humayd" },
    });
    await renderDetail("durood-hisn-219");
    await screen.findAllByText(/Sahih Muslim 408/);
    expect(screen.queryByText(i18n.t("duroods.openInTasbeeh"))).toBeNull();
  });

  it("falls back to the device voice when there is no recorded recitation", async () => {
    await renderDetail("durood-abu-masud");
    expect(await screen.findByLabelText(i18n.t("reading.listen"))).toBeTruthy();
  });

  it("pages to the next durood in place", async () => {
    const items = await duroods();
    await renderDetail(items[0].id);
    await fireEvent.press(await screen.findByText(i18n.t("common.next")));
    expect(mockRouter.replace).toHaveBeenCalledWith({
      pathname: "/duroods/[id]",
      params: { id: items[1].id },
    });
  });

  it("shows not-found for an unknown id", async () => {
    await renderDetail("durood-missing");
    expect(await screen.findByText(i18n.t("duroods.notFoundTitle"))).toBeTruthy();
    await fireEvent.press(screen.getByText(i18n.t("duroods.browseAll")));
    expect(mockRouter.replace).toHaveBeenCalledWith("/duroods");
  });
});
