// Somali translation overlay for the Learn Dua content. Mirrors the order of
// its English source in ../learn-dua*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { LearnDuaOccasion, LearnDuaTopic } from "../../types/learn-dua";
import type { DeepPartial } from "./localize";

export const LEARN_DUA_TOPICS_SO: DeepPartial<LearnDuaTopic>[] = [
  {
    title: "Waa maxay dua?",
    summary: "Ducadu waa cibaadada: si toos ah Alle loogu baryayo, iyadoo khushuuc iyo rajo leh.",
    body: [
      "Ducadu (دعاء) waa baryida Alle-- isaga oo laga warsado dheef, dambi dhaaf, hanuun iyo ilaalin, iyo u noqoshadiisa isaga oo u baahan. Ka fogaanshaha camalka yar, Nebigu ﷺ wuxuu ku dhawaaqay, 'Ducadu waa cibaadada', kadibna wuxuu akhriyay amarka Eebbe ee ah 'Igu barya; waan kuu jawaabi doonaa. In la waydiiyo Eebbe lafteedu waa fal tawxiid saafi ah, sababtoo ah waxay qirsan tahay in isaga keliya uu maqlo, leeyahay, oo maamulo dhammaan natiijooyinka.",
      "Ducadu waa laba nooc oo kala ah: Ducada al-masalah, oo Alle wax la waydiisto, iyo ducada al-ibadah, oo lagu caabudo salaada, zikradda, iyo adeecida - cibaado kastaa, nuxur ahaan, waa codsi aamusnaan ah oo la doonayo in laga aqbalo iyo ajarkiisa. Taasi waa sababta ku jihaynta ducada cid ka soo hadhay Alle ay tahay nooc ka mid ah shirkiga: waxay siinaysaa qof kale wixii isaga kaligii leeyahay.",
      "Mu'minku wuxuu ku duceeyaa dhib iyo qaylo, qaylo iyo sirba, isagoo hubaal ah in Eebbe maqlo dhawaaq kasta, oo uusan ka leexin mid daacad ah isagoo fara madhan. Aad buu u dhow yahay oo wuxuu leeyahay, Waxaan ajiibaa dhawaaqa u yeedhaya markuu i baryo.",
      "Jawaabtu waxay qaadanaysaa saddex nooc midkood, oo Nebigu ﷺ baray: Alle ayaa bixiya waxa la waydiiyo; ama uu ceshado oo kaydiyo ajri siman ama ka weyn aakhiro; ama uu ka jeediyo dhib la mid ah. Markaa ma jiro duco daacad ah oo weligeed aan si dhab ah looga jawaabin - mararka qaarkood naxariista ugu weyn waxay ku jirtaa jawaabta aynaan arag.",
    ],
    quran: [
      {
        excerpt: "Eebihiinna wuxuu yidhi i barya. waan kuu jawaabi doonaa.",
      },
      {
        excerpt:
          "Markay ku warsadaan addoomadayda anigu waan dhawahay. Waxa aan ka jawaabaa waciyaha marka uu ii yeedho.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ducadu waa cibaado. - ka dibna wuxuu akhriyey, 'Markaasuu yidhi Eebihiin, i barya; waan kuu jawaabi doonaa. (An-Nucmaan bin Bashiir)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Dhaqanka ducada",
    summary: "Ku bilow ammaan, dir salawaat, u warso si daacad ah, oo waligaa ha quusan.",
    body: [
      "Ducadu waxay leedahay aadaabta (adab) uu Nabigu ﷺ baray oo uu ku dayday, ilaalinteedana waxay keentaa in la aqbalo. Ku biloow inaad Eebbe ku ammaanto magacyadiisa quruxda badan, ka dib salawaat (naxariis) Nabigu korkiisa ha ahaatee - wuxuu baray in ducada 'la hakiyo' ilaa qofka tukanaya uu sameeyo labadaba - ka dibna kaliya soo bandhig codsigaaga.",
      "Alle ugu barya saddex sifo oo gudeed ah: Khushuuc, yaqiinsan inuu ka jawaabi karo, iyo ra'yi wanaagsan oo isaga ah (husn al-zann). Qiblada u wajaho meeshaad awoodo, gacmaha kor u taag, dooro waqtiyada barakeysan, waydiina arrimaha if iyo aakhiro labadaba. Waxaa lagugula talinayaa inaad ku celiso codsiyada muhiimka ah, oo aad dhammayso sidaad u bilawday - ammaan iyo salawat.",
      "Waxaas oo dhan, ha degdegin. Nabigu (scw) waxa uu ka digay in ducada la ajiibo ilaa aanu qofku quusan oo aanu odhan waan wacay oo waan wacay laakiin la igama jawaabin,kadibna iska dhaafo. Ku adkaysiga wax-wayddiinta lafteedu waa cibaado, Eebbena wuxuu jecel yahay addoonka albaabkiisa garaacaya.",
    ],
    hadith: [
      {
        excerpt:
          "Ducada addoonku waxay sii socotaa in loo jawaabo ilaa aanu ku degdegin - isagoo leh, 'Waan ducaystay, laakiin la iima jawaabin.' (Abuu Hureyrah)",
      },
      {
        excerpt:
          "Marka midkiin tukado, ha ku bilaabo ammaanta iyo tasbiixda Eebihiis, dabadeed nabiga (scw) ku salliyo, ka dibna ha weydiisto wuxuu doono. (Fadalah ibnu Cubayd)",
      },
    ],
    actions: [
      "Ku fur duco kasta Alxamdulilaah iyo salawaat nabiga s.c.w.",
      "Allaah ku weydii magacyada ugu habboon baahidaada (tusaale Ya Razzaq arsaaqda, Ya Ghafuur dambi dhaaf).",
      "Ducada ka dhig caado maalmeed - salaad kasta ka dib, sujuud, iyo hurdada ka hor.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shuruudaha ducada la aqbalay",
    summary:
      "Daacadnimo, daqli xalaal ah, iyo dembi ka soo noqoshada waxay furaan albaabbada jawaabta.",
    body: [
      "Marka laga reebo anshaxa, shuruudaha qaarkood waxay si xoog leh u saameeyaan in ducada la aqbalo. Tan ugu horraysa waa ikhlaas - daacadnimada Eebbe oo keliya, iyada oo aan is-tustus iyo u yeedhin cid kale isaga ka soo hadhay. Qalbiga dhabta ah ee ku jira ducada ayaa ka qiimo badan carrabka si farsamaysan u akhriya.",
      'Risqi xalaal ah waa fure awood leh. Nebigu (scw) wuxuu ku tilmaamay nin musaafir ah oo gacmaha kor u taagaya samada isagoo ku qaylinaya "Rabbiyow, Rabbiyow," haddana "cuntadiisu waa xaaraan, cabbitaankiisuna waa xaaraan, dharkiisuna waa xaaraan, oo xaaraan lagu quudiyo - ee sidee loogu jawaabi karaa?" Ilaalinta dakhliga, ka toobadkeenida dembiga, oo aan la waydiisan wax dembi ah ama goynta xidhiidhka qoyska, waxay dhammaan meesha ka saaraysaa caqabadaha u dhexeeya ducada iyo aqbaliddeeda.',
      "Sidaas oo ay tahay, aqbalidduna waa naxariista Alle, ee maaha wax kala iibsi oo aynu gacanta ku hayno. Haddaba mu’minku waxa uu isku darsadaa dadaalkiisa ugu wanaagsan – daacadnimo, nolol xalaal ah, towbad keen – iyo kalsooni hoose, oo marna ma quusto haddii jawaabtu dib u dhacdo. Daciifnimada iyo dembiyadii hore ma aha sabab loo joojiyo weydiinta; Dhammaantood waa sabab loogu noqdo Eebaha Raxmaana.",
    ],
    hadith: [
      {
        excerpt:
          "... cuntadiisu waa xaaraan, cabbitaankiisuna waa xaaraan, dharkiisuna waa xaaraan, oo uu sharcilaawayaal quudanayo, haddaba sidee baa loogu jawaabi karaa? (Abuu Hureyrah)",
      },
      {
        excerpt:
          "Ducada addoonka waa laga jawaabaa ilaa uusan weydiisan wax dembi ah ama goynta xiriirka qoyska. (Abuu Hureyrah)",
      },
    ],
    actions: [
      "Dib u eeg dakhligaaga iyo kharashka ku baxa si sharci ah - waxay si toos ah u saamaynaysaa ducadaada.",
      "ka hor mar ducada dheer adoo istaahila iyo toobad dhab ah.",
      "Weligaa ha odhan ducada si aad u weydiisato waxyeelo, dembi, ama caddaalad darro.",
    ],
  },
  {
    title: "Waqtiyada iyo meelaha ugu fiican ee ducada",
    summary: "Daqiiqado qaar ayaa si gaar ah loogu duceeyay baryada la aqbalay.",
    body: [
      "Iyadoo ducada laga jawaabo wakhti kasta, Nebigu ﷺ wuxuu si gaar ah u soo qaatay waqtiyo gaar ah oo uu sheegayo marka aqbalaada aadka loo rajaynayo. Codsiyadaada kuwan ku xidho intii aad sugi lahayd dhibaato.",
      "Kuwa ugu xoogga badan waxaa ka mid ah: Sadexda habeen ee u dambeeya, markuu Eebbe ku soo dago (sidaas darteed) jannada ugu hoosaysa, kuna dhawaaqo, 'Yaa i waydiisanaya inaan siiyo'; sujuudka salaadda, mawqifka Alle ugu dhow; daqiiqada u dhaxaysa adhan iyo ciqaamada; inta uu qofku sooman yahay, gaar ahaan marka la afurayo; xilliga roobka; iyo saacada ugu danbeysa ee jimcaha ka hor qorrax dhaca, taaso ay jirto saacad aan duco la diidin.",
      "Meelaha barakeysan iyo gobolada waxaa ka mid ah istaagida Carrafo xilliga xajka, in lagu dhex jiro xaramka, iyo ducada musaafurka, waalidka ubadkiisa iyo mid la dulmiyay. U isticmaal kuwan sidii barroosinno go'an si aad nolol baryootan joogto ah u hesho.",
    ],
    hadith: [
      {
        excerpt:
          "Rabbigeenna wuxuu habeen kasta ku soo degaa samada ugu hoosaysa saddexda habeen ee u dambeeya, wuxuuna dhahaa: yaa ii baryaya inaan u jawaabo? Bal yaa i weyddiinaya aan isaga siiyo? (Abuu Hureyrah)",
      },
      {
        excerpt:
          "Addoon waxaa ugu Dhaw Eebihiis isagoo Sujuudsan ee ku Barya Dhexdeeda. (Abuu Hureyrah)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "aroor iyo galabba",
    summary: "Qalcadda maalinlaha ah ee Muslimka - ilaalinta iyo isku xirka maalinta darafkeeda.",
    body: [
      "Adkaarta subaxda iyo maqribka waxay ka mid yihiin xusuusta maalinlaha ah ee ugu xoogga badan Sunnada - qalcadda ruuxiga ah ee rumaysadka ayaa cusbooneysiiya bilawga iyo xidhitaanka maalin kasta. Eebe wuxuu ku amray Mu'miniinta inay ' ku xusaan Eebe xusid badan, ayna u tasbiixsadaan aroor iyo galabba' (33:41-42).",
      "Si joogta ah loo akhriyo, waxay ka ilaaliyaan dhibta iyo xanta shaydaanka, waxayna dib u cusboonaysiiyaan talo saarashada Alle (tawakkul), waxayna ku xidhaan qalbigu inuu ku xidho isaga oo ku jira dhammaan xaaladaha isbedbeddelaya ee maalinta. Laba ka mid ah kuwa ugu muhiimsan ayaa hoos ku qoran; App-ka adhkar ururintiisa waxa uu sido gunti buuxa.",
    ],
    phrases: [
      {
        title: "Sayid al-Istigfaar (madaxa cafiska)",
        when: "Subax iyo galab kasta hal mar",
        translation:
          "Alloow adigaa Rabbigey ah; Adiga mooyee ilaah kale ma jiro. Adigaa i abuuray, aniguna waxaan ahay addoonkaaga, waxaanan xajiya axdigaaga, waanan ballan qaaday intii karaankayga ah. Waxaan kaa magan galay xumaantii aan sameeyay. Waxaan qirayaa Nicmadaada korkayga, waana qirayaa Dambigayga, ee ii dambi dhaaf adiga mooyee, mid dambi dhaafa ma jiro.",
      },
      {
        title: "Xasbiyallahu laa ilaaha illa huwa",
        when: "Toddoba jeer subax kasta iyo galab kasta",
        translation:
          "Alle ayaa igu filan; Ilaah kale ma jiro isaga mooyee. Xaggiisaan talo Saaray, Isagaana Carshiga wayn Eebaha iska leh.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ka dib markii la tooso iyo ka hor hurdada",
    summary: "Ka dhig hadalkaaga ugu horreeya iyo kan dambe ee maalinta xiriir la leh Allaah.",
    body: [
      "Rasuulku ﷺ wuxuu baray xus gaar ah oo loogu talagalay soo jeedka iyo jiifka, si qofka mu’minka ah hadaladiisa miyir-qabka ah ee ugu horreeya maalin kasta ay u noqdaan mahadnaq, kuwa u dambeeyana ay isu dhiibaan. Hurdadu, ayuu baray, waa 'dhimasho yar', iyo soo kicinta sarakicidda yar - sidaas darteed adhkar ayaa wareegga oo dhan u qaabeeyey wacyiga Eebbe.",
      "Akhrintooda si joogto ah waxay dhistaa degganaansho ruuxi ah: joogtaynta mahadnaqa ee soo jeedka iyo in nafta loo dhiibo Eebbe hurdada ka hor. Inta uusan seexan ayuu Nebigu ﷺ si gaar ah ugu boorriyay akhrinta aayaadka al-Kursi, isagoo u ballan qaaday in ilaaliyaha Eebbe uu la joogi doono kan wax akhriya oo uusan shaydaan u soo dhowaan ilaa subaxda.",
    ],
    phrases: [
      {
        title: "Duca ku soo toosay",
        when: "Isla markiiba kacday",
        translation:
          "Mahad dhamaanteed waxay u sugnaatay Eebaha na nooleeyay markuu na dilay ka dib, isagaana u sugnaaday soo bixin.",
      },
      {
        title: "Ducada hurdada ka hor",
        when: "Markaad seexanayso",
        translation: "Magacaaga, Allow waan ku dhimanayaa, waanan noolahay.",
      },
      {
        title: "Aayat al-Kursi hurdada ka hor",
        when: "Hurdada ka hor",
        translation:
          "Eebbana Ilaah kale ma jiro isaga mooyee, waana Eebaha Nool, Eebbahana ah. Hurdo iyo hurdo midna isagay qaban. Eebaa iska leh waxa samooyinka iyo dhulka ku sugan. yaa u shafeeco la jira idankiisa mooyee. Wuxuuna ogyahay waxa hortooda ah iyo waxa gadaashooda ah, kuma koobayaan cilmigiisa waxaan wuxuu doono ahayn. Carshigiisuna wuxuu ku fiday samooyinka iyo dhulka, mana daalin xagiisa. Eebe waa Sarreeye Wayna.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ducada guriga iyo masaajidka",
    summary: "Xusuusnow markaad soo galayso oo aad ka baxayso gurigaaga iyo masjidka.",
    body: [
      "Nebigu ﷺ wuxuu ku lifaaqay ducooyin gaagaaban marinnada maalinlaha ah ee nolosha. In la xuso magaca Alle marka laga baxayo iyo marka guriga la soo galayo waxay keenaysaa ilaalin iyo barako, waxayna ka xidhaa albaabkii Shaydaanka; wuxuu baray in marka uu qofku soo galo xuska Alle uu shaydaanku ku dhaho asxaabtiisa meel aad ku hoydaan ma haysatid.",
      "Masjidku wuxuu leeyahay aadaabta u gaarka ah: la gala lugaha midig adoo waydiisanaya albaabada naxariista, bidixdana ka bax adoo waydiisanaya fadliga Eebe - waa in masaajidku yahay meel naxariis, edbin, iyo khushuuc Eebe agtiisa ah.",
    ],
    phrases: [
      {
        title: "Ducada markaad guriga ka baxayso",
        when: "Markaad guriga ka baxayso",
        translation:
          "Magaca Alle; Allaah ayaan tala saarta; Awood iyo xoogna ma jiro Allaah mooyee.",
      },
      {
        title: "Ducadii masaajidka soo gashay",
        when: "Markaad soo gasho, la soo gal cagta midig",
        translation: "Allahayow ii fur albaabada naxariistaada.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ducadii wax cunid iyo cabbid",
    summary: "Adkar gaaban oo barakaha iyo mahadnaq u keena cunto kasta.",
    body: [
      "Diinta Islaamku waxay u beddeshaa camalka caadiga ah ee cunista cibaadada xusus. Ku bilow 'Bismillah' - taasoo ku martiqaadaysa barakada oo ka ilaalinaysa Shaydaanku inuu cuntada la qaybsado - kuna dhammaato mahad Alle, adoo ku tababara qalbiga mahadnaqa iyo digtoonaanta dhawr jeer maalintii.",
      "Sunnadu xataa waxay ku sixi kartaa hilmaanka: haddii aad illowdo inaad tidhaahdo ‘Bismillah’ bilawga, marka aad xasuusato ku dheh Bismillaahi awwaalahu wa aakhiraahu’",
    ],
    phrases: [
      {
        title: "Ka hor inta aanad cunin",
        when: "Bilowga cuntada",
        translation: "Magaca Alle.",
      },
      {
        title: "Cunista ka dib",
        when: "Markaad dhammayso cuntada",
        translation:
          "Mahad dhamaanteed waxay u sugnaatay Allahii i quudiyay oo igu arzuqeeyay anoon quwad iyo tabar toona lahayn",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ducada agagaarka wuduga iyo ducada",
    summary: "Ducada ka hor iyo ka dib, iyo gudaha salaadda lafteeda.",
    body: [
      "Wudu iyo salaad waa furimaha maalinlaha ah ee ugu wayn ee xuska la aqbalo, markaa sunnuhu waxay ka buuxinayaan duco. Wuxu oo ku dhammaystira marag-kaca iimaanku waxa uu furayaa siddeedda albaab ee Jannada; Salaadda dhexdeeda - sujuudda iyo wax yar ka hor salaadda kama dambaysta ah - waa laba ka mid ah daqiiqadaha ugu badan ee la aqbalo maalinta rumaysadka.",
      "Barashada weedhaha dhabta ah ee daqiiqadahaan waxay u beddeshaa dhaqdhaqaaqyada caado ee wada hadalka miyirka leh ee lala yeesho Allaah.",
    ],
    phrases: [
      {
        title: "Wudu ka dib",
        when: "Isla markiiba ka dib marka la dhammeeyo suufka",
        translation:
          "Waxaan ka marag kacayaa inuusan jirin ilaah kale oo aan Allaah ahayn oo aan la wadaagin, waxaana ka marag kacayaa in Muxammad yahay addoonkiisii ​​iyo rasuulkiisii.",
      },
      {
        title: "Ka hor inta aan la salaamin",
        when: "Tashahuudka u dambeeya, ka hor intaadan dhammaan salaadda",
        translation:
          "Alloow waxaan kaa magan galay cadaabka naarta, cadaabka qabriga, imtixaamaadka nolosha iyo dhimashada, iyo sharka fitnada Masiixa beenta ah (Dajjal).",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ducada adhan iyo iqaamada",
    summary: "Ka jawaab baaqa, Allaah weydiiso saldhigga Nabiga ﷺ, ka bacdina u ducee.",
    body: [
      "Marka la dhaho aadan, sunnuhu waa in lagu celceliyo mu'addinka ka dib, ka dib salawaat Nabiga , ka dibna duco ah oo dhan oo Alla weydiiso Al-Wasiilah - Nebigu ﷺ wuxuu u ballan qaaday shafeecada qofkii sameeya.",
      "Daaqadda u dhaxaysa Adxaanka iyo ictiqaadka waxay ka mid tahay waqtiyada la aqbalayo ee la isku baryo; Nabigu ﷺ wuxuu yidhi ducada la sameeyo markaas lagama jeediyo, ee u adeegso inaad Alle weydiisato baahiyahaaga.",
    ],
    phrases: [
      {
        title: "Ducada ka dib adhan",
        when: "Markay adhan dhamaato",
        translation:
          "Allahayow baaqaas qumman iyo ducada sugan, sii Muxammad al-Wasilah iyo al-Faadilah, oo kor u qaad maqaamkii aad u ballan qaaday ee la mahadiyay.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ducada lagu sameeyo aadanka iyo ictiqaadka lama diido. (Anas bin Maalik; sidoo kale at-Tirmidhi 212).",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Welwel iyo murugo",
    summary: "Qalbiga ku xidh tawakkuul iyo ducada Nabiga ﷺ.",
    body: [
      "Islaamku dhibka ayuu la kulmaa qalab ruuxi ah oo wax ku ool ah: ducada, dhikriga, ducada, iyo ku kalsoonaanta xukunka Alle. Nabiga ﷺ, oo naftiisa la kulmay murugo iyo dhibaato, wuxuu baray ducooyin sax ah oo ku saabsan welwelka (hamm), murugada (hazan), iyo cabsi - erayada qalbiga ka hagaya dhibka xagga kan ka taliya.",
      "Dusyadani ma beddelaan caawimaad raadinta hab sharci ah, oo ay ku jiraan daryeel caafimaad ama xirfadeed marka loo baahdo. Hase yeeshe, waxay xoojiyaan qalbiga si ay ula socdaan hababkaas, iyaga oo xusuusinaya rumaystayaasha in ku filanaanshaha ugu dambeeya uu yahay Allaah kaliya.",
    ],
    phrases: [
      {
        title: "Duca welwelka iyo murugada",
        when: "Cidhiidhi, walaac, ama murugo xad dhaaf ah",
        translation:
          "Alloow waxaan kaa magan galay welwel iyo murugo, karti darro iyo caajisnimo, darxumo iyo fulaynimo, culayska deynta iyo in aan cid kale ka adkaado.",
      },
      {
        title: "Allaah ayaa nagu filan",
        when: "Markaad baqdo ama aad ka adkaato",
        translation: "Alle waa nagu filan yahay, isaga ayaana u kheyr badan.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Xanuun iyo cabsi",
    summary: "Caafimaad ka raadso Alle idinkoo qaadanaya dawaynta xalaasha ah.",
    body: [
      "Sunnadu waxay ku biirtay ducada iyo daawaynta: Nebigu ﷺ wuxuu baray, 'Cudur kasta wuxuu leeyahay dawo, wuxuuna amray in la raadiyo, isagoo sidoo kale ku daawaynaya quluubta iyo jidhka iyada oo loo marayo ruqya - akhrinta Qur'aanka iyo ducooyinka saxda ah ee buka. Mu'minku wuxuu sameeyaa labadaba: wuxuu qaataa dawada oo u jeestay Bogsiiye.",
      "Sababta wax yeelaysay magaca waa muhiim: Alle waa ash-Shaafi, daawayne, daawaduna waa uun macne uu abuuray. Oo weliba qalbigu cabsi aawadeed ayuu xaggiisa ugu soo noqdaa ammaan iyo adayg, Waayo, isaga keliya ayaa ammaana.",
    ],
    phrases: [
      {
        title: "Ducada bogsashada",
        when: "Markaad jirran tahay, ama ku tukanayso qof buka",
        translation:
          "Eebbow, Rabbiyow dadka, dhibka ka saar oo bogsii - adigaa daaweeya; Daawayntaada mooyaane dawo ma jirto, waana daawo aan cudur ka tagin.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Cafis iyo hanuunin",
    summary: "Si joogto ah u waydii cafis, adkaysi, iyo hanuun sax ah.",
    body: [
      "Dambi dhaaf-doonista (istighfar) looma hayo dembiyada waaweyn ka dib - waa laxanka maalinlaha ah ee rumaysadka. Nebigu (scw) oo hore loo danbi dhaafey waxa uu danbi dhaaf waydiistay Alle in ka badan todobaatan jeer maalintii, isaga oo baraya in qalbigu u baahan yahay in si joogto ah loo sawiro.",
      "Hanuunku, sidoo kale, waa baahi joogto ah, ee maaha dhacdo hal mar ah. Xataa kuwa xaqa rumeeyey waxay Eebbe ka baryaan inuu quluubtooda xasiliyo, maxaa yeelay quluubtu way soo jeedsadaan, Eebbana waa llaahay. Rasuulku ﷺ wuxuu si joogto ah ugu duceeyey qalbi ku adag diinta.",
    ],
    phrases: [
      {
        title: "Toobad joogta ah",
        when: "Si isdaba joog ah, maalinta oo dhan",
        translation: "Waxaan danbi dhaaf waydiisanayaa Alle, isagana waan u toobad keenayaa.",
      },
      {
        title: "Duco qalbi saafi ah",
        when: "Marka laga baqayo marin habaabinta ama liidashada",
        translation: "Quluubta rogrog, qalbigayga ku adkee diintaada.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Safarka iyo roobka duas",
    summary: "Ducooyin soo bixid, iyo naxariista roobka da'aya.",
    body: [
      "Socdaalku waa xaalad nuglaansho iyo aqbalaad laxaad leh labadaba - Nebigu ﷺ wuxuu baray in ducada qofka musaafurka ah laga jawaabo, wuxuuna ka baryay in la fuulo gaadhiga oo uu dejiyo oo qirsan awoodda Alle iyo u soo noqoshadiisa.",
      "Roobku waa raxmad ka soo degtay xagga Alle, xilliga uu da’a waa xilli la baryo. Rasuulku ﷺ wuxuu ku salaami jiray roobka duco gaaban isagoo weydiisan jiray in laga faa'iidaysto, ee ma aha dhibaato.",
    ],
    phrases: [
      {
        title: "Duca marka aad safar u baxayso",
        when: "Markaad fuulayso gaadiidkaaga oo aad baxayso",
        translation:
          "Subxaana watacaalaa kan inagu sakhiray, markii aynaan annagu sidaas yeeli karin; Eebahanno xaggiisaan u noqonaynaaye.",
      },
      {
        title: "Ducadu marka roobku da'o",
        when: "Bilowga roobka",
        translation: "Allahayow roob khayr qaba ka dhig.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Bixinta iyo qoyska",
    summary: "Gurigana Alle ka baryo rizqi xalaal ah.",
    body: [
      "Rizqigu (rizq) wuxuu ka ahaaday Eebbe oo keliya; Mu’minku waxa uu xidhaa awrkiisa – shaqaysta iyo kasbashada – ka bacdina waxa uu waydiistaa arsaaqda xalaal ah, barakah waxa uu kasbado, xornimada deynta, iyo ka madax banaanida baahida dadka kale. Nabigu ﷺ wuxuu baray duco aad u qurux badan oo si dhab ah u waydiisa tan.",
      "Guriga, Qur'aanku laftiisu waxa uu barayaa ducada kuwa xaqa ah: in la siiyo xaas iyo carruur ah 'indhaha raaxaynta' iyo in la hoggaamiyo qoys ku xidhan iimaan, duco iyo naxariis.",
    ],
    quran: [
      {
        excerpt:
          "Eebow naga yeel xaasaskeenna iyo faracyadanada indho-sarcaad, naga yeel kuwa toosan madaxdooda.",
      },
    ],
    phrases: [
      {
        title: "Ducada risiq xalaal ah",
        when: "Subaxdii, salaadda ka dib, iyo culays dhaqaale",
        translation:
          "Illahow iiga filna waxaad xalaalaysay waxaad xaaraantinimaysay, fadligaadana igu hodmiye cid aan adiga ahayn uma baahni.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ducadii quraanka",
    summary: "Ducooyinka uu Eebbe laftiisu baray Qur'aanka dhexdiisa.",
    body: [
      "Ducooyinka Qur'aanku waa kelmado Eebe dul dhigay afafka nebiyada iyo kuwa rumaystay, ka dibna inoo dhawray inaan ku celinno - kooban, dhammaystiran, oo aan suurtagal ahayn in la hagaajiyo. Kuwo badana waxay ku bilaabaan 'Rabbana' (Eebbeheen), waxayna ku habboon yihiin xifdinta iyo akhrinta joogtada ah.",
      "Inta u dhaxaysana waxay daboolayaan dhammaan baahiyaha qofka mu’minka ah sida: dambi-dhaafka, hanuunka, samirka, naxariista, qoyska suuban, ilaalinta naarta, iyo liibaanta labada adduun. In lagu tukado kalimada Alle waxay ka mid tahay ducada ugu sugan.",
    ],
    phrases: [
      {
        title: "Ku fiican labada adduun",
        when: "Duco guud, oo ujeedo kasta leh - Nabiga ﷺ ugu badnaan",
        translation: "Eebow na sii adduunyo wanaag, aakhirona wanaag, naga ilaali cadaabka naarta.",
      },
      {
        title: "Ku adkaysiga iimaanka",
        when: "Marka laga baqayo leexashada ama ka dib marka la hago",
        translation:
          "Eebow yeyna quluubtayadu lumin intaad hanuunisay ka dib, nagana sii naxariistaada. illeen adaa wax siin.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ducadii nabiga",
    summary: "Ducooyinka si dhab ah u baray nabi Muxamed ﷺ.",
    body: [
      "Nabiga ﷺ waxaa la siiyay 'hadalka ugu faca weyn' (jawami' al-kalim), baryadiisana waxay ka tarjumaysaa: erayo gaaban, macne ballaaran, iyo isku dheeli tiran oo u dhexeeya baahiyaha if iyo aakhiro. Waxay waydiistaan ​​hanuun, daahirnimo qalbi, caafimaad, cafis, ilaalin, iyo dabeecad wanaagsan.",
      "Mabda' muhiim ah: xaji ducado dhab ah oo si wanaagsan loo caddeeyey oo laga keenay ururin la isku halayn karo, kana fogow faafinta kuwa daciifka ah ama been-abuurka leh ee leh abaal-marin la allifay. Hantida saxda ah ee sunnada ayaa ka badan.",
    ],
    phrases: [
      {
        title: "Ducada afarta ah oo dhamaystiran",
        when: "Duco guud oo maalinle ah",
        translation: "Allahayow waxaan ku waydiisanayaa hanuun, cibaado, dhawrsanaan iyo waafiya",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Dhikar iyo tasbiix",
    summary: "Xusuus gaaban oo miisaan iyo abaal-marin baaxad leh.",
    body: [
      "Dhikar - xuska Alle - waxaa ka mid ah tasbiix (SubhanAllaah), tahmid (Alhamdulillah), tahliil (La ilaha illallah), takbiir (Allaahu Akbar), iyo istighfar. Kuwani waxay ka mid yihiin erayada ugu fudud ee carrabka ku jira haddana kuwa ugu culus Miisaanka, waana kuwa qalbiga nool uu ka difaaco halmaan la'aanta.",
      "Nebigu (scw) wuxuu tilmaamay weedho ‘Carrabka ku fudud, Miisaanka ku culus, Eebaha Raxmaana u jecel yahay’, wuxuuna baray in qofkii yidhaahda ‘SubhanAllahi wa bihamdih’ maalintii boqol jeer uu dembigiisa tirtiro, in kastoo ay la mid yihiin xumbo badda. Salaadda ka dib oo la joogteeyo, maalinta oo dhanna, dikriga waxa uu ilaaliyaa iimaanka.",
    ],
    phrases: [
      {
        title: "Erayada la jecel yahay iyo kuwa dembiyada tirtira",
        when: "Maalintii oo dhan; 100 jeer waxay tirtirtaa dembiyada",
        translation: "Subxaanallah, mahad oo dhan isagaa iska leh.",
      },
      {
        title: "Laba eray oo Miisaanka ku culus",
        when: "Waqti kasta",
        translation: "Mahad Eebaa iska leh; Subxaanallah.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Salawaat Nabiga ﷺ",
    summary: "Nabiga s.c.w in loo duceeyo waa il raxmad maalinle ah.",
    body: [
      "In Nabiga (scw) loo soo diro salaadda waxa Eebbe ku amray Qur’aanka kariimka ah – ‘Runtii, Eebbe iyo malaa’igtiisu waxay ku Salliyaan Nabiga; Mu'miniinta, nabadgalyo korkiisa ha ahaato iyo salaan nabadgalyo korkiisa ha ahaato' - mana jirto duco kale oo sidaan oo kale loo dammaanad qaaday: Nebigu (scw) wuxuu yiri ruuxii ku sallida hal nacjis, Allaah wuxuu ku soo dejiyey toban qof.",
      "Salawaatka soo noqnoqda waxay keentaa raxmad, darajooyin kor u qaada, waxay tirtirtaa dunuubta, waxayna qofka u soo jiidataa nabiga ﷺ maalinta qiyaame. Qaabka Ibraahim oo dhammaystiran ee hoos ku xusan - kii uu baray asxaabtiisa markii ay weydiiyeen sida loogu duceeyo - waxa lagu akhriyaa tashahud salaad kasta oo aad u fiican in carrabka lagu hayo maalinta oo dhan.",
    ],
    quran: [
      {
        excerpt:
          "Illeen Allaah iyo Malaa'igtiisu waxay ku Salliyaan Nabiga. Kuwa (Xaqa) rumeeyow ku Salliya Nabadgalyo iyo salaam.",
      },
    ],
    phrases: [
      {
        title: "Salawaat Ibrahimiyyah oo dhamaystiran",
        when: "Tashahhudka salaada iyo maalinta oo dhan",
        translation:
          "Allahayow naxariiso korkiisa ha ahaato Muxammad iyo ehelka Muxamed, sidaad ugu barakaysay Ibraahim iyo ehelkii Ibraahim; Adigu waxaad tahay Mahadnaq badane. Allow u naxariiso Muxammad iyo Ehelkii Muxamed, sidaad ugu fadliday Ibraahim iyo Ehelkii Ibraahim; Adigu waxaad tahay Mahadnaq badane.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ilaha iyo xaqiiqada",
    summary: "Horay u sii quraanka iyo xadiithka saxiix ah oo cad cad.",
    body: [
      "Qaybtani waa mid tacliineed oo aan dhinacna u xaglin, waxaana lagu dhisay gebi ahaanba Qur’aanka kariimka ah iyo xadiis saxiix ah oo la wada aqbalay (Saxiix/Xasan) mid walbana leh tixraac la taaban karo. Halbeegga dahabiga ah ee duca-maalmeedku waa si sax ah: qoraal la xaqiijiyay oo leh ilo la yaqaan.",
      "Digniin culus ayaa khuseysa baryada: Duas badan ayaa ku wareegaya internetka iyagoo wata erayo la hindisay iyo abaal-marin la buunbuuniyay ('aqri tan iyo dhammaan dembiyadaadu way baabba'aan'). Xadiithka la farsameeyay waa arrin qabri ah, ee iska hubi qiso aadan aqoon ka hor inta aadan qaadan ama gudbin.",
      "Xusuus-qorka iyo ku-dhaqanka maalinlaha ah, door bidayso gaagaaban, ducooyin dhab ah oo aad si dhab ah ugu adkaysan karto kuwa dheer ee aad ka tagi doonto - joogtaynta ayaa Alle uga jecel yahay mugga. Meesha ay dugsiyadu ku kala duwan yihiin ereyada, wax ka baro aqoonyahan degaanka ah oo u qalma.",
    ],
    actions: [
      "Xaqiiji isha ducada ee aadan aqoon ka hor inta aadan wadaagin.",
      "Dooro dhawr ducood oo sax ah oo kooban oo maalin walba hayso halkii aad ka heli lahayd qaar badan oo aadan sii wadi karin.",
      "Adeegso isku xidhka mawduuca abka si aad cashar kasta ugu lammaaniso ku celcelinta dhabta ah.",
    ],
    disclaimer:
      "Nuxurka waxbarashadu ma beddelo talada fiqhiga ee shakhsi ahaaneed. Weydii culimada aqoonta u leh xukunnada kiisaska gaarka ah.",
    appLinks: [{}, {}, {}, {}],
  },
];

export const LEARN_DUA_OCCASIONS_SO: DeepPartial<LearnDuaOccasion>[] = [
  {
    title: "subax adhka",
    summary: "Maalinta xuska ku bilow",
  },
  {
    title: "Habeenka casarka",
    summary: "Ilaalinta habeenka ka hor",
  },
  {
    title: "Ka dib markii uu soo toosay",
    summary: "Erayada ugu horreeya markaad toosto",
  },
  {
    title: "Hurdada ka hor",
    summary: "Ducadii iyo ducadii habeenka",
  },
  {
    title: "Gelida guriga",
    summary: "Bismillah iyo salaan",
  },
  {
    title: "Katagida guriga",
    summary: "Tawakkul marka aad baxayso",
  },
  {
    title: "Masjidka",
    summary: "Galitaanka iyo ka bixitaanka masjidka",
  },
  {
    title: "Kahor & ka dib cuntada",
    summary: "Ku mahadnaqa cuntada",
  },
  {
    title: "Wudu",
    summary: "ka hor iyo ka dib",
  },
  {
    title: "Ducada",
    summary: "Salaadda ka hor, inta lagu jiro, iyo ka dib",
  },
  {
    title: "Walaaca & walwalka",
    summary: "Qalbiga ku deji duco",
  },
  {
    title: "Jiro",
    summary: "bogsiin iyo samir",
  },
  {
    title: "Cafiska",
    summary: "Istigfaarta iyo towbada",
  },
  {
    title: "Safarka",
    summary: "Dejinta iyo soo noqoshada",
  },
  {
    title: "Bixinta",
    summary: "Illahay oo la waydiiyo rizq xalaal ah",
  },
  {
    title: "Ducadii quraanka",
    summary: "Ducada kitaabka Alle",
  },
];
