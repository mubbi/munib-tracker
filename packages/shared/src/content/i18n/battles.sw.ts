// Swahili translation overlay for the Learn Battles content. Mirrors the order of
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

export const BATTLES_TOPICS_SW: DeepPartial<BattlesTopic>[] = [
  {
    title: "Utangulizi",
    summary: "Asili ya kihistoria, mateso, Hijra, na wakati mapigano yaliruhusiwa.",
    body: [
      "Kwa miaka kumi na tatu ya kwanza ya ufunuo huko Makka, Waislamu waliamrishwa kustahimili mateso kwa subira - hawakupewa ruhusa ya kupigana. Maswahaba walipoomba kujitetea, jibu lilikuwa: “Izuieni mikono yenu, na simamisheni Sala, na toeni zaka” (Qur’ani 4:77). Jumuiya ya mapema ilijibu ukandamizaji kwa uthabiti, uhamiaji, na sala, sio uasi wa silaha.",
      "Hijra hadi Madina (622 CE / 1 AH) ilibadilisha hali ya jumuiya, sio kanuni zake. Huko Yathrib Waislamu wakawa jamii iliyotulia iliyofungwa na Katiba ya Madinah - agano lililoandikwa la ulinzi wa pamoja na kuishi pamoja na makabila ya Kiyahudi ya jiji hilo. Mtume (Swalla Allaahu ´alayhi wa sallam) sasa alikuwa kiongozi wa utawala ambao ungeweza kushambuliwa na hivyo kuweza kujilinda kihalali.",
      'Hapo ndipo, baada ya miaka mingi ya dhulma, ndipo iliposhuka ruhusa ya kwanza ya kupigana — na sababu yake iliyotajwa ni kwamba Waumini wamedhulumiwa na wakatolewa majumbani mwao kwa kusema “Mola wetu ni Mwenyezi Mungu” (Qur’ani 22:39–40). Ruhusa hiyo ilikuwa kwa ajili ya ulinzi na ulinzi wa uhuru wa kidini - aya hiyo hiyo inataja usalama wa "nyumba za watawa, makanisa, masinagogi na misikiti" kama vile vita hivyo huhifadhi - sio kwa ushindi, uongofu wa kulazimishwa, au uporaji.',
      "Qur’ani imeweka mpaka wa kudumu kuzunguka ruhusa hii: “Piganeni katika njia ya Mwenyezi Mungu wale wanaokupigeni, lakini msiruke mipaka” (Qur’ani 2:190). Mapigano yalifungamana na uchokozi dhidi ya jamii, na kamwe hayakuwa ya kuvuka mipaka ya uadilifu.",
      "Kampeni hizi ni historia: zilitokea katika muktadha maalum wa Uarabuni wa karne ya saba wa vita vya kikabila, mikataba iliyovunjwa, na kuzingirwa. Mafundisho ya jumla ya Kiislamu juu ya amani, uadilifu, rehema, na ujirani ndiyo sura; maelezo ya vita hivi lazima yasomwe ndani ya fremu hiyo, sio kuporomoka kuwa kauli mbiu zilizochanwa kutoka humo.",
    ],
    quran: [
      {
        excerpt:
          "Imeruhusiwa wale wanaopigana kwa sababu ya kudhulumiwa - na Mwenyezi Mungu ni Muweza wa kuwanusuru - wale waliotolewa majumbani mwao bila ya haki, ila kwa sababu ya kusema: Mola wetu Mlezi ni Mwenyezi Mungu. Na lau kuwa Mwenyezi Mungu asingewazuilia baadhi ya watu kwa watu, nyumba za watawa, na makanisa, na masinagogi, na misikiti, ambamo ndani yake jina la Mwenyezi Mungu linatajwa sana, bila ya shaka zingeli vunjwa.",
      },
      {
        excerpt:
          "Piganeni katika Njia ya Mwenyezi Mungu wale wanaokupigeni, lakini msiruke mipaka. Hakika Mwenyezi Mungu hawapendi wapotovu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kwa nini vita vilitokea",
    summary: "Mateso, ukiukaji wa mikataba, na ulinzi wa jamii - sio uchokozi.",
    body: [
      "Muktadha na sababu ya vita hivi ilikuwa ni kampeni endelevu ya uadui, sio hamu ya Kiislamu ya vita. Huko Makka, Maquraishi walikuwa wamewatesa wanyonge, wakaususia ukoo mzima hadi kwenye makali ya njaa, wakateka mali iliyoachwa nyuma na wahajiri, na hata kupanga njama ya kumuua Mtume ﷺ. Kuhama kwenda Madina hakukumaliza tishio hilo; iliihamisha.",
      "Badr (2 AH) alikua kutokana na mzozo huo ambao haujatatuliwa. Ilipokuja habari kwamba msafara mkubwa wa Maquraishi - uliobeba mali iliyochukuliwa kutoka kwa wahajiri - unarudi kutoka Syria, Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) alikwenda kuuzuia. Msafara ule ulitoroka, lakini Maquraishi walikuwa tayari wamekusanya jeshi la watu wapatao elfu moja na wakatembea hata hivyo, wakiwa wamedhamiria kuwaangamiza wale vijana kwa nguvu. Vita vilivyopigwa kwenye visima vya Badr vilikuwa matokeo.",
      "Huko Madina, kuendelea kuishi kulitegemea mikataba, na mikataba ilivunjwa mara kwa mara. Makundi ambayo yalikuwa yameahidi ulinzi wa pande zote mbili chini ya agano la mji badala yake wakafanya njama na maadui - Washiriki walioizingira Madina kwenye Handaki (5 AH) walikusanyika kwa usahihi ili kuwaangamiza kabisa Waislamu.",
      "Ukiukaji wa Mkataba ulibakia kuwa madhubuti hadi mwisho. Ilikuwa ni washirika wa Maquraishi wakiwashambulia washirika wa Waislamu, Banu Khuza'ah, ambao walibatilisha Mkataba wa Hudaybiyyah na kupelekea - kwa kushangaza - kwenye ufunguzi wa karibu usio na damu wa Makka badala ya mauaji.",
      "Katika yote haya, malengo yalikuwa thabiti: kutetea maisha na dini, kuwalinda watu walio hatarini, na kuweka usalama wa kutosha ambao tawhid inaweza kutekelezwa bila mateso. Lengo halikuwa kamwe upanuzi usio na kikomo kwa ajili yake, na vyanzo vinaandika Mtume (Swalla Allaahu ´alayhi wa sallam) akipendelea suluhu na mapatano wakati wowote adui alipoelekea kwenye amani.",
    ],
    hadith: [
      {
        excerpt:
          'Nimeamrishwa nipigane na watu mpaka washuhudie kwamba hapana mungu ila Mwenyezi Mungu, na kwamba Muhammad ni Mtume wa Mwenyezi Mungu, na simamisheni Sala, na toeni zaka. Wakifanya hivyo basi nafsi zao na mali zao zitalindwa kutoka kwangu isipokuwa kwa haki ya Uislamu, na hisabu yao iko kwa Mwenyezi Mungu. - Wanachuoni wa kale walisoma "watu" kama waabudu masanamu mahsusi wa Arabia kisha kuupiga vita Uislamu baada ya ujumbe kuwafikia; ni kauli kuhusu wapiganaji hao wenye uadui, si leseni ya kuwashambulia wasio Waislamu wenye amani au kulazimisha imani, ambayo Qur\'ani 2:256 inakataza moja kwa moja.',
      },
    ],
    quran: [
      {
        excerpt: "Hakuna kulazimishana katika dini. Njia sahihi imekuwa tofauti na makosa.",
      },
    ],
    disclaimer:
      "Hadith hiyo hapo juu mara nyingi imenukuliwa ikiwa imevuliwa mpangilio wake. Wanachuoni wa kitambo waliiweka ndani ya uadui makhsusi wa zama zake na pamoja na marufuku ya Qur'ani ya kulazimishana katika dini (2:256) na kikomo cha kupigana ni dhidi ya wale wanaopigana nanyi (2:190).",
    appLinks: [{}],
  },
  {
    title: "Maadili ya vita katika Uislamu",
    summary:
      "Hakuna uchokozi, ulinzi mkali wa raia, na tabia ya kibinadamu - iliyojengwa katika Qur'ani na Sunnah.",
    body: [
      "Sheria ya Kiislamu ya vita (siyar) ilikua moja kwa moja nje ya mipaka ya Qur'ani na utendaji wa Mtume. Msingi wake ni kanuni moja inayotawala kila kitu kingine: \"Pigana na wale wanaopigana nanyi, lakini msiruke mipaka\" (Qur'ani 2:190). Mapigano ni jibu la uchokozi, lililofungwa na haki, na lazima lisimame wakati adui anaacha.",
      "Wasio wapiganaji wanalindwa vikali. Alipokutwa mwanamke aliyeuawa baada ya safari moja, Mtume ﷺ alikataza moja kwa moja kuua wanawake na watoto. Mafakihi walieneza hili kwa wazee, kwa watawa na waabudu waliojitenga katika vyumba vyao, kwa vibarua wa mashambani na wafanyakazi wa kukodiwa, na kwa yeyote ambaye hashiriki katika mapigano. Kuwaua sio ziada inayoruhusiwa - ni marufuku.",
      "Hata dhidi ya wapiganaji wenye bidii, hoja ilikuwa mwaliko kabla ya upanga. Mtume (Swalla Allaahu ´alayhi wa sallam) alipomteua kamanda alimuagiza auite kwanza upande wa pili kwenye Uislamu, kisha - kama akikataliwa - kwenye suluhu ya amani, na kupigana tu ikiwa wote wawili watakataliwa, na kamwe asivunje imani, kumkatakata mwili, au kuua mtoto (Sahih Muislamu 1731).",
      'Uhaini umekatazwa kabisa: mikataba lazima iheshimiwe hadi muda wake, na adui lazima apewe onyo la haki badala ya kusalitiwa. Ruhusa ya uwanja wa vita kwamba "vita ni hadaa" inarejelea tu mbinu za kimbinu - fikra, mshangao, upotofu - kamwe kutovunja agano au kusema uwongo kwa upande unaolindwa.',
      "Mali na ardhi yenyewe inalindwa. Mwongozo wa jumla ulikataza ukataji ovyo wa miti ya matunda, uchomaji moto wa mazao, na uchinjaji wa mifugo kupita kiasi. Wafungwa walipaswa kulishwa kama watekaji walivyokula na kuvaa walipokuwa wamejivika; Qur'ani inawasifu wale wanaowalisha mateka kwa ajili ya mapenzi ya Mwenyezi Mungu (76:8), na wengi waliachiliwa kwa fidia, kubadilishana, au rehema rahisi - wengine huko Badr kwa kubadilishana na kuwafundisha Waislamu kusoma.",
      "Haya ni mafundisho ya kanuni za dini. Waislamu mmoja mmoja katika historia ambao walikiuka walikuwa wanakiuka Uislamu, bila kuufafanua - kama vile ukiukwaji wa wafuasi wa imani yoyote hauandiki tena kile ambacho imani hiyo inaamuru.",
    ],
    quran: [
      {
        excerpt:
          "Piganeni katika Njia ya Mwenyezi Mungu wale wanaokupigeni, lakini msiruke mipaka.",
      },
      {
        excerpt:
          "Na wakielekea kwenye amani basi nayo elekea nayo, na mtegemee Mwenyezi Mungu. Hakika Yeye ndiye Mwenye kusikia, Mwenye kujua.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Imepokewa kutoka kwa Ibn Umar kwamba mwanamke mmoja alikutwa ameuawa katika moja ya misafara ya Mtume wa Mwenyezi Mungu (Swalla Allaahu 'alayhi wa aalihi wa sallam), hivyo akakataza kuua wanawake na watoto.",
      },
      {
        excerpt:
          "Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) alipomteua kamanda wa jeshi alimuamuru: Pigana kwa jina la Mwenyezi Mungu… usinyang’anye ngawira, usivunje dhamana yako, usimkate viungo, na usiue mtoto. Unapokutana na adui, waite kwanza kwenye Uislamu; wakikataa, uwape amani; ila wakikataa wote wawili, basi piganeni.",
      },
      {
        excerpt:
          "Usiue mzee aliyedhoofika, wala mtoto mdogo, wala mwanamke. - Baadhi ya minyororo ya maneno haya haswa ni dhaifu, lakini hukumu inayotajwa inathibitishwa na riwaya Sahih hapo juu na kwa makubaliano ya mafaqihi.",
      },
    ],
    actions: [
      "Tofautisha kwa uwazi kati ya yale ambayo Uislamu unaamuru na yale ambayo jeshi lolote katika historia lilifanya.",
      "Soma sehemu hii ya maadili kabla ya simulizi lolote la vita - historia bila kanuni zake tawala hukaribisha kutoelewana.",
      "Chanzo kinaporekodi kitendo ambacho kinaonekana kukinzana na sheria hizi, uliza kuhusu muktadha na uhalisi wake kabla ya kufanya hitimisho.",
    ],
    appLinks: [{}],
  },
  {
    title: "Vita vya Badr",
    summary: "17 Ramadhani 2 Hijria - vita kuu ya kwanza, Siku ya Upambanuzi.",
    body: [
      "Muktadha na sababu: Baada ya Hijra, Maquraishi walikuwa wameteka nyumba na mali wahajiri walioacha Makka na wakaendelea na vitisho vyao. Wakati habari zilipoifikia Madinah kwamba Abu Sufyan anaongoza msafara wa kitajiri kurudi kutoka Syria, Mtume ﷺ aliondoka na kikosi chepesi - takriban watu 313 - wakitarajia kuzuia mali, sio kupigana vita.",
      "Kilichotokea: Abu Sufyan aliteleza na kupita kando ya pwani, lakini alikuwa tayari ametuma Makka kuomba msaada, na Maquraishi walitoka na wapiganaji wapatao elfu moja, wapanda farasi, na mahitaji, wakaazimia kutoa mfano wa Waislamu. Vita vikawa visivyoweza kuepukika kwenye visima vya Badr, ambapo - kwa ushauri wa al-Hubab ibn al-Mundhir - Waislamu walinyakua maji kwanza, wakikanusha kwa adui.",
      "Usiku huo Mtume ﷺ alisimama kuswali mpaka alfajiri. Akiwa anakabiliana na jeshi mara tatu la jeshi lake, alinyanyua mikono yake na kumuomba Mola wake Mlezi kwa bidii kiasi kwamba joho lake likamtoka mabegani mwake, akasema: “Ewe Mwenyezi Mungu, ikiwa kundi hili la Waumini litaangamizwa, wewe hutaabudiwa katika ardhi. Qur'ani inaandika kwamba Mwenyezi Mungu alijibu kwa kutiwa nguvu na Malaika na akaweka utulivu katika nyoyo za waumini.",
      "Baada ya pambano moja kati ya mabingwa watatu kutoka kila upande, majeshi yalipambana. Maquraishi walivunjika. Takriban viongozi wao sabini waliuawa - miongoni mwao Abu Jahl, mtesaji mkali wa umma - na karibu sabini walichukuliwa mateka; Waislamu kumi na wanne waliuawa kishahidi. Mateka walitendewa kwa heshima, na wengine walinunua uhuru wao kwa kuwafundisha watoto wa Kiislamu kusoma na kuandika.",
      "Watu muhimu: pamoja na Mtume ﷺ alisimama Abu Bakr, Umar, Ali, na ami yake Hamza; ushauri wa al-Hubab juu ya visima na wa Sa'd ibn Mu'adh juu ya mkakati unaonyesha uongozi kwa kushauriana hata pale ushindi ulipoahidiwa.",
      "Qur'ani inaita siku hii yawm al-furqan - Siku ya Upambanuzi - kwa sababu ilitofautisha ukweli na uwongo kabla ya peninsula nzima. Funzo lake la kudumu ni kwamba juhudi za dhati na maandalizi kamili lazima yaunganishwe na kumtegemea Mwenyezi Mungu kikamilifu: Waumini walipanga safu zao, wakachagua msingi wao, na wakaomba dua, na ushindi ukahesabiwa kwa Mwenyezi Mungu, sio kwa idadi yao.",
    ],
    battleDetails: {
      location: "Visima vya Badr, kusini magharibi mwa Madina",
      modernLocation: "Karibu na Badr ya kisasa, Saudi Arabia",
      hijriDate: "17 Ramadhani 2 AH",
      muslimForces:
        "~Wapiganaji 313, wakiwa na farasi na ngamia wachache (ripoti hutofautiana kidogo)",
      opposingForces: "~ Maquraishi 1,000, wenye silaha bora na wamepanda",
      muslimCommander: "Mtume Muhammad ﷺ",
      opposingCommander: "Amr ibn Hisham (Abu Jahl), aliuawa vitani",
      weather:
        "Mvua usiku uliopita iliimarisha mchanga kwa Waislamu; upatikanaji wa maji ulikuwa wa maamuzi",
      outcome: "Ushindi madhubuti wa Waislamu",
      keyEvents: [
        "Al-Hubab ibn al-Mundhir alishauri kupiga kambi kwenye visima kwanza, kudhibiti maji.",
        "Mtume (Swalla Allaahu ´alayhi wa sallam) aliswali usiku kucha, huku akimuomba Mwenyezi Mungu kwa ajili ya waumini wengi zaidi.",
        "Mabingwa watatu wa Kiquraishi walikutana na Hamza, Ali, na Ubaydah katika pambano moja.",
        "Mwenyezi Mungu aliwatia nguvu waumini kwa Malaika (Qur'ani 8:9) na akawaangusha viongozi wakuu wa Maquraishi.",
        "Takriban maadui 70 waliuawa na 70 walitekwa; mateka walitendewa kibinadamu.",
      ],
      leadershipLesson:
        "Jitayarishe vyema, na shauri kwa wenye ilimu, kisha mtegemee Mwenyezi Mungu kabisa.",
      spiritualLesson:
        "Kikundi kidogo cha waaminifu chenye msaada wa Mwenyezi Mungu kinaweza kupindua tabia mbaya za kidunia - ushindi unatoka kwa Mwenyezi Mungu.",
      facts: [
        "Badr imetajwa na kuelezewa ndani ya Qur'ani zaidi ya uchumba mwingine wowote (Surah al-Anfal).",
        "Baadhi ya mateka waliachiliwa kwa kubadilishana na kuwafundisha kusoma na kuandika watoto wa Madina.",
      ],
    },
    quran: [
      {
        excerpt:
          "Mlipo kuwa mukimuomba msaada Mola wenu Mlezi, naye akakujibuni: Mimi nitakutieni nguvu kwa Malaika elfu wakifuatana wao kwa wao.",
      },
      {
        excerpt:
          "Tayari ilikuwapo Ishara kwenu katika majeshi mawili yaliyo kutana, moja linapigana katika Njia ya Mwenyezi Mungu na jingine la makafiri.",
      },
      {
        excerpt:
          "Nyinyi hamkuwaua, bali Mwenyezi Mungu ndiye aliyewauwa. Na hukutupa unapotupa, bali Mwenyezi Mungu ndiye aliye tupa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Imepokewa kutoka kwa Umar kwamba siku ya Badr Mtume (Swalla Allaahu ´alayhi wa sallam) aliwatazama maadui elfu moja na masahaba zake walikuwa zaidi ya mia tatu, kisha akaelekea Kibla, akanyoosha mikono yake, na akamuomba Mola wake Mlezi: Ewe Mwenyezi Mungu nitimizie uliyoniahidi. Ewe Mwenyezi Mungu, ikiwa kundi hili la Waumini litaangamizwa, Hutaabudiwa katika ardhi. Aliendelea kuomba mpaka nguo yake ikaanguka kutoka kwenye mabega yake, na Abu Bakr akaibadilisha na akasema: Inatosha, ewe Mtume wa Mwenyezi Mungu - Mwenyezi Mungu atatimiza Aliyokuahidi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Vita vya Uhud",
    summary: "Shawwal 3 AH - somo la gharama kubwa katika utiifu, nidhamu, na uthabiti.",
    body: [
      "Muktadha na sababu: Mwaka mmoja baada ya Badr, Maquraishi walirudi kulipiza kisasi cha wafu wao, wakiwakusanya wapiganaji wapatao 3,000 - wakiwa na askari wapanda farasi wakiongozwa na Khalid ibn al-Walid, wakati huo wakiwa bado ni adui, na wanawake wakiwahimiza wanaume kuendelea na ngoma na kifahari. Waislamu, wapatao 700 baada ya wengine kujitoa, walichukua nafasi na Mlima Uhud nyuma yao.",
      "Kilichotokea: Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) aliwaweka wapiga mishale hamsini juu ya kilima wakilinda sehemu ya nyuma ya jeshi na akawapa amri aliyoirudia kwa msisitizo: “Msiondoke katika nafasi hii hata mkituona tunanyakuliwa na ndege, mpaka niwapelekeeni. Mwanzoni mpango ulifanya kazi kikamilifu - Waislamu waliwarudisha Maquraishi na adui wakaanza kukimbia.",
      "Kuona adui kutawanyika na nyara zikiwa wazi, wengi wa wapiga mishale waliacha kilima kinyume na utaratibu, hakika vita vilishinda. Khalid ibn al-Walid alishika muda huo, akawasukuma wapanda farasi wake kwenye pengo lisilotetewa, na akawapiga Waislamu kwa nyuma. Agizo lilianguka na kuwa fujo.",
      'Takwimu muhimu na gharama: Hamza ibn Abd al-Muttalib, "Simba wa Mwenyezi Mungu," aliuawa kishahidi, pamoja na baadhi ya masahaba sabini. Mtume (Swalla Allaahu \'alayhi wa aalihi wa sallam) alijeruhiwa jino lake na kukatwa uso wake - na uvumi ukaenea uwanjani kuwa ameuawa. Waumini walipomwona yu hai, walimkusanyikia kwenye mteremko wa mlima, na Maquraishi, kwa kushindwa kuwamaliza, wakaondoka.',
      "Qur’ani inahutubia siku hii kwa urefu katika Sura ya Al Imran, ikiweka dhima juu ya uasi wa baadhi ya watu, si kwa kushindwa kwa imani au ahadi ya Mwenyezi Mungu: “Hakika Mwenyezi Mungu amekutimizieni ahadi yake… Bado kifungu hicho hicho kinafariji jamii iliyojeruhiwa na kukataza kukata tamaa.",
      "Kwa hiyo Uhud si kushindwa kwa Uislamu bali ni somo lililohifadhiwa: ushindi uliotolewa hapo awali uliondolewa mara tu nidhamu ilipovunjika, amri zilizo wazi ni muhimu kama vile ujasiri, na majaribu husafisha umma - kwa wale wanaotubu na kushikilia imara, kurudi nyuma kunakuwa ndio mbegu ya ukuaji.",
    ],
    battleDetails: {
      location: "Miteremko ya Mlima Uhud, kaskazini mwa Madina",
      modernLocation: "Uhud, mkoa wa Madina, Saudi Arabia",
      hijriDate: "Shawwal 3 AH",
      muslimForces: "~ 700 (baada ya wengine kuondoka kabla ya vita)",
      opposingForces: "~Maquraishi 3,000 na washirika, pamoja na wapanda farasi",
      muslimCommander: "Mtume Muhammad ﷺ",
      opposingCommander:
        "Abu Sufyan ibn Harb; Khalid ibn al-Walid aliongoza wale wapanda farasi waliokuwa pembeni",
      outcome: "Kuraishi tactical shamba faida; jamii ya Kiislamu imesalia imara",
      keyEvents: [
        "Mtume ﷺ aliwaweka wapiga mishale 50 juu ya mlima kwa amri kali wasitoke humo.",
        "Waislamu walivunja safu ya adui, lakini wapiga mishale wengi waliacha kazi zao ili kukusanya ngawira.",
        "Wapanda farasi wa Khalid ibn al-Walid walitumia mwanya huo na kushambulia kutoka nyuma.",
        "Hamza na masahaba wapatao 70 waliuawa kishahidi; Mtume ﷺ alijeruhiwa.",
        "Uvumi wa uongo wa kifo cha Mtume ulienea; Waumini walikusanyika walipomuona yu hai.",
      ],
      leadershipLesson:
        "Maagizo ya wazi na utekelezaji wa nidhamu ni muhimu kama vile ushujaa; kuacha chapisho lako kunaweza kutengua ushindi.",
      spiritualLesson:
        "Majaribu huwasafisha waaminio; kurudi nyuma kunakokutana na toba na uthabiti husababisha ukuaji.",
    },
    quran: [
      {
        excerpt:
          "Hakika Mwenyezi Mungu alikutimizieni ahadi yake mlipo kuwa mnawauwa kwa idhini yake, mpaka mkakata tamaa, mkabishana juu ya amri, na mkaasi baada ya Yeye kukuonyesheni mnayo yapenda.",
      },
      {
        excerpt:
          "Basi msilegee wala msihuzunike, kwani nyinyi mtakuwa bora ikiwa nyinyi ni Waumini wa kweli.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mtume ﷺ alimteua Abdullah ibn Jubayr juu ya wapiga mishale hamsini siku ya Uhud na akasema: Shikeni nafasi zenu; hata ukituona tunanyakuliwa na ndege, usiiache mpaka nikuletee - na hata ukiona tumewashinda, usiondoke mpaka nikuletee. Adui waliposhindwa na wapiga mishale wakaona nyara, walisema, Ngawira! na wakaacha wadhifa wao - hivyo sabini wetu tukauawa.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Vita vya Trench",
    summary: "Shawwal 5 AH - Mashirikisho yanauzingira Madina; mfereji na upepo huzivunja.",
    body: [
      "Muktadha na sababu: Pia huitwa Ghazwat al-Ahzab (Vita vya Mashirikisho), hii ilikuwa ni juhudi kubwa zaidi ya adui kuuangamiza Uislamu mara moja na kwa wote. Machifu wa Banu Nadir, waliofukuzwa mapema kwa ajili ya usaliti, walipanda farasi hadi Makka na Ghatafan na kukusanya muungano - Waquraishi, Ghatafan, na makabila mengine - wanaokadiriwa kuwa kati ya wanaume 10,000 na 24,000. Waislamu walikuwa karibu 3,000, na hatari ilikuwa ipo.",
      "Kilichotokea: Kukabiliana na mzingiro hakuna mji wa Kiarabu ungeweza kustahimili katika vita vya wazi, Mtume ﷺ alishauriana na masahaba zake. Salman al-Farisi alipendekeza mbinu ya Kiajemi isiyojulikana kwa vita vya Waarabu - kuchimba mtaro wenye kina kirefu katika njia ya kaskazini iliyo wazi, upande pekee ambao haujalindwa na mashamba ya lava, bustani, au nyumba zenye ngome. Waumini walichimba kwa siku nyingi kwenye baridi kali na njaa, Mtume (Swalla Allaahu ´alayhi wa sallam) akiwa amebeba udongo mgongoni mwake na akijifunga jiwe tumboni mwake dhidi ya maumivu ya saumu.",
      "Mfereji ulifanya kazi. Jeshi kubwa lilipofika lilijikuta limeshindwa kuvuka; wapanda farasi wachache walioruka walirudishwa nyuma. Kuzingirwa kulitulia kwa takribani wiki mbili hadi nne za baridi, hali ya wasiwasi, na kupigana badala ya vita kali.",
      "Jumuiya ilijaribiwa kwa msingi wake. Wanafiki walitoa visingizio na kutaka kutoroka; kabila la Banu Quraydha ndani ya mji liliyumba kuelekea kwa adui; Qur'ani inaeleza nyoyo zinazofika kooni. Hata hivyo Waumini walishikilia, na Nu'aym ibn Mas'ud - Mwislamu mpya kwa siri - akazua kutoaminiana baina ya makundi yaliyoshiriki mpaka wakaasi wao kwa wao.",
      "Kisha nafuu ikatoka kwa Mwenyezi Mungu, sio kutoka kwa panga. Upepo mkali na wa baridi ulipasua kambi ya adui, na kupindua moto wa kupikia na mahema, na majeshi yasiyoonekana yaliwajaa hofu. Muungano huo, ambao tayari ulikuwa umevunjika na vifaa duni, vilivunjika na kujiondoa usiku. Mtume (Swalla Allaahu ´alayhi wa sallam) akasema baada ya hapo kwamba Mwenyezi Mungu peke yake ndiye aliyeyashinda makundi.",
      "Masomo ya kudumu: ushauri mzuri unapaswa kupitishwa popote unapotoka - hapa kutoka kwa mwongofu wa Kiajemi; njia lazima zichukuliwe kwa kikomo chao - mfereji uliochimbwa, safu zilizowekwa; kisha mwisho ni kwa Mwenyezi Mungu anayeweza kulirudisha jeshi kwa upepo. Surah al-Ahzab inahifadhi jaribio zima na unafuu wake.",
    ],
    battleDetails: {
      location: "Upande wa kaskazini unakaribia Madina",
      modernLocation: "Madina, Saudi Arabia",
      hijriDate: "Shawwal 5 AH",
      muslimForces: "~3,000",
      opposingForces:
        "Muungano wa shirikisho (~10,000–24,000; takwimu zinatofautiana katika vyanzo)",
      muslimCommander: "Mtume Muhammad ﷺ",
      opposingCommander:
        "Abu Sufyan akiwaongoza Maquraishi; machifu washirika wa Ghatafan na wengineo",
      weather: "Baridi kali wakati wa kuchimba; upepo mkali wa kimungu ulimaliza kuzingirwa",
      outcome: "Ushindi wa Waislamu bila ya vita kali; muungano huo unasambaratika",
      keyEvents: [
        "Salman al-Farisi alipendekeza kuchimba mtaro kwenye ukanda wa kaskazini unaoweza kuathirika.",
        "Mtume ﷺ alishiriki kazi, kubeba udongo na kufunga jiwe dhidi ya njaa.",
        "Handaki hiyo ilisimamisha jeshi kubwa, na kulazimisha kuzingirwa badala ya vita vya wazi.",
        "Nu'aym ibn Mas'ud alizusha mfarakano ambao uligawanya washirika wa muungano.",
        "Upepo wa baridi kali na majeshi ya ghaibu (Qur'ani 33:9) yalisambaratisha kambi ya adui; walijiondoa.",
      ],
      leadershipLesson:
        "Kushauriana kwa upana na kupitisha mawazo mazuri bila kujali asili yao; shiriki ugumu wa jamii mwenyewe.",
      spiritualLesson:
        "Shikamaneni na mzingiro na mkabidhi Mwenyezi Mungu matokeo, ambaye aweza kurudisha nyuma jeshi kwa upepo.",
    },
    quran: [
      {
        excerpt:
          "Enyi mlio amini, kumbukeni neema ya Mwenyezi Mungu iliyo juu yenu yalipokujieni majeshi na tukayapelekea upepo na majeshi msiyo yaona… Hapo Waumini walijaribiwa na kutikiswa kwa mtikiso mkali.",
      },
      {
        excerpt:
          "Na Waumini walipoyaona makundi walisema: Haya ndiyo aliyotuahidi Mwenyezi Mungu na Mtume wake, na hayakuwazidishia Imani na utii.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) aliwasihi Washirikina siku ya Al-Ahzab, akisema: Ewe Mwenyezi Mungu, Mteremshi wa Kitabu, Mwepesi wa kuhisabu, washinde Makundi. Ewe Mwenyezi Mungu washinde na watikise.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Banu Qurayzah",
    summary: "5 AH - mkataba uliosalitiwa wakati wa kuzingirwa; hukumu na mwamuzi aliyekubaliwa.",
    body: [
      "Muktadha na sababu: Banu Qurayzah walikuwa ni kabila la Kiyahudi la Madina lililofungamana na Waislamu kwa agano la mji huo la kulindana. Katika kilele cha Mfereji, wakati Mashirikisho yalipoipigia simu Madina na kunusurika kwa jumuiya hiyo kuning'inizwa kwa uzi, chifu wa Banu Nadir aliwashawishi viongozi wa Kurayzah kuvunja agano hilo na kufungua mstari wa pili kutoka ndani ya mji. Kuja wakati huo, huu haukuwa mzozo wa kibinafsi bali uhaini wakati wa mzingiro ambao ungeweza kumuangamiza kila mtu hapo Madina.",
      "Kilichotokea: Baada ya Mashirikisho kujitoa, Mtume ﷺ alihamia dhidi ya Banu Quraydhah, ambao walijifungia ndani ya ngome zao. Kuzingirwa kulichukua muda wa siku ishirini na tano mpaka wakakubali kusalimu amri - lakini wakaomba kwamba hatima yao isiamuliwe moja kwa moja na Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) bali na msuluhishi wao wenyewe walimchagua: Sa'd ibn Mu'adh, chifu wa Aws, washirika wao wa muda mrefu.",
      "Hukumu: Sa'd - yeye mwenyewe akifa kutokana na jeraha lililopigwa kwenye Handaki - aliamuru kwamba watu wa vita ambao walifanya usaliti wauawe na wanawake na watoto kuchukuliwa mateka, hukumu kali kwa kiwango chochote lakini kwa kuzingatia sheria ya vita ya wakati huo na mahali kwa uhaini chini ya kuzingirwa. Mtume ﷺ amesema Sa’d amehukumu kwa mujibu wa hukumu ya Allah.",
      "Jinsi ya kuisoma kwa makini: Hii ilikuwa ni adhabu kwa kitendo mahsusi cha uhaini wa wakati wa vita kilichofanywa na wapiganaji waliovunja mapatano ya ulinzi katika saa iliyo hatarini zaidi ya jumuiya - si hukumu dhidi ya watu kwa ajili ya imani yao, na kwa msisitizo haikuwa kiolezo cha jinsi Waislamu wanavyopaswa kuwatendea Wayahudi au jumuiya yoyote ya kidini. Qur'ani Tukufu na Sunnah zinaamuru uadilifu na kutendewa mema kwa wasiokuwa Waislamu wenye amani (Qur'ani 60:8), na makabila mengine ya Kiyahudi na watu binafsi wa Madina ambao walishika imani hawakudhurika kamwe. Usomi wa kawaida huchukulia hii kama sehemu ya kihistoria ya sheria ya uhaini, na wasomi wengine wa baadaye hata walitilia shaka maelezo ya nambari zinazopitishwa.",
      "Qur'ani inarejelea kipindi kwa uthabiti katika Surah al-Ahzab kama matokeo ya vita vya Muungano, bila ushindi. Somo la kudumu ni uzito wa kuvunja agano - usaliti wa uaminifu katika dakika ya hatari inayoshirikiwa hubeba uzito mzito zaidi - iliyowekwa kando ya kanuni kwamba hata adui ana haki ya kuhukumiwa na mwamuzi aliyekubaliwa na asiye na upendeleo badala ya kulipiza kisasi kisichozuiliwa.",
    ],
    battleDetails: {
      location: "Ngome za Banu Quraydhah, pembezoni mwa Madina",
      modernLocation: "Madina, Saudi Arabia",
      hijriDate: "Dhul-Qa'dah 5 AH (mara baada ya Handaki)",
      muslimForces: "Jeshi la Madina, mara baada ya kuzingirwa kwa Handaki",
      opposingForces: "Banu Quraydhah, wakiwa na ngome ndani ya ngome zao",
      muslimCommander: "Mtume Muhammad ﷺ",
      outcome: "Kujisalimisha baada ya kuzingirwa; hukumu iliyotolewa na mwamuzi mteule wa kabila",
      keyEvents: [
        "Banu Quraydha walivunja agano la Madina wakati wa kuzingirwa kwa Muungano.",
        "Baada ya Mashirikisho kujiondoa, Waislamu walizingira ngome zao kwa takriban siku 25.",
        "Kabila liliomba kuhukumiwa na Sa'd ibn Mu'adh, chifu wa washirika wao wa muda mrefu Aws.",
        "Sa'd alitawala kwa sheria ya vita ya zama kwa uhaini chini ya kuzingirwa; Mtume ﷺ akaithibitisha hukumu hiyo.",
      ],
      leadershipLesson:
        "Hata dhidi ya adui, ruhusu hukumu kwa mwamuzi aliyekubaliwa, asiyependelea badala ya kisasi kisichozuiliwa.",
      spiritualLesson:
        "Kuvunja agano la kulindana katika wakati wa hatari ya pamoja ni miongoni mwa usaliti mkubwa zaidi.",
    },
    quran: [
      {
        excerpt:
          "Na akawateremsha wale walio waunga mkono katika Watu wa Kitabu kutoka katika ngome zao, na akatia khofu katika nyoyo zao, kundi mliloliua, na kundi mliloliteka. Na akakurithishani ardhi yao na nyumba zao.",
      },
      {
        excerpt:
          "Mwenyezi Mungu hakukatazini na wale ambao hawakupigeni vita kwa ajili ya Dini, wala hawakutoeni majumbani mwenu, kuwafanyia wema na kuwafanyia uadilifu. Hakika Mwenyezi Mungu anawapenda wafanyao uadilifu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Banu Quraydha walipokubali kuikubali hukumu ya Sa'd ibn Mu'adh, Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam). Alikuja, na Mtume ﷺ akasema: Simama kwa mkuu wako. Sa'd alihukumu kwamba wanaume wao wapiganaji wauawe na wanawake wao na watoto wao wachukuliwe mateka. Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) amesema: Mmehukumu kwa hukumu ya Mwenyezi Mungu - au alisema, kwa hukumu ya Mfalme.",
      },
    ],
    disclaimer:
      "Hii ilikuwa adhabu kwa kitendo maalum cha uhaini wa wakati wa vita na wapiganaji, kuhukumiwa na msuluhishi kabila lenyewe lilimchagua. Si hukumu dhidi ya watu wowote kwa ajili ya dini yao na si kigezo cha mahusiano na Mayahudi au jumuiya yoyote ya imani, ambayo Uislamu unaamuru kutendewa kwa uadilifu na wema (Qur'ani 60:8). Wasomi wengine wa baadaye walitilia shaka maelezo ya nambari zilizopitishwa.",
  },
  {
    title: "Mkataba wa Hudaybiyyah",
    summary: "6 Hijria - mapatano ambayo yalionekana kama kikwazo na yakawa ushindi wa wazi.",
    body: [
      "Muktadha na sababu: Mnamo mwaka wa 6 AH Mtume ﷺ aliondoka na masahaba wapatao 1,400 - wasio na silaha lakini kwa panga za wasafiri - akikusudia tu kufanya hija ndogo (umrah) kwenda Ka'abah, sio kupigana. Maquraishi, hawakutaka kuonekana wakiwaruhusu Waislamu kuingia Makka, walifunga njia kwenye sehemu inayoitwa Hudaybiyyah kwenye mpaka mtukufu.",
      "Ahadi ya Ridwan: Ilipofika uvumi kwenye kambi kwamba Maquraishi wamemuua mjumbe wa Mtume Uthman ibn Affan, Mtume ﷺ aliwaita maswahaba waweke rehani chini ya mti wa mshita kwamba hawatakimbia. Takriban mia kumi na nne walitoa ahadi hiyo - Bay'at al-Ridwan, Ahadi ya Radhi za Mwenyezi Mungu - na Qur'ani baadaye ikatangaza: \"Mwenyezi Mungu alikuwa radhi na Waumini walipoweka kiapo cha utii kwako chini ya mti\" (48:18). Uthman alithibitika kuwa yu hai, na Waquraishi, wakiwa wameshtushwa na dhamira iliyoonyeshwa, wakatumwa kufanya mazungumzo.",
      "Kilichotokea: Masharti ya mapatano yalionekana kufedhehesha. Waislamu wangerudi mwaka huu bila umra na wangeweza kurudi tu mwaka ujao. Kungekuwa na amani ya miaka kumi. Yeyote anayekimbia kutoka kwa Waquraishi kwenda kwa Waislamu angerudishwa, lakini si kinyume chake - kifungu ambacho kiliuma. Wakati Mwislamu aliyefungwa minyororo, Abu Jandal, alipoburutwa nyuma mbele ya macho yao chini ya kifungu hiki hiki, masahaba walikuwa karibu kukatika; Umar alilihoji kwa uwazi na akakumbushwa kwa upole kumwamini Mtume wa Mwenyezi Mungu.",
      'Kwa nini ulikuwa ni ushindi: Kwa mara ya kwanza Maquraishi waliwashughulikia Waislamu kama mamlaka sawa katika mkataba ulioandikwa. Amani ya miaka kumi ilifungua njia; Uislamu ulienea kwa haraka na kwa amani wakati wa mapatano hayo - waliingia zaidi katika Uislamu katika miaka hiyo miwili kuliko miaka yote iliyopita. Akiwa ameachiliwa kutoka kwa Waquraishi, Mtume ﷺ aliweza kurejea Khaybar na kutuma barua za kuwaalika wafalme na makabila kwenye Uislamu. Katika safari ya kurejea iliteremka Surah al-Fath, ikifungua kwa kusema: "Hakika sisi tumekupa ushindi ulio dhaahiri."',
      "Mafunzo ya kudumu: Huu ni mfano mkuu wa subira juu ya msukumo na kumwamini Mwenyezi Mungu na Mtume wake wakati hekima ya uamuzi bado haijaonekana. Kile ambacho masahaba walihisi kuwa ni kushindwa kwanza, Qur'ani ilitaja ushindi wa wazi - na ndani ya miaka miwili ilifungua njia ya kuelekea Makka yenyewe. Utayari wa kukubali amani ngumu, kuheshimu mapatano, na kungoja kunaonyeshwa hapa kuwa aina ya nguvu, sio udhaifu.",
    ],
    battleDetails: {
      location: "Hudaybiyyah, kwenye mpaka mtukufu karibu na Makka",
      modernLocation: "Al-Shumaisi, karibu na Makka, Saudi Arabia",
      hijriDate: "Dhul-Qa'dah 6 Hijiria",
      muslimForces: "~Mahujaji 1,400, wasio na vifaa kwa ajili ya vita",
      opposingForces: "Maquraishi, wakifunga njia ya kwenda Makka",
      muslimCommander: "Mtume Muhammad ﷺ",
      outcome:
        "Makubaliano ya miaka kumi; hakuna mapigano; baadaye uliitwa ushindi wa wazi katika Qur'ani",
      keyEvents: [
        "Waislamu walitoka kwenda umra, sio kwa ajili ya vita, na wakasimamishwa Hudaybiyyah.",
        "Juu ya ripoti ya uongo ya kifo cha Uthman, ~1,400 walitoa Ahadi ya Ridwan chini ya mti.",
        "Makubaliano ya miaka kumi yalitiwa saini kwa masharti ambayo masahaba waliona kuwa machungu (kifungu cha kurudi, Abu Jandal).",
        "Uislamu ulienea kwa kasi wakati wa amani; Surah al-Fath iliuita mkataba huo ushindi wa dhahiri.",
      ],
      leadershipLesson:
        "Kubali amani ngumu na uiheshimu; makubaliano ya busara leo yanaweza kufungua mlango mkubwa zaidi kesho.",
      spiritualLesson:
        "Mwamini Mwenyezi Mungu na Mtume wake inapofichika hekima ya uamuzi - subira ndio ushindi wa kweli.",
    },
    quran: [
      {
        excerpt:
          "Hakika Sisi tumekupeni ushindi ulio dhaahiri, ili Mwenyezi Mungu Akughufirie yaliyo kuwa kabla ya dhambi zenu na yatakayofuata, na atimize neema zake juu yenu, na akuongozeni kwenye Njia Iliyo Nyooka.",
      },
      {
        excerpt:
          "Hakika Mwenyezi Mungu amewaridhia Waumini walipo fungamana nawe chini ya mti, na alijua yaliyomo nyoyoni mwao, basi akateremsha utulivu juu yao na akawalipa ushindi wa karibu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Jabir ibn Abdullah amesema: Siku ya al-Hudaybiyyah tulikuwa mia kumi na nne. Tuliweka kiapo cha utii kwa Mtume ﷺ chini ya mti, na alikuwa mbora wa watu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Msafara wa Khaybar",
    summary: "7 AH - ngome zenye ngome ambazo ziliunga mkono Mashirikisho yanatiishwa.",
    body: [
      "Muktadha na sababu: Khaybar ilikuwa ni mlolongo wa ngome zenye rutuba za oasis kaskazini mwa Madina, nyumbani kwa makabila yaliyofukuzwa hapo awali kwa ajili ya uhaini - ikiwa ni pamoja na machifu wa Banu Nadir ambao walikuwa wameandaa muungano wa Muungano kwenye Handaki. Kutoka hapo waliendelea kukusanya maadui dhidi ya Madinah. Huku mbele ya Maquraishi ikiwa imegandamizwa na Hudaybiyyah, Mtume ﷺ alichukua hatua ya kuupunguza msingi huu uliobaki wa uadui.",
      'Nini kilifanyika: Waislamu - karibu 1,600 - walisonga mbele kwenye ngome moja baada ya nyingine. Kampeni ilikuwa ngumu na iliyochorwa kwa wiki kadhaa. Siku moja ngumu Mtume (Swalla Allaahu \'alayhi wa aalihi wa sallam) alisema: "Kesho nitampa bendera mtu ambaye anampenda Mwenyezi Mungu na Mtume wake, na ambaye Mwenyezi Mungu na Mtume wake wanampenda, ambaye kupitia mikono yake Mwenyezi Mungu atampa ushindi." Asubuhi iliyofuata alimwita Ali ibn Abi Talib - ambaye alikuwa anaumwa na macho - akamswalia mpaka akapona, na akampa bendera; ngome muhimu ilianguka.',
      "Makazi: Wakati ngome zilipochukuliwa, wenyeji hawakufukuzwa. Wakaomba kubaki na kuendelea kulima ardhi, wakiwapa Waislamu sehemu ya mazao hayo, na Mtume ﷺ akakubali. Mpangilio huu - wakulima waliotekwa waliendelea na ardhi yao chini ya mkataba wa kugawana mazao - ukawa mfano wa awali uliofanyiwa utafiti katika sheria ya baadaye ya Kiislamu ya mikataba na kodi.",
      "Watu muhimu: kampeni inakumbukwa zaidi ya yote kwa nafasi ya Ali na kwa maadili yaliyomo katika hadithi ya bendera - kwamba uongozi umekabidhiwa kwa msingi wa uaminifu na upendo wa Mwenyezi Mungu, sio tu cheo au nguvu.",
      "Ujumbe juu ya utunzaji: Khaybar wakati mwingine inaburutwa kwenye mabishano ya kisiasa ya baadaye. Hapa inafafanuliwa madhubuti kama msafara wa karne ya saba uliorekodiwa katika seerah ya zamani - jibu kwa msingi wa uadui, uliohitimishwa sio kwa kufukuzwa kwa wingi lakini kwa suluhu iliyojadiliwa.",
    ],
    battleDetails: {
      location: "Oasis ya Khaybar, kaskazini mwa Madinah",
      modernLocation: "Khaybar, Saudi Arabia",
      hijriDate: "Muharram–Safar 7 AH",
      muslimForces: "Takriban 1,600",
      opposingForces: "Majeshi yenye ngome katika ngome kadhaa",
      muslimCommander: "Mtume Muhammad ﷺ; Ali ibn Abi Talib aliongoza shambulio hilo la maamuzi",
      outcome: "Udhibiti wa Waislamu wa ngome hizo; makubaliano ya kugawana mazao yaliyojadiliwa",
      keyEvents: [
        "Ngome hizo zilipunguzwa moja baada ya nyingine kwa wiki kadhaa za kuzingirwa.",
        "Bendera ilitolewa kwa Ali, ambaye macho yake Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) aliyaponya kwa maombi yake.",
        "Bingwa Marhab alishindwa na ngome muhimu ikaanguka.",
        "Wakazi walibaki kwenye ardhi yao kama wakulima chini ya mkataba wa kugawana mazao.",
      ],
      leadershipLesson:
        "Wakabidhi jukumu wale wanaofaa zaidi - na wale ambao nyoyo zao ziko kwa Mwenyezi Mungu.",
      spiritualLesson:
        "Uvumilivu kupitia ugumu wa muda mrefu, uliounganishwa na unyoofu, huleta msaada wa Mwenyezi Mungu.",
    },
    hadith: [
      {
        excerpt:
          "Siku ya Khaybar Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) alisema: Kesho nitampa bendera hii mtu ambaye anampenda Mwenyezi Mungu na Mtume wake, na ambaye Mwenyezi Mungu na Mtume wake wanampenda, na ambaye kupitia mikono yake Mwenyezi Mungu atampa ushindi. Siku iliyofuata alimwita Ali, ambaye alikuwa na macho yanayouma; alitemea mate machoni pake na akamswalia, na Ali akaponywa kana kwamba hakuwahi kuugua, na akapewa bendera.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Vita vya Muutah",
    summary:
      "Jumada al-Ula 8 AH - msafara wa mpakani ambapo makamanda watatu wanauawa kishahidi kwa zamu.",
    body: [
      "Muktadha na sababu: Mtume (Swalla Allaahu ´alayhi wa sallam) alikuwa ametuma mjumbe kuelekea upande wa kaskazini unaoshikamana na Byzantine, na mjumbe huyo aliuawa - uvunjaji mkubwa sana, kwani wajumbe walilindwa na sheria za mataifa. Kwa kujibu alituma jeshi la watu wapatao 3,000 kuelekea Mu'tah, karibu na mpaka wa Warumi mashariki mwa Yordani.",
      "Msururu wa amri: Kabla hawajaondoka, Mtume (Swalla Allaahu ´alayhi wa sallam) aliitaja safu ya urithi - Zayd bin Harithah kuongoza, na kama ataanguka, Jaafar bin Abi Talib, na akianguka, Abdullah ibn Rawahah - kitendo cha kushangaza cha kuona mbele kitakachokuwa na maamuzi.",
      "Kilichotokea: Huko Mu'tah Waislamu walikutana na jeshi kubwa zaidi la Wabyzantine na makabila washirika ya Waarabu - vyanzo vinazungumza juu ya makumi ya maelfu, ingawa takwimu hazijulikani na zinawezekana kuwa zimetiwa chumvi. Zayd akaanguka, kisha Jaafar - ambaye anakumbukwa kwa kushika bendera mpaka mikono yake yote miwili ikakatwa - kisha Abdullah ibn Rawahah, sawasawa na utaratibu ambao Mtume ﷺ aliuweka.",
      'Kujiondoa: Pamoja na makamanda wote watatu walioteuliwa kuuawa kishahidi, masahaba walimpa bendera Khalid ibn al-Walid, Muislamu mpya baada ya Hudaybiyyah. Kwa msururu wa hila na kupeleka jeshi upya aliliondoa jeshi hilo lililokuwa limezidi idadi yake na kulirudisha nyumbani kwa kiasi kikubwa likiwa halijakamilika - jambo ambalo Mtume ﷺ aliliheshimu, baadae alimwita Khalid "upanga miongoni mwa panga za Mwenyezi Mungu." Huko Madina Mtume ﷺ alimlilia Zayd, Ja’far, na Ibn Rawahah na akatoa taarifa ya kifo chao kabla ya mjumbe yeyote kufika.',
      "Masomo ya kudumu: kutaja warithi kabla ya hatari - mwendelezo wa uongozi - kuliokoa jeshi kihalisi; na kujiondoa kwa nidhamu ambayo huhifadhi maisha si fedheha bali ni hekima. Kuuawa kishahidi katika njia ya Mwenyezi Mungu ni heshima, si kushindwa kisiasa, na vita vile vile viliwaingiza Waislamu kwenye karama za Khalid, mara wakageukia kabisa huduma ya imani.",
    ],
    battleDetails: {
      location: "Muutah, mashariki mwa Mto Yordani",
      modernLocation: "Karibu na Karak, Jordan",
      hijriDate: "Jumada al-Ula 8 AH",
      muslimForces: "~3,000",
      opposingForces:
        "Vikosi vya Waarabu vya Byzantine na washirika (vikubwa zaidi; idadi isiyojulikana katika vyanzo)",
      muslimCommander:
        "Zayd bin Harithah, kisha Jaafar, kisha Ibn Rawahah, kisha Khalid bin al-Walid.",
      outcome: "Kujitoa kwa Waislamu kwa utaratibu; mauaji makubwa lakini jeshi lilihifadhi",
      keyEvents: [
        "Mtume ﷺ aliwataja makamanda watatu kwa kufuatana kabla ya kuondoka.",
        "Wote watatu walianguka kwa zamu pale Muutah, sawasawa na ilivyotabiriwa.",
        "Khalid ibn al-Walid alichukua amri na kuliingiza jeshi kwenye usalama.",
        "Mtume (Swalla Allaahu ´alayhi wa sallam) alilia huko Madina na akawatangazia mashahidi kabla habari hazijafika.",
      ],
      leadershipLesson:
        "Taja warithi kabla ya hatari kutokea - mwendelezo wazi wa uongozi huokoa maisha.",
      spiritualLesson:
        "Shahada katika njia ya Mwenyezi Mungu ni heshima; uondoaji wa busara unaookoa jeshi sio kushindwa.",
    },
    appLinks: [{}],
  },
  {
    title: "Kutekwa kwa Makka",
    summary: "Ramadhani 8 AH - ufunguzi wa karibu usio na damu wa Makka chini ya msamaha wa jumla.",
    body: [
      "Muktadha na sababu: Mkataba wa Hudaybiyyah ulifanyika mpaka washirika wa Maquraishi, Banu Bakr, wakawashambulia washirika wa Waislamu, Banu Khuza'ah - wakiwaua baadhi yao hata ndani ya eneo tukufu - huku Waquraishi wakisambaza silaha kwa siri. Hii ilivunja makubaliano. Wakati jaribio la Maquraishi wenyewe la kuifunga liliposhindikana, njia ya kwenda Makka iliwekwa wazi.",
      "Kilichotokea: Mtume ﷺ alitembea na masahaba wapatao 10,000, wakienda kwa kasi na kwa siri kiasi kwamba Maquraishi hawakuwa na muda wa kuandaa upinzani. Abu Sufyan, kamanda mzee wa Maquraishi, alitoka nje na kuukubali Uislamu usiku wa kuamkia kuingia. Jeshi liliingia Makka kutoka pande kadhaa na karibu hakuna mapigano - safu moja tu ilikutana na upinzani mfupi wa silaha; Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) aliwaamrisha waziwazi makamanda wake wasipigane isipokuwa wale waliopigana nao.",
      'Msamaha: Huu ndio wakati unaofafanua ushindi. Akiwa amesimama kwenye Al-Kaaba pamoja na mji uliokuwa ukimtesa, kumsusia, na kumfukuza sasa kwa rehema yake, Mtume (Swalla Allaahu \'alayhi wa aalihi wa sallam) akawauliza Maquraishi wanachotarajia kutoka kwake, kisha akatangaza - akirejea maneno ya Nabii Yusuf kwa ndugu waliomdhulumu - "Si lawama kwenu leo. Nendeni, kwani mmekuwa huru." Msamaha wa jumla ulifunika idadi ya watu; wachache tu ndio walioachwa kwa makosa maalum, na hata wengi wao walisamehewa walipokuja kwake.',
      "Utakaso: Kisha Mtume (Swalla Allaahu ´alayhi wa sallam) akaisafisha Al-Ka’abah na masanamu yake 360, huku akisoma, “Haki imekuja na uwongo umetoweka” (Qur’ani 17:81). Bilal ibn Rabah, wakati mmoja aliteswa kama mtumwa katika mji huo huo, alipanda juu ya Ka'bah na akaitisha adhana juu ya Makka. Surah an-Nasr — “Inapokuja ushindi wa Mwenyezi Mungu na ushindi” - inaashiria ufunguzi huu na makundi yake kuingia kwenye imani.",
      "Masomo ya kudumu: hii ni kati ya maonyesho makubwa zaidi ya tabia ya kinabii inayotumiwa kwa nguvu. Ukuu katika ushindi ulishinda mioyo zaidi kuliko adhabu yoyote inaweza kuwa nayo; lengo kote lilikuwa ni mwongozo, si kulipiza kisasi, na uwezo ulifanywa kutumikia ujumbe badala ya ubinafsi. Inaitwa kwa kufaa Fath Makkah - Ufunguzi - sio kufukuzwa.",
    ],
    battleDetails: {
      location: "Makka",
      modernLocation: "Makka, Saudi Arabia",
      hijriDate: "Ramadhani 8 AH",
      muslimForces: "~10,000",
      opposingForces: "Maquraishi (walijisalimisha karibu bila kupigana)",
      muslimCommander: "Mtume Muhammad ﷺ",
      outcome: "Makka ilifunguka karibu bila kumwaga damu; msamaha wa jumla uliotangazwa",
      keyEvents: [
        "Mapambano yalizuka pale Maquraishi walipounga mkono mashambulizi dhidi ya washirika wa Waislamu, Khuza'ah.",
        "Abu Sufyan alisilimu kabla ya jeshi kuingia; nyumba yake ilitangazwa kuwa mahali pa usalama.",
        "Mtume (Swalla Allaahu ´alayhi wa sallam) alitoa msamaha wa jumla: Hakuna lawama juu yako leo - nenda, uko huru.",
        "Ka'aba ilisafishwa na masanamu yake; Bilal aliita adhana akiwa juu yake.",
        "Maadui wa zamani waliukubali Uislamu kwa wingi.",
      ],
      leadershipLesson:
        "Ukarimu katika ushindi hushinda mioyo kwa kudumu zaidi kuliko hofu au kisasi.",
      spiritualLesson:
        "Lengo lilikuwa mwongozo, sio kulipiza kisasi - nguvu hufanywa ili kutumikia ujumbe, sio ubinafsi.",
    },
    quran: [
      {
        excerpt:
          "Itakapofika nusura ya Mwenyezi Mungu na ushindi, na ukawaona watu wanaingia katika Dini ya Mwenyezi Mungu kwa wingi, basi mtakase kwa kumsifu Mola wako Mlezi na muombe msamaha. Hakika Yeye ni Mwenye kupokea toba.",
      },
      {
        excerpt:
          "Akasema: Hapana lawama kwenu leo. Mwenyezi Mungu akusameheni, na Yeye ndiye mwingi wa kurehemu kuliko wanaorehemu. - Maneno ya Nabii Yusuf ambayo Mtume ﷺ aliyarudia kwa Maquraishi siku ya ushindi.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Vita vya Hunayn",
    summary: "Shawwal 8 AH - kuvizia baada ya Makka; kujiamini kujaribiwa, kisha ushindi kutolewa.",
    body: [
      "Muktadha na sababu: Siku chache tu baada ya kufunguliwa kwa Makka, makabila yenye nguvu ya Hawazin na Thaqif yalikusanyika kuwapiga Waislamu kabla utawala wao mpya haujatulia. Mtume ﷺ alitoka nje na jeshi kubwa - wapatao 12,000, wakiwemo waongofu wengi wa hivi karibuni wa Makka - kikosi kikubwa zaidi cha Waislamu kilichokusanyika. Kwa ukubwa wake, baadhi ya wanaume waliona ujasiri usio wa kawaida, na inaripotiwa kwamba mtu alisema kuwa hawawezi kushindwa kwa kukosa namba.",
      "Kilichotokea: Maadui walikuwa wamevizia katika bonde nyembamba la Hunayn. Waislamu waliposhuka katika nusu nuru ya alfajiri, tufani ya mishale iliwashukia kutoka juu na safu ya mbele ikapasuka. Hofu ilitanda na sehemu kubwa ya jeshi kubwa likageuka na kukimbia - idadi ambayo ilileta ujasiri sasa ilichukua mkondo.",
      'Jambo la kugeuka: Katika machafuko hayo Mtume ﷺ hakukimbia. Alisukuma nyumbu wake mbele kuelekea kwa adui, akiita kwa sauti, "Mimi ni Mtume, huu sio uongo; mimi ni mtoto wa Abd al-Muttalib." Kiini cha Muhajirun na Ansari - huku Abbas akiwaita masahaba kwa majina - walikusanyika kumzunguka. Waislamu wakajiunda upya, wakawageukia waviziao, na wakawashinda; mateka na nyara kubwa zilichukuliwa.',
      "Matokeo yake: Kampeni iliendelea kwa kuzingirwa kwa Ta'if, ambayo haikuanguka mara moja. Baadaye, Hawazin walipokuja kuwatafuta watu wao, Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) aliwarudisha mateka—akichagua suluhu na kulainishwa kwa nyoyo juu ya kuhifadhi ngawira, na kwa ukarimu akiwapendelea waongofu wapya wa Makka ili wawafunge kwenye imani.",
      "Qur’ani inaizungumzia siku hii moja kwa moja, ikitaja hatari ya kutegemea idadi: “Na siku ya Hunayn ilipokupendezeni wingi wenu lakini haikukufaeni kitu… ndipo Mwenyezi Mungu akateremsha utulivu wake” (9:25–26). Somo la kudumu ni wazi - usitegemee idadi, utajiri, au mafanikio ya hivi karibuni; ushindi ni zawadi ya Mwenyezi Mungu pekee - na fadhila pacha ya kiongozi kusimama kidete na inayoonekana wakati wafuasi wake wanapopatwa na hofu.",
    ],
    battleDetails: {
      location: "Bonde la Hunayn, kati ya Makka na Ta'if",
      modernLocation: "Karibu na Ta'if, Saudi Arabia",
      hijriDate: "Shawwal 8 AH",
      muslimForces: "~12,000 (pamoja na waongofu wengi wapya wa Makka)",
      opposingForces: "Hawazin na Thaqif",
      muslimCommander: "Mtume Muhammad ﷺ",
      outcome: "Ushindi wa Waislamu baada ya kushindwa kwa mara ya kwanza",
      keyEvents: [
        "Jeshi kubwa zaidi la Waislamu bado lilikuza imani kwa idadi yake kabla ya vita.",
        "Shambulizi la kuvizia la alfajiri kwenye bonde liliwatawanya wale waliotangulia na kusababisha hofu kubwa.",
        "Mtume ﷺ akasimama kidete na akawaita Waumini warudi; msingi ulimzunguka.",
        "Waislamu wakaunda tena na kuwashinda adui; mzingiro wa Ta'if ukafuata.",
        "Mateka hao baadaye walirudishwa kama ishara ya upatanisho.",
      ],
      leadershipLesson:
        "Kiongozi lazima aonekane na kuwa thabiti wafuasi wanapoingiwa na hofu - uwepo hukusanya safu.",
      spiritualLesson:
        "Kamwe usitegemee nambari au mafanikio ya hivi karibuni; Ushindi na utulivu hutoka kwa Mwenyezi Mungu tu.",
    },
    quran: [
      {
        excerpt:
          "Mwenyezi Mungu amekwisha kupeni ushindi katika maeneo mengi, na siku ya Hunayn ilipo kupendezeni wingi wenu, lakini haikukufaeni kitu, na ardhi ilikufungamanisheni kwa ukubwa wake wote, na mkarudi nyuma kwa kurudi nyuma. Kisha Mwenyezi Mungu akateremsha utulivu wake juu ya Mtume wake na juu ya Waumini.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Al-Bara ibn Azib aliulizwa iwapo walikuwa wamekimbia siku ya Hunayn. Akasema: Lakini Mtume wa Mwenyezi Mungu (ﷺ) hakukimbia. Watu wakarudi nyuma, na Mtume (Swalla Allaahu ´alayhi wa sallam) alikuwa juu ya nyumbu wake mweupe, na alikuwa akisema: Mimi ni Mtume, huu si uwongo; Mimi ni mtoto wa Abd al-Muttalib.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Msafara wa Tabuk",
    summary:
      "Rajab 9 AH - maandamano magumu zaidi, katika joto la kiangazi, kujaribu imani bila vita.",
    body: [
      'Muktadha na sababu: Ripoti zilifika Madina za uhamasishaji mkubwa wa Byzantine kwenye mpaka wa kaskazini. Mtume (Swalla Allaahu ´alayhi wa sallam) aliitisha kampeni Tabuk - na, isivyo kawaida, akataja mahali pa kwenda kwa uwazi badala ya kuficha, kwa sababu safari hiyo ingekuwa ndefu na ngumu sana kwamba kila mtu alihitaji kujiandaa kwa uaminifu. Ilianguka katika joto kali la majira ya joto, wakati wa mavuno, wakati usafiri na gharama zilikuwa nzito zaidi - ilijulikana kama "safari ya shida."',
      "Jaribio la dhabihu: Wito uliweka wazi nyoyo za jumuiya. Uthman aliandaa sehemu kubwa ya jeshi kutokana na mali yake mwenyewe; Abu Bakr alitoa kila alichokuwa nacho; Umar alitoa nusu yake. Maswahaba walio maskini zaidi ambao hawakuwa na cha kutoa walilia kwa sababu hawakuweza kushiriki - Qur'ani inaandika machozi yao (9:92). Walisimama wanafiki dhidi yao ambao walizua udhuru wa kubaki nyuma na ambao Sura ya Tawba inawafichua kwa urefu.",
      "Kilichotokea: Jeshi - kubwa zaidi Mtume ﷺ kuwahi kuliongoza, labda 30,000 - lilifika Tabuk baada ya matembezi magumu. Hakuna jeshi la Byzantine lilionekana kupigana. Badala ya matokeo matupu, msafara huo ulipata mikataba na makabila ya mipakani na watawala wa kaskazini, ulipanua usalama wa jumuiya hiyo, na kuonyesha utayarifu ambao wenyewe ulizuia uchokozi.",
      "Wale watatu waliobaki nyuma: Miongoni mwa waliosalia walikuwa ni waumini watatu waaminifu - Ka'b ibn Malik, Hilal ibn Umayyah, na Murarah ibn Rabi' - ambao hawakuwa na udhuru halali na, kwa ukali sana, walikataa kusema uwongo juu yake. Walisusiwa kwa muda wa siku hamsini, ardhi “ikiwa ni kubwa” ikiwa imewafunika, mpaka ikakubaliwa toba yao na Qur’ani ikatangaza msamaha wao (9:118). Uaminifu wao chini ya majaribio ni mojawapo ya matukio ya kusisimua zaidi katika seerah.",
      "Masomo ya kudumu: utayari wa kutetea jumuiya yenyewe ni tendo la imani hata kama hakuna upanga uliotolewa; sadaka bila malipo ya haraka, inayoonekana ni miongoni mwa mitihani ya juu zaidi; na ukweli - kukataa kwa Ka'b kujiokoa kwa uwongo - ni kipenzi zaidi kwa Mwenyezi Mungu kuliko uwongo wa kustarehesha. Surah at-Tawbah inatayarisha msafara mzima kuhusu mada hizi.",
    ],
    battleDetails: {
      location: "Tabuk, kwenye barabara kuelekea mpaka wa Byzantine",
      modernLocation: "Tabuk, Saudi Arabia",
      hijriDate: "Rajab 9 AH",
      muslimForces: "~30,000 (Jeshi kubwa kuliko yote aliloliongoza Mtume ﷺ)",
      opposingForces: "Kikosi cha Byzantine kiliripotiwa lakini hakikutokea kwa vita",
      muslimCommander: "Mtume Muhammad ﷺ",
      weather: "Joto kali la majira ya joto, wakati wa mavuno",
      outcome: "Hakuna vita; mikataba ya kaskazini imefungwa; jamii ilijaribiwa na kupepeta",
      keyEvents: [
        "Mtume (Swalla Allaahu ´alayhi wa sallam) aliitaja sehemu ya mbali kwa uwazi kwa sababu ya ugumu wa safari hiyo.",
        "Uthman, Abu Bakr, Umar, na wengine walitoa kwa ukarimu; maskini walilia kwa kukosa cha kutoa.",
        "Wanafiki walitoa visingizio vya kubaki nyuma na wakafichuliwa katika Sura ya Tawbah.",
        "Hakuna adui kushiriki; mikataba ililindwa na makabila na watawala wa kaskazini.",
        "Waumini watatu wa kweli walisusiwa siku 50 mpaka toba yao ilipokubaliwa (Qur'ani 9:118).",
      ],
      leadershipLesson:
        "Kuwa mwaminifu kuhusu shida na gharama yake; uwazi hujenga uaminifu na kuwatayarisha walio tayari.",
      spiritualLesson:
        "Dhabihu bila thawabu inayoonekana, na ukweli chini ya majaribu, ni kati ya mitihani ya juu zaidi ya imani.",
    },
    quran: [
      {
        excerpt:
          "Walifurahi waliobaki nyuma kwa kubakia kwao nyuma ya Mtume wa Mwenyezi Mungu, na wakachukia kupigana Jihadi kwa mali zao na nafsi zao katika Njia ya Mwenyezi Mungu, na wakasema: Msitoke kwenye joto. Sema: Moto wa Jahannamu ni mkali zaidi laiti wangeli fahamu.",
      },
      {
        excerpt:
          "Na akawasamehe wale watatu walio baki nyuma, mpaka ardhi iliyokuwa na upana wake ikatanda juu yao, na nafsi zao zikaingia juu yao, na wakawa na yakini kuwa hapana pa kukimbilia kwa Mwenyezi Mungu ila kwake Yeye. Kisha akawaelekea kwa rehema ili watubu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ka'b ibn Malik alisimulia jinsi alivyokaa nyuma kutoka Tabuk bila udhuru na hakusema uwongo juu yake; Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) akawaamrisha Waumini wasimsemeshe yeye na maswahaba zake kwa muda wa usiku khamsini, mpaka ardhi ikawa finyu kwao, ndipo ukaja wahyi wa msamaha wao, na ikawa ni miongoni mwa siku za furaha katika maisha yake.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ghazawat na Saraya",
    summary: "Tofauti kati ya kampeni kuu na vikundi vidogo.",
    body: [
      "Ghazwah ni msafara ambao Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) binafsi alishiriki - wanachuoni wanahesabu takriban ishirini na saba, wakiwemo Badr, Uhud, Handaki, Hudaybiyyah, Khaybar, kutekwa kwa Makka, Hunayn, na Tabuk.",
      "Sariyyah (wingi saraya) ni kikosi kilichotumwa chini ya kamanda aliyetajwa bila Mtume (Swalla Allaahu ´alayhi wa sallam) kujiunga - takriban misheni hamsini kama hizo zimerekodiwa, kwa ajili ya uchunguzi, kukabiliana na uvamizi, kusindikiza, au kualika makabila kwenye Uislamu.",
      "Saraya wengi hawakuhusika na mapigano hata kidogo - walikuwa diplomasia, doria, au maonyesho ya nguvu ambayo yalifanya mapigano yasiwe ya lazima. Mengine, kama msafara wa kwenda Muutah, yalihusisha vita vikali na hasara kubwa.",
      "Kuelewa tofauti hii kunalinda dhidi ya kutia chumvi idadi ya 'vita' katika Uislamu wa awali. Katika takriban muongo mmoja, vita halisi vilivyopigwa vilikuwa vichache; maandamano mengi yalikuwa ya kuzuia, ya kidiplomasia, au bila damu, na vyanzo vinapima kipindi chote cha kinabii kuwa nyepesi sana katika kupoteza maisha kwa enzi yake.",
    ],
    actions: [
      "Vinjari rekodi ya matukio ili kuona ni matukio gani yalipigwa vita, ambayo yalikuwa ni kuzingirwa, na ambayo yalikuwa maandamano bila mapigano.",
      "Soma maingizo ya faharasa ya ghazwah na sariyyah ili kuweka kategoria wazi.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Vita baada ya Mtume ﷺ",
    summary: "Shughuli kuu chini ya Makhalifa Waongofu - tofauti na enzi ya unabii.",
    body: [
      "Baada ya Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) mwaka wa 11 Hijiria (632 CE), umma uliongozwa na Makhalifa Abu Bakr, Umar, Uthman, na Ali (radhi za Allah ziwe juu yao) kupitia vita vya Ridda (kuritadi), upanuzi katika Uajemi wa Sasania na Syria ya Byzantine, na hatimaye fitna ya ndani.",
      "Matukio haya ni ya historia ya Kiislamu, lakini si Sunna kwa jinsi matendo ya Mtume mwenyewe yalivyo. Yanapaswa kusomwa kwa zana za historia na kwa ufahamu kwamba wanazuoni wa Kiislamu wenyewe wanajadili maelezo yao, nia, na mafunzo.",
      "Vita vya al-Qadisiyyah (c. 636 CE): Sa'd ibn Abi Waqqas aliongoza vikosi vya Waislamu dhidi ya jeshi la Wasasania huko Iraqi - hatua ya mabadiliko ambayo ilifungua Uajemi.",
      "Mapigano ya Yarmouk (636 CE): makamanda akiwemo Khalid ibn al-Walid walikutana na Wabyzantine huko Syria katika kampeni ya maamuzi ambayo ilimaliza nguvu kuu ya uwanja wa Byzantine katika Levant - iliyosomwa kama historia ya kijeshi, sio kama Sunnah ya kinabii.",
      "Vita vya Nahavand (c. 642 CE): vilikumbukwa katika vyanzo vya Kiarabu kama 'Ushindi wa Ushindi,' vilivunja upinzani uliobaki wa Wasasania. Tarehe na idadi ya askari hutofautiana kati ya wanahistoria.",
    ],
    actions: [
      "Jifunze vita vya kinabii kwanza - ndio rejeleo kuu la maadili na kisheria.",
      "Kukaribia ushindi wa baadaye na nuance; usitukuze vita wala usiibeze historia tata kuwa kauli mbiu.",
    ],
    disclaimer:
      "Hesabu, nia, na tathmini za maadili za ushindi wa baada ya unabii zinajadiliwa kati ya wanahistoria. Muhtasari huu ni wa mwelekeo, sio wa kubishana.",
  },
  {
    title: "Mafunzo ya uongozi",
    summary: "Subira, shura, rehema, na kumtegemea Mwenyezi Mungu - sio mbinu tu.",
    body: [
      "Mfano wa kinabii wa uongozi katika migogoro huweka tabia juu ya werevu. Maamuzi makubwa yalichukuliwa kupitia mashauriano (shura) - visima vya Badr, handaki kwenye mzingiro wa Muungano, masharti ya Hudaybiyyah - hata pale ambapo ufunuo ungethibitisha matokeo baadaye. Uongozi ulisikilizwa kabla haujatenda.",
      'Uvumilivu ulitengeneza safu ya kila ushindi. Amani kali ya Hudaybiyyah ilipelekea, ndani ya miaka miwili, kwenye Kufunguliwa kwa Makka. Rehema pale Makka - "Nenda, uko huru" - iliwashinda watu walewale ambao walikuwa wameutesa umma. Nidhamu chungu iliyofunzwa huko Uhud ilizuia kurudiwa kwa maafa hayo.',
      "Ujasiri ulionyeshwa kwa kiasi kikubwa kutoka kwa upanga kama juu yake: kusimama imara na kuonekana wakati jeshi lilipokimbia Hunayn; kubeba ardhi kwenye mfereji pamoja na wachimbaji; na - ngumu zaidi - kusamehe katika saa ya nguvu kamili wale ambao walikuwa wamekufukuza kutoka nyumbani kwako.",
      "Kumtegemea Allah (tawakkul) hakumaanishi kamwe kupuuza njia. Skauti walitumwa, ardhi ilichaguliwa, silaha zilivaliwa, mitaro ilichimbwa, warithi walitajwa, na mikataba iliheshimiwa. Waumini walifanya kila lililo ndani ya uwezo wao na kisha wakamkabidhi Mwenyezi Mungu matokeo - kwamba muungano wa juhudi kamili na utegemezi kamili ndio moyo wa kielelezo.",
    ],
    actions: [
      "Kabla ya uamuzi mgumu, uliza: je, kweli nimewashauri wale wenye ujuzi?",
      "Baada ya mafanikio, uliza: Je! ninaonyesha huruma, au imegeuka kuwa kiburi?",
      "Kwa kurudi nyuma, uliza: Je, kuna uasi wa kusahihisha, au somo ambalo Mwenyezi Mungu anakusudia mimi kujifunza?",
    ],
    appLinks: [{}],
  },
  {
    title: "Hadiyth sahihi juu ya vita",
    summary:
      "Simulizi zilizochaguliwa zilizo na alama - juu ya tabia, uvumilivu na matukio muhimu.",
    body: [
      "Hadith kuhusu misafara lazima ichunguzwe kwa usahihi kabla ya kutegemewa. Riwaya zilizo hapa chini zimetolewa kutoka katika makusanyo ya Sahih na zinahusu mwenendo na ari ya kampeni hizi; kila moja inabeba daraja lake.",
      "Kwa masimulizi yanayohusiana na uchumba mahususi, angalia mada ya pambano hilo. Tumia kivinjari cha hadith cha Munib kusoma misururu kamili na kuweka alama katika muktadha.",
    ],
    hadith: [
      {
        excerpt:
          "Msitamani kukutana na adui, na muombeni Mwenyezi Mungu salama. Lakini mkikutana nao, subirini, na jueni kwamba Pepo iko chini ya kivuli cha panga.",
      },
      {
        excerpt:
          "Mtume ﷺ amesema: Vita ni hadaa. - Wanazuoni wanaeleza hili kama ruhusa ya mbinu za kivita katika vita (fikra, mshangao, upotofu), kamwe kama leseni ya kuvunja mkataba au kusaliti upande unaolindwa.",
      },
      {
        excerpt:
          "Alipomteua kamanda Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) alimuusia kumcha Mwenyezi Mungu, kuwalingania maadui kwenye Uislamu kabla ya kupigana, asivunje kiapo, kutokeketa, na kutoua mtoto.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Marejeleo na vyanzo",
    summary: "Classical seerah hufanya kazi na jinsi ya kuzisoma kwa umakini.",
    body: [
      "Vyanzo vya msingi vya seerah ni pamoja na Sirah ya Ibn Ishaq (iliyohifadhiwa kupitia Ibn Hisham), Kitabu cha al-Waqidi's Kitab al-Maghazi, Tabaqat cha Ibn Sa'd, na al-Bidayah wan-Nihayah cha Ibn Kathir. Kila moja ina nguvu zake na tahadhari zake za kielimu.",
      "Ibn Ishaq (kupitia Ibn Hisham) ni simulizi ya msingi; al-Waqidi anatoa maelezo mengi ya vita lakini baadhi ya riwaya zake zinapingwa na wakosoaji wa hadithi; Ibn Kathir anaunganisha historia na ukosoaji wa hadith na yuko makini katika kupanga madaraja.",
      "Vifungu vya Kurani juu ya matukio haya ni maandishi yenye mamlaka kuliko yote. Kwa masuala ya mwenendo, sheria, na maadili, Hadith Sahih ya al-Bukhari na Muislamu huchukua nafasi ya kwanza kuliko ripoti zisizothibitishwa za seerah.",
      "Ambapo wanahistoria hutofautiana - juu ya ukubwa kamili wa jeshi, baadhi ya tarehe, na tathmini ya maadili ya kampeni fulani za baada ya unabii - sehemu hii inabainisha kutokuwa na uhakika badala ya kuvumbua usahihi. Kila hadith iliyotajwa hapa iliangaliwa dhidi ya makusanyo kwa idadi na daraja lake.",
    ],
    actions: [
      "Chunguza maelezo yoyote ya vita dhidi ya Qur'ani kwanza, kisha hadith sahih, kisha seerah.",
      "Kwa swali lolote la fatwa au matumizi ya kisasa, wasiliana na wasomi waliohitimu - moduli hii ni ya kielimu, sio uamuzi.",
    ],
    appLinks: [{}, {}],
  },
];

export const BATTLES_VERSES_SW: DeepPartial<BattlesVerse>[] = [
  {
    excerpt:
      "Ruhusa imetolewa kwa wale wanaopigana kwa sababu wamedhulumiwa… Lau Mwenyezi Mungu asingeikagua kundi moja la watu kwa njia ya kundi jingine, nyumba za watawa, makanisa, masinagogi na misikiti ingeharibiwa.",
    context:
      "Ruhusa ya kwanza ya jumla ya kupigana - baada ya miaka ya mateso yasiyo na silaha huko Makka.",
  },
  {
    excerpt:
      "Piganeni katika Njia ya Mwenyezi Mungu wale wanaokupigeni, lakini msiruke mipaka. Hakika Mwenyezi Mungu hawapendi wapotovu.",
    context: "Kikomo cha msingi: ulinzi pekee, na marufuku kali ya kuvuka mipaka.",
  },
  {
    excerpt:
      "Mlipomwomba msaada Mola wenu Mlezi, akajibu: Nitakusaidieni kwa Malaika elfu safu safu.",
    context: "Imefichuliwa kuhusu Badr - msaada wa Mwenyezi Mungu kwa waumini waliozidi idadi.",
  },
  {
    excerpt:
      "Imekwisha kuwako Ishara katika majeshi mawili yaliyo kutana, moja likipigana katika Njia ya Mwenyezi Mungu, na jengine katika makafiri, linawaona mara mbili ya idadi yao kwa macho yao.",
    context:
      "Mwenyezi Mungu aliwafanya Waislamu waonekane wakubwa zaidi kwa adui pale Badr, akiimarisha nyoyo.",
  },
  {
    excerpt:
      "Hakika Mwenyezi Mungu alikutimizieni ahadi yake mlipo kuwa mnawauwa kwa idhini yake, mpaka mkakata tamaa na mkabishana juu ya utaratibu na mkaasi baada ya Yeye kukuonyesheni mnayo yapenda.",
    context: "Inashughulikia uasi wa wapiga mishale na sehemu ya kugeuza Uhud.",
  },
  {
    excerpt:
      "Enyi mlio amini, kumbukeni neema ya Mwenyezi Mungu iliyo juu yenu yalipo kufikieni majeshi na tukayapelekea upepo na majeshi msiyo yaona.",
    context: "Surah al-Ahzab juu ya kuzingirwa kwa Muungano na usaidizi wa kiungu.",
  },
  {
    excerpt:
      "Na akawateremsha wale walio waunga mkono katika Watu wa Kitabu kutoka katika ngome zao, na akatia khofu katika nyoyo zao, kundi mliloliua, na kundi mliloliteka. Na akakurithishani ardhi yao na nyumba zao.",
    context:
      "Surah al-Ahzab juu ya Banu Qurayzah, ambao walivunja agano wakati wa kuzingirwa - kipindi kilichowekwa cha uhaini wa wakati wa vita, sio hukumu dhidi ya imani.",
  },
  {
    excerpt:
      "Hakika Sisi tumekupeni ushindi ulio dhaahiri, ili Mwenyezi Mungu Akughufirie yaliyo kuwa kabla ya dhambi zenu na yatakayofuata, na atimize neema zake juu yenu, na akuongozeni kwenye Njia Iliyo Nyooka.",
    context:
      "Ilifunuliwa wakati wa kurudi kutoka kwa Hudaybiyyah - kutaja kama ushindi wa wazi ambao maswahaba walihisi kwanza kama maelewano machungu.",
  },
  {
    excerpt:
      "Hakika Mwenyezi Mungu amewaridhia Waumini walipo fungamana nawe chini ya mti, na alijua yaliyomo nyoyoni mwao, basi akateremsha utulivu juu yao na akawalipa ushindi wa karibu.",
    context:
      "Ahadi ya Ridwan - masahaba wapatao 1,400 waliahidi chini ya mti wa mshita wasitoroke, na Mwenyezi Mungu akatangaza radhi zake kwao.",
  },
  {
    excerpt:
      "Itakapofika nusura ya Mwenyezi Mungu na ushindi, na ukawaona watu wanaingia katika Dini ya Mwenyezi Mungu kwa wingi, basi mtakase kwa kumsifu Mola wako Mlezi na muombe msamaha. Hakika Yeye ni Mwenye kupokea toba.",
    context:
      "Surah an-Nasr juu ya ufunguzi wa Makka - ushindi uliovikwa taji si la ushindi bali kwa sifa, na kuomba msamaha, na makundi mengi yanayoingia kwenye imani.",
  },
  {
    excerpt:
      "Mwenyezi Mungu amekwisha kupeni ushindi katika maeneo mengi… Kisha Mwenyezi Mungu akateremsha utulivu wake juu ya Mtume wake na juu ya Waumini.",
    context:
      "Mwenyezi Mungu anawakumbusha waumini kwamba ushindi ni zawadi yake, sio matokeo ya kujisifu kwa idadi.",
  },
  {
    excerpt:
      "Walifurahi waliobaki nyuma kwa kubaki kwao nyuma ya Mtume wa Mwenyezi Mungu na hawakupenda kupigana Jihadi kwa mali zao na maisha yao katika Njia ya Mwenyezi Mungu.",
    context:
      "Surah at-Tawbah inawahutubia wale waliojitoa kutoka kwenye maandamano magumu ya Tabuk.",
  },
];

export const BATTLES_TIMELINE_SW: DeepPartial<BattlesTimelineEvent>[] = [
  {
    title: "Ufunuo wa kwanza",
    body: "Mtume (Swalla Allaahu ´alayhi wa sallam) anapokea aya za mwanzo za Surah al-'Alaq kwenye pango la Hira. Kwa miaka simu ni ya amani - hakuna ruhusa ya kupigana.",
    location: "Makka",
  },
  {
    title: "Wito wa umma na mateso",
    body: "Mahubiri ya wazi huleta mateso, kususia, na kuuawa kwa imani. Waislamu huvumilia bila kulipiza kisasi - subira na uhamiaji ndio majibu yanayofundishwa.",
    location: "Makka",
  },
  {
    title: "Hijra hadi Madina",
    body: "Jumuiya ya Kiislamu inaanzisha uungwana huko Yathrib (Madinah). Mikataba na makabila ya Kiyahudi na Katiba ya Madina iliweka kanuni za kuishi pamoja.",
    location: "Madina",
  },
  {
    title: "Vita vya Badr",
    body: "Mnamo tarehe 17 Ramadhani, Waislamu wapatao 313 walishinda jeshi kubwa zaidi la Waquraishi - vita kuu ya kwanza na ushindi wa kimaadili.",
    location: "Badr",
  },
  {
    title: "Vita vya Uhud",
    body: "Waislamu awali kupata msingi, lakini wapiga mishale kuacha nafasi zao husababisha kushindwa chungu. Qur'ani inazungumzia masomo ya siku hiyo.",
    location: "Mlima Uhud",
  },
  {
    title: "Vita vya Trench",
    body: "Jeshi la muungano linauzingira Madina. Kuchimba mtaro - pendekezo la Salman - kunavunja kuzingirwa bila vita kali.",
    location: "Madina",
  },
  {
    title: "Banu Qurayzah",
    body: "Baada ya kuvunja agano la Madina wakati wa kuzingirwa, Banu Quraydhah walijisalimisha na kuomba wahukumiwe na msuluhishi wa hiari yao wenyewe, Sa'd ibn Mu'adh.",
    location: "Madina",
  },
  {
    title: "Mkataba wa Hudaybiyyah",
    body: "Makubaliano ya miaka kumi ambayo yalionekana kuwa maafikiano yakawa, katika maneno ya Qur'ani Tukufu, ushindi wa dhahiri - Ahadi ya Ridwan ilitolewa chini ya mti, uongofu ukaenea, na njia ya kwenda Makka ikafunguka.",
    location: "Hudaybiyyah",
  },
  {
    title: "Vita vya Muutah",
    body: "Safari ya kuelekea mpaka wa Kirumi; makamanda watatu walioteuliwa wanauawa kishahidi kwa mfululizo kabla ya Khalid ibn al-Walid kuliondoa jeshi kwa usalama.",
    location: "Mu'tah",
  },
  {
    title: "Msafara wa Khaybar",
    body: "Ngome za Wayahudi kaskazini mwa Madinah ambazo zilikuwa na uadui zinashindwa. Ali ibn Abi Talib anapewa bendera baada ya Abu Bakr na Umar kujaribiwa.",
    location: "Khaybar",
  },
  {
    title: "Kutekwa kwa Makka",
    body: "Maquraishi huvunja mkataba; Mtume ﷺ anatembea na masahaba elfu kumi na kuingia Makka karibu bila kumwaga damu - msamaha wa jumla umetangazwa.",
    location: "Makka",
  },
  {
    title: "Vita vya Hunayn",
    body: "Hawazin na Thaqif huwavizia Waislamu baada ya Makka. Hofu ya mwanzo inaleta ushindi wakati Mtume ﷺ anawaita waumini kumzunguka.",
    location: "Hunayn",
  },
  {
    title: "Msafara wa Tabuk",
    body: "Maandamano magumu ya kiangazi kuelekea mpaka wa Kirumi. Hakuna vita vinavyotokea, lakini unafiki unafichuliwa na Sura ya Tawbah inazungumza na wale waliobaki nyuma.",
    location: "Tabuk",
  },
  {
    title: "Kwaheri Hija",
    body: "Mtume ﷺ anahiji na kutoa Khutba ya kuaga. Anafariki dunia huko Madina muda mfupi baadaye - zama za vita vya unabii zinaisha.",
    location: "Makka",
  },
];

export const BATTLES_FIGURES_SW: DeepPartial<BattlesFigure>[] = [
  {
    name: "Abu Bakr al-Siddiq",
    epithet: "Mwenyezi Mungu awe radhi naye",
    summary: "Sahaba wa karibu wa Mtume, muumini wa kwanza wa kiume, na sahaba wake kwenye Hijra.",
    role: "Mshauri, mpiganaji, na mshika viwango katika kampeni za mapema.",
    lesson:
      "Uaminifu thabiti na ukweli chini ya shinikizo - alitumia mali yake kuwakomboa Waislamu wanaoteswa kabla ya ushindi wowote.",
  },
  {
    name: "Umar ibn al-Khattab",
    epithet: "Mwenyezi Mungu awe radhi naye",
    summary:
      "Aliingia katika Uislamu katika miaka ya mateso na akawa mmoja wa watetezi hodari wa imani.",
    role: "Mpiganaji na baadaye msanifu wa haki kama Khalifa wa pili.",
    lesson:
      "Ujasiri ulioambatana na uwajibikaji - alikubali ushauri hadharani wakati maoni yake yalipotofautiana na ya Mtume huko Hudaybiyyah.",
  },
  {
    name: "Ali ibn Abi Talib",
    epithet: "Mwenyezi Mungu awe radhi naye",
    summary: "Binamu na mkwe wa Mtume ﷺ; miongoni mwa watoto wa kwanza kuukubali Uislamu.",
    role: "Bingwa katika pambano moja na mbeba bendera huko Khaybar.",
    lesson:
      "Ushujaa kwa unyenyekevu - alilala kwenye kitanda cha Mtume katika usiku wa Hijra, akihatarisha maisha yake ili misheni iweze kuendelea.",
  },
  {
    name: "Hamza ibn Abd al-Muttalib",
    epithet: "Mwenyezi Mungu awe radhi naye",
    summary:
      "Ami yake Mtume, aliyejulikana kwa jina la Asadullah (Simba wa Allah) baada ya kusilimu.",
    role: "Shujaa wasomi na kiongozi mwenye maadili huko Badr na Uhud.",
    lesson:
      "Kuuawa kishahidi sio kushindwa - kifo chake huko Uhud kilimhuzunisha Mtume sana lakini dhamira iliyoimarishwa ya kukamilisha misheni.",
  },
  {
    name: "Khalid ibn al-Walid",
    epithet: "Mwenyezi Mungu awe radhi naye",
    summary:
      "Jenerali mahiri wa Kiquraishi aliyesilimu baada ya Hudaybiyyah na akawa Saifullah (Upanga wa Mwenyezi Mungu).",
    role: "Aliongoza wapanda farasi waliokuwa pembeni dhidi ya Waislamu pale Uhud kabla ya Uislamu wake; baadaye alichukua amri huko Mu'tah na alikuwa na maamuzi katika kampeni za ukhalifa.",
    lesson:
      "Upinzani uliopita hauzuii toba ya kweli - ujuzi uleule uliowapata Waislamu pale Uhud ni, mara imani ilipoingia moyoni mwake, ikaelekezwa kabisa kwenye njia ya Mwenyezi Mungu.",
  },
  {
    name: "Sa'd ibn Abi Waqqas",
    epithet: "Mwenyezi Mungu awe radhi naye",
    summary: "Mmoja wa wale kumi walioahidiwa Pepo; mpiga mishale maarufu wa jamii.",
    role: "Archer huko Uhud; baadaye aliongoza majeshi ya Waislamu huko al-Qadisiyyah chini ya Khalifa Umar.",
    lesson:
      "Nidhamu katika jukumu la mtu - mishale ilifafanua huduma yake; baadaye alibeba usahihi huo katika uongozi wa taifa.",
  },
  {
    name: "Salman al-Farisi",
    epithet: "Mwenyezi Mungu awe radhi naye",
    summary:
      "Mtafutaji kutoka Uajemi ambaye alijiunga na Waislamu Madina baada ya safari ndefu ya kiroho.",
    role: "Imependekezwa kuchimba mtaro - mbinu ya Kiajemi isiyojulikana kwa Waarabu.",
    lesson:
      "Hekima inaweza kutoka kwa msingi wowote - shura ina maana ya utaalamu wa kusikia popote pale ambapo Mwenyezi Mungu anaiweka.",
  },
  {
    name: "Zayd ibn Harithah",
    epithet: "Mwenyezi Mungu awe radhi naye",
    summary:
      "Mtu aliyeachwa huru na sahaba kipenzi cha Mtume, na kamanda wa kwanza aliteua juu ya jeshi la Waislamu.",
    role: "Aliongoza msafara wa Muutah; aliuawa huko kama makamanda wa kwanza wa wale watatu waliotajwa kuanguka.",
    lesson:
      "Sifa juu ya ukoo - alichaguliwa kuongoza wakati watu wa daraja la juu la kabila walikuwepo.",
  },
  {
    name: "Sa'd ibn Mu'adh",
    epithet: "Mwenyezi Mungu awe radhi naye",
    summary:
      "Mkuu wa Aws wa Madina, mmoja wa watu wa mwanzo na wanaoheshimika zaidi kati ya Ansari.",
    role: "Waliojeruhiwa kwenye Mfereji; waliochaguliwa na Banu Qurayzah kama msuluhishi wa hatima yao.",
    lesson:
      "Haki kupitia kwa hakimu aliyekubaliwa - hata adui aliyeshindwa aliruhusiwa kuwa msuluhishi asiyependelea badala ya kulipiza kisasi bila kuzuiwa; alikufa kwa jeraha lake muda mfupi baadaye.",
  },
];

export const BATTLES_LESSON_CARDS_SW: DeepPartial<BattlesLessonCard>[] = [
  {
    battleTitle: "Vita vya Badr",
    lesson: "Mtegemee Mwenyezi Mungu huku ukijiandaa kikamilifu.",
    detail:
      "Wakiwa na idadi ya watu takribani watatu hadi mmoja, Waislamu bado walichagua ardhi yao kwenye visima, wakapanga safu zao, na wakaomba du'a - Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) akimuomba Mwenyezi Mungu usiku kucha mpaka vazi lake likaanguka. Juhudi na kutegemea pamoja, na ushindi ukahesabiwa kwa Mwenyezi Mungu.",
  },
  {
    battleTitle: "Vita vya Uhud",
    lesson: "Utii wa amri hulinda jamii.",
    detail:
      "Wapiga mishale ambao waliacha kazi zao kutafuta nyara walifungua ubavu ambao ulikaribia kuharibu jeshi. Qur'ani inaandika haya kama somo kwa kila kizazi kuhusu nidhamu.",
  },
  {
    battleTitle: "Vita vya Trench",
    lesson: "Kupanga na kushauriana huongeza nguvu.",
    detail:
      "Wazo la handaki la Salman, pamoja na shura ya Mtume na kazi ya waumini, lilipunguza muungano mkubwa zaidi kuliko watetezi.",
  },
  {
    battleTitle: "Mkataba wa Hudaybiyyah",
    lesson: "Uvumilivu unaweza kuwa ushindi wa kweli.",
    detail:
      "Masahaba waliona mapatano hayo kama udhalilishaji, na Umar akaihoji kwa uwazi; Surah al-Fath ikajibu kwa kuuita ushindi wa dhahiri. Amani ya miaka kumi ilifungua njia, Uislamu ulienea kwa kasi zaidi kuliko hapo awali, na ndani ya miaka miwili njia ya kwenda Makka ikawa wazi.",
  },
  {
    battleTitle: "Banu Qurayzah",
    lesson: "Kuvunja agano la ulinzi ni miongoni mwa khiyana kubwa.",
    detail:
      "Banu Qurayzah walilivunja agano la Madina wakati ule Washirika walipouzingira mji huo. Hata hivyo, Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) wahukumiwe kwa msuluhishi waliyemchagua wenyewe - uadilifu kupitia kwa hakimu waliokubaliwa, na sio kisasi kisichozuiliwa.",
  },
  {
    battleTitle: "Kutekwa kwa Makka",
    lesson: "Huruma baada ya ushindi humwinua mshindi.",
    detail:
      "Kwa ule mji uliokuwa ukimtesa na kumfukuza sasa kwa rehema zake, Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) alikariri maneno ya Nabii Yusuf: 'Si lawama juu yako leo - nenda, uko huru.' Msamaha wa jumla ulichukua nafasi ya kulipiza kisasi, na mioyo ilipatikana ambayo hakuna adhabu ambayo ingeshinda.",
  },
  {
    battleTitle: "Vita vya Hunayn",
    lesson: "Nambari na mafanikio ya hivi karibuni hayahakikishi ushindi.",
    detail:
      "Kujivunia ukubwa wa jeshi baada ya Makka kulichangia hofu ya awali. Waumini walikusanyika pale tu waliporejea kwa Mtume ﷺ na kwa Mwenyezi Mungu.",
  },
  {
    battleTitle: "Msafara wa Tabuk",
    lesson: "Sadaka katika hali ngumu hufichua imani ya kweli.",
    detail:
      "Maandamano hayo yalitokea katika joto kali dhidi ya adui mkubwa. Waliotoa mali zao na walioandamana licha ya umaskini walisifiwa sawa.",
  },
  {
    battleTitle: "Vita vya Muutah",
    lesson: "Urithi wa uongozi lazima upangwa.",
    detail:
      "Mtume ﷺ aliwataja makamanda watatu kwa kufuatana. Wakati wote watatu walipoanguka, Khalid alipanga upya mafungo hayo - kuokoa jeshi lenyewe ulikuwa ushindi.",
  },
];

export const BATTLES_GLOSSARY_SW: DeepPartial<BattlesGlossaryTerm>[] = [
  {
    term: "Ghazwah",
    definition:
      "Msafara wa kijeshi ambao Mtume ﷺ mwenyewe alishiriki. Mifano ni pamoja na Badr, Uhud, na Tabuk.",
  },
  {
    term: "Sariyyah",
    definition:
      "Kikosi kilichotumwa chini ya kamanda bila ya Mtume ﷺ kujiunga na maandamano. Kadhaa ilitokea kwa upelelezi, diplomasia, au kukabiliana na uvamizi.",
  },
  {
    term: "Muhajirun",
    definition:
      "Wahajiri waliotoka Makka kwenda Madina kwa ajili ya Mwenyezi Mungu. Waliunda kiini cha jamii ya Waislamu wa mwanzo pamoja na Ansari.",
  },
  {
    term: "Ansari",
    definition:
      "Wasaidizi - Waislamu wa Madina ambao waliwakaribisha Muhajirina, wakagawana mali zao, na wakaulinda mji katika miaka yake ya mwanzo.",
  },
  {
    term: "Shura",
    definition:
      "Kushauriana kabla ya maamuzi makubwa. Mkakati wa mitaro na maandalizi ya Uhud yanaonyesha mashauriano katika mfano wa kinabii.",
  },
  {
    term: "Bay'ah",
    definition:
      "Ahadi ya utii - utii wa kisiasa na kiroho kwa kiongozi. Ahadi za al-Aqabah zilitangulia Hijra.",
  },
  {
    term: "Hijra",
    definition:
      "Kuhama kwa ajili ya Mwenyezi Mungu - kutoka Makka kwenda Madina katika muktadha wa utume. Mwaka wa 1 Hijiria unaanza na uhamaji huu.",
  },
  {
    term: "Ameer",
    definition:
      "Kamanda au kiongozi aliyeteuliwa kwa ajili ya jeshi au msafara. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) aliwateua viongozi wa saraya na akawataja warithi iwapo wataanguka.",
  },
  {
    term: "Rayah",
    definition:
      "Kiwango au bendera iliyobebwa kwenye kichwa cha jeshi. Kubeba bendera ya Mtume ilikuwa ni alama ya heshima na wajibu.",
  },
  {
    term: "Liwa",
    definition:
      "Kiwango kikubwa cha jeshi, wakati mwingine tofauti na rayah ya kibinafsi. Uongozi wa liwa ulionyesha amri juu ya nguvu kubwa.",
  },
  {
    term: "Jihad",
    definition:
      "Kupigana katika njia ya Mwenyezi Mungu - kimsingi mapambano ya nafsi, na katika hali yake ya kijeshi iliyodhibitiwa, ulinzi na uondoaji wa uchokozi unapowekwa.",
  },
  {
    term: "Fi sabilillah",
    definition:
      "Katika njia ya Mwenyezi Mungu - nia inayotofautisha mapambano ya halali kutoka kwa chuki ya kikabila au ushindi wa kidunia.",
  },
  {
    term: "Amani",
    definition:
      "Usalama au mwenendo salama unaotolewa kwa wajumbe, wafanyabiashara, au wasio wapiganaji. Kuvunja aman ni haramu katika sheria ya Kiislamu ya vita.",
  },
  {
    term: "Sulh",
    definition:
      "Makubaliano ya amani au amani. Mkataba wa Hudaybiyyah ni mfano mkuu wa kuchagua amani wakati unatumikia wema mkubwa zaidi.",
  },
  {
    term: "Fath",
    definition:
      "Ufunguzi au ushindi - mara nyingi hutumika kwa ufunguzi wa amani wa Makkah (Fath Makkah) badala ya kuzingirwa kwa nguvu.",
  },
];
