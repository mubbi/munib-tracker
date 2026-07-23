import type { ProphetsGenealogyNode } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// bs overlay for prophets-genealogy. Index-aligned with PROPHETS_GENEALOGY_NODES in ../prophets-genealogy.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const PROPHETS_GENEALOGY_NODES_BS: DeepPartial<ProphetsGenealogyNode>[] = [
  {
    name: "Adem",
    relationNote:
      "Allah je stvorio Adama svojom rukom i naučio ga imenima. On je otac čovječanstva - nije ljudski roditelj.",
  },
  {
    name: "Nuh",
    relationNote:
      "Kur'an utvrđuje Nuha kao glasnika nakon što su se Adamovi potomci raširili po zemlji, ali ne navodi imena posrednih očeva između Adama i Nuha. On se pojavljuje pored Adama na ovoj grani kao naslednik predaka u proročkoj istoriji - ne kao Adamov neposredni sin.",
  },
  {
    name: "Ibrahim",
    relationNote:
      "Ibrahim je među Nuhovim potomcima u kur'anskoj proročkoj historiji. Kur'an ne navodi svaku generaciju između njih; on vodi vlastitu ogranak domaćinstva umjesto da se pojavljuje kao Nuhov neposredni sin.",
  },
  {
    name: "Ismail",
    relationNote:
      "Ismail je Ibrahimov sin. Zajedno su podigli temelje Ka'be. Kur'an prepričava Ibrahimovu radosnu vijest o blagonaklonom sinu i naraciju o žrtvovanju.",
  },
  {
    name: "Ishak",
    relationNote:
      "Ishak je Ibrahimov sin, darovan nakon Ismaila, i blagoslovljen zajedno sa svojim ocem.",
  },
  {
    name: "Lut",
    relationNote:
      "Kur'an usko povezuje Luta sa Ibrahimovom migracijom i misijom, ali ne imenuje Luta kao Ibrahimovog sina. Klasični tefsir ga često naziva Ibrahimovim nećakom. On se pojavljuje na Ibrahimovoj grani kao savremeni saradnik - nema prava na roditeljsku prednost.",
  },
  {
    name: "Jakub (Israel)",
    relationNote:
      "Yaqub je Ishakov sin. Allah je podario vjerovjesništvo i Knjigu potomcima Ibrahima, Ishaka i Jakuba.",
  },
  {
    name: "Yusuf",
    relationNote:
      "Jusuf je Jakubov sin. Surat Jusuf opširno prenosi svoju priču sa svojim ocem i braćom.",
  },
  {
    name: "Musa",
    relationNote:
      "Musa je od djece Izraela. Kur'an imenuje njegovog brata Haruna i njegovu majku, ali ne zahtijeva navođenje roditelja proroka na ovom drvetu. On je šef ogranka Musa-Harun.",
  },
  {
    name: "Harun",
    relationNote:
      "Harun je Musaov brat. Musa je zamolio Allaha da odredi Haruna kao pomagača iz njegove porodice. Oni dijele granu kao braća i sestre - ne kao otac i sin.",
  },
  {
    name: "Davud",
    relationNote:
      "Davud je dobio kraljevsku vlast i Zabur. Kur'an potvrđuje njegovo poslanstvo i ono što je Sulejman naslijedio od njega.",
  },
  {
    name: "Sulejman",
    relationNote: "Sulayman je Davudov sin i naslijedio je njegovo kraljevstvo i proročanstvo.",
  },
  {
    name: "Zekerija",
    relationNote: "Zakariyya je bio prorok koji se molio za nasljednika. Allah mu je dao Jahju.",
  },
  {
    name: "Jahja",
    relationNote: "Yahya je Zakarijev sin, odobren kao odgovor na dovu njegovog oca.",
  },
  {
    name: "Merjema",
    relationNote:
      "Merjem ćerka Imranova je počašćena u Kur'anu. Ona je Isaova majka i nije imala muža u Isainom rođenju — Allahov znak.",
  },
  {
    name: "Isa",
    relationNote:
      "Isa je Merjemin sin, stvoren Allahovom riječju 'Budi' bez ljudskog oca. Roditeljska veza je sa njegovom majkom Maryam.",
  },
  {
    name: "Muhammed ﷺ",
    relationNote:
      "Poslanik Muhammed, sallallahu alejhi ve sellem, je od potomaka Ismaila sina Ibrahimovog. Detaljno imenovane generacije između Ismaila i Kurejšija sačuvane su u klasičnom sirahu; Kur'an potvrđuje Ibrahimovo naslijeđe bez navođenja svakog pretka. Ovdje nije povučena neposredna ivica oca i sina – samo zapečaćeno proročanstvo i ismailičko porijeklo.",
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
