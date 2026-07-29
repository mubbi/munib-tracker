import { APP_NAME } from "@munib-tracker/shared/constants";

export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: `Is ${APP_NAME} free?`,
    answer: `${APP_NAME} is free for personal and educational use. There are no ads, subscriptions, or in-app purchases. The source is also available on GitHub under a non-commercial license — see the Open source page.`,
  },
  {
    question: `Is ${APP_NAME} open source?`,
    answer: `The full monorepo is source-available on GitHub under the PolyForm Noncommercial License 1.0.0. You may use, modify, and redistribute it for personal and educational purposes if you credit ${APP_NAME} and link to munibtracker.app. You may not sell the app or sell customized versions. Details: Open source page and the NOTICE file in the repository.`,
  },
  {
    question: "Can I fork it and sell a customized version?",
    answer:
      "No. Commercial use — including selling the software or selling customized builds — is not permitted under the license. For other arrangements, contact us via the contact form.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No. Guest mode gives you full access with all data stored locally on your device. Sign in with Google, Apple, or Facebook only when you want to sync across devices.",
  },
  {
    question: "Does it work offline?",
    answer:
      "Yes. Prayer tracking, qaza, 54 adhkar, tasbeeh, 270 duas, bundled Qur'an and hadith highlights, the full learning library (350+ topics), and worship guides all work without an internet connection. Full hadith collections, extra Qur'an translations (25 editions), tafsir (123 editions), recitation, and audio download on demand and can be cached from Settings → Offline data.",
  },
  {
    question: "Is it just a prayer tracker, or does it teach too?",
    answer:
      "Both. Alongside tracking, there's a full learning library — aqeedah (24 topics), the 25 prophets, a 30-event seerah, major battles, the Hereafter, sahaba, early Islamic history, learn dua, a new-Muslim guide, and seasonal topics like Laylat al-Qadr, Eid, and Friday/Jumu'ah; a guided path to read and understand the Qur'an (letters, tajweed, memorization, 13 themes); and step-by-step worship guides for salah, taharah, zakat, and Hajj & Umrah (learn topics plus separate rite checklists). Lessons include progress tracking, quizzes, and Qur'an and hadith citations.",
  },
  {
    question: "Which platforms are supported?",
    answer: `${APP_NAME} runs on iOS, Android, web, Apple TV, and Android TV from a single Expo codebase. Install from the App Store or Google Play, or use the web app in any modern browser (with offline PWA support). Native phone builds add home-screen widgets, Live Activities (iOS), Apple Watch and Wear OS companions, Siri / Assistant shortcuts, haptics, and app lock.`,
  },
  {
    question: `Do you accept donations or sponsorship for ${APP_NAME}?`,
    answer: `No. ${APP_NAME} does not currently accept sponsorship, funding, or donations. Do not send money to anyone claiming to collect funds on behalf of Munib Tracker. There is no official payment or GitHub Sponsors link. You can help by contributing code, documentation, translations, or content corrections on GitHub.`,
  },
  {
    question: "How accurate are prayer times?",
    answer:
      "Times are calculated on-device for your GPS location or chosen city using standard Islamic methods (13 calculation methods, Shafi/Hanafi Asr madhab, high-latitude rules, and optional per-prayer minute offsets). You can refresh location from the home screen at any time.",
  },
  {
    question: "Can I trust the religious content?",
    answer:
      "Arabic text, translations, and references come from established open sources (see Credits). Content is reviewed for authenticity before it ships. Calculators and estimates are aids, not fatwas — consult a qualified scholar for rulings specific to your situation.",
  },
  {
    question: "What data do you collect?",
    answer:
      "In guest mode, nothing leaves your device. If you sign in, we store the minimum needed to sync your worship and learning records and an account identifier from Google, Apple, or Facebook. The product app does not sell data or use advertising SDKs. See our Privacy Policy for location, notifications, backups, and this website's optional analytics.",
  },
  {
    question: "Which languages are supported?",
    answer:
      "The app interface ships in 23 locales, including English, Arabic, Urdu, Indonesian, Turkish, Bengali, Malay, Persian, French, and more — with full RTL for Arabic, Urdu, Persian, Pashto, and Kurdish. Scripture translation language for religious content can be set separately in settings.",
  },
  {
    question: "How do reminders work?",
    answer:
      "You control every reminder category: prayer times (with optional adhan playback and five styles), sunnah, qaza, after-adhan, morning/evening adhkar, before sleep (using your bedtime setting), daily content, Friday reminders, and achievements. All are off until you enable them. On iOS you can also opt into Live Activities for the next prayer.",
  },
  {
    question: "Can I back up or lock the app?",
    answer:
      "Yes. Export or import a local JSON backup from Settings, manage offline downloads, and on native builds enable a PIN with optional biometrics. You can also customize which home modules and library items appear.",
  },
  {
    question: "How do I report a content error?",
    answer:
      "Accuracy in religious content is a trust we take seriously. Use the in-app report flow (Settings → My reports), our contact form, or open a content accuracy issue on GitHub, and we will correct errors promptly.",
  },
  {
    question: "How can I contribute?",
    answer: `Read the contributing guide on GitHub, then open an issue or pull request. We welcome bug fixes, documentation, translations, and careful content corrections — not money. ${APP_NAME} does not accept sponsorship or donations. Meet the community on the Contributors page and learn license terms on the Open source page.`,
  },
];
