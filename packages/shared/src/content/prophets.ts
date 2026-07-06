import { PROPHETS_BIO_TOPICS } from "./prophets-bios";

export { PROPHETS_TIMELINE } from "./prophets-timeline";

import type { ProphetsSection, ProphetsTopic } from "../types/prophets";

/**
 * Learn the Prophets hub content.
 * Bump this when topics are edited in a meaningful way.
 */
export const PROPHETS_CONTENT_VERSION = 1;

export const PROPHETS_SECTION_ORDER: ProphetsSection[] = [
  "context",
  "prophets",
  "themes",
  "evidence",
];

const contextTopics: ProphetsTopic[] = [
  {
    id: "introduction",
    section: "context",
    title: "Introduction to the Prophets",
    summary: "Why Allah sent prophets and why their stories matter now.",
    body: [
      "Allah sent prophets as mercy, guidance, and proof so people can know Him, worship Him correctly, and live with justice and purpose.",
      "Their stories in the Qur'an are not distant history only; they are practical lessons for belief, patience, family life, leadership, and repentance.",
      "Belief in all prophets is part of iman. Muslims honor them all, avoid exaggeration, and follow the final message brought by Muhammad ﷺ.",
    ],
    quran: [
      {
        surah: 4,
        ayahFrom: 165,
        label: "Qur'an 4:165",
        excerpt:
          "Messengers as bringers of good news and warners so people would have no argument against Allah after the messengers.",
      },
      {
        surah: 16,
        ayahFrom: 36,
        label: "Qur'an 16:36",
        excerpt:
          "We certainly sent into every nation a messenger: Worship Allah and avoid false gods.",
      },
    ],
    appLinks: [
      { label: "Explore prophets timeline", route: "/prophets/timeline" },
      { label: "Read Seerah of Muhammad ﷺ", route: "/seerah" },
    ],
  },
  {
    id: "what-is-prophet",
    section: "context",
    title: "What is a prophet in Islam?",
    summary: "A chosen human who receives revelation and calls people to Allah.",
    body: [
      "A prophet is a human being chosen by Allah to receive revelation and guide people to tawheed, worship, and righteous conduct.",
      "Prophets are not divine and are never worshipped. They are the best of creation in obedience, character, and trustworthiness, while remaining servants of Allah.",
      "Their mission is one in foundation: worship Allah alone. Specific legal details could differ across communities by Allah's wisdom.",
    ],
    quran: [
      {
        surah: 14,
        ayahFrom: 11,
        label: "Qur'an 14:11",
        excerpt:
          "Their messengers said to them: We are only men like you, but Allah favors whom He wills among His servants.",
      },
      {
        surah: 21,
        ayahFrom: 25,
        label: "Qur'an 21:25",
        excerpt:
          "We did not send any messenger before you except that We revealed to him: There is no deity except Me, so worship Me.",
      },
    ],
    appLinks: [
      { label: "Read Surah Al-Anbiya", route: "/quran/21" },
      { label: "Explore prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "nabi-vs-rasul",
    section: "context",
    title: "Nabi vs Rasul",
    summary: "A useful distinction in scholarship, while both are honored prophets.",
    body: [
      "In Islamic scholarship, a common distinction is that every rasul is a nabi, but not every nabi is a rasul. A rasul is often described as sent with a distinct mandate to a people, while a nabi continues guidance through revelation.",
      "The Qur'an uses both terms with honor, and Muslims believe in all prophets and messengers without rejection of any.",
      "Exact technical definitions can vary by scholarly phrasing, but the practical lesson is consistent: receive revelation with humility and follow Allah's guidance.",
    ],
    quran: [
      {
        surah: 19,
        ayahFrom: 51,
        label: "Qur'an 19:51",
        excerpt: "He was chosen, and he was a messenger and a prophet.",
      },
      {
        surah: 2,
        ayahFrom: 285,
        label: "Qur'an 2:285",
        excerpt: "We make no distinction between any of His messengers.",
      },
    ],
    disclaimer:
      "Terminology details are presented in a broad, scholar-neutral way; consult qualified teachers for advanced theological classifications.",
    appLinks: [{ label: "Read Surah Maryam", route: "/quran/19" }],
  },
];

const themeTopics: ProphetsTopic[] = [
  {
    id: "prophets-lessons",
    section: "themes",
    title: "Shared lessons from the prophets",
    summary: "Recurring themes: tawheed, patience, repentance, and moral courage.",
    body: [
      "Across generations, the prophets called to one foundation: worship Allah alone and avoid all forms of shirk. This is the unchanging core of revelation.",
      "Their lives also demonstrate sabr under rejection, trust in Allah during uncertainty, and willingness to reform society with wisdom and courage.",
      "Studying them builds resilience: believers learn to repent quickly, lead ethically, and remain principled even when truth is unpopular.",
    ],
    quran: [
      {
        surah: 12,
        ayahFrom: 111,
        label: "Qur'an 12:111",
        excerpt: "In their stories is a lesson for people of understanding.",
      },
      {
        surah: 6,
        ayahFrom: 90,
        label: "Qur'an 6:90",
        excerpt: "They are the ones whom Allah has guided, so follow their guidance.",
      },
    ],
    actions: [
      "Pick one prophetic lesson each week and apply it intentionally.",
      "Reflect after salah on where you need more patience or repentance.",
      "Teach one authentic prophetic story to family or friends regularly.",
    ],
    appLinks: [
      { label: "Explore prophets timeline", route: "/prophets/timeline" },
      { label: "Read Seerah for lived examples", route: "/seerah" },
    ],
  },
  {
    id: "prophets-miracles",
    section: "themes",
    title: "Miracles and signs of prophethood",
    summary: "Miracles confirm truth by Allah's permission, but do not force belief.",
    body: [
      "Allah gave prophets clear signs suited to their communities: Nuh's ark, Musa's signs before Pharaoh, Isa's miracles by Allah's leave, and the Qur'an for Muhammad ﷺ.",
      "Miracles are not independent powers of prophets; they occur by Allah's will to support revelation and establish proof.",
      "The Qur'an shows that some still rejected despite signs, proving guidance depends on sincerity and submission, not spectacle alone.",
    ],
    quran: [
      {
        surah: 57,
        ayahFrom: 25,
        label: "Qur'an 57:25",
        excerpt:
          "We sent Our messengers with clear proofs and sent down with them the Book and the Balance.",
      },
      {
        surah: 29,
        ayahFrom: 50,
        ayahTo: 51,
        label: "Qur'an 29:50–51",
        excerpt:
          "Say: The signs are only with Allah... Is it not enough for them that We revealed to you the Book recited to them?",
      },
    ],
    appLinks: [
      { label: "Read Surah Al-Qasas (Musa signs)", route: "/quran/28" },
      { label: "Read Surah Maryam (Isa signs)", route: "/quran/19" },
    ],
  },
];

const evidenceTopics: ProphetsTopic[] = [
  {
    id: "quran-prophets-overview",
    section: "evidence",
    title: "Qur'an overview of the prophets",
    summary: "The Qur'an names twenty-five prophets and presents one consistent message.",
    body: [
      "The Qur'an names twenty-five prophets directly and references many more messengers. Their stories are distributed across surahs for reflection and guidance.",
      "Though settings differ, their call is one: tawheed, righteousness, accountability, and mercy through repentance.",
      "This module stays Qur'an-grounded and keeps secondary historical details brief unless supported by reliable evidence.",
    ],
    quran: [
      {
        surah: 40,
        ayahFrom: 78,
        label: "Qur'an 40:78",
        excerpt:
          "We have already sent messengers before you; among them are those We have related to you and among them are those We have not related to you.",
      },
      {
        surah: 3,
        ayahFrom: 84,
        label: "Qur'an 3:84",
        excerpt:
          "We believe in Allah and what was revealed... and what was given to Musa, Isa, and the prophets from their Lord.",
      },
    ],
    appLinks: [
      { label: "Explore prophets timeline", route: "/prophets/timeline" },
      { label: "Browse Qur'an reader", route: "/quran" },
    ],
  },
  {
    id: "references",
    section: "evidence",
    title: "References and reading method",
    summary: "How to study prophets with authenticity, balance, and benefit.",
    body: [
      "Begin with Qur'anic passages, then read authentic hadith, then consult reliable tafsir for context. This order keeps learning rooted in revelation.",
      "Avoid sensational or weak reports that conflict with Qur'anic principles or prophetic dignity. Not every popular story has sound evidence.",
      "Use prophetic biographies to reform your own worship and character, not only to collect historical facts.",
    ],
    quran: [
      {
        surah: 39,
        ayahFrom: 18,
        label: "Qur'an 39:18",
        excerpt:
          "Those who listen to speech and follow the best of it — they are the ones Allah has guided.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2664",
        grade: "sahih",
        excerpt:
          "Whoever travels a path seeking knowledge, Allah makes a path to Paradise easy for him.",
      },
    ],
    actions: [
      "Read one prophet story weekly directly from the Qur'an.",
      "Keep notes on practical lessons, not only timeline facts.",
      "Verify secondary narrations with trustworthy scholars.",
    ],
    disclaimer:
      "Historical dates and exact locations can differ across sources; this hub prioritizes agreed, text-based guidance.",
    appLinks: [
      { label: "Open prophets timeline", route: "/prophets/timeline" },
      { label: "Continue in Seerah studies", route: "/seerah" },
    ],
  },
];

export const PROPHETS_TOPICS: ProphetsTopic[] = [
  ...contextTopics,
  ...PROPHETS_BIO_TOPICS,
  ...themeTopics,
  ...evidenceTopics,
];
