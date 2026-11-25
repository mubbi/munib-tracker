import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { QuranAyahRangeCards } from "@/components/quran/quran-ayah-range-cards";
import type { QuranBookmark } from "@/db/repositories/quran-repository";
import {
  loadQuranAyahCardsRanges,
  type QuranAyahCardData,
  type QuranAyahCardsPayload,
} from "@/lib/quran-ayah-range";
import { resolveQuranEditionId } from "@/lib/translation-locale";
import type { ZikrQuranRange } from "@/lib/zikr-quran";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { setReadingDisplayState } from "@/test-support/settings";

const mockAudio = {
  current: null as { id: string } | null,
  isPlaying: false,
  play: jest.fn(),
  toggle: jest.fn(),
};
const mockToggleBookmark = jest.fn(async (_surah: number, _ayah: number) => true);
let mockBookmarks: QuranBookmark[] = [];
const mockShare = {
  share: jest.fn(async (_payload: unknown) => undefined),
  isSharing: jest.fn((_key: string) => false),
  isGesturePending: jest.fn((_key: string) => false),
  SnapshotHost: null,
};

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

jest.mock("@/providers/audio-player-provider", () => ({
  useAudioPlayerContext: () => mockAudio,
}));

jest.mock("@/stores/quran-store", () => ({
  useQuranPrefs: () => ({ preferredReciterDir: "Alafasy_128kbps" }),
  useQuranBookmarks: () => mockBookmarks,
  useQuranActions: () => ({ toggleBookmark: mockToggleBookmark }),
}));

jest.mock("@/hooks/use-share-content-card", () => ({
  ...jest.requireActual("@/hooks/use-share-content-card"),
  useShareContentCard: () => mockShare,
}));

jest.mock("@/components/content-report/content-report-button", () => ({
  ContentReportButton: () => null,
}));

jest.mock("@/lib/quran-ayah-range", () => ({ loadQuranAyahCardsRanges: jest.fn() }));

jest.mock("@/lib/translation-locale", () => ({
  ...jest.requireActual("@/lib/translation-locale"),
  resolveQuranEditionId: jest.fn(() => "en-sahih"),
}));

const loadMock = loadQuranAyahCardsRanges as jest.MockedFunction<typeof loadQuranAyahCardsRanges>;
const editionMock = resolveQuranEditionId as jest.MockedFunction<typeof resolveQuranEditionId>;

function card(overrides: Partial<QuranAyahCardData> = {}): QuranAyahCardData {
  return {
    ayah: 255,
    arabic: "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ",
    transliteration: "Allahu la ilaha illa huwa",
    translation: "Allah — there is no deity except Him",
    sajda: false,
    ...overrides,
  };
}

function section(overrides: Partial<QuranAyahCardsPayload> = {}): QuranAyahCardsPayload {
  return {
    surah: 2,
    surahName: "Al-Baqarah",
    nameArabic: "ٱلْبَقَرَة",
    nameEnglish: "The Cow",
    revelationPlace: "madinah",
    ayahCount: 286,
    ayahs: [
      card(),
      card({
        ayah: 256,
        arabic: "لَآ إِكْرَاهَ فِى ٱلدِّينِ",
        transliteration: "La ikraha fid-din",
        translation: "There is no compulsion in religion",
        sajda: true,
      }),
    ],
    ...overrides,
  };
}

const IKHLAS = section({
  surah: 112,
  surahName: "Al-Ikhlas",
  nameArabic: "",
  nameEnglish: "",
  revelationPlace: undefined,
  ayahCount: 4,
  ayahs: [card({ ayah: 1, arabic: "", transliteration: "", translation: "" })],
});

const KURSI_RANGE: ZikrQuranRange = { surah: 2, ayahFrom: 255, ayahTo: 256 };

type Props = Parameters<typeof QuranAyahRangeCards>[0];

/** Renders the cards and waits for the (mocked) loader to resolve. */
async function renderCards(overrides: Partial<Props> = {}) {
  const props: Props = {
    ranges: [KURSI_RANGE],
    sourceHref: "/zikr/detail/kursi",
    ...overrides,
  };
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  await renderWithTheme(
    <QueryClientProvider client={client}>
      <Text>host</Text>
      <QuranAyahRangeCards {...props} />
    </QueryClientProvider>,
  );
  if (props.ranges.length > 0) await screen.findByRole("button", { name: /^(Play|Pause)$/ });
  return props;
}

function playedTrackIds(): string[] {
  return mockAudio.play.mock.calls[0][0].map((track: { id: string }) => track.id);
}

