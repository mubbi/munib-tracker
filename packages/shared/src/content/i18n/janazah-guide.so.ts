import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// so overlay for janazah-guide. Index-aligned with JANAZAH_GUIDE_TOPICS in ../janazah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const JANAZAH_GUIDE_TOPICS_SO: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Waa waajib beeleed",
    summary: "Janazah waa fard kifaax — bulshadu waa inay fulisaa.",
    body: [
      "Salaadda Janaazada (Salaatul Janazah) waa waajib beeleed (fard kifayah): haddii bulshada qaar ka mid ah ay gutaan waajibka inta kale waa laga qaadaa; Hadday midna samayn weydo, dhammaan waa wada eedda. Waxaa lagu tukadaa iyadoo taagan, iyadoon rukuuc iyo sujuud toona lahayn - oo ah nooc ka duwan salaadaha.",
      'Abuu Hureyrah waxa laga wariyey in Rasuulku (scw) uu yidhi: “Qofkii ka soo qayb gala jinaasada ilaa laga tukado waxa uu leeyahay qiraad (ajir ah), ruuxii taga ilaa la aasayo waxa uu leeyahay laba qiraad”. Waxa la weydiiyey waxa ay tahay Qiraad, markaasuu yidhi: "Sida laba buurood oo waaweyn" (Saxiixul Bukhaari 1325; Saxiix Muslim 945).',
      "Aaska ka dib, in la kaalmeeyo dhaqidda iyo aaska hadba inta uu awoodo, iyo in loo duceeyo qofka dhintay waxay ka mid yihiin xuquuqda qofka muslimka ah uu ku leeyahay qofka kale. Jirka ula dhaqan si sharaf leh kana fogow xad-dhaafka ama dhaqamada caddayn la'aan.",
    ],
    actions: [
      "Si degdeg ah uga jawaab marka aaska lagaga dhawaaqo beeshaada.",
      "Salaadda iyo ka-qaybgalka Alle dartii ugu dadaal, ee ha u yeelin bandhig bulsho.",
      "Caawinta baahiyaha dhabta ah ee qoyska marka aad si xushmad leh u samayn karto.",
    ],
    hadith: [
      {
        excerpt:
          "Ruuxii ka qayb gala Janaasada intuu ka Tukanayo Salaadda Janaasada wuxuu leeyahay Hal Qiraad, Ruuxii taga inta la aasayana wuxuu leeyahay Labo Qirood mid walbana wuxuu la mid yahay Buur wayn.",
      },
      {
        excerpt:
          "Qofkii u raaca aaska qofka muslimka ah iimaan iyo ajar doon, oo ku sugnaada inta salaadda laga tukanayo oo laga dhammeeyo xabaalku, wuxuu la soo noqonayaa laba qiraad...",
      },
    ],
  },
  {
    title: "dhaqid iyo xiniinyo",
    summary: "Ghusl ee marxuumka iyo kafan fudud - sharaf aan xad-dhaaf ahayn.",
    body: [
      "Muslimiinta dhinta (marka laga reebo shahiidiintii goobta dagaalka ee xukunka qadiimiga ah) waxaa lagu dhaqaa maydh nadiif ah, ka dibna lagu daboolaa maro cad oo nadiif ah. Ummu Atiyyah waxa ay wariyey in Nabigu ﷺ ka yidhi dhaqidda inantiisa: 'ku maydh saddex ama shan jeer, ama ka badan haddaad u aragto inay ku habboon tahay, oo ku rid kafur - ama kafur - kan u dambeeya' (Saxiix Al-Bukhaari 1253).",
      "Caa’isha waxa laga soo wariyey in Rasuulku (scw) lagu xidhay saddex maro oo cad cad oo Yemeni ah, kuwaas oo aan ku jirin shaadh iyo cimaamad midna (Saxiixul Bukhaari 1264; Saxiix Muslim 941). Fududuhu waa sunne; bandhigyada qaaliga ah waxay ka hor imanayaan tusaalaha nebiyada.",
      "yaa maydha, inta maro ee rag iyo dumarba, iyo tafaasiisha la xidhiidha madhabka ayay ku kala duwan yihiin. Qoysasku waa inay raacaan hagaha degaanka ee aqoonta u leh ama adeegga aaska ee yaqaan dhaqanka dugsiga - dulmarku maaha buug-gacmeedka wax lagu dhaqo.",
    ],
    actions: [
      "Magacaabo dad aamin ah oo ay isku jinsi yihiin marxuumka marka ay suurtagal tahay.",
      "Xijaabka ha ahaado mid fudud oo nadiif ah - maro cad ayaa ah tusaalaha nebiyada.",
      "Iska ilaali inaad sawirto ama soo bandhigto jidhka adigoon u baahnayn.",
    ],
    hadith: [
      {
        excerpt:
          "Ku dhaq saddex jeer, ama shan ama ka badan, haddii aad taas u aragto in loo baahdo, biyo iyo sidr, oo ku rid kaafuur ama kafurka ugu dambeeya.",
      },
      {
        excerpt:
          "Rasuulku ﷺ waxa lagu dahaadhay saddex maro oo cad cad oo Yemeni ah; Shaadh iyo cimaamad midna kuma jirin.",
      },
    ],
  },
  {
    title: "Marka la xidho indhaha marxuumka",
    summary: "Duco nebiyeedka wakhtiga dhimashada.",
    body: [
      "Ummu Salamah waxaa laga wariyey inuu Rasuulku (scw) u yimid Abu Salamah markay indhuhu doorteen. Wuu xidhay oo yidhi: Marka nafta la qabto, aragga ayaa raacaya, reerkiisiina way ooyeen. Dabadeed wuxuu baray inay wanaag uun ku hadlaan, malaa'igtu waxay ku tidhaahdaa aamiin, wuxuuna u duceeyay Abuu Salamah (Saxiix Muslim 920).",
      "Xisnul Muslim gelitaankan hoose waxa uu ilaalinayaa ereyada loo adeegsado xidhitaanka indhaha. Si tartiib ah u hadal, iska ilaali baroorta uu Nebigu NNKH reebay, oo ku mashquul carrabka hadal wanaagsan iyo dembi dhaaf.",
    ],
    actions: [
      "Indhaha si tartiib ah u xidh oo samee ducada saxda ah.",
      "Xusuusi qoyska inay ku hadlaan wanaag.",
    ],
    hadith: [
      {
        excerpt:
          "Markii ay indhihii Abu Salamah qabteen ayuu Nabigu (scw) xidhay oo yidhi marka nafta la qabto araggu wuu raacayaa, kadibna reerkii baray inay ku hadlaan wanaag uun.",
      },
    ],
  },
  {
    title: "Sida loo Tukado Jannada",
    summary: "Salaad taagan oo afar takbiir ah - rukumo iyo sujuud midna.",
    body: [
      "Salaada Janaasada oo taagan Rukuuc ma jiro, sujuudna ma jiro, adhan iyo iqaamana ma jiro. Imaamku waxa uu taagan yahay madaxa nin dhintay ama badhtamaha qof dumar ah oo dhintay sida laga soo xigtay Anas iyo Samurah (eeg Abuu Daawuud 3194 iyo qisooyinka la xidhiidha), jameecaduna waxay samaysaa saf.",
      "Salaaddu waxay ka kooban tahay afar takbiir. Marka hore kadib waxaa la akhriyay suuratul Faatixa (Bukhaari 1335). Takbiirta ka dib, waxaa loo duceeyay Nabiga ﷺ iyo ducada qofka dhintay. Salaaddu waxay ku dhammaatay taslim. Jaabir waxa uu wariyay in Nabigu ﷺ u duceeyay Negus (boqorkii Xabashida) oo uu yidhi afar takbiir (Saxiix al-Bukhaari 1334).",
      "Soogalootiga danbe ee seegaya takbiirta waa inay raacaan imaamka oo ay dhamaystiraan wixii ay seegeen si waafaqsan sharciga dugsigooda si ay ula qabsadaan - weydii imaamka ama macalinka deegaanka haddii aysan hubin.",
    ],
    actions: [
      "Istaag saf; ha sujuudin, hana sujuudin.",
      "afar takbiir imaamka la jooga dheh.",
      "Duco daacad ah u samee marxuumka takbiirta ku haboon ka dib.",
    ],
    hadith: [
      {
        excerpt: "Nabigu ﷺ ayaa ku Tukaday Salaad Janaasada Negus oo uu yidhi Afar Takbiir.",
      },
      {
        excerpt:
          "Ibnu Cabbaas ayaa ku tukaday salaad janaaso, wuxuuna akhriyay Faatixada isagoo sheegay inay ka timid sunnada.",
      },
    ],
  },
  {
    title: "Ducadii Salaada Janaasada (Dadwayne)",
    summary: "Erayada Hisnul Muslim Sax ah ee Marxuumka.",
    body: [
      "Takbiirta ka bacdi, Qalbiga Janada waxaa loogu duceeyaa Marxuumka----na Allah looga baryo inuu u dambi dhaafo, una naxariisto, Jannatul Firdowsana ka waraabiyo. Dhowr kelmadood oo saxiix ah ayaa lagu xafiday Hisnul Muslim oo ka yimid Nabiga ﷺ.",
      "Fur ducada isku xidhan ee hoose si aad ugu akhrido af Carabi, tarjumaad iyo macne. Waxa laga yaabaa inaad barato wax ka badan hal erey oo dhab ah; daacadnimada wax ka badan dhererka.",
    ],
    actions: [
      "Xafid ugu yaraan hal Janaza dua oo sax ah.",
      "Ducada guud u samee dhamaan dadka muslimiinta ah ee dhintay markaad kasoo qaybgasho",
    ],
  },
  {
    title: "Duco janaasada oo badan",
    summary: "Erayada Saxda ah ee dheeraadka ah ee ka yimid Hisnul Muslim.",
    body: [
      "Xisnul Muslim waxa uu xafiday salaada janaasada kalmado laga bartay nabiga ﷺ. U isticmaal wareegtada ama baro midka bulshadaada sida ugu fiican u taqaan.",
      "Ilmaha dhintay, ducooyin gaar ah oo Allaah ka barya inuu ubadka uga dhigo mid horudhac u ah oo abaal-marin u kaydiya waalidka - eeg mowduuca xiga.",
    ],
  },
  {
    title: "Salaada Janaasada ducada #3",
    summary: "Eray kale oo sax ah oo loogu talagalay qofka weyn ee dhintay.",
    body: [
      "A kale oo Xisnul Muslim ah oo ku saabsan salaadda Janaasada. Akhri takbiirta ku haboon ka dib sida imaamkaagu u ogolaado.",
    ],
  },
  {
    title: "Salaada Janaasada ducada #4",
    summary: "Eray afraad oo saxiix ah oo ka soo jeeda sunnada.",
    body: [
      "Hisnul Muslim waxa ku jira ducadan janaasada oo dheeri ah. Dooro runnimada iyo joogitaanka wadnaha in ka badan hal mar la ururiyo eray kasta.",
    ],
  },
  {
    title: "Ducadii ubadka dhintay",
    summary: "Ducooyin sheegid gaar ah marka uu dhintay uu ilmo yar yahay.",
    body: [
      "Marxuunku markuu caruur yahay , duco dhab ah oo Alle ka barya inuu ubadka ka yeelo hanti kaydsan , horudhac , una shafeeco waalidka. Qoraallada Hisnul Muslim ee hoos ku qoran ayaa ilaalinaya erayadaas.",
      "qoyska ugu raaxayso naxariista Alle adigoo ka fogaanaya caadooyinka la alifay. Isla afar-takbiir dhismaha Janazah ayaa khuseeya; nuxurka ducada waa waxa isbedela.",
    ],
    actions: [
      "Isticmaal dusyada gaarka ah ee ilmaha marka ay habboon tahay.",
      "Ku taageer waalidiinta murugaysan joogitaanka iyo caawinta xalaasha ah.",
    ],
  },
  {
    title: "Ducada Aaska Ubadka #2",
    summary: "Labaad ee Hisnul Muslim Erayga ubadka dhintay.",
    body: [
      "Eray kale oo saxiix ah oo ku saabsan salaadda janaasada ee ilmaha, oo lagu xafiday Hisnul Muslim.",
    ],
  },
  {
    title: "xabaal iyo xabaal",
    summary: "Hoos u dhigida jidhka, una jeedda qiblada, iyo ducada aaska ka dib.",
    body: [
      "Marxuumku waxa uu ku aasan yahay dhulka qiblada ka soo jeedda, si sharaf leh oo aan dib u dhac ku imanayn waxa loo baahan yahay diyaarintiisa. Nebigu (scw) wuxuu yidhi: ku degdega aaska... (Saxiix al-Bukhaari 1315 — dedejisa aaska).",
      "Marka la geliyo marxuumka qabriga, duco sax ah ayaa lagu xafidaa Hisnul Muslim. Xabaasha ka dib, Nebigu ﷺ wuxuu istaagi jiray qabriga oo uu odhan jiray: 'Dambi dhaaf u weydiiso walaalkaa, oo weyddiiso in loo saro, waayo hadda waa la waydiinayaa' (Sunan Abii Daawuud 3221 - oo ay saxiixeen culimo badan oo dambe oo uu ka mid yahay Albaani).",
      "Dhismooyin qurxin leh oo qabuuraha korkooda laga dhiso, lagu dhejiyo si loo qurxiyo, ama qoraal dhiirigeliya buunbuuninta ayaa looga digayaa warbixinnada dhabta ah. Ka dhig calaamadda mid fudud halka sharciga iyo dhaqanka deegaanku ogol yahay aqoonsiga.",
    ],
    hadith: [
      {
        excerpt:
          "ku degdego aaska, hadday xaq tahay, wanaag baad u dedejisaa; Haddii kalese, xumaanta qoortiinnaad iska saaraysaan.",
      },
      {
        excerpt:
          "Walaalkaa cafis weydiiso oo ka bari in uu u samro, waayo hadda waa la is weydiinayaa.",
      },
    ],
  },
  {
    title: "Ka dib markii la aasay marxuumka",
    summary: "Ducada qabriga ku aakhiro.",
    body: [
      "U istaagida in yar ka dib aaska si ay dambi dhaaf iyo u samir u waydiiso marxuumka waxa laga sugnaaday Nabiga ﷺ (Abuu Daawuud 3221). Erayga Hisnul Muslim ee hoos ku qoran waa aaska ka dib.",
      "Sadaqo joogta ah, duco iyo oofinta dardaarankii sharciga ahaa ee marxuumku waxay uga faa’iideysteen idanka Alle — iyada oo aan la hindisin xaflado sanadle ah oo aan caddayn lahayn.",
    ],
    actions: [
      "ku duca qabriga ka dib aaska.",
      "Sii wad ducada gaarka ah iyo sadaqada qofka dhintay.",
    ],
  },
  {
    title: "Booqashada qabuuraha",
    summary: "salaanta nabinimada marka la booqanayo qabuuraha.",
    body: [
      "Qubuuraha la booqdo waxa ay xasuusinaysaa nolosha aakhiro. Buraydah waxa laga wariyey in Rasuulku (scw) uu bari jiray marka ay xabaalaha u soo baxayaan: salaan nabadgalyo korkiisa ha ahaato ehlu hoyga mu’miniinta iyo muslimiinta, isagoo caddeeyey in aanu-Ilaahay idamkii- ku biiri doono, anagana anaga iyo iyagaba khayr waydiisanayno (Saxiix Muslim 975; sidoo kale wuxuu ku yidhi Ibnu Maajah).",
      "Xisnul Muslim soo galitaanka hoose ayaa ilaalinaya salaantaas. Ka dhig booqashooyinka bilaashka ah baroorta, raadinta caawimaadda kuwa dhintay, ama caadooyinka bilaa caddayn.",
    ],
    actions: [
      "Ku salaamo dadka qubuuraha deggan erayada dhabta ah.",
      "Ka fiirso geerida oo soo cusboonaysii camalka xaqa ah.",
    ],
    hadith: [
      {
        excerpt:
          "Asalaamu Calaykum Waraxmatullaahi Wabarakaatuh. Waan ku soo biiri doonnaa, haddii Alle idmo. Annaga iyo idinkaba waxaan Allah uga baryaynaa wanaag.",
      },
    ],
  },
  {
    title: "Xusuusin iyo khaladaad caadi ah",
    summary:
      "Iska ilaali baroorta, dib u dhigista bandhigga, iyo caadooyinka aan sal iyo raadka lahayn.",
    body: [
      "Rasuulku ﷺ wuxuu reebay in loo baroorto meydka iyadoo la ogolyahay murugada oohinta. Cabdullaahi ibnu Cumar waxa laga wariyey in Sacad ibnu Cubadah uu ku ooyay janaasada, nabiguna ﷺ wuxuu sharaxay in aanu Eebe ciqaabin jeexjeexa isha ama murugada qalbiga, balse uu u cadaabo midaas – wuxuuna u tilmaamay carabkiisa (Saxiix Al-Bukhaari 1304).",
      "Ha ku daahin aasitaanka shirarka sharafta leh, hana ku bixin si qurux badan gogosha iyo diyaafadda adoo dayacayn masaakiinta. Ha akhrin hana ku celcelin wax cusub oo loo nisbeeyo aaska iyada oo aan sal dhab ahayn. Tacsi, duco deggan, iyo caawinta qoyska waa tubta sunnada ah.",
      "ka qayb galka haweenka ee salaada iyo aaska waxa loola dhaqmaa si dhib yar dhamaan dugsiyada iyo waayaha; raac hanuunin maxalli ah oo la aamini karo oo ixtiraamaya naxariista iyo xadka nebiyada labadaba.",
    ],
    disclaimer:
      "Dulmar waxbarasho — ma aha buug-gacmeedka agaasime aaska ama fatwo. Dhaqanka dugsiga maxalliga ah ee dhaqidda, gogosha, iyo xeerarka qabuuraha waa in lagu xaqiijiyaa dad aqoon u leh.",
    actions: [
      "Murugo adoon barooran ama hadal xaaraan ah.",
      "Dedeji aas sharaf leh.",
      "Ka caawi qoyska cuntada iyo arrimaha adiga oo aan culays ku saarin xad-dhaaf.",
    ],
    hadith: [
      {
        excerpt:
          "Eebbana uma cadaabo ilmada isha iyo murugada qalbiga toona, balse wuu ciqaabaa ama wuu u naxariisanayaa arrinkaas- oo carrabkiisa u tilmaamay.",
      },
    ],
  },
  // --- v2 appended topics (keep index-aligned with English) ---
  {
    title: "Takbiir takbiir — tallaabooyinka salaadda",
    summary: "Liis ficil ah oo afar takbiir iyo waxa u dhexeeya.",
    body: [
      "Takbiirta koowaad: gacmaha kor u qaad (sida madhabkaaga), dheh Allahu Akbar, ka dib akhri Surat al-Fatihah. Ibnu Cabbaas wuxuu Faatixada ku akhriyay salaadda janaazada isagoo yidhi waa sunnada (Saxiix al-Bukhaari 1335).",
      "Takbiirta labaad: u dir salawaad Nebiga ﷺ — isla salawaadka Ibraahiim ee tashahhudka ayaa si ballaaran loogu baraa tallaabadan. Takbiirta saddexaad: duco daacad ah u samee marxuumka (ereyada Hisnul Muslim ee hagahan). Takbiirta afraad: culimada badankood waxay ka dib sameeyaan duco guud oo kooban, ka dibna ku dhammeeyaan tasliim dhanka midig (iyo bidix, sida madhabka).",
      "Rukuuc, sujuud, ama fadhiisin ma jiraan. Inta oo dhan istaag. Haddii janaazooyin dhowr ah ay joogaan, Janazah keliya oo loogu niyadaysto dhammaan ayaa lagu dhaqmaa bulshooyin badan — imaamka raac. Meesha salawaadka iyo ducada waxay yara beddeli karaan madhabka; qaabka afar-takbiir waa mid wadaag ah.",
    ],
    madhhabNote:
      "Buugaagta Xanafi, Maaliki, Shaafici, iyo Xanbali way kala duwan yihiin in gacmaha la qaado takbiir kasta iyo goorta saxda ah ee ducada. Imaamka kaa horreeya raac.",
    actions: [
      "Baro isku xigxiga afar-takbiir ka hor intaadan u baahnayn.",
      "Xafid Faatixa, salawaad, iyo ugu yaraan hal duco janaazo.",
    ],
    hadith: [
      {
        excerpt:
          "Ibnu Cabbaas wuxuu tukaday salaad janaazo oo akhriyay Faatixa isagoo sheegay inay ka timid sunnada.",
      },
    ],
  },
  {
    title: "Ducooyinka ragga, dumarka, iyo carruurta",
    summary: "Isla ereyada nebiyadeed — beddel magacyada Carabiga si ay u waafaqaan marxuumka.",
    body: [
      "Hisnul Muslim (iyo ururinta xadiiska caadiga ah) waxay diiwaangeliyaan ducooyinka Janazah inta badan qaabka labka. Taasi macnaheedu maaha duco gaar ah oo 'la hindisay' dumarka. Culimada guud waxay bariyaan inaad hayn karto ereyada labka iyadoo niyadda qofka, ama — oo ka door ah oo caadi ah — beddelo naxwaha si uu u waafaqo marxuumka: لَهُ / هُ / هِ → لَهَا / هَا؛ عَبْدُكَ → أَمَتُكَ؛ ابْنُ أَمَتِكَ → ابْنَةُ أَمَتِكَ؛ iyo gabar carruur ah اجْعَلْهُ → اجْعَلْهَا، شَفِيعًا مُجَابًا → شَفِيعَةً مُجَابَةً.",
      "Haweeney marxuum ah, culimo qaar ayaa kula talinaya taxaddarka weedha 'nin ka wanaagsan ninkeeda' (زَوْجًا خَيْرًا مِنْ زَوْجِهَا), iyagoo xusaya inay Jannada la kulmi karto ninkeeda — waxaad ka tagi kartaa weedhaas ama haysataa ereyo guud. Carruurta, isticmaal gelitaanada Hisnul ee carruurta (hisn-160, hisn-161) halkii aad ka isticmaali lahayd qoraallada dadka waaweyn ee dembi-dhaafka kaliya.",
      "Ereyga wadajirka ah 'magfiradda raggeenii iyo dumarkeenna' (hisn-157) wuxuu horey u daboolaa labada jinsi isagoon beddelin. Ma hindisno Carabi cusub oo ka baxsan beddelka naxwaha ee qoraallada saxda ah — fur ducada dadka waaweyn ee la xiriiray aasaas ahaan oo ku dabaq khariidadda magacyada kor ku xusan.",
    ],
    madhhabNote:
      "Haynta qaababka labka iyadoo niyadda iyo beddelka qaababka dheddigga labadaba waa la aqbalay culimada guud dhexdooda. Markaad shaki qabtid, isticmaal hisn-157 (ragga iyo dumarka) ama weydii imaamka.",
    actions: [
      "Ku tababar beddelka magacyada dheddigga ducada aad xafidayso.",
      "Isticmaal ducooyinka carruurta kuwa aan gaarin baaluqnimada.",
      "Dooro saxnimada halkii aad ka dooran lahayd buugaag dheer oo aan la xaqiijin.",
    ],
    appLinks: [{ label: "Ducada janaazada dadka waaweyn #1" }],
  },
  {
    title: "Shahiidiinta, dhicista, iyo xaaladaha gaarka ah",
    summary: "Marka xukummada maydhitaanka ama Janazah ay ka duwan yihiin xaaladda caadiga ah.",
    body: [
      "Shahiidiinta goobta dagaalka ee ku dhinta dagaalka, xukunka qadiimiga ah ee Uhud laga soo qaatay, waxaa lagu aasaa dharkooda iyagoon maydhin ghuslka caadiga ah; Nebigu ﷺ wuxuu amray in shahiidiintii Uhud lagu aaso dhiiggooda iyagoon la maydhin (Saxiix al-Bukhaari 1346). Qaybaha kale ee loo yaqaan 'shahiidi' abaalmarinta (tusaale cudurka daacuunka, qaraqashada) caadi ahaan maydhitaan iyo Janazah bay helaan — weydii caalim xaaladaha geesaha.",
      "Dhicista ama ilmo dhintay oo dhashay, madhabyadu way kala duwan yihiin goorta salaadda janaazada iyo maydhitaanka buuxa ay khusayaan (intabadan ku xidhan in qaab la aqoonsan karo ama marxaladda nafta lagu afuufay la xukumay). Xadiis ayaa dhiirrigeliya in lagu tukado dhicista oo loo raadiyo magfirad iyo naxariis waalidiinta (Abuu Daawuud 3180). Raac guddiga janaazada ee madhabkaaga halkii aad qiyaasi lahayd.",
      "Qaraabada aan muslimka ahayn looma tukado salaadda Janazah ee muslimiinta; naxariista, caawinta aaska ee xalaasha ah marka ay khusayso, iyo murugada shakhsi ahaaneed way ka duwan yihiin salaadda cibaadada ee mu'miniinta. Mar walba xaqiiji xaaladaha gaarka ah hagitaan maxalli ah oo u qalma.",
    ],
    madhhabNote:
      "Qeexitaannada shahiidnimada goobta dagaalka, marxaladaha dhicista, iyo salaadda ilmo dhintay way kala duwan yihiin madhabka. Mawduucani wuxuu calaamadeeyaa arrimaha — ma aha fatwo.",
    disclaimer:
      "Xukummada gaarka ahi waa xasaasi. Xaqiiji caalim u qalma ama adeegga janaazada ee beeshaada ka hor intaadan ficilgelin.",
    actions: [
      "Ha maydhin shahiid goobta dagaalka oo ka soo horjeeda tilmaanta culimada.",
      "Weydii guddiga janaazada kiisaska dhicista ama ilmo dhintay.",
    ],
    hadith: [
      {
        excerpt:
          "Nebigu ﷺ wuxuu amray in shahiidiintii Uhud lagu aaso dhiiggooda, mana la maydhin.",
      },
      {
        excerpt:
          "Salaadda janaazada ayaa lagu tukadaa dhicista, waalidiintana waxaa loogu duceeyaa magfirad iyo naxariis.",
      },
    ],
  },
  {
    title: "Janazah maqnaansho",
    summary: "Nebigu ﷺ wuxuu u tukaday Negus markii jidhku fogaa.",
    body: [
      "Jaabir wuxuu wariyay in Nebigu ﷺ u soo baxay Saxaabadiisa, saf u dhigay, oo afar takbiir u yidhi Negus (al-Najaashi), boqorkii Xabashida ee dibadda ku dhintay (Saxiix al-Bukhaari 1334; Saxiix Muslim 952). Tani waa caddaynta ugu weyn ee Salaat al-Janazah ee maqnaanshaha (alā al-ghā'ib).",
      "Madhabyadu way kala duwan yihiin sida loo ballaariyo tusaalahan: qaar ayaa ku xaddida xaaladaha Negus oo kale (salaad muslim maxalli ah ma jirin), qaar kalena waxay u oggolaadaan si ka ballaaran marka jidhku fog yahay. Ha ka tagin Janazah maxalli ah marka jidhku joogo oo bulshadu tukadi karto. Raac caalim maxalli ah oo la aamini karo goorta salaadda maqnaanshuhu ku habboon tahay madhabkaaga.",
      "Qaabku waa isla salaadda afar-takbiir; niyaddu waa marxuumka maqan. Isticmaal isla ducooyinka saxda ah, beddel jinsiga marka loo baahdo.",
    ],
    madhhabNote:
      "Baaxadda Janazah maqnaanshaha waa khilaaf la yaqaan. Dooro dhaqanka imaamyada u qalma ee beeshaada.",
    actions: [
      "Tukada maxalli ah mar kasta oo jidhku joogo.",
      "Weydii ka hor intaadan abaabulin Janazah maqnaansho dhacdo dadweyne ahaan.",
    ],
    hadith: [
      {
        excerpt: "Nebigu ﷺ wuxuu u tukaday salaadda janaazada Negus oo yidhi afar takbiir.",
      },
      {
        excerpt:
          "Rasulkii Alle ﷺ wuxuu Saxaabada saf u dhigay oo u tukaday Negus, isagoo afar takbiir leh.",
      },
    ],
  },
  {
    title: "Sariirta dhimashada — ereyada ugu dambeeya",
    summary: "Si tartiib ah ugu xusuusi qofka dhimanaya la ilaha illallah.",
    body: [
      "Nebigu ﷺ wuxuu yidhi: 'Ku xusuusiya kuwa dhimanaya ee idiin ah inay dhaahaan la ilaha illallah' (Saxiix Muslim 916; Abuu Daawuud 3117). Hisnul Muslim wuxuu ilaaliyaa tilmaanta ah in qofkii ereyadiisa ugu dambeeya yihiin 'Ma jiro mid xaq u leh in la caabudo oo aan Alle ahayn' uu galo Jannada (hisn-153, Abuu Daawuud 3116).",
      "Si tartiib ah ugu xusuusi adigoon adkayn; ha qasbin hana murmin. Kuwa dhimashada u dhow waxaa sidoo kale lagu raaxayn karaa ereyo rajo oo sax ah oo Hisnul Muslim ku kaydsan (hisn-150–152). Xidh indhaha marka nafta la qaado oo isticmaal ducada xidhidda indhaha (mawduucii hore).",
      "Ka fogow baroor dheer iyo hadalka Alle ka cadhaysiiya. Reerka guriga ha dhaahaan wanaag, maxaa yeelay malaa'igtu waxay ku tidhaahdaan aamiin ereyadooda (Saxiix Muslim 920).",
    ],
    actions: [
      "Si tartiib ah ugu xusuusi qofka dhimanaya shahaadada.",
      "Qolka ka dhig mid deggan oo ku mashquulsan hadal wanaagsan.",
    ],
    hadith: [
      {
        excerpt: "Ku xusuusiya kuwa dhimanaya ee idiin ah inay dhaahaan: la ilaha illallah.",
      },
      {
        excerpt:
          "Qofkii ereyadiisa ugu dambeeya yihiin 'Ma jiro mid xaq u leh in la caabudo oo aan Alle ahayn' wuxuu galayaa Jannada.",
      },
    ],
    appLinks: [{ label: "Ducooyinka rajada nolosha" }, { label: "Xidhida indhaha" }],
  },
  {
    title: "Tacsiyada iyo kuwa murugada leh",
    summary: "Raaxeeya kuwa nool ducada masiibada ee nebiyadeed.",
    body: [
      "Umm Salamah waxay wariyay in Rasuulkii Alle ﷺ yidhi: 'Ma jiro muslim oo masiibo ku dhacdo oo markaas yidhaahda waxa Alle amray — \"Alle ayaan leennahay oo isaga ayaan ku noqonaynaa. Alleeyow, igu abaal mari masiibadayda oo ii beddel wax ka wanaagsan\" — laakiin Alle wuxuu u beddelayaa wax ka wanaagsan' (Saxiix Muslim 918). Hisnul Muslim wuxuu ilaaliyaa ereyadaan (hisn-154).",
      "Bixi tacsi ereyo kooban oo run ah; u diyaari qoyska marxuumka cunto halkii aad ugu culaysin lahayd martigelinta (Abuu Daawuud 3132 — warbixinta qoyska Jacfar). Ka fogow xafladaha bidcada ee maalin go'an oo caddayn la'aan iyadoo aad sii wadato duco gaar ah, sadaqo, iyo naxariis.",
      "Murugada ilmo leh waa la oggol yahay; baroor, dhabannada tumid, iyo dharka jeexid waa la mamnuucay. Ka caawi carmallada, agoonta, iyo kuwa ku tiirsan caawimo xalaal ah aaska ka dib.",
    ],
    actions: [
      "Baro kuwa murugada leh ducada masiibada.",
      "Ka caawi cunto iyo hawlo halkii aad ka sugi lahayd xaflad.",
      "Sii wad duco deggan iyo sadaqo marxuumka.",
    ],
    hadith: [
      {
        excerpt:
          "Ma jiro muslim oo masiibo ku dhacdo oo yidhaahda ereyada la amray ee Alle loogu noqdo oo weydiisto beddelka ka wanaagsan, laakiin Alle wuxuu u beddelayaa wax ka wanaagsan.",
      },
    ],
    appLinks: [{ label: "Yoolalka sadaqada" }],
  },
];
