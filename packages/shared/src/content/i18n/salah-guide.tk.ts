// Turkmen translation overlay for the Learn Salah guide content. Mirrors the order of
// its English source in ../salah-guide*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { SalahGuidePhrase, SalahGuideTopic } from "../../types/salah-guide";
import type { DeepPartial } from "./localize";

export const SALAH_GUIDE_TOPICS_TK: DeepPartial<SalahGuideTopic>[] = [
  {
    title: "Namaz näme?",
    summary: "Yslamyň ikinji sütüni - Alla bilen gündelik duşuşygyňyz.",
    body: [
      "Namaz, Allanyň her bir imanly üçin bellän resmi ybadatydyr: her gün bäş gezek ýerine ýetirilýän öwgi, Gurhan we dileg sözlerine goşulan, durýan (kyýam), baş egmek we sejde etmek (sujud). Namaz sözi baglanyşyk we ýalbarmak manysyny berýän arap kökünden gelip çykýar - bu imanlynyň Creatoraradana göni, araçy setiridir, ruhany we şepagatçy gerek däl.",
      "Doga-dilegiň doly birligi - ikinji sejde edilýänçä rekagat diýilýär. Namazlar rakalarda hasaplanýar: Fajr iki, Magrib üç, Dhuhr, Asr we Işa dört. Hökmany dogalara farz diýilýär; Pygamberimiziň yzygiderli doga edýän goşmaçalary sünnetdir we erkin okalýan goşmaça dogalar namazdyr.",
      "Sütünleriň arasynda özboluşly namaz, ýere inen bir perişde arkaly aýan edilmedi, ýöne gijeki syýahatda (al-Isra 'wa al-Miýraj) asmandan direlende göni Pygambere emr edildi. Ilki bilen doga-dileg edildi, soň bolsa pygamberiň ymmatyna rahatlyk gözleýän gaýta-gaýta gaýdyp gelmegi bilen, elli sylagy saklamak bilen amalda ýerine ýetirilen bäşlige çenli azaldyldy.",
      "Şonuň üçin namaz yslam durmuşynyň merkezinde oturýar: günde bäş gezek gaýtalanýar, ýüregi Allaha berkitmek üçin iş, dynç alyş we dynç alyş kesilýär we bu guluň kyýamat güni jogapkärçilige çekiljek ilkinji işidir. Ses tapylsa, ýazgylaryň galan bölegi yzarlanýar.",
    ],
    quran: [
      {
        excerpt:
          "Göze görünmeýänlere iman edýänler, doga edýärler we olar üçin üpjün eden zatlarymyzy harçlaýarlar.",
      },
      {
        excerpt:
          "Kitapda size aýan edilenleri okaň we doga ediň. Hakykatdanam, doga ahlaksyzlykdan we nädogry hereketlerden saklanýar we Allany ýatlamak has uludyr.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Gijeki syýahatda Allah elli doga etmegi emr etdi; Pygamberimiz five bäş ýaşyna çenli kömek sorap gaýdyp geldi - 'Bular bäş, elli, sebäbi meniň bilen söz üýtgemeýär.' (şeýle hem Sahih Musulman 162)",
      },
      {
        excerpt:
          "Hyzmatkäriň kyýamat güni jogapkärçilige çekiljek ilkinji zady, onuň dogasydyr; dogry bolsa, galan amallary dogry. (şeýle hem Abu Dawud 864, an-Nasa'i 3991)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Näme üçin Namaz?",
    summary: "Gündelik bäş doganyň ruhy, ahlak, psihologiki we baky miweleri.",
    body: [
      "Namaz Allah bilen göni söhbetdeşlikdir. Duran ýerinde, Özüniň açan sözleri bilen Oňa ýüzlenýärsiň; sejde etmekde - iň pespälligiň duruşy - siz Oňa iň ýakyn we size jogap berilmegi ähtimal. Başga hiç bir ybadat beýle ýygy-ýygydan ýa-da ýakyn gaýtalanmaýar.",
      "Ilkinji miwesi saklanan, tertipli ruh. Allanyň Özi, doganyň dogry ýola goýlanda 'ahlaksyzlykdan we nädogry hereketlerden saklanýandygyny' aýdýar (29:45): günde bäş gezek Allanyň huzurynda duran adama günäniň ýakynlaşmagy kyn bolýar. Mundan başga-da, birnäçe gezek arassalanmakdyr - Pygamberimiz, bäş namazy akýan derýa bilen deňeşdirdi, derýa her gün bäş gezek ýuwunýar, hapa yz galdyrmaýar.",
      "Ikinji miwesi içki rahatlykdyr. Gurhan ýürekleriň Allany ýatlamakda dynç aljakdygyny wada berýär we Pygamber aladasyz pursatlarda namaz okamaga 'Eý Bilal, bize rahatlyk ber' diýer. Gözleriniň lezzetini namazda goýlandygyny aýtdy.",
      "Jemgyýet we ebedi miweleri suraty tamamlaýar: jemagat namazynyň derejesi baý we garyplary bir hatara düzýär we doganlygy ösdürýär, şol bir wagtyň özünde namazy goramak Allanyň bagyşlamagyna we Jennete barýan iň ygtybarly ýollaryň biridir. Resul alaýhyssalam, Fajr we Asryň iki 'salkyn' dogasyny goraýanlara Jennete söz berdi.",
    ],
    quran: [
      {
        excerpt:
          "Hakykatdanam, men Allah. Menden başga hudaý ýok, şonuň üçin Maňa ybadat ediň we ýatlamam üçin doga ediň.",
      },
      {
        excerpt: "Hakykatdanam imanlylar - dogalarynda kiçigöwünliler üstünlik gazanýarlar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "'Eger biriňiziň gapyňyzda günde bäş gezek ýuwunýan derýa bar bolsa, onda hapa galarmy?' Olar: 'Noneok' diýdiler. Ol: \"Bäş doganyň meňzeşligi - Allatagala olar bilen günäleri süpürýär\" diýdi. (şeýle hem Sahih Musulman 667)",
      },
      {
        excerpt: "Kim iki salkyn doga okasa - Fajr we Asr - Jennete girer.",
      },
      {
        excerpt:
          "Dünýäňizden maňa söýgüli edilen aýallar we atyrlar, gözlerimiň salkynlygy doga edildi.",
      },
    ],
    actions: [
      "Häzirki wagtda diňe bir doga wagtynda doly doga ediň - kämillik däl-de, yzygiderlilik ilkinji maksatdyr.",
      "Size jogap beriljekdigini duýmak üçin indiki namazyňyzdan öň bir gezek Fatihanyň manysyny okaň.",
      "Adhan ýatlatmalaryny açyň, şonuň üçin hiç bir doga penjiresi gözden geçmez.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yslamdaky derejesi",
    summary: "Diniň sütüni - äsgermezlik etmek üçin iň uly iş.",
    body: [
      "Pygamberimiz Yslam Yslamyň bäş sütüniň üstünde gurlandygyny, namazyň bolsa iki imandan soň derrew ikinji bolandygyny aýtdy. Şaýatlyk sizi yslam dinine kabul edýär; doga, şaýatlygyň ýüregiňde ýaşaýandygynyň subutnamasydyr. Şonuň üçin alymlar namazy 'diniň sütüni' diýip atlandyrýarlar - merkezi sütüni bolmadyk jaý ýykylýar.",
      "Onuň agramy, tekstleriň oňa üns bermezlik hakda aýdanynda görünýär. Gurhan 'namazy äsgermezlik edip, islegleri yzarlaýan' we olaryň heläk boljakdygyny öňünden aýdýan nesle duýduryş berýär we Pygamber alaýhyssalam namazy imany ynamsyzlygy tapawutlandyrýan äht hökmünde häsiýetlendirýär.",
      "Namazdan ýüz öwürýän adamyň höküminde sünni alymlarynyň arasynda belli we hormat goýulýan tapawut bar. Käbir adamlar muny bilgeşleýin terk etmek - hökmanydygyny tassyklamak bilen bir adamy yslamdan kowýan uly ynamsyzlyk hasaplaýarlar; köplük (Hanafi, Maliki, Şafi) beýle adamyň borçlaryny inkär etmese, iň uly günäleriň birinde günäkär musulman bolup galýandygyny öňe sürýär. Hemmeler namazdan ýüz öwürmegiň betbagtçylykdygyny we kim öz borjuny inkär etse, yslamdan ylalaşyk bilen gidendigi bilen ylalaşýarlar.",
      "Amaly sapak her nukdaýnazardan deňdir: gündelik bäş namazy goramak imanly üçin hökmany ýa-da gepleşik däl. Meýletin dogalar (sünnet we nafl), kyýamat güni farz namazlarynda kemçilikleri düzüp, howpsuzlyk toruny ýerine ýetirýär.",
    ],
    quran: [
      {
        excerpt:
          "Namazlary we orta namazy seresaplylyk bilen saklaň we yhlas bilen Allanyň huzurynda duruň.",
      },
      {
        excerpt:
          "Emma olaryň yzyndan namazy äsgermezlik edip, islegleri yzarlaýanlar geldi. ýamanlyga garşy durjak bolýarlar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Yslam bäşlige esaslanýar: Alladan başga hudaýyň ýokdugyna we Muhammediň Resulydygyna şaýatlyk edip, namazyny okaýar, zekat, haja we oraza tutýar. (şeýle hem Sahih al-Buhari 8)",
      },
      {
        excerpt:
          "Biziň bilen olaryň arasyndaky äht doga; kim muny terk etse, imansyzlyk etdi. (Buraýda; an-Nasa'i, Ibn Majah 1079)",
      },
      {
        excerpt:
          "Ynsan bilen imansyzlyk bilen butparazlygyň arasynda namazyň terk edilmegi dur. (Jabir)",
      },
    ],
    disclaimer:
      "Alymlar ýaltalygy sebäpli namazdan ýüz öwürýän (köpler üçin uly günä; başgalara ynanmazlyk) bilen borçlaryny inkär edýän (ylalaşyga ynanmazlyk) bilen takyk hökümde tapawutlanýar. Bu programma haýsydyr bir adama höküm çykarmaýar - şahsy ýagdaýlar üçin ökde alym bilen maslahatlaşyň.",
  },
  {
    title: "Kim doga etmeli?",
    summary:
      "Her bir akylly, uly ýaşly musulman - anyk kesgitlenen boşatmalar we ýeňillikler bilen.",
    body: [
      "Namaz akylly we kämillik ýaşyna ýeten her bir musulman üçin farz bolýar. Üç topar jogapkärçilikden doly hakyky ýörelge bilen aýrylýar: uklaýança, uklaýança, çaga ulalýança we akyl sebäpleri gaýdyp gelýänçä akyl taýdan ukypsyz.",
      "Çagalar entek borçly däl, ýöne kem-kemden tälim alýarlar. Pygamberimiz children çagalara ýedi ýaşyndan doga etmegi we on ýaşynda äsgermezlik edendigi üçin ýumşak tertip-düzgüni bermegi buýurdy - kämillik ýaşyna ýeten namazyň duýdansyz ýük däl-de, eýýäm öwrenişen endigi bolmagy.",
      "Aýbaşydan (otdan) ýa-da dogrumdan soňky gan (nifas) aýallar doga etmeýärler; sypdyrylan farz dogalary soň okalmaýar - alymlar tarapyndan ylalaşylan rehim we karar. (Doga-dileglerden tapawutlylykda, ýitirilen orazalar düzülýär.) Aýal gan dökülenden soň namazyny dowam etdirýär we taharet bilen arassalanýar.",
      "Hakyky ukypsyzlyk eglişik getirýär, hiç haçan ýatyrylmaýar: agyr kesel, huşsuzlyk we aşa gorky adamy belli bir wagta çenli bagyşlap biler, hassalar bolsa ukyplaryna görä doga edýärler - oturmak, ýalan sözlemek ýa-da yşaratlar bilen. Syýahat namazy aýyrmaýar, ýöne syýahat gollanmasynda görkezilen gysgaltmak (kasr) we birleşdirmek (jam) arkaly ýeňilleşdirýär.",
    ],
    hadith: [
      {
        excerpt:
          "Çagalaryňyza ýedi ýaşyndaka doga etmegi buýruň we on ýaşynda olara tertip-düzgün beriň we ýatýan ýerlerini aýyryň. ('Amr ibn Şuaýb kakasyndan kakasyndan)",
      },
    ],
    quran: [
      {
        excerpt: "Maşgalaňyza doga etmegi buýruň we onda berk boluň.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Namazdan öň şertler",
    summary: "Namazyň dogry bolmagy üçin bolmaly dokuz şert (şurut).",
    body: [
      "Namazyň dogry bolmagyndan ozal käbir şertler (şerut al-Namaz) berjaý edilmelidir. Sütün sütünden tapawutlanýar: şertler başlamazdan we dowam etmezden öň gelýän şertler, sütünler (arkan) doganyň bir bölegi. Zerur şert ýok bolsa, doga näçe gowy ýerine ýetirilse-de kabul edilmeýär.",
      "Bu dokuzy uçuşdan öňki gözegçilik sanawy diýip pikir ediň. Köpüsi bu gollanmanyň başga bir ýerinde has doly sapaga birikýär - hersini çuňňur öwrenmek üçin basyň. Olardan ikisi (kybla garşy we dogry wagt) hakyky ukypsyzlygy üçin bahana bolup biler; galanlary, haçan başarsa, berk talap edilýär.",
    ],
    steps: [
      {
        title: "Yslam",
        body: "Namaz musulmanyň eden işidir; musulman dälleriň yslama girýänçä kanuny ýa-da hökmany däldir.",
      },
      {
        title: "Sagdyn pikir ('aql)",
        body: "Adam esasly bolmaly. Akylyny ýitiren adam, şol ýagdaýda bolanda jogapkärçilik çekmeýär.",
      },
      {
        title: "Zehin (tamyiz)",
        body: "Tapawutlandyrmak ukyby, ýedi ýaşa ýetdi - çagalaryň doga etmeli ýaşy.",
      },
      {
        title: "Ujypsyz we uly haramlygy aýyrmak (hadysdan tahara)",
        body: "Suwy ulanyp bolmaýan taharet, ýa-da taharet, ýa-da tausmum.",
      },
      {
        title: "Hapany aýyrmak (najasah)",
        body: "Beden, geýim we namaz okalýan ýer peşew, mukdarda gan we beýleki sanalan maddalar ýaly däp-dessurlardan azat bolmalydyr.",
      },
      {
        title: "Awrany ýapmak",
        body: "Coveredapylmaly bölekler arassa, aç-açan eşikler bilen örtülendir - Egin-eşik we awrah sapagyna serediň.",
      },
      {
        title: "Namaz wagty geldi",
        body: "Her namazyň kesgitlenen penjiri bar; wagty başlamazdan doga etmek nädogrydyr. Tertibiňizi we ýatlatmalaryňyzy ulanyň.",
      },
      {
        title: "Kybla bilen ýüzbe-ýüz bolmak",
        body: "Kesgitläp bilşiňiz ýaly Käbä tarap öwrülmek - diňe hakyky ukypsyzlygy sebäpli bahana.",
      },
      {
        title: "niýet",
        body: "Haýsy dilegi etjekdigiňi ýüregiňde çözmek. Bu içki hereket we gaty ses bilen aýdylmaýar.",
      },
    ],
    appLinks: [{}, {}, {}],
    disclaimer:
      "Mekdepler şertleri birneme başgaça hasaplaýarlar we hasaplaýarlar (käbirleri şertleri däl-de, sütünleriň arasynda niýh sanawy). Bu madda ylalaşyldy.",
  },
  {
    title: "Arassalamak",
    summary: "Özüňi, eşigiňi we ýeriň arassalygy - her doganyň gapysy.",
    body: [
      "Tahara, arassaçylyk ýagdaýynda Allanyň huzurynda durmak üçin däp-dessurlary ýok etmegi aňladýar. Allah özüni arassalaýanlary söýýär we Pygamber alaýhyssalam 'arassalanmak imanyň ýarysy' diýip öwretdi. Onsuz hiç bir doga kabul edilmez.",
      "Haramlyk iki görnüşlidir. Hajathana ulanmak ýa-da ýeliň geçmegi ýaly zatlar sebäpli dörän ownuk haramlyk (hadys asgar) taharet bilen göterilýär. Esasy haramlyk (hadys akbar ýa-da janabah) - ýakynlykdan, eýakulýasiýadan ýa-da aýbaşydan we dogrumdan soňky gan akmadan soň - doly däp-dessur wannasy (ghusl) bilen aýrylýar.",
      "Bu däp-dessurlardan aýratynlykda, peşew, damjalar, akýan gan we şuňa meňzeşler ýaly göze görnüp duran hapalar (beden), eşiklerden we doga edýän ýeriňizden fiziki taýdan aýrylmalydyr. Dogry taharetiň bolmagy mümkin, ýöne namaz okamazdan öň eşikleriňizdäki tegmilleri arassalamaly.",
      "Suw esasy arassalaýjydyr. Haçan-da suw hakykatdanam elýeterli däl bolsa ýa-da kesel ýa-da sowuk sebäpli size zyýan ýetirse, yslam tayammuma - arassa topragy ulanyp gury arassalamaga doly ornuny berýär. Arassalanmak hiç wagt kynçylyk diýmek däldir; ýakynlaşmagyň serişdesidir.",
    ],
    hadith: [
      {
        excerpt: "Arassalamak imanyň ýarysydyr ... (Abu Malik al-Aşari)",
      },
    ],
    quran: [
      {
        excerpt: "Hakykatdanam, Allah hemişe toba edýänleri we özüni arassalaýanlary söýýär.",
      },
    ],
    actions: [
      "Her agzyňyz dogry ýuwulmagy üçin indiki doganyňyzdan öň tahareti öwreniň.",
      "Hapa ýerlerde işleýän bolsaňyz, namaz okamak üçin arassa eşik saklaň.",
      "Düşek goýmazdan ozal görünýän hapalar üçin doga ýeriňize göz aýlaň.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Taharet - taharet",
    summary: "Ujypsyz haramlygy aýyrýan we namaz okamaga sargyt edilen ýuwmak.",
    body: [
      "Taharet, ownuk haramlygy aýyrýan adaty ýuwmakdyr. Öňki namazdan öňki ýagdaýyňyzda däl bolsaňyz we alymlaryň köpüsiniň pikiriçe, Gurhanyň fiziki tekstine degmezden ozal her namazdan öň talap edilýär. Dört farz ýuwulmagy göni Gurhanda (5: 6) atlandyrylýar: ýüzi, tirsegine gollar, kelläni süpürmek we aýaklary topuklara süpürmek.",
      "Pygamberimiz, ýuwulan agzalar üçin üç gezek taharet düzdi, gowy, ýöne suw ýitirmän - akýan derýada-da isripçiligiň öňüni aldy. Dört hökmany amaldan başga-da, agzyňy we burnuňy ýuwmak, ilki bilen elleri ýuwmak we miswak ulanmak tahareti tamamlaýan we owadanlaşdyrýan sünnetlerdir.",
      "Onuň sogaby ummasyzdyr: Pygamber a imanly adamyň her bir agzasyny ýuwmagy bilen, şol agzanyň eden günäleriniň suw bilen, hatda dyrnaklaryň aşagyndanam arassalanyp çykjakdygyny öwretdi. Şonuň üçin taharet diňe bir resmi däl, her dogadan öň kiçijik bagyşlamakdyr.",
      "Taharet şahsy böleklerden (peşew, tabak, ýel) çykýan islendik zat, habardarlygy aýyrýan çuňňur uky we huşuňy ýitirmek bilen bozulýar. Namaz wagtynda bozulsa, tahareti täzelemeli we namazy täzeden başlamaly.",
    ],
    steps: [
      {
        title: "Niýet we Bismillah",
        body: "Wudu ýüregiňize niýetläň we 'Bismillah' bilen başlaň. Niýet içindedir we sesini çykarmaly däl.",
        tip: "Mümkin bolan wagty miswak (siwak) ulanyň - Pygamberimiz söýýän we hökmany diýen ýaly sünnet.",
      },
      {
        title: "Elleri ýuwuň",
        body: "Iki eliňizi bilege üç gezek ýuwuň, barmaklaryň arasynda işleýän suw.",
      },
      {
        title: "Agzy ýuwuň",
        body: "Agzyňyza suw alyň, ýuwuň we kowuň - üç gezek.",
      },
      {
        title: "Burnuny ýuwuň",
        body: "Sag eliňiz bilen burnuňyza suw çekiň we çep bilen çykaryň - üç gezek.",
      },
      {
        title: "Faceüzüňi ýuw (fard)",
        body: "Hairüzüňizi saçdan eňege we gulakdan gulaga çenli bir-üç gezek ýuwuň; bir adam galyň sakgally çygly barmaklary ylgaýar.",
      },
      {
        title: "Gollary ýuwuň (fard)",
        body: "Sag eliňizi, soňra çepe, barmaklaryňyzyň ujundan tirseklere çenli we hersi üç gezek ýuwuň.",
      },
      {
        title: "Kelläni süpüriň",
        body: "Çygly eller bilen kelläni öňden yza we yza süpüriň, soňra gulaklaryň içini we arkasyny şol bir çyglylyk bilen süpüriň.",
      },
      {
        title: "Aýaklary ýuwuň (fard)",
        body: "Sag aýagy, soňra çepe, topuklara we şol sanda ýuwuň - hersi üç gezek barmaklaryň arasyndan barmaklary geçip.",
      },
      {
        title: "Iman hakda şaýatlyk",
        body: "Dua bilen tamamlaň: 'Aşhadu an la ilaha illallah ...' - taharetden soň kim diýse, Jennetiň sekiz derwezesi açylýar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Hyzmatkär ýüzüni taharetde ýuwanda, gözleri bilen gören her bir günäsi suwdan çykýar ... günäden saplanýança.",
      },
    ],
    quran: [
      {
        excerpt:
          "Eý iman edenler, namaz okamak üçin turanyňyzda ýüzüňizi we biliňizi tirsegiňize ýuwuň, kelläňizi süpüriň we aýaklaryňyzy topuklara ýuwuň.",
      },
    ],
    actions: [
      "Tirsekleri we topuklary barlap, her ädimi sesli okaňda ýuwaş-ýuwaşdan ýerine ýetiriň.",
      "Taharetden soň gysga duany ýatda saklaň - Salahyň sözlerine serediň.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Egin-eşik we awra",
    summary: "Coveredapylmaly zatlary ýapyň - arassa, sada we hormat bilen.",
    body: [
      "Awranyň üstüni ýapmak - bedeniň gizlenmeli bölekleri - Allanyň 'her namazyň bezegini bezemek' buýrugyndan alnan dogry doganyň şertidir (7:31). Egin-eşikler najasadan arassa bolmaly we deriniň reňkini görkezmeýän derejede açyk bolmaly.",
      "Erkekler üçin dogadaky awra, iň bolmanda göbekden dyzyna çenli. Şeýle-de bolsa, egin-eşik bar wagty ýalaňaç doga etmek halamaýar; Resul alaýhyssalam, bir adamyň egninden bir bölegi bolmazdan ýekeje eşikde doga etmeli däldigini aýtdy.",
      "Alymlaryň köpüsiniň pikiriçe, aýallar üçin ýüz we ellerden başga tutuş beden namazda namaz okaýar; aýal saçlaryny, boýnuny we aýaklaryny ýapýar, adatça boş eşik we hijap bilen. Alymlar aýaklaryň üstünde tapawutlanýar, käbirleri görkezilip bilinjek zatlara goşulýar diýip hasaplaýarlar - olar bilen doga etmek has ygtybarly we köplükdir.",
      "Iki geýim hökümi daşarda namazyň daşyndadyr: erkekleriň geýmegi ýüpek we altyn (aýallara rugsat berilýär), geýimler gaty berk, gödek ýa-da ünsli bolmaly däldir, şonuň üçin namazyň talaplaryny ýeňip geçer. Düzgün bolşy ýaly, gijeki eşikler ýa-da plýa beach eşikleri däl-de, hormatlaýan biri bilen tanyşmak üçin geýjek zadyňyzda doga ediň.",
    ],
    quran: [
      {
        excerpt: "Eý, Adam atalar, bezegleriňizi namazlaryň her ýerinde alyň.",
      },
    ],
    actions: [
      "Elmydama taýyn bolar ýaly bir arassa, sada eşik ýa-da ýörite doga eşigini goýuň.",
      "Bir zadyň ýeterlikdigini ýa-da ýokdugyny bilmeseňiz, az däl-de, has köp ýapyň.",
    ],
    disclaimer:
      "Awranyň jikme-jiklikleri (esasanam aýalyň aýaklary) hormat bilen alymlaryň tapawudydyr. Tapawutly ýeriňizde ygtybarly ýerli stipendiýa eýeriň.",
  },
  {
    title: "Namaz wagtlary",
    summary: "Gündelik bäş penjire - her namazyň başlangyjy, soňy we islenýän pursaty bar.",
    body: [
      "Allatagala namazlary “belli wagtlarda” belledi (4: 103), gije-gündiz günüň hereketi bilen baglanyşykly bäş penjire böldi. Penjiräni açmazdan öň doga etmek nädogrydyr; bahana bilen namazyny penjireden yza çekmek çynlakaý günädir. Mümkin boldugyça penjireden ir dileg ediň - Pygamber alaýhyssalam ilkinji gezek Allaha iň söýgüli amallaryň arasynda doga etdi.",
      "Bäş penjire: Fajr, hakyky daňdan gün dogýança; Dhuhr, günüň iň zenitinden geçýän bir zadyň kölegesi öz uzynlygyna deň bolýança; Asr, Dhuhryň ahyryndan gün ýaşýança (gün ýaşmazdan ozal iň gowy dileg edilýär); Magrib, gün ýaşandan tä gyzyl garaňkylyk öçýänçä; we Işa, garaňkylygyň ýitip gitmeginden tä daň atýança (ýary gijeden öň iň gowy dileg).",
      "Ybadat hiç wagt güne çokunmak bilen garyşmaz ýaly üç sany gysga döwür bar: gün dogýança, günüň dogýança, günortan iň ýokary nokadynda duranda we doly batýança gün ýaşanda. Geçirilen farz namazyny okamak, bu gadaganlykdan başga.",
      "Takyk sagat wagtlary giňişligiňiz we möwsümiňiz bilen her gün üýtgeýär, şonuň üçin Pygamber a olary belli bir sagat däl-de, tebigy alamatlar bilen baglanyşdyrdy. Programma olary ýerleşýän ýeriňiz üçin hasaplaýar - ýöne esasy alamatlary bilmek tehnologiýa elýeterli bolmadyk ýagdaýynda sizi esaslandyrýar.",
    ],
    steps: [
      {
        title: "Fajr - 2 rekagat farz",
        body: "Gün dogýança hakyky daň. Güýçli nygtalýan 2-rekagat sünnetinden öň.",
      },
      {
        title: "Dhuhr - 4 rekagat fard",
        body: "Gün Asr kölegesine çenli iň zenitinden geçenden soň. 4-den öň we 2-nji sünnet.",
      },
      {
        title: "Asr - 4 rekagat farz",
        body: "Dhuhryň ahyryndan gün ýaşýança; gün ýaşmazdan ozal dileg ediň. Köplenç 2: 238-iň “orta dogasy” bilen kesgitlenýär.",
      },
      {
        title: "Magrib - 3 rekagat farady",
        body: "Gün ýaşandan tä garaňky düşýänçä; derrew doga et. 2-nji sünnet.",
      },
      {
        title: "Işa - 4 rekagat fard",
        body: "Garaňky düşmekden daň atýança; ýary gijeden öň iň gowusy. Ondan soň Witr.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Pygamberimiziň pray doga etmegimizi gadagan eden üç gezek bar: gün dogýança, günortan duranda we gün ýaşýança. (Ukba ibn Amir)",
      },
    ],
    quran: [
      {
        excerpt: "Dogrudanam, iman edenlere doga belli bir wagt karary berildi.",
      },
      {
        excerpt:
          "Günüň iki ujunda we gijäniň golaýynda doga ediň. Dogrudanam, ýagşy amallar erbet işleri kowýar.",
      },
    ],
    appLinks: [{}, {}],
    disclaimer:
      "“Asr” -yň başlangyjynda iki sany habar bar (kölegäniň bir obýektiň uzynlygyna deň ýa-da iki gezek). Bularyň ikisi hem dogry; ýerli hasaplamalaryňyza we jemgyýetiňize eýeriň.",
  },
  {
    title: "Kybla bilen ýüzbe-ýüz bolmak",
    summary: "Mekgedäki mukaddes jaýa - ymmaty birleşdirýän ugra öwrüliň.",
    body: [
      "Kybla, Mekgedäki Masjid al-Haramyň içindäki Käbäniň ugry. Munuň bilen ýüzbe-ýüz bolmak dogry doganyň şertidir. Yslamyň başynda musulmanlar Iýerusalime tarap doga etdiler; Soňra Alla mukaddes metjide tarap öwrülmegi buýurdy we şondan bäri ýeke-täk ugur dünýäni ybadat edýänleri birleşdirdi - bir jemagatyň bir Rebbiň garşysyna gündelik, fiziki görnüşi.",
      "Gybla bilen dogry kesgitläp bilşiňiz ýaly takyk ýüzlenmeli - kompas, metjidiň mihraby, ygtybarly programma ýa-da syýahat edeniňizde gün we ýyldyzlar bilen. Ujypsyz, gutulgysyz gyşarmak bagyşlanýar; möhüm zat dogry ugra yhlasly tagalla etmekdir.",
      "Eger hakykatdanam ugruny kesgitläp bilmeýän bolsaňyz - deňizde, bulutda, gije nätanyş bir ýerde ýitirilen bolsaňyz - ony çözmäge çalyşýarsyňyz we iň gowy karara doga ediň; doga soňra birneme subut edilse-de dogrydyr. Hökmany namaz okamak üçin kybla bilen ýüzbe-ýüz bolup bilmeýän hereketli ulagda ýa-da uçarda, eliňizden gelenini edip bilersiňiz, sebäbi Allatagala kalbyňy artdyrmaýar.",
    ],
    quran: [
      {
        excerpt:
          "Şonuň üçin ýüzüňizi al-Masjid al-Harama öwüriň. Nirede bolsaňyzam, ýüzüňizi oňa öwüriň.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Namaz okamak üçin turanyňyzda tahareti gowy ýerine ýetiriň, soňra kybla ýüz tutuň we takbir diýiň. (erbet doga eden adamyň hadyslaryndan)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Adhan - doga çagyryşy",
    summary: "Ymmaty çagyrýan sözler, manylary we olara nädip jogap bermelidigi.",
    body: [
      "Adhan, doganyň wagtynyň gelendigini habar berýän çagyryşdyr. Bileleşik ybadat etmek üçin ýygnanan ýerinden berlen bäş gündelik namazyň (Gurban baýramy ýa-da jynaza namazy üçin däl) jemagat sünnetidir. Namazyň başlamazyndan ozal, ikinji, has gysga jaň - ikama.",
      'Adhany eşideniňizde, sünnet her bir jümläni mu\'adhdinden soň gaýtalamalydyr - "Haýýa" ala as-salahdan we "Haýýa" ala-falahdan başga, "La hawla wa la quwwata illa billah" diýýän ýeriňizde (Alladan başga güýç ýa-da güýç ýok). Fajr adhanda jaň edýän \'As-salatu khayrun min an-nawm\' goşýar (doga ukudan gowudyr).',
      "Azan gutarandan soň, Pygambere sallallahu aleýhi wesellem (sallallahu aleýhi wesellem) iberiň, soňra Alladan öwgüli wokzal (al-wasilah) bermegini haýyş edip döredilen du'any okaň - Pygamber alaýhyssalam muny aýdýanlara şepagat etjekdigini wada berdi. Adhan bilen Ykamanyň arasyndaky pursat, ýalbarmagyň yzyna öwrülmeýän wagtdyr, şonuň üçin du'any erkin ediň.",
    ],
    steps: [
      {
        title: "Allahu Akbar (× 4)",
        body: "Allatagala iň beýikdir - sizi ünsüňizi sowup biljek zatlardan beýikdir.",
      },
      {
        title: "Aşhadu an la ilaha illallah (× 2)",
        body: "Alladan başga hudaýyň ýokdugyna şaýatlyk edýärin.",
      },
      {
        title: "Aşhadu anna Muhammadan rasulullah (× 2)",
        body: "Muhammediň Allahyň Resulydygyna şaýatlyk edýärin.",
      },
      {
        title: "Haýýa ala as-Namaz (× 2)",
        body: "Namaza geliň. Jogap: La hawla wa la quwwata illa billah.",
      },
      {
        title: "Haýýa ala al-falah (× 2)",
        body: "Üstünlige geliň. Jogap: La hawla wa la quwwata illa billah.",
      },
      {
        title: "Allahu Akbar (× 2)",
        body: "Allah iň beýikdir.",
      },
      {
        title: "La ilaha illallah",
        body: "Alladan başga hudaý ýok ​​- çagyryş şol bir söz bilen ýapylýar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim bu jaňy eşidip: 'Eý, Allatagala, bu ajaýyp çagyryşyň we berk doganyň Rebbi, Muhammet alaýhyssalam we fazylet ber ...' diýse, kyýamat güni şepagatym bolar. (Jabir)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Stepdimme-ädim namaz",
    summary: "Rekanyň doly yzygiderliligi - her höküm edilen höküm.",
    body: [
      "Her doga bir gaýtalanýan bölümden - rakahdan gurulýar: siz durup okaýarsyňyz, baş egýärsiňiz, ýokary galýarsyňyz, iki gezek sejde edýärsiňiz we (namazyň ahyrynda) daşahud üçin oturyp, salam berýärsiňiz. Bir rekagaty gowy öwreniň we islendik namazy okap bilersiňiz, sebäbi has uzyn dogalar bu bölümi gaýtalaýar. Aşakdaky ädimler her bir hereketi tertipde, manylary bilen arap dilinde aýdyljak takyk sözleri we hereketiň sütün, talap edilýän hereket ýa-da maslahat berilýänligini görkezýän kiçijik bellik berýär.",
      "Alymlar namazyň amallaryny üç derejä bölýärler. Farz (sütün / rukn) wajypdyr: ony ýalňyşlyk bilen goýuň - namaz ýa-da şol rekagat namaz okalýança hakyky däldir. Wajyp (hökmany amal) farzdyr, ýöne birini ýatdan çykarsaň, namazy gaýtalamagyň ýerine ýatdan çykarmak (sujud as-sahw) bilen sejde edýärsiň. Sünnet maslahat berilýär we sylaglanýar, namaz doly we namazsyz bolýar. Fykh mekdepleri başga bir kategoriýada hereket edenlerinde, maslahatlar muny belläp geçýärler - bu üç esse araçäk, ylmy tapawudyň nusgawy ugurlaryndan biridir.",
      "Tutuşlygyna alanyňda, hiç haçan ýitirilmeli däl bir hil - tuma'ninah - ümsümlik: her duruşa doly ornaşmak, el-aýaklary dynç almak, dowam etmezden ozal. Pygamber alaýhyssalam üç gezek ýene-de doga edip: «Yzyňa doga et, çünki doga etmediň» diýip bir adamy iberdi, soň bolsa her ýagdaýda asuda bolmagy öwretdi. Takbir 'Allahu Akbar' bilen duruşlaryň arasynda hereket ediň we sejde edilýän ýere gözüňizi dikiň.",
      "Näçe raka, we oturan ýeriňiz: iki rekagat namazyň (Fajr we Juma'a) bir oturylyşy bar - ikinji rekagatdan soň iň soňky tahahud - soň salam. Üç rekagat namaz (Magrib) we dört rekagat namaz (Dhuhr, Asr, Işa) ikinji rekagatdan soň birinji, has gysga bir namaz okaýar, galan rekagat namazlary üçin duruň - olarda diňe Al-Fatihany okaň we goşmaça surah üçin oturyň.",
      "Bulutly ýa-da sessiz: Fatiha we süre Fajr, Juma'da we Magrib we Işanyň ilkinji iki rekagat namazynda sesli (jahri) okalýar; Duhrda we Asrda, Magribiň üçünji rekagatynda we Işanyň üçünji we dördünji rekagatlarynda sessiz (sirri) okalýar. Namazyň beýleki sözlemleriniň hemmesi - ruku we sujudyň tasbih, daşahhud we ş.m. ýuwaşlyk bilen aýdylýar. Aloneeke özi namaz okaýan biri sesli dogalarda sesli okap ýa-da pes edip biler; Ymamyň yzyndan gelýän bir adam, ymam sesli okaýarka diňleýär.",
      "Käbir goşmaçalar belli bir dileglere ýa-da pursatlara degişlidir. Witr dogasynda köpler soňky rekagatda Kunut okaýarlar - ýol görkezmek we goramak üçin dileg etmek üçin ellerini ýokary galdyrýarlar (belli bir söz 'Allahumma-hdini fiman hadayt…'). Kyn günlerde farz namazlaryna “Kunut an-Nazilah” goşulyp biler we mekdepler Fajrda duran Kunutdan tapawutlanýar. Eger giç (masbuq) ýygnaga goşulsaňyz, ymam bilen näme tutsaňyzam, namazyndan soň sypdyran rekagatlaryňyzy düzersiňiz. Mistakealňyşlyk bilen bir zat goşsaňyz ýa-da taşlasaňyz, sujud as-sahw gollanmasyna serediň.",
    ],
    steps: [
      {
        title: "1. Niýet we durmak (niýet we kiýam)",
        body: "Kybla bilen ýüzbe-ýüz boluň we dik duruň - durmak her kim üçin namaz okamagyň sütünidir. Haýsy dileg etjekdigiňizi ýüregiňize ornaşdyryň; niýet sesli aýdylýan söz däl-de, içerki çözgütdir.",
        tip: "Gözüňizi sujudyň ýerine dikiň we şol ýerde saklaň. Çyn ýürekden çydap bilmeýän her kim oturyp, soň ýalan sözleýär - doganyň özi hiç haçan taşlanmaýar.",
      },
      {
        title: "2. Takbiriň açylmagy (Takbirat al-Ihram)",
        body: "Elleriňizi egniňize ýa-da gulaklaryňyza galdyryň we takbir diýiň, soňra sag eliňizi döşüň üstünde goýuň. Munuň bilen doga başlaýar we adaty namaza we herekete salam gelýänçä gadagan edilýär.",
        translation: "Allah iň beýikdir.",
        tip: "Elleri (raf 'al-ýadayn) takbir bilen galdyrmak sütün däl-de, tassyklanan sünnetdir.",
      },
      {
        title: "3. Dileg açmak (Du'a al-Istiftah)",
        body: "Allanyň sözleriniň öňünde ýüregi rahatlandyrmak üçin gysga bir dileg ediň. Birnäçe hakyky sözler habar berilýär; iň ýaýranlardan biridir.",
        translation: "Alla, şöhrat we öwgi. Seniň adyň bagtly we beýikdir. Senden başga hudaý ýok.",
      },
      {
        title: "4. Taawwudh we Basmalah",
        body: "Şeýtandan Allaha gaçybatalga gözläň, soňra Fatihadan öň Basmaladan başlaň. Ikisem sesli dogalarda-da ýuwaşlyk bilen aýdylýar.",
        translation:
          "Men näletlenen Şeýtandan Allaha sygynýaryn. Rehimdar, esasanam rehimdar Allanyň ady bilen.",
      },
      {
        title: "5. Fatihany okaň",
        body: "Kitabyň açylyşyny her rekagatda okaň - 'Kitabyň açylyşyny okamaýan adam üçin doga ýok.' Ymam we ýalňyz ybadat edýän adam ony sesli dogalarda okaýar; bolmasa ýuwaşlyk bilen okalýar.",
        translation:
          "Rehimdar, esasanam rehimdar Allanyň ady bilen. Hemme öwgi älemleriň Rebbi bolan Allaha, bütinleý rehimdar, esasanam rehimdar, jeza gününiň hökümdary Allaha şükürdir. Biz ybadat edýäris we siz kömek soraýarys. Bizi göni ýoly - gahar gazananlaryň ýa-da azaşanlaryň däl-de, merhemet edenleriň ýoluna ugrukdyr.",
        tip: "Ondan soň 'Amin' diýiň (sesli dogalarda). Hanafis synpy, Gurhany sütün hökmünde, Al-Fatiha bolsa wajib hökmünde okaýar; köplük Al-Fatihanyň özi her rekagatda sütün bolup durýar.",
      },
      {
        title: "6. Bir süre ýa-da käbir aýat okaň",
        body: "Diňe ilkinji iki rekagatda gysga süre ýa-da birnäçe aýat bilen Al-Fatihaha eýeriň - mysal üçin Yhlas süresi ('Kul huwa Allahu ahad…'). Üçünji we dördünji rekagatlarda diňe Fatihany okaýarlar.",
        tip: "Oneeke ybadat edýän we ymam üçin maslahat berilýär; yzarlaýjy diňleýär. Hanafiler, ilkinji iki rekagatda bir süre goşmagyň wajypdygyny aýdýarlar.",
      },
      {
        title: "7. Baş egmek (ruku)",
        body: "'Allahu Akbar' diýiň we tekiz, tekiz arka, elleri dyzlaryny gysyp, üç gezek ýa-da ondanam köp wagtlap Rebbiňizi şöhratlandyryň.",
        translation: "Ajaýyp Rebbim şöhratdyr.",
        tip: "Dynç bilen saklanýan ýaýyň özi sütün; Onda okalýan tasbih sünnetdir (käbir mekdeplerde wajyp).",
      },
      {
        title: "8. Rukudan çykmak (i'tidal)",
        body: "Ymam we ýalňyz ybadat edýän, tasmi diýýän we tahmid diýýänleriň hemmesi dik duruň we aşak inmezden ozal doly duruň.",
        translation: "Allany öwýänleri Alla eşidýär. Lorda Reb, ähli öwgüler saňa degişlidir.",
        tip: "Göni we rahat ýagdaýda durmak sütün - bu ýerde mesgen tutýançaňyz sujuda çümmäň.",
      },
      {
        title: "9. Sejde (sujud)",
        body: "'Allahu Akbar' diýiň we ýedi süňküň üstünde seňde ediň - maňlaýy burun, iki el, iki dyz we iki aýak barmak bilen bilelikde Beýik Allany üç gezek ýa-da ondan köp şöhratlandyrýar. Bu Allaha iň ýakyn duruşdyr, şonuň üçin tasbihden soň dileg ediň.",
        translation: "Beýik Rebbim şöhratdyr.",
        tip: "Bilekleri ýerden ýokary galdyryp, gapdallardan, garnyny budlardan uzakda saklaň.",
      },
      {
        title: "10. Iki sejdäniň arasynda oturmak (jalsah)",
        body: "Ilkinji sujuddan 'Allahu Akbar' diýiň, arkaýyn we dik oturyň we sejde etmezden ozal Rebbiňizden ötünç soraň.",
        translation: "Lorda Reb, meni bagyşla.",
        tip: "Arkaýyn bolýançaňyz oturyň - bu gysga oturmak, ümsümlik bilen öz sütünidir.",
      },
      {
        title: "11. Ikinji sejde",
        body: "'Allahu Akbar' diýiň we şol bir tasbih we şol bir ümsümlik bilen ikinji gezek sejde ediň. Bu bir rekagat namazyny tamamlaýar.",
        translation: "Beýik Rebbim şöhratdyr.",
      },
      {
        title: "12. Indiki raka üçin dur",
        body: "'Allahu Akbar' diýiň we duruň, soň bolsa Al-Fatihadan gaýtalaň. Üçünji we dördünji rakatlarda diňe Fatiha okalýar, goşmaça süre bolmazdan.",
        tip: "Iki rekagat namazda ikinji rekagatdan soň ýene durmarsyňyz - iň soňky daşhud üçin oturarsyňyz.",
      },
      {
        title: "13. Ilkinji daşahhud (3-nji we 4-rekagat namazlarynda)",
        body: "Magrib, Zhuhr, Asr ýa-da Işanyň ikinji rekagatyndan soň oturyp, At-Tahiýaty okaň, soňra galan rekagatlar üçin duruň. Iki rekagat namazyň birinji namazy ýok.",
        translation:
          "Hemme salamlar, dogalar we arassa sözler Allaha degişlidir. Salam, salam, Allahyň rahmeti we nygmatlary bolsun. Salam we Allanyň dogruçyl bendelerine salam bolsun! Alladan başga hudaýyň ýokdugyna şaýatlyk edýärin we Muhammediň guly we Resulydygyna şaýatlyk edýärin.",
        tip: "Oturylyşykda dogry görkeziji barmagy galdyryň. Ilkinji daşahhudy ýatdan çykarsaňyz we salamdan öň durup, dowam etdiriň we sujud as-sahw ýerine ýetiriň - oturmaň.",
      },
      {
        title: "14. Jemleýji daşahud",
        body: "Her doganyň soňky oturylyşynda ýokarda görkezilen At-Tahiýaty okaň. Iň soňky daşhud üçin oturmak we ony okamak, doganyň sütünidir.",
      },
      {
        title: "15. Pygambere salawat iber (Salawat)",
        body: "Jemleýji At-Tahiýatdan soň, Pygambere salawat iberiň, sahabalaryna öwreden sözleri bilen.",
        translation:
          "Eý, Allatagala, Ybraýyma we Ybraýymyň maşgalasyna ak pata berşiň ýaly, Muhammet we Muhammet maşgalasyna alkyş iber! hakykatdanam Sen öwgä mynasyp, şöhratlysyň. Eý, Allatagala, Ybraýymy we Ybraýymyň maşgalasyny söýşüň ýaly, Muhammede we Muhammet maşgalasyna merhemet et! hakykatdanam Sen öwgä mynasyp, şöhratlysyň.",
        tip: "Şafygy we Hanbali mekdepleri jemleýji mejlisde namazy farz hasaplaýar.",
      },
      {
        title: "16. Salamdan öň dileg ediň",
        body: "Ahyry gutarmazdan ozal dört synagdan Allaha pena tapyň, soňra bu durmuş we ahyret üçin arap ýa-da öz diliňizde islän duaňyzy ediň.",
        translation:
          "Eý, Allatagala, gabryň jezasyndan, dowzahyň jezasyndan, ýaşaýyş we ölüm synaglaryndan, ýalan Mesihiň (Dajjal) synagyndan erbetlik alýaryn.",
      },
      {
        title: "17. osingapylýan salamlar (Taslim)",
        body: "Her gezek parahatçylyk salamyny berip, ýüzüňizi saga, soňra çepe öwrüp, dogany tamamlaň. Salam bilen doga doly.",
        translation: "Salam we Allanyň rahmeti bolsun.",
        tip: "Ilkinji taslim (sagda) sütün; ikinjisi (çepde) käbir mekdeplerde sünnetdir.",
      },
    ],
    hadith: [
      {
        excerpt: "Meniň doga edişimi görşüňiz ýaly doga ediň. (Mälik ibn al-Huweýrit)",
      },
      {
        excerpt:
          "'Yzyňa doga et, çünki doga etmediň' - üç gezek gaýtalady - soň bolsa öwretdi: takbir diý, Gurhanyň edip biläýjek zadyny oka, soň rahat bolýança baş eg, göni durýança tur, rahat bolýança setrde et ... (erbet doga eden adam; Sahih Musulman 397)",
      },
      {
        excerpt:
          "Kitabyň açylyşyny okamaýan adam üçin doga ýok. (Ubadah ibn-Samit; şeýle hem Sahih Musulman 394)",
      },
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Her pozisiýa",
    summary: "Namazyň her duruşynda bedeniňizi nädip dogry saklamaly.",
    body: [
      "Namazdaky her bir ýagdaý, Pygamberimiziň görkezen we sahabalarynyň beden görnüşine eýe. Dogry görnüşi öwrenmek, doganyňyzy umumy fiziki ýalňyşlyklardan goraýar we bedene ünsüni sowmak däl-de, ýüregiň kiçigöwünliligini goldamaga kömek edýär.",
      "Sejdäniň ýakynlygy aýratyn alada edilmelidir: Pygamber alaýhyssalam: «Hyzmatkär Rebbe seatedde edeninde iň ýakyn, şonuň üçin köp dileg ediň» diýdi. Dymmak we yhlas bilen sejde etmek imanlylar döwrüniň iň güýçli pursatlarynyň biridir.",
    ],
    steps: [
      {
        title: "Duran (qiýam)",
        body: "Dogry, aýaklar takmynan egin-ini, agramy deňagramly, sujudyň ýerine seredýär, sag eliňi döşüň üstünde.",
      },
      {
        title: "Elleri ýokary galdyrmak (raf 'al-ýadayn)",
        body: "Gybla tarap seredýän palmalar, eginleri ýa-da gulaklary bilen deň derejeli - açylýan takbirde we (köplük bilen) ruku-dan girýär we ýokarlanýar.",
      },
      {
        title: "Baş egmek (ruku)",
        body: "Yzky tekiz we tekiz, kellesi ne ýokary galdyrylan, ne-de aşak egilen, barmaklar dyzlaryny gysyp, gapdallaryndan uzakda saklanýar.",
      },
      {
        title: "Sejde (sujud)",
        body: "Maňlaý we burun, eginleriň ýa-da gulaklaryň ýanynda palmalar tekiz, tirsekler ýokaryk we poldan ýokary galýar, dyz epýär, aýaklary kybla tarap egilýär.",
      },
      {
        title: "Oturmak (iftirash)",
        body: "Iki sejdäniň arasynda we ilkinji daşahhudda: çep aýagyňyzda sag aýagyňyzy dik tutup, elleriň budlaryň üstünde oturyň.",
      },
      {
        title: "Soňky oturylyşyk (tawarruk)",
        body: "3 ýa-da 4 rekagat namazyň (Şafygy we Hanbali mekdepleriniň sünneti) iň soňky daşy: çep aýagyňyzy sag aýagyň aşagyndan geçiriň we ýerde oturyň.",
      },
      {
        title: "Salam üçin kelläni öwürmek (taslim)",
        body: "Parahatçylyk sözleri bilen ýüzüňizi doly saga, soňra çepe öwüriň - her egniňizde perişdeler bilen salamlaşanyňyzda namazy tamamlaň.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Hyzmatkäri Rebbine iň ýakyn wagtda seatedde edýär, şonuň üçin köp dileg ediň. (Abu Hureýra)",
      },
    ],
    disclaimer:
      "Eliň ýerleşdirilmeginde, oturmagyň usulynda we eliňi götermekde ownuk tapawutlar bularyň hemmesi hakyky hasabatlardan gözbaş alýar; mekdepleriň hersi dogry bir kyssa berýär. Hiç kim başga biriniň dogasyny ýatyrmaýar.",
  },
  {
    title: "Adaty ýalňyşlyklar",
    summary: "Namazy ýuwaşlyk bilen gowşadýan ýalňyşlyklar - we her birini nädip düzetmeli.",
    body: [
      "Namazdaky kemçilikleriň köpüsi ýüregiň günäleri däl-de, howlukmaçlyk we ünssizlik endikleri. Olara at bermek, olary düzetmek üçin ilkinji ädimdir; Pygamberimiziň özi, sahabalaryň dogasyny sabyrly we gönüden-göni düzedip, bu ýalňyşlyklaryň umumy we düzedip boljakdygyny öwredýär.",
      "Iň gabyr howlukýar - ruku we sujuddan ümsümliksiz çykýar. Tuma'ninah (çözülen ümsümlik) alymlaryň köpüsi üçin doganyň sütünidir, şonuň üçin gyssagly doga diňe bir kämillik däl, eýsem hakyky däl bolup biler. Sanawyň üstünde bir gezekde bir endigiň üstünde işläň.",
    ],
    steps: [
      {
        title: "Çalt doga etmek",
        body: "Ruku ýa-da sujudda zordan dynmak. Bedeniňiz düzelýänçä galyň we zikrini azyndan üç gezek howlukman aýdyp bilersiňiz.",
      },
      {
        title: "Doly däl taharet",
        body: "Dabany, topuk, tirsek ýa-da barmaklaryň arasynda gury tegmiller. Pygamber alaýhyssalam: «Otdan topuklara waý!» Diýip duýduryş berdi. Slowlyuwaş we gowy ýuwuň.",
      },
      {
        title: "Rukuda egrilen, sujudda gark",
        body: "Tegelek arkasy bilen egilmek, ýa-da maňlaýyňy burnuňyzdan dynmak, ýa-da bilekleriňizi poluň üstünde goýmak. Yzky derejäni we tirsekleri ýokary galdyryň.",
      },
      {
        title: "Gözler we ýürek",
        body: "Daş-töweregine göz aýlamak ýa-da telefony barlamak. Sujudyň ýerine göz aýlaň we dymyň ýa-da takbirden öň telefonyňyzy aýyryň.",
      },
      {
        title: "Ymamyň öňünden ýaryş",
        body: "Jemgyýetde ymamyň öňünde ruku ýa-da sujuda geçmek. Oňa eýeriň - hiç haçan ondan öňe geçmäň - diňe şondan soň hereket ediň.",
      },
      {
        title: "Geplemek, iýmek ýa-da gülmek",
        body: "Islendik bilgeşleýin gürlemek, iýmek, içmek ýa-da eşidilýän gülki namazy bozýar. Namaz diňe Allah bilen söhbetdeşlikdir.",
      },
      {
        title: "Al-Fatihany nädogry okamak",
        body: "Sözleri taşlamak ýa-da manysyny üýtgedýän ýalňyşlyklar etmek. Haty kämil öwreniň - tutuş doga oňa baglydyr.",
      },
    ],
    actions: [
      "Adaty tizligiňiziň ýarysynda şu gün bir namaz okaň we nähili üýtgeşik duýýandygyny görüň.",
      "Telefonyňyzy dymyň ýa-da açylyş takbirini aýtmazdan ozal başga bir otagda goýuň.",
      "Dilegleriňizden birini görmegi we duruşyňyzy düzetmegi bilýän adamdan soraň.",
    ],
    appLinks: [{}],
  },
  {
    title: "Sünnet amallary",
    summary: "Pygamberimiziň (saw) namazynyň sylagyny owadanlaşdyrýan we köpeldýän amallary.",
    body: [
      "Hökmany amallardan başga-da, Pygamber alaýhyssalam namazyň töwereginde köp maslahat berilýän amallary (sunan) nusga aldy. Olar talap edilmeýär, şonuň üçin birini taşlamak namazy ýatyrmaýar - ýöne hersi sizi Allaha ýakynlaşdyrýar, goşmaça sylag gazanýar we farz namazlarynda kemçilikleri düzedýär.",
      "Olaryň arasynda iň esasysy, farzdan öň we soň okalýan yzygiderli sünnet namazlarydyr: ikisi Fajrdan (Pygamber alaýhyssalam bütin dünýäden ýokarydyr), dördüsi Duhrdan öň we ikisi, Magribden soň ikisi we Işadan soň ikisi - sylagy Jennetde gurlan on iki rekagat namazdyr.",
    ],
    actions: [
      "Taharetden we namazdan öň miswak (siwak) ulanyň - Pygamberimiz hökmany diýen ýaly etdi.",
      "Metjide arkaýyn we ir ýöräň - her ädim derejäni ýokarlandyrýar we günäni ýok edýär.",
      "Jennetde wada berlen jaý üçin on iki rekagat sünnet çigibini gora.",
      "Metjide sag aýagyňyz bilen giriň we çep bilen gidiň, hersi dua bilen.",
      "Her namazdan soň döredilen adkar okaň - Namazdan soň serediň.",
    ],
    hadith: [
      {
        excerpt:
          "Ymmatymy ýüklemeýän bolsam, her namazdan öň siwak ulanmagy buýrardym. (Abu Hureýra; şeýle hem Sahih Musulman 252)",
      },
      {
        excerpt:
          "Kim gije-gündiz on iki rekagat namaz okasa, Jennetde onuň üçin jaý gurlar. (Umm Habibah)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Huşu - ýüregiň barlygy",
    summary: "Bütin syýahatyň maksady: Allany görýän ýaly doga etmek.",
    body: [
      "Huşu, hakykatdanam Allanyň öňünde durýandygyňyza kiçigöwünlilik, üns bermek we düşünmekdir. Namazyň fiziki hereketlerini hakyky ybadatlara öwürýän zat. Pygamberimiz, kämilligi (ihsan) 'Allany görşüňiz ýaly ybadat etmek, sebäbi ony görmeseňiz, hökman sizi görmek' diýip kesgitledi we namazdan has göni amal edilýän ýerde hiç zat ýok.",
      "Allatagala üstünlikli iman edenleriň beýanyny açdy: 'Namazlarynda kiçigöwünliler' (23: 1-2). Munuň tersine, \"namaz okaýanlara waý, ýöne dileglerine biperwaý\" - ýürekleri ýok wagty bedenleri hereket edýänlere käýinç barada berk duýduryş berdi.",
      "Huşu gurulýar, islenmeýär. Okaýan zatlaryňyzyň manylaryny öwreniň, sözler sizi herekete getirer. Takbiriň öňündäki zatlary aýyryň. Haýal ediň we her duruşyňyza rahatlyk beriň. Addressüzlenýäniň beýikligi we bu doganyň iň soňky bolup biljekdigi hakda pikirleniň. Pygamberimiziň maslahat berşi ýaly her dogany hoşlaşyk dogasy hökmünde okaň.",
      "Aýlanyp ýören pikirler bilen ruhdan düşmäň - hatda sahabalar hem olar bilen göreşdiler. Ünsüňizi gaýta-gaýta yzyna gaýtarmak ugrundaky göreş, ybadatyň bir bölegidir. Huşu ömrüniň dowamynda ösýär; yzygiderlilik ony terbiýeleýär.",
    ],
    quran: [
      {
        excerpt: "Hakykatdanam imanlylar - dogalarynda kiçigöwünliler üstünlik gazanýarlar.",
      },
      {
        excerpt: "Namaz okaýanlara - dogalaryna biperwaý gynanýanlara waý!",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ihsan, Allany görýän ýaly ybadat etmekdir, çünki Ony görmeseňizem, sizi hökman görýär. (Jibriliň hadyslary, Umar)",
      },
    ],
    actions: [
      "Şu hepde her namazdan öň Namaz sözlerinden bir sözlemiň manysyny okaň.",
      "Geçmezden ozal her duruşda üç gyssagly sekunt saklaň.",
      "Namazdan soň journalurnaldaky ünsüňize üns beriň we nagşyň üýtgemegine tomaşa ediň.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sütünler we güýçlendirijiler",
    summary: "Namazyň näme bolup bilmejekdigi we nämäni ýatyrýandygy.",
    body: [
      "Namaz amallary üç hatara bölünýär. Sütünler (arkan) möhüm böleklerdir: birini taşlamak namazy bilgeşleýin ýatyrýar, ýatdan çykarmak bilen birini yzyna gaýtarmak bilen düzedilmeli. Hökmany amallar (wajibat) talap edilýär, ýöne ýatdan çykarylsa, ýatdan çykma sejdesi bilen bejerilýär (sujud al-sahw). Sünnet namazy doly we owadanlaşdyrýar we olary terk etmegiň hiç hili jezasy ýok.",
      "Bu iýerarhiýany bilmek sizi iki ädimden goraýar: ownuk bir ýalňyşlygy weýran etmek ýa-da hakyky sütüne islege görä garamak. Sütün hakda şübhe dörände, doga ýerine ýetirilýänçä dogry bolmaz.",
      "Aýry-aýry zatlar, namazyň ýüze çykan pursatynda göni namazy ýatyrýar - sebäbi doganyň ýagdaýyna ters gelýär. Beýlekiler bolsa namazy gutarýan tahareti ýatyrýarlar. Ikisindenem goraň, şonuň üçin hiç wagt düşünmän nädogry ýagdaýda doga etmersiňiz.",
    ],
    steps: [
      {
        title: "Sütünler (arkan)",
        body: "Mümkin boldugyça durmak, açylan takbir, Al-Fatihah, ruku okamak, ondan ýokary galmak, iki sejde etmek, olaryň arasynda oturmak, iň soňky oturmak, daşahhud, salam, tuma'ninah we dogry tertibi saklamak.",
      },
      {
        title: "Hökmany amallar (wajibat)",
        body: "Beýleki takbirler ýaly, ruku we sujuddaky dikr sözleri we ilkinji daşahhud - ýatdan çykarylsa sujud al-sahw tarapyndan bejerilýär (Hanbali jikme-jiklikleri boýunça mekdepler tapawutlanýar).",
      },
      {
        title: "Tahareti ýoklaýjylar",
        body: "Öň ýa-da arka böleklerden çykýan islendik zat, çuňňur uky, huşuňy ýitirmek - we käbir alymlar tarapyndan gönüden-göni şahsy böleklere degmek. Bularyň haýsydyr biri namazy tamamlaýar.",
      },
      {
        title: "Namazyň özi",
        body: "Bilgeşleýin gürlemek, bilgeşleýin iýmek ýa-da içmek, köp gereksiz hereket, sesli gülmek, döşüni bilkastlaýyn kybla öwürmek we awrany açmak.",
      },
    ],
    appLinks: [{}],
    disclaimer:
      "Dört mekdep käbir hereketleri başgaça bölýär - mysal üçin ilkinji daşahhudyň wajypmy ýa-da sünnetmi, ýa-da sujud al-sahw talap edýän zadyň takyk sanawy. Mekdebiňiziň jikme-jikliklerini ökde mugallymdan öwreniň.",
  },
  {
    title: "Sujud al-Sahw - ýalňyşlyklary düzetmek",
    summary: "Namazda süýşýänleri ýatdan çykarýan sejde.",
    body: [
      "Hiç kim doga-dilegde ýatdan çykarmaly däldir - hatda Pygamberimiz-de ýatdan çykardy, soň bolsa öwretdi: 'Men diňe seniň ýaly adam; Forgetatdan çykarýan ýaly ýatdan çykarýaryn, ýatdan çykaranymda maňa ýatlat. ' Özüniň mysalyndan içerki bejeriş serişdesi gelýär: sujud al-sahw (ýatdan çykma sejde) diýlip atlandyrylýan iki sany goşmaça sejde, kiçijik ýalňyşlyklary ýüze çykarýar, şonuň üçin doga gaýtalanmaz.",
      "Üç giň ýagdaýda çagyrylýar: goşmaça (goşmaça rekagat namaz okamak ýa-da ýalňyşlyk bilen duruş), ýalňyşlyk (birinji daşahud ýaly wajyp goýmak) ýa-da şübhelenmek (näçe rekagat namaz okandygyňyzy bilmezlik). Sünnetden çykmak ýa-da bilgeşleýin ýalňyşlyklar üçin zerur däl - bularyň öz kararlary bar.",
      "Hakyky şübhe dörände, ýol görkeziji ýörelge: şübhäni taşlaň, anyk zadyňyzy guruň (az sanly), namazy tamamlaň we iki sejde ediň. Bu bulaşyklygy aladaly çaklama däl-de, çözülen, dogry dilege öwürýär.",
      "Iş ýüzünde: takjir bilen öň we soň, soň bolsa salam bilen adaty sujudyňyz ýaly iki sejde ediň. Alymlar ýalňyşyň görnüşine baglylykda salamdan öň ýa-da soň gelýändikleri bilen tapawutlanýar - ikisiniň-de özbaşdak habar berilendigi sebäpli namazyň hem kabul edilip bilinmejekdigi aýdylýar.",
    ],
    hadith: [
      {
        excerpt:
          "Siziň biriňiz dogasynda ynamsyz bolsaňyz we näçeräk doga edendigini bilmese - üç ýa-da dört - şübhe goýmasyn, anyk zadyna esaslansyn, soň bolsa iki gezek salamdan öň sejde ediň. (Abu Said al-Hudri)",
      },
      {
        excerpt:
          "Biriňiz dogasynda şübhelenýän bolsaňyz, dogry we doly zady gözlesin, soň salam beriň we iki gezek sejde ediň. (Ibn Masud; Sahyh Musulman 572)",
      },
    ],
    actions: [
      "Şübhe üçin düzgüni ýatda saklaň: az mukdarda gur, gutar, soň iki gezek sejde et.",
      "Orta namazyň birinji taşahuddan çykandygyna düşünýän bolsaň, soňunda sujud al-sahw et.",
    ],
    appLinks: [{}],
    disclaimer:
      "Iki sejdäniň salamdan öň ýa-da soň düşmegi ýalňyşlyga bagly we mekdepler tapawutlanýar. Ikisi-de sünnetden; bu ýerde näbellilik sizi doga etmegiňize päsgel bermäň.",
  },
  {
    title: "Namazyň görnüşleri",
    summary: "Fard, sünnet, witr we imanlylaryň gününi baýlaşdyrýan meýletin dogalar.",
    body: [
      "Namazlar borçlar boýunça derejelendirilýär. Gündelik bäş namaz farzdyr - her bir musulman üçin berk borç. Olaryň töwereginde we daşynda Pygamberimiziň Allaha has ýakynlaşýan we biz hem edip bilýän meýletin doga dünýäsi bar.",
      "Meýletin dogalar iki sebäbe görä möhümdir: olar imanlylaryň derejesini ýokarlandyrýan söýgüli amallardyr - Allah goşmaça ybadat hakda şeýle diýýär: 'Hyzmatkärim, söýýänçäm meýletin işler bilen maňa ýakynlaşýar' we farzdaky kemçilikler adamyň kyýamat güni doga-dileglerinden gutarýar.",
    ],
    steps: [
      {
        title: "Bäş günlük fard",
        body: "Fajr, Dhuhr, Asr, Magrib, Isha - hökmany esas, hiç haçan taşlanmaly däl.",
      },
      {
        title: "Sünnet çigatib",
        body: "Farddan öň we soň yzygiderli sünnet rekagatlar - her gün on iki adam Jennetde jaý gazanýar.",
      },
      {
        title: "Oysters",
        body: "Işadan soň täsin sanly doga, gijeki doganyň möhri - köplük üçin sünnet mu'akkadah we Hanafi mekdebinde wajyp.",
      },
      {
        title: "Tahajjud (qiýam al-layl)",
        body: "Gijäniň soňky üçden birinde gijeki doga - iň oňat meýletin doga we dogruçyllaryň endigi.",
      },
      {
        title: "IKINJI",
        body: "Ertiriň dogasy (2-8 rekagat) - her gün bedeniň bogunlary üçin berilýän sadaka.",
      },
      {
        title: "Taraweeh",
        body: "Remezan jemagatynyň gijeki dogasy - mübärek aýyň gijelerini janlandyrmak.",
      },
      {
        title: "Iki baýram",
        body: "Gurban baýramy we Gurban baýramynyň iki rekagaty, soň bolsa wagyz.",
      },
      {
        title: "Istikharah",
        body: "Karar bermezden ozal Allanyň ýoluny gözleýän iki rekagat namaz.",
      },
      {
        title: "bier",
        body: "Jynaza namazy - jemagat borjy (fard kifayah) ruku ýa-da sujudsyz durmagy teklip edýär.",
      },
    ],
    hadith: [
      {
        excerpt: "Hökmany namazdan soň iň gowy doga, gijeki namazdyr. (Abu Hureýra)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Juma'a - Juma namazy",
    summary: "Jemgyýeti ýygnaýan we anna güni Dhuryň ornuny tutýan hepdelik borç.",
    body: [
      "Jumu'ah, her anna güni öýlänsoň namaz okalýan jemagat namazydyr we Gurhanda ady bilen emr edilen aýratyn bir borçdyr: 'Juma güni namaz okalsa, Allany ýatlamaga howlugyň we söwdany taşlaň.' Iki bölekde hutbadan (hutbadan) ybaratdyr, soň bolsa ymamyň aňyrsynda iki rekagat namaz okalýar we bu ýere ýygnananlar üçin Duhryň ýerini alýar.",
      "Bu her bir erkin, ulular, ýaşaýjylar, başarnykly musulman erkekler üçin şahsy borjy (fard 'ayn). Pygamberimiz, dörtden başga: gul, aýal, çaga ýa-da syrkaw bolan her bir musulmanyň borjydygyny kesgitledi. Aýallar, syýahatçylar we syrkawlar bahana edýärler we isleseler gatnaşyp bilerler.",
      "Oňa äsgermezlik etmek uly howp: Pygamber alaýhyssalam üç Jumany äsgermezlikden terk etse, Allanyň ýüregine möhür basjakdygyny duýdurdy. Şeýle-de bolsa, onuň peýdasy hem gaty uly - Juma günüň dogýan iň gowy güni we du'a jogap berilýän bir sagat dowam edýär.",
      "Pygamberimiziň edişi ýaly oňa taýynlaň: taharet ediň, iň oňat arassa eşikleriňizi geýiň, hoşboý ys çalyň, ir gidiň we hutbany ümsümlikde üns bilen diňläň (bu hakda boş gürlemek sylagy ýitirýär). Kahf süresini anna güni okamak iki anna gününiň arasynda ýagtylyk getirýär.",
    ],
    quran: [
      {
        excerpt:
          "Eý iman edenler, anna güni doga okalsa, Allany ýatlamaga howlugyň we söwdany taşlaň. Diňe bilýän bolsaňyz, bu siziň üçin has gowudyr.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Jemgyýetdäki juma namazy dörtden başga her bir musulman üçin hökmany borjydyr: gul, aýal, çaga ýa-da syrkaw. (Tarik ibn Şihab)",
      },
      {
        excerpt:
          "Kim üç juma namazyny biperwaýlyk bilen terk etse, Allatagala ýüregine möhür basar. (Abu al-Ja'd; Abu Dawud 1052, Tirmizi 500)",
      },
      {
        excerpt:
          "Juma anna güni kämillik ýaşyna ýeten her bir adam üçin farzdyr. (Abu Said al-Hudri)",
      },
    ],
    actions: [
      "Ghus ýasaýyň, arassa eşikler we hoşboý yslar geýiň we ir geliň - iň irki gatnaşyjylar iň uly sylag gazanýarlar.",
      "Kahf süresini iki anna gününiň arasynda ýagtylyk üçin okaň.",
      "Hutba wagtynda doly dymyň we ünsli boluň; telefony uzakda saklaň.",
    ],
    appLinks: [{}],
    disclaimer:
      "Gatnaşanlaryň iň az sany, we taharet hökmanymy ýa-da güýçli sünnetmi, alymlaryň tapawudy. Communityerli jemgyýetiňiziň ygtybarly tejribesine eýeriň.",
  },
  {
    title: "Jemagat namazy",
    summary: "Ymamyň arkasynda doga etmek - sylag ýigrimi ýedi esse köpeldi.",
    body: [
      "Jemgyýetde bäş gün namazyny okamak, esasanam erkekler üçin aýratyn nygtalýar we diri musulman jemagatynyň alamatydyr. Pygamber alaýhyssalam, jemagatdaky doganyň ýeke özi okalýan dogadan ýigrimi ýedi esse köpdügini, hiç bir güýjüň köpelip bilmejekdigini öwretdi.",
      "Jemgyýet, ymamyň yzyna düşüp, göni, boşluksyz hatarlarda, egin-egne bilen dur: her hereketi diňe bir edeninden soň, hiç wagt öňünden we hiç haçan şol bir pursatda başlamarsyňyz. Setirleri düzetmek, namazy okamagyň bir bölegidir.",
      "Ymam başlansoň gelen bolsaňyz (soňky gelenlere masbuq diýilýär), haýsy duruňda derrew goşulyň - bu bölek henizem onuň bilen doga etmek hasaplanýar. Iň soňky salam bereninde, durup, özüňiz sypdyran rekagatlaryňyzy tamamlaň, soň bolsa tamamlaň.",
      "Jemgyýet diňe bir metjitde däl: iki adam bilelikde namaz okaýarlar, şonuň üçin çagasy bilen bir kaka ýa-da syýahat edýän iki dosty sylagyna ýetip biler. Aýallar ýygnakda namaz okap, amatly desgalar bar bolan metjide gatnaşyp bilerler, emma öýlerinde namazlary hem köp sylaglanýar.",
    ],
    hadith: [
      {
        excerpt:
          "Congregationygnakdaky doga, diňe okalýan dogadan ýigrimi ýedi dereje has mertebedir. (Ibni Umar; Sahih Musulman 650)",
      },
    ],
    quran: [
      {
        excerpt: "Namaz okaň we zekat beriň we baş egýänler bilen baş egiň.",
      },
    ],
    actions: [
      "Şu gün metjitde iň bolmanda bir doga ediň ýa-da öýüňizi öýüňize yzygiderli ýygnaň.",
      "Soňky adam hökmünde näme etmelidigini öwreniň: birbada goşulyň, ymamyň namazyndan soň sypdyran rekagatlaryňyzy tamamlaň.",
    ],
  },
  {
    title: "Editirilen (namaz) dogalar",
    summary: "Editirilen zady düzmek - Allanyň rahmetiniň gapysy açykdyr.",
    body: [
      "Eger farz namazy sypdyrylsa - aşa ýatmak, ýatdan çykarmak ýa-da (Alla bizi gorasyn) geleňsizlik bilen - borç diňe ýitip gitmeýär. (Kada) düzülmelidir we Pygamber alaýhyssalam bu hökümi açyk aýdypdyr: 'Kim bir namazy ýatdan çykarsa ýa-da uklasa, onuň günäsi ýadyna düşende okamakdyr.' Munuň üçin doga etmekden başga töleg ýok.",
      "Namaz okalýan namaz asyl görnüşde okalýar: sypdyrylan dört rekagat Duhr, gije ýa-da syýahat edeniňizde hem dört rekagat namaz okalýar. Hakyky bahana sebäpli doga-dilegleri ýitiren adam (çuňňur uky ýaly) gijä galmak üçin günä etmeýär; bilgeşleýin terk eden adam, çyn ýürekden, gyssagly toba etmek bilen birlikde olary düzmeli.",
      "Alymlar sypdyrylan dogalary derrew we mümkin boldugyça tertip-düzgüne jemlemegi maslahat berýärler, sebäbi wagt we gijä galmak bilen ýük has agyrlaşýar. Köp ýyllaryň dowamynda sypdyrylan bolsa, umytsyzlyga däl-de, hakyky gündelik meýilnama bilen çemeleşiň; Allanyň gaýdyp gelýän gapysy hemişe açykdyr.",
    ],
    hadith: [
      {
        excerpt:
          "Kim namazy ýatdan çykarsa ýa-da onuň üstünde uklasa, onuň günäsi, ýadyna düşende okamakdyr. (Anas; şeýle hem Sahih Musulman 684)",
      },
    ],
    actions: [
      "Näçe doga bermelidigiňizi dogry hasaplaň we gündelik makiýa up maksadyny kesgitläň.",
      "Her farz namazyny yzky arassalanýança bir makiýa namazy bilen jübütläň.",
      "Köne namazy okamak üçin häzirki namazy gijikdirmäň - şu günki dogalary wagtynda saklaň.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Namazdan soň",
    summary: "Her doganyň sogabyny möhürleýän adkar we dilegler.",
    body: [
      "Pygamber alaýhyssalam namazdan birden turmady. Ol Allanyň günäsini geçmegini isläp, ýatlamak bilen meşgullanardy we farz namazyndan soň pursatyň du'a iň aňsat jogap berilýän döwürleriň biridigini öwretdi. Derrew gitmek doganyň iň uly miwesini ýitirýär.",
      "Namazdan soňky kesgitlenen düzgün ýönekeý we agyr: “Astagfirullah” üç gezek aýdyň; soň tawhid we öwgi sözleri; soň 'SubhanAllah', 'Alhamdulillah' we 'Allahu Akbar' otuz üç gezek \"La ilaha illallah ...\" bilen ýüzden birine möhür basýar - kim muny eden bolsa, deňziň köpügi ýaly bolsa-da, günäleri bagyşlanýar.",
      "Her farz namazyndan soň Aýat al-Kursi okamak, pygamberiň wada berşi ýaly diňe bir adam bilen Jennetiň arasyndaky ölümi aýyrýar. Üç Kül (Al-Yhlas, Al-Falaq, An-Nas) bilen yzarlaň we Fajrdan soň ertir adhkaryny we ýüz tutan ýerlerinde Asr ýa-da Magribden soň agşam adhkar goşuň.",
    ],
    hadith: [
      {
        excerpt:
          "Kim her dogadan soň otuz üç gezek Allany şöhratlandyrsa, öwse we şöhratlandyrsa ... we ýüz sanysyny tahid sözleri bilen tamamlasa, deňziň köpügi ýaly bolsa-da, günäleri bagyşlanar. (Abu Hureýra)",
      },
      {
        excerpt:
          "Kim her namazdan soň Aýat al-Kursi okasa, onuň arasynda ölümden başga hiç zat durmaz we Jennete girer. (Abu Umama; al-Albani tarapyndan bahalandyrylan sahih)",
      },
    ],
    actions: [
      "Falsealandan soňky tasbih (33/33/33 + tahlil) şu hepde ýatda saklaň.",
      "Aýat al-Kursi we üç Kül durmazdan ozal okaň.",
      "Her farz namazyndan soň bir minut şahsy du'a oturyň.",
    ],
    appLinks: [{}, {}],
  },
];

export const SALAH_GUIDE_PHRASES_TK: DeepPartial<SalahGuidePhrase>[] = [
  {
    title: "Taharet gutarandan soň",
    when: "Taharet gutarandan soň, namazdan öň.",
    translation:
      "Diňe Alladan başga hudaýyň ýokdugyna, şärigi ýokdygyna şaýatlyk edýärin we Muhammediň guly we Resulydygyna şaýatlyk edýärin.",
    meaning:
      "Bedeniňiz täze arassalananda imanyň şaýatlygyny täzelemek. Pygamber alaýhyssalam muny taharetden soň kim aýtsa, Jennetiň sekiz derwezesiniň islänine girip biljekdigini wada berdi.",
  },
  {
    title: "Takbirat al-Ihram",
    when: "Namazyň başynda we wezipeleriň arasynda hereket edende.",
    translation: "Allah iň beýikdir.",
    meaning:
      "Namaz şu ýerden başlaýar - 'al-ihram', dünýädäki zatlary (sözlemek, iýmek, ýüz öwürmek) gadagan edýär. Allany sizi ünsüňizi sowup biljek we Onuň huzuryna doly ädim edip biljek ähli zatdan beýik diýip yglan edýärsiňiz. Ondan soňky her takbir özüni tabşyrýar.",
  },
  {
    title: "Du'a al-Istiftah (ýalbarýan dileg)",
    when: "Alnan takbirden soň, Al-Fatihadan öň dymmak.",
    translation: "Alla, şöhrat we öwgi. Seniň adyň bagtly we beýikdir. Senden başga hudaý ýok.",
    meaning:
      "Söhbetdeşligi Allany şöhratlandyrmak we öwmek we Onuň birligini tassyklamak, sözlerini okamazdan ozal ýüregi berkitmek bilen açýarsyňyz. Birnäçe hakyky açyk dilegler bar - bu iň köp ulanylýanlardan biridir.",
  },
  {
    title: "Fatiha süresi",
    when: "Her rekagatda durmak - rekagatsyz sütün.",
    translation:
      "Rehimdar, esasanam rehimdar Allanyň ady bilen. Hemme öwgi älemleriň Rebbi bolan Allaha, bütinleý rehimdar, esasanam rehimdar, jeza gününiň hökümdary Allaha şükürdir. Biz ybadat edýäris we siz kömek soraýarys. Bizi göni ýoly - gahar gazananlaryň ýa-da azaşanlaryň däl-de, merhemet edenleriň ýoluna ugrukdyr.",
    meaning:
      "'Kitabyň enesi': Allany alkyşlamak we ýarysyny ýol görkezmek üçin ýalbarmak, olaryň arasynda çeňňek hökmünde 'Saňa ybadat edýäris'. Allatagala bu süresi Özüniň we gulunyň arasynda bölendigini aýtdy - her setiri okaýarka jogap berýär. Pygamberimiz ﷺ okamaýan adam üçin doga ýokdugyny aýtdy.",
  },
  {
    title: "Dikr",
    when: "Baş egip, tekiz bilen yza çekildi.",
    translation: "Ajaýyp Rebbim şöhratdyr.",
    meaning:
      "Baş egmek, hormat goýmakdyr, şonuň üçin siz Allanyň beýikligini şöhratlandyrýarsyňyz - üç ýa-da ondan köp gezek howlukman aýtdyňyz. Pygamberimiz ruku-da Rebbi beýgeldýäris, şonuň üçin dilegleriňize jogap berilmegine umyt baglaýarys.",
  },
  {
    title: "Rukudan turmak",
    when: "Egilenden soň doly dik durmak.",
    translation: "Allany öwýänleri Alla eşidýär. Lorda Reb, ähli öwgüler saňa degişlidir.",
    meaning:
      "Allany öwýän adamy hakykatdanam eşidýändigini, soň bolsa ähli öwgüleri Oňa gaýtaryp berjekdigini tassyklaýarsyňyz. Pygamberimiz, ymam muny aýdanda we adamlar jogap berenlerinde, kimiň sözleri perişdelere gabat gelse, öňki günäleriniň bagyşlanandygyny aýtdy.",
  },
  {
    title: "Dikr",
    when: "Sejde etmek - Allaha iň ýakyn ýer.",
    translation: "Beýik Rebbim şöhratdyr.",
    meaning:
      "Iň pes fiziki nokatda Beýik Allany şöhratlandyrýarsyňyz - ybadatyň merkezindäki gapma-garşylyk. Pygamber alaýhyssalam sejde edeninde bir hyzmatkäri Rebbine iň ýakyndygyny aýtdy, şonuň üçin zekrden soň dileg ediň.",
  },
  {
    title: "Iki sejdäniň arasynda",
    when: "Her rekagatyň birinji we ikinji sujudlarynyň arasynda arkaýyn oturmak.",
    translation: "Lorda Reb, meni bagyşla. Lorda Reb, meni bagyşla.",
    meaning:
      "Her rekagatda bagyşlanmak üçin gysga, ýöne göni haýyş - hatda orta namazyň hem Allanyň günäsiniň geçilmegine mätäçdigimizi ýatladýar. Ikinji sejde etmezden ozal rahat boluň.",
  },
  {
    title: "At-Tahiýat (Taşahhud)",
    when: "Orta oturylyşykda we namazyň soňky oturylyşygynda.",
    translation:
      "Hemme salamlar, dogalar we arassa sözler Allaha degişlidir. Salam, salam, Allahyň rahmeti we nygmatlary bolsun. Salam we Allanyň dogruçyl bendelerine salam bolsun! Alladan başga hudaýyň ýokdugyna şaýatlyk edýärin we Muhammediň guly we Resulydygyna şaýatlyk edýärin.",
    meaning:
      "Namazyň oturýan ýüregi: siz diňe Allaha ybadat edýärsiňiz, Pygambere we dogruçyllara salam iberýärsiňiz we iki şaýatlygy täzeden yglan edýärsiňiz. Ibni Mesud, bir süräni öwrenişi ýaly, Pygamberimizden sözme-söz öwrendi.",
  },
  {
    title: "Salawat Ybraýymiýa",
    when: "Iň soňky daşhudda, At-Tahiýatdan soň.",
    translation:
      "Eý, Allatagala, Ybraýyma we Ybraýymyň maşgalasyna ak pata berşiň ýaly, Muhammet we Muhammet maşgalasyna alkyş iber! hakykatdanam Sen öwgä mynasyp, şöhratlysyň. Eý, Allatagala, Ybraýymy we Ybraýymyň maşgalasyny söýşüň ýaly, Muhammede we Muhammet maşgalasyna merhemet et! hakykatdanam Sen öwgä mynasyp, şöhratlysyň.",
    meaning:
      "Sahabalar oňa nädip bereket ibermelidigini soranlarynda, Pygamber alaýhyssalam bu takyk sözleri - sünnetde iň tassyklanan salawat öwretdi. Allahyň emri bilen Resuly hormatlaýarsyňyz, doga etmegi öwreden adama söýgi bilen doga ediň.",
  },
  {
    title: "Salamdan öň gaçybatalga gözlemek",
    when: "Iň soňky namazdan we namazdan soň, namazy gutarmanka.",
    translation:
      "Eý, Allatagala, gabryň jezasyndan, dowzahyň jezasyndan, ýaşaýyş we ölüm synaglaryndan, ýalan Mesihiň (Dajjal) synagyndan erbetlik alýaryn.",
    meaning:
      "Pygamber alaýhyssalam namaz okamazdan ozal bir adamyň bu dört howpdan gaçybatalga bermegini buýurdy - doganyň soňky haýyşy bu durmuşy, gabry, oty we geljekdäki iň uly synagy öz içine alýar.",
  },
  {
    title: "Taslim (ýapylýan salam)",
    when: "Namazyň soňy - ýüzüň saga, soňra çepe öwrülmegi.",
    translation: "Salam we Allanyň rahmeti bolsun.",
    meaning:
      "Hormatly adamlar bilen bile gideniňizde, her egniňizde ýazýan perişdelere we ýanyňyzda doga edýänlere parahatçylyk gutlagy bilen gidýärsiňiz. Salam sütün; bilen doga doly.",
  },
];
