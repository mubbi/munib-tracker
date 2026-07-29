import { SAHABA_CATEGORY_ORDER, SAHABA_PROFILES } from "@munib-tracker/shared/content/sahaba";
import type { SahabaCategory, SahabaProfile } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

/**
 * English corpus is statically imported with the `/sahaba` route chunk.
 * Lazy `import()` left the hub empty/partial on first paint.
 */
export function isSahabaContentReady(): boolean {
  return true;
}

export function ensureSahabaContent(): Promise<void> {
  return Promise.resolve();
}

export function getSahabaProfiles(): SahabaProfile[] {
  return localizeList(SAHABA_PROFILES, overlayList("SAHABA_PROFILES"));
}

export function getSahabaCategoryOrder(): readonly SahabaCategory[] {
  return SAHABA_CATEGORY_ORDER;
}

export function getSahabaProfile(id: string | undefined): SahabaProfile | undefined {
  if (!id) return undefined;
  return getSahabaProfiles().find((profile) => profile.id === id);
}

export function getSahabaProfilesByCategory(): Record<SahabaCategory, SahabaProfile[]> {
  const grouped = Object.fromEntries(
    getSahabaCategoryOrder().map((category) => [category, [] as SahabaProfile[]]),
  ) as Record<SahabaCategory, SahabaProfile[]>;
  for (const profile of getSahabaProfiles()) {
    for (const category of profile.categories) {
      grouped[category]?.push(profile);
    }
  }
  return grouped;
}

/** Map sahaba profile ids → battles/figures ids when they differ. */
export const SAHABA_TO_BATTLES_FIGURE: Partial<Record<string, string>> = {
  "abu-bakr": "abu-bakr",
  umar: "umar",
  ali: "ali",
  hamza: "hamza",
  "khalid-ibn-al-walid": "khalid",
  "saad-ibn-abi-waqqas": "saad",
  "salman-al-farisi": "salman",
};

export function getBattlesFigureIdForSahaba(sahabaId: string): string | undefined {
  return SAHABA_TO_BATTLES_FIGURE[sahabaId];
}
