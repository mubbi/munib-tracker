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
    name: "Nuux",
    relationNote:
      "Qur'aanku wuxuu caddeeyay in Nuux uu ahaa rasuul la soo diray kadib markii faracii Aadam ku faafeen dhulka, laakiin ma magacaabin aabayaasha u dhexeeya Aadam iyo Nuux. Warbixin laga weriyay Ibn Cabbaas ayaa sheegaysa in Aadam iyo Nuux ay u dhexeeyeen qiyaastii toban jiil. Laantan wuxuu ku muuqdaa isagoo ah awoowe ka dambeeyay — ee ma aha wiil toos ah oo Aadam ama Shiith dhaleen.",
  },
  {
    name: "Ibraahim",
    relationNote:
      "Ibraahiim wuxuu ka mid yahay farcankii Nuux ee taariikhda nabiyada ee Qur'aanka. Qur'aanku ma tixin jiil kasta oo u dhexeeya; liiska magacyada Aadam→Ibraahiim ee Wikipedia inta badan waa Israa'iiliyaat, halkanna looma sawirin xiriirro go'an. Ibraahiim wuxuu madax u yahay laanta reerkiisa.",
  },
  {
    name: "Ismaaciil",
    relationNote:
      "Ismaaciil waa ina Ibraahiim. Waxay wada dhiseen saldhigyada Kacbada. Qur'aanku wuxuu ka warramay bishaaradii Ibraahiim ee wiil dulqaad badan iyo qisadii qurbaanka. Abtirsiinta Carabta ee dhaqanka ahi waxay laanta Cadnaaniyiinta (sidaas darteedna Muxammad ﷺ) u raacisaa Ismaaciil — iyadoo jiilal badan oo Cadnaan ka horreeyay ay lumeen.",
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
      "Muuse wuxuu ka mid ahaa Banii Israa'iil. Qur'aanku wuxuu magacaabay walaalkiis Haaruun iyo hooyadiis, laakiin uma baahna in geedkan lagu tixo waalid nabi ah. Wuxuu madax u yahay laanta Muuse–Haaruun. (Silsiladaha Cimraam ee Kitaabka Qudduuska ah looma sawirin — waxay ka baxsan yihiin xiriirrada waalid ee Qur'aanka ee go'an.)",
  },
  {
    name: "Haaruun",
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
      "Nabi Muxammad ﷺ waa wiilkii Cabdullaahi ibn Cabdulmuddalib oo ka mid ahaa Banii Haashim. Siirada qadiimiga ahi waxay diiwaangelisay abtirsiinta aabbe ee Haashim illaa Cadnaan; Cadnaan wixii ka dambeeya ee xagga Ismaaciil, jiilalka magacaaban way lumeen ama waa lagu muransan yahay. Wuxuu ka mid yahay farcankii Ismaaciil ina Ibraahiim (xadiiska saxiixa ah ee Waathila).",
  },
  // —— v2 appends ——
  {
    name: "Shiith (Seth)",
    relationNote:
      "Dhaqanka Islaamka ee qadiimiga ah (iyo soo koobidda caamka ah ee abtirsiinyada dhowr nabi) wuxuu Shiith ku magacaabaa wiil uu Aadam dhalay iyo isku-xidhka jiilalkii hore. Magacyada u dhexeeya Shiith iyo Nuux inta badan waa Israa'iiliyaat, looma sawirin xiriirro go'an.",
  },
  {
    name: "Idriis",
    relationNote:
      "Qur'aanku wuxuu Idriis ku magacaabay nabi runlow ah oo loo sare qaaday meel sare. Liisaska qadiimiga ahi inta badan waxay dhigaan inta u dhexeysa Aadam iyo Nuux (mararka qaarkood waxaa lagu aqoonsadaa Enoch), laakiin Qur'aanku ma magacaabin aabihiis — xiriir waalid looma sawirin.",
  },
  {
    name: "Cimraan",
    relationNote:
      "Alle wuxuu reer Cimraan ka doortay caalamka. Maryam waa gabadhii Cimraan. (Cimraankan waa aabaha Maryam — halkan looma isticmaalin xiriir aabbenimo oo Muuse/Haaruun ah.)",
  },
  {
    name: "Cadnaan",
    relationNote:
      "Dhaqanka Islaamku wuxuu qabaa in Muxammad ﷺ uu ka soo farcamay Cadnaan, Cadnaanna uu ka soo farcamay Ismaaciil — laakiin dhaqanka abtirsiinyada Carabtu wuxuu isku raacsan yahay in abtirsiinta magacaaban ee Cadnaan illaa Ismaaciil ay lumtay. Cadnaan waa madaxa qadiimiga ah ee la isku raacsan yahay ee Carabta Cadnaaniyiinta; xiriir waalid oo Ismaaciil ah looma sawirin.",
  },
  {
    name: "Haashim ibn Cabdi Manaaf",
    relationNote:
      "Haashim waa kan Banii Haashim lagu magacaabay iyo awoowe qadiimi ah oo Nabiga ﷺ. Liiska buuxa ee madaxda Cadnaan→Haashim (Fihr, Mudar, …) waxaa lagu diiwaangeliyay siirada, laakiin halkan waa laga booday maadaama ay yihiin jiilal qabiil oo dhexe — ee aan nabiyo ahayn. Haashim ayaa madax u ah laf-dhabarta Haashimiga ee dhow ee khariidaddan.",
  },
  {
    name: "Cabdulmuddalib",
    relationNote:
      "Cabdulmuddalib (Shayba) waa awoowihii aabbe ee Nabiga ﷺ iyo wiilkii Haashim, sida ku xusan siirada qadiimiga ah.",
  },
  {
    name: "Cabdullaahi ibn Cabdulmuddalib",
    relationNote:
      "Cabdullaahi waa aabbihii Nabi Muxammad ﷺ iyo wiilkii Cabdulmuddalib, sida ku xusan siirada qadiimiga ah.",
  },
];
