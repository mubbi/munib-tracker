import { makeContactLog as logOf, makeRelative as rel } from "@/test-support/fixtures/self-review";

import { mergeRelativesDocs } from "./merge";
import {
  applyContact,
  buildDueList,
  DEFAULT_CADENCE_DAYS,
  dueCountOn,
  familyTiesReminderInput,
  lastContactFromLogs,
  normalizeFamilyTiesSettings,
  normalizePhone,
  overdueDays,
  priorityScore,
  relativeDueDate,
  relativeToInput,
  smsUrl,
  summarizeFamilyTies,
  telUrl,
  whatsappUrls,
} from "./model";

const TODAY = "2026-11-23";

describe("family ties model", () => {
  it("uses the plan's default cadences", () => {
    expect(DEFAULT_CADENCE_DAYS).toMatchObject({
      mother: 2,
      father: 2,
      grandparent: 7,
      sibling: 7,
      aunt_paternal: 30,
      uncle_maternal: 30,
      cousin: 60,
      other: 90,
    });
  });

  it("is due on lastContact + cadence, or on the day added without a contact", () => {
    expect(relativeDueDate(rel({ createdAt: "2026-11-20T08:00:00.000Z" }))).toBe("2026-11-20");
    const r = rel({ cadenceDays: 7, lastContact: { date: "2026-11-10", kind: "call" } });
    expect(relativeDueDate(r)).toBe("2026-11-17");
    expect(overdueDays(r, TODAY)).toBe(6);
  });

  it("scores overdue / cadence × kinship weight and puts the mother first", () => {
    const mother = rel({
      kinship: "mother",
      cadenceDays: 2,
      lastContact: { date: "2026-11-19", kind: "call" },
    });
    const cousin = rel({
      kinship: "cousin",
      cadenceDays: 60,
      lastContact: { date: "2026-08-01", kind: "visit" },
    });
    expect(priorityScore(mother, TODAY)).toBeCloseTo((2 / 2) * 3);
    expect(priorityScore(cousin, TODAY)).toBeCloseTo((54 / 60) * 1);
    const list = buildDueList([cousin, mother], TODAY);
    expect(list.map((d) => d.relative.kinship)).toEqual(["mother", "cousin"]);
  });

  it("never lists paused or deceased relatives as due", () => {
    const list = buildDueList(
      [rel({ paused: true }), rel({ deceased: true }), rel({ name: "Due" })],
      TODAY,
    );
    expect(list.map((d) => d.relative.name)).toEqual(["Due"]);
  });

  it("a dua resets the due date only for cadences of 30 days or more", () => {
    const sibling = rel({ cadenceDays: 7, lastContact: { date: "2026-11-01", kind: "call" } });
    expect(applyContact(sibling, "dua", TODAY)).toBe(sibling);
    const aunt = rel({ kinship: "aunt_maternal", cadenceDays: 30 });
    expect(applyContact(aunt, "dua", TODAY).lastContact).toEqual({ date: TODAY, kind: "dua" });
    expect(applyContact(sibling, "visit", TODAY).lastContact).toEqual({
      date: TODAY,
      kind: "visit",
    });
  });

  it("never moves lastContact backwards for a back-dated log", () => {
    const r = rel({ lastContact: { date: TODAY, kind: "call" } });
    expect(applyContact(r, "visit", "2026-11-01")).toBe(r);
  });

  it("recomputes lastContact from logs (dua ignored below 30 days)", () => {
    const r = rel({ cadenceDays: 7 });
    const logs = [
      logOf("a", "2026-11-20", "call"),
      logOf("a", "2026-11-22", "dua"),
      logOf("b", "2026-11-23", "visit"),
    ];
    expect(lastContactFromLogs("a", r, logs)).toEqual({ date: "2026-11-20", kind: "call" });
    expect(lastContactFromLogs("a", rel({ cadenceDays: 60 }), logs)).toEqual({
      date: "2026-11-22",
      kind: "dua",
    });
  });

  it("summary for the coach / home is counts only", () => {
    const relatives = [
      rel({
        name: "Secret Name",
        kinship: "mother",
        cadenceDays: 2,
        lastContact: { date: "2026-11-19", kind: "call" },
      }),
      rel({
        kinship: "cousin",
        cadenceDays: 60,
        lastContact: { date: "2026-11-20", kind: "call" },
      }),
      rel({ deceased: true }),
    ];
    const summary = summarizeFamilyTies(
      relatives,
      [logOf("x", "2026-11-20"), logOf("x", "2026-11-01")],
      TODAY,
    );
    expect(summary).toEqual({
      tracked: 2,
      dueCount: 1,
      parentDue: true,
      contactsThisWeek: 1,
      asOf: TODAY,
    });
    expect(JSON.stringify(summary)).not.toContain("Secret");
  });

  it("reminder input carries dates only and one first-overdue day per parent", () => {
    const input = familyTiesReminderInput(
      [
        rel({
          name: "Mum",
          kinship: "mother",
          cadenceDays: 2,
          lastContact: { date: "2026-11-20", kind: "call" },
        }),
        rel({
          name: "Cousin",
          kinship: "cousin",
          cadenceDays: 60,
          lastContact: { date: "2026-11-01", kind: "call" },
        }),
        rel({ name: "Paused", paused: true }),
      ],
      normalizeFamilyTiesSettings(undefined),
    );
    expect(input).toEqual({
      dueDates: ["2026-11-22", "2026-12-31"],
      parentNudgeDates: ["2026-11-23"],
      digestWeekday: 5,
      digestTime: "after-jumuah",
    });
    expect(JSON.stringify(input)).not.toMatch(/Mum|Cousin/);
    expect(dueCountOn(input.dueDates, TODAY)).toBe(1);
  });

  it("prefills the edit form with only the editable fields", () => {
    const input = relativeToInput(
      rel({
        name: "Yusuf",
        phone: "0300",
        lastContact: { date: TODAY, kind: "call" },
        paused: false,
      }),
    );
    expect(input).toEqual({ name: "Yusuf", kinship: "sibling", cadenceDays: 7, phone: "0300" });
  });

  it("normalizes settings", () => {
    expect(
      normalizeFamilyTiesSettings({ type: "settings", digestWeekday: 9, digestTime: "x" }),
    ).toEqual({ type: "settings", digestWeekday: 5, digestTime: "after-jumuah" });
    expect(
      normalizeFamilyTiesSettings({ type: "settings", digestWeekday: 0, digestTime: "19:30" }),
    ).toEqual({ type: "settings", digestWeekday: 0, digestTime: "19:30" });
  });

  it("builds tel / sms / WhatsApp links from a typed number", () => {
    expect(normalizePhone(" +44 (20) 7946-0018 ")).toBe("+442079460018");
    expect(normalizePhone("12")).toBeNull();
    expect(telUrl("+44 20 7946 0018")).toBe("tel:+442079460018");
    expect(smsUrl("0300-1234567")).toBe("sms:03001234567");
    expect(whatsappUrls("+92 300 1234567")).toEqual({
      app: "whatsapp://send?phone=923001234567",
      web: "https://wa.me/923001234567",
    });
    expect(telUrl(undefined)).toBeNull();
  });
});

