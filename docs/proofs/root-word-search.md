# Proof log — NF-3.22 Arabic root-word search

Review date: 2026-11-23 (implementation and checks run 2026-11-23/24). Reviewer: AI proof-backed review (D11). Governing decisions: D12 (licences), D22 (root-word source), §13 item 4 (one-time comparison with the official download).

The feature contains **no rulings and no scripture typed by hand**. Every Arabic root, lemma and word form shown comes from the Quranic Arabic Corpus file (converted from its Buckwalter transliteration by a code-point table) or from the bundled Tanzil text (`apps/app/assets/data/quran/arabic/*.json`). Root letters in tests and the 28-letter picker are generated from the same table (`String.fromCodePoint`), never typed.

## 1. Source and provenance

| Item                     | Value                                                                                                                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dataset                  | Quranic Arabic Corpus, morphology, version 0.4 (Kais Dukes, 2011)                                                                                                             |
| File                     | `quranic-corpus-morphology-0.4.txt`                                                                                                                                           |
| sha256 (LF line endings) | `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`                                                                                                            |
| Size (LF)                | 6,181,227 bytes; 128,276 lines; 49,968 `ROOT:` tags; 77,429 words; 1,642 roots; 4,657 root/lemma pairs                                                                        |
| Pinned primary copy      | `https://media.githubusercontent.com/media/AhmedSaadi0/quran-words/a6d4217a9e1422978c367eadc833ff4883db77fb/data/quranic-corpus-morphology-0.4.txt`                           |
| Second verified mirror   | `https://media.githubusercontent.com/media/ezAldinWaez/quran-etl/6539e2de6cdbdb5ff5a97abb1666a7585540c2c3/reports/resources/quranic-corpus/quranic-corpus-morphology-0.4.txt` |

Checks run on 2026-11-23 from this machine:

- Primary copy: HTTP 200, `Content-Type: text/plain`, `Access-Control-Allow-Origin: *`, 6,181,227 bytes, LF endings. sha256 of the file as served = `910b721a…532d` (already LF).
- Second mirror (`ezAldinWaez/quran-etl`, commit `6539e2de6cdbdb5ff5a97abb1666a7585540c2c3`, path found via the GitHub tree API): HTTP 200, `Access-Control-Allow-Origin: *`, 6,309,503 bytes with CRLF endings; raw sha256 `a1d12923…8c46`; **after removing `\r` the sha256 is `910b721a…532d`**, i.e. byte-identical to the primary after LF normalisation. Both copies keep the full copyright block.
- The app (`src/lib/quran-morphology/source.ts`) hashes the LF-normalised text and rejects anything else with the typed error `morphology-hash` (file deleted). Unit tests cover: LF copy passes, CRLF copy passes, one changed byte fails.

### §13 item 4 — comparison with the official download

`https://corpus.quran.com/download/` was reachable (HTTP 200) on 2026-11-23, but the file itself is only served after submitting a contact e-mail address in a form ("To download version 0.4 of the Quranic Arabic Corpus morphological data, please enter a contact e-mail address. This is for verification purposes only…"). Submitting personal contact details to a third party is outside what an automated review may do, so the byte comparison with the official file **was not performed**. Per §13 item 4's locked fallback ("Use the second verified mirror"), provenance rests on the two independent GitHub copies above, which agree byte-for-byte after LF normalisation.

What could be compared without the e-mail form: the download page prints the file's header block. Its wording matches the file's block line for line (copyright, GNU licence, the three terms of use, "Please check updates at: http://corpus.quran.com/download"), with one difference — the page heads it "Quranic Arabic Corpus (Version 0.4)" while the file says "Quranic Arabic Corpus (morphology, version 0.4)". That is consistent with the page describing the same release. **Follow-up for a human maintainer:** download once through the form with a project address, run `sha256sum` after `tr -d '\r'`, and record the result here.

## 2. Licence terms (quoted from the file header)

