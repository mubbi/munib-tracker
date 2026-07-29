// Albanian translation overlay for the Learn "Prophets" content. Mirrors the order of
// its English source in ../prophets*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { ProphetsTimelineEvent, ProphetsTopic } from "../../types/prophets";
import type { DeepPartial } from "./localize";

export const PROPHETS_TOPICS_SQ: DeepPartial<ProphetsTopic>[] = [
  {
    title: "Hyrje në Profetët",
    summary: "Pse Allahu dërgoi profetët dhe pse historitë e tyre kanë rëndësi tani.",
    body: [
      "Allahu dërgoi profetët si mëshirë, udhëzim dhe provë që njerëzit ta njohin Atë, ta adhurojnë Atë drejt dhe të jetojnë me drejtësi dhe qëllim.",
      "Historitë e tyre në Kuran nuk janë vetëm histori e largët; ato janë mësime praktike për besimin, durimin, jetën familjare, udhëheqjen dhe pendimin.",
      "Besimi në të gjithë profetët është pjesë e imanit. Myslimanët i nderojnë të gjithë, shmangin teprimet dhe ndjekin mesazhin përfundimtar të sjellë nga Muhamedi ﷺ.",
    ],
    quran: [
      {
        excerpt:
          "Të dërguarit si përgëzues dhe paralajmërues, kështu që njerëzit nuk do të kenë argument kundër Allahut pas të dërguarve.",
      },
      {
        excerpt:
          "Ne, me siguri, në çdo popull dërguam të dërguar: Adhuroni Allahun dhe largohuni prej zotave të rremë.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Çfarë është një profet në Islami?",
    summary: "Një njeri i zgjedhur që merr shpallje dhe i thërret njerëzit tek Allahu.",
    body: [
      "Profeti është një qenie njerëzore e zgjedhur nga Allahu për të marrë shpallje dhe për t'i udhëzuar njerëzit drejt teuhidit, adhurimit dhe sjelljes së drejtë.",
      "Profetët nuk janë hyjnorë dhe nuk adhurohen kurrë. Ata janë krijesat më të mira në bindje, karakter dhe besueshmëri, ndërsa mbeten robër të Allahut.",
      "Misioni i tyre është një në themel: adhuroni vetëm Allahun. Detajet specifike ligjore mund të ndryshojnë ndërmjet komuniteteve sipas urtësisë së Allahut.",
    ],
    quran: [
      {
        excerpt:
          "Të dërguarit e tyre u thanë atyre: Ne jemi vetëm njerëz si ju, por Allahu e favorizon atë që do prej robërve të Tij.",
      },
      {
        excerpt:
          "Ne nuk dërguam asnjë të dërguar para teje, përveç që i shpallëm atij: Nuk ka zot tjetër përveç Meje, andaj më adhuroni Mua.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nabi vs Resul",
    summary: "Një dallim i dobishëm në bursë, ndërkohë që të dy janë profetë të nderuar.",
    body: [
      "Në diturinë islame, një dallim i përbashkët është se çdo resul është nabi, por jo çdo nabi është resul. Një resul shpesh përshkruhet si i dërguar me një mandat të veçantë për një popull, ndërsa një nabi vazhdon udhëzimin përmes shpalljes.",
      "Kur'ani i përdor të dy termat me nder, dhe muslimanët besojnë në të gjithë profetët dhe të dërguarit pa refuzuar asnjë.",
      "Përkufizimet e sakta teknike mund të ndryshojnë sipas frazave shkencore, por mësimi praktik është i qëndrueshëm: pranoni shpalljen me përulësi dhe ndiqni udhëzimin e Allahut.",
    ],
    quran: [
      {
        excerpt: "Ai u zgjodh dhe ishte i dërguar dhe profet.",
      },
      {
        excerpt: "Ne nuk bëjmë dallim ndërmjet asnjë prej të dërguarve të Tij.",
      },
    ],
    disclaimer:
      "Detajet e terminologjisë janë paraqitur në një mënyrë të gjerë, asnjanëse nga ana e studiuesve; konsultohuni me mësues të kualifikuar për klasifikime të avancuara teologjike.",
    appLinks: [{}],
  },
  {
    title: "Mësime të përbashkëta nga profetët",
    summary: "Temat e përsëritura: teuhidi, durimi, pendimi dhe guximi moral.",
    body: [
      "Përgjatë brezave, profetët thirrën në një themel: adhuroni vetëm Allahun dhe shmangni të gjitha format e shirkut. Ky është thelbi i pandryshueshëm i zbulesës.",
      "Jetët e tyre demonstrojnë gjithashtu sabr nën refuzim, besim në Allahun gjatë pasigurisë dhe gatishmëri për të reformuar shoqërinë me urtësi dhe guxim.",
      "Studimi i tyre krijon elasticitet: besimtarët mësojnë të pendohen shpejt, të udhëheqin në mënyrë etike dhe të mbeten parimorë edhe kur e vërteta nuk është e pëlqyer.",
    ],
    quran: [
      {
        excerpt: "Në tregimet e tyre është një mësim për njerëzit që kuptojnë.",
      },
      {
        excerpt: "Ata janë të cilët Allahu i ka udhëzuar, andaj ndiqni udhëzimin e tyre.",
      },
    ],
    actions: [
      "Zgjidhni një mësim profetik çdo javë dhe zbatojeni atë me qëllim.",
      "Reflektoni pas namazit se ku keni nevojë për më shumë durim ose pendim.",
      "Mësojini rregullisht një histori autentike profetike familjes ose miqve.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Mrekullitë dhe shenjat e profetësisë",
    summary: "Mrekullitë e vërtetojnë të vërtetën me lejen e Allahut, por nuk e detyrojnë besimin.",
    body: [
      "Allahu u dha profetëve shenja të qarta të përshtatshme për komunitetet e tyre: arkën e Nuhut, shenjat e Musait para Faraonit, mrekullitë e Isait me lejen e Allahut dhe Kur'anin për Muhamedin a.s.",
      "Mrekullitë nuk janë fuqi të pavarura të profetëve; ato ndodhin me vullnetin e Allahut për të mbështetur shpalljen dhe për të vendosur prova.",
      "Kur'ani tregon se disa ende refuzuan pavarësisht shenjave, dëshmimi i udhëzimit varet nga sinqeriteti dhe nënshtrimi, jo vetëm nga spektakli.",
    ],
    quran: [
      {
        excerpt:
          "Ne i dërguam të dërguarit Tanë me argumente të qarta dhe me ta zbritëm Librin dhe Peshoren.",
      },
      {
        excerpt:
          "Thuaj: Shenjat janë vetëm te All-llahu... A nuk u mjafton atyre që Ne të shpallëm ty Librin që u lexohet atyre?",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Pasqyrë e Kur'anit për profetët",
    summary: "Kurani përmend njëzet e pesë profetë dhe paraqet një mesazh të qëndrueshëm.",
    body: [
      "Kurani përmend drejtpërdrejt njëzet e pesë profetë dhe referon shumë më tepër lajmëtarë. Historitë e tyre shpërndahen nëpër sure për reflektim dhe udhëzim.",
      "Megjithëse cilësimet ndryshojnë, thirrja e tyre është një: teuhid, drejtësi, llogaridhënie dhe mëshirë përmes pendimit.",
      "Ky modul qëndron i bazuar në Kur'an dhe i mban të shkurtra detajet dytësore historike, përveç nëse mbështetet nga prova të besueshme.",
    ],
    quran: [
      {
        excerpt:
          "Ne kemi dërguar të dërguar edhe para jush; prej tyre janë ata që të kemi lidhur me ty dhe prej tyre janë ata që nuk të kemi lidhur me ty.",
      },
      {
        excerpt:
          "Ne besojmë në Allahun dhe atë që u shpall... dhe atë që iu dha Musait, Isait dhe profetëve nga Zoti i tyre.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Referencat dhe metoda e leximit",
    summary: "Si t'i studiojmë profetët me autenticitet, ekuilibër dhe përfitim.",
    body: [
      "Filloni me pasazhe Kur'anore, pastaj lexoni hadithin autentik, pastaj konsultohuni me tefsirin e besueshëm për kontekstin. Ky urdhër e mban të mësuarit të rrënjosur në zbulesë.",
      "Shmangni raportet e bujshme ose të dobëta që bien ndesh me parimet Kur'anore ose me dinjitetin profetik. Jo çdo histori popullore ka prova të shëndosha.",
      "Përdorni biografitë profetike për të reformuar adhurimin dhe karakterin tuaj, jo vetëm për të mbledhur fakte historike.",
    ],
    quran: [
      {
        excerpt:
          "Ata që e dëgjojnë fjalën dhe e ndjekin atë më të mirën, të tillët janë të cilët i ka udhëzuar Allahu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kush ecën në një rrugë për të kërkuar dituri, Allahu ia lehtëson rrugën për në Xhenet.",
      },
    ],
    actions: [
      "Lexoni çdo javë një tregim profeti drejtpërdrejt nga Kurani.",
      "Mbani shënime për mësimet praktike, jo vetëm për faktet e afateve kohore.",
      "Verifikoni transmetimet dytësore me dijetarë të besueshëm.",
    ],
    disclaimer:
      "Datat historike dhe vendndodhjet e sakta mund të ndryshojnë sipas burimeve; kjo qendër i jep përparësi udhëzimeve të dakorduara, të bazuara në tekst.",
    appLinks: [{}, {}],
  },
];

export const PROPHETS_BIO_TOPICS_SQ: DeepPartial<ProphetsTopic>[] = [
  {
    title: "Ademi (AS)",
    summary: "Njeriu i parë dhe profeti i parë, i nderuar me dituri dhe i sprovuar me bindje.",
    body: [
      "Ademi (paqja qoftë mbi të) është vendi ku fillon historia dhe profetësia njerëzore. Allahu e krijoi atë me duart e veta nga balta, i fryu nga shpirti i Tij dhe i mësoi emrat e të gjitha gjërave. Kur engjëjt u urdhëruan t'i bëjnë sexhde Ademit për nder, ata iu bindën - por Iblisi refuzoi nga mendjemadhësia dhe që nga ai moment u shpall armiqësia e tij ndaj Ademit dhe pasardhësve të tij. Kjo skenë hapëse vendos dramën qendrore të çdo jete njerëzore: zgjedhjen midis bindjes së përulur dhe rebelimit krenar (Kur'an 2:30–39).",
      "Allahu e vendosi Ademin dhe gruan e tij Havua në Xhenet dhe u lejoi atyre çdo gjë përveç një peme. Të pëshpëritur nga shejtani, ata hëngrën prej saj. Por vini re dallimin mes tyre dhe Iblisit: Iblisi e arsyetoi mëkatin e tij, ndërsa Ademi dhe Havaja menjëherë u penduan dhe u kthyen te Allahu me fjalët që Ai u mësoi: “O Zoti ynë, ne i kemi bërë padrejtësi vetes, e nëse nuk na fal dhe nuk na mëshiron, ne me siguri do të jemi ndër të humburit” (Kur’an 7:23). Allahu ua pranoi pendimin dhe i dërgoi në tokë me premtimin e udhëzimit për të gjithë ata që do ta ndiqnin.",
      "Mësimi i Ademit është mësimi i shpresës: një qenie njerëzore është e nderuar dhe e dinjitetshme, por sprovohet dhe do të rrëshqasë. Ajo që e përcakton besimtarin nuk është të qenit pa mëkate – vetëm Allahu është i përsosur – por kthimi i shpejtë dhe i sinqertë në teube. Historia e Ademit mëson gjithashtu se shejtani është një armik i shpallur dhe i hapur, arma e vetme e të cilit është pëshpëritja; Përgjigja është përkujtimi i Allahut dhe kërkimi i faljes prej Tij. Nga Adami e tutje, zbritja në tokë nuk është një ndëshkim, por një skenë për provën e vërtetë të njerëzimit.",
    ],
    profile: {
      nation: "Njerëzimi i hershëm",
      location: "Xheneti pastaj dheu",
      era: "Fillimi i historisë njerëzore",
      mission: "Mësojuni njerëzve të parë teuhidin dhe bindjen ndaj Allahut.",
      challenges: [
        "Armiqësia e Iblisit",
        "Jeta pas zbritjes në tokë",
        "Udhëheqja e familjes së parë njerëzore",
      ],
      miracles: [
        "Krijimi me urdhër të Allahut pa prindër",
        "Duke u mësuar emrat e të gjitha gjërave",
      ],
      majorEvents: [
        "Krijimi i Adamit dhe mësimi i emrave",
        "Sexhdeja e engjëjve dhe refuzimi i Iblisit",
        "Rrëshqitja në Xhenet, pendimi i sinqertë dhe zbritja në tokë",
      ],
      lessons: [
        "Nderi njerëzor vjen i bashkuar me përgjegjësinë",
        "Pendimi i sinqertë rihap derën pas çdo gabimi",
        "Shejtani është një armik i qartë dhe i përhershëm",
      ],
      facts: [
        "Ademi është njeriu i parë dhe profeti i parë",
        "Pendimi i tij është modeli i parë i teubes në Kur'an",
      ],
    },
    quran: [
      {
        excerpt:
          "Dhe [përmend] kur Zoti yt u tha engjëjve: Unë do të bëj në tokë një autoritet të njëpasnjëshëm... Pastaj Ademi pranoi fjalë nga Zoti i tij dhe ia pranoi pendimin.",
      },
      {
        excerpt:
          "Ata thanë: “O Zoti ynë, ne i kemi bërë padrejtësi vetes, e nëse nuk na falë dhe nuk na mëshiron, ne me siguri do të jemi prej të humburve.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Në Ditën e Kijametit njerëzit do të vijnë te Ademi dhe do t'i thonë: Ti je babai i njerëzve; ndërmjetëso për ne te Zoti yt.",
      },
      {
        excerpt:
          "Ademi dhe Musa u grindën. Musai tha: Ti je ai që Allahu e krijoi me dorën e Tij. Ademi tha: A më fajësoni mua për një çështje që më ka caktuar Allahu para se të më krijonte? Kështu Ademi e fitoi Musain në argument.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Idrisi (AS)",
    summary:
      "Një profet i vërtetë i lavdëruar për durim dhe i ngritur nga Allahu në një pozitë të lartë.",
    body: [
      "Idrisi (paqja qoftë mbi të) përmendet vetëm shkurt në Kuran, por çdo fjalë për të është lavdërim. Allahu e quan atë \"një njeri i vërtetë, një profet\" (Kur'an 19:56) dhe e rendit atë në mesin e durimtarëve dhe të drejtëve përkrah Ismailit dhe Dhul-Kiflit (Kur'an 21:85-86). Historia e tij tregon se në sytë e Allahut, karakteri i një personi - vërtetësia, durimi, adhurimi i palëkundur - ka më shumë rëndësi sesa gjatësia e biografisë së tij.",
      "Allahu thotë për të: \"Dhe Ne e ngritëm atë në një pozitë të lartë\" (Kur'an 19:57). Dijetarët e kanë kuptuar këtë për t'iu referuar gradës së tij të ngritur tek Allahu. Përtej asaj që pohon Kurani dhe raportet autentike, përrallat popullore që i janë bashkangjitur Idrisit (si për shembull të qenit i pari që ka shkruar me stilolaps apo profesione të veçanta të kësaj bote) nuk janë vërtetuar me anë të dëshmive të shëndosha, kështu që një besimtar i kujdesshëm i përmbahet asaj që shpallja konfirmon në vend që të zbukuron.",
      "Mësimi i Idrisit është se afërsia me Allahun nuk matet me famë apo me histori të gjatë, por me sinqeritet dhe qëndrueshmëri. Një shërbëtor i qetë, i sinqertë dhe i palëkundur mund të mbajë një pozicion me Allahun më lart se shumë njerëz emrat e të cilëve historia i kujton me zë të lartë.",
    ],
    profile: {
      era: "Brezat e hershëm pas Adamit",
      mission: "Thirr njerëzit që ta adhurojnë Allahun me vërtetësi dhe drejtësi.",
      lessons: [
        "Vërtetësia ngre gradën e një shërbëtori",
        "Jo historia e çdo profeti është e detajuar – dhe kjo është me qëllim",
        "Qëndrueshmëria e qëndrueshme dhe besnike është e dashur për Allahun",
      ],
      facts: [
        "I quajtur në Kuran si i vërtetë dhe profet",
        "I përshkruar si i ngritur në një pozitë të lartë nga Allahu",
      ],
    },
    quran: [
      {
        excerpt:
          "Dhe përmendeni në libër Idrisin. Vërtet, ai ishte njeri i së vërtetës dhe profet. Dhe Ne e ngritëm atë në një lartësi të lartë.",
      },
      {
        excerpt:
          "Dhe Ismaili, Idrisi dhe Dhul-Kifli, të gjithë ishin prej durimtarëve. Dhe Ne i futëm ata në mëshirën Tonë; me të vërtetë, ata ishin nga të drejtët.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nuh (AS)",
    summary:
      "Një lajmëtar i një durimi të jashtëzakonshëm që thirri popullin e tij për shekuj para përmbytjes.",
    body: [
      "Nuhu (paqja qoftë mbi të) u dërgua te një popull që e kishte braktisur teuhidin dhe ishte marrë në adhurimin e idhujve. Mesazhi i tij i vetëm dhe i palëkundur ishte: 'O populli im, adhuroni Allahun; ju nuk keni zot tjetër pos Tij' (Kur'an 7:59). Kurani ruan rrëfimin e tij për misionin në suren Nuh: ai i thirri ata natën dhe ditën, publikisht dhe në fshehtësi, duke i inkurajuar dhe paralajmëruar - duke i kujtuar se kthimi tek Allahu sjell shi, pasuri, fëmijë dhe kopshte. Megjithatë, brez pas brezi, shumica u larguan, vunë gishtat në vesh dhe u bënë më arrogantë (Kur'an 71:1–28).",
      "Kur'ani thekson gjatësinë e madhe të durimit të tij: ai mbeti në mesin e tyre 'një mijë vjet më pak pesëdhjetë' (Kur'an 29:14), dhe ende vetëm disa besuan. Kur u bë e qartë se nuk do ta pranonte më besimin, Allahu e urdhëroi atë të ndërtonte arkën sipas udhëzimit hyjnor, ndërsa jobesimtarët talleshin. Pastaj përmbytjet erdhën si gjykim. Djali i Nuhut refuzoi të hipte, duke i besuar një mali mbi paralajmërimin e babait të tij dhe ishte në mesin e atyre që u mbytën - një kujtesë therëse se lidhjet e gjakut nuk mund të zëvendësojnë besimin (Kur'an 11:42–46).",
      "Historia e Nuhut është kryeklasa e Kuranit në davet: detyra e thirrësit është shpërndarja e sinqertë, e durueshme, e qartë – rezultatet i takojnë vetëm Allahut. Ai gjithashtu mëson se udhëzimi është një çështje e zemrës, jo e prejardhjes: djali i një profeti mund të humbasë, ndërsa të huajt mund të shpëtohen. Besimtarët që hipën në arkë u bënë fara e një njerëzimi të përtërirë dhe Nuhu nderohet si një nga pesë të dërguarit më të mëdhenj të vendosmërisë (ulul-azm).",
    ],
    profile: {
      nation: "Populli i tij para përmbytjes",
      location: "Rajoni i lashtë i Mesopotamisë (i cituar gjerësisht)",
      era: "Antikiteti shumë i hershëm",
      mission: "Thirr popullin e tij në teuhid dhe pendim.",
      challenges: [
        "Tallje nga liderët dhe elita",
        "Shekuj refuzimi me pak besimtarë",
        "Mosbesimi dhe mbytja e djalit të tij",
      ],
      miracles: ["Arka e ndërtuar me udhëzim hyjnor", "Shpëtimi i besimtarëve përmes përmbytjes"],
      majorEvents: [
        "Një thirrje për teuhid që zgjat gati një mijë vjet",
        "Ndërtimi i arkës me urdhër të Allahut",
        "Përmbytje dhe një fillim i ri për besimtarët",
      ],
      lessons: [
        "Këmbëngulja në davet, duke ia lënë rezultatet Allahut",
        "Lidhjet familjare nuk mund të zëvendësojnë besimin",
        "Allahu i shpëton gjithmonë të sinqertët",
      ],
      facts: [
        "Njëri nga pesë të dërguarit e vendosmërisë (ulul-azm)",
        "Historia e tij shfaqet në shumë sure, duke përfshirë një me emrin e tij",
      ],
    },
    quran: [
      {
        excerpt:
          "Dhe Nuhut i është shpallur se askush nga populli yt nuk do të besojë përveç atyre që kanë besuar, andaj mos u brengos për atë që kanë bërë.",
      },
      {
        excerpt:
          "Ai tha: “O Zoti im, vërtet unë i ftova njerëzit e mi natë e ditë, por ftesa ime i shtoi ata vetëm në arrati.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Njerëzit do të vijnë te Nuhu dhe do t'i thonë: O Nuh, ti je i dërguari i parë për banorët e tokës dhe Allahu të ka emëruar rob mirënjohës; ndërmjetësoni për ne.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Hud (AS)",
    summary:
      "Dërguar te 'Adi, një popull i fuqishëm dhe i tmerrshëm që e lanë forcën e tyre të shndërrohej në mendjemadhësi.",
    body: [
      "Hudi (paqja qoftë mbi të) iu dërgua popullit të 'Adit, një qytetërim që Kur'ani e përshkruan si fizikisht të fuqishëm dhe të famshëm për ndërtimin e strukturave të larta e të përpunuara 'të ngjashme me të cilat nuk ishin krijuar kurrë në tokë' (Kur'an 89:6–8). Këtij populli krenar Hudi i solli të njëjtin mesazh si çdo profet: 'O populli im, adhuroni Allahun; ju nuk keni zot tjetër përveç Tij. A nuk do t'i frikësoheni Atij?' (Kur'an 7:65). Ai ishte një prej tyre, nuk kërkonte asnjë shpërblim, vetëm i thërriste në mirënjohje dhe larg shtypjes.",
      "Udhëheqësit e tyre u përgjigjën me tallje, duke e akuzuar për marrëzi dhe gënjeshtër, duke u kapur pas idhujve të të parëve të tyre. Ata e sfiduan atë që të sillte dënimin për të cilin ai paralajmëroi, të sigurt se asnjë forcë nuk mund të përputhej me forcën e tyre (Kur'an 46:21–25). Hudi i paralajmëroi ata qartë se fuqia e kësaj bote dhe qytetërimi madhështor nuk mbrojnë askënd që i mohon shenjat e Allahut dhe bëhet arrogant në tokë.",
      "Gjykimi erdhi si një erë e furishme, ulëritëse që Allahu 'ua imponoi atyre për shtatë netë e tetë ditë me radhë' (Kur'an 69:6–7), duke i lënë njerëzit dikur të fuqishëm të rrëzuar si trungje të zbrazëta - ndërsa Hudin dhe besimtarët u shpëtuan nga mëshira e Allahut. Historia e Adit përsëritet në të gjithë Kuranin si një paralajmërim i vazhdueshëm: forca, pasuria dhe arritjet janë dhurata që duhen përballuar me përulësi dhe mirënjohje, jo me krenari. Një popull është përgjegjës para Allahut sado i avancuar të bëhet.",
    ],
    profile: {
      nation: "Njerëzit e Ad",
      location: "Rajoni Al-Ahkaf (zona e Arabisë jugore në tefsirin klasik)",
      era: "Pas Nuhut",
      mission: "Rivendos teuhidin, mirënjohjen dhe drejtësinë tek Ad.",
      challenges: [
        "Arroganca kolektive e ndërtuar mbi forcën dhe pasurinë",
        "Tallje me shpalljen dhe profetin",
        "Një kërkesë sfiduese për dënim të menjëhershëm",
      ],
      miracles: ["Mbrojtja e besimtarëve gjatë dënimit"],
      majorEvents: [
        "Thirrja për pendim dhe mirënjohje",
        "Paralajmërim për një erë të fortë",
        "Shkatërrimi i Adit gjatë shtatë netëve dhe tetë ditëve",
      ],
      lessons: [
        "Forca pa përulësi çon në shkatërrim",
        "Kombet dhe qytetërimet janë përgjegjës para Allahut",
        "Paralajmërimet profetike janë një mëshirë e dërguar para gjykimit",
      ],
      facts: [
        "Historia e Adit përsëritet nëpër Kuran si një paralajmërim për komunitetet e mëvonshme",
      ],
    },
    quran: [
      {
        excerpt:
          "Dhe Adit [Ne dërguam] vëllanë e tyre Hudin. Ai tha: O populli im, adhuroni Allahun; ju nuk keni zot tjetër përveç Tij. A nuk do t'i frikësoheni Atij?",
      },
      {
        excerpt:
          "E kur e panë atë si një re që u afrohet luginave të tyre, thanë: Kjo është një re që na sjell shi! Përkundrazi, është ajo për të cilën keni qenë të paduruar: një erë brenda saj është një dënim i dhembshëm.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Salihu (as)",
    summary:
      "Dërguar te Themudi, të cilit iu dha mrekullia e devesë dhe shkatërruan shenjën që kërkuan.",
    body: [
      "Salihu (paqja qoftë mbi të) u dërgua te Themudi, një popull që pasoi Adin dhe ishte i njohur për gdhendjen e shtëpive madhështore në male dhe për jetesën në lehtësi (Kur'an 7:74). Ai i thirri ata, si vëllanë e tyre, që të adhurojnë vetëm Allahun dhe të braktisin korrupsionin e udhëheqësve të tyre. Kur ata kërkuan një shenjë për të vërtetuar vërtetësinë e tij, Allahu dhuroi një të qartë dhe publike: një deve, me një rregullim të caktuar që do të pinte në një ditë të caktuar dhe ata në një tjetër (Kur'an 26:155-156).",
      "Salihu i paralajmëroi ata në mënyrë eksplicite: 'Mos e prekni atë me të keqe, se do t'ju kapë një dënim i afërt' (Kur'an 26:156). Shenja ishte një provë e përmbajtjes - a mund të respektonin ata një kufi të caktuar nga Allahu? Por më sfiduesja prej tyre preu dhe vrau devenë në rebelim të hapur, pastaj sfidoi Salihun që të sillte dënimin e premtuar (Kur'an 7:77). Vrasja e devesë emërtohet si akti i të paktëve të mjerë, megjithatë i gjithë populli mori pjesë në krim duke u dhënë dakord për të.",
      "Dënimi goditi brenda tri ditëve: një shpërthim i fuqishëm dhe një tërmet i pushtoi në shtëpitë e tyre dhe Themudi mbeti i pajetë - ndërsa Allahu e shpëtoi Salihun dhe ata që besuan (Kur'an 7:78–79; 91:14). Mësimi është i mprehtë: mrekullitë nuk e zbusin zemrën kokëfortë; ata vetëm ngrenë aksionet e llogaridhënies. Një shenjë e kërkuar dhe më pas e sfiduar bëhet argument kundër atyre që e kërkuan. Dhe heshtja përpara së keqes nuk është asnjanësi - një komb i tërë u mbajt përgjegjës për veprën e disave.",
    ],
    profile: {
      nation: "Njerëzit e Themudit",
      location: "Al-Hixhr / Arabia veriperëndimore",
      era: "Pas 'Ad",
      mission: "Thirre Themudin nga idhujtaria dhe korrupsioni në teuhid.",
      challenges: [
        "Një kërkesë për një mrekulli, pastaj refuzim i saj",
        "Sfidim i hapur pasi u dha shenja e qartë",
        "Kërcënimet ndaj Salihut dhe besimtarëve",
      ],
      miracles: ["Deveja e dërguar si shenjë e dukshme nga Allahu"],
      majorEvents: [
        "Shfaqja e devesë dhe ujit të përbashkët",
        "Prerja dhe vrasja e devesë",
        "Shpërthimi që shkatërroi refuzuesit",
      ],
      lessons: [
        "Mrekullitë nuk i bëjnë dobi një zemre kokëfortë",
        "Thyerja e një kufiri të caktuar nga Allahu mbart pasoja reale",
        "Pëlqimi për të keqen pjesë në fajin e saj",
      ],
      facts: ["Themudi ishte i njohur për gdhendjen e shtëpive të përpunuara në male"],
    },
    quran: [
      {
        excerpt:
          "Kjo është deveja e Allahut si shenjë për ju, andaj lëreni të hajë në tokën e Allahut dhe mos e prekni atë me dëm, se mos ju kapë një dënim i dhembshëm.",
      },
      {
        excerpt:
          "Themudi përgënjeshtroi për shkak të shkeljes së tyre, kur u dërgua më i mjeri prej tyre... Andaj Zoti i tyre solli mbi ta shkatërrimin për mëkatin e tyre dhe i rrafshoi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ibrahim (AS)",
    summary:
      "Halilullah, miku i Allahut dhe modeli i teuhidit të pastër, i sprovuar dhe triumfues në çdo sprovë.",
    body: [
      "Ibrahimi (paqja qoftë mbi të) është shembulli suprem i Kur'anit i monoteizmit të pastër të arritur përmes reflektimit dhe guximit. Si një i ri në një shoqëri të mbytur në adhurimin e idhujve, ai arsyetonte hapur me popullin e tij, babanë e tij, madje edhe mbretin: dielli, hëna dhe yjet të gjithë perëndojnë dhe zbehen, kështu që si mund të ishin perëndi? (Kur'an 6:75–79). Për të ekspozuar pafuqinë e idhujve, ai i theu të gjithë, përveç atyre më të mëdhenjtë dhe i tha popullit të tij që t'i pyesnin vetë idhujt se çfarë ndodhi - duke i detyruar ata të pranonin se perënditë e tyre nuk mund të flisnin dhe as të mbroheshin (Kur'an 21:57–67).",
      "Për këtë qëndrim, ai u hodh në një zjarr flakërues, por Allahu urdhëroi: 'O zjarr, bëhu qetësi dhe siguri për Ibrahimin' (Kur'an 21:69), dhe ai doli i padëmtuar. Jeta e tij u shndërrua në një zinxhir sprovash të shoqëruara me dorëzim të plotë: ai u largua nga vendlindja e tij për hir të Allahut, u lut për pasardhës të drejtë në pleqëri dhe iu dha Ismaili dhe Is'haku, u sprovua me urdhrin për të sakrifikuar djalin e tij të dashur - të cilin babai dhe i biri e pranuan në nënshtrim para se Allahu ta shpërblente djalin e Ismailit, dhe e rriti namazin me Kabe. një popull besimtarësh dhe mes tyre që të dërgohet një i dërguar (Kur'an 2:124–129; 37:100–107).",
      "Për shkak të këtij përkushtimi të pakrahasueshëm, Allahu e mori Ibrahimin si halil - një mik të ngushtë (Kur'an 4:125) - dhe e bëri atë një imam, një udhëheqës për mbarë njerëzimin (Kur'an 2:124). Trashëgimia e tij kalon përmes profetëve që erdhën nga linja e tij, përmes riteve të haxhit dhe përmes vetë identitetit të muslimanit, i cili është i urdhëruar të ndjekë 'fenë e Ibrahimit, me prirje drejt së vërtetës' (Kur'an 3:95). Historia e tij mëson tavakkulin në sprovat më të vështira, se udhëheqja e vërtetë ndërtohet mbi sakrifica dhe se besimi i sinqertë mund të riformësojë breza të tërë.",
    ],
    profile: {
      nation: "Komunitetet Mesopotamiane dhe Levantine",
      location: "Iraku, Levanti dhe Meka",
      era: "Antikiteti i mesëm",
      mission:
        "Rigjallëroni teuhidin e pastër dhe krijoni një trashëgimi të qëndrueshme nënshtrimi.",
      challenges: [
        "Përballja me idhujtarët, babain e tij dhe një mbret tiran",
        "Migrimi larg vendlindjes për Allahun",
        "Gjyqi i sakrifikimit të djalit të tij të dashur",
      ],
      miracles: [
        "Zjarri u bë i ftohtë dhe i sigurt me urdhrin e Allahut",
        "Pasardhës të drejtë të dhënë në pleqëri",
      ],
      majorEvents: [
        "Debati dhe thyerja e idhujve",
        "Duke u hedhur në zjarr dhe duke u dorëzuar",
        "Ndërtimi i Qabes me Ismailin dhe sprova e madhe e sakrificës",
      ],
      lessons: [
        "Tevakkul (mbështetja në Allahun) në sprovat më të rënda",
        "Udhëheqja e vërtetë kërkon sakrificë",
        "Besimi i sinqertë mund të riformojë brezat",
      ],
      facts: [
        "I njohur si Halilullah, miku intim i Allahut",
        "Paraardhësi i profetëve përmes Ismailit dhe Is'hakut",
      ],
    },
    quran: [
      {
        excerpt:
          "Dhe [përmend] kur Ibrahimi u sprovua nga Zoti i tij me urdhra dhe ai i përmbushi ato. Ai tha: Me të vërtetë, unë do të të bëj prijës për njerëzit.",
      },
      {
        excerpt:
          "Ne thamë: O zjarr, bëhu qetësi dhe shpëtim për Ibrahimin. Dhe ata synuan t'i dëmtojë, por Ne i bëmë ata më të humburit.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Do të mblidheni këmbëzbathur, lakuriq dhe të parrethprerë. I pari që do të vishet në Ditën e Kijametit do të jetë Ibrahimi.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Lut (AS)",
    summary:
      "Një profet që e paralajmëroi popullin e tij kundër një imoraliteti të rëndë që asnjë komb nuk kishte kryer para tyre.",
    body: [
      'Luti (paqja qoftë mbi të) ishte bashkëkohës dhe i afërm i Ibrahimit, i cili migroi me të dhe më pas u dërgua te njerëzit e Sodomës dhe qyteteve të afërta. Krahas thirrjes për të adhuruar vetëm Allahun, populli i tij ishte fajtor për një imoralitet të paturpshëm, kur Kurani thotë se "askush në të gjitha botët nuk kishte kryer më parë" - duke iu afruar burrave në vend të grave dhe duke praktikuar haptazi sjellje të pahijshme në tubimet e tyre (Kur\'an 7:80-81; 29:28-29). Luti i thirri ata, me sinqeritet, drejt pastërtisë dhe kufijve të natyrshëm të vendosur nga Allahu.',
      "Ata e takuan reformën e tij jo me argument, por me armiqësi, duke e kërcënuar se do ta dëbonin dhe duke u tallur me thirrjen e tij për mirësjellje: 'Përzëini ata nga qyteti juaj; ata janë njerëz që e mbajnë veten të pastër!' (Kur'an 7:82). Edhe brenda familjes së tij, sprova ishte e ashpër – gruaja e tij ra në anën e të korruptuarve dhe nuk besoi, duke dëshmuar sërish se udhëzimi jepet nga Allahu dhe nuk trashëgohet nëpërmjet martesës ose gjakut (Kur'an 66:10).",
      "Kur erdhi urdhri, Allahu dërgoi engjëj në formën e mysafirëve. Njerëzit nxituan për t'i dëmtuar edhe ata, dhe Luti u ndje i pafuqishëm derisa engjëjt zbuluan identitetin e tyre dhe i thanë që të largohej me besimtarët natën. Në agim, qytetet u përmbysën dhe u goditën me gurë (Kur'an 11:77–83). Historia e Lutit është një paralajmërim i qartë se e vërteta morale nuk ndryshon sepse një shoqëri e miraton mëkatin dhe e normalizon atë publikisht – dhe se Allahu gjithmonë i shpëton të sinqertët, sado të paktë të jenë ata.",
    ],
    profile: {
      nation: "Populli i Sodomës dhe i qyteteve fqinje",
      location: "Rajoni i Detit të Vdekur (cituar gjerësisht)",
      era: "Koha e Ibrahimit",
      mission: "Thirr popullin e tij nga paturpësia dhe mosbesimi i hapur në teuhid dhe pastërti.",
      challenges: [
        "Imoraliteti i rrënjosur publik",
        "Tallje dhe kërcënime për dëbim",
        "Mosbesimi i gruas së tij",
      ],
      majorEvents: [
        "Paralajmërime të vazhdueshme kundër paturpësisë",
        "Vizita e engjëjve të maskuar si mysafirë",
        "Përmbysja e qyteteve",
      ],
      lessons: [
        "E vërteta morale nuk ndryshon me miratimin shoqëror",
        "Besimtarët mund të jenë shumë pak",
        "Allahu i shpëton të sinqertët nga shkatërrimi kolektiv",
      ],
      facts: ["Një i afërm i Ibrahimit që migroi me të dhe u dërgua në Sodomë"],
    },
    quran: [
      {
        excerpt:
          "A u afroheni meshkujve të botëve dhe a e lini atë që Zoti juaj ka krijuar për ju si çift? Përkundrazi, ju jeni një popull shkelës.",
      },
      {
        excerpt:
          "Pra, kur erdhi urdhri Ynë, Ne i bëmë pjesët më të larta të qyteteve më të ulëtat e tyre dhe lëshuam mbi to gurë prej balte të fortë.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ismail (as)",
    summary:
      "Profet besnik në fjalën e tij, durimtar në sprovë dhe ndërtues i Qabes me babain e tij Ibrahimin.",
    body: [
      "Ismaili (paqja qoftë mbi të) ishte djali i parëlindur i Ibrahimit, i dhuruar në pleqëri. Jeta e tij filloi me një provë befasuese të besimit: me urdhrin e Allahut, Ibrahimi e la foshnjën Ismail dhe nënën e tij Haxheren në luginën e shkretë të Mekës, ku nuk rritej asnjë prodhim dhe nuk rridhte ujë. Pikërisht aty, ndërsa Haxheri vrapoi në kërkim të ujit midis kodrave të Safa dhe Mervah, Allahu bëri që të buronte burimi i Zemzemit - një akt sigurie që pasardhësit e Haxherit dhe çdo haxhi e rishfaqen në sa'i të Haxhit dhe Umres deri më sot.",
      "Kur ishte i ri, Ismaili u përball me sprovën më të madhe së bashku me të atin: kur Ibrahimi i tregoi për vizionin për ta sakrifikuar, Ismaili u përgjigj me nënshtrim që të lë pa frymë: 'O babai im, vepro ashtu siç je urdhëruar; do të më gjesh mua, nëse do Allahu, prej të durueshëmve' (Kur'an 37:102). Të dy u dorëzuan plotësisht dhe Allahu e shpërbleu Ismailin me një sakrificë të madhe, duke e nderuar përgjithmonë bindjen e tyre. Babai dhe bir pastaj ngritën së bashku themelet e Qabes, duke u lutur: \"Zoti ynë, pranoje këtë prej nesh; me të vërtetë Ti je Dëgjuesi, i Dijshmi' (Kur'an 2:127).",
      "Kur'ani e përmbledh karakterin e tij në një rresht që ia vlen të mësohet përmendësh: 'Ai ishte i vërtetë në premtimin e tij dhe ishte i dërguar dhe profet. Ai e urdhëronte familjen e tij për namaz dhe zekat dhe ishte i kënaqur me Zotin e tij' (Kur'an 19:54-55). Jeta e Ismailit mëson bukurinë e mbajtjes së fjalës, të adhurimit të palëkundur dhe të një familjeje që bashkëpunon në bindje ndaj Allahut. Nëpërmjet tij, linja profetike arabe përfundimisht arriti te Profeti i fundit, Muhamedi ﷺ.",
    ],
    profile: {
      nation: "Njerëzit e hershëm të rajonit të Mekës",
      location: "Meka",
      era: "Pas shpërnguljes së Ibrahimit",
      mission: "Mbaje teuhidin dhe adhurimin dhe urdhëro familjen e tij për namaz dhe zekat.",
      challenges: [
        "Fillimet e vështira të jetës në një luginë djerrë",
        "Gjyqi i sakrificës",
        "Ruajtja e një jete të përqendruar te adhurimi dhe besimi i shenjtë",
      ],
      miracles: ["Burimi i Zemzemit ishte në shkretëtirë", "I shpenguar nga kurbani i Allahut"],
      majorEvents: [
        "U largua me nënën e tij Haxherja në luginën e Mekës",
        "Gjyqi i sakrificës, u prit me nënshtrim të plotë",
        "Ndërtimi i Qabes me Ibrahimin",
      ],
      lessons: [
        "Mbani premtimet tuaja me besnikëri",
        "Një familje mund të bashkëpunojë në adhurim dhe bindje",
        "Një trashëgimi e shenjtë kërkon karakter të fortë",
      ],
      facts: [
        "I përshkruar në Kuran si i vërtetë ndaj premtimit të tij",
        "Paraardhësi i fiseve arabe dhe linja e fundit profetike",
      ],
    },
    quran: [
      {
        excerpt:
          "Dhe përmendni në libër Ismailin. Vërtet, ai ishte besnik ndaj premtimit të tij dhe ishte i dërguar dhe profet. Ai e urdhëronte familjen e tij për namaz dhe zekat dhe ishte i kënaqur me Zotin e tij.",
      },
      {
        excerpt:
          "Dhe kur Ibrahimi po ngrinte themelet e shtëpisë dhe Ismaili, [ata u lutën]: Zoti ynë, pranoje këtë prej nesh. Vërtet, Ti je Dëgjuesi, i Dijshmi.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Is'haku (AS)",
    summary:
      "Një profet i bekuar që i është dhënë si lajm i gëzuar Ibrahimit dhe babait të Jakubit.",
    body: [
      "Is'haku (paqja qoftë mbi të) i lindi Ibrahimit dhe gruas së tij Sarës në pleqëri - një lindje e shpallur nga engjëjt si lajm i gëzuar kur Sara, duke kaluar moshën e lindjes së fëmijëve, qeshi e habitur. Kur'ani e shënon momentin: 'Ne e përgëzuam atë për Is'hakun dhe, pas Is'hakut, Jakubin' (Kur'an 11:71). Vetë lindja e tij ishte një shenjë se fuqia dhe mëshira e Allahut nuk kufizohen nga kufijtë e zakonshëm njerëzorë dhe një ngushëllim për çdo besimtar që pret një shpresë të vështirë.",
      "Kur'ani vazhdimisht e emëron Is'hakun midis profetëve të drejtë, të zgjedhur dhe fisnikë, duke e përshkruar atë dhe Jakubin si \"forcë në adhurim dhe vizion\" (Kur'an 38:45–47). Nëpërmjet Is'hakut erdhi Ja'kubi (Izra'il) dhe nga Ja'kubi zbriti një zinxhir i gjatë profetësh të dërguar te Beni Isra'il - kështu që Is'haku qëndron si një baba i profecisë, një lidhje në vazhdimësinë e udhëzimit përgjatë brezave.",
      "Historia e tij, ndonëse e thënë shkurt, mbart dy mësime të qëndrueshme: mirënjohjen për dhuratat që Allahu jep përtej pritshmërive tona dhe vetëdijen se prejardhja e drejtë është një amanet – besimi duhet të përcillet, jo thjesht të trashëgohet. Bekimi i vendosur në shtëpinë e Ibrahimit u ruajt sepse e bartnin shërbëtorët e përkushtuar ndaj Allahut.",
    ],
    profile: {
      nation: "komunitetet levantine",
      location: "Levanti (Sham)",
      era: "Pas Ibrahimit",
      mission: "Vazhdoni udhëzimin profetik në linjën e bekuar familjare të Ibrahimit.",
      miracles: ["Një lindje e shpallur prindërve të moshuar si një lajm i gëzuar"],
      majorEvents: [
        "Lajmi i gëzuar që iu dha Ibrahimit dhe Sarës",
        "Vazhdimi i linjës profetike përmes Jakubit",
      ],
      lessons: [
        "Allahu jep shumë përtej pritjeve njerëzore",
        "Prejardhja e drejtë është një amanet që duhet ruajtur",
        "Pasardhja besnike e mban gjallë udhëheqjen",
      ],
      facts: ["Babai i Jakubit", "I quajtur përkrah Ibrahimit dhe Jakubit si familje e zgjedhur"],
    },
    quran: [
      {
        excerpt:
          "Dhe gruaja e tij ishte në këmbë dhe ajo qeshi. Pastaj Ne e përgëzuam atë për Is'hakun dhe, pas Is'hakut, Jakubin.",
      },
      {
        excerpt:
          "Dhe përkujtoni robërit Tanë Ibrahimin, Is'hakun dhe Jakubin, të fuqishmit dhe të pamurit. Në të vërtetë, Ne i zgjodhëm ato për një cilësi ekskluzive: përkujtimin e Shtëpisë.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Jakubi (AS)",
    summary:
      "I quajtur edhe Izraeli, një profet, durimi i bukur i të cilit përmes pikëllimit modelon besimin e palëkundur te Allahu.",
    body: [
      "Jakubi (paqja qoftë mbi të), i quajtur gjithashtu Isra'il, ishte i biri i Is'hakut dhe babai i dymbëdhjetëve që u bënë fiset e Beni Isra'ilit, përfshirë Jusufin. Ai i rriti fëmijët e tij me teuhid dhe Kur'ani ruan besëlidhjen që mori prej tyre në shtratin e vdekjes: \"Çfarë do të adhuroni pas meje?\" Ata u përgjigjën: \"Ne do të adhurojmë Zotin tuaj dhe Zotin e etërve tuaj... një Zot, dhe Atij i nënshtrohemi\" (Kur'an 2:132-133). Shqetësimi i tij më i thellë, deri në fund, ishte besimi i brezit të ardhshëm.",
      "Sprova e tij e madhe shpaloset brenda historisë së Jusufit. Kur djemtë e tij u kthyen me këmishën e Jusufit dhe një pretendim të rremë se një ujk e kishte ngrënë atë, Jakubi e pa mashtrimin dhe u përgjigj jo me zemërim, por me përmbajtje: \"Pra, durimi është më i përshtatshmi, dhe Allahu është Ai që kërkohet ndihmë kundër asaj që përshkruani\" (Kur'an 12:18). Për vite të gjata ndarjeje ai u pikëllua derisa, siç thotë Kur'ani prekës, sytë e tij u zbardhën nga pikëllimi - megjithatë ai e ndrydhi pikëllimin e tij dhe nuk u dëshpërua kurrë (Kur'an 12:84).",
      "Thelbi i shembullit të Jakubit është një fjali: 'Mos e humbni shpresën ndaj mëshirës së Allahut; me të vërtetë, askush nuk e dëshpëron mëshirën e Allahut përveç popullit jobesimtar” (Kur'an 12:87). I tij është modeli i Sabr Xhamilit - durimit të bukur - që nuk është dorëheqje pasive, por besim aktiv dhe shpresëdhënës se urtësia e Allahut do të shpaloset në kohën e vet. Kur Jusufi iu kthye më në fund dhe iu kthye shikimi, ai durim u vërtetua. Jakubi mëson çdo besimtar të pikëlluar që të mbajë në të njëjtën zemër pikëllimin dhe sigurinë.",
    ],
    profile: {
      nation: "Origjina e Beni Isra'ilit",
      location: "Levanti, me migrimin në Egjipt",
      era: "Brezi i Jusufit",
      mission: "Udhëzoji familjen dhe pasardhësit e tij në teuhid.",
      challenges: [
        "Tensione dhe xhelozi mes djemve të tij",
        "Ndarja e gjatë nga Jusufi",
        "Durimi i pikëllimit të thellë pa humbur shpresën",
      ],
      majorEvents: [
        "Këshilla dhe besëlidhja e tij e teuhidit për djemtë e tij",
        "Vitet e gjata pikëllimi durimtar për Jusufin",
        "Ribashkimi i gëzueshëm me Jusufin në Egjipt",
      ],
      lessons: [
        "Durimi i bukur (sabr jamil) është besim aktiv, shpresëdhënës",
        "Prindërit formojnë trashëgiminë e besimit të fëmijëve të tyre",
        "Kurrë mos e humbni shpresën nga mëshira e Allahut",
      ],
      facts: ["Quhet edhe Izraeli", "Babai i Jusufit dhe fiseve Beni Isra'il"],
    },
    quran: [
      {
        excerpt:
          "Ai tha: Përkundrazi, shpirtrat tuaj ju kanë joshur për diçka. Kështu që durimi është më i përshtatshmi. Ndoshta Allahu do t'i bashkojë të gjithë tek unë.",
      },
      {
        excerpt:
          "Ata thanë: Ne do të adhurojmë Zotin tuaj dhe Zotin e baballarëve tuaj, Ibrahimit, Ismailit dhe Is'hakut, një Zot dhe Atij i nënshtrohemi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Jusufi (AS)",
    summary:
      "Një profet udhëtimi i të cilit nga një pus në fronin e Egjiptit mëson pastërtinë, durimin dhe faljen.",
    body: [
      "Jusuf (paqja qoftë mbi të) është subjekt i tregimit më të plotë të Kur'anit - sures Jusuf, të cilën Allahu e quan 'rrëfimet më të mira' (Kur'an 12:3). Si djalë ai pa një ëndërr të vërtetë me njëmbëdhjetë yje, diell dhe hënë që i përuleshin atij. Vëllezërit e tij ziliqarë e hodhën në një pus dhe e shitën si skllav në Egjipt, ku u ble në shtëpinë e një zyrtari të fuqishëm. Përmes çdo ndryshimi, Jusufi ruante besimin dhe integritetin e tij.",
      'Pastërtia e tij u sprovua kur gruaja e zotit të tij u përpoq ta joshte. Ai refuzoi, duke thënë: "Kërkoj strehim tek Allahu" dhe preferoi burgun sesa mëkatin: "Burgu është më i dashur për mua se ai në të cilin më ftojnë" (Kur\'an 12:33). Ndonëse i pafajshëm, ai u burgos për vite me rradhë – madje edhe atje ai i thirri shokët e tij të burgosur në teuhid dhe u interpretoi ëndrrat e tyre. Kur ëndrra e mbretit për shtatë vjet zi buke e hutoi oborrin, dhurata e interpretimit të dhënë nga Zoti e çoi Jusufin para mbretit, i cili e vendosi në krye të thesareve të Egjiptit. Ai e menaxhoi kombin përmes urisë me mençuri dhe drejtësi.',
      "Kulmi i historisë nuk është fuqia, por falja. Kur vëllezërit e tij, të shtyrë nga uria, qëndruan para tij duke mos e njohur, Jusufi u shfaq dhe tha: \"Nuk do të keni asnjë faj sot. Allahu do t'ju falë dhe Ai është më i mëshirshmi i mëshiruesve' (Kur'an 12:92). Ai e vlerësoi Allahun për çdo të mirë, duke thënë se Zoti i tij ishte treguar i mirë kur e nxori nga burgu dhe bashkoi familjen. Jusufi mëson se dëlirësia dhe takvaja e mbrojnë besimtarin, se plani i Allahut në heshtje mbizotëron çdo komplot njerëzor dhe se falja - jo hakmarrja - është shenja e fisnikut.",
    ],
    profile: {
      nation: "Familja e Beni Isra'ilit në Egjipt",
      location: "Kanaani dhe Egjipti",
      era: "Para Musait",
      mission: "Mbroni teuhidin, pastërtinë dhe drejtësinë duke i shërbyer shoqërisë.",
      challenges: [
        "Tradhti nga vëllezërit e tij",
        "Tundim dhe shpifje e rreme",
        "Burgim i gjatë pavarësisht pafajësisë",
      ],
      miracles: ["Dhurata e dhënë nga Zoti i interpretimit të vërtetë të ëndrrave"],
      majorEvents: [
        "Pusi dhe ndarja nga i ati",
        "Vitet e burgimit",
        "Ngritja e autoritetit në Egjipt dhe ribashkimi me familjen e tij",
      ],
      lessons: [
        "Dlirësia dhe integriteti e mbrojnë besimin",
        "Falja shëron familjet",
        "Plani i Allahut tejkalon çdo komplot njerëzor",
      ],
      facts: ["E gjithë sureja Jusuf, e quajtur historia më e mirë, përqendrohet në jetën e tij"],
    },
    quran: [
      {
        excerpt:
          "Ai tha: Nuk do të keni asnjë faj sot. Allahu ju faltë; dhe Ai është më i mëshirshmi i mëshiruesve.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Fisniku, i biri i fisnikut, i biri i fisnikut, i biri i fisnikut: Jusufi, i biri i Jakubit, i biri i Is'hakut, i biri i Ibrahimit.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shuajbi (AS)",
    summary:
      "Një profet që e lidhi besimin me ndershmërinë në tregti dhe e paralajmëroi Medjenin kundër mashtrimit dhe padrejtësisë.",
    body: [
      "Shuajbi (paqja qoftë mbi të) u dërgua te banorët e Medjenit, një bashkësi tregtare që e kishte prishur ekonominë e saj përmes mashtrimit: dhënies së masës dhe peshës së shkurtër, mashtrimit të njerëzve nga pasuria e tyre dhe përhapjes së padrejtësisë në tokë. Mesazhi i tij bashkoi dy gjysmat e besimit që njerëzit shpesh përpiqen t'i ndajnë - adhurimin dhe etikën: 'O populli im, adhuroni Allahun; ju nuk keni zot tjetër përveç Tij. Dhe jepni masën dhe peshën e plotë në drejtësi dhe mos i privoni njerëzit nga e drejta e tyre” (Kur'an 11:84-85).",
      "Njerëzit e tij rezistuan, duke pyetur në mënyrë sarkastike nëse lutjet e tij kërkonin që ata të braktisnin zakonet mashtruese të baballarëve të tyre dhe të bënin si të donin me pasurinë e tyre (Kur'an 11:87). Ata e tallën, e kërcënuan atë dhe besimtarët me dëbim, madje edhe i bllokuan rrugët. Shuajbi vazhdoi me dhembshuri dhe përkujtime të qarta, duke këmbëngulur se ai kërkoi vetëm reforma për aq sa kishte mundësi, dhe se suksesi i tij ishte vetëm nga Allahu: \"Dhe suksesi im nuk është veçse nëpërmjet Allahut. Tek Ai jam mbështetur dhe tek Ai kthehem' (Kur'an 11:88). Ai mbahet mend për elokuencën e tij në thirrjen e popullit të tij.",
      "Kur ata këmbëngulën në refuzimin, erdhi dënimi dhe i kapi keqbërësit, ndërsa Allahu e shpëtoi Shuajbin dhe besimtarët (Kur'an 7:91-93). Biografia e tij jep një mësim që shpesh neglizhohet: ndershmëria ekonomike nuk është e ndarë nga feja - ajo është pjesë e saj. Mashtrimi në treg, shfrytëzimi i të pambrojturve dhe manipulimi i masave janë çështje besimi dhe një shoqëri që legalizon padrejtësinë fton gjykimin e Allahut.",
    ],
    profile: {
      nation: "Banorët e Medjenit",
      location: "Rajoni tregtar veriperëndimor Arabo / Levantine",
      era: "Pas brezave të Ibrahimit",
      mission: "Thirrje për teuhid dhe për ndershmëri dhe drejtësi në tregti.",
      challenges: ["Korrupsioni i rrënjosur në treg", "Tallje nga elita", "Kërcënimet për dëbim"],
      majorEvents: [
        "Thirrje për masë të plotë dhe sjellje të drejtë",
        "Kundërshtimi dhe kërcënimet publike",
        "Ndëshkimi i refuzuesve këmbëngulës",
      ],
      lessons: [
        "Besimi kërkon ndershmëri në biznes",
        "Padrejtësia publike fton gjykimin hyjnor",
        "Profetët trajtojnë etikën sociale dhe ekonomike, jo vetëm ritualin",
      ],
      facts: ["I njohur për theksimin vetëm të peshave dhe masave"],
    },
    quran: [
      {
        excerpt:
          "O populli im, adhuroni Allahun; ju nuk keni zot tjetër përveç Tij. Jepni masën dhe peshën e plotë dhe mos i privoni njerëzit nga e drejta e tyre dhe mos bëni prishje në tokë.",
      },
      {
        excerpt:
          "Dhe suksesi im nuk është veçse nëpërmjet Allahut. Tek Ai jam mbështetur dhe tek Ai kthehem.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ejubi (AS)",
    summary:
      "Modeli i durimit i Kuranit: i palëkundur në përkushtim gjatë sëmundjeve dhe humbjeve të zgjatura.",
    body: [
      "Ejubi (paqja qoftë mbi të) - Jobi - është simboli i qëndrueshëm i sabrit në Kur'an. Ai ishte një profet i bekuar me shëndet, pasuri dhe familje, dhe më pas u sprovua duke i humbur ato dhe nga një sëmundje e gjatë dhe e dhimbshme. Gjatë gjithë kësaj, ai kurrë nuk u hidhërua dhe nuk e akuzoi Zotin e tij për padrejtësi; ai u mbajt fort pas mirënjohjes dhe përkujtimit. Kur'ani e lavdëron atë me fjalë që kapin të gjithë historinë e tij: \"Vërtet, Ne e gjetëm atë të durueshëm, një rob të shkëlqyer. Vërtet, ai ishte nga ata që i ktheheshin vazhdimisht Allahut' (Kur'an 38:44).",
      "Kur më në fund vështirësia u bë dërrmuese, vini re sjelljet (adab) të përsosura të duasë së tij. Ai nuk kërkoi apo u ankua kundër vendimit të Allahut; ai thjesht dhe me përulësi e paraqiti gjendjen e tij para Zotit të tij: \"Vërtet, fatkeqësia më ka prekur dhe Ti je më i mëshirshmi i mëshiruesve\" (Kur'an 21:83). Ai pohoi mëshirën e Allahut pikërisht në momentin e pyetjes. Allahu iu përgjigj duke i thënë: 'Godit tokën me këmbën tënde; kjo është një banjë e ftohtë dhe një pije, dhe Ai e largoi pikëllimin dhe e rivendosi familjen e tij dhe më shumë, si mëshirë prej Tij dhe përkujtues për adhuruesit (Kur'an 21:84; 38:41–43).",
      "Ejubi mëson se durimi nuk është një durim pasiv, por një formë aktive adhurimi - një kthim i vazhdueshëm te Allahu gjatë sprovës. Shembulli i tij gjithashtu e përsosi mënyrën se si ne bëjmë dua: me përulësi, pa ankesa ndaj vendimit dhe me siguri në mëshirën e Allahut. Dhe përfundimi i tij siguron çdo besimtar të sprovuar se sprovat, të përballuara me besim, mund të ngrenë gradën e një robi dhe gjithmonë pasohen nga lehtësim në kohën e Allahut.",
    ],
    profile: {
      era: "Epoka profetike pas Ibrahimit (kontekst i gjerë)",
      mission: "Udhëzoje popullin e tij duke mishëruar durimin dhe adhurimin në vështirësi.",
      challenges: [
        "Një sëmundje e gjatë dhe e dhimbshme",
        "Humbja e pasurisë dhe familjes",
        "Qëndrueshmëria nën një provë të zgjatur",
      ],
      miracles: [
        "Shërim dhe lehtësim me urdhër të Allahut",
        "Rivendosja e familjes dhe bekimi pas sprovës",
      ],
      majorEvents: ["Lutja e tij e përulur në vështirësi", "Lehtësim hyjnor, shërim dhe restaurim"],
      lessons: [
        "Durimi është një formë aktive e adhurimit",
        "Duaja është më e bukura kur është e përulur dhe pa ankesa",
        "Sprovat e bëra me besim mund të ngrenë gradën e dikujt",
      ],
      facts: ["Cituar në të gjithë traditën islame si model i sabrit"],
    },
    quran: [
      {
        excerpt:
          "E Ejubi, kur thirri Zotin e tij: Vërtet, më ka prekur fatkeqësia dhe Ti je më i mëshirshmi i mëshiruesve.",
      },
      {
        excerpt:
          "Vërtet, Ne e gjetëm atë të durueshëm, një rob të shkëlqyer. Vërtet, ai ishte nga ata që i ktheheshin vazhdimisht Allahut.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dhul-Kifli (AS)",
    summary:
      "Një profet i drejtë numërohet në mesin e pacientëve, i nderuar edhe pse historia e tij është e shkurtër.",
    body: [
      "Dhul-Kifli (paqja qoftë mbi të) përmendet dy herë në Kuran, të dyja herë në shoqërinë e profetëve të nderuar. Allahu e rendit atë me Ismailin dhe Idrisin - të gjithë ishin prej durimtarëve. Dhe Ne i futëm ata në mëshirën Tonë; me të vërtetë, ata ishin nga të drejtët' (Kur'an 21:85–86) - dhe përsëri e përmend atë në mesin e të shkëlqyerve krahas Ismailit dhe Al-Jasës (Kur'an 38:48). Çdo përmendje është lavdërim, edhe pse nuk jepet një tregim i detajuar.",
      "Për shkak se Kurani dhe Suneti autentik nuk e zgjerojnë jetën e tij, studiuesit klasikë ndryshojnë edhe për detajet themelore – disa e konsideruan nëse ai ishte një profet apo një njeri i drejtë, megjithëse ai llogaritet ndër profetët në listat kryesore të muslimanëve. Një besimtar i kujdesshëm i reziston mbushjes së heshtjes me përralla të pavërtetuara dhe i përmbahet asaj që pohon Allahu: ai ishte i durueshëm dhe i drejtë, dhe kjo është mjaft nder.",
      "Përfshirja e tij sjell një mësim të qetë: jo çdo rob i dashur për Allahun lë pas një histori të famshme. Shërbimi i qëndrueshëm dhe besnik – lloji që nuk është regjistruar kurrë nga historia, por është plotësisht i njohur për Allahun – është pikërisht ai lloj që fiton mëshirën e Tij. Qëndrueshmëria e fshehur nuk është më e vogël; është thelbi i një jete të drejtë.",
    ],
    profile: {
      era: "Periudhat e mëvonshme profetike para Isait (të vendosura gjerësisht)",
      mission: "Thirr popullin e tij në bindje dhe drejtësi.",
      lessons: [
        "Durimi është thelbi i karakterit profetik",
        "Detajet e kufizuara ende mbartin udhëzime të forta",
        "Shërbimi besnik dhe i padukshëm është i dashur për Allahun",
      ],
      facts: [
        "I quajtur me Ismail dhe Idris në mesin e pacientit",
        "I numëruar ndër profetët në listat kryesore të muslimanëve",
      ],
    },
    quran: [
      {
        excerpt:
          "Dhe Ismaili, Idrisi dhe Dhul-Kifli, të gjithë ishin prej durimtarëve. Dhe Ne i futëm ata në mëshirën Tonë; me të vërtetë, ata ishin nga të drejtët.",
      },
      {
        excerpt:
          "Dhe kujtoni Ismailin, El-Jasain dhe Dhul-Kiflin, dhe të gjithë janë ndër të shquarit.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Musa (as)",
    summary:
      "I dërguari i madh për Beni Isra'ilin, i cili u përball me tiraninë e Faraonit dhe mori Tevratin.",
    body: [
      "Musai (paqja qoftë mbi të) është profeti më i përmendur në Kur'an dhe historia e tij tregohet në detaje të pasura. I lindur sipas dekretit të Faraonit për të vrarë djemtë e Beni Isra'ilit, ai u vendos si foshnjë në një shportë në Nil nga nëna e tij - me frymëzim të Allahut - dhe, me planin e Allahut, u rrit në pallatin e vetë Faraonit (Kur'an 28:7-13). Vite më vonë, pasi u largua nga Egjipti dhe u martua në Medjen, ai u thirr nga Allahu në luginën e shenjtë të Tuvas, ku Allahu i foli drejtpërdrejt, i tregoi shenjën e shkopit dhe dorës dhe e dërgoi me vëllain e tij Harunin te tirani Faraon (Kur'an 20:9–36).",
      "Misioni i tij ishte të jepte dy gjëra: thirrjen për të adhuruar vetëm Allahun dhe kërkesën për të liruar fëmijët e shtypur të Izraelit. Faraoni, i cili pretendonte se ishte një zot, e takoi atë me sfidë dhe madje pas një sërë shenjash të qarta - shkopi që u bë gjarpër dhe gëlltiti marifetet e magjistarëve dhe plagët - ai refuzoi të nënshtrohej. Kur Musai e nxori Beni Isra'ilin jashtë, Faraoni i ndoqi ata deri në det. Atje Allahu urdhëroi: 'Goditni detin me shkopin tuaj' dhe ai u nda, kështu që besimtarët kaluan në tokë të thatë ndërsa Faraoni dhe ushtria e tij u mbytën (Kur'an 26:63-66).",
      "Por çlirimi ishte vetëm fillimi. Musai më pas kaloi sprovën më të vështirë dhe më të gjatë për të udhëhequr një popull të vështirë dhe shpesh mosmirënjohës: ai mori Torën në mal, vetëm për t'u kthyer dhe i gjeti ata duke adhuruar një viç të artë; ai u përball me ankesat e tyre, kërkesat e tyre dhe mosbindjen e tyre me udhëheqje të durueshme dhe të vendosur. Jeta e Musait bashkon dy tema të mëdha - guximin për të qëndruar kundër padrejtësisë dhe tiranisë dhe qëndrueshmërinë e nevojshme për t'i udhëhequr njerëzit drejt bindjes pasi të jenë të lirë. Si njëri prej ulul-azmëve, ai është model edhe i reformatorit edhe i bariut të një bashkësie.",
    ],
    profile: {
      nation: "Beni Isra'il (me thirrje drejtuar popullit të Faraonit)",
      location: "Egjipti dhe Sinai",
      era: "Para Davudit dhe Sulejmanit",
      mission: "Thirrni në teuhid, përballuni me shtypjen e Faraonit dhe dorëzoni Tevratin.",
      challenges: [
        "Përballja me Faraonin, i cili pretendonte hyjninë",
        "Drejtimi i një populli rezistent dhe mosmirënjohës",
        "Udhëheqja e qëndrueshme nën presion të vazhdueshëm",
      ],
      miracles: [
        "Stafi që u kthye në gjarpër",
        "Ndarja e detit me urdhrin e Allahut",
        "Shenjat e shumta të treguara para Faraonit",
      ],
      majorEvents: [
        "Allahu duke i folur atij në luginën e shenjtë",
        "Përballja me Faraonin dhe magjistarët",
        "Eksodi dhe shpallja e Tevratit",
      ],
      lessons: [
        "Qëndroni me guxim kundër tiranisë",
        "Udhëheqja mbi njerëzit kërkon durim të madh",
        "Liria duhet të bashkohet me bindjen ndaj Allahut",
      ],
      facts: [
        "Njëri nga pesë të dërguarit e vendosmërisë (ulul-azm)",
        "I quajtur Kalimullah - ai të cilit Allahu i foli drejtpërdrejt",
      ],
    },
    quran: [
      {
        excerpt:
          "Dhe unë të kam zgjedhur ty, prandaj dëgjo atë që të shpallet. Vërtet, unë jam Allahu. Nuk ka zot tjetër përveç Meje, andaj më adhuroni Mua dhe falni namazin për të më kujtuar Mua.",
      },
      {
        excerpt:
          'Dhe Ne e frymëzuam nënën e Musait: "Të jepni gji, por kur të keni frikë për të, hidheni në lumë dhe mos u frikësoni e as mos u pikëlloni". Vërtet, Ne do ta kthejmë atë tek ju.',
      },
    ],
    hadith: [
      {
        excerpt:
          "Meleku i vdekjes iu dërgua Musait. Kur ai erdhi tek ai, Musai e goditi dhe Allahu ia ktheu syrin dhe i dha një zgjedhje për kohën e vdekjes së tij.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Haruni (AS)",
    summary: "Vëllai elokuent i Musait, i emëruar si profet mbështetës i tij para Faraonit.",
    body: [
      "Haruni (paqja qoftë mbi të) ishte vëllai i madh i Musait dhe një profet më vete. Kur Allahu e dërgoi Musain te Faraoni, Musai kërkoi mbështetje: “Dhe më cakto një ministër nga familja ime – Harunin, vëllain tim. Shtoje forcën time nëpërmjet tij dhe lëre atë të ndajë detyrën time' (Kur'an 20:29–32). Allahu e pranoi kërkesën dhe Kur'ani shënon përgjigjen e Tij: 'Ne do ta forcojmë krahun tënd nëpërmjet vëllait tënd' (Kur'an 28:35). Haruni, i përshkruar si më elokuent në të folur, qëndroi pranë Musait teksa i jepnin mesazhin e Allahut tiranit.",
      "Momenti i tij më sprovues erdhi në mungesë të Musait. Kur Musai shkoi për të marrë Tevratin në mal, Beni Isra'il ra në adhurimin e një viçi të artë. Haruni u përpoq t'i frenonte ata, duke paralajmëruar: \"O populli im, ju vetëm po sprovoheni me të, dhe me të vërtetë Zoti juaj është Mëshiruesi, prandaj më ndiqni mua dhe zbatoni urdhrin tim\" - por ata e mposhtën autoritetin e tij dhe për pak e dëmtuan atë (Kur'an 20:90-94). Kur Musai u kthye i zemëruar, Haruni shpjegoi se kishte frikë se një veprim më i fuqishëm do ta ndante komunitetin në fraksione ndërluftuese përpara se Musa të kthehej (Kur'an 7:150).",
      "Biografia e Harunit nxjerr në pah vlerën e punës në grup në shërbim të Allahut – një mision i kryer nga dy është më i fortë se një – dhe mençurinë delikate të ruajtjes së unitetit pa kompromentuar kurrë të vërtetën. Ndonjëherë udhëheqja besnike do të thotë të mbash së bashku një komunitet të përçarë dhe të frenosh dëmin derisa gjërat të rregullohen. Haruni nderohet në Kur'an në mesin e të udhëzuarve dhe Allahu la atij dhe Musait lavdërim të përjetshëm në brezat e mëvonshëm (Kur'an 37:119–122).",
    ],
    profile: {
      nation: "Beni Isra'il",
      location: "Egjipti dhe Sinai",
      era: "Epoka e Musait",
      mission: "Përkrah Musain në thirrjen për teuhid dhe në udhëzimin e Beni Israilit.",
      challenges: [
        "Përballja me regjimin e faraonit",
        "Menaxhimi i komunitetit gjatë mungesës së Musait",
        "Parandalimi i një përçarjeje më të madhe mes njerëzve",
      ],
      majorEvents: [
        "Emërimi ministër dhe përkrahja e Musait",
        "Misioni para Faraonit",
        "Gjyqi i viçit të artë",
      ],
      lessons: [
        "Puna ekipore forcon thirrjen drejt Allahut",
        "Udhëheqja ndonjëherë do të thotë të mbash njerëzit së bashku në një krizë",
        "Ruaje unitetin pa kompromentuar kurrë të vërtetën",
      ],
      facts: ["Vëllai i madh i Musait", "I lavdëruar në Kuran për elokuencën e tij"],
    },
    quran: [
      {
        excerpt:
          "Dhe më cakto një ministër nga familja ime - Harunin, vëllain tim. Rriteni forcën time nëpërmjet tij dhe lëreni të ndajë detyrën time.",
      },
      {
        excerpt:
          "Ai tha: “Biri i nënës sime, me të vërtetë njerëzit më mundën dhe do të më vrisnin, e të mos gëzohen për mua armiqtë.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Davudi (as)",
    summary:
      "Një profet-mbret i dhënë urtësi, drejtësi dhe Zabur, dhe një model i udhëheqjes me në qendër adhurimin.",
    body: [
      "Davudi (paqja qoftë mbi të) - Davidi - filloi si i ri në ushtrinë e Talutit (Saulit) kundër tiranit Jalut (Goliath). Ishte Daudi ai që e goditi Xhalutin dhe 'Allahu i dha atij sovranitet dhe urtësi dhe e mësoi atë nga ajo që donte' (Kur'an 2:251). Pastaj Allahu i dha atij mbretërimin, profetësinë dhe një shkrim të shpallur, Zabur (Psalmet), duke e bërë atë një shembull të rrallë të një sundimtari që ishte gjithashtu një adhurues i devotshëm.",
      "Allahu i dha atij dhurata të jashtëzakonshme: malet dhe zogjtë do t'i bashkoheshin atij për të madhëruar Allahun dhe hekuri u bë i butë në duart e tij, në mënyrë që ai të mund të formonte armaturën (Kur'an 21:79; 34:10-11). Megjithatë, me gjithë këtë fuqi, Daudi mbeti thellësisht i përulur dhe i përkushtuar. Adhurimi i tij ishte aq i fortë sa Profeti (a.s.) e përshkroi agjërimin e Davudit – agjërimin çdo ditë tjetër – si agjërimin më të dashur tek Allahu dhe namazin e natës si namazin më të dashur. Kur'ani gjithashtu paraqet një episod gjykimi në të cilin Daudi, i korrigjuar butësisht, ra menjëherë në sexhde, kërkoi falje dhe u kthye te Zoti i tij (Kur'an 38:24) - forca e tij nuk e vendosi kurrë atë mbi përgjegjësinë.",
      "Jeta e Daudit mëson se autoriteti është një amanet, jo një privilegj. Allahu i drejtohet drejtpërdrejt: “O Davud, Ne të kemi bërë pasardhës në tokë, prandaj gjyko mes njerëzve me të vërtetën dhe mos ndiq dëshirën” (Kur'an 38:26). Drejtësia, përmendja e vazhdueshme e Allahut, pendimi i shpejtë dhe jeta e disiplinuar e adhurimit janë ato që mbështesin udhëheqjen e drejtë. Fuqia është më e sigurt në duart e atij që përkulet më shumë.",
    ],
    profile: {
      nation: "Beni Isra'il",
      location: "rajoni i Jeruzalemit",
      era: "Para sundimit të Sulejmanit",
      mission: "Udhëhiq me drejtësi, gjyko me të vërtetën dhe thirri popullin e tij tek Allahu.",
      challenges: [
        "Pesha e përgjegjësisë gjyqësore",
        "Balancimi i fuqisë me përulësinë",
        "Përgjegjësia publike në udhëheqje",
      ],
      miracles: [
        "Malet dhe zogjtë duke e madhëruar Allahun me të",
        "Hekuri u bë i butë në duart e tij me lejen e Allahut",
      ],
      majorEvents: [
        "Humbja e Xhalutit në rininë e tij",
        "Mbretërimi, profetësia dhe shpallja e Zaburit",
        "Trashëgimia i kaloi djalit të tij Sulejmanit",
      ],
      lessons: [
        "Drejtësia është thelbësore për sundimin e drejtë",
        "Pendohuni shpejt pas çdo gabimi",
        "Një jetë e disiplinuar e adhurimit forcon udhëheqjen",
      ],
      facts: ["Marrësi i Zaburit (Psalmeve)", "Mundi Xhalut (Goliath) si i ri"],
    },
    quran: [
      {
        excerpt:
          "O Davud, vërtet Ne të kemi bërë pasardhës në tokë, prandaj gjyko mes njerëzve me të vërtetën dhe mos ndiq dëshirën, sepse ajo do të të largojë nga rruga e Allahut.",
      },
      {
        excerpt:
          "Dhe Ne i nënshtruam malet për t'u lavdëruar me Davudin, dhe zogjtë gjithashtu... Dhe i mësuam atij modelimin e parzmoreve për t'ju mbrojtur nga armiku juaj.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Namazi më i dashur tek Allahu është namazi i Davudit, kurse agjërimi më i dashur tek Allahu është agjërimi i Davudit: ai një ditë agjëronte dhe ditën tjetër e prishte agjërimin.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sulejmani (AS)",
    summary:
      "Një mbret profet që i është dhënë autoritet i pakrahasueshëm, por i bazuar në mirënjohje dhe urtësi.",
    body: [
      "Sulejmani (paqja qoftë mbi të) - Sulejmani - trashëgoi mbretërinë dhe profetësinë nga babai i tij Daudi, dhe Kur'ani e lavdëron atë si \"një rob të shkëlqyer, me të vërtetë ai që i kthehet përsëri Allahut\" (Kur'an 38:30). Ai u lut për një mbretëri të ndryshme nga ajo që do të pasonte, dhe Allahu i dha atij një mjet të jashtëzakonshëm: komandë mbi erën, e cila shkonte me urdhër të tij; shërbimi i xhinëve që ndërtuan dhe i pëllumbuan me lejen e Allahut; dhe të kuptuarit e të folurit të zogjve dhe krijesave të tjera (Kur'an 21:81–82; 34:12–13; 27:16).",
      "Dy skena kapin karakterin e tij. Kur një milingonë e paralajmëroi koloninë e saj që të mbulohej që ushtria e Sulejmanit t'i shtypte pa e ditur, Sulejmani buzëqeshi dhe falënderoi Allahun për favorin e të kuptuarit, duke u lutur që të bëhej mirënjohës dhe i drejtë (Kur'an 27:18–19) - fuqia e bëri atë më të përulur, jo më pak. Dhe kur dëgjoi për Mbretëreshën e Shebës (Saba') dhe popullin e saj që adhuronin diellin, ai nuk i pushtoi me forcë, por i ftoi që t'i nënshtroheshin Allahut, duke e fituar atë në besim përmes urtësisë dhe shfaqjes së asaj që Allahu i kishte dhënë atij (Kur'an 27:22-44). Madje edhe bekimet e tij të mëdha ai i përcaktoi si sprovë: \"Kjo është nga dhuntia e Zotit tim për të më provuar mua nëse do të jem mirënjohës apo mosmirënjohës\" (Kur'an 27:40).",
      "Sulejmani mëson se fuqia është një nga sprovat më të vështira dhe se falënderimi (shukri) është shërimi i saj. Një besimtari që i jepet pasuria, aftësia ose autoriteti ka për qëllim ta përdorë atë për drejtësi dhe t'i thërrasë të tjerët tek Allahu, asnjëherë për krenari. E gjithë mbretëria e tij, me të gjitha mrekullitë e saj, tregon prapa tek Ai që e dha atë - dhe ky është ndryshimi midis një bekimi që lartëson dhe atij që prish.",
    ],
    profile: {
      nation: "Beni Isra'il dhe mbretëritë përreth",
      location: "Jeruzalemi dhe rajoni më i gjerë",
      era: "Pas Davudit",
      mission: "Sundoni me drejtësi dhe thirrni popujt në adhurimin e Allahut.",
      challenges: [
        "Menaxhimi i një mbretërie të gjerë",
        "Ruajtja e mirënjohjes mes fuqisë së pamasë",
        "Drejtimi i forcave të ndryshme me përgjegjësi",
      ],
      miracles: [
        "Urdhëroni mbi erën me lejen e Allahut",
        "Shërbimi i xhinëve në ndërtim dhe zhytje",
        "Kuptimi i të folurit të zogjve dhe milingonave",
      ],
      majorEvents: [
        "Trashëgimi i mbretërimit dhe profetësisë së Davudit",
        "Episodi i milingonës dhe mirënjohja e tij",
        "Letërkëmbimi me Mbretëreshën e Shebës dhe besimi i saj",
      ],
      lessons: [
        "Fuqia është një provë e thellë",
        "Mirënjohja mbron nga arroganca",
        "Mençuria dhe ftesa mund t'i kthejnë zemrat më mirë se forca",
      ],
      facts: ["Ndër mbretërit-profetë më të përshkruar në Kur'an"],
    },
    quran: [
      {
        excerpt:
          "Ai buzëqeshi, u argëtua me fjalën e saj dhe tha: Zoti im, më mundëso të jem mirënjohës për dhuntinë Tënde që më ke dhënë ndaj meje dhe ndaj prindërve të mi, dhe të bëj atë që Ti e miraton.",
      },
      {
        excerpt:
          "Dhe Sulejmanit (Ia nënshtruam) erën - era e saj në mëngjes një muaj udhëtim dhe ecja e pasdites një muaj udhëtim.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ilyas (AS)",
    summary:
      "Një profet që u përball me adhurimin e idhullit Ba'l dhe e thirri popullin e tij tek Allahu.",
    body: [
      "Iljasi (paqja qoftë mbi të) - Elia - u dërgua në një bashkësi të Beni Israilit që kishte rënë në idhujtari, ku idhujt kryesorë të tyre ishte Ba'li. Kurani shënon sfidën e tij të drejtpërdrejtë: 'A nuk do t'i frikësoheni Allahut? A e thërrisni Ba'l-in dhe i lini krijuesit më të mirë - Allahun, Zotin tuaj dhe Zotin e të parëve tuaj të parë?' (Kur'an 37:124–126). Thirrja e tij ishte thirrja e përjetshme profetike: zhveshni perënditë e rreme dhe kthejeni adhurimin vetëm te Krijuesi.",
      "Kurani e përmbledh misionin e tij me modelin e njohur profetik – një ftesë e qartë, refuzim nga shumica dhe nder i ruajtur për të sinqertët. “Ata e përgënjeshtruan atë, kështu që me të vërtetë do të sillen [për dënim], përveç robërve të zgjedhur të Allahut” (Kur'an 37:127-128). Allahu e emëron atë në mesin e të drejtëve dhe lë paqen dhe lavdërimin e përhershëm mbi të: 'Paqja qoftë mbi Ilyas' (Kur'an 37:129–130), dhe e rendit atë përkrah Zakariyya-s, Jahja-s dhe Isait ndër të udhëzuarit (Kur'an 6:85).",
      "Mësimi i Ilyas është se reforma e vërtetë fillon me korrigjimin e adhurimit. Një shoqëri nuk mund të rregullohet ndërsa drejton përkushtimin ndaj objekteve të rreme – qofshin idhuj të mirëfilltë apo idhuj modernë të dëshirës, ​​pasurisë dhe statusit. Teuhidi është themeli mbi të cilin ndërtohet i gjithë ripërtëritja e qëndrueshme morale, madje edhe kur një grup besimtar është i vogël dhe më i madh në numër, Allahu i nderon ata që i përmbahen të vërtetës.",
    ],
    profile: {
      nation: "Një bashkësi mes Beni Izraelit",
      location: "Rajoni i Levantit",
      era: "Periudhat e mëvonshme profetike izraelite",
      mission: "Thirr popullin e tij nga adhurimi i Ba'lit në teuhid.",
      challenges: ["Adhurimi i idhujve i rrënjosur thellë", "Rezistenca nga lidershipi"],
      majorEvents: [
        "Thirrja publike kundër adhurimit të Ba'l",
        "Refuzimi nga shumica dhe ruajtja e besimtarëve",
      ],
      lessons: [
        "Teuhidi është themeli i të gjitha reformave",
        "Një grup i vogël besimtarësh ende ka rëndësi për Allahun",
        "Profetët flasin kundër gabimit popullor, jo me të",
      ],
      facts: ["I emëruar ndër të drejtët", "U përball me adhurimin e idhullit Ba'l"],
    },
    quran: [
      {
        excerpt:
          "Kur i tha popullit të vet: A nuk e keni frikë Allahun? A e thërrisni Ba'l-in dhe i lini krijuesit më të mirë?",
      },
      {
        excerpt: "Dhe Zekerija, Jahja, Isai dhe Iljasi - dhe të gjithë ishin nga të devotshmit.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "El-Jasa' (AS)",
    summary: "Një profet i drejtë i linjës izraelite, i përmendur në Kur'an ndër më të shquarit.",
    body: [
      "El-Jasa' (paqja qoftë mbi të) - Eliseu - përmendet në mesin e profetëve në dy vende në Kur'an, dhe në të dyja ai është i lavdëruar. Ai shfaqet në mesin e të udhëzuarve së bashku me Ismailin, Junusin dhe Lutin, të cilët Allahu i 'preferoi mbi botët' (Kur'an 6:86–87), dhe përsëri në mesin e të shquarve përkrah Ismailit dhe Dhul-Kiflit (Kur'an 38:48). Teksti e ngre gradën e tij në vend që të tregojë një tregim të detajuar.",
      "Për shkak se shpallja është qëllimisht e shkurtër për të, muslimanët pohojnë saktësisht atë që është e sigurt - se ai ishte një profet i vërtetë që mbështeti thirrjen për të adhuruar Allahun vetëm në mesin e popullit të tij - dhe shmangi bashkëngjitjen e tregimeve që nuk kanë mbështetje të shëndoshë. Ky kufizim është në vetvete pjesë e besimit të shëndoshë: ne e nderojmë një profet duke i qëndruar të vërtetës rreth tij, jo duke shpikur histori rreth tij.",
      "Përmendja e tij është një kujtesë se Allahu dërgoi shumë të dërguar dhe se vlera e një profeti nuk matet me atë se sa është ruajtur historia e tij, por me besnikërinë e tij ndaj misionit. Siç thotë Kur'ani diku tjetër, kishte të dërguar \"tregimet e të cilëve Ne të kemi treguar ty dhe të dërguar historitë e të cilëve nuk i kemi treguar\" (Kur'an 40:78) - dhe besimi në të gjithë ata, të njohur dhe të panjohur, është pjesë e besimit të një muslimani.",
    ],
    profile: {
      nation: "Beni Isra'il",
      location: "Rajoni i Levantit",
      era: "Periudhat e mëvonshme profetike izraelite",
      mission: "Vazhdoni thirrjen për teuhid në mesin e popullit të tij.",
      lessons: [
        "Nderoni të gjithë profetët në mënyrë të barabartë në besim",
        "Një përmendje e shkurtër kuranore ende përcjell udhëzim të vërtetë",
        "Vazhdimësia e drejtë ruan bashkësitë e besimit",
      ],
      facts: ["I emërtuar drejtpërdrejt në Kur'an ndër të shquarit dhe të zgjedhurit"],
    },
    quran: [
      {
        excerpt:
          "Dhe Ismaili, El-Jasa', Junusi dhe Luti - dhe gjithçka që Ne i preferuam mbi botët.",
      },
      {
        excerpt:
          "Dhe kujtoni Ismailin, El-Jasain dhe Dhul-Kiflin, dhe të gjithë janë ndër të shquarit.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Junus (AS)",
    summary:
      "Profeti i balenës, pendimi i të cilit në errësirë ​​u bë një mësim i përjetshëm për shpresën.",
    body: [
      "Junusi (paqja qoftë mbi të) - Jonahu - u dërgua te njerëzit e Ninives, por kur ata me këmbëngulje e refuzuan thirrjen e tij, ai i la ata me zemërim para se Allahu t'i jepte leje për t'u larguar. Kur'ani përshkruan atë që pasoi: \"Dhe [përmend] njeriun e peshkut, kur ai u largua i zemëruar dhe mendoi se Ne nuk do t'i caktojmë atij [asnjë vështirësi]\" (Kur'an 21:87). Duke hipur në një anije, ai u hodh në det dhe u gëlltit nga një peshk i madh, u zhyt në shtresat e errësirës - errësira e natës, e detit dhe e barkut të peshkut.",
      "Në atë errësirë ​​dërrmuese Junusi thirri me fjalë që u bënë një nga lutjet më të dashura në Islami: 'Nuk ka Zot përveç Teje; lavdia qofte Ty. Vërtet, unë kam qenë prej zullumqarëve” (Kur'an 21:87). Ai nuk u dëshpërua; ai pohoi përsosmërinë e Allahut dhe pranoi fajin e tij. Allahu u përgjigj: “Pra, ne iu përgjigjëm atij dhe e shpëtuam nga fatkeqësia. Dhe kështu Ne i shpëtojmë besimtarët' (Kur'an 21:88). Peshku e hodhi atë në breg dhe Allahu bëri që të rritet një bimë për të strehuar trupin e tij të dobësuar.",
      "Pastaj erdhi fundi i mrekullueshëm: Junusi u kthye te populli i tij, dhe ndryshe nga pothuajse çdo komb tjetër në Kur'an, ata besuan dhe u kursyen - 'kështu që Ne u kënaqëm atyre për një kohë' (Kur'an 37:147–148; 10:98). Historia e tij jep dy mësime të thurura së bashku: mos e humbni shpresën nga mëshira e Allahut, sado e thellë të jetë errësira, sepse pendimi i sinqertë rikthen atë që ka humbur; dhe duaja e Junusit është një mjet shpëtimi për çdo besimtar në ankth. Profeti ﷺ mësoi se asnjë musliman nuk lutet me të, përveç se Allahu i përgjigjet atij.",
    ],
    profile: {
      nation: "Banorët e Ninevisë",
      location: "Rajoni i Mesopotamisë",
      era: "Periudha profetike para Isait",
      mission: "Thirr popullin e tij në teuhid dhe pendim.",
      challenges: [
        "Lloji i refuzimit të vazhdueshëm në davet",
        "Gjyqi personal në errësirën e detit",
        "Kthimi në mision pas korrigjimit",
      ],
      miracles: [
        "Shpëtim nga brenda peshkut",
        "Një bimë strehuese u rrit mbi të",
        "Besimi i gjithë popullit të tij",
      ],
      majorEvents: [
        "Duke lënë popullin e tij dhe gjyqin e detit",
        "Lutja në errësirën e trefishtë",
        "Kthimi dhe besimi i Ninevisë",
      ],
      lessons: [
        "Kurrë mos e humbni shpresën nga mëshira e Allahut",
        "Pendimi i sinqertë rikthen misionin",
        "Duaja në vështirësi është transformuese",
      ],
      facts: ["Në Kuran quhet edhe Dhun-Nun (njeriu i peshkut)."],
    },
    quran: [
      {
        excerpt:
          "Dhe ai thirri brenda errësirave: Nuk ka zot përveç Teje; lavdia qofte Ty. Vërtet, unë kam qenë prej zullumqarëve.",
      },
      {
        excerpt:
          "A nuk ka pasur ndonjë qytet që ka besuar kështu që besimi i tij i ka sjellë dobi përveç popullit të Junusit? Kur ata besuan, Ne ua hoqëm dënimin e poshtërimit.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Lutja e Dhun-Nunit kur e luti Allahun nga brenda barkut të peshkut ishte: La ilahe illa Anta, subhanaka, inni kuntu minaz-zalimin. Asnjë musliman nuk lutet me të për asgjë përveç që Allahu t'i përgjigjet atij.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Zakarija (AS)",
    summary:
      "Një profet i përkushtuar që u lut për një trashëgimtar të drejtë në pleqëri dhe iu përgjigj Jahja.",
    body: [
      "Zakarija (paqja qoftë mbi të) - Zekeria - ishte një profet i devotshëm i Beni Isra'ilit dhe kujdestar i Merjemes. Sa herë që ai hynte mbi të në dhomën e saj të lutjes, ai gjente furnizim me të dhe e pyeste se si ndodhi, dhe ajo përgjigjej: \"Është nga Allahu. Vërtet, Allahu furnizon pa llogari kë të dojë” (Kur'an 3:37). Dëshmimi i furnizimit të Allahut për Merjemen ia ringjalli shpresën se Allahu mund të jepte atë që dukej e pamundur nga ana njerëzore.",
      "Ndonëse ai ishte plakur dhe gruaja e tij shterpe, Zakarija iu drejtua Allahut me një lutje të qetë dhe intime: \"Zoti im, me të vërtetë kockat e mia janë dobësuar dhe koka ime është mbushur me të bardha dhe kurrë nuk kam qenë i pakënaqur në lutjen time ndaj Teje\" (Kur'an 19:4). Ai nuk kërkoi pasuri apo përfitim të kësaj bote, por një trashëgimtar të drejtë, i cili do të kryente misionin profetik dhe do të ruante adhurimin e Allahut. Allahu u përgjigj me një lajm të gëzuar për një djalë, Jahja - një emër, tha Allahu, askush nuk i ishte vënë më parë (Kur'an 19:7). Si shenjë, Zakarija duhej të përmbahej nga të folurit me njerëzit për tri ditë, përveçse me gjeste, duke ia kushtuar gjuhën e tij përkujtimit të Allahut (Kur'an 19:10–11).",
      "Jeta e Zakarijes e mëson besimtarin që të mos ndalojë kurrë së bëri dua, sado e pamundur të duket përgjigja, dhe të kërkojë nga Allahu veçanërisht dhuratën e një familjeje të drejtë dhe vazhdimësinë e besimit. Shqetësimi i tij më i madh nuk ishte ai vetë, por kush do ta mbante të vërtetën pas tij. Historia e tij nderon gjithashtu shërbimin e qetë në vendet e adhurimit si një vepër fisnike dhe të dashur.",
    ],
    profile: {
      nation: "Beni Isra'il",
      location: "rajoni i Jeruzalemit",
      era: "Para Isait",
      mission: "Drejtoje popullin e tij dhe ruaje adhurimin profetik.",
      challenges: [
        "Arritja e pleqërisë pa fëmijë",
        "Shqetësimi për vazhdimësinë e besimit",
        "Ruajtja e adhurimit në një shoqëri të tensionuar",
      ],
      miracles: [
        "Lajmi i gëzuar i Jahjait në pleqëri",
        "Shenja e mbajtjes së fjalimit për tre ditë",
      ],
      majorEvents: [
        "Kujdestaria e Merjemes dhe dëshmimi i furnizimit të saj",
        "Lutja e përzemërt për një trashëgimtar",
        "Duaja e përgjigjur dhe lindja e Jahjasë",
      ],
      lessons: [
        "Asnjëherë mos e humbni shpresën në dua",
        "Kërkoni nga Allahu një familje dhe prejardhje të drejtë",
        "Shërbimi i përkushtuar në adhurim është i nderuar",
      ],
      facts: [
        "Kujdestari i Merjemes",
        "Babai i Jahjas, lindja e të cilit iu përgjigj lutjes së tij",
      ],
    },
    quran: [
      {
        excerpt:
          "Aty, Zekerije iu lut Zotit të tij, duke i thënë: Zoti im, më dhuro nga ana Jote një pasardhës të mirë. Vërtet, Ti je Dëgjuesi i lutjes.",
      },
      {
        excerpt:
          "Tha: “O Zoti im, me të vërtetë më janë dobësuar kockat dhe më është mbushur koka me të bardha, dhe kurrë nuk kam qenë i pakënaqur në lutjen time ndaj Teje, o Zoti im.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Jahja (AS)",
    summary:
      "Një profet i pastër, i urtë i dhënë drejtësi që në rini dhe i nderuar me paqe nga Allahu.",
    body: [
      "Jahja (paqja qoftë mbi të) - Gjoni - ishte përgjigja ndaj lutjes së babait të tij Zakarija, të quajtur nga Allahu para lindjes së tij. Allahu iu drejtua drejtpërdrejt: 'O Jahja, pranoje Shkrimin me vendosmëri.' Dhe Ai 'i dha atij mençuri kur ishte ende fëmijë' (Kur'an 19:12) - një përshkrim i rrallë që shënon pjekurinë e tij të hershme shpirtërore. Që në rini ai ishte i përkushtuar ndaj Allahut me një seriozitet përtej viteve të tij.",
      "Kurani e lavdëron karakterin e tij në një sekuencë të bukur: Allahu i dhuroi atij \"butësi prej Nesh dhe pastërti, dhe ai ishte i vetëdijshëm për Allahun dhe i kujdesshëm ndaj prindërve të tij dhe nuk ishte një tiran, i pabindur\" (Kur'an 19:13-14). Ai ishte i dëlirë dhe i devotshëm, i kujtuar ndër të drejtët. Ai i thirri njerëzit e tij në bindje dhe të vërtetë dhe i parapriu Isait, duke vërtetuar fjalën e Allahut dhe duke përgatitur zemrat për udhëzim (Kur'an 3:39).",
      "Allahu e nderoi Jahja-n me paqe në tre momentet më të cenueshme të çdo jete: 'Paqja qoftë mbi të ditën kur lindi, ditën kur vdes dhe ditën kur ringjallet' (Kur'an 19:15). Biografia e tij është një mesazh për të rinjtë dhe të moshuarit: afrimi me Allahun nuk shtyhet për vitet e mëvonshme. Pastërtia e zemrës, serioziteti në adhurim dhe mirësia ndaj prindërve mund të lulëzojnë te një person që është ende i ri - dhe një jetë e tillë është e dashur për Allahun.",
    ],
    profile: {
      nation: "Beni Isra'il",
      location: "Rajoni i Levantit",
      era: "Bashkëkohor me Zakarijen dhe afër epokës së Isait",
      mission: "Thirrni në drejtësi dhe përgatitini zemrat për udhëheqje.",
      challenges: [
        "Reforma publike në një mjedis të sforcuar moralisht",
        "Mbajtja e pastërtisë dhe parimit",
      ],
      majorEvents: [
        "Lindja e tij si një lutje e pranuar",
        "Duke iu dhënë urtësi në rininë e tij",
        "Njohje për pastërtinë dhe përkushtimin e tij",
      ],
      lessons: [
        "Të rinjtë mund të udhëheqin në drejtësi",
        "Pastërtia e zemrës është forcë e vërtetë",
        "Mirësia ndaj prindërve është pjesë e devotshmërisë",
      ],
      facts: [
        "Emërtuar nga Allahu para lindjes së tij",
        "I nderuar me paqe në lindje, vdekje dhe ringjallje",
      ],
    },
    quran: [
      {
        excerpt:
          "O Jahja, pranoje Shkrimin me vendosmëri. Dhe Ne i dhamë atij urtësi kur ishte fëmijë, butësi prej Nesh dhe pastërti, dhe ai ishte i vetëdijshëm për Allahun.",
      },
      {
        excerpt:
          "Allahu ju përgëzon për Jahja-n, duke vërtetuar fjalën e Allahut - të nderuar, të përmbajtur dhe një profet nga mesi i të drejtëve.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Isa ibn Merjem (AS)",
    summary:
      "Një lajmëtar i fuqishëm, i lindur mrekullisht nga Merjemja, që thërret tek Allahu me shenja të qarta - një shërbëtor, jo hyjnor.",
    body: [
      "Isai (paqja qoftë mbi të) – Isai – Merjemja i lindi pa baba, me urdhër të Allahut, si shenjë e fuqisë së Tij absolute: “Vërtet, shembulli i Isait me Allahun është si ai i Ademit. Ai e krijoi atë nga dheu, pastaj i tha: \"Bëhu dhe ai u bë\" (Kur'an 3:59). Kur Merjemja e solli të porsalindurin te populli i saj, të cilët e akuzuan, foshnja Isa foli nga djepi në mbrojtje të saj: “Vërtet, unë jam rob i Allahut. Ai më ka dhënë Librin dhe më ka bërë profet' (Kur'an 19:30). Kjo deklaratë e parë vendosi tonin e gjithë misionit të tij – se ai ishte shërbëtor i Allahut.",
      "Isai u dërgua te Beni Isra'il për të konfirmuar Tevratin para tij dhe për të sjellë Inxhilin (Ungjilin). Allahu e mbështeti atë me mrekulli të qarta me lejen e Tij: ai shëroi të verbërit dhe lebrozët, u dha jetë të vdekurve dhe formoi një zog nga balta që fluturoi me lejen e Allahut (Kur'an 3:49). Mesazhi i tij i thirri njerëzit që të adhurojnë 'Allahun, Zotin tim dhe Zotin tuaj' (Kur'an 3:51) dhe drejt sinqeritetit dhe drejtësisë. Dishepujt e tij të afërt, Hawarijunët, e besuan dhe e mbështetën atë.",
      "Kur'ani korrigjon dy ekstreme rreth Isait. Kundër atyre që e refuzuan dhe komplotuan për ta vrarë, ai deklaron se ai nuk u vra dhe as nuk u kryqëzua; përkundrazi vetëm u duk kështu, dhe Allahu e ngriti atë pranë Vetes (Kur'an 4:157-158). Kundër atyre që e tepruan, insiston se ai është një profet dhe i dërguar fisnik, jo Zot apo bir i Zotit - 'Mesia, biri i Merjemes, nuk ishte veçse një i dërguar' (Kur'an 5:75). Sipas besimit sunit ai do të kthehet para Ditës së Fundit. Historia e tij mëson se fuqia e Allahut i kapërcen të gjitha shkaqet natyrore, se profetët janë shërbëtorë të nderuar dhe kurrë hyjnorë dhe se e vërteta duhet të mbrohet si nga mohimi ashtu edhe nga ekzagjerimi.",
    ],
    profile: {
      nation: "Beni Isra'il",
      location: "Levanti",
      era: "shekulli I er",
      mission: "Përtërije teuhidin, konfirmo Tevratin dhe thirr në drejtësi.",
      challenges: [
        "Kundërshtim dhe komplot nga ata që e refuzuan",
        "Ekzagjerimi i mëvonshëm i statusit të tij",
        "Mbrojtja e monoteizmit të pastër",
      ],
      miracles: [
        "Lindja pa baba",
        "Duke folur në djep",
        "Shërimi dhe dhënia e jetës me lejen e Allahut",
      ],
      majorEvents: [
        "Lindja e tij e mrekullueshme dhe mbrojtja e nënës së tij",
        "Thirrja publike me shenja të qarta",
        "Duke u ngritur tek Allahu, jo i vrarë",
      ],
      lessons: [
        "Fuqia e Allahut i kapërcen shkaqet e zakonshme",
        "Profetët janë shërbëtorë të nderuar të Allahut, asnjëherë hyjnorë",
        "E vërteta duhet të ruhet si nga mohimi ashtu edhe nga ekzagjerimi",
      ],
      facts: [
        "Duke pasur parasysh Inxhilin (Ungjillin)",
        "Do të kthehet para Ditës së Fundit në besimin sunit",
      ],
    },
    quran: [
      {
        excerpt:
          "[Isai tha]: Vërtet, Allahu është Zoti im dhe Zoti juaj, andaj adhuronie Atë. Kjo është një rrugë e drejtë.",
      },
      {
        excerpt:
          "Dhe ata nuk e vranë as nuk e kryqëzuan; por atyre iu shfaq kështu... Përkundrazi, Allahu e ngriti pranë Vetes.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Unë jam më i afërti i të gjithë njerëzve me Isain, birin e Merjemes. Profetët janë vëllezër të nënave të ndryshme, por feja e tyre është një dhe nuk ka pasur asnjë profet mes nesh.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Muhamedi ﷺ",
    summary:
      "I dërguari i fundit, i dërguar si mëshirë për të gjitha botët dhe vulë e profetësisë.",
    body: [
      "Muhamedi ﷺ është i fundit nga profetët, i dërguar jo te një popull i vetëm, por te mbarë njerëzimi, me Kur'anin si shpalljen përfundimtare dhe të ruajtur. Allahu e përshkruan misionin e tij në një ajet të vetëm: \"Dhe Ne nuk të dërguam ty veçse si mëshirë për botët\" (Kur'an 21:107). I lindur në Mekë, ai mori shpalljen e parë në moshën dyzetvjeçare në shpellën Hira dhe për njëzet e tre vitet e ardhshme ai i thirri njerëzit që të adhurojnë vetëm Allahun, të pastrojnë zemrat e tyre dhe të jetojnë me drejtësi dhe mëshirë - duke plotësuar dhe konfirmuar mesazhin e çdo profeti para tij.",
      "Rruga e tij ishte një sakrificë e qëndrueshme. Në Mekë ai dhe besimtarët e hershëm duruan talljet, torturat dhe bojkotin e gjatë. Më pas erdhi hixhreti, shpërngulja në Medine, ku ai ndërtoi bashkësinë e parë muslimane – vendosjen e namazit, vëllazërisë mes mërgimtarëve dhe ndihmësve, traktatet dhe një shoqëri të rrënjosur në teuhid. Përmes viteve të vështirësisë dhe triumfit eventual, karakteri i tij nuk u lëkund kurrë; Kur'ani dëshmon: 'Në të vërtetë, ti je me një karakter të madh moral' (Kur'an 68:4), dhe ai vetë tha se ishte dërguar për të përsosur një karakter fisnik.",
      "Allahu e shpall atë \"I Dërguar i Allahut dhe vulë e profetëve\" (Kur'an 33:40) - pas tij nuk ka asnjë profet. Mrekullia e tij më e madhe është vetë Kurani, një shenjë e qëndrueshme që ende udhëzon miliarda njerëz, dhe ai u nderua me Isra dhe Miraxhi, udhëtimin e natës dhe ngjitjen në qiell. Për besimtarin, ai është usveh hasenah - shembulli i bukur (Kur'an 33:21) - Suneti i të cilit është rruga praktike e besimit. Dashuria për të, ndjekja e udhëzimit të tij dhe dërgimi i bekimeve mbi të janë në qendër të jetës muslimane.",
    ],
    profile: {
      nation: "Gjithë njerëzimi",
      location: "Meka dhe Medine",
      era: "shekulli i VII e.s",
      mission:
        "Përcillni zbulesën përfundimtare dhe plotësoni mesazhin profetik për të gjithë popujt.",
      challenges: [
        "Persekutimi dhe bojkoti në Mekë",
        "Konflikti dhe ndërtimi i një komuniteti të drejtë",
        "Përcjellja e një mesazhi universal nëpër fise dhe kombe",
      ],
      miracles: [
        "Kur'ani si një mrekulli e qëndrueshme",
        "Isra dhe Miraxhi (udhëtim nate dhe ngritje në qiell)",
        "Shumë shenja të dhëna me lejen e Allahut",
      ],
      majorEvents: [
        "Fillimi i shpalljes në Mekë",
        "Hixhreti deri në Medine",
        "Plotësimi i mesazhit dhe predikimi i lamtumirës",
      ],
      lessons: [
        "Mëshirë dhe karakter fisnik në udhëheqje",
        "Qëndrueshmëria nën presion",
        "Ndiqni shpalljen dhe Sunetin së bashku",
      ],
      facts: ["Vula e profetëve", "Shembulli më i mirë (usveh hasenah) për besimtarët"],
    },
    quran: [
      {
        excerpt:
          "Muhamedi nuk është babai i asnjërit prej burrave tuaj, por ai është i Dërguari i Allahut dhe vula e profetëve.",
      },
      {
        excerpt: "Dhe Ne nuk të dërguam vetëm si mëshirë për botët.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Shembulli im dhe shembulli i profetëve para meje është ai i një njeriu që ndërtoi një shtëpi bukur dhe plotësisht, përveç vendit të një tulle. Unë jam ajo tullë dhe unë jam vula e profetëve.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
];

export const PROPHETS_TIMELINE_SQ: DeepPartial<ProphetsTimelineEvent>[] = [
  {
    era: "Fillimi",
    title: "Adami - profeti i parë",
    body: "Allahu e krijoi Ademin, i mësoi emrat dhe e bëri mëkëmbës të Tij në tokë.",
  },
  {
    era: "Antikiteti",
    title: "Idrisi, Nuhu dhe popujt e hershëm",
    body: "Profetët e hershëm i thirrën njerëzit e tyre në teuhid. Nuhu predikoi me shekuj; kur refuzimi vazhdoi, erdhi përmbytja dhe arka i shpëtoi besimtarët si shenjë.",
  },
  {
    era: "Mesopotami / Levant",
    title: "Ibrahimi dhe familja e tij",
    body: "Halilullah, miku i Allahut: ai i theu idhujt, shpëtoi nga zjarri, ndërtoi Qaben me Ismailin dhe lindi një varg pejgamberësh përmes Ismailit dhe Is'hakut.",
  },
  {
    era: "Egjipt dhe Sinai",
    title: "Musa dhe Beni Isra'il",
    body: "Çlirimi nga Faraoni, zbuloi Tora, varg i gjatë i profetëve për Beni Isra'ilin.",
  },
  {
    era: "Egjipti",
    title: "Jusufi në Egjipt",
    body: "Durimi përmes tradhtisë, burgut dhe ngritjes në autoritet - një model besimi.",
  },
  {
    era: "Jeruzalemin",
    title: "Davudi dhe Sulejmani",
    body: "Mbretëria, urtësia, Zaburi dhe mbretëria e lavdëruar në Kur'an.",
  },
  {
    era: "shekulli I er",
    title: "Isa ibn Merjem",
    body: "Lindi për mrekulli, foli në djep, u ngrit tek Allahu - jo i vrarë në kryq sipas Kuranit.",
  },
  {
    era: "shekulli i VII e.s",
    title: "Muhamedi ﷺ - vula e profetëve",
    body: "Lajmëtari i fundit për mbarë njerëzimin; Kur'ani i ruajtur deri në Ditën e Fundit.",
  },
];
