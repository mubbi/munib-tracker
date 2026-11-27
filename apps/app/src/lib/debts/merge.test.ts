import type { DebtsVaultItem } from "@munib-tracker/shared/types";

import type { VaultDoc } from "@/lib/vault";

import { mergeDebtsDocs } from "./merge";
import { docOf, makeDebt, makeVow } from "./test-fixtures";

const T1 = "2026-11-10T00:00:00.000Z";
const T2 = "2026-11-11T00:00:00.000Z";
const p = (id: string, amount: number, date = "2026-11-05") => ({ id, amount, date });

function merged(local: VaultDoc<DebtsVaultItem>, remote: VaultDoc<DebtsVaultItem>) {
  return mergeDebtsDocs(local, remote) as VaultDoc<DebtsVaultItem>;
}

describe("mergeDebtsDocs", () => {
  it("keeps repayments logged offline on both devices and re-derives status", () => {
    const local = docOf(makeDebt({ amount: 100, payments: [p("a", 60)], updatedAt: T1 }));
    const remote = docOf(makeDebt({ amount: 100, payments: [p("b", 40)], updatedAt: T2 }));
    const out = merged(local, remote).items.d1;
    expect(out?.kind === "debt" && out.payments.map((x) => x.id)).toEqual(["a", "b"]);
    expect(out?.kind === "debt" && out.status).toBe("settled");
  });

  it("does not resurrect a payment removed on either side", () => {
    const local = docOf(
      makeDebt({ payments: [p("b", 10)], removedPaymentIds: ["a"], updatedAt: T2 }),
    );
    const remote = docOf(makeDebt({ payments: [p("a", 10), p("b", 10)], updatedAt: T1 }));
    const out = merged(local, remote).items.d1;
    expect(out?.kind === "debt" && out.payments.map((x) => x.id)).toEqual(["b"]);
  });

  it("lets a newer delete (tombstone) win and merges vows by item LWW", () => {
    const tomb = { id: "d1", updatedAt: T2, deletedAt: T2 } as never;
    const local: VaultDoc<DebtsVaultItem> = { v: 1, items: { d1: tomb } };
    const remote = docOf(makeDebt({ updatedAt: T1 }), makeVow({ updatedAt: T1 }));
    const out = merged(local, remote);
    expect(out.items.d1?.deletedAt).toBe(T2);
    expect(out.items.v1?.kind).toBe("vow");
  });

  it("is deterministic regardless of argument order", () => {
    const a = docOf(makeDebt({ payments: [p("a", 1)], updatedAt: T1 }));
    const b = docOf(makeDebt({ payments: [p("b", 1)], updatedAt: T2 }));
    expect(merged(a, b)).toEqual(merged(b, a));
  });
});
