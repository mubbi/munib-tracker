# Munib Tracker

**Tagline:** Track Your Journey Back to Allah.

A free, offline-first companion for salah, zikr, qaza, Qur'an, hadith, and daily worship — on phone, tablet, web, watch, and TV. No ads. No account required.

- **App Store:** [apps.apple.com/app/id6787222180](https://apps.apple.com/app/id6787222180)
- **Google Play:** [play.google.com/store/apps/details?id=app.munibtracker](https://play.google.com/store/apps/details?id=app.munibtracker)
- **Web app:** [my.munibtracker.app](https://my.munibtracker.app)
- **Site:** [munibtracker.app](https://munibtracker.app)
- **Source:** [github.com/mubbi/munib-tracker](https://github.com/mubbi/munib-tracker)

---

## Inspiration

You know the feeling. You glance at the clock, realise Asr slipped away an hour ago, and something tightens in your chest.

Maybe it has been longer than one prayer. Maybe there is a stretch of months you would rather not count. Most Islamic apps I tried in that moment were content dumps with a crescent icon — more library than companion, more guilt than plan. They wanted an account before you could log a single salah. They nagged. They were useless on a plane or in a basement masjid with no signal.

**Munib (مُنيب)** is an Arabic word for the one who turns back — who returns to Allah in repentance. Not once, dramatically. Over and over, quietly, for a lifetime. It appears in the Qur'an: Ibrahim (peace be upon him) is described as *munīb* in Surah Hud (11:75), and Surah Qaf (50:33) speaks of the one who comes *bi-qalbin munīb* — with a returning heart.

That word is the entire reason this app exists.

I wanted a tracker that treats returning as a habit, not a spectacle: honest salah logging, missed prayers you can actually clear, daily zikr, and a place to renew tawbah. Gentle encouragement. Never shame. Offline by default. Private until you choose otherwise.

The name is not decoration. It is the thesis.

---

## What it does

Munib Tracker is a calm, offline-first worship companion. Start as a guest in under a minute. Sign in only if you later want encrypted cloud sync.

**Salah on your journey.** Log each obligatory prayer — completed, missed, delayed, or qaza — with a progress ring, streaks, notes, and an honest calendar. Five fard prayers plus Witr and sunnah categories. Ramadan, travel (qasr / jam'), illness, and hayd / excused modes so the tracker follows your actual capacity, not a spreadsheet.

**Make up what was missed.** Per-prayer qaza counters sync from missed tracker entries. Estimate a lifetime backlog, set a daily pace with a realistic ETA, and track missed fasts — with scholar-aware disclaimers, not a fatwa.

**Remember Allah daily.** Morning, evening, and situational adhkar with favorites you can reorder. A tactile tasbeeh counter. A custom adhkar builder. Bedtime-aware before-sleep reminders. One tap for Today's Repentance.

**Qur'an, hadith & duas — offline.** Full mushaf (surah, juz, 604-page view, word-by-word, tajweed). Bookmark ayahs, listen to recitation, search without a connection. Bundled Nawawi 40 and Riyad as-Salihin; six major hadith collections on demand. Duas by category, duroods, and the 99 Names with audio.

**Learn your deen.** Structured, cited lessons on aqeedah, the 25 prophets, seerah, major battles, Sahaba, Jannah, Jahannam, and the Last Day — with progress and quizzes. Practical guides for salah, wudu, zakat, Friday/Jumu'ah, Hajj and Umrah, travel, hayd, and tahajjud.

**Prayer times & qibla.** Accurate times for your location (GPS or city search), Hijri calendar with Islamic events, qibla compass with alignment haptic on native, optional adhan at prayer time.

**See your progress.** Week, month, and year charts. Infinite achievement tracks for salah, streaks, zikr, and consistency. Growing Noor devotion levels. Reminders for prayer, zikr, qaza, and Friday — every category off until you enable it.

**Find guidance quickly.** One fuzzy search bar across ayahs, hadith, duas, adhkar, duroods, and the Names of Allah. Arabic-aware normalization. Typo-tolerant offline search.

**Wherever you are.** iPhone, Android, iPad, Android tablets, web/PWA, Apple TV, and Android TV / Fire TV from one Expo codebase. Home-screen widgets, iOS Live Activities / Dynamic Island, Apple Watch, Wear OS, Siri, and Google Assistant. PIN or biometric app lock.

**24 languages.** English, Arabic, Urdu, Indonesian, Turkish, Bengali, Malay, Persian, French, Hindi, Hausa, Swahili, Russian, and more — with RTL for Arabic, Urdu, Persian, Pashto, and Kurdish. Scripture language and interface language stay separate.

**Private by default.** Local-first storage. Optional encrypted cloud sync (Google, Apple, or Facebook). Export and import local backups. Delete account and data anytime. No ads. No behavioural tracking. No account required to use the full app.

---

## How I built it

Munib Tracker is a **pnpm + Turborepo** monorepo designed around two hard problems: reliable offline worship tracking, and a large bundled content library that must never invent scripture.

| Piece | Stack |
|-------|--------|
| Product app | Expo SDK 57 — iOS, Android, web, Apple TV, Android TV (`react-native-tvos` + `EXPO_TV=1`) |
| Marketing site | Next.js 16 + Tailwind CSS v4 |
| API | NestJS 11 — auth, OpenAPI, typed cloud sync |
| Admin console | Next.js ops console (users, reports, in-app / push broadcasts) |
| Shared packages | Domain types, theme tokens, API contract + Orval client, ActivityKit / surface-push delivery, store screenshot specs |

**Offline-first.** Worship data lives in AsyncStorage repositories and `useSyncExternalStore` stores — no SQLite, no account, no network required for the core journey. Cloud sync is last-write-wins across typed records and blob entities, with a manual sync status UI when you opt in.

**Content pipeline.** Qur'an, hadith, adhkar, duas, and the 99 Names are sourced from open datasets, generated into `apps/app/assets/data/` by `pnpm --filter app build:data`, and shipped with a credits registry. Generated files are never hand-edited. Religious text is never AI-authored. Extra Qur'an editions and full hadith collections fetch cache-first from CDNs.

**Native surfaces.** Widgets, Live Activities, Siri/Assistant intents, Apple Watch, and Wear OS share an `appSurfaces` snapshot (App Group on iOS). ActivityKit remote push and Expo / Web Push use framework-agnostic delivery packages so a Nest job today can become a Fly worker later.

**i18n.** 24 UI catalogs via `react-i18next`, locale-on-demand `import()`, ICU plural audits, and 24 learn-content overlay modules. RTL is a first-class layout, not a CSS afterthought.

**Quality gates.** Biome, Conventional Commits, Husky pre-push `pnpm check:ci` (lint → types → test → build → OpenAPI drift), Release Please per-app semver, and Maestro only for store screenshot capture.

---

## Challenges I ran into

**One codebase, many form factors.** Phone, tablet, web, watch, and TV are the same product — but TV is a 10-foot Leanback experience, Watch is a companion, and widgets are a read model with a mark-command queue. Phone-only plugins must be omitted when `EXPO_TV=1`. Phone and Android TV share package `app.munibtracker`, so version codes have to stay unique across both form factors. Switching phone ↔ TV always needs a clean prebuild.

**Offline scripture at scale without wrecking startup.** The app has 200+ Expo routes, ~12 MB of bundled religious data, and 24 locale catalogs. Native Metro is a single Hermes graph, so "just React.lazy the screens" does not split the native bundle. On web, Qur'an JSON in `__common` would destroy first paint — so corpora load via dynamic `import()`, home is a thin hero shell, and search indexes stay off the critical path. Lab Lighthouse still fights the Expo/RN web runtime; payload work is never finished, only managed.

**i18n that does not invent the deen.** Twenty-four locales, five RTL scripts, ICU plurals (especially Arabic and Russian), and a hard rule that scripture translations come from OSS datasets — never generated copy. UI language and `translationLocale` are separate prefs so someone can run an English interface with an Urdu mushaf. Store listings add another layer: 24 in-app locales plus six ASO-only markets, Apple's 2.3.7/2.3.10 copy rules (no "free" / no mentioning Android on iOS), and Play's 80-character short descriptions.

**Trust.** Qaza rulings differ by madhhab. Prayer times differ by calculation method and Asr madhab. The app has to offer estimates, pickers, and disclaimers without pretending to be a mufti. Reminders are opt-in because a worship tracker that nags by default becomes background noise — or worse, shame.

**Closed-app "now" on the lock screen.** Live Activities and Android ongoing notifications need shared salah-phase windows, App Group snapshots, and remote APNs / Expo / Web Push when the process is dead. Delivery has to be atomic (claim a job, send once) so a prayer-time update does not double-fire.

---

## Accomplishments that I'm proud of

- Shipping a **full worship companion** — tracker, qaza planner, zikr, library, lessons, and guides — that works **offline and without an account**.
- One Expo app on **phone, tablet, web, Apple TV, and Android TV / Fire TV**, plus widgets, Live Activities, Watch, Wear, Siri, and Assistant.
- **24 languages** with real RTL, separate scripture vs UI locale, and store copy to match.
- A content pipeline that **never AI-authors Qur'an or hadith**, with credits you can audit.
- Privacy as a default: local-first, optional sync, optional lock, no ads, delete-anytime.
- The whole monorepo public under **PolyForm Noncommercial 1.0.0** — inspectable by the ummah, not free for resale.
- Tone. The calendar stays honest. Encouragement stays gentle. Returning is allowed to take a lifetime.

---

## What I learned

**Systems beat motivation.** A backlog of missed prayers feels infinite until it is a number with a pace. Ten make-up prayers a day is nothing until you see it become three thousand in a year.

**Offline-first is a product decision, not a persistence library.** If the happy path requires a network round-trip, people will not log Maghrib on the train.

**Universal React Native is real — and expensive.** TV focus, Watch complications, WidgetKit budgets, and web `__common` size are different sports. Sharing a domain model is the win; sharing every UI chrome is the trap.

**i18n is architecture.** Locale-on-demand loading, RTL layout, ICU plurals, and "do not generate scripture" have to be encoded in the pipeline, or the last locale will lie.

**Trust in a deen app is earned in the footnotes.** Calculation methods, madhhab pickers, scholar disclaimers, open datasets, and a license people can read matter as much as the progress ring.

**Opt-in is a feature.** Twelve notifications a day become noise. One reminder for your weakest prayer becomes a habit.

---

## What's next for Munib Tracker

Shipped work lives in [`FEATURES.md`](./FEATURES.md). Open work is tracked in [`BACKLOG.md`](./BACKLOG.md). The next honest slice:

- **Nearby masjid finder** (optional, opt-in maps + Friday times) — the one competitor feature still missing.
- **Richer local adhan** — expand the bundled MP3 set beyond the baseline + CDN styles.
- **Live Activity delivery worker** on Fly.io if QStash + cron is no longer enough for the prayer-time backlog.
- **Web performance** — keep shrinking the Expo/RN `__common` runtime so first paint on mobile web matches native calm.
- **Watch / Wear QA** on every native bump (complications and tiles drift easily).
- **visionOS and native desktop** stay out of scope on purpose — the PWA covers the desk; fewer surfaces done well beats every screen half-done.

Translations, bug fixes, documentation, and careful content-pipeline work are the most useful contributions. The project does not accept sponsorship, funding, or donations.

May Allah accept every return, however many times it takes.
