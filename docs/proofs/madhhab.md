# Proof log: "My madhhab" (NF-3.0a, D9/D11, plan §4.1)

- **Feature:** one global fiqh school (Hanafi / Shafi'i / Maliki / Hanbali / all views), typed rules for calculators, and a labelled difference catalog for guides.
- **Code:** `packages/shared/src/fiqh/madhhab-rules.ts` (`MADHHAB_RULES`), `packages/shared/src/fiqh/differences.ts` (`FIQH_DIFFERENCES`), `packages/shared/src/fiqh/resolve.ts`. The UI is in `apps/app/src/components/fiqh/*`, and the copy is in `apps/app/scripts/i18n/madhhab-i18n.json` (`fiqh.diff.<id>.*`).
- **Review:** AI proof-backed review (D11), 2026-11-23. Every school's rules carry `review: { reviewedBy: "ai-review", reviewedAt: "2026-11-23" }`. The snapshot test fails on any change to a value until this log and the stamp are updated.
- **Scope of the claims:** each row records the school's relied-upon (mu'tamad) position as stated in its standard manual. Where a school has a strong second view, the copy says so ("another view in the school…"). Where we could not source a claim with confidence, the copy says "scholars differ", or the app's choice is labelled as an app default. A school's position is never asserted as the only valid one.
- **UI disclaimer:** "For your own situation, consult a qualified scholar." (`fiqh.disclaimer`).

## 0. Sources and how they were checked

**Classical manuals.** One mukhtasar plus one relied-upon commentary per school. They are cited by title and chapter (bab), because the printed editions differ in pagination.

