/**
 * Plan §12 evidence register (D11): every Qur'an / hadith ref the app renders
 * by reference, collected into one typed list and checked so a typo'd ref
 * fails CI.
 *
 * - Qur'an refs and the bundled hadith collections (Nawawi 40, Riyad
 *   as-Salihin) must resolve in the BUNDLED corpus (`assets/data`).
 * - Remote collections (Bukhari, Muslim, Abu Dawud, Tirmidhi, …) get the
 *   format + known-range check from `content-verification.ts`; their text is
 *   recorded in the feature's proof log, so each such ref must also appear in
 *   that proof log (as the corpus id `muslim:1688`, or "Bukhari 645" for the
 *   collections whose corpus numbers equal the printed ones).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  type EvidenceRegistryEntry,
  isBundledHadithCollection,
  parseCorpusId,
  refFormatIssue,
  refKey,
  type VerifiableRef,
} from "@munib-tracker/shared/content/content-verification";
import { SHARED_EVIDENCE_REGISTRY } from "@munib-tracker/shared/content/evidence-registry";

import { FAMILY_EVIDENCE } from "@/app/family/index";
import { FAMILY_TIES_EVIDENCE } from "@/app/family-ties/index";
import { MUHASABAH_EVIDENCE } from "@/app/muhasabah/index";
import { PARTNER_EVIDENCE } from "@/components/circles/partner/partner-circle-view";
import { DEBTS_EVIDENCE } from "@/components/debts/debts-screen-body";
import { FOCUS_LOCK_EVIDENCE } from "@/components/focus-lock/focus-lock-evidence";
import { MASJID_EVIDENCE_REFS } from "@/components/masjid/masjid-evidence";
import { MIRATH_EVIDENCE } from "@/components/mirath/mirath-calculator";
import type { EvidenceItem } from "@/components/records/evidence-card";
import type { EvidenceRef } from "@/components/self-review/evidence-links";
import { WASIYYAH_EVIDENCE } from "@/components/wasiyyah/wasiyyah-overview";
import { KHATM_MOTIVATION_POOL } from "@/lib/khatm-motivation";
import { KNOWLEDGE_HADITH_IDS, KNOWLEDGE_QURAN_AYAHS } from "@/lib/knowledge-card-data";
import { MASJID_EVIDENCE } from "@/lib/masjid";
import { RAWATIB_EVIDENCE } from "@/lib/rawatib";
import { TAJWEED_COACHING_EVIDENCE } from "@/lib/tajweed-coaching/evidence";
import { TASBEEH_DESIGN_NOTES } from "@/lib/tasbeeh/design-notes";

// Only the exported evidence constants are read; the screens' native deps are stubbed.
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("react-native-quick-crypto", () => require("react-native-quick-crypto/jest"));
jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);
jest.mock(
  "@/lib/quran-companion/reschedule",
  () => require("@/test-support/mocks/reminder-reschedule").reminderRescheduleMock,
);

const ASSETS = join(__dirname, "../../assets/data");
const PROOFS = join(__dirname, "../../../../docs/proofs");

// ── app-side evidence cards → registry entries ──────────────────────────────

function fromSelfReview(refs: readonly EvidenceRef[], source: string, proof: string) {
  const proofs = [proof];
  return refs.map(
    (r): EvidenceRegistryEntry => ({
      ref:
        r.kind === "quran"
          ? { kind: "quran", surah: r.surah, ayah: r.ayah }
          : { kind: "hadith", collection: r.collection, number: Number(r.number) },
      source,
      proofs,
    }),
  );
}

function fromEvidenceItems(items: readonly EvidenceItem[], source: string, proof: string) {
  return items.flatMap((item): EvidenceRegistryEntry[] =>
    item.quran
      ? [
          {
            ref: { kind: "quran", ...item.quran },
            source: `${source}.${item.key}`,
            proofs: [proof],
          },
        ]
      : [],
  );
}

function fromCorpusIds(ids: readonly string[], source: string, proof: string | null) {
  return ids.map((id): EvidenceRegistryEntry => {
    const ref = parseCorpusId(id);
    if (!ref) throw new Error(`${source}: malformed corpus id "${id}"`);
    return { ref, source, proofs: proof ? [proof] : [] };
  });
}

/** The whole register: shared catalogs + the app's evidence cards. */
const REGISTRY: readonly EvidenceRegistryEntry[] = [
  ...SHARED_EVIDENCE_REGISTRY,
  ...fromSelfReview(FAMILY_EVIDENCE, "family", "docs/proofs/family-kids.md"),
  ...fromSelfReview(FAMILY_TIES_EVIDENCE, "familyTies", "docs/proofs/silat-al-rahim.md"),
  ...fromSelfReview(MUHASABAH_EVIDENCE, "muhasabah", "docs/proofs/muhasabah.md"),
  ...fromSelfReview(PARTNER_EVIDENCE, "partner", "docs/proofs/accountability-partner.md"),
  ...fromSelfReview(MASJID_EVIDENCE_REFS, "masjids", "docs/proofs/masjid-finder.md"),
  ...fromSelfReview(
    TAJWEED_COACHING_EVIDENCE,
    "tajweedCoaching",
    "docs/proofs/tajweed-coaching.md",
  ),
  ...fromSelfReview(
    Object.values(MASJID_EVIDENCE).map((r) => ({ ...r, labelKey: "" })),
    "masjid.lib",
    "docs/proofs/masjid-finder.md",
  ),
  ...fromEvidenceItems(FOCUS_LOCK_EVIDENCE, "focusLock", "docs/proofs/focus-lock.md"),
  ...fromEvidenceItems(MIRATH_EVIDENCE, "mirath", "docs/proofs/mirath.md"),
  ...fromEvidenceItems(DEBTS_EVIDENCE, "debts", "docs/proofs/debts.md"),
  ...fromEvidenceItems(WASIYYAH_EVIDENCE, "wasiyyah", "docs/proofs/wasiyyah.md"),
  ...fromCorpusIds(Object.values(RAWATIB_EVIDENCE), "rawatib", "docs/proofs/rawatib.md"),
  ...Object.entries(TASBEEH_DESIGN_NOTES).flatMap(([design, note]) =>
    (note?.refs ?? []).map(
      (r): EvidenceRegistryEntry => ({
        ref: { kind: "hadith", collection: r.collection, number: r.number },
        source: `tasbeehDesigns.${design}`,
        proofs: ["docs/proofs/tasbeeh-designs.md"],
      }),
    ),
  ),
  // Older bundled-corpus pools (no per-feature proof log): corpus check only.
  ...KHATM_MOTIVATION_POOL.flatMap((entry): EvidenceRegistryEntry[] => {
    if (entry.kind === "hadith") return fromCorpusIds([entry.id], "khatmMotivation", null);
    if (entry.kind === "quran") {
      const { surah, ayah } = entry;
      return [{ ref: { kind: "quran", surah, ayah }, source: "khatmMotivation", proofs: [] }];
    }
    return [];
  }),
  ...KNOWLEDGE_QURAN_AYAHS.map(
    ({ surah, ayah }): EvidenceRegistryEntry => ({
      ref: { kind: "quran", surah, ayah },
      source: "knowledgeCard",
      proofs: [],
    }),
  ),
  ...fromCorpusIds(KNOWLEDGE_HADITH_IDS, "knowledgeCard", null),
];

