import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// sq overlay for janazah-guide. Index-aligned with JANAZAH_GUIDE_TOPICS in ../janazah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const JANAZAH_GUIDE_TOPICS_SQ: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Një detyrim i përbashkët",
    summary: "Xhenazah është farz kifaje — komuniteti duhet ta përmbushë atë.",
    body: [
      "Namazi i xhenazes (Salat el-Xhenezah) është obligim i përbashkët (farz kifaje): nëse e kryen atë disa nga komuniteti, i hiqet detyra nga pjesa tjetër; nëse askush nuk e bën, të gjithë ndajnë fajin. Ai falet në këmbë, pa ruku apo suxhud - një formë e veçantë në mesin e namazeve.",
      "Ebu Hurejra transmeton se i Dërguari i Allahut ﷺ ka thënë: \"Kush merr pjesë në xhenaz derisa të falet namazi, do të ketë një kirat (shpërblim), dhe kushdo që merr pjesë deri në varrim do të ketë dy kirate. Ai u pyet se çfarë është kirati dhe ai tha: 'Si dy male të mëdha' (Sahih el-Bukhari 1325; Sahih Muslim 945).",
      "Pasimi i varrimit, ndihma në larjen dhe varrimin sipas kapacitetit të dikujt dhe bërja e duasë për të ndjerin janë ndër të drejtat e muslimanit ndaj tjetrit. Trajtojeni trupin me dinjitet dhe shmangni ekstravagancën ose praktikat pa prova.",
    ],
    actions: [
      "Përgjigjuni shpejt kur shpallet një funeral në komunitetin tuaj.",
      "Namazin dhe pjesëmarrjen e synoni për hir të Allahut, jo për shfaqje shoqërore.",
      "Ndihmoni me nevojat praktike të familjes kur mund ta bëni këtë me respekt.",
    ],
    hadith: [
      {
        excerpt:
          "Kushdo që merr pjesë në xhenaz derisa të falë namazin e xhenazes, do të ketë një kirat, dhe kushdo që merr pjesë deri në varrim do të ketë dy kirate - secila si një mal i madh.",
      },
      {
        excerpt:
          "Kushdo që ndjek xhenazin e një muslimani për besim dhe për të kërkuar shpërblim, dhe qëndron derisa të falet namazi dhe të përfundojë varrimi, do të kthehet me dy kirate...",
      },
    ],
  },
  {
    title: "Larje dhe qefin",
    summary: "Gusl i të ndjerit dhe një kafan i thjeshtë — dinjitet pa ekstravagancë.",
    body: [
      "Muslimanët që vdesin (përveç dëshmorëve të fushës së betejës sipas gjykimit klasik) lahen me një larje pastruese, pastaj mbështillen me leckë të bardhë të pastër. Umm Atijah transmeton se Pejgamberi salAllahu alejhi ue selem ka thënë në lidhje me larjen e vajzës së tij: 'Laje atë tre ose pesë herë, ose më shumë nëse e sheh të arsyeshme, me ujë dhe sidr, dhe në të fundit vendos kamfor - ose pak kamforë' (Sahih el-Bukhari 1253).",
      "Aishja raportoi se i Dërguari i Allahut ﷺ ishte i mbështjellë me tri veshje të bardha pambuku jemenase, mes të cilave nuk kishte as një këmishë, as një çallmë (Sahih el-Bukhari 1264; Sahih Muslim 941). Thjeshtësia është sunet; Shfaqjet e kushtueshme kundërshtojnë shembullin profetik.",
      "Kush kë lan, sa pëlhura për burra dhe gra dhe detajet e lidhura me to kanë dallime medhhebesh. Familjet duhet të ndjekin një udhërrëfyes lokal ose shërbim funerali me njohuri që njeh praktikën e shkollës — kjo përmbledhje nuk është një manual larjeje.",
    ],
    actions: [
      "Emëroni njerëz të besueshëm të së njëjtës gjini me të ndjerin kur është e mundur.",
      "Mbajeni qefinin të thjeshtë dhe të pastër - pëlhura e bardhë është modeli profetik.",
      "Shmangni fotografimin ose ekspozimin e trupit pa nevojë.",
    ],
    hadith: [
      {
        excerpt:
          "Lajeni atë tre herë, ose pesë, ose më shumë nëse e shihni sipas nevojës, me ujë dhe sidr dhe në larjen e fundit vendosni kamfor ose pak kamfor.",
      },
      {
        excerpt:
          "I Dërguari i Allahut ﷺ ishte i mbështjellë me tri veshje të bardha pambuku jemenase; mes tyre nuk kishte as këmishë, as çallmë.",
      },
    ],
  },
  {
    title: "Kur mbyllni sytë e të ndjerit",
    summary: "Një dua profetike në momentin e vdekjes.",
    body: [
      'Umm Seleme transmeton se i Dërguari i Allahut ﷺ erdhi te Ebu Seleme kur sytë e tij ishin fiksuar. Ai i mbylli ato dhe tha: "Kur merret shpirti, shikimi e ndjek atë", dhe njerëzit e familjes së tij qanë. Ai pastaj i mësoi ata të thonë vetëm atë që është e mirë, sepse engjëjt thonë amin për atë që thonë ata, dhe ai bëri dua për Ebu Seleme (Sahih Muslim 920).',
      "Hyrja e bashkuar Hisnul Muslim më poshtë ruan formulimin e përdorur për mbylljen e syve. Flisni butësisht, shmangni vajtimin që Pejgamberi ﷺ e ka ndaluar dhe zëni gjuhën me fjalë të mira dhe duke kërkuar falje.",
    ],
    actions: [
      "Mbyllni sytë butësisht dhe bëni duanë autentike.",
      "Kujtojini familjes të flasë mirë.",
    ],
    hadith: [
      {
        excerpt:
          "Kur sytë e Ebu Selemes u fiksuan, Profeti ﷺ i mbylli dhe tha se kur të merret shpirti, shikimi e ndjek atë, pastaj i mësoi familjes të flasë vetëm atë që është e mirë.",
      },
    ],
  },
  {
    title: "Si të falet Xhenazah",
    summary: "Namazi në këmbë me katër tekbire - pa ruku apo suxhud.",
    body: [
      "Namazi i xhenazes falet në këmbë. Nuk ka as ruku, as suxhud, as ezan apo ikamet. Imami qëndron në krye të një të vdekuri mashkull ose në mes të një të vdekuri femër sipas raporteve nga Enesi dhe Samurah (shih Ebu Davud 3194 dhe transmetimet e lidhura me to), dhe xhemati formon rreshta prapa.",
      "Namazi përbëhet nga katër tekbire. Pas të parës, lexohet sureja Fatiha (Buhariu 1335). Pas tekbireve të mëvonshme bëhen salavat mbi Profetin ﷺ dhe dua për të vdekurin. Namazi përfundon me taslim. Xhabiri ka transmetuar se Profeti ﷺ fali namazin e xhenazes për Negusin (mbretin e Abisinisë) dhe tha katër tekbire (Sahih el-Bukhari 1334).",
      "Të ardhurit e vonuar që humbasin një tekbir duhet të ndjekin imamin dhe të plotësojnë atë që kanë humbur sipas rregullave të shkollës së tyre për të arritur hapin - pyesni imamin ose një mësues lokal nëse nuk janë të sigurt.",
    ],
    actions: [
      "Qëndroni në rreshta; mos u përkul as sexhde.",
      "Thuaj katër tekbire me imamin.",
      "Bëni dua të sinqertë për të ndjerin pas tekbirit përkatës.",
    ],
    hadith: [
      {
        excerpt: "Profeti ﷺ fali namazin e xhenazes për Negusin dhe tha katër tekbire.",
      },
      {
        excerpt:
          "Ibn Abbasi fali namazin e xhenazes dhe lexoi Fatihanë, duke thënë se ishte nga suneti.",
      },
    ],
  },
  {
    title: "Duas në namazin e xhenazes (të rritur)",
    summary: "Formulime autentike muslimane Hisnul për të ndjerin.",
    body: [
      "Pas tekbireve, zemra e Xhenazes është dua për të ndjerin - duke i lutur Allahut t'i falë, t'i mëshirojë dhe t'u japë Xhenetin. Disa formulime autentike ruhen në Hisnul Muslim nga Profeti ﷺ.",
      "Hapni duanë e lidhur më poshtë për të recituar me arabisht, transliterim dhe kuptim. Ju mund të mësoni më shumë se një formulim autentik; sinqeriteti ka më shumë rëndësi se gjatësia.",
    ],
    actions: [
      "Mësoni përmendësh të paktën një dua autentike të xhenazes.",
      "Bëni dua të përgjithshme për të gjithë të vdekurit muslimanë kur të merrni pjesë.",
    ],
  },
  {
    title: "Më shumë dua për lutjen e xhenazes",
    summary: "Formulime autentike shtesë nga Hisnul Muslim.",
    body: [
      "Hisnul Muslimi ruan fjalë të tjera për lutjet e xhenazes të mësuara nga Profeti ﷺ. Përdorini ato në rotacion ose mësoni atë që komuniteti juaj njeh më mirë.",
      "Për një fëmijë të vdekur, dua specifike i kërkojnë Allahut që ta bëjë fëmijën një pararendës dhe shpërblim të ruajtur për prindërit - shiko temën tjetër.",
    ],
  },
  {
    title: "Duaja e xhenazes #3",
    summary: "Një tjetër formulim autentik për të ndjerin e rritur.",
    body: [
      "Një formulim tjetër i Hisnul Muslim për namazin e xhenazes. Lexojeni atë pas tekbirit të duhur ashtu siç e lejon praktika e imamit tuaj.",
    ],
  },
  {
    title: "Duaja e xhenazes #4",
    summary: "Një formulim i katërt autentik nga korpusi i sunetit.",
    body: [
      "Hisnul Muslim përfshin këtë dua shtesë të xhenazes-namazit. Zgjidhni autenticitetin dhe praninë e zemrës mbi mbledhjen e çdo formulimi menjëherë.",
    ],
  },
  {
    title: "Dua për një fëmijë të vdekur",
    summary: "Duat specifike profetike kur i ndjeri është fëmijë.",
    body: [
      "Kur i ndjeri është fëmijë, duatë autentike i kërkojnë Allahut që ta bëjë fëmijën një thesar të ruajtur, një pararendës dhe një ndërmjetësues të përgjigjur për prindërit. Shënimet e Hisnul Muslim më poshtë i ruajnë ato formulime.",
      "Ngushëlloni familjen me shpresë në mëshirën e Allahut duke shmangur ritualet e shpikura. E njëjta strukturë e xhenazes me katër tekbirë vlen; përmbajtja e duasë është ajo që ndryshon.",
    ],
    actions: [
      "Përdorni duatë specifike për fëmijën kur është e përshtatshme.",
      "Mbështetni prindërit e pikëlluar me prezencë dhe ndihmë hallall.",
    ],
  },
  {
    title: "Duaja e funeralit të fëmijëve #2",
    summary: "Formulimi i dytë Hisnul Musliman për një fëmijë të vdekur.",
    body: [
      "Një formulim tjetër autentik për namazin e xhenazes së një fëmije, i ruajtur në Hisnul Muslim.",
    ],
  },
  {
    title: "Varrimi dhe varri",
    summary: "Ulja e trupit, me fytyrë nga kibla dhe duaja pas varrimit.",
    body: [
      "I ndjeri varroset në tokë përballë kibles, me dinjitet dhe pa vonesë përtej asaj që kërkon përgatitja. Pejgamberi salAllahu alejhi ue selem ka thënë: 'Bëhuni të shpejtë me funeralin...' (Sahih el-Bukhari 1315 - nxitimi i xhenazes).",
      "Gjatë vendosjes së të ndjerit në varr, në Hisnul Muslim ruhet një dua autentike. Pas varrimit, Profeti ﷺ qëndronte te varri dhe thoshte: 'Kërkoni falje për vëllain tuaj dhe kërkoni që ai të qëndrojë i palëkundur, sepse ai tani po merret në pyetje' (Sunen Ebi Davud 3221 - i vlerësuar sahih nga shumë dijetarë të mëvonshëm, përfshirë al-Albani).",
      "Ndërtimi i strukturave të zbukuruara mbi varre, suvatimi i tyre për zbukurim ose shkrimi që inkurajon ekzagjerimin është paralajmëruar në raportet autentike. Mbajeni shenjën të thjeshtë aty ku ligji dhe zakonet lokale lejojnë identifikimin.",
    ],
    hadith: [
      {
        excerpt:
          "Jini të shpejtë me funeralin: nëse ishte i drejtë, po e nxitoni për të mirë; nëse përndryshe, ju po e hiqni të keqen nga qafa.",
      },
      {
        excerpt:
          "Kërkoni falje për vëllain tuaj dhe kërkoni që ai të qëndrojë i palëkundur, sepse ai tani po merret në pyetje.",
      },
    ],
  },
  {
    title: "Pas varrosjes së të ndjerit",
    summary: "Dua për qëndrueshmëri në varr.",
    body: [
      "Qëndrimi në këmbë për një kohë të shkurtër pas varrimit për të kërkuar falje dhe qëndrueshmëri për të ndjerin është vendosur nga Profeti ﷺ (Ebu Davud 3221). Formulimi Hisnul Muslim më poshtë është për pas varrimit.",
      "Bamirësia e vazhdueshme, duaja dhe përmbushja e vullneteve legjitime të të ndjerit u sjellin dobi atyre me lejen e Allahut - pa shpikur ceremoni vjetore që nuk kanë prova.",
    ],
    actions: ["Bëni dua te varri pas varrimit.", "Vazhdoni dua dhe sadaka private për të ndjerin."],
  },
  {
    title: "Vizita e varreve",
    summary: "Përshëndetja profetike gjatë vizitës së varreve.",
    body: [
      "Vizita e varreve kujton jetesën e Ahiretit. Buraideja transmeton se i Dërguari i Allahut ﷺ i mësonte ata të thoshin kur dilnin në varreza: një përshëndetje për banorët e banesave mes besimtarëve dhe muslimanëve, duke pohuar se ne, në dashtë Allahu, do t'u bashkohemi atyre dhe duke kërkuar mirëqenie për ne dhe për ta (Sahih Ibn Maxheh gjithashtu9).",
      "Hyrja Hisnul Muslim më poshtë e ruan atë përshëndetje. Mbajini vizitat pa vajtim, kërkim ndihmë nga të vdekurit ose rituale pa prova.",
    ],
    actions: [
      "Përshëndetni banorët e varreve me formulimin autentik.",
      "Reflektoni për vdekjen dhe përtërini veprat e drejta.",
    ],
    hadith: [
      {
        excerpt:
          "Paqja qoftë mbi ju, o banorë të banesave të besimtarëve dhe muslimanëve. Ne do të bashkohemi - në dashtë Allahu - me ju. Lusim Allahun për ne dhe për ju.",
      },
    ],
  },
  {
    title: "Përkujtues dhe gabime të zakonshme",
    summary: "Shmang vajtimet, vonesat për shfaqje dhe ritualet e pabaza.",
    body: [
      "Pejgamberi ﷺ e ndaloi vajtimin për të vdekurin duke lejuar pikëllimin e përlotur. Abdullah ibn Omar transmetoi se Sa'd ibn Ubadah qau në një varrim dhe Profeti (sal-lAllahu 'alejhi ue sel-lem) shpjegoi se Allahu nuk dënon për lotin e syrit apo pikëllimin e zemrës, por për këtë - dhe ai tregoi gjuhën e tij (Sahih el-Bukhari 1304).",
      "Mos e vononi varrimin për tubime prestigji, as mos shpenzoni bujarisht në qefin dhe gosti duke lënë pas dore të varfërit. Mos recitoni ose praktikoni risitë që i atribuohen funeraleve pa bazë autentike. Ngushëllimi, duaja e qetë dhe ndihma praktike për familjen janë rruga e sunetit.",
      "Pjesëmarrja e grave në namaz dhe varrim trajtohet me nuanca nëpër shkolla dhe epoka; ndiqni udhëzimet e besueshme vendore që respektojnë kufijtë e dhembshurisë dhe profetikës.",
    ],
    disclaimer:
      "Përmbledhje edukative - jo një manual i drejtorit funeral ose një fetva. Praktika lokale e shkollës për larjen, qefinimin dhe rregullat e varrezave duhet të konfirmohen me njerëz të kualifikuar.",
    actions: [
      "Vërtet pa vajtim apo fjalë të ndaluar.",
      "Nxitoni një varrim dinjitoz.",
      "Ndihmoni familjen me ushqimin dhe punët pa e ngarkuar me ekstravagancë.",
    ],
    hadith: [
      {
        excerpt:
          "Allahu nuk dënon për lotin e syrit apo pikëllimin e zemrës, por Ai dënon ose tregon mëshirë për këtë - dhe tregoi me gisht gjuhën e tij.",
      },
    ],
  },
];
