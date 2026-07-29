import type { ProphetsGenealogyNode } from "../types/prophets";

/**
 * Prophets family tree — Adam toward the last Messenger ﷺ.
 *
 * STRICT RULES (see docs/FEATURES.md NF-2.36 + type ProphetsGenealogyCertainty):
 * - Only sourced genealogy. No AI-invented lineages.
 * - Parent edges require Qur'an, authentic hadith, or clearly labelled classical history.
 * - Gaps are left empty rather than filled with Isra'iliyyat names.
 * - Wikipedia's Family tree of Muhammad lists many Quraysh relatives and a long
 *   Adam→Ibrahim name-chain borrowed from Hebrew/Isra'iliyyat; those speculative
 *   generations are NOT drawn as firm edges here (wiki itself notes Adnan→Ismail
 *   is lost, and Adam→Ibrahim is largely Isra'iliyyat).
 * - Many Qur'anic prophets (Hud, Salih, Shuayb, Yunus, …) appear in bios but have
 *   no firm parent edge here — they are omitted from the tree rather than guessed.
 *
 * Primary reference consulted for classical Hashim→Muhammad spine:
 * https://en.wikipedia.org/wiki/Family_tree_of_Muhammad (Adnan→Muhammad / Hashim house)
 * plus Qur'an and labelled classical sirah (Ibn Hisham, Tabari).
 *
 * Bump the version when the graph changes.
 */
export const PROPHETS_GENEALOGY_CONTENT_VERSION = 2;

export const PROPHETS_GENEALOGY_BRANCH_ORDER = [
  "adam-nuh",
  "ibrahim",
  "israel",
  "musa",
  "dawud",
  "zakariyya",
  "isa",
  "muhammad",
] as const;

