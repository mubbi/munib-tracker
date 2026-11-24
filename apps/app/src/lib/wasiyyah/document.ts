import type { MadhhabId, WasiyyahData, WasiyyahDebtLine } from "@munib-tracker/shared/types";

import type {
  PrintableDocument,
  PrintableParagraph,
  PrintableSection,
} from "@/lib/printable/printable-html";

import type { WasiyyahComputation } from "./wasiyyah";

export type Translate = (key: string, options?: Record<string, unknown>) => string;

/** Shahadah rendered from the dataset (`SALAH_GUIDE_PHRASES` id `wudu-dua`, Muslim 234). */
export interface ShahadahText {
  arabic: string;
  transliteration: string;
  /** English translation from the dataset (only printed in English / side by side). */
  translation: string;
  reference: string;
}

export interface WasiyyahDocumentContext {
  t: Translate;
  /** English translator for side-by-side output (omit when the locale is English). */
  tEn?: Translate;
  lang: string;
  dir: "ltr" | "rtl";
  money: (amount: number, currency: string) => string;
  formatDate: (day: string) => string;
  shahadah: ShahadahText;
  /** Localised heir label for `heirType`. */
  heirLabel?: (heir: string) => string;
}

/** `wasiyyah.doc.*` copy in the document language, with English alongside when requested. */
function makeP(ctx: WasiyyahDocumentContext, sideBySide: boolean) {
  return (
    key: string,
    options?: Record<string, unknown>,
    extra: Partial<PrintableParagraph> = {},
  ) => {
    const text = ctx.t(key, options);
    const en = sideBySide && ctx.tEn ? ctx.tEn(key, options) : undefined;
    return { text, ...(en && en !== text ? { en } : {}), ...extra } satisfies PrintableParagraph;
  };
}

function debtKindKey(line: WasiyyahDebtLine): string {
  return `wasiyyah.debtSource.${line.source}`;
}

/**
 * Which school the attached Mirath shares follow (D9: the schools differ, so a
 * table of fractions must name its school). Snapshots saved before the school
 * was recorded get a note to recalculate instead.
 */
function mirathSchoolParagraph(
  school: MadhhabId | null,
  ctx: WasiyyahDocumentContext,
  sideBySide: boolean,
): PrintableParagraph {
  const line = (t: Translate) =>
    school
      ? t("wasiyyah.doc.mirathSchool", { school: t(`fiqh.school.${school}`) })
      : t("wasiyyah.doc.mirathSchoolUnknown");
  const text = line(ctx.t);
  const en = sideBySide && ctx.tEn ? line(ctx.tEn) : undefined;
  return { text, ...(en && en !== text ? { en } : {}) };
}

