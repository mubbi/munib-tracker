import type { PilgrimageChecklistItem } from "../../types/hajj-guide";
import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// SQ overlay for Hajj & Umrah Learn topics + rite checklists (Albanian, Latin).
// Index-aligned with English sources; only human-readable text is translated.

export const HAJJ_GUIDE_TOPICS_SQ: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Shpërblimi i haxhit të pranuar",
    summary: "Haxhi mabrur fshin mëkatet dhe shpërblimi i tij është Xhenneti.",
    body: [
      "Ebu Hurejre transmeton se Lajmëtari i Allahut ﷺ tha: «Kush kryen haxhin për Allahun dhe nuk bën rafas e as mëkat, kthehet ashtu si ditën kur e lindi nëna e tij» (Sahih el-Buhari 1521; Sahih Muslim 1350).",
      "Ai tha gjithashtu: «Haxhi i pranuar (haxhi mabrur) nuk ka shpërblim tjetër përveç Xhennetit» (Sahih el-Buhari 1773; Sahih Muslim 1349). Pranimi lidhet me sinqeritetin dhe mbajtjen e haxhit pa turp e pa mëkat — jo thjesht me plotësimin e hapave të jashtëm.",
    ],
    hadith: [
      {
        excerpt:
          "Kush kryen haxhin për Allahun dhe nuk bën rafas e as mëkat, kthehet ashtu si ditën kur e lindi nëna e tij.",
      },
      {
        excerpt:
          "Kush kryen haxhin për Allahun dhe nuk bën rafas e as mëkat, kthehet ashtu si ditën kur e lindi nëna e tij.",
      },
      {
        excerpt: "Haxhi i pranuar nuk ka shpërblim tjetër përveç Xhennetit.",
      },
      {
        excerpt: "Haxhi i pranuar nuk ka shpërblim tjetër përveç Xhennetit.",
      },
    ],
    actions: [
      "Intendoje haxhin vetëm për Allahun — ruaje gjuhën dhe karakterin gjatë gjithë udhëtimit.",
      "Përdor listën e haxhit në aplikacion vetëm si kujtesë; mbaje zemrën të fokusuar te pranimi.",
    ],
    appLinks: [
      {
        label: "Lista e riteve të haxhit",
      },
    ],
  },
  {
    title: "Virtuti i umres",
    summary: "Umra deri te umra fshin mëkatet ndërmjet tyre.",
    body: [
      "Ebu Hurejre transmeton se Profeti ﷺ tha: «Kryerja e umres shlyen mëkatet ndërmjet saj dhe asaj të mëparshme, dhe haxhi i pranuar nuk ka shpërblim tjetër përveç Xhennetit» (Sahih el-Buhari 1773; Sahih Muslim 1349).",
      "Umra mund të kryhet në çdo kohë të vitit. Është më e shkurtër se haxhi, por mbetet adhurim i madh: ihram, tavaf, sa'j dhe rruajtje ose shkurtim flokësh.",
    ],
    hadith: [
      {
        excerpt:
          "Kryerja e umres shlyen mëkatet ndërmjet saj dhe asaj të mëparshme, dhe haxhi i pranuar nuk ka shpërblim tjetër përveç Xhennetit.",
      },
      {
        excerpt:
          "Kryerja e umres shlyen mëkatet ndërmjet saj dhe asaj të mëparshme, dhe haxhi i pranuar nuk ka shpërblim tjetër përveç Xhennetit.",
      },
    ],
    actions: ["Hap listën e umres kur të jesh gati të ecësh ritualet me radhë."],
    appLinks: [
      {
        label: "Lista e riteve të umres",
      },
    ],
  },
  {
    title: "Dita e Arafahut",
    summary: "Qëndrimi në Arafah është zemra e haxhit — dhe ditë e madhe e duasë.",
    body: [
      "Abd er-Rahman ibn Ja'mar transmeton se Profeti ﷺ tha: «Haxhi është Arafah» (Sunan Ebu Davud 1949; Xhami' et-Tirmidhi 889). Kush humb qëndrimin brenda kufijve të Arafahut në kohën e saj, ka humbur haxhin e atij viti.",
      "Për ata që nuk janë në haxh, agjërimi në Ditën e Arafahut rekomandohet shumë: Ebu Katade transmeton se agjërimi në Arafah shlyen mëkatet e vitit të kaluar dhe të ardhshëm (Sahih Muslim 1162). Haxhinjtë vetë nuk agjërojnë që ta kushtojnë ditën duasë.",
    ],
    hadith: [
      {
        excerpt: "Haxhi është Arafah.",
      },
      {
        excerpt: "Haxhi është Arafah.",
      },
      {
        excerpt:
          "Agjërimi në Ditën e Arafahut, shpresoj nga Allahu, shlyen mëkatet e vitit para saj dhe të vitit pas saj.",
      },
    ],
  },
  {
    title: "Haxhi — shtyllat e pestë",
    summary: "I detyrueshëm një herë në jetë për çdo musliman të aftë.",
    body: [
      "Allahu thotë: «Dhe u takon njerëzve haxhi i Shtëpisë — atij që arrin të gjejë rrugë drejt saj. Kush mohon — me të vërtetë Allahu nuk ka nevojë për botët» (Kur'ani 3:97).",
      "Thirrja u shpall të gjithë njerëzve: «Shpall u njerëzve haxhin; do të vijnë te ti këmbë dhe mbi çdo deve të hollë; do të vijnë nga çdo shteg i largët» (Kur'ani 22:27).",
      "Ibn Omar transmeton se Profeti ﷺ tha se islami ndërtohet mbi pesë: dëshmi, namaz, zekat, agjërimi i Ramazanit dhe haxhi i Shtëpisë për atë që është i aftë (Sahih el-Buhari 8; Sahih Muslim 16). Ulema bien dakord se është i detyrueshëm një herë në jetë kur plotësohen kushtet; përsëritja është virtut vullnetar.",
    ],
    quran: [
      {
        excerpt:
          "Dhe u takon njerëzve haxhi i Shtëpisë — atij që arrin të gjejë rrugë drejt saj...",
      },
      {
        excerpt: "Shpall u njerëzve haxhin; do të vijnë te ti këmbë dhe mbi çdo deve të hollë...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Islami ndërtohet mbi pesë: dëshmia se nuk ka zot tjetër përveç Allahut dhe se Muhammedi është Lajmëtari i Allahut, kryerja e namazit, dhënia e zekatit, agjërimi i Ramazanit dhe haxhi i Shtëpisë për atë që arrin rrugë drejt saj.",
      },
      {
        excerpt:
          "Islami ndërtohet mbi pesë... dhe haxhi i Shtëpisë për atë që arrin rrugë drejt saj.",
      },
    ],
  },
  {
    title: "Aftësia (istita'ah)",
    summary:
      "Shëndeti, pasuria hallall dhe rruga e sigurt — pa këto haxhi ende nuk është i detyrueshëm.",
    body: [
      "Kushti në Kur'anin 3:97 është aftësia (istita'ah). Ulema klasik e përmbledhin si: shëndet fizik për udhëtimin, pasuri hallall të mjaftueshme për udhëtimin dhe nevojat e të varurve gjatë mungesës, dhe rrugë e sigurt e hapur.",
      "Kush nuk i ka këto mjete këtë vit nuk mëkaton duke e shtyrë derisa të jetë i aftë. Aftësia vlerësohet rast pas rasti — sëmundja, borxhi që duhet shlyer ose udhëtimi i pasigurt mund ta heqin detyrimin e menjëhershëm. Pyet një alim të kualifikuar kur situata të jetë e paqartë.",
    ],
    quran: [
      {
        excerpt: "...atij që arrin të gjejë rrugë drejt saj.",
      },
    ],
    actions: [
      "Shlyej borxhet e detyrueshme dhe rregullo mbajtjen e të varurve para rezervimit.",
      "Verifiko paketat vetëm përmes kanaleve zyrtare (shiko temat e Përgatitjes).",
    ],
  },
  {
    title: "Udhëtimi i gruas për haxh",
    summary:
      "Shumica kërkojnë mahram; disa mendime të mëvonshme lejojnë grup të sigurt e besueshëm.",
    body: [
      "Ibn Abbas transmeton se Profeti ﷺ tha se gruaja nuk duhet të udhëtojë pa mahram, dhe burri nuk duhet të hyjë te ajo pa mahram (Sahih el-Buhari 1862; Sahih Muslim 1341). Shumë ulema e zbatojnë këtë për udhëtimin e haxhit dhe umres.",
      "Disa ulema të mëvonshëm — duke peshuar sigurinë, domosdoshmërinë dhe udhëtimin bashkëkohor — lejojnë gruan të udhëtojë për haxhin e detyrueshëm brenda një grupi të besueshëm kur nuk ka mahram. Kjo mbetet çështje fikh e diskutueshme.",
    ],
    hadith: [
      {
        excerpt:
          "Gruaja nuk duhet të udhëtojë pa mahram, dhe burri nuk duhet të hyjë te ajo pa mahram pranë saj.",
      },
      {
        excerpt:
          "Nuk lejohet gruas që beson në Allahun dhe Ditën e Fundit të udhëtojë një ditë e natë pa mahram.",
      },
    ],
    madhhabNote:
      "Shumica mendon se gruaja ka nevojë për mahram në udhëtimin e haxhit. Disa ulema të mëvonshëm lejojnë udhëtimin në grup të sigurt grash për haxhin e detyrueshëm. Ndiq alimin që i beson dhe rregulloret e autoritetit të haxhit.",
    disclaimer: "Ky është një përmbledhje e përgjithshme, jo fetva personale për rrethanat tuaja.",
  },
  {
    title: "Tri llojet e haxhit",
    summary: "Ifrad, kiran dhe tamattu' — zgjidh para hyrjes në ihram.",
    body: [
      "Ifrad: hyrje në ihram vetëm për haxh, pa umre të veçantë në atë ihram, dhe pa kurban të detyrueshëm për shkak të bashkimit të riteve.",
      "Kiran: bashko umren dhe haxhin në një ihram, mbet në ihram derisa haxhi të përfundojë. Kërkohet kurban (hady).",
      "Tamattu': kryej umre të plotë në muajt e haxhit, dil nga ihrami, pastaj hy përsëri në ihram për haxh më 8 Dhul-Hixhe. Këtë bën shumica e haxhinjve sot; kërkohet gjithashtu hady.",
      "Allahu thotë për ata që bashkojnë ritualet: «...Kush përfiton nga umra për haxh, le të sjellë kurban sa lehtë arrin...» dhe kush nuk mund, agjërojë tri ditë gjatë haxhit dhe shtatë pas kthimit (Kur'ani 2:196).",
    ],
    quran: [
      {
        excerpt:
          "Dhe plotësoni haxhin dhe umren për Allahun... Kush përfiton nga umra për haxh, le të sjellë kurban sa lehtë arrin. Kush nuk gjen — agjërim tri ditë gjatë haxhit dhe shtatë kur ktheheni...",
      },
    ],
    actions: [
      "Vendos llojin me udhëheqësin e grupit para mikat.",
      "Nëse bën tamattu', plotëso umren plotësisht para se të hysh përsëri në ihram për haxh.",
    ],
    appLinks: [
      {
        label: "Lista e umres",
      },
      {
        label: "Lista e haxhit",
      },
    ],
  },
  {
    title: "Pesë mikat",
    summary: "Mos kaloni mikat drejt Mekës pa hyrë në ihram për haxh ose umre.",
    body: [
      "Ibn Abbas transmeton se Profeti ﷺ caktoi mikate për njerëzit: Zul-Hulajfe për Medinen, El-Xhufhe për Sham, Karn el-Manazil për Nejd dhe Jelamlam për Jemen; dhe për Irakun, Dat Irk. Tha se janë për ta dhe për këdo që kalon aty duke synuar haxh ose umre; dhe kush banon brenda këtyre vendeve hyn në ihram nga vendi ku niset, madje edhe banorët e Mekës nga Mekka (Sahih el-Buhari 1524; Sahih Muslim 1181).",
      "Aeroportet dhe portet moderne kanë pika ihrami ose procedura të shpallura — ndiq udhëzimet e transportuesit dhe Ministrisë së Haxhit dhe Umres që të mos kalosh kufirin pa ihram.",
    ],
    hadith: [
      {
        excerpt:
          "Lajmëtari i Allahut ﷺ caktoi Zul-Hulajfe për Medinen, El-Xhufhe për Sham, Karn el-Manazil për Nejd dhe Jelamlam për Jemen... Këto mikate janë për banorët e atyre vendeve dhe për ata që kalojnë aty duke synuar haxh ose umre...",
      },
      {
        excerpt:
          "Lajmëtari i Allahut ﷺ caktoi mikate... Kush banon brenda këtyre kufijve le të hyjë në ihram nga vendi ku niset...",
      },
    ],
  },
  {
    title: "Hyrja në ihram",
    summary: "Ghusl, veshje, nijet dhe telbija fillojnë gjendjen e shenjtë.",
    body: [
      "Ihrami është gjendja e shenjtë ku hyn me nijet për haxh ose umre. Profeti ﷺ inkurajoi ghusl para ihramit. Burrat veshin dy pëlhura të bardha të pashpëtuara; gratë mbajnë veshje të zakonshme modeste pa mbuluar fytyrën ose duart me dorëza si veshje ihrami (detajet e nikabit dhe dorëzave diskutohen në fikh).",
      "Burrat mund të vërin parfum në trup para ihramit, jo në veshjet e ihramit pas hyrjes në gjendje (Sahih el-Buhari 1539). Pastaj formo nijetin dhe fillo telbijen.",
      "Telbija e mësuar nga Profeti ﷺ: «Lebbeyk Allāhumma lebbeyk, lebbeyke lā šerīke leke lebbeyk, inne'l-hamde ve'n-ni'mete leke ve'l-mulke, lā šerīke lek» — vazhdon deri sa të fillojë tavafi i umres, ose deri te guri i Xhemrat el-Akaba për haxh sipas praktikës së njohur (Sahih el-Buhari 1549; Sahih Muslim 1184).",
    ],
    hadith: [
      {
        excerpt:
          "Aisha tha: I vija parfum Lajmëtarit të Allahut ﷺ për ihramin e tij para se të hynte në ihram...",
      },
      {
        excerpt:
          "Lebbeyk Allāhumma lebbeyk, lebbeyke lā šerīke leke lebbeyk, inne'l-hamde ve'n-ni'mete leke ve'l-mulke, lā šerīke lek.",
      },
      {
        excerpt: "Profeti ﷺ ngriti zërin me telbijen: Lebbeyk Allāhumma lebbeyk...",
      },
    ],
    actions: [
      "Paketo të paktën dy grupe ihrami për burrat; mbaj artikuj pa parfum gati.",
      "Praktiko telbijen para udhëtimit që të rrjedhë në rrugë.",
    ],
  },
  {
    title: "Ndalimet e ihramit",
    summary: "Çfarë duhet të shmangë muhrimi deri sa të dalë nga gjendja e shenjtë.",
    body: [
      "Gjatë ihramit shmang: për burrat — veshje të qepura/të përshtatura dhe mbulimin e kokës; parfum; prerjen e flokëve ose thonjve; gjuetinë e kafshëve tokësore; lidhjen ose kryerjen e martesës; dhe intimitetin. Gratë shmangin parfumin dhe ndalimet e tjera të përbashkëta duke mbajtur veshje modeste.",
      "Shkelja e një ndalimi mund të kërkojë fidje — zakonisht agjërim, ushqim të varfërve ose kurban — sipas asaj që bëhet. Medhhebet klasifikojnë detajet ndryshe. Respekto me kujdes ndalimet dhe pyet një udhërrëfyes të kualifikuar nëse ndodh diçka papritur.",
    ],
    madhhabNote:
      "Listat e shkeljeve dhe fidjive ndryshojnë sipas medhhebit. Trajtoje si listë praktike paralajmërimi, pastaj konfirmo detajet me medhhebin ose udhërrëfyesin e haxhit.",
    disclaimer:
      "Ky përmbledhje e përgjithshme nuk zëvendëson udhëzimin në terren kur ndodh një shkelje.",
    actions: [
      "Mbaj parfumin, prerësen e thonjve dhe gërshërët larg arritjes së lehtë gjatë ihramit.",
    ],
  },
  {
    title: "Umra — ihram dhe telbija",
    summary:
      "Hyr në gjendjen e shenjtë në mikat ose para tij, pastaj përgjigju thirrjes së Allahut.",
    body: [
      "Në mikat ose para tij, bë ghusl nëse mundesh, vesh rrobat e ihramit, formo nijetin për umre dhe fillo telbijen. Gjendja e shenjtë fillon me atë nijet.",
      "Përsërit telbijen shpesh ndërsa udhëton drejt Mekës deri sa të fillosh tavafin. Është deklaratë se i përgjigjesh vetëm thirrjes së Allahut.",
    ],
    actions: ["Përdor listën e umres për të shënuar çdo rit kur ta përfundosh."],
    appLinks: [
      {
        label: "Lista e umres",
      },
    ],
  },
  {
    title: "Tavafi i Ka'bes",
    summary: "Shtatë rrethime kundër orës, duke filluar nga Guri i Zi.",
    body: [
      "Rretho Ka'bën shtatë herë kundër orës, duke filluar dhe mbaruar te këndi i Gurit të Zi. Puthe, prek ose trego drejt tij me tekbir nëse ka turm — duke ndjekur praktikën e Profetit ﷺ pa dëmtuar të tjerët.",
      "Burrat bëjnë raml (hap të shpejtë) në tre rrethimet e para dhe idtiba' (zbulim i shpatullës së djathtë) gjatë këtij tavafi ardhjeje për umre, sipas sunnetit të njohur.",
      "Midis këndit Jemenas dhe Gurit të Zi rekomandohet të thuhet: «Zoti ynë, na jep të mirë në këtë botë dhe të mirë në ahiret, dhe na mbro nga dënimi i zjarrit» (Kur'ani 2:201).",
    ],
    quran: [
      {
        excerpt:
          "Zoti ynë, na jep të mirë në këtë botë dhe të mirë në ahiret, dhe na mbro nga dënimi i zjarrit.",
      },
    ],
  },
  {
    title: "Dy rekate dhe Zemzem",
    summary: "Fal pas Makam Ibrahim nëse është e mundur, pastaj pi Zemzem.",
    body: [
      "Pas tavafit falo dy rekate pas Makam Ibrahim nëse ka hapësirë, ose diku tjetër në xhami nëse ka turm — lidhur me fjalët e Allahut: «...Dhe merrni, o besimtarë, nga vendi i Ibrahimit vend lutjeje...» (Kur'ani 2:125).",
      "Pastaj pi ujë Zemzem. Përshkrimi i Xhabirit për haxhin e Profetit ﷺ përfshin pirjen e Zemzemit pas tavafit; Profeti ﷺ tha se Zemzemi është për atë që pihet (raporte autentike të grumbulluara nga ulema të mëvonshëm; nijeti dhe duaja rekomandohen).",
    ],
    quran: [
      {
        excerpt: "...Dhe merrni, o besimtarë, nga vendi i Ibrahimit vend lutjeje...",
      },
    ],
  },
  {
    title: "Sa'j midis Safa dhe Marves",
    summary: "Shtatë kalime në kujtim të kërkimit të Haxherit për ujë.",
    body: [
      "Allahu thotë: «Me të vërtetë, Safa dhe Marva janë midis shenjave të Allahut. Kush bën haxh Shtëpisë ose umre — nuk ka mëkat të ecë midis tyre...» (Kur'ani 2:158).",
      "Ece shtatë herë midis Safa dhe Marves, duke filluar nga Safa. Në Safa kthehu drejt Ka'bes, ngrit duart me tekbir dhe dua si Profeti ﷺ. Burrat vrapojnë midis shenjave të gjelbra.",
    ],
    quran: [
      {
        excerpt:
          "Me të vërtetë, Safa dhe Marva janë midis shenjave të Allahut. Kush bën haxh Shtëpisë ose umre — nuk ka mëkat të ecë midis tyre...",
      },
    ],
  },
  {
    title: "Halq ose taqsir — përfundimi i umres",
    summary: "Burrat rruhen ose shkurtojnë; gratë shkurtojnë sa gisht; pastaj ihrami hiqet.",
    body: [
      "Burrat rruajnë kokën (halq) — për të cilët Profeti ﷺ lut tri herë — ose shkurtojnë në mënyrë të barabartë (taqsir). Gratë mbledhin flokët dhe shkurtojnë afërsisht sa gisht. Me këtë umra përfundon dhe ndalimet e ihramit hiqen.",
      "Abdullah ibn Omar transmeton se Lajmëtari i Allahut ﷺ tha: «O Allah, ki mëshirë për ata që rruajnë kokën.» Thanë: «Edhe për ata që shkurtojnë, o Lajmëtar i Allahut?» Tha: «O Allah, ki mëshirë për ata që rruajnë kokën.» Thanë: «Edhe për ata që shkurtojnë?» Herën e tretë tha: «Edhe për ata që shkurtojnë» (Sahih el-Buhari 1727; Sahih Muslim 1301).",
    ],
    hadith: [
      {
        excerpt:
          "O Allah, ki mëshirë për ata që rruajnë kokën... Dhe (herën e tretë) për ata që shkurtojnë.",
      },
      {
        excerpt:
          "O Allah, fal ata që rruajnë kokën... pastaj herën e tretë: edhe ata që shkurtojnë flokët.",
      },
    ],
  },
  {
    title: "8 Dhul-Hixhe — Dita e Tarvijes",
    summary: "Hyr në ihram për haxh dhe kaloje ditën në Minë.",
    body: [
      "Për haxhinjtë tamattu': formo nijetin për haxh dhe hy përsëri në ihram nga vendbanimi në Mekë, duke rifilluar telbijen. Haxhinjtë ifrad dhe kiran janë tashmë në ihram.",
      "Udhëto në Minë dhe falo Dhuhr, Asr, Magrib, Isha dhe Fajrin e nesërm, secila e shkurtuar në dy rekate në kohën e vet, duke ndjekur praktikën e Profetit ﷺ në Haxhin e Lamtumirës siç transmeton Xhabir (Sahih Muslim 1218). Kaloje ditën dhe natën në adhurim, duke pritur Arafahun.",
    ],
    hadith: [
      {
        excerpt:
          "Transmetimi i gjatë i Xhabirit për Haxhin e Lamtumirës të Profetit ﷺ — duke përfshirë qëndrimin në Minë dhe rendin e riteve.",
      },
    ],
    actions: ["Hap listën e haxhit në mëngjesin e ditës së tetë."],
    appLinks: [
      {
        label: "Lista e haxhit",
      },
    ],
  },
  {
    title: "9 Dhul-Hixhe — Dita e Arafahut",
    summary: "Qëndro brenda Arafahut deri në perëndim; pastaj shko në Muzdelife.",
    body: [
      "Qëndro brenda kufijve të Arafahut nga pas drekës deri në perëndim në dua, zikir dhe pendim. Profeti ﷺ tha: «Haxhi është Arafah» (Sunan Ebu Davud 1949). Kthehu drejt kibles, ngrit duart dhe lutu me zell Allahu — midis kohëve më të mëdha për dua.",
      "Falo Dhuhr dhe Asr së bashku dhe të shkurtuara në kohën e Dhuhr (džem' takdim), pastaj kushto pjesën tjetër të ditës duasë në vend të namazit nafile — duke ndjekur praktikën e Profetit ﷺ (Sahih Muslim 1218).",
      "Pas perëndimit udhëto me qetësi në Muzdelife. Bashko Magrib dhe Isha (Isha e shkurtuar), pusho natën dhe mblidh gurë për gjuajtjen. Të dobëtit dhe gratë mund të largohen për Minë pas mesnatës sipas lehtësive të njohura në sunnet.",
    ],
    hadith: [
      {
        excerpt: "Haxhi është Arafah.",
      },
      {
        excerpt:
          "Profeti ﷺ bashkoi Dhuhr dhe Asr në Arafah, pastaj u nis pas perëndimit drejt Muzdelifes...",
      },
    ],
  },
  {
    title: "10 Dhul-Hixhe — Dita e Nahrit",
    summary: "Gjuajtja, kurbani, rruajtja dhe Tavaf el-Ifade.",
    body: [
      "Kthehu drejt Minës dhe hidh shtatë gurë te Xhemrat el-Akaba (shtylla e madhe), duke thënë Allahu ekber me çdo gur — rituali i parë i ditës në rendin e Haxhit të Lamtumirës.",
      "Sill kurbanin e kërkuar për tamattu' dhe kiran (Kur'ani 2:196), ose rregulloje përmes agjencisë së besueshme. Mishi hahet dhe jepet varfërve.",
      "Rruaj (halq) ose shkurto (taqsir); gratë shkurtojnë sa gisht. Pas gjuajtjes dhe rruajtjes/shkurtimit vjen lirimi i parë (tahallul evvel) — shumica e ndalimeve hiqen përveç intimitetit.",
      "Shko në Mekë për Tavaf el-Ifade — shtylla e haxhit — dhe sa'j për haxhinjtë tamattu' (ifrad/kiran që kanë bërë sa'j me tavafin e ardhjes ndjekin vendimin e medhhebit). Me këtë përfundon lirimi i plotë nga ihrami.",
    ],
    quran: [
      {
        excerpt: "...Kush përfiton nga umra për haxh, le të sjellë kurban sa lehtë arrin...",
      },
    ],
    madhhabNote:
      "Rendi i riteve të Ditës së Nahrit ka fleksibilitet në sunnet; medhhebet ndryshojnë për rendin e saktë dhe kur kërkohet sa'j për çdo lloj haxhi. Ndiq udhërrëfyesin e grupit.",
  },
  {
    title: "11–13 Dhul-Hixhe — Ditët e Taşrikut",
    summary: "Netët në Minë, gjuajtja ditore e tre xhemrave, pastaj tavafi i lamtumirës.",
    body: [
      "Kaloni netët e 11, 12 (dhe 13 nëse nuk ikni herët) në Minë. Këto janë ditë ngrënieje, pijeje dhe kujtimi të Allahut.",
      "Çdo pasdite pas Dhuhr hidh shtatë gurë te secili prej tre shtyllave me radhë — e vogla, pastaj e mesme, pastaj e madhe — me tekbir në çdo gur. Kush nxiton mund të largohet pas gjuajtjes më 12 (Kur'ani 2:203).",
      "Para se të largohesh nga Mekka, kryej Tavaf el-Vada që veprimi i fundit me Shtëpinë të jetë lamtumirë. Ibn Abbas transmeton se njerëzit u urdhëruan që veprimi i fundit të jetë te Shtëpia, por u lehtësoi për gruan menstruuese (Sahih el-Buhari 1755; Sahih Muslim 1328).",
    ],
    quran: [
      {
        excerpt:
          "Dhe kujtoni Allahun në ditë të numëruara. Kush nxiton në dy ditë — nuk ka mëkat; kush vonon — nuk ka mëkat — për atë që druhet nga Allahu...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Njerëzit u urdhëruan të kryejnin tavafin e lamtumirës së Ka'bes si rituali i fundit, përveç grave menstruuese që u falën.",
      },
      {
        excerpt:
          "Njerëzit u urdhëruan që veprimi i fundit të jetë te Shtëpia, por u lehtësoi për gruan në menstruacion.",
      },
    ],
  },
  {
    title: "Shtyllat dhe detyrimet",
    summary: "Çfarë e pavlefsh haxhin nëse humbet, dhe çfarë kompensohet me kurban.",
    body: [
      "Shtyllat (arkan) janë thelbi i haxhit. Nëse humbet një shtyllë, haxhi bëhet i pavlefshëm dhe nuk riparohet vetëm me kurban — duhet plotësuar. Shumica zakonisht rendit: ihram (nijet), qëndrimi në Arafah, Tavaf el-Ifade dhe sa'j.",
      "Detyrimet (vadžibat) përfshijnë hyrjen në ihram nga mikat, qëndrimin në Muzdelife, gjuajtjen e xhemrave, netët e Taşrikut në Minë dhe tavafin e lamtumirës. Humbja e detyrimit nuk e pavlef haxhin, por kompensohet me dam (kurban) sipas medhhebeve.",
    ],
    madhhabNote:
      "Listat e sakta të arkan dhe vadžibat ndryshojnë midis katër medhhebeve. Konfirmo me udhërrëfyes të kualifikuar për medhhebin — veçanërisht nëse humbet diçka nën presion turmi.",
    disclaimer: "Ky është përmbledhje praktike, jo fetva për ritualet e humbura.",
  },
  {
    title: "Etiketa dhe sinqeriteti",
    summary: "Ruaj gjuhën dhe anët — pranimi lidhet me karakterin.",
    body: [
      "Hadithi i kthimit pa mëkat (Buhari 1521; Muslim 1350) tregon qartë se haxhin e prishin turpi (rafas), mëkati (fusuk) dhe debati. Durimi, butësia dhe ndihma për haxhinjtë e tjerë janë pjesë e adhurimit.",
      "Mos lejo që telefoni dhe biseda e kotë të dominojnë Arafahun dhe xhaminë. Lësho vend në tavaf; mos shty drejt Gurit të Zi. Haxhi i pranuar shoqëron Xhennetin — përpiq për karakter të shkëlqyer gjatë gjithë udhëtimit.",
    ],
    hadith: [
      {
        excerpt:
          "Kush kryen haxhin për Allahun dhe nuk bën rafas e as mëkat, kthehet ashtu si ditën kur e lindi nëna e tij.",
      },
    ],
    actions: ["Vendos nijet ditore: një veprim mirësie dhe një dua sinqere mbi turmin."],
  },
  {
    title: "Viza dhe regjistrimi",
    summary: "Përdor kanale zyrtare — Nusuk dhe autoriteti kombëtar i haxhit.",
    body: [
      "Nusuk ( nusuk.sa ) është platforma zyrtare saudite për haxh dhe umre — viza, akomodim, transport dhe paketa të regjistruara. Ndërmjetësit jo zyrtarë janë burim i zakonshëm mashtrimi.",
      "Çdo vend merr kuotë vjetore haxhi; shumica e haxhinjve aplikojnë përmes autoritetit kombëtar të haxhit ose agjentit të licencuar. Umra nuk ka kuotë dhe mund të rregullohet gjatë pjesës më të madhe të vitit përmes kanaleve të miratuara.",
    ],
    actions: [
      "Apliko herët kur hapet sezoni.",
      "Rezervo vetëm përmes agjencive të listuara në Nusuk ose autoritetit kombëtar.",
      "Verifiko kanalet e pagesës para transferimit të parave.",
    ],
    disclaimer: "Rregullat e hyrjes dhe platformat ndryshojnë; verifiko gjithmonë faqet zyrtare.",
  },
  {
    title: "Çfarë të pakosh",
    summary: "Ihram, artikuj pa parfum, dokumente dhe rehati për ecje.",
    body: [
      "Burrat: të paktën dy grupe ihrami të pashpëtuara dhe rrip për dokumente. Gratë: veshje e lirë modeste. Sandale të hapura që vihen lehtë; çantë e vogël dhe shishe uji.",
      "Paketo sapun dhe krem dielli pa parfum — parfumi ndalohet në ihram. Mbaj pasaportën, printimin e vizës, regjistrat e vaksinimit dhe kontaktet e urgjencës në një qese të hollë. Power bank dhe SIM lokale ose eSIM ndihmojnë në turm.",
    ],
    actions: [
      "Listë: ihram ×2, sandale, artikuj pa parfum, qese dokumentesh, medikamente, power bank.",
      "Mbaj fasikla kundër flluskave — haxhinjtë ecin shumë.",
    ],
  },
  {
    title: "Vendet e shenjta me një vështrim",
    summary: "Mekka, Medina, Minë, Arafah dhe Muzdelife — shënime praktike.",
    body: [
      "Masjid el-Haram rrethon Ka'bën — vendi i tavafit dhe sa'j; prit turma të mëdha. Masjid en-Nebavi në Medinë nuk është pjesë e haxhit vetë, por shumica e haxhinjve e vizitojnë; hyrja në Rawdah bëhet me orar përmes aplikacioneve zyrtare.",
      "Minë është qyteti i tendave për netët e 8 dhe 11–13 Dhul-Hixhe. Arafah është fushë e hapur — hidratimi dhe hijezi kanë rëndësi ditën e nëntë. Muzdelife është ku haxhinjtë pushojnë nën qiell të hapur dhe mbledhin gurë — shërbimet janë me qëllim minimale.",
    ],
    actions: ["Studjo një hartë të thjeshtë Minë–Arafah–Muzdelife para udhëtimit."],
  },
  {
    title: "Burime zyrtare",
    summary: "Nusuk, autoriteti kombëtar dhe Visit Saudi.",
    body: [
      "Fillo me Nusuk për viza, paketa, leje Rawdah dhe udhëzime turmi. Përdor ministrinë e haxhit të vendit për kuotë dhe rregulla shëndetësore. Visit Saudi publikon këshilla të përgjithshme hyrjeje dhe udhëtimi.",
      "Nëse oferta duket e pazakonshme e lirë ose ndërmjetësi kërkon pagesë jashtë kanaleve zyrtare, verifiko drejtpërdrejt në portalin e ministrisë para pagesës.",
    ],
    actions: [
      "Ruaj nusuk.sa dhe faqen e autoritetit kombëtar të haxhit.",
      "Ruaj kontaktet e urgjencës nga udhëheqësi i grupit.",
    ],
    disclaimer: "Udhëzues praktik, jo zëvendësues i ofruesit zyrtar të haxhit/umres.",
  },
];