describe("QuranAyahRangeCards", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetExpoRouterMock();
    editionMock.mockReturnValue("en-sahih");
    mockAudio.current = null;
    mockAudio.isPlaying = false;
    mockBookmarks = [];
    mockShare.isSharing.mockReturnValue(false);
    mockShare.isGesturePending.mockReturnValue(false);
    setReadingDisplayState({ showTransliteration: true, showTranslation: true });
    loadMock.mockResolvedValue([section()]);
  });

  it("renders nothing and loads nothing for an empty range list", async () => {
    await renderCards({ ranges: [] });
    expect(loadMock).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Play" })).toBeNull();
  });

  it("loads the ranges in the reader's translation edition", async () => {
    await renderCards();
    expect(loadMock).toHaveBeenCalledWith([KURSI_RANGE], "en-sahih");
  });

  it("falls back to the bundled English edition", async () => {
    editionMock.mockReturnValue("" as ReturnType<typeof resolveQuranEditionId>);
    await renderCards();
    expect(loadMock).toHaveBeenCalledWith([KURSI_RANGE], "en-pickthall");
  });

  it("shows each ayah's Arabic, transliteration and translation", async () => {
    await renderCards();
    expect(screen.getByText("ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ")).toBeTruthy();
    expect(screen.getByText("La ikraha fid-din")).toBeTruthy();
    expect(screen.getByText("There is no compulsion in religion")).toBeTruthy();
  });

  it("marks sajda ayahs", async () => {
    await renderCards();
    expect(screen.getAllByText("۩")).toHaveLength(1);
  });

  it("hides transliteration and translation when switched off", async () => {
    setReadingDisplayState({ showTransliteration: false, showTranslation: false });
    await renderCards();
    expect(screen.queryByText("La ikraha fid-din")).toBeNull();
    expect(screen.queryByText("There is no compulsion in religion")).toBeNull();
  });

  it("plays the whole range from the first ayah", async () => {
    await renderCards();
    await fireEvent.press(screen.getByRole("button", { name: "Play" }));
    expect(playedTrackIds()).toEqual(["2:255", "2:256"]);
    expect(mockAudio.play).toHaveBeenCalledWith(expect.any(Array), 0, {
      sourceHref: "/zikr/detail/kursi",
    });
  });

  it("plays from a tapped ayah", async () => {
    await renderCards();
    await fireEvent.press(screen.getByLabelText("Play ayah 256"));
    expect(mockAudio.play).toHaveBeenCalledWith(expect.any(Array), 1, expect.any(Object));
  });

  it.each([
    ["playing", true, "Pause"],
    ["paused", false, "Play"],
  ])("toggles the active range when %s", async (_state, isPlaying, label) => {
    mockAudio.current = { id: "2:256" };
    mockAudio.isPlaying = isPlaying;
    await renderCards();
    await fireEvent.press(screen.getByRole("button", { name: label }));
    expect(mockAudio.toggle).toHaveBeenCalled();
    expect(mockAudio.play).not.toHaveBeenCalled();
  });

  it("toggles the ayah that is already playing", async () => {
    mockAudio.current = { id: "2:255" };
    mockAudio.isPlaying = true;
    await renderCards();
    await fireEvent.press(screen.getByLabelText("Pause verse"));
    expect(mockAudio.toggle).toHaveBeenCalled();
  });

  it.each([
    [[], "Bookmark verse", "Save"],
    [[{ id: "2:255", surah: 2, ayah: 255, createdAt: "2026-01-01" }], "Remove bookmark", "Saved"],
  ])("toggles a bookmark (existing: %j)", async (bookmarks, label, text) => {
    mockBookmarks = bookmarks;
    await renderCards();
    expect(screen.getAllByText(text).length).toBeGreaterThan(0);
    await fireEvent.press(screen.getAllByLabelText(label)[0]);
    expect(mockToggleBookmark).toHaveBeenCalledWith(2, 255);
  });

  it("shares an ayah keyed by its reference", async () => {
    await renderCards();
    await fireEvent.press(screen.getAllByLabelText("Share verse")[1]);
    expect(mockShare.share).toHaveBeenCalledWith(expect.objectContaining({ shareKey: "2:256" }));
  });

  it.each([
    ["isGesturePending", "Tap to share"],
    ["isSharing", "Sharing…"],
  ] as const)("labels the share button while %s", async (state, text) => {
    mockShare[state].mockImplementation((key) => key === "2:255");
    await renderCards();
    expect(screen.getByText(text)).toBeTruthy();
  });

  it("shares through a parent share card when given", async () => {
    const parent = { ...mockShare, share: jest.fn(async () => undefined) };
    await renderCards({ shareCard: parent as unknown as Props["shareCard"] });
    await fireEvent.press(screen.getAllByLabelText("Share verse")[0]);
    expect(parent.share).toHaveBeenCalled();
    expect(mockShare.share).not.toHaveBeenCalled();
  });

  it("adds a surah banner or title between multi-surah sections", async () => {
    loadMock.mockResolvedValue([section(), IKHLAS]);
    await renderCards({ ranges: [KURSI_RANGE, { surah: 112, ayahFrom: 1, ayahTo: 1 }] });
    expect(screen.getByText("The Cow  ·  Madani  ·  286 ayahs")).toBeTruthy();
    expect(screen.getByText("Al-Ikhlas")).toBeTruthy();
  });

  it("indexes tracks across sections", async () => {
    loadMock.mockResolvedValue([section(), IKHLAS]);
    await renderCards({ ranges: [KURSI_RANGE, { surah: 112, ayahFrom: 1, ayahTo: 1 }] });
    await fireEvent.press(screen.getByLabelText("Play ayah 1"));
    expect(mockAudio.play).toHaveBeenCalledWith(expect.any(Array), 2, expect.any(Object));
  });

  it("recites a single span along beside Play (D68)", async () => {
    await renderCards();
    await fireEvent.press(screen.getByText("Recite along"));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/quran/practice/session",
      params: { surah: "2", from: "255", to: "256", mode: "follow", source: "recite-along" },
    });
  });

  it("offers one recite-along per section for multi-surah spans", async () => {
    loadMock.mockResolvedValue([section(), IKHLAS]);
    await renderCards({ ranges: [KURSI_RANGE, { surah: 112, ayahFrom: 1, ayahTo: 4 }] });
    const buttons = screen.getAllByText("Recite along");
    expect(buttons).toHaveLength(2);
    await fireEvent.press(buttons[1]);
    expect(mockRouter.push).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({ surah: "112", from: "1", to: "4" }),
      }),
    );
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("hides share", async () => {
      await renderCards();
      expect(screen.queryByLabelText("Share verse")).toBeNull();
    });

    it("hides recite-along (no microphone path)", async () => {
      await renderCards();
      expect(screen.queryByText("Recite along")).toBeNull();
    });
  });
});
