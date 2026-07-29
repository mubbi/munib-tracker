import type { ProphetsGenealogyNode } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// ha overlay for prophets-genealogy. Index-aligned with PROPHETS_GENEALOGY_NODES in ../prophets-genealogy.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const PROPHETS_GENEALOGY_NODES_HA: DeepPartial<ProphetsGenealogyNode>[] = [
  {
    name: "Adam",
    relationNote:
      "Allah ya halicci Adamu da hannunsa ya hore masa suna. Shi ne uban bil'adama - ba iyaye na mutum ba.",
  },
  {
    name: "Nuhu",
    relationNote:
      "Kur’ani ya kafa Nuhu a matsayin manzo bayan zuriyar Adamu sun bazu a doron kasa, amma bai ambaci sunayen ubanni na tsakiya tsakanin Adamu da Nuhu ba. Ya bayyana kusa da Adamu a wannan reshe a matsayin magajin kakanni a tarihin annabci - ba kamar ɗan Adamu ba.",
  },
  {
    name: "Ibrahim",
    relationNote:
      "Ibrahim yana cikin zuriyar Nuhu a tarihin annabci na Kur'ani. Alkur'ani bai lissafta kowace tsara a tsakaninsu ba; yana shugabantar reshen gidansa maimakon ya bayyana a matsayin ɗan Nuhu.",
  },
  {
    name: "Ismail",
    relationNote:
      "Ismail dan Ibrahim ne. Tare suka daga harsashin Ka'aba. Alkur'ani ya ba da labarin busharar Ibrahim na da mai hakuri da labarin sadaukarwa.",
  },
  {
    name: "Ishaq",
    relationNote:
      "Ishaq ]an Ibrahim ne, wanda aka yi wa bayan Isma'il, kuma ya yi albarka tare da mahaifinsa.",
  },
  {
    name: "Lutu",
    relationNote:
      "Kur'ani ya danganta Luɗu da hijira da manzancin Ibrahim amma bai ambaci Luɗu da ɗan Ibrahim ba. Tafsirin gargajiya yakan kira shi yayan Ibrahim. Ya bayyana a reshen Ibrahim a matsayin abokin tarayya na zamani - ba a da'awar iyaye.",
  },
  {
    name: "Yaqub (Isra'ila)",
    relationNote:
      "Yaqub dan Ishaq ne. Allah ya sanya Annabci da Littafi a cikin zuriyar Ibrahim da Ishaq da Yaqub.",
  },
  {
    name: "Yusuf",
    relationNote:
      "Yusuf ]an Yaqub ne. Suratul Yusuf ya ba da labarinsa da mahaifinsa da ’yan’uwansa mai tsawo.",
  },
  {
    name: "Musa",
    relationNote:
      "Musa daga Bani Isra'ila ne. Kur'ani ya ambaci sunan ɗan'uwansa Haruna da mahaifiyarsa, amma ba ya buƙatar lissafta wani annabi-iyaye akan wannan bishiyar. Ya tsaya a matsayin shugaban reshen Musa–Harun.",
  },
  {
    name: "Haruna",
    relationNote:
      "Haruna kanin Musa ne. Musa ya roki Allah ya nada Haruna a matsayin mai taimakon iyalansa. Suna raba reshe a matsayin 'yan'uwa - ba kamar uba da ɗa ba.",
  },
  {
    name: "Dawuda",
    relationNote:
      "Aka Ba Dawud sarauta da Zabur. Alkur'ani ya tabbatar da Annabcinsa da kuma cewa Sulaiman ya gada daga gare shi.",
  },
  {
    name: "Sulaiman",
    relationNote: "Sulaiman xan Dawud ne kuma ya gaji mulkinsa da Annabcinsa.",
  },
  {
    name: "Zakariyya",
    relationNote: "Zakariyya Annabi ne mai addu'a ga magaji. Allah ya ba shi Yahaya.",
  },
  {
    name: "Yahya",
    relationNote: "Yahya dan Zakariyya ne, aka bashi amsa addu'ar mahaifinsa.",
  },
  {
    name: "Maryam",
    relationNote:
      "Maryam 'yar Imrana ta samu daraja a cikin Alqur'ani. Ita ce mahaifiyar Isa, kuma ba ta da miji a cikin haihuwar Isa, aya ce daga wurin Allah.",
  },
  {
    name: "Isa",
    relationNote:
      "Isa dan Maryama ne, da kalmar Allah ‘Kas’ halitta, ba tare da uba na mutum ba. Iyayen haɗin kai shine mahaifiyarsa Maryam.",
  },
  {
    name: "Muhammad ﷺ",
    relationNote:
      "Annabi Muhammad SAW daga zuriyar Isma'il dan Ibrahim ne. Cikakken sunayen tsararraki tsakanin Ismail da Kuraishawa an adana su cikin sirah na gargajiya; Kur'ani ya tabbatar da gadon Ibrahim ba tare da lissafta kowane kakanni ba. Babu wani gefen uba-da da aka zana a nan - kawai annabci da aka hatimce da zuriyar Isma'il.",
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
