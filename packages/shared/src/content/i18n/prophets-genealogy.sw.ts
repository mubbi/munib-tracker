import type { ProphetsGenealogyNode } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// sw overlay for prophets-genealogy. Index-aligned with PROPHETS_GENEALOGY_NODES in ../prophets-genealogy.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const PROPHETS_GENEALOGY_NODES_SW: DeepPartial<ProphetsGenealogyNode>[] = [
  {
    name: "Adam",
    relationNote:
      "Mwenyezi Mungu alimuumba Adam kwa mkono wake na akamfundisha majina. Yeye ndiye baba wa ubinadamu - hakuna mzazi wa kibinadamu.",
  },
  {
    name: "Nuhu",
    relationNote:
      "Qur'ani inamthibitisha Nuh kuwa ni mjumbe baada ya kizazi cha Adam kuenea duniani, lakini haiwataji mababa wa kati kati ya Adam na Nuh. Anaonekana kando ya Adamu kwenye tawi hili kama mrithi wa mababu katika historia ya kinabii - si kama mwana wa karibu wa Adamu.",
  },
  {
    name: "Ibrahim",
    relationNote:
      "Ibrahim ni miongoni mwa kizazi cha Nuh katika historia ya kinabii ya Qur'ani. Qur'an haiorodheshi kila kizazi baina yao; anaongoza tawi la kaya yake badala ya kuonekana kama mtoto wa karibu wa Nuh.",
  },
  {
    name: "Ismail",
    relationNote:
      "Ismail ni mtoto wa Ibrahim. Kwa pamoja waliinua misingi ya Ka'ba. Qur'an inasimulia bishara za Ibrahim za mtoto mvumilivu na simulizi ya kafara.",
  },
  {
    name: "Ishaq",
    relationNote:
      "Ishaq ni mwana wa Ibrahim, aliyepewa baada ya Ismail, na akabarikiwa pamoja na baba yake.",
  },
  {
    name: "Lutu",
    relationNote:
      "Qur'ani inamfunga Lut kwa ukaribu na kuhama na ujumbe wa Ibrahim lakini haimtaji Lut kama mtoto wa Ibrahim. Tafsir ya kitamaduni mara nyingi humwita mpwa wa Ibrahim. Anaonekana kwenye tawi la Ibrahim kama mshirika wa kisasa - hakuna makali ya mzazi yanayodaiwa.",
  },
  {
    name: "Yakubo (Israeli)",
    relationNote:
      "Yaqub ni mwana wa Ishaq. Mwenyezi Mungu aliweka Utume na Kitabu katika dhuria za Ibrahim, na Is-haq, na Yaaqub.",
  },
  {
    name: "Yusufu",
    relationNote:
      "Yusuf ni mwana wa Yaqub. Surat Yusuf anasimulia kisa chake pamoja na baba yake na ndugu zake kwa urefu.",
  },
  {
    name: "Musa",
    relationNote:
      "Musa anatoka kwa Wana wa Israili. Kurani inamtaja kaka yake Harun na mama yake, lakini haihitaji kuorodhesha nabii-mzazi kwenye mti huu. Anasimama kama mkuu wa tawi la Musa–Harun.",
  },
  {
    name: "Haruni",
    relationNote:
      "Harun ni kaka yake Musa. Musa alimuomba Mwenyezi Mungu amchague Harun kama msaidizi kutoka kwa familia yake. Wanashiriki tawi kama kaka - sio kama baba na mwana.",
  },
  {
    name: "Daud",
    relationNote:
      "Dawud alipewa ufalme na Zabur. Qur'an inathibitisha utume wake na kwamba Sulayman alirithi kutoka kwake.",
  },
  {
    name: "Suleiman",
    relationNote: "Sulayman ni mwana wa Dawud na akarithi ufalme na utume wake.",
  },
  {
    name: "Zakaria",
    relationNote: "Zakariyya alikuwa mtume aliyeomba mrithi. Mwenyezi Mungu alimjaalia Yahya.",
  },
  {
    name: "Yahya",
    relationNote: "Yahya ni mtoto wa Zakariyya, aliyetolewa kwa kujibu dua ya baba yake.",
  },
  {
    name: "Maryamu",
    relationNote:
      "Maryam binti wa Imran anaheshimiwa katika Qur'an. Yeye ni mama wa Isa na hakuwa na mume katika kuzaliwa kwa Isa - Ishara kutoka kwa Mwenyezi Mungu.",
  },
  {
    name: "Isa",
    relationNote:
      "Isa ni mwana wa Maryam, aliyeumbwa kwa neno la Mwenyezi Mungu 'Kuwa' bila baba wa kibinadamu. Kiungo mzazi ni kwa mama yake Maryam.",
  },
  {
    name: "Muhammad ﷺ",
    relationNote:
      "Mtume Muhammad ﷺ anatoka katika kizazi cha Ismail mwana wa Ibrahim. Vizazi vilivyotajwa kwa kina kati ya Ismail na Waquraishi vimehifadhiwa katika sirah ya kawaida; Qur'an inathibitisha urithi wa Ibrahimu bila kuorodhesha kila babu. Hakuna makali ya baba-mwana yamechorwa hapa - tu unabii uliotiwa muhuri na nasaba ya Kiismaili.",
  },
  // —— v2 appends ——
  {
    name: "Sheeth (Seth)",
    relationNote:
      "Classical Islamic tradition names Sheeth as a son of Adam and a link in the early generations. Intermediate names between Sheeth and Nuh are largely Isra'iliyyat and are not drawn as firm edges.",
  },
  {
    name: "Idris",
    relationNote:
      "The Qur'an names Idris as a truthful prophet raised to a high station. Classical lists often place him between Adam and Nuh, but the Qur'an does not name his father — no parent edge is drawn.",
  },
  {
    name: "Imran",
    relationNote:
      "Allah chose the family of Imran above the worlds. Maryam is the daughter of Imran. (This Imran is the father of Maryam — not used here as a father edge for Musa/Harun.)",
  },
  {
    name: "Adnan",
    relationNote:
      "Islamic tradition holds that Muhammad ﷺ descends from Adnan, and that Adnan descends from Ismail — but the named lineage from Adnan back to Ismail is lost. Adnan stands as the agreed classical head of the Adnanite Arabs; no parent edge to Ismail is drawn.",
  },
  {
    name: "Hashim ibn Abd Manaf",
    relationNote:
      "Hashim is the eponym of Banu Hashim and a classical ancestor of the Prophet ﷺ. The full Adnan→Hashim chief-list is recorded in sirah but skipped here as intermediate tribal generations — not prophets. Hashim heads the near Hashimite spine on this map.",
  },
  {
    name: "Abd al-Muttalib",
    relationNote:
      "Abd al-Muttalib (Shaybah) is the paternal grandfather of the Prophet ﷺ and son of Hashim in classical sirah.",
  },
  {
    name: "Abdullah ibn Abd al-Muttalib",
    relationNote:
      "Abdullah is the father of the Prophet Muhammad ﷺ and son of Abd al-Muttalib in classical sirah.",
  },
];
