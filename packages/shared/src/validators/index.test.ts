import { describe, expect, it } from "vitest";
import { RAWATIB_IDS } from "../constants/index";
import {
  isAfterSalahPrayer,
  isObligatoryPrayer,
  isPrayerId,
  isPrayerStatus,
  isQazaPrayer,
  isRawatibPrayer,
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

  it("accepts every rawatib id as a prayer id but never as fard, qaza or after-salah (NF-3.1)", () => {
    for (const id of RAWATIB_IDS) {
      expect(isPrayerId(id)).toBe(true);
      expect(isRawatibPrayer(id)).toBe(true);
      expect(isObligatoryPrayer(id)).toBe(false);
      expect(isQazaPrayer(id)).toBe(false);
      expect(isAfterSalahPrayer(id)).toBe(false);
      expect(isSunnahPrayer(id)).toBe(false);
    }
    expect(isRawatibPrayer("fajr")).toBe(false);
    expect(isRawatibPrayer("witr")).toBe(false);
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

describe("isAfterSalahPrayer", () => {
  it.each([
    ["fajr", true],
    ["witr", true],
    ["tahajjud", false],
  ])("%s -> %s", (prayer, expected) => {
    expect(isAfterSalahPrayer(prayer)).toBe(expected);
  });
});
