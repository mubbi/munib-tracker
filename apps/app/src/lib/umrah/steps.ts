import { UMRAH_STEPS, type UmrahStep } from "@munib-tracker/shared/types";

import type { AppIcon } from "@/lib/names-of-allah-ui";

/** Icon per Umrah step (concept icons — none encode direction, so none mirror in RTL). */
export const UMRAH_STEP_ICONS: Readonly<Record<UmrahStep, AppIcon>> = {
  prepare: { ios: "bag.fill", android: "luggage", web: "luggage" },
  miqat: { ios: "mappin.and.ellipse", android: "place", web: "place" },
  ihram: { ios: "tshirt.fill", android: "checkroom", web: "checkroom" },
  talbiyah: { ios: "waveform", android: "graphic_eq", web: "graphic_eq" },
  arrive_haram: { ios: "building.columns.fill", android: "mosque", web: "mosque" },
  tawaf: { ios: "arrow.triangle.2.circlepath", android: "autorenew", web: "autorenew" },
  two_rakah_behind_maqam: { ios: "figure.stand", android: "accessibility", web: "accessibility" },
  zamzam: { ios: "drop.fill", android: "water_drop", web: "water_drop" },
  sai: { ios: "figure.walk", android: "directions_walk", web: "directions_walk" },
  halq_taqsir: { ios: "scissors", android: "content_cut", web: "content_cut" },
  complete: { ios: "checkmark.seal.fill", android: "verified", web: "verified" },
};

/** Icon for the feature itself (Library row, tour, quick action). */
export const UMRAH_MODE_ICON: AppIcon = {
  ios: "arrow.triangle.2.circlepath",
  android: "autorenew",
  web: "autorenew",
};

/** 1-based position for "Step X of N" (the final "complete" screen is not counted). */
export function umrahStepNumber(step: UmrahStep): number {
  return UMRAH_STEPS.indexOf(step) + 1;
}

/** Rites the counter-bearing steps keep the screen awake for. */
export function isCounterStep(step: UmrahStep): step is "tawaf" | "sai" {
  return step === "tawaf" || step === "sai";
}

/** Number of real steps (everything before "complete"). */
export const UMRAH_STEP_COUNT = UMRAH_STEPS.length - 1;
