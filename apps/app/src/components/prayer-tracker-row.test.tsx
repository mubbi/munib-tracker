import { fireEvent, screen } from "@testing-library/react-native";

import { PrayerTrackerRow } from "@/components/prayer-tracker-row";
import { Control } from "@/constants/theme";
import { triggerHaptic } from "@/lib/haptics";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);

type Props = Parameters<typeof PrayerTrackerRow>[0];

const renderRow = async (props: Partial<Props> = {}) => {
  const onPress = jest.fn();
  await renderWithTheme(
    <PrayerTrackerRow prayerId="fajr" status="pending" onPress={onPress} {...props} />,
  );
  return onPress;
};

const adhkar = (completed: number, total: number) => ({ completed, total });

describe("PrayerTrackerRow", () => {
  it.each([
    ["pending", "Fajr, Pending"],
    ["missed", "Fajr, Missed"],
    ["completed", "Fajr, Completed"],
  ] as const)("announces a %s prayer", async (status, label) => {
    await renderRow({ status });

    expect(screen.getByRole("button", { name: label })).toBeTruthy();
    expect(screen.getByText(label.split(", ")[1])).toBeTruthy();
  });

  it("opens the status sheet from the row", async () => {
    const onPress = await renderRow();

    await fireEvent.press(screen.getByRole("button", { name: "Fajr, Pending" }));

    expect(onPress).toHaveBeenCalled();
  });

  it("shows the time beside the status, with the mark hint spoken only", async () => {
    await renderRow({ time: "05:12" });

    expect(screen.getByText("· 05:12")).toBeTruthy();
    expect(screen.queryByText("Tap to mark")).toBeNull();
    expect(screen.getByRole("button", { name: "Fajr, Pending" }).props.accessibilityHint).toBe(
      "Tap to mark",
    );
  });

  it("has no separate mark toggle without onSelect (calendar days)", async () => {
    await renderRow();

    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  it("announces congregation on completed prayers", async () => {
    await renderRow({ status: "completed", isJama: true, hasNotes: true });

    expect(
      screen.getByRole("button", { name: "Fajr, Completed, prayed in congregation" }),
    ).toBeTruthy();
  });

  it("ignores the congregation flag until the prayer is completed", async () => {
    await renderRow({ status: "delayed", isJama: true });

    expect(screen.getByRole("button", { name: "Fajr, Delayed" })).toBeTruthy();
  });

  it("announces a Salah prayed at the masjid once completed", async () => {
    await renderRow({ status: "completed", atMasjid: true });

    expect(
      screen.getByRole("button", { name: "Fajr, Completed. Prayed at the masjid" }),
    ).toBeTruthy();
  });

  it("ignores the masjid flag until the prayer is completed", async () => {
    await renderRow({ status: "pending", atMasjid: true });

    expect(screen.getByRole("button", { name: "Fajr, Pending" })).toBeTruthy();
  });

  it("links to after-Salah adhkar with progress", async () => {
    const onPressAfterSalah = jest.fn();
    await renderRow({ afterSalahProgress: adhkar(2, 5), onPressAfterSalah });

    await fireEvent.press(
      screen.getByRole("button", { name: "Fajr after-Salah adhkar: 2 of 5 completed today" }),
    );

    expect(onPressAfterSalah).toHaveBeenCalled();
    expect(screen.getByText("Adhkar 2/5")).toBeTruthy();
  });

  it("shows read-only adhkar progress without a handler", async () => {
    await renderRow({ afterSalahProgress: adhkar(5, 5) });

    expect(screen.getByLabelText("Fajr after-Salah adhkar: 5 of 5 completed today")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /after-salah/ })).toBeNull();
  });

  it("caps long adhkar lists at twelve segments", async () => {
    await renderRow({ afterSalahProgress: adhkar(10, 40), onPressAfterSalah: jest.fn() });

    expect(screen.getByText("Adhkar 10/40")).toBeTruthy();
  });

  it("hides adhkar progress when there is none to track", async () => {
    await renderRow({ afterSalahProgress: adhkar(0, 0) });

    expect(screen.queryByText(/Adhkar/)).toBeNull();
  });
});

describe("PrayerTrackerRow one-tap mark (P5-02)", () => {
  beforeEach(() => jest.mocked(triggerHaptic).mockClear());

  it("marks the Salah completed without opening the sheet", async () => {
    const onSelect = jest.fn();
    const onPress = await renderRow({ onSelect });

    const mark = screen.getByRole("checkbox", { name: "Fajr prayed" });
    expect(mark.props.accessibilityState).toMatchObject({ checked: false });
    await fireEvent.press(mark);

    expect(onSelect).toHaveBeenCalledWith("completed");
    expect(onPress).not.toHaveBeenCalled();
    expect(triggerHaptic).toHaveBeenCalledWith("success");
  });

  it("pressing the mark again restores the previous status", async () => {
    const onSelect = jest.fn();
    const onPress = jest.fn();
    const { rerender } = await renderWithTheme(
      <PrayerTrackerRow prayerId="asr" status="delayed" onPress={onPress} onSelect={onSelect} />,
    );
    await fireEvent.press(screen.getByRole("checkbox", { name: "Asr prayed" }));
    expect(onSelect).toHaveBeenLastCalledWith("completed");

    await rerender(
      <PrayerTrackerRow prayerId="asr" status="completed" onPress={onPress} onSelect={onSelect} />,
    );
    const mark = screen.getByRole("checkbox", { name: "Asr prayed" });
    expect(mark.props.accessibilityState).toMatchObject({ checked: true });
    await fireEvent.press(mark);

    expect(onSelect).toHaveBeenLastCalledWith("delayed");
  });

  it("clears an already-completed Salah back to pending", async () => {
    const onSelect = jest.fn();
    await renderRow({ status: "completed", onSelect });

    await fireEvent.press(screen.getByRole("checkbox", { name: "Fajr prayed" }));

    expect(onSelect).toHaveBeenCalledWith("pending");
  });

  it("row press still opens the sheet; the mark is a 44pt target", async () => {
    const onPress = await renderRow({ onSelect: jest.fn() });

    await fireEvent.press(screen.getByRole("button", { name: "Fajr, Pending" }));

    expect(onPress).toHaveBeenCalled();
    const markStyle = [screen.getByTestId("prayer-mark-fajr").props.style].flat(3);
    const width = Math.max(...markStyle.map((s: { width?: number } | null) => s?.width ?? 0));
    expect(width).toBeGreaterThanOrEqual(Control.md);
    expect(Control.md).toBeGreaterThanOrEqual(44);
  });
});

describe("PrayerTrackerRow on TV", () => {
  usePlatform({ isTV: true });

  it.each([
    [true, true],
    [false, undefined],
  ])("preferredFocus=%s → hasTVPreferredFocus=%s", async (preferredFocus, expected) => {
    await renderRow({
      preferredFocus,
      afterSalahProgress: adhkar(1, 3),
      onPressAfterSalah: jest.fn(),
    });

    expect(screen.getByRole("button", { name: "Fajr, Pending" }).props.hasTVPreferredFocus).toBe(
      expected,
    );
    expect(screen.getByRole("button", { name: "Fajr, Pending" }).props.accessibilityHint).toBe(
      "Select to mark",
    );
  });
});
