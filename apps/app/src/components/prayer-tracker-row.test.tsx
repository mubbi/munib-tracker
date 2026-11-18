import { fireEvent, screen } from "@testing-library/react-native";

import { PrayerTrackerRow } from "@/components/prayer-tracker-row";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/prayer-info-button", () => ({
  PrayerInfoButton: require("@/test-support/mocks/stub-component").stubComponent("info"),
}));

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
    expect(screen.getByText(label.split(", ")[1]!)).toBeTruthy();
  });

  it("opens the status sheet from the row", async () => {
    const onPress = await renderRow();

    await fireEvent.press(screen.getByRole("button", { name: "Fajr, Pending" }));

    expect(onPress).toHaveBeenCalled();
  });

  it("shows the prayer time and tap hint", async () => {
    await renderRow({ time: "05:12" });

    expect(screen.getByText("05:12")).toBeTruthy();
    expect(screen.getByText("Tap to mark")).toBeTruthy();
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

  it("links to after-salah adhkar with progress", async () => {
    const onPressAfterSalah = jest.fn();
    await renderRow({ afterSalahProgress: adhkar(2, 5), onPressAfterSalah });

    await fireEvent.press(
      screen.getByRole("button", { name: "Fajr after-salah adhkar: 2 of 5 completed today" }),
    );

    expect(onPressAfterSalah).toHaveBeenCalled();
    expect(screen.getByText("Adhkar 2/5")).toBeTruthy();
  });

  it("shows read-only adhkar progress without a handler", async () => {
    await renderRow({ afterSalahProgress: adhkar(5, 5) });

    expect(screen.getByLabelText("Fajr after-salah adhkar: 5 of 5 completed today")).toBeTruthy();
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
    expect(screen.getByText("Select to mark")).toBeTruthy();
  });
});
