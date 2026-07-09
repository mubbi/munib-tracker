// Albanian translation overlay for the Learn Dua content. Mirrors the order of
// its English source in ../learn-dua*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { LearnDuaOccasion, LearnDuaTopic } from "../../types/learn-dua";
import type { DeepPartial } from "./localize";

export const LEARN_DUA_TOPICS_SQ: DeepPartial<LearnDuaTopic>[] = [
  {
    title: "Çfarë është duaja?",
    summary: "Dua është adhurim: thirrja e Allahut drejtpërdrejt, me përulësi dhe shpresë.",
    body: [
      "Dua (دعاء) është thirrja ndaj Allahut - kërkimi i Atij për dobi, falje, udhëzim dhe mbrojtje dhe kthimi tek Ai në nevojë. Larg nga të qenit një vepër më e vogël, Profeti ﷺ deklaroi: 'Duaja është adhurim' dhe më pas recitoi urdhrin e Allahut: 'Më thirrni mua; Unë do t'ju përgjigjem.' Të pyesësh Allahun është në vetvete një vepër e teuhidit të pastër, sepse pranon se vetëm Ai i dëgjon, zotëron dhe kontrollon të gjitha rezultatet.",
      "Ka dy lloje duash që rrjedhin së bashku: dua el-mas'alah, duke kërkuar nga Allahu diçka, dhe dua el-'ibadet, duke e adhuruar Atë përmes lutjes, dhikrit dhe bindjes - sepse çdo akt adhurimi është, në thelb, një kërkesë e heshtur për pranimin dhe shpërblimin e Tij. Kjo është arsyeja pse t'i drejtosh dua dikujt përveç Allahut është një formë shirku: i jep tjetrit atë që i takon vetëm Atij.",
      'Besimtari bën dua në lehtësi dhe vështirësi, me zë dhe në fshehtësi, i sigurt se Allahu dëgjon çdo thirrje dhe nuk e kthen shpinën të sinqertin duarbosh. Ai është aq afër sa thotë: "Unë i përgjigjem thirrjes së thirrësit kur ai më thërret Mua".',
      "Përgjigja merr njërën nga tre format, të mësuara nga Profeti ﷺ: Allahu jep atë që kërkohet; ose Ai e mban atë dhe ruan një shpërblim të barabartë ose më të madh për botën tjetër; ose Ai largon një dëm të barabartë me të. Pra, asnjë dua e sinqertë nuk është kurrë me të vërtetë pa përgjigje - ndonjëherë mëshira më e madhe është në përgjigjen që nuk e shohim.",
    ],
    quran: [
      {
        excerpt: "Dhe Zoti juaj thotë: “Më thirrni Mua; Unë do t'ju përgjigjem.'",
      },
      {
        excerpt:
          "E kur robërit e Mi të pyesin ty për Mua, Unë jam afër. Unë i përgjigjem thirrjes së thirrësit kur ai më thërret Mua.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Duaja është adhurim. - pastaj ai lexoi: \"Dhe Zoti juaj thotë: Më thirrni Mua; Unë do t'ju përgjigjem.' (en-Nu'man ibn Bashir)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Etiketat e duasë",
    summary: "Filloni me lavdërim, dërgoni salavat, kërkoni sinqerisht dhe mos u dorëzoni kurrë.",
    body: [
      "Dua ka një mirësjellje (adab) që Profeti ﷺ e mësoi dhe e modeloi, dhe respektimi i saj e bën pranimin më të mundshëm. Filloni duke e lavdëruar Allahun me emrat e Tij të bukur, pastaj dërgoni salavat (bekime) mbi Profetin ﷺ - ai mësoi se duaja është 'pezulluar' derisa ai që falet t'i bëjë të dyjat - dhe vetëm atëherë paraqitni kërkesën tuaj.",
      "Lutjuni Allahut me tre cilësi të brendshme: përulësi, bindje se Ai mund dhe do të përgjigjet, dhe një mendim i mirë për Të (husn el-zann). Përballuni me kiblen ku të keni mundësi, ngrini duart, zgjidhni kohët e bekuara dhe kërkoni për punët e kësaj jete dhe të botës tjetër. Rekomandohet të përsërisni kërkesat e rëndësishme dhe të përfundoni siç keni filluar - me lavdërime dhe salavat.",
      'Mbi të gjitha, mos u nxitoni. Pejgamberi ﷺ paralajmëroi se një dua i përgjigjet përderisa një person nuk dëshpërohet dhe thotë: "Thirra dhe thirra por nuk u përgjigja" dhe pastaj ta braktisë atë. Këmbëngulja në të kërkuar është vetë adhurim dhe Allahu e do robin që vazhdon të trokasë në derën e Tij.',
    ],
    hadith: [
      {
        excerpt:
          "Duaja e shërbëtorit vazhdon të përgjigjet për sa kohë që ai nuk nxiton - duke thënë: 'Kam bërë dua, por nuk jam përgjigjur.' (Ebu Hurejre)",
      },
      {
        excerpt:
          "Kur dikush prej jush falet, le të fillojë duke lavdëruar dhe madhëruar Zotin e tij, pastaj dërgoni salavate mbi Pejgamberin ﷺ, pastaj kërkoni atë që dëshiron. (Fadalah ibn Ubejd)",
      },
    ],
    actions: [
      "Hape çdo dua me Elhamdulilah dhe salavat mbi Pejgamberin ﷺ.",
      "Kërkoni Allahun me emrat më të përshtatshëm për nevojën tuaj (p.sh. Ya Razzak për furnizim, Ya Ghafur për falje).",
      "Bëjeni duanë një zakon të përditshëm - pas çdo namaz, në suxhud dhe para gjumit.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kushtet për duanë e pranuar",
    summary: "Sinqeriteti, fitimi i ligjshëm dhe largimi nga mëkati hap dyert e përgjigjes.",
    body: [
      "Përtej rregullave të mirësjelljes, disa kushte ndikojnë fuqishëm nëse një dua pranohet. Më e rëndësishmja është ikhlasi - sinqeriteti vetëm ndaj Allahut, pa shfaqje dhe pa thirrje të tjerëve përveç Tij. Një zemër e vërtetë e pranishme në dua vlen më shumë se një gjuhë që reciton mekanikisht.",
      'Ushqimi i ligjshëm është një çelës i fuqishëm. Pejgamberi ﷺ e përshkroi një udhëtar i cili ngre duart drejt qiellit duke thirrur "O Zot, o Zot", por "ushqimi i tij është i ndaluar, pija e tij është e ndaluar, veshja e tij është e ndaluar dhe ai ushqehet nga të paligjshmet - kështu që si mund të përgjigjet?" Ruajtja e të ardhurave, pendimi nga mëkati dhe moskërkimi për asgjë mëkatare apo shkëputja e lidhjeve familjare, të gjitha i heqin barrierat ndërmjet duasë dhe pranimit të saj.',
      "Megjithatë, pranimi është përfundimisht mëshira e Allahut, jo një transaksion që ne kontrollojmë. Prandaj, besimtari bashkon përpjekjet e tij më të mira - sinqeritetin, jetesën hallall, pendimin - me besimin e përulur dhe nuk dëshpërohet kurrë nëse përgjigja vonohet. Dobësia dhe mëkatet e kaluara nuk janë arsye për të ndaluar së kërkuari; ata janë edhe më shumë arsye për t'u kthyer tek i Gjithëmëshirshmi.",
    ],
    hadith: [
      {
        excerpt:
          "…ushqimi i tij është i paligjshëm, pija e tij e paligjshme, veshja e tij e paligjshme, e ushqyer nga i paligjshmi – pra si mund t'i përgjigjet atij? (Ebu Hurejre)",
      },
      {
        excerpt:
          "Duaja e robit i përgjigjet përderisa ai nuk kërkon diçka mëkatare apo shkëputjen e lidhjeve familjare. (Ebu Hurejre)",
      },
    ],
    actions: [
      "Rishikoni të ardhurat dhe shpenzimet tuaja për ligjshmëri - kjo ndikon drejtpërdrejt në duanë tuaj.",
      "Paraprijani lutjeve të gjata me istigfar dhe pendim të sinqertë.",
      "Asnjëherë mos fol një dua për të kërkuar dëm, mëkat ose padrejtësi.",
    ],
  },
  {
    title: "Kohët dhe vendet më të mira për dua",
    summary: "Disa momente janë veçanërisht të bekuara për lutjen e pranuar.",
    body: [
      "Përderisa duaja përgjigjet në çdo kohë, Profeti (a.s.) veçoi disa momente dhe shpreh se kur shpresohet më së shumti pranimi. Ankoroni kërkesat tuaja në këto në vend që të prisni vetëm një krizë.",
      'Ndër më të fortat janë: e treta e fundit e natës, kur Allahu zbret (në një mënyrë që i përshtatet madhërisë së Tij) në qiellin më të ulët dhe thërret: "Kush do të më kërkojë që t\'ia jap?"; sexhdeja në namaz, pozita më e afërt me Allahun; momenti ndërmjet ezanit dhe ikametit; përderisa njeriu është agjërues, sidomos në momentin e prishjes së agjërimit; gjatë shiut; dhe ora e fundit e xhumasë para perëndimit të diellit, në të cilën ka një orë kur nuk refuzohet duaja.',
      "Vendet dhe gjendjet e bekuara përfshijnë qëndrimin në Arafah gjatë haxhit, qëndrimin brenda zonave të shenjta dhe duanë e një udhëtari, një prindi për fëmijën e tyre dhe një të padrejtë. Përdorini këto si spiranca fikse për një jetë të qëndrueshme lutjeje.",
    ],
    hadith: [
      {
        excerpt:
          "Zoti ynë zbret çdo natë në qiellin më të ulët në të tretën e fundit të natës dhe thotë: Kush po më thërret Mua që t'i përgjigjem? Kush po më kërkon që unë t'ia jap? (Ebu Hurejre)",
      },
      {
        excerpt:
          "Robi më i afërt me Zotin e tij është kur është në sexhde, andaj bëni shumë lutje në të. (Ebu Hurejre)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Adkari i mëngjesit dhe i mbrëmjes",
    summary:
      "'Kështjella e përditshme e muslimanëve' — mbrojtje dhe lidhje në të dy skajet e ditës.",
    body: [
      "Adkari i mëngjesit dhe i mbrëmjes janë ndër kujtimet ditore më të theksuara në Sunet - një kështjellë shpirtërore që besimtari ripërtërin në fillim dhe në mbyllje të çdo dite. Allahu i urdhëron besimtarët që të 'përkujtojnë Allahun me shumë përmendje dhe ta madhërojnë Atë në mëngjes dhe në mbrëmje' (33:41-42).",
      "Të recituar vazhdimisht, ata ruhen nga dëmet dhe pëshpëritjet e shejtanit, ripërtërijnë mbështetjen në Allahun (tevakkul) dhe e mbajnë zemrën të lidhur me Të gjatë gjithë rrethanave të ndryshimit të ditës. Dy nga më të rëndësishmet janë më poshtë; koleksioni adhkar i aplikacionit mbart kompletin e plotë.",
    ],
    phrases: [
      {
        title: "Sejid el-Istighfar (shefi i kërkimit të faljes)",
        when: "Një herë çdo mëngjes dhe mbrëmje",
        translation:
          "O Allah, Ti je Zoti im; nuk ka zot përveç Teje. Ti më krijove dhe unë jam robi Yt, dhe unë i përmbahem besëlidhjes dhe premtimit Tënd sa të mundem. Kërkoj strehim tek Ti nga e keqja që kam bërë. Unë e pranoj mirësinë Tënde ndaj meje dhe e rrëfej mëkatin tim, prandaj më fal, sepse askush nuk i fal mëkatet përveç Teje.",
      },
      {
        title: "Hasbijallahu la ilahe illa Huve",
        when: "Shtatë herë çdo mëngjes dhe mbrëmje",
        translation:
          "Allahu më mjafton mua; nuk ka zot përveç Tij. Tek Ai mbështetem dhe Ai është Zoti i Arshit Fuqiplotë.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Pas zgjimit dhe para gjumit",
    summary: "Bëji fjalët e tua të para dhe të fundit të ditës një lidhje me Allahun.",
    body: [
      "Profeti ﷺ mësoi përkujtime specifike për zgjimin dhe për shtrirjen, në mënyrë që fjalët e para të vetëdijshme të një besimtari çdo ditë të jenë mirënjohje, dhe të fundit të jenë dorëzimi. Gjumi, mësoi ai, është një 'vdekje e vogël' dhe zgjimi një ringjallje e vogël - kështu që adkarët e përcaktojnë të gjithë ciklin në vetëdijen për Allahun.",
      "Recitimi i tyre rregullisht ndërton qëndrueshmëri shpirtërore: një rutinë falënderimi gjatë zgjimit dhe për t'ia besuar shpirtin Allahut para gjumit. Para se të flinte, Profeti (a.s.) nxiti veçanërisht leximin e ajetit el-Kursi, duke premtuar se një mbrojtës nga Allahu qëndron me recituesin dhe asnjë shejtan nuk i afrohet deri në mëngjes.",
    ],
    phrases: [
      {
        title: "Dua në zgjim",
        when: "Menjëherë pas zgjimit",
        translation:
          "Falënderimet i takojnë Allahut që na ngjall pasi na bëri të vdesim dhe vetëm Atij i takon ringjallja.",
      },
      {
        title: "Dua para gjumit",
        when: "Kur shtriheni për të fjetur",
        translation: "Në emrin Tënd, o Allah, unë vdes dhe jetoj.",
      },
      {
        title: "Ajet al-Kursi para gjumit",
        when: "Para gjumit",
        translation:
          "Allahu - nuk ka zot tjetër përveç Tij, të Gjallës, Mbajtësit të gjithçkaje. Atë nuk e kapin as përgjumja, as gjumi. E Tij është çdo gjë që gjendet në qiej dhe në tokë. Kush mund të ndërmjetësojë tek Ai përveçse me lejen e Tij? Ai e di atë që ka para tyre dhe pas tyre, dhe ata nuk përfshijnë asgjë nga dituria e Tij, përveç asaj që Ai dëshiron. Arshi i Tij shtrihet mbi qiej dhe në tokë dhe ruajtja e tyre nuk e lodh Atë. Ai është më i Larti, i Madhërishmi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Duat e shtëpisë dhe xhamisë",
    summary: "Mbani përkujtim kur hyni dhe dilni nga shtëpia dhe xhamia juaj.",
    body: [
      'Pejgamberi ﷺ u ka bashkangjitur lutje të shkurtra pragjeve të përditshme të jetës. Përmendja e emrit të Allahut gjatë daljes dhe hyrjes në shtëpi sjell mbrojtje dhe bekim dhe ia mbyll derën shejtanit; ai mësoi se kur një person hyn duke përmendur Allahun, shejtani u thotë shokëve të tij: "Nuk keni ku ta kaloni natën këtu".',
      "Xhamia ka mirësjelljen e vet: hyni me këmbën e djathtë duke kërkuar dyert e mëshirës dhe dilni me të majtën duke kërkuar mirësinë e Allahut - përkujtues se xhamia është një vend i mëshirës, ​​disiplinës dhe përuljes para Allahut.",
    ],
    phrases: [
      {
        title: "Dua kur del nga shtëpia",
        when: "Kur del nga shtëpia",
        translation:
          "Në emër të Allahut; Unë besoj tek Allahu; nuk ka fuqi dhe fuqi përveç Allahut.",
      },
      {
        title: "Dua duke hyrë në xhami",
        when: "Me të hyrë, futet me këmbën e djathtë",
        translation: "O Allah, më hap dyert e mëshirës Tënde.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dua për të ngrënë dhe pirë",
    summary: "Edhkar i shkurtër që sjell berake dhe mirënjohje në çdo vakt.",
    body: [
      "Islami e kthen aktin e zakonshëm të të ngrënit në adhurim përmes përkujtimit. Filloni me 'Bismillah' - që fton bekimin dhe e pengon shejtanin nga ndarja e vaktit - dhe përfundoni me falënderim ndaj Allahut, duke e trajnuar zemrën në mirënjohje dhe vëmendje disa herë në ditë.",
      "Sunneti madje ofron një korrigjim për harresën: nëse harroni të thoni 'Bismilah' në fillim, thoni kur të kujtoni, 'Bismillahi awwalehu ue akhirahu' (Në emër të Allahut, në fillim dhe në fund të tij).",
    ],
    phrases: [
      {
        title: "Para se të hahet",
        when: "Në fillim të një vakti",
        translation: "Në emër të Allahut.",
      },
      {
        title: "Pas ngrënies",
        when: "Në përfundim të një vakti",
        translation:
          "I gjithë lavdërimi i takon Allahut që më ushqeu me këtë dhe më dha pa asnjë fuqi apo fuqi nga ana ime.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Duat rreth abdesit dhe namazit",
    summary: "Lutjet para dhe pas abdesit dhe brenda vetë namazit.",
    body: [
      "Abdesi dhe namazi janë hapjet më të mëdha ditore për përkujtim të pranuar, kështu që Suneti i mbush ato me dua. Përfundimi i abdesit me dëshminë e besimit hap tetë dyert e Xhenetit; dhe brenda namazit - në suxhud dhe pak para selamit të fundit - janë dy nga momentet më të pranuara në ditën e besimtarit.",
      "Mësimi i frazave autentike për këto momente i shndërron lëvizjet rituale në bisedë të vetëdijshme me Allahun.",
    ],
    phrases: [
      {
        title: "Pas abdesit",
        when: "Menjëherë pas përfundimit të abdesit",
        translation:
          "Dëshmoj se nuk ka zot tjetër përveç Allahut të vetëm, pa ortak dhe dëshmoj se Muhamedi është rob dhe i Dërguar i Tij.",
      },
      {
        title: "Para selamit në namaz",
        when: "Në teshehudin e fundit, para përfundimit të namazit",
        translation:
          "O Allah, kërkoj mbrojtje te Ti nga dënimi i Xhehenemit, nga dënimi i varrit, nga sprova e jetës dhe e vdekjes dhe nga e keqja e sprovës së Mesihut të rremë (Dexhallit).",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dua në ezan dhe ikamet",
    summary: "Përgjigjuni thirrjes, kërkoni Allahun për stacionin e Profetit ﷺ, pastaj lutuni.",
    body: [
      "Kur thirret ezani, Suneti duhet të përsëritet pas muadhdinit, pastaj dërgohet salavat mbi Profetin ﷺ, pastaj lexohet duaja duke i kërkuar Allahut t'i japë atij el-Vasilah - Profeti ﷺ i premtoi ndërmjetësimin e tij kujtdo që e bën këtë.",
      "Dritarja ndërmjet ezanit dhe ikametit është një nga kohët e pranuara për lutjen personale; Pejgamberi salAllahu alejhi ue selem tha se duaja e bërë atëherë nuk kthehet prapa, prandaj përdorni atë për të kërkuar nga Allahu për nevojat tuaja.",
    ],
    phrases: [
      {
        title: "Dua pas ezanit",
        when: "Kur mbaron ezani",
        translation:
          "O Allah, Zot i kësaj thirrjeje të përsosur dhe namazit të vendosur, jepi Muhamed el-Vasilah dhe el-Fadilah dhe ngrije atë në pozitën e lavdëruar që i ke premtuar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Duaja e bërë ndërmjet ezanit dhe ikametit nuk refuzohet. (Enes ibn Malik; gjithashtu et-Tirmidhi 212)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ankthi dhe trishtimi",
    summary: "Ankoroni zemrën me tavekul dhe lutjet e vetë Profetit (a.s.).",
    body: [
      "Islami përballet me shqetësimin me mjete praktike shpirtërore: dua, dhikri, lutje dhe besim në caktimin e Allahut. Profeti ﷺ, i cili vetë u përball me pikëllimin dhe vështirësinë, mësoi lutje të sakta për ankth (hamm), pikëllim (hazan) dhe frikë - fjalë që e riorientojnë zemrën nga problemi drejt Atij që e kontrollon atë.",
      "Këto dua nuk zëvendësojnë kërkimin e ndihmës përmes mjeteve të ligjshme, duke përfshirë kujdesin mjekësor ose profesional kur është e nevojshme. Përkundrazi, ata e forcojnë zemrën krahas atyre mjeteve, duke i kujtuar besimtarit se mjaftueshmëria e fundit është vetëm tek Allahu.",
    ],
    phrases: [
      {
        title: "Dua për ankth dhe pikëllim",
        when: "Në ankth, shqetësim ose pikëllim dërrmues",
        translation:
          "O Allah, unë kërkoj mbrojtje te Ti nga ankthi dhe pikëllimi, nga paaftësia dhe dembelizmi, nga koprracia dhe frikacakët, nga barra e borxhit dhe nga të qenit i mbizotëruar nga të tjerët.",
      },
      {
        title: "Allahu na mjafton",
        when: "Kur i frikësuar ose i dërrmuar",
        translation: "Allahu na mjafton dhe Ai është rregulluesi më i mirë i punëve.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sëmundje dhe frikë",
    summary: "Kërkoni shërim nga Allahu duke përdorur mjetet e ligjshme të trajtimit.",
    body: [
      'Suneti i bashkon duatë me trajtim: Profeti (a.s.) mësoi: "Për çdo sëmundje ka shërim" dhe urdhëroi kërkimin e mjekimit, ndërkohë që shëron zemrat dhe trupat me rukje - leximi i Kuranit dhe lutjet autentike mbi të sëmurët. Besimtari i bën të dyja: merr ilaçin dhe kthehet te Shëruesi.',
      "Emri i shkakut të veprimit është i rëndësishëm: Allahu është Shafi, Shëruesi dhe ilaçi është vetëm një mjet që Ai krijoi. Edhe nga frika, zemra i drejtohet Atij për siguri dhe qëndrueshmëri - sepse vetëm Ai jep siguri.",
    ],
    phrases: [
      {
        title: "Dua për shërim",
        when: "Kur sëmuret ose lutet për dikë që është i sëmurë",
        translation:
          "O Allah, Zot i njerëzve, largoje fatkeqësinë dhe jep shërim - Ti je Shëruesi; nuk ka shërim përveç shërimit Tënd - një kurë që nuk lë pas asnjë sëmundje.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Falja dhe udhëzimi",
    summary: "Kërkoni vazhdimisht falje, qëndrueshmëri dhe udhëzim të drejtë.",
    body: [
      "Kërkimi i faljes (istighfar) nuk është i rezervuar për pas mëkateve të mëdha - është një ritëm i përditshëm i besimtarit. Profeti ﷺ, i cili tashmë ishte falur, kërkonte falje nga Allahu më shumë se shtatëdhjetë herë në ditë, duke mësuar se zemra ka nevojë për lustrim të vazhdueshëm.",
      "Udhëzimi, gjithashtu, është një nevojë e vazhdueshme, jo një ngjarje e njëhershme. Edhe besimtarët me vendosmëri e lusin Allahun që t'i mbajë zemrat e tyre të qëndrueshme, sepse zemrat kthehen - dhe Ai që i kthen ato është Allahu. Pejgamberi ﷺ lutej shpesh për një zemër të fortë në fe.",
    ],
    phrases: [
      {
        title: "Pendimi i shpeshtë",
        when: "Në mënyrë të përsëritur, gjatë gjithë ditës",
        translation: "Kërkoj falje nga Allahu dhe i drejtohem Atij me pendim.",
      },
      {
        title: "Dua për zemër të palëkundur",
        when: "Kur keni frikë nga devijimi ose lëkundjet",
        translation: "O rrotullues i zemrave, ma forco zemrën në fenë Tënde.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Duat e udhëtimit dhe shiut",
    summary: "Lutjet për nisje dhe për mëshirën e shiut që bie.",
    body: [
      "Udhëtimi është një gjendje cenueshmërie dhe pranimi i shtuar - Profeti (a.s.) mësoi se duaja e udhëtarit merr përgjigje dhe bëri një lutje për hipjen në një automjet dhe nisjen që njeh fuqinë e Allahut dhe kthimin tonë tek Ai.",
      "Shiu është mëshirë që zbret nga Allahu dhe momenti i rënies së tij është kohë për t'u lutur. Pejgamberi ﷺ e përshëndeste shiun me një dua të shkurtër duke kërkuar që ai të jetë i dobishëm dhe jo shkaktar i dëmit.",
    ],
    phrases: [
      {
        title: "Dua kur niset për të udhëtuar",
        when: "Gjatë montimit të transportit dhe nisjes",
        translation:
          "Lavdi atij që na nënshtroi këtë, kur ne vetë nuk mund ta kishim bërë këtë; dhe me të vërtetë, ne me siguri do të kthehemi te Zoti ynë.",
      },
      {
        title: "Dua kur bie shi",
        when: "Në fillim të reshjeve",
        translation: "O Allah, bëje atë një shi të dobishëm.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sigurimi dhe familja",
    summary: "Kërkoni nga Allahu furnizim të ligjshëm dhe të drejtë në shtëpi.",
    body: [
      "Furnizimi (rizk) është vetëm nga Allahu; besimtari e lidh devenë e tij - duke punuar dhe duke fituar - pastaj i kërkon Furnizuesit furnizim të ligjshëm, berake në atë që fiton, lirim nga borxhi dhe pavarësi nga nevoja për të tjerët. Profeti ﷺ mësoi një dua të bukur që kërkon pikërisht këtë.",
      "Për shtëpinë, vetë Kurani mëson lutjen e të drejtëve: t'u jepen bashkëshorte dhe fëmijë që janë 'ngushëllim për sytë' dhe të udhëheqin një familje të lidhur me besim, lutje dhe mëshirë.",
    ],
    quran: [
      {
        excerpt:
          "Zoti ynë, na dhuro nga bashkëshortet dhe pasardhësit tanë rehati për sytë tanë dhe na bëj prijës të të devotshmëve.",
      },
    ],
    phrases: [
      {
        title: "Dua për dispozitë të ligjshme",
        when: "Mëngjeset, pas namazit dhe në tendosje financiare",
        translation:
          "O Allah, më mjafto me atë që e lejove kundër asaj që e bëre të ndaluar dhe më pasuro me mirësinë Tënde, kështu që nuk kam nevojë për askënd përveç Teje.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Duat Kur'anore",
    summary: "Lutjet e mësuara nga vetë Allahu brenda Kuranit.",
    body: [
      "Duat kuranore janë fjalë që Allahu i vendosi në gjuhët e profetëve dhe besimtarëve, dhe më pas u ruajtën që ne t'i përsërisim - të përmbledhura, gjithëpërfshirëse dhe të pamundura për t'u përmirësuar. Shumë fillojnë me 'Rabbana' (Zoti ynë), dhe ato janë ideale për memorizimin dhe recitimin e vazhdueshëm.",
      "Ndërmjet tyre ato mbulojnë të gjitha nevojat e besimtarit: falje, udhëzim, durim, mëshirë, familje të drejtë, mbrojtje nga zjarri dhe sukses në të dyja botët. Lutja me fjalët e vetë Allahut është ndër format më të sigurta të duasë.",
    ],
    phrases: [
      {
        title: "Mirë në të dyja botët",
        when: "Një dua e përgjithshme, e gjithanshme - më e shpeshta e Profetit ﷺ",
        translation:
          "Zoti ynë, na jep të mira në këtë botë dhe të mira në botën tjetër dhe na ruaj nga dënimi i zjarrit.",
      },
      {
        title: "Qëndrueshmëria në besim",
        when: "Kur keni frikë nga devijimi ose pasi jeni udhëzuar",
        translation:
          "Zoti ynë, mos na devijoni zemrat tona pasi na udhëzove dhe na jep mëshirë nga ana Jote. Vërtet, Ti je Dhuruesi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Duat profetike",
    summary: "Lutjet e mësuara në mënyrë autentike nga Profeti Muhamed ﷺ.",
    body: [
      "Profetit ﷺ iu dha 'fjalimi më gjithëpërfshirës' (xhavami' al-kalim), dhe lutjet e tij e pasqyrojnë atë: të shkurtra në fjalë, të gjera në kuptim dhe të balancuara në mënyrë të përkryer ndërmjet nevojave të kësaj dhe të botës tjetër. Ata kërkojnë udhëzim, pastërti të zemrës, shëndet, falje, mbrojtje dhe karakter të mirë.",
      "Një parim kyç: mbajini duatë autentike, të vërtetuara mirë nga koleksione të besueshme dhe shmangni qarkullimin e atyre të dobëta ose të fabrikuara me shpërblime të shpikura. Thesari i vërtetë i Sunetit është më se i mjaftueshëm.",
    ],
    phrases: [
      {
        title: "Dua gjithëpërfshirëse e të katërve",
        when: "Një lutje e përgjithshme e përditshme",
        translation:
          "O Allah, të kërkoj udhëzim, devotshmëri, dëlirësi dhe mjaftueshmëri të kënaqur.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Dhikri dhe tesbih",
    summary: "Kujtime të shkurtra të peshës dhe shpërblimit të jashtëzakonshëm.",
    body: [
      "Dhikri - përkujtimi i Allahut - përfshin tesbih (SubhanAllah), tahmid (Elhamdulillah), tehlil (La ilahe illallah), tekbir (Allahu Ekber) dhe istighfar. Këto janë ndër fjalët më të lehta në gjuhë, por më të rëndat në peshore, dhe ato janë mbrojtja e zemrës së gjallë kundër pakujdesisë.",
      'Profeti ﷺ përshkroi frazat "të lehta në gjuhë, të rënda në peshore, të dashur për të Mëshirshmin" dhe mësoi se kushdo që thotë "SubhanAllahi ue bihamdih" njëqind herë në ditë, i fshihen mëkatet edhe pse janë si shkuma e detit. I mbajtur pas namazit dhe gjatë gjithë ditës, dhikri e mban gjallë imanin.',
    ],
    phrases: [
      {
        title: "Fjalë të dashura dhe mëkatuese",
        when: "Gjatë gjithë ditës; 100 herë i fshin mëkatet",
        translation: "Lavdia i qoftë All-llahut dhe i gjithë lavdërimi i takon Atij.",
      },
      {
        title: "Dy fjalë të rënda në peshore",
        when: "Në çdo kohë",
        translation:
          "I Lartësuar qoftë Allahu dhe i Tij është falënderimi; lavdia i qoftë Allahut të Madhërishëm.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Salavati mbi Profetin ﷺ",
    summary: "Dërgimi i bekimeve mbi Profetin ﷺ është një burim i përditshëm i mëshirës.",
    body: [
      "Dërgimi i salavateve mbi Pejgamberin ﷺ është urdhëruar nga Allahu në Kuran: “Vërtet, Allahu dhe engjëjt e Tij dërgojnë bekime mbi Profetin; O besimtarë, dërgoni bekime mbi të dhe përshëndetje!” – dhe asnjë dua tjetër nuk ka një kthim të tillë të garantuar: Pejgamberi ﷺ ka thënë se kushdo që i dërgon një bekim, Allahu dërgon dhjetë mbi atë person.",
      "Salavatet e shpeshta sjellin mëshirë, ngre gradat, fshin mëkatet dhe e afron njeriun më të afërt me Pejgamberin ﷺ në Ditën e Gjykimit. Formulari i plotë Ibrahimik më poshtë - ai që ua mësoi shokëve të tij kur ata pyetën se si t'i dërgonin bekime mbi të - lexohet në çdo teshehud të namazit dhe është i shkëlqyer për t'u mbajtur në gjuhë gjatë gjithë ditës.",
    ],
    quran: [
      {
        excerpt:
          "Vërtet, Allahu dhe engjëjt e Tij dërgojnë bekime mbi Pejgamberin. O ju që besuat, dërgoni salavate dhe selame mbi të.",
      },
    ],
    phrases: [
      {
        title: "Salavati i plotë Ibrahimije",
        when: "Në teshehudin e namazit dhe gjatë gjithë ditës",
        translation:
          "O Allah, dërgoje salavate mbi Muhammedin dhe familjen e Muhammedit, ashtu siç e bekove Ibrahimin dhe familjen e Ibrahimit; me të vërtetë Ti je i Lavdëruar, i Lavdishëm. O Allah, jepi mirësi Muhammedit dhe familjes së Muhammedit, ashtu siç e ke favorizuar Ibrahimin dhe familjen e Ibrahimit; me të vërtetë Ti je i Lavdëruar, i Lavdishëm.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Burimet dhe autenticiteti",
    summary: "Jepini përparësi Kuranit dhe hadithit autentik me citime të qarta.",
    body: [
      "Ky modul është edukativ dhe jopartiak, i ndërtuar tërësisht mbi Kuranin dhe hadithet autentike (sahih/hasan) të pranuar gjerësisht, secili me një referencë të gjurmueshme. Standardi i arit për duatë e përditshme është pikërisht ky: tekst i verifikuar me një burim të njohur.",
      "Një kujdes serioz vlen për lutjen: shumë dua qarkullojnë në internet me formulime të shpikura dhe shpërblime të ekzagjeruara ('recitoni këtë dhe të gjitha mëkatet tuaja zhduken'). Hadithi i trilluar është një çështje e rëndë, kështu që verifiko një transmetim të panjohur para se ta përvetësosh apo ta përcjellësh atë.",
      "Për memorizimin dhe praktikën e përditshme, preferoni duatë e shkurtra, autentike që vërtet mund t'i mbani në vend të atyre të gjata që do t'i braktisni - qëndrueshmëria është më e dashur për Allahun sesa vëllimi. Aty ku shkollat ​​ndryshojnë në formulim, mësoni nga një studiues i kualifikuar vendas.",
    ],
    actions: [
      "Verifikoni çdo burim të panjohur të duasë përpara se ta ndani atë.",
      "Zgjidhni disa dua koncize autentike dhe mbajini ato çdo ditë dhe jo shumë që nuk mund t'i mbani.",
      "Përdorni lidhjet e temave të aplikacionit për të çiftuar çdo mësim me praktikën reale.",
    ],
    disclaimer:
      "Përmbajtja edukative nuk zëvendëson këshillat e personalizuara të fikhut. Kërkoni nga studiues të kualifikuar vendime për raste të veçanta.",
    appLinks: [{}, {}, {}, {}],
  },
];

export const LEARN_DUA_OCCASIONS_SQ: DeepPartial<LearnDuaOccasion>[] = [
  {
    title: "adhkar i mëngjesit",
    summary: "Filloni ditën me kujtime",
  },
  {
    title: "Adhkar i mbrëmjes",
    summary: "Mbrojtje para natës",
  },
  {
    title: "Pas zgjimit",
    summary: "Fjalët e para pas zgjimit",
  },
  {
    title: "Para gjumit",
    summary: "Duas dhe adkar për natën",
  },
  {
    title: "Hyrja në shtëpi",
    summary: "Bismilah dhe përshëndetje",
  },
  {
    title: "Duke u larguar nga shtëpia",
    summary: "Tevakkul kur del",
  },
  {
    title: "Xhamia",
    summary: "Hyrja dhe dalja nga xhamia",
  },
  {
    title: "Para dhe pas ushqimit",
    summary: "Mirënjohje gjatë ngrënies",
  },
  {
    title: "Abdesi",
    summary: "Para dhe pas abdesit",
  },
  {
    title: "Lutja",
    summary: "Para, gjatë dhe pas namazit",
  },
  {
    title: "Ankthi dhe shqetësimi",
    summary: "Qetësoje zemrën me dua",
  },
  {
    title: "Sëmundje",
    summary: "Shërim dhe durim",
  },
  {
    title: "falje",
    summary: "Istighfar dhe pendim",
  },
  {
    title: "Udhëtoni",
    summary: "Nisja dhe kthimi",
  },
  {
    title: "Sigurimi",
    summary: "Lutja e Allahut për rizkun hallall",
  },
  {
    title: "Duat Kur'anore",
    summary: "Lutje nga libri i Allahut",
  },
];
