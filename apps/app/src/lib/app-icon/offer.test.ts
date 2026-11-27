import { hijriToGregorian } from "@/lib/hijri";
import { devicePreferencesStore } from "@/stores/device-preferences-store";
import { resetSettingsStores } from "@/test-support/settings";

import { appIconOfferKey, dismissAppIconOffer, pendingAppIconOffer } from "./offer";

function noonOnHijri(year: number, month: number, day: number): Date {
  const d = hijriToGregorian(year, month, day);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
}

const RAMADAN = noonOnHijri(1448, 9, 5);
const ASHURA = noonOnHijri(1449, 1, 10);
const RAJAB = noonOnHijri(1448, 7, 10);

describe("seasonal app icon offer (D75)", () => {
  const base = { stored: undefined, seen: undefined, date: RAMADAN, os: "android" };

  it("offers the season's icon once on Android while the user never chose", () => {
    expect(pendingAppIconOffer(base)).toEqual({ id: "ramadan", key: "ramadan:1448" });
    expect(pendingAppIconOffer({ ...base, date: ASHURA })).toEqual({
      id: "ashura",
      key: "ashura:1449",
    });
  });

  it("never offers on iOS, where seasonal icons are already the default", () => {
    expect(pendingAppIconOffer({ ...base, os: "ios" })).toBeNull();
  });

  it("stays quiet out of season, after any Settings choice, or once answered", () => {
    expect(pendingAppIconOffer({ ...base, date: RAJAB })).toBeNull();
    expect(pendingAppIconOffer({ ...base, stored: "classic" })).toBeNull();
    expect(pendingAppIconOffer({ ...base, stored: "seasonal" })).toBeNull();
    expect(pendingAppIconOffer({ ...base, seen: ["ramadan:1448"] })).toBeNull();
    // Answering last year's Ramadan doesn't hide this year's.
    expect(pendingAppIconOffer({ ...base, seen: ["ramadan:1447"] })?.key).toBe("ramadan:1448");
  });

  it("remembers a dismissal on this device without duplicates", async () => {
    await resetSettingsStores();
    await dismissAppIconOffer(appIconOfferKey("ramadan", 1448));
    await dismissAppIconOffer(appIconOfferKey("ramadan", 1448));
    expect(devicePreferencesStore.getState().prefs.appIconOffersSeen).toEqual(["ramadan:1448"]);
  });
});
