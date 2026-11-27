# Proof log: Dhul-Hijjah mode (NF-3.3, D11)

- **Feature:** a seasonal mode for the first ten days of Dhul-Hijjah through the days of Tashriq (`/dhul-hijjah`, `/dhul-hijjah/udhiyah`). It has:
  - a daily deeds checklist;
  - takbir, tahlil and tahmid counters;
  - the Day of Arafah view;
  - the Takbir al-Tashriq counter;
  - the udhiyah planner and hair/nails reminder;
  - seasonal reminders.
- **Code:** content `packages/shared/src/content/dhul-hijjah.ts`; logic `apps/app/src/lib/dhul-hijjah.ts`; reminders `apps/app/src/lib/notifications/dhul-hijjah-reminders.ts`; copy `apps/app/scripts/i18n/dhul-hijjah-i18n.json`.
- **Rulings:** read from `MADHHAB_RULES` / `FIQH_DIFFERENCES`. Their per-school sourcing is in `docs/proofs/madhhab.md`, and this log does not repeat it:
  - takbir window and status: `tashriq.takbir`;
  - udhiyah status: `udhiyah.status`;
  - last slaughter day: `udhiyah.lastDayHijri`;
  - hair and nails: `udhiyah.hairNails`.
- **Display:** `madhhab === null` shows all views (union of the takbir windows, labelled by school; both slaughter windows).
- **Review:** AI proof-backed review (D11), 2026-11-23.
- **UI disclaimer:** "For your own situation, consult a qualified scholar." (`dhulHijjah.disclaimer`).

## 0. How the refs were checked

The same method as `docs/proofs/madhhab.md`:

- **Qur'an:** against `assets/data/quran/translation/en-pickthall`.
- **Hadith:** against fawazahmed0/hadith-api@1 full editions. Muslim refs are paired by the corpus `arabicnumber`.
- **Outside the corpus:** Musnad Ahmad is not in the bundled corpus (its editions list has abudawud, bukhari, dehlawi, ibnmajah, malik, muslim, nasai, nawawi, qudsi, tirmidhi). It was checked against cited editions instead (§1).

## 1. Evidence (plan §12 "Dhul-Hijjah" + Islamic basis)

| Claim / copy                                                                              | Plan ref      | Corpus id                                                                    | Content confirmed                                                                                                                                                     | Grade                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "No good deeds are more beloved… than those done in these ten days" (`dhulHijjah.virtue`) | Bukhari 969   | `bukhari:969`                                                                | Ibn 'Abbas: "No good deeds done on other days are superior to those done on these (first ten days of Dhul Hijja)… not even jihad, except…"                            | sahih                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| "Increase your zikr: takbir, tahlil and tahmid"                                           | Ahmad 5446    | **not in corpus**                                                            | Ibn 'Umar: "…so increase in them the tahlil, takbir and tahmid." Musnad Ahmad no. 5446 (Musnad 'Abdullah ibn 'Umar).                                                  | **Gradings differ.** Ahmad Shakir: sahih. The Dar al-Salam / al-Risalah takhrij: the hadith is sahih by its supports, but this isnad is weak because of Yazid ibn Abi Ziyad (it notes a stronger route through Abu 'Awanah, and al-Tabarani reports it from Ibn 'Abbas). Shown in-app only as the citation "Ahmad 5446 (gradings differ)", never as text. The instruction itself also rests on Qur'an 22:28 and 2:203 (next rows) and Bukhari 969. |
| Remembrance on the known / appointed days                                                 | —             | Qur'an 22:28, 2:203                                                          | 22:28 "…mention the name of Allah on appointed days…"; 2:203 "Remember Allah through the appointed days…"                                                             | Qur'an                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| "And ten nights" (ten-days virtue)                                                        | —             | Qur'an 89:2                                                                  | "And ten nights". Linked as a Qur'an ref only; the commentary identifying them with Dhul-Hijjah is not asserted in copy.                                              | Qur'an                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Hair and nails when intending udhiyah                                                     | Muslim 1977   | `muslim:5119` (1977.03); also 5120 (1977.04), 5121 (1977.05)                 | Umm Salamah: "When any one of you intending to sacrifice… enters the month (of Dhu'l-Hijja), he should not get his hair or nails touched."                            | sahih                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| "The best dua is the dua of the Day of Arafah"                                            | Tirmidhi 3585 | `tirmidhi:3585`                                                              | 'Amr ibn Shu'ayb from his father from his grandfather: "The best of supplication is the supplication of the Day of 'Arafah…"                                          | **Gradings differ.** Hasan (Ahmad Shakir, al-Albani); da'if (Zubair 'Ali Za'i). Stored as `disputed` and labelled "gradings differ" in the UI.                                                                                                                                                                                                                                                                                                     |
| Fasting the Day of Arafah (`dhulHijjah.arafah.fastBody`)                                  | Muslim 1162   | `muslim:2746` (1162.01)                                                      | Abu Qatadah: fasting the Day of 'Arafah, "I hope from Allah that it expiates the year before and the year after." The copy says "is hoped to", following the wording. | sahih                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Days of Tashriq are days of eating, drinking (and remembering Allah); no fasting          | Muslim 1141   | `muslim:2677` (1141.01), `muslim:2678` (1141.02, "and remembrance of Allah") | Nubaishah al-Hudhali.                                                                                                                                                 | sahih                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| No fast on Eid                                                                            | —             | Bukhari 1990 (already in `eid-guide.ts`)                                     | The fast checklist item is hidden on 12/10–13 (`deedsForDay`).                                                                                                        | sahih                                                                                                                                                                                                                                                                                                                                                                                                                                              |

