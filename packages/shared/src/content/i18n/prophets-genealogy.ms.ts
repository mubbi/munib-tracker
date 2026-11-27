import type { ProphetsGenealogyNode } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// ms overlay for prophets-genealogy. Index-aligned with PROPHETS_GENEALOGY_NODES in ../prophets-genealogy.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const PROPHETS_GENEALOGY_NODES_MS: DeepPartial<ProphetsGenealogyNode>[] = [
  {
    name: "Adam",
    relationNote:
      "Allah menciptakan Adam dengan tangan-Nya sendiri dan mengajarkan kepadanya nama-nama. Baginda ialah bapa sekalian manusia — tanpa ibu bapa daripada kalangan manusia.",
  },
  {
    name: "Nuh",
    relationNote:
      "Al-Quran menetapkan Nuh sebagai rasul yang diutus selepas keturunan Adam tersebar di bumi, tetapi tidak menamakan bapa-bapa perantara antara Adam dan Nuh. Satu riwayat daripada Ibn Abbas menyebut bahawa terdapat kira-kira sepuluh generasi antara Adam dan Nuh. Baginda ditunjukkan pada cabang ini sebagai pewaris keturunan — bukan sebagai anak langsung Adam atau Syis.",
  },
  {
    name: "Ibrahim",
    relationNote:
      "Ibrahim termasuk dalam keturunan Nuh menurut sejarah kenabian dalam Al-Quran. Al-Quran tidak menyenaraikan setiap generasi di antara mereka; senarai nama Adam→Ibrahim dalam Wikipedia kebanyakannya berasal daripada Israiliyyat dan tidak dilukis sebagai hubungan yang kukuh di sini. Ibrahim mengetuai cabang keluarganya sendiri.",
  },
  {
    name: "Ismail",
    relationNote:
      "Ismail ialah putera Ibrahim. Bersama-sama, mereka meninggikan asas Kaabah. Al-Quran menceritakan khabar gembira kepada Ibrahim tentang seorang anak yang penyabar serta kisah korban. Salasilah tradisional Arab menjejaki keturunan Adnaniyah (dan dengan itu Muhammad ﷺ) melalui Ismail — dengan sebahagian generasi sebelum Adnan yang telah hilang.",
  },
  {
    name: "Ishak",
    relationNote:
      "Ishak ialah putera Ibrahim, dikurniakan selepas Ismail, dan diberkati bersama bapanya.",
  },
  {
    name: "Lut",
    relationNote:
      "Al-Quran mengaitkan Lut secara rapat dengan hijrah dan dakwah Ibrahim, tetapi tidak menamakan Lut sebagai anak Ibrahim. Tafsir klasik sering menyebutnya sebagai anak saudara Ibrahim. Baginda ditunjukkan pada cabang Ibrahim sebagai sahabat sezaman — tiada hubungan ibu bapa yang didakwa.",
  },
  {
    name: "Yaakub (Israel)",
    relationNote:
      "Yaakub ialah putera Ishak. Allah mengurniakan kenabian dan Kitab dalam kalangan keturunan Ibrahim, Ishak dan Yaakub.",
  },
  {
    name: "Yusuf",
    relationNote:
      "Yusuf ialah putera Yaakub. Surah Yusuf menceritakan kisah baginda bersama bapa dan saudara-saudaranya dengan panjang lebar.",
  },
  {
    name: "Musa",
    relationNote:
      "Musa berasal daripada Bani Israel. Al-Quran menyebut saudaranya Harun dan ibunya, tetapi tidak memerlukan penyenaraian bapa yang juga nabi pada salasilah ini. Baginda berdiri sebagai ketua cabang Musa–Harun. (Rantaian Amram menurut Bible tidak dilukis — ia berada di luar hubungan ibu bapa yang kukuh menurut Al-Quran.)",
  },
  {
    name: "Harun",
    relationNote:
      "Harun ialah saudara Musa. Musa memohon kepada Allah agar melantik Harun sebagai pembantu daripada kalangan keluarganya. Mereka berkongsi satu cabang sebagai adik-beradik — bukan sebagai bapa dan anak.",
  },
  {
    name: "Daud",
    relationNote:
      "Daud dikurniakan kerajaan dan kitab Zabur. Al-Quran menegaskan kenabian baginda dan bahawa Sulaiman mewarisi daripada baginda.",
  },
  {
    name: "Sulaiman",
    relationNote: "Sulaiman ialah putera Daud dan mewarisi kerajaan serta kenabian baginda.",
  },
  {
    name: "Zakaria",
    relationNote:
      "Zakaria ialah seorang nabi yang berdoa memohon zuriat pewaris. Allah mengurniakan Yahya kepada baginda.",
  },
  {
    name: "Yahya",
    relationNote: "Yahya ialah putera Zakaria, dikurniakan sebagai jawapan kepada doa bapanya.",
  },
  {
    name: "Maryam",
    relationNote:
      "Maryam binti Imran dimuliakan dalam Al-Quran. Beliau ialah ibu kepada Isa dan tidak bersuami ketika melahirkan Isa — satu tanda kebesaran daripada Allah.",
  },
  {
    name: "Isa",
    relationNote:
      "Isa ialah putera Maryam, diciptakan dengan kalimah Allah 'Jadilah' tanpa bapa daripada kalangan manusia. Hubungan induknya adalah kepada ibunya, Maryam.",
  },
  {
    name: "Muhammad ﷺ",
    relationNote:
      "Nabi Muhammad ﷺ ialah putera Abdullah bin Abdul Muttalib daripada Bani Hasyim. Sirah klasik merekodkan salasilah sebelah bapa baginda melalui Hasyim hingga Adnan; selepas Adnan menuju Ismail, nama-nama generasinya telah hilang atau dipertikaikan. Baginda berasal daripada keturunan Ismail putera Ibrahim (hadis sahih riwayat Wathilah).",
  },
  // —— v2 appends ——
  {
    name: "Syis (Seth)",
    relationNote:
      "Tradisi Islam klasik (dan ringkasan salasilah lazim beberapa orang nabi) menamakan Syis sebagai putera Adam dan satu mata rantai dalam generasi terawal. Nama-nama perantara antara Syis dan Nuh kebanyakannya berasal daripada Israiliyyat dan tidak dilukis sebagai hubungan yang kukuh.",
  },
  {
    name: "Idris",
    relationNote:
      "Al-Quran menyebut Idris sebagai seorang nabi yang sangat benar dan diangkat ke kedudukan yang tinggi. Senarai klasik sering meletakkan baginda antara Adam dan Nuh (kadangkala dikenal pasti sebagai Henokh), tetapi Al-Quran tidak menamakan bapanya — tiada hubungan ibu bapa yang dilukis.",
  },
  {
    name: "Imran",
    relationNote:
      "Allah memilih keluarga Imran mengatasi sekalian alam. Maryam ialah puteri Imran. (Imran ini ialah bapa Maryam — tidak digunakan di sini sebagai bapa bagi Musa/Harun.)",
  },
  {
    name: "Adnan",
    relationNote:
      "Tradisi Islam berpegang bahawa Muhammad ﷺ berketurunan daripada Adnan, dan Adnan berketurunan daripada Ismail — tetapi tradisi salasilah Arab bersepakat bahawa rantaian nama dari Adnan kembali kepada Ismail telah hilang. Adnan diterima secara klasik sebagai ketua bangsa Arab Adnaniyah; tiada hubungan ibu bapa kepada Ismail yang dilukis.",
  },
  {
    name: "Hasyim bin Abdul Manaf",
    relationNote:
      "Hasyim ialah tokoh yang namanya menjadi nama Bani Hasyim dan merupakan moyang klasik Nabi ﷺ. Senarai penuh ketua-ketua dari Adnan hingga Hasyim (Fihr, Mudar, …) direkodkan dalam sirah tetapi dilangkau di sini kerana ia generasi kabilah perantara — bukan nabi. Hasyim mengetuai salasilah Hasyimiyah yang terdekat dalam peta ini.",
  },
  {
    name: "Abdul Muttalib",
    relationNote:
      "Abdul Muttalib (Syaibah) ialah datuk sebelah bapa Nabi ﷺ dan putera Hasyim menurut sirah klasik.",
  },
  {
    name: "Abdullah bin Abdul Muttalib",
    relationNote:
      "Abdullah ialah bapa Nabi Muhammad ﷺ dan putera Abdul Muttalib menurut sirah klasik.",
  },
];
