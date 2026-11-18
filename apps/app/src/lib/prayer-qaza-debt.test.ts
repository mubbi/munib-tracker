import type { PrayerLog } from "@munib-tracker/shared/types";
import { QazaRepository } from "@/db";
import { reconcileQazaDebtForStatusChange } from "@/lib/prayer-qaza-debt";

jest.mock("@/db", () => ({
  QazaRepository: { incrementRemaining: jest.fn(async () => undefined) },
}));

const increment = QazaRepository.incrementRemaining as jest.Mock;
const log = (over: Partial<PrayerLog>) => ({ status: "prayed", ...over }) as PrayerLog;

beforeEach(() => increment.mockClear());

describe("reconcileQazaDebtForStatusChange", () => {
  it("passes through the existing flag for non-qaza prayers", async () => {
    await expect(
      reconcileQazaDebtForStatusChange("tahajjud" as never, "pending", "missed", undefined),
    ).resolves.toBeUndefined();
    await expect(
      reconcileQazaDebtForStatusChange(
        "tahajjud" as never,
        "pending",
        "missed",
        log({ qazaDebtAdded: true }),
      ),
    ).resolves.toBe(true);
    expect(increment).not.toHaveBeenCalled();
  });

  it("adds debt when entering a debt status with addToQaza", async () => {
    await expect(
      reconcileQazaDebtForStatusChange("fajr", "pending", "missed", undefined, { addToQaza: true }),
    ).resolves.toBe(true);
    expect(increment).toHaveBeenCalledWith("fajr", 1);
  });

  it("records no debt when entering a debt status without addToQaza", async () => {
    await expect(
      reconcileQazaDebtForStatusChange("dhuhr", "prayed", "qaza", undefined),
    ).resolves.toBe(false);
    expect(increment).not.toHaveBeenCalled();
  });

  it("prefers the persisted log status over the UI previous status", async () => {
    // UI says pending, but the stored log is already missed → no new debt.
    await expect(
      reconcileQazaDebtForStatusChange(
        "asr",
        "pending",
        "qaza",
        log({ status: "missed", qazaDebtAdded: true }),
        { addToQaza: true },
      ),
    ).resolves.toBe(true);
    expect(increment).not.toHaveBeenCalled();
  });

  it("unwinds debt that was added when leaving a debt status", async () => {
    await expect(
      reconcileQazaDebtForStatusChange(
        "maghrib",
        "missed",
        "prayed",
        log({ status: "missed", qazaDebtAdded: true }),
      ),
    ).resolves.toBeUndefined();
    expect(increment).toHaveBeenCalledWith("maghrib", -1);
  });

  it("unwinds legacy logs without the flag", async () => {
    await reconcileQazaDebtForStatusChange("isha", "missed", "prayed", log({ status: "missed" }));
    expect(increment).toHaveBeenCalledWith("isha", -1);
  });

  it("does not unwind when debt was explicitly not added or no log exists", async () => {
    await reconcileQazaDebtForStatusChange(
      "isha",
      "missed",
      "prayed",
      log({ status: "missed", qazaDebtAdded: false }),
    );
    await reconcileQazaDebtForStatusChange("isha", "missed", "prayed", undefined);
    expect(increment).not.toHaveBeenCalled();
  });

  it("keeps the flag when staying inside or outside debt statuses", async () => {
    await expect(
      reconcileQazaDebtForStatusChange(
        "fajr",
        "missed",
        "qaza",
        log({ status: "missed", qazaDebtAdded: true }),
      ),
    ).resolves.toBe(true);
    await expect(
      reconcileQazaDebtForStatusChange("fajr", "pending", "prayed", undefined),
    ).resolves.toBeUndefined();
    expect(increment).not.toHaveBeenCalled();
  });
});
