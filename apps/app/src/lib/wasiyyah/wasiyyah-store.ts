import type {
  WasiyyahData,
  WasiyyahDoc,
  WasiyyahSettings,
  WasiyyahVaultItem,
  WasiyyahVersion,
} from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useMemo } from "react";

import { createId } from "@/db/id";
import type { DebtEntry } from "@/lib/debts/debts";
import { requestReminderReschedule } from "@/lib/quran-companion/reschedule";
import { createVaultStore, type VaultRecord } from "@/lib/vault";
import { useStore } from "@/stores/create-store";

import {
  clampReviewInterval,
  DEFAULT_REVIEW_INTERVAL_MONTHS,
  debtsChangedSignificantly,
} from "./review";
import { normalizeWasiyyahData, openIOweTotal } from "./wasiyyah";

/**
 * Wasiyyah vault document (`wasiyyah`, D2). Items: one `version` per saved
 * will (immutable once saved), one `draft` (the wizard autosave) and one
 * `settings` (review interval + last review). Default per-item LWW merge.
 */
export const wasiyyahVault = createVaultStore<WasiyyahVaultItem>("wasiyyah");

export const WASIYYAH_DRAFT_ID = "draft";
export const WASIYYAH_SETTINGS_ID = "settings";
/** Older versions beyond this are deleted (tombstoned) when a new one is saved. */
export const MAX_WASIYYAH_VERSIONS = 20;

type Item = VaultRecord<WasiyyahVaultItem>;
type VersionItem = Extract<Item, { kind: "version" }>;

export function versionsOf(items: readonly Item[]): WasiyyahVersion[] {
  return items
    .filter((i): i is VersionItem => i.kind === "version")
    .map((i) => ({ id: i.id, createdAt: i.createdAt, data: i.data }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function draftOf(items: readonly Item[]): WasiyyahData | null {
  const draft = items.find((i) => i.kind === "draft");
  return draft?.kind === "draft" ? draft.data : null;
}

export function settingsOf(items: readonly Item[]): WasiyyahSettings {
  const s = items.find((i) => i.kind === "settings");
  if (s?.kind !== "settings") return { reviewIntervalMonths: DEFAULT_REVIEW_INTERVAL_MONTHS };
  const { kind: _k, id: _id, updatedAt: _u, deletedAt: _d, ...settings } = s;
  return { ...settings, reviewIntervalMonths: clampReviewInterval(settings.reviewIntervalMonths) };
}

/** The plan's `WasiyyahDoc` shape (newest version first). */
export function toWasiyyahDoc(items: readonly Item[]): WasiyyahDoc | null {
  const versions = versionsOf(items);
  const current = versions[0];
  return current ? { versions, currentId: current.id } : null;
}

// ── Hooks ───────────────────────────────────────────────────────────────────

export function useWasiyyah() {
  wasiyyahVault.useEnsureLoaded();
  const items = wasiyyahVault.useItems();
  const status = wasiyyahVault.useStatus();
  const isReady = useStore(wasiyyahVault.store, (s) => s.isReady);
  return useMemo(
    () => ({
      versions: versionsOf(items),
      draft: draftOf(items),
      settings: settingsOf(items),
      status: status.status,
      error: status.error,
      isReady,
    }),
    [items, status.status, status.error, isReady],
  );
}

// ── Actions ─────────────────────────────────────────────────────────────────

function currentItems(): Item[] {
  return wasiyyahVault.store.getState().items;
}

async function putSettings(next: WasiyyahSettings): Promise<void> {
  await wasiyyahVault.actions.put(WASIYYAH_SETTINGS_ID, { kind: "settings", ...next });
}

export const wasiyyahActions = {
  async saveDraft(data: WasiyyahData): Promise<void> {
    await wasiyyahVault.actions.put(WASIYYAH_DRAFT_ID, { kind: "draft", data });
  },

  async discardDraft(): Promise<void> {
    await wasiyyahVault.actions.remove(WASIYYAH_DRAFT_ID);
  },

  /**
   * Saves the draft as a new immutable version, clears the draft, counts as a
   * review (snapshotting open debts for the >20 % nudge) and prunes old versions.
   */
  async saveVersion(
    data: WasiyyahData,
    debts: readonly DebtEntry[],
    now = new Date(),
  ): Promise<string> {
    const normalized = normalizeWasiyyahData(data);
    const id = createId("wv");
    const createdAt = now.toISOString();
    await wasiyyahVault.actions.put(id, { kind: "version", createdAt, data: normalized });
    await wasiyyahVault.actions.remove(WASIYYAH_DRAFT_ID);
    const settings = settingsOf(currentItems());
    await putSettings({
      ...settings,
      lastReviewedAt: createdAt,
      debtsSnapshot: {
        total: openIOweTotal(debts, normalized.currency),
        currency: normalized.currency,
      },
      debtsChangeNoticedOn: undefined,
    });
    const old = versionsOf(currentItems()).slice(MAX_WASIYYAH_VERSIONS);
    for (const v of old) await wasiyyahVault.actions.remove(v.id);
    // The review reminder is anchored on the last review: move it now (NF-3.9 L1665).
    requestReminderReschedule();
    return id;
  },

  async deleteVersion(id: string): Promise<void> {
    await wasiyyahVault.actions.remove(id);
    requestReminderReschedule();
  },

  /** "I've reviewed it — nothing to change." */
  async markReviewed(debts: readonly DebtEntry[], now = new Date()): Promise<void> {
    const items = currentItems();
    const latest = versionsOf(items)[0];
    const settings = settingsOf(items);
    const currency = latest?.data.currency ?? settings.debtsSnapshot?.currency;
    await putSettings({
      ...settings,
      lastReviewedAt: now.toISOString(),
      ...(currency ? { debtsSnapshot: { total: openIOweTotal(debts, currency), currency } } : {}),
      debtsChangeNoticedOn: undefined,
    });
    requestReminderReschedule();
  },

  async setReviewInterval(months: number): Promise<void> {
    const settings = settingsOf(currentItems());
    await putSettings({ ...settings, reviewIntervalMonths: clampReviewInterval(months) });
    requestReminderReschedule();
  },

  /**
   * Called after the debts record changes: when open "I owe" balances moved by
   * more than 20 % since the last review, remember the day (anchors the review
   * reminder). No-op without a saved wasiyyah or when the vault is locked.
   */
  async noteDebtsChange(debts: readonly DebtEntry[], now = new Date()): Promise<boolean> {
    if (!wasiyyahVault.store.getState().isReady) await wasiyyahVault.actions.load();
    if (wasiyyahVault.store.getState().status !== "ready") return false;
    const items = currentItems();
    const settings = settingsOf(items);
    if (!versionsOf(items).length || !settings.debtsSnapshot || settings.debtsChangeNoticedOn) {
      return false;
    }
    const current = openIOweTotal(debts, settings.debtsSnapshot.currency);
    if (!debtsChangedSignificantly(settings.debtsSnapshot.total, current)) return false;
    await putSettings({ ...settings, debtsChangeNoticedOn: getLocalDateString(now) });
    return true;
  },
};
