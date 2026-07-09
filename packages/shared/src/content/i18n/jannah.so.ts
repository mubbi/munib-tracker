// Somali translation overlay for the Learn "Journey to Jannah" content. Mirrors the order of
// its English source in ../jannah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  JannahDuaEntry,
  JannahGate,
  JannahPromisedEntry,
  JannahTopic,
  JannahVerseEntry,
} from "../../types/jannah";
import type { DeepPartial } from "./localize";

export const JANNAH_TOPICS_SO: DeepPartial<JannahTopic>[] = [
  {
    title: "Waa maxay Jannadu?",
    summary: "Jannadii waarta eebe u darbay kuwa dhawrsada.",
    body: [
      "Jannada (Jannada) waa hoyga abaal-marinta ee Eebbe u darbay kuwa rumeeyey ee camal fiican falay. Erayga macnihiisu waxa uu macnihiisu yahay beer hadhsan oo hadhsan-laakin Qur’aanku waxa uu u isticmaalayaa xaqiiqo aad uga weyn beer kasta oo dhulka ku taal: waa dhul wabiyo ah, midho, daaro iyo wehel halka uu mu’minku ku noolaado waligiis raali ahaanshihiisa Eebihiis. Waa yoolka nebi kasta dadka ugu yeedhay xagga iyo meesha uu safarkan oo dhan ku saabsan yahay.",
      "Nolosha Jannada waxay la mid tahay wax kasta oo adduunka ka jira, sababtoo ah waa ka nadiifsan tahay cillad kasta oo wax u dhimaysa farxadda dhulka. Dhimasho la'aan, jirro, gabow, baqdin, murugo, iyo daal la'aan ma jirto. Dadkeedu weligood ma doodaan, waligood ma daalin, waligoodna waligood waxay jecel yihiin. Wax kasta oo qalbigu doono waa la siin, Eebbana wuu u siyaadiyaa fadligiisa - 'Waxay ku heli dhexdeeda waxay doonaan agteenana waa u badan yahay' (Qur'aanka 50:35).",
      "Raaxada Jannada waa wax ka baxsan mala-awaalka aadanaha. Xadiis qudsi ah waxa uu Alle ku sheegay in uu addoomadiisa xaqa ah u darbay wax aanay ishu arag, dhegna aanay maqlin, qalbiguna aanu weligii qaadin. Tani waa sababta uu Qur'aanku Jannada ugu tilmaamay muuqaallo la yaqaan - beero, webiyo, iyo hadh - isagoo ina xusuusinaya in xaqiiqadu ka weyn tahay tilmaan kasta. Abaal marinta ugu wayn ee dhamaanteed ma aha Jannooyinka laftooda ee waa raali ahaanshiyaha Eebe iyo, darajooyinka ugu sarreeya, oo ah sharafta in lagu eego wajigiisa sharafta leh.",
      "Qofka mu’minka ahi waa inuu laba runood isku hayaa. Marka hore, Jannadu waa dhab, waa u dhowdahay, waana u qalantaa dadaal kasta - Qur'aanku wuxuu noo sheegay inaan 'u baratanno' xaggeeda (Qur'aanka 3:133). Midda labaad, qofna Jannada kuma helo camal keliya; Gelida ugu danbeysa waa naxariista Eebe, iyadoo iimaan dhab ah iyo camal suuban yihiin macnihii uu doortay inuu aqbalo. Miisaankani wuxuu ilaaliyaa rajada isagoon kicin isla weyni: waxaan ku dadaalnaa inta ugu badan, ka dibna nafteena ku tuurno naxariistiisa.",
      "Dhab ahaantii, xaqiiqada Jannadu ha qaabayso doorashadaada maalinlaha ah. Marka cibaadadu dareemto culus ama jirrabaadu dareemeyso xoog, xasuuso waxa sugaya iyo waxa la isku hayo. Marar badan Allaah weydiiso Jannada, si joogto ah ugu shaqee siyaalo yar yar oo waara, oo u hilowgaaga ha ku jilciyo qalbigaaga noloshan gaaban.",
    ],
    quran: [
      {
        excerpt:
          "U orda Dambi dhaafka Eebihiin iyo Janno Balladhkeedu yahay Samooyinka iyo Dhulka oo loo darbay kuwa dhawrsada.",
      },
      {
        excerpt:
          "Eebe wuxuu u yaboohay Mu'miniinta Rag iyo Haweenba Jannooyin ay dureeri dhexdeeda Wabiyaal oyna ku waari dhexdeeda, iyo Guryo wanaagsan oo Jannooyin ku waari dhexdeeda, raalli ahaanshiyaha Eebe ayaana ka wayn.",
      },
      {
        excerpt: "Nafna ma oga waxa loo qariyey oo nasteexa ah oo ka abaal-marin waxay falayeen.",
      },
      {
        excerpt: "Waxayna mudan waxay doonaan dhexdeeda, agtannadana waxaa ah siyaado.",
      },
      {
        excerpt:
          "Kuwa rumeeyey xaqa oo camal fiican falay waxay mudan Jannatul firdowso oo marti ah.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Eebbe wuxuu yidhi: waxaan u darbay addoommadayda suubban, wax aanay ishu arag, dhegtuna aanay maqlin, qalbiguna aanu uuraysan.",
      },
      {
        excerpt:
          "Eebbe kor ahaaye wuxuu yidhi:- Waxaan u darbay addoommadayda suubban, wax aanay ishu arag, dhegtuna ayan maqlin, qalbi bani-aadmina aanu dareemin.",
      },
    ],
  },
  {
    title: "Darajooyinka Jannada",
    summary: "Jannadu waxay leedahay darajooyin badan - maaha sallaan go'an oo toddoba ah.",
    body: [
      "Jannadu maaha meel siman; waxay leedahay shahaado badan, oo loo yaqaan darajat, mu'miniintana waxaa lagu koryeelaa dhexdeeda sida iimaankooda iyo camalkoodu yahay. Khalad aadka u badan ayaa ah in Jannah uu leeyahay todoba heer oo sax ah. Tani waxay jahawareerinaysaa laba waxyaalood oo kala duwan: Qur'aanku wuxuu ka hadlayaa toddoba samadood (samawaat) - cirka la abuuray ee naga sarreeya - ma aha toddoba heer oo go'an oo Jannada ah. Qoraalladu waligood Jannada kuma koobaan toddoba darajo.",
      "Waxa ilaha dhabta ahi ay inoo sheegeen in darajooyinku ay tiro badan yihiin oo aad u balaadhan yihiin. Rasuulku (scw) wuxuu yidhi Jannadu waxay leedahay boqol heer oo loo diyaariyey kuwa ku dadaala jidka Alle, masaafada u dhaxaysa heerka iyo heerka ku xiga waa sida masaafada u dhaxaysa samada iyo dhulka. Xataa lambarkani wuxuu tilmaamayaa baaxadda halkii aan ka ahaan lahayn jaranjaro adag oo aan ku fuuli karno in aan saxno sanduuqyada.",
      "Eebbe wuxuu kor u qaadaa qof kasta oo mu’min ah isagoo eegaya xoogga iimaankooda, daacadnimada niyada, iyo miisaanka camalkooda – “Dhammaan waxaa loo heli karaa darajooyin la mid ah waxay falayeen” (Qur’an 6:132). Darajada saxda ah ee qof walba gaaro waa mid Allaah kaliya yaqaan. Muujintu si badheedh ah nama siinayso liis hubineed farsamo oo ah 'samaynta fal X si aad u gaarto heerka N', sababtoo ah cibaadada waxaa loola jeedaa in lagu hoggaamiyo jacayl iyo daacadnimo, maaha in la tiriyo darajo.",
      "Xikmadda ku jirta tan ayaa qurux badan. Haddii aan ogaano meelayntayada saxda ah, qaar ayaa ku qanacsanaan lahaa kuwa kalena way quusan lahaayeen. Taas beddelkeeda, waxa nala baray inaynu indhahayaga ku hayno Allaah, dedaalno, oo aynu rajayno. Mu'minku waxa uu ku tartamayaa wanaag - 'tani ha ku tartamaan tartame' - halka uu uga tagayo darajada u dambaysa kan ugu cadaaladda badan.",
      "Markaa intaad higsan lahaydeen heer la tiriyey, hiigso meesha ugu sarraysa ee Alle ha ku dhigo meesha uu doono. Rasuulku ﷺ wuxuu baray saxaabada in aysan ku degin codsi suubban balse ay si gaar ah u warsadaan Al-Firdaws oo ah jannada ugu sarreysa.",
    ],
    quran: [
      {
        excerpt: "Dhammaan waxaa jiri doona shahaadooyin sida ay sameeyeen.",
      },
      {
        excerpt:
          "day sidaan uga fadilnay qaarkood qaarkakale, aakhiraana wayn Darajooyin iyo Faasiq wayn.",
      },
      {
        excerpt:
          "Ruuxii adeeca Eebe iyo Rasuulka waxay la jiri kuwa Eebe u Nicmeeyey oo ah Nabiyada, run-sheegga, Shuhadada iyo kuwa suuban. Alla maxay saaxiibo fiican yihiin!",
      },
    ],
    hadith: [
      {
        excerpt:
          "Jannadu waxay leedahay boqol darajo oo Eebbe u darbay ciddii u dagaalanta jidkiisa. Masaafada u dhaxaysa laba heer kasta waxay la mid tahay masaafada u dhaxaysa samada iyo dhulka. Haddaba markaad Alle weydiiso, weydiiso Al-Firdows, illeen waa Jannada qaybteeda ugu khayrka badan uguna sarreeya.",
      },
      {
        excerpt:
          "Marka aad Allaah weydiiso, waydiiso Al-Firdows, illeen waa Jannada qaybteeda ugu sarreysa iyo Jannada dhexdeeda, waxaana ka soo qulqula Wabiyada Jannada, korkeedana waxaa ah Carshiga Eebaha Raxmaanka ah.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Al-Firdaws - ugu sarreeya",
    summary: "Meesha ugu sarreysa ee Jannada, oo ugu dhow Carshiga.",
    body: [
      "Al-Firdaws waa heerka ugu sarreeya uguna wanaagsan Jannada oo lagu magacaabay Sunnada sugan. Nebigu (scw) wuxuu ku tilmaamay inay tahay jannada ugu khayrka badan iyo dhexdeeda - lafteeda lafteeda - oo ay ka soo jeedaan wabiyada jannadu, korkeedana waxaa ah carshiga Eebaha Raxmaana. In la gaadho Al-Firdows waa in loo dhawaado Alle sida uu makhluuqa kasta u noqon karo.",
      "Mawduucan waxa ka dhigaya mid la taaban karo waa qayb ka mid ah hanuuninta nebiyada: markaan u duceyno Jannada, waa inaynaan ujeedo hoose u jeedin. Rasuulku ﷺ wuxuu saxaabada baray in marka ay Eebbe Jannada weydiistaan ​​ay si gaar ah u warsadaan Al-Firdows halkii ay ka degi lahaayeen codsi yar. Deeqsinimada Alle waa mid aan xad lahayn, sidaas darteed waa nooc ka mid ah nusqaanka in isaga la weyddiisto waxa ugu yar. Tani waxay ina baraysaa hamiga xagga cibaadada: ujeeddadiisu sarraynta iyo Alle, naxariistiisa, ha go'aamiyo meesha uu ku dhigo.",
      "Sidee buu addoonku ku noqdaa musharax darajadaas? Macnuhu waa isla macnaha Jannada lafteedu u horseedayso, oo si wanaagsan loo raacayo: Rumayn toosan (Tawxiid) oo si dhab ah loo qabto, si taxaddar leh oofinta waajibaadka Eebbe faray, ka dibna nolosha sii kordheysa ee cibaadada iskaa wax u qabso ah ee korkooda ah - salaadda habeenka, soonka dheeraadka ah, xuska, sadaqada, iyo akhlaaqda wanaagsan. Xadiis caan ah oo qudsi ah, wuxuu Alle ku tilmaamay sida uu addoonku ugu soo dhawaado camalka iskaa wax u qabso ah ilaa uu Eebbe ka jeclaado.",
      "Haddana hadiyadda ugu dambeysa oo go'aaminaysa had iyo jeer waa naxariista Alle. Isla neefta aan hiigsaneyno xagga sare, waxaynu ku xasuusanaynaa hadalkii Nabiga ﷺ isaga u gaar ahaa ee ahaa: Qofna Jannada kuma galo camalkiisa oo keliya - xitaa nabiga ﷺ laftiisa - in Eebbe ku daboolo naxariistiisa mooyee. Tani waa dheelitirka saxda ah ee rumaystahu ku dhufto: rajo koraysa iyo hamiga dhinac, khushuuc daacad ah dhinaca kale.",
      "Ee ka yeel Al-Firdaws baryadaada mid joogta ah - Sujuud, Saddexda Dambe ee Habeenka iyo Hurdada ka hor, Adigoo Aamusanna maalin kasta oo aad ku Tiirsato naxariista Eebahaa inta kale.",
    ],
    hadith: [
      {
        excerpt:
          "Marka aad Allaah weydiiso, waydiiso Al-Firdows, illeen waa Jannada qaybteeda ugu sarreysa iyo Jannada dhexdeeda, waxaana ka soo qulqula Wabiyada Jannada, korkeedana waxaa ah Carshiga Eebaha Raxmaanka ah.",
      },
      {
        excerpt:
          "Midkiin Jannada kuma galo camalkiisa oo keliya. Waxay yiraahdeen: Xataa adiga ma aha, Rasuulkii Alloow? Wuxuu yidhi: Xataa aniga ma aha, hadduusan Eebbe iga qarin naxariis xaggiisa ah.",
      },
    ],
    actions: [
      "Ducadaada Allaah ka baryo Al-Firdows, gaar ahaan sujuuda iyo hurdada ka hor.",
      "Dhammaysta waxa korkiina ah, badiya cibaadada naftada ah.",
      "Dib u cusboonaysii towbada oo ku kalsoonow naxariista Alle ee ha ku tashan camalkaaga oo keliya.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Maxaa aakhiro khatar gelinaya",
    summary:
      "Dembiyada waaweyn waxay u baahan yihiin towbad keen daacad ah; Dambi dhaafka Alle ayaa weyn.",
    body: [
      "Qaybtan looguma talogelin inay ku cabsi geliso rajo-beel - taas caksigeeda. Eebbana wuxuu u dhaafaa dambi kasta ruuxii u soo noqda si dhab ah, wuxuuna ugu bishaareeyey hadal adag: 'Waxaad dhahdaa addoomadayda naftooda ku xad gudbayow ha ka quusanina naxariista Eebe. Runtii, Eebbe wuu dhaafaa dembiyada oo dhan” (Qur’an 39:53). Ujeedada halkan waa si fudud in la ogaado waxa ay qoraaladu ka digayaan, si aan u aqoonsanno khatarta oo aan u degdegno isaga ka hor intaysan goor dambe dhicin.",
      "Waxaa jira hal dembi oo ka soocan dhammaan kuwa kale: Shirkiga - la wadaajinta Eebe cibaadada. Tani waa dembiga keliya ee aanu Eebbe ka cafiyin haddii uu qofku ku dhinto isaga oo aan toobad keenin, sida uu si cad ugu sheegay Qur’aanka 4:48. Wax kasta oo kale waxay hoos yimaadaan 'Wuxuu cafiyaa waxa ka yar kan uu doono'. Sidaa darteed tawxiidka saxda ahi waa aasaaska ka hooseeya camal kasta oo la aqbalo: guri ku dhisan aasaas dildilaac ah ma taagnaan karo.",
      "Shirkiga ka dib, qoraaladu waxay siinayaan miisaan gaar ah ka tegista salaadda. Shanta salaadood oo la dayaco, si joogta ah oo aan cudur daar lahayn, waxay ka mid tahay digniinaha ugu waaweyn ee sunnada ah - Nebigu ﷺ wuxuu ku tilmaamay salaadda axdiga kala saarta qofka mu'minka ah, si ay uga tagtaa gaalnimo u dhowaato. Dambiyada kale ee waaweyn - dilka xaqdarada ah, xiriirka aan sharciga ahayn, cunista ribada, cunista xoolaha agoonta, iyo dulmiga daran - waa arrimo culus oo u baahan towbad keen dhab ah waxayna keeni kartaa ciqaab haddii uusan Alle dambi dhaafin.",
      "Waxa loogu yeero dembiyada 'ka yar' sidoo kale waa muhiim, mana aha in aan waligood la fududaysan. Afxumada, beenta, isla waynida, jebinta xidhiidhka qoyska iyo ilbaxnimada ayaa si aayar ah u baabi'isa qalbiga iyo dabeecadda. Rasuulku ﷺ wuxuu ka digay in dembiyada yaryar ee is-dul-saaran ay qofka baabi'in karaan si la mid ah ulaha yar yar ee la ururiyo ay u karin karaan cunto dhan. Mid kasta oo iyaga ka mid ah wuxuu u baahan yahay u noqoshadiisa Alle.",
      "Qaadashadu waa rajada ficilka: marnaba ha u oggolaan in baaxadda dembigu kugu qanciyo in toobaddu aanay macno lahayn. U soo noqo Alle markii aad simbiriirixato, ku raac camal xun mid wanaagsan si aad u tirtirto, maalin kastana fur albaabka Istigfaarta. Mar walba naxariistiisa ayaa ka weyn qaladkaaga.",
    ],
    quran: [
      {
        excerpt: "Eebana ma dhaafo la wadaajinta, wuxuuse ka dhaafaa waxa ka yar cidduu doono.",
      },
      {
        excerpt:
          "Waxaad dhahdaa: Addoomadayda ku xad gudbay Naftooda, ha ka quusanina naxariista Eebe. Illeen Eebbe wuu dhaafaa dambiyada oo dhan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Axdiga naga dhexeeya annaga iyo iyaga waa salaadda; Qofkii ka tagana wuu gaaloobay.",
      },
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Liisaska dembiyada waaweyn ee fiqhigu waa ay kala duwan yihiin sida uu culimadu u kala duwan yihiin, waxaana axkaamta shakhsiyaadka leh dadka aqoonta u leh. Tani waa xasuusin guud oo ah in la toobad keeno - ma aha xukun shakhsi ah. La tasho aqoonyahan lagu kalsoon yahay xaaladdaada.",
  },
  {
    title: "Kuwa lagu sharfay qoraallada",
    summary: "Dadka iyo kooxaha uu Nebigu ﷺ u magacaabay Jannada.",
    body: [
      "Qur’aanka iyo Sunnadu waxay si gaar ah u caddeeyeen shakhsiyaad gaar ah, qaybaha mu’miniinta, iyo camalka ku xidhan bishaaraynta Jannada. Waa muhiim in kuwan si sax ah loo akhriyo: waa warbixino daacad ah oo ku saabsan dadkaas gaarka ah ama sharraxaadaha - maaha dammaanad la wareejin karo qof kasta oo kaliya maqlo magacyadooda ama jecel. Bishaaraddu waxay ku timid rumaysadkooda iyo camalkooda, isla albaabkiina wuu noo furmay si la mid ah.",
      "Kooxda ugu caansan waa Tobanka Jannada loo ballan qaaday (al-Asharah al-Mubashsharah), oo uu Nebigu ﷺ ku wada magacaabay hal qiso oo kala ah: Abuu Bakar, Cumar, Cuthmaan, Cali, Talxah, Zubayr, C/Raxmaan bin Cowf, Sacad bin Abi Waqqaas, Saciid bin Zayd, iyo Abuu Cubeyda oo dhan. Kuwaasi waxay ahaayeen kuwii ugu dhawaa uguna hurid badnaa saxaabada Rasuulka ﷺ, iyo Ahlu-Sunnah dhammaantood way jeclaadeen oo way sharfeen iyaga oo aan midkoodna ku xad-gudbin ama dullayn.",
      "Marka laga soo tago shaqsiyaadka la magacaabay, qoraalladu waxay qeexayaan qaybaha loogu bishaareeyey: kuwa run-sheega iyo kuwa samra, kuwa u dhinta shahiido dhab ah oo Alle dartiis u ah sharciga Islaamka, iyo kuwa erayadooda ugu dambeeya ee noloshan ay yihiin markhaatiga iimaanka, la ilaha illallah. Sharaxaad kastaa waxay tilmaamaysaa xaqiiqo gudaha ah - daacadnimo, allabaryo, ama qalbi ku dheggan Eebbe neefta ugu dambaysa - ma aha oo keliya calaamad dibadda ah.",
      "Casharka inoogu socdaa waa in aynaan ammaan ku dareemin urur ahaan, ama aynaan darajooyinkan nafteenna u sheegan, balse waa in aynu dhiirigelinno. Tusaalahoodu kor ha nooga soo jiido: jeclow waxay jecel yihiin, ku dadaalaan siday u dadaalayeen, oo ha u beddeleen cajaa'ibkaas duco iyo ficil, iyagoo Alle ka baryay wax walba husn al-Khatimah ---dhammaan wanaagsan.",
    ],
    hadith: [
      {
        excerpt:
          "Abuu Bakar Jannada ayuu joogaa, Cumarna Jannada ayuu joogaa, Cuthmaanna Jannada ayuu joogaa, Cali Jannada ayuu joogaa, Talxahna Jannada ayuu jooga, Zubayrna Jannada ayuu jooga, Cabdiraxmaan ibnu Cowfna Jannada ayuu jooga, Sacadna Jannada ayuu joogaa, Siciid ibnu Zaydna Jannada ayuu jooga, Abuu Cubeyda ibnu Al-Jaarraxna Jannada ayuu joogaa.",
      },
      {
        excerpt: "Ruuxii erayadiisii ​​u dambeeyay ahaa 'Ilaah kale ma jiro'' Jannada ayuu gelayaa.",
      },
    ],
    disclaimer:
      "Bishaaro ku jirta xadiithka waxaa loola jeedaa kuwa la magacaabay ama qaybaha lagu tilmaamay. Ma beddelaan baahida qofku u qabo iimaankiisa, camalkiisa, iyo dhammaadka wanaagsan. Alle ayaa og.",
  },
  {
    title: "Tawxiid - aaminsanaanta saxda ah",
    summary: "Ma jiro camal la aqbalo oo aan tawxiid daacad ah lahayn.",
    body: [
      "Tawxiidka macneheedu waxa weeye in Alle keligii cibaadada loo sooco - in la rumaysto in isaga keligii yahay Rabbi iyo wax abuuray, isaga oo keliyana mudan in la caabudo, oo uu magacyadiisa iyo sifooyinkiisa ku gaar yahay. Waa fariintii nabi kasta lagu soo diray iyo waxa ugu horreeya ee uu qofku ku galo Islaamka. Sababtoo ah waxay khusaysaa kan aynu caabudaynaa, waa aasaaska uu ku taagan yahay dhammaan dhismaha diintu.",
      'Muhiimadda ay leedahay lama soo koobi karo: Alle kama aqbalo camalka qofka la wadaajiya. "Haddii aad Eebe la wadaajiseen, waxaa hubaal ah in camalkiinnu uu buray" (Qur\'aanka 39:65). Buurta camalka wanaagsan ee lagu dhisay shirkigu waxba ma miisaanto maalinta qiyaame, halka camalka ugu yar ee lagu dhisay tawxiidka saafiga ah uu yahay mid aad u culus. Tani waa sababta ilaalinta caqiidada qofku ay uga degdeg badan tahay in la kordhiyo ficilkiisa.',
      "Tawxiidku waxa kale oo ay dalbanaysaa daacadnimo, oo loo yaqaan ikhlaas - in aan caabudno Eebbe 'inaga oo u daacad ah diinta' (Qur'aanka 98: 5). Khatarta dahsoon ee halkan ku jirta waa riya, oo samaynaysa cibaado si ay dadku u arkaan looguna ammaano. Nebigu ﷺ wuxuu ka digay in xitaa is-muujintu ay si aamusnaan leh u burburin karto camal. Daawadu waa in la sii cusboonaysiiyo niyada: yaan runtii waxan u samaynayaa? Daacadnimadu waa waxa ficilka caadiga ah u beddela cibaado qaali ah.",
      "Xikmadda ku dhisan tawxiidka aasaaskeeda waa in qalbiga ay xorayso. Qofka Alle keligii caabuda waxaa ka xoroobay cabsida abuurka, iyo inuu cid walba raalli ka ahaado, lagana daaliyo u adeegidda sayidyo badan. Noloshiisu waxay helaysaa jihada keliya, oo cad: raalligelinta kii isaga abuuray.",
      "Dhab ahaantii, ka baro caqiidada saxda ah culumada lagu kalsoon yahay, ka nadiifi cibaadadaada shirkiga iyo munaafaqnimada, iska hubi niyadaada ka hor inta aadan ku dhaqaaqin. Tallaabadan ugu horreysa maaha mid ikhtiyaari ah ama horumarsan - waa meesha ay ka bilaabato waddo kasta oo Jannada loo maro.",
    ],
    quran: [
      {
        excerpt:
          "Waxaa lagu waxyooday adiga iyo kuwii kaa horreeyeyba, haddaad la wadaajisaan Eebe waxaa buray camalkiinnu, waxaadna noqonaysaan kuwa khasaaray.",
      },
      {
        excerpt: "Lamana amrin inay Eebbe caabudaan mooyee, iyagoo u daacad ah.",
      },
    ],
    hadith: [
      {
        excerpt: "Ficilku waa niyo, qof kastana wuxuu heli doonaa oo keliya wuxuu damacsanaa.",
      },
    ],
    actions: [
      "Wax ka baro aasaaska tawxiidka culumada lagu kalsoon yahay.",
      "Cusbooneysii niyadaada ka hor cibaadada.",
      "Cafis weydiiso muujinta qarsoon (riya).",
    ],
  },
  {
    title: "Saalax - tiirka",
    summary: "Shanta salaadood oo la dhawro waxay ka mid tahay camalka ugu waaweyn.",
    body: [
      "Salax - shanta salaadood - waa tiirka labaad ee Islaamka iyo camalka dhexe ee cibaadada maalinlaha ah. Nebigu (scw) wuxuu ku tilmaamay salaadda inay tahay tiirka diinta: ruuxii oojiyaa isagaa diinta dhidibada u taagaya, qofkii dayacaa wuxuu dumiyey wax badan oo kor u qaadaya. Waa shanta ballan ee mu’minka ah ee Rabbigiis agtiisa ah, istaagid, rukuuc iyo sujuud toos ah Eebbe.",
      "Darajadeeda ma aha mid la mid ah camalka camalka ah sababtoo ah wuxuu Nebigu ﷺ ka yiri maalinta qiyaame: waxa ugu horreeya ee addoonka lagu xisaabin doono waa salaadda. Hadday fayow tahay, camalka intiisa kale way fiicnaan doonaan; haddii ay liidato, inta kale khatar bay ku jirtaa. Noloshan, sidoo kale, salaaddu waa wax lagu daahiriyo—Nabigu ﷺ wuxuu isbarbar dhigay shanta salaadood iyo webi qulqulaya albaabkiisa: qofkii ku maydhaya shan jeer maalintii wax wasakh ah lagama tago, sidaas darteed salaaddu waxay iska dhaqdaa dambiyada yaryar.",
      "Laakiin salaadda waxaa loola jeedaa in ka badan dhaqdhaqaaqa jirka. Quraanku wuxuu ammaanay ‘kuwa salaaddooda is-hoosaysiiya’ (Qur’aanka 23:1–2) oo sharfay ‘kuwa salaaddooda ku adkaysta’ (Quraan 70:22-23). Laba sifo ayaa ugu muhiimsan: khushu - qalbi joogta ah, qalbi is-hoosaysiiya oo og inay taagan tahay Alle hortiisa - iyo joogtaynta, ilaalinta salaad kasta waqtigeeda. Ku tukashada jamaacada, kuwa awooda, waxay kordhisaa abaalmarinta marar badan.",
      "Xikmada qoto dheer ee Salaadda waa isbedel. Salaadda oo si habboon loo sameeyo, waxay qofka ka celisaa xumaanta iyo xumaanta; waa dib-u-dejin soo noqnoqda oo qalbiga u soo celisa xagga Eebbe oo dhan maalin mashquul ah. Salaadda oo la waayo cudur daar la’aan waa arrin aad u daran oo u baahan towbadkeen dhab ah iyo ka dhigistooda (qada). Naaf iyo rawatib - salaadaha sunnada ah ee caadiga ah ka hor iyo ka dib - waxay kordhiyaan iftiin dheeraad ah oo kor u qaadaya darajada.",
      "Dhaqan ahaan: ilaalso shanta salaadood waqtigooda oo ah mudnaantaada buuxda, samee wax kasta oo aad ku dhaaftay, ku darso salaadaha sunnada ah ee aad kari karto. Haddii salaaddaadu hagaagto, wax kasta oo kale oo cibaadadaada ah waxay u janjeeraan inay ku wanaajiyaan iyada.",
    ],
    quran: [
      {
        excerpt: "Waxaa liibaanay kuwa rumeeyey (xaqa) ee salaadda ku khushuucay.",
      },
      {
        excerpt: "Marka laga reebo kuwa tukada - kuwa salaadda ku adkaysta.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Arrinka ugu horreeya ee addoonka lagula xisaabtami doono maalinta qiyaame waa baryadiisa. Hadday sanqadho tahay, wuu liibaanay; hadday cilladaysan tahayna wuu fashilmay oo wuu khasaaray.",
      },
      {
        excerpt:
          "Haddii midkiin albaabkiisa joogo webi uu ku maydho shan jeer maalintii, wax wasakh ah miyuu ku hadhayaa? Waxay dhaheen: maya, wuxuu yidhi: Taasi waa masaska shanta salaadood, Eebe wuxuu ku tirtiraa dambiyada.",
      },
    ],
    actions: [
      "Ilaali shanta salaadood wakhtigooda.",
      "U samee salaadaha la seegay si daacad ah.",
      "Ku dar salaadaha sunnada ah ka hor iyo ka dib meesha aad awoodid.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Towbadkeen daacad ah",
    summary: "Eebbana wuxuu jecel yahay kuwa isaga u soo noqda.",
    body: [
      "Tawbah waxay u noqonaysaa Alle dambiga ka dib. Towbada daacada ah (tawbah nasuh) waxay leedahay tiirar cad: qoomamo dhab ah oo qalbiga ku jirta wixii la sameeyay, isla markiiba joojinta dembiga, iyo go'aan adag oo aan waligeed dib loogu noqon - iyo haddii dembigu uu ku lug leeyahay dulmiga qof kale, soo celinta xuquuqdiisa ama raadinta cafis. Ma aha dhacdo keli ah ee waa soo noqosho nolosha oo dhan ah, waa albaab Alle u furay qof kasta oo rumaystay.",
      "Muhiimaddeedu waa in aanu qof bani aadam ahi ka xoroobin dembiga, haddaba towbad keenku maaha in yar oo dembi leh ee waa qof kasta. Nebigu ﷺ wuxuu yidhi ilmo kasta oo Aadam ahi wuu dembaabaa, kuwa dambiga galana waxaa u khayr badan kuwa toobad keena. Eebbana waxa uu aqbala towbada addoonka isla marka ay naftu gaadho dhuunta marka uu dhinto, oo xataa qorraxdu galbeed ka soo baxdo waa dhammaadka adduunka - ilaa markaas, martiqaadku wuu taagan yahay.",
      "Yaabka yaabkiis, Alle uma dulqaato addoonka soo noqonaya oo keliya - wuu ku farxaa. Nebigu (scw) waxa uu ku tilmaamay Alle in uu aad ugu farxay towbada addoonkiisa in ka badan nin ku dhex lumay saxare oo cidlo ah, noloshiina ka quustay ka dib markii awrkiisii ​​uu la wareegay cunto iyo biyihii oo dhan, dabadeedna si lama filaan ah u helay. Sawirkaas oo ah farxad xad dhaaf ah ayaa inoo sheegaysa sida loo jecel yahay addoonka toobad keena Rabbigiis.",
      "Xikmaddu waa qoto dheer tahay: dembigu uma baahna inuu dhammaado sheekada qofka. 'Ilaah wuxuu xumaantooda ugu badali doonaa wanaag' (Qur'aanka 25:70) — toobadkeenida daacadda ah waxay u bedeli kartaa diiwaanka guuldarada mid guul ah, waxayna u rogi kartaa dhicitaan bilow cusub oo qofka u soo jiidata Eebbe si ka duwan sidii hore. Dembi ka quusashada lafteedu waa dabin Shaydaanka; Naxariista Eebe ka rajeeyo waa jawaabta mu'miniinta.",
      "Dhab ahaantii: dib ha u dhigin towbada hal maalin - soo celi wakhtiga aad simbiriirixday. Camal kasta oo xun ku raac camal wanaagsan si aad u tirtirto, oo ku hadho carrabkaaga maalinta oo dhan, sida uu Nebigu ﷺ u dambi dhaaf u doonay marar badan maalin kasta in kasta oo la cafiyay.",
    ],
    quran: [
      {
        excerpt:
          "Kuwa (xaqa) rumeeyow u noqda Eebe toobad keen, wuxuu u dhawyahay inuu Eebihiin idinka tago xumaantiina oo uu idin geliyo Jannooyin ay dureeri dhexdeeda Wabiyaal.",
      },
      {
        excerpt:
          "Kuwa Toobadkeena ee Rumeeya oo Camal Fiican fala Mooyee Eebe wuxuu ku badali Xumaantooda Wanaag, Eebana waa Dambi Dhaafe Naxariista.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Alle towbada adoonkiisa aad ugu farxay mid idinka mid ah oo geeliisii ​​ku waayey dhul abaar ah, haddana si lama filaan ah u helay.",
      },
    ],
    actions: [
      "Isla markiiba u toobad keena markaad dembaabato - dib ha u dhigin.",
      "Dambiga ku raac camal wanaagsan si aad u tirtirto.",
      "Dheh istighfar maalintii oo dhan.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Quraanka",
    summary: "Akhri, xafid, oo ku noolow kitaabka Alle.",
    body: [
      "Quraanku waa hadalka dhabta ah ee Alle, soona dejiyay hanuun, naxariis iyo bogsiin quluubta. In la dhiso xiriir lala yeesho — akhrintiisa, ka fiirsashada macnaheeda, ku camal falidda awaamiirteeda, iyo barida dadka kale - waxay ka mid tahay cibaadada ugu weyn uguna faa'iidada badan ee uu mu'minku u huro cimrigiisa. Waa xadhigii Alle nagu fidiyey; Ruuxii qabsada waxaa lagu hanuunin Jid toosan.",
      "Abaalmarinta ku lifaaqan waa mid aan caadi ahayn. Rasuulku ﷺ wuxuu baray in Eebbe siiyo kuwa akhriya kitaabkiisa oo ooga salaadda ajir weyn oo aan waligeed baabi'in (Qur'aanka 35:29-30), iyo in xaraf kasta oo la akhriyo uu leeyahay ajri labanlaab ah. Xataa kii ku dadaalaa oo ku turunturoodo ereyada, inta uu ku dadaalayo, wuxuu leeyahay abaalmarin labanlaab ah - mid akhrin iyo mid dadaal.",
      "Quraanku waxa kale oo uu kor u qaadaa darajada qofka nolosha soo socota si toos ah oo cad. Rasuulku (scw) wuxuu yidhi saxaabigii quraanka waxaa lagu odhan doonaa maalinta qiyaame: akhri oo kor, una akhri sidaad aduunka u akhrin jirtay, darajadaadu waxay ahaan doontaa aayada ugu dambaysa ee aad akhrido. Si kale haddii loo dhigo, istaagidda Jannada waxay kor ugu kacdaa qayb ka mid ah Kitaabka - dhiirigelin la yaab leh oo lagu sii wado xifdinta iyo dib u eegista.",
      "Ujeedada qoto dheer, si kastaba ha ahaatee, maaha wax akhrinta aawadood ee waa isbeddel. Eebe wuxuu ina farayaa inaan 'Qur'aanka ku akhrino akhrin cabbiran' (Qur'aanka 73:4) si sax ah macnaha macnuhu waa u daadanayaan oo u qaabeeyaan sida aynu u fikirno, dareemno, iyo u dhaqano. Qur'aanka waxa loo soo diray in la noolaado, ee looma soo dirin in la akhriyo; saxaabadu waxay baran jireen toban aayadood kamana dhaqaaqi jirin ilaa ay fahmaan oo ay ku dhaqmaan.",
      "Dhab ahaantii: maalin kasta qayb akhri, xataa dhawr aayadood, laakiin si milicsan u akhri. Xifdi suuradaha cusub ama ilaali waxaad hore u taqaanay, iyo -ta ugu muhiimsan - ku dhaqan waxaad barato ka hor intaadan u degdegin inaad wax badan barato.",
    ],
    quran: [
      {
        excerpt:
          "Kuwa akhriya kitaabka Eebe oo oogaya salaadda oo wax ka bixiya waxaan ku arzuqnay waxay rajayn ganacsi aan halaagsanayn si uu u dhammeeyo ajirkooda ugana kordhiyo fadligiisa.",
      },
      {
        excerpt: "Qur'aankana ku akhri akhrin cabbiran.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Saxaabigii Qur’aanka waxa lagu odhan doonaa: Akhri oo kor, una akhri sidii aad aduunka wax ugu akhrin jirtay, waayo darajadaadu waxa ay ahaan doontaa aayada ugu dambaysa ee aad akhrido.",
      },
    ],
    actions: [
      "Akhri maalin kasta - xitaa dhowr aayadood oo milicsi leh.",
      "Xafid suurado cusub ama ilaali waxaad taqaan.",
      "Ku dhaqan waxaad barato ka hor intaadan wax badan raadin.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Dhikr - xusuus",
    summary: "Iftiin carrabka, miisaankana ku culus.",
    body: [
      "Dhikar macneheedu waxa weeye xuska Alle - in lagu ilaaliyo qalbiga iyo carrabka iyada oo loo marayo erayada tasbiixda ah (SubhanAllaah), ammaanta (Alhamdulillah), waynaynta (Allaahu Akbar), xaqiijinta kalinimadiisa (Laa ilaha illallah), iyo dambi dhaaf waydiis (istighfar). Dhammaan waddooyinka Jannada loo maro, dikriga ayaa ka mid ah kuwa ugu fudud ee la sameeyo haddana ka mid ah kuwa ugu waaweyn ee abaal-marinta, sababtoo ah waxaa lagu samayn karaa meel kasta, xaalad kasta, wakhti kasta.",
      'Eebbe laftiisu wuxuu farayaa si deeqsinimo ah – ‘Kuwa xaqa rumeeyow ku xusa Eebbe xusid badan’ (Qur’an 33:41-42) — wuxuuna u ballan qaaday midho gaar ah oo ah xasilloonida qalbiga. "Runtii, xuska Eebe quluubtu waxay ku nastaan" (Qur\'aanka 13:28). Adduun aan xasilloonayn, walaac badan, tani waa mid ka mid ah hadiyadaha ugu waaweyn ee dhikr. Wuxuu kaloo Rasuulku (scw) miisaamay abaal-marinteeda, isagoo sheegay in laba kelmadood oo carrabka ku fudud oo haddana Miisaanka ku culus, waana kuwa Raxmaanka ah la jecel yahay, waa SubxaanAllaahu Wa bihamdihi, SubxaanAllahil-Azeem.',
      "Qaybta gaarka ah waa aadkar subaxdii iyo fiidkii - ducooyinka dhabta ah ee Nebigu ﷺ baray labada xuduud ee maalinta. Kuwaasi waxay u dhaqmaan sidii qalcad ruuxi ah, iyagoo ka ilaalinaya qofka mu'minka ah waxyeellada, hoosna u dhigaya ilaalinta iyo raallinimada Eebbe. Dhowr daqiiqo oo kaliya bilowga iyo dhamaadka maalin kasta, ayaa sheegay in joogitaanka, aamusnaan dib u qaabaynta wadnaha muddo ka dib.",
      "Xikmada zikrigu waa in ay ilaaliso xiriirka Alle ee u dhexeeya cibaadada rasmiga ah. Carrabka qoyan ee xuska leh iyo, ka sii muhimsan, qalbiga Alle ku soo celiya dookhiisa maalinlaha ah - hakadka ka hor xanaaqa, ka hor iibsashada, go'aanka ka hor - waa yoolka dhabta ah. Dikriga looguma talo gelin inuu ku sii jiro bushimaha; waxaa loola jeedaa in lagu hago nolosha.",
      "Dhab ahaan: ka dhig axaadka subaxda iyo maqribka caado maalinle ah, ka dhig qayb fudud oo tasbiix ah, istighfar, ama salawaat ah oo qulqulaya xilliyada aan shaqayn, Allena si gaar ah u xus hurdada ka hor iyo markaad soo jeeddo. In yar in la joogteeyo ayaa ka roon qarax badan.",
    ],
    quran: [
      {
        excerpt:
          "Kuwa xaqa rumeeyey (xaqa) oo quluubtoodu ay ku xasishay xuska Eebe, xuska Eebena quluubtoodu waxay ku xasishaan xuska Eebe.",
      },
      {
        excerpt:
          "Kuwa (Xaqa) rumeeyow xusa Eebe wax badan oo xusa, una tasbiixsada aroor iyo galabba.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Laba kelmadood ayaa carrabka ku fudud, Miisaankana ku culus, waana la jecel yahay Eebaha Raxmaanka ah: SubxaanAllahi wa bixamdiihi, SubxaanAllahil-Azeem.",
      },
    ],
    actions: [
      "Dhammaystir axadar subax iyo fiidkii maalin kasta.",
      "Isticmaal miiska tasbeexda istighfar ama salawat.",
      "Xusuusnow Alle hurdada ka hor iyo ka dib markaad soo toosto.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sadaqo & zaka",
    summary: "Ku bixi waxa Eebe ku siiyey si qarsoodi ah iyo si cad.",
    body: [
      "Islaamku wuxuu farayaa qofka mu'minka ah inuu wax ka bixiyo maalka Eebbe u wakiishay, si khasab ah iyo si ikhtiyaari ahba. Zakah waa kharashka sannadlaha ah ee waajibka ah ee ku saabsan hantida mudan - mid ka mid ah shanta tiir ee Islaamka - waxaana ku waajib ah, maaha ikhtiyaari, kuwa buuxiya shuruudaha. Wixii intaas ka dambeeyana waxaa taagan Sadaqo: wax bixinta iskaa wax u qabso ah ee qaddar kasta, waqti kasta, Allaah dartiis.",
      "Abaalmarinada ku baxa dariiqa Alle ayaa la badiyo oo ka baxsan xisaabta caadiga ah. Eebe wuxuu u ekaysiiyaa kan wax ku bixiya Jidkiisa hal hadhuudh oo bixisa todobo sabuul, mid walbana ay dhaliso boqol xabo - 'Eebena wuu u badiyaa cidduu doono' (Qur'aanka 2:261). Si ka fog in la dhimo maalka, sadaqadu way nadiifisaa oo ku kordhisaa barakah, iyada oo dembiyada bakhtiinaysa sida biyuhu dabka u damiyaan.",
      "Laba nooc oo samafal ah ayaa mudan in si gaar ah loo xuso. Midda ugu horreysa waa sadaqo qarsoon, oo loo bixiyo si qarsoodi ah, sida uu Nebigu ﷺ ku tilmaamay, gacanta bidix ma garanayso waxa midigta bixisay - daacadnimadani waa mid si gaar ah loogu jecel yahay Eebbe oo hadh u ah qofka maalinta qiyaame. Midda labaad waa sadaqah jariyah, oo ah sadaqo socota oo dheefteedu sii socoto geerida ka dib. Rasuulku (scw) wuxuu yidhi markuu qofku dhinto camalkiisu wuxuu dhamaanayaa saddex mooyee: Sadaqo socota, cilmi dadka kale anfaca, iyo ubad suuban oo u duceeya.",
      "Xikmada Sadaqadu waa in ay ku shaqeyso bixiyaha sida ugu badan ee qaataha. Waxay dabcisaa xajinta hunguriga qalbiga, waxay dhistaa naxariis, waxay xoojisaa isku xidhka bulshada, waxayna xasuusinaysaa maalqabeenada inay yihiin ammaano ee aanay ahayn hantiilayaal dhab ah. Islaamkuna waa uu balaadhiyaa qeexida sadaqada si aan cidna looga reebin: Nebigu ﷺ wuxuu baray in u dhoola cadeynta walaalkaa, kalmad wax tar leh, iyo xitaa ka saarista shay dhib ah oo wadada ka mid ah waa dhammaan noocyada sadaqada.",
      "Dhab ahaantii: haddii aad mas'uul ka tahay zakada, xisaabi oo bixi si sax ah; sii qaar ka mid ah sadaqo joogta ah, haba yaraatee, si ay wax bixintu u noqoto caado halkii ay ka ahaan lahayd dhacdo; oo raadi sadaqah jaariyaal ah oo waara - kafaala qaadida arday, maalgelinta ceelka, ama taageerida masjid - taaso kugu abaal marinaysa waqti dheer ka dib markaad maqan tahay.",
    ],
    quran: [
      {
        excerpt:
          "Kuwa ku bixiya Xoolahooda Jidka Eebe waxay la mid yihiin Hadhuudh ka baxay Todobo Sabuul oo Sabuul kastaa ku sugan tahay Boqol Xabbo. Eebbana wuu u badiyaa cidduu doono.",
      },
      {
        excerpt:
          "Wax ka bixiya waxaan idinku arzuqnay intay u imaan geeridu midkiin, wuxuuna ku dhahay: Eebow haddaad i dib dhigi wax yar oon sadaqo oo aan ka mid noqdo kuwa suubban.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qofku markuu dhinto camalkiisu wuu dhammaanayaa saddex mooyee: Sadaqo socota, cilmi faa'iido leh, ama ubad toosan oo u duceeya.",
      },
    ],
    actions: [
      "Xisaabi oo bixi sakada haddii ay waajib kugu tahay.",
      "Sii sadaqo joogto ah, xitaa haddii ay yar tahay.",
      "Raadi fursadaha sadaqah jariyah.",
    ],
    appLinks: [{}],
  },
  {
    title: "Dabeecad wanaagsan",
    summary: "Waxa ugu culus ee Miisaanka ayaa laga yaabaa in ay tahay dhaqan wanaagsan.",
    body: [
      "Dabeecadda wanaagsan (xusn al-khuluq) waa ururinta sifaadka sharafta leh ee uu mu’minku ku muujiyo la macaamilka abuurka Eebbe: run sheegid, samir, khushuuc, naxariis, deeqsinimo, debecsanaan, iyo ilaalinta ballanta. Islaamku waxa uu ka fog yahay in uu yahay wanaag bulsheed, waxa uu akhlaaqda ula dhaqmaa sida halbeegga udub-dhexaadka u ah iimaanka iyo mid ka mid ah camalka ugu culus ee uu qofku qaadi karo ilaa maalinta qiyaame.",
      "Darajadeeda waxaa lagu sheegay si cad. Rasuulku ﷺ wuxuu yiri wax ka miisaan cuslaan ma jiro wax akhlaaqda wanaagsan, mu’miniintana waxaa ugu dhameystiran iimaanka kuwa ugu akhlaaqda wanaagsan. Xataa waxa uu soo koobay hawshiisa u gaarka ah isaga oo sheegay in loo soo diray si uu u noqdo qof wanaagsan. Taas macnaheedu waa sida aad ula dhaqanto waalidkaa, xaaskaaga, carruurtaada, deriskaaga, iyo xataa shisheeyaha ma aha mid ka sooca cibaadadaada - waa qayb udub dhexaad u ah.",
      "Dabeecada quruxda badan ayaa awood leh maxaa yeelay wuxuu Nabigu ﷺ balan qaaday in ay gaari karto: akhlaaqdiisa wanaagsan qofka mu’minka ah wuxuu ku gaari karaa darajada qofka maalinta oo dhan sooma oo tukanaya habeenka oo dhan. Si kale haddii loo dhigo, dabeecadda aadka u wanaagsan waxay kor u qaadi kartaa qofka caadiga ah ilaa heerka cibaadada ugu daacadsan, sababtoo ah way adag tahay, joogto ah, waxayna tijaabisaa ego markasta - xakamaynta xanaaqa, cafiska cayda, iyo doorashada dabacsanaanta marka qallafsanaantu ay fududaan lahayd.",
      "Xikmadduna waxay tahay in Islaamku aanu ahayn xidhiidh gaar ah oo u dhexeeya qofka iyo Allaah oo keliya; waxaa loola jeedaa in lagu soo qulqulo sida uu ula dhaqmo qof kasta oo ku xeeran. Qofka cibaadaysanaya ee aan ducadiisu u jilcin la macaamilkiisa ayaa seegay nuxurka, halka dabeecadda wanaagsan lafteedu ay tahay daawah, oo dadka u soo jiida iimaanka iyada oo loo marayo tusaale nool. Tani waa sababta qoraalladu ay u lammaaneeyaan cibaadada Eebbe oo ay ugu wanagsan tahay abuurkiisa marar badan iyo mar kale.",
      "Dhab ahaantii: hal mar ku shaqee sifada - carrabkaaga qabo markaad xanaaqdo, cafi kuwa ku qaldama, hagaaji xiriirka aad ka tagtay, oo ilaali balamahaaga xitaa marka ay kugu kacayaan. Milicsi gaaban oo maalinle ah ka dib Salaadda ka dib sidaad ula dhaqantay dadka maalintaas waa hab fudud oo aad si joogto ah u korto.",
    ],
    quran: [
      {
        excerpt: "Oo runtii, waxaad tahay qof weyn oo sharaf leh.",
      },
      {
        excerpt:
          "ee ah kuwa wax ku bixiya fudfud iyo dhib, oo cadhadooda ka celi, dadkana cafiya, Eebbana waa jecelyahay samafalayaasha.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ma jiro wax ka culus miisaanka qofka mu’minka ah maalinta qiyaame oo aan ahayn dabeecadda wanaagsan. Illeen Alle wuu neceb yahay qofka fisqiga ah oo aan dhab ahayn.",
      },
      {
        excerpt:
          "Mu'miniinta waxaa ugu dhameystiran iimaanka kuwa ugu akhlaaqda wanaagsan, idinkana waxaa u kheyr badan kuwa u wanaagsan haweenkooda.",
      },
    ],
    actions: [
      "Samir ku celceli marka aad xanaaqdo.",
      "Cafi kuwa kale oo hagaaji cilaaqaadka jabay.",
      "Ka fiirso dabeecadaada ka dib Salaadda joornaal maalmeed.",
    ],
    appLinks: [{}],
  },
  {
    title: "Aqoon raadis",
    summary: "Eebbana wuxuu u fududeeyaa jidka Jannada qofkii cilmi doona.",
    body: [
      "In la raadiyo cilmi faa'iido leh -barashada wixii Alle iyo Rasuulkiisu ﷺ baray, ka dibna ku shaqayntiisa iyo gudbintiisa - waa nooc cibaado ah, marka loo eego aasaaskeedana, waa waajib saaran qof kasta oo Muslim ah. Kani waa cilmiga xurmada leh ee cadeeya rumaynta, nadiifiya cibaadada, xaqa iyo baadilkana kala saara; Ma aha aqoon is-tustus, laakiin iftiin ayaa haga ficilka.",
      "Rasuulku ﷺ wuxuu raacdadan si toos ah ugu xidhay yoolka safarkan oo dhan: 'Qofkii dariiq cilmi raadis ah qaada, Eebbe wuxuu u fududayn doonaa waddo uu ku galo Jannada.' 'Dariiqa' waa mid toosan iyo mid maldahan labadaba - Alle wuu u fududeeyaa kan raadiyaha ee nolosha wuxuuna u fududeeyaa jidkiisa Jannada aakhiro. Waxa kale oo uu baray in malaa’igtu baalashooda hoos u dhigaan iyagoo raalli ka ah qofka cilmiga doonista ah, iyo in waxa cirka iyo dhulka ku sugan xataa kalluunka badda ku sugani ay dambi dhaaf weydiistaan ​​ciddii bara.",
      "Cilmigu sidoo kale waa mid ka mid ah camalka dhifka ah ee qofka ku celiya in uu qofku geeriyoodo. Nebigu ﷺ wuxuu ku magacaabay cilmi faa'iido leh saddexda shay ee abaalkoodu ku sii jiro qabriga, oo ay weheliyaan sadaqada socota iyo ubad suuban. Markaa baridda hal arrin oo faa'iido leh - in qof laga caawiyo in uu si sax ah u tukado, la wadaago xadiis saxiix ah, ama ku hagid qofka runta - waxay noqon kartaa qulqulka abaalgudka sannado badan, xitaa jiilal.",
      "Xikmadduna waa in camalka aan cilmi lahayni uu indho la'aan yahay, aqoonta aan camal la'aantuna ay tahay mid aan midho dhal ahayn. Aqoonta saxda ah waxay qofka ka ilaalisaa hal-abuurnimo iyo marin-habaabinta, waxay sii qoto dheeraysaa daacadnimada, waxayna siinaysaa awood uu dadka kale uga faa’iidaysto halkii uu naftiisa uun ka faa’iidaysan lahaa. Culimada Islaamku waxay had iyo jeer ka digayaan labada khatarood: Jaahilnimada oo lagu dhaqmo, iyo aqoon la'aan.",
      "Dhab ahaantii: go'aanso inaad si joogto ah u barato wax faa'iido leh - aayad, xadiis, xukun aad uga baahan tahay cibaadadaada maalinlaha ah. Ka bilow waxyaabaha daruuriga ah ee caqiidada, ducada, daahirinta, iyo mamnuucida waaweyn, ka dibna si tartiib tartiib ah u qoto dheeree. La wadaag waxa aad barato si is-hoosaysiin ah, oo had iyo jeer ku dabaq naftaada marka hore.",
    ],
    quran: [
      {
        excerpt:
          "Waxaad dhahdaa: Kuwa wax yaqaan ma la siman yihiin kuwaan wax ogayn? Kuwa wax garanaya uun ha fiirsadaan.",
      },
      {
        excerpt: "Waxaad dhahdaa: Eebow ii siyaadi cilmiga.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qofkii dariiq cilmi raadis ah mara, Alle wuxuu u fududeynayaa waddo uu ku galo Jannada.",
      },
      {
        excerpt:
          "Qofku markuu dhinto camalkiisu wuu dhammaanayaa saddex mooyee: Sadaqo socota, cilmi faa'iido leh, ama ubad toosan oo u duceeya.",
      },
    ],
    actions: [
      "Baro wax faa'iido leh usbuuc kasta.",
      "La wadaag aqoonta aan isla weynayn.",
      "Codso waxaad barato ka hor intaadan ururin wax badan.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Cibaadada iskaa wax u qabso ah",
    summary: "Alle ugu dhawaada nafti ka baxsan waajibka.",
    body: [
      "Cibaadada iskaa wax u qabso ah (nafl) waxaa loola jeedaa cibaadada dheeraadka ah ee uu mu'minku bixiyo oo ka baxsan waxa Alle ku waajib yeelay - salaad dheeraad ah, soonka dheeraadka ah, sadaqada dheeraadka ah iyo xuska. Waajibku waa u horreeyaa oo lama gorgortami karo, laakiin marka la fuliyo, nafisku waa meesha uu adeeguhu muujiyo jacayl, isu-dhowaansho, iyo hilow ka gudubta intii ugu yarayd ee loo baahnaa.",
      "Waxaa ku lifaaqan balan qaad cajiib ah. Xadiis qudsi ah waxa uu Alle ku yidhi:- Addoonkaygu iguma soo dhawaado wax iga jecel oo aan ahayn waxa aan ku waajibiyay. Wuuna igu soo dhawaada camal iskaa wax u qabso ah ilaa aan ka jeclaado' - mar alla markuu addoon jeclaado, ducadiisa waa laga jawaabaa, arrimihiisana waa la toosiyaa. Cibaadada iskaa wax u qabso ah ayaa haddaba ah jaranjarada u dhawaanshaha, ka soo fuulidda addeecidda keliya ee xagga jacaylka rabbaaniga ah.",
      "Sunnadu waxay hodan ku tahay noocyada la heli karo: salaadda habeenka (tahajjudka) ee habeenka qaybteeda dambe, salaadda casar (duha), salaadaha sunnaha ah ee caadiga ah ka hor iyo ka dib, soonka is-xilqaan sida Isniinta iyo Khamiista ama maalmaha cadaanka ah ee bil kasta. Cibaadada Naftu waxay sidoo kale si aamusnaan ah u dhejisaa waxyaabaha naga maqan - Nebigu ﷺ wuxuu baray in wax kasta oo ka maqan salaadaha waajibka ah laga dhammeeyo salaadda qofka ee maalinta qiyaame.",
      "Xikmadduna waa in naftu iimaanka sii noolaato oo ay korto. Waajibku waxay ilaaliyaan gundhigga, laakiin ficillada iskaa-wax-u-qabso waa halka uu wadnuhu ku fido, halka cibaadada gaarka ah ee aan cidina arag waxay dhistaa daacadnimo, iyo meesha uu qofku naftiisa ku tababaro imtixaannada adag ee nolosha. Waxa kale oo naxariis ah in falalkani yihiin kuwo ikhtiyaari ah - Alle wuxuu furay albaabo badan si uu qof kastaa uga gudbo kuwa isaga ku habboon.",
      "Dhab ahaantii, furuhu waa sii jiritaan, ma aha xoojinta. Rasuulku ﷺ wuxuu baray in camalka Eebbe loogu jecel yahay ay yihiin kuwa ugu joogtada badan, xitaa haddii ay yar yihiin. Dooro dhawr fal oo iskaa wax u qabso ah oo aad si dhab ah u xajisan karto - laba rakcadood oo tahajjud ah, hal sooman wiiggii, qayb go'an oo Qur'aan ah - halkii aad ka heli lahayd qarax hammi oo gubanaya maalmo gudahood.",
    ],
    quran: [
      {
        excerpt:
          "021-047 (Nabigu) waxay ka tageen Sariirtooda markay baryeen Eebahood cabsi iyo rajayn, waxaan ku arzuqnayna wax ka bixiya. Nafna ma oga waxa loogu qariyey nasteexa oo ka abaal-marin waxay falayeen.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Addoonkayga iguma soo dhawaado wax iga jecel oo aan ahayn waxa aan ku waajibiyay. Addoonkaygana wuxuu iigu soo dhowaadaa camal mutadawacnimo ilaa aan ka jeclaado isaga.",
      },
    ],
    actions: [
      "Tukado tahajud xataa hadday laba rakcadood yihiin.",
      "Maalmo ikhtiyaari ah oo degdeg ah marka la awoodo.",
      "Ku dar salaad sunno ah oo joogto ah ka hor/dabadeed fardka.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Dulqaad & mahadnaq",
    summary: "Eebbana wuxuu jecelyahay kuwa samra ee ku shukriya.",
    body: [
      "Dulqaadka iyo mahadnaqa (shukr) waa labada garab ee uu mu’minku nolosha ku duulo. Samirku waa ku adkaysiga saddex arrimood oo kala ah: ku adkaysiga addeecidda Alle, ka-hortagga caasinimada, iyo u adkaysiga imtixaannada nolosha iyada oo aan laga cabanaynin xukunkiisa. Mahadnaqtu waa in nimco kasta loo aqoonsado inay xagga Eebbe ka timid iyo ku jawaabidda mahadnaqidda qalbiga, carrabka, iyo ficil addeecida. Waxay si wada jir ah u daboolayaan jawaabta mu'minka ee dhibka iyo fudaydka labadaba.",
      "Muhiimaddoodu waa inay qeexaan sida qofka mu’minka ahi ula kulmo wax kasta oo ku dhaca isaga. Nabiga ﷺ wuxuu la yaabay in mu'minka arrintiisa oo dhami ay wanaagsan tahay, markuu kheyr la yimaado wuu shukriyaa oo u kheyr, markuu dhib ku dhacona wuu sabraa, taasna isagaa u anfaca - waa nicmo aan mu'minka ahayn oo aan cid kale helin. Markaa wax kasta oo yimaada, mu’minku waxa uu leeyahay waddo uu ku ajar galo.",
      "Abaalmarinta samirku waa mid aan xad lahayn. Iyadoo inta badan camalka lagu abaalmariyo tiro la qiyaasi karo, Alle wuxuu yiri: 'Kuwa sabra waxaa la siin doonaa abaalkooda xisaab la'aan' (Qur'aanka 39:10). Mahadnaqtu waxay wadataa ballankeeda korodhka: 'Haddii aad shukriyadaan, hubaal waan idiin kordhin doonaa' (Qur'aanka 14:7). Mahadnaqa, markaa, maaha oo kaliya jawaabta saxda ah ee barakooyinka - waa waxa iyaga laftiisa keenaya inay koraan.",
      "Xikmada halkan waxay dib u habaynaysaa dhibaatada gebi ahaanba. Tijaabooyinku si toos ah uma aha ciqaab; Qofka mu'minka ah ee si fiican uga jawaaba, waxay u noqon karaan daahirin tirtiraya dembiyada iyo kor u qaadista darajada. Rasuulku ﷺ wuxuu baray in daal, jirro, werwer, ama xittaa muddada qodaxdu aanay ku dhicin qofka muslimka ah isagoon Eebbe ku tirtirin dembigiisa qaar ka mid ah. Tani waxay u beddeshaa waqtiyada ugu adag nolosha fursado halkii ay ka ahaan lahayd khasaare saafi ah.",
      "Dhab ahaan: marka ay masiibo dhacdo, ku jawaab erayada Alle baray — ‘Innaa Lillaahi Wa innaa Ilayhi Raajicuun’ (Innagaa leh Allaah, xaggiisana waan u laabanaynaa) — oo ka qabooji calaacalka diidmada amarkiisa. Wakhtiga wanaagsan nicmooyinkaaga kor ugu tiriya oo Alle ugu mahad naq ugu yaraan dhawr ka mid ah maalin kasta; Magacaabiddooda waxay ka dhigtaa qalbi jilicsan oo mahad leh.",
    ],
    quran: [
      {
        excerpt:
          "U bishaaree kuwa samra, markay musiibo ku dhacdo yidhaahda annagu waxaan leenahay Eebe xaggiisaana u noqonaynaa. Korkooda waxaa ah barako Eebehood iyo naxariista korkoodana waa kuwa hanuunsan.",
      },
      {
        excerpt:
          "Haddaad mahadisaan, hubaal waan idiin kordhin doonaa; Haddaad beenisaan cadaabkaygu waa daranyahay.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qofka mu'minka ah arrinkiisu waa la yaab, waayo, dhammaan arrimihiisa waa wanaagsan yihiin. Hadduu fudayd yimaado wuu mahad naqayaa, taasina waa u khayr; hadduu dhib yimaado waa uu sabraa, taasina waa u kheyr. Taasna cidna uma aha Mu'miniinta mooyee.",
      },
    ],
    actions: [
      "Innaa lillaahi wa innaa ilayhi raajicuun marka la tijaabiyo dheh.",
      "Kor buu Alle ugu mahad naqayaa saddex nicmood maalin kasta.",
      "Ha ka caban wax diida amarka Alle.",
    ],
  },
  {
    title: "Alle u yeedha",
    summary: "Qofkii hanuuniyana wuxuu helayaa ajar la mid ah kii raacda.",
    body: [
      "Dacwah macnaheedu waa in dadka kale loogu yeedho xagga Alle - la wadaaga fariinta Islaamka, bar qofka inuu tukado, dhiirigelinta wanaagga, si tartiib ah u niyad jabinta khaladka, ama caawinta qofka Muslimka ah ee halganka ku jira inuu ku soo laabto addeecidda. Waxay ahayd risaalada nebi kasta, waana masuuliyad la wadaago bulshada, mid walbana hadba sida uu u awoodo iyo aqoontiisa. Looma hayo culimada; Qof kasta oo soo gudbiya xitaa hal shay oo faa'iido leh wuxuu u yeedhaa Allaah.",
      "Abaalkeedu waa mid ka mid ah kuwa ugu deeqsisan Islaamka oo dhan. Rasuulku (scw) wuxuu yidhi qofkii ku hanuuniyo wanaag wuxuu leeyahay ajar la mid ah kii ku camal falay, xadiis kalena, qofkii u yeedha hanuunka wuxuu helayaa ajriga inta raacda, iyada oo aan la dhimin ajarkooda wax yar. Tani waxay ka dhigan tahay in wanaagga aad dejisay uu sii kordhin karo abaalmarintaada qof kasta oo uu taabto, muddo dheer ka dib markaad dhaqaaqdo.",
      "Laakiin dacwadu waxay leedahay adab — hab — ay tahay in la sharfo si ay u guulaysato. Eebe wuxuu amray: ' ugu yeedh Jidka Eebahaa si xigmad iyo waano wanaagsan, kulana dood sida ugu wanaagsan' (Qur'aanka 16:125). Xikmad macnaheedu waa in wax sax ah loo sheego, qofka saxda ah, sida saxda ah iyo waqtiga; qallafsanaanta, isla waynida iyo bar-kulantu dadka way kaxeeyaan oo khiyaameeyaan ujeeddada. Qofka soo wacaya shaqadiisu waa gudbinta iyo beerista, ee ma aha in uu quluubta ku qasbo, oo Alle keligii leeyahay.",
      "Xikmada ku jirta in abaalgudka intaa le'eg lagu xidho hanuuninta dadka kale waa in ay ka dhigto rumayste kasta isha wanaag socda. Waxa kale oo ay ilaalisaa qofka soo wacaya caqiidadiisa: in dadka kale loogu yeedho ducada, daacadnimada, iyo cibaadada waa in la xasuusiyo in la isku dhego. Waxayna isku xidhaa bulshada is-xakamaynta halkii ay ka ahaan lahayd dayaca labada dhinac.",
      "Dhab ahaantii, ka bilow meel u dhow guriga. Horumari oo baro qoyskaaga - xaaskaaga, cunuggaaga, walaalka - maadaama ay yihiin mas'uuliyaddaada ugu horreysa uguna waarta. La wadaag aqoonta faa'iidada leh si naxariis leh, ku caawi qof inuu barto salaadda ama akhrinta Qur'aanka, xusuusnow in nolosha akhlaaqda wanaagsan iyo cibaadada joogtada ahi ay inta badan tahay dacwooyinka ugu qancinta badan.",
    ],
    quran: [
      {
        excerpt: "ugu yeedh Jidka Eebahaa si xigmad iyo waano wanaagsan, kulana dood si wanaagsan.",
      },
      {
        excerpt:
          "yaa ka khayr badan hadal ruux u yeedha Eebe oo falay wanaag oo yidhi anigu waxaan ka mid ahay Muslimiinta.",
      },
    ],
    hadith: [
      {
        excerpt: "Qofkii ku hanuuniya wanaaga wuxuu mudan abaalgud la mid ah kii sameeya.",
      },
    ],
    actions: [
      "La wadaag aqoonta waxtarka leh si naxariis leh.",
      "Caawi qof inuu barto salaadda ama akhrinta Qur'aanka.",
      "U noqo tusaale akhlaaqda wanaagsan ee bulshada dhexdeeda.",
    ],
  },
  {
    title: "Shaqooyinka waaweyn ee nolosha oo dhan",
    summary: "Xaaji, qoys, iyo samafal waarta.",
    body: [
      "Cibaadada maalinlaha ah iyo toddobaadlaha ah ee ay weheliso cibaadada, Islaamku waxa uu mu’minka u tilmaamayaa dhawr hawlood oo waaweyn oo cimri-dherer ah – maal-gelin ballaadhan oo abaal-marintoodu aad u weyn tahay, mararka qaarkoodna, aan dhammaanayn. Kuwani waa mashaariicda mudan in la qorsheeyo nolosha ku xeeran: Xajka, korinta qoyska xaqa ah, iyo dhisidda camal wanaagsan oo waara.",
      "Waxaa ugu horreeya Xajka oo ah tiirka shanaad ee Islaamka, oo ku waajib ah noloshiisa hal mar qof kasta oo Muslim ah oo awood u leh jir ahaan iyo dhaqaale ahaanba - 'Xajka Baydka waa waajib Alle ku leeyahay dadka awood u leh inay jid helaan' (Qur'aanka 3: 97). Abaalkeedu waa nadiifin dhammaystiran: Nabigu (scw) wuxuu yidhi qofkii xajka Alle dartii u xajiya oo ka fogaada fisqiga iyo dembigu wuu soo noqonayaa isagoon dembi lahayn, isagoo daahir ah maalintii hooyadii dhashay. Xajka la aqbalay ayuu yidhi, Ajar ka yar Jannada ma laha. Cumrada, xajka yar, sidoo kale waxay xanbaarsan tahay ajir weyn waxayna tirtirtaa dembiyada inta u dhaxaysa hal cumro iyo tan xigta.",
      "Maalgelinta labaad ee weyn waa sadaqah jariyah - sadaqo joogto ah oo qofka abaal marinaysa geeri ka dib. Rasuulku ﷺ wuxuu ku magacaabay saddexda shay ee qofka qabriga ku jira faa'iido u leh, oo ay weheliso cilmi faa'iido leh iyo ilmo toosan oo u duceeya. Ku barbaarinta ubadka iimaanka iyo akhlaaqda wanaagsan ayaa laga yaabaa inay tahay tan ugu weyn, laakiin sidoo kale waa dhisitaanka ama dayactirka masjidka, qodista ceelka, kafaala qaadida agoonta, beerista geedka, ama maalgelinta waxbarashada - mid kasta oo ka mid ah qulqulka abaalgudka oo ka cimri dheer qofka wax bixiya.",
      "Xikmada ku jirta falalkaas ayaa ah inay qofka xisaabtiisa ka dheereeyaan cimrigiisa. Mu'minka cimrigiisu waa gaaban yahay, laakiin ceelkii uu qoday ama ubad uu si fiican u koray waxay sii wadi karaan abaal-marin qarniyo ah. Islaamku wuxuu sidaas darteed dhiirigeliyay aragtida fog: inaadan ka fikirin oo keliya salaadda maanta, laakiin ka fikir waxa wanaagsan ee weli kaa soo qulqulaya ka dib markaad maqan tahay.",
      "Dhab ahaantii: haddii aad awooddo, si dhab ah u qorshey Xajka ama Cumrada intii aad dib u dhigi lahayd dhammaadka lahayn. Ku shub dadaalka dhabta ah ee qoyskaaga iimaankooda iyo dabeecadooda, maadaama ay yihiin dhaxalkaaga ugu waara. Iyo in la ogaado ugu yaraan hal mashruuc samafal oo waara oo lagu taageerayo - aqoonta, biyaha, hoyga, ama agoonta - si camalkaaga wanaagsan u sii socdo dhimashada ka dib.",
    ],
    quran: [
      {
        excerpt:
          "Xajka Baydkana waa waajib Alle ku leeyahay dadka awood u leh inay helaan jid ay ku maraan.",
      },
      {
        excerpt:
          "Dadkana ugu bishaaree xajka; way idiin iman iyagoo lugaynaya iyo awr kasta oo caato ah oo marag kaste ah, si ay ugu marag kacaan nacfiga naftooda.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qofkii xajka Alle dartiis u soo xajiya oo aan faasiq iyo xad-gudub toona samayn wuxuu soo noqdaa isagoo dembi la', sidii maalintii hooyadii dhashay.",
      },
      {
        excerpt:
          "Qofku markuu dhinto camalkiisu wuu dhammaanayaa saddex mooyee: Sadaqo socota, cilmi faa'iido leh, ama ubad toosan oo u duceeya.",
      },
    ],
    actions: [
      "Qorshee Xajka ama Cumrada haddii aad awooddo.",
      "Maalgeli iimaanka iyo dabeecadda qoyskaaga.",
      "Taageer mashruuc samafal oo waara.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Naxariista Eebe - ereyga ugu dambeeya",
    summary: "Camalku waa macne; gelitaanka waa naxariistiisa.",
    body: [
      "Camalkii, dadaalkii iyo jidkii oo dhan ka bacdi, mu’minku waxa uu la imaanayaa run khushuuc ah oo ah hadalka ugu dambeeya ee safarkan: qofna ma galo jannada camalkiisa oo keliya. Nabigu ﷺ wuxuu ka sheegay naftiisa - kan ugu jecel uunka oo dhan Alle - isagoo leh xitaa kuma galo Jannada camalkiisa, waxaan ahayn inuu Eebbe ku daboolo naxariistiisa. Haddii ay sidaas tahay isaga, hubaal waa sidaas annaga.",
      "Tani waa inaan waligood loo fahmin shatiga dayaca cibaadada. Camalku waxa uu hadhsan yahay dariiqii Alle doortay oo amray; Wuxuu ku xidhay naxariistiisa iimaan iyo camal suuban, ka tagistoodana ma aha khushuuc ee waa halmaansho. Macnaha saxda ah waa mid ka mid ah saamiga: camalkayaga, si kasta oo ay u badan yihiin, weligood ma bixin karaan xitaa qayb ka mid ah nimcooyinka Eebe korkiisa, mana iibsan karaan daa'in Jannada. Sidaas awgeed waxaan u bandhignaa camalkeenna calaamad jacayl iyo addeecitaan, ka dibna si buuxda ugu tiirsanaano nimcadiisa si aan u aqbalno oo uu na aqbalo.",
      "Baaxadda raxmaddaasi waa mid liidata. Nebigu (scw) waxa uu sheegay in Eebbe naxariista u kala qaybiyey boqol qaybood; Eebe wuxuu u soo dajiyay khalqiga qayb keliya, waana in hooyadu u naxariisato ilmaheeda, xooluhuna u debecsanaadaan ubadkooda, wuxuuna dhawray sagaal iyo sagaashanka soo hadhay, si uu addoomadiisa ugu deeqo maalinta qiyaame. Wax kasta oo naxariis ah oo aynu weligeen adduunyada ku soo aragnay waa qayb ka mid ah boqol qayb.",
      "Taasi waa sababta rumaystaha dheellitiran uu u dhexeeyo rajo iyo cabsi, sida shimbir ku duulaysa laba baal. Waxa uu ka cabsadaa cadaalada Alle in ku filan in aanu marna ka caajisin ama ka tagin danbiga,waxana uu rajaynaya naxariista Eebe in ku filan oo aanu waligii quusan, si kasta oo uu u fogaaday. Gebi ahaanba u janjeerta dhanka cabsida waxay dhalisaa rajo la'aan; Gebi ahaanba u janjeerta xagga rajada waxay keentaa kibir. Magacyada Eebe - Ar-Raxmaan (Raxmaan), Ar-Raxiim (Raxiim), Al-Ghafoor (Eebbe Dambi Dhaafe) - ku dheji garabka rajada.",
      "Ee sidaas ha ahaato ruuxda aad maalin walba xidhato: Alle weydiiso Al-Firdows, ku dadaal, una toobad keen gefkaaga, dabadeed u dhiiba darajadaada u dambaysa Eebaha caaddil iyo naxariista leh, adigoo ku kalsoon in ruuxii dhawray sagaal iyo sagaashan naxariis maalintaas aanu ka celin addoon u yimi isagoo dadaal iyo rajayn.",
    ],
    quran: [
      {
        excerpt:
          "Naxariistayduna wax walba way koobtay. Ee waxaan u xukumi kuwa dhawrsada oo zakada bixiya iyo kuwa rumeeyey aayaadkanaga.",
      },
      {
        excerpt:
          "Waxaad dhahdaa: Addoomadayda ku xad gudbay Naftooda, ha ka quusanina naxariista Eebe. Illeen Eebbe wuu dhaafaa dambiyada oo dhan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Midkiin Jannada kuma galo camalkiisa oo keliya. Waxay yiraahdeen: Xataa adiga ma aha, Rasuulkii Alloow? Wuxuu yidhi: Xataa aniga ma aha, hadduusan Eebbe igu daboolin naxariistiisa.",
      },
      {
        excerpt:
          "Eebe wuxuu leeyahay boqol qaybood oo naxariis ah. Wuxuu soo dajiyay qayb ka mid ah Jinni, Insi, Xayawaan iyo Xashaar, oy isku naxariistaan. wuxuuna dhawray sagaal iyo sagaashan, si uu ugu naxariisto addoomadiisa maalinta qiyaame.",
      },
    ],
    actions: [
      "Isku dheelli tirka Alle ka cabsi iyo rajada naxariistiisa.",
      "Weligaa ha niyad jabin dembiga ka dib - toobad keen oo sii wad dadaalka.",
      "Allaah u waydii Al-Firdows iyo aakhiro wanaagsan (husn al-khatimah).",
    ],
    appLinks: [{}, {}],
  },
];

export const JANNAH_GATES_SO: DeepPartial<JannahGate>[] = [
  {
    name: "Albaabka Salaadda",
    deedSummary: "Kuwii dhawray oo sugay shanta salaadood.",
    hadith: [
      {
        excerpt:
          "Ruuxii ku bixiya labo-labo oo wax ah Jidka Eebbe waxaa looga yeeri doonaa albaabada Jannada. Ruuxii ka mid ahaa Ehelu Salaadda waxaa looga yeedhi doonaa Albaabka Salaadda.",
      },
    ],
  },
  {
    name: "Albaabka samafalka",
    deedSummary: "Kuwii sadaqada si daacad ah u bixiyay Allaah dartiis.",
    hadith: [
      {
        excerpt: "Qofkii ka mid ahaa dadka samafalka waxaa looga yeeri doonaa Iridda Sadaqada.",
      },
    ],
  },
  {
    name: "Albaabka Ar-Rayaan",
    deedSummary: "Waxaa loo hayaa kuwa sooman - irid keliya ayaa ka soo gala.",
    hadith: [
      {
        excerpt:
          "Jannada dhexdeeda waxaa ku yaal albaab la yiraahdo Ar-Rayaan, oo maalinta qiyaame ay ka gelayaan kuwa sooman. Marka ugu dambeeya galaan, waa la xidhi doonaa.",
      },
    ],
  },
  {
    name: "Albaabka Jihaadka",
    deedSummary: "Kuwa ku Jahaaday Jidka Eebe si daacad ah.",
    hadith: [
      {
        excerpt: "Qofkii ka mid ahaa dadka jihaadka waxaa looga yeeri doonaa Iridda Jihaadka.",
      },
    ],
  },
  {
    name: "Abaalmarinta Xajka",
    deedSummary: "Ee ah kuwa xajka ku kalifay iyagoon dambi lahayn.",
    hadith: [
      {
        excerpt:
          "Qofkii xajka Alle dartiis u soo xajiya oo aan faasiq iyo xad-gudub toona samayn wuxuu soo noqdaa isagoo dembi la', sidii maalintii hooyadii dhashay.",
      },
    ],
  },
  {
    name: "Irid walba looga yeedhay",
    deedSummary:
      "Qaar, sida Abuu Bakar, ayaa looga yeeri doonaa inay ka soo galaan dhammaan irdaha.",
    hadith: [
      {
        excerpt:
          "Abuu Bakar wuxuu weydiiyey: Ma cid looga yeeri doonaa albaabadaas oo dhan? Wuxuu yiri: Haa, waxaana rajeynayaa inaad ka mid noqon doonto.",
      },
    ],
  },
];

export const JANNAH_VERSES_SO: DeepPartial<JannahVerseEntry>[] = [
  {
    excerpt:
      "U orda Dambi dhaafka Eebihiin iyo Janno Ballaadhkeedu yahay sida Samooyinka iyo Dhulka oo loo darbay kuwa dhawrsada.",
  },
  {
    excerpt:
      "Jannooyin ay dureeri dhexdeeda Wabiyaal iyo Guryo wanaagsan oo Jannooyin ku waari dhexdeeda, raalli ahaanshiyaha Eebe yaa wayn.",
  },
  {
    excerpt: "Jannooyinka magangalya yeyna ku martigelin kuwa rumeeyey xaqa oo camal fiican falay.",
  },
  {
    excerpt: "Nafna ma oga waxa u qarsoomay nasteexo oo ka abaal-marin waxay falayeen.",
  },
  {
    excerpt: "Waxayna mudan waxay doonaan dhexdeeda, agtannadana waxaa ah siyaado.",
  },
  {
    excerpt: "Dhammaan waxaa jiri doona shahaadooyin sida ay sameeyeen.",
  },
  {
    excerpt: "Waa darajo Eebe agtiisa, Eebbana waa arkaa waxay fali.",
  },
  {
    excerpt: "Eebow na sii adduunyo wanaag, aakhirona wanaag, naga ilaali cadaabka naarta.",
  },
  {
    excerpt: "Naxariista Eebe ha ka quusanina, Eebana wuu dhaafaa dambiyada oo dhan.",
  },
  {
    excerpt: "Addoomadayda (Qiyaamada) wax cabsi ah idinkuma aha Maanta, mana murugoonaysaan.",
  },
  {
    excerpt: "Hor-u-yaalkii, hor-u-maray- waa kuwa la soo dhoweeyey.",
  },
  {
    excerpt: "Eebbana wuu ka ilaalinayaa xumaanta maalintaas, wuxuuna siin doonaa nuur iyo farxad.",
  },
];

export const JANNAH_DUAS_SO: DeepPartial<JannahDuaEntry>[] = [
  {
    context: "Ducada oo dhamaystiran oo wanaaga labada adduun iyo ilaalinta naarta.",
  },
  {
    context: "Duco kooban Tashaxudka ka dib: Janno weydiiso, Naartana laga magan galo.",
  },
  {
    context:
      "Weydiiso Jannada adigoo isticmaalaya Magacyada Quruxda badan ee Allaah ka dib Tashahhud.",
  },
  {
    context: "Weydiiso macaanka aragtida Alle iyo u hilowga la kulanka.",
  },
];

export const JANNAH_PROMISED_SO: DeepPartial<JannahPromisedEntry>[] = [
  {
    name: "Tobanka Jannada Loo Yaboohay",
    summary:
      "Abuu Bakar, Cumar, Cuthmaan, Cali, Talxah, Zubeyr, C/Raxmaan bin Cowf, Sacad, Saciid bin Zayd iyo Abuu Cubeyda (Alle haka raalli noqdee).",
    note: "Waxaa lagu wada magacaabay xadiis ku sugan Sunan al-Tirmidhi (3747, sahix).",
  },
  {
    name: "Run-sheegga iyo samirka",
    summary:
      "Eebbana wuxuu ku amaanaa kuwa run-sheega iimaanka ee ku samra addeecidda iyo imtixaannada.",
    note: "Bal eeg Qur'aanka 4:69 iyo aayado badan oo as-saadiciin iyo as-sabireen ah.",
  },
  {
    name: "Shuhadada Allaah dartiis",
    summary:
      "Kuwa u dhinta iyagoo difaacaya diinta islaamka sida ay qabto shareecada islaamka waxaa loogu bishaareynayaa Jannada.",
    note: "Culimadu waxay si sax ah u qeexaan Shahaadada; Dhimashada kasta oo ku dhacda dagaalka si toos ah uma qalmo.",
  },
  {
    name: "Kuwa hadalkooda u dambeeya tawxiid yahay",
    summary: "Ruuxii eraygiisa u dambeeya ee ah ‘Laa’ilaha illallaah’ jannada ayuu gelayaa.",
    note: "Sunan Abuu Daawuud 3116 (saxiix). Dhammaadka wanaagsan waa daba-gal nololeed oo dhan.",
  },
  {
    name: "Nabiyada",
    summary: "Nebi kastaa wuxuu ku sugan yahay darajooyinka ugu sarreeya Jannada qaddarka Eebbe.",
    note: "Saldhigooda laguma gaaro ficillada caadiga ah - waa la doortay oo la ilaaliyaa.",
  },
];
