import { getLocalDateString } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { PracticeHabitDoneButton } from "@/components/quran/practice-habit-done";
import { EMPTY_SUNNAH_HABITS, habitCheckKey } from "@/lib/sunnah-habits";
import { sunnahHabitsStore } from "@/stores/sunnah-habits-store";
import { buildPracticeSummary } from "@/test-support/fixtures/quran-companion";
import { renderWithTheme } from "@/test-support/render";

const mockToast = { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() };
jest.mock("@/providers/toast-provider", () => ({ useToast: () => mockToast }));

const HABIT = "ayat_kursi_sleep";
const KEY = () => habitCheckKey(HABIT, getLocalDateString());
const heard = buildPracticeSummary({ surah: 2, ayahStart: 255, ayahEnd: 255, heardAyahs: [255] });

beforeEach(async () => {
  await AsyncStorage.clear();
  mockToast.success.mockClear();
  sunnahHabitsStore.setState({ data: { ...EMPTY_SUNNAH_HABITS }, isReady: true });
});

describe("PracticeHabitDoneButton (D74)", () => {
  it("ticks today's habit only when pressed, then hides", async () => {
    await renderWithTheme(<PracticeHabitDoneButton habitId={HABIT} summary={heard} />);
    // Shown, but nothing is ticked automatically.
    expect(sunnahHabitsStore.getState().data.checks[KEY()]).toBeUndefined();
    await fireEvent.press(screen.getByText("Mark habit done"));
    await waitFor(() => expect(sunnahHabitsStore.getState().data.checks[KEY()]).toBe(1));
    expect(mockToast.success).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByText("Mark habit done")).toBeNull());
  });

  it("is hidden without the habit param", async () => {
    await renderWithTheme(<PracticeHabitDoneButton habitId={undefined} summary={heard} />);
    expect(screen.queryByText("Mark habit done")).toBeNull();
  });

  it("is hidden when no ayah was credited", async () => {
    const nothing = buildPracticeSummary({
      surah: 2,
      ayahStart: 255,
      ayahEnd: 255,
      heardAyahs: [],
    });
    await renderWithTheme(<PracticeHabitDoneButton habitId={HABIT} summary={nothing} />);
    expect(screen.queryByText("Mark habit done")).toBeNull();
  });

  it("is hidden when today's habit is already ticked", async () => {
    sunnahHabitsStore.setState({
      data: { ...EMPTY_SUNNAH_HABITS, checks: { [KEY()]: 1 } },
      isReady: true,
    });
    await renderWithTheme(<PracticeHabitDoneButton habitId={HABIT} summary={heard} />);
    expect(screen.queryByText("Mark habit done")).toBeNull();
  });
});
