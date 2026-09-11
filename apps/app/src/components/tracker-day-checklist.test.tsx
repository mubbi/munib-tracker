import { render, screen } from "@testing-library/react-native";

import { TrackerDayChecklist } from "@/components/tracker-day-checklist";
import { MunibThemeProvider } from "@/providers/theme-provider";

jest.mock("@/components/qaza-daily-checklist", () => ({
  QazaDailyChecklist: () => null,
}));
jest.mock("@/components/khatm-daily-checklist", () => ({
  KhatmDailyChecklist: () => null,
}));
jest.mock("@/components/friday-tracker-section", () => ({
  FridayTrackerSection: () => null,
}));
jest.mock("@/components/white-days-tracker-section", () => ({
  WhiteDaysTrackerSection: () => null,
}));
jest.mock("@/components/excused-day-picker", () => ({
  ExcusedDayPicker: () => null,
}));
jest.mock("@/components/prayer-tracker-row", () => ({
  PrayerTrackerRow: () => null,
}));

describe("TrackerDayChecklist", () => {
  it("shows remaining salah-adhkar progress on category rows", () => {
    render(
      <MunibThemeProvider>
        <TrackerDayChecklist
          date="2026-07-06"
          isToday
          status={{}}
          notes={{}}
          jama={{}}
          zikrCounts={{}}
          prayerTimes={{
            fajr: "05:00",
            dhuhr: "12:30",
            asr: "16:00",
            maghrib: "19:10",
            isha: "20:30",
            witr: "20:45",
            tahajjud: "03:00",
            ishraq: "06:40",
            duha: "09:00",
            tahiyyatul_masjid: "12:00",
            hajat_istikhara: "21:00",
          }}
          onPrayerPress={jest.fn()}
        />
      </MunibThemeProvider>,
    );

    expect(screen.getByText("Salah adhkar")).toBeTruthy();
    expect(screen.getByLabelText(/After Adhan/)).toBeTruthy();
    expect(screen.getByLabelText(/Before Salah/)).toBeTruthy();
    expect(screen.getByLabelText(/After Salah/)).toBeTruthy();
  });
});
