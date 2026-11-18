import { screen } from "@testing-library/react-native";

import {
  ShareScheduleContent,
  type ShareScheduleEntry,
} from "@/components/share/share-schedule-content";
import { renderWithTheme } from "@/test-support/render";

const items: ShareScheduleEntry[] = [
  { id: "fajr", name: "Fajr", time: "05:10", kind: "obligatory", status: "past" },
  { id: "sunrise", name: "Sunrise", time: "06:30", kind: "marker", status: "past" },
  { id: "duha", name: "Duha", time: "09:00", kind: "optional", status: "active" },
  { id: "dhuhr", name: "Dhuhr", time: "12:30", kind: "obligatory", status: "upcoming" },
];

type Props = Parameters<typeof ShareScheduleContent>[0];

async function renderSchedule(overrides: Partial<Props> = {}) {
  await renderWithTheme(
    <ShareScheduleContent
      dateLabel="Tue 18 Nov"
      locationLabel="London"
      items={items}
      nextScheduleId="dhuhr"
      nextIn="in 3h"
      {...overrides}
    />,
  );
}

describe("ShareScheduleContent", () => {
  it("shows the date, location and legend", async () => {
    await renderSchedule();
    expect(screen.getByText("Tue 18 Nov")).toBeTruthy();
    expect(screen.getByText("London")).toBeTruthy();
    expect(screen.getByText("Obligatory")).toBeTruthy();
  });

  it("groups entries and lists their times", async () => {
    await renderSchedule();
    expect(screen.getByText("05:10")).toBeTruthy();
    expect(screen.getByText("12:30")).toBeTruthy();
  });

  it("marks the current and next entries", async () => {
    await renderSchedule();
    expect(screen.getByText("Current")).toBeTruthy();
    expect(screen.getByText("Next")).toBeTruthy();
    expect(screen.getByText("in 3h")).toBeTruthy();
  });

  it("omits the location, next marker and countdown when absent", async () => {
    await renderSchedule({ locationLabel: undefined, nextScheduleId: null, nextIn: undefined });
    expect(screen.queryByText("London")).toBeNull();
    expect(screen.queryByText("Next")).toBeNull();
  });

  it("shows the next marker without a countdown", async () => {
    await renderSchedule({ nextIn: undefined });
    expect(screen.getByText("Next")).toBeTruthy();
    expect(screen.queryByText("in 3h")).toBeNull();
  });
});
