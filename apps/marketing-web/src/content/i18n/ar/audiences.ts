import type { AudiencePage } from "@/content/types";
import { beginnersAr } from "./audiences/beginners";
import { familiesAr } from "./audiences/families";
import { newMuslimsAr } from "./audiences/new-muslims";
import { quranLearnersAr } from "./audiences/quran-learners";

/**
 * Arabic translations (audiences). Each entry mirrors its English source
 * field for field (same slug, hrefs, dates, screenshot keys, Arabic text) with
 * translated prose — see `content/localized.ts` and `content/i18n/README.md`.
 */
export const TRANSLATIONS: readonly AudiencePage[] = [
  newMuslimsAr,
  quranLearnersAr,
  beginnersAr,
  familiesAr,
];
