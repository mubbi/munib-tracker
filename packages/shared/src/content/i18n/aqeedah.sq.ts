// Albanian translation overlay for the Learn Aqeedah content. Mirrors the order of
// its English source in ../aqeedah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { AqeedahGlossaryTerm, AqeedahTopic } from "../../types/aqeedah";
import type { DeepPartial } from "./localize";

export const AQEDAH_TOPICS_SQ: DeepPartial<AqeedahTopic>[] = [
  {
    title: "Hyrje",
    summary: "Akideja është themeli i besimit që formon adhurimin, karakterin dhe qëllimin.",
    body: [
      "Fjala akide (عقيدة) vjen nga një rrënjë që do të thotë të lidhësh ose të lidhësh fort - është grupi i besimeve që një musliman mban me një siguri të tillë, saqë zemra është e lidhur me to, e patrazuar nga dyshimi. Në hadithin e famshëm të Xhibrilit, Profeti (a.s.) e përmblodhi atë në gjashtë besime: në Allahun, engjëjt e Tij, librat e Tij, të dërguarit e Tij, Ditën e Fundit dhe caktimin hyjnor (kadrin), të mirat dhe të hidhurat e tij.",
      "Për Ehl al-Suneh ue'l-Xhema'ah - trupi kryesor i muslimanëve sunitë - besimi është marrë fillimisht nga Kurani, pastaj Suneti autentik, i kuptuar në mënyrën e sahabëve të Profetit dhe brezave të hershëm (selefët). Aty ku përdoret intelekti, ai i shërben zbulesës në vend që ta mbizotërojë atë.",
      "Akideja nuk është një temë abstrakte e seminarit; është rrënja nga e cila rritet i gjithë adhurimi dhe karakteri. Besimet e një personi rreth asaj se kush është Allahu, pse u krijuan dhe ku po shkojnë, rregullojnë në heshtje mënyrën se si luten, si trajtojnë të tjerët dhe si përballen me vështirësitë dhe vdekjen.",
      "Besimi i drejtë e mban zemrën të ekuilibruar ndërmjet gjendjeve të mëdha të adhurimit - dashurisë dhe frikës, shpresës dhe frikës, mbështetjes dhe përpjekjes, mirënjohjes dhe pendimit - në mënyrë që një besimtar të mos dëshpërohet nga mëshira e Allahut dhe të mos ndihet i sigurt nga përgjegjësia e Tij.",
    ],
    quran: [
      {
        excerpt:
          "Drejtësia është që njeriu të besojë Allahun, Ditën e Fundit, engjëjt, Librin dhe profetët…",
      },
      {
        excerpt:
          "O ju që besuat, besoni Allahun, të Dërguarin e Tij, Librin që ia zbriti të Dërguarit të Tij dhe Librin që ia zbriti më parë.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Imani është të besosh Allahun, engjëjt e Tij, librat e Tij, të dërguarit e Tij, Ditën e Fundit dhe të besosh në caktimin hyjnor, të mirën dhe të hidhurin e tij. (Hadithi i Xhibrilit, i transmetuar nga Omeri)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Çfarë është Akideja?",
    summary: "Akideja nuk është një klasë filozofie; është besim i jetuar i rrënjosur në shpallje.",
    body: [
      "Akideja është ajo që zemra pohon me siguri dhe ajo që më pas tregon në adhurim dhe sjellje – jo thjesht një teori e mësuar përmendësh për debat. Kur'ani i përshkruan besimtarët e vendosur si ata që thonë për shpalljen: 'Ne besojmë në të; të gjitha janë nga Zoti ynë' (3:7): ata i nënshtrohen asaj që është e qartë dhe ia besojnë Allahut detajet e padukshme.",
      "Dijetarët e hershëm shkruan tekste koncize të besimit (siç është el-Akideh al-Tahawiyya) pikërisht për të ruajtur këtë qartësi - për të mbrojtur besimtarët e zakonshëm nga dy rreziqe: ekzagjerimi që i shton fesë dhe mohimi që heq atë që pohoi Allahu.",
      "Brenda Ehl al-Sunnetit ekzistojnë shkolla të njohura të teologjisë - më së shumti qasjet Ethari, Esh'ari dhe Maturidiu - të cilat pajtohen plotësisht mbi bazat e besimit, ndërsa ndryshojnë në disa metoda teknike të shprehjes së çështjeve të caktuara, veçanërisht atributeve hyjnore. Themeli i tyre i përbashkët është një dhe i fortë: Njëshmëria absolute e Allahut, vërtetësia e shpalljes së Tij dhe llogaridhënia e vërtetë në botën tjetër.",
      "Pra, akideja mësohet më së miri si besim i gjallë: çdo pikë e besimit lidhet me një mënyrë adhurimi, një mënyrë sjelljeje dhe një burim ngushëllimi.",
    ],
    quran: [
      {
        excerpt:
          "Dhe ata që janë të vendosur në dituri thonë: “Ne besojmë në të. E gjithë kjo është nga Zoti ynë.'",
      },
    ],
    actions: [
      "Mësoni akiden nga dijetarët e besueshëm dhe tekstet kryesore, jo nga debatet në mediat sociale.",
      "Për çdo besim që studioni, pyesni: si ndryshon kjo mënyrën se si adhuroj dhe jetoj?",
    ],
  },
  {
    title: "Pse ka rëndësi Akideja",
    summary: "Besimi i shëndoshë jep stabilitet shpirtëror dhe mbron nga ekstremet.",
    body: [
      "Kur besimi është i shëndoshë dhe i vendosur, veprat bëhen të sinqerta dhe të qëndrueshme; kur besimi është i lëkundur, adhurimi tenton të bëhet i paqëndrueshëm, thjesht emocional ose lehtësisht i tronditur nga dëshira dhe dyshimi. Allahu premton se Ai 'i mban të fortë ata që besuan me fjalë të qëndrueshme' - në këtë jetë dhe në momentin e tmerrshëm të varrit dhe në botën tjetër.",
      "Besimi i saktë është gjithashtu ajo që e çon një besimtar në të gjithë gamën e jetës: ajo i mëson durimtarëve besimin në caktimin e Allahut gjatë vështirësive, mirënjohjen e përulur në bekim dhe sigurinë e qetë përballë pasigurisë dhe vdekjes. Një person që beson me të vërtetë në kadr dhe në botën tjetër nuk shembet kur sprovohet.",
      "Së fundi, akideja e shëndoshë mëson adabin - sjelljen e mirë - në mosmarrëveshje: mbajtjen e vendosur pas bazave të qarta duke treguar respekt dhe përmbajtje në çështjet dytësore ku dijetarët e sinqertë kanë qenë prej kohësh të ndryshëm. Njohja e besimit duhet të rrisë përulësinë dhe mëshirën, kurrë arrogancën.",
    ],
    quran: [
      {
        excerpt:
          "Allahu i forcon ata që besuan me fjalë të qëndrueshme në këtë botë dhe në botën tjetër.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Jini të etur për atë që ju sjell dobi, kërkoni ndihmë nga Allahu dhe mos jini të pafuqishëm… (Ebu Hurejre)",
      },
    ],
  },
  {
    title: "Gjashtë nenet e imanit",
    summary: "Profeti ﷺ e përmblodhi imanin në gjashtë besime themelore.",
    body: [
      "Gjashtë artikujt vijnë nga Hadithi i Xhibrilit, një nga hadithet më të rëndësishme në Islami. Engjëlli Xhibril erdhi në formën e një njeriu dhe e pyeti Profetin ﷺ para sahabëve për Islamin, imanin dhe ihsanin. Kur ai pyeti për imanin, Profeti (a.s.) u përgjigj me këto gjashtë besime - dhe Xhibrili e konfirmoi atë, pastaj u largua, pasi erdhi për t'u mësuar njerëzve fenë e tyre.",
      "Të gjashtë janë: besimi në Allahun; në engjëjt e Tij; në librat e Tij të shpallur; në të dërguarit e Tij; në Ditën e Fundit; dhe në caktimin hyjnor (kadr), të mirat dhe të hidhurat e tij. Të refuzosh ndonjërin prej tyre do të thotë të biesh jashtë imanit të vërtetë, sepse ato janë një pëlhurë e vetme.",
      "Ato janë gjithashtu thellësisht të ndërlidhura. Besimi në librat dhe të dërguarit shpie në njohjen e Ditës së Fundit dhe llogarisë; besimi në Ditën e Fundit i jep peshë çdo vepre; dhe besimi në kadrin mëson besimin në Allahun dhe përuljen para urtësisë së Tij. Mësimi i tyre në mënyrë të rregullt ndërton një botëkuptim të qartë dhe të ekuilibruar.",
    ],
    hadith: [
      {
        excerpt:
          "…Të besoni Allahun, engjëjt e Tij, librat e Tij, të dërguarit e Tij, Ditën e Fundit dhe të besoni vendimin, të mirat dhe të hidhurat e tij. (Hadithi i Xhibrilit)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Besimi në Allahun",
    summary:
      "Besimi në Allahun përfshin zotërimin e Tij, të drejtën e Tij të vetme për adhurim dhe emrat dhe cilësitë e Tij.",
    body: [
      "Besimi në Allahun është më i madhi nga të gjitha besimet dhe rrënja e të tjerave. Fillon me siguri se vetëm Ai është Krijuesi, Pronari dhe Mbështetësi i çdo gjëje - i vetmi Zot i vërtetë, pa partner, pa të barabartë dhe pa nevojë për asnjë prej krijimit të Tij.",
      "Nga kjo rrjedh se vetëm Ai e meriton adhurimin në çdo formë: lutja, lutja, shpresa, frika, mbështetja, dashuria në kuptimin e saj më të lartë, sakrifica dhe zotimet janë të gjitha të drejta të Allahut që nuk mund t'i drejtohen askujt përveç Tij. Ky është kuptimi i dëshmisë 'nuk ka zot tjetër përveç Allahut'.",
      'Ehli Suneti pohojnë emrat e bukur dhe cilësitë e larta që Allahu i pohoi për Veten e Tij dhe që i Dërguari i Tij ﷺ i pohoi për Të, në një mënyrë që i përshtatet madhështisë së Tij - pa e krahasuar Atë me krijimin e Tij (tamthil) dhe pa mohuar apo zbrazur cilësitë e Tij kuptimore (ta\'til). Ajeti udhëzues është: "Asgjë nuk i ngjan Atij, dhe Ai është Gjithëdëgjuesi, Gjithëshikuesi" (42:11) - që edhe mohon ngjashmërinë dhe pohon dëgjimin dhe shikimin e Tij.',
      "Njohja e Allahut me emrat e Tij - Mëshiruesi, i Gjithëdijshmi, i Gjallit, Mbretit, Falës - është ushqimi i zemrës: sa më shumë ta njihni Atë, aq më shumë e doni, frikësoheni dhe drejtoheni tek Ai.",
    ],
    quran: [
      {
        excerpt:
          "Thuaj: Ai është Allahu, Një... Ai as nuk lind, as nuk lind dhe nuk ka asnjë të krahasueshëm me Të.",
      },
      {
        excerpt: "E Allahut i përkasin emrat më të bukur, andaj thirreni Atë me ta.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Besimi tek Engjëjt",
    summary:
      "Engjëjt janë robër të nderuar, të padukshëm të Allahut, të cilët kurrë nuk e kundërshtojnë Atë.",
    body: [
      "Engjëjt (mala'ikah) janë një krijesë e madhe e krijuar nga drita. Ata nuk kanë vullnet të lirë për të mos iu bindur: ata e adhurojnë Allahun vazhdimisht dhe e zbatojnë çdo urdhër të Tij në mënyrë të përsosur, 'duke mos e kundërshtuar Allahun në atë që Ai i urdhëron dhe duke bërë atë që urdhërohen'.",
      "Të besosh në to do të thotë të besosh se bota e padukshme është reale dhe aktive rreth nesh. Engjëjt sjellin shpallje, ruajnë qeniet njerëzore, regjistrojnë çdo fjalë dhe vepër, marrin shpirtrat pas vdekjes dhe menaxhojnë punët e tokës dhe të qiejve me lejen e Allahut - kështu që një besimtar nuk është kurrë i vetëm apo i pavëzhguar.",
      "Në tekste përmenden disa me role specifike: Xhibrili, engjëlli i shpalljes; Mika'il, të cilit i është besuar shiu dhe furnizimi; Israfili, i cili do t'i fryjë Surit; Malak al-Mawt, engjëlli i vdekjes; dhe skribët fisnikë (Kiraman Katibin) të cilët regjistrojnë veprat e secilit person. Munkar dhe Nakir e pyesin të ndjerin në varr.",
    ],
    quran: [
      {
        excerpt:
          "Mbi të janë engjëj, të ashpër dhe të ashpër, të cilët nuk e kundërshtojnë Allahun në atë që Ai urdhëron dhe bëjnë atë që urdhërohen.",
      },
      {
        excerpt:
          "Thuaj: Kushdo që është armik i Xhibrilit, ai me lejen e Allahut e ka zbritur atë në zemrën tuaj.",
      },
    ],
    actions: [
      "Jetoni me vetëdijen se engjëjve të regjistrimit nuk u mungon kurrë asnjë fjalë apo vepër.",
    ],
  },
  {
    title: "Besimi në Librat Hyjnorë",
    summary:
      "Allahu dërgoi shkrimet si udhërrëfyes; Kurani i konfirmon ato dhe qëndron si kriteri përfundimtar.",
    body: [
      "Myslimanët besojnë se Allahu ua shpalli shkrimet të dërguarve të Tij si udhëzim dhe mëshirë. Kurani përmend disa: Suhufi i Ibrahimit dhe Musait, Tevrahu i dhënë Musait, Zaburi Davudit, Inxhili i Isait dhe së fundi Kurani Muhamedit ﷺ - të besuar në tërësi, në formën e tyre origjinale të shpallur.",
      "Kurani mban një gradë unike. Është shpallja përfundimtare, e dërguar 'duke vërtetuar atë që i ka ardhur dhe si kriter mbi të' (5:48) - që do të thotë se gjykon dhe korrigjon, pasi shkrimet e mëparshme nuk mbetën në gjendjen e tyre origjinale, por u ndryshuan (tahrif) dhe humbën brez pas brezi.",
      "Në mënyrë unike në mesin e të gjitha shkrimeve, Kur'ani është i mbrojtur në mënyrë hyjnore nga prishja: \"Në të vërtetë, Ne e zbritëm Përkujtimin dhe me të vërtetë, Ne jemi Ruajtësit e tij\" (15:9). Prandaj, të besosh në libra do të thotë të nderosh shpalljen, të lexosh Kur'anin me reflektim dhe t'i nënshtrohesh udhëzimit të tij në jetë.",
    ],
    quran: [
      {
        excerpt:
          "Dhe Ne të shpallëm ty Librin me të vërtetën, që vërteton atë që ishte para tij nga Libri dhe si kriter mbi të.",
      },
      {
        excerpt: "Vërtet, Ne e kemi zbritur Përkujtimin dhe Ne do të jemi mbrojtës i saj.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Besimi në Profetët",
    summary:
      "Të gjithë profetët përcillnin të njëjtën të vërtetë thelbësore; Muhamedi a.s është i dërguari i fundit.",
    body: [
      "Një musliman beson në të gjithë pejgamberët dhe të dërguarit e dërguar nga Allahu, duke mos refuzuar asnjërin prej tyre. Nga Ademi e deri te Nuhu, Ibrahimi, Musai dhe Isai e deri te Muhamedi salAllahu alejhi ue selem, të gjithë thirrën në të njëjtin mesazh thelbësor: adhuroni vetëm Allahun dhe jetoni të drejtë. Njëzet e pesë janë përmendur në Kur'an; numri i përgjithshëm i tyre është i njohur vetëm për Allahun.",
      "Profetët janë krijesat më të mira në vërtetësi dhe besueshmëri, të mbrojtur nga Allahu nga gënjeshtra për mesazhin dhe nga mëkati i madh – megjithatë ata mbeten qenie njerëzore, jo hyjnore dhe nuk duhet të adhurohen kurrë. Pesë janë veçuar si të dërguarit 'të vendosur' (ulu al-'azm): Nuh, Ibrahim, Musa, 'Isa dhe Muhamed ﷺ.",
      "Muhamedi ﷺ është vula e profetëve (khatam en-nebiyyin): asnjë profet nuk vjen pas tij dhe mesazhi i tij është universal - dërguar mbarë njerëzimit deri në Ditën e Gjykimit. Të besosh në të përfshin ta duash atë, t'i bindesh urdhrave të tij, t'i besosh raportet e tij dhe të adhurosh vetëm në mënyrën se si ai mësoi.",
    ],
    quran: [
      {
        excerpt: "…Ne nuk bëjmë dallim ndërmjet asnjë prej të dërguarve të Tij…",
      },
      {
        excerpt:
          "Muhamedi nuk është babai i asnjërit prej burrave tuaj, por i Dërguari i Allahut dhe vula e profetëve.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Besimi në Ditën e Fundit",
    summary:
      "Jeta çon në një takim përfundimtar me Allahun, drejtësi të përsosur dhe rezultate të përjetshme.",
    body: [
      "Besimi në Ditën e Fundit është besimi në çdo gjë që pason vdekjen: pyetjen dhe jetën e varrit (berzahut), fryrjen e Surit, ringjalljen e të gjithë njerëzve, tubimin e madh, llogaritjen, peshimin e veprave në peshore, kalimin e urës dhe dy vendbanimet e përjetshme - Xhenetin dhe Xhehenemin.",
      'Ky besim i jep peshë morale çdo momenti. Për shkak se Allahu sheh të fshehtën dhe shënon veprën më të vogël, asgjë e mirë nuk humbet kurrë dhe asgjë e keqe nuk anashkalohet: "Kushdo që bën të mirën sa një grimcë do ta shohë atë, dhe kushdo që bën të keqen sa një grimcë do ta shohë atë."',
      "Ehli Suneti i pohon të gjitha këto realitete me siguri, duke i besuar saktësisht ashtu siç janë raportuar, ndërkohë që pranojnë se dijetarët ndryshojnë në interpretimin e disa detajeve më të imta të ngjarjeve dhe shenjave specifike. Qëllimi i besimit nuk është spekulimi, por përgatitja.",
    ],
    quran: [
      {
        excerpt:
          "…Pra, kushdo që bën të mirën sa një atom do ta shohë atë, dhe kushdo që bën të keqen sa një atom do ta shohë atë.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Besimi në Kadr (Dekreti Hyjnor)",
    summary:
      "Dituria dhe vendimi i Allahut janë të plota – megjithatë njerëzit me të vërtetë zgjedhin dhe janë përgjegjës.",
    body: [
      "Besimi në kadr shpesh përmblidhet në katër nivele: se Allahu i di përjetësisht çdo gjë; se Ai i shkroi të gjitha në Tabelën e Ruajtur pesëdhjetë mijë vjet përpara krijimit; se asgjë nuk ndodh veçse me vullnetin e Tij; dhe se Ai është Krijuesi i gjithçkaje që ekziston, duke përfshirë veprimet e robërve të Tij.",
      "Në të njëjtën kohë, qeniet njerëzore kanë një vullnet të vërtetë dhe një zgjedhje të vërtetë brenda asaj që lejon Allahu – pikërisht përse urdhërimet dhe ndalesat, shpërblimi dhe ndëshkimi, janë të drejta dhe kuptimplota. Një person zgjedh të lutet ose të gënjejë dhe me të drejtë mbahet përgjegjës; Njohuria paraprake e Allahut për zgjedhjen nuk e detyron atë.",
      "Ehli Suneti udhëhiqet ndërmjet dy gabimeve: mohimit të vendimit (sikur ngjarjet i shmangen diturisë dhe vullnetit të Allahut) dhe fatalizmit (përdorimi i dekretit për të hequr përgjegjësinë njerëzore dhe për të shfajësuar mëkatin). Besimtari i merr mjetet me përsosmëri, pastaj ia beson përfundimin Allahut.",
      "Praktikisht, kadri është burimi i madh i paqes: pasi të bësh pjesën tënde, ti pushon në dijeninë se çfarëdo që të arrin nuk mund të të mungonte kurrë dhe çfarëdo që të mungonte kurrë nuk mund të kishe arritur.",
    ],
    hadith: [
      {
        excerpt:
          "…Nëse të godet diçka, mos thuaj 'sikur ta kisha bërë këtë', por thuaj 'Allahu e ka caktuar dhe e ka bërë atë që ka dashur', sepse 'sikur vetëm' ia hap derën shejtanit. (Ebu Hurejre)",
      },
    ],
    quran: [
      {
        excerpt: "Vërtet, Ne krijuam çdo gjë sipas një mase (kader).",
      },
      {
        excerpt:
          "Vërtet, Allahu nuk e ndryshon gjendjen e një populli derisa ata të ndryshojnë atë që kanë në vetvete.",
      },
    ],
    misconceptions: [
      "Keqkuptim: Nëse gjithçka dekretohet, përpjekja është e kotë. Korrigjimi: Islami urdhëron përpjekje, planifikim, lutje dhe pendim – marrja e mjeteve është në vetvete pjesë e dekretit.",
      "Keqkuptim: Kadr do të thotë se Allahu është fajtor për mëkatin tim. Korrigjimi: Shërbëtori zgjedh dhe është përgjegjës; dekreti nuk është kurrë një justifikim për mosbindje.",
      "Keqkuptim: Vështirësia vërteton se Allahu është i pakënaqur me mua. Korrigjim: Sprovat mund të jenë pastrim, ngritje në gradë, një paralajmërim ose një thirrje për t'u kthyer - shpesh një shenjë kujdesi, jo zemërimi.",
    ],
    actions: [
      "Merr mjetet me përsosmëri, pastaj mbështetu në caktimin e Allahut.",
      "Zëvendësoni 'nëse vetëm…' lakimet e keqardhjes me 'Kaddar Allah' dhe një hap tjetër konstruktiv.",
    ],
  },
  {
    title: "Teuhidi i shpjeguar",
    summary:
      "Teuhidi bashkon zotërimin e Allahut, të drejtën e Tij të vetme për adhurim dhe emrat dhe cilësitë e Tij.",
    body: [
      "Teuhidi (توحيد) - njëshmëria absolute e Allahut - është zemra e Islamit dhe mesazhi i çdo profeti. Do të thotë të veçosh vetëm Allahun në çdo gjë që është unike e Tij dhe të pohosh përsosmërinë e Tij pikërisht ashtu siç e përshkroi Ai Veten.",
      "Dijetarët zakonisht e mësojnë teuhidin përmes tre aspekteve të ndërlidhura për ta bërë të lehtë për t'u kuptuar dhe mbrojtur. Teuhid el-Rububijeh: vetëm Allahu krijon, zotëron dhe kontrollon të gjitha gjërat. Teuhidul Uluhijeh: se vetëm Allahu e meriton të gjithë adhurimin - ky është aspekti që të dërguarit më së shumti theksuan dhe jobesimtarët më së shumti kundërshtuan. Teuhid el-Esma uel-Sifat: pohimi i emrave dhe cilësive të Allahut ashtu siç janë shpallur, pa shtrembërim, mohim apo përngjasim.",
      'Kjo kornizë me tre pjesë është një mjet mësimor, jo një burim ndarjeje; qëllimi i tij është të ndihmojë një besimtar të ruajë sinqeritetin dhe të kuptojë se ku mund të cenohet njëshmëria. E gjithë kjo është fiksuar në lutjen hyrëse të çdo muslimani: "Vetëm Ty të adhurojmë dhe vetëm Ty të kërkojmë ndihmë".',
      "Një pasqyrë thelbësore: të pranosh se Allahu është Krijuesi (rububijah) nuk mjafton më vete. Shumë nga ata që i mohuan profetët pranuan se Allahu krijoi qiejt dhe tokën – ajo që ata refuzuan ishte të adhuronin vetëm Atë (uluhije). Teuhidi i vërtetë vërtetohet në adhurim, jo ​​vetëm në besimin për origjinën.",
    ],
    quran: [
      {
        excerpt: "Vetëm Ty të adhurojmë dhe vetëm Ty ndihmë kërkojmë.",
      },
      {
        excerpt: "Allahu - nuk ka zot tjetër përveç Tij. Atij i përkasin emrat më të bukur.",
      },
    ],
    misconceptions: [
      "Keqkuptim: Teuhidi është vetëm të thuash një fjali. Korrigjimi: Është një besim i zemrës, një deklaratë e gjuhës dhe një realitet i jetuar në adhurim.",
      "Keqkuptim: Të besosh se Allahu është Krijuesi është i tërë teuhidi. Korrigjim: Madje edhe shumë jobesimtarë pohuan se - sprova është adhurimi i vetëm Allahut.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shirku i shpjeguar",
    summary:
      "Shirku është drejtimi i çdo të drejte ekskluzive të Allahut ndaj diçkaje tjetër përveç Tij.",
    body: [
      "Shirku (شرك) - t'i bësh shok Allahut - është e kundërta e teuhidit dhe një mëkat që Kur'ani e veçon si të pafalshëm nëse njeriu vdes mbi të pa u penduar: 'Allahu nuk fal që t'i bëhet shok Atij, por fal asgjë më pak se ai kujt të dojë.'",
      "Shirku i madh (el-shirk al-ekber) është të drejtosh një akt adhurimi ndaj dikujt tjetër përveç Allahut - thirrja e të vdekurve ose atyre që mungojnë për atë që vetëm Allahu mund të japë, sakrifikimi ose dhënia e betimit për qeniet e krijuara, ose dashuria dhe bindja e diçkaje siç duhet ta dojë dhe t'i bindet Allahut. Ai e nxjerr një person jashtë Islamit nëse ai vdes pas tij i papenduar.",
      "Shirku i vogël (el-shirk al-asghar) nuk përjashton nga Islami, por është shumë i rrezikshëm dhe mund të anulojë shpërblimin e veprave. Forma e tij më e qartë është rija – kryerja e adhurimit për t’u parë dhe për t’u lavdëruar nga njerëzit – të cilën Profeti ﷺ e quajti gjëja që i frikësohej më shumë për komunitetin e tij. Betimi në dikë tjetër përveç Allahut në një mënyrë që e lartëson bie edhe këtu.",
      "Ehli Suneti janë të kujdesshëm me gjuhën dhe gjykimin: paralajmërimi ndaj shirkut në përgjithësi është thelbësor dhe i qartë, por shpallja e një individi të caktuar si mushrik ose mosbesimtar (tekfir) është një çështje me peshë që kërkon njohuri, dëshmi të vlefshme dhe heqje të arsyetimeve - i përket dijetarëve të kualifikuar, jo njerëzve të zakonshëm apo argumenteve në internet.",
    ],
    quran: [
      {
        excerpt: "Vërtet, Allahu nuk ia fal shoqërinë Atij, por më pak se kaq ia fal kujt të dojë.",
      },
      {
        excerpt:
          "O biri im, mos i bëj shok Allahut. Vërtet shoqërimi është një padrejtësi e madhe (zulm).",
      },
    ],
    hadith: [
      {
        excerpt:
          "Gjëja që kam më shumë frikë për ju është shirku i vogël. I pyetur se çfarë ishte, ai (ﷺ) tha: duke u dukur (riya). (Mahmud ibn Labid)",
      },
    ],
    misconceptions: [
      "Keqkuptim: Çdo rrëshqitje e gjuhës është shirk i madh. Korrigjimi: Dijetarët dallojnë madhoren nga e vogla dhe gjykojnë çdo rast me kujdes me prova.",
      "Keqkuptim: Paralajmërimi ndaj shirkut kërkon ashpërsi ndaj njerëzve. Korrigjimi: Mënyra profetike bashkon qartësinë e së vërtetës me mëshirën dhe mësimin e durueshëm.",
    ],
  },
  {
    title: "Sinqeriteti (Ikhlas)",
    summary: "Veprat pranohen vetëm kur bëhen vetëm për Allahun.",
    body: [
      'Ikhlas (إخلاص) është të kërkosh vetëm kënaqësinë e Allahut përmes një veprimi – jo statusin, lavdërimin, pasurinë ose ndikimin mbi njerëzit. Është kushti i brendshëm nga i cili varet pranimi i çdo vepre: Profeti (sal-lAllahu alejhi ue sel-lem) mësoi se "veprimet janë vetëm nga qëllimet, dhe çdo njeri do të ketë vetëm atë që ka për qëllim".',
      "Për shkak se shpërblimi varet nga qëllimi, një vepër e vogël dhe e qetë e bërë me sinqeritet për Allahun mund të jetë më e madhe se një vepër e madhe publike e kryer për reputacion. I njëjti veprim i jashtëm - dhënia e lëmoshës, lutja, mësimi - mund të jetë adhurim ose zbrazëti në varësi të zemrës që qëndron pas tij.",
      "Sinqeriteti nuk arrihet një herë, por rinovohet vazhdimisht, sepse vetvetja është e prirur për të kërkuar vëmendje. Prandaj, besimtarët vazhdimisht e pastrojnë qëllimin e tyre dhe i lusin Allahut që t'i mbrojë ata nga shirku i fshehtë i rijasë dhe nga vetëmashtrimi.",
    ],
    quran: [
      {
        excerpt:
          "Dhe ata nuk u urdhëruan vetëm që të adhurojnë Allahun, të sinqertë ndaj Tij në fe.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Veprimet janë vetëm nga qëllimet, dhe çdo njeri do të ketë vetëm atë që ka menduar. (Omer ibn el-Hattab)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Dashuria dhe Frika ndaj Allahut",
    summary:
      "Një zemër e shëndoshë e adhuron Allahun në krahët e dashurisë, shpresës dhe frikës nderuese.",
    body: [
      "Adhurimi i zemrës mbështetet në tri gjendje madhështore: dashuria (mahabbah), shpresa (raja') dhe frika nderuese (khawf). Dashuria për Allahun është themeli dhe forca lëvizëse e çdo adhurimi - besimtarët janë 'më të fortë në dashurinë për Allahun' se çdo gjë tjetër - ndërsa frika e mospëlqimit të Tij e frenon shpirtin nga mëkati dhe shkujdesja.",
      'Ehli Suneti mëson se këta duhet të qëndrojnë në ekuilibër, si një zog që fluturon me dy krahë dhe një kokë. Dashuria dhe shpresa pa frikë mund të shkojnë drejt pakujdesisë dhe marrjes së mëshirës së Allahut si të mirëqenë; frika pa shpresë mund të shembet në dëshpërim. Kur\'ani u bashkon atyre: "Luteni Atë me frikë dhe shpresë".',
      "Ky ekuilibër nuk është thjesht një ndjenjë; shfaqet në veprim - në ruajtjen e namazit, nxitimin për t'u penduar, për t'u shërbyer të tjerëve, për të frenuar zemërimin dhe për të qëndruar i durueshëm në vështirësi nga dashuria për Atë që e ka caktuar atë.",
    ],
    quran: [
      {
        excerpt: "…Por ata që besojnë janë më të fortë në dashurinë për Allahun.",
      },
      {
        excerpt:
          "…Dhe thirreni Atë me frikë dhe shpresë. Vërtet, mëshira e Allahut është afër mirëbërësve.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shpresa dhe Pendimi",
    summary:
      "Asnjë mëkat nuk është shumë i madh për pendimin e sinqertë dhe shpresën në mëshirën e madhe të Allahut.",
    body: [
      "Një besim përcaktues i Ehli Sunetit është se një person kurrë nuk duhet të dëshpërohet nga mëshira e Allahut, sado të mëdha të jenë mëkatet e tyre, dhe kurrë nuk duhet të ndihet i sigurt nga përgjegjësia e Tij, sado të jenë veprat e tij të mira. Si shpresa ashtu edhe vetë-korrigjimi përshkojnë vazhdimisht jetën e një besimtari.",
      "Ftesa e Allahut është bujare që të lë pa frymë: “Thuaj: O robërit e Mi që e keni ngarkuar me shumë gabime veten tuaj, mos e humbni shpresën ndaj mëshirës së Allahut. Vërtet, Allahu i fal të gjitha mëkatet.' Dera e pendimit (teube) qëndron e hapur derisa të lind dielli nga perëndimi ose të afrohet vdekja e vetë individit.",
      "Pendimi i sinqertë ka kushte të qarta: lënien e mëkatit menjëherë, ndjejnë keqardhje të sinqertë për të dhe vendosmëri për të mos u kthyer më - dhe, kur mëkati përfshin të drejtat e një personi tjetër, rivendosjen e atyre të drejtave ose kërkimin e faljes. Kur këto plotësohen, përgjigja e Allahut nuk është thjesht pranim, por gëzim: Ai është 'më i kënaqur me pendimin e robit të Tij' se sa një njeri që rimerr malin e humbur dhe furnizimet në një shkretëtirë djerrë.",
    ],
    quran: [
      {
        excerpt:
          "Thuaj: O robërit e Mi që e keni ngarkuar me shumë gabime veten tuaj, mos e humbni shpresën ndaj mëshirës së Allahut. Vërtet, Allahu i fal të gjitha mëkatet.",
      },
      {
        excerpt: "O ju që besuat, kthehuni tek Allahu me një pendim të sinqertë.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allahu është më i kënaqur me pendimin e robit të Tij se sa një njeri që humbet malin e tij, duke mbajtur ushqimin dhe pijen e tij, në një tokë djerrë - pastaj e gjen përsëri. (Ibn Mesudi)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Parajsa (Xheneti)",
    summary:
      "Xheneti është shpërblimi i përjetshëm që Allahu ka përgatitur për besimtarët me mëshirën e Tij.",
    body: [
      'Parajsa është e vërtetë, e përjetshme dhe përtej çdo gjëje që mendja njerëzore mund ta imagjinojë. Profeti ﷺ përcolli fjalët e Allahut: "Unë kam përgatitur për robërit e Mi të mirë atë që nuk e ka parë syri, veshi nuk ka dëgjuar dhe asnjë zemër nuk e ka ngjizur". Shpërblimi i tij më i lartë nga të gjithë është kënaqësia e Allahut dhe vizioni i Fytyrës së Tij.',
      "Hyrja në Xhenet është në fund të fundit me mëshirën e Allahut – vetëm veprat e askujt nuk mund të fitojnë lumturinë e përjetshme – megjithatë besimi i sinqertë dhe veprat e drejta janë mjetet që Allahu ka caktuar dhe pranuar. Të dyja nuk janë në konflikt: mëshira është shkaku, dhe besimi dhe veprat janë rruga që Ai i hapi asaj.",
      "Besimi në Parajsë riformëson mënyrën se si një person jeton tani: ai ushqen durimin përmes vështirësive, bujarinë me pasuri dhe këmbënguljen në adhurim, sepse besimtari po e shkëmben një botë kalimtare për një shtëpi të përjetshme. Kur'ani na thërret të 'garojmë' drejt tij.",
    ],
    quran: [
      {
        excerpt:
          "Dhe nxitoni në faljen e Zotit tuaj dhe një Xhenet të gjerë sa qiejt dhe toka, i përgatitur për të devotshmit.",
      },
    ],
    hadith: [
      {
        excerpt:
          'Allahu tha: "Unë kam përgatitur për robërit e Mi të mirë atë që nuk e ka parë syri, nuk e ka dëgjuar veshi dhe nuk e ka ngjizur zemra e njeriut". (Ebu Hurejre; gjithashtu Sahih Mysliman 2824)',
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ferri (Jahannam)",
    summary:
      "Xhehenemi është një paralajmërim i vërtetë, me qëllim që t'i kthejë zemrat tek Allahu para se të jetë tepër vonë.",
    body: [
      "Besimi në Ferr (Xhehenem) është pjesë e besimit në të padukshmen dhe në drejtësinë e përsosur të Allahut. Është një vendbanim i vërtetë ndëshkimi, i përshkruar me fjalë të gjalla në Kur'an dhe Sunet, në mënyrë që njerëzit ta marrin seriozisht rrezikun.",
      "Paralajmërimet i shërbejnë një qëllimi të mëshirshëm: ato ekzistojnë për të mbrojtur njerëzit nga vetë rezultati që përshkruajnë - për të kontrolluar arrogancën, shtypjen dhe këmbënguljen, duke ditur refuzimin e së vërtetës, dhe për të nxitur të shkujdesurit të pendohen ndërsa dera është e hapur.",
      "Ehli Suneti i mbajë së bashku paralajmërimet dhe mëshirën. Kërcënimet janë të rënda dhe reale, megjithatë mëshira e Allahut mbetet e madhe për këdo që kthehet tek Ai - dhe në mesin e njerëzve të teuhidit, mëkatarët që hyjnë në zjarr nuk do të qëndrojnë përgjithmonë atje, por përfundimisht do të nxirren jashtë me mëshirën e Allahut dhe ndërmjetësimin që Ai lejon.",
    ],
    quran: [
      {
        excerpt:
          "O ju që besuat, ruani veten dhe familjen tuaj nga zjarri, lënda djegëse e të cilit janë njerëzit dhe gurët.",
      },
      {
        excerpt:
          "…Mos e humbni shpresën nga mëshira e Allahut. Vërtet, Allahu i fal të gjitha mëkatet.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ringjallja",
    summary:
      "Pas vdekjes, të gjithë njerëzit do të ngrihen trupërisht për të qëndruar para Allahut.",
    body: [
      "Ringjallja (el-ba'th) është trupore dhe reale, jo simbol apo metaforë. Allahu u përgjigjet atyre që dyshojnë se kockat e kalbura mund të jetojnë përsëri me logjikën më të thjeshtë: Ai që i krijoi ato nga hiçi herën e parë, me siguri mund t'i rivendosë ato - dhe rikrijimi është, për të kuptuarit tonë, më i lehtë sesa lindja.",
      "Midis vdekjes dhe ringjalljes qëndron berzahu - jeta e ndërmjetme e varrit, me pyetjen dhe lehtësinë ose vështirësinë e tij. Pastaj i fryhet Surit dhe i gjithë krijimi ngrihet dhe mblidhet para Allahut për llogari.",
      "Ky besim është ajo që i jep jetës njerëzore seriozitetin e saj moral: pa ringjallje, shtypësi që vdes rehat dhe i shtypuri që vdes i padrejtë do të kishin të njëjtin fund. Me të, çdo gabim përgjigjet dhe çdo e mirë shpërblehet, duke i dhënë kuptim durimit dhe drejtësisë.",
    ],
    quran: [
      {
        excerpt:
          'Ai thotë: "Kush do t\'i japë jetë kockave derisa ato janë të kalbura?" Thuaj: "Do t\'u japë jetë Ai që i krijoi herën e parë..."',
      },
      {
        excerpt:
          "Dhe me të vërtetë, kijameti po vjen - pa dyshim në të - dhe Allahu do t'i ringjallë ata që janë në varre.",
      },
    ],
  },
  {
    title: "Dita e Gjykimit",
    summary: "Çdo shpirt qëndron para Allahut; Drejtësia e tij është e përsosur dhe e plotë.",
    body: [
      'Në Ditën e Gjykimit, çdo njeri mbahet në llogari - për veprat dhe qëllimet, për të drejtat e Allahut dhe të drejtat e njerëzve të tjerë - me një drejtësi kaq të saktë sa që "asnjë shpirti nuk do t\'i bëhet kurrfarë padrejtësie", qoftë edhe pesha e një atomi.',
      "Atë Ditë, asnjë prejardhje, pasuri, klasë, kombësi apo gradë botërore nuk do t'i bëjë dobi askujt; do të bëjë dobi vetëm besimi i sinqertë dhe vepra e drejtë, e pranuar nga Allahu. Shpërndahen të dhënat, peshohen veprat, madje edhe gabimet e bëra ndërmjet njerëzve zgjidhen duke transferuar vepra të mira dhe të këqija.",
      "Kjo siguri ka për qëllim të transformojë karakterin tani: ajo e thërret besimtarin në ndershmëri, besueshmëri, ruajtjen e të drejtave të të tjerëve dhe riparimin e gabimeve dhe kthimin e asaj që i detyrohet para Ditës kur borxhet paguhen me vepra dhe jo me para.",
    ],
    quran: [
      {
        excerpt:
          "Dhe Ne e vendosim peshoren e drejtësisë për Ditën e Kijametit, kështu që askush nuk do të trajtohet fare i padrejtë.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Peshorja dhe Sirati",
    summary: "Veprat peshohen në Mizan dhe njerëzit kalojnë Siratin me besimin dhe veprat e tyre.",
    body: [
      "Ehli Sunneti pohojnë Mizanin (peshoren) dhe Siratin (Urën mbi Xhehenem) si ngjarje reale të Ahiretit, të besuara saktësisht siç raportohet. Në peshore, veprat dhe vepruesit e tyre peshohen me drejtësi të plotë: \"Sa i përket atij që peshon i rëndë, ai do të jetë në një jetë të këndshme; e sa për atë që ka peshoret e lehta, streha e tij do të jetë një humnerë.'",
      'Sirat është një urë e shtrirë mbi Ferr që të gjithë duhet të kalojnë. Kur\'ani thotë: "Nuk ka asnjë prej jush që të mos kalojë mbi të", pastaj "Ne do t\'i shpëtojmë ata që e përkujtuan Allahun". Njerëzit kalojnë sipas veprave të tyre - disa të shpejtë si drita apo era, të tjerët duke luftuar dhe disa duke rrëshqitur - me mëshirën dhe drejtësinë e Allahut.',
      "Këto realitete nuk u thuhet për të frikësuar kot, por për të kultivuar seriozitetin: për peshën e veprave të vogla, për sinqeritetin e adhurimit dhe për nderimin e të drejtave të të tjerëve, pasi e gjithë kjo do të peshohet.",
    ],
    quran: [
      {
        excerpt:
          "Pastaj, sa i përket atij që peshon i rëndë, ai do të jetë në një jetë të këndshme; por ai që ka peshoret e lehta, streha e tij do të jetë një humnerë.",
      },
      {
        excerpt:
          "Dhe nuk ka asnjë prej jush, përveç se ai do ta kalojë atë… Pastaj Ne do t'i shpëtojmë ata që i frikësoheshin Allahut.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ndërmjetësimi (Shafa'ah)",
    summary:
      "Ndërmjetësimi është real – por vetëm me lejen e Allahut, për ata me të cilët Ai është i kënaqur.",
    body: [
      "Ndërmjetësimi (shefa'a) në Ditën e Gjykimit është i pohuar me vendosmëri në Kur'an dhe Sunet. Më i madhi nga të gjithë është 'Stacioni i Lavdëruar' (el-makam al-Mahmud) që i është dhënë Profetit Muhamed ﷺ, kur ai do të ndërmjetësojë që krijimi i tubuar të fillojë llogarinë - dhe ai do të ketë ndërmjetësime të tjera për njerëzit e mëkateve të mëdha në mesin e ummetit të tij.",
      'Por askush nuk ndërmjetëson me autoritetin e vet. Çdo ndërmjetësim i vlefshëm ndodh vetëm "pas lejes së Tij" dhe vetëm për ata me të cilët Allahu është i kënaqur: "Kush është ai që mund të ndërmjetësojë tek Ai përveç me lejen e Tij?" Kjo ruan sovranitetin absolut të Allahut mbi rezultatin.',
      "Dijetarët përshkruajnë disa lloje të afirmuara ndërmjetësimi – që të fillojë llogaritja, që njerëzit të hyjnë në Xhenet, që besimtarët mëkatarë të falen ose të largohen nga Zjarri – ndërkohë që bien dakord se gjykimi përfundimtar mbetet gjithmonë vetëm i Allahut.",
    ],
    quran: [
      {
        excerpt: "Kush është ai që mund të ndërmjetësojë tek Ai përveçse me lejen e Tij?",
      },
      {
        excerpt:
          "Atë ditë, ndërmjetësimi nuk i bën dobi përveç atij, të cilit i Gjithëmëshirshmi ia ka lejuar dhe fjalën e të cilit e miraton.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Njerëzit do të vijnë tek unë dhe unë do t'i bëj sexhde Zotit tim; atëherë do të thuhet: Ngri kokën, kërko dhe do të të jepet, ndërmjetëso dhe ndërmjetësimi yt do të pranohet. (Ebu Said - ndërmjetësimi i madh)",
      },
    ],
    misconceptions: [
      "Mendimi i gabuar: Ndërmjetësimi largon nevojën për pendim. Korrigjim: Ndodh vetëm me lejen e Allahut dhe nuk është kurrë leje për të vazhduar në mëkat.",
      "Keqkuptim: Dikush mund t'u bëjë thirrje profetëve ose të drejtëve tani që të ndërmjetësojnë. Korrigjim: Adhurimi dhe lutja janë vetëm për Allahun; ndërmjetësimi në botën tjetër bëhet me caktimin e Tij, i kërkuar përmes kënaqësisë së Tij.",
      "Keqkuptim: Ndërmjetësimi bie ndesh me drejtësinë e Allahut. Korrigjimi: Është një shprehje e mëshirës së Tij që vepron brenda drejtësisë së Tij të përsosur dhe vetëm me lejen e Tij.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shenjat e Ditës së Fundit",
    summary:
      "Shenjat e vogla dhe të mëdha janë të vërteta; fokusi i mençur në përgatitjen mbi spekulimet.",
    body: [
      "Tekstet autentike përshkruajnë shenja që i paraprijnë Kijametit, të grupuara në shenja të vogla (shumë prej të cilave tashmë janë shfaqur, si dërgimi i vetë Profetit ﷺ, përhapja e injorancës dhe shpërfillja e përhapur) dhe shenja të mëdha që do të ndodhin afër fundit.",
      "Dhjetë shenjat kryesore janë emërtuar së bashku në një Hadith të Profetit sal-lAllahu alejhi ue sel-lem: në mesin e tyre paraqitja e Dexhallit, zbritja e Isait (djali i Merjemes), shfaqja e Ja'juxh-it dhe Me'juxh-it, tre rrëshqitje të mëdha dheu, një tym, lindja e diellit nga perëndimi dhe një zjarr që i shtyn njerëzit në tubimin e tyre përfundimtar.",
      "Dijetarët ndonjëherë ndryshojnë në sekuencën e saktë të disa shenjave, por ata pajtohen në dy gjëra: ardhja e Kiametit është e sigurt dhe koha e saktë e saj nuk e di askush përveç Allahut - madje as Profeti (a.s) kur e pyeti Xhibrili. Prandaj, përgjigja profetike ndaj shenjave është praktike, jo spekulative: rrit besimin, pendimin, drejtësinë dhe veprat e dobishme në vend të parashikimit të pafund.",
    ],
    quran: [
      {
        excerpt: "Të pyesin për kijametin: kur vjen ai? Thuaj: Dija e saj është vetëm te Zoti im.",
      },
      {
        excerpt:
          "A presin ata përveç që t'u vijë Kijameti papritmas? Shenjat e saj tashmë kanë ardhur.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kiameti nuk do të vijë derisa të shihni dhjetë shenja: tymin, Dexhallin, Bishën, diellin që lind nga perëndimi, zbritja e Isait, Jajujit dhe Mexhuxhit dhe tre rrëshqitje dheu… (Hudhejfe ibn Usejd)",
      },
    ],
    misconceptions: [
      "Keqkuptim: Çdo ngjarje e madhe botërore është padyshim një shenjë përfundimtare. Korrigjim: Pretendime të tilla kërkojnë prova autentike dhe kujdes shkencor, jo sensacionalizëm.",
      "Keqkuptim: Njohja e shenjave na lejon të datojmë Orën. Korrigjimi: Koha e saktë e di vetëm Allahun; Shenjat na thërrasin të përgatitemi, jo të parashikojmë.",
    ],
    appLinks: [{}],
  },
  {
    title: "Akide FAQ",
    summary:
      "Pyetjet e përbashkëta të besimit, të cilat janë përgjigjur me ekuilibër, prova dhe adab të mirë.",
    body: [
      "Pyetje: A janë të gjithë sunitët identikë në çdo pikë të besimit? Përgjigje: Ehli Suneti ndajnë një themel dhe pajtohen plotësisht për gjërat thelbësore; shkollat ​​e njohura teologjike (Athari, Esh'ari, Maturidiu) ndryshojnë vetëm në disa formulime teknike, dhe kësaj duhet trajtuar me mësim respektues, jo armiqësi.",
      "Pyetje: A kam nevojë për filozofi të avancuar për të pasur akide të saktë? Përgjigje: Jo. Çdo muslimani kërkohet të mësojë gjërat thelbësore sipas nevojës së tij – gjashtë artikujt dhe teuhidin e pastër – ndërsa studimi më i thellë është i dobishëm nën mësuesit e kualifikuar.",
      "Pyetje: A duhet që njohja e akides të më bëjë të ashpër me të tjerët? Përgjigje: Jo. Besimi i shëndoshë duhet të rrisë përulësinë, mirënjohjen, mëshirën dhe të folurit e kujdesshëm. Përdorimi i besimit për të nënçmuar muslimanët ose nxitimi për tekfir është në vetvete një gabim serioz.",
      "Pyetje: Cili është ndryshimi midis imanit, islamit dhe ihsanit? Përgjigje: Në hadithin e Xhibrilit, Islami është ibadeti i jashtëm, imani është besimi i brendshëm (gjashtë nenet), dhe ihsani është përsosmëria e të dyjave – ta adhurosh Allahun sikur e sheh Atë.",
    ],
    actions: [
      "Jepini përparësi bazave të qarta dhe të dakorduara përpara detajeve teknike të diskutueshme.",
      "Konsultohuni me studiues të kualifikuar vendas kur një çështje komplekse e besimit ndikon në praktikën tuaj.",
    ],
  },
  {
    title: "Referenca dhe studime të mëtejshme",
    summary:
      "Filloni me Kur'anin dhe Sunetin autentik, pastaj abetare të besuara të besimeve sunite.",
    body: [
      "Referenca kryesore për besimin është gjithmonë Kur'ani dhe Suneti autentik, të kuptuar siç i kuptuan sahabët dhe dijetarët e hershëm të Ehli Sunetit - jo përmes tendencave të mëvonshme të lexuara përsëri në tekste.",
      "Studimi i dobishëm përfshin abetaret koncize të besimit klasik (të tilla si el-Akideh al-Tahavija dhe veprat e dijetarëve të hershëm) të mësuara me shpjegime të përshtatshme për nivelin tuaj nga mësues të besueshëm.",
      "Kur studiuesit ndryshojnë në pikat dytësore, mësoni provat me përulësi dhe shmangni shndërrimin e mosmarrëveshjeve teknike në armiqësi sektare – uniteti i besimtarëve mbi gjërat thelbësore është në vetvete një urdhër i fesë.",
    ],
    disclaimer:
      "Ky modul është edukativ dhe jopolemik. Për vendime personale ose shqetësime të ndjeshme të besimit, konsultohuni me studiues të kualifikuar që ju besoni.",
    actions: [
      "Studioni një temë të besimit çdo javë me një mësues ose një abetare të besuar.",
      "Mësoni përmendësh gjashtë nenet e besimit dhe jini në gjendje ta shpjegoni secilin me fjalët tuaja.",
    ],
    appLinks: [{}, {}, {}],
  },
];

export const AQEDAH_GLOSSARY_SQ: DeepPartial<AqeedahGlossaryTerm>[] = [
  {
    term: "Akideja",
    definition:
      "Besimi - ajo që një musliman beson për Allahun, engjëjt, librat, të dërguarit e Tij, Ditën e Fundit dhe vendimin hyjnor.",
  },
  {
    term: "Teuhidi",
    definition: "Njëshmëria e Allahut në zotërim, adhurim dhe emra/atribute - themeli i Islamit.",
  },
  {
    term: "Shirku",
    definition:
      "T'i bësh shok Allahut në adhurim ose atribute që Ai i posedon - e kundërta e teuhidit.",
  },
  {
    term: "imani",
    definition: "Besimi - besimi në zemër, pohimi me gjuhë dhe veprimi me gjymtyrë.",
  },
  {
    term: "Kadr",
    definition:
      "Njohuria e përjetshme dhe caktimi i Allahut për të gjitha gjërat - të mirën dhe të keqen ekzistojnë me lejen dhe urtësinë e Tij.",
  },
  {
    term: "Nabi",
    definition:
      "Profet - ai që merr shpalljen dhe urdhërohet ta përcjellë atë; mund të ndjekë një ligj të mëparshëm.",
  },
  {
    term: "Resulu",
    definition: "Lajmëtar - një profet i dërguar me një shkrim ose ligj të ri popullit të tij.",
  },
  {
    term: "Sirat",
    definition: "Ura mbi Xhehenem në Ditën e Gjykimit - besimtarët kalojnë sipas veprave të tyre.",
  },
];
