import { describe, expect, it } from "vitest";
import {
  isObligatoryPrayer,
  isPrayerId,
  isPrayerStatus,
  isQazaPrayer,
  isSunnahPrayer,
  isWitrPrayer,
  isZikrCategoryId,
} from "./index";

describe.concurrent("validators", () => {
  it("recognises fard prayers", () => {
    expect(isObligatoryPrayer("fajr")).toBe(true);
    expect(isObligatoryPrayer("witr")).toBe(false);
    expect(isObligatoryPrayer("duha")).toBe(false);
  });

  it("recognises witr and qaza-tracked prayers", () => {
    expect(isWitrPrayer("witr")).toBe(true);
    expect(isWitrPrayer("fajr")).toBe(false);
    expect(isQazaPrayer("witr")).toBe(true);
    expect(isQazaPrayer("fajr")).toBe(true);
    expect(isQazaPrayer("duha")).toBe(false);
  });

  it("recognises sunnah prayers", () => {
    expect(isSunnahPrayer("duha")).toBe(true);
    expect(isSunnahPrayer("fajr")).toBe(false);
  });

  it("recognises any prayer id", () => {
    expect(isPrayerId("isha")).toBe(true);
    expect(isPrayerId("witr")).toBe(true);
    expect(isPrayerId("tahajjud")).toBe(true);
    expect(isPrayerId("nope")).toBe(false);
  });

  it("recognises prayer statuses", () => {
    for (const status of ["pending", "completed", "missed", "delayed", "qaza"]) {
      expect(isPrayerStatus(status)).toBe(true);
    }
    expect(isPrayerStatus("archived")).toBe(false);
  });

  it("recognises zikr category ids", () => {
    expect(isZikrCategoryId("morning")).toBe(true);
    expect(isZikrCategoryId("random")).toBe(false);
  });
});
