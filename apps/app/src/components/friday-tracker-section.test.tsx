import { FRIDAY_CHECKLIST } from "@munib-tracker/shared/content/friday-checklist";
import { fireEvent, screen } from "@testing-library/react-native";

import { FridayTrackerSection } from "@/components/friday-tracker-section";
import { isFridayDateString } from "@/lib/friday";
import { fridayChecklistStore } from "@/stores/friday-checklist-store";
import { defined } from "@/test-support/assert";
import { firstDateWhere } from "@/test-support/dates";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

const FRIDAY = firstDateWhere(isFridayDateString);
const THURSDAY = firstDateWhere((d) => !isFridayDateString(d));
const TOTAL = FRIDAY_CHECKLIST.length;

const renderSection = (date = FRIDAY) => renderWithTheme(<FridayTrackerSection date={date} />);
const checkboxes = () => screen.getAllByRole("checkbox");

beforeEach(() => {
  resetExpoRouterMock();
  fridayChecklistStore.setState({ done: {}, isReady: true });
});

describe("FridayTrackerSection", () => {
  it("renders nothing on other days", async () => {
    await renderSection(THURSDAY);

    expect(screen.toJSON()).toBeNull();
  });

  it("lists every Jumu'ah practice unchecked with progress", async () => {
    await renderSection();

    expect(checkboxes()).toHaveLength(TOTAL);
    expect(checkboxes().every((box) => box.props.accessibilityState.checked === false)).toBe(true);
    expect(screen.getByText(new RegExp(`0 of ${TOTAL}`))).toBeTruthy();
  });

  it("checks off a practice for that Friday", async () => {
    await renderSection();

    await fireEvent.press(checkboxes()[0]);

    expect(await screen.findByText(new RegExp(`1 of ${TOTAL}`))).toBeTruthy();
    expect(checkboxes()[0].props.accessibilityState.checked).toBe(true);
  });

  it("opens a practice's related content", async () => {
    await renderSection();

    await fireEvent.press(screen.getAllByLabelText(/^Details: /)[0]);

    expect(mockRouter.push).toHaveBeenCalledWith(
      defined(
        FRIDAY_CHECKLIST.find((item) => item.route),
        "a Friday item with a route",
      ).route,
    );
  });

  it("unchecks a completed practice", async () => {
    await renderSection();
    await fireEvent.press(checkboxes()[0]);

    await fireEvent.press(checkboxes()[0]);

    expect(await screen.findByText(new RegExp(`0 of ${TOTAL}`))).toBeTruthy();
  });

  it("links to the Friday guide", async () => {
    await renderSection();

    await fireEvent.press(screen.getByText("Learn Friday practices"));

    expect(mockRouter.push).toHaveBeenCalledWith("/friday");
  });
});

describe("FridayTrackerSection on TV", () => {
  usePlatform({ isTV: true });

  it("keeps every practice reachable", async () => {
    await renderSection();

    expect(checkboxes()).toHaveLength(TOTAL);
  });
});
