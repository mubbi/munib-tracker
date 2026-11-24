import type { EvidenceRef } from "@/components/self-review/evidence-links";

/**
 * Why tajweed practice matters (NF-3.15), by reference only — no scripture is
 * typed. Verified in `docs/proofs/tajweed-coaching.md` and registered in
 * `lib/evidence-registry.test.ts` (Qur'an 73:4 and Riyad as-Salihin 315 both
 * resolve in the bundled corpus).
 */
export const TAJWEED_COACHING_EVIDENCE: readonly EvidenceRef[] = [
  { kind: "quran", surah: 73, ayah: 4, labelKey: "tajweedCoaching.evidence.tartil" },
  {
    kind: "hadith",
    collection: "riyad_assalihin",
    number: "315",
    labelKey: "tajweedCoaching.evidence.twoRewards",
  },
];
