# Proof log: Sunnah rawatib + Witr retrofit (NF-3.1, §4.1.4 Witr row; D8/D11)

- **Feature:** track the confirmed sunnah prayers attached to the fard (12 / 10 a day, D8), optional ghayr mu'akkadah extras, and the madhhab-aware Witr label / qaza default / Witr info sheet.
- **Code:** `packages/shared/src/utils/rawatib.ts` (presets, windows, excused filtering, stats, nudge, Witr helpers), `packages/shared/src/constants/index.ts` (`RAWATIB_*`), `packages/shared/src/fiqh/differences.ts` (new row `rawatib.fajrMakeup`), `apps/app/src/lib/rawatib.ts` (evidence ids), `apps/app/src/components/rawatib/*`, `apps/app/src/app/rawatib/index.tsx`, `apps/app/src/components/witr-qaza-info.tsx`. Copy: `apps/app/scripts/i18n/rawatib-i18n.json`.
- **Review:** AI proof-backed review (D11), 2026-11-23. Per-school rulings reuse the entries already recorded in [`madhhab.md`](./madhhab.md) (`rawatib.preset`, `travel.rawatib`, `witr.status`, `witr.form`, `witr.qaza`); this log records the new claims and the evidence the rawatib screens render.
- **Rendering rule:** no hadith text is typed. Every hadith below is rendered by reference (`HadithExcerptCard hadithId="<collection>:<number>"`) from the corpus the app fetches, `fawazahmed0/hadith-api@1`. In-app ids use the **corpus** number.
- **UI disclaimer:** "For your own situation, consult a qualified scholar." (`fiqh.disclaimer`) on the hub and the Witr sheet.

## 1. Evidence (verified against the corpus, 2026-11-23)

Checked by downloading `editions/eng-<collection>.min.json` and reading each entry. Bukhari, Abu Dawud and Tirmidhi corpus numbers equal sunnah.com numbers; **Sahih Muslim is paired by the corpus `arabicnumber` field** (the plan cites Abd al-Baqi numbers).

