import { fireEvent, screen } from "@testing-library/react-native";

import {
  PrayerScheduleCard,
  type PrayerScheduleCardProps,
  ScheduleContextHeader,
} from "@/components/prayer-schedule-card";
import type { ScheduleItem } from "@/hooks/use-home-hero";
import { buildScheduleItem } from "@/test-support/fixtures/prayer";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/prayer-info-button", () => ({ PrayerInfoButton: () => null }));
jest.mock("@/components/default-location-banner", () => ({
  DefaultLocationBanner: require("@/test-support/mocks/stub-component").stubComponent(
    "default-city-callout",
  ),
}));

const hour = (h: number) => h * 3_600_000;

/** Mid-afternoon: Dhuhr running, Asr next, earlier and later prayers collapsed. */
const DAY: ScheduleItem[] = [
  buildScheduleItem({
    id: "tahajjud",
    kind: "optional",
    status: "past",
    atMs: hour(3),
    time: "03:00",
  }),
  buildScheduleItem({ id: "fajr", status: "past", atMs: hour(5), time: "05:00" }),
  buildScheduleItem({
    id: "sunrise",
    kind: "marker",
    status: "past",
    atMs: hour(6),
    time: "06:15",
  }),
  buildScheduleItem({
    id: "ishraq",
    kind: "optional",
    status: "past",
    atMs: hour(7),
    time: "06:40",
  }),
  buildScheduleItem({ id: "dhuhr", status: "active", active: true, atMs: hour(12), time: "12:30" }),
  buildScheduleItem({ id: "asr", atMs: hour(16), time: "16:00" }),
  buildScheduleItem({ id: "maghrib", atMs: hour(19), time: "19:10" }),
  buildScheduleItem({ id: "isha", atMs: hour(20), time: "20:30" }),
  buildScheduleItem({ id: "witr", kind: "optional", atMs: hour(21), time: "20:45" }),
  buildScheduleItem({ id: "duha", kind: "optional", status: "flexible", atMs: null, time: "—" }),
  buildScheduleItem({
    id: "hajat_istikhara",
    kind: "optional",
    status: "flexible",
    atMs: null,
    time: "—",
  }),
];

const renderCard = (props: Partial<PrayerScheduleCardProps> = {}) =>
  renderWithTheme(
    <PrayerScheduleCard schedule={DAY} nextIn="in 3h" nextScheduleId="asr" {...props} />,
  );

const row = (name: string) => screen.queryByLabelText(new RegExp(`^${name} at `));

describe("PrayerScheduleCard", () => {
  it("highlights the current and next prayers", async () => {
    await renderCard();

    expect(screen.getByLabelText("Dhuhr at 12:30, current prayer")).toBeTruthy();
    expect(screen.getByLabelText("Asr at 16:00, next prayer in 3h")).toBeTruthy();
    expect(screen.getByText("in 3h")).toBeTruthy();
  });

  it("focuses the timeline around now, collapsing the rest", async () => {
    await renderCard();

    expect(row("Ishraq")).toBeTruthy();
    expect(row("Fajr")).toBeNull();
    expect(row("Witr")).toBeNull();
    expect(screen.getByLabelText("Show 3 earlier prayers hidden in today's schedule")).toBeTruthy();
    expect(screen.getByLabelText("Show 1 later prayers hidden in today's schedule")).toBeTruthy();
  });

  it("expands and re-collapses earlier prayers", async () => {
    await renderCard();

    await fireEvent.press(screen.getByLabelText(/^Show 3 earlier/));
    expect(row("Fajr")).toBeTruthy();

    await fireEvent.press(screen.getByLabelText("Hide earlier prayers in today's schedule"));
    expect(row("Fajr")).toBeNull();
  });

  it("expands later prayers", async () => {
    await renderCard();

    await fireEvent.press(screen.getByLabelText(/^Show 1 later/));

    expect(row("Witr")).toBeTruthy();
    expect(screen.getByLabelText("Hide later prayers in today's schedule")).toBeTruthy();
  });

  it("lists flexible prayers in their own block", async () => {
    await renderCard();

    expect(row("Duha")).toBeTruthy();
    expect(screen.getAllByText("Pray anytime during the day")).toHaveLength(2);
  });

  it("can mark a flexible prayer as next", async () => {
    await renderCard({ nextScheduleId: "duha", nextIn: "now" });

    expect(screen.getByLabelText("Duha at —, next prayer now")).toBeTruthy();
  });

  it("omits the flexible block when every prayer is timed", async () => {
    await renderCard({
      schedule: DAY.filter((item) => item.status !== "flexible"),
      layout: "split",
    });

    expect(screen.queryByText("Pray anytime during the day")).toBeNull();
  });

  it("handles a day with nothing next", async () => {
    await renderCard({ nextScheduleId: null });

    expect(screen.queryByText("Next")).toBeNull();
  });
});

describe("PrayerScheduleCard share action", () => {
  it.each([
    [{}, "Share today's complete schedule as an image"],
    [{ shareLoading: true }, "Sharing…"],
    [{ shareGesturePending: true }, "Tap to share"],
  ])("labels share for %o", async (state, label) => {
    await renderCard({ onShare: jest.fn(), ...state });

    expect(screen.getByLabelText(label)).toBeTruthy();
  });

  it("shares the schedule", async () => {
    const onShare = jest.fn();
    await renderCard({ onShare });

    await fireEvent.press(screen.getByLabelText("Share today's complete schedule as an image"));

    expect(onShare).toHaveBeenCalled();
  });
});

describe("PrayerScheduleCard on TV", () => {
  usePlatform({ isTV: true });

  it("never offers sharing and keeps collapse bars reachable", async () => {
    await renderCard({ onShare: jest.fn() });

    expect(screen.queryByLabelText("Share today's complete schedule as an image")).toBeNull();
    expect(screen.getByLabelText(/^Show 3 earlier/)).toBeTruthy();
  });
});

describe("ScheduleContextHeader (P5-06)", () => {
  const renderHeader = (isDefaultLocation: boolean) => {
    const onChangeLocation = jest.fn();
    return renderWithTheme(
      <ScheduleContextHeader
        dateLabel="Monday 6 July"
        secondaryDateLabel="21 Muharram 1448"
        locationLabel={isDefaultLocation ? "Makkah, Saudi Arabia" : "London"}
        isDefaultLocation={isDefaultLocation}
        onChangeLocation={onChangeLocation}
      />,
    ).then(() => onChangeLocation);
  };

  it("names the date and place the times are for, with a Change link", async () => {
    const onChangeLocation = await renderHeader(false);

    expect(screen.getByText("Monday 6 July")).toBeTruthy();
    expect(screen.getByText("21 Muharram 1448")).toBeTruthy();
    expect(screen.getByText("London")).toBeTruthy();
    expect(screen.queryByText("Default city")).toBeNull();
    expect(screen.queryByText("default-city-callout")).toBeNull();

    await fireEvent.press(screen.getByRole("button", { name: "Change" }));
    expect(onChangeLocation).toHaveBeenCalled();
  });

  it("warns with a pill and the set-location callout on the default city", async () => {
    await renderHeader(true);

    expect(screen.getByText("Default city")).toBeTruthy();
    expect(screen.getByText("default-city-callout")).toBeTruthy();
  });
});
