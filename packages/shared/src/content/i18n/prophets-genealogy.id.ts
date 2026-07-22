import type { ProphetsGenealogyNode } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// id overlay for prophets-genealogy. Index-aligned with PROPHETS_GENEALOGY_NODES in ../prophets-genealogy.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const PROPHETS_GENEALOGY_NODES_ID: DeepPartial<ProphetsGenealogyNode>[] = [
  {
    name: "Adam",
    relationNote:
      "Allah menciptakan Adam dengan tangan-Nya sendiri dan mengajarinya nama-nama. Dia adalah bapak umat manusia – bukan orang tua manusia.",
  },
  {
    name: "Nuh",
    relationNote:
      "Al-Qur'an menetapkan Nuh sebagai rasul setelah keturunan Adam tersebar di muka bumi, namun tidak menyebutkan nama ayah perantara antara Adam dan Nuh. Dia muncul di samping Adam pada cabang ini sebagai penerus leluhur dalam sejarah kenabian — bukan sebagai putra langsung Adam.",
  },
  {
    name: "Ibrahim",
    relationNote:
      "Ibrahim termasuk keturunan Nuh dalam sejarah kenabian Al-Qur'an. Al-Qur'an tidak mencantumkan setiap generasi di antara mereka; dia mengepalai cabang rumah tangganya sendiri daripada tampil sebagai putra langsung Nuh.",
  },
  {
    name: "Ismail",
    relationNote:
      "Ismail adalah putra Ibrahim. Bersama-sama mereka membangun fondasi Ka'bah. Al-Qur'an menceritakan kabar gembira Ibrahim tentang seorang putra yang sabar dan narasi pengorbanan.",
  },
  {
    name: "Ishaq",
    relationNote:
      "Ishaq adalah anak Ibrahim, dikaruniai setelah Ismail, dan diberkati bersama ayahnya.",
  },
  {
    name: "Lut",
    relationNote:
      "Al-Qur'an mengaitkan Luth erat dengan migrasi dan misi Ibrahim namun tidak menyebut Luth sebagai putra Ibrahim. Tafsir klasik sering menyebutnya sebagai keponakan Ibrahim. Dia muncul di cabang Ibrahim sebagai rekan sezaman — tidak ada klaim orang tua.",
  },
  {
    name: "Yaqub (Israel)",
    relationNote:
      "Yaqub adalah putra Ishaq. Allah menganugerahkan kenabian dan Kitab kepada keturunan Ibrahim, Ishaq, dan Yaqub.",
  },
  {
    name: "Yusuf",
    relationNote:
      "Yusuf adalah anak Yaqub. Surat Yusuf menceritakan kisahnya bersama ayah dan saudara-saudaranya secara panjang lebar.",
  },
  {
    name: "Musa",
    relationNote:
      "Musa berasal dari Bani Israil. Al-Qur'an menyebutkan nama saudara laki-lakinya Harun dan ibunya, namun tidak mengharuskan mencantumkan orang tua nabi pada pohon ini. Dia berdiri sebagai kepala cabang Musa – Harun.",
  },
  {
    name: "Harun",
    relationNote:
      "Harun adalah saudara Musa. Musa meminta kepada Allah agar mengangkat Harun sebagai penolong keluarganya. Mereka berbagi cabang sebagai saudara kandung – bukan sebagai ayah dan anak.",
  },
  {
    name: "Dawud",
    relationNote:
      "Dawud diberi jabatan raja dan Zabur. Al-Qur'an menegaskan kenabiannya dan Sulaiman mewarisinya.",
  },
  {
    name: "Sulayman",
    relationNote: "Sulaiman adalah putra Dawud dan mewarisi kerajaan dan kenabiannya.",
  },
  {
    name: "Zakariyya",
    relationNote:
      "Zakariyya adalah seorang nabi yang mendoakan ahli waris. Allah memberinya Yahya.",
  },
  {
    name: "Yahya",
    relationNote: "Yahya adalah putra Zakariyya, yang dikabulkan sebagai jawaban atas doa ayahnya.",
  },
  {
    name: "Maryam",
    relationNote:
      "Maryam putri Imran dihormati dalam Al-Qur'an. Dia adalah ibu dari Isa dan tidak memiliki suami pada saat kelahiran Isa — sebuah tanda dari Allah.",
  },
  {
    name: "Isa",
    relationNote:
      "Isa adalah anak Maryam, diciptakan dengan firman Allah 'Jadilah' tanpa ayah manusia. Tautan orang tua adalah ke ibunya Maryam.",
  },
  {
    name: "Muhammad ﷺ",
    relationNote:
      "Nabi Muhammad ﷺ berasal dari keturunan Ismail bin Ibrahim. Nama rinci generasi antara Ismail dan Quraisy dilestarikan dalam sirah klasik; Al-Qur'an menegaskan warisan Ibrahim tanpa mencantumkan setiap leluhur. Tidak ada perbedaan antara ayah dan anak dalam hal ini – yang ada hanyalah kenabian dan keturunan Ismaili.",
  },
];
