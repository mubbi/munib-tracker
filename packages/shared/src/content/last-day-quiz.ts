import type { LastDayQuizQuestion } from "../types/last-day";

/** Educational quiz — review knowledge, not spiritual ranking. */
export const LAST_DAY_QUIZ: LastDayQuizQuestion[] = [
  {
    id: "six-articles",
    type: "multiple-choice",
    prompt: "Belief in the Last Day is one of the:",
    options: [
      "Five pillars of Islam",
      "Six articles of faith (Iman)",
      "Seven heavens",
      "Ten companions",
    ],
    correctIndex: 1,
    explanation:
      "Iman includes belief in Allah, angels, books, messengers, the Last Day, and divine decree (qadr).",
  },
  {
    id: "barzakh-definition",
    type: "multiple-choice",
    prompt: "Barzakh is best described as:",
    options: [
      "The bridge over Hell",
      "Life between death and resurrection",
      "The scale of deeds",
      "The trumpet blast",
    ],
    correctIndex: 1,
    explanation: "Barzakh is the interval after death until the Day of Resurrection.",
  },
  {
    id: "major-vs-minor",
    type: "true-false",
    prompt: "True or false: Scholars agree on the exact sequence of all major signs of the Hour.",
    options: ["True", "False"],
    correctIndex: 1,
    explanation:
      "Major signs are affirmed in authentic hadith, but scholars differ on some sequencing details. The Hour's time is known only to Allah.",
  },
  {
    id: "mizan-meaning",
    type: "multiple-choice",
    prompt: "The Mizan (scale) on the Last Day refers to:",
    options: [
      "Weighing physical bodies",
      "Weighing deeds with perfect justice",
      "Measuring time in the grave",
      "Counting angels",
    ],
    correctIndex: 1,
    explanation: "The Mizan weighs deeds — sincerity and righteous action make scales heavy.",
  },
  {
    id: "intercession-rule",
    type: "multiple-choice",
    prompt: "Intercession (shafa'ah) on the Last Day:",
    options: [
      "Happens without Allah's permission",
      "Is only by Allah's permission",
      "Replaces the need for faith",
      "Is denied in the Qur'an",
    ],
    correctIndex: 1,
    explanation: "Qur'an 2:255 and 20:109 affirm intercession only by Allah's permission.",
  },
  {
    id: "timeline-order",
    type: "ordering",
    prompt: "Which comes first in the Hereafter journey?",
    options: ["Resurrection", "Death", "The Gathering", "The Trumpet"],
    correctIndex: 1,
    explanation:
      "Death precedes barzakh, then — after the signs and trumpet — resurrection and gathering.",
  },
  {
    id: "preparation-reflection",
    type: "reflection",
    prompt: "Which one habit will you strengthen this week to prepare for meeting Allah?",
    explanation:
      "Preparation is practical: salah, Qur'an, repentance, charity, good character, and fulfilling others' rights.",
  },
  {
    id: "sirat-all",
    type: "true-false",
    prompt: "True or false: According to Qur'an 19:71, every person will pass over the Sirat.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "The verse states all will pass over it; Allah saves the mindful. Scholars discuss details of who falls.",
  },
];