export const HAJJ_CHECKLIST_SQ: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Hyr në ihram për haxh",
    hint: "Intendoje haxhin dhe hy në ihram (nga Mekka për tamattu'); rifillo telbijen.",
    day: "8 Dhul-Hixhe",
  },
  {
    title: "Udhëto në Minë",
    hint: "Falo Dhuhr deri Fajr në Minë, secila e shkurtuar në kohën e vet.",
    location: "Minë",
    day: "8 Dhul-Hixhe",
  },
  {
    title: "Qëndro në Arafah",
    hint: "Qëndro brenda Arafahut nga pas drekës deri në perëndim në dua dhe zikir.",
    location: "Arafah",
    day: "9 Dhul-Hixhe",
  },
  {
    title: "Bashko Dhuhr dhe Asr",
    hint: "Falo Dhuhr dhe Asr së bashku dhe të shkurtuara në kohën e Dhuhr, pastaj fokusohu te dua.",
    location: "Arafah",
    day: "9 Dhul-Hixhe",
  },
  {
    title: "Shko në Muzdelife",
    hint: "Pas perëndimit bashko Magrib dhe Isha, pusho dhe mblidh gurë.",
    location: "Muzdelife",
    day: "9 Dhul-Hixhe",
  },
  {
    title: "Gjuaj Xhemrat el-Akaba",
    hint: "Hidh shtatë gurë te shtylla e madhe me tekbir në çdo gur.",
    location: "Minë",
    day: "10 Dhul-Hixhe",
  },
  {
    title: "Sill kurbanin",
    hint: "I detyrueshëm për tamattu' dhe kiran — ther ose rregullo përmes agjencisë së besueshme.",
    day: "10 Dhul-Hixhe",
  },
  {
    title: "Halq ose taqsir",
    hint: "Burrat rruhen ose shkurtojnë; gratë shkurtojnë sa gisht (lirimi i parë).",
    day: "10 Dhul-Hixhe",
  },
  {
    title: "Tavaf el-Ifade",
    hint: "Kryej Tavaf el-Ifade dhe sa'j për tamattu' — shtylla e haxhit.",
    location: "Masjid el-Haram",
    day: "10 Dhul-Hixhe",
  },
  {
    title: "Kaloni natën në Minë",
    hint: "Kaloni netët e 11, 12 (dhe 13 nëse nuk ikni herët) në Minë.",
    location: "Minë",
    day: "11–13 Dhul-Hixhe",
  },
  {
    title: "Gjuaj tre xhemrat",
    hint: "Pas Dhuhr çdo ditë gjuaj të voglin, mesme, pastaj të madhen — shtatë secilën.",
    location: "Minë",
    day: "11–13 Dhul-Hixhe",
  },
  {
    title: "Tavafi i lamtumirës",
    hint: "Kryej Tavaf el-Vada para largimit nga Mekka (gratë menstruuese të përjashtuara).",
    location: "Masjid el-Haram",
    day: "Largimi",
  },
];

export const UMRAH_CHECKLIST_SQ: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Hyr në ihram",
    hint: "Në mikat ose para: ghusl, veshje ihrami, nijet për umre, telbija.",
    location: "Mikat",
  },
  {
    title: "Recito telbijen",
    hint: "Përsërit Lebbeyk... shpesh deri sa të fillosh tavafin.",
  },
  {
    title: "Tavafi i Ka'bes",
    hint: "Shtatë rrethime kundër orës nga Guri i Zi; burrat: raml dhe idtiba'.",
    location: "Masjid el-Haram",
  },
  {
    title: "Falo dy rekate",
    hint: "Pas Makam Ibrahim nëse është e mundur, pastaj pi Zemzem.",
    location: "Masjid el-Haram",
  },
  {
    title: "Sa'j midis Safa dhe Marves",
    hint: "Shtatë kalime duke filluar nga Safa; burrat vrapojnë midis shenjave të gjelbra.",
    location: "Masjid el-Haram",
  },
  {
    title: "Halq ose taqsir",
    hint: "Burrat rruhen ose shkurtojnë; gratë shkurtojnë sa gisht — umra përfundon.",
  },
];