**Corrections to the plan:**

- **Muslim refs:** the plan cites Muslim 1977 / 1162 / 1141 in Abd al-Baqi numbering. The app uses the corpus ids 5119, 2746 and 2677/2678.
- **Gradings:** Tirmidhi 3585 and Ahmad 5446 are not uniformly graded, and both are labelled.
- **Arafah fast:** the plan's "Arafah fast" note is restricted in copy to those **not on Hajj**. Bukhari 1988 (Umm al-Fadl: the Prophet ﷺ was not fasting at 'Arafah) underlies the common view that the pilgrim at 'Arafah does not fast. The UI only says "if you are not on Hajj".

## 2. Rulings and app choices

### Takbir al-Tashriq

- **Window and status:** from `rules.takbirTashriq` (`docs/proofs/madhhab.md`, `tashriq.takbir`).
  - Hanafi / Shafi'i / Hanbali: Fajr 9 → Asr 13, which is **23 slots**.
  - Maliki: Dhuhr 10 → Fajr 13, which is **15 slots**.
  - The unit tests pin both counts against the 1448 calendar.
- **Status copy:**
  - Hanafi: "wajib once after each fard".
  - Others: "sunnah".
  - All views: "windows differ by school", plus `<MadhhabNote id="tashriq.takbir">`.
- **Opening takbirs:** ×2 or ×3 per `openingTakbirs`.
- **Wording:**
  - The opening "Allahu akbar" is rendered from the bundled adhkar item `after_prayer-takbir`.
  - **The full Takbir al-Tashriq formula is not in the bundled adhkar dataset**, so it is not typed. The card describes its structure in words: "takbir, then the tahlil (La ilaha illallah), then two takbirs, then the tahmid".
  - Follow-up: add the formula to the build-data pipeline from a sourced dataset, then render it by reference.
- **Women:** "Men and women both say it; women say it quietly" (`dhulHijjah.tashriq.womenQuietly`).
  - The Shafi'i, Maliki and Hanbali manuals extend it to women, who say it quietly.
  - **Scholars differ** within the Hanafi school: Abu Hanifa restricts the wajib to men in congregation in a city; the Sahibayn, whose view is relied on for fatwa, make it on everyone who prays a fard.
  - The madhhab note carries the detail, and the copy asserts no obligation for women.
- **Tracker gating:** on the Tracker, the "Takbir said ✓" chip unlocks only after that fard is marked completed. It is hidden during hayd (no fard).

### Udhiyah

- **Status:** `udhiyah.status`.
  - Hanafi: wajib on the capable. The planner links to the zakat calculator for the nisab.
  - Others: sunnah mu'akkadah.
- **Window:** after the Eid prayer on 12/10 until sunset of 12/`lastDayHijri`.
  - Hanafi, Maliki and Hanbali: 12.
  - Shafi'i: 13.
  - All views shows both windows.
