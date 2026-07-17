import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Somali translation overlay for the Learn Friday (Jumu'ah) guide. Mirrors the order of
// FRIDAY_GUIDE_TOPICS in ../friday-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const FRIDAY_GUIDE_TOPICS_SO: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Fadlida Jimcaha",
    summary:
      "Maalinta ugu wanaagsan ee qorraxdu ka soo baxdo — abuurista Aadan, iyo cafinta u dhaxaysa laba Jimce.",
    body: [
      "Jimcaha (Yawmul-Jumu'ah) waa maalinta isu-imaatinka toddobaadlaha ee ummaddan. Abuu Hurayrah wuxuu sheegay in Rasuulka Alle ﷺ uu yiri: 'Maalinta ugu wanaagsan ee qorraxdu ka soo baxdo waa Jimcaha; waxaa lagu abuuray Aadan, waxaa lagu galiyay Jannada, waxaa laga soo saaray, Saacadda Ugu Dambeysana ma dhici doonto maalin aan Jimce ahayn' (Saxiix Muslim 854).",
      "Cibaadadeedu waxay sidoo kale sidan qaadaan ballan joogto ah oo cafinta ah. Abuu Hurayrah wuxuu sheegay in Nabiga ﷺ uu yiri: 'Qofkii Jimcaha maydha, kadibna yimaada salaadda Jimcaha, oo dhegeysto oo aamusan yahay intii imaamku khudbadda jeediyo, dembiyadiisa u dhexeeya Jimcahaas iyo tan xigta waa la cafin doonaa, sidoo kale saddex maalmood dheeraad ah' (Saxiix Muslim 857).",
      "Fadlidahaas waa u yeedhis in horay loo diyaargaroobo, si taxadar leh loo dhegaysto, iyo in Jimcaha loo arko sida cusboonaysiin ruuxi toddobaadle — ma aha oo keliya maalin nasasho ah oo shaqo.",
    ],
    hadith: [
      {
        excerpt:
          "Maalinta ugu wanaagsan ee qorraxdu ka soo baxdo waa Jimcaha; waxaa lagu abuuray Aadan, waxaa lagu galiyay Jannada, waxaa laga soo saaray, Saacadda Ugu Dambeysana ma dhici doonto maalin aan Jimce ahayn.",
      },
      {
        excerpt:
          "Qofkii Jimcaha maydha, kadibna yimaada salaadda Jimcaha, oo dhegeysto oo aamusan yahay intii imaamku khudbadda jeediyo, dembiyadiisa u dhexeeya Jimcahaas iyo tan xigta waa la cafin doonaa, sidoo kale saddex maalmood dheeraad ah.",
      },
    ],
    actions: [
      "Niyad qaado subaxa Jimcaha: maydhka, dharka ugu wanaagsan, iyo goor hore imaanshaha.",
      "Khudbadda u arag sidii cibaadada — aamusnaanta iyo feejignaantu waa qayb ka mid ah abaalka.",
    ],
  },
  {
    title: "Jimcaha — waajibaad toddobaadle",
    summary:
      "Salaadda Jimcaha ee jamaacadda oo lagu farlay Qur'aanka, taasoo bedelaysa salaadda duhurka kuwa dhigta.",
    body: [
      "Alle wuxuu si toos ah ugu farlay salaadda Jimcaha: 'Kuwiinaan rumeeyow! Marka loogu yeedho salaadda maalinta Jimcaha, u dedeja xusidda Alle oo ka taga ganacsiga. Taasi waa idiin khayr roon haddii aad garanaysaan' (Qur'aan, 62:9). Aayadaha xiga waxay ogolaan ku fidsanaanta dhulka iyo raadinta risqiga Alle ka dib salaadda (Qur'aan, 62:10–11).",
      "Jimcaha waxay ka kooban tahay khudbo laba qaybood iyo laba rakco oo si dheer loogu akhriyo imaamka gadaashiisa, waxayna bedelaysaa salaadda duhurka kuwa dhigta. Taariiq bin Shihaab wuxuu sheegay in Nabigu ﷺ yiri salaadda jamaacadda ee Jimcaha waa waajib ku saaran nin kasta Muslim mooyaane afar qof: addoon, naag, ilmo, ama qof buka (Sunan Abuu Daawuud 1067).",
      "Dayacaaddeedu waa digniin culus: Abuul-Ja'd wuxuu sheegay qofkii saddex Jimcood ka tago dayacaad awgeed, Alle wuxuu shaabadeeya qalbigiisa (Sunan an-Nasaa'i 1369). Waqtiga khudbadda, hadal aan macno lahayn wuu lumiyaa abaalka — Abuu Hurayrah wuxuu sheegay haddii aad saaxiibkaa ku tidhaahdo 'Aamus' inta imaamku khudbadda jeedinayo, adiga qudhaadaa hadal aan macno lahayn ku hadashay (Saxiix al-Bukhaari 934).",
      "Ka dib Jimcaha waxaa lagu talinayaa in la tukado afar rakco: Abuu Hurayrah wuxuu sheegay in Nabiga ﷺ yiri, 'Marka mid idinka mid ah uu tukado salaadda Jimcaha, ha tukado ka dib afar (rakco)' (Saxiix Muslim 881).",
    ],
    quran: [
      {
        excerpt:
          "Kuwiinaan rumeeyow! Marka loogu yeedho salaadda maalinta Jimcaha, u dedeja xusidda Alle oo ka taga ganacsiga. Taasi waa idiin khayr roon haddii aad garanaysaan. Markay salaaddu dhammaato, ku fidsanaada dhulka, oo ka doonta fadliga Alle...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Salaadda jamaacadda ee Jimcaha waa waajib ku saaran nin kasta Muslim mooyaane afar qof: addoon, naag, ilmo, ama qof buka.",
      },
      {
        excerpt:
          "Qofkii saddex Jimcood ka tago dayacaad awgeed, Alle wuxuu shaabadeeya qalbigiisa.",
      },
      {
        excerpt:
          "Haddii aad saaxiibkaa ku tidhaahdo 'Aamus' Jimcaha inta imaamku khudbadda jeedinayo, adiga qudhaadaa hadal aan macno lahayn (lagwu) ku hadashay.",
      },
      {
        excerpt:
          "Marka mid idinka mid ah uu tukado salaadda Jimcaha, ha tukado ka dib afar (rakco).",
      },
    ],
    actions: [
      "Qorshee safarkaaga si aad masaajidka ugu timaaddo khudbadda ka hor inta ay bilaabmin.",
      "Taleefanka aamusi oo ka fogow hadalka intii khudbadda socoto.",
      "Tukashada afar rakco ka dib Jimcaha marka aad awoodid.",
    ],
    appLinks: [{ label: "Baro salaadda — casharka Jimcaha" }, { label: "Fur la socodka" }],
    disclaimer:
      "Tirada ugu yar ee ka qaybgalayaasha loo baahan yahay in Jimcuhu sax noqoto, iyo in ay dhaqan ku tahay in dumarka iyo socdaalyaasha lagu dhiirrigeliyo ka qaybgalka, waa arrimo fiqhi oo faahfaahsan oo ku kala duwan madaxda fiqhiga iyo caadooyinka maxalliga ah. Dumarka, socdaalyaasha, iyo dadka buka ee aan imaan waxay tukadaan salaadda duhurka bedelkeeda. Tani waa macluumaad waxbarasho, ma aha fatwa.",
  },
  {
    title: "Diyaargarowga Jimcaha",
    summary: "Maydhka, dhar nadiif ah, cadar, iyo goor hore imaatin ee abaalka ugu weyn.",
    body: [
      "Diyaargarowgu waa qayb ka mid ah sunnadda Jimcaha. Abuu Sacid al-Khudri wuxuu sheegay in Rasuulka Alle ﷺ uu yiri: 'Maydhka Jimcaha waa waajib ku saaran qof kasta oo gaadhay qaan-goynta' (Saxiix Muslim 846). Hadiith la mid ah oo ku yaal Saxiix al-Bukhaari (877) ayaa sidoo kale ku xidha maydhka Jimcaha kuwa gaadhay qaan-goynta.",
      "Maydhka waxaa dheer, Nabigu ﷺ wuxuu ku dhiirrigeliyay in la isu ekeysiiyo si ugu wanaagsan. Salmaan al-Faarisi wuxuu sheegay in Nabiga ﷺ yiri: 'Qofkii Jimcaha maydha, ka dibna isku daahiriyo intii karo, ka dibna saliid timaha ama cadar isticmaalo, ka dibna baxo, oo aan labo qof u dhex xoqin inuu meeshiisa fadhiisto, dhegeysto imaamka ilaa uu dhammeeyo, ka dibna tukado salaadda loo farlay — dembiyadiisa u dhexeeya Jimcahaas iyo tan xigta waa la cafin doonaa' (Saxiix al-Bukhaari 883).",
      "Goor hore imaatinku wuxuu labanlaabaa abaalka. Abuu Hurayrah wuxuu sheegay qofkii ku tegay saacadda koowaad wuxuu la mid yahay nin geel allabari qalay, ka dibna sac, ka dibna wan, ka dibna diic, ka dibna ukun — markii imaamku soo baxona, malaa'igtu way duudsiiyaan diiwaankooda oo dhegeystaan xusuusinta (Saxiix al-Bukhaari 881).",
    ],
    hadith: [
      { excerpt: "Maydhka Jimcaha waa waajib ku saaran qof kasta oo gaadhay qaan-goynta." },
      { excerpt: "Maydhka Jimcaha waa waajib ku saaran nin Muslim kasta oo gaadhay qaan-goynta." },
      {
        excerpt:
          "Qofkii Jimcaha maydha, ka dibna isku daahiriyo intii karo, ka dibna saliid timaha ama cadar isticmaalo, ka dibna baxo, oo aan labo qof u dhex xoqin inuu meeshiisa fadhiisto, dhegeysto imaamka ilaa uu dhammeeyo, ka dibna tukado salaadda loo farlay — dembiyadiisa u dhexeeya Jimcahaas iyo tan xigta waa la cafin doonaa.",
      },
      {
        excerpt:
          "Qofkii Jimcaha maydha, ka dibna goor hore tego, wuxuu la mid yahay nin geel allabari qalay... ka dibna sac... ka dibna wan... ka dibna diic... ka dibna ukun. Markii imaamku soo baxo, malaa'igtu waxay imaadaan si ay u dhegeystaan xusuusinta.",
      },
    ],
    actions: [
      "Maydh subaxa Jimcaha (ama ka hor inta aadan tegin masaajidka).",
      "Xir dharkaaga ugu wanaagsan oo nadiif ah, haddii ay suurtogal tahay isticmaal cadar fudud.",
      "Goor hore tag — kuwa horrayn timaadaa waxay helayaan abaalka ugu weyn.",
    ],
    appLinks: [{ label: "Baro nadaafadda — Maydhka" }],
    disclaimer:
      "In maydhka Jimcaha uu yahay waajib adag ama sunno lagu dhiirrigeliyay si adag, waa kala duwanaansho madaxa fiqhiga oo qadiim ah. Dhammaan way isku raacsan yihiin fadligiisa weyn; raac dhaqanka la aqbalay ee bulshadaada.",
  },
  {
    title: "Suuratu al-Kahf Jimcaha",
    summary: "Nuur u dhaxeeya laba Jimce, iyo ilaalin toban aayadood oo hore.",
    body: [
      "Akhrinta Suuratu al-Kahf (Qur'aan 18) Jimcaha waa dhaqan toddobaadle oo la jecel yahay. Abuu Sacid al-Khudri wuxuu sheegay in Nabiga ﷺ yiri: 'Qofkii Jimcaha akhriyo Suuratu al-Kahf, nuur ayaa u ifin doona inta u dhaxaysa laba Jimce.' Hadiiskan waxaa lagu soo mariyay al-Haakim iyo al-Bayhaqi, waxaana Sheekh al-Albaani ku qiimeeyay sax; bulsho badan waxay u raacaan sida sunno Jimce oo la aqbalay.",
      "Kaas ka duwan, tobankii aayadood ee hore ee Suuratu al-Kahf waa ilaalin ka Fitnadii Dajjaal. Abuu Dardaa wuxuu sheegay in Nabiga ﷺ yiri: 'Qofkii kaydsado tobankii aayadood ee hore ee Suuratu al-Kahf, wuu ka ilaalin doonaa Dajjaal' (Saxiix Muslim 809).",
      "Waqti ka raadi u dhaxeeya galabta Khamiista iyo qorraxda dhaca ee Jimcaha si aad u akhrido suuraddan — xitaa haddii aadan awoodin inaad dhammaystirto qaybta oo dhan, ka bilow aayadaha hore oo ku noqnoqo intii aad awoodid.",
    ],
    quran: [
      {
        excerpt:
          "Mahad oo dhan waxaa leh Alle kii ku soo dejiyay addoonkiisa Kitaabkii, oon ku samaynayn wax qalloocnaan ah... Miyaadse u malaynaysaan in ehlu al-kahf iyo al-raqiim ay ka mid ahaayeen calaamadahayaga la yaab leh?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qofkii Jimcaha akhriyo Suuratu al-Kahf, nuur ayaa u ifin doona inta u dhaxaysa laba Jimce. (Sheekh al-Albaani ku qiimeeyay sax)",
      },
      {
        excerpt:
          "Qofkii kaydsado tobankii aayadood ee hore ee Suuratu al-Kahf, wuu ka ilaalin doonaa Dajjaal.",
      },
    ],
    actions: [
      "Jimcaha fur Suuratu al-Kahf oo akhri intii aad awoodid oo feejignaan leh.",
      "Kaydso ama ku noqnoqo tobankii aayadood ee hore si aad uga ilaawsan tahay Dajjaal.",
    ],
    appLinks: [{ label: "Akhri Suuratu al-Kahf" }],
    disclaimer:
      "Hadiiska 'nuurka u dhaxeeya laba Jimce' kuma jiro Lixda Kitaabood ee ugu waaweyn; wuxuu ku salaysan yahay wax laga soo qaatay oo si ballaaran loo aqbalay ka dib. Ilaalinta tobankii aayadood ee hore (Muslim 809) waa sax aan lagu murmayn.",
  },
  {
    title: "Salaadu ee Nabiga ﷺ Jimcaha",
    summary: "Maalinta ugu wanaagsan ee toddobaadka, badiya salaadu ku Nabiga ﷺ.",
    body: [
      "Jimcaha waxaa loo qoondeeyay salaadu badan. Aws bin Aws wuxuu sheegay in Nabiga ﷺ yiri: 'Maalimaha idinka ugu wanaagsan waa Jimcaha; sidaa darteed badiya salaaduhu maalintaas dhexdeeda, maxaa yeelay salaaduhiinnu waa la keeni doonaa aniga.' Waxay yidhaahdeen: 'Rasuulka Allow, sidee baa salaaduhiinnu naga heli inagoo lagu keeni doono adiga, adigu markaad noqoto ciid?' Wuxuu yiri: 'Alle wuxuu ka reebay dhulka in uu cunno jidhka Nabiyada' (Sunan Abuu Daawuud 1047).",
      "Qaab kasta oo salaadu oo sax ah waa la aqbalaa — ha noqdo kuwa lagu baro salaadda ama qaabab dheer oo ka yimaada Sunnada. Waxa muhiimka ah waa soo noqnoqoshada iyo daacadnimada Jimcaha, ma aha tiro go'an.",
    ],
    hadith: [
      {
        excerpt:
          "Maalimaha idinka ugu wanaagsan waa Jimcaha; sidaa darteed badiya salaaduhu maalintaas dhexdeeda, maxaa yeelay salaaduhiinnu waa la keeni doonaa aniga.",
      },
    ],
    actions: [
      "Dejiso yool gaar ah oo salaadu Jimcaha ah — xitaa tiro yar oo joogto ah.",
      "Haddii aad rabto qaab diyaar ah, isticmaal ururinta salaaduhu ee app-ka.",
    ],
    appLinks: [{ label: "Salaadu" }],
  },
  {
    title: "Saacadda la aqbali doono",
    summary: "Saacad Jimcaha oo aan la diidayn ducada — ka raadso gaar ahaan ka dib Casarka.",
    body: [
      "Abuu Hurayrah wuxuu sheegay in Rasuulka Alle ﷺ uu xusay Jimcaha oo yiri: 'Jimcaha waxaa jira saacad, haddii addoon Muslim ah taagto oo wax weydiisto Alle, wuu siin doonaa' — wuxuuna gacantiisa ku tilmaamay inay gaaban tahay (Saxiix al-Bukhaari 935; sidoo kale Saxiix Muslim 852).",
      "Culimadu way isku khilaafeen goorta saacaddan sax ahaan ay ku dhacdo. Aragti xoog leh oo mid ah waxay dhigaysaa qaybta ugu dambaysa ee Jimcaha ka dib Casarka: Jaabir bin Cabdullaah wuxuu sheegay in Nabiga ﷺ yiri: 'Jimcuhu waa laba iyo toban saacadood, waxaana ku jira saacad, haddii addoon Muslim ah wax weydiisto Alle, wuu siin doonaa — ee ka raadso saacadda ugu dambaysa ka dib Casarka' (Sunan Abuu Daawuud 1048).",
      "Aragtida aad raacdo ha ahaato, Jimcaha — gaar ahaan qaybta galabta ee ugu dambaysa — ku buux ducada daacadda ah, istighfaarka, iyo salaaduhu, iyadoo aad ku kalsoon tahay ballanka Alle ee jawaabta.",
    ],
    hadith: [
      {
        excerpt:
          "Jimcaha waxaa jira saacad, haddii addoon Muslim ah taagto oo wax weydiisto Alle, wuu siin doonaa — wuxuuna gacantiisa ku tilmaamay inay gaaban tahay.",
      },
      {
        excerpt:
          "Jimcaha waxaa jira saacad, haddii Muslim ku sugan salaad wax weydiisto Alle, wuu siin doonaa.",
      },
      {
        excerpt:
          "Jimcuhu waa laba iyo toban saacadood, waxaana ku jira saacad, haddii addoon Muslim ah wax weydiisto Alle, wuu siin doonaa — ee ka raadso saacadda ugu dambaysa ka dib Casarka.",
      },
    ],
    actions: [
      "Ka dib Casarka Jimcaha, fadhiiso liis ducooyin gaaban oo daacadnimo ku weydiiso.",
      "Isku dar duco iyo salaadu — labaduba waxaa lagu dhiirrigeliyaa gaar ahaan maalintan.",
    ],
    appLinks: [{ label: "Ururinta ducooyinka" }],
    disclaimer:
      "Wakhtiga saxda ah ee saacadda la aqbali doono waa arrin culimadu ku khilaafsan yihiin (waqtiga khudbadda, ka dib Casarka, iyo aragtiyo kale). Jiritaanka saacaddu naftiisu waa sax lagama murmi karo Bukhaari iyo Muslim gudahood.",
  },
];
