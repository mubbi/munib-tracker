import { APP_NAME, DUA_COUNT } from "@munib-tracker/shared/constants";

export type { FaqItem } from "@/content/types";

import type { FaqItem } from "@/content/types";

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is Munib Tracker?",
    answer:
      "Munib Tracker is a free Islamic app to help you stay consistent in worship. It tracks your five daily Salah, helps you plan and make up missed Salah (Qaza), guides your daily Zikr, and includes the full Qur'an with recitation practice and a cited learning library. There are no ads and no account is required. [See all features](/features).",
  },
  {
    question: `Is ${APP_NAME} free?`,
    answer: `${APP_NAME} is free for personal and educational use. There are no ads, subscriptions, or in-app purchases. The source is also available on GitHub under a non-commercial license — see the [Open source](/open-source) page.`,
  },
  {
    question: "Do I need an account?",
    answer:
      "Not for personal use. Guest mode gives you every personal feature with your data stored on your device. Sign in with Google, Apple, or Facebook when you want to sync across devices, or to use family and kids mode or an accountability partner. A group khatm can also be joined as a guest on the web.",
  },
  {
    question: "Does it work offline?",
    answer: `Yes. Prayer tracking, Qaza, 60 adhkar, tasbeeh, ${DUA_COUNT} duas, bundled Qur'an and hadith highlights, the full learning library (350+ topics), and worship guides all work without an internet connection. Full hadith collections, extra Qur'an translations (25 editions), tafsir (123 editions), recitation, and audio download on demand and can be cached from Settings → Offline data.`,
  },
  {
    question: "Does Qur'an practice record my voice?",
    answer:
      "No. When you tap the microphone, an AI listener on your device follows your recitation word by word. The audio is processed on the device and is never recorded, stored, or uploaded; practice keeps only counts (such as how many words matched) and ayah numbers. The listener is a one-time optional download (about 70 MB) and then works offline. It follows your recitation to help you memorize and revise; it is not a replacement for a teacher. [How Qur'an practice works](/features/quran-practice).",
  },
  {
    question: "Which platforms are supported?",
    answer: `${APP_NAME} runs on iOS, Android, web, Apple TV, and Android TV from a single Expo codebase. Install from the App Store or Google Play, or use the web app in any modern browser (with offline PWA support). Native phone builds add home-screen widgets, Live Activities (iOS), Apple Watch and Wear OS companions, Siri / Assistant shortcuts, haptics, and app lock.`,
  },
  {
    question: "Is it just a prayer tracker, or does it teach too?",
    answer:
      "Both. Alongside tracking, there's a full learning library — aqeedah (24 topics), the 25 prophets, a 30-event seerah, major battles, the Hereafter, sahaba, early Islamic history, learn dua, a new-Muslim guide, and seasonal topics like Laylat al-Qadr, Eid, and Friday/Jumu'ah; a guided path to read and understand the Qur'an (letters, tajweed, memorization, 13 themes); and step-by-step worship guides for Salah, taharah, zakat, and Hajj & Umrah (learn topics plus separate rite checklists). Lessons include progress tracking, quizzes, and Qur'an and hadith citations.",
  },
  {
    question: "Can I use Munib Tracker with my family?",
    answer:
      "Yes. A parent can create child profiles for a simple kids mode, friends can pair up as accountability partners, and families or Masjid circles can share a group khatm. Only a small signal is shared, and there are no leaderboards. See [Family & friends](/features/family-and-friends).",
  },
  {
    question: "Does the app follow my madhhab?",
    answer:
      "You can choose Hanafi, Shafi'i, Maliki or Hanbali, or show all views. Guides and calculators that depend on it, such as Witr, rawatib, zakat nisab and jewellery, fidyah, shortening Salah when travelling, and hayd, then show your school's view, and where the schools differ the difference is labelled rather than hidden. It is a study aid; for your own situation, consult a qualified scholar. See [My madhhab](/features/my-madhhab).",
  },
  {
    question: "Does the weekly coach use AI?",
    answer:
      "No. The weekly coach uses simple, fixed rules that run on your device to turn your own week into one to three kind suggestions. Nothing is sent to a server or an AI service. See [private reflection](/features/private-reflection).",
  },
  {
    question: "How accurate are prayer times?",
    answer:
      "Times are calculated on-device for your GPS location or chosen city using standard Islamic methods (13 calculation methods, Shafi'i or Hanafi Asr, high-latitude rules, and optional per-prayer minute offsets). You can refresh location from the home screen at any time.",
  },
  {
    question: "Can I trust the religious content?",
    answer:
      "Arabic text, translations, and references come from established open sources (see [content sources](/credits)). Content is reviewed for authenticity before it ships. Calculators and estimates are aids, not fatwas — consult a qualified scholar for rulings specific to your situation.",
  },
  {
    question: "What data do you collect?",
    answer:
      'In guest mode, your worship records stay on your device. If you sign in, we store the minimum needed to sync your records and an account identifier from Google, Apple, or Facebook. Private records such as your muhasabah, debts, will and family contacts stay in an encrypted vault on your device, and sync only if you turn on end-to-end encrypted vault sync. Family circles, partners and group khatm share only a small signal (for example "done"). The Masjid finder sends only a rough area of about 5 km to our server to look up nearby masjids. The app does not sell data or use advertising SDKs. Details are in our [Privacy Policy](/privacy).',
  },
  {
    question: "Which languages are supported?",
    answer:
      "The app interface ships in 24 locales, including English, Arabic, Urdu, Indonesian, Turkish, Bengali, Malay, Persian, French, Hindi, and more — with full RTL for Arabic, Urdu, Persian, Pashto, and Kurdish. Scripture translation language for religious content can be set separately in settings.",
  },
  {
    question: "How do reminders work?",
    answer:
      "You control every reminder category: prayer times (with optional Adhan playback and five styles), Sunnah, Qaza, after-Adhan, morning/evening adhkar, before sleep (using your bedtime setting), daily content, Friday reminders, and achievements. All are off until you enable them. On iOS you can also opt into Live Activities for the next prayer.",
  },
  {
    question: "Can I back up or lock the app?",
    answer:
      "Yes. Export or import a local JSON backup from Settings, manage offline downloads, and on native builds enable a PIN with optional biometrics. You can also customize which home modules and library items appear.",
  },
  {
    question: "How do I report a content error?",
    answer:
      "Accuracy in religious content is a trust we take seriously. Use the in-app report flow (Settings → My content reports, after signing in), our contact form, or open a content accuracy issue on GitHub, and we will correct errors promptly.",
  },
  {
    question: `Is ${APP_NAME} open source?`,
    answer: `The full monorepo is source-available on GitHub under the PolyForm Noncommercial License 1.0.0. You may use, modify, and redistribute it for personal and educational purposes if you credit ${APP_NAME} and link to munibtracker.app. You may not sell the app or sell customized versions. Details: the [Open source](/open-source) page and the NOTICE file in the repository.`,
  },
  {
    question: "Can I fork it and sell a customized version?",
    answer:
      "No. Commercial use — including selling the software or selling customized builds — is not permitted under the license. For other arrangements, contact us via the contact form.",
  },
  {
    question: `Do you accept donations or sponsorship for ${APP_NAME}?`,
    answer: `No. ${APP_NAME} does not currently accept sponsorship, funding, or donations. Do not send money to anyone claiming to collect funds on behalf of Munib Tracker. There is no official payment or GitHub Sponsors link. You can help by contributing code, documentation, translations, or content corrections on GitHub.`,
  },
  {
    question: "How can I contribute?",
    answer: `Read the contributing guide on GitHub, then open an issue or pull request. We welcome bug fixes, documentation, translations, and careful content corrections — not money. ${APP_NAME} does not accept sponsorship or donations. Meet the community on the [Contributors](/contributors) page and read the license terms on the [Open source](/open-source) page.`,
  },
];