export function buildWasiyyahDocument(
  data: WasiyyahData,
  computation: WasiyyahComputation,
  ctx: WasiyyahDocumentContext,
): PrintableDocument {
  const sideBySide = data.sideBySideEnglish && !!ctx.tEn && ctx.lang !== "en";
  const p = makeP(ctx, sideBySide);
  const h = (key: string) => ({
    heading: ctx.t(key),
    ...(sideBySide && ctx.tEn ? { headingEn: ctx.tEn(key) } : {}),
  });
  const sections: PrintableSection[] = [];
  const date = ctx.formatDate(data.testator.date);

  // 1. Testator + shahadah (required).
  sections.push({
    ...h("wasiyyah.doc.testatorHeading"),
    paragraphs: [
      p("wasiyyah.doc.testatorLine", { name: data.testator.name, date }),
      p("wasiyyah.doc.shahadahIntro"),
      { text: ctx.shahadah.arabic, arabic: true },
      { text: ctx.shahadah.transliteration, muted: true },
      ...(ctx.lang === "en" || sideBySide
        ? [{ text: ctx.shahadah.translation, muted: true } satisfies PrintableParagraph]
        : []),
      { text: ctx.shahadah.reference, muted: true },
    ],
  });

  // 2. Funeral wishes.
  const funeral: PrintableParagraph[] = [];
  if (data.funeral.sunnahRites) funeral.push(p("wasiyyah.doc.funeralSunnah"));
  if (data.funeral.muslimCemetery) funeral.push(p("wasiyyah.doc.funeralCemetery"));
  if (data.funeral.avoidInnovations) funeral.push(p("wasiyyah.doc.funeralInnovations"));
  if (data.funeral.notes) funeral.push({ text: data.funeral.notes });
  if (funeral.length) sections.push({ ...h("wasiyyah.doc.funeralHeading"), paragraphs: funeral });

  // 3. Debts and obligations.
  const debts = data.debts.filter((l) => l.confirmed);
  if (debts.length) {
    const viewKey =
      computation.applied === "capital"
        ? "wasiyyah.doc.allahDebtsCapital"
        : computation.applied === "third"
          ? "wasiyyah.doc.allahDebtsThird"
          : "wasiyyah.doc.allahDebtsStricter";
    const hasAllahDebts = debts.some((l) => ["zakat", "fidyah", "kaffarah"].includes(l.source));
    sections.push({
      ...h("wasiyyah.doc.debtsHeading"),
      paragraphs: [
        p("wasiyyah.doc.debtsIntro"),
        ...(hasAllahDebts ? [p(viewKey, undefined, { muted: true })] : []),
      ],
      table: {
        head: [ctx.t("wasiyyah.doc.colItem"), ctx.t("wasiyyah.doc.colAmount")],
        rows: debts.map((l) => [
          l.label ? `${ctx.t(debtKindKey(l))}: ${l.label}` : ctx.t(debtKindKey(l)),
          l.amount != null && l.currency
            ? ctx.money(l.amount, l.currency)
            : l.count != null
              ? ctx.t("wasiyyah.doc.countValue", { count: l.count })
              : "—",
        ]),
      },
    });
  }

  // 4. Trusts to return.
  const trusts = data.trusts.filter((l) => l.confirmed);
  if (trusts.length) {
    sections.push({
      ...h("wasiyyah.doc.trustsHeading"),
      paragraphs: [p("wasiyyah.doc.trustsIntro")],
      table: {
        head: [ctx.t("wasiyyah.doc.colOwner"), ctx.t("wasiyyah.doc.colItem")],
        rows: trusts.map((l) => [
          l.counterparty,
          [l.item, l.amount != null && l.currency ? ctx.money(l.amount, l.currency) : null]
            .filter(Boolean)
            .join(" · ") || "—",
        ]),
      },
    });
  }

  // 5. Bequests (≤ ⅓).
  if (data.bequests.length) {
    const notes: PrintableParagraph[] = [p("wasiyyah.doc.bequestsIntro")];
    if (data.bequests.some((b) => b.isHeir))
      notes.push(p("wasiyyah.doc.heirConsent", undefined, { muted: true }));
    sections.push({
      ...h("wasiyyah.doc.bequestsHeading"),
      paragraphs: notes,
      table: {
        head: [
          ctx.t("wasiyyah.doc.colBeneficiary"),
          ctx.t("wasiyyah.doc.colShare"),
          ctx.t("wasiyyah.doc.colPurpose"),
        ],
        rows: data.bequests.map((b) => [
          b.isHeir && b.heirType && ctx.heirLabel
            ? `${b.beneficiary} (${ctx.heirLabel(b.heirType)})`
            : b.beneficiary,
          b.percent != null && b.percent > 0
            ? ctx.t("wasiyyah.doc.percentValue", { percent: b.percent })
            : b.amount != null
              ? ctx.money(b.amount, data.currency)
              : "—",
          b.purpose ?? "",
        ]),
      },
    });
  }

  // 6. Guardianship and executor.
  const people: PrintableParagraph[] = [];
  if (data.guardians.length) {
    people.push(p("wasiyyah.doc.guardians", { names: data.guardians.join(", ") }));
  }
  if (data.executor) people.push(p("wasiyyah.doc.executor", { name: data.executor }));
  if (people.length) sections.push({ ...h("wasiyyah.doc.peopleHeading"), paragraphs: people });

  // 7. Distribution of the rest (required).
  const distribution: PrintableSection = {
    ...h("wasiyyah.doc.distributionHeading"),
    paragraphs: [p("wasiyyah.doc.distribution")],
  };
  if (data.mirathSnapshot?.shares.length) {
    distribution.paragraphs?.push(
      mirathSchoolParagraph(data.mirathSnapshot.school, ctx, sideBySide),
      p("wasiyyah.doc.mirathIllustrative", undefined, { muted: true }),
    );
    distribution.table = {
      head: [ctx.t("wasiyyah.doc.colHeir"), ctx.t("wasiyyah.doc.colShare")],
      rows: data.mirathSnapshot.shares.map((s) => [
        `${ctx.heirLabel ? ctx.heirLabel(s.heir) : s.heir}${s.count > 1 ? ` × ${s.count}` : ""}`,
        s.fraction,
      ]),
    };
  }
  sections.push(distribution);

  // 8. Witnesses (Qur'an 5:106) + signatures.
  const [w1, w2] = data.witnesses;
  sections.push({
    ...h("wasiyyah.doc.witnessesHeading"),
    paragraphs: [p("wasiyyah.doc.witnessesIntro")],
    signatures: [
      ctx.t("wasiyyah.doc.signTestator", { name: data.testator.name }),
      ctx.t("wasiyyah.doc.signWitness", { name: w1 || "____________" }),
      ctx.t("wasiyyah.doc.signWitness", { name: w2 || "____________" }),
    ],
  });

  return {
    lang: ctx.lang,
    dir: ctx.dir,
    title: ctx.t("wasiyyah.doc.title"),
    ...(sideBySide && ctx.tEn ? { titleEn: ctx.tEn("wasiyyah.doc.title") } : {}),
    subtitle: ctx.t("wasiyyah.doc.subtitle", { date }),
    sections,
    disclaimer: p("wasiyyah.disclaimer"),
  };
}
