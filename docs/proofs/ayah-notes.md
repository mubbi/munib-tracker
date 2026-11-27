# Proof log: Ayah personal notes & annotations (NF-3.21, D15 / D24)

- **Feature:** personal notes ("My note"), highlights (5 colours, whole ayah or a word span), tags, a notes list with search/filters, export, Bookmarks hub + universal search entries. Synced as the normal blob entity `quran_notes` (D15 — not the vault).
- **Code:** `packages/shared/src/types/quran-notes.ts`, `packages/shared/src/utils/quran-notes.ts` (merge, tags, textHash, export, payload guard), `apps/app/src/stores/quran-notes-store.ts`, `apps/app/src/lib/quran-notes/*`, `apps/app/src/components/quran/{ayah-note-sheet,ayah-annotations,mushaf-annotations,quran-notes-sheet-host,my-note-card,my-notes-section,quran-notes-side-panel,annotation-swatches}.tsx`, `apps/app/src/app/quran/notes.tsx`, API guard `apps/api/src/sync/dto/quran-notes-payload.validator.ts`.
- **Review:** AI proof-backed review (D11), 2026-11-23.
- **Scripture in the UI:** none is typed. Notes are the user's own text. Ayah text appears only by reference from the bundled corpus (`apps/app/assets/data/quran/arabic/*.json`) — in the word picker of the editor and, when the user opts in, in an export, followed by the edition credit.

## 1. Claim: the Qur'an invites reflection on its verses (the reason to reflect and write)

Used for: the feature's rationale only (plan "Islamic basis"). No ayah text or translation is shown as copy; the in-app line is "Your own reflection — not tafsir."

| Ref                         | Checked against                                | Bundled Arabic (verbatim, `arabic/038.json` / `arabic/047.json`) | Bundled translation (`translation/en-pickthall`)                                                                                                           |
| --------------------------- | ---------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Qur'an 38:29** (Sad)      | `assets/data/quran/arabic/038.json` key `"29"` | كِتَٰبٌ أَنزَلۡنَٰهُ إِلَيۡكَ مُبَٰرَكٞ لِّيَدَّبَّرُوٓاْ ءَايَٰتِهِۦ وَلِيَتَذَكَّرَ أُوْلُواْ ٱلۡأَلۡبَٰبِ          | "(This is) a Scripture that We have revealed unto thee, full of blessing, that they may ponder its revelations, and that men of understanding may reflect" |
| **Qur'an 47:24** (Muhammad) | `assets/data/quran/arabic/047.json` key `"24"` | أَفَلَا يَتَدَبَّرُونَ ٱلۡقُرۡءَانَ أَمۡ عَلَىٰ قُلُوبٍ أَقۡفَالُهَآ                          | "Will they then not meditate on the Qur'an, or are there locks on the hearts"                                                                              |

Both refs exist in the bundled corpus and the wording matches the plan's paraphrase ("that they might reflect upon its verses"; the rebuke for not pondering). Root د ب ر (_tadabbur_) appears in both (لِّيَدَّبَّرُوٓاْ / يَتَدَبَّرُونَ). No grading applies (Qur'an). No difference between the schools: the encouragement to reflect is not a fiqh ruling.

## 2. Copy rule: a note is never presented as tafsir

- Every note is labelled **"My note"** (`quranNotes.myNote`) in the reader, the action sheet, the list, the side panel, the Bookmarks hub and exports.
- The note card (`my-note-card.tsx`) is a muted personal card. It is never rendered inside `TafsirAyahSheet` and never uses the tafsir panel's styles. The editor and the list carry "Your own reflection — not tafsir."
- Export adds ayah text only from the bundled corpus (`getSurahAyahs`), never from the note body, and appends "Arabic text: Tanzil.net (Uthmani), CC BY-SA 4.0" (source per `assets/data/manifest.json` dataset `quran-core`).

## 3. Spike N1 — word boxes on the mushaf page (D15, D24)

**Question.** Can the QPC V2 page-font line renderer expose a box per word that stays aligned across font sizes, RTL, page zoom and TV scaling?

**Method.**

1. Each layout line's glyph string is one token per Quran.com item (a word with its joined pause marks, or the ayah-end marker), space-separated (`lib/quran-companion/mushaf-tokens.ts`). Rendering every token as its **own nested `Text` run** gives one box per word. A `backgroundColor` on that run is laid out _by the text engine with the glyph_, so it follows font size (A−/A+), RTL shaping, `textAlign: justify`, page zoom and the TV density scale without any `onLayout` measurement — there is nothing to re-measure.
2. Notes store word indexes into `splitAyahWords(bundledAyahText)`. To map glyph tokens to those indexes, each page is run through `mapMushafTokens` with **word counts from the same tokeniser** (`lib/quran-notes/mushaf-word-spans.ts`), so a mapped token's index _is_ the note's word index.
3. `lib/quran-notes/mushaf-word-spans.test.ts` runs this over all 604 bundled pages.

**Result (2026-11-23): PASS — 594 / 604 pages (98.3 %) map word-exactly.** Pages that do not: **11, 27, 177, 254, 262, 378, 441, 451, 452, 482** (the bundled Tanzil word split differs from the glyph tokens on at least one ayah of those pages — the known joins/splits such as 15:7-style words noted in `align-words.ts`).

**Shipped:** word-span highlights in mushaf page mode (`components/quran/mushaf-annotations.tsx`). **D24 fallback** on the 10 pages above: the lines holding a highlighted ayah are tinted instead (ayah tint on that page), never a guessed word. Covered by the "a page whose counts do not fit is flagged for the ayah-tint fallback" test.

**Not verified on device in this review:** visual alignment on iOS TextKit and Android TV hardware (no device QA in this wave). Nested-run backgrounds are the same mechanism the Qur'an practice mushaf view already ships (hide/colour single words), which is evidence but not proof — device QA is a follow-up.

## 4. Word spans and content updates (`textHash`)

- A word span is stored with `textHash = hashAyahText(bundledAyahText)` (FNV-1a 32-bit + length).
- `resolveNoteWordSpan` returns null when the hash no longer matches or the span no longer fits the word count; the reader then shows a **whole-ayah tint** (tests: `packages/shared/src/utils/quran-notes.test.ts`, `apps/app/src/lib/quran-notes/reader-annotations.test.ts`, component test "falls back to an ayah tint when the span's text hash is stale"). Nothing is silently attached to the wrong words.
- With tajweed colouring on in ayah mode, a word span is shown as an ayah tint so tajweed runs stay intact (design choice, not a content claim).

## 5. Privacy

- Notes use the normal sync entity (D15); they are reflections, not D2 records. Server guard: shape + ≈1 MB cap, constraint messages never echo note text.
- No note text in notifications (the feature has none), Sentry, logs or analytics: no `console`/`report*` call in the notes modules handles note content. Universal search over notes is local only.

## Review summary

| Item                                  | Status                                            |
| ------------------------------------- | ------------------------------------------------- |
| Qur'an 38:29 against bundled text     | Verified (number + wording)                       |
| Qur'an 47:24 against bundled text     | Verified (number + wording)                       |
| "My note" ≠ tafsir copy rule          | Implemented + tested (labels)                     |
| N1 spike                              | Pass, 594/604; D24 ayah-tint fallback on 10 pages |
| Export ayah text from corpus + credit | Implemented + tested (`formatQuranNotesExport`)   |
