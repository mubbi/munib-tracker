import type { ProphetsGenealogyNode } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// az overlay for prophets-genealogy. Index-aligned with PROPHETS_GENEALOGY_NODES in ../prophets-genealogy.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const PROPHETS_GENEALOGY_NODES_AZ: DeepPartial<ProphetsGenealogyNode>[] = [
  {
    name: "Adəm",
    relationNote:
      "Allah Adəmi öz əli ilə yaratmış və ona adları öyrətmişdir. O, bəşəriyyətin atasıdır - insan valideyni yoxdur.",
  },
  {
    name: "Nuh",
    relationNote:
      "Quran, Adəmin nəslinin yer üzünə yayılmasından sonra Nuhu peyğəmbər olaraq təyin edir, lakin Adəmlə Nuh arasındakı ara ataların adını çəkmir. O, bu budaqda Adəmin yanında peyğəmbərlik tarixində əcdadların davamçısı kimi görünür - Adəmin yaxın oğlu kimi deyil.",
  },
  {
    name: "İbrahim",
    relationNote:
      "İbrahim Quranın peyğəmbərlik tarixində Nuhun nəslindəndir. Quran onların arasında olan hər nəsli sadalamır; o, Nuhun yaxın oğlu kimi görünməkdənsə, öz təsərrüfat şöbəsinə rəhbərlik edir.",
  },
  {
    name: "İsmail",
    relationNote:
      "İsmayıl İbrahimin oğludur. Onlar birlikdə Kəbənin bünövrəsini ucaltdılar. Qurani-Kərimdə İbrahimin həlim oğul müjdəsi və qurbanlıq hekayəsi nəql olunur.",
  },
  {
    name: "İshaq",
    relationNote:
      "İshaq İbrahimin oğludur, İsmayıldan sonra bəxş edilmiş və atası ilə birlikdə xeyir-dua almışdır.",
  },
  {
    name: "Lut",
    relationNote:
      "Quran Lutu İbrahimin hicrəti və missiyası ilə sıx bağlayır, lakin Lutun İbrahimin oğlu kimi adını çəkmir. Klassik təfsir onu çox vaxt İbrahimin qardaşı oğlu adlandırır. O, İbrahimin filialında müasir bir tərəfdaş kimi görünür - heç bir valideyn üstünlüyü iddia edilmir.",
  },
  {
    name: "Yaqub (İsrail)",
    relationNote:
      "Yaqub İshaqın oğludur. Allah İbrahimin, İshaqın və Yəqubun nəslinə peyğəmbərlik və Kitab verdi.",
  },
  {
    name: "Yusuf",
    relationNote:
      "Yusif Yaqubun oğludur. Yusif surəsi öz hekayəsini atası və qardaşları ilə uzun-uzadı danışır.",
  },
  {
    name: "Musa",
    relationNote:
      "Musa İsrail oğullarındandır. Quranda onun qardaşı Harun və anasının adları çəkilir, lakin bu ağacda bir peyğəmbər-valideynin qeyd edilməsini tələb etmir. Musa-Harun qolunun rəhbəridir.",
  },
  {
    name: "Harun",
    relationNote:
      "Harun Musanın qardaşıdır. Musa Allahdan Harunu ailəsindən köməkçi təyin etməsini istədi. Onlar ata və oğul kimi deyil, bacı-qardaş kimi bir budağı paylaşırlar.",
  },
  {
    name: "Davud",
    relationNote:
      "Davuda padşahlıq və Zəbur verildi. Quran onun peyğəmbərliyini və Süleymanın ondan miras qaldığını təsdiq edir.",
  },
  {
    name: "Süleyman",
    relationNote: "Süleyman Davudun oğludur və onun mülkünə və peyğəmbərliyinə varis olmuşdur.",
  },
  {
    name: "Zəkəriyyə",
    relationNote: "Zəkəriyya varis üçün dua edən bir peyğəmbər idi. Allah ona Yəhya bəxş etdi.",
  },
  {
    name: "Yəhya",
    relationNote: "Yəhya atasının duasına cavab olaraq qəbul edilən Zəkəriyya oğludur.",
  },
  {
    name: "Məryəm",
    relationNote:
      "İmranın qızı Məryəm Quranda şərəflidir. O, İsanın anasıdır və İsanın doğumunda əri yox idi - bu, Allahdan bir əlamətdir.",
  },
  {
    name: "İsa",
    relationNote:
      "İsa Məryəmin oğludur, Allahın “Ol” kəlməsi ilə insan atası olmadan yaradılmışdır. Valideyn əlaqəsi anası Məryəmədir.",
  },
  {
    name: "Muhəmməd ﷺ",
    relationNote:
      "Məhəmməd peyğəmbər İbrahim oğlu İsmayılın nəslindəndir. İsmayıl və Qüreyş arasında ətraflı adlandırılmış nəsillər klassik sirada qorunub saxlanılır; Quran hər bir əcdadı sadalamadan İbrahimin mirasını təsdiq edir. Burada birbaşa ata-oğul kənarı çəkilmir - yalnız möhürlənmiş peyğəmbərlik və İsmail nəsli.",
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