// ── bundled corpus ──────────────────────────────────────────────────────────

const surahCache = new Map<number, Record<string, string>>();
function bundledSurah(surah: number): Record<string, string> {
  let ayahs = surahCache.get(surah);
  if (!ayahs) {
    const pad = String(surah).padStart(3, "0");
    ayahs = JSON.parse(readFileSync(join(ASSETS, `quran/arabic/${pad}.json`), "utf8")) as Record<
      string,
      string
    >;
    surahCache.set(surah, ayahs);
  }
  return ayahs;
}

const BUNDLED_HADITH_FILES: Record<string, string> = {
  nawawi40: "hadith/nawawi40.json",
  riyad_assalihin: "hadith/riyad-as-salihin.json",
};
const hadithIdCache = new Map<string, Set<string>>();
function bundledHadithIds(collection: string): Set<string> {
  let ids = hadithIdCache.get(collection);
  if (!ids) {
    const file = BUNDLED_HADITH_FILES[collection];
    if (!file) throw new Error(`no bundled file for ${collection}`);
    const data = JSON.parse(readFileSync(join(ASSETS, file), "utf8")) as {
      items: { id: string }[];
    };
    ids = new Set(data.items.map((item) => item.id));
    hadithIdCache.set(collection, ids);
  }
  return ids;
}

