// Turkmen translation overlay for the Learn "Prophets" content. Mirrors the order of
// its English source in ../prophets*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { ProphetsTimelineEvent, ProphetsTopic } from "../../types/prophets";
import type { DeepPartial } from "./localize";

export const PROPHETS_TOPICS_TK: DeepPartial<ProphetsTopic>[] = [
  {
    title: "Pygamberler bilen tanyşlyk",
    summary: "Allatagala näme üçin pygamberleri iberdi we näme üçin indi olaryň hekaýalary möhüm?",
    body: [
      "Allatagala adamlary tanamak, Oňa dogry ybadat etmek we adalat we maksat bilen ýaşamak üçin pygamberlere rehim, ýol görkeziji we subutnama hökmünde iberdi.",
      "Gurhanda olaryň kyssalary diňe uzak taryh däl; ynanç, sabyr, maşgala durmuşy, ýolbaşçylyk we toba üçin amaly sapaklardyr.",
      "Prophetshli pygamberlere ynanmak imanyň bir bölegidir. Musulmanlar hemmesini hormatlaýarlar, ulaltmakdan gaça durýarlar we Muhammet of getiren iň soňky habaryna eýerýärler.",
    ],
    quran: [
      {
        excerpt:
          "Resullar hoş habar getiriji we duýduryş beriji hökmünde adamlar pygamberlerden soň Allaha garşy jedel edip bilmezler.",
      },
      {
        excerpt:
          "Elbetde, her bir halka habarçy iberdik: Allaha ybadat ediň we ýalan taňrylardan gaça duruň.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yslamda pygamber näme?",
    summary: "Ylham alýan we adamlary Allaha çagyrýan saýlanan adam.",
    body: [
      "Pygamber, wahyý almak we adamlary taharet, ybadat we dogry amallara ugrukdyrmak üçin Allah tarapyndan saýlanan adamdyr.",
      "Pygamberler ylahy däl we hiç haçan ybadat edilmeýär. Allanyň gullary bolmak bilen, boýun bolmakda, häsiýetde we ygtybarlylykda ýaradylyşyň iň gowusydyr.",
      "Olaryň wezipesi esasdyr: diňe Allaha ybadat ediň. Aýratyn kanuny jikme-jiklikler Allanyň hikmeti bilen jemgiýetlerde tapawutlanyp biler.",
    ],
    quran: [
      {
        excerpt:
          'Resullary olara: "Biz diňe seniň ýaly adamlardyrys, ýöne Alla gullarynyň arasynda islänini isleýär.',
      },
      {
        excerpt:
          "Seniň öňüňden hiç bir habar ibermedik, Oňa aýan edenimizden başga: Menden başga hudaý ýok, şonuň üçin Maňa ybadat et.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nabi vs Rasul",
    summary: "Stipendiýada peýdaly tapawut, ikisem hormatlanýan pygamberler.",
    body: [
      "Yslam stipendiýasynda umumy tapawut, her bir rasulyň nabi, ýöne her nebiniň rasul däldigi. Resul köplenç halka aýratyn mandat bilen iberilýär, bir nabi bolsa ylham arkaly ýol görkezýär.",
      "Gurhan iki termini hem hormat bilen ulanýar we musulmanlar hiç bir zady ret etmezden ähli pygamberlere we habarçylara ynanýarlar.",
      "Takyk tehniki kesgitlemeler ylmy sözlemler bilen üýtgäp biler, ýöne amaly sapak yzygiderli: wahyý bilen kiçigöwünlilik bilen kabul ediň we Allanyň görkezmesine eýeriň.",
    ],
    quran: [
      {
        excerpt: "Ol saýlandy, habarçy we pygamberdi.",
      },
      {
        excerpt: "Biz hiç bir pygamberini tapawutlandyrmaýarys.",
      },
    ],
    disclaimer:
      "Terminologiýa jikme-jiklikleri giň, alym bitarap görnüşde berilýär; Öňdebaryjy ylahy klassifikasiýalar üçin ökde mugallymlar bilen maslahatlaşyň.",
    appLinks: [{}],
  },
  {
    title: "Pygamberlerden sapak aldy",
    summary: "Urrygy-ýygydan mowzuklar: tawhid, sabyr, toba we ahlak batyrlygy.",
    body: [
      "Nesiller boýunça pygamberler bir binýady çagyrdylar: diňe Allaha ybadat ediň we ähli şirklerden gaça duruň. Bu ylhamyň üýtgemeýän özenidir.",
      "Şeýle hem, olaryň durmuşy ret edilýän sabrlary, näbellilik döwründe Allaha bil baglamagy we paýhas we batyrlyk bilen jemgyýeti özgertmäge taýýardygyny görkezýär.",
      "Olary öwrenmek çydamlylygy döredýär: imanlylar çalt toba etmegi, ahlakly hereket etmegi we hakykat meşhur bolmasa-da prinsipial bolmagy öwrenýärler.",
    ],
    quran: [
      {
        excerpt: "Olaryň hekaýalarynda düşünýän adamlar üçin sapak bar.",
      },
      {
        excerpt: "Allahyň ýol görkezenleri, şonuň üçin olaryň görkezmesine eýeriň.",
      },
    ],
    actions: [
      "Her hepde bir pygamberlik sapagyny saýlaň we bilgeşleýin ulanyň.",
      "Namazdan soň has köp sabyr ýa-da toba gerek ýerinde pikirleniň.",
      "Maşgalaňyza ýa-da dostlaryňyza bir hakyky pygamberlik hekaýasyny öwrediň.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Gudratlar we pygamberligiň alamatlary",
    summary: "Gudratlar Allanyň rugsady bilen hakykaty tassyklaýar, ýöne imany mejbur etmeýär.",
    body: [
      "Allah pygamberlere öz jemagatlaryna laýyk alamatlary berdi: Nuh gämisi, Musanyň fyrownyň öňündäki alamatlary, Isanyň Allanyň rugsady bilen görkezen gudratlary we Muhammet üçin Gurhan gave.",
      "Gudratlar pygamberleriň garaşsyz güýji däldir; wahyýy goldamak we subut etmek üçin Allanyň islegi bilen ýüze çykýar.",
      "Gurhan, käbirleriniň alamatlara garamazdan henizem ret edilendigini görkezýär, görkezmäni subut etmek diňe bir tomaşa däl-de, ak ýüreklilige we boýun bolmaga baglydyr.",
    ],
    quran: [
      {
        excerpt:
          "Habarçylarymyzy anyk subutnamalar bilen iberdik we olar bilen Kitap we deňagramlylygy iberdik.",
      },
      {
        excerpt:
          "Aýdyň: Alamatlar diňe Allanyň ýanyndadyr ... Olara okalan Kitaby size aýan edenimiz ýeterlik dälmi?",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Gurhan pygamberlere syn",
    summary: "Gurhan ýigrimi bäş pygamberiň adyny tutýar we yzygiderli bir habary berýär.",
    body: [
      "Gurhan ýigrimi bäş pygamberi gönüden-göni atlandyrýar we başga-da köp habarçyny görkezýär. Olaryň hekaýalary pikirlenmek we ýol görkezmek üçin sürelerde paýlanýar.",
      "Sazlamalar dürli-dürli bolsa-da, olaryň çagyryşy birdir: tawid, dogruçyllyk, jogapkärçilik we toba arkaly rehimdarlyk.",
      "Bu modul, Gurhanda esaslanýar we ygtybarly subutnamalar bilen tassyklanmasa ikinji derejeli taryhy maglumatlary gysga saklaýar.",
    ],
    quran: [
      {
        excerpt:
          "Biz eýýäm siziň öňüňizde habarçy iberdik. Olaryň arasynda siziň bilen baglanyşdyranlarymyz we olaryň arasynda siziň bilen baglanyşykly bolmadyklarymyz bar.",
      },
      {
        excerpt:
          "Allaha we aýan edilenlere ... we Musa, Isa we pygamberlere Rebbinden berlen zatlara ynanýarys.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Salgylar we okamak usuly",
    summary: "Hakykat, deňagramlylyk we peýda bilen pygamberleri nädip öwrenmeli.",
    body: [
      "Gurhanyň parçalaryndan başlaň, soňra hakyky hadyslary okaň, soňra kontekst üçin ygtybarly tafsir bilen maslahatlaşyň. Bu buýruk ylhamyň köküni öwrenmegi dowam etdirýär.",
      "Gurhanyň ýörelgelerine ýa-da pygamberlik mertebesine garşy gelýän duýgur ýa-da gowşak habarlardan gaça duruň. Her bir meşhur hekaýanyň dogry subutnamasy ýok.",
      "Diňe taryhy faktlary ýygnamak bilen çäklenmän, öz ybadatyňyzy we häsiýetiňizi üýtgetmek üçin pygamberlik terjimehallaryny ulanyň.",
    ],
    quran: [
      {
        excerpt: "Sözleri diňleýänler we iň gowularyna eýerýänler - Allanyň ýol görkezenleri.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim bilim gözleýän ýoldan gitse, Allatagala oňa Jennete barýan ýoly aňsatlaşdyrýar.",
      },
    ],
    actions: [
      "Her hepde bir pygamber hekaýasyny göni Gurhandan okaň.",
      "Diňe wagt faktlary däl, amaly sapaklarda bellikleri saklaň.",
      "Ynamly alymlar bilen ikinji derejeli gürrüňleri barlaň.",
    ],
    disclaimer:
      "Taryhy seneler we takyk ýerler çeşmeler boýunça tapawutlanyp biler; bu merkez ylalaşylan, tekste esaslanýan gollanmany ileri tutýar.",
    appLinks: [{}, {}],
  },
];

export const PROPHETS_BIO_TOPICS_TK: DeepPartial<ProphetsTopic>[] = [
  {
    title: "Adam (AS)",
    summary:
      "Bilim bilen sylaglanan we boýun bolmak bilen synag edilen ilkinji adam we ilkinji pygamber.",
    body: [
      "Adamzat (sallaLlahu aleýhi we sellem) adamzat taryhynyň we pygamberligiň başlanýan ýeri. Allah ony eli bilen palçykdan ýaratdy, ruhundan dem aldy we hemme zadyň atlaryny öwretdi. Perişdelere Adam ata hormat bilen sejde etmek tabşyrylanda, olar boýun boldular, ýöne Iblis ulumsylykdan ýüz öwürdi we şol pursatdan başlap Adam ata we onuň nesillerine duşmançylygy yglan edildi. Bu açylyş sahnasy, her bir ynsan durmuşynyň merkezi dramasyny düzýär: kiçigöwünlilik bilen boýun bolmak we buýsançly gozgalaň arasynda saýlamak (Gurhan 2: 30–39).",
      "Allah Adam we aýaly Hawwany bagda goýdy we olara bir agaçdan başga hemme zada rugsat berdi. Şeýtan pyşyrdap, ondan iýdiler. Emma Iblis bilen olaryň arasyndaky tapawuda üns beriň: Iblis günäsini aklady, Adam we Hawwa derrew ökünip, öwreden sözleri bilen Allaha ýüz tutdular - 'Rebbimiz, özümize zulum etdik, eger-de bizi bagyşlamasaň we bize rehim etseň, hökman ýitirenleriň arasynda bolarys' (Gurhan 7:23). Allatagala olaryň tobalaryny kabul etdi we geljeklere ýol görkezjek wada bilen olary ýere iberdi.",
      "Adam atanyň sapagy umyt sapagydyr: ynsan hormatlanýar we mertebe edilýär, ýöne synagdan geçirilýär we süýşer. Imanly kesgitleýän zat, günäsiz bolmak däl - diňe Allah kämildir, ýöne tawbada çalt we tüýs ýürekden gaýdyp gelýär. Adamyň kyssasy, Şeýtanyň ýeke-täk ýaragy pyşyrdap, yglan edilen, açyk duşmandygyny öwredýär; Jogap Allany ýatlamak we bagyşlanmagyny gözlemekdir. Adam atadan başlap, ýere inmek jeza däl-de, eýsem adamzadyň hakyky synagy üçin basgançakdyr.",
    ],
    profile: {
      nation: "Irki adamzat",
      location: "Jannah soň ýer",
      era: "Adamzat taryhynyň başlangyjy",
      mission: "Tewhidi we ilkinji adamlara Allaha boýun bolmagy öwrediň.",
      challenges: [
        "Iblisiň duşmançylygy",
        "Earthere inenden soň ýaşaýyş",
        "Ilkinji adam maşgalasyna ýol görkezmek",
      ],
      miracles: ["Ene-atasyz Allanyň emri bilen ýaradylyş", "Hemme zadyň atlaryny öwretmek"],
      majorEvents: [
        "Adam atanyň ýaradylyşy we atlaryň öwredilmegi",
        "Perişdeleriň setrde etmegi we Iblisiň ýüz öwürmegi",
        "Bagdaky süýşmek, çyn ýürekden toba etmek we ýere düşmek",
      ],
      lessons: [
        "Ynsan abraýy jogapkärçilik bilen birleşýär",
        "Tüýs ýürekden toba islendik ýalňyşlykdan soň gapyny açýar",
        "Şeýtan aç-açan, hemişelik duşmandyr",
      ],
      facts: [
        "Adam ilkinji adam we ilkinji pygamberdir",
        "Onuň toba etmegi, Gurhanyň ilkinji tawba nusgasydyr",
      ],
    },
    quran: [
      {
        excerpt:
          "Perwerdigäriňiz perişdelere: «earther ýüzünde yzygiderli ygtyýarlyk ederin» diýende, agzap geçiň ... Soňra Adam Rebbiniň sözlerini aldy we toba etdi.",
      },
      {
        excerpt:
          "Diýdiler: Rebbimiz, özümize zulum etdik, eger bizi bagyşlamasaň we bize rehim etmeseň, hökman ýitirenleriň arasynda bolarys.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kyýamat güni adamlar Adam atanyň ýanyna gelip: “Sen adamzadyň atasysyň; Rebbiň bilen bize şepagat et.",
      },
      {
        excerpt:
          "Adam we Musa jedel etdiler. Musa aýtdy: Allanyň eli bilen ýaradan sen. Adam aýtdy: Allatagala meni ýaratmazdan ozal maňa beren bir işi üçin meni günäkärleýärsiňmi? Şonuň üçin Adam jedelde Musadan üstün çykdy.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Idris (AS)",
    summary: "Hakyky pygamber sabyr üçin öwdi we Allatagala belent belentlige çykardy.",
    body: [
      "Idris (sallaLlahu aleýhi we sellem) diňe Gurhanda gysga ýatlanylýar, ýöne ol hakda her söz öwgi. Allah oňa 'hakykat adamy, pygamber' diýýär (Gurhan 19:56) we Ysmaýyl we Zul-Kifl bilen birlikde sabyrly we dogruçyllaryň hataryna girýär (Gurhan 21: 85–86). Hekaýasy, Allanyň huzurynda adamyň häsiýeti - dogruçyllyk, sabyrlylyk, yhlas bilen ybadat etmek - terjimehalynyň uzynlygyndan has möhümdigini görkezýär.",
      'Allah Ol hakda: We Ony beýik belentlige çykardyk "(Gurhan 19:57). Alymlar muňa Alla bilen ýokary derejesini görkezmek üçin düşündiler. Gurhanyň we hakyky habarlaryň tassyklaýan zatlaryndan başga-da, Idris bilen baglanyşykly meşhur ertekiler (ruçka bilen ilkinji ýazan ýa-da belli bir dünýä hünärleri ýaly) dogry subutnamalar arkaly döredilmeýär, şonuň üçin seresaply imanly adam bezeg däl-de, wahy tassyklaýan zady saklaýar.',
      "Idrisiň sapagy, Allaha ýakynlygyň şöhrat ýa-da uzyn hekaýa bilen däl-de, eýsem yhlas we yzygiderlilik bilen ölçelmegidir. Quietuwaş, dogruçyl, tutanýerli hyzmatkär, atlarynyň taryhyny gaty ýada salýanlardan has ýokary bolan Allah bilen duralga saklap biler.",
    ],
    profile: {
      era: "Adam atadan soňky nesiller",
      mission: "Adamlary hakykata we dogruçyllyga ybadat etmäge çagyryň.",
      lessons: [
        "Dogruçyllyk hyzmatkäriň derejesini ýokarlandyrýar",
        "Her pygamberiň kyssasy jikme-jik däl - bu dizaýn boýunça",
        "Dowamly, wepaly yzygiderlilik Allany söýýär",
      ],
      facts: [
        "Gurhanda hakykat we pygamber hökmünde atlandyryldy",
        "Allah tarapyndan belent belentlige çykarylandygy hökmünde suratlandyrylýar",
      ],
    },
    quran: [
      {
        excerpt:
          "Idris kitabynda agzap geçiň. Hakykatdanam, ol hakykat adamy we pygamberdi. Ony beýik belentlige çykardyk.",
      },
      {
        excerpt:
          "Ismail, Idris we Dhul-Kifl - hemmesi hassady. Olary merhemetimize kabul etdik. Dogrudanam, olar dogry adamlardy.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nuh (AS)",
    summary: "Silden birnäçe asyr öň öz halkyny çagyran adatdan daşary sabyrly habarçy.",
    body: [
      "Nuh (sallallahu aleýhi wesellem) tewhidi taşlap, butlara çokunýan halka iberildi. Singleeke-täk sarsmaz habary: 'Eý, halkym, Allaha ybadat ediň; Ondan başga hudaýyňyz ýok '(Gurhan 7:59). Gurhan Nuh süresindäki tabşyryk barada öz hasabatyny ýöredýär: olary gije-gündiz, köpçülige we gizlinlikde çagyrdy, höweslendirdi we duýduryş berdi - Allaha ýüzlenmegiň ýagyş, baýlyk, çagalar we baglar getirýändigini ýada saldy. Yetöne nesilden-nesle köpler ýüz öwrüp, barmaklaryny gulaklaryna saldylar we has ulumsy boldular (Gurhan 71: 1–28).",
      "Gurhan sabyrlylygynyň uzynlygyny nygtaýar: olaryň arasynda 'müň ýyl elli ýaşa ýetmedi' (Gurhan 29:14), henizem ynanýanlar az. Indi imany kabul etmejekdigi belli bolansoň, Allah kapyrlary masgaralap ýörkä, ylahy görkezme bilen gämi gurmagy buýurdy. Soňra suw joşmalary höküm hökmünde geldi. Nuhuň ogly kakasynyň duýduryşyna görä bir daga bil baglap, münmekden ýüz öwürdi we gark bolanlaryň arasynda - gan baglanyşyklarynyň imanyň ornuny tutup bilmejekdigini ýatladýan ýatlatma (Gurhan 11: 42–46).",
      "Nuhuň kyssasy, Gurhanyň dawahdaky ussatlygydyr: jaň edeniň borjy çyn ýürekden, sabyrly we aç-açan gowşurylýar - netijeler diňe Allaha degişlidir. Şeýle hem, ýol görkezmegiň nesil däl-de, ýürek meselesidigini öwredýär: pygamberiň ogly ýitip biler, nätanyş adamlar halas bolup biler. Gämä münen imanlylar täzelenen adamzadyň tohumy boldular we Nuh berk çözgütleriň iň uly bäş habarçysynyň biri hökmünde hormatlandy (ulul-azm).",
    ],
    profile: {
      nation: "Suwdan öň halky",
      location: "Gadymy Mesopotamiýa sebiti (giňişleýin getirilýär)",
      era: "Gadymy döwür",
      mission: "Halkyny taharet we toba çagyr.",
      challenges: [
        "Leadersolbaşçylaryň we elitanyň üstünden gülmek",
        "Az sanly imanlylar bilen ýüzlerçe ýüz öwürmek",
        "Öz oglunyň ynamsyzlygy we gark bolmagy",
      ],
      miracles: ["Gämi ylahy görkezme bilen guruldy", "Möminleriň suwdan halas bolmagy"],
      majorEvents: [
        "Tewhide çagyryş müň ýyla golaý dowam edýär",
        "Allanyň emri bilen gäminiň gurluşygy",
        "Suw we imanlylar üçin täze başlangyç",
      ],
      lessons: [
        "Dawa-da tutanýerlilik, netijeleri Allaha galdyrmak",
        "Maşgala gatnaşyklary imanyň ýerini tutup bilmez",
        "Allah hemişe yhlaslylary halas edýär",
      ],
      facts: [
        "Berk çözgütli bäş habarçynyň biri (ulul-azm)",
        "Hekaýa, köp sürelerde, şol sanda adyny göterýänlerde-de duş gelýär",
      ],
    },
    quran: [
      {
        excerpt:
          "Nuh-a, eýýäm iman edenlerden başga hiç biriňiziň ynanmajakdygy aýan edildi, şonuň üçin eden işleri bilen gynanmaň.",
      },
      {
        excerpt:
          "Ol: Lorda Reb, hakykatdanam halkymy gije-gündiz çagyrdym, ýöne çakylygym olary diňe uçuşda artdyrdy.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Adamlar Nuhuň ýanyna gelip: “Nuh, sen ýer ýüzüne iberenleriň ilkinjisiň, Allah saňa minnetdar hyzmatkär diýip at berdi; biziň üçin şepagat ediň.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Hud (AS)",
    summary: "Güýjüni ulumsylyga öwürýän güýçli we beýik adamlar 'Mahabata iberildi.",
    body: [
      "Hud (sallallahu aleýhi wesellem) halkyna iberildi, Gurhanyň fiziki taýdan kuwwatly we beýik, çylşyrymly gurluşlary gurmak bilen meşhur bolan “bu ýurtda hiç haçan döredilmedi” (Gurhan 89: 6–8). Bu buýsançly adamlara Hud her pygamber ýaly bir habar getirdi: 'Eý, halkym, Allaha ybadat ediň; Ondan başga hudaýyňyz ýok. Ondan gorkmaýarsyňyzmy? \" (Gurhan 7:65). Ol hiç hili sylag soraman, diňe minnetdarlyga we sütemden uzak durmaga çagyrýardy.",
      "Leadersolbaşçylary masgaralap jogap berdiler, akmaklykda we ýalan sözlemekde, ata-babalarynyň butlaryna ýapyşmakda aýypladylar. Hiç bir güýç öz güýjüne laýyk bolup bilmejekdigine ynam edip, duýduryş beren jezasyny bermegi talap etdiler (Gurhan 46: 21-25). Hud olara dünýä güýjüniň we beýik siwilizasiýanyň Allanyň alamatlaryny inkär edýän we ýer ýüzünde ulumsylyk edýän adamy goramaýandygyny aç-açan duýdurdy.",
      "Bu höküm Allanyň olara ýedi gije we sekiz gün yzly-yzyna ýüklän (Gurhan 69: 6-7) gazaply we öwüsýän şemal boldy, bir wagtlar kuwwatly adamlary çukur ýaly ýykyldy, Hud we imanlylar bolsa Allanyň rahmeti bilen halas edildi. “Mahabat” kyssasy Gurhanda hemişelik duýduryş hökmünde gaýtalanýar: güýç, baýlyk we üstünlik buýsanç däl-de, kiçigöwünlilik we minnetdarlyk bilen garşylanmaly sowgatlardyr. Bir millet näçe ösenem bolsa Allaha hasabat berýär.",
    ],
    profile: {
      nation: "Mahabat adamlary",
      location: "Al-Ahqaf sebiti (nusgawy tafsirde günorta arap sebiti)",
      era: "Nuhdan soň",
      mission: "Mahabatyň arasynda tawhidi, minnetdarlygy we adalaty dikeldiň.",
      challenges: [
        "Güýç we baýlyga esaslanýan köpçülikleýin ulumsylyk",
        "Ylham we pygamberiň üstünden gülmek",
        "Derrew jeza berilmegini talap etmek",
      ],
      miracles: ["Jeza wagtynda imanlylary goramak"],
      majorEvents: [
        "Toba we minnetdarlyga çagyryş",
        "Güýçli ýeliň duýduryşy",
        "Sevenedi gije we sekiz günüň dowamynda mahabatyň ýok edilmegi",
      ],
      lessons: [
        "Pespälliksiz güýç heläkçilige eltýär",
        "Milletler we siwilizasiýalar Allanyň öňünde hasabat berýärler",
        "Pygamberlik duýduryşlary hökümden öň iberilen rehimdir",
      ],
      facts: ["'Mahabat' kyssasy, jemagatlara duýduryş hökmünde Gurhanda gaýtalanýar"],
    },
    quran: [
      {
        excerpt:
          "Mahabat üçin bolsa dogany Hudany iberdik. Ol: «Eý, halkym, Allaha ybadat ediň! Ondan başga hudaýyňyz ýok. Ondan gorkmaýarsyňyzmy?",
      },
      {
        excerpt:
          "Jülgelerine ýakynlaşýan bulut ýaly görenlerinde: Bu bize ýagyş getirýän bulut! Has dogrusy, sabyrsyzlyk eden zadyňyz: içindäki ýel agyr jeza.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Salih (AS)",
    summary: "Düýäniň gudraty berlen we talap eden belgisini ýok eden Tamuda iberildi.",
    body: [
      "Salih (sallaLlahu aleýhi we sellem) “Ad” -yň ornuny alan we daglara uly öýleri oýmak we rahat ýaşamak bilen meşhur bolan Tamuda iberildi (Gurhan 7:74). Olary öz doganlary hökmünde diňe Allaha ybadat etmäge we ýolbaşçylarynyň bozuklyklaryndan ýüz öwürmäge çagyrdy. Onuň dogrudygyny subut etmek üçin bir nyşan talap edenlerinde, Allatagala aç-açan we aç-açan bir düýe berdi: bir düýe, bir günde içmeli, beýlekisi bolsa içmeli (Gurhan 26: 155-156).",
      "Salih olara aç-açan duýduryş berdi: 'Oňa zyýan ýetirmäň, ýogsa ýakyn jeza alarsyňyz' (Gurhan 26: 156). Bu alamat, sabyr synagydy - Allah tarapyndan kesgitlenen çäkden hormat goýup bilermi? Themöne olaryň arasynda iň äsgermezçilik edip, düýäni aç-açan gozgalaňda öldürdi, soň bolsa Salyhy wada berlen jezany bermäge çagyrdy (Gurhan 7:77). Düýäniň öldürilmegi betbagtlaryň hereketi diýlip atlandyrylýar, ýöne muňa razy bolmak bilen tutuş halk jenaýat işine gatnaşdy.",
      "Jeza üç günüň içinde boldy: öýlerinde güýçli partlama we ýer titremesi boldy, Thamud jansyz galdy - Allah Salihi we iman edenleri halas etdi (Gurhan 7: 78–79; 91:14). Sapak ýiti: gudratlar bir ýüregi ýumşatmaýar; jogapkärçiligiň paýyny ýokarlandyrýarlar. Soralýan we soň kemsidilen bir belgi, talap edenlere garşy jedele öwrülýär. Evilamanlygyň öňünde dymmak bitaraplyk däl - birnäçe adamyň eden işi üçin tutuş bir halk jogapkärdi.",
    ],
    profile: {
      nation: "Tamud halky",
      location: "Al-Hijr / demirgazyk-günbatar Arabystan",
      era: "'Mahabatdan soň",
      mission: "Tamudy butparazlykdan we korrupsiýadan tähidlige çagyryň.",
      challenges: [
        "Gudrata isleg, soň bolsa ony ret etmek",
        "Açyk alamat berlenden soň aç-açan boýun egmezlik",
        "Salih we imanlylara garşy haýbatlar",
      ],
      miracles: ["Düýe Alladan görünýän alamat hökmünde iberildi"],
      majorEvents: [
        "Düýäniň we umumy suwuň görnüşi",
        "Düýäniň gysylmagy we öldürilmegi",
        "Partlaýjylary ýok eden partlama",
      ],
      lessons: [
        "Gudratlar bir ýüregiň peýdasyna däl",
        "Allah tarapyndan kesgitlenen çäkden çykmak hakyky netijelere getirýär",
        "Evilamanlyga razy bolmak günäsinde paýlaşýar",
      ],
      facts: ["Tamud daglara ajaýyp jaýlary oýmak bilen tanalýardy"],
    },
    quran: [
      {
        excerpt:
          "Bu siziň üçin alamat hökmünde Allanyň düýeidir, şonuň üçin ony Allanyň topragynda iýmäge goýuň we oňa zyýan ýetirmäň, ýogsa agyr jeza sizi alar.",
      },
      {
        excerpt:
          "Tamud, iň betbagtlary iberilende, eden etmişleri sebäpli inkär etdi ... Şeýdip, Perwerdigärleri günäleri üçin olary ýok etdi we deňleşdirdi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ybraýym (AS)",
    summary:
      "Allanyň dosty we arassa tewhidiň nusgasy bolan Halylla her synagda synagdan geçdi we ýeňiş gazandy.",
    body: [
      "Ybraýym (sallaLlahu aleýhi we sellem) Gurhanyň pikirlenmek we gaýduwsyzlyk bilen gazanylan arassa monoteizmiň iň ýokary nusgasydyr. Jemgyýetde butlara çokunýan bir ýaş ýigit hökmünde öz halky, kakasy we hatda patyşa bilen aç-açan pikir alyşdy: gün, aý we ýyldyzlar hemmesi ýitip gitdi we nädip hudaý bolup biler? (Gurhan 6: 75–79). Butlaryň güýçsüzdigini paş etmek üçin, iň ulusyndan başga hemmesini döwdi we öz halkyna butlaryň özlerinden näme bolandygyny soramagyny buýurdy - hudaýlaryny gürläp ýa-da gorap bilmejekdigini boýun almaga mejbur etdi (Gurhan 21: 57–67).",
      'Bu stend üçin ol ýanýan oda taşlandy, ýöne Allah: "Eý, ot, Ybraýyma salkynlyk we howpsuzlyk" buýurdy (Gurhan 21:69) we zyýansyz çykdy. Ömri, bütinleý boýun egmek bilen synaglaryň zynjyryna öwrüldi: Allanyň razylygy üçin watanyny terk etdi, garrylyk döwründe dogruçyl nesiller üçin doga etdi we Ysmaýyla we Yshaga berildi, söýgüli ogluny gurban bermek buýrugy bilen synag edildi - Alla oglany halas etmezden ozal kabul eden kekbäniň esaslaryny Ysmaýyl bilen doga etdi. 2: 124–129; 37: 100-107).',
      "Deňi-taýy bolmadyk wepalylygy sebäpli Allatagala Ybraýymy ýakyn dost hökmünde kabul etdi (Gurhan 4: 125) we ony ymam, bütin adamzat üçin lider etdi (Gurhan 2: 124). Mirasy öz neslinden gelen pygamberlerden, Haj dessurlaryndan we hakykata tarap ymtylýan Ybraýym dinine eýermegi buýran musulmanyň şahsyýeti arkaly dowam edýär (Gurhan 3:95). Hekaýasy iň kyn synaglarda tawakkuly, hakyky ýolbaşçylygyň gurbanlyga esaslanýandygyny we çyn ýürekden imanyň ähli nesilleri üýtgedip biljekdigini öwredýär.",
    ],
    profile: {
      nation: "Mezopotamiýa we Lewantin jemgyýetleri",
      location: "Yrak, Lewant we Mekge",
      era: "Orta gadymy",
      mission: "Arassa tawhidi janlandyryň we boýun egmegiň dowamly mirasyny dörediň.",
      challenges: [
        "Butparazlara, öz kakasyna we zalym patyşa garşy durmak",
        "Alla üçin watanyndan uzaklaşmak",
        "Söýgüli ogluny gurban bermek synagy",
      ],
      miracles: [
        "Allanyň emri bilen ot sowuk we howpsuz boldy",
        "Garrylykda berlen dogry nesiller",
      ],
      majorEvents: [
        "Jedel etmek we butlary döwmek",
        "Oda taşlandylar we gowşuryldy",
        "Ysmaýyl bilen Käbäni gurmak we uly gurban synagy",
      ],
      lessons: [
        "Iň agyr synaglarda Tawakkul (Allaha bil baglamak)",
        "Hakyky ýolbaşçylyk gurban talap edýär",
        "Tüýs ýürekden iman nesilleri üýtgedip biler",
      ],
      facts: [
        "Allanyň ýakyn dosty Halilullah hökmünde tanalýar",
        "Ysmaýyl we Yshak arkaly pygamberleriň atasy",
      ],
    },
    quran: [
      {
        excerpt:
          "Ybraýym Rebbi buýruklar bilen synagdan geçirilende, olary ýerine ýetirdi. Ol: Hakykatdanam, men sizi halk üçin lider ederin.",
      },
      {
        excerpt:
          "Diýdik: Eý, ot, Ybraýyma salkynlyk we howpsuzlyk bol. Oňa zyýan bermek islediler, ýöne biz olary iň uly ýitgiler etdik.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Arealaňaç, ýalaňaç we sünnetsiz ýygnanarsyňyz. Kyýamat güni ilkinji bolup geýnen Ybraýym bolar.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Lut (AS)",
    summary:
      "Öz halkyna hiç bir milletiň etmedik agyr ahlaksyzlygy barada duýduryş beren pygamber.",
    body: [
      'Lut (sallaLlahu aleýhi we sellem) Ybraýymyň döwürdeşi we garyndaşydy, özi bilen göçüp, soňra Sodomyň we ýakyn şäherleriň ilatyna iberildi. Diňe Allaha ybadat etmek çagyryşy bilen bir hatarda, halky utançsyz ahlaksyzlykda günäkärdi, Gurhan "dünýäde hiç kim beýle zat etmedi" diýýär - aýallaryň ýerine erkekleriň ýanyna baryp, ýygnanyşyklarynda aç-açan ahlaksyz hereket edýär (Gurhan 7: 80–81; 29: 28–29). Lut olary çyn ýürekden, arassalyga we Allanyň bellän tebigy çäklerine çagyrdy.',
      "Olar öz reformasyny jedel bilen däl-de, duşmançylyk bilen garşyladylar, kowuljakdyklaryny aýdyp, edep-terbiýe çagyryşyny masgaraladylar: 'Olary şäheriňizden kowuň; özlerini arassa saklaýan adamlar! ' (Gurhan 7:82). Hatda öz öýünde-de kazyýet işi agyr boldy - aýaly korrumpirlenenleriň tarapyny tutdy we ynanmady, Allanyň ýol görkezýändigini we nika ýa-da gan arkaly miras galmaýandygyny ýene bir gezek subut etdi (Gurhan 66:10).",
      "Karar gelende, Allah perişdeleri myhman görnüşinde iberdi. Adamlar hatda özlerine zyýan bermek üçin howlukdylar, Lut perişdeler şahsyýetini açýança we imanlylar bilen gije gitmelidigini aýdýança özüni güýçsiz duýdy. Daň atanda şäherler agdaryldy we daşlar atyldy (Gurhan 11: 77–83). Lutuň kyssasy, jemgyýetiň günäni makullaýandygy we ony köpçülige kadalaşdyrýandygy sebäpli ahlak hakykatynyň üýtgemejekdigi we Allatagala ak ýürekli adamlary az bolsa-da halas edýär.",
    ],
    profile: {
      nation: "Sodomyň we goňşy şäherleriň adamlary",
      location: "Öli deňziň sebiti (giňişleýin getirilýär)",
      era: "Ybraýymyň wagty",
      mission: "Halkyny aç-açan ahlaksyzlykdan we imansyzlykdan tämizlige we arassalyga çagyryň.",
      challenges: [
        "Köpçüligiň ahlaksyzlygy",
        "Masgaralamak we kowmak howpy",
        "Aýalynyň ynamsyzlygy",
      ],
      majorEvents: [
        "Erbetlige garşy yzygiderli duýduryşlar",
        "Myhmanlar ýaly geýnen perişdeleriň sapary",
        "Şäherleriň agdarylmagy",
      ],
      lessons: [
        "Ahlak hakykaty sosial makullamak bilen üýtgemeýär",
        "Iman edenler gaty az bolup biler",
        "Allah ak ýürekli adamlary köpçülikleýin heläkçilikden halas edýär",
      ],
      facts: ["Ybraýymyň garyndaşy, özi bilen göçüp, Sodoma iberildi"],
    },
    quran: [
      {
        excerpt:
          "Dünýäleriň arasynda erkeklere ýakynlaşyp, Rebbiňiziň size ýaradan zatlaryny ýoldaş hökmünde goýýarsyňyzmy? Has dogrusy, sen hyýanatçy halk.",
      },
      {
        excerpt:
          "Şeýdip, buýrugymyz gelende, şäherleriň iň beýik bölegini iň pes derejä çykardyk we olara gaty toýun daşlaryny ýagdyrdyk.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ysmaýyl (AS)",
    summary: "Sözüne wepaly bir pygamber, synagda sabyrly we kakasy Ybraýym bilen Käbäni gurujy.",
    body: [
      "Ysmaýyl (sallallahu aleýhi wesellem) garrylyk döwründe Ybraýymyň ilkinji ogly boldy. Ömri haýran galdyryjy ynam synagy bilen başlandy: Allanyň emri bilen Ybraýym bäbek Ysmaýyly we ejesi Hajary Makka jülgesinde ekin ösdürip ýetişdirmedik we suw akmaýan ýerde goýdy. Hajar Safa we Marwah depeleriniň arasynda suw gözläp ylgap barýarka, Alla Zamzam çeşmesiniň döremegine sebäp boldy - Hajaryň nesilleriniň we her bir zyýaratçynyň şu güne çenli Haj we Umranyň saýalarynda täzeden hereket etmegi.",
      "Ysmaýyl ýaş wagtynda kakasy bilen birlikde iň uly synag bilen ýüzbe-ýüz bolupdy: Ybraýym oňa gurban bermek hakda aýdanynda, Ysmaýyl haýran galdyryjy jogap berdi: 'Eý, kakam, buýruşyň ýaly et; Alla islese, meni tutarsyň \"(Gurhan 37: 102). Ikisi-de doly boýun egdiler we Allah Ysmaýyla gulak asyp, ebedi hormat goýdy. Soňra kakasy we ogly Käbäniň düýbüni bir ýere jemlediler we doga etdiler: 'Lorda Reb, muny bizden kabul et; hakykatdanam Sen eşidýän, bilýänsiň “(Gurhan 2: 127).",
      "Gurhan öz häsiýetini ýatda saklamaly bir setirde jemleýär: 'Ol beren wadasyna wepalydy, habarçy we pygamberdi. Ol maşgalasyna doga we zekat etmegi buýurýardy we Rebbiniň göwnünden turýardy '(Gurhan 19: 54–55). Ysmaýylyň durmuşy, sözüni berjaý etmegiň, berk ybadat etmegiň we Allaha boýun bolmakda hyzmatdaşlyk edýän maşgalanyň gözelligini öwredýär. Onuň üsti bilen arap pygamberlik setiri iň soňky pygamber Muhammet reached ýetdi.",
    ],
    profile: {
      nation: "Mekge sebitiniň ilkinji adamlary",
      location: "Mekge",
      era: "Ybraýym göçenden soň",
      mission: "Töwhid we ybadat etmegi goldaň we maşgalasyna doga we zekat etmegi buýruň.",
      challenges: [
        "Örän jülgede durmuşyň agyr başlangyçlary",
        "Gurban kesmek synagy",
        "Ybadata esaslanýan durmuşy we mukaddes ynamy saklamak",
      ],
      miracles: ["Zamzam çeşmesi çölde üpjün edildi", "Allanyň gurbanlygyndan halas edildi"],
      majorEvents: [
        "Ejesi Hajar bilen Mekge jülgesinde galdy",
        "Gurban kesmek synagy doly boýun egdi",
        "Ybraýym bilen Käbäni gurmak",
      ],
      lessons: [
        "Wadalaryňyzy wepaly ýerine ýetiriň",
        "Maşgala ybadat we boýun bolmakda hyzmatdaşlyk edip biler",
        "Mukaddes miras güýçli häsiýet talap edýär",
      ],
      facts: [
        "Gurhanda beren wadasyna wepaly hökmünde suratlandyryldy",
        "Arap taýpalarynyň atasy we soňky pygamberlik ugry",
      ],
    },
    quran: [
      {
        excerpt:
          "Ysmaýyl kitabynda agzap geçiň. Hakykatdanam, beren wadasyna wepaly bolup, habarçy we pygamberdi. Ol maşgalasyna doga we zekat etmegi buýurýardy we Rebbiniň göwnünden turýardy.",
      },
      {
        excerpt:
          "Ybraýym öýüň we Ysmaýylyň düýbüni tutanda, dileg etdiler: Rebbimiz, muny bizden kabul et. Hakykatdanam, Sen eşidýän, bilýän.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Yshak (AS)",
    summary: "Ybraýym we ubakubyň atasy bolan mübärek pygamber.",
    body: [
      "Yshak (sallaLlahu aleýhi we sellem) Ybraýym we aýaly Sara garrylyk döwründe dünýä indi - çaga dogurmak ýaşyndan geçen Sara geň galyp, perişdeler tarapyndan şatlykly habar hökmünde yglan edildi. Gurhan pursaty ýazýar: 'Biz oňa Yshak hakda, Yshakdan soň ubakup hakda gowy habar berdik' (Gurhan 11:71). Onuň dünýä inmegi, Allanyň gudratynyň we rehim-şepagatynyň adaty ynsan çäkleri bilen baglanyşykly däldigini we kyn umytda garaşýan her bir imanly üçin teselli boldy.",
      "Gurhan Yshagy dogruçyl, saýlanan we asylly pygamberleriň arasynda yzygiderli atlandyrýar we özüne we ubakuba “ybadat we görüşde güýç” berilendigini aýdýar (Gurhan 38: 45–47). Yshagyň üsti bilen ubakup (Ysraýyl) geldi we ubakupdan Bani Ysraýyla iberilen uzyn pygamberler zynjyry geldi, şonuň üçin Yshak pygamberlik atasy bolup, nesilleriň arasynda dowamlylygyň baglanyşygy bolup durýar.",
      "Hekaýasy gysgaça aýdylsa-da, iki sany dowamly sapak alýar: Allanyň garaşýan zatlarymyzdan has köp beren sowgatlaryna minnetdarlyk we dogruçyl nesil ynamdygyna ynanmak - iman diňe miras däl-de geçmeli. Ybraýymyň maşgalasynda goýlan nygmat, Allaha bagyşlanan bendeler tarapyndan göterilipdi.",
    ],
    profile: {
      nation: "Lewantin jemgyýetleri",
      location: "Lewant (Şam)",
      era: "Ybraýymdan soň",
      mission: "Ybraýymyň mübärek maşgalasynda pygamberlik görkezmesini dowam etdiriň.",
      miracles: ["Garry ene-atalara dogluş şatlykly habar hökmünde yglan edildi"],
      majorEvents: [
        "Ybraýyma we Sara berlen hoş habar",
        "Yakubyň üsti bilen pygamberlik nesliniň dowamy",
      ],
      lessons: [
        "Allah ynsanyň garaşyşyndan has köp peşgeş berýär",
        "Dogry nesil saklanmaly ynamdyr",
        "Wepaly yzygiderlilik ýoly dowam etdirýär",
      ],
      facts: [
        "Ubakubyň kakasy",
        "Ybraýym we ubakup bilen bilelikde saýlanan maşgala hökmünde atlandyrylýar",
      ],
    },
    quran: [
      {
        excerpt:
          "Aýaly durdy, ol güldi. Soňra oňa Yshak we Yshakdan soň ubakup hakda gowy habar berdik.",
      },
      {
        excerpt:
          "Güýçli we görüşli gullarymyz Ybraýym, Yshak we ubakuby ýada salyň. Hakykatdanam, olary aýratyn hil üçin saýladyk: Öýi ýatlamak.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qakup (AS)",
    summary:
      "Ysraýyl, hasrat bilen ajaýyp sabyrlylygy Allaha bolan ynamy sarsmaz pygamber hem diýilýär.",
    body: [
      "Ysraýyl diýilýän ubakup (sallallahu aleýhi wesellem) Yshagyň ogly we Bani Ysraýylyň taýpalaryna öwrülen on iki adamyň atasy, şol sanda Yusufusup. Çagalaryny tewhidde ulaltdy we Gurhan ölüm düşeginde olardan alan ähtini goraýar: 'Menden soň näme ybadat edersiň?' Olar: God Hudaýyňyzy we ata-babalaryňyzyň Hudaýyny ybadat ederis ... bir Hudaýa we Oňa boýun bolarys “diýip jogap berdiler (Gurhan 2: 132–133). Iň çuňňur aladasy, ahyryna çenli geljek nesilleriň imanydy.",
      "Uly synag Yusufusufyň hekaýasynda bolup geçýär. Ogullary Yusufusubyň köýnegi we möjegiň ony iýendigi baradaky ýalan sözler bilen gaýdyp gelenlerinde, ubakup aldawdan görüp, gahar-gazap bilen däl-de, sabyrlylyk bilen jogap berdi: 'Şonuň üçin sabyr etmek iň ýerliklidir we suratlandyrýan zadyňyza kömek gözleýän Alladyr' (Gurhan 12:18). Uzak ýyllap aýralykda, Gurhanyň aç-açan aýdyşy ýaly, gözleri hasratdan ak reňk alýança gynandy, ýöne hasratyny basdy we hiç haçan umytdan düşmedi (Gurhan 12:84).",
      "Ubakubyň mysalynyň ýüregi bir söz: 'Allanyň rahmetinden umytdan düşmäň; Hakykatdanam, kapyr adamlardan başga hiç kim Allanyň rahmetinden umyt etmez '(Gurhan 12:87). Sabr jamiliň nusgasy - owadan sabyr - bu passiw işden çykmak däl-de, eýsem Allanyň hikmetiniň öz wagtynda ýüze çykjakdygyna ynamly ynam. Yusufusup ahyrsoňy özüne dikeldilip, gözleri gaýdyp gelende, bu sabyrlylyk aklandy. Ubakup her bir gynanýan imanlyny hasraty we ynamy bir ýürekde saklamagy öwredýär.",
    ],
    profile: {
      nation: "Bani Ysraýylyň gelip çykyşy",
      location: "Müsüre göçmek bilen Lewant",
      era: "Yusufusufyň nesli",
      mission: "Öý hojalygyny we nesillerini tawhide ýol görkez.",
      challenges: [
        "Ogullarynyň arasynda dartgynlyk we gabanjaňlyk",
        "Yusufusufdan uzak aralyk",
        "Umydyny ýitirmän çuňňur hasrat çekmek",
      ],
      majorEvents: [
        "Ogullaryna beren maslahaty we ähti",
        "Yusufusuf üçin uzak ýyllap sabyrly hasrat",
        "Yusufusup bilen Müsürde şatlykly duşuşyk",
      ],
      lessons: [
        "Owadan sabyr (sabr jamil) işjeň, umytly imandyr",
        "Ene-atalar çagalarynyň iman mirasyny emele getirýärler",
        "Allanyň rahmetinden hiç haçan umytdan düşmäň",
      ],
      facts: ["Ysraýyl diýilýär", "Yusufusufyň we Bani Ysraýyl taýpalarynyň kakasy"],
    },
    quran: [
      {
        excerpt:
          "Ol: Has dogrusy, ruhlaryňyz sizi bir zada çekdi. Şonuň üçin sabyr etmek iň ýerliklidir. Belki, Allah hemmesini meniň ýanyma getirer.",
      },
      {
        excerpt:
          "Olar: Hudaýyňyzy we ata-babalaryňyzyň Hudaýy Ybraýymyň, Ysmaýylyň we Yshagyň ýeke-täk Taňrysyna ybadat ederis we Oňa tabyn bolýarys diýdiler.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yusufusuf (AS)",
    summary:
      "Guýudan Müsüriň tagtyna barýan syýahat arassalygy, sabyrlylygy we bagyşlamagy öwredýär.",
    body: [
      "Yusufusuf (sallaLlahu aleýhi we sellem) Gurhanyň iň doly kyssasy - Yusufusuf süresi, Allatagalanyň “hekaýalaryň iň gowusy” diýip atlandyrmagydyr (Gurhan 12: 3). Oglan wagty on bir ýyldyzyň, Günüň we Aýyň özüne seatedde edýän hakyky arzuwyny gördi. Gabanýan doganlary ony guýa taşladylar we Müsürdäki gulçulyga satdylar we güýçli wezipeli adamyň öýüne satyn aldylar. Yusufusup her bir tersine, imanyny we bitewiligini goraýardy.",
      'Arassalygy hojaýynynyň aýaly ony azdyrjak bolanda synag edildi. Ol: "Allanyň gaçybatalgasyny gözleýärin" diýmekden boýun gaçyrdy we türmäni günä etmekden ileri tutdy: "Türme meni çagyranlaryndan has gowy görýär" (Gurhan 12:33). Bigünä bolsa-da, ençeme ýyllap türmede oturdy - hatda şol ýerde-de beýleki tussaglaryny arzuwlaryny düşündirmek we düşündirmek üçin çagyrdy. Patyşanyň ýedi ýyllyk açlyk baradaky arzuwy köşgi bulaşdyranda, Yusufusubyň Hudaý tarapyndan berlen düşündiriş sowgady ony Müsüriň hazynalaryna gözegçilik edýän patyşanyň huzuryna getirdi. Milleti açlyk we paýhas we adalat bilen dolandyrdy.',
      "Hekaýanyň iň ýokary derejesi güýç däl-de, bagyşlamakdyr. Açlykdan galan doganlary ony tanamaýarka, Yusufusup özüni açyp: «Bu gün saňa günäkär bolmaz. Allah sizi bagyşlar we rehimdarlardan iň rehimlidir '(Gurhan 12:92). Ol Allany ähli ýagşylyklar üçin hasaplady we Perwerdigärini türmeden çykaryp, maşgala birleşende mähirli bolandygyny aýtdy. Yusufusup päkligiň we takwanyň imanly adamy goraýandygyny, Allanyň meýilnamasynyň her bir dildüwşügi ýuwaşlyk bilen ýok edýändigini we bagyşlamak - ar almak däl-de, asyllylaryň nyşanydygyny öwredýär.",
    ],
    profile: {
      nation: "Müsürdäki Bani Ysraýylyň maşgalasy",
      location: "Kengan we Müsür",
      era: "Musadan öň",
      mission: "Jemgyýete hyzmat edende tawhidi, arassalygy we adalaty goldaň.",
      challenges: [
        "Doganlary tarapyndan dönüklik",
        "Synag we ýalan töhmet",
        "Bigünädigine garamazdan uzak möhletli türme tussaglygy",
      ],
      miracles: ["Hakyky düýşi düşündirmek üçin Hudaý tarapyndan berlen sowgat"],
      majorEvents: [
        "Guýy we kakasyndan aýralyk",
        "Türme ýyllary",
        "Müsürde häkimiýete çykyň we maşgalasy bilen duşuşyň",
      ],
      lessons: [
        "Päklik we dogruçyllyk imany goraýar",
        "Bagyşlamak maşgalalary bejerýär",
        "Allanyň meýilnamasy her bir dildüwşükden ýokarydyr",
      ],
      facts: ["Iň oňat hekaýalar diýlip atlandyrylýan Yusufusup süresi, onuň durmuşyna esaslanýar"],
    },
    quran: [
      {
        excerpt:
          "Ol: Şu gün günäkär bolmaz. Alla sizi bagyşlasyn; we rehimdarlardan iň rehimlidir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Asylly, asyllylaryň ogly, asyllylaryň ogly, asyllylaryň ogly: ubakubyň ogly ubakubyň, Yshagyň ogly, Ybraýymyň ogly.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Şuaýb (AS)",
    summary:
      "Söwda bilen dogruçyllygy baglanyşdyran we Madýany aldawçylykdan we adalatsyzlykdan duýduran pygamber.",
    body: [
      "Şuaýb (sallaLlahu aleýhi we sellem) aldaw arkaly ykdysadyýetine zeper ýetiren söwda jemgyýeti Madýan halkyna iberildi: gysga ölçeg we agram bermek, harytlaryny aldamak we ýurtda adalatsyzlyk ýaýratmak. Habary, adamlaryň köplenç aýrylmaga synanyşýan imanyň iki ýarysyny birleşdirdi - ybadat we ahlak: 'Eý, halkym, Allaha ybadat ediň; Ondan başga hudaýyňyz ýok. Adalatda doly ölçeg we agram beriň we adamlary haklaryndan mahrum etmäň '(Gurhan 11: 84–85).",
      "Halky muňa garşy çykyp, doga-dilegleriniň atalarynyň galp däplerinden ýüz öwürmegini we öz baýlyklary bilen isleýşi ýaly etmegini talap edýändigini ýaňzytdy (Gurhan 11:87). Ony masgaraladylar, haýbat atdylar we imanlylary kowmak bilen gorkuzdylar, hatda ýollary beklediler. Şuaýb rehimdarlyk we aç-açan ýatlatmalar bilen dowam etdi, diňe mümkin boldugyça reforma gözleýändigini we üstünliginiň diňe Alladan gelendigini aýtdy: 'Meniň üstünligim diňe Allanyň üsti bilen däl. Oňa bil bagladym, Oňa gaýdyp gelýärin \"(Gurhan 11:88). Halkyny çagyrmakda ussatlygy bilen ýatlanýar.",
      "Olar ret etmeklerini dowam etdirenlerinde, jeza gelip, günäkärleri tussag etdi, Alla bolsa Şuaýb we möminleri halas etdi (Gurhan 7: 91–93). Terjimehaly köplenç ünsden düşürilýän bir sapak berýär: ykdysady dogruçyllyk dinden aýry däl - bu onuň bir bölegi. Bazarda aldamak, ejiz adamlary ulanmak we çäreleri görmek iman meselesidir we adalatsyzlygy kanunlaşdyrýan jemgyýet Allanyň hökümine çagyrýar.",
    ],
    profile: {
      nation: "Madýan halky",
      location: "Demirgazyk-Günbatar Arap / Lewantin söwda sebiti",
      era: "Ybraýymyň nesillerinden soň",
      mission: "Töwhede we söwdada dogruçyllyga we adalata çagyryň.",
      challenges: ["Bazaryň korrupsiýasy", "Elitanyň üstünden gülmek", "Kowulmak howpy"],
      majorEvents: [
        "Doly ölçege we adalatly çemeleşmäge çagyryş",
        "Jemgyýetçilik garşylygy we haýbatlar",
        "Dowam edýänleriň jezasy",
      ],
      lessons: [
        "Iman biznesde dogruçyllygy talap edýär",
        "Jemgyýetdäki adalatsyzlyk ylahy hökümi çagyrýar",
        "Pygamberler diňe bir däp-dessur däl-de, sosial we ykdysady ahlak meselesine ýüzlenýärler",
      ],
      facts: ["Diňe agramlary we ölçegleri nygtamak bilen tanalýar"],
    },
    quran: [
      {
        excerpt:
          "Eý, halkym, Allaha ybadat ediň. Ondan başga hudaýyňyz ýok. Doly ölçeg we agram beriň we adamlary öz haklaryndan mahrum etmäň we ýer ýüzünde korrupsiýa döretmäň.",
      },
      {
        excerpt:
          "Meniň üstünliklerim diňe Allanyň üsti bilen däl. Oňa bil bagladym, Oňa gaýdyp gelýärin.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Aýýub (AS)",
    summary:
      "Gurhanyň sabyr nusgasy: uzak wagtlap dowam eden kesel we ýitgiler bilen wepalylykda sarsmaz.",
    body: [
      "Aýýub (sallaLlahu aleýhi we sellem) - Eýýup - Gurhanda sabryň hemişelik nyşanydyr. Saglyk, baýlyk we maşgala bereketli pygamberdi, soň bolsa olary ýitirmek we uzak we agyr kesel bilen synag edildi. Munuň üsti bilen hiç haçan ajy bolmady ýa-da Rebbini adalatsyzlykda günäkärlemedi; minnetdarlyga we ýatlamaga berk ýapyşdy. Gurhan, bütin hekaýasyny özüne çekýän sözler bilen öwýär: 'Hakykatdanam, biz oňa sabyrly, ajaýyp hyzmatkär tapdyk. Hakykatdanam, ol birnäçe gezek Allaha ýüz tutýardy '(Gurhan 38:44).",
      "Ahyrynda kynçylyklar köpelende, duasynyň ajaýyp edep-terbiýesine üns beriň. Ol Allanyň emrini talap etmedi we arz etmedi. ýönekeý we kiçigöwünlilik bilen öz ýagdaýyny Rebbiniň öňünde goýdy: 'Hakykatdanam, kynçylyklar maňa degdi, Sen rehimdarlaryň iň rehimdarsysyň' (Gurhan 21:83). Soraýan pursatynda Allanyň rehimini tassyklady. Allah oňa şeýle jogap berdi: «Aýagyň bilen ýere ur; bu ajaýyp hammam we içgidir \"-diýip, Ondan merhemet we ybadat edýänlere ýatlatma hökmünde hasraty aýyrdy we maşgalasyny we başga-da köp zatlary dikeltdi (Gurhan 21:84; 38: 41–43).",
      "Aýýub sabyrlylygyň passiw çydamlylyk däl-de, işjeň ybadat görnüşi - synag wagtynda Allaha yzygiderli öwrülmegi öwredýär. Onuň mysaly, du'a nädip edýändigimizi hem kesgitleýär: kiçigöwünlilik bilen, karara şikaýat etmezden we Allanyň rehimine ynam bilen. Ahyry, synagdan geçen her bir imanlyny, iman bilen synaglaryň hyzmatkär derejesini ýokarlandyryp biljekdigine we Allanyň wagty bilen elmydama ýeňilleşdiriljekdigine ynandyrýar.",
    ],
    profile: {
      era: "Ybraýymdan soňky pygamberlik döwri (giň mazmun)",
      mission: "Kynçylykda sabyr etmegi we ybadat etmegi öz halkyna ugrukdyryň.",
      challenges: [
        "Uzak we agyryly kesel",
        "Baýlygyň we maşgalanyň ýitmegi",
        "Uzaga çeken synagda çydamlylyk",
      ],
      miracles: [
        "Allanyň emri bilen şypa we ýeňillik",
        "Synagdan soň maşgalany dikeltmek we bereket",
      ],
      majorEvents: ["Kynçylykda kiçigöwünli ýalbarmagy", "Ylahy ýeňillik, bejeriş we dikeltmek"],
      lessons: [
        "Sabyr ybadatyň işjeň görnüşidir",
        "Du'a kiçigöwünli we arz-şikaýat bolmasa iň owadan",
        "Iman bilen geçirilen synaglar adamyň derejesini ýokarlandyryp biler",
      ],
      facts: ["Yslam däp-dessurlarynda sabr nusgasy hökmünde getirildi"],
    },
    quran: [
      {
        excerpt:
          "Aýýub, Rebbine ýüzlenende: Hakykatdanam kynçylyklar maňa degdi, sen rehimdarlaryň iň rehimdarsysyň.",
      },
      {
        excerpt:
          "Hakykatdanam, biz oňa sabyrly, ajaýyp hyzmatkär tapdyk. Hakykatdanam, ol birnäçe gezek Allaha ýüzlenýärdi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dhul-Kifl (AS)",
    summary: "Dogry pygamber hassanyň arasynda sanady, hekaýasy gysga bolsa-da hormatlandy.",
    body: [
      "Zul-Kifl (sallaLlahu aleýhi we sellem) Gurhanda iki gezek, iki gezek abraýly pygamberler bilen bilelikde atlandyrylýar. Allatagala ony Ysmaýyl we Idris bilen sanawlaýar - 'hemmesi sabyrlydy. Olary merhemetimize kabul etdik. Dogrudanam, olar dogruçyldylar '(Gurhan 21: 85–86) we Ysmaýyl we Al-asaasa bilen birlikde ajaýyplaryň arasynda ýatlaýar' (Gurhan 38:48). Jikme-jik gürrüň berilmese-de, her ýatlama öwgi.",
      "Gurhan we hakyky sünnet onuň durmuşynda giňelmeýändigi sebäpli, nusgawy alymlar hatda esasy jikme-jiklikler bilenem tapawutlanýar - käbirleri musulmanlaryň esasy sanawynda pygamberleriň hataryna girse-de, pygamber ýa-da dogruçyl adamdygyna ynanýarlar. Seresaply imanly adam dymmagy tassyklanmadyk ertekiler bilen doldurmaga garşy çykýar we ýerine Allanyň tassyklaýan zatlaryny saklaýar: sabyrly we dogruçyl, bu ýeterlik hormat.",
      "Onuň goşulmagy asuda sapak berýär: Allaha söýgüli hyzmatkärleriň hemmesi meşhur hekaýany galdyrmaýar. Yzygiderli, wepaly hyzmat - taryhda hiç haçan ýazylmaýan, ýöne Allaha doly mälim bolan görnüş - hut onuň rehim-şepagatyny gazanýan görnüşdir. Gizlin tutanýerlilik pes däl; dogruçyl durmuşyň özenidir.",
    ],
    profile: {
      era: "Soňra Isadan öňki pygamberlik döwürleri (giňden ýerleşdirilen)",
      mission: "Halkyny boýun bolmaga we dogruçyllyga çagyryň.",
      lessons: [
        "Sabyr pygamberlik häsiýetiniň özenidir",
        "Çäklendirilen jikme-jiklikler henizem güýçli ýol görkezýär",
        "Wepaly, görünmeýän hyzmat Allany söýýär",
      ],
      facts: [
        "Näsagyň arasynda Ismail we Idris bilen atlandyrylýar",
        "Esasy musulman sanawlarynda pygamberleriň arasynda sanalýar",
      ],
    },
    quran: [
      {
        excerpt:
          "Ismail, Idris we Dhul-Kifl - hemmesi hassady. Olary merhemetimize kabul etdik. Dogrudanam, olar dogry adamlardy.",
      },
      {
        excerpt: "Ismail, Al-Yasa 'we Dhul-Kifl-i ýadyňyzdan çykarmaň, hemmesi görnükli.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Musa (AS)",
    summary: "Fyrownyň zulmuna garşy çykan we Töwraty alan Bani Ysraýylyň beýik habarçysy.",
    body: [
      "Musa (sallaLlahu aleýhi we sellem) Gurhanda iň köp agzalýan pygamberdir we hekaýasy jikme-jik aýdylýar. Bani Ysraýylyň ogullaryny öldürmek baradaky fyrownyň buýrugy bilen dünýä inen ejesi, Allanyň ylhamy bilen Nil derýasyndaky sebete bäbek bolup ýerleşdirildi we Allanyň meýilnamasy bilen fyrownyň köşgünde ulaldy (Gurhan 28: 7–13). Birnäçe ýyldan soň, Müsürden çykyp, Madýanda durmuşa çykansoň, mukaddes Tuwa jülgesinde Allah ony çagyrdy, şol ýerde Allah göni gürleşdi, hasanyň we eliň nyşanyny görkezdi we dogany Harun bilen zalym fyrownyň ýanyna iberdi (Gurhan 20: 9-36).",
      'Onuň wezipesi iki zady bermekdi: diňe Allaha ybadat etmek we Ysraýylyň ezilen çagalaryny azat etmek islegi. Özüni hudaý hasaplaýan fyrown, oňa garşy çykdy, hatda birgiden aç-açan alamatlardan soň - ýylan bolup, jadygöýleriň hilelerini we gyrgynlaryny ýuwudýan işgärler boýun egmekden ýüz öwürdiler. Musa Bani Ysraýyly alyp baranda, fyrown olary deňze çykardy. Ol ýerde Allah: "Hasanyňyz bilen deňze ur" diýip emr etdi we fyrown we onuň goşuny gark bolanda imanlylar gury ýerden geçdiler (Gurhan 26: 63–66).',
      "Emma azatlyk diňe başlangyçdy. Soňra Musa kyn we köplenç minnetdar adamlary alyp barmak üçin has kyn we has uzyn synag geçirdi: Töwraty dagda aldy, diňe gaýdyp gelip, altyn göle çokunýandyklaryny görmek üçin; şikaýatlaryna, talaplaryna we sabyrly, berk ýolbaşçylyga boýun bolmazlygy bilen ýüzbe-ýüz boldy. Musanyň durmuşy iki sany uly mowzuga - adalatsyzlyga we zuluma garşy durmaga batyrlyk we adamlary azat bolansoň boýun bolmaga ugrukdyrmak üçin zerur çydamlylyk. Ulul -azmyň biri hökmünde reformaçynyň hem, bir jemgyýetiň çopanynyňam nusgasydyr.",
    ],
    profile: {
      nation: "Bani Ysraýyl (fyrownyň halkyna gönükdirilen jaň bilen)",
      location: "Müsür we Sinaý",
      era: "Dawud bilen Süleýmanyň öňünde",
      mission: "Tewhide çagyryň, fyrownyň sütemine garşy duruň we Töwraty gowşuryň.",
      challenges: [
        "Taňrydygyny öňe süren fyrowna garşy durmak",
        "Çydamly we minnetdar adamlara ýolbaşçylyk etmek",
        "Yzygiderli basyş astynda durnukly ýolbaşçylyk",
      ],
      miracles: [
        "Pentylana öwrülen hasa",
        "Allanyň emri bilen deňziň bölünmegi",
        "Fyrownyň öňünde görkezilen köp alamatlar",
      ],
      majorEvents: [
        "Allah mukaddes jülgede onuň bilen gürleşýär",
        "Fyrown we jadygöýler bilen gapma-garşylyk",
        "Çykyş we Töwratyň wahy",
      ],
      lessons: [
        "Zalymlyga garşy batyrgaý duruň",
        "Adamlara ýolbaşçylyk etmek uly sabyrlylygy talap edýär",
        "Erkinlik, Allaha boýun bolmak üçin goşulmalydyr",
      ],
      facts: [
        "Berk çözgütli bäş habarçynyň biri (ulul-azm)",
        "Kalimulla diýilýär - Allanyň göni gürleşen adamy",
      ],
    },
    quran: [
      {
        excerpt:
          "Men seni saýladym, aýan edilenleri diňle. Hakykatdanam, men Allah. Menden başga hudaý ýok, şonuň üçin Maňa ybadat ediň we ýatlamam üçin doga ediň.",
      },
      {
        excerpt:
          "Musanyň ejesine ylham berdik: Ony emdir, ýöne ondan gorksaň, ony derýa taşla, gorkma we gynanma. Hakykatdanam, biz ony size gaýtaryp bereris.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ölüm perişdesi Musa iberildi. Musanyň ýanyna baranda, Musa ony urdy we Allatagala gözüni dikdi we ölen wagty barada karar berdi.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Harun (AS)",
    summary: "Fyrownyň huzurynda goldaw berýän pygamber hökmünde Musanyň sözleýiş dogany.",
    body: [
      "Harun (sallaLlahu aleýhi we sellem) Musanyň uly dogany we özüne pygamberdi. Allatagala Musany fyrowna iberende, Musa goldaw sorady: 'Maňa maşgalamdan ministr - Harun, doganym belläň. Onuň üsti bilen güýç-kuwwatymy artdyr we meniň işimi paýlaşsyn “(Gurhan 20: 29–32). Allatagala bu haýyşy kabul etdi we Gurhan öz jogabyny şeýle ýazýar: 'Doganyň bilen goluňy güýçlendireris' (Gurhan 28:35). Sözleýişde has sözleýji hökmünde häsiýetlendirilen Harun, zalym adama Allanyň habaryny ýetirenlerinde Musanyň ýanynda durdy.",
      "Iň synag pursaty Musanyň ýok wagtynda geldi. Musa dagdaky Töwraty almaga baranda, Bani Ysraýyl altyn göle çokunmaga başlady. Harun olary saklamaga synanyşdy we duýduryş berdi: 'Eý, halkym, sen muny diňe synagdan geçirýärsiň we hakykatdanam Rebbiň iň rehimdar, şonuň üçin maňa eýeriň we buýrugymy ýerine ýetiriň' - ýöne olar onuň ygtyýaryny ýeňdiler we oňa zyýan ýetirdiler (Gurhan 20: 90–94). Musa gaharly gaýdyp gelende, Harun has güýçli hereket etmek Musanyň gaýdyp gelmezinden ozal jemgyýeti söweş toparlaryna bölmeginden gorkýandygyny düşündirdi (Gurhan 7: 150).",
      "Harunyň terjimehaly, Allanyň hyzmatynda toparlaýyn işiň ähmiýetini görkezýär - iki adamyň ýerine ýetiren wezipesi birinden has güýçlidir we hakykaty bozmazdan agzybirligi goramagyň näzik paýhasydyr. Käwagt wepaly liderlik döwülýän jemgyýeti bilelikde saklamagy we meseleler düzedilýänçä zyýany çäklendirmegi aňladýar. Harun, ýolbeletleriň arasynda Gurhanda hormatlanýar we Allah oňa we Musa üçin soňky nesilleriň arasynda hemişelik öwgi galdyrdy (Gurhan 37: 119–122).",
    ],
    profile: {
      nation: "Bani Ysraýyl",
      location: "Müsür we Sinaý",
      era: "Musanyň döwri",
      mission: "Tawhide çagyrmakda we Bani Ysraýyla ýol görkezmekde Musany goldaň.",
      challenges: [
        "Fyrownyň re regimeimine garşy durmak",
        "Musanyň ýok wagtynda jemgyýeti dolandyrmak",
        "Halk arasynda has uly bölünişigiň öňüni almak",
      ],
      majorEvents: [
        "Ministr wezipesine bellemek we Musa goldaw",
        "Fyrownyň öňündäki tabşyryk",
        "Altyn göläniň synagy",
      ],
      lessons: [
        "Toparlaýyn iş Allaha çagyryşy güýçlendirýär",
        "Liderlik käwagt adamlary krizisde saklamagy aňladýar",
        "Hiç haçan hakykata zyýan bermezden agzybirligi saklaň",
      ],
      facts: ["Musanyň uly dogany", "Sözleýişi üçin Gurhanda wasp edildi"],
    },
    quran: [
      {
        excerpt:
          "Maňa maşgalamdan ministr belläň - agam Harun. Onuň üsti bilen güýç-kuwwatymy artdyr we meniň işimi paýlaşsyn.",
      },
      {
        excerpt:
          "Ol: Ejemiň ogly, hakykatdanam adamlar meni ýeňdiler we meni öldürjek boldular, duşmanlar meniň üstüme begenmesinler.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dawud (AS)",
    summary:
      "Pygamber-patyşa paýhas, adalat we Zabur we ybadat merkezli ýolbaşçylygyň nusgasy berdi.",
    body: [
      "Dawud (sallaLlahu aleýhi we sellem) - Dawut Talut (Şawul) goşunynda zalym Jalut (Golýata) garşy ýaşlykda başlady. Dawut Jalutyň üstüne degdi we 'Allah oňa hökümdarlyk we paýhas berdi we islän zadyny öwretdi' (Gurhan 2: 251). Soňra Allah oňa patyşalyk, pygamberlik we aýan edilen Zabur (Zebur) berdi we oňa wepaly ybadat edýän hökümdaryň seýrek mysaly boldy.",
      "Allah oňa ajaýyp sowgatlar berdi: daglar we guşlar Allany şöhratlandyrmak üçin oňa goşulardylar we ýarag ýasamak üçin elinde demir ýumşady (Gurhan 21:79; 34: 10–11). Emma Dawud bu güýji bilen çuňňur kiçigöwünli we wepaly bolup galdy. Ybadaty şeýle bir güýçlüdi welin, Pygamber Dawud agyz beklemegi - her gün agyz beklemegi - Allaha iň söýgüli agyz beklemegi we gijeki namazyny iň söýgüli doga hökmünde suratlandyrdy. Gurhan, şeýle hem, Dawudyň ýuwaşlyk bilen düzedilen, derrew seatede edip, bagyşlanmagyny talap edip, Rebbine gaýdyp gelen höküm bölümini görkezýär (Gurhan 38:24) - güýji ony hiç wagt jogapkärçilikden ýokary goýmaýar.",
      "Dawudyň durmuşy, ygtyýarlygyň artykmaçlyk däl-de, ynamdygyny öwredýär. Allah oňa gönüden-göni ýüzlenýär: 'Eý Dawud, seni ýer ýüzünde mirasdüşer etdik, şonuň üçin halkyň arasynda höküm çykar we islege boýun bolma' (Gurhan 38:26). Adalat, Allany hemişe ýatlamak, çalt toba etmek we tertipli ybadat durmuşy dogry ýolbaşçylygy goldaýar. Güýç iň köp baş egýän adamyň elinde iň ygtybarlydyr.",
    ],
    profile: {
      nation: "Bani Ysraýyl",
      location: "Iýerusalim sebiti",
      era: "Süleýmanyň hökümdarlygyndan ozal",
      mission: "Adalat bilen ýolbaşçylyk ediň, hakykata baha beriň we halkyny Allaha çagyryň.",
      challenges: [
        "Kazyýet jogapkärçiliginiň agramy",
        "Güýji pespällik bilen deňleşdirmek",
        "Leadershipolbaşçylykda jemgyýetçilik jogapkärçiligi",
      ],
      miracles: [
        "Allany özi bilen şöhratlandyrýan daglar we guşlar",
        "Allanyň rugsady bilen elinde demir ýumşady",
      ],
      majorEvents: [
        "Jalutyň ýaşlygynda ýeňilmegi",
        "Patyşalyk, pygamberlik we Zaburyň ylhamy",
        "Miras ogly Süleýmana geçdi",
      ],
      lessons: [
        "Adalat adalatly dolandyryşyň merkezidir",
        "Islendik ýalňyşlykdan soň çalt toba ediň",
        "Düzgünli ybadat durmuşy ýolbaşçylygy güýçlendirýär",
      ],
      facts: ["Zabury kabul ediji (Zebur)", "Jalut (Golýat) ýaş wagtynda ýeňildi"],
    },
    quran: [
      {
        excerpt:
          "Eý Dawud, hakykatdanam seni ýer ýüzünde mirasdüşer etdik, şonuň üçin halkyň arasynda höküm çykar we islege boýun bolma, sebäbi seni Allanyň ýolundan azaşdyrar.",
      },
      {
        excerpt:
          "Dawud we guşlar bilen şöhratlandyrmak üçin daglara boýun bolduk ... We duşmanyňyzdan goramak üçin oňa gerb ýasamagy öwretdik.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allaha iň söýgüli doga Dawudyň dogasydyr we Allaha iň söýgüli agyz beklemek Dawudyň agyz beklemegidir: bir gün oraza tutar, ertesi agyz beklär.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Süleýman (AS)",
    summary: "Pygamber-patyşa deňi-taýy bolmadyk ygtyýarlyk berdi, ýöne şükür we paýhas esaslandy.",
    body: [
      "Süleýman (sallallahu aleýhi wesellem) - Süleýman kakasy Dawuddan patyşalygy we pygamberligi miras aldy we Gurhan ony 'ajaýyp hyzmatkär, hakykatdanam Allaha ýüzlenýän' hökmünde öwýär (Gurhan 38:30). Geljekdäkilardan tapawutlylykda bir patyşalyk üçin doga etdi we Allatagala oňa adatdan daşary serişdeleri berdi: buýrugy bilen öwüsýän ýeliň üstünden buýruk; Allanyň rugsady bilen onuň üçin kepderi guran jynlaryň hyzmaty; we guşlaryň we beýleki jandarlaryň sözlerine düşünmek (Gurhan 21: 81–82; 34: 12–13; 27:16).",
      "Iki sahna onuň keşbini alýar. Bir garynja öz koloniýasyna Süleýmanyň goşunynyň bilmän ezilmezligi üçin duýduryş berende, Süleýman ýylgyrdy we düşünişmek üçin Allaha şükür etdi, minnetdar we dogruçyl bolmagyny dileg etdi (Gurhan 27: 18–19) - güýç ony peseltdi, peseltmedi. Şebanyň şa aýalynyň (Saba) we halkynyň Güne ybadat edýändigini eşidende, olary zor bilen ýeňmedi, ýöne Allaha boýun bolmaga çagyrdy, netijede paýhas we Allanyň beren zatlarynyň görkezilmegi bilen imana iman etdi (Gurhan 27: 22–44). Hatda ägirt uly nygmatlaryny synag hökmünde düzdi: 'Bu, minnetdarlygymy ýa-da minnetdarlygymy synamak üçin Rebbimiň merhemetidir' (Gurhan 27:40).",
      "Süleýman, güýjüň iň kyn synaglardan biridigini, minnetdarlygyň (şukryň) bejergidigini öwredýär. Baýlyk, başarnyk ýa-da ygtyýarlyk berlen imanly, ony adalat üçin ulanmak we başgalary Allaha çagyrmak, hiç haçan buýsanç üçin däl. Bütin Patyşalygy, ähli täsinlikleri bilen, berenine yşarat edýär - bu beýgelýän nygmat bilen zaýalanýan arasyndaky tapawut.",
    ],
    profile: {
      nation: "Bani Ysraýyl we onuň töweregindäki patyşalyklar",
      location: "Iýerusalim we has giň sebit",
      era: "Dawuddan soň",
      mission: "Adalat bilen dolandyryň we halklary Allaha ybadat etmäge çagyryň.",
      challenges: [
        "Uly patyşalygy dolandyrmak",
        "Uly güýç arasynda minnetdarlygy saklamak",
        "Dürli güýçleri jogapkärçilikli ugrukdyrmak",
      ],
      miracles: [
        "Allanyň rugsady bilen ýeliň üstünden emr et",
        "Jynlaryň gurluşykda we suwa çümmekde hyzmaty",
        "Guşlaryň we garynjalaryň sözlerine düşünmek",
      ],
      majorEvents: [
        "Dawudyň patyşalygyna we pygamberligine miras",
        "Garynjanyň bölümi we minnetdarlygy",
        "Şebanyň şa zenany bilen hat alyşmak we ynanjy",
      ],
      lessons: [
        "Güýç çuňňur synag",
        "Minnetdarlyk ulumsylykdan goraýar",
        "Paýhas we çakylyk ýürekleri güýçden has gowy öwrüp biler",
      ],
      facts: ["Gurhanda iň doly beýan edilen pygamberleriň arasynda"],
    },
    quran: [
      {
        excerpt:
          "Ol ýylgyryp, çykyşyna güldi we şeýle diýdi: “Lorda Reb, maňa we ene-atama beren merhemetiň üçin minnetdar bolmaga we seniň makullaýan dogruçyllygyňy etmäge mümkinçilik ber.",
      },
      {
        excerpt:
          "Süleýmana bolsa şemal öwrendik - onuň ertirki kursy bir aýlyk, günortanlyk kursy bolsa bir aýlyk ýol.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ylýas (AS)",
    summary: "Baýl butyna çokunmak bilen ýüzbe-ýüz bolup, halkyny Allaha çagyrdy.",
    body: [
      "Ylýas (sallaLlahu aleýhi we sellem) butparazlyga düşen Bani Ysraýyl jemagatyna iberildi, butlarynyň arasynda Ba'l. Gurhan gönüden-göni kynçylyklaryny ýazýar: 'Alladan gorkmaýarsyňyzmy? Bala çagyryp, iň gowy döredijileri - Rebbiňiz we ilkinji ata-babalaryňyzyň Rebbi goýýarsyňyzmy? ' (Gurhan 37: 124–126). Onuň çagyryşy ebedi pygamberlik çagyryşydy: ýalan taňrylary taşlaň we ýeke-täk Creatoraradana ybadat ediň.",
      "Gurhan öz wezipesini tanyş pygamberlik nusgasy bilen jemleýär - aç-açan çakylyk, köpleriň ret etmegi we ak ýürekden saklanýan hormat. \"Olar ony inkär etdiler, şonuň üçin Allanyň saýlanan bendelerinden başga jeza üçin getiriler\" (Gurhan 37: 127–128). Allatagala ony dogruçyllaryň hataryna goşýar we oňa parahatçylyk we öwgi galdyrýar: 'Ylýas salam bolsun' (Gurhan 37: 129-130) we ýolbeletleriň arasynda Zakarýa, yaahýa we Isa bilen birlikde sanaw ýazýar (Gurhan 6:85).",
      "Ilýasyň sapagy, hakyky reforma ybadaty düzetmekden başlanýar. Jemgyýet ýalan zatlara wepalylygy ugrukdyrsa-da, dogry butlar ýa-da häzirki isleg, baýlyk we status butlary bolsun. Töwhid, dowamly ahlak taýdan täzelenmegiň esasydyr, wepaly topar az we köp bolsa-da, Allah hakykaty saklaýanlary hormatlaýar.",
    ],
    profile: {
      nation: "Bani Ysraýylyň arasynda jemagat",
      location: "Lewant sebiti",
      era: "Soňra Ysraýyl pygamberlik döwürleri",
      mission: "Halkyny Ba'l ybadatyndan başlap, tewhide çagyryň.",
      challenges: ["Çuňňur butlara çokunmak", "Leadershipolbaşçylygyň garşylygy"],
      majorEvents: [
        "Halk köpçüligi Bala çokunmaga garşy çagyrýar",
        "Köpçüligiň ret etmegi we imanlylaryň saklanmagy",
      ],
      lessons: [
        "Töwhid ähli reformalaryň esasyny düzýär",
        "Uly bolmadyk wepaly topar henizem Allah üçin möhümdir",
        "Pygamberler munuň bilen däl-de, meşhur ýalňyşlyga garşy gürleýärler",
      ],
      facts: ["Dogruçyllaryň arasynda", "Ba'l butyna çokunmak bilen ýüzbe-ýüz boldy"],
    },
    quran: [
      {
        excerpt:
          "Halkyna: Alladan gorkmaýarsyňyzmy? Bala jaň edip, iň gowy döredijileri goýýarsyňyzmy?",
      },
      {
        excerpt: "Zakarýa, yaahýa, Isa we Ylýas - hemmesi dogruçyl adamlardy.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Al-Yasa '(AS)",
    summary:
      "Ysraýyl nesliniň dogruçyl pygamberi, görnükli adamlaryň arasynda Gurhanda atlandyryldy.",
    body: [
      "Al-asaasa (sallaLlahu aleýhi we sellem) - Elisha - Gurhanda iki ýerde pygamberleriň arasynda agzalýar we ikisinde-de wasp edilýär. Ol ýolbeletleriň arasynda, Allanyň 'dünýälerden has ileri tutan' Ysmaýyl, usunus we Lut bilen birlikde, Ysmaýyl we Zul-Kifl bilen birlikde görnükli adamlaryň arasynda (Gurhan 38:48) peýda bolýar. Tekst jikme-jik gürrüň bermegiň ýerine, derejesini ýokarlandyrýar.",
      "Ylham onuň hakda bilkastlaýyn gysga bolandygy sebäpli, musulmanlar anyk bir zady tassyklaýarlar - hakyky pygamberdigini, öz halkynyň arasynda diňe Allaha ybadat etmek çagyryşyny goldaýan we oňa goldaw berilmeýän ertekileri dakmakdan saklanýarlar. Bu çäklendirmäniň özi dogry ynamyň bir bölegidir: bir pygambere hormat goýýarys, töweregindäki hekaýalary oýlap tapman, özi hakda hakykaty saklaýarys.",
      "Bu agzalýan zat, Allanyň köp sanly habarçy iberendigini we bir pygamberiň gadyrynyň hekaýasynyň näçe wagt saklanandygy bilen däl-de, eýsem missiýa wepalylygy bilen ölçelýändigini ýatladýar. Gurhanyň başga bir ýerde aýdyşy ýaly, 'Siziň bilen baglanyşykly hekaýalary we habarlarymyzy habar bermedik habarçylar' bardy (Gurhan 40:78) we bularyň hemmesine ynanmak, bilinmeýän we bilinmeýän musulman dininiň bir bölegidir.",
    ],
    profile: {
      nation: "Bani Ysraýyl",
      location: "Lewant sebiti",
      era: "Soňra Ysraýyl pygamberlik döwürleri",
      mission: "Halkynyň arasynda tawhid çagyryşyny dowam etdiriň.",
      lessons: [
        "Pygamberleriň hemmesine ynam bilen deň hormat goýuň",
        "Gurhanyň gysgaça ýatlanylmagy henizem hakyky görkezmäni berýär",
        "Dogry dowamlylyk iman jemagatlaryny gorap saklaýar",
      ],
      facts: ["Görnükli we saýlananlaryň arasynda göni Gurhanda atlandyrylýar"],
    },
    quran: [
      {
        excerpt: "Ismail, Al-Yasa ', usunus we Lut - we dünýäden has gowy görýän zatlarymyz.",
      },
      {
        excerpt: "Ismail, Al-Yasa 'we Dhul-Kifl-i ýadyňyzdan çykarmaň, hemmesi görnükli.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Usunus (AS)",
    summary: "Garaňkylykda toba eden umyt ummasyz sapaga öwrülen kit pygamberi.",
    body: [
      "Usunus (sallallahu aleýhi wesellem) Ninewäniň ilatyna iberildi, ýöne olar onuň çagyryşyny yzygiderli ret edenlerinde, Allatagala rugsat bermezden ozal olary gaharly goýdy. Gurhan soňraky zatlary şeýle suratlandyrýar: 'Balyk adamy, gahar bilen gidip, hiç hili kynçylyk çekmeris öýdüp, ýatlap geçiň' (Gurhan 21:87). Gämä münüp, deňze taşlandy we uly balyk ýuwutdy, garaňkylyk gatlaklaryna - gijäniň, deňziň we balyk garnynyň garaňkylygyna çümdi.",
      "Şol garaňky garaňkylykda usunus Yslamyň iň söýgüli dilegleriniň birine öwrülen sözler bilen gygyrdy: 'Senden başga hudaý ýok; şöhrat saňa bolsun! Hakykatdanam, men zulum edenlerden boldum '(Gurhan 21:87). Ol umytdan düşmedi; Allanyň kämilligini tassyklady we öz günäsini boýun aldy. Allatagala şeýle jogap berdi: 'Şonuň üçin biz oňa jogap berdik we ony kynçylykdan halas etdik. Şeýdip, imanlylary halas edýäris '(Gurhan 21:88). Balyklar ony kenara taşladylar we Allah ejiz bedenini goramak üçin bir ösümligiň ösmegine sebäp boldy.",
      "Soňra ajaýyp netijä geldi: usunus öz halkyna gaýdyp geldi we Gurhanda beýleki halklardan tapawutlylykda iman etdiler we halas boldular - 'şonuň üçin olara wagtlaýyn lezzet berdik' (Gurhan 37: 147–148; 10:98). Hekaýasy bilelikde dokalan iki sapak berýär: Allanyň rehiminden hiç wagt umytdan düşmäň, garaňkylyk näçe çuň bolsa-da, çyn ýürekden toba ýitirilen zady dikeldýär; usunusyň duasy, kynçylyk çekýän her bir imanly üçin durmuş ýoludyr. Pygamber alaýhyssalam, Allanyň özüne jogap bermeginden başga hiç bir musulmanyň dileg etmeýändigini öwretdi.",
    ],
    profile: {
      nation: "Ninewäniň ilaty",
      location: "Mesopotamiýa sebiti",
      era: "Isadan öňki pygamberlik döwri",
      mission: "Halkyny taharet we toba çagyr.",
      challenges: [
        "Dawa-da yzygiderli ret etmegiň dartgynlygy",
        "Deňiziň garaňkylygynda şahsy synag",
        "Düzedilenden soň missiýa gaýdyp barmak",
      ],
      miracles: [
        "Balygyň içinden halas etmek",
        "Onuň üstünde bir gaçybatalga ösümligi ösdi",
        "Bütin halkynyň ynamy",
      ],
      majorEvents: [
        "Halkyny we deňiz synagyny terk etmek",
        "Üç esse garaňkylykda dileg",
        "Ninewäniň gaýdyp gelmegi we ynanjy",
      ],
      lessons: [
        "Allanyň rahmetinden hiç haçan umytdan düşmäň",
        "Tüýs ýürekden toba etmek wezipäni dikeldýär",
        "Kynçylykda du'a üýtgeýär",
      ],
      facts: ["Gurhanda Dhun-Nun (balyk adamy) diýilýär"],
    },
    quran: [
      {
        excerpt:
          "Garaňkylygyň içinde gygyrdy: Senden başga hudaý ýok; şöhrat saňa bolsun! Hakykatdanam, men günäkärlerden boldum.",
      },
      {
        excerpt:
          "Onda usunusyň ilatyndan başga imanynyň peýdasyna ynanýan şäher ýokmydy? Olar iman edenlerinde, biz olardan masgaraçylyk jezasyny aýyrdyk.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dhun-Nunyň balygyň garnyndan Allaha ýüz tutanda ýalbarmagy: La ilaha illa Anta, subhanaka, inni kuntu minaz-zalimin. Hiç bir musulman Allatagalanyň oňa jogap bermeginden başga hiç zat dilemez.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Zakariýa (AS)",
    summary:
      "Garrylykda dogruçyl mirasçy üçin doga eden we yaahýa bilen jogap beren wepaly pygamber.",
    body: [
      "Zakarýa (sallaLlahu aleýhi we sellem) - Zakarýa - Bani Ysraýylyň takwa pygamberi we Merýemiň hossarydy. Haçan-da namaz otagyna gireninde, özi bilen üpjünçilik tapyp, nädip gelendigini soraýar we ol: 'Bu Alladan. Hakykatdanam, Allatagala islänini üpjün edýär '(Gurhan 3:37). Allanyň Merýeme beren wadasyna şaýat bolmak, Allatagalanyň mümkin bolmadyk zady berip biljekdigine bolan umydyny täzeledi.",
      "Zakarýa garrap, aýaly önelgesiz bolsa-da, asuda we içgin dileg bilen Allaha ýüzlendi: 'Lorda Reb, hakykatdanam süňklerim gowşady we kelläm ak reňkde boldy, Saňa ýalbarmagymda hiç haçan begenmedim' (Gurhan 19: 4). Ol baýlyk ýa-da dünýä gazanmak üçin däl-de, pygamberlik wezipesini ýerine ýetirjek we Allaha ybadatyny gorap saklaýan dogruçyl mirasçy sorady. Allatagala bir ogly Yahahýanyň hoş habary bilen jogap berdi, Alla aýtdy, öň hiç kime berilmedi (Gurhan 19: 7). Zakarýa, alamat hökmünde dilini Allanyň hatyrasyna bagyşlamakdan başga üç günläp adamlar bilen gürleşmekden saklanmalydy (Gurhan 19: 10–11).",
      "Zakarýanyň durmuşy, imanlylara dua etmegi hiç haçan bes etmezligi öwredýär, ýöne jogap bolup bilse-de, Alladan esasanam dogruçyl maşgalanyň sowgadyny we imanyň dowamlylygyny soraýar. Iň uly aladasy özi däl-de, hakykaty kimden soň alyp barjakdygydy. Hekaýasy, ybadat ýerlerinde asuda we söýgüli iş hökmünde asuda hyzmaty hormatlaýar.",
    ],
    profile: {
      nation: "Bani Ysraýyl",
      location: "Iýerusalim sebiti",
      era: "Işaýadan öň",
      mission: "Halkyna ýol görkez we pygamberlik ybadatyny gora.",
      challenges: [
        "Çagasyz garrylyga ýetmek",
        "Imanyň mirasy barada alada",
        "Dartgynly jemgyýetde ybadaty dowam etdirmek",
      ],
      miracles: ["Yaahýanyň garrylyk döwründe hoş habary", "Üç günläp saklanmagyň alamaty"],
      majorEvents: [
        "Merýemiň hossarlygy we üpjünçiligine şaýat bolmak",
        "Mirasçy üçin tüýs ýürekden dileg",
        "Jogap berlen du'a we yaahýanyň dünýä inişi",
      ],
      lessons: [
        "Du'a umydyňyzy ýitirmäň",
        "Alladan dogruçyl maşgala we nesil sora",
        "Ybadatda yhlasly hyzmat etmek mertebedir",
      ],
      facts: ["Merýemiň hossary", "Yahýanyň kakasy, dünýä inen dogasyna jogap berdi"],
    },
    quran: [
      {
        excerpt:
          "Ol ýerde Zakarýa Rebbine ýüzlenip: «Lorda Reb, maňa Özüňden gowy nesil ber! Dogrudanam, ýalbarýan sen.",
      },
      {
        excerpt:
          "Ol aýtdy: Lorda Reb, hakykatdanam süňklerim gowşady, kelläm ak reňk bilen doldy we Rebbim, Saňa ýalbarmagymda hiç haçan begenmedim.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Yaahýa (AS)",
    summary:
      "Arassa, paýhasly pygamber ýaşlykdan dogrulyk berdi we Allah tarapyndan parahatçylyk bilen hormatlandy.",
    body: [
      "Yaahýa (sallallahu aleýhi wesellem) - Jon - kakasy Zakarýanyň dogulmazyndan ozal Allatagalanyň dilegine jogap boldy. Allatagala oňa göni ýüzlendi: 'Ya yaahýa, Mukaddes .azgylary tutanýerlilik bilen al'. We \"çagalygynda oňa paýhas berdi\" (Gurhan 19:12) - irki ruhy taýdan kämilligini görkezýän seýrek beýany. Hisaşlygyndan başlap, çynlakaýlygy bilen Allaha wepalydy.",
      "Gurhan öz häsiýetini ajaýyp yzygiderlilikde wasp edýär: Allatagala oňa 'Bizden mähir we arassalyk berdi, Allany bilýärdi we ene-atasyna hormat goýýardy, zalym, boýun egmedi' (Gurhan 19: 13–14). Ol dogruçyllaryň arasynda päk we takwa adamdy. Ol öz halkyny boýun bolmaga we hakykata çagyrdy we Allanyň sözüni tassyklady we ýürekleri ýol görkezmäge taýynlady (Gurhan 3:39).",
      "Allah Yaahýany durmuşyň iň ejiz üç pursatynda parahatçylyk bilen hormatlady: 'Oňa doglan güni, ölen güni we direlen güni salam bolsun' (Gurhan 19:15). Terjimehaly ýaşlara-da, garrylara-da habar: Allaha ýakynlyk soňky ýyllara yza süýşürilmeýär. Heartüregiň arassalygy, ybadatda çynlakaýlyk we ene-atasyna hoşniýetlilik adamda ýaş wagtynda gülläp biler - we beýle durmuş Allaha söýgüdir.",
    ],
    profile: {
      nation: "Bani Ysraýyl",
      location: "Lewant sebiti",
      era: "Zakariýa bilen häzirki we Işaýa döwrüne ýakyn",
      mission: "Dogrulyga çagyryň we ýürekleri ýol görkezmäge taýýarlaň.",
      challenges: [
        "Ahlak taýdan dartgynly gurşawda jemgyýetçilik reformasy",
        "Arassalygy we ýörelgäni goldamak",
      ],
      majorEvents: [
        "Jogaply dileg hökmünde dünýä inmegi",
        "Youthaşlygynda paýhas berilýär",
        "Arassalygy we wepalylygy üçin tanalmak",
      ],
      lessons: [
        "Youngaşlar dogrulyga alyp baryp bilerler",
        "Heartüregiň arassalygy hakyky güýçdir",
        "Ene-atalara hoşniýetlilik takwalygyň bir bölegidir",
      ],
      facts: [
        "Dogulmazyndan ozal Allah tarapyndan atlandyryldy",
        "Dogulanda, ölümde we direlende rahatlyk bilen hormatlanýar",
      ],
    },
    quran: [
      {
        excerpt:
          "Eý, yaahýa, Mukaddes .azgyny tutanýerlilik bilen al. Çagalygymyzda oňa paýhas, bize mähir we arassalyk berdik, ol Allany bilýärdi.",
      },
      {
        excerpt:
          "Allatagala size yaahýa hakda gowy habar berýär, Alladan gelen sözleri tassyklaýar - hormatlanýan, saklanýan we dogruçyllaryň arasyndan pygamber.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Isa ibn Merýem (AS)",
    summary:
      "Merýemde gudrat bilen dünýä inen, anyk alamatlar bilen Allaha çagyrýan kuwwatly habarçy - ylahy däl.",
    body: [
      "Isa (sallaLlahu aleýhi we sellem) - Isa - Merýemde, Allanyň emri bilen, bütinleý güýjüniň alamaty hökmünde dünýä indi: 'Hakykatdanam, Isanyň Allah bilen göreldesi Adam ata meňzeýär. Ony tozandan ýaratdy, soň oňa: Be Bol, olam “diýdi (Gurhan 3:59). Merýem täze doglan çagany günäkärlän halkyna getirende, bäbek Isa özüni goramak üçin bäşikden gürledi: 'Hakykatdanam, men Allanyň guly. Maňa Mukaddes .azgy berdi we meni pygamber etdi '(Gurhan 19:30). Bu ilkinji jarnamada, Allanyň gulydygy bütin missiýasynyň äheňini kesgitledi.",
      "Isa Töwraty tassyklamak we Injili getirmek üçin Bani Ysraýyla iberildi. Allatagala oňa rugsady bilen aç-açan gudratlar bilen goldaw berdi: körleri we heýwere keselini bejerdi, ölülere jan berdi we Allanyň rugsady bilen uçýan toýundan guş emele getirdi (Gurhan 3:49). Habary adamlary 'Allaha, Rebbim we Perwerdigäriňize' (Gurhan 3:51) ybadat etmäge, yhlas we dogruçyllyga çagyrdy. Closeakyn şägirtleri Hawariýýun oňa ynanýardylar we goldaw berdiler.",
      "Gurhan Işaýa hakda iki hadysany düzedýär. Ony ret eden we öldürmegi meýilleşdirenlere garşy, onuň öldürilmändigi ýa-da haça çüýlenmändigi aýdylýar; tersine, diňe şeýle peýda boldy we Allah ony Özüne direltdi (Gurhan 4: 157-158). Çişirilenlere garşy, onuň Hudaý ýa-da Hudaýyň ogly däl-de, asylly pygamber we habarçydygyny görkezýär - 'Merýemiň ogly Mesih habarçy däldi' (Gurhan 5:75). Sünni ynanjynda ahyret gününden öň gaýdyp geler. Hekaýasy, Allanyň güýjüniň ähli tebigy sebäplerden ýokarydygyny, pygamberleriň hormatlanýan gullardygyny we hiç haçan ylahy däldigini, hakykatyň inkär etmekden we ulaltmakdan goralmalydygyny öwredýär.",
    ],
    profile: {
      nation: "Bani Ysraýyl",
      location: "Levant",
      era: "I asyr",
      mission: "Töwhidi täzeläň, Töwraty tassyklaň we dogrulyga çagyryň.",
      challenges: [
        "Ony ret edenleriň garşylygy we dildüwşügi",
        "Lateragdaýynyň soňraky ulaldylmagy",
        "Arassa monoteizmi goramak",
      ],
      miracles: [
        "Kakasyz dogulmak",
        "Bäşlikde gürlemek",
        "Allanyň rugsady bilen şypa bermek we ýaşaýyş bermek",
      ],
      majorEvents: [
        "Gudratly dünýä inmegi we ejesini goramak",
        "Köpçülik açyk alamatlar bilen jaň edýär",
        "Öldürilmän, Allaha direldi",
      ],
      lessons: [
        "Allanyň güýji adaty sebäplerden ýokarydyr",
        "Pygamberler Allanyň hormatly bendeleri, hiç haçan ylahy däldir",
        "Hakykat inkär etmekden we ulaltmakdan saklanmalydyr",
      ],
      facts: [
        "Injil berilýär (Hoş Habar)",
        "Sünni ynanjynda soňky günüň öňüsyrasynda gaýdyp geler",
      ],
    },
    quran: [
      {
        excerpt:
          "[Isa aýtdy]: Hakykatdanam, Alla meniň Rebbim we Perwerdigäriňizdir, şonuň üçin Oňa ybadat ediň. Bu göni ýol.",
      },
      {
        excerpt:
          "Ony öldürmediler, haça çüýlemediler. ýöne olara şeýle görünmek üçin edildi ... Has dogrusy, Allah ony Özüne direltdi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Men Merýemiň ogly Isa ähli adamlara iň ýakyn. Pygamberler dürli eneleriň doganlary, ýöne olaryň dinleri bir, aramyzda pygamber ýokdy.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Muhammet ﷺ",
    summary:
      "Thehli dünýälere rehimdarlyk we pygamberlik möhüri hökmünde iberilen iň soňky habarçy.",
    body: [
      "Muhammet a pygamberleriň iň soňkusy, ýekeje halka däl-de, eýsem bütin adamzada iberildi, Gurhan iň soňky we saklanylýan wahý hökmünde. Allatagala öz wezipesini ýekeje aýatda şeýle suratlandyrýar: 'We sizi dünýälere rehim etmekden başga ibermedik' (Gurhan 21: 107). Mekgede dünýä inen kyrk ýaşyndaka ilkinji ylhamy Hira gowagynda aldy we indiki ýigrimi üç ýyllap adamlary diňe Allaha ybadat etmäge, ýüreklerini arassalamaga we adalat we rehimdarlyk bilen ýaşamaga çagyrdy - öňündäki her bir pygamberiň habaryny tamamlady we tassyklady.",
      'Onuň ýoly dowamly gurbanlaryň biridi. Mekgede ol we ilkinji imanlylar masgaralara, gynamalara we bir ýyllap boýkot etdiler. Soňra hijret geldi, Medinä göçüp, ilkinji musulman jemagatyny gurdy - doga, migrantlar bilen kömekçileriň arasynda doganlyk, şertnamalar we tewhid köküni jemleýän jemgyýet gurdy. Birnäçe ýyllap dowam eden kynçylyklar we ýeňiş bilen onuň häsiýeti hiç haçan sarsmady; Gurhan şaýatlyk edýär: "Hakykatdanam, siz gaty ahlaklysyňyz" (Gurhan 68: 4) we özi-de ajaýyp asyllylyga iberilendigini aýtdy.',
      "Allatagala ony 'Allahyň Resuly we pygamberleriň möhri' diýip yglan edýär (Gurhan 33:40) - ondan soň pygamber ýok. Iň uly gudraty, Gurhanyň özi, henizem milliardlarça ýol görkezýän dowamly alamatdyr we gijeki syýahat we asmana göterilmegi üçin Ysraýyl we Miraj bilen sylaglandy. Iman eden adam üçin iň oňat mysal bolan (Gurhan 33:21) uswah hasanydyr, Sünnet imanyň amaly ýoludyr. Ony söýmek, ýol görkezmesine eýermek we oňa bereket ibermek musulman durmuşynyň özenidir.",
    ],
    profile: {
      nation: "Bütin adamzat",
      location: "Mekge we Medinä",
      era: "VII asyr",
      mission: "Iň soňky ylhamy beriň we ähli halklar üçin pygamberlik habaryny tamamlaň.",
      challenges: [
        "Mekgedäki yzarlamalar we boýkot",
        "Dawa-jenjel we adalatly jemgyýet gurmak",
        "Tire-taýpalara we halklara ähliumumy habar bermek",
      ],
      miracles: [
        "Gurhan dowamly gudrat hökmünde",
        "Ysraýyl we Miraj (gijeki syýahat we ýokary galma)",
        "Allanyň rugsady bilen berlen köp alamatlar",
      ],
      majorEvents: [
        "Mekgede ylhamyň başlangyjy",
        "Medinä hijri",
        "Habaryň tamamlanmagy we Hoşlaşyk hutbasy",
      ],
      lessons: [
        "Leadershipolbaşçylykda rehimdarlyk we asylly häsiýet",
        "Basyş astynda berklik",
        "Ylhamy we sünneti bilelikde yzarlaň",
      ],
      facts: ["Pygamberleriň möhri", "Imanlylar üçin iň gowy mysal (uswah hasanah)"],
    },
    quran: [
      {
        excerpt:
          "Muhammet siziň erkekleriňiziň atasy däl, ýöne Allahyň Resuly we pygamberleriň möhüridir.",
      },
      {
        excerpt: "Biz sizi dünýälere rehim etmekden başga ibermedik.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Meniň öňümdäki pygamberleriň mysaly we mysaly, bir kerpiçden başga ýerden owadan we doly jaý guran adamyň mysalydyr. Men şol kerpiç, pygamberleriň möhri.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
];

export const PROPHETS_TIMELINE_TK: DeepPartial<ProphetsTimelineEvent>[] = [
  {
    era: "Başlangyç",
    title: "Adam - ilkinji pygamber",
    body: "Allah Adam atany ýaratdy, atlary öwretdi we ony ýerdäki wekili etdi.",
  },
  {
    era: "Gadymy döwür",
    title: "Idris, Nuh we irki halklar",
    body: "Irki pygamberler öz halkyny tewhide çagyrdylar. Nuh asyrlar boýy wagyz edipdir; ret etmek dowam edensoň, suw joşdy we gämi möminleri alamat hökmünde halas etdi.",
  },
  {
    era: "Mezopotamiýa / Lewant",
    title: "Ybraýym we maşgalasy",
    body: "Allanyň dosty Halilullah: butlary döwdi, otdan halas boldy, Ysmaýyl bilen Käbäni gurdy we Ysmaýyl bilen Yshagyň üsti bilen bir topar pygamber atasy boldy.",
  },
  {
    era: "Müsür we Sinaý",
    title: "Musa we Bani Ysraýyl",
    body: "Fyrowndan azatlyk, Töwrat, Bani Ysraýyla çenli uzyn pygamberleriň hataryny açdy.",
  },
  {
    era: "Müsür",
    title: "Yusufusup Müsürde",
    body: "Dönüklik, türme we häkimiýete çykmak arkaly sabyr etmek - ynam nusgasy.",
  },
  {
    era: "Iýerusalim",
    title: "Dawud we Süleýman",
    body: "Patyşalyk, paýhas, Zabur we Patyşalyk Gurhanda wasp edildi.",
  },
  {
    era: "I asyr",
    title: "Isa ibn Merýem",
    body: "Gudrat bilen doglan, bäşlikde gürledi, Allaha direldi - Gurhanda haçda öldürilmedi.",
  },
  {
    era: "VII asyr",
    title: "Muhammet ﷺ - pygamberleriň möhri",
    body: "Bütin adamzada iň soňky habarçy; Gurhan ahyret gününe çenli saklandy.",
  },
];
