// Hausa translation overlay for the Learn Salah guide content. Mirrors the order of
// its English source in ../salah-guide*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { SalahGuidePhrase, SalahGuideTopic } from "../../types/salah-guide";
import type { DeepPartial } from "./localize";

export const SALAH_GUIDE_TOPICS_HA: DeepPartial<SalahGuideTopic>[] = [
  {
    title: "Menene Sallah?",
    summary: "Rukuni na biyu na Musulunci - saduwar ku na yau da kullun tare da Allah.",
    body: [
      "Sallah ita ce ibadar da Allah ya wajabta wa kowane mumini: umarni ne na tsayuwa (qiyam) da ruku'u da sujuda, hade da kayyade kalmomi na yabo da Alkur'ani da addu'a, ana yin su sau biyar a kowace rana. Kalmar Sallah ta fito ne daga tushen larabci ma'ana haɗi da addu'a - shi ne mumini kai tsaye, layin da ba ya daidaitawa zuwa ga Mahalicci, ba ya buƙatar wani firist kuma ba mai ceto ba.",
      "Raka'a guda daya cikakkar addu'a - wacce ta tsaya har zuwa sujada ta biyu - ana kiranta da raka'a. Ana kirga sallah a raka’a: Asuba biyu ne, Maghrib uku, sai Zuhr, La’asar, da Isha’i hudu. Ana kiran sallar farilla da farida; Abubuwan da Manzon Allah Sallallahu Alaihi Wasallama ke yi a kai a kai sunna ne, kuma sallolin nafila da aka yi nafila.",
      "A cikin ginshiƙai na musamman, ba a saukar da salati ta hannun mala'ika da yake saukowa duniya ba, amma an yi umarni da shi kai tsaye ga Annabi SAW lokacin da aka tashe shi a cikin sama a Tafiyar Dare (al-Isra' wa al-Mi'raj). An fara farilla salloli hamsin, sannan - ta hanyar Manzon Allah ﷺ maimaicin dawowa yana neman sauki ga al'ummarsa - ya rage zuwa biyar a aikace tare da kiyaye ladan hamsin.",
      "Don haka ne ma Sallah ke zama a tsakiyar rayuwar Musulunci: maimaituwa sau biyar a kullum, tana katse aiki, da hutu, da jin dadi don sake dora zuciya ga Allah, kuma ita ce aikin farko da za a yi wa bawa hisabi a ranar kiyama. Idan an sami sauti, sauran rikodin yana son bi.",
    ],
    quran: [
      {
        excerpt:
          "Waɗanda suke yin ĩmãni da gaibi, kuma suka tsai da salla, kuma daga abin da Muka azurta su da su sunã ciyarwa.",
      },
      {
        excerpt:
          "Ka karanta abin da aka saukar zuwa gare ka na Littãfi kuma ka tsai da salla. Lallai sallah tana hani daga alfasha da zalunci, kuma ambaton Allah ya fi girma.",
      },
    ],
    hadith: [
      {
        excerpt:
          "A cikin Tafiyar Dare Allah ya wajabta salloli hamsin; Annabi Sallallahu Alaihi Wasallama ya yi ta komawa don neman agaji har suka kai shekara biyar – ‘Wadannan biyar ne, waxannan kuma hamsin ne, domin magana a wurina ba ta canzawa. (Sahih Musulmi 162)",
      },
      {
        excerpt:
          "Farkon abin da za a fara wa bawa hisabi a ranar qiyama shi ne sallarsa; idan ya gyaru sauran ayyukansa sun inganta. (kuma Abu Dawud 864, an-Nasa'i 3991).",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Me yasa Sallah?",
    summary: "'Ya'yan itãcen ruhi, ɗabi'a, hankali, da madawwama na salloli biyar.",
    body: [
      "Sallah ce zance kai tsaye da Allah. A cikin tsayuwarta kuna yi masa magana ta hanyar kalmominSa da ya bayyana; a cikin sujada - Matsayin mafi girman ƙasƙanci - kai ne mafi kusanci zuwa gare Shi, kuma mafi kusantar a karɓa. Babu wata ibada da ake maimaita ta sau da yawa ko kusan kusan haka.",
      "'Ya'yanta na farko shine kamewa, mai tarbiyya. Allah da kansa ya bayyana cewa addu’a idan an tabbatar da ita yadda ya kamata, ‘ta kange fasikanci da azzalumai’ (29:45): Mutumin da ya tsaya a gaban Allah da gaske sau biyar a rana ya fi fuskantar zunubi. Haka nan tsarkakewa ne – Annabi SAW ya kwatanta salloli biyar da kogi mai gudana wanda mutum zai yi wanka a cikinsa sau biyar kullum, ba ya barin datti.",
      "'Ya'yanta na biyu shine kwanciyar hankali. Alkur'ani ya yi alkawarin cewa zukata suna samun natsuwa da ambaton Allah, kuma Annabi (SAW) a lokacin damuwa yakan ce, 'Ka kwantar mana da hankali da shi ya Bilal,' yana kiran salla. Ya kwatanta farin cikin idanunsa da aka sanya a cikin sallah.",
      "'Ya'yanta na zamantakewa da na dindindin sun cika bayanin: matakan sallar jam'i masu wadata da matalauta a cikin sahu daya da gina 'yan uwantaka, tare da kiyaye salla yana daga cikin tabbatattun hanyoyin neman gafarar Allah da shiga Aljannah. Manzon Allah SAW ya yi alkawarin Aljanna ga duk wanda ya kiyaye sallolin asuba da la'asar biyu masu sanyi.",
    ],
    quran: [
      {
        excerpt:
          "Lallai ni ne Allah. Bãbu abin bautãwa fãce Ni, sabõda haka ku bauta Mini, kuma ku tsayar da salla dõmin ambatoNa.",
      },
      {
        excerpt:
          "Lalle ne mũminai, waɗanda suka yi tawali'u a cikin addu'arsu, sun yi babban rabo.",
      },
    ],
    hadith: [
      {
        excerpt:
          "'Da akwai wani kogi a kofar dayanku wanda yake wanka a cikinsa sau biyar a rana, shin wani datti zai saura a kansa? Suka ce, 'Babu.' Sai ya ce: \"Misalin salloli biyar kenan, Allah yana kankare zunubai da su.\" (Sahihu Musulmi 667)",
      },
      {
        excerpt:
          "Wanda ya sallaci salloli guda biyu masu sanyi – Fajr da La’asar – zai shiga Aljanna.",
      },
      {
        excerpt:
          "An sanya mini ƙaunatacce a gare ni daga duniyarku mata da turare, kuma sanyin idona ya sanya a cikin addu'a.",
      },
    ],
    actions: [
      "Yi addu'a guda ɗaya cikakke akan lokaci a yau - daidaito, ba kamala ba, shine manufa ta farko.",
      "Karanta ma'anar fatiha sau ɗaya kafin sallarka ta gaba don jin ana amsa maka.",
      "Kunna tunatarwar adhan don kada taga addu'a ta wuce ba a gane ba.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Matsayinsa a Musulunci",
    summary: "Ginshiƙin addini - kuma mafi girman aikin gafala.",
    body: [
      "Manzon Allah SAW ya koyar da cewa an gina musulunci akan rukunai guda biyar, kuma sallah itace ta biyu, nan da nan bayan shaidar imani guda biyu. Shaidar ta shigar da ku cikin Musulunci; addu'ar ita ce tabbatacciyar hujjar cewa shaidar tana zaune a cikin zuciyarka. Don haka ne malamai ke kiran Sallah ‘rukunin addini’ – gida wanda ba shi da rukunnansa ya ruguje.",
      "Ana ganin nauyinsa a yadda nassin ke magana game da sakaci da shi. Alkur'ani ya yi gargadin al'ummar da suka 'bautar da sallah kuma suka bi son zuciya' kuma suka yi hasashen halakarsu, kuma Annabi SAW ya siffanta addu'a a matsayin alkawarin da ya bambanta imani da kafirci.",
      "Akan hukuncin wanda ya bar sallah, akwai sabani sananne da girmamawa a tsakanin malaman Sunna. Wasu suna ganin cewa da gangan barinsa gaba daya - alhalin suna tabbatar da cewa wajibi ne - ya kai babban kafirci da ya kore mutum daga Musulunci; mafi rinjaye (Hanafi, Maliki, Shafi'i) suna ganin cewa irin wannan mutum ya kasance musulmi mai zunubi da laifin daya daga cikin manya manyan zunubai, matukar bai yi inkarin wajibcinsa ba. Dukkansu sun haxu a kan cewa barin salla bala’i ne, kuma duk wanda ya qi wajabcinta ya fita daga Musulunci bisa ijma’i.",
      "Darasin a aikace daya ne akan kowace mahanga: kiyaye salloli biyar ba nafila ba ne ko kuma nasiha ga mumini. Sallar nafila (sunnah da nafila) sannan sai ta zama hanyar kariya, ta hanyar yin tawaya a cikin sallolin farilla ranar kiyama.",
    ],
    quran: [
      {
        excerpt:
          "Ku tsayar da salla da tsakiyar salla kuma ku tsayu ga Allah, kunã mãsu tsarkake addini.",
      },
      {
        excerpt:
          "Sai kuma wasu magada daga bayansu suka bar sallah kuma suka bi son zuciya; To, zã su haɗu da mummuna.",
      },
    ],
    hadith: [
      {
        excerpt:
          "An gina Musulunci a kan biyar: Shaidawa babu abin bautawa da gaskiya sai Allah, kuma Muhammadu ManzonSa ne, da tsayar da Sallah, da bayar da zakka, da Hajji, da Azumin Ramadan. (Sahihul Bukhari 8)",
      },
      {
        excerpt:
          "Alkawarin dake tsakaninmu da su shine sallah; wanda ya bar ta ya yi kafirci. (Buraydah; kuma an-Nasa'i, Ibn Majah 1079).",
      },
      {
        excerpt: "Tsakanin mutum da kafirci da shirka akwai barin sallah. (Jabir)",
      },
    ],
    disclaimer:
      "Malamai sun yi sabani a kan hakikanin hukuncin wanda ya bar sallah saboda kasala (babban zunubi ga mafi rinjaye; kafircin wasu) da wanda ya musanta wajibcinta (kafircin ijma'i). Wannan app ɗin baya bayar da hukunci akan kowane mutum - tuntuɓi ƙwararren malami don shari'o'in sirri.",
  },
  {
    title: "Wa zai yi addu'a?",
    summary:
      "Kowane musulmi mai hankali, baligi mai hankali - tare da keɓewa da rangwame a sarari.",
    body: [
      "Sallah ta wajaba akan duk musulmin da yake da hankali kuma ya balaga. Ƙungiyoyin uku an ɗauke su daga lissafin gaba ɗaya bisa ingantacciyar ka'ida: mai barci har sai ya farka, yaro har sai ya balaga, da kuma rashin hankali har sai ingantaccen dalili ya dawo.",
      "Yara har yanzu ba a wajabta ba, amma ana horar da su a hankali. Annabi SAW ya yi umarni da a umurci yara da su yi addu’a tun suna shekara bakwai kuma a ladabtar da su a hankali kan rashin kula da ita a goma – ta yadda sallar balaga ta zama al’ada ta tabbata, ba nauyi kwatsam ba.",
      "Matan da ke cikin haila (hayd) ko jinin haila (nifas) ba sa sallah a wannan lokacin; Sallar farilla da aka rasa ba a bayanta ba - rahama ce da hukunci da malamai suka yi ittifaqi a kansu. (Azumin da ba a yi ba, ba kamar sallah ake yin su ba) Mace ta koma sallah da zarar jini ya kare sai ta yi tsarki da gyale.",
      "Rashin iyawa na gaske yana haifar da rangwame, ba za a sake sokewa ba: rashin lafiya mai tsanani, rashin sani, da tsoro mai yawa na iya ba wa mutum uzuri na wani lokaci, kuma marasa lafiya suna yin addu'a gwargwadon iyawarsu - zaune, karya, ko ma da ishara. Tafiya ba ta gusar da sallah sai dai tana saukaka ta ta hanyar gajarta (qasr) da hada (jam'i), wanda aka rufe a cikin jagoran tafiyar.",
    ],
    hadith: [
      {
        excerpt:
          "Kuma ku umurci yaranku da su yi salla idan sun kai bakwai, kuma ku ladabtar da su da ita goma, kuma ku kebe wuraren barcinsu. (Amr bn Shu'aib daga babansa daga kakansa)",
      },
    ],
    quran: [
      {
        excerpt: "Kuma ka umurci iyãlanka da salla, kuma ka yi haƙuri a cikinta.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Sharudda kafin sallah",
    summary: "Sharuɗɗa tara (shurut) waɗanda dole ne su kasance a wurin don yin sallah ta inganta.",
    body: [
      "Kafin sallah ma ta inganta, sai an cika wasu sharudda (shurut al-Sallah). Sharadi ya bambanta da ginshiƙi: sharuɗɗan sharuɗɗa ne waɗanda ke zuwa kafin farawa da ci gaba gaba ɗaya, yayin da ginshiƙai (arkan) ɓangaren sallar kanta ne. Idan kuma wani sharadi da ake nema ya bace to ba a karbar sallar komai yadda aka yi ta.",
      "Yi la'akari da waɗannan tara a matsayin jerin abubuwan dubawa kafin tashin jirgin. Yawancin suna haɗi zuwa cikakken darasi a wani wuri a cikin wannan jagorar - matsa don koyan kowannensu a zurfi. Biyu daga cikinsu (suka fuskanci alƙibla da daidai lokacin) ana iya ba da uzuri da rashin iya gaske; sauran ana buƙata sosai a duk lokacin da mutum zai iya.",
    ],
    steps: [
      {
        title: "Musulunci",
        body: "Sallah aiki ne na musulmi; ba ya inganta daga – kuma ba ya wajaba a kan – wanda ba musulmi ba har sai sun shiga musulunci.",
      },
      {
        title: "Mai hankali ('aql)",
        body: "Dole ne mutum ya kasance da kyakkyawan dalili. Wanda ya rasa hayyacinsa ba a yi masa hisabi alhali yana cikin wannan hali.",
      },
      {
        title: "Hankali (tamyiz)",
        body: "Ƙarfin rarrabewa, ya kai kusan shekaru bakwai - shekarun da aka gaya wa yara su yi addu'a.",
      },
      {
        title: "Cire ƙananan ƙazanta & babba (taharah daga hadath)",
        body: "Ingantacciyar alwala, ko ghusl bayan najasa babba, ko tayyiyar da ba za a iya amfani da ruwa ba.",
      },
      {
        title: "Cire kazanta (najasah)",
        body: "Dole ne jiki, tufa, da wurin sallah su kasance ba tare da ƙazanta na al'ada ba kamar fitsari, yawan jini, da sauran abubuwan da aka lissafa.",
      },
      {
        title: "Rufe awrah",
        body: "Sassan da dole ne a rufe an rufe su da tsaftataccen tufa da ba su da kyau - duba darasin Tufafi & Awrah.",
      },
      {
        title: "Lokacin sallah ya shiga",
        body: "Kowace sallah tana da tagar da aka ayyana; addu'a kafin lokacinta bai inganta ba. Yi amfani da jadawalin ku da masu tuni.",
      },
      {
        title: "Fuskantar alqibla",
        body: "Juya zuwa Ka'aba daidai gwargwadon yadda za ku iya tantancewa - uzuri kawai cikin rashin iyawa.",
      },
      {
        title: "Niyya (niyyah)",
        body: "Tsayawa a cikin zuciya wacce addu'ar da kuke shirin yi. Abu ne na ciki kuma ba a magana da babbar murya.",
      },
    ],
    appLinks: [{}, {}, {}],
    disclaimer:
      "Mazhabobi suna magana kuma suna ƙididdige sharuɗɗan ɗan bambanta (wasu suna lissafin niyya a cikin ginshiƙai maimakon sharuɗɗa). An yarda da abu.",
  },
  {
    title: "Tsarkake (Taharah)",
    summary: "Tsarkin kai, tufa, da wuri - ƙofar kowace sallah.",
    body: [
      "Taharah tana nufin dauke kazanta domin ka tsaya a gaban Allah cikin tsafta. Allah yana son masu tsarkake kansu, kuma Annabi SAW ya koyar da cewa 'tsarkaka rabin imani ne'. Ba a karbar addu’a in ba ta ba.",
      "Najasa iri biyu ce. Ƙananan ƙazanta (hadath asghar) - abin da ke haifar da abubuwa kamar amfani da bayan gida ko iska mai wucewa - yana ɗagawa ta hanyar wudu. Babban ƙazanta (hadath akbar ko janabah) - bin kusanci, fitar maniyyi, ko ƙarshen haila da zubar jinin bayan haihuwa - ana ɗagawa ta cikakken wanka (ghusl).",
      "Baya ga wadannan jahohin na ibada, najasa (najasah) - kamar fitsari, zubar jini, jini mai gudana, da makamantansu - dole ne a cire jiki daga jiki, da tufafi, da wurin da za ku yi sallah. Yana yiwuwa a yi alwala mai inganci duk da haka har yanzu kuna buƙatar tsaftace tabo daga tufafinku kafin yin addu'a.",
      "Ruwa shine farkon mai tsarkakewa. Lokacin da babu ruwa da gaske, ko kuma zai cutar da ku saboda rashin lafiya ko sanyi mai tsanani, Musulunci ya ba da izinin tayamum - bushewar tsarkakewa ta amfani da ƙasa mai tsabta - a matsayin cikakken madadin. Ba a taba nufin tsarkakewa ya zama wahala ba; hanya ce ta kusantowa.",
    ],
    hadith: [
      {
        excerpt: "Tsarkake rabin imani ne... (Abu Malik al-Ash'ari)",
      },
    ],
    quran: [
      {
        excerpt: "Lallai Allah yana son masu tuba kuma yana son masu tsarkakewa.",
      },
    ],
    actions: [
      "Koyi wudu mataki-mataki kafin sallarka ta gaba don haka kowace gaɓa ta wanke daidai.",
      "Ka ajiye tufafi mai tsabta don yin addu'a idan kana aiki a cikin yanayi mara kyau.",
      "Kalli wurin sallarka don ƙazanta da ke bayyane kafin ka shimfiɗa tabarmar.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Alwala - alwala",
    summary:
      "Wankan da aka ba da umarni wanda ke ɗaukar ƙanƙara ƙazanta kuma yana shirye ku don yin addu'a.",
    body: [
      "Alwala ita ce wankan ibada da ke dauke qananan kazanta. Ana buqatar ta kafin kowace sallah sai dai idan har yanzu kana cikin ingantacce daga wanda ya gabata, da kuma – a cewar mafi rinjayen malamai – kafin a tava nassin Alqur’ani. Wankansa guda hudu na wajaba an ambaci sunansa kai tsaye a cikin Alkur'ani (5:6): fuska, hannaye zuwa gwiwar hannu, shafa kai, da kafafu zuwa idon sawu.",
      "Manzon Allah SAW ya yi alwala bisa tsari, sau uku ga gabobin da aka wanke, da kyau amma ba tare da bata ruwa ba - ya yi gargadi game da almubazzaranci ko da a wani kogi ne. Bayan ayyukan farilla guda hudu, kurkure baki da hanci, da wanke hannu da farko, da yin amfani da munanan ayyuka sun tabbata sunnoni masu cikawa da kawata alwala.",
      "Ladarta tana da yawa: Annabi ﷺ ya koyar da cewa kamar yadda mumini yake wanke kowane gaɓa, zunubin da wannan gaɓoɓin ya yi yana faɗuwa da ruwa - har ma daga ƙarƙashin farce - har ya fito yana tsarkaka. Don haka Alwala ba kawai ka'ida ba ce, a'a karamar gafara ce kafin kowace sallah.",
      "Alwala tana karye ne da duk wani abu da ke fita daga matsuguni (fitsari, stool, iska), da barci mai zurfi wanda ke kawar da sani, da kuma rashin hayyacinsa. Idan ta karye a lokacin Sallah dole ne a daina, ka sabunta alwala, sannan ka sake yin sallah.",
    ],
    steps: [
      {
        title: "Niyya & Bismillah",
        body: "Ka yi nufin alwala a cikin zuciyarka sannan ka fara da 'Bismillah'. Niyya tana ciki ne kuma baya buƙatar bayyanawa.",
        tip: "Yi amfani da miswak (siwak) tun da wuri lokacin da za ku iya - sunnar Annabi SAW yana so kuma ya kusa wajabta.",
      },
      {
        title: "Wanke hannu",
        body: "Wanke hannaye biyu zuwa wuyan hannu sau uku, ruwan aiki tsakanin yatsunsu.",
      },
      {
        title: "Kurkura baki",
        body: "Ɗauki ruwa a cikin baki, juya shi, kuma fitar da shi - sau uku.",
      },
      {
        title: "Kurkura hanci",
        body: "Zana ruwa a cikin hanci da hannun dama kuma fitar da shi tare da hagu - sau uku.",
      },
      {
        title: "Wanke fuska (fard)",
        body: "A wanke fuskar gaba daya sau daya zuwa sau uku, tun daga layin gashi zuwa gabo da kunne zuwa kunne; wani mutum ya rinka jikaken yatsu ta cikin gemu mai kauri.",
      },
      {
        title: "Wanke hannu (fard)",
        body: "Wanke hannun dama, sannan hagu, daga yatsa har zuwa gami da gwiwar hannu - sau uku kowanne.",
      },
      {
        title: "Goge kai (fard)",
        body: "Da rigar hannaye, shafa kan kai sau ɗaya daga gaba zuwa baya da baya, sannan a shafa ciki da bayan kunnuwa da datti iri ɗaya.",
      },
      {
        title: "Wanke ƙafafu (fard)",
        body: "Wanke ƙafar dama, sannan hagu, zuwa kuma haɗa da idon sawu - sau uku kowanne, wucewa tsakanin yatsun kafa.",
      },
      {
        title: "Shaidar imani",
        body: "Cika addu'a: 'Ashhadu an la ilaha illallah...'- ana bude kofofin Aljannah guda takwas ga wanda ya fadi ta bayan alwala.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Idan bawa ya wanke fuskarsa a cikin alwala, duk zunubin da ya kalle shi da idonsa yana barin ruwan… har sai ya fito yana mai tsarkake zunubi.",
      },
    ],
    quran: [
      {
        excerpt:
          "Ya ku waxanda suka yi imani, idan kun tashi yin sallah, to ku wanke fusknakinku da gabbanku zuwa gwiwar hannu, ku shafe kawunanku, kuma ku wanke qafafunku zuwa idon sawu.",
      },
    ],
    actions: [
      "Yi wudu a hankali sau ɗaya yayin karanta kowane mataki da ƙarfi, duba gwiwar hannu da diddige.",
      "Haddace gajeriyar addu'a bayan alwala - duba Kalmomin Sallah.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tayammum — dry purification",
    summary: "When water cannot be used, clean earth lifts impurity so prayer is not delayed.",
    body: [
      "Tayammum is the dry purification Allah legislated when water is genuinely unavailable, or when using it would cause harm because of illness or severe cold. It is not a lesser workaround for convenience — it is a complete substitute that lifts minor or major impurity for prayer until water can be used again.",
      "The Qur'an names it in the same verse as wudu and ghusl (5:6): wipe the face and hands with clean earth after striking it. The Prophet ﷺ taught the companions this concession as mercy, not as a loophole to skip searching for water when it is reasonably available.",
      "Practically: intend tayammum, say Bismillah, strike clean earth once (or twice according to some schools), wipe the face, then wipe the hands to the wrists (many scholars include up to the elbows in continuity with wudu). What breaks wudu or ghusl also ends the corresponding tayammum; finding usable water ends the concession and you return to ordinary purification.",
      "If you prayed validly with tayammum and only found water afterward, the majority hold that the completed prayer need not be repeated. If water appears before you pray, you must use it. For casts, wounds, and illness, combine wiping over dressings with tayammum as your school and doctor advise — see the full Taharah guide for detail.",
    ],
    steps: [
      {
        title: "Confirm the need",
        body: "Search reasonably for usable water, or confirm that using water would harm you (illness, severe cold, medical advice).",
      },
      {
        title: "Intention & Bismillah",
        body: "Intend tayammum in place of wudu or ghusl, and begin with Bismillah.",
        transliteration: "Bismillah",
      },
      {
        title: "Strike clean earth",
        body: "Strike clean earth (or a clean dusty surface) with both hands once — some schools strike twice.",
      },
      {
        title: "Wipe the face",
        body: "Wipe the entire face with the dust remaining on the hands.",
      },
      {
        title: "Wipe the hands",
        body: "Wipe the hands — at minimum to the wrists; many scholars wipe to the elbows.",
      },
    ],
    quran: [
      {
        excerpt:
          "…and you find no water, then perform tayammum with clean earth and wipe your faces and your hands with it.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Reported in the chapters of tayammum: the concession to purify with clean earth in the absence of usable water.",
      },
    ],
    actions: [
      "Know when tayammum applies before travel or illness so prayer is never skipped for lack of water.",
      "Open the full Taharah tayammum lessons for school differences on striking and wiping.",
    ],
    disclaimer:
      "Schools differ on details (one strike vs two, wrists vs elbows, renewing per prayer). This is a mainstream educational summary — follow reliable local scholarship for your practice.",
  },
  {
    title: "Tufafi & awrah",
    summary: "Rufe abin da dole ne a rufe - a tsabta, ladabi, da girmamawa.",
    body: [
      "Rufe Awrah - sassan jiki wanda dole ne a ɓoye - sharadi ne na ingantaccen addu'a, wanda aka samo daga umarnin Allah na 'ka ɗauki ƙawarka a kowane wurin sallah' (7:31). Dole ne tufafin su kasance masu tsafta da najasa kuma ba su da kyau sosai wanda launin fata ba zai bayyana ba.",
      "Ga maza, Awrah a cikin addu'a ita ce mafi ƙanƙanta, tun daga cibiya zuwa gwiwa. Duk da haka, ba a son yin addu’a da ƙirji idan akwai tufafi; Annabi SAW ya umurci mutum kada ya yi sallah da tufa daya ba tare da sashinta a kafadarsa ba.",
      "Ga mata, dukkan jiki a cikin salla ne aura, in ban da fuska da hannaye, kamar yadda mafi rinjayen malamai suka ce; mace tana rufe gashinta, wuyanta, da ƙafafu, yawanci da sutura mara kyau da gyale. Malamai sun bambanta akan ƙafafu, wasu suna la'akari da su a cikin abin da za a iya nunawa - yin addu'a tare da su a rufe shine mafi aminci kuma mafi rinjaye.",
      "Hukunce-hukunce hukunce-hukuncen tufa guda biyu su ma suna aiki a wajen sallar: siliki da zinare haramun ne ga maza su sanya (halatta wa mata), kuma kada tufafin su kasance masu matsewa, ko shege, ko mai da hankali, har ya kau da addu’ar da ake buqata na girman kai. A matsayinka na babban yatsan hannu, yi addu'a cikin abin da za ku sa don saduwa da wanda kuke girmamawa - ba rigar dare ko rigar bakin ruwa ba.",
    ],
    quran: [
      {
        excerpt: "Ya ku ’ya’yan Adam, ku riki adonku a kowane wurin sallah.",
      },
    ],
    actions: [
      "Ajiye tufafi guda ɗaya mai tsafta, tsafta ko rigar addu'a da aka keɓe domin ku kasance cikin shiri koyaushe.",
      "Lokacin da rashin tabbas ko wani abu ya isa ya rufe, rufe fiye da ƙasa.",
    ],
    disclaimer:
      "Cikakkun bayanai na awrah (musamman qafar mace) wani batu ne na banbance-banbance na ilimi. Bi amintaccen tallafin karatu na gida inda kuka bambanta.",
  },
  {
    title: "Lokutan sallah",
    summary:
      "Gilashi guda biyar na yau da kullun - kowane Sallah yana da mafari, ƙarshe, da lokacin da aka fi so.",
    body: [
      "Allah ya sanya salloli a ‘qaidaran lokuta’ (4:103), Ya raba dare da rana zuwa tagogi biyar masu ɗaure da motsin rana. Addu'a kafin taga taga bata aiki; jinkirta sallah taganshi ba tare da uzuri ba babban zunubi ne. A duk lokacin da zai yiwu, yi addu'a da wuri ta taga - Annabi SAW ya sanya sunan addu'a a farkonta a cikin mafi soyuwar ayyuka ga Allah.",
      "Tagogi biyar su ne: Asuba, tun daga fitowar alfijir har zuwa fitowar rana; Zuhr, tun daga rana ta zarce zenith har sai inuwar abu ta yi daidai da tsayinsa; La'asar, tun daga karshen Zuhur har zuwa faduwar rana (fiyayyen addu'a kafin rana ta yi rawaya); Maghrib, tun daga faduwar rana har zuwa jajayen magariba ta gushe; da Isha, tun daga faxuwar rana har zuwa wayewar gari na gaskiya.",
      "Akwai wasu lokuta guda uku da aka haramta yin sallar nafila a cikinsu, ta yadda ibada ba za ta taba rudewa da ibadar rana ba: kamar yadda rana ke fitowa har sai da ta fito, lokacin da ta tsaya daidai gwargwado a tsakiyar rana, da faduwarta har sai ta fadi. Yin sallolin farilla da aka rasa bai wuce wannan haramcin ba.",
      "Madaidaicin lokutan agogo suna canzawa kowace rana tare da latitude ɗinku da lokacinku, wanda shine dalilin da ya sa Annabi SAW ya ɗaure su da alamomin halitta maimakon ƙayyadaddun sa'a. Ka'idar tana lissafta su don wurin ku - amma sanin alamun alamun yana sa ku zama ƙasa lokacin da babu fasaha.",
    ],
    steps: [
      {
        title: "Fajr - 2 raka'ah fard",
        body: "Gaskiya alfijir har fitowar rana. Gabatar da sunnah raka'a 2 da aka jaddada.",
      },
      {
        title: "Zuhr - 4 raka'ah fard",
        body: "Bayan rana ta zagayo har zuwa inuwar Asuba. Sunnar ta 4 kafin ta 2 da bayanta.",
      },
      {
        title: "Asr - 4 raka'ah fard",
        body: "Daga karshen Zuhur har zuwa faduwar rana; yi addu'a kafin rana ta yi rawaya. Yawancin lokaci ana gano su da 'addu'a ta tsakiya' na 2:238.",
      },
      {
        title: "Maghrib - 3 raka'ah fard",
        body: "Daga faɗuwar rana har faɗuwar faɗuwar rana; addu'a da gaggawa. Sunnah ta 2 bayan.",
      },
      {
        title: "Isha - 4 raka'ah fard",
        body: "Tun daga faɗuwar faɗuwar rana har zuwa wayewar gari; mafi kyau kafin tsakar dare. Witr ya biyo baya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Akwai sau uku da Manzon Allah Sallallahu Alaihi Wasallama ya hana mu yin sallah a cikinsu: lokacin da rana za ta fito har sai ta fito, da lokacin da ta tsaya da rana, da lokacin da za ta faxi har sai ta faxi. (Uqbah bin Amir)",
      },
    ],
    quran: [
      {
        excerpt: "Lalle ne, an wajabta yin salla a kan muminai, a kan idda, ajali ambatacce.",
      },
      {
        excerpt:
          "Kuma ku tsayar da salla a gẽfe biyu na yini da gabãtar dare. Lallai aikin kwarai yana kore munanan ayyuka.",
      },
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Farkon Asr yana da ra'ayoyi guda biyu da aka ruwaito (inuwa daidai, ko sau biyu, tsayin abu). Dukansu suna da inganci; bi lissafin gida da al'umma.",
  },
  {
    title: "Fuskantar alqibla",
    summary: "Ku juya zuwa ga Haramin Makkah - alkiblar da ta hada al'ummah.",
    body: [
      "Alqibla ita ce alkiblar Ka'aba a cikin Masallacin Harami na Makkah. Fuskantar ta sharadi ne na ingantacciyar sallah. A farkon Musulunci Musulmai sun yi addu'a zuwa Kudus; sai Allah ya saukar da umarni da a waiwaya zuwa ga Masallacin Harami, kuma wata hanya guda ta hada kan masu bautar duniya tun daga wannan lokacin - a kullum, bayyanar jiki na al'umma daya tana fuskantar Ubangiji daya.",
      "Ana buƙatar ku fuskanci alƙibla daidai da yadda za ku iya tantancewa - tare da kamfas, mihrabin masallaci, ingantaccen app, ko rana da taurari lokacin tafiya. An gafarta ƙaramar karkata da ba za a iya gujewa ba; Abin da ke da muhimmanci shi ne ƙoƙari na gaske zuwa ga madaidaiciyar alkibla.",
      "Idan da gaske ba za ku iya tantance alkibla ba - bata a teku, cikin gajimare, a cikin ƙasa da ba ku sani ba da dare - kuna ƙoƙarin aiwatar da shi sannan ku yi addu'a zuwa ga mafi kyawun hukuncinku; Sallar tana da inganci ko da kuwa daga baya ta yi kadan. A kan abin hawa ko jirgin sama da yake fuskantar alqibla don yin sallar farilla, sai ka fuskanci duk abin da za ka iya, tunda Allah ba Ya kallafa wa rai fiye da karfinsa.",
    ],
    quran: [
      {
        excerpt:
          "Don haka ka juyar da fuskarka wajen masallacin Harami. Kuma duk inda kuka kasance, to, ku juyar da fuskõkinku zuwa gare shi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Idan ka tashi yin sallah, sai ka yi alwala da kyau, sannan ka fuskanci alkibla, ka yi takbir. (daga hadisin mutumin da yayi munanan addu'a).",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Adhan - kiran sallah",
    summary: "Kalaman da suka tara umma, ma'anarsu, da yadda za'a amsa musu.",
    body: [
      "Adhan shine kiran bushara cewa lokacin sallah ya shiga. Kuma sunna ce ta gamayya ga salloli biyar (ba don Idi ko Sallar Jana'iza ba), an yi su ne daga wani wuri mai tsayi don haka a taru a yi ibada. Ana biye da ita, kafin a fara sallah, da kira na biyu, gajere - iqamah.",
      "Idan ka ji adhan, sunna ita ce maimaita kowace magana bayan mu'azhin - sai dai a 'Hayya 'ala as-Sallah' da 'Hayya 'ala al-falah', a maimakon haka ka ce 'La hawla wa la quwwata illa billah' (babu wani karfi ko karfi sai wurin Allah). A cikin Fajr Adhan mai kira ya kara da cewa 'As-salatu khayrun min an-nawm' (addu'a tafi barci).",
      "Bayan kammala azumin, sai a yi salati ga Annabi SAW, sannan a karanta addu’o’in da aka tabbatar da cewa Allah ya ba shi tasha abin yabo (al-wasilah) – Manzon Allah SAW ya yi alkawarin cetonsa ga duk wanda ya faxi. Tsakanin azkar da iqama lokaci ne da ba a karkatar da addu'a, don haka ku yi addu'a cikin yardar rai.",
    ],
    steps: [
      {
        title: "Allahu Akbar (×4)",
        body: "Allah ne Mafi girma daga abin da ya shagaltar da ku.",
      },
      {
        title: "Ashhadu an la ilaha illallah (×2)",
        body: "Ina shaidawa babu abin bautawa da gaskiya sai Allah.",
      },
      {
        title: "Ashhadu anna Muhammadan rasulullah (×2)",
        body: "Ina shaidawa Muhammadu Manzon Allah ne.",
      },
      {
        title: "Hayya 'ala as-Sallah (×2)",
        body: "Ku zo sallah. Amsa da: La hawla wa la quwwata illa billah.",
      },
      {
        title: "Hayya 'ala al-falah (×2)",
        body: "Ku zo ga nasara. Amsa da: La hawla wa la quwwata illa billah.",
      },
      {
        title: "Allahu Akbar (×2)",
        body: "Allah shi ne mafi girma.",
      },
      {
        title: "La ilaha illallah",
        body: "Bãbu abin bautãwa fãce Allah, kiran yã kasance a kan kalmar da aka buɗa masa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Duk wanda ya ce idan ya ji kira, ‘Ya Allah Ubangijin wannan cikakkiyar kira da addu’a tabbatacciya, Ka ba wa Muhammadu wasila da kyawawan halaye…’ – cetona zai kasance gareshi ranar kiyama. (Jabir)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sallah mataki-mataki",
    summary: "Cikakkun jerin raka'a - kowace magana da aka karanta, tare da hukuncinta.",
    body: [
      "Kowace sallah ana gina ta ne daga raka’a daya mai maimaitawa – raka’a: ka tsaya ka karanta, ruku’u, ka tashi, kayi sujjada sau biyu, (a karshen sallah) ka zauna kayi tashahud kayi sallama. Koyi raka'a daya da kyau kuma zaka iya yin kowace sallah, domin tsawan addu'o'in sai a maimaita wannan raka'a. Matakan da ke ƙasa suna ba da kowane aiki a cikin tsari, ainihin kalmomin da za a faɗa cikin harshen Larabci tare da ma'anarsu, da kuma ɗan ƙaramin alamar da ke nuna ko aikin ginshiƙi ne, aikin da ake buƙata, ko nasiha.",
      "Malamai sun karkasa ayyukan Sallah zuwa matakai uku. Fard (ginshiƙi / rukn) yana da mahimmanci: barinta - ko da bisa kuskure - kuma sallar, ko waccan raka'a, ba ta da inganci har sai an yi ta. Wajibi (aikin da ake bukata) wajibi ne, amma idan ka manta daya sai ka gyara sallah da sujudar mantuwa (sujud as-sahw) maimakon maimaita ta. An so sunnah da lada, kuma sallah ta cika kuma tana inganta ba tare da ita ba. Inda makarantun fiqhu suka sanya wani aiki a cikin wani nau'i na daban, shawarwarin sun lura da shi - wannan iyaka mai ninki uku ita kanta ɗaya daga cikin fitattun wuraren banbance na ilimi.",
      "Gabaɗaya, ƙimar da ba za a taɓa rasa ba ita ce tuma'ninah - nutsuwa: daidaitawa cikin kowane matsayi, tare da gaɓoɓi a hutawa, kafin ci gaba. Manzon Allah SAW ya aiki wani mutum da ya yi gaggawar addu’a ya dawo ya sake yin sallah sau uku, ya ce, ‘Ka koma ka yi sallah, domin ba ka yi sallah ba,’ sannan ya koya masa ya natsu a kowane matsayi. Matsa tsakanin tsayuwa tare da takbir 'Allahu Akbar', kuma ka lura da wurin yin sujada.",
      "Raka'a nawa, da inda kuke: Sallar raka'a biyu (Fajr, da Juma'a) tana da zama guda - tashahud na ƙarshe bayan raka'a ta biyu - sannan sallama. Sallar raka'a uku (Maghrib) da sallar raka'a hudu (Dhuhr, Asr, Isha) suna zama na farko, gajeriyar tashahud bayan raka'a ta biyu, sannan a tsaya ga sauran raka'o'i - karanta fatiha kawai a cikinsu, ba tare da karin sura ba - sannan a sake zama don tashahhud na karshe.",
      "A daga murya ko shiru: fatiha da surah ana karanta su a fili (jahri) a cikin Fajr, Juma'a, da raka'a biyu na farkon Maghrib da isha; ana karanta su shiru (sirri) a cikin Zuhr da La'asar, a raka'a ta uku na Maghrib, da raka'a uku da hudu na isha'i. Duk sauran jumlolin sallah – tasbihi na ruku’u da sujuda, da tashahud, da sauransu – sai a natse. Mai sallah shi kadai yana iya karantawa a cikin sautin sallah ko ya rage ta; mai bin bayan liman yana saurare ne kawai yayin da liman ke karantawa da babbar murya.",
      "Wasu kari na cikin addu'o'i ko lokuta na musamman. A cikin sallar witiri da yawa suna karanta Qunut a raka'a ta ƙarshe - suna ɗaga hannuwa don neman shiriya da kariya ( sanannen lafazin yana farawa 'Allahumma-hdini fiman hadayt…'). A lokacin wahala ana iya kara Qunut an-Nazila a cikin sallolin farilla, kuma makarantu sun yi sabani akan Qunut a tsaye a Fajr. Idan ka shiga jam’i a makare (masbuq), duk abin da ka kama da liman yana da kirga, kuma ka rama raka’o’in da ka rasa bayan sallamarsa. Kuma idan kun ƙara ko jefa wani abu bisa kuskure, duba jagorar sujud as-sahw.",
    ],
    steps: [
      {
        title: "1. Niyya & Tsayuwa (niyyah & qiyam)",
        body: "Ku fuskanci alƙibla kuma ku miƙe tsaye- tsaye ginshiƙi ne na kowace salla ta farilla ga wanda yake da iko. Ka sanya a cikin zuciya wacce takamaiman addu'a za ka yi; niyya nufin ciki ne, ba jumlar magana ba.",
        tip: "Ka gyara idanunka akan wurin sujuda ka ajiye su a wurin. Duk wanda ba zai iya tsayawa da gaske ba, ya yi addu'a a zaune, sa'an nan ya yi karya, ba a sauke sallar da kanta.",
      },
      {
        title: "2. Bude takbir (Takbirat al-Ihram).",
        body: "Ka ɗaga hannunka zuwa kafadu ko kunun kunne sannan ka faɗi takbir, sannan ka sanya hannun dama akan hagu akan ƙirji. Da wannan ne ake fara sallah, kuma yanzu an hana magana da motsi na yau da kullun har sai an yi sallama.",
        translation: "Allah shi ne mafi girma.",
        tip: "Ɗaga hannu (raf'ul-yadayn) da takbir sunnah ce tabbatacciya ba ginshiƙi ba.",
      },
      {
        title: "3. Addu'a (Du'a al-Istiftah)",
        body: "Karanta gajeriyar addu'ar budewa cikin nutsuwa don daidaita zuciya a gaban fadin Allah. An ba da rahoton sahihan kalmomi da dama; wannan yana daya daga cikin mafi yawan.",
        translation:
          "Tsarki ya tabbata a gare Ka, Ya Allah, da godiya. Albarka tā tabbata ga sunanka, kuma ɗaukaka ta ɗaukaka. Babu abin bautawa face Kai.",
      },
      {
        title: "4. Ta'awwudh & Basmalah",
        body: "Ku nemi tsarin Allah daga Shaidan, sannan ku fara da Basmalah, kafin Fatiha. Duka a natse ake yin su, ko da a cikin sautin sallah.",
        translation:
          "Ina neman tsarin Allah daga Shaidan La'ananne. Da sunan Allah, Mai rahama, Mai jin kai.",
      },
      {
        title: "5. Karanta Fatiha",
        body: "Karanta Buɗe Littafin a cikin kowace raka'a - 'Babu addu'a ga wanda bai karanta Buɗe Littafin ba. Limami da mai bauta shi kadai suna karanta ta a cikin sautin addu'a; in ba haka ba sai a yi shiru.",
        translation:
          "Da sunan Allah, Mai rahama, Mai jin kai. Godiya ta tabbata ga Allah Ubangijin talikai, Mai rahama, Mai jin kai, Mamallakin ranar sakamako. Kai ne muke bauta wa, kuma Kai muke neman taimako. Ka shiryar da mu zuwa ga tafarki madaidaici, tafarkin waɗanda Ka yi wa ni'ima, ba waɗanda suka yi tsiwirwirinsu ba, kuma ba waɗanda suka yi tsirfanci ba.",
        tip: "Sai kace ameen bayansa (a cikin sautin sallah). Ajin Hanafiyya suna karanta wani Alqur'ani a matsayin ginshiƙi da fatiha musamman a matsayin wajibi; mafi rinjaye suna riko da fatiha ita kanta ita ce ginshiqin kowace raka'ah.",
      },
      {
        title: "6. Karanta surah ko wasu ayoyi",
        body: "A cikin raka’o’in farko guda biyu kawai, sai a bi fatiha da gajeriyar sura ko ayoyi kadan – misali Suratul Ikhlas (‘Qul huwa Allahu ahad…’). A raka'a ta uku da ta hudu sai a karanta fatiha ita kadai.",
        tip: "Nasiha ga mai ibada da liman; mabiyi yana saurare. Hanafiyya suna ganin cewa kara sura a raka'a biyun farko wajibi ne.",
      },
      {
        title: "7. Ruku'u",
        body: "Ka ce Allahu Akbar, ka yi ruku'u da lebur, mizani na baya, hannayensu suna kame gwiwoyi, ka yi tasbihi sau uku ko fiye, ba tare da gaggawa ba.",
        translation: "Tsarki ya tabbata ga Ubangijina, Mabuwãyi.",
        tip: "Bakan da kanta, wanda yake riƙe da shit, ita ce ginshiƙi; tasbihin da ake karantawa a cikinta sunna ne (wajib a wasu makarantu).",
      },
      {
        title: "8. Tashi daga ruku (i'tidal)",
        body: "Tashi cikakke - liman kuma mai bauta shi kadai yana cewa tasmi'u, da duk wanda yake cewa tahmid - kuma ku tsaya gaba daya kafin saukowa.",
        translation:
          "Kuma Allah yana jin wanda ya gode masa. Ya Ubangijinmu, Gõdiya ta tabbata a gare Ka.",
        tip: "Tsayuwa a tsaye a cikin kwanciyar hankali ginshiƙi ne, kada ku nutsu a cikin sujuda har sai kun zauna a nan.",
      },
      {
        title: "9. Sujuda.",
        body: "Ka ce Allahu Akbar, ka yi sujjada a kan kasusuwa bakwai - goshi tare da hanci, da tafin hannu biyu, da gwiwoyi biyu, da yatsun qafafu biyu - suna yin tasbihi sau uku ko sama da haka. Wannan shine mafi kusanci ga Allah, don haka ku zubar da addu'a bayan tasbihi.",
        translation: "Tsarki ya tabbata ga Ubangijina, Maɗaukaki.",
        tip: "Ci gaba da ɗora hannuwan gaba daga ƙasa kuma daga gefe, da ciki daga cinya.",
      },
      {
        title: "10. Zama tsakanin sujjada guda biyu (jalsah).",
        body: "Ka tashi daga farkon sujuda kana cewa Allahu Akbar, ka zauna cikin natsuwa da misaltuwa, ka nemi gafarar Ubangijinka kafin ka sake sujjada.",
        translation: "Ubangijina Ka gafarta mini.",
        tip: "Zauna har sai kun sami kwanciyar hankali - wannan ɗan gajeren zama, tare da natsuwa, ginshiƙi ne a kansa.",
      },
      {
        title: "11. Sujjada ta biyu",
        body: "Ka ce Allahu Akbar, ka yi sujada a karo na biyu daidai da ta farko, da tasbihi iri daya da nutsuwa. Wannan ya cika raka'a daya cikakkiya.",
        translation: "Tsarki ya tabbata ga Ubangijina, Maɗaukaki.",
      },
      {
        title: "12. Tsaya ga raka'a ta gaba",
        body: "Ka ce Allahu Akbar, ka tashi tsaye, sannan ka sake maimaita daga Fatiha. A raka'a ta uku da ta hudu sai a karanta fatiha kawai ba tare da an kara sura ba.",
        tip: "A cikin sallar raka'a biyu ba za ka sake tsayawa ba bayan raka'a ta biyu - ka zauna don tashahud na karshe.",
      },
      {
        title: "13. Tashahud na farko (a cikin sallah raka'a 3 da 4).",
        body: "Bayan raka'a ta biyu na Magriba, ko Zuhr, La'asar, ko Isha, sai a zauna a karanta At-Tahiyyat, sannan a tsaya ga sauran raka'o'in. Sallar raka'a biyu ba ta da tashahud ta farko.",
        translation:
          "Dukkan gaisuwa da addu'o'i da zance masu tsafta na Allah ne. Amincin Allah ya tabbata a gareka ya Annabi, da rahamar Allah da albarkarSa. Amincin Allah ya tabbata a gare mu da bayin Allah salihai. Ina shaidawa babu abin bautawa da gaskiya sai Allah, kuma ina shaidawa Muhammadu bawanSa ne kuma ManzonSa ne.",
        tip: "Ɗaga yatsan hannun dama a cikin zama. Idan ka manta tashahud na farko kuma ka fara tsayuwa, ka ci gaba da yin sujud as-sahw kafin sallama- kar ka zauna.",
      },
      {
        title: "14. Karshen tashahhud",
        body: "A zama na karshe na kowace sallah, a karanta At-Tahiyyat din da ke sama. Zama na karshe tashahud, da karanta shi, shi ne ginshikin sallah.",
      },
      {
        title: "15. Salati ga Annabi SAW.",
        body: "Bayan kammala At-Tahiyyat, ka yi salati ga Annabi SAW da kalmomin da shi da kansa ya karantar da Sahabbansa.",
        translation:
          "Ya Allah ka yi salati ga Muhammadu da alayen Muhammadu, kamar yadda Ka yi salati ga Ibrahim da alayen Ibrahim; Lalle Kai, Gõdadde ne, Mai girma. Ya Allah ka yi salati ga Muhammadu da alayen Muhammad, kamar yadda ka yi wa Ibrahima da iyalan Ibrahim albarka; Lalle Kai, Gõdadde ne, Mai girma.",
        tip: "Mazhabar Shafi'iyya da Hanbaliyya suna ganin salawati a zama na karshe wajibi ne.",
      },
      {
        title: "16. Addu'a kafin sallama",
        body: "Kafin ka gama, ka nemi tsarin Allah daga fitintinu guda huɗu, sannan ka yi duk abin da kake so, na duniya da na lahira, da Larabci ko harshenka.",
        translation:
          "Ya Allah ina neman tsarinka daga azabar kabari, da azabar wuta, da fitinar rayuwa da ta mutuwa, da sharrin fitintinu na Masihu Qarya (Dajjal).",
      },
      {
        title: "17. Rufe sallama (Taslim)",
        body: "Karshen Sallah da juyar da fuska zuwa dama, sannan hagu, tare da yin sallama a kowane lokaci. Da sallama an gama sallah.",
        translation: "Aminci da rahamar Allah su tabbata a gare ku.",
        tip: "Taslim na farko (a hannun dama) shi ne ginshiƙi; na biyu (a hagu) sunna ce a wasu makarantu.",
      },
    ],
    hadith: [
      {
        excerpt: "Ka yi addu'a kamar yadda ka ga ina addu'a. (Malik bn al-Huwayrith)",
      },
      {
        excerpt:
          "\"Ka koma ka yi sallah, domin ba ka yi sallah ba\" - ya maimaita sau uku - sannan ya koyar da cewa: ka yi takbir, ka karanta abin da za ka iya na Alqur'ani, sannan ka yi ruku'u har ka natsu, ka tashi har sai ka mike, ka yi sujjada har sai ka samu nutsuwa ...",
      },
      {
        excerpt:
          "Babu addu'a ga wanda bai karanta Bukin Littafi ba. (Ubadah bn as-Samit; da kuma Sahih Musulmi 394).",
      },
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Kowane matsayi",
    summary: "Yadda zaka rike jikinka daidai a kowane matsayi na sallah.",
    body: [
      "Kowane matsayi a cikin sallah yana da siffar jiki da Annabi SAW ya nuna kuma an kiyaye Sahabbansa. Koyon tsari mai kyau yana kiyaye addu'ar ku daga kurakurai na zahiri kuma yana taimakawa jiki ya goyi bayan tawali'un zuciya maimakon shagaltuwa daga gare ta.",
      'Kusancin sujjada ya cancanci kulawa ta musamman: Annabi SAW ya ce: "Mafi kusancin bawa ya zo ga Ubangijinsa shi ne lokacin da yake sujada, don haka ku yawaita addu\'a". Sujjadar da aka yi ta natsuwa da ikhlasi tana daga cikin lokuta mafi qarfi a zamanin mumini.',
    ],
    steps: [
      {
        title: "Tsaye (qiyam)",
        body: "Madaidaici, ƙafafu suna kusa da faɗin kafaɗa, daidaita nauyi, duba wurin sujud, hannun dama bisa hagu akan ƙirji.",
      },
      {
        title: "daga hannu (raf'al-yadayn)",
        body: "Dabino suna fuskantar alqibla, suna daidaita kafadu ko kunnuwa - a wurin bude takbir, da (mafi rinjaye) kuma suna shiga da tashi daga ruku.",
      },
      {
        title: "Ruku'u",
        body: "Baya lebur da matakin, kai ba ya dagawa ko faduwa, yatsu sun baje suna rike da gwiwoyi, an rike hannaye daga bangarorin.",
      },
      {
        title: "Sujuda (sujuda)",
        body: "Goshi da hanci a kasa, dabino ya kwanta kusa da kafadu ko kunnuwa, gwiwar hannu sun daga sama kuma daga kasa, gwiwoyi kasa, yatsun kafa sun karkata zuwa alkibla.",
      },
      {
        title: "Zaune (iftirash)",
        body: "Tsakanin sujuda biyu da tashahud ta farko: Zauna akan qafar hagu tana kwance da qafar dama ta miqe, hannaye a kan cinyoyinsu.",
      },
      {
        title: "Zama na karshe (tawarruk)",
        body: "A cikin tashahud na karshe na sallah raka'a 3 ko 4 (sunnah ce ta mazhabar Shafi'iyya da Hanbali): ku tsallake kafar hagu karkashin kafar dama ku zauna a kasa.",
      },
      {
        title: "Juya kai yayi don sallama (taslim)",
        body: "Juya fuska dalla-dalla zuwa dama, sannan zuwa hagu, tare da kalmomin aminci - ƙare addu'a yayin da kuke gaishe da mala'iku a kowace kafaɗa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mafi kusancin bawa zuwa ga Ubangijinsa shi ne idan yana sujada, sai ku yawaita addu'a. (Abu Huraira)",
      },
    ],
    disclaimer:
      "Ƙananan bambance-bambance a wurin sanya hannu, yanayin zama, da ɗaga hannu duk sun samo asali ne daga ingantattun rahotanni; makarantu kowanne yana bin ingantaccen ruwaya. Babu mai bata sallar wani.",
  },
  {
    title: "Kuskuren gama gari",
    summary: "Kurakurai masu raunana addu'a a hankali - da yadda ake gyara kowace.",
    body: [
      "Mafi yawan laifuffuka a cikin addu'a ba zunubai ne na zuciya ba, dabi'u ne na gaggawa da rashin kulawa. Sanya sunayensu shine matakin farko na gyara su; Manzon Allah Sallallahu Alaihi Wasallama da kansa ya gyara sallar Sahabi cikin haquri da kai tsaye, wanda ya koyar da mu cewa waxannan kura-kurai na kowa ne kuma ana iya gyara su.",
      "Kabari yana gaggauwa - yana ta ruku'u da sujuda ba tare da natsuwa ba. Tuma'inah (kwanciyar hankali) shi ne ginshiƙin addu'a ga mafi yawan malamai, don haka addu'ar gaugawa ba ajizi ce kawai ba amma tana iya bata. Yi aiki ta lissafin da ke ƙasa ɗabi'a ɗaya lokaci ɗaya.",
    ],
    steps: [
      {
        title: "Yin addu'a da sauri",
        body: "Da kyar aka dakata a ruku'u ko sujuda. Ki zauna har sai jikinki ya kwanta kuma kina iya yin zikiri akalla sau uku ba tare da gaggawa ba.",
      },
      {
        title: "Wudu bai cika ba",
        body: "Busassun faci akan diddige, idon sawu, gwiwar hannu, ko tsakanin yatsu. Annabi ﷺ ya yi gargadin cewa, 'Kaiton dugadugansa daga wuta.' A wanke a hankali da kyau.",
      },
      {
        title: "Mai lankwasa baya cikin ruku, nutsewa cikin sujuda",
        body: "Ruku'u tare da zagaye baya, ko kwantar da goshi ba tare da hanci ba, ko barin goshin ya kwanta a kasa. Ci gaba da matakin baya da ɗaga gwiwar gwiwar hannu.",
      },
      {
        title: "Yawo idanu da zuciya",
        body: "Kallon kewaye, ko duba waya. Kallon wurin sujuda yayi shiru ko ka cire wayar ka kafin takbir.",
      },
      {
        title: "Gasar gaban liman",
        body: "A cikin jam'i, shiga ruku'u ko sujuda a gaban liman. Bi shi - kada ku riga shi - motsi kawai bayan ya yi.",
      },
      {
        title: "Magana, cin abinci, ko dariya",
        body: "Duk wata magana da niyya, ko ci, ko sha, ko dariyar da ake ji tana karya sallah. Sallah zance ne da Allah kadai.",
      },
      {
        title: "Karatun fatiha bisa kuskure",
        body: "Tsallake kalmomi, ko yin kurakurai masu canza ma'anar. Koyi shi cikakke - dukan addu'a ya dogara da ita.",
      },
    ],
    actions: [
      "Yi Sallah daya a yau rabin gudun da kuka saba kuma ku lura da yanayin daban.",
      "Yi shiru wayar ka ko barinta a wani daki kafin kace takbir ta bude.",
      "Ka tambayi wani mai ilimi ya kalli daya daga cikin addu'o'in ka kuma ya gyara yanayinka.",
    ],
    appLinks: [{}],
  },
  {
    title: "Ayyukan Sunnah",
    summary: "Manzon Allah ﷺ ya kwadaitar da ayyukan da suke qawata sallah da ninka ladan sallah.",
    body: [
      "Bayan ayyukan farilla, Annabi ﷺ ya tsara ayyuka da dama (sunan) a wajen sallah. Ba a buqata su ba, don haka barin mutum baya bata sallah – amma kowanne yana kusantar ku zuwa ga Allah, yana samun lada mai yawa, kuma yana gyara kurakurai a cikin sallolin farilla.",
      "Babban daga cikinsu shi ne sallolin sunna na yau da kullun (sunan rawatib) da ake yi kafin faɗuwa da bayan safiya: biyu kafin Asuba (waɗanda Annabi Sallallahu Alaihi Wasallama ya fifita su a kan duniya baki ɗaya), huɗu kafin sahur da biyu bayan sahur, biyu bayan Magariba, biyu bayan Isha’i – raka’a goma sha biyu wanda ladansa gida ne da aka gina a cikin Aljanna.",
    ],
    actions: [
      "Yi amfani da miswak (siwak) kafin alwala da sallah - Annabi SAW ya kusa wajabta ta.",
      "Yi tafiya zuwa masallaci cikin nutsuwa da wuri - kowane mataki yana ɗaga daraja kuma yana goge zunubi.",
      "Ka kiyaye raka'a goma sha biyu na sunnah rawatib ga wani gida da aka yi alkawari a cikin Aljanna.",
      "Ku shiga masallaci da kafar dama ku fita da hagu, kowa da addu'arsa.",
      "Karanta zakkar da aka kafa bayan kowace sallah - duba Bayan Sallah.",
    ],
    hadith: [
      {
        excerpt:
          "Ba don na dorawa ummata ba, da na umarce su da su rika amfani da siwak kafin kowace sallah. (Abu Huraira, kuma Sahih Musulmi 252).",
      },
      {
        excerpt:
          "Wanda ya sallaci raka'a goma sha biyu na sallar nafila dare da rana, za'a gina masa gida a cikin Aljannah. (Ummu Habiba)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Khushu - gaban zuciya",
    summary: "Manufar dukan tafiya: don yin addu'a kamar kuna ganin Allah.",
    body: [
      "Khushu shine tawali'u, mai da hankali, da sanin cewa kana tsaye a gaban Allah da gaske. Shi ne yake mayar da motsin jiki na sallah zuwa ibada ta hakika. Manzon Allah (SAW) ya siffanta fifiko (ihsan) da cewa: “Ka bauta wa Allah kamar kana ganinsa, domin duk da ba ka ganinsa, to hakika yana ganinka” – kuma babu inda aka fi yin hakan kai tsaye kamar na sallah.",
      "Allah ya budi bayanin muminai masu nasara da shi: “Wadanda suka yi tawali’u a cikin addu’arsu” (23:1-2). Kuma ya yi gargaɗi da kakkausar murya a kan kishiyarta—‘Bone ya tabbata ga masu yin addu’a, amma suka gafala daga addu’arsu,’ tsautawa ga waɗanda jikunansu ke motsawa alhali zukatansu ba su nan.",
      "An gina Khushu, ba a so ba. Koyi ma'anar abin da kuke karantawa don kalmomin su motsa ku. Cire abubuwan shagaltuwa kafin takbir. Sannu a hankali kuma a ba kowane matsayi kwanciyar hankali. Ka yi tunani a kan girman wanda kake magana da shi da gaskiyar cewa wannan addu'ar za ta iya zama ta ƙarshe. Ku yi kowace sallah a matsayin sallar bankwana, kamar yadda Annabi SAW ya shawarce shi.",
      "Kada ka karaya da tunani mai yawo - har Sahabbai sun yi ta fama da su. Gwagwarmayar dawo da hankalinku akai-akai, ita kanta wani bangare ne na ibada. Khushu yana girma a duk tsawon rayuwarsa; daidaito shine abin da ke raya shi.",
    ],
    quran: [
      {
        excerpt:
          "Lalle ne mũminai, waɗanda suka yi tawali'u a cikin addu'arsu, sun yi babban rabo.",
      },
      {
        excerpt: "To, bone yã tabbata ga mãsu salla, ga mãsu shagala daga sallarsu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ihsani shi ne ka bauta wa Allah kamar kana ganinsa, domin duk da ba ka ganinsa, to lalle shi yana ganinka. (Hadisin Jibril, Umar)",
      },
    ],
    actions: [
      "Karanta ma'anar jumla ɗaya daga Kalmomin Sallah kafin kowace addu'a a wannan makon.",
      "Dakata na daƙiƙa uku marasa gaggawa a kowane matsayi kafin ci gaba.",
      "Lura da matakin mayar da hankali kan ku a cikin jarida bayan yin Sallah kuma ku kalli canjin yanayin.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Pillars & masu warwarewa",
    summary: "Abin da addu'ar ba za ta wanzu ba sai da abin da ya soke ta.",
    body: [
      "Ayyukan Sallah sun shiga sahu uku. Pillars (arkan) sassa ne masu muhimmanci: barin mutum da gangan yana bata sallah, kuma barin mantuwa dole ne a gyara ta ta hanyar komawa gare ta. Ana bukatar ayyukan farilla (wajibat), amma idan an manta ana gyara su da sujudar mantuwa (sujud al-sahw). Sunnah tana aiki cikakke kuma tana ƙawata sallah, barinsu ba ya da wani azaba.",
      "Sanin wannan matsayi yana kare ku daga matsayi biyu: ɗaukar ƙaramin tsallakewa a matsayin ɓarna, ko ɗaukar ginshiƙi na gaske azaman zaɓi. Lokacin da ake shakkar wani ginshiƙi, salla ba ta inganta har sai ta cika.",
      "Na dabam, wasu abubuwa suna warware addu'a kai tsaye a lokacin da suke faruwa - saboda sun saba wa yanayin sallar ita kanta. Wasu kuma suna warware alwala, wanda hakan ya }are sallah. Ka kiyayi duka biyun don kada ka yi sallah a cikin bata ba tare da ka sani ba.",
    ],
    steps: [
      {
        title: "Pillars (arkan)",
        body: "Tsaye idan aka samu damar yin takbir, da karatun fatiha, da ruku'u, da tashi daga gare ta, da sujada guda biyu, da zama a tsakaninsu, da zama na karshe, da tashahudu, da sallama, da tumanin kowani, da kiyaye tsari mai kyau.",
      },
      {
        title: "Ayyukan wajibai (wajibat)",
        body: "Kamar sauran takbirai, da lafuzzan zikiri a ruku'u da sujudi, da tashahud na farko - wanda sujud al-sahw ya gyara idan an manta (a cikin filla-filla na Hanbali; mazhabobi sun bambanta).",
      },
      {
        title: "Masu warware wudu",
        body: "Duk wani abu da ya fita gaba ko baya, barci mai zurfi, rashin hankali - da kuma, wasu malamai, suna taɓa al'aura kai tsaye. Kowanne daga cikin wadannan yana idar da sallah.",
      },
      {
        title: "Masu warware sallar ita kanta",
        body: "Maganar niyya, ci ko sha da gangan, yawan motsin da ba dole ba, da yawan dariya, da karkatar da ƙirji daga alƙibla da ganganci, da fallasa Awrah.",
      },
    ],
    appLinks: [{}],
    disclaimer:
      "Mazhabobi hudu sun rarraba wasu ayyuka daban-daban - misali shin tashahud na farko wajib ne ko sunna, ko kuma ainihin jerin abubuwan da ake buqatar sujud al-sahw. Koyi cikakken bayanin makarantarku daga ƙwararren malami.",
  },
  {
    title: "Sujud al-Sahw - gyara kurakurai",
    summary: "Sujjadar mantuwa mai gyara tana zamewa acikin sallah.",
    body: [
      "Babu wanda ya tsira daga mantuwa a cikin addu'a - har ma Annabi SAW ya manta, sannan ya koyar da cewa, 'Ni mutum ne kawai kamar ku; Na manta kamar yadda kuka manta, don haka idan na manta, ku tuna da ni.' Daga nasa misali ya zo da wani ginannen magani: ƙarin sujuda guda biyu, wanda ake kira sujud al-sahw (sujjadar mantuwa), waɗanda suke yin ƙananan kurakurai don kada a sake yin addu'a.",
      "Ana kiransa a cikin faffadan yanayi guda uku: kari (yin karin raka'a ko matsayi bisa kuskure), rashi (barin farilla kamar tashahud na farko), ko shakka (kasancewar raka'a nawa kuka yi). Ba a buqatar barin sunnah, ko ga kuskuren ganganci – waxannan suna da nasu hukunce-hukuncen.",
      "Idan kun kasance cikin shakka na gaskiya, manufar shiriya ita ce: ku jefar da shakka, ku yi gini a kan abin da kuke yaqini da shi (karamin adadi), sannan ku cika salla, sannan ku yi sujjada guda biyu. Wannan yana juyar da rudani zuwa addu'a tabbatacciya, maimakon zato mai damuwa.",
      "A aikace: kayi sujuda guda biyu daidai da sujudarka ta al'ada, tare da takbir gaba da baya, sannan kayi sallama. Malamai sun yi sabani a kan ko sun zo gabanin Salla ko bayan Salla, bisa la’akari da nau’in kuskure – dukkansu an ruwaito su ingantacce, don haka ko dai karbabbe ne, kuma ba ya bata Sallah.",
    ],
    hadith: [
      {
        excerpt:
          "Idan dayanku bai tabbata a cikin sallarsa ba, kuma bai san yawan sallarsa ba – uku ko hudu – to ya bar shakka, ya yi gini a kan abin da yake da yakini a kansa, sannan ya yi sujjada sau biyu kafin sallama. (Abu Sa'id al-Khudri)",
      },
      {
        excerpt:
          "Idan ɗayanku ya yi shakka a cikin sallarsa, to ya nemi abin da yake daidai kuma ya cika a kanta, sa'an nan kuma ya yi sallama kuma ya yi sujada sau biyu. (Ibn Mas'ud; da kuma Sahihu Musulmi 572).",
      },
    ],
    actions: [
      "Ka haddace ƙa'idar don shakka: gina kan ƙaramin lamba, gama, sannan ku yi sujada sau biyu.",
      "Idan ka fahimci tsakiyar sallar ka bar tashahud na farko, ka ci gaba da yin sujud al-sahw a karshen.",
    ],
    appLinks: [{}],
    disclaimer:
      "Sujuda biyun sun faxi gabanin sallama ko bayan sallama ya danganta da kuskure, kuma mazhabobi sun bambanta. Dukansu daga sunna suke; kar ka bari rashin tabbas a nan ya hana ka yin addu'a.",
  },
  {
    title: "Nau'in sallah",
    summary: "Fard, sunnah, witri, da salloli na son rai masu wadatar da ranar mumini.",
    body: [
      "Addu'o'in ana yin su ne bisa wajibci. Salloli biyar na farilla ne – farilla mai tsauri akan kowane musulmi mai hisabi. A wajensu da wajensu akwai yalwataccen duniya na addu’o’in son rai da Manzon Allah Sallallahu Alaihi Wasallama ke kusantar Allah da ita, kuma ta wannan hanyar mu ma za mu iya.",
      'Sallar son rai tana da dalilai guda biyu: ayyuka ne soyuwa da suke daukaka darajar mumini - Allah Ya ce game da karin ibada, "Bawana yana kusantar Ni da ayyukan sa kai har sai na so shi" - kuma suna gyara sallolin farilla, tunda duk wata nakasu da ke cikin fardi tana cika ne daga sallolin nafila da mutum ya yi a ranar kiyama.',
    ],
    steps: [
      {
        title: "Farin rana guda biyar",
        body: "Fajr, Dhuhr, Asr, Maghrib, Isha - ginshiƙi na wajibi, wanda ba a taɓa barinsa ba.",
      },
      {
        title: "Sunnah rawatib",
        body: "Raka'o'in sunna da aka saba yi kafin a yi farida da bayan safiya - goma sha biyu kullum suna samun gida a cikin Aljanna.",
      },
      {
        title: "Witr",
        body: "Sallah mara adadi bayan isha'i, hatimin sallar dare - sunnah mu'akkadah ga rinjaye, da wajibci a mazhabar Hanafiyya.",
      },
      {
        title: "Tahajjud (qiyamul-laili)",
        body: "Sallar dare a cikin ukun karshe na dare - mafi kyawun addu'a na son rai, da dabi'ar salihai.",
      },
      {
        title: "Duha",
        body: "Sallar tsakiyar safiya (raka'a 2 – 8) - Sadaka ce da ake wa kowane gabobi na jiki kowace rana.",
      },
      {
        title: "Tarawih",
        body: "Sallar dare na jam'i na Ramadan - rayar da dararen watan mai albarka.",
      },
      {
        title: "Idi biyu",
        body: "Raka'a biyu na Idin Al-Fitr da Idin Al-Adha, sai kuma hudubar.",
      },
      {
        title: "Istikhara",
        body: "Sallar raka'a biyu tana neman tsarin Allah kafin yanke hukunci.",
      },
      {
        title: "Janazah",
        body: "Sallar jana'iza - wajibcin gamayya (fard kifayah) da ake yi a tsaye, ba tare da ruku'u ko sujuda ba.",
      },
    ],
    hadith: [
      {
        excerpt: "Mafificiyar sallah bayan sallar farilla ita ce sallar dare. (Abu Huraira)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Juma'ah - sallar Juma'a",
    summary: "Wajabcin mako-mako wanda yake tara al'umma da maye gurbin Zuhur ranar Juma'a.",
    body: [
      "Juma'a ita ce sallar jam'i da ake yi bayan la'asar kowace Juma'a, kuma farilla ce ta musamman, wanda aka yi umarni da sunansa a cikin Alkur'ani: 'Idan aka yi kiran salla a ranar Juma'a, ku gaggauta zuwa ga ambaton Allah, kuma ku bar ciniki.' Ta kunshi huduba (khutbah) kashi biyu sai kuma raka'a biyu ana yin addu'a a bayan liman, kuma tana daukar matsayin Zuhur ga wadanda suka halarta.",
      "Wajibi ne (fard'ayn) na kanshi akan kowane musulmi, baligi, mazaunin gida, mai iko. Manzon Allah ﷺ ya ayyana cewa ya zama wajibi akan kowane musulmi a cikin jama'a, sai dai guda hudu: bawa, ko mace, ko yaro, ko mara lafiya. Mata, matafiya, da marasa lafiya ana ba su uzuri, su yi sallar Zuhur, ko da yake za su iya halarta idan sun so.",
      "Rashin kula da ita babban haxari ne: Manzon Allah Sallallahu Alaihi Wasallama ya yi gargaxi cewa duk wanda ya bar Juma’a uku bisa gafala, Allah ya rufe zuciyarsa. Amma duk da haka ladanta suna da yawa - Juma'a ita ce mafificin ranar da rana ta fito, kuma tana da sa'a da ake amsa addu'a a cikinta.",
      "Ka yi tanadi domin ta kamar yadda Annabi SAW ya yi: Ka yi zage-zage, ka sanya mafi kyawun tufafinka, ka shafa kamshi, ka tafi da wuri, ka saurari khutbah a nutsu (maganin banza a cikinta yana bata lada). Karanta Suratul Kahfi a ranar Juma'a yana kawo haske tsakanin juma'a biyu.",
    ],
    quran: [
      {
        excerpt:
          "Ya ku waxanda suka yi imani idan aka yi kiran sallah ranar juma’a, ku yi gaggawar ambaton Allah, kuma ku bar ciniki. Wancan ne mafi alhẽri a gare ku, idan kun kasance kuna sani.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sallar juma'a a cikin jam'i farilla ce akan kowane musulmi, face guda hudu: bawa, ko mace, ko yaro, ko mara lafiya. (Tariq ibn Shihab)",
      },
      {
        excerpt:
          "Wanda ya bar sallar juma'a uku a cikin gafala, Allah zai sanya hatimi a kan zuciyarsa. (Abu al-Ja'd; da Abu Dawud 1052, at-Tirmizi 500).",
      },
      {
        excerpt: "Ghusl ranar juma'a tana wajaba akan duk wanda ya balaga. (Abu Sa'id al-Khudri)",
      },
    ],
    actions: [
      "Yi ghusl, sanya tufafi masu tsabta da ƙamshi, kuma ku isa da wuri - farkon masu halarta suna samun lada mafi girma.",
      "Karanta Suratul Kahf wani lokaci a ranar Juma'a don haske tsakanin Juma'a biyu.",
      "Yi shiru da lura sosai yayin khutbah; ajiye wayar.",
    ],
    appLinks: [{}],
    disclaimer:
      "Mafi qarancin adadin masu halarta, da ghusl wajibi ne ko kuma sunna ce mai qarfi, maki ne da suka bambanta a ilimi. Bi ingantaccen aikin al'ummar ku.",
  },
  {
    title: "Addu'ar jama'a",
    summary: "Yin addu'a a bayan liman - lada ya ninka sau ashirin da bakwai.",
    body: [
      "Yin salloli biyar a cikin jam’i (jama’a) yana da matuqar muhimmanci musamman ga maza, kuma alama ce ta al’ummar musulmi masu rai. Annabi ﷺ ya koyar da cewa sallah a cikin jam'i ta fi lada sau ashirin da bakwai fiye da sallar da aka yi ita kadai - mai yawa babu wani kokari na mutum daya.",
      "Jama'a na tsaye a tsaye, sahu-sahu babu tazara, kafada da kafada, suna bin liman daidai: kuna fara kowane motsi ne bayan ya yi, ba a gabansa ba, kuma ba a lokaci guda ba. Mik'ewa shi kansa sahu yana cikin kammala sallah.",
      "Idan kun zo bayan liman ya fara (wanda ake kira da marigayi masbuq), nan da nan ku shiga duk wani matsayi da kuka same shi - har yanzu wannan sashin yana da alaƙa da yin addu'a tare da shi. Idan yayi sallama ta karshe sai ka tsaya ka cika raka'oin da ka rasa da kanka, sannan ka gama.",
      "Jama’a ba a masallaci kadai ba: mutane biyu da suke yin sallah tare suna yin jam’a, don haka uba da dansa, ko abokan tafiya biyu, zai iya samun lada. Mata suna iya yin addu'a a cikin jam'i kuma su halarci masallacin da ya dace, kodayake sallarsu a gida tana da lada mai yawa.",
    ],
    hadith: [
      {
        excerpt:
          "Sallar cikin jam'i ta fi falalar darajoji ashirin da bakwai fiye da sallar da aka yi ita kadai. (Ibn Umar; Sahih Musulmi 650).",
      },
    ],
    quran: [
      {
        excerpt:
          "Kuma ku tsayar da salla, kuma ku ba da zakka, kuma ku yi ruku'u tare da masu ruku'i.",
      },
    ],
    actions: [
      "Yi addu'a aƙalla sallah ɗaya a cikin masallaci yau, ko tara dangin ku a jere a gida.",
      "Koyi abin da za ku yi a matsayin mai zuwa: shiga nan take, sannan ku cika raka'o'in da kuka rasa bayan sallamar liman.",
    ],
  },
  {
    title: "Sallolin da aka rasa (qada).",
    summary: "Gyara abin da aka rasa - ƙofar rahamar Allah a buɗe take.",
    body: [
      'Idan an rasa sallar farida - ta hanyar yin barci, mantuwa, ko (Allah Ya kiyaye mu) gafala - wajibi ba ya gushewa kawai. Wajibi ne a gyara ta (qada), kuma Annabi (SAW) ya fayyace hukunce-hukunce: "Duk wanda ya manta wata sallah ko ya kwana a cikinta, to kaffararta ya sallace ta idan ya tuna". Babu wata fansa a gare ta sai addu\'a.',
      "Ana yin sallar gyaran fuska kamar yadda aka yi ta asali: Za a yi Zuhur raka'a hudu da ba ta yi ba kamar raka'a hudu ko da kuwa da daddare ne ko a cikin tafiya. Wanda ya bar sallah saboda uzuri na gaskiya (kamar barci mai nauyi) ba ya da wani laifi ga jinkirtawa. wanda ya yashe su da gangan dole ne ya sanya su tare da tuba na gaskiya, da gaggawa.",
      "Malamai suna kwadaitar da rama sallolin da aka rasa nan da nan kuma a cikin tsari, ba tare da bari su taru ba - domin nauyin yana kara nauyi da lokaci da jinkiri. Idan an rasa adadi mai yawa tsawon shekaru, tuntuɓi shi tare da ingantaccen shirin yau da kullun maimakon yanke ƙauna; Kofar Allah a bude take.",
    ],
    hadith: [
      {
        excerpt:
          "Wanda ya manta wata sallah ko ya kwana da ita, kaffararta shine ya sallaceta idan ya tuna. (Anas; da Sahih Musulmi 684).",
      },
    ],
    actions: [
      "Yi kiyasin gaskiya adadin addu'o'in da kuke bi kuma ku kafa manufa ta zahiri ta yau da kullun.",
      "A hada kowace sallar farilla da yin gyaran jiki guda daya har sai bayan ya bace.",
      "Kada ku yi jinkirin addu'ar da aka yi a halin yanzu don gyara tsohuwar - kiyaye sallolin yau akan lokaci.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Bayan sallah",
    summary: "Azahar da addu'o'in da suke rufe ladan kowace sallah.",
    body: [
      "Annabi ﷺ bai tashi daga sallah ba kwatsam. Ya kasance yana zaune yana neman gafarar Allah da ambaton Allah – kuma ya koyar da cewa lokacin da ake yin sallar farilla yana daga cikin lokutan da ake amsa addu’a cikin gaggawa. Barin nan take ya rasa mafi girman ’ya’yan sallah.",
      "Kafaffen tsarin bayan sallah mai sauki ne kuma mai nauyi: ka ce 'Astaghfirullah' sau uku; sai lafazin tauhidi da yabo; sannan 'SubhanAllah', 'Alhamdulillah', da 'Allahu Akbar' sau talatin da uku kowanne, suna hatimi na dari da 'La ilaha illallah...' - duk wanda ya aikata haka, an gafarta masa zunubansa, alhali kuwa sun kasance kamar kumfar teku.",
      "Karanta ayatul Kursiyyu bayan kowace sallar farilla tana kawar da mutuwa kawai daga tsakanin mutum da Aljanna, kamar yadda Annabi SAW ya yi alkawari. A bi shi da Qulsirai guda uku (Al-ikhlas, Al-Falaq, An-Nas), sannan a kara zazzafar azkar bayan Asubahi da la'asar bayan La'asar ko Magrib a inda ake nema.",
    ],
    hadith: [
      {
        excerpt:
          "Duk wanda ya yi tasbihi, yabo, kuma ya girmama Allah sau talatin da uku kowanne bayan kowace sallah… kuma ya cika dari da lafazin tauhidi, an gafarta masa zunubansa ko da sun kasance kamar kumfar teku. (Abu Huraira)",
      },
      {
        excerpt:
          "Duk wanda ya karanta ayatul Kursiyyu bayan kowace sallar farilla, babu abin da ke tsakaninsa da shiga Aljanna sai mutuwa. (Abu Umamah; al-Albani grade sahih)",
      },
    ],
    actions: [
      "Ku haddace tasbihi bayan salla (33/33/33 + tahlil) a wannan makon.",
      "Karanta ayatul Kursiyyi da Qulsirai guda uku kafin ka tashi.",
      "A zauna na tsawon minti daya na addu'o'in sirri bayan kowace sallar farida.",
    ],
    appLinks: [{}, {}],
  },
];

export const SALAH_GUIDE_PHRASES_HA: DeepPartial<SalahGuidePhrase>[] = [
  {
    title: "Bayan kammala alwala",
    when: "Nan take bayan an gama alwala, kafin sallah.",
    translation:
      "Ina shaidawa babu abin bautawa da gaskiya sai Allah Shi kadai, ba shi da abokin tarayya, kuma ina shaidawa Muhammadu bawanSa ne kuma ManzonSa ne.",
    meaning:
      "Sabunta shaidar bangaskiya yayin da jikinka ya tsarkaka. Annabi SAW ya yi alkawarin cewa duk wanda ya fadi haka bayan alwala, an bude masa kofofin Aljannah guda takwas ya shiga da duk wanda ya so.",
  },
  {
    title: "Takbirat al-Ihram",
    when: "A farkon sallah, da lokacin tafiya tsakanin mukamai.",
    translation: "Allah shi ne mafi girma.",
    meaning:
      "Anan aka fara addu'a - 'al-ihrami' na nufin ta haramta muku abubuwan duniya (magana, cin abinci, bijirewa). Kun bayyana Allah ne Mafi girma daga duk abin da zai shagaltar da ku, kuma ku shiga gabanSa. Duk takbir da ya biyo baya sai ya sabunta wanda ya sallama.",
  },
  {
    title: "Du'a al-Istiftah (budaddiyar addu'a)",
    when: "Shiru yayi bayan bude takbir, kafin fatiha.",
    translation:
      "Tsarki ya tabbata a gare Ka, Ya Allah, da godiya. Albarka tā tabbata ga sunanka, kuma ɗaukaka ta ɗaukaka. Babu abin bautawa face Kai.",
    meaning:
      "Kuna bude zance ta hanyar yin tasbihi da godewa Allah da tabbatar da kadaitakarSa, da sanyaya zuciya kafin ku karanta fadinSa. Akwai ingantattun addu'o'in buɗewa da yawa - wannan shine ɗayan mafi yawan amfani da su.",
  },
  {
    title: "Suratul Fatiha",
    when: "Tsayuwa a cikin kowace raka'a - ginshiƙi wanda raka'a ba ta da inganci ba tare da shi ba.",
    translation:
      "Da sunan Allah, Mai rahama, Mai jin kai. Godiya ta tabbata ga Allah Ubangijin talikai, Mai rahama, Mai jin kai, Mamallakin ranar sakamako. Kai ne muke bauta wa, kuma Kai muke neman taimako. Ka shiryar da mu zuwa ga tafarki madaidaici, tafarkin waɗanda Ka yi wa ni'ima, ba waɗanda suka yi tsiwirwirinsu ba, kuma ba waɗanda suka yi tsirfanci ba.",
    meaning:
      "'Uwar Littafi': Rabin yabo ga Allah da rabin neman shiriya, tare da 'Kai muke bautawa' ya zama madogara a tsakaninsu. Allah ya ce ya raba wannan sura tsakaninsa da bawansa - yayin da kuke karanta kowane layi sai ya amsa. Annabi SAW yace babu sallah ga wanda bai karanta ta ba.",
  },
  {
    title: "Zikiri in ruku",
    when: "Yayin ruku'u, tare da lebur, ya koma baya.",
    translation: "Tsarki ya tabbata ga Ubangijina, Mabuwãyi.",
    meaning:
      "Ruku'u matsayi ne na girmamawa, don haka kuna ɗaukaka girman Allah - sau uku ko fiye, ba tare da gaggawa ba. Annabi ﷺ ya koyar da cewa a ruku'u muna ɗaukaka Ubangiji, don haka fatan a amsa addu'arka.",
  },
  {
    title: "Tashi daga ruku",
    when: "Tsaye sosai bayan sunkuyar da kai.",
    translation:
      "Kuma Allah yana jin wanda ya gode masa. Ya Ubangijinmu, Gõdiya ta tabbata a gare Ka.",
    meaning:
      "Kun tabbatar da cewa lallai Allah yana jin wanda ya gode masa, sa'an nan kuma ya mayar ma sa dukkan godiya. Annabi s.a.w yace idan liman ya fadi haka sai jama'a suka amsa, duk wanda maganarsa ta zo daidai da mala'iku an gafarta masa zunubansa da suka gabata.",
  },
  {
    title: "Zikiri in sujud",
    when: "A cikin sujada - matsayi mafi kusanci ga Allah.",
    translation: "Tsarki ya tabbata ga Ubangijina, Maɗaukaki.",
    meaning:
      "A mafi ƙasƙanci na zahiri kuna ɗaukaka Maɗaukaki - abin da ke cikin zuciyar ibada. Manzon Allah SAW yace bawa shine mafi kusanci ga Ubangijinsa yayin da yake sujjada, sai ka zuba addu'a anan bayan zikiri.",
  },
  {
    title: "Tsakanin sujuda biyu",
    when: "Zauna cikin nutsuwa tsakanin sujud ta farko da ta biyu na kowace raka'ah.",
    translation: "Ubangijina Ka gafarta mini. Ubangijina Ka gafarta mini.",
    meaning:
      "Istigfari a takaice amma kai tsaye a cikin kowace raka'a - tunatarwa cewa ko da tsakiyar sallar mu muna bukatar gafarar Allah. Zauna har sai kun sami nutsuwa kafin sujjada ta biyu.",
  },
  {
    title: "At-Tahiyyat (Tashahhud)",
    when: "A zaune na tsakiya da zaman karshe na sallah.",
    translation:
      "Dukkan gaisuwa da addu'o'i da zance masu tsafta na Allah ne. Amincin Allah ya tabbata a gareka ya Annabi, da rahamar Allah da albarkarSa. Amincin Allah ya tabbata a gare mu da bayin Allah salihai. Ina shaidawa babu abin bautawa da gaskiya sai Allah, kuma ina shaidawa Muhammadu bawanSa ne kuma ManzonSa ne.",
    meaning:
      "ZUCIYAR ZUCIYA: Ka yi wa Allah Shi kadai, ka yi sallama ga Annabi Sallallahu Alaihi Wasallama da salihai, kuma ka sake bayyana shaidu biyu. Ibn Mas'ud ya koyi shi ne daga Annabi ﷺ kalma da kalma, kamar yadda ake koyon sura.",
  },
  {
    title: "Salawat Ibrahimiyyah",
    when: "A karshe tashahud, bayan At-Tahiyyat.",
    translation:
      "Ya Allah ka yi salati ga Muhammadu da alayen Muhammadu, kamar yadda Ka yi salati ga Ibrahim da alayen Ibrahim; Lalle Kai, Gõdadde ne, Mai girma. Ya Allah ka yi salati ga Muhammadu da alayen Muhammad, kamar yadda ka yi wa Ibrahima da iyalan Ibrahim albarka; Lalle Kai, Gõdadde ne, Mai girma.",
    meaning:
      "Lokacin da Sahabbai suka tambayi yadda za su yi salati a gare shi, Annabi SAW ya koya musu wadannan kalmomi daidai-wasu salawati mafi inganci a cikin Sunnah. Kuna girmama Manzon Allah SAW kamar yadda Allah ya umarce ku, kuna cika sallah da son wanda ya koya muku yin sallah.",
  },
  {
    title: "Neman tsari kafin sallama",
    when: "Bayan kammala tashahud da salawat, daf da idar da sallah.",
    translation:
      "Ya Allah ina neman tsarinka daga azabar kabari, da azabar wuta, da fitinar rayuwa da ta mutuwa, da sharrin fitintinu na Masihu Qarya (Dajjal).",
    meaning:
      "Manzon Allah (SAW) ya yi umarni da cewa bayan tahudawan karshe mutum ya nemi tsari daga wadannan hatsarori guda hudu kafin yin sallama - addu’ar karshe ta addu’a ta shafi rayuwar duniya, da kabari, da wuta, da fitintinu mafi girma a nan gaba.",
  },
  {
    title: "Taslim (sallama)",
    when: "Karshen sallah - juya fuska zuwa dama, sannan zuwa hagu.",
    translation: "Aminci da rahamar Allah su tabbata a gare ku.",
    meaning:
      "Kuna barin salla kamar yadda kuke barin jama'ar masu daraja - tare da gaisuwa ga mala'iku da suke rubuce a kowace kafada da masu yin addu'a a gefenku. Sallama ginshiki ne; da ita ake cika sallah.",
  },
];