> Quranic Arabic Corpus (morphology, version 0.4) · Copyright (C) 2011 Kais Dukes · License: GNU General Public License
>
> - Permission is granted to copy and distribute verbatim copies of this file, but CHANGING IT IS NOT ALLOWED.
> - This annotation can be used in any website or application, provided its source (the Quranic Arabic Corpus) is clearly indicated, and a link is made to http://corpus.quran.com to enable users to keep track of changes.
> - This copyright notice shall be included in all verbatim copies of the text, and shall be reproduced appropriately in all works derived from or containing substantial portion of this file.

The same file carries the Tanzil notice: "Tanzil Quran Text (Uthmani, version 1.0.2) · Copyright (C) 2008-2009 Tanzil.info · License: Creative Commons BY-ND 3.0 Unported", with matching verbatim/attribution terms and a link to http://tanzil.info. `corpus.quran.com/license.jsp` serves the GNU GPL version 3 text.

How the app meets each term:

| Term                               | Implementation                                                                                                                                                                                                                                                                                                                            |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Verbatim copies only, no changes   | The file is downloaded from the pinned copy and stored **exactly as downloaded** (native: `<documents>/munib-quran-morphology/`; web: Cache Storage `munib-quran-morphology-v1`). Line-ending normalisation happens in memory for hashing/parsing only. The file is never bundled, committed, edited or re-hosted (D22: no self-hosting). |
| Source clearly indicated + link    | Credits → runtime sources row "Quranic Arabic Corpus (morphology v0.4), © Kais Dukes, GNU GPL — corpus.quran.com" with a link to `https://corpus.quran.com`; the download card and every root page repeat the source line with the site. `assets/data/manifest.json` lists `quran-morphology` as `kind: "remote"`.                        |
| Notice reproduced in derived works | The full header (both QAC and Tanzil blocks, verbatim, extracted programmatically from the file) is shown on About → Credits (`QURANIC_ARABIC_CORPUS_NOTICE` in `packages/shared/src/constants/credits.ts`). The derived on-device index is built on the user's device and never distributed.                                             |
| Test fixtures                      | `src/lib/quran-morphology/__fixtures__/qac-excerpt.txt` (Al-Fatiha + Al-Baqarah 1–5) and `qac-join-split-excerpt.txt` (2:72, 15:7, 37:164) are verbatim excerpts **with the full copyright block**, as the terms require for copies.                                                                                                      |

Ruled out (from the plan, re-checked): api.quran.com v4 returns no root/lemma fields; the `mustafa0x/quran-morphology` fork is modified and has no licence of its own (D12).

## 3. Claims shown to users

| Claim / copy                                                                                                  | Source                                                                                                                                                                              | Status                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| "Words that share a root are related in form; their meaning in each ayah depends on context. See the tafsir." | Linguistic framing required by the plan's guardrail; not a ruling.                                                                                                                  | Kept verbatim on the search panel and every root page. No copy implies a root decides a ruling or interpretation.                                                        |
| Root of a word                                                                                                | QAC `ROOT:` feature on the word's stem segment.                                                                                                                                     | Looked up, never computed. Words with no `ROOT:` (particles, pronouns, some proper nouns) are shown as "No root" / "This word has no root in the Quranic Arabic Corpus". |
| Lemma of a word                                                                                               | QAC `LEM:` feature (homonym digits dropped for display only).                                                                                                                       | Displayed as converted from the dataset.                                                                                                                                 |
| Occurrence counts                                                                                             | Count of `ROOT:` tags per root (stem segments). Total 49,968 — matches the plan.                                                                                                    | Verified by `morphology:verify`.                                                                                                                                         |
| Hamza radical shown as أ                                                                                      | QAC writes every hamza radical as `A`; Arabic lexicons write it أ (e.g. أ م ن). Display convention only; lookups fold أ إ آ ء ؤ ئ ٱ ا → `A`, ى → `y`.                               | Unit-tested.                                                                                                                                                             |
| Lemma meaning ("Meaning in 2:255 (word-by-word): …")                                                          | The Quran.com word-by-word gloss of the lemma's **first real occurrence**, labelled with that ayah. Shown only when Quran.com's word split matches the bundled split for that ayah. | No dictionary meaning is authored.                                                                                                                                       |
| Buckwalter → Arabic                                                                                           | QAC extended Buckwalter table (corpus.quran.com/java/buckwalter.jsp), as code points.                                                                                               | `morphology:verify` converts all 77,429 words and aligns them with the bundled Tanzil text: 0 unaligned words.                                                           |

