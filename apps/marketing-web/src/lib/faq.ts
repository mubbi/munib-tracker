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
      "Yes. Prayer tracking, qaza, adhkar, tasbeeh, bundled Qur'an and hadith highlights, duas, and search all work without an internet connection. Full hadith collections and extra Qur'an translations download on demand and are cached.",
  },
  {
    question: "Which platforms are supported?",
    answer: `${APP_NAME} runs on iOS, Android, and web from a single codebase. Use it in the browser or install the native app when available on the App Store and Google Play.`,
  },
  {
    question: "How accurate are prayer times?",
    answer:
      "Times are calculated for your GPS location or chosen city using standard Islamic prayer-time methods. You can refresh location from the home screen at any time.",
  },
  {
    question: "Can I trust the religious content?",
    answer:
      "Arabic text, translations, and references come from established open sources (see Credits). Calculators and estimates are aids, not fatwas — consult a qualified scholar for rulings specific to your situation.",
  },
  {
    question: "What data do you collect?",
    answer:
      "In guest mode, nothing leaves your device. If you sign in, we store the minimum needed to sync your worship records and account identifier from your provider. We do not sell data or use it for advertising. See our Privacy Policy for details.",
  },
  {
    question: "Which languages are supported?",
    answer:
      "The app interface is available in English, Arabic (with full RTL layout), and Urdu. Translation language for religious content can be set separately in settings.",
  },
  {
    question: "How do reminders work?",
    answer:
      "You control every reminder category: prayer times, qaza, after-azan, morning/evening adhkar, before sleep (using your bedtime setting), and achievements. All are off until you enable them.",
  },
  {
    question: "How do I report a content error?",
    answer:
      "Accuracy in religious content is a trust we take seriously. Use the support link in the app to report errors and we will correct them promptly.",
  },
];
