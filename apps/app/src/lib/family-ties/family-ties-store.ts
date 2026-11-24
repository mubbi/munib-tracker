import type {
  ContactKind,
  FamilyTiesItem,
  FamilyTiesSettings,
  FamilyTiesSummary,
  Relative,
  RelativeContactLog,
} from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useMemo } from "react";

import { createId } from "@/db/id";
import { requestReminderReschedule } from "@/lib/quran-companion/reschedule";
import { createVaultStore, liveItems, type VaultRecord, vault } from "@/lib/vault";

import { mergeRelativesDocs } from "./merge";
import {
  applyContact,
  clampCadence,
  FAMILY_TIES_SETTINGS_ID,
  isContactLog,
  isFamilyTiesSettings,
  isRelative,
  lastContactFromLogs,
  normalizeFamilyTiesSettings,
  RELATIVE_NAME_MAX_LENGTH,
  RELATIVE_NOTES_MAX_LENGTH,
  summarizeFamilyTies,
} from "./model";

/**
 * Relatives vault document (`relatives`, D2 extension): `relative` items, one
 * `log` item per contact and a `settings` item, merged by
 * {@link mergeRelativesDocs}. Names and numbers stay inside the vault.
 */
export const relativesVault = createVaultStore<FamilyTiesItem>("relatives", {
  merge: mergeRelativesDocs,
});

export type RelativeRecord = VaultRecord<Relative>;
export type ContactLogRecord = VaultRecord<RelativeContactLog>;
type Items = readonly VaultRecord<FamilyTiesItem>[];

export function relativesOf(items: Items): RelativeRecord[] {
  return (items.filter(isRelative) as RelativeRecord[]).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

/** Contact logs newest first. */
export function logsOf(items: Items): ContactLogRecord[] {
  return (items.filter(isContactLog) as ContactLogRecord[]).sort(
    (a, b) => b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt),
  );
}

export function settingsOf(items: Items): FamilyTiesSettings {
  return normalizeFamilyTiesSettings(items.find(isFamilyTiesSettings));
}

export function useFamilyTies() {
  relativesVault.useEnsureLoaded();
  const items = relativesVault.useItems();
  const { status, error } = relativesVault.useStatus();
  return useMemo(
    () => ({
      relatives: relativesOf(items),
      logs: logsOf(items),
      settings: settingsOf(items),
      status,
      error,
    }),
    [items, status, error],
  );
}

export function useRelative(id: string | undefined): RelativeRecord | undefined {
  const item = relativesVault.useItem(id ?? "");
  return isRelative(item) ? (item as RelativeRecord) : undefined;
}

export type RelativeInput = Pick<
  Relative,
  "name" | "kinship" | "phone" | "cadenceDays" | "notes" | "paused" | "deceased"
>;

function cleanInput(input: RelativeInput): RelativeInput {
  const phone = input.phone?.trim();
  const notes = input.notes?.trim().slice(0, RELATIVE_NOTES_MAX_LENGTH);
  return {
    name: input.name.trim().slice(0, RELATIVE_NAME_MAX_LENGTH),
    kinship: input.kinship,
    cadenceDays: clampCadence(input.cadenceDays),
    ...(phone ? { phone } : {}),
    ...(notes ? { notes } : {}),
    ...(input.paused ? { paused: true } : {}),
    ...(input.deceased ? { deceased: true } : {}),
  };
}

function getRelative(id: string): RelativeRecord | undefined {
  const item = relativesVault.store.getState().doc.items[id];
  return item && !item.deletedAt && isRelative(item) ? (item as RelativeRecord) : undefined;
}

function strip(record: RelativeRecord): Relative {
  const { id: _id, updatedAt: _u, deletedAt: _d, ...relative } = record;
  return relative;
}

export const familyTiesActions = {
  async addRelative(input: RelativeInput, now: Date = new Date()): Promise<string> {
    const id = createId("rel");
    await relativesVault.actions.put(id, {
      type: "relative",
      ...cleanInput(input),
      createdAt: now.toISOString(),
    });
    requestReminderReschedule();
    return id;
  },

  async updateRelative(id: string, input: RelativeInput): Promise<void> {
    const existing = getRelative(id);
    if (!existing) return;
    const base = strip(existing);
    // Optional fields cleared in the form must actually disappear.
    const { phone: _p, notes: _n, paused: _pa, deceased: _de, ...kept } = base;
    await relativesVault.actions.put(id, { ...kept, ...cleanInput(input) });
    requestReminderReschedule();
  },

  /** Removes a relative and their contact history. */
  async removeRelative(id: string): Promise<void> {
    const logs = logsOf(relativesVault.store.getState().items).filter((l) => l.relativeId === id);
    for (const log of logs) await relativesVault.actions.remove(log.id);
    await relativesVault.actions.remove(id);
    requestReminderReschedule();
  },

  /**
   * Logs a call / visit / message / gift / dua. A dua resets the due date only
   * for cadences ≥ 30 days. Returns the log id (for "Undo" → `removeLog`), or
   * `null` when the relative no longer exists.
   */
  async logContact(
    relativeId: string,
    contact: ContactKind,
    date: string = getLocalDateString(),
  ): Promise<string | null> {
    const existing = getRelative(relativeId);
    if (!existing) return null;
    const logId = createId("log");
    await relativesVault.actions.put(logId, { type: "log", relativeId, date, contact });
    const base = strip(existing);
    const next = applyContact(base, contact, date);
    if (next !== base) await relativesVault.actions.put(relativeId, next);
    requestReminderReschedule();
    return logId;
  },

  /** Removes one log entry and recomputes that relative's last contact. */
  async removeLog(logId: string): Promise<void> {
    const items = relativesVault.store.getState().items;
    const log = logsOf(items).find((l) => l.id === logId);
    if (!log) return;
    await relativesVault.actions.remove(logId);
    const relative = getRelative(log.relativeId);
    if (!relative) return;
    const remaining = logsOf(relativesVault.store.getState().items);
    const lastContact = lastContactFromLogs(relative.id, strip(relative), remaining);
    const { lastContact: _old, ...rest } = strip(relative);
    await relativesVault.actions.put(relative.id, lastContact ? { ...rest, lastContact } : rest);
    requestReminderReschedule();
  },

  async saveSettings(settings: Omit<FamilyTiesSettings, "type">): Promise<void> {
    await relativesVault.actions.put(
      FAMILY_TIES_SETTINGS_ID,
      normalizeFamilyTiesSettings({ type: "settings", ...settings }),
    );
    requestReminderReschedule();
  },
};

/**
 * Read-only summary API for the NF-3.14 coach (and anything else that needs
 * counts): read straight from the vault. `null` when the vault can't be opened
 * on this device. Never returns names, numbers or notes.
 */
export async function readFamilyTiesSummary(
  asOf: string = getLocalDateString(),
): Promise<FamilyTiesSummary | null> {
  try {
    const items = liveItems(await vault.read<FamilyTiesItem>("relatives"));
    return summarizeFamilyTies(relativesOf(items), logsOf(items), asOf);
  } catch {
    return null;
  }
}
