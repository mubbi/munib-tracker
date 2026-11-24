# Article writing brief (resources hub)

Articles are typed data. Each file is `src/content/resources/articles/<slug>.ts` and exports
`export const article: Article = { ... }` (type in `src/content/types.ts` — read it first).

```ts
import type { Article } from "@/content/types";

export const article: Article = {
  slug: "how-to-build-a-daily-zikr-routine",
  category: "zikr",
  title: "How to Build a Daily Zikr Routine That Lasts",          // H1, natural, ≤ 70 chars
  seoTitle: "How to Build a Daily Zikr Routine (Simple Steps)",   // ≤ 60 chars, no brand
  seoDescription: "…",                                            // 140–160 chars, plain
  description: "…",                                               // 1–2 sentences for cards
  keywords: ["daily zikr routine", "how to do zikr daily", "dhikr routine"],
  cluster: "zikr",
  published: "2026-11-23",
  updated: "2026-11-23",
  takeaways: ["…", "…", "…"],                                     // 3–5 bullets
  body: [ { type: "p", text: "…" }, { type: "h2", text: "…" }, … ],
  sources: [{ label: "Sahih al-Bukhari 6407 — Sunnah.com", url: "https://sunnah.com/bukhari:6407" }],
  faqs: [{ question: "…", answer: "…" }],                         // 2–4, optional
  appTieIn: { feature: "zikr-tracker", text: "…" },               // one honest sentence or two
  related: ["/resources/zikr/morning-and-evening-adhkar", "/features/zikr-tracker"],
};
```

Block types: `p`, `h2`, `h3`, `ul`, `ol`, `steps`, `table`, `note` (tone `info` | `scholar` | `app`),
`evidence` (kind `quran` | `hadith`, optional `arabic`, `translation`, `reference`, `href`, `note`).
Inline markup inside strings: `[label](/path)` links and `**bold**` only. No HTML, no other markdown.

## Voice

- Written for an ordinary Muslim reader. Plain, warm, specific English. Short paragraphs.
  No "In today's fast-paced world", no "unlock", "elevate", "journey" clichés, no stacked adjectives.
- Genuinely useful even if the reader never downloads the app. The app appears **at most twice**
  in the body (ideally one `note` with tone `app`, plus the `appTieIn`). Never an ad disguised as advice.
- Encourage consistency without guilt. Never shame the reader.
- 1,100–1,600 words of body text. Use 4–7 `h2` sections. Use `steps`/`table` only where they help.
- Use these exact spellings: **Salah, Zikr (pl. Adhkar), Qaza, Adhan, Tasbeeh, Dua, Masjid, rakah/rakahs,
  Tarawih, Qur'an, Fajr, Dhuhr, Asr, Maghrib, Isha, Witr, Tahajjud, Sunnah, Nafl, Wudu, Ghusl.**
  You may mention a common alternate spelling once for search (e.g. "Zikr (also written dhikr)",
  "Qaza (also spelled qada or qadha)") — once only.
- Use "ﷺ" after the Prophet's name the first time, then "the Prophet ﷺ".

## Religious accuracy — non-negotiable

- Every Qur'an ayah or hadith you quote must be **verified at the source** before you use it.
  - Qur'an Arabic: copy verbatim from the bundled Tanzil Uthmani text at
    `apps/app/assets/data/quran/arabic/NNN.json` (keys are ayah numbers, `NNN` = zero-padded surah).
    Translation: copy the **Saheeh International** text from `https://quran.com/<surah>/<ayah>`
    (fetch it) and set `note: "Translation: Saheeh International"`. Link `href` to that quran.com URL.
  - Hadith: fetch the sunnah.com page (e.g. `https://sunnah.com/bukhari:6464`) and copy the English
    and, if you include it, the Arabic matn verbatim. You may also use the bundled files
    `apps/app/assets/data/hadith/{riyad-as-salihin,nawawi40,zikr-sources}.json`. Give the collection and
    number (e.g. "Sahih al-Bukhari 6464; Sahih Muslim 783"). Prefer Bukhari/Muslim; if you use another
    collection, include the grading shown on sunnah.com in `note`.
  - If you cannot fetch and confirm a text, **do not quote it.** Paraphrase without quotation marks
    and without a reference, or leave it out. Never write Arabic from memory.
