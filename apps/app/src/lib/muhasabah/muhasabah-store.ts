import type {
  MuhasabahConfig,
  MuhasabahEntry,
  MuhasabahItem,
  MuhasabahWeekSummary,
} from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useMemo } from "react";

import { requestReminderReschedule } from "@/lib/quran-companion/reschedule";
import { createVaultStore, liveItems, type VaultRecord, vault } from "@/lib/vault";

import { expiredEntryDates, summarizeMuhasabahWeek } from "./logic";
import {
  isMuhasabahConfig,
  isMuhasabahEntry,
  MUHASABAH_CONFIG_ID,
  muhasabahEntryId,
  normalizeMuhasabahConfig,
} from "./model";

/**
 * Nightly muhasabah vault document (`muhasabah`, D2): one `config` item plus
 * one `entry:<date>` item per review. Per-item LWW merge is the right rule —
 * each night's review and the config are edited independently.
 */
export const muhasabahVault = createVaultStore<MuhasabahItem>("muhasabah");

type Items = readonly VaultRecord<MuhasabahItem>[];

export function configOf(items: Items): MuhasabahConfig {
  return normalizeMuhasabahConfig(items.find(isMuhasabahConfig));
}

/** Entries newest first. */
export function entriesOf(items: Items): MuhasabahEntry[] {
  return items.filter(isMuhasabahEntry).sort((a, b) => b.date.localeCompare(a.date));
}

export function useMuhasabah() {
  muhasabahVault.useEnsureLoaded();
  const items = muhasabahVault.useItems();
  const { status, error } = muhasabahVault.useStatus();
  return useMemo(
    () => ({ config: configOf(items), entries: entriesOf(items), status, error }),
    [items, status, error],
  );
}

function currentItems(): Items {
  return muhasabahVault.store.getState().items;
}

export const muhasabahActions = {
  async saveConfig(next: MuhasabahConfig): Promise<void> {
    await muhasabahVault.actions.put(MUHASABAH_CONFIG_ID, normalizeMuhasabahConfig(next));
    requestReminderReschedule();
  },

  /** Saves tonight's review; stamps the first completion (drives the one-time reminder offer). */
  async saveEntry(entry: MuhasabahEntry, now: Date = new Date()): Promise<void> {
    await muhasabahVault.actions.put(muhasabahEntryId(entry.date), entry);
    const config = configOf(currentItems());
    if (!config.firstCompletedAt) {
      await muhasabahVault.actions.put(MUHASABAH_CONFIG_ID, {
        ...config,
        firstCompletedAt: now.toISOString(),
      });
    }
    // A reviewed night no longer needs its reminder.
    requestReminderReschedule();
  },

  async removeEntry(date: string): Promise<void> {
    await muhasabahVault.actions.remove(muhasabahEntryId(date));
  },

  /** Deletes every saved review (the config and prompts stay). */
  async removeAllEntries(): Promise<void> {
    for (const entry of entriesOf(currentItems())) {
      await muhasabahVault.actions.remove(muhasabahEntryId(entry.date));
    }
  },

  async answerReminderOffer(): Promise<void> {
    const config = configOf(currentItems());
    if (config.reminderOfferAnswered) return;
    await muhasabahVault.actions.put(MUHASABAH_CONFIG_ID, {
      ...config,
      reminderOfferAnswered: true,
    });
  },

  /**
   * Retention (plan §6): deletes entries older than `retentionDays` (0 = keep
   * forever). Runs on launch from the home card and on opening the feature.
   */
  async runRetention(now: Date = new Date()): Promise<number> {
    const state = muhasabahVault.store.getState();
    if (state.status !== "ready") return 0;
    const items = state.items;
    const expired = expiredEntryDates(
      entriesOf(items),
      getLocalDateString(now),
      configOf(items).prefs.retentionDays,
    );
    for (const date of expired) await muhasabahVault.actions.remove(muhasabahEntryId(date));
    return expired.length;
  },
};

/**
 * Read-only summary API for the NF-3.14 weekly coach: per-prompt answer counts
 * for one week, read straight from the vault. Returns `null` when the vault
 * can't be opened on this device (the coach then skips muhasabah rules, plan
 * §6). Text fields never leave this function.
 */
export async function readMuhasabahWeekSummary(
  weekStart: string,
): Promise<MuhasabahWeekSummary | null> {
  try {
    const doc = await vault.read<MuhasabahItem>("muhasabah");
    return summarizeMuhasabahWeek(entriesOf(liveItems(doc)), weekStart);
  } catch {
    return null;
  }
}
