import {
  addPayment,
  debtReminderDates,
  debtsForTab,
  deriveStatus,
  forgiveDebt,
  normalizeDebt,
  outstanding,
  outstandingByCurrency,
  removePayment,
  reopenDebt,
  ribaExcess,
} from "./debts";
import { makeDebt } from "./test-fixtures";

describe("outstanding / deriveStatus", () => {
  it("is amount minus payments, never below zero, null without a principal", () => {
    expect(outstanding(makeDebt({ amount: 100, payments: [pay(30), pay(20)] }))).toBe(50);
    expect(outstanding(makeDebt({ amount: 100, payments: [pay(130)] }))).toBe(0);
    expect(outstanding(makeDebt({ amount: undefined, direction: "trust_held" }))).toBeNull();
  });

  it("avoids float residue (0.1 + 0.2)", () => {
    expect(outstanding(makeDebt({ amount: 0.3, payments: [pay(0.1), pay(0.2)] }))).toBe(0);
  });

  it("auto-settles at zero, reopens when a payment is removed, keeps forgiven", () => {
    let d = makeDebt({ amount: 50 });
    d = addPayment(d, { id: "p1", date: "2026-11-01", amount: 50 });
    expect(d.status).toBe("settled");
    d = removePayment(d, "p1");
    expect(d.status).toBe("open");
    expect(d.removedPaymentIds).toEqual(["p1"]);
    expect(deriveStatus({ ...d, status: "forgiven" })).toBe("forgiven");
  });

  it("ignores non-positive payments", () => {
    const d = makeDebt({ amount: 50 });
    expect(addPayment(d, { id: "x", date: "2026-11-01", amount: 0 })).toBe(d);
  });
});

describe("forgive / reopen", () => {
  it("only forgives money owed to me (a sadaqah, Qur'an 2:280)", () => {
    expect(forgiveDebt(makeDebt({ direction: "i_owe" }), "2026-11-23").status).toBe("open");
    const f = forgiveDebt(makeDebt({ direction: "owed_to_me" }), "2026-11-23");
    expect(f).toMatchObject({ status: "forgiven", forgivenOn: "2026-11-23" });
    expect(reopenDebt(f)).toMatchObject({ status: "open", forgivenOn: undefined });
  });
});

describe("ribaExcess (informational, never blocking)", () => {
  it("flags total repayment above the principal on loans only", () => {
    const loan = makeDebt({ amount: 100, payments: [pay(80)] });
    expect(ribaExcess(loan, 20)).toBe(0);
    expect(ribaExcess(loan, 30)).toBe(10);
    expect(ribaExcess(makeDebt({ direction: "owed_to_me", amount: 100 }), 110)).toBe(10);
    expect(ribaExcess(makeDebt({ direction: "trust_held", amount: 100 }), 150)).toBe(0);
  });
});

describe("normalizeDebt", () => {
  it("trims, drops blank witnesses and re-derives status", () => {
    const d = normalizeDebt({
      ...makeDebt({ amount: 10, payments: [pay(10)] }),
      counterparty: "  Bilal ",
      witnesses: [" Ali ", ""],
      notes: "  ",
    });
    expect(d).toMatchObject({ counterparty: "Bilal", witnesses: ["Ali"], notes: undefined });
    expect(d.status).toBe("settled");
  });
});

describe("collections", () => {
  const rows = [
    makeDebt({ id: "a", dueOn: "2026-12-10", updatedAt: "2026-11-01T00:00:00Z" }),
    makeDebt({ id: "b", dueOn: "2026-11-30", updatedAt: "2026-11-02T00:00:00Z" }),
    makeDebt({ id: "c", status: "settled", updatedAt: "2026-11-05T00:00:00Z" }),
    makeDebt({ id: "d", updatedAt: "2026-11-04T00:00:00Z" }),
    makeDebt({ id: "t", direction: "trust_given", amount: undefined }),
  ];

  it("orders a tab: open by due date (undated last), then closed", () => {
    expect(debtsForTab(rows, "i_owe").map((r) => r.id)).toEqual(["b", "a", "d", "c"]);
    expect(debtsForTab(rows, "trusts").map((r) => r.id)).toEqual(["t"]);
  });

  it("totals open balances per currency", () => {
    expect(
      outstandingByCurrency(
        [
          makeDebt({ amount: 100, currency: "GBP", payments: [pay(40)] }),
          makeDebt({ amount: 5, currency: "USD" }),
          makeDebt({ amount: 9, currency: "USD", status: "settled" }),
        ],
        "i_owe",
      ),
    ).toEqual({ GBP: 60, USD: 5 });
  });
});

describe("debtReminderDates", () => {
  it("fires 3 days before and on the due day, deduped, within the horizon", () => {
    const dates = debtReminderDates(
      [
        { status: "open", dueOn: "2026-11-27" },
        { status: "open", dueOn: "2026-11-30" },
        { status: "settled", dueOn: "2026-11-25" },
        { status: "open", dueOn: "2027-03-01" },
      ],
      "2026-11-23",
      14,
    );
    // 11-24 (27−3), 11-27 (due + 30−3 deduped), 11-30.
    expect(dates).toEqual(["2026-11-24", "2026-11-27", "2026-11-30"]);
  });
});

function pay(amount: number, id = `p${amount}`) {
  return { id, date: "2026-11-01", amount };
}
