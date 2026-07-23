import type { ProphetsGenealogyNode } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// tk overlay for prophets-genealogy. Index-aligned with PROPHETS_GENEALOGY_NODES in ../prophets-genealogy.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const PROPHETS_GENEALOGY_NODES_TK: DeepPartial<ProphetsGenealogyNode>[] = [
  {
    name: "Adem",
    relationNote:
      "Allah Adam atany öz eli bilen ýaratdy we oňa atlary öwretdi. Ol adamzadyň atasy - adam ene-atasy ýok.",
  },
  {
    name: "Nuh",
    relationNote:
      "Gurhan, Adam atanyň nesilleriniň ýer ýüzüne ýaýramagyndan soň Nuh-a habarçy hökmünde belleýär, ýöne Adam bilen Nuhuň arasyndaky aralyk atalaryň adyny tutmaýar. Ol bu şahada Adam atanyň ýanynda, Adam atanyň ýakyn ogly ýaly däl-de, pygamberlik taryhynda ata-baba mirasdüşeri hökmünde peýda bolýar.",
  },
  {
    name: "Ibrahim",
    relationNote:
      "Ybraýym, Gurhanyň pygamberlik taryhynda Nuhuň nesilleriniň arasynda. Gurhan olaryň arasyndaky her nesli sanamaýar; Nuhuň ýakyn ogly ýaly görünmän, öz öý şahasyna ýolbaşçylyk edýär.",
  },
  {
    name: "Ismail",
    relationNote:
      "Ysmaýyl Ybraýymyň ogly. Bilelikde Ka'banyň düýbüni tutdular. Gurhan, Ybraýymyň sabyrly ogul hakda hoş habary we gurban hakda gürrüň berýär.",
  },
  {
    name: "Yshak",
    relationNote:
      "Yshak, Ysmaýyldan soň berlen we kakasy bilen bilelikde bereketli Ybraýymyň ogly.",
  },
  {
    name: "Lut",
    relationNote:
      "Gurhan Lut-y Ybraýymyň göçmegi we wezipesi bilen ýakyn baglanyşdyrýar, ýöne Lut-y Ybraýymyň ogly diýip atlandyrmaýar. Nusgawy tafsir köplenç oňa Ybraýymyň ýegeni diýýär. Ybraýymyň şahasynda häzirki zaman kärdeşi hökmünde peýda bolýar - ene-atanyň hiç hili talaplary ýok.",
  },
  {
    name: "Ýakup (Ysraýyl)",
    relationNote:
      "Ubakup Yshagyň ogly. Allatagala Ybraýymyň, Yshagyň we ubakubyň nesilleriniň arasynda pygamberlik we Kitap berdi.",
  },
  {
    name: "Ýusup",
    relationNote:
      "Yusufusup ubakubyň ogly. Yusufusup süresi kakasy we doganlary bilen öz hekaýasyny uzyn gürrüň berýär.",
  },
  {
    name: "Musa",
    relationNote:
      "Musa Ysraýyl ogullaryndan. Gurhan dogany Haruna we ejesine at dakýar, ýöne bu agaçda pygamber-ene-atanyň sanawyny talap etmeýär. Musa - Harun bölüminiň başlygy.",
  },
  {
    name: "Harun",
    relationNote:
      "Harun Musanyň dogany. Musa Alladan Haruny maşgalasyndan kömekçi edip bellemegini isledi. Bir şahany dogan hökmünde paýlaşýarlar - kakasy we ogly ýaly däl.",
  },
  {
    name: "Dawut",
    relationNote:
      "Dawuda patyşalyk we Zabur berildi. Gurhan pygamberligini we Süleýmanyň ondan miras alandygyny tassyklaýar.",
  },
  {
    name: "Süleýman",
    relationNote: "Süleýman Dawudyň ogly we şalygyna we pygamberligine miras galypdyr.",
  },
  {
    name: "Zekerýa",
    relationNote: "Zakarýa mirasdüşer üçin doga eden pygamberdi. Allah oňa yaahýa berdi.",
  },
  {
    name: "Ýahýa",
    relationNote: "Yaahýa kakasynyň duasyna jogap hökmünde berlen Zakarýanyň ogly.",
  },
  {
    name: "Merýem",
    relationNote:
      "Imranyň gyzy Merýem Gurhanda hormatlanýar. Ol Isanyň ejesi we Isanyň dünýä inmeginde adamsy ýokdy - bu Allanyň alamaty.",
  },
  {
    name: "Isa",
    relationNote:
      "Isa Merýemiň ogly, Allanyň 'Bol' sözi bilen adam atasyz döredildi. Ene-atanyň baglanyşygy ejesi Merýem bilen.",
  },
  {
    name: "Muhammet ﷺ",
    relationNote:
      "Muhammet alaýhyssalam Ybraýymyň ogly Ysmaýylyň nesillerinden. Ysmaýyl bilen Kuraýşyň arasyndaky jikme-jik atlandyrylan nesiller nusgawy sirada saklanýar; Gurhan, her bir ata-babany sanamazdan Ybraýym mirasyny tassyklaýar. Bu ýerde derrew ata-ogluň gyrasy çekilmeýär - diňe möhürlenen pygamberlik we Ysmaýyl nesli.",
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