describe("mergeRelativesDocs", () => {
  it("keeps per-item LWW and raises lastContact to the newest log from either device", () => {
    const base = rel({ name: "Aunt", kinship: "aunt_maternal", cadenceDays: 30 });
    const local = {
      v: 1 as const,
      items: {
        r1: { ...base, id: "r1", updatedAt: "2026-11-23T10:00:00.000Z", notes: "edited later" },
      },
    };
    const remote = {
      v: 1 as const,
      items: {
        r1: {
          ...base,
          id: "r1",
          updatedAt: "2026-11-22T10:00:00.000Z",
          lastContact: { date: "2026-11-22", kind: "visit" as const },
        },
        l1: {
          ...logOf("r1", "2026-11-22", "visit"),
          id: "l1",
          updatedAt: "2026-11-22T10:00:00.000Z",
        },
      },
    };
    const merged = mergeRelativesDocs(local, remote) as typeof remote;
    expect(merged.items.r1).toMatchObject({
      notes: "edited later",
      lastContact: { date: "2026-11-22", kind: "visit" },
      updatedAt: "2026-11-23T10:00:00.000Z",
    });
    expect(merged.items.l1).toBeDefined();
    // Converges: merging the other way round gives the same document.
    expect(mergeRelativesDocs(remote, local)).toEqual(merged);
  });
});
