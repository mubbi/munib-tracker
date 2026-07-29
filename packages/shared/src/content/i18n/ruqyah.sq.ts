import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Albanian translation overlay for the Learn ruqyah guide. Mirrors the order of
// RUQYAH_TOPICS in ../ruqyah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const RUQYAH_TOPICS_SQ: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Çfarë është rukja?",
    summary: "Lexim i Kuranit, Emrave të Allahut, ose duave profetike për shërim.",
    body: [
      "Rukja është praktika e leximit të Kuranit, Emrave dhe Cilësive të Allahut, ose duave profetike autentike mbi veten ose një person tjetër — shpesh me një fryrje të lehtë të frymës — duke kërkuar shërim ose mbrojtje vetëm nga Allahu. Ajo ekzistonte para Islamit si zakon i përgjithshëm arab, dhe Profetit ﷺ iu kërkua direkt nëse ishte e lejuar.",
      "'Auf ibn Malik tregoi se shokët thanë: 'Ne praktikonim rukjen në kohën para-islame; çfarë mendoni për të?' Profeti ﷺ u përgjigj: 'Më tregoni rukjen tuaj — nuk ka dëm në rukje përderisa nuk përmban shirk' (Sahih Muslim 2200). Ky hadith i vetëm është themeli për gjithçka tjetër në këtë udhëzues: rukja vetë është e lejuar; ajo që ka rëndësi është përmbajtja e saj.",
    ],
    hadith: [
      {
        excerpt:
          "Ne praktikonim rukjen në kohën para-islame, dhe thamë: O i Dërguari i Allahut, çfarë mendoni për të? Ai tha: Më tregoni rukjen tuaj — nuk ka dëm në rukje përderisa nuk përmban shirk.",
      },
    ],
  },
  {
    title: "Rukja e lejuar dhe e ndaluar",
    summary: "Kurani, Emrat e Allahut, dhe dua e qartë — kurrë shirk ose të fshehtën.",
    body: [
      "Rukja e ligjshme mbështetet në kushtet që dijetarët i kanë nxjerrë nga hadithi: ajo përdor Kuranin, Emrat dhe Cilësitë e Allahut, ose një dua profetike autentike; është në një gjuhë kuptimi i së cilës kuptohet (jo rrokje ose simbole të panjohura); dhe personi që lexon dhe personi që trajtohet të dy besojnë se rukja vetë nuk ka fuqi — shërimi vjen vetëm nga Allahu, dhe fjalët janë vetëm një mjet që Ai e ka lejuar.",
      "Profeti ﷺ e shembëlloi këtë personalisht: Aishja tregoi se sa herë ai sëmurej, ai lexonte Muavvidhatin (dy suret e fundit) mbi vetveten dhe frynte, dhe kur sëmundja e tij e fundit u përkeqësua, ajo bënte të njëjtën gjë për të, duke fshirë trupin e tij me dorën e vet duke shpresuar për bekimin e saj (Buhari 5016). Kjo është rukja në formën e saj më të qartë, më autentike.",
      "Rukja bëhet e paligjshme kur kalon në shirk: thirrja e dikujt tjetër përveç Allahut, kërkimi i ndihmës nga xhindet, përdorimi i fjalëve ose simboleve të panjohura, varja e hajmalive ose amuletave, ose pretendimi se praktikuesi i rukjes ka njohuri të së fshehtës ose shërim të garantuar. Ajo gjithashtu nuk zëvendëson kurrë pesë namazet ditore ose kërkimin e trajtimit mjekësor të përshtatshëm — plotëson të dyja, nuk zëvendëson asnjërën.",
    ],
    hadith: [
      {
        excerpt:
          "Sa herë që i Dërguari i Allahut ﷺ sëmurej, ai lexonte Muavvidhatin dhe pastaj frynte mbi trupin e tij. Kur u sëmur seriozisht, unë i lexoja dhe fshija trupin e tij me dorën e tij, duke shpresuar për bekimin e saj.",
      },
    ],
    disclaimer:
      "Rukja është praktikë shpirtërore, jo trajtim mjekësor. Nuk zëvendëson vizitën te një mjek i kualifikuar për sëmundje fizike ose mendore, dhe nuk zëvendëson pesë namazet ditore.",
  },
  {
    title: "Sureja Al-Fatiha si rukje",
    summary: "Sureja hyrëse — konfirmohet qartë si rukje e vlefshme.",
    body: [
      "Ebu Said el-Hudri tregoi se kur një krerë fisi u kafshua nga një gjarpër, një nga shokët e Profetit ﷺ lexoi sipër tij Suren Al-Fatiha dhe u shërua. Kur shokët më vonë e pyetën Profetin ﷺ nëse kjo ishte e lejuar, ai buzëqeshi dhe tha: 'Si e dini se është rukje?' — duke konfirmuar se Al-Fatiha, e lexuar me besim dhe kuptim të sinqertë, është vetë rukje e vlefshme (Buhari 5736).",
      "Lexuesi i Kuranit i kësaj aplikacioni mban tekstin e plotë dhe përkthimin e Al-Fatihas; ky udhëzues thjesht e tregon atë si burim rukjeje pa e riprodhuar këtu.",
    ],
    quran: [{ excerpt: "Në emër të Allahut, Mëshirëplotit, Mëshirëbërësit..." }],
    hadith: [
      {
        excerpt:
          "Njëri prej tyre filloi të lexonte Suren Al-Fatiha... pacienti u shërua. Kur e pyetën Profetin ﷺ, ai buzëqeshi dhe tha: Si e dini se Al-Fatiha është rukje?",
      },
    ],
    appLinks: [{ label: "Lexo Al-Fatihan" }],
  },
  {
    title: "Ajetul-Kursi (2:255)",
    summary: "Ajeti i Fronit — lexohet natën për mbrojtjen e Allahut.",
    body: [
      "Ajetul-Kursi (Kurani 2:255) përshkruan sovranitetin absolut të Allahut dhe lexohet gjerësisht për mbrojtje, sidomos para gjumit. Ebu Hurejra tregoi se një vizitor nate që po vidhte nga zekati që ai ruante i tha: 'Sa herë që të shtrihesh, lexo Ajetul-Kursin — një rojtar nga Allahu do të qëndrojë me ty, dhe asnjë shejtan nuk do t'i afrohet deri në mëngjes.' Kur Profeti ﷺ e dëgjoi këtë, konfirmoi: 'Ai të tha të vërtetën, edhe pse është gënjeshtar — ai ishte një shejtan' (Buhari 5010).",
      "Si me ajetet e tjera në këtë udhëzues, këtu jepet vetëm një pjesë e shkurtër; lexoni ajetin e plotë dhe përkthimin e tij në lexuesin e Kuranit të aplikacionit.",
    ],
    quran: [
      {
        excerpt:
          "Allahu — nuk ka zot tjetër përveç Tij, i Gjalli i Përjetshëm, Mbajtësi i çdo gjëje.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sa herë që të shtrihesh në shtratin tënd, lexo Ajetul-Kursin — një rojtar nga Allahu do të të mbrojë gjithë natën, dhe asnjë shejtan nuk do t'i afrohet deri në mëngjes.",
      },
    ],
    appLinks: [{ label: "Lexo Ajetul-Kursin" }],
  },
  {
    title: "Al-Ihlas, Al-Falak & An-Nas (112–114)",
    summary: "Tri suret e fundit — rukja e natës e Profetit ﷺ.",
    body: [
      "Aishja përshkroi rutinën e natës së Profetit ﷺ: çdo natë para se të flinte, ai bashkonte duart e tij, lexonte Suren Al-Ihlas, Suren Al-Falak, dhe Suren An-Nas, frynte në duart e tij, dhe i fshinte ato mbi trupin e tij — duke filluar me kokën dhe fytyrën — duke e përsëritur këtë tri herë (Buhari 5017). Të njëjtat tri sure (Al-Ihlas që pohon njësinë e Allahut, dhe dy Muavvidhatet që kërkojnë mbrojtje nga e keqja) janë gjithashtu ato që ai lexonte mbi vetveten gjatë sëmundjes (Buhari 5016).",
      "Së bashku ato formojnë një nga rutinat më të thjeshta dhe më autentike të rukjes ditore të disponueshme — mjaft të shkurtra për t'u mësuar përmendësh, dhe të dëshmuara direkt në Sunet.",
    ],
    quran: [
      { excerpt: "Thuaj: Ai është Allahu, Një." },
      { excerpt: "Thuaj: Kërkoj mbrojtje te Zoti i agimit." },
      { excerpt: "Thuaj: Kërkoj mbrojtje te Zoti i njerëzimit." },
    ],
    hadith: [
      {
        excerpt:
          "Sa herë që Profeti ﷺ shkonte të flinte, bashkonte duart e tij dhe frynte në to pas leximit të Sureve Al-Ihlas, Al-Falak dhe An-Nas, pastaj fërkonte duart mbi çdo pjesë të trupit të tij që mund t'i afrohej, duke filluar me kokën dhe fytyrën. Ai e bënte këtë tri herë.",
      },
    ],
    actions: [
      "Mëso përmendësh Al-Ihlas, Al-Falak, dhe An-Nas.",
      "Lexoji çdo natë para gjumit, ashtu si bënte Profeti ﷺ.",
    ],
    appLinks: [{ label: "Lexo tri suret" }],
  },
  {
    title: "Mbrojtja e përditshme: dhikri i mëngjesit dhe mbrëmjes",
    summary: "Forma e vazhdueshme dhe e përditshme e rukjes për mbrojtje.",
    body: [
      "Përtej rukjes për një sëmundje specifike, Profeti ﷺ mësoi një grup përkujtimesh (adhkar) të mëngjesit dhe mbrëmjes që funksionojnë si mbrojtje shpirtërore e vazhdueshme — shumë prej tyre janë të njëjtat ajete të mbuluara në këtë udhëzues (Ajetul-Kursi, tri suret e fundit) krahas duave të tjera autentike. Leximi i tyre në mënyrë të vazhdueshme, në vend të kthimit te rukja vetëm kur ndjehet diçka e gabuar, është mënyra e Sunetit për të kërkuar mbrojtjen e Allahut çdo ditë.",
      "Biblioteka e dhikrit të kësaj aplikacioni mban koleksionin e plotë dhe të burimuar të përkujtimeve të mëngjesit dhe mbrëmjes në një vend, gati për lexim ose ndjekje ditore.",
    ],
    actions: [
      "Lexo dhikrin e mëngjesit pas Sabahut.",
      "Lexo dhikrin e mbrëmjes para Akshamit/perëndimit të diellit.",
    ],
    appLinks: [{ label: "Dhikri i mëngjesit dhe mbrëmjes" }],
  },
  {
    title: "Shmangni fallxhorët dhe magjistarët",
    summary:
      "Kërkimi i së fshehtës nga dikush tjetër përveç Allahut është një paralajmërim serioz.",
    body: [
      "Islami vizaton një kufi të fortë mes rukjes autentike dhe konsultimit me fallxhorë, magjistarë, astrologë, ose kushdo që pretendon të njohë të fshehtën (gajb) ose të heqë një vuajtje shpirtërore me mjete jo-islame. Profeti ﷺ paralajmëroi: 'Kushdo që vizitoi një fallxhor (arraf) dhe e pyeti për diçka, namazi i tij nuk do të pranohet për dyzet netë' (Sahih Muslim 2230) — një paralajmërim i rëndë edhe kundër testimit të pretendimeve të tilla nga kurioziteti.",
      "Nëse një person gjithashtu beson pretendimet e fallxhorit për të fshehtën, dijetarët e trajtojnë këtë si çështje mosbesimi, pasi vetëm Allahu ka njohuri të së fshehtës (Kurani 27:65). Cilado qoftë vështirësia që shtyn dikë të konsiderojë një person të tillë, përgjigja e saktë sipas mësimit të këtij udhëzuesi është gjithmonë kthimi te rukja autentike, duaja, dhe ndihma mjekësore ose shkencore e besueshme — kurrë te ata që pretendojnë njohuri të fshehur.",
    ],
    hadith: [
      {
        excerpt:
          "Kushdo që vizitoi një fallxhor (arraf) dhe e pyeti për diçka, namazi i tij nuk do të pranohet për dyzet netë.",
      },
    ],
    actions: [
      "Kurrë mos konsultoni fallxhorë, astrologë, ose ata që pretendojnë të njohin të fshehtën.",
    ],
  },
  {
    title: "Tevekkuli — mbështetja vetëm në Allahun",
    summary: "Rukja është një mjet; shërimi dhe rezultati i takojnë Allahut.",
    body: [
      "Kujtimi i fundit dhe më i rëndësishmi në këtë udhëzues është tevekkuli: mbështetja e sinqertë te Allahu duke përdorur mjetet e lejuara që Ai i ka dhënë. Leximi i rukjes, kërkimi i kujdesit mjekësor, dhe kërkimi nga të tjerët për t'u lutur për ju janë të gjitha mjete legjitime — por besimi i zemrës duhet të mbetet vetëm në Allahun, jo në fjalët e lexuara ose personin që i lexon. Kjo pasqyron saktësisht kushtin e hadithit të parë të këtij udhëzuesi: 'Nuk ka dëm në rukje përderisa nuk përmban shirk' (Sahih Muslim 2200).",
      "Ky udhëzues qëllimisht ka lënë jashtë 'protokollet' popullore dhe listat e simptomave që qarkullojnë gjerësisht online — asnjëri prej tyre nuk ka bazë të fortë në Kuran ose Sunet autentik, dhe mbështetja tek to mund të zhvendosë në heshtje besimin e një personi nga Allahu drejt një riti ose liste supozimesh. Qëndroni tek ajo që është themeluar tekstualisht, dhe lëreni pjesën tjetër te caktimi i Allahut.",
    ],
    hadith: [{ excerpt: "Nuk ka dëm në rukje përderisa nuk përmban shirk." }],
    disclaimer:
      "Ky është përmbajtje edukative e përgjithshme që përmbledh mësimin sunit kryesor nga Kurani dhe hadithi autentik. Nuk është fetva, dhe nuk është trajtim mjekësor ose psikologjik. Për vuajtje serioze ose të vazhdueshme, konsultohuni edhe me një dijetar lokal të kualifikuar edhe me një profesionist mjekësor të përshtatshëm.",
  },
];
