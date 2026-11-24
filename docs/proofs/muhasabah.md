# Proof log: Nightly muhasabah (NF-3.6)

- **Feature:** a private, about-60-second nightly self-review: read-only Salah recap, 3–6 Yes / Partly / No prompts, an optional gratitude line, optional repentance (text optional) with Sayyid al-Istighfar, and one intention for tomorrow. Stored in the end-to-end-encrypted vault (D2).
- **Code:** `apps/app/src/lib/muhasabah/*`, `apps/app/src/components/muhasabah/*`, `apps/app/src/app/muhasabah/*`, `apps/app/src/components/self-review/*`; types in `packages/shared/src/types/muhasabah.ts`.
- **Review:** AI proof-backed review (D11), 2026-11-23.
- **Scripture in the UI:** none typed. Sayyid al-Istighfar is rendered from the bundled Hisnul Muslim / adhkar corpus by id (`morning-sayyid-al-istighfar` in `packages/shared/src/content/zikr.ts`, the same text as `hisn-79` in `duas.ts`). Evidence rows are i18n topic labels plus links into the Qur'an reader (`/quran/59?ayah=18`) and the hadith collections (`/hadith/<collection>?q=<number>`); the source text is shown only by the readers, from the corpora.

## How the references were checked

1. **Qur'an:** the bundled Uthmani text and Pickthall translation in `apps/app/assets/data/quran/{arabic,translation/en-pickthall}/059.json`.
2. **Hadith:** the app's remote corpus, `fawazahmed0/hadith-api@1` (the CDN `apps/app/src/api/hadith-remote.ts` loads): `editions/{eng,ara}-bukhari/6306.json` and `editions/{eng,ara}-tirmidhi/2459.json`, fetched 2026-11-23.
3. **Numbering:** for both refs the corpus `hadithnumber` equals `arabicnumber` (Bukhari Book 80 "Invocations" spans 6304–6411 in both; Tirmidhi Book 37 spans 2415–2522 in both), so the plan's numbers are the corpus ids. No Sahih Muslim refs are used (the Abd al-Baqi pitfall does not apply).

## 1. Claim: reflecting on one's deeds and what one sends ahead is commanded

| Ref                     | Checked                                                                                                                                                        | Result                                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Qur'an 59:18 (Al-Hashr) | Bundled Arabic «يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُواْ ٱتَّقُواْ ٱللَّهَ وَلۡتَنظُرۡ نَفۡسٞ مَّا قَدَّمَتۡ لِغَدٖ…»; Pickthall: "…let every soul look to that which it sendeth on before for the morrow…". | Verified. Used as the primary basis; linked, not quoted, in the app (`muhasabah.evidence.quran`). |

## 2. Claim: "Take account of yourselves before you are taken to account" — the saying of Umar (ra)

| Ref           | Corpus id                             | What was checked                                                                                                                                                                                                                                                                                                         | Grading                                                                                                                                                                                                                                                       |
| ------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tirmidhi 2459 | `tirmidhi:2459` (Book 37, in-book 45) | The **marfu' hadith** of Shaddad ibn Aws: «الْكَيِّسُ مَنْ دَانَ نَفْسَهُ وَعَمِلَ لِمَا بَعْدَ الْمَوْتِ…». After it al-Tirmidhi explains «مَنْ دَانَ نَفْسَهُ» as «حَاسَبَ نَفْسَهُ فِي الدُّنْيَا قَبْلَ أَنْ يُحَاسَبَ يَوْمَ الْقِيَامَةِ», then writes «وَيُرْوَى عَنْ عُمَرَ بْنِ الْخَطَّابِ قَالَ حَاسِبُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُحَاسَبُوا وَتَزَيَّنُوا لِلْعَرْضِ الأَكْبَرِ…», and a similar saying of Maymun ibn Mihran. | The marfu' hadith: al-Tirmidhi «حَسَنٌ»; **Ahmad Shakir: Da'if; al-Albani: Da'if; Zubair Ali Zai: Da'if** (corpus `grades`). Umar's saying: reported by al-Tirmidhi **without a chain** («وَيُرْوَى», mu'allaq), so it carries no grading of its own in this source. |

**Findings vs. the plan:**

- The plan's description is accurate: Umar's words are an athar recorded _under_ Tirmidhi 2459, not the hadith itself. The app labels it "Umar ibn al-Khattab's saying … recorded by al-Tirmidhi after hadith 2459 (his statement, not a hadith)" (`muhasabah.evidence.umar`). The link opens `tirmidhi:2459`, where the reader shows the hadith, its gradings and al-Tirmidhi's note with Umar's words.
- The hadith of Shaddad ibn Aws itself is graded **da'if by the three graders in the corpus** (al-Tirmidhi's own verdict is hasan). The app therefore **does not cite the Shaddad hadith as evidence** — only Umar's saying, presented as his statement. The feature's basis is Qur'an 59:18.
- Umar's saying is well known with chains in other works (e.g. Ibn Abi Shaybah's _Musannaf_ and Ahmad's _al-Zuhd_); those editions and pages were **not verified in this review**, so the app makes no claim about its chain beyond "recorded by al-Tirmidhi".

## 3. Claim: Sayyid al-Istighfar is the best form of seeking forgiveness

| Ref                                                 | Corpus id                                         | What was checked                                                                                                                                                                                                  | Grading                  |
| --------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| Bukhari 6306                                        | `bukhari:6306` (Book 80 "Invocations", in-book 3) | Shaddad ibn Aws: «سَيِّدُ الاِسْتِغْفَارِ أَنْ تَقُولَ اللَّهُمَّ أَنْتَ رَبِّي…»; whoever says it by day with conviction and dies before evening, or by night and dies before morning, is of the people of Paradise. Number and text match. | Sahih (Sahih al-Bukhari) |
| (bundled) `morning-sayyid-al-istighfar` / `hisn-79` | `packages/shared/src/content/zikr.ts`, `duas.ts`  | The rendered Arabic, transliteration and translation come from the Hisnul Muslim dataset; its reference field reads "al-Bukhari No. 6306" / "Al-Bukhârî [6306](7/150)". The Arabic matches the corpus wording.    | —                        |

Used for: screen 4 shows this card and a "I read Sayyid al-Istighfar" check (`readIstighfar`). The app makes no reward claim of its own; the virtue text shown is the dataset's.

## 4. Product rules derived from the sources (and from plan §2)

- **No score, no judgement.** Muhasabah is between the person and Allah; the app keeps per-prompt counts only (30-day bars), never an overall score, never compares with others. Copy never says "failed"; a missed Salah line reads "Make it up when you can and ask Allah's forgiveness".
- **Repentance stays private.** The person can keep only the fact of repentance (`saveRepentText: false`). Notifications are generic ("A minute with yourself before sleep") and never include prompts, answers or text. The NF-3.14 coach reads aggregated counts only (`summarizeMuhasabahWeek`, `readMuhasabahWeekSummary`).
- **Excused periods (hayd / illness / travel):** the review still runs (plan §6); the Salah screen shows a rest message instead of counts.
- **Prompt wording:** two catalog prompts were rephrased so that "Yes" is always the good answer (consistent trends): "Did I waste time I'd regret?" → "Did I spend my time on things I won't regret?", "Was there anger I didn't control?" → "Did I keep my anger in check?". These are reflective questions, not rulings, and need no source.
- **Madhhab:** no ruling in this feature differs between the schools; `useMadhhab()` is not needed.

## 5. Not asserted

- No claim about specific rewards for nightly self-review beyond the sources above.
- No claim that the nightly review is obligatory or has a set form; it is presented as a recommended practice of self-accountability.