function corpusIssue(ref: VerifiableRef): string | null {
  const format = refFormatIssue(ref);
  if (format) return format;
  if (ref.kind === "quran") {
    const ayahs = bundledSurah(ref.surah);
    for (let a = ref.ayah; a <= (ref.ayahTo ?? ref.ayah); a += 1) {
      if (!ayahs[String(a)]) return `Qur'an ${ref.surah}:${a} is not in the bundled text`;
    }
    return null;
  }
  if (isBundledHadithCollection(ref.collection)) {
    return bundledHadithIds(ref.collection).has(refKey(ref))
      ? null
      : `${refKey(ref)} is not in the bundled collection`;
  }
  return null;
}

// ── proof logs ──────────────────────────────────────────────────────────────

/** Collections whose corpus numbers equal the printed (sunnah.com) numbers. */
const PRINTED_NAME: Record<string, RegExp> = {
  bukhari: /Bukhari/,
  abudawud: /Abu Dawud|Abi Dawud/,
  tirmidhi: /Tirmidhi/,
  nasai: /Nasa'i/,
  ibnmajah: /Ibn Majah/,
};

const proofCache = new Map<string, string>();
function proofText(path: string): string {
  let text = proofCache.get(path);
  if (text == null) {
    text = readFileSync(join(PROOFS, path.replace(/^docs\/proofs\//, "")), "utf8");
    proofCache.set(path, text);
  }
  return text;
}

function recordedIn(text: string, ref: VerifiableRef): boolean {
  if (text.includes(refKey(ref))) return true;
  if (ref.kind === "quran") {
    return new RegExp(`(^|[^\\d:])${ref.surah}:${ref.ayah}(?!\\d)`).test(text);
  }
  const name = PRINTED_NAME[ref.collection];
  if (!name) return false;
  // "Bukhari 645", "Bukhari 1180, 1182", "Tirmidhi 415/423", "Abu Dawud 2894; …".
  const list = new RegExp(`${name.source}[^\\n]{0,40}?(^|[^\\d])${ref.number}(?!\\d)`);
  return list.test(text);
}

// ── tests ───────────────────────────────────────────────────────────────────

const label = (e: EvidenceRegistryEntry) => `${e.source} → ${refKey(e.ref)}`;

describe("evidence register (plan §12)", () => {
  it("collects the shared catalogs and the app's evidence cards", () => {
    expect(SHARED_EVIDENCE_REGISTRY.length).toBeGreaterThan(50);
    const sources = new Set(REGISTRY.map((e) => e.source.split(/[.:]/)[0]));
    for (const s of ["fiqh", "umrah", "coach", "family", "masjids", "focusLock", "mirath"]) {
      expect(sources).toContain(s);
    }
  });

  it.each(REGISTRY.map((e) => [label(e), e] as const))("%s resolves", (_label, entry) => {
    expect(corpusIssue(entry.ref)).toBeNull();
  });

  it.each(
    REGISTRY.filter((e) => e.proofs.length > 0).map(
      (e) => [`${label(e)} (${e.proofs.join(" | ")})`, e] as const,
    ),
  )("%s is recorded in its proof log", (_label, entry) => {
    expect(entry.proofs.some((proof) => recordedIn(proofText(proof), entry.ref))).toBe(true);
  });

  it("rejects malformed or out-of-range refs", () => {
    expect(corpusIssue({ kind: "quran", surah: 115, ayah: 1 })).not.toBeNull();
    expect(corpusIssue({ kind: "quran", surah: 1, ayah: 8 })).not.toBeNull();
    expect(corpusIssue({ kind: "hadith", collection: "bukhri", number: 1 })).not.toBeNull();
    expect(corpusIssue({ kind: "hadith", collection: "tirmidhi", number: 9999 })).not.toBeNull();
    expect(corpusIssue({ kind: "hadith", collection: "nawawi40", number: 43 })).not.toBeNull();
    expect(corpusIssue({ kind: "hadith", collection: "riyad_assalihin", number: 1896 })).toBeNull();
    expect(parseCorpusId("bukhari:64a")).toBeNull();
  });
});
