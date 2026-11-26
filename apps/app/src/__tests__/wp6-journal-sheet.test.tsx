/**
 * Khushu journal sheet: the discard / overwrite confirms render INSIDE the open
 * sheet (a sibling RN Modal can't present over it on iOS — the sheet got stuck
 * after changing the Salah pill).
 */
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { act, fireEvent, screen, waitFor, within } from "@testing-library/react-native";
import { useFocusEffect } from "expo-router";
import { useEffect } from "react";

import JournalScreen from "@/app/journal";
import { PrayerRepository } from "@/db";
import { khushuStore } from "@/stores/khushu-store";
import { resetToastMock } from "@/test-support/mocks/toast-provider";
import { queryHostsByType } from "@/test-support/queries";
import { renderWithProviders } from "@/test-support/render";
import { loadTrackerStore, resetTrackerStore } from "@/test-support/store";

jest.mock("@/providers/toast-provider", () => ({
  ...jest.requireActual("@/providers/toast-provider"),
  ...require("@/test-support/mocks/toast-provider").toastProviderMock,
}));

jest.mock("expo-router", () => {
  const actual = jest.requireActual("@/test-support/mocks/expo-router");
  return {
    ...actual.expoRouterMock,
    useRouter: () => ({
      push: jest.fn(),
      back: jest.fn(),
      replace: jest.fn(),
      canGoBack: () => false,
      canDismiss: () => false,
    }),
    useFocusEffect: jest.fn(),
  };
});

const SHEET_TITLE = "How was your Salah?";

beforeEach(async () => {
  resetToastMock();
  await resetTrackerStore();
  khushuStore.setState({ items: [], isReady: true });
  jest.mocked(useFocusEffect).mockImplementation((callback) => {
    useEffect(callback, [callback]);
  });
  const today = getLocalDateString();
  await PrayerRepository.setStatus("fajr", today, "completed");
  await PrayerRepository.setStatus("dhuhr", today, "completed");
  await loadTrackerStore();
});

afterEach(() => {
  jest.mocked(useFocusEffect).mockReset();
  jest.restoreAllMocks();
});

async function openFajrSheetAndSwitchToDhuhr() {
  await renderWithProviders(<JournalScreen />);
  await waitFor(() => expect(screen.getByLabelText("Reflect on Fajr")).toBeTruthy(), {
    timeout: 15_000,
  });
  await act(async () => {
    fireEvent.press(screen.getByLabelText("Reflect on Fajr"));
  });
  await screen.findByText(SHEET_TITLE);
  // Change the Salah pill → the form is dirty.
  await act(async () => {
    fireEvent.press(screen.getByRole("radio", { name: "Dhuhr" }));
  });
}

/** Presented RN Modals (a hidden Modal renders no host). */
const visibleModals = () => [
  ...queryHostsByType("Modal").filter((modal) => modal.props.visible !== false),
  ...queryHostsByType("RCTModalHostView").filter((modal) => modal.props.visible !== false),
];

describe("Journal sheet confirms (iOS stacked-modal fix)", () => {
  it("Cancel after changing the Salah pill asks to discard inside the same sheet", async () => {
    await openFajrSheetAndSwitchToDhuhr();
    await act(async () => {
      fireEvent.press(screen.getByText("Cancel"));
    });

    const confirm = await screen.findByTestId("journal-inline-confirm");
    expect(within(confirm).getByText("Discard changes?")).toBeTruthy();
    // Only the journal sheet's Modal is presented — no second, stacked Modal.
    expect(visibleModals()).toHaveLength(1);

    await act(async () => {
      fireEvent.press(within(confirm).getByText("Discard"));
    });
    await waitFor(() => expect(screen.queryByText(SHEET_TITLE)).toBeNull());
    expect(visibleModals()).toHaveLength(0);
  });

  it("cancelling the confirm returns to the form with the edit kept", async () => {
    await openFajrSheetAndSwitchToDhuhr();
    await act(async () => {
      fireEvent.press(screen.getByText("Cancel"));
    });
    const confirm = await screen.findByTestId("journal-inline-confirm");
    await act(async () => {
      fireEvent.press(within(confirm).getByText("Cancel"));
    });

    expect(screen.queryByTestId("journal-inline-confirm")).toBeNull();
    expect(screen.getByText(SHEET_TITLE)).toBeTruthy();
    expect(screen.getByRole("radio", { name: "Dhuhr" }).props.accessibilityState?.checked).toBe(
      true,
    );
  });

  it("asks to replace an existing reflection inside the sheet, then saves", async () => {
    const today = getLocalDateString();
    await act(async () => {
      await khushuStore.getState().save({ date: today, prayerId: "dhuhr", rating: 3, note: "" });
    });
    await openFajrSheetAndSwitchToDhuhr();
    const [fourStars] = screen.getAllByRole("radio", { name: /^4, / });
    if (!fourStars) throw new Error("no rating star");
    await act(async () => {
      fireEvent.press(fourStars);
    });
    await act(async () => {
      fireEvent.press(screen.getByText("Save"));
    });

    const confirm = await screen.findByTestId("journal-inline-confirm");
    expect(within(confirm).getByText("Replace existing reflection?")).toBeTruthy();
    expect(visibleModals()).toHaveLength(1);
    await act(async () => {
      fireEvent.press(within(confirm).getByText("Save"));
    });
    await waitFor(() => expect(screen.queryByText(SHEET_TITLE)).toBeNull());
    const dhuhr = khushuStore.getState().items.find((item) => item.prayerId === "dhuhr");
    expect(dhuhr?.rating).toBe(4);
  });
});
