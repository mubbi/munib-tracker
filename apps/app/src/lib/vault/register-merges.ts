import { mergeDebtsDocs } from "@/lib/debts/merge";
import { mergeRelativesDocs } from "@/lib/family-ties/merge";

import { registerVaultDocMerge, type VaultDocId, type VaultDocMerge } from "./vault-docs";

/**
 * Domain merges for the vault documents that need more than per-item LWW
 * (§4.2 step 5). Registered **eagerly** — `vault.ts` imports this module, so
 * every `mergeDocEnvelopes` call (blob sync, unlock, restore) sees them even
 * when the feature's store / UI module hasn't been imported yet (e.g. a sync
 * that runs before the lazily-loaded home cards). Without this, an early sync
 * fell back to plain LWW and could keep only one of two offline repayments.
 *
 * Only the pure merge modules are imported here (no React, no stores), so the
 * startup graph stays light. `muhasabah` and `wasiyyah` use the default merge.
 */
export const DOMAIN_VAULT_MERGES: Readonly<Partial<Record<VaultDocId, VaultDocMerge>>> = {
  debts: mergeDebtsDocs,
  relatives: mergeRelativesDocs,
};

export function registerDomainVaultMerges(): void {
  for (const [docId, merge] of Object.entries(DOMAIN_VAULT_MERGES)) {
    if (merge) registerVaultDocMerge(docId as VaultDocId, merge);
  }
}

registerDomainVaultMerges();
