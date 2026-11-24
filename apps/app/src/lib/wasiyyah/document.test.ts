import type { MadhhabId, WasiyyahData } from "@munib-tracker/shared/types";

import i18n from "@/i18n";
import { buildDebtsStatement } from "@/lib/debts/statement";
import { makeDebt } from "@/lib/debts/test-fixtures";
import { escapeHtml, renderPrintableHtml } from "@/lib/printable/printable-html";

import { buildWasiyyahDocument } from "./document";
import { wasiyyahShahadah } from "./use-wasiyyah-export";
import { computeWasiyyah, emptyWasiyyahData } from "./wasiyyah";

const t = (key: string, options?: Record<string, unknown>) => i18n.t(key, options ?? {});
const ctx = {
  t,
  lang: "en",
  dir: "ltr" as const,
  money: (n: number, c: string) => `${c} ${n}`,
  formatDate: (d: string) => d,
  shahadah: wasiyyahShahadah(),
  heirLabel: (h: string) => t(`heirs.${h}`),
};

function data(overrides: Partial<WasiyyahData> = {}): WasiyyahData {
  return {
    ...emptyWasiyyahData("2026-11-23", "USD"),
    testator: { name: "Aminah <script>", date: "2026-11-23" },
    witnesses: ["Ali", "Umar"],
    ...overrides,
  };
}

describe("printable renderer", () => {
  it("escapes user text", () => {
    expect(escapeHtml(`<a href="x">&'`)).toBe("&lt;a href=&quot;x&quot;&gt;&amp;&#39;");
  });
});

describe("buildWasiyyahDocument", () => {
  it("always has sections 1 and 7, the dataset shahadah, signatures and the disclaimer", () => {
    const d = data();
    const html = renderPrintableHtml(buildWasiyyahDocument(d, computeWasiyyah(d, null), ctx));
    expect(html).toContain("Aminah &lt;script&gt;");
    expect(html).not.toContain("<script>");
    expect(html).toContain(ctx.shahadah.arabic);
    expect(ctx.shahadah.reference).toBe("Sahih Muslim 234");
    expect(html).toContain("Islamic law of inheritance");
    expect(html).toContain("Not legally binding in many jurisdictions");
    expect(html).toContain("Witness: Umar");
    // Optional sections left empty are omitted.
    expect(html).not.toContain("4. Trusts to return");
  });

  it("prints confirmed debts, bequests with the heir-consent note, and English side by side", () => {
    const d = data({
      sideBySideEnglish: true,
      debts: [
        { id: "a", source: "debt", label: "Yusuf", amount: 60, currency: "USD", confirmed: true },
        { id: "b", source: "debt", label: "Hidden", amount: 1, currency: "USD", confirmed: false },
      ],
      bequests: [
        {
          id: "h",
          beneficiary: "Zayd",
          kind: "person",
          amount: 10,
          isHeir: true,
          heirType: "son",
          heirAcknowledged: true,
        },
      ],
    });
    const doc = buildWasiyyahDocument(d, computeWasiyyah(d, "hanafi"), {
      ...ctx,
      lang: "fr",
      tEn: t,
    });
    const html = renderPrintableHtml(doc);
    expect(html).toContain("Yusuf");
    expect(html).not.toContain("Hidden");
    expect(html).toContain("Zayd (Son)");
    expect(html).toContain("other heirs consent");
    // Side by side carries English; identical copy collapses to one column in the HTML.
    expect(doc.titleEn).toBe("Wasiyyah (Islamic will)");
    expect(html).not.toContain('class="en"');
  });

  it("names the school the attached Mirath shares were calculated under", () => {
    const snapshot = (school: MadhhabId | null): WasiyyahData["mirathSnapshot"] => ({
      id: "ms",
      createdAt: "2026-11-24T00:00:00.000Z",
      school,
      shares: [
        { heir: "husband", count: 1, fraction: "1/4" },
        { heir: "daughter", count: 1, fraction: "3/4" },
      ],
    });
    const section = (d: WasiyyahData) =>
      buildWasiyyahDocument(d, computeWasiyyah(d, null), ctx).sections.find((s) =>
        s.table?.rows.some((r) => r[1] === "3/4"),
      );
    const maliki = section(data({ mirathSnapshot: snapshot("maliki") }));
    expect(maliki?.paragraphs?.map((x) => x.text)).toContain(
      "Shares as calculated under the Maliki school.",
    );
    // A legacy snapshot saved without a school asks for a recalculation.
    const legacy = section(data({ mirathSnapshot: snapshot(null) }));
    expect(legacy?.paragraphs?.map((x) => x.text)).toContain(t("wasiyyah.doc.mirathSchoolUnknown"));
    expect(t("wasiyyah.doc.mirathSchoolUnknown")).not.toBe("wasiyyah.doc.mirathSchoolUnknown");
  });
});

describe("buildDebtsStatement (same renderer)", () => {
  it("groups by tab and lists obligations", () => {
    const doc = buildDebtsStatement(
      {
        debts: [
          makeDebt({ witnesses: ["Ali"] }),
          makeDebt({ id: "t", direction: "trust_held", amount: undefined, item: "Ring" }),
        ],
        obligations: [{ id: "qaza_salah", count: 3, route: "/qaza" }],
        today: "2026-11-23",
      },
      { t, lang: "en", dir: "ltr", money: ctx.money, formatDate: (x) => x },
    );
    expect(doc.sections.map((s) => s.heading)).toEqual([
      "I owe",
      "Trusts",
      "Religious obligations",
    ]);
    expect(renderPrintableHtml(doc)).toContain("Yusuf — witnesses: Ali");
  });
});
