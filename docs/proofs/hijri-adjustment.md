# Proof log: Hijri date adjustment (D14, plan §4.5.11)

- **Feature:** user Hijri date adjustment. It has a −2…+2 whole-calendar offset and per-month "this month started on…" corrections, and it keeps every month at 29 or 30 days.
- **Code:** `apps/app/src/lib/hijri-adjustment.ts`, `apps/app/src/lib/hijri.ts`, `apps/app/src/components/hijri/*`
- **Review:** AI proof-backed review (D11), 2026-11-23

## 1. Claim: months begin with the sighting of the crescent and are completed to 30 days when it isn't seen

The UI shows no scripture text. This claim is the basis for two things:

- the copy "Follow the announcement your community follows";
- the invariant that a month is always 29 or 30 days.

| Ref (plan)               | Corpus id in the app           | Checked                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Bukhari 1909             | `bukhari:1909`                 | Verified 2026-11-23 against the app's hadith source (`fawazahmed0/hadith-api@1`, the CDN that `apps/app/src/api/hadith-remote.ts` loads). `editions/ara-bukhari/1909.json` and `eng-bukhari/1909.json`: Book 30 (Fasting), in-book number 19, `hadithnumber` = `arabicnumber` = 1909. Narrated by Abu Hurayrah: «صُومُوا لِرُؤْيَتِهِ، وَأَفْطِرُوا لِرُؤْيَتِهِ، فَإِنْ غُبِّيَ عَلَيْكُمْ فَأَكْمِلُوا عِدَّةَ شَعْبَانَ ثَلاَثِينَ». The number and the text match.                                                                                                                                              |
| Muslim 1081              | `muslim:2514` (also 2515–2517) | **Numbering pitfall.** The plan's "1081" is the Fuad Abd al-Baqi number. In the app's corpus, `muslim:1081` (`hadithnumber` 1081) is an unrelated hadith in the Book of Prayers (`arabicnumber` 480.06). The fasting hadith is `editions/{ara,eng}-muslim/sections/13.json` (Book of Fasting), `hadithnumber` 2514–2517 = `arabicnumber` 1081.01–1081.04. All are narrated by Abu Hurayrah and say: fast when you see it, break the fast when you see it, and if it is clouded over, complete thirty. Any in-app link must use `muslim:2514`, never `muslim:1081`. |
| (supporting) Muslim 1080 | `muslim:2498`–`2506`           | `arabicnumber` 1080.01–1080.09 (Ibn 'Umar): "the month may be twenty-nine…". This supports the 29-day lower bound.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

**Grading:** both are in the Sahihayn and agreed upon (muttafaq 'alayh), so they are sahih.

**Rule as implemented:** a month can't be shorter than 29 days, because the crescent isn't sought before the 29th. It can't be longer than 30, because the month is completed to 30. Every effective month start is therefore clamped to `[P + 29, P + 30]`, where `P` is the previous month's start. A correction that would break this is never offered (see `monthStartChoices`).

## 2. Real-world fixture: Ramadan 1445

The fixture is asserted in `hijri-adjustment.test.ts`, under "real-world fixture: Ramadan 1445".

| Authority                                           | 1 Ramadan 1445                                                                                                                          | Source                                                                                                                                                                                                                                                                                                                         |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Saudi Arabia (Supreme Court; matches Umm al-Qura)   | **Monday 11 March 2024**. The crescent was sighted on the evening of 10 March (29 Sha'ban) at Sudair and Al-Hariq. Sha'ban was 29 days. | [Saudi Gazette: Supreme Court calls for sighting on Sunday evening](https://saudigazette.com.sa/article/641059/SAUDI-ARABIA/Supreme-Court-calls-for-Ramadan-crescent-sighting-on-Sunday-evening); [The News: Ramadan moon spotted in Saudi Arabia](https://thenews.com.pk/latest/1166657-ramadan-moon-spotted-in-saudi-arabia) |
| Pakistan (Central Ruet-e-Hilal Committee, Peshawar) | **Tuesday 12 March 2024**. The sighting was announced on the evening of 11 March by chairman Maulana Abdul Khabir Azad.                 | [Arab News PK](https://www.arabnews.pk/node/2474901/pakistan); [Daily Pakistan, 11 Mar 2024](https://en.dailypakistan.com.pk/11-Mar-2024/ramadan-2024-moon-sighted-in-pakistan); [The News: first fast today](https://thenews.com.pk/amp/1167260-ramazan-moon-sighted-first-fast-today)                                        |
| Pakistan, 1 Shawwal 1445 (Eid al-Fitr)              | **Wednesday 10 April 2024**. This is the same day as Saudi Arabia.                                                                      | [Dawn](https://www.dawn.com/news/1826713); [Arab News PK](https://www.arabnews.pk/node/2490301/pakistan)                                                                                                                                                                                                                       |

**What the test checks:**

- The test reads Sha'ban 1445's length from the Umm al-Qura table; it is not hard-coded. The table gives 29 days, which matches the Saudi announcement.
- A `1445-09 → 2024-03-12` correction makes 12 March 1 Ramadan and 11 March 30 Sha'ban, so Sha'ban becomes 30 days.
- The calendar then converges back to Umm al-Qura at Shawwal: 1 Shawwal = 10 April 2024. This matches Pakistan's announced Eid. Ramadan 1445 is therefore 29 days under the correction.

Add further announced months here as they are verified.

## 3. Neutrality: global vs local sighting

**Claim:** no single method is presented as the correct one. The copy says "Follow the announcement your community follows". The prediction source is shown as a fact ("Umm al-Qura" or "Crescent visibility at <place>"), not as a recommendation.

**Basis:** scholars differ on whether a sighting in one region binds another (ikhtilaf al-matali').

- **Kurayb's report (Muslim 1087).** Corpus id `muslim:2528`, `arabicnumber` 1087, Book of Fasting; verified as above. Ibn 'Abbas in Madinah did not follow the Friday sighting in Syria. Scholars who consider each region's own sighting cite this report. This is the position widely attributed to the Shafi'i school when regions are far apart.
- **Majority view.** Many Hanafi, Maliki and Hanbali authorities hold that a sighting established anywhere binds everyone it reaches. They take the general address of "fast when you see it" (Bukhari 1909) as their basis.

Per D11 these per-school attributions are summarised, not quoted. The app takes no position: it offers both computed bases and lets the user record their community's announcement. It never clears a correction silently. After a move it asks "Keep or clear?".

## 4. What the feature does not claim

- It does not claim that any computed date (Umm al-Qura, Yallop visibility or tabular) is the religiously binding start of a month. Those are predictions, labelled as such.
- It does not move fasting or other day logs. Logs are stored by Gregorian date. Only Hijri labels and Hijri-derived schedules (Ramadan, white days 13–15, Islamic events, seasonal and Friday reminders) follow the adjustment.
