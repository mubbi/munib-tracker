// Somali translation overlay for the Learn "Jahannam" content. Mirrors the order of
// its English source in ../jahannam*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  JahannamDuaEntry,
  JahannamGateEntry,
  JahannamHadithEntry,
  JahannamNameEntry,
  JahannamReferenceEntry,
  JahannamReflectionEntry,
  JahannamTopic,
  JahannamVerseEntry,
} from "../../types/jahannam";
import type { DeepPartial } from "./localize";

export const JAHANNAM_CORE_TOPICS_SO: DeepPartial<JahannamTopic>[] = [
  {
    title: "Hordhac",
    summary: "Eebe wuxuu nooga warramaa Jahannamada hanuun -ha quusan.",
    body: [
      "Jahannam - oo inta badan loo tarjumo Naarta ama Naarta - waa hoyga ciqaabta aakhiro ee uu Alle ku sifeeyay Quraanka iyo Rasuulkiisa ﷺ. Waxa uu inoo sheegayaa in aynaan qalbiga ku burburin, laakiin ay quluubtu toosaan, dib u noqdaan, oo ay doortaan jidka naxariista iyada oo albaabku weli furan yahay.",
      "Way ku caawinaysaa in la fahmo sababta Rabbi naxariista leh uga hadlo naarta gabi ahaanba. Digniintu lafteedu waa raxmad: Qofkii loo sheego jarar gudcur ah oo mugdi ku soo fool leh waa la siiyey hadiyad ee maaha hanjabaad. Aayad kasta oo ka hadlaysa Jahannama waa Eebbe naxariistiisa, isagoo addoomadiisa dib ugu yeedhaya ka hor intaanay wakhtiga soo noqon.",
      "Tani waa sababta digniinaha loogu lamaaneeyey waxyiga oo dhan iyo baaqyada towbad keenka, cafiska, iyo rajo siinta naxariista wayn ee Eebe. Qur'aanku waa dhif in uu naarta ku sheego meel aan jirin, meel u dhow, isagoo xusaya Jannada, albaabka furan ee tawbah, iyo jacaylka Eebbe ee kuwa soo noqda. Ujeedadu waa isla xisaabtanka u horseedaya xaqnimada - waligaa ha quusan.",
      "Rumaynta Jahannamada waa qayb ka mid ah rumaynta waxa maqan (al-ghayb), caddaaladda Eebbe iyo xaqiiqada maalinta aakhiro. Waxay culayska siinaysaa doorashadayada oo waxay miisaamaysaa rajada Jannada ku jirta dembiga culus, si uu mu'minku u dhex socdo rajo iyo cabsi - mid rajo ka qaba naxariista Eebbe, isagoo ilaalinaya ceebihiisa.",
      "Qodob ka mid ah raaxada udub dhexaad u ah caqiidada Sunniga ah waxay dhex maraysaa cutubkan oo dhan: kuwa u dhinta iyagoo rumaysan Allaah oo keliya, xitaa haddii dembigu culaysyo, kuma sii jirayaan naarta weligood. Naxariista Eebe iyo shafeeco uu idmo, Mu'miniinta dambiga galay ayaa ugu dambeyn la soo saaray; Waxaa hadhay kuwa rumaysad la'aan ku dhinta. So the study of Jahannam is, for the believer, ultimately a study of how to reach mercy.",
      "Qaybtani waxa ay soo bandhigaysaa waxa ay qoraaladu si cad u sheegeen, waxa uu si daacad ah u xusayaa halka ay culimadu ku khilaafeen, waxa uu daliishanayaa oo kaliya daliil sugan, waxa aanu si joogto ah kuu tilmaamayaa dhinaca tawbah, camalka suuban iyo talo saarashada Alle.",
    ],
    quran: [
      {
        excerpt:
          "ka Dhawrsada Naarta Gaalada loo Darbay, Adeecana Eebe iyo Rasuulka waxaad u Dhawdihiin in laydiin Naxariisto.",
      },
      {
        excerpt:
          "Waxaad dhahdaa: Addoomadayda ku xad gudbay Naftooda, ha ka quusanina naxariista Eebe. Illeen Eebbe wuu dhaafaa dambiyada oo dhan.",
      },
      {
        excerpt:
          "Kuwa (xaqa) rumeeyow u toobad keena Eebbe toobad toosan, waxay u dhawdahay inuu Eebihiin idinka reebo xumaantiinna oo idin galiyo Jannooyin.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Muxuu Allaah u Abuuray Jahannamo",
    summary:
      "Cadaalada Rabbaani ah, isla xisaabtanka, iyo cawaaqibka ka dhalan kara doorashada xorta ah.",
    body: [
      "Jahannama waxay u jirtaa muujinta cadaaladda qumman ee Alle ('adl). Koonka ay dulmiga iyo dulmanaha, daacadda iyo khaa’inul-wadayaasha, dhammaan isku meel ku wada kulmaan, xaq noqon mayso. Maxaa yeelay Alle waa caadil qummane, waa in xisaab dambe la helaa oo xumaan kasta laga jawaabo, wanaag kastana lagu sharfo.",
      "Taas waxa udub dhexaad u ah in Alle cidna aanu dulmiyin. Naf kasta oo naarta gasha waxay ku gashaa dooq ay iyadu dejisay oon toobad keenin, waligoodna waxay ku galaysaa xukun aan la soo koobi karin. Qur'aanku waxa uu ku nuuxnuuxsaday: 'Ilaah dadka waxba ma dulmiyo, laakiin dadku naftooda ayay dulmiyaan' (4:40). Qofna laguma ciqaabo wuxuusan samayn, iyo wax dhaafsiisan wixii uu mudnaa.",
      "Bini'aadmiga mugdi lagagama tegin. Eebbana wuxuu siiyey caqli, una soo diray rususha, una soo dejiyey hanuun cad, ka dibna wuxuu ku sharfay inay aqbalaan ama diidaan: “Ruuxii doono ha rumeeyo; (18:29) Ruuxii doonana ha beeniyo. Ku adkaysiga diidmada runta, dulmiga, ama dembiga weyn ee aan toobad keenin waxay keenaysaa cawaaqib aakhiro si sax ah sababtoo ah doorashadu waxay ahayd mid dhab ah midda.",
      "Haddana xataa halkan naxariistu waxay abuurtaa caddaaladda. Eebbana wuu ka digtoonaadaa intuusan xukumin, wuuna dib u dhigaa xisaabinta si uu u banneeyo soo noqoshadiisa, wuuna cafiyaa marka la waydiiyo, wuxuuna ka abaalmariyaa camal keliya oo wanaag ah marar badan isagoo dembi keli ah qoraya. Caddaaladdiisu weligeed kama soocna naxariistiisa.",
      "Haddaba dib u milicsiga sababta uu Jahannam u jiro waa in la kordhiyo taqwada (Ilaah-miyirka) iyo in la kordhiyo mahadnaqa maalin kasta oo nolosha ah oo weli ah fursad lagu towbad keeno. Waxaa loola jeedaa in wadnaha laga dhigo mid dhab ah oo rajo leh hal mar - marnaba yaan la curyaamin rajo beel.",
    ],
    quran: [
      {
        excerpt: "Illeen Alle dadka ma dulmiyo haba yaraatee, laakiin dadku naftooda ayaa dulmiya.",
      },
      {
        excerpt: "Waxna lagama warsado wuxuu fali waase la warsan.",
      },
      {
        excerpt:
          "Ku alla kii doonaya ha rumaysto; Ruuxii doonana ha beeniyo. Waxaana u darabnay Daalimiinta Naarta.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Midkiin Jannada kuma galo camalkiisa oo keliya. Waxay yiraahdeen: Xataa adiga ma aha, Rasuulkii Alloow? Wuxuu yidhi: Xataa anigu ma aha, hadduusan Eebbe iga qarin naxariistiisa.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Xaqiiqda Aakhiro",
    summary:
      "Laga soo bilaabo dhimashada ilaa xukunka - marxalad kasta waa run oo waxay ku xidhan tahay aqidah.",
    body: [
      "Si loo fahmo Jahannam si sax ah, waxay kaa caawinaysaa inaad aragto halka ay ku fadhido safarka weyn. Islaamku wuxuu barayaa tix-raac cad geerida ka dib: naftu way ka baxdaa jidhka, ka dibna barzakh (nolosha dhexda ee qabriga) ayaa bilaabmaysa, ka dibna soo bixinta marka meydka la sara kiciyo, kulminta uunka oo dhan, xukunka meesha camalka lagu baaro, miisaanka camalka ee Miisaanka (al-Mizan), ka gudubka ee Buundada (as-Sirat), iyo ugu dambeyntii nafta oo dhan - Jannada dhexdeeda. cadaalad, iyo naxariis.",
      "Mid kasta oo ka mid ah marxaladahaas waxaa lagu xaqiijiyaa caqiidada Sunniga ah ee caadiga ah iyadoo lagu saleynayo Quraanka iyo Sunnada saxda ah. Jadwalkani ma aha calaamad ama sheeko; waa xaqiiqo in la rumeeyo inay ka mid tahay rumaynta maalinta aakhiro, in la diido iyadoo la ogna waa arrin caqiido ah, ee ma aha oo kaliya ku-dhaqanka.",
      "In la arko jidka oo dhan ayaa sidoo kale dib u habaynaya Dabka. Waa hal meel oo suurtagal ah dhamaadka safarka naf kasta ayaa horay u safreysay - taas oo macnaheedu yahay doorashada maanta maaha mid aan la taaban karin. Waxay yihiin tillaabooyin jidkaas mara, welina annagaa iska leh inaan toosinno.",
      "Ogaanshaha tixdan waxa ay ka caawisaa qofka mu’minka ah in uu u diyaargaroobo intii uu ka cabsan lahaa: in uu la noolaado xusuus caafimaad qabta oo geerida (dhikir al-mawt), in uu hagaajiyo wixii khaldamay ka hor inta aan la gelin shirka, iyo in uu buuxiyo xisaabaadka camalka wanaagsan iyada oo weli albaabkii camalku furan yahay. Geeridu waxay xidhay albaabkaas; waxba laguma dari karo ka dib.",
    ],
    quran: [
      {
        excerpt:
          "markaas dabadeed waad dhimanaysaa. Markaas waxaa laydin soo bixin Maalinta qiyaame.",
      },
      {
        excerpt:
          "Ruuxiise miisaankiisu cuslaado wuxuu gali nolol wanaagsan. Kii miisaankiisu fududaa, magangalkiisu wuxuu ahaan doonaa yaamays.",
      },
    ],
    actions: [
      "Baro marxalad kasta Baro Aqidah oo ku xidh caqiidada iyo doorashooyinka maalinlaha ah.",
      "In la badiyo xusuusta geerida (dhikir al-mawt) iyadoon la dayacin rajada naxariista.",
    ],
    appLinks: [{}, {}, {}, {}, {}, {}],
  },
  {
    title: "Magacyada Naarta",
    summary:
      "Magacyada Qur'aanka oo macnayaal leh - culimadu waxay ku kala duwan yihiin in mid walba uu yahay heer gaar ah.",
    body: [
      "Quraanku wuxuu naarta ku tilmaamay dhawr magac, mana aha ku celcelin kaliya. Afka Carabiga, magaca inta badan waxa uu xambaarsan yahay tilmaamo muuqda, sidaa awgeed magac kasta waxa uu wax ka bartaa xaqiiqada uu tilmaamayo. Waxaa ka mid ah Jahannam, Jaxiim, Saqar, Saacir, al-Hutamah, al-Hawiyah, iyo Lazaa.",
      "Magac kastaa waxa uu daaqad ka furayaa dhinac ka duwan darnaanta. Jaheem iyo Saacir waxay kiciyeen dab aad u kulul, oo shiday; Saqar, wixii kulba oo aan waxba ka tagin; al-Hutamah, burburiyaha jabiya wax kasta oo lagu tuuro; al-Hawiyah, god dheer oo uu qofku ku dhaco; iyo Lazaa, oo ah olol saafi ah. Magacyada oo la wada akhriyo waxa ay dhistaa sawir miyir qaba oo qalbigu aanu si fudud iskaga indho tiri karin.",
      "Culimada qadiimiga ah ee tafsiirka - sida Ibn Kathir iyo al-Tabari - waxay sharraxayaan magacyadan asalkooda Carabiga waxayna ka doodaan mid walba macnaha aayadda halka ay ku qoran tahay, halkii ay ula dhaqmi lahaayeen liis farsamo oo go'an.",
      "Halkan waa eray taxaddar leh. Qaar ka mid ah qorayaasha dambe waxay soo bandhigaan magac kasta si gaar ah, oo loo qiimeeyo 'heerka' Jahannamo, mararka qaarkoodna leh jaantusyo faahfaahsan. Taasi waa tafsiir cilmiyeed ee ma aha liis hubin cad oo lagu sheegay Qur'aanka ama xadiiska la isku raacay. Habka isku dheeli tiran waa in la barto macnaha qoraaladu si dhab ah u bixiyaan iyo in laga fogaado soo bandhigida khariidadaha mala-awaalka ah sida hubaal ah.",
      "Ujeedada barashada magacyadu maaha in la qanciyo xiisaha laakiin waa in la jilciyo qalbiga oo loo dhaqaajiyo naxariista uu cutubkani tilmaamayo. Ka baadh ururinta magacyada oo buuxa magac kasta dhacdada Qur'aanka, macnaha guud iyo tafsiirka oo kooban.",
    ],
    quran: [
      {
        excerpt: "Jahannamo waa ku filan meel lagu nasto.",
      },
      {
        excerpt: "Waxaa lagu tuuri doonaa al-Hutamah - Naarta wax burburisa.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Heerarka Naarta",
    summary:
      "Heerarka ciqaabta kala duwan - qaabka saxda ah si buuxda looguma tafatirin qoraallada.",
    body: [
      "Mabda'a Qur'aanku si cad u sheegay waa in ciqaabtu ay tahay mid isku mid ah: qof kasta oo naarta ku jira isku qiyaas ma aha. \"Dhammaan waxaa jiri doona darajooyin siday sameeyeen\" (6:132). Middaasi lafteedu waa muujinta caddaaladda – kii wax yar dulmiyey loolama dhaqmo sidii kii wax badan dulmiyey.",
      "Sunnada saxda ahina waxay ina tusinaysaa isla mabda’a. Nebigu ﷺ wuxuu ku tilmaamay qofka ugu ciqaab yar naarta inuu yahay mid cagaha hoostooda la geliyo laba shil oo maskaxdiisu ka karkariso - haddana waa kan ugu fudud cadaab dadkeeda oo dhan (Saxiixul Bukhaari 6562). Haddii ay taasi ugu yar tahay, maskaxdu waxay fahamsan tahay sida ay u daran tahay shahaadooyinka weyn, iyo intee in le'eg ayay tahay sababta maanta dib loogu noqonayo.",
      "Isla markaana, waxyigu ma siin rumaystayaasha khariidad dhammaystiran oo nambaraysan oo ah qaabka Jahannamo oo ay waajib ku tahay inay xafidaan. Culimadu waxay ka hadleen heerarka, qoto dheer iyo qaybaha laga soo qaatay aayado iyo warbixino kala duwan, laakiin inta badan tani waxay sii ahaanaysaa fasiraad halkii la isku raacay, qoraal cad.",
      "Laba shay, si kastaba ha ahaatee, waa hubaal. Ugu horrayn, dulmigaas (dhulm), shirkiga, iyo dembiga waaweyn ee joogtada ah oo aan ka toobad keenin ayaa xambaarsan digniin adag. Midda labaad - oo aan marnaba la hilmaamin - in naxariista iyo dembi-dhaafka Alle ay u furan yihiin illaa laga gaarayo geerida qof kasta oo si dhab ah ugu soo noqda. Ujeedada barashada shahaadooyinka ayaa ah in la doorto dariiqa fudud inta doorashadu ay hadhsan tahay.",
      "Dhab ahaantii, tani waxay ka dhigan tahay in liisaska tifaftiran ee 'toddobo heer' ama qorshayaal la mid ah loola dhaqmo sidii ra'yi cilmiyeed halkii laga ahaan lahaa caqiido la dejiyay, iyo in fiiro gaar ah loo yeesho waxa dhab ahaantii ilaaliya: iimaanka, towbada, iyo camalka xaqa ah.",
    ],
    quran: [
      {
        excerpt: "Dhammaan waxaa jiri doona shahaadooyin sida ay sameeyeen.",
      },
      {
        excerpt:
          "Munaafiqiintu waxay ku sugnaan meesha ugu hoosaysa ee naarta umana heshid gargaare.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ciqaabta ugu yar ee ehelka naarta waa nin cagihiisa hoostooda la geliyo laba shil oo ay maskaxdiisu ka karkariso.",
      },
    ],
    disclaimer:
      "Jaantusyada heerarka Jahannamo ee laga helay buugaagta qaarkood waxay ka tarjumayaan tafsiir cilmiyeed, ma aha heshiis loo dhan yahay.",
  },
  {
    title: "Albaabka Naarta",
    summary: "Toddoba albaab — waxa Qur'aanku sheegay iyo meelaha tafsiirku ku kala duwan yahay.",
    body: [
      "Hal tafaasiil oo ku saabsan Jahannama ayaa si cad oo aan mugdi ku jirin loogu sheegay Qur'aanka: 'Runtii, naarta waxay leedahay toddoba albaab; Waayo, irrid kastaa waxay leedahay qayb gaar ah. (15:44). Haddaba rumaynta toddobada albaab waxay ku xidhan tahay waxyi cad, ee maaha wax mala awaal ah.",
      "Aayadu waxay caddaynaysaa laba arrimood: inay jiraan toddoba irridood, kuwa soo galana la qaybiyo. Culimada qadiimiga ah ee tafsiirka ayaa ka doodaya waxa qaybintu ka dhigan tahay - haddii ay tilmaamayso qaybaha dadka, ilaa heerka ciqaabta u dhigma falalka, ama labadaba. Xikmadda ka danbeysa kala qaybsanaanta waxaa iska leh Alle, oo cadaaladiisu ay naf walba dhigto halka ay ka tirsan tahay.",
      "Waxaa muhiim ah in la ogaado halka uu hubaalku ku dhammaanayo. Qaar ka mid ah shaqooyinka dambe waxay ku meeleeyaan albaab kasta dembi gaar ah ama koox gaar ah. Shaqooyinkan gaarka ah maaha kuwo si isku mid ah loo aasaasay ilaha ugu horreeya, sidaa darteed waxaa sida ugu wanaagsan loogu soo bandhigay aragtiyo aqoonyahanno gaar ah halkii ay ahaan lahaayeen qeexitaan nebiyad.",
      "Sida heerarka, casharrada albaabadu maaha mid dhismeed laakiin waa akhlaaq: waxaa jira albaabo badan oo u horseedaya Naarta, iyo habka looga badbaadi karo dhammaantood waa isku mid - iimaan daacad ah, ka fogaanshaha dembiga weyn, iyo towbad keen degdeg ah marka qofku simbiriiro.",
    ],
    quran: [
      {
        excerpt:
          "Jahannamo waa u yaboohay dhammaantood. Waxay leedahay toddoba irdood; Waayo, irid kasta waa qayb loo qoondeeyey.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Sharaxaada Jahannamada",
    summary:
      "Dabka, kulaylka, silsiladaha, qoomamaynta - oo lagu soo bandhigay xushmad, maaha dareen.",
    body: [
      "Qur'aanka iyo Sunnada saxda ah waxay ku sifeeyaan Jahannama luqad hufan oo la taaban karo, waxayna sidaas u yeelaan sabab: Qalbiga bini'aadamka waxaa dhaqaajiya muuqaallo uu sawiran karo marka loo eego fikradaha aan la taaban karin. Sharaxaadaha - dab aad u daran, kulayl aan loo dulqaadan karin, cunto iyo cabitaan xaddidan, silsilado, mugdi, iyo qoomamo qoto dheer - waxaa loola jeedaa in khatarta laga dhigo mid dhab ah oo nagu filan oo naga fogeeya.",
      "Waxaa ka mid ah kuwa lagu tilmaamo biyo karkaraya oo la cabbo, geedka qadhaadhka ah ee zaqqumka ah oo cunto ah, dharka dabka laga gooyay, iyo ka soocidda raaxo kasta oo uu qofku mar ku tiirsan yahay. Rasuulku ﷺ wuxuu soo gudbiyay inta kulaylkaani uu dhaafo wax kasta oo aan ognahay, isagoo sheegay in dabka aan shidno adduunku uu yahay qayb ka mid ah toddobaatan qaybood oo naarta aakhiro ah (Saxiixul Bukhaari 3265).",
      "Tilmaantaasi waa digniino dhab ah, ee maaha tusaaleyaal kaliya oo faaruqinaya aakhiro cawaaqibka. Culimada sunniga ah waxay caddeeyaan xaqiiqadooda iyagoo ka tagaya habka saxda ah ee waxa maqan oo Alle og; Mu'minka hawshiisu waa in uu qalbiga geliyo digniinta, ee ma aha in uu kala saaro.",
      "Waxa jirta aadaabta (adab) in la akhriyo tuducyadan oo kale. Waxaa lagu qaabilaa is-hoosaysiin, Alle ka cabsi, iyo dareen degdeg ah si ay u toobad keenaan oo ay magangal u helaan - ma aha in ay si xun u soo jiitaan, oo weligood rajo la'aan, mar haddii ujeeddada digniintu ay tahay in aan weli haysanno waqti aan kaga fogaano.",
      "Waxaa laga yaabaa in mawduuca ugu cuslaa ee tilmaantan uu yahay qoomamo. 'Hadii aan lahaan lahaa...' ayaa la odhan doonaa marka uu wakhtiga ficilku xidhmo. Naxariista marka la maqlo qoomamadaas hadda waa in aan ku dhaqmi karno 'hadday kaliya' maanta, iyadoo ay weli beddeli karto dhammaadkayaga.",
    ],
    quran: [
      {
        excerpt:
          "Waxaana hortiisa ah Naarta Jahannamo, waxaana laga waraabin Biyo xun. Wuu ceshan doonaa laakiin wuu liqi doonaa.",
      },
      {
        excerpt:
          "Oo iyaga waxaa loo gooyn doonaa dhar dab ah, oo madaxana waxaa lagu shubi doonaa biyo kulayl ah.",
      },
      {
        excerpt:
          "Naarta Jahannamo Maalintaas waa la soo bixin (Qiyaamada) Maalintaas Dadku wuu waasici, maxaase u wanaag ah xusku.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dabkaagu waa qayb ka mid ah todobaatanka qaybood ee naarta Jahannamo. Waxaa la yiri: Rasuulkii Alloow dabkaan waa ku filnaan lahaaye. Wuxuu yidhi: Waxaa la siiyey itaalkeeda sagaal iyo lixdan qaybood, qayb walbana waxay la mid tahay kulaylkeeda.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Yaa Looga digay?",
    summary: "Qaybaha Qur'aanka iyo Sunnada - maaha xukunnada shakhsiyaadka.",
    body: [
      "Qofka si taxadar leh u akhriya Qur'aanka wuxuu u fiirsadaa in digniintiisu ay ku wajahan tahay hab-dhaqanka iyo hab-dhaqanka, ee aanay ahayn kuwo ku wajahan shakhsiyaad magac leh. Waxayna u digtaa kuwa ku adkaysta gaalnimada intay xaqu u caddaatay, munaafiqiinta oo si muuqata iimaanka u qiran iyagoo gaalo ah, daalimiinta ku tumanaysa xaqa dadka kale, kuwa iskibriya ee is-kibrin, iyo kuwa ku dhinta dambi wayn iyagoon toobad keenin.",
      "Tani waxay diiradda saaraysaa qaybaha halkii ay dadku ahaan lahayd mid ula kac ah oo naxariis leh. Qof kasta oo nool albaabkii soo noqodku wuu u furan yahay, wax kasta oo uu hore u soo maray, waayo, ninna faysal ma xidho ilaa dhimashada. Digniintu waxay qeexaysaa waddada, si qof kasta oo weli ku socda uu uga baxo.",
      "Sababtaas awgeed, Islaamku ma ogola in aan ku dhawaaqno aayaha kama dambaysta ah ee qof gaar ah - in la yiraahdo 'qofkani wuxuu ku jiraa naarta' - marka laga reebo xaalado dhif ah oo uu Eebbe ama Rasuulkiisu ﷺ si cad ugu sheegay waxyi dhab ah. Xukunka quluubta iyo aakhirka waxaa iska leh Alle oo keliya; hawsheenu waa xisaabinteena.",
      "Markaa habka saxda ah ee digniin kasta loo akhriyi karo waa in gudaha loo rogo: maaha 'yaa kan ku tilmaamay?' Laakiin 'mid ka mid ah kuwan ma i sifeynayaan, oo maxaan maanta beddeli doonaa?' Qof kasta oo aad tahay, martiqaadka inaad u soo noqoto Alle hadda way furan tahay - berrina cidna looma ballan qaadayo.",
    ],
    quran: [
      {
        excerpt: "Munaafiqiintu waxay ku sugnaan gunta hoose ee Naarta.",
      },
      {
        excerpt:
          "Ruuxii kasbada dambi oo uu ku asturo kuwaasu waa asaxaabta naarta wayna ku waari.",
      },
      {
        excerpt:
          "Ha u malayn in Eebe halmaansan yahay waxay fali daalimiintu. Eebana wuxuu dib u dhigaa maalin ay indhuhu arkaan.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Dambiyada waaweyn",
    summary: "Kabayr - dembiyo waaweyn oo u baahan tawbah daacad ah.",
    body: [
      "Culimadu waxay dembiyada u qaybiyaan laba qaybood, fahamka faraqa u dhexeeyaa waxay keenaysaa culays iyo nafis labadaba. Dambiyada waaweyn (al-kabacir) waa kuwa Alle ama Rasuulkiisa ﷺ ku xiray cawaaqib gaar ah - hanjabaad naarta, lacnad, carada Alle, ama ciqaab go'an - sida shirkiga, dilka, iyo cunista ribada. Dambiyada yaryar (al-saghaa'ir) waa silbashooyinka yaryar ee ka hooseeya heerkaas.",
      "Nafisku waxa uu ku xidhan yahay sida ay labadooduba isu yihiin. Eebe wuxuu ballan qaaday in haddii qofka mu'minka ah uu ka fogaado dembiyada waaweyn, kuwa yar yar waxaa lagu tirtirayaa cibaadada caadiga ah: 'Haddii aad ka fogaato dembiyada waaweyn ee la idinka reebay, waxaan idinka saareynaa dambiyadaada yaryar' (4: 31). Ducada salaada, jumcada jumcada, ramadaanka iyo ramadaanka waxa udhaxeeya waxa udhaxeeya, mar hadii laga fogaanayo dambiyada waaweyn.",
      "Tani waa sababta dembiyada waaweyn ay mudan yihiin in fiiro gaar ah loo yeesho: waa kuwa aan si fudud lagu dhaqin qulqulka cibaadada maalinlaha ah laakiin ku baaqaya towbad keen badheedh ah oo badheedh ah (tawbah). Way ku sii adkaystaan ​​oo aanay dib u noqon, Oo nafta bay khatar geliyaan. laga tagay oo laga toobad keenay, waa la cafiyay.",
      'Waana tan ugu sarraysa dhammaan: marka laga reebo in lagu dhinto shirkiga, dembi kasta - mid weyn ama mid yar - wuxuu ku dhacayaa dambi dhaafka Eebbe hadduu doono. "Ilaahay ma dhaafo la wadaajinta, wuxuuse ka dhaafaa waxa ka yar cidduu doono" (4:48). Mu\'minna waa inuu waligiis soo gebogebeeyaa in dembiyadooda waaweyni ay ka dhigayaan wax naxariis ah.',
      "Mawduuc kasta oo dembi weyn oo cutubkan ku jira wuxuu bixiyaa qeexitaankiisa, caddayntiisa, sababta uu qabriga u yahay, iyo jidka la taaban karo ee toobadkeenka iyo ka fogaanshaha - had iyo jeer waxay ku dhammaanayaan isla albaabkaas furan.",
    ],
    quran: [
      {
        excerpt:
          "Haddaad ka fogaataan dambiyada waaweyn oo laydinka xarrimay waxaan idinka tageynaa dambigiinna yaryar waxaana idin galin meel sharaf leh.",
      },
      {
        excerpt: "Eebana ma dhaafo la wadaajinta, wuxuuse ka dhaafaa waxa ka yar cidduu doono.",
      },
      {
        excerpt:
          "Ee ah kuwa ka fogaada dambiyada waaweyn iyo xumaanta, wax yar mooyee, Eebahaana waa u dambi dhaaf wayn.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dambiyada ugu waaweyn waxaa ka mid ah: la wadaajinta Alle, nafta oo la dilo, waalidka oo la caasiyo, iyo marag been ah.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dambiyada Carrabka",
    summary:
      "Afxumada, beenta, jeesjeeska - dembiyada ay fududahay in la sameeyo oo ay adag tahay in la sameeyo.",
    body: [
      "Carrabku waa yar yahay laakiin cawaaqibkiisu waa ballaadhan yahay; dhowr eray ayuu qofku ku dhisi karaa kalsooni ama sumcad ayuu ku dumin karaa, qalbi qaboojin karaa ama si qoto dheer ayuu u dhaawaci karaa. Waana sababta Qur’aanka iyo Sunnadu ay ugu soo noq-noqdaan dunuubta hadalka, sida: Hilib-ka-sheegga, Af-lagaadada (Buhtan), Sheeko-qaadista (Namimah), Beenta, Jees-jeeska, iyo Dhaarta Beenta ah.",
      "Dib-u-sheegashadu waxay ka dhigan tahay in walaalkaa ama walaashaa laga sheego wax aanay jeclayn, xataa haddii ay run tahay - waayo, haddii ay been tahay, waxay ahaan lahayd dembiga cayda ka sii daran. Quraanku waxa uu siinayaa mid ka mid ah masawirkiisa ugu yaabka badan: waxa uu la mid yahay cunista hilibka walaalkii oo dhintay (49:12). Sida loo qaabeeyey, dembigu waxa uu luminayaa nasiibkiisa.",
      "Waxa dembiyadan ka dhigaya kuwo aad khatar u ah waa sida ay u fudud yihiin oo ay caado u yihiin. Dadku waxay ku dhex simbiriiraan sheeko caadi ah iyagoon fikir labaad gelin, waana sababta uu Nebigu ﷺ ku xidhay iimaanka laftiisa oo ilaalinaya hadalka: 'Qofkii rumeeyey Eebbe iyo maalinta aakhiro haku hadlo wanaag ama ha iska aamuso. Hakin fudud ka hor hadalka waa cibaado dhab ah.",
      "Ka toobadkeenida dembiga carrabka waxay raacdaa shuruudaha caadiga ah - joojinta, qoomamaynta, go'aanso inaadan soo laaban - oo leh cabbir dheeraad ah marka qof kale xaqiisa ku lug yeesho. Meesha sifaynta magacooda ama cafis ladoonto lagu samayn karo iyada oo aan dhibaato kale loo geysan, taasi waa qayb ka mid ah towbada; Meesha ay wargelintooda sii kordhinayso dhaawaca, culimadu waxay ku talinayaan beddelkooda in si wanaagsan looga hadlo, la difaaco markay maqan yihiin, una duceeyaan dambi dhaaf.",
    ],
    quran: [
      {
        excerpt:
          "Midba midka kale ha isku xanto. Midkiin ma jeclaan lahaa inuu cuno hilibka walaalkiis oo dhintay?",
      },
      {
        excerpt: "Waxaa iska hoogay mid kasta oo wax quudhsada.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ruuxii rumeeyey Allaah iyo maalinta aakhiro wanaag ha ku hadlo ama ha iska aamuso.",
      },
    ],
    actions: [
      "Kahor intaadan hadlin, weydii: ma runbaa? Ma loo baahan yahay? Ma naxariisbaa?",
      "Haddii aad qof caado, u duceyso oo cafis weydiiso halka ay suurtagal tahay.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Dembiga laga galay dadka kale",
    summary:
      "Xuquuqda dadku waxay u baahan yihiin dib u celin - ma aha oo kaliya towbad keenka Alle.",
    body: [
      "Islaamku waxa uu u kala qaybiyaa xuquqaha aynu ku leenahay laba nooc oo kala ah: xaqa Alle (Xuquuq Allah) iyo xuquuqda dadka (xuquq al-ibad). Dulmiga (dhulm), cadaalad darada, kalsoonida jabinta, khiyaanada ganacsiga, mushaharka oo laga joojiyo, deymaha aan la bixin, iyo xidhiidhka qoyska oo la gooyo dhamaantood waxay hoos yimaadaan xuquuqda dadka - kuwaasna waxay xambaarsan yihiin khatar gaar ah aakhiro.",
      "Sababta waxa lagu muujiyay xadiis miyir-qab ah. Rasuulku (scw) wuxuu ku tilmaamay qofka dhabta ah ee musaladay inuu yahay mid ku yimaadda maalinta qiyaame salaad, soon, iyo sadaqo- haddana aflagaadeeyay, aflagaadeeyay, xoolo ku qaatay, dhiigna daadiyay. Dadka la dilayna waxa laga bixinayaa wanaaggiisa ilaa ay ka dhammaadaan, dabadeedna dambigoodii la dul saaro oo naarta lagu tuuro (Saxiix Muslim 2581). Qofku cibaadada qani buu ku ahaan karaa oo weli wuu ku kharriban karaa siduu dadka kale ula dhaqmi jiray.",
      "Tani waxay baraysaa cashar muhim ah oo ku saabsan towbad keenka: in Alle loo noqdo waa lama huraan, laakiin marka xuquuqul insaanka lagu xadgudbo, keligeed kuma filna. Sheegashada qofka la dulmiyey way jirtaa ilaa la xaliyo ama laga cafiyo. Haddaba tawbadkeenku halkan waxa uu leeyahay shardi afraad oo ka baxsan joojinta, qoomamaynta, iyo xallinta - soo celinta wixii lagu leeyahay.",
      "Dhaqan ahaan taasi waxay ka dhigan tahay dib u soo celinta wixii la qaatay ama qiimihiisii, bixinta deynta xitaa si tartiib tartiib ah, dib u soo celinta sumcadda mid ka mid ah waxyeelada, iyo in la heshiiyo qaraabada mid ka gooyay. Taasna waxaa ku jirta naxariis: Talaabo kasta oo dib-u-celin ah lafteedu waa camal wanaagsan, Eebbana wuu u fududeeyaa qalbi daacad ah oo u taagan inuu hagaajiyo wixii jabay.",
    ],
    quran: [
      {
        excerpt: "Haddaydaan ka tegin ribada ka digtoonaada dagaal Eebbe iyo Rasuulkiisa.",
      },
      {
        excerpt: "Ee ah kuwa buriya ballanka Eebbe oo gooyay wuxuu faray.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ma garanaysaa cidda musalaftay? Ruuxii la yimaadda salaad iyo soon, iyo sadaqo, laakiin caytamay, oo caytamay, oo xoolo xaaraan ah ku cunay, oo dhiig daadiyey, oo camalkiisii ​​wanaagsanaa cid kale loo dhiibay.",
      },
    ],
    actions: [
      "Liis garee qof kasta oo aad dulmiday oo qaado tillaabo hagaajinta usbuucan.",
      "Bixi deymaha kugu maqan xitaa qaybo yaryar haddii ay taasi tahay waxa kaliya ee aad maareyn karto.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Munaafaqnimo",
    summary: "Munaafaqnimada weyn ee caqiidada - iyo sifooyinka munaafaqnimada ee hab-dhaqanka.",
    body: [
      'Culimadu waxay kala saaraan laba nooc oo munaafaqnimo ah, kala fogaanshahoodana waxay ka hortagtaa raaxada beenta ah iyo argagaxa beenta ah labadaba. Midda koowaad waa munaafaqnimada weyn ee caqiidada (nifaq ictiqaadi): in la muujiyo Islaamka bannaanka iyada oo gudaha laga diidayo iimaanka. Tani waa munaafaqnimada uu Qur\'aanku uga digay sida ugu daran, isagoo dadka noocaas ah geliyey "Naarta gunteeda hoose" (4:145), maxaa yeelay waxay ku dhinteen iyagoo gaalo ah indho-shareer gadaashiisa.',
      "Midda labaad waa ka yar, munaafaqnimada dabeecadda (nifaaq 'amali): sifooyin u eg hab-dhaqanka munaafiqiinta xitaa qofka iimaankiisu run yahay. Rasuulku ﷺ wuxuu u magacaabay calaamooyinka caanka ah - 'marka uu hadlo wuu been sheegaa, markuu ballan qaado wuu buriya, marka la aaminona wuu khiyaameeyaa' - iyo qiso kale waxay ku dartay xumaan muran. Mu'minku wuu ku dhici karaa kuwan oo weli wuu ahaan karaa rumaystayaal, laakiin waa digniin culus oo laga digtoonaado.",
      "Kala soocidaani aad bay muhiim ugu tahay sida aan u isticmaalno mowduuca. Calaamadaha hab-dhaqanka waxa loo bixiyaa muraayad ahaan, ee looma bixiyo calaamad lagu dhejiyo dadka kale. Nabiga ﷺ iyo asxaabtiisu waxay naftooda uga baqeen munaafaqnimada, sababtoo ah qalbigu wuu qarsoon yahay oo wuu isbedeli karaa.",
      "Markaa jawaabta caafimaadka qabtaa waa gudaha: in la iska hubiyo daacadnimadiisa, daacadnimada ballanka iyo aaminaadda, iyo in Eebbe la waydiiyo daacadnimo (ikhlaas). Allaah kaliya ayaa og waxa qofka ku jira, in dad gaar ah lagu eedeeyo munaafaqnimada lafteedu waa gef weyn oo iyaga laga galay.",
    ],
    quran: [
      {
        excerpt: "Munaafiqiintu waxay ku sugnaan gunta hoose ee Naarta.",
      },
      {
        excerpt:
          "Markay kuu yimaadaan munaafiqiintu waxay ku dhahaan waxaan marag ka nahay inaad tahay Rasuul Eebe, Eebbana waa ogyahay inay beenaalayaal yihiin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Calaamooyinka munaafiqiintu waa saddex: markuu hadlo been buu sheegaa, markuu ballanta waa ka baxaa, markii loo wakiishayna wuu khiyaameeyaa.",
      },
    ],
    disclaimer:
      "Ha ku eedayn shakhsiyaad nifaq ah. Qoraaladu waxay uga digayaan bulshada; daahirintu waxay ka bilaabataa nafta.",
  },
  {
    title: "Ciqaabta Lagu Xusay",
    summary: "Waxa ay qoraalladu sifeeyeen - ku akhri cabsida Alle iyo rajada naxariistiisa.",
    body: [
      "Qur’aanka iyo Sunnadu waxay magacaabeen cidhib gaar ah gafafka gaarka ah – kuwa cuna ribada, ee xanta haweenka dhawrsoon, oo xoolahooda kaydsada, xaqana ka taga, oo salaadda dayaca, ee ku adkaysta dembiga waaweyn. Gaar ahaan waa nooc ka mid ah caddaynta: waxay ka tagaysaa qofna ma awoodo inuu sheego inaan looga digayn waxa ay samaynayaan.",
      "Qaar ka mid ah cawaaqib xumadaas waxaa lagu tilmaamay qabriga (adhab al-qabr) iyo kuwo kale oo ku sugan Jahannam laftiisa. Caqiidada guud ee Sunniga ahi waxay xaqiijinaysaa xaqiiqada labadaba, iyadoo la aaminay 'sida' arrimahan aan la arki karin ee saxda ah ee Ilaah aqoontiisa halkii ay ka ahaan lahayd male aadanaha.",
      "Sida mu'minku waxaas oo dhan ula falgala waa waxa muhiimka ah. Ujeeddadu maaha in aan waligeed ku dul istaagin tafaasiisha garaafka ama in wadnuhu dego; waa in la helo digniinta, lagana toobad keeno wax kasta oo khuseeya, ka dibna u rogto tamarta xagga camalka dhabta ah ee ilaalinaya. Taasi waa sababta cutubkani uu si ula kac ah u siinayo meel ka badan ilaalinta, towbada, iyo naxariista halkii ciqaabta.",
      "Marka la soo koobo, ka qaadista saxda ah ee ciqaab kasta oo lagu sheego waa su'aal, maaha cabsi: 'Miyaan samaynayaa tan - iyo haddii ay sidaas tahay, sidee baan u joojinayaa oo u saxayaa?' Maanta si daacad ah ayaa looga jawaabay, digniintu waxay hore u qabatay hawsheeda naxariista leh.",
    ],
    quran: [
      {
        excerpt:
          "Kuwa ku dacwooda haweenka dhawrsoon oon afar marag u furin garaac siddeetan karbaash.",
      },
      {
        excerpt:
          "Kuwa kaydsada dahabka iyo fiddada oon ku bixinin dar Eebe ugu bishaaree cadaab daran.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ka ilaalinta Naarta",
    summary: "Tawxiid, Salaadda, tawbah, samafal, Qur'aan, iyo duca - qalbiga cutubkan.",
    body: [
      "Digniin dhan ka dib, tani waa udub dhexaadka arrinka: Jahannama waa shay la doonayo in qofka laga ilaaliyo, Islaamkuna uu ka buuxo siyaabaha loo ilaalin karo. Waxaa u wayn tawxiid suuban, oo la caabudo Eebe kaligii, wax ka soo hadhayna ma jiro. Camal kasta oo kale waa la aqbalayaa oo lagu miisaamaa aasaaskan oo keliya, waana sababta ilaalinta caqiidada uu wax kasta ka horraysiiyo.",
      "Aasaaskaas, gaashaanka wax-ku-oolka ah waa badan yihiin oo waa la gaari karaa: oogidda shanta salaadood, towbad keenka dhabta ah, bixinta sadaqada - kuwaas oo Nebigu ﷺ yiri waxay damiyaan dembiga sida biyuhu u damiyaan dabka - soonka, akhrinta Qur'aanka iyo ku camal falidda, akhlaaqda wanaagsan, naxariista dadka kale, xuska joogtada ah (dhikr), iyo cafiska joogtada ah. Kuwaas midkoodna uma baahna maal badan ama aqoon; qof walba way u furan yihiin.",
      "Sidoo kale Rasuulku ﷺ wuxuu baray ducooyinka tooska ah ee laga magan galo naarta, wuxuuna nagu dhiirigaliyay inaan badino. Wuxuu yidhi ruuxii Eebe Jannada waydiista saddex jeer, Jannada lafteedu way ku ducaynaysaa, ruuxii naarta ka magan galana saddex jeer naarta lafteedu waxay u baryaysaa inuu ka badbaado (Jaamic At-Tirmidhi 2572). Ducadaasi waxay leeyihiin meel u gaar ah salaamka ka hor salaadda iyo casarka subax iyo maqrib.",
      "U fiirso dheelitirka shareecada ayaa ku dhufatay. Habka ilaalinta ayaa aad u badan, xooga la saaray, lagana gaari karo marka loo eego sababaha burburka - tani lafteedu waa calaamad muujinaysa naxariista Eebe. In la badbaadsho aad bay uga fududahay in la lumiyo.",
      "Qaybtani si badheedh ah ayaa ah tan ugu weyn ee cutubka, sababtoo ah waa sida Islaamku laftiisa u miisaamayo arrinta: digniinta had iyo jeer waxay ku lamaanan tahay rajo, oo aan marnaba laga soocin ficil la taaban karo oo qofku maanta bilaabi karo.",
    ],
    quran: [
      {
        excerpt:
          "Kuwa Yidhi Eebow waan Rumaynay ee noo Dhaaf Dambiganaga Naga Dhawr Cadaabka Naarta.",
      },
      {
        excerpt: "Eebow na sii adduunyo wanaag, aakhirona wanaag, naga ilaali cadaabka naarta.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qofkii saddex jeer Alle weydiista Jannada Jannada wuxuu ku leeyahay: Alloow Jannada geli. Qofkii saddex jeer naarta ka magan gala, naarta waxay tiraahdaa: Alloow naarta ka ilaali.",
      },
    ],
    actions: [
      "Xafid ducada ka magangalka Jahannamada ka hor salaada salaada.",
      "Ku tukada shanta salaadood wakhtigeeda - oo ka mid ah gaashaanka ugu xoogga badan.",
      "Si joogto ah u bixi sadaqo, xataa xaddi yar.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Towbada (Tawbah)",
    summary:
      "Eebbana wuu aqbalaa towbad keenka dhabta ah - ma jiro dembi aad u weyn dhimashada ka hor.",
    body: [
      "Tawbah — towbaddu — waa habka Alle u dhisay diinta si aan dembi loogu baahnayn inuu waaro. Waxa udub dhexaad u ah in qalbigu u soo noqdo xagga Alle, culimaduna waxa ay shuruudihiisa ka soo qaateen Qur’aanka iyo Sunnada: si daacad ah u jooji dembiga, ka shallayn dhab ah, una go’aansadaan in aanay dib u soo noqon. Marka dembigu ku lug yeesho xuquuq qof kale, shuruud afraad ayaa lagu daraa - soo celinta xuquuqdaas ama raadinta cafiskooda.",
      "Waxa tawbah ka dhigaya mid rajo leh waa sida Alle u aqbalo. Kaliya uma dulqaadan addoonka soo noqday; Wuu farxay. Nebigu (scw) waxa uu yidhi ILAAHAY ayaa uga farxad badan towbada addoonkiisa nin markuu ku waayay sahaydiisii ​​oo dhan meel saxare ah oo uu ka rajo dhigay, si lama filaan ah u arkay isagoo hortiisa taagan (Saxiixul Bukhaari 6309). Taasi waa soo dhawaynta sugaysa qof kasta oo soo noqda.",
      "Albaabkiisa, weliba, marna ma xidhmo inta uu nool yahay. Nebigu (scw) wuxuu yidhi Eebe wuxuu u fidiyaa gacantiisa habeenkii si uu u aqbalo towbada dambiilaha maalinta, wuxuuna u fidiyaa gacantiisa maalintii si uu u aqbalo towbada dambiilaha habeenka (Saxiix Muslim 2759). Tawbada waa la aqbalayaa qofka ilaa naftu gaadho dhuunta markay dhimato, iyo bini-aadmiga ilaa qorraxdu ka soo baxdo galbeedka - markaa ma jirto sabab dib loogu dhigo.",
      "Tani waa run xataa kii dhacay oo marar badan toobad keenay. Inta soo laabashadu run tahay mar kasta, Eebbe wuu aqbalayaa; Quustu waxay ka timi shaydaan ee maaha mid diinta ka timid. Waxa kaliya ee ay tahay in la xaliyo geerida ka hor waa shirki, mar haddii qofka ku dhinta uu dhinto isagoon haysan iimaanka ay tawbaddu u baahan tahay - waana sababta dhabta ah ee u noqosho buuxda oo Alle kaliya ah soo noqoshada degdega ah ee dhammaan.",
      "Qaadashada la taaban karo waa mid fudud: hadda toobad keen, badi toobad keen, oo weligaa ha u oggolaan in cabbirka dembigu, ama tiradii hore ay dhacdo, ay kugula doodaan soo noqoshada. Martiqaadku had iyo jeer waa furan yahay.",
    ],
    quran: [
      {
        excerpt:
          "Naxariista Eebe ha ka quusanina. Illeen Eebbe wuu dhaafaa dambiyada oo dhan. Eebana waa dambi dhaafe Naxariista.",
      },
      {
        excerpt:
          "Kuwa Toobadkeena oo Rumeeya oo Camal Fiican Falay Mooyee Eebe wuxuu ku badali Xumaantooda Wanaag.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Alle ayaa uga raalli noqday towbada addoonkiisa midkiin midkiin ku hela buurtiisa dhuntay isagoo jooga dhul abaar ah.",
      },
      {
        excerpt:
          "Eebbe wuxuu u fidiyaa gacantiisa habeenkii si uu u towbad keeno dembiilaha maalinta, wuxuuna u fidiyaa gacantiisa maalintii si uu u aqbalo dembiilaha habeenka, ilaa ay qorraxdu ka soo baxdo galbeedkeeda.",
      },
    ],
    actions: [
      "U sheeg Astaghfirullah maalintii oo dhan - ujeedo joogteynta, ma aha oo kaliya ka dib silbashooyinka waaweyn.",
      "Baro sayid al-istigfar oo akhri subax iyo galabba.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Naxariista Eebe ka rajeeyo",
    summary:
      "Weligaa ha niyad jabin - camalka wanaagsan wuxuu tirtiraa dembiyada; arrimaha joogtada ah.",
    body: [
      "Wax kasta oo ku jira cutubkan ayaa tilmaamaya halkan. Eebe waa ar-Raxmaan Ar-Raxiim- Naxariista - wuxuuna noo sheegay in naxariistiisa ay ka weyn tahay cadhadiisa oo 'wax walba koobto' (7:156). Mu'minka waxaa loola jeedaa inuu u dhex noolaado rajo iyo cabsi, sida labada baal ee shimbirta: isagoo ka baqaya dembiga oo ku filan inuu feejignaado, rajo ku filan oo cafis ah oo aan waligiis quusan.",
      "Sababtaas awgeed, rajo-xumada lafteeda ayaa meesha ka baxday. Si kasta oo uu qofku u dareemayo in ay dhumiyeen, albaabka dibu waa furan yahay, waana Shaydaan - ma aha Allaah - kan ku xantaan in ay goori goor tahay. Naxariista oo laga quusto waa inaad wax yar ka fikirto Eebaha Raxmaan ah; Qalbiga daacadda ah shaqadiisu waa inuu si fudud u soo noqdo.",
      "Halkan waxaa ku yaal raaxada weyn ee sunniga caqiidada ee ku saabsan Naarta. Kuwii ku dhinta gaalnimo, Jahannama waxay u tahay hoy waaraa. Laakiin qofka mu’minka ah ee dhinta isaga oo Allaah kaliya ku sugan, xitaa haddii ay ku cuslaato dembiyada waaweyn, kuma waari doono weligiis. Rasuulku ﷺ wuxuu baray in dadka naarta looga soo bixin doono shafeeco ka dibna naxariista Eebbe lagu tuuri doono webiga nolosha ee jannada cidhifkeeda ku yaal, halkaas oo la soo celin doono oo la geli doono (Saxiix al-Bukhaari 7439). Wuxuu yidhi naarta kuma hadhi doono oo xataa iniin khardal ah oo miisaankeedu qalbiga kaga jiro (Saxiix Muslim 183). Tawxiidka, sidaas darteed, naarta - haddii la wada galo - weligeed ma dhammaan sheekadu.",
      "Dhanka kale, naxariistu waxay ku dhisan tahay nolol maalmeedka: camalka wanaagsan wuxuu tirtiraa kuwa xun (11:114), iyo cibaadada yar ee joogtada ah - hal duco oo waqtigeeda lagu tukado, hal samafal oo xasiloon, hal daqiiqo oo samir Alle dartiis ah - waxay si joogto ah u soo jiidataa qofka isaga u dhow oo ka sii fogaanaya waxyeellada. Joogteynta ayaa ka muhiimsan xoojinta.",
      "Markaa sidaan ha ahaato gunaanadka daraasaddaada: digniinta si dhab ah u qaado, laakiin rajadu ha ka dheeraato cabsida. Ogow khatarta, dooro jidka naxariista, oo ku soco - tallaabo hal mar - maalin kasta ilaa aad la kulanto Alle.",
    ],
    quran: [
      {
        excerpt: "Naxariistaydu wax walba way koobtay.",
      },
      {
        excerpt:
          "Waxaad dhahdaa: Addoomadayda ku xad gudbay Naftooda, ha ka quusanina naxariista Eebe. Illeen Eebbe wuu dhaafaa dambiyada oo dhan.",
      },
      {
        excerpt:
          "Runtii camalka wanaagsani wuxuu fogeeyaa xumaanta. Kaasina waa waanada kuwa wax xusuusan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Eebe wuxuu yidhi: Malaa'igtu way shafeecday, Nabiyadiina way shafeeceen, Mu'miniintana way shafeeceen, mana hadhin Eebaha Naxariista Naxariista mooyee. Wuxuu ka qaadi wax yar naarta, wuxuuna ka soo bixin dad aan wanaag falin.",
      },
      {
        excerpt:
          "Qofkii qalbigiisa rumaysad ku leh iniin khardal le'eg ayaa naarta laga soo saarayaa.",
      },
    ],
    actions: [
      "Ku dhammee maalin kasta istighfar iyo mahadnaq duco kasta.",
      "Ku lammaan cutubkan iyo Safarka Jannada - digniin iyo rajo wadajir ah.",
    ],
    appLinks: [{}, {}, {}],
  },
];

export const JAHANNAM_MAJOR_SIN_TOPICS_SO: DeepPartial<JahannamTopic>[] = [
  {
    title: "Shirki",
    summary: "La wadaajinta Eebe - midda dembi dhaafe haduu ku dhinto.",
    body: [
      "Qeexid: Shirkigu waa in lala wadaajiyo Eebbe – in lagu toosiyo fal kasta oo isaga keligiis iska leh (cibaadada, jacaylka kama dambaysta ah, cabsida, rajada, tala-saarista, ama xaqa sharci) shay ama cid aan isaga ahayn. Waa lidka saxda ah ee tawxiidka, waxayna ku dhufatay ujeeddada uu abuurku u leeyahay oo ah in Alle keligii la caabudo.",
      "Waa maxay sababta ay ugu weyn tahay dembiyada oo dhan: dembi kasta oo kale waa qalad la sameeyey iyada oo la aqoonsanayo Rabbiga runta ah, laakiin shirkigu waa qalad isaga si toos ah loogu sameeyey - khalday abuurista ee abuuraha. Waana sababta uu Qur'aanku ugu yeedhay 'Dambi weyn' (31:13). Waa kan dembiga, haddii uu qof ku dhinto korkiisa isagoon toobad keenin, aan la dhaafin: 'Ilaahay ma dhaafo la wadaajinta, laakiin wuxuu u dhaafaa waxa ka yar kan uu doono' (4:48). Naxariista dahsoon xitaa marka ay sidaa u daran tahay ayaa ah in wax kasta oo shirkiga gaabnaa ay ku hoos jiraan dambi dhaafka Alle.",
      "Qaababkeeda: culimadu waxay kala saaraan shirkiga weyn - caabudida sanamyada, kuwii dhintay, awliyo, ama waxyaalaha la abuuray; baryidda Eebe ka sokow wuxuu siin kara; iyo u hoggaansanaanta allabari ama nidar aan isaga ahayn - taasoo qofka ka saarta meel ka baxsan Islaamka haddii aan laga toobad keenin. Waxaa kaloo jira shirki ka yar oo qarsoon, sida istuska cibaadada (riyaad), ku dhaarashada Eebe ka sokow, ama ku talaxtagga sifaadka iyo sharka, taas oo ah dembi culus balse aan nafteeda diinta ka saarin.",
      "Waddada laga fogaanayo: Ilaali oo ku xooji tawxiidka adigoo baranaya, caabuda Allaah oo kaliya, niyaddana la daahirinayo si camalku isaga u ahaado ee uusan dadka indhaha ugu hayn. Qofkii ku dhacay shirkigu wuxuu u towbad keenaa isagoo si dhab ah uga tanaasulay oo u soo noqday cibaadada Alle kaligii - albaabkaa soo laabashaduna wuu furan yahay inta uu noolyahay.",
    ],
    quran: [
      {
        excerpt: "Eebana ma dhaafo la wadaajinta, wuxuuse ka dhaafaa waxa ka yar cidduu doono.",
      },
      {
        excerpt: "Wiilkaygiiyow, ha la wadaajinin Eebbe waxba. Illeen ururku waa gaf weyn.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dambiyada ugu waaweyn waxaa ka mid ah: la wadaajinta Alle, nafta oo la dilo, waalidka oo la caasiyo, iyo marag been ah.",
      },
    ],
    actions: [
      "Baro tawxiidka Baro Aqidah iyo 99ka Magac ee Allaah.",
      "Nadiifi niyada cibaadada - Allaah ka bari daacad maalin kasta.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dilka",
    summary:
      "Ku-qaadista nolol aan waxba galabsan si sharci-darro ah - oo ka mid ah xadgudubyada ugu daran.",
    body: [
      "Qeexid: Dilka halkan waxa uu ka dhigan yahay in si badheedh ah oo aan sharci ahayn loo qaatay nolosha uu Alle ka dhigay muqadas. Islaamku wuxuu aqoonsan yahay kiisaska sharciga ah - sida qisas xalaal ah (ciqaab sharci ah) oo ay fulisay hay'ad habboon - laakiin dilka nafta aan waxba galabsan si ka baxsan sabab xaq ah ayaa ka mid ah dembiyada aadka ugu waaweyn.",
      "Waa maxay sababta ay qabriga u tahay: Qur’aanku waxa uu ku miisaamay hal dil oo xaq-darro ah oo uu ku miisaamay miisaanka bani-aadmiga oo dhan: 'Qofkii nafta dila... waxa uu la mid yahay in uu dilay aadanaha oo dhan' (5:32), waayo in hal naf la burburiyo waa in la jebiyo xurmada ilaalinaysa nolol kasta. Dilku waxa uu ahaa dembigii ugu horreeyey ee ay galeen ilma Aadan, waxyiguna waxa uu ku soo noqnoqday isagoo ah mid aakhiro baabi’iya.",
      "Dulmi laba jibaaran ah: dilku mar keliya waa dembi Alle laga galay, oo xaqa uu ku leeyahay xurmada nolosha lagu tuntay, dembina laga galay dadka - dhibanaha iyo kuwa ay ka tageen. Waana sababta towbad keenkeedu uga culus yahay inta badan: in Alle loo noqdo waa lama huraan, laakiin xaqqa qofka la dulmiyey ayaa sidoo kale taagan, oo meesha sharciga dalka ama shareecada Islaamku uu qeexayo lacagta dhiiga (diyah) ama cawaaqibka kale, kuwaas waa in loo maro dariiq sax ah iyo culimo tayo leh.",
      "Dariiqa laga fogaanayo: nolol kasta ka dhig mid muqadas ah, iska ilaali cadhada iyo cadhada intaanay adkayn, khilaafyadana ku xalliya samir iyo cadaalad halkii ay ka ahaan lahayd colaad. Xataa tan ugu weyn ee dambiyada laga galay dadka ma dhaafsana naxariista Alle ruuxii si dhab ah u towbad keena, ka soo baxa xuquqaha ay khusayso intii suurtagal ah, oo aan dib ugu soo laaban wadadaas.",
    ],
    quran: [
      {
        excerpt:
          "Ruuxii u dila naf naf mooyee ama dhulka fasaad, wuxuu la mid yahay inuu laayay dadka oo dhan.",
      },
      {
        excerpt:
          "Ruuxii u dila mu‘min kas ah, abaalkiisuna waa Jahannamo wuuna ku waari dhexdeeda.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dambiyada ugu waaweyn waxaa ka mid ah: la wadaajinta Alle, nafta oo la dilo, waalidka oo la caasiyo, iyo marag been ah.",
      },
    ],
    actions: ["Qiime nolol kasta; xalinta khilaafaadka samir iyo cadaalad."],
    appLinks: [{}],
  },
  {
    title: "Zina",
    summary:
      "Xiriirka galmoodka ee aan sharciga ahayn - dembi baabi'in ah oo ka dhan ah nafta iyo bulshada.",
    body: [
      "Qeexid: Zina waa xiriir kasta oo galmo sharci darro ah oo ka baxsan guurka saxda ah, oo daboolaya sinada (inta u dhaxaysa kuwa aan la qabin) iyo sinada (ku lug leeyihiin qof guursaday). Islaamku uma arko arrin gaar ah ee wuxuu ula dhaqmayaa sidii xad-gudub iyo waxyeello ballaaran.",
      "Maxay qabri u tahay: Zina waxa ay burburisaa waxyaalaha bulsho caafimaad qabtaa ku dhisan tahay - nasabka, kalsoonida lammaanaha dhexdooda, badbaadada carruurta, iyo dhawrsanaanta qofka sharafta leh. Erayada Qur'aanka laftiisa ayaa ah mid wax lagu baro: kaliya ma mamnuucayo falka laakiin wuxuu leeyahay 'xataa ha u dhowaanina' (17:32), isagoo ka digaya jaleecada, sirta, iyo tillaabooyinka u horseedaya xaggiisa. Mamnuucida habkaas ayaa ah naxariis, sababtoo ah waxay ilaalisaa qofka ka hor inta aysan fiicneyn.",
      "Xikmadda ku jirta caqabadaha: halkii ay ka tagi lahayd dadka inay la dagaallamaan rabitaanka halka ugu sarreysa, Islaamku wuxuu ku hareeraysan yahay ilaalin hore - hoos u dhigista aragtida, xishoodka labiska iyo dhaqanka, ka fogaanshaha gooni-u-goosashada jinsiga ka soo horjeeda, iyo dhiirigelinta guurka oo ah marinka sharciga ah, sharafta leh ee baahiyahaas. Horay u dhisidda xuduudahan aad ayay uga sahlan tahay iska caabinta cidhifka.",
      "Waddada dib u noqoshada: qof kasta oo dhacay, dariiqa uu ka bixi karo waa tawbah daacad ah - ka tagista dembiga oo dhan, ka qoomamaynta, xallinta weligeed ah, iyo daboolida halkii uu qofku sheegi lahaa wixii hore. Zina waa dembi weyn, laakiin si cad waxay ka mid tahay kuwa Eebbe u dambi dhaafo qofkii u noqda; Niyad-xumadu meel ma laha, mar walbana bilow cusub ayaa diyaar ah.",
    ],
    quran: [
      {
        excerpt: "Ha u dhowaan galmo aan sharci ahayn. Illeen waa akhlaaq xumo iyo jid xun.",
      },
      {
        excerpt:
          "Kuwaan falin galmo xaaraan ah... ruuxii toobad keena oo rumeeya oo camal fiican fala mooyee, Eebe wuu ku badali xumaantooda oo wanagsan.",
      },
    ],
    actions: [
      "Ilaali indhaha iyo isticmaalka baraha bulshada.",
      "Duco u samee xaaska xaqa ah haddaan la qabin.",
    ],
    appLinks: [{}],
  },
  {
    title: "Riba",
    summary: "Ribada iyo ribada- dagaal lagu sheegay Qur'aanka dhexdiisa.",
    body: [
      "Qeexid: Ribadu waa kororka sharci darrada ah ee ganacsiyada maaliyadeed qaarkood - inta badana loo yaqaan ribada lagu dalaco ama lagu bixiyo deymaha, laakiin sidoo kale waxaa ku jira beddelaad aan sinnaan ama dib loo dhigay oo badeecado la mid ah. Nuxurkeedu waa in la helo hanti aan qiimo dhab ah lahayn ama khatar la'aan, qof kale kharashkiisa.",
      "Waa maxay sababta ay si gaar ah u qabri tahay: ribadu waxay ka mid tahay dembiyada maaliyadeed ee luqadda Qur'aanku u isticmaalo. Eebe wuxuu ku dhawaaqay dagaal isaga iyo Rasuulkiisa ﷺ ah kuwa ku adkaysta (2:279) - weedha loo isticmaalo dembi kale - sababtoo ah ribadu waxay ka faa'iidaysanaysaa baahida, waxay xoogga saartaa maal gacmahooda qaar yar, waxayna gooysaa naxariista dhaqaalaha loogu talagalay inuu qaado. Nebigu ﷺ wuxuu aad uga digay in wax looga qabto si kasta oo ay tahay.",
      "Xikmadda iyo naxariista: mamnuuciddu waxay dadka u jihaysaa ganacsiga dhabta ah, khatarta la wadaago, iyo samafalka, waxayna ka ilaalisaa kuwa nugul in lagu burburiyo deynta. Xataa halkan, in kastoo, naxariista Eebbe ay joogto: markii amarku yimid, ma uusan dalbanin in dulsaarkii hore ee hore loo qaatay dib loo celiyo, laakiin wuxuu u sheegay rumaystayaasha inay iska dhaafaan waxa hadhay - 'waxaad yeelan doontaan maamulahaaga' (2: 279) - fudayd kuwa ka leexanaya.",
      "Dariiqa laga fogaanayo: xisaabi dhaqaalihiina wax soo saarka ribada ku salaysan, raadso xalal xalaal ah, la tasho culumo aqoon u leh kiisas dhab ah oo aad u adag sida dayn lagu haysto dhulalka aan muslimka ahayn. Ka tagista ribadu waxay la macno tahay doorashooyin dhaqaale oo adag, laakiin badbaadada nafta ayaa ka miisaan badan faa'iido kasta oo ku meel gaar ah - wuxuuna Eebe u ballan qaaday inuu ku arzuqi doono qofka isaga ka cabsada meel uusan filaynin.",
    ],
    quran: [
      {
        excerpt:
          "Kuwa xaqa rumeeyow ka dhawrsada Eebbe, kana taga waxa ka hadhay ribada, haddaad tihiin kuwa rumeeyey. Haddaydaan yeelin, ka warrama dagaal Eebbe iyo Rasuulkiisa ka yimid. Laakiin haddaad toobad keento, waxaa laga yaabaa inaad hesho maamulahaaga - ma xumaan doontid, lagumana dulmiyo.",
      },
      {
        excerpt: "Eebbaa halaagay ribada, sadaqadana wuu kordhiyaa.",
      },
    ],
    actions: [
      "Xisaabi dhaqaalaha alaabta ku salaysan ribada.",
      "La tasho aqoonyahan u qalma amaahaha iyo deynta.",
    ],
    appLinks: [{}],
  },
  {
    title: "Marqaati Been Abuur",
    summary: "Dhaar been lagu sheego ama marag been ah la sheego - waxay burburisaa caddaaladda.",
    body: [
      "Qeexid: Marqaatiga beenta ah (shahaadat al-zur) waa marag madoonto ah wax aan run ahayn - iyo si ka sii ballaadhan, been lagu dhaarto, been abuurasho, ama la joojiyo maragfurka runta ah marka ay caddaaladdu ku tiirsan tahay.",
      "Bal maxaa u qabriga u ah, oo waxay kharribtaa qalabka caddaaladda lagu sameeyo. Markhaatigii beenta ahu wuxuu u diri karaa qof aan waxba galabsan inuu dumiyo, oo uu ka xayuubiyo hantidiisa, ama uu xoreeyo mid dulmiya - sidaas darteed beentu weligeed kama jiri doonto beenaalaha; waxay dhaawacday dadka dhabta ah iyo dhammaan nidaamka caddaaladda. Rasuulku ﷺ wuxuu ku tiriyay dambiyada waaweyn ee ugu waaweyn, hal qiso ayuuna aad ugu adkaystay inuu ku celceliyo digniinta arrintaas ka dhanka ah oo ay saxaabadu damceen inuu joojiyo, iyagoo daneynaya.",
      "Waxay ku xidhan tahay carrabka: maragga beenta ahu waa cidhifka dembiyada waaweyn ee hadalka. Maxaa yeelay, erayadu waa raqiis in lagu dhawaaqo, dembigani aad bay u fududahay in lagu dhaco - saxiix, buunbuunin, aamusnaan ku habboon - haddana miisaankiisa maalinta qiyaame waa mid aad u weyn, marka xubnaha iyo carrabka dadku ay si dhab ah ugu markhaati furaan iyaga.",
      "Dariiqa laga fogaanayo: in runta la qabto xataa marka ay qaali tahay ama ka hor imanayso danta gaarka ah, diido in aad erey bixiso been kasta, ku hadasho marag xaq ah marka loo baahdo. Qofkii marag been ah ku marag furay wuxuu ka toobad keenaa isagoo beentii ka noqday meeshii ay u suurtowdo, isagoo ku dadaalaya sidii uu xumaanta uga bixi lahaa, una soo celin lahaa xaquuqda qof kasta oo la dulmiyay, Allaahna u noqonayo isagoo qoomamo dhaba.",
    ],
    quran: [
      {
        excerpt:
          "Kuwaan ku marag furin been oo markay xumaan u dhawaadaan way maraan iyagoo sharaf leh.",
      },
      {
        excerpt: "Haddaba ka fogaada xumaanta sanamyada, kana fogow xumaanta.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Miyaanan idiinka warramin waxa ugu wayn dambiyada. Eebe oo lala wadaajiyo, waalidka la caasiyo -iyo marag been ah, iyo marag been ah.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "sixir",
    summary: "Sixirka, raadinta saaxiriinta, iyo dhaqamada sixirka - kufr qaabab waaweyn.",
    body: [
      "Qeexid: Sihr (sixir ama sixir) waa isticmaalka habab mamnuuc ah - oo inta badan ku lug leh ku tiirsanaanta shayaadiinta ama sheegashada awoodda wax aan la arkin - si ay u saameeyaan dadka ama dhacdooyinka. Ku celcelinta, barashadeeda, ka doonista dadka kale, iyo rumaynta kuwa sheeganaya dhammaan waxay ku hoos jiraan dembigan.",
      "Maxaa qabri u ah: in badan oo sihr ah lama samayn karo haddii aanay jirin falal gaalnimo ah, sida in loo dhawaado ama la dulleeyo Qur’aanka, waana sababta uu Qur’aanku aqoontiisa ugu xidhay kufriga. Isagoo ka hadlaya sixirkii la bartay waagii Sulaymaan, Alle wuxuu yidhi shaydaanka iyo labadaas malag waxay bareen tijaabo ahaan, iyagoo uga digaya 'ha gaaloobin' (2:102). Marka laga soo tago khatarta caqiidada, sihr waxay waxyeelo u geysataa dadka dhabta ah - beeridda kala qaybinta lamaanaha, faafinta cabsida, iyo ka faa'iidaysiga kuwa quusta ah.",
      "Dhaqannada la xidhiidha: isla digniinta la mid ah waxay ku fidsan tahay faaliga, in xiddigiska loola dhaqmo sida aqoonta waxyaalahan la arki karo, iyo maadada iyo soo jiidashada shirkiga. Sheegashada aqoonta mustaqbalka daahsoon waxaa iska leh Allaah oo keliya, una soo jeesta kuwa sheeganaya waxay wiiqaysaa xididkeeda.",
      "Dariiqa laga fogaanayo: Qofka ku dhex milmay dhaqamadaas, tawbaddu waxay ka dhigan tahay in gebi ahaanba laga tagayo, la baabi'iyo shay kasta oo xaaraan ah, oo la gooyo xidhiidhka dadka la macaamilaya, iyo dib u cusboonaysiinta tawxiidka dhabta ah iyo talo-saarashada Eebbe oo keliya. Ilaalinta waxay ku jirtaa iimaanka, adkaarka maalinlaha ah, iyo ka magangalka Eebbe, dambi-dhaafkiisuna wuxuu u furan yahay ciddii si dhab ah u soo noqota.",
    ],
    quran: [
      {
        excerpt:
          "Waxay raaceen wixii shayaadiintu akhrin jireen dawladii Sulaymaan...waxayna barteen waxa dhibaya oo aan waxba u tarayn.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ruuxii u yimaadda faaliyaha oo rumeeya wuxuu yidhi wuu ka gaaloobay wixii lagu soo dejiyey Muxammad.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Isticmaalka Xoolaha Agoonta",
    summary: "Qaadashada ama ku luminta hantida agoonta si xaq darro ah.",
    body: [
      "Qeexid: Dembigu waa qaadashada, luminta, ama si xun u isticmaalka hantida agoonta - carruurta aabbe ka dhintay oo aan ilaalin karin danahooda gaarka ah. Mas'uulku wuxuu u haystaa hantidooda sida ammaano (amanah), waligiisna sidii milkiile.",
      "Waa maxay sababta ay qabriga u tahay: waxay isku daraysaa laba khalad - khiyaamo aaminaad xurmo leh iyo dulmi kuwa ugu difaaca badan. Sawirka Qur'aanku aad buu u daran yahay: kuwa ku cuna xoolaha agoonta si xaq-darro ah 'waxay ku cunaan calooshooda dab uun' (4:10), iyagoo u beddelaya daqiiqad hunguri ah ciqaab naf-hurnimo ah. Si aad uga faa'iidaysato qof aan cid u hadlina waa mid ka mid ah noocyada ugu fool xun ee caddaalad-darrada ah, waana sababta digniintu u tahay mid af badan - iyo, isagoo afaysan, naxariis badan oo ka fogeynaya mas'uuliyiinta.",
      "Waxa ka mid ah: ma aha oo kaliya xatooyo toos ah, laakiin qaabab khiyaano leh - isku darka hantida agoonta iyo mid ka mid ah si ay u kharribaan khadka, dib u dhigista soo noqoshada mar alla markii agoonku uu weynaado, ama maalgelin ama kharash la'aan. Eebe wuxuu amray caksigeeda: ' Siiya agoonta xoolahooda, xumaantana ha ku badalina wanaag' (4:2).",
      "Dariiqa laga fogaanayo: Xoolaha Agoonta si taxaddar leh u dhawra, kala saara oo xisaabiya, u dhiiba oo dhammayn markay qaan-gaaraan, ruuxii gaalayna-na u toobad keena waxii lagu leeyahay oo loo kordhiyo, kana cafiyo kuwa la dulmiyey. (44) Maalinta ayan u gargaarayn Xoolo iyo Nasab midna Qalbi Wanaagsan mooyee, soo celinta ammaanada iyadaa ah camal la dhawro.",
    ],
    quran: [
      {
        excerpt: "Kuwa xoolaha agoonta si xaqdarro ah u cuna, Oo calooshooda waxay ku gubaan dab.",
      },
      {
        excerpt:
          "Siiya Agoonta Xoolahooda, hana ku Badalina Xumaan wanaag, hana ku Cunina Xoolahooda iyo Xoolihiinna.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Caasinta Waalidiinta",
    summary: "Cuquq - oo ka mid ah dembiyada waaweyn shirkiga ka dib.",
    body: [
      "Qeexid: Cuquq al-walidayn waa caasinimo daran iyo si xun loola dhaqmo waalidka – wax u dhimistooda, la dhaqma si xaqiraad ah, dayaca iyaga oo baahan, ama ku dhaawacma hadal ama ficil. Waa lidka bir al-walidayn, oo ah naxariista waajibka ah ee Islaamku amray.",
      "Waa maxay sababta ay qabri u tahay: Aayadda ka dib Eebbe wuxuu ku lamaanaa amarka ah in isaga lagu caabudo iyo amarka wanaagga waalidka, sida 'Caabuda Eebbe... iyo waalidka fala' (4:36) - iyagoo xaqooda isla markiiba ka dib kiisa. Waalidku waa Eebbe dabadiis, waa isha ugu dhow ee qofka nafsadiisa iyo korriintiisa, sidaa darteed mahad-la’aantu waa nooc ka mid ah mahadnaqid qoto dheer. Rasuulku ﷺ wuxuu ku tiriyay xadgudubkooda mid ka mid ah dambiyada waaweyn ee ugu waaweyn, marka laga reebo shirkiga.",
      "Isku dheeli tirnaan muhiim ah: dhawrsanaantu macnaheedu maaha in waalidka loo hoggaansamo caasinimada Alle - makhluuqa laguma addeeci dembi ka dhan ah abuuraha. Laakiin xitaa haddii qofku hoos u dhaco, waxaa lagu sameeyaa dabacsanaan, ixtiraam, iyo naxariis joogto ah. Quraanku waxa uu xarrimay xataa hadalka ugu yar ee xanaajinta: 'ha ku odhan uff' (17:23).",
      "Jidka soo laabashada: naxariista halkan waa in waalidiintu inta badan wali ay gaadhi karaan. Qofkii gaabnaa, towbadkeenku inta badan waa wax la taaban karo - dib u bilaabo naxariista, cafis weydiiso, u adeeg oo u ducee iyaga, gaar ahaan inta ay nool yihiin. Haddii waalidku dhaafo, dhawrsanaantu waxay ku sii socotaa u duceeynta iyaga, u bixinta sadaqo iyaga oo wakiil ka ah, oo ixtiraamaya xidhiidhkooda iyo saaxiibadooda.",
    ],
    quran: [
      {
        excerpt:
          "Eebahaana wuxuu faray inaydaan caabudin isaga mooyee, waalidkiina wanaag. Ha odhanina Uff hana celinina ee kula hadal hadal wanaagsan.",
      },
      {
        excerpt: "Caabuda Eebbe hana la wadaajinna waxba, waalidkiina wanaag fala.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Miyaanan idiinka warramin waxa ugu wayn dambiyada. Eebe oo loo wadaajiyo, waalidkana lagu caasiyo.",
      },
    ],
    actions: ["Wac ama booqo waalidiinta usbuucan kalmad naxariis leh."],
    appLinks: [{}],
  },
  {
    title: "Tuugnimo",
    summary:
      "Qaadashada hantida dadka kale si sharci darro ah - waxay ku xad gudubtaa kalsoonida waxayna martiqaadaysaa ciqaab.",
    body: [
      "Qeexid: Xatooyo (Saariqah) waa qaadashada hantida ama hantida dadka kale xaq la'aan - ha ahaato qarsoodi, wax-is-daba-marin, khiyaano, ama qabsashada qarsoodi ah oo aan qofku sheegan.",
      "Waa maxay sababta uu qabriga u yahay: waxay ku xad gudubtaa xuquuqda dadka iyo kalsoonida ay ku tiirsan tahay nolosha bulshada. Khatartiisa waxa hoosta ka xariiqey ciqaabta la soo dejiyey ee Qur'aanku ku sheegay kiisaska u qalmida (5:38) - ciqaab ay ka mid yihiin shuruudo adag iyo halbeegyo caddayneed oo sarreeya, si ay u darnaantiisa u adeegto inta badan sida xannibaad xooggan oo ilaalinaysa hantida dadka. Hadafka Islaamku waa bulsho ay dadku ku dareemaan ammaan alaabtooda.",
      "Wajigeeda casriga ah: tuuganimadu kuma koobna in guri la jabsado. Waxaa ka mid ah ka qaadashada loo shaqeeyaha, khiyaamaynta ganacsiga, ka joojinta mushaharka shaqaalaha, budhcad-badeednimada dhijitaalka ah, been-abuurka, iyo ka faa'iidaysiga wax aan si sharci ah qofku u lahayn. Waxa dadka ka qarsooma marna ka qarsoona Alle oo arka wax kasta oo gaar ah.",
      "Dariiqa soo noqoshada: sababtoo ah xuquuqda bini'aadamka ayaa ku lug leh, towbaddu waxay u baahan tahay wax ka badan qoomamaynta Eebbe hortiisa. Qofku waa inuu u soo celiyaa shayga la xaday laftiisa, ama qiimahiisa, mulkiilaha xaqa u leh, oo uu cafis weydiistaa halka ay suurtagal tahay; haddii la heli waayo mulkiilaha, culimadu waxay ku talinayaan in ay bixiyaan qaddarka sadaqo iyaga oo wakiil ka ah. Sidan oo kale xatooyada ayaa loo cafiyaa kan jecel addoonka soo noqday.",
    ],
    quran: [
      {
        excerpt:
          "Tuugii, lab iyo dhaddig, waxay ka gooyeen gacmahooda iyagoo ka abaal-marin waxay kasbadeen, xag Eebbe xaggiisa ka ahaaday.",
      },
    ],
    actions: ["Soo celi alaabta la xado ama qiimahooda; Cafis weydiiso kuwii la dulmiyay."],
    appLinks: [{}],
  },
  {
    title: "Maandooriye",
    summary:
      "Khamriga iyo maandooriyaha - si tartiib tartiib ah oo go'aan leh ayaa loo mamnuucay Qur'aanka.",
    body: [
      "Qeexid: Khamr waa wax kasta oo sakhraansan oo daruuriya caqliga - khamriga iyo khamriga oo dhan, iyo mabda'a Nabiga ﷺ, walax kasta oo sakhraan ah nooc kasta oo ay tahay ama magaceeda. Khamri kastaa waa khamr, khamr walbana waa xaaraan.",
      "Maxaa qabri u ah: maskaxdu waa awoodda uu qofku Alle ku garanayo, ku kala garto xaqa iyo baadilka, mas’uuliyad kasta oo kalena ku ilaalinaysa. Maandooriyaha ayaa si dhab ah u baabi'iya taas, waana sababta uu Qur'aanku ugu xidhay sanamyo iyo khamaar sida 'nijaasta ka timid shaqada Shaydaanka' wuxuuna amrayaa, 'iska ilaali' (5:90). Marka laga reebo shaqsiga, waxay burburiyaan caafimaadka, qoysaska, iyo badbaadada, waxayna furaan albaabka dembiyada qof miyir qaba weligiis uma soo dhowaan doono.",
      "Xikmadda sida loo xaaraantinimeeyey: Alle kuma uu mamnuucin Khamr hal mar oo istaroog kedis ah, balse waxa uu madnuucay marxalado kala duwan, isaga oo bulshadii hore ka saaray caado xididnimo si tartiib ah. In si tartiib tartiib ah lafteedu ay cashar u tahay naxariista - iyo tusaalaha rajada qof kasta oo la halgamaya inuu maanta ka tago.",
      "Jidka soo noqoshada, oo naxariis leh: kuwa lagu qabto balwadda maaha in la quudhsado ee la taageero. Towbadkeenku waxa weeye in la xaliyo oo laga tago walaxda, lagana saaro nafteeda iyo waxyaalaha kiciya, gargaar iyo daweynna la raadiyo ceeb la'aan, meesha bannaanna lagu buuxiyo shuraako wanaagsan, zikri iyo cibaado. Albaabkiisu waa furan yahay, tallaabo kasta oo daacad ah oo ka fogaanshada maandooriyahana waa tallaabo uu soo dhawaynayo.",
    ],
    quran: [
      {
        excerpt:
          "Kuwa xaqa rumeeyow Khamriga, khamaarka, Sanamyada iyo faalka waa nijaas camal Shaydaanka ee ka fogaada.",
      },
    ],
    hadith: [
      {
        excerpt: "Maandooriye kasta waa khamr, khamr walbana waa xaaraan.",
      },
    ],
    actions: [
      "Caawinaad raadso haddii loo baahdo; caadadii ku bedel dhikriga iyo wada shaqayn wanaagsan.",
    ],
    appLinks: [{}],
  },
];

export const JAHANNAM_NAMES_SO: DeepPartial<JahannamNameEntry>[] = [
  {
    name: "Jahannama",
    meaning: "Naarta - Magaca Qur'aanka ugu badan ee Naarta.",
    quran: {
      excerpt: "Ka Dhawrsada Naarta Shidadeedu Dad iyo Dhagax tahay, loona Darbay Gaalada.",
    },
    context:
      "Qur'aanka oo dhan ayaa loo adeegsaday sidii hoyga ciqaabta kuwa gaaloobay ee ku adkaysta xumaanta.",
    tafsirNote:
      "Ibn Kathir wuxuu xusay in Jahannam uu yahay magaca naarta oo dhan oo loo diyaariyey digniin iyo cawaaqib xumo.",
    scholarlyNote:
      "Culimada qaar ayaa ka dooda in Jahannama yahay Jahannamo dhan ama heer gaar ah — aragtiyaha ayaa kala duwan.",
  },
  {
    name: "Jaheem",
    meaning: "Dab ololaya - kulayl daran oo daran.",
    quran: {
      excerpt:
        "Idinka iyo waxaad caabudaysaan oo Eebe ka soo hadhay waxaad u tihiin Shidaalka Jahannamo, waadna galisaan.",
    },
    context: "Wuxuu qeexayaa darnaanta naarta ee sugaysa kuwa Alle la shirtama.",
    tafsirNote:
      "Al-Tabari waxa uu jaxiim la xidhiidha dab holcaya oo shiday oo aan waxba ka reebin.",
  },
  {
    name: "Saqar",
    meaning: "Taas oo gubta ama aan waxba ka tagin - kulayl daran.",
    quran: {
      excerpt: "Waxaan u kaxeeyaa Saqar. Maxaase ku garan kara waxa ay Saqar tahay?",
    },
    context: "Waxaa lagu xusay suuradda al-Muddaththir qofkii ka jeedsaday waxyiga.",
    tafsirNote:
      "Tafsiirka qadiimiga ahi waxa uu Saqar ku tilmaamay heerka Jahannamo oo aad u guba; faahfaahintu way ku kala duwan yihiin culimada.",
    scholarlyNote:
      "Hadday Saqar tahay heer gaar ah ama magaca Jahannamo guud ahaan waxa lagaga hadlayaa tafsiirka - maaha mid si cad loogu sheegay hal qoraal oo la isku raacay.",
  },
  {
    name: "Saciir",
    meaning: "Dab ololaya - dab shiday.",
    quran: {
      excerpt: "Waxayna gali Saciir oo ah Naarta Saciira.",
    },
    context: "Digniin ku socota kuwa ku cuna xoolaha agoonta xaq-darro.",
    tafsirNote:
      "Xididku wuxuu gudbiyaa gubasho iyo shid - xoogga saaraya firfircoonida, dabka cunaya.",
  },
  {
    name: "Xutamah",
    meaning: "Burburiyaha - kaas oo jebiya oo burburiya.",
    quran: {
      excerpt: "Waxa lagu tuurayaa al-Hutamah. Maxaase ku garan kara waxa uu yahay al-Hutamah?",
    },
    context:
      "Qofkii dib u sheega oo hanti urursada ciqaabtiisa, isagoo u malaynaya inuu waari doono.",
    tafsirNote: "Ibn Kathir wuxuu sharxayaa Xutamah inuu burburiyo oo uu gubo - dab Eebbe shiday.",
  },
  {
    name: "Hawiyah",
    meaning: "Godka ama godka - dhicitaan qoto dheer.",
    quran: {
      excerpt: "Midka miisaankiisu fudud yahay, magangalkiisuna waa Hawiyah.",
    },
    context: "Halkay u socdaan kuwa camalkoodu fudud yahay maalinta qiyaame.",
    tafsirNote:
      "Lagu tilmaamay god gun dheer oo naarta ku dhex yaal; al-Tabari waxay diiwaan gelisaa aragtiyaha qoto dheer iyo darnaanta.",
    scholarlyNote:
      "Qaar ka mid ah shaqooyinka tafsiirka ayaa ku taxan Hawiyah heer gaar ah - tixraac fasiraad cilmiyeed.",
  },
  {
    name: "Lazaa",
    meaning: "Olol - dab ololaya.",
    quran: {
      excerpt: "Macnaheedu maaha! Waa Ololkii Eebe, oo shiday.",
    },
    context: "Suuradda al-Macaarij — waxay uga digaysaa kuwa beeniya Saacadda (Qiyaame).",
    tafsirNote:
      "Ku xidhan ololka ka baxa oo gubanaya - Lazaa waxay xooga saaraysaa ololka firfircoon.",
  },
];

export const JAHANNAM_GATES_SO: DeepPartial<JahannamGateEntry>[] = [
  {
    quranNote:
      "Eebe wuxuu yidhi naarta waxay leedahay todoba albaab; Irid kastaa waxay leedahay qayb loo qoondeeyey kuwa soo gala (15:44).",
    scholarlyNote:
      "Qaar ka mid ah tafsiirka dambe ayaa ka shaqeeya albaabada la xidhiidha qaybaha dembiilayaasha. Shaqooyinkani maaha kuwo isku mid ah ilaha hore - waxay u joogaan sidii tafsiir ahaan.",
  },
  {
    quranNote:
      "Qur'aanku wuxuu caddeeyey toddoba albaab oo la wada leeyahay; Irid kasta uma magacaabin waxyi cad.",
    scholarlyNote:
      "Ibnu Kathiir waxa uu ka hadlayaa in kala qaybsanaantu ay tahay xikmad iyo caddaalad Alle.",
  },
  {
    quranNote:
      "Toddoba albaab - xaqiiqo qoraal ah oo cad. Faahfaahinta dadka irid kasta ku nool ayaa inta badan ah dood cilmiyeed.",
  },
  {
    quranNote:
      "Aayaddu waxay xooga saaraysaa hawl-qaybinta saami-qaybsiga - albaab kastaa wuxuu leeyahay qaybtiisa loo qoondeeyay.",
  },
  {
    quranNote:
      "Mu'miniinta waxaa looga digayaa inay ka fogaadaan waxa u horseedaya irdahaan towbad keenka.",
  },
  {
    quranNote:
      "Jahannamo waa la diyaariyey - digniintu waa dhab. Ilaalintu waa iimaan iyo camal suuban.",
  },
  {
    quranNote:
      "Toddoba irdood, hal dab - midnimada digniinta oo leh kala duwanaanshiyaha sida dembiilayaasha loogu qaybiyo xigmadda rabbaaniga ah.",
    scholarlyNote:
      "Iska ilaali inaad barato khariidad dembi-ilaa-albaabka ah sida xaqiiqada nebiyad ilaa aad soo xiganayso shaqo cilmiyeed la magacaabay.",
  },
];

export const JAHANNAM_VERSES_SO: DeepPartial<JahannamVerseEntry>[] = [
  {
    excerpt: "ka dhawrsada naarta loo darbay gaalada.",
    context: "Lagula hadlo rumaystayaasha - cabsida sida dhiirigelinta addeecidda.",
    tafsirSummary: "Ibnu Kathiir: waa baaq taqwa ah oo lagu lammaaniyay addeecidda Rasuulka.",
  },
  {
    excerpt: "Naxariista Eebe ha ka quusanina. Illeen Eebbe wuu dhaafaa dambiyada oo dhan.",
    context:
      "La kashifay si uu u qalbi qaboojiyo kuwa ka cabsaday dembiyadooda aad bay u weynaadeen.",
    tafsirSummary: "Waa tiirkii rajada, naxariistu waa weyn tahay kuwa dib u noqda.",
  },
  {
    excerpt:
      "Eebana u toobad keen una toobad keen, wuxuu u dhawyahay Eebihiin inuu idinka tago xumaanta.",
    context: "Ku amar mu'miniinta ka dib hanuuninta qoyska iyo dhaqanka.",
    tafsirSummary: "Nasuh tawbah - toobad dhab ah oo aan dembiga ku noqon.",
  },
  {
    excerpt: "Dhammaan waxaa jiri doona shahaadooyin sida ay sameeyeen.",
    context: "Cadaaladda rabaaniga ah - abaal-marin iyo ciqaab loo siman yahay camalka.",
    tafsirSummary: "Shahaadooyinku waxay khuseeyaan Jannada iyo Naarta labadaba.",
  },
  {
    excerpt: "Alle dadka ma dulmiyo haba yaraatee, laakiin dadku naftooda ayaa dulmiya.",
    context: "Hubinta in xukunka rabbaani yahay mid cadaalad ah.",
  },
  {
    excerpt: "Eebow na sii labada adduunyo wanaag, naga ilaali cadaabka naarta.",
    context: "Ducada kuwa adduunyo iyo kheyr adduunyo isku dara.",
    tafsirSummary: "Duco nebiyad ah oo lagu baray Qur'aanka - dheelitirka adduunka iyo aakhirah.",
  },
  {
    excerpt: "Jahannamo wuxuu leeyahay toddoba irdood; Waayo, irid kasta waa qayb loo qoondeeyey.",
    context: "Isagoo ka hadlaya dooddii Ibraahim ee dadkiisa.",
    tafsirSummary: "Si cad oo loo xuso toddoba irdood - faahfaahinta hawsha waa xigmad rabaani ah.",
  },
  {
    excerpt:
      "Kuwa Toobadkeena ee Rumeeya oo Camal Fiican Falay Mooyee Eebe wuxuu ku badali Xumaanta Wanaag.",
    context: "Marka laga reebo ka dib marka la tiriyo dembiyada waaweyn.",
    tafsirSummary: "Rajada kuwa toobad keena - camalka waxaa lagu beddeli karaa naxariis.",
  },
  {
    excerpt:
      "Kuwii ka gaaloobay Eebahood waxaa u sugnaaday cadaabka Jahannamo iyadaana u xun meel loo ahaado.",
    context: "Suuradda al-Mulk - waa xusuusinta waxa maqan.",
  },
  {
    excerpt: "Runtii camalka wanaagsani wuxuu fogeeyaa xumaanta.",
    context: "Amar ku oogida salaadda labada daraf ee maalinta.",
    tafsirSummary: "Dhiirigelinta in cibaadada joogtada ahi ay tirtirto silbashooyinka hore.",
  },
  {
    excerpt: "Eebow noo dambi dhaaf, naga ilaali cadaabka naarta.",
    context: "Sharaxaada muttaqin (Ilaah miyir qabo).",
  },
  {
    excerpt: "Midka miisaankiisu fudud yahay, magangalkiisuna waa Hawiyah.",
    context: "Suuradda al-Qaari'ah - miisaanka camalka.",
  },
];

export const JAHANNAM_HADITH_SO: DeepPartial<JahannamHadithEntry>[] = [
  {
    hadith: {
      excerpt:
        "Qofkii saddex jeer Alle weydiista Jannada Jannada wuxuu ku leeyahay: Alloow Jannada geli. Qofkii saddex jeer naarta ka magan gala, naarta waxay tiraahdaa: Alloow naarta ka ilaali.",
    },
    context: "Dhiirri-gelinta in aad u ducayso Jannada, lagana magan galo Jannada.",
  },
  {
    hadith: {
      excerpt:
        "Alle ayaa uga raalli noqday towbada addoonkiisa midkiin midkiin ku hela buurtiisa dhuntay isagoo jooga dhul abaar ah.",
    },
  },
  {
    hadith: {
      excerpt:
        "Midkiin Jannada kuma galo camalkiisa oo keliya - xataa aniga, hadduusan Eebbe iga daboolin naxariistiisa.",
    },
    context: "Dheelitiran: ku dadaal camalka laakiin ku kalsoonow naxariista.",
  },
  {
    hadith: {
      excerpt:
        "Dabkaagu waa qayb ka mid ah toddobaatanka qaybood ee naarta Jahannamo, qayb kastaana waxay la mid tahay kulaylkeeda.",
    },
  },
  {
    hadith: {
      excerpt:
        "Axdiga naga dhexeeya annaga iyo iyaga waa salaadda; Qofkii ka tagana wuu gaaloobay.",
    },
    context: "Darnaanta dayaca Salaadda - ka mid ah digniinaha ugu daran.",
  },
  {
    hadith: {
      excerpt:
        "Kii khasaaray wuxuu la yimaadaa tukasho, iyo soon, iyo sadaqo, laakiin wuu caayay, oo caytamay, oo maal si aan sharci ahayn ku cunay, oo dhiig buu daadiyey.",
    },
    context: "Xuquuqda dadka waxaa lagu xallin karaa kahor falalka maalinta qiyaamaha.",
  },
  {
    hadith: {
      excerpt:
        "Eebbe wuxuu u fidiyaa gacantiisa habeenkii si uu u towbad keeno dembiilaha maalinta, wuxuuna u fidiyaa gacantiisa maalintii si uu uga aqbalo dembiilaha habeenka.",
    },
  },
  {
    hadith: {
      excerpt: "Ruuxii rumeeyey Allaah iyo maalinta aakhiro wanaag ha ku hadlo ama ha iska aamuso.",
    },
    context: "Ilaalinta carrabka - la xisaabtanka maalinlaha ah.",
  },
];

export const JAHANNAM_REFLECTIONS_SO: DeepPartial<JahannamReflectionEntry>[] = [
  {
    question: "Maanta ma qof baan ku gafay - hadal, ficil, ama dayac?",
  },
  {
    question: "Maanta miyaan cafis Alle ka doonay - si daacad ah oo ku noqnoqonaya?",
  },
  {
    question: "Carrabkayga miyaan ka dhawray cay, been iyo majaajilo?",
  },
  {
    question: "Ma tukaday wakhtigeeda iyo goob joog?",
  },
  {
    question: "Miyaan qaaday tallaabo aan kula heshiiyo qof aan kala tagnay?",
  },
  {
    question: "Maanta miyaan bixiyay samafal ama naxariis - xitaa wax yar?",
  },
  {
    question: "Qur'aanka ma akhriyay ama ma dhagaystay maanta?",
  },
];

export const JAHANNAM_REFERENCES_SO: DeepPartial<JahannamReferenceEntry>[] = [
  {
    title: "Quraanka",
    note: "Isha aasaasiga ah ee magacyada, digniinaha, naxariista, iyo towbada. Turjumaada way kala duwan yihiin; la tasho Carabiga si sax ah.",
  },
  {
    title: "Saxiixul Bukhaari & Saxiix Muslim",
    note: "Ururinta xadiisyada kitaabka ah ayaa lagu soo qaatay cutubkan oo dhan halkaas oo lagu qiimeeyay saxixiinta.",
  },
  {
    title: "Tafsiir Ibnu Kathiir",
    note: "Tixraaca macnaha guud ee magacyada Jahannamo iyo aayadaha digniinta waaweyn - tafsiir cilmiyeed.",
  },
  {
    title: "Tafsiir al-Tabari",
    note: "Tafsiir hore oo dhammaystiran - faa'iido u leh fahamka aragtiyaha qadiimiga ah ee Jahannam.",
  },
  {
    title: "Halka ay culimadu ku kala duwan yihiin",
    note: "Heerarka saxda ah ee Jahannamo, shaqooyinka iridda, iyo macnayaasha magaca qaarkood ayaa laga wada hadlay culimada dhexdooda - had iyo jeer ma si cad waxyiga.",
  },
];

export const JAHANNAM_DUAS_SO: DeepPartial<JahannamDuaEntry>[] = [
  {
    context: "Weydiiso wanaag labada adduun iyo ka ilaalinta Naarta - Ducada Qur'aanka.",
  },
  {
    context: "Tashahud ka bacdi: Janno weydiiso, Naartana ka magangal.",
  },
  {
    context: "Xuska subaxii: laga magan galo cadaabka qabriga iyo naarta.",
  },
];

export const JAHANNAM_REFUGE_DUA_SO: { translation: string } = {
  translation:
    "Allahayow waxaan kaa magan galay cadaabka naarta, cadaabka qabriga, imtixaamaadka nolosha iyo dhimashada, iyo fitnada xun ee masiixa beenta ah.",
};
