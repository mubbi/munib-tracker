import {
  acceptAsrOffer,
  asrKeyForMadhhab,
  asrOfferFor,
  dismissMadhhabPrompt,
  hasAsrMismatch,
  setMadhhab,
} from "@/lib/fiqh/set-madhhab";
import { locationStore } from "@/stores/location-store";
import { preferencesStore } from "@/stores/preferences-store";
import { resetSettingsStores } from "@/test-support/settings";

jest.mock("@/notifications/scheduler", () => ({
  rescheduleAll: jest.fn(async () => {}),
  listScheduled: jest.fn(async () => []),
}));

const { rescheduleAll } = jest.requireMock("@/notifications/scheduler") as {
  rescheduleAll: jest.Mock;
};

const prefs = () => preferencesStore.getState().prefs;
const asr = () => locationStore.getState().location.madhab;

beforeEach(async () => {
  rescheduleAll.mockClear();
  await resetSettingsStores();
});

describe("Asr offer helpers", () => {
  it("maps Hanafi to the hanafi Asr and the other schools to shafi", () => {
    expect(asrKeyForMadhhab("hanafi")).toBe("hanafi");
    expect(asrKeyForMadhhab("shafii")).toBe("shafi");
    expect(asrKeyForMadhhab("maliki")).toBe("shafi");
    expect(asrKeyForMadhhab("hanbali")).toBe("shafi");
  });

  it.each([
    ["hanafi", "shafi", "hanafi"],
    ["hanafi", "hanafi", null],
    ["maliki", "hanafi", "shafi"],
    ["shafii", "shafi", null],
    [null, "hanafi", null],
  ] as const)("offers %s on %s → %s", (choice, current, offer) => {
    expect(asrOfferFor(choice, current)).toBe(offer);
  });

  it("flags a mismatch only for a chosen school", () => {
    expect(hasAsrMismatch("hanafi", "shafi")).toBe(true);
    expect(hasAsrMismatch("hanbali", "shafi")).toBe(false);
    expect(hasAsrMismatch(null, "hanafi")).toBe(false);
    expect(hasAsrMismatch(undefined, "hanafi")).toBe(false);
  });
});

describe("setMadhhab", () => {
  it("saves the school, reschedules, and offers (never applies) the matching Asr", async () => {
    expect(asr()).toBe("shafi");
    const result = await setMadhhab("hanafi");
    expect(result).toEqual({ changed: true, asrOffer: "hanafi" });
    expect(prefs().madhhab).toBe("hanafi");
    expect(asr()).toBe("shafi");
    expect(rescheduleAll).toHaveBeenCalledTimes(1);
  });

  it("saves all views without an Asr offer", async () => {
    expect(await setMadhhab(null)).toEqual({ changed: true, asrOffer: null });
    expect(prefs().madhhab).toBeNull();
  });

  it("is a no-op when re-picking the same school", async () => {
    await setMadhhab("maliki");
    rescheduleAll.mockClear();
    expect(await setMadhhab("maliki")).toEqual({ changed: false, asrOffer: null });
    expect(rescheduleAll).not.toHaveBeenCalled();
  });

  it("leaves logged data and other preferences untouched", async () => {
    const before = { ...prefs() };
    await setMadhhab("shafii");
    const { madhhab, updatedAt, ...rest } = prefs();
    const { madhhab: _m, updatedAt: _u, ...restBefore } = before;
    expect(madhhab).toBe("shafii");
    expect(rest).toEqual(restBefore);
  });
});

describe("acceptAsrOffer / dismissMadhhabPrompt", () => {
  it("switches the Asr calculation when accepted", async () => {
    await acceptAsrOffer("hanafi");
    expect(asr()).toBe("hanafi");
    expect(rescheduleAll).toHaveBeenCalled();
  });

  it("records all views when a never-asked user dismisses", async () => {
    expect(prefs().madhhab).toBeUndefined();
    await dismissMadhhabPrompt();
    expect(prefs().madhhab).toBeNull();
  });

  it("never overwrites an existing choice on dismiss", async () => {
    await setMadhhab("hanbali");
    await dismissMadhhabPrompt();
    expect(prefs().madhhab).toBe("hanbali");
  });
});
