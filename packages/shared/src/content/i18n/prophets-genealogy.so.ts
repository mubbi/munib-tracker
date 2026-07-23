import type { ProphetsGenealogyNode } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// so overlay for prophets-genealogy. Index-aligned with PROPHETS_GENEALOGY_NODES in ../prophets-genealogy.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const PROPHETS_GENEALOGY_NODES_SO: DeepPartial<ProphetsGenealogyNode>[] = [
  {
    name: "Aadam",
    relationNote:
      "Eebe ku abuuray Aadam gacantiisa oo baray magacyada. Isagu waa aabbaha aadanaha - ma jiro waalid bini'aadam ah.",
  },
  {
    name: "Nux",
    relationNote:
      "Quraanku wuxuu Nabi Nuux ka dhigay Rasuul ka dib markii faracii Aadam ay ku faafeen dhulka, laakiin ma sheegin magacyada dhex dhexaadinta Aabayaasha u dhexeeya Aadam iyo Nuux. Waxa uu ka soo muuqday Aadan agtiisa laantan isaga oo ah dhaxal-sugaha awoowaha ee taariikhda nebiyada - ma aha sida ina Aadan.",
  },
  {
    name: "Ibraahim",
    relationNote:
      "Ibraahiim wuxuu ka mid yahay farcankii Nuux ee taariikhda nabiga Qur'aanka. Qur'aanku kuma tixin jiil kasta oo u dhexeeya; Wuxuu madax ka yahay laantiisa gurigiisa halkii uu u muuqan lahaa inuu yahay wiilka dhow ee Nuux.",
  },
  {
    name: "Ismaaciil",
    relationNote:
      "Ismaaciil waa ina Ibraahim. Waxa ay si wada jir ah kor ugu qaadeen aas aaska Kacbada. Qur’aanku waxa uu ka warramay bishaarayntii Ibraahim ee wiil dulqaad badan iyo qiso naf hurid ah.",
  },
  {
    name: "Isxaaq",
    relationNote:
      "Isxaaq waa ina Ibraahiim, la siiyay Ismaaciil ka dib, kuna barakaysnaa aabihiis.",
  },
  {
    name: "Luud",
    relationNote:
      "Quraanku wuxuu Luud aad ugu xidhan yahay hijradii iyo risashadii Ibraahim, laakiin kuma magacaabin Luud inuu yahay ina Ibraahim. Tafsiirka qadiimiga ah wuxuu inta badan u yaqaannaa ina Ibraahim abtigiis. Waxa uu ka soo muuqdaa laanta Ibraahim isaga oo ah la-hawlgal casri ah - ma jirto cid sheegatay waalidnimo.",
  },
  {
    name: "Yacquub (Israa'iil)",
    relationNote:
      "Yacquub waa ina Isxaaq. Eebbe wuxuu u yeelay nabinimo iyo kitaabka farcankii Ibraahim, Isxaaq iyo Yacquub.",
  },
  {
    name: "Yuusuf",
    relationNote:
      "Yuusuf waa ina Yacquub. Surat Yuusuf waxa ay si qoto dheer uga sheekaynaysaa qisadiisii ​​isaga iyo aabihiis.",
  },
  {
    name: "Muuse",
    relationNote:
      "Muuse wuxuu ahaa Banii Israa'iil. Qur'aanku wuxuu magacaabay walaalkiis Haaruun iyo hooyadiis, laakiin uma baahna in nabi-waalid geedkan lagu taxo. Waxa uu u taagan yahay madaxa laanta Muuse-Harun.",
  },
  {
    name: "Haarun",
    relationNote:
      "Haaruun waa Muuse walaalkii. Muuse wuxuu Alle ka baryay inuu Haaruun uga dhigo gargaar qoyskiisa. Waxay wadaagaan laan walaalo ahaan - ma aha sida aabbe iyo wiil.",
  },
  {
    name: "Daawuud",
    relationNote:
      "Daawuud waxaa la siiyay boqornimo iyo Zabuur. Quraanku waxa uu caddeeyey Nabinimadiisa iyo in Suleymaan uu ka dhaxlay.",
  },
  {
    name: "Suleymaan",
    relationNote: "Sulaymaan waa ina Daawuud oo dhaxlay boqortooyadiisa iyo nabinimadiisa.",
  },
  {
    name: "Zakariye",
    relationNote: "Zakariya wuxuu ahaa nabi u duceeyay dhaxal. Eebbana wuu siiyay Yaxye.",
  },
  {
    name: "Yaxye",
    relationNote: "Yaxye waa ina Zakariya, la siiyay jawaabtii ducada aabihiis.",
  },
  {
    name: "Maryam",
    relationNote:
      "Maryama bintu Cimraan quraanka ayaa lagu sharfay. Iyadu waa Ciise hooyadiis, oo dhalashadii Ciise ninna ma ay lahayn, waana calaamad xagga Eebbe ka timid.",
  },
  {
    name: "Ciise",
    relationNote:
      "Ciise waa ina Maryama, ee uu ku abuuray kelmada Eebbe ee ahow isagoo aan lahayn aabbe bani-aadmi ah. Xiriirka waalidku waa hooyadiis Maryam.",
  },
  {
    name: "Muxammad ﷺ",
    relationNote:
      "Nebi Muxamed ﷺ wuxuu ka soo jeedaa farcii Ismaaciil ibnu Ibraahiim. Jiilal magac leh oo u dhexeeya Ismaaciil iyo Quraysh waxa lagu xafiday sirah qadiimiga ah; Qur'aanku wuxuu xaqiijinayaa dhaxalka Ibraahiim isagoon awoowe kasta soo qorin. Ma jiro aabbe-wiil u dhow oo halkan lagu sawiray - kaliya nebinnimada shaabadaysan iyo faraca Ismaaciil.",
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
