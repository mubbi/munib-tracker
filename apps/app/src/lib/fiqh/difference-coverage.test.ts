import { isGuideAnchor, resolveGuideAnchor } from "@munib-tracker/shared/content/fiqh-guide-links";
import { FIQH_DIFFERENCES } from "@munib-tracker/shared/fiqh";

import { SCREEN_DIFFERENCES } from "@/lib/fiqh/screen-differences";

/**
 * NF-3.0a §4.1.2 coverage test (app side). Every `FiqhDifference.usedIn`
 * anchor must be one of:
 *  1. a guide topic/section whose topics list the id in `differenceIds`
 *     (rendered by `GuideMadhhabNotes` in all three topic renderers — see
 *     `guide-madhhab-notes.test.tsx`);
 *  2. a screen registered in `SCREEN_DIFFERENCES` (the screen renders exactly
 *     that list);
 *  3. an explicitly PENDING anchor below, with its owner and reason.
 * When a pending screen ships its notes, move it to `SCREEN_DIFFERENCES`;
 * the "stale pending" check fails if an anchor is both.
 */
const PENDING: ReadonlyArray<{ prefix: string; owner: string; reason: string }> = [
  {
    prefix: "/location",
    owner: "settings (NF-3.0b)",
    reason:
      "/location now redirects to Prayer times; AsrMismatchHint shows no asr.start / isha.start notes yet",
  },
  {
    prefix: "/(tabs)/index#hero",
    owner: "preferred-time hints (§4.1.4)",
    reason: "preferred-window sub-band in the home hero not built (the Salah info sheet has notes)",
  },
  {
    prefix: "/settings/reminder-offsets",
    owner: "preferred-time reminder (D40)",
    reason: '"remind at preferred time" offset suggestion not built yet',
  },
  {
    prefix: "/(tabs)/tracker#witr",
    owner: "rawatib / Witr (NF-3.1)",
    reason: "tracker Witr row shows the school label only; its info sheet has no notes yet",
  },
  {
    prefix: "/(tabs)/tracker#rawatib",
    owner: "rawatib (NF-3.1)",
    reason: "rawatib chips have no notes yet (late Fajr sunnah chip pending)",
  },
  { prefix: "/statistics#rawatib", owner: "rawatib (NF-3.1)", reason: "stats card has no notes" },
  {
    prefix: "/calendar#excused",
    owner: "calendar excused picker",
    reason: "the controlled calendar picker omits BloodPeriodStatus (no hayd counters/notes)",
  },
];

function pendingFor(anchor: string) {
  return PENDING.find(
    ({ prefix }) =>
      anchor === prefix || anchor.startsWith(`${prefix}#`) || anchor.startsWith(`${prefix}/`),
  );
}

const pairs = FIQH_DIFFERENCES.flatMap((diff) =>
  diff.usedIn.map((anchor) => ({ id: diff.id, anchor })),
);

describe("FiqhDifference.usedIn coverage (§4.1.2)", () => {
  it.each(pairs.map((p) => [`${p.id} → ${p.anchor}`, p] as const))(
    "%s",
    (_label, { id, anchor }) => {
      if (isGuideAnchor(anchor) && resolveGuideAnchor(anchor)) {
        const topics = resolveGuideAnchor(anchor)?.topics ?? [];
        expect(topics.some((topic) => topic.differenceIds?.includes(id))).toBe(true);
        return;
      }
      const screen = (SCREEN_DIFFERENCES as Record<string, readonly string[]>)[anchor];
      if (screen) {
        expect(screen).toContain(id);
        return;
      }
      expect({ anchor, pending: pendingFor(anchor) != null }).toEqual({ anchor, pending: true });
    },
  );

  it("never lists a registered screen as pending", () => {
    for (const anchor of Object.keys(SCREEN_DIFFERENCES))
      expect(pendingFor(anchor)).toBeUndefined();
  });

  it("registers only differences whose usedIn names the screen", () => {
    for (const [anchor, ids] of Object.entries(SCREEN_DIFFERENCES)) {
      for (const id of ids) {
        expect(FIQH_DIFFERENCES.find((d) => d.id === id)?.usedIn).toContain(anchor);
      }
    }
  });

  it("keeps every pending entry in use", () => {
    for (const { prefix } of PENDING) {
      expect({
        prefix,
        used: pairs.some(({ anchor }) => pendingFor(anchor)?.prefix === prefix),
      }).toEqual({
        prefix,
        used: true,
      });
    }
  });
});