- **Minimum ages:** the plan's table is used as the headline, with a note that the schools word them differently.
  - **Hanafi** (al-Hidayah, Kitab al-Udhiyah):
    - sheep: 1 year, or a robust 6-month jadha';
    - goat: 1 year;
    - cow: 2 years;
    - camel: 5 years.
  - **Shafi'i** (Minhaj, Kitab al-Udhiyah):
    - sheep (jadha'): 1 year, or once its front teeth fall after 6 months;
    - goat: 2 years;
    - cow: 2 years;
    - camel: 5 years.
  - **Maliki** (Mukhtasar Khalil, Bab al-Udhiyah):
    - sheep: 1 year;
    - goat: 1 year;
    - cow: 3 years;
    - camel: 5 years.
  - **Hanbali** (Zad al-Mustaqni', Bab al-Hady wa'l-Udhiyah):
    - sheep: 6 months;
    - goat: 1 year;
    - cow: 2 years;
    - camel: 5 years.
  - The copy names the Shafi'i goat and the Maliki cow as examples, and tells the user to ask a local scholar or agency.
- **Shares:** a cow or camel may be shared by up to seven (Muslim 1318 = corpus `muslim:3185` (1318.01), Jabir: "a camel for seven persons and a cow for seven persons"; verified, not shown as an in-app ref). The Maliki school allows sharing the reward, not ownership. **Scholars differ**, and the planner only records the user's arrangement.
- **Distribution:**
  - Thirds is the Hanbali position (Kashshaf: thirds, from Ibn 'Abbas / Ibn Mas'ud). It is also the recommendation in Hanafi manuals (al-Hidayah: "yustahabbu an la yanqusa al-sadaqah 'an al-thuluth").
  - Shafi'i: eat a few morsels and give the rest; thirds is a second view.
  - Maliki: no fixed portion.
  - The copy therefore reads "Many scholars recommend thirds…; the schools differ on the exact portions" (all 24 locales).
- **Hair and nails:** `udhiyah.hairNails` (Muslim 1977).
  - Hanbali: haram.
  - Shafi'i / Maliki: makruh.
  - Hanafi: mustahabb to refrain.
  - **Window:** shown from 12/1 when the intention was set before the month, otherwise from the moment of intention. It ends when "slaughtered" is ticked, or after 12/13. Tests cover the mid-period intention.

### Excused periods

- Every Dhul-Hijjah reminder pauses during `activeExcusedReason` (§2.5).
- During hayd, the dashboard drops the fast item (fasting on hayd days is blocked by NF-3.2's `markFast`), the Tracker hides the takbir chips, and the copy invites zikr and dua. Nothing is labelled "missed".

### Fasting link (NF-3.2)

The fast checklist item is the NF-3.2 voluntary-fasting entry for that date (`markFast` / `clearFast` from `lib/voluntary-fasting`). It is not stored twice.

## 3. Dates

- All dates come from `lib/hijri.ts`, so the sighting location and the user's Hijri adjustment (D14) apply.
- **1 Dhul-Hijjah 1448 = Friday 7 May 2027** (Umm al-Qura, no observer; cross-checked against ICU `islamic-umalqura`).
- Arafah is 15 May, Eid al-Adha 16 May, and the last day of Tashriq 19 May 2027.
- The teaser starts on 25 Dhul-Qa'dah (2 May 2027), and the eve of the ten is 6 May 2027.
- The test fixture is `DHUL_HIJJAH_1448` (`apps/app/src/test-support/fixtures/seasonal.ts`).
- A per-month sighting override (`monthStarts["1448-12"]`) shifts the whole mode, and a test covers it.

## 4. Reminders (§11 tier 3 "seasonal")

- **Seasonal reminders:** `notificationPrefs.dhulHijjah`, default on:
  - the evening before 12/1 at 20:00, with the udhiyah prompt until an intention is set;
  - a morning card at 07:30 on 12/1–12/13;
  - the Arafah eve at 20:00 on 12/8.
- **Takbir reminders:** `notificationPrefs.takbirTashriq`, default **off**. They fire 10 minutes after each fard's start time inside the school's window (the union for all views). They need a real location.
- **Privacy:** the copy never mentions udhiyah names, amounts or excused state.

Review date: **2026-11-23** (ai-review).
