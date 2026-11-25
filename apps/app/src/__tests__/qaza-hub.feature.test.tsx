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
  it("shows a skeleton, not zero counts, until the tracker is ready", async () => {
    await seed(false);
    await renderHub();

    expect(screen.queryByText("Per prayer")).toBeNull();
    expect(screen.getByLabelText("Loading…")).toBeTruthy();
  });

  it("logs a make-up in one tap with an Undo toast that restores the count", async () => {
    await seed();
    await renderHub();

    await fireEvent.press(screen.getAllByText("Made up")[0] as never);

    await waitFor(() => expect(performQaza).toHaveBeenCalledTimes(1));
    expect(performQaza).toHaveBeenCalledWith("fajr");
    expect(screen.queryByText("Confirm")).toBeNull();

    await fireEvent.press(await screen.findByText("Undo"));
    expect(undoQaza).toHaveBeenCalledWith("fajr");
  });

  it("disables Made up when nothing is owed", async () => {
    await seed();
    await renderHub();

    const buttons = screen.getAllByRole("button", { name: /Made up/ });
    expect(buttons.some((b) => b.props.accessibilityState?.disabled)).toBe(true);
  });

  it("steps the count from the edit sheet with no dialog", async () => {
    await seed();
    await renderHub();

    await fireEvent.press(screen.getByLabelText("Edit Fajr remaining Qaza count"));
    await fireEvent.press(screen.getByLabelText("Decrease Fajr remaining"));

    expect(adjustQaza).toHaveBeenCalledWith("fajr", 7, 3);
    expect(screen.queryByText("Confirm")).toBeNull();
  });

  it("still confirms a reset, with the destructive button", async () => {
    await seed();
    await renderHub();

    await fireEvent.press(screen.getByLabelText("Edit Fajr remaining Qaza count"));
    await fireEvent.press(screen.getByText("Reset Fajr Qaza counter"));

    expect(screen.getByText("Reset this counter?")).toBeTruthy();
    expect(resetQazaCounter).not.toHaveBeenCalled();
    await fireEvent.press(screen.getAllByText("Reset")[0] as never);
    await waitFor(() => expect(resetQazaCounter).toHaveBeenCalledWith("fajr"));
  });
});