- Do not issue rulings. Where schools differ (e.g. how Qaza is made up, Witr), describe the main
  positions neutrally, name the school where you are confident, and add a `note` with tone `scholar`
  recommending a qualified scholar for the reader's own situation.
- No invented statistics, studies, scholars, quotes, endorsements, or testimonials.
- Every quoted reference also goes into `sources`.

## Internal links (use only these paths)

Features: /features/salah-tracker · /features/qaza-salah-tracker · /features/zikr-tracker ·
/features/quran · /features/quran-practice · /features/learn-quran · /features/daily-islamic-habits ·
/features/worship-progress · /features/prayer-times-qibla · /features/widgets-and-devices
Audiences: /for/new-muslims · /for/quran-learners · /for/beginners · /for/families
Articles:
/resources/salah/how-to-build-a-consistent-salah-habit · /resources/salah/what-is-qaza-salah ·
/resources/salah/how-to-track-missed-prayers · /resources/zikr/how-to-build-a-daily-zikr-routine ·
/resources/zikr/morning-and-evening-adhkar · /resources/quran-learning/how-to-start-learning-the-quran ·
/resources/quran-learning/how-to-improve-quran-recitation ·
/resources/quran-learning/how-to-practice-quran-reading-every-day ·
/resources/quran-learning/how-to-help-children-learn-the-quran ·
/resources/quran-learning/how-to-memorize-the-quran ·
/resources/islamic-habits/how-to-stay-consistent-with-daily-worship ·
/resources/islamic-habits/how-to-build-better-islamic-habits
Other: /learn (in-app learning library overview) · /how-it-works · /faq
Use 2–4 contextual internal links in the body, plus 3–5 hrefs in `related`.

## Verified Munib Tracker facts (do not claim anything beyond this list)

- Free, no ads, no subscriptions or in-app purchases. No account needed (guest mode stores data on the
  device); optional Google/Apple/Facebook sign-in to sync. iOS, Android, web app, Apple TV/Android TV;
  Apple Watch + Wear OS companions; home-screen widgets. 24 interface languages.
- **Salah tracker:** log each of the five fard Salah with a status (prayed on time, delayed/late, missed,
  Qaza, plus excused days for travel/illness/hayd), Witr separately, Sunnah/Nafl (Tahajjud, Ishraq,
  Duha, etc.), Jama'ah toggle, private notes, streaks, calendar, progress ring.
  Khushu' journal (rate focus per Salah, notes).
- **Qaza:** per-prayer Qaza counters (missed entries feed them), a lifetime calculator to estimate a
  backlog (with a scholar disclaimer), a daily-pace planner that shows an estimated finish date,
  missed-fast tracking, a history log, bulk import.
- **Zikr:** 60 adhkar in seven categories (morning, evening, after Salah, before sleep …) with source
  hadith shown per zikr; guided adhkar sessions (one screen, tap to count, auto-advance) for morning,
  evening, before sleep, and after each Salah; favorites; custom adhkar builder; free tasbeeh counter
  with targets; 293 duas (Hisnul Muslim) in 16 categories; 9 duroods; the 99 Names with audio.
- **Qur'an:** full Qur'an offline (surah, juz, 604-page mushaf), word-by-word, tajweed colouring,
  25 translation editions (two bundled), tafsir on demand, several reciters, bookmarks, khatm reading
  plan with daily target, hifz (memorization) tracker.
- **Qur'an practice:** optional on-device listener (~70 MB download) follows your recitation word by
  word. Modes: Follow, Check (words to try again after each ayah), Hide words, Hide ayahs. No scores.
  Revision queue spaced at 1, 3, 7, 14, then 30 days, optional reminder. Voice processed on the device,
  never recorded or uploaded. Works best in a quiet room with one voice at a normal pace; **may be less
  reliable for children's voices.** It is a practice aid and does not replace a teacher. It does not
  grade tajweed rules. Optional separate pronunciation drill for selected tajweed lessons.
- **Learn the Qur'an:** Arabic letters (28) with pronunciation, learn-to-read lessons, tajweed rules,
  memorization guidance, vocabulary, themes, prophet stories, daily tadabbur reflections, quizzes.
- **Habits & progress:** Today's goal (Salah + zikr + Qaza), optional reminders (all off by default):
  prayer times with adhan, adhkar, before-sleep, Qaza, Friday; Ramadan and Tahajjud trackers, White
  Days fasting checklist, Friday checklist. Statistics (week/month/year), weekly worship report,
  achievements and "Noor" devotion levels that never cap out.
