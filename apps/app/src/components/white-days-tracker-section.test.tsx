import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import { WHITE_DAYS_CHECKLIST } from "@munib-tracker/shared/content/white-days-checklist";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { WhiteDaysTrackerSection } from "@/components/white-days-tracker-section";
import { hijriToGregorian } from "@/lib/hijri";
import { isWhiteDayDateString } from "@/lib/white-days";
import { preferencesStore } from "@/stores/preferences-store";
import { voluntaryFastingStore } from "@/stores/voluntary-fasting-store";
import { whiteDaysChecklistStore } from "@/stores/white-days-checklist-store";
import { firstDateWhere } from "@/test-support/dates";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

const WHITE_DAY = firstDateWhere((d) => isWhiteDayDateString(d));
const ORDINARY_DAY = firstDateWhere((d) => !isWhiteDayDateString(d));
const TOTAL = WHITE_DAYS_CHECKLIST.length;

const renderSection = (date = WHITE_DAY) =>
  renderWithTheme(<WhiteDaysTrackerSection date={date} />);
const checkboxes = () => screen.getAllByRole("checkbox");
const progress = (done: number) => new RegExp(`${done} of ${TOTAL} fasted`);

const dateOf = (y: number, m: number, d: number) => getLocalDateString(hijriToGregorian(y, m, d));
const entry = (status: "intended" | "fasted") => ({ status, updatedAt: "2026-01-01T00:00:00Z" });

beforeEach(async () => {
  await AsyncStorage.clear();
  resetExpoRouterMock();
  whiteDaysChecklistStore.setState({ done: {}, isReady: true });
  voluntaryFastingStore.setState({ entries: {}, isReady: true });
  preferencesStore.setState({ prefs: { ...DEFAULT_USER_PREFERENCES, activeExcusedReason: null } });
});
afterEach(() => jest.restoreAllMocks());

describe("WhiteDaysTrackerSection", () => {
  it("renders nothing outside the 13th–15th of the Hijri month", async () => {
    await renderSection(ORDINARY_DAY);

    expect(screen.toJSON()).toBeNull();
  });

  it("lists the three White Day fasts with progress", async () => {
    await renderSection();

    expect(checkboxes()).toHaveLength(TOTAL);
    expect(screen.getByText(progress(0))).toBeTruthy();
  });

  it("dates each fast and cites its source", async () => {
    await renderSection();

    expect(screen.getByText(/Nasa'i 2422/)).toBeTruthy();
  });

  it("falls back to ISO dates when the locale cannot format them", async () => {
    jest.spyOn(Date.prototype, "toLocaleDateString").mockImplementation(() => {
      throw new RangeError("bad locale");
    });
    await renderSection();

    expect(screen.getAllByText(/^\d{4}-\d{2}-\d{2} · /).length).toBeGreaterThan(0);
  });

  it("records the fast in the voluntary-fasting log (one record of a fast)", async () => {
    await renderSection();

    await fireEvent.press(checkboxes()[1]);
    expect(await screen.findByText(progress(1))).toBeTruthy();
    const logged = Object.entries(voluntaryFastingStore.getState().entries);
    expect(logged).toHaveLength(1);
    expect(logged[0]?.[1].status).toBe("fasted");

    await fireEvent.press(checkboxes()[1]);
    expect(await screen.findByText(progress(0))).toBeTruthy();
    expect(Object.values(voluntaryFastingStore.getState().entries)[0]?.deleted).toBe(true);
  });

  it("shows fasts logged from /fasting; an intended fast is not counted as done", async () => {
    const [y, m] = [1448, 2];
    voluntaryFastingStore.setState({
      entries: { [dateOf(y, m, 13)]: entry("fasted"), [dateOf(y, m, 14)]: entry("intended") },
    });
    await renderSection(dateOf(y, m, 14));

    expect(screen.getByText(progress(1))).toBeTruthy();
    expect(checkboxes()[0]?.props.accessibilityState).toMatchObject({ checked: true });
    expect(checkboxes()[1]?.props.accessibilityState).toMatchObject({ checked: false });
    expect(screen.getByText(/Intended/)).toBeTruthy();
  });

  it("explains a blocked fast instead of failing silently (nifas)", async () => {
    const futureWhiteDay = firstDateWhere((d) => isWhiteDayDateString(d), "2027-01-01");
    await renderSection(futureWhiteDay);
    // After render: providers may hydrate preferences on mount.
    preferencesStore.setState({
      prefs: { ...preferencesStore.getState().prefs, activeExcusedReason: "nifas" },
    });

    const index = WHITE_DAYS_CHECKLIST.length - 1;
    await fireEvent.press(checkboxes()[index]);

    await waitFor(() => expect(screen.getByText(/can't be marked as fasted/)).toBeTruthy());
    expect(Object.values(voluntaryFastingStore.getState().entries)).toHaveLength(0);
  });

  it("on 14 Dhul-Hijjah lists only the 14th and 15th (13th is Tashriq)", async () => {
    await renderSection(dateOf(1448, 12, 14));

    expect(checkboxes()).toHaveLength(2);
    expect(screen.getByText(/0 of 2 fasted/)).toBeTruthy();
  });

  it("renders nothing on 13 Dhul-Hijjah", async () => {
    await renderSection(dateOf(1448, 12, 13));

    expect(screen.toJSON()).toBeNull();
  });

  it("links to the White Days guide", async () => {
    await renderSection();

    await fireEvent.press(screen.getByText("Learn about White Days"));

    expect(mockRouter.push).toHaveBeenCalledWith("/white-days");
  });
});

describe("WhiteDaysTrackerSection on TV", () => {
  usePlatform({ isTV: true });

  it("keeps every fast reachable", async () => {
    await renderSection();

    expect(checkboxes()).toHaveLength(TOTAL);
  });
});
