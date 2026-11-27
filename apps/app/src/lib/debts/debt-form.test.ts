import { debtFormFrom, debtInputFromForm, repaymentFromForm } from "./debt-form";
import type { DebtEntry } from "./debts";

const DEFAULTS = { currency: "USD", today: "2026-11-25" };

const RECORD = {
  id: "d1",
  kind: "debt",
  direction: "i_owe",
  counterparty: "Yusuf",
  amount: 100,
  currency: "PKR",
  createdOn: "2026-11-01",
  dueOn: "2026-12-01",
  witnesses: ["Ali", "Umar"],
  notes: "n",
  payments: [{ id: "p1", date: "2026-11-02", amount: 40 }],
  removedPaymentIds: ["p0"],
  status: "open",
  documentUri: "vault-file://dphoto_1#image/jpeg",
  updatedAt: "2026-11-02T00:00:00.000Z",
} as unknown as DebtEntry;

describe("debtFormFrom", () => {
  it("fills a blank form with the defaults for a new record", () => {
    expect(debtFormFrom(undefined, "owed_to_me", DEFAULTS)).toEqual({
      direction: "owed_to_me",
      counterparty: "",
      amount: "",
      currency: "USD",
      item: "",
      createdOn: "2026-11-25",
      dueOn: "",
      witnesses: "",
      notes: "",
    });
  });

  it("round-trips a stored record into text fields", () => {
    expect(debtFormFrom(RECORD, "owed_to_me", DEFAULTS)).toMatchObject({
      direction: "i_owe",
      amount: "100",
      currency: "PKR",
      witnesses: "Ali, Umar",
    });
  });
});

describe("debtInputFromForm", () => {
  const form = debtFormFrom(undefined, "i_owe", DEFAULTS);

  it("requires who, a loan amount, and readable days", () => {
    expect(debtInputFromForm(form, undefined)).toEqual({
      ok: false,
      error: "debts.form.errorWho",
    });
    const named = { ...form, counterparty: "Bilal" };
    expect(debtInputFromForm(named, undefined)).toEqual({
      ok: false,
      error: "debts.form.errorAmount",
    });
    expect(debtInputFromForm({ ...named, amount: "5", dueOn: "2026-02-30" }, undefined)).toEqual({
      ok: false,
      error: "debts.form.errorDate",
    });
  });

  it("a trust needs no amount and keeps its item; a loan drops a leftover item", () => {
    const trust = debtInputFromForm(
      { ...form, direction: "trust_held", counterparty: "Bilal", item: "Watch" },
      undefined,
    );
    expect(trust).toMatchObject({ ok: true, input: { item: "Watch", status: "open" } });
    expect(trust.ok && "amount" in trust.input).toBe(false);

    const loan = debtInputFromForm(
      { ...form, counterparty: "Bilal", amount: "250", item: "Watch", createdOn: "2026/1/5" },
      undefined,
    );
    expect(loan).toMatchObject({
      ok: true,
      input: { amount: 250, currency: "USD", item: "", createdOn: "2026-01-05" },
    });
  });

  it("carries payments, status and the photo reference over from the stored record", () => {
    const result = debtInputFromForm(debtFormFrom(RECORD, "i_owe", DEFAULTS), RECORD);
    expect(result).toMatchObject({
      ok: true,
      input: {
        payments: RECORD.payments,
        removedPaymentIds: ["p0"],
        status: "open",
        documentUri: RECORD.documentUri,
        dueOn: "2026-12-01",
      },
    });
  });
});

describe("repaymentFromForm", () => {
  it("validates the amount and day and drops a blank note", () => {
    expect(repaymentFromForm("", "2026-11-25", "")).toEqual({
      ok: false,
      error: "debts.payments.errorAmount",
    });
    expect(repaymentFromForm("10", "nope", "")).toEqual({
      ok: false,
      error: "debts.form.errorDate",
    });
    expect(repaymentFromForm("10", "2026-11-25", "  ")).toEqual({
      ok: true,
      payment: { amount: 10, date: "2026-11-25" },
    });
    expect(repaymentFromForm("10", "2026-11-25", "cash")).toMatchObject({
      payment: { note: "cash" },
    });
  });
});
