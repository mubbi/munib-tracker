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
  // --- v2 appended topics (keep index-aligned with English) ---
  {
    title: "Takbir bayan takbir — matakan sallah",
    summary: "Jerin aiki na takbirai hudu da abin da ke tsakaninsu.",
    body: [
      "Takbir na farko: ɗaga hannaye (bisa makarantarka), ka ce Allahu Akbar, sa'an nan ka karanta Surat al-Fatihah. Ibn Abbas ya karanta al-Fatihah a sallar jana'iza ya ce daga sunnah ce (Sahih al-Bukhari 1335).",
      "Takbir na biyu: aika salawat ga Annabi ﷺ — irin salawat Ibrahimiyya da ake amfani da ita a tashahhud an koyar da ita sosai a wannan mataki. Takbir na uku: yi addu'a ta gaskiya ga mamaci (lafuzzan Hisnul Muslim a cikin wannan jagora). Takbir na hudu: malami da yawa sai su yi ɗan gajeren addu'a na gama-gari, sa'an nan a kare da taslim zuwa dama (da hagu, bisa makaranta).",
      "Babu ruku'u, sujuda, ko zama. Ka tsaya duka. Idan jana'izori da yawa suna nan, sallar Janazah ɗaya da niyya ga duka ana yi a al'ummomi da yawa — ka bi liman. Matsayin salawat da dua na iya ɗan canzawa bisa madhhab; tsarin takbirai hudu na gama gari ne.",
    ],
    madhhabNote:
      "Littattafan Hanafi, Maliki, Shafi'i, da Hanbali sun bambanta kan ko a ɗaga hannaye a kowace takbir da ainihin lokacin da ake yin dua. Ka bi liman da ke gabanka.",
    actions: [
      "Koyi jerin takbirai hudu kafin ka buƙace shi.",
      "Haddace Fatihah, salawat, da aƙalla addu'ar jana'iza ɗaya.",
    ],
    hadith: [
      {
        excerpt: "Ibn Abbas ya yi sallar jana'iza ya karanta Fatihah, yana cewa daga sunnah ce.",
      },
    ],
  },
  {
    title: "Addu'o'i ga maza, mata, da yara",
    summary: "Iri ɗaya na lafuzzan annabci — daidaita karin magana na Larabci ga mamaci.",
    body: [
      "Hisnul Muslim (da littafan hadisi na gargajiya) suna rubuta addu'o'in Janazah galibi a siffar namiji. Wannan ba yana nufin wata 'ƙirƙirar' addu'a ta mata ba. Malaman jama'a suna koyar da cewa za ka iya riƙe lafuzzan namiji da niyya ga mutumin, ko — wanda ya fi dacewa kuma ya zama gama gari — canza nahawu ya dace da mamaci: لَهُ / هُ / هِ → لَهَا / هَا؛ عَبْدُكَ → أَمَتُكَ؛ ابْنُ أَمَتِكَ → ابْنَةُ أَمَتِكَ؛ kuma ga yarinya اجْعَلْهُ → اجْعَلْهَا، شَفِيعًا مُجَابًا → شَفِيعَةً مُجَابَةً.",
      "Ga mace da ta rasu, wasu malamai suna ba da shawarar kulawa da jumlar 'mijin da ya fi mijinta' (زَوْجًا خَيْرًا مِنْ زَوْجِهَا), suna lura cewa za a iya haɗa ta da mijinta a Aljannah — za ka iya barin wannan jumla ko riƙe lafazin gama gari. Ga yara, yi amfani da shigarwar Hisnul na yara (hisn-160, hisn-161) maimakon rubutun manya da ke mai da hankali ga gafara kawai.",
      "Lafazin jama'a 'ka gafarta wa mazanmu da matanmu' (hisn-157) ya riga ya ƙunshi jinsi biyu ba tare da canji ba. Ba mu ƙirƙira sabon Larabci ba sai daidaita nahawu na matani sahihai — buɗe addu'ar babba da aka haɗa a matsayin tushe ka yi amfani da taswirar karin magana a sama.",
    ],
    madhhabNote:
      "Riƙe siffofin namiji da niyya da kuma daidaita siffofin mace duk an yarda da su tsakanin malaman jama'a. Idan ba ka da tabbas, yi amfani da hisn-157 (maza da mata) ko tambayi liman.",
    actions: [
      "Yi atisaye na musayar karin magana na mace a addu'ar da ka haddace.",
      "Yi amfani da addu'o'in yara ga waɗanda ba su kai balaga ba.",
      "Fi son sahihanci fiye da ƙasidu dogon da ba a tabbatar da su ba.",
    ],
    appLinks: [{ label: "Addu'ar jana'iza ta babba #1" }],
  },
  {
    title: "Shahidai, zubar da ciki, da yanayi na musamman",
    summary: "Lokacin da hukuncin wanki ko Janazah ya bambanta da yanayi na yau da kullum.",
    body: [
      "Shahidan fagen fama da suka mutu a yaƙi, a hukuncin gargajiya daga Uhud, ana binne su cikin tufafinsu ba tare da ghusl na yau da kullum ba; Annabi ﷺ ya umarci a binne shahidan Uhud da jininsu ba tare da wanka ba (Sahih al-Bukhari 1346). Wasu rukuni da ake kira 'shahidai' a lada (misali annoba, nutsewa) galibi ana wanke su da yin Janazah — tambayi malami a yanayi na gefe.",
      "Ga zubar da ciki ko haihuwar gawa, makarantu sun bambanta kan lokacin da sallar jana'iza da cikakken wanka ke aiki (galibi an danganta da ko an samu siffa da ake gane ko matakin hura rai). Hadisi yana ƙarfafa yin sallah a kan zubar da ciki da neman gafara da rahama ga iyaye (Abu Dawud 3180). Ka bi kwamitin jana'izar madhhab ɗinka maimakon ƙiyasta.",
      "Dangin da ba Musulmi ba ba a yi musu sallar Janazah ta Musulmi ba; alheri, taimakon binne na halal inda ya dace, da baƙin ciki na mutum sun bambanta da sallar ibada ga muminai. Koyaushe ka tabbatar da yanayi na musamman da jagora na gida da ta cancanta.",
    ],
    madhhabNote:
      "Ma'anar shahadan fagen fama, matakan zubar da ciki, da sallah a kan haihuwar gawa sun bambanta bisa makaranta. Wannan batu yana nuna batutuwa — ba fatwa ba ne.",
    disclaimer:
      "Hukunce-hukunce na musamman suna da hankali. Ka tabbatar da malami da ya cancanta ko sabis ɗin jana'izar al'ummarka kafin ka yi aiki.",
    actions: [
      "Kada ka wanke shahidan fagen fama sabanin umarnin malami.",
      "Tambayi kwamitin jana'iza game da yanayin zubar da ciki ko haihuwar gawa.",
    ],
    hadith: [
      {
        excerpt: "Annabi ﷺ ya umarci a binne shahidan Uhud da jininsu, kuma ba a wanke su ba.",
      },
      {
        excerpt:
          "Ana yin sallar jana'iza a kan zubar da ciki, kuma ana yin addu'a ga iyaye da gafara da rahama.",
      },
    ],
  },
  {
    title: "Janazah a rashin gawa",
    summary: "Annabi ﷺ ya yi sallah ga Negus lokacin da jikin ya yi nisa.",
    body: [
      "Jabir ya ruwaito cewa Annabi ﷺ ya fito zuwa ga Sahabbansa, ya jera su, ya yi takbirai hudu ga Negus (al-Najashi), sarkin Habasha da ya mutu a waje (Sahih al-Bukhari 1334; Sahih Muslim 952). Wannan shi ne babban hujja ga Salat al-Janazah a rashin gawa (alā al-ghā'ib).",
      "Makarantu sun bambanta kan yadda ake faɗaɗa wannan misali: wasu suna iyakance shi ga yanayi irin na Negus (babu sallar Musulmi ta gida), wasu suna yarda da shi fiye idan jikin ya yi nisa. Kada ka bar Janazah ta gida lokacin da gawa take nan kuma al'umma za ta iya yin sallah. Ka bi malamin gida da aka amince da shi kan lokacin da sallah a rashin gawa ta dace a makarantarka.",
      "Siffar ita ce sallar takbirai hudu iri ɗaya; niyya ga mamacin da ba ya nan. Yi amfani da addu'o'i sahihai iri ɗaya, daidaita jinsi idan an buƙata.",
    ],
    madhhabNote:
      "Fadin Janazah a rashin gawa wani sanannen bambanci ne. Fi son aikin limamai da suka cancanta a al'ummarka.",
    actions: [
      "Yi sallah a gida duk lokacin da gawa take nan.",
      "Tambaya kafin ka shirya Janazah a rashin gawa a matsayin taron jama'a.",
    ],
    hadith: [
      {
        excerpt: "Annabi ﷺ ya yi sallar jana'iza ga Negus ya ce takbirai hudu.",
      },
      {
        excerpt: "Manzon Allah ﷺ ya jera Sahabbai ya yi sallah ga Negus, yana cewa takbirai hudu.",
      },
    ],
  },
  {
    title: "A gefen mutuwa — kalmomin ƙarshe",
    summary: "Tunatar da mai mutuwa ya ce la ilaha illallah cikin tausayi.",
    body: [
      "Annabi ﷺ ya ce: 'Ku tunatar da matattunku su ce la ilaha illallah' (Sahih Muslim 916; Abu Dawud 3117). Hisnul Muslim ya kiyaye umarnin cewa wanda kalmominsa na ƙarshe suka zama 'Babu wanda ya cancanta a bauta masa sai Allah' zai shiga Aljannah (hisn-153, daga Abu Dawud 3116).",
      "Tunatar da tausayi ba tare da tsanani ba; kada ka tilasta ko jayayya. Wadanda ke kusa da mutuwa kuma ana iya ta'aziyyarsu da kalmomin bege sahihai da aka kiyaye a Hisnul Muslim (hisn-150–152). Rufe idanu lokacin da aka ɗauki rai ka yi amfani da addu'ar rufe idanu (batun da ya gabata).",
      "Guji kuka mai ƙarfi da magana da ke fusatar da Allah. Iyalin gida su faɗi abin da yake da kyau, domin mala'iku suna cewa amin ga kalmominsu (Sahih Muslim 920).",
    ],
    actions: [
      "A hankali ka tunatar da mai mutuwa da shahadah.",
      "Ka sa ɗakin ya yi natsuwa kuma ya shagala da magana mai kyau.",
    ],
    hadith: [
      {
        excerpt: "Ku tunatar da matattunku su ce: la ilaha illallah.",
      },
      {
        excerpt:
          "Wanda kalmominsa na ƙarshe suka zama 'Babu wanda ya cancanta a bauta masa sai Allah' zai shiga Aljannah.",
      },
    ],
    appLinks: [{ label: "Addu'o'in bege na rai" }, { label: "Rufe idanu" }],
  },
  {
    title: "Ta'aziyya da masu baƙin ciki",
    summary: "Ka ta'aziya masu rai da addu'ar bala'i ta annabci.",
    body: [
      "Umm Salamah ta ruwaito cewa Manzon Allah ﷺ ya ce: 'Babu Musulmi da aka sami bala'i sa'an nan ya ce abin da Allah ya umarta — \"Ga Allah muke, kuma zuwa gare Shi muke komawa. Ya Allah, ka ba ni lada a cikin bala'ina ka maye mini da wani abu mafi kyau\" — sai Allah ya maye masa da abu mafi kyau' (Sahih Muslim 918). Hisnul Muslim ya kiyaye wannan lafazin (hisn-154).",
      "Bayar da ta'aziyya da ɗan gajeren magana na gaskiya; shirya abinci ga iyalin mamaci maimakon ɗora musu nauyin liyafa (Abu Dawud 3132 — rahoton dangin Ja'far). Guji bukukuwan ƙirƙira na ranar da aka kayyade da ba su da hujja yayin da ka ci gaba da addu'a ta sirri, sadaqah, da alheri.",
      "Baƙin ciki da hawaye an yarda; kuka, bugun kunci, da tsage tufafi an hana. Tallafa wa gwauraye, marayu, da masu dogaro da taimako na halal bayan binnewa.",
    ],
    actions: [
      "Koyar da masu baƙin ciki addu'ar bala'i.",
      "Taimaka da abinci da ayyuka maimakon jiran liyafa.",
      "Ci gaba da addu'a mai natsuwa da sadaqah ga mamaci.",
    ],
    hadith: [
      {
        excerpt:
          "Babu Musulmi da aka sami bala'i ya ce kalmomin komawa ga Allah da aka umarta ya nemi maye da mafi kyau, sai Allah ya maye masa da mafi kyau.",
      },
    ],
    appLinks: [{ label: "Manufofin sadaqah" }],
  },
];