| Plan ref       | Corpus id (in-app)                                  | Content confirmed                                                                              | Grade recorded                                                                |
| -------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Muslim 728     | `muslim:1694` (728.01; also 1695–1697 = 728.02–.04) | Umm Habibah: twelve rakahs in a day and night, a house built in Jannah                         | sahih (Muslim)                                                                |
| Muslim 725     | `muslim:1688` (725.01; 1689 = 725.02)               | 'A'ishah: the two rakahs of dawn are better than the world and what it contains                | sahih (Muslim)                                                                |
| Tirmidhi 415   | `tirmidhi:415`                                      | The twelve listed: 4 before Dhuhr, 2 after, 2 after Maghrib, 2 after Isha, 2 before Fajr       | Sahih (Shakir, al-Albani, Zubair 'Ali Za'i); Hasan Sahih (Bashar 'Awwad)      |
| Tirmidhi 423   | `tirmidhi:423`                                      | "Whoever did not pray the two rakahs of Fajr, let him pray them after the sun has risen"       | **disputed**: Sahih (Shakir, al-Albani) vs Da'if (Zubair 'Ali Za'i)           |
| Tirmidhi 430   | `tirmidhi:430`                                      | "May Allah have mercy on a man who prays four before Asr"                                      | Hasan (Shakir, al-Albani, Bashar 'Awwad); isnad hasan (Za'i)                  |
| Bukhari 1180   | `bukhari:1180`                                      | Ibn 'Umar's ten: 2 before and 2 after Dhuhr, 2 after Maghrib, 2 after Isha, 2 before Fajr      | sahih (Bukhari)                                                               |
| Bukhari 1182   | `bukhari:1182`                                      | 'A'ishah: he never left four before Dhuhr and two before Fajr                                  | sahih (Bukhari)                                                               |
| Bukhari 1183   | `bukhari:1183`                                      | "Pray before Maghrib" (thrice) … "for whoever wishes", lest people take it as a fixed practice | sahih (Bukhari)                                                               |
| Bukhari 624    | `bukhari:624`                                       | "Between every two adhans (adhan and iqamah) there is a salah … for whoever wishes"            | sahih (Bukhari)                                                               |
| Abu Dawud 1271 | `abudawud:1271`                                     | "May Allah show mercy to a man who prays four rakahs before Asr"                               | Hasan (al-Albani, Muhyi al-Din 'Abd al-Hamid, al-Arna'ut); isnad hasan (Za'i) |

**Added beyond the §12 register** (needed for the optional "+2 after Dhuhr" extra and the Witr sheet):

| Ref                                 | Corpus id       | Content confirmed                                                                   | Grade recorded                                                                                                                                                                                                                                                       |
| ----------------------------------- | --------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Abu Dawud 1269 (= Tirmidhi 427/428) | `abudawud:1269` | Umm Habibah: whoever keeps four before and four after Dhuhr will not enter the Fire | Sahih (al-Albani, 'Abd al-Hamid, Za'i); Tirmidhi 428 Hasan Sahih (Bashar)                                                                                                                                                                                            |
| Abu Dawud 1431                      | `abudawud:1431` | Abu Sa'id: whoever oversleeps or forgets Witr, let him pray it when he remembers    | **disputed**: Sahih in the corpus grades (al-Albani; isnad sahih per Za'i), but al-Tirmidhi (after 465–466) judged the mursal of Zayd ibn Aslam more authentic. Used only as supporting evidence that Witr is made up; never as the sole basis of a school's ruling. |

Abu Dawud 1270 (four before Dhuhr, "the gates of heaven are opened") was checked and **not used**: the corpus grades differ (Hasan / Hasan li-ghayrihi vs Da'if, and Abu Dawud himself calls 'Ubaidah weak).

## 2. Claims and rulings

### 2.1 Which rows are rawatib (mu'akkadah)

- **Claim:** the confirmed rawatib are 2 before Fajr, 2 or 4 before Dhuhr, 2 after Dhuhr, 2 after Maghrib, 2 after Isha.
- **Sources:** Bukhari 1180 (ten), Tirmidhi 415 and Muslim 728 (twelve), Bukhari 1182 (four before Dhuhr).
- **Schools:** see `madhhab.md` § `rawatib.preset`. Hanafi 12 (al-Hidayah, Bab al-Nawafil); Shafi'i and Hanbali 10 (Minhaj; Zad: "al-rawatib 'ashr"); Maliki: no fixed count in the texts — **10 is the app default under D8**, labelled as such.

### 2.2 Preset 12 vs 10 (D8)

- **Rule:** the preset follows the madhhab and is editable; preset 12 logs 4 before Dhuhr by default, preset 10 logs 2; any row log can be changed between 2 and 4 by long-press.
- **No school chosen:** the tracker asks (12 or 10, "Not now") and never silently picks a school. Neutral copy only.

### 2.3 Optional extras (ghayr mu'akkadah)

| Extra                     | Default rakahs | Evidence                                             |
| ------------------------- | -------------- | ---------------------------------------------------- |
| 4 before Asr              | 4 (2 allowed)  | Abu Dawud 1271, Tirmidhi 430                         |
| 2 before Maghrib          | 2              | Bukhari 1183 ("for whoever wishes")                  |
| 2 (or 4) before Isha      | 2              | Bukhari 624 (a salah between every adhan and iqamah) |
| +2 after Dhuhr (making 4) | 2              | Abu Dawud 1269 / Tirmidhi 428                        |
- All are labelled "Extra" and are off unless the user adds them. They never count toward the 12 / 10 target or a "full day".

### 2.4 Fajr sunnah after sunrise (new difference `rawatib.fajrMakeup`)

- **App behaviour:** the Fajr sunnah row stays loggable from Fajr until Dhuhr; logged after sunrise it is stored with `late: true`. The hub shows the school's view.
- **Evidence both sides discuss:** Tirmidhi 423 (`disputed`, see §1).
- **Hanafi:** when missed together with the fard it is made up with it before zawal; missed alone it is not made up per Abu Hanifa and Abu Yusuf, while Muhammad allowed it after sunrise until zawal (al-Hidayah, Bab Idrak al-Faridah).
- **Shafi'i:** making up timed nawafil, including the rawatib, is mustahabb per the azhar (Minhaj) — consistent with the `witr.qaza` entry in `madhhab.md`.
- **Maliki:** the Fajr raghibah is the one nafl that is made up, after sunrise until zawal (Mukhtasar Khalil: "wa la yuqda ghayru fardin illa hiya").
- **Hanbali:** making up a missed ratibah is sunnah (Zad al-Mustaqni': "wa man fatahu shay'un minha sunna lahu qada'uhu").

### 2.5 Never qaza, never fard statistics

- **Claim:** rawatib are sunnah; missing them creates no debt. The app never prompts qaza for them and keeps them out of `QAZA_PRAYER_SET`, `OBLIGATORY_PRAYER_SET`, streaks, perfect days and fard rates (regression tests in `utils/rawatib.test.ts` and `lib/statistics.test.ts`). Statuses are only `completed` / not logged.
- **Source:** the definition of sunnah (Bukhari 46, already in `madhhab.md` § `witr.status`: nothing beyond the five is due "unless you volunteer").

### 2.6 Excused periods

- **Hayd / nifas:** all rawatib rows are hidden (salah is not prayed during hayd/nifas — consensus; `madhhab.md` § hayd). Nothing appears in notifications.
- **Illness:** rows stay visible; nothing is expected and nothing is judged.
- **Travel:** only the Fajr sunnah row stays; the rest collapse under "Optional while travelling". This matches every school's position in `madhhab.md` § `travel.rawatib` (Hanafi: optional while moving except the Fajr sunnah; Hanbali: may leave them except the Fajr sunnah and Witr; Shafi'i/Maliki: they remain sunnah and may be left). The per-school note is shown via `MadhhabNote id="travel.rawatib"`. Witr has its own section and is unaffected.

### 2.7 Visibility windows

- A row shows from its fard's time until the next fard's time; Isha rows run to the next Fajr. These are display windows for minimal-tap logging, not rulings; "Show all of today's rawatib" lifts them, and a logged row never disappears. The Fajr sunnah window to Dhuhr matches the make-up limit of the Hanafi (Muhammad) and Maliki views (until zawal).

### 2.8 After-fard nudge (opt-in, §11 tier 5)

- Off by default; generic text ("The sunnah after {{prayer}} — whenever you're ready."), no judgement, paused during any excused period. No religious claim.

## 3. Witr retrofit (§4.1.4)

- **Label:** "Wajib in the Hanafi school" / "Sunnah mu'akkadah in your school" / both views with no school chosen. Source: `madhhab.md` § `witr.status` (al-Hidayah; Minhaj; Mukhtasar Khalil; Zad; Abu Dawud 1422; Bukhari 46).
- **Qaza accrual default:** `MADHHAB_RULES[m].witr.qazaDefault` — on only for Hanafi; Shafi'i, Maliki and Hanbali users may opt in from the Witr sheet. With no school chosen the app keeps its earlier behaviour (it asks each time a Witr is marked missed). Existing qaza counters are never changed by picking a school.
- **Maliki correction honoured:** the Witr sheet shows the school's own make-up rule from `witr.qaza` — for Maliki, **Witr is not made up once Subh has been prayed** (`madhhab.md` correction 1, Mukhtasar Khalil). The old hard-coded table said "Recommended" for Maliki; it was replaced by the catalog note. The opt-in toggle remains available (the user's choice), with that note directly above it.
- **Form:** shown per school from `witr.form` (Hanafi three with one salam and qunut before ruku all year; Shafi'i/Hanbali one to eleven; Maliki one after a separate shaf').
- **Removed copy:** the earlier hand-typed hadith paraphrase in `qaza.witrNote.evidenceBody` is no longer rendered; Abu Dawud 1431 is shown by reference instead (grading noted as disputed in §1).

## 4. Statistics copy

- "Full day" = all five mu'akkadah rows logged; excused days are left out. No "house in Jannah" numbers are computed or displayed; the hadith itself is shown in the hub.

## 5. Open points

- None blocking. If a future review prefers a different grading label for Abu Dawud 1431 or Tirmidhi 423, update §1 and the `grade` of `rawatib.fajrMakeup`'s ref.
