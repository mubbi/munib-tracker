import type { ProphetsGenealogyNode } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// fr overlay for prophets-genealogy. Index-aligned with PROPHETS_GENEALOGY_NODES in ../prophets-genealogy.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const PROPHETS_GENEALOGY_NODES_FR: DeepPartial<ProphetsGenealogyNode>[] = [
  {
    name: "Adam",
    relationNote:
      "Allah a créé Adam de sa propre main et lui a appris les noms. Il est le père de l’humanité – pas un parent humain.",
  },
  {
    name: "Nuh",
    relationNote:
      "Le Coran établit Nuh comme messager après que les descendants d'Adam se soient répandus sur terre, mais ne nomme pas les pères intermédiaires entre Adam et Nuh. Il apparaît aux côtés d'Adam sur cette branche comme un successeur ancestral dans l'histoire prophétique — et non comme le fils immédiat d'Adam.",
  },
  {
    name: "Ibrahim",
    relationNote:
      "Ibrahim fait partie des descendants de Nuh dans l'histoire prophétique coranique. Le Coran ne répertorie pas toutes les générations entre elles ; il dirige sa propre branche familiale plutôt que d'apparaître comme le fils immédiat de Nuh.",
  },
  {
    name: "Ismail",
    relationNote:
      "Ismail est le fils d'Ibrahim. Ensemble, ils élevèrent les fondations de la Kaaba. Le Coran raconte la bonne nouvelle d'Ibrahim concernant un fils indulgent et le récit du sacrifice.",
  },
  {
    name: "Ishaq",
    relationNote: "Ishaq est le fils d'Ibrahim, accordé après Ismail et béni avec son père.",
  },
  {
    name: "Lut",
    relationNote:
      "Le Coran lie Lut étroitement à la migration et à la mission d'Ibrahim mais ne nomme pas Lut comme le fils d'Ibrahim. Le tafsir classique l'appelle souvent le neveu d'Ibrahim. Il apparaît sur la branche d'Ibrahim en tant qu'associé contemporain – aucun avantage parental n'est revendiqué.",
  },
  {
    name: "Yaqub (Israël)",
    relationNote:
      "Yaqub est le fils d'Ishaq. Allah a accordé la prophétie et le Livre aux descendants d'Ibrahim, Ishaq et Yaqub.",
  },
  {
    name: "Yusuf",
    relationNote:
      "Yusuf est le fils de Yaqub. La sourate Yusuf raconte longuement son histoire avec son père et ses frères.",
  },
  {
    name: "Musa",
    relationNote:
      "Musa fait partie des enfants d'Israël. Le Coran nomme son frère Harun et sa mère, mais n'exige pas qu'un parent prophète figure sur cet arbre. Il est à la tête de la branche Musa-Harun.",
  },
  {
    name: "Harun",
    relationNote:
      "Harun est le frère de Musa. Musa a demandé à Allah de nommer Harun comme assistant de sa famille. Ils partagent une branche en tant que frères et sœurs – et non en tant que père et fils.",
  },
  {
    name: "Dawud",
    relationNote:
      "Dawud reçut la royauté et le Zabur. Le Coran affirme sa prophétie et que Sulayman a hérité de lui.",
  },
  {
    name: "Sulayman",
    relationNote: "Sulayman est le fils de Dawud et a hérité de son royaume et de sa prophétie.",
  },
  {
    name: "Zakariyya",
    relationNote:
      "Zakariyya était un prophète qui priait pour un héritier. Allah lui a accordé Yahya.",
  },
  {
    name: "Yahya",
    relationNote: "Yahya est le fils de Zakariyya, accordé en réponse au dua de son père.",
  },
  {
    name: "Maryam",
    relationNote:
      "Maryam, fille d'Imran, est honorée dans le Coran. Elle est la mère d'Isa et n'avait pas de mari à la naissance d'Isa – un signe d'Allah.",
  },
  {
    name: "Isa",
    relationNote:
      "Isa est le fils de Maryam, créé par la parole d'Allah « Soyez » sans père humain. Le lien parental est avec sa mère Maryam.",
  },
  {
    name: "Muhammad ﷺ",
    relationNote:
      "Le Prophète Muhammad ﷺ est issu des descendants d'Ismail, fils d'Ibrahim. Les générations nommées détaillées entre Ismail et Quraysh sont conservées dans la sirah classique ; le Coran affirme l'héritage ibrahimique sans énumérer chaque ancêtre. Aucun lien père-fils immédiat n’est dessiné ici – seulement la prophétie scellée et la descendance ismailique.",
  },
  // —— v2 appends ——
  {
    name: "Sheeth (Seth)",
    relationNote:
      "La tradition islamique classique nomme Sheeth fils d'Adam et maillon des premières générations. Les noms intermédiaires entre Sheeth et Nuh sont largement Isra'iliyyat et ne sont pas tracés comme liens parentaux fermes.",
  },
  {
    name: "Idris",
    relationNote:
      "Le Coran nomme Idris comme prophète véridique élevé à un haut rang. Les listes classiques le placent souvent entre Adam et Nuh, mais le Coran ne nomme pas son père — aucun lien parental n'est tracé.",
  },
  {
    name: "Imran",
    relationNote:
      "Allah a choisi la famille d'Imran au-dessus des mondes. Maryam est la fille d'Imran. (Cet Imran est le père de Maryam — non utilisé ici comme père de Musa/Harun.)",
  },
  {
    name: "Adnan",
    relationNote:
      "La tradition islamique tient que Muhammad ﷺ descend d'Adnan, et qu'Adnan descend d'Ismail — mais la lignée nommée d'Adnan à Ismail est perdue. Adnan est le chef classique des Arabes adnanites ; aucun lien parental vers Ismail n'est tracé.",
  },
  {
    name: "Hashim ibn Abd Manaf",
    relationNote:
      "Hashim est l'éponyme des Banu Hashim et un ancêtre classique du Prophète ﷺ. La liste tribale Adnan→Hashim est dans la sirah mais omise ici comme générations intermédiaires — pas des prophètes. Hashim dirige l'épine hashimite proche sur cette carte.",
  },
  {
    name: "Abd al-Muttalib",
    relationNote:
      "Abd al-Muttalib (Shaybah) est le grand-père paternel du Prophète ﷺ et fils de Hashim dans la sirah classique.",
  },
  {
    name: "Abdullah ibn Abd al-Muttalib",
    relationNote:
      "Abdullah est le père du Prophète Muhammad ﷺ et fils d'Abd al-Muttalib dans la sirah classique.",
  },
];
