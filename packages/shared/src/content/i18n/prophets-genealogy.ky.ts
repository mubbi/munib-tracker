import type { ProphetsGenealogyNode } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// ky overlay for prophets-genealogy. Index-aligned with PROPHETS_GENEALOGY_NODES in ../prophets-genealogy.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const PROPHETS_GENEALOGY_NODES_KY: DeepPartial<ProphetsGenealogyNode>[] = [
  {
    name: "Адам",
    relationNote:
      "Аллах Адамды Өз колу менен жаратып, ага ысымдарды үйрөткөн. Ал адамзаттын атасы - адамдын ата-энеси жок.",
  },
  {
    name: "Нух",
    relationNote:
      "Куран Адам атанын урпактары жерге тарагандан кийин Нухту элчи катары көрсөтөт, бирок Адам менен Нухтун ортосундагы аралык аталардын аттары аталбайт. Ал бул бутакта Адамдын жанында, Адам атанын жакын уулу катары эмес, пайгамбарлык тарыхта ата-бабалардын мураскери катары көрүнөт.",
  },
  {
    name: "Ибрахим",
    relationNote:
      "Ибрахим Курандын пайгамбарлык тарыхында Нухтун урпактарынан. Куранда алардын ортосундагы ар бир муун тизмектелбейт; Ал Нухтун уулу катары көрүнбөй, өзүнүн үй тармагын жетектейт.",
  },
  {
    name: "Исмаил",
    relationNote:
      "Исмаил Ибрахимдин уулу. Алар чогуу Каабанын пайдубалын көтөрүштү. Куранда Ибрахимдин сабырдуу уулу жөнүндөгү сүйүнчүсү жана курмандык баяны баяндалат.",
  },
  {
    name: "Исхак",
    relationNote:
      "Исхак Ибрахимдин уулу, Исмаилдан кийин берилген жана атасы менен бирге бата алган.",
  },
  {
    name: "Лут",
    relationNote:
      "Куран Лутту Ибрахимдин хижраты жана миссиясы менен тыгыз байланыштырат, бирок Лутту Ибрахимдин уулу деп атабайт. Классикалык тафсир аны көбүнчө Ибрахимдин жээни деп аташат. Ал Ибрагимдин бутагында заманбап өнөктөш катары көрүнөт - эч кандай ата-энелик чек жок.",
  },
  {
    name: "Якуб (Исраил)",
    relationNote:
      "Якуб Исхактын уулу. Алла Таала пайгамбарлыкты жана китепти Ибрахим, Исхак жана Якуптун урпактарына берген.",
  },
  {
    name: "Юсуф",
    relationNote:
      "Юсуф Якубтын уулу. Юсуф сүрөөсү атасы жана бир туугандары менен болгон окуясын кеңири баяндайт.",
  },
  {
    name: "Муса",
    relationNote:
      "Муса Исраил урпактарынан. Куранда анын бир тууганы Харун менен энесинин ысымдары аталат, бирок бул даракка бир пайгамбар-ата-энени тизмектештирүү талап кылынбайт. Ал Муса-Харун бутагынын башчысы болуп саналат.",
  },
  {
    name: "Харун",
    relationNote:
      "Харун Мусанын бир тууганы. Муса Аллахтан Харунду үй-бүлөсүнөн жардамчы кылып дайындоосун суранды. Алар ата-бала катары эмес, бир туугандар катары бөлүшөт.",
  },
  {
    name: "Давуд",
    relationNote:
      "Даудга падышалык жана Забур берилди. Куран анын пайгамбарлыгын жана Сулаймандын андан мурас алгандыгын тастыктайт.",
  },
  {
    name: "Сулейман",
    relationNote:
      "Сулайман Дауддун уулу жана анын падышачылыгын жана пайгамбарлыгын мураска алган.",
  },
  {
    name: "Закария",
    relationNote: "Закария мураскор үчүн дуба кылган пайгамбар болгон. Аллах ага Яхьяны берди.",
  },
  {
    name: "Яхья",
    relationNote: "Яхья Закариянын уулу, атасынын дубасы кабыл алынган.",
  },
  {
    name: "Марьям",
    relationNote:
      "Куранда Имран кызы Мариямдын кадыр-баркы бар. Ал Исанын энеси жана Исанын төрөлгөндө күйөөсү болгон эмес, бул Алланын белгиси.",
  },
  {
    name: "Иса",
    relationNote:
      "Иса – Мариямдын уулу, Аллахтын «Бол» сөзү менен жаратылган, адам атасыз. Ата-энелик байланыш анын апасы Мариямга таандык.",
  },
  {
    name: "Мухаммед ﷺ",
    relationNote:
      "Мухаммед пайгамбар Ибрахим уулу Исмаилдин урпактарынан. Исмаил менен Курайштын ортосундагы деталдуу аталган муундар классикалык сирада сакталган; Куран Ибрахимдин мурасын ар бир ата-бабаны санабастан тастыктайт. Бул жерде эч кандай ата-бала чеки тартылбайт — бир гана мөөр басылган пайгамбарлык жана Исмаил тукуму.",
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
