import type { ZikrItem } from "@munib-tracker/shared/types";
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import AdhkarSessionScreen from "@/app/zikr/session/[category]";
import { ZikrRepository } from "@/db";
import { loadZikrItemsSyncForTests } from "@/lib/search-corpora-test-loader";
import { __setZikrItemsForTests } from "@/lib/zikr";
import { zikrCountKey } from "@/lib/zikr-count-key";
import { trackerStore } from "@/stores/tracker-store";
import { resetExpoRouterMock, setMockSearchParams } from "@/test-support/mocks/expo-router";
import { renderWithProviders } from "@/test-support/render";
import { resetTrackerStore } from "@/test-support/store";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/reading-typography-context", () => ({ ReadingTypographyBar: () => null }));

/**
 * Pinned adhkar clock: the session logs under the adhkar day (Fajr → Fajr), so a
 * real clock would make these tests depend on whether they run before Fajr.
 * `mockClock.date` null ⇒ the tracker's own day (daytime).
 */
const mockClock: { date: string | null } = { date: null };
jest.mock("@/hooks/use-adhkar-clock", () => ({
  useAdhkarClock: () => {
    const { trackerStore: store } = jest.requireActual("@/stores/tracker-store");
    return {
      now: new Date(),
      date: mockClock.date ?? store.getState().date,
      times: null,
      currentAfterSalah: "isha",
    };
  },
}));

function item(overrides: Partial<ZikrItem> & Pick<ZikrItem, "id" | "categoryId">): ZikrItem {
  return {
    title: overrides.id,
    arabic: "",
    transliteration: "",
    translation: "",
    reference: "Muslim",
    ...overrides,
  };
}

const ITEMS: ZikrItem[] = [
  item({ id: "m-once", categoryId: "morning", title: "Morning once", targetCount: 1 }),
  item({ id: "m-thrice", categoryId: "morning", title: "Morning thrice", targetCount: 3 }),
  item({ id: "m-last", categoryId: "morning", title: "Morning last", targetCount: 1 }),
  item({ id: "a-tasbih", categoryId: "after_prayer", title: "SubhanAllah", targetCount: 33 }),
];

const counts = () => trackerStore.getState().zikrCounts;

afterAll(() => {
  __setZikrItemsForTests(loadZikrItemsSyncForTests());
});

beforeEach(async () => {
  mockClock.date = null;
  __setZikrItemsForTests(ITEMS);
  resetExpoRouterMock();
  await resetTrackerStore();
});

describe("Guided adhkar session", () => {
  it("logs a single recitation with one tap and moves straight to the next zikr", async () => {
    setMockSearchParams({ category: "morning" });
    await renderWithProviders(<AdhkarSessionScreen />);

    expect(await screen.findByText("Morning once")).toBeTruthy();
    expect(screen.getByText("1 of 3")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Tap once you have recited it"));
    await waitFor(() => expect(counts()["m-once"]).toBe(1));

    // Auto-advances to the next pending zikr (no list → tasbeeh → back hop).
    expect(await screen.findByText("Morning thrice", {}, { timeout: 3000 })).toBeTruthy();
    expect(screen.getByText("2 of 3")).toBeTruthy();
  });

  it("counts every rapid tap and stops at the zikr's own target", async () => {
    setMockSearchParams({ category: "morning", start: "m-thrice" });
    await renderWithProviders(<AdhkarSessionScreen />);
    expect(await screen.findByText("Morning thrice")).toBeTruthy();

    const pad = screen.getByLabelText("Count");
    // Five taps in one burst — before the store re-renders — still land exactly 3.
    await act(async () => {
      for (let i = 0; i < 5; i += 1) fireEvent.press(pad);
    });
    await waitFor(() => expect(counts()["m-thrice"]).toBe(3));
    // Let the auto-advance timer + queued store writes settle before teardown.
    expect(await screen.findByText("Morning last", {}, { timeout: 3000 })).toBeTruthy();
  });

  it("marks a zikr complete without counting", async () => {
    setMockSearchParams({ category: "morning", start: "m-thrice" });
    await renderWithProviders(<AdhkarSessionScreen />);
    expect(await screen.findByText("Morning thrice")).toBeTruthy();

    fireEvent.press(screen.getByText("Mark complete"));
    await waitFor(() => expect(counts()["m-thrice"]).toBe(3));
  });

  it("logs after-salah counts against the chosen salah only", async () => {
    setMockSearchParams({ category: "after_prayer", prayer: "asr" });
    await renderWithProviders(<AdhkarSessionScreen />);
    expect(await screen.findByText("SubhanAllah")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Count"));
    await waitFor(() => expect(counts()[zikrCountKey("a-tasbih", "asr")]).toBe(1));
    expect(counts()["a-tasbih"]).toBeUndefined();
    expect(counts()[zikrCountKey("a-tasbih", "dhuhr")]).toBeUndefined();
  });

  it("records a whole set at once with Mark all as done", async () => {
    setMockSearchParams({ category: "morning" });
    await renderWithProviders(<AdhkarSessionScreen />);
    expect(await screen.findByText("Morning once")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Mark all as done" }));
    // Confirm dialog → its confirm button shares the label (last match).
    const buttons = screen.getAllByRole("button", { name: "Mark all as done" });
    await fireEvent.press(buttons[buttons.length - 1]);

    await waitFor(() =>
      expect(counts()).toMatchObject({ "m-once": 1, "m-thrice": 3, "m-last": 1 }),
    );
    expect(await screen.findByText("MashaAllah — all done")).toBeTruthy();
  });

  it("logs last night's Isha adhkar under last night's date after midnight", async () => {
    const today = trackerStore.getState().date;
    const [y, m, d] = today.split("-").map(Number);
    const prev = new Date(y, m - 1, d - 1);
    const yesterday = `${prev.getFullYear()}-${`${prev.getMonth() + 1}`.padStart(2, "0")}-${`${prev.getDate()}`.padStart(2, "0")}`;
    mockClock.date = yesterday; // e.g. 00:30, before today's Fajr

    setMockSearchParams({ category: "after_prayer", prayer: "isha" });
    await renderWithProviders(<AdhkarSessionScreen />);
    expect(await screen.findByText("SubhanAllah")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Count"));
    await waitFor(async () => {
      const entry = await ZikrRepository.getProgress("a-tasbih", yesterday, "isha");
      expect(entry?.count).toBe(1);
    });
    // Today's Isha has not happened yet — nothing logged against it.
    expect(await ZikrRepository.getProgress("a-tasbih", today, "isha")).toBeUndefined();
    expect(counts()[zikrCountKey("a-tasbih", "isha")]).toBeUndefined();
  });
});