| School      | Matn (basic text)                                   | Commentary used for the mu'tamad                                                  |
| ----------- | --------------------------------------------------- | --------------------------------------------------------------------------------- |
| Hanafi      | al-Hidayah (al-Marghinani)                          | Radd al-Muhtar 'ala al-Durr al-Mukhtar (Ibn 'Abidin)                              |
| Shafi'i     | Minhaj al-Talibin (al-Nawawi)                       | Tuhfat al-Muhtaj (Ibn Hajar al-Haytami)                                           |
| Maliki      | Mukhtasar Khalil                                    | al-Sharh al-Kabir (al-Dardir) with Hashiyat al-Dasuqi                             |
| Hanbali     | Zad al-Mustaqni' (al-Hajjawi)                       | Kashshaf al-Qina' (al-Buhuti); al-Mughni (Ibn Qudamah) for the comparative points |
| Comparative | Bidayat al-Mujtahid (Ibn Rushd)                     | —                                                                                 |
| Faraid      | al-Sirajiyyah (Hanafi); Matn al-Rahbiyyah (Shafi'i) | —                                                                                 |

**Qur'an refs.** Each was checked against the bundled corpus, `apps/app/assets/data/quran/translation/en-pickthall/<surah>.json`. The ayah exists and its meaning matches the claim:

- 2:184 (fidyah, feeding a needy person)
- 2:203 (remember Allah in the appointed days)
- 2:222 (menstruation)
- 4:11, 4:12 and 4:176 (inheritance shares)
- 4:101 (shortening salah when travelling)
- 7:204 (listen when the Qur'an is recited)
- 9:34 (hoarding gold and silver)
- 22:28 (sacrifice on appointed days)
- 22:29 (circumambulating the House)
- 62:9 and 62:11 (Jumu'ah, and those who left the khutbah)
- 108:2 (pray and sacrifice)

**Hadith refs.** Each was checked against the corpus the app renders, `fawazahmed0/hadith-api@1` (`apps/app/src/api/hadith-remote.ts`). A ref uses the corpus `hadithnumber`. For Bukhari, Abu Dawud, Tirmidhi and Ibn Majah this equals the sunnah.com number. **Sahih Muslim's corpus numbering is sequential and differs from print**, so every Muslim ref stores the corpus number and the Abd al-Baqi number (`arabicNumber`). The two are paired by the corpus `arabicnumber` field:

| Printed (Abd al-Baqi) | Corpus id               | Content confirmed                                                                 |
| --------------------- | ----------------------- | --------------------------------------------------------------------------------- |
| Muslim 404            | `muslim:905` (404.02)   | Abu Musa: "…when he recites, be silent" (Qatada's wording)                        |
| Muslim 685            | `muslim:1570` (685.01)  | 'A'ishah: salah was prescribed as two rakahs; travel salah stayed at two          |
| Muslim 705            | `muslim:1628` (705.01)  | Ibn 'Abbas: combined Dhuhr/Asr and Maghrib/Isha without fear or journey           |
| Muslim 728            | `muslim:1694` (728.01)  | Umm Habibah: twelve rakahs a day, a house in Paradise                             |
| Muslim 985            | `muslim:2287` (985.05)  | Abu Sa'id on Mu'awiyah's half sa' of wheat for zakat al-fitr                      |
| Muslim 1155           | `muslim:2716`           | Whoever eats or drinks forgetfully, let him complete his fast                     |
| Muslim 1977           | `muslim:5119` (1977.03) | Umm Salamah: whoever intends to sacrifice should not cut hair or nails in the ten |

**Grades.** The `grade` field records the grade as follows:

- Bukhari and Muslim: `sahih`.
- Sunan hadith: the corpus grade list (Darussalam / al-Albani / Zubair 'Ali Za'i where present).
- `disputed` marks a hadith whose grade the critics differ on. Such a hadith is never the sole basis for a claim; it appears as one school's evidence.

## 1. Salah times

### asr.start: when Asr begins

- **Hanafi:** Abu Hanifa: when a thing's shadow is twice its length, not counting the noon (zawal) shadow. His two students held one length. The app records Abu Hanifa's view (`asrDefault: "hanafi"`), which matches the existing Asr `MadhabKey`. Sources: al-Hidayah, Kitab al-Salah, Bab al-Mawaqit; Radd al-Muhtar, same bab.
- **Shafi'i, Maliki, Hanbali:** one length, plus the noon shadow. Sources: Minhaj, Kitab al-Salah; Mukhtasar Khalil, Fasl al-Waqt; Zad al-Mustaqni', Bab Shurut al-Salah.
- **Evidence both sides discuss:** the hadith of Jibril leading the salah, Abu Dawud 393 (hasan) and Tirmidhi 149 (hasan sahih per al-Tirmidhi). Both are verified in the corpus.

### asr.preferred: preferred time for Asr

- **Hanafi:** delaying is mustahabb as long as the sun's disc hasn't changed (yellowed). Source: al-Hidayah, Bab al-Mawaqit (fasl on mustahabb times).
- **Other three:** praying early (ta'jil) is better. Sources: Minhaj; Mukhtasar Khalil; Zad.

### fajr.preferred: preferred time for Fajr

- **Hanafi:** isfar. Evidence: Tirmidhi 154 ("Perform Fajr at isfar, for its reward is greater"), verified. Source: al-Hidayah, Bab al-Mawaqit.
- **Other three:** taghlis. Evidence: Bukhari 578 ('A'ishah: the women returned unrecognised because of the darkness), verified. Sources: Minhaj; Mukhtasar Khalil; Zad ("wa ta'jiluha afdal").

### isha.start: when Isha begins (information only)

- **Hanafi:** Abu Hanifa defines the shafaq as the whiteness after the redness. His two students define it as the redness, and many later Hanafi fatwas follow them (Radd al-Muhtar discusses which is the fatwa view). The copy states both rather than asserting one.
- **Other three:** the red twilight. Sources: Minhaj; Mukhtasar Khalil; Zad.
- **App behaviour:** information only. The prayer-time calculation angle is unchanged.

### isha.preferred: preferred time for Isha

- **Hanafi:** delay to a third of the night (al-Hidayah).
- **Shafi'i:** praying early is better per the azhar in Minhaj; delay is the other view. The copy states both.
- **Maliki:** early is better, including for congregations; Mukhtasar Khalil delays only Dhuhr for the jama'ah.
- **Hanbali:** delay to a third of the night is better unless it is hard on the followers (Zad).
- **Evidence:** Tirmidhi 167 ("were it not a hardship on my ummah I would have ordered them to delay Isha to a third or half of the night"), hasan sahih, verified.

## 2. Witr

### witr.status: ruling of Witr

- **Hanafi:** wajib, per Abu Hanifa. Evidence used by the school: Abu Dawud 1422 ("Witr is a duty (haqq) on every Muslim"), graded sahih in the corpus, verified. The corpus also has Abu Dawud 1419 ("…whoever does not pray witr is not of us"), graded da'if; it is **not** cited. Source: al-Hidayah, Bab Salat al-Witr.
- **Other three:** sunnah mu'akkadah. Evidence used: Bukhari 46 (the man from Najd: "five salahs… is anything else due on me? No, unless you volunteer"), verified. Sources: Minhaj; Mukhtasar Khalil; Zad.

### witr.form: how Witr is prayed

- **Hanafi:** three rakahs with one salam, and qunut before ruku in the third rakah, all year (al-Hidayah).
- **Shafi'i:** minimum one, most perfect eleven; separating with a salam is better than joining. Qunut comes after ruku in the second half of Ramadan (Minhaj).
- **Maliki:** one rakah preceded by a separate two-rakah shaf'. There is no qunut in Witr; Maliki qunut is in Subh (Mukhtasar Khalil).
- **Hanbali:** minimum one, most eleven; qunut after ruku all year, and before ruku is allowed (Zad; Kashshaf).
- **Supporting evidence:** Abu Dawud 1422 (one, three or five) and Abu Dawud 1425 (the qunut words taught to al-Hasan, sahih). Both verified.

### witr.qaza: making up a missed Witr

- **Hanafi:** required, because it is wajib (al-Hidayah). This drives `qazaDefault: true` (D9 retrofit).
- **Shafi'i:** making up timed nawafil is mustahabb per the azhar (Minhaj).
- **Hanbali:** making up Witr is sunnah (Kashshaf).
- **Maliki: correction to plan §4.1.3.** The plan listed "Recommended". In Mukhtasar Khalil, Witr's daruri time runs to the Subh prayer ("wa daruriyyuhu li-l-subh"). Once Subh is prayed, no nafl is made up except the Fajr raghibah ("wa la yuqda ghayru fardin illa hiya"). The app therefore records `qaza: "not_after_fajr"`. `qazaDefault` stays false for all three non-Hanafi schools, as D9 requires.

## 3. Salah method (guide notes)

### salah.raisingHands: raising the hands

- **Hanafi:** only at the opening takbir. Evidence used: Tirmidhi 257 and Abu Dawud 748 (Ibn Mas'ud raised his hands only once). Grades differ: al-Tirmidhi says hasan, and Abu Dawud himself remarks on its wording. The grade is recorded as `disputed`.
- **Shafi'i:** at the opening, before ruku, on rising, and on standing from the first tashahhud. Evidence: Bukhari 739, verified, which includes rising from two rakahs. Source: Minhaj.
- **Maliki:** at the opening only. This is the mashhur, the riwayah of Ibn al-Qasim. Source: Mukhtasar Khalil.
- **Hanbali:** at the opening, ruku and rising. Evidence: Bukhari 735, verified. Source: Zad.

### salah.fatihaBehindImam: reciting Al-Fatihah behind the imam

- **Hanafi:** the follower does not recite.
  - Evidence: Qur'an 7:204; Muslim 404 (`muslim:905`, "when he recites, be silent"); Ibn Majah 850 ("whoever has an imam, the imam's recitation is his recitation", `disputed`).
  - Source: al-Hidayah.
- **Shafi'i:** obligatory for the follower in every rakah. Evidence: Bukhari 756, verified. Source: Minhaj (the jadid).
- **Maliki:** recited in the silent salahs (mandub), with listening in the loud ones. Source: Mukhtasar Khalil.
- **Hanbali:** recommended in the silent salahs and in the imam's pauses; not wajib. Source: Zad; Kashshaf.
- **Note on wording:** the plan said "silent prayers only" for Hanbali. The copy adds "and in the imam's pauses", per the Hanbali texts.

### salah.fajrQunut: qunut in Fajr

- **Hanafi:** not part of Fajr. Source: al-Hidayah.
- **Shafi'i:** sunnah, after the ruku of the second rakah. Evidence used: Bukhari 1001 (Anas: qunut after ruku), verified. Source: Minhaj.
- **Maliki:** mustahabb, said quietly; before ruku is better. Evidence: Bukhari 1002 (Anas: "before bowing"), verified. Source: Mukhtasar Khalil.
- **Hanbali:** not done, except qunut al-nazilah. Source: Zad.
- **Disclosure:** Bukhari 1001 also narrates qunut for a month against certain tribes. Each side reads it differently, so the catalog doesn't treat it as conclusive.

## 4. Jumu'ah, Eid, janazah

### jumuah.minCongregation: minimum congregation for Jumu'ah

- **Hanafi:** three besides the imam, per Abu Hanifa and Muhammad (al-Hidayah).
- **Shafi'i:** forty, including the imam (Minhaj).
- **Hanbali:** forty (Zad). Evidence cited by both: Abu Dawud 1069 (As'ad ibn Zurarah's first Jumu'ah with forty), hasan, verified.
- **Maliki:** twelve besides the imam (Mukhtasar Khalil). Evidence: Bukhari 936 (twelve remained when the caravan came; see Qur'an 62:11), verified.

### eid.status: ruling of the Eid salah

- **Hanafi:** wajib on those obliged to attend Jumu'ah (al-Hidayah).
- **Shafi'i:** sunnah mu'akkadah (Minhaj).
- **Maliki:** sunnah mu'akkadah (Mukhtasar Khalil).
- **Hanbali:** fard kifayah (Zad).

### eid.extraTakbirs: extra takbirs in the Eid salah

- **Hanafi:** three in each rakah. Evidence used: Abu Dawud 1153 (Abu Musa: "four, like the janazah", i.e. including the opening takbir), `disputed`, verified. This matches the shipped `eid-guide.ts`, which notes there is no separately authenticated marfu' hadith for 3+3.
- **Shafi'i:** seven and five, excluding the opening takbir and the takbir of standing.
- **Maliki and Hanbali:** six and five (seven counting the opening).
- **Evidence for the last two bullets:** Abu Dawud 1149 and 1151 (seven and five), both hasan, verified.

### janazah.fatiha: Al-Fatihah in the janazah salah

- **Hanafi:** not recited as qira'ah; thana follows the first takbir (al-Hidayah).
- **Maliki:** not recited, and it is disliked in the mashhur; praise and dua follow (Mukhtasar Khalil).
- **Shafi'i and Hanbali:** obligatory after the first takbir (Minhaj; Zad). Evidence: Bukhari 1335 (Ibn 'Abbas recited it: "so you know it is the sunnah"), verified.

## 5. Voluntary salah

### rawatib.preset: app default rawatib (D8)

- **Hanafi:** 12 rakahs, with 4 before Dhuhr. Evidence: Muslim 728 (`muslim:1694`), Tirmidhi 415 (lists the 12; hasan sahih) and Bukhari 1182 ("never left four before Dhuhr"), all verified. Source: al-Hidayah, Bab al-Nawafil.
- **Shafi'i and Hanbali:** 10 mu'akkadah, with 2 before Dhuhr. Evidence: Bukhari 1180 (Ibn 'Umar's ten), verified. Sources: Minhaj; Zad ("al-rawatib 'ashr").
- **Maliki:** Maliki texts recommend nafl before and after Dhuhr, before Asr and after Maghrib without a fixed count, plus the Fajr raghibah (Mukhtasar Khalil, Fasl al-Nafl). The **10 preset for Maliki is the app's default under locked decision D8, not a Maliki text**, and the copy (`fiqh.diff.rawatib.preset.maliki`) says so.

### tarawih.rakahs: Tarawih (information)

- **Hanafi, Shafi'i, Hanbali:** twenty (al-Hidayah; Minhaj; Zad).
- **Maliki:** twenty, while Mukhtasar Khalil also records thirty-six as the later Madinan practice. The copy gives both.
- **Supporting evidence:** Bukhari 2010 ('Umar gathering the people behind one reciter), verified. It doesn't fix a number, so it's not cited for one.

### tashriq.takbir: Takbir al-Tashriq

- **Hanafi:** wajib. The fatwa follows the two students: Fajr of the 9th to Asr of the 13th. The formula opens with two takbirs (al-Hidayah; Radd al-Muhtar).
- **Shafi'i:** sunnah. For a non-pilgrim the practice (al-'amal) is Fajr of the 9th to Asr of the 13th (Minhaj, which lists the views). Three takbirs.
- **Maliki:** sunnah, from Dhuhr of the 10th to Subh of the 4th day (the 13th). Three takbirs (Mukhtasar Khalil).
- **Hanbali:** sunnah. For a non-pilgrim: Fajr of 'Arafah to Asr of the last day of tashriq. Two takbirs (Zad).
- **Basis:** Qur'an 2:203.

## 6. Hayd and nifas (taharah)

| Claim          | Hanafi                                        | Shafi'i                                      | Maliki                                                                                                     | Hanbali                      | Source                                                                                         |
| -------------- | --------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------- |
| hayd.min       | 3 days and nights (`minHours: 72`)            | 1 day and night (24)                         | no minimum for worship (0)                                                                                 | 1 day and night (24)         | al-Hidayah, Bab al-Hayd; Minhaj, Bab al-Hayd; Mukhtasar Khalil, Fasl al-Hayd; Zad, Bab al-Hayd |
| hayd.max       | 10 days                                       | 15                                           | 15 (a beginner); a habitual woman adds up to 3 days of istizhar, never past 15 (`habitualIstizharDays: 3`) | 15                           | same                                                                                           |
| hayd.minPurity | 15                                            | 15                                           | 15                                                                                                         | 13                           | same                                                                                           |
| nifas.max      | 40                                            | 60                                           | 60                                                                                                         | 40                           | same                                                                                           |
| hayd.beyondMax | istihada: pray, with wudu for each salah time | istihada, sorted by habit or tamyiz (colour) | istihada; wudu for each salah is recommended                                                               | istihada, by habit or colour | same                                                                                           |

- **Evidence:**
  - Qur'an 2:222.
  - Bukhari 306 (Fatimah bint Abi Hubaysh: "that is a vein, not hayd"), verified.
  - The 40-day nifas: Abu Dawud 311 (hasan) and Tirmidhi 139 (hasan), both verified. They are evidence for the Hanafi and Hanbali 40. The Shafi'i and Maliki 60 rests on reported observed maxima (istiqra'), as stated in their manuals, not on a marfu' text.
- **App use:** the hayd day counter and the "beyond maximum" prompts (later wave) read `hayd.maxDays`, `minHours`, `minPurityDays` and `nifasMaxDays`. These are prompts only, never automatic edits.

## 7. Travel

### qasr.distance: distance for qasr

- **Hanafi:** three days' journey (three marahil). Evidence used: Bukhari 1086 ("a woman should not travel more than three days…"), verified. Contemporary Hanafi fatwas commonly convert this to 48 English miles ≈ 77–78 km (`qasrDistanceKmRange: [77, 78]`).
- **Shafi'i, Maliki and Hanbali:** four burud (16 farsakh, 48 Hashimi miles). Bukhari's chapter heading before no. 1086 reports Ibn 'Umar and Ibn 'Abbas shortening at four burud, but that is a mu'allaq heading, not a numbered hadith, so it isn't stored as a ref. Sources: Minhaj; Mukhtasar Khalil; Zad; Bidayat al-Mujtahid on the comparison.
- **Conversion caveat:** the metric conversion of the old mile is itself disputed (≈ 81–89 km). The calculator should treat a distance inside `qasrDistanceKmRange` as "scholars differ", and `qasrDistanceKm` is only the range's lower end.

### qasr.status: ruling of qasr

- **Hanafi:** wajib (azimah). Evidence: Muslim 685 (`muslim:1570`) and Bukhari 1090 ("prayer was prescribed as two… the travel salah was kept"), both verified. Source: al-Hidayah.
- **Shafi'i and Hanbali:** a concession; qasr is better on a journey that qualifies. Basis: Qur'an 4:101 ("no sin for you"). Sources: Minhaj; Zad.
- **Maliki:** sunnah mu'akkadah (Mukhtasar Khalil).

### qasr.residency: when a traveller becomes resident

| School  | Ruling                                                      | Code                                   | Source           |
| ------- | ----------------------------------------------------------- | -------------------------------------- | ---------------- |
| Hanafi  | intending to stay 15 days or more                           | `gte 15`                               | al-Hidayah       |
| Shafi'i | 4 full days, not counting the days of arrival and departure | `gte 4`, `residencyExcludesTravelDays` | Minhaj           |
| Maliki  | 4 full (sahih) days, ≈ 20 salahs                            | `gte 4`                                | Mukhtasar Khalil |
| Hanbali | more than 4 days (more than 20 salahs)                      | `gt 4`                                 | Zad              |

Context evidence: Bukhari 1081 (Anas: they prayed two rakahs during a ten-day stay in Makkah), verified. Each school reads it differently.

### jam.travel and jam.rain: combining

- **jam.travel:**
  - Hanafi: not allowed except at 'Arafah and Muzdalifah (al-Hidayah).
  - Shafi'i: allowed, taqdim or ta'khir (Minhaj).
  - Maliki: allowed with conditions, mainly when the traveller is moving on (jadda bihi al-sayr) (Mukhtasar Khalil).
  - Hanbali: allowed (Zad).
  - Evidence: Bukhari 1106 and 1107, verified.
- **jam.rain:**
  - Hanafi: no.
  - Shafi'i: Dhuhr with Asr and Maghrib with Isha, taqdim only, in congregation (Minhaj).
  - Maliki: Maghrib with Isha (Mukhtasar Khalil).
  - Hanbali: Maghrib with Isha in the relied-upon view (Zad).
  - Evidence the schools discuss: Muslim 705 (`muslim:1628`; Ibn 'Abbas: combined in Madinah "without fear or travel"), verified.
- **Majority label removed.** Neither row carries a "majority" label: the three non-Hanafi schools differ on the conditions. The test enforces that a majority label requires an identical value.

### travel.rawatib: rawatib while travelling

- **Hanafi:** optional while moving, except the Fajr sunnah; recommended when settled (Radd al-Muhtar).
- **Shafi'i and Maliki:** the rawatib remain sunnah; the traveller may leave them (Minhaj; Mukhtasar Khalil).
- **Hanbali:** the traveller may choose to leave them, except the Fajr sunnah and Witr (Kashshaf).

## 8. Zakat

### zakat.nisabBasis: nisab for cash and trade goods

- **Hanafi:** value trade goods by whichever metal is more beneficial to the poor, in practice the lower (al-Hidayah). `nisabBasis: "lower"`.
- **Hanbali: correction to plan §4.1.3.** The plan listed "gold or silver (one view: lower)". Zad al-Mustaqni' states that trade goods are valued "bi-l-ahazz li-l-masakin min 'aynin aw wariq", i.e. by what is most beneficial to the poor. Kashshaf al-Qina' agrees. The app therefore records `nisabBasis: "lower"` and `nisabBasisContested: false`.
- **Shafi'i and Maliki:** the classical texts value trade goods in the currency they were bought with (Shafi'i) or by gold and silver (Maliki). They don't settle the basis for modern paper currency, and contemporary scholars differ. The app **defaults to gold as an app choice** and labels it as such (`nisabBasisContested: true`). The copy says: "contemporary scholars differ; the app starts with gold and lets you change it".
- **Evidence:**
  - Qur'an 9:34.
  - Bukhari 1447 (no zakat under five awaq of silver), verified.
  - Abu Dawud 1573 (20 dinars / 200 dirhams), `disputed` because the corpus grades differ (sahih vs da'if).

### zakat.combineGoldSilver: combining gold and silver to reach nisab

- **Hanafi:** yes. Abu Hanifa combines by value; his two students by parts. `combineMethod: "value"` (al-Hidayah).
- **Shafi'i:** no (Minhaj).
- **Maliki:** yes, by parts (Mukhtasar Khalil).
- **Hanbali:** yes, by parts in the relied-upon view (Zad; Kashshaf). The plan's "two views (relied-upon: yes)" is consistent.

### zakat.jewellery: women's personal jewellery

- **Hanafi:** zakatable. Evidence: Abu Dawud 1563 (the woman with gold bangles), hasan, verified. Source: al-Hidayah.
- **Shafi'i, Maliki and Hanbali:** not zakatable if permissible and in normal use (Minhaj; Mukhtasar Khalil; Zad).

## 9. Fasting

### fasting.forgetfulEating: eating forgetfully

- **Hanafi, Shafi'i and Hanbali:** the fast remains valid. Evidence: Bukhari 1933 and Muslim 1155 (`muslim:2716`), both verified.
- **Maliki:** an obligatory fast must be made up, with no kaffarah (Mukhtasar Khalil).

### fasting.kaffarah: what triggers kaffarah

- **Hanafi and Maliki:** deliberate intercourse, or deliberate eating or drinking (al-Hidayah; Mukhtasar Khalil).
- **Shafi'i and Hanbali:** intercourse only (Minhaj; Zad).
- **Evidence:** Bukhari 1936, verified.

### fasting.afterMidShaban: Shafi'i, fasting after mid-Sha'ban

- **Shafi'i: plan wording changed.** The plan said "Disliked". The relied-upon Shafi'i position (Tuhfat al-Muhtaj; al-Nawawi in al-Majmu') is that it is **not permitted (haram)**, unless it is a habit, joined to fasting from before the 15th, qaza or a vow. The copy says "Not permitted (the relied-upon view)".
- **Evidence:** Abu Dawud 2337 and Tirmidhi 738 ("when half of Sha'ban remains, do not fast"), both verified. They are `disputed` because Imam Ahmad and others criticised the narration while al-Tirmidhi graded it hasan sahih.
- **Hanafi, Maliki and Hanbali:** no special restriction. The general rule is Bukhari 1914 (don't precede Ramadan by a day or two unless it is a habit), verified.

### fidyah.measure: fidyah for each missed fast

- **Hanafi:** half a sa' of wheat or one sa' of dates or barley; the value in cash is allowed (al-Hidayah).
- **Shafi'i:** one mudd of the staple food (Minhaj).
- **Maliki:** one mudd. For the very elderly person, fidyah is mandub (recommended) rather than required (Mukhtasar Khalil). The copy states this.
- **Hanbali:** one mudd of wheat or half a sa' of other food (Zad).
- **Basis:** Qur'an 2:184.

### fitr.measure: sadaqat al-fitr

- **Hanafi:** half a sa' of wheat or one sa' of other foods; the value is allowed. Evidence used: Muslim 985 (`muslim:2287`, Mu'awiyah's half sa' of wheat, which Abu Sa'id did not follow), verified. Source: al-Hidayah.
- **Other three:** one sa' of the staple food, given as food. Evidence: Bukhari 1503, verified. Sources: Minhaj; Mukhtasar Khalil; Zad.

## 10. Hajj, Umrah and udhiyah

### tawaf.wudu: wudu for tawaf

- **Hanafi:** wajib, not a condition. Tawaf without wudu counts but needs a penalty (al-Hidayah).
- **Other three:** a condition of validity (Minhaj; Mukhtasar Khalil; Zad). Evidence they cite: Tirmidhi 960 ("tawaf is like salah, except that you may speak"), verified.
- **Shared evidence:** Qur'an 22:29; Bukhari 1614 (he began with wudu, then tawaf); Bukhari 305 (do everything except tawaf until purified). All verified.

### umrah.taqsir: how much a man must shorten (taqsir) to leave ihram

Added 2026-11-24 (audit follow-up from `umrah-mode.md`). Guide note only (`guideNoteOnly`): the app records halq or taqsir, never an amount. Shown on the Umrah mode halq / taqsir step (`/umrah#halq_taqsir`) and the Hajj guide topic "Halq or taqsir" (`/hajj#umrah`).

- **Hanafi:** at least a quarter of the head. Less than a quarter does not count; a quarter counts but shaving all of it is the sunnah. Basis in the school: the quarter stands for the whole in acts tied to the head, as with wiping a quarter of the head in wudu. Sources: al-Hidayah, Kitab al-Hajj (halq and taqsir); Radd al-Muhtar; the Hanafi position as reported in al-Mawsu'ah al-Fiqhiyyah al-Kuwaytiyyah, "Halq" (quoted by fiqh.islamonline.net, read 2026-11-24).
- **Shafi'i:** at least three hairs of the head, by shaving, cutting or plucking. Al-Nawawi reports no disagreement in the school that three hairs suffice, and rejects the report that one hair is enough. Sources: Minhaj al-Talibin and Tuhfat al-Muhtaj, Bab Sifat al-Hajj wa al-'Umrah; al-Majmu' (al-Nawawi), as quoted on islamqa.info/ar/answers/82077 and fiqh.islamonline.net (read 2026-11-24).
- **Maliki:** the whole head. Taking only part of it does not count. Sources: Mukhtasar Khalil, Bab al-Hajj; al-Taj wa al-Iklil (al-Mawwaq) 4/181, quoted on islamqa.info/ar/answers/82077.
- **Hanbali:** the whole head ("from all of his hair"); a woman cuts a fingertip's length. Sources: Zad al-Mustaqni', Bab Sifat al-Hajj (wording read in the Islamweb audio-lesson transcript, read 2026-11-24); al-Mughni 3/196, quoted on islamqa.info/ar/answers/82077. Al-Mughni also reports a narration from Ahmad that part of the head is enough; the relied-upon view is the whole head, and the copy states only that.
- **Shared evidence:** Qur'an 48:27 ("having your hair shaven and cut"), checked in the bundled `en-pickthall/048.json`; Bukhari 1727 (`bukhari:1727`, the dua for those who shave, then those who shorten), verified in `umrah-mode.md` §1.
- **Women** are not part of this difference: all four schools have a woman cut about a fingertip's length (Abu Dawud 1984; al-Mughni), as the Umrah step already says.
- **Confidence:** the Shafi'i, Maliki and Hanbali positions were checked against quotations of the named works. The Hanafi "quarter" was checked against the Kuwaiti encyclopedia's report and the Hanafi manuals named above by chapter; the printed page was not re-checked.

### udhiyah.status: ruling of the udhiyah

- **Hanafi:** wajib on a resident who owns nisab; the days end at sunset on the 12th (al-Hidayah). Evidence used: Ibn Majah 3123 ("whoever can afford it and does not sacrifice…"), `disputed` because some critics hold it is mawquf.
- **Shafi'i:** sunnah mu'akkadah; it ends at sunset on the 13th (Minhaj).
- **Maliki and Hanbali:** sunnah mu'akkadah; it ends at sunset on the 12th (Mukhtasar Khalil; Zad).
- **Basis:** Qur'an 108:2 and 22:28.

### udhiyah.hairNails: cutting hair and nails in the ten

- **Hanafi:** recommended to refrain (Radd al-Muhtar).
- **Shafi'i:** makruh (Minhaj).
- **Maliki:** makruh. Mukhtasar Khalil makes refraining mandub.
- **Hanbali:** haram until the animal is slaughtered (Zad).
- **Evidence:** Muslim 1977 (`muslim:5119`, Umm Salamah), verified.

## 11. Inheritance (NF-3.10 parameters)

These rows set `MirathSchoolParams` only. The NF-3.10 fixture suite (≥ 150 fixtures, `verifiedBy`) is a separate gate.

| Parameter                                 | Hanafi                                                             | Shafi'i                                                             | Maliki                                                                                   | Hanbali                                 | Source                                                                                                    |
| ----------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| grandfatherWithSiblings                   | grandfather excludes (Abu Hanifa; the fatwa view in al-Sirajiyyah) | muqasamah (Zayd's method; best of sharing, ⅓ of the remainder, ⅙)   | muqasamah                                                                                | muqasamah                               | al-Sirajiyyah; Matn al-Rahbiyyah; al-Mughni                                                               |
| akdariyyah                                | n/a (false)                                                        | true                                                                | true                                                                                     | true                                    | same                                                                                                      |
| mushtarakah                               | full brothers excluded                                             | full brothers share the maternal third                              | share                                                                                    | excluded                                | same; Bidayat al-Mujtahid                                                                                 |
| paternalGrandmotherWithFather             | excluded                                                           | excluded                                                            | excluded                                                                                 | inherits (her son does not exclude her) | al-Mughni; Kashshaf                                                                                       |
| raddClassical                             | to the heirs                                                       | to the treasury (bayt al-mal)                                       | to the treasury                                                                          | to the heirs                            | al-Sirajiyyah; Matn al-Rahbiyyah                                                                          |
| raddEnabled (app default)                 | true                                                               | true: later Shafi'is permit radd where there is no orderly treasury | true: likewise later Malikis                                                             | true                                    | NF-3.10 §7 note                                                                                           |
| dhawuAlArham                              | inherit                                                            | inherit when there is no orderly treasury                           | same                                                                                     | inherit                                 | same                                                                                                      |
| malikiyyah (added by NF-3.10, 2026-11-24) | false (grandfather excludes siblings anyway; same result)          | false (Zayd: grandfather ⅙, paternal brother ⅙)                     | **true**: the grandfather takes the whole remaining third; paternal siblings get nothing | false                                   | Mukhtasar Khalil; al-Sharh al-Kabir; Matn al-Rahbiyyah; al-Mughni — details in `docs/proofs/mirath.md` §3 |

The Qur'anic basis is 4:11, 4:12 and 4:176. NF-3.10's own impediment refs were also checked: Bukhari 6764 (no inheritance across religions) and Tirmidhi 2109 ("the killer does not inherit"), verified; the latter's grade is `disputed`, because al-Tirmidhi says it is not authentic while al-Albani grades it sahih.

## 12. Picker copy (non-ruling)

- **School descriptions** give the founder and the hijri death year: Abu Hanifa 150, Malik 179, al-Shafi'i 204, Ahmad 241. They also name the regions where each school is widely followed. These are descriptive, widely documented facts, and no school is ranked. The order is fixed (`MADHHAB_IDS`), and "Show all views" is always offered.
- **"Not sure?" text:** it tells the user to follow their family, masjid or teacher, or to choose all views. It never names or recommends a school, which a component test asserts.

## Corrections to plan §4.1.3 made by this review

1. Maliki Witr qaza: "Recommended" became **not made up after Subh** (Mukhtasar Khalil).
2. Hanbali nisab basis: "gold or silver (one view: lower)" became **lower / most beneficial to the poor** (Zad, Kashshaf).
3. Shafi'i fasting after mid-Sha'ban: "Disliked" became **not permitted (relied-upon view)**, with the exceptions listed (Tuhfat al-Muhtaj).
4. Hanbali Fatihah behind the imam: "silent prayers only" became **silent salahs and the imam's pauses**.
5. Shafi'i and Maliki nisab basis for modern currency: recorded as **contested**, with gold labelled as the app's default rather than a school ruling.
6. Maliki rawatib preset 10: kept per D8, but labelled as the app's default rather than a Maliki text.

## Retrofit — guides

NF-3.0a guide retrofit (plan §4.1.4 guide rows, §4.1.2 coverage), reviewed 2026-11-23 (AI proof-backed review, D11). Guide prose stays; topics now carry typed `differenceIds` (`packages/shared/src/content/*-guide.ts`, `taharah.ts`, `salah-guide.ts`) and render `<MadhhabNote>`s. Copy: `apps/app/scripts/i18n/madhhab-retrofit-guides-i18n.json`. Hadith refs below were checked against the fawazahmed0 corpus (`hadithnumber`, and `arabicnumber` for Muslim) on 2026-11-23; grades are the corpus graders'.

### New catalog rows

| Id                       | Hanafi                                                     | Shafi'i                                                                          | Maliki                                                                                                                                 | Hanbali                                                                                                                             | Sources                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------ | ---------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `salah.lastSitting`      | iftirash in every sitting                                  | tawarruk in the final sitting of every salah (incl. 2-rakah); iftirash otherwise | tawarruk in every sitting                                                                                                              | tawarruk only in the final sitting of a salah with two tashahhuds                                                                   | Bukhari 828 (Abu Humayd: "in the last rakah he put his left foot forward… and sat on his buttock") — verified; al-Hidayah, Minhaj, Mukhtasar Khalil ("al-ifda'"), Zad                                                                                                                                                                                                                                                                        |
| `salah.firstTashahhud`   | wajib                                                      | sunnah (one of the ab'ad; sujud as-sahw)                                         | sunnah (sujud as-sahw)                                                                                                                 | wajib                                                                                                                               | Bukhari 829 (Ibn Buhaynah: stood after two rakahs, prostrated twice before salam) — verified; school manuals                                                                                                                                                                                                                                                                                                                                 |
| `salah.abandoning`       | grave sin, remains Muslim unless he denies its obligation  | same                                                                             | same                                                                                                                                   | relied-upon: kufr when he persists after being summoned by the authority                                                            | Muslim 82 = corpus `muslim:246` (82.01, Jabir: "between a man and shirk and kufr is abandoning the salah") — verified; Tirmidhi 2621 (sahih per Shakir, al-Albani; hasan sahih per Bashar Awad) — verified; Zad al-Mustaqni' (Kitab al-Salah: "wa kadha tarikuha tahawunan wa da'ahu imamun…"); al-Mughni. Denial of its obligation is kufr by consensus (all schools). Penalties (imprisonment / execution) deliberately omitted from copy. |
| `jumuah.sunnah`          | 4 before + 4 after, sunnah mu'akkadah (Abu Yusuf: 6 after) | like Dhuhr: 2+2 emphasised, 4+4 complete ("wa al-jumu'atu ka-al-zuhr", Minhaj)   | no ratibah before or after; voluntary salah allowed                                                                                    | no ratibah before (voluntary before recommended); after: 2 to 6 (Zad: "aqall al-sunnah ba'd al-jumu'ah rak'atan wa aktharuha sitt") | Muslim 881 = corpus `muslim:2036` (881.01, "let him pray four after it") — verified; Bukhari 937 (Ibn 'Umar: two after Jumu'ah at home) — verified                                                                                                                                                                                                                                                                                           |
| `wudu.intention`         | sunnah (lifts minor impurity without it; reward needs it)  | fard                                                                             | fard                                                                                                                                   | condition (shart)                                                                                                                   | Bukhari 1 ("actions are by intentions") — verified; school manuals                                                                                                                                                                                                                                                                                                                                                                           |
| `wudu.tartib`            | sunnah                                                     | fard                                                                             | sunnah (mashhur)                                                                                                                       | fard                                                                                                                                | Qur'an 5:6 (en-pickthall corpus) — verified; school manuals                                                                                                                                                                                                                                                                                                                                                                                  |
| `wudu.muwalat`           | sunnah                                                     | sunnah (qawl jadid, the relied-upon view)                                        | fard when remembered and able; forgetful gap excused                                                                                   | fard (a limb must not dry before the next, in moderate conditions)                                                                  | Abu Dawud 175 (man with an unwashed spot told to repeat wudu and salah; sahih per al-Albani, Arnaut "sahih li-ghayrihi") — verified                                                                                                                                                                                                                                                                                                          |
| `wudu.dalk`              | sunnah                                                     | sunnah                                                                           | fard                                                                                                                                   | sunnah                                                                                                                              | Qur'an 5:6; Mukhtasar Khalil ("wa dalk")                                                                                                                                                                                                                                                                                                                                                                                                     |
| `wudu.touchOppositeSex`  | does not break                                             | breaks: skin contact of adult non-mahram man and woman, even without desire      | breaks only with desire (intended or felt)                                                                                             | breaks only with desire                                                                                                             | Qur'an 4:43, 5:6 ("or you have touched women", read as intercourse by the Hanafis); Bukhari 382 ('A'ishah: he touched her feet while prostrating) — verified                                                                                                                                                                                                                                                                                 |
| `wudu.touchPrivateParts` | does not break                                             | breaks: front or back private part touched directly with the inner palm/fingers  | breaks a man touching his penis with the palm/inner fingers; for a woman the school has differing interpretations ("ta'wilat", Khalil) | breaks: touched directly with the hand                                                                                              | Abu Dawud 181 (Busrah: "whoever touches his private part, let him make wudu"; sahih per al-Albani, Arnaut) and Abu Dawud 182 (Talq: "it is only a part of him"; sahih per al-Albani) — both verified; marked `disputed` because the classical critics each weakened the other's narration (al-Shafi'i / Abu Hatim on Talq; the Hanafis on Busrah)                                                                                            |

### Guide prose corrected

- `taharah.ts` → `wudu-conditions` body[2] and `wudu-obligatory` body[1] said continuity (muwalat) is obligatory for the Shafi'is. The relied-upon Shafi'i view (qawl jadid, Minhaj) is **sunnah**; it is obligatory for the Malikis (with remembrance) and Hanbalis. English corrected; `TAHARAH_CONTENT_VERSION` 3 → 4. **Follow-up:** the 23 taharah overlays still carry the old sentence for those two paragraphs; the structured notes directly beneath them show the correct per-school view in every locale.

### Quiz tagging

- `salah-guide-quiz.ts` `rawatib-total` ("12") and `rawatib-dhuhr` ("4 before, 2 after"): the answer is the Hanafi preset only (Shafi'i/Hanbali: 10 mu'akkadah with 2 before Dhuhr, Bukhari 1180 — verified; Maliki: app default 10). Tagged `differenceId: "rawatib.preset"`, `answerSchools: ["hanafi"]`; skipped in all-views mode and for other schools. **Follow-up:** the `rawatib-total` prompt says "agreed upon", which overstates; rewording needs the 23 overlay translations updated.
  - **Resolved (locale-repair pass, 2026-11-24):** both prompts now ask what the hadith of Umm Habibah states ("How many … does the hadith of Umm Habibah describe?"; "In the hadith of Umm Habibah (Jami' at-Tirmidhi 415), the rawatib around Dhuhr are:"), which is factually the same for every school, so `differenceId`/`answerSchools` were removed and the questions show in every mode. Explanations now cite Muslim 728 (twelve, corpus `muslim:1694`) for the promise and Tirmidhi 415 (corpus `tirmidhi:415`) for the breakdown — Muslim 728 itself does not list the twelve — and note Ibn 'Umar's ten (Bukhari 1180) and that schools differ on the emphasised set (see `rawatib.preset`). `SALAH_GUIDE_QUIZ_VERSION` 1 → 2; all 23 overlays updated.
- `witr-separate`, `fatihah-shafii`, `fatihah-hanafi-loud`, `behind-imam-loud`: not tagged — the answer is correct whatever the user's school (they name the school, or state the difference itself).

### Attachments (guide topic → differences)

Salah guide: `importance` → salah.abandoning; `prayer-times` → asr.start, asr.preferred, fajr.preferred, isha.start, isha.preferred; `how-to-pray` → salah.raisingHands, salah.fatihaBehindImam, salah.fajrQunut; `jahri-sirri` → salah.fatihaBehindImam; `positions` → salah.lastSitting; `pillars-nullifiers`, `sujud-al-sahw` → salah.firstTashahhud; `prayer-types` → witr.status, witr.form, rawatib.preset; `jumuah` → jumuah.minCongregation, jumuah.sunnah. Taharah: `wudu-conditions` → wudu.intention/tartib/muwalat; `wudu-obligatory` → + wudu.dalk; `wudu-breakers` → wudu.touchOppositeSex, wudu.touchPrivateParts. Friday: `jumuah-obligation` → jumuah.minCongregation, jumuah.sunnah. Eid: `eid-al-adha` → tashriq.takbir; `eid-prayer-how-to` → eid.status, eid.extraTakbirs; `zakat-fitr-basics` → fitr.measure; `udhiyah-basics` → udhiyah.status, udhiyah.hairNails. Janazah: `how-to-pray-janazah`, `takbir-steps` → janazah.fatiha. Hajj: `umrah-tawaf`, `arkan-wajibat` → tawaf.wudu (also on `/umrah/checklist`). Fidyah guide: `fidyah-feeding-poor` → fidyah.measure; `kaffarah-ramadan` → fasting.kaffarah. No new claims beyond the rows above; the existing rows' proofs are in §1–§10.

## Retrofit — calculators

Appended by the NF-3.0a calculators & trackers retrofit (plan §4.1.4), review 2026-11-23 (AI proof-backed review, D11). The entries record how calculators and trackers apply the rows above, and which steps are app choices or approximations.

### Zakat calculator (`/zakat`) — retrofit claims

Code: `apps/app/src/lib/zakat.ts` (`nisabFor`, `basisMetalFor`, `zakatCombineFor`, `assessZakatWealth`, `computeZakat(…, fiqh)`), `apps/app/src/hooks/use-zakat-calculator.ts`, `components/zakat/zakat-calculator.tsx` + `zakat-result-hero.tsx`. Rulings are read from `MADHHAB_RULES[*].zakat` (sources in §8 above); nothing below adds a new ruling. It records how the calculator applies them and which steps are app choices.

- **Nisab basis (`nisabFor`).** `lower` = the lower of the gold nisab (87.48 g) and silver nisab (612.36 g) values (Hanafi, Hanbali: "most beneficial to the poor"; §8 zakat.nisabBasis). `gold` / `silver` = that metal's nisab. **App choice:** when the chosen metal's price is unknown (0), the other metal's nisab is used so a threshold still exists; the UI shows which value is in use ("Using nisab (…): …").
- **Contested basis (Shafi'i, Maliki).** The default is gold as an **app choice** (`nisabBasisContested: true`), shown with "Scholars differ on the nisab for modern currency in your school. The app starts with gold — you can change it here." A user choice is saved to `fiqhCustom.nisabBasis` and labelled with the "Custom" badge; "School default" removes it. No other `fiqhCustom` key is touched, and picking a madhhab never changes the zakat draft.
- **Combining by value (Hanafi; `combineMethod: "value"`).** Gold, silver, personal jewellery (when counted) and all other zakatable wealth are added by value and compared with the basis nisab. This is also the app's behaviour before madhhab support and stays the pooling used for all-views rows.
- **Combining by parts (Maliki, Hanbali; `combineMethod: "parts"`).** Each holding is divided by its own nisab (gold ÷ gold nisab, silver ÷ silver nisab); nisab is reached when the shares sum to ≥ 1 (e.g. half a gold nisab + half a silver nisab). **App choice:** cash and trade goods are counted as a share of the basis nisab, because the classical "by parts" rule speaks of gold and silver and the schools value trade goods by the metals (§8).
- **Not combined (Shafi'i; `combineGoldSilver: false`).** Gold and silver are not added to each other (Minhaj, §8 zakat.combineGoldSilver). **App choice (labelled in the UI):** cash and trade goods are measured as the basis metal and pooled with it ("Cash, trade goods and {{metal}}"); the other metal is assessed alone against its own nisab. For the basis `lower`, cash pools with the metal whose nisab is lower. Zakat is 2.5% of every pool that reaches its nisab.
- **Deduction order (app choice).** Debts and immediate living expenses are taken first from cash and trade wealth, then from the basis metal, then from the other metal, never below zero. Only the `parts` and `separate` methods depend on the order; the order is documented in the code and tested.
- **Personal-use jewellery.** A separate "Personal-use jewellery" amount (draft `values.personalJewellery`; older drafts without it load unchanged). Hanafi (`personalJewelleryZakatable: true`): counted with gold. Shafi'i, Maliki, Hanbali: not counted — "permissible jewellery in normal use is not zakatable" — and the result notes the excluded amount. Evidence and sources: §8 zakat.jewellery (Abu Dawud 1563, hasan; al-Hidayah; Minhaj; Mukhtasar Khalil; Zad). The `zakat.jewellery` note with "Other views" is shown next to the field.
- **All views (`madhhab: null`).** No school is picked silently: the result card lists one row per basis (lower / gold / silver), each pooled by value, and, when jewellery was entered, the amount without it. The headline amount uses the user's saved basis, else `lower` (the pre-madhhab behaviour), and says so ("Showing all views: the amount above uses …"). The `zakat.nisabBasis`, `zakat.combineGoldSilver` and `zakat.jewellery` notes render the four-school comparison.
- Review: AI proof-backed review (D11), 2026-11-23.

### Fidyah / kaffarah helper and Ramadan mode (fasting retrofit, 2026-11-23)

Code: `apps/app/src/lib/fasting-fiqh.ts` (+ test), `components/fidyah/{fidyah-fiqh-panel,food-measure-ruling}.tsx`, `components/ramadan/{ramadan-fiqh-card,ramadan-make-up-offer}.tsx`. Rulings are read from `MADHHAB_RULES.fasting` (§9 above); only the items below are new claims.

- **Food measures — approximate weights (app conversion, labelled "approx.; conversions differ").** The classical units are fixed (1 sa' = 4 mudd), but their metric equivalents are not, so every weight is shown as a range with the note "Weights are approximate — modern conversions of the mudd and sa' differ. Your local masjid can tell you the amount used where you live." (`fidyah.fiqh.approxNote`).
  - **Hanafi (Iraqi sa', 8 ratl):** ½ sa' of wheat ≈ 1.6–2.05 kg; 1 sa' of dates/barley ≈ 3.2–4.1 kg. The low end follows the common Deobandi fatwa figure (≈ 1.575 kg for ½ sa'), the high end the common Barelvi figure (≈ 2.045 kg). Source for the measure itself: al-Hidayah, Bab Sadaqat al-Fitr and Bab ma yujib al-qada' wa-l-kaffarah (fidyah = sadaqat al-fitr amount per day).
  - **Shafi'i / Maliki / Hanbali (Hijazi sa'):** 1 mudd ≈ 0.5–0.75 kg; 1 sa' ≈ 2–3 kg; Hanbali ½ sa' of other food (= 2 mudd) ≈ 1–1.5 kg. Ranges reflect the spread between weighing a mudd of wheat (≈ 0.51 kg) and the larger volumetric estimates used by some fatwa bodies (a sa' ≈ 3 kg for rice/dates). Sources for the measures: Minhaj (Kitab al-Siyam, fidyah; Zakat al-Fitr); Mukhtasar Khalil (Siyam; Zakat al-Fitr); Zad al-Mustaqni' (Siyam; Zakat al-Fitr).
  - **Not a claim:** the app never states one exact gram figure. Code: `FOOD_MEASURE_KG`.
- **Cash vs food label.** "Cash value allowed" only for Hanafi (`fidyahCashAllowed` / `fitrCashAllowed`); every other school shows "Food only — give the food itself". Already sourced under fidyah.measure / fitr.measure above; the label just mirrors the rule.
- **Kaffarah feeding uses the same per-person measure as fidyah** (60 poor people × the school's measure): al-Hidayah (Kaffarat; ½ sa' wheat per poor person); Minhaj (a mudd per poor person); Mukhtasar Khalil (a mudd per poor person); Zad (a mudd of wheat or ½ sa' of other food). The helper shows the measure "for each poor person" in both scenarios.
- **Kaffarah triggers (copy wording).** Shafi'i/Hanbali copy: "Intercourse during a Ramadan fast. Deliberately eating or drinking needs a make-up day, but no kaffarah." Hanafi/Maliki: "Intercourse, or deliberately eating or drinking, during a Ramadan fast." Restates fasting.kaffarah (§9); no new source.
- **Maliki forgetful eating — wording.** Copy: "Stop as soon as you remember and keep fasting for the rest of the day. Make this day up later; no kaffarah is due." Basis: Mukhtasar Khalil, Bab al-Siyam — in Ramadan, imsak (continuing to abstain) is obligatory for one who broke the fast, and forgetful eating in an obligatory fast requires qada' without kaffarah (al-Sharh al-Kabir with Hashiyat al-Dasuqi). The other three schools' copy ("Your fast is still valid. Stop as soon as you remember and carry on fasting — no make-up day is needed.") follows Bukhari 1933 / Muslim 1155 (`muslim:2716`), already verified in §9 ("let him complete his fast").
- **Maliki elderly fidyah note.** "In the Maliki school, fidyah for the very elderly who cannot fast is recommended rather than required." Restates the fidyah.measure entry (Mukhtasar Khalil); shown only in the fidyah scenario.
- **Sadaqat al-fitr per person.** Hanafi: ½ sa' wheat or 1 sa' of dates/barley, cash allowed; others: 1 sa' of the staple food, food only. Restates fitr.measure; weights as above.
- **Tarawih.** Shown only via `MadhhabNote id="tarawih.rakahs"` (info); no new claim.
- **Ramadan make-up offer (app behaviour, not a ruling).**
  - Current behaviour checked first: the Ramadan fasting log (`stores/fasting-store.ts`, "fasted / missed / exempt") and hayd-excused salah days (`PrayerLog.isExcused` + `excusedReason`) never touched the fasting qaza counter (`QazaRepository` `qazaRoza`). Nothing was added automatically before, and nothing is now.
  - The offer counts Ramadan days up to today that are logged missed or exempt, or excused for hayd/nifas in the salah tracker and not logged as fasted. Basis that these days are made up: Qur'an 2:184–185 ("…the same number of other days"), verified against `assets/data/quran/translation/en-pickthall/002.json`. For hayd, the hadith of 'A'ishah ("we were commanded to make up the fast, not the salah") is the classical evidence (Sahih Muslim, Kitab al-Hayd, Abd al-Baqi 335); the Muslim corpus is CDN-only so its corpus id was **not** verified here, and the app copy cites no hadith for this offer. The copy is general ("Missed and exempt days, and days of hayd or nifas, are made up after Ramadan") and adds "Skip this if you have already added them, or if you pay fidyah instead" because an "exempt" day may belong to someone who pays fidyah instead of making up.
  - Never automatic: the counter changes only when the user taps "Add N to fasting qaza". The answer (add or "No thanks") is remembered per Hijri year as `ramadan-fasting-qaza-offer:<year>:<handledCount>` in the synced tours list, so the card returns only for days logged later. On-screen only; never in notifications.

### Combining (jam') flag on the prayer log (`PrayerLog.combinedWith` / `combineMode`)

- **Claim — only two pairs combine:** Dhuhr with Asr, and Maghrib with Isha; Fajr is never combined (agreed by all four schools; the disagreement is only _whether/when_ combining is allowed, see `jam.travel` / `jam.rain` above). Code: `apps/app/src/lib/prayer-combining.ts` (`COMBINE_PAIRS`).
  - Bukhari 1107 (Ibn 'Abbas: Dhuhr+Asr and Maghrib+Isha together on journeys), verified in the corpus.
  - Bukhari 1106 (Ibn 'Umar: Maghrib+Isha together when in a hurry on a journey), verified.
  - Bukhari 1108 (Anas: Maghrib+Isha together on journeys), verified.
- **Claim — taqdim / ta'khir:** taqdim = both prayed in the earlier prayer's time; ta'khir = both in the later prayer's time (definitions, not a ruling). Code: `combineHostPrayer()`.
  - Muslim 704 (Abd al-Baqi) = corpus `muslim:1625`–`1627` (Anas: on a journey he delayed Dhuhr to the start of Asr's time and combined them; likewise Maghrib to Isha — ta'khir), verified by `arabicnumber` 704.01–704.03.
  - Muslim 705 (Abd al-Baqi) = corpus `muslim:1628`–`1630` (Ibn 'Abbas: combined in Madinah "without fear or journey"; 705.03 at Tabuk), verified. Already cited for `jam.rain`.
- **When the flag is offered (code, follows `MADHHAB_RULES`, no new ruling):** a pair prayer is offered the flag when `rules.travel.jamTravel` (travel domain) is true, or `rules.travel.jamRain` (salah domain) is `"both"`, or `"maghrib_isha"` for the Maghrib/Isha pair. Result: Hanafi never offered (Hajj exception is copy only, in the existing `fiqh.diff.jam.travel.hanafi`); Shafi'i both pairs (travel + rain); Maliki and Hanbali both pairs for travel, Maghrib/Isha also for rain. All-views (no school for either domain) ⇒ offered with a neutral "schools differ" note and a `MadhhabNote` for `jam.travel` + `jam.rain`. The UI caption says "conditions apply" rather than restating each school's conditions (e.g. Shafi'i rain = taqdim only in congregation; Maliki travel = while on the move), which stay in the difference catalog.
- **Data safety:** the flag is the user's own record. A flag recorded earlier is always shown (and can be cleared), even if the user's school no longer offers combining — picking a madhhab never hides or edits data. Independent of `isJama` (congregation).

### Preferred-time hints (Fajr / Asr / Isha sub-band) — app approximations

The per-school _positions_ are already logged above (`fajr.preferred`, `asr.preferred`, `isha.preferred`). New here are only the **minute boundaries** used to draw a soft hint, which are **app approximations, not classical numbers**; the UI says the whole time is valid and the times are approximate (`prayerWindow.preferred.sheetHint`). Code: `apps/app/src/lib/salah-phase/preferred-window.ts`.

- **Fajr, taghlis (Shafi'i, Maliki, Hanbali):** first third of Fajr → sunrise. Basis: Bukhari 578 ('A'ishah: the women left after Fajr unrecognised because of the darkness), verified.
- **Fajr, isfar (Hanafi):** from the midpoint of Fajr → sunrise until 15 minutes before sunrise (`ISFAR_REPEAT_BUFFER_MIN`). The Hanafi condition (al-Hidayah; Radd al-Muhtar) is to begin once the light has spread while leaving enough time to repeat the salah with its recitation before sunrise; the 15-minute buffer and the midpoint start are the app's approximation of that. Basis: Tirmidhi 154 (Rafi' b. Khadij: "Perform Fajr at al-isfar, for its reward is greater"), verified; graded Sahih by Ahmad Shakir, al-Albani and Zubair 'Ali Za'i, Hasan Sahih by Bashar 'Awwad.
- **Asr, yellowing:** `ASR_YELLOWING_BEFORE_MAGHRIB_MIN = 40` minutes before Maghrib. The texts define it by the sun's disc turning pale/yellow (isfirar), not by minutes; contemporary timetables approximate it at roughly 20–40 minutes before sunset, and the app uses the earlier edge so the hint never points into the disliked time. Basis for "Asr's time lasts until the sun turns yellow": Muslim 612 (Abd al-Baqi) = corpus `muslim:1385`–`1387` ('Abdullah b. 'Amr), verified by `arabicnumber` 612.01–612.03.
- **Asr, early (Shafi'i, Maliki, Hanbali):** first third of Asr → yellowing.
- **Asr, delayed before yellowing (Hanafi):** second half of Asr → yellowing (ending at the yellowing approximation). Source for the position: al-Hidayah ("delaying Asr is mustahabb as long as the sun has not changed").
- **Isha, a third of the night:** night = Maghrib → next Fajr; end of the first third = Maghrib + ⅓ of that span (`firstThirdOfNightEnd`). Delay (Hanafi, Hanbali) = second half of Isha → end of the first third; early (Shafi'i, Maliki) = first half. The "Maghrib → Fajr" definition of the night is the one used for the existing Tahajjud/last-third timings in the app; schools differ on whether the night is reckoned to Fajr or sunrise, so the boundary is approximate. Basis: Tirmidhi 167 (Abu Hurayrah: "If it were not a hardship on my Ummah I would have ordered them to delay Isha to a third of the night, or its half"), verified; graded Sahih (Ahmad Shakir, al-Albani), Hasan Sahih (Bashar 'Awwad), isnad Sahih (Zubair 'Ali Za'i).
- **All views:** no band is drawn; the hint reads "Preferred time differs by school" and the prayer info sheet shows `<MadhhabNote>` (a `RulingCompare`).
- **High latitudes:** if Isha begins after the end of the first third of the night, no Isha band is drawn (never a misleading hint).

### Qasr calculator (`/travel#calculator`) and the travel-mode questions

Code: `apps/app/src/lib/qasr-calculator.ts` (+ test), `components/travel/qasr-calculator.tsx`, `components/travel/travel-mode-sheet.tsx`. Every ruling is read from `MADHHAB_RULES[*].travel` (§7 above), with the user's `fiqhCustom.qasrDistanceKm` / `residencyDays` applied by `rulesFor`. Only the items below are new.

- **Distance verdict (app rule over §7 qasr.distance).** Below the school's `qasrDistanceKmRange` → "not a traveller"; at or above its upper end → "traveller"; inside the range → "scholars differ — ask a local scholar", because the metric conversion of the classical measure is itself disputed (§7 conversion caveat). Hanafi 77–78 km; Shafi'i, Maliki and Hanbali 81–89 km. A custom distance collapses the range to one figure. Miles are international miles (1.609344 km).
- **Shortening status.** The verdict labels qasr as wajib (Hanafi), a concession where shortening is better (Shafi'i, Hanbali) or sunnah mu'akkadah (Maliki). Restates §7 qasr.status.
- **Residency.** "Intending to stay N days" makes the traveller resident at the destination when it is ≥ 15 (Hanafi), ≥ 4 full days not counting arrival and departure (Shafi'i, Maliki) or > 4 days (Hanbali). Restates §7 qasr.residency. **App simplification:** the stay is entered as whole days; for Shafi'i and Maliki the field says "Count full days only — not the days you arrive and leave". Hanbali's "more than 20 salahs" is approximated as "more than 4 days".
- **Combining.** Shown as allowed for Shafi'i, Maliki and Hanbali (conditions stay in the `jam.travel` note). For Hanafi it is hidden, except when the user says it is a Hajj journey: then "only at 'Arafah and Muzdalifah during Hajj" (§7 jam.travel; al-Hidayah).
- **Rawatib guidance.** Restates §7 travel.rawatib for each `rules.travel.rawatib` value.
- **All views.** One row per school (uncustomised rules); no school is picked. The four `MadhhabNote`s (`qasr.distance`, `qasr.status`, `qasr.residency`, `jam.travel`) sit under "How the schools differ".
- **Travel mode.** Turning on travel excused mode now asks the same two questions in a sheet. It never blocks: if the trip falls below the school's distance, the sheet says so and the user can still continue. Answers are not saved.

### Hayd / nifas day counter and prompts

Code: `apps/app/src/lib/hayd-period.ts` (+ test), `components/excused/blood-period-status.tsx` (+ test). `ExcusedReason` gains `"nifas"` (`packages/shared/src/types/prayer.ts`). Figures come from `MADHHAB_RULES[*].hayd` (§6 above) with `fiqhCustom.haydMaxDays` / `nifasMaxDays` applied.

- **Period detection (app rule).** A period is the run of consecutive calendar days whose prayer logs are excused for the same reason (hayd or nifas). Days are calendar days, not hours: "Day 6" means the 6th calendar day since the first excused day. This approximates the hour-based limits in the manuals (e.g. Hanafi 10 days = 240 hours) and is labelled a prompt, not a ruling.
- **Counter.** "Day N of a maximum of M (school)". M = `hayd.maxDays` (Hanafi 10; others 15) or `hayd.nifasMaxDays` (Hanafi, Hanbali 40; Shafi'i, Maliki 60). Restates §6 hayd.max and nifas.max. All views: "the schools' maximum is 10–15 days" (nifas 40–60).
- **(a) Beyond the maximum.** From day M + 1: "Bleeding after day M is istihada in your school — resume salah, with wudu for each salah time", with a Resume button. Restates §6 hayd.beyondMax (Bukhari 306, verified). All views: shown from the earliest school maximum, worded "in at least one school", with the `hayd.max` / `nifas.max` comparison. Maliki habit + istizhar is not modelled; the Maliki figure shown is the 15-day maximum.
- **(b) Period shorter than the minimum.** When the last hayd period ended within the past 15 days and lasted fewer than `ceil(minHours / 24)` days (Hanafi: fewer than 3; Shafi'i and Hanbali: 1, so never with whole days; Maliki: no minimum, never): "it may not count as hayd in your school; consider making up these salahs", with "Add N to qaza". N counts that period's fard salahs not already logged as prayed. Restates §6 hayd.min. All views: shown against the strictest minimum (3 days), with neutral wording and the `hayd.min` comparison. The answer (added or dismissed) is remembered as `hayd-short-period:<start>:<end>` in the tours list.
- **(c) New period before the minimum purity.** When a new hayd period starts fewer than `minPurityDays` (Hanafi, Shafi'i, Maliki 15; Hanbali 13) after the previous hayd or nifas period ended: an information note only ("this bleeding may be istihada; consider asking a scholar"). Restates §6 hayd.minPurity. All views: the 15-day figure, with the `hayd.minPurity` comparison.
- **Never automatic, never in notifications.** Nothing changes until the user taps Resume or Add. All copy is on-screen in the tracker's excused card and the `/hayd` guide only. Picking or changing a madhhab only changes the labels and prompts, never logs or counters.
- **Nifas fasting.** The voluntary-fasting day sheet blocks "fasted" on nifas days as it already did for hayd: the fast is not valid during nifas, by the same evidence as hayd (§6, Qur'an 2:222 and the hayd guide).
