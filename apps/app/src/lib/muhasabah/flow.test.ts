import {
  adjacentMuhasabahStep,
  hasUnloggedFard,
  MUHASABAH_STEPS,
  shouldOfferMuhasabahReminder,
} from "./flow";
import type { MuhasabahSalahRecap } from "./logic";

describe("muhasabah flow helpers", () => {
  it("walks the five screens in order and clamps at both ends", () => {
    expect(MUHASABAH_STEPS).toEqual(["salah", "prompts", "gratitude", "repent", "intention"]);
    expect(adjacentMuhasabahStep("salah", 1)).toBe("prompts");
    expect(adjacentMuhasabahStep("repent", -1)).toBe("gratitude");
    expect(adjacentMuhasabahStep("salah", -1)).toBe("salah");
    expect(adjacentMuhasabahStep("intention", 1)).toBe("intention");
  });

  it("offers the reminder once, after the first review, while it is off", () => {
    const done = { firstCompletedAt: "2026-11-23T21:00:00.000Z" };
    expect(shouldOfferMuhasabahReminder(done, false)).toBe(true);
    expect(shouldOfferMuhasabahReminder({}, false)).toBe(false);
    expect(shouldOfferMuhasabahReminder({ ...done, reminderOfferAnswered: true }, false)).toBe(
      false,
    );
    expect(shouldOfferMuhasabahReminder(done, true)).toBe(false);
  });

  it("flags fard that is neither on time nor late", () => {
    const recap: MuhasabahSalahRecap = {
      fardOnTime: 3,
      fardLate: 1,
      fardTotal: 5,
      voluntary: 0,
      excusedReason: null,
    };
    expect(hasUnloggedFard(recap)).toBe(true);
    expect(hasUnloggedFard({ ...recap, fardLate: 2 })).toBe(false);
  });
});
