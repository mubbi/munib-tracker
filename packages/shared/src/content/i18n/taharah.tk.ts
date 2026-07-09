// Turkmen translation overlay for the Learn Taharah content. Mirrors the order of
// its English source in ../taharah*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { TaharahChecklistItem, TaharahTopic } from "../../types/taharah";
import type { DeepPartial } from "./localize";

export const TAHARAH_TOPICS_TK: DeepPartial<TaharahTopic>[] = [
  {
    title: "Taharah bilen tanyşlyk",
    summary: "Arassalamak doga-dilegiň gapysydyr we imanly adamyň imanynyň ýarysydyr.",
    body: [
      "Taharah (طهارة) arassalanmagy aňladýar - musulman kabul eden ýagdaýynda Allanyň huzurynda durup biler ýaly, bedeni, geýimleri we namaz okalýan ýerleri däp-dessur we beden haramlygyndan azat etmek. Ybadat talybynyň ilkinji öwrenýän zady, sebäbi onsuz hiç bir doga dogry bolmaz: Pygamber alaýhyssalam: «Namazyň açary arassalanmakdyr» diýdi.",
      "Yslamda arassalanmagyň iki ölçegi bar. Daşky görnüşi göze görnüp duran arassalyk - ýuwmak, hapany aýyrmak, arassa saklamak. Içki, ýuwmagyň oýarmak üçin niýetlenen kiçigöwünliligi, oýlanmasy we ýüregiň taýynlygydyr. Pygamberimiz, arassalanmagy iman ýarysy “diýip atlandyranda, fiziki arassalygy ruhuň günäden saplanmagy bilen jübütledi.",
      "Bu modul tutuş mowzuk boýunça geçýär: arassalaýan suwuňyz, taharet (ownuk taharet), ghusl (doly däp-dessur wannasy), taýammum (suw ulanyp bolmaýan wagty gury arassalamak), najasah (fiziki hapalygy aýyrmak) we aýratyn ýagdaýlar we ýeňillikler. Bir gezek öwreniň we doga şübhe däl-de, ynam bilen girip boljak bir zada öwrülýär.",
    ],
    quran: [
      {
        excerpt:
          "Eý iman edenler, namaz okamak üçin turanyňyzda ýüzüňizi we biliňizi tirsegiňize ýuwuň, kelläňizi süpüriň we aýaklaryňyzy topuklara ýuwuň.",
      },
      {
        excerpt: "Hakykatdanam, Allah hemişe toba edýänleri we özüni arassalaýanlary söýýär.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Namazyň açary arassalanmakdyr; başlangyjy takbir, soňy taslimdir. (Ali; Jami 'at-Tirmizi 3)",
      },
    ],
    actions: [
      "Arassalanmagy gyssagly däl-de, Alla bilen duşuşmaga taýýarlyk hökmünde kabul ediň.",
      "Flowhli akym tebigy duýulýança her gün bir tahara mowzugyny öwreniň.",
    ],
    appLinks: [{}],
  },
  {
    title: "Arassalygyň ähmiýeti",
    summary: "Arassalyk namazyň berk şertidir we imanlylaryň nyşanydyr.",
    body: [
      "Arassalanmak köpleriň arasynda bir wariant däl - bu doganyň dogrulygynyň şertidir. Allah tämizlenýänçä däp-dessurlary bolan adamyň dogasyny kabul etmeýär. Şonuň üçin dogry taharet ýa-da taharetsiz ýerine ýetirilen doga, çyn ýürekden bolsa-da gaýtalanmalydyr.",
      "Pygamberimiz, tämizlenmegi imanlylaryň kesgitleýji häsiýetine çykardy we muny imanyň ýarysy “diýip atlandyrdy. Yzygiderli arassalamak adamy terbiýeleýär, ybadat etmäge hemişe ýakyn ýagdaýda saklaýar we hadys öwredýär - ownuk günäleri suw bilen ýuwýar.",
      "Namazy goraýandygy üçin, tahara, imanly adamy biperwaýlykdan nädogry doga etmek günäsinden goraýar. Şonuň üçin onuň kararlaryny gowy öwrenmek Yslamdaky iň uly amallardan birini goramakdyr.",
    ],
    hadith: [
      {
        excerpt: "Arassalamak imanyň ýarysydyr. (Abu Mälik al-Aşari)",
      },
      {
        excerpt:
          "Allatagala namazy arassalanmazdan, ogurlanan zatlardan sadaka kabul etmeýär. (Ibni Umar)",
      },
    ],
    actions: [
      "Her dogadan öň arassaçylyk ýagdaýyňyzy başlamazdan ozal tassyklaň.",
      "Mindönekeý akyl sanawyny saklaň: beden, geýim, ýer we taharet.",
    ],
  },
  {
    title: "Arassalygyň görnüşleri",
    summary: "Bilmeli üç ştat: ownuk haramlyk, uly haramlyk we fiziki najasah.",
    body: [
      "Yslam kanuny arassalanmak üçin zerur bolan üç zady tapawutlandyrýar we hersiniň öz serişdesi bar. Haýsy ýagdaýa düşýändigiňizi bilmek, dogry usuly saýlamagyň açarydyr.",
      "Ujypsyz däp-dessur haramlygy (hadys asgar) hajathana ulanmak, şemaldan geçmek ýa-da çuňňur uky ýaly adaty wakalardan gelip çykýar. Suw ulanyp bolmaýan mahaly taharet ýa-da taýamm bilen göterilýär.",
      "Esasy däp-dessur haramlygy (hadaba akbar, janabah hem diýilýär) ýakynlygyň, jynsy gatnaşyklaryň, aýbaşydan ýa-da dogrumdan soňky gan akmagyň netijesinde ýüze çykýar. Ghusl, doly beden däp-dessurly hammam bilen göterilýär - suw ýok bolanda ýa-da zyýanly bolanda tayammum çalyşýar.",
      "Fiziki hapalar (najasah) - peşew, zyňyndy ýa-da akýan gan ýaly aýratyn mesele: däp-dessurlaryňyza garamazdan bedeniňizden, eşikleriňizden we namazyňyzdan fiziki taýdan aýrylmaly. Dört sünni mekdebi, bu üç kategoriýa barada ylalaşýarlar, diňe arassalygy ýok edýän ýa-da haýsy mukdarda bahana berilýändigi barada jikme-jiklikler bilen tapawutlanýar.",
    ],
    quran: [
      {
        excerpt:
          "Janabah ýagdaýynda bolsaňyz, özüňizi arassalaň. Youöne syrkaw bolsaňyz ýa-da syýahatda bolsaňyz ... we suw tapmasaňyz, arassa toprak bilen taýamumy ýerine ýetiriň.",
      },
    ],
    actions: [
      "Ilki bilen öz ýagdaýyňyzy kesgitläň (kiçi, uly ýa-da hapa), soňra dogry usuly ulanyň.",
      "Jikme-jiklikleri bilmeseňiz, ykrar edilen mekdebiň bir hünärli mugallymy yzygiderli yzarlaň.",
    ],
  },
  {
    title: "Yslamda suw",
    summary:
      "Arassa suw esasy arassalaýjydyr - gowy ulanylýar, ýöne hiç wagt biderek sarp edilmeýär.",
    body: [
      "Arassalamagyň esasy serişdesi suwdyr. Allah ýagyşy arassalap we ybadat üçin ulanyp boljak 'arassa' (tahur) diýip häsiýetlendirýär. Islendik tebigy arassa suw - ýagyş, derýa, deňiz, çeşme, guýy ýa-da kran - reňkini, tagamyny ýa-da ysyny garyşdyrmak bilen üýtgemänkä arassalaýar.",
      "Hukukçylar suwy jikme-jik toparlara bölýärler (arassa we arassalaýjy, arassa, ýöne arassalamaýan we haram däl), ýöne gündelik durmuş üçin amaly düzgün ýönekeý: bir najasah ony üýtgetmedik bolsa, suw taharet we ghusl üçin amatly bolup galýar. Elýeterli arassa alternatiwa bilen hakyky şübheleneniňizde, alternatiwany ulanyň.",
      "Yslam isripsizligi öwredýär. Pygamberimiz doly ýuwuldy, ýöne gaty az suw ulandy - taharet üçin palçyk (iki käse ujy) we doly ghusl üçin sa (takmynan dört). Suwy ýitirmek köp bolanda-da ruhdan düşýär, sebäbi aramlygyň özi ybadat etikasynyň bir bölegidir.",
    ],
    quran: [
      {
        excerpt: "Asmandan arassa suw iberýäris.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Pygamber alaýhyssalam, palçyk suw bilen taharet we bäş palçyga çenli taharet berýärdi. (Anas; şeýle hem Sahih Musulman 325 - ortaça sünnet)",
      },
    ],
    actions: [
      "Gowy ýuwmak üçin ýeterlik suw ulanyň, ýöne krany aşak öwüriň we artykmaçlykdan gaça duruň.",
      "Suw çeşmesi hapalanan ýaly görünýän ýa-da ys alýan bolsa, iň ýakyn arassa çeşmäni gözläň.",
    ],
    disclaimer:
      "Köp agzalýan 'akýan derýada-da suwy ýitirmäň' hasabatynda (Ibn Majah 425) alymlaryň köpüsi tarapyndan ejiz (daif) derejesi bar; ortaça sünnet, ýokardaky palçyk / hadys hadyslary bilen kesgitlenýär.",
  },
  {
    title: "Wudu näme?",
    summary: "Ybadatdan öň ownuk haramlygy aýyrýan däp taharet.",
    body: [
      "Taharet (وضوء), ownuk-uşak däp-dessurlary, belli bir tertipde ýuwmak, ownuk däp-dessurlary ýok edýär. Dört farz ýuwulmagy göni Gurhanda (5: 6) atlandyrylýar: ýüzi, tirseklerine bilekler, kelläni süpürmek we aýaklary topuklara süpürmek.",
      "Her namazdan öň, ozalky dogadan dogry ýagdaýda galmasaňyz we alymlaryň köpüsiniň pikiriçe, Käbäniň töwereginde tawaf etmezden ozal we Gurhanyň fiziki tekstine degmezden ozal talap edilýär.",
      "Taharet diňe deslapky däl-de, özbaşdak ybadatdyr. Pygamber alaýhyssalam: «Allatagala taharetini tä tä tä tä tä tä tä tä tä tä tä tä tä tä tä tä tä tä tä tä tä tä tä tä tä tä namazyny kabul etmez» diýip duýduryş berdi.",
    ],
    hadith: [
      {
        excerpt:
          "Allatagala taharet alýança taharyňy bozýan biriňiň dogasyny kabul etmeýär. (Abu Hureýra)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Dogry taharet üçin şertler",
    summary: "Niýet, arassa suw we päsgelçiliksiz deri - sesli taharetiň şertleri.",
    body: [
      "Taharet sanamak üçin käbir şertler (şurut) bolmaly. Ynsan ybadat üçin arassalanmagy maksat edinip, sagdyn pikirli musulman bolmaly. Käbir mekdepler niýeti hereketiň sütüni hökmünde, beýlekileri şert hökmünde kesgitleýärler, ýöne hemmeler munuň sylag we köplenç ygtybarlylygy üçin zerurdygyny kabul edýärler.",
      "Ulanylan suw arassa we arassalaýjy bolmaly. Iň möhümi, hakykatdanam derä ýetmeli - şonuň üçin bir agzanyň üstünden suw geçirmeýän päsgelçilik döredýän (galyň boýag, dyrnak lak, mum, ýelim) ilki bilen aýrylmaly ýa-da aşagyndaky ýuwulma dogry däl. Suwy bökdemeýän adaty kir ýa-da henna tegmili problema däl.",
      "Şafi we Hanbali mekdepleri hem ýuwulmagyň Gurhan tertibinde we el-aýaklaryň guramagyna mümkinçilik berýän uzak arakesmesiz (muwalat) edilmegini talap edýär. Gaty yzygiderlilik we dowamlylyk boýunça Hanafi we Maliki pozisiýalary käbir ýagdaýlarda has ýumşak bolýar. Yzygiderlilik üçin bir mekdebiň usulyna eýeriň.",
    ],
    quran: [
      {
        excerpt:
          "Facesüzleriňizi we biliňizi tirseklere ýuwuň, kelläňizi süpüriň we aýaklaryňyzy topuklara ýuwuň.",
      },
    ],
    actions: [
      "Dyrnak lakyny, suwy duzakly halkalary we taharetden öň derini möhürleýän zatlary aýyryň.",
      "Tahareti bir akymda arkaýyn ýerine ýetiriň, şonuň üçin hiç bir agza sypdyrmaz ýa-da guratmaz.",
    ],
  },
  {
    title: "Taharetiň hökmany hereketleri",
    summary: "Gurhan sütünleri (faraid), onsuz taharet nädogry.",
    body: [
      "Taharetiň farz amallary, Allanyň aýatda agzalan bölekleri: bütin ýüzüňi ýuwmak; iki eliňizi tirseklere çenli ýuwmak; kelläni süpürmek; we iki aýagyňyzy topuklara çenli we ýuwmak. Bularyň haýsydyr birini sypdyryň we taharet doly däl.",
      "Bulara mekdepler sünnetden we kanuny esaslardan goşmaça borçlary goşýar. Mekdepleriň köpüsinde niýet hökmanydyr (Hanafiler muny ownuk haramlygy ýok etmek üçin berk sünnet hasaplaýarlar). Şafi we Hanbaliler üçin sargyt (tartib) we üznüksizlik (muwalat) hökmanydyr. Malikler hökmany suratda el-aýaklary (dalk) sürtmegi goşýarlar.",
      "Bularyň daşyndaky hemme zat - agzy we burnuňy ýuwmak, ilki elleri ýuwmak, üç gezek ýuwmak - hökmany däl-de (sünnet) maslahat berilýär. Tapawudyny bilmek, taharetiň haçan hakyky däl bolsa, diňe kämillik däldigini aýdyp bilersiňiz.",
    ],
    quran: [
      {
        excerpt:
          "Facesüzleriňizi we biliňizi tirseklere ýuwuň, kelläňizi süpüriň we aýaklaryňyzy topuklara ýuwuň.",
      },
    ],
    disclaimer:
      "Faraidiň takyk sanawy (meselem, niýet, sargyt we sürtmek hökmanymy) dört mekdebiň arasynda tapawutlanýar. Bir ygtybarly mekdebi yzygiderli öwreniň we ulanyň.",
  },
  {
    title: "Taharet sünnetleri",
    summary: "Taharetiň mukdaryny kämilleşdirýän we köpeldýän maslahat berilýän amallar.",
    body: [
      "Hökmany esasda, Pygamberimiz tahareti tamamlaýan we owadanlaşdyrýan köp sanly amallary ýerine ýetirdi. Birini terk etmek tahareti ýatyrmaýar, ýöne olary goşmak goşmaça baýrak alýar we göreldesine has doly eýerýär.",
      "Bellenen sünnet amallary şulary öz içine alýar: başynda 'Bismillah' diýmek; başlamazdan öň elleri üç gezek ýuwmak; agzy (madmadah) we burun ýuwmak (istinshaq); galyň sakgaldan we barmaklaryň we aýaklaryň arasynda çygly barmaklary ylgamak (taklil); her jübüti sag bilen başlamak; we her ýuwmagy üç gezek gaýtalamak.",
      "Iki sünnet aýratyn bellemäge mynasypdyr: pygamberiň hökmany diýen ýaly ýerine ýetiren miswak (siwak) -ny ulanmak we aýdan adam üçin Jennetiň sekiz derwezesini açýan imanyň şaýatlygyny okamak.",
    ],
    hadith: [
      {
        excerpt:
          "Kim tahareti gowy ýerine ýetirse, onda 'Alladan başga hudaýyň ýokdugyna we Muhammetiň guly we pygamberidigine şaýatlyk edýärin' diýýär Jennetiň sekiz derwezesi. (Umar ibn al-Hatab)",
      },
    ],
    actions: [
      "Sünnetiň doly yzygiderliligini tebigy düzgüniňize öwrülýänçä ýerine ýetiriň.",
      "Taharetden soňky şahany her gezek okaň.",
    ],
    appLinks: [{}],
  },
  {
    title: "Wdim-ädim taharet",
    summary: "Niýetden başlap, ýalbarýança doly pygamberlik yzygiderliligi.",
    body: [
      "Pygamber alaýhyssalam, sünnet amallary bilen birlikde borçlary dokaýan akym yzygiderliligi hökmünde öwretdi. Bu, Usman ibn Affanyň adamlara görkezen usuly, şondan soň Pygamberiň taharetini görendigini, şeýle hem iki rekagat namaz okaýan adamyň öňki günäleriniň bagyşlanandygyny aýtdy.",
      "Her ädimiň suwuň gerekli ýere ýetýändigine göz ýetiriň. .Uwulan agzalar (ýüzi, gollary, aýaklary) ýuwulýar; kellesi diňe süpürilýär.",
    ],
    steps: [
      {
        title: "Arassalanmagy maksat ediniň we Bismillah diýiň",
        body: "Taşlamak niýetini ýüregiňize salyň we Allanyň adyndan başlaň.",
        tip: "Niýet içerde - hiç hili gürlemek formulasy talap edilmeýär.",
      },
      {
        title: "Iki eliňizi üç gezek ýuwuň",
        body: "Barmaklaryň arasynda suw geçirip, bilege ýuwuň.",
      },
      {
        title: "Agzy üç gezek ýuwuň",
        body: "Agzyňyza suw alyň, ýuwuň we kowuň.",
      },
      {
        title: "Burnuny üç gezek ýuwuň",
        body: "Burnuna ýuwaşlyk bilen suw çekiň we üfläň.",
      },
      {
        title: "Faceüzüňi üç gezek ýuw (fard)",
        body: "Saç setirinden eňegiň aşagyna we gulakdan gulaga çenli.",
      },
      {
        title: "Sag eliňizi, soňra çepiňizi (fard) ýuwuň",
        body: "Her biri barmaklaryňyzyň ujundan tirsegine çenli we üç gezek.",
      },
      {
        title: "Kelläni bir gezek süpüriň (fard)",
        body: "Çygly eller bilen öň tarapdan arka süpüriň we gaýdyň, soňra gulaklary şol bir çyglylyk bilen süpüriň.",
      },
      {
        title: "Sag aýagy, soňra çep (fard) ýuwuň",
        body: "Her biri topukdan we barmakdan barmaklaryň arasyndan geçýär.",
        tip: "Aýakgaplara we topuklara üns beriň - iň köp ýitirilen tegmiller.",
      },
      {
        title: "Ingapylýan dilegi okaň",
        body: "Jennetiň derwezelerini açmak üçin imanyň şaýatlygyny aýdyň.",
        tip: "Gysga, ýöne agyr sylaglanan sünnet.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Usman Pygamberiň görşi ýaly her aýagyny üç gezek ýuwdy, soň şeýle diýdi: kim şunuň ýaly taharet etse we iki rekagat namaz okasa, öňki günäleri bagyşlanar. (Humran, Usmandan)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Duas bilen baglanyşykly duas",
    summary: "Taharetden öň we soň özbaşdak habar berilýän dilegler.",
    body: [
      "Taharetiň töwereginde iň güýçli aýdylýan ýatlamalar iki: başynda 'Bismillah' diýmek we ony tamamlandan soň imanyň şaýatlygy. Şahadanyň ýapylyşyna hakyky goşundy Alladan: 'Meni toba edenleriň arasynda ediň we meni arassalaýanlaryň arasynda ediň' diýip soraýar.",
      "Käbir kitapçalarda ýaýradylan jikme-jik 'her agza üçin dua' (elleri, ýüzleri, gollary we ş.m. ýuwulanda belli bir dileg) Pygamberimiziň dogry hakykylygy bilen kesgitlenmändigini bilmek möhümdir. Alymlar taharet wagtynda Allany umumy ýatlamagyň zyýany ýok bolsa-da, bulary sünnet diýip atlandyrmazlygy maslahat berýärler.",
      "Meseläniň ýüregi bar: her bir agzanyň günäsiniň gaçýandygyny bilip ýuwuň we hereketi maksadyna - diňe Allaha iman bilen baglanyşdyrýan şahada bilen tamamlaň.",
    ],
    hadith: [
      {
        excerpt:
          "Kim tahareti gowy ýerine ýetirip, soň imanyň güwäligini okasa, Jennetiň sekiz derwezesi islänine girip biler. (Umar)",
      },
    ],
    actions: [
      "Taharetden soňky şahadany ýatda saklaň.",
      "Her bir agzanyň tassyklanmadyk formulalaryny sünnet döredilen ýaly okamakdan gaça duruň.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Wudu näme?",
    summary: "Tahareti ýoklaýanlar - we şübhe dörände takyklyk düzgüni.",
    body: [
      "Ylmy ylalaşyk boýunça taharet, iki şahsy geçelgeden çykýan islendik zat - peşew, tabak, ýel ýa-da başga akymlar, şeýle hem adamyň aňyny aýyrýan çuňňur uky we huşuň ýa-da serhoşlygyň netijesinde huşuňy ýitirýär.",
      "Beýleki meseleler mekdepleriň arasynda hormat goýulýar: gönüden-göni şahsy böleklere degmek we beýleki jynsdaky mahram däller bilen deri-deri gatnaşyklar, käbir mekdeplerde şol bir tekstiň dürli okalyşyna esaslanyp, beýlekiler däl.",
      "Möhüm dolandyryş ýörelgesi sizi yzygiderli aladalardan goraýar: ynam şübhe bilen aýrylmaýar. Eger taharet eden bolsaňyz we ony döwendigiňize ynamyňyz ýok bolsa, bir tämizleýjiniň ýüze çykýandygyna ynanýançaňyz taharet hasaplanýar. Pygamberimiz, bu duýgydan biynjalyk bolan adama, bir ses eşidýänçä ýa-da ys tapýança, dogasyny terk etmezligi tabşyrdy.",
    ],
    hadith: [
      {
        excerpt:
          "Bir ses eşidýänçä ýa-da ys tapýança gitmeli däldir. (Abbad ibn Tamim, daýysyndan)",
      },
    ],
    disclaimer:
      "Garşy jynslara ýa-da şahsy böleklere degmek, taharet döwmek mekdepleriň arasynda tapawutlanýar. Tejribeli ýerli mugallym we bir mekdebiň usulyna eýeriň.",
  },
  {
    title: "Wudu ýalňyşlyklary",
    summary: "Sylagy azaldýan ýygy-ýygydan ýalňyşlyklar - ýa-da tahareti düýbünden ýok etmek.",
    body: [
      "Taharetleriň köpüsi howlukmaçlykdan gelýär. Suwuň tutuş bir agzasyna ýetmezligi üçin, dabanyň, topugyň, tirsegiň ýa-da barmaklaryň we aýaklaryň arasyndaky gury ýama, tahareti nädogry goýup biler, sebäbi Gurhan ýuwulmagy bu ýerde tamamlanmandyr.",
      "Pygamber alaýhyssalam bir gezek topuklarynyň suwuň ýetip bilmeýändigi sebäpli gury galan adamlary gördi we berk duýduryş berdi: 'Otdan topuklara waý!' Daban, topuk we ýüzüň burçlary iň köp üns berilmeýän tegmillerdir.",
      "Munuň tersine ýalňyşlyk artykmaçdyr: üç gezekden köp ýuwmak ýa-da ortaça sünnetine ters gelýän suwy biderek ulanmak. Beýlekiler bolsa tahaba düşýärler (obsesif şübhe), tahareti gaýtalap gaýtalaýarlar - bu hem ýalňyşlyk, sebäbi şübhe şübhe bilen ýok edilmeýär.",
    ],
    hadith: [
      {
        excerpt:
          "Otdan topuklara waý! - taharetde topuklaryň gury galandygyny görende aýtdy. (Abu Hureýra)",
      },
    ],
    actions: [
      "Her ýuwulan agzanyň, esasanam dabany we tirsegini haýallaşdyryň we aňsatlyk bilen tassyklaň.",
      "Orta suw ulanyň; obsesif şübhe sizi gereksiz gaýtalamaga itergi bermäň.",
    ],
  },
  {
    title: "Taharetiň fazyletleri",
    summary:
      "Taharet günäleri ýok edýär, hatarlaryny ýokarlandyrýar we kyýamat güni imanlylary ýagtylandyrar.",
    body: [
      "Taharet, günäleriň gaýta-gaýta ýuwulmagydyr. Pygamberimiz, imanlylaryň her bir agzasyny ýuwmagy bilen, bu agzanyň eden nädogry hereketleriniň, adam günäden saplanýança gözler, eller, aýaklar bilen suwdan gaçýandygyny öwretdi. Taharetden öň edilen doga, täze bagyşlanmakdan öň gelýär.",
      "Şeýle hem indiki durmuşda tapawutly hormatdyr. Kyýamat güni Pygamber his yzarlaýanlaryny ýüzlerinde, ellerinde we aýaklarynda taharet yzlaryndan tanar - al-gurr al-muhajjalun diýilýän bu ymmata mahsus çyra.",
      "Bu häsiýetler sebäpli taharetde bolmak maslahat berilýän endikdir: her doga üçin täzeläp, taharetde uklamak imanlynyň gorag düzgünlerinden biridir.",
    ],
    hadith: [
      {
        excerpt:
          "Ymmat kyýamat gününde taharet yzlaryndan açyk ýüzleri, elleri we aýaklary bilen çagyrylar. (Abu Hureýra)",
      },
    ],
    actions: [
      "Mümkin bolan her namaz penjiresine taharet täzeläň.",
      "Gijeki sünnetde taharetde ýatmak.",
    ],
    appLinks: [{}],
  },
  {
    title: "Ghusl näme?",
    summary: "Esasy haramlygy göterýän doly beden däp-dessury (janabah).",
    body: [
      "Ghusl (غسل) esasy däp-dessurlary (janabah) aýyrmak niýeti bilen tutuş bedeni ýuwmakdyr. Taharet ownuk haramlygy çözýän ýerinde, jyns ýakynlykdan, jynsy akymdan we aýbaşydan ýa-da dogrumdan soňky gan akmadan soň has uly ýagdaýa ýüzlenýär.",
      "Onuň düýp manysy, suwuň daşky bedeniň her bir ýerine ýetmegidir - saçyň kökleri, deriniň bukulmagy, gulaklaryň, göbekleriň we aýaklaryň arasynda gury ýer galmaz. Agzy we burnuny ýuwmak köp alymlar tarapyndan gazyň içine girýär.",
      "Janabany götermek niýeti bilen ýerine ýetirilen bir taharet, ownuk haramlygy hem aradan aýyrýar, şonuň üçin tahareti tamamlan adam aýratyn taharetsiz namaz okap biler (taharetde taharet okamak sünnetdir).",
    ],
    quran: [
      {
        excerpt: "Janabah ýagdaýynda bolsaňyz, özüňizi arassalaň.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ghusl talap edilende",
    summary: "Däp-dessur hammamyny doly ýa-da maslahat berýän ýagdaýlar.",
    body: [
      "Ghusl kesgitlenen birnäçe ýagdaýda hökmany bolýar: jyns suwuklygynyň isleg bilen çykmagy (oýanmak ýa-da çygly düýş bilen bolsun); jynsy gatnaşyklaryň özi, eýakulýasiýa bolmazdan - Pygamber ﷺ, ikisi birleşenden soň, gyza gelmelidigini aýtdy; we aýbaşy gutarmak (ot) ýa-da dogrumdan soňky gan akma (nifas). Ölüm merhumyň diriligini dirilere borçly edýär.",
      "Beýleki gyzalar hökmany däl-de (mustahabb) maslahat berilýär: Juma'dan öň anna güni, pygamberimiz ony 'kämillik ýaşyna ýeten her bir adamyň borjy' diýip atlandyrýan gaty güýçli çagyryş; iki Gurban baýramy; we hajdan ýa-da umradan öň yhram ghusy.",
      "Täze alymlara käbir alymlar tarapyndan hökmany we beýlekiler tarapyndan berk maslahat berilýän yslama gireninden soň taharet bermek tabşyrylýar.",
    ],
    hadith: [
      {
        excerpt:
          "Erkek aýalynyň dört aýagynyň arasynda oturyp, onuň bilen jyns gatnaşykda bolanda, gyza farz bolýar. (Abu Hureýra; şeýle hem Sahih Musulman 348)",
      },
      {
        excerpt:
          "Juma, anna güni ýetginjeklik ýaşyna ýeten her bir adamyň borjydyr. (Abu Said al-Hudri; şeýle hem Sahih Musulman 846)",
      },
    ],
    disclaimer:
      "Juma we iman getirenler hökmanymy ýa-da berk maslahat berilýärmi mekdep we ýagdaý boýunça tapawutlanýar.",
    appLinks: [{}],
  },
  {
    title: "Stepdimme-ädim Gusl",
    summary: "Pygamberlik usuly - iň az borç we doly sünnet.",
    body: [
      "Aýşa Pygamberiň aususyny jikme-jik suratlandyrdy we ondan alymlar iň pes ygtybarly we has doly sünnet usulyny alýarlar. Iň pes zat ýönekeý: niýet we goşmaça suw tutuş bedene ýetýär (köpler üçin agzy we burnuny ýuwmak bilen). Aşakdaky doly usul, Pygamberimiziň özi muny nädip etdi.",
      "Hiç zat gury galmaz ýaly, derini suw bilen sürtüp, gyssagly ýerine ýetiriň.",
    ],
    steps: [
      {
        title: "Niýeti emele getiriň",
        body: "Esasy däp-dessurlary (janabah) aýyrmak üçin ýüregiňizde niýet ediň.",
      },
      {
        title: "Bismillah diýiň we elleriňizi ýuwuň",
        body: "Allanyň adyndan başlaň we iki eliňizi ýuwuň.",
      },
      {
        title: "Hususy meýdany ýuwuň",
        body: "Çep eliňiz bilen şahsy böleklerden haramlygy aýyryň.",
      },
      {
        title: "Doly taharet ediň",
        body: "Namaz ýaly taharet ediň. Gatheredygnan suwda dursaňyz, aýaklaryňyzy ahyryna çenli ýuwmagy gijikdirip bilersiňiz.",
      },
      {
        title: "Kellä üç gezek suw guýuň",
        body: "Suwy kelläňize we saçyň köklerine işlediň.",
      },
      {
        title: "Sag tarapy, soňra çepe ýuwuň",
        body: "Sagdan başlap, tutuş bedeniňize suw guýuň we sürtüň.",
      },
      {
        title: "Doly gurşawy üpjün ediň",
        body: "Gury ýer goýmaň - aşagy, göbek, dyzlaryň we gulaklaryň aňyrsynda we aýaklaryň arasynda.",
        tip: "Aýallar saçyň kellesine ýeten halatynda örülen saçlary yzyna gaýtarmaly däldirler.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Pygamberimiz jan janabadan suwa düşüp, ellerini ýuwup, namaz okamak üçin taharet etdi, barmaklaryny saçlaryndan geçirdi, soň kellesine üç gezek we bedeniniň galan bölegine suw guýdy. (Aýşa)",
      },
    ],
  },
  {
    title: "Ghusl ýalňyşlyklary",
    summary: "Gurak ýerlerden, ýitirilen niýetden we bir duş üçin duş ýuwmakdan gaça duruň.",
    body: [
      "Iň esasy ýalňyşlyk, adaty duşa gaz ýaly garamakdyr. Gusl esasy haramlygy aýyrmak niýetini talap edýär; onsuz, näçe uzak ýuwsaňam, däp-dessurlar göterilmeýär. Başlamazdan ozal niýeti emele getiriň.",
      "Ikinji umumy ýalňyşlyk gury tegmilleri goýmakdyr. Borç, suwuň tutuş daşky bedene degmegidir, şonuň üçin kelläniň köklerine, gulaklaryna, göbeklerine, arka bölegine ýa-da aýaklaryň arasyna üns bermezlik, gazyň doly bolmazlygyny üpjün edýär. Elbetde, suwy bu ýerleriň üstüne sürtüň.",
      "Saç üçin: örülen saçly aýal, kelläniň köklerine suw ýetýänçä, örülen saçlary yzyna gaýtarmak talap edilmeýär - Pygamberimiz Umm Salamah kellä üç el guýmagyň ýeterlikdigini aýtdy. Erkek adamyň saçlary, köplenç ýumşak bolansoň, suw köklere ýetmeli.",
    ],
    hadith: [
      {
        excerpt:
          "Kelläňize üç ujy suw guýup, soň özüňize suw guýuň we arassalanarsyňyz - örgünleriňizi yzyna gaýtarmaly dälsiňiz. (Umm Salamah)",
      },
    ],
    actions: [
      "Birinji guýmazdan ozal niýetiňizi aýdyň, şonuň üçin ýuwmak ghusl hasaplanýar.",
      "Suwy aňsatlyk bilen sypdyrýan ýerlere sürtüň; näbellilik ýüze çykanda, şübhe bilen gutarman, bölümi täzeläň.",
    ],
  },
  {
    title: "Taýammum näme?",
    summary: "Suw ulanyp bolmaýan wagty arassa toprak bilen gury arassalama.",
    body: [
      "Taýammum (تيمم) suw hakykatdanam elýeterli bolmadyk ýa-da ulanyp bolmaýan mahaly taharet ýa-da ghuslyň rehimdar ornundyr. Hinguwmagyň ýerine, arassa topragy palmalar bilen urýar we ýüzüňi we eliňi süpürýär - bu bolsa namaz okamaga mümkinçilik berýän suwy arassalamak ýerini doly alýar.",
      "Taýammum, ylaýta-da bu ymmatyň sowgady: Pygamber alaýhyssalam: «meer meniň üçin doga mekany we arassalanmak üçin ýaradyldy» -diýip, ozal berlen pygamberlere däl-de, özüne berlen aýratyn artykmaçlyklaryň hataryna goşdy. Diniň esasy ýörelgesini öz içine alýar - borç galýar, ýöne kynçylyk aradan aýrylýar.",
      "Bu wagtlaýyn çäre: suw elýeterli we ulanyp bolansoň, suw bilen adaty arassalanmak dowam edýär. Adam, käbir mekdeplere görä her doga üçin tayammy täzelemeli bolup biler.",
    ],
    quran: [
      {
        excerpt:
          "... we suw tapmarsyňyz, soňam arassa toprak bilen taýamumy ýerine ýetiriň we ýüzleriňizi we elleriňizi süpüriň.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Meer meniň üçin doga mekany we arassalanmak üçin ýaradyldy. (Jabir - Pygambere üýtgeşik berlen bäş zadyň arasynda ﷺ)",
      },
    ],
  },
  {
    title: "Taýammuma rugsat berlende",
    summary: "Suw ýok bolsa, zyýanly ýa-da ýaşamak üçin gyssagly zerur bolanda rugsat berilýär.",
    body: [
      "Taýamuma üç giň ýagdaýda rugsat berilýär. Ilki bilen, ýerlikli gözlegden soň suw tapylmasa - çölde syýahatçy ýa-da hakykatdanam elýeterli adam ýok. Ikinjiden, suw ulanylanda zyýan getirer: ýaralary ýa-da keselleri hasam erbetleşýän hassalar üçin, ýa-da suwy gyzdyrmak üçin serişdesi bolmadyk we gaty zyýanly hassalar üçin.",
      "Üçünjiden, bar bolan az suw has möhüm zerurlyk üçin zerur bolanda - içmek ýaly, biriniň ýa-da başga biriniň ýa-da haýwanyň ýaşaýşyny goramak üçin. Iki ýagdaýda-da şerigat ileri tutulýan arassalama usulyndan has ýokary ömri we saglygy gorap saklaýar.",
      "Hukukçylar has inçe çäkler boýunça tapawutlanýarlar - suw gözlemeli, zyýandan gorkmak näçeräk - ýöne esasy rehimdarlykda biragyzdan: ybadat hiç haçan taşlanmaýar, diňe aňsatlaşdyrylýar.",
    ],
    hadith: [
      {
        excerpt:
          "Taýammum baplarynda hasabat berilýär: Ulanylýan suw ýok halatynda arassa toprak bilen arassalanmak üçin ýeňillik.",
      },
    ],
    actions: [
      "Taýamuma ýüz tutmazdan ozal suw gözläň.",
      "Lukman ýarany ýa-da keseli gury saklamagy maslahat berýän bolsa, şoňa görä hereket ediň we taýammum ediň.",
    ],
  },
  {
    title: "Stepdimme-ädim Taýammum",
    summary: "Dogry gury arassalamak üçin gysga, ýönekeý yzygiderlilik.",
    body: [
      "Taýammum bilgeşleýin gysga - kynçylykda ýeňillik hökmünde maksadynyň beýany. Arassa, tebigy toprak bilen ýerine ýetirilýär: toprak, gum, daş ýa-da tozan. Onuň manysy, Pygamberiň görkezen görkezişinden başlap, Ammar ibn asirasyra çenli arassa toprakda ýekeje gezek urmak, soňra ýüzüňi we eliňi süpürmekdir.",
      "Bu dizaýn boýunça taharetden has ýeňil, şonuň üçin oňa kynçylyk goşmaň.",
    ],
    steps: [
      {
        title: "Niýeti emele getiriň",
        body: "Ybadat etmek üçin däp-dessurlary ýok etmegi maksat ediniň.",
      },
      {
        title: "Bismillah diýiň",
        body: "Allanyň adyndan başlaň.",
      },
      {
        title: "Arassa topragy iki eliň bilen bir gezek ur",
        body: "Palmalary arassa, tozanly, tebigy ýüzüne ýeňil goýuň.",
      },
      {
        title: "Faceüzüni süpüriň",
        body: "Bütin ýüzüňizi iki eliňiz bilen süpüriň.",
      },
      {
        title: "Elleri süpüriň",
        body: "Alymlaryň köpüsiniň ellerini biline süpüriň.",
        tip: "Bir mekdebiň usulyny (bilek we bilek) yzygiderli ýerine ýetiriň.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Pygamberimiz the eli bilen eli bilen urdy, soň ýüzüni we ellerini süpürdi - Ammara munuň ýeterlikdigini öwretdi. ('Ammar ibn asirasir)",
      },
    ],
  },
  {
    title: "Taýammy näme döwýär?",
    summary: "Adaty taharetçiler we ulanylýan suwuň gaýdyp gelmegi bilen ýok edildi.",
    body: [
      "Taharet ýerine ýerine ýetirilen taýamm, tahareti döwýän hemme zat bilen ýok edilýär: özüni rahatlandyrmak, ýeliň geçmegi, çuňňur uky we ş.m. Ghuslyň ýerine bir taýamm, esasy haramlyga sebäp bolýan islendik zat bilen ýok edilýär.",
      "Täsin, taýammum sebäbiniň aýrylmagy, ýagny ulanylýan suwdan peýdalanmak bilen gutarýar. Suw tapylyp, ulanylyp bilinensoň, konsessiýa ýitýär we biri taharet ýa-da gyza gaýdýar.",
      "Amaly rehimdarlyk nokady: eger tayammum bilen dogruçyl doga eden bolsaňyz we diňe suw tapsaňyz, köplük namazyň gaýtalanmaly däldigini öňe sürýär - bu şol wagt ulanylýan karara laýyklykda dogry ýerine ýetirildi. Emma namazdan öň suw peýda bolsa, ony ulanmaly.",
    ],
    actions: [
      "Her doga wagtynyň başynda bar bolan suwy täzeden barlaň.",
      "Suw ulanylan badyna suw bilen arassalanmaga gaýdyň.",
    ],
    disclaimer:
      "Käbir jikme-jiklikler, meselem, doga wagtynda suw tapylandan soň gaýtalanýarmy - mekdep bilen tapawutlanýar.",
  },
  {
    title: "Haramlyklar (Najasah)",
    summary: "Beden, eşik we namaz ýerinden aýrylmaly fiziki hapalar.",
    body: [
      "Najasah (نجاسة), adaty däp-dessurlardan tapawutly göze görnüp duran hapa. Ylalaşylan aýdyň mysallara adam peşewi we çykarylyşy, akýan gan, doňuzyň eti we akmagy we itiň tüýküligi (belli bir ýuwulmagy talap edýär) degişlidir. Bedeninden najasany aýyrmak, geýilýän eşikler we namaz okalýan ýer namaz okamak üçin şertdir.",
      "Aýyrmak, hapa görünýän ýerlerde, madda we yz ýok bolýança ýuwulýar. Yslam najasanyň çeşmelerine-de çynlakaý çemeleşýär: Pygamber alaýhyssalam, gabyr jezasynyň köpüsiniň peşew bilen seresapsyzlykdan gelip çykýandygyny, oňa sepilendigini we talabalaýyk arassalanmandygyny duýdurdy.",
      "Mekdepler käbir maddalary toparlara bölmek (mysal üçin, az mukdarda suwuklygyň bahana ýa-da ýoklugy) we haýsy mukdarda çydamlydygy boýunça tapawutlanýar. Gündelik durmuş üçin ulanylýan ýörelge: düýpli arassalaň we hapalygyň subutnamasy bolmadyk ýerde arassalyga şübhe döretmäň.",
    ],
    hadith: [
      {
        excerpt:
          "Pygamber alaýhyssalam iki gabyrdan geçdi we ýaşaýanlaryň jezalandyrylýandygyny aýtdy - biri töhmet ýaýratandygy üçin, beýlekisi peşewinden goranmandygy üçin. (Ibni Abbas; Sahih Musulman 292)",
      },
    ],
  },
  {
    title: "Geýimleri haramlykdan arassalamak",
    summary: "Egin-eşigi nädip ýuwmaly, onda namaz okamak dogry bolar.",
    body: [
      "Najasah geýime girende, täsir eden ýeri maddanyň özi we görünýän yzy aýrylýança suw bilen ýuwuň. Pygamber alaýhyssalam, egin-eşigi aýbaşy gany bilen boýalan bir zenany gyrmagy, soň bolsa suw bilen sürtmegi, soňra ýuwmagy we namaz okamagy buýurdy.",
      "Çyn ýürekden we düýpli tagallalardan soň, reňkli reňkli tegmiller ýa-da çykmajak birneme ys galsa, alymlaryň köpüsi hakykatdanam aýyrmak kyn bolan zady bahana edýärler - borjy tegmilsiz boýag kepillendirmek däl-de, maddany aýyrmak.",
      "Käbir hadysalaryň özlerine mälim bolan jikme-jiklikleri bar, meselem, ene süýdi bilen emdirilen bäbekiň peşewi (doly ýuwulman, sepilen, habar berilýän ýeňillikde) - şonuň üçin mekdebiňiziň ýüzbe-ýüz bolýan ýagdaýlary üçin amaly kararlaryny öwreniň.",
    ],
    hadith: [
      {
        excerpt:
          "Geýimdäki aýbaşy gany barada: ony süpüriň, soňra suw bilen sürtüň, soňra ýuwuň we namaz okaň. (Asma bint Abi Bakr)",
      },
    ],
    actions: [
      "Iň azyndan bir arassa eşik namaz üçin goýuň.",
      "Hapa eşikleriňizi öýden uzakda saklasa, edip biljek zatlaryňyzy ýuwuň we mümkin boldugyça üýtgediň.",
    ],
  },
  {
    title: "Bedeni arassalamak",
    summary: "Bedeniň hapalaryny aýyrmak, istinja we arassaçylyk düzgünleri.",
    body: [
      "Bedeniňdäki hapalar, namazdan öň, adamyň ukybyna görä ýuwulmalydyr. Mostygy-ýygydan hajathana ulanylandan soň özüni arassalamak - istinja - suw bilen ýa-da ýeriň arassa bolýança laýyk gury material bilen edilýär. Resul alaýhyssalam özüni rahatlandyrandan soň seresaply arassalamagy öwretdi we sag eliňi ulanmagy gadagan etdi.",
      "Yslam hapalygy ýok etmekden başga-da, bedeni arassa we ybadat etmäge taýyn tebigy arassaçylyk (fitra) esaslaryny höweslendirýär: dyrnaklary kesmek, aşaky we aşaky saçlary aýyrmak we şuňa meňzeşler.",
      "Bu amallar diňe bir medeni aýratynlyklar däl-de, bir imanlynyň Allanyň öňünde doga edip görkezýän mertebesiniň we arassalygynyň bir bölegidir.",
    ],
    hadith: [
      {
        excerpt: "Pygamberimiz reli özüni köşeşdirenden soň suw bilen arassalaýardy. (Anas)",
      },
    ],
    actions: [
      "Hajathanany ulananyňyzdan soň elmydama taharetden öň istinja dolduryň.",
      "Syýahat wagtynda dokumalary we mümkin boldugyça suw serişdesini göteriň.",
    ],
  },
  {
    title: "Namaz ýerlerini arassalamak",
    summary: "Namaz mekany belli hapalardan azat bolmaly - esassyz şübhesiz.",
    body: [
      "Namaz okalýan ýeri belli najasadan azat bolmalydyr. Pygamberimiz muny aç-açan öwretdi: bir beduin metjidiň burçunda peşew edeninde, sahabalara berk käýinmegini bes etdi, gutardy we soňundan bir bedre suw guýmagy buýurdy - arassalygy we ýumşaklygy öwretdi.",
      "Dolandyryş düzgüni şübhesiz. Umuman, namaz okalýan ýer edilipdi, şonuň üçin hapanyň hakyky subutnamasy bolmasa, bir ýer arassa hasaplanýar. Haramlygyň bardygyny bilýän bolsaňyz, aýyryň ýa-da arassa ýere geçiň; diňe şol ýerde bolup biljekdigini göz öňüne getirseňiz, pyşyrdy äsgermezlik ediň we dowam ediň.",
      "Bu deňagramlylygy goraýjylar iki tarapdan ybadat edýärler: aç-açan toprakda biperwaý doga etmek we her bir ýere esassyz şübhe sebäpli ysmaz.",
    ],
    hadith: [
      {
        excerpt:
          "Bir beduin metjide peşew edeninde, Pygamber a onuň üstüne bir bedre suw guýmagy buýurdy. (Abu Hureýra)",
      },
    ],
    actions: [
      "Namazdan öň düşegiňize we polyňyza göz aýlaň.",
      "Hapalygyň hakyky subutnamasyz, esassyz düşünişmezlikleri taşlaň we doga ediň.",
    ],
  },
  {
    title: "Hayd we arassalyk",
    summary:
      "Aýbaşydan we dogrumdan soňky gan akma özleriniň arassalamak kararlaryny ýerine ýetirýär.",
    body: [
      "Aýbaşy (ot) we dogrumdan soňky gan (nifas) wagtynda bir aýal namaz okamaýar we diniň rehimdarlygy bilen şol döwürde sypdyrylan dogalar soň okalmaýar. Bu çözüldi: Aýşadan aýbaşydan gelýän aýalyň näme üçin agyz bekleýändigini, ýöne namazlaryny okamaýandygyny soranlarynda, bu olaryň buýrulandygyny tassyklady.",
      "Oraza başgaçarak: Remezanda aýbaşy sebäpli sypdyrylan orazalar soň namaz okalýar. Gan gutaranda we arassalygyň alamaty peýda bolanda, aýal taharet okaýar we namazyny we agyz beklemegini dowam etdirýär.",
      "Ot we nifleriň iň pes we iň ýokary dowamlylygy, arassalygyň alamatlaryny nädip okamalydygy mekdepleriň jikme-jik tapawutlanýan meseleleri. Aýallar ökde mugallym bilen bir ygtybarly mekdebiň amaly kararlaryny öwrenmekden peýdalanýarlar.",
    ],
    hadith: [
      {
        excerpt:
          "Aýbaşydan gelýän aýalyň näme üçin agyz bekleýändigini, ýöne namaz okamaýandygyny soranlarynda, Aýşa: oraza tutmagy buýurdyk we namaz okamagy buýurmadyk. (Muadha, Aýşadan; şeýle hem Sahih Musulman 335)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Freygy-ýygydan soralýan soraglar",
    summary: "Iň ýaýran arassalama aladalaryna we şübhelerine gysga jogaplar.",
    body: [
      "Şübhe meniň taharetimi bozýarmy? No.ok. Eger taharet eden bolsaňyz we ony bozandygyňyzy bilmeýän bolsaňyz, taharetiňizi kesgitleýänçäňiz taharetiňiz dur. Şübhe üstünde ynamly hereket etmek, sizi obsesif şübhelerden (waswas) goraýan pygamberlik ýörelgesidir.",
      "Çykyşlar, bintler we ýaralar hakda näme? Konsesiýalar bar. Coveredapyk agzany ýuwmak zyýanly ýerde, geýimini (maş 'ala al-jabirah) süpürip bilersiňiz, taýammum ýetip bolmajak zady öz içine alýar - jikme-jiklikler mekdep we ýagdaý boýunça üýtgeýär.",
      "Suwy düýbünden ulanyp bilmeýän bolsam näme? Arassa toprakly Taýammum, suw ulanmak ukyby gaýdýança doly güýje girýär.",
      "Dowamly ýagdaýlar - üznüksiz gan akma (istihadah) ýa-da nägilelik hakda näme? Adama hemişe bahana (ma'dhur) bilen seredilýär: özlerini arassalaýarlar we her doga wagty taharet edýärler, soňam akyş dowam etse-de doga edýärler we bu doganyň güýjüni ýitirmeýär.",
    ],
    actions: [
      "Ybadatyňyzy yzygiderli şübhelenmäge ýol bermäň - şübhelenmäň, takyklyga eýeriň.",
      "Dowamly şertler ýa-da çylşyrymly ýagdaýlar üçin ökde alymdan şahsy karar alyň.",
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Bu sowal jogaplary şahsy fatwa däl-de, bilim jemlemeleri. Çylşyrymly ýa-da dowamly ýagdaýlary ýerli alym bilen gözden geçirmeli.",
  },
  {
    title: "Salgylar we goşmaça okuw",
    summary: "Arassalanmak baradaky Gurhanyň esasy aýatlary we hadys bölümleri.",
    body: [
      "Arassalanmak üçin Gurhanyň esasy teksti taharet, taharet we taýamumy bilelikde jemleýän taharet aýaty, Maida süresi 5: 6; gapdalynda 2: 222 ('Allah özüni arassalaýanlary söýýär') we suwuň arassalygy baradaky aýatlar (25:48) bu mowzugy goldaýar.",
      "Sünnetde esasy çeşmeler Sahih al-Buhari we Sahih Musulmany açýan Arassalaýyş kitaplary (Kitab al-Taharah / al-Ghusl / al-Haýd) bolup, dört Sünanda (Abu Dawud, Tirmizi, an-Nasa'i, Ibn Majah r) ýygnaýar.",
      "Amaly kararlar üçin dört sünni mekdebiniň nusgawy fykh gollanmalarynda jikme-jik pozisiýalar berilýär we olaryň tapawudy kemçilik däl-de, däp-dessuryň kanuny bölegi. Düzülen syn üçin bu moduly ulanyň, soňra ökde mugallym we başlangyç tekstler bilen okuwyňyzy çuňlaşdyryň.",
    ],
    quran: [{}, {}],
    hadith: [
      {
        excerpt: "Kolleksiýany açýan taharet, taharet, taýamm we ot hakda giňişleýin bölümler.",
      },
      {
        excerpt:
          "Arassalamak kitaby - taharanyň hökümleri, edepleri we ýörelgeleri barada hakyky hasabatlar.",
      },
    ],
    actions: [
      "Pytraňňy kararlardan bulaşmazlyk üçin bir ynamdar okuw meýilnamasyna eýeriň.",
      "Amaly ynam durnukly bolýança bu temalary wagtal-wagtal gözden geçiriň.",
    ],
    appLinks: [{}, {}],
  },
];

export const TAHARAH_CHECKLIST_TK: DeepPartial<TaharahChecklistItem>[] = [
  {
    title: "Fajrdan öň taharet",
    hint: "Mümkin boldugyça güni arassa ýagdaýda başlaň.",
  },
  {
    title: "Dişleri ýuwmak / çotmak",
    hint: "Taharetden öň we namazdan öň sünnet.",
  },
  {
    title: "Namazdan boş doga eşikleri",
    hint: "Namazdan öň görünýän haramlygy barlaň.",
  },
  {
    title: "Arassa doga ýeri",
    hint: "Namaz okaýan ýeriňizden haram zatlary aýyryň.",
  },
  {
    title: "Taşlaýjylardan soň tahareti täzeläň",
    hint: "Windel, uky, hajathana - taharetiň nämäni bozýandygyny biliň.",
  },
  {
    title: "Talap edilende Gusl",
    hint: "Esasy haramlykdan soň, aýbaşy gutarýar ýa-da dogrumdan soňky gan akma.",
  },
];
