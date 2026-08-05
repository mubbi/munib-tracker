<!--
PUBLISHING METADATA — not part of the article body.
Copy the fields below into your CMS / Medium / Next.js metadata, then publish
everything from the H1 onward as the article.
-->

## 1. SEO Title

**Munib Tracker: Free Salah, Zikr & Qaza Prayer Tracker (Offline + Open Source)**

## 2. Meta Description (160 characters)

> Munib Tracker is a free, offline-first app to track salah, clear qaza prayers, and keep daily zikr. Prayer times, Qur'an, adhkar, reminders. No ads, no paywall.

## 3. URL Slug

`munib-tracker-salah-zikr-qaza-tracker`

## 4. Featured Snippet Answer (52 words)

> Munib Tracker is a free, offline-first Islamic app for tracking salah, qaza (missed prayers), and daily zikr. It includes prayer times, qibla, an offline Qur'an and hadith library, adhkar, a tasbeeh counter, and opt-in reminders. It runs on iPhone, Android, web, Apple TV, and Android TV — no account needed.

---

# Munib Tracker: Track Your Journey Back to Allah — Free Salah, Zikr & Qaza Companion

<!-- MEDIUM IMAGE: upload docs/article_imgs/21-hero-return-to-allah.png -->
![A glowing path leading toward dawn, symbolising a Muslim returning to Allah in repentance](./article_imgs/21-hero-return-to-allah.png)

*The journey of Munib: turning back to Allah, again and again.*

You know the feeling. You glance at the clock, realise Asr slipped away an hour ago, and something tightens in your chest.

Maybe it's been longer than one prayer. Maybe there's a stretch of months you'd rather not count. Maybe your dhikr quietly stopped somewhere between work, family, and everything else.

Here's the thing most of us forget in that moment: the door back is still open. It was never the closing kind.

**Munib (مُنيب)** is an Arabic word for the one who turns back — who returns to Allah in repentance. Not once, dramatically. Over and over, quietly, for a lifetime.

That word is the entire reason this app exists.

Munib Tracker is not another content dump with a crescent icon. It's a **tracker and a reminder** for the walk back: honest salah logging, missed prayers you can actually clear, daily zikr, gentle nudges, and a place to renew tawbah. Free, offline-first, no ads, no paywall on the journey.

**Tagline:** *Track Your Journey Back to Allah.*

I built it as a calm companion for that return — then made the entire codebase public so the ummah can use it, inspect it, and improve it.

<!-- MEDIUM IMAGE: upload docs/article_imgs/00-logo.png -->
![Munib Tracker app icon featuring the name Munib in Arabic script](./article_imgs/00-logo.png)

*Munib (مُنيب) Tracker — the app mark.*

---

## Quick summary

If you only read one section, read this one.

- **Munib** means the one who returns to Allah in repentance — the app is built around that meaning
- A free **salah tracker, qaza planner, and zikr companion** — built on encouragement, not guilt
- Offline Qur'an, hadith, duas, and structured lessons sit right beside the trackers
- One app across **iPhone, Android, tablets, web/PWA, Apple TV, and Android TV / Fire TV**
- Widgets, Live Activities, Apple Watch, Wear OS, Siri, and Google Assistant
- **Guest mode** — no account required; cloud sync is optional and comes later
- No ads. No paywall on the core worship journey
- Religious text comes from **open datasets**, never AI-generated scripture
- Full monorepo public under **PolyForm Noncommercial 1.0.0**

---

## Table of contents

