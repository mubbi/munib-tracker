import { COACH_EVIDENCE, COACH_RULES, SHOWED_UP_RULE } from "@munib-tracker/shared/utils";

import en from "@/i18n/en.json";

import { coachEvidenceRef } from "./coach-ui";

/**
 * NF-3.14 tone rules, enforced on the English copy: never compare to other
 * people, never show a failure percentage (counts like "4 of 7" only), never
 * "you failed" / "streak lost" framing.
 */
const BANNED = [
  /%/,
  /\bfail/i,
  /\blost\b/i,
  /\blose\b/i,
  /\bbroke/i,
  /\bmissed out\b/i,
  /\bshould have\b/i,
  /\bbad\b/i,
  /\blazy\b/i,
  /\bothers\b/i,
  /\bother people\b/i,
  /\beveryone\b/i,
  /\baverage user/i,
  /\bmost people\b/i,
];

type Tree = { [key: string]: string | Tree };
const coach = (en as unknown as { coach: Tree }).coach;

function leaves(tree: Tree, prefix = "coach"): [string, string][] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === "string" ? [[`${prefix}.${key}`, value]] : leaves(value, `${prefix}.${key}`),
  );
}

function lookup(path: string): string | Tree | undefined {
  return path
    .split(".")
    .reduce<string | Tree | undefined>(
      (node, part) => (node && typeof node === "object" ? node[part] : undefined),
      en as unknown as Tree,
    );
}

describe("weekly coach copy", () => {
  it.each(leaves(coach))("%s keeps the gentle tone", (_key, value) => {
    for (const pattern of BANNED) expect(value).not.toMatch(pattern);
  });

  it("has a title and body (or body variants) for every rule", () => {
    for (const rule of [...COACH_RULES, SHOWED_UP_RULE]) {
      expect(typeof lookup(`${rule.copyKey}.title`)).toBe("string");
      expect(lookup(`${rule.copyKey}.body`)).toBeDefined();
      if (rule.action) expect(typeof lookup(rule.action.labelKey)).toBe("string");
    }
    for (const variant of ["hayd", "nifas", "sick", "travel", "generic"]) {
      expect(typeof lookup(`coach.rule.excused_week.body.${variant}`)).toBe("string");
    }
  });

  it("labels every evidence ref (rendered by reference, never typed)", () => {
    for (const id of Object.values(COACH_EVIDENCE)) {
      const ref = coachEvidenceRef(id);
      expect(ref && typeof lookup(ref.labelKey)).toBe("string");
    }
  });

  it("keeps notification text generic (no counts, no private details)", () => {
    expect(lookup("coach.notif.body")).toBe("Your weekly reflection is ready");
    expect(String(lookup("coach.notif.title"))).not.toMatch(/\{\{/);
  });
});
