// Swahili translation overlay for the Learn "Prophets" content. Mirrors the order of
// its English source in ../prophets*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { ProphetsTimelineEvent, ProphetsTopic } from "../../types/prophets";
import type { DeepPartial } from "./localize";

export const PROPHETS_TOPICS_SW: DeepPartial<ProphetsTopic>[] = [
  {
    title: "Utangulizi kwa Manabii",
    summary: "Kwa nini Mwenyezi Mungu aliwatuma manabii na kwa nini hadithi zao ni muhimu sasa.",
    body: [
      "Mwenyezi Mungu aliwatuma manabii kama rehema, mwongozo, na uthibitisho ili watu waweze kumjua, kumwabudu kwa usahihi, na kuishi kwa haki na kusudi.",
      "Hadithi zao ndani ya Qur'ani si historia ya mbali tu; ni masomo ya vitendo kwa imani, subira, maisha ya familia, uongozi, na toba.",
      "Kuamini manabii wote ni sehemu ya iman. Waislamu wanawaheshimu wote, epuka kutia chumvi, na fuata ujumbe wa mwisho ulioletwa na Muhammad ﷺ.",
    ],
    quran: [
      {
        excerpt:
          "Mitume ni waletao bishara na waonyaji ili watu wasiwe na hoja juu ya Mwenyezi Mungu baada ya Mitume.",
      },
      {
        excerpt:
          "Hakika tulituma katika kila umma Mtume: Muabuduni Mwenyezi Mungu na muepuke miungu ya uwongo.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Mtume ni nini katika Uislamu?",
    summary: "Mwanaadamu mteule anayepokea wahyi na kuwalingania watu kwa Mwenyezi Mungu.",
    body: [
      "Nabii ni mwanadamu aliyechaguliwa na Mwenyezi Mungu kupokea wahyi na kuwaongoza watu kwenye tawhiyd, ibada na mwenendo mwema.",
      "Manabii sio wa Mungu na hawaabudiwi kamwe. Hao ndio viumbe bora katika utiifu, tabia, na uaminifu, huku wakibaki kuwa waja wa Mwenyezi Mungu.",
      "Dhamira yao ni moja katika msingi: Muabuduni Mwenyezi Mungu peke yake. Maelezo mahususi ya kisheria yanaweza kutofautiana katika jamii kwa hekima ya Mwenyezi Mungu.",
    ],
    quran: [
      {
        excerpt:
          "Mitume wao wakawaambia: Sisi si watu kama nyinyi, lakini Mwenyezi Mungu humfadhilisha amtakaye katika waja wake.",
      },
      {
        excerpt:
          "Hatukumtuma Mtume kabla yako ila tulimfunulia ya kwamba: Hapana mungu ila Mimi, basi niabuduni.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nabii dhidi ya Rasul",
    summary: "Tofauti ya manufaa katika elimu, wakati wote wawili ni manabii wanaoheshimiwa.",
    body: [
      "Katika usomi wa Kiislamu, tofauti ya kawaida ni kwamba kila rasul ni nabi, lakini sio kila nabii ni rasul. Rasuli mara nyingi hufafanuliwa kuwa ametumwa na mamlaka tofauti kwa watu, wakati nabi huendeleza mwongozo kwa njia ya wahyi.",
      "Kurani hutumia maneno yote mawili kwa heshima, na Waislamu wanaamini katika mitume na mitume wote bila kukataliwa na yeyote.",
      "Ufafanuzi kamili wa kiufundi unaweza kutofautiana kwa maneno ya kielimu, lakini somo la kivitendo ni thabiti: pokea wahyi kwa unyenyekevu na ufuate mwongozo wa Mwenyezi Mungu.",
    ],
    quran: [
      {
        excerpt: "Alichaguliwa, na alikuwa mjumbe na nabii.",
      },
      {
        excerpt: "Hatutafautishi baina ya yeyote katika Mitume wake.",
      },
    ],
    disclaimer:
      "Maelezo ya istilahi yanawasilishwa kwa njia pana, isiyoegemea upande wowote; wasiliana na walimu waliohitimu kwa uainishaji wa hali ya juu wa kitheolojia.",
    appLinks: [{}],
  },
  {
    title: "Adamu (AS)",
    summary:
      "Mwanadamu wa kwanza na nabii wa kwanza, aliheshimiwa kwa ujuzi na kujaribiwa kwa utii.",
    body: [
      "Adam (amani iwe juu yake) ndipo historia ya mwanadamu na utume huanzia. Mwenyezi Mungu alimuumba kwa mikono yake kutokana na udongo, akampulizia kutoka kwa roho yake, na akamfundisha majina ya kila kitu. Malaika walipoamrishwa kumsujudia Adam kwa heshima, walitii - lakini Iblis alikataa kwa kiburi, na tangu wakati huo uadui wake kwa Adam na kizazi chake ulitangazwa. Onyesho hili la ufunguzi linaweka drama kuu ya maisha ya kila mwanadamu: uchaguzi kati ya utiifu mnyenyekevu na uasi wa kiburi (Qur'ani 2:30–39).",
      "Mwenyezi Mungu alimweka Adam na mkewe Hawwa kwenye Pepo na akawaruhusu kila kitu isipokuwa mti mmoja tu. Walinong'onezwa na Shet'ani, wakala kutoka humo. Lakini tazama tafauti baina yao na Ibilisi: Ibilisi alihalalisha dhambi yake, hali Adam na Hawwa mara moja walijuta na wakarejea kwa Mwenyezi Mungu kwa maneno aliyowafundisha— ‘Mola wetu, tumejidhulumu nafsi zetu, na usipotusamehe na kuturehemu, bila shaka tutakuwa miongoni mwa wenye hasara’ (Qur’an 7:23). Mwenyezi Mungu akawakubalia toba yao na akawatuma duniani kwa ahadi ya uongofu kwa wote watakaofuata.",
      "Somo la Adam ni somo la matumaini: Mwanadamu anaheshimika na kustahiwa, lakini anajaribiwa na atateleza. Kinachobainisha muumini si kutokuwa na dhambi - ni Mwenyezi Mungu tu ndiye mkamilifu - bali ni kurejea haraka na kwa ikhlasi katika tawbah. Hadithi ya Adam pia inafundisha kwamba Shetani ni adui aliyetangazwa, aliye wazi ambaye silaha yake pekee ni kunong'ona; jawabu ni kumdhukuru Mwenyezi Mungu na kuomba msamaha wake. Tangu Adamu na kuendelea, kushuka duniani si adhabu bali ni hatua ya mtihani halisi wa wanadamu.",
    ],
    profile: {
      nation: "Ubinadamu wa mapema",
      location: "Jannah kisha ardhi",
      era: "Mwanzo wa historia ya mwanadamu",
      mission: "Wafundishe watu wa mwanzo tawhiyd na utiifu kwa Mwenyezi Mungu.",
      challenges: [
        "uadui wa Iblis",
        "Maisha baada ya kushuka duniani",
        "Kuongoza familia ya kwanza ya kibinadamu",
      ],
      miracles: [
        "Uumbaji kwa amri ya Mwenyezi Mungu bila wazazi",
        "Kufundishwa majina ya vitu vyote",
      ],
      majorEvents: [
        "Uumbaji wa Adamu na mafundisho ya majina",
        "Kusujudu kwa Malaika na kukataa kwa Iblis",
        "Kuteleza katika Pepo, toba ya kweli, na kushuka duniani",
      ],
      lessons: [
        "Heshima ya mwanadamu inakuja pamoja na wajibu",
        "Toba ya dhati hufungua tena mlango baada ya kosa lolote",
        "Shetani ni adui aliye wazi na wa kudumu",
      ],
      facts: [
        "Adamu ndiye mwanadamu wa kwanza na nabii wa kwanza",
        "Toba yake ni kielelezo cha kwanza cha Qur'ani Tukufu cha tawbah",
      ],
    },
    quran: [
      {
        excerpt:
          "Na (mtaje) Mola wako Mlezi alipo waambia Malaika: Nitaweka katika ardhi mamlaka yenye kufuatana... Kisha Adam akapokea maneno kutoka kwa Mola wake Mlezi, na akakubali toba yake.",
      },
      {
        excerpt:
          "Wakasema: Mola wetu Mlezi tumejidhulumu nafsi zetu, na usipotusamehe na ukaturehemu, bila shaka tutakuwa miongoni mwa walio khasiri.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Siku ya Kiyama watu watamjia Adam na kusema: Wewe ni baba wa watu; tuombee kwa Mola wako Mlezi.",
      },
      {
        excerpt:
          "Adam na Musa walibishana. Musa akasema: Wewe ndiye ambaye Mwenyezi Mungu amekuumba kwa mkono wake. Adam akasema: Je, unanilaumu kwa jambo ambalo Mwenyezi Mungu aliniandikia kabla ya kuniumba? Basi Adam akamshinda Musa katika hoja.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Idris (AS)",
    summary:
      "Nabii mkweli aliyesifiwa kwa subira na kupandishwa na Mwenyezi Mungu kwenye daraja la juu.",
    body: [
      "Idris (amani iwe juu yake) ametajwa kwa ufupi tu ndani ya Qur-aan, lakini kila neno juu yake ni sifa. Mwenyezi Mungu anamwita ‘mtu wa kweli, Nabii’ (Qur’ani 19:56) na anamuorodhesha miongoni mwa wenye subira na wema pamoja na Ismail na Dhul-Kifl (Qur’ani 21:85–86). Hadithi yake inaonyesha kwamba mbele ya Mwenyezi Mungu, tabia ya mtu - ukweli, subira, ibada thabiti - ni muhimu zaidi kuliko urefu wa wasifu wake.",
      "Mwenyezi Mungu anasema juu yake, ‘Na tukampandisha daraja’ (Qur’ani 19:57). Wanachuoni wamelielewa hili kwa kurejea cheo chake kilichotukuka mbele ya Mwenyezi Mungu. Zaidi ya yale ambayo Qur’ani na ripoti sahihi zinathibitisha, ngano maarufu zilizoambatanishwa na Idris (kama vile kuwa wa kwanza kuandika kwa kalamu au taaluma mahususi za kidunia) hazithibitishwi kwa ushahidi wa kweli, hivyo muumini makini hushikamana na yale yanayothibitisha wahyi badala ya kuyapamba.",
      "Funzo la Idris ni kwamba ukaribu na Mwenyezi Mungu haupimwi kwa umaarufu au hadithi ndefu, bali kwa ikhlasi na uthabiti. Mja mtulivu, mkweli na dhabiti anaweza kushikilia nafasi mbele ya Mwenyezi Mungu kuliko wengi ambao historia inakumbuka kwa sauti kubwa.",
    ],
    profile: {
      era: "Vizazi vya mwanzo baada ya Adamu",
      mission: "Waite watu wamwabudu Mwenyezi Mungu kwa ukweli na uadilifu.",
      lessons: [
        "Ukweli huinua cheo cha mja",
        "Sio kila hadithi ya nabii ina maelezo ya kina - na hiyo ni kwa kubuni",
        "Uthabiti, uthabiti wa uaminifu unapendwa na Mwenyezi Mungu",
      ],
      facts: [
        "Ametajwa katika Qur'ani kuwa ni mkweli na nabii",
        "Imefafanuliwa kama kuinuliwa kwenye daraja la juu na Mwenyezi Mungu",
      ],
    },
    quran: [
      {
        excerpt:
          "Na mtaje katika Kitabu Idris. Hakika yeye alikuwa mtu wa kweli na Nabii. Na tukampandisha daraja.",
      },
      {
        excerpt:
          "Na Ismail na Idris na Dhul-Kifl - wote walikuwa miongoni mwa wenye subira. Na tukawaingiza katika rehema yetu; Hakika hao walikuwa miongoni mwa watu wema.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nuh (AS)",
    summary:
      "Mjumbe wa subira ya ajabu ambaye aliwaita watu wake kwa karne nyingi kabla ya gharika.",
    body: [
      "Nuh (Swalla Allaahu 'alayhi wa aalihi wa sallam) alitumwa kwa watu walioacha tawhiyd na kuabudu masanamu. Ujumbe wake mmoja usiotetereka ulikuwa: 'Enyi watu wangu, mwabuduni Mwenyezi Mungu; nyinyi hamna mungu ila Yeye.” (Qur’ani 7:59). Qur'ani Tukufu inahifadhi maelezo yake ya utume katika Surah Nuh: aliwaita usiku na mchana, hadharani na kwa siri, akiwahimiza na kuwaonya - akiwakumbusha kwamba kurudi kwa Mwenyezi Mungu kunaleta mvua, mali, watoto na bustani. Lakini kizazi baada ya kizazi, wengi walikengeuka, wakaweka vidole vyao masikioni mwao, na wakazidi kuwa na kiburi (Kurani 71:1–28).",
      "Qur'ani inasisitiza urefu kamili wa subira yake: alibaki miongoni mwao 'miaka elfu chini ya hamsini' (Qur'ani 29:14), na bado wachache tu waliamini. Ilipodhihirika kuwa hakuna imani tena, Mwenyezi Mungu alimuamuru kujenga safina chini ya maelekezo ya Mwenyezi Mungu huku makafiri wakifanya mzaha. Kisha maji ya gharika yakaja kama hukumu. Mtoto wa Nuh mwenyewe alikataa kupanda ndege, akiuamini mlima juu ya onyo la baba yake, na alikuwa miongoni mwa wale waliokufa maji - ukumbusho wa kutoboa kwamba uhusiano wa damu hauwezi kuchukua nafasi ya imani (Qur'ani 11:42-46).",
      "Hadithi ya Nuh ni daraja kuu la Qur'ani katika da'wah: wajibu wa mlinganiaji ni ikhlasi, subira, utoaji wa wazi - matokeo ni ya Mwenyezi Mungu peke yake. Pia inafundisha kwamba mwongozo ni suala la moyo, si ukoo: mwana wa nabii anaweza kupotea, wakati wageni wanaweza kuokolewa. Waumini walioingia kwenye safina wakawa mbegu ya ubinadamu upya, na Nuh anaheshimiwa kama mmoja wa wajumbe watano wakubwa wa azimio thabiti (ulul-'azm).",
    ],
    profile: {
      nation: "Watu wake kabla ya gharika",
      location: "Mkoa wa Kale wa Mesopotamia (imetajwa kwa mapana)",
      era: "Zamani mapema sana",
      mission: "Waite watu wake kwenye tawhiyd na toba.",
      challenges: [
        "Kejeli kutoka kwa viongozi na wasomi",
        "Karne nyingi za kukataliwa na waumini wachache",
        "Kutokuamini na kuzama kwa mwanawe mwenyewe",
      ],
      miracles: ["Safina iliyojengwa kwa maagizo ya kimungu", "Wokovu wa waumini kupitia gharika"],
      majorEvents: [
        "Wito wa tawhiyd unaodumu kwa takriban miaka elfu moja",
        "Ujenzi wa jahazi kwa amri ya Mwenyezi Mungu",
        "Gharika na mwanzo mpya kwa waumini",
      ],
      lessons: [
        "Kudumu katika daawa, na kumwachia Mwenyezi Mungu matokeo",
        "Mahusiano ya familia hayawezi kuchukua nafasi ya imani",
        "Mwenyezi Mungu huwaokoa wenye ikhlasi",
      ],
      facts: [
        "Mmoja wa wajumbe watano wa azimio thabiti (ulul-'azm)",
        "Hadithi yake inaonekana katika surah nyingi, ikiwa ni pamoja na moja iliyopewa jina lake",
      ],
    },
    quran: [
      {
        excerpt:
          "Na akateremshiwa Nuh kuwa hataamini katika watu wako ila wale waliokwisha amini, basi usihuzunike kwa yale waliyokuwa wakiyafanya.",
      },
      {
        excerpt:
          "Akasema: Mola wangu Mlezi, hakika mimi niliwaita watu wangu usiku na mchana, lakini mwito wangu haukuwazidishia kukimbia.",
      },
    ],
    hadith: [
      {
        excerpt: "Watu watamjia Nuh na kusema: Ewe Nuhu! utuombee.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Hud (AS)",
    summary: "Imetumwa kwa A'ad, watu wenye nguvu na wasimamizi wanaogeuza nguvu zao kuwa kiburi.",
    body: [
      "Hud (amani iwe juu yake) alitumwa kwa watu wa Ad, ustaarabu ambao Qur'ani inaueleza kuwa wenye nguvu za kimwili na maarufu kwa kujenga majengo marefu na ya kifahari 'ambayo mfano wake haujapata kuumbwa katika ardhi' (Qur'ani 89:6-8). Kwa watu hawa wenye kiburi, Hud alileta ujumbe sawa na kila Mtume: 'Enyi watu wangu, mwabuduni Mwenyezi Mungu; huna mungu ila Yeye. Je! hamtamwogopa? (Kurani 7:65). Alikuwa mmoja wao, asiyeomba malipo, ila akiwaita kwenye shukrani na mbali na dhuluma.",
      "Viongozi wao wakajibu kwa dhihaka, wakimshtaki kwa upumbavu na uwongo, akishikamana na sanamu za baba zao. Walimpa changamoto ya kuleta adhabu aliyoonya, wakiwa na uhakika kwamba hakuna nguvu inayoweza kuendana na nguvu zao (Kurani 46:21–25). Hud aliwaonya waziwazi kwamba uwezo wa dunia na ustaarabu mkubwa haumlinde yeyote ambaye anazikanusha Ishara za Mwenyezi Mungu na kufanya kiburi juu ya ardhi.",
      "Hukumu ilikuja kama upepo mkali wa kuunguruma ambao Mwenyezi Mungu ‘aliweka juu yao kwa mikesha saba na siku nane mfululizo’ (Qur’ani 69:6–7), na kuwaacha watu waliokuwa wenye nguvu wakiwa wameanguka kama vigogo watupu — huku Hud na waumini wakiokolewa kwa rehema ya Mwenyezi Mungu. Hadithi ya Ad inarudiwa katika Qur'ani yote kama onyo la kudumu: nguvu, mali, na mafanikio ni zawadi zinazopaswa kupatikana kwa unyenyekevu na shukrani, na sio kiburi. Umma unawajibika kwa Mwenyezi Mungu hata ukiwa umeendelea kiasi gani.",
    ],
    profile: {
      nation: "Watu wa 'Ad",
      location: "Eneo la Al-Ahqaf (eneo la kusini mwa Arabia katika tafsir ya kitambo)",
      era: "Baada ya Nuh",
      mission: "Rejesha Tawhiyd, shukurani na uadilifu baina ya A'ad.",
      challenges: [
        "Jeuri ya pamoja iliyojengwa juu ya nguvu na mali",
        "Mzaha wa wahyi na mtume",
        "Mahitaji ya dharau ya adhabu ya haraka",
      ],
      miracles: ["Ulinzi wa Waumini wakati wa adhabu"],
      majorEvents: [
        "Wito wa toba na shukrani",
        "Onyo la upepo mkali",
        "Kuangamizwa kwa A'ad kwa siku saba na siku nane",
      ],
      lessons: [
        "Nguvu bila unyenyekevu husababisha uharibifu",
        "Mataifa na ustaarabu unawajibika kwa Mwenyezi Mungu",
        "Maonyo ya kinabii ni rehema iliyotumwa kabla ya hukumu",
      ],
      facts: ["Hadithi ya Ad inajirudia katika Qur'ani yote kama onyo kwa jumuiya za baadae"],
    },
    quran: [
      {
        excerpt:
          "Na kwa kina A'di tulimtuma ndugu yao Hud. Akasema: Enyi watu wangu! huna mungu ila Yeye. Je, hamtamwogopa?",
      },
      {
        excerpt:
          "Basi walipo liona wingu linakaribia mabonde yao, walisema: Hili ni wingu linalotuletea mvua! Bali ni yale mliyo kuwa mkiyavumilia, na upepo ndani yake ni adhabu chungu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Salih (AS)",
    summary:
      "Walitumwa kwa Thamud, ambao walipewa muujiza wa ngamia jike na wakaharibu ishara waliyoitaka.",
    body: [
      "Saleh (Swalla Allaahu ´alayhi wa sallam) alitumwa kwa Thamud, watu waliofuata baada ya A’ad na walikuwa mashuhuri kwa kuchonga majumba makubwa milimani na kuishi kwa starehe (Qur’ani 7:74). Aliwaita kama ndugu yao wamuabudu Mwenyezi Mungu peke yake na waache ufisadi wa viongozi wao. Walipotaka ishara ya kuthibitisha ukweli wake, Mwenyezi Mungu akaweka wazi na hadharani: ngamia jike mwenye mpangilio maalumu wa kumnywesha siku moja na wao siku nyengine (Qur'ani 26:155-156).",
      "Saleh aliwaonya kwa uwazi: “Msimguse kwa ubaya, msije mkashikwa na adhabu iliyo karibu.” (Qur’ani 26:156). Ishara ilikuwa mtihani wa kujizuia - je wangeweza kuheshimu mpaka uliowekwa na Mwenyezi Mungu? Lakini walio waasi zaidi miongoni mwao walimkata msuli na kumuua ngamia jike katika maasi ya wazi, kisha wakampa changamoto Saleh kuleta adhabu iliyoahidiwa (Qur'ani 7:77). Kuuawa kwa ngamia kunatajwa kuwa ni kitendo cha wanyonge wachache, lakini watu wote walishiriki uhalifu huo kwa kuridhia.",
      "Ikawapata adhabu katika muda wa siku tatu. Mlipuko mkubwa na tetemeko la ardhi likawashika majumbani mwao, na Thamudi wakawa wamelala bila uhai, na Mwenyezi Mungu akamuokoa Saleh na walioamini (Qur'ani 7:78-79; 91:14). Somo ni kali: miujiza hailainisha moyo mkaidi; wanainua tu vigingi vya uwajibikaji. Ishara iliyoombwa kisha ikapuuzwa inakuwa ni hoja dhidi ya walioidai. Na kunyamaza mbele ya uovu sio kutoegemea upande wowote - taifa zima liliwajibika kwa kitendo cha wachache.",
    ],
    profile: {
      nation: "Watu wa Thamud",
      location: "Al-Hijr / kaskazini magharibi mwa Arabia",
      era: "Baada ya 'Ad",
      mission: "Waite Thamud kutoka katika ushirikina na ufisadi kwenye tawhiyd.",
      challenges: [
        "Mahitaji ya muujiza, kisha kuukataa",
        "Uasi wazi baada ya ishara wazi kutolewa",
        "Vitisho dhidi ya Saleh na Waumini",
      ],
      miracles: ["Ngamia jike alitumwa kuwa ni Ishara itokayo kwa Mwenyezi Mungu"],
      majorEvents: [
        "Kuonekana kwa ngamia-jike na maji ya pamoja",
        "Kunyongwa na kuuawa kwa ngamia-jike",
        "Mlipuko uliowaangamiza waliokataa",
      ],
      lessons: [
        "Miujiza hainufaishi moyo mkaidi",
        "Kuvunja mpaka uliowekwa na Mwenyezi Mungu hubeba matokeo ya kweli",
        "Kukubali uovu kunashiriki katika hatia yake",
      ],
      facts: ["Thamud walijulikana kwa kuchonga nyumba za kifahari kwenye milima"],
    },
    quran: [
      {
        excerpt:
          "Huyu ni ngamia wa Mwenyezi Mungu kuwa ni Ishara kwenu, basi mwacheni ale katika ardhi ya Mwenyezi Mungu, wala msimguse kwa madhara, isije ikakushikeni adhabu chungu.",
      },
      {
        excerpt:
          "Thamud walikanusha kwa sababu ya uasi wao, alipo tumwa mnyonge zaidi wao... Basi Mola wao Mlezi akawateremshia maangamizi kwa dhambi zao na akawasawazisha.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ibrahim (AS)",
    summary:
      "Khalilullah, rafiki wa Mwenyezi Mungu na kigezo cha tawhidi safi, aliyejaribiwa na kushinda katika kila mtihani.",
    body: [
      "Ibrahim (amani iwe juu yake) ndiye kielelezo kikuu cha Qur'ani Tukufu cha tauhidi safi iliyofikiwa kwa kutafakari na ujasiri. Akiwa kijana katika jamii iliyozama katika ibada ya sanamu, alisababu waziwazi na watu wake, baba yake, na hata mfalme: jua, mwezi, na nyota vyote vinatua na kufifia, hivyo vingewezaje kuwa miungu? (Qur’ani 6:75–79). Ili kufichua kutokuwa na nguvu kwa masanamu hayo, aliyavunja yote isipokuwa makubwa zaidi na kuwaambia watu wake waulize masanamu wenyewe kilichotokea - kuwalazimisha kukiri miungu yao haiwezi kusema wala kujitetea (Qur'ani 21:57-67).",
      "Kwa ajili ya kisimamo hiki alitupwa kwenye moto mkali, lakini Mwenyezi Mungu akaamuru, ‘Ewe moto, kuwa baridi na usalama juu ya Ibrahim’ (Qur’ani 21:69), na akatoka bila kudhurika. Maisha yake yakawa ni mlolongo wa mitihani iliyokumbana na kujisalimisha kabisa: aliiacha nchi yake kwa ajili ya Mwenyezi Mungu, akaswali kizazi chenye haki katika uzee na akapewa Ismail na Is-haq, alijaribiwa kwa amri ya kumchinja mwanawe kipenzi - ambayo baba na mwana waliikubali kwa kunyenyekea mbele ya Mwenyezi Mungu kumkomboa kijana - na akainua misingi ya Ka'abah miongoni mwa waumini wa Makka na kutumwa kwa Ismaili Makka. yao (Qur’ani 2:124–129; 37:100–107).",
      "Kwa sababu ya ibada hii isiyo na kifani, Mwenyezi Mungu alimchukua Ibrahim kama khalil - rafiki wa karibu (Qur'ani 4:125) - na akamfanya imamu, kiongozi wa wanadamu wote (Qur'ani 2:124). Urithi wake unapitia kwa Mitume waliotoka katika ukoo wake, kupitia ibada za Hijja, na kupitia utambulisho wa Mwislamu, ambaye ameamrishwa kufuata 'Dini ya Ibrahim, akielekea kwenye ukweli' (Qur'ani 3:95). Hadithi yake inafunza tawakkul katika mitihani migumu zaidi, kwamba uongozi wa kweli umejengwa juu ya dhabihu, na kwamba imani ya kweli inaweza kuunda upya vizazi vizima.",
    ],
    profile: {
      nation: "Jamii za Mesopotamia na Levantine",
      location: "Iraki, Mtukufu na Makka",
      era: "Zamani za kati",
      mission: "Ihuisha tawhiyd safi na uweke urithi wa kudumu wa utii.",
      challenges: [
        "Akikabiliana na waabudu masanamu, baba yake mwenyewe, na mfalme dhalimu",
        "Kuhama kutoka katika nchi yake kwa ajili ya Mwenyezi Mungu",
        "Kesi ya kumtoa mwanawe mpendwa",
      ],
      miracles: [
        "Moto ulifanya baridi na salama kwa amri ya Mwenyezi Mungu",
        "Uzao wa haki hutolewa katika uzee",
      ],
      majorEvents: [
        "Kujadiliana na kuvunja masanamu",
        "Kutupwa motoni na kutolewa",
        "Kujenga Al-Ka'bah pamoja na Ismail na mtihani mkubwa wa kafara",
      ],
      lessons: [
        "Tawakkul (kumtegemea Mwenyezi Mungu) katika mitihani mikali zaidi",
        "Uongozi wa kweli unahitaji dhabihu",
        "Imani ya dhati inaweza kuunda upya vizazi",
      ],
      facts: [
        "Anajulikana kama Khalilullah, rafiki wa karibu wa Mwenyezi Mungu",
        "Babu wa Mitume kupitia Ismail na Ishaq",
      ],
    },
    quran: [
      {
        excerpt:
          "Na pale Ibrahim alipo jaribiwa na Mola wake Mlezi kwa maamrisho na akazitekeleza. Akasema: Hakika mimi nitakufanya kiongozi kwa watu.",
      },
      {
        excerpt:
          "Tukasema: Ewe moto, kuwa baridi na salama juu ya Ibrahim. Na walimtakia mabaya, lakini tukawafanya wao ndio wenye hasara kubwa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Utakusanywa bila viatu, uchi, na bila kutahiriwa. Wa kwanza kuvikwa nguo Siku ya Kiyama atakuwa Ibrahim.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Lut (AS)",
    summary:
      "Nabii ambaye aliwaonya watu wake dhidi ya uasherati mkubwa ambao hakuna taifa lililofanya kabla yao.",
    body: [
      "Lut (amani iwe juu yake) alikuwa ni mtu wa zama na jamaa wa Ibrahim ambaye alihama pamoja naye na kisha akatumwa kwa watu wa Sodoma na miji ya karibu. Sambamba na mwito wa kumwabudu Mwenyezi Mungu peke yake, watu wake walikuwa na hatia ya uasherati usio na haya Qur’ani inasema ‘hakuna yeyote katika walimwengu wote aliyefanya kabla’—kuwaendea wanaume badala ya wanawake, na kufanya mambo machafu waziwazi katika mikusanyiko yao (Qur’ani 7:80–81; 29:28–29). Lut'i akawaita, kwa ikhlasi, kwenye usafi na kwenye mipaka ya asili aliyoiweka Mwenyezi Mungu.",
      "Walikutana na mageuzi yake si kwa mabishano bali kwa uadui, wakitishia kumfukuza na kudhihaki wito wake wa adabu: 'Wafukuzeni katika mji wenu; hao ni watu wanaojiweka safi! (Qur’ani 7:82). Hata ndani ya nyumba yake mtihani ulikuwa mkubwa - mke wake alikuwa upande wa mafisadi na hakuamini, akithibitisha tena kwamba uwongofu umetolewa na Mwenyezi Mungu na haurithiwi kwa ndoa au damu (Qur'ani 66:10).",
      "Ilipokuja amri, Mwenyezi Mungu aliwatuma Malaika katika sura ya wageni. Watu wakakimbilia kuwadhuru, na Lut'i alijiona hana uwezo mpaka Malaika wakadhihirisha utambulisho wao na wakamwambia aondoke na Waumini usiku. Kulipopambazuka miji ilipinduliwa na kurushwa kwa mawe (Qur’ani 11:77–83). Hadithi ya Lut ni onyo la wazi kwamba ukweli wa kimaadili haubadiliki kwa sababu jamii inakubali dhambi na kuifanya kuwa ya kawaida hadharani - na kwamba Mwenyezi Mungu huwaokoa waaminifu, hata wawe wachache.",
    ],
    profile: {
      nation: "Watu wa Sodoma na miji ya jirani",
      location: "Mkoa wa Bahari ya Chumvi (imetajwa kwa mapana)",
      era: "Wakati wa Ibrahim",
      mission: "Waite watu wake kutokana na uchafu ulio wazi na ukafiri kwenye tawhiyd na usafi.",
      challenges: [
        "Uasherati ulioimarishwa kwa umma",
        "Kejeli na vitisho vya kufukuzwa",
        "Kutokuamini kwa mke wake mwenyewe",
      ],
      majorEvents: [
        "Maonyo ya kudumu dhidi ya uchafu",
        "Ziara ya Malaika waliojigeuza kuwa wageni",
        "Kupinduliwa kwa miji",
      ],
      lessons: [
        "Ukweli wa maadili haubadiliki kwa idhini ya kijamii",
        "Waumini wanaweza kuwa wachache sana",
        "Mwenyezi Mungu huwaokoa wanyoofu na maangamizo ya pamoja",
      ],
      facts: ["Jamaa wa Ibrahim ambaye alihama pamoja naye na kupelekwa Sodoma"],
    },
    quran: [
      {
        excerpt:
          "Je, mnawaendea wanaume katika walimwengu na mnaacha alivyo kuumbieni Mola wenu Mlezi? Bali nyinyi ni watu wapotovu.",
      },
      {
        excerpt:
          "Basi ilipo fika amri yetu tuliifanya sehemu ya juu ya miji kuwa chini kabisa, na tukawanyeshea mvua ya mawe ya udongo mgumu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ismail (AS)",
    summary:
      "Nabii mwaminifu kwa neno lake, mvumilivu katika majaribio, na mjenzi wa Al Kaaba pamoja na baba yake Ibrahim.",
    body: [
      "Ismail (rehema na amani ziwe juu yake) alikuwa mtoto wa kwanza wa Ibrahim, aliyepewa katika uzee. Maisha yake yalianza na mtihani mkubwa wa kuaminiana: kwa amri ya Mwenyezi Mungu, Ibrahim alimwacha mtoto Ismail na mama yake Hajar kwenye bonde tasa la Makka, ambako hakukuwa na mazao na hakuna maji yanayotiririka. Ilikuwa hapo, wakati Hajar akikimbia kutafuta maji kati ya vilima vya Safa na Marwah, ndipo Mwenyezi Mungu aliposababisha chemchemi ya Zamzam kutiririka - kitendo cha riziki ambacho kizazi cha Hajar na kila hujaji wanakiigiza katika sa'i ya Hija na Umra hadi leo.",
      "Akiwa kijana, Ismail alikutana na mtihani mkubwa zaidi akiwa pamoja na baba yake: Ibrahim alipomwambia juu ya njozi ya kumchinja, Ismail alijibu kwa utii wa kustaajabisha, 'Ewe baba yangu, fanya kama unavyoamrishwa; Mtanikuta Mwenyezi Mungu akipenda ni miongoni mwa wanaosubiri.” (Qur’ani 37:102). Wote wawili wakasalimu amri, na Mwenyezi Mungu akamkomboa Ismail kwa dhabihu kubwa, akiheshimu utii wao milele. Baba na mwana kisha wakainua misingi ya Al-Ka'bah pamoja, wakiomba, 'Mola wetu, tukubalie haya; Hakika Wewe ni Mwenye kusikia, Mjuzi” (Qur’ani 2:127).",
      "Qur'ani Tukufu inajumlisha tabia yake katika mstari unaostahili kukariri: 'Alikuwa mkweli wa ahadi yake, na alikuwa Mtume na Nabii. Alikuwa akiwaamrisha jamaa zake kuswali na zaka, na alikuwa akimridhia Mola wake Mlezi” (Qur’ani 19:54–55). Maisha ya Ismail yanafunza uzuri wa kushika neno lako, wa ibada thabiti, na wa familia kushirikiana katika kumtii Mwenyezi Mungu. Kupitia yeye, unabii wa Uarabuni hatimaye ulimfikia Mtume wa mwisho, Muhammad ﷺ.",
    ],
    profile: {
      nation: "Watu wa mwanzo wa eneo la Makka",
      location: "Makka",
      era: "Baada ya kuhama kwa Ibrahim",
      mission: "Shika Tawhiyd na ́ibaadah, na uwaamrishe jamaa zake kuswali na zaka.",
      challenges: [
        "Mwanzo mbaya wa maisha katika bonde lisilo na matunda",
        "Kesi ya dhabihu",
        "Kudumisha maisha yanayotegemea ibada na amana takatifu",
      ],
      miracles: [
        "Chemchemi ya Zamzam ilitolewa jangwani",
        "Kukombolewa kutokana na kafara na Mwenyezi Mungu",
      ],
      majorEvents: [
        "Akaondoka na mama yake Hajar katika bonde la Makka",
        "Kesi ya dhabihu, ilikutana na utii kamili",
        "Kujenga Al-Ka'bah pamoja na Ibrahim",
      ],
      lessons: [
        "Timiza ahadi zako kwa uaminifu",
        "Familia inaweza kushirikiana katika ibada na utii",
        "Urithi mtakatifu unadai tabia dhabiti",
      ],
      facts: [
        "Imefafanuliwa ndani ya Qur'ani kuwa ni kweli kwa ahadi yake",
        "Babu wa makabila ya Waarabu na mstari wa mwisho wa kinabii",
      ],
    },
    quran: [
      {
        excerpt:
          "Na mtaje katika Kitabu Ismail. Hakika yeye alikuwa mkweli katika ahadi yake, na alikuwa ni Mtume na Nabii. Alikuwa akiwaamrisha jamaa zake kuswali na zaka, na alikuwa akimridhia Mola wake Mlezi.",
      },
      {
        excerpt:
          "Na Ibrahim alipo simamisha misingi ya Nyumba na Ismail, wakaomba: Mola wetu Mlezi, tukubalie haya. Hakika Wewe ni Mwenye kusikia, Mjuzi.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Ishaq (AS)",
    summary: "Nabii aliyebarikiwa aliyetolewa kama bishara kwa Ibrahim na baba yake Ya'qub.",
    body: [
      "Is-haq (amani iwe juu yake) alizaliwa kwa Ibrahim na mkewe Sara katika uzee wao - kuzaliwa kulikotangazwa na Malaika kama bishara njema pale Sara alipopita umri wa kuzaa, alicheka kwa mshangao. Qur'ani inaandika tukio hili: 'Tulimpa bishara ya Ishaq na, baada ya Ishaq, Ya'qub' (Qur'ani 11:71). Kuzaliwa kwake kulikuwa ni ishara kwamba uwezo na rehema za Mwenyezi Mungu hazifungwi na mipaka ya kawaida ya mwanadamu, na faraja kwa kila muumini anayengojea tumaini gumu.",
      "Kurani mara kwa mara inamtaja Ishaq miongoni mwa manabii waadilifu, wateule, na watukufu, ikimwelezea yeye na Ya'qub kuwa walipewa 'nguvu katika ibada na maono' (Qur'ani 38:45–47). Kupitia kwa Ishaq alikuja Ya'qub (Isra'il), na kutoka kwa Ya'qub walishuka msururu mrefu wa manabii waliotumwa kwa Bani Isra'il - hivi kwamba Ishaq anasimama kama baba wa unabii, kiungo katika mwendelezo wa mwongozo katika vizazi vyote.",
      "Hadithi yake, ingawa imesimuliwa kwa ufupi, ina mafunzo mawili ya kudumu: shukrani kwa ajili ya zawadi ambazo Mwenyezi Mungu hutoa zaidi ya matarajio yetu, na ufahamu kwamba ukoo wa haki ni amana - imani lazima ipitishwe, si kurithi tu. Baraka iliyowekwa katika nyumba ya Ibrahim ilihifadhiwa kwa sababu ilibebwa na waja waliojitolea kwa Mwenyezi Mungu.",
    ],
    profile: {
      nation: "Jumuiya za Levantine",
      location: "The Levant (Sham)",
      era: "Baada ya Ibrahim",
      mission: "Endelea mwongozo wa kinabii katika ukoo uliobarikiwa wa Ibrahim.",
      miracles: ["Kuzaliwa kutangazwa kwa wazazi wazee kama habari njema"],
      majorEvents: [
        "bishara njema waliyopewa Ibrahim na Sara",
        "Muendelezo wa nasaba ya unabii kupitia kwa Ya'qub",
      ],
      lessons: [
        "Mwenyezi Mungu hutoa zaidi ya matarajio ya mwanadamu",
        "Ukoo wa haki ni uaminifu unaopaswa kuhifadhiwa",
        "Kufuatana kwa uaminifu huweka mwongozo hai",
      ],
      facts: ["Baba wa Ya'qub", "Imetajwa pamoja na Ibrahim na Ya'qub kama familia iliyochaguliwa"],
    },
    quran: [
      {
        excerpt:
          "Na mkewe alikuwa amesimama, naye akacheka. Kisha tukampa bishara ya Is-haq, na baada ya Is-haq, Yaaqub.",
      },
      {
        excerpt:
          "Na wakumbuke waja wetu Ibrahim na Is-haq na Yaaqub, wenye nguvu na wenye kuona. Hakika Sisi tuliwateua kwa ubora wa kipekee: ukumbusho wa Nyumba.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ya'qub (AS)",
    summary:
      "Pia anaitwa Isra'il, nabii ambaye subira yake nzuri kupitia huzuni ni mfano wa kumtegemea Mwenyezi Mungu bila kuyumba.",
    body: [
      "Ya'qub (amani iwe juu yake), anayeitwa pia Isra'il, alikuwa mtoto wa Is-haq na baba wa wale kumi na wawili ambao walikuja kuwa makabila ya Bani Isra'il - akiwemo Yusuf. Aliwalea watoto wake juu ya tawhiyd, na Qur’ani inahifadhi ahadi aliyoichukua kutoka kwao kwenye kitanda chake cha kufa: ‘Mtaabudu nini baada yangu? Wakajibu, ‘Tutamuabudu Mungu wako na Mungu wa baba zako... Mungu mmoja, na Kwake tunasilimu’ (Qur’ani 2:132–133). Hangaiko lake kuu, hadi mwisho kabisa, lilikuwa imani ya kizazi kijacho.",
      "Mtihani wake mkubwa unajitokeza ndani ya kisa cha Yusuf. Wanawe waliporudi na kanzu ya Yusuf na madai ya uwongo kwamba mbwa-mwitu amemla, Yaaqub aliona udanganyifu huo na hakujibu kwa hasira bali kwa kujizuia: “Basi subira inafaa zaidi, na Mwenyezi Mungu ndiye anayeombwa msaada wake juu ya hayo mnayoyaeleza” (Qur’ani 12:18). Kwa miaka mingi ya kutengana alihuzunika hadi, kama vile Qur'ani inavyosema kwa uchungu, macho yake yakabadilika kuwa meupe kutokana na huzuni - lakini aliizuia huzuni yake na kamwe hakukata tamaa (Qur'ani 12:84).",
      "Moyo wa mfano wa Ya'qub ni sentensi moja: 'Usikate tamaa na rehema ya Mwenyezi Mungu; Hakika hawakati tamaa na rehema ya Mwenyezi Mungu isipokuwa watu makafiri.” (Qur’ani 12:87). Yeye ndiye kielelezo cha sabr jamil - subira nzuri - ambayo si kujiuzulu tu bali ni matumaini yenye matumaini kwamba hekima ya Mwenyezi Mungu itadhihirika kwa wakati wake. Hatimaye Yusuf aliporejeshwa kwake na macho yake yakarejea, subira hiyo ilithibitishwa. Ya'qub anamfundisha kila muumini mwenye kuhuzunika kushikilia huzuni na yakini katika moyo mmoja.",
    ],
    profile: {
      nation: "Asili ya Bani Israil",
      location: "Levant, pamoja na kuhamia Misri",
      era: "Kizazi cha Yusuf",
      mission: "Waongoze watu wa nyumbani mwake na kizazi chake katika tawhiyd.",
      challenges: [
        "Mivutano na wivu miongoni mwa wanawe",
        "Kutengana kwa muda mrefu na Yusuf",
        "Kuvumilia huzuni kubwa bila kukata tamaa",
      ],
      majorEvents: [
        "Nasaha na agano lake la tawhiyd kwa wanawe",
        "Miaka mingi ya huzuni ya subira juu ya Yusuf",
        "Kukutana tena kwa furaha na Yusuf huko Misri",
      ],
      lessons: [
        "Uvumilivu mzuri (sabr jamil) ni imani hai, yenye matumaini",
        "Wazazi huunda urithi wa imani wa watoto wao",
        "Usikate tamaa na rehema za Mwenyezi Mungu",
      ],
      facts: ["Pia inaitwa Israeli", "Baba wa Yusuf na makabila ya Bani Israil"],
    },
    quran: [
      {
        excerpt:
          "Akasema: Bali nafsi zenu zimekuteseni kwenye kitu. Kwa hiyo subira inafaa zaidi. Huenda Mwenyezi Mungu akawaleta kwangu wote pamoja.",
      },
      {
        excerpt:
          "Wakasema: Tutamuabudu Mungu wako na Mungu wa baba zako, Ibrahim na Ismail na Is-haq, Mungu mmoja, na sisi tunasilimu kwake.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yusuf (AS)",
    summary:
      "Nabii ambaye safari yake kutoka kisimani hadi kwenye kiti cha enzi cha Misri inafundisha usafi, subira, na msamaha.",
    body: [
      "Yusuf (amani iwe juu yake) ndiye mada ya simulizi moja kamili zaidi ya Qur'ani - Sura Yusuf, ambayo Mwenyezi Mungu anaiita 'hadithi bora zaidi' (Qur'ani 12:3). Akiwa mvulana aliona ndoto ya kweli ya nyota kumi na moja, jua, na mwezi ukimsujudia. Ndugu zake wenye wivu walimtupa ndani ya kisima na kumuuza utumwani huko Misri, ambako alinunuliwa katika nyumba ya ofisa mmoja mwenye nguvu. Katika kila mabadiliko, Yusuf alilinda imani yake na uadilifu wake.",
      "Usafi wake ulijaribiwa wakati mke wa bwana wake alipojaribu kumtongoza. Alikataa kwa kusema, “Najikinga kwa Mwenyezi Mungu,” na akapendelea jela kuliko dhambi: “Jela ninaipenda zaidi kuliko ile wanayoniitia” (Qur’ani 12:33). Ingawa hakuwa na hatia, alifungwa kwa miaka mingi - na hata huko aliwaita wafungwa wenzake kwa tawheed na kutafsiri ndoto zao. Wakati ndoto ya mfalme mwenyewe kuhusu miaka saba ya njaa ilipotatiza mahakama, zawadi ya tafsiri ya Yusufu aliyopewa na Mungu ilimleta mbele ya mfalme, ambaye alimweka msimamizi wa hazina za Misri. Alisimamia taifa kupitia njaa kwa hekima na haki.",
      "Kilele cha hadithi sio nguvu bali msamaha. Ndugu zake waliposimama mbele yake kwa njaa, bila ya kumtambua, Yusuf akajidhihirisha na kusema: 'Leo hamtakuwa na lawama. Mwenyezi Mungu atakusameheni, naye ni Mwingi wa kurehemu kuliko wanaorehemu.” (Qur’ani 12:92). Alimtukuza Mwenyezi Mungu kwa kila kheri, akisema Mola wake Mlezi alikuwa ni mwema pale alipomtoa gerezani na kuiunganisha familia. Yusuf anafundisha kwamba usafi na taqwa humlinda Muumini, kwamba mpango wa Mwenyezi Mungu hupita kimya kimya kila njama ya mwanadamu, na kwamba msamaha - sio kisasi - ni alama ya mtukufu.",
    ],
    profile: {
      nation: "ukoo wa Bani Israil huko Misri",
      location: "Kanaani na Misri",
      era: "Kabla ya Musa",
      mission: "Simamisha tawhiyd, usafi na uadilifu huku ukiitumikia jamii.",
      challenges: [
        "Kusalitiwa na ndugu zake",
        "Majaribu na kashfa za uwongo",
        "Kifungo cha muda mrefu licha ya kutokuwa na hatia",
      ],
      miracles: ["Karama tuliyopewa na Mungu ya tafsiri ya kweli ya ndoto"],
      majorEvents: [
        "Kisima na kutengwa na baba yake",
        "Miaka ya kifungo",
        "Kupanda mamlaka katika Misri na kuungana tena na familia yake",
      ],
      lessons: [
        "Usafi na uadilifu hulinda imani",
        "Msamaha huponya familia",
        "Mpango wa Mwenyezi Mungu unapita kila njama ya mwanadamu",
      ],
      facts: ["Sura yote ya Yusuf, inayoitwa hadithi bora zaidi, inahusu maisha yake"],
    },
    quran: [
      {
        excerpt:
          "Akasema: Hapana lawama juu yenu leo. Mwenyezi Mungu akusamehe; Naye ni Mwingi wa kurehemu kuliko wanaorehemu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mtukufu, mwana wa mtukufu, mwana wa mtukufu, mwana wa mtukufu: Yusuf, mwana wa Ya'qub, mwana wa Ishaq, mwana wa Ibrahim.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shu'ayb (AS)",
    summary:
      "Mtume ambaye alifungamanisha imani na uaminifu katika biashara na akawaonya Madyana dhidi ya ulaghai na dhulma.",
    body: [
      "Shuayb (amani iwe juu yake) alitumwa kwa watu wa Madyan, jumuiya ya wafanyabiashara iliyoharibu uchumi wake kwa kulaghai, kutoa kipimo na mizani, kuwanyang'anya watu mali zao, na kueneza dhulma katika ardhi. Ujumbe wake uliunganisha nusu mbili za imani ambazo watu mara nyingi hujaribu kutenganisha - ibada na maadili: 'Enyi watu wangu, mwabuduni Mwenyezi Mungu; huna mungu ila Yeye. Na timizeni kipimo na mizani kwa uadilifu, wala msiwanyime watu haki yao.” (Qur’ani 11:84–85).",
      "Watu wake walipinga, wakiuliza kwa kejeli iwapo maombi yake yaliwataka waache mila potofu za baba zao na wafanye wapendavyo kwa mali zao (Qur’ani 11:87). Walimdhihaki, wakamtishia yeye na waumini kumfukuza, na hata wakafunga njia. Shu'ayb aling'ang'ania kwa huruma na mawaidha yaliyo wazi, akisisitiza kuwa alitafuta marekebisho kadiri awezavyo, na kwamba kufaulu kwake kumetoka kwa Mwenyezi Mungu peke yake: 'Na kufaulu kwangu si kwa ila kwa Mwenyezi Mungu. Kwake Yeye nimetegemea, na Kwake Yeye nitarejea” (Qur’ani 11:88). Anakumbukwa kwa ufasaha wake wa kuwaita watu wake.",
      "Walipong’ang’ania kukataa, adhabu ilikuja na kuwakamata madhalimu, na Mwenyezi Mungu akamuokoa Shuayb na Waumini (Qur’ani 7:91–93). Wasifu wake unatoa somo ambalo mara nyingi hupuuzwa: uaminifu wa kiuchumi sio tofauti na dini - ni sehemu yake. Ulaghai sokoni, kuwanyonya walio hatarini, na mbinu za ghiliba ni mambo ya imani, na jamii inayohalalisha dhulma inakaribisha hukumu ya Mwenyezi Mungu.",
    ],
    profile: {
      nation: "Watu wa Madyana",
      location: "Eneo la biashara la Kaskazini-magharibi mwa Arabia / Levantine",
      era: "Baada ya kizazi cha Ibrahim",
      mission: "Wito wa tawhiyd na uaminifu na uadilifu katika biashara.",
      challenges: [
        "Ufisadi wa soko uliokithiri",
        "Kejeli kutoka kwa wasomi",
        "Vitisho vya kufukuzwa",
      ],
      majorEvents: [
        "Wito wa kipimo kamili na shughuli za haki",
        "Upinzani wa umma na vitisho",
        "Adhabu ya wanao dumu",
      ],
      lessons: [
        "Imani inadai uaminifu katika biashara",
        "Udhalimu wa hadharani hualika hukumu ya Mungu",
        "Manabii wanashughulikia maadili ya kijamii na kiuchumi, sio matambiko pekee",
      ],
      facts: ["Inajulikana kwa kusisitiza uzito na vipimo tu"],
    },
    quran: [
      {
        excerpt:
          "Enyi watu wangu, muabuduni Mwenyezi Mungu; huna mungu ila Yeye. Timizeni kipimo na mizani, wala msiwanyime watu haki yao, wala msifanye uharibifu katika ardhi.",
      },
      {
        excerpt:
          "Na kufaulu kwangu sio ila kwa Mwenyezi Mungu. Kwake Yeye nimetegemea, na Kwake nitarejea.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ayyub (AS)",
    summary:
      "Mfano wa subira wa Qur'ani: usiotikisika katika ibada kwa ugonjwa wa muda mrefu na hasara.",
    body: [
      "Ayyub (amani iwe juu yake) - Ayubu - ni alama ya kudumu ya sabr katika Qur'ani. Alikuwa nabii aliyebarikiwa kwa afya, mali, na familia, na kisha kujaribiwa kwa kuzipoteza, na kwa ugonjwa wa muda mrefu, wenye uchungu. Katika yote hayo hakuwa na uchungu wala kumshutumu Mola wake kwa dhulma; alishikilia sana shukrani na ukumbusho. Qur’ani inamsifu kwa maneno yanayonasa hadithi yake yote: ‘Hakika tulimkuta mvumilivu, mja mwema. Hakika yeye alikuwa ni mwenye kurejea kwa Mwenyezi Mungu mara kwa mara.” (Qur’ani 38:44).",
      "Wakati ugumu ulipozidi kuwa mkubwa, tazama adabu kamilifu (adab) za du'a yake. Hakudai au kulalamika dhidi ya hukumu ya Mwenyezi Mungu; kwa unyenyekevu na unyenyekevu aliweka hali yake mbele ya Mola wake Mlezi: “Hakika imenigusa dhiki, na Wewe ni mwingi wa kurehemu kuliko wanaorehemu” (Qur’ani 21:83). Alithibitisha rehema za Mwenyezi Mungu katika dakika ile ile ya kuomba. Mwenyezi Mungu akamjibu, akamwambia: Piga ardhi kwa mguu wako; hii ni bafu yenye ubaridi na kinywaji,’ na Akaiondolea dhiki na akairejesha familia yake na zaidi, kuwa ni rehema kutoka Kwake na ukumbusho kwa waja (Qur’ani 21:84; 38:41–43).",
      "Ayyub anafundisha kwamba subira si uvumilivu wa kupita kiasi bali ni aina ya ibada inayoendelea - kurudi kwa Mwenyezi Mungu mfululizo wakati wa majaribu. Mfano wake pia unaboresha jinsi tunavyoomba dua: kwa unyenyekevu, bila ya malalamiko dhidi ya amri, na kwa yakini katika rehema ya Mwenyezi Mungu. Na mwisho wake unamhakikishia kila Muumini aliyejaribiwa kwamba mitihani, iliyobebwa na imani, inaweza kupandisha daraja ya mja na daima hufuatiwa na unafuu katika muda wa Mwenyezi Mungu.",
    ],
    profile: {
      era: "Enzi ya unabii wa baada ya Ibrahimu (muktadha mpana)",
      mission: "Waongoze watu wake huku ukijumuisha subira na ibada katika shida.",
      challenges: [
        "Ugonjwa wa muda mrefu na chungu",
        "Kupoteza mali na familia",
        "Uvumilivu chini ya mtihani wa muda mrefu",
      ],
      miracles: [
        "Uponyaji na nafuu kwa amri ya Mwenyezi Mungu",
        "Marejesho ya familia na baraka baada ya majaribio",
      ],
      majorEvents: [
        "Dua yake ya unyenyekevu katika shida",
        "Msaada wa kimungu, uponyaji, na urejesho",
      ],
      lessons: [
        "Subira ni aina ya ibada inayofanya kazi",
        "Du'a ni nzuri sana inapokuwa mnyenyekevu na isiyo na malalamiko",
        "Majaribu yanayoletwa na imani yanaweza kuinua cheo cha mtu",
      ],
      facts: ["Imetajwa katika mapokeo yote ya Kiislamu kama kielelezo cha sabr"],
    },
    quran: [
      {
        excerpt:
          "Na Ayyubu alipo mwita Mola wake Mlezi: Hakika yamenigusa dhiki, na Wewe ni mwingi wa kurehemu kuliko wanaorehemu.",
      },
      {
        excerpt:
          "Hakika tulimkuta mvumilivu, mja mwema. Hakika yeye alikuwa ni mwenye kurejea kwa Mwenyezi Mungu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dhul-Kifl (AS)",
    summary:
      "Nabii mwadilifu anayehesabika miongoni mwa wenye subira, ameheshimiwa ingawa hadithi yake ni fupi.",
    body: [
      "Dhul-Kifl (amani iwe juu yake) ametajwa mara mbili ndani ya Qur'ani, mara zote mbili akiwa pamoja na mitume watukufu. Mwenyezi Mungu Amemuorodhesha pamoja na Ismail na Idris - wote walikuwa miongoni mwa wanaosubiri. Na tukawaingiza katika rehema yetu; Hakika wao walikuwa miongoni mwa watu wema' (Qur'ani 21:85-86) - na tena akamtaja miongoni mwa watu wema pamoja na Ismail na Al-Yasa' (Qur'ani 38:48). Kila kutajwa ni sifa, ingawa hakuna maelezo ya kina yanayotolewa.",
      "Kwa sababu Qur'ani na Sunnah sahihi haziongezei maisha yake, wanazuoni wa kitambo wanatofautiana juu ya hata maelezo ya kimsingi - wengine walizingatia kama alikuwa nabii au mtu mwadilifu, ingawa anahesabiwa miongoni mwa Mitume katika orodha kuu za Waislamu. Muumini makini hupinga kujaza kimya kwa ngano zisizothibitishwa, na badala yake anashikilia yale anayoyathibitisha Mwenyezi Mungu: alikuwa mvumilivu na mwadilifu, na huo ni utukufu wa kutosha.",
      "Kujumuishwa kwake kunabeba somo tulivu: sio kila mja anayependwa na Mwenyezi Mungu anaacha nyuma hadithi maarufu. Utumishi thabiti, wa uaminifu - aina ambayo haijaandikwa kamwe na historia lakini inajulikana kikamilifu na Mwenyezi Mungu - ni aina ambayo inapata rehema Yake. Uimara uliofichwa sio mdogo; ni kiini cha maisha ya haki.",
    ],
    profile: {
      era: "Vipindi vya baadaye vya kabla ya Isa (vimewekwa kwa upana)",
      mission: "Waite watu wake kwenye utii na uadilifu.",
      lessons: [
        "Uvumilivu ndio kiini cha tabia ya kinabii",
        "Maelezo machache bado yana mwongozo thabiti",
        "Utumishi wa uaminifu, usioonekana unapendwa na Mwenyezi Mungu",
      ],
      facts: [
        "Aitwaye pamoja na Ismail na Idris miongoni mwa wagonjwa",
        "Imehesabiwa miongoni mwa manabii katika orodha kuu za Waislamu",
      ],
    },
    quran: [
      {
        excerpt:
          "Na Ismail na Idris na Dhul-Kifl - wote walikuwa miongoni mwa wenye subira. Na tukawaingiza katika rehema yetu; Hakika hao walikuwa miongoni mwa watu wema.",
      },
      {
        excerpt: "Na mkumbuke Ismail, Al-Yasaa, na Dhul-Kifli, na wote ni katika walio bora.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Musa (AS)",
    summary:
      "Mjumbe mkubwa kwa Bani Israil ambaye alikabiliana na dhulma ya Firauni na kuipokea Taurati.",
    body: [
      "Musa (amani iwe juu yake) ndiye nabii anayetajwa sana katika Qur'ani, na hadithi yake inasimuliwa kwa kina. Alizaliwa chini ya amri ya Firauni ya kuwaua wana wa Bani Israil, aliwekwa kama mtoto mchanga kwenye kikapu kwenye mto Nile na mama yake - kwa wahyi wa Mwenyezi Mungu - na, kwa mpango wa Mwenyezi Mungu, alilelewa katika kasri ya Firauni mwenyewe (Qur'ani 28:7-13). Miaka kadhaa baadaye, baada ya kutoka Misri na kuoa huko Madyan, aliitwa na Mwenyezi Mungu kwenye bonde takatifu la Tuwa, ambapo Mwenyezi Mungu alizungumza naye moja kwa moja, akamwonyesha ishara ya fimbo na mkono, na akamtuma pamoja na ndugu yake Harun kwa Firauni dhalimu (Qur’ani 20:9–36).",
      "Utume wake ulikuwa ni kufikisha mambo mawili: mwito wa kumwabudu Mwenyezi Mungu peke yake, na hitaji la kuwakomboa wana wa Israili waliodhulumiwa. Firauni aliyedai kuwa mungu alikutana naye kwa dharau, na hata baada ya mfululizo wa ishara zilizo wazi - fimbo iliyogeuka nyoka na kumeza hila za wachawi, na mapigo - alikataa kusalimu amri. Musa alipowatoa Bani Israil, Firauni akawafuata mpaka baharini. Hapo Mwenyezi Mungu akaamrisha, ‘Piga bahari kwa fimbo yako,’ ikagawanyika hivyo Waumini wakavuka nchi kavu na Firauni na jeshi lake walizama (Qur’ani 26:63–66).",
      "Lakini ukombozi ulikuwa mwanzo tu. Kisha Musa alivumilia jaribio gumu zaidi, refu zaidi la kuwaongoza watu wagumu na mara nyingi wasio na shukrani: aliipokea Torati pale mlimani, kisha akarudi na kuwakuta wakiabudu ndama wa dhahabu; alikabiliana na malalamiko yao, madai yao, na kutotii kwao kwa uongozi wenye subira, thabiti. Maisha ya Musa yanaungana na mada mbili kuu - ujasiri wa kusimama dhidi ya dhuluma na dhuluma, na uvumilivu unaohitajika kuwaongoza watu kuelekea utii mara tu wanapokuwa huru. Kama mmoja wa ulul-'azm, yeye ni kielelezo cha wote mrekebishaji na mchungaji wa umma.",
    ],
    profile: {
      nation: "Bani Israil (kwa wito ulioelekezwa kwa watu wa Firauni)",
      location: "Misri na Sinai",
      era: "Kabla ya Dawud na Suleiman",
      mission: "Iteni kwenye tawhiyd, mkabiliane na dhulma ya Firauni, na mtoe Taurati.",
      challenges: [
        "Kukabiliana na Farao, ambaye alidai uungu",
        "Kuongoza watu wa upinzani na wasio na shukrani",
        "Uongozi endelevu chini ya shinikizo la mara kwa mara",
      ],
      miracles: [
        "Fimbo iliyogeuka kuwa nyoka",
        "Kupasuka kwa bahari kwa amri ya Mwenyezi Mungu",
        "Ishara nyingi zilizoonyeshwa mbele ya Farao",
      ],
      majorEvents: [
        "Mwenyezi Mungu akizungumza naye kwenye bonde takatifu",
        "Mgongano wa Firauni na wachawi",
        "Kutoka na kuteremshwa kwa Taurati",
      ],
      lessons: [
        "Simama kwa ujasiri dhidi ya udhalimu",
        "Uongozi juu ya watu unahitaji uvumilivu mkubwa",
        "Uhuru lazima uunganishwe na utii kwa Mwenyezi Mungu",
      ],
      facts: [
        "Mmoja wa wajumbe watano wa azimio thabiti (ulul-'azm)",
        "Anaitwa Kalimullah - yule ambaye Mwenyezi Mungu alizungumza naye moja kwa moja",
      ],
    },
    quran: [
      {
        excerpt:
          "Na nimekuteuwa wewe, basi sikilizeni yanayoteremshwa. Hakika mimi ndiye Mwenyezi Mungu. Hapana mungu ila Mimi, basi niabuduni na ushike Sala kwa kunikumbuka.",
      },
      {
        excerpt:
          "Na tukampa wahyi mama yake Musa: Mnyonyeshe, na unapomkhofu basi mtupeni mtoni, wala msiogope wala msihuzunike. Hakika Sisi tutamrudisha kwenu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Malaika wa mauti alitumwa kwa Musa. Alipomjia Musa akampiga, na Mwenyezi Mungu akamrudishia jicho lake na akampa chaguo kuhusu wakati wa kufa kwake.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Harun (AS)",
    summary: "Kaka yake Musa fasaha, aliteuliwa kuwa nabii msaidizi wake mbele ya Farao.",
    body: [
      "Harun (amani iwe juu yake) alikuwa kaka mkubwa wa Musa na Mtume katika haki yake mwenyewe. Mwenyezi Mungu alipomtuma Musa kwa Firauni, Musa aliomba msaada: Na niwekee waziri katika familia yangu, Harun, ndugu yangu. Niongezee nguvu zangu na umruhusu ashiriki kazi yangu' (Qur'ani 20:29–32). Mwenyezi Mungu alikubali ombi hilo, na Qur’ani inaandika jibu lake: ‘Tutautia nguvu mkono wako kupitia ndugu yako’ (Qur’ani 28:35). Harun, aliyeelezewa kuwa fasaha zaidi katika hotuba, alisimama kando ya Musa walipokuwa wakiwasilisha ujumbe wa Mwenyezi Mungu kwa dhalimu.",
      "Wakati wake wa majaribio zaidi ulikuja kwa kutokuwepo kwa Musa. Musa alipokwenda kuipokea Taurati mlimani, Bani Israil walianguka katika kuabudu ndama wa dhahabu. Harun alijaribu kuwazuia huku akiwaonya, ‘Enyi watu wangu, hamjaribiwa kwa hayo tu, na hakika Mola wenu ni Mwingi wa Rehema, basi nifuateni na mtiini amri yangu’—lakini walimshinda mamlaka yake na wakakaribia kumdhuru (Qur’ani 20:90–94). Musa aliporudi kwa hasira, Harun alieleza kwamba aliogopa kwamba kutenda kwa nguvu zaidi kungegawanya jumuiya katika makundi yenye kupigana kabla ya Musa kurudi (Qur'ani 7:150).",
      "Wasifu wa Harun unaangazia thamani ya kazi ya pamoja katika kumtumikia Mwenyezi Mungu - utume unaobebwa na wawili ni wenye nguvu kuliko mmoja - na hekima nyeti ya kuhifadhi umoja bila kuathiri ukweli. Wakati mwingine uongozi mwaminifu humaanisha kushikilia jumuiya inayovunjika pamoja na kuzuia madhara hadi mambo yaweze kurekebishwa. Harun ameheshimiwa katika Qur’ani miongoni mwa walioongoka, na Mwenyezi Mungu alimwachia yeye na Musa sifa za kudumu miongoni mwa vizazi vilivyofuata (Qur’ani 37:119–122).",
    ],
    profile: {
      nation: "Bani Israil",
      location: "Misri na Sinai",
      era: "Zama za Musa",
      mission: "Muunge mkono Musa katika kuita tawhiyd na kuwaongoza Bani Isra'il.",
      challenges: [
        "Kukabiliana na utawala wa Farao",
        "Kusimamia jamii wakati wa kutokuwepo kwa Musa",
        "Kuzuia mgawanyiko mkubwa kati ya watu",
      ],
      majorEvents: [
        "Kuteuliwa kuwa waziri na kumuunga mkono Musa",
        "Ujumbe mbele ya Farao",
        "Jaribio la ndama wa dhahabu",
      ],
      lessons: [
        "Kazi ya pamoja inaimarisha wito kwa Mwenyezi Mungu",
        "Uongozi wakati mwingine unamaanisha kuwaweka watu pamoja katika shida",
        "Dumisha umoja bila kuathiri ukweli",
      ],
      facts: ["Kaka mkubwa wa Musa", "Amesifiwa katika Qur-aan kwa ufasaha wake"],
    },
    quran: [
      {
        excerpt:
          "Na unijaalie waziri katika familia yangu - Harun, ndugu yangu. Niongezee nguvu kupitia yeye na umruhusu ashiriki kazi yangu.",
      },
      {
        excerpt:
          "Akasema: Mwana wa mama yangu, hakika watu walinizidi nguvu na wakataka kuniua, basi wasifurahie maadui juu yangu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dawud (AS)",
    summary:
      "Nabii-mfalme aliyepewa hekima, haki, na Zaburi, na kielelezo cha uongozi unaozingatia ibada.",
    body: [
      "Dawud (amani iwe juu yake) - Daudi - alianza akiwa kijana katika jeshi la Talut (Sauli) dhidi ya Jalut (Goliath) dhalimu. Daawuud ndiye aliyempiga Jalut, na Mwenyezi Mungu akampa enzi na hikima, na akamfundisha katika aliyo yataka.” (Qur’ani 2:251). Kisha Mwenyezi Mungu akampa ufalme, utume, na Kitabu kilichoteremshwa, Zabur (Zaburi), na kumfanya kuwa mfano adimu wa mtawala ambaye pia alikuwa mwabudu aliyejitolea.",
      "Mwenyezi Mungu alimpa zawadi za ajabu: milima na ndege wangeungana naye katika kumtukuza Mwenyezi Mungu, na chuma kilifanywa laini mikononi mwake ili aweze kutengeneza silaha (Qur'ani 21:79; 34:10–11). Pamoja na uwezo huu wote, Dawud alibakia kuwa mnyenyekevu sana na aliyejitolea. Ibada yake ilikuwa kubwa kiasi kwamba Mtume (Swalla Allaahu ´alayhi wa sallam) aliielezea funga ya Dawud - kufunga kila siku nyingine - kuwa ni funga inayopendwa zaidi na Mwenyezi Mungu, na sala yake ya usiku kuwa ni sala inayopendwa zaidi. Qur'ani pia inawasilisha tukio la hukumu ambapo Dawud, akasahihisha kwa upole, alianguka katika sijda mara moja, akaomba msamaha, na akarejea kwa Mola wake Mlezi (Qur'ani 38:24) - nguvu zake hazimuwahi kamwe juu ya kuwajibika.",
      "Maisha ya Dawud yanafunza kwamba mamlaka ni amana, si upendeleo. Mwenyezi Mungu anazungumza naye moja kwa moja: “Ewe Dawud, tumekufanya wewe kuwa mrithi katika ardhi, basi hukumu baina ya watu kwa haki wala usifuate matamanio” (Qur’ani 38:26). Uadilifu, kumkumbuka Mwenyezi Mungu mara kwa mara, toba ya haraka, na maisha yenye nidhamu ya ibada ndivyo vinavyosimamisha uongozi wa haki. Nguvu ni salama zaidi mikononi mwa mtu anayeinama zaidi.",
    ],
    profile: {
      nation: "Bani Israil",
      location: "mkoa wa Yerusalemu",
      era: "Kabla ya utawala wa Sulayman",
      mission:
        "Ongozeni kwa uadilifu, na muhukumu kwa haki, na waite watu wake kwa Mwenyezi Mungu.",
      challenges: [
        "Uzito wa wajibu wa mahakama",
        "Kusawazisha nguvu na unyenyekevu",
        "Uwajibikaji wa umma katika uongozi",
      ],
      miracles: [
        "Milima na ndege wanamsabihi Mwenyezi Mungu pamoja naye",
        "Chuma kilicholainishwa mikononi mwake kwa idhini ya Mwenyezi Mungu",
      ],
      majorEvents: [
        "Kushindwa kwa Jalut katika ujana wake",
        "Ufalme, utume, na wahyi wa Zabur",
        "Urithi ulipitishwa kwa mwanawe Sulayman",
      ],
      lessons: [
        "Haki ni msingi wa utawala wa haki",
        "Tubu haraka baada ya kosa lolote",
        "Maisha yenye nidhamu ya ibada huimarisha uongozi",
      ],
      facts: ["Mpokeaji wa Zabur (Zaburi)", "Alimshinda Jalut (Goliathi) akiwa kijana"],
    },
    quran: [
      {
        excerpt:
          "Ewe Dawud hakika tumekufanya wewe kuwa mrithi katika ardhi, basi hukumu baina ya watu kwa haki wala usifuate matamanio kwani yatakupoteza na njia ya Mwenyezi Mungu.",
      },
      {
        excerpt:
          "Na tuliifanya milima imtakase pamoja na Dawud, na ndege pia... Na tukamfundisha kutengeneza nguo za kivita ili kukukingeni na adui yenu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sala inayopendwa sana na Mwenyezi Mungu ni swala ya Dawud, na funga inayopendwa zaidi na Mwenyezi Mungu ni saumu ya Dawud: angefunga siku moja na inayofuata.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sulayman (AS)",
    summary:
      "Nabii-mfalme aliyepewa mamlaka yasiyo na kifani lakini yenye msingi wa shukrani na hekima.",
    body: [
      "Suleiman (Swalla Allaahu 'alayhi wa aalihi wa sallam) alirithi vyote viwili ufalme na utume kutoka kwa baba yake Dawud, na Qur'ani Tukufu inamsifu kuwa ni 'mja bora, hakika mwenye kurejea kwa Mwenyezi Mungu mara kwa mara' (Qur'ani 38:30). Akaomba ufalme usiokuwa na ule utakaomfuata, na Mwenyezi Mungu akamjaalia njia isiyo ya kawaida: kutawala upepo uendao kwa amri yake; utumishi wa majini waliomjengea na kumpimia kwa idhini ya Mwenyezi Mungu; na ufahamu wa usemi wa ndege na viumbe vingine (Qur’ani 21:81–82; 34:12–13; 27:16).",
      "Matukio mawili yanakamata tabia yake. Chungu alipolionya koloni lake lijifiche lisije jeshi la Sulayman litawaangamiza bila kujua, Sulayman alitabasamu na kumshukuru Mwenyezi Mungu kwa neema ya ufahamu, akiomba afanywe mwenye shukrani na mwadilifu (Qur'ani 27:18-19) - nguvu zilimfanya awe mnyenyekevu zaidi, sio mdogo. Na aliposikia kuhusu Malkia wa Sheba (Saba’) na watu wake wanaabudu jua, hakuwashinda kwa nguvu bali aliwaita wamnyenyekee Mwenyezi Mungu, na hatimaye akampa imani kwa hekima na maonyesho ya yale aliyompa Mwenyezi Mungu (Qur’ani 27:22–44). Hata baraka zake nyingi aliziweka kama mtihani: “Haya ni katika fadhila za Mola wangu Mlezi ili kunijaribu ikiwa nitashukuru au nitakufuru” (Qur’ani 27:40).",
      "Sulayman anafundisha kwamba nguvu ni moja ya mitihani migumu zaidi, na kwamba shukrani (shukr) ni tiba yake. Muumini akipewa mali, uwezo, au mamlaka inakusudiwa kuitumia kwa ajili ya uadilifu na kuwalingania wengine kwa Mwenyezi Mungu, kamwe kwa kiburi. Ufalme wake wote, pamoja na maajabu yake yote, unaelekeza nyuma kwa Yule aliyeutoa - na hiyo ndiyo tofauti kati ya baraka inayoinua na ile inayoharibu.",
    ],
    profile: {
      nation: "Bani Israil na falme zinazowazunguka",
      location: "Yerusalemu na eneo kubwa zaidi",
      era: "Baada ya Dawud",
      mission: "Tawalani kwa uadilifu na waiteni mataifa katika kumwabudu Mwenyezi Mungu.",
      challenges: [
        "Kusimamia ufalme mkubwa",
        "Kudumisha shukrani huku kukiwa na nguvu kubwa",
        "Kuelekeza nguvu mbalimbali kwa kuwajibika",
      ],
      miracles: [
        "Amri juu ya upepo kwa idhini ya Mwenyezi Mungu",
        "Huduma ya majini katika kujenga na kupiga mbizi",
        "Kuelewa hotuba ya ndege na mchwa",
      ],
      majorEvents: [
        "Kurithi ufalme na utume wa Dawud",
        "Kipindi cha mchwa na shukurani zake",
        "Mawasiliano na Malkia wa Sheba na imani yake",
      ],
      lessons: [
        "Nguvu ni mtihani mkubwa",
        "Shukrani hulinda dhidi ya kiburi",
        "Hekima na mwaliko vinaweza kugeuza mioyo kuwa bora kuliko nguvu",
      ],
      facts: ["Miongoni mwa manabii-wafalme walioelezewa kikamilifu katika Qur'ani"],
    },
    quran: [
      {
        excerpt:
          "Akatabasamu, akafurahishwa na maneno yake, na akasema: Mola wangu Mlezi, niwezeshe nishukuru neema Yako uliyonineemesha mimi na wazazi wangu wawili, na nifanye wema unayoiridhia.",
      },
      {
        excerpt:
          "Na kwa Suleiman tukautiisha upepo, mwendo wake wa asubuhi ni mwendo wa mwezi mmoja, na mwendo wake wa alasiri ni mwendo wa mwezi mmoja.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ilyas (AS)",
    summary:
      "Mtume ambaye alikabiliana na ibada ya sanamu Ba'l na akawaita watu wake warudi kwa Mwenyezi Mungu.",
    body: [
      "Ilyas (amani iwe juu yake) - Eliya - alitumwa kwa umma wa Bani Isra'il ambao walikuwa wameanguka kwenye ibada ya masanamu, mkuu kati ya masanamu yao akiwa Ba'l. Qur'ani inaandika changamoto yake ya moja kwa moja: 'Je, hamwogopi Mwenyezi Mungu? Je! mnamuomba Baali na mnamwacha mbora wa waumbaji, Mwenyezi Mungu, Mola wenu Mlezi na Mola Mlezi wa baba zenu wa kwanza? (Qur’ani 37:124–126). Wito wake ulikuwa wito wa unabii wa milele: kuvua miungu ya uwongo na kurudisha ibada kwa Muumba peke yake.",
      "Qur'ani Tukufu inafupisha utume wake kwa mtindo uliozoeleka wa kinabii - mwaliko wa wazi, kukataliwa na wengi, na heshima iliyohifadhiwa kwa wanyofu. “Wamemkadhibisha, basi hakika wataletwa [kwa adhabu], isipokuwa waja wa Mwenyezi Mungu walioteuliwa.” (Qur’ani 37:127–128). Mwenyezi Mungu anamtaja miongoni mwa watu wema na anamwachia amani ya kudumu na sifa njema: ‘Amani iwe juu ya Ilyas’ (Qur’ani 37:129–130), na anamtaja pamoja na Zakariyya, Yahya, na Isa miongoni mwa walioongoka (Qur’ani 6:85).",
      "Funzo la Ilyas ni kwamba mageuzi ya kweli yanaanza na kusahihisha ibada. Jamii haiwezi kurekebishwa huku ikielekeza ibada kwa vitu vya uwongo - iwe sanamu halisi au sanamu za kisasa za matamanio, mali, na hadhi. Tawhiyd ndio msingi ambao juu yake uhuishaji wote wa kudumu wa maadili umejengwa, na hata kundi la waumini linapokuwa dogo na kuzidi idadi, Mwenyezi Mungu huwaheshimu wale wanaoshikamana na ukweli.",
    ],
    profile: {
      nation: "Umma miongoni mwa Bani Israil",
      location: "Mkoa wa Levant",
      era: "Baadaye nyakati za kinabii za Waisraeli",
      mission: "Waite watu wake kutoka katika ibada ya Ba'l kwenye tawhiyd.",
      challenges: ["Ibada ya sanamu iliyokita mizizi", "Upinzani kutoka kwa uongozi"],
      majorEvents: [
        "Wito wa umma dhidi ya ibada ya Ba'l",
        "Kukataliwa na walio wengi na kuwahifadhi Waumini",
      ],
      lessons: [
        "Tawhiyd ndio msingi wa marekebisho yote",
        "Kikundi kidogo cha waamini bado ni muhimu kwa Mwenyezi Mungu",
        "Manabii wanazungumza dhidi ya makosa ya watu wengi, na sio kwa makosa hayo",
      ],
      facts: ["Ametajwa miongoni mwa watu wema", "Alikabiliana na ibada ya sanamu Ba'l"],
    },
    quran: [
      {
        excerpt:
          "Alipo waambia watu wake: Je! Je, mnamuomba Baali na kuwaacha walio bora zaidi wa waumbaji?",
      },
      {
        excerpt: "Na Zakaria na Yahya na Isa na Ilyas - na wote walikuwa katika watu wema.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Al-Yasa' (AS)",
    summary:
      "Nabii mwadilifu wa ukoo wa Kiisraeli, aliyetajwa katika Qur'ani miongoni mwa mashuhuri.",
    body: [
      "Al-Yasa' (Swalla Allaahu 'alayhi wa aalihi wa sallam) - Elisha - ametajwa miongoni mwa Mitume katika sehemu mbili katika Qur'ani, na katika zote mbili anasifiwa. Anaonekana miongoni mwa walioongoka pamoja na Ismail, Yunus, na Lut, ambao Mwenyezi Mungu 'amewapendelea kuliko walimwengu' (Qur'ani 6:86–87), na tena miongoni mwa waliobobea pamoja na Ismail na Dhul-Kifl (Qur'ani 38:48). Maandishi huinua cheo chake badala ya kusimulia masimulizi ya kina.",
      "Kwa sababu wahyi ni mfupi kwa makusudi juu yake, Waislamu wanathibitisha kile ambacho ni hakika - kwamba alikuwa Mtume wa kweli ambaye alishikilia mwito wa kumwabudu Mwenyezi Mungu peke yake kati ya watu wake - na kuepuka kuambatanisha naye ngano ambazo hazina msaada wa kweli. Kizuizi hiki chenyewe ni sehemu ya imani thabiti: tunamheshimu nabii kwa kushika ukweli juu yake, sio kwa kubuni hadithi karibu naye.",
      "Kutajwa kwake ni ukumbusho kwamba Mwenyezi Mungu alituma Mitume wengi, na kwamba thamani ya mtume haipimwi kwa muda gani hadithi yake imehifadhiwa bali kwa uaminifu wake kwa utume. Kama Qur'ani inavyosema mahali pengine, kulikuwa na Mitume ambao tumekusimulia hadithi zao na Mitume ambao hatukuzisimulia hadithi zao' (Qur'ani 40:78) - na kuamini zote, zinazojulikana na zisizojulikana, ni sehemu ya imani ya Muislamu.",
    ],
    profile: {
      nation: "Bani Israil",
      location: "Mkoa wa Levant",
      era: "Baadaye nyakati za kinabii za Waisraeli",
      mission: "Kuendeleza wito wa tawhiyd miongoni mwa watu wake.",
      lessons: [
        "Waheshimu manabii wote kwa usawa katika imani",
        "Utajo mfupi wa Qur'ani bado unatoa mwongozo wa kweli",
        "Mwendelezo wa haki huhifadhi jumuiya za imani",
      ],
      facts: ["Imetajwa moja kwa moja katika Qur'ani miongoni mwa walio bora na waliochaguliwa"],
    },
    quran: [
      {
        excerpt:
          "Na Ismail na Al-Yasaa na Yunus na Lut'i na wote tuliwafadhilisha kuliko walimwengu wote.",
      },
      {
        excerpt: "Na mkumbuke Ismail, Al-Yasaa, na Dhul-Kifli, na wote ni katika walio bora.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yunus (AS)",
    summary:
      "Nabii wa nyangumi, ambaye toba yake gizani ikawa somo lisilo na wakati katika matumaini.",
    body: [
      "Yunus (amani iwe juu yake) - Yona - alitumwa kwa watu wa Ninawi, lakini walipoendelea kukataa wito wake, aliwaacha kwa hasira kabla ya Mwenyezi Mungu kumpa ruhusa ya kuondoka. Qur’ani inaeleza yaliyofuata: ‘Na [mtaje] yule mtu wa samaki, alipotoka kwa hasira na akadhania kuwa hatutamhukumu [shida yoyote]’ (Qur’ani 21:87). Akiwa amepanda meli, alitupwa baharini na kumezwa na samaki mkubwa, akatumbukizwa katika tabaka za giza - giza la usiku, la bahari na la tumbo la samaki.",
      "Katika giza lile zito Yunus aliita kwa maneno ambayo yalikuja kuwa moja ya dua zinazopendwa sana katika Uislamu: 'Hapana mungu ila Wewe; utukufu ni Kwako. Hakika mimi nimekuwa miongoni mwa madhalimu” (Qur’ani 21:87). Hakukata tamaa; alithibitisha ukamilifu wa Mwenyezi Mungu na akakiri kosa lake mwenyewe. Mwenyezi Mungu akajibu: Basi tukamwitikia na tukamwokoa na dhiki. Na hivi ndivyo tunavyowaokoa Waumini” (Qur’ani 21:88). Samaki akamtupa ufukweni, na Mwenyezi Mungu akaotesha mmea ili kuuhifadhi mwili wake uliodhoofika.",
      "Kisha ukaja mwisho wa ajabu: Yunus akarudi kwa watu wake, na tofauti na karibu kila taifa jingine katika Qur'ani, waliamini na wakaepushwa - 'Basi tukawastarehesha kwa muda' (Qur'ani 37:147-148; 10:98). Hadithi yake inatoa mafunzo mawili yaliyounganishwa pamoja: kamwe usikate tamaa na rehema ya Mwenyezi Mungu, hata giza liko ndani, kwani toba ya kweli hurejesha kile kilichopotea; na du'a ya Yunus ni mhimili wa kila muumini aliye katika dhiki. Mtume (Swalla Allaahu ´alayhi wa sallam) amefundisha kwamba hakuna Mwislamu yeyote anayeswali kwayo isipokuwa Mwenyezi Mungu anamjibu.",
    ],
    profile: {
      nation: "Watu wa Ninawi",
      location: "Mkoa wa Mesopotamia",
      era: "Kipindi cha kabla ya Isa",
      mission: "Waite watu wake kwenye tawhiyd na toba.",
      challenges: [
        "Mkazo wa kukataliwa kwa kudumu katika da'wah",
        "Kesi ya kibinafsi katika giza la bahari",
        "Kurudi kwenye misheni baada ya kusahihishwa",
      ],
      miracles: [
        "Uokoaji kutoka ndani ya samaki",
        "Mmea wa makazi uliokua juu yake",
        "Imani ya watu wake wote",
      ],
      majorEvents: [
        "Kuwaacha watu wake na majaribio ya baharini",
        "Dua katika giza tatu",
        "Kurudi na imani ya Ninawi",
      ],
      lessons: [
        "Usikate tamaa na rehema za Mwenyezi Mungu",
        "Toba ya dhati inarejesha utume",
        "Du'a katika shida ni mabadiliko",
      ],
      facts: ["Pia anaitwa Dhun-Nun (mtu wa samaki) katika Qur'ani"],
    },
    quran: [
      {
        excerpt:
          "Na aliita katika giza: Hapana mungu ila Wewe; utukufu ni Kwako. Hakika mimi nimekuwa miongoni mwa madhalimu.",
      },
      {
        excerpt:
          "Basi je, haukuwa na mji ulioamini hivyo ikanufaisha imani yake isipokuwa watu wa Yunus? Walipo amini tuliwaondolea adhabu ya hizaya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dua ya Dhun-Nun alipomwomba Mwenyezi Mungu kutoka ndani ya tumbo la samaki ilikuwa: La ilaha illa Anta, subhanaka, inni kuntu minaz-zalimin. Hakuna Mwislamu anayeomba kwa chochote isipokuwa Mwenyezi Mungu anamjibu.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Zakariya (AS)",
    summary:
      "Nabii aliyejitolea ambaye aliomba mrithi mwadilifu katika uzee na akajibiwa pamoja na Yahya.",
    body: [
      "Zakariyya (amani iwe juu yake) - Zakaria - alikuwa mtume mcha Mungu wa Bani Israil na mlezi wa Maryam. Kila alipoingia kwake katika chumba chake cha kuswalia, alikuta riziki kwake na akamuuliza imekuwaje, naye hujibu: Imetoka kwa Mwenyezi Mungu. Hakika Mwenyezi Mungu humruzuku amtakaye bila hesabu” (Qur’ani 3:37). Kushuhudia riziki ya Mwenyezi Mungu kwa Maryam kuliamsha tena matumaini yake kwamba Mwenyezi Mungu angeweza kutoa kile kilichoonekana kuwa hakiwezekani kwa binadamu.",
      "Ingawa alikuwa mzee na mke wake alikuwa tasa, Zakariya alimgeukia Mwenyezi Mungu kwa sala ya utulivu na ya ndani kabisa: “Mola wangu, hakika mifupa yangu imedhoofika na kichwa changu kimejaa weupe, na sikukosa kamwe kukuomba dua” (Qur’ani 19:4). Hakuomba mali au faida ya kidunia bali mrithi mwadilifu ambaye angeendeleza ujumbe wa utume na kuhifadhi ibada ya Mwenyezi Mungu. Mwenyezi Mungu akajibu kwa bishara ya mtoto, Yahya - jina, Mwenyezi Mungu alisema, hakuna mtu aliyepewa kabla (Qur'ani 19: 7). Kama ishara, Zakariyya alikuwa ajizuie kuzungumza na watu kwa muda wa siku tatu isipokuwa kwa ishara tu, akiweka ulimi wake katika kumkumbuka Mwenyezi Mungu (Qur’ani 19:10–11).",
      "Maisha ya Zakariyya yanamfundisha muumini kamwe asiache kuomba, hata hivyo jibu linaweza kuonekana kuwa lisilowezekana, na kumuomba Mwenyezi Mungu hasa zawadi ya familia ya haki na kuendelea kwa imani. Hangaiko lake kuu zaidi halikuwa yeye mwenyewe bali ni nani angebeba ukweli baada yake. Hadithi yake pia inaheshimu huduma ya utulivu katika maeneo ya ibada kama tendo adhimu na pendwa.",
    ],
    profile: {
      nation: "Bani Israil",
      location: "mkoa wa Yerusalemu",
      era: "Kabla ya Isa",
      mission: "Waongoze watu wake na uhifadhi ibada ya kinabii.",
      challenges: [
        "Kufikia uzee bila mtoto",
        "Kujali kwa mfululizo wa imani",
        "Kudumisha ibada katika jamii yenye matatizo",
      ],
      miracles: ["Habari njema za Yahya katika uzee", "Ishara ya kukataza hotuba kwa siku tatu"],
      majorEvents: [
        "Ulezi wa Maryam na kushuhudia riziki yake",
        "Dua ya dhati kwa mrithi",
        "Dua iliyojibiwa na kuzaliwa kwa Yahya",
      ],
      lessons: [
        "Kamwe usipoteze matumaini katika du'a",
        "Muombe Mwenyezi Mungu akujaalie jamaa na nasaba wema",
        "Huduma ya kujitolea katika ibada ni ya heshima",
      ],
      facts: ["Mlezi wa Maryam", "Baba wa Yahya, ambaye kuzaliwa kwake kulijibu maombi yake"],
    },
    quran: [
      {
        excerpt:
          "Hapo Zakariya akamwomba Mola wake Mlezi, akisema: Mola wangu Mlezi, nijaalie kutoka kwako kizazi chema. Hakika Wewe ni Mwenye kusikia maombi.",
      },
      {
        excerpt:
          "Akasema: Mola wangu Mlezi, hakika mifupa yangu imedhoofika, na kichwa changu kimejaa weupe, wala sijapata huzuni katika maombi yangu Kwako, Mola wangu Mlezi.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Yahya (AS)",
    summary:
      "Nabii msafi, mwenye hekima aliyepewa haki tangu ujana na kuheshimiwa kwa amani na Mwenyezi Mungu.",
    body: [
      "Yahya (amani iwe juu yake) - John - alikuwa jibu la sala ya baba yake Zakariyya, iliyoitwa na Mwenyezi Mungu kabla ya kuzaliwa kwake. Mwenyezi Mungu akamwambia moja kwa moja: 'Ewe Yahya, shika Kitabu kwa bidii.' Na 'Akampa hekima angali mtoto' (Qur'ani 19:12) - maelezo adimu ambayo yanaashiria ukomavu wake wa mapema wa kiroho. Tangu ujana wake alikuwa amejitolea kwa Mwenyezi Mungu kwa uzito kupita miaka yake.",
      "Qur’ani inaisifu tabia yake kwa mfuatano mzuri: Mwenyezi Mungu alimjaalia ‘upole kutoka Kwetu na usafi, na alikuwa mcha Mungu, na mchamungu kwa wazazi wake, wala hakuwa dhalimu, muasi’ (Qur’ani 19:13–14). Alikuwa msafi na mcha Mungu, akikumbukwa miongoni mwa watu wema. Aliwalingania watu wake kwenye utiifu na ukweli na akamtangulia Isa, akithibitisha neno kutoka kwa Mwenyezi Mungu na kuzitayarisha nyoyo kwa uwongofu (Qur’ani 3:39).",
      "Mwenyezi Mungu alimtukuza Yahya kwa amani katika nyakati tatu zilizo hatarini zaidi za maisha yoyote: 'Amani iwe juu yake siku aliyozaliwa, siku ya kufa kwake, na siku atakayofufuliwa hai' (Qur'ani 19:15). Wasifu wake ni ujumbe kwa vijana na wazee sawa: ukaribu kwa Mwenyezi Mungu hauahirishwi hadi miaka ya baadaye. Usafi wa moyo, umakini katika ibada, na wema kwa wazazi wa mtu unaweza kuchanua ndani ya mtu angali kijana - na maisha kama hayo ni ya kupendwa na Mwenyezi Mungu.",
    ],
    profile: {
      nation: "Bani Israil",
      location: "Mkoa wa Levant",
      era: "Wakati wa zama za Zakariyya na karibu na zama za Isa",
      mission: "Wito kwenye haki na uandae nyoyo kwa uongofu.",
      challenges: [
        "Mageuzi ya umma katika mazingira duni ya kimaadili",
        "Kudumisha usafi na kanuni",
      ],
      majorEvents: [
        "Kuzaliwa kwake kama dua iliyojibiwa",
        "Akipewa hekima katika ujana wake",
        "Kutambuliwa kwa usafi na kujitolea kwake",
      ],
      lessons: [
        "Vijana wanaweza kuongoza kwa haki",
        "Usafi wa moyo ni nguvu ya kweli",
        "Fadhili kwa wazazi ni sehemu ya uchamungu",
      ],
      facts: [
        "Ametajwa na Mwenyezi Mungu kabla ya kuzaliwa kwake",
        "Kuheshimiwa kwa amani wakati wa kuzaliwa, kifo, na ufufuo",
      ],
    },
    quran: [
      {
        excerpt:
          "Ewe Yahya, shika Kitabu kwa bidii. Na tukampa hikima angali mtoto, na upole kutoka kwetu na usafi, naye alikuwa akimcha Mwenyezi Mungu.",
      },
      {
        excerpt:
          "Mwenyezi Mungu anakubashirieni Yahya, anayesadikisha neno litokalo kwa Mwenyezi Mungu, mtukufu, mzui, na Nabii miongoni mwa watu wema.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Isa bin Maryam (AS)",
    summary:
      "Mjumbe mwenye nguvu aliyezaliwa kwa Maryam kwa miujiza, akilingania kwa Mwenyezi Mungu kwa Ishara zilizo wazi - mja, si mcha Mungu.",
    body: [
      "Isa (amani iwe juu yake) - Isa - alizaliwa kwa Maryam bila ya baba, kwa amri ya Mwenyezi Mungu, kama ishara ya ukamilifu wa uweza wake. Hakika mfano wa Isa kwa Mwenyezi Mungu ni kama mfano wa Adam. Alimuumba kwa udongo, kisha akamwambia: Kuwa, akawa” (Qur’ani 3:59). Maryam alipomleta mtoto mchanga kwa watu wake, ambao walimtuhumu, mtoto Isa alisema kutoka utotoni kujitetea: 'Hakika mimi ni mja wa Mwenyezi Mungu. Amenipa Kitabu na amenifanya nabii.” (Qur’ani 19:30). Tamko hili la kwanza liliweka sauti ya utume wake wote - kwamba alikuwa mtumishi wa Mwenyezi Mungu.",
      "Isa alitumwa kwa Bani Israil ili kuithibitisha Taurati mbele yake na kuleta Injil (Injili). Mwenyezi Mungu alimsaidia kwa miujiza iliyo wazi kwa idhini yake: akawaponya vipofu na wakoma, akawahuisha wafu, na akaumba ndege kwa udongo aliyeruka kwa idhini ya Mwenyezi Mungu (Qur'ani 3:49). Ujumbe wake uliwaita watu kumwabudu ‘Mwenyezi Mungu, Mola wangu na Mola wenu Mlezi’ (Qur’ani 3:51), na kwenye ikhlasi na uadilifu. Wanafunzi wake wa karibu, Hawariyyun, walimuamini na kumuunga mkono.",
      "Qur'ani inasahihisha mambo mawili yaliyokithiri kuhusu Isa. Dhidi ya wale waliomkataa na kupanga njama ya kumuua, inatangaza kuwa hakuuawa wala kusulubiwa; bali ilionekana hivyo tu, na Mwenyezi Mungu alimnyanyua kwake (Qur’ani 4:157–158). Dhidi ya wale waliotia chumvi, inasisitiza kuwa yeye ni Nabii na Mtume mtukufu, si Mungu wala mwana wa Mungu—‘Masihi bin Maryam hakuwa ila ni Mtume tu’ (Qur’ani 5:75). Kwa imani ya Kisunni atarejea kabla ya Siku ya Mwisho. Hadithi yake inafunza kwamba uwezo wa Mwenyezi Mungu unapita mambo yote ya kimaumbile, kwamba mitume ni waja wanaoheshimika na si waungu, na ukweli huo lazima ulindwe kutokana na kukanusha na kutiwa chumvi.",
    ],
    profile: {
      nation: "Bani Israil",
      location: "Levant",
      era: "Karne ya 1 BK",
      mission: "Ifanye upya Tawhiyd, ithibitishe Taurati, na mwite kwenye wema.",
      challenges: [
        "Upinzani na kupanga njama na waliomkataa",
        "Kuzidisha kwa hali yake baadaye",
        "Kutetea tauhidi safi",
      ],
      miracles: [
        "Kuzaliwa bila baba",
        "Akizungumza katika kisigino",
        "Kuponya na kuhuisha kwa idhini ya Mwenyezi Mungu",
      ],
      majorEvents: [
        "Kuzaliwa kwake kwa miujiza na kumtetea mama yake",
        "Wito wa watu wenye dalili zilizo wazi",
        "Kuinuliwa kwa Mwenyezi Mungu, sio kuuawa",
      ],
      lessons: [
        "Uweza wa Mwenyezi Mungu unapita mambo ya kawaida",
        "Mitume ni waja wa Mwenyezi Mungu waliotukuka, sio waungu",
        "Ukweli lazima ulindwe dhidi ya kukanusha na kutia chumvi",
      ],
      facts: ["Imepewa Injili (Injil)", "Watarejea kabla ya Siku ya Mwisho katika imani ya Sunni"],
    },
    quran: [
      {
        excerpt:
          "[Isa akasema]: Hakika Mwenyezi Mungu ni Mola wangu Mlezi na Mola wenu, basi muabuduni Yeye. Hiyo ni njia iliyonyooka.",
      },
      {
        excerpt:
          "Nao hawakumwua, wala hawakumsulubisha; lakini ikadhihirika kwao... Bali Mwenyezi Mungu alimnyanyua kwake.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mimi ndiye mkaribu zaidi wa watu wote kwa Isa bin Maryam. Mitume ni ndugu wa mama tofauti, lakini dini yao ni moja, na hapakuwa na nabii baina yetu.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Muhammad ﷺ",
    summary: "Mjumbe wa mwisho, aliyetumwa kama rehema kwa walimwengu wote na muhuri wa utume.",
    body: [
      "Muhammad (Swalla Allaahu ‘alayhi wa aalihi wa sallam) ndiye wa mwisho wa Mitume, hakutumwa kwa watu hata mmoja bali kwa wanadamu wote, na Qur-aan ikiwa ni ufunuo wa mwisho na uliohifadhiwa. Mwenyezi Mungu anauelezea utume wake kwa Aya moja: “Na hatukukutuma ila uwe rehema kwa walimwengu” (Qur’ani 21:107). Mzaliwa wa Makka, alipata wahyi wa kwanza akiwa na umri wa miaka arobaini kwenye pango la Hira, na kwa miaka ishirini na tatu iliyofuata aliwalingania watu kumwabudu Mwenyezi Mungu peke yake, kuzitakasa nyoyo zao, na kuishi kwa uadilifu na rehema - kukamilisha na kuthibitisha ujumbe wa kila Mtume kabla yake.",
      "Njia yake ilikuwa moja ya dhabihu endelevu. Huko Makka yeye na waumini wa mwanzo walivumilia dhihaka, mateso, na kususia kwa miaka mingi. Kisha ikaja Hijra, kuhama kwenda Madina, ambako alijenga umma wa kwanza wa Kiislamu - kuanzisha sala, udugu baina ya wahajiri na wasaidizi, mikataba, na jamii yenye mizizi katika tawhiyd. Kupitia miaka ya taabu na ushindi hatimaye, tabia yake haikuyumba; Qur'ani inashuhudia, 'Hakika wewe ni mwenye tabia njema' (Qur'ani 68:4), na yeye mwenyewe alisema alitumwa kwa ukamilifu wa tabia tukufu.",
      "Mwenyezi Mungu anamtangaza kuwa ni Mtume wa Mwenyezi Mungu na muhuri wa Manabii (Qur'ani 33:40) - hakuna Nabii baada yake. Muujiza wake mkubwa zaidi ni Qur’ani yenyewe, dalili ya kudumu ambayo bado inaongoza mabilioni ya watu, na aliheshimiwa kwa Isra na Mi’raj, safari ya usiku na kupaa. Kwa Muumini, yeye ndiye uswah hasanah - mfano mzuri (Qur'ani 33:21) - ambaye Sunnah yake ni njia ya kivitendo ya imani. Kumpenda yeye, kufuata mwongozo wake, na kutuma baraka juu yake ndio msingi wa maisha ya Uislamu.",
    ],
    profile: {
      nation: "Ubinadamu wote",
      location: "Makka na Madina",
      era: "Karne ya 7 BK",
      mission: "Peleka ufunuo wa mwisho na ukamilishe ujumbe wa kinabii kwa watu wote.",
      challenges: [
        "Mateso na kususia huko Makka",
        "Migogoro na kujenga jamii yenye haki",
        "Kuwasilisha ujumbe wa ulimwengu kwa makabila na mataifa",
      ],
      miracles: [
        "Qur'ani kama muujiza wa kudumu",
        "Isra na Mi'raj (safari ya usiku na kupaa)",
        "Ishara nyingi zilizotolewa kwa idhini ya Mwenyezi Mungu",
      ],
      majorEvents: [
        "Mwanzo wa wahyi huko Makka",
        "Hijra kwenda Madina",
        "Kukamilika kwa ujumbe na Mahubiri ya Kuaga",
      ],
      lessons: [
        "Rehema na tabia njema katika uongozi",
        "Uthabiti chini ya shinikizo",
        "Fuata wahyi na Sunnah kwa pamoja",
      ],
      facts: ["Muhuri wa manabii", "Mfano bora (uswah hasanah) kwa waumini"],
    },
    quran: [
      {
        excerpt:
          "Muhammad si baba wa yeyote katika wanaume wenu, bali ni Mtume wa Mwenyezi Mungu na muhuri wa Manabii.",
      },
      {
        excerpt: "Na hatukukutuma ila uwe rehema kwa walimwengu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mfano wangu na mfano wa manabii walionitangulia ni ule wa mtu aliyejenga nyumba kwa uzuri na ukamilifu, isipokuwa mahali pa tofali moja. Mimi ndimi yule tofali, na mimi ndiye muhuri wa manabii.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Alishiriki masomo kutoka kwa manabii",
    summary: "Mada zinazojirudia: tawhiyd, subira, toba, na ujasiri wa kimaadili.",
    body: [
      "Katika vizazi vyote, Mitume waliita kwenye msingi mmoja: Muabuduni Mwenyezi Mungu peke yake na epukeni aina zote za shirki. Huu ndio msingi usiobadilika wa ufunuo.",
      "Maisha yao pia yanaonyesha unyenyekevu chini ya kukataliwa, kumwamini Mwenyezi Mungu wakati wa kutokuwa na uhakika, na utayari wa kurekebisha jamii kwa hekima na ujasiri.",
      "Kuzisoma hujenga uthabiti: waamini hujifunza kutubu haraka, kuongoza kimaadili, na kubaki kuwa na kanuni hata wakati ukweli haupendwi.",
    ],
    quran: [
      {
        excerpt: "Katika hadithi zao kuna funzo kwa wenye akili.",
      },
      {
        excerpt: "Hao ndio aliowaongoza Mwenyezi Mungu, basi fuateni uwongofu wao.",
      },
    ],
    actions: [
      "Chagua somo moja la kinabii kila juma na ulitumie kimakusudi.",
      "Tafakari baada ya swala pale unapohitaji subira au toba zaidi.",
      "Fundisha hadithi moja ya kweli ya kinabii kwa familia au marafiki mara kwa mara.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Miujiza na dalili za utume",
    summary:
      "Miujiza inathibitisha ukweli kwa idhini ya Mwenyezi Mungu, lakini hailazimishi kuamini.",
    body: [
      "Mwenyezi Mungu aliwapa Mitume Ishara zilizo wazi kwa jamii zao: Safina ya Nuh, Ishara za Musa mbele ya Firauni, Miujiza ya Isa kwa idhini ya Mwenyezi Mungu, na Qur'ani kwa Muhammad ﷺ.",
      "Miujiza si nguvu zinazojitegemea za manabii; yanatokea kwa kutaka kwa Mwenyezi Mungu kuunga mkono wahyi na kuthibiti dalili.",
      "Qur'ani inaonyesha kwamba baadhi bado walikataa licha ya dalili, kuthibitisha uwongofu kunategemea ikhlasi na utii, na sio tamasha pekee.",
    ],
    quran: [
      {
        excerpt:
          "Na tuliwatuma Mitume wetu kwa hoja zilizo wazi na tukateremsha pamoja nao Kitabu na Mizani.",
      },
      {
        excerpt: "Sema: Ishara ziko kwa Mwenyezi Mungu tu!",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Muhtasari wa Qur'ani wa Mitume",
    summary: "Kurani inataja manabii ishirini na watano na inatoa ujumbe mmoja thabiti.",
    body: [
      "Kurani inawataja manabii ishirini na watano moja kwa moja na kuwarejelea mitume wengine wengi zaidi. Hadithi zao husambazwa katika surah kwa ajili ya kutafakari na mwongozo.",
      "Ingawa mazingira yanatofautiana, wito wao ni mmoja: Tawhiyd, haki, uwajibikaji, na rehema kwa njia ya toba.",
      "Moduli hii inakaa katika misingi ya Qur'ani na inaweka maelezo ya pili ya kihistoria kwa ufupi isipokuwa kama yakiungwa mkono na ushahidi wa kuaminika.",
    ],
    quran: [
      {
        excerpt:
          "Sisi tumeshatuma Mitume kabla yako; miongoni mwao wapo tulio kuhadithia na miongoni mwao wapo ambao hatukukusimulia.",
      },
      {
        excerpt:
          "Tumemuamini Mwenyezi Mungu na yaliyoteremshwa... na aliyopewa Musa na Isa na Manabii kutoka kwa Mola wao Mlezi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Marejeleo na njia ya kusoma",
    summary: "Jinsi ya kujifunza manabii kwa uhalisi, uwiano, na manufaa.",
    body: [
      "Anza na vifungu vya Qur'ani, kisha soma hadith sahihi, kisha tazama tafsir inayotegemewa kwa muktadha. Agizo hili linaendelea kujifunza kukita mizizi katika ufunuo.",
      "Epuka ripoti za kusisimua au dhaifu zinazokinzana na kanuni za Qur'ani au adhama ya kinabii. Sio kila hadithi maarufu ina uthibitisho mzuri.",
      "Tumia wasifu wa kinabii kurekebisha ibada yako mwenyewe na tabia, sio tu kukusanya ukweli wa kihistoria.",
    ],
    quran: [
      {
        excerpt:
          "Wale wanao sikiliza maneno na wakafuata yaliyo bora kabisa, hao ndio Mwenyezi Mungu amewaongoa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mwenye kushika njia kutafuta elimu, Mwenyezi Mungu humsahilishia njia ya kwenda Peponi.",
      },
    ],
    actions: [
      "Soma hadithi moja ya nabii kila wiki moja kwa moja kutoka kwenye Kurani.",
      "Weka kumbukumbu juu ya masomo ya vitendo, sio ukweli wa ratiba tu.",
      "Thibitisha simulizi za upili na wanavyuoni wanaoaminika.",
    ],
    disclaimer:
      "Tarehe za kihistoria na maeneo halisi yanaweza kutofautiana katika vyanzo; kitovu hiki kinaweka kipaumbele mwongozo uliokubaliwa, unaotegemea maandishi.",
    appLinks: [{}, {}],
  },
];

export const PROPHETS_BIO_TOPICS_SW: DeepPartial<ProphetsTopic>[] = [
  {
    title: "Adamu (AS)",
    summary:
      "Mwanadamu wa kwanza na nabii wa kwanza, aliheshimiwa kwa ujuzi na kujaribiwa kwa utii.",
    body: [
      "Adam (amani iwe juu yake) ndipo historia ya mwanadamu na utume huanzia. Mwenyezi Mungu alimuumba kwa mikono yake kutokana na udongo, akampulizia kutoka kwa roho yake, na akamfundisha majina ya kila kitu. Malaika walipoamrishwa kumsujudia Adam kwa heshima, walitii - lakini Iblis alikataa kwa kiburi, na tangu wakati huo uadui wake kwa Adam na kizazi chake ulitangazwa. Onyesho hili la ufunguzi linaweka drama kuu ya maisha ya kila mwanadamu: uchaguzi kati ya utiifu mnyenyekevu na uasi wa kiburi (Qur'ani 2:30–39).",
      "Mwenyezi Mungu alimweka Adam na mkewe Hawwa kwenye Pepo na akawaruhusu kila kitu isipokuwa mti mmoja tu. Walinong'onezwa na Shet'ani, wakala kutoka humo. Lakini tazama tafauti baina yao na Ibilisi: Ibilisi alihalalisha dhambi yake, hali Adam na Hawwa mara moja walijuta na wakarejea kwa Mwenyezi Mungu kwa maneno aliyowafundisha— ‘Mola wetu, tumejidhulumu nafsi zetu, na usipotusamehe na kuturehemu, bila shaka tutakuwa miongoni mwa wenye hasara’ (Qur’an 7:23). Mwenyezi Mungu akawakubalia toba yao na akawatuma duniani kwa ahadi ya uongofu kwa wote watakaofuata.",
      "Somo la Adam ni somo la matumaini: Mwanadamu anaheshimika na kustahiwa, lakini anajaribiwa na atateleza. Kinachobainisha muumini si kutokuwa na dhambi - ni Mwenyezi Mungu tu ndiye mkamilifu - bali ni kurejea haraka na kwa ikhlasi katika tawbah. Hadithi ya Adam pia inafundisha kwamba Shetani ni adui aliyetangazwa, aliye wazi ambaye silaha yake pekee ni kunong'ona; jawabu ni kumdhukuru Mwenyezi Mungu na kuomba msamaha wake. Tangu Adamu na kuendelea, kushuka duniani si adhabu bali ni hatua ya mtihani halisi wa wanadamu.",
    ],
    profile: {
      nation: "Ubinadamu wa mapema",
      location: "Jannah kisha ardhi",
      era: "Mwanzo wa historia ya mwanadamu",
      mission: "Wafundishe watu wa mwanzo tawhiyd na utiifu kwa Mwenyezi Mungu.",
      challenges: [
        "uadui wa Iblis",
        "Maisha baada ya kushuka duniani",
        "Kuongoza familia ya kwanza ya kibinadamu",
      ],
      miracles: [
        "Uumbaji kwa amri ya Mwenyezi Mungu bila wazazi",
        "Kufundishwa majina ya vitu vyote",
      ],
      majorEvents: [
        "Uumbaji wa Adamu na mafundisho ya majina",
        "Kusujudu kwa Malaika na kukataa kwa Iblis",
        "Kuteleza katika Pepo, toba ya kweli, na kushuka duniani",
      ],
      lessons: [
        "Heshima ya mwanadamu inakuja pamoja na wajibu",
        "Toba ya dhati hufungua tena mlango baada ya kosa lolote",
        "Shetani ni adui aliye wazi na wa kudumu",
      ],
      facts: [
        "Adamu ndiye mwanadamu wa kwanza na nabii wa kwanza",
        "Toba yake ni kielelezo cha kwanza cha Qur'ani Tukufu cha tawbah",
      ],
    },
    quran: [
      {
        excerpt:
          "Na (mtaje) Mola wako Mlezi alipo waambia Malaika: Nitaweka katika ardhi mamlaka yenye kufuatana... Kisha Adam akapokea maneno kutoka kwa Mola wake Mlezi, na akakubali toba yake.",
      },
      {
        excerpt:
          "Wakasema: Mola wetu Mlezi tumejidhulumu nafsi zetu, na usipotusamehe na ukaturehemu, bila shaka tutakuwa miongoni mwa walio khasiri.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Siku ya Kiyama watu watamjia Adam na kusema: Wewe ni baba wa watu; tuombee kwa Mola wako Mlezi.",
      },
      {
        excerpt:
          "Adam na Musa walibishana. Musa akasema: Wewe ndiye ambaye Mwenyezi Mungu amekuumba kwa mkono wake. Adam akasema: Je, unanilaumu kwa jambo ambalo Mwenyezi Mungu aliniandikia kabla ya kuniumba? Basi Adam akamshinda Musa katika hoja.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Idris (AS)",
    summary:
      "Nabii mkweli aliyesifiwa kwa subira na kupandishwa na Mwenyezi Mungu kwenye daraja la juu.",
    body: [
      "Idris (amani iwe juu yake) ametajwa kwa ufupi tu ndani ya Qur-aan, lakini kila neno juu yake ni sifa. Mwenyezi Mungu anamwita ‘mtu wa kweli, Nabii’ (Qur’ani 19:56) na anamuorodhesha miongoni mwa wenye subira na wema pamoja na Ismail na Dhul-Kifl (Qur’ani 21:85–86). Hadithi yake inaonyesha kwamba mbele ya Mwenyezi Mungu, tabia ya mtu - ukweli, subira, ibada thabiti - ni muhimu zaidi kuliko urefu wa wasifu wake.",
      "Mwenyezi Mungu anasema juu yake, ‘Na tukampandisha daraja’ (Qur’ani 19:57). Wanachuoni wamelielewa hili kwa kurejea cheo chake kilichotukuka mbele ya Mwenyezi Mungu. Zaidi ya yale ambayo Qur’ani na ripoti sahihi zinathibitisha, ngano maarufu zilizoambatanishwa na Idris (kama vile kuwa wa kwanza kuandika kwa kalamu au taaluma mahususi za kidunia) hazithibitishwi kwa ushahidi wa kweli, hivyo muumini makini hushikamana na yale yanayothibitisha wahyi badala ya kuyapamba.",
      "Funzo la Idris ni kwamba ukaribu na Mwenyezi Mungu haupimwi kwa umaarufu au hadithi ndefu, bali kwa ikhlasi na uthabiti. Mja mtulivu, mkweli na dhabiti anaweza kushikilia nafasi mbele ya Mwenyezi Mungu kuliko wengi ambao historia inakumbuka kwa sauti kubwa.",
    ],
    profile: {
      era: "Vizazi vya mwanzo baada ya Adamu",
      mission: "Waite watu wamwabudu Mwenyezi Mungu kwa ukweli na uadilifu.",
      lessons: [
        "Ukweli huinua cheo cha mja",
        "Sio kila hadithi ya nabii ina maelezo ya kina - na hiyo ni kwa kubuni",
        "Uthabiti, uthabiti wa uaminifu unapendwa na Mwenyezi Mungu",
      ],
      facts: [
        "Ametajwa katika Qur'ani kuwa ni mkweli na nabii",
        "Imefafanuliwa kama kuinuliwa kwenye daraja la juu na Mwenyezi Mungu",
      ],
    },
    quran: [
      {
        excerpt:
          "Na mtaje katika Kitabu Idris. Hakika yeye alikuwa mtu wa kweli na Nabii. Na tukampandisha daraja.",
      },
      {
        excerpt:
          "Na Ismail na Idris na Dhul-Kifl - wote walikuwa miongoni mwa wenye subira. Na tukawaingiza katika rehema yetu; Hakika hao walikuwa miongoni mwa watu wema.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nuh (AS)",
    summary:
      "Mjumbe wa subira ya ajabu ambaye aliwaita watu wake kwa karne nyingi kabla ya gharika.",
    body: [
      "Nuh (Swalla Allaahu 'alayhi wa aalihi wa sallam) alitumwa kwa watu walioacha tawhiyd na kuabudu masanamu. Ujumbe wake mmoja usiotetereka ulikuwa: 'Enyi watu wangu, mwabuduni Mwenyezi Mungu; nyinyi hamna mungu ila Yeye.” (Qur’ani 7:59). Qur'ani Tukufu inahifadhi maelezo yake ya utume katika Surah Nuh: aliwaita usiku na mchana, hadharani na kwa siri, akiwahimiza na kuwaonya - akiwakumbusha kwamba kurudi kwa Mwenyezi Mungu kunaleta mvua, mali, watoto na bustani. Lakini kizazi baada ya kizazi, wengi walikengeuka, wakaweka vidole vyao masikioni mwao, na wakazidi kuwa na kiburi (Kurani 71:1–28).",
      "Qur'ani inasisitiza urefu kamili wa subira yake: alibaki miongoni mwao 'miaka elfu chini ya hamsini' (Qur'ani 29:14), na bado wachache tu waliamini. Ilipodhihirika kuwa hakuna imani tena, Mwenyezi Mungu alimuamuru kujenga safina chini ya maelekezo ya Mwenyezi Mungu huku makafiri wakifanya mzaha. Kisha maji ya gharika yakaja kama hukumu. Mtoto wa Nuh mwenyewe alikataa kupanda ndege, akiuamini mlima juu ya onyo la baba yake, na alikuwa miongoni mwa wale waliokufa maji - ukumbusho wa kutoboa kwamba uhusiano wa damu hauwezi kuchukua nafasi ya imani (Qur'ani 11:42-46).",
      "Hadithi ya Nuh ni daraja kuu la Qur'ani katika da'wah: wajibu wa mlinganiaji ni ikhlasi, subira, utoaji wa wazi - matokeo ni ya Mwenyezi Mungu peke yake. Pia inafundisha kwamba mwongozo ni suala la moyo, si ukoo: mwana wa nabii anaweza kupotea, wakati wageni wanaweza kuokolewa. Waumini walioingia kwenye safina wakawa mbegu ya ubinadamu upya, na Nuh anaheshimiwa kama mmoja wa wajumbe watano wakubwa wa azimio thabiti (ulul-'azm).",
    ],
    profile: {
      nation: "Watu wake kabla ya gharika",
      location: "Mkoa wa Kale wa Mesopotamia (imetajwa kwa mapana)",
      era: "Zamani mapema sana",
      mission: "Waite watu wake kwenye tawhiyd na toba.",
      challenges: [
        "Kejeli kutoka kwa viongozi na wasomi",
        "Karne nyingi za kukataliwa na waumini wachache",
        "Kutokuamini na kuzama kwa mwanawe mwenyewe",
      ],
      miracles: ["Safina iliyojengwa kwa maagizo ya kimungu", "Wokovu wa waumini kupitia gharika"],
      majorEvents: [
        "Wito wa tawhiyd unaodumu kwa takriban miaka elfu moja",
        "Ujenzi wa jahazi kwa amri ya Mwenyezi Mungu",
        "Gharika na mwanzo mpya kwa waumini",
      ],
      lessons: [
        "Kudumu katika daawa, na kumwachia Mwenyezi Mungu matokeo",
        "Mahusiano ya familia hayawezi kuchukua nafasi ya imani",
        "Mwenyezi Mungu huwaokoa wenye ikhlasi",
      ],
      facts: [
        "Mmoja wa wajumbe watano wa azimio thabiti (ulul-'azm)",
        "Hadithi yake inaonekana katika surah nyingi, ikiwa ni pamoja na moja iliyopewa jina lake",
      ],
    },
    quran: [
      {
        excerpt:
          "Na akateremshiwa Nuh kuwa hataamini katika watu wako ila wale waliokwisha amini, basi usihuzunike kwa yale waliyokuwa wakiyafanya.",
      },
      {
        excerpt:
          "Akasema: Mola wangu Mlezi, hakika mimi niliwaita watu wangu usiku na mchana, lakini mwito wangu haukuwazidishia kukimbia.",
      },
    ],
    hadith: [
      {
        excerpt: "Watu watamjia Nuh na kusema: Ewe Nuhu! utuombee.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Hud (AS)",
    summary: "Imetumwa kwa A'ad, watu wenye nguvu na wasimamizi wanaogeuza nguvu zao kuwa kiburi.",
    body: [
      "Hud (amani iwe juu yake) alitumwa kwa watu wa Ad, ustaarabu ambao Qur'ani inaueleza kuwa wenye nguvu za kimwili na maarufu kwa kujenga majengo marefu na ya kifahari 'ambayo mfano wake haujapata kuumbwa katika ardhi' (Qur'ani 89:6-8). Kwa watu hawa wenye kiburi, Hud alileta ujumbe sawa na kila Mtume: 'Enyi watu wangu, mwabuduni Mwenyezi Mungu; huna mungu ila Yeye. Je! hamtamwogopa? (Kurani 7:65). Alikuwa mmoja wao, asiyeomba malipo, ila akiwaita kwenye shukrani na mbali na dhuluma.",
      "Viongozi wao wakajibu kwa dhihaka, wakimshtaki kwa upumbavu na uwongo, akishikamana na sanamu za baba zao. Walimpa changamoto ya kuleta adhabu aliyoonya, wakiwa na uhakika kwamba hakuna nguvu inayoweza kuendana na nguvu zao (Kurani 46:21–25). Hud aliwaonya waziwazi kwamba uwezo wa dunia na ustaarabu mkubwa haumlinde yeyote ambaye anazikanusha Ishara za Mwenyezi Mungu na kufanya kiburi juu ya ardhi.",
      "Hukumu ilikuja kama upepo mkali wa kuunguruma ambao Mwenyezi Mungu ‘aliweka juu yao kwa mikesha saba na siku nane mfululizo’ (Qur’ani 69:6–7), na kuwaacha watu waliokuwa wenye nguvu wakiwa wameanguka kama vigogo watupu — huku Hud na waumini wakiokolewa kwa rehema ya Mwenyezi Mungu. Hadithi ya Ad inarudiwa katika Qur'ani yote kama onyo la kudumu: nguvu, mali, na mafanikio ni zawadi zinazopaswa kupatikana kwa unyenyekevu na shukrani, na sio kiburi. Umma unawajibika kwa Mwenyezi Mungu hata ukiwa umeendelea kiasi gani.",
    ],
    profile: {
      nation: "Watu wa 'Ad",
      location: "Eneo la Al-Ahqaf (eneo la kusini mwa Arabia katika tafsir ya kitambo)",
      era: "Baada ya Nuh",
      mission: "Rejesha Tawhiyd, shukurani na uadilifu baina ya A'ad.",
      challenges: [
        "Jeuri ya pamoja iliyojengwa juu ya nguvu na mali",
        "Mzaha wa wahyi na mtume",
        "Mahitaji ya dharau ya adhabu ya haraka",
      ],
      miracles: ["Ulinzi wa Waumini wakati wa adhabu"],
      majorEvents: [
        "Wito wa toba na shukrani",
        "Onyo la upepo mkali",
        "Kuangamizwa kwa A'ad kwa siku saba na siku nane",
      ],
      lessons: [
        "Nguvu bila unyenyekevu husababisha uharibifu",
        "Mataifa na ustaarabu unawajibika kwa Mwenyezi Mungu",
        "Maonyo ya kinabii ni rehema iliyotumwa kabla ya hukumu",
      ],
      facts: ["Hadithi ya Ad inajirudia katika Qur'ani yote kama onyo kwa jumuiya za baadae"],
    },
    quran: [
      {
        excerpt:
          "Na kwa kina A'di tulimtuma ndugu yao Hud. Akasema: Enyi watu wangu! huna mungu ila Yeye. Je, hamtamwogopa?",
      },
      {
        excerpt:
          "Basi walipo liona wingu linakaribia mabonde yao, walisema: Hili ni wingu linalotuletea mvua! Bali ni yale mliyo kuwa mkiyavumilia, na upepo ndani yake ni adhabu chungu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Salih (AS)",
    summary:
      "Walitumwa kwa Thamud, ambao walipewa muujiza wa ngamia jike na wakaharibu ishara waliyoitaka.",
    body: [
      "Saleh (Swalla Allaahu ´alayhi wa sallam) alitumwa kwa Thamud, watu waliofuata baada ya A’ad na walikuwa mashuhuri kwa kuchonga majumba makubwa milimani na kuishi kwa starehe (Qur’ani 7:74). Aliwaita kama ndugu yao wamuabudu Mwenyezi Mungu peke yake na waache ufisadi wa viongozi wao. Walipotaka ishara ya kuthibitisha ukweli wake, Mwenyezi Mungu akaweka wazi na hadharani: ngamia jike mwenye mpangilio maalumu wa kumnywesha siku moja na wao siku nyengine (Qur'ani 26:155-156).",
      "Saleh aliwaonya kwa uwazi: “Msimguse kwa ubaya, msije mkashikwa na adhabu iliyo karibu.” (Qur’ani 26:156). Ishara ilikuwa mtihani wa kujizuia - je wangeweza kuheshimu mpaka uliowekwa na Mwenyezi Mungu? Lakini walio waasi zaidi miongoni mwao walimkata msuli na kumuua ngamia jike katika maasi ya wazi, kisha wakampa changamoto Saleh kuleta adhabu iliyoahidiwa (Qur'ani 7:77). Kuuawa kwa ngamia kunatajwa kuwa ni kitendo cha wanyonge wachache, lakini watu wote walishiriki uhalifu huo kwa kuridhia.",
      "Ikawapata adhabu katika muda wa siku tatu. Mlipuko mkubwa na tetemeko la ardhi likawashika majumbani mwao, na Thamudi wakawa wamelala bila uhai, na Mwenyezi Mungu akamuokoa Saleh na walioamini (Qur'ani 7:78-79; 91:14). Somo ni kali: miujiza hailainisha moyo mkaidi; wanainua tu vigingi vya uwajibikaji. Ishara iliyoombwa kisha ikapuuzwa inakuwa ni hoja dhidi ya walioidai. Na kunyamaza mbele ya uovu sio kutoegemea upande wowote - taifa zima liliwajibika kwa kitendo cha wachache.",
    ],
    profile: {
      nation: "Watu wa Thamud",
      location: "Al-Hijr / kaskazini magharibi mwa Arabia",
      era: "Baada ya 'Ad",
      mission: "Waite Thamud kutoka katika ushirikina na ufisadi kwenye tawhiyd.",
      challenges: [
        "Mahitaji ya muujiza, kisha kuukataa",
        "Uasi wazi baada ya ishara wazi kutolewa",
        "Vitisho dhidi ya Saleh na Waumini",
      ],
      miracles: ["Ngamia jike alitumwa kuwa ni Ishara itokayo kwa Mwenyezi Mungu"],
      majorEvents: [
        "Kuonekana kwa ngamia-jike na maji ya pamoja",
        "Kunyongwa na kuuawa kwa ngamia-jike",
        "Mlipuko uliowaangamiza waliokataa",
      ],
      lessons: [
        "Miujiza hainufaishi moyo mkaidi",
        "Kuvunja mpaka uliowekwa na Mwenyezi Mungu hubeba matokeo ya kweli",
        "Kukubali uovu kunashiriki katika hatia yake",
      ],
      facts: ["Thamud walijulikana kwa kuchonga nyumba za kifahari kwenye milima"],
    },
    quran: [
      {
        excerpt:
          "Huyu ni ngamia wa Mwenyezi Mungu kuwa ni Ishara kwenu, basi mwacheni ale katika ardhi ya Mwenyezi Mungu, wala msimguse kwa madhara, isije ikakushikeni adhabu chungu.",
      },
      {
        excerpt:
          "Thamud walikanusha kwa sababu ya uasi wao, alipo tumwa mnyonge zaidi wao... Basi Mola wao Mlezi akawateremshia maangamizi kwa dhambi zao na akawasawazisha.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ibrahim (AS)",
    summary:
      "Khalilullah, rafiki wa Mwenyezi Mungu na kigezo cha tawhidi safi, aliyejaribiwa na kushinda katika kila mtihani.",
    body: [
      "Ibrahim (amani iwe juu yake) ndiye kielelezo kikuu cha Qur'ani Tukufu cha tauhidi safi iliyofikiwa kwa kutafakari na ujasiri. Akiwa kijana katika jamii iliyozama katika ibada ya sanamu, alisababu waziwazi na watu wake, baba yake, na hata mfalme: jua, mwezi, na nyota vyote vinatua na kufifia, hivyo vingewezaje kuwa miungu? (Qur’ani 6:75–79). Ili kufichua kutokuwa na nguvu kwa masanamu hayo, aliyavunja yote isipokuwa makubwa zaidi na kuwaambia watu wake waulize masanamu wenyewe kilichotokea - kuwalazimisha kukiri miungu yao haiwezi kusema wala kujitetea (Qur'ani 21:57-67).",
      "Kwa ajili ya kisimamo hiki alitupwa kwenye moto mkali, lakini Mwenyezi Mungu akaamuru, ‘Ewe moto, kuwa baridi na usalama juu ya Ibrahim’ (Qur’ani 21:69), na akatoka bila kudhurika. Maisha yake yakawa ni mlolongo wa mitihani iliyokumbana na kujisalimisha kabisa: aliiacha nchi yake kwa ajili ya Mwenyezi Mungu, akaswali kizazi chenye haki katika uzee na akapewa Ismail na Is-haq, alijaribiwa kwa amri ya kumchinja mwanawe kipenzi - ambayo baba na mwana waliikubali kwa kunyenyekea mbele ya Mwenyezi Mungu kumkomboa kijana - na akainua misingi ya Ka'abah miongoni mwa waumini wa Makka na kutumwa kwa Ismaili Makka. yao (Qur’ani 2:124–129; 37:100–107).",
      "Kwa sababu ya ibada hii isiyo na kifani, Mwenyezi Mungu alimchukua Ibrahim kama khalil - rafiki wa karibu (Qur'ani 4:125) - na akamfanya imamu, kiongozi wa wanadamu wote (Qur'ani 2:124). Urithi wake unapitia kwa Mitume waliotoka katika ukoo wake, kupitia ibada za Hijja, na kupitia utambulisho wa Mwislamu, ambaye ameamrishwa kufuata 'Dini ya Ibrahim, akielekea kwenye ukweli' (Qur'ani 3:95). Hadithi yake inafunza tawakkul katika mitihani migumu zaidi, kwamba uongozi wa kweli umejengwa juu ya dhabihu, na kwamba imani ya kweli inaweza kuunda upya vizazi vizima.",
    ],
    profile: {
      nation: "Jamii za Mesopotamia na Levantine",
      location: "Iraki, Mtukufu na Makka",
      era: "Zamani za kati",
      mission: "Ihuisha tawhiyd safi na uweke urithi wa kudumu wa utii.",
      challenges: [
        "Akikabiliana na waabudu masanamu, baba yake mwenyewe, na mfalme dhalimu",
        "Kuhama kutoka katika nchi yake kwa ajili ya Mwenyezi Mungu",
        "Kesi ya kumtoa mwanawe mpendwa",
      ],
      miracles: [
        "Moto ulifanya baridi na salama kwa amri ya Mwenyezi Mungu",
        "Uzao wa haki hutolewa katika uzee",
      ],
      majorEvents: [
        "Kujadiliana na kuvunja masanamu",
        "Kutupwa motoni na kutolewa",
        "Kujenga Al-Ka'bah pamoja na Ismail na mtihani mkubwa wa kafara",
      ],
      lessons: [
        "Tawakkul (kumtegemea Mwenyezi Mungu) katika mitihani mikali zaidi",
        "Uongozi wa kweli unahitaji dhabihu",
        "Imani ya dhati inaweza kuunda upya vizazi",
      ],
      facts: [
        "Anajulikana kama Khalilullah, rafiki wa karibu wa Mwenyezi Mungu",
        "Babu wa Mitume kupitia Ismail na Ishaq",
      ],
    },
    quran: [
      {
        excerpt:
          "Na pale Ibrahim alipo jaribiwa na Mola wake Mlezi kwa maamrisho na akazitekeleza. Akasema: Hakika mimi nitakufanya kiongozi kwa watu.",
      },
      {
        excerpt:
          "Tukasema: Ewe moto, kuwa baridi na salama juu ya Ibrahim. Na walimtakia mabaya, lakini tukawafanya wao ndio wenye hasara kubwa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Utakusanywa bila viatu, uchi, na bila kutahiriwa. Wa kwanza kuvikwa nguo Siku ya Kiyama atakuwa Ibrahim.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Lut (AS)",
    summary:
      "Nabii ambaye aliwaonya watu wake dhidi ya uasherati mkubwa ambao hakuna taifa lililofanya kabla yao.",
    body: [
      "Lut (amani iwe juu yake) alikuwa ni mtu wa zama na jamaa wa Ibrahim ambaye alihama pamoja naye na kisha akatumwa kwa watu wa Sodoma na miji ya karibu. Sambamba na mwito wa kumwabudu Mwenyezi Mungu peke yake, watu wake walikuwa na hatia ya uasherati usio na haya Qur’ani inasema ‘hakuna yeyote katika walimwengu wote aliyefanya kabla’—kuwaendea wanaume badala ya wanawake, na kufanya mambo machafu waziwazi katika mikusanyiko yao (Qur’ani 7:80–81; 29:28–29). Lut'i akawaita, kwa ikhlasi, kwenye usafi na kwenye mipaka ya asili aliyoiweka Mwenyezi Mungu.",
      "Walikutana na mageuzi yake si kwa mabishano bali kwa uadui, wakitishia kumfukuza na kudhihaki wito wake wa adabu: 'Wafukuzeni katika mji wenu; hao ni watu wanaojiweka safi! (Qur’ani 7:82). Hata ndani ya nyumba yake mtihani ulikuwa mkubwa - mke wake alikuwa upande wa mafisadi na hakuamini, akithibitisha tena kwamba uwongofu umetolewa na Mwenyezi Mungu na haurithiwi kwa ndoa au damu (Qur'ani 66:10).",
      "Ilipokuja amri, Mwenyezi Mungu aliwatuma Malaika katika sura ya wageni. Watu wakakimbilia kuwadhuru, na Lut'i alijiona hana uwezo mpaka Malaika wakadhihirisha utambulisho wao na wakamwambia aondoke na Waumini usiku. Kulipopambazuka miji ilipinduliwa na kurushwa kwa mawe (Qur’ani 11:77–83). Hadithi ya Lut ni onyo la wazi kwamba ukweli wa kimaadili haubadiliki kwa sababu jamii inakubali dhambi na kuifanya kuwa ya kawaida hadharani - na kwamba Mwenyezi Mungu huwaokoa waaminifu, hata wawe wachache.",
    ],
    profile: {
      nation: "Watu wa Sodoma na miji ya jirani",
      location: "Mkoa wa Bahari ya Chumvi (imetajwa kwa mapana)",
      era: "Wakati wa Ibrahim",
      mission: "Waite watu wake kutokana na uchafu ulio wazi na ukafiri kwenye tawhiyd na usafi.",
      challenges: [
        "Uasherati ulioimarishwa kwa umma",
        "Kejeli na vitisho vya kufukuzwa",
        "Kutokuamini kwa mke wake mwenyewe",
      ],
      majorEvents: [
        "Maonyo ya kudumu dhidi ya uchafu",
        "Ziara ya Malaika waliojigeuza kuwa wageni",
        "Kupinduliwa kwa miji",
      ],
      lessons: [
        "Ukweli wa maadili haubadiliki kwa idhini ya kijamii",
        "Waumini wanaweza kuwa wachache sana",
        "Mwenyezi Mungu huwaokoa wanyoofu na maangamizo ya pamoja",
      ],
      facts: ["Jamaa wa Ibrahim ambaye alihama pamoja naye na kupelekwa Sodoma"],
    },
    quran: [
      {
        excerpt:
          "Je, mnawaendea wanaume katika walimwengu na mnaacha alivyo kuumbieni Mola wenu Mlezi? Bali nyinyi ni watu wapotovu.",
      },
      {
        excerpt:
          "Basi ilipo fika amri yetu tuliifanya sehemu ya juu ya miji kuwa chini kabisa, na tukawanyeshea mvua ya mawe ya udongo mgumu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ismail (AS)",
    summary:
      "Nabii mwaminifu kwa neno lake, mvumilivu katika majaribio, na mjenzi wa Al Kaaba pamoja na baba yake Ibrahim.",
    body: [
      "Ismail (rehema na amani ziwe juu yake) alikuwa mtoto wa kwanza wa Ibrahim, aliyepewa katika uzee. Maisha yake yalianza na mtihani mkubwa wa kuaminiana: kwa amri ya Mwenyezi Mungu, Ibrahim alimwacha mtoto Ismail na mama yake Hajar kwenye bonde tasa la Makka, ambako hakukuwa na mazao na hakuna maji yanayotiririka. Ilikuwa hapo, wakati Hajar akikimbia kutafuta maji kati ya vilima vya Safa na Marwah, ndipo Mwenyezi Mungu aliposababisha chemchemi ya Zamzam kutiririka - kitendo cha riziki ambacho kizazi cha Hajar na kila hujaji wanakiigiza katika sa'i ya Hija na Umra hadi leo.",
      "Akiwa kijana, Ismail alikutana na mtihani mkubwa zaidi akiwa pamoja na baba yake: Ibrahim alipomwambia juu ya njozi ya kumchinja, Ismail alijibu kwa utii wa kustaajabisha, 'Ewe baba yangu, fanya kama unavyoamrishwa; Mtanikuta Mwenyezi Mungu akipenda ni miongoni mwa wanaosubiri.” (Qur’ani 37:102). Wote wawili wakasalimu amri, na Mwenyezi Mungu akamkomboa Ismail kwa dhabihu kubwa, akiheshimu utii wao milele. Baba na mwana kisha wakainua misingi ya Al-Ka'bah pamoja, wakiomba, 'Mola wetu, tukubalie haya; Hakika Wewe ni Mwenye kusikia, Mjuzi” (Qur’ani 2:127).",
      "Qur'ani Tukufu inajumlisha tabia yake katika mstari unaostahili kukariri: 'Alikuwa mkweli wa ahadi yake, na alikuwa Mtume na Nabii. Alikuwa akiwaamrisha jamaa zake kuswali na zaka, na alikuwa akimridhia Mola wake Mlezi” (Qur’ani 19:54–55). Maisha ya Ismail yanafunza uzuri wa kushika neno lako, wa ibada thabiti, na wa familia kushirikiana katika kumtii Mwenyezi Mungu. Kupitia yeye, unabii wa Uarabuni hatimaye ulimfikia Mtume wa mwisho, Muhammad ﷺ.",
    ],
    profile: {
      nation: "Watu wa mwanzo wa eneo la Makka",
      location: "Makka",
      era: "Baada ya kuhama kwa Ibrahim",
      mission: "Shika Tawhiyd na ́ibaadah, na uwaamrishe jamaa zake kuswali na zaka.",
      challenges: [
        "Mwanzo mbaya wa maisha katika bonde lisilo na matunda",
        "Kesi ya dhabihu",
        "Kudumisha maisha yanayotegemea ibada na amana takatifu",
      ],
      miracles: [
        "Chemchemi ya Zamzam ilitolewa jangwani",
        "Kukombolewa kutokana na kafara na Mwenyezi Mungu",
      ],
      majorEvents: [
        "Akaondoka na mama yake Hajar katika bonde la Makka",
        "Kesi ya dhabihu, ilikutana na utii kamili",
        "Kujenga Al-Ka'bah pamoja na Ibrahim",
      ],
      lessons: [
        "Timiza ahadi zako kwa uaminifu",
        "Familia inaweza kushirikiana katika ibada na utii",
        "Urithi mtakatifu unadai tabia dhabiti",
      ],
      facts: [
        "Imefafanuliwa ndani ya Qur'ani kuwa ni kweli kwa ahadi yake",
        "Babu wa makabila ya Waarabu na mstari wa mwisho wa kinabii",
      ],
    },
    quran: [
      {
        excerpt:
          "Na mtaje katika Kitabu Ismail. Hakika yeye alikuwa mkweli katika ahadi yake, na alikuwa ni Mtume na Nabii. Alikuwa akiwaamrisha jamaa zake kuswali na zaka, na alikuwa akimridhia Mola wake Mlezi.",
      },
      {
        excerpt:
          "Na Ibrahim alipo simamisha misingi ya Nyumba na Ismail, wakaomba: Mola wetu Mlezi, tukubalie haya. Hakika Wewe ni Mwenye kusikia, Mjuzi.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Ishaq (AS)",
    summary: "Nabii aliyebarikiwa aliyetolewa kama bishara kwa Ibrahim na baba yake Ya'qub.",
    body: [
      "Is-haq (amani iwe juu yake) alizaliwa kwa Ibrahim na mkewe Sara katika uzee wao - kuzaliwa kulikotangazwa na Malaika kama bishara njema pale Sara alipopita umri wa kuzaa, alicheka kwa mshangao. Qur'ani inaandika tukio hili: 'Tulimpa bishara ya Ishaq na, baada ya Ishaq, Ya'qub' (Qur'ani 11:71). Kuzaliwa kwake kulikuwa ni ishara kwamba uwezo na rehema za Mwenyezi Mungu hazifungwi na mipaka ya kawaida ya mwanadamu, na faraja kwa kila muumini anayengojea tumaini gumu.",
      "Kurani mara kwa mara inamtaja Ishaq miongoni mwa manabii waadilifu, wateule, na watukufu, ikimwelezea yeye na Ya'qub kuwa walipewa 'nguvu katika ibada na maono' (Qur'ani 38:45–47). Kupitia kwa Ishaq alikuja Ya'qub (Isra'il), na kutoka kwa Ya'qub walishuka msururu mrefu wa manabii waliotumwa kwa Bani Isra'il - hivi kwamba Ishaq anasimama kama baba wa unabii, kiungo katika mwendelezo wa mwongozo katika vizazi vyote.",
      "Hadithi yake, ingawa imesimuliwa kwa ufupi, ina mafunzo mawili ya kudumu: shukrani kwa ajili ya zawadi ambazo Mwenyezi Mungu hutoa zaidi ya matarajio yetu, na ufahamu kwamba ukoo wa haki ni amana - imani lazima ipitishwe, si kurithi tu. Baraka iliyowekwa katika nyumba ya Ibrahim ilihifadhiwa kwa sababu ilibebwa na waja waliojitolea kwa Mwenyezi Mungu.",
    ],
    profile: {
      nation: "Jumuiya za Levantine",
      location: "The Levant (Sham)",
      era: "Baada ya Ibrahim",
      mission: "Endelea mwongozo wa kinabii katika ukoo uliobarikiwa wa Ibrahim.",
      miracles: ["Kuzaliwa kutangazwa kwa wazazi wazee kama habari njema"],
      majorEvents: [
        "bishara njema waliyopewa Ibrahim na Sara",
        "Muendelezo wa nasaba ya unabii kupitia kwa Ya'qub",
      ],
      lessons: [
        "Mwenyezi Mungu hutoa zaidi ya matarajio ya mwanadamu",
        "Ukoo wa haki ni uaminifu unaopaswa kuhifadhiwa",
        "Kufuatana kwa uaminifu huweka mwongozo hai",
      ],
      facts: ["Baba wa Ya'qub", "Imetajwa pamoja na Ibrahim na Ya'qub kama familia iliyochaguliwa"],
    },
    quran: [
      {
        excerpt:
          "Na mkewe alikuwa amesimama, naye akacheka. Kisha tukampa bishara ya Is-haq, na baada ya Is-haq, Yaaqub.",
      },
      {
        excerpt:
          "Na wakumbuke waja wetu Ibrahim na Is-haq na Yaaqub, wenye nguvu na wenye kuona. Hakika Sisi tuliwateua kwa ubora wa kipekee: ukumbusho wa Nyumba.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ya'qub (AS)",
    summary:
      "Pia anaitwa Isra'il, nabii ambaye subira yake nzuri kupitia huzuni ni mfano wa kumtegemea Mwenyezi Mungu bila kuyumba.",
    body: [
      "Ya'qub (amani iwe juu yake), anayeitwa pia Isra'il, alikuwa mtoto wa Is-haq na baba wa wale kumi na wawili ambao walikuja kuwa makabila ya Bani Isra'il - akiwemo Yusuf. Aliwalea watoto wake juu ya tawhiyd, na Qur’ani inahifadhi ahadi aliyoichukua kutoka kwao kwenye kitanda chake cha kufa: ‘Mtaabudu nini baada yangu? Wakajibu, ‘Tutamuabudu Mungu wako na Mungu wa baba zako... Mungu mmoja, na Kwake tunasilimu’ (Qur’ani 2:132–133). Hangaiko lake kuu, hadi mwisho kabisa, lilikuwa imani ya kizazi kijacho.",
      "Mtihani wake mkubwa unajitokeza ndani ya kisa cha Yusuf. Wanawe waliporudi na kanzu ya Yusuf na madai ya uwongo kwamba mbwa-mwitu amemla, Yaaqub aliona udanganyifu huo na hakujibu kwa hasira bali kwa kujizuia: “Basi subira inafaa zaidi, na Mwenyezi Mungu ndiye anayeombwa msaada wake juu ya hayo mnayoyaeleza” (Qur’ani 12:18). Kwa miaka mingi ya kutengana alihuzunika hadi, kama vile Qur'ani inavyosema kwa uchungu, macho yake yakabadilika kuwa meupe kutokana na huzuni - lakini aliizuia huzuni yake na kamwe hakukata tamaa (Qur'ani 12:84).",
      "Moyo wa mfano wa Ya'qub ni sentensi moja: 'Usikate tamaa na rehema ya Mwenyezi Mungu; Hakika hawakati tamaa na rehema ya Mwenyezi Mungu isipokuwa watu makafiri.” (Qur’ani 12:87). Yeye ndiye kielelezo cha sabr jamil - subira nzuri - ambayo si kujiuzulu tu bali ni matumaini yenye matumaini kwamba hekima ya Mwenyezi Mungu itadhihirika kwa wakati wake. Hatimaye Yusuf aliporejeshwa kwake na macho yake yakarejea, subira hiyo ilithibitishwa. Ya'qub anamfundisha kila muumini mwenye kuhuzunika kushikilia huzuni na yakini katika moyo mmoja.",
    ],
    profile: {
      nation: "Asili ya Bani Israil",
      location: "Levant, pamoja na kuhamia Misri",
      era: "Kizazi cha Yusuf",
      mission: "Waongoze watu wa nyumbani mwake na kizazi chake katika tawhiyd.",
      challenges: [
        "Mivutano na wivu miongoni mwa wanawe",
        "Kutengana kwa muda mrefu na Yusuf",
        "Kuvumilia huzuni kubwa bila kukata tamaa",
      ],
      majorEvents: [
        "Nasaha na agano lake la tawhiyd kwa wanawe",
        "Miaka mingi ya huzuni ya subira juu ya Yusuf",
        "Kukutana tena kwa furaha na Yusuf huko Misri",
      ],
      lessons: [
        "Uvumilivu mzuri (sabr jamil) ni imani hai, yenye matumaini",
        "Wazazi huunda urithi wa imani wa watoto wao",
        "Usikate tamaa na rehema za Mwenyezi Mungu",
      ],
      facts: ["Pia inaitwa Israeli", "Baba wa Yusuf na makabila ya Bani Israil"],
    },
    quran: [
      {
        excerpt:
          "Akasema: Bali nafsi zenu zimekuteseni kwenye kitu. Kwa hiyo subira inafaa zaidi. Huenda Mwenyezi Mungu akawaleta kwangu wote pamoja.",
      },
      {
        excerpt:
          "Wakasema: Tutamuabudu Mungu wako na Mungu wa baba zako, Ibrahim na Ismail na Is-haq, Mungu mmoja, na sisi tunasilimu kwake.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yusuf (AS)",
    summary:
      "Nabii ambaye safari yake kutoka kisimani hadi kwenye kiti cha enzi cha Misri inafundisha usafi, subira, na msamaha.",
    body: [
      "Yusuf (amani iwe juu yake) ndiye mada ya simulizi moja kamili zaidi ya Qur'ani - Sura Yusuf, ambayo Mwenyezi Mungu anaiita 'hadithi bora zaidi' (Qur'ani 12:3). Akiwa mvulana aliona ndoto ya kweli ya nyota kumi na moja, jua, na mwezi ukimsujudia. Ndugu zake wenye wivu walimtupa ndani ya kisima na kumuuza utumwani huko Misri, ambako alinunuliwa katika nyumba ya ofisa mmoja mwenye nguvu. Katika kila mabadiliko, Yusuf alilinda imani yake na uadilifu wake.",
      "Usafi wake ulijaribiwa wakati mke wa bwana wake alipojaribu kumtongoza. Alikataa kwa kusema, “Najikinga kwa Mwenyezi Mungu,” na akapendelea jela kuliko dhambi: “Jela ninaipenda zaidi kuliko ile wanayoniitia” (Qur’ani 12:33). Ingawa hakuwa na hatia, alifungwa kwa miaka mingi - na hata huko aliwaita wafungwa wenzake kwa tawheed na kutafsiri ndoto zao. Wakati ndoto ya mfalme mwenyewe kuhusu miaka saba ya njaa ilipotatiza mahakama, zawadi ya tafsiri ya Yusufu aliyopewa na Mungu ilimleta mbele ya mfalme, ambaye alimweka msimamizi wa hazina za Misri. Alisimamia taifa kupitia njaa kwa hekima na haki.",
      "Kilele cha hadithi sio nguvu bali msamaha. Ndugu zake waliposimama mbele yake kwa njaa, bila ya kumtambua, Yusuf akajidhihirisha na kusema: 'Leo hamtakuwa na lawama. Mwenyezi Mungu atakusameheni, naye ni Mwingi wa kurehemu kuliko wanaorehemu.” (Qur’ani 12:92). Alimtukuza Mwenyezi Mungu kwa kila kheri, akisema Mola wake Mlezi alikuwa ni mwema pale alipomtoa gerezani na kuiunganisha familia. Yusuf anafundisha kwamba usafi na taqwa humlinda Muumini, kwamba mpango wa Mwenyezi Mungu hupita kimya kimya kila njama ya mwanadamu, na kwamba msamaha - sio kisasi - ni alama ya mtukufu.",
    ],
    profile: {
      nation: "ukoo wa Bani Israil huko Misri",
      location: "Kanaani na Misri",
      era: "Kabla ya Musa",
      mission: "Simamisha tawhiyd, usafi na uadilifu huku ukiitumikia jamii.",
      challenges: [
        "Kusalitiwa na ndugu zake",
        "Majaribu na kashfa za uwongo",
        "Kifungo cha muda mrefu licha ya kutokuwa na hatia",
      ],
      miracles: ["Karama tuliyopewa na Mungu ya tafsiri ya kweli ya ndoto"],
      majorEvents: [
        "Kisima na kutengwa na baba yake",
        "Miaka ya kifungo",
        "Kupanda mamlaka katika Misri na kuungana tena na familia yake",
      ],
      lessons: [
        "Usafi na uadilifu hulinda imani",
        "Msamaha huponya familia",
        "Mpango wa Mwenyezi Mungu unapita kila njama ya mwanadamu",
      ],
      facts: ["Sura yote ya Yusuf, inayoitwa hadithi bora zaidi, inahusu maisha yake"],
    },
    quran: [
      {
        excerpt:
          "Akasema: Hapana lawama juu yenu leo. Mwenyezi Mungu akusamehe; Naye ni Mwingi wa kurehemu kuliko wanaorehemu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mtukufu, mwana wa mtukufu, mwana wa mtukufu, mwana wa mtukufu: Yusuf, mwana wa Ya'qub, mwana wa Ishaq, mwana wa Ibrahim.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shu'ayb (AS)",
    summary:
      "Mtume ambaye alifungamanisha imani na uaminifu katika biashara na akawaonya Madyana dhidi ya ulaghai na dhulma.",
    body: [
      "Shuayb (amani iwe juu yake) alitumwa kwa watu wa Madyan, jumuiya ya wafanyabiashara iliyoharibu uchumi wake kwa kulaghai, kutoa kipimo na mizani, kuwanyang'anya watu mali zao, na kueneza dhulma katika ardhi. Ujumbe wake uliunganisha nusu mbili za imani ambazo watu mara nyingi hujaribu kutenganisha - ibada na maadili: 'Enyi watu wangu, mwabuduni Mwenyezi Mungu; huna mungu ila Yeye. Na timizeni kipimo na mizani kwa uadilifu, wala msiwanyime watu haki yao.” (Qur’ani 11:84–85).",
      "Watu wake walipinga, wakiuliza kwa kejeli iwapo maombi yake yaliwataka waache mila potofu za baba zao na wafanye wapendavyo kwa mali zao (Qur’ani 11:87). Walimdhihaki, wakamtishia yeye na waumini kumfukuza, na hata wakafunga njia. Shu'ayb aling'ang'ania kwa huruma na mawaidha yaliyo wazi, akisisitiza kuwa alitafuta marekebisho kadiri awezavyo, na kwamba kufaulu kwake kumetoka kwa Mwenyezi Mungu peke yake: 'Na kufaulu kwangu si kwa ila kwa Mwenyezi Mungu. Kwake Yeye nimetegemea, na Kwake Yeye nitarejea” (Qur’ani 11:88). Anakumbukwa kwa ufasaha wake wa kuwaita watu wake.",
      "Walipong’ang’ania kukataa, adhabu ilikuja na kuwakamata madhalimu, na Mwenyezi Mungu akamuokoa Shuayb na Waumini (Qur’ani 7:91–93). Wasifu wake unatoa somo ambalo mara nyingi hupuuzwa: uaminifu wa kiuchumi sio tofauti na dini - ni sehemu yake. Ulaghai sokoni, kuwanyonya walio hatarini, na mbinu za ghiliba ni mambo ya imani, na jamii inayohalalisha dhulma inakaribisha hukumu ya Mwenyezi Mungu.",
    ],
    profile: {
      nation: "Watu wa Madyana",
      location: "Eneo la biashara la Kaskazini-magharibi mwa Arabia / Levantine",
      era: "Baada ya kizazi cha Ibrahim",
      mission: "Wito wa tawhiyd na uaminifu na uadilifu katika biashara.",
      challenges: [
        "Ufisadi wa soko uliokithiri",
        "Kejeli kutoka kwa wasomi",
        "Vitisho vya kufukuzwa",
      ],
      majorEvents: [
        "Wito wa kipimo kamili na shughuli za haki",
        "Upinzani wa umma na vitisho",
        "Adhabu ya wanao dumu",
      ],
      lessons: [
        "Imani inadai uaminifu katika biashara",
        "Udhalimu wa hadharani hualika hukumu ya Mungu",
        "Manabii wanashughulikia maadili ya kijamii na kiuchumi, sio matambiko pekee",
      ],
      facts: ["Inajulikana kwa kusisitiza uzito na vipimo tu"],
    },
    quran: [
      {
        excerpt:
          "Enyi watu wangu, muabuduni Mwenyezi Mungu; huna mungu ila Yeye. Timizeni kipimo na mizani, wala msiwanyime watu haki yao, wala msifanye uharibifu katika ardhi.",
      },
      {
        excerpt:
          "Na kufaulu kwangu sio ila kwa Mwenyezi Mungu. Kwake Yeye nimetegemea, na Kwake nitarejea.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ayyub (AS)",
    summary:
      "Mfano wa subira wa Qur'ani: usiotikisika katika ibada kwa ugonjwa wa muda mrefu na hasara.",
    body: [
      "Ayyub (amani iwe juu yake) - Ayubu - ni alama ya kudumu ya sabr katika Qur'ani. Alikuwa nabii aliyebarikiwa kwa afya, mali, na familia, na kisha kujaribiwa kwa kuzipoteza, na kwa ugonjwa wa muda mrefu, wenye uchungu. Katika yote hayo hakuwa na uchungu wala kumshutumu Mola wake kwa dhulma; alishikilia sana shukrani na ukumbusho. Qur’ani inamsifu kwa maneno yanayonasa hadithi yake yote: ‘Hakika tulimkuta mvumilivu, mja mwema. Hakika yeye alikuwa ni mwenye kurejea kwa Mwenyezi Mungu mara kwa mara.” (Qur’ani 38:44).",
      "Wakati ugumu ulipozidi kuwa mkubwa, tazama adabu kamilifu (adab) za du'a yake. Hakudai au kulalamika dhidi ya hukumu ya Mwenyezi Mungu; kwa unyenyekevu na unyenyekevu aliweka hali yake mbele ya Mola wake Mlezi: “Hakika imenigusa dhiki, na Wewe ni mwingi wa kurehemu kuliko wanaorehemu” (Qur’ani 21:83). Alithibitisha rehema za Mwenyezi Mungu katika dakika ile ile ya kuomba. Mwenyezi Mungu akamjibu, akamwambia: Piga ardhi kwa mguu wako; hii ni bafu yenye ubaridi na kinywaji,’ na Akaiondolea dhiki na akairejesha familia yake na zaidi, kuwa ni rehema kutoka Kwake na ukumbusho kwa waja (Qur’ani 21:84; 38:41–43).",
      "Ayyub anafundisha kwamba subira si uvumilivu wa kupita kiasi bali ni aina ya ibada inayoendelea - kurudi kwa Mwenyezi Mungu mfululizo wakati wa majaribu. Mfano wake pia unaboresha jinsi tunavyoomba dua: kwa unyenyekevu, bila ya malalamiko dhidi ya amri, na kwa yakini katika rehema ya Mwenyezi Mungu. Na mwisho wake unamhakikishia kila Muumini aliyejaribiwa kwamba mitihani, iliyobebwa na imani, inaweza kupandisha daraja ya mja na daima hufuatiwa na unafuu katika muda wa Mwenyezi Mungu.",
    ],
    profile: {
      era: "Enzi ya unabii wa baada ya Ibrahimu (muktadha mpana)",
      mission: "Waongoze watu wake huku ukijumuisha subira na ibada katika shida.",
      challenges: [
        "Ugonjwa wa muda mrefu na chungu",
        "Kupoteza mali na familia",
        "Uvumilivu chini ya mtihani wa muda mrefu",
      ],
      miracles: [
        "Uponyaji na nafuu kwa amri ya Mwenyezi Mungu",
        "Marejesho ya familia na baraka baada ya majaribio",
      ],
      majorEvents: [
        "Dua yake ya unyenyekevu katika shida",
        "Msaada wa kimungu, uponyaji, na urejesho",
      ],
      lessons: [
        "Subira ni aina ya ibada inayofanya kazi",
        "Du'a ni nzuri sana inapokuwa mnyenyekevu na isiyo na malalamiko",
        "Majaribu yanayoletwa na imani yanaweza kuinua cheo cha mtu",
      ],
      facts: ["Imetajwa katika mapokeo yote ya Kiislamu kama kielelezo cha sabr"],
    },
    quran: [
      {
        excerpt:
          "Na Ayyubu alipo mwita Mola wake Mlezi: Hakika yamenigusa dhiki, na Wewe ni mwingi wa kurehemu kuliko wanaorehemu.",
      },
      {
        excerpt:
          "Hakika tulimkuta mvumilivu, mja mwema. Hakika yeye alikuwa ni mwenye kurejea kwa Mwenyezi Mungu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dhul-Kifl (AS)",
    summary:
      "Nabii mwadilifu anayehesabika miongoni mwa wenye subira, ameheshimiwa ingawa hadithi yake ni fupi.",
    body: [
      "Dhul-Kifl (amani iwe juu yake) ametajwa mara mbili ndani ya Qur'ani, mara zote mbili akiwa pamoja na mitume watukufu. Mwenyezi Mungu Amemuorodhesha pamoja na Ismail na Idris - wote walikuwa miongoni mwa wanaosubiri. Na tukawaingiza katika rehema yetu; Hakika wao walikuwa miongoni mwa watu wema' (Qur'ani 21:85-86) - na tena akamtaja miongoni mwa watu wema pamoja na Ismail na Al-Yasa' (Qur'ani 38:48). Kila kutajwa ni sifa, ingawa hakuna maelezo ya kina yanayotolewa.",
      "Kwa sababu Qur'ani na Sunnah sahihi haziongezei maisha yake, wanazuoni wa kitambo wanatofautiana juu ya hata maelezo ya kimsingi - wengine walizingatia kama alikuwa nabii au mtu mwadilifu, ingawa anahesabiwa miongoni mwa Mitume katika orodha kuu za Waislamu. Muumini makini hupinga kujaza kimya kwa ngano zisizothibitishwa, na badala yake anashikilia yale anayoyathibitisha Mwenyezi Mungu: alikuwa mvumilivu na mwadilifu, na huo ni utukufu wa kutosha.",
      "Kujumuishwa kwake kunabeba somo tulivu: sio kila mja anayependwa na Mwenyezi Mungu anaacha nyuma hadithi maarufu. Utumishi thabiti, wa uaminifu - aina ambayo haijaandikwa kamwe na historia lakini inajulikana kikamilifu na Mwenyezi Mungu - ni aina ambayo inapata rehema Yake. Uimara uliofichwa sio mdogo; ni kiini cha maisha ya haki.",
    ],
    profile: {
      era: "Vipindi vya baadaye vya kabla ya Isa (vimewekwa kwa upana)",
      mission: "Waite watu wake kwenye utii na uadilifu.",
      lessons: [
        "Uvumilivu ndio kiini cha tabia ya kinabii",
        "Maelezo machache bado yana mwongozo thabiti",
        "Utumishi wa uaminifu, usioonekana unapendwa na Mwenyezi Mungu",
      ],
      facts: [
        "Aitwaye pamoja na Ismail na Idris miongoni mwa wagonjwa",
        "Imehesabiwa miongoni mwa manabii katika orodha kuu za Waislamu",
      ],
    },
    quran: [
      {
        excerpt:
          "Na Ismail na Idris na Dhul-Kifl - wote walikuwa miongoni mwa wenye subira. Na tukawaingiza katika rehema yetu; Hakika hao walikuwa miongoni mwa watu wema.",
      },
      {
        excerpt: "Na mkumbuke Ismail, Al-Yasaa, na Dhul-Kifli, na wote ni katika walio bora.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Musa (AS)",
    summary:
      "Mjumbe mkubwa kwa Bani Israil ambaye alikabiliana na dhulma ya Firauni na kuipokea Taurati.",
    body: [
      "Musa (amani iwe juu yake) ndiye nabii anayetajwa sana katika Qur'ani, na hadithi yake inasimuliwa kwa kina. Alizaliwa chini ya amri ya Firauni ya kuwaua wana wa Bani Israil, aliwekwa kama mtoto mchanga kwenye kikapu kwenye mto Nile na mama yake - kwa wahyi wa Mwenyezi Mungu - na, kwa mpango wa Mwenyezi Mungu, alilelewa katika kasri ya Firauni mwenyewe (Qur'ani 28:7-13). Miaka kadhaa baadaye, baada ya kutoka Misri na kuoa huko Madyan, aliitwa na Mwenyezi Mungu kwenye bonde takatifu la Tuwa, ambapo Mwenyezi Mungu alizungumza naye moja kwa moja, akamwonyesha ishara ya fimbo na mkono, na akamtuma pamoja na ndugu yake Harun kwa Firauni dhalimu (Qur’ani 20:9–36).",
      "Utume wake ulikuwa ni kufikisha mambo mawili: mwito wa kumwabudu Mwenyezi Mungu peke yake, na hitaji la kuwakomboa wana wa Israili waliodhulumiwa. Firauni aliyedai kuwa mungu alikutana naye kwa dharau, na hata baada ya mfululizo wa ishara zilizo wazi - fimbo iliyogeuka nyoka na kumeza hila za wachawi, na mapigo - alikataa kusalimu amri. Musa alipowatoa Bani Israil, Firauni akawafuata mpaka baharini. Hapo Mwenyezi Mungu akaamrisha, ‘Piga bahari kwa fimbo yako,’ ikagawanyika hivyo Waumini wakavuka nchi kavu na Firauni na jeshi lake walizama (Qur’ani 26:63–66).",
      "Lakini ukombozi ulikuwa mwanzo tu. Kisha Musa alivumilia jaribio gumu zaidi, refu zaidi la kuwaongoza watu wagumu na mara nyingi wasio na shukrani: aliipokea Torati pale mlimani, kisha akarudi na kuwakuta wakiabudu ndama wa dhahabu; alikabiliana na malalamiko yao, madai yao, na kutotii kwao kwa uongozi wenye subira, thabiti. Maisha ya Musa yanaungana na mada mbili kuu - ujasiri wa kusimama dhidi ya dhuluma na dhuluma, na uvumilivu unaohitajika kuwaongoza watu kuelekea utii mara tu wanapokuwa huru. Kama mmoja wa ulul-'azm, yeye ni kielelezo cha wote mrekebishaji na mchungaji wa umma.",
    ],
    profile: {
      nation: "Bani Israil (kwa wito ulioelekezwa kwa watu wa Firauni)",
      location: "Misri na Sinai",
      era: "Kabla ya Dawud na Suleiman",
      mission: "Iteni kwenye tawhiyd, mkabiliane na dhulma ya Firauni, na mtoe Taurati.",
      challenges: [
        "Kukabiliana na Farao, ambaye alidai uungu",
        "Kuongoza watu wa upinzani na wasio na shukrani",
        "Uongozi endelevu chini ya shinikizo la mara kwa mara",
      ],
      miracles: [
        "Fimbo iliyogeuka kuwa nyoka",
        "Kupasuka kwa bahari kwa amri ya Mwenyezi Mungu",
        "Ishara nyingi zilizoonyeshwa mbele ya Farao",
      ],
      majorEvents: [
        "Mwenyezi Mungu akizungumza naye kwenye bonde takatifu",
        "Mgongano wa Firauni na wachawi",
        "Kutoka na kuteremshwa kwa Taurati",
      ],
      lessons: [
        "Simama kwa ujasiri dhidi ya udhalimu",
        "Uongozi juu ya watu unahitaji uvumilivu mkubwa",
        "Uhuru lazima uunganishwe na utii kwa Mwenyezi Mungu",
      ],
      facts: [
        "Mmoja wa wajumbe watano wa azimio thabiti (ulul-'azm)",
        "Anaitwa Kalimullah - yule ambaye Mwenyezi Mungu alizungumza naye moja kwa moja",
      ],
    },
    quran: [
      {
        excerpt:
          "Na nimekuteuwa wewe, basi sikilizeni yanayoteremshwa. Hakika mimi ndiye Mwenyezi Mungu. Hapana mungu ila Mimi, basi niabuduni na ushike Sala kwa kunikumbuka.",
      },
      {
        excerpt:
          "Na tukampa wahyi mama yake Musa: Mnyonyeshe, na unapomkhofu basi mtupeni mtoni, wala msiogope wala msihuzunike. Hakika Sisi tutamrudisha kwenu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Malaika wa mauti alitumwa kwa Musa. Alipomjia Musa akampiga, na Mwenyezi Mungu akamrudishia jicho lake na akampa chaguo kuhusu wakati wa kufa kwake.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Harun (AS)",
    summary: "Kaka yake Musa fasaha, aliteuliwa kuwa nabii msaidizi wake mbele ya Farao.",
    body: [
      "Harun (amani iwe juu yake) alikuwa kaka mkubwa wa Musa na Mtume katika haki yake mwenyewe. Mwenyezi Mungu alipomtuma Musa kwa Firauni, Musa aliomba msaada: Na niwekee waziri katika familia yangu, Harun, ndugu yangu. Niongezee nguvu zangu na umruhusu ashiriki kazi yangu' (Qur'ani 20:29–32). Mwenyezi Mungu alikubali ombi hilo, na Qur’ani inaandika jibu lake: ‘Tutautia nguvu mkono wako kupitia ndugu yako’ (Qur’ani 28:35). Harun, aliyeelezewa kuwa fasaha zaidi katika hotuba, alisimama kando ya Musa walipokuwa wakiwasilisha ujumbe wa Mwenyezi Mungu kwa dhalimu.",
      "Wakati wake wa majaribio zaidi ulikuja kwa kutokuwepo kwa Musa. Musa alipokwenda kuipokea Taurati mlimani, Bani Israil walianguka katika kuabudu ndama wa dhahabu. Harun alijaribu kuwazuia huku akiwaonya, ‘Enyi watu wangu, hamjaribiwa kwa hayo tu, na hakika Mola wenu ni Mwingi wa Rehema, basi nifuateni na mtiini amri yangu’—lakini walimshinda mamlaka yake na wakakaribia kumdhuru (Qur’ani 20:90–94). Musa aliporudi kwa hasira, Harun alieleza kwamba aliogopa kwamba kutenda kwa nguvu zaidi kungegawanya jumuiya katika makundi yenye kupigana kabla ya Musa kurudi (Qur'ani 7:150).",
      "Wasifu wa Harun unaangazia thamani ya kazi ya pamoja katika kumtumikia Mwenyezi Mungu - utume unaobebwa na wawili ni wenye nguvu kuliko mmoja - na hekima nyeti ya kuhifadhi umoja bila kuathiri ukweli. Wakati mwingine uongozi mwaminifu humaanisha kushikilia jumuiya inayovunjika pamoja na kuzuia madhara hadi mambo yaweze kurekebishwa. Harun ameheshimiwa katika Qur’ani miongoni mwa walioongoka, na Mwenyezi Mungu alimwachia yeye na Musa sifa za kudumu miongoni mwa vizazi vilivyofuata (Qur’ani 37:119–122).",
    ],
    profile: {
      nation: "Bani Israil",
      location: "Misri na Sinai",
      era: "Zama za Musa",
      mission: "Muunge mkono Musa katika kuita tawhiyd na kuwaongoza Bani Isra'il.",
      challenges: [
        "Kukabiliana na utawala wa Farao",
        "Kusimamia jamii wakati wa kutokuwepo kwa Musa",
        "Kuzuia mgawanyiko mkubwa kati ya watu",
      ],
      majorEvents: [
        "Kuteuliwa kuwa waziri na kumuunga mkono Musa",
        "Ujumbe mbele ya Farao",
        "Jaribio la ndama wa dhahabu",
      ],
      lessons: [
        "Kazi ya pamoja inaimarisha wito kwa Mwenyezi Mungu",
        "Uongozi wakati mwingine unamaanisha kuwaweka watu pamoja katika shida",
        "Dumisha umoja bila kuathiri ukweli",
      ],
      facts: ["Kaka mkubwa wa Musa", "Amesifiwa katika Qur-aan kwa ufasaha wake"],
    },
    quran: [
      {
        excerpt:
          "Na unijaalie waziri katika familia yangu - Harun, ndugu yangu. Niongezee nguvu kupitia yeye na umruhusu ashiriki kazi yangu.",
      },
      {
        excerpt:
          "Akasema: Mwana wa mama yangu, hakika watu walinizidi nguvu na wakataka kuniua, basi wasifurahie maadui juu yangu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dawud (AS)",
    summary:
      "Nabii-mfalme aliyepewa hekima, haki, na Zaburi, na kielelezo cha uongozi unaozingatia ibada.",
    body: [
      "Dawud (amani iwe juu yake) - Daudi - alianza akiwa kijana katika jeshi la Talut (Sauli) dhidi ya Jalut (Goliath) dhalimu. Daawuud ndiye aliyempiga Jalut, na Mwenyezi Mungu akampa enzi na hikima, na akamfundisha katika aliyo yataka.” (Qur’ani 2:251). Kisha Mwenyezi Mungu akampa ufalme, utume, na Kitabu kilichoteremshwa, Zabur (Zaburi), na kumfanya kuwa mfano adimu wa mtawala ambaye pia alikuwa mwabudu aliyejitolea.",
      "Mwenyezi Mungu alimpa zawadi za ajabu: milima na ndege wangeungana naye katika kumtukuza Mwenyezi Mungu, na chuma kilifanywa laini mikononi mwake ili aweze kutengeneza silaha (Qur'ani 21:79; 34:10–11). Pamoja na uwezo huu wote, Dawud alibakia kuwa mnyenyekevu sana na aliyejitolea. Ibada yake ilikuwa kubwa kiasi kwamba Mtume (Swalla Allaahu ´alayhi wa sallam) aliielezea funga ya Dawud - kufunga kila siku nyingine - kuwa ni funga inayopendwa zaidi na Mwenyezi Mungu, na sala yake ya usiku kuwa ni sala inayopendwa zaidi. Qur'ani pia inawasilisha tukio la hukumu ambapo Dawud, akasahihisha kwa upole, alianguka katika sijda mara moja, akaomba msamaha, na akarejea kwa Mola wake Mlezi (Qur'ani 38:24) - nguvu zake hazimuwahi kamwe juu ya kuwajibika.",
      "Maisha ya Dawud yanafunza kwamba mamlaka ni amana, si upendeleo. Mwenyezi Mungu anazungumza naye moja kwa moja: “Ewe Dawud, tumekufanya wewe kuwa mrithi katika ardhi, basi hukumu baina ya watu kwa haki wala usifuate matamanio” (Qur’ani 38:26). Uadilifu, kumkumbuka Mwenyezi Mungu mara kwa mara, toba ya haraka, na maisha yenye nidhamu ya ibada ndivyo vinavyosimamisha uongozi wa haki. Nguvu ni salama zaidi mikononi mwa mtu anayeinama zaidi.",
    ],
    profile: {
      nation: "Bani Israil",
      location: "mkoa wa Yerusalemu",
      era: "Kabla ya utawala wa Sulayman",
      mission:
        "Ongozeni kwa uadilifu, na muhukumu kwa haki, na waite watu wake kwa Mwenyezi Mungu.",
      challenges: [
        "Uzito wa wajibu wa mahakama",
        "Kusawazisha nguvu na unyenyekevu",
        "Uwajibikaji wa umma katika uongozi",
      ],
      miracles: [
        "Milima na ndege wanamsabihi Mwenyezi Mungu pamoja naye",
        "Chuma kilicholainishwa mikononi mwake kwa idhini ya Mwenyezi Mungu",
      ],
      majorEvents: [
        "Kushindwa kwa Jalut katika ujana wake",
        "Ufalme, utume, na wahyi wa Zabur",
        "Urithi ulipitishwa kwa mwanawe Sulayman",
      ],
      lessons: [
        "Haki ni msingi wa utawala wa haki",
        "Tubu haraka baada ya kosa lolote",
        "Maisha yenye nidhamu ya ibada huimarisha uongozi",
      ],
      facts: ["Mpokeaji wa Zabur (Zaburi)", "Alimshinda Jalut (Goliathi) akiwa kijana"],
    },
    quran: [
      {
        excerpt:
          "Ewe Dawud hakika tumekufanya wewe kuwa mrithi katika ardhi, basi hukumu baina ya watu kwa haki wala usifuate matamanio kwani yatakupoteza na njia ya Mwenyezi Mungu.",
      },
      {
        excerpt:
          "Na tuliifanya milima imtakase pamoja na Dawud, na ndege pia... Na tukamfundisha kutengeneza nguo za kivita ili kukukingeni na adui yenu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sala inayopendwa sana na Mwenyezi Mungu ni swala ya Dawud, na funga inayopendwa zaidi na Mwenyezi Mungu ni saumu ya Dawud: angefunga siku moja na inayofuata.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sulayman (AS)",
    summary:
      "Nabii-mfalme aliyepewa mamlaka yasiyo na kifani lakini yenye msingi wa shukrani na hekima.",
    body: [
      "Suleiman (Swalla Allaahu 'alayhi wa aalihi wa sallam) alirithi vyote viwili ufalme na utume kutoka kwa baba yake Dawud, na Qur'ani Tukufu inamsifu kuwa ni 'mja bora, hakika mwenye kurejea kwa Mwenyezi Mungu mara kwa mara' (Qur'ani 38:30). Akaomba ufalme usiokuwa na ule utakaomfuata, na Mwenyezi Mungu akamjaalia njia isiyo ya kawaida: kutawala upepo uendao kwa amri yake; utumishi wa majini waliomjengea na kumpimia kwa idhini ya Mwenyezi Mungu; na ufahamu wa usemi wa ndege na viumbe vingine (Qur’ani 21:81–82; 34:12–13; 27:16).",
      "Matukio mawili yanakamata tabia yake. Chungu alipolionya koloni lake lijifiche lisije jeshi la Sulayman litawaangamiza bila kujua, Sulayman alitabasamu na kumshukuru Mwenyezi Mungu kwa neema ya ufahamu, akiomba afanywe mwenye shukrani na mwadilifu (Qur'ani 27:18-19) - nguvu zilimfanya awe mnyenyekevu zaidi, sio mdogo. Na aliposikia kuhusu Malkia wa Sheba (Saba’) na watu wake wanaabudu jua, hakuwashinda kwa nguvu bali aliwaita wamnyenyekee Mwenyezi Mungu, na hatimaye akampa imani kwa hekima na maonyesho ya yale aliyompa Mwenyezi Mungu (Qur’ani 27:22–44). Hata baraka zake nyingi aliziweka kama mtihani: “Haya ni katika fadhila za Mola wangu Mlezi ili kunijaribu ikiwa nitashukuru au nitakufuru” (Qur’ani 27:40).",
      "Sulayman anafundisha kwamba nguvu ni moja ya mitihani migumu zaidi, na kwamba shukrani (shukr) ni tiba yake. Muumini akipewa mali, uwezo, au mamlaka inakusudiwa kuitumia kwa ajili ya uadilifu na kuwalingania wengine kwa Mwenyezi Mungu, kamwe kwa kiburi. Ufalme wake wote, pamoja na maajabu yake yote, unaelekeza nyuma kwa Yule aliyeutoa - na hiyo ndiyo tofauti kati ya baraka inayoinua na ile inayoharibu.",
    ],
    profile: {
      nation: "Bani Israil na falme zinazowazunguka",
      location: "Yerusalemu na eneo kubwa zaidi",
      era: "Baada ya Dawud",
      mission: "Tawalani kwa uadilifu na waiteni mataifa katika kumwabudu Mwenyezi Mungu.",
      challenges: [
        "Kusimamia ufalme mkubwa",
        "Kudumisha shukrani huku kukiwa na nguvu kubwa",
        "Kuelekeza nguvu mbalimbali kwa kuwajibika",
      ],
      miracles: [
        "Amri juu ya upepo kwa idhini ya Mwenyezi Mungu",
        "Huduma ya majini katika kujenga na kupiga mbizi",
        "Kuelewa hotuba ya ndege na mchwa",
      ],
      majorEvents: [
        "Kurithi ufalme na utume wa Dawud",
        "Kipindi cha mchwa na shukurani zake",
        "Mawasiliano na Malkia wa Sheba na imani yake",
      ],
      lessons: [
        "Nguvu ni mtihani mkubwa",
        "Shukrani hulinda dhidi ya kiburi",
        "Hekima na mwaliko vinaweza kugeuza mioyo kuwa bora kuliko nguvu",
      ],
      facts: ["Miongoni mwa manabii-wafalme walioelezewa kikamilifu katika Qur'ani"],
    },
    quran: [
      {
        excerpt:
          "Akatabasamu, akafurahishwa na maneno yake, na akasema: Mola wangu Mlezi, niwezeshe nishukuru neema Yako uliyonineemesha mimi na wazazi wangu wawili, na nifanye wema unayoiridhia.",
      },
      {
        excerpt:
          "Na kwa Suleiman tukautiisha upepo, mwendo wake wa asubuhi ni mwendo wa mwezi mmoja, na mwendo wake wa alasiri ni mwendo wa mwezi mmoja.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ilyas (AS)",
    summary:
      "Mtume ambaye alikabiliana na ibada ya sanamu Ba'l na akawaita watu wake warudi kwa Mwenyezi Mungu.",
    body: [
      "Ilyas (amani iwe juu yake) - Eliya - alitumwa kwa umma wa Bani Isra'il ambao walikuwa wameanguka kwenye ibada ya masanamu, mkuu kati ya masanamu yao akiwa Ba'l. Qur'ani inaandika changamoto yake ya moja kwa moja: 'Je, hamwogopi Mwenyezi Mungu? Je! mnamuomba Baali na mnamwacha mbora wa waumbaji, Mwenyezi Mungu, Mola wenu Mlezi na Mola Mlezi wa baba zenu wa kwanza? (Qur’ani 37:124–126). Wito wake ulikuwa wito wa unabii wa milele: kuvua miungu ya uwongo na kurudisha ibada kwa Muumba peke yake.",
      "Qur'ani Tukufu inafupisha utume wake kwa mtindo uliozoeleka wa kinabii - mwaliko wa wazi, kukataliwa na wengi, na heshima iliyohifadhiwa kwa wanyofu. “Wamemkadhibisha, basi hakika wataletwa [kwa adhabu], isipokuwa waja wa Mwenyezi Mungu walioteuliwa.” (Qur’ani 37:127–128). Mwenyezi Mungu anamtaja miongoni mwa watu wema na anamwachia amani ya kudumu na sifa njema: ‘Amani iwe juu ya Ilyas’ (Qur’ani 37:129–130), na anamtaja pamoja na Zakariyya, Yahya, na Isa miongoni mwa walioongoka (Qur’ani 6:85).",
      "Funzo la Ilyas ni kwamba mageuzi ya kweli yanaanza na kusahihisha ibada. Jamii haiwezi kurekebishwa huku ikielekeza ibada kwa vitu vya uwongo - iwe sanamu halisi au sanamu za kisasa za matamanio, mali, na hadhi. Tawhiyd ndio msingi ambao juu yake uhuishaji wote wa kudumu wa maadili umejengwa, na hata kundi la waumini linapokuwa dogo na kuzidi idadi, Mwenyezi Mungu huwaheshimu wale wanaoshikamana na ukweli.",
    ],
    profile: {
      nation: "Umma miongoni mwa Bani Israil",
      location: "Mkoa wa Levant",
      era: "Baadaye nyakati za kinabii za Waisraeli",
      mission: "Waite watu wake kutoka katika ibada ya Ba'l kwenye tawhiyd.",
      challenges: ["Ibada ya sanamu iliyokita mizizi", "Upinzani kutoka kwa uongozi"],
      majorEvents: [
        "Wito wa umma dhidi ya ibada ya Ba'l",
        "Kukataliwa na walio wengi na kuwahifadhi Waumini",
      ],
      lessons: [
        "Tawhiyd ndio msingi wa marekebisho yote",
        "Kikundi kidogo cha waamini bado ni muhimu kwa Mwenyezi Mungu",
        "Manabii wanazungumza dhidi ya makosa ya watu wengi, na sio kwa makosa hayo",
      ],
      facts: ["Ametajwa miongoni mwa watu wema", "Alikabiliana na ibada ya sanamu Ba'l"],
    },
    quran: [
      {
        excerpt:
          "Alipo waambia watu wake: Je! Je, mnamuomba Baali na kuwaacha walio bora zaidi wa waumbaji?",
      },
      {
        excerpt: "Na Zakaria na Yahya na Isa na Ilyas - na wote walikuwa katika watu wema.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Al-Yasa' (AS)",
    summary:
      "Nabii mwadilifu wa ukoo wa Kiisraeli, aliyetajwa katika Qur'ani miongoni mwa mashuhuri.",
    body: [
      "Al-Yasa' (Swalla Allaahu 'alayhi wa aalihi wa sallam) - Elisha - ametajwa miongoni mwa Mitume katika sehemu mbili katika Qur'ani, na katika zote mbili anasifiwa. Anaonekana miongoni mwa walioongoka pamoja na Ismail, Yunus, na Lut, ambao Mwenyezi Mungu 'amewapendelea kuliko walimwengu' (Qur'ani 6:86–87), na tena miongoni mwa waliobobea pamoja na Ismail na Dhul-Kifl (Qur'ani 38:48). Maandishi huinua cheo chake badala ya kusimulia masimulizi ya kina.",
      "Kwa sababu wahyi ni mfupi kwa makusudi juu yake, Waislamu wanathibitisha kile ambacho ni hakika - kwamba alikuwa Mtume wa kweli ambaye alishikilia mwito wa kumwabudu Mwenyezi Mungu peke yake kati ya watu wake - na kuepuka kuambatanisha naye ngano ambazo hazina msaada wa kweli. Kizuizi hiki chenyewe ni sehemu ya imani thabiti: tunamheshimu nabii kwa kushika ukweli juu yake, sio kwa kubuni hadithi karibu naye.",
      "Kutajwa kwake ni ukumbusho kwamba Mwenyezi Mungu alituma Mitume wengi, na kwamba thamani ya mtume haipimwi kwa muda gani hadithi yake imehifadhiwa bali kwa uaminifu wake kwa utume. Kama Qur'ani inavyosema mahali pengine, kulikuwa na Mitume ambao tumekusimulia hadithi zao na Mitume ambao hatukuzisimulia hadithi zao' (Qur'ani 40:78) - na kuamini zote, zinazojulikana na zisizojulikana, ni sehemu ya imani ya Muislamu.",
    ],
    profile: {
      nation: "Bani Israil",
      location: "Mkoa wa Levant",
      era: "Baadaye nyakati za kinabii za Waisraeli",
      mission: "Kuendeleza wito wa tawhiyd miongoni mwa watu wake.",
      lessons: [
        "Waheshimu manabii wote kwa usawa katika imani",
        "Utajo mfupi wa Qur'ani bado unatoa mwongozo wa kweli",
        "Mwendelezo wa haki huhifadhi jumuiya za imani",
      ],
      facts: ["Imetajwa moja kwa moja katika Qur'ani miongoni mwa walio bora na waliochaguliwa"],
    },
    quran: [
      {
        excerpt:
          "Na Ismail na Al-Yasaa na Yunus na Lut'i na wote tuliwafadhilisha kuliko walimwengu wote.",
      },
      {
        excerpt: "Na mkumbuke Ismail, Al-Yasaa, na Dhul-Kifli, na wote ni katika walio bora.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yunus (AS)",
    summary:
      "Nabii wa nyangumi, ambaye toba yake gizani ikawa somo lisilo na wakati katika matumaini.",
    body: [
      "Yunus (amani iwe juu yake) - Yona - alitumwa kwa watu wa Ninawi, lakini walipoendelea kukataa wito wake, aliwaacha kwa hasira kabla ya Mwenyezi Mungu kumpa ruhusa ya kuondoka. Qur’ani inaeleza yaliyofuata: ‘Na [mtaje] yule mtu wa samaki, alipotoka kwa hasira na akadhania kuwa hatutamhukumu [shida yoyote]’ (Qur’ani 21:87). Akiwa amepanda meli, alitupwa baharini na kumezwa na samaki mkubwa, akatumbukizwa katika tabaka za giza - giza la usiku, la bahari na la tumbo la samaki.",
      "Katika giza lile zito Yunus aliita kwa maneno ambayo yalikuja kuwa moja ya dua zinazopendwa sana katika Uislamu: 'Hapana mungu ila Wewe; utukufu ni Kwako. Hakika mimi nimekuwa miongoni mwa madhalimu” (Qur’ani 21:87). Hakukata tamaa; alithibitisha ukamilifu wa Mwenyezi Mungu na akakiri kosa lake mwenyewe. Mwenyezi Mungu akajibu: Basi tukamwitikia na tukamwokoa na dhiki. Na hivi ndivyo tunavyowaokoa Waumini” (Qur’ani 21:88). Samaki akamtupa ufukweni, na Mwenyezi Mungu akaotesha mmea ili kuuhifadhi mwili wake uliodhoofika.",
      "Kisha ukaja mwisho wa ajabu: Yunus akarudi kwa watu wake, na tofauti na karibu kila taifa jingine katika Qur'ani, waliamini na wakaepushwa - 'Basi tukawastarehesha kwa muda' (Qur'ani 37:147-148; 10:98). Hadithi yake inatoa mafunzo mawili yaliyounganishwa pamoja: kamwe usikate tamaa na rehema ya Mwenyezi Mungu, hata giza liko ndani, kwani toba ya kweli hurejesha kile kilichopotea; na du'a ya Yunus ni mhimili wa kila muumini aliye katika dhiki. Mtume (Swalla Allaahu ´alayhi wa sallam) amefundisha kwamba hakuna Mwislamu yeyote anayeswali kwayo isipokuwa Mwenyezi Mungu anamjibu.",
    ],
    profile: {
      nation: "Watu wa Ninawi",
      location: "Mkoa wa Mesopotamia",
      era: "Kipindi cha kabla ya Isa",
      mission: "Waite watu wake kwenye tawhiyd na toba.",
      challenges: [
        "Mkazo wa kukataliwa kwa kudumu katika da'wah",
        "Kesi ya kibinafsi katika giza la bahari",
        "Kurudi kwenye misheni baada ya kusahihishwa",
      ],
      miracles: [
        "Uokoaji kutoka ndani ya samaki",
        "Mmea wa makazi uliokua juu yake",
        "Imani ya watu wake wote",
      ],
      majorEvents: [
        "Kuwaacha watu wake na majaribio ya baharini",
        "Dua katika giza tatu",
        "Kurudi na imani ya Ninawi",
      ],
      lessons: [
        "Usikate tamaa na rehema za Mwenyezi Mungu",
        "Toba ya dhati inarejesha utume",
        "Du'a katika shida ni mabadiliko",
      ],
      facts: ["Pia anaitwa Dhun-Nun (mtu wa samaki) katika Qur'ani"],
    },
    quran: [
      {
        excerpt:
          "Na aliita katika giza: Hapana mungu ila Wewe; utukufu ni Kwako. Hakika mimi nimekuwa miongoni mwa madhalimu.",
      },
      {
        excerpt:
          "Basi je, haukuwa na mji ulioamini hivyo ikanufaisha imani yake isipokuwa watu wa Yunus? Walipo amini tuliwaondolea adhabu ya hizaya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dua ya Dhun-Nun alipomwomba Mwenyezi Mungu kutoka ndani ya tumbo la samaki ilikuwa: La ilaha illa Anta, subhanaka, inni kuntu minaz-zalimin. Hakuna Mwislamu anayeomba kwa chochote isipokuwa Mwenyezi Mungu anamjibu.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Zakariya (AS)",
    summary:
      "Nabii aliyejitolea ambaye aliomba mrithi mwadilifu katika uzee na akajibiwa pamoja na Yahya.",
    body: [
      "Zakariyya (amani iwe juu yake) - Zakaria - alikuwa mtume mcha Mungu wa Bani Israil na mlezi wa Maryam. Kila alipoingia kwake katika chumba chake cha kuswalia, alikuta riziki kwake na akamuuliza imekuwaje, naye hujibu: Imetoka kwa Mwenyezi Mungu. Hakika Mwenyezi Mungu humruzuku amtakaye bila hesabu” (Qur’ani 3:37). Kushuhudia riziki ya Mwenyezi Mungu kwa Maryam kuliamsha tena matumaini yake kwamba Mwenyezi Mungu angeweza kutoa kile kilichoonekana kuwa hakiwezekani kwa binadamu.",
      "Ingawa alikuwa mzee na mke wake alikuwa tasa, Zakariya alimgeukia Mwenyezi Mungu kwa sala ya utulivu na ya ndani kabisa: “Mola wangu, hakika mifupa yangu imedhoofika na kichwa changu kimejaa weupe, na sikukosa kamwe kukuomba dua” (Qur’ani 19:4). Hakuomba mali au faida ya kidunia bali mrithi mwadilifu ambaye angeendeleza ujumbe wa utume na kuhifadhi ibada ya Mwenyezi Mungu. Mwenyezi Mungu akajibu kwa bishara ya mtoto, Yahya - jina, Mwenyezi Mungu alisema, hakuna mtu aliyepewa kabla (Qur'ani 19: 7). Kama ishara, Zakariyya alikuwa ajizuie kuzungumza na watu kwa muda wa siku tatu isipokuwa kwa ishara tu, akiweka ulimi wake katika kumkumbuka Mwenyezi Mungu (Qur’ani 19:10–11).",
      "Maisha ya Zakariyya yanamfundisha muumini kamwe asiache kuomba, hata hivyo jibu linaweza kuonekana kuwa lisilowezekana, na kumuomba Mwenyezi Mungu hasa zawadi ya familia ya haki na kuendelea kwa imani. Hangaiko lake kuu zaidi halikuwa yeye mwenyewe bali ni nani angebeba ukweli baada yake. Hadithi yake pia inaheshimu huduma ya utulivu katika maeneo ya ibada kama tendo adhimu na pendwa.",
    ],
    profile: {
      nation: "Bani Israil",
      location: "mkoa wa Yerusalemu",
      era: "Kabla ya Isa",
      mission: "Waongoze watu wake na uhifadhi ibada ya kinabii.",
      challenges: [
        "Kufikia uzee bila mtoto",
        "Kujali kwa mfululizo wa imani",
        "Kudumisha ibada katika jamii yenye matatizo",
      ],
      miracles: ["Habari njema za Yahya katika uzee", "Ishara ya kukataza hotuba kwa siku tatu"],
      majorEvents: [
        "Ulezi wa Maryam na kushuhudia riziki yake",
        "Dua ya dhati kwa mrithi",
        "Dua iliyojibiwa na kuzaliwa kwa Yahya",
      ],
      lessons: [
        "Kamwe usipoteze matumaini katika du'a",
        "Muombe Mwenyezi Mungu akujaalie jamaa na nasaba wema",
        "Huduma ya kujitolea katika ibada ni ya heshima",
      ],
      facts: ["Mlezi wa Maryam", "Baba wa Yahya, ambaye kuzaliwa kwake kulijibu maombi yake"],
    },
    quran: [
      {
        excerpt:
          "Hapo Zakariya akamwomba Mola wake Mlezi, akisema: Mola wangu Mlezi, nijaalie kutoka kwako kizazi chema. Hakika Wewe ni Mwenye kusikia maombi.",
      },
      {
        excerpt:
          "Akasema: Mola wangu Mlezi, hakika mifupa yangu imedhoofika, na kichwa changu kimejaa weupe, wala sijapata huzuni katika maombi yangu Kwako, Mola wangu Mlezi.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Yahya (AS)",
    summary:
      "Nabii msafi, mwenye hekima aliyepewa haki tangu ujana na kuheshimiwa kwa amani na Mwenyezi Mungu.",
    body: [
      "Yahya (amani iwe juu yake) - John - alikuwa jibu la sala ya baba yake Zakariyya, iliyoitwa na Mwenyezi Mungu kabla ya kuzaliwa kwake. Mwenyezi Mungu akamwambia moja kwa moja: 'Ewe Yahya, shika Kitabu kwa bidii.' Na 'Akampa hekima angali mtoto' (Qur'ani 19:12) - maelezo adimu ambayo yanaashiria ukomavu wake wa mapema wa kiroho. Tangu ujana wake alikuwa amejitolea kwa Mwenyezi Mungu kwa uzito kupita miaka yake.",
      "Qur’ani inaisifu tabia yake kwa mfuatano mzuri: Mwenyezi Mungu alimjaalia ‘upole kutoka Kwetu na usafi, na alikuwa mcha Mungu, na mchamungu kwa wazazi wake, wala hakuwa dhalimu, muasi’ (Qur’ani 19:13–14). Alikuwa msafi na mcha Mungu, akikumbukwa miongoni mwa watu wema. Aliwalingania watu wake kwenye utiifu na ukweli na akamtangulia Isa, akithibitisha neno kutoka kwa Mwenyezi Mungu na kuzitayarisha nyoyo kwa uwongofu (Qur’ani 3:39).",
      "Mwenyezi Mungu alimtukuza Yahya kwa amani katika nyakati tatu zilizo hatarini zaidi za maisha yoyote: 'Amani iwe juu yake siku aliyozaliwa, siku ya kufa kwake, na siku atakayofufuliwa hai' (Qur'ani 19:15). Wasifu wake ni ujumbe kwa vijana na wazee sawa: ukaribu kwa Mwenyezi Mungu hauahirishwi hadi miaka ya baadaye. Usafi wa moyo, umakini katika ibada, na wema kwa wazazi wa mtu unaweza kuchanua ndani ya mtu angali kijana - na maisha kama hayo ni ya kupendwa na Mwenyezi Mungu.",
    ],
    profile: {
      nation: "Bani Israil",
      location: "Mkoa wa Levant",
      era: "Wakati wa zama za Zakariyya na karibu na zama za Isa",
      mission: "Wito kwenye haki na uandae nyoyo kwa uongofu.",
      challenges: [
        "Mageuzi ya umma katika mazingira duni ya kimaadili",
        "Kudumisha usafi na kanuni",
      ],
      majorEvents: [
        "Kuzaliwa kwake kama dua iliyojibiwa",
        "Akipewa hekima katika ujana wake",
        "Kutambuliwa kwa usafi na kujitolea kwake",
      ],
      lessons: [
        "Vijana wanaweza kuongoza kwa haki",
        "Usafi wa moyo ni nguvu ya kweli",
        "Fadhili kwa wazazi ni sehemu ya uchamungu",
      ],
      facts: [
        "Ametajwa na Mwenyezi Mungu kabla ya kuzaliwa kwake",
        "Kuheshimiwa kwa amani wakati wa kuzaliwa, kifo, na ufufuo",
      ],
    },
    quran: [
      {
        excerpt:
          "Ewe Yahya, shika Kitabu kwa bidii. Na tukampa hikima angali mtoto, na upole kutoka kwetu na usafi, naye alikuwa akimcha Mwenyezi Mungu.",
      },
      {
        excerpt:
          "Mwenyezi Mungu anakubashirieni Yahya, anayesadikisha neno litokalo kwa Mwenyezi Mungu, mtukufu, mzui, na Nabii miongoni mwa watu wema.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Isa bin Maryam (AS)",
    summary:
      "Mjumbe mwenye nguvu aliyezaliwa kwa Maryam kwa miujiza, akilingania kwa Mwenyezi Mungu kwa Ishara zilizo wazi - mja, si mcha Mungu.",
    body: [
      "Isa (amani iwe juu yake) - Isa - alizaliwa kwa Maryam bila ya baba, kwa amri ya Mwenyezi Mungu, kama ishara ya ukamilifu wa uweza wake. Hakika mfano wa Isa kwa Mwenyezi Mungu ni kama mfano wa Adam. Alimuumba kwa udongo, kisha akamwambia: Kuwa, akawa” (Qur’ani 3:59). Maryam alipomleta mtoto mchanga kwa watu wake, ambao walimtuhumu, mtoto Isa alisema kutoka utotoni kujitetea: 'Hakika mimi ni mja wa Mwenyezi Mungu. Amenipa Kitabu na amenifanya nabii.” (Qur’ani 19:30). Tamko hili la kwanza liliweka sauti ya utume wake wote - kwamba alikuwa mtumishi wa Mwenyezi Mungu.",
      "Isa alitumwa kwa Bani Israil ili kuithibitisha Taurati mbele yake na kuleta Injil (Injili). Mwenyezi Mungu alimsaidia kwa miujiza iliyo wazi kwa idhini yake: akawaponya vipofu na wakoma, akawahuisha wafu, na akaumba ndege kwa udongo aliyeruka kwa idhini ya Mwenyezi Mungu (Qur'ani 3:49). Ujumbe wake uliwaita watu kumwabudu ‘Mwenyezi Mungu, Mola wangu na Mola wenu Mlezi’ (Qur’ani 3:51), na kwenye ikhlasi na uadilifu. Wanafunzi wake wa karibu, Hawariyyun, walimuamini na kumuunga mkono.",
      "Qur'ani inasahihisha mambo mawili yaliyokithiri kuhusu Isa. Dhidi ya wale waliomkataa na kupanga njama ya kumuua, inatangaza kuwa hakuuawa wala kusulubiwa; bali ilionekana hivyo tu, na Mwenyezi Mungu alimnyanyua kwake (Qur’ani 4:157–158). Dhidi ya wale waliotia chumvi, inasisitiza kuwa yeye ni Nabii na Mtume mtukufu, si Mungu wala mwana wa Mungu—‘Masihi bin Maryam hakuwa ila ni Mtume tu’ (Qur’ani 5:75). Kwa imani ya Kisunni atarejea kabla ya Siku ya Mwisho. Hadithi yake inafunza kwamba uwezo wa Mwenyezi Mungu unapita mambo yote ya kimaumbile, kwamba mitume ni waja wanaoheshimika na si waungu, na ukweli huo lazima ulindwe kutokana na kukanusha na kutiwa chumvi.",
    ],
    profile: {
      nation: "Bani Israil",
      location: "Levant",
      era: "Karne ya 1 BK",
      mission: "Ifanye upya Tawhiyd, ithibitishe Taurati, na mwite kwenye wema.",
      challenges: [
        "Upinzani na kupanga njama na waliomkataa",
        "Kuzidisha kwa hali yake baadaye",
        "Kutetea tauhidi safi",
      ],
      miracles: [
        "Kuzaliwa bila baba",
        "Akizungumza katika kisigino",
        "Kuponya na kuhuisha kwa idhini ya Mwenyezi Mungu",
      ],
      majorEvents: [
        "Kuzaliwa kwake kwa miujiza na kumtetea mama yake",
        "Wito wa watu wenye dalili zilizo wazi",
        "Kuinuliwa kwa Mwenyezi Mungu, sio kuuawa",
      ],
      lessons: [
        "Uweza wa Mwenyezi Mungu unapita mambo ya kawaida",
        "Mitume ni waja wa Mwenyezi Mungu waliotukuka, sio waungu",
        "Ukweli lazima ulindwe dhidi ya kukanusha na kutia chumvi",
      ],
      facts: ["Imepewa Injili (Injil)", "Watarejea kabla ya Siku ya Mwisho katika imani ya Sunni"],
    },
    quran: [
      {
        excerpt:
          "[Isa akasema]: Hakika Mwenyezi Mungu ni Mola wangu Mlezi na Mola wenu, basi muabuduni Yeye. Hiyo ni njia iliyonyooka.",
      },
      {
        excerpt:
          "Nao hawakumwua, wala hawakumsulubisha; lakini ikadhihirika kwao... Bali Mwenyezi Mungu alimnyanyua kwake.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mimi ndiye mkaribu zaidi wa watu wote kwa Isa bin Maryam. Mitume ni ndugu wa mama tofauti, lakini dini yao ni moja, na hapakuwa na nabii baina yetu.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Muhammad ﷺ",
    summary: "Mjumbe wa mwisho, aliyetumwa kama rehema kwa walimwengu wote na muhuri wa utume.",
    body: [
      "Muhammad (Swalla Allaahu ‘alayhi wa aalihi wa sallam) ndiye wa mwisho wa Mitume, hakutumwa kwa watu hata mmoja bali kwa wanadamu wote, na Qur-aan ikiwa ni ufunuo wa mwisho na uliohifadhiwa. Mwenyezi Mungu anauelezea utume wake kwa Aya moja: “Na hatukukutuma ila uwe rehema kwa walimwengu” (Qur’ani 21:107). Mzaliwa wa Makka, alipata wahyi wa kwanza akiwa na umri wa miaka arobaini kwenye pango la Hira, na kwa miaka ishirini na tatu iliyofuata aliwalingania watu kumwabudu Mwenyezi Mungu peke yake, kuzitakasa nyoyo zao, na kuishi kwa uadilifu na rehema - kukamilisha na kuthibitisha ujumbe wa kila Mtume kabla yake.",
      "Njia yake ilikuwa moja ya dhabihu endelevu. Huko Makka yeye na waumini wa mwanzo walivumilia dhihaka, mateso, na kususia kwa miaka mingi. Kisha ikaja Hijra, kuhama kwenda Madina, ambako alijenga umma wa kwanza wa Kiislamu - kuanzisha sala, udugu baina ya wahajiri na wasaidizi, mikataba, na jamii yenye mizizi katika tawhiyd. Kupitia miaka ya taabu na ushindi hatimaye, tabia yake haikuyumba; Qur'ani inashuhudia, 'Hakika wewe ni mwenye tabia njema' (Qur'ani 68:4), na yeye mwenyewe alisema alitumwa kwa ukamilifu wa tabia tukufu.",
      "Mwenyezi Mungu anamtangaza kuwa ni Mtume wa Mwenyezi Mungu na muhuri wa Manabii (Qur'ani 33:40) - hakuna Nabii baada yake. Muujiza wake mkubwa zaidi ni Qur’ani yenyewe, dalili ya kudumu ambayo bado inaongoza mabilioni ya watu, na aliheshimiwa kwa Isra na Mi’raj, safari ya usiku na kupaa. Kwa Muumini, yeye ndiye uswah hasanah - mfano mzuri (Qur'ani 33:21) - ambaye Sunnah yake ni njia ya kivitendo ya imani. Kumpenda yeye, kufuata mwongozo wake, na kutuma baraka juu yake ndio msingi wa maisha ya Uislamu.",
    ],
    profile: {
      nation: "Ubinadamu wote",
      location: "Makka na Madina",
      era: "Karne ya 7 BK",
      mission: "Peleka ufunuo wa mwisho na ukamilishe ujumbe wa kinabii kwa watu wote.",
      challenges: [
        "Mateso na kususia huko Makka",
        "Migogoro na kujenga jamii yenye haki",
        "Kuwasilisha ujumbe wa ulimwengu kwa makabila na mataifa",
      ],
      miracles: [
        "Qur'ani kama muujiza wa kudumu",
        "Isra na Mi'raj (safari ya usiku na kupaa)",
        "Ishara nyingi zilizotolewa kwa idhini ya Mwenyezi Mungu",
      ],
      majorEvents: [
        "Mwanzo wa wahyi huko Makka",
        "Hijra kwenda Madina",
        "Kukamilika kwa ujumbe na Mahubiri ya Kuaga",
      ],
      lessons: [
        "Rehema na tabia njema katika uongozi",
        "Uthabiti chini ya shinikizo",
        "Fuata wahyi na Sunnah kwa pamoja",
      ],
      facts: ["Muhuri wa manabii", "Mfano bora (uswah hasanah) kwa waumini"],
    },
    quran: [
      {
        excerpt:
          "Muhammad si baba wa yeyote katika wanaume wenu, bali ni Mtume wa Mwenyezi Mungu na muhuri wa Manabii.",
      },
      {
        excerpt: "Na hatukukutuma ila uwe rehema kwa walimwengu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mfano wangu na mfano wa manabii walionitangulia ni ule wa mtu aliyejenga nyumba kwa uzuri na ukamilifu, isipokuwa mahali pa tofali moja. Mimi ndimi yule tofali, na mimi ndiye muhuri wa manabii.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
];

export const PROPHETS_TIMELINE_SW: DeepPartial<ProphetsTimelineEvent>[] = [
  {
    era: "Mwanzo",
    title: "Adamu - nabii wa kwanza",
    body: "Mwenyezi Mungu alimuumba Adam, akamfundisha majina, na akamfanya makamu wake duniani.",
  },
  {
    era: "Zamani",
    title: "Idris, Nuh, na mataifa ya mwanzo",
    body: "Mitume wa mwanzo waliwaita watu wao warudi kwenye tawhiyd. Nuh alihubiri kwa karne nyingi; kukataliwa kulipoendelea, gharika ilikuja na safina ikawaokoa waumini kama ishara.",
  },
  {
    era: "Mesopotamia / Levant",
    title: "Ibrahim na familia yake",
    body: "Khalilullah, rafiki wa Mwenyezi Mungu: aliyavunja masanamu, akaokolewa na moto, akajenga Al-Kaaba pamoja na Ismail, na akazaa kizazi cha manabii kupitia Ismail na Is-haq.",
  },
  {
    era: "Misri na Sinai",
    title: "Musa na Bani Israil",
    body: "Kukombolewa kutoka kwa Firauni, Taurati ilifunua, safu ndefu ya manabii kwa Bani Isra'il.",
  },
  {
    era: "Misri",
    title: "Yusuf huko Misri",
    body: "Uvumilivu kupitia usaliti, jela, na kupanda mamlaka - kielelezo cha uaminifu.",
  },
  {
    era: "Yerusalemu",
    title: "Dawud na Suleiman",
    body: "Ufalme, hekima, Zabur, na ufalme unaosifiwa ndani ya Qur'ani.",
  },
  {
    era: "Karne ya 1 BK",
    title: "Isa bin Maryam",
    body: "Alizaliwa kimiujiza, alizungumza katika utoto, aliyeinuliwa kwa Mwenyezi Mungu - sio kuuawa msalabani kwa Qur'ani.",
  },
  {
    era: "Karne ya 7 BK",
    title: "Muhammad ﷺ - muhuri wa manabii",
    body: "Mjumbe wa mwisho kwa wanadamu wote; Qur-aan iliyohifadhiwa mpaka Siku ya Mwisho.",
  },
];
