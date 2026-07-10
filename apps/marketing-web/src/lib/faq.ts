import { APP_NAME } from "@munib-tracker/shared/constants";

export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: `Is ${APP_NAME} free?`,
    answer: `${APP_NAME} is free for personal and educational use. There are no ads, subscriptions, or in-app purchases.`,
  },
  {
    question: "Do I need an account?",
    answer:
      "No. Guest mode gives you full access with all data stored locally on your device. Sign in with Google or Apple only when you want to sync across devices.",
  },
  {
    question: "Does it work offline?",
    answer:
      "Yes. Prayer tracking, qaza, adhkar, tasbeeh, bundled Qur'an and hadith highlights, duas, the learning library, and worship guides all work without an internet connection. Full hadith collections, extra Qur'an translations, tafsir, and audio download on demand and can be cached from Settings → Offline data.",
  },
  {
    question: "Is it just a prayer tracker, or does it teach too?",
    answer:
      "Both. Alongside tracking, there's a full learning library — structured lessons on aqeedah, the prophets, the seerah, and the Hereafter; a guided path to read and understand the Qur'an (letters, tajweed, memorization, themes); and step-by-step worship guides for salah, wudu, zakat, and hajj. Lessons include progress tracking, quizzes, and Qur'an and hadith citations.",
  },
  {
    question: "Which platforms are supported?",
    answer: `${APP_NAME} runs on iOS, Android, and web from a single codebase. Native builds add home-screen widgets, Live Activities (iOS), Apple Watch and Wear OS companions, Siri / Assistant shortcuts, haptics, and app lock. Use it in the browser or install the native app when available on the App Store and Google Play.`,
  },
  {
    question: "How accurate are prayer times?",
    answer:
      "Times are calculated on-device for your GPS location or chosen city using standard Islamic methods (14 calculation methods, Shafi/Hanafi Asr madhab, high-latitude rules, and optional per-prayer minute offsets). You can refresh location from the home screen at any time.",
  },
  {
    question: "Can I trust the religious content?",
    answer:
      "Arabic text, translations, and references come from established open sources (see Credits). Calculators and estimates are aids, not fatwas — consult a qualified scholar for rulings specific to your situation.",
  },
  {
    question: "What data do you collect?",
    answer:
      "In guest mode, nothing leaves your device. If you sign in, we store the minimum needed to sync your worship and learning records and an account identifier from Google or Apple. The product app does not sell data or use advertising SDKs. See our Privacy Policy for location, notifications, backups, and this website's optional analytics.",
  },
  {
    question: "Which languages are supported?",
    answer:
      "The app interface ships in 23 locales, including English, Arabic, Urdu, Indonesian, Turkish, Bengali, Malay, Persian, French, and more — with full RTL for Arabic, Urdu, Persian, Pashto, and Kurdish. Scripture translation language for religious content can be set separately in settings.",
  },
  {
    question: "How do reminders work?",
    answer:
      "You control every reminder category: prayer times (with optional adhan playback and styles), sunnah, qaza, after-adhan, morning/evening adhkar, before sleep (using your bedtime setting), daily content, Friday reminders, and achievements. All are off until you enable them. On iOS you can also opt into Live Activities for the next prayer.",
  },
  {
    question: "Can I back up or lock the app?",
    answer:
      "Yes. Export or import a local JSON backup from Settings, manage offline downloads, and on native builds enable a PIN with optional biometrics. You can also customize which home modules and library items appear.",
  },
  {
    question: "How do I report a content error?",
    answer:
      "Accuracy in religious content is a trust we take seriously. Use the in-app report flow (Settings → My reports) or our contact form, and we will correct errors promptly.",
  },
];
