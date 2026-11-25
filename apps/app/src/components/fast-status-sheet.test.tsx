import { fireEvent, screen } from "@testing-library/react-native";

import { FastStatusSheet } from "@/components/fast-status-sheet";
import { triggerHaptic } from "@/lib/haptics";
import type { FastStatus } from "@/stores/fasting-store";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);

const renderSheet = async (currentStatus?: FastStatus) => {
  const handlers = { onSelect: jest.fn(), onClose: jest.fn() };
  await renderWithTheme(
    <FastStatusSheet visible dayLabel="1 Ramadan" currentStatus={currentStatus} {...handlers} />,
  );
  return handlers;
};

const option = (label: string) => screen.getByRole("radio", { name: label });

beforeEach(() => jest.mocked(triggerHaptic).mockClear());

describe("FastStatusSheet", () => {
  it("titles the sheet with the day and marks the current status", async () => {
    await renderSheet("missed");

    expect(option("Missed").props.accessibilityState).toEqual({ checked: true });
    expect(option("Not marked").props.accessibilityState).toEqual({ checked: false });
  });

  it("treats an unmarked day as Not marked", async () => {
    await renderSheet();

    expect(option("Not marked").props.accessibilityState).toEqual({ checked: true });
  });

  it.each([
    ["Fasted", "fasted", "success"],
    ["Missed", "missed", "warning"],
    ["Exempt", "exempt", "selection"],
    ["Not marked", null, "selection"],
  ] as const)("%s saves %s with a %s haptic and closes", async (label, status, haptic) => {
    const { onSelect, onClose } = await renderSheet();

    await fireEvent.press(option(label));

    expect(onSelect).toHaveBeenCalledWith(status);
    expect(triggerHaptic).toHaveBeenCalledWith(haptic);
    expect(onClose).toHaveBeenCalled();
  });
});

describe("FastStatusSheet on TV", () => {
  usePlatform({ isTV: true });

  it.each([
    [undefined, "Not marked"],
    ["exempt", "Exempt"],
  ] as const)("focuses the current status (%s)", async (status, label) => {
    await renderSheet(status);

    expect(option(label).props.hasTVPreferredFocus).toBe(true);
  });
});
