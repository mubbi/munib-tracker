import { EvidenceLinks, type EvidenceRef } from "@/components/self-review/evidence-links";

/**
 * Masjid evidence by reference (docs/proofs/masjid-finder.md). Muslim uses the
 * corpus id: plan "Muslim 666" (Abd al-Baqi) = corpus `muslim:1521`.
 */
export const MASJID_EVIDENCE_REFS: readonly EvidenceRef[] = [
  { kind: "hadith", collection: "bukhari", number: "645", labelKey: "masjids.evidence.b645" },
  { kind: "hadith", collection: "muslim", number: "1521", labelKey: "masjids.evidence.m666" },
  { kind: "hadith", collection: "bukhari", number: "444", labelKey: "masjids.evidence.b444" },
];

export function MasjidEvidence() {
  return <EvidenceLinks titleKey="masjids.evidence.title" refs={MASJID_EVIDENCE_REFS} />;
}
