import type { FamilyTiesItem, Relative, RelativeContactLog } from "@munib-tracker/shared/types";

import { mergeVaultDocs, type VaultDoc, type VaultRecord } from "@/lib/vault/doc-merge";

import { isContactLog, isRelative, lastContactFromLogs } from "./model";

/**
 * Domain merge for the `relatives` vault document. Per-item LWW first; then,
 * because every contact is its own log item, a relative's `lastContact` is
 * raised to the newest qualifying log so a call logged offline on one device
 * isn't lost when another device edited the same relative later. Pure and
 * deterministic (no timestamps are bumped), so both devices converge.
 */
export function mergeRelativesDocs(
  local: VaultDoc<unknown>,
  remote: VaultDoc<unknown>,
): VaultDoc<unknown> {
  const merged = mergeVaultDocs(
    local as VaultDoc<FamilyTiesItem>,
    remote as VaultDoc<FamilyTiesItem>,
  );
  const items = Object.values(merged.items).filter((item) => !item.deletedAt);
  const logs = items.filter(isContactLog) as RelativeContactLog[];
  const next = { ...merged.items };
  for (const item of items) {
    if (!isRelative(item)) continue;
    const relative = item as VaultRecord<Relative>;
    const fromLogs = lastContactFromLogs(relative.id, relative, logs);
    if (fromLogs && (!relative.lastContact || fromLogs.date > relative.lastContact.date)) {
      next[relative.id] = { ...relative, lastContact: fromLogs };
    }
  }
  return { v: 1, items: next } as VaultDoc<unknown>;
}
