import type { ProphetsGenealogyNode } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// ms overlay for prophets-genealogy. Index-aligned with PROPHETS_GENEALOGY_NODES in ../prophets-genealogy.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const PROPHETS_GENEALOGY_NODES_MS: DeepPartial<ProphetsGenealogyNode>[] = [
  {
    name: "Adam",
    relationNote:
      "Allah menciptakan Adam dengan tangan-Nya sendiri dan mengajarkannya nama-nama. Dia adalah bapa manusia - tiada ibu bapa manusia.",
  },
  {
    name: "Nuh",
    relationNote:
      "Al-Quran menetapkan Nuh sebagai utusan selepas keturunan Adam tersebar di bumi, tetapi tidak menamakan bapa pertengahan antara Adam dan Nuh. Dia muncul di sebelah Adam di cabang ini sebagai pengganti nenek moyang dalam sejarah kenabian — bukan sebagai anak lelaki terdekat Adam.",
  },
  {
    name: "Ibrahim",
    relationNote:
      "Ibrahim adalah antara keturunan Nuh dalam sejarah kenabian Al-Quran. Al-Quran tidak menyenaraikan setiap generasi di antara mereka; dia mengetuai cawangan rumahnya sendiri daripada muncul sebagai anak kandung Nuh.",
  },
  {
    name: "Ismail",
    relationNote:
      "Ismail adalah anak kepada Ibrahim. Bersama-sama mereka mengangkat asas-asas Ka'bah. Al-Quran menceritakan berita gembira Ibrahim tentang seorang anak yang penyabar dan kisah pengorbanan.",
  },
  {
    name: "Ishaq",
    relationNote:
      "Ishaq adalah anak Ibrahim, dianugerahkan selepas Ismail, dan diberkati bersama bapanya.",
  },
  {
    name: "Lut",
    relationNote:
      "Al-Quran mengaitkan Luth rapat dengan penghijrahan dan misi Ibrahim tetapi tidak menamakan Luth sebagai anak Ibrahim. Tafsir klasik sering memanggilnya anak saudara Ibrahim. Dia muncul di cawangan Ibrahim sebagai sekutu kontemporari - tiada kelebihan ibu bapa dituntut.",
  },
  {
    name: "Yaqub (Israel)",
    relationNote:
      "Yaqub adalah anak kepada Ishaq. Allah menganugerahkan kenabian dan Kitab kepada keturunan Ibrahim, Ishaq, dan Yaqub.",
  },
  {
    name: "Yusuf",
    relationNote:
      "Yusuf adalah anak Yaqub. Surat Yusuf menceritakan kisahnya dengan ayah dan saudara-saudaranya dengan panjang lebar.",
  },
  {
    name: "Musa",
    relationNote:
      "Musa adalah dari Bani Israil. Al-Quran menamakan saudaranya Harun dan ibunya, tetapi tidak memerlukan penyenaraian nabi-ibu bapa pada pokok ini. Dia berdiri sebagai ketua cabang Musa-Harun.",
  },
  {
    name: "Harun",
    relationNote:
      "Harun ialah saudara Musa. Musa memohon kepada Allah agar melantik Harun sebagai penolong dari keluarganya. Mereka berkongsi cawangan sebagai adik beradik — bukan sebagai bapa dan anak.",
  },
  {
    name: "Dawud",
    relationNote:
      "Daud diberi kerajaan dan Zabur. Al-Quran menegaskan kenabiannya dan Sulaiman mewarisi daripadanya.",
  },
  {
    name: "Sulayman",
    relationNote: "Sulaiman adalah putera Daud dan mewarisi kerajaan dan kenabiannya.",
  },
  {
    name: "Zakariyya",
    relationNote:
      "Zakariyya adalah seorang nabi yang mendoakan pewaris. Allah menganugerahkan Yahya kepadanya.",
  },
  {
    name: "Yahya",
    relationNote:
      "Yahya adalah anak kepada Zakariyya, dikabulkan sebagai jawaban atas doa ayahnya.",
  },
  {
    name: "Maryam",
    relationNote:
      "Maryam binti Imran dimuliakan dalam Al-Quran. Dia adalah ibu kepada Isa dan tidak mempunyai suami dalam kelahiran Isa - tanda daripada Allah.",
  },
  {
    name: "Isa",
    relationNote:
      "Isa adalah putera Maryam, diciptakan dengan firman Allah 'Jadilah' tanpa bapa manusia. Pautan ibu bapa adalah kepada ibunya Maryam.",
  },
  {
    name: "Muhammad ﷺ",
    relationNote:
      "Nabi Muhammad ﷺ adalah dari keturunan Ismail bin Ibrahim. Generasi bernama terperinci antara Ismail dan Quraisy dipelihara dalam sirah klasik; Al-Quran mengesahkan warisan Ibrahim tanpa menyenaraikan setiap nenek moyang. Tiada kelebihan bapa-anak yang dilukis di sini — hanya kenabian yang dimeterai dan keturunan Ismailiah.",
  },
];
