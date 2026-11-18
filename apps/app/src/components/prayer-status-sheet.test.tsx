import { fireEvent, screen } from "@testing-library/react-native";

import { PrayerStatusSheet } from "@/components/prayer-status-sheet";
import { afterSalahAdhkarRoute } from "@/lib/after-salah-adhkar-reminder";
import { triggerHaptic } from "@/lib/haptics";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);

type Props = Parameters<typeof PrayerStatusSheet>[0];

const renderSheet = async (props: Partial<Props> = {}) => {
  const handlers = { onSelect: jest.fn(), onSaveNotes: jest.fn(), onClose: jest.fn() };
  const view = await renderWithTheme(
    <PrayerStatusSheet
      visible
      prayerId="fajr"
      prayerLabel="Fajr"
      currentStatus="pending"
      {...handlers}
      {...props}
    />,
  );
  return { ...handlers, ...view };
};

const option = (status: string) => screen.getByRole("button", { name: status });

beforeEach(() => {
  resetExpoRouterMock();
  jest.mocked(triggerHaptic).mockClear();
});

describe("PrayerStatusSheet status options", () => {
  it("offers every status for obligatory prayers", async () => {
    await renderSheet();

    expect(["Completed", "Missed", "Delayed", "Qaza"].map(option)).toHaveLength(4);
    expect(screen.getByText("How did this prayer go today?")).toBeTruthy();
  });

  it("offers only completed or missed for sunnah prayers", async () => {
    await renderSheet({ prayerId: "duha", prayerLabel: "Duha" });

    expect(screen.queryByRole("button", { name: "Delayed" })).toBeNull();
    expect(screen.queryByText("Read after-salah adhkar")).toBeNull();
  });

  it("marks the current status as selected", async () => {
    await renderSheet({ currentStatus: "delayed" });

    expect(option("Delayed").props.accessibilityState).toEqual({ selected: true });
  });

  it.each([
    ["Completed", "completed", "success"],
    ["Delayed", "delayed", "selection"],
  ])("selecting %s saves %s with a %s haptic and closes", async (label, status, haptic) => {
    const { onSelect, onClose } = await renderSheet();

    await fireEvent.press(option(label));

    expect(onSelect).toHaveBeenCalledWith(status);
    expect(triggerHaptic).toHaveBeenCalledWith(haptic);
    expect(onClose).toHaveBeenCalled();
  });

  it("clears the current status when it is picked again", async () => {
    const { onSelect } = await renderSheet({ currentStatus: "missed" });

    await fireEvent.press(option("Missed"));

    expect(onSelect).toHaveBeenCalledWith("pending");
  });

  it("marks a missed sunnah directly without the qaza prompt", async () => {
    const { onSelect } = await renderSheet({ prayerId: "duha", prayerLabel: "Duha" });

    await fireEvent.press(option("Missed"));

    expect(onSelect).toHaveBeenCalledWith("missed");
    expect(triggerHaptic).toHaveBeenCalledWith("warning");
  });
});

describe("PrayerStatusSheet qaza prompt", () => {
  it("asks whether a missed obligatory prayer should add to qaza", async () => {
    const { onSelect } = await renderSheet();

    await fireEvent.press(option("Missed"));

    expect(screen.getByText("Add one to your qaza count for Fajr?")).toBeTruthy();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it.each([
    ["Yes, add to qaza", true],
    ["No, skip", false],
  ])("%s records the status with addToQaza=%s", async (answer, addToQaza) => {
    const { onSelect, onClose } = await renderSheet();
    await fireEvent.press(option("Qaza"));

    await fireEvent.press(screen.getByText(answer));

    expect(onSelect).toHaveBeenCalledWith("qaza", { addToQaza });
    expect(onClose).toHaveBeenCalled();
  });

  it("dismissing the prompt returns to the status options", async () => {
    const { onSelect } = await renderSheet();
    await fireEvent.press(option("Missed"));

    await fireEvent.press(screen.getByTestId("sheet-close"));

    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByText("How did this prayer go today?")).toBeTruthy();
  });

  it("resets the prompt when the sheet is hidden", async () => {
    const { rerender, onSelect, onSaveNotes, onClose } = await renderSheet();
    await fireEvent.press(option("Missed"));
    const ui = (visible: boolean) => (
      <PrayerStatusSheet
        visible={visible}
        prayerId="fajr"
        prayerLabel="Fajr"
        currentStatus="pending"
        onSelect={onSelect}
        onSaveNotes={onSaveNotes}
        onClose={onClose}
      />
    );

    await rerender(ui(false));
    await rerender(ui(true));

    expect(screen.getByText("How did this prayer go today?")).toBeTruthy();
  });
});

describe("PrayerStatusSheet extras", () => {
  it.each([
    [false, true],
    [true, false],
  ])("toggles congregation from %s to %s", async (isJama, next) => {
    const onToggleJama = jest.fn();
    await renderSheet({ isJama, onToggleJama });

    await fireEvent.press(screen.getByRole("button", { name: "Prayed in congregation" }));

    expect(onToggleJama).toHaveBeenCalledWith(next);
  });

  it("hides the congregation toggle without a handler", async () => {
    await renderSheet();

    expect(screen.queryByText("Prayed in congregation")).toBeNull();
  });

  it("opens the notes editor and saves a trimmed note", async () => {
    const { onSaveNotes } = await renderSheet();

    await fireEvent.press(screen.getByText("Add a note"));
    await fireEvent.changeText(screen.getByLabelText(/e\.g\./), "  at the masjid ");
    await fireEvent.press(screen.getByText("Save note"));

    expect(onSaveNotes).toHaveBeenCalledWith("at the masjid");
  });

  it("previews an existing note and offers to edit it", async () => {
    await renderSheet({ currentNotes: "Prayed late" });

    expect(screen.getByText("Edit note")).toBeTruthy();
    expect(screen.getByText("“Prayed late”")).toBeTruthy();
  });

  it("links to after-salah adhkar for obligatory prayers", async () => {
    const { onClose } = await renderSheet();

    await fireEvent.press(screen.getByText("Read after-salah adhkar"));

    expect(mockRouter.push).toHaveBeenCalledWith(afterSalahAdhkarRoute("fajr"));
    expect(onClose).toHaveBeenCalled();
  });
});

describe("PrayerStatusSheet on TV", () => {
  usePlatform({ isTV: true });

  it.each([
    ["pending", "Completed"],
    ["missed", "Missed"],
  ] as const)("focuses %s's option first (%s)", async (currentStatus, label) => {
    await renderSheet({ currentStatus, isJama: true, onToggleJama: jest.fn() });

    expect(option(label).props.hasTVPreferredFocus).toBe(true);
  });
});