export const PROPHETS_GENEALOGY_NODES: ProphetsGenealogyNode[] = [
  // —— Existing index order (0–16) preserved for i18n overlay alignment ——
  {
    id: "adam",
    name: "Adam",
    prophetId: "adam",
    parentId: null,
    certainty: "quran",
    relationNote:
      "Allah created Adam with His own hand and taught him the names. He is the father of humanity — no human parent.",
    sources: ["Qur'an 2:30–37", "Qur'an 38:71–72"],
    branch: "adam-nuh",
  },
  {
    id: "nuh",
    name: "Nuh",
    prophetId: "nuh",
    parentId: null,
    certainty: "classical-history",
    relationNote:
      "The Qur'an establishes Nuh as a messenger after Adam's descendants spread on earth, but does not name the intermediate fathers between Adam and Nuh. A report from Ibn Abbas states there were about ten generations between Adam and Nuh. He appears on this branch as an ancestral successor — not as Adam's or Sheeth's immediate son.",
    sources: [
      "Qur'an 7:59–64",
      "Qur'an 71:1–28",
      "Mustadrak al-Hakim (Ibn Abbas: ~ten generations Adam→Nuh)",
      "Classical history (ancestral, not immediate father)",
    ],
    branch: "adam-nuh",
  },
  {
    id: "ibrahim",
    name: "Ibrahim",
    prophetId: "ibrahim",
    parentId: null,
    certainty: "classical-history",
    relationNote:
      "Ibrahim is among the descendants of Nuh in the Qur'anic prophetic history. The Qur'an does not list every generation between them; Wikipedia's Adam→Ibrahim name-list is largely Isra'iliyyat and is not drawn as firm edges here. Ibrahim heads his own household branch.",
    sources: [
      "Qur'an 6:83–87",
      "Qur'an 37:83",
      "Classical history (ancestral link)",
      "en.wikipedia.org/wiki/Family_tree_of_Muhammad (Ibrahim→Adam noted as largely Isra'iliyyat)",
    ],
    branch: "ibrahim",
  },
  {
    id: "ismail",
    name: "Ismail",
    prophetId: "ismail",
    parentId: "ibrahim",
    certainty: "quran",
    relationNote:
      "Ismail is the son of Ibrahim. Together they raised the foundations of the Ka'bah. The Qur'an recounts Ibrahim's glad tidings of a forbearing son and the sacrifice narrative. Traditional Arab genealogy traces the Adnanite line (and thus Muhammad ﷺ) through Ismail — with a lost stretch of generations before Adnan.",
    sources: [
      "Qur'an 2:125–127",
      "Qur'an 14:37–39",
      "Qur'an 37:100–107",
      "Sahih Muslim / Tirmidhi (Wathilah: Allah chose Ismail from Ibrahim's progeny…)",
    ],
    branch: "ibrahim",
  },
  {
    id: "ishaq",
    name: "Ishaq",
    prophetId: "ishaq",
    parentId: "ibrahim",
    certainty: "quran",
    relationNote:
      "Ishaq is the son of Ibrahim, granted after Ismail, and blessed along with his father.",
    sources: ["Qur'an 11:71–72", "Qur'an 37:112–113", "Qur'an 21:72"],
    branch: "ibrahim",
  },
  {
    id: "lut",
    name: "Lut",
    prophetId: "lut",
    parentId: null,
    certainty: "classical-history",
    relationNote:
      "The Qur'an ties Lut closely to Ibrahim's migration and mission but does not name Lut as Ibrahim's son. Classical tafsir often calls him Ibrahim's nephew. He appears on Ibrahim's branch as a contemporary associate — no parent edge is claimed.",
    sources: ["Qur'an 21:71–75", "Qur'an 29:26", "Classical tafsir/history (nephew tradition)"],
    branch: "ibrahim",
  },
  {
    id: "yaqub",
    name: "Yaqub (Israel)",
    prophetId: "yaqub",
    parentId: "ishaq",
    certainty: "quran",
    relationNote:
      "Yaqub is the son of Ishaq. Allah bestowed prophethood and the Book among the descendants of Ibrahim, Ishaq, and Yaqub.",
    sources: ["Qur'an 11:71", "Qur'an 29:27", "Qur'an 38:45–47"],
    branch: "israel",
  },
  {
    id: "yusuf",
    name: "Yusuf",
    prophetId: "yusuf",
    parentId: "yaqub",
    certainty: "quran",
    relationNote:
      "Yusuf is the son of Yaqub. Surat Yusuf narrates his story with his father and brothers at length.",
    sources: ["Qur'an 12:4–6", "Qur'an 12:84–100"],
    branch: "israel",
  },
  {
    id: "musa",
    name: "Musa",
    prophetId: "musa",
    parentId: null,
    certainty: "quran",
    relationNote:
      "Musa is from the Children of Israel. The Qur'an names his brother Harun and his mother, but does not require listing a prophet-parent on this tree. He stands as head of the Musa–Harun branch. (Biblical Amram chains are not drawn — they are outside firm Qur'anic parent edges.)",
    sources: ["Qur'an 20:9–36", "Qur'an 28:7–13", "Qur'an 19:51–53"],
    branch: "musa",
  },
  {
    id: "harun",
    name: "Harun",
    prophetId: "harun",
    parentId: null,
    siblingOf: "musa",
    certainty: "quran",
    relationNote:
      "Harun is the brother of Musa. Musa asked Allah to appoint Harun as a helper from his family. They share a branch as siblings — not as father and son.",
    sources: ["Qur'an 20:29–36", "Qur'an 19:53", "Qur'an 7:142"],
    branch: "musa",
  },
  {
    id: "dawud",
    name: "Dawud",
    prophetId: "dawud",
    parentId: null,
    certainty: "quran",
    relationNote:
      "Dawud was given kingship and the Zabur. The Qur'an affirms his prophethood and that Sulayman inherited from him.",
    sources: ["Qur'an 38:17–26", "Qur'an 17:55", "Qur'an 27:15–16"],
    branch: "dawud",
  },
  {
    id: "sulayman",
    name: "Sulayman",
    prophetId: "sulayman",
    parentId: "dawud",
    certainty: "quran",
    relationNote: "Sulayman is the son of Dawud and inherited his kingdom and prophethood.",
    sources: ["Qur'an 27:16", "Qur'an 38:30"],
    branch: "dawud",
  },
  {
    id: "zakariyya",
    name: "Zakariyya",
    prophetId: "zakariyya",
    parentId: null,
    certainty: "quran",
    relationNote: "Zakariyya was a prophet who prayed for an heir. Allah granted him Yahya.",
    sources: ["Qur'an 19:2–15", "Qur'an 3:38–41"],
    branch: "zakariyya",
  },
  {
    id: "yahya",
    name: "Yahya",
    prophetId: "yahya",
    parentId: "zakariyya",
    certainty: "quran",
    relationNote: "Yahya is the son of Zakariyya, granted in answer to his father's dua.",
    sources: ["Qur'an 19:7–15", "Qur'an 3:39"],
    branch: "zakariyya",
  },
  {
    id: "maryam",
    name: "Maryam",
    parentId: "imran",
    certainty: "quran",
    relationNote:
      "Maryam daughter of Imran is honored in the Qur'an. She is the mother of Isa and had no husband in the birth of Isa — a sign from Allah.",
    sources: ["Qur'an 3:33–37", "Qur'an 3:42–47", "Qur'an 19:16–21", "Qur'an 66:12"],
    branch: "isa",
  },
  {
    id: "isa",
    name: "Isa",
    prophetId: "isa",
    parentId: "maryam",
    certainty: "quran",
    relationNote:
      "Isa is the son of Maryam, created by Allah's word 'Be' without a human father. The parent link is to his mother Maryam.",
    sources: ["Qur'an 3:45–47", "Qur'an 19:19–21", "Qur'an 4:171"],
    branch: "isa",
  },
  {
    id: "muhammad",
    name: "Muhammad ﷺ",
    prophetId: "muhammad",
    parentId: "abdullah",
    certainty: "classical-history",
    relationNote:
      "The Prophet Muhammad ﷺ is the son of Abdullah ibn Abd al-Muttalib of Banu Hashim. Classical sirah records the patriline through Hashim to Adnan; beyond Adnan toward Ismail the named generations are lost or disputed. He is from the descendants of Ismail son of Ibrahim (authentic hadith of Wathilah).",
    sources: [
      "Qur'an 2:129",
      "Qur'an 62:2",
      "Sahih Muslim / Tirmidhi (Wathilah: chosen from Banu Hashim)",
      "Ibn Hisham / Tabari: Abdullah → Abd al-Muttalib → Hashim… → Adnan",
      "en.wikipedia.org/wiki/Family_tree_of_Muhammad",
    ],
    branch: "muhammad",
  },

  // —— v2 appends (wiki-aligned; keep after index 16 for overlay alignment) ——
  {
    id: "sheeth",
    name: "Sheeth (Seth)",
    parentId: "adam",
    certainty: "classical-history",
    relationNote:
      "Classical Islamic tradition (and the common lineage summary of several prophets) names Sheeth as a son of Adam and a link in the early generations. Intermediate names between Sheeth and Nuh are largely Isra'iliyyat and are not drawn as firm edges.",
    sources: [
      "Classical Islamic tradition (Sheeth son of Adam)",
      "en.wikipedia.org/wiki/Family_tree_of_Muhammad (Template: Six Islamic Prophets — Adam→Sheeth→…→Nuh with dotted multi-generation gaps)",
    ],
    branch: "adam-nuh",
  },
  {
    id: "idris",
    name: "Idris",
    prophetId: "idris",
    parentId: null,
    certainty: "quran",
    relationNote:
      "The Qur'an names Idris as a truthful prophet raised to a high station. Classical lists often place him between Adam and Nuh (sometimes identified with Enoch), but the Qur'an does not name his father — no parent edge is drawn.",
    sources: [
      "Qur'an 19:56–57",
      "Qur'an 21:85–86",
      "Classical lists (placement between Adam and Nuh; not a Qur'anic parent name)",
    ],
    branch: "adam-nuh",
  },
  {
    id: "imran",
    name: "Imran",
    parentId: null,
    certainty: "quran",
    relationNote:
      "Allah chose the family of Imran above the worlds. Maryam is the daughter of Imran. (This Imran is the father of Maryam — not used here as a father edge for Musa/Harun.)",
    sources: ["Qur'an 3:33–37", "Qur'an 66:12"],
    branch: "isa",
  },
  {
    id: "adnan",
    name: "Adnan",
    parentId: null,
    certainty: "classical-history",
    relationNote:
      "Islamic tradition holds that Muhammad ﷺ descends from Adnan, and that Adnan descends from Ismail — but Arabic genealogical tradition agrees the named lineage from Adnan back to Ismail is lost. Adnan stands as the agreed classical head of the Adnanite Arabs; no parent edge to Ismail is drawn.",
    sources: [
      "Tabari, History vol. 6 (genealogists agree to Ma'add b. Adnan)",
      "en.wikipedia.org/wiki/Family_tree_of_Muhammad (Adnan→Ismail: lineage lost)",
      "Classical sirah / Arab oral genealogy",
    ],
    branch: "muhammad",
  },
  {
    id: "hashim",
    name: "Hashim ibn Abd Manaf",
    parentId: null,
    certainty: "classical-history",
    relationNote:
      "Hashim is the eponym of Banu Hashim and a classical ancestor of the Prophet ﷺ. The full Adnan→Hashim chief-list (Fihr, Mudar, …) is recorded in sirah but skipped here as intermediate tribal generations — not prophets. Hashim heads the near Hashimite spine on this map.",
    sources: [
      "Ibn Hisham, Sirah",
      "en.wikipedia.org/wiki/Family_tree_of_Muhammad (Hashim / Banu Hashim)",
      "Sahih Muslim / Tirmidhi (chosen from Banu Hashim)",
    ],
    branch: "muhammad",
  },
  {
    id: "abd-al-muttalib",
    name: "Abd al-Muttalib",
    parentId: "hashim",
    certainty: "classical-history",
    relationNote:
      "Abd al-Muttalib (Shaybah) is the paternal grandfather of the Prophet ﷺ and son of Hashim in classical sirah.",
    sources: ["Ibn Hisham, Sirah", "en.wikipedia.org/wiki/Family_tree_of_Muhammad"],
    branch: "muhammad",
  },
  {
    id: "abdullah",
    name: "Abdullah ibn Abd al-Muttalib",
    parentId: "abd-al-muttalib",
    certainty: "classical-history",
    relationNote:
      "Abdullah is the father of the Prophet Muhammad ﷺ and son of Abd al-Muttalib in classical sirah.",
    sources: ["Ibn Hisham, Sirah", "en.wikipedia.org/wiki/Family_tree_of_Muhammad"],
    branch: "muhammad",
  },
];
