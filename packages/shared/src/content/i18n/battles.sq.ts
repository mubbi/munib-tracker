// Albanian translation overlay for the Learn Battles content. Mirrors the order of
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

export const BATTLES_TOPICS_SQ: DeepPartial<BattlesTopic>[] = [
  {
    title: "Hyrje",
    summary: "Sfondi historik, persekutimi, hixhra dhe kur luftimet lejoheshin.",
    body: [
      'Për trembëdhjetë vitet e para të shpalljes në Mekë, muslimanët u urdhëruan të duronin persekutimin me durim - nuk u dha leje për të luftuar. Kur sahabët kërkuan të mbroheshin, përgjigjja ishte: "Mbajini duart, falni namazin dhe jepni zekatin" (Kur\'an 4:77). Komuniteti i hershëm iu përgjigj shtypjes me vendosmëri, migrim dhe lutje, jo me rebelim të armatosur.',
      "Hixhra në Medine (622 e.s. / 1 ​​hixhri) ndryshoi situatën e komunitetit, jo parimet e tij. Në Jethrib, muslimanët u bënë një shoqëri e vendosur e lidhur me Kushtetutën e Medinës – një besëlidhje e shkruar e mbrojtjes dhe bashkëjetesës reciproke me fiset hebreje të qytetit. Profeti ﷺ tani ishte kreu i një shteti që mund të sulmohej dhe për këtë arsye mund të mbrohej ligjërisht.",
      'Vetëm atëherë, pas vitesh shtypjeje, zbriti leja e parë për të luftuar – dhe arsyeja e deklaruar e saj ishte se besimtarët ishin bërë padrejtësi dhe dëbuar nga shtëpitë e tyre për shkak se thanë "Zoti ynë është Allahu" (Kur\'an 22:39-40). Leja ishte për mbrojtjen dhe mbrojtjen e lirisë fetare - i njëjti varg emërton sigurinë e "manastireve, kishave, sinagogave dhe xhamive" siç ruan këto luftime - jo për pushtim, konvertim të detyruar ose plaçkitje.',
      "Kur'ani caktoi një kufi të përhershëm rreth kësaj leje: \"Luftoni në rrugën e Allahut ata që ju luftojnë, por mos e teproni\" (Kur'an 2:190). Lufta ishte e lidhur me agresionin kundër komunitetit dhe nuk duhej të kalonte kurrë kufijtë e drejtësisë.",
      "Këto fushata janë histori: ato ndodhën në një kontekst specifik arab të shekullit të shtatë të luftës fisnore, traktateve të prishura dhe rrethimit. Mësimet e përgjithshme islame mbi paqen, drejtësinë, mëshirën dhe fqinjësinë janë korniza; të dhënat e këtyre betejave duhet të lexohen brenda kësaj kornize, jo të shemben në slogane të shkëputura prej saj.",
    ],
    quran: [
      {
        excerpt:
          "Leje u jepet atyre që luftuan për shkak se u është bërë e padrejtë - dhe Allahu me të vërtetë ka mundësi t'u japë atyre fitore - atyre që janë dëbuar pa të drejtë nga shtëpitë e tyre, vetëm pse thanë: Zoti ynë është Allahu. Sikur Allahu të mos i kishte zmbrapsur disa njerëz me anë të të tjerëve, manastiret, kishat, sinagogat dhe xhamitë – në të cilat përmendet shumë emri i Allahut – me siguri do të ishin rrënuar.",
      },
      {
        excerpt:
          "Luftoni në rrugën e Allahut ata që ju luftojnë, por mos e teproni. Vërtet, Allahu nuk i do shkelësit.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Pse ndodhën betejat",
    summary: "Persekutimi, shkeljet e traktateve dhe mbrojtja e komunitetit - jo agresion.",
    body: [
      "Konteksti dhe shkaku i këtyre betejave ishte një fushatë e qëndrueshme armiqësie, jo një oreks mysliman për luftë. Në Mekë, kurejshët kishin torturuar të dobëtit, kishin bojkotuar të gjithë fisin deri në skaj të urisë, kishin marrë pronën e lënë pas nga emigrantët dhe madje kishin komplotuar për të vrarë Profetin ﷺ. Migrimi në Medine nuk i dha fund kërcënimit; e zhvendosi atë.",
      "Bedri (2 hixhri) doli nga ai konflikt i pazgjidhur. Kur erdhi lajmi se një karvan i madh kurejshësh - që mbante pasuri të marrë nga mërgimtarët - po kthehej nga Siria, Profeti a.s. u nis për ta kapur atë. Karvani u arratis, por kurejshët kishin mbledhur tashmë një ushtri prej rreth një mijë dhe marshuan gjithsesi, të vendosur për të shtypur komunitetin e ri me forcë. Beteja e ngritur në puset e Bedrit ishte rezultati.",
      "Në Medine, mbijetesa varej nga traktatet dhe marrëveshjet u thyen vazhdimisht. Fraksionet që kishin premtuar mbrojtje të ndërsjellë sipas besëlidhjes së qytetit në vend të kësaj komplotuan me armikun - Konfederatat që rrethuan Medinën në Hendekun (5 Hixhri) u mblodhën pikërisht për të eliminuar plotësisht muslimanët.",
      "Shkeljet e traktatit mbetën vendimtare deri në fund. Ishin aleatët e Kurejshëve që sulmuan aleatët e muslimanëve, Benu Khuza'ah, ata që anuluan Traktatin e Hudejbijes dhe çuan – në mënyrë të jashtëzakonshme – në hapjen pothuajse pa gjak të Mekës dhe jo në një masakër.",
      "Përgjatë gjithë kësaj, objektivat ishin të qëndrueshme: të mbronin jetën dhe fenë, të mbronin të pambrojturit dhe të vendosnin siguri të mjaftueshme që teuhidi të mund të praktikohej pa persekutim. Qëllimi nuk ishte kurrë zgjerimi i pafund për hir të tij dhe burimet shënojnë se Profeti ﷺ preferonte armëpushim dhe traktat sa herë që armiku anonte drejt paqes.",
    ],
    hadith: [
      {
        excerpt:
          'Jam urdhëruar të luftoj njerëzit derisa të dëshmojnë se nuk ka zot tjetër përveç Allahut dhe se Muhamedi është i Dërguari i Allahut, ta falin namazin dhe të japin zekatin. Nëse ata veprojnë kështu, jeta dhe pasuria e tyre mbrohen nga unë, përveçse me të drejtën e Islamit, dhe llogaria e tyre është te Allahu. — Studiuesit klasikë e lexojnë "njerëzit" si idhujtarë të veçantë të Arabisë, që më pas bëjnë luftë kundër Islamit pasi u kishte arritur mesazhi; është një deklaratë për ata luftëtarë armiqësor, jo një leje për të sulmuar jomuslimanët paqësorë apo për të detyruar besimin, të cilin Kurani 2:256 e ndalon plotësisht.',
      },
    ],
    quran: [
      {
        excerpt: "Nuk ka detyrim në fe. Rruga e duhur është bërë e dallueshme nga gabimi.",
      },
    ],
    disclaimer:
      "Hadithi i mësipërm citohet shpesh i zhveshur nga vendosja e tij. Dijetarët klasikë e vendosën atë brenda armiqësive specifike të kohës së saj dhe krahas ndalimit kuranor të detyrimit në fe (2:256) dhe kufirit që lufta është vetëm kundër atyre që ju luftojnë (2:190).",
    appLinks: [{}],
  },
  {
    title: "Etika e luftës në Islami",
    summary:
      "Asnjë agresion, mbrojtje e rreptë e civilëve dhe sjellje njerëzore - të bazuara në Kur'an dhe Sunet.",
    body: [
      "Ligji islamik i luftës (siyar) u rrit drejtpërdrejt jashtë kufijve Kur'anorë dhe praktikës së Profetit. Themeli i tij është një rregull i vetëm që rregullon çdo gjë tjetër: \"Luftoni ata që ju luftojnë, por mos e teproni\" (Kur'an 2:190). Lufta është një përgjigje ndaj agresionit, e kufizuar nga drejtësia, dhe ajo duhet të ndalet në momentin që armiku ndalon.",
      "Jo-luftëtarët mbrohen rreptësisht. Kur u gjet një grua e vrarë pas një ekspedite, Profeti ﷺ ndaloi vrasjen e grave dhe fëmijëve. Juristët e shtrinë këtë te të moshuarit, te murgjit dhe adhuruesit e izoluar në qelitë e tyre, te punëtorët e fermave dhe punëtorët me qira, dhe te këdo që nuk merr pjesë në luftime. Vrasja e tyre nuk është një teprim i lejuar - është e ndaluar.",
      "Edhe kundër luftëtarëve aktivë, pika ishte ftesa para shpatës. Kur Profeti ﷺ caktoi një komandant, ai e udhëzoi atë që së pari të thërriste palën tjetër në Islami, pastaj - nëse refuzohej - në një zgjidhje paqeje dhe vetëm të luftonte nëse të dy refuzoheshin, dhe kurrë të mos e thyente besimin, të gjymtonte një trup ose të vriste një fëmijë (Sahih Mysliman 1731).",
      'Tradhtia është kategorikisht e ndaluar: traktatet duhet të respektohen deri në afatin e tyre dhe armikut duhet t\'i jepet një paralajmërim i drejtë në vend që të tradhtohet. Leja e fushëbetejës se "lufta është mashtrim" i referohet vetëm mashtrimit taktik - shakave, befasisë, keqdrejtimit - asnjëherë thyerjes së një besëlidhjeje ose gënjeshtrës ndaj një pale të mbrojtur.',
      "Prona dhe vetë toka janë të mbrojtura. Udhëzimet e përgjithshme ndalonin prerjen e pakujdesshme të pemëve frutore, djegien e të mbjellave dhe therjen e bagëtive jashtë nevojës. Të burgosurit duhej të ushqeheshin ashtu siç hanin robëruesit dhe të visheshin siç visheshin; Kurani lavdëron ata që ushqejnë robërit për dashurinë e Allahut (76:8), dhe shumë u liruan me shpërblim, shkëmbim ose mëshirë të thjeshtë - disa në Bedr në këmbim të mësimit të muslimanëve për të lexuar.",
      "Këto janë mësimet normative të fesë. Individët muslimanë përgjatë historisë që i shkelën ata po shkelnin Islamin, nuk e përkufizonin atë – ashtu si shkeljet nga pasuesit e çdo besimi nuk e rishkruajnë atë që urdhëron ai besim.",
    ],
    quran: [
      {
        excerpt: "Luftoni në rrugën e Allahut ata që ju luftojnë, por mos e teproni.",
      },
      {
        excerpt:
          "E nëse ata anojnë kah paqja, atëherë anoni edhe tek ajo dhe mbështetuni tek Allahu. Vërtet, Ai është që dëgjon dhe di.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ibn Omeri transmeton se një grua u gjet e vrarë në një nga ekspeditat e të Dërguarit të Allahut ﷺ, kështu që ai ndaloi vrasjen e grave dhe fëmijëve.",
      },
      {
        excerpt:
          "Kur Profeti ﷺ caktoi një komandant të një ushtrie, ai e urdhëroi atë: Luftoni në emër të Allahut… mos përvetësoni plaçkën, mos e thyeni zotimin tuaj, mos gjymtoni dhe mos vrisni një fëmijë. Kur ta takoni armikun, fillimisht ftoni ata në Islami; nëse refuzojnë, ofrojini paqe; vetëm nëse i refuzojnë të dyja, atëherë luftoni.",
      },
      {
        excerpt:
          "Mos vrisni një plak të dëshpëruar, as një fëmijë të vogël, as një grua. - Disa zinxhirë të këtij formulimi të saktë vlerësohen të dobëta, por vendimi që ai thotë konfirmohet nga transmetimi sahih i mësipërm dhe nga konsensusi i juristëve.",
      },
    ],
    actions: [
      "Dalloni qartë midis asaj që urdhëron Islami dhe asaj që ka bërë në të vërtetë çdo ushtri në histori.",
      "Lexoni këtë seksion të etikës përpara çdo narrative beteje – historia pa parimet e saj qeverisëse fton keqkuptime.",
      "Kur një burim regjistron një akt që duket se bie në kundërshtim me këto rregulla, pyesni për kontekstin dhe vërtetësinë e tij përpara se të nxirrni përfundime.",
    ],
    appLinks: [{}],
  },
  {
    title: "Beteja e Bedrit",
    summary: "17 Ramazani 2 Hixhri - beteja e parë e madhe, Dita e Kriterit.",
    body: [
      "Konteksti dhe shkaku: Pas hixhretit, kurejshët kishin pushtuar shtëpitë dhe pasurinë e emigrantëve që lanë në Mekë dhe vazhduan kërcënimet e tyre. Kur lajmi arriti në Medine se Ebu Sufjani po udhëhiqte një karvan të pasur nga Siria, Profeti (a.s.) u nis me një forcë të lehtë - afërsisht 313 burra - duke pritur për të kapur pronën, jo për të luftuar një luftë.",
      "Çfarë ndodhi: Ebu Sufjani rrëshqiti përgjatë bregut, por ai tashmë kishte dërguar në Mekë për ndihmë, dhe kurejshët marshuan me rreth një mijë luftëtarë, kalorës dhe furnizime, të vendosur për të bërë një shembull të muslimanëve. Beteja u bë e pashmangshme në puset e Bedrit, ku - me këshillën e el-Hubab ibn al-Mundhir - muslimanët kapën fillimisht ujin, duke ia mohuar atë armikut.",
      'Atë natë Pejgamberi ﷺ qëndroi në namaz deri në agim. Duke u përballur me një ushtri tri herë të tijën, ai ngriti duart dhe iu lut Zotit të tij me aq zell, sa i rrëshqiti manteli nga supet, duke thënë: "O Allah, nëse kjo bandë besimtarësh shkatërrohet, nuk do të adhuroheni në tokë". Kurani shënon se Allahu u përgjigj me përforcim nga engjëjt dhe hodhi qetësinë në zemrat e besimtarëve.',
      "Pas një lufte të vetme midis tre kampionëve nga secila anë, ushtritë u përleshën. Kurejshët u thyen. Rreth shtatëdhjetë nga udhëheqësit e tyre u vranë - mes tyre Ebu Xhehli, persekutuesi më i egër i komunitetit - dhe rreth shtatëdhjetë u zunë rob; ranë dëshmor katërmbëdhjetë muslimanë. Të burgosurit u trajtuan me dinjitet dhe disa e blenë lirinë e tyre duke i mësuar fëmijët muslimanë të lexojnë dhe të shkruajnë.",
      "Figurat kyçe: përkrah Profetit ﷺ qëndronin Ebu Bekri, Omeri, Aliu dhe xhaxhai i tij Hamza; këshilla e el-Hubabit për puset dhe e Sa'd ibn Muadhit për strategjinë tregon udhëheqje përmes konsultimit edhe kur ishte premtuar fitorja.",
      "Kurani e quan këtë ditë yawm al-furkan - Dita e Kriterit - sepse dallonte të vërtetën nga e pavërteta para gjithë gadishullit. Mësimi i tij i qëndrueshëm është se përpjekjet e sinqerta dhe përgatitja e plotë duhet të bashkohen me mbështetjen e plotë në Allahun: besimtarët rregulluan radhët e tyre, zgjodhën terrenin e tyre dhe bënë dua, dhe fitorja iu besua Allahut, jo numrit të tyre.",
    ],
    battleDetails: {
      location: "Puset e Bedrit, në jugperëndim të Medinës",
      modernLocation: "Pranë Badrit modern, Arabia Saudite",
      hijriDate: "17 Ramazan 2 H",
      muslimForces: "~ 313 luftëtarë, me pak kuaj dhe deve (raportet ndryshojnë pak)",
      opposingForces: "~ 1000 kurejshë, më mirë të armatosur dhe të montuar",
      muslimCommander: "Profeti Muhamed ﷺ",
      opposingCommander: "Amr ibn Hisham (Ebu Xhehl), i vrarë në betejë",
      weather: "Shiu një natë më parë ua forcoi rërën muslimanëve; qasja në ujë ishte vendimtare",
      outcome: "Fitore vendimtare muslimane",
      keyEvents: [
        "Al-Hubab ibn al-Mundhir këshilloi fillimisht kampingun te puset, duke kontrolluar ujin.",
        "Pejgamberi ﷺ u lut gjatë gjithë natës, duke iu lutur Allahut për besimtarët më të shumtë.",
        "Tre kampionët e Kurejshëve u takuan nga Hamza, Aliu dhe Ubejde në një betejë të vetme.",
        "Allahu i përforcoi besimtarët me engjëj (Kur'an 8:9) dhe rrëzoi udhëheqësit kryesorë kurejsh.",
        "Rreth 70 prej armikut u vranë dhe 70 u kapën; robërit trajtoheshin në mënyrë njerëzore.",
      ],
      leadershipLesson:
        "Përgatituni mirë, konsultohuni me dijetarët, pastaj mbështetuni plotësisht tek Allahu.",
      spiritualLesson:
        "Një grup i vogël i sinqertë me mbështetje hyjnore mund të përmbysë mosmarrëveshjet e kësaj bote - fitorja është nga Allahu.",
      facts: [
        "Bedri përmendet dhe përshkruhet në Kur'an më shumë se çdo fejesë tjetër e vetme (Sure El-Enfal).",
        "Disa robër u liruan në këmbim të mësimit të shkrim-leximit për fëmijët e Medinës.",
      ],
    },
    quran: [
      {
        excerpt:
          "Kur ju kërkoni ndihmë nga Zoti juaj dhe Ai ju përgjigj: Unë do t'ju përforcoj me një mijë engjëj, të cilët do të pasojnë njëri-tjetrin.",
      },
      {
        excerpt:
          "Tashmë kishte një shenjë për ju në dy ushtritë që u takuan: njëra që luftonte në rrugën e Allahut dhe tjetra e jobesimtarëve.",
      },
      {
        excerpt:
          "Ju nuk i vratë ata, por ishte Allahu që i vrau. Dhe ju nuk hodhët kur hodhët, por ishte Allahu që hodhi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Omeri transmeton se në ditën e Bedrit, Profeti sal-lAllahu alejhi ue sel-lem e shikoi armikun e njëmijë, ndërsa shokët e tij ishin pak më shumë se treqind, pastaj u kthye nga kibla, zgjati duart dhe iu lut Zotit të tij: O Allah, plotëso atë që më premtove. O Allah, nëse kjo bandë besimtarësh shkatërrohet, Ti nuk do të adhurohesh në tokë. Ai vazhdoi të lutej derisa i ra rrobja nga supet dhe Ebu Bekri e ndërroi dhe tha: Mjaft, o Pejgamber i Allahut – Allahu do ta përmbushë atë që të premtoi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Beteja e Uhudit",
    summary: "Shevali 3 Hixhri - një mësim i kushtueshëm në bindje, disiplinë dhe qëndrueshmëri.",
    body: [
      "Konteksti dhe shkaku: Një vit pas Bedrit, kurejshët u kthyen për t'u hakmarrë për të vdekurit e tyre, duke mbledhur rreth 3000 luftëtarë - me kalorës të udhëhequr nga Khalid ibn al-Velid, atëherë ende armik, dhe gra që i nxisnin burrat me daulle dhe elegji. Muslimanët, rreth 700 pasi disa u tërhoqën, zunë pozicion me malin Uhud në shpinë.",
      'Çfarë ndodhi: Profeti ﷺ vendosi pesëdhjetë shigjetarë në një kodër që ruanin pjesën e pasme të zbuluar të ushtrisë dhe u dha atyre një urdhër që ai përsëriti për theksim: "Mos e lini këtë pozicion edhe nëse shihni se po na rrëmbejnë zogjtë, derisa t\'ju dërgoj". Në fillim plani funksionoi në mënyrë të përsosur - muslimanët i larguan kurejshët dhe armiku filloi të ikte.',
      "Duke parë armikun të shpërndarë dhe plaçkën e hapur, shumica e harkëtarëve braktisën kodrën kundër urdhrit, të sigurt se beteja ishte fituar. Khalid ibn al-Velidi e kapi momentin, kaloi kalorësinë e tij nëpër hendekun e pambrojtur dhe i goditi muslimanët nga pas. Rendi u shemb në kaos.",
      'Shifrat kryesore dhe kostoja: Hamza ibn Abd al-Muttalib, "Luani i Allahut", u martirizua, së bashku me rreth shtatëdhjetë shokë. Vetë Pejgamberi ﷺ u plagos – dhëmbi i thyer dhe fytyra e prerë – dhe një thashetheme u përhap në fushë se ai ishte vrarë. Kur besimtarët e panë se ai ishte gjallë, u mblodhën drejt tij në shpatin e malit dhe kurejshët, duke mos mundur t\'i mbaronin ato, u tërhoqën.',
      'Kurani e trajton këtë ditë gjerësisht në suren Al Imran, duke e ngarkuar përgjegjësinë mbi mosbindjen e disave, jo mbi ndonjë dështim të besimit apo premtimit të Allahut: "Allahu me siguri e kishte përmbushur premtimin e Tij ndaj jush... derisa e humbët guximin, u grindët mbi urdhrin dhe nuk iu binde pasi Ai ju tregoi atë që doni" (3:152). Megjithatë, i njëjti pasazh ngushëllon komunitetin e plagosur dhe ndalon dëshpërimin.',
      "Prandaj, Uhudi nuk është një humbje e Islamit, por një mësim i ruajtur: fitorja e dhënë më parë u tërhoq në momentin që disiplina u prish, urdhrat e qarta kanë rëndësi po aq sa guximi dhe sprovat përsosin një komunitet – për ata që pendohen dhe qëndrojnë të patundur, prapambetja bëhet baza e rritjes.",
    ],
    battleDetails: {
      location: "Shpatet e malit Uhud, në veri të Medinës",
      modernLocation: "Uhud, rajoni i Medinës, Arabia Saudite",
      hijriDate: "Shevali 3 hixhri",
      muslimForces: "~ 700 (pasi disa u tërhoqën para betejës)",
      opposingForces: "~ 3000 Kurejshët dhe aleatët, me kalorës",
      muslimCommander: "Profeti Muhamed ﷺ",
      opposingCommander: "Ebu Sufjan ibn Harb; Khalid ibn al-Velid udhëhoqi kalorësinë e krahut",
      outcome: "Përparësia e fushës taktike kurejshitëve; komuniteti mysliman mbijeton i paprekur",
      keyEvents: [
        "Profeti ﷺ vendosi 50 shigjetarë në një kodër me urdhër të rreptë që të mos largoheshin kurrë nga ajo.",
        "Myslimanët thyen vijën e armikut, por shumica e shigjetarëve u larguan nga posti i tyre për të mbledhur plaçkë.",
        "Kalorësia e Halid ibn al-Velidit e shfrytëzoi hendekun dhe goditi nga pas.",
        "Hamza dhe rreth 70 shokë ranë shehid; Profeti ﷺ u plagos.",
        "U përhap një thashethem i rremë për vdekjen e Profetit; besimtarët u mblodhën kur e panë të gjallë.",
      ],
      leadershipLesson:
        "Urdhrat e qarta dhe ekzekutimi i disiplinuar kanë rëndësi po aq sa trimëria; braktisja e postimit tuaj mund të zhbëjë një fitore.",
      spiritualLesson:
        "Sprovat i rafinojnë besimtarët; pengesa e shoqëruar me pendim dhe qëndrueshmëri çon në rritje.",
    },
    quran: [
      {
        excerpt:
          "Allahu me siguri e kishte përmbushur premtimin e Tij ndaj jush kur po i vrisnit me lejen e Tij - derisa e humbët guximin, u grindët mbi urdhrin dhe nuk iu binde pasi Ai ju tregoi atë që e doni.",
      },
      {
        excerpt:
          "Pra, mos u dobësoni dhe mos u pikëlloni, sepse do të jeni më të lartë nëse jeni besimtarë të vërtetë.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Pejgamberi salAllahu alejhi ue selem e caktoi Abdullah ibn Xhubejrin mbi pesëdhjetë harkëtarët në ditën e Uhudit dhe tha: Mbajeni pozicionin tuaj; edhe sikur të shihni se na rrëmbejnë zogjtë, mos e lini derisa t'ju dërgoj - dhe edhe nëse shihni se ne i mposhtim ata, mos u largoni derisa t'ju dërgoj unë. Kur armiku u shpartallua dhe harkëtarët panë plaçkën, thanë: \"Plaçka!\" dhe u larguan nga posti i tyre - kështu që shtatëdhjetë prej nesh u vranë.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Beteja e Hendekut",
    summary:
      "Shevali 5 Hixhri - Konfederatat rrethojnë Medinën; një llogore dhe një erë i thyejnë.",
    body: [
      "Konteksti dhe shkaku: I quajtur gjithashtu Ghazwat al-Ahzab (Beteja e Konfederatëve), kjo ishte përpjekja më e madhe e armikut për të shkatërruar Islamin një herë e përgjithmonë. Krerët e Benu Nadirit, të dëbuar më herët për tradhti, hipën në Mekë dhe në Ghatafan dhe mblodhën një koalicion - Kurejshët, Ghatafanët dhe fiset e tjera - që llogaritet në mes 10,000 dhe 24,000 burra. Myslimanët ishin rreth 3000 dhe rreziku ishte ekzistencial.",
      "Çfarë ndodhi: Duke u përballur me një rrethim që asnjë qytet arab nuk mund të përballonte në betejë të hapur, Profeti ﷺ u konsultua me shokët e tij. Salman al-Farisi propozoi një taktikë persiane të panjohur për luftën arabe – duke gërmuar një llogore të thellë përgjatë afrimit të ekspozuar verior, e vetmja anë që nuk mbrohet nga fusha llave, pemishte ose shtëpi të fortifikuara. Besimtarët gërmuan për ditë të tëra në të ftohtë të ashpër dhe uri, Profeti a.s. mbante dheun në shpinë dhe ia lidhi një gur në bark kundër dhembjeve të agjërimit.",
      "Hendeku funksionoi. Kur ushtria e madhe mbërriti, e gjeti veten të paaftë për të kaluar; disa kalorës që e hodhën atë u dëbuan prapa. Rrethimi u vendos në afërsisht dy deri në katër javë të ftohtë, tensioni dhe përleshjeje dhe jo në një betejë të ashpër.",
      "Komuniteti u testua deri në thelbin e tij. Hipokritët bënin justifikime dhe kërkonin të largoheshin; fisi Benu Kurejza brenda qytetit u lëkund ndaj armikut; Kurani përshkruan zemrat që arrijnë deri në fyt. Prapëseprapë, besimtarët u mbajtën dhe Nu'ajm ibn Mes'udi - i sapomyslimanuar në fshehtësi - mbolli mosbesim midis fraksioneve konfederative derisa ata u kthyen kundër njëri-tjetrit.",
      "Pastaj erdhi lehtësimi nga Allahu, jo nga shpatat. Një erë e fortë, e ngrirë përshkoi kampin e armikut, duke përmbysur zjarret dhe tendat e gatimit dhe ushtritë e padukshme i mbushën me tmerr. Koalicioni, tashmë i thyer dhe me pak furnizime, u shpërtheu dhe u tërhoq gjatë natës. Profeti ﷺ tha më pas se vetëm Allahu i kishte mundur Konfederatat.",
      "Mësime të qëndrueshme: këshilla e shëndoshë duhet të miratohet kudo nga vjen - këtu nga një persian i konvertuar; mjetet duhet të merren në kufirin e tyre - hendeku i hapur, gradat e mbajtura; dhe pastaj përfundimi i besohet Allahut, i cili mund ta kthejë prapa një ushtri me erë. Surja el-Ahzab ruan të gjithë sprovën dhe lehtësimin e saj.",
    ],
    battleDetails: {
      location: "Veriu afrohet me Medine",
      modernLocation: "Medine, Arabia Saudite",
      hijriDate: "Shevali 5 hixhri",
      muslimForces: "~ 3000",
      opposingForces: "Koalicioni konfederativ (~ 10,000–24,000; shifrat ndryshojnë në burime)",
      muslimCommander: "Profeti Muhamed ﷺ",
      opposingCommander:
        "Ebu Sufjani duke udhëhequr kurejshët; krerët aleatë të Ghatafanit dhe të tjerë",
      weather: "Ftohtë e hidhur gjatë gërmimit; një erë e fortë hyjnore i dha fund rrethimit",
      outcome: "Fitorja e muslimanëve pa një betejë të ashpër; koalicioni shpërndahet",
      keyEvents: [
        "Salman al-Farisi propozoi hapjen e një llogore përgjatë korridorit verior të cenueshëm.",
        "Pejgamberi ﷺ ndau punën, duke mbajtur dhe dhe duke lidhur një gur kundër urisë.",
        "Hendeku ndaloi ushtrinë e madhe, duke detyruar një rrethim në vend të betejës së hapur.",
        "Nu'ajm ibn Mes'udi mbolli mosmarrëveshje që përçau aleatët konfederatë.",
        "Një erë e ngrirë dhe ushtri të padukshme (Kur'an 33:9) shkatërruan kampin e armikut; ata u tërhoqën.",
      ],
      leadershipLesson:
        "Konsultohuni gjerësisht dhe adoptoni ide të mira pavarësisht nga origjina e tyre; Ndani vetë vështirësitë e komunitetit.",
      spiritualLesson:
        "Qëndroni të patundur nën rrethim dhe ia besoni rezultatin Allahut, i cili mund të kthejë prapa një ushtri me erë.",
    },
    quran: [
      {
        excerpt:
          "O ju që besuat, kujtoni dhuntinë e Allahut ndaj jush kur ju erdhën ushtri dhe Ne dërguam kundër tyre një erë dhe ushtri që nuk i shihnit… Aty besimtarët u sprovuan dhe u tronditën me një tronditje të fortë.",
      },
      {
        excerpt:
          "E kur besimtarët i panë konfederatat, thanë: “Kjo është ajo që na premtoi Allahu dhe i Dërguari i Tij – dhe kjo vetëm ua shtoi besimin dhe nënshtrimin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Pejgamberi ﷺ u lut kundër konfederatëve në ditën e el-Ahzabit, duke thënë: O Allah, shpallës i librit, i shpejtë në llogari - mposhti konfederatat. O Allah, mundi ata dhe tundi ata.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Benu Kurejzeh",
    summary:
      "5 Hixhri - një traktat i tradhtuar gjatë rrethimit; gjykimi nga një arbitër i rënë dakord.",
    body: [
      "Konteksti dhe shkaku: Benu Kurejza ishin një fis çifut i Medinës i lidhur me muslimanët me marrëveshjen e qytetit për mbrojtjen e ndërsjellë. Në kulmin e Hendekut, kur Konfederatat rrethuan Medinën dhe mbijetesa e komunitetit varej nga një fije, prijësi i Benu Nadir i bindi krerët e Kurejzes që ta prishnin atë besëlidhje dhe të hapnin një front të dytë nga brenda qytetit. Në atë moment, kjo nuk ishte një mosmarrëveshje private, por tradhti gjatë një rrethimi që mund të kishte shkatërruar të gjithë në Medine.",
      "Çfarë ndodhi: Pasi konfederatat u tërhoqën, Profeti a.s lëvizi kundër Benu Kurejzes, të cilët u mbyllën në kështjellat e tyre. Rrethimi zgjati rreth njëzet e pesë ditë derisa ata ranë dakord të dorëzoheshin - por ata kërkuan që për fatin e tyre të mos vendosej drejtpërdrejt nga Profeti ﷺ, por nga një arbitër që ata vetë zgjodhën: Sa'd ibn Muadh, prijësi i Aws, aleatët e tyre të gjatë.",
      "Gjykimi: Sa'di - vetë që po vdiste nga një plagë e marrë në llogore - vendosi që luftëtarët që kishin kryer tradhtinë të ekzekutoheshin dhe gratë dhe fëmijët të merreshin si robër, një vendim i rëndë nga çdo standard, por në përputhje me ligjin e luftës së asaj kohe dhe vendi për tradhti nën rrethim. Profeti ﷺ tha se Sa'di kishte gjykuar në përputhje me gjykimin e Allahut.",
      "Si ta lexoni me kujdes: Ky ishte një ndëshkim për një akt specifik të tradhtisë gjatë kohës së luftës nga luftëtarët që thyen një pakt mbrojtës në orën më të cenueshme të komunitetit – jo një vendim kundër një populli për besimin e tyre dhe në mënyrë të prerë jo një model për mënyrën sesi muslimanët duhet t'i trajtojnë hebrenjtë ose ndonjë komunitet fetar. Kur'ani dhe Suneti urdhërojnë drejtësi dhe trajtim të mirë ndaj jomuslimanëve paqësorë (Kur'an 60:8), dhe fiset dhe individët e tjerë çifutë të Medinës që mbajtën besimin nuk u dëmtuan kurrë. Bursa e zakonshme e trajton këtë si një episod historik të kufizuar të ligjit të tradhtisë, dhe disa studiues të mëvonshëm madje vunë në dyshim detajet e numrave të transmetuar.",
      "Kurani i referohet episodit me maturi në suren al-Ahzab si pasojë e luftës së Konfederatës, pa triumf. Mësimi i qëndrueshëm është graviteti i thyerjes së një besëlidhjeje – tradhtia e besimit në një moment rreziku të përbashkët mbart peshën më të madhe – e vendosur krahas parimit që edhe një armik ka të drejtë të gjykohet nga një arbitër i rënë dakord dhe i paanshëm dhe jo në hakmarrje të pakontrolluar.",
    ],
    battleDetails: {
      location: "Kështjellat e Benu Kurejzes, në skaj të Medinës",
      modernLocation: "Medine, Arabia Saudite",
      hijriDate: "Dhul-Ka'de 5 hixhri (menjëherë pas Hendekut)",
      muslimForces: "Ushtria Medinase, menjëherë pas rrethimit të Hendekut",
      opposingForces: "Benu Kurejza, të fortifikuar brenda fortesave të tyre",
      muslimCommander: "Profeti Muhamed ﷺ",
      outcome: "Dorëzimi pas rrethimit; gjykimi i dhënë nga arbitri i zgjedhur i vetë fisit",
      keyEvents: [
        "Benu Kurejzehu e theu besëlidhjen e Medinës gjatë rrethimit të Konfederatës.",
        "Pasi konfederatat u tërhoqën, muslimanët rrethuan kalatë e tyre për rreth 25 ditë.",
        "Fisi kërkoi të gjykohej nga Sa'd ibn Mu'adh, prijësi i aleatëve të tyre të vjetër Evs.",
        "Sa'di sundohej nga ligji i luftës së epokës për tradhti nën rrethim; Profeti ﷺ e vërtetoi vendimin.",
      ],
      leadershipLesson:
        "Edhe kundër një armiku, lejoni gjykimin nga një arbitër i paanshëm i rënë dakord dhe jo një hakmarrje e pakontrolluar.",
      spiritualLesson:
        "Thyerja e një besëlidhjeje të mbrojtjes së ndërsjellë në një moment rreziku të përbashkët është ndër tradhtitë më të rënda.",
    },
    quran: [
      {
        excerpt:
          "Dhe Ai i zbriti ata nga ithtarët e librit që i mbështetën nga fortesat e tyre dhe hodhi tmerr në zemrat e tyre - një grup që e vratë dhe një grup që e zuri robër. Dhe Ai ju bëri të trashëgoni tokën dhe shtëpitë e tyre.",
      },
      {
        excerpt:
          "Allahu nuk ju ndalon nga ata që nuk ju luftojnë për shkak të fesë dhe nuk ju dëbojnë nga shtëpitë tuaja, që të jeni të devotshëm ndaj tyre dhe të silleni me drejtësi ndaj tyre. Vërtet, Allahu i do ata që veprojnë me drejtësi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kur Benu Kurejza ranë dakord të pranojnë gjykimin e Sa'd ibn Muadhit, Pejgamberi ﷺ e dërgoi atë. Ai erdhi dhe Pejgamberi ﷺ tha: Qëndroni për shefin tuaj. Sa'di gjykoi që luftëtarët e tyre të vriteshin dhe gratë dhe fëmijët e tyre të ziheshin robër. Profeti ﷺ tha: Ju keni gjykuar me gjykimin e Allahut - ose ai tha, me gjykimin e mbretit.",
      },
    ],
    disclaimer:
      "Ky ishte ndëshkimi për një akt të veçantë të tradhtisë së luftës nga luftëtarët, gjykuar nga një arbitër që vetë fisi zgjodhi. Ai nuk është një vendim kundër asnjë populli për fenë e tyre dhe nuk është model për marrëdhëniet me çifutët apo ndonjë bashkësi besimi, të cilët Islami urdhëron të trajtohen me drejtësi dhe mirësi (Kur'an 60:8). Disa studiues të mëvonshëm vunë në dyshim detajet e numrave të transmetuar.",
  },
  {
    title: "Marrëveshja e Hudejbijes",
    summary: "6 Hixhri - një armëpushim që dukej si një pengesë dhe u bë një fitore e qartë.",
    body: [
      "Konteksti dhe shkaku: Në vitin 6 hixhri, Profeti ﷺ u nis me rreth 1400 shokë - të paarmatosur, por për shpata udhëtarësh - me qëllim vetëm për të kryer pelegrinazhin më të vogël (umre) në Qabe, jo për të luftuar. Kurejshët, të cilët nuk donin të shiheshin duke i lënë muslimanët në Mekë, bllokuan rrugën në vendin e quajtur Hudejbije në kufirin e shenjtë.",
      'Betimi i Ridvanit: Kur në kamp mbërriti një thashetheme se kurejshët kishin vrarë të dërguarin e Profetit, Uthman ibn Affan, Profeti ﷺ i thirri shokët që të betoheshin nën një pemë akacieje se nuk do të iknin. Rreth katërmbëdhjetëqind e dhanë atë zotim - Bej\'at al-Ridvan, Betimi i Kënaqësisë Hyjnore - dhe Kurani më vonë deklaroi: "Allahu ishte shumë i kënaqur me besimtarët kur ata të betuan për besnikëri nën pemë" (48:18). Uthmani doli të ishte gjallë dhe kurejshët, të alarmuar nga vendosmëria e shfaqur, u dërguan për të negociuar.',
      "Çfarë ndodhi: Kushtet e armëpushimit dukeshin poshtëruese. Myslimanët do të ktheheshin mbrapa këtë vit pa umre dhe mund të ktheheshin vetëm vitin tjetër. Do të kishte një paqe dhjetëvjeçare. Kushdo që ikte nga Kurejshët te muslimanët do të kthehej, por jo e kundërta - një klauzolë që goditi. Kur një musliman i lidhur me zinxhirë, Ebu Xhendel, u tërhoq zvarrë para syve të tyre pikërisht nën këtë klauzolë, sahabët ishin gati duke u thyer; Omeri e pyeti hapur dhe iu kujtua butësisht që t'i besonte të Dërguarit të Allahut.",
      'Pse ishte një fitore: Kurejshët u trajtuan për herë të parë me muslimanët si një fuqi e barabartë në një traktat të shkruar. Paqja dhjetëvjeçare hapi rrugët; Islami u përhap me shpejtësi dhe në mënyrë paqësore gjatë armëpushimit - më shumë hyri në Islami në ato dy vjet sesa në të gjitha vitet e mëparshme. I çliruar nga fronti kurejsh, Profeti (ﷺ) mund t\'i drejtohej Hajberit dhe të dërgonte letra duke ftuar mbretër dhe fise në Islami. Në udhëtimin e kthimit u shpall sureja el-Feth, e cila hapet me: "Me të vërtetë, Ne të kemi dhënë një fitore të dukshme."',
      "Mësime të qëndrueshme: Ky është shembulli më i lartë i durimit ndaj impulsit dhe i besimit në Allahun dhe të Dërguarin e Tij, kur urtësia e një vendimi nuk është ende e dukshme. Atë që sahabët e ndjenë fillimisht si një disfatë, Kur'ani e quajti një fitore të qartë - dhe brenda dy vjetësh ai hapi rrugën për në vetë Mekke. Gatishmëria për të pranuar një paqe të vështirë, për të respektuar një traktat dhe për të pritur, tregohet këtu si një formë fuqie, jo dobësie.",
    ],
    battleDetails: {
      location: "Hudejbije, në kufirin e shenjtë afër Mekës",
      modernLocation: "Al-Shumaisi, afër Mekës, Arabia Saudite",
      hijriDate: "Dhul-Kada 6 hixhri",
      muslimForces: "~ 1400 pelegrinët, të pa pajisur për luftë",
      opposingForces: "Kurejshët, duke bllokuar rrugën për në Mekë",
      muslimCommander: "Profeti Muhamed ﷺ",
      outcome:
        "Një armëpushim dhjetëvjeçar; pa luftime; më vonë e quajti një fitore të dukshme në Kur'an",
      keyEvents: [
        "Muslimanët u nisën për në umre, jo për në betejë dhe u ndaluan në Hudejbije.",
        "Në një raport të rremë të vdekjes së Uthmanit, ~ 1400 e dhanë Betimin e Ridvanit nën pemë.",
        "Një armëpushim dhjetë-vjeçar u nënshkrua me kushte që shokët i patën të hidhur (klauzola e kthimit, Ebu Xhendal).",
        "Islami u përhap me shpejtësi gjatë paqes; Surja el-Fath e quajti traktatin një fitore të dukshme.",
      ],
      leadershipLesson:
        "Prano një paqe të vështirë dhe nderoje atë; një lëshim i mençur sot mund të hapë një derë më të madhe nesër.",
      spiritualLesson:
        "Besojuni Allahut dhe të Dërguarit të Tij kur urtësia e një vendimi fshihet - durimi mund të jetë fitorja më e vërtetë.",
    },
    quran: [
      {
        excerpt:
          "Vërtet, Ne ju dhamë një fitore të dukshme, që Allahu t'ju falë mëkatin tuaj paraprak dhe atë që do të pasojë, të plotësojë dhuntinë e Tij ndaj jush dhe t'ju udhëzojë në rrugën e drejtë.",
      },
      {
        excerpt:
          "Sigurisht që Allahu ishte i kënaqur me besimtarët kur ata të besuan ty nën pemë, dhe Ai e dinte se çfarë kishin në zemrat e tyre, andaj Ai zbriti mbi ta qetësinë dhe i shpërbleu me një pushtim të afërt.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Xhabir ibn Abdullah ka thënë: Ditën e Hudejbijes ne ishim katërmbëdhjetëqind. Ne i bëmë besnikë Profetit ﷺ nën pemë dhe ai ishte më i miri nga njerëzit.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ekspedita e Hajbarit",
    summary:
      "7 Hixhri - fortesat e fortifikuara që kishin mbështetur Konfederatat janë nënshtruar.",
    body: [
      "Konteksti dhe shkaku: Khajbar ishte një zinxhir kështjellash pjellore oazesh në veri të Medinës, shtëpia e fiseve të dëbuar më parë për tradhti - duke përfshirë krerët e Banu Nadirit që kishin organizuar koalicionin Konfederativ në Hendeku. Prej andej ata vazhduan të mbledhin armiqtë kundër Medinës. Me frontin e Kurejshëve të ngrirë nga Hudejbije, Profeti (a.s.) lëvizi për të neutralizuar këtë bazë të mbetur të armiqësisë.",
      "Çfarë ndodhi: Muslimanët - rreth 1600 - përparuan në kalatë një nga një. Fushata ishte e vështirë dhe zgjati për disa javë. Në një ditë të vështirë Pejgamberi ﷺ tha: \"Nesër do t'ia jap flamurin një njeriu që e do Allahun dhe të Dërguarin e Tij, të cilin Allahu dhe i Dërguari i Tij e duan, me duart e të cilit Allahu do t'i japë fitoren\". Të nesërmen në mëngjes ai thirri Ali ibn Ebi Talibin - i cili vuante nga dhimbjet e syve - u lut mbi të derisa u shërua dhe i dha flamurin; ra kalaja kryesore.",
      "Vendbanimi: Kur u morën fortesat, banorët nuk u dëbuan. Ata kërkuan të qëndronin dhe të vazhdonin të punonin tokën, duke u dhënë muslimanëve një pjesë të prodhimit, dhe Profeti ﷺ pranoi. Kjo marrëveshje – fermerët e pushtuar të mbajtur në tokën e tyre nën një pakt për ndarjen e prodhimit – u bë një precedent i hershëm i studiuar në ligjin e mëvonshëm Islami të traktateve dhe taksave.",
      "Figurat kyçe: fushata mbahet mend mbi të gjitha për rolin e Aliut dhe për etikën e mishëruar në hadithin e flamurit - që udhëheqja është besuar në bazë të sinqeritetit dhe dashurisë për Allahun, jo thjesht në gradë apo forcë.",
      "Një shënim për kujdesin: Khaybar nganjëherë tërhiqet zvarrë në polemika politike shumë të mëvonshme. Këtu ajo përshkruhet rreptësisht si ekspedita e shekullit të shtatë e regjistruar në seerahun klasik - një përgjigje ndaj një baze aktive armiqësore, e përfunduar jo me dëbim masiv, por me një zgjidhje të negociuar.",
    ],
    battleDetails: {
      location: "Oazi i Hajberit, në veri të Medinës",
      modernLocation: "Khaybar, Arabia Saudite",
      hijriDate: "Muharrem–Safar 7 hixhri",
      muslimForces: "Rreth 1600",
      opposingForces: "Garnizone të fortifikuara nëpër disa kala",
      muslimCommander: "Profeti Muhamed ﷺ; Ali ibn Ebi Talib udhëhoqi sulmin vendimtar",
      outcome:
        "kontrolli mysliman i kështjellave; një marrëveshje e negociuar për ndarjen e produkteve",
      keyEvents: [
        "Kalatë u reduktuan një nga një gjatë disa javësh rrethimi.",
        "Flamuri iu dha Aliut, sytë e të cilit Profeti ﷺ ia kishte shëruar me lutjen e tij.",
        "Kampioni Marhab u mund dhe kalaja kryesore ra.",
        "Banorët mbetën në tokën e tyre si kultivues nën një pakt për ndarjen e prodhimeve.",
      ],
      leadershipLesson:
        "Besojini përgjegjësitë atyre që janë më të përshtatshmet - dhe atyre zemrat e të cilëve janë të sinqerta me Allahun.",
      spiritualLesson:
        "Këmbëngulja në vështirësitë e gjata, e bashkuar me sinqeritetin, sjell ndihmën e Allahut.",
    },
    hadith: [
      {
        excerpt:
          "Në ditën e Hajberit, Pejgamberi ﷺ tha: Nesër do t'ia jap këtë flamur një njeriu që e do Allahun dhe të Dërguarin e Tij, të cilin Allahu dhe i Dërguari i Tij e duan dhe me duart e të cilit Allahu do t'i japë fitoren. Të nesërmen thirri Aliun, i cili kishte sy të lënduar; ai pështyu në sy dhe u lut për të, dhe Aliu u shërua sikur të mos ishte sëmurë kurrë dhe iu dha flamuri.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Beteja e Mutahut",
    summary:
      "Xhumada al-Ula 8 hixhri - një ekspeditë kufitare ku tre komandantë martirizohen me radhë.",
    body: [
      "Konteksti dhe shkaku: Profeti ﷺ kishte dërguar një të dërguar drejt veriut të linjës bizantine, dhe i dërguari u vra - një shkelje e rëndë, pasi të dërguarit mbroheshin nga ligji i kombeve. Si kundërpërgjigje, ai dërgoi një ushtri prej rreth 3,000 vetësh drejt Mu'tah, afër kufirit romak në lindje të Jordanit.",
      "Zinxhiri i komandës: Para se të niseshin, Profeti ﷺ caktoi një linjë pasardhëse - Zejd ibn Harithah për të udhëhequr, dhe nëse ai binte, Xha'fer ibn Ebi Talib, dhe nëse ai binte, Abdullah ibn Rawahah - një veprim goditës largpamësie që do të rezultonte vendimtar.",
      "Çfarë ndodhi: Në Mu'tah, muslimanët takuan një forcë shumë më të madhe bizantinesh dhe fisesh arabe aleate - burimet flasin për dhjetëra mijëra, megjithëse shifrat janë të pasigurta dhe me gjasë të ekzagjeruara. Ra Zejdi, pastaj Xhaferi - i cili mbahet mend se e mbajti flamurin derisa iu prenë të dy krahët - pastaj Abdullah ibn Ravahah, saktësisht sipas radhës që e kishte caktuar Profeti ﷺ.",
      'Tërheqja: Me të rënë dëshmor të tre komandantët e caktuar, shokët ia dhanë flamurin Halid ibn al-Velidit, i sapomyslimanit pas Hudejbijes. Me një seri manovrash dhe ridislokimesh, ai e shkëputi ushtrinë më të madhe në numër dhe e solli në shtëpi kryesisht të paprekur - një vepër që Profeti ﷺ e nderoi, duke e quajtur më vonë Khalidin një "shpatë në mesin e shpatave të Allahut". Në Medine, Profeti (ﷺ) qau për Zejdin, Xhaferin dhe Ibn Ravahën dhe dha lajmin për martirizimin e tyre para se të vinte ndonjë i dërguar.',
      "Mësime të qëndrueshme: emërimi i pasardhësve përpara rrezikut - vazhdimësia e udhëheqjes - fjalë për fjalë shpëtoi një ushtri; dhe një tërheqje e disiplinuar që ruan jetë nuk është turp, por mençuri. Martirizimi në rrugën e Allahut është nder, jo dështim politik, dhe beteja gjithashtu i njohu muslimanët me dhuratat e Halidit, të cilët shpejt u kthyen tërësisht në shërbim të besimit.",
    ],
    battleDetails: {
      location: "Mu'tah, në lindje të lumit Jordan",
      modernLocation: "Pranë Karak, Jordani",
      hijriDate: "Xhumade el-Ula 8 hixhri",
      muslimForces: "~ 3000",
      opposingForces:
        "Forcat bizantine dhe aleate arabe (shumë më të mëdha; numra të pasigurt në burime)",
      muslimCommander:
        "Zejd ibn Harithah, pastaj Xhaferi, pastaj Ibn Rawahah, pastaj Halid ibnul Velidi",
      outcome: "Tërheqja e rregullt e muslimanëve; dëshmor të rëndë por ushtria e ruajtur",
      keyEvents: [
        "Profeti ﷺ emëroi tre komandantë me radhë para nisjes.",
        "Të tre ranë me radhë në Mu'tah, pikërisht siç ishte parathënë.",
        "Khalid ibn al-Velid mori komandën dhe manovroi ushtrinë drejt sigurisë.",
        "Pejgamberi salAllahu alejhi ue selem qau në Medine dhe lajmëroi dëshmorët para se të vinte lajmi.",
      ],
      leadershipLesson:
        "Emërtoni pasardhësit përpara se të godasë rreziku - vazhdimësia e qartë e lidershipit shpëton jetë.",
      spiritualLesson:
        "Martirizimi në rrugën e Allahut është një nder; një tërheqje e mençur që shpëton një ushtri nuk është humbje.",
    },
    appLinks: [{}],
  },
  {
    title: "Pushtimi i Mekës",
    summary:
      "Ramazani 8 Hixhri - hapja pothuajse pa gjak të Mekës nën një amnisti të përgjithshme.",
    body: [
      "Konteksti dhe shkaku: Marrëveshja e Hudejbijes u mbajt derisa aleatët e Kurejshëve, Benu Bekr, sulmuan aleatët e muslimanëve, Benu Khuza'ah - duke vrarë disa edhe brenda zonës së shenjtë - me Kurejshët që furnizonin fshehurazi armë. Kjo e prishi armëpushimin. Kur përpjekja e vetë Kurejshit për ta rregulluar atë dështoi, rruga për në Mekë ishte e hapur.",
      "Çfarë ndodhi: Profeti ﷺ marshoi me rreth 10.000 shokë, duke lëvizur aq shpejt dhe fshehurazi sa kurejshët nuk kishin kohë për të organizuar rezistencë. Ebu Sufjani, komandanti i vjetër kurejsh, doli dhe pranoi Islamin në prag të hyrjes. Ushtria hyri në Mekë nga disa drejtime pa pothuajse asnjë luftim - vetëm një kolonë hasi në rezistencë të shkurtër të armatosur; Profeti ﷺ i kishte urdhëruar qartë komandantët e tij që të mos luftonin përveç atyre që i luftonin.",
      'Amnistia: Ky është momenti që përcakton pushtimin. Duke qëndruar në Qabe me qytetin që e kishte torturuar, bojkotuar dhe dëbuar tani në mëshirën e tij, Profeti ﷺ i pyeti kurejshët se çfarë prisnin prej tij, pastaj deklaroi - duke iu bërë jehonë fjalëve të Profetit Jusuf ndaj vëllezërve që i kishin bërë padrejtësi - "Nuk ju fajësoni sot. Shkoni, se jeni të lirë". Një amnisti e përgjithshme mbuloi popullsinë; vetëm një pjesë e vogël u përjashtuan për krime specifike, madje shumica e tyre u falen kur erdhën tek ai.',
      'Pastrimi: Profeti (sal-lAll-llahu alejhi ue sel-lem) e pastroi Qaben nga 360 idhujt e saj, duke recituar: "E vërteta erdhi dhe gënjeshtra u zhduk" (Kur\'an 17:81). Bilal ibn Rabah, dikur i torturuar si skllav në atë qytet, u ngjit në majë të Qabes dhe thirri ezanin mbi Mekke. Surja en-Nasr - "Kur të vijë fitorja e Allahut dhe pushtimi" - shënon këtë hapje dhe turmat e saj që hyjnë në besim.',
      "Mësime të qëndrueshme: kjo është ndër demonstrimet më të mëdha të karakterit profetik të ushtruar në pushtet. Madhështia në fitore fitoi më shumë zemra sesa mund të kishte çdo ndëshkim; qëllimi gjatë gjithë kohës kishte qenë udhëzimi, jo hakmarrja, dhe fuqia u bë për t'i shërbyer mesazhit dhe jo vetvetes. Me vend quhet Fath Mekka - Hapja - jo një shkresë.",
    ],
    battleDetails: {
      location: "Meka",
      modernLocation: "Meka, Arabia Saudite",
      hijriDate: "Ramazani 8 hixhri",
      muslimForces: "~ 10,000",
      opposingForces: "Kurejshët (u dorëzuan pothuajse pa luftuar)",
      muslimCommander: "Profeti Muhamed ﷺ",
      outcome: "Meka u hap pothuajse pa gjakderdhje; shpallet amnisti e përgjithshme",
      keyEvents: [
        "Armëpushimi u prish kur kurejshët mbështetën një sulm ndaj aleatëve të muslimanëve, Khuza'ah.",
        "Ebu Sufjani e pranoi Islamin para se të hynte ushtria; shtëpia e tij u shpall vend sigurie.",
        "Profeti ﷺ dha një amnisti të përgjithshme: Nuk ju fajësoni sot - shkoni, jeni të lirë.",
        "Qabeja u pastrua nga idhujt e saj; Bilali thirri ezanin nga maja e tij.",
        "Ish-armiqtë e përqafuan Islamin në një numër të madh.",
      ],
      leadershipLesson:
        "Madhështia në fitore i fiton zemrat shumë më afatgjatë sesa frika apo hakmarrja.",
      spiritualLesson:
        "Qëllimi ishte udhëzimi, jo hakmarrja - fuqia është krijuar për t'i shërbyer mesazhit, jo vetvetes.",
    },
    quran: [
      {
        excerpt:
          "Kur të ketë ardhur fitorja dhe pushtimi i Allahut dhe t'i shihni njerëzit që hyjnë në fenë e Allahut me shumicë, atëherë lartësoni Zotin tuaj me lavdërim dhe kërkoni falje prej Tij. Vërtet, Ai gjithmonë e pranon pendimin.",
      },
      {
        excerpt:
          "Ai tha: S'ka faj për ju sot. Allahu ju faltë dhe Ai është më i mëshirshmi i mëshiruesve. - fjalët e profetit Jusuf që Profeti ﷺ u bëri jehonë kurejshëve në ditën e pushtimit.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Beteja e Hunejnit",
    summary: "Shevali 8 hixhri - një pritë pas Mekës; besimi u testua, pastaj fitorja u dha.",
    body: [
      "Konteksti dhe shkaku: Mezi dy javë pas hapjes së Mekës, fiset e fuqishme të Havazinit dhe Thaqifit u mblodhën për të goditur muslimanët përpara se të vendosej dominimi i tyre i ri. Profeti ﷺ marshoi me një ushtri të madhe - rreth 12,000, duke përfshirë shumë të konvertuar së fundmi mekas - forca më e madhe muslimane e mbledhur ende. Në madhësinë e tij, disa nga burrat ndjenin një besim të panjohur dhe raportohet se dikush tha se nuk mund të mposhteshin për mungesën e numrave.",
      "Çfarë ndodhi: Armiku kishte bërë pritë në luginën e ngushtë të Hunejnit. Ndërsa muslimanët zbritën në gjysmën e agimit, një stuhi shigjetash ra mbi ta nga lartësitë dhe pararoja u thye. Paniku u përhap dhe pjesa më e madhe e ushtrisë së madhe u kthye dhe u largua - numrat që kishin rritur besimin tani e mbaruan rrugën.",
      'Pika e kthesës: Në kaos, Profeti ﷺ nuk iku. Ai e shtyu mushkën e tij përpara drejt armikut, duke thirrur me zë të lartë: "Unë jam Profeti, kjo nuk është gënjeshtër; unë jam djali i Abd al-Muttalib." Një bërthamë e muhaxhirunëve dhe ensarëve - me Abbasin që i thërriste shokët me emër - u mblodhën rreth tij. Myslimanët u riformuan, u kthyen kundër pritësve dhe i shpartalluan; u morën robër dhe plaçka të mëdha.',
      "Pasojat: Fushata vazhdoi deri në një rrethim të Taifit, i cili nuk ra menjëherë. Më vonë, kur Havazinët erdhën për të kërkuar popullin e tyre, Profeti ﷺ i ktheu robërit - duke zgjedhur pajtimin dhe zbutjen e zemrave në vend të mbajtjes së plaçkës dhe duke favorizuar bujarisht të konvertuarit e rinj mekas për t'i lidhur ata me besimin.",
      'Kur\'ani i drejtohet drejtpërdrejt kësaj dite, duke përmendur rrezikun e mbështetjes në numra: "Dhe në ditën e Hunejnit, kur numri juaj i madh ju pëlqeu, por nuk ju bëri dobi... atëherë Allahu zbriti qetësinë e Tij" (9:25-26). Mësimi i qëndrueshëm është i qartë – kurrë mos u mbështetni te numrat, pasuria apo suksesi i kohëve të fundit; fitorja është dhuratë vetëm e Allahut – dhe virtyti binjak i një lideri që qëndron i palëkundur dhe i dukshëm kur ndjekësit e tij kapin panik.',
    ],
    battleDetails: {
      location: "Lugina e Hunejnit, ndërmjet Mekës dhe Taifit",
      modernLocation: "Pranë Ta'if, Arabia Saudite",
      hijriDate: "Shevali 8 hixhri",
      muslimForces: "~ 12,000 (përfshirë shumë të konvertuar të rinj mekas)",
      opposingForces: "Hawazini dhe Thaqifi",
      muslimCommander: "Profeti Muhamed ﷺ",
      outcome: "Fitorja e muslimanëve pas një dështimi fillestar",
      keyEvents: [
        "Ushtria më e madhe muslimane ende krijoi besim në numrin e saj përpara betejës.",
        "Një pritë në agim në luginë shpërndau pararojën dhe shkaktoi një panik të gjerë.",
        "Profeti ﷺ qëndroi i palëkundur dhe i thirri besimtarët të kthehen; një bërthamë u mblodh rreth tij.",
        "Myslimanët riformuan dhe shpartalluan armikun; pasoi një rrethim i Taifit.",
        "Më vonë robërit u kthyen si një gjest pajtimi.",
      ],
      leadershipLesson:
        "Një lider duhet të jetë i dukshëm dhe i qëndrueshëm kur ndjekësit janë në panik - prania mbledh radhët.",
      spiritualLesson:
        "Asnjëherë mos u mbështetni në numra ose sukses të fundit; fitorja dhe qetësia vijnë vetëm nga Allahu.",
    },
    quran: [
      {
        excerpt:
          "Allahu tashmë ju ka dhënë fitore në shumë rajone - dhe në ditën e Hunejnit, kur numri juaj i madh ju pëlqeu, por nuk ju bëri dobi, dhe toka, me gjithë gjerësinë e saj, u mbyll para jush dhe ju u kthyet duke u tërhequr. Pastaj Allahu zbriti qetësinë e Tij mbi të Dërguarin e Tij dhe mbi besimtarët.",
      },
    ],
    hadith: [
      {
        excerpt:
          "El-Bara ibn Azib u pyet nëse ata kishin ikur në ditën e Hunejnit. Ai tha: Por i Dërguari i Allahut ﷺ nuk iku. Njerëzit u kthyen mbrapa dhe Pejgamberi ﷺ ishte mbi mushkën e tij të bardhë dhe thoshte: Unë jam Pejgamberi, kjo nuk është gënjeshtër; Unë jam djali i Abdul Mutalibit.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ekspedita e Tebukut",
    summary:
      "Rexhebi 9 hixhri - marshimi më i vështirë, në vapën e verës, duke testuar besimin pa betejë.",
    body: [
      'Konteksti dhe shkaku: Raportet arritën në Medine për një mobilizim të madh bizantin në kufirin verior. Profeti ﷺ bëri thirrje për një fushatë në Tebuk - dhe, në mënyrë të pazakontë, e emëroi destinacionin haptazi në vend që ta fshehë atë, sepse marshimi do të ishte aq i gjatë dhe aq i vështirë sa të gjithë duhej të përgatiteshin me ndershmëri. Ra në vapën e egër të verës së lartë, në kohën e korrjes, kur udhëtimet dhe shpenzimet ishin më të rëndat - u bë e njohur si "ekspedita e vështirësive".',
      "Prova e sakrificës: Thirrja i nxori zemrat e komunitetit. Osmani pajisi një pjesë të madhe të ushtrisë nga pasuria e tij; Ebu Bekri dha gjithçka që kishte; Omeri dha gjysmën e tij. Shokët më të varfër që nuk kishin asgjë për të dhënë qanin sepse nuk mund të merrnin pjesë - Kur'ani i regjistron lotët e tyre (9:92). Kundër tyre qëndronin hipokritët, të cilët shpikën arsyetime për të qëndruar prapa dhe të cilët sureja Teube i ekspozon gjatë.",
      "Çfarë ndodhi: Ushtria - më e madhja që ka udhëhequr ndonjëherë Profeti ﷺ, ndoshta 30,000 - arriti në Tebuk pas një marshimi rraskapitës. Asnjë forcë bizantine nuk u shfaq për të luftuar. Në vend të një rezultati bosh, ekspedita siguroi traktate me fiset kufitare dhe sundimtarët e veriut, zgjeroi sigurinë e komunitetit dhe demonstroi një gatishmëri që vetë pengonte agresionin.",
      "Të tre ata që qëndruan pas: Në mesin e atyre që mbetën ishin tre besimtarë të sinqertë - Ka'b ibn Malik, Hilal ibn Umejah dhe Murarah ibn Rabi' - të cilët nuk kishin asnjë justifikim të vlefshëm dhe, më e rëndësishmja, refuzuan të gënjejnë për këtë. Ata u bojkotuan për pesëdhjetë ditë, toka \"e gjerë ashtu siç ishte\" u mbyll mbi ta, derisa u pranua pendimi dhe Kur'ani shpalli faljen e tyre (9:118). Ndershmëria e tyre në gjyq është një nga episodet më prekëse në seerah.",
      "Mësime të qëndrueshme: gatishmëria për të mbrojtur komunitetin është në vetvete një akt besimi edhe kur nuk është nxjerrë shpata; sakrifica pa shpërblim të menjëhershëm dhe të dukshëm është ndër testet më të larta; dhe vërtetësia - refuzimi i Ka'bit për të shpëtuar veten me gënjeshtër - është më e dashur për Allahun sesa një gënjeshtër e rehatshme. Surja et-Teube e përmbledh të gjithë ekspeditën rreth këtyre temave.",
    ],
    battleDetails: {
      location: "Tabuk, në rrugën drejt kufirit bizantin",
      modernLocation: "Tabuk, Arabia Saudite",
      hijriDate: "Rexheb 9 hixhri",
      muslimForces: "~ 30,000 (ushtria më e madhe e udhëhequr nga Profeti ﷺ)",
      opposingForces: "Një forcë bizantine u raportua, por nuk u paraqit për betejë",
      muslimCommander: "Profeti Muhamed ﷺ",
      weather: "Vapa ekstreme e verës, në kohën e korrjes",
      outcome: "Asnjë betejë; traktatet veriore të siguruara; komuniteti testoi dhe shoshit",
      keyEvents: [
        "Profeti ﷺ e emëroi destinacionin e largët haptazi për shkak të vështirësisë së marshimit.",
        "Uthmani, Ebu Bekri, Omeri dhe të tjerët dhanë bujarisht; më të varfërit qanin duke mos pasur asgjë për të dhënë.",
        "Hipokritët bënin arsyetime për të qëndruar prapa dhe u ekspozuan në suren Teube.",
        "Asnjë armik i përfshirë; u siguruan traktate me fiset dhe sundimtarët e veriut.",
        "Tre besimtarë të sinqertë u bojkotuan 50 ditë derisa u pranua pendimi (Kur'an 9:118).",
      ],
      leadershipLesson:
        "Jini të sinqertë për vështirësitë dhe koston e saj; transparenca ndërton besimin dhe përgatit vullnetin.",
      spiritualLesson:
        "Sakrifica pa shpërblim të dukshëm dhe vërtetësia nën sprovë, janë ndër sprovat më të larta të besimit.",
    },
    quran: [
      {
        excerpt:
          "Ata që mbetën u gëzuan me qëndrimin e tyre pas të Dërguarit të Allahut dhe nuk donin të luftonin me pasurinë dhe jetën e tyre në rrugën e Allahut dhe thanë: Mos dilni në vapë. Thuaj: Zjarri i Xhehenemit është më i fortë në nxehtësi, sikur të kuptonin.",
      },
      {
        excerpt:
          "Dhe Ai i fali të tre ata që mbetën pas, derisa toka, e gjerë sa ishte, u mbyll mbi ta dhe shpirtrat e tyre u mbyllën mbi ta, dhe ata ishin të bindur se nuk ka strehim nga Allahu veçse tek Ai. Pastaj Ai iu drejtua atyre me mëshirë që të mund të pendoheshin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ka'b ibn Malik tregoi se si ai qëndroi prapa nga Tebuku pa arsye dhe nuk do të gënjejë për këtë; Pejgamberi ﷺ i urdhëroi besimtarët që të mos flisnin me të dhe me dy shokët e tij për pesëdhjetë net, derisa toka t'u ngushtohej atyre - pastaj erdhi shpallja e faljes së tyre dhe ishte ndër ditët më të lumtura të jetës së tij.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ghazawat dhe Saraya",
    summary: "Dallimi midis fushatave kryesore dhe shkëputjeve më të vogla.",
    body: [
      "Gazveja është një ekspeditë në të cilën Pejgamberi ﷺ mori pjesë personalisht - dijetarët numërojnë rreth njëzet e shtatë, duke përfshirë Bedrin, Uhudin, Hendekun, Hudejbijen, Hajberin, pushtimin e Mekës, Hunejnit dhe Tebukut.",
      "Një sariyyah (shumës saraya) është një detashment i dërguar nën një komandant të emëruar pa u bashkuar Profeti ﷺ - janë regjistruar afërsisht pesëdhjetë misione të tilla, për zbulim, për t'iu përgjigjur bastisjeve, për përcjellje ose për të ftuar fise në Islami.",
      "Shumë saraya nuk përfshinin fare luftime - ato ishin diplomaci, patrullë ose një shfaqje fuqie që e bënte luftën të panevojshme. Të tjerat, si ekspedita në Mu'tah, përfshinin luftime të rënda dhe humbje të rënda.",
      "Kuptimi i këtij dallimi mbron nga ekzagjerimi i numrit të 'betejave' në Islamin e hershëm. Përafërsisht për një dekadë, betejat aktuale ishin të pakta; shumica e marshimeve ishin parandaluese, diplomatike ose pa gjak, dhe burimet e vlerësojnë të gjithë periudhën profetike si jashtëzakonisht të lehtë në humbje jete për epokën e saj.",
    ],
    actions: [
      "Shfletoni afatin kohor për të parë se cilat ngjarje ishin beteja të ngritura, cilat ishin rrethime dhe cilat ishin marshime pa luftime.",
      "Lexoni hyrjet e fjalorit për ghazwah dhe sariyyah për t'i mbajtur kategoritë të qarta.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Betejat pas Profetit ﷺ",
    summary: "Angazhime të mëdha nën Kalifët e Drejtuar - të dallueshëm nga epoka profetike.",
    body: [
      "Pasi Profeti ﷺ ndërroi jetë në vitin 11 hixhri (632 e.s.), komuniteti u drejtua nga kalifët Ebu Bekri, Omari, Uthmani dhe Aliu (Allahu qoftë i kënaqur me ta) përmes luftërave të Ridda (apostazisë), zgjerimit në Persinë Sasaniane dhe Sirinë Bizantine dhe përfundimisht fitne të brendshme.",
      "Këto ngjarje i përkasin historisë islame, por ato nuk janë sunet në mënyrën se si janë veprimet e vetë Profetit. Ato duhet të studiohen me mjetet e historisë dhe me vetëdijen se vetë dijetarët myslimanë debatojnë detajet, motivet dhe mësimet e tyre.",
      "Beteja e al-Kadisijah (rreth 636 e.s.): Sa'd ibn Abi Wakas udhëhoqi forcat muslimane kundër ushtrisë sasaniane në Irak - një pikë kthese që hapi Persinë.",
      "Beteja e Yarmouk (636 e.s.): komandantët përfshirë Khalid ibn al-Valid u takuan me bizantinët në Siri në një fushatë vendimtare që i dha fund fuqisë së madhe fushore bizantine në Levant - e studiuar si histori ushtarake, jo si sunet profetik.",
      "Beteja e Nahavandit (rreth 642 e.s.): e kujtuar në burimet arabe si 'Fitorja e Fitores', ajo theu rezistencën e mbetur sasaniane. Datat dhe shifrat e trupave ndryshojnë midis historianëve.",
    ],
    actions: [
      "Së pari studioni betejat profetike - ato janë referenca kryesore morale dhe ligjore.",
      "Qasuni me nuancë pushtimeve të mëvonshme; as ta glorifikoni luftën dhe as ta rrafshoni në slogane një histori komplekse.",
    ],
    disclaimer:
      "Numrat, motivet dhe vlerësimet morale të pushtimeve post-profetike janë debatuar mes historianëve. Kjo pasqyrë është për orientim, jo ​​polemikë.",
  },
  {
    title: "Mësime lidershipi",
    summary: "Durimi, shura, mëshira dhe besimi në Allahun - jo thjesht taktika.",
    body: [
      "Modeli profetik i udhëheqjes në konflikt e vendos karakterin mbi zgjuarsinë. Vendimet kryesore u morën përmes konsultimit (shura) - puset në Bedr, hendeku në rrethimin e Konfederatës, kushtet në Hudejbije - edhe kur shpallja më vonë do të konfirmonte rezultatin. Udhëheqja e dëgjoi përpara se të vepronte.",
      'Durimi formoi harkun e çdo fitoreje. Paqja e vështirë e Hudejbijes çoi, brenda dy vjetësh, në hapjen e Mekës. Mëshira në Mekë - "Shko, ti je i lirë" - fitoi mbi njerëzit që e kishin persekutuar komunitetin. Disiplina e hidhur e mësuar në Uhud e pengoi përsëritjen e asaj fatkeqësie.',
      "Guximi u tregua po aq nga shpata po aq edhe mbi të: qëndrimi i palëkundur dhe i dukshëm kur ushtria iku në Hunejn; bartja e dheut në llogore krahas gërmuesve; dhe - më e vështira nga të gjitha - të falësh në orën e fuqisë totale ata që dikur të kishin dëbuar nga shtëpia jote.",
      "Besimi në Allahun (tevakkul) kurrë nuk do të thoshte të neglizhosh mjetet. U dërguan skautët, u zgjodh toka, u përdorën forca të blinduara, u hapën llogore, u emëruan pasardhësit dhe u nderuan traktatet. Besimtarët bënë gjithçka në fuqinë e tyre dhe më pas ia besuan rezultatin Allahut - se bashkimi i përpjekjeve të plota dhe mbështetjes së plotë është zemra e modelit.",
    ],
    actions: [
      "Para një vendimi të vështirë, pyesni: a jam konsultuar vërtet me ata që kanë njohuri?",
      "Pas një suksesi, pyesni: po tregoj mëshirë, apo është kthyer në krenari?",
      "Në një pengesë, pyesni: a ka një mosbindje për të korrigjuar, apo një mësim që Allahu do të thotë që unë ta mësoj?",
    ],
    appLinks: [{}],
  },
  {
    title: "Hadith autentik mbi betejat",
    summary: "Tregime të zgjedhura me vlerësim - mbi sjelljen, durimin dhe ngjarjet kryesore.",
    body: [
      "Hadithi për ekspeditat duhet të kontrollohet për autenticitetin përpara se të mbështetet. Transmetimet e mëposhtme janë nxjerrë nga koleksionet Sahih dhe kanë të bëjnë me sjelljen dhe frymën e këtyre fushatave; secili mbart notën e tij.",
      "Për transmetimet që lidhen me një angazhim specifik, shihni vetë temën e asaj beteje. Përdorni shfletuesin e haditheve të Munibit për të lexuar zinxhirët e plotë dhe vlerësimin në kontekst.",
    ],
    hadith: [
      {
        excerpt:
          "Mos dëshironi të takoni armikun dhe kërkoni nga Allahu siguri. Por kur t'i takoni, bëni durim dhe dijeni se Xheneti është nën hijen e shpatave.",
      },
      {
        excerpt:
          "Profeti ﷺ tha: Lufta është mashtrim. - Studiuesit e shpjegojnë këtë si leje për mashtrim taktik në betejë (mashtrime, befasi, keqdrejtime), asnjëherë si leje për të thyer një traktat ose për të tradhtuar një palë të mbrojtur.",
      },
      {
        excerpt:
          "Kur caktoi një komandant, Profeti (sal-lAllahu alejhi ue sel-lem) e urdhëroi atë që t'i frikësohej Allahut, të ftonte armikun në Islami para se të luftonte, të mos thyente zotimin, të mos gjymtonte dhe të mos vriste një fëmijë.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Referencat dhe burimet",
    summary: "Veprat klasike të seerahut dhe si t'i lexoni ato në mënyrë kritike.",
    body: [
      "Burimet kryesore të serahut përfshijnë Sirahun e Ibn Is'hakut (të ruajtur përmes Ibn Hishamit), Kitab el-Maghazi të el-Vakidiut, Tabakatin e Ibn Sa'dit dhe el-Bidayah wan-Nihajah të Ibn Kethirit. Secili ka pikat e veta të forta dhe paralajmërimet e tij shkencore.",
      "Ibn Is'haku (nëpërmjet Ibn Hishamit) është tregimi themelor; el-Vakidi jep detaje të pasura të betejës, por disa nga raportet e tij kundërshtohen nga kritikët e hadithit; Ibn Kethiri e sintetizon historinë me kritikën e hadithit dhe është i kujdesshëm me notimin.",
      "Pasazhet kuranore mbi këto ngjarje janë tekstet më autoritare nga të gjithë. Për çështjet e sjelljes, ligjit dhe etikës, hadithet sahih të el-Buhariut dhe Muslimit kanë përparësi ndaj raporteve të paverifikuara të serahut.",
      "Aty ku historianët ndryshojnë – mbi përmasat e sakta të ushtrisë, disa data dhe vlerësimin moral të disa fushatave post-profetike – ky modul vë në dukje pasigurinë në vend që të shpikë saktësinë. Çdo Hadith i cituar këtu u kontrollua nga koleksionet për numrin dhe shkallën e tij.",
    ],
    actions: [
      "Kontrolloni në fillim çdo detaj të betejës kundër Kuranit, pastaj hadithin sahih, pastaj serahun.",
      "Për çdo pyetje të fetvasë ose aplikimit bashkëkohor, konsultohuni me studiues të kualifikuar - ky modul është edukativ, jo një vendim.",
    ],
    appLinks: [{}, {}],
  },
];

export const BATTLES_VERSES_SQ: DeepPartial<BattlesVerse>[] = [
  {
    excerpt:
      "Leja u jepet atyre që luftojnë sepse u është bërë padrejtësi… Sikur Allahu të mos kontrollonte një grup njerëzish me anë të një tjetri, manastiret, kishat, sinagogat dhe xhamitë do të ishin shkatërruar.",
    context:
      "Leja e parë e përgjithshme për të luftuar - pas vitesh persekutimi të paarmatosur në Mekë.",
  },
  {
    excerpt:
      "Luftoni në rrugën e Allahut ata që ju luftojnë, por mos e teproni. Vërtet, Allahu nuk i do shkelësit.",
    context: "Kufiri themelor: vetëm mbrojtja, me ndalim të rreptë të tejkalimit të kufijve.",
  },
  {
    excerpt:
      "Kur i kërkove ndihmë Zotit tënd, Ai u përgjigj: Unë do t'ju përforcoj me një mijë engjëj, gradë pas gradë.",
    context: "E shpallur në lidhje me Bedrin - ndihmë hyjnore për besimtarët më të shumtë.",
  },
  {
    excerpt:
      "Tashmë ka pasur një shenjë për ju në dy ushtritë që u takuan: njëra lufton në rrugën e Allahut dhe tjetra e jobesimtarëve, duke i parë me sy dyfishin e tyre.",
    context:
      "Allahu i bëri muslimanët të duken më të mëdhenj para armikut në Bedr, duke i forcuar zemrat.",
  },
  {
    excerpt:
      "Allahu padyshim e kishte përmbushur premtimin e Tij ndaj jush kur po i vrisnit me lejen e Tij, derisa ju humbët guximin dhe ratë në mosmarrëveshje rreth urdhrit dhe nuk iu binde pasi Ai ju tregoi atë që e doni.",
    context: "I drejtohet mosbindjes së harkëtarëve dhe pikës së kthesës në Uhud.",
  },
  {
    excerpt:
      "O ju që besuat, kujtoni dhuntinë e Allahut ndaj jush kur ju erdhën ushtri dhe Ne dërguam kundër tyre një erë dhe ushtri që nuk i shihnit.",
    context: "Surja al-Ahzab mbi rrethimin e Konfederatës dhe ndihmën hyjnore.",
  },
  {
    excerpt:
      "Dhe Ai i zbriti ata nga ithtarët e librit që i mbështetën nga fortesat e tyre dhe hodhi tmerr në zemrat e tyre - një grup që e vratë dhe një grup që e zuri robër. Dhe Ai ju bëri të trashëgoni tokën dhe shtëpitë e tyre.",
    context:
      "Surja al-Ahzab mbi Benu Kurejza, i cili theu besëlidhjen gjatë rrethimit - një episod i kufizuar i tradhtisë gjatë luftës, jo një vendim kundër një besimi.",
  },
  {
    excerpt:
      "Vërtet, Ne ju dhamë një fitore të dukshme, që Allahu t'ju falë mëkatin tuaj paraprak dhe atë që do të pasojë, të plotësojë dhuntinë e Tij ndaj jush dhe t'ju udhëzojë në rrugën e drejtë.",
    context:
      "E shpallur në kthimin nga Hudejbije – duke e emërtuar si fitore të dukshme atë që sahabët e kishin ndjerë fillimisht si një kompromis të hidhur.",
  },
  {
    excerpt:
      "Sigurisht që Allahu ishte i kënaqur me besimtarët kur ata të besuan ty nën pemë, dhe Ai e dinte se çfarë kishin në zemrat e tyre, andaj Ai zbriti mbi ta qetësinë dhe i shpërbleu me një pushtim të afërt.",
    context:
      "Betimi i Ridvanit - rreth 1,400 shoqërues u zotuan nën një pemë akacieje që të mos iknin, dhe Allahu deklaroi kënaqësinë e Tij me ta.",
  },
  {
    excerpt:
      "Kur të ketë ardhur fitorja dhe pushtimi i Allahut dhe t'i shihni njerëzit që hyjnë në fenë e Allahut me shumicë, atëherë lartësoni Zotin tuaj me lavdërim dhe kërkoni falje prej Tij. Vërtet, Ai gjithmonë e pranon pendimin.",
    context:
      "Surja en-Nasr në hapjen e Mekës - një pushtim i kurorëzuar jo me triumf, por me lavdërim, duke kërkuar falje dhe turma që hyjnë në besim.",
  },
  {
    excerpt:
      "Allahu tashmë ju ka dhënë fitore në shumë rajone… Pastaj Allahu zbriti qetësinë e Tij mbi të Dërguarin e Tij dhe mbi besimtarët.",
    context:
      "Allahu u kujton besimtarëve se fitorja është dhuratë e Tij, jo rezultat i mburrjes në numër.",
  },
  {
    excerpt:
      "Ata që mbetën prapa u gëzuan me qëndrimin e tyre pas të Dërguarit të Allahut dhe nuk donin të luftonin me pasurinë dhe jetën e tyre në rrugën e Allahut.",
    context:
      "Surja et-Teube u drejtohet atyre që e justifikuan veten nga marshimi i vështirë i Tebukut.",
  },
];

export const BATTLES_TIMELINE_SQ: DeepPartial<BattlesTimelineEvent>[] = [
  {
    title: "Zbulimi i parë",
    body: "Pejgamberi ﷺ merr ajetet e para të sures Al-Alak në shpellën Hira. Prej vitesh thirrja është paqësore - pa leje për të luftuar.",
    location: "Meka",
  },
  {
    title: "Thirrje publike dhe persekutim",
    body: "Predikimi i hapur sjell tortura, bojkot dhe martirizim. Muslimanët durojnë pa hakmarrje të armatosur - durimi dhe migrimi janë përgjigjet që mësohen.",
    location: "Meka",
  },
  {
    title: "Hixhra deri në Medine",
    body: "Komuniteti musliman themelon një shtet në Jethrib (Medine). Traktatet me fiset hebraike dhe Kushtetuta e Medines vendosin rregulla për bashkëjetesën.",
    location: "Medine",
  },
  {
    title: "Beteja e Bedrit",
    body: "Më 17 Ramazan, rreth 313 muslimanë mposhtin një ushtri shumë më të madhe kurejshësh - beteja e parë e madhe dhe një fitore morale vendimtare.",
    location: "Bedr",
  },
  {
    title: "Beteja e Uhudit",
    body: "Myslimanët fillimisht fitojnë terren, por harkëtarët duke lënë postin e tyre çojnë në një pengesë të dhimbshme. Kurani trajton mësimet e asaj dite.",
    location: "mali Uhud",
  },
  {
    title: "Beteja e Hendekut",
    body: "Një ushtri konfederate rrethon Medinën. Gërmimi i një llogore - sugjerimi i Salman - e thyen rrethimin pa një betejë të ashpër.",
    location: "Medine",
  },
  {
    title: "Benu Kurejzeh",
    body: "Pasi e thyen besëlidhjen e Medinës gjatë rrethimit, Benu Kurejza dorëzohen dhe kërkojnë të gjykohen nga një arbitër i zgjedhur prej tyre, Sa'd ibn Muadh.",
    location: "Medine",
  },
  {
    title: "Marrëveshja e Hudejbijes",
    body: "Një armëpushim dhjetëvjeçar që dukej një lëshim u bë, sipas fjalëve të Kuranit, një fitore e dukshme - Betimi i Ridvanit u dha nën pemë, konvertimet u përhapën dhe rruga për në Mekë u hap.",
    location: "Hudejbije",
  },
  {
    title: "Beteja e Mutahut",
    body: "Një ekspeditë në kufirin romak; tre komandantët e emëruar martirizohen radhazi para se Halid ibn al-Velidi ta tërheqë ushtrinë shëndoshë e mirë.",
    location: "Mu'tah",
  },
  {
    title: "Ekspedita e Hajbarit",
    body: "Kështjellat hebraike në veri të Medinës që kishin pasur armiqësi janë nënshtruar. Ali ibn Ebi Talibit i jepet flamuri pasi të gjykohen Ebu Bekri dhe Omeri.",
    location: "Hajbar",
  },
  {
    title: "Pushtimi i Mekës",
    body: "Kurejshët thyejnë marrëveshjen; Profeti alejhi selam marshon me dhjetë mijë shokë dhe hyn në Mekë pothuajse pa gjakderdhje - u shpall amnisti e përgjithshme.",
    location: "Meka",
  },
  {
    title: "Beteja e Hunejnit",
    body: "Havazini dhe Thaqifi u zënë pritë muslimanëve pas Mekës. Paniku fillestar i hap rrugën fitores kur Profeti ﷺ thërret besimtarët të mblidhen rreth tij.",
    location: "Hunejni",
  },
  {
    title: "Ekspedita e Tebukut",
    body: "Një marshim i vështirë veror drejt kufirit romak. Nuk ndodh asnjë betejë, por hipokrizia zbulohet dhe sureja et-Teube u drejtohet atyre që qëndruan prapa.",
    location: "Tebuku",
  },
  {
    title: "Haxhi Lamtumirës",
    body: "Profeti ﷺ kryen haxhin dhe mban hutben e lamtumirës. Ai ndërron jetë në Medine pak kohë më pas - mbyllet epoka e betejave profetike.",
    location: "Meka",
  },
];

export const BATTLES_FIGURES_SQ: DeepPartial<BattlesFigure>[] = [
  {
    name: "Ebu Bekr el-Siddik",
    epithet: "Allahu qoftë i kënaqur me të",
    summary:
      "Shoku më i afërt i Profetit, besimtari i parë mashkull i rritur dhe shoku i tij në Hixhra.",
    role: "Këshilltar, luftëtar dhe flamurtar në fushatat e hershme.",
    lesson:
      "Besnikëria dhe vërtetësia e palëkundur nën presion - ai e shpenzoi pasurinë e tij për të liruar muslimanët e persekutuar përpara çdo fitoreje.",
  },
  {
    name: "Omer ibnul Hattab",
    epithet: "Allahu qoftë i kënaqur me të",
    summary:
      "Hyri në Islami në vitet e persekutimit dhe u bë një nga mbrojtësit më të fortë të besimit.",
    role: "Luftëtar dhe më vonë arkitekt i drejtësisë si Kalif i dytë.",
    lesson:
      "Guximi i shoqëruar me përgjegjshmërinë – ai pranoi publikisht këshillën kur mendimi i tij ndryshonte nga ai i Profetit në Hudejbije.",
  },
  {
    name: "Ali ibn Ebi Talib",
    epithet: "Allahu qoftë i kënaqur me të",
    summary: "Kushëriri dhe dhëndri i Profetit ﷺ; ndër fëmijët e parë që pranuan Islamin.",
    role: "Kampion në beteja dhe bartës i flamurit në Khaybar.",
    lesson:
      "Trim me përulësi - ai fjeti në shtratin e Profetit natën e Hixhrës, duke rrezikuar jetën e tij që misioni të mund të vazhdonte.",
  },
  {
    name: "Hamza ibn Abdul-Muttalib",
    epithet: "Allahu qoftë i kënaqur me të",
    summary: "Xhaxhai i Profetit, i njohur si Asadullah (Luani i Allahut) pasi pranoi Islamin.",
    role: "Luftëtar elitar dhe udhëheqës moral në Bedr dhe Uhud.",
    lesson:
      "Martirizimi nuk është humbje – vdekja e tij në Uhud e hidhëroi Profetin thellësisht, por vendosmërinë e forcoi për të përfunduar misionin.",
  },
  {
    name: "Halid ibnul Velidi",
    epithet: "Allahu qoftë i kënaqur me të",
    summary:
      "Një gjeneral i shkëlqyer kurejsh, i cili e pranoi Islamin pas Hudejbijes dhe u bë Saifullah (Shpata e Allahut).",
    role: "Udhëhoqi kalorësinë anësore kundër muslimanëve në Uhud para Islamit të tij; më vonë mori komandën në Mu'tah dhe ishte vendimtar në fushatat kalifale.",
    lesson:
      "Kundërshtimi i kaluar nuk është pengesë për pendimin e sinqertë - aftësia që i goditi muslimanët në Uhud, sapo besimi hyri në zemrën e tij, u ridrejtua tërësisht në çështjen e Allahut.",
  },
  {
    name: "Sa'd ibn Ebi Vakas",
    epithet: "Allahu qoftë i kënaqur me të",
    summary: "Njëri prej dhjetë Xhenetit të premtuar; harkëtar i famshëm i komunitetit.",
    role: "Shigjetari në Uhud; më vonë udhëhoqi ushtritë muslimane në el-Kadisijah nën kalifin Umar.",
    lesson:
      "Disiplina në rolin e dikujt - gjuajtja me hark përcaktoi shërbimin e tij; ai më vonë e barti atë saktësi në udhëheqjen e një kombi.",
  },
  {
    name: "Salman al-Farisi",
    epithet: "Allahu qoftë i kënaqur me të",
    summary:
      "Një kërkues nga Persia i cili iu bashkua muslimanëve në Medine pas një udhëtimi të gjatë shpirtëror.",
    role: "Propozoi gërmimin e hendekut - një taktikë persiane e panjohur për arabët.",
    lesson:
      "Mençuria mund të vijë nga çdo prejardhje - shura do të thotë të dëgjosh ekspertizë kudo që e vendos Allahu.",
  },
  {
    name: "Zejd ibn Harithah",
    epithet: "Allahu qoftë i kënaqur me të",
    summary:
      "Njeriu i liruar dhe shoku i dashur i Profetit, dhe komandanti i parë i caktuar mbi një ushtri muslimane.",
    role: "Udhëhoqi ekspeditën në Mu'tah; ra dëshmor aty si i pari nga tre komandantët e emëruar që ra.",
    lesson:
      "Merita mbi prejardhjen - ai u zgjodh për të udhëhequr kur ishin të pranishëm burra të rangut më të lartë fisnor.",
  },
  {
    name: "Sa'd ibn Muadh",
    epithet: "Allahu qoftë i kënaqur me të",
    summary: "Prijësi i Evëve të Medinës, njëri prej ensarëve më të hershëm dhe më të respektuar.",
    role: "I plagosur në llogore; të zgjedhur nga Benu Kurejzehu si arbitri i fatit të tyre.",
    lesson:
      "Drejtësia nëpërmjet një gjyqtari të rënë dakord - edhe një armiku të mundur iu lejua një arbitër i paanshëm dhe jo një hakmarrje e pakontrolluar; ai vdiq menjëherë pas plagës.",
  },
];

export const BATTLES_LESSON_CARDS_SQ: DeepPartial<BattlesLessonCard>[] = [
  {
    battleTitle: "Beteja e Bedrit",
    lesson: "Besojuni Allahut ndërsa përgatiteni plotësisht.",
    detail:
      "Të shumtë në numër afërsisht tre me një, muslimanët ende zgjodhën tokën e tyre te puset, rregulluan radhët e tyre dhe bënin dua - Profeti ﷺ iu lut Allahut gjatë natës derisa i ra petku. Përpjekja dhe mbështetja së bashku, dhe fitorja iu besua Allahut.",
  },
  {
    battleTitle: "Beteja e Uhudit",
    lesson: "Bindja ndaj komandës mbron komunitetin.",
    detail:
      "Shigjetarët që lanë postin e tyre duke kërkuar plaçkë hapën një krah që gati shkatërroi ushtrinë. Kur'ani e shënon këtë si një mësim për çdo brez në lidhje me disiplinën.",
  },
  {
    battleTitle: "Beteja e Hendekut",
    lesson: "Planifikimi dhe konsultimi shumëfishojnë forcën.",
    detail:
      "Ideja e llogores së Salmanit, e kombinuar me shurën e Profetit dhe punën e besimtarëve, neutralizoi një koalicion shumë më të madh se mbrojtësit.",
  },
  {
    battleTitle: "Marrëveshja e Hudejbijes",
    lesson: "Durimi mund të jetë fitorja më e vërtetë.",
    detail:
      "Shokët e ndjenë armëpushimin si një poshtërim dhe Omeri e vuri në dyshim atë haptazi; Surja el-Fath u përgjigj duke e quajtur atë një fitore të dukshme. Paqja dhjetëvjeçare hapi rrugët, Islami u përhap më shpejt se kurrë dhe brenda dy vjetësh u hap rruga për në Mekë.",
  },
  {
    battleTitle: "Benu Kurejzeh",
    lesson: "Thyerja e një besëlidhjeje të mbrojtjes është ndër tradhtitë më të rënda.",
    detail:
      "Benu Kurejza e prishi besëlidhjen e Medinës pikërisht në momentin që konfederatat rrethuan qytetin. Megjithatë, Profeti ﷺ i la të gjykoheshin nga një arbitër që ata vetë e zgjodhën - drejtësia përmes një gjykatësi të dakorduar, jo hakmarrja e pakontrolluar.",
  },
  {
    battleTitle: "Pushtimi i Mekës",
    lesson: "Mëshira pas fitores lartëson një pushtues.",
    detail:
      'Me qytetin që e kishte torturuar dhe dëbuar tani në mëshirën e tij, Profeti ﷺ i bëri jehonë fjalëve të Profetit Jusuf: "Nuk të fajësohesh sot - shko, je i lirë". Një amnisti e përgjithshme zëvendësoi hakmarrjen dhe u fituan zemra që asnjë dënim nuk mund t\'i fitonte.',
  },
  {
    battleTitle: "Beteja e Hunejnit",
    lesson: "Numrat dhe suksesi i fundit nuk garantojnë fitoren.",
    detail:
      "Krenaria për përmasat e ushtrisë pas Mekës kontribuoi në panikun fillestar. Besimtarët u grumbulluan vetëm kur u kthyen te Profeti ﷺ dhe te Allahu.",
  },
  {
    battleTitle: "Ekspedita e Tebukut",
    lesson: "Sakrifica në vështirësi ekspozon besimin e vërtetë.",
    detail:
      "Marshimi u zhvillua në vapë përvëluese kundër një armiku të frikshëm. Ata që dhanë pasurinë e tyre dhe ata që marshuan pavarësisht varfërisë u lavdëruan njësoj.",
  },
  {
    battleTitle: "Beteja e Mutahut",
    lesson: "Vazhdimi i lidershipit duhet të planifikohet.",
    detail:
      "Profeti ﷺ emëroi tre komandantë sipas radhës. Kur të tre ranë, Khalid riorganizoi tërheqjen - shpëtimi i ushtrisë ishte në vetvete një fitore.",
  },
];

export const BATTLES_GLOSSARY_SQ: DeepPartial<BattlesGlossaryTerm>[] = [
  {
    term: "Gazvah",
    definition:
      "Një ekspeditë ushtarake në të cilën mori pjesë vetë Profeti a.s. Shembujt përfshijnë Bedrin, Uhudin dhe Tebukun.",
  },
  {
    term: "Sarijah",
    definition:
      "Një detashment i dërguar nën një komandant pa u bashkuar Pejgamberi ﷺ në marshim. Dhjetra ndodhën për zbulim, diplomaci ose përgjigje ndaj bastisjeve.",
  },
  {
    term: "muhaxhirë",
    definition:
      "Mërgimtarët që u larguan nga Meka për në Medine për hir të Allahut. Ata formuan bërthamën e komunitetit të hershëm mysliman krahas ensarëve.",
  },
  {
    term: "Ensarët",
    definition:
      "Ndihmësit - muslimanët e Medinës që pritën muhaxhirët, ndanë pasurinë e tyre dhe mbrojtën qytetin në vitet e para.",
  },
  {
    term: "Shura",
    definition:
      "Konsultimi i ndërsjellë përpara vendimeve të mëdha. Strategjia e hendekut dhe përgatitjet për Uhudin ilustrojnë konsultimin në modelin profetik.",
  },
  {
    term: "Bay'ah",
    definition:
      "Një premtim besnikërie - bindje politike dhe shpirtërore ndaj udhëheqësit. Betimet e el-Akabes i paraprinë hixhretit.",
  },
  {
    term: "Hixhreti",
    definition:
      "Emigrimi për hir të Allahut - nga Meka në Medine në kontekstin profetik. Viti 1 hixhri fillon me këtë shpërngulje.",
  },
  {
    term: "Amir",
    definition:
      "Një komandant ose udhëheqës i caktuar për një ushtri ose ekspeditë. Pejgamberi ﷺ caktoi udhëheqës për saraja dhe emëroi pasardhës nëse ata binin.",
  },
  {
    term: "Rayah",
    definition:
      "Një standard ose flamur i mbajtur në krye të një ushtrie. Mbajtja e flamurit të Profetit ishte një shenjë nderi dhe përgjegjësie.",
  },
  {
    term: "Liwa",
    definition:
      "Një standard më i madh i ushtrisë, ndonjëherë i dallueshëm nga rāyah personal. Udhëheqja e një liwa tregonte komandën mbi një forcë të madhe.",
  },
  {
    term: "Xhihadi",
    definition:
      "Përpjekja për çështjen e Allahut - kryesisht lufta e shpirtit dhe në formën e saj të rregulluar ushtarake, mbrojtja dhe largimi i agresionit kur urdhërohet.",
  },
  {
    term: "Fi sabilillah",
    definition:
      "Në rrugën e Allahut - qëllimi që e dallon luftën legjitime nga hakmarrja fisnore ose pushtimi i kësaj bote.",
  },
  {
    term: "Aman",
    definition:
      "Siguria ose sjellja e sigurt që u jepet të dërguarve, tregtarëve ose joluftëtarëve. Shkelja e amanit është e ndaluar në ligjin Islami të luftës.",
  },
  {
    term: "Sulh",
    definition:
      "Një armëpushim ose zgjidhje paqeje. Traktati i Hudejbijes është shembulli kryesor i zgjedhjes së paqes kur i shërben të mirës më të madhe.",
  },
  {
    term: "Fath",
    definition:
      "Hapja ose pushtimi - përdoret shpesh për hapjen paqësore të Mekës (Fath Mekë) dhe jo për një rrethim të dhunshëm.",
  },
];
