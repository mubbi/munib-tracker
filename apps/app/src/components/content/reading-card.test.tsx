import { render, screen, waitFor } from "@testing-library/react-native";

import { ReadingCard, type ReadingItem } from "@/components/content/reading-card";
import { MunibThemeProvider } from "@/providers/theme-provider";
import { readingTextVisibilityStore } from "@/stores/reading-text-visibility-store";

jest.mock("@/providers/audio-player-provider", () => ({
  useAudioPlayerContext: () => ({ play: jest.fn() }),
}));

jest.mock("@/hooks/use-share-content-card", () => ({
  useShareContentCard: () => ({
    share: jest.fn(async () => undefined),
    isSharing: () => false,
    isGesturePending: () => false,
    SnapshotHost: null,
  }),
}));

jest.mock("@/lib/platform/is-tv", () => ({
  isTV: () => false,
}));

const baseItem: ReadingItem = {
  id: "sleep-bismika",
  title: "Dua before sleep",
  arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
  transliteration: "Bismika Allahumma amutu wa ahya",
  translation: "In Your name, O Allah, I die and I live.",
  reference: "Sahih al-Bukhari 6324",
};

function renderCard(item: ReadingItem) {
  return render(
    <MunibThemeProvider>
      <ReadingCard item={item} enableContextMenu={false} />
    </MunibThemeProvider>,
  );
}

describe("ReadingCard variants", () => {
  beforeEach(() => {
    readingTextVisibilityStore.setState({
      showTransliteration: true,
      showTranslation: true,
      isReady: true,
    });
  });

  it("renders alternate authentic wordings with transliteration, meaning, and reference", async () => {
    renderCard({
      ...baseItem,
      variants: [
        {
          arabic: "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا",
          transliteration: "Allahumma bismika amutu wa ahya",
          translation: "O Allah, in Your name I die and I live.",
          reference: "Sahih al-Bukhari 6314",
        },
        {
          arabic: "اللَّهُمَّ بِاسْمِكَ أَحْيَا",
        },
      ],
    });

    await waitFor(() => {
      expect(screen.getByText("In Your name, O Allah, I die and I live.")).toBeTruthy();
    });

    expect(screen.getAllByText("Alternate authentic wording").length).toBe(2);
    expect(screen.getByText("Allahumma bismika amutu wa ahya")).toBeTruthy();
    expect(screen.getByText("O Allah, in Your name I die and I live.")).toBeTruthy();
    expect(screen.getByText("Reference: Sahih al-Bukhari 6314")).toBeTruthy();
    expect(screen.getByText("اللَّهُمَّ بِاسْمِكَ أَحْيَا")).toBeTruthy();
  });

  it("omits the variants block when the item has none", async () => {
    renderCard(baseItem);

    await waitFor(() => {
      expect(screen.getByText("In Your name, O Allah, I die and I live.")).toBeTruthy();
    });
    expect(screen.queryByText("Alternate authentic wording")).toBeNull();
  });
});
