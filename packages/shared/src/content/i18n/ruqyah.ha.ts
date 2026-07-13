import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Hausa translation overlay for the Learn ruqyah guide. Mirrors the order of
// RUQYAH_TOPICS in ../ruqyah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const RUQYAH_TOPICS_HA: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Menene ruqyah?",
    summary: "Karanta Al-Kur'ani, Sunayen Allah, ko addu'o'in annabci don warkarwa.",
    body: [
      "Ruqyah shine al'adar karanta Al-Kur'ani, Sunaye da Halayen Allah, ko addu'o'in annabci na gaskiya a kan kanka ko wani mutum — sau da yawa tare da shaƙar iska mai laushi — neman warkarwa ko kariya daga Allah kaɗai. Ya wanzu tun kafin Musulunci a matsayin al'adar Larabawa ta gaba ɗaya, kuma an tambayi Annabi ﷺ kai tsaye ko yana halatta.",
      "Auf ɗan Malik ya ruwaito cewa sahabbai suka ce: 'Mun kasance muna yin ruqyah a zamanin jahiliyya; me kake gani a kai?' Annabi ﷺ ya amsa: 'Ku nuna mini ruqyah dinku — babu wata illa a ruqyah muddin ba ta ɗauke da shirka' (Sahih Muslim 2200). Wannan hadisi guda ɗaya ne tushen duk sauran abin da ke cikin wannan jagora: ruqyah da kanta halal ne; abin da yake da muhimmanci shine abin da take ɗauke da shi.",
    ],
    hadith: [
      {
        excerpt:
          "Mun kasance muna yin ruqyah a zamanin jahiliyya, kuma muka ce: Ya Manzon Allah, me kake gani a kai? Ya ce: Ku nuna mini ruqyah dinku — babu wata illa a ruqyah muddin ba ta ɗauke da shirka.",
      },
    ],
  },
  {
    title: "Ruqyah halal da haramun",
    summary: "Al-Kur'ani, Sunayen Allah, da addu'a bayyananna — ba shirka ko boyayyen abu ba.",
    body: [
      "Ruqyah halal ta dogara ne akan sharuɗɗan da malamai suka fitar daga hadisi: tana amfani da Al-Kur'ani, Sunaye da Halayen Allah, ko addu'a annabci na gaskiya; tana cikin harshen da ma'anarsa a fahimta (ba kalmomi ko alamomi da ba a sani ba); kuma mai karatu da mai karɓar magani duk suna gaskata cewa ruqyah da kanta ba ta da wani ƙarfi — warkarwa daga Allah kaɗai ne, kalmomin kuma hanya ce kawai da Ya yarda da ita.",
      "Annabi ﷺ da kansa ya nuna wannan: Aisha ta ruwaito cewa duk lokacin da ya yi rashin lafiya, yakan karanta Al-Mu'awwidhaat (surori biyu na ƙarshe) a kansa kuma ya shaƙa, kuma lokacin da rashin lafiyar sa ta ƙarshe ta yi tsanani, ta yi hakan a gareshi, tana shafa jikinsa da hannunta don neman albarkarsa (Bukhari 5016). Wannan ita ce ruqyah a mafi bayyananniyar, mafi gaskiyar sifarta.",
      "Ruqyah ta zama haramun idan ta shiga cikin shirka: kiran wani ba Allah ba, neman taimako daga aljanu, amfani da kalmomi ko alamomi da ba a sani ba wanda ma'anarsu ba a bayyane ba, rataya rubutu ko sammu, ko da'awar cewa mai yin ruqyah yana da saninsanin boyayyen abu ko warkarwa tabbatacce. Har ila yau ba ta taɓa maye gurbin sallolin yau da kullum biyar ko neman magani na dace ba — tana cika biyun ne maimakon maye gurbin kowanne.",
    ],
    hadith: [
      {
        excerpt:
          "Duk lokacin da Manzon Allah ﷺ ya yi rashin lafiya, yakan karanta Al-Mu'awwidhaat sa'an nan ya shaƙa jikinsa. Lokacin da ya yi rashin lafiya mai tsanani, nakan karanta su kuma na shafa jikinsa da hannunsa, don neman albarkarsa.",
      },
    ],
    disclaimer:
      "Ruqyah al'ada ce ta ruhi, ba magani na likita ba. Ba ta maye gurbin ganin likita mai cancanta don cutar jiki ko ta hankali ba, kuma ba ta maye gurbin sallolin yau da kullum biyar ba.",
  },
  {
    title: "Suratul Fatiha a matsayin ruqyah",
    summary: "Surar buɗewa — an tabbatar a fili a matsayin ruqyah mai inganci.",
    body: [
      "Abu Sa'idu al-Khudri ya ruwaito cewa lokacin da maciji ya sari shugaban kabila, wani sahabin Annabi ﷺ ya karanta Suratul Fatiha a kansa kuma ya warke. Lokacin da sahabbai daga baya suka tambayi Annabi ﷺ ko wannan halal ne, ya yi murmushi ya ce: 'Ta yaya ka sani cewa wannan ruqyah ne?' — yana tabbatar da cewa al-Fatiha, idan an karanta ta da gaskiyar imani da fahimta, kanta ruqyah ce mai inganci (Bukhari 5736).",
      "Mai karanta Al-Kur'ani na wannan app yana ɗauke da cikakken rubutu da fassarar al-Fatiha; wannan jagora kawai yana nuna ta a matsayin tushen ruqyah ba tare da sake bugawa a nan ba.",
    ],
    quran: [{ excerpt: "Da sunan Allah Mai Rahama, Mai Jin Ƙai..." }],
    hadith: [
      {
        excerpt:
          "Wani daga cikinsu ya fara karanta Suratul Fatiha... majinyacin ya warke. Lokacin da suka tambayi Annabi ﷺ, ya yi murmushi ya ce: Ta yaya ka sani cewa al-Fatiha ruqyah ne?",
      },
    ],
    appLinks: [{ label: "Karanta Al-Fatiha" }],
  },
  {
    title: "Ayatul Kursi (2:255)",
    summary: "Ayar Kursi — ana karanta ta da dare don kariyar Allah.",
    body: [
      "Ayatul Kursi (Al-Kur'ani 2:255) tana bayyana ikon Allah gaba ɗaya kuma ana karanta ta sosai don kariya, musamman kafin barci. Abu Hurairah ya ruwaito cewa wani baƙo na dare wanda yake satar zakka da yake tsaro ya ce masa: 'Duk lokacin da ka je gadonka, ka karanta Ayatul Kursi — mai tsaro daga Allah zai zauna tare da kai, kuma babu wani shaidan da zai kusance ka har asuba.' Lokacin da Annabi ﷺ ya ji wannan, ya tabbatar: 'Ya faɗa maka gaskiya, ko da yake shi maƙaryaci ne — wannan shaidan ne' (Bukhari 5010).",
      "Kamar sauran ayoyi a cikin wannan jagora, kawai an bayar da wani ɗan gajeren nakalto a nan; ka karanta cikakken aya da fassararta a cikin mai karanta Al-Kur'ani na app.",
    ],
    quran: [
      { excerpt: "Allah — babu wani abin bautawa sai Shi, Rayayye Har Abada, Mai riƙe da rayuwa." },
    ],
    hadith: [
      {
        excerpt:
          "Duk lokacin da za ka je gadonka, ka karanta Ayatul Kursi — mai tsaro daga Allah zai kare ka duk dare, kuma babu wani shaidan da zai kusance ka har asuba.",
      },
    ],
    appLinks: [{ label: "Karanta Ayatul Kursi" }],
  },
  {
    title: "Al-Ikhlas, Al-Falaq & An-Nas (112–114)",
    summary: "Surori uku na ƙarshe — ruqyar dare ta Annabi ﷺ.",
    body: [
      "Aisha ta bayyana tsarin dare na Annabi ﷺ: kowace dare kafin barci yakan haɗa tafin hannuwansa, ya karanta Suratul Ikhlas, Suratul Falaq, da Suratul Nas, ya shaƙa a cikin tafin hannuwansa, kuma ya shafa su a jikinsa — yana farawa daga kansa da fuskarsa — yana maimaita wannan sau uku (Bukhari 5017). Waɗannan surori uku ɗaya ne (Al-Ikhlas tana tabbatar da haɗin kai na Allah, kuma Al-Mu'awwidhaat biyu suna neman kariya daga mugunta) su ne kuma abin da yakan karanta a kansa a lokacin rashin lafiya (Bukhari 5016).",
      "Tare, sun ƙirƙiri wani tsarin ruqyah na yau da kullum mafi sauƙi, mafi tabbaci da ake da su — gajarta isasshe don haddace, kuma an tabbatar kai tsaye a cikin Sunnah.",
    ],
    quran: [
      { excerpt: "Ka ce: Shi ne Allah, Guda ɗaya." },
      { excerpt: "Ka ce: Ina neman kariya ga Ubangijin safiya." },
      { excerpt: "Ka ce: Ina neman kariya ga Ubangijin mutane." },
    ],
    hadith: [
      {
        excerpt:
          "Duk lokacin da Annabi ﷺ ya je barci, yakan haɗa tafin hannuwansa kuma ya shaƙa a cikinsu bayan karanta Suratul Ikhlas, al-Falaq da an-Nas, sa'an nan ya shafa hannuwansa a sassan jikinsa da zai iya kaiwa, yana farawa daga kansa da fuskarsa. Yakan yi hakan sau uku.",
      },
    ],
    actions: [
      "Ka haddace Al-Ikhlas, Al-Falaq, da An-Nas.",
      "Ka karanta su kowace dare kafin barci, kamar yadda Annabi ﷺ ya yi.",
    ],
    appLinks: [{ label: "Karanta surori uku" }],
  },
  {
    title: "Kariya ta yau da kullum: azkarul safe da yamma",
    summary: "Nau'in ruqyah mai ɗorewa, na yau da kullum don kariya.",
    body: [
      "Fiye da ruqyah don wata cuta ta musamman, Annabi ﷺ ya koyar da wani tsari na azkarul safe da yamma waɗanda ke aiki a matsayin kariya ta ruhi mai ɗorewa — da yawa daga cikinsu ayoyi ɗaya ne da aka tattauna a cikin wannan jagora (Ayatul Kursi, surori uku na ƙarshe) tare da wasu addu'o'i na gaskiya. Karanta su ba tsayawa, maimakon juyawa zuwa ruqyah kawai lokacin da wani abu yake ji ba daidai ba, shine hanyar Sunnah ta neman kariyar Allah kowace rana.",
      "Ɗakin karatun azkar na wannan app yana ɗauke da tattarawar cikakke, mai tushe na azkarul safe da yamma a wuri ɗaya, a shirye don karatu ko bin diddigi na yau da kullum.",
    ],
    actions: [
      "Ka karanta azkarul safe bayan Alfijir.",
      "Ka karanta azkarul yamma kafin Magariba/faɗuwar rana.",
    ],
    appLinks: [{ label: "Azkarul safe da yamma" }],
  },
  {
    title: "Ka guji masu duba da masu ganin gaibi",
    summary: "Neman abu boyayye daga wani ba Allah ba babbar gargaɗi ne.",
    body: [
      "Musulunci yana zana layi mai ƙarfi tsakanin ruqyah mai gaskiya da tuntuɓar masu duba, masu ganin gaibi, masana taurari, ko duk wanda yake da'awar sanin boyayyen abu (gaibi) ko kau da wahalar ruhi ta hanyoyi ba na Musulunci ba. Annabi ﷺ ya yi gargaɗi: 'Duk wanda ya ziyarci mai duba (arraf) ya tambaye shi wani abu, sallarsa ba za a karɓa ba har kwanaki arba'in' (Sahih Muslim 2230) — gargaɗi mai tsanani ko da don gwada irin waɗannan da'awa saboda sha'awa.",
      "Idan mutum kuma ya gaskata da'awar mai duba game da boyayyen abu, malamai suna ɗaukar wannan a matsayin al'amarin kafirci, domin Allah kaɗai ne yake da saninsanin boyayyen abu (Al-Kur'ani 27:65). Duk wace wahala da take kai mutum ga tunanin irin wannan mutum, amsa daidai bisa ga koyarwar wannan jagora koyaushe shine dawowa zuwa ruqyah mai gaskiya, addu'a, da taimako na likita ko na ilimi amintacce — ba wanda ya taɓa juyawa zuwa waɗanda suke da'awar saninsanin ɓoye ba.",
    ],
    hadith: [
      {
        excerpt:
          "Duk wanda ya ziyarci mai duba (arraf) ya tambaye shi wani abu, sallarsa ba za a karɓa ba har kwanaki arba'in.",
      },
    ],
    actions: [
      "Kada ka taɓa tuntuɓar masu duba, masana taurari, ko waɗanda suke da'awar saninsanin boyayyen abu.",
    ],
  },
  {
    title: "Tawakkul — dogaro da Allah kaɗai",
    summary: "Ruqyah hanya ce; warkarwa da sakamako na Allah ne.",
    body: [
      "Tunatarwar ƙarshe kuma mafi muhimmanci a cikin wannan jagora ita ce tawakkul: dogaro na gaskiya ga Allah yayin amfani da hanyoyin halal da Ya bayar. Karanta ruqyah, neman kula ta likita, da neman wasu su yi addu'a saboda kai duk hanyoyi ne halal — amma amincewar zuciya dole ta kasance ga Allah kaɗai, ba ga kalmomin da ake karantawa ko mutumin da yake karanta su ba. Wannan yana nuna daidai sharaɗin da yake cikin hadisin farko na wannan jagora: 'Babu wata illa a ruqyah muddin ba ta ɗauke da shirka' (Sahih Muslim 2200).",
      "Wannan jagora da gangan ya bar 'tsare-tsare' na jama'a da jerin alamun da suke yaɗuwa a intanet — babu ɗayansu da yake da tushe mai ƙarfi a cikin Al-Kur'ani ko Sunnah mai gaskiya, kuma dogaro da su na iya a hankali sauya amincewar mutum daga Allah zuwa wani biki ko jerin zato. Ka riƙe abin da ke da tushen rubutu, ka kuma bar sauran ga hukuncin Allah.",
    ],
    hadith: [{ excerpt: "Babu wata illa a ruqyah muddin ba ta ɗauke da shirka." }],
    disclaimer:
      "Wannan taƙaitaccen abun ilimi ne wanda yake taƙaita koyarwar Sunni ta gama gari daga Al-Kur'ani da hadisi mai gaskiya. Ba fatawa ba ne, kuma ba magani na likita ko na tunani ba ne. Don wahala mai tsanani ko mai ɗorewa, ka tuntuɓi malamin gida mai cancanta da kwararren likita da suka dace.",
  },
];
