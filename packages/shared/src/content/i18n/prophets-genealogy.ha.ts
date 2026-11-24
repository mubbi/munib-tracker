import type { ProphetsGenealogyNode } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// ha overlay for prophets-genealogy. Index-aligned with PROPHETS_GENEALOGY_NODES in ../prophets-genealogy.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const PROPHETS_GENEALOGY_NODES_HA: DeepPartial<ProphetsGenealogyNode>[] = [
  {
    name: "Adam",
    relationNote:
      "Allah ya halicci Adamu da hannunsa ya hore masa suna. Shi ne uban bil'adama - ba iyaye na mutum ba.",
  },
  {
    name: "Nuhu",
    relationNote:
      "Kur’ani ya kafa Nuhu a matsayin manzo bayan zuriyar Adamu sun bazu a doron kasa, amma bai ambaci sunayen ubanni na tsakiya tsakanin Adamu da Nuhu ba. Ya bayyana kusa da Adamu a wannan reshe a matsayin magajin kakanni a tarihin annabci - ba kamar ɗan Adamu ba.",
  },
  {
    name: "Ibrahim",
    relationNote:
      "Ibrahim yana cikin zuriyar Nuhu a tarihin annabci na Kur'ani. Alkur'ani bai lissafta kowace tsara a tsakaninsu ba; yana shugabantar reshen gidansa maimakon ya bayyana a matsayin ɗan Nuhu.",
  },
  {
    name: "Ismail",
    relationNote:
      "Ismail dan Ibrahim ne. Tare suka daga harsashin Ka'aba. Alkur'ani ya ba da labarin busharar Ibrahim na da mai hakuri da labarin sadaukarwa.",
  },
  {
    name: "Ishaq",
    relationNote:
      "Ishaq ɗan Ibrahim ne, wanda aka yi wa bayan Isma'il, kuma ya yi albarka tare da mahaifinsa.",
  },
  {
    name: "Lutu",
    relationNote:
      "Kur'ani ya danganta Luɗu da hijira da manzancin Ibrahim amma bai ambaci Luɗu da ɗan Ibrahim ba. Tafsirin gargajiya yakan kira shi yayan Ibrahim. Ya bayyana a reshen Ibrahim a matsayin abokin tarayya na zamani - ba a da'awar iyaye.",
  },
  {
    name: "Yaqub (Isra'ila)",
    relationNote:
      "Yaqub dan Ishaq ne. Allah ya sanya Annabci da Littafi a cikin zuriyar Ibrahim da Ishaq da Yaqub.",
  },
  {
    name: "Yusuf",
    relationNote:
      "Yusuf ɗan Yaqub ne. Suratul Yusuf ya ba da labarinsa da mahaifinsa da ’yan’uwansa mai tsawo.",
  },
  {
    name: "Musa",
    relationNote:
      "Musa daga Bani Isra'ila ne. Kur'ani ya ambaci sunan ɗan'uwansa Haruna da mahaifiyarsa, amma ba ya buƙatar lissafta wani annabi-iyaye akan wannan bishiyar. Ya tsaya a matsayin shugaban reshen Musa–Harun.",
  },
  {
    name: "Haruna",
    relationNote:
      "Haruna kanin Musa ne. Musa ya roki Allah ya nada Haruna a matsayin mai taimakon iyalansa. Suna raba reshe a matsayin 'yan'uwa - ba kamar uba da ɗa ba.",
  },
  {
    name: "Dawuda",
    relationNote:
      "Aka Ba Dawud sarauta da Zabur. Alkur'ani ya tabbatar da Annabcinsa da kuma cewa Sulaiman ya gada daga gare shi.",
  },
  {
    name: "Sulaiman",
    relationNote: "Sulaiman ɗan Dawud ne kuma ya gaji mulkinsa da Annabcinsa.",
  },
  {
    name: "Zakariyya",
    relationNote: "Zakariyya Annabi ne mai addu'a ga magaji. Allah ya ba shi Yahaya.",
  },
  {
    name: "Yahya",
    relationNote: "Yahya dan Zakariyya ne, aka bashi amsa addu'ar mahaifinsa.",
  },
  {
    name: "Maryam",
    relationNote:
      "Maryam 'yar Imrana ta samu daraja a cikin Alqur'ani. Ita ce mahaifiyar Isa, kuma ba ta da miji a cikin haihuwar Isa, aya ce daga wurin Allah.",
  },
  {
    name: "Isa",
    relationNote:
      "Isa dan Maryama ne, da kalmar Allah ‘Kas’ halitta, ba tare da uba na mutum ba. Iyayen haɗin kai shine mahaifiyarsa Maryam.",
  },
  {
    name: "Muhammad ﷺ",
    relationNote:
      "Annabi Muhammad SAW daga zuriyar Isma'il dan Ibrahim ne. Cikakken sunayen tsararraki tsakanin Ismail da Kuraishawa an adana su cikin sirah na gargajiya; Kur'ani ya tabbatar da gadon Ibrahim ba tare da lissafta kowane kakanni ba. Babu wani gefen uba-da da aka zana a nan - kawai annabci da aka hatimce da zuriyar Isma'il.",
  },
  // —— v2 appends ——
  {
    name: "Shitu (Sheeth)",
    relationNote:
      "Al'adar Musulunci ta gargajiya (da taƙaitaccen nasabar annabawa da dama da aka saba da shi) ta ambaci Shitu a matsayin ɗan Adamu kuma mahaɗi a cikin tsararrakin farko. Sunayen tsakanin Shitu da Nuhu galibi Isra'iliyyat ne kuma ba a zana su a matsayin tabbatattun alaƙa ba.",
  },
  {
    name: "Idris",
    relationNote:
      "Alkur'ani ya ambaci Idris a matsayin annabi mai gaskiya da aka ɗaukaka zuwa matsayi maɗaukaki. Jerin sunaye na gargajiya galibi suna sanya shi tsakanin Adamu da Nuhu (wani lokaci ana danganta shi da Enoch), amma Alkur'ani bai ambaci sunan mahaifinsa ba — ba a zana alaƙar mahaifi ba.",
  },
  {
    name: "Imrana",
    relationNote:
      "Allah Ya zaɓi iyalan Imrana a kan talikai. Maryam 'yar Imrana ce. (Wannan Imrana shi ne mahaifin Maryam — ba a yi amfani da shi a nan a matsayin alaƙar uba ga Musa/Haruna ba.)",
  },
  {
    name: "Adnan",
    relationNote:
      "Al'adar Musulunci tana riƙe da cewa Muhammadu ﷺ ya fito daga zuriyar Adnan, kuma Adnan ya fito daga zuriyar Isma'il — amma al'adar nasabar Larabawa ta yarda cewa an rasa sunayen jerin nasaba daga Adnan zuwa Isma'il. Adnan shi ne shugaban Larabawan Adnaniyya da aka yarda da shi a al'adar gargajiya; ba a zana alaƙar mahaifi zuwa Isma'il ba.",
  },
  {
    name: "Hashim ɗan Abdu Manaf",
    relationNote:
      "Hashim shi ne wanda aka sanya wa Banu Hashim sunansa kuma kakan Annabi ﷺ a al'adar gargajiya. Cikakken jerin shugabanni daga Adnan zuwa Hashim (Fihr, Mudar, …) an rubuta shi a cikin sira amma an tsallake shi a nan a matsayin tsararrakin ƙabila na tsakiya — ba annabawa ba. Hashim ne a kan gaba a layin Hashimawa na kusa a wannan taswira.",
  },
  {
    name: "Abdulmuɗɗalib",
    relationNote:
      "Abdulmuɗɗalib (Shaiba) shi ne kakan Annabi ﷺ na wajen uba kuma ɗan Hashim a cikin sira ta gargajiya.",
  },
  {
    name: "Abdullahi ɗan Abdulmuɗɗalib",
    relationNote:
      "Abdullahi shi ne mahaifin Annabi Muhammadu ﷺ kuma ɗan Abdulmuɗɗalib a cikin sira ta gargajiya.",
  },
];
