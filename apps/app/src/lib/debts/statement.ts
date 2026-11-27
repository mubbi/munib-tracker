import type { PrintableDocument, PrintableSection } from "@/lib/printable/printable-html";

import { DEBT_TABS, type DebtEntry, debtsForTab, outstanding, paidTotal } from "./debts";
import type { ObligationLine } from "./obligations";

type Translate = (key: string, options?: Record<string, unknown>) => string;

/**
 * Debts & trusts statement (NF-3.8 "Export to a PDF statement"), rendered by
 * the same printable renderer as the wasiyyah. Built on demand only.
 */
export function buildDebtsStatement(
  input: { debts: readonly DebtEntry[]; obligations: readonly ObligationLine[]; today: string },
  ctx: {
    t: Translate;
    lang: string;
    dir: "ltr" | "rtl";
    money: (amount: number, currency: string) => string;
    formatDate: (day: string) => string;
  },
): PrintableDocument {
  const { t } = ctx;
  const sections: PrintableSection[] = [];
  const money = (n: number | null, code?: string) => (n != null && code ? ctx.money(n, code) : "—");

  for (const tab of DEBT_TABS) {
    const rows = debtsForTab(input.debts, tab);
    if (!rows.length) continue;
    sections.push({
      heading: t(`debts.tabs.${tab}`),
      table: {
        head: [
          t("debts.statement.colWho"),
          t("debts.statement.colAmount"),
          t("debts.statement.colPaid"),
          t("debts.statement.colOutstanding"),
          t("debts.statement.colDue"),
          t("debts.statement.colStatus"),
        ],
        rows: rows.map((d) => [
          [d.counterparty, d.item].filter(Boolean).join(" · "),
          money(d.amount ?? null, d.currency),
          d.amount != null ? money(paidTotal(d), d.currency) : "—",
          money(outstanding(d), d.currency),
          d.dueOn ? ctx.formatDate(d.dueOn) : "—",
          t(`debts.status.${d.status}`),
        ]),
      },
      paragraphs: rows
        .filter((d) => d.witnesses?.length)
        .map((d) => ({
          text: t("debts.statement.witnesses", {
            who: d.counterparty,
            names: (d.witnesses ?? []).join(", "),
          }),
          muted: true,
        })),
    });
  }

  if (input.obligations.length) {
    sections.push({
      heading: t("debts.obligations.title"),
      table: {
        head: [t("debts.statement.colItem"), t("debts.statement.colAmount")],
        rows: input.obligations.map((o) => [
          t(`debts.obligations.${o.id}`),
          o.amount != null && o.currency
            ? ctx.money(o.amount, o.currency)
            : t("debts.obligations.countValue", { count: o.count ?? 0 }),
        ]),
      },
    });
  }

  return {
    lang: ctx.lang,
    dir: ctx.dir,
    title: t("debts.statement.title"),
    subtitle: t("debts.statement.subtitle", { date: ctx.formatDate(input.today) }),
    sections,
    disclaimer: { text: t("debts.statement.disclaimer") },
  };
}