## 4. Alignment with the bundled text

`pnpm --filter app morphology:verify` (full dataset, run 2026-11-23): 6,236 ayahs; 6,226 one-to-one; 10 explained joins/splits (2:72, 2:181, 8:6, 13:37, 15:7, 27:20, 36:22, 37:130, 37:164, 41:47), all fully mapped; **0 unexplained mismatches; 0 words left at ayah level**. Full table: [`root-word-search-alignment.md`](./root-word-search-alignment.md) (generated). A word that cannot be aligned would be shown at ayah level, never attached to the wrong word.

## 5. Privacy and data handling

No user data. The raw file and the derived index (`DB_KEYS.quranRootIndex`, class `cache`) are device-local, never synced or backed up, rebuildable, and cleared from Settings → Data & storage → Offline data, by "Reset app data" and by account deletion. Sentry reports carry only the error code and mirror index (no query text). Root queries may be added to the existing on-device recent-searches list.

## 6. Performance (plan acceptance: lookup < 50 ms, index build < 5 s)

Measured 2026-11-24 with `src/lib/quran-morphology/root-search-benchmark.test.ts`, which is skipped in the normal test run. To run it:

```
ROOT_SEARCH_BENCH=1 pnpm --filter app exec jest --runInBand src/lib/quran-morphology/root-search-benchmark.test.ts
```

It reads the hash-checked file cached by `morphology:verify`, builds the real index from the bundled Tanzil text, reloads it from JSON the way the app does on a later launch, and times lookups. All query inputs come from the dataset (each root's Arabic letters, a sample of word forms) and are never typed. The timer is `process.hrtime`. The test fails if the p95 of query → first root page is 50 ms or more, or if the build takes 5 s or more.

**Machine:** desktop, AMD Ryzen 7 5700X3D (8 cores), 32 GB RAM, Windows 11, Node 24.21 under Jest (`--runInBand`). Two runs back to back; the table shows the range.

| Step                                                                | Result                                                        |
| ------------------------------------------------------------------- | ------------------------------------------------------------- |
| Hash check of the 6.18 MB file                                      | 35–58 ms                                                      |
| Index build (parse, index and align all 77,429 words; no UI yields) | **926–989 ms** (target < 5 s)                                 |
| Index size as JSON / `JSON.parse` reload                            | 490 KB / 7–7.5 ms                                             |
| Root lookup, all 1,642 roots typed as Arabic letters                | p50 0.002 ms, p95 0.004 ms, max 0.16 ms                       |
| Whole-word lookup, 1,830 sampled forms                              | p50 0.003 ms, p95 0.006–0.012 ms, max 0.17–0.67 ms            |
| Latin input (10 queries, e.g. `rhm`)                                | p95 0.28–0.31 ms                                              |
| Root page (`getRootOccurrences`), every root                        | p50 0.008 ms, p95 0.13 ms, max 8.5–8.9 ms                     |
| Largest root page (`Alh`, 2,851 occurrences)                        | 2.2–2.3 ms                                                    |
| **Query → first root page (the user path)**                         | **p50 0.01 ms, p95 0.13 ms, max 2.1–2.4 ms** (target < 50 ms) |
| "Did you mean" suggestions (Fuse, 2-letter input, 200 queries)      | p50 8.9–9.2 ms, p95 12–16 ms, max 17–48 ms                    |

**Reading the figures.** On this machine the lookup is about 400 times under its target at p95, and the build is about 5 times under. The "did you mean" path is the slowest part. It only runs when nothing matched, and its worst sample (48 ms) was a single outlier in one run.

**Caveat: this is not device QA.** A desktop CPU running Node's JIT is several times faster than a mid-range phone running Hermes. On a phone the build also yields to the UI (`runWhenIdle` between chunks), which adds wall-clock time but keeps the screen responsive. The margins above make the targets plausible, but they still have to be confirmed on a real mid-range Android phone and an iPhone (build time from the first-use sheet, and lookup time on the root search panel). That stays a QA follow-up.
