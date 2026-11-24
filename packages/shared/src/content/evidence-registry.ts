import type { FiqhContentRef } from "../fiqh/differences";
import { FIQH_DIFFERENCES } from "../fiqh/differences";
import { COACH_EVIDENCE } from "../utils/coach/rules";
import type { EvidenceRegistryEntry, VerifiableRef } from "./content-verification";
import { parseCorpusId } from "./content-verification";
import { DHUL_HIJJAH_EVIDENCE } from "./dhul-hijjah";
import { SUNNAH_HABITS, SUNNAH_HABITS_PRINCIPLE_REF } from "./sunnah-habits";
import { UMRAH_EVIDENCE } from "./umrah-mode";
import {
  VOLUNTARY_FAST_EVIDENCE,
  VOLUNTARY_FAST_RESTRICTION_EVIDENCE,
} from "./voluntary-fasting-evidence";

/**
 * Plan §12 evidence register, shared half: every Qur'an / hadith ref the
 * shared catalogs hand to the app for rendering by reference. Kept out of the
 * `content` barrel (it pulls in the fiqh catalog). The app adds its own
 * evidence cards and checks the whole list against the bundled corpus in
 * `apps/app/src/lib/evidence-registry.test.ts`.
 */

/** A FiqhContentRef as a verifiable ref (classical-work refs are cited by title: null). */
export function fromFiqhRef(ref: FiqhContentRef): VerifiableRef | null {
  if (ref.kind === "quran") {
    return ref.ayahTo == null
      ? { kind: "quran", surah: ref.surah, ayah: ref.ayahFrom }
      : { kind: "quran", surah: ref.surah, ayah: ref.ayahFrom, ayahTo: ref.ayahTo };
  }
  if (ref.kind === "hadith")
    return { kind: "hadith", collection: ref.collection, number: ref.number };
  return null;
}

function entries(
  refs: readonly { kind: string }[],
  source: string,
  proofs: readonly string[],
): EvidenceRegistryEntry[] {
  return refs.flatMap((r) => {
    if (r.kind !== "quran" && r.kind !== "hadith") return [];
    const ref = fromFiqhRef(r as FiqhContentRef);
    return ref ? [{ ref, source, proofs }] : [];
  });
}

function groups(
  record: Readonly<Partial<Record<string, readonly { kind: string }[]>>>,
  prefix: string,
  proofs: readonly string[],
): EvidenceRegistryEntry[] {
  return Object.entries(record).flatMap(([key, refs]) =>
    entries(refs ?? [], `${prefix}.${key}`, proofs),
  );
}

const MADHHAB_PROOF = "docs/proofs/madhhab.md";

/** Feature proof logs that verified a FIQH_DIFFERENCES row's refs (besides madhhab.md). */
const FIQH_ROW_PROOFS: ReadonlyArray<readonly [string, string]> = [
  ["mirath.", "docs/proofs/mirath.md"],
  ["wasiyyah.", "docs/proofs/wasiyyah.md"],
  ["rawatib.", "docs/proofs/rawatib.md"],
  ["masjid.", "docs/proofs/masjid-finder.md"],
  ["hayd.quranRecitation", "docs/proofs/sunnah-habits.md"],
  ["umrah.", "docs/proofs/umrah-mode.md"],
];

function fiqhProofs(id: string): string[] {
  const extra = FIQH_ROW_PROOFS.filter(([prefix]) => id.startsWith(prefix)).map(([, p]) => p);
  return [MADHHAB_PROOF, ...extra];
}

function fiqhEntries(): EvidenceRegistryEntry[] {
  return FIQH_DIFFERENCES.flatMap((diff) => {
    const proofs = fiqhProofs(diff.id);
    return [
      ...entries(diff.refs ?? [], `fiqh:${diff.id}`, proofs),
      ...Object.entries(diff.positions).flatMap(([school, position]) =>
        entries(position.refs ?? [], `fiqh:${diff.id}.${school}`, proofs),
      ),
    ];
  });
}

function coachEntries(): EvidenceRegistryEntry[] {
  return Object.entries(COACH_EVIDENCE).flatMap(([key, id]) => {
    const ref = parseCorpusId(id);
    return ref ? [{ ref, source: `coach.${key}`, proofs: ["docs/proofs/weekly-coach.md"] }] : [];
  });
}

/** Every shared-catalog ref, in catalog order (duplicates kept: each is a separate use). */
export const SHARED_EVIDENCE_REGISTRY: readonly EvidenceRegistryEntry[] = [
  ...fiqhEntries(),
  ...groups(DHUL_HIJJAH_EVIDENCE, "dhulHijjah", ["docs/proofs/dhul-hijjah.md"]),
  ...groups(UMRAH_EVIDENCE, "umrah", ["docs/proofs/umrah-mode.md"]),
  ...groups(VOLUNTARY_FAST_EVIDENCE, "fasting.recommended", ["docs/proofs/voluntary-fasting.md"]),
  ...groups(VOLUNTARY_FAST_RESTRICTION_EVIDENCE, "fasting.restricted", [
    "docs/proofs/voluntary-fasting.md",
  ]),
  ...SUNNAH_HABITS.flatMap((habit) =>
    entries(habit.refs, `sunnahHabits.${habit.id}`, ["docs/proofs/sunnah-habits.md"]),
  ),
  ...entries([SUNNAH_HABITS_PRINCIPLE_REF], "sunnahHabits.principle", [
    "docs/proofs/sunnah-habits.md",
  ]),
  ...coachEntries(),
];
