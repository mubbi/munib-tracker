# Proof log: Silat al-rahim — family ties reminders (NF-3.7)

- **Feature:** a private list of relatives (names, kinship, optional phone, cadence) with a priority-sorted "would love to hear from you" list, call / SMS / WhatsApp actions that log the contact, a "Make dua" action, a "Remember in dua" list for relatives who have passed away, a weekly count-only digest and one parent nudge. Stored in the end-to-end-encrypted vault (D2 extension, §4.2).
- **Code:** `apps/app/src/lib/family-ties/*`, `apps/app/src/components/family-ties/*`, `apps/app/src/app/family-ties/*`; types in `packages/shared/src/types/family-ties.ts`.
- **Review:** AI proof-backed review (D11), 2026-11-23.
- **Scripture in the UI:** none typed. Evidence rows are i18n topic labels that link to the Qur'an reader and the hadith collections (`/hadith/bukhari?q=<n>`); the readers show the corpus text.

## How the references were checked

1. **Qur'an:** bundled Uthmani Arabic and Pickthall translation, `apps/app/assets/data/quran/{arabic,translation/en-pickthall}/{004,047}.json`.
2. **Hadith:** the app's remote corpus `fawazahmed0/hadith-api@1` (`apps/app/src/api/hadith-remote.ts`): `editions/{eng,ara}-bukhari/{5971,5984,5986}.json`, fetched 2026-11-23.
3. **Numbering:** in the corpus Bukhari Book 78 ("Good Manners and Form (Al-Adab)") spans `hadithnumber` 5970–6226 and `arabicnumber` 5970–6226 — identical, so the plan's numbers are the corpus ids. No Sahih Muslim refs are used.

## 1. Claim: keeping the ties of kinship is commanded, severing them is condemned (Qur'an)

| Ref                        | Checked                                                                                                                                                                                                   | Result                                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Qur'an 4:1 (An-Nisa)       | «…وَٱتَّقُواْ ٱللَّهَ ٱلَّذِي تَسَآءَلُونَ بِهِۦ وَٱلۡأَرۡحَامَۚ إِنَّ ٱللَّهَ كَانَ عَلَيۡكُمۡ رَقِيبٗا»; Pickthall: "…Be careful of your duty toward Allah in Whom ye claim (your rights) of one another, and toward the wombs (that bare you)…". | Verified. Label: "be mindful of Allah and of the ties of kinship" (a description, not a translation). |
| Qur'an 47:22–23 (Muhammad) | 22: «فَهَلۡ عَسَيۡتُمۡ إِن تَوَلَّيۡتُمۡ أَن تُفۡسِدُواْ فِي ٱلۡأَرۡضِ وَتُقَطِّعُوٓاْ أَرۡحَامَكُمۡ»; 23: «أُوْلَـٰٓئِكَ ٱلَّذِينَ لَعَنَهُمُ ٱللَّهُ فَأَصَمَّهُمۡ وَأَعۡمَىٰٓ أَبۡصَٰرَهُمۡ».                                                                                           | Verified. The link opens 47:22; label "the warning against severing ties of kinship".                 |

## 2. Claim: keeping family ties brings blessing in provision and life

| Ref          | Corpus id                            | What was checked                                                                                  | Grading                  |
| ------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------- | ------------------------ |
| Bukhari 5986 | `bukhari:5986` (Book 78, in-book 17) | Anas ibn Malik: «مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَيُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ». Number and text match. | Sahih (Sahih al-Bukhari) |

## 3. Claim: the one who severs ties of kinship is warned

| Ref          | Corpus id                            | What was checked                                               | Grading                  |
| ------------ | ------------------------------------ | -------------------------------------------------------------- | ------------------------ |
| Bukhari 5984 | `bukhari:5984` (Book 78, in-book 15) | Jubayr ibn Mut'im: «لاَ يَدْخُلُ الْجَنَّةَ قَاطِعٌ». Number and text match. | Sahih (Sahih al-Bukhari) |

Used only as an evidence link. The app never applies this warning to the person (no "you are cutting ties" copy, no streaks); reminders are framed as "would love to hear from you".

## 4. Claim: the mother has the greatest right to good companionship, then the father

| Ref          | Corpus id                           | What was checked                                                                                                               | Grading                  |
| ------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| Bukhari 5971 | `bukhari:5971` (Book 78, in-book 2) | Abu Hurayrah: a man asked who most deserves his good companionship — «أُمُّكَ» three times, then «ثُمَّ أَبُوكَ». Number and text match. | Sahih (Sahih al-Bukhari) |

Used for: the priority weights (mother 3, father 2) and the extra parent nudge. The weights are a product heuristic inspired by this hadith (mother before father); the exact numbers are **not** a ruling and the app does not present them as one.

## 5. Product rules (plan §6) and their basis

- **Cadence defaults** (parents 2 days, grandparents / siblings 7, aunts / uncles 30, cousins 60, others 90; children 7, in-laws 30, nieces / nephews 60 by convention) are reminders the person can change, not rulings. Scholars describe silat al-rahim by custom (_'urf_) — what counts as keeping ties differs by closeness and circumstance — so the app imposes no minimum.
- **A dua does not reset the due date** unless the cadence is ≥ 30 days: dua for relatives is good, but the sources above speak of keeping ties with them (contact, kindness, help). This is the plan's rule, kept as a product choice and explained in copy ("A dua is always good, but it doesn't replace contact").
- **Deceased relatives** move to "Remember in dua" with no cadence, linked to the janazah guide's duas (`/janazah/janazah-duas-adult`, existing reviewed content).
- **In-laws (`spouse_parent`)** are included as a kinship option. Classical definitions of _rahim_ (blood relatives) do not include in-laws; they are offered because good treatment of a spouse's parents is part of good character, and the copy never calls them _rahim_. (Scholars differ on the scope of _arham_; no ruling is asserted.)
- **Privacy:** names, numbers and notes are only in the vault; notifications show a count or "A parent would love to hear from you today"; the coach API (`summarizeFamilyTies`, `readFamilyTiesSummary`) returns counts only.
- **Excused periods:** keeping family ties is not suspended by illness, travel or hayd, so the weekly digest continues; the one judgement-like nudge (a parent waiting longer than usual) is paused during an active excused period (plan §2 gentle-tone rule).
- **Madhhab:** no ruling here differs by school; `useMadhhab()` is not needed.

## 6. Not asserted

- No claim that a specific contact frequency is obligatory.
- No claim that a missed cadence is a sin.
