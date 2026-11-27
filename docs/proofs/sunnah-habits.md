# Proof log: Daily Sunnah habits (NF-3.5, D11)

- **Feature:** a small, personal checklist of everyday sunnahs, with 30-day consistency dots, a daily "Sunnah spotlight" and optional custom habits (`/habits`, Tracker section, home module `sunnah-habits`).
- **Code:** catalog `packages/shared/src/content/sunnah-habits.ts`; logic `apps/app/src/lib/sunnah-habits.ts`; copy `apps/app/scripts/i18n/sunnah-habits-i18n.json` (`sunnahHabits.*`, `seasonalEvidence.*`, `fiqh.diff.hayd.quranRecitation.*`).
- **Review:** AI proof-backed review (D11), 2026-11-23. In-app copy is procedural only. No hadith or Qur'an text is typed: Qur'an refs open the reader at the ayah, and hadith refs are shown as citations.
- **UI disclaimer:** "For questions about your own situation, consult a qualified scholar." (`sunnahHabits.disclaimer`).

## 0. How the refs were checked

- **Qur'an:** checked against the bundled corpus, `apps/app/assets/data/quran/translation/en-pickthall/<surah>.json`.
- **Hadith:** checked against the corpus the app renders, `fawazahmed0/hadith-api@1` (the same full-collection `eng-*` editions used by `docs/proofs/madhhab.md`). For Bukhari and Tirmidhi, the corpus `hadithnumber` equals the sunnah.com and print number.
- **Sahih Muslim:** the corpus numbers it sequentially. Each Muslim ref therefore stores the corpus number and the Abd al-Baqi number (`arabicNumber`), paired by the corpus `arabicnumber` field. The UI shows the Abd al-Baqi (print) number.
- **Grades:** recorded as the corpus grade list gives them. Bukhari and Muslim are sahih.

## 1. Catalog evidence (plan §12 "Sunnah habits")

