import { WHITE_DAYS_CHECKLIST } from "@munib-tracker/shared/content/white-days-checklist";
import { fireEvent, screen } from "@testing-library/react-native";

import { WhiteDaysTrackerSection } from "@/components/white-days-tracker-section";
import { isWhiteDayDateString } from "@/lib/white-days";
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

beforeEach(() => {
  resetExpoRouterMock();
  whiteDaysChecklistStore.setState({ done: {}, isReady: true });
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

  it("toggles a fast for the whole Hijri month", async () => {
    await renderSection();

    await fireEvent.press(checkboxes()[1]!);
    expect(await screen.findByText(progress(1))).toBeTruthy();

    await fireEvent.press(checkboxes()[1]!);
    expect(await screen.findByText(progress(0))).toBeTruthy();
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
