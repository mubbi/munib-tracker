import type { ProphetsGenealogyNode } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// kk overlay for prophets-genealogy. Index-aligned with PROPHETS_GENEALOGY_NODES in ../prophets-genealogy.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const PROPHETS_GENEALOGY_NODES_KK: DeepPartial<ProphetsGenealogyNode>[] = [
  {
    name: "Адам",
    relationNote:
      "Алла Тағала Адамды өз қолымен жаратып, оған есімдерді үйретті. Ол адамзаттың әкесі - адамның ата-анасы жоқ.",
  },
  {
    name: "Нұх",
    relationNote:
      "Құран Адам атаның ұрпақтары жер бетіне тарағаннан кейін Нұхты елші етіп бекітеді, бірақ Адам мен Нұхтың арасындағы аралық әкелерді атамайды. Ол Адамның тікелей ұлы ретінде емес, пайғамбарлық тарихтағы ата-баба мұрагері ретінде осы тармақта Адамның жанында пайда болады.",
  },
  {
    name: "Ибраһим",
    relationNote:
      "Құранның пайғамбарлық тарихында Ибраһим Нұхтың ұрпақтарының бірі. Құран олардың арасындағы әрбір ұрпақты санамады; ол Нұхтың тікелей ұлы ретінде көрінгеннен гөрі, өзінің шаруашылық саласын басқарады.",
  },
  {
    name: "Ысмайыл",
    relationNote:
      "Исмаил – Ибраһимнің ұлы. Олар бірге Қағбаның іргетасын көтерді. Құранда Ибраһимнің сабырлы ұл туралы сүйінші хабары мен құрбандық туралы баяндалады.",
  },
  {
    name: "Ысқақ",
    relationNote:
      "Исхақ – Ибраһимнің ұлы, Исмаилдан кейін берілген және әкесімен бірге жарылқаған.",
  },
  {
    name: "Лұт",
    relationNote:
      "Құран Лұтты Ибраһимнің көші мен миссиясымен тығыз байланыстырады, бірақ Лұтты Ибраһимнің ұлы деп атамайды. Классикалық тәпсірде оны Ибраһимнің жиені деп жиі атайды. Ол Ибрагимнің тармағында қазіргі серіктес ретінде пайда болады - ешқандай ата-аналық жақтар талап етілмейді.",
  },
  {
    name: "Яқуб (Исраил)",
    relationNote:
      "Жақып Исхақтың ұлы. Аллаһ Ибраһим, Исхақ және Яқуб ұрпақтарына пайғамбарлық пен Кітап берді.",
  },
  {
    name: "Жүсіп",
    relationNote:
      "Юсуф – Яқубтың ұлы. Жүсіп сүресі әкесімен және ағаларымен болған оқиғасын ұзақ баяндайды.",
  },
  {
    name: "Мұса",
    relationNote:
      "Мұса Исраил ұрпақтарынан. Құранда оның ағасы Һарун мен анасының атын атайды, бірақ бұл ағашта пайғамбар-ата-ананың жазылуын талап етпейді. Ол Мұса-Харун тармағының басшысы болып табылады.",
  },
  {
    name: "Һарун",
    relationNote:
      "Харун Мұсаның ағасы. Мұса Алладан Харунды отбасынан көмекші етіп тағайындауды сұрады. Олар әке мен бала ретінде емес, бауырластар сияқты бір тармақты бөліседі.",
  },
  {
    name: "Дәуіт",
    relationNote:
      "Дәуітке патшалық пен Зәбур берілді. Құран оның пайғамбарлығын және Сүлейменнің одан мұрагер болғанын растайды.",
  },
  {
    name: "Сүлеймен",
    relationNote: "Сүлеймен Дәуіттің ұлы және оның патшалығы мен пайғамбарлығын мұра етті.",
  },
  {
    name: "Зәкәрия",
    relationNote: "Зәкәрия мұрагер үшін дұға еткен пайғамбар болды. Аллаһ оған Яхьяны берді.",
  },
  {
    name: "Яхия",
    relationNote: "Яхья әкесінің дұғасына жауап ретінде берілген Зәкәрияның ұлы.",
  },
  {
    name: "Мариям",
    relationNote:
      "Имранның қызы Мәриям Құранда құрметке ие. Ол Исаның анасы және Исаның туғанында күйеуі болмаған, бұл Алланың белгісі.",
  },
  {
    name: "Иса",
    relationNote:
      "Иса – Мәриямның ұлы, Алланың «Бол» деген сөзімен жаратылған, әкесіз. Ата-анасы анасы Мәрияммен байланысты.",
  },
  {
    name: "Мұхаммед ﷺ",
    relationNote:
      "Пайғамбарымыз Мұхаммед ﷺ Ибраһим ұлы Исмаилдың ұрпағынан. Исмаил мен Құрайш арасындағы егжей-тегжейлі аталған ұрпақтар классикалық сирада сақталған; Құран әрбір ата-бабаны санамастан Ибраһимнің мұрасын растайды. Бұл жерде тікелей әке-бала шеті сызылмаған — тек мөрленген пайғамбарлық пен исмайлдық ұрпақ.",
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
