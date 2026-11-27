import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import { RamadanMakeUpOffer } from "@/components/ramadan/ramadan-make-up-offer";
import { PrayerRepository, QazaRepository } from "@/db";
import { rozaOfferSeenId } from "@/lib/fasting-fiqh";
import { toursStore } from "@/stores/tours-store";
import { buildPrayerLog } from "@/test-support/fixtures/prayer";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

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
  resetExpoRouterMock();
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
    await fireEvent.press(screen.getByRole("button", { name: "Already handled" }));
    await waitFor(() => expect(toursStore.getState().seen).toContain(rozaOfferSeenId(1447, 1)));
    expect(mockSetRoza).not.toHaveBeenCalled();
    expect(screen.queryByText("Days to make up")).toBeNull();
  });

  it("asks how to settle the days, quoting the sourced guide for each choice", async () => {
    await renderOffer({ "2026-02-18": "exempt", "2026-02-19": "missed" });
    expect(screen.getByText("How will you settle these days?")).toBeTruthy();
    expect(screen.getByText("Make them up (Qaza)")).toBeTruthy();
    expect(
      screen.getByText(
        "If you can still make the days up by fasting later, plan qaza — not fidyah.",
      ),
    ).toBeTruthy();
    expect(screen.getByText("Pay fidyah instead")).toBeTruthy();
    expect(
      screen.getByText(
        "If fasting is permanently impossible, ask a scholar about fidyah for each missed day.",
      ),
    ).toBeTruthy();
    expect(screen.getByText("Kaffarah for a fast broken deliberately")).toBeTruthy();
  });

  it("opens the fidyah helper prefilled with the days, without dismissing the offer", async () => {
    await renderOffer({ "2026-02-18": "exempt", "2026-02-19": "exempt" });
    await fireEvent.press(screen.getByRole("button", { name: "Open the fidyah helper" }));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/fidyah",
      params: { scenario: "fidyah", days: "2" },
    });
    expect(toursStore.getState().seen).toEqual([]);
    expect(mockSetRoza).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByRole("button", { name: "Who typically pays fidyah?" }));
    expect(mockRouter.push).toHaveBeenLastCalledWith({
      pathname: "/fidyah/[topic]",
      params: { topic: "who-pays-fidyah" },
    });
  });

  it("offers kaffarah only when a day was logged missed", async () => {
    await renderOffer({ "2026-02-18": "exempt" });
    expect(screen.getByText("Pay fidyah instead")).toBeTruthy();
    expect(screen.queryByText("Kaffarah for a fast broken deliberately")).toBeNull();
  });

  it("opens the kaffarah helper and its guide topic for a missed day", async () => {
    await renderOffer({ "2026-02-19": "missed" });
    await fireEvent.press(screen.getByRole("button", { name: "Open the kaffarah helper" }));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/fidyah",
      params: { scenario: "kaffarah" },
    });
    await fireEvent.press(
      screen.getByRole("button", { name: "Kaffarah for deliberately breaking the fast" }),
    );
    expect(mockRouter.push).toHaveBeenLastCalledWith({
      pathname: "/fidyah/[topic]",
      params: { topic: "kaffarah-ramadan" },
    });
  });

  it("offers Qaza only for hayd / nifas days", async () => {
    jest
      .mocked(PrayerRepository.getAll)
      .mockResolvedValue([
        buildPrayerLog({ date: "2026-02-20", isExcused: true, excusedReason: "hayd" }),
      ]);
    await renderOffer({});
    await waitFor(() =>
      expect(screen.getByText(/Days to make up from this Ramadan: 1/)).toBeTruthy(),
    );
    expect(screen.getByText("Make them up (Qaza)")).toBeTruthy();
    expect(screen.queryByText("Pay fidyah instead")).toBeNull();
    expect(screen.queryByText("Kaffarah for a fast broken deliberately")).toBeNull();
  });

  it("links voluntary sadaqah as an extra good deed", async () => {
    await renderOffer({ "2026-02-18": "exempt" });
    await fireEvent.press(
      screen.getByRole("button", { name: "Give voluntary sadaqah as an extra good deed" }),
    );
    expect(mockRouter.push).toHaveBeenCalledWith("/sadaqah");
  });

  it("offers only days logged after the last answer", async () => {
    await renderOffer({ "2026-02-18": "exempt", "2026-02-19": "exempt" }, [
      rozaOfferSeenId(1447, 1),
    ]);
    expect(screen.getByText(/Days to make up from this Ramadan: 1/)).toBeTruthy();
  });
});