- **Learning library:** aqeedah, prophets, seerah, sahaba, the Hereafter, salah guide (24 lessons),
  taharah/wudu guide, new-Muslim guide (18 topics), Hajj & Umrah, zakat calculator — all cited.
- **Also in the app (NF-3.x, verified against the app code and `docs/proofs/` on 2026-11-24):**
  "My madhhab" setting (Hanafi / Shafi'i / Maliki / Hanbali / show all views; differences labelled in
  guides and calculators — zakat nisab and jewellery, fidyah, qasr, hayd/nifas, Witr); redesigned
  searchable Settings; Hijri date adjustment (±2 days plus per-month corrections); Rawatib tracker (12
  Hanafi / 10 other schools, editable); voluntary fasting planner (disliked days labelled, prohibited days
  blocked); Dhul-Hijjah mode (daily deeds, Day of Arafah, Takbir al-Tashriq by school, udhiyah planner);
  daily Sunnah habits; eight tasbeeh designs (Ring default, sliding beads, digital clicker, Focus /
  Night, date pits / pebbles with a grading note, finger counting, geometric rosette, night sky — the
  last four not on TV; optional sound and haptics); hands-free tasbeeh for **any zikr**: the user
  teaches it by saying it 1–3 times, then only repeats of that zikr count (on the device, no download;
  a short voice pattern, not a recording, stays on the device; labelled "tap to correct any miscount",
  never claimed perfect); or skips teaching to count every pause (labelled less accurate);
  preferred-time reminders (optional, per school; none in all-views mode); nightly muhasabah;
  family-ties reminders; debts and trusts record (optional document photo, encrypted, never synced);
  wasiyyah builder with PDF export; weekly gentle coach (simple rules on the device — **not AI**) fed
  by a daily Qur'an reading log;
  mirath calculator (four schools; educational, "consult a qualified scholar / Shariah court" — never a
  ruling); Umrah mode (miqat check, tawaf and sa'i counters); ayah notes and highlights; Arabic root-word
  search (Quranic Arabic Corpus, optional ~6 MB download, credited); Salah focus lock (iPhone and
  Android: blocks chosen apps; gentle / firm / strict, emergency unlocks; app choices stay on the device);
  Masjid finder (OpenStreetMap, list-first with "open in Maps", no in-app map; no public iqamah
  timetables; private home-masjid iqamah times typed in or scanned from a timetable photo — read on the
  device, iOS Vision / Android ML Kit / in-browser engine after a one-time ~7 MB download, always
  reviewed before saving, photo copy deleted; iqamah countdown on home and an iqamah reminder;
  "prayed at the masjid" on fard Salah with a weekly count in statistics; only a ~5 km area cell is
  sent); family and kids mode (parent-managed profiles for children under 13, nickname and birth year
  only; kids Salah path — wudu, the five prayers, how to pray — and curated prophet stories; parents
  see fard Salah status only); accountability partner (shares only "done"); group khatm (30 juz / 60
  hizb / 114 surahs); circle push notifications and a weekly family digest (counts only); an
  encrypted vault for muhasabah, will, debts and relatives with opt-in end-to-end encrypted sync
  (passphrase + 24-word recovery code; the server stores ciphertext only).
- **Pronunciation check (NF-3.24) and tajweed coaching (NF-3.15) — describe exactly this:** the check
  ships in its basic (D24 fallback) form: after you read the ayah on screen aloud, words that seem
  **skipped or unclear** are marked (gently, never red); tap a word to hear the reciter; if the reading
  doesn't match it says it couldn't follow. On the device (no audio stored or uploaded), phone and web,
  not TV. It does NOT judge tajweed or letter-level makharij, misses some errors (especially
  similar-sounding letters), and was evaluated on reference + synthetic audio only — never claim
  accuracy. Tajweed coaching: a short, spaced plan of tajweed sounds that appear in the ayahs you
  practise (example words can come from the check), rule explanations (qalqalah, ghunnah, shaddah,
  madd, hamzat al-wasl, sun letters, idgham without ghunnah), sound drills for qalqalah / ghunnah /
  shaddah and listen-and-repeat cards for the rest; no scores; it can't check tajweed inside an ayah
  and doesn't measure madd length.
- **Not shipping — never mention as a feature:** hadith audio (no licence-cleared human recordings; no
  synthetic voice).