1. [What does Munib mean?](#what-does-munib-mean)
2. [What is Munib Tracker?](#what-is-munib-tracker)
3. [Why tracking your worship actually helps](#why-tracking-your-worship-actually-helps)
4. [Core features](#core-features-of-munib-tracker)
5. [How to start in five minutes](#how-to-start-in-five-minutes)
6. [Common mistakes when catching up on missed prayers](#common-mistakes-when-catching-up-on-missed-prayers)
7. [Every screen you already use](#every-screen-you-already-use)
8. [Under the hood, for developers](#under-the-hood-for-developers)
9. [Open source and license](#open-source-and-license)
10. [Download and links](#download-and-links)
11. [FAQ](#frequently-asked-questions)
12. [Key takeaways](#key-takeaways)

---

## What does Munib mean?

**Munib (مُنيب)** describes a person who turns back — one who returns to Allah in repentance and keeps returning.

The word appears in the Qur'an. Allah describes Ibrahim (peace be upon him) as *"ḥalīmun awwāhun munīb"* in Surah Hud (11:75), and Surah Qaf (50:33) speaks of the one who comes *"bi-qalbin munīb"* — with a returning heart. Open the [full mushaf](/quran/) and read those verses in context; the Arabic will land better than any paraphrase of mine.

> **Did you know?** *Munib* comes from *inābah* — turning to Allah in repentance. Arabic dictionaries describe it as a turning back that repeats, not a single one-time U-turn. The word itself allows for the fact that you'll need to come back more than once.

That's a mercy hiding in plain sight.

Every Muslim knows the return isn't a one-time event. You slip. You miss Fajr. Your tasbeeh sits untouched for a week. Then you turn again. And again.

Munib Tracker was built for that cycle. It exists so "returning" isn't only a feeling you have at 2 a.m. — it becomes something you can **track**, **remember**, and **rebuild**, one honest day at a time.

The name isn't decoration. It's the whole thesis.

---

## What is Munib Tracker?

Munib Tracker is a free, offline-first worship companion for Muslims rebuilding their relationship with salah and dhikr.

<!-- MEDIUM IMAGE: upload docs/article_imgs/01-home-store.png -->
![Munib Tracker home screen showing prayer times, next prayer countdown, and today's worship goals](./article_imgs/01-home-store.png)

*Home: prayer times, today's goals, and an honest start to the day.*

In practice, you use it to:

- **Log salah honestly** — completed, missed, delayed, or qaza
- **Clear what was missed** at a pace you can realistically keep
- **Keep daily dhikr alive** with adhkar collections and a free tasbeeh counter
- **Renew today's repentance** — one tap when you've made tawbah
- **Read Qur'an and hadith offline**, with no signal required
- **Learn fiqh, aqeedah, and seerah** through short, cited lessons

Three design rules shaped every screen: encouragement stays gentle, the calendar stays honest, and your data lives on your device first.

Start as a guest. Create an account only if you later want cloud sync.

### Where to open it

| Surface | Link |
|---------|------|
| Marketing site | [munibtracker.app](https://munibtracker.app) |
| Web app (PWA) | [my.munibtracker.app](https://my.munibtracker.app) |
| iOS | [App Store — Munib Tracker](https://apps.apple.com/app/id6787222180) |
| Android | [Google Play — Munib Tracker](https://play.google.com/store/apps/details?id=app.munibtracker) |

---

## Why tracking your worship actually helps

Let's be honest about what an app can and can't do.

Returning to Allah needs sincerity, and no software produces that. Tawbah happens in the heart. What a tool *can* do is remove the friction that keeps pulling you off course — forgetting, guessing, losing count, losing hope in a backlog that feels infinite.

### Benefits of tracking salah and zikr

- **You stop guessing.** "Did I pray Dhuhr?" turns into a glance instead of an argument with yourself.
- **Backlogs become finite.** A vague sense of "years of missed prayers" becomes a number with a plan and an end date.
- **Small wins compound.** Streaks and progress rings give your brain a reason to show up again tomorrow.
- **Reminders arrive before the guilt does.** A nudge at the right moment beats regret an hour later.
- **Patterns become visible.** Most people discover one weak prayer — usually Fajr or Asr — and can finally aim at it.
- **Habits outlive motivation.** Islamic habit building works on systems, not feelings. Feelings come and go.

Here's how each need maps to the app:

| What you need | How Munib Tracker helps |
|------|-----------------|
| Show up for salah | Log every prayer, see streaks and an honest calendar, enable optional adhan and prayer reminders |
| Make up what you missed | Qaza counters, a lifetime estimator, a daily pace planner, and a unified debt dashboard |
| Remember Allah daily | Adhkar library, free tasbeeh, zikr goals, and bedtime-aware before-sleep reminders |
| Renew repentance | "Today's Repentance" — a single tap when you've renewed tawbah |
| Stay oriented | Prayer times, Hijri date, qibla compass, widgets, Live Activities, Watch and Wear |
| Keep learning as you return | Offline Qur'an, hadith, cited lessons, and practical worship guides |

<!-- MEDIUM IMAGE: upload docs/article_imgs/09-tracker-native.png -->
![Salah tracker screen in Munib Tracker showing five daily prayers marked as completed or missed](./article_imgs/09-tracker-native.png)

*The tracker: an honest record of your prayers — not a scoreboard of shame.*

> **A note on tone:** Every reminder in the app is **opt-in**. Nothing nags you by default. You decide which parts of your deen you want the app to gently pull you back toward — salah, [daily zikr](/zikr/), qaza, or Friday.

---

## Core features of Munib Tracker

Every pillar below serves one purpose: help you return, and keep returning, with clarity instead of overwhelm.

### 1. Salah tracking

Mark each prayer as completed, missed, delayed, or qaza. Add a note. Watch the streak grow.

<!-- MEDIUM IMAGE: upload docs/article_imgs/02-salah-store.png -->
![Salah tracking screen with progress ring and prayer status options](./article_imgs/02-salah-store.png)

*Salah on your journey — completed, missed, delayed, or qaza.*

- Five fard prayers, plus Witr and sunnah categories
- Progress ring, streaks, and gentle encouragement — never shame
- Calendar view for prayed, partial, and missed days
- Prayer-times hero with Hijri date, moon phase, and a countdown to the next prayer
- Your calculation method and Asr madhab, set the way you follow
- Ramadan mode, travel (qasr / jam'), illness, and hayd / excused modes
- Opt-in adhan and prayer reminders

That last group matters more than it sounds. Life isn't uniform. A tracker that punishes you for travelling or being unwell isn't tracking your worship — it's just tracking a spreadsheet.

Learn the fundamentals as you go with the in-app [salah guide](/prayer/salah-guide).

### 2. Qaza — make up what was missed

Returning usually means facing what got left behind. This is the part people avoid, so it's the part the app tries hardest to make bearable.

<!-- MEDIUM IMAGE: upload docs/article_imgs/03-qaza-store.png -->
![Qaza planner showing missed prayer counters and an estimated completion date](./article_imgs/03-qaza-store.png)

*Qaza: estimate, pace, and clear what was missed.*

- Per-prayer counters that sync from your missed tracker entries
- A lifetime qaza calculator (with a scholar disclaimer — see the note below)
- Daily pace planner with a realistic ETA to clear your backlog
- Missed fast tracking and estimates
- History, a smart planner, and one unified debt dashboard

Ten make-up prayers a day sounds like nothing. Over a year it's more than three thousand. Seeing that arithmetic on screen is often the moment hopelessness breaks.

> **Important:** Rulings on qaza salah differ between madhahib and cases. The calculator gives you an *estimate and a plan*, not a fatwa. For your specific situation, ask a qualified scholar you trust.

### 3. Zikr, adhkar, and tasbeeh

Morning and evening adhkar, situational duas, and a counter that genuinely feels good to tap.

<!-- MEDIUM IMAGE: upload docs/article_imgs/08-tasbeeh-native.png -->
![Free tasbeeh counter screen with a large tap target and dhikr count](./article_imgs/08-tasbeeh-native.png)

*Free tasbeeh — remember Allah with a simple, tactile counter.*

<!-- MEDIUM IMAGE (optional): upload docs/article_imgs/10-zikr-native.png -->
![Adhkar library listing morning, evening, and situational remembrance](./article_imgs/10-zikr-native.png)

*Adhkar library: morning, evening, and situational remembrance.*

- 54 adhkar across categories, with favorites you can reorder
- A custom adhkar builder, including speech-to-text
- Free tasbeeh plus zikr-linked daily goals
- Bedtime-aware [before-sleep adhkar](/zikr/before-sleep) reminders

Favorites are the underrated feature here. Pin the four or five adhkar you actually say, put them in your own order, and your daily dhikr stops being a scavenger hunt.

Start with [morning and evening adhkar](/zikr/morning-evening) if you're not sure where to begin.

### 4. Today's repentance

A simple daily check-in: renew your tawbah, then tap to mark it.

No form. No journaling requirement. Just a small, visible reminder that the meaning of *Munib* belongs in your day, not only in the app's name.

### 5. Offline Qur'an, hadith, and duas

Read, search, and listen without needing a connection for the core library — on the train, on a plane, in a basement masjid with no bars.

<!-- MEDIUM IMAGE: upload docs/article_imgs/04-library-store.png -->
![Offline Islamic library with Qur'an, hadith collections, and duas](./article_imgs/04-library-store.png)

*Library: Qur'an, hadith, duas, and more — offline when you need them.*

<!-- MEDIUM IMAGE (optional): upload docs/article_imgs/06-names-store.png -->
![99 Names of Allah screen with Arabic, transliteration, and meaning](./article_imgs/06-names-store.png)

*The 99 Names — learn, reflect, and return.*

- Full mushaf: surah view, juz view, 604-page layout, word-by-word, tajweed colouring
- Two bundled translations (more on demand), tafsir on demand, multiple reciters
- Bundled Nawawi's 40 Hadith and Riyad as-Salihin; major collections available on demand
- 270 duas and duroods, plus the [99 Names of Allah](/quran/99-names)
- Universal fuzzy search across every content source — typos forgiven

### 6. Learn your deen

Structured lessons with progress tracking, quizzes, and citations.

- Aqeedah, the prophets, seerah, the major battles, the Sahaba, and early Islamic history
- Jannah, Jahannam, and the Last Day, with interactive quizzes
- A new-Muslim guide, a [learn-dua path](/dua/learn), and topics for Friday, Laylat al-Qadr, Eid, and ruqyah
- Islamic finance education and related guides

Themes of hope, mercy, and repentance run through these lessons wherever the topic calls for it. If you came back to the deen carrying shame, that part is deliberate.

### 7. Qur'an learning path

Start at the Arabic letters. Move through tajweed, memorisation, and reflection. One tap opens the [full mushaf](/quran/) whenever you'd rather just keep reading.

### 8. Worship guides

Practical fiqh with checklists and calculators, for the moments you need an answer now:

- Salah and taharah guides
- Zakat calculator
- Hajj and Umrah guide with rite checklists
- Travel, illness, and hayd — worship at your actual capacity
- Ramadan tracker, tahajjud log, and khushu' journal

### 9. Prayer times and qibla

<!-- MEDIUM IMAGE: upload docs/article_imgs/05-qibla-store.png -->
![Qibla compass screen with alignment feedback toward the Kaaba](./article_imgs/05-qibla-store.png)

*Know when to pray and which way to face.*

- GPS or city search, multiple calculation methods, and your Asr madhab
- Hijri events, moon phase, and optional weather
- Qibla compass with alignment feedback on native devices

Check today's [prayer times](/prayer/times) before you plan your day, not after.

### 10. Progress and insights

Weekly, monthly, and yearly charts. Weekly worship reports. Achievement tracks. Growing "Noor" devotion levels.

Reminders are available for prayer, zikr, qaza, daily content, and Friday — all optional, all yours to configure.

### 11. Personalisation and 23 languages

Light, dark, or system theme. Accent presets and custom colours.

**23 locales**, with proper RTL support for Arabic, Urdu, Persian, Pashto, and Kurdish. Scripture language and interface language stay separate — so you can read an Urdu translation inside an English interface, or the reverse.

<!-- MEDIUM IMAGE (optional light/dark pair): upload docs/article_imgs/15-marketing-home-light.png and 16-marketing-home-dark.png -->
![Munib Tracker home screen in light theme](./article_imgs/15-marketing-home-light.png)

*Light theme home.*

![Munib Tracker home screen in dark theme](./article_imgs/16-marketing-home-dark.png)

*Dark theme home — same journey, your preference.*

---

## How to start in five minutes

Don't try to fix everything tonight. Do this instead:

1. **Install the app** from the [App Store](https://apps.apple.com/app/id6787222180), [Google Play](https://play.google.com/store/apps/details?id=app.munibtracker), or open [the web app](https://my.munibtracker.app) — no account needed.
2. **Set your location** with GPS or city search, then pick your calculation method and Asr madhab.
3. **Log today's prayers only.** Today. Not the last three years.
4. **Turn on one reminder** — pick your weakest prayer. One.
5. **Add one dhikr goal**, like 33× SubhanAllah after Fajr. Save it to favorites.
6. **Open the qaza planner** and enter a rough estimate. Set a daily pace you'd still manage on a bad day.
7. **Tap Today's Repentance** before you sleep, and read the [before-sleep adhkar](/zikr/before-sleep) while you're there.

That's it. Consistency beats intensity — and a small routine you keep for a year will always outrun a heroic week you abandon.

---

## Common mistakes when catching up on missed prayers

I've watched people restart three or four times before something sticks. The pattern is usually one of these.

**Setting a punishing pace.** Fifty make-up prayers a day for a week, then nothing for six months. Pick a number you can hold on your worst day, not your best.

**Letting qaza crowd out today.** Your current prayers are the foundation. If catching up is making you late for Maghrib, the plan needs adjusting — and it's worth asking a scholar how to sequence it for your case.

**Chasing a perfect count.** Nobody has an exact ledger of a decade. Estimate carefully, be sincere, and keep moving. Precision anxiety is not piety.

**Treating the tracker as a judge.** It's a mirror, not a verdict. A red day tells you what to work on tomorrow — nothing about your worth to Allah.

**Turning on every reminder at once.** Twelve notifications a day become background noise within a week. Start with one and add slowly.

**Waiting to "feel ready."** Motivation follows action far more often than it leads it. Log one prayer and see.

---

## Every screen you already use

Munib Tracker is a single Expo codebase, which means the same journey meets you on your phone, your TV, your wrist, and your lock screen.

<!-- MEDIUM IMAGE: upload docs/article_imgs/22-platforms-family.png -->
![Munib Tracker running on phone, tablet, TV, and smartwatch](./article_imgs/22-platforms-family.png)

*One product family: phone, tablet, TV, and watch.*

### Full app

| Platform | Supported |
|----------|-----------|
| iPhone and Android phones | Yes |
| iPad and Android tablets (adaptive layouts) | Yes |
| Web / PWA | Yes |
| Apple TV (tvOS) | Yes |
| Android TV / Fire TV | Yes |

<!-- MEDIUM IMAGE: upload docs/article_imgs/13-apple-tv-home.png -->
![Munib Tracker on Apple TV showing prayer times on the big screen](./article_imgs/13-apple-tv-home.png)

*Apple TV — worship tracking on the big screen.*

<!-- MEDIUM IMAGE: upload docs/article_imgs/20-android-tv-home.png -->
![Munib Tracker on Android TV with a leanback layout](./article_imgs/20-android-tv-home.png)

*Android TV / Fire TV — same companion, leanback layout.*

The TV apps surprised people, but they make sense for families. Prayer times on the living-room screen become a shared reminder instead of a private one.

### Companion surfaces

These ship with native builds (not Expo Go):

- Home and lock-screen **widgets** — next prayer, schedule, progress, tasbeeh, and more
- **iOS Live Activities** on the lock screen and Dynamic Island
- **Siri Shortcuts** and Google Assistant / App Actions — for example, "mark salah"
- **Apple Watch** app with complications
- **Wear OS** tile

<!-- MEDIUM IMAGE: upload docs/article_imgs/11-widget-next-prayer.png -->
![Next prayer home-screen widget showing time remaining](./article_imgs/11-widget-next-prayer.png)

*Next prayer widget — a glance toward the next return.*

<!-- MEDIUM IMAGE: upload docs/article_imgs/17-widget-qaza.png -->
![Qaza debt widget showing remaining missed prayers](./article_imgs/17-widget-qaza.png)

*Qaza widget — keep the backlog visible, not forgotten.*

<!-- MEDIUM IMAGE: upload docs/article_imgs/18-widget-tasbeeh.png -->
![Tasbeeh glance widget on the home screen](./article_imgs/18-widget-tasbeeh.png)

*Tasbeeh glance — dhikr from the home screen.*

<!-- MEDIUM IMAGE: upload docs/article_imgs/12-watch-schedule.png -->
![Munib Tracker on Apple Watch showing the prayer schedule](./article_imgs/12-watch-schedule.png)

*Apple Watch schedule — mark salah from your wrist.*

On desktop, use the web app. visionOS and native desktop shells are out of scope on purpose — better to do fewer surfaces well.

---

## Under the hood, for developers

If you're here for the architecture rather than the adhkar, welcome.

Munib Tracker is a **pnpm + Turborepo** monorepo, designed around two hard problems: reliable offline worship tracking and a large bundled content library.

| Piece | Stack and role |
|-------|----------------|
| Product app | Expo SDK 57 — iOS, Android, web, TV |
| Marketing site | Next.js 16 + Tailwind |
| API | NestJS 11 — auth and cloud sync, OpenAPI → typed client |
| Admin console | Next.js ops console (users, reports, broadcasts) |
| Shared packages | Domain types, theme tokens, API contract and client, Live Activity and surface push delivery, store screenshot specs |

Data is offline-first on the device, through AsyncStorage repositories and stores. Content is generated from open datasets into bundled assets, with a credits registry shipped alongside it.

Two rules are non-negotiable in the pipeline: generated scripture files are never hand-edited, and religious text is never AI-authored.

Start with the [repo README](https://github.com/mubbi/munib-tracker) and the [`docs/` folder](https://github.com/mubbi/munib-tracker/tree/main/docs).

---

## Open source and license

I didn't just ship store binaries. The **entire monorepo** is public — product app, API, marketing site, admin console, and shared packages.

**Repository:** [github.com/mubbi/munib-tracker](https://github.com/mubbi/munib-tracker)

### Why release the source?

A tool for returning to Allah should be inspectable.

You should be able to run a local build, read the architecture, fix a bug, improve a translation, and trace exactly where every verse and hadith came from. Trusting a black box with your worship data is a strange thing to ask of anyone.

### The license in plain language

Munib Tracker is **source-available under [PolyForm Noncommercial 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0)**.

| You may | You may not |
|---------|-------------|
| Use, modify, and redistribute for personal, educational, religious, charitable, and other **non-commercial** purposes | Sell the software, sell customised versions, or use it commercially without a separate license |

Keep the `LICENSE` and `NOTICE` files, and credit Munib Tracker with a link to [munibtracker.app](https://munibtracker.app).

That boundary is intentional: free for the ummah and for learning — not free for someone else to repackage and sell.

### How to contribute

Contributions are welcome under the same license. Read [CONTRIBUTING.md](https://github.com/mubbi/munib-tracker/blob/main/CONTRIBUTING.md) for setup, Conventional Commits (`pnpm commit`), and PR expectations.

Translations, bug fixes, documentation, and careful content-pipeline work are the most useful contributions right now.

### No sponsorship, no donations

Munib Tracker does **not** accept sponsorship, funding, or donations.

If anyone claims to be collecting money on its behalf, they're not. See `NOTICE` and `SUPPORT.md` in the repo.

---

## Download and links

<!-- MEDIUM IMAGE: upload docs/article_imgs/14-android-feature-graphic.png -->
![Munib Tracker Google Play feature graphic with the tagline Track Your Journey Back to Allah](./article_imgs/14-android-feature-graphic.png)

*Find Munib Tracker on the App Store and Google Play.*

- **Marketing site:** [munibtracker.app](https://munibtracker.app)
- **Web app:** [my.munibtracker.app](https://my.munibtracker.app)
- **App Store:** [Munib Tracker for iPhone and iPad](https://apps.apple.com/app/id6787222180)
- **Google Play:** [Munib Tracker for Android](https://play.google.com/store/apps/details?id=app.munibtracker)
- **Source code:** [github.com/mubbi/munib-tracker](https://github.com/mubbi/munib-tracker)
- **Content credits:** [munibtracker.app/credits](https://munibtracker.app/credits)
- **Author:** [Mubbasher Ahmed](https://mubbi.me) · [Medium @mubbiqureshi](https://medium.com/@mubbiqureshi)

If this was useful, send it to someone who's trying to find their way back — or open an issue or PR on GitHub.

---

## Frequently asked questions

### What does Munib mean in Arabic?

**Munib (مُنيب)** means one who turns back to Allah in repentance. The word appears in the Qur'an, including Surah Hud (11:75) and Surah Qaf (50:33). The app carries the name because it's built for exactly that journey — the return, repeated.

### What is Munib Tracker?

A free, offline-first Islamic app for tracking salah, qaza (missed prayers), and daily zikr, bundled with prayer times, qibla, an offline Qur'an and hadith library, duas, and structured lessons. The tagline is *Track Your Journey Back to Allah.*

### Is Munib Tracker really free?

Yes. The core product is free, with no advertising-based monetisation and no premium paywall on the worship journey described in this article.

### Does Munib Tracker work offline?

Yes. It's offline-first by design. Prayer tracking, qaza planning, adhkar, tasbeeh, the bundled Qur'an, and the core hadith collections all work without a connection. Extra translations, tafsir, larger hadith collections, and audio download when you're online.

### Do I need an account to use it?

No. Guest mode works fully offline. Sign in only if you want optional cloud sync and account features later.

### How do I track missed prayers (qaza) in the app?

Missed prayers you mark in the tracker feed straight into per-prayer qaza counters. For older backlogs, use the lifetime calculator to estimate, then set a daily pace and let the planner show your ETA. The debt dashboard keeps the running total in one place, and a widget can keep it visible on your home screen.

### Can Munib Tracker calculate how many prayers I owe?

It can estimate. The lifetime calculator works from the dates and details you provide, and it ships with a scholar disclaimer for a reason — qaza rulings vary across madhahib and personal circumstances. Treat the number as a starting plan and confirm the specifics with a qualified scholar.

### Does it have prayer times, adhan, and qibla?

Yes. Prayer times come from GPS or city search, with multiple calculation methods and your Asr madhab. Adhan and prayer reminders are opt-in. The qibla compass gives alignment feedback on native devices.

### Was the religious content written by AI?

No. Qur'an, hadith, adhkar, duas, and the 99 Names come from open datasets through a documented build pipeline, with a credits registry. Interface copy may be localised with tooling, but scripture is never AI-authored.

### Which languages does Munib Tracker support?

23 locales, including full RTL support for Arabic, Urdu, Persian, Pashto, and Kurdish. You can also keep your scripture language separate from your interface language.

### Is it suitable for new Muslims?

Yes — that's a big part of who it's for. There's a dedicated new-Muslim guide, a step-by-step salah guide, a learn-dua path, and a Qur'an learning path that starts at the Arabic letters. Nothing assumes prior knowledge.

### Which platforms and devices are supported?

iPhone and Android phones and tablets, web and PWA, Apple TV, and Android TV / Fire TV — plus home and lock-screen widgets, iOS Live Activities, an Apple Watch app with complications, a Wear OS tile, Siri Shortcuts, and Google Assistant actions.

### Where is my worship data stored?

On your device first. Cloud sync is optional and only applies if you choose to create an account.

### Is Munib Tracker open source?

The full monorepo is public and **source-available under PolyForm Noncommercial 1.0.0**. You may use, study, modify, and redistribute it for non-commercial purposes; commercial sale or commercial customisation requires a separate license. See `LICENSE`, `NOTICE`, and [docs/OPEN_SOURCE.md](./OPEN_SOURCE.md).

### How can I contribute?

Clone [github.com/mubbi/munib-tracker](https://github.com/mubbi/munib-tracker), read [CONTRIBUTING.md](https://github.com/mubbi/munib-tracker/blob/main/CONTRIBUTING.md), and open a PR. Translations, bug fixes, docs, and careful content-pipeline improvements help most.

### Does Munib Tracker accept donations?

No. The project does not accept sponsorship, funding, or donations of any kind.

---

## Key takeaways

- **Munib** means the one who turns back to Allah — the app is named for the journey, not the destination.
- Munib Tracker combines **salah tracking, qaza planning, and daily zikr** in one free, offline-first app.
- A backlog of missed prayers becomes manageable once you can **see the number and set a pace**.
- Reminders are **opt-in**, and encouragement never turns into shame.
- The library — **Qur'an, hadith, duas, 99 Names, lessons** — works without a connection.
- One codebase covers **phone, tablet, web, TV, watch, and widgets**.
- Religious content comes from **open datasets**, never AI-generated.
- The whole monorepo is public under **PolyForm Noncommercial 1.0.0** — free for the ummah, not for resale.
- Start small tonight: log today's prayers, set one reminder, tap Today's Repentance.

May Allah accept every return, however many times it takes.

---
---

<!--
SUPPORTING SEO ASSETS — not part of the article body.
-->

## 8. Suggested Internal Links

| Anchor text | Target placeholder | Placement |
|-------------|--------------------|-----------|
| full mushaf | `/quran/` | "What does Munib mean?" and "Qur'an learning path" |
| daily zikr | `/zikr/` | Tone callout in "Why tracking helps" |
| morning and evening adhkar | `/zikr/morning-evening` | Zikr feature section |
| before-sleep adhkar | `/zikr/before-sleep` | Zikr section and step 7 of "How to start" |
| 99 Names of Allah | `/quran/99-names` | Offline library section |
| learn-dua path | `/dua/learn` | "Learn your deen" |
| salah guide | `/prayer/salah-guide` | Salah tracking section |
| prayer times | `/prayer/times` | Prayer times and qibla section |
| Qaza salah: how to estimate and clear a backlog | `/articles/qaza-salah-guide` | Suggested follow-up article link near "Common mistakes" |
| Building consistent Islamic habits | `/articles/islamic-habit-building` | Suggested follow-up link in "Key takeaways" |
| Dhikr for beginners | `/articles/dhikr-for-beginners` | Suggested follow-up link in the Zikr section |

## 9. Suggested Schema.org Types

- **Article** (or `TechArticle` for the developer section) — `headline`, `description`, `author` (Person: Mubbasher Ahmed), `datePublished`, `image`, `inLanguage`
- **FAQPage** — mark up all 15 questions in the FAQ section
- **BreadcrumbList** — Home › Articles › Munib Tracker
- **HowTo** — for "How to start in five minutes" (7 steps, `totalTime: PT5M`)
- **SoftwareApplication** — `name: Munib Tracker`, `applicationCategory: LifestyleApplication`, `operatingSystem: iOS, Android, Web, tvOS, Android TV`, `offers.price: 0`
- **ItemList** — optional, for the core features list

## 10. Focus Keyword

`salah tracker app`

## 11. Secondary Keywords

qaza prayer tracker · missed prayer calculator · zikr counter app · adhkar app · tasbeeh counter · offline Qur'an app · free Islamic app · Muslim prayer tracker · Islamic habit tracker · prayer times and qibla app · daily dhikr app · tawbah / repentance app · open source Islamic app · Munib meaning · track missed prayers · morning and evening adhkar · Islamic app for new Muslims

## 12. Search Intent

**Primary:** Informational + transactional blend. Readers are searching for a way to track prayers and clear missed salah ("how to track qaza prayers", "best salah tracker app", "app to track missed prayers"), and are ready to install once convinced.

**Secondary:** Informational — "what does Munib mean". **Tertiary:** Investigational — developers evaluating an open-source Expo/Turborepo Islamic app and its license.

## 13. Suggested Image Alt Text

| Image | Alt text |
|-------|----------|
| `21-hero-return-to-allah.png` | A glowing path leading toward dawn, symbolising a Muslim returning to Allah in repentance |
| `00-logo.png` | Munib Tracker app icon featuring the name Munib in Arabic script |
| `01-home-store.png` | Munib Tracker home screen showing prayer times, next prayer countdown, and today's worship goals |
| `09-tracker-native.png` | Salah tracker screen in Munib Tracker showing five daily prayers marked as completed or missed |
| `02-salah-store.png` | Salah tracking screen with progress ring and prayer status options |
| `03-qaza-store.png` | Qaza planner showing missed prayer counters and an estimated completion date |
| `08-tasbeeh-native.png` | Free tasbeeh counter screen with a large tap target and dhikr count |
| `10-zikr-native.png` | Adhkar library listing morning, evening, and situational remembrance |
| `04-library-store.png` | Offline Islamic library with Qur'an, hadith collections, and duas |
| `06-names-store.png` | 99 Names of Allah screen with Arabic, transliteration, and meaning |
| `05-qibla-store.png` | Qibla compass screen with alignment feedback toward the Kaaba |
| `15` / `16` | Munib Tracker home screen in light theme / in dark theme |
| `22-platforms-family.png` | Munib Tracker running on phone, tablet, TV, and smartwatch |
| `13-apple-tv-home.png` | Munib Tracker on Apple TV showing prayer times on the big screen |
| `20-android-tv-home.png` | Munib Tracker on Android TV with a leanback layout |
| `11-widget-next-prayer.png` | Next prayer home-screen widget showing time remaining |
| `17-widget-qaza.png` | Qaza debt widget showing remaining missed prayers |
| `18-widget-tasbeeh.png` | Tasbeeh glance widget on the home screen |
| `12-watch-schedule.png` | Munib Tracker on Apple Watch showing the prayer schedule |
| `14-android-feature-graphic.png` | Munib Tracker Google Play feature graphic with the tagline Track Your Journey Back to Allah |

## 14. Suggested Social Sharing Title

**Track Your Journey Back to Allah — a free salah, zikr & qaza tracker**

## 15. Suggested Social Sharing Description

Missed prayers piling up? Munib Tracker turns your qaza backlog into a plan you can finish, keeps daily dhikr alive, and works offline. Free, no ads, fully open source.

---

## Medium image checklist

Upload from [`docs/article_imgs/`](./article_imgs/) (see also [`article_imgs/README.md`](./article_imgs/README.md)):

| Order | File | Section |
|------:|------|---------|
| 1 | `21-hero-return-to-allah.png` | Opening hero |
| 2 | `00-logo.png` | Intro / brand |
| 3 | `01-home-store.png` | What is Munib Tracker |
| 4 | `09-tracker-native.png` | Why tracking helps |
| 5 | `02-salah-store.png` | Salah tracking |
| 6 | `03-qaza-store.png` | Qaza |
| 7 | `08-tasbeeh-native.png` | Zikr / tasbeeh |
| 8 | `10-zikr-native.png` | Adhkar (optional) |
| 9 | `04-library-store.png` | Offline library |
| 10 | `06-names-store.png` | 99 Names (optional) |
| 11 | `05-qibla-store.png` | Prayer times and qibla |
| 12 | `15` / `16` marketing homes | Themes (optional) |
| 13 | `22-platforms-family.png` | Every screen you already use |
| 14 | `13-apple-tv-home.png` | Apple TV |
| 15 | `20-android-tv-home.png` | Android TV |
| 16 | `11` / `17` / `18` widgets | Companion surfaces |
| 17 | `12-watch-schedule.png` | Apple Watch |
| 18 | `14-android-feature-graphic.png` | Download and links |

Spare / alternate shots: `07-home-native.png`, `19-tvos-home-native.png`.
