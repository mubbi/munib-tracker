import { act, fireEvent, screen } from "@testing-library/react-native";

import { ReadingCard, type ReadingItem } from "@/components/content/reading-card";
import { readingTextVisibilityStore } from "@/stores/reading-text-visibility-store";
import { mockAudioPlayer, resetAudioPlayerMock } from "@/test-support/mocks/audio-player-provider";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

const mockRecordContinue = jest.fn();

jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock("@/stores/continue-store", () => ({
  recordContinueActivity: (activity: unknown) => mockRecordContinue(activity),
}));
jest.mock("@/components/content/reading-tts-button", () => {
  const { Text } = require("react-native");
  return { ReadingTtsButton: ({ id }: { id: string }) => <Text>{`tts:${id}`}</Text> };
});
/** Context menu stand-in: one button per action so menu wiring can be pressed. */
jest.mock("@/components/ui/context-menu", () => {
  const { Pressable, View } = require("react-native");
  return {
    ContextMenu: ({
      actions,
      onAction,
      children,
    }: {
      actions: { id: string; title: string }[];
      onAction: (id: string) => void;
      children: unknown;
    }) => (
      <View>
        {actions.map((action) => (
          <Pressable
            key={action.id}
            accessibilityLabel={`menu:${action.id}`}
            onPress={() => onAction(action.id)}
          />
        ))}
        {children}
      </View>
    ),
  };
});

const baseItem: ReadingItem = {
  id: "sleep-bismika",
  title: "Dua before sleep",
  arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
  transliteration: "Bismika Allahumma amutu wa ahya",
  translation: "In Your name, O Allah, I die and I live.",
  reference: "Sahih al-Bukhari 6324",
};

function fakeShareCard() {
  return {
    share: jest.fn(async (_payload: unknown) => undefined),
    isSharing: () => false,
    isGesturePending: () => false,
    SnapshotHost: null,
  } as unknown as NonNullable<Parameters<typeof ReadingCard>[0]["shareCard"]>;
}

type Props = Parameters<typeof ReadingCard>[0];

async function renderCard(overrides: Partial<Props> = {}) {
  const shareCard = fakeShareCard();
  await renderWithTheme(<ReadingCard item={baseItem} shareCard={shareCard} {...overrides} />);
  return shareCard;
}

describe("ReadingCard", () => {
  beforeEach(() => {
    resetAudioPlayerMock();
    mockRecordContinue.mockClear();
    readingTextVisibilityStore.setState({
      showTransliteration: true,
      showTranslation: true,
      isReady: true,
    });
  });

  it("shows Arabic, transliteration, meaning and reference", async () => {
    await renderCard({ framed: false });
    expect(screen.getByText(baseItem.arabic)).toBeTruthy();
    expect(screen.getByText(baseItem.transliteration ?? "")).toBeTruthy();
    expect(screen.getByText(baseItem.translation)).toBeTruthy();
    expect(screen.getByText("Reference: Sahih al-Bukhari 6324")).toBeTruthy();
  });

  it("hides transliteration and meaning when toggled off", async () => {
    readingTextVisibilityStore.setState({ showTransliteration: false, showTranslation: false });
    await renderCard({ item: { ...baseItem, reference: undefined } });
    expect(screen.queryByText(baseItem.translation)).toBeNull();
    expect(screen.queryByText(baseItem.transliteration ?? "")).toBeNull();
  });

  it("shows virtues", async () => {
    await renderCard({ item: { ...baseItem, virtues: "Protection through the night" } });
    expect(screen.getByText("Protection through the night")).toBeTruthy();
  });

  it("renders alternate authentic wordings", async () => {
    await renderCard({
      item: {
        ...baseItem,
        variants: [
          {
            arabic: "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا",
            transliteration: "Allahumma bismika amutu wa ahya",
            translation: "O Allah, in Your name I die and I live.",
            reference: "Sahih al-Bukhari 6314",
          },
          { arabic: "اللَّهُمَّ بِاسْمِكَ أَحْيَا" },
        ],
      },
    });
    expect(screen.getAllByText("Alternate authentic wording")).toHaveLength(2);
    expect(screen.getByText("Allahumma bismika amutu wa ahya")).toBeTruthy();
    expect(screen.getByText("Reference: Sahih al-Bukhari 6314")).toBeTruthy();
  });

  it("plays recorded audio and records durood progress", async () => {
    await renderCard({
      item: { ...baseItem, audioUri: "https://x/a.mp3" },
      sourceHref: "/duroods",
    });
    await fireEvent.press(screen.getByLabelText("Play"));
    expect(mockAudioPlayer.play).toHaveBeenCalledWith(
      [expect.objectContaining({ id: "sleep-bismika", uri: "https://x/a.mp3" })],
      0,
      { sourceHref: "/duroods" },
    );
    expect(mockRecordContinue).toHaveBeenCalled();
  });

  it("offers text-to-speech when there is no recording", async () => {
    await renderCard({ enableTts: true });
    expect(screen.getByText("tts:sleep-bismika")).toBeTruthy();
  });

  it.each([
    [false, "Save dua"],
    [true, "Remove from saved"],
  ])("toggles the favorite (isFavorite=%s)", async (isFavorite, label) => {
    const onToggleFavorite = jest.fn();
    await renderCard({ isFavorite, onToggleFavorite });
    await fireEvent.press(screen.getByLabelText(label));
    expect(onToggleFavorite).toHaveBeenCalled();
  });

  it("shares the reading", async () => {
    const shareCard = await renderCard();
    await fireEvent.press(screen.getAllByLabelText("Share")[0]);
    await act(async () => {});
    expect(shareCard.share).toHaveBeenCalledWith(
      expect.objectContaining({ shareKey: "sleep-bismika", contentLabel: "Dua before sleep" }),
    );
  });

  it.each(["favorite", "play", "share"])("runs the %s context-menu action", async (id) => {
    const onToggleFavorite = jest.fn();
    const shareCard = await renderCard({
      item: { ...baseItem, audioUri: "https://x/a.mp3" },
      onToggleFavorite,
    });
    await fireEvent.press(screen.getByLabelText(`menu:${id}`));
    await act(async () => {});
    const calls = {
      favorite: onToggleFavorite,
      play: mockAudioPlayer.play,
      share: shareCard.share,
    } as const;
    expect(calls[id as keyof typeof calls]).toHaveBeenCalled();
  });

  it("renders without the context menu", async () => {
    await renderCard({ enableContextMenu: false });
    expect(screen.queryByLabelText("menu:share")).toBeNull();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("hides sharing and text-to-speech", async () => {
      await renderCard({ enableTts: true });
      expect(screen.queryByLabelText("Share")).toBeNull();
      expect(screen.queryByText("tts:sleep-bismika")).toBeNull();
    });
  });
});
