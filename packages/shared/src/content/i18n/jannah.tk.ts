// Turkmen translation overlay for the Learn "Journey to Jannah" content. Mirrors the order of
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

export const JANNAH_TOPICS_TK: DeepPartial<JannahTopic>[] = [
  {
    title: "Jannah näme?",
    summary: "Allah baky bagşy takwa adamlar üçin taýýarlady.",
    body: [
      "Jennet (Jennet), Allanyň özüne iman edenler we dogry işler edenler üçin taýýarlan baky sylag öýidir. Bu söz göçme manyda gök öwüsýän bagy aňladýar, ýöne Gurhan ony ýer ýüzündäki baglardan has beýik bir hakykat üçin ulanýar: imanlylar Rebbiniň razylygy bilen ebedi ýaşaýan derýalar, miweler, köşkler we ýoldaşlyk. Her pygamberiň adamlary çagyran maksady we bu syýahatyň barjak ýeri.",
      "Jannadaky durmuş bu dünýädäki hiç zatdan tapawutly däl, sebäbi ýerdäki bagty zaýalaýan her bir kemçilik ýok. Ölüm ýok, kesel ýok, garrylyk ýok, gorky, gaýgy we ýadawlyk ýok. Halky hiç wagt jedel etmeýär, ýadamaýar we söýýän zadyny hiç wagt ýitirmeýär. Heartüregiň islän zady berilýär we Allatagala sahylygyndan has köp zat goşýar - 'Olarda islän zady bolar, biziň bilen has köp' (Gurhan 50:35).",
      "Jennetiň lezzetleri adam göz öňüne getirip bilmeýär. Bir hadysda, Allah Öz dogruçyl bendelerine hiç bir göz görmedik, gulak eşitmedik we ýürek oýlap tapmadyk zatlary taýynlandygyny aýdýar. Şonuň üçin Gurhan jenneti tanyş şekillerde - baglarda, derýalarda we kölegelerde suratlandyrýar - hakykatyň islendik beýanyndan has uludygyny ýatladýar. Hemmeleriň iň uly sylagy baglaryň özi däl-de, Allanyň razylygy we iň ýokary derejeler üçin asylly ýüzüne seretmek mertebesi.",
      "Mömin iki hakykaty bilelikde saklamalydyr. Birinjiden, Jennet hakyky, ýakyn we ähli tagallalara mynasypdyr - Gurhan bize oňa “ýaryş” diýýär (Gurhan 3: 133). Ikinjiden, hiç kim diňe amallar bilen Jennet gazanyp bilmez; girmek, ahyrsoňy Allanyň rahmeti bilen, çyn ýürekden iman we ýagşy amallar bilen kabul etmek üçin saýlandy. Bu deňagramlylyk, ulumsylygy köpeltmän umydy dowam etdirýär: elimizden gelenini edýäris, soň bolsa Öz rehimine atýarys.",
      "Iş ýüzünde, Jannanyň hakykaty gündelik saýlawlaryňyza täsir etsin. Ybadat agyr duýulsa ýa-da synag güýçli duýulsa, nämä garaşýandygyny we nämäniň howp astyndadygyny ýadyňyza salyň. Alladan Jennetden ýygy-ýygydan soraň, munuň üçin yzygiderli ownuk-uşak ýollar bilen işläň we oňa bolan islegiňiz bu gysga durmuşda ýüregiňizi ýumşadyň.",
    ],
    quran: [
      {
        excerpt:
          "Dogruçyllar üçin taýýarlanan Rebbiňizden we asmanyň we ýeriň giňligi bolan bagyňyzdan bagyşlaň.",
      },
      {
        excerpt:
          "Allah imanly erkeklere we aýallara derýalaryň akýan, ebedi ýaşaýan baglaryny we ebedi ýaşaýyş baglarynda ýakymly ýaşaýyş jaýlaryny wada berdi, ýöne Allanyň razylygy has uludyr.",
      },
      {
        excerpt: "Öňki edenleri üçin sylag hökmünde rahatlyk üçin gizlenen zady hiç kim bilenok.",
      },
      {
        excerpt: "Olarda islän zatlaryna eýe bolarlar we biziň bilen has köp.",
      },
      {
        excerpt:
          "Iman edenler we dogry işler edenler - olar üçin myhmansöýerlik hökmünde Bosgun baglarydyr.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allatagala aýtdy: Dogruçyl bendelerime hiç bir göz görmedik, gulak eşitmedik we ýürek emele getirmedik zatlary taýýarladym.",
      },
      {
        excerpt:
          "Beýik Allatagala şeýle diýdi: «Dogry bendelerime hiç bir göz görmedik, gulak eşitmedik we ynsan ýüregi hiç zat duýmadyk zatlary taýýarladym.",
      },
    ],
  },
  {
    title: "Jennetdäki orunlar",
    summary: "Jennetiň köp derejesi bar - ýedi basgançak däl.",
    body: [
      "Jennet ýekeje tekiz ýer däl; darajat diýilýän köp dereje bar we imanlylar öz içinde imanlaryna we amallaryna görä ulalýarlar. Gaty ýaýran ýalňyş düşünje, Jannanyň takmynan ýedi derejesi bar. Bu iki dürli zady bulaşdyrýar: Gurhan ýedi asman (samawat) hakda aýdýar - jennetiň ýedi derejesi däl-de, üstümizde döredilen asman. Tekstler hiç haçan Jannany ýedi hatar bilen çäklendirmeýär.",
      "Hakyky çeşmeleriň bize aýdýanlary, hatarlaryň köpdügidir. Pygamber alaýhyssalam, Jennetde Allanyň ýolunda ymtylýanlar üçin ýüz derejäniň bardygyny we bir dereje bilen beýlekisiniň arasyndaky aralyk asman bilen ýeriň arasyndaky aralyk ýalydygyny aýtdy. Hatda bu san gutulara bellik edip çykyp boljak gaty merdiwan däl-de, ummasyzlygy görkezýär.",
      "Allatagala her bir imanlyny imanynyň güýjüne, niýetiniň yhlasyna we amallarynyň agyrlygyna görä terbiýeleýär - 'Sebäbi hemmeleriň edenlerine görä derejeler bolar' (Gurhan 6: 132). Her adamyň ýetýän derejesi diňe Allaha mälimdir. Ylham, bilgeşleýin bize “X işine N derejesine ýetmek üçin” mehaniki gözegçilik sanawyny bermeýär, sebäbi ybadat dereje hasaplamak bilen däl-de, söýgi we yhlas bilen amala aşyrylýar.",
      "Munuň hikmeti owadan. Takyk ýerleşişimizi bilsedik, käbiri arkaýyn bolup, käbirleri umytsyz bolardy. Munuň ýerine, Allaha gözümizi aýyrmagy, yhlas etmegi we umyt etmegi öwretýäris. Imanly jemleýji bahany “Iň adalatly” goýup, “munuň üçin bäsdeşler bäsleşsin” diýip gowy bäsleşýär.",
      "Şonuň üçin sanly derejä ýetmek däl-de, iň ýokary derejä ýetmek we Alla sizi islän ýerine goýsun. Pygamber alaýhyssalam sahabalaryna sähelçe haýyş bilen däl-de, Jennetiň iň ýokary nokady bolan Al-Firdaws üçin ýörite haýyş etmegi öwretdi.",
    ],
    quran: [
      {
        excerpt: "Hemmeler üçin edenlerine görä derejeler bolar.",
      },
      {
        excerpt:
          "Olaryň käbiri beýlekilerden has gowy görendigimize göz aýlaň - ahyret derejelerde has tapawutlanýar.",
      },
      {
        excerpt:
          "Kim Allaha we Resula boýun bolsa - Allanyň beren merhemeti bolanlar: pygamberler, dogruçyllar, şehitler we dogruçyllar bolar. Olar nähili gowy ýoldaşlar!",
      },
    ],
    hadith: [
      {
        excerpt:
          "Jennetde Allanyň Öz ugrunda söweşýänler üçin taýýarlan ýüz derejesi bar. Her iki derejäniň arasyndaky aralyk asman bilen ýeriň arasyndaky aralyk ýalydyr. Şonuň üçin Alladan sorasaň, Al-Firdawsdan sora, çünki bu jennetiň iň gowy we beýik ýeridir.",
      },
      {
        excerpt:
          "Alladan sorasaň, Al-Firdawsdan sora, çünki bu Jennetiň iň beýik bölegi we Jennetiň ortasy, ondan Jennet derýalary akýar, ýokarsynda bolsa Rahymlaryň Arşy.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Al-Firdaws - iň beýik",
    summary: "Arşyň iň ýakyn jenneti.",
    body: [
      "Al-Firdaws, hakyky Sünnetde atlandyrylýan Jennetiň iň beýik we iň ajaýyp derejesidir. Pygamberimiz Jennetiň iň gowulary we ortasy - jennet derýalarynyň gözbaş alýan ýüregi hökmünde suratlandyrdy we ýokarsynda iň rehimdar tagtdyr. Al-Firdaws şäherine ýetmek, ýaradylanlaryň bolşy ýaly Allaha ýakyn bolmakdyr.",
      "Bu mowzugy şeýle amaly edýän zat, pygamberlik görkezmeleriniň bir bölegi: Jennet üçin du'a edenimizde, pes maksat etmeli däldiris. Pygamber alaýhyssalam sahabalaryna, Alladan Jennet soranlarynda, has az haýyş etmek üçin däl-de, Al-Firdawsdan ýörite soramalydygyny öwretdi. Allanyň sahylygy çäksizdir, şonuň üçin Ondan diňe az zat soramak bir hili kemçilikdir. Bu bize ybadatda hyjuwy öwredýär: ýokary derejä çykmagy maksat ediniň we Allanyň rehimdarlygy bilen sizi nirede goýjakdygyňyzy çözmegine rugsat beriň.",
      "Hyzmatkär nädip beýle derejä dalaşgär bolýar? Bu serişdeler, Jennetiň özüni alyp barýan, kämillik bilen yzarlaýan şol bir serişdedir: çyn ýürekden (tawhid) Allanyň emr eden borçlaryny üns bilen ýerine ýetirmek, soň bolsa meýletin ybadat durmuşynyň artmagy - gijeki doga, goşmaça agyz beklemek, ýatlamak, haýyr-sahawat we gowy häsiýet. Meşhur bir hadysda, Allatagalanyň, söýýänçä, guluň meýletin amallar bilen nädip ýakynlaşýandygyny suratlandyrýar.",
      "Şeýle-de bolsa, iň soňky we aýgytly sowgat elmydama Allanyň rahmetidir. Iň ýokary derejä ýetmegi maksat edinen şol bir demimizde, Pygamberimiziň öz sözlerini ýada salýarys: amallary bilen jennete hiç kim girmeýär, hatda pygamberiň özi-de, Allatagalanyň rehimdarlygyndan başga. Bu, imanlynyň ajaýyp deňagramlylygy: bir tarapdan umyt we hyjuw, beýleki tarapdan çyn ýürekden kiçigöwünlilik.",
      "Şonuň üçin Al-Firdaws-y dilegleriňiziň yzygiderli bir bölegine öwüriň - sejde ediň, gijäniň soňky üçden birinde we uklamazdan ozal - her gün ýuwaşlyk bilen eliňizden gelenini edip, galanlary üçin bütinleý Rebbiňiziň rehimine bil baglaň.",
    ],
    hadith: [
      {
        excerpt:
          "Alladan sorasaň, Al-Firdawsdan sora, çünki bu Jennetiň iň beýik bölegi we Jennetiň ortasy, ondan Jennet derýalary akýar, ýokarsynda bolsa Rahymlaryň Arşy.",
      },
      {
        excerpt:
          "Siziň hiç biriňiz diňe eden işleri bilen Jennete girip bilmersiňiz. Diýdiler: Eý, Allahyň Resuly! Ol aýtdy: Alla meni Özünden rehim etmese, hatda menem däl.",
      },
    ],
    actions: [
      "Al-Firdaws-dan duaňyzda, esasanam sujudda we uklamazdan soraň.",
      "Özüňe farz bolan zady kämilleşdir, soň meýletin ybadaty artdyr.",
      "Tobaňyzy köplenç täzeläň we diňe amallaryňyza däl-de, Allanyň rahmetine bil baglaň.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ahyret üçin howp salýan zat",
    summary: "Esasy günäler çyn ýürekden toba etmegi talap edýär; Allanyň bagyşlamagy gaty uludyr.",
    body: [
      "Bu bölüm sizi umytsyzlyga salmak üçin däl - düýbünden tersine. Allatagala tüýs ýürekden ýüz tutan adam üçin ähli günäleri bagyşlaýar we muny iň güýçli sözler bilen yglan edýär: 'Aýt: Eý, gullarym, Allanyň rahmetinden umytdan düşmäň. Hakykatdanam, Allatagala ähli günäleri bagyşlaýar '(Gurhan 39:53). Bu ýerdäki maksat, tekstleriň nämäni duýdurýandygyny bilmekdir, şonuň üçin howpy tanap, giç bolmazdan Oňa gaýdyp bararys.",
      "Beýlekilerden tapawutly bir günä bar: şirk - ybadat bilen Allaha şärik etmek. Bu, Gurhanyň 4: 48-de aç-açan aýdyşy ýaly, bir adam toba etmän ölse, Alla bagyşlamaz. Galan zatlaryň hemmesi 'Isläninden pes zady bagyşlaýar' diýen düşünje astyndadyr. Şonuň üçin dogry tawhid her kabul edilen amalyň düýbüni tutýar: döwülen binanyň üstünde gurlan jaý durup bilmez.",
      "Şirkden soň, tekstler namazdan ýüz öwürmäge aýratyn ähmiýet berýär. Gündelik bäş namaza üns bermezlik, yzygiderli we dogry bahana bolmazdan, sünnetdäki iň möhüm duýduryşlaryň biri - Pygamberimiz namazy imanlyny tapawutlandyrýan äht diýip atlandyrdy we ony terk etmek imansyzlyga ýakynlaşdy. Beýleki uly günäler - adalatsyz öldürmek, bikanun gatnaşyklar, gyzyklanma (riba) sarp etmek, ýetimiň baýlygyny iýmek we agyr zulum etmek - çyn ýürekden toba etmegi talap edýän we Allah bagyşlamasa jeza getirip biljek çynlakaý meseleler.",
      "'Kiçijik' diýilýän günäler hem möhümdir we hiç haçan ýönekeý bolmaly däldir. Geplemek, ýalan sözlemek, ulumsylyk, maşgala gatnaşyklaryny bozmak we biperwaýlyk ýuwaş-ýuwaşdan ýüregi we häsiýeti ýitirýär. Pygamberimiz, ýygnanan ownuk taýaklaryň tutuş nahar bişirip bilşi ýaly, toplanan ownuk günäleriň adamy ýok edip biljekdigini duýdurdy. Olaryň hersiniň Allaha ýüzlenmegi zerur.",
      "Aljak hereket umytdyr: günäniň ululygy sizi toba etmegiň manysyzdygyna ynandyrmasyn. Süýnüp giden pursatyňyzda Allaha gaýdyp geliň, süpürmek üçin haýyrly bir amal ediň we istigfaryň gapysyny her gün açyk saklaň. Rehim-şepagaty elmydama ýalňyşyňyzdan uludyr.",
    ],
    quran: [
      {
        excerpt:
          "Hakykatdanam, Allah Öz bilen gatnaşygy bagyşlamaz, ýöne isläninden pes zady bagyşlar.",
      },
      {
        excerpt:
          "Aýt: Eý, gullarym, özlerine garşy hyýanat edenler, Allanyň rahmetinden umytdan düşmäň. Hakykatdanam, Allatagala ähli günäleri bagyşlaýar.",
      },
    ],
    hadith: [
      {
        excerpt: "Biziň bilen olaryň arasyndaky äht doga; kim muny terk etse, imansyzlyk etdi.",
      },
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Fykhdaky uly günäleriň sanawy alymlar tarapyndan üýtgeýär we şahsyýetler baradaky kararlar ökde adamlara degişlidir. Bu, şahsy höküm däl-de, toba etmek üçin umumy ýatlatma. Youragdaýyňyz üçin ygtybarly alym bilen maslahatlaşyň.",
  },
  {
    title: "Tekstlerde hormatlanýanlar",
    summary: "Pygamberimiz Jennet hakda at dakdy.",
    body: [
      "Gurhan we Sünnet, Jennetiň hoş habary bilen baglanyşykly käbir adamlary, imanlylaryň kategoriýalaryny we amallaryny kesgitleýär. Bulary dogry okamak möhümdir: olar anyk adamlar ýa-da düşündirişler barada dogruçyl hasabatlar - diňe atlaryny eşidýän ýa-da haýran galanlar üçin geçip bolmajak kepillik däl. Şatlykly tolkun olaryň imanyna we amallaryna daýanýardy we şol bir gapy bize şol bir ýollar arkaly açykdyr.",
      "Iň meşhur topar, bir hadysda Pygamberimiz tarapyndan bilelikde atlandyrylan on wada berlen jennetdir (al-Aşarah al-Mubaşşarah): Ebu Bekir, Umar, Usman, Aly, Talhah, Zubaýr, Abd al-Rahman ibn Awf, Said ibn Abi Wakqas, Said ibn Zaýd we Abu Ubaý (Al-Jaýd). hemmesi). Bular Pygamberimiziň (saw) sahabalarynyň iň ýakyn we iň köp gurban beren zatlarydy we Ahl-Sünnet hemmesini artykmaç etmezden ýa-da kemsitmezden hemmesini söýýär we hormatlaýar.",
      "Tekstlerde ady tutulan şahsyýetlerden başga-da, hoş habary berlen kategoriýalar beýan edilýär: dogry we sabyrly, Yslam kanunlaryna laýyklykda Allanyň ýolunda hakyky şehit hökmünde ölenler we bu durmuşda soňky sözleri imanyň şaýatlygy bolan la ilaha illallah. Her düşündiriş, diňe bir daşky bellik däl-de, içki hakykaty görkezýär - yhlas, gurban ýa-da iň soňky demde Allaha berlen ýürek.",
      "Biziň üçin sapak, birleşmek arkaly özümizi howpsuz duýmak ýa-da bu derejeleri özümiz üçin talap etmek däl-de, ylham almakdyr. Olaryň göreldesi bizi ýokaryk çykarsyn: söýen zatlaryny söýüň, göreşenlerinde yhlas ediň we bu haýranlygy du'a we herekete öwüriň, hemme zatdan öňürti Alladan husn al-hatima soraň - gowy gutar.",
    ],
    hadith: [
      {
        excerpt:
          "Ebu Bekir Jennetde, Umar Jennetde, Usman Jennetde, Ali Jennetde, Talhah Jennetde, Zubaýr Jennetde, Abd al-Rahman ibn Awf Jennetde, Said Jennetde, Said ibn Zaýd Jennetde we Abu Ubaýdahda.",
      },
      {
        excerpt: 'Kimiň soňky sözleri: "Alladan başga hudaý ýok" jennete girer.',
      },
    ],
    disclaimer:
      "Hadysdaky şatlykly atlar ýa-da beýan edilen kategoriýalara degişlidir. Olar öz imanynyň, amallarynyň we gowy gutarmagynyň zerurlygyny çalyşmaýarlar. Allah iň gowy zady bilýär.",
  },
  {
    title: "Töwhid - dogry ynam",
    summary: "Hiç bir amal çyn ýürekden kabul edilmezden kabul edilmez.",
    body: [
      "Töwhid, diňe Allatagala ybadat etmek üçin ýeke-täk aýdym aýtmagy aňladýar - ýeke-täk Reb we Creatoraradandyr, ýeke-täk ybadat edilmegine mynasypdygyna we atlarynda we häsiýetlerinde üýtgeşikdigine ynanýar. Bu, her bir pygamberiň iberen habary we adamyň Yslam dinine ilkinji giren zadydyr. Bu ybadat edýänimize degişlidir, bu diniň ähli binasynyň esasyny düzýär.",
      "Munuň ähmiýetini ulaltmak mümkin däl: Allatagala şärikleri şärik eden adamyň eden işini kabul etmeýär. 'Başgalary Allah bilen baglanyşdyrsaňyz, amallaryňyz hökman puja çykar' (Gurhan 39:65). Şirkde gurlan gowy eserleriň dagynyň kyýamat gününde hiç hili agramy ýok, arassa tewhidiň üstünde gurlan iň kiçijik iş bolsa gaty agyr bolup biler. Şonuň üçin adamyň ynamyny goramak, amallaryny köpeltmekden has möhümdir.",
      "Töwhid, yhlas diýilýän yhlaslylygy hem talap edýär - Allaha 'dinde çyn ýürekden' ybadat edýäris (Gurhan 98: 5). Bu ýerdäki inçe howp, riýa bolup, adamlar tarapyndan görülmegi we öwülmegi üçin ybadat edýär. Pygamberimiz, hatda gizlin görkezmeleriňem bir işi ýuwaşlyk bilen bozup biljekdigini duýdurdy. Düzediş niýeti täzelemegi dowam etdirmek: muny hakykatdanam kim üçin edýärin? Yhlas, adaty bir işi gymmatly wepalylyga öwürýär.",
      "Tewhid binýadyny ýasamagyň paýhasy, ýüregi azat edýär. Diňe Allaha ybadat edýän adam ýaradylyş gorkusyndan, her kimiň razylygyny kowmakdan we köp ussalara hyzmat etmekden dynýar. Durmuşy ýeke-täk, aýdyň ugra eýe bolýar: Özüni ýaradan adamy razy etmek.",
      "Iş ýüzünde, ynamdar alymlardan dogry ynamy öwreniň, şirk we ikiýüzlülige ybadatyňyzy arassalaň we hereket etmezden ozal niýetiňizi barlaň. Bu ilkinji ädim islege bagly ýa-da ösen däl - Jennete barýan her bir ýol başlaýar.",
    ],
    quran: [
      {
        excerpt:
          "Saňa we senden öňki adamlara aýan boldy: Başgalary Allah bilen baglanyşdyrsaň, amallaryň hökman puja çykar we hökman ýitirenleriň arasynda bolarsyň.",
      },
      {
        excerpt: "Olara dinde çyn ýürekden ybadat etmekden başga buýruk berilmedi.",
      },
    ],
    hadith: [
      {
        excerpt: "Hereketler diňe niýet bilen bolýar we her bir adamyň diňe islän zady bolar.",
      },
    ],
    actions: [
      "Tewhidiň esaslaryny ygtybarly alymlardan öwreniň.",
      "Ybadat amallaryndan öň niýetiňizi täzeläň.",
      "Gizlin görkezilendigi üçin bagyşlaň (riýa).",
    ],
  },
  {
    title: "Namaz - sütün",
    summary: "Gündelik bäş namazy okamak iň uly amallaryň biridir.",
    body: [
      "Namaz - bäş günlük doga - yslamyň ikinji sütünidir we gündelik ybadatyň merkezi. Pygamberimiz namazy diniň sütüni hökmünde suratlandyrdy: kim ony esaslandyrsa, dini esaslandyrar, kim oňa ähmiýet bermese, tutýan zatlarynyň köpüsini ýykar. Bu imanlynyň, Allatagala bilen göni baglanyşykda durup, baş egip, setrde edip, Rebbi bilen her gün bäş gezek görüşmegi.",
      "Pygamberimiziň Kyýamat güni aýdanlary sebäpli amaly derejesi bilen deňeşdirip bolmaýar: hyzmatkäriň ilkinji nobatda namaz okalmagydyr. Eger dogry bolsa, galan amallar dogry bolar; ýetmezçiligi bolsa, galanlary howp astyndadyr. Bu durmuşda-da doga arassalanmagyň serişdesidir - Pygamber alaýhyssalam bäş namazy bir adamyň gapysynda akýan derýa bilen deňeşdirdi: kim günde bäş gezek suwa düşse, hapa galmaz, şonuň üçin dogalar ownuk günäleri ýuwýar.",
      "Prayeröne doga fiziki hereketlerden has köp diýmekdir. Gurhan 'namazynda kiçigöwünlileri' öwýär (Gurhan 23: 1-2) we 'namazynda hemişe bolanlary' hormatlaýar (Gurhan 70: 22-23). Iki häsiýet iň möhümdir: huşu - Allanyň huzurynda durandygyny bilýän häzirki, kiçigöwünli ýürek we her dogany öz wagtynda goraýan yzygiderlilik. Jemgyýetde doga etmek, başarýanlar üçin sylagy birnäçe esse köpeldýär.",
      "Namazyň has çuňňur paýhasy özgerişdir. Dogry ýerine ýetirilen doga adamy ahlaksyzlykdan we nädogry hereketlerden saklaýar; işli günüň dowamynda ýüregi Allaha çekýän gaýtalanýan täzeden düzmek. Dogry bahana bolmazdan dilegleri ýitirmek, çyn ýürekden toba etmegi we olary düzmegi talap edýän möhüm mesele. Nafl we rawatib - farzdan öň we soň yzygiderli sünnet namazlary - has köp yşyk goşýar we derejesini ýokarlandyrýar.",
      "Iş ýüzünde: gündelik bäş namazy iň möhüm wezipe hökmünde goraň, ýitiren zatlaryňyzy düzüň we dowam etdirip boljak sünnet namazlaryny goşuň. Doga-dilegiňiz gowulaşsa, ybadatyňyzdaky beýleki zatlar hem gowulaşýar.",
    ],
    quran: [
      {
        excerpt: "Hakykatdanam imanlylar - dogalarynda kiçigöwünliler üstünlik gazanýarlar.",
      },
      {
        excerpt: "Namaz okaýanlardan başga - doga-dileglerinde hemişe bolanlar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Hyzmatkäriň kyýamat güni jogapkärçilige çekiljek ilkinji meselesi, onuň dogasydyr. Eger dogry bolsa, üstünlik gazandy; kemçilikli bolsa, şowsuzlyga uçrady.",
      },
      {
        excerpt:
          "Biriňiziň gapyňyzda günde bäş gezek suwa düşýän derýa bar bolsa, üstünde hapaçylyk galarmy? Diýdiler: No.ok. Ol aýtdy: Bäş doganyň meňzeşligi - Allatagala olaryň günälerini süpürýär.",
      },
    ],
    actions: [
      "Gündelik bäş namazy öz wagtynda saklaň.",
      "Geçirilen dogalary tüýs ýürekden düzüň.",
      "Mümkin bolan ýeriňizden öň we soň sünnet namazlaryny goşuň.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Tüýs ýürekden toba",
    summary: "Allatagala hemişe özüne gaýdyp gelýänleri söýýär.",
    body: [
      "Tawba günäden soň Allaha ýüzlenýär. Tüýs ýürekden toba etmegiň (tawbah nasuh) aýdyň sütünleri bar: edilen zatlar üçin ýürekden çyn ýürekden ökünmek, günäni derrew duruzmak we hiç haçan gaýdyp gelmezlik baradaky berk karar - eger günä başga birine zulum etmek, hukugyny dikeltmek ýa-da günäsini geçmek bilen baglanyşykly bolsa. Bu ýekeje waka däl-de, ömürboýy gaýdyp gelmek, Allah her bir imanly üçin açyk gapydyr.",
      "Munuň ähmiýeti, hiç bir adamyň günäden azat bolmagydyr, şonuň üçin toba günäkärler üçin däl-de, hemmeler üçin. Pygamberimiz Adam atanyň her bir çagasynyň günä edýändigini, günä edenleriň iň gowusynyň toba edenlerdigini aýtdy. Allah hyzmatkäriň toba etmegini tä ruh bokurdagyna ýetýänçä kabul edýär, hatda günbatardan çykýan gün hem dünýä üçin iň soňky möhletdir - şoňa çenli çakylyk dur.",
      "Geň galdyryjy zat, Allah diňe gaýdyp gelýän hyzmatkäre çydam etmeýär - Ol begenýär. Pygamber alaýhyssalam, düýäniň ähli iýmitleri we suwlary bilen aýlanyp, soň ýene-de tapylan adamsyz çölde, durmuşdan umytsyzlyga uçran adama garanyňda, Allanyň gulunyň toba etmeginden has hoşaldygyny aýtdy. Bu uly şatlygyň şekili, toba eden hyzmatkäriň Rebbine nähili söýgüdigini aýdýar.",
      "Paýhas çuňňur: günä adamyň hekaýasynyň soňy bolmaly däldir. 'Allah olaryň ýaman işlerini ýagşylyk bilen çalşar' (Gurhan 25:70) - tüýs ýürekden toba etmek şowsuzlygyň ýazgysyny üstünlige öwrüp biler we adamy Allaha has ýakynlaşdyrýan täze başlangyja öwrüp biler. Günäden soň umytsyzlygyň özi Şeýtanyň duzagydyr; Allanyň rahmetine umyt etmek imanlynyň beren jogabydyr.",
      "Iş ýüzünde: tobaňyzy bir gün yza süýşürmäň - süýşen pursatyňyzy yzyna gaýtaryň. Öçürmek üçin her bir erbet işiňize eýeriň we pygamberiň günäsiniň geçilmegine garamazdan her gün birnäçe gezek bagyşlanmagyny edişi ýaly, günüň dowamynda diliňizde istigfar akymyny dowam etdiriň.",
    ],
    quran: [
      {
        excerpt:
          "Eý iman edenler, çyn ýürekden toba edip Allaha ýüz tutuň - belki, Perwerdigäriňiz eden işleriňizi aýyrar we derýalaryň aşagyndaky baglara kabul eder.",
      },
      {
        excerpt:
          "Toba eden, iman eden we dogry amallary edenlerden başga - Allatagala olaryň ýaman işlerini ýagşylyk bilen çalşar we Alla bagyşlaýjy we rehimdardyr.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allatagala gulynyň toba etmeginden has hoşal, düýpsiz bir ýerde düýäni ýitirip, birden ýene tapdy.",
      },
    ],
    actions: [
      "Günä edeniňizde derrew toba ediň - yza süýşürmäň.",
      "Günäni ýok etmek üçin ýagşy amal bilen yzarlaň.",
      "Günüň dowamynda istighfar diýiň.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Gurhan",
    summary: "Allanyň kitaby bilen okaň, ýat tutuň we ýaşaň.",
    body: [
      "Gurhan, Allanyň göçme manysy, rehimdarlyk we ýüreklere şypa hökmünde aýan edilen söz. Munuň bilen gatnaşyk gurmak - ony okamak, manylary hakda pikirlenmek, buýruklaryny ýerine ýetirmek we başgalara öwretmek - imanly adamyň ömrüni bagyşlap biljek iň uly we iň peýdaly ybadatlarynyň biridir. Bu Allanyň bize uzan ýüpi; kim oňa berk ýapyşsa, göni ýola düşer.",
      "Oňa berlen sogaplar adatdan daşary. Pygamber alaýhyssalam, Allatagala öz kitabyny okaýanlara we namaz okaýanlara hiç wagt ýitip bolmajak uly sylag berýändigini we Gurhan 35: 29-30) we okalýan her bir hat üçin sylagyň on esse köpelendigini öwretdi. Hatda sözleriň üstünde göreşip, büdrän adamyň, synanyşmagyny dowam etdirýänçä, goşa sylagy bar - biri okaýyş üçin, beýlekisi tagalla üçin.",
      "Gurhan, indiki durmuşda adamyň derejesini gönüden-göni we ýokary derejede ýokarlandyrýar. Pygamber alaýhyssalam Gurhany kerimiň kyýamat güni aýdyljakdygyny aýtdy: 'Dünýäde okaýşyňyz ýaly okaň we ýokary çykyň we okaň, sebäbi derejäňiz iň soňky okaýan aýatyňyzda bolar'. Başga sözler bilen aýdylanda, Jennetdäki orny Kitabyň bir bölegi bilen ädim ätýär - ýatda saklamagy we gözden geçirmegi dowam etdirmek üçin ajaýyp höwes.",
      "Çuňňur maksat, diňe özi üçin okamak däl-de, özgerişdir. Allatagala bize 'Gurhany ölçenen rekagat bilen okamagy' buýurýar (Gurhan 73: 4), şonuň üçin manylar çümüp, pikir edişimizi, duýgymyzy we özümizi alyp barşymyzy üýtgeder. Gurhan diňe bir okalman, ýaşamak üçin iberildi; sahabalar on aýaty öwrenerdiler we düşünýänçäler hereket etmezdiler.",
      "Iş ýüzünde: her gün bir bölümi, hatda birnäçe aýaty okaň, ýöne olary oýlanmak bilen okaň. Täze süreleri ýatda saklaň ýa-da öňden bilýänleriňizi saklaň we iň esasysy, has köp zat öwrenmek üçin howlukmazdan ozal öwrenen zatlaryňyzy ýerine ýetiriň.",
    ],
    quran: [
      {
        excerpt:
          "Allanyň kitabyny okaýanlar, namaz okaýanlar we üpjün eden zatlarymyzdan harçlaýanlar - sylaglaryny doly berip, bereketinden artdyrmagy üçin hiç wagt ýitip gitmejek söwda umyt edýärler.",
      },
      {
        excerpt: "Gurhany ölçegli okaň.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Gurhanyň ýoldaşyna şeýle diýiler: Dünýäde okaýşyňyz ýaly okaň we ýokary çykyň we okaň, sebäbi derejäňiz iň soňky okan aýatyňyzda bolar.",
      },
    ],
    actions: [
      "Her gün okaň - hatda pikirlenmek bilen birnäçe aýat.",
      "Täze süreleri ýatda saklaň ýa-da bilýänleriňizi saklaň.",
      "Has köp zat gözlemezden ozal öwrenen zatlaryňyza görä hereket ediň.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Dikr - ýatlama",
    summary: "Dilde ýagtylyk, masştabda agyr.",
    body: [
      "Zikr, Allany ýatlamak - şöhrat (SubhanAllah), öwgi (Alhamdulillah), ulaltmak (Allahu Akbar), ýeke-täkligini tassyklamak (istighfar) sözleri bilen ýüreginde we dilde bolmagyny aňladýar. Jennete barýan ähli ýollardan, iň uly sylaglaryň arasynda ýerine ýetirmek iň aňsatlaryndan biridir, sebäbi islendik ýerde, islendik ştatda, islendik pursatda edilip bilner.",
      "Allanyň Özi muny sahylyk bilen buýurýar - 'Eý iman edenler, Allany köp ýatlaň' (Gurhan 33: 41–42) we munuň üçin ajaýyp miwäni wada berýär: ýürek rahatlygy. 'Takyk, Allany ýatlamak bilen ýürekler rahatlyk tapar' (Gurhan 13:28). Aladasyz, aladaly dünýäde bu dikriň iň uly sowgatlaryndan biridir. Pygamberimiz, diline ýeňil, ýöne Terezide agyr we iň merhemetli iki sözüň SubhanAllahi wa bihamdihi, SubhanAllahil-Azeemdigini aýdyp, sylagyny ölçäpdir.",
      "Specialörite kategoriýa, ertir we agşam adhkar - Pygamberimiziň günüň iki çäkleri üçin öwreden hakyky dilegleri. Bular imanly adamy zyýandan goraýan we Allanyň goragyny we lezzetini alýan ruhy gala hökmünde hereket edýär. Her günüň başynda we ahyrynda bary-ýogy birnäçe minut wagtyň geçmegi bilen ýüregi ýuwaşlyk bilen üýtgediň.",
      "Zikriň hikmeti, resmi ybadat amallarynyň arasynda Allah bilen gatnaşygy dowam etdirýär. Mematlamak bilen çygly we has möhümi, Allany gündelik saýlamalarynda ýatlaýan ýürek - gahardan, satyn almazdan ozal, karar bermezden dynmak - hakyky maksat. Dikr dodaklarda galmak üçin däl; durmuşy dolandyrmak üçin niýetlenendir.",
      "Iş ýüzünde: ertir we agşam adhkaryny gündelik endige öwüriň, tasbeeh, istighfar ýa-da salawatyň ýönekeý bir bölegini boş pursatlarda akdyryň we esasanam ukudan we oýanmazdan ozal Allany ýatlaň. Az salymlykdaky yzygiderlilik köp zadyň ýarylmagyndan gowudyr.",
    ],
    quran: [
      {
        excerpt:
          "Iman edenler we ýürekleri Allany ýatlamakda rahatlyk tapýanlar, elbetde, Allany ýatlamakda ýürekler rahatlyk tapýarlar.",
      },
      {
        excerpt: "Eý iman edenler, Allany köp ýatlaň we ertir we agşam Ony şöhratlandyryň.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Iki söz dilde ýeňil, Terezide agyr we iň rehimdarlara söýgüli: SubhanAllahi wa bihamdihi, SubhanAllahil-Azeem.",
      },
    ],
    actions: [
      "Her gün irden we agşam doly adhkar.",
      "Istighfar ýa-da salawat üçin tasbeeh hasaplaýjyny ulanyň.",
      "Sleepatmazdan ozal we oýanandan soň Allany ýatlaň.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Haýyr-sahawat we zekat",
    summary: "Allanyň beren zatlaryndan gizlin we aç-açan harçlaň.",
    body: [
      "Yslam möminlere Allanyň özüne tabşyran baýlygyndan hökmany we meýletin bermegi buýurýar. Zekat, yslamyň bäş sütüniniň biri bolan baýlygy saýlamak üçin hökmany ýyllyk tölegdir we şertlerine laýyk gelýänler üçin hökmany däl. Munuň aňyrsynda sadaka dur: Allanyň razylygy üçin islendik wagt meýletin sadaka bermek.",
      "Allanyň işine sarp etmegiň peýdasy adaty arifmetikadan has köpelýär. Allatagala öz ýoluny sarp edenini ýedi gulak ösdürip ýetişdirýän, her gulagynda ýüz däne göterýän bir däne bilen deňeşdirýär - 'we Alla islänine köpelýär' (Gurhan 2: 261). Baýlygy azaltmakdan uzakda, haýyr-sahawat ony arassalaýar we barakada köpeldýär, suw bolsa ody öçürýär.",
      "Haýyr-sahawatyň iki görnüşi aýratyn bellemelidir. Birinjisi, gizlin haýyr-sahawat bolup, şeýle paýhas bilen berilýär welin, Pygamberiň aýdyşy ýaly, çep el sag eliň näme berenini bilenok - bu yhlas, Allaha has gowy görülýär we kyýamat güni adama kölege berýär. Ikinjisi, ölümden soň peýdasy dowam edýän haýyr-sahawat sadaka jariýa. Pygamber alaýhyssalam, adam ölende amallarynyň üçüsinden başga gutarýandygyny aýtdy: dowamly haýyr-sahawat, başgalara peýdaly bilim we onuň üçin doga edýän dogruçyl çaga.",
      "Haýyr-sahawatyň pähim-paýhasy, berijiniň kabul edijisi ýaly işlemegidir. Heartürekdäki açgözlügi gowşadýar, rehimdarlygy döredýär, jemgyýetiň gatnaşyklaryny güýçlendirýär we baýlara hakyky eýeler däl-de, ynamdar adamlardygyny ýatladýar. Yslam haýyr-sahawat kesgitlemesini giňeldýär, şonuň üçin hiç kim aýrylmaýar: Pygamber alaýhyssalam, doganyňyza ýylgyrmagyň, peýdaly sözüň we hatda zyýanly zady ýoldan çykarmagyň hem sadakanyň bir görnüşidigini öwretdi.",
      "Iş ýüzünde: zekat üçin jogapkär bolsaňyz, hasaplaň we takyk töläň; kiçijik bolsa-da, yzygiderli sadaka beriň, bermek hadysa däl-de, endige öwrüler; we dowamly sadaka jariýasyny gözläň - bir okuwça hemaýat bermek, guýyny maliýeleşdirmek ýa-da metjidi goldamak - gideniňizden soň size baýrak berer.",
    ],
    quran: [
      {
        excerpt:
          "Baýlygyny Allanyň ýoluna sarp edenleriň mysaly, ýedi gulak, her gulagynda ýüz däne ösýän däne ýalydyr. Allatagala islänine köpelder.",
      },
      {
        excerpt:
          "Ölüm siziň biriňiziň ýanyna gelmezden ozal beren zatlarymyzdan harçlaň we ol şeýle diýýär: “Lorda Reb, eger sen meni biraz gijä goýsaň, haýyr-sahawat edip, dogruçyllaryň arasynda bolaryn.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Adam ölende, amallary üçden başga gutarýar: dowam edýän haýyr-sahawat, peýdaly bilim ýa-da onuň üçin doga edýän dogruçyl çaga.",
      },
    ],
    actions: [
      "Jogapkärçiligiňiz bolsa zekaty hasaplaň we töläň.",
      "Kiçijik bolsa-da yzygiderli haýyr-sahawat beriň.",
      "Sadaka jariyah mümkinçiliklerini gözläň.",
    ],
    appLinks: [{}],
  },
  {
    title: "Gowy häsiýet",
    summary: "Terezide iň agyr zat ajaýyp edep bolup biler.",
    body: [
      "Gowy häsiýet (husn al-khuluq), imanly adamyň Allanyň ýaradan zatlary bilen iş salyşýan asylly häsiýetleriniň ýygyndysydyr: dogruçyllyk, sabyrlylyk, pespällik, rehimdarlyk, sahylyk, ýumşaklyk we wadalary ýerine ýetirmek. Yslam diňe bir sypaýyçylyk bolmakdan daşda, häsiýeti imanyň esasy çäresi we kyýamat gününe çenli alyp barjak iň agyr işleriniň biri hasaplaýar.",
      "Onuň derejesi iň aç-açan aýdylýar. Pygamberimiz, Terezide gowy häsiýetden has agyr zat ýerleşdirilmeýändigini we imanda iň doly ynanýanlaryň iň gowy häsiýetli adamlardygyny aýtdy. Hatda özüniň asylly gylyk-häsiýetlere iberilendigini aýdyp, öz wezipesini jemledi. Bu, ene-ataňyza, ýanýoldaşyňyza, çagalaryňyza, goňşularyňyza we hatda nätanyş adamlara bolan garaýşyňyz ybadatyňyzdan aýry däldigini aňladýar - bu onuň merkezi bölegidir.",
      "Gözel häsiýet, Pygamberimiziň wada berip biljek zatlary sebäpli güýçlidir: gowy gylyk-häsiýetleri bilen imanly, bütin gün agyz bekleýän we bütin gije namaz okaýan adamyň derejesine ýetip biler. Başga sözler bilen aýdylanda, ajaýyp häsiýet adaty adamy iň wepaly ybadatçylaryň derejesine çykaryp biler, sebäbi kyn, hemişelik we her pursatda öz-özüňi synap görýär - gaharyňy saklamak, kemsitmäni bagyşlamak we gödeklik has aňsat bolanda ýumşaklygy saýlamak.",
      "Paýhas, Yslam diňe bir adam bilen Allanyň arasyndaky şahsy gatnaşyk däl; biriniň töweregindäkilere nähili garaýandygyna göz ýetirmek üçin niýetlenendir. Doga-dilegi amallaryny ýumşatmaýan ybadatçy, gowy häsiýetiň özi dawah bolup, adamlary janly görelde arkaly imana tarap çekýän nokady ýitirdi. Şonuň üçin tekstlerde Allaha ybadat etmek, ýaradylyşyna ajaýyplyk bilen gaýtalanýar.",
      "Iş ýüzünde: bir gezekde bir häsiýetiň üstünde işläň - gaharlananyňyzda diliňizi saklaň, size zulum edenleri bagyşlaň, bozulan gatnaşyklaryňyzy düzediň we wadalaryňyzy gymmatlasa-da ýerine ýetiriň. Namazdan soň şol gün adamlara nähili garanyňyz barada gysgaça pikirlenmek, durnukly ösmegiň ýönekeý usulydyr.",
    ],
    quran: [
      {
        excerpt: "Hakykatdanam, siz beýik we asylly häsiýetli.",
      },
      {
        excerpt:
          "Easyeňillik we kynçylyk bilen geçirýänler, gahar-gazabyny saklaýan we adamlary bagyşlaýanlar we Allatagala ýagşylyk edýänleri söýýär.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kyýamat güni imanlylaryň terezisinde gowy häsiýetden has agyr zat ýok. Hakykatdanam, Allah ahlaksyz we gödek adamy halamaýar.",
      },
      {
        excerpt:
          "Imanly imanlylaryň arasynda iň oňat häsiýetli adamlar, iň gowusy bolsa aýallaryna iň gowusydyr.",
      },
    ],
    actions: [
      "Gahary gelende sabyr ediň.",
      "Başgalary bagyşlaň we bozulan gatnaşyklary düzediň.",
      "Gündelik journalurnalda namazdan soň häsiýetiňiz hakda pikirleniň.",
    ],
    appLinks: [
      {},
      {
        label: "Sins against others",
      },
    ],
    characterTraits: [
      {
        title: "Dogruçyllyk",
        summary: "Sözde we işde dogry bolmak.",
        quran: {
          excerpt: "Dogruçylaryň ýanynda boluň.",
        },
      },
      {
        title: "Sabyr",
        summary: "Synagda çydamly bolmak.",
        quran: {
          excerpt: "Alla sabyr edýänler bilendir.",
        },
      },
      {
        title: "Gahary dolandyrmak",
        summary: "Gaharda özüňi saklamak.",
        hadith: {
          excerpt: "Güýçli kişi gaharda özüni saklaýandyr.",
        },
      },
      {
        title: "Bagyşlamak",
        summary: "Adamlaryň hatasyny bagyşlamak.",
        quran: {
          excerpt: "Bagyşlasynlar we geçsinler.",
        },
      },
      {
        title: "Pespällik",
        summary: "Özüni beýlekilerden ýokary görmezlik.",
        hadith: {
          excerpt: "Kim Alla üçin pespäl bolsa, Alla ony beýgelder.",
        },
      },
      {
        title: "Amanatdarlyk",
        summary: "Ynananyp berleni goramak.",
        quran: {
          excerpt: "Olar amanatlaryna we wadalaryna wepaly bolýarlar.",
        },
      },
      {
        title: "Ene-ata",
        summary: "Hormaty we aladany berjaý etmek.",
        quran: {
          excerpt: "Olara «uf» hem diýmäň.",
        },
      },
      {
        title: "Gowy söz",
        summary: "Gowy zat aýtmak ýa-da dymmak.",
        hadith: {
          excerpt: "Gowy söz aýtsyn ýa-da dymsyn.",
        },
      },
      {
        title: "Ýylgyrmak",
        summary: "Dogana açyk ýüz görkezmek.",
        hadith: {
          excerpt: "Doganyňa ýylgyrmak sadakadyr.",
        },
      },
      {
        title: "Adalat",
        summary: "Hemmeler bilen adalatly bolmak.",
        quran: {
          excerpt: "Adalatly boluň, ol takwaçylyga has ýakyndyr.",
        },
      },
    ],
    characterDestroyers: [
      {
        title: "Ýalan",
      },
      {
        title: "Gybat",
      },
      {
        title: "Ösekilik",
      },
      {
        title: "Tekepbirlik",
      },
      {
        title: "Zulum",
      },
      {
        title: "Wadany bozmak",
      },
      {
        title: "Masgaralamak",
      },
      {
        title: "Gatyýüreklilik",
      },
    ],
  },
  {
    title: "Bilim gözlemek",
    summary: "Allatagala bilim gözleýän adam üçin Jennete barýan ýoly aňsatlaşdyrýar.",
    body: [
      "Peýdaly bilim gözlemek - Allanyň we Resulynyň öwreden zatlaryny öwrenmek, soň hereket etmek we dowam etdirmek - ybadat görnüşidir we hökmany suratda her bir musulman üçin borçdyr. Bu ynamy aýdyňlaşdyrýan, ybadaty arassalaýan we dogry bilen ýalňyşlygy tapawutlandyrýan mukaddes bilimdir; görkezmek üçin bilim däl, hereketi ugrukdyrýan ýagtylyk.",
      "Pygamberimiz bu ugry gönüden-göni bu syýahatyň maksady bilen baglanyşdyrdy: 'Kim bilim gözlemek üçin bir ýol alsa, Allatagala oňa Jennete barýan ýoly aňsatlaşdyrar'. 'Pathol' göçme manyda we göçme manyda - Allah gözleýän adamyň bu durmuşdaky ýoluny ýeňilleşdirýär we indiki gün Janna barýan ýoluny ýeňilleşdirýär. Şeýle hem, perişdeleriň bilim gözleýänleri makullamak üçin ganatlaryny aşak düşürýändiklerini, asmanda we ýerdäki ähli zatlaryň, hatda deňizdäki balyklaryňam gowy zat öwredýäninden ötünç soraýandygyny öwretdi.",
      "Bilim, ölümden soň adamy sylaglamagy dowam etdirýän seýrek işleriň biridir. Pygamberimiz, dowam edýän haýyr-sahawat we dogruçyl çaga bilen birlikde gabyrda dowam edýän üç zadyň arasynda peýdaly bilimleri atlandyrdy. Şonuň üçin bir peýdaly meseläni öwretmek - kimdir birine dogry doga etmegi öwrenmek, hakyky hadys paýlaşmak ýa-da adamy hakykata ugrukdyrmak - ýyllar boýy, hatda nesiller üçinem akýan akym bolup biler.",
      "Akyldar, bilimsiz hereket kör we hereketsiz bilim netijesizdir. Dogry bilim adamy täzelikden we ýalňyşlykdan goraýar, yhlasy çuňlaşdyrýar we oňa diňe özüne peýdasy degmän, başgalara peýdaly bolmak ukybyny berýär. Yslam alymlary iki howpdan elmydama duýduryş berdiler: nadan hereket etmek we hereket etmezden bilmek.",
      "Iş ýüzünde: peýdaly bir zady yzygiderli öwrenmegi ýüregiňize düwüň - gündelik ybadatyňyz üçin zerur bir aýat, hadys, höküm. Ynam, doga, arassalanmak we esasy gadagançylyklardan başlaň, soňra ýuwaş-ýuwaşdan çuňlaşyň. Öwrenen zatlaryňyzy kiçigöwünlilik bilen paýlaşyň we elmydama ilki özüňize ulanyň.",
    ],
    quran: [
      {
        excerpt: "Aýt: Bilýänler bilmeýänlere deňmi? Diňe düşünýänler üns berýärler.",
      },
      {
        excerpt: "We aýdyň: Lorda Reb, meni bilimde artdyr.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim bilim gözlemek üçin ýol alsa, Allatagala oňa Jennete barýan ýoly aňsatlaşdyrar.",
      },
      {
        excerpt:
          "Adam ölende, amallary üçden başga gutarýar: dowam edýän haýyr-sahawat, peýdaly bilim ýa-da onuň üçin doga edýän dogruçyl çaga.",
      },
    ],
    actions: [
      "Her hepde peýdaly bir zady öwreniň.",
      "Ulumsylyksyz bilim paýlaşyň.",
      "Has köp ýygnamazdan ozal öwrenen zatlaryňyzy ulanyň.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Meýletin ybadat",
    summary: "Hökmlerden artyk nafl arkaly Allaha ýakynlaşyň.",
    body: [
      "Meýletin ybadat (nafl), imanly adamyň Allanyň farz edeninden has ýokary sadaka - goşmaça doga, goşmaça oraza, goşmaça haýyr-sahawat we ýatlamalary aňladýar. Borçlar ilki gelýär we gepleşik geçirip bolmaýar, ýöne ýerine ýetirilenden soň, nafl hyzmatkäriň talap edilýän iň az derejeden geçýän söýgini, ýakynlygy we höwesini görkezýär.",
      "Oňa haýran galdyryjy wada bar. Allatagala şeýle diýýär: 'Hyzmatkärim, maňa farz edenimden has söýgüli zat bilen Maňa ýakynlaşmaýar. Onsoňam, men ony söýýänçäm, meýletin işler bilen Maňa ýakynlaşmagyny dowam etdirýär 'we Allatagala bir hyzmatkäri söýensoň, dileglerine jogap berilýär we işleri düzedilýär. Meýletin ybadat, diňe boýun bolmakdan ylahy söýgä çykmak bilen ýakynlygyň basgançagydyr.",
      "Sünnetiň elýeterli görnüşleri bilen baýdyr: gijäniň soňky böleginde gijeki namaz (tahajjud), deslapky namaz (duha), farzdan öň we soň yzygiderli sünnet namazlary, duşenbe, penşenbe ýa-da her aýyň ak günleri ýaly meýletin agyz beklemek. Nafl ybadaty kemçiliklerimizi ýuwaşlyk bilen açýar - Pygamberimiz, hökmany dogalarda kemçilikleriň kyýamat güni adamyň meýletin dogalaryndan tamamlanjakdygyny öwretdi.",
      "Paýhas, nafl imany ýaşadýar we ösýär. Borçlar esasy binýady saklaýar, ýöne meýletin hereketler ýüregiň uzalyp gidýän ýerinde, şahsy ybadat hiç kimiň görmeýän ýerinde we durmuşyň has kyn synaglary üçin özüni türgenleşdirýän ýerinde. Şeýle hem bu amallaryň islege bagly däldigi - Allatagala her bir adamyň özüne laýyk gelýänlerden geçip bilmegi üçin köp gapylary açýar.",
      "Iş ýüzünde esasy zat intensiwlik däl-de, dowamlylykdyr. Pygamber alaýhyssalam, Allaha iň söýgüli amallaryň kiçi bolsa-da iň yzygiderli bolandygyny öwretdi. Çyn ýürekden saklap boljak birnäçe meýletin amallary saýlaň - iki rekagat tahajjud, hepdede biri agyz beklemek, Gurhanyň belli bir bölegi - birnäçe günüň içinde ýanýan ägirt uly partlama däl-de.",
    ],
    quran: [
      {
        excerpt:
          "Taraplary gorky we umyt bilen Rebbine ýüz tutup, düşeklerini taşlaýarlar we bize beren zatlarymyzdan harçlaýarlar. Öňki edenleri üçin sylag hökmünde haýsy rahatlygyň gizlenýändigini hiç kim bilmeýär.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Hyzmatkärim maňa borçly edenimden has söýgüli zat bilen Maňa ýakynlaşmaýar. Hyzmatkärim, ony söýýänçäm, meýletin işler bilen Maňa ýakynlaşmagyny dowam etdirýär.",
      },
    ],
    actions: [
      "Diňe iki rekagat bolsa-da tahajjud dileg ediň.",
      "Mümkin boldugyça çalt meýletin günler.",
      "Farddan öň / soň yzygiderli sünnet namazlaryny goşuň.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Sabyr we minnetdarlyk",
    summary: "Allatagala sabyrly we şükür edýänleri söýýär.",
    body: [
      "Sabyr (sabr) we minnetdarlyk (şukr) imanly adamyň durmuşdan uçýan iki ganatydyr. Sabyr üç meýdançada tutanýerlilikdir: Allaha boýun bolmakda berk durmak, boýun egmezlikden saklamak we Onuň kararyna garşy şikaýat etmezden durmuş synaglaryny geçirmek. Minnetdarlyk, her bir nygmatyň Alladan gelendigini ykrar etmek we ýürekde, dilde we gulak asmak bilen jogap bermekdir. Olar bilelikde imanlynyň kynçylyklara we ýeňilliklere beren jogabyny öz içine alýarlar.",
      "Olaryň ähmiýeti, imanlynyň özüne bolup geçýän ähli zatlara nädip laýyk gelýändigini kesgitlemekdir. Pygamberimiz imanly adamyň ähli işiniň gowydygyna haýran galdy: ýagşylyk oňa ýetende minnetdar bolýar we özi üçin peýdaly bolýar, kynçylyk ýüze çykanda sabyr edýär we bu hem onuň üçin peýdaly - imanlydan başga hiç kime berilmedik bereket. Şonuň üçin näme gelse, imanlynyň sylag ýoly bar.",
      "Sabyrlylygyň sogaby özboluşly çäksizdir. Amallaryň köpüsi ölçenen köpeltmeler bilen sylaglansa-da, Allatagala şeýle diýýär: 'Näsaga sylagyny çäksiz berler' (Gurhan 39:10). Şükür etmek, artdyrmak wadasyny ýerine ýetirýär: 'Şükür etseňiz, hökman köpelderin' (Gurhan 14: 7). Şonuň üçin şükür etmek diňe bereketlere dogry jogap däl-de, olaryň ösmegine sebäp bolýan zat.",
      "Bu ýerdäki paýhas, görgüleri düýbünden täzeleýär. Synaglar awtomatiki jeza däl; Gowy jogap beren imanlylar üçin günäleri we derejäni ýokarlandyrýan tämizlik bolup biler. Pygamber alaýhyssalam, Alladan käbir günälerini ýok etmezden, bir ýadawlygyň, keseliň, aladanyň ýa-da tikeniň taýagynyň başyna düşmejekdigini öwretdi. Bu, durmuşyň iň kyn pursatlaryny arassa ýitgä däl-de, mümkinçiliklere öwürýär.",
      "Iş ýüzünde: betbagtçylyk ýüze çykanda, Allanyň öwreden sözleri bilen jogap beriň - 'Inna lillahi wa inna ilayhi raji'un' (Hakykatdanam biz Allaha degişlidiris we Oňa gaýdyp gelýäris) we diliňizi Onuň kararyny ret edýän şikaýatlardan saklaň. Gowy wagtlarda, nygmatlaryňyzy ses bilen hasaplaň we her gün iň bolmanda az sanlysy üçin Allaha şükür ediň; at dakmak ýüregi ýumşak we minnetdar saklaýar.",
    ],
    quran: [
      {
        excerpt:
          "Betbagtçylyk ýüze çykanda hassana hoş habar beriň: Hakykatdanam biz Allaha degişlidiris we hakykatdanam Oňa dolanarys. Olara Rebbiniň nygmatlary we rehimleri bar, dogry ýola düşenlerdir.",
      },
      {
        excerpt:
          "Şükür edýän bolsaňyz, hökman sizi artdyraryn; inkär etseň, hakykatdanam meniň jezam agyr.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ajaýyp, imanly adamyň işidir, sebäbi ähli işleri gowy. Aseeňillik gelse minnetdar, bu onuň üçin peýdalydyr; kynçylyk gelse sabyr edýär we bu onuň üçin peýdaly. Bu imanlydan başga hiç kim üçin däldir.",
      },
    ],
    actions: [
      "Synag geçirilende 'inna lillahi wa inna ilayhi raji'un' diýiň.",
      "Her gün üç nygmat üçin Allaha şükür.",
      "Allanyň emrini ret edýän görnüşde zeýrenmäň.",
    ],
  },
  {
    title: "Allaha çagyryş",
    summary: "Kim başga birine ýol görkezse, oňa eýeren ýaly sylag alar.",
    body: [
      "Dawa, başgalary Allaha çagyrmak - yslamyň habaryny paýlaşmak, adama doga etmegi öwretmek, ýagşylygy höweslendirmek, ýalňyşlygy ýuwaşlyk bilen ruhdan düşürmek ýa-da göreşýän musulmanyň boýun egmegine kömek etmek diýmekdir. Bu her bir pygamberiň borjydy we her biriniň ukybyna we bilimine görä jemgyýetiň umumy jogapkärçiligi. Bu alymlar üçin niýetlenen däldir; hatda bir peýdaly zady hem ýetirýän adam Allaha ýüzlenýär.",
      "Onuň sylagy, yslamyň iň jomartlaryndan biridir. Pygamber alaýhyssalam, kimdir birini ýagşylyga ugrukdyrýan bolsa, oňa amal eden ýaly sylagyň bardygyny aýtdy we başga bir rowaýatda kim ýol görkezmäge çagyrsa, oňa eýerenleriň hemmesiniň sylagyny aljakdygyny, öz sylagynyň az-kem azalmaýandygyny aýtdy. Diýmek, hereket eden ýagşylygyňyz, dowam edeniňizden ep-esli wagt soň, sylagyňyzy degen her bir adamyň üsti bilen köpeldip biler.",
      "Emma dawanyň üstünlik gazanmagy üçin hormat goýulmaly bir adab bar. Allah emr edýär: 'Paýhas we gowy öwüt bilen Rebbiňiziň ýoluna çagyryň we olar bilen iň oňat jedel ediň' (Gurhan 16: 125). Paýhas, dogry zady, dogry adama, dogry we wagt diýmegi aňladýar; gödeklik, ulumsylyk we bal gazanmak adamlary daşlaşdyrýar we maksadyna dönüklik edýär. Jaň edeniň işi, diňe Allaha degişli ýürekleri zorlamak däl-de, ýetirmek we ekmek.",
      "Beýle uly sylagy başgalara ýol görkezmek üçin paýhas, her bir imanlyny dowam etdirýän ýagşylygyň çeşmesine öwürýär. Şeýle hem, jaň edeniň öz imanyny goraýar: başgalary doga, dogruçyllyk we ybadat üçin çagyrmak, özüne berk ýapyşmagy ýatlatmakdyr. Jemgyýeti birek-birege äsgermezlik däl-de, birek-birege ideg etmekde baglanyşdyrýar.",
      "Iş ýüzünde, öýe ýakyn başlaň. Maşgalaňyzy gowulaşdyryň we öwrediň - ýanýoldaşyňyz, çagaňyz, doganyňyz - sebäbi bu siziň ilkinji we dowamly jogapkärçiligiňizdir. Peýdaly bilimleri hoşniýetlilik bilen paýlaşyň, birine Gurhany okamagy ýa-da okamagy öwrenmäge kömek ediň we gowy häsiýetli we yzygiderli ybadat durmuşynyň köplenç iň ynandyryjy dawadygyny ýadyňyzdan çykarmaň.",
    ],
    quran: [
      {
        excerpt:
          "Paýhas we gowy görkezme bilen Rebbiň ýoluna çagyryň we iň oňat görnüşde olar bilen jedel ediň.",
      },
      {
        excerpt:
          "Sözleýişde Allaha çagyrýan, dogruçyllyk edýän we: “Hakykatdanam, men musulmanlardan.",
      },
    ],
    hadith: [
      {
        excerpt: "Kim kimdir birini ýagşylyga ugrukdyrsa, ony eden ýaly sylag bolar.",
      },
    ],
    actions: [
      "Peýdaly bilimleri hoşniýetlilik bilen paýlaşyň.",
      "Birine Gurhan okamagy ýa-da okamagy öwrenmäge kömek ediň.",
      "Köpçülikde gowy gylyk-häsiýetiň mysaly boluň.",
    ],
  },
  {
    title: "Ömürboýy esasy işler",
    summary: "Haj, maşgala we dowamly haýyr-sahawat.",
    body: [
      "Yslam gündelik we hepdelik ybadatlar bilen bir hatarda imanly adamy, ömürboýy möhüm işlerine - sylagy ummasyz we käbir halatlarda soňuna çykmajak uly maýa goýumlaryna gönükdirýär. Bular töweregindäki durmuşy meýilleşdirmäge degişli taslamalar: zyýarat, dogruçyl maşgalany terbiýelemek we dowamly gowy işler gurmak.",
      "Olaryň arasynda iň esasysy, yslamyň bäşinji sütüni bolup, ömründe bir gezek fiziki we maddy taýdan ukyply her bir musulman üçin hökmanydyr - 'Öýe haj etmek, ýol tapyp bilýän adamlar tarapyndan Allaha bergidir' (Gurhan 3:97). Onuň sylagy doly arassalanmakdyr: Pygamber alaýhyssalam, Allanyň razylygy üçin haj eden we ahlaksyzlykdan we günäden gaça durýan adamyň, ejesiniň dünýä inen güni ýaly arassa günäden dolanyp geljekdigini aýtdy. Kabul edilen Hajyň Jennetden pes sylagynyň ýokdugyny aýtdy. Kiçijik zyýarat bolan Umra hem uly sylag alyp, bir umra bilen beýlekisiniň arasyndaky günäleri süpürýär.",
      "Ikinji uly maýa goýum, sadaqah jariyah - ölümden soň adamy sylaglamagy dowam etdirýän haýyr-sahawat. Pygamber alaýhyssalam, mazardaky adama peýda getirmegi dowam etdirýän üç zadyň arasynda peýdaly bilimler we onuň üçin doga edýän dogruçyl çaga bilen atlandyrdy. Çagalary iman we gowy häsiýetde terbiýelemek, belki-de iň ulusydyr, ýöne metjit gurmak ýa-da goldamak, guýy gazmak, ýetime hemaýat bermek, agaç ekmek ýa-da bilimi maliýeleşdirmek - bularyň her biri berijiden has ýokary baýrakdyr.",
      "Bu amallaryň pähim-paýhasy, adamyň hasabyny ömrüniň çäginden has uzaltmakdyr. Bir imanly adamyň işjeň ýyllary gysga, ýöne gazylan guýy ýa-da gowy terbiýelenen çaga asyrlar boýy sylag gazanyp biler. Yslam şeýlelik bilen uzak möhletli görüşi höweslendirýär: diňe şu günki doga hakda däl-de, gideniňizden soň size haýsy ýagşylygyň akjakdygy hakda pikirlenmek.",
      "Iş ýüzünde: başarsaňyz, Haj ýa-da Umra üçin tükeniksiz yza süýşürmegiň ýerine çynlakaý meýilleşdiriň. Maşgalaňyzyň imanyna we häsiýetine hakyky güýç goşuň, sebäbi olar siziň iň dowamly mirasyňyzdyr. Iň oňat işleriňiz ölümden soň dowam etdirilmegi üçin iň bolmanda bir dowamly haýyr-sahawat taslamasyny - bilim, suw, başpena ýa-da ýetim kesgitläň.",
    ],
    quran: [
      {
        excerpt: "Öýe haj etmek, oňa ýol tapyp bilýän adamlar tarapyndan Allaha bergidir.",
      },
      {
        excerpt:
          "Adamlara hajy wagyz ediň; özleri üçin peýdalara şaýat bolar ýaly, uzak aralykdan pyýada we her düýe üstünde size gelerler.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim Allanyň razylygy üçin haj etse, biabraýlyk we hyýanat etmese, ejesiniň dünýä inen güni ýaly günäden azat bolar.",
      },
      {
        excerpt:
          "Adam ölende, amallary üçden başga gutarýar: dowam edýän haýyr-sahawat, peýdaly bilim ýa-da onuň üçin doga edýän dogruçyl çaga.",
      },
    ],
    actions: [
      "Başarsaňyz, Hajy ýa-da Umrany meýilleşdiriň.",
      "Maşgalaňyzyň imanyna we häsiýetine maýa goýuň.",
      "Dowamly haýyr-sahawat taslamasyna goldaw beriň.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Allanyň rahmeti - soňky söz",
    summary: "Amallar diýmekdir; girmek Onuň rahmeti bilen.",
    body: [
      "Allhli amallardan, ähli yhlaslardan we ähli ýollardan soň imanly bu syýahatda iň soňky söz bolan kiçigöwünli hakykata gelýär: ýeke özi eden işleri sebäpli hiç kim Jennete girmeýär. Pygamber alaýhyssalam, Allah hakda ähli ýaradylanlaryň arasynda iň söýgüli hakda, Allatagalanyň rehim-şepagatyndan başga-da öz amallary bilen Jennete girip bilmejekdigini aýtdy. Eger onuň üçin şeýle bolsa, elbetde biziň üçinem şeýle.",
      "Ybadaty äsgermezlik etmek üçin ygtyýarnama hökmünde hiç haçan ýalňyş düşünilmeli däldir. Amallar, Allanyň saýlan we emr eden serişdesi bolmagynda galýar; Rehim-şepagatyny imana we dogruçyl hereketlere baglady we olardan ýüz öwürmek kiçigöwünlilik däl-de, biperwaýlykdyr. Dogry manysy deňdir: amallarymyz köp bolsa-da, Allanyň bize beren nygmatlarynyň bir bölegini-de yzyna gaýtaryp bilmez ýa-da Jennetiň bakylygyny satyn alyp bilmez. Şonuň üçin amallarymyzy söýginiň we boýun bolmagyň alamaty hökmünde hödürleýäris, soň bolsa kabul etmek we kabul etmek üçin Onuň merhemetine doly bil baglaýarys.",
      "Şol rehimdarlygyň gerimi haýran galdyrýar. Pygamber alaýhyssalam, Allanyň rehimini ýüz bölege bölendigini aýtdy; Creationhli ýaradylyş üçin diňe bir bölegini iberdi, ene bir bölegi çagasyna, haýwanlar bolsa çagalaryna mylaýym bolýar, galan togsan dokuz bölegini Kyýamat gününde hyzmatkärlerine bermek üçin özi bilen saklaýar. Bu dünýäde haýsydyr bir rehim-şepagat gören bolsak, ýüzden bir bölegidir.",
      "Şonuň üçin deňagramly imanly, iki ganaty bilen uçýan guş ýaly umyt bilen gorkynyň arasynda ýaşaýar. Allanyň adalatyndan hiç wagt günäkärlik bilen arkaýyn ýa-da biperwaý ösmezliginden gorkýar we näçe ýoldan azaşandygyna garamazdan Allanyň rahmetine umyt baglamaz diýip umyt edýär. Gorkudan doly egilmek umytsyzlygy döredýär; Umytdan doly eglenmek ulumsylygy döredýär. Allanyň atlary - Ar-Rahman (Iň rehimdar), Ar-Rahim (Iň rehimdar), Al-Gafor (Iň bagyşlaýjy) - umyt ganatyny dakýar.",
      "Şeýlelik bilen, bu her gün ýapylýan ruhuňyz bolsun: Al-Firdawsdan Alladan soraň, dogruçyl işleriňizi ediň, kemçilikleriňize toba ediň we iň soňky derejäňizi iň adalatly we iň rehimdarlara tabşyryň - şol gün üçin togsan dokuz bölegini rehimdarlyk edeniň, özüne gelen we umyt eden hyzmatkäri yzyna öwürmejekdigine ynanmak.",
    ],
    quran: [
      {
        excerpt:
          "Rehimdarlygym hemme zady öz içine alýar. Şonuň üçin dogruçyllar we zekat berýänler we aýatlarymyza iman edenler üçin buýruk bererin.",
      },
      {
        excerpt:
          "Aýt: Eý, gullarym, özlerine garşy hyýanat edenler, Allanyň rahmetinden umytdan düşmäň. Hakykatdanam, Allatagala ähli günäleri bagyşlaýar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Siziň hiç biriňiz diňe eden işleri bilen Jennete girip bilmersiňiz. Diýdiler: Eý, Allahyň Resuly! Ol aýtdy: Allatagala meni rehim etmese, hatda menem däl.",
      },
      {
        excerpt:
          "Allanyň rehimdarlygynyň ýüz bölegi bar. Jynlaryň, adamzadyň, haýwanlaryň we mör-möjekleriň arasynda birek-birege rehimdarlyk edýän bir bölegini iberdi; kyýamat güni bendelerine rehim eder ýaly, togsan dokuz bölegini Özi bilen saklady.",
      },
    ],
    actions: [
      "Alladan gorkusyny merhemetine umyt bilen deňleşdiriň.",
      "Günäden soň hiç haçan umytdan düşmäň - toba ediň we yhlas ediň.",
      "Alladan Al-Firdaws we gowy gutarmagyny soraň (husn al-hatimah).",
    ],
    appLinks: [{}, {}],
  },
];

export const JANNAH_GATES_TK: DeepPartial<JannahGate>[] = [
  {
    name: "Namazyň derwezesi",
    deedSummary: "Gündelik bäş namazy goraýan we esaslandyranlar üçin.",
    hadith: [
      {
        excerpt:
          "Kim Allanyň ýoluna bir jübüt sarp etse, Jennetiň derwezesinden çagyrylar. Namaz okaýanlaryň arasynda kim namaz derwezesinden çagyrylar.",
      },
    ],
  },
  {
    name: "Haýyr-sahawat derwezesi",
    deedSummary: "Allanyň razylygy üçin çyn ýürekden sadaka berenler üçin.",
    hadith: [
      {
        excerpt: "Kim haýyr-sahawatçylaryň arasynda bolsa, haýyr-sahawat derwezesinden çagyrylar.",
      },
    ],
  },
  {
    name: "Ar-Raýan derwezesi",
    deedSummary: "Oraza tutanlar üçin niýetlenendir - diňe girýän derwezesi.",
    hadith: [
      {
        excerpt:
          "Jennetde Ar-Raýan diýilýän bir derweze bar, onuň üsti bilen kyýamat gününe diňe agyz bekleýänler girer. Iň soňkusy girensoň ýapylar.",
      },
    ],
  },
  {
    name: "Jihadyň derwezesi",
    deedSummary: "Allanyň ýolunda yhlas bilen göreşenler üçin.",
    hadith: [
      {
        excerpt: "Jihad halkynyň arasynda kim Jihad derwezesinden çagyrylar.",
      },
    ],
  },
  {
    name: "Hajyň sylagy",
    deedSummary: "Haj edenleri üçin, günäden azat gaýdyp gelenler üçin.",
    hadith: [
      {
        excerpt:
          "Kim Allanyň razylygy üçin haj etse, biabraýlyk we hyýanat etmese, ejesiniň dünýä inen güni ýaly günäden azat bolar.",
      },
    ],
  },
  {
    name: "Her derwezeden jaň edilýär",
    deedSummary: "Käbirleri, Ebu Bekir ýaly, ähli derwezeden girmäge çagyrylar.",
    hadith: [
      {
        excerpt:
          "Ebu Bekir sorady: Bu derwezelerden kimdir biri çagyrylarmy? Ol: Hawa, senem şolardan bolarsyň diýip umyt edýärin.",
      },
    ],
  },
];

export const JANNAH_VERSES_TK: DeepPartial<JannahVerseEntry>[] = [
  {
    excerpt:
      "Dogruçyllar üçin taýýarlanan asman we ýer ýaly giň bir Perwerdigäriňizden bagyşlanmaga ylgaň.",
  },
  {
    excerpt:
      "Derýalaryň akýan baglary we ebedi ýaşaýyş baglarynda ýakymly ýaşaýyş jaýlary - ýöne Allanyň razylygy has uludyr.",
  },
  {
    excerpt: "Dogruçyl amallara ynanýanlar üçin myhmansöýerlik hökmünde Bosgun baglary.",
  },
  {
    excerpt:
      "Öňki edenleri üçin sylag hökmünde özlerine haýsy rahatlygyň gizlenendigini hiç kim bilenok.",
  },
  {
    excerpt: "Olarda islän zatlaryna eýe bolarlar we biziň bilen has köp.",
  },
  {
    excerpt: "Hemmeler üçin edenlerine görä derejeler bolar.",
  },
  {
    excerpt: "Olar Alla bilen derejelerdir we Alla olaryň edýänlerini görýär.",
  },
  {
    excerpt:
      "Rebbimiz, bize bu dünýäde ýagşylyk we ahyretde ýagşylyk ber we bizi ot jezasyndan gora.",
  },
  {
    excerpt: "Allanyň rehiminden umytdan düşmäň - hakykatdanam, Allah ähli günäleri bagyşlaýar.",
  },
  {
    excerpt: "Hyzmatkärlerim - bu gün sen hakda gorky bolmaz, gynanmarsyň.",
  },
  {
    excerpt: "Öňünden gelenler, öňdebaryjylar - ýakynlar.",
  },
  {
    excerpt: "Şonuň üçin Allah olary şol günüň erbetliginden gorar we ýagtylyk we bagt berer.",
  },
];

export const JANNAH_DUAS_TK: DeepPartial<JannahDuaEntry>[] = [
  {
    context: "Iki dünýäde-de ýagşylyk we otdan goramak üçin giňişleýin dua.",
  },
  {
    context: "Taşahuddan soň gysga bir dua: Jennet we otdan gaçybatalga soraň.",
  },
  {
    context: "Taşahhuddan soň Allanyň owadan atlaryny ulanyp Jennet soraň.",
  },
  {
    context: "Allany görmegiň we Onuň bilen duşuşmak isleginiň süýjüligini soraň.",
  },
];

export const JANNAH_PROMISED_TK: DeepPartial<JannahPromisedEntry>[] = [
  {
    name: "Wada berlen on jennet",
    summary:
      "Ebu Bekir, Umar, Usman, Aly, Talha, Zubaýr, Abd al-Rahman ibn Awf, Sa'd, Seýid ibn Zaýd we Abu Ubaýda (Alla olardan razy bolsun).",
    note: "Sunan al-Tirmizi (3747, sahih) bir hadysda bilelikde atlandyrylýar.",
  },
  {
    name: "Hakykat we sabyrly",
    summary: "Allatagala imanda dogruçyl we tabynlykda we synaglarda sabyrlylary öwýär.",
    note: "Gurhan 4:69 we as-sadyken we as-sabireen hakda köp aýatlara serediň.",
  },
  {
    name: "Allanyň ýolunda şehitler",
    summary:
      "Yslam kanunlaryna laýyklykda Yslamy goramak üçin ölenlere Jennet hakda hoş habar berilýär.",
    note: "Alymlar şahany takyk kesgitleýärler; söweşdäki her bir ölüm awtomatiki usulda däl.",
  },
  {
    name: "Iň soňky sözleri kellä gelenler",
    summary: "Kimiň soňky sözleri 'La ilaha illallah' bolsa, Jennete girer.",
    note: "Sünan Abu Dawud 3116 (sahih). Gowy gutarmak ömürboýy yzarlamakdyr.",
  },
  {
    name: "Pygamberler",
    summary: "Her bir pygamber, Allanyň emri bilen Jennetiň iň ýokary hataryndadyr.",
    note: "Olaryň duralgasyna adaty işler bilen ýetip bolmaýar - saýlanýar we goralýar.",
  },
];
