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
    name: "Şis (Set)",
    relationNote:
      "Klassik İslam ənənəsi (və bir neçə peyğəmbərin geniş yayılmış nəsil xülasəsi) Şisi Adəmin oğlu və ilk nəsillərdə bir halqa kimi adlandırır. Şis ilə Nuh arasındakı ara adlar əsasən İsrailiyyatdır və möhkəm bağlantılar kimi çəkilmir.",
  },
  {
    name: "İdris",
    relationNote:
      "Qurani-Kərim İdrisi uca məqama qaldırılmış doğru sözlü bir peyğəmbər kimi adlandırır. Klassik siyahılar onu çox vaxt Adəmlə Nuh arasında yerləşdirir (bəzən Xanoxla eyniləşdirirlər), lakin Quran onun atasının adını çəkmir — heç bir valideyn bağlantısı çəkilmir.",
  },
  {
    name: "İmran",
    relationNote:
      "Allah İmran ailəsini aləmlərdən üstün seçdi. Məryəm İmranın qızıdır. (Bu İmran Məryəmin atasıdır — burada Musa/Harun üçün ata bağlantısı kimi istifadə olunmur.)",
  },
  {
    name: "Ədnan",
    relationNote:
      "İslam ənənəsinə görə, Məhəmməd ﷺ Ədnanın nəslindəndir, Ədnan isə İsmayılın nəslindəndir — lakin ərəb nəsəbşünaslıq ənənəsi razılaşır ki, Ədnandan İsmayıla qədər adları məlum olan nəsil zənciri itib. Ədnan ədnani ərəblərinin klassik olaraq qəbul edilmiş başçısıdır; İsmayıla heç bir valideyn bağlantısı çəkilmir.",
  },
  {
    name: "Haşim ibn Əbdmənaf",
    relationNote:
      "Haşim Bəni Haşimin adını verən şəxs və Peyğəmbərin ﷺ klassik əcdadıdır. Ədnandan Haşimə qədər tam başçılar siyahısı (Fihr, Mudar, …) sirədə qeyd olunub, lakin burada peyğəmbər olmayan ara qəbilə nəsilləri kimi buraxılır. Bu xəritədə Haşim yaxın Haşimi xəttinin başında durur.",
  },
  {
    name: "Əbdülmüttəlib",
    relationNote:
      "Klassik sirəyə görə, Əbdülmüttəlib (Şeybə) Peyğəmbərin ﷺ ata tərəfdən babası və Haşimin oğludur.",
  },
  {
    name: "Abdullah ibn Əbdülmüttəlib",
    relationNote:
      "Klassik sirəyə görə, Abdullah Peyğəmbər Məhəmmədin ﷺ atası və Əbdülmüttəlibin oğludur.",
  },
];
