import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import QazaHomeScreen from "@/app/qaza";
import { ToastHost } from "@/providers/toast-provider";
import { buildQazaCounter, buildQazaSchedule } from "@/test-support/fixtures/qaza";
import { resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithProviders } from "@/test-support/render";
import { restoreTrackerStore, seedTrackerStore } from "@/test-support/store";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

const performQaza = jest.fn(async () => {});
const undoQaza = jest.fn(async () => {});
const adjustQaza = jest.fn(async () => {});
const resetQazaCounter = jest.fn(async () => {});
const refresh = jest.fn(async () => {});

const seed = (isReady = true) =>
  seedTrackerStore({
    isReady,
    qazaSchedule: buildQazaSchedule({ targets: {} }),
    qazaCounters: [
      buildQazaCounter({ prayerId: "fajr", remaining: 8, completed: 3 }),
      buildQazaCounter({ prayerId: "dhuhr", remaining: 0, completed: 0 }),
    ],
    performQaza,
    undoQaza,
    adjustQaza,
    resetQazaCounter,
    refresh,
  });

const renderHub = () =>
  renderWithProviders(
    <>
      <QazaHomeScreen />
      <ToastHost />
    </>,
  );

beforeEach(() => {
  jest.clearAllMocks();
  resetExpoRouterMock();
});
afterEach(restoreTrackerStore);

describe("Qaza hub", () => {
  it("puts the tools and the Witr hint above the per-prayer list, Reset all last", async () => {
    await seed();
    await renderHub();

    const order = ["Calculator", "Is Witr Qaza required?", "Per prayer", "Reset all counters"];
    const tree = JSON.stringify(screen.toJSON());
    const positions = order.map((text) => tree.indexOf(text));
    expect(positions.every((index) => index >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  it("shows each prayer as one compact row with a theme-coloured count", async () => {
    await seed();
    await renderHub();

    expect(screen.getByLabelText("Fajr, 8 remaining")).toBeTruthy();
    expect(screen.getByText("3 made up")).toBeTruthy();
    // No separate pencil: the row itself is the (named) edit action.
    expect(screen.queryByLabelText("Edit Fajr remaining Qaza count")).toBeNull();
    expect(screen.getByHintText("Edit Fajr remaining Qaza count")).toBeTruthy();
  });

  it("shows a soft All made up state once a prayer is cleared", async () => {
    await seedTrackerStore({
      isReady: true,
      qazaSchedule: buildQazaSchedule({ targets: {} }),
      qazaCounters: [buildQazaCounter({ prayerId: "asr", remaining: 0, completed: 5 })],
      performQaza,
      undoQaza,
      adjustQaza,
      resetQazaCounter,
      refresh,
    });
    await renderHub();

    expect(screen.getByText("All made up")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Made up one Asr" }).props.accessibilityState,
    ).toMatchObject({ disabled: true });
  });

  it("shows a skeleton, not zero counts, until the tracker is ready", async () => {
    await seed(false);
    await renderHub();

    expect(screen.queryByText("Per prayer")).toBeNull();
    expect(screen.getByLabelText("Loading…")).toBeTruthy();
  });

  it("logs a make-up in one tap with an Undo toast that restores the count", async () => {
    await seed();
    await renderHub();

    await fireEvent.press(screen.getByRole("button", { name: "Made up one Fajr" }));

    await waitFor(() => expect(performQaza).toHaveBeenCalledTimes(1));
    expect(performQaza).toHaveBeenCalledWith("fajr");
    expect(screen.queryByText("Confirm")).toBeNull();

    await fireEvent.press(await screen.findByText("Undo"));
    expect(undoQaza).toHaveBeenCalledWith("fajr");
  });

  it("disables Made up when nothing is owed", async () => {
    await seed();
    await renderHub();

    expect(
      screen.getByRole("button", { name: "Made up one Dhuhr" }).props.accessibilityState,
    ).toMatchObject({ disabled: true });
    expect(
      screen.getByRole("button", { name: "Made up one Fajr" }).props.accessibilityState?.disabled,
    ).toBeFalsy();
  });

  it("steps the count from the edit sheet with no dialog", async () => {
    await seed();
    await renderHub();

    await fireEvent.press(screen.getByHintText("Edit Fajr remaining Qaza count"));
    await fireEvent.press(screen.getByLabelText("Decrease Fajr remaining"));

    expect(adjustQaza).toHaveBeenCalledWith("fajr", 7, 3);
    expect(screen.queryByText("Confirm")).toBeNull();
  });

  it("still confirms a reset, with the destructive button", async () => {
    await seed();
    await renderHub();

    await fireEvent(screen.getByHintText("Edit Fajr remaining Qaza count"), "longPress");
    await fireEvent.press(screen.getByText("Reset Fajr Qaza counter"));

    expect(screen.getByText("Reset this counter?")).toBeTruthy();
    expect(resetQazaCounter).not.toHaveBeenCalled();
    await fireEvent.press(screen.getAllByText("Reset")[0] as never);
    await waitFor(() => expect(resetQazaCounter).toHaveBeenCalledWith("fajr"));
  });
});
