import { fireEvent, screen } from "@testing-library/react-native";

import { ExcusedDayPicker } from "@/components/excused-day-picker";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { restoreTrackerStore, seedTrackerStore } from "@/test-support/store";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

type Props = Parameters<typeof ExcusedDayPicker>[0];

const setDayExcused = jest.fn(async () => {});
const renderPicker = (props: Props = {}) => renderWithTheme(<ExcusedDayPicker {...props} />);
const chip = (label: string) => screen.getByRole("button", { name: label });

beforeEach(async () => {
  resetExpoRouterMock();
  setDayExcused.mockClear();
  await seedTrackerStore({ excusedReason: null, setDayExcused });
});
afterEach(restoreTrackerStore);

describe("ExcusedDayPicker (tracker store)", () => {
  it("offers each excused reason with a hint", async () => {
    await renderPicker();

    expect(["Hayd", "Illness", "Travel"].map(chip)).toHaveLength(3);
  });

  it("opens the reason's guide to start an excused period", async () => {
    await renderPicker();

    await fireEvent.press(chip("Travel"));

    expect(mockRouter.push).toHaveBeenCalledWith("/travel");
  });

  it("ends the active excused period", async () => {
    await seedTrackerStore({ excusedReason: "sick" });
    await renderPicker();

    expect(chip("Illness").props.accessibilityState).toEqual({ selected: true });
    await fireEvent.press(chip("Illness"));

    expect(setDayExcused).toHaveBeenCalledWith(null);
  });
});

describe("ExcusedDayPicker (controlled)", () => {
  it.each([
    [null, "Hayd", "hayd"],
    ["hayd", "Hayd", null],
  ] as const)("with %s selected, pressing %s reports %s", async (excusedReason, label, next) => {
    const onExcusedChange = jest.fn();
    await renderPicker({ excusedReason, onExcusedChange });

    await fireEvent.press(chip(label));

    expect(onExcusedChange).toHaveBeenCalledWith(next);
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("treats a missing reason as none", async () => {
    await renderPicker({ onExcusedChange: jest.fn() });

    expect(chip("Travel").props.accessibilityState).toEqual({ selected: false });
  });
});

describe("ExcusedDayPicker variants", () => {
  it("renders inline with its own title", async () => {
    await renderPicker({ variant: "inline" });

    expect(screen.getByText("Excused day")).toBeTruthy();
  });
});

describe("ExcusedDayPicker on TV", () => {
  usePlatform({ isTV: true });

  it("keeps the selected chip distinct from focus", async () => {
    await renderPicker({ excusedReason: "travel", onExcusedChange: jest.fn() });

    expect(chip("Travel").props.accessibilityState).toEqual({ selected: true });
  });
});
