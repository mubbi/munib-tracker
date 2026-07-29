import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// ha overlay for janazah-guide. Index-aligned with JANAZAH_GUIDE_TOPICS in ../janazah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const JANAZAH_GUIDE_TOPICS_HA: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Wajibi na gamayya",
    summary: "Janazah fard kifayah ce - wajibi ne al'umma su cika ta.",
    body: [
      "Sallar Janazah farilla ce ta al’umma (fard kifayah): idan wasu daga cikin al’umma suka yi ta, sai a xauke ta daga sauran; idan babu wanda ya yi, duk sun raba laifin. Ana yin sallah a tsaye, ba tare da ruku'u ko sujuda ba - siffa ce ta musamman a cikin sallolin.",
      "An karbo daga Abu Huraira (RA) ya ce: Manzon Allah SAW ya ce: \"Duk wanda ya halarci jana'izar har sai an sallace shi yana da qira'a (ladan), wanda kuma ya halarci jana'izar yana da qira'i biyu.\" Sai aka tambaye shi menene qirat, sai ya ce: ‚Kamar manyan duwatsu guda biyu’ (Sahihul Bukhari 1325; Sahihu Muslim 945).",
      "Bayan jana'izar, taimakawa da wanka da binnewa gwargwadon ikonsa, da yin addu'a ga mamaci suna daga cikin haqqoqin musulmi akan wani. Kula da jiki da mutunci kuma ku guji almubazzaranci ko ayyuka ba tare da shaida ba.",
    ],
    actions: [
      "Amsa da sauri lokacin da aka sanar da jana'izar a cikin jama'ar ku.",
      "Ku Nufin Sallah da Halarta Don Allah, Ba Wajen Jama'a ba.",
      "Taimako tare da ayyuka masu amfani na iyali lokacin da za ku iya yin hakan cikin girmamawa.",
    ],
    hadith: [
      {
        excerpt:
          "Duk wanda ya halarci jana'izar har ya yi sallar gawa, yana da qirat xaya, kuma wanda ya halarci jana'izar, yana da qira'i biyu, kowanne kamar dutse mai girma.",
      },
      {
        excerpt:
          "Duk wanda ya bi jana'izar musulmi yana mai imani da neman lada, kuma ya tsaya har aka idar da sallah aka gama kabbara, zai dawo da qira'a biyu...",
      },
    ],
  },
  {
    title: "Wankewa da rufewa",
    summary: "Ghusl na mamaci da kafan mai sauƙi - mutunci ba tare da almubazzaranci ba.",
    body: [
      "Musulmin da suka mutu (ban da shahidan fagen fama a hukunce-hukuncen al’ada) ana wanke su da wankan tsarki, sannan a lullube su da farar kyalle mai tsafta. Ummu Atiyyah ta ruwaito cewa, Annabi (SAW) ya ce game da wanke ‘yarsa: “Ku wanke ta sau uku ko biyar, ko fiye idan kun ga dama, da ruwa da sidar, kuma ku sanya kafur — ko wani kafur — a karshen” (Sahihul Bukhari 1253).",
      "A'isha ta ruwaito cewa Manzon Allah SAW yana lullube da fararen tufafin audugar Yaman guda uku, daga cikinsu babu riga ko rawani (Sahihul Bukhari 1264; Sahih Muslim 941). Sauki shine sunnah; nuni masu tsada sun saba wa misalin annabci.",
      "Wanene Wanke Wa, Nawa Tufafi Na Nawa Na Maza Da Mata, Da Bayanin Da Yake Dance Da Shi Suna Da bambance-bambancen Mazhaba. Iyalai su bi ƙwararrun jagorar gida ko sabis na jana'izar da suka san aikin makaranta - wannan bayyani ba littafin jagora bane.",
    ],
    actions: [
      "Nada amintattun mutane masu jinsi daya da wanda ya rasu idan ya yiwu.",
      "Tsaftace labulen mai sauƙi da tsabta - farar zane shine samfurin annabci.",
      "Guji yin hoto ko fallasa jiki ba tare da buƙata ba.",
    ],
    hadith: [
      {
        excerpt:
          "Ka wanke ta sau uku, ko biyar, ko sama da haka, idan ka ga ya dace, da ruwa da sidr, a sa kafur ko kafur a wanken karshe.",
      },
      {
        excerpt:
          "An lullube Manzon Allah s.a.w da fararen tufafin audugar Yaman guda uku; Babu wata riga ko rawani a cikinsu.",
      },
    ],
  },
  {
    title: "Lokacin rufe idon mamaci",
    summary: "Addu'ar annabci a lokacin mutuwa.",
    body: [
      "Ummu Salamah ta ruwaito cewa Manzon Allah SAW ya zo wajen Abu Salamah a lokacin da idanunsa suka kafe. Ya rufe su ya ce: ‘Idan aka dauki rai, sai gani ya bi shi,’ sai mutanen gidansa suka yi kuka. Sai ya koyar da su da fadin alheri kawai, domin mala’iku suna cewa amin ga abin da suke fadi, kuma ya yi addu’a ga Abu Salamah (Sahih Muslim 920).",
      "Shigar Hisnul Muslim da aka haɗe a ƙasa yana adana kalmomin da ake amfani da su wajen rufe idanu. Ku yi magana a hankali, ku nisanci kukan da Annabi SAW ya hana, kuma ku shagaltu da harshe da kyawawan kalmomi da neman gafara.",
    ],
    actions: [
      "Rufe idanu a hankali da yin dua na kwarai.",
      "Tunatar da iyali su yi magana mai kyau.",
    ],
    hadith: [
      {
        excerpt:
          "Lokacin da idanun Abu Salamah suka lumshe, sai Manzon Allah SAW ya rufe su ya ce idan an dauki rai sai gani ya bi shi, sannan ya koya wa ’yan gida magana da alheri kawai.",
      },
    ],
  },
  {
    title: "Yadda ake sallar Janazah",
    summary: "Addu'a ta tsaya tare da takbirai guda hudu - babu ruku'u ko sujuda.",
    body: [
      "Ana yin Sallar Jana'iza a tsaye. Babu ruku, babu sujudi, babu adhan ko iqamah. Limamin yana tsaye ne a kan mamaci namiji ko kuma a tsakiyar mace mamaci kamar yadda aka ruwaito daga Anas da Samurah (duba Abu Dawud 3194 da ruwayoyi masu alaka da su), kuma jama’a suna yin layuka a baya.",
      "Sallah ta qunshi takbirai guda huxu. Bayan ta farko ana karanta suratul Fatiha (Bukhari 1335). Bayan takbirai, ana yin salati ga Annabi SAW da addu'o'i ga mamaci. Ana gama sallah da taslim. Jabir ya ruwaito cewa, Manzon Allah SAW ya yi wa Negus (Sarkin Abyssiniya) sallar jana'iza, ya kuma ce takbirai hudu (Sahihul Bukhari 1334).",
      "Marigayi da suka rasa takbir sai su bi liman su kammala abin da suka rasa kamar yadda dokar makarantarsu ta tanada don kamawa — su tambayi liman ko malamin gida idan ba su da tabbas.",
    ],
    actions: [
      "Tsaya a cikin layuka; kada ku yi ruku'u ko sujada.",
      "Kace takbirai hudu tare da liman.",
      "Yi addu'a ta gaskiya ga mamaci bayan takbir da ta dace.",
    ],
    hadith: [
      {
        excerpt: "Annabi SAW yayi Sallar Jana'izar Negus ya yi takbirai hudu.",
      },
      {
        excerpt: "Ibn Abbas yayi sallar jana'iza ya karanta fatiha yace daga sunnah ce.",
      },
    ],
  },
  {
    title: "Addu'o'i a Sallar jana'iza (babba)",
    summary: "Ingantattun lafazin Hisnul Muslim na mamaci.",
    body: [
      "Bayan Takbirai, Zuciyar Janazah tana addu'a ga mamaci- suna roqon Allah ya gafarta musu, ya jiqansu da rahama, ya basu Aljannah. An kiyaye lafuzza da dama ingantattu a cikin Hisnul Muslim daga Annabi SAW.",
      "Bude dua mai alaƙa da ke ƙasa don karantawa da Larabci, fassara, da ma'ana. Kuna iya koyan ingantattun kalmomi fiye da ɗaya; ikhlasi ya fi tsayi.",
    ],
    actions: [
      "Aqalla haddar Janazah dua guda daya.",
      "Yi addu'a ga dukkan musulmin da suka rasu idan kun halarta.",
    ],
  },
  {
    title: "Karin addu'o'in sallar jana'iza",
    summary: "Karin ingantattun kalmomi daga Hisnul Muslim.",
    body: [
      "Hisnul Muslim ya kiyaye karin lafuzzan sallar jana'izar da aka koyar daga Manzon Allah SAW. Yi amfani da su a juyawa ko koyi wanda al'ummar ku suka fi sani.",
      "Ga wanda ya rasu, addu'o'i na musamman na roqon Allah Ya sa yaron ya zama na gaba da lada ga iyaye - duba batu na gaba.",
    ],
  },
  {
    title: "Sallar Jana'iza dua #3",
    summary: "Wata ingantacciyar lafazin na babba da ya rasu.",
    body: [
      "Karin Maganar Hisnul Muslim na Sallar Jana'iza. Karanta ta bayan takbir da ta dace kamar yadda aikin liman ka ya halatta.",
    ],
  },
  {
    title: "Sallar Jana'iza dua #4",
    summary: "Lafazi na hudu ingantattu daga mahangar sunnah.",
    body: [
      "Hisnul Muslim ya hada da wannan karin addu'ar jana'iza. Zaɓi sahihanci da kasancewar zuciya akan tattara kowace kalma a lokaci ɗaya.",
    ],
  },
  {
    title: "Addu'a ga yaro da ya rasu",
    summary: "Addu'o'in annabci na musamman lokacin da mamacin yana yaro.",
    body: [
      "Idan mamaci yana yaro, addu’o’i na qwarai suna roqon Allah ya sanya yaro ya zama taskace, mafari, mai ceto ga iyaye. Shigowar Hisnul Muslim da ke ƙasa sun kiyaye waɗannan kalmomin.",
      "Ka Ta'azantar da iyali tare da fatan samun rahamar Allah tare da nisantar ƙirƙira ayyukan ibada. Haka tsarin Janazah na takbir hudu; abun cikin dua shine abin canzawa.",
    ],
    actions: [
      "Yi amfani da takamaiman addu'o'in yara idan ya dace.",
      "Tallafawa iyaye masu baqin ciki tare da halarta da taimakon halal.",
    ],
  },
  {
    title: "Child jana'izar dua #2",
    summary: "Lafazin Hisnul Muslim Na Biyu ga Yaro Marigayi.",
    body: [
      "Wani ingantaccen lafazin na sallar jana'izar yaro, wanda aka tanada a cikin Hisnul Muslim.",
    ],
  },
  {
    title: "Kabari da kabari",
    summary: "Rage jiki, fuskantar alqibla, da dua bayan binnewa.",
    body: [
      "An binne mamacin a cikin qasar da ke fuskantar alqibla, cikin mutunci ba tare da bata lokaci ba fiye da yadda ake buqatar shiri. Annabi SAW ya ce: \"Ku gaggauta jana'izar...\" (Sahihul Bukhari 1315 - Gaggauta Jana'iza).",
      "Lokacin sanya mamaci a cikin kabari, ana kiyaye addu'a ta qwarai a cikin Hisnul Muslim. Bayan an binne shi, Manzon Allah ﷺ yakan tsaya a bakin kabari yana cewa: ‘Ku nemi gafara ga dan’uwanku, kuma ku nemi a tabbatar masa da shi, domin yanzu ana tambayarsa’ (Sunan Abi Dawud 3221 — maluma da yawa daga baya suka inganta shi har da Albani).",
      "Gina ƙawancen gine-gine a kan kaburbura, yi musu ado don ado, ko rubuce-rubucen da ke ƙarfafa wuce gona da iri an gargaɗe su a cikin ingantattun rahotanni. Ci gaba da alamar sauƙaƙa inda doka da al'adar gida suka ba da izinin ganewa.",
    ],
    hadith: [
      {
        excerpt:
          "Ku gaggauta zuwa ga jana'izar. In kuwa ba haka ba, kuna kwance wuyoyinku da mugunta.",
      },
      {
        excerpt:
          "Ka nemi gafarar dan uwanka kuma ka nemi a tabbatar masa da haquri, domin yanzu ana tambayarsa.",
      },
    ],
  },
  {
    title: "Bayan binne mamacin",
    summary: "Addu'ar dauriya a kabari.",
    body: [
      "Tsayuwa kadan bayan an binne mamaci domin neman gafara da juriya ga mamaci ya tabbata daga Annabi SAW (Abu Dawud 3221). Maganar Hisnul Muslim a kasa ita ce bayan binnewa.",
      "Sadaqa, dua, da cika halaccin wasiyyar mamaci suna amfanar da su da iznin Allah – ba tare da qirqiro bukutun shekara-shekara da ba su da hujja.",
    ],
    actions: ["Yi dua a kabari bayan an binne shi.", "Acigaba da addu'a da sadaqah ga mamaci."],
  },
  {
    title: "Ziyarar kaburbura",
    summary: "Gaisuwar annabci lokacin ziyartar kaburbura.",
    body: [
      "Ziyarar kaburbura tana tunatar da rayuwar lahira. Buraidah ya ruwaito cewa, Manzon Allah SAW ya kasance yana karantar da su da cewa idan za su fita zuwa makabarta: gaisuwar aminci ga ma'abuta gidaje daga cikin muminai da musulmi, yana mai tabbatar da cewa za mu hadu da su, da yardar Allah, da neman lafiya a gare mu da su (Sahih Muslim 975; lafazin kuma a cikin Ibn Majah).",
      "Shigowar Hisnul Muslim dake kasa tana kiyaye waccan gaisuwa. Ka ci gaba da ziyarce-ziyarce ba tare da kuka ba, neman taimako daga matattu, ko al'ada ba tare da shaida ba.",
    ],
    actions: [
      "Ku gai da mazaunan kaburbura da ingantacciyar magana.",
      "Tunani akan mutuwa da sabunta ayyuka na qwarai.",
    ],
    hadith: [
      {
        excerpt:
          "Assalamu Alaikum Ya Ma'abuta Gidajen Muminai Da Musulmai. Za mu - in Allah Ya yarda - tare da ku. Muna rokon Allah ya jikan mu da ku.",
      },
    ],
  },
  {
    title: "Tunatarwa da kurakurai na gama gari",
    summary: "Guji makoki, jinkirin nunawa, da al'adu marasa tushe.",
    body: [
      "Annabi ﷺ ya hana yin kuka ga matattu alhalin yana barin bakin ciki mai hawaye. Abdullahi bn Umar ya ruwaito cewa Sa’ad bn Ubadah ya yi kuka a wajen jana’iza, kuma Annabi (SAW) ya yi bayanin cewa Allah ba ya azabtar da hawayen ido ko baqin cikin zuciya, sai don haka – sai ya yi nuni da harshensa (Sahihul Bukhari 1304).",
      "Kada ku jinkirta jana'iza don tarurruka masu daraja, kuma kada ku ciyar da kayan ado da liyafa tare da sakaci ga matalauta. Kar a karanta ko aiwatar da sabbin abubuwa da aka danganta ga jana'iza ba tare da ingantaccen tushe ba. Ta'aziyya, natsuwa da addu'a, da taimako na zahiri ga iyali su ne tafarkin sunna.",
      "Halartar mata wajen sallah da jana’iza ba ta da kyau a makarantu da zamani; bi amintaccen jagorar gida wanda ke mutunta tausayi da iyakoki na annabci.",
    ],
    disclaimer:
      "Bayanin ilimi - ba littafin jagorar jana'izar ko fatawa ba. Dole ne a tabbatar da aikin makarantar gida na wanki, sutura, da dokokin makabarta tare da ƙwararrun mutane.",
    actions: [
      "Yi baƙin ciki ba tare da kuka ko magana da aka haramta ba.",
      "Gaggauta jana'iza mai daraja.",
      "Taimakawa iyali da abinci da al'amura ba tare da sanya musu almubazzaranci ba.",
    ],
    hadith: [
      {
        excerpt:
          "Allah ba ya azabtar da ganin yagewar ido ko baqin cikin zuciya, sai dai yana azabtarwa ko ya nuna jinqai akan haka - sai ya nuna harshensa.",
      },
    ],
  },
];
