// Albanian translation overlay for the Learn "The Last Day" content. Mirrors the order of
// its English source in ../last-day*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  LastDayHadithEntry,
  LastDayQuizQuestion,
  LastDayReferenceEntry,
  LastDayTimelineEvent,
  LastDayTopic,
  LastDayVerseEntry,
} from "../../types/last-day";
import type { DeepPartial } from "./localize";

export const LAST_DAY_TOPICS_SQ: DeepPartial<LastDayTopic>[] = [
  {
    title: "Hyrje",
    summary: "Cila është Dita e Fundit dhe pse ndryshon mënyra se si jetojmë sot?",
    body: [
      "Jewm al-Kiyameh - Dita e Qëndrimit, Ringjalljes dhe Gjykimit - është dita kur çdo shpirt kthehet tek Allahu për t'i treguar veprat e tij dhe për t'i dhënë vendbanimin e tij përfundimtar. Nuk është një legjendë e largët apo një imazh poetik. Kurani e përmend atë pothuajse në çdo faqe dhe suret më të hershme mekase mbizotërohen prej tij pikërisht sepse besimi në të riorganizon tërë jetën e njeriut. Kur me të vërtetë prisni të qëndroni përpara Allahut, ndershmëria, lutja, mirësia dhe vetëpërmbajtja pushojnë së qeni dekorime opsionale dhe bëhen substancë e asaj që jeni.",
      "Ky modul e përshkon udhëtimin hap pas hapi: vdekja dhe largimi i shpirtit, intervali i berzahut në varr, shenjat e vogla dhe të mëdha që i paraprijnë Kiametit, fryrja e Surit, ringjallja e trupave, mbledhja në një fushë të gjerë, shpërndarja e dokumenteve, peshoren, llogaritja e dy kryqit dhe ndërrimi i Profetit. shtëpitë e përjetshme - Parajsa dhe Ferri. Çdo fazë është nxjerrë nga Kur'ani dhe hadithet autentike.",
      "Dy parime rregullojnë gjithçka këtu. Së pari, realiteti i këtyre ngjarjeve është i sigurt dhe është çështje besimi (akide); të mohosh ringjalljen ose përgjegjësinë është të mohosh vetë fenë. Së dyti, koha e saktë e Kiametit është e njohur vetëm për Allahun – asnjë dijetar, kalendar apo llogaritje nuk mund ta parashikojë atë, dhe çdo pretendim për një datë është i rremë. Pejgamberi ﷺ kurrë nuk u bëri shokëve të tij një numërim mbrapsht; ai u dha atyre një mënyrë për të jetuar. Pra, qëllimi i studimit të Ditës së Fundit është përgatitja, jo parashikimi: për të zbutur zemrën, për të korrigjuar përparësitë dhe për të garuar drejt së mirës përpara se të arrijë momenti i caktuar.",
      "Një shënim mbi burimet: bisedat popullore 'shenjat e fundit të kohëve' janë plot me tregime të dobëta, madje edhe të sajuara. Ky modul përfshin vetëm atë që është autentike, dhe aty ku dijetarët e sinqertë sunitë vërtet ndryshojnë - për shembull në renditjen e disa shenjave kryesore - ai ndryshim paraqitet si një ndryshim, jo ​​i zbutur apo i ekzagjeruar.",
    ],
    quran: [
      {
        excerpt:
          "Kur toka tronditet me tërmetin e saj përfundimtar, dhe ajo i hedh barrat e saj, dhe njeriu bërtet: Çfarë ka me të? - atë Ditë do të transmetojë lajmet e saj, sepse Zoti yt e ka frymëzuar atë. Atë Ditë njerëzit do të nisen në grupe të veçanta për t'u treguar veprat e tyre; kështu që kushdo që bën të mirën sa një grimcë do ta shohë atë, dhe kushdo që bën të keqen sa një grimcë do ta shohë atë.",
      },
      {
        excerpt:
          "Ai ia jep frymëzimin e urdhrit të Tij kujt të dojë nga robërit e Tij për të paralajmëruar për Ditën e Takimit – Ditën kur ata do të dalin, dhe asgjë për ta nuk është e fshehur nga Allahu. Kujt i takon sovraniteti sot? Për Allahun, Një, Mbizotërues.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Pse besoni në Ditën e Fundit?",
    summary: "Një nga gjashtë nenet e besimit - motivimi, shpresa dhe drejtësia përfundimtare.",
    body: [
      "Besimi në Ditën e Fundit është një nga gjashtë nenet e imanit që Profeti ﷺ i emëroi kur engjëlli Xhibril erdhi për të mësuar fenë: të besosh Allahun, engjëjt e Tij, librat e Tij, të dërguarit e Tij, Ditën e Fundit dhe në caktimin hyjnor, të mirat dhe dëmet e tij (Sahih Mysliman 8). Pa këtë besim, e gjithë struktura e llogaridhënies shembet - sepse nëse nuk ka kthim tek Allahu, atëherë tirani dhe shenjtori përfundojnë njësoj dhe çdo akt adhurimi bëhet një zakon pa kuptim përfundimtar.",
      "Kur'ani argumenton për Ditën e Fundit si moralisht ashtu edhe racionalisht. Moralisht: është përgjigja ndaj padrejtësisë, sepse një botë në të cilën shtypësit vdesin të qetë në shtretërit e tyre dhe të shtypurit vdesin pa hak, nuk mund të jetë fundi i historisë nëse Allahu është vërtet i drejtë. Racionalisht: Ai që ju krijoi nga asgjëja herën e parë nuk është i paaftë t'ju rivendosë për herë të dytë (Kur'an 36:78–79). Ringjallja është më e lehtë, jo më e vështirë, sesa krijimi origjinal.",
      "Ky besim disiplinon gjithashtu dy motorët e zemrës - frikën dhe shpresën - dhe i mban ato në ekuilibër. Paralajmërimet janë reale, kështu që besimtari nuk bëhet arrogant apo i pavëmendshëm; megjithatë mëshira e Allahut është e madhe dhe dera e pendimit qëndron e hapur deri në vdekje, kështu që besimtari nuk dëshpërohet kurrë. Një zemër që jeton mes frikës dhe shpresës është një zemër që vazhdon të përpiqet pa u thyer.",
      "Praktikisht, Dita e Fundit i jep dinjitet të pafuqishmit dhe frenim të fuqishmit. Ai u thotë të padrejtëve se asnjë lëndim nuk harrohet nga Allahu, dhe i thotë të fortëve se asnjë pasuri, status apo ndikim nuk do t'i mbrojë ata në llogari. Prandaj, besimi në të nuk është një rehati private, por një burim drejtësie, durimi dhe integriteti në këtë botë.",
    ],
    quran: [
      {
        excerpt:
          "Drejtësi nuk është që t'i ktheni fytyrat nga lindja ose perëndimi, por i drejtë është ai që i beson Allahut, Ditës së Fundit, engjëjve, librit dhe profetëve dhe u jep pasuri, pavarësisht nga dashuria për të, të afërmve, jetimëve, nevojtarëve, udhëtarit dhe atyre që kërkojnë.",
      },
      {
        excerpt:
          "Kurrë mos mendo se Allahu është i pavetëdijshëm për atë që bëjnë keqbërësit. Ai i vonon ato vetëm për një ditë kur sytë do të shikojnë të tmerruar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Imani është që të besosh Allahun, engjëjt e Tij, librat e Tij, të dërguarit e Tij, Ditën e Fundit dhe të besosh në caktimin hyjnor, të mirën dhe dëmin e tij. - nga hadithi i Xhibrilit, kur erdhi për të mësuar fenë.",
      },
    ],
    actions: [
      "Përtërijeni qëllimin tuaj çdo ditë: veprat e mia janë për Allahun dhe për ditën kur do ta takoj Atë.",
      "Kur padrejtësia të dhemb dhe asnjë gjykatë tokësore nuk përgjigjet, ia beso Gjykatës së Ditës së Fundit.",
      "Mbajeni frikën dhe shpresën së bashku - as frika le të mos ju dërrmojë në dëshpërim dhe as shpresa të mos ju lërë pas dore.",
    ],
    appLinks: [{}],
  },
  {
    title: "Vdekja",
    summary:
      "Çdo shpirt do ta shijojë vdekjen - Husn al-Khatimah dhe çfarë i sjell dobi të ndjerit.",
    body: [
      "Vdekja është takimi i vetëm që askush nuk e humb. Kur'ani e thotë qartë: çdo shpirt do ta shijojë vdekjen dhe shpërblimi i plotë jepet vetëm në Ditën e Kiametit (Kur'an 3:185). Vdekja nuk është asgjësim, por një transferim - shpirti largohet nga trupi dhe kalon në fazën tjetër të udhëtimit të tij. Engjëlli i vdekjes, i besuar nga Allahu, merr shpirtin dhe pastaj ju ktheheni te Zoti juaj (Kur'an 32:11).",
      "Për shkak se mënyra e vdekjes ka rëndësi, besimtari punon drejt një përfundimi të mirë - Husn al-Khatimah - përmes pendimit të sinqertë, lutjes së vazhdueshme dhe karakterit të mirë, duke shpresuar të vdesë në një gjendje me të cilën Allahu është i kënaqur. Një fund i keq - su' al-khatima - i frikësohet një personi që këmbëngul në mëkat dhe largohet pa u penduar. Megjithatë, mëshira në këtë është e pamasë: dera e teubes qëndron e hapur derisa rrahja e vdekjes të arrijë në fyt, kështu që askush nuk duhet të arrijë kurrë në përfundimin se është tepër vonë derisa të mbetet fryma.",
      "Profeti ﷺ mësoi përmendjen e shpeshtë të vdekjes - 'Përkujto shpesh shkatërruesin e kënaqësive', që do të thotë vdekje (Xhami'et-Tirmidhi 2307, hasan) - jo për të na bërë të sëmurë, por për të na mbajtur zgjuar. Të kujtuarit e vdekjes zvogëlon kontrollin e kësaj bote, shpërndan inatet dhe riorganizon atë që në të vërtetë ka rëndësi. Detajet e largimit të shpirtit që shfaqen vetëm në raportet e dobëta janë më mirë të lihen mënjanë; Materiali autentik mjafton për të ngjallur frikë dhe gatishmëri.",
      "Vdekja gjithashtu mbyll librin e veprave - me tre përjashtime. Pejgamberi ﷺ ka thënë se kur njeriu vdes, i ndërpriten veprat e tij, përveç tri: sadakaja e vazhdueshme (sadakaja xherija), dituria që vazhdon të përfitojë dhe një fëmijë i drejtë që lutet për të (Sahih Mysliman 1631). Kjo është thellësisht praktike: do të thotë që ajo që ndërton, mëson dhe rrit ndërsa je gjallë mund të vazhdojë të fitojë për ty shumë kohë pasi të jesh larguar.",
    ],
    quran: [
      {
        excerpt:
          "Çdo shpirt do ta shijojë vdekjen dhe do t'ju jepet kompensimi i plotë vetëm në Ditën e Kijametit. Pra, kushdo që tërhiqet nga zjarri dhe futet në Xhenet ka arritur sukses. Dhe jeta e kësaj bote është vetëm kënaqësi e mashtrimit.",
      },
      {
        excerpt:
          "Thuaj: Engjëlli i vdekjes, të cilit ju është besuar, do t'ju marrë; atëherë te Zoti juaj do të ktheheni.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kur njeriu vdes, veprat e tij përfundojnë, përveç tri: bamirësisë së vazhdueshme, diturisë nga e cila përfitohet, ose një fëmije të drejtë që lutet për të.",
      },
      {
        excerpt: "Mos harroni shpesh shkatërruesin e kënaqësive - domethënë vdekjen.",
      },
    ],
    actions: [
      "Shtoni istigfarin dhe faluni me kohë – veçanërisht kur jeni të shëndetshëm dhe të zënë, jo vetëm kur jeni të sëmurë.",
      "Pendohuni sot për çdo gjë specifike që po vononi; mos luani kumar për nesër.",
      "Investoni në tri veprat e qëndrueshme: ndërtoni bamirësi të vazhdueshme, përhapni njohuri të dobishme dhe rritni fëmijët me teuhid dhe karakter të mirë.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Barzakh (jeta në varr)",
    summary: "Intervali pas vdekjes deri në ringjallje - pyetja dhe pasojat e saj.",
    body: [
      "Barzakh do të thotë pengesë dhe është emri për të gjithë intervalin ndërmjet vdekjes së një personi dhe Ditës së Ringjalljes. Kur'ani përdor fjalën kur keqbërësi i vdekur lutet të kthehet: \"Pas tyre është një pengesë (berzakh) deri në Ditën që ata të ringjallen\" (Kur'an 23:100) - një mur i fortë përmes të cilit nuk ka kthim në këtë jetë. Qoftë nëse një trup varroset, digjet, mbytet apo humbet, shpirti hyn në barzakh; varri është thjesht forma e tij më e zakonshme dhe faza e parë e Ahiretit për çdo qenie njerëzore.",
      "Raportet autentike përshkruajnë një pyetje pas varrimit. Dy engjëj vijnë dhe i bëjnë të ndjerit tre pyetje: Kush është Zoti juaj? Cila është feja juaj? Kush është ky njeri që ju dërguan? Besimtari të cilin Allahu e mban të vendosur përgjigjet: Zoti im është Allahu, feja ime është Islami dhe ky është Muhamedi a.s. pastaj i zgjerohet dhe ndizet varri. Ai që ishte i pavëmendshëm thotë: \"Ah, nuk e di\" dhe takohet me shtrëngim (Xhami'et-Tirmidhi 1071, hasen, ku dy engjëjt quhen Munker dhe Nakir). Kjo është arsyeja pse Kurani e lavdëron Allahun që i mbajti besimtarët të patundur 'me fjalën e fortë në këtë botë dhe në botën tjetër' (Kur'an 14:27).",
      "Lumturia ose ndëshkimi pason më pas në varr, i pohuar në tekste autentike: 'Varri është ose një kopsht nga kopshtet e Xhenetit ose një gropë nga gropat e zjarrit' (Xhami'et-Tirmidhi 2460, hasen sahih). Kur'ani aludon për dënimin e popullit të Faraonit për t'u ekspozuar ndaj zjarrit 'mëngjes dhe mbrëmje' para se të arrijë Kiameti (Kur'an 40:46). Ehli Suneti pohojnë realitetin e shpërblimit dhe dënimit të rëndë duke ia lënë Allahut natyrën e saktë të tij, pasi që i përket të padukshmes dhe nuk mund të perceptohet nga të gjallët.",
      "Ka marrëveshje që pyetja e rëndë dhe lumturia ose mundimi i varrit janë reale; studiuesit diskutojnë pikat më të holla - të tilla si nëse prek trupin, shpirtin ose të dyja, dhe si arrin tek ata pa varr të zakonshëm - pa i lënë ato pyetje të shpërqendrohen nga pika. Barzakh është motivuesi i madh: ai e kthen varrin nga një vrimë në tokë në një pasqyrë të veprave të veta dhe e bën të qartë se ajo që dërgoni përpara është ajo që do t'ju përshëndes atje.",
    ],
    quran: [
      {
        excerpt:
          "Derisa, kur njërit prej tyre i vjen vdekja, ai thotë: “Zoti im, më kthe mua, që të bëj vepra të mira në atë që kam lënë pas”. Jo! Është vetëm një fjalë që ai thotë; dhe pas tyre ka një pengesë deri në Ditën që do të ringjallen.",
      },
      {
        excerpt:
          "Zjarri - ata janë të ekspozuar ndaj tij në mëngjes dhe në mbrëmje. Dhe ditën kur do të shfaqet kijameti, do të thuhet: Pranoi popullin e Faraonit në dënimin më të ashpër.",
      },
    ],
    hadith: [
      {
        excerpt: "Varri është ose kopsht nga kopshtet e Xhenetit ose gropë nga gropat e zjarrit.",
      },
      {
        excerpt:
          "Kur varroset i ndjeri, i vijnë dy engjëj dhe e pyesin: Kush është Zoti yt? Cila është feja juaj? Kush është profeti juaj? Besimtari përgjigjet me siguri dhe varri i tij zgjerohet dhe ndizet për të.",
      },
    ],
    misconceptions: [
      "Keqkuptim: Ndëshkimi i rëndë është një besim popullor pa bazë. Korrigjimi: Realiteti i pyetjes dhe i lumturisë ose mundimit të varrit është vërtetuar në hadithin autentik dhe aludohet në Kur'an; është një pikë e vendosur e besimit sunit.",
      "Keqkuptim: Duhet të debatojmë për pamjen e saktë dhe emrat e engjëjve. Korrigjim: Emërtimi i Munkarit dhe Nakirit vjen në një raport hasen; besimi thelbësor është vetë pyetja. Përgatitja për t'iu përgjigjur me vërtetësi ka shumë më tepër rëndësi sesa debatimi për detajet e tij.",
    ],
    actions: [
      "Përmbahuni fort pas teuhidit dhe Sunetit tani - përgjigjet e varrit nuk mësohen përmendësh atje, por jetojnë këtu.",
      "Ruaje adkerin e mëngjesit dhe të mbrëmjes, të cilin Profeti (a.s.) e mësoi si mbrojtje dhe qëndrueshmëri.",
    ],
    appLinks: [{}],
  },
  {
    title: "Shenjat e Ditës së Fundit",
    summary: "Shenjat e vogla dhe të mëdha - siguria e orës, koha e panjohur.",
    body: [
      "Ardhja e Kiametit është e sigurt, por koha e tij është një sekret që Allahu e ka mbajtur për Vete. Kur edhe Profeti a.s u pyet se kur do të vinte, përgjigjja e dhënë ishte se i pyeturi nuk di më shumë se ai që pyet - dituria e tij është vetëm tek Allahu (Kur'an 7:187). Pra, gjëja e parë që duhet vendosur përpara se të studioni ndonjë 'shenjë' është kjo: jepen shenja për të na përgatitur, për të mos na lënë kurrë të llogarisim një datë. Kushdo që emërton një vit për Kiametin, ka kundërshtuar Kuranin.",
      "Dijetarët i grupojnë argumentet në dy lloje. Shenjat e vogla (al-'alamat al-sughra) janë ndryshime graduale shoqërore, morale dhe botërore që ndërtohen gjatë shekujve të gjatë para fundit. Shenjat kryesore (al-'alamat al-kubra) janë një grup ngjarjesh të jashtëzakonshme, të pagabueshme që afrohen afër fundit. Kurani vëren se 'disa nga shenjat e tij tashmë kanë ardhur' (Kur'an 47:18) - një referencë që kuptohet se përfshin ardhjen e vetë Profetit ﷺ dhe çarjen e hënës.",
      "Teksti i ankorimit për shenjat kryesore është hadithi i Hudhejfe ibn Usejdit, në të cilin Profeti ﷺ renditi dhjetë: tymi (Dukhan), Dexhalli, Bisha e tokës (Dabbat al-Ard), lindja e diellit nga vendi i perëndimit të tij (perëndimi), zbritja e 'Isa, ibn Xhug'm' (dhe Mexhhuja). rrëshqitje të mëdha dheu - një në lindje, një në perëndim dhe një në Gadishullin Arabik - të vulosura nga një zjarr që i çon njerëzit në vendin e tyre të grumbullimit (Sahih Mysliman 2901). Mehdiu dhe Dexhalli vijnë në raporte të tjera autentike dhe janë vendosur para zbritjes së Isait.",
      "Qëndrimi i sinqertë i dijetarëve është se përderisa çdo shenjë pohohet, rendi i saktë i tyre nuk është plotësisht i fiksuar nga tekstet, dhe dijetarët me reputacion sunitë ndryshojnë në sekuencën e saktë. Ky dallim është një pjesë normale e traditës dhe nuk ka arsye për mosmarrëveshje. Përgjigja profetike ndaj të gjithave nuk është frikësuese apo spekulime të pafundme rreth ngjarjeve aktuale, por rritje e imanit, pendimit dhe veprimit të dobishëm.",
    ],
    quran: [
      {
        excerpt:
          "Të pyesin për kijametin: kur vjen ai? Thuaj: Dija e saj është vetëm te Zoti im. Askush nuk do ta zbulojë kohën e vet përveç Tij. Ai është i rëndë në qiej dhe në tokë. Nuk do t'ju vijë veçse papritur.",
      },
      {
        excerpt:
          "A presin ata përveç që t'u vijë Kijameti papritmas? Disa nga shenjat e saj tashmë kanë ardhur. Por si do të përkujtohen, kur t'u ketë ardhur ajo?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kijameti nuk do të vijë derisa të shihni dhjetë shenja para tij: tymi, Dexhalli, Bisha, lindja e diellit nga perëndimi, zbritja e Isait, birit të Merjemes, Jexhuxhit dhe Mexhuxhit, tre rrëshqitje dheu - një në lindje, një në perëndim dhe një në gadishullin Arabik - dhe zjarri i fundit i shtyn njerëzit e tyre drejt një.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shenja të vogla",
    summary:
      "Ndryshimet graduale që i përshkroi Profeti (sal-lAllahu alejhi ue sel-lem) – përgatitje mbi panik.",
    body: [
      'Shenjat e vogla janë ndryshimet e ngadalta, të grumbulluara në shoqëri, morali dhe gjendja e diturisë që Profeti ﷺ i përshkroi si rritje sa më shumë afrohet Kiameti. Ato janë të shumta dhe nga natyra e tyre ato shpalosen në periudha të gjata kohore dhe jo në një moment të vetëm dramatik. Shenja më e vogël e të gjithave, në fakt, tashmë ka ndodhur: dërgimi i vetë Profetit Muhamed ﷺ, i cili tha: "Unë dhe Kiameti u dërguam si këta të dy", duke bashkuar dy gishtat e tij - që do të thotë se i dërguari i fundit dhe epoka e fundit kishin filluar.',
      "Ndër shenjat e përmendura në hadithin autentik: humbja e besueshmërisë, në mënyrë që punët t'u dorëzohen atyre që nuk janë të përshtatshëm për ta - 'Kur humbet besimi, atëherë prit Kiametin' dhe kjo ndodh 'kur t'u jepet autoriteti atyre që nuk e meritojnë' (Sahih el-Bukhari 6496). Në hadithin e famshëm të Xhibrilit, Profeti a.s. përmendi dy shenja të gjalla: 'që robëria do të lindë zonjën e saj dhe se do të shihni barinj zbathur, të zhveshur dhe të varfër që konkurrojnë në ndërtimin e ndërtesave të larta' (Sahih Mysliman 8).",
      "Të tjera përfshijnë një përshpejtim të përgjithshëm në ndjenjën e kohës, rritjen e tërmeteve dhe vrasjeve dhe zhdukjen e njohurive. Përsa i përket dijes, Profeti (a.s.) ishte i saktë në lidhje me mekanizmin: 'Nuk do të vendoset Ora derisa të hiqet dituria, tërmetet të rriten, koha të kalojë shpejt, të shfaqen mundimet dhe të shtohen vrasjet' (Sahih el-Bukhari 1036). Dhe ai shpjegoi se si largohet dituria: 'Allahu nuk e largon diturinë duke e rrëmbyer nga njerëzit, por duke ua marrë dijetarët, derisa të mos mbetet asnjë, dhe njerëzit i marrin injorantët si udhëheqës të cilët pyeten dhe japin vendime pa dituri, kështu që ata humbasin dhe i humbasin të tjerët' (Sahih el-Buhari 100). Pra, 'humbja e njohurive' nuk është një mungesë informacioni - një epokë mund të mbytet në të dhëna - por humbje e studiuesve të shëndoshë dhe praktikës së jetuar.",
      "Një disiplinë thelbësore këtu: është interpretuese, jo e sigurt, të deklarohet se një ngjarje specifike moderne 'është' një Hadith i veçantë i përmbushur. Garat e rrokaqiejve ose krimi në rritje mund t'i bëjnë jehonë fjalëve të Profetit, por caktimi i zbulesës në titujt me siguri nuk është mënyra e studiuesve të kujdesshëm. Përgjigja e saktë ndaj çdo shenje të vogël është e brendshme: lexojeni atë si një thirrje për t'u kthyer tek Allahu, për të mësuar dhe për të vepruar sipas fesë, dhe për t'u mbajtur fort pas besueshmërisë dhe vërtetës - jo si material për ankth apo spektakël.",
    ],
    hadith: [
      {
        excerpt:
          "Kur të humbet besimi, prit Kiametin. U pyet: Si do të humbet, o i Dërguar i Allahut? Ai tha: Kur t'u jepet autoriteti atyre që nuk e meritojnë atë, prisni Kiametin.",
      },
      {
        excerpt:
          "Ndër shenjat e Kiametit: se robëria do të lindë dashnoren e saj dhe se do të shohësh barinj zbathur, të zhveshur, të varfër që garojnë në ndërtimin e ndërtesave të larta. - nga hadithi i Xhibrilit.",
      },
      {
        excerpt:
          "Allahu nuk e largon diturinë duke e rrëmbyer, por e largon duke marrë dijetarët, derisa të mos mbetet asnjë dhe njerëzit të marrin injorantët si prijës të cilët japin vendime pa dituri, kështu që devijojnë dhe i humbin të tjerët.",
      },
    ],
    disclaimer:
      "Zbatimi i shenjave specifike të vogla në ngjarje të veçanta aktuale është interpretues, jo i sigurt. Ky modul paraqet hadithin autentik pa pohuar se cilat dukuri moderne i përmbushin përfundimisht.",
    actions: [
      "Kërkoni njohuri të dobishme nga mësues të kualifikuar, veproni sipas saj dhe përcillni atë - kjo i reziston drejtpërdrejt shenjës së dijes që zhduket.",
      "Ruajeni besueshmërinë dhe vërtetësinë në fjalimin, punën dhe marrëdhëniet tuaja.",
      "Lexoni çdo shenjë nga brenda si thirrje për pendim, jo ​​si lëndë djegëse për panik apo spekulime në internet.",
    ],
  },
  {
    title: "Shenjat kryesore",
    summary: "Dhjetë shenjat kryesore në Sahih Mysliman - Mehdiu, Dexhalli, 'Isai dhe më shumë.",
    body: [
      "Shenjat kryesore janë ngjarjet e mëdha, të pagabueshme që grumbullohen afër fundit të kohës. Karta e tyre është hadithi i Hudhejfe ibn Usejdit: Profeti (sal-lAllahu alejhi ue sel-lem) i shikoi shokët e tij duke diskutuar rreth Kiametit dhe tha se nuk do të vinte derisa të shihnin dhjetë shenja - tymin (Dukhan), Dexhallin, Bishën e tokës (Dabbat el-Ard), lindjen e diellit nga perëndimi, zbritjen e 'Mexhxhxh', Mexhuxh'. tre rrëshqitje dheu (lindje, perëndim dhe në Arabi), dhe në fund një zjarr që i shtyn njerëzit në vendin e tyre të grumbullimit (Sahih Mysliman 2901). Ndryshe nga shenjat e vogla, pasi ato fillojnë, ato ndjekin njëra-tjetrën nga afër.",
      "Al-Mehdiu vjen në raporte autentike si një udhëheqës i drejtë nga familja e Profetit ﷺ i cili do ta mbushë tokën me drejtësi ashtu siç ishte mbushur me shtypje (Sunen Ebi Davud 4282, Hasan). Ai nuk është ligjvënës apo profet i ri - ai ringjall, nuk shpik - dhe besimi në të pohohet nga Ehli Suneti, ndërsa detajet shtesë në transmetimet e dobëta janë lënë mënjanë.",
      "Dexhalli (Mesia i rremë) është sprova e vetme më e madhe e kësaj bote. Profeti ﷺ e përshkroi atë gjerësisht në hadithin e gjatë të el-Newwas ibn Sam'an (Sahih Mysliman 2937): një mashtrues me një sy me 'Kafir' të shkruar në mes të syve të tij, i dha fuqi për të testuar besimin, për të cilin çdo profet i paralajmëroi popullin e tij. Fitneja e tij mposhtet jo me argument, por me besim të fortë, dhe Profeti ﷺ mësoi mësimin përmendësh të vargjeve fillestare të sures el-Kehf si mbrojtje.",
      "Atëherë do të zbresë Isa ibn Merjem (paqja qoftë mbi të) - një pikë e fortë e besimit sunit. Pejgamberi ﷺ tha: \"Pasha Atë në dorën e të cilit është shpirti im, djali i Merjemes së shpejti do të zbresë mes jush si sundimtar i drejtë; ai do të thyejë kryqin, do të vrasë derrat dhe do të shfuqizojë xhizjen dhe pasuria do të vërshojë derisa askush të mos e pranojë atë' (Sahih el-Buhari 3448). Ai zbret si ndjekës i Muhamedit a.s., falet pas imamit të umetit (Sahih el-Bukhari 3439), vret Dexhallin dhe sundon sipas Sheriatit të Muhamedit a.s. Ja'xhuxh dhe Ma'xhuxh pastaj lirohen, dhe shenjat e mbetura shpalosen deri në zjarrin që mbledh njerëzimin.",
      "Dy pika ndershmërie. Së pari, dijetarët bien dakord mbi realitetin e çdo shenje në hadithin me dhjetë shenja, por ndryshojnë në renditjen e tyre të saktë dhe se dallimi është i ligjshëm dhe i vjetër. Së dyti, Dukhani dhe Bisha janë pjesë e vetë këtij hadithi sahih; disa transmetime të tjera që i detajojnë ato individualisht ndryshojnë në fuqi, kështu që ky modul mbështet besimin në raportin e fortë të dhjetë shenjave dhe jo në shtesat më të dobëta.",
    ],
    hadith: [
      {
        excerpt:
          "Kiameti nuk do të vijë derisa të shihni dhjetë shenja: tymin, Dexhallin, Bishën, lindjen e diellit nga perëndimi, zbritjen e Isait, birit të Merjemes, Jexhuxhit dhe Mexhuxhit, dhe tre rrëshqitje dheu - një në lindje, një në perëndim dhe një në gadishullin Arabik - i fundit prej tyre i shtyn njerëzit në zjarr.",
      },
      {
        excerpt:
          "Pasha Atë në dorën e të cilit është shpirti im, së shpejti do të zbresë në mesin tuaj biri i Merjemes si sundimtar i drejtë. Ai do të thyejë kryqin, do të vrasë derrat dhe do të shfuqizojë xhizjen dhe pasuria do të bëhet aq e bollshme sa askush nuk do ta pranojë atë.",
      },
      {
        excerpt:
          "Sikur të mbetej vetëm një ditë nga kjo botë, Allahu do ta zgjaste atë ditë derisa të ringjallte në të një burrë nga familja ime (Mehdiu) i cili do ta mbushë tokën me drejtësi ashtu siç ishte mbushur me padrejtësi dhe zullum.",
      },
    ],
    disclaimer:
      "Realiteti i shenjave kryesore është pohuar, por sekuenca dhe koha e tyre e saktë nuk bien dakord plotësisht nga studiuesit. Shmangni caktimin e datës dhe shmangni pretendimin se ndonjë figurë e sotme është Mehdiu, Dexhalli ose 'Isai.",
    appLinks: [{}],
  },
  {
    title: "Bori",
    summary: "Israfil - shpërthimi i parë, shpërthimi i dytë dhe ringjallja.",
    body: [
      'Kur Allahu të caktojë fundin, engjëlli që i është besuar Surit (Surit) do t\'i fryjë. Emërtimi i tij Israfil vjen përmes traditës dijetare; ajo që Kurani fikson me vendosmëri është vetë ngjarja dhe tmerri i saj. Pejgamberi ﷺ përcolli se sa e afërt është gjithmonë: "Si mund të jem i qetë kur bartësi i Surit e ka vendosur atë në gojë, ka përkulur ballin dhe pret urdhërin për të fryrë?" - dhe kur kjo i shqetësoi shokët, ai i mësoi ata të thoshin: "Na mjafton Allahu dhe Ai është Rregulluesi më i mirë i punëve" (Xhami\'et-Tirmidhi 2431, hasen).',
      "Janë dy shpërthime dhe Kur'ani i dallon ato. Në fillim, 'do t'i fryhet Surit dhe kushdo që është në qiej dhe në tokë do të bjerë i vdekur, përveç atij që do Allahu' (Kur'an 39:68) - shpërthimi i tmerrit dhe i vdekjes që i jep fund rendit të krijuar. Pastaj vjen e dyta: 'pastaj do të fryhet përsëri, dhe menjëherë ata do të qëndrojnë në këmbë dhe shikojnë' (vazhdon i njëjti varg) - shpërthimi i ringjalljes, në të cilin i gjithë krijimi ngrihet nga të vdekurit.",
      "Shumë dijetarë, nga i njëjti ajet dhe raportet mbështetëse, flasin për një përjashtim – ata “të cilët do Allahu” që nuk goditen – dhe për një interval ndërmjet dy shpërthimeve, megjithëse gjatësia dhe detajet e tij mbështeten në raporte me fuqi të ndryshme dhe i janë lënë Allahut. Siguria është çifti i shpërthimeve: një fund, pastaj një ngritje. Kjo quhet 'Dita e Paralajmërimit' (Kur'an 50:20) sepse është thirrja e fundit, e tingëlluar kur nuk ka më kohë për t'u përgatitur – kjo është pikërisht arsyeja pse thirrja duhet të përgjigjet tani.",
    ],
    quran: [
      {
        excerpt:
          "Dhe do t'i fryhet Surit, e kush është në qiej dhe kush është në tokë, do të bjerë i vdekur, përveç atij që do Allahu. Pastaj do të fryhet përsëri dhe menjëherë ata do të qëndrojnë në këmbë dhe do të shikojnë.",
      },
      {
        excerpt: "Dhe do t'i fryhet Surit. Ajo është Dita e Paralajmërimit.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Si mund të jem i qetë kur bartësi i Surit e ka vendosur në gojë dhe e ka përkulur ballin, duke pritur urdhrin për të fryrë? Sahabët ishin të shqetësuar, prandaj ai u tha atyre të thoshin: Allahu na mjafton dhe Ai është Rregulluesi më i mirë i punëve.",
      },
    ],
  },
  {
    title: "Ringjallja",
    summary: "Trupat e rivendosur - universaliteti i qëndrimit para Allahut.",
    body: [
      "Në shpërthimin e dytë, të vdekurit ringjallen, trup e shpirt, dhe ringjallja është reale dhe fizike, jo thjesht shpirtërore. Kur'ani ndeshet kokë më kokë me talljen e dyshuesit: një burrë mban një kockë të thërrmuar dhe pyet se kush mund t'i japë jetë; Përgjigja është: \"Thuaj: Ai do t'i japë jetë ai që e krijoi herën e parë dhe Ai di çdo krijim\" (Kur'an 36:78-79). Nëse të sjellësh në ekzistencë nga asgjëja ishte në fuqinë e Allahut, kthimi ty nuk është më i vështirë.",
      "Ringjallja është universale - çdo njeri nga i pari tek i fundit, i çdo kombi, është ngritur. Profeti ﷺ e përshkroi gjendjen në të cilën njerëzit ngrihen: 'Njerëzit do të mblidhen këmbëzbathur, të zhveshur dhe të parrethprerë.' Kur Aisheja pyeti e shqetësuar nëse burrat dhe gratë do të shikonin njëri-tjetrin, ai tha se çështja e asaj Dite do të ishte shumë e rëndë që të mos shqetësonte dikë (Sahih el-Bukhari 6527). Ai gjithashtu tha: 'Do të mblidheni këmbëzbathur, të zhveshur dhe të parrethprerë - dhe i pari që do të visheni në Ditën e Kijametit do të jetë Ibrahimi' (Sahih el-Bukhari 3349).",
      "Thelbi i doktrinës nuk është spektakli, por përgjegjësia që ajo zbaton. Për shkak se kthimi tek Allahu është i sigurt, asnjë vepër nuk është vërtet private dhe asnjë vdekje nuk është vërtet shpëtim. “Po vjen Kiameti – nuk ka dyshim në të – dhe Allahu do t’i ringjallë ata që janë në varre” (Kur’an 22:7). Besimi në ringjalljen trupore është ajo që e bën peshën morale të kësaj jete reale dhe jo të përkohshme.",
    ],
    quran: [
      {
        excerpt:
          "Dhe ai na sjell shembull dhe harron krijimin e vet, duke thënë: Kush do t'i ringjallë kockat derisa ato janë të kalbura? Thuaj: \"Atyre do t'i ringjallë Ai që i krijoi herën e parë dhe Ai është i Gjithëdijshëm për çdo krijim\".",
      },
      {
        excerpt:
          "Dhe se kijameti po vjen - nuk ka dyshim për këtë - dhe se Allahu do t'i ringjallë ata që janë në varre.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Do të mblidheni këmbëzbathur, lakuriq dhe të parrethprerë. Pastaj lexoi: Ashtu siç e filluam krijimin e parë, do ta përsërisim atë. Dhe i pari që do të vishet në Ditën e Kijametit do të jetë Ibrahimi.",
      },
      {
        excerpt:
          "Njerëzit do të mblidhen këmbëzbathur, lakuriq dhe të parrethprerë. Aishja tha: A do të shikohen burrat dhe gratë njëri-tjetrin? Ai tha: Çështja do të jetë shumë e rëndë për këtë.",
      },
    ],
  },
  {
    title: "Mbledhja (Mahshar)",
    summary: "Qëndrimi para Allahut - dielli afër, djersa dhe gjendja e njerëzve.",
    body: [
      "Pas ringjalljes, i gjithë krijimi drejtohet në një rrafshnaltë të gjerë e të niveluar - Mahshar - për të pritur gjykimin. Vetë toka është transformuar: 'Ditën kur toka do të zëvendësohet me një tokë tjetër, dhe qiejt gjithashtu, dhe ata do të dalin para Allahut, të Vetmit, Mbizotëruesit' (Kur'an 14:48). Nuk ka asnjë pikë referimi, nuk ka turma për t'u fshehur, nuk ka status ku të mbështetemi - vetëm çdo shpirt, i ekspozuar dhe në pritje.",
      "Kushtet e asaj qëndrimi janë të rënda. Pejgamberi ﷺ ka thënë: \"Ditën e Kiametit dielli do t'u afrohet njerëzve aq shumë sa do të jetë një milje larg dhe ata do të zhyten në djersën e tyre sipas veprave të tyre - disa në kyçin e këmbës, disa në gjunjë, disa në bel dhe disa djersa do t'i frenojë\" (Sahih Mysliman 2864). Megjithatë, të njëjtat raporte përshkruajnë mëshirën e shpërndarë me vepra: një kategori që Profeti ﷺ e emëroi do të mbulohet nën hijen e Arshit të Allahut në një ditë kur nuk ka hije përveç Tij - mes tyre prijësi i drejtë, i riu i rritur në adhurim dhe ai që dha sadaka aq fshehurazi dora e tij e majtë nuk dinte se çfarë shpenzoi dora e tij e djathtë.",
      "Pritja është e gjatë - Kur'ani flet për 'një ditë masa e së cilës është pesëdhjetë mijë vjet' (Kur'an 70:4) - por gjatësia e saj nuk është e njëjtë për të gjithë. Njoftimet autentike thonë se ai do të jetë i lehtë për besimtarin, aq i shkurtër sa koha ndërmjet dy namazeve, ndërsa i shtyn shumë të tjerët. Pra, Mahshar është vendi ku libri privat i një jete bëhet realitet publik: i njëjti diell, i njëjti fushë dhe përvoja krejtësisht të ndryshme, të nxjerra tërësisht nga ajo që secili person dërgoi përpara.",
    ],
    quran: [
      {
        excerpt:
          "Ditën kur toka do të zëvendësohet me një tokë tjetër, po ashtu edhe qiejt, dhe ata do të dalin para Allahut, Një dhe Mbizotërues.",
      },
      {
        excerpt:
          "Tek Ai ngjiten engjëjt dhe Shpirti në një ditë, masa e së cilës është pesëdhjetë mijë vjet.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dielli do t'u afrohet njerëzve në Ditën e Kiametit derisa të jetë rreth një milje larg dhe ata do të zhyten në djersë sipas veprave të tyre - disa në kyçin e këmbës, disa në gjunjë, disa në bel, e disa djersa do t'i frenojë.",
      },
    ],
  },
  {
    title: "Ndërmjetësimi (Shafa'ah)",
    summary: "Vetëm me lejen e Allahut - llojet dhe ndërmjetësimi më i madh.",
    body: [
      "Shefa'a është ndërmjetësim - njëra palë i flet Allahut në emër të tjetrës. Ajo është e vërtetë dhe është mëshirë, por nuk është kurrë e pavarur: askush nuk ndërmjetëson përveç me lejen paraprake të Allahut dhe vetëm për atë që Ai është i kënaqur. Kur'ani e shpreh rregullin dy herë: \"Kush është ai që mund të ndërmjetësojë tek Ai përveç me lejen e Tij?\" (Kur'an 2:255), dhe 'Ndërmjetësimi nuk bën dobi tek Ai përveç atij që Ai e lejon' (Kur'an 34:23). Ky kusht i vetëm është ajo që e ndan doktrinën islame të ndërmjetësimit nga çdo prishje e saj.",
      "Më i madhi nga të gjithë është Shafa'ah el-Udhma, i veçantë për Profetin Muhamed ﷺ. Në Mahshar, të dërrmuar nga qëndrimi i gjatë, njerëzimi do të shkojë nga profeti në profet - Ademi, Ibrahimi, Musai, Isai - secili duke u justifikuar, derisa të vijnë te Muhamedi a.s. Ai do të bjerë në sexhde nën Arsh dhe do t'i thuhet: 'Ngrije kokën, kërko dhe do të të jepet, ndërmjetëso dhe ndërmjetësimi yt do të pranohet' (Sahih el-Bukhari 7440; zinxhiri i plotë i profetëve është në Sahih Mysliman 195). Me të ai i kërkon Allahut që të fillojë llogarinë dhe të lehtësojë qëndrimin - një pozitë lavdërimi që i është premtuar vetëm atij.",
      "Pasojnë forma të tjera autentike: ndërmjetësimi që disa besimtarë të hyjnë në Xhenet pa llogari; ndërmjetësim që ngre gradë; dhe mbi të gjitha ndërmjetësimi për mëkatarët e rëndë në mesin e besimtarëve, në mënyrë që njerëzit të nxirren nga zjarri me ndërmjetësimin e Pejgamberit ﷺ, profetëve të tjerë, engjëjve, besimtarëve dhe së fundi me mëshirën e Allahut, i cili është Mëshiruesi i mëshiruesve. Profetët, martirët, të drejtët dhe madje edhe fëmijët që vdiqën të vegjël mund të ndërmjetësojnë me leje, megjithëse fuqia e raporteve individuale ndryshon.",
      "Kujdes thelbësor: ndërmjetësimi në Ahiret nuk lejon asnjëherë thirrjen e të vdekurve ose atyre që mungojnë për ndihmë tani. Të lutesh një profet ose një shenjtor në varr, duke u kërkuar atyre të lehtësojnë shqetësimet ose të plotësojnë nevojat, është t'i drejtosh adhurimin dikujt tjetër përveç Allahut - ky është shirk, dhe është e kundërta e shefatit të përshkruar këtu, që është një favor që Allahu ia jep atë Ditë kujt të dojë. As nuk e zëvendëson nevojën për besim dhe pendim në këtë jetë; është mëshira e Allahut ndaj atyre që jetuan dhe vdiqën me teuhid.",
    ],
    quran: [
      {
        excerpt:
          "Kush është ai që mund të ndërmjetësojë tek Ai përveçse me lejen e Tij? Ai e di atë që është para tyre dhe çfarë do të ndodhë pas tyre, dhe ata nuk përfshijnë asgjë nga dituria e Tij, përveç asaj që Ai dëshiron.",
      },
      {
        excerpt: "Ndërmjetësimi nuk i bën dobi vetëm atij që Ai e lejon.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Njerëzit do të vijnë tek unë dhe unë do të bie në sexhde para Allahut dhe do të thuhet: O Muhamed, ngrije kokën; kërkoni dhe do t'ju jepet, ndërmjetësoni dhe ndërmjetësimi juaj do të pranohet.",
      },
      {
        excerpt:
          "Njerëzimi do të shkojë te Ademi, pastaj te Ibrahimi, pastaj te Musai, pastaj te Isai dhe secili do të justifikohet derisa të vijnë te Muhamedi a.s. dhe atij i jepet ndërmjetësimi më i madh.",
      },
    ],
    misconceptions: [
      "Mendimi i gabuar: Të kërkosh ndërmjetësim do të thotë që Profeti a.s. ose të drejtët adhurohen. Korrigjim: Adhurimi i takon vetëm Allahut; Shefati në Ditën e Fundit është mëshirë që Allahu e jep me lejen e Tij dhe nuk e justifikon thirrjen e të vdekurve në këtë jetë.",
    ],
  },
  {
    title: "Procesverbali i Veprave",
    summary: "Regjistrimi i engjëjve - dora e djathtë, dora e majtë, asgjë e lënë jashtë.",
    body: [
      "Çdo qenie njerëzore ka dy skribë fisnikë të caktuar për të regjistruar veprat e tyre: 'Kur të dy pranuesit marrin, të ulur në të djathtë dhe në të majtë, ai nuk shqipton asnjë fjalë, por është me vete një vëzhgues i gatshëm për të regjistruar' (Kur'an 50:17–18). Në Ditën e Fundit shpërndahen këto shënime dhe mënyra e marrjes së librit është në vetvete vendimi i parë - në dorën e djathtë për të suksesshmit, në dorën e majtë ose nga pas shpine për të rrënuarit (Kur'an 84:7–12; 69:19–37).",
      "Asgjë nuk është lënë jashtë këtyre të dhënave - as akti më i vogël, as mendimi kalimtar që u bë vepër. Zullumqarët do të habiten nga plotësia e tij: “Do të thonë: O mjerë ne! Cili është ky libër që nuk lë asgjë të vogël apo të madhe përveç se e ka regjistruar? Dhe ata do të gjejnë atë që kanë bërë para tyre dhe Zoti yt nuk i bën padrejtësi askujt” (Kur'an 18:49). Me mëshirën e Allahut, qëllimet e mira dhe mëkatet e braktisura regjistrohen gjithashtu në favor të besimtarit.",
      'Sepse gjuha dhe gjymtyrët janë ato që mbushin faqet, ruajtja e tyre është ruajtja e të dhënave. Profeti ﷺ e bëri gjuhën në qendër të shpëtimit: "Kush më garanton atë që ka midis nofullave dhe asaj midis këmbëve, unë i garantoj atij Xhenetin" (Sahih el-Bukhari 6474) - domethënë, kushdo që mbron fjalën e tij dhe dëlirësinë e tij. Një zakon i përditshëm i rishikimit të sinqertë të vetvetes - të pyesësh atë që sot i shtohet librit - është një nga praktikat më të matura dhe më të dobishme që një besimtar mund të mbajë.',
    ],
    quran: [
      {
        excerpt:
          "Dhe do të vendoset procesverbali dhe do t'i shihni kriminelët të frikësuar nga ajo që është brenda tij, duke thënë: O mjerë ne! Cili është ky libër që nuk lë asgjë të vogël apo të madhe përveç se e ka regjistruar? Dhe ata do të gjejnë atë që kanë bërë, e Zoti yt nuk i bën padrejtësi askujt.",
      },
      {
        excerpt:
          "Ndërsa atij që i jepet libri i tij në dorën e djathtë, ai do të thotë: Ja, lexo librin tim! Isha i sigurt se do të takohesha me llogarinë time. Kështu ai do të jetë në një jetë të këndshme. Por ai që i jepet procesverbali i tij në dorën e tij të majtë, do të thotë: Do të doja të mos më ishte dhënë procesverbali im.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kush më garanton atë që ka në mes të nofullave dhe të këmbëve të tij, unë i garantoj atij Xhenetin, domethënë gjuhën dhe dëlirësinë e tij.",
      },
    ],
    actions: [
      "Ruajeni gjuhën mbi pothuajse çdo gjë tjetër - shumica e asaj që mbush një rekord për të mirën ose të keqen kalon nëpër të.",
      "Rishikoni ditën tuaj para gjumit: pyesni se çfarë do të dëshironit dhe çfarë do të kishit frikë të shihnit të shkruar në librin tuaj.",
    ],
    appLinks: [{}],
  },
  {
    title: "Shkalla (Mizan)",
    summary: "Veprat e peshuara - sinqeriteti, karakteri dhe dhikri e bëjnë peshoren të rëndë.",
    body: [
      "Mizani është peshoja në të cilën peshohen veprat me drejtësi absolute: 'Ne e vendosim peshoren e drejtësisë për Ditën e Kijametit, kështu që asnjë shpirti nuk do t'i bëhet padrejtësi; edhe sikur të jetë sa një kokërr sinapi, Ne do ta nxjerrim atë dhe mjafton që Ne të jemi llogaritarë' (Kur'an 21:47). Ehli Suneti e pohon atë si një ekuilibër të vërtetë, jo një metaforë të thjeshtë - veprat, ose të dhënat e tyre, peshohen vërtet. Fati i një personi kthehet në të cilin tigan fundoset: 'Sa i përket atij që peshon i rëndë, ai do të jetë në një jetë të këndshme; por sa i përket atij që ka peshoret e lehta, strehimi i tij do të jetë një humnerë' (Kur'an 101:6–9).",
      'Ajo që e bën një peshore të rëndë nuk është vëllimi i madh i aktivitetit, por pesha e saj para Allahut - dhe pesha vjen nga sinqeriteti. Pejgamberi ﷺ vuri në dukje veprat që janë të pakuptimta, por të pamasë: "Dy fjalë të lehta në gjuhë, të rënda në peshore, të dashura për të Mëshirshmin: SubhanAllahi ue bihamdih, SubhanAllahil-\'Azim" (Sahih el-Bukhari 6406). Ai gjithashtu tha: "Asgjë nuk është më e rëndë në peshoren e besimtarit në Ditën e Kijametit sesa karakteri i mirë" (Xhami\'et-Tirmidhi 2002, sahih). Pra, një kujtim i thjeshtë i përsëritur sinqerisht, ose sjellje të mira me durim, mund të peshojë më shumë se malet e aktivitetit të dukshëm.',
      "E kundërta është rreziku i veprave të zbrazëta. Veprimet e bëra për t'u parë nga njerëzit (riya') ose për t'u korruptuar nga hipokrizia mund të arrijnë në peshore pa peshë - nga jashtë të mëdha, nga brenda bosh. Kjo është arsyeja pse sinqeriteti (ikhlas) nuk është një virtyt në mesin e shumë njerëzve, por është pikërisht ajo gjë që i jep peshë çdo vepre tjetër. Mësimi është të ndërtoni ditën rreth veprimeve të vogla, të sinqerta, të qëndrueshme dhe të pastroni qëllimin pas atyre të dukshme.",
    ],
    quran: [
      {
        excerpt:
          "Dhe Ne e vendosim peshoren e drejtësisë për Ditën e Kijametit, kështu që askujt nuk i bëhet padrejtësi. E nëse është sa një kokërr sinapi, Ne do ta nxjerrim atë dhe mjafton që Ne të llogarisim.",
      },
      {
        excerpt:
          "Sa i përket atij që peshon i rëndë, ai do të jetë në një jetë të këndshme. Por, sa i përket atij që ka peshoret e lehta, streha e tij do të jetë një humnerë.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dy fjalë të lehta në gjuhë, të rënda në peshore, të dashura tek i Gjithëmëshirshmi: SubhanAllahi ue bihamdih, SubhanAllahil-'Azim.",
      },
      {
        excerpt:
          "Asgjë nuk është më e rëndë në peshoren e besimtarit në Ditën e Kijametit sesa karakteri i mirë. Vërtet, ai me karakter të mirë e arrin gradën e agjëruesit dhe falësit.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Përgjegjshmëria (Hisab)",
    summary: "Llogaritja e lehtë, llogaritja e detajuar dhe të drejtat që u detyrohen të tjerëve.",
    body: [
      "Hisabi është llogaria, kur çdo person thirret të japë llogari për jetën e tij. Kur'ani përshkruan dy përvoja shumë të ndryshme rreth tij: 'Sa i përket atij që i jepet libri i tij në dorën e djathtë, ai do të gjykohet me një llogari të lehtë dhe do të kthehet te populli i tij i lumtur; por dikush duke pasur parasysh historinë e tij pas shpine do të kërkojë shkatërrim' (Kur'an 84:7–11). “Llogaria e lehtë” është mëshirë, jo mungesë ekzaminimi – Profeti (a.s.) paralajmëroi se intensiteti i marrjes në pyetje është në vetvete një lloj ndëshkimi.",
      "Vetë gruaja e Profetit ﷺ tregon dallimin kryesor. Aisheja e raportoi atë duke thënë: \"Kushdo që thirret në llogari do të shkatërrohet\". Ajo tha: Por a nuk thotë Allahu: “Ai do të gjykohet me një llogari të lehtë”? Ai u përgjigj: \"Kjo është vetëm prezantimi i veprave; por kushdo që merret në pyetje për llogari do të shkatërrohet' (Sahih el-Buhari 6537). Pra, shpresa e besimtarit nuk është që t'i shpëtojë çdo shqyrtimi, por t'i tregohen veprat e tij, t'i mbulohen mëkatet dhe t'i falen - në vend që të shqyrtohet pika për pikë.",
      "Ekziston një kategori borxhi që edhe falja e Allahut nuk e fshin thjesht: të drejtat e njerëzve të tjerë (hukuk al-'ibad). Pejgamberi ﷺ pyeti: \"A e dini se kush është i falimentuar?\" Ata thanë: Një pa para. Ai tha: “I falimentuari i ummetit tim është ai që vjen në ditën e kijametit me namaz, agjërim dhe sadaka, por që e ka fyer këtë, e ka shpifur për atë, e ka marrë pasurinë e tjetrit dhe ka derdhur gjakun e tjetrit, kështu që veprat e tij të mira do t'u dorëzohen atyre, dhe kur i mbarojnë veprat e tij të mira, gjynahet e tij hidhen mbi të. 2581). Adhurimi nuk e anulon padrejtësinë; vetëm zgjidhja e padrejtësisë e bën.",
      "Përfundimi praktik është urgjent dhe specifik: borxhet e papaguara, pasuritë e vjedhura, shpifjet dhe amanetet e prishura duhet të korrigjohen në këtë jetë – përmes pendimit tek Allahu dhe kthimit dhe faljes ndaj njerëzve – sepse është shumë më lirë të zgjidhet me një monedhë të parave dhe përulësisë tani sesa me monedhën e veprave të mira atëherë. Dhe përmes gjithë kësaj, drejtësia e Allahut është e përsosur dhe mëshira e Tij përfshin këdo që u përpoq sinqerisht dhe u pendua.",
    ],
    quran: [
      {
        excerpt:
          "Sa i përket atij që i jepet ana e tij në dorën e djathtë, ai do të gjykohet me një llogari të lehtë dhe do të kthehet te populli i tij i lumtur. Por atij që i jepet rekordi pas shpine do të qajë për shkatërrim dhe do të hyjë në një Flakë.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kushdo që thirret në llogari do të shkatërrohet. Aishja tha: A nuk thotë Allahu se do të gjykohet me një llogari të lehtë? Ai tha: Kjo është vetëm prezantimi i veprave; por kushdo që merret në pyetje për llogarinë e tij do të shkatërrohet.",
      },
      {
        excerpt:
          "A e dini kush është i falimentuar? Ai është ai që vjen në ditën e kijametit me namaz, agjërim dhe sadaka, por që ka fyer, shpifur dhe u ka bërë padrejtësi të tjerëve, kështu që veprat e tij të mira u jepen atyre, e kur t'u mbarojnë gjynahet e tyre dhe ai hidhet në zjarr.",
      },
    ],
    actions: [
      "Shlyeni borxhet dhe ktheni çdo gjë të marrë padrejtësisht, sado e vogël, para se të vijë dita e caktuar.",
      "Kërkoni dhe kërkoni falje kujtdo që i keni bërë keq me fjalë, pasuri ose dinjitet – kthimi tani është shumë më i lirë se kthimi në atë kohë.",
      "Pendohuni tek Allahu për të drejtat që i keni ndaj Tij dhe mbajini të qarta dy librat - hyjnoren dhe njerëzoren - të dyja.",
    ],
    appLinks: [{}],
  },
  {
    title: "Pellgu (Hawd)",
    summary: "Legeni i Pejgamberit ﷺ - kush pi dhe kush refuzohet.",
    body: [
      "Haudi është pellgu i madh që i është dhënë Profetit Muhamed ﷺ në Ditën e Kijametit, një mëshirë për umetin e tij të etur në atë ditë përvëluese dhe rraskapitëse. Përshkrimet e tij janë të shumta dhe autentike: 'Haudi im është një udhëtim një muajsh; uji i tij është më i bardhë se qumështi, aroma e tij është më e ëmbël se misku dhe kupat e tij janë si yjet e qiellit. Kushdo që pi prej tij nuk do të ketë më etje' (Sahih el-Bukhari 6579). Besimi në Haud është pjesë e besimit sunit, të krijuar nga raportet e transmetuara në masë.",
      'Profeti ﷺ vetë do t\'i pranojë ndjekësit e tij atje: "Unë do të arrij në Haud para jush dhe do të shikoj për ata prej jush që vijnë tek unë" (Sahih Mysliman 2292). Ai e njeh umetin e tij nga drita në fytyrat, duart dhe këmbët e tyre nga gjurmët e abdesit. Për ta arritur atë është të shuhesh përgjithmonë; ushqehet, në kuptimin e shëndoshë, nga el-Kevtheri, lumi që Allahu i dha Profetit të Tij (ﷺ) në Xhenet.',
      "Megjithatë, disa do të dëbohen nga Havdi. Profeti ﷺ përshkroi se u tha disa njerëzve: 'Ata nuk janë prej jush; ata ndryshuan dhe ndryshuan fenë pas teje, ose u kthyen pas tij. Dijetarët janë të kujdesshëm me këtë: ai u referohet kategorive të veçanta në Hadith - të tilla si braktisja dhe risitë e rënda, të qëllimshme në fe pas udhëzimeve të qarta - dhe nuk është prerazi një leje për muslimanët e zakonshëm që t'i hedhin akuzat njëri-tjetrit. Rruga e sigurt për në Haud është mbajtja pas Sunetit, ruajtja e abdesit dhe namazit dhe ruajtja e unitetit të besimtarëve.",
    ],
    hadith: [
      {
        excerpt:
          "My Hawd është një udhëtim prej një muaji. Uji i tij është më i bardhë se qumështi, aroma e tij më e ëmbël se misku dhe kupat e tij janë të shumtë sa yjet e qiellit. Kushdo që pi prej saj nuk do të ketë më etje.",
      },
      {
        excerpt:
          "Unë do të arrij në Haud para jush dhe do të jem i kujdesshëm për ata prej jush që vijnë tek unë. Do të më hiqen disa njerëz dhe unë do të them: Zoti im, shokët e mi! Do të thuhet: Ti nuk e di se çfarë bidati kanë pas teje.",
      },
    ],
    disclaimer:
      "Raportet për ata që janë larguar nga Haudi u referohen kategorive të veçanta të përmendura në Hadith, kryesisht braktisjes dhe risive të rënda në fe. Ato nuk janë leje për muslimanët që të deklarojnë njëri-tjetrin të humbur.",
  },
  {
    title: "Ura (Sirat)",
    summary: "Kalimi i Xhehenemit - shpejtësi sipas veprave dhe mëshirës.",
    body: [
      "Sirati është një urë e shtrirë mbi majën e Xhehenemit dhe çdo njeri duhet të kalojë mbi të, besimtar dhe mosbesimtar. Kur'ani pohon kalimin pa përjashtim: \"Nuk ka asnjë prej jush përveç se ai do të vijë tek ai. Kjo është mbi Zotin tuaj një dekret i pashmangshëm. Pastaj Ne do t'i shpëtojmë ata që e përkujtuan Allahun dhe do t'i lëmë zullumqarët në të të gjunjëzuar\" (Kur'an 19:71-72). Kalimi është universal; Arritja e sigurt në anën e largët është e gjithë çështja, dhe kjo u jepet nga Allahu atyre që Ai i mbron.",
      "Mënyra e kalimit përcaktohet nga aktet që sjell dikush. Profeti ﷺ e përshkroi atë: \"Ura do të vendoset mbi Xhehenem... dhe i pari prej jush do të kalojë si rrufeja, pastaj si era, pastaj si zogjtë, pastaj si një njeri që vrapon - sipas veprave të tyre - ndërsa Profeti juaj qëndron në urë duke thënë: O Zot, ruaji ata, ruaji ata. Disa ruhen të padëmtuara, disa gërvishten dhe lëshohen, dhe disa hidhen në zjarr' (Sahih el-Bukhari 6573). Pranë urës, në të njëjtin raport, qëndrojnë besueshmëria (amanah) dhe lidhjet farefisnore - një imazh i mrekullueshëm që besnikëria në amanetet dhe lidhjet familjare shoqëron në të vërtetë një person.",
      "Drita dhe shpejtësia në Sirat fitohen në këtë jetë. Lutja e kryer në kohë, bamirësia e dhënë rregullisht, ndershmëria në marrëdhënie dhe karakteri i mirë bëhen, në fakt, baza dhe drita përmes së cilës njeriu kalon. Profeti ﷺ do të ndërmjetësojë për besimtarët atje dhe është me mëshirën e Allahut që dikush arrin fare në anën tjetër.",
      "Ashtu si me stacionet e tjera të padukshme, rruga e mençur nuk është të spekulosh për dimensionet fizike të urës - sa e hollë, sa e mprehtë, sa e gjatë - përtej asaj që thotë zbulesa, por të përqendrohesh tërësisht në veprat që e bëjnë kalimin të lehtë. Atë që nuk mund ta imagjinoni, mund të përgatiteni ende për të.",
    ],
    quran: [
      {
        excerpt:
          "Dhe nuk ka asnjë prej jush përveç se ai do të vijë tek ajo. Kjo është mbi Zotin tuaj një dekret i pashmangshëm. Pastaj Ne do t'i shpëtojmë ata që e përkujtuan Allahun dhe do t'i lëmë zullumqarët në të të gjunjëzuar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ura do të vendoset mbi Ferr dhe unë do të jem i pari që do të kaloj. Njerëzit do ta kalojnë atë sipas veprave të tyre - si rrufeja, si era, si zogjtë, si një vrapues - ndërsa unë them: O Zot, ruaji ata, ruaji ata. Disa shpëtohen, disa gërvishten dhe lëshohen, e disa bien në zjarr.",
      },
    ],
    actions: [
      "Falni pesë namazet në kohë - namazi është drita që të çon nëpër urë.",
      "Jepni bamirësi rregullisht, edhe në sasi të vogla.",
      "Mbani lidhjet farefisnore dhe ruani amanetet tuaja - në Hadith ato qëndrojnë pranë vetë Siratit.",
    ],
  },
  {
    title: "Parajsa",
    summary: "Shpërblimi i përjetshëm - lumturia e tij dhe, mbi të gjitha, shikimi i Allahut.",
    body: [
      'Xheneti është shtëpia e përjetshme që Allahu ka përgatitur për besimtarët, një realitet përtej imagjinatës. Në një Hadith të shenjtë Pejgamberi ﷺ tregon se Allahu thotë për të: "Unë kam përgatitur për robërit e Mi të mirë atë që nuk e ka parë syri, nuk e ka dëgjuar veshi dhe nuk e ka ngjizur kurrë zemra njerëzore" (Sahih el-Buhari 3244). Lumenjtë, kopshtet, pallatet dhe shoqëria e tij përshkruhen në Kur\'an për të tërhequr zemrën, por përshkrimet janë tregues të një gëzimi që i tejkalon plotësisht ato.',
      "Më i madhi nga të gjitha shpërblimet e tij nuk është ndonjë kopsht apo lumë, por kënaqësia e Allahut dhe vizioni i Fytyrës së Tij. 'Atë Ditë fytyrat do të ndriçojnë dhe do të shikojnë drejt Zotit të tyre' (Kur'an 75:22-23) - kuptohet nga Ehl al-Suneh si besimtarët që shohin Allahun në Ahiret, lumturinë kurorëzuese të Xhenetit, të dhënë në një mënyrë që i përshtatet madhërisë së Tij dhe pa ngjashmëri me krijimin. Allahu premton: \"Për ata që bënë mirë është shpërblimi më i mirë dhe më shumë\" (Kur'an 10:26) - dhe \"më shumë\" shpjegohet në hadithin autentik si ky vizion i Fytyrës së Tij fisnike.",
      "Hyrja në Xhenet është me mëshirën e Allahut, e përqafuar përmes besimit dhe veprave të mira – të dyja nuk kundërshtohen kurrë: mëshira është shkaku, dhe veprat janë shenja dhe mjetet që Allahu ka lidhur me të. Dita e Fundit përfundon, për banorët e Xhenetit, në një lumturi që nuk shuhet dhe nuk mbaron kurrë. Ky modul e mban të shkurtër me qëllim trajtimin e tij për Parajsën; udhëzuesi i plotë i Udhëtimit për në Xhenet mbulon dyert e tij, gradat, veprat që të çojnë tek ai dhe lutjet për të në thellësi.",
    ],
    quran: [
      {
        excerpt:
          "Dhe nxitoni në faljen e Zotit tuaj dhe një Xhenet të gjerë sa qiejt dhe toka, i përgatitur për të devotshmit.",
      },
      {
        excerpt: "Atë ditë, fytyrat do të shkëlqejnë dhe do të shikojnë kah Zoti i tyre.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allahu thotë: Unë kam përgatitur për robërit e Mi të devotshëm atë që nuk e ka parë syri, nuk e ka dëgjuar veshi dhe atë që nuk e ka ngjizur zemra e njeriut.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "ferr",
    summary: "Paralajmërimi i vërtetë - ndëshkimi i vërtetë dhe dera e shpëtimit sa jeni gjallë.",
    body: [
      "Xhahannemi është një vendbanim i vërtetë ndëshkimi, jo një simbol apo metaforë për një gjendje të keqe shpirtërore. Besimi në të është pjesë e besimit në të fshehtën dhe në drejtësinë e Allahut. Kur'ani paralajmëron me qartësi të matur: \"Për ata që nuk besuan Zotin e tyre është dënimi i Xhehenemit dhe i mjeri është përfundimi\" (Kur'an 67:6). Ashpërsia e tij përshkruhet për të zgjuar dhe jo për të kënaqur kureshtjen: 'Zjarri lënda djegëse e të cilit janë njerëzit dhe gurët' (Kur'an 2:24), i ruajtur nga engjëj të ashpër të cilët nuk e kundërshtojnë Allahun në atë që Ai urdhëron.",
      "Qëllimi i këtyre paralajmërimeve është mëshira e maskuar. Ato ekzistojnë për të thyer arrogancën, për të ndaluar refuzimin e vazhdueshëm të së vërtetës dhe për të kthyer një person para se të jetë tepër vonë. Kjo është arsyeja pse paralajmërimet në Kur'an pothuajse gjithmonë shoqërohen me derën e hapur të pendimit - qëllimi i përshkrimit të Zjarrit është pikërisht që njerëzit ta shmangin atë përderisa munden. Dënimi i tij është i drejtë: askush nuk hyn në të, përveç me zgjedhjen e tyre këmbëngulëse kundër udhëzimit të qartë, dhe Allahu nuk i bën padrejtësi askujt.",
      "Për besimtarët që bartin mëkate, besimi i shëndoshë sunit është një ekuilibër midis frikës dhe shpresës: një mëkatar është nën vullnetin e Allahut - Ai mund të falë, ose mund të pastrohet në zjarr dhe pastaj, me ndërmjetësimin dhe mëshirën e përshkruar më sipër, të nxjerrë prej tij të gjithë ata që kishin qoftë edhe një grimcë besimi. Ky modul i jep Ferrit një trajtim qëllimisht të shkurtër dhe të matur. Studimi më i plotë i paralajmërimeve të tij, i mëkateve të mëdha dhe i dyerve të gjera të pendimit dhe mëshirës gjendet në modulin Kuptimi i Xhehenemit dhe temave të lidhura me akiden – të trajtuara gjithmonë me shpresë, kurrë me dëshpërim.",
    ],
    quran: [
      {
        excerpt:
          "E për ata që nuk besuan Zotin e tyre është dënimi i Xhehenemit dhe i mjerë është përfundimi.",
      },
      {
        excerpt:
          "Thuaj: O robërit e Mi që e keni ngarkuar me shumë gabime veten tuaj, mos e humbni shpresën ndaj mëshirës së Allahut. Vërtet, Allahu i fal të gjitha mëkatet. Vërtet, Ai është Falës, Mëshirues.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kush hyn pa llogari?",
    summary: "Hadith autentik për ata që anashkalojnë hisabin e detajuar - diskutime dijetare.",
    body: [
      'Prej mëshirave të Ditës së Fundit është që një grup i këtij umeti të hyjë në Xhenet pa llogari. Pejgamberi ﷺ tha: "Shtatëdhjetë mijë nga ummeti im do të hyjnë në Xhenet pa llogari", dhe me një formulim tjetër, "me çdo mijë e shtatëdhjetë mijë të tjera". Kur sahabët pyetën veten se kush ishin ata, ai i përshkroi ata: "Ata janë ata që nuk kërkojnë rukje nga të tjerët, nuk besojnë në shenjat e liga, nuk përdorin kautizim dhe që i mbështeten Zotit të tyre" (Sahih el-Bukhari 6541).',
      "Thelbi i këtij përshkrimi është tevakkuli - mbështetja e thellë dhe aktive në Allahun - së bashku me lirinë nga bestytnitë dhe nga varësia e shqetësuar nga shkaqet. Ai nuk dënon kërkimin e trajtimit mjekësor të lejuar; rukja e recituar mbi vetveten dhe mjekësia e ligjshme janë të vendosura në Sunet. Ajo që lavdërohet është personi, mbështetja e të cilit është tërësisht tek Allahu, saqë ata nuk shkojnë vërdallë duke iu lutur të tjerëve për hijeshi shpirtërore ose duke u kapur pas ogureve.",
      "Dijetarët diskutojnë vetë numrin: disa thonë se shtatëdhjetë mijë është fjalë për fjalë, të tjerë se shumëzohet shumë me raportet shtesë, dhe të tjerë ende se sinjalizon një bollëk të pamatshëm të hirit të Allahut dhe jo një numër fiks. Ajo për të cilën ata bien dakord është e vërteta themelore – se mëshira e Allahut e tejkalon shumë atë që do të priste kontabiliteti njerëzor, dhe se shpëtimi përfundimtar është nga kjo mëshirë.",
      "Ky është një stacion shprese, jo një shteg për dembelizmin. Ai e frymëzon besimtarin drejt mbështetjes së vërtetë në Allahun dhe larg besëtytnisë, ndërkohë që ende përpiqet në adhurim. Askush nuk e fiton atë duke lënë pas dore veprat; njeriu tërhiqet drejt tij nga sinqeriteti, besimi dhe një zemër e lidhur me Allahun dhe jo nga hijeshitë dhe frika.",
    ],
    hadith: [
      {
        excerpt:
          "Shtatëdhjetë mijë nga ummeti im do të hyjnë në Xhenet pa llogari: ata janë ata që nuk kërkojnë rukje nga të tjerët, nuk besojnë në shenjat e këqija, nuk kujdesen dhe mbështeten te Zoti i tyre.",
      },
    ],
    disclaimer:
      "Dijetarët ndryshojnë nëse 'pa llogari' do të thotë një shtatëdhjetë mijë fiks ose një numër shumë më i madh, i pamatshëm. Të gjithë pajtohen se shpëtimi përfundimtar është me mëshirën e Allahut dhe se kjo është një shkak për shpresë, jo për neglizhencë të veprave.",
  },
  {
    title: "Përgatitja për Ditën e Fundit",
    summary: "Adhurimi praktik - lidhni çdo zakon me takimin tuaj me Allahun.",
    body: [
      "Pas ecjes së gjithë udhëtimit - vdekja, varri, shenjat, boria, mbledhja, regjistrimet, peshore, llogaria, Ura dhe dy shtëpitë - e vetmja përgjigje e arsyeshme është përgatitja. Por përgatitja nuk është panik. Pejgamberi ﷺ nuk i la kurrë shokët e tij të frikësuar dhe të paralizuar; i la në punë. Themeli i gjithë kësaj është teuhidi dhe sinqeriteti (ikhlas): një vepër pranohet vetëm kur bëhet vetëm për Allahun dhe në përputhje me Sunetin, kështu që para se të shtoni më shumë vepra, pastroni nijetin pas atyre që keni tashmë.",
      "Ndërtoni ditën mbi shtyllat që tekstet i bënë të rënda në peshore. Namazi në kohë është spiranca dhe drita e Siratit. Kur'ani – i recituar, dëgjuar dhe reflektuar mbi disa vargje çdo ditë – e mban zemrën gjallë. Teube e fshin dokumentin: 'O besimtarë, kthehuni tek Allahu me pendim të sinqertë' (Kur'an 66:8). Bamirësia pastron pasurinë dhe ju jeton më shumë se sadakaja xherijah. Dhikri e mban gjuhën të rëndë në peshore me fjalë të lehta në gjuhë. Dhe karakteri i mirë, ka thënë Pejgamberi ﷺ, është gjëja më e rëndë e vendosur në peshore.",
      "Ruaji dy gjërat që Profeti ﷺ i lidhi drejtpërdrejt me Xhenetin – gjuhën dhe dëlirësinë (Sahih el-Bukhari 6474) – sepse këto, më shumë se mëkate dramatike, janë ato që mbushin ose falimentojnë në heshtje një dokument. Dhe zgjidhi të drejtat e njerëzve përderisa mundeni: paguani borxhet, ktheni atë që ju është marrë, kërkoni falje për dëmin dhe jini të drejtë në çdo marrëveshje, në mënyrë që të mos arrini kurrë si 'falimentuari', lutjet e të cilit hahen nga pretendimet e atyre që i ka bërë padrejtësi.",
      'Çdo gjë mbështetet në një qëllim, thuhet në hadithin e parë të Sahih el-Buhariut: "Veprat janë vetëm me qëllim". Përdorni gjurmuesit e Munibit jo si pikë për të konkurruar, por si skelë të butë për këto zakone - lutje, Kur\'an, dhikri, bamirësi, pendim - secili duke ju drejtuar qetësisht ditën drejt takimit me Allahun. Ky është i gjithë qëllimi: të jetosh tani si dikush që me të vërtetë pret të qëndrojë para Tij.',
    ],
    quran: [
      {
        excerpt: "Dhe unë nuk i krijova xhinët dhe njerëzit vetëm që të më adhurojnë Mua.",
      },
      {
        excerpt:
          "O ju që besuat, kthehuni tek Allahu me një pendim të sinqertë. Ndoshta Zoti juaj do t'ju largojë veprat tuaja të këqija dhe do t'ju futë në kopshte, nëpër të cilat rrjedhin lumenj.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Veprimet janë vetëm nga qëllimet, dhe çdo njeri do të ketë vetëm atë që ka menduar.",
      },
      {
        excerpt:
          "Kush më garanton atë që ka midis nofullave dhe këmbëve të tij - gjuhën dhe dëlirësinë e tij, unë i garantoj atij Xhenetin.",
      },
    ],
    actions: [
      "Falni pesë namazet ditore me kohë.",
      "Lexoni ose dëgjoni Kuranin çdo ditë – qoftë edhe disa vargje.",
      "Mbani edhkarin e mëngjesit dhe të mbrëmjes.",
      "Jepni bamirësi rregullisht, qoftë edhe në sasi të vogla.",
      "Pendohuni çdo ditë dhe kërkoni falje me sinqeritet.",
      "Ruaje gjuhën dhe dëlirësinë dhe mbaje çdo premtim dhe besim.",
      "Plotësoni të drejtat që u detyrohen familjes, fqinjëve dhe kreditorëve.",
      "Reflektoni në ditarin tuaj të lutjeve mbi khushu dhe sinqeritetin e qëllimit.",
    ],
    appLinks: [{}, { label: "Të rënda në peshore" }, {}, {}, {}, {}, {}],
  },
  {
    title: "Vepra të rënda në peshore",
    summary: "Veprat e vogla me sinqeritet peshojnë rëndë në Ditën e Gjykimit.",
    body: [
      "Allahu sheh sinqeritetin, jo vetëm sasinë e veprave.",
      "Gjuha, karakteri dhe zemra kanë peshë të madhe.",
      "Shtoni të mirat e vogla e të vazhdueshme.",
    ],
    mizanDeeds: [
      {
        title: "Karakteri i mirë",
        summary: "Butësi dhe sjellje e mirë.",
        hadith: {
          excerpt: "Asgjë nuk është më e rëndë në peshore se karakteri i mirë.",
        },
      },
      {
        title: "Dy fjalë",
        summary: "Të lehta në gjuhë, të rënda në peshore.",
        hadith: {
          excerpt: "Subhanallahi ue bihamdihi, Subhanallahil-adhim.",
        },
      },
      {
        title: "Elhamdulilah",
        summary: "E mbush peshoren.",
        hadith: {
          excerpt: "Elhamdulilah e mbush peshoren.",
        },
      },
      {
        title: "Kartela",
        summary: "Teuhidi i tejkalon mëkatet.",
        hadith: {
          excerpt: "Kartela me La ilahe il-lallah e rëndon peshoren.",
        },
      },
      {
        title: "Dhikri më i mirë",
        summary: "Thoni shpesh teuhidin.",
        hadith: {
          excerpt: "Dhikri më i mirë është La ilahe il-lallah.",
        },
      },
      {
        title: "Katër fjalë",
        summary: "Fjalë të dashura për Allahun.",
        hadith: {
          excerpt: "Subhanallah, Elhamdulilah, La ilahe il-lallah, Allahu ekber.",
        },
      },
      {
        title: "Njëqind tesbihe",
        summary: "Shkak për falje.",
        hadith: {
          excerpt: "Kush thotë njëqind herë Subhanallah, i falen mëkatet.",
        },
      },
    ],
    quran: [
      {
        excerpt: "Atë ditë peshoret vendosen me drejtësi.",
      },
      {
        excerpt: "Ai që e ka peshoren të rëndë do të jetë në jetë të kënaqur.",
      },
    ],
    hadith: [
      {
        excerpt: "Vepra më e dashur është ajo e vazhdueshme, edhe nëse e pakët.",
      },
      {
        excerpt: "Mos e nënçmoni asnjë të mirë.",
      },
      {
        excerpt: "Buzëqeshja jote është lëmoshë.",
      },
      {
        excerpt: "Mysliman është ai nga gjuha dhe dora e të cilit njerëzit janë të sigurt.",
      },
    ],
    misconceptions: [
      "Vetëm shumësia e veprave nuk mjafton; sinqeriteti është thelbësor.",
      "Veprat e zemrës nuk janë të parëndësishme.",
    ],
    actions: [
      "Bëni dhikr çdo ditë.",
      "Përmirësoni karakterin.",
      "Zgjidhni një vepër të vogël të vazhdueshme.",
      "Filloni çdo punë me sinqeritet.",
    ],
    appLinks: [
      {
        label: "Dhikri ditor",
      },
      {
        label: "Lutje",
      },
      {
        label: "Leximi i Kuranit",
      },
      {
        label: "Ditari i sadakasë",
      },
      {
        label: "Zhvillimi i karakterit",
      },
    ],
  },
];

export const LAST_DAY_HADITH_SQ: DeepPartial<LastDayHadithEntry>[] = [
  {
    hadith: {
      excerpt: "Mos harroni shpesh shkatërruesin e kënaqësive - domethënë vdekjen.",
    },
    context:
      "Kujtimi i rregullt i vdekjes zbut zemrën, shpërndan mëritë dhe korrigjon përparësitë pa ngjallur dëshpërim.",
  },
  {
    hadith: {
      excerpt:
        "Askush prej jush nuk duhet të vdesë përveçse duke e supozuar më të mirën për Allahun – duke menduar mirë për mëshirën e Zotit të tij.",
    },
    context:
      "Një fund i mirë (husn al-khatima) pritet përmes besimit të sinqertë, pendimit dhe pritjes së mirë nga Allahu.",
  },
  {
    hadith: {
      excerpt: "Varri është ose kopsht nga kopshtet e Xhenetit ose gropë nga gropat e zjarrit.",
    },
    context:
      "Berzahu përfshin shpërblimin ose dënimin në varr, me urtësinë e Allahut - varri pasqyron veprat e një personi.",
  },
  {
    hadith: {
      excerpt:
        "Kur varroset i ndjeri, vijnë dy engjëj dhe e pyesin për Zotin, fenë dhe profetin e tij.",
    },
    context:
      "Pyetja në varr vërtetohet në raportet autentike; në këtë transmetim dy engjëjt quhen Munker dhe Nakir.",
  },
  {
    hadith: {
      excerpt:
        "Kur njeriu vdes, veprat e tij përfundojnë, përveç tri: bamirësisë së vazhdueshme, diturisë nga e cila përfitohet, ose një fëmije të drejtë që lutet për të.",
    },
    context: "Ajo që vazhdon t'i sjellë dobi të ndjerit - e vërtetuar në hadithin sahih.",
  },
  {
    hadith: {
      excerpt:
        "Do të mblidheni këmbëzbathur, të zhveshur dhe të parrethprerë - dhe i pari që do të visheni në Ditën e Kijametit do të jetë Ibrahimi.",
    },
    context: "Përulësia në ditën e tubimit; Allahu nderon kë të dojë, ashtu siç do.",
  },
  {
    hadith: {
      excerpt:
        "Dielli do t'u afrohet njerëzve në Ditën e Kijametit derisa të jetë rreth një milje larg dhe ata do të fundosen në djersën e tyre sipas veprave të tyre.",
    },
    context: "Kushtet në Mahshar - ashpërsia ndryshon sipas veprave në transmetimet autentike.",
  },
  {
    hadith: {
      excerpt:
        "Njerëzit do të vijnë tek unë dhe unë do të bie në sexhde para Allahut dhe do të thuhet: Ngrije kokën; kërkoni dhe do t'ju jepet, ndërmjetësoni dhe ndërmjetësimi juaj do të pranohet.",
    },
    context: "Ndërmjetësimi më i madh - Shafa'ah el-Udhma, i veçantë për Profetin ﷺ.",
  },
  {
    hadith: {
      excerpt:
        "Kushdo që thirret në llogari do të shkatërrohet. Aishja pyeti: A nuk thotë Allahu, Ai do të gjykohet me një llogari të lehtë? Ai tha: Kjo është vetëm prezantimi i veprave; por kushdo që merret në pyetje për llogarinë e tij do të shkatërrohet.",
    },
    context:
      "Një 'llogari e lehtë' është një mëshirë - të tregosh veprat e dikujt dhe të falesh, jo të pyetesh pikë për pikë.",
  },
  {
    hadith: {
      excerpt:
        "I falimentuari i ummetit tim është ai që vjen me namaz, agjërim dhe sadaka, por ka fyer, shpifur dhe bërë padrejtësi ndaj të tjerëve - kështu që veprat e tij të mira u jepen atyre dhe mëkatet e tyre i ngarkohen atij.",
    },
    context:
      "Të drejtat e njerëzve (hukuk al-'ibad) nuk anulohen thjesht nga adhurimi; ato duhet të paguhen ose të paguhen atë Ditë.",
  },
  {
    hadith: {
      excerpt:
        "Shtatëdhjetë mijë nga ummeti im do të hyjnë në Xhenet pa llogari: ata që nuk kërkojnë rukje nga të tjerët, nuk besojnë në shenjat e këqija, nuk kujdesen dhe që mbështeten te Zoti i tyre.",
    },
    context:
      "Dijetarët ndryshojnë nëse numri është fjalë për fjalë apo nënkupton një bollëk shumë më të madh dhe të pamatshëm të mëshirës së Allahut.",
  },
  {
    hadith: {
      excerpt:
        "My Hawd është një udhëtim prej një muaji. Uji i tij është më i bardhë se qumështi, aroma e tij më e ëmbël se misku dhe kupat e tij janë të shumtë sa yjet e qiellit. Kushdo që pi prej saj nuk do të ketë më etje.",
    },
    context: "Pellgu - mëshirë për umetin e Muhamedit a.s. në ditën e etjes.",
  },
  {
    hadith: {
      excerpt:
        "Ura është vendosur mbi Ferr. Njerëzit e kalojnë atë sipas veprave të tyre - si rrufeja, si era, si zogjtë, si një njeri që vrapon - dhe disa gërvishten dhe shpëtohen, ndërsa disa bien.",
    },
    context: "Shpejtësia e kalimit pasqyron besimin dhe veprat; Mëshira e Allahut është e madhe.",
  },
  {
    hadith: {
      excerpt:
        "Kiameti nuk do të vijë derisa të shihni dhjetë shenja: tymin, Dexhallin, Bishën, lindjen e diellit nga perëndimi, zbritjen e Isait, birit të Merjemes, Jexhuxhit dhe Mexhuxhit, tre rrëshqitje dheu dhe një zjarr që i shtyn njerëzit në tubimin e tyre.",
    },
    context:
      "Dhjetë shenjat kryesore, nga Hudhejfe ibn Usejd. Dijetarët pohojnë çdo shenjë, por ndryshojnë në sekuencën e saktë.",
  },
  {
    hadith: {
      excerpt:
        "Pasha Atë në dorën e të cilit është shpirti im, i biri i Merjemes së shpejti do të zbresë mes jush si sundimtar i drejtë; ai do të thyejë kryqin, do të vrasë derrat dhe do ta shfuqizojë xhizjen dhe pasuria do të vërshojë derisa askush të mos e pranojë atë.",
    },
    context:
      "Zbritja e Isait është një pikë e fortë e besimit sunit; ai sundon sipas Sheriatit të Muhamedit ﷺ.",
  },
  {
    hadith: {
      excerpt:
        "Kur të humbet besimi, prit Kiametin. U pyet: Si do të humbet? Ai tha: Kur u jepet autoriteti atyre që nuk e meritojnë atë.",
    },
    context:
      "Një shenjë e vogël e njohur - humbja e besueshmërisë. Përqendrohuni në përgatitjen, jo në panik.",
  },
  {
    hadith: {
      excerpt:
        "Allahu nuk e largon diturinë duke e rrëmbyer atë, por duke marrë dijetarët, derisa të mos mbetet asnjë dhe njerëzit të marrin injorantët si prijës, të cilët japin vendime pa dituri, kështu që devijojnë dhe i humbin të tjerët.",
    },
    context:
      "'Humbje e njohurive' nënkupton humbjen e studiuesve të shëndoshë dhe praktikës së jetuar – jo mungesë informacioni.",
  },
  {
    hadith: {
      excerpt: "Pastërtia është gjysma e besimit.",
    },
    context: "Veprat e besimit e rëndojnë peshoren.",
  },
  {
    hadith: {
      excerpt: "Fjala e mirë është sadaka.",
    },
    context: "E mira e gjuhës sjell shpërblim të madh.",
  },
  {
    hadith: {
      excerpt: "Allahu e do butësinë.",
    },
    context: "Praktikoni butësinë çdo ditë.",
  },
];

export const LAST_DAY_VERSES_SQ: DeepPartial<LastDayVerseEntry>[] = [
  {
    excerpt:
      "Çdo shpirt do ta shijojë vdekjen dhe do t'ju jepet kompensimi i plotë vetëm në Ditën e Kijametit. Pra, kushdo që tërhiqet nga zjarri dhe futet në Xhenet, ka pasur sukses, dhe jeta e kësaj bote është vetëm kënaqësi e mashtrimit.",
    context:
      "Vdekja është universale dhe kjo jetë është e përkohshme; shlyerja e vërtetë dhe përfundimtare e llogarive vjen vetëm në Ditën e Fundit.",
    tafsirSummary:
      "Ajeti ripërcakton suksesin: jo pasurinë apo statusin këtu, por shpëtimin nga zjarri dhe pranimin në Xhenet atje.",
  },
  {
    excerpt:
      "Atë Ditë, njerëzit do të nisen në grupe të veçanta për t'u treguar veprat e tyre. Pra, kushdo që bën të mirën sa një atom do ta shohë atë, dhe kushdo që bën të keqen sa një grimcë do ta shohë atë.",
    context:
      "Drejtësia e përsosur dhe e plotë - vepra më e vogël, e mirë apo e keqe, regjistrohet dhe i kthehet kryerësit.",
    tafsirSummary:
      "Asgjë nuk është shumë e vogël për t'u numëruar. Ky varg është një paralajmërim i përjetshëm kundër largimit të mëkateve 'të vogla' dhe një inkurajim i përjetshëm drejt veprave të mira 'të vogla'.",
  },
  {
    excerpt:
      "Dhe Ne e vendosim peshoren e drejtësisë për Ditën e Kijametit, kështu që askujt nuk i bëhet padrejtësi. Edhe sikur të jetë sa një kokërr sinapi, Ne do ta nxjerrim atë dhe mjafton që Ne të llogarisim.",
    context: "Mizani (Shkalla) është reale dhe drejtësia e saj është absolute.",
    tafsirSummary:
      "Askush në atë Ditë nuk ndreqet nga pesha e një kokrre sinapi; Kontabiliteti i Allahut është i patëmetë.",
  },
  {
    excerpt:
      "Sa i përket atij që peshon i rëndë, ai do të jetë në një jetë të këndshme. Por, sa i përket atij që ka peshoret e lehta, streha e tij do të jetë një humnerë.",
    context: "Rezultati përfundimtar varet nga pesha e veprave të drejta të dikujt në peshore.",
    tafsirSummary:
      "Pesha vjen nga sinqeriteti, jo nga vëllimi i madh - një dhikër i thjeshtë i thënë thjesht mund të peshojë më shumë se malet e aktivitetit të dukshëm.",
  },
  {
    excerpt:
      "Dhe nxitoni në faljen e Zotit tuaj dhe një Xhenet të gjerë sa qiejt dhe toka, i përgatitur për të devotshmit.",
    context:
      "Një urdhër i drejtpërdrejtë për të vrapuar drejt së mirës dhe drejt faljes para takimit me Allahun.",
    tafsirSummary:
      "Xheneti është i madh përtej imagjinatës, dhe rruga drejt tij është të nxitosh - të mos e shtysh pendimin dhe veprat e mira.",
  },
  {
    excerpt: "Atë ditë, fytyrat do të shkëlqejnë dhe do të shikojnë kah Zoti i tyre.",
    context:
      "Shpërblimi më i madh i Xhenetit nuk është ndonjë kopsht apo lumë, por shikimi i Fytyrës së Allahut.",
    tafsirSummary:
      "Ehli Suneti pohojnë se besimtarët do ta shohin Zotin e tyre në botën tjetër, në një mënyrë që i përshtatet madhështisë së Tij dhe pa ngjashmëri me krijesën - kurorën e çdo lumturie.",
  },
  {
    excerpt:
      "E për ata që nuk besuan Zotin e tyre është dënimi i Xhehenemit dhe i mjerë është përfundimi.",
    context:
      "Ferri është një pasojë e vërtetë dhe e drejtë - një vendbanim i vërtetë, jo një simbol.",
    tafsirSummary:
      "Paralajmërimi është një mëshirë që synon të kthejë një person mbrapa derisa ka ende kohë; ajo është gjithmonë e çiftuar në Kuran me derën e hapur të pendimit.",
  },
  {
    excerpt:
      "Thuaj: O robërit e Mi që e keni ngarkuar me shumë gabime veten tuaj, mos e humbni shpresën ndaj mëshirës së Allahut. Vërtet, Allahu i fal të gjitha mëkatet. Vërtet, Ai është Falës, Mëshirues.",
    context:
      "Sado i madh të jetë mëkati, dera e pendimit të sinqertë mbetet e hapur deri në vdekje.",
    tafsirSummary:
      "Dëshpërimi nga mëshira e Allahut është vetë prej shejtanit; besimtari balancon frikën nga zjarri me shpresën e pathyeshme në faljen e Allahut.",
  },
  {
    excerpt:
      "Dhe se kijameti po vjen - nuk ka dyshim për këtë - dhe se Allahu do t'i ringjallë ata që janë në varre.",
    context: "Ringjallja është e sigurt, edhe pse koha e tij është e fshehur.",
    tafsirSummary:
      "Siguria për Orën, e shoqëruar me pasigurinë për kohën e saj, është pikërisht ajo që ankoron përgjegjësinë morale në të tashmen.",
  },
  {
    excerpt:
      "Kush është ai që mund të ndërmjetësojë tek Ai përveçse me lejen e Tij? Ai e di atë që është para tyre dhe çfarë do të ndodhë pas tyre, dhe ata nuk përfshijnë asgjë nga dituria e Tij, përveç asaj që Ai dëshiron.",
    context: "Ndërmjetësimi (shefa'ah) është real, por kurrë i pavarur nga leja e Allahut.",
    tafsirSummary:
      'Ky kusht i vetëm - "përveç me lejen e Tij" - është ajo që e ndan ndërmjetësimin e vërtetë nga çdo prishje e tij dhe ndalon thirrjen e të vdekurve në këtë jetë.',
  },
  {
    excerpt:
      "Dhe mos mendo se Allahu është i pavetëdijshëm për atë që bëjnë zullumqarët. Ai i vonon ato vetëm për një ditë kur sytë do të shikojnë të tmerruar.",
    context: "Ngushëllim për të shtypurin - vonesa e dukshme e drejtësisë nuk është mungesa e saj.",
    tafsirSummary:
      "Asnjë padrejtësi nuk harrohet nga Allahu; keqbërësit vetëm i jepet afat deri në një ditë kur asgjë nuk do të anashkalohet.",
  },
  {
    excerpt:
      "Dhe nuk ka asnjë prej jush përveç se ai do të vijë tek ajo. Kjo është mbi Zotin tuaj një dekret i pashmangshëm. Pastaj Ne do t'i shpëtojmë ata që e përkujtuan Allahun dhe do t'i lëmë zullumqarët në të të gjunjëzuar.",
    context:
      "Kalimi mbi Sirat është universal; ardhja e sigurt është dhënë nga mëshira dhe takvaja e Allahut.",
    tafsirSummary:
      "Të gjithë vijnë në vendkalim; ndryshimi është se kush shpëtohet dhe kush bie - i vendosur nga besimi dhe veprat e dërguara përpara.",
  },
  {
    excerpt:
      "Të pyesin për kijametin: kur vjen ai? Thuaj: Dija e saj është vetëm te Zoti im. Askush nuk do ta zbulojë kohën e vet përveç Tij. Nuk do t'ju vijë veçse papritur.",
    context: "Koha e saktë e di vetëm Allahun – përgatitja ka rëndësi, parashikimi është i kotë.",
    tafsirSummary:
      "Edhe Profetit ﷺ nuk iu dha data; çdo pretendim njerëzor për një vit ose një numërim mbrapsht bie në kundërshtim me këtë varg.",
  },
  {
    excerpt:
      "Ndërsa atij që i jepet libri i tij në dorën e djathtë, ai do të thotë: Ja, lexo librin tim! Isha i sigurt se do të takohesha me llogarinë time. Kështu ai do të jetë në një jetë të këndshme.",
    context: "Mënyra e marrjes së librit - djathtas ose majtas - është vetë vendimi i parë.",
    tafsirSummary:
      "Gëzimi i të suksesshmëve është gëzimi i sigurisë i shpërblyer: ata jetuan duke pritur llogarinë dhe ai vjen si lehtësim, jo ​​tronditje.",
  },
];

export const LAST_DAY_TIMELINE_SQ: DeepPartial<LastDayTimelineEvent>[] = [
  {
    title: "Jeta në këtë botë",
    body: "Një kohë e shkurtër e caktuar për të besuar, adhuruar dhe përgatitur. Kjo botë nuk është shtëpia e fundit - është fusha e veprave.",
  },
  {
    title: "Vdekja",
    body: "Çdo shpirt do ta shijojë vdekjen. Besimtari e takon atë me shpresë në mëshirën e Allahut; shkujdesja e bën atë të papritur dhe të hidhur.",
  },
  {
    title: "Varri",
    body: "Pas varrimit, shpirti hyn në barzakh. Varri është faza e parë e ahiretit për çdo njeri.",
  },
  {
    title: "Barzakh",
    body: "Jeta midis vdekjes dhe ringjalljes - pyetje, lumturi ose ndëshkim sipas raporteve autentike.",
  },
  {
    title: "Shenja të vogla",
    body: "Ndryshimet graduale shoqërore dhe morale i përshkroi Profeti ﷺ. Shumë studiues vërejnë se disa janë shfaqur; Koha e saktë i takon vetëm Allahut.",
  },
  {
    title: "Shenjat kryesore",
    body: "Ngjarjet dramatike afër fundit – duke përfshirë Mehdiun, Dexhallin dhe kthimin e Isait (paqja qoftë mbi të) në hadithin autentik. Detajet e sekuencës ndryshojnë midis studiuesve.",
  },
  {
    title: "Bori",
    body: "Israfili do t'i bjerë borisë. Krijimi vdes në shpërthimin e parë dhe ringjallet në të dytën.",
  },
  {
    title: "Ringjallja",
    body: "Trupat e restauruar nga pluhuri; i gjithë krijimi qëndron para Allahut.",
  },
  {
    title: "Mbledhja (Mahshar)",
    body: "Të gjithë njerëzit u mblodhën zbathur, të zhveshur dhe të parrethprerë - siç dëshiron Allahu - në pritje të gjykimit.",
  },
  {
    title: "Procesverbali i Veprave",
    body: "Librat e dhënë në dorën e djathtë, të majtë ose pas shpine. Asgjë nuk është hequr nga ajo që është regjistruar.",
  },
  {
    title: "Shkalla (Mizan)",
    body: "Veprat peshohen me drejtësi të përsosur. Peshorja e rëndë sjell gëzim; peshoret e lehta sjellin humbje.",
  },
  {
    title: "Përgjegjshmëria (Hisab)",
    body: "Llogaritje e lehtë për disa; pyetje të hollësishme për të tjerët. Të drejtat që u detyrohen njerëzve nuk anashkalohen.",
  },
  {
    title: "Ndërmjetësimi (Shafa'ah)",
    body: "Vetëm me lejen e Allahut - më i madhi i takon Profetit Muhamed ﷺ.",
  },
  {
    title: "Pellgu (Hawd)",
    body: "Një legen i gjerë nga i cili pinë umeti i Profetit ﷺ në Ditën e Kiametit.",
  },
  {
    title: "Ura (Sirat)",
    body: "Çdo person kalon mbi Ferr - shpejtësia ndryshon sipas besimit dhe veprave në transmetimet autentike.",
  },
  {
    title: "Parajsa ose Ferri",
    body: "Vendbanimi i përjetshëm - Xheneti me mëshirën dhe veprat e mira të Allahut; Xhehenemi si një paralajmërim i vërtetë dhe pasojë e drejtë.",
  },
  {
    title: "Përjetësia",
    body: "Nuk ka vdekje pas Ahiretit. Banorët e Xhenetit mbeten përgjithmonë në lumturi; banorët e Xhehenemit mbeten ashtu siç ka dashur Allahu.",
  },
];

export const LAST_DAY_QUIZ_SQ: DeepPartial<LastDayQuizQuestion>[] = [
  {
    prompt: "Besimi në Ditën e Fundit është një nga:",
    options: [
      "Pesë shtyllat e Islamit",
      "Gjashtë nenet e besimit (Imani)",
      "Shtatë qiej",
      "Dhjetë shokë",
    ],
    explanation:
      "Imani përfshin besimin në Allahun, engjëjt, librat, të dërguarit, Ditën e Fundit dhe caktimin hyjnor (kadrin).",
  },
  {
    prompt: "Barzakh përshkruhet më së miri si:",
    options: [
      "Ura mbi Ferr",
      "Jeta midis vdekjes dhe ringjalljes",
      "Shkalla e veprave",
      "Shpërthimi i borisë",
    ],
    explanation: "Berzakh është intervali pas vdekjes deri në Ditën e Kijametit.",
  },
  {
    prompt:
      "E vërtetë apo e rreme: Dijetarët bien dakord për sekuencën e saktë të të gjitha shenjave kryesore të Kiametit.",
    options: ["E vërtetë", "E rreme"],
    explanation:
      "Shenjat kryesore janë të vërtetuara në hadithin autentik, por studiuesit ndryshojnë në disa detaje të renditjes. Ora e Kiametit është e njohur vetëm për Allahun.",
  },
  {
    prompt: "Mizani (shkalla) në Ditën e Fundit i referohet:",
    options: [
      "Peshimi i trupave fizikë",
      "Peshimi i veprave me drejtësi të përsosur",
      "Matja e kohës në varr",
      "Numërimi i engjëjve",
    ],
    explanation:
      "Mizani peshon veprat - sinqeriteti dhe veprimi i drejtë e bëjnë peshoren të rëndë.",
  },
  {
    prompt: "Ndërmjetësimi (shefa'ah) në Ditën e Fundit:",
    options: [
      "Ndodh pa lejen e Allahut",
      "Është vetëm me lejen e Allahut",
      "Zëvendëson nevojën për besim",
      "Është mohuar në Kuran",
    ],
    explanation: "Kur'ani 2:255 dhe 20:109 pohojnë ndërmjetësimin vetëm me lejen e Allahut.",
  },
  {
    prompt: "Cili vjen i pari në udhëtimin e përtejme?",
    options: ["Ringjallja", "Vdekja", "Mbledhja", "Bori"],
    explanation:
      "Vdekja i paraprin berzakut, pastaj - pas shenjave dhe borisë - ringjallja dhe tubimi.",
  },
  {
    prompt: "Cilin zakon do ta forconi këtë javë për t'u përgatitur për takimin me Allahun?",
    explanation:
      "Përgatitja është praktike: namazi, Kur'ani, pendimi, bamirësia, karakteri i mirë dhe përmbushja e të drejtave të të tjerëve.",
  },
  {
    prompt: "E vërtetë apo e rreme: Sipas Kuranit 19:71, çdo person do të kalojë mbi Sirat.",
    options: ["E vërtetë", "E rreme"],
    explanation:
      "Ajeti thotë se të gjithë do ta kalojnë atë; Allahu i shpëton ata që mendojnë. Dijetarët diskutojnë detaje se kush bie.",
  },
  {
    prompt:
      "Which phrase did the Prophet ﷺ describe as light on the tongue and heavy on the Scale?",
    options: [
      "Only the five daily prayers",
      "SubhanAllahi wa bihamdih and SubhanAllahil-'Azim",
      "Any long speech in Arabic",
      "Silence alone",
    ],
    explanation:
      "Sahih al-Bukhari 6406: two words light on the tongue, heavy on the Scale, beloved to the Most Merciful.",
  },
];

export const LAST_DAY_REFERENCES_SQ: DeepPartial<LastDayReferenceEntry>[] = [
  {
    title: "Kurani",
    note: "Burimi kryesor për ringjalljen, përgjegjësinë, Parajsën, Ferrin dhe drejtësinë hyjnore. Ajetet në këtë modul citohen nga sureja dhe ajeti.",
  },
  {
    title: "Sahih el-Buhari & Sahih Mysliman",
    note: "Koleksione kanonike të haditheve për vdekjen, varrin, shenjat, llogarinë, ndërmjetësimin, Haudin dhe Siratin.",
  },
  {
    title: "Sunen Tirmidhiu dhe Sunen Ebi Davudi",
    note: "Raporte autentike shtesë mbi varret dhe shenjat e vogla - notat e shënuara aty ku është e aplikueshme.",
  },
  {
    title: "Ibn Kethiri - Tefsir",
    note: "Komenti klasik i ajeteve kuranore për botën tjetër. Përdoret për përmbledhje të shkurtra tefsiri, jo si provë e pavarur.",
  },
  {
    title: "El-Akideh et-Tahavije",
    note: "Besimi themelor sunit që pohon ringjalljen, shkallën, urën, Parajsën dhe Ferrin.",
  },
  {
    title: "Dallimet shkencore",
    note: "Aty ku studiuesit ndryshojnë - p.sh. sekuenca e shenjave kryesore, detajet e Hawd-it, kategoritë që hyjnë pa llogaritur - ky modul vë në dukje ndryshimin pa pretenduar një pikëpamje si mendimin e vetëm të vlefshëm.",
  },
  {
    title: "Zbulesa kundër interpretimit",
    note: "Kurani i qartë dhe mutevatiri ose hadithi sahih dallohen nga mendimet interpretuese (ixhtihad) dhe transmetimet më të dobëta.",
  },
];
