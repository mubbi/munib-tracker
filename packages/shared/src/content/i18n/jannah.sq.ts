// Albanian translation overlay for the Learn "Journey to Jannah" content. Mirrors the order of
// its English source in ../jannah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  JannahDuaEntry,
  JannahGate,
  JannahPromisedEntry,
  JannahTopic,
  JannahVerseEntry,
} from "../../types/jannah";
import type { DeepPartial } from "./localize";

export const JANNAH_TOPICS_SQ: DeepPartial<JannahTopic>[] = [
  {
    title: "Çfarë është Xheneti?",
    summary: "Kopshti i përjetshëm Allahu përgatiti për të drejtët.",
    body: [
      "Xheneti (Xheneti) është shtëpia e përhershme e shpërblimit që Allahu ka përgatitur për ata që besojnë në Të dhe bëjnë vepra të mira. Fjala fjalë për fjalë do të thotë një kopsht i harlisur, me hije - por Kurani e përdor atë për një realitet shumë më të madh se çdo kopsht në tokë: një mbretëri lumenjsh, frutash, pallatesh dhe shoqërimi ku besimtari jeton përgjithmonë në kënaqësinë e Zotit të tij. Ky është qëllimi drejt të cilit çdo profet i ka thirrur njerëzit dhe destinacioni për të cilin është i gjithë ky udhëtim.",
      'Jeta në Xhenet nuk ngjan me asgjë në këtë botë, sepse është e lirë nga çdo të metë që prish lumturinë tokësore. Nuk ka vdekje, sëmundje, plakje, frikë, pikëllim dhe lodhje. Njerëzit e saj nuk debatojnë kurrë, nuk lodhen dhe nuk e humbin kurrë atë që duan. Gjithçka që dëshiron zemra i jepet, dhe Allahu shton edhe më shumë nga bujaria e Tij - "Ata do të kenë çfarë të dëshirojnë në të, dhe tek Ne ka edhe më shumë" (Kur\'an 50:35).',
      "Kënaqësitë e Xhenetit janë përtej imagjinatës njerëzore. Në një Hadith kudsi, Allahu thotë se Ai ka përgatitur për robërit e Tij të drejtë atë që asnjë sy nuk e ka parë, asnjë vesh nuk e ka dëgjuar dhe asnjë zemër nuk e ka ngjizur. Kjo është arsyeja pse Kurani e përshkruan Parajsën në imazhe të njohura - kopshte, lumenj dhe hije - ndërsa na kujton se realiteti është më i madh se çdo përshkrim. Shpërblimi më i madh nga të gjithë nuk janë vetë kopshtet, por kënaqësia e Allahut dhe, për gradat më të larta, nderimi i shikimit në Fytyrën e Tij fisnike.",
      "Një besimtar duhet të mbajë së bashku dy të vërteta. Së pari, Parajsa është reale, e afërt dhe ia vlen çdo përpjekje – Kurani na thotë të 'garojmë' drejt tij (Kur'an 3:133). Së dyti, askush nuk e fiton Xhenetin vetëm me vepra; Hyrja është përfundimisht nga mëshira e Allahut, me besimin e sinqertë dhe veprat e mira që janë mjetet që Ai ka zgjedhur të pranojë. Ky ekuilibër e mban gjallë shpresën pa rritur arrogancën: ne përpiqemi maksimalisht, pastaj hedhim veten mbi mëshirën e Tij.",
      "Praktikisht, lëreni realitetin e Xhenetit të formojë zgjedhjet tuaja të përditshme. Kur adhurimi ndihet i rëndë ose një tundim ndihet i fortë, mbani mend se çfarë pret dhe çfarë është në rrezik. Kërkoni shpesh Allahun për Parajsën, punoni për të vazhdimisht në mënyra të vogla të qëndrueshme dhe lëreni dëshirën për të të zbutur zemrën në këtë jetë kalimtare.",
    ],
    quran: [
      {
        excerpt:
          "Vraponi drejt faljes së Zotit tuaj dhe Xhenetit, gjerësia e të cilit është e qiejve dhe e tokës, e përgatitur për të devotshmit.",
      },
      {
        excerpt:
          "Allahu u ka premtuar besimtareve dhe besimtareve Xhennete, nëpër të cilat rrjedhin lumenj, ku do të qëndrojnë përgjithmonë, dhe vendbanime të këndshme në Xhennete të përhershme, por kënaqësia e Allahut është më e madhe.",
      },
      {
        excerpt:
          "Asnjë njeri nuk e di se çfarë u është fshehur rehatisë si shpërblim për atë që kanë bërë.",
      },
      {
        excerpt: "Aty do të kenë çfarë të dëshirojnë, e tek Ne ka edhe më shumë.",
      },
      {
        excerpt:
          "Ata që besuan dhe bënë vepra të mira, për ta janë kopshtet e strehimit si mikëpritje.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allahu tha: Unë kam përgatitur për robërit e Mi të mirë atë që nuk e ka parë syri, veshi nuk e ka ngjizur dhe asnjë zemër nuk e ka ngjizur.",
      },
      {
        excerpt:
          "Allahu i Lartësuar ka thënë: Unë kam përgatitur për robërit e Mi të mirë atë që as syri nuk e ka parë, as veshi nuk e ka dëgjuar dhe as zemra e njeriut nuk e ka parë.",
      },
    ],
  },
  {
    title: "Radhitet në Xhenet",
    summary: "Parajsa ka shumë shkallë - jo një shkallë fikse prej shtatë.",
    body: [
      "Parajsa nuk është një vend i vetëm i sheshtë; ajo ka shumë shkallë, të quajtura darajat dhe besimtarët ngrihen brenda saj sipas besimit dhe veprave të tyre. Një keqkuptim shumë i zakonshëm është se Xheneti ka saktësisht shtatë nivele. Kjo ngatërron dy gjëra të ndryshme: Kur'ani flet për shtatë qiej (samavat) - qiejt e krijuar mbi ne - jo shtatë nivele fikse të Xhenetit. Tekstet nuk e kufizojnë kurrë Xhenetin në shtatë gradë.",
      "Ajo që na thonë burimet autentike është se gradat janë të shumta dhe të gjera. Profeti ﷺ tha se Xheneti ka njëqind nivele të përgatitura për ata që luftojnë në rrugën e Allahut dhe se distanca ndërmjet një niveli dhe nivelit tjetër është si distanca midis qiejve dhe tokës. Edhe ky numër tregon pafundësinë dhe jo një shkallë të ngurtë që mund të ngjitemi duke shënuar kuti.",
      "Allahu e ngre secilin besimtar sipas fuqisë së besimit të tyre, sinqeritetit të qëllimit dhe peshës së veprave të tyre - 'Për të gjithë do të ketë shkallë sipas asaj që vepruan' (Kur'an 6:132). Grada e saktë që arrin çdo person e di vetëm Allahun. Zbulesa qëllimisht nuk na jep një listë kontrolli mekanike të 'bëni veprën X për të arritur nivelin N', sepse adhurimi synohet të drejtohet nga dashuria dhe sinqeriteti, jo nga numërimi i gradave.",
      "Mençuria në këtë është e bukur. Nëse do ta dinim vendosjen tonë të saktë, disa do të bëheshin të vetëkënaqur dhe të tjerët do të dëshpëroheshin. Në vend të kësaj, ne jemi mësuar të mbajmë sytë nga Allahu, të vazhdojmë të përpiqemi dhe të vazhdojmë të shpresojmë. Besimtari konkurron në të mirë - 'për këtë le të konkurrojnë konkurrentët' - ndërsa vlerësimin përfundimtar ia lë Më të Drejtit.",
      "Pra, në vend që të synoni në një nivel të numëruar, synoni më të lartën dhe lëreni Allahun t'ju vendosë ku të dojë. Pejgamberi ﷺ i mësoi sahabët që të mos kënaqeshin me një kërkesë modeste, por të kërkonin në mënyrë specifike El-Firdews, pikërisht majën e Xhenetit.",
    ],
    quran: [
      {
        excerpt: "Për të gjithë do të ketë gradë sipas asaj që ata bënë.",
      },
      {
        excerpt:
          "Shih se si Ne i kemi favorizuar disa prej tyre ndaj të tjerëve - dhe bota tjetër është më e madhe në shkallë dhe më e madhe në dallim.",
      },
      {
        excerpt:
          "Kushdo që i bindet Allahut dhe të Dërguarit, ata do të jenë me ata që Allahu u ka dhënë mirësi: profetët, të sinqertët, dëshmorët dhe të mirët. Sa shokë të shkëlqyer që janë!",
      },
    ],
    hadith: [
      {
        excerpt:
          "Xheneti ka njëqind nivele të cilat Allahu i ka përgatitur për ata që luftojnë në rrugën e Tij. Distanca ndërmjet dy niveleve është si distanca midis qiejve dhe tokës. Pra, kur të kërkoni Allahun, kërkoni prej Tij El-Firdewsin, sepse ai është pjesa më e mirë dhe më e lartë e Xhenetit.",
      },
      {
        excerpt:
          "Kur të luteni Allahun, kërkoni prej Tij Firdewsin, sepse ai është pjesa më e lartë e Xhenetit dhe mesi i Xhenetit dhe prej tij rrjedhin lumenjtë e Xhenetit dhe mbi të është Arshi i Mëshiruesit.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "El-Firdaws - më i larti",
    summary: "Maja e Xhenetit, më afër Arshit.",
    body: [
      "El-Firdaws është niveli më i lartë dhe më i shkëlqyer i Xhenetit i emërtuar në Sunetin autentik. Pejgamberi ﷺ e përshkroi atë si më të mirën e Xhenetit dhe mesin e tij - zemrën e tij - nga ku burojnë lumenjtë e Xhenetit, dhe mbi të është Arshi i Mëshiruesit. Të arrish El-Firdaws do të thotë të jesh aq afër Allahut sa çdo qenie e krijuar mund të jetë.",
      "Ajo që e bën këtë temë kaq praktike është një udhëzim profetik: kur bëjmë dua për Xhenetin, nuk duhet të synojmë poshtë. Pejgamberi ﷺ u mësoi shokëve se kur i kërkojnë Allahut Xhenetin, ata duhet të kërkojnë në mënyrë specifike El-Firdews në vend që të kënaqen me një kërkesë më të vogël. Bujaria e Allahut është e pakufishme, ndaj është një lloj mangësie të kërkosh prej Tij vetëm minimumin. Kjo na mëson ambicien në adhurim: synoni majën dhe lëreni Allahun, në mëshirën e Tij, të vendosë se ku do t'ju vendosë.",
      "Si bëhet një shërbëtor kandidat për një gradë të tillë? Mjetet janë të njëjtat mjete që të çojnë në vetë Xhenetin, të ndjekura me përsosmëri: besimi i shëndoshë (teuhidi) i mbajtur me sinqeritet, përmbushja e kujdesshme e obligimeve që Allahu ka urdhëruar, dhe më pas një jetë në rritje e adhurimit vullnetar mbi to - namaz nate, agjërim shtesë, përkujtim, bamirësi dhe karakter i mirë. Në një Hadith të famshëm kudsi, Allahu përshkruan se si robi vazhdon të afrohet përmes veprave vullnetare derisa Allahu ta dojë atë.",
      "Megjithatë dhurata përfundimtare dhe vendimtare është gjithmonë mëshira e Allahut. Në të njëjtën frymë që synojmë për më të lartën, kujtojmë fjalët e vetë Profetit ﷺ: askush nuk hyn në Xhenet vetëm me veprat e tij – madje as vetë Profeti a.s. – përveç se Allahu e mbështjell atë me mëshirën e Tij. Ky është ekuilibri i përsosur që arrin besimtari: shpresa dhe ambicia e lartë nga njëra anë, përulësia e sinqertë nga ana tjetër.",
      "Pra, bëje El-Firdewsin pjesë të rregullt të lutjes tënde – në sexhde, në të tretën e fundit të natës dhe para gjumit – ndërkohë që në heshtje bëni më të mirën tuaj çdo ditë dhe mbështeteni tërësisht në mëshirën e Zotit tuaj për pjesën tjetër.",
    ],
    hadith: [
      {
        excerpt:
          "Kur të luteni Allahun, kërkoni prej Tij Firdewsin, sepse ai është pjesa më e lartë e Xhenetit dhe mesi i Xhenetit dhe prej tij rrjedhin lumenjtë e Xhenetit dhe mbi të është Arshi i Mëshiruesit.",
      },
      {
        excerpt:
          "Askush prej jush nuk do të hyjë në Xhenet vetëm me veprat e tij. Ata thanë: As ti o i Dërguar i Allahut? Ai tha: As mua, përveç nëse Allahu më mbulon me mëshirë prej Tij.",
      },
    ],
    actions: [
      "Kërkoni Allahun për El-Firdews në duanë tuaj, veçanërisht në suxhud dhe para gjumit.",
      "Përsosni atë që ju është obliguar, pastaj shtojeni adhurimin vullnetar.",
      "Përtërijeni shpesh pendimin dhe mbështetuni në mëshirën e Allahut, jo vetëm në veprat tuaja.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ajo që rrezikon ahiretin",
    summary: "Mëkatet e mëdha kërkojnë pendim të sinqertë; Falja e Allahut është e madhe.",
    body: [
      "Ky seksion nuk ka për qëllim t'ju frikësojë në dëshpërim - krejt e kundërta. Allahu ia fal të gjitha mëkatet atij që i kthehet Atij sinqerisht dhe e shpall këtë me fjalët më të forta: “Thuaj: O robërit e Mi që e keni ngarkuar me shumë gabime veten tuaj, mos e humbni shpresën nga mëshira e Allahut. Vërtet, Allahu i fal të gjitha mëkatet' (Kur'an 39:53). Qëllimi këtu është thjesht të dimë se për çfarë paralajmërojnë tekstet, në mënyrë që të njohim rrezikun dhe të nxitojmë të kthehemi tek Ai para se të jetë tepër vonë.",
      'Është një mëkat që dallon nga të gjithë të tjerët: shirku - bërja shok Allahut në adhurim. Ky është mëkati i vetëm që Allahu nuk do ta falë nëse një person vdes pas tij pa u penduar, siç shprehet qartë në Kuran 4:48. Çdo gjë tjetër bie nën "Ai fal më pak se kaq kujt të dojë". Kjo është arsyeja pse teuhidi i saktë është themeli nën çdo vepër të pranuar: një shtëpi e ndërtuar mbi një themel të plasaritur nuk mund të qëndrojë.',
      "Pas shirkut, tekstet i japin peshë të veçantë braktisjes së namazit. Neglizhimi i pesë namazeve ditore, me këmbëngulje dhe pa arsye të vlefshme, është ndër paralajmërimet më të rënda në Sunet – Profeti (a.s) e quajti namazin besëlidhjen që e dallon besimtarin, aq sa lënia e tij i afrohet mosbesimit. Mëkate të tjera të mëdha - vrasja e padrejtë, marrëdhëniet e paligjshme, konsumimi i kamatës (riba), gëlltitja e pasurisë së një jetimi dhe shtypja e rëndë - janë çështje serioze që kërkojnë pendim të sinqertë dhe mund të sjellin dënim nëse Allahu nuk fal.",
      "Të ashtuquajturat mëkate 'më të vogla' kanë rëndësi gjithashtu dhe nuk duhet të merren kurrë lehtë. Përgojimi, gënjeshtra, arroganca, prishja e lidhjeve familjare dhe shkujdesja gërryen ngadalë zemrën dhe karakterin. Profeti ﷺ paralajmëroi se mëkatet e vogla të grumbulluara mund të shkatërrojnë një person ashtu si shkopinjtë e vegjël të mbledhur së bashku mund të gatuajnë një vakt të plotë. Secili prej tyre ka nevojë për kthimin e vet tek Allahu.",
      "E mira është shpresa në veprim: kurrë mos lejoni që madhësia e një mëkati t'ju bindë se pendimi është i kotë. Kthehuni tek Allahu në momentin që rrëshqitni, ndiqni një vepër të keqe me një të mirë për ta fshirë atë dhe mbajeni derën e istighfarit të hapur çdo ditë. Mëshira e tij është gjithmonë më e madhe se gabimi juaj.",
    ],
    quran: [
      {
        excerpt: "Vërtet, Allahu nuk ia fal shoqërinë Atij, por më pak se kaq ia fal kujt të dojë.",
      },
      {
        excerpt:
          "Thuaj: O robërit e Mi që e keni ngarkuar me shumë gabime veten tuaj, mos e humbni shpresën ndaj mëshirës së Allahut. Vërtet, Allahu i fal të gjitha mëkatet.",
      },
    ],
    hadith: [
      {
        excerpt: "Besëlidhja mes nesh dhe atyre është namazi; kush e braktis atë ka bërë kufër.",
      },
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Listat e mëkateve të mëdha në fikh ndryshojnë sipas dijetarëve dhe vendimet për individët u përkasin njerëzve të kualifikuar. Ky është një kujtesë e përgjithshme për t'u penduar - jo një vendim personal. Konsultohuni me një studiues të besueshëm për situatën tuaj.",
  },
  {
    title: "Ata të nderuar në tekste",
    summary:
      "Njerëz dhe grupe i emëroi Profeti sal-lAllahu alejhi ue sel-lem në lidhje me Xhenetin.",
    body: [
      "Kur'ani dhe Suneti veçojnë disa individë, kategori besimtarësh dhe vepra të lidhura me lajmin e gëzuar të Xhenetit. Është e rëndësishme që këto të lexohen saktë: ato janë raporte të sinqerta për ata njerëz ose përshkrime specifike - ato nuk janë një garanci e transferueshme për këdo që thjesht dëgjon emrat e tyre ose i admiron. Lajmi i gëzuar mbështetej në besimin dhe veprat e tyre dhe e njëjta derë na hapet me të njëjtat mjete.",
      "Grupi më i famshëm është Dhjetë Xheneti i Premtuar (el-Esharah el-Mubashsharah), të emërtuar së bashku nga Pejgamberi salAllahu alejhi ue selem në një transmetim të vetëm: Ebu Bekri, Umeri, Uthmani, Aliu, Talhah, Zubejri, Abd al-Rahman ibn Auf, Sa'd ibn Ebi Uakkas el-Abujdarh ibn Abujrah dhe. (Allahu qoftë i kënaqur me të gjithë ata). Këta ishin sahabët më të afërt dhe më sakrificë të Pejgamberit ﷺ, dhe Ehli Suneti i do dhe i nderon të gjithë ata pa e tepruar apo nënçmuar asnjërin prej tyre.",
      "Përtej individëve të përmendur, tekstet përshkruajnë kategori të dhëna lajme të gëzuara: të sinqertët dhe durimtarët, ata që vdesin si martirë të vërtetë në rrugën e Allahut sipas ligjit Islami, dhe ata fjalët e fundit të të cilëve në këtë jetë janë dëshmia e besimit, la ilahe illlah. Çdo përshkrim tregon për një realitet të brendshëm - sinqeritet, sakrificë ose një zemër e lidhur me Allahun në frymën e fundit - jo thjesht një etiketë e jashtme.",
      "Mësimi për ne nuk është të ndihemi të sigurt nga shoqërimi, as të pretendojmë këto grada për vete, por të frymëzohemi. Shembulli i tyre le të na tërheqë lart: ta duam atë që ata donin, të përpiqen ashtu siç u përpoqën dhe ta kthejnë atë admirim në dua dhe veprim, duke i kërkuar Allahut mbi të gjitha Husn al-Khatimah - një fund të mirë.",
    ],
    hadith: [
      {
        excerpt:
          "Ebu Bekri është në Xhenet, Omeri është në Xhenet, Uthmani është në Xhenet, Aliu është në Xhenet, Talha është në Xhenet, Zubejri është në Xhenet, Abd al-Rahman ibn Avf është në Xhenet, Sa'di është në Xhenet, Sa'id ibn Zejd është në Xhenet, dhe Ebu Ibn Zejdi është në Xhenet, dhe Ebu Ibn Zejdi është në Xhenet.",
      },
      {
        excerpt:
          'Fjalët e fundit të kujtdo që janë "Nuk ka Zot tjetër përveç Allahut" do të hyjë në Xhenet.',
      },
    ],
    disclaimer:
      "Lajmet e gëzuara në Hadith u referohen atyre që janë përmendur ose kategorive të përshkruara. Ato nuk zëvendësojnë nevojën për besimin, veprat dhe një fund të mirë. Allahu e di më së miri.",
  },
  {
    title: "Teuhidi - besimi i saktë",
    summary: "Asnjë vepër nuk pranohet pa monoteizëm të sinqertë.",
    body: [
      "Teuhid do të thotë të veçosh vetëm Allahun për adhurim – të besosh se vetëm Ai është Zot dhe Krijues, se vetëm Ai meriton të adhurohet dhe se Ai është unik në emrat dhe cilësitë e Tij. Është pikërisht mesazhi me të cilin është dërguar çdo profet dhe gjëja e parë me të cilën njeriu hyn në Islami. Për shkak se ka të bëjë me Atë që ne po adhurojmë, është themeli mbi të cilin qëndron e gjithë ndërtesa e fesë.",
      "Rëndësia e tij është e pamundur të mbivlerësohet: Allahu nuk pranon asnjë vepër nga një person që i bën shok Atij. “Nëse i bëni shok Allahut, veprat tuaja me siguri do të shkatërrohen” (Kur’an 39:65). Një mal me vepra të mira të ndërtuara në shirk nuk rëndon asgjë në Ditën e Gjykimit, ndërsa vepra më e vogël e ndërtuar mbi teuhidin e pastër mund të jetë jashtëzakonisht e rëndë. Kjo është arsyeja pse ruajtja e besimit të dikujt është edhe më urgjente sesa shumëfishimi i veprimeve të tij.",
      "Teuhidi gjithashtu kërkon sinqeritet, i quajtur ikhlas - që ne ta adhurojmë Allahun 'duke qenë të sinqertë ndaj Tij në fe' (Kur'an 98:5). Rreziku delikat këtu është rija, duke bërë akte adhurimi për t'u parë dhe lavdëruar nga njerëzit. Profeti ﷺ paralajmëroi se edhe shfaqja e fshehtë mund të prishë në heshtje një vepër. Ilaçi është të vazhdojmë të rinovojmë qëllimin: për kë po e bëj me të vërtetë këtë? Sinqeriteti është ajo që e kthen një akt të zakonshëm në një akt të çmuar përkushtimi.",
      "Urtësia e themelimit të teuhidit është se liron zemrën. Personi që adhuron vetëm Allahun është i çliruar nga frika e krijimit, nga ndjekja e miratimit të të gjithëve dhe nga lodhja e shërbimit të shumë zotërinjve. Jeta e tij fiton një drejtim të vetëm e të qartë: të kënaqë Atë që e ka krijuar.",
      "Praktikisht, mësoni besimin e saktë nga dijetarët e besueshëm, pastroni adhurimin tuaj nga shirku dhe hipokrizia dhe kontrolloni qëllimin tuaj para se të veproni. Ky hap i parë nuk është fakultativ ose i avancuar - aty fillon çdo rrugë drejt Parajsës.",
    ],
    quran: [
      {
        excerpt:
          "Ty dhe atyre që ishin para teje të është shpallur: “Nëse i bëni shok Allahut, veprat tuaja do të dështojnë dhe me siguri do të jeni prej të humburve.",
      },
      {
        excerpt:
          "Ata nuk u urdhëruan veçse të adhuronin Allahun, duke qenë të sinqertë ndaj Tij në fe.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Veprimet janë vetëm nga qëllimet, dhe çdo person do të ketë vetëm atë që ka synuar.",
      },
    ],
    actions: [
      "Mësoni bazat e teuhidit nga dijetarët e besueshëm.",
      "Përtërijeni qëllimin tuaj përpara akteve të adhurimit.",
      "Kërkoni falje për shfaqjen e fshehtë (riya).",
    ],
  },
  {
    title: "Namazi - shtylla",
    summary: "Ruajtja e pesë namazeve ditore është ndër veprat më të mëdha.",
    body: [
      "Namazi - pesë namazet ditore - është shtylla e dytë e Islamit dhe akti qendror i adhurimit të përditshëm. Pejgamberi ﷺ e përshkroi namazin si shtyllën e fesë: kushdo që e vendos atë vendos fenë, dhe kush e neglizhon atë, ka shkatërruar shumë nga ajo që e mban atë. Janë pesë takimet ditore të besimtarit me Zotin e tij, qëndrimi në këmbë, ruku dhe sexhde në lidhje të drejtpërdrejtë me Allahun.",
      "Rangu i tij është i pakrahasueshëm në mesin e veprave praktike për shkak të asaj që Pejgamberi ﷺ tha për Ditën e Gjykimit: çështja e parë për të cilën një rob do të merret parasysh është namazi. Nëse është e shëndoshë, pjesa tjetër e veprave do të jetë e shëndoshë; nëse është i mangët, pjesa tjetër është në rrezik. Edhe në këtë jetë, namazi është një mjet pastrimi - Pejgamberi ﷺ i krahasoi pesë namazet me një lumë që rrjedh në derën e dikujt: kushdo që lahet në të pesë herë në ditë, nuk ka papastërti, dhe kështu lutjet i lajnë mëkatet e vogla.",
      "Por lutja ka për qëllim të jetë më shumë se lëvizje fizike. Kur'ani lavdëron 'ata që janë të përulur në namazin e tyre' (Kur'an 23:1–2) dhe nderon 'ata që janë të vazhdueshëm në namazin e tyre' (Kur'an 70:22-23). Dy cilësi kanë më shumë rëndësi: khushu - një zemër e tanishme, e përulur që e di se qëndron para Allahut - dhe qëndrueshmëria, duke ruajtur çdo lutje në kohën e duhur. Falja e namazit me xhemat, për ata që janë në gjendje, e shumëfishon shpërblimin.",
      "Urtësia më e thellë e namazit është transformimi. Namazi, i bërë siç duhet, e frenon njeriun nga paturpësia dhe keqbërja; është një rivendosje e përsëritur që e tërheq zemrën prapa tek Allahu gjatë një dite të ngarkuar. Mungesa e namazit pa arsyetim të vlefshëm është pra një çështje e rëndë që kërkon pendim të sinqertë dhe kompensim të tyre (kada). Nafli dhe ravatibi - namazet e rregullta sunet para dhe pas atyre të detyrueshme - shtojnë më shumë dritë dhe ngrenë gradën.",
      "Praktikisht: mbrojini pesë namazet ditore në kohën e tyre si përparësinë tuaj absolute, plotësoni ato që keni humbur dhe shtoni namazet sunet që mund t'i mbani. Nëse lutja juaj përmirësohet, çdo gjë tjetër në adhurimin tuaj ka tendencë të përmirësohet me të.",
    ],
    quran: [
      {
        excerpt:
          "Me të vërtetë të suksesshëm janë besimtarët - ata që janë të përulur në lutjen e tyre.",
      },
      {
        excerpt: "Përveç atyre që falen - atyre që janë të vazhdueshëm në namazin e tyre.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Gjëja e parë për të cilën robi do të përgjigjet në Ditën e Kijametit është namazi i tij. Nëse është e shëndoshë, ai ia ka dalë; nëse është me të meta, ai ka dështuar dhe ka humbur.",
      },
      {
        excerpt:
          "Nëse do të kishte një lumë në derën e njërit prej jush në të cilin ai lahej pesë herë në ditë, a do të mbetej mbi të ndonjë papastërti? Ata thanë: Jo. Ai tha: Kjo është ngjashmëria e pesë namazeve – me to Allahu i fshin mëkatet.",
      },
    ],
    actions: [
      "Ruaji pesë namazet ditore në kohën e tyre.",
      "Falni namazet e humbura (kaza) me sinqeritet.",
      "Shto namazet sunet para dhe pas farzit ku të mundesh.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Pendim i sinqertë",
    summary: "Allahu i do ata që vazhdimisht kthehen tek Ai.",
    body: [
      "Teube është kthimi tek Allahu pas mëkatit. Pendimi i sinqertë (teube nasuh) ka shtylla të qarta: pendim i sinqertë në zemër për atë që është bërë, ndalimi i menjëhershëm i mëkatit dhe vendosmëria e vendosur për të mos u kthyer më kurrë tek ai - dhe nëse mëkati përfshinte keqbërjen e një personi tjetër, rivendosjen e të drejtës së tij ose kërkimin e faljes. Nuk është një ngjarje e vetme, por një kthim i përjetshëm, një derë që Allahu e mban të hapur për çdo besimtar.",
      "Rëndësia e tij është që asnjë qenie njerëzore të mos jetë e lirë nga mëkati, kështu që pendimi nuk është për disa mëkatarë, por për të gjithë. Pejgamberi ﷺ ka thënë se çdo fëmijë i Ademit bën mëkate, dhe më i miri prej atyre që mëkatojnë janë ata që pendohen. Allahu e pranon pendimin e një robi deri në momentin kur shpirti arrin në fyt në vdekje, madje edhe dielli që lind nga perëndimi është afati i fundit për botën - deri atëherë, ftesa qëndron.",
      "Çuditërisht, Allahu nuk e toleron vetëm robin që kthehet - Ai gëzohet. Pejgamberi ﷺ e përshkroi Allahun se ishte më i kënaqur me pendimin e robit të Tij se sa një njeri i cili, i humbur në një shkretëtirë djerrë, dëshpërohet nga jeta pasi deveja e tij endet me gjithë ushqimin dhe ujin e tij, pastaj befas e gjen përsëri. Ai imazh i gëzimit dërrmues na tregon se sa i dashur është robi i penduar për Zotin e tij.",
      "Mençuria është e thellë: mëkati nuk duhet të jetë fundi i historisë së një personi. 'Allahu do t'i zëvendësojë veprat e tyre të këqija me të mira' (Kur'an 25:70) - pendimi i sinqertë mund ta shndërrojë një histori dështimi në një sukses, dhe mund ta kthejë një rënie në një fillim të ri që e afron një person më afër Allahut se më parë. Dëshpërimi pas mëkatit është në vetvete një kurth i shejtanit; shpresa në mëshirën e Allahut është përgjigja e besimtarit.",
      "Praktikisht: mos e shtyni pendimin për asnjë ditë - kthehuni në momentin që rrëshqitni. Ndiqni çdo vepër të keqe me një vepër të mirë për ta fshirë atë dhe mbajeni istighfarin të rrjedhë në gjuhën tuaj gjatë gjithë ditës, ashtu siç Profeti ﷺ kërkoi falje shumë herë në ditë pavarësisht se ishte falur.",
    ],
    quran: [
      {
        excerpt:
          "O ju që besuat, kthehuni tek Allahu me një pendim të sinqertë, se ndoshta Zoti juaj do t'jua largojë të këqijat dhe do t'ju shpjerë në Xhennete, nëpër të cilat rrjedhin lumenj.",
      },
      {
        excerpt:
          "Me përjashtim të atyre që pendohen, besojnë dhe bëjnë vepra të mira, atyre All-llahu ua zëvendëson të këqijat me të mira, e Allahu është falës dhe mëshirues.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allahu është më i kënaqur me pendimin e robit të Tij se një prej jush, i cili pasi humbi devenë e tij në një tokë djerrë, befas e gjen përsëri.",
      },
    ],
    actions: [
      "Pendohuni menjëherë kur mëkatoni - mos e shtyni.",
      "Pasoje mëkatin me një vepër të mirë për ta fshirë atë.",
      "Thuaj istighfar gjatë gjithë ditës.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kurani",
    summary: "Lexoni, mbani mend dhe jetoni sipas Librit të Allahut.",
    body: [
      "Kur'ani është fjalimi i mirëfilltë i Allahut, i shpallur si udhërrëfyes, mëshirë dhe shërim për zemrat. Ndërtimi i një marrëdhënieje me të – recitimi i tij, meditimi i kuptimeve të tij, zbatimi i urdhrave të tij dhe mësimi i të tjerëve – është ndër aktet më të mëdha dhe më shpërblyese të adhurimit që një besimtar mund t'i kushtojë një jetë të tërë. Ai është litari i Allahut i shtrirë tek ne; kush i përmbahet asaj, ai është i udhëzuar në rrugën e drejtë.",
      "Shpërblimet e lidhura me të janë të jashtëzakonshme. Profeti ﷺ mësoi se Allahu u jep atyre që lexojnë librin e Tij dhe falin namazin një shpërblim të madh që nuk humbet kurrë (Kur'an 35:29–30), dhe se për çdo shkronjë të recituar ka një shpërblim dhjetëfishuar. Edhe ai që mundohet dhe pengohet nga fjalët, për sa kohë që vazhdon të përpiqet, ka një shpërblim të dyfishtë - një për recitimin dhe një për përpjekjen.",
      "Kur'ani gjithashtu e lartëson gradën e njeriut në jetën tjetër në mënyrë të drejtpërdrejtë dhe të gjallë. Pejgamberi salAllahu alejhi ue selem ka thënë se shokut të Kur'anit do t'i thuhet Ditën e Kijametit: 'Lexo dhe ngjitu, dhe lexoje siç lexoje dikur në botë, sepse grada jote do të jetë në ajetin e fundit që lexon.' Me fjalë të tjera, qëndrimi i dikujt në Parajsë ngrihet në hap me pjesën e tij të Librit - një inkurajim i mrekullueshëm për të vazhduar të mësosh përmendësh dhe të rishikosh.",
      "Megjithatë, qëllimi më i thellë nuk është recitimi për hir të tij, por transformimi. Allahu na urdhëron të 'lexojmë Kur'anin me lexim të matur' (Kur'an 73:4) pikërisht në mënyrë që kuptimet të zhyten dhe të riformësojnë mënyrën se si mendojmë, ndjejmë dhe sillemi. Kur'ani u dërgua për t'u jetuar, jo thjesht për të recituar; sahabët do të mësonin dhjetë ajete dhe nuk do të vazhdonin derisa t'i kuptonin dhe të vepronin sipas tyre.",
      "Praktikisht: lexoni një pjesë çdo ditë, qoftë edhe vetëm disa vargje, por lexojini ato me reflektim. Mësoni përmendësh sure të reja ose mbani atë që tashmë dini, dhe - më e rëndësishmja - veproni sipas asaj që mësoni përpara se të nxitoni përpara për të mësuar më shumë.",
    ],
    quran: [
      {
        excerpt:
          "Ata që lexojnë Librin e Allahut, falin namazin dhe japin nga ajo që Ne kemi dhënë, ata shpresojnë në një tregti që nuk do të humbasë, që Ai t'u japë shpërblimin e plotë dhe t'ua shtojë nga dhuntia e Tij.",
      },
      {
        excerpt: "Dhe lexo Kuranin me lexim të matur.",
      },
    ],
    hadith: [
      {
        excerpt:
          "I thuhet shokut të Kur'anit: Lexo dhe ngjitu dhe lexoje siç lexoje dikur në botë, sepse grada jote do të jetë në ajetin e fundit që lexon.",
      },
    ],
    actions: [
      "Lexoni çdo ditë - edhe disa vargje me reflektim.",
      "Mësoni përmendësh sure të reja ose mbani atë që dini.",
      "Veproni sipas asaj që mësoni përpara se të kërkoni më shumë.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Dhikr - përkujtim",
    summary: "E lehtë në gjuhë, e rëndë në peshore.",
    body: [
      "Dhikr do të thotë përkujtim i Allahut – ta mbash Atë të pranishëm në zemër dhe në gjuhë përmes fjalëve madhëruese (SubhanAllah), lavdërimit (Alhamdulillah), madhërimit (Allahu Ekber), pohimit të njëshmërisë së Tij (La ilahe illallah) dhe kërkimit të faljes (istighfar). Nga të gjitha rrugët për në Xhenet, dhikri është ndër më të lehtat për t'u kryer, por ndër më të mëdhatë në shpërblim, sepse mund të bëhet kudo, në çdo gjendje, në çdo moment.",
      "Vetë Allahu e urdhëron atë me bujari - 'O ju që besuat, përmendeni Allahun me shumë përmendje' (Kur'an 33:41-42) - dhe premton një fryt të veçantë për të: qetësinë e zemrës. “Vërtet, zemrat qetësohen me përmendjen e Allahut” (Kur’an 13:28). Në një botë të shqetësuar dhe të shqetësuar, kjo është një nga dhuratat më të mëdha të dhikrit. Pejgamberi ﷺ e peshoi gjithashtu shpërblimin e tij, duke thënë se dy fjalë të lehta në gjuhë, por të rënda në peshore dhe të dashura për të Gjithëmëshirshmin, janë SubhanAllahi ue bihamdihi, SubhanAllahil-Azim.",
      "Një kategori e veçantë është adkari i mëngjesit dhe i mbrëmjes - lutjet autentike që Profeti ﷺ mësoi për dy kufijtë e ditës. Këto veprojnë si një kështjellë shpirtërore, duke e ruajtur besimtarin nga dëmtimi dhe duke tërhequr mbrojtjen dhe kënaqësinë e Allahut. Vetëm disa minuta në fillim dhe në fund të çdo dite, të thënë me prezencë, riformësoni zemrën në heshtje me kalimin e kohës.",
      "Urtësia e dhikrit është se ai e mban të gjallë marrëdhënien me Allahun ndërmjet akteve formale të adhurimit. Një gjuhë që është e lagur nga kujtesa dhe, më e rëndësishmja, një zemër që kujton Allahun në zgjedhjet e saj të përditshme – duke ndaluar para zemërimit, para blerjes, përpara një vendimi – është qëllimi i vërtetë. Dhikri nuk ka për qëllim të qëndrojë në buzë; ka për qëllim të drejtojë jetën.",
      "Praktikisht: bëjeni zakonin e përditshëm edhkarin e mëngjesit dhe të mbrëmjes, mbani një pjesë të thjeshtë të tesbihut, istighfarit ose salavateve të rrjedhin gjatë momenteve të kota dhe kujtoni Allahun veçanërisht para gjumit dhe pas zgjimit. Konsistenca në pak është më e mirë se shpërthimet e shumë.",
    ],
    quran: [
      {
        excerpt:
          "Ata që besuan dhe zemrat e të cilëve qetësohen me përmendjen e Allahut, me të vërtetë me përmendjen e Allahut qetësohen zemrat.",
      },
      {
        excerpt:
          "O ju që besuat, përmendeni Allahun me shumë përmendje dhe madhëroni Atë në mëngjes dhe në mbrëmje.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dy fjalë janë të lehta në gjuhë, të rënda në peshore dhe të dashura tek i Gjithëmëshirshmi: SubhanAllahi ue bihamdihi, SubhanAllahil-Azim.",
      },
    ],
    actions: [
      "Plotësoni adhkarin në mëngjes dhe në mbrëmje çdo ditë.",
      "Përdorni një banak tesbih për istigfar ose salavat.",
      "Përkujto Allahun para gjumit dhe pas zgjimit.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Bamirësia dhe zekati",
    summary: "Shpenzoni nga ajo që ju ka dhënë Allahu – fshehurazi dhe haptazi.",
    body: [
      "Islami e urdhëron besimtarin që të japë nga pasuria që i ka besuar Allahu, detyrimisht dhe vullnetarisht. Zekati është tarifa e detyrueshme vjetore për kualifikimin e pasurisë - një nga pesë shtyllat e Islamit - dhe është e detyrueshme, jo fakultative, për ata që plotësojnë kushtet e saj. Përtej saj qëndron sadakaja: dhënia vullnetare e çdo sasie, në çdo kohë, për hir të Allahut.",
      "Shpërblimet e shpenzimeve për rrugën e Allahut janë shumëfishuar përtej aritmetikës së zakonshme. Allahu e krahason atë që shpenzon në rrugën e Tij me një kokërr që dalin shtatë kallinj, ku secili kalli mban njëqind kokrra - 'dhe Allahu ia shumëzon kujt të dojë' (Kur'an 2:261). Larg nga pakësimi i pasurisë, sadakaja e pastron atë dhe e shton atë në berake, ndërsa i shuan gjynahet ashtu siç shuan uji zjarrin.",
      "Dy forma të bamirësisë meritojnë përmendje të veçantë. E para është sadakaja e fshehur, e dhënë në mënyrë kaq të matur, saqë, siç e përshkroi Profeti ﷺ, dora e majtë nuk e di se çfarë ka dhënë dora e djathtë - ky sinqeritet është veçanërisht i dashur për Allahun dhe i bën hije njeriut në Ditën e Gjykimit. E dyta është sadakaja xherija, bamirësia e vazhdueshme përfitimi i së cilës vazhdon edhe pas vdekjes. Pejgamberi salAllahu alejhi ue selem ka thënë se kur njeriu vdes veprat e tij mbarojnë përveç tri: sadakasë së vazhdueshme, diturisë që u sjell dobi të tjerëve dhe fëmijës së drejtë që lutet për të.",
      "Urtësia e bamirësisë është se ajo vepron tek dhuruesi po aq sa edhe marrësi. Ai liron kontrollin e lakmisë në zemër, ndërton dhembshurinë, forcon lidhjet e komunitetit dhe u kujton të pasurve se ata janë të besuar, jo pronarë të vërtetë. Dhe Islami e zgjeron përkufizimin e bamirësisë, kështu që askush nuk përjashtohet: Profeti ﷺ mësoi se një buzëqeshje për vëllain tënd, një fjalë e dobishme, madje edhe heqja e një objekti të dëmshëm nga rruga janë të gjitha forma sadakaje.",
      "Praktikisht: nëse jeni përgjegjës për zekatin, llogarisni dhe paguani me saktësi; jepni disa sadaka të rregullta, sado të vogla, në mënyrë që dhënia të bëhet zakon dhe jo ngjarje; dhe kërkoni një xharije sadakaje të qëndrueshme – sponsorizimi i një studenti, financimi i një pusi ose mbështetja e një xhamie – që vazhdon t'ju shpërblejë shumë kohë pasi të jeni larguar.",
    ],
    quran: [
      {
        excerpt:
          "Shembulli i atyre që e shpenzojnë pasurinë e tyre në rrugën e Allahut është si një kokërr që dalin shtatë kallinj, në çdo kalli njëqind kokrra. Dhe Allahu ia shumëzon kujt të dojë.",
      },
      {
        excerpt:
          "Shpenzoni nga ajo që ju kemi dhënë, para se t'i vijë vdekja njërit prej jush, e ai të thotë: O Zoti im, sikur të më vonoje pak, që të jap lëmoshë dhe të jem prej të mirëve.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kur njeriu vdes, veprat e tij përfundojnë, përveç tri: bamirësisë së vazhdueshme, diturisë së dobishme ose një fëmije të drejtë që lutet për të.",
      },
    ],
    actions: [
      "Llogaritni dhe paguani zekatin nëse jeni të detyruar.",
      "Jepni bamirësi të rregullt, qoftë edhe të vogla.",
      "Kërkoni mundësi për sadaka jariyah.",
    ],
    appLinks: [{}],
  },
  {
    title: "Karakter i mirë",
    summary: "Gjëja më e rëndë në peshore mund të jenë sjelljet e shkëlqyera.",
    body: [
      "Karakteri i mirë (husn al-khuluq) është koleksioni i tipareve fisnike që një besimtar shfaq në trajtimin e krijimit të Allahut: vërtetësia, durimi, përulësia, mëshira, bujaria, butësia dhe mbajtja e premtimeve. Larg nga të qenit thjesht një mirësi shoqërore, Islami e trajton karakterin si masë thelbësore të besimit dhe një nga veprat më të rënda që një person mund të bartë deri në Ditën e Gjykimit.",
      "Rangu i tij është shprehur në termat më të qartë. Pejgamberi a.s. ka thënë se asgjë nuk vendoset në peshore më të rëndë se karakteri i mirë dhe se besimtarët më të plotë në besim janë ata me karakterin më të mirë. Ai madje e përmblodhi misionin e tij duke thënë se ishte dërguar në një karakter fisnik të përsosur. Kjo do të thotë se mënyra se si i trajtoni prindërit, bashkëshorten, fëmijët, fqinjët tuaj, madje edhe të huajt, nuk është e ndarë nga adhurimi juaj – është një pjesë qendrore e tij.",
      "Karakteri i bukur është i fuqishëm për shkak të asaj që Pejgamberi ﷺ ka premtuar se mund ta arrijë: me sjelljet e tij të mira një besimtar mund të arrijë gradën e atij që agjëron gjithë ditën dhe fal namaz gjithë natën. Me fjalë të tjera, karakteri i shkëlqyer mund ta ngrejë një person të zakonshëm në nivelin e adhuruesve më të devotshëm, sepse është i vështirë, i vazhdueshëm dhe e vë në provë egon në çdo hap - frenimi i zemërimit, falja e fyerjeve dhe zgjedhja e butësisë kur ashpërsia do të ishte më e lehtë.",
      "Urtësia është se Islami nuk është vetëm një marrëdhënie private ndërmjet një personi dhe Allahut; ai ka për qëllim të vërshojë në mënyrën se si dikush i trajton të gjithë rreth tij. Një adhurues, namazi i të cilit nuk i zbut punët e tij, e ka humbur çështjen, ndërsa karakteri i mirë është davet në vetvete, duke i tërhequr njerëzit drejt besimit përmes shembullit të gjallë. Kjo është arsyeja pse tekstet çiftëzojnë adhurimin e Allahut me përsosmërinë ndaj krijimit të Tij vazhdimisht dhe përsëri.",
      "Praktikisht: punoni me një tipar në të njëjtën kohë - mbajeni gjuhën kur provokoheni, falni ata që ju bëjnë keq, rregulloni një marrëdhënie që keni lënë të prishet dhe mbani premtimet tuaja edhe kur ju kushtojnë. Një reflektim i shkurtër ditor pas namazit se si i trajtuat njerëzit atë ditë është një mënyrë e thjeshtë për t'u rritur në mënyrë të qëndrueshme.",
    ],
    quran: [
      {
        excerpt: "Dhe vërtet, ju jeni me një karakter të madh dhe fisnik.",
      },
      {
        excerpt:
          "Ata që shpenzojnë në lehtësi dhe vështirësi, të cilët e frenojnë zemërimin e tyre dhe i falin njerëzit, e Allahu i do bamirësit.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Asgjë nuk është më e rëndë në peshoren e një besimtari në Ditën e Kijametit sesa karakteri i mirë. Vërtet, Allahu nuk i pëlqen njeriun e turpshëm dhe të vrazhdë.",
      },
      {
        excerpt:
          "Besimtarët më të plotë në besim janë ata që kanë karakter më të mirë dhe më të mirët prej jush janë ata që janë më të mirët me gratë e tyre.",
      },
    ],
    actions: [
      "Praktikoni durimin kur provokoheni.",
      "Falni të tjerët dhe rregulloni marrëdhëniet e prishura.",
      "Reflektoni karakterin tuaj pas namazit në një ditar të përditshëm.",
    ],
    appLinks: [{}],
  },
  {
    title: "Duke kërkuar dije",
    summary: "Allahu ia lehtëson rrugën për në Xhenet atij që kërkon dituri.",
    body: [
      "Kërkimi i diturisë së dobishme – mësimi i asaj që Allahu dhe i Dërguari i Tij ﷺ mësoi, pastaj veproja sipas saj dhe përcjellja e saj – është një formë adhurimi dhe, në thelb, një obligim për çdo musliman. Kjo është dituria e shenjtë që qartëson besimin, pastron adhurimin dhe dallon të drejtën nga e padrejta; nuk është dituria për t'u dukur, por drita që drejton veprimin.",
      'Profeti ﷺ e lidhi këtë ndjekje drejtpërdrejt me qëllimin e gjithë këtij udhëtimi: "Kushdo që merr një rrugë në kërkim të diturisë, Allahu do t\'ia lehtësojë rrugën për në Xhenet". "Rruga" është edhe e drejtpërdrejtë edhe e figurshme - Allahu ia lehtëson rrugën kërkuesit në këtë jetë dhe ia lehtëson rrugën për në Xhenet në jetën tjetër. Ai gjithashtu mësoi se engjëjt ulin krahët e tyre në shenjë miratimi për kërkuesin e diturisë dhe se çdo gjë në qiej dhe tokë, madje edhe peshqit në det, kërkojnë falje për atë që mëson mirë.',
      "Dija është gjithashtu një nga veprat e rralla që vazhdon të shpërblejë një person pas vdekjes. Pejgamberi ﷺ e emërtoi diturinë e dobishme në mesin e tri gjërave, shpërblimi i të cilave vazhdon në varr, krahas bamirësisë së vazhdueshme dhe fëmijës së drejtë. Pra, mësimi i një çështjeje të vetme të dobishme – të ndihmosh dikë të mësojë të falet siç duhet, të ndash një Hadith autentik ose ta udhëzosh një person drejt së vërtetës – mund të bëhet një rrjedhë shpërblimi që rrjedh për vite, madje edhe breza.",
      "Urtësia është se veprimi pa dituri është i verbër dhe dituria pa veprim është e pafrytshme. Njohuria e saktë e mbron një person nga risitë dhe devijimet, e thellon sinqeritetin dhe i jep atij aftësinë për të përfituar nga të tjerët në vend që të përfitojë thjesht nga vetja. Dijetarët e Islamit gjithmonë kanë tërhequr vërejtjen kundër dy rreziqeve: të vepruarit me injorancë dhe të diturit pa vepruar.",
      "Praktikisht: angazhohuni që të mësoni rregullisht diçka të dobishme - një varg, një Hadith, një rregull që ju nevojitet për adhurimin tuaj të përditshëm. Filloni me gjërat thelbësore të besimit, lutjes, pastrimit dhe ndalesave kryesore, pastaj thellohuni gradualisht. Ndani atë që mësoni me përulësi dhe zbatojeni gjithmonë për veten tuaj së pari.",
    ],
    quran: [
      {
        excerpt:
          "Thuaj: A janë të barabartë ata që dinë me ata që nuk dinë? Vetëm ata që kuptojnë marrin parasysh.",
      },
      {
        excerpt: "Dhe thuaj: Zoti im, më shto diturinë.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kushdo që merr një rrugë në kërkim të diturisë, Allahu do t'ia lehtësojë rrugën për në Xhenet.",
      },
      {
        excerpt:
          "Kur njeriu vdes, veprat e tij përfundojnë, përveç tri: bamirësisë së vazhdueshme, diturisë së dobishme ose një fëmije të drejtë që lutet për të.",
      },
    ],
    actions: [
      "Mësoni diçka të dobishme çdo javë.",
      "Ndani njohuritë pa arrogancë.",
      "Aplikoni atë që mësoni përpara se të grumbulloni më shumë.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Adhurim vullnetar",
    summary: "Afrohuni tek Allahu përmes naflit përtej detyrimit.",
    body: [
      "Adhurimi vullnetar (nafl) i referohet veprimeve shtesë të përkushtimit që një besimtar ofron përtej asaj që Allahu e ka bërë të detyrueshme - lutjet shtesë, agjërimet shtesë, bamirësi shtesë dhe përkujtim. Detyrimet janë të parat dhe janë të panegociueshme, por pasi ato përmbushen, nafli është vendi ku një shërbëtor shpreh dashurinë, afërsinë dhe dëshirën që kalon minimumin e kërkuar.",
      "Ka një premtim mahnitës bashkëngjitur me të. Në një Hadith kudsi, Allahu thotë: “Robi Im nuk më afrohet me diçka më të dashur tek Unë sesa ajo që ia kam bërë obligim. Dhe ai vazhdon të më afrohet Mua përmes veprave vullnetare derisa Unë ta dua atë.” dhe kur Allahu e do një rob, lutjet e tij pranohen dhe punët e tij rregullohen. Prandaj, adhurimi vullnetar është shkalla e afërsisë, duke u ngjitur nga bindja e thjeshtë drejt dashurisë hyjnore.",
      "Suneti është i pasur me forma të aksesueshme të tij: namazi i natës (tehaxhud) në pjesën e fundit të natës, namazi i drekës (duha), namazet e rregullta sunet para dhe pas obligimeve dhe agjërimi vullnetar si të hënën dhe të enjten ose ditët e bardha të çdo muaji. Adhurimi i naflit gjithashtu i rregullon në heshtje të metat tona - Profeti (a.s) mësoi se çdo mangësi në namazet e detyrueshme do të plotësohet nga lutjet vullnetare të një personi në Ditën e Gjykimit.",
      "Urtësia është se nefli e mban besimin të gjallë dhe të rritet. Detyrimet ruajnë vijën bazë, por aktet vullnetare janë aty ku shtrihet zemra, ku adhurimi privat që askush nuk e sheh ndërton sinqeritetin dhe ku njeriu stërvit veten për sprovat më të vështira të jetës. Është gjithashtu një mëshirë që këto veprime janë fakultative - Allahu hap shumë dyer në mënyrë që çdo person të mund të ecë nëpër ato që i përshtaten.",
      "Praktikisht, çelësi është qëndrueshmëria, jo intensiteti. Profeti ﷺ mësoi se veprat më të dashura tek Allahu janë ato më të qëndrueshme, qoftë edhe të vogla. Zgjidhni disa veprime vullnetare që mund t'i mbani vërtet – dy rekate tehaxhud, një agjërim në javë, një pjesë të caktuar të Kuranit – në vend të një shpërthimi ambicioz që digjet brenda disa ditësh.",
    ],
    quran: [
      {
        excerpt:
          "Anët e tyre i braktisin shtretërit e tyre, ndërsa e lusin Zotin e tyre me frikë dhe shpresë dhe shpenzojnë nga ajo që Ne u kemi dhënë. Askush nuk e di se çfarë ngushëllimi është fshehur për ta si shpërblim për atë që kanë bërë.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Robi Im nuk më afrohet me diçka më të dashur për Mua sesa ajo që ia kam bërë obligim. Dhe robi Im vazhdon të më afrohet Mua përmes veprave vullnetare derisa Unë ta dua atë.",
      },
    ],
    actions: [
      "Falni tehaxhudin edhe nëse janë vetëm dy rekate.",
      "Ditë të agjëruara vullnetare kur të jetë e mundur.",
      "Shtoni namazet e vazhdueshme sunet para/pas farzit.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Durim dhe mirënjohje",
    summary: "Allahu i do durimtarët dhe falënderuesit.",
    body: [
      "Durimi (sabr) dhe mirënjohja (shukr) janë dy krahët me të cilët një besimtar fluturon gjatë jetës. Durimi është qëndrueshmëri në tri fusha: qëndrimi i palëkundur në bindjen ndaj Allahut, frenimi nga mosbindja dhe përballimi i sprovave të jetës pa u ankuar ndaj vendimit të Tij. Mirënjohja është të njohësh çdo bekim si të ardhur nga Allahu dhe të përgjigjesh me falënderim në zemër, në gjuhë dhe me veprim të bindur. Së bashku ato mbulojnë përgjigjen e besimtarit ndaj vështirësive dhe lehtësisë.",
      "Rëndësia e tyre është që ata të përcaktojnë se si një besimtar takohet me gjithçka që i ndodh. Pejgamberi ﷺ u mrekullua që e gjithë çështja e besimtarit është e mirë: kur i arrin e mira, ai është mirënjohës dhe është mirë për të, dhe kur e godet vështirësia, ai bën durim dhe kjo është gjithashtu e mirë për të - bekim që nuk i jepet askujt përveç besimtarit. Pra, çfarëdo që të vijë, besimtari ka një rrugë për shpërblim.",
      "Shpërblimi për durimin është në mënyrë unike i pakufizuar. Ndërsa shumica e veprave shpërblehen me shumëfish të matur, Allahu thotë: \"Durimtarëve do t'u jepet shpërblimi pa masë\" (Kur'an 39:10). Dhe mirënjohja mbart premtimin e vet të rritjes: 'Nëse jeni mirënjohës, me siguri do t'ju shtoj' (Kur'an 14:7). Falënderimi, pra, nuk është vetëm përgjigja e duhur ndaj bekimeve – është pikërisht ajo gjë që i bën ato të rriten.",
      "Mençuria këtu riformulon vuajtjen tërësisht. Gjykimet nuk janë automatikisht dënime; për një besimtar që përgjigjet mirë, ato mund të jenë pastrim që fshin mëkatet dhe lartësim që ngre gradën. Pejgamberi ﷺ mësoi se asnjë lodhje, sëmundje, shqetësim apo edhe gjemba nuk i bie muslimanit pa i fshirë Allahu disa nga mëkatet e tij nëpërmjet saj. Kjo i kthen momentet më të vështira të jetës në mundësi dhe jo në humbje të pastër.",
      "Praktikisht: kur të godet fatkeqësia, përgjigjuni me fjalët që ka mësuar Allahu - 'Inna lillahi ue inna ilayhi raji'un' (Vërtet ne jemi të Allahut dhe tek Ai kthehemi) - dhe mbajeni gjuhën tuaj nga ankesa që refuzon vendimin e Tij. Në kohë të mira, numëroni bekimet tuaja me zë të lartë dhe falënderoni Allahun për të paktën disa prej tyre çdo ditë; emërtimi i tyre e mban zemrën të butë dhe mirënjohëse.",
    ],
    quran: [
      {
        excerpt:
          'Përgëzoji durimtarët, të cilët kur godet fatkeqësia thonë: "Ne jemi të Allahut dhe me të vërtetë tek Ai do të kthehemi". Mbi ta ka begati dhe mëshirë nga Zoti i tyre dhe janë ata që janë në rrugë të drejtë.',
      },
      {
        excerpt:
          "Nëse jeni mirënjohës, me siguri do t'ju shtoj; por nëse mohoni, dënimi Im është i rëndë.",
      },
    ],
    hadith: [
      {
        excerpt:
          "E mrekullueshme është çështja e besimtarit, sepse të gjitha punët e tij janë të mira. Nëse vjen lehtësimi, ai është mirënjohës dhe kjo është mirë për të; e nëse vjen vështirësia ai bën durim dhe kjo është e mirë për të. Kjo nuk është për askënd përveç besimtarit.",
      },
    ],
    actions: [
      "Thuaj 'inna lillahi ue inna ilayhi raji'un' kur të sprovohet.",
      "Falënderoni Allahun me zë të lartë për tre bekime në ditë.",
      "Mos u ankoni në një mënyrë që refuzon caktimin e Allahut.",
    ],
  },
  {
    title: "Thirrja drejt Allahut",
    summary: "Kushdo që udhëzon tjetrin, merr shpërblim si ai që e pason atë.",
    body: [
      "Da'wah do të thotë të ftosh të tjerët drejt Allahut - të ndash mesazhin e Islamit, t'i mësosh një personi të falet, të inkurajosh të mirën, të dekurajosh butësisht të keqen ose të ndihmosh një musliman që lufton të kthehet në bindje. Ishte mision i çdo profeti dhe është përgjegjësi e përbashkët e komunitetit, secili sipas aftësive dhe njohurive të tij. Nuk është e rezervuar për dijetarët; kushdo që përcjell qoftë edhe një gjë të dobishme është duke thirrur tek Allahu.",
      "Shpërblimi i tij është një nga më bujarët në të gjithë Islamin. Pejgamberi ﷺ ka thënë se kushdo që e udhëzon dikë në mirësi, ka një shpërblim si ai që vepron sipas saj - dhe në një transmetim tjetër, kush thërret në udhëzim, merr shpërblimin e të gjithë atyre që e ndjekin atë, pa iu pakësuar aspak shpërblimi i tyre. Kjo do të thotë se e mira që keni vënë në lëvizje mund të vazhdojë të shumëfishojë shpërblimin tuaj përmes çdo personi që prek, shumë kohë pasi të keni vazhduar.",
      'Por daveti ka një adab - një mënyrë - që duhet nderuar që ai të ketë sukses. Allahu urdhëron: "Fto në rrugën e Zotit tënd me urtësi dhe këshillë të mirë dhe diskuto me ta në mënyrën më të mirë" (Kur\'an 16:125). Mençuria do të thotë të thuash gjënë e duhur, personit të duhur, në mënyrën dhe kohën e duhur; ashpërsia, arroganca dhe pikë-pika i largojnë njerëzit dhe e tradhtojnë qëllimin. Puna e thirrësit është të përcjellë dhe të mbjellë, jo të detyrojë zemrat, të cilat i përkasin vetëm Allahut.',
      "Urtësia e lidhjes së një shpërblimi kaq të madh me udhëzimin e të tjerëve është se ai e bën çdo besimtar burim të së mirës së vazhdueshme. Ai gjithashtu mbron besimin e vetë thirrësit: të ftosh të tjerët në lutje, ndershmëri dhe adhurim do të thotë të kujtohesh që të mbahesh fort pas tyre. Dhe e lidh bashkësinë së bashku në kujdesin reciprok dhe jo me neglizhencë reciproke.",
      "Praktikisht, filloni afër shtëpisë. Përmirësoni dhe mësoni familjen tuaj - një bashkëshort, një fëmijë, një vëlla apo vëlla - pasi ata janë përgjegjësia juaj e parë dhe më e qëndrueshme. Ndani njohuritë e dobishme me dashamirësi, ndihmoni dikë të mësojë të lutet ose të lexojë Kur'an dhe mbani mend se një jetë me karakter të mirë dhe adhurim të qëndrueshëm është shpesh da'wahu më bindës nga të gjitha.",
    ],
    quran: [
      {
        excerpt:
          "Fto në rrugën e Zotit tënd me urtësi dhe këshillë të mirë dhe diskuto me ta në mënyrën më të mirë.",
      },
      {
        excerpt:
          "E kush flet më mirë se ai që fton tek Allahu, bën vepra të mira dhe thotë: “Vërtet, unë jam prej muslimanëve.",
      },
    ],
    hadith: [
      {
        excerpt: "Kush e udhëzon dikë në mirësi, do të ketë një shpërblim si ai që e bën atë.",
      },
    ],
    actions: [
      "Ndani njohuritë e dobishme me mirësinë.",
      "Ndihmo dikë të mësojë të falet ose të lexojë Kur'an.",
      "Bëhu shembull i karakterit të mirë në publik.",
    ],
  },
  {
    title: "Vepra të mëdha gjatë gjithë jetës",
    summary: "Haxhi, familje dhe bamirësi e qëndrueshme.",
    body: [
      "Krahas akteve të adhurimit ditore dhe javore, Islami e drejton besimtarin drejt një grushti veprash të mëdha e të përjetshme – investime të mëdha, shpërblimi i të cilave është i pamasë dhe, në disa raste, i pafund. Këto janë projektet që ia vlen të planifikohet një jetë rreth: pelegrinazhi, ngritja e një familjeje të drejtë dhe ndërtimi i veprave të mira të qëndrueshme.",
      "Më kryesorja prej tyre është Haxhi, shtylla e pestë e Islamit, i detyrueshëm një herë në jetë për çdo musliman që është i aftë fizikisht dhe financiarisht - 'Haxhi në shtëpi është një detyrë që i detyrohet Allahut nga njerëzit që janë në gjendje të gjejnë një rrugë' (Kur'an 3:97). Shpërblimi i tij është pastrimi i plotë: Pejgamberi ﷺ ka thënë se kushdo që e kryen haxhin për hir të Allahut dhe i shmanget turpit dhe mëkatit, kthehet pa mëkat, aq i pastër sa dita që e lindi nëna e tij. Haxhi i pranuar, tha ai, nuk ka shpërblim më të vogël se Xheneti. Umra, pelegrinazhi më i vogël, gjithashtu mbart shpërblim të madh dhe fshin mëkatet ndërmjet një umre dhe tjetrës.",
      "Investimi i dytë i madh është sadaka jariyah - bamirësi e vazhdueshme që vazhdon të shpërblejë një person pas vdekjes. Pejgamberi ﷺ e emëroi atë ndër tre gjërat që vazhdojnë t'i bëjnë dobi njeriut në varr, së bashku me diturinë e dobishme dhe një fëmijë të drejtë që lutet për të. Rritja e fëmijëve me besim dhe karakter të mirë është ndoshta më e madhja prej tyre, por po ashtu janë ndërtimi ose mirëmbajtja e një xhamie, gërmimi i një pusi, sponsorizimi i një jetimi, mbjellja e një peme ose financimi i arsimit – secila një rrjedhë shpërblimi që i kalon atij që jep.",
      "Urtësia e këtyre veprave është se ato e zgjasin llogarinë e një personi përtej jetëgjatësisë së tij. Vitet aktive të një besimtari janë të shkurtra, por një pus që ai ka hapur ose një fëmijë që ai e ka rritur mirë mund t'i japë atij shpërblim për shekuj. Kështu, Islami inkurajon vizionin afatgjatë: të mendoni jo vetëm për namazin e sotëm, por se çfarë të mira do të rrjedhin ende nga ju pasi të jeni larguar.",
      "Praktikisht: nëse jeni në gjendje, planifikoni seriozisht për Haxhin ose Umren në vend që ta shtyni pafundësisht. Hidhni përpjekje të vërteta në besimin dhe karakterin e familjes suaj, pasi ato janë trashëgimia juaj më e qëndrueshme. Dhe identifikoni të paktën një projekt bamirësie të qëndrueshme për të mbështetur - njohuri, ujë, strehim ose një jetim - në mënyrë që veprat tuaja të mira të vazhdojnë pas vdekjes.",
    ],
    quran: [
      {
        excerpt:
          "Dhe Haxhi në Shtëpi është një detyrë që i detyrohet Allahut nga ata njerëz që janë në gjendje të gjejnë rrugën drejt tij.",
      },
      {
        excerpt:
          "Dhe shpalli njerëzve Haxhin; ata do të vijnë te ju në këmbë dhe me çdo deve të dobët nga çdo vend i largët, që të mund të dëshmojnë përfitime për veten e tyre.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kushdo që e kryen haxhin për hir të Allahut dhe nuk bën turp apo shkelje, kthehet pa mëkat, si ditën kur e lindi nëna e tij.",
      },
      {
        excerpt:
          "Kur njeriu vdes, veprat e tij përfundojnë, përveç tri: bamirësisë së vazhdueshme, diturisë së dobishme ose një fëmije të drejtë që lutet për të.",
      },
    ],
    actions: [
      "Planifiko Haxhin ose Umren nëse ke mundësi.",
      "Investoni në besimin dhe karakterin e familjes suaj.",
      "Mbështetni një projekt bamirësie të qëndrueshme.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Mëshira e Allahut - fjala e fundit",
    summary: "Veprat janë mjete; hyrja është me mëshirën e Tij.",
    body: [
      "Pas të gjitha veprave, të gjitha përpjekjeve dhe të gjitha rrugëve, besimtari arrin në një të vërtetë përulëse që është fjala e fundit në këtë udhëtim: askush nuk hyn në Xhenet vetëm për shkak të veprave të tij. Pejgamberi ﷺ e ka thënë këtë për veten e tij - më i dashuri nga të gjitha krijesat tek Allahu - duke thënë se as ai nuk do të hynte në Xhenet me veprat e tij, përveç se Allahu e mbështjell atë me mëshirën e Tij. Nëse është kështu për të, sigurisht që është kështu për ne.",
      "Kjo nuk duhet të keqkuptohet kurrë si leje për të neglizhuar adhurimin. Veprat mbeten mjetet që Allahu ka zgjedhur dhe urdhëruar; Mëshirën e Tij e ka lidhur me besimin dhe veprën e drejtë, dhe braktisja e tyre nuk është përulësi, por shkujdesje. Kuptimi i saktë është ai i përmasave: veprat tona, sado të shumta, nuk mund të shpërblejnë as një fraksion të bekimeve të Allahut ndaj nesh, e as të blejnë një përjetësi të Xhenetit. Pra, ne i ofrojmë veprat tona si shenjë dashurie dhe bindjeje, pastaj mbështetemi tërësisht në hirin e Tij për t'i pranuar dhe për të na pranuar.",
      "Shtrirja e asaj mëshirë është tronditëse. Profeti ﷺ tha se Allahu e ndau mëshirën në njëqind pjesë; Ai i zbriti vetëm një pjesë të vetme të gjithë krijimit - dhe nga ajo një pjesë nëna është e butë me fëmijën e saj dhe kafshët janë të buta me të vegjlit e tyre - ndërsa nëntëdhjetë e nëntë pjesët e mbetura Ai i mbajti pranë Vetes për t'ua dhuruar robërve të Tij në Ditën e Ringjalljes. Çfarëdo mëshirë që kemi parë ndonjëherë në këtë botë është një pjesë e një pjese të njëqind.",
      "Kjo është arsyeja pse besimtari i ekuilibruar jeton midis shpresës dhe frikës, si një zog që fluturon me dy krahë. Ai i frikësohet drejtësisë së Allahut aq sa të mos bëhet kurrë i vetëkënaqur apo i pamatur me mëkatin, dhe ai shpreson në mëshirën e Allahut aq sa të mos dëshpërohet, pavarësisht sa larg ka humbur. Animi tërësisht drejt frikës ngjall dëshpërim; animi tërësisht drejt shpresës ngjall arrogancë. Emrat e Allahut - Er-Rahman (Më i Mëshirshmi), Er-Rahim (Më i Mëshirshmi), Al-Ghafoor (Më falës) - ankorojnë krahun e shpresës.",
      "Pra, le të jetë kjo frymë në të cilën mbylleni çdo ditë: kërkoni Allahun për Firdewsin, bëni më të mirën tuaj të ndershme, pendohuni për të metat tuaja dhe pastaj dorëzojeni gradën tuaj të fundit tek Më i Drejti dhe Më i Mëshirshmi – duke besuar se Ai që mbajti nëntëdhjetë e nëntë pjesë të mëshirës për atë Ditë, nuk do ta largojë një rob që erdhi tek Ai duke u përpjekur dhe duke shpresuar.",
    ],
    quran: [
      {
        excerpt:
          "Dhe mëshira Ime përfshin çdo gjë. Kështu që unë do ta caktoj atë për ata që janë të devotshëm dhe japin zekatin dhe ata që besojnë në ajetet Tona.",
      },
      {
        excerpt:
          "Thuaj: O robërit e Mi që e keni ngarkuar me shumë gabime veten tuaj, mos e humbni shpresën ndaj mëshirës së Allahut. Vërtet, Allahu i fal të gjitha mëkatet.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Askush prej jush nuk do të hyjë në Xhenet vetëm me veprat e tij. Ata thanë: As ti o i Dërguar i Allahut? Ai tha: As mua, përveç nëse Allahu më mbështjell me mëshirën e Tij.",
      },
      {
        excerpt:
          "Allahu ka njëqind pjesë të mëshirës. Ai zbriti një pjesë mes xhinëve, njerëzve, kafshëve dhe insekteve, me të cilat ata janë të mëshirshëm ndaj njëri-tjetrit; dhe Ai mbajti me Vete nëntëdhjetë e nëntë pjesë, me të cilat do t'i mëshirojë robërit e Tij në Ditën e Kijametit.",
      },
    ],
    actions: [
      "Balanconi frikën ndaj Allahut me shpresën në mëshirën e Tij.",
      "Kurrë mos u dëshpëroni pas mëkatit - pendohuni dhe vazhdoni të përpiqeni.",
      "Kërkoni Allahun për El-Firdaws dhe një përfundim të mirë (husn al-khatimah).",
    ],
    appLinks: [{}, {}],
  },
];

export const JANNAH_GATES_SQ: DeepPartial<JannahGate>[] = [
  {
    name: "Porta e Namazit",
    deedSummary: "Për ata që ruanin dhe falnin pesë namazet ditore.",
    hadith: [
      {
        excerpt:
          "Kushdo që shpenzon një palë diçka në rrugë të Allahut do të thirret nga dyert e Xhenetit. Kushdo që ishte nga njerëzit e namazit do të thirret nga porta e namazit.",
      },
    ],
  },
  {
    name: "Porta e Bamirësisë",
    deedSummary: "Për ata që dhanë sadaka sinqerisht për hir të Allahut.",
    hadith: [
      {
        excerpt: "Kushdo që ishte nga njerëzit e bamirësisë do të thirret nga Porta e Bamirësisë.",
      },
    ],
  },
  {
    name: "Porta e Er-Rajjanit",
    deedSummary: "E rezervuar për ata që agjëruan - një portë vetëm ata hyjnë.",
    hadith: [
      {
        excerpt:
          "Në Xhenet është një portë e quajtur Er-Rajjan, nga e cila do të hyjnë vetëm agjëruesit në Ditën e Kijametit. Kur të ketë hyrë i fundit prej tyre, do të mbyllet.",
      },
    ],
  },
  {
    name: "Porta e Xhihadit",
    deedSummary: "Për ata që luftuan në rrugën e Allahut me sinqeritet.",
    hadith: [
      {
        excerpt: "Kushdo që ishte nga njerëzit e xhihadit do të thirret nga porta e xhihadit.",
      },
    ],
  },
  {
    name: "Shpërblimi i haxhit",
    deedSummary: "Për ata që e kryen Haxhin thjesht, duke u kthyer pa mëkat.",
    hadith: [
      {
        excerpt:
          "Kushdo që e kryen haxhin për hir të Allahut dhe nuk bën turp apo shkelje, kthehet pa mëkat, si ditën kur e lindi nëna e tij.",
      },
    ],
  },
  {
    name: "Thirret nga çdo portë",
    deedSummary: "Disa, si Ebu Bekri, do të thirren të hyjnë nga të gjitha portat.",
    hadith: [
      {
        excerpt:
          "Ebu Bekri pyeti: A do të thirret dikush nga të gjitha këto porta? Ai tha: Po, dhe shpresoj të jesh një prej tyre.",
      },
    ],
  },
];

export const JANNAH_VERSES_SQ: DeepPartial<JannahVerseEntry>[] = [
  {
    excerpt:
      "Vraponi drejt faljes nga Zoti juaj dhe një kopshti sa qiejt dhe toka, i përgatitur për të devotshmit.",
  },
  {
    excerpt:
      "Xhennete nëpër të cilat rrjedhin lumenj dhe vendbanime të këndshme në kopshte të vendbanimeve të përhershme, por kënaqësia e Allahut është më e madhe.",
  },
  {
    excerpt: "Kopshtet e strehimit si mikpritje për ata që besojnë dhe bëjnë vepra të mira.",
  },
  {
    excerpt: "Askush nuk e di se çfarë rehatie fshihet për ta si shpërblim për atë që kanë bërë.",
  },
  {
    excerpt: "Aty do të kenë çfarë të dëshirojnë, e tek Ne ka edhe më shumë.",
  },
  {
    excerpt: "Për të gjithë do të ketë gradë sipas asaj që ata bënë.",
  },
  {
    excerpt: "Ata janë gradat tek Allahu, dhe Allahu sheh atë që bëjnë ata.",
  },
  {
    excerpt:
      "Zoti ynë, na jep të mira në këtë botë dhe të mira në botën tjetër dhe na ruaj nga dënimi i zjarrit.",
  },
  {
    excerpt:
      "Mos e humbni shpresën nga mëshira e Allahut - me të vërtetë Allahu i fal të gjitha mëkatet.",
  },
  {
    excerpt: "Robërit e Mi – nuk do të ketë frikë për ju sot, as nuk do të pikëlloheni.",
  },
  {
    excerpt: "Dhe pararendësit, pararendësit - ata janë ata që u afruan.",
  },
  {
    excerpt:
      "Pra, Allahu do t'i mbrojë ata nga e keqja e asaj dite dhe do t'u japë shkëlqim dhe lumturi.",
  },
];

export const JANNAH_DUAS_SQ: DeepPartial<JannahDuaEntry>[] = [
  {
    context: "Dua gjithëpërfshirëse për të mirën në të dy botët dhe mbrojtjen nga zjarri.",
  },
  {
    context: "Një dua koncize pas teshehudit: kërkoni Xhenetin dhe strehimin nga zjarri.",
  },
  {
    context: "Kërkoni Xhenetin duke përdorur Emrat e bukur të Allahut pas teshehudit.",
  },
  {
    context: "Kërkoni ëmbëlsinë e shikimit të Allahut dhe dëshirës për ta takuar Atë.",
  },
];

export const JANNAH_PROMISED_SQ: DeepPartial<JannahPromisedEntry>[] = [
  {
    name: "Dhjetë Parajsa e Premtuar",
    summary:
      "Ebu Bekri, Umeri, Uthmani, Aliu, Talha, Zubejri, Abd-Rahman ibn Auf, Sa'di, Seid ibn Zejd dhe Ebu Ubejde (Allahu qoftë i kënaqur me ta).",
    note: "Emërtuar së bashku në një Hadith në Sunen el-Tirmidhi (3747, sahih).",
  },
  {
    name: "Të sinqertët dhe të duruarit",
    summary:
      "Allahu i lavdëron ata që janë të sinqertë në besim dhe të durueshëm në bindje dhe sprova.",
    note: "Shih Kur'anin 4:69 dhe shumë vargje mbi es-sadikin dhe es-sabirin.",
  },
  {
    name: "Dëshmorë në rrugën e Allahut",
    summary: "Ata që vdesin duke mbrojtur Islamin sipas ligjit Islami, përgëzohen për Xhenetin.",
    note: "Dijetarët e përkufizojnë shehadetin saktësisht; jo çdo vdekje në betejë kualifikohet automatikisht.",
  },
  {
    name: "Ata fjalët e fundit të të cilëve janë teuhidi",
    summary: "Fjalët e fundit të kujtdo që janë 'La ilahe illlah' do të hyjë në Xhenet.",
    note: "Sunen Ebu Davud 3116 (sahih). Një fund i mirë është një ndjekje e përjetshme.",
  },
  {
    name: "profetët",
    summary: "Çdo profet është në gradat më të larta të Xhenetit me urdhër të Allahut.",
    note: "Stacioni i tyre nuk arrihet me vepra të zakonshme - ata janë të zgjedhur dhe të mbrojtur.",
  },
];
