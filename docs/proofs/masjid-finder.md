# Proof log: Masjid finder & layer (NF-3.11, D5 / D12 / D26 / D11)

- **Feature:** list-first masjid finder from OpenStreetMap (v2, 2026-11-25: opt-in MapLibre + OpenFreeMap map in a WebView, no map SDK; Google Maps directions hand-off; centred on a one-off device fix), home masjid, the user's **private** iqamah / Jumu'ah times ("Your times"), and an opt-in iqamah "leave now" reminder.
- **Code:** API `apps/api/src/masjids/*` (read-only Overpass proxy + cache); shared `packages/shared/src/masjid/osm.ts` (types, geohash, `service_times` parser, Overpass parsing — self-contained for the API), `packages/shared/src/masjid/{iqamah,opening-hours}.ts`; app `apps/app/src/lib/masjid/*`, `apps/app/src/stores/home-masjid-times-store.ts`, `apps/app/src/lib/notifications/iqamah-reminders.ts`, `apps/app/src/components/masjid/*`, routes `apps/app/src/app/masjids/{index,times,[osmType]/[osmId]}.tsx`. Copy: `apps/app/scripts/i18n/masjid-finder-i18n.json`.
- **Review:** AI proof-backed review (D11), 2026-11-23.
- **Rendering rule:** no hadith text is typed. The three refs below are linked by reference (`EvidenceLinks` → hadith reader, corpus id) from `components/masjid/masjid-evidence.tsx`. The i18n labels are short descriptions of each hadith's topic, not quotations.

## 1. Evidence (verified against the corpus, 2026-11-23)

Checked by downloading `fawazahmed0/hadith-api@1` `editions/eng-bukhari.min.json` and `eng-muslim.min.json` and reading each entry. Bukhari corpus numbers equal sunnah.com numbers (`hadithnumber` = `arabicnumber`). **Sahih Muslim is paired by the corpus `arabicnumber` field** — the plan cites Abd al-Baqi numbers (see the numbering gotcha in the brief).

| Plan ref    | Corpus id (in-app) | `arabicnumber` | Content confirmed                                                                                                                                                   | Grade              |
| ----------- | ------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| Bukhari 645 | `bukhari:645`      | 645            | Ibn 'Umar: "The prayer in congregation is twenty seven times superior to the prayer offered by a person alone."                                                     | sahih (al-Bukhari) |
| Muslim 666  | `muslim:1521`      | 666            | Abu Hurairah: whoever purifies himself at home then walks to one of the houses of Allah to perform a fard — his steps (one erases a sin, the other raises a degree) | sahih (Muslim)     |
| Bukhari 444 | `bukhari:444`      | 444            | Abu Qatadah al-Aslami: "If anyone of you enters a mosque, he should pray two rak'at before sitting."                                                                | sahih (al-Bukhari) |

Cross-checks recorded (not linked in the UI):

- **Corpus `muslim:666` is unrelated** to the plan's "Muslim 666" — the in-app link uses `muslim:1521`.
- **Bukhari 646** (Abu Sa'id al-Khudri) gives _twenty-five_ degrees. Both narrations are sahih; scholars reconcile them (e.g. Ibn Hajar, _Fath al-Bari_, Kitab al-Adhan, under 645–646: the larger number for the jahri prayers / for the one who waits, or the later increase of reward). The UI label says "27 degrees" **citing 645 only**, which is exactly what that narration states.
- **Muslim 650** (corpus `muslim:1477`–`1480`, Ibn 'Umar) repeats the twenty-seven degrees, and **Muslim 714** (corpus `muslim:1654`–`1655`, Abu Qatadah) repeats the two rakahs on entering — consistent with the two Bukhari refs.

## 2. Claims and rulings

### 2.1 What the app says (and does not say)

- The finder shows **evidence links only** ("Why go to the masjid"): congregation (Bukhari 645), steps to the masjid (Muslim 666 / corpus 1521), two rakahs on entering (Bukhari 444).
- It **does not state a ruling** on congregational salah, never nudges "you missed the masjid", and never judges attendance.
- **Follow-up pass (2026-11-24):** an optional "Prayed at the masjid" toggle on obligatory Salah (PrayerLog `atMasjid` + `masjidId` = the home masjid OSM ref; separate from `isJama`; offered when a home masjid is set, an existing flag is always clearable) and a neutral "At the masjid" statistic (count + per week; rendered only when the period has any; excused days and sunnah excluded — `apps/app/src/lib/masjid/masjid-stats.ts`). These are the user's own records, never a score or a nudge.

### 2.2 Congregational salah — scholars differ (recorded, not displayed as a ruling)

- **Hanafi:** sunnah mu'akkadah, close to wajib; many later Hanafis say wajib (al-Hidayah, Bab al-Imamah; Ibn 'Abidin, _Radd al-Muhtar_).
- **Maliki:** sunnah mu'akkadah (Mukhtasar Khalil, Bab Salat al-Jama'ah).
- **Shafi'i:** fard kifayah per the sahih/asahh view (al-Nawawi, _Minhaj al-Talibin_; _al-Majmu'_), sunnah per another view.
- **Hanbali:** wajib ('ayn) on men, though the salah of one who prays alone is valid (Ibn Qudamah, _al-Mughni_; _Zad al-Mustaqni'_).
- **App behaviour:** because the schools differ, the app shows the virtue hadith only and makes no claim of obligation. No `FIQH_DIFFERENCES` row is added since no ruling is rendered.

