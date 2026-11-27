import { act, fireEvent, screen } from "@testing-library/react-native";
import { Pressable, Text } from "react-native";

import { usePrayerStatusController } from "@/components/tracker/use-prayer-status-controller";
import { QazaRepository } from "@/db";
import { trackerStore } from "@/stores/tracker-store";
import { mockToast } from "@/test-support/mocks/toast-provider";
import { renderWithTheme } from "@/test-support/render";
import { resetTrackerStore } from "@/test-support/store";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock("@/features/reviews/lib/reviewEngagementBridge", () => ({
  trackReviewInteraction: jest.fn(),
}));

function Harness() {
  const controller = usePrayerStatusController();
  return (
    <>
      <Pressable accessibilityRole="button" onPress={() => controller.open("fajr")}>
        <Text>open fajr</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => void controller.quickSelect("dhuhr", "completed")}
      >
        <Text>quick dhuhr</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => void controller.quickSelect("dhuhr", "missed")}
      >
        <Text>restore dhuhr</Text>
      </Pressable>
      {controller.sheet}
    </>
  );
}

const status = (id: string) => trackerStore.getState().prayerStatus[id] ?? "pending";

beforeEach(async () => {
  jest.clearAllMocks();
  await resetTrackerStore();
});

describe("usePrayerStatusController (P5-03)", () => {
  it("keeps the sheet open after a status and offers Undo for Missed that restores Qaza", async () => {
    await renderWithTheme(<Harness />);
    await fireEvent.press(screen.getByText("open fajr"));

    await fireEvent.press(screen.getByRole("radio", { name: "Missed" }));
    await act(async () => {
      fireEvent.press(screen.getByText("Yes, add to Qaza"));
    });

    expect(status("fajr")).toBe("missed");
    expect((await QazaRepository.getCounter("fajr")).remaining).toBe(1);
    // Still on the status sheet for the details.
    expect(screen.getByText("How did this Salah go today?")).toBeTruthy();
    expect(mockToast.show).toHaveBeenCalledTimes(1);
    const [title, options] = mockToast.show.mock.calls[0];
    expect(title).toBe("Fajr marked Missed");

    await act(async () => {
      options.action.onPress();
    });

    expect(status("fajr")).toBe("pending");
    expect((await QazaRepository.getCounter("fajr")).remaining).toBe(0);
  });

  it("marks Completed without a toast (the row shows it)", async () => {
    await renderWithTheme(<Harness />);
    await fireEvent.press(screen.getByText("open fajr"));

    await act(async () => {
      fireEvent.press(screen.getByRole("radio", { name: "Completed" }));
    });

    expect(status("fajr")).toBe("completed");
    expect(mockToast.show).not.toHaveBeenCalled();
  });

  it("re-adds a Qaza debt the one-tap mark unwound when it is undone", async () => {
    await act(async () => {
      await trackerStore.getState().setPrayerStatus("dhuhr", "missed", { addToQaza: true });
    });
    await renderWithTheme(<Harness />);

    await act(async () => {
      fireEvent.press(screen.getByText("quick dhuhr"));
    });
    expect(status("dhuhr")).toBe("completed");
    expect((await QazaRepository.getCounter("dhuhr")).remaining).toBe(0);

    await act(async () => {
      fireEvent.press(screen.getByText("restore dhuhr"));
    });
    expect(status("dhuhr")).toBe("missed");
    expect((await QazaRepository.getCounter("dhuhr")).remaining).toBe(1);
  });
});
