// Somali translation overlay for the Learn Battles content. Mirrors the order of
// its English source in ../battles*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  BattlesFigure,
  BattlesGlossaryTerm,
  BattlesLessonCard,
  BattlesTimelineEvent,
  BattlesTopic,
  BattlesVerse,
} from "../../types/battles";
import type { DeepPartial } from "./localize";

export const BATTLES_TOPICS_SO: DeepPartial<BattlesTopic>[] = [
  {
    title: "Hordhac",
    summary: "Sooyaal taariikheed, cadaadis, Hijro, iyo markii dagaalka la fasaxay.",
    body: [
      "Saddex iyo tobankii sano ee ugu horreeyay ee waxyiga Makkah, Muslimiinta waxaa la faray inay u adkeystaan ​​cadaadiska iyagoo sabar ah - fasax dagaal lama siin. Markay asxaabtu weydiisteen inay is-difaacaan, jawaabtu waxay noqotay: “Gacmaha ooga oo ooga, sakadana bixiya” (Qur’an 4:77). Beeshii hore waxay dulmiga kaga jawaabtay adkaysi, tahriib iyo duco, ee may ahayn jabhad hubaysan.",
      "Hijriyadii Madiina (622 Miilaadiyada/1 Hijriyada) waxay bedeshay xaaladdii bulshada ee mabaadiida mabda’a ah. Yathrib Muslimiintu waxay noqdeen bulsho deggan oo ku xidhan dastuurka Madiina - axdi qoran oo isdifaac iyo wada noolaansho la leh qabiilada Yuhuuda ee magaalada. Nebigu ﷺ hadda wuxuu madax u ahaa siyaasad la weerari karo sidaas darteedna si sharci ah isu difaaci karo.",
      'Kaliya markaas, sannado badan oo dulmi ah, ayaa soo degtay oggolaanshaha ugu horreeya ee dagaalka - sababta lagu sheegayna waxay ahayd in Mu\'miniinta la dulmiyay oo laga saaray guryahooda iyagoo leh "Eebbeheen waa Allaah" (Qur\'aanka 22: 39-40). Ogolaanshuhu wuxuu ahaa difaaca iyo ilaalinta xorriyadda diinta - isla aayad la mid ah ayaa magacawday badbaadada "nanaasiyada, kaniisadaha, sunagogyada, iyo masaajidda" sida waxa dagaalkan uu ilaalinayo - ma aha qabsasho, beddelaad qasab ah, ama dhac.',
      "Qur’aanku waxa uu oggolaaday xad joogto ah u dhigay: “La dagaallama Jidka Eebbe kuwa idinla dagaallama, laakiin ha xad-gudbina” (Qur’an 2:190). Dagaalku waxa uu ku xidhnaa gardaro iyo gardaro ka dhan ah beesha, mana ahayn in aan marnaba laga dhaafin xadka cadaaladda.",
      "Ololayaashani waa taariikh: waxay ka dhaceen xaalad gaar ah oo Carabeed qarnigii toddobaad ee dagaalka qabiilka, heshiisyada jabay, iyo go'doominta. Diinta islaamka guud ahaan nabada, cadaalada, naxariista iyo derisnimada ayaa ah qaab-dhismeedka; Faahfaahinta dagaalladan waa in lagu akhriyaa gudaha gudaha, oo aan lagu dumin hal-ku-dhegyo ka soo baxay.",
    ],
    quran: [
      {
        excerpt:
          "Waxaa loo idmay kuwii dagaallamay in la dulmiyey Darteed, Eebana waa karaa inuu liibaaniyo kuwa laga fogeeyey guryahoodii xaqdarro, waxaan ahaynna waxaan ahayn Eebahanno waa Eebahan. Hadduusan Eebe ku celin dadka qaarka kale, waxaa la dumin lahaa macbudyo, Kaniisado, mac-hadyo iyo masaajido magaca Eebe lagu xusay.",
      },
      {
        excerpt:
          "Ku dagaallama Jidka Eebe kuwa idinla dagaallama, hana xad-gudbina. Eebana ma jecla kuwa xadgudba.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Waa maxay sababta dagaaladu u dhaceen",
    summary: "Cadaadiska, xadgudubyada heshiiska, iyo difaaca bulshada - maaha gardaro.",
    body: [
      "Dulucda iyo sababta dagaaladaasi waxay ahayd olole cadaawad oo joogto ah, ee ma ahayn rabitaan Muslim ah oo dagaal. Makkah, Qureysh waxay jirdishay dadka tabarta yar, waxay qaadacday qabiilkii oo dhan ilaa qarka u saaran inay gaajo u dhintaan, waxay qabsadeen hantidii ay ka tageen muhaajiriinta, xitaa waxay maleegayeen inay dilaan Nabiga ﷺ. Hijradii Madiina ma dhamayn khatarta; way rartay.",
      "Badar (2 hijriyada) waxay ka kortay colaadaas aan xal loo helin. Markii la sheegay in safar Qureysh ah oo aad u badan - oo sidda xoolo laga soo qaaday hijrada - ay ka soo laabanayaan Shaam, ayaa nabigu ﷺ u dhaqaaqay inuu dhexda ka galo. Socdaalkii wuu baxsaday, laakiin Quraysh waxay mar hore urursatay ciidan ku dhow kun, si kastaba ha ahaatee way dhaqaaqday, waxayna go'aansatay inay xoog ku burburiso bulshadaas dhallinyarada ah. Dagaalka ceelasha Badar ka dhacay ayaa natiijadii ka soo baxday.",
      "Madiina, badbaadadu waxay ku xidhan tahay heshiisyo, heshiisyo dhawr jeer ah ayaa la jebiyey. Jabhadihii ku yaboohay is-difaacidda axdigii magaalada ayaa taa beddelkeeda u maleegay cadawgii - Confederates-kii ku go'doomiyay Madiina godad (5 Hijriyada) si ay u baabi'iyaan dhammaan Muslimiinta.",
      "Xadgudubyada heshiisku waxay ahaayeen kuwo go'aan qaadasho leh ilaa dhammaadka. Waxay ahayd xulafadii Quraysh oo weerartay xulafadii Muslimiinta, Banu Khuzaac, kuwaas oo buriyay heshiiskii Xudeybiyah oo u horseeday - si cajiib ah - oo ku dhawaad ​​dhiig la'aan ku furay Makka halkii ay ka ahaan lahaayeen xasuuq.",
      "Waxaas oo dhan, ujeeddooyinku waxay ahaayeen kuwo joogto ah: in la difaaco nolosha iyo diinta, in la ilaaliyo dadka jilicsan, iyo in la helo ammaan ku filan oo tawxiidka lagu dhaqmi karo iyada oo aan la dhibaatayn. Ujeedadu weligood ma ahayn balaadhin aan dhammaad lahayn oo nafteeda ah, ilo-wareedyaduna waxay diiwaan geliyeen Nabiga ﷺ inuu jecel yahay heshiis iyo heshiis mar kasta oo cadowgu u janjeero xagga nabadda.",
    ],
    hadith: [
      {
        excerpt:
          'Waxaa la i faray inaan la dagaallamo dadka ilaa ay ka marag kacaan inaan Eebe mooyee ilaah kale jirin, Muxammadna uu yahay Rasuulkii Alle, oo ooga salaadda, zakadana bixinaya. Hadday sidaas yeelaan naf iyo maalba waa la iga dhawrsadaa xaqa Islaamka mooyaane, xisaabtooduna Eebbe agtiisay taal. - Culimadii qadiimiga ahayd waxay akhriyeen "dadku" inay yihiin mushrikiinta gaarka ah ee Carabta oo markaas dagaal ku qaaday Islaamka ka dib markay farriintu soo gaadhay; waa hadal ku saabsan dagaalyahannadaas cadawga ah, ma aha shatiga lagu weerarayo dadka nabadda ah ee aan muslimka ahayn ama lagu qasbo caqiidada, taasoo Qur\'aanka 2:256 uu si cad u diidayo.',
      },
    ],
    quran: [
      {
        excerpt: "Diinta qasab kuma jirto. Habka saxda ah ayaa ka duwanaaday qaladka.",
      },
    ],
    disclaimer:
      "Xadiiska sare ayaa inta badan laga soo xigtay iyadoo laga xayuubinayo. Culimadii qadiimiga ahayd waxay u dhigeen colaadaha gaarka ah ee waqtigeeda iyo inay garab istaagaan Quraanka kariimka ah ee diinta khasabka ah (2:256) iyo xadka in la dagaallamo oo keliya kuwa idinla dagaallama (2:190).",
    appLinks: [{}],
  },
  {
    title: "Anshaxa dagaalka ee Islaamka",
    summary:
      "Ma jiro gardaro, ilaalin adag oo lagu hayo dadka rayidka ah, iyo dhaqanka bini'aadantinimada - oo ku salaysan Qur'aanka iyo Sunnada.",
    body: [
      'Shareecada Islaamka ee dagaalka (siyar) waxay si toos ah uga kortay xadkii Quraanka iyo ku dhaqanka nebiga. Aasaaskeedu waa hal xeer oo xukuma wax kasta oo kale: "La dagaallama kuwa idinla dagaallamaya, laakiin ha xadgudbina" (Qur\'aanka 2:190). Dagaalku waa jawaab celin gardaro ah, cadaalad baa ku xeeran, waana in la joojiyo marka cadawgu istaago.',
      "Kuwa aan dagaalka ahayn si adag ayaa loo ilaaliyaa. Markii naag la dilay la helay hal safar ka dib, Nabigu ﷺ wuxuu mamnuucay in dumarka iyo carruurta si toos ah loo dilo. Sharci-yaqaannadu waxay arrintan u fidiyeen dadka da'da ah, suufiyada iyo cibaadada oo qolkooda ku qarsoon, kuwa beeralayda ah iyo kuwa la kiraysto, iyo cid kasta oo aan dagaalka ka qayb qaadan. Dilkooda maaha xad-dhaaf la oggol yahay - waa mamnuuc.",
      "Xataa ka soo horjeeda dagaalyahannada firfircoon, qodobku wuxuu ahaa martiqaad ka hor seefta. Markii Nebigu ﷺ u magacaabay taliye wuxuu faray inuu marka hore dhanka kale ugu yeero Islaamka, dabadeed - haddii la diido - heshiis nabadeed, oo kaliya inuu dagaallamo haddii labadaba la diido, oo uusan waligiis iimaanka ka jabin, googooyn, ama dilin ilmo (Saxiix Muslim 1731).",
      'Khiyaanada guud ahaan waa mamnuuc: heshiisyada waa in la ixtiraamaa ilaa waqtigooda, cadowgana waa in la siiyaa digniin cadaalad ah halkii la khiyaanayn lahaa. Oggolaanshaha goobta dagaalka ee ah "dagaalku waa khiyaano" waxaa loola jeedaa oo kaliya xeelado xeeladaysan - feints, yaab, jahawareerin - waligaa in aan jebin axdi ama been loo sheego qolo la ilaaliyo.',
      "Hantida iyo dhulka laftiisa ayaa la ilaaliyaa. Tilmaanta guud waxa ay mamnuucday in si badheedh ah loo jaro geedaha midhaha ah, la gubo dalagyada, iyo laynta xoolaha oo aan loo baahnayn. Maxaabiista waxa loo quudin jiray sida ay maxaabiistu wax u cunaan oo ay u xidhaan marka ay xidhan yihiin; Qur'aanku wuxuu ammaanay kuwa maxaabiista u quudiya jacaylka Eebbe (76:8), qaar badanna waxaa lagu sii daayay madax furasho, beddelasho, ama naxariis fudud - qaarkood Badar waxay ku beddeleen inay Muslimiinta baraan inay wax akhriyaan.",
      "Kuwani waa manhajyada caadiga ah ee diinta. Shakhsiyaadka Muslimka ah ee taariikhda ku xad-gudbay iyaga waxay ku xad-gudbeen Islaamka, ma aysan qeexin - sida xadgudubyada kuwa raacsan caqiidada kasta aysan dib u qorin waxa caqiidadaas amrayo.",
    ],
    quran: [
      {
        excerpt: "Ku dagaallama Jidka Eebe kuwa idinla dagaallama, hana xad-gudbina.",
      },
      {
        excerpt:
          "Hadday u janjeeraan nabaddana u dhaadhac, Allaahna talo Saaro. Eebana waa maqle oge ah.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ibnu Cumar waxa laga wariyey in haweenay la gowracay mid ka mid ah socdaaladii Rasuulka s.c.w, markaasuu diiday in dumarka iyo carruurta la laayo.",
      },
      {
        excerpt:
          "Nabigu (scw) markuu u magacaabay amiir ciidan ayuu ku amray: ku dagaalama magaca Alle... ha lunsan hantidaada, ballankaaga ha jabin, ha googooyn, ilmona ha dilin. Markaad cadowga la kulanto, marka hore ku casuun Islaamka; Hadday diidaanna nabad sii; Hadday labaduba diidaan, ka dibna dagaalama.",
      },
      {
        excerpt:
          "Ha dilin oday ceeb ah, ama ilmo yar, ama naag. - Silsilada erayadan saxda ah qaarkood ayaa lagu darajo daciif ah, laakiin xukunka ay sheeganayso waxaa xaqiijinaya qisadda Saxiixa ah ee kor ku xusan iyo isku raacidda fuqaha.",
      },
    ],
    actions: [
      "Si cad u kala saar waxa Islaamku amray iyo waxa ciidan kasta oo taariikhda soo maray uu dhab ahaantii sameeyay.",
      "Akhri qaybtan anshaxa ka hor sheeko dagaal kasta - taariikhda iyada oo aan lahayn mabaadi'deeda xukunka waxay martiqaadaysaa isfaham la'aan.",
      "Marka ilku duubo fal u muuqda inuu ka hor imanayo xeerarkan, weydii macnaha guud iyo run ahaanshihiisa ka hor inta aanad gunaanadin.",
    ],
    appLinks: [{}],
  },
  {
    title: "Dagaalkii Badar",
    summary:
      "17 Ramadaan 2 Hijriyada - Dagaalkii ugu horreeyay ee ugu weyn, Maalinta Khilaafaadka.",
    body: [
      "Dulucda iyo sababta: Hijriyadii ka dib, Qureysh waxay qabsatay guryihii iyo hantidii ay Makka uga soo haajireen, wayna sii wadayeen hanjabaadii. Markii Madiina laga war helay in Abuu Sufyaan uu hoggaaminayay safar qani ah oo Shaam ka soo laabtay, ayaa nabigu ﷺ la baxay ciidan fudud - qiyaastii 313 nin - iyagoo filanaya inay hanti dhexgalaan, ee ma aha inay dagaallamaan.",
      "Maxaa dhacay: Abuu Sufyaan wuxuu soo dhaafay xeebta, hase ahaatee mar hore ayuu Makka u diray gurmad, markaasay Qureysh la baxday ilaa kun dagaalyahan, fardooley iyo sahay, iyagoo go’aansaday inuu tusaale u noqdo muslimiinta. Dagaalku wuxuu noqday mid aan laga maarmi karin oo ka dhacay ceelasha Badar, halkaas oo -- talada al-Hubab bin al-Mundhir- ay muslimiintu qabsadeen markii hore, iyagoo cadawga u diiday.",
      "Habeenkaas Nabigu ﷺ wuxuu istaagay salaad ilaa waagu ka baryay. Isaga oo saddex jeer ciidan hortaagan ayuu gacmihiisii ​​kor u taagay oo baryay Eebihiis si dhab ah, go’iisiina garbihiisa ka siibtay, isagoo leh: “Alloow haddii kooxdan mu’miniinta ah la baabi’iyo dhulka laguguma caabudayo. Qur'aanku wuxuu qoray in Eebbe ku jawaabay isagoo xoojinaya malaa'igta oo ku tuuray xasilloonida quluubta mu'miniinta.",
      "Ka dib markii ay hal dagaal ku dhexmareen saddex kooxood oo ka kala socday dhinac kasta, ciidamada ayaa isku dhacay. Quraysh jabtay. Ilaa toddobaatan ka mid ah hoggaamiyayaashoodii ayaa la dilay - oo uu ka mid ahaa Abu Jahal, oo ahaa silcigii ugu darnaa ee beesha - qiyaastii toddobaatanna waa la qabtay; waxaa shahiiday afar iyo toban muslimiin ah. Maxaabiistii waxaa loola dhaqmay si sharaf leh, qaarna waxay ku iibsadeen xorriyaddooda iyagoo baray ubadka muslimiinta ah inay wax akhriyaan waxna qoraan.",
      "Shaqsiyaadka muhiimka ah: Nabiga ﷺ waxaa garab taagnaa Abuu Bakar, Cumar, Cali, iyo adeerkiis Xamza; Taladii al-Hubab ee ceelasha iyo Sacad ibnu Mucaad ee ku saabsan istiraatijiyadda waxay tusinaysaa hoggaaminta wada-tashi xitaa markii guusha la ballan qaaday.",
      "Qur'aanku wuxuu maalintan u bixiyey yawm al-furqaan - maalinta kala saraynta - sababtoo ah waxay ka soocday runta iyo beenta ka hor jasiiradda oo dhan. Casharkeedu waa in dadaal dhab ah iyo u diyaar garow buuxa la isku xidho si loo wada talo saaro Alle: Mu’miniintu waxay diyaariyeen darajooyinkoodii, waxay doorteen dhulkoodii, wayna duceeyeen, guushana waxaa loo tixgaliyey Eebbe ee ma aha tiro koob.",
    ],
    battleDetails: {
      location: "Ceelasha Badar oo Madiina koonfur-galbeed ka xiga",
      modernLocation: "Badar casriga ah agtiisa, Sacuudi Carabiya",
      hijriDate: "17 Ramadaan 2 Hijriya",
      muslimForces: "313 dagaalyahan, oo wata fardo iyo geel yar (warbixintu way kala duwan tahay)",
      opposingForces: "~ 1,000 Quraysh, oo ka hub badan oo la rakibay",
      muslimCommander: "Nabi Muxammad ﷺ",
      opposingCommander: "Camr bin Hishaam (Abuu Jahal), dagaal baa lagu dilay",
      weather:
        "Roobkii habeen hore da’ay ayaa ciidda Muslimiinta ku adkeeyey; helitaanka biyaha ayaa ahaa mid muhiim ah",
      outcome: "Guul muslin ah oo go'aan leh",
      keyEvents: [
        "Al-Hubab bin al-Mundhir ayaa kula taliyay in la xero ceelasha marka hore, isaga oo koontaroolaya biyaha.",
        "Nebigu ﷺ wuu tukaday habeenkii, isagoo Alle u baryaya mu’miniinta tirada badan.",
        "Saddex ka mid ah kooxdii Qureysh ayaa hal dagaal kula kulmay Xamza, Cali iyo Cubeydah.",
        "Eebe wuxuu ku xoojiyay Mu’miniinta Malaa’ig (Qur’an 8:9) wuxuuna tuuray madaxdii Qureysh ee muhiimka ahayd.",
        "Ilaa 70 ka mid ah cadowga waa laga dilay 70 kalena waa laga qabtay; maxaabiista ayaa loola dhaqmay si bini’aadantinimo.",
      ],
      leadershipLesson:
        "Si fiican u diyaargarow, la tasho kuwa cilmiga leh, kadibna Eebe talo saaro dhammaan.",
      spiritualLesson:
        "Koox yar oo daacad ah oo taageero rabbaani ah waxay rogi karaan khayaanada adduunka - guushu waxay ka timid xagga Eebbe.",
      facts: [
        "Badar waxa lagu magacaabay oo lagu sifeeyay Qur'aanka in ka badan hawl-gal kale oo kasta (Suuradda al-Anfaal).",
        "Maxaabiistii qaarkood ayaa la sii daayay si ay u barayaan farbarashada iyo farbarashada carruurta reer Madiina.",
      ],
    },
    quran: [
      {
        excerpt:
          "Markaad u Gargaar waydiisanayseen Eebihiin oo uu idinku Ajiibay waxaan idinku Xoojin Kun Malaa'ig ah oo is daba Jooga.",
      },
      {
        excerpt:
          "Waxaa idiinku sugnaaday calaamo labadii kooxood ee kulmay, mid ku dagaalamaya Jidka Eebe iyo mid Gaalo ah.",
      },
      {
        excerpt:
          "Idinku maydaan dilin, laakiin Alle ayaa dilay. Mana aadan tuurin markaad tuurtay, Eebana waa kan tuuray.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Cumar waxa laga wariyey in maalintii Badar uu Nabigu Scw eegay cadawgii kun iyadoo asxaabtiisu ay wax yar ka badanayeen saddex boqol, dabadeedna uu qiblada u jeestay oo uu gacmihiisii ​​fidiyay oo uu baryay Eebihiis: Alloow oofi wixii aad ii ballan qaaday. Alloow haddii kooxdan mu’miniinta ah la baabi’iyo dhulka laguguma caabudayo. Wuu baryey ilaa uu go’iisii ​​garbaha ka soo dhacay, markaasaa Abuu Bakar beddelay oo ku yidhi: waa ku filan tahay, Nebi Alloow – Eebbe wuu oofin wuxuu kuu ballan qaaday.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dagaalkii Uxud",
    summary: "Shawwal 3 AH - Cashar qaali ah oo ku saabsan addeecidda, edaabta, iyo adkaysiga.",
    body: [
      "Dulucda iyo sababta: Sanad ka dib Badar, Qureysh waxay soo noqotay inay u aarguto meydadkoodii, waxayna soo ururiyeen ilaa 3,000 oo dagaalyahan - fardooley uu hoggaaminayay Khaalid bin Al Waliid, oo haddana cadaw ahaa, iyo dumarkii oo ragga ku boorrinayey durbaanno iyo xarrago. Muslimiintii, qiyaastii 700 ka dib markii qaar ka baxeen, waxay qabsadeen buurta Uxud dhabarka.",
      "Maxaa dhacay: Nabigu ﷺ wuxuu saaray kontomeeyo qaansoley ah oo ilaalinaya dabada ciidanka oo qaawan, wuxuuna u dhiibay amar uu ku celceliyay isagoo xoogga saaraya: “Ha ka tagin meeshan xitaa haddaad aragtaan annaga oo shimbiro naga dafayn, ilaa aan idiin soo diro”. Markii ugu horraysay qorshuhu si fiican buu u shaqeeyey - Muslimiintii Qureysh dib bay u celiyeen, cadowgiina wuxuu bilaabay inuu cararo.",
      "Markii ay arkeen cadawgii oo kala firdhiyey iyo boolidii oo bannaan, ayaa qaansoleydii badidood buurtii ka tageen iyagoo amar diiddan, hubaashiina in dagaalkii lagu guuleystay. Khaalid bin al-Walid ayaa daqiiqada qabsaday, oo fardooleydiisii ​​kaxaystay meel bannaan oo aan la difaaci karin, oo Muslimiintii gadaal ka garaacay. Nidaamku wuxuu u burburay fowdo.",
      'Shakhsiyaadka muhiimka ah iyo qiimaha: Xamza bin Cabdil-mudhalib, "Libaaxa Alle" waa la shahiiday, isaga iyo ilaa toddobaatan saxaabi. Nabiga ﷺ laftiisu wuu dhaawacmay - iliggiisii ​​waa jabeen, wejiguna wuu go\'ay - waxaana beerta ka dhacay xanta ah in la dilay. Markii ay Mu’miniintu arkeen inuu nool yahay, ayay ugu soo urureen jiidhka buurta, markaasay Quraysh oo dhammayn kari wayday ka baxday.',
      "Qur’aanku waxa uu maalintan si qoto dheer uga hadlay suuradda Al Cimraan, isaga oo saaraya masuuliyadda caasinimada qaar, ee ma aha mid ku fashilma iimaanka ama ballanka Eebbe: “Eeba waa rumeeyey ballankiina… ilaa aad ka dhiirrataan oo aad ku murmaan amarka, oo aad caasidaan ka dib markuu idin tuso waxaad jeceshihiin” (3:152). Haddana isla tuducdu waxay u qalbi qaboojinaysaa bulshada dhaawacantay oo ka reebaysa rajo-beelka.",
      "Sidaa darteed Uxud guuldarro kuma aha Islaamka ee waa cashar la dhawray: guushii hore loo helay waa laga noqday markii edbinta jabtay, amarro cad cad iyo geesinnimo, iyo imtixaanno u sifayn bulshada - kuwa toobad keena oo adkaysta, dib u dhacu wuxuu noqdaa seeraha koritaanka.",
    ],
    battleDetails: {
      location: "Jiirada buurta Uxud ee waqooyiga Madiina",
      modernLocation: "Uxud, gobolka Madiina, Sacuudi Carabiya",
      hijriDate: "Shawaal 3 hijriyada",
      muslimForces: "~ 700 (ka dib markii qaar ay ka baxeen dagaalka ka hor)",
      opposingForces: "~ 3,000 Qureysh iyo xulufo, oo fardooley ah",
      muslimCommander: "Nabi Muxammad ﷺ",
      opposingCommander:
        "Abuu Sufyaan bin Xarb; Khaalid bin al-Walid ayaa hoggaaminayay fardooleydii garbaha ka ahayd",
      outcome:
        "Faa'iidada goobta tabaha Quraysh; bulshada muslimka ahi si sax ah ayay u nool yihiin",
      keyEvents: [
        "Nebigu ﷺ wuxuu saaray 50 qaansoley ah buur isagoo si adag u amray inaysan ka bixin.",
        "Muslimiintii waxay jebiyeen xayndaabkii cadawga, laakiin qaansoleydii badidood waxay ka tageen booskooda si ay u urursadaan.",
        "Fardooleydii Khaalid bin Al Waliid baa ka faa’iidaystay meesha bannaan, oo gadaal ayay ka garaaceen.",
        "Xamza iyo ilaa 70 saxaabi ayaa ku shahiiday; nabiga ﷺ wuu dhaawacmay.",
        "Waxaa faafiyey warar been abuur ah oo ku saabsan dhimashadii Nebiga; Mu’miniintii ayaa isu soo baxay markay arkeen isagoo nool.",
      ],
      leadershipLesson:
        "Awaamiirta cad iyo fulinta edbinta leh inta ay le'eg tahay geesinimada; ka tagista boostadaada waxay soo celin kartaa guul.",
      spiritualLesson:
        "Tijaabooyinku waxay nadiifiyaan rumaystayaasha; dib u dhac lala kulmo towbad keen iyo adkaysigu waxay horseedaa korriin.",
    },
    quran: [
      {
        excerpt:
          "Dhab ahaan buu Eebe u oofiyey yaboohiisa markaad dilaysaan idankiisa, intaad ka adkaataan ood ku khilaaftaan amarka ood caasidaan ka dib markuu idin tuso waxaad jeceshihiin.",
      },
      {
        excerpt:
          "Ee ha tabaryarina hana murugoonina, idinkaa sareeye haddaad tihiin kuwa xaqa rumeeyey.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Rasuulku (scw) kontonkii qaansole ee maalinta Uxud ayuu u magacaabay Cabdullaahi bin Jubayr, wuxuuna ku yiri: mawqifkiinna qabta; xataa haddaad aragtaan inagoo shimbiro naga dafayna, ha ka tagin ilaa aan kuu soo cid diro, oo xataa haddaad aragtaan inaannu ka adkaanno, ha ka tegin ilaa aan idiin soo cid diro. Markii cadawgii la jebiyey oo qaansoleydii ay boolidii arkeen ayay yiraahdeen, boolidii! oo ay ka tageen jagadoodii - sidaas darteed waxaa nala dilay toddobaatan qof.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dagaalkii Qodabka",
    summary:
      "Shawwal 5-aad ee Hijriyada - Jamhadihii waxay hareereeyeen Madiina; jeex iyo dabayl baa jebisay.",
    body: [
      "Macnaha iyo sababta: Waxa kale oo loo yaqaan Ghazwat al-Ahzab (Dagaalka Confederates), tani waxay ahayd dadaalkii ugu weynaa ee cadowgu ku burburiyo Islaamka mar iyo dhammaan. Madaxdii Banu Nadiir, oo horay loogu eryay khiyaano awgeed, waxay fuuleen Makkah iyo Ghatafan waxayna soo ururiyeen isbahaysi - Quraysh, Ghatafan, iyo qabiilo kale - oo lagu qiyaasay inta u dhaxaysa 10,000 iyo 24,000 oo nin. Muslimiintu waxay ahaayeen ilaa 3,000, khatartuna waxay ahayd mid jirta.",
      "Maxaa dhacay: In la wajaho go’doomin ma jirto magaalo Carbeed oo u adkeysan karta dagaal cad, Nabigu ﷺ wuxuu la tashaday asxaabtiisa. Salmaan al-Farisi waxa uu soo jeediyay xeelad Faaris oo aanu garanayn dagaalka Carabta - isaga oo qodaya god dheer oo ka gudbaya habkii woqooyi ee qaawan, dhinaca keliya ee aan ka gabbanayn beeraha laamiga ah, beero-abuurka, ama guryaha deyrka leh. Mu’miniintu waxay qodayeen maalmo qabow iyo gaajo daran, Nabigu ﷺ wuxuu dhabarka ku sitay carro, dhagaxna calooshiisa ayuu kaga xidhay xanuunkii soonka.",
      "Meesha ayaa shaqeysay. Markii ay timi ciidankii faraha badnaa waxay is aragtay inay awoodi wayday inay ka gudubto; dhawr fardooley ah oo ka booday ayaa dib loo kaxeeyey. Go'doomintu waxay degtay qiyaastii laba ilaa afar toddobaad oo qabow, xiisad, iyo iska horimaad halkii ay ahayd dagaal toos ah.",
      "Bulshada waa la tijaabiyay ilaa gunteeda. Munaafiqiintu marmarsiinyo bay sameeyeen oo waxay damceen inay simbiriirixdaan; Qabiilkii reer banuu Qurayzah ee gudaha magaalada ku sugnaa ayaa u jihaaday dhanka cadowga; Qur'aanku wuxuu qeexayaa quluubta oo gaadha dhuunta. Haddana Mu'miniintu way qabsadeen, oo Nucaym bin Mascuud - oo dhawaan Muslim ahaa si qarsoodi ah - wuxuu ku beeray kalsooni darro dhexdooda kooxihii isbahaystay ilaa ay ka istageen.",
      "Dabadeed nafis Alle ka yimid, ee seeftu kama iman. Dabayl daran oo baraf ah ayaa ku soo dhacday xeradii cadowga, waxayna rogtay dabkii wax lagu karsanayay iyo teendhooyinkii, ciidan aan la arkin ayaa cabsi geliyay. Isbahaysigii oo awalba jabay, sahayduna ku yar tahay, ayaa burburay oo habeennimadii ka baxay. Nebigu ﷺ wuxuu yiri ka dib in Allaah kaliya uu jabiyay Jamhooyinkii.",
      "Casharro waara: waa in la qaataa talada saxda ah meel kasta oo ay ka timaado - halkan ka soo islaamay Faaris; macnaheedu waa in la qaadaa ilaa xadkooda - godka la qoday, darajooyinka la qabtay; dabadeed natiijadeeda waxaa loo wakiishay Alle, oo soo celin kara ciidan dabayl wata. Suuradda al-Axzaab waxay ilaalinaysaa dhammaan imtixaankii iyo gargaarkeeda.",
    ],
    battleDetails: {
      location: "Woqooyiga oo Madiina ku soo wajahan",
      modernLocation: "Madiina, Sacuudi Carabiya",
      hijriDate: "Shawaal 5 Hijriya",
      muslimForces: "~3,000",
      opposingForces:
        "Isbahaysiga Confederate (~ 10,000-24,000; tirooyinka ku kala duwan yihiin ilaha)",
      muslimCommander: "Nabi Muxammad ﷺ",
      opposingCommander:
        "Abuu Sufyaan oo qureysh hoggaaminayey; madaxdii xulufada ahayd ee Ghatafan iyo kuwa kale",
      weather:
        "Qabow qadhaadh inta lagu jiro qodista; dabayl Rabbaani ah oo rabshad leh ayaa soo afjartay hareeraynta",
      outcome: "Guusha Muslimka oo aan dagaal la gelin; isbahaysigii wuu kala dareeray",
      keyEvents: [
        "Salmaan al-Farisi waxa uu soo jeediyay in god laga qodo jidka woqooyi ee nugul.",
        "Rasuulku ﷺ wuxuu la wadaagay foosha, isagoo sidda carro, dhagaxna ku xidhay gaajada.",
        "Jidka ayaa hakiyay ciidankii badnaa, isagoo ku qasbay in la hareereeyo halkii dagaal furan laga qaadi lahaa.",
        "Nucaym bin Mascuud wuxuu beeray fidno ay ku kala qaybisay xulufadii.",
        "Dabayl qabow iyo ciidan aan la arki karin (Qur'aanka 33:9) ayaa jebiyey xeradii cadowga; way ka baxeen.",
      ],
      leadershipLesson:
        "La tasho si ballaaran oo qaado fikrado wanaagsan iyadoon loo eegin asalkooda; la wadaag dhibka bulshada haysata naftaada.",
      spiritualLesson:
        "Go'doominta ku adkayso, natiijadana u wakiilo Alle, kaas oo soo celin kara ciidan dabayl wata.",
    },
    quran: [
      {
        excerpt:
          "Kuwa (Xaqa) rumeeyow xusa Nicmada Eebe korkiinna markay Junuudi idiin timid, markaasaan ku dirray Dabayl iyo col aydaan arkayn, waxaana lagu imtixaanay Mu'miniinta waxaana lagu gilgilay Gariir daran.",
      },
      {
        excerpt:
          "Markay Mu'miniintu arkeen Xisbiyadii waxay dheheen kani waa wixii Eebe iyo Rasuulkiisu noo yaboohay, mana u siyaadinin waxaan rumayn iyo is-hoosaysiin ahayn.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Rasuulku (scw) wuxuu ka baryay jameecadii maalintii al-Axzaab, isagoo leh: Alloow kitaabka soo dajiyay, xisaabi degdege- jaba jameecadii. Allahayow jabi oo rux.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Banu Qurayzah",
    summary:
      "5 AH - heshiis la khiyaameeyay intii lagu jiray hareeraynta; garsoore garqaad lagu heshiiyey.",
    body: [
      "Dulucda iyo sababta: Banu Qurayzah waxay ahaayeen qabiil yahuud ah oo reer Madiina ah oo ku xidhan muslimiinta axdigii magaalada. Markii uu Qadka ugu dheeraa, markii ay Madiino soo garaaceen Isbahaysigii, bulshadiina ay duni ka soo laadlaadsan yihiin, ayaa Madaxdii reer Banu Nadiir waxa uu ku qanciyey Madaxdii Qurayza in ay axdigaas jeexjeexaan oo ay waji labaad ka furaan magaalada dhexdeeda. Imminka wakhtigaas, arrintani ma ahayn khilaaf gaar ah ee waa khiyaamo qaran markii la go'doomiyay oo dhammaan ku baabi'in kartay Madiina.",
      "Maxaa dhacay: Ka dib markii ay ka baxeen xisbiyadii, nabigu ﷺ wuxuu u dhaqaaqay banuu Qurayzah, kuwaas oo isku xiray qalcadahooda. Go’doomintaasi waxay socotay ilaa shan iyo labaatan maalmood ilaa ay ku heshiiyeen inay isdhiibaan—laakin waxay waydiisteen inaan masiirkooda go’aan laga gaadhin Nabiga (scw) si toos ah balse loo xukumo iyaga laftoodu waxay doorteen: Sacad ibn Mucaad oo madax u ahaa Aws, oo ay muddo dheer xulafo ahaayeen.",
      "Xukunkii: Sacad - laf ahaantiisa oo u dhimanaya nabar ka soo gaaray Qodabka - wuxuu xukumay in raggii dagaallamay ee khiyaanada geystay la dilo, dumarka iyo carruurtana maxaabiis ahaan loo kaxeeyo, xukunkaas oo aad u daran halbeeg kasta ha ahaatee iyadoo la ilaalinayo sharcigii dagaalka ee waqtigaas iyo goobta khiyaamo qaran ee la hareereeyey. Rasuulku ﷺ wuxuu yidhi Sacad wuxuu xukumay si waafaqsan xukunka Eebbe.",
      "Sida taxaddar leh loo akhriyo: Tani waxay ciqaab u ahayd fal gaar ah oo khiyaano dagaal ah oo ay geysteen dagaalyahannada jebiyey axdigii difaaca ee saacaddii ugu nugulayd ee bulshada - ma aha xukun ka dhan ah dadka caqiidadooda, oo si cad uma aha qaab tusaale ah sida Muslimiintu ula dhaqmaan Yuhuudda ama bulsho diimeed kasta. Qur'aanka iyo Sunnadu waxay amrayaan caddaalad iyo in si wanaagsan loola dhaqmo dadka aan muslimiinta ahayn (Qur'aanka 60: 8), iyo qabiilooyinka kale ee Yuhuudda iyo shakhsiyaadka Madiina ee rumaystay weligood lama dhibin. Deeqda waxbarasho ee guud waxa ay ula dhaqantaa tan sidii dhacdo taariikhi ah oo xad leh oo sharciga khiyaamo qaran ah, iyo qaar ka mid ah culimada dambe ayaa xitaa su'aal galiyay faahfaahinta tirooyinka la gudbiyay.",
      "Qur'aanku waxa uu si miyirqab ah u tilmaamay dhacdadii suuradda al-Axzaab ee ka dhalatay dagaalkii Confederation, oo aan guul la gaadhin. Casharka waara waa culayska ay leedahay jebinta axdiga - Khiyaanada aaminaadda daqiiqad khatar ah oo la wadaago waxay xambaarsan tahay culayska ugu culus - iyadoo dhinac laga saaray mabda'a ah in xitaa cadawgu xaq u leeyahay garqaad la isku raacay oo aan eex lahayn halkii uu ka aargoosan lahaa.",
    ],
    battleDetails: {
      location: "Dhufaysyadii banuu Qurayzah ee Madiina cidhifkeeda ku yaal",
      modernLocation: "Madiina, Sacuudi Carabiya",
      hijriDate: "Dhul-Qacdah 5 Hijriyada",
      muslimForces: "Ciidankii Madiina, isla markiiba ka dib markii la go'doomiyay Dooxa",
      opposingForces: "Banu Qurayzah, oo ay dhufeysyadooda ku dhex dheceen",
      muslimCommander: "Nabi Muxammad ﷺ",
      outcome: "Isdhiibi go'doominta ka dib; garqaadkii qabiilku doortay",
      keyEvents: [
        "Banu Qurayzah waxay jebiyeen axdigii Madiina markii ay go’doomiyeen xulafadii.",
        "Ka dib markii ay ka baxeen ciidamadii Kufaarta, Muslimiintu waxay hareereeyeen dhufaysyadoodii muddo ku dhow 25 maalmood.",
        "Qabiilka ayaa codsaday in la xukumo Sacad ibnu Mucaad oo madax u ahaa xulafadooda muddada dheer reer Aws.",
        "Sacad waxa uu xukumayay xeerkii dagaalka ee da’dii khiyaano qaran ee la hareereeyey; Nabigu ﷺ wuu caddeeyey xukunkii.",
      ],
      leadershipLesson:
        "Xataa cadow ka dhan ah, oggolow xukun lagu heshiiyey, garqaade dhexdhexaad ah, intii aad ka aargoosan lahaydeen.",
      spiritualLesson:
        "Jebinta axdiga ilaalinta wadajirka ah daqiiqad khatar ah oo la wadaago ayaa ka mid ah khiyaanada ugu daran.",
    },
    quran: [
      {
        excerpt:
          "Wuxuuna ka soo dajiyay kuwii u kaalmeeyey ee ehlu-Kitaabka ahaa Dhufaysyadoodii, quluubtoodana ku tuuray argagax, koox aad dileen iyo koox aad qafaasheen. Wuxuuna idin dhaxalsiiyay dhulkoodii iyo guryahoodii.",
      },
      {
        excerpt:
          "Eebana idinkama Reebo kuwaan Diinta idinkula Dagaalamin oon Guryihiinna idinka Bixin inaad ka Wanaagtaan Xaggooda iyo Caddaalad. Eebana wuxuu jecelyahay kuwa cadaalad fala.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Markii uu Banu Qurayzah oggolaaday inuu aqbalo xukunkii Sacad ibnu Mucaad, ayuu nabigu ﷺ u soo cid diray. Wuu yimid, nabigu ﷺ wuxuu yidhi: u istaag madaxiina. Sacad wuxuu xukumay in raggoodii dagaallamay la laayo, dumarkoodii iyo carruurtoodiina maxaabiis ahaan loo kaxaystay. Nabigu ﷺ wuxuu yidhi: waxaad ku xukumaysay xukunkii Alle - ama wuxuu yidhi, xukunkii boqorka.",
      },
    ],
    disclaimer:
      "Tani waxay ciqaab u ahayd fal gaar ah oo ah khiyaano dagaal oo ay galeen dagaalyahannada, oo uu xukumay garqaade qabiilka laftiisa ayaa doortay. Ma aha xukun ka dhan ah dadka diintooda, mana aha tusaale u ah xidhiidhka Yuhuuda ama caqiido kasta, kuwaas oo Islaamku amray in loola dhaqmo caddaalad iyo naxariis (Qur'aanka 60: 8). Qaar ka mid ah culimada dambe ayaa su'aal ka keenay faahfaahinta tirooyinka la gudbiyay.",
  },
  {
    title: "Heshiiskii Xudeybiyah",
    summary: "6 AH - heshiis u ekaa dib u dhac oo noqday guul cad.",
    body: [
      "Dulucda iyo sababta: 6 hijriyada nabigu ﷺ waxa uu la baxay ilaa 1,400 oo saxaabi ah - kuwaas oo aan hubaysnayn laakiin seefihii musaafurka ahaa - iyaga oo damacsan in ay xajka yar ee Kacbada ku soo tukadaan, ee ma aha in ay dagaallamaan. Qureysh, oo aan doonayn in la arko oo Muslimiinta u soo gelaya Makkah, ayaa waxay jidgooyo ka xidheen meel la yiraahdo Xudeybiyah oo ku taalla xuduudka xurmada leh.",
      "Balantii Ridwaan: Markii ay xeradii soo gaareen xanta ah in Qureysh ay dishay ergaygii Nabiga ee Cuthman bin Caffaan, wuxuu Nebigu (scw) u yeeray asxaabtii si ay ugu dhaartaan geed qudhac ah hoostiis oo aysan cararin. Qiyaastii afar iyo toban boqol ayaa bixiyay ballan-qaadkaas - Bay'at al-Ridwaan, Ballanqaadkii Raalli-gelinta Rabbaaniga ah - Qur'aankuna wuxuu markii dambe caddeeyay: \"Ilaah aad buu ugu farxay Mu'miniinta markay geedka hoostiis kuugu ballan qaadeen daacadnimo\" (48:18). Cuthmaan waxa uu muujiyay in uu nool yahay, Quraysh oo ka naxsan go’aanka la soo bandhigay ayaa loo diray wada hadal.",
      "Maxaa dhacay: Qodobbada xabbad joojinta waxay u ekaayeen bahdil. Muslimiintu way soo laabanayaan sanadkan cumro la'aan waxayna soo laaban karaan kaliya kan xiga. Nabad toban sano ah ayaa jiri lahayd. Qof kasta oo Quraysh ka soo carara oo Muslimiinta u soo noqda waa la celinayaa, laakiin ma aha mid ka soo horjeeda - qodob ka soo baxay. Markii nin Muslim ah oo silsilado ku xidhan, Abu Jandal, dib loogu soo jiiday indhahooda hortooda qodobkan, saxaabadu waxay ku dhowaayeen inay jabaan; Cumar si cad ayuu u su’aalay oo si tartiib ah loo xasuusiyay inuu aamino Rasuulka Alle.",
      'Maxay ahayd guul: Markii ugu horraysay Quraysh waxay Muslimiinta ula macaamilootay awood siman oo heshiis qoran ah. Nabaddii tobanka sano ahayd ayaa waddooyinka furtay; Islaamku wuxuu ku faafay si degdeg ah oo nabad ah intii lagu jiray nabadaynta - in ka badan ayaa soo galay Islaamka labadaas sano marka loo eego sannadihii ka horreeyay oo dhan. Isaga oo ka xoroobay Jabhadii Quraysh, Nebigu ﷺ wuxuu u jeesan karayey dhanka Khaybar oo uu u diri karayo waraaqo uu ku casuumayo boqorro iyo qabaa\'il si ay u soo galaan Islaamka. Socdaalkii soo laabashada waxaa soo degtay suuradda al-Faat, iyadoo ku furan: "Waxaan idin siinnay guul cad."',
      "Duruusta waara: Kani waa tusaalaha ugu sarreeya ee sabirka niyadda iyo in Alle iyo Rasuulkiisa la aamino marka caqligu go’aanku weli muuqan. Waxa markii hore saxaabadu dareemeen guul-darro, Qur’aanku wuxuu ku magacaabay guul cad- laba sano gudahooda waxay furtay waddada Makka lafteeda. rabitaanka in la aqbalo nabad adag, ixtiraam axdi, iyo sugitaan halkan waxaa lagu muujiyay qaab xoog, ma daciifnimo.",
    ],
    battleDetails: {
      location: "Xudeybiyah, oo ku taal soohdinta xurmada leh ee u dhow Makkah",
      modernLocation: "Al-Shumaisi, oo u dhow Makkah, Saudi Arabia",
      hijriDate: "Dhul-Qaadh 6 Hijriyada",
      muslimForces: "~ 1,400 oo xujaaj ah, oo aan u qalabayn dagaal",
      opposingForces: "Quraysh, oo jidkii Maka aada xidhay",
      muslimCommander: "Nabi Muxammad ﷺ",
      outcome:
        "xabbad joojin toban sano ah; dagaal la'aan; ka dib loogu yeedhay guul cad oo Qur'aanka ah",
      keyEvents: [
        "Muslimiintii waxay u baxeen cumro ee dagaal uma dhaqaaqin, waxaana lagu joojiyay Xudeybiyah.",
        "Warbixin been ah oo ku saabsan dhimashadii Cuthmaan, ~ 1,400 waxay bixisay Ballantii Ridwaan geedka hoostiisa.",
        "Heshiis toban sano ah ayaa la saxeexay shuruudo ay saxaabadu ka heleen qadhaadh (Qodobka soo noqoshada, Abu Jandal).",
        "Islaamku si xawli ah ayuu u fiday xilligii nabadda; Suuradda al-Fatx waxay heshiiska ku tilmaantay guul cad.",
      ],
      leadershipLesson:
        "Nabad adag aqbal oo sharaf; tanaasul xikmad leh maanta waxay furi kartaa albaab ka weyn berrito.",
      spiritualLesson:
        "Allah iyo Rasuulkiisa ku kalsoonow marka ay go'aanku xikmaddiisu qarsoon tahay - samirku waa guusha ugu runta ah.",
    },
    quran: [
      {
        excerpt:
          "Annagaa idin siinnay liibaanta cad, si Eebe idiin dhaafo wixii dambigiinna ka horreeyay iyo waxa ka dambeeyaba, idiinna dhammaystiro nicmadiisa, idinkuna hanuuniyo jidka toosan.",
      },
      {
        excerpt:
          "Dhab ahaan Eebe wuu ka raalli noqday Mu'miniinta markay idinku ballameen geedka hoostiis, wuxuuna ogaa waxa quluubtooda ku sugan, markaasuu ku soo dejiyey xasillooni, wuxuuna ku abaal-mariyey fidmo dhaw.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Jaabir bin Cabdullaahi wuxuu yiri: Maalintii Xudeybiyah waxaan ahayn afar iyo toban boqol. Waxaan u ballan qaadnay nabiga ﷺ geedka hoostiisa, wuxuuna ahaa dadka ugu kheyr badan.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Safarkii Khaybar",
    summary: "7 AH - dhufeysyo deyrar ah oo taageeray Confederates waa la jabiyay.",
    body: [
      "Dulucda iyo sababta: Khaybar waxay ahayd silsilad qalcadaha bacrin ah oo bacrin ah oo woqooyi ka xigta Madiinah, oo ay deggan yihiin qabaa'ilkii hore loogu eryay khiyaano - oo ay ku jiraan madaxdii Banu Nadiir oo abaabulay isbahaysiga Confederate ee Trench. Halkaa ayay ka sii wadeen cadawgii Madiina. Markii horgaladii Qureysh ay xayireen Xudeybiyah, nabigu ﷺ wuxuu u dhaqaaqay inuu ka takhaluso saldhiggan colaadeed ee soo haray.",
      "Maxaa dhacay: Muslimiintii - ilaa 1,600 - waxay mid mid u soo baxeen qalcadaha. Ololuhu wuxuu ahaa mid adag oo la soo saaray dhowr toddobaad. Maalin adag ayuu nabigu s.c.w ku yidhi barri waxaan calan u dhiibi doona nin Alle iyo rasuulkiisa jecel oo Alle iyo Rasuulkiisu jecel yihiin oo uu Alle gacmihiisa ku guulaysto. Subixii dambe ayuu u yeedhay Cali bin Abii-dhaalib- oo indhuhu ka xanuunsadeen-- u duceeyay ilaa uu ka bogsaday, wuxuuna u dhiibay calankii; qalcaddii furaha ayaa dhacday.",
      "Deegaanka: Marka dhufaysyada la qabsaday, dadkii degganaa lama eryin. Waxay codsadeen inay sii joogaan oo ay sii wadaan tacbashada dhulka, iyagoo Muslimiinta siinaya qayb ka mid ah miraha, Nabiguna ﷺ wuu aqbalay. Nidaamkan - beeralayda la qabsaday ayaa lagu hayaa dhulkooda iyada oo la raacayo heshiis wax-soo-saarka - waxay noqotay horudhac hore oo lagu bartay sharciga Islaamka ee heshiisyada iyo canshuuraha.",
      "Shakhsiyaadka muhiimka ah: ololaha waxa lagu xasuustaa kaalintii Cali iyo akhlaaqda ku duugan xadiithka calamada — in hoggaanka lagu aamino daacadnimo iyo Alle jacayl, ee aan lagu aamini karin darajo iyo xoog.",
      "Qoraal ku saabsan daryeelka: Khaybar mararka qaarkood waxaa loo jiidaa muranno siyaasadeed oo dambe. Halkan waxa si adag loogu sifeeyey socdaalkii qarniga toddobaad ee lagu diiwaan geliyey seerah qadiimiga - jawaab celinta saldhig cadawtooyo oo firfircoon, oo aan lagu soo gebagebayn cayrin ballaaran balse lagu dhammeeyey gorgortan.",
    ],
    battleDetails: {
      location: "Xeebta Khaybar, waqooyiga Madiina",
      modernLocation: "Khaybar, Sacuudi Carabiya",
      hijriDate: "Muxaram–Safar 7 Hijriyada",
      muslimForces: "Ilaa 1,600",
      opposingForces: "Gariishyo la xoojiyey oo dhawr dhufays ah dhex maray",
      muslimCommander: "Nabi Muxammad ﷺ; Cali bin Abii-dhaalib ayaa hogaaminayay weerarkaas culus",
      outcome:
        "Gacan ku haynta muslimiinta qalcadaha; heshiis wax-soo-saar-wadaag ah oo laga wada-hadlay",
      keyEvents: [
        "Qalcadaha ayaa mid mid loo dhimay dhowr toddobaad oo go'doomin ah.",
        "Calankii waxaa la siiyay Cali, oo indhihii nabigu ﷺ ku bogsiiyey salaaddiisa.",
        "Horyaalkii Marhab waa laga adkaaday, qalcaddii furahana waa dhacday.",
        "Dadka deegaanka ayaa ku haray dhulkooda sidii beeraley ahaan iyadoo la raacayo heshiis wax-soo-saarka.",
      ],
      leadershipLesson:
        "Mas'uuliyadda u dhiibo kuwa ugu habboon - iyo kuwa qalbigoodu u daacad yahay Eebbe.",
      spiritualLesson:
        "Ku adkeysiga dhibaatada daba dheeraatay, ku biirista daacadnimada, waxay keentaa gargaarka Eebe.",
    },
    hadith: [
      {
        excerpt:
          "Maalinta Khaybar Rasuulku (scw) wuxuu yidhi: “Brito waxaan calankan siinayaa nin Alle iyo Rasuulkiisa jecel, Eebbe iyo Rasuulkiisuna jecel yihiin, gacantiisana Eebbe ku guuleeyo. Maalintii dambe ayuu u yeedhay Cali oo indhihiisu ka xanuunsadeen; Intuu indhihiisa ka tufay oo u duceeyey, Calina wuu bogsaday sidii isagoon weligii bukoon, oo calankii baa loo dhiibay.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Dagaalkii Mu'tah",
    summary:
      "Jumada al-Ula 8 H - waa duullaan xuduudeed halkaas oo saddex taliye ay ku shahiideen.",
    body: [
      "Dulucda iyo sababta: Nebigu ﷺ waxa uu ergey u soo diray dhanka woqooyi ee ay isku raacsan yihiin Byzantine, ergaygiina waa la dilay - jebin weyn, maadaama ergada ay ilaalinayeen sharciga quruumaha. Isaga oo ka jawaabaya waxa uu u diray ciidan ku dhow 3,000 oo ku wajahan Mu'tah, oo u dhow xudduudda Roomaanka ee bari ee Urdun.",
      "Silsiladda amarka: Ka hor intaanay ambabixin, Nebigu (scw) wuxuu magacaabay saf uu hoggaamiyo Zayd bin Xaarithah, haddii uu dhacona Jacfar bin Abii Daalib, haddii uu dhacona Cabdullaahi ibnu Rawaaxah - waa fal-aragti cajiib ah oo go'aan qaadasho leh.",
      "Maxaa dhacay: Mu'tah Muslimiintu waxay la kulmeen ciidan aad u weyn oo Byzantines ah iyo qabiilo carbeed oo isbahaystay - ilo-wareedyadu waxay ka hadlaan tobanaan kun, inkastoo tirooyinka aan la hubin oo ay u badan tahay in la buunbuuniyey. Zayd wuu dhacay, ka dibna Jacfar - oo lagu xasuusto inuu haystay calanka ilaa ay labadiisa gacmood ka go'een - ka dibna Cabdullaahi ibnu Rawaaxah, sidii uu Nabigu ﷺ u dhigay.",
      'Ka bixistii: Markii ay shahiideen saddexdii taliye ee la magacaabay, saxaabadu waxay calankii u dhiibeen Khaalid bin al-Walid oo ku cusbaa Muslim Xudeybiyah dabadii. Dhaqdhaqaaqyo isdaba joog ah iyo dib-u-dhigis ayuu ku kala diray ciidankii tirada badnaa, wuxuuna keenay gurigii oo dhan - waa wacdaro uu Nebigu ﷺ ku sharfay, markii dambena wuxuu Khaalid ku tilmaamay "Seef ka mid ah seefaha Alle." Madiina Nabigu ﷺ wuxuu u ooyay Zayd, Jacfar, iyo Ibnu Rawaaxah, wuxuuna u sheegay shuhadadoodii ka hor inta uusan Rasuul imaanin.',
      "Casharro waara: magacaabista kuwa beddelaya khatarta ka hor - joogtaynta hoggaaminta - run ahaantii badbaadisay ciidan; Dib-u-noqoshada habaysan ee nafta badbaadisa ceeb maaha ee waa xigmad. Shuhadada Alle dartiis waa karaamo ee maaha guuldarro siyaasadeed, sidoo kale dagaalku wuxuu muslimiinta u soo bandhigay hadyadihii Khaalid, muddo yar ka dibna waxay u jeesteen u adeegidda iimaanka.",
    ],
    battleDetails: {
      location: "Mu'tah, oo bari ka xigta Webiga Urdun",
      modernLocation: "Meel u dhow Karak, Jordan",
      hijriDate: "Jumada al-Ula 8 AH",
      muslimForces: "~3,000",
      opposingForces:
        "Byzantine iyo ciidamada Carabta ee xulafada ah (oo aad uga weyn; tirooyinka aan la hubin ilaha)",
      muslimCommander:
        "Zayd bin Xaarithah, dabadeed Jacfar, dabadeed Ibnu Rawaaxah, ka dibna Khaalid bin al-Walid.",
      outcome: "Si habsami leh uga bixitaan Muslim; shahiid culus laakiin ciidanka ayaa ilaashaday",
      keyEvents: [
        "Nebigu ﷺ wuxuu magacaabay saddex taliye oo kala dambeeyaan inta aanu dhoofin.",
        "Saddexdiiba mar bay ku dhaceen Mu'tah, sidii la sii sheegay.",
        "Khaalid bin al-Walid ayaa madax ka dhigay, ciidankiina meel ammaan ah ayuu u jiheeyay.",
        "Nebigu (scw) wuxuu ku ooyay Madiina wuxuuna ku bishaareeyay shuhadada intaan warku soo gaarin.",
      ],
      leadershipLesson:
        "Magacaabo kuwa beddelaya ka hor intaanay khatartu dhicin - hogaaminta cad waxay badbaadisaa nolosha.",
      spiritualLesson:
        "Shuhadada Alle dartiis waa sharaf; ka bixitaan caqli leh oo ciidan badbaadiya guul ma aha.",
    },
    appLinks: [{}],
  },
  {
    title: "Qabashadii Makkah",
    summary: "Ramadaan 8-dii Hijriyada - Furitaanka Makah oo aan dhiig ku daadan",
    body: [
      "Dulucda iyo sababta: Heshiiskii Xudeybiyah wuxuu socday ilaa xulafadii Qureysh, Banu Bakar, ay weerar ku qaadeen xulafadii Muslimiinta, Banu Khuzaaah - iyagoo qaar ka mid ah laayay xitaa gudaha xaramka - iyadoo Qureysh si qarsoodi ah hub u siisay. Tani waxay burburisay xabbad joojintii. Markii Quraysh isku dayday in ay isku dhejiso ay ku fashilantay, waxaa furnaa wadadii Makka.",
      "Maxaa dhacay: Nebigu (scw) wuxuu la baxay ilaa 10,000 oo saxaabi, wuxuuna u socday si degdeg ah oo qarsoodi ah, Qureyshna ma helin waqti ay ku abaabulaan iska caabin. Abuu Sufyaan oo ahaa abaanduulihii hore ee Qureysh ayaa soo baxay oo qaatay diinta Islaamka maalintii la soo galayey. Ciidanku waxay Makka ka soo galeen dhowr jiho iyadoo aan wax dagaal ah dhicin - kaliya hal tiir ayaa la kulmay iska caabin hubaysan oo kooban; Rasuulku ﷺ wuxuu si cad ugu amray taliyayaashiisa inaysan la dagaallamin kuwii la dagaalamay mooyaane.",
      "Cafiska: Tani waa wakhtiga qeexaya qabsashada. Isagoo Kacbada la taagan magaaladii jirdilka, qaadacday, eryi jirtayna hadda naxariistiisa darteed, ayuu Nabigu (scw) Qureysh weydiiyey waxa ay ka filayaan, kadibna wuxuu ku dhawaaqay — isagoo ku celcelinaya hadalkii Nebi Yuusuf ku yiri walaalihii dulmiyey – “Eedina maanta idinkama saarna ee taga idinka xor baad tihiin”. Cafis guud ayaa daboolay dadweynaha; in yar oo kaliya ayaa laga reebay dambiyo gaar ah, oo xitaa intooda badan waa la cafiyay markii ay u yimaadeen.",
      'Nadiifinta: Nabigu ﷺ ka dib waxa uu Kacbada ka nadiifiyay 360 sanam oo ay ku jirtay, isaga oo akhrinaya, “Xaqii ayaa yimid, beentuna waa la tirtiray” (Qur’an 17:81). Bilaal bin Rabaax, ayaa mar lagu jirdilay isaga oo addoon ah isla magaaladaas, wuxuu fuulay Kacbada dusheeda, wuxuuna carrabka Makkah ugu yeeray. Suuradda An-Nasr - "Markii ay timaaddo liibaanta Eebe iyo guuleysiga" - waxay calaamad u tahay furitaankan iyo dadkeeda oo soo galaya iimaanka.',
      "Casharro waara: tani waxay ka mid tahay muujinta ugu weyn ee dabeecadda nebiyada ee lagu isticmaalo awoodda. Weynaanta guusha waxay kasbatay quluub ka badan ciqaab kasta; Hadafka oo dhan wuxuu ahaa hanuunin, ma ahayn aargoosi, iyo awoodda ayaa la sameeyay si loogu adeego fariinta halkii ay ka ahaan lahayd nafta. Waxaa si habboon loogu yeeraa Fath Makkah - Furitaanka - maaha cayriin.",
    ],
    battleDetails: {
      location: "Makkah",
      modernLocation: "Makkah, Saudi Arabia",
      hijriDate: "Ramadaan 8 hijriyada",
      muslimForces: "~10,000",
      opposingForces: "Quraysh (waxay isdhiibeen ku dhawaad ​​dagaalla'aan)",
      muslimCommander: "Nabi Muxammad ﷺ",
      outcome: "Makkah waxay furtay ku dhawaad ​​dhiig la'aan; cafis guud ayaa lagu dhawaaqay",
      keyEvents: [
        "Xabbad-joojintu waxay jabtay markii ay Quraysh taageertay weerar lagu qaaday xulafadii Muslimiinta ee Khuzaacah.",
        "Abuu Sufyaan wuu islaamay ka hor intaanay ciidanku soo gelin; gurigiisa waxaa loo aqoonsaday meel nabdoon.",
        "Nebigu (scw) wuxuu bixiyay cafis guud: Wax dambi ah kuguma aha maanta - tag, xor baad tahay.",
        "Kacbada waxa laga nadiifiyey sanamkeedii; Bilaal ayaa kor uga yeedhay adhan.",
        "Cadawgii hore aad bay u islaameen.",
      ],
      leadershipLesson:
        "Weynaanta guushu waxay ku kasbataa quluubta si ka sii waarta cabsida ama aargoosiga.",
      spiritualLesson:
        "Ujeedadu waxay ahayd hanuun, ma ahayn aargoosi - awood ayaa loo sameeyay si loogu adeego fariinta, ma aha nafta.",
    },
    quran: [
      {
        excerpt:
          "Markay Liibaanta Eebe timi iyo Fatuuq, ood Aragto Dadka oo Diinta Eebe u soo galaya Kooxo badan, markaas ku Tasbiixso Mahadda Eebahaa, Dambi Dhaafna waydiiso. Eebana waa aqbal toobada.",
      },
      {
        excerpt:
          "Wuxuu yiri:- maanta danbi ma laha. Alle ha ku danbi dhaafo, isagaana naxariis badan. - Hadalkii Nebi Yuusuf ee uu Nabigu ﷺ kula hadlay Qureysh maalintii la qabsaday.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Dagaalkii Xunayn",
    summary:
      "Shawwal 8 H - weerar gaadmo ah ka dib Makkah; Kalsoonida la tijaabiyay, dabadeed guusha la siiyay.",
    body: [
      "Dulucda iyo sababta: Wax yar ka dib markii la furay Makkah, qabaa'ilkii xoogga badnaa ee Hawazin iyo Thaqiif ayaa soo ururay si ay u laayaan Muslimiinta ka hor intaanay xukunkooda cusubi dhicin. Rasuulku ﷺ wuxuu la baxay ciidan badan - ilaa 12,000, oo ay ku jiraan qaar badan oo dhawaan soo islaamay oo reer Makkan ah - cududii ugu badnayd ee muslimiin ah oo la ururiyo. Marka la eego cabbirkeeda, ragga qaarkood waxay dareemeen kalsooni aanay aqoon, waxaana la sheegay in qof uu sheegay in aan looga adkaan karin tirooyin.",
      "Maxaa dhacay: Cadowgu wuxuu gaadmo u dhigay dooxada Xunayn ee cidhiidhiga ah. Muslimiintii markii ay soo dhaadhacday waabariga badhkii, ayaa duufaan fallaadho ah ku soo dhacday meel sare oo ay waardiyaha ka jabtay. Argagax baa fiday oo in badan oo ka mid ah ciidankii weynaa ayaa jeestay oo cararay - tiradii kalsoonida keentay ayaa hadda qaaday weerarka.",
      'Arrinka rogaal-celinta: Fawdada Rasuulku (scw) kamuu cararin. Baqalkiisii ​​ayuu cadowgii u sii riixay, isagoo kor ugu dhawaaqaya, "Anigu waxaan ahay nebi, taasi been ma aha, waxaan ahay ina Cabdil-Muddalib." Muhaajiriinta iyo Ansaarta xudunta u ah - iyadoo Cabbaas uu asxaabtii dib ugu yeerayay - ayaa ku soo ururay isaga. Muslimiintiina dib bay u dhismeen, oo kuwii gaadmada ahaa ku soo jeesteen, wayna jabiyeen; Maxaabiis iyo booli badan ayaa la dhacay.',
      "Wixii ka dambeeyay: Ololuhu waxa uu sii socday go’doomintii Taa’if, taas oo aan hal mar dhicin. Ka dib, markii ay Hawazin yimaadeen dadkoodii, nebigu ﷺ wuxuu soo celiyay maxaabiistii - isagoo doortay heshiis iyo qalbi jilicsanaansho ilaalinta qaniimada, oo si deeqsinimo leh ugu xaglinaya kuwa cusub ee Makkan si ay ugu xidhaan iimaanka.",
      "Qur’aanku maalintan ayuu si toos ah uga hadlay khatarta ay leedahay in la isku halleeyo tirooyinka: “Maalintii Xunayn, markii ay tiradiinii badnayd ay idinka raalli geliyeen, laakiinse aydaan waxba idiin tarin…” (9:25-26). Casharka waaraya waa mid cad - waligaa ha ku tiirsanaan tirooyinka, hantida, ama guusha dhow; guushu waa hibada Alle oo keliya - iyo wanaagga mataanaha ah ee hoggaamiyaha u taagan si adag oo muuqda marka xertiisu argagaxaan.",
    ],
    battleDetails: {
      location: "Dooxa Xunayn oo u dhexeeya Maka iyo Taa'if",
      modernLocation: "Meel u dhow Ta'if, Sacuudi Carabiya",
      hijriDate: "Shawaal 8 hijriyada",
      muslimForces: "~ 12,000 (oo ay ku jiraan qaar badan oo cusub oo reer Makkan ah)",
      opposingForces: "Hawazin iyo Thaqiif",
      muslimCommander: "Nabi Muxammad ﷺ",
      outcome: "Guusha Muslimka ka dib rafaad bilow ah",
      keyEvents: [
        "Ciidankii ugu badnaa ee Muslimiinta ayaa weli kalsooni ku abuuray tiradooda dagaalka ka hor.",
        "Waaberigii oo dooxa ka dhacay ayaa kala firdhiyey waardiyihii oo argagax ballaadhan abuuray.",
        "Nebigu ﷺ wuu istaagay oo mu’miniinta u yeedhay; xudun u ah ayaa ku hareeraysan.",
        "Muslimiintii dib bay u sameysteen oo cadawgii jabiyeen; go'doomintii Taa'if ayaa raacday.",
        "Maxaabiistii ayaa markii dambe dib loo soo celiyay si ay dib u heshiisiin u sameeyaan.",
      ],
      leadershipLesson:
        "Hogaamiyuhu waa inuu ahaadaa mid muuqda oo deggan marka taageerayaashu argagaxaan - joogitaanka ayaa kor u qaadaya darajooyinka.",
      spiritualLesson:
        "Weligaa ha isku hallayn tirooyinka ama guusha dhow; guul iyo xasillooni waxay ka timaadaa Allaah uun.",
    },
    quran: [
      {
        excerpt:
          "Eebbana waa idiin rumeeyey gobollo badan iyo maalintii Xunayn markay idinka raalli noqdeen badnaantiinnii oon waxba idiin tari jirin, dhulkiina ballaadhkiisuna idiin xidhmay, markaasaad jeedsateen idinkoo carari. Markaasuu Eebe ku soo dejiyey xasiloonidiisa Rasuulkiisa iyo Mu'miniinta.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Al-Bara bin Caziib ayaa la weydiiyey inay carareen maalintii Xunayn iyo in kale. Wuxuu yiri: Laakin Rasuulku ﷺ ma cararin. Dadkii dib bay u noqdeen, Nabiguna ﷺ wuxuu saarnaa baqalkiisii ​​caddaa, wuxuuna yidhi: anigu waxaan ahay nebi, kani been ma aha; Waxaan ahay ina Cabdil-Mudalib.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Duulaankii Tabuuk",
    summary:
      "Rajab 9 hijriyada - socodkii ugu adkaa, ee kulaylka xagaaga, imtixaanada iimaanka dagaal la'aan.",
    body: [
      'Dulucda iyo sababta: Warbixino soo gaaray Madiina ayaa sheegaya abaabul ballaaran oo ay Bizantine ka wadaan xuduudka waqooyi. Nebigu ﷺ wuxuu ku baaqay olole Tabuuk - oo, si aan caadi ahayn, wuxuu u magacaabay meesha loo socdo si cad halkii la qarin lahaa, sababtoo ah socodku wuxuu noqon lahaa mid aad u dheer oo aad u adag oo qof kastaa wuxuu u baahan yahay inuu si daacad ah u diyaariyo. Waxay ku dhacday kulaylka kulul ee xagaaga sare, wakhtiga goosashada, marka safarka iyo kharashku ay ahaayeen kuwa ugu culeyska badan - waxaa loo yaqaan "fiditaanka dhibaatada."',
      "Tijaabada naf-hurnimada: Baaqu waxa uu dhigay quluubta bulshada. Cuthmaan wuxuu qalabeeyey qayb badan oo ciidanka ka mid ah oo uu ka helay hantidiisa; Abuu Bakar wuxuu siiyey wax kasta oo uu lahaa; Cumar wuxuu siiyey nuskiisii. Saxaabada ugu saboolsan ee aan haysan wax ay bixiyaan ayaa ooyay sababtoo ah way ka qayb qaadan waayeen - Qur'aanka ayaa qoray ilmada (9:92). Waxaa ku hor istaagay munaafiqiinta, kuwaas oo alifay cudur daar ay ku joogaan oo ay suuradda At-Tawbah soo bandhigtay in badan.",
      "Maxaa dhacay: Ciidankii - kii ugu weynaa ee uu Nabigu ﷺ hogaamiyo, laga yaabee 30,000 - waxay gaareen Tabuuk ka dib socod dhib badan. Ma jiro ciidan Byzantine ah oo u muuqday inay dagaal bixiyaan. Halkii ay natiijo madhan ka soo bixi lahayd, duullaanku waxa uu heshiisyo la galay qabaa'ilka iyo saldanada woqooyiga, waxa ay kordhiyeen ammaanka bulshada, waxana ay muujiyeen diyaargarow laftoodu ka hortagaya gardarada.",
      "Saddexdii hadhay: Inta hadhay waxa ka mid ahaa saddex mu’miniin oo daacad ah — Kacab ibnu Maalik, Hilaal ibnu Umayyah, iyo Murarah bin Rabiic— kuwaas oo aan cudur daar sax ah haysan, si dhab ah u diiday inuu ka been sheego. Waxaa la qaadacay konton maalmood, dhulkuna “siduu ahaa” wuu ku xirmay, ilaa laga aqbalay toobadkeenii, Quraankuna uu ku dhawaaqay cafiskooda (9:118). Daacadnimadooda marka la tijaabinayo waa mid ka mid ah dhacdooyinka ugu xiisaha badan seerah.",
      "Casharro waara: u-diyaargarowga difaaca bulshada laftiisa waa ficil iimaan leh xitaa marka aan seef la bixin; allabari aan degdeg ahayn, abaal-marin muuqata ayaa ka mid ah imtixaannada ugu sarreeya; iyo run sheegid - Kacab in uu diido in uu naftiisa ku badbaadiyo beenta - Alle agtiisa ayaa ka jecel beenta raaxada leh. Suuratu at-Tawbah waxay qaabaysay duullaankii oo dhan oo ku wareegsan mawduucyadan.",
    ],
    battleDetails: {
      location: "Tabuuk, oo ku taal wadada dhanka xuduuda Byzantine",
      modernLocation: "Tabuuk, Sacuudi Carabiya",
      hijriDate: "Rajab 9 hijriyada",
      muslimForces: "~ 30,000 (Ciidankii ugu badnaa ee Nabigu ﷺ hogaamiyo)",
      opposingForces: "Ciidan Byzantine ah ayaa la soo sheegay laakiin uma muuqan dagaal",
      muslimCommander: "Nabi Muxammad ﷺ",
      weather: "Kulayl xagaaga oo aad u daran, wakhtiga goosashada",
      outcome:
        "Dagaal la'aan; heshiisyadii waqooyiga oo la sugay; beeshu way tijaabisay oo shaandhaynaysay",
      keyEvents: [
        "Rasuulku ﷺ wuxuu u magacaabay meel fog oo loo socdo si bareer ah dhibka socodka.",
        "Cuthmaan, Abuu Bakar, Cumar, iyo kuwo kale ayaa si deeqsinimo ah u bixiyay; masaakiinta ayaa ku ooyay wax ay siiyaan.",
        "Munaafiqiintu waxay sameeyeen cudur daar ay ku hadheen waxayna ku soo bandhigeen suuradda at-Tawbah.",
        "Ma jiro cadow ku hawlan; heshiisyo lala galay qabaa'ilka woqooyiga iyo taliyayaashii.",
        "Saddex rumaystayaal run ah ayaa la qaadacay 50 maalmood ilaa laga aqbalayo toobadkeena (Qur'aanka 9:118).",
      ],
      leadershipLesson:
        "Si daacad ah uga hadal dhibaatada iyo kharashkeeda; daah-furnaanta waxay dhistaa kalsooni waxayna diyaarisaa rabitaannada.",
      spiritualLesson:
        "allabaryo aan lahayn abaalgud muuqda, iyo run sheegid marka la tijaabiyo, ayaa ka mid ah imtixaannada ugu sarreeya ee iimaanka.",
    },
    quran: [
      {
        excerpt:
          "Kuwii hadhayna way ku farxeen inay Rasuulka (scw) gadaashaan oo naceen inay ku jahaadaan xoolahooda iyo naftooda Jidka Eebbe, waxayna dheheen: ha u bixin kulaylka. Waxaad dhahdaa Naarta Jahannamo yaa ka daran kulayl hadday wax kasayn.",
      },
      {
        excerpt:
          "Wuuna u dambidhaafay saddexdii hadhay ilaa dhulku waasac yahay, kuna xidh-xidhay naftoodu, waxayna yaqiinsadeen inaan Eebe agtiisa ahayn oo laga magan galo. Markaasaa Eebe u naxariistay inay u toobad keenaan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kacab bin Maalik wuxuu uga warramay sidii uu uga hadhay Tabuuk cudur daar la'aan oo aanu been ka sheegin; Nebigu (scw) wuxuu mu’miniinta faray inaysan la hadlin isaga iyo labadiisa saaxiib konton habeen, ilaa uu dhulku cidhiidhi ku ahaado – markaasay u timid waxyigii dambi-dhaafkooda, waxayna ka mid ahayd maalmihii ugu farxadda badnaa noloshiisa.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ghazawat iyo Saraya",
    summary: "Farqiga u dhexeeya ololayaasha waaweyn iyo qaybo yaryar.",
    body: [
      "Gaazwah waa duullaan uu Nebigu ﷺ shakhsi ahaan uga qayb qaatay - culimadu waxay tiriyeen toddoba iyo labaatan, oo ay ku jiraan Badar, Uxud, Trench, Xudeybiyah, Khaybar, furitaankii Makkah, Xunayn, iyo Tabuuk.",
      "Sariyah (Sarayja jamac) waa koox loo soo diro taliye la magacaabay iyadoon Nebigu ﷺ ku biirin - ku dhawaad ​​konton hawlgal oo noocaas ah ayaa la duubay, sahan, ka jawaabista duullaanka, gelbinta, ama ku martiqaadida qabaa'ilka Islaamka.",
      "Qaar badan oo saraya ah kuma lug lahayn wax dagaal ah haba yaraatee - waxay ahaayeen dublamaasiyad, roondo, ama muujinta awood dagaal ka dhigtay mid aan loo baahnayn. Kuwo kale, sida socdaalkii Mu'tah, waxay ku lug lahaayeen dagaal culus iyo khasaare culus.",
      "Fahamka faraqani waxa uu ilaalinayaa in la buunbuuniyo tirada 'dagaalladii' horraantii Islaamka. Qiyaastii tobankii sano ee la soo dhaafay, dagaalladii dhabta ahaa way yaraayeen; Inta badan socodku waxay ahaayeen kuwo ka hortag ah, dublamaasiyadeed, ama aan dhiig ku daadan, ilo-wareedyaduna waxay cabbiraan dhammaan xilliga nebiyadu inay yihiin iftiin la yaab leh oo luminaya nolosha waagiisii.",
    ],
    actions: [
      "U fiirso wakhtiga si aad u aragto dhacdooyinka la soo qaaday, kuwaas oo ahaa go'doomin, iyo kuwaas oo ahaa socod aan dagaal lahayn.",
      "Akhri erey bixinta ghazwah iyo sariyah si aad qaybaha u caddayso.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dagaalladii Nabiga ﷺ ka dib",
    summary:
      "Waxqabadyo waaweyn oo hoos yimaada Khulafadii Xaqa-Hagayay - oo ka duwan xilligii nebiyada.",
    body: [
      "Ka dib markii uu nebigu geeriyooday sanadkii 11 ee Hijriyada (632 miilaadiga), bulshada waxaa hogaaminayay khaliifyada Abuu Bakar, Cumar, Cuthmaan iyo Cali (Alle haka raali noqdee) dagaaladii Ridda ( riddada) ee lagu fidiyay Sasanian Persia iyo Bizantine Shaam, aakhirkiina fitno gudaha ah.",
      "Dhacdooyinkaas waxay leeyihiin taariikhda Islaamka, laakiin maaha kuwo sunno ah sida ficillada Nebigu ay yihiin. Waa in lagu daraaseeyaa agabka taariikhda iyo baraarujinta in culimada muslimiinta laftoodu ay ka doodaan tafaasiilkooda, ujeeddooyinkooda iyo duruustooda.",
      "Dagaalkii Al-Qadisiyyah (c. 636 C.D): Sacad bin Abii Waqqaas wuxuu hoggaaminayay ciidamadii Muslimiinta ee ka soo horjeeday ciidankii Sasaniyiinta ee Ciraaq - waa bar-rog u furtay Faaris.",
      "Battle of Yarmuuk (636 CE): Taliyeyaal uu ka mid yahay Khalid ibn al-Walid ayaa la kulmay Byzantines ee Suuriya olole go'aan ah oo soo afjaray awoodda weyn ee Byzantine ee Levant - oo loo bartay taariikh milatari, ma aha sida Sunnada nebiyada.",
      "Dagaalkii Nahavand (c. 642 CE): Ilaha Carabiga waxaa lagu xasuustaa 'Guusha Guulaha', waxay jabisay iska caabintii Sasanian ee soo hartay. Taariikhaha iyo tirooyinka ciidanku way ku kala duwan yihiin taariikhyahannada.",
    ],
    actions: [
      "Baro dagaalladii nebiyadu marka hore - waxay yihiin tixraaca asaasiga ah ee anshaxa iyo sharciga.",
      "U soo dhawow guul-darrooyinka dambe si dhib yar; dagaalna ha ku faanin, taariikhda kakanna halhays ha u dhigin.",
    ],
    disclaimer:
      "Tirooyinka, ujeedooyinka, iyo qiimeynta akhlaaqda ee qabsashadii nebiyadii ka dib ayaa taariikhyahannadu ka doodeen. Dulmarkan waxa loogu talagalay hanuunin, ee maaha mid cakiran.",
  },
  {
    title: "Casharrada hoggaaminta",
    summary: "Dulqaad, shuura, naxariis, iyo talo saarashada Alle - ma aha xeelad kaliya.",
    body: [
      "Qaabka nebiyada ee hoggaaminta colaaddu waxay ka dhigaysaa dabeecadda ka sarreysa xariifnimada. Go'aamo waaweyn ayaa lagu gaaray wada-tashi (shuura) - ceelasha Badar, godka go'doominta Confederation, shuruudaha Xudeybiyah - xitaa halka waxyigu ay hadhow xaqiijin doonaan natiijada. Hoggaanku waa la dhegaystay ka hor inta aanu falgelin.",
      'Dulqaadku waxa uu qaabeeyey xayndaabka guul kasta. Nabadgelyadii adkaa ee Xudeybiyah ayaa laba sano gudahood u horseeday Furitaanka Makkah. Naxariistii Makkah - "Tag, xor baad tahay" - waxay kasbatay dadkii silcin jiray bulshada. Edbintii qadhaadhaa ee lagu bartay Uxud ayaa ka hor istaagtay in ay soo noqoto masiibadaas.',
      "Geesinimo ayaa laga muujiyay sida seefta korkeeda: u taagan oo la arki karo markii ciidanku Xunayn ka cararay; oo ciidda ku sido godka ay la socdaan qodayaasha; iyo -ka ugu adag - in la cafiyo saacada awooda wadarta kuwa mar kaa eryay gurigaaga.",
      "Talo saarashada Allaah (Tawakkul) marna macnaheedu maaha in la dayaco waxa loo baahan yahay. Indho-indheeye ayaa la diray, dhul baa la doortay, hubkiina waa la xidhi jiray, jeexdin baa la qoday, kuwii beddeli lahaana waa la magacaabay, heshiisyadiina waa la maamuusay. Mu'miniintu waxay sameeyeen wax kasta oo ay awoodaan, ka dibna waxay u wakiisheen natiijadii Eebe - in midawga dadaalka buuxa iyo talasaaridda buuxda ay tahay wadnaha tusaalaha.",
    ],
    actions: [
      "Go'aan adag ka hor, weydii: Runtii miyaan la tashaday kuwa aqoonta leh?",
      "Guul ka dib, weydii: miyaan u naxariisanayaa, mise waxay isu rogtay kibir?",
      "Dib u dhac, weydii: ma caasinimo ayaa jirta in la saxo, ama cashar Alle uu ula jeedo in aan barto?",
    ],
    appLinks: [{}],
  },
  {
    title: "Xadiis saxiix ah oo ku saabsan dagaallada",
    summary:
      "Sheekooyin la xushay oo leh darajooyin - ku saabsan dhaqanka, dulqaadka, iyo dhacdooyinka muhiimka ah.",
    body: [
      "Xadiiska ku saabsan socdaalada waa in la hubiyaa inuu sax yahay ka hor inta aan la isku hallayn. Sheekooyinka hoose waxa laga soo minguuriyay ururinta Saxiixa waxayna khusaysaa hab-dhaqanka iyo niyad-jabka ololahan; mid walba darajadiisa ayuu sitaa.",
      "Sheekooyinka ku xidhan hawl-gal gaar ah, eeg mawduuca dagaalkaas. Isticmaal browserka xadiiska Munib si aad u akhrido silsilado buuxa iyo shahaado bixinta macnaha guud.",
    ],
    hadith: [
      {
        excerpt:
          "Ha rabin inaad la kulanto cadowga, oo Alle weydiiso badbaado. Laakiin markaad la kulanto u samir, ogaadana in Jannadu ay hoos jiifto seeftu.",
      },
      {
        excerpt:
          "Nabigu ﷺ wuxuu yidhi: Dagaalku waa khiyaano. - Culimadu waxay tani ku macneeyeen ogolaanshaha xeeladaha xeeladaha dagaalka (feints, la yaab, jahawareerin), weligoodba sida shatiga jabinta axdiga ama khiyaameeya dhinac la ilaaliyo.",
      },
      {
        excerpt:
          "Markii uu magacaabay taliyaha nabigu ﷺ wuxuu faray inuu Alle ka cabsado, oo uu cadowga ugu yeedho Islaamka ka hor dagaalka, in aanu ballanta ka bixin, in aanu googo’in, ilmo yarna aanu dilin.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Tixraacyo iyo ilo",
    summary: "Seerah Classical waxay shaqeysaa iyo sida loo akhriyo si adag.",
    body: [
      "Ilaha seeraha aasaasiga ah waxaa ka mid ah Sirah Ibn Isxaaq (oo lagu xafiday Ibn Hishaam), al-Waaqidi's Kitab al-Magazi, Ibn Sacad's Tabaqat, iyo Ibn Kathir's al-Bidayah wan-Nihayah. Mid kastaa wuxuu leeyahay awooddiisa iyo dardaarankiisa cilmiyeed.",
      "Ibnu Isxaaq (oo loo sii marayo Ibn Hishaam) waa qisada aasaaska ah; al-Waaqidi waxa uu bixinayaa tafaasiil qani ah oo dagaal ah, laakiin qaar ka mid ah warbixintiisa waxaa ku khilaafay dadka xadiithka naqdiya; Ibnu Kathiir waxa uu taariikhda ku curinayaa dhalliil xadiiska ah oo uu aad uga taxadaro darajooyinka.",
      "Aayadaha Qur'aanka ee dhacdooyinkan ku saabsan ayaa ah kuwa ugu awoodda badan dhammaan qoraallada. Su'aalaha ku saabsan dhaqanka, sharciga, iyo anshaxa, xadiiska saxafiga ah ee al-Bukhaari iyo Muslim ayaa ka hormariya warbixinnada seerah ee aan la xaqiijin.",
      "Halka ay taariikhyahannadu ku kala duwan yihiin - marka loo eego tirada saxda ah ee ciidanka, taariikhaha qaar, iyo qiimeynta akhlaaqda ee ololayaal waxsii sheegyada qaarkood - cutubkani wuxuu xusayaa hubanti la'aanta halkii ay ka abuuri lahaayeen sax. Xadiis kasta oo halkan lagu soo daliishado waxa laga eegi jiray inta la ururiyey nambarkiisa iyo darajadiisa.",
    ],
    actions: [
      "Iska hubi tafaasiil kasta oo ka dhan ah Qur'aanka marka hore, ka dibna xadiithka sahihida, ka dibna seerah.",
      "Wixii su'aal ah oo ku saabsan fatwo ama codsiga casriga ah, la tasho culimada aqoonta leh - cutubkani waa waxbarasho, maaha xukun.",
    ],
    appLinks: [{}, {}],
  },
];

export const BATTLES_VERSES_SO: DeepPartial<BattlesVerse>[] = [
  {
    excerpt:
      "Waxaa loo fasaxay kuwii dagaalamay maxaa yeelay waa la dulmiyey… Hadduusan Eebe ku hubin qolo qolo kale waxaa la dumin lahaa machadyo, Kaniisado, machadyo iyo masaajidyo.",
    context:
      "Ogolaanshaha guud ee ugu horreeya ee lagu dagaallamo - ka dib sannado badan oo cadaadis aan hubaysnayn oo Makkah ah.",
  },
  {
    excerpt:
      "Ku dagaallama Jidka Eebe kuwa idinla dagaallama, hana xad-gudbina. Eebana ma jecla kuwa xadgudba.",
    context: "Xadka aasaasiga ah: Difaaca kaliya, oo leh mamnuucid xad dhaaf ah.",
  },
  {
    excerpt:
      "Markaad weydiisato Eebahaa gargaar, wuxuu ku jawaabay: waxaan kugu xoojinayaa kun Malaa'ig ah oo darajo ah.",
    context:
      "Waxyaalaha ku saabsan Badar oo la soo dejiyay - gargaarka rabbaani ah ee mu'miniinta ah ee laga tirada badan yahay.",
  },
  {
    excerpt:
      "Waxaa idiinku Sugnaaday Aayad Labadii Kooxood ee Kulmay, Mid ku Dagaallami Jidka Eebe, Midna Gaalo ah, Iyagoo ku Arkaya Laba Jibaar iyagoo Indhahooda Jooga.",
    context: "Eebe wuxuu ka dhigay Muslimiintii cadawga Badar ka weyn, isagoo quluubta xoojiya.",
  },
  {
    excerpt:
      "Eebana wuxuu idiin oofiyey ballankiina markaad dilaysaan idankiisa, intay idinka adkaadaan ood ka dooddaan amarka ood caasidaan ka dib markuu idin tuso waxaad jeceshihiin.",
    context: "Waxa uu ka hadlayaa caasinimada qaansoleyda iyo meertada Uxud.",
  },
  {
    excerpt:
      "Kuwa xaqa rumeeyow xusa Nicmada Eebe korkiinna markay Junuudu idiin timid oon ku dirray Dabayl iyo col aydaan arkayn.",
    context: "Suuratu al-Axzaab oo ku saabsan go'doominta Confederater iyo gargaarka rabaaniga ah.",
  },
  {
    excerpt:
      "Wuxuuna ka soo dajiyay kuwii u kaalmeeyey ee ehlu-Kitaabka ahaa Dhufaysyadoodii, quluubtoodana ku tuuray argagax, koox aad dileen iyo koox aad qafaasheen. Wuxuuna idin dhaxalsiiyay dhulkoodii iyo guryahoodii.",
    context:
      "Suuradda al-Axzaab ee ku taal Banu Qurayzah, oo jebiyey axdigii intii lagu jiray go'doominta - dhacdo xaddidan oo ah khiyaano dagaal, ee ma aha xukun iimaan ka dhan ah.",
  },
  {
    excerpt:
      "Annagaa idin siinnay liibaanta cad, si Eebe idiin dhaafo wixii dambigiinna ka horreeyay iyo waxa ka dambeeyaba, idiinna dhammaystiro nicmadiisa, idinkuna hanuuniyo jidka toosan.",
    context:
      "Waxaa la soo dejiyay markii Xudeybiyah ka soo laabatay - magacaabista sida guul muuqata waxay saxaabadu markii hore dareemeen tanaasul qadhaadh.",
  },
  {
    excerpt:
      "Dhab ahaan Eebe wuu ka raalli noqday Mu'miniinta markay idinku ballameen geedka hoostiis, wuxuuna ogaa waxa quluubtooda ku sugan, markaasuu ku soo dejiyey xasillooni, wuxuuna ku abaal-mariyey fidmo dhaw.",
    context:
      "Ballanqaadkii Ridwaan - ilaa 1,400 oo saxaabi ayaa geed qudhac hoostii ku ballan qaaday in aanay cararin, Allena wuu ka raalli noqday iyaga.",
  },
  {
    excerpt:
      "Markay Liibaanta Eebe timi iyo Fatuuq, ood Aragto Dadka oo Diinta Eebe u soo galaya Kooxo badan, markaas ku Tasbiixso Mahadda Eebahaa, Dambi Dhaafna waydiiso. Eebana waa aqbal toobada.",
    context:
      "Suuradda An-Nasr ee ku saabsan furitaanka Makkah - waa guul aan loo tajabin liibaan ee la mahadiyo, dambi dhaafna la waydiisto, iyo dad badan oo iimaanka galaya.",
  },
  {
    excerpt:
      "Gobolo badan ayuu Alle idinku mannaystay...Markaasuu Eebe ku soo dejiyay xasiloonidiisa Rasuulkiisa iyo Mu’miniinta korkiisa.",
    context:
      "Eebbe waxa uu xasuusiyaa mu’miniinta in guushu ay tahay deeqdiisa, ee aanay ahayn mid ku timid faan tiro.",
  },
  {
    excerpt:
      "Kuwii haray waxay ku farxeen in ay Rasuulka (scw) ka dambeeyaan oo ay naceen in ay ku dadaalaan maalkooda iyo naftooda jidka Alle.",
    context:
      "Suurada At-Tawbah waxay ka hadlaysaa dadkii ka cudur daartay socodkii Tabuuk ee adkaa.",
  },
];

export const BATTLES_TIMELINE_SO: DeepPartial<BattlesTimelineEvent>[] = [
  {
    title: "Waxyigii hore",
    body: "Nabiga ﷺ waxa uu godka Hiiraan ku guddoomay aayadaha ugu horreeya ee suuradda Al-calaq. Muddo sanado ah baaqu waa nabadeed - ma jirto fasax dagaal.",
    location: "Makkah",
  },
  {
    title: "Baaq dadweyne iyo cadaadis",
    body: "Wacdiga furan wuxuu keenaa jirdil, qaadac iyo shahiidnimo. Muslimiintu waxay u adkaystaan ​​aargoosi hubaysan la'aanteed - samirka iyo hijrada ayaa ah jawaabaha la baray.",
    location: "Makkah",
  },
  {
    title: "Hijrada ilaa Madiina",
    body: "Bulshada Muslimka ah ayaa ka dhistay Yathrib (Madiina). Heshiisyadii lala galay qabaa’ilka Yuhuudda iyo Dastuurka Madiina waxay dejiyeen xeerar lagu wada noolaado.",
    location: "Madiina",
  },
  {
    title: "Dagaalkii Badar",
    body: "17kii Ramadaan, ilaa 313 Muslimiin ah ayaa ka adkaaday ciidan aad u tiro badan oo Qureysh ah - dagaalkii ugu horreeyay ee weyn iyo guul akhlaaqeed oo qumman.",
    location: "Badar",
  },
  {
    title: "Dagaalkii Uxud",
    body: "Muslimiintu markii hore waxay heleen dhul, laakiin qaansoleydu waxay ka tagaan booskooda waxay keenaysaa dib u dhac xanuun badan. Quraanku wuxuu ka hadlayaa duruustii maalintaas.",
    location: "Buurta Uxud",
  },
  {
    title: "Dagaalkii Qodabka",
    body: "Ciidan huwan ah ayaa Madiina hareereeyay. Qodista god - soo jeedinta Salmaan - waxay jebisaa go'doominta iyada oo aan dagaal la qaadin.",
    location: "Madiina",
  },
  {
    title: "Banu Qurayzah",
    body: "Banu Qurayzah markii ay jabiyeen axdigii Madiina markii la go'doomiyay, waxay dalbadeen in loo xukumo garqaad ay iyagu doorteen oo ah Sacad ibnu Mucaad.",
    location: "Madiina",
  },
  {
    title: "Heshiiskii Xudeybiyah",
    body: "Heshiis toban sano ah oo u muuqday tanaasul, waxay Qur’aanka kariimka ah ku sheegtay, guul muuqata – Ballantii Ridwaan geedka hoostiisa ayaa lagu bixiyey, wayna fidday, dariiqii Makkana waa la furay.",
    location: "Xudeybiyah",
  },
  {
    title: "Dagaalkii Mu'tah",
    body: "Duulaan ku socda xuduudka Roomaanka; Saddexdii taliye ee la magacaabay way shahiideen si is daba joog ah ka hor inta uusan Khaalid bin Waliid ciidankii si nabad ah ugala bixin.",
    location: "Mu'tah",
  },
  {
    title: "Safarkii Khaybar",
    body: "Dhufaysyadii Yahuudda ee waqooyiga Madiina oo ay colaadi ka jirtay waa la jabiyay. Cali bin Abii-dhaalib waxa loo dhiibay calanka kadib markii Abuu Bakar iyo Cumar la maxkamadeeyay.",
    location: "Khaybar",
  },
  {
    title: "Qabashadii Makkah",
    body: "Quraysh heshiiskii bay jebiyeen; Nabiga ﷺ wuxuu la socdaa toban kun oo saxaabi wuxuuna galay Makkah ku dhawaad ​​isagoo aan dhiig daadan - cafis guud ayaa lagu dhawaaqay.",
    location: "Makkah",
  },
  {
    title: "Dagaalkii Xunayn",
    body: "Hawazin iyo Thaqiif waxay gaadmo u galeen Muslimiinta Makka ka dib. Argagaxa bilawga ah waxa uu dariiqa u maraa guushu marka uu Nebigu ﷺ ugu yeedhay mu’miniinta si ay isaga isugu soo baxaan.",
    location: "Xunayn",
  },
  {
    title: "Duulaankii Tabuuk",
    body: "Socod xagaa ah oo adag oo ku wajahan soohdinta Roomaanka. Dagaalna ma dhaco, laakiin munaafaqnimada waa la soo bandhigaa, waxaana suuradda At-Tawbah ka hadashay kuwii ku haray.",
    location: "Tabuuk",
  },
  {
    title: "Xajka sagootinta",
    body: "Nebigu ﷺ wuu soo xajka soo gutay oo khudbadii sagootinta soo jeediyay. Waxa uu ku dhintay Madiina wax yar ka dib - waagii dagaallada nebiyadu waa soo dhowaaday.",
    location: "Makkah",
  },
];

export const BATTLES_FIGURES_SO: DeepPartial<BattlesFigure>[] = [
  {
    name: "Abuu Bakar al-Siddiiq",
    epithet: "Allaah haka raalli noqdee",
    summary:
      "Saxaabigii ugu dhawaa nabiga, ugu horrayn nin mu'min ah oo qaan-gaar ah, iyo saxaabigii Hijrada.",
    role: "La-taliye, halgamaa, iyo hal-abuure ololihii hore.",
    lesson:
      "Daacadnimo adag iyo run sheeg cadaadis - wuxuu ku bixiyay maalkiisa si uu u xoreeyo muslimiinta la dhibaateeyay ka hor guul kasta.",
  },
  {
    name: "Cumar ibn al-Khattaab",
    epithet: "Allaah haka raalli noqdee",
    summary:
      "Waxa uu galay Islaamka sannadihii fitnada oo uu noqday mid ka mid ah difaacayaasha ugu adag iimaanka.",
    role: "Halgamayaashii iyo ka dib naqshadihii caddaaladda oo ahaa Khaliifkii labaad.",
    lesson:
      "Geesinimada ay ku lammaan tahay isla xisaabtanka - wuxuu si cad u aqbalay talada markii uu ra'yigiisa ka duwan yahay Nabiga ee Xudeybiyah.",
  },
  {
    name: "Cali bin Abii Daalib",
    epithet: "Allaah haka raalli noqdee",
    summary:
      "Ina-adeerkii iyo wiilka uu soddogga u ahaa nabiga ﷺ; oo ka mid ah carruurtii ugu horreysay ee Islaamtay.",
    role: "Horjooge hal dagaal ku jira oo sita calanka Khaybar.",
    lesson:
      "Hal-abuur leh oo khushuuc leh - wuxuu seexday sariirta Nebiga habeenkii hijriga, isagoo naftiisa biimeeyay si ay hawshu u sii socoto.",
  },
  {
    name: "Xamza bin Cabdil-mudhalib",
    epithet: "Allaah haka raalli noqdee",
    summary: "Nabiga adeerkiis, oo loo yaqaan Asadullah (Libaaxa Alle) ka dib markuu islaamay.",
    role: "Halgamaagii iyo hogaamiyihii akhlaaqda badnaa ee Badar iyo Uxud.",
    lesson:
      "Shahiidnimadu maaha guuldarro - dhimashadiisii ​​Uxud aad bay uga murugootay Nabiga, haddana waxay xoojisay go'aan lagu dhammaystirayo howlgalka.",
  },
  {
    name: "Khaalid ibnu Waliid",
    epithet: "Allaah haka raalli noqdee",
    summary:
      "Janaraal Qureysh oo qurux badan oo Xudeybiyah ka dib qaatay Islaamka oo noqday Saifullah (Seefta Allaah).",
    role: "Wuxuu hoggaaminayey fardooleydii garbaha ka ahayd oo ka hortimid Muslimiintii Uxud Islaamnimadiisa ka hor; ka dib waxa uu taliye ka noqday Mu'tah oo uu go'aan ka qaatay ololihii khaliifada.",
    lesson:
      "Mucaaridkii hore ma aha wax ka hor istaaga towbad keenka dhabta ah - xirfadda ku dhufatay Muslimiinta Uxud waxay ahayd, mar uu iimaanku qalbigiisa soo galay, oo gebi ahaanba loo weeciyey jidka Alle.",
  },
  {
    name: "Sacad bin Abii Waqaas",
    epithet: "Allaah haka raalli noqdee",
    summary: "Mid ka mid ah tobankii Jannada loo ballan qaaday; qaansoleyda caanka ah ee bulshada.",
    role: "qaansoley ee Uxud; ka dib wuxuu hogaaminayay ciidamadii Muslimiinta ee al-Qadisiyyah ee uu hogaaminayay khaliif Cumar.",
    lesson:
      "Anshaxa qofka doorkiisa - qaansoleydu waxay qeexday adeeggiisa; markii danbe waxa uu si sax ah u qaaday hogaaminta ummadeed.",
  },
  {
    name: "Salmaan al-Farisi",
    epithet: "Allaah haka raalli noqdee",
    summary:
      "Nin reer Faaris ah oo ku biiray Muslimiintii Madiina ka dib safar ruuxi ah oo dheer ka dib.",
    role: "La soo jeediyay qodista godka - xeelad Faaris aan aqoon Carabta.",
    lesson:
      "Xikmaddu waxay ka iman kartaa asal kasta - Shuura macnaheedu waa khibrad maqal meel kasta oo Eebbe dhigo.",
  },
  {
    name: "Zayd ibnu Xaarithah",
    epithet: "Allaah haka raalli noqdee",
    summary:
      "Ninki Nebigu soo daayey iyo saxaabigii la jeclaa, iyo amiirkii ugu horeeyey ee loo magacaabo ciidan muslimiin ah.",
    role: "U horseeday duullaankii Mu'tah; halkaas ku shahiiday isagoo ah kii ugu horreeyey ee saddexdii taliye ee la magacaabay ka dhacay.",
    lesson:
      "Mudnaanta nasabka - waxaa loo doortay inuu hoggaamiyo markii ay joogeen rag ka darajada sareeyo qabiilka.",
  },
  {
    name: "Sacad ibnu Mucaad",
    epithet: "Allaah haka raalli noqdee",
    summary:
      "Caaqil Aws reer Madiina, oo ka mid ahaa kuwii ugu horreeyey ee Ansaarta ugu qaddarinta badnaa.",
    role: "Waxaa ku dhaawacmay Jidka; oo ay u doorteen banuu Qurayzah inuu noqdo gar-qaadka aayahooda.",
    lesson:
      "Cadaaladda iyadoo loo marayo garsoore lagu heshiiyey - xitaa cadawgii laga adkaaday waxaa loo oggolaaday garsoore dhexdhexaad ah halkii laga aargudan lahaa; wax yar ka dib ayuu u dhintay dhaawacii soo gaaray.",
  },
];

export const BATTLES_LESSON_CARDS_SO: DeepPartial<BattlesLessonCard>[] = [
  {
    battleTitle: "Dagaalkii Badar",
    lesson: "Allaah talo saara intaad si buuxda isu diyaarinayso.",
    detail:
      "Tiro ka badan saddex ilaa hal, Muslimiintu waxay weli doorteen dhulkoodii ceelasha, oo ay hagaajiyeen darajooyinkoodii, oo ay ducaysteen - Nebigu ﷺ oo baryaya Alle habeenkii oo dhan ilaa maradii uu ka dhacay. Dedaal iyo Talo wadareed, Guushana Allaah baa u sugnaaday.",
  },
  {
    battleTitle: "Dagaalkii Uxud",
    lesson: "U hoggaansanaanta amarka waxay ilaalisaa bulshada.",
    detail:
      "qaansoleydii ka tagtay booskooda iyagoo doonaya inay dhacaan waxay fureen garab ku dhow inay burburiyaan ciidanka. Qur’aanku waxa uu taas u diiwaan geliyay in uu cashar u noqdo jiil kasta oo ku saabsan edbinta.",
  },
  {
    battleTitle: "Dagaalkii Qodabka",
    lesson: "Qorshaynta iyo la tashigu waxay badiyaan xoog.",
    detail:
      "Fikirkii Salmaan oo ay weheliso shuurada Nabiga iyo shaqada Mu'miniinta, ayaa waxay meesha ka saartay isbahaysi aad uga weyn kuwii difaacayay.",
  },
  {
    battleTitle: "Heshiiskii Xudeybiyah",
    lesson: "Dulqaadku wuxuu noqon karaa guusha ugu runta ah.",
    detail:
      "Saxaabadu waxay dareemeen in ay dulli tahay, Cumarna si cad ayuu u weydiiyey; Suuratu Fatx ayaa ugu jawaabtay waxayna ku tilmaantay guul cad. Nabadgelyadii tobanka sano ahayd ayaa waddooyinka furtay, Islaamku si ka badan sidii hore ayuu u fiday, laba sano gudahoodna waxaa furnaa jidkii Makka.",
  },
  {
    battleTitle: "Banu Qurayzah",
    lesson: "Jebinta axdiga ilaalinta ayaa ka mid ah khiyaanada ugu daran.",
    detail:
      "Banu Qurayzah waxay jeex jeexeen axdigii Madiina, isla markaas ay Confederaatku magaalada hareereeyeen. Sidaas oo ay tahay, Nabigu ﷺ ha lagu xukumo gar-qaade ay iyagu doorteen - cadaalad loo maro garsoore lagu heshiiyey, ee ma aha aargoosi aan la xakamayn.",
  },
  {
    battleTitle: "Qabashadii Makkah",
    lesson: "Naxariista guusha ka dib waxay kor u qaadaa guulaystaha.",
    detail:
      "Magaaladii jirdilka iyo eryay ee hadda u naxariistay, Nebigu ﷺ wuxuu ku celceliyay hadalkii Nebi Yuusuf ee ahaa: 'Eedaan kuguma aha maanta - tag, xor baad tahay'. Cafis guud ayaa beddelay aargoosiga, waxaana qalbiyada lagu guulaystey in aan wax ciqaab ah lagu guuleysan karin.",
  },
  {
    battleTitle: "Dagaalkii Xunayn",
    lesson: "Tirada iyo guusha dhow ma dammaanad qaadayaan guul.",
    detail:
      "Kibirka tirada ciidanka ka dib Makkah ayaa ka qayb qaatay argagaxa bilowga ah. Mu'miniintu waxay isu soo urureen oo keliya markay u soo noqdeen Nabiga ﷺ iyo xagga Eebbe.",
  },
  {
    battleTitle: "Duulaankii Tabuuk",
    lesson: "Allabarigii dhibku wuxuu daaha ka qaadaa iimaanka runta ah.",
    detail:
      "Socodku wuxuu ku dhacay kulayl aad u kulul oo ka dhan ah cadawga laga cabsado. Kuwii maalkooda bixiyey iyo kii socodkii fakhriga ahaa waa la wada ammaanay.",
  },
  {
    battleTitle: "Dagaalkii Mu'tah",
    lesson: "Kala wareegidda hoggaanka waa in la qorsheeyaa.",
    detail:
      "Rasuulku ﷺ wuxuu magacaabay saddex taliye oo ay u kala horreeyaan. Markii ay saddexdooduba dhaceen, Khaalid waxa uu dib u habeeyey dib u gurasho - badbaadinta ciidanka lafteedu waxay ahayd guul.",
  },
];

export const BATTLES_GLOSSARY_SO: DeepPartial<BattlesGlossaryTerm>[] = [
  {
    term: "Gazwah",
    definition:
      "Socdaal ciidan oo uu nabiga ﷺ laftiisu ka qayb galay. Tusaalooyinka waxaa ka mid ah Badar, Uxud, iyo Tabuuk.",
  },
  {
    term: "Sariyah",
    definition:
      "Koox la soo diray oo uu hoos imanayo taliye iyadoon nabigu ﷺ ku soo biirin socodkii. Daraasiin ayaa u dhacay sahamin, dublamaasiyad, ama ka jawaabista weerarrada.",
  },
  {
    term: "Muhajirun",
    definition:
      "Muhaajiriintii ka baxay Makkah oo Alle dartii u tagay Madiina. Waxay aasaaseen udub dhexaadka bulshadii hore ee Muslimiinta iyagoo garabsanaya Ansaarta.",
  },
  {
    term: "Ansaar",
    definition:
      "Gargaarayaashii – Muslimiintii Madiina ee martigalisay Muhaajiriinta, hantidoodiina qaybsaday, oo difaacday magaalada sannadihii hore.",
  },
  {
    term: "Shuura",
    definition:
      "Wada-tashiga labada dhinac ka hor go'aannada waaweyn. Istaraatiijiyada godka iyo u diyaargarowga Uxud waxay muujinayaan la-tashiga qaabka nebiyada.",
  },
  {
    term: "Bay'ah",
    definition:
      "Ballanqaad daacadnimo - addeecidda siyaasadeed iyo ruuxeed ee hoggaamiyaha. Ballanqaadkii Al-Aqabah ayaa Hijrada ka horreeyay.",
  },
  {
    term: "Hijrada",
    definition:
      "U haajiridda Alle dartiis -ka Makkah una aaday Madiina marka loo eego macnaha nabiga. Sannadka 1-aad ee Hijriyada waxa uu ku bilaabmayaa hayaankan.",
  },
  {
    term: "Ameer",
    definition:
      "Taliye ama hogaamiye loo magacaabo ciidan ama socdaal. Rasuulku ﷺ wuxuu u magacaabay madax sareya oo uu magacaabay kuwo beddela haddii ay dhacaan.",
  },
  {
    term: "Rayax",
    definition:
      "Halbeeg ama calan lagu sido madaxa ciidanka. Calankii nebiga oo la sido waxa ay ahayd astaan ​​sharaf iyo xilkasnimo.",
  },
  {
    term: "Liwa",
    definition:
      "Halbeeg ciidan oo weyn, oo mararka qaarkood ka duwan rajada shakhsi ahaaneed. Hoggaaminta liwaayadu waxay tilmaamtay inay ka amar qaataan ciidan weyn.",
  },
  {
    term: "Jihaad",
    definition:
      "Ku dadaalida jidka Alle - ugu horrayn halganka nafta, iyo qaabkiisa ciidan ee nidaamsan, difaaca iyo ka saarida gardarrada marka la magacaabayo.",
  },
  {
    term: "Fi sabilillah",
    definition:
      "Jidka Alle - ujeeddada kala saarta halganka xaqa ah iyo vendetta qabyaaladda ama gumeysiga adduunyo.",
  },
  {
    term: "Amaan",
    definition:
      "Amni ama dhaqan nabdoon oo la siiyo ergada, baayacmushtarka, ama kuwa aan dagaalka ahayn. Ku xad-gudbida amanka waa mamnuuc shareecada Islaamka ee dagaalka.",
  },
  {
    term: "Sulx",
    definition:
      "Xabbad ama heshiis nabadeed. Heshiiskii Xudeybiyah waa tusaalaha ugu muhiimsan ee lagu dooranayo nabadda marka ay u adeegeyso wanaagga weyn.",
  },
  {
    term: "Fath",
    definition:
      "Furitaanka ama qabsashada - inta badan loo isticmaalo furitaanka nabada ee Makkah (Fat Makkah) halkii ay ka ahaan lahayd go'doomin rabshado ah.",
  },
];