### 2.3 Tahiyyat al-masjid (rawatib hub hint, `/rawatib#tahiyyat`)

- **Claim behind the hint hook:** two rakahs on entering the masjid before sitting are recommended (Bukhari 444; Muslim 714).
- **Schools:** sunnah/mustahabb in all four schools (majority); they differ on praying it in the times when nafl is disliked — Shafi'i: allowed (it has a cause; _Minhaj_); Hanafi and Maliki: not prayed in those times; Hanbali: differing reports, the madhhab view being not to pray it then except during the Friday khutbah (_al-Mughni_).
- **App behaviour (2026-11-24):** the rawatib hub renders `TahiyyatHint` (`apps/app/src/components/masjid/tahiyyat-hint.tsx`): a short description ("the Sunnah is to pray two rakahs before sitting down"), the evidence by reference (`MASJID_EVIDENCE.tahiyyat` → `bukhari:444`, no typed hadith text), an optional neutral line naming the next iqamah at the home masjid ("arriving a few minutes early leaves time for these two rakahs" — no notification, no nudge), and `<MadhhabNote id="masjid.tahiyyat" />`.
- **`FIQH_DIFFERENCES` row `masjid.tahiyyat`** (domain `salah`, guide-note only — no calculator consumes it; `usedIn: ["/rawatib#tahiyyat"]`, covered by the existing `/rawatib` pending entry in `difference-coverage.test.ts`). The earlier note suggested the id `masjid.tahiyyatForbiddenTimes`; the row also covers the Friday-khutbah difference, so it is named `masjid.tahiyyat`.

  | School  | Position shown (`fiqh.diff.masjid.tahiyyat.*`)                                                                                                                                           | Sources                                                                                                |
  | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
  | Hanafi  | Sunnah; not prayed in the disliked times (after Fajr and Asr, sunrise, zenith, sunset), nor once the imam has begun the Friday khutbah                                                   | _al-Hidayah_ (al-awqat al-makruhah; Bab al-Jumu'ah); _Radd al-Muhtar_                                  |
  | Maliki  | Same as Hanafi: no nafl begun after Fajr / Asr; no salah begun once the imam comes out for the khutbah, even by one entering                                                             | _Mukhtasar Khalil_ (nafl; Bab al-Jumu'ah); _al-Sharh al-Kabir_ with al-Dasuqi                          |
  | Shafi'i | Sunnah; prayed even in the disliked times because it has a preceding cause (entering); during the khutbah, two short rakahs                                                              | _Minhaj al-Talibin_ (disliked times "except for a cause"); _Tuhfat al-Muhtaj_; Bukhari 930; Muslim 875 |
  | Hanbali | Sunnah; relied-on view: not prayed in the disliked times even with a cause (_Zad al-Mustaqni'_), another report from Ahmad allows it (_al-Mughni_); during the khutbah, two short rakahs | _Zad al-Mustaqni'_; _Kashshaf al-Qina'_; _al-Mughni_; Bukhari 930                                      |

  Nuance recorded, not displayed: for the Shafi'is, entering _in order to_ pray tahiyyah in a disliked time is itself disliked (_Tuhfah_).
- **Refs verified against the corpus (2026-11-24, fawazahmed0 `eng-bukhari` / `eng-muslim`):**

  | Print ref   | Corpus id     | `arabicnumber` | Content confirmed                                                                        |
  | ----------- | ------------- | -------------- | ---------------------------------------------------------------------------------------- |
  | Bukhari 444 | `bukhari:444` | 444            | "If anyone of you enters a mosque, he should pray two rak`at before sitting."            |
  | Muslim 714  | `muslim:1654` | 714.01         | Abu Qatadah: two rakahs before sitting (corpus `muslim:714` is unrelated)                |
  | Bukhari 930 | `bukhari:930` | 930            | Jabir: a man entered during the Friday khutbah — "Get up and pray two rak`at" (also 931) |
  | Muslim 875  | `muslim:2018` | 875.01         | Jabir: the same incident — "stand and offer two rakahs"                                  |
  | Bukhari 586 | `bukhari:586` | 586            | Abu Sa'id: no prayer after the morning prayer till sunrise, nor after Asr till sunset    |
  | Muslim 831  | `muslim:1929` | 831            | 'Uqbah ibn 'Amir: three times the Prophet forbade praying (sunrise, zenith, sunset)      |

  All sahih (al-Bukhari / Muslim). Muslim refs use the corpus id in-app with the Abd al-Baqi number in `arabicNumber`.

### 2.4 Iqamah times are the user's own or a licensed public source — never guessed

- **Rule (D5):** times shown in order: the user's private times ("Your times") → a licence-cleared public source → **nothing**. With nothing, all iqamah UI is hidden and features fall back to adhan times. Tested in `packages/shared/src/masjid/__tests__/masjid.test.ts` (precedence) and `apps/app/src/lib/masjid/masjid.test.ts`.
- **OSM `service_times`:** Friday entries between 11:00 and 15:30 are shown as "Jumu'ah (from OpenStreetMap)"; anything else is shown verbatim as "Service times (from OpenStreetMap)" and is **never** reinterpreted as a per-prayer iqamah time; unparseable values are hidden (tested).
- **Jumu'ah vs Dhuhr:** on Fridays `iqamahFor(date, "dhuhr")` returns the Jumu'ah iqamah, or nothing — a weekday Dhuhr time is never reused for Jumu'ah (tested).

### 2.5 Excused periods

- The iqamah reminder is skipped entirely while `activeExcusedReason` is set (hayd/nifas — salah is not prayed, consensus; illness and travel — no nudges, per plan §2.5). Tested in `iqamah-reminders.test.ts`.

## 3. Public iqamah feed licence reviews (§13 item 2, D12 / D26)

Reviewed 2026-11-23. **Result: no candidate feed passes D12.** Only OpenStreetMap data and the user's private times are shown; the `TimetableSource` registry (`apps/api/src/masjids/timetable-source.ts`) ships empty.

| Candidate                                                              | What it offers                                                | Licence / terms found                                                                                                                                                                                                                                                              | D12 verdict                                                                                          |
| ---------------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **MAWAQIT** (mawaqit.net)                                              | Mosque-managed prayer + iqamah times, very wide coverage (EU) | Help centre, "Can I use your API?": "Our API is currently private and not publicly available." No data licence; only embeddable widgets for the mosque's own site. Third-party wrappers / scrapers (e.g. parse.bot listing, `mrsofiane/mawaqit-api`) carry no rights from MAWAQIT. | **Fail** — private API, no redistribution licence; scraping would breach "no scraping" rule          |
| **eSalah** (esalah.com)                                                | Public API + embed of mosque times                            | Terms: API free under a rate limit, attribution "appreciated"; but "Do not use our API … to power a competing directory" and "Don't … scrape". No licence for the mosque/iqamah data itself.                                                                                       | **Fail** — a masjid finder is a directory use the terms exclude; data licence unclear                |
| **Masjidi API** (Ummah Services, `github.com/MasjidiApp/MasjidiAPI`)   | REST API with crowdsourced iqamah times                       | Repo has **no LICENSE file**; README calls it an "open API platform" (not a licence); production keys by WhatsApp request; no terms for data reuse.                                                                                                                                | **Fail** — no licence; data is crowdsourced user content (conflicts with D5's public-data principle) |
| **Masjid Atlas** (AnsarLabs, `gitlab.com/AnsarLabs/foss/masjid-atlas`) | Community CSV/JSON iqamah schedules per masjid                | GitLab project `license: null`; no LICENSE file in the tree (`masjids/`, `ui/`, `README.md`); README has no data licence. `location.lat/lon` may be null and there is no OSM id field, so no confident match (≥ 0.9 name + ≤ 75 m) is possible either.                             | **Fail** — no licence (all rights reserved by default)                                               |
| **Masjidal / Athan+** (masjidal.com)                                   | Mosque-registered iqamah times in their own app               | No public API documentation or developer/data terms found.                                                                                                                                                                                                                         | **Fail** — no public licence                                                                         |
| **"Muslim Prayer Times" WordPress plugin / SalahAPI spec**             | Software some mosques run on their own sites                  | GPL covers the plugin code, not each mosque's published times; would require per-site scraping with per-site terms.                                                                                                                                                                | **Fail** — no data licence; scraping                                                                 |
| **OpenStreetMap `service_times`**                                      | Jumu'ah / service times mapped in OSM                         | ODbL 1.0 — redistribution allowed with attribution "© OpenStreetMap contributors" and share-alike for derived databases.                                                                                                                                                           | **Pass** (already the v1 source)                                                                     |

**ODbL compliance:** attribution "© OpenStreetMap contributors" (linking to `openstreetmap.org/copyright`) is on every list and detail screen (`components/masjid/osm-attribution.tsx`), in every API response (`attribution`), and in Credits (`packages/shared/src/constants/credits.ts`, id `masjids-osm`). The API cache is a produced work served unchanged in structure; corrections are sent upstream ("Report a problem on OpenStreetMap" → `openstreetmap.org/<type>/<id>`).

**Overpass usage policy:** one identifying generic User-Agent (`MunibTrackerMasjidFinder/1.0 (+https://munibtracker.app; read-only cached proxy)`, no personal data), a 20 s per-mirror server timeout, per-cell cache (7-day fresh / 30-day stale), cross-instance cold-miss lock, and a global upstream budget (20/min, 5,000/day) well under the public-instance guidance (~10,000 queries/day). Transient upstream failures (429 / 5xx / timeout / non-JSON body) fall through to the next mirror — overpass-api.de → overpass.private.coffee → overpass.kumi.systems — within one 30 s deadline. `OVERPASS_URL` (https only; one URL or a comma-separated list, tried in order) can point at a self-hosted instance.

**Primary upstream — Geoapify (2026-11-25):** public Overpass instances were unreliable (502s / hangs), so when `GEOAPIFY_API_KEY` is set the proxy asks Geoapify Places first (free plan, no billing; same OSM data — each feature's `datasource.raw` OSM tags + `osm_id`/`osm_type` are mapped to Overpass-shaped elements, so the same masjid rules and parsers apply). Categories `religion.place_of_worship.islam` + `tourism.sights.place_of_worship.mosque`, the same coarse bbox, nearest 200 (≤ 10 credits); details by `osm_id`/`osm_type`. A per-UTC-day credit budget (`GEOAPIFY_DAILY_CREDITS`, default 3,000: 70 % cells at worst case, 25 % details, 5 % margin) keeps within the free quota; spent budget, failure or no key → Overpass. Free-plan terms require Geoapify attribution, so responses add `Powered by Geoapify` beside the ODbL line while a key is configured.

## 4. Privacy review

- The client sends only a **geohash-5 cell (~5 km)**; exact distances are computed on-device. Requests use plain `fetch` with `credentials: "omit"` and no Authorization header (no user id, no session cookie). Query validation rejects anything but a 5-char geohash, and extra fields (e.g. `lat`) are rejected by the global `forbidNonWhitelisted` pipe (tested).
- The API logs no cell, OSM ref or IP; rate limits key on a truncated SHA-256 of the IP. No Postgres tables, no migration.
- The home masjid lives in the user's own preferences; private times live in blob `home_masjid_times` (own devices only) and are never sent to the masjids API.
- Reminder text is generic ("Time to head to the masjid" / "<Salah> iqamah in N min") — no masjid name on the lock screen.

## 5. TV

- The list is read-only on TV (no directions, no set-home, no private-times editing) for the paired location (the synced `location` blob); TV never requests GPS.

## 6. Not shipped in this pass (follow-ups)

- **Shipped 2026-11-24:** PrayerLog `atMasjid` / `masjidId` toggle + masjid statistics (§2.1); home-hero iqamah countdown (`useIqamahCountdown` — only when iqamah times exist and the next iqamah is ≤ 3 h away; otherwise nothing extra is rendered); feature-tour step + Learn search entry for `/masjids`; tahiyyat hint (§2.3); timetable OCR import (NF-3.12, `docs/proofs/timetable-ocr.md`).
- **Shipped 2026-11-25:** in-app map (List | Map toggle; `lib/masjid/map-html.ts`, `components/masjid/masjid-map{,.web}.tsx`): MapLibre GL JS `5.6.0` from unpkg with SRI, OpenFreeMap `dark`/`positron` styles, OSM names embedded as script-safe JSON and set via `textContent` only, host↔map messages validated (`parseMasjidMapMessage`), web iframe `sandbox="allow-scripts allow-popups"` (opaque origin), native WebView blocks every navigation (links open in the browser). Opt-in because OpenFreeMap sees the displayed area. Directions → Google Maps URL (`maps-link.ts`), destination coordinates only. Search origin = one-off `getCurrentCoordinates()` fix (Balanced accuracy, never persisted); saved location fallback.
- Still open: geofence (v2).
