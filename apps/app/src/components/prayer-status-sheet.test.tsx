import type { UserPreferences } from "@munib-tracker/shared/types";
import { fireEvent, screen } from "@testing-library/react-native";

import { PrayerStatusSheet } from "@/components/prayer-status-sheet";
import { PreferencesRepository } from "@/db";
import { afterSalahAdhkarRoute } from "@/lib/after-salah-adhkar-reminder";
import { triggerHaptic } from "@/lib/haptics";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { resetPreferences, setPreferences } from "@/test-support/preferences";
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

const option = (status: string) => screen.getByRole("radio", { name: status });

beforeEach(() => {
  resetExpoRouterMock();
  jest.mocked(triggerHaptic).mockClear();
});

describe("PrayerStatusSheet status options", () => {
  it("offers every status for obligatory prayers", async () => {
    await renderSheet();

    expect(["Completed", "Missed", "Delayed", "Qaza"].map(option)).toHaveLength(4);
    expect(screen.getByText("How did this Salah go today?")).toBeTruthy();
  });

  it("offers only completed or missed for Sunnah prayers", async () => {
    await renderSheet({ prayerId: "duha", prayerLabel: "Duha" });

    expect(screen.queryByRole("radio", { name: "Delayed" })).toBeNull();
    expect(screen.queryByText("Read after-Salah adhkar")).toBeNull();
  });

  it("is a radio group with the current status checked", async () => {
    await renderSheet({ currentStatus: "delayed" });

    expect(screen.getByLabelText("Status for Fajr").props.accessibilityRole).toBe("radiogroup");
    expect(option("Delayed").props.accessibilityState).toEqual({ checked: true });
    expect(option("Completed").props.accessibilityState).toEqual({ checked: false });
  });

  it.each([
    ["Completed", "completed", "success"],
    ["Delayed", "delayed", "selection"],
  ])("selecting %s saves %s with a %s haptic and stays open", async (label, status, haptic) => {
    const { onSelect, onClose } = await renderSheet();

    await fireEvent.press(option(label));

    expect(onSelect).toHaveBeenCalledWith(status);
    expect(triggerHaptic).toHaveBeenCalledWith(haptic);
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByTestId("sheet")).toBeTruthy();
  });

  it("keeps the congregation toggle live after a status, then Done closes", async () => {
    const onToggleJama = jest.fn();
    const { onSelect, onClose } = await renderSheet({ onToggleJama });

    await fireEvent.press(option("Completed"));
    await fireEvent.press(screen.getByRole("switch", { name: "Prayed in congregation" }));
    await fireEvent.press(screen.getByText("Done"));

    expect(onSelect).toHaveBeenCalledWith("completed");
    expect(onToggleJama).toHaveBeenCalledWith(true);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("re-pressing the checked status does nothing; Clear status resets it", async () => {
    const { onSelect } = await renderSheet({ currentStatus: "missed" });

    await fireEvent.press(option("Missed"));
    expect(onSelect).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByText("Clear status"));
    expect(onSelect).toHaveBeenCalledWith("pending");
  });

  it("hides Clear status while the Salah is not marked", async () => {
    await renderSheet();

    expect(screen.queryByText("Clear status")).toBeNull();
  });

  it("marks a missed Sunnah directly without the Qaza prompt", async () => {
    const { onSelect } = await renderSheet({ prayerId: "duha", prayerLabel: "Duha" });

    await fireEvent.press(option("Missed"));

    expect(onSelect).toHaveBeenCalledWith("missed");
    expect(triggerHaptic).toHaveBeenCalledWith("warning");
  });
});

/** Store + repository (providers may re-read the repository on mount). */
async function seedPrefs(patch: Partial<UserPreferences>) {
  await PreferencesRepository.update(patch);
  await setPreferences(patch);
}

describe("PrayerStatusSheet Witr Qaza (madhhab retrofit)", () => {
  afterEach(resetPreferences);

  it.each([
    ["hanafi", true],
    ["shafii", false],
    ["maliki", false],
    ["hanbali", false],
  ] as const)(
    "%s: offers the Witr Qaza prompt only when accrual is on (%s)",
    async (madhhab, asks) => {
      await seedPrefs({ madhhab, witrQaza: undefined });
      const { onSelect } = await renderSheet({ prayerId: "witr", prayerLabel: "Witr" });
      await fireEvent.press(option("Missed"));
      if (asks) {
        expect(screen.getByText("Add one to your Qaza count for Witr?")).toBeTruthy();
        expect(onSelect).not.toHaveBeenCalled();
      } else {
        expect(onSelect).toHaveBeenCalledWith("missed");
      }
    },
  );

  it("an explicit opt-in brings the prompt back for other schools", async () => {
    await seedPrefs({ madhhab: "shafii", witrQaza: true });
    await renderSheet({ prayerId: "witr", prayerLabel: "Witr" });
    await fireEvent.press(option("Missed"));
    expect(screen.getByText("Add one to your Qaza count for Witr?")).toBeTruthy();
  });
});

describe("PrayerStatusSheet Qaza prompt", () => {
  it("asks whether a missed obligatory prayer should add to Qaza", async () => {
    const { onSelect } = await renderSheet();

    await fireEvent.press(option("Missed"));

    expect(screen.getByText("Add one to your Qaza count for Fajr?")).toBeTruthy();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it.each([
    ["Yes, add to Qaza", true],
    ["No, skip", false],
  ])("%s records the status with addToQaza=%s", async (answer, addToQaza) => {
    const { onSelect, onClose } = await renderSheet();
    await fireEvent.press(option("Qaza"));

    await fireEvent.press(screen.getByText(answer));

    expect(onSelect).toHaveBeenCalledWith("qaza", { addToQaza });
    // Back on the status sheet so the details can still be set.
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByText("How did this Salah go today?")).toBeTruthy();
  });

  it("dismissing the prompt returns to the status options", async () => {
    const { onSelect } = await renderSheet();
    await fireEvent.press(option("Missed"));

    await fireEvent.press(screen.getAllByTestId("sheet-close")[0]);

    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByText("How did this Salah go today?")).toBeTruthy();
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

    expect(screen.getByText("How did this Salah go today?")).toBeTruthy();
  });
});

describe("PrayerStatusSheet extras", () => {
  it.each([
    [false, true],
    [true, false],
  ])("toggles congregation from %s to %s", async (isJama, next) => {
    const onToggleJama = jest.fn();
    await renderSheet({ isJama, onToggleJama });

    const toggle = screen.getByRole("switch", { name: "Prayed in congregation" });
    expect(toggle.props.accessibilityState).toMatchObject({ checked: isJama });
    await fireEvent.press(toggle);

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

  it("links to after-Salah adhkar for obligatory prayers", async () => {
    const { onClose } = await renderSheet();

    await fireEvent.press(screen.getByText("Read after-Salah adhkar"));

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

  it("shows the caller's Missed / Qaza Undo in the sheet while it is available (B-04)", async () => {
    const undo = jest.fn(() => true);
    const view = await renderSheet({
      currentStatus: "missed",
      undo: { undoAvailable: false, undo },
    });
    expect(screen.queryByRole("button", { name: "Undo" })).toBeNull();

    await view.rerender(
      <PrayerStatusSheet
        visible
        prayerId="fajr"
        prayerLabel="Fajr"
        currentStatus="missed"
        onSelect={jest.fn()}
        onSaveNotes={jest.fn()}
        onClose={jest.fn()}
        undo={{ undoAvailable: true, undo }}
      />,
    );
    await fireEvent.press(screen.getByRole("button", { name: "Undo" }));

    expect(undo).toHaveBeenCalledTimes(1);
  });
});
