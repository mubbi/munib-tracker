import type { QuranGuideApplyChallenge } from "../types/quran-guide";

/**
 * Apply-the-Qur'an challenges — verse-linked habits for today. Bump
 * QURAN_GUIDE_APPLY_VERSION on content change.
 */
export const QURAN_GUIDE_APPLY_VERSION = 2;

export const QURAN_GUIDE_APPLY_CHALLENGES: QuranGuideApplyChallenge[] = [
  {
    id: "kind-speech",
    verseLabel: "Qur'an 17:53",
    verseExcerpt: "And speak to people good words.",
    challenge:
      "Go the whole day without a single harsh, sarcastic, or mocking word — even in jest, even when provoked.",
    habit: "When annoyance rises, pause before you reply and choose either silence or a kind word.",
  },
  {
    id: "lower-gaze",
    verseLabel: "Qur'an 24:30–31",
    verseExcerpt: "Tell the believing men to lower their gaze…",
    challenge:
      "Deliberately lower your gaze away from what Allah has forbidden today — on your screen, your feed, and in public.",
    habit:
      "Each time you catch yourself, redirect that moment into five minutes of Qur'an instead.",
  },
  {
    id: "parents",
    verseLabel: "Qur'an 17:23",
    verseExcerpt: "Do not say to them 'uff'…",
    challenge:
      "Speak to a parent or elder today with visible gentleness and patience, showing no trace of irritation — and do something to serve them.",
    habit: "If they are alive, commit to a regular call or visit; if not, make dua for them.",
  },
  {
    id: "truth",
    verseLabel: "Qur'an 9:119",
    verseExcerpt: "Be with the truthful.",
    challenge:
      "Tell the truth all day with no white lies, no exaggeration, and no gossip — not even in jokes.",
    habit: "If you slip, repent at once and put right whatever your words affected.",
  },
  {
    id: "patience",
    verseLabel: "Qur'an 2:153",
    verseExcerpt: "Allah is with the patient.",
    challenge:
      "The next time something frustrates you, hold back every harsh word for a full sixty seconds before you respond.",
    habit: "Turn moments of irritation into zikr or two rakah of prayer whenever you can.",
  },
  {
    id: "gratitude",
    verseLabel: "Qur'an 14:7",
    verseExcerpt: "If you are grateful, I will increase you.",
    challenge:
      "Thank three different people by name today for something specific they did for you.",
    habit: "End each night by noting one blessing — a single line in your Munib journal.",
  },
  {
    id: "forgiveness",
    verseLabel: "Qur'an 42:40",
    verseExcerpt: "Whoever forgives and makes reconciliation — his reward is with Allah.",
    challenge:
      "Let go of one grudge you have been carrying — release it sincerely, at least within your own heart.",
    habit: "Make a quiet dua for the person who wronged you instead of replaying the hurt.",
  },
];
