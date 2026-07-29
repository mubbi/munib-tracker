import type { ProphetsGenealogyNode } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// sq overlay for prophets-genealogy. Index-aligned with PROPHETS_GENEALOGY_NODES in ../prophets-genealogy.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const PROPHETS_GENEALOGY_NODES_SQ: DeepPartial<ProphetsGenealogyNode>[] = [
  {
    name: "Ademi",
    relationNote:
      "Allahu e krijoi Ademin me dorën e Tij dhe ia mësoi emrat. Ai është babai i njerëzimit - asnjë prind njerëzor.",
  },
  {
    name: "Nuhu",
    relationNote:
      "Kurani e vendos Nuhun si lajmëtar pasi pasardhësit e Ademit u përhapën në tokë, por nuk i përmend etërit e ndërmjetëm midis Ademit dhe Nuhut. Ai shfaqet përkrah Adamit në këtë degë si një pasardhës stërgjyshorë në historinë profetike – jo si djali i afërt i Adamit.",
  },
  {
    name: "Ibrahimi",
    relationNote:
      "Ibrahimi është ndër pasardhësit e Nuhut në historinë profetike kuranore. Kur'ani nuk rendit çdo brez mes tyre; ai kryeson degën e tij të familjes në vend që të shfaqet si djali i afërt i Nuhut.",
  },
  {
    name: "Ismaili",
    relationNote:
      "Ismaili është i biri i Ibrahimit. Së bashku ata ngritën themelet e Qabes. Kurani rrëfen lajmin e gëzuar të Ibrahimit për një djalë të durueshëm dhe tregimin e sakrificës.",
  },
  {
    name: "Ishaku",
    relationNote:
      "Is'haku është i biri i Ibrahimit, i dhënë pas Ismailit dhe i bekuar së bashku me babain e tij.",
  },
  {
    name: "Luti",
    relationNote:
      "Kurani e lidh Lutin ngushtë me migrimin dhe misionin e Ibrahimit, por nuk e përmend Lutin si djalin e Ibrahimit. Tefsiri klasik shpesh e quan atë nipin e Ibrahimit. Ai shfaqet në degën e Ibrahimit si një bashkëpunëtor bashkëkohor - nuk pretendohet asnjë avantazh prind.",
  },
  {
    name: "Jakubi (Izraeli)",
    relationNote:
      "Jakubi është i biri i Is'hakut. Allahu ua dha profetësinë dhe librin pasardhësve të Ibrahimit, Is'hakut dhe Jakubit.",
  },
  {
    name: "Jusufi",
    relationNote:
      "Jusufi është i biri i Jakubit. Sureja Jusuf rrëfen gjatë historisë së tij me babain dhe vëllezërit e tij.",
  },
  {
    name: "Musai",
    relationNote:
      "Musai është nga Beni Israilët. Kurani i emëron vëllain e tij Harun dhe nënën e tij, por nuk kërkon që në këtë pemë të renditet një prind-profeti. Ai qëndron si kryetar i degës Musa-Harun.",
  },
  {
    name: "Haruni",
    relationNote:
      "Haruni është vëllai i Musait. Musai i kërkoi Allahut që ta caktojë Harunin si ndihmës nga familja e tij. Ata ndajnë një degë si vëllezër e motra - jo si baba e bir.",
  },
  {
    name: "Davudi",
    relationNote:
      "Davudit iu dha mbretëria dhe Zaburi. Kurani pohon profetësinë e tij dhe atë që Sulejmani e trashëgoi prej tij.",
  },
  {
    name: "Sylejmani",
    relationNote:
      "Sulejmani është i biri i Davudit dhe ka trashëguar mbretërinë dhe profetësinë e tij.",
  },
  {
    name: "Zekerija",
    relationNote:
      "Zakarija ishte një profet që lutej për një trashëgimtar. Allahu i dha atij Jahja.",
  },
  {
    name: "Jahja",
    relationNote:
      "Jahja është djali i Zakariyya-s, i dhënë në përgjigje të duasë së babait të tij.",
  },
  {
    name: "Merjemja",
    relationNote:
      "Merjemja, vajza e Imranit është e nderuar në Kuran. Ajo është nëna e Isait dhe nuk kishte burrë në lindjen e Isait - një shenjë nga Allahu.",
  },
  {
    name: "Isa",
    relationNote:
      "Isai është djali i Merjemes, i krijuar nga fjala e Allahut 'Bëhu' pa baba njerëzor. Lidhja e prindërve është me nënën e tij Merjem.",
  },
  {
    name: "Muhamedi ﷺ",
    relationNote:
      "Profeti Muhamed ﷺ është nga pasardhësit e Ismailit, birit të Ibrahimit. Gjeneratat e hollësishme të emërtuara ndërmjet Ismailit dhe Kurejshit janë ruajtur në sirah klasike; Kurani pohon trashëgiminë Ibrahimike pa renditur çdo paraardhës. Këtu nuk vihet asnjë avantazh i menjëhershëm baba-bir - vetëm profetësia e vulosur dhe prejardhja ismailike.",
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
