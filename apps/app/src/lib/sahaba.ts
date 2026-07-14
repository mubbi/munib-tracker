import type { SahabaCategory, SahabaProfile } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

type SahabaContent = { profiles: SahabaProfile[]; categoryOrder: readonly SahabaCategory[] };

let cache: SahabaContent | undefined;
export function isSahabaContentReady(): boolean {
  return cache !== undefined;
}
let inflight: Promise<void> | undefined;

export function ensureSahabaContent(): Promise<void> {
  if (cache) return Promise.resolve();
  if (!inflight) {
    inflight = import("@munib-tracker/shared/content/sahaba").then(
      ({ SAHABA_PROFILES, SAHABA_CATEGORY_ORDER }) => {
        cache = { profiles: SAHABA_PROFILES, categoryOrder: SAHABA_CATEGORY_ORDER };
      },
    );
  }
  return inflight;
}

export function getSahabaProfiles(): SahabaProfile[] {
  if (!cache) void ensureSahabaContent();
  return localizeList(cache?.profiles ?? [], overlayList("SAHABA_PROFILES"));
}

export function getSahabaCategoryOrder(): readonly SahabaCategory[] {
  if (!cache) void ensureSahabaContent();
  return cache?.categoryOrder ?? [];
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
