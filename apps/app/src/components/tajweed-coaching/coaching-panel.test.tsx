import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, screen } from "@testing-library/react-native";

import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { rebuildCoachingPlan } from "@/lib/tajweed-coaching/actions";
import { quranPracticeStore } from "@/stores/quran-practice-store";
import { tajweedCoachingStore } from "@/stores/tajweed-coaching-store";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";
import { practiceHistory, practiceSummary } from "@/test-support/tajweed-coaching";

import { CoachingPanel } from "./coaching-panel";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock("@/lib/quran-companion/availability", () => ({
  isPracticeAvailable: jest.fn(() => true),
}));
jest.mock("@/lib/tajweed-coaching/actions", () => ({
  rebuildCoachingPlan: jest.fn(async () => "no-practice"),
}));
jest.mock("@/api/quran-words", () => ({ fetchSurahWords: jest.fn(async () => ({})) }));

const rebuild = rebuildCoachingPlan as jest.MockedFunction<typeof rebuildCoachingPlan>;
const available = isPracticeAvailable as jest.MockedFunction<typeof isPracticeAvailable>;

async function settle() {
  await act(async () => {
    await Promise.resolve();
  });
}

beforeEach(async () => {
  resetExpoRouterMock();
  rebuild.mockClear();
  available.mockReturnValue(true);
  await AsyncStorage.clear();
  await tajweedCoachingStore.getState().load();
  quranPracticeStore.setState({ history: practiceHistory([]), isReady: true });
});

describe("CoachingPanel", () => {
  it("invites practice when there is nothing to build a plan from", async () => {
    await renderWithTheme(<CoachingPanel />);
    await settle();
    expect(
      screen.getByText(
        "Practise a few ayahs in Qur'an practice and your coaching plan will appear here.",
      ),
    ).toBeTruthy();
    await fireEvent.press(screen.getByText("Open Qur'an practice"));
    expect(mockRouter.push).toHaveBeenCalledWith("/quran/practice");
    // No session → nothing stale → no automatic rebuild.
    expect(rebuild).not.toHaveBeenCalled();
  });

  it("rebuilds once when a newer session exists, then lists the plan and progress", async () => {
    quranPracticeStore.setState({
      history: practiceHistory([practiceSummary({ weakAyahs: [3] })]),
      isReady: true,
    });
    rebuild.mockImplementation(async () => {
      await tajweedCoachingStore.getState().setPlan({
        createdAt: "2999-01-01T00:00:00.000Z",
        items: [{ head: "qalqalah", words: [] }],
      });
      return "ok";
    });
    await tajweedCoachingStore.getState().recordDrill("qalqalah", "try-again");
    await renderWithTheme(<CoachingPanel />);
    await settle();
    expect(rebuild).toHaveBeenCalledTimes(1);
    expect(await screen.findAllByText("Qalqalah (echo)")).toHaveLength(2); // card + progress row
    expect(screen.getByText("Your practice")).toBeTruthy();
    expect(screen.getByText(/^Practised 1 time · /)).toBeTruthy();
  });

  it("is read-only on TV: no rebuild, no practice buttons", async () => {
    available.mockReturnValue(false);
    await tajweedCoachingStore.getState().setPlan({
      createdAt: "2026-11-24T00:00:00.000Z",
      items: [{ head: "ghunna", words: [] }],
    });
    await renderWithTheme(<CoachingPanel />);
    await settle();
    expect(screen.getByText(/Practice needs a microphone/)).toBeTruthy();
    expect(screen.getByText("Ghunnah (nasal sound)")).toBeTruthy();
    expect(screen.queryByText("Practise this sound")).toBeNull();
    expect(screen.queryByText("Update my plan")).toBeNull();
    expect(rebuild).not.toHaveBeenCalled();
  });

  it("shows the evidence by reference and the on-device privacy line", async () => {
    await renderWithTheme(<CoachingPanel />);
    await settle();
    expect(screen.getByText(/Qur'an 73:4/)).toBeTruthy();
    expect(screen.getByText(/Riyad as-Salihin 315/)).toBeTruthy();
    expect(screen.getByText(/audio never leaves it/)).toBeTruthy();
  });
});
