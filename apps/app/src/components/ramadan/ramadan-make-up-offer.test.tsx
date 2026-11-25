import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import { RamadanMakeUpOffer } from "@/components/ramadan/ramadan-make-up-offer";
import { PrayerRepository, QazaRepository } from "@/db";
import { rozaOfferSeenId } from "@/lib/fasting-fiqh";
import { toursStore } from "@/stores/tours-store";
import { buildPrayerLog } from "@/test-support/fixtures/prayer";
import { renderWithTheme } from "@/test-support/render";

const mockSetRoza = jest.fn(async (_roza: unknown) => undefined);

jest.mock("@/db", () => ({
  PrayerRepository: { getAll: jest.fn(async () => []) },
  QazaRepository: { getRoza: jest.fn(async () => ({ remaining: 2, completed: 1 })) },
}));

jest.mock("@/stores/tracker-store", () => ({
  useTrackerActions: () => ({ setRoza: mockSetRoza }),
}));

const DATES = ["2026-02-18", "2026-02-19", "2026-02-20", "2026-02-21"];
const TODAY = "2026-02-21";

async function renderOffer(fastStatus: Record<string, string>, seen: string[] = []) {
  await act(async () => {
    toursStore.setState({ seen, isReady: true });
  });
  await renderWithTheme(
    <RamadanMakeUpOffer
      hijriYear={1447}
      ramadanDates={DATES}
      fastStatus={fastStatus}
      today={TODAY}
    />,
  );
}

beforeEach(() => {
  mockSetRoza.mockClear();
  jest.mocked(PrayerRepository.getAll).mockResolvedValue([]);
});

describe("RamadanMakeUpOffer", () => {
  it("renders nothing when no day needs making up", async () => {
    await renderOffer({ "2026-02-18": "fasted" });
    expect(screen.queryByText("Days to make up")).toBeNull();
  });

  it("offers missed / exempt days plus hayd days, and adds them only on tap", async () => {
    jest
      .mocked(PrayerRepository.getAll)
      .mockResolvedValue([
        buildPrayerLog({ date: "2026-02-20", isExcused: true, excusedReason: "hayd" }),
      ]);
    await renderOffer({ "2026-02-18": "exempt", "2026-02-19": "missed" });
    await waitFor(() =>
      expect(screen.getByText(/Days to make up from this Ramadan: 3/)).toBeTruthy(),
    );
    expect(mockSetRoza).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByRole("button", { name: "Add 3 to fasting Qaza" }));
    await waitFor(() =>
      expect(mockSetRoza).toHaveBeenCalledWith({
        remaining: 5,
        completed: 1,
        updatedAt: undefined,
      }),
    );
    expect(QazaRepository.getRoza).toHaveBeenCalled();
    expect(toursStore.getState().seen).toContain(rozaOfferSeenId(1447, 3));
    expect(screen.getByText("Added to your fasting Qaza.")).toBeTruthy();
  });

  it("dismissing records the answer without touching Qaza", async () => {
    await renderOffer({ "2026-02-18": "exempt" });
    await fireEvent.press(screen.getByRole("button", { name: "No thanks" }));
    await waitFor(() => expect(toursStore.getState().seen).toContain(rozaOfferSeenId(1447, 1)));
    expect(mockSetRoza).not.toHaveBeenCalled();
    expect(screen.queryByText("Days to make up")).toBeNull();
  });

  it("offers only days logged after the last answer", async () => {
    await renderOffer({ "2026-02-18": "exempt", "2026-02-19": "exempt" }, [
      rozaOfferSeenId(1447, 1),
    ]);
    expect(screen.getByText(/Days to make up from this Ramadan: 1/)).toBeTruthy();
  });
});
