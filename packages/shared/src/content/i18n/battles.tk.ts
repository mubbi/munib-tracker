// Turkmen translation overlay for the Learn Battles content. Mirrors the order of
// its English source in ../battles*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  BattlesFigure,
  BattlesGlossaryTerm,
  BattlesLessonCard,
  BattlesTimelineEvent,
  BattlesTopic,
  BattlesVerse,
} from "../../types/battles";
import type { DeepPartial } from "./localize";

export const BATTLES_TOPICS_TK: DeepPartial<BattlesTopic>[] = [
  {
    title: "Giriş",
    summary: "Taryhy taryhy, yzarlamalar, Hijra we söweşe rugsat berlende.",
    body: [
      'Mekgede açylan ilkinji on üç ýyllykda musulmanlara yzarlamalara sabyrlylyk bilen çemeleşilmegi tabşyryldy - söweşmäge rugsat berilmedi. Ionsoldaşlar özlerini goramak islänlerinde, jogap: "Elleriňizi saklaň, doga ediň we zekat beriň" (Gurhan 4:77). Irki jemagat zuluma ýaragly gozgalaň däl-de, tutanýerlilik, göç we doga bilen jogap berdi.',
      "Hijri Madinä (622-nji ýyl / 1-nji ýyl) ýörelgeleri däl-de, jemgyýetiň ýagdaýyny üýtgetdi. Athatribda musulmanlar Madinanyň konstitusiýasy bilen şäherdäki ýewreý taýpalary bilen özara goranmak we bilelikde ýaşamak barada ýazmaça şertnama baglaşan mesgen tutdular. Pygamberimiz now indi hüjüm edilip bilinjek we kanuny taýdan özüni gorap bilýän sypaýylygyň başlygydy.",
      'Diňe şondan soň, ençeme ýyllap dowam eden sütemden soň, söweşmäge ilkinji rugsat berildi - we munuň sebäbine ynanýanlaryň "Rebbimiz Alladyr" diýendikleri üçin zulum edilip, öýlerinden kowulmagydy (Gurhan 22: 39-40). Rugsat, dini azatlygy goramak we goramak üçin berildi - şol aýatda "monastyrlaryň, buthanalaryň, sinagoglaryň we metjitleriň" howpsuzlygy, söweşleriň gorap saklaýan ýeri, basyp almak, zor bilen iman etmek ýa-da talamak üçin däl.',
      'Gurhan bu rugsadyň töwereginde hemişelik çäk kesgitledi: "Size garşy söweşýän, ýöne bozmaň Allanyň ýolunda söweşiň" (Gurhan 2: 190). Söweş jemgyýete garşy agressiýa bilen baglanyşyklydy we hiç haçan adalat çäginden çykmaly däldi.',
      "Bu kampaniýalar taryh: ýedinji asyryň belli bir arap kontekstinde tire-taýpa söweşi, şertnamalary bozmak we gabaw şertlerinde bolup geçdi. Parahatçylyk, adalat, rehimdarlyk we goňşuçylyk baradaky umumy yslam taglymatlary çarçuwadyr; bu söweşleriň aýratynlyklary, şol bölümiň içinde okalmaly, ondan aýrylan şygarlara ýykylmaly däl.",
    ],
    quran: [
      {
        excerpt:
          'Zalym bolandyklary üçin söweşýänlere rugsat berilýär we Allah olara ýeňiş berip bilýär - öýlerinden haksyz kowlanlara, diňe: "Rebbimiz Alladyr" diýendikleri üçin. Allatagala käbir adamlary beýlekileriň, monastyrlaryň, ybadathanalaryň, sinagoglaryň we metjitleriň üsti bilen kowmasa, Allanyň ady agzalýan metjitler hökman ýykylardy.',
      },
      {
        excerpt:
          "Allanyň ýolunda söweşiň, ýöne hyýanat etmäň. Hakykatdanam, Allah bozuklary halamaýar.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Näme üçin söweşler boldy?",
    summary: "Yzarlamalar, şertnamalaryň bozulmagy we jemgyýeti goramak - agressiýa däl.",
    body: [
      "Bu söweşleriň mazmuny we sebäbi, musulmanlaryň urşa bolan höwesi däl-de, dowamly duşmançylyk kampaniýasydy. Mekgede Kuraýş ejizleri gynaýardy, tutuş taýpany açlykdan boýkot etdi, emigrantlaryň galdyran emlägini elinden aldy we hatda Pygambere janyna kast etmek üçin dildüwşük gurady. Medinä göçmek howpy aradan aýyrmady; göçürdi.",
      "Badr (2 AH) şol çözülmedik konfliktden ulaldy. Emigrantlardan alnan baýlygy alyp barýan ullakan Kuraýş kerweniniň Siriýadan gaýdyp gelýändigi eşidilende, Pygamber alaýhyssalam muňa päsgel berdi. Kerwen gaçdy, ýöne Kuraýş eýýäm müňe golaý goşun toplapdy we her niçigem bolsa ýaş jemgyýeti zor bilen ýok etmegi ýüregine düwüpdi. Badryň guýularynda atylan söweş netijesi boldy.",
      "Madinada diri galmak şertnamalara baglydy we şertnamalar birnäçe gezek bozuldy. Şäheriň şertnamasy boýunça özara goranmagy wada beren bölümler duşman bilen dildüwşük gurady - Medinäni Çukurda (5 AH) gaban Konfederasiýalar musulmanlary düýbünden ýok etmek üçin takyk ýygnandylar.",
      "Şertnamanyň bozulmagy ahyryna çenli aýgytly bolup galdy. Musulmanlaryň ýaranlary Banu Huza'a hüjüm eden Kuraýşyň ýaranlary, Hudaýbiýa şertnamasyny ýatyrdy we gyrgynçylyga däl-de, Mekgäniň gansyz açylmagyna sebäp boldy.",
      "Bularyň hemmesinde maksatlar yzygiderli boldy: durmuşy we dini goramak, ejizleri goramak we tawhidiň yzarlanmazdan ulanylyp bilinjek ýeterlik howpsuzlygyny üpjün etmek. Maksat hiç haçan öz bähbidi üçin tükeniksiz giňelmek däldi we çeşmeler Pygambere duşman parahatçylyga ymtylanda ýaraşyk we şertnamany ileri tutýandygyny ýazýar.",
    ],
    hadith: [
      {
        excerpt:
          'Maňa Alladan başga hudaýyň ýokdugyna we Muhammediň Allahyň Resulydygyna, namaz okamagyna we zekat berýändiklerine güwä geçýänçä, söweşmek tabşyryldy. Şeýle etseler, Yslam hukugyndan başga jany we emlägi menden goralýar we hasaplary Allaha degişlidir. - Nusgawy alymlar "halky" Arabystanyň butparazlary hökmünde okaýarlar, habar gelenden soň Yslam dinine garşy söweşýärler; Gurhan 2: 256-da aç-açan gadagan edýän parahatçylykly musulman dällere hüjüm etmek ýa-da ynanjy mejbur etmek üçin ygtyýarnama däl-de, şol duşman söweşijiler hakda aýdylan söz.',
      },
    ],
    quran: [
      {
        excerpt: "Dinde mejburlyk ýok. Dogry kurs ýalňyşlykdan tapawutlandy.",
      },
    ],
    disclaimer:
      "Aboveokardaky hadysda köplenç sazlanylýar. Nusgawy alymlar ony öz döwrüniň belli bir duşmançylygynda we Gurhanyň dine mejbur etmegi gadagan etmegi bilen birlikde (2: 256) we söweşiň diňe size garşy söweşýänlere garşydygyny kesgitleýärler (2: 190).",
    appLinks: [{}],
  },
  {
    title: "Yslamda söweş etikasy",
    summary:
      "Gurhanda we Sünnetde hiç hili agressiýa, parahat ilaty berk goramak we adamkärçilikli hereketler ýok.",
    body: [
      'Yslam söweşi (siýar) gönüden-göni Gurhanyň çäklerinden we Pygamberimiziň amallaryndan ösdi. Onuň binýady, hemme zady dolandyrýan ýeke-täk düzgün: "Size garşy söweşýän, ýöne bozmaň" (Gurhan 2: 190). Söweş adalat bilen çäklendirilen agressiýa jogapdyr we duşmanyň duran pursatyny bes etmeli.',
      "Söweşmeýänler berk goralýar. Bir ekspedisiýadan soň öldürilen aýal tapylanda, Pygamberimiz women aýallaryň we çagalaryň öldürilmegini aç-açan gadagan etdi. Hukukçylar muny garrylara, kameralarynda ýerleşýän monahlara we ybadat edýänlere, daýhan işçilerine we hakyna tutulan işçilere we söweşe gatnaşmaýanlara ýaýratdylar. Olary öldürmek rugsat berlen artykmaçlyk däl - gadagan.",
      "Hatda işjeň söweşijilere garşy gylyçdan öň çakylykdy. Pygamber a serkerde belläninde, ilki bilen beýleki tarapa Yslamy çagyrmagy, soň bolsa boýun gaçyrmagy parahatçylyk ylalaşygyna çagyrmagy we diňe ikisi ret edilse söweşmegi, imany bozmazlygy, jesedi şikeslendirmezligi ýa-da çagany öldürmegi buýurdy (Sahih Musulman 1731).",
      'Dönüklik düýbünden gadagan: şertnamalar öz möhletine laýyk bolmaly we duşmana dönüklik däl-de, adalatly duýduryş berilmelidir. "Uruş aldaw" diýip söweş meýdanyndaky rugsat diňe taktiki gatlaklara degişlidir - yzlary, geň galdyryjylary, ýalňyşlyklary - hiç haçan şertnamany bozmazlyk ýa-da goralýan tarapa ýalan sözlemezlik.',
      "Emläk we ýeriň özi goralýar. Umumy görkezme miweli agaçlaryň islegsiz kesilmegini, ekinleriň ýakylmagyny we mallary zerurlykdan soýmagy gadagan etdi. Tussaglar iýenlerinde we geýnenlerinde iýmitlenmeli boldular; Gurhan ýesirleri Allanyň söýgüsi üçin iýmitlendirýänleri öwýär (76: 8) we köpüsi töleg, alyş-çalyş ýa-da ýönekeý rehimdarlyk bilen azat edildi - käbiri Badrda musulmanlary okamagy öwretmek üçin.",
      "Bular diniň kadalaşdyryjy taglymatlarydyr. Taryh boýunça aýry-aýry musulmanlar yslamy bozýardylar, kesgitlemediler - edil haýsydyr bir dine uýýanlaryň düzgünleriniň bozulmagy, bu imanyň buýruklaryny täzeden ýazmaýşy ýaly.",
    ],
    quran: [
      {
        excerpt: "Allanyň ýolunda söweşiň, ýöne hyýanat etmäň.",
      },
      {
        excerpt:
          "Parahatçylyga ýykgyn edýän bolsalar, oňa-da ýykgyn ediň we Allaha bil baglaň. Hakykatdanam, eşidýän we bilýän Oldyr.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ibn Umar, Allahyň Resulynyň ekspedisiýalarynyň birinde bir aýalyň öldürilendigini habar berdi, şonuň üçin aýallaryň we çagalaryň öldürilmegini gadagan etdi.",
      },
      {
        excerpt:
          "Pygamberimiz bir goşuna serkerde belläninde, oňa: Allanyň adyndan söweşiň ... olja almaň, girewiňizi bozmaň, şikes ýetirmäň we çagany öldürmäň. Duşmana duşanyňyzda ilki bilen olary yslama çagyryň; ret etseler, olara parahatçylyk hödürläň; diňe ikisinden ýüz öwürseler, söweşiň.",
      },
      {
        excerpt:
          "Garry gojany, ýaş çagany ýa-da aýal öldürme. - Bu takyk sözlemiň käbir zynjyrlary gowşak derejelendirilýär, ýöne onuň aýdýan hökümi ýokardaky sahih kyssasy we hukukçylaryň razyçylygy bilen tassyklanýar.",
      },
    ],
    actions: [
      "Yslamyň buýruklary bilen taryhdaky islendik goşunyň hakykatdanam edenlerini anyk tapawutlandyryň.",
      "Bu etika bölümini haýsydyr bir söweş kyssasyndan öň okaň - dolandyryş ýörelgeleri bolmazdan taryh düşünişmezlige çagyrýar.",
      "Haçan-da bir çeşme bu düzgünlere ters gelýän ýaly bir hereketi ýazga alsa, netije çykarmazdan ozal onuň mazmuny we hakykylygy barada soraň.",
    ],
    appLinks: [{}],
  },
  {
    title: "Badr söweşi",
    summary: "17 Remezan 2 AH - ilkinji uly söweş, Kriteriýa güni.",
    body: [
      "Mazmuny we sebäbi: Hijri baýramyndan soň Kuraýş, Mekgede galan emigrantlaryň öýlerini we baýlyklaryny basyp aldy we howplaryny dowam etdirdi. Ebu Sufýanyň Siriýadan baý kerwen alyp barýandygy baradaky habar Medine ýetende, Pygamberimiz söweşe däl-de, emlägiň elinden alynmagyna garaşýan ýeňil güýç bilen - takmynan 313 adam bilen ýola çykdy.",
      "Näme boldy: Abu Sufýan kenar ýakasyndan geçdi, ýöne ol eýýäm Mekgä kömek sorap iberdi we Kuraýş müňe golaý söweşiji, atly we azyk önümleri bilen musulmanlardan görelde almagy ýüregine düwdi. Badr guýusynda söweş gutulgysyz bolup başlady, ol ýerde al-Hubab ibn al-Mundhiriň maslahaty bilen musulmanlar suwy duşmana inkär edip, ilki ele geçirdiler.",
      'Şol gije Pygamberimiz daň atýança doga etdi. Üç gezek goşun bilen ýüzbe-ýüz bolup, ellerini ýokary galdyryp, Rebbinden ýalbardy welin, eşigi egninden gaçyp: "Allaha Allah, bu imanlylar topary ýok edilse, ýer ýüzünde ybadat edilmersiň" -diýdi. Gurhanyň, Allanyň perişdeler tarapyndan güýçlenip jogap berendigi we imanlylaryň ýüregine rahatlyk berendigi aýdylýar.',
      "Iki tarapdan üç çempionyň arasynda ýekeje söweşden soň goşunlar çaknyşdy. Kuraýş döwdi. Leadersolbaşçylarynyň ýetmiş töweregi öldürildi, olaryň arasynda jemgyýetiň iň gazaply yzarlaýjysy Abu Jahl we ýetmiş töweregi adam ýesir alyndy; on dört musulman şehit boldy. Bosgunlara hormat goýuldy, käbirleri musulman çagalaryna okamagy we ýazmagy öwretmek bilen erkinligini satyn aldylar.",
      "Esasy şahsyýetler: Pygamberimiziň ýanynda Abu Bakr, Umar, Aly we daýysy Hamza durdy; Al-Hubabyň guýulardaky we Sa'd ibn Muadyň strategiýa boýunça beren maslahaty, ýeňiş wada berlen halatynda-da maslahat beriş arkaly ýolbaşçylygy görkezýär.",
      "Gurhan bu güni yawm al-furqan - kriteriýa güni diýip atlandyrýar, sebäbi hakykaty tutuş ýarym adadan öň ýalandan tapawutlandyrýardy. Onuň dowamly sapagy, Allaha bil baglamak üçin çyn ýürekden tagalla etmek we doly taýynlyk görmekdir: imanlylar hatarlaryny düzdüler, ýerlerini saýladylar we dua etdiler, ýeňiş bolsa sanlaryna däl-de, Allaha berildi.",
    ],
    battleDetails: {
      location: "Madriniň günorta-günbataryndaky Badr guýulary",
      modernLocation: "Saud Arabystanynyň häzirki Badr şäheriniň golaýynda",
      hijriDate: "17 Remezan 2 AH",
      muslimForces: "~ 313 söweşiji, atlary we düýeleri az (habarlar birneme üýtgeýär)",
      opposingForces: "~ 1000 Kuraýş, has gowy ýaraglanan we oturdylan",
      muslimCommander: "Muhammet pygamber ﷺ",
      opposingCommander: "Amr ibn Hişam (Abu Jahl) söweşde öldürildi",
      weather: "Musulmanlar üçin gum atan bir gije ýagyş; suwa elýeterlilik aýgytlydy",
      outcome: "Aýgytly musulman ýeňşi",
      keyEvents: [
        "Al-Hubab ibn al-Mundhir, suwlara gözegçilik edip, ilki guýularda düşelge gurmagy maslahat berdi.",
        "Pygamberimiz, köp sanly imanlylar üçin Alladan ýalbardy.",
        "Kuraýşyň üç çempiony Hamza, Ali we Ubaýdah bilen bir söweşde duşuşdy.",
        "Allah möminleri perişdeler bilen berkitdi (Gurhan 8: 9) we esasy Kuraýş ýolbaşçylaryny kowdy.",
        "Duşmanyň 70 töweregi öldürildi, 70-si ýesir alyndy; ýesirlere adamkärçilikli çemeleşildi.",
      ],
      leadershipLesson:
        "Jikme-jik taýynlaň, bilimli adamlar bilen maslahatlaşyň, soňra bolsa Allaha bil baglaň.",
      spiritualLesson:
        "Ylahy goldaw bilen kiçijik bir yhlasly topar dünýädäki kynçylyklary ýeňip biler - ýeňiş Alladan.",
      facts: [
        "Badr, beýleki bir gatnaşyga garanyňda Gurhanda atlandyrylýar we beýan edilýär (Anfal süresi).",
        "Käbir ýesirler Medinäniň çagalaryna sowatlylygy öwretmegiň deregine boşadyldy.",
      ],
    },
    quran: [
      {
        excerpt:
          "Rebbiňizden kömek soraýan wagtyňyz, Ol size jogap berdi: Men sizi biri-biriňize eýerip, müň perişde bilen güýçlendirerin.",
      },
      {
        excerpt:
          "Iki goşunda duşan bir alamat bardy, biri Allanyň ýolunda söweşýär, beýlekisi kapyrlar.",
      },
      {
        excerpt:
          "Sen olary öldürmediň, ýöne olary Alla öldürdi. Zyňanyňyzda-da atmadyňyz, zyňan Allahdy.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Umar, Pygamberimiziň Badr güni öz ýoldaşlarynyň üç ýüzden gowrak bolsa, müň duşmana seredendigini, soň bolsa kybla tarap öwrülendigini, ellerini uzadyp, Rebbine ýalbarýandygyny habar berdi: Allaha Allah, maňa söz bereniňi ýerine ýetir. Allaha Allah, bu imanlylar topary ýok edilse, ýer ýüzünde ybadat edilmez. Egninden egninden düşýänçä ýalbardy, Ebu Bekir bolsa: «Eý, Allahyň pygamberi - Allah saňa beren wadasyny ýerine ýetirer» diýdi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Uhud söweşi",
    summary: "Shawwal 3 AH - boýun bolmak, tertip-düzgün we tutanýerlilik üçin gaty gymmat sapak.",
    body: [
      "Mazmuny we sebäbi: Badrdan bir ýyl soň, Kureýş ölenleri üçin ar almak üçin gaýdyp geldi, 3000 töweregi söweşiji ýygnady - şol wagtlar henizem duşman bolan Halid ibn al-Walidiň ýolbaşçylygyndaky atlylar we aýallar deprek we elegiýa bilen erkekleri çagyrýar. Musulmanlar, takmynan 700 adam yza çekilenden soň, Uhud dagy bilen arkalarynda durdular.",
      'Näme boldy: Pygamberimiz elli sany ýaýçyny goşunyň açyk arkasyny goraýan depä ýerleşdirdi we olara ünsi çekmek üçin gaýtalap buýruk berdi: "Sizi iberýänçäm, guşlar tarapyndan alnyp gidilendigimizi görseňizem, bu wezipäni terk etmäň". Ilkibaşda meýilnama gaty gowy işledi - Musulmanlar Kuraýşy kowup çykardylar we duşman gaçyp başlady.',
      "Duşmanyň dargap, olja alnan zatlary gören ýaýçylaryň köpüsi söweşiň ýeňilendigine ynanmak üçin depäni terk etdi. Halid ibn al-Walid pursatdan peýdalanyp, atlylaryny goragsyz boşlukdan tigirledi we musulmanlary arkasyndan urdy. Sargyt bulam-bujarlyga öwrüldi.",
      'Esasy sanlar we çykdajylar: "Allanyň arslany" Hamza ibn Abd al-Muttalib ýetmiş ýoldaş bilen bilelikde şehit boldy. Pygamberimiziň özi ýaralandy - dişleri döwüldi we ýüzi kesildi - öldürilendigi hakda myş-myş ýaýrady. Imanlylar onuň diridigini görenlerinde, dag eňňidinde onuň ýanyna ýygnandylar we Kuraýş olary gutaryp bilmedi.',
      'Gurhan şu gün Al Imran süresinde ýüzlenip, imanyň şowsuzlygy ýa-da Allanyň beren wadasy däl-de, käbirleriniň boýun bolmazlygy üçin jogapkärçilik çekýär: "Allatagala size beren wadasyny hökman ýerine ýetirdi ... batyrlygy ýitirýänçäňiz, buýruk barada jedel edip, söýýän zadyňyzy görkezenden soň boýun egmediňiz" (3: 152). Şol bir wagtyň özünde-de, ýaralanan jemgyýeti teselli berýär we umytsyzlygy gadagan edýär.',
      "Şonuň üçin Uhud yslamyň ýeňilmegi däl-de, eýsem saklanyp galan sapakdyr: ozal berlen ýeňiş düzgün-nyzam bozulan pursatynda yzyna alyndy, buýruklar batyrgaýlyk ýaly möhümdi we synaglar jemgyýeti arassalaýar - toba edenler we berk durýanlar üçin kynçylyk ösüşiň tohumyna öwrülýär.",
    ],
    battleDetails: {
      location: "Madinanyň demirgazygyndaky Uhud dagynyň eňňitleri",
      modernLocation: "Uhud, Madina sebiti, Saud Arabystany",
      hijriDate: "Şawal 3 AH",
      muslimForces: "~ 700 (käbirleri söweşden öň yza çekilenden soň)",
      opposingForces: "~ 3000 Kuraýş we ýaranlar, atlylar bilen",
      muslimCommander: "Muhammet pygamber ﷺ",
      opposingCommander:
        "Abu Sufýan ibn Harb; Halid ibn al-Walid gapdalyndaky atlylara ýolbaşçylyk etdi",
      outcome: "Kuraýş taktiki meýdan artykmaçlygy; Musulman jemgyýeti saklanýar",
      keyEvents: [
        "Resul alaýhyssalam 50 okçyny depäniň üstünde goýdy, ony hiç haçan goýmazlyk barada berk buýruk berdi.",
        "Musulmanlar duşman hataryny bozdular, ýöne okçylaryň köpüsi olja ýygnamak üçin işinden aýryldy.",
        "Halid ibn al-Walidiň atlylary bu boşlukdan peýdalanyp, arkasyndan urdular.",
        "Hamza we 70 töweregi ýoldaş şehit boldy; Pygamberimiz ﷺ ýaralandy.",
        "Pygamberimiziň ölümi baradaky ýalan myş-myş ýaýrady; imanlylar onuň diridigini görenlerinde ýygnandylar.",
      ],
      leadershipLesson:
        "Açyk buýruklar we tertipli ýerine ýetiriş batyrlyk ýaly möhümdir; ýazgyňyzy terk etmek ýeňşini yzyna alyp biler.",
      spiritualLesson:
        "Synaglar imanlylary arassalaýar; toba we çydamlylyk bilen ýüze çykan kynçylyk ösüşe alyp barýar.",
    },
    quran: [
      {
        excerpt:
          "Allatagala, rugsady bilen öldüreniňizde, size beren wadasyny hökman ýerine ýetirdi - batyrlygy ýitirýänçäňiz, buýruk barada jedel edip, söýýän zadyňyzy görkezenden soň boýun egmänkäňiz.",
      },
      {
        excerpt:
          "Şonuň üçin ejizlemäň we gynanmaň, sebäbi hakyky imanly bolsaňyz has ýokary bolarsyňyz.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Pygamberimiz Abdullah ibn Jubaýry Uhud güni elli okçynyň üstünden belledi we şeýle diýdi: guşlar tarapyndan alnyp gidilendigimizi görseňizem, sizi iberýänçäm goýmaň - hatda olary ýeňýändigimizi görseňizem, men sizi iberýänçäm gitmäň. Duşman derbi-dagyn edilip, ýaýçylar olja görenlerinde: «Olja!» Diýdiler. wezipesinden aýryldy - şonuň üçin ýetmiş adam öldürildi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Çukur söweşi",
    summary: "Şawal 5 AH - Konfederatorlar Medinäni gabadylar; garym we ýel olary döwýär.",
    body: [
      "Mazmuny we sebäbi: Gazwat al-Ahzab (Konfederasiýa söweşi) diýlip hem atlandyrylýar, bu duşmanyň Yslamy bir gezek ýok etmek üçin eden iň uly tagallasydy. Dönüklik üçin öň kowulan Banu Nadiriň baştutanlary Mekgä we Gatafana münüp, 10,000 bilen 24,000 adam aralygynda koalisiýa - Kuraýş, Gatafan we beýleki taýpalary ýygnady. Musulmanlaryň sany 3000 töweregi bolup, howp abanýardy.",
      "Näme boldy: Pygamber alaýhyssalam sahabalary bilen maslahatlaşdy. Salman al-Farisi arap söweşinde näbelli bir pars taktikasyny teklip etdi - lava meýdanlary, baglar ýa-da berkitilen jaýlar bilen goralmaýan ýeke-täk tarapy demirgazyk tarapdan çuň bir çukur gazmak. Möminler birnäçe günläp ajy sowukda we açlykda gazdylar, Pygamber alaýhyssalam ýer ýüzüni göterip, agyz beklemek üçin garnyna bir daşy daňdy.",
      "Çukur işledi. Uly öý eýesi gelende özüni geçip bilmeýändigini gördi; böküp giden birnäçe atly yzyna gaýtaryldy. Gabaw takmynan iki-dört hepde dowam eden sowuk däl-de, dartgynlylyk we çaknyşyklara öwrüldi.",
      "Jemgyýet özenini synagdan geçirdi. Ikiýüzlüler bahana edip, daşlaşmaga synanyşdylar; şäheriň içindäki Banu Kuraýzah taýpasy duşmana tarap yrgyldady; Gurhan bokurdaklara ýetýän ýürekleri suratlandyrýar. Muňa garamazdan, iman edenler gizlinlikde täze musulman bolan Nuaým ibn Masud birek-birege ýüzlenýänçä konfederasiýa toparlarynyň arasynda ynamsyzlyk döretdi.",
      "Soňra gylyçdan däl-de, Alladan rahatlyk geldi. Güýçli, doňan şemal duşman düşelgesinden ýyrtyldy, nahar bişirýän otlary we çadyrlary agdardy, görünmeýän goşunlar olary gorkuzdy. Koalisiýa eýýäm döwüldi we üpjünçiligi azdy, gije dargady. Pygamberimiz, şondan soň Allanyň diňe Konfederasiýalary ýeňendigini aýtdy.",
      "Dowamly sapaklar: nirä gelse-de dogry maslahat berilmelidir - bu ýerde pars dinini kabul edenlerden; serişdelerini öz çägine almaly - gazylan çukur, saklanýan hatarlar; soň bolsa netijäni ýel bilen yzyna öwrüp bilýän Allaha ynanylýar. Ahzab süresi ähli synaglary we ýeňillikleri goraýar.",
    ],
    battleDetails: {
      location: "Demirgazyk Medinä ýakynlaşýar",
      modernLocation: "Madina, Saud Arabystany",
      hijriDate: "Şawal 5 AH",
      muslimForces: "~ 3000",
      opposingForces:
        "Konfederasiýa koalisiýasy (~ 10,000–24,000; sanlar çeşmelerde tapawutlanýar)",
      muslimCommander: "Muhammet pygamber ﷺ",
      opposingCommander:
        "Ebu Sufýan Kuraýşlara ýolbaşçylyk edýär; Gatafanyň soýuzdaş başlyklary we beýlekiler",
      weather: "Gazuw wagtynda ajy sowuk; güýçli ylahy şemal gabawy tamamlady",
      outcome: "Musulmanlaryň ýeňişsiz söweşi; koalisiýa dargaýar",
      keyEvents: [
        "Salman al-Farisi gowşak demirgazyk koridoryndan çukur gazmagy teklip etdi.",
        "Pygamberimiz, ýer göterip, açlyga garşy daşy daňyp, zähmeti paýlaşdy.",
        "Çukur giň söweşijini saklady we açyk söweşiň ýerine gabaw mejbur etdi.",
        "Nuaým ibn Masud konfederasiýa ýaranlaryny bölýän düşünişmezlik ekdi.",
        "Doňan ýel we görünmeýän goşunlar (Gurhan 33: 9) duşman düşelgesini dargatdy; yza çekildi.",
      ],
      leadershipLesson:
        "Giňişleýin maslahatlaşyň we gelip çykyşyna garamazdan gowy pikirleri kabul ediň; jemgyýetiň kynçylyklaryny özüňiz paýlaşyň.",
      spiritualLesson:
        "Gabawda berk duruň we netijäni şemal bilen yzyna öwrüp bilýän Allaha ynanyň.",
    },
    quran: [
      {
        excerpt:
          "Eý iman edenler, goşunlar size gelende Allanyň size beren merhemetini ýada salyň we biz olara garşy ýel we görmedik goşun iberdik ... Şol ýerde imanlylar synag edildi we güýçli titremediler.",
      },
      {
        excerpt:
          'Imanlylar Konfederasiýany görenlerinde: "Allatagalanyň we Resulynyň bize beren wadasy şu" diýdiler we bu diňe imanda we boýun egmekde artdy.',
      },
    ],
    hadith: [
      {
        excerpt:
          "Pygamber alaýhyssalam Al-Ahzab güni Konfederasiýalara dileg edip: «Eý, kitaby aýan eden Allah, hasaplaşykly bol - Konfederasiýalary ýeň. Eý, Alla, olary ýeň we silkit.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Banu Kuraýza",
    summary: "5 AH - gabaw wagtynda dönüklik edilen şertnama; ylalaşylan araçy tarapyndan höküm.",
    body: [
      "Mazmuny we sebäbi: Banu Kuraýza, şäheriň özara goranmak şertnamasy bilen musulmanlara bagly bolan Madinanyň ýewreý taýpasydy. Çukuryň belentliginde, Konfederasiýalar Medinäni jyňňyrdadyp, jemgyýetiň diri galmagy ýüp bilen asylanda, Banu Nadiriň başlygy Kuraýzahyň ýolbaşçylaryny bu şertnamany bozmaga we şäheriň içinden ikinji front açmaga yrdy. Şol pursat gelse, bu şahsy dawa däl-de, Madinadaky ähli adamy ýok edip biljek gabaw wagtynda dönüklikdi.",
      "Näme boldy: Konfederatorlar yza çekilenden soň, Pygamber au galalarynda özüni ýapan Banu Kuraýza garşy hereket etdi. Gabaw ýigrimi bäş gün töweregi dowam etdi, olar boýun egmäge razy bolýançalar, ýöne öz ykbalyny Pygamberiň däl-de, eýsem özleri saýlan bir emin tarapyndan çözülmegini islediler: Awsyň başlygy Sa'd ibn Muad, özleriniň uzak wagtlap ýaranlary.",
      "Kazyýet: Sa'diň özi, garymda alnan ýaradan ölüp, dönüklik eden söweşiji erkekleriň jezalandyrylmagyny we ýesir alnan aýal-gyzlaryň, şol döwrüň uruş kanunlaryna we gabaw astyndaky dönüklik üçin höküm çykaryldy. Pygamber alaýhyssalam Saadyň Allanyň hökümine laýyklykda höküm çykarandygyny aýtdy.",
      "Ony nädip üns bilen okamaly: Bu, jemgyýetiň iň ejiz sagadynda goranyş şertnamasyny bozan söweşijileriň uruş döwrüne dönüklik edenligi üçin jeza boldy - ynançlary sebäpli bir halka garşy çykarylan karar däl we musulmanlaryň ýewreýlere ýa-da haýsydyr bir dini jemagat bilen nähili garamalydygynyň nusgasy däldi. Gurhan we Sünnet parahat däl musulman dällere adalat we gowy çemeleşmegi buýurýar (Gurhan 60: 8) we beýleki ýewreý taýpalaryna we Medinäniň şahsyýetlerine hiç wagt zyýan ýetmedi. Esasy stipendiýa muňa dönüklik kanunynyň çäkli taryhy bölümi hökmünde garaýar we käbir soňraky alymlar hatda iberilen sanlaryň jikme-jikliklerine-de şübhelenýärler.",
      "Gurhan, Ahzab süresinde Konfederasiýa söweşiniň netijesi bolmazdan ep-esli derejede epizody görkezýär. Iň soňky sapak, şertnamany bozmagyň agyrlygy - umumy howp abanýan pursatda ynamyň dönükligi iň agyr agramy göterýär - hatda duşmanyň hem barlanmadyk ar almak däl-de, ylalaşylan we bitarap araçy tarapyndan höküm çykarylmaga hukugy bar.",
    ],
    battleDetails: {
      location: "Madinanyň etegindäki Banu Kuraýza galalary",
      modernLocation: "Madina, Saud Arabystany",
      hijriDate: "Dhul-Ka'da 5 AH (garymdan gysga wagtyň içinde)",
      muslimForces: "Madinanyň goşuny, garymyň gabawyndan derrew",
      opposingForces: "Galalarynda berkitilen Banu Kuraýza",
      muslimCommander: "Muhammet pygamber ﷺ",
      outcome: "Gabawdan soň boýun egmek; taýpanyň öz saýlan emininiň çykaran hökümi",
      keyEvents: [
        "Banu Kuraýza, Konfederasiýa gabawy wagtynda Madinanyň ähtini bozdy.",
        "Konfederasiýa yza çekilenden soň, musulmanlar galalaryny 25 gün töweregi gabadylar.",
        "Bu taýpa, uzak wagtlap ýaranlary Awsyň başlygy Sa'd ibn Muad tarapyndan höküm edilmegini isledi.",
        "Sa'd gabaw astyndaky dönüklik üçin döwrüň uruş kanuny bilen dolandyrylýar; Resul alaýhyssalam hökümi tassyklady.",
      ],
      leadershipLesson:
        "Hatda duşmana garşy barlanylmadyk ar almak däl-de, ylalaşylan, bitarap araçy tarapyndan höküm çykarmaga rugsat beriň.",
      spiritualLesson:
        "Umumy howp abanýan pursatda özara gorag şertnamasyny bozmak dönüklikleriň arasynda.",
    },
    quran: [
      {
        excerpt:
          "Özlerini galalaryndan goldaýan we ýüreklerine terror eden Mukaddes .azgy adamlaryny - öldüren partiýaňyzy we ýesir alan partiýaňyzy ýykdy. Ol sizi öz ýerlerine we jaýlaryna miras galdyrdy.",
      },
      {
        excerpt:
          "Allatagala sizi din sebäpli söweşmeýänlerden we öýleriňizden kowmaýanlardan - olara dogry bolmakdan we olara adalatly hereket etmekden gadagan etmeýär. Hakykatdanam, Allah adalatlylary söýýär.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Banu Kureýza Sa'd ibn Muadyň hökümini kabul etmäge razy bolanda, Pygamber alaýhyssalam ony iberdi. Ol geldi, Pygamber alaýhyssalam aýtdy: «Başlygyň üçin dur. Sa'd söweşýän erkekleriň öldüriljekdigini, aýallarynyň we çagalarynyň ýesir alnandygyny aýtdy. Pygamber alaýhyssalam aýtdy: Allanyň hökümi bilen höküm çykardyňyz ýa-da Patyşanyň hökümi bilen aýtdyňyz.",
      },
    ],
    disclaimer:
      "Bu, taýpanyň özi saýlan bir emin tarapyndan höküm edilen söweşijiler tarapyndan belli bir uruş dönükligi üçin jeza boldy. Bu hiç bir halka öz dini üçin karar däl we Yslamyň adalat we hoşniýetlilik bilen garamagyny buýurýan ýewreýler ýa-da islendik jemagat bilen gatnaşyklar üçin görelde däldir (Gurhan 60: 8). Käbir alymlar iberilen sanlaryň jikme-jikliklerini sorag astyna aldylar.",
  },
  {
    title: "Hudaýbiýa şertnamasy",
    summary: "6 AH - şowsuzlyga meňzeýän we aýdyň ýeňiş gazanan ýaraşyk.",
    body: [
      "Mazmuny we sebäbi: AH 6-njy ýylda Pygamberimiz 1400 töweregi ýoldaşy bilen ýaragsyz, ýöne syýahatçylaryň gylyçlary üçin ýola düşdi, diňe söweşmek üçin däl-de, Käbä has az zyýarat etmek. Musulmanlaryň Mekgä girmegini görmek islemeýän Kuraýş, mukaddes serhetdäki Hudaýbiýa diýilýän ýerde ýoly bekledi.",
      'Ridwanyň girewi: Kuraýşyň Pygamberiň wekili Usman ibn Affany öldürendigi barada myş-myş ýaýranda, Pygamber alaýhyssalamlary ýoldaşlaryny akasiýa agajynyň aşagynda gaçmajakdyklaryna söz bermäge çagyrdy. On dört ýüz töweregi wada berdi - Baýat al-Ridwan, Taňry razylygynyň girewi - we Gurhan soňra: "Agaç astynda size wepaly boljakdyklaryny wada berenlerinde Allatagala razy boldy" (48:18). Usman diridigini subut etdi we görkezilýän karardan howatyr eden Kuraýş gepleşiklere iberildi.',
      "Näme boldy: ýaraşygyň şertleri kemsidiji ýalydy. Musulmanlar bu ýyl umrasyz yza gaýdyp, diňe indiki ýyl dolanyp bilerdiler. On ýyllyk parahatçylyk bolar. Kuraýşdan musulmanlara gaçýan her bir adam yzyna gaýtarylar, ýöne tersine däl. Zynjyrly bir musulman Abu Jandal şu ​​maddanyň aşagynda gözleriniň öňüne çekilende, ýoldaşlar döwülipdi; Umar muny aç-açan sorag etdi we Allahyň Resulyna bil baglamagy ýuwaşlyk bilen ýatlatdy.",
      'Näme üçin ýeňiş boldy: Kuraýş ilkinji gezek ýazmaça şertnamada deň güýç hökmünde musulmanlar bilen iş salyşdy. On ýyllyk parahatçylyk ýollary açdy; Ylalaşyk döwründe yslam çalt we parahatçylykly ýaýrady - bu iki ýylda yslam dinine öňki ýyllara garanyňda has köp girdi. Kuraýş frontundan azat edilen Pygamber ﷺ Haýbara ýüz tutup, patyşalary we taýpalary yslama çagyrýan hatlar iberip bilerdi. Yzyna gaýdyp barýarka, Fath süresi açyldy: "Hakykatdanam, size aç-açan ýeňiş berdik".',
      "Çydamly sapaklar: Kararyň paýhasy entek görünmeýän mahaly, hyjuwdan we Allaha we Resulyna bil baglamagyň iň ýokary mysalydyr. Ionsoldaşlaryň ilkinji gezek ýeňliş hökmünde duýan zady, Gurhan aç-açan ýeňiş gazandy we iki ýylyň içinde Mekgäniň özüne ýol açdy. Gaty parahatçylygy kabul etmek, şertnama hormat goýmak we garaşmak islegi bu ýerde ejizlik däl-de, güýç görnüşi hökmünde görkezilýär.",
    ],
    battleDetails: {
      location: "Mekgäniň golaýyndaky mukaddes araçäkde Hudaýbiýa",
      modernLocation: "Saud Arabystanynyň Mekgäniň golaýyndaky Al-Şumaisi",
      hijriDate: "Zul-Ka'da 6 AH",
      muslimForces: "~ 1400 zyýaratçy, söweş üçin enjamlaşdyrylmady",
      opposingForces: "Kuraýş, Mekgä barýan ýoly petikledi",
      muslimCommander: "Muhammet pygamber ﷺ",
      outcome: "On ýyllyk ýaraşyk; söweş ýok; soňra Gurhanda aç-açan ýeňiş diýip atlandyrdy",
      keyEvents: [
        "Musulmanlar söweş üçin däl-de, umra ugradylar we Hudaýbiýada saklandylar.",
        "Usmanyň ölendigi baradaky ýalan habarda 1400 funt sterling Ridwan agajynyň aşagynda girew berdi.",
        "Ionsoldaşlaryň ajy tapylan şertleri bilen on ýyllyk şertnama gol çekildi (yzyna gaýtarmak, Abu Jandal).",
        "Parahatçylyk döwründe yslam çalt ýaýrady; Fath süresi şertnamany aç-açan ýeňiş diýip atlandyrdy.",
      ],
      leadershipLesson:
        "Gaty parahatçylygy kabul ediň we oňa hormat goýuň; paýhasly eglişik şu gün ertir has uly gapy açyp biler.",
      spiritualLesson:
        "Kararyň paýhasy gizlenende Allaha we Resulyna bil baglaň - sabyr iň hakyky ýeňiş bolup biler.",
    },
    quran: [
      {
        excerpt:
          "Hakykatdanam, Allatagala günäleriňizden we geljekdäki zatlary bagyşlasyn, size beren merhemetini gutarar we sizi dogry ýola ugrukdyrar ýaly, size aç-açan ýeňiş berdik.",
      },
      {
        excerpt:
          "Elbetde, agajyň aşagynda saňa wepaly boljakdyklaryny wada berenlerinde, Allatagala göwnünden turdy we ýüreklerinde näme bardygyny bilýärdi, şonuň üçin olara rahatlyk iberdi we basym ýeňiş bilen sylaglady.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Jabir ibn Abdylla aýtdy: Al-Hudaýbiýa güni on dört ýüz bolduk. Agajyň aşagynda Pygambere wepaly boljakdygymyzy wada berdik, ol adamlardan iň gowusydy.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Haýbar ekspedisiýasy",
    summary: "7 AH - Konfederasiýany goldaýan berkitmeler boýun egdirildi.",
    body: [
      "Mazmuny we sebäbi: Haýbar, dönüklik üçin ozal kowlan taýpalaryň, şol sanda Çukurda Konfederasiýa koalisiýasyny guran Banu Nadiriň baştutanlaryny öz içine alýan Madinanyň demirgazygyndaky hasylly oazis galalarynyň zynjyrydy. Ol ýerden Medinä garşy duşmanlary ýygnamagy dowam etdirdiler. Hudaýbiýa tarapyndan doňdurylan Kuraýşlar bilen Pygamberimiz, galan duşmançylyk bazasyny zyýansyzlandyrmak üçin hereket etdi.",
      "Näme boldy: Musulmanlar - takmynan 1600 adam galalarda ýeke-ýekeden öňe gitdiler. Kampaniýa gaty kyn we birnäçe hepdäniň dowamynda geçirildi. Bir kyn gününde Pygamber alaýhyssalam: «Ertir baýdagy Allany we Resulyny söýýän we Allah we Resulyny söýýän, Allatagala ýeňiş berjek adama bererin» diýdi. Ertesi gün irden gözleri agyrýan Ali ibn Abi Talyby çagyrdy - tä sagalýança onuň üçin doga etdi we baýdak berdi; esasy gala ýykyldy.",
      "Oturylyşyk: Galalar alnanda, ýaşaýjylar kowulmady. Musulmanlara önümlerden paý paý berip, ýer ekerançylygyny dowam etdirmegi we dowam etdirmegini islediler we Pygamberimiz razy boldy. Önümleri paýlaşmak şertnamasy boýunça öz ýerlerinde saklanan bu daýhanlar, soňraky Yslam şertnamalarynda we salgyt kanunlarynda öwrenilen ilkinji nusga boldy.",
      "Esasy şahsyýetler: kampaniýa, ilkinji nobatda Alynyň roly we baýdak hadysynda görkezilen ahlaklylyk bilen ýatda saklanýar - ýolbaşçylyga diňe bir dereje ýa-da güýç däl-de, Allanyň yhlasy we söýgüsi esasynda ynanylýar.",
      "Seresaplyk barada bellik: Haýbar käwagt has soňky syýasy jedellere çekilýär. Bu ýerde nusgawy deňizde ýazylan ýedinji asyr ekspedisiýasy - işjeň duşmançylyk bazasyna jogap hökmünde köpçülikleýin kowulmak bilen däl-de, gepleşikler arkaly çözülýär.",
    ],
    battleDetails: {
      location: "Madinanyň demirgazygyndaky Haýbar oazisi",
      modernLocation: "Haýbar, Saud Arabystany",
      hijriDate: "Muharram - Safar 7 AH",
      muslimForces: "Takmynan 1600 adam",
      opposingForces: "Birnäçe galanyň üsti bilen berkitilen garnizonlar",
      muslimCommander: "Muhammet pygamber ﷺ; Aýgytly hüjüme Ali ibn Abi Talib ýolbaşçylyk etdi",
      outcome: "Galalara musulmanlaryň gözegçiligi; önümleri paýlaşmak boýunça gepleşikler",
      keyEvents: [
        "Galalar birnäçe hepde gabawda bir-birden azaldy.",
        "Baýdak, pygamberiň doga-dilegleri bilen sagaldylan Alyna berildi.",
        "Çempion Marhab ýeňildi we esasy gala ýykyldy.",
        "Residentsaşaýjylar önüm paýlaşmak şertnamasy boýunça ekerançy hökmünde öz ýerlerinde galdylar.",
      ],
      leadershipLesson:
        "Iň oňat adamlara we ýürekleri Alladan çyn ýürekden bolanlara jogapkärçiligi tabşyryň.",
      spiritualLesson:
        "Uzaga çeken kynçylyklardan tutanýerlilik, yhlas bilen birleşmek, Allanyň kömegini getirýär.",
    },
    hadith: [
      {
        excerpt:
          "Haýbar güni Pygamber alaýhyssalam aýtdy: Ertir men bu baýdagy Allany we Resulyny söýýän, Allahy we Resulyny söýýän we elleri bilen Alla ýeňiş berjek adama bererin. Ertesi gün gözleri agyrýan Alyny çagyrdy; gözlerine tüýkürdi we onuň üçin doga etdi, Aly hiç wagt syrkawlamadyk ýaly bejerildi we oňa baýdak berildi.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Mu'tah söweşi",
    summary: "Jumada al-Ula 8 AH - üç serkerde öz gezeginde şehit bolan serhet ekspedisiýasy.",
    body: [
      "Mazmuny we sebäbi: Pygamberimiz Wizantiýa deňleşen demirgazyga öz ilçisini iberdi we ilçi milletleriň kanunlary bilen goralýandygy sebäpli, öldürildi. Muňa jogap edip 3000 töweregi goşun Iordan derýasynyň gündogaryndaky Rim serhediniň golaýyndaky Mu'ta tarap ugrady.",
      "Buýruk zynjyry: Pygamber alaýhyssalam mirasdüşer hataryna - Zaýd ibn Haritha ýolbaşçylyk etdi, eger ýykylsa Ja'far ibn Abi Talib we ýykylsa, Abdylla ibn Rawahah - aýgytly subut etjek ajaýyp öňdengörüjilik hereketi.",
      "Näme boldy: Mu'tahda musulmanlar Wizantiýalylaryň we soýuzdaş arap taýpalarynyň has uly güýji bilen duşuşdy - çeşmeler onlarça müň adam hakda aýdýar, ýöne sanlar näbellidir we ulaldylýar. Zaýd ýykyldy, soň iki eli kesilýänçä baýdagy saklamagy bilen ýatda galan Ja'far, soň bolsa Pygamberiň bellän tertibi boýunça Abdullah ibn Rawahah boldy.",
      'Yza çekilmek: Bellenen üç serkerdäniň hemmesi şehit bolansoň, ýoldaşlar baýdagy Hudaýbiýadan soň täze musulman bolan Halid ibn al-Walide berdiler. Birnäçe manevr we täzeden işlemek arkaly köp sanly goşuny dargadyp, öýüne ep-esli derejede getirdi - Pygamberiň hormat goýmagy, soňra Halidi "Allanyň gylyçlarynyň arasynda gylyç" diýip atlandyrdy. Medinede Pygamber alaýhyssalam Zaýd, Ja\'far we Ibn Rawaha üçin aglady we hiç bir habarçy gelmezden ozal şehit bolandygyny habar berdi.',
      "Çydamly sapaklar: howpdan öň mirasdüşerleri bellemek - ýolbaşçylygyň dowamlylygy - sözüň doly manysynda goşuny halas etdi; we durmuşy saklaýan tertipli yza çekilmek masgaraçylyk däl-de, paýhasdyr. Allanyň ýolunda şehit bolmak syýasy şowsuzlyk däl-de, hormatdyr we söweş musulmanlary Halidiň sowgatlary bilen tanyşdyrdy, tiz wagtdan imanyň hyzmatyna öwrüldi.",
    ],
    battleDetails: {
      location: "Iordan derýasynyň gündogaryndaky Mu'tah",
      modernLocation: "Iordaniýanyň Garag şäheriniň golaýynda",
      hijriDate: "Jumada al-Ula 8 AH",
      muslimForces: "~ 3000",
      opposingForces: "Wizantiýa we soýuzdaş arap güýçleri (has uly; çeşmelerde näbellidir)",
      muslimCommander: "Zeýd ibn Harita, soň Ja'far, soň Ibn Rawahah, soňra Halid ibn al-Walid",
      outcome: "Musulmanlaryň tertipli çykmagy; agyr şehitlik, ýöne goşun saklandy",
      keyEvents: [
        "Pygamberimiz, gitmezinden ozal yzygiderlilik üçin üç serkerdäni belledi.",
        "Üçüsi hem edil öňünden aýdylyşy ýaly Mu'ta geldi.",
        "Halid ibn al-Walid serkerdelik edip, goşuny howpsuzlyga alyp bardy.",
        "Pygamberimiz Madinada aglady we habar gelmezden ozal şehitleri yglan etdi.",
      ],
      leadershipLesson:
        "Howpsuzlyk ýüze çykmazdan ozal mirasdüşerleri belläň - aýdyň ýolbaşçylygyň dowamlylygy adamlary halas edýär.",
      spiritualLesson:
        "Allanyň ýolunda şehit bolmak mertebedir; goşuny halas edýän paýhasly yza çekilmek ýeňilmek däl.",
    },
    appLinks: [{}],
  },
  {
    title: "Mekgäni basyp almak",
    summary: "Remezan 8 AH - umumy amnistiýa astynda Mekgäniň gansyz açylmagy.",
    body: [
      "Mazmuny we sebäbi: Kuraýşyň ýaranlary Banu Bakr, musulmanlaryň ýaranlary Banu Huza'a hüjüm edip, Kuraýş gizlinlikde ýarag berýänçä, Hudaýbiýa şertnamasy baglaşyldy. Bu ýaraşygy bozdy. Kuraýşyň özüni ýapmak synanyşygy başa barmansoň, Mekgä barýan ýol açykdy.",
      "Näme boldy: Pygamberimiz, takmynan 10,000 ýoldaş bilen ýöriş etdi, şeýle çalt we gizlin hereket etdi welin, Kuraýşyň garşylyk gurmaga wagty ýokdy. Kuraýşyň köne serkerdesi Abu Sufýan çykyp, girmegiň öňüsyrasynda Yslamy kabul etdi. Goşun birnäçe ugurdan Makka girdi, söweş ýokdy - diňe bir sütün gysga ýaragly garşylyk görkezdi; Pygamber ﷺ serkerdelerine söweşenlerden başga söweşmezligi aç-açan tabşyrypdyr.",
      'Amnistiýa: Bu basybalyjylygy kesgitleýän pursat. Jebir çeken, boýkot eden we rehimdarlygy bilen kowulan şäher bilen Ka\'bada durup, Pygamber alaýhyssalam özlerinden nämä garaşýandyklaryny sorady, soň Yusufusup pygamberiň özüne zulum eden doganlaryna aýdan sözlerini gaýtalady - "Şu gün size günäkär ýok. Gidiň, erkin". Umumy amnistiýa ilaty gurşap aldy; Aýry-aýry jenaýatlardan başga-da az sanly adam hasaba alynmady, hatda olaryň köpüsi onuň ýanyna gelende bagyşlandy.',
      'Arassalanmak: Pygamberimiz soňra "Hakykat geldi, ýalan ýok boldy" (Gurhan 17:81) diýip, Käbäni 360 butdan arassalady. Bir wagtlar şol şäherde gul hökmünde gynalan Bilal ibn Raba, Käbäniň depesine çykyp, Mekgäniň üstünden adany çagyrdy. Nasr süresi - "Allanyň ýeňşi gelende we basyp alanda" - bu açylyşy we märekäniň imana girmegini alamatlandyrýar.',
      "Dowamly sapaklar: bu güýçde ulanylýan pygamberlik häsiýetiniň iň uly görkezişleriniň biridir. Victoryeňişdäki ajaýyplyk, islendik jezadan has köp ýürek gazandy; Maksat ar almak däl-de, ýol görkezmekdi we habar öz-özüne däl-de, hyzmat etmek üçin edildi. Oňa ýerlikli däl-de, “Fath Makka” - Açylyş diýilýär.",
    ],
    battleDetails: {
      location: "Mekge",
      modernLocation: "Makka, Saud Arabystany",
      hijriDate: "Remezan 8 AH",
      muslimForces: "~ 10,000",
      opposingForces: "Kuraýş (söweşmezden diýen ýaly boýun egdi)",
      muslimCommander: "Muhammet pygamber ﷺ",
      outcome: "Mekge gan dökülmän diýen ýaly açyldy; umumy amnistiýa yglan edildi",
      keyEvents: [
        "Ylalaşyk, Kuraýş musulmanlaryň ýaranlary Huza'a garşy hüjümi goldanynda bozuldy.",
        "Abu Sufýan goşun girmezden ozal Yslamy kabul edipdir; öýi howpsuz ýer diýlip yglan edildi.",
        "Pygamberimiz umumy amnistiýa berdi: Bu gün size günäkär ýok - git, erkin.",
        "Käbesi butlaryndan arassalandy; Bilal adanyň üstüne jaň etdi.",
        "Öňki duşmanlar Yslamy köp kabul etdiler.",
      ],
      leadershipLesson:
        "Victoryeňişdäki ajaýyplyk ýürekleri gorkudan ýa-da ar almakdan has uzak dowam edýär.",
      spiritualLesson:
        "Maksat ar almak däl-de, ýol görkezmekdi - güýç habar däl-de, habara hyzmat etmek üçin edilýär.",
    },
    quran: [
      {
        excerpt:
          "Allanyň ýeňşi we ýeňşi gelende we adamlaryň Allanyň dinine köp girýänini göreniňizde, Rebbiňizi wasp edip, ondan bagyşlanmagyny soraň. Hakykatdanam, Ol toba kabul edýär.",
      },
      {
        excerpt:
          "Ol: Şu gün günäkär däl. Goý, Allatagala sizi bagyşlasyn we rehimdarlardan iň rehimlidir. - Yusufusup pygamberiň basyp alan güni Kuraýşlara aýdan sözleri.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Hunayn söweşi",
    summary: "Şawal 8 AH - Mekgeden soň bukuda; ynam synag edildi, soň ýeňiş berildi.",
    body: [
      "Mazmuny we sebäbi: Mekge açylandan iki gün soň, Gawazin we Takifiň güýçli taýpalary täze agalyk etmezden ozal musulmanlara hüjüm etmek üçin ýygnandy. Pygamber a, uly goşun bilen - takmynan 12,000 töweregi, şol sanda ýakynda Makkan dinini kabul edenleriň köpüsi - ýygnanan iň uly musulman güýji bilen ýola çykdy. Ululygynda erkekleriň käbiri nätanyş ynam duýdy we kimdir biri san sebäpli ýeňilip bilinmejekdigini aýtdy.",
      "Näme boldy: Duşman Hunaýn dar jülgesinde bukulypdy. Musulmanlar daňyň ýarym şöhlesine inenlerinde, belentliklerden olara ok tupany düşdi we awangard döwüldi. Aljyraňňylyk ýaýrady we uly goşunyň köpüsi öwrülip gaçdy - indi ynam döreden sanlar yzygiderli dowam etdi.",
      'Öwrüm nokady: Bulam-bujarlykda Pygamberimiz gaçmady. Gatyryny duşmana tarap gysyp, ses bilen: "Men pygamber, bu ýalan däl; men Abd al-Muttalibiň ogly" -diýdi. Muhajirun bilen Ansaryň özeni - Abbas ýoldaşlaryny atlary bilen çagyryp, töweregine ýygnandy. Musulmanlar täzeden döredildi, hüjümçileri açdylar we derbi-dagyn etdiler; ýesirler we uly olja alyndy.',
      "Netije: Kampaniýa birbada ýykylmadyk Taifiň gabawyny dowam etdirdi. Soňra, Hawazin halkyny gözlemek üçin geleninde, Pygamberimiz oljalary yzyna gaýtardy - olja saklamak üçin ýaraşygy we ýürekleri ýumşatmagy saýlap aldy we täze Makkan imanlylaryny imana baglamak üçin sahylyk bilen goldaw berdi.",
      'Gurhan bu güne gönüden-göni ýüzlenýär we sanlara bil baglamak howpuny atlandyrýar: "we köp sanly adam göwnüňize ýaraýan, ýöne size hiç zat bermedik Hunaýn güni ... Soňra Allah rahatlygyny inderdi" (9: 25–26). Dowamly sapak aç-açan - hiç haçan sanlara, baýlyga ýa-da soňky üstünliklere daýanmaň; victoryeňiş diňe Allanyň peşgeşidir we yzyna eýerijiler howsala düşende berk durup, görünýän lideriň ekiz häsiýetidir.',
    ],
    battleDetails: {
      location: "Mekge bilen Taifiň arasyndaky Hünaýn jülgesi",
      modernLocation: "Saud Arabystanynyň Taif şäheriniň golaýynda",
      hijriDate: "Şawal 8 AH",
      muslimForces: ", 000 12,000 (köp sanly täze Makkan imana gelenleri goşmak bilen)",
      opposingForces: "Hawazin we Takif",
      muslimCommander: "Muhammet pygamber ﷺ",
      outcome: "Ilkinji ýoldan soň musulmanlaryň ýeňşi",
      keyEvents: [
        "Iň uly musulman goşuny söweşden ozal öz sanlaryna ynam döretdi.",
        "Jülgede daň atýan hüjüm awangary dargatdy we uly howsala döretdi.",
        "Pygamber alaýhyssalam durup, möminleri yzyna çagyrdy. ýadrosy onuň töweregine ýygnandy.",
        "Musulmanlar duşmany täzeden döretdiler we ýeňdiler; Soňra Taif gabaw astyna alyndy.",
        "Bosgunlar ýaraşyk alamaty hökmünde yzyna gaýtaryldy.",
      ],
      leadershipLesson:
        "Followersolbaşçy howsala düşende görünmeli we durnukly bolmaly - barlyk hatara çykýar.",
      spiritualLesson:
        "Hiç haçan sanlara ýa-da soňky üstünliklere bil baglamaň; ýeňiş we rahatlyk diňe Alladan gelýär.",
    },
    quran: [
      {
        excerpt:
          "Allatagala eýýäm köp sebitlerde ýeňiş gazandy - Hunaýn güni, köp sanly adam göwnüňizden turanda, size hiç zat bermedi, ýer giňligi üçin size ýapyldy we yza çekildiňiz. Soňra Allatagala rahatlygyny Resulyna we möminlere iberdi.",
      },
    ],
    hadith: [
      {
        excerpt:
          'Al-Bara ibn Azibden Hünaýn güni gaçandyklary ýa-da däldigi soraldy. Ol aýtdy: Emma Allahyň Resuly fle gaçmady. Adamlar yzyna öwrüldiler, Pygamberimiz ak ak gatyrynda bolup, ol: "Men Pygamber, bu ýalan däl; Men Abd al-Muttalibiň ogly.',
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Tabuk ekspedisiýasy",
    summary: "Rajab 9 AH - tomus yssysynda iň kyn ýöriş, imany söweşsiz synap görmek.",
    body: [
      'Mazmuny we sebäbi: Demirgazyk serhetde Wizantiýanyň uly mobilizlenmegi barada habarlar Medinä ýetdi. Pygamber alaýhyssalam Tabuk şäherine kampaniýa çagyrdy we adaty bir ýere gizlenmegiň ýerine aç-açan at berdi, sebäbi ýöriş şeýle uzyn we gaty kyn bolar welin, her kim dogruçyl taýýarlanmalydy. Tomusyň yssy yssysynda, hasyl wagtynda syýahat we çykdajylar iň agyr bolanda düşdi - bu "kynçylyk ekspedisiýasy" hökmünde tanaldy.',
      "Gurban synagy: Çagyryş jemgyýetiň ýüregini ýalaňaçlady. Usman goşunyň köp bölegini öz baýlygy bilen enjamlaşdyrypdyr; Ebu Bekir ähli emlägini berdi; Umar ýarysyny berdi. Gatnaşyp bilmedikleri üçin aglamaga hiç zady bolmadyk iň garyp ýoldaşlar - Gurhan gözýaşlaryny ýazýar (9:92). Olara garşy galmak üçin bahana oýlap tapan we Tawba süresini açyp görkezýän ikiýüzlüler olara garşy durdular.",
      "Näme boldy: Pygambere ýolbaşçylyk eden iň uly goşun, belki 30 000 adam agyr ýörişden soň Tabuga ýetdi. Wizantiýa güýçleriniň hiç biri söweşe girmedi. Ekspedisiýa boş netijäniň ýerine serhet taýpalary we demirgazyk hökümdarlary bilen şertnamalary baglaşdy, jemgyýetiň howpsuzlygyny giňeltdi we agressiýanyň öňüni alýan taýynlygy görkezdi.",
      "Yzynda galan üç adam: Galanlaryň arasynda üç sany yhlasly imanly - Ka'b ibn Mälik, Hilal ibn Umaýa we Murara ibn Rabi bar, hiç hili bahanasy ýokdy we iň esasysy bu barada ýalan sözlemekden ýüz öwürdi. Elli günläp boýkot edildi, toba kabul edilýänçä we Gurhan bagyşlanýandygyny yglan edýänçä, ýer ýapylýan ýaly giňdi. (9: 118) Synag astyndaky dogruçyllygy deňizdäki iň täsirli bölümlerden biridir.",
      "Dowamly sapaklar: jemgyýeti goramaga taýynlyk, gylyç çekilmese-de iman hereketidir; derrew, görünýän sylag bilen gurban bermek synaglaryň iň ýokarysydyr; we dogruçyllyk - Ka'byň özüni ýalan bilen halas etmekden ýüz öwürmegi, rahat ýalandan has gowydyr. Tawba süresi, bu mowzuklaryň töwereginde ähli ekspedisiýany düzýär.",
    ],
    battleDetails: {
      location: "Tabuk, Wizantiýa serhedine barýan ýolda",
      modernLocation: "Tabuk, Saud Arabystany",
      hijriDate: "Rajab 9 AH",
      muslimForces: ", 000 30,000 (Pygamberimiziň ýolbaşçylygyndaky iň uly goşun)",
      opposingForces: "Wizantiýa goşunynyň bardygy habar berildi, ýöne söweşe gatnaşmady",
      muslimCommander: "Muhammet pygamber ﷺ",
      weather: "Hasyl wagtynda aşa yssy",
      outcome: "Söweş ýok; demirgazyk şertnamalary üpjün edildi; jemgyýet synag etdi we süzdi",
      keyEvents: [
        "Pygamberimiz, ýörişiň kynlygy sebäpli uzakdaky ýeri aç-açan atlandyrdy.",
        "Usman, Abu Bakr, Umar we beýlekiler sahylyk bilen berdiler; garyplar berjek zady ýok diýip agladylar.",
        "Ikiýüzlüler yzda galmak üçin bahana edip, Tawba süresinde paş edildi.",
        "Hiç bir duşman gatnaşmady; demirgazyk taýpalary we hökümdarlary bilen şertnamalar baglaşyldy.",
        "Üç sany dogry imanly, toba kabul edilýänçä 50 gün boýkot edildi (Gurhan 9: 118).",
      ],
      leadershipLesson:
        "Kynçylyk we onuň bahasy barada dogruçyl boluň; aç-açanlyk ynam döredýär we isleg bildirýänleri okaýar.",
      spiritualLesson:
        "Görünýän sylagsyz gurban we synag wagtynda hakykat, imanyň iň ýokary synaglaryndan biridir.",
    },
    quran: [
      {
        excerpt:
          "Yzynda galanlar, Allahyň Resulynyň arkasynda durandyklaryna begendiler we baýlygy we jany bilen Allanyň ýolunda göreşmegi halamadylar we aýtdylar: Yssyda çykmaň. Aýt: Diňe düşünip bilseler, dowzahyň ody yssyda has güýçlidir.",
      },
      {
        excerpt:
          "Theer, giň ýer ýapylýança, öz janlary ýapylýança, galan üç adamy bagyşlady we Alladan başga pena ýokdugyna ynanýardylar. Soň bolsa toba etmekleri üçin olara rehim etdi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ka'b ibn Mälik Tabukdan nädip bahana bilen galandygyny we bu barada ýalan sözlemejekdigini gürrüň berdi; Pygamberimiz imanlylara özi we iki ýoldaşy bilen elli gije gürleşmezligi buýurdy, tä ýer olar üçin dar bolýança - bagyşlanmagyň aýanlygy geldi we bu ömrüniň iň bagtly günleriniň biri boldy.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Gazawat we Saraýa",
    summary: "Esasy kampaniýalar bilen kiçi toparlaryň arasyndaky tapawut.",
    body: [
      "Gazwah, Pygamberiň hut özi gatnaşan ekspedisiýa - alymlar Badr, Uhud, Çukur, Hudaýbiýa, Haýbar, Mekgäniň, Hunaýnyň we Tabukyň basyp alynmagy ýaly ýigrimi ýedi töweregi hasaplaýarlar.",
      "Sariýa (köplük saraýa), Pygambere goşulmazdan, serkerdäniň ýolbaşçylygynda iberilen topardyr - takmynan elli sany missiýa gözleg, reýdlere jogap bermek, esgerleri ugratmak ýa-da taýpalary yslam dinine çagyrmak üçin ýazylýar.",
      "Köp saraýa hiç hili söweş alyp barmady - diplomatiýa, patrullyk ýa-da söweşi zerur däl edýän güýç görkezmekdi. Beýlekiler, Mu'ta ekspedisiýa ýaly çynlakaý söweş we agyr ýitgi çekdiler.",
      "Bu tapawuda düşünmek Yslamyň irki döwürlerinde “söweşleriň” sanyny ulaltmakdan goraýar. Takmynan on ýylyň dowamynda hakyky söweşler az boldy; ýörişleriň köpüsi öňüni alyş, diplomatik ýa-da gansyz boldy we çeşmeler ähli pygamberlik döwrüni öz döwri üçin ýitgi çekmekde ýeňil hasaplaýar.",
    ],
    actions: [
      "Haýsy wakalaryň söweşleriň, gabawlaryň we söweşsiz ýörişleriň bolandygyny görmek üçin wagt tertibine göz aýlaň.",
      "Kategoriýalary düşnükli etmek üçin gazwah we sariýa üçin sözlük ýazgylaryny okaň.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Pygamberimiziň yzyndaky söweşler ﷺ",
    summary: "Dogry ugrukdyrylan halyflaryň esasy işleri - pygamberlik döwründen tapawutly.",
    body: [
      "Pygamberimiz 11-nji hijri (632-nji ýyl) aradan çykandan soň, jemagat Ridda (imanlylyk) söweşleri, Sasaniýa Pars we Wizantiýa Siriýa ýaýbaňlanmagy we ahyrsoňy içerki fitna bilen halyflar Ebu Bekir, Umar, Usman we Aly (Alla ondan razy bolsun!) Ýolbaşçylyk edipdir.",
      "Bu wakalar yslam taryhyna degişlidir, ýöne pygamberiň hereketleri ýaly sünnet däldir. Taryhyň gurallary we musulman alymlarynyň özleriniň jikme-jiklikleri, sebäpleri we sapaklary barada jedel edýändiklerine göz ýetirmeli.",
      "Al-Kadisiýa söweşi (be ö 63 636-njy ýyl): Sa'd ibn Abi Wakkas musulman güýçlerine Yrakdaky Sasaniýa goşunyna garşy ýolbaşçylyk edip, Pars açdy.",
      "Armarmuk söweşi (be ö 63 636-njy ýyl): Halid ibn al-Walid ýaly serkerdeler Wizantiýalylar bilen Lewantdaky esasy Wizantiýa meýdan güýjüni soňlaýan aýgytly kampaniýada duşuşdylar - pygamberlik sünneti däl-de, harby taryh hökmünde öwrenildi.",
      "Nahawand söweşi (beö. 642-nji ýyl): arap çeşmelerinde 'oryeňişleriň ýeňşi' hökmünde ýatda saklanýar, Sasanyň galan garşylygyny bozdy. Sene we goşun sanlary taryhçylaryň arasynda tapawutlanýar.",
    ],
    actions: [
      "Ilki bilen pygamberlik söweşlerini öwreniň - esasy ahlak we kanuny salgylanma.",
      "Soňky ýeňişlere nuans bilen çemeleşiň; urşy wasp etme, çylşyrymly taryhy şygarlara öwürme.",
    ],
    disclaimer:
      "Taryhçylaryň arasynda pygamberlikden soňky ýeňişlere sanlar, sebäpler we ahlak taýdan baha berilýär. Bu umumy syn polemiki däl-de, ugrukdyrmak üçin.",
  },
  {
    title: "Liderlik sapaklary",
    summary: "Sabyr, şura, rehim we Allaha bil baglamak - diňe bir taktika däl.",
    body: [
      "Dawa-jenjelde ýolbaşçylygyň pygamberlik modeli akyllylykdan has ýokarydyr. Esasy kararlar (şura) - Badrdaky guýular, Konfederasiýa gabawyndaky çukur, Hudaýbiýadaky şertler - hatda ylhamyň netijesini tassyklaýan ýerinde-de kabul edildi. Liderlik hereket etmezden öň diňledi.",
      'Sabyr her ýeňşiň arkasyny emele getirdi. Hudaýbiýanyň parahatçylygy, iki ýylyň içinde Mekgäniň açylmagyna sebäp boldy. Mekgedäki rehimdarlyk - "Bar, erkin" - jemgyýeti yzarlan adamlardan üstün çykdy. Uhudda öwrenilen ajy düzgün bu betbagtçylygyň gaýtalanmagynyň öňüni aldy.',
      "Batyrlyk gylyçdan edil edil şonuň ýaly görkezildi: berk durmak we goşun Hunaýnda gaçanda görünýär; gazýanlaryň ýanynda çukurda ýer götermek; we - iň kynsy - bir wagtlar sizi öýüňizden kowup çykaranlaryň umumy güýjünde bagyşlamak.",
      "Allaha bil baglamak (tawakkul) hiç haçan serişdäni äsgermezlik etmegi aňlatmaýar. Skautlar iberildi, ýer saýlandy, ýaraglar geýildi, garymlar gazyldy, mirasdüşerler bellendi we şertnamalar hormatlandy. Möminler elinde baryny etdiler, soň bolsa netijäni Allaha ynandyrdylar - doly güýjüň we doly bil baglamagyň nusgasy ýüregidir.",
    ],
    actions: [
      "Gaty karar bermezden ozal soraň: hakykatdanam bilimli adamlar bilen maslahatlaşdymmy?",
      "Üstünlikden soň soraň: rehim edýärinmi ýa-da buýsançmy?",
      "Bir kynçylykda soraň: düzetmek üçin boýun egmezlik barmy ýa-da Allanyň maňa öwrenjek sapagy?",
    ],
    appLinks: [{}],
  },
  {
    title: "Söweşlerdäki hakyky hadys",
    summary:
      "Bahalandyrma bilen saýlanan hekaýalar - özüňi alyp barşyň, sabyrlylygyň we möhüm wakalaryň üstünde.",
    body: [
      "Ekspedisiýalar baradaky hadys, bil baglamazdan ozal hakykylygyny barlamaly. Aşakdaky kyssalar Sahih ýygyndylaryndan alyndy we bu kampaniýalaryň özüni alyp barşyna we ruhuna degişlidir; hersi öz derejesini göterýär.",
      "Belli bir gatnaşyga bagly bolan hekaýalar üçin söweşiň öz mowzugyna serediň. Doly zynjyrlary okamak we kontekstde baha bermek üçin Munibiň hadys brauzerini ulanyň.",
    ],
    hadith: [
      {
        excerpt:
          "Duşman bilen duşuşmak isleme we Alladan howpsuzlyk sora. Themöne olar bilen duşuşanyňyzda sabyr ediň we Jennetiň gylyç kölegesinde ýatýandygyny biliň.",
      },
      {
        excerpt:
          "Pygamber alaýhyssalam aýtdy: Uruş hiledir. - Alymlar muny söweşdäki taktiki gatlaklara (yzlary, geň galdyryjylary, ýalňyşlyklary) hiç haçan şertnamany bozmak ýa-da goralýan tarapa dönüklik etmek üçin ygtyýarnama hökmünde düşündirýärler.",
      },
      {
        excerpt:
          "Pygamberimiz serkerde belläninde Alladan gorkmagy, söweşmezden ozal duşmany yslama çagyrmagy, wadany bozmazlygy, şikes ýetirmezligi we çagany öldürmezligi tabşyrdy.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Salgylar we çeşmeler",
    summary: "Nusgawy seerah işleýär we olary nädip tankyt bilen okamaly.",
    body: [
      "Esasy çeşme çeşmelerinde Ibn Yshagyň Sirasy (Ibn Hişamyň üsti bilen saklanýar), Wakidiniň Kitab al-Maghazi, Ibn Saadyň Tabakaty we Ibn Katiriň al-Bidaýah wan-Nihaýa bar. Hersiniň güýçli taraplary we ylmy gowaklary bar.",
      "Ibn Yshak (Ibn Hişamyň üsti bilen) esasy kyssa; al-Wakidi söweş jikme-jikliklerini berýär, ýöne käbir habarlary hadys tankytçylary jedel edýär; Ibn Katir taryhy tankyt bilen sintez edýär we baha bermekde seresap bolýar.",
      "Bu wakalar baradaky Gurhanyň parçalary, iň abraýly tekstlerdir. Özüňi alyp baryş, kanun we edep soraglary üçin Buhary we Musulmanlaryň sahyh hadyslary tassyklanmadyk seerah habarlaryndan ileri tutulýar.",
      "Taryhçylaryň tapawutlanýan ýerleri - takyk goşun ululyklary, käbir seneler we pygamberlikden soňky käbir kampaniýalara ahlak taýdan baha bermek - bu modul takyklygy oýlap tapman, näbelliligi belleýär. Bu ýerde getirilen her bir hadys, sany we derejesi boýunça ýygyndylara garşy barlandy.",
    ],
    actions: [
      "Ilki Gurhana, soňra bolsa sahyh hadysyna, soň bolsa seraha garşy söweş jikme-jikliklerini gözden geçiriň.",
      "Fatwa ýa-da häzirki zaman ulanylyşy barada haýsydyr bir sorag üçin ökde alymlara ýüz tutuň - bu modul höküm däl-de, bilimlidir.",
    ],
    appLinks: [{}, {}],
  },
];

export const BATTLES_VERSES_TK: DeepPartial<BattlesVerse>[] = [
  {
    excerpt:
      "Söweşenlere zulum edilendigi üçin rugsat berilýär ... Allatagala bir topar adamy başga biriniň üsti bilen barlamasa, monastyrlar, ybadathanalar, sinagoglar we metjitler ýok edilerdi.",
    context: "Söweşmäge ilkinji umumy rugsat - Mekgede ençeme ýyllap ýaragsyz yzarlamalardan soň.",
  },
  {
    excerpt:
      "Allanyň ýolunda söweşiň, ýöne hyýanat etmäň. Hakykatdanam, Allah bozuklary halamaýar.",
    context: "Esasy çäk: çäklerden geçmegi berk gadagan etmek bilen diňe goranmak.",
  },
  {
    excerpt:
      "Rebbiňizden kömek sorasaňyz, Ol jogap berdi: Men sizi müň perişde bilen güýçlendirerin, derejesi boýunça.",
    context: "Badr hakda aýan boldy - köp sanly imanlylara ylahy kömek.",
  },
  {
    excerpt:
      "Iki goşunda eýýäm duşan bir alamat bar - biri Allanyň ýolunda söweşýär, beýlekisi kapyrlar, gözleri bilen iki esse köp görýär.",
    context: "Allatagala musulmanlary Badrda duşmana has ulurak edip, ýürekleri güýçlendirdi.",
  },
  {
    excerpt:
      "Allatagala, rugsady bilen öldüreniňizde, size beren wadasyny ýerine ýetirdi, batyrlygy ýitirip, buýruk hakda jedelleşip, söýýän zadyňyzy görkezenden soň boýun egmänkäňiz.",
    context: "Okçularyň boýun egmezligi we Uhuddaky öwrüm nokady.",
  },
  {
    excerpt:
      "Eý iman edenler, goşun size gelende, Allanyň size beren merhemetini ýada salyň we biz olara garşy ýel we görmedik goşun iberdik.",
    context: "Konfederasiýa gabawy we ylahy kömek barada Ahzab süresi.",
  },
  {
    excerpt:
      "Özlerini galalaryndan goldaýan we ýüreklerine terror eden Mukaddes .azgy adamlaryny - öldüren partiýaňyzy we ýesir alan partiýaňyzy ýykdy. Ol sizi öz ýerlerine we jaýlaryna miras galdyrdy.",
    context:
      "Gabaw döwründe ähtini bozan Banu Kuraýzah-Ahzab süresi - imana garşy höküm däl-de, uruş döwrüniň dönükliginiň çäkli bölümi.",
  },
  {
    excerpt:
      "Hakykatdanam, Allatagala günäleriňizden we geljekdäki zatlary bagyşlasyn, size beren merhemetini gutarar we sizi dogry ýola ugrukdyrar ýaly, size aç-açan ýeňiş berdik.",
    context:
      "Hudaýbiýadan gaýdyp gelende aýan boldy - ýoldaşlaryň ilki bilen ajy eglişik hökmünde duýan zatlaryny aç-açan ýeňiş diýip atlandyrmak.",
  },
  {
    excerpt:
      "Elbetde, agajyň aşagynda saňa wepaly boljakdyklaryny wada berenlerinde, Allatagala göwnünden turdy we ýüreklerinde näme bardygyny bilýärdi, şonuň üçin olara rahatlyk iberdi we basym ýeňiş bilen sylaglady.",
    context:
      "Ridwan girewi - takmynan 1400 ýoldaş akasiýa agajynyň aşagynda gaçmazlygy wada berdi we Allah olar bilen razydygyny aýtdy.",
  },
  {
    excerpt:
      "Allanyň ýeňşi we ýeňşi gelende we adamlaryň Allanyň dinine köp girýänini göreniňizde, Rebbiňizi wasp edip, ondan bagyşlanmagyny soraň. Hakykatdanam, Ol toba kabul edýär.",
    context:
      "Nekr süresi, Mekgäniň açylyşynda ýeňiş bilen däl-de, öwgi, bagyşlanma we imana girýän mähelläniň täji.",
  },
  {
    excerpt:
      "Allatagala size köp sebitde ýeňiş berdi ... Soňra Allatagala rahatlygyny Resulyna we möminlere iberdi.",
    context:
      "Allah möminlere ýeňişiň köp sanly öwünmegiň netijesi däl-de, Onuň peşgeşidigini ýatladýar.",
  },
  {
    excerpt:
      "Yzynda galanlar, Allahyň Resulynyň arkasynda galandyklaryna begendiler we baýlygy we Allanyň ýolunda ýaşamak islemediler.",
    context: "Tawba süresi, Tabuk ýörişinden özüni bagyş edenlere ýüzlenýär.",
  },
];

export const BATTLES_TIMELINE_TK: DeepPartial<BattlesTimelineEvent>[] = [
  {
    title: "Ilkinji ylham",
    body: "Pygamber alaýhyssalamyň ilkinji aýatlaryny Hira gowagynda alýar. Ençeme ýyllap çagyryş parahatçylykly - söweşmäge rugsat ýok.",
    location: "Mekge",
  },
  {
    title: "Jemgyýetçilik çagyryşy we yzarlamalar",
    body: "Açyk wagyz etmek gynamalara, boýkotlara we şehitlige getirýär. Musulmanlar ýaragly ar alman çydaýarlar - sabyr we migrasiýa öwredilýän jogaplar.",
    location: "Mekge",
  },
  {
    title: "Hijra, Medinä",
    body: "Musulman jemgyýeti athatribde (Medinede) mylakatlylyk döredýär. Jewishewreý taýpalary bilen baglaşylan şertnamalar we Medinäniň konstitusiýasy bilelikde ýaşamagyň düzgünlerini kesgitledi.",
    location: "Madina",
  },
  {
    title: "Badr söweşi",
    body: "17-nji Remezanda takmynan 313 musulman has uly Kuraýş goşunyny ýeňdi - ilkinji uly söweş we aýgytly ahlak ýeňşi.",
    location: "Badr",
  },
  {
    title: "Uhud söweşi",
    body: "Musulmanlar ilkibaşda ýer alýarlar, ýöne oklaryny taşlaýan okçylar agyr yza çekilýär. Gurhan şol günüň sapaklaryna ýüzlenýär.",
    location: "Uhud dagy",
  },
  {
    title: "Çukur söweşi",
    body: "Konfederasiýa goşuny Medinäni gabady. Çukur gazmak - Salmanyň teklibi - gabawy pyçakly söweşsiz bozýar.",
    location: "Madina",
  },
  {
    title: "Banu Kuraýza",
    body: "Gabaw döwründe Madinanyň ähtini bozup, Banu Kuraýza boýun egýär we öz saýlan emin Sa'd ibn Muadh tarapyndan höküm edilmegini soraýar.",
    location: "Madina",
  },
  {
    title: "Hudaýbiýa şertnamasy",
    body: "Konsentiň pikiriçe, on ýyllyk ylalaşyk aç-açan ýeňiş boldy - Ridwan girewi agajyň aşagynda berildi, imanlar ýaýrady we Mekgä barýan ýol açyldy.",
    location: "Hudaybiýa",
  },
  {
    title: "Mu'tah söweşi",
    body: "Rim serhedine ekspedisiýa; bellenen üç serkerde Halid ibn al-Walid goşuny sag-aman çykarmazdan ozal yzly-yzyna şehit bolýar.",
    location: "Mu'tah",
  },
  {
    title: "Haýbar ekspedisiýasy",
    body: "Madinanyň demirgazygynda ýewreý galalary duşmançylyk edipdi. Ebu Bekir we Umar sud edilenden soň, Ali ibn Abi Talibe baýdak berilýär.",
    location: "Haýbar",
  },
  {
    title: "Mekgäni basyp almak",
    body: "Kuraýş şertnamany bozýar; Pygamber alaýhyssalam on müň ýoldaş bilen ýöriş edýär we gan dökülmän diýen ýaly Mekgä girýär - umumy amnistiýa yglan edildi.",
    location: "Mekge",
  },
  {
    title: "Hunayn söweşi",
    body: "Hawazin we Takif, Mekgeden soň musulmanlary gabadylar. Ilki howsala, Pygamberimiz imanlylary töweregine ýygnanyşmaga çagyranda ýeňişe ýol açýar.",
    location: "Hunayn",
  },
  {
    title: "Tabuk ekspedisiýasy",
    body: "Rim serhedine kyn tomus ýörişi. Söweş ýok, ýöne ikiýüzlilik paş edilýär we Tawba süresi yzda galanlara ýüzlenýär.",
    location: "Tabuk",
  },
  {
    title: "Hoşlaşyk zyýaraty",
    body: "Pygamberimiz Haj edýär we Hoşlaşyk hutbasyny okaýar. Az salymdan Madinada aradan çykdy - pygamberlik söweşleri döwri tamamlanýar.",
    location: "Mekge",
  },
];

export const BATTLES_FIGURES_TK: DeepPartial<BattlesFigure>[] = [
  {
    name: "Abu Bakr al-Siddik",
    epithet: "Alla ondan razy bolsun!",
    summary: "Pygamberiň iň ýakyn ýoldaşy, ilkinji uly erkek imanly we hijri ýoldaşy.",
    role: "Irki kampaniýalarda geňeşçi, söweşiji we standart göteriji.",
    lesson:
      "Basyşda berk wepalylyk we dogruçyllyk - baýlygyny yzarlan musulmanlary islendik ýeňişden öň azat etmek üçin sarp etdi.",
  },
  {
    name: "Umar ibn Hattab",
    epithet: "Alla ondan razy bolsun!",
    summary:
      "Yzarlanan ýyllarda yslam dinine girdi we imany iň güýçli goraýjylaryň birine öwrüldi.",
    role: "Ikinji halyf hökmünde söweşiji we soňra adalat binagäri.",
    lesson:
      "Batyrlyk jogapkärçilik bilen utgaşdy - pikiri, pygamberiň Hudaýbiýadaky pikiri bilen tapawutlananda, maslahaty aç-açan kabul etdi.",
  },
  {
    name: "Ali ibn Abi Talyb",
    epithet: "Alla ondan razy bolsun!",
    summary: "Pygamberimiziň daýysy we giýewisi ﷺ; Yslamy kabul eden ilkinji çagalaryň arasynda.",
    role: "Singleeke söweşde çempion we Haýbarda baýdak göteriji.",
    lesson:
      "Pespällik bilen batyrgaý - Hijri gijesinde Pygamberiň düşeginde uklap, bu işiň dowam etmegi üçin janyna howp abanýardy.",
  },
  {
    name: "Hamza ibn Abd al-Muttalib",
    epithet: "Alla ondan razy bolsun!",
    summary: "Pygamberimiziň daýysy, Yslamy kabul edeninden soň Asadulla (Allanyň arslany).",
    role: "Badr we Uhudda elita söweşiji we ahlak lideri.",
    lesson:
      "Şehitlik ýeňilmeýär - Uhuddaky ölümi Pygambere gynandy, ýöne bu tabşyrygy ýerine ýetirmek kararyny güýçlendirdi.",
  },
  {
    name: "Halid ibn al-Walid",
    epithet: "Alla ondan razy bolsun!",
    summary:
      "Hudaýbiýadan soň Yslamy kabul eden we Saýfulla (Allanyň gylyjy) bolan ajaýyp Kuraýş generaly.",
    role: "Yslamdan öň Uhuddaky musulmanlara garşy atly atlylara ýolbaşçylyk etdi; soň Mu'ta buýruk berdi we halyflyk kampaniýalarynda aýgytly boldy.",
    lesson:
      "Öňki oppozisiýa çyn ýürekden toba etmek üçin päsgelçilik däl - Uhuddaky musulmanlara täsir eden başarnyk, iman ýüregine girensoň, bütinleý Allanyň ýoluna gönükdirilipdi.",
  },
  {
    name: "Sa'd ibn Abi Wakqas",
    epithet: "Alla ondan razy bolsun!",
    summary: "Wada berlen on jennetiň biri; jemgyýetiň meşhur ýaýçysy.",
    role: "Uhudda okçy; soňra halyf Umaryň ýolbaşçylygyndaky al-Kadisiýadaky musulman goşunlaryna ýolbaşçylyk etdi.",
    lesson:
      "Biriniň rolunda tertip-düzgün - ok atmak onuň hyzmatyny kesgitledi; soň bu takyklygy bir milletiň ýolbaşçylygyna geçirdi.",
  },
  {
    name: "Salman al-Farisi",
    epithet: "Alla ondan razy bolsun!",
    summary: "Uzak ruhy syýahatdan soň Madinadaky musulmanlara goşulan Parsdan gözlegçi.",
    role: "Çukur gazmagy teklip etmek - araplara nätanyş pars taktikasy.",
    lesson:
      "Paýhas islendik tarapdan gelip biler - şura, Allanyň nirede goýsa-da eşitmek tejribesini aňladýar.",
  },
  {
    name: "Zaýd ibn Harita",
    epithet: "Alla ondan razy bolsun!",
    summary:
      "Pygamberimiziň azat edilen adamy we söýgüli ýoldaşy we musulman goşunynyň üstünden bellenen ilkinji serkerde.",
    role: "Ekspedisiýany Mu'ta alyp bardy; ýykylan üç serkerdäniň ilkinjisi hökmünde şehit boldy.",
    lesson:
      "Nesil boýunça üstünlik - ýokary taýpa derejeli erkekler bolanda ýolbaşçylyk etmek üçin saýlandy.",
  },
  {
    name: "Sa'd ibn Muad",
    epithet: "Alla ondan razy bolsun!",
    summary: "Ansaryň iň gadymy we iň hormatlanýan biri bolan Medinäniň Aws başlygy.",
    role: "Çukurda ýaralanan; ykbalynyň emini hökmünde Banu Kuraýza tarapyndan saýlandy.",
    lesson:
      "Ylalaşylan kazy arkaly adalat - hatda ýeňilen duşmana-da barlan ar almak däl-de, bitarap araçy rugsat berildi; ýarasyndan gysga wagtyň içinde öldi.",
  },
];

export const BATTLES_LESSON_CARDS_TK: DeepPartial<BattlesLessonCard>[] = [
  {
    battleTitle: "Badr söweşi",
    lesson: "Doly taýýarlananyňyzda Allaha bil baglaň.",
    detail:
      "Takmynan üç-birden köp bolan musulmanlar henizem guýulardaky ýerlerini saýladylar, hatarlaryny düzdüler we eşigi ýykylýança gije Alladan ýalbardylar. Zähmet we bil baglamak, ýeňiş Allaha berildi.",
  },
  {
    battleTitle: "Uhud söweşi",
    lesson: "Buýruga boýun bolmak jemgyýeti goraýar.",
    detail:
      "Olja almak üçin wezipesinden giden okçylar goşuny ýok etjek diýen ýaly bir bölüm açdylar. Gurhan muny her nesil üçin tertip-düzgün hakda sapak hökmünde ýazýar.",
  },
  {
    battleTitle: "Çukur söweşi",
    lesson: "Meýilnamalaşdyrmak we maslahat bermek güýji köpeldýär.",
    detail:
      "Salmanyň çukur ideýasy, Pygamberiň şurasy we imanlylaryň zähmeti bilen goragçylardan has uly koalisiýany zyýansyzlandyrdy.",
  },
  {
    battleTitle: "Hudaýbiýa şertnamasy",
    lesson: "Sabyr iň hakyky ýeňiş bolup biler.",
    detail:
      "Ionsoldaşlar ýaraşygy masgaraçylyk hökmünde duýdular we Umar aç-açan sorag etdi; Fath süresi aç-açan ýeňiş diýip jogap berdi. On ýyllyk parahatçylyk ýollary açdy, Yslam öňküsinden has çalt ýaýrady we iki ýylyň içinde Mekgä barýan ýol açyldy.",
  },
  {
    battleTitle: "Banu Kuraýza",
    lesson: "Gorag şertnamasyny bozmak iň uly dönüklikleriň arasynda.",
    detail:
      "Banu Kuraýza, Konfederasiýa şäheri gabawa alan pursatynda Madinanyň ähtini bozdy. Şeýle-de bolsa, Pygamber a özlerine saýlan emin tarapyndan höküm edilmegine rugsat beriň - barlan ar almak däl-de, ylalaşylan kazy arkaly adalat.",
  },
  {
    battleTitle: "Mekgäni basyp almak",
    lesson: "Victoryeňişden soň rehimdarlyk ýeňijini beýgeldýär.",
    detail:
      "Ony rehimdarlygy bilen gynap, kowup çykaran şäher bilen Pygamberimiz Yusufusup pygamberiň: 'Bu gün size günäkär ýok, gidiň, azat' sözlerini gaýtalady. Umumy amnistiýa ar alyşyň ornuny tutdy we hiç bir jeza gazanyp bolmajak ýürekler gazandy.",
  },
  {
    battleTitle: "Hunayn söweşi",
    lesson: "Sanlar we soňky üstünlikler ýeňşi kepillendirmeýär.",
    detail:
      "Mekgeden soň howsala goşan goşunyň ululygyndaky buýsanç. Imanlylar diňe Pygambere we Allaha ýüzlenenlerinde birleşdiler.",
  },
  {
    battleTitle: "Tabuk ekspedisiýasy",
    lesson: "Kynçylykda gurban bermek hakyky imany paş edýär.",
    detail:
      "Chöriş güýçli duşmana garşy yssyda boldy. Baýlygyny berenler we garyplyga garamazdan ýöränler hem öwüldi.",
  },
  {
    battleTitle: "Mu'tah söweşi",
    lesson: "Liderlik mirasy meýilleşdirilmelidir.",
    detail:
      "Pygamber alaýhyssalam üç sany serkerdäni belledi. Üçüsi hem ýykylanda, Halid yza çekilişi täzeden gurady - goşuny halas etmegiň özi ýeňiş boldy.",
  },
];

export const BATTLES_GLOSSARY_TK: DeepPartial<BattlesGlossaryTerm>[] = [
  {
    term: "Gazwah",
    definition: "Pygamberimiziň özi gatnaşan harby ekspedisiýa. Mysal üçin Badr, Uhud we Tabuk.",
  },
  {
    term: "Sarýa",
    definition:
      "Pygamberimiz bolmazdan bir serkerdäniň üsti bilen iberilen goşun ýörişe goşulýar. Gözleg, diplomatiýa ýa-da reýdlere jogap bermek üçin onlarça adam boldy.",
  },
  {
    term: "Muhajirun",
    definition:
      "Allanyň razylygy üçin Mekgeden Medinä giden emigrantlar. Ansar bilen birlikde irki musulman jemagatynyň özenini emele getiripdirler.",
  },
  {
    term: "Ansar",
    definition:
      "Kömekçiler - Muhajiruny myhman alan Madinanyň musulmanlary, baýlyklaryny paýlaşdylar we ilkinji ýyllarynda şäheri goradylar.",
  },
  {
    term: "Şura",
    definition:
      "Esasy kararlardan öň özara maslahatlaşma. Çukur strategiýasy we Uhud üçin taýýarlyklar pygamberlik modelinde maslahat bermegi görkezýär.",
  },
  {
    term: "Baýah",
    definition:
      "Wepalylygyň girewi - lideriň syýasy we ruhy boýun bolmagy. Al-Aqabanyň wadalary hijretden öň.",
  },
  {
    term: "Hijri",
    definition:
      "Allanyň razylygy üçin emigrasiýa - pygamberlik nukdaýnazaryndan Mekgeden Medinä. AH 1-nji ýyl bu göç bilen başlaýar.",
  },
  {
    term: "Amer",
    definition:
      "Goşun ýa-da ekspedisiýa üçin bellenen serkerde ýa-da ýolbaşçy. Pygamber alaýhyssalam liderleri belledi we ýykylsa mirasdüşerleri belledi.",
  },
  {
    term: "Rayah",
    definition:
      "Goşunyň başynda göterilen standart ýa-da baýdak. Pygamberimiziň baýdagyny götermek hormatyň we jogapkärçiligiň nyşanydy.",
  },
  {
    term: "Liwa",
    definition:
      "Has uly goşun standarty, käwagt şahsy rýahdan tapawutlanýar. “Liwā” -iň ýolbaşçylygy esasy güýçlere buýruk görkezýärdi.",
  },
  {
    term: "Jihad",
    definition:
      "Allanyň ýoluna ymtylmak - ilkinji nobatda ruhuň göreşi we düzgünleşdirilen harby görnüşinde, buýruk berlende agressiýany goramak we ýok etmek.",
  },
  {
    term: "Fi sabilillah",
    definition:
      "Allanyň ýolunda - kanuny göreşi taýpa vendetta ýa-da dünýäni basyp almakdan tapawutlandyrýan niýet.",
  },
  {
    term: "Aman",
    definition:
      "Ilçilere, täjirlere ýa-da söweşmeýänlere berlen howpsuzlyk ýa-da howpsuz hereket. Yslam söweş kanunlarynda aman bozmak gadagandyr.",
  },
  {
    term: "Sulh",
    definition:
      "Ylalaşyk ýa-da parahatçylyk şertnamasy. Hudaýbiýa şertnamasy, has gowulyklara hyzmat edeninde parahatçylygy saýlamagyň esasy mysalydyr.",
  },
  {
    term: "Fath",
    definition:
      "Açmak ýa-da basyp almak - köplenç zorlukly gabaw däl-de, Mekgäniň (Fath Makka) parahatçylykly açylmagy üçin ulanylýar.",
  },
];
