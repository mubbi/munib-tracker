import type { FeaturePage } from "@/content/types";

export const kidsMode: FeaturePage = {
  slug: "kids-mode",
  icon: "kids",
  navLabel: "Kids mode",
  navHint: "Salah, duas and stories for children",
  group: "life",
  title: "An Islamic app for kids: a calm, parent-managed place to learn Salah",
  seoTitle: "Islamic App for Kids — Salah, Duas and Prophet Stories, No Ads",
  seoDescription:
    "Kids mode in Munib Tracker: big Salah buttons, a how-to-pray path, prophet stories, short duas and surahs, stickers and parent-managed profiles. No ads.",
  description:
    "A simple kids mode with three tabs, Pray, Learn and Duas, run from a child profile that a parent creates, links and can delete at any time.",
  keywords: [
    "islamic app for kids",
    "muslim kids app",
    "salah app for kids",
    "teach kids to pray app",
    "kids dua app",
  ],
  cluster: "audience",
  published: "2026-11-27",
  updated: "2026-11-27",
  eyebrow: "Kids mode",
  intro:
    "Kids mode turns Munib Tracker into something a child can use alone: three tabs, big buttons and short lessons. A parent sets it up with a nickname and a birth year, and sees only whether the five daily Salah were logged.",
  hero: null,
  whatItDoes: {
    title: "What kids mode includes",
    intro: "A child sees three tabs: Pray, Learn and Duas. Parents manage the rest from Family.",
    groups: [
      {
        title: "Pray",
        items: [
          "Five big Salah buttons the child taps after praying",
          "A star for each Salah, and a sticker on a day when all five are logged",
          "A real reward you choose, such as a park trip, with a bar that fills as the days add up",
          'A day without all five never resets the reward, and there is no "missed" state',
          "Under 7 is a learning mode: Salah can be logged for practice, with no expectations",
          "From 7 to 12 tracking stays gentle, and a parent can mark a rest day without giving a reason",
        ],
      },
      {
        title: "Learn",
        items: [
          "A Salah path in three stops: wudu in 9 steps, the five daily Salah and their rakahs, then how to pray in 17 steps",
          "Each step of the prayer shows the Arabic, how to say it and what it means",
          "23 stories of the prophets, chosen for children from the app's own Learn section",
          "Arabic letters and the [99 Names of Allah](/features/99-names-of-allah)",
          "12 short surahs, al-Fatihah among them, opened in the reader with the reciter's audio",
        ],
      },
      {
        title: "Duas",
        items: [
          "12 everyday duas with audio: waking up, before sleeping, before and after eating, leaving home and more",
          "7 short adhkar a child can learn by heart and count on the Tasbeeh counter",
          "Every item comes from the app's sourced collections; nothing was written specially for kids mode",
          "Narrations graded weak in the source data were left out",
        ],
      },
      {
        title: "Recite along",
        items: [
          "Pick a short surah and recite it one ayah at a time",
          "Words light up as the child recites, using a listener that runs on the device",
          "If a few words were not heard, they are shown gently to try again; tap a word to hear it",
          "No scores, and the child's voice is never sent anywhere",
          "Without the listener, the child can tap Listen and follow the words with the reciter",
        ],
      },
      {
        title: "Profiles a parent controls",
        items: [
          "A parent creates the child profile with a nickname and a birth year; no email, password or birth date",
          "Link the child's phone or tablet with a QR code that works once and lasts 5 minutes",
          "Or, when the two phones are side by side, link over Bluetooth with a 4-digit code that you approve",
          "No second device? Open kids mode as your child on your own phone",
          "A linked device stays inside kids mode and cannot open the adult Salah guide or the full prophets section",
          "One device per child; you can unlink it or delete the profile whenever you like",
        ],
      },
      {
        title: "What parents see",
        items: [
          "Only a tick or a dash for each of the five fard Salah, plus the child's stickers",
          "No notes, no Qaza, no rankings and no comparison between children",
          "Children never see their brothers' and sisters' progress",
          "A parent's own Salah is never shared with the family",
          "A weekly family summary for parents that carries totals only, with no names",
        ],
      },
    ],
  },
  why: {
    title: "Why a separate mode for children?",
    paragraphs: [
      "An app built for adults asks a lot of a seven-year-old: small text, long menus, and topics that are not meant for them yet. Most apps built for children have the opposite problem. They are loud, full of adverts and designed to keep a child tapping.",
      "Kids mode takes a third path. There is little to do in it, on purpose: log a Salah, learn one step, listen to one dua. Then the tablet goes down.",
      "It is also built to need as little about your child as possible. A nickname and a birth year are enough to run it, and what a parent can see is fixed at the five daily Salah.",
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Create your family circle",
        text: "Sign in with your own free account and start a family circle. You can invite the other parent to manage it with you.",
      },
      {
        title: "Add a child",
        text: "Enter a nickname and a birth year, read what is stored, and confirm that you are the child's parent or guardian.",
      },
      {
        title: "Link a device, or use yours",
        text: "Show the QR code to your child's phone or tablet, or open kids mode as your child on your own phone.",
      },
      {
        title: "Set a reward together",
        text: "Agree on something real to work towards, and how many days of all five it takes.",
      },
      {
        title: "Move on at 13",
        text: "From about 13, or earlier if you allow it, your child can move to their own account. The child profile is then deleted.",
      },
    ],
  },
  benefits: [
    {
      title: "Small on purpose",
      text: "Three tabs, big buttons and short lessons. There is nothing to scroll through for hours.",
    },
    {
      title: "No ads, no chat, no leaderboards",
      text: "Children are never shown adverts, cannot message anyone, and are never ranked against anyone else.",
    },
    {
      title: "Encouragement only",
      text: "Stars, stickers and a reward you set. Nothing is taken away for a day that was missed.",
    },
    {
      title: "Sourced content",
      text: "Duas, adhkar, surahs and stories come from the same referenced collections as the rest of the app. See the [credits](/credits).",
    },
  ],
  examples: {
    title: "Ways to use it",
    items: [
      {
        title: "A five-year-old copying you",
        text: "Leave the profile in learning mode and let them tap Maghrib after praying beside you. Nothing is expected of them yet.",
      },
      {
        title: "A nine-year-old learning how to pray",
        text: "Work through the Salah path one stop a week, then recite al-Fatihah together in Recite along.",
      },
      {
        title: "Two children, one tablet at a time",
        text: "Give each child a profile. Neither can see the other's stickers, so there is nothing to argue about.",
      },
    ],
  },
  notes: [
    {
      tone: "info",
      title: "What is stored, and for how long",
      text: "For a child profile, Munib Tracker's server stores the nickname and birth year you enter, the reward you set, the record of your consent, and a tick or dash for each of the five fard Salah, plus rest days with no reason attached. Those daily marks are deleted after 90 days. Stars and stickers are worked out on the device from the same marks. Deleting a child profile removes the profile, its marks and its device link straight away. More detail is in our [privacy policy](/privacy).",
    },
    {
      tone: "info",
      title: "Honest limits",
      text: "Kids mode works on a phone or tablet, not on TV, and a family circle needs a parent's signed-in account. The recite-along listener may be less reliable for children's voices, so treat its hints as a prompt to listen again. The stories of Yusuf and Lut are not in kids mode; you can read them with your child in the full Learn section. Kids mode supports a parent or teacher and does not replace one.",
    },
    {
      tone: "scholar",
      text: "The age bands are product settings, not rulings. Thirteen is a privacy cut-off for child profiles and says nothing about the age of maturity (bulugh), on which the schools differ. A parent can allow the move to an own account earlier.",
    },
  ],
  faqs: [
    {
      question: "Is there a safe Islamic app for kids with no ads?",
      answer:
        "Yes. Kids mode in Munib Tracker has no ads, no chat and no leaderboards, and it is free. A parent creates the profile, and a linked child device stays inside kids mode with its three tabs: Pray, Learn and Duas.",
    },
    {
      question: "Does my child need an email address or an account?",
      answer:
        "No. A parent creates the child profile with a nickname and a birth year, then links the child's device with a one-time QR code. No email or password is entered on the child's device.",
    },
    {
      question: "What can parents see in kids mode?",
      answer:
        "Parents see only whether each of the five fard Salah was logged, shown as a tick or a dash, and the child's stickers. There are no notes, rankings or comparisons between children. The wider family features are on the [family page](/features/family-and-friends).",
    },
    {
      question: "What age is kids mode for?",
      answer:
        "It is for children under 13. Under 7 it runs as a learning mode with no expectations, and from 7 to 12 it tracks gently with stars and stickers. From about 13 a child can move to their own account, and shares nothing after that unless they choose to.",
    },
    {
      question: "Can my child use kids mode on my phone?",
      answer:
        "Yes. Open the child's profile in Family and choose to open kids mode as your child. You can log their Salah with them there, and no second device is needed.",
    },
    {
      question: "What happens if I delete my child's profile?",
      answer:
        "The profile, its Salah marks, its stickers and its linked device are deleted immediately, and this cannot be undone. More for parents is on our [families page](/for/families).",
    },
  ],
  related: ["family-and-friends", "salah-tracker", "learn-quran", "hifz-tracker"],
  guides: ["/resources/quran-learning/how-to-help-children-learn-the-quran"],
  cta: {
    title: "Set it up in a few minutes",
    text: "Download Munib Tracker, create your family circle, and add your child with a nickname and a birth year.",
  },
};
