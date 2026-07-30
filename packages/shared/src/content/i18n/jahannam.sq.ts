// Albanian translation overlay for the Learn "Jahannam" content. Mirrors the order of
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

export const JAHANNAM_CORE_TOPICS_SQ: DeepPartial<JahannamTopic>[] = [
  {
    title: "Hyrje",
    summary: "Allahu na informon për Xhehenemin për udhëzim - jo për dëshpërim.",
    body: [
      "Xhehennemi - shpesh i përkthyer si Ferr ose Zjarri - është vendbanimi i ndëshkimit në Ahiret, të cilin Allahu e përshkruan në Kuran dhe nëpërmjet të Dërguarit të Tij ﷺ. Ai na thotë për këtë që të mos e shtypim zemrën me frikë, por që zemrat të zgjohen, të kthehen prapa dhe të zgjedhin rrugën e mëshirës ndërsa dera është ende e hapur.",
      "Ndihmon për të kuptuar pse një Zot i mëshirshëm flet fare për Zjarrin. Një paralajmërim është në vetvete një mëshirë: një personi të cilit i thuhet një shkëmb përpara në errësirë ​​i është dhënë një dhuratë, jo një kërcënim. Çdo ajet rreth Xhehenemit është Allahu, në mirësinë e Tij, që i thërret robërit e Tij para se të kalojë koha e kthimit.",
      "Kjo është arsyeja pse paralajmërimet shoqërohen përgjatë shpalljes me thirrjet për pendim, falje dhe shpresë në mëshirën e madhe të Allahut. Kur'ani rrallë e përmend zjarrin pa përmendur, aty pranë, Xhenetin, derën e hapur të teubes dhe dashurinë e Allahut për ata që kthehen. Qëllimi është përgjegjshmëria që të çon në drejtësi - mos u dëshpëro kurrë.",
      "Besimi në Xhehenem është pjesë e besimit në të padukshmen (el-ghajb), në drejtësinë hyjnore dhe në realitetin e Ditës së Fundit. Ai u jep peshë zgjedhjeve tona dhe balancon shpresën në Parajsë me seriozitetin për mëkatin, kështu që një besimtar ecën mes shpresës dhe frikës - duke shpresuar në mëshirën e Allahut, duke vëzhguar të metat e veta.",
      "Një pikë ngushëllimi në qendër të besimit sunit përshkon gjithë këtë modul: ata që vdesin duke besuar vetëm në Allahun, edhe nëse janë të rënduar nga mëkati, nuk do të mbeten përgjithmonë në zjarr. Me mëshirën e Allahut dhe ndërmjetësimin që Ai lejon, përfundimisht nxirren jashtë besimtarët mëkatarë; mbeten vetëm ata që vdesin duke refuzuar besimin. Pra, studimi i Xhehenemit është, për besimtarin, në fund të fundit një studim se si të arrihet mëshira.",
      "Ky modul paraqet atë që tekstet shprehin qartë, shënon sinqerisht se ku kanë kundërshtuar dijetarët, citon vetëm dëshmi autentike dhe vazhdimisht ju drejton drejt teubes, veprave të mira dhe besimit në Allahun.",
    ],
    quran: [
      {
        excerpt:
          "Kini frikë zjarrin e përgatitur për jobesimtarët - dhe bindjuni Allahut dhe të Dërguarit që të mëshiroheni.",
      },
      {
        excerpt:
          "Thuaj: O robërit e Mi që e keni ngarkuar me shumë gabime veten tuaj, mos e humbni shpresën ndaj mëshirës së Allahut. Vërtet, Allahu i fal të gjitha mëkatet.",
      },
      {
        excerpt:
          "O ju që besuat, pendohuni te Allahu me një pendim të sinqertë, se ndoshta Zoti juaj do t'jua largojë të këqijat dhe do t'ju futë në Xhennete.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Pse Allahu e krijoi Xhehenemin",
    summary: "Drejtësia hyjnore, llogaridhënia dhe pasojat e zgjedhjes së lirë.",
    body: [
      "Xhehenemi ekziston si një manifestim i drejtësisë së përsosur të Allahut ('adl). Një univers në të cilin shtypësi dhe i shtypuri, i sinqerti dhe tradhtari, të gjithë kishin të njëjtin fund, nuk do të ishte i drejtë. Për shkak se Allahu është krejtësisht i Drejti, duhet të ketë një llogari përfundimtare ku çdo gabim të përgjigjet dhe çdo e mirë të nderohet.",
      'Në qendër të kësaj është se Allahu nuk i bën padrejtësi askujt. Çdo shpirt që hyn në zjarr hyn në të me zgjedhjet e veta të vendosura dhe të papenduara – asnjëherë me një dekret arbitrar. Kur\'ani është i theksuar: "Allahu nuk u bën aspak padrejtësi njerëzve, por njerëzit i bëjnë keq vetvetes" (4:40). Askush nuk dënohet për atë që nuk ka bërë, as përtej asaj që meriton.',
      "Qeniet njerëzore nuk u lanë në errësirë. Allahu u dha atyre intelekt, dërgoi pejgamberë dhe shpalli udhëzim të qartë, pastaj i nderoi me liri të vërtetë për ta pranuar ose refuzuar atë: “Kush të dojë, le të besojë; e kush të dojë le të mos besojë” (18:29). Këmbëngulja në refuzimin e së vërtetës, në shtypjen ose në mëkatin e madh pa pendim sjell pasoja në Ahiret, pikërisht sepse zgjedhja ishte me të vërtetë e jotja.",
      "Megjithatë edhe këtu mëshira kornizon drejtësinë. Allahu paralajmëron para se të gjykojë, e vonon llogarinë për t'i dhënë vend kthimit, fal lehtësisht kur të kërkohet dhe e shpërblen një vepër të mirë shumëfish, ndërsa një mëkat të vetëm e shënon si një. Drejtësia e tij nuk është kurrë e ndarë nga mëshira e Tij.",
      "Prandaj, reflektimi mbi arsyen pse ekziston Xhehenemi duhet të rrisë taqwa-në (vetëdijen për Zotin) dhe të thellojë mirënjohjen për çdo ditë të jetës që është ende një shans për t'u penduar. Ajo ka për qëllim ta bëjë zemrën serioze dhe shpresëdhënëse menjëherë - kurrë të mos e paralizojë atë me dëshpërim.",
    ],
    quran: [
      {
        excerpt:
          "Vërtet, Allahu nuk u bën aspak padrejtësi njerëzve, por njerëzit i bëjnë keq vetvetes.",
      },
      {
        excerpt: "Ai nuk pyetet për atë që bën, por ata do të pyeten.",
      },
      {
        excerpt:
          "Kush të dojë le të besojë; e kush të dojë le të mos besojë. Ne kemi përgatitur zjarr për zullumqarët.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Askush prej jush nuk do të hyjë në Xhenet vetëm me veprat e tij. Ata thanë: As ti o i Dërguar i Allahut? Ai tha: As unë, përveç nëse Allahu më mbulon me mëshirën e Tij.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Realiteti i Ahiretit",
    summary: "Nga vdekja në gjykim - çdo fazë është reale dhe e lidhur me akiden.",
    body: [
      "Për të kuptuar me të drejtë Xhahanamin, ndihmon për të parë se ku qëndron ai në udhëtimin më të madh. Islami mëson një sekuencë të qartë pas vdekjes: shpirti largohet nga trupi, pastaj fillon berzahu (jeta e varrit), pastaj Ringjallja kur trupat ngrihen, Mbledhja e të gjithë krijimit, Gjykimi ku shqyrtohen veprat, peshimi i veprave në peshore (el-Mizan), kalimi i çdo shpirti (në fund, kalimi i shpirtit), ose Zjarri - të gjitha me caktimin, drejtësinë dhe mëshirën e Allahut.",
      "Secila prej këtyre fazave është pohuar në akiden e zakonshme sunite në bazë të Kuranit dhe Sunetit autentik. Ky afat kohor nuk është një simbol apo një histori; është një realitet të besohet si pjesë e besimit në Ditën e Fundit dhe mohimi i tij me vetëdije është një çështje besimi, jo thjesht praktikë.",
      "Duke parë të gjithë rrugën gjithashtu riformulon Zjarrin. Është një destinacion i mundshëm në fund të një udhëtimi që çdo shpirt po udhëton tashmë – që do të thotë se zgjedhjet e sotme nuk janë abstrakte. Ata janë hapa përgjatë asaj rruge dhe janë ende tonat për t'i drejtuar.",
      "Njohja e kësaj sekuence e ndihmon besimtarin të përgatitet më tepër se sa të frikësohet: të jetojë me një përkujtim të shëndetshëm të vdekjes (dhikr al-mewt), të riparojë gabimet para se të barten në tubim dhe të mbushë llogarinë e veprave të mira derisa dera e veprimit është ende e hapur. Vdekja e mbyll atë derë; asgjë nuk mund të shtohet pas saj.",
    ],
    quran: [
      {
        excerpt:
          "Pastaj me të vërtetë, pas kësaj ju do të vdisni. Atëherë me të vërtetë do të ringjalleni në Ditën e Kijametit.",
      },
      {
        excerpt:
          "Sa i përket atij që peshon i rëndë - ai do të jetë në një jetë të këndshme. Për sa i përket atij, peshoret e të cilit janë të lehta - streha e tij do të jetë një humnerë.",
      },
    ],
    actions: [
      "Studioni çdo fazë në Mësoni Akide dhe lidhni besimin me zgjedhjet e përditshme.",
      "Shtoje përkujtimin e vdekjes (dhikr al-mewt) pa e lënë pas dore shpresën në mëshirë.",
    ],
    appLinks: [{}, {}, {}, {}, {}, {}],
  },
  {
    title: "Emrat e Ferrit",
    summary:
      "Emrat kuranorë me kuptime - studiuesit ndryshojnë nëse secili është një nivel i veçantë.",
    body: [
      "Kurani i referohet Ferrit me disa emra, dhe kjo nuk është thjesht përsëritje. Në arabisht, një emër shpesh mbart një përshkrim të gjallë brenda tij, kështu që çdo emër mëson diçka për realitetin që tregon. Midis tyre janë Xhehenem, Xhehim, Sakar, Sa'ir, el-Hutamah, el-Hawiyah dhe Lazaa.",
      "Çdo emër hap një dritare në një aspekt të ndryshëm të ashpërsisë. Xhehemi dhe Sa'iri ngjallin një zjarr të zjarrtë të ndezur; Saqar, ajo që përvëlon dhe nuk lë asgjë; el-Hutamah, dërrmuesi që thyen çdo gjë që hidhet në të; al-Hawiyah, një humnerë e thellë në të cilën bie; dhe Lazaa, një flakë e pastër, zhveshëse. Leximi i emrave së bashku krijon një pamje të matur që zemra nuk mund ta injorojë lehtë.",
      "Studiuesit klasikë të tefsirit - si Ibn Kethiri dhe al-Tabari - i shpjegojnë këta emra nga rrënjët e tyre arabe dhe diskutojnë secilin në kontekstin e ajetit ku shfaqet, në vend që t'i trajtojnë si një listë teknike fikse.",
      "Këtu ia vlen një fjalë kujdes. Disa shkrimtarë të mëvonshëm e paraqesin çdo emër si një 'nivel' të veçantë, të renditur të Ferrit, ndonjëherë me diagrame të detajuara. Ky është një interpretim dijetar, jo një listë kontrolli e qartë e deklaruar në Kuran ose në hadithin e rënë dakord. Qasja e ekuilibruar është të mësosh kuptimet që tekstet në të vërtetë japin dhe të shmangësh paraqitjen e hartave spekulative si siguri.",
      "Qëllimi i të mësuarit të emrave nuk është të kënaqë kureshtjen, por të zbutë zemrën dhe ta çojë atë drejt mëshirës që vazhdon të tregojë ky modul. Shfletoni koleksionin e plotë të emrave për ndodhinë Kur'anore, kontekstin dhe përmbledhjen e tefsirit të secilit emër.",
    ],
    quran: [
      {
        excerpt: "Mjaft është Ferri si një vend pushimi - Xhehenem.",
      },
      {
        excerpt: "Ai do të hidhet në el-Hutamah - Zjarri dërrmues.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Nivelet e Ferrit",
    summary:
      "Shkalla të ndryshme ndëshkimi - struktura e saktë nuk është plotësisht e detajuar në tekste.",
    body: [
      'Një parim që Kurani thotë qartë është se ndëshkimi është proporcional: jo të gjithë në Zjarr e përjetojnë atë në të njëjtën masë. "Për të gjithë do të ketë shkallë sipas asaj që bënë" (6:132). Kjo është në vetvete një shprehje e drejtësisë - ai që ka bërë pak keq nuk trajtohet si ai që ka bërë shumë keq.',
      "Suneti autentik ilustron të njëjtin parim. Pejgamberi ﷺ e përshkroi personin më pak të ndëshkuar të zjarrit si atë nën këmbët e të cilit janë vendosur dy prush, prej të cilit i zien truri - dhe megjithatë ai është më i lehtë në vuajtje nga të gjithë njerëzit e tij (Sahih el-Bukhari 6562). Nëse kjo është më e pakta, mendja kupton se sa të rënda duhet të jenë gradat më të larta dhe sa arsye ka për t'u kthyer prapa sot.",
      "Në të njëjtën kohë, shpallja nuk u jep besimtarëve një hartë të plotë dhe të numëruar të strukturës së Ferrit, të cilën ata janë të detyruar ta mbajnë mend përmendësh. Studiuesit kanë diskutuar nivelet, thellësitë dhe kategoritë e nxjerra nga vargje dhe raporte të ndryshme, por shumica e kësaj mbetet interpretim dhe jo tekst i qartë dhe i rënë dakord.",
      "Dy gjëra, megjithatë, janë të sigurta. Së pari, shtypja (dhulm), shirku dhe mëkati i madh i vazhdueshëm pa pendim mbartin një paralajmërim të ashpër. Së dyti – dhe nuk duhet harruar kurrë – që mëshira dhe falja e Allahut mbeten të hapura deri në momentin e vdekjes për këdo që kthehet tek Ai sinqerisht. Qëllimi i të mësuarit për gradë është të zgjedhësh rrugën më të lehtë ndërsa zgjedhja mbetet.",
      "Praktikisht, kjo do të thotë t'i trajtosh listat e hollësishme të 'shtatë niveleve' ose skemave të ngjashme si opinione dijetare dhe jo si doktrinë të vendosur, dhe të mbash vëmendjen mbi atë që mbron në të vërtetë: besimin, pendimin dhe veprat e drejta.",
    ],
    quran: [
      {
        excerpt: "Për të gjithë do të ketë gradë sipas asaj që ata bënë.",
      },
      {
        excerpt:
          "Vërtet, hipokritët do të jenë në thellësinë më të ulët të zjarrit dhe nuk do t'u gjesh kurrë ndihmës.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Më pak i dënuari prej banorëve të zjarrit do të jetë njeriu nën këmbët e të cilit janë vendosur dy prush, prej të cilave i zien truri.",
      },
    ],
    disclaimer:
      "Diagramet e niveleve të Ferrit të gjetura në disa libra pasqyrojnë interpretimin e studiuesve, jo marrëveshje unanime.",
  },
  {
    title: "Portat e Ferrit",
    summary: "Shtatë porta - çfarë thotë Kurani dhe ku ndryshon interpretimi.",
    body: [
      "Një detaj rreth Xhehenemit thuhet qartë dhe pa mëdyshje në Kur'an: 'Vërtet, Xhehenemi ka shtatë dyer; sepse çdo portë është një pjesë e caktuar prej tyre' (15:44). Prandaj, besimi në shtatë portat mbështetet në zbulimin e qartë, jo në spekulime.",
      "Ajeti pohon dy gjëra: se janë shtatë porta dhe se ata që hyjnë janë të ndarë mes tyre. Dijetarët klasikë të tefsirit diskutojnë se çfarë nënkupton ndarja – nëse tregon kategoritë e njerëzve, shkallët e ndëshkimit që përputhen me veprat, apo të dyja. Urtësia pas ndarjes i përket Allahut, drejtësia e të cilit e vendos çdo shpirt pikërisht aty ku i takon.",
      "Është e rëndësishme të theksohet se ku përfundon siguria. Disa vepra të mëvonshme caktojnë çdo portë specifike për një mëkat ose grup të veçantë. Këto detyra të veçanta nuk janë përcaktuar në mënyrë uniforme në burimet më të hershme, kështu që ato paraqiten më mirë si pikëpamje të studiuesve individualë dhe jo si specifikime profetike.",
      "Ashtu si me nivelet, mësimi i portave nuk është arkitektonik, por moral: ka shumë dyer që të çojnë drejt zjarrit dhe mënyra për të qenë të sigurt nga të gjitha ato është e njëjta - besimi i sinqertë, shmangia e mëkatit të madh dhe pendimi i shpejtë kur dikush rrëshqet.",
    ],
    quran: [
      {
        excerpt:
          "Dhe me të vërtetë, Xhehenemi është vendi i premtuar për të gjithë ata. Ka shtatë porta; për çdo portë është caktuar një pjesë.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Përshkrimet e Xhehenemit",
    summary:
      "Zjarri, nxehtësia, zinxhirët, keqardhja - të paraqitura me nderim, jo ​​sensacionalizëm.",
    body: [
      "Kurani dhe Suneti autentik e përshkruajnë Xhehenemin me një gjuhë të gjallë e konkrete, dhe ata e bëjnë këtë për një arsye: zemra e njeriut preket më shumë nga imazhet që mund t'i paraqesë sesa nga idetë abstrakte. Përshkrimet - zjarri i fortë, nxehtësia e padurueshme, ushqimi dhe pijet e kufizuara, zinxhirët, errësira dhe keqardhja e thellë - kanë për qëllim ta bëjnë rrezikun mjaft real për të na larguar prej tij.",
      "Ndër përshkrimet janë uji i vluar që jepet për të pirë, pema e hidhur e zekumit si ushqim, rrobat e prera nga zjarri dhe ndarja nga çdo rehati ku njeriu dikur mbështetej. Profeti ﷺ përcolli se sa larg kjo nxehtësi tejkalon çdo gjë që dimë, duke thënë se zjarri që ne ndezim në këtë botë është vetëm një pjesë e shtatëdhjetë pjesëve të Zjarrit të Ahiretit (Sahih el-Bukhari 3265).",
      "Këto përshkrime janë paralajmërime reale, jo thjesht metafora që e zbrazin Ahiretin nga pasojat. Dijetarët sunitë pohojnë realitetin e tyre duke ia lënë dijes së Allahut modalitetin e saktë të së padukshmes; Detyra e besimtarit është të marrë në zemër paralajmërimin, jo ta zbërthejë atë.",
      "Ka një etiketë (adab) për të lexuar pasazhe të tilla. Atyre u afrohet me përulësi, frikë ndaj Allahut dhe me një shtysë të menjëhershme për t'u penduar dhe për të kërkuar strehim - jo me magjepsje morbide dhe kurrë me dëshpërim, pasi i gjithë qëllimi i paralajmërimit është se ne kemi ende kohë për ta shmangur atë.",
      "Ndoshta tema më e rëndë në këto përshkrime është keqardhja. \"Sikur të kisha...\" do të thuhet kur koha për veprim është mbyllur tashmë. Mëshira për të dëgjuar për atë keqardhje tani është se ne mund të veprojmë sipas 'nëse vetëm' sot, ndërkohë që ajo ende mund të ndryshojë fundin tonë.",
    ],
    quran: [
      {
        excerpt:
          "Para tij është Xhehennemi dhe do t'i jepet për të pirë ujë të ndyrë. Ai do ta gëlltisë, por mezi do ta gëlltisë.",
      },
      {
        excerpt:
          "Atyre do t'u priten rrobat e zjarrit dhe mbi kokat e tyre do të derdhet ujë i valë.",
      },
      {
        excerpt:
          "Atë ditë do të lindë Xhehennemi, atë ditë njeriu do të kujtojë, por çfarë dobie ka ai përkujtimi?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Zjarri juaj është një pjesë e shtatëdhjetë pjesëve të zjarrit të Xhehenemit. U tha: O i Dërguari i Allahut, do të mjaftonte ky zjarr. Ai tha: I është dhënë fuqia prej gjashtëdhjetë e nëntë pjesësh më shumë se ajo, secila pjesë është si nxehtësia e saj.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Kush është paralajmëruar?",
    summary: "Kategoritë në Kur'an dhe Sunet - jo gjykime për individët.",
    body: [
      "Një lexues i kujdesshëm i Kur'anit vëren se paralajmërimet e tij kanë për qëllim sjelljet dhe qëndrimet, jo individët me emër. Ai i paralajmëron ata që këmbëngulin në mosbesim pasi u është bërë e qartë e vërteta, hipokritët që dëshmojnë besimin nga jashtë ndërsa e refuzojnë atë përbrenda, shtypësit që shkelin të drejtat e të tjerëve, arrogantët që janë tepër krenarë për t'u nënshtruar dhe ata që vdesin për mëkatin e madh pa u penduar kurrë.",
      "Ky fokus në kategori dhe jo në persona është i qëllimshëm dhe i mëshirshëm. Një derë kthimi qëndron e hapur për çdo njeri të gjallë, cilado qoftë e kaluara e tyre, sepse dosja e askujt nuk është e mbyllur deri në vdekje. Paralajmërimi përshkruan rrugën, në mënyrë që kushdo që ende ecën atë të mund të largohet.",
      "Për këtë arsye, Islami nuk na lejon të deklarojmë fatin përfundimtar të ndonjë individi të caktuar - të themi 'ky person është në Zjarr' - përveç në rastet e rralla kur Allahu ose i Dërguari i Tij ﷺ e kanë thënë shprehimisht në shpallje autentike. Gjykimi i zemrave dhe i përfundimeve i takon vetëm Allahut; detyra jonë është llogaria jonë.",
      "Pra, mënyra e duhur për të lexuar çdo paralajmërim është ta ktheni atë nga brenda: jo 'kë e përshkruan kjo?' por 'a më përshkruan ndonjë nga këto dhe çfarë do të ndryshoj sot?' Kushdo që të jeni, ftesa për t'u kthyer tek Allahu është e hapur tani – dhe e nesërmja nuk i është premtuar askujt.",
    ],
    quran: [
      {
        excerpt: "Munafikët do të jenë në thellësinë më të ulët të zjarrit.",
      },
      {
        excerpt:
          "Kush bën mëkat dhe përfshihet prej tij, ata janë banues të zjarrit, të cilët do të jenë përgjithmonë.",
      },
      {
        excerpt:
          "Mos mendo se Allahu është i pavetëdijshëm për atë që bëjnë zullumqarët. Ai i vonon ato vetëm për një ditë kur sytë do të shikojnë.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Mëkatet e mëdha",
    summary: "Kabair - mëkate të rënda që kërkojnë teube të sinqertë.",
    body: [
      "Dijetarët i ndajnë mëkatet në dy kategori dhe të kuptuarit e dallimit sjell seriozitet dhe lehtësim. Mëkatet e mëdha (el-keba'ir) janë ato që Allahu ose i Dërguari i Tij ﷺ u ka bashkangjitur një pasojë të rëndë specifike - kërcënimi i zjarrit, mallkimi, zemërimi i Allahut ose dënimi i caktuar - si shirku, vrasja dhe konsumimi i kamatës. Mëkatet e vogla (el-sagha'ir) janë rrëshqitjet më të vogla që nuk arrijnë atë prag.",
      'Lehtësimi qëndron në mënyrën se si lidhen të dyja. Allahu premton se nëse një besimtar u shmanget mëkateve të mëdha, ato të voglat fshihen me ibadete të zakonshme: "Nëse u shmangeni mëkateve të mëdha, ju jeni të ndaluara, Ne do t\'jua heqim mëkatet tuaja më të vogla" (4:31). Namazi në namaz, xhuma në xhuma dhe Ramazani në Ramazan e shlyejnë atë që gjendet mes tyre, përderisa mëkatet e mëdha shmangen.',
      "Kjo është arsyeja pse mëkatet e mëdha meritojnë vëmendje të përqendruar: ato janë ato që jo thjesht lahen në rrjedhën e adhurimit të përditshëm, por bëjnë thirrje për pendim të qëllimshëm dhe të sinqertë (teube). Këmbëngulën pa u kthyer prapa, rrezikojnë shpirtin; të braktisur dhe të penduar nga, ata janë të falur.",
      "Dhe këtu është horizonti mbi të gjitha: me përjashtim të vetëm të vdekjes në shirk, çdo mëkat - i madh apo i vogël - bie nën faljen e Allahut nëse Ai dëshiron. “Vërtet, Allahu nuk ia fal shoqërinë Atij, por më pak se kaq ia fal kujt të dojë” (4:48). Asnjë besimtar nuk duhet të arrijë kurrë në përfundimin se mëkatet e tyre të mëdha i vendosin ata përtej mëshirës.",
      "Çdo temë e mëkatit madhor në këtë modul jep përkufizimin e saj, dëshminë e saj, pse është e rëndë dhe rrugën konkrete të pendimit dhe shmangies – duke përfunduar gjithmonë në të njëjtën derë të hapur.",
    ],
    quran: [
      {
        excerpt:
          "Nëse u shmangeni mëkateve të mëdha që ju janë të ndaluara, Ne do t'ju heqim mëkatet tuaja më të vogla dhe do t'ju fusim në një hyrje fisnike.",
      },
      {
        excerpt: "Vërtet, Allahu nuk ia fal shoqërinë Atij, por më pak se kaq ia fal kujt të dojë.",
      },
      {
        excerpt:
          "Ata që u shmangen gjynaheve të mëdha dhe imoraliteteve, vetëm se ato të lehtat, me të vërtetë, Zoti yt është fals i madh.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mëkatet më të mëdha janë: bërja shok Allahut, vrasja e shpirtit, mosbindja ndaj prindërve dhe dhënia e dëshmisë së rreme.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Mëkatet e gjuhës",
    summary:
      "Përgojimi, gënjeshtra, tallja - mëkate që janë të lehta për t'u kryer dhe të vështira për t'u zhbërë.",
    body: [
      "Gjuha është e vogël, por pasojat e saj janë të mëdha; me pak fjalë një person mund të krijojë besim ose të shkatërrojë një reputacion, të ngushëllojë një zemër ose ta plagosë thellë. Kjo është arsyeja pse Kur'ani dhe Suneti i kthehen aq shpesh mëkateve të të folurit: përgojimi (gibah), shpifja (buhtan), përralla (namimeh), gënjeshtra, tallja dhe betimi i rremë.",
      "Përgojimi do të thotë të përmendësh për vëllain ose motrën tënde diçka që nuk do t'i pëlqente, edhe nëse është e vërtetë - sepse nëse do të ishte e rreme, do të ishte mëkati më i keq i shpifjes. Kurani i jep atij një nga imazhet e tij më të habitshme: e krahason atë me të ngrënit e mishit të vëllait ose motrës së vdekur (49:12). I përshtatur në këtë mënyrë, mëkati humbet rastësinë e tij.",
      'Ajo që i bën këto mëkate kaq të rrezikshme është pikërisht sa të lehta dhe të zakonshme janë ato. Njerëzit rrëshqasin në to në biseda të zakonshme pa u menduar dy herë, prandaj Profeti ﷺ e lidhi besimin me fjalën ruajtëse: "Kushdo që beson në Allahun dhe në Ditën e Fundit, le të flasë mirë ose le të heshtë." Një pauzë e thjeshtë përpara se të flasësh është një akt adhurimi i vërtetë.',
      "Pendimi nga një mëkat i gjuhës ndjek kushtet e zakonshme - ndalim, keqardhje, vendosmëri për të mos u kthyer - me një dimension të shtuar kur përfshihet e drejta e një personi tjetër. Aty ku pastrimi i emrit të tyre ose kërkimi i faljes mund të bëhet pa shkaktuar dëm më të madh, kjo është pjesë e pendimit; ku informimi i tyre vetëm sa do ta thellonte lëndimin, dijetarët këshillojnë në vend të kësaj që të flasin mirë për ta, t'i mbrojnë në mungesë dhe të luten për faljen e tyre.",
    ],
    quran: [
      {
        excerpt:
          "Mos përgojoni njëri-tjetrin. A dëshiron njëri prej jush të hajë mishin e vëllait të tij të vdekur?",
      },
      {
        excerpt: "Mjerë çdo tallës dhe tallës.",
      },
    ],
    hadith: [
      {
        excerpt: "Kush beson Allahun dhe Ditën e Fundit, le të flasë mirë ose le të heshtë.",
      },
    ],
    actions: [
      "Para se të flisni, pyesni: A është e vërtetë? A është e nevojshme? A është i sjellshëm?",
      "Nëse përgojoni dikë, bëni dua për të dhe kërkoni faljen e tij aty ku është e mundur.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Mëkatet ndaj të tjerëve",
    summary: "Të drejtat e njerëzve kërkojnë kthim - jo vetëm pendim tek Allahu.",
    body: [
      "Islami i ndan të drejtat që i detyrohemi në dy lloje: të drejtat e Allahut (hukuk allah) dhe të drejtat e njerëzve (hukuk al-'ibad). Shtypja (dhulm), padrejtësia, thyerja e amaneteve, mashtrimi në tregti, mbajtja e pagave, borxhet e papaguara dhe shkëputja e lidhjeve familjare, të gjitha bien nën të drejtat e njerëzve - dhe këto kanë një seriozitet të veçantë në Ahiret.",
      "Arsyeja tregohet në një Hadith kthjellues. Profeti ﷺ e përshkroi personin me të vërtetë të falimentuar si atë që arrin në Ditën e Gjykimit me lutje, agjërim dhe sadaka - megjithatë kishte fyer, shpifur, marrë pasurinë e padrejtë dhe derdhur gjak. Viktimat e tij paguhen nga veprat e tij të mira derisa të mbarojnë, dhe pastaj mëkatet e tyre ngarkohen mbi të dhe ai hidhet në zjarr (Sahih Mysliman 2581). Një person mund të jetë i pasur në adhurim dhe ende të rrënohet nga mënyra se si i trajtoi të tjerët.",
      "Kjo jep një mësim vendimtar për pendimin: kthimi te Allahu është i nevojshëm, por kur shkelet një e drejtë e njeriut, kjo nuk mjafton në vetvete. Kërkesa e personit të padrejtë mbetet derisa të zgjidhet ose të falet. Pra, pendimi këtu ka një kusht të katërt përtej ndalimit, keqardhjes dhe zgjidhjes - kthimin e borxhit.",
      "Në praktikë kjo do të thotë të kthesh atë që është marrë ose vlerën e saj, të shlyesh borxhet qoftë edhe gradualisht, të rikthejë reputacionin që ka dëmtuar dhe të përpiqet të pajtohet me të afërmit që i ka prerë. Dhe ka mëshirë edhe në këtë: çdo hap i kthimit është në vetvete një vepër e mirë dhe Allahu e lehtëson zemrën e sinqertë që niset të riparojë atë që ka thyer.",
    ],
    quran: [
      {
        excerpt:
          "Nëse nuk hiqni dorë nga riba, atëherë vini re luftën nga Allahu dhe i Dërguari i Tij.",
      },
      {
        excerpt: "Ata që thyejnë besëlidhjen e Allahut dhe prishin atë që Ai urdhëroi, u bashkuan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "E dini kush është i falimentuari? Ai që vjen me namaz, agjërim dhe sadaka, por ai ka fyer, shpifur, ka konsumuar pasurinë në mënyrë të paligjshme dhe ka derdhur gjak, kështu që veprat e tij të mira u jepen të tjerëve.",
      },
    ],
    actions: [
      "Listoni këdo që mund t'i keni bërë keq dhe bëni një hap drejt riparimit këtë javë.",
      "Paguani borxhet e papaguara edhe me këste të vogla nëse kjo është gjithçka që mund të menaxhoni.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Hipokrizia",
    summary: "Hipokrizi e madhe në besim - dhe tipare të hipokrizisë në sjellje.",
    body: [
      "Dijetarët dallojnë dy lloje hipokrizie, dhe mbajtja e tyre veç e veç parandalon ngushëllimin e rremë dhe panikun e rremë. E para është hipokrizia e madhe e besimit (nifak i'tikadi): shfaqja e Islamit nga jashtë, ndërsa përbrenda refuzimi i besimit. Kjo është hipokrizia për të cilën Kurani paralajmëron më rëndë, duke i vendosur njerëz të tillë 'në thellësitë më të ulëta të Zjarrit' (4:145), sepse në të vërtetë ata vdiqën si mosbesimtarë pas një maske.",
      "E dyta është hipokrizia më e vogël, e sjelljes (nifak 'amali): tipare që ngjajnë me sjelljen e hipokritëve edhe te një person besimi i të cilit është i vërtetë. Pejgamberi ﷺ i emërtoi shenjat e njohura - 'kur flet gënjen, kur premton e thyen atë dhe kur i besohet ai tradhton' - dhe në një transmetim tjetër shtoi fëlliqësinë në mosmarrëveshje. Një besimtar mund të bjerë në këto dhe ende të jetë besimtar, por ato janë një paralajmërim serioz për t'u ruajtur.",
      "Ky dallim ka shumë rëndësi për mënyrën se si ne e përdorim temën. Shenjat e sjelljes jepen si një pasqyrë për veten, jo si një etiketë për t'u ngjitur të tjerëve. Profeti ﷺ dhe shokët e tij i frikësoheshin hipokrizisë në vetvete pikërisht sepse zemra është e fshehur dhe mund të ndryshojë.",
      "Pra, përgjigja e shëndetshme është e brendshme: të kontrollosh ndershmërinë, besnikërinë ndaj premtimeve dhe besueshmërinë e dikujt, dhe t'i kërkosh Allahut sinqeritetin (ikhlas). Vetëm Allahu e di se çfarë fshihet brenda një personi dhe akuzimi i individëve të caktuar për hipokrizi është në vetvete një shkelje e rëndë ndaj tyre.",
    ],
    quran: [
      {
        excerpt: "Munafikët do të jenë në thellësinë më të ulët të zjarrit.",
      },
      {
        excerpt:
          "Kur të vijnë hipokritët, thonë: “Dëshmojmë se ti je i Dërguari i Allahut, e Allahu e di se ata janë gënjeshtarë.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Shenjat e hipokritit janë tre: kur flet gënjen, kur premton e thyen dhe kur i besohet tradhton.",
      },
    ],
    disclaimer:
      "Mos i akuzoni individët për nifak. Tekstet paralajmërojnë komunitetin; pastrimi fillon nga vetja.",
  },
  {
    title: "Dënimet e përmendura",
    summary:
      "Ajo që përshkruajnë tekstet - lexo me frikë nga Allahu dhe shpresë në mëshirën e Tij.",
    body: [
      "Kur'ani dhe Suneti përmendin pasoja specifike për gabimet specifike - për ata që hanë ribanë, që shpifin për gratë e dëlira, që grumbullojnë pasuri dhe e mbajnë atë që i takon, që e lënë pas dore namazin dhe që këmbëngulin në mëkatin e madh. Specifikimi është një formë qartësie: nuk e lë askënd në gjendje të thotë se nuk ishte paralajmëruar për atë që po bënin.",
      'Disa nga këto pasoja janë përshkruar në varr (adhab al-kabr) dhe të tjera në vetë Xhehenem. Akideja kryesore sunite pohon realitetin e të dyjave, ndërkohë që ia beson "si" të saktë të këtyre çështjeve të padukshme dijes së Allahut dhe jo imagjinatës njerëzore.',
      "Mënyra se si një besimtar angazhohet me gjithë këtë është ajo që ka rëndësi. Synimi nuk është të ndalemi kurrë në detajet grafike ose të lëmë zemrën të fundoset; është të marrësh paralajmërimin, të pendohesh nga çdo gjë që vlen dhe më pas të kthesh energjinë drejt veprave që mbrojnë në të vërtetë. Kjo është arsyeja pse ky modul i jep qëllimisht më shumë hapësirë ​​mbrojtjes, pendimit dhe mëshirës sesa ndëshkimit.",
      "Shkurtimisht, heqja e duhur nga çdo dënim i përmendur është një pyetje, jo një frikë: 'A po e bëj këtë - dhe nëse po, si të ndalem dhe ta rregulloj atë?' I përgjigjur sinqerisht sot, paralajmërimi tashmë ka bërë punën e tij të mëshirshme.",
    ],
    quran: [
      {
        excerpt:
          "Ata që i akuzojnë gratë e dëlira dhe nuk sjellin katër dëshmitarë, i fshikulloni me tetëdhjetë rripa.",
      },
      {
        excerpt:
          "Ata që grumbullojnë arin dhe argjendin dhe nuk e shpenzojnë për rrugën e Allahut, përgëzoji me një dënim të dhembshëm.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Mbrojtje nga Ferri",
    summary: "Teuhidi, namazi, teubeja, bamirësia, Kurani dhe duaja - zemra e këtij moduli.",
    body: [
      "Pas të gjitha paralajmërimeve, ky është thelbi i çështjes: Xhehenemi është diçka nga e cila njeriu duhet të mbrohet, dhe Islami është plot me mjetet e kësaj mbrojtjeje. Më i madhi prej tyre është teuhidi i shëndoshë - adhurimi i vetëm Allahut, pa asgjë përveç Tij. Çdo vepër tjetër pranohet dhe peshohet vetëm mbi këtë bazë, prandaj ruajtja e besimit është para çdo gjëje tjetër.",
      "Mbi këtë bazë, mburojat praktike janë të shumta dhe të arritshme: falja e pesë namazeve ditore, pendimi i sinqertë, dhënia e sadakasë - për të cilën Profeti ﷺ tha se shuan mëkatin ashtu siç shuan uji zjarrin - agjërimi, leximi i Kur'anit dhe veprim sipas tij, karakteri i mirë, mëshira ndaj të tjerëve, përkujtimi i rregullt (dhikri) dhe kërkimi i vazhdueshëm. Asnjë nga këto nuk kërkon pasuri apo njohuri të madhe; ata janë të hapur për të gjithë.",
      "Profeti ﷺ mësoi gjithashtu lutjet e drejtpërdrejta për strehim nga Zjarri dhe na nxiti që të pyesnim shpesh. Ai tha se kushdo që i kërkon Allahut Xhenetin tri herë, vetë Xheneti lutet për pranimin e tij, dhe kushdo që kërkon strehim nga zjarri tri herë, vetë zjarri lutet që t'i shpëtohet (Xhami'et-Tirmidhi 2572). Këto dua kanë një vend të veçantë para selamit në namaz dhe në edhker në mëngjes dhe në mbrëmje.",
      "Vini re ekuilibrin që arrin Sheriati. Mjetet e mbrojtjes janë më të shumta, më të theksuara dhe më të arritshme se shkaqet e shkatërrimit - dhe kjo në vetvete është një shenjë e mëshirës së Allahut. Është shumë më e lehtë të shpëtohesh sesa të humbasësh.",
      "Ky seksion është qëllimisht më i madhi në modul, sepse kështu e peshon çështjen vetë Islami: paralajmërimi i shoqëruar gjithmonë me shpresën dhe asnjëherë i ndarë nga veprimi konkret, një person mund të fillojë sot.",
    ],
    quran: [
      {
        excerpt:
          "Ata që thonë: “O Zoti ynë, ne kemi besuar, na i fal mëkatet tona dhe na ruaj prej dënimit të zjarrit.",
      },
      {
        excerpt:
          "Zoti ynë, na jep të mira në këtë botë dhe të mira në botën tjetër dhe na ruaj nga dënimi i zjarrit.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kush i kërkon Allahut Xhenetin tri herë, Xheneti i thotë: O Allah, fute atë në Xhenet. Kush kërkon strehim nga zjarri tri herë, zjarri thotë: O Allah, ruaje atë nga zjarri.",
      },
    ],
    actions: [
      "Mësoni përmendësh duatë që kërkojnë strehim nga Xhehenemi para selamit në namaz.",
      "Falni pesë namazet ditore në kohë - ndër mburojat më të forta.",
      "Jepni bamirësi rregullisht, qoftë edhe në sasi të vogla.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Pendimi (Teube)",
    summary:
      "Allahu e pranon pendimin e sinqertë - asnjë mëkat nuk është shumë i madh para vdekjes.",
    body: [
      "Teube - pendimi - është mekanizmi që Allahu ka ndërtuar në fe, në mënyrë që asnjë mëkat të mos jetë i përhershëm. Në thelbin e tij është kthimi i zemrës mbrapsht drejt Allahut dhe dijetarët i nxjerrin kushtet e tij nga Kurani dhe Suneti: ndaloni sinqerisht mëkatin, ndjeni keqardhje të sinqertë për të dhe vendosmërisht për të mos u kthyer më. Kur mëkati përfshin një të drejtë të një personi tjetër, shtohet një kusht i katërt - rivendosja e kësaj të drejte ose kërkimi i faljes.",
      "Ajo që e bën teuben kaq shpresëdhënëse është mënyra se si e pranon Allahu. Ai nuk e toleron thjesht shërbëtorin që kthehet; Ai gëzohet. Pejgamberi ﷺ tha se Allahu është më i gëzuar për pendimin e robit të Tij se një njeri i cili, pasi ka humbur malin e tij me të gjitha furnizimet në një shkretëtirë të shkretë dhe ka hequr dorë nga shpresa, befas e gjen atë duke qëndruar para tij (Sahih el-Bukhari 6309). Kjo është mirëseardhja që pret këdo që kthehet prapa.",
      "Dera e tij, për më tepër, nuk mbyllet kurrë gjatë gjithë jetës. Profeti ﷺ ka thënë se Allahu e shtrin dorën e Tij natën për të pranuar pendimin e mëkatarit të ditës dhe e shtrin dorën e Tij ditën për të pranuar pendimin e mëkatarit të natës (Sahih Mysliman 2759). Pendimi pranohet për individin derisa shpirti të arrijë në fyt pas vdekjes, dhe për njerëzimin derisa të lind dielli nga perëndimi - kështu që nuk ka asnjë arsye për ta vonuar atë.",
      "Kjo është e vërtetë edhe për atë që ka rënë dhe është penduar shumë herë. Përderisa kthimi është i sinqertë çdo herë, Allahu vazhdon të pranojë; dëshpërimi është nga shejtani, jo nga feja. E vetmja gjë që duhet të zgjidhet para vdekjes është shirku, pasi një person që vdes mbi të vdes pa besimin që kërkon pendimi - pikërisht për këtë arsye kthimi i plotë vetëm tek Allahu është kthimi më urgjent nga të gjitha.",
      "Marrja praktike është e thjeshtë: pendohuni tani, pendohuni shpesh dhe mos lejoni kurrë që madhësia e një mëkati, apo numri i rënieve të së shkuarës, t'ju argumentojë që të mos ktheheni. Ftesa është gjithmonë e hapur.",
    ],
    quran: [
      {
        excerpt:
          "Mos e humbni shpresën nga mëshira e Allahut. Vërtet, Allahu i fal të gjitha mëkatet. Ai është Falës, Mëshirues.",
      },
      {
        excerpt:
          "Përveç atyre që pendohen, besojnë dhe bëjnë vepra të mira, Allahu ua zëvendëson veprat e këqija me të mira.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allahu është më i kënaqur me pendimin e robit të Tij se ai prej jush që e gjen malin e humbur në një tokë djerrë.",
      },
      {
        excerpt:
          "Allahu e zgjat dorën e Tij natën për të pranuar pendimin e mëkatarit të ditës dhe zgjat dorën e Tij gjatë ditës për të pranuar pendimin e mëkatarit të natës, derisa të lind dielli nga perëndimi i tij.",
      },
    ],
    actions: [
      "Thuaj Astaghfirullah gjatë gjithë ditës – synoni për qëndrueshmëri, jo vetëm pas rrëshqitjeve të mëdha.",
      "Mësoni Sejid el-Istighfarin dhe recitoni atë në mëngjes dhe në mbrëmje.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Shpresoni në mëshirën e Allahut",
    summary: "Mos u dëshpëroni kurrë - veprat e mira i fshijnë mëkatet; ka rëndësi konsistenca.",
    body: [
      "Gjithçka në këtë modul tregon këtu. Allahu është ar-Rrahman er-Rahim - Më i Mëshirshmi - dhe Ai na ka thënë se mëshira e Tij tejkalon zemërimin e Tij dhe 'përfshin çdo gjë' (7:156). Besimtari ka për qëllim të jetojë mes shpresës dhe frikës, si dy krahët e një zogu: mjaft i frikësuar nga mëkati për të qëndruar vigjilent, mjaftueshëm shpresëdhënës në falje për të mos u dorëzuar kurrë.",
      "Për shkak të kësaj, dëshpërimi është në vetvete i pavend. Sado që një person ndjen se ka humbur, dera e pasme është e hapur dhe është shejtani - jo Allahu - ai që pëshpërit se është tepër vonë. Të dëshpërosh nga mëshira është të mendosh shumë pak për të Mëshirshmin; puna e zemrës së sinqertë është thjesht të kthehet.",
      "Këtu qëndron rehatia e madhe e besimit sunit për zjarrin. Për ata që vdesin në mosbesim, Xhehenemi është vendbanim i përhershëm. Por një besimtar që vdes duke pohuar vetëm Allahun, edhe nëse rëndohet nga mëkatet e mëdha, nuk do të mbetet në të përgjithmonë. Profeti ﷺ mësoi se njerëzit do të nxirren nga zjarri me ndërmjetësim dhe më pas me mëshirën e vetë Allahut - do të hidhen në Lumin e Jetës në skaj të Xhenetit, ku ata rivendosen dhe hyjnë në të (Sahih el-Bukhari 7439). Ai tha se askush nuk do të mbetet në zjarr që të ketë besim sa një kokërr sinapi në zemër (Sahih Mysliman 183). Për monoteistin, pra, Zjarri - nëse hyn fare - nuk është kurrë fundi i tregimit.",
      "Ndërkohë, mëshira ndërtohet në jetën e përditshme: veprat e mira i fshijnë të këqijat (11:114) dhe adhurimi i vogël dhe i qëndrueshëm – një lutje e falur në kohë, një akt i qetë bamirësie, një moment durimi i mbajtur për hir të Allahut – e afron vazhdimisht një person më pranë Tij dhe më larg nga dëmtimi. Konsistenca ka më shumë rëndësi se intensiteti.",
      "Pra, le të jetë ky përfundimi i studimit tuaj: merre seriozisht paralajmërimin, por le të jetë shpresa më e fortë se frika. Dije rrezikun, zgjidh rrugën e mëshirës dhe ec atë – hap pas hapi – çdo ditë derisa të takosh Allahun.",
    ],
    quran: [
      {
        excerpt: "Mëshira ime përfshin të gjitha gjërat.",
      },
      {
        excerpt:
          "Thuaj: O robërit e Mi që e keni ngarkuar me shumë gabime veten tuaj, mos e humbni shpresën ndaj mëshirës së Allahut. Vërtet, Allahu i fal të gjitha mëkatet.",
      },
      {
        excerpt:
          "Vërtet, veprat e mira i largojnë të këqijat. Ky është përkujtues për ata që kujtojnë.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allahu do të thotë: Melaiket kanë ndërmjetësuar, profetët kanë ndërmjetësuar dhe besimtarët kanë ndërmjetësuar dhe nuk mbetet tjetër përveç Mëshiruesit të mëshiruesve. Ai do të marrë një grusht nga zjarri dhe do të nxjerrë njerëz që nuk kanë bërë kurrë ndonjë të mirë.",
      },
      {
        excerpt: "Kush ka besim në zemrën e tij sa një kokërr sinapi, do të nxirret nga zjarri.",
      },
    ],
    actions: [
      "Përfundoni çdo ditë me istigfar dhe mirënjohje për çdo bekim.",
      "Bashkoje këtë modul me Udhëtimin në Xhenet - paralajmërim dhe shpresë së bashku.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Mëkatet shkatërruese",
    summary: "Ruhuni nga mëkatet e mëdha që të largojnë nga mëshira e Allahut.",
    body: [
      "Mëkatet e mëdha paralajmërohen rreptësisht në Kuran dhe Sunet.",
      "Dera e pendimit është e hapur deri në vdekje.",
      "Lëreni mëkatin, pendohuni dhe vendosni të mos ktheheni.",
      "Kthimi i të drejtave të njerëzve është pjesë e pendimit.",
      "Mos e humbni shpresën në mëshirën e Allahut.",
    ],
    destructiveItems: [
      {
        title: "Shirku",
        summary: "T'i bësh shok Allahut është padrejtësia më e madhe.",
      },
      {
        title: "Magjia",
        summary: "Magjia ose kërkimi i saj është i ndaluar.",
      },
      {
        title: "Vrasja",
        summary: "Vrasja e një të pafajshmi është krim i rëndë.",
      },
      {
        title: "Kamata",
        summary: "Marrja dhe dhënia e kamatës është haram.",
      },
      {
        title: "Pasuria e jetimit",
        summary: "Ngrënia padrejtësisht e pasurisë së jetimit.",
      },
      {
        title: "Ikja nga beteja",
        summary: "Ikja nga fusha në luftë të ligjshme.",
      },
      {
        title: "Shpifja ndaj të dëlirave",
        summary: "Akuza për imoralitet ndaj besimtarit të dëlirë.",
      },
      {
        title: "Falimenti",
        summary: "Humbja e veprave për shkak të të drejtave të njerëzve.",
      },
    ],
    quran: [
      {
        excerpt: "Allahu nuk e fal t'i bëhet ortak Atij.",
      },
      {
        excerpt: "Kush vret një shpirt pa të drejtë, sikur ka vrarë gjithë njerëzit.",
      },
      {
        excerpt: "Ata që hanë pasurinë e jetimëve me padrejtësi hanë zjarr.",
      },
    ],
    hadith: [
      {
        excerpt: "Ruhuni nga shtatë mëkatet shkatërruese.",
      },
      {
        excerpt: "I falimentuari vjen me namaz, por ka cenuar njerëzit.",
      },
      {
        excerpt: "Ruhuni nga shirku.",
      },
      {
        excerpt: "I penduari nga mëkati është si ai pa mëkat.",
      },
      {
        excerpt: "Allahu gëzohet për pendimin e robit të Tij.",
      },
    ],
    actions: [
      "Pendohuni sinqerisht.",
      "Ktheni të drejtat e njerëzve.",
      "Largohuni nga rrugët e mëkatit.",
    ],
    appLinks: [
      {
        label: "Lutje pendimi",
      },
      {
        label: "Ndjekja e namazit",
      },
      {
        label: "Borxhet dhe amanetet",
      },
      {
        label: "Dhikri ditor",
      },
    ],
  },
];

export const JAHANNAM_MAJOR_SIN_TOPICS_SQ: DeepPartial<JahannamTopic>[] = [
  {
    title: "Shirku",
    summary: "T'i bësh shok Allahut, mëkati i vetëm që nuk falet nëse vdes mbi të.",
    body: [
      "Përkufizimi: Shirku është t'i bësh shok Allahut - të drejtosh çdo veprim që i përket vetëm Atij (adhurimi, dashuria përfundimtare, frika, shpresa, mbështetja ose e drejta për të ligjësuar) diçka ose dikë tjetër përveç Tij. Është e kundërta e teuhidit dhe godet pikërisht qëllimin për të cilin ekziston krijimi: të adhurosh vetëm Allahun.",
      "Pse është më i madhi nga të gjitha mëkatet: çdo mëkat tjetër është një gabim i bërë duke pranuar Zotin e vërtetë, por shirku është një gabim që i bëhet Atij drejtpërdrejt - duke ngatërruar krijimin me Krijuesin. Kjo është arsyeja pse Kurani e quan atë 'zullum të madh' (31:13). Është i vetmi mëkat që, nëse njeriu vdes në të pa u penduar, nuk falet: “Vërtet, Allahu nuk ia fal shoqërinë Atij, por ia fal atë që është më pak se kaq kujt të dojë” (4:48). Mëshira e fshehur edhe në këtë ashpërsi është se çdo gjë që mungon shirku mbetet nën faljen e Allahut.",
      "Format e tij: studiuesit dallojnë shirkun kryesor - adhurimin e idhujve, të vdekurve, shenjtorëve ose gjërave të krijuara; duke thirrur dikë tjetër përveç Allahut për atë që vetëm Ai mund të japë; dhe drejtimin e sakrificës apo zotimeve për dikë tjetër përveç Tij – gjë që e nxjerr një person jashtë Islamit nëse nuk pendohet. Ekziston edhe shirk më i vogël dhe i fshehtë, si për shembull, shfaqja në adhurim (rija), betimi në dikë tjetër përveç Allahut, ose mbështetja në shenjat dhe hijeshitë, që është një mëkat i rëndë, por që në vetvete nuk përjashton nga feja.",
      "Rruga larg saj: ruaje dhe forco teuhidin duke e mësuar atë, duke adhuruar vetëm Allahun dhe duke pastruar nijetin në mënyrë që veprat të jenë për Të e jo për sytë e njerëzve. Kushdo që ka rënë në shirk pendohet duke hequr dorë sinqerisht prej tij dhe duke u rikthyer në adhurimin vetëm ndaj Allahut - dhe ajo derë e kthimit qëndron e hapur për aq kohë sa njeriu jeton.",
    ],
    quran: [
      {
        excerpt: "Vërtet, Allahu nuk ia fal shoqërinë Atij, por më pak se kaq ia fal kujt të dojë.",
      },
      {
        excerpt:
          "O biri im, mos i bëj shok Allahut. Në të vërtetë, shoqërimi është keqbërje e madhe.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mëkatet më të mëdha janë: bërja shok Allahut, vrasja e shpirtit, mosbindja ndaj prindërve dhe dhënia e dëshmisë së rreme.",
      },
    ],
    actions: [
      "Mësoni teuhidin përmes Mësoni Akide dhe 99 Emrat e Allahut.",
      "Pastroni qëllimet në adhurim - kërkoni nga Allahu sinqeritet çdo ditë.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Vrasje",
    summary: "Marrja e jetës së pafajshme në mënyrë të paligjshme - ndër shkeljet më të rënda.",
    body: [
      "Përkufizimi: Vrasja këtu nënkupton marrjen e paligjshme dhe të qëllimshme të një jete që Allahu e ka bërë të shenjtë. Islami i njeh rastet e ligjshme – të tilla si kisasi i ligjshëm (shpërblimi ligjor) i kryer nga autoriteti i duhur – por vrasja e një shpirti të pafajshëm jashtë kauzës së drejtë është ndër krimet më të rënda.",
      "Pse është kaq e rëndë: Kur'ani peshon një vrasje të vetme të padrejtë në shkallën e gjithë njerëzimit: 'Kushdo që vret një shpirt... është sikur të kishte vrarë gjithë njerëzimin' (5:32), sepse të shkatërrosh një jetë është të shkelësh shenjtërinë që mbron çdo jetë. Vrasja ishte mëkati i parë i kryer ndërmjet bijve të Ademit dhe shpallja i kthehet përsëri dhe përsëri si shkatërrues i Ahiretit.",
      "Një gabim i dyfishtë: vrasja është njëherësh mëkat ndaj Allahut, të cilit i shkelet e drejta mbi shenjtërinë e jetës, dhe mëkat ndaj njerëzve – viktimës dhe atyre që ata lënë pas. Kjo është arsyeja pse pendimi i tij është më i rëndë se shumica: kthimi te Allahu është i nevojshëm, por të drejtat e të padrejtëve gjithashtu qëndrojnë, dhe aty ku ligji i vendit ose ligji Islami parashikon paranë e gjakut (dijah) ose pasoja të tjera, këto duhet të përmbushen përmes kanaleve të duhura dhe dijetarëve të kualifikuar.",
      "Rruga larg saj: mbajeni çdo jetë të shenjtë, zbutni zemërimin dhe armiqësinë përpara se ato të ngurtësohen dhe zgjidhini mosmarrëveshjet me durim dhe drejtësi në vend të dhunës. Dhe edhe ky krim më i madh kundër njerëzve nuk është përtej mëshirës së Allahut për atë që pendohet sinqerisht, i përmbush të drejtat e përfshira aq sa është e mundur dhe nuk kthehet kurrë në një rrugë të tillë.",
    ],
    quran: [
      {
        excerpt:
          "Kushdo që vret një shpirt, përveç nëse për një shpirt ose për prishje në tokë, është sikur të ketë vrarë gjithë njerëzimin.",
      },
      {
        excerpt:
          "Kush e vret një besimtar me qëllim, shpërblimi i tij është Xhehennemi, ku do të jetë përgjithmonë.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mëkatet më të mëdha janë: bërja shok Allahut, vrasja e shpirtit, mosbindja ndaj prindërve dhe dhënia e dëshmisë së rreme.",
      },
    ],
    actions: ["Vlerësoni çdo jetë; zgjidh mosmarrëveshjet me durim dhe drejtësi."],
    appLinks: [{}],
  },
  {
    title: "Zina",
    summary:
      "Marrëdhëniet seksuale të paligjshme - një mëkat shkatërrues kundër shpirtit dhe shoqërisë.",
    body: [
      "Përkufizimi: Zina është çdo marrëdhënie seksuale e paligjshme jashtë një martese të vlefshme, që mbulon si kurvërinë (mes të pamartuarit) ashtu edhe tradhtinë bashkëshortore (që përfshin një person të martuar). Islami e trajton atë jo si një çështje private, por si një shkelje me dëm të madh.",
      "Pse është e rëndë: Zina gërryen gjërat mbi të cilat është ndërtuar një shoqëri e shëndetshme - prejardhja, besimi midis bashkëshortëve, siguria e fëmijëve dhe dëlirësia që e nderon një person. Formulimi i Kuranit është në vetvete udhëzues: ai nuk e ndalon vetëm veprimin, por thotë 'as mos iu afroni' (17:32), duke paralajmëruar kundër shikimeve, privatësisë dhe hapave që të çojnë drejt tij. Ky ndalim i afrimit është një mëshirë, sepse mbron një person përpara se tundimi të bëhet dërrmues.",
      "Mençuria në pengesa: në vend që t'i lërë njerëzit të luftojnë dëshirën në kulmin e saj, Islami i rrethon ata me mbrojtje të mëparshme - ulje të shikimit, modesti në veshje dhe sjellje, shmangie e veçimit me seksin e kundërt dhe inkurajimi i martesës si kanali i ligjshëm dhe i nderuar për këto nevoja. Ndërtimi i këtyre kufijve paraprakisht është shumë më i lehtë sesa të rezistosh në skaj.",
      "Rruga e kthimit: për këdo që ka rënë, rruga për të dalë është teubeja e sinqertë - lënia e mëkatit plotësisht, pendimi për të, vendosja për të mos u kthyer më dhe mbulimi në vend që të publikohet e kaluara. Zina është një mëkat i madh, por është në mesin e atyre që Allahu e fal atë që i drejtohet Atij; dëshpërimi nuk ka vend dhe një fillim i ri është gjithmonë i disponueshëm.",
    ],
    quran: [
      {
        excerpt:
          "Mos iu afroni marrëdhënieve seksuale të paligjshme. Vërtet, ajo është e pamoralshme dhe një mënyrë e keqe.",
      },
      {
        excerpt:
          "Dhe ata që nuk kryejnë marrëdhënie seksuale të palejuara... përveç atij që pendohet, beson dhe bën vepra të mira, atyre Allahu ua zëvendëson veprat e këqija me të mira.",
      },
    ],
    actions: [
      "Ruani sytë dhe konsumin e mediave sociale.",
      "Bëni dua për një bashkëshort të drejtë nëse është i pamartuar.",
    ],
    appLinks: [{}],
  },
  {
    title: "Riba",
    summary: "Kamata dhe kamata - lufta e shpallur kundër praktikuesve të saj në Kur'an.",
    body: [
      "Përkufizimi: Riba është rritja e paligjshme në disa marrëveshje financiare - më e njohura është interesi i ngarkuar ose paguar për huatë, por gjithashtu duke përfshirë shkëmbime specifike të pabarabarta ose të shtyra të mallrave të ngjashme. Thelbi i saj është fitimi i pasurisë pa vlerë apo rrezik të vërtetë, në kurriz të tjetrit.",
      "Pse është jashtëzakonisht e rëndë: riba është unike midis mëkateve financiare në gjuhën që Kurani përdor kundër saj. Allahu shpall luftë nga Vetja dhe i Dërguari i Tij (ﷺ) ndaj atyre që këmbëngulin në të (2:279) - një frazë e përdorur për asnjë mëkat tjetër - sepse riba shfrytëzon nevojën, përqendron pasurinë në duart e disave dhe zbraz dhembshurinë që një ekonomi duhet të bartë. Pejgamberi ﷺ paralajmëroi ashpër që të mos merret me të në çfarëdo cilësie.",
      "Mençuria dhe mëshira: ndalimi i ridrejton njerëzit drejt tregtisë reale, rrezikut të përbashkët dhe bamirësisë, dhe mbron të pambrojturit nga dërrmimi nga borxhi. Edhe këtu, megjithatë, mëshira e Allahut është e pranishme: kur erdhi urdhri, Ai nuk kërkoi që të kthehej interesi i kaluar tashmë i marrë, por u tha besimtarëve thjesht të braktisnin atë që kishte mbetur - 'ju do të keni principalin tuaj' (2:279) - një lehtësi për ata që largohen prej tij.",
      "Rruga larg saj: auditoni financat tuaja për produkte të bazuara në interes, kërkoni alternativa hallall dhe konsultohuni me studiues të kualifikuar për raste vërtet të vështira, siç janë hipotekat në tokat jomuslimane. Largimi nga Riba mund të nënkuptojë zgjedhje të vështira financiare, por siguria e shpirtit tejkalon çdo përfitim të përkohshëm - dhe Allahu premton të sigurojë për atë që i frikësohet Atij nga ku ai nuk e pret.",
    ],
    quran: [
      {
        excerpt:
          "O ju që besuat, kini frikë Allahun dhe hiqni dorë nga ajo që ka mbetur nga riba, nëse jeni besimtarë. Nëse nuk e bëni këtë, atëherë informohuni për një luftë nga Allahu dhe i Dërguari i Tij. Por nëse pendoheni, mund të keni drejtorin tuaj - nuk bëni asnjë të keqe, as nuk ju bëhet padrejtësi.",
      },
      {
        excerpt: "Allahu e shkatërron interesin dhe i shton bamirësitë.",
      },
    ],
    actions: [
      "Auditimi i financave për produktet e bazuara në interes.",
      "Konsultohuni me një studiues të kualifikuar për hipotekat dhe borxhet.",
    ],
    appLinks: [{}],
  },
  {
    title: "Dëshmi e rreme",
    summary: "Gënjeshtra nën betim ose dhënia e dëshmisë së rreme - shkatërron drejtësinë.",
    body: [
      "Përkufizimi: Dëshmia e rreme (shehadet al-zur) është dëshmia e diçkaje të pavërtetë - dhe më gjerësisht, gënjeshtra nën betim, fabrikimi i akuzave ose mbajtja e dëshmisë së vërtetë kur drejtësia varet prej saj.",
      "Pse është e rëndë: korrupton vetë instrumentin me të cilin vendoset drejtësia. Një dëshmitar i vetëm i rremë mund të dërgojë një person të pafajshëm në rrënim, të zhvesh pronën e një pronari të ligjshëm ose të lirojë një shtypës – kështu që gënjeshtra nuk i përmbahet kurrë gënjeshtarit; plagos njerëzit e vërtetë dhe gjithë rendin e drejtësisë. Pejgamberi ﷺ e numëroi atë ndër mëkatet më të mëdha dhe në një transmetim ai u bë aq këmbëngulës në përsëritjen e paralajmërimit ndaj tij, saqë shokët e tij dëshironin që ai të ndalonte, nga shqetësimi për të.",
      "Lidhja e saj me gjuhën: dëshmia e rreme është skaji më i mprehtë i mëkateve më të gjera të të folurit. Për shkak se fjalët janë të lira për t'u shqiptuar, ky mëkat është rrezikshmërisht i lehtë për t'u rënë - një nënshkrim, një ekzagjerim, një heshtje e përshtatshme - dhe megjithatë pesha e tij në Ditën e Gjykimit është e pamasë, kur gjymtyrët dhe gjuhët e njerëzve do të dëshmojnë me të vërtetë kundër tyre.",
      "Rruga larg saj: mbajeni të vërtetën edhe kur është e kushtueshme ose kundër interesit të dikujt, refuzoni t'i jepni fjalën tuaj ndonjë gënjeshtrës dhe flisni me dëshmi të drejtë kur është e nevojshme. Ai që ka dhënë dëshmi të rreme pendohet duke e tërhequr gënjeshtrën aty ku është e mundur, duke u përpjekur për të zhbërë dëmin dhe për të rivendosur të drejtat e kujtdo të padrejtë dhe duke iu kthyer Allahut me keqardhje të sinqertë.",
    ],
    quran: [
      {
        excerpt:
          "Dhe ata që nuk dëshmojnë për të pavërtetën, dhe kur u afrohen fjalë të këqija, kalojnë me dinjitet.",
      },
      {
        excerpt: "Pra, shmangni papastërtinë e idhujve dhe shmangni deklaratat e rreme.",
      },
    ],
    hadith: [
      {
        excerpt:
          "A nuk ju njoftoj për mëkatet më të mëdha? Dhënia e shok Allahut, mosbindja ndaj prindërve - dhe dhënia e dëshmisë së rreme dhe dhënia e dëshmisë së rreme.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "magji",
    summary: "Magjia, kërkimi i magjistarëve dhe praktikat okulte - kufri në forma kryesore.",
    body: [
      "Përkufizimi: Sihr (magji ose magji) është përdorimi i mjeteve të ndaluara - shpesh duke përfshirë mbështetjen te djajtë ose një pretendim për pushtet mbi të padukshmen - për të ndikuar tek njerëzit ose ngjarjet. Praktikimi i tij, mësimi i tij, kërkimi i tij nga të tjerët dhe besimi i atyre që e pretendojnë të gjitha bien nën këtë mëkat.",
      "Pse është kaq i rëndë: shumica e sihrit nuk mund të kryhen pa akte mosbesimi, të tilla si afrimi me shejtanët ose poshtërimi i Kuranit, prandaj Kur'ani e lidh diturinë e tij me kufrin. Duke folur për magjinë e mësuar në kohën e Sulejmanit, Allahu thotë se shejtanët dhe ata dy engjëj e mësuan atë vetëm si sprovë, duke paralajmëruar 'mos mos beso' (2:102). Përtej rrezikut kreedal, sihr dëmton njerëzit e vërtetë - mbjellja e ndarjes midis bashkëshortëve, përhapja e frikës dhe shfrytëzimi i të dëshpëruarve.",
      "Praktika të ngjashme: i njëjti paralajmërim shtrihet në tregimin e fatit, në trajtimin e astrologjisë si njohuri të sigurta të së padukshmes dhe në hajmalitë dhe hijeshitë që bartin shirk. Pretendimi i diturisë së së ardhmes së fshehtë i takon vetëm Allahut, dhe kthimi tek ata që e pretendojnë atë e minon teuhidin në rrënjë.",
      "Rruga larg saj: për atë që është ngatërruar në këto praktika, pendim do të thotë t'i braktisësh ato tërësisht, të shkatërrosh çdo send të ndaluar, të ndërpresësh lidhjet me ata që merren me to dhe të ripërtërish teuhidin e sinqertë dhe mbështetjen vetëm tek Allahu. Mbrojtja gjendet në besim, në adkarin e përditshëm dhe në kërkimin e strehimit tek Allahu - dhe falja e Tij është e hapur për këdo që kthehet me të vërtetë.",
    ],
    quran: [
      {
        excerpt:
          "Ata ndoqën atë që djajtë recituan gjatë sundimit të Solomonit… dhe mësojnë se çfarë u bën dëm e nuk u sjell dobi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kushdo që vjen te një fallxhore dhe i beson asaj që thotë ai, ka mohuar atë që i është shpallur Muhamedit.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Konsumimi i pasurisë jetimore",
    summary: "Marrja apo shpërdorimi i pasurisë së jetimëve pa të drejtë.",
    body: [
      "Përkufizimi: Ky mëkat është marrja, shpërdorimi ose keqpërdorimi i pasurisë së jetimëve - fëmijëve që kanë humbur babanë dhe nuk mund të mbrojnë interesat e tyre. Një kujdestar e mban pasurinë e tyre si amanet (amanah), kurrë si pronar.",
      "Pse është e rëndë: ndërthur dy gabime - tradhti ndaj një amaneti të shenjtë dhe shtypje ndaj më të pambrojturve. Përfytyrimi i Kuranit është i ashpër: ata që hanë pasurinë e jetimëve padrejtësisht 'hanë vetëm zjarr në barkun e tyre' (4:10), duke e kthyer një moment lakmie në një ndëshkim të vetëshkaktuar. Të shfrytëzosh dikë që nuk ka askënd që të flasë në emër të tij është ndër format më të shëmtuara të padrejtësisë, prandaj paralajmërimi është kaq i mprehtë - dhe, duke qenë i mprehtë, aq i mëshirshëm në largimin e kujdestarëve prej tij.",
      'Çfarë përfshin: jo vetëm vjedhjet e drejtpërdrejta, por edhe forma më delikate - përzierja e pronës së një jetimi me pronën e dikujt për të mjegulluar kufirin, vonimi i kthimit të saj pasi jetimi të arrijë moshën, ose investimi ose shpenzimi i saj pa të drejtë. Allahu urdhëron të kundërtën: "Jepuni jetimëve pasurinë e tyre dhe mos e ndërroni të keqen me të mirën" (4:2).',
      "Rruga larg saj: ruaje pasurinë e jetimëve me përpikëri, mbaje të ndarë dhe llogaritur, dorëzoje plotësisht kur të piqen dhe - për atë që ka dështuar - pendohu duke ua kthyer borxhin me çdo shtim të duhur dhe duke kërkuar faljen e të padrejtëve. Në Ditën kur asnjë pasuri apo prejardhja nuk do të ndihmojë përveç një zemre të shëndoshë, rivendosja e një amaneti të tillë është në vetvete një vepër e çmuar.",
    ],
    quran: [
      {
        excerpt:
          "Ata që hanë pasurinë e jetimëve pa të drejtë, ata hanë vetëm zjarr në barkun e tyre.",
      },
      {
        excerpt:
          "Jepini jetimëve pasurinë e tyre dhe mos e ndërroni të keqen me të mirë dhe mos e konsumoni pasurinë e tyre me pasurinë tuaj.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Mosbindje ndaj prindërve",
    summary: "Ukuk - ndër mëkatet e mëdha pas shirkut.",
    body: [
      "Përkufizimi: 'Ukuk al-Validejn është mosbindje dhe keqtrajtim i rëndë i prindërve të dikujt – dëmtimi i tyre, trajtimi i tyre me përbuzje, shpërfillja e tyre në nevojë, ose plagosja e tyre me fjalë ose vepra. Është e kundërta e birr al-Validejnit, mirësjelljes së përgjegjshme që urdhëron Islami.",
      'Pse është kaq e rëndë: në varg pas ajeti Allahu e bashkon urdhrin për ta adhuruar Atë me urdhrin për t\'u sjellë mirë ndaj prindërve, si në "Adhuroni Allahun... dhe bëni mirë ndaj prindërve" (4:36) - duke e vendosur të drejtën e tyre menjëherë pas të Tijës. Prindërit janë, pas Allahut, burimi më i afërt i vetë qenies dhe edukimit të një personi, kështu që mosmirënjohja ndaj tyre është një lloj mosmirënjohjeje që shkon thellë. Profeti ﷺ e renditi keqtrajtimin e tyre ndër mëkatet më të mëdha, të dytin pas shirkut.',
      "Një ekuilibër i rëndësishëm: përkushtimi nuk do të thotë t'u bindesh prindërve në mosbindje ndaj Allahut - asnjë krijesë nuk i bindet në mëkat ndaj Krijuesit. Por edhe aty ku duhet refuzuar, kjo bëhet me butësi, respekt dhe dashamirësi të vazhdueshme. Kur'ani ndalon edhe fjalën më të vogël të zemërimit: 'mos u thuaj atyre uff' (17:23).",
      "Rruga e kthimit: mëshira këtu është se prindërit zakonisht janë ende të arritshëm. Për atë që ka dështuar, pendimi është kryesisht praktik - rifilloni mirësinë, kërkoni faljen e tyre, shërbejini dhe bëni dua për ta, veçanërisht kur janë gjallë. Dhe nëse një prind ka vdekur, kujdesi vazhdon duke u lutur për ta, duke dhënë lëmoshë në emër të tyre dhe duke nderuar lidhjet dhe miqtë e tyre.",
    ],
    quran: [
      {
        excerpt:
          "Zoti yt ka vendosur që të mos adhuroni tjetër pos Tij dhe të silleni mirë ndaj prindërve. Mos u thuaj “uff” dhe as mos i refuzo, por thuaju atyre një fjalë fisnike.",
      },
      {
        excerpt: "Adhuroni Allahun dhe mos i shoqëroni Atij asgjë dhe bëni mirë prindërve.",
      },
    ],
    hadith: [
      {
        excerpt:
          "A nuk ju njoftoj për mëkatet më të mëdha? Shoqërimi i Allahut dhe mosbindja ndaj prindërve.",
      },
    ],
    actions: ["Telefononi ose vizitoni prindërit këtë javë me një fjalë të mirë."],
    appLinks: [{}],
  },
  {
    title: "Vjedhja",
    summary:
      "Marrja e pasurisë së të tjerëve në mënyrë të paligjshme - cenon besimin dhe fton dënimin.",
    body: [
      "Përkufizimi: Vjedhja (sarikah) është marrja e pasurisë ose pronës së të tjerëve pa të drejtë - qoftë me vjedhje, përvetësim, mashtrim ose ndonjë sekuestrim të fshehtë të asaj që nuk ka asnjë pretendim.",
      "Pse është e rëndë: shkel të drejtën e njerëzve dhe besimin nga i cili varet jeta e përbashkët. Serioziteti i tij nënvizohet nga dënimi i përshkruar që përmend Kur'ani për rastet kualifikuese (5:38) - një dënim i mbrojtur nga kushte të rrepta dhe standarde të larta provash, kështu që vetë ashpërsia e tij shërben kryesisht si një pengesë e fuqishme që mban pronën e njerëzve të sigurt. Qëllimi i Islamit është një shoqëri në të cilën njerëzit ndihen të sigurt me gjërat e tyre.",
      "Fytyrat e saj moderne: vjedhja nuk kufizohet vetëm me thyerjen e një shtëpie. Ai përfshin marrjen nga një punëdhënës, mashtrimin në biznes, mbajtjen e pagave të punëtorëve, piraterinë dixhitale, plagjiaturën dhe përfitimin nga ajo që nuk është e ligjshme e dikujt. Ajo që fshihet nga njerëzit e tjerë nuk i fshihet kurrë Allahut, i cili sheh çdo marrje private.",
      "Rruga e kthimit: për shkak se është e përfshirë një e drejtë njerëzore, pendimi kërkon më shumë se pendim para Allahut. Njeriu duhet t'ia kthejë vetë sendin e vjedhur, ose vlerën e tij, pronarit të tij të ligjshëm dhe të kërkojë falje aty ku është e mundur; nëse pronari nuk mund të gjendet, studiuesit këshillojnë dhënien e shumës në bamirësi në emër të tyre. I shkarkuar në këtë mënyrë, edhe vjedhja falet plotësisht nga Ai që e do shërbëtorin që kthehet.",
    ],
    quran: [
      {
        excerpt:
          "Sa i përket hajdutit, mashkullit dhe femrës, ua prenë duart si shpërblim për atë që kanë fituar, si pengesë nga Allahu.",
      },
    ],
    actions: ["Të kthejë sendet e vjedhura ose vlerën e tyre; kërkoni falje nga të padrejtët."],
    appLinks: [{}],
  },
  {
    title: "Dehëse",
    summary: "Vera dhe dehësit - të ndaluara në mënyrë progresive dhe vendimtare në Kur'an.",
    body: [
      'Përkufizimi: Khamr është çdo gjë që deh dhe mjegullon intelektin - vera dhe gjithë alkooli, dhe sipas parimit të vetë Profetit a.s., çdo substancë dehëse pavarësisht nga forma ose emri i saj. "Çdo pije dehëse është khamr dhe çdo khamr është i ndaluar."',
      "Pse është e rëndë: mendja është aftësia me të cilën njeriu e njeh Allahun, dallon të drejtën nga e gabuara dhe ruan çdo përgjegjësi tjetër. Dehësit e shpërbëjnë pikërisht atë, prandaj Kur'ani i vë në kllapa me idhuj dhe bixhoz si 'ndotje nga puna e shejtanit' dhe urdhëron 'shmangni ata' (5:90). Përtej individit, ata shkatërrojnë shëndetin, familjet dhe sigurinë dhe hapin derën e mëkateve që një person i matur nuk do t'i afrohej kurrë.",
      "Urtësia se si ishte e ndaluar: Allahu nuk e ndaloi khamrin në një goditje të vetme të papritur, por e ndaloi atë në faza, duke e larguar me butësi komunitetin e hershëm nga një zakon i rrënjosur thellë. Ky gradualitet është në vetvete një mësim për mëshirë - dhe një model shprese për këdo që lufton ta lërë atë sot.",
      "Rruga e kthimit, me dhembshuri: ata që janë kapur në varësi nuk duhet të përçmohen, por të mbështeten. Pendimi do të thotë vendosja për të lënë substancën, largimi i saj dhe shkasave të saj nga jeta, kërkimi i ndihmës dhe trajtimit pa turp dhe mbushja e zbrazëtirës me shoqëri të mirë, dhikër dhe adhurim. Dera e Allahut është e hapur, dhe çdo hap i sinqertë larg dehjes është një hap që Ai e mirëpret.",
    ],
    quran: [
      {
        excerpt:
          "O ju që besuat, me të vërtetë vera, bixhozi, idhujt dhe shigjetat e shortarit janë ndotje nga vepra e shejtanit, largohuni prej tyre.",
      },
    ],
    hadith: [
      {
        excerpt: "Çdo pije dehëse është khamr dhe çdo khamr është i ndaluar.",
      },
    ],
    actions: [
      "Kërkoni ndihmë nëse është e nevojshme; zëvendësojeni zakonin me dhikër dhe shoqëri të mirë.",
    ],
    appLinks: [{}],
  },
];

export const JAHANNAM_NAMES_SQ: DeepPartial<JahannamNameEntry>[] = [
  {
    name: "Xhahannam",
    meaning: "Zjarri - emri më i shpeshtë kuranor i Ferrit.",
    quran: {
      excerpt:
        "Kini frikë zjarrin, lëndë djegëse e të cilit janë njerëzit dhe gurët, i përgatitur për jobesimtarët.",
    },
    context:
      "Përdoret në të gjithë Kuranin si vendbanimi i ndëshkimit për ata që refuzojnë besimin dhe këmbëngulin në keqbërje.",
    tafsirNote:
      "Ibn Kethiri vëren Xhehenem është emri gjithëpërfshirës i Zjarrit i përgatitur si paralajmërim dhe pasojë.",
    scholarlyNote:
      "Disa studiues diskutojnë nëse Xhehenemi është i gjithë Ferri apo një nivel specifik – pikëpamjet ndryshojnë.",
  },
  {
    name: "Xhehemi",
    meaning: "Zjarri flakërues - nxehtësi e fortë dhe e fortë.",
    quran: {
      excerpt:
        "Ju dhe ajo që adhuroni pos Allahut jeni lëndë djegëse për Xhehenemin – do të hyni në të.",
    },
    context: "Përshkruan intensitetin e zjarrit që i pret ata që morën rivalë me Allahun.",
    tafsirNote: "El-Tabari e lidh xhahimin me zjarrin flakërues e të ndezur që nuk kursen asgjë.",
  },
  {
    name: "Saqar",
    meaning: "Ajo që përvëlon ose nuk lë asgjë - vapë e fortë.",
    quran: {
      excerpt: "Unë do ta përzë në Saqar. Dhe çfarë mund t'ju bëjë të dini se çfarë është Saqar?",
    },
    context: "Përmendet në suren el-Muddeththir në lidhje me atë që u largua nga shpallja.",
    tafsirNote:
      "Tefsiri klasik e përshkruan Sakarin si një nivel të Ferrit që digjet fort; detajet ndryshojnë mes studiuesve.",
    scholarlyNote:
      "Nëse Sakar është një nivel i veçantë apo një emër për Ferrin në përgjithësi, diskutohet në tefsir - jo e qartë në një tekst të vetëm të rënë dakord.",
  },
  {
    name: "Sa'ir",
    meaning: "Flakërues - zjarr i ndezur.",
    quran: {
      excerpt: "Ata do të jenë në Sa'ir - Zjarri flakërues.",
    },
    context: "Paralajmërim për ata që e konsumojnë pasurinë jetimë padrejtësisht.",
    tafsirNote: "Rrënja përcjell djegie dhe ndezje - duke theksuar zjarrin aktiv, konsumues.",
  },
  {
    name: "Hutamah",
    meaning: "Thërrmuesi - ajo që thyhet dhe dërrmohet.",
    quran: {
      excerpt:
        "Ai do të hidhet në el-Hutamah. Dhe çfarë mund t'ju bëjë të dini se çfarë është el-Hutamah?",
    },
    context:
      "Dënim për atë që përgojon dhe grumbullon pasuri, duke menduar se do ta bëjë të pavdekshëm.",
    tafsirNote:
      "Ibn Kethiri shpjegon se Hutamah shtyp dhe konsumon - një zjarr i ndezur nga Allahu.",
  },
  {
    name: "Hawiyah",
    meaning: "Humnera ose gropa - një rënie e thellë.",
    quran: {
      excerpt: "Sa i përket atij që ka peshoret e lehta - strehimi i tij do të jetë Havija.",
    },
    context:
      "Vendmbërritja e atyre të cilëve veprat e mira janë shumë të lehta në Ditën e Gjykimit.",
    tafsirNote:
      "I përshkruar si një gropë e thellë në zjarr; el-Tabari shënon pikëpamje mbi thellësinë dhe ashpërsinë e tij.",
    scholarlyNote:
      "Disa vepra tefsiri rendisin Hawiyah-në si një nivel specifik - citojnë si interpretim dijetar.",
  },
  {
    name: "Lazaa",
    meaning: "Flaka - zjarr flakërues.",
    quran: {
      excerpt: "Në asnjë mënyrë! Është flaka e Allahut, e ndezur.",
    },
    context: "Surja el-Ma'arij - paralajmërim i atyre që e mohojnë Kiametin.",
    tafsirNote: "Lidhur me flakën që hiqet dhe digjet - Lazaa thekson ndezjen aktive.",
  },
];

export const JAHANNAM_GATES_SQ: DeepPartial<JahannamGateEntry>[] = [
  {
    quranNote:
      "Allahu thotë se Ferri ka shtatë porta; çdo portë ka një pjesë të caktuar të atyre që hyjnë (15:44).",
    scholarlyNote:
      "Disa vepra të mëvonshme tefsir i lidhin portat me kategoritë e mëkatarëve. Këto detyra nuk janë uniforme në burimet e hershme - të pranishme si interpretim.",
  },
  {
    quranNote:
      "Kur'ani pohon shtatë porta kolektivisht; ai nuk e emërton secilën portë në zbulimin e qartë.",
    scholarlyNote: "Ibn Kethiri diskuton se ndarja është me urtësinë dhe drejtësinë e Allahut.",
  },
  {
    quranNote:
      "Shtatë porta - një fakt i qartë tekstual. Detajet e banorëve të secilës portë janë kryesisht diskutime shkencore.",
  },
  {
    quranNote: "Ajeti thekson caktimin proporcional - secila portë ka pjesën e saj të caktuar.",
  },
  {
    quranNote:
      "Besimtarët janë paralajmëruar në mënyrë që të shmangin atë që çon në këto porta përmes pendimit.",
  },
  {
    quranNote:
      "Ferri është përgatitur - paralajmërimi është i vërtetë. Mbrojtja është nëpërmjet besimit dhe veprave të drejta.",
  },
  {
    quranNote:
      "Shtatë porta, një Zjarr - uniteti i paralajmërimit me diversitetin në mënyrën se si mëkatarët grupohen nga urtësia hyjnore.",
    scholarlyNote:
      "Shmangni mësimin e hartave specifike nga mëkati në portë si fakt profetik, përveç nëse citoni një vepër të emërtuar shkencore.",
  },
];

export const JAHANNAM_VERSES_SQ: DeepPartial<JahannamVerseEntry>[] = [
  {
    excerpt: "Kini frikë zjarrin e përgatitur për jobesimtarët.",
    context: "Drejtuar besimtarëve - frika si motivim drejt bindjes.",
    tafsirSummary: "Ibn Kethiri: një thirrje për takua e shoqëruar me bindje ndaj të Dërguarit.",
  },
  {
    excerpt: "Mos e humbni shpresën nga mëshira e Allahut. Vërtet, Allahu i fal të gjitha mëkatet.",
    context:
      "Zbuluar për të ngushëlluar ata që kishin frikë se mëkatet e tyre ishin shumë të mëdha.",
    tafsirSummary: "Një varg themeli i shpresës - mëshira është e madhe për ata që kthehen prapa.",
  },
  {
    excerpt:
      "Pendohuni te Allahu me një pendim të sinqertë – ndoshta Zoti juaj do t'jua largojë veprat e këqija.",
    context: "Urdhëroni besimtarët pas udhëzimit për familjen dhe sjelljen.",
    tafsirSummary: "Nasuh teube - pendim i sinqertë pa kthim në mëkat.",
  },
  {
    excerpt: "Për të gjithë do të ketë gradë sipas asaj që ata bënë.",
    context: "Drejtësia hyjnore - shpërblimi dhe ndëshkimi në raport me veprat.",
    tafsirSummary: "Diplomat vlejnë edhe për Xhenetin edhe për Ferrin.",
  },
  {
    excerpt: "Allahu nuk u bën aspak padrejtësi njerëzve, por njerëzit i bëjnë keq vetvetes.",
    context: "Sigurimi se gjykimi hyjnor është krejtësisht i drejtë.",
  },
  {
    excerpt: "Zoti ynë, na jep të mira në të dyja botët dhe na ruaj nga dënimi i zjarrit.",
    context: "Duaja e atyre që kombinojnë të mirat e kësaj bote dhe të kësaj bote.",
    tafsirSummary: "Një lutje profetike e mësuar në Kur'an - ekuilibri i dunjasë dhe akhirahut.",
  },
  {
    excerpt: "Ferri ka shtatë porta; për çdo portë është caktuar një pjesë.",
    context: "Drejtuar në kontekstin e debatit të Ibrahimit me popullin e tij.",
    tafsirSummary: "Përmendja e qartë e shtatë portave - detajet e caktimit janë urtësi hyjnore.",
  },
  {
    excerpt:
      "Përveç atyre që pendohen, besojnë dhe bëjnë vepra të mira, Allahu e zëvendëson të keqen me të mirë.",
    context: "Përjashtim pas renditjes së mëkateve të rënda.",
    tafsirSummary: "Shpresë për të penduarit - veprat mund të shndërrohen me mëshirë.",
  },
  {
    excerpt: "Për ata që nuk besuan në Zotin e tyre është dënimi i Xhehenemit, një vend i keq.",
    context: "Surja el-Mulk - përkujtues i së padukshmes.",
  },
  {
    excerpt: "Vërtet, veprat e mira i largojnë të këqijat.",
    context: "Urdhëroni për faljen e namazit në të dy skajet e ditës.",
    tafsirSummary: "Inkurajimi që adhurimi i vazhdueshëm fshin gabimet e së shkuarës.",
  },
  {
    excerpt: "Zoti ynë, na i fal mëkatet tona dhe na ruaj nga dënimi i zjarrit.",
    context: "Përshkrimi i muttakinit (të vetëdijshëm për Zotin).",
  },
  {
    excerpt: "Sa i përket atij që ka peshoret e lehta - strehimi i tij do të jetë Havija.",
    context: "Surja el-Kari'ah - peshimi i veprave.",
  },
];

export const JAHANNAM_HADITH_SQ: DeepPartial<JahannamHadithEntry>[] = [
  {
    hadith: {
      excerpt:
        "Kush i kërkon Allahut Xhenetin tri herë, Xheneti i thotë: O Allah, fute atë në Xhenet. Kush kërkon strehim nga zjarri tri herë, zjarri thotë: O Allah, ruaje atë nga zjarri.",
    },
    context: "Nxitje për të bërë dua të rregullta për Xhenetin dhe strehim nga Xhehenemi.",
  },
  {
    hadith: {
      excerpt:
        "Allahu është më i kënaqur me pendimin e robit të Tij se ai prej jush që e gjen malin e humbur në një tokë djerrë.",
    },
  },
  {
    hadith: {
      excerpt:
        "Askush prej jush nuk do të hyjë në Xhenet vetëm me veprat e tij, madje as unë, përveç nëse Allahu më mbulon me mëshirën e Tij.",
    },
    context: "Bilanci: përpiquni në vepra por mbështetuni në mëshirë.",
  },
  {
    hadith: {
      excerpt:
        "Zjarri juaj është një pjesë e shtatëdhjetë pjesëve të zjarrit të Xhehenemit, secila pjesë është si nxehtësia e tij.",
    },
  },
  {
    hadith: {
      excerpt: "Besëlidhja mes nesh dhe atyre është namazi; kush e braktis atë ka bërë kufër.",
    },
    context: "Ashpërsia e neglizhencës së namazit - ndër paralajmërimet më të rënda.",
  },
  {
    hadith: {
      excerpt:
        "I falimentuari vjen me namaz, agjërim dhe sadaka - por ai fyen, shpif, konsumoi pasuri në mënyrë të paligjshme dhe derdhi gjak.",
    },
    context: "Të drejtat e njerëzve mund të zgjidhen para veprave në Ditën e Gjykimit.",
  },
  {
    hadith: {
      excerpt:
        "Allahu e shtrin dorën e Tij natën për të pranuar pendimin e mëkatarit të ditës dhe zgjat dorën e Tij gjatë ditës për të pranuar pendimin e mëkatarit të natës.",
    },
  },
  {
    hadith: {
      excerpt: "Kush beson Allahun dhe Ditën e Fundit, le të flasë mirë ose le të heshtë.",
    },
    context: "Ruajtja e gjuhës - përgjegjësi e përditshme.",
  },
];

export const JAHANNAM_REFLECTIONS_SQ: DeepPartial<JahannamReflectionEntry>[] = [
  {
    question: "A i kam bërë keq dikujt sot – në të folur, me veprim apo me neglizhencë?",
  },
  {
    question: "A kam kërkuar falje nga Allahu sot – sinqerisht dhe vazhdimisht?",
  },
  {
    question: "A e ruajta gjuhën time nga përgojimi, gënjeshtra dhe tallja?",
  },
  {
    question: "A jam falur me kohë dhe me prezencë?",
  },
  {
    question: "A kam bërë ndonjë hap për t'u pajtuar me dikë që kam ndarë?",
  },
  {
    question: "A kam dhënë bamirësi apo mirësi sot – qoftë edhe diçka të vogël?",
  },
  {
    question: "A kam lexuar apo dëgjuar Kur'an sot?",
  },
];

export const JAHANNAM_REFERENCES_SQ: DeepPartial<JahannamReferenceEntry>[] = [
  {
    title: "Kurani",
    note: "Burimi kryesor për emrat, paralajmërimet, mëshirën dhe pendimin. Përkthimet ndryshojnë; konsultohuni me gjuhën arabe për saktësi.",
  },
  {
    title: "Sahih el-Buhari & Sahih Mysliman",
    note: "Përmbledhjet kanonike të haditheve të cituara në të gjithë këtë modul kanë vlerësuar sahih.",
  },
  {
    title: "Tefsir Ibn Kethiri",
    note: "Referohet për kontekstin mbi emrat e Ferrit dhe vargjet kryesore paralajmëruese - interpretim shkencor.",
  },
  {
    title: "Tefsir el-Tabari",
    note: "Tefsir i hershëm gjithëpërfshirës — i dobishëm për të kuptuar pikëpamjet klasike mbi Xhehenemin.",
  },
  {
    title: "Aty ku studiuesit ndryshojnë",
    note: "Nivelet e sakta të Ferrit, caktimet e portave dhe disa kuptime të emrave diskutohen midis studiuesve - jo gjithmonë të qarta në zbulesë.",
  },
];

export const JAHANNAM_DUAS_SQ: DeepPartial<JahannamDuaEntry>[] = [
  {
    context: "Kërkoni të mira në të dy botët dhe mbrojtje nga Zjarri - dua Kur'anore.",
  },
  {
    context: "Pas teshehudit: kërkoni Xhenetin dhe strehimin nga zjarri.",
  },
  {
    context: "Përkujtimi i mëngjesit: strehim nga dënimi i varrit dhe zjarrit.",
  },
];

export const JAHANNAM_REFUGE_DUA_SQ: { translation: string } = {
  translation:
    "O Allah, kërkoj mbrojtje te Ti nga dënimi i Xhehenemit, nga dënimi i varrit, nga sprovat e jetës dhe të vdekjes dhe nga sprova e keqe e Mesihut të rremë.",
};
