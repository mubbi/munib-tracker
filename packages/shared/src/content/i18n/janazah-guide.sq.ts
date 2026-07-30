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
  // --- v2 appended topics (keep index-aligned with English) ---
  {
    title: "Tekbir pas tekbiri — hapat e namazit",
    summary: "Një listë praktike e katër tekbireve dhe asaj që vjen ndërmjet tyre.",
    body: [
      "Tekbiri i parë: ngrini duart (sipas shkollës suaj), thoni Allahu Ekber, pastaj lexoni suren el-Fatiha. Ibn Abbasi e lexoi el-Fatihanë në namazin e xhenazes dhe tha se ishte nga suneti (Sahih el-Bukhari 1335).",
      "Tekbiri i dytë: dërgoni salavat mbi Profetin ﷺ — i njëjti salavat ibrahimik që përdoret në teshahhud mësohet gjerësisht për këtë hap. Tekbiri i tretë: bëni dua të sinqertë për të ndjerin (formulimet Hisnul Muslim në këtë udhëzues). Tekbiri i katërt: shumë dijetarë pastaj bëjnë një dua të shkurtër të përgjithshme, pastaj përfundojnë me taslim djathtas (dhe majtas, sipas shkollës).",
      "Nuk ka ruku, suxhud as ulje. Qëndroni gjithë kohën. Nëse janë të pranishme disa xhenaze, në shumë komunitete falet një Xhenazah me nijet për të gjithë — ndiqni imamin. Vendosja e salavatit kundrejt duasë mund të ndryshojë pak sipas medhhebit; korniza e katër tekbireve është e përbashkët.",
    ],
    madhhabNote:
      "Manuale hanefite, malikite, shafiite dhe hanbelite ndryshojnë nëse duart ngrihen në çdo tekbir dhe saktësisht kur thuhet dua. Ndiqni imamin para jush.",
    actions: [
      "Mësoni sekuencën e katër tekbireve para se t’ju duhet.",
      "Memorizoni Fatihanë, salavatin dhe të paktën një dua xhenazeje.",
    ],
    hadith: [
      {
        excerpt:
          "Ibn Abbasi fali namazin e xhenazes dhe lexoi Fatihanë, duke thënë se ishte nga suneti.",
      },
    ],
  },
  {
    title: "Dua për burra, gra dhe fëmijë",
    summary: "Të njëjtat formulime profetike — përshtatni përemrat arabisht me të ndjerin.",
    body: [
      "Hisnul Muslim (dhe përmbledhjet klasike të haditheve) i regjistrojnë duat e Xhenazes kryesisht në formën mashkullore. Kjo nuk do të thotë një dua të veçantë 'të shpikur' për gratë. Dijetarët kryesorë mësojnë se mund ta mbani formulimin mashkullor me nijet për personin, ose — më mirë dhe zakonisht — ta ndryshoni gramatikën që të përputhet me të ndjerin: لَهُ / هُ / هِ → لَهَا / هَا; عَبْدُكَ → أَمَتُكَ; ابْنُ أَمَتِكَ → ابْنَةُ أَمَتِكَ; dhe për një vajzë اجْعَلْهُ → اجْعَلْهَا, شَفِيعًا مُجَابًا → شَفِيعَةً مُجَابَةً.",
      "Për një grua të ndjerë, disa dijetarë këshillojnë kujdes me frazën 'bashkëshort më të mirë se bashkëshorti i saj' (زَوْجًا خَيْرًا مِنْ زَوْجِهَا), duke vënë në dukje se ajo mund të ribashkohet me burrin e saj në Xhenet — mund ta hiqni atë klauzolë ose të mbani një formulim të përgjithshëm. Për fëmijët, përdorni zërat Hisnul specifikë për fëmijë (hisn-160, hisn-161) në vend të vetëm teksteve për të rritur të përqendruara te falja.",
      "Formulimi kolektiv 'fal meshkujt dhe femrat tona' (hisn-157) tashmë mbulon të dy gjinitë pa ndryshim. Ne nuk shpikim arabisht të re përtej përshtatjes gramatikore të teksteve autentike — hapni duanë e lidhur për të rritur si bazë dhe zbatoni hartën e përemrave më sipër.",
    ],
    madhhabNote:
      "Si mbajtja e formave mashkullore me nijet ashtu edhe përshtatja e formave femërore pranohen ndër dijetarët kryesorë. Kur jeni të pasigurt, përdorni hisn-157 (meshkuj dhe femra) ose pyesni imamin.",
    actions: [
      "Praktikoni ndërrimet e përemrave femërorë për duanë që memorizoni.",
      "Përdorni dua specifike për fëmijë për ata që nuk kanë arritur pubertetin.",
      "Preferoni autenticitetin ndaj fletushkave të gjata të paprovuara.",
    ],
    appLinks: [{ label: "Dua e xhenazes për të rritur #1" }],
  },
  {
    title: "Dëshmorët, aborti dhe rastet e veçanta",
    summary: "Kur rregullat e larjes ose të Xhenazes ndryshojnë nga rasti i zakonshëm.",
    body: [
      "Dëshmorët e fushës së betejës që vdesin në luftë, sipas gjykimit klasik të nxjerrë nga Uhudi, varrosen me rrobat e tyre pa ghuslin e zakonshëm; Profeti ﷺ urdhëroi që dëshmorët e Uhudit të varroseshin me gjakun e tyre dhe pa u larë (Sahih el-Bukhari 1346). Kategoritë e tjera të quajtura 'dëshmorë' në shpërblim (p.sh. murtaja, mbytja) zakonisht marrin larje dhe Xhenazah — pyesni një dijetar për rastet kufitare.",
      "Për abortin ose fëmijën e vdekurlindur, shkollat ndryshojnë se kur zbatohet namazi i xhenazes dhe larja e plotë (shpesh e lidhur me faktin nëse është gjykuar se ka ndodhur një formë e njohshme ose faza e fryrjes së shpirtit). Një hadith nxit faljen mbi abortin dhe kërkimin e faljes e mëshirës për prindërit (Ebu Davud 3180). Ndiqni komitetin e xhenazes të medhhebit tuaj në vend që të hamendësoni.",
      "Të afërmve jo-muslimanë nuk u jepet namazi musliman i Xhenazes; mirësia, ndihma e ligjshme e varrimit ku është e zbatueshme dhe hidhërimi personal janë të ndara nga namazi ritual për besimtarët. Rastet e veçanta konfirmojini gjithmonë me udhëzim lokal të kualifikuar.",
    ],
    madhhabNote:
      "Përkufizimet e dëshmorisë së fushës së betejës, fazave të abortit dhe namazit mbi fëmijën e vdekurlindur ndryshojnë sipas shkollës. Kjo temë shënon çështjet — nuk është fetva.",
    disclaimer:
      "Rregullat e veçanta janë të ndjeshme. Konfirmojini me një dijetar të kualifikuar ose shërbimin e xhenazes të komunitetit tuaj para se të veproni.",
    actions: [
      "Mos e lani një dëshmor të fushës së betejës kundër udhëzimit të dijetarëve.",
      "Pyesni komitetin e xhenazes për rastet e abortit ose lindjes së vdekur.",
    ],
    hadith: [
      {
        excerpt:
          "Profeti ﷺ urdhëroi që dëshmorët e Uhudit të varroseshin me gjakun e tyre dhe nuk u lanë.",
      },
      {
        excerpt: "Namazi i xhenazes falet mbi abortin dhe për prindërit lutet falje e mëshirë.",
      },
    ],
  },
  {
    title: "Xhenazah në mungesë",
    summary: "Profeti ﷺ fali për Negusin kur trupi ishte larg.",
    body: [
      "Xhabiri raportoi se Profeti ﷺ doli te shokët e tij, i radhiti dhe tha katër tekbire për Negusin (el-Nexhashi), mbretin abisinian që kishte vdekur jashtë (Sahih el-Bukhari 1334; Sahih Muslim 952). Ky është dëshmia kryesore për Salat el-Xhenazah në mungesë (alā al-ghā'ib).",
      "Shkollat ndryshojnë se sa gjerësisht të zbatohet ai precedent: disa e kufizojnë në raste si Negusi (pa namaz lokal musliman), të tjerat e lejojnë më gjerësisht kur trupi është larg. Mos e anashkaloni Xhenazahën lokale kur trupi është i pranishëm dhe komuniteti mund të falë. Pyesni një dijetar lokal të besueshëm se kur namazi në mungesë është i përshtatshëm në shkollën tuaj.",
      "Forma është i njëjti namaz me katër tekbire; nijeti është për të ndjerin e munguar. Përdorni të njëjtat dua autentike, duke përshtatur gjininë sipas nevojës.",
    ],
    madhhabNote:
      "Shtrirja e Xhenazahës në mungesë është një pikë e njohur e dallimit. Preferoni praktikën e imamëve të kualifikuar në komunitetin tuaj.",
    actions: [
      "Falni lokalisht sa herë që trupi është i pranishëm.",
      "Pyesni para se të organizoni një Xhenazah në mungesë si ngjarje publike.",
    ],
    hadith: [
      {
        excerpt: "Profeti ﷺ fali namazin e xhenazes për Negusin dhe tha katër tekbire.",
      },
      {
        excerpt:
          "I Dërguari i Allahut ﷺ i radhiti shokët dhe fali për Negusin, duke thënë katër tekbire.",
      },
    ],
  },
  {
    title: "Te shtrati i vdekjes — fjalët e fundit",
    summary: "Nxitni me butësi të vdekurin që të thotë la ilaha illallah.",
    body: [
      "Profeti ﷺ tha: 'Nxitni të vdekurit tuaj që të thonë la ilaha illallah' (Sahih Muslim 916; Ebu Davud 3117). Hisnul Muslim ruan udhëzimin se kushdo që fjalët e fundit të tij janë 'Askush nuk ka të drejtë të adhurohet përveç Allahut' do të hyjë në Xhenet (hisn-153, nga Ebu Davud 3116).",
      "Nxitni me butësi dhe pa ashpërsi; mos detyroni dhe mos u grindni. Ata afër vdekjes mund të ngushëllohen edhe me fjalë autentike shprese të ruajtura në Hisnul Muslim (hisn-150–152). Mbyllni sytë kur merret shpirti dhe përdorni duanë e mbylljes së syve (tema e mëparshme).",
      "Shmangni vajtimin e fortë dhe fjalën që zemëron Allahun. Familja duhet të thotë atë që është e mirë, sepse engjëjt thonë amin për fjalët e tyre (Sahih Muslim 920).",
    ],
    actions: [
      "Kujtojini me butësi të vdekurit shehadetin.",
      "Mbajeni dhomën të qetë dhe të zënë me fjalë të mira.",
    ],
    hadith: [
      {
        excerpt: "Nxitni të vdekurit tuaj që të thonë: la ilaha illallah.",
      },
      {
        excerpt:
          "Ai që fjalët e fundit të tij janë 'Askush nuk ka të drejtë të adhurohet përveç Allahut' do të hyjë në Xhenet.",
      },
    ],
    appLinks: [{ label: "Duat e shpresës së jetës" }, { label: "Mbyllja e syve" }],
  },
  {
    title: "Ngushëllimi dhe të zhuriturit",
    summary: "Ngushëlloini të gjallët me duanë profetike të fatkeqësisë.",
    body: [
      "Umm Seleme raportoi se i Dërguari i Allahut ﷺ tha: 'Nuk ka musliman që goditet nga një fatkeqësi dhe pastaj thotë atë që ka urdhëruar Allahu — \"Ne i përkasim Allahut dhe tek Ai kthehemi. O Allah, më shpërble në fatkeqësinë time dhe ma zëvendëso me diçka më të mirë\" — por Allahu ia zëvendëson me diçka më të mirë' (Sahih Muslim 918). Hisnul Muslim ruan këtë formulim (hisn-154).",
      "Ofroni ngushëllime me fjalë të shkurtra e të vërteta; përgatitni ushqim për familjen e të ndjerit në vend që t’i ngarkoni me mikpritje (Ebu Davud 3132 — raporti për familjen e Xhaferit). Shmangni ceremonitë e rinjohura të ditëve të fiksuara pa prova, duke vazhduar duanë private, sadakanë dhe mirësinë.",
      "Hidhërimi me lot lejohet; vajtimi, goditja e faqeve dhe grisja e rrobave u ndaluan. Mbështetni të vejat, jetimët dhe të varurit me ndihmë të ligjshme pas varrimit.",
    ],
    actions: [
      "Mësojuni të zhuriturve duanë e fatkeqësisë.",
      "Ndihmoni me ushqim dhe punë në vend që të prisni një festë.",
      "Vazhdoni duanë e qetë dhe sadakanë për të ndjerin.",
    ],
    hadith: [
      {
        excerpt:
          "Asnjë musliman nuk goditet nga fatkeqësia dhe thotë fjalët e urdhëruara të kthimit te Allahu e kërkon zëvendësim me më të mirë, por Allahu ia zëvendëson me diçka më të mirë.",
      },
    ],
    appLinks: [{ label: "Qëllimet e sadakasë" }],
  },
];
