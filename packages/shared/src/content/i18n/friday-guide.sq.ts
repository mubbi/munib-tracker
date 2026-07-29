import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Albanian translation overlay for the Learn Friday (Jumu'ah) guide. Mirrors the order of
// FRIDAY_GUIDE_TOPICS in ../friday-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const FRIDAY_GUIDE_TOPICS_SQ: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Vlerat e ditës së premte",
    summary: "Dita më e mirë ku lind dielli — krijimi i Ademit, dhe falja mes dy të premteve.",
    body: [
      "E premtja (Jaumul-Xhuma) është dita e mbledhjes javore e këtij umeti. Ebu Hurejra transmeton se i Dërguari i Allahut ﷺ ka thënë: 'Dita më e mirë ku lind dielli është e premtja; në të u krijua Ademi, në të ai hyri në Xhenet, në të ai u nxor prej tij, dhe Ora e Fundit nuk do të ndodhë veçse në ditën e premte' (Sahih Muslimi 854).",
      "Adhurimi i saj mbart gjithashtu një premtim të vazhdueshëm faljeje. Ebu Hurejra transmeton se Profeti ﷺ ka thënë: 'Kush lahet (gusul) ditën e premte, pastaj vjen në namazin e xhumasë, dëgjon dhe rri në heshtje ndërsa imami mban hutben, atij i falen mëkatet mes atij xhumaje dhe xhumasë tjetër, plus tri ditë të tjera' (Sahih Muslimi 857).",
      "Këto vlera janë një thirrje për t'u përgatitur herët, për të dëgjuar me kujdes dhe për ta trajtuar të premten si një rifreskim shpirtëror javor — jo thjesht si një ditë pushimi nga puna.",
    ],
    hadith: [
      {
        excerpt:
          "Dita më e mirë ku lind dielli është e premtja; në të u krijua Ademi, në të ai hyri në Xhenet, në të ai u nxor prej tij, dhe Ora e Fundit nuk do të ndodhë veçse në ditën e premte.",
      },
      {
        excerpt:
          "Kush lahet (gusul) ditën e premte, pastaj vjen në namazin e xhumasë, dëgjon dhe rri në heshtje ndërsa imami mban hutben, atij i falen mëkatet mes atij xhumaje dhe xhumasë tjetër, plus tri ditë të tjera.",
      },
    ],
    actions: [
      "Vendosni qëllim që në mëngjesin e premte: gusul, rrobat më të mira dhe ardhje herët.",
      "Trajtojeni hutben si adhurim — heshtja dhe vëmendja janë pjesë e shpërblimit.",
    ],
  },
  {
    title: "E premtja — obligimi javor",
    summary:
      "Namazi i xhumasë me xhemat, i urdhëruar në Kuran, i cili zëvendëson namazin e drekës për ata që marrin pjesë.",
    body: [
      "Allahu e urdhëron namazin e xhumasë me emrin e vet: 'O ju që besuat! Kur bëhet thirrja për namaz ditën e premte, nxitoni për ta përmendur Allahun dhe lëreni tregtinë. Kjo është më e mirë për ju, nëse do ta dinit' (Kuran, 62:9). Ajetet pasuese lejojnë shpërndarjen në tokë dhe kërkimin e furnizimit të Allahut pas namazit (Kuran, 62:10–11).",
      "E premtja përbëhet nga një hutbe me dy pjesë, e pasuar nga dy rekate që lexohen me zë të lartë prapa imamit, dhe zëvendëson namazin e drekës për ata që marrin pjesë. Tarik ibn Shihab transmeton se Profeti ﷺ tha se namazi i xhumasë me xhemat është detyrim për çdo mysliman, me përjashtim të katër personave: skllavit, gruas, fëmijës ose të sëmurit (Sunen Ebu Davudi 1067).",
      "Neglizhimi i tij është një paralajmërim i rëndë: Ebu el-Xhad transmeton se kush lë tri namaze xhumaje nga neglizhenca, Allahu ia vulon zemrën (Sunen en-Nesaiu 1369). Gjatë hutbes, të flasësh pa nevojë e humb shpërblimin — Ebu Hurejra transmeton se nëse i thua shokut tënd 'Hesht' ndërsa imami po flet, ti vetë ke folur kot (Sahih Buhariu 934).",
      "Pas xhumasë rekomandohet të falen katër rekate: Ebu Hurejra transmeton se Profeti ﷺ ka thënë, 'Kur ndonjëri prej jush të falë namazin e xhumasë, le të falë pas tij katër (rekate)' (Sahih Muslimi 881).",
    ],
    quran: [
      {
        excerpt:
          "O ju që besuat! Kur bëhet thirrja për namaz ditën e premte, nxitoni për ta përmendur Allahun dhe lëreni tregtinë. Kjo është më e mirë për ju, nëse do ta dinit. E kur namazi të mbarojë, shpërndahuni në tokë dhe kërkoni mirësinë e Allahut...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Namazi i xhumasë me xhemat është detyrim për çdo mysliman, me përjashtim të katër personave: skllavit, gruas, fëmijës ose të sëmurit.",
      },
      { excerpt: "Kush lë tri namaze xhumaje nga neglizhenca, Allahu ia vulon zemrën." },
      {
        excerpt:
          "Nëse i thua shokut tënd 'Hesht' ditën e premte ndërsa imami po flet, ti vetë ke folur kot (lagv).",
      },
      {
        excerpt:
          "Kur ndonjëri prej jush të falë namazin e xhumasë, le të falë pas tij katër (rekate).",
      },
    ],
    actions: [
      "Planifikoni udhëtimin tuaj që të arrini në xhami para se të fillojë hutbeja.",
      "Vendosni telefonat në heshtje dhe shmangni bisedat gjatë hutbes.",
      "Faluni katër rekate pas xhumasë kur mundeni.",
    ],
    appLinks: [{ label: "Mësoni namazin — mësimi i xhumasë" }, { label: "Hapni ndjekjen" }],
    disclaimer:
      "Numri minimal i pjesëmarrësve që e bën xhumanë të vlefshme, si dhe nëse gratë dhe udhëtarët inkurajohen të marrin pjesë, janë çështje të hollësishme fikhu që ndryshojnë sipas medh'hebeve dhe zakoneve lokale. Gratë, udhëtarët dhe të sëmurët që nuk marrin pjesë falin namazin e drekës në vend të saj. Ky është përmbajtje edukative, jo fetva.",
  },
  {
    title: "Përgatitja për xhuma",
    summary: "Gusul, rroba të pastra, parfum dhe ardhje herët për shpërblimin më të madh.",
    body: [
      "Përgatitja është pjesë e sunetit të xhumasë. Ebu Said el-Hudri transmeton se i Dërguari i Allahut ﷺ ka thënë: 'Gusuli ditën e premte është detyrim për çdo person që ka arritur pubertetin' (Sahih Muslimi 846). Një hadith i ngjashëm në Sahih Buhariu (877) e lidh gjithashtu gusulin e xhumasë me ata që kanë arritur pubertetin.",
      "Përveç gusulit, Profeti ﷺ inkurajoi që të duket sa më mirë. Selman el-Farisi transmeton se Profeti ﷺ ka thënë: 'Kush lahet ditën e premte, pastrohet sa më shumë që mundet, pastaj përdor vaj flokësh ose parfum, pastaj del, dhe nuk shtyhet mes dy personave për t'u ulur në vendin e vet, dëgjon imamin derisa të mbarojë, pastaj fal namazin e caktuar për të — atij i falen mëkatet mes atij xhumaje dhe xhumasë tjetër' (Sahih Buhariu 883).",
      "Ardhja herët e shumëfishon shpërblimin. Ebu Hurejra transmeton se kush shkon në orën e parë është si ai që sakrifikon një deve, pastaj një lopë, pastaj një dash, pastaj një pulë, pastaj një vezë — dhe kur del imami, engjëjt mbyllin regjistrimet e tyre dhe dëgjojnë përkujtimin (Sahih Buhariu 881).",
    ],
    hadith: [
      { excerpt: "Gusuli ditën e premte është detyrim për çdo person që ka arritur pubertetin." },
      {
        excerpt:
          "Gusuli ditën e premte është detyrim për çdo burrë mysliman që ka arritur pubertetin.",
      },
      {
        excerpt:
          "Kush lahet ditën e premte, pastrohet sa më shumë që mundet, pastaj përdor vaj flokësh ose parfum, pastaj del, dhe nuk shtyhet mes dy personave për t'u ulur në vendin e vet, dëgjon imamin derisa të mbarojë, pastaj fal namazin e caktuar për të — atij i falen mëkatet mes atij xhumaje dhe xhumasë tjetër.",
      },
      {
        excerpt:
          "Kush lahet ditën e premte, pastaj shkon herët, si ai që sakrifikon një deve... pastaj një lopë... pastaj një dash... pastaj një pulë... pastaj një vezë. Kur del imami, engjëjt vijnë për të dëgjuar përkujtimin.",
      },
    ],
    actions: [
      "Bëni gusul në mëngjesin e premte (ose para se të shkoni në xhami).",
      "Vishni rrobat më të mira dhe më të pastra, dhe nëse mundeni, përdorni një parfum të lehtë.",
      "Shkoni herët — ata që vijnë të parët marrin shpërblimin më të madh.",
    ],
    appLinks: [{ label: "Mësoni pastërtinë — Gusuli" }],
    disclaimer:
      "Nëse gusuli i xhumasë është detyrim i rreptë ose sunet fuqimisht i rekomanduar, është një dallim klasik mes medh'hebeve. Të gjithë pajtohen për vlerën e tij të madhe; ndiqni praktikën e pranuar në komunitetin tuaj.",
  },
  {
    title: "Surja el-Kehf ditën e premte",
    summary: "Dritë mes dy të premteve, dhe mbrojtje në dhjetë ajetet e para.",
    body: [
      "Leximi i sures el-Kehf (Kuran 18) ditën e premte është një praktikë javore e dashur. Ebu Said el-Hudri transmeton se Profeti ﷺ ka thënë: 'Kush lexon suren el-Kehf ditën e premte, drita do t'i shndritë mes dy të premteve.' Ky hadith transmetohet nëpërmjet el-Hakimit dhe el-Bejhakiut, dhe Shejh el-Albani e ka vlerësuar sahih; shumë komunitete e ndjekin si sunet i qëndrueshëm i xhumasë.",
      "Krahas kësaj, dhjetë ajetet e para të sures el-Kehf janë mbrojtje nga fitneja e Dexhallit. Ebu Derda transmeton se Profeti ﷺ ka thënë: 'Kush mëson përmendësh dhjetë ajetet e para të sures el-Kehf, do të mbrohet nga Dexhalli' (Sahih Muslimi 809).",
      "Gjeni kohë mes mbrëmjes së enjte dhe perëndimit të diellit të premten për të lexuar suren — edhe nëse nuk mund të përfundoni gjithë pjesën, nisni nga ajetet e para dhe kthehuni sa më shumë herë që mundeni.",
    ],
    quran: [
      {
        excerpt:
          "I gjithë lëvdimi i takon Allahut, i cili ia zbriti robit të Tij Librin dhe nuk vendosi në të asnjë shtrembërim... A mendoni se banorët e shpellës dhe të mbishkrimit ishin ndër shenjat Tona më të mahnitshme?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kush lexon suren el-Kehf ditën e premte, drita do t'i shndritë mes dy të premteve. (E vlerësuar sahih nga Shejh el-Albani)",
      },
      {
        excerpt:
          "Kush mëson përmendësh dhjetë ajetet e para të sures el-Kehf, do të mbrohet nga Dexhalli.",
      },
    ],
    actions: [
      "Hapni suren el-Kehf ditën e premte dhe lexoni me vëmendje sa më shumë që mundeni.",
      "Mësoni përmendësh ose përsëritni dhjetë ajetet e para si mbrojtje nga Dexhalli.",
    ],
    appLinks: [{ label: "Lexoni suren el-Kehf" }],
    disclaimer:
      "Hadithi për 'dritën mes dy të premteve' nuk gjendet në Gjashtë Librat kryesorë; bazohet në një transmetim të pranuar gjerësisht më vonë. Mbrojtja e dhjetë ajeteve të para (Muslimi 809) është sahih pa kontroversë.",
  },
  {
    title: "Salavatet për Profetin ﷺ ditën e premte",
    summary: "Në ditën më të mirë të javës, shpeshtoni salavatet për Profetin ﷺ.",
    body: [
      "E premtja është caktuar për salavate të shpeshta. Evs ibn Evs transmeton se Profeti ﷺ ka thënë: 'Ndër ditët tuaja më të mira është e premtja; pra në atë ditë shpeshtoni salavatet për mua, sepse salavatet tuaja do të më paraqiten mua.' Ata thanë: 'O i Dërguar i Allahut, si do të na paraqiten salavatet kur ti të jesh bërë tokë?' Ai tha: 'Allahu ia ka ndaluar tokës të hajë trupat e profetëve' (Sunen Ebu Davudi 1047).",
      "Çdo formulë e vërtetuar e salavateve është e pranueshme — qofshin ato që mësohen në namaz ose forma më të gjata nga suneti. E rëndësishme është shpeshtimi dhe sinqeriteti ditën e premte, jo një numër fiks.",
    ],
    hadith: [
      {
        excerpt:
          "Ndër ditët tuaja më të mira është e premtja; pra në atë ditë shpeshtoni salavatet për mua, sepse salavatet tuaja do të më paraqiten mua.",
      },
    ],
    actions: [
      "Vendosni një qëllim personal salavatesh për ditën e premte — edhe një numër i vogël por i vazhdueshëm.",
      "Nëse doni një formulë të gatshme, përdorni koleksionin e salavateve në aplikacion.",
    ],
    appLinks: [{ label: "Salavatet" }],
  },
  {
    title: "Ora e pranimit",
    summary: "Një orë ditën e premte kur lutja nuk refuzohet — kërkojeni sidomos pas ikindisë.",
    body: [
      "Ebu Hurejra transmeton se i Dërguari i Allahut ﷺ përmendi të premten dhe tha: 'Ditën e premte ka një orë, nëse një rob mysliman qëndron në të dhe kërkon nga Allahu ndonjë gjë, Ai do t'ia jap' — dhe tregoi me dorë se ajo është e shkurtër (Sahih Buhariu 935; gjithashtu Sahih Muslimi 852).",
      "Dijetarët nuk pajtohen se kur saktësisht është kjo orë. Një pikëpamje e fortë e vendos në pjesën e fundit të pasdites së premte pas ikindisë: Xhabir ibn Abdullah transmeton se Profeti ﷺ ka thënë: 'E premtja ka dymbëdhjetë orë, dhe në të ka një orë, nëse një rob mysliman kërkon nga Allahu ndonjë gjë, Ai do t'ia jap — pra kërkojeni në orën e fundit pas ikindisë' (Sunen Ebu Davudi 1048).",
      "Cilëndo pikëpamje që ndiqni, mbushni ditën e premte — sidomos pjesën e fundit të pasdites — me lutje të sinqertë, istigfar dhe salavate, me besim në premtimin e Allahut për t'iu përgjigjur.",
    ],
    hadith: [
      {
        excerpt:
          "Ditën e premte ka një orë, nëse një rob mysliman qëndron në të dhe kërkon nga Allahu ndonjë gjë, Ai do t'ia jap — dhe tregoi me dorë se ajo është e shkurtër.",
      },
      {
        excerpt:
          "Ditën e premte ka një orë, nëse një mysliman është në namaz dhe kërkon nga Allahu ndonjë gjë, Ai do t'ia jap.",
      },
      {
        excerpt:
          "E premtja ka dymbëdhjetë orë, dhe në të ka një orë, nëse një rob mysliman kërkon nga Allahu ndonjë gjë, Ai do t'ia jap — pra kërkojeni në orën e fundit pas ikindisë.",
      },
    ],
    actions: [
      "Pas ikindisë ditën e premte, uluni me një listë të shkurtër lutjesh dhe kërkoni me sinqeritet.",
      "Kombinoni lutjen me salavate — të dyja inkurajohen veçanërisht këtë ditë.",
    ],
    appLinks: [{ label: "Koleksioni i lutjeve" }],
    disclaimer:
      "Koha e saktë e orës së pranimit është çështje dijetarësh të ndryshëm (gjatë hutbes, pas ikindisë, dhe pikëpamje të tjera). Ekzistenca e vetë orës është sahih pa kontroversë në Buhariu dhe Muslimi.",
  },
];
