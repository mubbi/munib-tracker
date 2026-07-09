// Albanian translation overlay for the Learn Salah guide content. Mirrors the order of
// its English source in ../salah-guide*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { SalahGuidePhrase, SalahGuideTopic } from "../../types/salah-guide";
import type { DeepPartial } from "./localize";

export const SALAH_GUIDE_TOPICS_SQ: DeepPartial<SalahGuideTopic>[] = [
  {
    title: "Çfarë është Namazi?",
    summary: "Shtylla e dytë e Islamit - takimi juaj i caktuar i përditshëm me Allahun.",
    body: [
      "Namazi është adhurimi formal i caktuar nga Allahu për çdo besimtar: një sekuencë e urdhëruar e qëndrimit në këmbë (kijam), përkulje (ruku) dhe sexhde (suxhud), e bashkuar me fjalët fikse të lavdërimit, Kuranit dhe lutjes, të kryera në pesë kohë të caktuara çdo ditë. Fjala Namazi vjen nga një rrënjë arabe që do të thotë lidhje dhe lutje - është linja e drejtpërdrejtë, e pandërmjetësuar e besimtarit ndaj Krijuesit, që nuk ka nevojë për prift dhe asnjë ndërmjetës.",
      "Një njësi e vetme e plotë e namazit - njëra që qëndron deri në sexhden e dytë - quhet rekat. Namazet numërohen në rekate: sabah është dy, akshami tre, dhe dhuhr, ikind dhe jaci katër. Namazet farz quhen farz; Lutjet shtesë të Pejgamberit ﷺ që falen rregullisht janë sunet dhe lutjet fakultative që falen falas janë nafl.",
      "Veçanërisht në mesin e shtyllave, namazi nuk u shpall përmes një engjëlli që zbriste në tokë, por iu urdhërua drejtpërdrejt Profetit ﷺ kur ai u ngrit nëpër qiej në Udhëtimin e Natës (el-Isra' ue el-Mi'raj). Pesëdhjetë namaze fillimisht u urdhëruan, pastaj - përmes kthimeve të përsëritura të Profetit ﷺ duke kërkuar lehtësi për umetin e tij - u reduktuan në pesë të kryera me vepër duke mbajtur shpërblimin prej pesëdhjetë.",
      "Kjo është arsyeja pse namazi është në qendër të jetës islame: i përsëritur pesë herë në ditë, ai ndërpret punën, pushimin dhe kohën e lirë për të ri-ankoruar zemrën tek Allahu dhe është vepra e parë për të cilën një rob do të kërkohet të japë llogari në Ditën e Ringjalljes. Nëse gjendet tingull, pjesa tjetër e regjistrimit tenton të ndjekë.",
    ],
    quran: [
      {
        excerpt:
          "Të cilët besojnë në të fshehtën, e falin namazin dhe japin nga ajo që Ne u kemi dhënë.",
      },
      {
        excerpt:
          "Lexo atë që të është shpallur nga Libri dhe fale namazin. Vërtet, namazi largon nga imoraliteti dhe keqbërja, e përmendja e Allahut është më e madhe.",
      },
    ],
    hadith: [
      {
        excerpt:
          'Në udhëtimin e natës Allahu urdhëroi pesëdhjetë namaze; Profeti ﷺ vazhdoi të kthehej për të kërkuar lehtësim derisa ata ishin pesë vjeç - "Këta janë pesë dhe këta janë pesëdhjetë, sepse fjala me Mua nuk ndryshon". (gjithashtu Sahih Mysliman 162)',
      },
      {
        excerpt:
          "Gjëja e parë për të cilën një rob do të merret në llogari në Ditën e Kiametit është namazi i tij; nëse është e shëndoshë, veprat e tjera të tij janë të shëndosha. (edhe Ebu Davud 864, en-Nesa'i 3991)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Pse Namazi?",
    summary:
      "Frytet shpirtërore, morale, psikologjike dhe të përjetshme të pesë namazeve të përditshme.",
    body: [
      "Namazi është një bisedë e drejtpërdrejtë me Allahun. Në qëndrimin e tij ju i drejtoheni Atij nëpërmjet fjalëve të Tij të shpallura; në sexhde - qëndrimi i përulësisë më të madhe - ti je më afër Atij dhe ka më shumë gjasa të përgjigjesh. Asnjë akt tjetër adhurimi nuk përsëritet kaq shpesh apo aq nga afër.",
      "Fryti i tij i parë është një shpirt i përmbajtur dhe i disiplinuar. Vetë Allahu pohon se lutja, kur bëhet siç duhet, 'frenon nga imoraliteti dhe keqbërja' (29:45): personi që me të vërtetë qëndron para Allahut pesë herë në ditë e ka më të vështirë t'i afrohet mëkatit. Ai është gjithashtu një pastrim i përsëritur - Profeti (a.s.) i krahasoi pesë lutjet me një lumë të rrjedhshëm në të cilin njeriu lahet pesë herë në ditë, pa lënë papastërti.",
      'Fryti i dytë i saj është paqja e brendshme. Kur\'ani premton se zemrat gjejnë prehje me përmendjen e Allahut dhe Profeti ﷺ, në momente shqetësimi, thoshte: "Na ngushëllo me të, o Bilal", duke thirrur për namaz. Ai e përshkroi kënaqësinë e syve të tij si të vendosur në namaz.',
      "Frytet e tij shoqërore dhe të përjetshme plotësojnë tablonë: namazi me xhemat i nivelon të pasurit dhe të varfërit në një rresht të vetëm dhe ndërton vëllazëri, ndërsa ruajtja e namazit është ndër rrugët më të sigurta për në faljen e Allahut dhe për në Xhenet. Pejgamberi ﷺ i premtoi Xhennetin atij që i ruan dy namazet e 'ftohta' të sabahut dhe të ikindisë.",
    ],
    quran: [
      {
        excerpt:
          "Vërtet, unë jam Allahu. Nuk ka zot tjetër përveç Meje, andaj më adhuroni Mua dhe falni namazin për të më kujtuar Mua.",
      },
      {
        excerpt:
          "Me të vërtetë të suksesshëm janë besimtarët - ata që janë të përulur në lutjen e tyre.",
      },
    ],
    hadith: [
      {
        excerpt:
          '"Nëse do të kishte një lumë në derën e njërit prej jush në të cilin ai lahej pesë herë në ditë, a do të mbetej mbi të ndonjë papastërti?" Ata thanë: "Asnjë". Ai (ﷺ) tha: "Kjo është ngjashmëria e pesë namazeve - Allahu i fshin mëkatet me to". (gjithashtu Sahih Mysliman 667)',
      },
      {
        excerpt: "Kush i fal dy namazet e ftohta - sabahun dhe ikindrinë - do të hyjë në xhenet.",
      },
      {
        excerpt:
          "Më janë bërë të dashura nga bota jote, gratë dhe parfumi, dhe freskia e syve të mi është vënë në lutje.",
      },
    ],
    actions: [
      "Falni vetëm një lutje plotësisht në kohë sot - qëndrueshmëria, jo përsosmëria, është qëllimi i parë.",
      "Lexoni kuptimin e El-Fatihah një herë para namazit tuaj të ardhshëm për të ndjerë se po merrni përgjigje.",
      "Aktivizo përkujtuesit e ezanit në mënyrë që asnjë dritare lutjeje të mos kalojë pa u vënë re.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Rangu i tij në Islami",
    summary: "Një shtyllë e fesë - dhe vepra më e rëndë për t'u neglizhuar.",
    body: [
      'Profeti ﷺ mësoi se Islami është ndërtuar mbi pesë shtylla dhe namazi është i dyti, menjëherë pas dy dëshmive të besimit. Dëshmia të pranon në Islami; lutja është prova e qëndrueshme se dëshmia jeton në zemrën tuaj. Kjo është arsyeja pse dijetarët e quajnë namazin "shtylla e fesë" - një shtëpi pa shtyllën e saj qendrore shembet.',
      "Pesha e saj shihet në atë se si tekstet flasin për neglizhencën e saj. Kur'ani paralajmëron për një brez që 'neglizhoi namazin dhe ndoqi dëshirat' dhe parashikon shkatërrimin e tyre, dhe Profeti ﷺ e përshkroi namazin si vetë besëlidhjen që e dallon besimin nga mosbesimi.",
      "Për vendimin e atij që e braktis namazin, ekziston një dallim i njohur dhe i respektueshëm mes dijetarëve sunitë. Disa mendojnë se braktisja e qëllimshme e tij krejtësisht – ndërkohë që pohojnë se është e detyrueshme – përbën mosbesim të madh që e dëbon një person nga Islami; shumica (hanefi, maliki, shafi'i) mendojnë se një person i tillë mbetet një musliman mëkatar fajtor për një nga mëkatet më të rënda, me kusht që të mos e mohojë obligimin e tij. Të gjithë pajtohen se braktisja e namazit është një katastrofë dhe se kushdo që e mohon obligimin e tij është larguar nga Islami me konsensus.",
      "Mësimi praktik është i njëjtë në çdo pikëpamje: ruajtja e pesë namazeve ditore nuk është fakultative ose e negociueshme për një besimtar. Namazet vullnetare (suneh dhe nafl) më pas veprojnë si një rrjet sigurie, duke plotësuar mangësitë në namazet e detyrueshme në Ditën e Gjykimit.",
    ],
    quran: [
      {
        excerpt:
          "Mbani me kujdes namazin dhe namazin e mesëm dhe qëndroni para Allahut me besim të devotshëm.",
      },
      {
        excerpt:
          "Por pas tyre erdhën pasardhës që e lanë pas dore namazin dhe ndoqën dëshirat; kështu që ata do të takohen me të keqen.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Islami është ndërtuar mbi pesë: dëshmia se nuk ka Zot tjetër përveç Allahut dhe se Muhamedi është i Dërguari i Tij, falja e namazit, dhënia e zekatit, haxhi dhe agjërimi i Ramazanit. (gjithashtu Sahih el-Buhari 8)",
      },
      {
        excerpt:
          "Besëlidhja mes nesh dhe atyre është namazi; kush e braktis atë ka bërë kufër. (Burejde; gjithashtu en-Nesa'i, Ibn Maxhe 1079)",
      },
      {
        excerpt:
          "Ndërmjet njeriut dhe mosbesimit dhe idhujtarisë qëndron lënia e namazit. (Xhabir)",
      },
    ],
    disclaimer:
      "Dijetarët ndryshojnë në vendimin e saktë për atë që e braktis namazin nga përtacia (mëkati i madh për shumicën; mosbesimi për të tjerët) kundrejt atij që e mohon obligimin e tij (mosbesimi me konsensus). Ky aplikacion nuk lëshon një vendim për asnjë individ - konsultohuni me një studiues të kualifikuar për çështje personale.",
  },
  {
    title: "Kush duhet të lutet?",
    summary:
      "Çdo musliman i shëndoshë, i rritur - me përjashtime dhe lëshime të përcaktuara qartë.",
    body: [
      "Namazi bëhet i detyrueshëm për çdo musliman që është i arsyeshëm dhe ka arritur pubertetin (bulugh). Tre grupe janë hequr nga përgjegjësia tërësisht nga një parim autentik: ai që fle derisa të zgjohet, fëmija derisa të piqet dhe i paaftë mendërisht derisa të kthehet arsyeja e shëndoshë.",
      "Fëmijët nuk janë ende të detyruar, por ata trajnohen gradualisht. Profeti ﷺ udhëzoi që fëmijët të urdhërohen të falin namazin që nga mosha shtatë vjeç dhe të disiplinohen butësisht për neglizhimin e tij në dhjetë - në mënyrë që namazi në pubertet të jetë tashmë një zakon i vendosur, jo një barrë e papritur.",
      "Gratë në menstruacione (hajd) ose gjakderdhje pas lindjes (nifas) nuk falen gjatë asaj kohe; namazet e detyrueshme të humbura nuk falen më pas - një mëshirë dhe një vendim për të cilin kanë rënë dakord dijetarët. (Agjërimi i humbur, ndryshe nga namazet, është i falur.) Gruaja e rifillon namazin pasi të përfundojë gjakderdhja dhe ajo të jetë pastruar me gusl.",
      "Paaftësia e vërtetë sjell lëshim, kurrë anulim: sëmundja e rëndë, humbja e vetëdijes dhe frika dërrmuese mund ta shfajësojnë një person për një kohë, dhe të sëmurët luten sipas aftësive të tyre - ulur, shtrirë apo edhe me gjeste. Udhëtimi nuk e largon namazin, por e lehtëson atë përmes shkurtimit (qasr) dhe kombinimit (xhem'), të përshkruara në udhëzuesin e udhëtimit.",
    ],
    hadith: [
      {
        excerpt:
          "Urdhëroni fëmijët tuaj të falin namaz kur të jenë shtatë vjeç dhe disiplinojini për këtë në dhjetë dhe ndani vendet e tyre të fjetjes. (Amr ibn Shuajb nga babai i tij nga gjyshi i tij)",
      },
    ],
    quran: [
      {
        excerpt: "Dhe urdhëro familjen tënde për namaz dhe bëhu i qëndrueshëm në të.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Kushtet para namazit",
    summary: "Nëntë parakushtet (shurut) që duhet të jenë në vend që namazi të jetë i vlefshëm.",
    body: [
      "Para se namazi të jetë i vlefshëm, duhet të plotësohen disa kushte (shurut al-Namazi). Një kusht ndryshon nga një shtyllë: kushtet janë parakushte që vijnë para fillimit dhe vazhdojnë gjatë gjithë kohës, ndërsa shtyllat (arkan) janë pjesë e vetë namazit. Nëse mungon një kusht i kërkuar, namazi nuk pranohet sado mirë të falet.",
      "Mendoni për këto nëntë si një listë kontrolli para fluturimit. Shumica lidhen me një mësim më të plotë diku tjetër në këtë udhëzues - prekni për të mësuar secilin në thellësi. Dy prej tyre (i kthyer nga kibleja dhe koha e saktë) mund të justifikohen në paaftësi të vërtetë; pjesa tjetër kërkohet me vendosmëri sa herë që dikush është në gjendje.",
    ],
    steps: [
      {
        title: "Islami",
        body: "Namazi është vepër e muslimanit; nuk është e vlefshme nga - dhe as e detyrueshme për - një jomusliman derisa ata të hyjnë në Islami.",
      },
      {
        title: "Mendje e shëndoshë ('akl)",
        body: "Personi duhet të jetë i arsyeshëm. Ai që ka humbur mendjen e shëndoshë nuk mbahet përgjegjës ndërsa është në atë gjendje.",
      },
      {
        title: "Aftësia dalluese (tamyiz)",
        body: "Aftësia për të dalluar, arriti rreth moshës shtatëvjeçare - mosha nga e cila u thuhet fëmijëve të luten.",
      },
      {
        title: "Largimi i papastërtisë së vogël dhe të madhe (taharah nga hadithi)",
        body: "Një gjendje e vlefshme abdes, ose gusl pas papastërtisë së madhe, ose tejemmum kur uji nuk mund të përdoret.",
      },
      {
        title: "Heqja e papastërtisë (nexhasah)",
        body: "Trupi, veshja dhe vendi i lutjes duhet të jenë pa papastërti rituale si urina, gjaku në sasi dhe substanca të tjera të listuara.",
      },
      {
        title: "Mbulimi i avretit",
        body: "Pjesët që duhet të mbulohen janë të mbuluara me veshje të pastra dhe të errëta — shikoni mësimin Veshje dhe awrah.",
      },
      {
        title: "Ka hyrë koha e namazit",
        body: "Çdo namaz ka një dritare të përcaktuar; falja para se të fillojë koha e tij është e pavlefshme. Përdorni orarin tuaj dhe përkujtuesit.",
      },
      {
        title: "Përballë kibles",
        body: "Duke u kthyer drejt Qabes sa më afër që mund të përcaktoni - justifikuar vetëm në paaftësinë e vërtetë.",
      },
      {
        title: "Synimi (nijet)",
        body: "Të zgjidhësh në zemër se cilën lutje do të bësh. Është një akt i brendshëm dhe nuk flitet me zë.",
      },
    ],
    appLinks: [{}, {}, {}],
    disclaimer:
      "Shkollat ​​i thonë dhe i numërojnë kushtet pak më ndryshe (disa e rendisin nijetin midis shtyllave dhe jo kushteve). Substanca është rënë dakord.",
  },
  {
    title: "Pastrimi (Taharah)",
    summary: "Pastërtia e vetvetes, veshjes dhe vendit - dera e çdo lutjeje.",
    body: [
      'Taharah do të thotë heqja e papastërtisë rituale në mënyrë që të mund të qëndroni para Allahut në një gjendje të pastër. Allahu i do ata që pastrohen dhe Profeti ﷺ mësoi se "pastrimi është gjysma e besimit". Asnjë lutje nuk pranohet pa të.',
      "Papastërtia është dy llojesh. Papastërtia e vogël (hadath asgar) - e shkaktuar nga gjëra të tilla si përdorimi i tualetit ose era që kalon - hiqet nga abdesi. Papastërtia e madhe (hadet ekber ose xhenabe) - pas intimitetit, derdhjes, ose përfundimit të menstruacioneve dhe gjakderdhjes pas lindjes - hiqet me një banjë të plotë rituale (ghusl).",
      "Veçmas nga këto gjendje rituale, papastërtia e prekshme (nexhasah) - si urina, jashtqitja, gjaku që rrjedh dhe të ngjashme - duhet të hiqen fizikisht nga trupi, rrobat dhe vendi ku faleni. Është e mundur që të keni abdes të vlefshëm, por ende duhet të pastroni një njollë nga rrobat tuaja përpara se të faleni.",
      "Uji është pastruesi kryesor. Kur uji është vërtet i padisponueshëm, ose do t'ju dëmtonte për shkak të sëmundjes ose të ftohtit të rëndë, Islami e lejon tejemmumin - një pastrim të thatë duke përdorur tokë të pastër - si një zëvendësues të plotë. Pastrimi nuk është menduar kurrë të jetë një vështirësi; është një mjet për t'u afruar.",
    ],
    hadith: [
      {
        excerpt: "Pastrimi është gjysma e besimit... (Ebu Malik el-Esh'ari)",
      },
    ],
    quran: [
      {
        excerpt: "Vërtet, Allahu i do ata që pendohen vazhdimisht dhe i do ata që pastrohen.",
      },
    ],
    actions: [
      "Mësoni abdes hap pas hapi para namazit tuaj të ardhshëm, në mënyrë që çdo gjymtyrë të lahet siç duhet.",
      "Mbani një rrobë të pastër të lënë mënjanë për lutje nëse punoni në një mjedis të ndotur.",
      "Hidhni një sy mbi vendin tuaj të lutjes për papastërti të dukshme përpara se të vendosni tapetin.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Abdes - abdes",
    summary: "Larja e urdhëruar që heq papastërtitë e vogla dhe të përgatit për lutje.",
    body: [
      "Abdesi është larja rituale që heq papastërtitë e vogla. Kërkohet para çdo namazi, përveç nëse jeni ende në një gjendje të vlefshme nga ai i mëparshmi, dhe - sipas shumicës së dijetarëve - para se të prekni tekstin fizik të Kuranit. Katër larjet e detyrueshme të tij janë emërtuar drejtpërdrejt në Kuran (5:6): fytyra, krahët deri në bërryla, fshirja e kokës dhe këmbët deri te kyçet.",
      "Pejgamberi ﷺ mori abdes në mënyrë të vendosur, tri herë për gjymtyrët e lara, tërësisht por pa harxhuar ujë - ai paralajmëroi nga teprimi edhe në një lumë që rrjedh. Përtej katër obligimeve, shpëlarja e gojës dhe e hundës, larja e duarve në fillim dhe përdorimi i misvakut janë sunete të vendosura që plotësojnë dhe zbukurojnë abdesin.",
      "Shpërblimi i tij është i pamasë: Profeti (a.s.) mësoi se ndërsa një besimtar lan çdo gjymtyrë, mëkatet e kryera nga ajo gjymtyrë bien me ujë - madje edhe nga poshtë thonjve - në mënyrë që ai të dalë i pastruar. Prandaj abdesi nuk është thjesht një formalitet, por një akt i vogël faljeje para çdo namazi.",
      "Abdesi prishet nga çdo gjë që del nga rrugët private (urina, jashtëqitja, era), nga gjumi i thellë që largon vetëdijen dhe nga humbja e vetëdijes. Nëse prishet gjatë namazit, duhet të ndaloni, të rinovoni abdesin dhe të filloni përsëri namazin.",
    ],
    steps: [
      {
        title: "Nijeti & Bismilah",
        body: "Kini për qëllim abdesin në zemrën tuaj dhe filloni me 'Bismilah'. Synimi është i brendshëm dhe nuk ka nevojë të shprehet.",
        tip: "Përdorni misvakun (sivakun) paraprakisht kur mundeni - një sunet që Profeti ﷺ e donte dhe gati e bëri të detyrueshëm.",
      },
      {
        title: "Lani duart",
        body: "Lani të dyja duart deri në kyçet e duarve tre herë, duke përdorur ujë midis gishtave.",
      },
      {
        title: "Shpëlajeni gojën",
        body: "Merrni ujë në gojë, rrotullojeni dhe nxirreni - tri herë.",
      },
      {
        title: "Shpëlajeni hundën",
        body: "Hidhni ujë në vrimat e hundës me dorën e djathtë dhe nxirreni me të majtën - tre herë.",
      },
      {
        title: "Lani fytyrën (farz)",
        body: "Lani të gjithë fytyrën një herë deri në tre herë, nga vija e flokëve tek mjekra dhe nga veshi në vesh; një burrë kalon gishtat e lagur nëpër një mjekër të trashë.",
      },
      {
        title: "Lani krahët (farz)",
        body: "Lani krahun e djathtë, pastaj të majtën, nga majat e gishtave deri dhe duke përfshirë bërrylat - tri herë secili.",
      },
      {
        title: "Fshij koken (farz)",
        body: "Me duar të lagura, fshijeni kokën një herë nga përpara në mbrapa dhe përsëri mbrapa, më pas fshijeni pjesën e brendshme dhe të pasme të veshëve me të njëjtën lagështirë.",
      },
      {
        title: "Lani këmbët (farz)",
        body: "Lani këmbën e djathtë, pastaj të majtën, dhe duke përfshirë kyçet - tri herë secila, duke kaluar gishtat midis gishtërinjve.",
      },
      {
        title: "Dëshmia e besimit",
        body: "Plotësoni me duanë: 'Eshhedu en la ilahe illlah...' - tetë dyert e xhenetit hapen për këdo që e thotë atë pas abdesit.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kur një shërbëtor lan fytyrën e tij në abdes, çdo mëkat që e shikon me sy e lë me ujë… derisa të dalë i pastruar nga mëkati.",
      },
    ],
    quran: [
      {
        excerpt:
          "O ju që besuat, kur të ngriheni për të falur namazin, lani fytyrat dhe parakrahët deri në bërryla, fshijini kokat tuaja dhe lani këmbët deri në kyçin e këmbës.",
      },
    ],
    actions: [
      "Bëni abdes ngadalë një herë ndërsa lexoni çdo hap me zë të lartë, duke kontrolluar bërrylat dhe thembrat.",
      "Mësoni përmendësh duanë e shkurtër pas abdesit - shih Fjalët e namazit.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Veshje & Awrah",
    summary: "Mbuloni atë që duhet të mbulohet - pastër, modest dhe me respekt.",
    body: [
      "Mbulimi i aurahut - pjesëve të trupit që duhet të fshihen - është kusht i lutjes së vlefshme, i nxjerrë nga urdhri i Allahut për 'merrni stolitë tuaja në çdo vend faljeje' (7:31). Veshja duhet të jetë e pastër nga nexhasah dhe mjaft e errët që ngjyra e lëkurës të mos shfaqet.",
      "Për burrat, aureti në namaz është së paku nga kërthiza deri te gjuri. Megjithatë, falja me gjoks të zhveshur kur ka veshje është e papëlqyeshme; Profeti a.s. ka porositur që njeriu të mos falet me një rrobë të vetme pa një pjesë të saj mbi supet e tij.",
      "Për gratë, i gjithë trupi është awrah në namaz, përveç fytyrës dhe duarve, sipas shumicës së dijetarëve; një grua mbulon flokët, qafën dhe këmbët, zakonisht me një rrobë të gjerë dhe shami. Dijetarët ndryshojnë në lidhje me këmbët, disa duke i konsideruar ato të përfshira në atë që mund të tregohet - lutja me to të mbuluara është praktika më e sigurt dhe e shumicës.",
      "Dy rregulla të veshjes zbatohen edhe jashtë namazit: mëndafshi dhe ari janë të ndaluara për burrat të veshin (lejohet për gratë) dhe veshja nuk duhet të jetë aq e ngushtë, e tejdukshme ose që kërkon vëmendje sa të mposht thirrjen e modestisë për lutjen. Si rregull i madh, lutuni me atë që do të vishnit për të takuar dikë që e respektoni - jo rroba nate apo rroba plazhi.",
    ],
    quran: [
      {
        excerpt: "O bijtë e Ademit, merrni stolitë tuaja në çdo vend faljeje.",
      },
    ],
    actions: [
      "Lini mënjanë një veshje të pastër, modeste ose një veshje të dedikuar për lutje, në mënyrë që të jeni gjithmonë gati.",
      "Kur nuk jeni të sigurt nëse diçka mbulon mjaftueshëm, mbuloni më shumë sesa më pak.",
    ],
    disclaimer:
      "Detajet e awrahut (veçanërisht këmbët e një gruaje) janë një pikë e dallimit të respektueshëm dijetar. Ndiqni një bursë të besueshme lokale ku ndryshoni.",
  },
  {
    title: "Kohët e namazit",
    summary: "Pesë dritare ditore - çdo namaz ka një fillim, një fund dhe një moment të preferuar.",
    body: [
      "Allahu i caktoi lutjet 'në kohë të caktuar' (4:103), duke e ndarë ditën dhe natën në pesë dritare të lidhura me lëvizjen e diellit. Lutja para se të hapet një dritare është e pavlefshme; vonimi i një lutjeje përtej dritares së tij pa justifikim është një mëkat i rëndë. Sa herë që është e mundur, faluni herët në dritare – Profeti (a.s.) e quajti namazin në kohën e tij të parë ndër veprat më të dashura tek Allahu.",
      "Pesë dritaret janë: sabahu, nga agimi i vërtetë deri në lindjen e diellit; Dhuri, nga dielli që kalon zenitin e tij derisa hija e një objekti të jetë e barabartë me gjatësinë e tij; Asr, nga fundi i Dhuhrit deri në perëndim të diellit (më së miri falet para se të zverdhë dielli); Akshami, nga perëndimi i diellit deri në zbehjen e muzgut të kuq; dhe jacinë, nga zbehja e muzgut deri në agim të vërtetë (më së miri falet para mesnatës).",
      "Janë tri periudha të shkurtra në të cilat namazi vullnetar është i ndaluar, kështu që adhurimi nuk ngatërrohet kurrë me adhurimin e diellit: pasi dielli po lind derisa të lindë plotësisht, kur qëndron saktësisht në kulmin e tij në mesditë dhe ndërsa po perëndon derisa të perëndojë plotësisht. Falja e faljes së namazit farz përjashtohet nga kjo ndalesë.",
      "Orët e sakta të orës ndryshojnë çdo ditë me gjerësinë dhe stinën tuaj, kjo është arsyeja pse Profeti ﷺ i lidhi ato me shenja natyrore dhe jo me një orë të caktuar. Aplikacioni i llogarit ato për vendndodhjen tuaj - por njohja e shenjave themelore ju mban në tokë kur teknologjia nuk është e disponueshme.",
    ],
    steps: [
      {
        title: "Sabah - 2 rekate farze",
        body: "Agimi i vërtetë deri në lindjen e diellit. Paraprihet nga një sunet 2-rekate i theksuar fort.",
      },
      {
        title: "Dhuhr - 4 rekate farze",
        body: "Pasi dielli kalon zenitin e tij deri në hijen e Asr. Suneti i 4 para dhe 2 pas.",
      },
      {
        title: "Asr - 4 rekate farze",
        body: "Nga fundi i Dhuhrit deri në perëndim të diellit; lutuni para se të zverdhet dielli. Shpesh identifikohet me 'lutjen e mesme' të 2:238.",
      },
      {
        title: "Akshami - 3 rekate farze",
        body: "Nga perëndimi i diellit deri në zbehje të muzgut; lutuni menjëherë. Suneti i 2 pas.",
      },
      {
        title: "Isha - 4 rekate farze",
        body: "Nga zbehja e muzgut deri në agim; më e mira para mesnatës. I ndjekur nga Witr.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Janë tri kohë në të cilat Pejgamberi ﷺ na ka ndaluar të falemi: kur lind dielli derisa të lindë, kur qëndron në mesditë dhe kur perëndon derisa të perëndojë. (Ukbe ibn Amir)",
      },
    ],
    quran: [
      {
        excerpt: "Vërtet, namazi u është caktuar besimtarëve një dekret i kohëve të caktuara.",
      },
      {
        excerpt:
          "Dhe fale namazin në dy skajet e ditës dhe në afrimin e natës. Vërtet, veprat e mira i largojnë të këqijat.",
      },
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Fillimi i Asr ka dy opinione të raportuara (hije e barabartë me, ose dy herë, gjatësinë e një objekti). Të dyja janë të vlefshme; ndiqni llogaritjen dhe komunitetin tuaj lokal.",
  },
  {
    title: "Përballë kibles",
    summary: "Kthehu drejt Shtëpisë së Shenjtë në Mekë - drejtimi që bashkon umetin.",
    body: [
      "Kibleja është drejtimi i Qabes brenda Mesxhid el-Haram në Mekë. Përballja me të është kusht i lutjes së vlefshme. Në fillim të Islamit, muslimanët luteshin drejt Jeruzalemit; pastaj Allahu shpalli urdhrin për t'u kthyer drejt Xhamisë së Shenjtë dhe një drejtim i vetëm i ka bashkuar adhuruesit e botës që atëherë - një shprehje e përditshme fizike e një komuniteti përballë një Zoti.",
      "Ju kërkohet të përballeni me kiblen me aq saktësi sa mund të përcaktoni në mënyrë të arsyeshme - me një busull, mihrabin e një xhamie, një aplikacion të besueshëm ose diellin dhe yjet kur udhëtoni. Një devijim i vogël, i pashmangshëm falet; ajo që ka rëndësi është përpjekja e sinqertë drejt drejtimit të duhur.",
      "Nëse vërtet nuk mund ta përcaktoni drejtimin – të humbur në det, në re, në një tokë të panjohur natën – përpiqeni ta zgjidhni atë dhe më pas luteni drejt gjykimit tuaj më të mirë; namazi është i vlefshëm edhe nëse më vonë dëshmon paksa. Në një mjet ose avion në lëvizje, ku është e pamundur të shikosh nga kibla për një namaz farz, ti përballesh me çfarë të mundesh, pasi Allahu nuk e ngarkon një shpirt përtej kapacitetit të tij.",
    ],
    quran: [
      {
        excerpt:
          "Pra, kthejeni fytyrën tuaj nga Mesxhid el-Haram. Dhe kudo që të jeni, ktheni fytyrat drejt tij.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kur të ngrihesh për të falur namazin, merr abdes mirë, pastaj kthehu kah kibleja dhe thuaj tekbir. (nga hadithi i njeriut që falej keq)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ezani - ezani për namaz",
    summary: "Fjalët që thërrasin umetin, kuptimi i tyre dhe si t'u përgjigjemi atyre.",
    body: [
      "Ezani është thirrja që lajmëron se ka hyrë koha e namazit. Është një sunet i përbashkët për pesë namazet ditore (jo për Bajramin apo namazin e xhenazes), që jepet nga një vend i ngritur në mënyrë që komuniteti të mblidhet për të adhuruar. Pas tij, pak para fillimit të namazit, vjen një thirrje e dytë, më e shkurtër - ikameti.",
      "Kur dëgjoni ezanin, sunneti është të përsërisni çdo frazë pas mu'adhinit - përveç në 'Hajya 'ala es-Namazi' dhe 'Hajya 'ala al-falah', ku në vend të kësaj thoni 'La hawla ue la kuvwata illa billah' (nuk ka fuqi as forcë përveçse me Allahun). Në ezanin e sabahut thirrësi shton 'Es-salatu khayrun min en-neum' (namazi është më i mirë se gjumi).",
      "Pas përfundimit të ezanit, dërgoni salavate mbi Profetin salAllahu alejhi ue selem, pastaj lexoni duatë e vendosura duke i lutur Allahut t'i japë atij pozitën e lavdëruar (el-vasilah) - Profeti ﷺ i premtoi ndërmjetësimin e tij atij që e thotë atë. Momenti ndërmjet ezanit dhe ikametit është një kohë kur lutja nuk refuzohet, prandaj bëni dua lirisht.",
    ],
    steps: [
      {
        title: "Allahu Ekber (×4)",
        body: "Allahu është më i madhi – më i madh se çdo gjë që mund të të ketë shpërqendruar.",
      },
      {
        title: "Eshhedu en la ilahe illallah (×2)",
        body: "Dëshmoj se nuk ka zot tjetër përveç Allahut.",
      },
      {
        title: "Eshhedu anna Muhamedan resulullah (×2)",
        body: "Dëshmoj se Muhamedi është i Dërguari i Allahut.",
      },
      {
        title: "Hajja ala es-Namazi (×2)",
        body: "Ejani në namaz. Përgjigjuni me: La hawla ue la kuveta illa billah.",
      },
      {
        title: "Hajja ala al-falah (×2)",
        body: "Ejani drejt suksesit. Përgjigjuni me: La hawla ue la kuveta illa billah.",
      },
      {
        title: "Allahu Ekber (×2)",
        body: "Allahu është më i madhi.",
      },
      {
        title: "La ilahe illlah",
        body: "Nuk ka Zot përveç Allahut – thirrja mbyllet me të njëjtën fjalë që iu hap.",
      },
    ],
    hadith: [
      {
        excerpt:
          'Kushdo që me të dëgjuar thirrjen thotë: "O Allah, Zot i kësaj thirrjeje të përsosur dhe namazit të kryer, jepi Muhammedit vasilën dhe virtytin..." - ndërmjetësimi im do të jetë i tij në Ditën e Kiametit. (Xhabir)',
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Namaz hap pas hapi",
    summary: "Sekuenca e plotë e një rekati - çdo frazë e recituar, me vendimin e saj.",
    body: [
      "Çdo namaz ndërtohet nga një njësi përsëritëse - rekati: qëndroni në këmbë dhe lexoni, përkuleni, ngriheni, bëni sexhde dy herë dhe (në fund të namazit) uleni për teshehudin dhe jepni selam. Mësoni mirë një rekat dhe mund të falni çdo namaz, sepse namazet më të gjata thjesht e përsërisin këtë njësi. Hapat e mëposhtëm japin secilin veprim në rend, fjalët e sakta që duhen thënë në arabisht me kuptimin e tyre dhe një etiketë të vogël që tregon nëse veprimi është një shtyllë, një veprim i kërkuar ose i rekomanduar.",
      "Dijetarët i renditin veprimet e namazit në tre nivele. Një farz (shtyllë / rukn) është thelbësor: lëreni atë - qoftë edhe gabimisht - dhe namazi ose ai rekat është i pavlefshëm derisa të falet. Një vaxhib (vepër e detyrueshme) është e detyrueshme, por nëse e harroni atë, ju e rregulloni namazin me sexhden e harresës (suxhud es-sahw) në vend që ta përsërisni atë. Një sunet rekomandohet dhe shpërblehet dhe namazi është i plotë dhe i vlefshëm pa të. Aty ku shkollat ​​e fikhut vendosin një veprim në një kategori tjetër, këshillat e vënë në dukje - ky kufi i trefishtë është në vetvete një nga fushat klasike të dallimeve dijetare.",
      "Gjatë gjithë kohës, e vetmja cilësi që nuk duhet humbur kurrë është tuma'ninah - qetësia: vendosja e plotë në çdo qëndrim, me gjymtyrët në pushim, përpara se të vazhdoni. Pejgamberi ﷺ dërgoi një burrë që ishte lutur me nxitim për t'u falur përsëri tri herë, duke i thënë: \"Kthehu dhe falu, sepse nuk je falur\", pastaj e mësoi atë të ishte i qetë në çdo pozicion. Lëvizni ndërmjet qëndrimeve me tekbirin 'Allahu Ekber' dhe mbani shikimin në vendin e sexhdes.",
      "Sa rekate, dhe ku uleni: një namaz me dy rekate (sabah dhe xhuma) ka një ulje - teshehudi i fundit pas rekatit të dytë - pastaj selami. Një namaz prej tre rekatesh (Magrib) dhe një namaz katër rekatesh (Dhuhr, Asr, Isha) ulen për një teshehud të parë, më të shkurtër pas rekatit të dytë, pastaj qëndroni për rekatin(et) e mbetura - duke lexuar vetëm El-Fatihanë në to, pa sure të shtuar - dhe uluni përsëri për teshehun e fundit.",
      "Me zë ose në heshtje: El-Fatiha dhe sureja lexohen me zë (xhehri) në sabah, xhuma dhe dy rekatet e para të akshamit dhe jacisë; ato lexohen në heshtje (sirri) në Dhuhr dhe Asr, në rekatin e tretë të akshamit dhe në rekatin e tretë dhe të katërt të jacisë. Çdo frazë tjetër e namazit - tesbihu i rukusë dhe suxhudit, teshehud, e kështu me radhë - thuhet në heshtje. Dikush që falet vetëm mund të recitojë me zë të lartë në lutjet me zë të lartë ose ta mbajë atë të ulët; një ndjekës pas imamit thjesht dëgjon ndërsa imami reciton me zë të lartë.",
      "Disa shtesa u përkasin lutjeve ose momenteve të veçanta. Në namazin e vitrit shumë lexojnë Kunutin në rekatin e fundit - duke ngritur duart për t'u lutur për udhëzim dhe mbrojtje (një formulim i njohur fillon 'Allahumma-hdini fiman hadejt...'). Në kohë të vështira, Kunut en-Nazilah mund t'i shtohet namazeve të detyrueshme dhe shkollat ​​ndryshojnë për një Kunut në këmbë në sabah. Nëse i bashkohesh xhematit vonë (masbuk), çdo gjë që kap me imamin llogaritet dhe i plotëson rekatet që ke lënë pas selamit të tij. Dhe nëse shtoni ose hidhni diçka gabimisht, shihni udhëzuesin për suxhud es-sehv.",
    ],
    steps: [
      {
        title: "1. Qëllimi dhe qëndrimi (nijet dhe kijam)",
        body: "Drejtohuni kah kibleja dhe qëndroni drejt – qëndrimi në këmbë është shtyllë e çdo namazi farz për këdo që ka mundësi. Vendosni në zemër se cilën lutje të veçantë do të bëni; qëllimi është një vendosmëri e brendshme, jo një fjali e thënë me zë të lartë.",
        tip: "Nguli sytë te vendi i suxhudit dhe mbaji aty. Kushdo që me të vërtetë nuk mund të qëndrojë, falet ulur, pastaj duke gënjyer - namazi në vetvete nuk hiqet kurrë.",
      },
      {
        title: "2. Hapja e tekbirit (Tekbiratul-Ihram)",
        body: "Ngrini duart deri te shpatullat ose llapët e veshit dhe thoni tekbir, pastaj vendosni dorën e djathtë mbi të majtën në gjoks. Me këtë fillon namazi dhe të folurit dhe lëvizja e zakonshme tani janë të ndaluara deri në selam.",
        translation: "Allahu është më i madhi.",
        tip: "Ngritja e duarve (raf'el-jadejn) me tekbir është një sunet i konfirmuar, jo një shtyllë.",
      },
      {
        title: "3. Lutja hapëse (Dua el-Istiftah)",
        body: "Recitoni në heshtje një lutje të shkurtër hapëse për të qetësuar zemrën para fjalëve të Allahut. Janë raportuar disa formulime autentike; kjo është një nga më të zakonshmet.",
        translation:
          "Lavdia të takon Ty, o Allah, dhe lavdërimi. I bekuar është emri yt dhe i lartësuar është madhështia jote. Nuk ka zot tjetër përveç Teje.",
      },
      {
        title: "4. Tavvudh & Besmelah",
        body: "Kërkoni strehim tek Allahu nga shejtani, pastaj filloni me Besmelah, para Fatihasë. Të dyja thuhen në heshtje, edhe në lutjet me zë të lartë.",
        translation:
          "Kërkoj mbrojtje tek Allahu nga shejtani, i mallkuari. Me emrin e Allahut, Gjithëmëshirshmit, Mëshirëbërësit të Veçantë.",
      },
      {
        title: "5. Lexo El-Fatiha",
        body: "Lexo hapjen e librit në çdo rekat - 'Nuk ka lutje për atë që nuk e lexon Hapjen e Librit.' Imami dhe adhuruesi i vetëm e lexojnë atë me zë të lartë në lutjet me zë të lartë; përndryshe recitohet në heshtje.",
        translation:
          "Me emrin e Allahut, Gjithëmëshirshmit, Mëshirëbërësit të Veçantë. Falënderimet i takojnë Allahut, Zotit të botëve - Mëshirëplotit, Mëshirëplotit, Sunduesit të Ditës së Shpërblimit. Ty të adhurojmë dhe Ty të kërkojmë ndihmë. Na udhëzo në rrugën e drejtë - në rrugën e atyre që u ke dhënë mirësi, jo të atyre që kanë fituar zemërim apo të atyre që janë të humbur.",
        tip: "Thuaj 'Amin' pas tij (me zë të lartë në lutjet me zë të lartë). Klasa hanefi duke recituar një pjesë të Kur'anit si shtyllë dhe El-Fatiha në veçanti si vaxhib; shumica mendojnë se vetë El-Fatiha është shtylla në çdo rekat.",
      },
      {
        title: "6. Lexoni një sure ose disa ajete",
        body: "Vetëm në dy rekatet e para, ndiqni El-Fatihanë me një sure të shkurtër ose disa vargje - për shembull suren El-Ikhlas ('Kul huwa Allahu ehad...'). Në rekatin e tretë dhe të katërt lexohet vetëm Fatiha.",
        tip: "Rekomandohet për adhuruesin e vetmuar dhe imamin; një ndjekës dëgjon. Hanefitë mendojnë se shtimi i një sureje në dy rekatet e para është vaxhib.",
      },
      {
        title: "7. Përkulje (ruku)",
        body: "Thuaj 'Allahu Ekber' dhe përkuluni me shpinë të sheshtë, të sheshtë, me duar të shtrënguara gjunjët dhe madhëroni Zotin tuaj tri herë e më shumë, pa nxitim.",
        translation: "Lavdia i takon Zotit tim të Madhërishëm.",
        tip: "Vetë harku, i mbajtur me qetësi, është shtylla; tesbihu i lexuar në të është sunet (vaxhib në disa shkolla).",
      },
      {
        title: "8. Ngritja nga ruku (i'tidal)",
        body: "Ngrihuni plotësisht në këmbë - imami dhe adhuruesi i vetëm duke thënë tasmi', dhe të gjithë duke thënë tahmid - dhe qëndroni plotësisht në vend përpara se të zbrisni.",
        translation:
          "Allahu e dëgjon atë që e lavdëron Atë. Zoti ynë, Ty të takon të gjitha falënderimet.",
        tip: "Qëndrimi drejt dhe i qetë është një shtyllë - mos u zhyt në suxhud derisa të vendosesh këtu.",
      },
      {
        title: "9. Sexhde (suxhud)",
        body: "Thuaj 'Allahu Ekber' dhe bëj sexhde mbi shtatë kocka - ballin së bashku me hundën, të dy pëllëmbët, të dy gjunjët dhe gishtat e të dy këmbëve - duke e madhëruar Më të Lartin tri herë ose më shumë. Kjo është qëndrimi më i afërt me Allahun, prandaj derdhni lutjen pas tesbihut.",
        translation: "Lavdia i takon Zotit tim, Më të Lartit.",
        tip: "Mbani parakrahët të ngritur nga toka dhe larg nga anët, dhe barkun nga kofshët.",
      },
      {
        title: "10. Ulja ndërmjet dy sexhdeve (xhelsa)",
        body: "Ngrihu nga suxhudi i parë duke thënë 'Allahu Ekber', ulu i qetë dhe i drejtë dhe kërko falje Zotit tënd para se të bësh përsëri sexhde.",
        translation: "Zoti im, më fal.",
        tip: "Uluni derisa të jeni të qetë - kjo ulje e shkurtër, me qetësi, është një shtyllë më vete.",
      },
      {
        title: "11. Sexhdeja e dytë",
        body: "Thuaj 'Allahu Ekber' dhe bëj sexhde për herë të dytë ashtu si e para, me të njëjtin tesbih dhe të njëjtën qetësi. Kjo plotëson një rekat të plotë.",
        translation: "Lavdia i takon Zotit tim, Më të Lartit.",
      },
      {
        title: "12. Qëndroni për rekatin tjetër",
        body: "Thuaj 'Allahu Ekber' dhe ngrihu në këmbë, pastaj përsërite nga El-Fatiha. Në rekatin e tretë dhe të katërt lexoni vetëm El-Fatiha, pa një sure të shtuar.",
        tip: "Në një namaz me dy rekate nuk qëndroni më pas rekatit të dytë - qëndroni ulur për teshehudin e fundit.",
      },
      {
        title: "13. Teshehudi i parë (në namazet 3 dhe 4 rekate)",
        body: "Pas rekatit të dytë të Akshamit, Dhuhrit, Asr ose Jacisë, uluni dhe lexoni Et-Tahijet, pastaj qëndroni për rekatin e mbetur. Namazi me dy rekate nuk ka teshehud të parë.",
        translation:
          "Të gjitha përshëndetjet, lutjet dhe fjalët e pastra janë për Allahun. Paqja qoftë mbi ty o Pejgamber, mëshira e Allahut dhe bekimet e Tij. Paqja qoftë mbi ne dhe mbi robërit e drejtë të Allahut. Dëshmoj se nuk ka zot tjetër përveç Allahut dhe dëshmoj se Muhamedi është rob dhe i Dërguar i Tij.",
        tip: "Ngrini gishtin tregues të djathtë në ulje. Nëse e harron teshehudin e parë dhe ke filluar të qëndrosh në këmbë, vazhdo dhe bëje suxhud es-sehv para selamit - mos u ul.",
      },
      {
        title: "14. Teshehudi i fundit",
        body: "Në uljen e fundit të çdo namazi, lexoni të njëjtin Et-Tahijet të treguar më sipër. Ulja për teshehudin e fundit dhe leximi i tij është një shtyllë e namazit.",
      },
      {
        title: "15. Dërgo salavate mbi Pejgamberin ﷺ (Salavatin)",
        body: "Pas Et-Tahijetit të fundit, dërgoni salavate mbi Profetin ﷺ me fjalët që ai vetë ua mësoi shokëve të tij.",
        translation:
          "O Allah, dërgoje salavate mbi Muhammedin dhe familjen e Muhammedit, ashtu siç e bekove Ibrahimin dhe familjen e Ibrahimit; me të vërtetë Ti je i Lavdëruar, i Lavdishëm. O Allah, jepi mirësi Muhammedit dhe familjes së Muhammedit, ashtu siç e ke favorizuar Ibrahimin dhe familjen e Ibrahimit; me të vërtetë Ti je i Lavdëruar, i Lavdishëm.",
        tip: "Shkolla Shafi'ite dhe Hanbelite e konsiderojnë salavatin në seancën e fundit të detyrueshme.",
      },
      {
        title: "16. Lutuni para selamit",
        body: "Para se të mbaroni, kërkoni strehim tek Allahu nga katër sprova - pastaj bëni çdo dua që dëshironi, për këtë dhe për jetën tjetër, në arabisht ose në gjuhën tuaj.",
        translation:
          "O Allah, kërkoj mbrojtje te Ti nga dënimi i varrit, nga dënimi i xhehenemit, nga sprova e jetës dhe vdekjes dhe nga e keqja e sprovës së Mesihut të rremë (Dexhallit).",
      },
      {
        title: "17. Selam mbyllës (Taslim)",
        body: "Përfundojeni namazin duke e kthyer fytyrën në të djathtë, pastaj në të majtë, duke dhënë çdo herë përshëndetjen e paqes. Me selam namazi përfundon.",
        translation: "Paqja dhe mëshira e Allahut qofshin mbi ju.",
        tip: "Taslim i parë (në të djathtë) është shtylla; e dyta (në të majtë) është një sunet në disa shkolla.",
      },
    ],
    hadith: [
      {
        excerpt: "Lutu siç më ke parë mua duke u falur. (Malik ibn el-Huvejrith)",
      },
      {
        excerpt:
          '"Kthehu dhe falu, sepse nuk je falur" - përsëriti tri herë - pastaj ai mësoi: thuaj tekbir, lexoje atë që mundesh nga Kur\'ani, pastaj përkulesh derisa të qetësohesh, ngrihu derisa të qëndrosh drejt, bëj sexhde derisa të qetësohesh... (burri që fali keq; gjithashtu Sahih Mysliman 397).',
      },
      {
        excerpt:
          "Nuk ka lutje për atë që nuk e lexon Hapjen e Librit. (Ubadah ibn es-Samit; gjithashtu Sahih Mysliman 394)",
      },
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Çdo pozicion",
    summary: "Si ta mbani trupin në mënyrë korrekte në çdo qëndrim të namazit.",
    body: [
      "Çdo qëndrim në namaz ka një formë trupore që Profeti ﷺ e ka treguar dhe sahabët e tij e kanë ruajtur. Mësimi i formës së saktë e mbron lutjen tuaj nga gabimet e zakonshme fizike dhe e ndihmon trupin të mbështesë përulësinë e zemrës në vend që të shpërqendrohet prej saj.",
      'Afërsia e sexhdes meriton kujdes të veçantë: Pejgamberi salAllahu alejhi ue selem ka thënë: "Robi më i afërt i vjen Zotit të tij është kur është në sexhde, prandaj bëni shumë lutje". Një sexhde e mbajtur me qetësi dhe sinqeritet është ndër momentet më të fuqishme në ditën e një besimtari.',
    ],
    steps: [
      {
        title: "Në këmbë (kijam)",
        body: "Drejt, këmbët afërsisht sa gjerësia e shpatullave, pesha e balancuar, vështrimi në vendin e sujudit, dora e djathtë mbi të majtën në gjoks.",
      },
      {
        title: "Ngritja e duarve (raf' al-jadayn)",
        body: "Pëllëmbët e kthyera nga kibleja, në nivel me shpatullat ose llapët e veshit - në tekbirin e hapjes, dhe (nga shumica) gjithashtu duke hyrë dhe duke u ngritur nga rukuja.",
      },
      {
        title: "Përkulje (ruku)",
        body: "Shpina e sheshtë dhe e sheshtë, koka as e ngritur dhe as e varur, gishtat e shtrirë duke kapur gjunjët, krahët e mbajtur larg nga anët.",
      },
      {
        title: "sexhde (suxhud)",
        body: "Balli dhe hunda në tokë, pëllëmbët e sheshta pranë shpatullave ose veshëve, bërrylat e ngritura dhe jashtë dyshemesë, gjunjët poshtë, gishtat e këmbëve të përkulura drejt kibles.",
      },
      {
        title: "ulur (iftirash)",
        body: "Ndërmjet dy sexhdeve dhe në teshehudin e parë: uluni në këmbën e majtë të shtrirë me këmbën e djathtë drejt, duart të mbështetura në kofshë.",
      },
      {
        title: "Ulja e fundit (tawarruk)",
        body: "Në teshehudin e fundit të një namazi prej 3 ose 4 rekatesh (një sunet i shkollave Shafi'ite dhe Hanbelite): kaloni këmbën e majtë nën këmbën e djathtë dhe uluni në tokë.",
      },
      {
        title: "Kthimi i kokës për selam (taslim)",
        body: "Kthejeni fytyrën plotësisht në të djathtë, pastaj në të majtë, me fjalët e paqes - duke përfunduar lutjen ndërsa përshëndetni engjëjt në secilën shpatull.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Robi më i afërt i vjen Zotit të tij është kur është në sexhde, andaj bëni shumë lutje. (Ebu Hurejre)",
      },
    ],
    disclaimer:
      "Ndryshimet e vogla në vendosjen e duarve, mënyrën e uljes dhe ngritjen e duarve janë të gjitha të rrënjosura në raporte autentike; shkollat ​​secila ndjekin një transmetim të vlefshëm. Askush nuk e prish namazin e tjetrit.",
  },
  {
    title: "Gabimet e zakonshme",
    summary: "Gabimet që dobësojnë në heshtje një lutje - dhe si të korrigjoni secilën prej tyre.",
    body: [
      "Shumica e gabimeve në lutje nuk janë mëkate të zemrës, por zakone të nxitimit dhe të pavëmendjes. Emërtimi i tyre është hapi i parë për rregullimin e tyre; Vetë Profeti ﷺ e korrigjoi lutjen e një sahabi me durim dhe drejtpërdrejt, gjë që na mëson se këto gabime janë të zakonshme dhe të rregullueshme.",
      "Më i madhi po nxiton - duke rrahur nëpër ruku dhe suxhud pa qetësi. Tuma'ninah (qendrimi i qetë) është një shtyllë e namazit për shumicën e dijetarëve, kështu që një lutje e nxituar nuk është thjesht e papërsosur, por mund të jetë e pavlefshme. Punoni me listën e mëposhtme një zakon në një kohë.",
    ],
    steps: [
      {
        title: "Duke u falur shumë shpejt",
        body: "Mezi ndalon në ruku apo sujud. Qëndroni derisa trupi juaj të qetësohet dhe mund ta thoni dhikrin të paktën tre herë pa nxitim.",
      },
      {
        title: "Abdesi jo i plotë",
        body: 'Njolla të thata në thembra, kyçe, bërryla ose midis gishtërinjve. Pejgamberi ﷺ paralajmëroi: "Mjerë për thembrat e zjarrit". Lani ngadalë dhe tërësisht.',
      },
      {
        title: "Shpina e lakuar në ruku, e fundosur në suxhud",
        body: "Përkuluni me shpinë të rrumbullakosur, ose mbështetni ballin pa hundë, ose lini parakrahët të shtrihen në dysheme. Mbani shpinën në nivel dhe bërrylat të ngritura.",
      },
      {
        title: "Sytë dhe zemra endacakë",
        body: "Duke parë përreth ose duke kontrolluar një telefon. Mbaje shikimin në vendin e suxhudit dhe heshtjes ose hiqe telefonin para tekbirit.",
      },
      {
        title: "Gara përpara imamit",
        body: "Me xhemat, kalimi në ruku ose suxhud para imamit. Ndiqeni atë - kurrë mos e paraprini - lëvizni vetëm pasi ta bëjë.",
      },
      {
        title: "Duke folur, ngrënë ose duke qeshur",
        body: "Çdo fjalim i qëllimshëm, ngrënia, pirja ose e qeshura e dëgjueshme e prish namazin. Namazi është një bisedë vetëm me Allahun.",
      },
      {
        title: "Leximi i gabuar i El-Fatihas",
        body: "Duke anashkaluar fjalët, ose duke bërë gabime që ndryshojnë kuptimin. Mësojeni atë në mënyrë të përsosur - e gjithë lutja varet nga ajo.",
      },
    ],
    actions: [
      "Falni një namaz sot me gjysmën e shpejtësisë suaj të zakonshme dhe vini re se sa ndryshe ndihet.",
      "Heshtni telefonin ose lëreni në një dhomë tjetër para se të thoni tekbirin e hapjes.",
      "Kërkojini dikujt që ka njohuri të shikojë një nga lutjet tuaja dhe të korrigjojë qëndrimet tuaja.",
    ],
    appLinks: [{}],
  },
  {
    title: "Praktikat e Sunetit",
    summary:
      "Pejgamberi ﷺ ka rekomanduar veprime që zbukurojnë dhe shumëfishojnë shpërblimin e namazit.",
    body: [
      "Përtej veprave të detyrueshme, Profeti ﷺ modeloi shumë praktika të rekomanduara (sunenet) rreth namazit. Ato nuk kërkohen, kështu që lënia e njërit nuk e prish namazin – por secili të afron më shumë me Allahun, fiton shpërblim shtesë dhe ndreq mangësitë në namazet e detyrueshme.",
      "Kryesorja prej tyre janë namazet e rregullta sunet (sunet ravatib) të falura para dhe pas farzit: dy para sabahut (të cilin Profeti ﷺ e vlerësoi mbi të gjithë botën), katër para dhe dy pas Dhuhrit, dy pas akshamit dhe dy pas jacisë - dymbëdhjetë rekate shpërblimi i të cilëve është një shtëpi e ndërtuar në Xhenet.",
    ],
    actions: [
      "Përdorni misvakun (sivakun) para abdesit dhe namazit – Profeti a.s gati e bëri atë obligim.",
      "Ecni në xhami me qetësi dhe herët - çdo hap ngre një gradë dhe fshin një mëkat.",
      "Ruaji dymbëdhjetë rekatet e sunetit ravatib për një shtëpi të premtuar në Xhenet.",
      "Hyni në xhami me këmbën e djathtë dhe dilni me të majtën, secila me duatë e saj.",
      "Lexoni adkarin e vendosur pas çdo namazi - shih Pas namazit.",
    ],
    hadith: [
      {
        excerpt:
          "Po të mos e ngarkoja umetin tim, do t'i kisha urdhëruar që të përdorin sivakun para çdo namazi. (Ebu Hurejre; gjithashtu Sahih Mysliman 252)",
      },
      {
        excerpt:
          "Kush fal dymbëdhjetë rekate namaz vullnetar në ditë e natë, atij i ndërtohet një shtëpi në Xhenet. (Umm Habibah)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kushu - prania e zemrës",
    summary: "Qëllimi i gjithë udhëtimit: të lutesh sikur e sheh Allahun.",
    body: [
      "Kushhu është përulësia, përqendrimi dhe vetëdija se ju jeni vërtet duke qëndruar para Allahut. Është ajo që i kthen lëvizjet fizike të lutjes në adhurim të vërtetë. Profeti ﷺ e përkufizoi përsosmërinë (ihsanin) si 'ta adhurosh Allahun sikur e sheh Atë, sepse edhe pse nuk e sheh Atë, Ai me siguri të sheh ty' - dhe askund nuk praktikohet më drejtpërdrejt se sa në namaz.",
      "Allahu e hapi përshkrimin e besimtarëve të suksesshëm me të: 'ata që janë të përulur në namazin e tyre' (23:1-2). Dhe Ai paralajmëroi ashpër kundër të kundërtën e saj - 'mjerë ata që falen, por janë të pavëmendshëm ndaj lutjes së tyre' - një qortim që synon ata që trupi i tyre lëviz ndërsa zemrat e tyre mungojnë.",
      "Kushhu është ndërtuar, nuk dëshirohet. Mësoni kuptimet e asaj që recitoni në mënyrë që fjalët t'ju prekin. Largoni shpërqendrimet para tekbirit. Ngadalësoni dhe jepini çdo qëndrimi qetësinë e tij. Reflektoni mbi madhështinë e Atij të cilit i drejtoheni dhe realitetin se kjo lutje mund të jetë e fundit. Faleni çdo namaz si lutje lamtumire, ashtu siç e ka këshilluar Profeti ﷺ.",
      "Mos u dekurajoni nga mendimet bredhëse – edhe sahabët luftuan me to. Lufta për të kthyer fokusin tuaj, përsëri dhe përsëri, është vetë pjesë e adhurimit. Kushhu rritet gjatë gjithë jetës; qëndrueshmëria është ajo që e ushqen atë.",
    ],
    quran: [
      {
        excerpt:
          "Me të vërtetë të suksesshëm janë besimtarët - ata që janë të përulur në lutjen e tyre.",
      },
      {
        excerpt: "Pra, mjerë ata që falen - ata që janë të pavëmendshëm ndaj lutjes së tyre.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ihsani është ta adhurosh Allahun sikur e sheh Atë, sepse edhe pse nuk e sheh, Ai me siguri të sheh ty. (Hadithi i Xhibrilit, Omerit)",
      },
    ],
    actions: [
      "Lexoni kuptimin e një fraze nga Fjalët e Namazi përpara çdo lutjeje këtë javë.",
      "Ndaloni për tre sekonda pa nxitim në çdo qëndrim përpara se të vazhdoni.",
      "Vini re nivelin tuaj të përqendrimit në ditar pas namazit dhe shikoni ndryshimin e modelit.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shtyllat & anuluesit",
    summary: "Pa atë që lutja nuk mund të ekzistojë - dhe çfarë e anulon atë.",
    body: [
      "Veprat e namazit ndahen në tre gradë. Shtyllat (arkan) janë pjesë thelbësore: lënia me dashje e prish namazin, dhe lënia me harresë duhet të korrigjohet duke u kthyer në të. Veprat e detyrueshme (vaxhibet) janë të nevojshme, por nëse harrohen ato riparohen me sexhden e harresës (suxhud al-sahw). Veprat e Sunetit e plotësojnë dhe e zbukurojnë namazin dhe lënia e tyre nuk sjell asnjë dënim.",
      "Njohja e kësaj hierarkie ju mbron nga dy ekstreme: trajtimi i një lëshimi të vogël si shkatërrues, ose trajtimi i një shtylle të vërtetë si opsionale. Kur dyshoni për një shtyllë, namazi nuk është i shëndoshë derisa të plotësohet.",
      "Veçmas, disa gjëra e anulojnë lutjen drejtpërdrejt në momentin që ndodhin - sepse ato kundërshtojnë vetë gjendjen e lutjes. Të tjerët e anulojnë abdesin, i cili nga ana e tij përfundon namazin. Ruhuni nga të dyja në mënyrë që të mos falni kurrë në një gjendje të pavlefshme pa e kuptuar atë.",
    ],
    steps: [
      {
        title: "Shtyllat (arkan)",
        body: "Qëndrimi në këmbë kur mundet, tekbiri i hapjes, leximi i Fatihasë, rukuja, ngritja prej tij, dy sexhdet, ulja ndërmjet tyre, ulja e fundit, teshehudi, selami, tumenina në secilin dhe mbajtja e rendit të saktë.",
      },
      {
        title: "Aktet e detyrueshme (vaxhibat)",
        body: "Të tilla si tekbiret e tjera, fjalët e dhikrit në ruku dhe suxhud, dhe teshehudi i parë - i riparuar nga suxhud al-sahv nëse harrohet (sipas detajeve hanbelite; shkollat ​​ndryshojnë).",
      },
      {
        title: "Anuluesit e abdesit",
        body: "Çdo gjë që del nga pasazhet e përparme ose të pasme, gjumë i thellë, humbje e vetëdijes - dhe, nga disa studiues, prek drejtpërdrejt pjesët intime. Secila nga këto e përfundon namazin.",
      },
      {
        title: "Anuluesit e vetë namazit",
        body: "Të folurit e qëllimshëm, ngrënia ose pirja e qëllimshme, shumë lëvizje të vazhdueshme të panevojshme, të qeshura me zë të lartë, kthimi i qëllimshëm i gjoksit nga kibleja dhe zbulimi i avretit.",
      },
    ],
    appLinks: [{}],
    disclaimer:
      "Të katër shkollat ​​i klasifikojnë disa vepra në mënyra të ndryshme - për shembull nëse teshehudi i parë është vaxhib apo sunet, ose lista e saktë e asaj që kërkon suxhud al-sahw. Mësoni detajet e shkollës suaj nga një mësues i kualifikuar.",
  },
  {
    title: "Sujud al-Sahw - korrigjimi i gabimeve",
    summary: "Sexhdeja e harresës që shëron rrëshqet në namaz.",
    body: [
      "Askush nuk është imun ndaj harresës në namaz – madje edhe Profeti ﷺ harroi dhe më pas mësoi: “Unë jam vetëm një qenie njerëzore si ju; Unë harroj ashtu siç harron ti, ndaj kur të harroj më kujto'. Nga shembulli i tij vjen një ilaç i integruar: dy sexhde shtesë, të quajtura sujud al-sahw (sexhdeja e harresës), të cilat zgjidhin gabime të vogla, kështu që namazi nuk ka nevojë të përsëritet.",
      "Kërkohet në tri situata të gjera: një shtesë (falja e një rekati shtesë ose qëndrimi gabimisht), një lëshim (lënia e një vaxhibi siç është teshehudi i parë) ose dyshimi (të mos jesh i sigurt se sa rekate ke falur). Nuk është e nevojshme për lënien e sunetit, as për gabime të qëllimshme – ato kanë vendimet e tyre.",
      "Kur ke dyshim të vërtetë, parimi udhëzues është: hidhe poshtë dyshimin, ndërto mbi atë që je i sigurt (numrin më të vogël), plotëso namazin dhe pastaj bëj dy sexhde. Kjo e kthen konfuzionin në një lutje të vendosur dhe të vlefshme dhe jo në një hamendje të shqetësuar.",
      "Praktikisht: bëni dy sexhde tamam si suxhudi juaj normal, me tekbir para dhe pas, pastaj selam. Dijetarët ndryshojnë nëse ato vijnë para apo pas selamit në varësi të llojit të gabimit – të dyja raportohen në mënyrë autentike, kështu që njëra është e pranueshme dhe asnjëra nuk e prish namazin.",
    ],
    hadith: [
      {
        excerpt:
          "Nëse njëri prej jush nuk është i sigurt në namazin e tij dhe nuk e di se sa namaze ka falur - tre apo katër - le ta largojë dyshimin, të ndërtojë në atë që është i sigurt, pastaj të bëjë sexhde dy herë para selamit. (Ebu Seid el-Khudri)",
      },
      {
        excerpt:
          "Kur dikush nga ju dyshon në namazin e tij, le të kërkojë atë që është e saktë dhe e plotë në të, pastaj të japë selam dhe të bëjë sexhde dy herë. (Ibn Mes'udi; gjithashtu Sahih Mysliman 572)",
      },
    ],
    actions: [
      "Mësoni përmendësh rregullin për dyshimin: ndërtoni numrin më të vogël, përfundoni, pastaj bëni sexhde dy herë.",
      "Nëse e kuptoni se në mes të namazit e keni lënë teshehudin e parë, vazhdoni dhe bëni suxhud el-sahv në fund.",
    ],
    appLinks: [{}],
    disclaimer:
      "Nëse dy sexhdet bien para ose pas selamit varet nga gabimi, dhe shkollat ​​ndryshojnë. Të dyja janë nga suneti; mos lejoni që pasiguria këtu t'ju ndalojë nga lutja.",
  },
  {
    title: "Llojet e namazit",
    summary: "Farzi, suneti, vitri dhe namazet vullnetare që e pasurojnë ditën e besimtarit.",
    body: [
      "Namazet vlerësohen sipas detyrimit. Pesë namazet ditore janë farz - një detyrim i rreptë për çdo musliman të përgjegjshëm. Përreth dhe përtej tyre shtrihet një botë e pasur lutjesh vullnetare përmes së cilës Profeti ﷺ iu afrua gjithnjë e më shumë Allahut dhe përmes së cilës mundemi edhe ne.",
      'Namazet vullnetare kanë rëndësi për dy arsye: ato janë vepra të dashura që e ngrenë gradën e besimtarit - Allahu thotë për adhurimin shtesë: "Robi Im vazhdon të më afrohet me vepra vullnetare derisa ta dua" - dhe ato ndreqin faljet e detyrueshme, pasi çdo mangësi në farz plotësohet nga falja vullnetare e njeriut në ditën e xhumasë.',
    ],
    steps: [
      {
        title: "Farzet pesë ditore",
        body: "Sabah, Dhuhr, Asr, Akshami, Isha - themeli i detyrueshëm, që nuk duhet braktisur kurrë.",
      },
      {
        title: "Sunet ravatib",
        body: "Rekatet e rregullta sunet para dhe pas farzit - dymbëdhjetë ditë fitojnë një shtëpi në Xhenet.",
      },
      {
        title: "Vitr",
        body: "Një namaz me numër tek pas jacisë, vula e namazit të natës - sunet muekkade për shumicën dhe vaxhib në shkollën hanefi.",
      },
      {
        title: "Tahaxhud (kijam el-lejl)",
        body: "Namazi i natës në të tretën e fundit të natës - lutja vullnetare më e virtytshme dhe zakoni i të drejtëve.",
      },
      {
        title: "Duha",
        body: "Namazi i mesditës (2–8 rekate) - një sadaka që duhet për çdo nyje të trupit çdo ditë.",
      },
      {
        title: "Taravih",
        body: "Namazi i natës me xhemat të Ramazanit - ringjallja e netëve të muajit të bekuar.",
      },
      {
        title: "Dy Bajramet",
        body: "Dy rekate të Fitër Bajramit dhe Kurban Bajramit, pasuar nga hytbeja.",
      },
      {
        title: "Istiharah",
        body: "Një namaz me dy rekate që kërkon udhëzimin e Allahut përpara se të marrë një vendim.",
      },
      {
        title: "Janazah",
        body: "Namazi i xhenazes - obligim i përbashkët (farz kifaje) i falur në këmbë, pa ruku apo suxhud.",
      },
    ],
    hadith: [
      {
        excerpt: "Namazi më i mirë pas namazit farz është namazi i natës. (Ebu Hurejre)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Xhuma - namazi i xhumasë",
    summary: "Obligimi javor që mbledh bashkësinë dhe zëvendëson Dhhrin të premten.",
    body: [
      'Xhuma është namazi me xhemat që mbahet çdo xhuma pas mesditës dhe është obligim i veçantë, i urdhëruar me emër në Kur\'an: "Kur të bëhet ezani për namaz ditën e xhuma, nxitoni për të përmendur Allahun dhe lini tregtinë". Ai përbëhet nga një hutbe (hutbe) në dy pjesë, e ndjekur nga dy rekate të falura me zë të lartë pas imamit, dhe zë vendin e Dhuhrit për ata që marrin pjesë.',
      'Është obligim personal (farz ajn) ndaj çdo muslimani të lirë, të rritur, banues, të aftë. Pejgamberi ﷺ saktësoi se është "detyrë për çdo musliman në xhemat, përveç katër: skllavit, gruas, fëmijës ose atij që është i sëmurë". Gratë, udhëtarët dhe të sëmurët justifikohen dhe në vend të kësaj falin namazin e Duhrit, megjithëse mund të marrin pjesë nëse dëshirojnë.',
      "Neglizhimi i saj është një rrezik i madh: Profeti (a.s) paralajmëroi se kushdo që i braktis tri xhuma nga pakujdesia, Allahu ia vulos zemrën. Megjithatë, shpërblimet e saj janë po aq të mëdha - dita e xhuma është dita më e mirë në të cilën lind dielli dhe mban një orë në të cilën duatë përgjigjet.",
      "Përgatituni për të siç bëri Pejgamberi ﷺ: bëni gusl, vishni rrobat tuaja më të mira të pastra, aplikoni aromë, shkoni herët dhe dëgjoni me vëmendje hutben në heshtje (të folurit kot gjatë saj e humb shpërblimin). Leximi i sures el-Kehf të premten sjell një dritë midis dy xhumave.",
    ],
    quran: [
      {
        excerpt:
          "O ju që besuat, kur të bëhet ezani i xhumasë, nxitoni për të përmendur Allahun dhe lini tregtinë. Kjo është më mirë për ju, sikur ta dini.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Namazi i xhumasë me xhemat është detyrë e detyrueshme për çdo musliman, përveç katër: robit, gruas, fëmijës ose të sëmurit. (Tarik ibn Shihab)",
      },
      {
        excerpt:
          "Kushdo që i lë tre namazet e xhumasë nga pakujdesia, Allahu ia vë vulën zemrës. (Ebu el-Ja'd; gjithashtu Ebu Davudi 1052, et-Tirmidhi 500)",
      },
      {
        excerpt:
          "Gusli i xhumasë është i detyrueshëm për çdo person që ka arritur moshën e pjekurisë. (Ebu Seid el-Khudri)",
      },
    ],
    actions: [
      "Bëni gusl, vishni rroba të pastra dhe aromë dhe mbërrini herët – pjesëmarrësit më të hershëm fitojnë shpërblimin më të madh.",
      "Lexojeni suren el-Kehf diku të premten për një dritë midis dy xhumave.",
      "Qëndroni plotësisht të heshtur dhe të vëmendshëm gjatë hutbes; mbaje telefonin larg.",
    ],
    appLinks: [{}],
    disclaimer:
      "Numri minimal i pjesëmarrësve, dhe nëse gusli është i detyrueshëm apo sunet i fortë, janë pika të dallimit dijetar. Ndiqni praktikën e besueshme të komunitetit tuaj lokal.",
  },
  {
    title: "Namazi me xhemat",
    summary: "Falja e namazit pas imamit - shpërblimi shumëfishohet njëzet e shtatë herë.",
    body: [
      "Falja e pesë namazeve ditore me xhemat (xhema'ah) theksohet fuqishëm, veçanërisht për burrat dhe është një shenjë dalluese e një komuniteti të gjallë mysliman. Profeti ﷺ mësoi se namazi me xhemat është njëzet e shtatë herë më i madh në shpërblim se namazi i falur vetëm - një shumëfishues që asnjë përpjekje individuale nuk mund të krahasohet.",
      "Xhemati qëndron në rreshta të drejtë, pa boshllëqe, sup më sup, duke e ndjekur me saktësi imamin: çdo lëvizje e filloni vetëm pasi ta bëjë ai, kurrë para tij dhe kurrë në të njëjtin moment. Drejtimi i rreshtave është në vetvete pjesë e përfundimit të namazit.",
      "Nëse arrini pasi imami ka filluar (një i vonuar quhet masbuk), bashkohuni menjëherë në çfarëdo qëndrimi që e gjeni - ajo pjesë ende llogaritet si falje me të. Kur të japë selamin e fundit, qëndroni dhe plotësoni vetë rekatet që keni humbur, pastaj përfundoni.",
      "Xhemati nuk është vetëm në xhami: dy njerëz që falen së bashku formojnë një xhemat, kështu që një baba me fëmijën e tij, ose dy shokë që udhëtojnë, mund të arrijnë shpërblimin e saj. Gratë mund të falen me xhemat dhe të frekuentojnë xhaminë ku ekzistojnë lehtësira të përshtatshme, megjithëse lutja e tyre në shtëpi gjithashtu shpërblehet shumë.",
    ],
    hadith: [
      {
        excerpt:
          "Namazi me xhemat është njëzet e shtatë gradë më meritor se namazi i vetëm. (Ibn Umeri; gjithashtu Sahih Mysliman 650)",
      },
    ],
    quran: [
      {
        excerpt: "Dhe falni namazin dhe jepni zekatin dhe përkuluni me ata që përkulen.",
      },
    ],
    actions: [
      "Falni të paktën një namaz në xhami sot, ose mblidhni familjen tuaj në një rresht në shtëpi.",
      "Mësoni se çfarë të bëni kur vjen vonë: bashkohuni menjëherë, pastaj plotësoni rekatet e humbura pas selamit të imamit.",
    ],
  },
  {
    title: "Namazet e humbura (kada).",
    summary: "Shpërblimi i asaj që ka munguar - dera e mëshirës së Allahut qëndron e hapur.",
    body: [
      'Nëse falet një namaz farz – nga gjumi i tepërt, harresa ose (Allahu na ruajtë) nga neglizhenca – obligimi nuk zhduket thjesht. Duhet të falet (kada), dhe Profeti (sal-lAllahu alejhi ue sel-lem) e ka bërë të qartë vendimin: "Kushdo që harron një namaz ose fle në të, shlyerja e tij është ta falë atë kur të kujtohet". Nuk ka shpërblim tjetër për të, përveçse ta lutesh.',
      "Një namaz i bërë falet në të njëjtën formë si origjinali: një muaj i munguar me katër rekate falet katër rekate edhe nëse e falni natën ose gjatë udhëtimit. Ai që e humbi namazin për shkak të një arsyetimi të vërtetë (si gjumi i thellë) nuk mban asnjë mëkat për vonesën; ai që i braktisi ato me dashje duhet t'i korrigjojë së bashku me pendimin e sinqertë e urgjent.",
      "Dijetarët inkurajojnë që lutjet e humbura të plotësohen menjëherë dhe në rregull aty ku është e mundur, pa i lënë ato të grumbullohen - sepse barra rëndohet me kalimin e kohës dhe vonesës. Nëse një numër i madh mungonte me kalimin e viteve, qasuni me një plan ditor realist dhe jo me dëshpërim; Dera e kthimit të Allahut është gjithmonë e hapur.",
    ],
    hadith: [
      {
        excerpt:
          "Kushdo që harron një namaz ose fle në të, shlyerja e tij është ta falë kur ta kujtojë. (Enes; gjithashtu Sahih Mysliman 684)",
      },
    ],
    actions: [
      "Llogaritni me ndershmëri sa lutje keni borxh dhe vendosni një objektiv realist të përbërjes ditor.",
      "Bashkojeni çdo namaz të detyrueshëm me një namaz të grimcuar derisa të fshihet pjesa e mbetur.",
      "Asnjëherë mos e vononi një lutje të caktuar për të kompensuar një të vjetër - mbajini lutjet e sotme në kohë.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Pas namazit",
    summary: "Adkari dhe lutjet që vulosin shpërblimin e çdo namazi.",
    body: [
      "Profeti as nuk ngrihej befas nga namazi. Ai qëndronte ulur, duke kërkuar faljen e Allahut dhe duke u përkujtuar - dhe mësoi se momenti menjëherë pas një lutjeje obligative është ndër kohët kur lutja merr përgjigjen më të lehtë. Largimi menjëherë humbet disa nga frytet më të mëdha të lutjes.",
      "Rutina e vendosur pas namazit është e thjeshtë dhe me peshë: thuaj 'Astaghfirullah' tri herë; pastaj fjalët e teuhidit dhe lavdërimit; pastaj 'SubhanAllah', 'Elhamdulillah' dhe 'Allahu Ekber' nga tridhjetë e tre herë, duke e vulosur të qindtën me 'La ilahe illallah...' - kujtdo që vepron kështu i falen mëkatet edhe pse janë si shkuma e detit.",
      "Leximi i Ajet Kursi pas çdo namazi të detyrueshëm largon vetëm vdekjen ndërmjet njeriut dhe Xhenetit, siç ka premtuar Profeti a.s. Ndiqeni atë me tre Kuls (El-Ikhlas, El-Felek, En-Nas) dhe shtoni edhkerin e mëngjesit pas sabahut dhe edhkerin e mbrëmjes pas ikindisë ose akshamit ku ato zbatohen.",
    ],
    hadith: [
      {
        excerpt:
          "Kushdo që e madhëron, lavdëron dhe madhëron Allahun tridhjetë e tre herë secila pas çdo namazi… dhe e plotëson të qindtën me fjalët e teuhidit, atij i falen mëkatet edhe pse të jenë si shkuma e detit. (Ebu Hurejre)",
      },
      {
        excerpt:
          "Kushdo që e lexon ajetin Kursi pas çdo namazi të caktuar, ndërmjet tij dhe hyrjes në Xhenet nuk qëndron asgjë përveç vdekjes. (Ebu Umameh; i vlerësuar sahih nga Albani)",
      },
    ],
    actions: [
      "Mësoni përmendësh tesbihun pas namazit (33 / 33 / 33 + tahlil) këtë javë.",
      "Recitoni Ajet el-Kursi dhe tre Kuls para se të ngriheni.",
      "Qëndroni ulur për një minutë dua personale pas çdo namazi farz.",
    ],
    appLinks: [{}, {}],
  },
];

export const SALAH_GUIDE_PHRASES_SQ: DeepPartial<SalahGuidePhrase>[] = [
  {
    title: "Pas përfundimit të abdesit",
    when: "Menjëherë pas mbarimit të abdesit, para namazit.",
    translation:
      "Dëshmoj se nuk ka zot tjetër përveç Allahut të vetëm, pa ortak dhe dëshmoj se Muhamedi është rob dhe i Dërguar i Tij.",
    meaning:
      "Ripërtëritja e dëshmisë së besimit ndërsa trupi juaj është i sapo pastruar. Pejgamberi ﷺ premtoi se kushdo që e thotë këtë pas abdesit, atij i hapen tetë dyert e Xhenetit që të hyjë nga ku të dojë.",
  },
  {
    title: "Tekbiratul-Ihram",
    when: "Në fillim të namazit dhe kur lëvizni ndërmjet pozicioneve.",
    translation: "Allahu është më i madhi.",
    meaning:
      "Namazi fillon këtu - 'el-ihram' do të thotë se ju ndalon gjërat e kësaj bote (të folurit, të ngrënit, të largoheni). Ju e shpallni Allahun më të madh se çdo gjë që mund t'ju shpërqendrojë dhe hyni plotësisht në praninë e Tij. Çdo tekbir që pason e përtërin atë dorëzim.",
  },
  {
    title: "Du'a el-Istiftah (lutja hapëse)",
    when: "Në heshtje pas tekbirit të hapjes, para El-Fatihasë.",
    translation:
      "Lavdia të takon Ty, o Allah, dhe lavdërimi. I bekuar është emri yt dhe i lartësuar është madhështia jote. Nuk ka zot tjetër përveç Teje.",
    meaning:
      "Ju e hapni bisedën duke madhëruar dhe lavdëruar Allahun dhe duke pohuar njëshmërinë e Tij, duke qetësuar zemrën para se të recitoni fjalët e Tij. Ekzistojnë disa lutje autentike të hapjes - kjo është një nga më të përdorurat.",
  },
  {
    title: "Surja El-Fatiha",
    when: "Qëndrimi në çdo rekat - një shtyllë pa të cilën rekati është i pavlefshëm.",
    translation:
      "Me emrin e Allahut, Gjithëmëshirshmit, Mëshirëbërësit të Veçantë. Falënderimet i takojnë Allahut, Zotit të botëve - Mëshirëplotit, Mëshirëplotit, Sunduesit të Ditës së Shpërblimit. Ty të adhurojmë dhe Ty të kërkojmë ndihmë. Na udhëzo në rrugën e drejtë - në rrugën e atyre që u ke dhënë mirësi, jo të atyre që kanë fituar zemërim apo të atyre që janë të humbur.",
    meaning:
      "'Nëna e Librit': gjysmë lavdërimi i Allahut dhe gjysma lutje për udhëzim, me 'Ty të adhurojmë' si varëse mes tyre. Allahu tha se Ai e ndau këtë sure mes Vetes dhe robit të Tij - ndërsa ju lexoni çdo rresht, Ai përgjigjet. Pejgamberi ﷺ tha se nuk ka lutje për atë që nuk e lexon atë.",
  },
  {
    title: "Dhikri në ruku",
    when: "Ndërsa përkulej, me një banesë, u qetësua.",
    translation: "Lavdia i takon Zotit tim të Madhërishëm.",
    meaning:
      "Përkulja është qëndrim nderimi, kështu që ju madhëroni madhështinë e Allahut - thënë tre ose më shumë herë, pa nxitim. Pejgamberi ﷺ mësoi se në ruku e lartësojmë Zotin, prandaj shpresoni që lutja juaj të përgjigjet.",
  },
  {
    title: "Duke u ngritur nga ruku",
    when: "Qëndrimi plotësisht drejt pas përkuljes.",
    translation:
      "Allahu e dëgjon atë që e lavdëron Atë. Zoti ynë, Ty të takon të gjitha falënderimet.",
    meaning:
      "Ju pohoni se Allahu me të vërtetë e dëgjon atë që e lavdëron Atë, pastaj ia ktheni të gjitha lavdërimet Atij. Profeti ﷺ tha se kur imami thotë këtë dhe njerëzit përgjigjen, kujtdo që fjalët përkojnë me engjëjt, i falen mëkatet e kaluara.",
  },
  {
    title: "Dhikri në suxhud",
    when: "Në sexhde - pozita më e afërt me Allahun.",
    translation: "Lavdia i takon Zotit tim, Më të Lartit.",
    meaning:
      "Në pikën më të ulët fizike ju lavdëroni Më të Lartin - paradoksin në zemër të adhurimit. Pejgamberi salAllahu alejhi ue selem ka thënë se robi është më afër Zotit të tij ndërsa është në sexhde, kështu që derdhni lutjen këtu pas dhikrit.",
  },
  {
    title: "Mes dy sexhdeve",
    when: "Ulur i qetë ndërmjet suxhudit të parë dhe të dytë të çdo rekati.",
    translation: "Zoti im, më fal. Zoti im, më fal.",
    meaning:
      "Një lutje e shkurtër por e drejtpërdrejtë për falje në çdo rekat - një kujtesë se edhe në mes të namazit ne kemi nevojë për faljen e Allahut. Uluni derisa të jeni të qetë para sexhdes së dytë.",
  },
  {
    title: "Et-Tahijet (Tashahhud)",
    when: "Në mes ulja dhe ulja e fundit e namazit.",
    translation:
      "Të gjitha përshëndetjet, lutjet dhe fjalët e pastra janë për Allahun. Paqja qoftë mbi ty o Pejgamber, mëshira e Allahut dhe bekimet e Tij. Paqja qoftë mbi ne dhe mbi robërit e drejtë të Allahut. Dëshmoj se nuk ka zot tjetër përveç Allahut dhe dëshmoj se Muhamedi është rob dhe i Dërguar i Tij.",
    meaning:
      "Zemra e ulur e namazit: ju bëni çdo lloj adhurimi vetëm për Allahun, dërgoni selam mbi Profetin ﷺ dhe të drejtët dhe rideklaroni dy dëshmitë. Ibn Mesudi e mësoi atë fjalë për fjalë nga Profeti ﷺ, ashtu siç mësohet një sure.",
  },
  {
    title: "Salavat Ibrahimije",
    when: "Në teshehudin e fundit, pas Et-Tahijetit.",
    translation:
      "O Allah, dërgoje salavate mbi Muhammedin dhe familjen e Muhammedit, ashtu siç e bekove Ibrahimin dhe familjen e Ibrahimit; me të vërtetë Ti je i Lavdëruar, i Lavdishëm. O Allah, jepi mirësi Muhammedit dhe familjes së Muhammedit, ashtu siç e ke favorizuar Ibrahimin dhe familjen e Ibrahimit; me të vërtetë Ti je i Lavdëruar, i Lavdishëm.",
    meaning:
      "Kur sahabët pyetën se si t'i dërgonin bekime mbi të, Profeti ﷺ ua mësoi atyre këto fjalë të sakta - salavatet më të vërtetuara në Sunet. Ju e nderoni të Dërguarin (sal-lAllahu alejhi ue sel-lem) ashtu siç e ka urdhëruar Allahu, duke e plotësuar namazin tuaj me dashuri për atë që ju ka mësuar të falni namazin.",
  },
  {
    title: "Kërkimi i strehimit para selamit",
    when: "Pas teshehudit dhe salavatit të fundit, pak para përfundimit të namazit.",
    translation:
      "O Allah, kërkoj mbrojtje te Ti nga dënimi i varrit, nga dënimi i xhehenemit, nga sprova e jetës dhe vdekjes dhe nga e keqja e sprovës së Mesihut të rremë (Dexhallit).",
    meaning:
      "Pejgamberi ﷺ udhëzoi që pas teshehudit të fundit njeriu të kërkojë strehim nga këto katër rreziqe përpara se të japë selam - lutja e fundit e namazit mbulon këtë jetë, varrin, zjarrin dhe sprovën më të madhe që do të vijë.",
  },
  {
    title: "Taslim (selami mbyllës)",
    when: "Përfundimi i namazit - kthimi i fytyrës në të djathtë, pastaj në të majtë.",
    translation: "Paqja dhe mëshira e Allahut qofshin mbi ju.",
    meaning:
      "Ju e lini namazin ashtu siç do të linit shoqërinë e të nderuarve - me një përshëndetje paqeje për engjëjt që regjistrojnë në secilën shpatull dhe për ata që luten pranë jush. Selami është një shtyllë; me të plotësohet namazi.",
  },
];
