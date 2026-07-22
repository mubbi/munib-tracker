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
];
