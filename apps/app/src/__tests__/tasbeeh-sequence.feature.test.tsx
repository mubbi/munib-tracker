import type { ZikrItem } from "@munib-tracker/shared/types";
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import TasbeehSequenceScreen from "@/app/tasbeeh/sequence";
import { loadZikrItemsSyncForTests } from "@/lib/search-corpora-test-loader";
import { SEQUENCE_ZIKR } from "@/lib/tasbeeh/after-salah-sequence";
import { __setZikrItemsForTests } from "@/lib/zikr";
import { zikrCountKey } from "@/lib/zikr-count-key";
import { trackerStore } from "@/stores/tracker-store";
import { resetExpoRouterMock, setMockSearchParams } from "@/test-support/mocks/expo-router";
import { renderWithProviders } from "@/test-support/render";
import { resetTrackerStore } from "@/test-support/store";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/reading-typography-context", () => ({ ReadingTypographyBar: () => null }));
jest.mock("@/lib/platform/hinge", () => ({ useHingePosture: jest.fn(() => null) }));
jest.mock("@/lib/quran-companion/audio/capture", () => ({
  useRecitationCapture: () => ({
    available: false,
    getPermission: jest.fn(() => Promise.resolve("granted")),
    requestPermission: jest.fn(() => Promise.resolve("granted")),
    start: jest.fn(),
    stop: jest.fn(),
  }),
}));
jest.mock("@/hooks/use-adhkar-clock", () => ({
  useAdhkarClock: () => {
    const { trackerStore: store } = jest.requireActual("@/stores/tracker-store");
    return { now: new Date(), date: store.getState().date, times: null, currentAfterSalah: "asr" };
  },
}));

// The real bundled after-Salah items: the sequence only ever references them.
const ALL = loadZikrItemsSyncForTests();
const ITEMS: ZikrItem[] = ALL.filter((item) =>
  (Object.values(SEQUENCE_ZIKR) as string[]).includes(item.id),
);

const counts = () => trackerStore.getState().zikrCounts;

afterAll(() => {
  __setZikrItemsForTests(ALL);
});

beforeEach(async () => {
  __setZikrItemsForTests(ITEMS);
  resetExpoRouterMock();
  await resetTrackerStore();
});

async function tap(times: number) {
  const pad = screen.getAllByLabelText("Count")[0];
  await act(async () => {
    for (let i = 0; i < times; i += 1) fireEvent.press(pad);
  });
}

describe("After-Salah tasbeeh sequence (D69)", () => {
  it("counts 33 / 33 / 34, moving to the next phrase by itself, and logs the salah's adhkar", async () => {
    setMockSearchParams({ prayer: "dhuhr" });
    await renderWithProviders(<TasbeehSequenceScreen />);
    expect(await screen.findByText("After-Salah tasbeeh")).toBeTruthy();
    expect(screen.getByText("SubhanAllah ×33 · Alhamdulillah ×33 · Allahu Akbar ×34")).toBeTruthy();

    await tap(33);
    await waitFor(() => expect(counts()[zikrCountKey(SEQUENCE_ZIKR.tasbih, "dhuhr")]).toBe(33));
    expect(screen.getByText("33 of 100")).toBeTruthy();
    // After the short pause the next phrase takes over by itself.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 900));
    });
    await tap(1);
    expect(screen.getByText("34 of 100")).toBeTruthy();
    await waitFor(() =>
      expect(counts()[zikrCountKey(SEQUENCE_ZIKR.tahmid, "dhuhr")]).toBeGreaterThan(0),
    );
    expect(counts()[zikrCountKey(SEQUENCE_ZIKR.tasbih, "asr")]).toBeUndefined();
  });

  it("continues from what is already logged for that salah", async () => {
    await trackerStore.getState().setZikrCount(SEQUENCE_ZIKR.tasbih, 33, 33, { prayerId: "asr" });
    setMockSearchParams({});
    await renderWithProviders(<TasbeehSequenceScreen />);
    expect(await screen.findByText("33 of 100")).toBeTruthy();
  });

  it("offers the tahlil ending that completes the hundred (Sahih Muslim 597)", async () => {
    setMockSearchParams({ ending: "tahlil" });
    await renderWithProviders(<TasbeehSequenceScreen />);
    expect(await screen.findByText("After-Salah tasbeeh")).toBeTruthy();
    expect(screen.getByText(/the tahlil completes the hundred \(Sahih Muslim 597\)/)).toBeTruthy();
    expect(screen.getByText(/Allahu Akbar ×33 · La ilaha illallah ×1/)).toBeTruthy();
  });
});
