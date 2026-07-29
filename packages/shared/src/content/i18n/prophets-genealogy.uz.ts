import type { ProphetsGenealogyNode } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// uz overlay for prophets-genealogy. Index-aligned with PROPHETS_GENEALOGY_NODES in ../prophets-genealogy.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const PROPHETS_GENEALOGY_NODES_UZ: DeepPartial<ProphetsGenealogyNode>[] = [
  {
    name: "Odam",
    relationNote:
      "Alloh taolo Odam alayhissalomni o'z qo'li bilan yaratdi va unga ismlarni o'rgatdi. U insoniyatning otasi - inson ota-onasi yo'q.",
  },
  {
    name: "Nuh",
    relationNote:
      "Qur'onda Odam alayhissalomning zurriyotlari yer yuziga tarqalib ketganidan so'ng Nuh payg'ambar sifatida belgilab qo'yilgan, lekin Odam va Nuh o'rtasidagi oraliq otalar nomi aytilmagan. U Odam Atoning o'g'li sifatida emas, balki bashorat tarixida ajdodlar davomchisi sifatida bu shoxda Odam Atoning yonida paydo bo'ladi.",
  },
  {
    name: "Ibrohim",
    relationNote:
      "Ibrohim Qur'on payg'ambarlik tarixida Nuh avlodlaridandir. Qur'on ular orasidagi har bir avlodni sanab o'tmaydi; u Nuhning to'g'ridan-to'g'ri o'g'li sifatida ko'rinmasdan, o'z uy xo'jaligini boshqaradi.",
  },
  {
    name: "Ismoil",
    relationNote:
      "Ismoil Ibrohimning o'g'li. Ular birgalikda Ka’ba poydevorini ko‘tardilar. Qur'onda Ibrohim alayhissalomning sabrli o'g'il haqida xushxabari va qurbonlik qissasi hikoya qilinadi.",
  },
  {
    name: "Ishoq",
    relationNote:
      "Ishoq Ibrohimning o'g'li bo'lib, Ismoildan keyin berilgan va otasi bilan birga duo qilingan.",
  },
  {
    name: "Lut",
    relationNote:
      "Qur'on Lutni Ibrohimning hijrati va missiyasi bilan chambarchas bog'laydi, lekin Lutni Ibrohimning o'g'li deb atamaydi. Klassik tafsir uni ko‘pincha Ibrohimning jiyani deb ataydi. U Ibrohimning shoxida zamondosh hamkori sifatida namoyon bo'ladi - hech qanday ota-onaga da'vo qilinmaydi.",
  },
  {
    name: "Yoqub (Isroil)",
    relationNote:
      "Yoqub Is’hoqning o‘g‘li. Alloh taolo Ibrohim, Ishoq va Ya’qub avlodlariga payg‘ambarlik va kitob berdi.",
  },
  {
    name: "Yusuf",
    relationNote:
      "Yusuf Ya’qubning o‘g‘li. Yusuf surasi otasi va akalari bilan bo‘lgan voqeasini uzoq hikoya qiladi.",
  },
  {
    name: "Muso",
    relationNote:
      "Muso Bani Isroildandir. Qur'onda uning ukasi Horun va onasining ismlari berilgan, lekin bu daraxtda payg'ambar ota-onani sanab o'tish shart emas. U Muso-Xorun filialining boshlig'i sifatida ishlaydi.",
  },
  {
    name: "Horun",
    relationNote:
      "Horun Musoning ukasi. Muso Alloh taolodan Horunni oilasidan yordamchi qilib berishini so‘radi. Ular ota va o'g'il sifatida emas, balki birodarlar sifatida filialni baham ko'rishadi.",
  },
  {
    name: "Dovud",
    relationNote:
      "Dovudga podshohlik va Zabur berildi. Qur'on uning payg'ambarligini va Sulaymonning undan meros qolganligini tasdiqlaydi.",
  },
  {
    name: "Sulaymon",
    relationNote:
      "Sulaymon Dovudning o'g'li bo'lib, uning saltanati va payg'ambarligi meros bo'lib qoldi.",
  },
  {
    name: "Zakariyo",
    relationNote:
      "Zakariyo merosxo‘r so‘rab duo qilgan payg‘ambar edi. Alloh unga Yahyoni ato etdi.",
  },
  {
    name: "Yahyo",
    relationNote: "Yahyo otasining duosiga ijobat bo'lgan Zakariyoning o'g'lidir.",
  },
  {
    name: "Maryam",
    relationNote:
      "Imron qizi Maryam Qur'onda ulug'langan. U Iso alayhissalomning onasi bo'lib, Isoning tug'ilishida eri bo'lmagan, bu Allohning alomatidir.",
  },
  {
    name: "Iso",
    relationNote:
      "Iso alayhissalom Maryamning o'g'li bo'lib, Alloh taoloning \"Bo'l\" kalimasi bilan inson otasiz yaratilgan. Ota-ona aloqasi onasi Maryam bilan bog'liq.",
  },
  {
    name: "Muhammad ﷺ",
    relationNote:
      "Payg'ambar Muhammad sollallohu alayhi vasallam Ibrohim o'g'li Ismoil avlodlaridandir. Ismoil va Quraysh orasidagi batafsil nomli avlodlar klassik sirada saqlanib qolgan; Qur'on har bir ajdodni sanab o'tmasdan Ibrohim merosini tasdiqlaydi. Bu erda ota-o'g'ilning bevosita chegarasi yo'q - faqat muhrlangan payg'ambarlik va ismoiliy nasl.",
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
