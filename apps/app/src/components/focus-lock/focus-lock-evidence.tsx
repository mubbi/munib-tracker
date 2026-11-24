import { EvidenceCard, type EvidenceItem } from "@/components/records/evidence-card";

/**
 * Evidence for NF-3.13 (plan §12), verified in `docs/proofs/focus-lock.md`.
 * Lines paraphrase the meaning and deep-link the ayah in the bundled corpus —
 * no scripture text is typed here.
 */
export const FOCUS_LOCK_EVIDENCE: readonly EvidenceItem[] = [
  { key: "focusLock.evidence.jumuah", quran: { surah: 62, ayah: 9 } },
  { key: "focusLock.evidence.khushu", quran: { surah: 23, ayah: 1 } },
  { key: "focusLock.evidence.heedless", quran: { surah: 107, ayah: 4 } },
];

export function FocusLockEvidence() {
  return <EvidenceCard titleKey="focusLock.evidence.title" items={FOCUS_LOCK_EVIDENCE} />;
}