| Habit                               | Plan ref         | Corpus id                                        | Content confirmed                                                                                                                                                                                                                                                                                                                                                   | Grade                                                                                                         |
| ----------------------------------- | ---------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `miswak`                            | Bukhari 887      | `bukhari:887`                                    | Abu Hurayrah: "If I had not found it hard for my followers… I would have ordered them to clean their teeth with siwak for every prayer."                                                                                                                                                                                                                            | sahih                                                                                                         |
| `wudu_before_sleep`                 | Bukhari 247      | `bukhari:247`                                    | Al-Bara' ibn 'Azib: "Whenever you go to bed perform ablution like that for the prayer, lie on your right side and say…"                                                                                                                                                                                                                                             | sahih                                                                                                         |
| `sleep_right_side`                  | Bukhari 247      | `bukhari:247`                                    | Same hadith: lie on the right side, with the bedtime dua. The dua text comes from the before-sleep adhkar (row link), not from here.                                                                                                                                                                                                                                | sahih                                                                                                         |
| `ayat_kursi_sleep`                  | Bukhari 2311     | `bukhari:2311`                                   | Abu Hurayrah guarding the zakat al-fitr: "Whenever you go to bed, recite Ayat al-Kursi…"; the Prophet ﷺ: "He really spoke the truth, although he is an absolute liar."                                                                                                                                                                                              | sahih (Bukhari reports it ta'liqan, with "Uthman ibn al-Haytham said"; it is in the corpus under this number) |
| `mulk_nightly`                      | Tirmidhi 2891    | `tirmidhi:2891`                                  | "There is a surah in the Qur'an of thirty ayat which intercedes for a man until he is forgiven: Tabarak alladhi biyadihil-mulk."                                                                                                                                                                                                                                    | hasan (Ahmad Shakir, al-Albani, Bashar 'Awad); isnad hasan (Zubair 'Ali Za'i)                                 |
| `istighfar_100`                     | Muslim 2702      | `muslim:6858` (2702.01), `muslim:6859` (2702.02) | Al-Agharr al-Muzani: "…I seek forgiveness from Allah a hundred times a day"; and "O people, seek repentance from Allah…"                                                                                                                                                                                                                                            | sahih                                                                                                         |
| `salawat`                           | (durood dataset) | —                                                | Counted on the tasbeeh (`after_azan-salawat`, linked like Istighfar) with a manual done tick on the habits screen; the bundled durood collection (`/duroods`, sourced per item — [`duroods.md`](./duroods.md)) carries each wording's source. The daily target (default 10) is an **app default** that the user sets. No virtue is claimed for a particular number. | —                                                                                                             |
| `salam_home`                        | Qur'an 24:61     | 24:61                                            | "…But when ye enter houses, salute one another with a greeting from Allah, blessed and sweet." The row links to the bundled dua `daily-entering-home`.                                                                                                                                                                                                              | Qur'an                                                                                                        |
| `spread_salam`                      | Muslim 54        | `muslim:194` (54.01)                             | Abu Hurayrah: "…Should I not direct you to a thing which, if you do, will foster love amongst you: spread salam."                                                                                                                                                                                                                                                   | sahih                                                                                                         |
| `eat_right_bismillah`               | Bukhari 5376     | `bukhari:5376`                                   | 'Umar ibn Abi Salamah: "O boy! Mention the Name of Allah and eat with your right hand, and eat of the dish what is nearer to you."                                                                                                                                                                                                                                  | sahih                                                                                                         |
| `smile`                             | Tirmidhi 1956    | `tirmidhi:1956`                                  | Abu Dharr: "Your smiling in the face of your brother is charity…"                                                                                                                                                                                                                                                                                                   | sahih (Ahmad Shakir, al-Albani); isnad hasan (Zubair 'Ali Za'i)                                               |
| `daily_sadaqah`                     | Bukhari 1442     | `bukhari:1442`                                   | "Every day two angels come down… 'O Allah! Compensate every person who spends in Your cause'…"                                                                                                                                                                                                                                                                      | sahih                                                                                                         |
| `daily_sadaqah` (added)             | —                | `bukhari:1417`                                   | 'Adi ibn Hatim: "Save yourself from Hell-fire even by giving half a date-fruit in charity." This supports the copy "even something small", which 1442 alone does not state.                                                                                                                                                                                         | sahih                                                                                                         |
| `morning_adhkar` / `evening_adhkar` | (adhkar dataset) | —                                                | Auto-checked from the bundled adhkar sets (`lib/adhkar-history.ts`), where each item carries its own source.                                                                                                                                                                                                                                                        | —                                                                                                             |
| list principle                      | Bukhari 6464     | `bukhari:6464`                                   | 'A'ishah: "…the most beloved deed to Allah is the most regular and constant even if it were little." This is behind the 12-habit cap and the "keep it short and steady" copy.                                                                                                                                                                                       | sahih                                                                                                         |

**Corrections to the plan:**

- **Muslim 2702 / Muslim 54:** the in-app ids are the corpus numbers 6858 and 194. The corpus `muslim:2702` and `muslim:54` are unrelated hadith.
- **Bukhari 1417:** added for "even something small".

## 2. Rulings and app choices

- **Linked habits are derived, never double-stored.**
  - Morning and evening adhkar are done when that day's whole set is done in the zikr tracker.
  - Istighfar is the tasbeeh count of `anytime-istighfar`. Its bundled entry itself cites Muslim 2702.
  - Daily sadaqah is auto-checked by any entry in the sadaqah log. A manual tick covers giving that isn't logged.
- **No streak-loss language.** The dots show only the days a habit was kept, and an empty dot is "a new chance". This follows plan §2.5 (gentle tone).
- **Custom habits carry no evidence.** The UI says so (`sunnahHabits.customHint`).
- **Excused periods:**
  - Hayd and illness don't pause habits: they aren't worship-gated (plan NF-3.5).
  - The evening nudge is generic and continues during excused periods.
  - **Reciting the Qur'an during hayd** affects Ayat al-Kursi and al-Mulk. These rows show the labelled difference `hayd.quranRecitation` (new in `FIQH_DIFFERENCES`). Nothing is hidden.

### hayd.quranRecitation: reciting the Qur'an during hayd

- **Hanafi:**
  - Not recited with the intention of reciting the Qur'an.
  - Verses said with the intention of dua or praise, and listening, are allowed.
  - Sources: al-Hidayah, Kitab al-Taharah, Bab al-Hayd wa'l-Istihadah; Radd al-Muhtar, same bab.
- **Shafi'i:**
  - Not recited with the intention of Qur'an (even part of an ayah).
  - Said with the intention of zikr, it is allowed.
  - Sources: Minhaj al-Talibin, Kitab al-Taharah, Bab al-Hayd (and Bab al-Ghusl for what is forbidden to the junub); Tuhfat al-Muhtaj.
- **Hanbali:**
  - Not recited. Less than an ayah, and zikr phrases, are allowed.
  - Ibn Taymiyyah held recitation permissible, but that is not the madhhab's mu'tamad.
  - Sources: Zad al-Mustaqni', Bab al-Hayd; Kashshaf al-Qina'.
- **Maliki:**
  - The menstruating woman may recite from memory (unlike the junub). She does not touch the mushaf.
  - Sources: Mukhtasar Khalil, Bab al-Hayd ("wa man'u… massu mushafin, la qira'atun"); al-Sharh al-Kabir with Hashiyat al-Dasuqi.
- **Evidence the schools discuss:**
  - Tirmidhi 131 (Ibn 'Umar): "The menstruating woman and the junub do not recite anything of the Qur'an." It is graded da'if by al-Albani, Bashar 'Awad and Zubair 'Ali Za'i, and munkar by Ahmad Shakir. It is stored as `disputed`, and it is never the sole basis of a claim.
  - Bukhari 305 ('A'ishah: "do what all the pilgrims do except tawaf"). Those who permit recitation cite it.
- **Agreed by all four:** listening is allowed. The copy says so ("Listening is fine").

## 3. Reminders (§11 tier 5)

- **Evening nudge:** `notificationPrefs.habits`, default off, at 20:30. It is one DAILY repeat (one OS slot) and only when at least one habit is selected. The copy is generic and never lists what is undone (privacy).
- **Bedtime habits:** they fold into the existing before-sleep reminder body (`sunnahHabits.reminder.beforeSleepBody`), with no extra slot.

Review date: **2026-11-23** (ai-review).
