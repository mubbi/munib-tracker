// Turkmen translation overlays for the Learn Qur'an content.
// Each overlay mirrors the order of its English source array in ../quran-guide*.ts
// (index-aligned); untranslated entries fall back to English. Only human-readable
// text is translated — ids, routes, surah/ayah numbers, collections, citations,
// grades, and Qur'an verse-reference labels stay in the English source.
import type {
  QuranGuideApplyChallenge,
  QuranGuideDailyLesson,
  QuranGuideLetter,
  QuranGuideMemorizationPlan,
  QuranGuidePronunciationPair,
  QuranGuideQuizQuestion,
  QuranGuideReadingLevel,
  QuranGuideStory,
  QuranGuideStructureLevel,
  QuranGuideTadabburPrompt,
  QuranGuideTajweedLesson,
  QuranGuideTheme,
  QuranGuideTimelineEvent,
  QuranGuideTopic,
  QuranGuideVocabEntry,
} from "../../types/quran-guide";
import type { DeepPartial } from "./localize";

export const QURAN_GUIDE_TOPICS_TK: DeepPartial<QuranGuideTopic>[] = [
  {
    title: "Giriş",
    summary: "Gurhan näme, näme üçin inderildi we okamagyň fazyletleri.",
    body: [
      "Gurhan sözi arap kökünden gelip çykýar, okamak ýa-da sesli okamak manysyny berýär - şonuň üçin Kitap maksadyny öz adyna ýetirýär: dilde we ýürekde gaýtalanyp okalýar. Sünni mezhebiniň esasy akymynda Gurhan, takmynan 23 ýyl bäri Jibreel perişdesiniň üsti bilen Muhammet pygambere aç-açan arap dilinde aýan edilen, Hira gowagyndaky ilkinji sözlerden başlap, Pygamberiň aradan çykmazyndan ozal aýdylýan söz.",
      'Bu, Musa, Dawuda we Isa (sallaLlahu aleýhi we sellem) berlen öňki aýatlarda hakykaty tassyklaýan we alyp barýan habaryny tamamlaýan adamzada iberilen iň soňky ýazgydyr. Allatagala maksadyny aç-açan suratlandyrýar: "adamzat üçin ýol görkeziji" hökmünde adamlary bulaşyklyk we butparazlyk garaňkylygyndan tawidiň, diňe Allaha çyn ýürekden ybadat etmegiň, dogry häsiýetiň we geljekdäki durmuşa çynlakaý taýýarlygyň ýagtylygyna çykarmak üçin iberildi. Her pygamber şol ýadro çagyrdy; Gurhan iň soňky, goralýan görnüşdir.',
      "Gurhany okamagyň özi diňe bir maglumat okamak däl-de, ybadatdyr. Pygamber alaýhyssalam okalýan her bir harpyň gowy iş gazanýandygyny we her bir ýagşy işiň azyndan on esse köpeljekdigini öwretdi, şonuň üçin hatda bir setiri ýaňadan başlan adam hem baýrak ýygnaýar. Kyýamat güni Gurhan bu durmuşynda kompaniýasyny saklaýanlaryň adyndan ýalbaryp, şepagatçy hökmünde geler. Ony arkaýyn okaýan asylly perişde ýazyjylarynyň ýanyndadyr we üstünde büdrän, öwrenmek üçin göreşýän adam bu tagallasy üçin iki esse baýrak alýar.",
      "Gurhanyň nämedigini aýdyňlaşdyrmaga kömek edýär. Gurhan, Allanyň arap dilinde aýdan sözleri, wahýdan bäri üýtgemez. Hadys - Pygamberiň aýdanlary, hereketleri we sessiz tassyklamalary aýrydyr: Gurhany düşündirýär we görkezýär, ýöne pygamberiň aýdan sözleriniň zynjyrlary arkaly saklanýar we alymlar tarapyndan sahih (hakyky), hasan (gowy) ýa-da daif (ejiz) diýip baha berilýär. Bularyň ikisi hem wahýdyr we ikisi hem hökmanydyr, ýöne diňe Gurhan namazda ybadat hökmünde okalýar we Allanyň gudratly, bahasyna ýetip bolmajak sözi diňe Gurhan.",
    ],
    quran: [
      {
        excerpt: "Gurhan adamzat üçin ýol görkeziji hökmünde inen Remezan aýy…",
      },
      {
        excerpt:
          "Aýt: Adamzat we jynlar bu Gurhanyň meňzeşlerini öndürmek üçin ýygnanan bolsalar, başarmazdylar ...",
      },
    ],
    hadith: [
      {
        excerpt: "Kim Allatagalanyň kitabyndan hat okasa, hasana alar we hasana on köpeldiler.",
      },
      {
        excerpt: "Gurhany okaň, çünki kyýamat güni sahabalary üçin şepagatçy bolar.",
      },
      {
        excerpt:
          "Gurhany ökde adam asylly, dogruçyl kanunçylar bilen bile, ony kynçylyk bilen okaýan, üstünde durup, iki esse sogap gazanar.",
      },
    ],
    actions: [
      "Gurhan üçin her gün belli bir wagt belläň - hatda bäş minutlyk minut hem baraka we yzygiderlilik döredýär.",
      "Iň bolmanda manyly bir setiri okaň: arap dilini okaň, soňra terjimesini haýal okaň.",
      "Munibiň Gurhan okyjysyny açyň we giden ýeriňizi dowam etdiriň.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Gurhan nädip inderildi",
    summary: "Hira gowagy, Jibreel, Makkan we Madinan döwürleri, düzmek, gorap saklamak.",
    body: [
      "Ylham Remezan aýynda, Pygamberimiz kyrk ýaşyndaka, ýekelik we pikirlenmek üçin Mekgäniň daşyndaky Hira gowagyna gaýdyp geldi. Jibreel perişde onuň ýanyna gelip: 'Oka!' Okamaýan ýa-da ýazmadyk Pygamberimiz, perişde ony gujaklap, Alak süresiniň ilkinji bäş aýatyny: 'createdaradan Rebbiňiziň adyndan okaň' diýip, jogap berip bilmedi. Aljyrap, öýüne öýüne gaýdyp geldi, ony köşeşdirdi we ylham garyndaşyny Waraqah ibn Nawfalyň ýanyna äkitdi, ylham perişdesini tanaýan we munuň Musa gelen şol habarçydygyny tassyklady.",
      "Ylhamda (fatrada) gysga wagtlaýyn arakesme boldy, Pygamberimizi has uzaklaşdyrdy; soň dowam etdi we ömrüniň ahyryna çenli tapgyrlaýyn dowam etdi. Ylham birbada inmedi, wakalara, soraglara we jemgyýetiň barha artýan zerurlyklaryna jogap hökmünde iberildi - Allanyň pygamberiň ýüregini berkitmek we Kitaby adamlaryň durmuşyna ýeňilleşdirmek hökmünde suratlandyrýan kem-kemden usuly.",
      "Makkan döwri takmynan on üç ýyl dowam etdi. Suralary köplenç gysga, ritmiki we güýçli; binýadyny çekýärler - Allanyň birligi, direlmegiň we jogapkärçiligiň takyklygy, ret edilen öňki pygamberleriň hekaýalary aklandy we butparazlyk we adalatsyzlyk bilen gurşalan jemgyýetde ahlak reformasyna çagyryş.",
      "Beöň 622-nji ýylda Medinä giden hijretden soň, musulmanlar indi azar berilmän, eýsem jemgyýet gurýan jemgyýetdi. Madinanyň ylhamlary, umuman, has uzyn we has jikme-jik bolup, täze ymmatyň kanuny we jemgyýetçilik tertibini kesgitleýär: namazyň, zekatyň, agyz beklemegiň, miras almagyň, nikalaşmagyň we aýrylyşmagyň, şertnamalaryň, söweşleriň we şertnamalaryň aýratynlyklary, jemgyýeti içinden bozýan ikiýüzlüler üçin berk sözler.",
      "Teksti gorap saklamak Pygamberiň ömründe başlandy. Sahabalar, wahýyň gelşi ýaly ýat tutýardylar we kanunçylar pygamberiň göni gözegçiligi astynda pergamentlere, palma sapaklaryna, süňklere we daşlara ýazypdyrlar. Yamama söweşinde köp ýat tutanlar şehit bolansoň, Abu Bakr Zaýd ibn Tabite ýazylan Gurhany ýekeje ýygyndyda (suhuf) ýygnamagy buýurdy. Soňra imperiýanyň ýaýramagy we şiweleriň üýtgemegi bilen Usman Kuraýş şiwesinde döredilen abraýly nusgalary alyp, tutuş ymmat üçin bir ýazylan teksti standartlaşdyryp, uly şäherlere iberilipdir.",
      "Allanyň Özi Gurhanyň goralmagyny kepillendirdi: 'Hakykatdanam, ýatlatmany iberdik, hakykatdanam gorarys'. Bu wada üç biri-birine bagly üç kepillik - her nesilde köpçülikleýin ýat tutmak, seresaply ýazuw we pygamberiň ýanyna gaýdyp gelýän mugallym-okuwçy zynjyrlary (kyrat) arkaly ýerine ýetirildi. Mömin üçin bu ylahy alamatdyr; taryhçy üçin bu resminamalaşdyrylan hakykat: şu gün okalýan Gurhan on dört asyr mundan ozal aýan edilen tekstdir.",
    ],
    quran: [
      {
        excerpt: "Hakykatdanam, ýatlatmany iberdik we hakykatdanam gorarys.",
      },
      {
        excerpt: "Createdaradan Rebbiňiziň adyndan okaň ...",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Gurhanyň gurluşy",
    summary: "114 süre, 30 juz, aýat, Makki / Madani, buýruk vs ylham.",
    body: [
      "Mus'haf - Gurhanyň fiziki nusgasy - 114 süräni (baplary) öz içine alýar, hersiniň öz ady bar, köplenç içindäki haýran galdyryjy sözden alynýar. Gaty berk bolmasa-da, esasan iň uzyn-gysga görnüşde ýerleşdirilýär: Gysga açylyş bölümi bolan Al-Fatiha, Kitabyň derwezesi hökmünde birinji, uzyn Al-Bakara bolsa yzarlanýar. Bu tertip tawqifi - buýruk Jibreel Pygambere öwredilipdi we aýatlaryň açylan tertibi däl. Şeýlelik bilen, mushafda okaýan yzygiderliligiňiz hronologiki däl-de, bilgeşleýin we ylahy taýdan kesgitlenendir.",
      "Her süre Makki (hijretden öň aýan edilen) ýa-da Madani (ondan soň aýan) hökmünde bölünýär we käbirinde ikisiniň aýatlary bar. Düzgün bolşy ýaly, Makki süreleri gysga, has gyssagly parçalarda ynançlara - tawhidlere, direlişlere we hekaýalara jemlenýär, Madani süreleri bolsa jemgyýetiň zerur bolan jikme-jik kanunlaryny we jemgyýetçilik görkezmelerini goşýar. Surany dogry manyda okamaga kömek edýän haýsydygyny bilmek.",
      "Dolandyryş üçin okamak üçin Gurhan juz (köplük ajza ') diýlip atlandyrylýan 30 deň bölege we her juz hizb diýlip atlandyrylýan iki bölege bölünýär we jemi 60 hizb berýär. Remezan hatyny - Gurhany bir aýyň içinde tamamlamak şeýle bir tebigy zat: günde bir juz kitaby otuz günde tamamlaýar, günde iki gezek ýarym juz henizem ýumşak. Her süräniň içinde aýatlar (aýatlar) sanlanýar, şonuň üçin islendik parçany takyk süre hökmünde getirip bolar: aýat; adaty Medinäniň sanlary 6,236 aýat bolup, birnäçe aýat araçäkleriniň sanalmagynda diňe kiçijik, gowy resminamalaşdyrylan tapawutlar bar - tekstiň özi birmeňzeş.",
      "Bu gurluşa düşünmek düşnüksiz niýetleri anyk meýilnama öwürýär. Gündelik belli bir bölüme ygrarly bolup bilersiňiz, Juz Amany (iň soňky, otuzynjy bölüm, gysga sürelerden doly) nyşana alyp bilersiňiz, birnäçe sürede sabyr ýaly bir mowzuga eýerip bilersiňiz ýa-da Remezan aýynda doly okamagy meýilleşdirip bilersiňiz. Gurluşy, Gurhan bilen ömürboýy gatnaşyga ýetip bilýän gabykdyr.",
    ],
    quran: [
      {
        excerpt: "... aýatlary jikme-jik bir kitap, bilýänler üçin arapça Gurhan.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Okamagy öwreniň",
    summary: "Elipbiýden erkin okamak üçin ýedi dereje - düýbünden başlaýanlar üçin.",
    body: [
      "Her bir musulman diýen ýaly Gurhany asyl arap dilinde okamagy halaýar we islendik ýaşda doly maksat bolup biler - ozal arapça bilmedik sansyz ulular erkin okamagy öwrenerler. Terjime düşünmek gymmatly, ýöne hakyky arap sözlerini okamagyň özi ybadatdyr we tagalla etmeli. Bu ýol, bir harpy tanamazdan başlap, dogry aýdylyşy bilen aýatlary okamaga çenli ädim ädýär.",
      "Syýahat ýedi tebigy basgançakdan geçýär. 1-nji we 2-nji derejeler harp tanamaklygy döredýär - ilki 28 harpy izolirlenen görnüşde, soňra sözleriň başynda, ortasynda we ahyrynda şekilleriniň üýtgemegi. 3-nji dereje, her harpyň haýsy çekimli sesiň bardygyny aýdýan kiçijik bellikler (fatha, kasra, damma, sukun, şadda, tanween) bilen tanyşdyrýar. 4-nji we 5-nji derejeler onuň basylýan ýeri: harplary bogunlara goşýarsyňyz we belli bir makalanyň “al-” üçin gün we aý harp düzgünlerini goşmak bilen ähli sözleri çykarýarsyňyz. 6-njy we 7-nji derejeler gysga aýatlara geçýär we soňra ulanylýan tajweediň esasy düzgünleri bilen rahat we arkaýyn okamak.",
      "Iki endik hemme zady çaltlaşdyrýar. Ilki bilen ökde okaýjyny yzygiderli diňläň we takyk nusga alyň - Gurhan gulakdan, dilden-dile geçdi, şonuň üçin gulagyňyz iň gowy mugallymyňyzdyr; ritmini, çekimli sesleriň uzynlygyny we her sesiň görnüşini göçüriň. Ikinjiden, harplary kagyzda ýa-da ekranda yzarlaň we ýazyň, sebäbi el gözüň we diliň öwrenýän zatlaryny güýçlendirýär.",
      "Üns beriň: programmalar we ýazgylar ajaýyp goldaw, ýöne olar sizi adamyň edip bilşi ýaly düzedip bilmez. Pygamberimiz Gurhany gönüden-göni Jibreýlden öwrendi we sahabalara ýüzbe-ýüz öwretdi we janly düzediş zynjyrynyň hemişe takyk okalmagynyň näderejede dogrydygyny aýtdy. Özüňizi diňlemek we özüňiz eşidip bilmeýän ýalňyşlyklary düzetmek üçin ýerli mugallym ýa-da düzülen onlaýn tajweed programmasyny tapyň.",
    ],
    actions: [
      "Arap harplary bölüminde günde bir harpy öwreniň - görüň, eşidiň, aýdyň, ýazyň.",
      "Muşafdaky sözleri yzarlaýarkaňyz, Fatiha süresini gaýtalap diňläň.",
      "Mugallym - ýerli ýa-da onlaýn - hepdede okaýşyňyzy we düzedişleriňizi diňlemek üçin tertipläň.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tajweed",
    summary: "Owadan we dogry okamagyň düzgünleri - günortan sakin, madd, waqf we başgalar.",
    body: [
      "Tajweed ajaýyp ýa-da owadan bir zat etmek üçin kök manysyndan gelýär. Ylym hökmünde, her bir harpyň özüne laýyk berilmegini aňladýar - agzynda ýa-da bokurdakda dogry aýdylýan nokady (mahraj), mahsus häsiýetleri (sifat), sesleriň we arakesmeleriň dogry wagty. Gysgaça aýdylanda, tajweed, Gurhany aýan bolşy ýaly okamak sungatydyr.",
      "Bu möhümdir, sebäbi Gurhan diňe tötänleýin okaljak tekst däl. Ol eýýäm gurlan tajweed bilen geldi: Jibreel ony Pygambere okady - takyk aýdylyşy bilen, Pygamber alaýhyssalam muny sahabalara okaýardy we olar bize berilmedi. Harpy nädogry kabul etmek ownuk zat däl - harpy ýalňyş aýtmak bir sözi düýbünden üýtgedip biler (mysal üçin, hat ýönekeý s bilen ýa-da bokurdak harplary ع we conf) we käbir ýerlerde Allanyň sözleriniň manysyny üýtgedýän sözler. Tajweed ylymy munuň öňüni almak üçin bar.",
      "Hemme zady birbada özleşdirmek hökman däl. Esasy düzgünler tertipde öwrenilýär: günortan sakinanyň we tanwanyň (izhar, idgham, iqlab, ikhfa), meem sakinanyň kararlary, dürli görnüşli madd (uzalma), qalkala (belli harplara ýagtylyk), ghunna (burun rezonansy) we waqf (nirede we nädip durmaly). Olaryň hersinde anyk kesgitleme, gündelik mysallar we amaly bir zat bar we bu merkez bir gezekde gezýär.",
      "Gaty berk düzgün: Diňe kitaplardan ýa-da programmalardan däl-de, ökde mugallymdan gulak bilen öwreniň. Mistakesalňyşlyklaryňyzy eşidip, olary düzedip bilýän adama okaň - tajweed hemişe şeýle öwredilipdir we hakyky takyklyga we iň soňunda ijaza (tassyklanan okalýan zynjyr) üçin ýeke-täk ygtybarly ýoldyr.",
    ],
    hadith: [
      {
        excerpt: "Sizden iň gowusy, Gurhany öwrenýän we öwredýänlerdir.",
      },
      {
        excerpt:
          "Gurhany ökde adam asylly, dogruçyl kanunçylar bilen bile, ony kynçylyk bilen okaýan, üstünde durup, iki esse sogap gazanar.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Arap harplary",
    summary: "Interaktiw elipbiý - 28 harpyň her biri üçin at, ses, mysallar.",
    body: [
      "Arap elipbiýinde sagdan çepe ýazylan we okalýan 28 harp bar. Iňlis dilinden tapawutlylykda, harplaryň köpüsi gapdalyndaky harplara birikýär, şonuň üçin bir harp ýeke durýandygyna ýa-da sözüň başynda, ortasynda ýa-da ahyrynda oturmagyna baglylykda birneme üýtgeşik şekil alyp biler. Şol bir harpy dürli görnüşlerinde görmegi öwrenmek ilkinji hakyky üstünlikleriň biridir.",
      "Gurhan arap gatlaklarynda esasy harplaryň üstünde birnäçe goşmaça aýratynlyklar bar: hamza (glottal duralga), sesini uzadýan uzyn çekimli harplar, waf we ýa-da belli bir makalanyň 'l' harpynyň ýa-da sessiz birleşmegini kesgitleýän gün we aý harpy. Bular hakyky sözler bilen tanyşanyňyzdan soň ýönekeýdir.",
      "Bu bölümdäki her harp kartoçkasy, harpyň aýratyn görnüşini, adyny, transliterasiýasyny, amaly aýdylyş maslahatyny we hakyky Gurhanyň mysallaryny berýär, şonuň üçin sesi abstrakt däl-de, kontekstde öwrenersiňiz. Iň täsirli tertip, her harp üçin dört basgançakly aýlawdyr: görüň, okaň, özüňiz sesli aýdyň, soň ýazyň.",
      "Her täze harpy eýýäm tanap boljak sözleriňize dakyň - Allah, Rabb (Lord), ar-Rahman (Iň rehimdar), Bismillah. Nätanyş şekilleri tanyş manylara birikdirmek, izolýasiýa harplaryny burawlamakdan has çalt ýapyşýar.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Aňlatma",
    summary: "Ussat kyn harplar - aýn, ha, gynançly, kaka, kaf we manyly sözler.",
    body: [
      "Arap dilinde iňlis dilinde takyk ekwiwalent bolmadyk birnäçe ses bar we bu ýerde ene dilinde gürlemeýänler köplenç süýşýärler. Iň ýaýran bulaşyklyklar, tälim berilmedik gulaga meňzeýän, ýöne agzyň ýa-da bokurdagyň dürli ýerlerinden aýdylýan harplaryň arasynda bolup, olary garyşdyrmak sözüň manysyny üýtgedip biler, şonuň üçinem aýratyn amallara mynasyp.",
      "Ajaýyp harplar - ṣ (ص), ḍ (ض), ṭ (ط), we ẓ (ظ) - ýeňil harplaryň “agyr” görnüşleri. Olary öndürmek üçin diliň arka tarapyny ýokaryk galdyrýarsyňyz we agzyňyzy has çuňňur ses bilen doldurarsyňyz, ene dilinde gürleýänler çagalykda siňdirýär, ýöne okuwçylar aň-düşünje bilen gurmalydyrlar. Her bir ünsi gönüden-göni ýeňil kärdeşi bilen deňeşdiriň: س against garşy, د ض garşy, against garşy ط, ذ garşy.",
      "Bokurdak harplary beýleki uly päsgelçilikdir. Aýn (ع) bokurdagyň ortasyndan sesli, ha (ح) güýçli, dem alýan sürtülme - ne iňlis dilinde, ne-de ýazmaça düşündiriş olary diňlemek üçin doly ornuny tutýar. Kaf (ق) diliň arka tarapyndan çuňňur kaf (ك) bilen tapawutlanýan çuň 'k'.",
      "Ygtybarly usul, jübütleri gapma-garşy deňeşdirmek, soňra haýal, düşnükli muratal okaýyşdan özüňizi barlamakdyr. Gysga söz okaýan öz sesiňizi ýazga alyň, ony okaýjynyň garşysyna çalyň we sazlaň. Has gowusy, ökde mugallym diňläň - käbir ýalňyşlyklary öz ýazgylaryňyzda tutmak mümkin däl diýen ýaly.",
    ],
    appLinks: [{}],
  },
  {
    title: "Gurhanyň söz düzümi",
    summary: "Frequokary ýygylykly sözler - her gezek okanyňyzda has köp düşüniň.",
    body: [
      "Ynha, höweslendiriji bir hakykat: ýokary ýüzli sözleriň az sanlysy - birnäçe ýüz adamyň buýrugy bilen Gurhanyň işleýän tekstiniň ep-esli bölegini tutýar, sebäbi şol bir möhüm sözler gaýtalanýar. Esasy söz baýlygyny öwrenmek, alyp boljak iň ýokary derejeli ädimdir, sebäbi okamagy ses akymyndan okaýan wagtyňyz manysyny alýan sözlere öwürýär.",
      "Gurhan sözüni sözme-söz terjime etmeýärsiňiz - bu tafsiriň we terjimesiniň eseri - ýöne Allanyň atlaryny, buýruklaryny, wadalaryny we duýduryşlaryny okaýan pursatyňyzda tanap başlaýarsyňyz. Iň köp görünýän we iň agramly sözlerden başlaň: Allah, Rabb (Reb), rahma (rehim), iman (iman), sabr (sabyr), takwa (Taňry aňy), dünýä (bu dünýä) we akira (ahyret). Şol labyr toplumyndan bir gezek daşardan giňeliň.",
      "Dykylman, aralyk gaýtalanmagy ulanyň. Hepdede bäş sany täze söz öwrenmek we olaryň hemmesini her gün gözden geçirmek, bir oturylyşykda elli zady ýatda saklamak we ýatdan çykarmakdan has köp ýyl alar. Allah Gurhanyň ýüregine düşmegi aňsatlaşdyrandygyny - söz düzümine yzygiderli çemeleşjekdigini we bu ýeňillik bilen özüňizi duýjakdygyňyzy wada berýär.",
    ],
    quran: [
      {
        excerpt: "Elbetde, Gurhany ýatlamak aňsatlaşdyrdyk, ýadyna düşjek barmy?",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Tafsir",
    summary: "Ylhama düşünmek - syn, kontekst we ykrar edilen alym çeşmeleri.",
    body: [
      "Tafsir, Gurhanyň düşündirilmegini we düşündirilmegini aňladýar - aýatyň nämäni aňladýandygyny, näme üçin aýan edilendigini we ulanylyşyny aýdyňlaşdyrýar. Bular Allanyň sözleri bolany üçin, alymlar Gurhany nädip düşündirmelidigi barada berk ygtyýarlyk düzgünini döretdiler we onuň içinde bolmak sizi ýalňyşlykdan goraýar.",
      "Iň oňat tafsir, özüni düşündirýän Gurhan: bir ýerde gysga aýat köplenç başga ýerlerde giňeldilýär, şonuň üçin Gurhan özüniň iň gowy düşündirişidir. Ondan soň sünnetiň düşündirişi gelýär, sebäbi Pygamber alaýhyssalam wahy aç-açan etmek üçin iberildi we sözleri we amallary bize nähili ýaşandygyny görkezýär. Ondan soň ylhamyň şaýady bolan we onuň mazmunyny gönüden-göni bilýän, yzyndan gelen beýik alymlar bilen düşünişmek bolýar. Iň soňky we iň pes zat, arap diliniň özi. Asla ýer ýok zat, hünärsiz şahsy pikir - öz pikirleriňizi tekste okamak.",
      'Tafsirde esasy gural, asbab al-nuzul, ylham hadysalarydyr: bir aýata sebäp bolan wakany ýa-da soragy bilmek köplenç manysyny açýar. Theseöne bu hasabatlaryň özi tassyklanmalydyr, sebäbi her bir aýdylýan "waka" ygtybarly däl. Her bir süre üçin gowy tafsir, döredilen ýerini, esasy mowzuklaryny, esasy aýatlaryny we alyp barjak amaly sapaklaryny berýär.',
      "Iň ykrar edilen we ygtybarly salgylanmalaryň arasynda Tafsir Ibn Katir (hadyslara we irki nesilleriň sözlerine salgylanmak üçin giňişleýin we seresaply), Tafsir as-Sa'di (düşnükli, häzirki zaman we amaly gollanma gönükdirilen) we nusgawy Tafsir al-Tabari (ensiklopedik, iň irki düşündirişleri gorap saklamak) bar. Haçan-da bir many öwreneniňizde, haýsy çeşmeden gelendigine üns beriň. Bu merkez usulyýeti öwredýär; Baglanyşykly we uzakdaky tafsiri baglanyşdyrýan Munibiň Gurhan okyjysyny aýat-aýat öwrenmek üçin ulanyň.",
    ],
    sources: [
      "Tafsir Ibn Katir - gysgaldylan iňlis dili",
      "Tafsir as-Sa'di - elýeterli gysgaça mazmun",
      "Al-Wahidi tarapyndan Asbab al-Nuzul - ylham hadysalary (her hadysanyň hakykylygyny barlaň)",
    ],
    disclaimer:
      "Tafsir çuňlugy bilen üýtgeýär. Alymlar biri-birinden tapawutlananda, Allanyň aýdyňlaşdyrmadyk ýerinde takyklyk talap etmezden tapawudyna üns beriň.",
    appLinks: [{}],
  },
  {
    title: "Gurhanyň mowzuklary",
    summary: "Iman, doga, sabyr, haýyr-sahawat, pygamberler - mowzuk boýunça toparlanan aýatlar.",
    body: [
      "Gurhan, her bapda bir mowzuk ýaly okuw kitaby ýaly ýerleşdirilmedi. Muňa derek onuň ajaýyp mowzuklary - Allanyň birligi, doga, sabyr, haýyr-sahawat, pygamberler, ahyret, adalat, maşgala - her gezek täze bir nukdaýnazardan köp sürelerde ýüze çykýar we peýda bolýar. Ilki bilen gaýtalanmaga meňzeýän zat aslynda güýçlendirmekdir: tutuş habar bir bitewi çagyryş bolýança bir tema girizilýär, soň çuňlaşdyrylýar, soň başga birine birikdirilýär.",
      "Gurhany tema boýunça öwrenmek agzybirligi görkezýär. Gurhanyň aýdýanlaryny, sürelerinden Allaha şükür etmek ýa-da bil baglamak hakda ýygnan wagtyňyz, aýry aýatlar biri-birini ýagtylandyrýar we sapak aýdyň we doly bolýar. Bu merkezdäki mowzuklaryň her biri, degişli aýatlary bir ýere jemleýär we bilimiň teoretiki galmazlygy üçin aýdyňlygy, esasy sapaklary we anyk hereketleri goşýan hakyky hadyslary goldaýar.",
      "Iň esasy zat, mowzuklary öz durmuşyňyz bilen baglanyşdyryň. Ene-atalara hoşniýetlilik, işde dogruçyllyk, nikada adalatlylyk, hatda öz bähbidiňize garşy adalat üçin çykyş etmek - bu haýran galmak üçin abstrakt baplar däl, eýsem Gurhanyň gündelik kararlary. Her mowzugy özüňize gönükdirilen sorag hökmünde okaň: bu meniň şu günki işimi nädip üýtgedýär?",
    ],
    appLinks: [{}],
  },
  {
    title: "Gurhanda hekaýalar",
    summary: "Adam atadan Muhammet pygamberler ﷺ - sapaklar, ýerler, baglanyşykly aýatlar.",
    body: [
      "Gurhan pygamberleriň - Adam, Nuh, Ybraýym, Yusufusup, Musa, Isa we başgalaryň hekaýalaryny gürrüň berýär we munuň sebäbini aç-açan aýdýar: 'Olaryň hekaýalarynda düşünýänler üçin sapak'. Bu hasaplar halk döredijiligi ýa-da güýmenje däl. Olar Alla tarapyndan imany, sabyrlylygy we her döwürde gaýtalanýan synaglara nähili garşy durmalydygyny öwretmek, saýlamak we aýtmakdyr.",
      "Olaryň üstünden geçýän nagşa üns beriň. Pygamberler öz halkyny diňe Allaha ybadat etmäge çagyrdylar; masgaraladylar, garşy çykdylar we köplenç kowuldy; sabyr bilen Allaha doly bil bagladylar (tawakkul); ahyrynda Allanyň beren wadasy hasyl boldy. Olaryň kynçylyklaryny okanyňyzda, olaryň nähili jogap berendiklerinden güýç alyň - derejäňiziňki bilen deňdigini hiç wagt göz öňüne getirmän. Esasy zat, ýagdaýy deňeşdirmek däl-de, olaryň tutanýerliligini we ynamyny siňdirmek.",
      "Gurhanyň özi bir kyssa aýdýar: Allahusuf süresi, Allatagalanyň “hekaýalaryň iň gowusy” diýip atlandyrmagy. Adaty bir zat, başyndan ahyryna çenli bir sürede aýdylýar, şonuň üçin ony dowamly syýahat hökmünde bir oturylyşykda okaň - dönüklik, gulçulyk we türmede sabyr etmek, ahyrsoňy bagyşlamak we birleşmek - we Allahyň meýilnamasynyň ençeme ýyllap dowam eden betbagtlygyň üstünde nähili bolýandygyny synlaň.",
    ],
    quran: [
      {
        excerpt: "Olaryň hekaýalarynda elbetde düşünýänler üçin sapak…",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Gurhanyň gudratlary",
    summary: "Lingwistik deňsizlik, gorap saklamak, welilikler - ylmy seresaplyk bilen.",
    body: [
      "Gurhanyň merkezi gudraty, Gurhanyň özi. Arap şygryýetiniň iň ökde döwründe bilimsiz adama aýan edilen iň ýiti garşydaşlaryna - dil ussatlaryna hatda şuňa meňzeş ýekeje süre hem çykarmak üçin açyk kynçylyk döretdi. On dört asyrdan soň bu kynçylyk çözülmedi. Onuň ritoriki güýji, gurluşy, mowzuklarynyň biri-biri bilen baglanyşygy we ýol görkeziji we kanunyň sazlaşygy sözleýişiň nusgawy ylmynda öwrenilýär (ilm al-balagha) we olar Gurhanyň öz islegi boýunça çäksizdir.",
      "Gorap saklamagy ikinji, barlap boljak alamatdyr. Tekst ýazmaça görnüşde, seresaplylyk bilen iberilen golýazmalar arkaly we dilden-dile, okaýanlaryň ony ýatda saklaýan we öwredýän zynjyrlary bilen nesilden-nesle goralypdyr. Bu takwa çaklamalar däl-de, resminamalaşdyrylan taryhdyr we Allatagalanyň ýatlatmany goramak baradaky wadasyny ýerine ýetirýär.",
      "Şeýle hem, “ylmy gudratlar” - düwünçejigiň basgançaklaryna, kosmosyň giňelmegine we şuňa meňzeş aýatlar hakda eşidersiňiz. Bulary seresaplylyk bilen dolandyryň. Nusgawy tafsir köplenç bu aýatlary häzirki ötünç soraýanlardan düýpgöter tapawutly düşünýärdi we Gurhany her üýtgeýän ylmy çaklamalara laýyk getirmäge mejbur etmek teoriýalar üýtgän mahaly yza gaýdyp biler. Bellenen düşündiriş bilen häzirki zaman çaklamasyny berk tapawutlandyryň.",
      "Taryhy welilikler hem alymlar tarapyndan getirilýär - rimlileriň öňünden aýdylýan ýeňşi, Mekgäniň parahatçylykly açylmagy - we öwrenmäge mynasypdyr, ýöne sensasion wideoýazgylar däl-de, seresaply tafsir we seera arkaly. Gurhan üçin iň güýçli waka hemişe tawid, halkyň ahlak taýdan üýtgemegi we deňi-taýy bolmadyk dil we goralyp saklanmagydyr.",
    ],
    quran: [
      {
        excerpt: "Onda şuňa meňzeş süre çykar ... eger hakykatçy bolsaň.",
      },
    ],
    disclaimer:
      "Gözden geçirilende dawany utandyrýan artykmaç ylmy gudratlardan gaça duruň. Tewhid, ahlak we Gurhanyň dil we taryhy subutnamalary bilen gurşun.",
  },
  {
    title: "Oratlamak (Hifz)",
    summary: "Juz Amadan doly hifza çenli meýilnamalar - wersiýa, ses, gündelik maksatlar.",
    body: [
      "Gurhany ýatlamak (hifz) imanly adamyň durmuşynda iň oňat işleriň biridir we alymlar ýa-da çagalar üçin niýetlenilmeýär - ulular hem ony tamamlaýarlar. Pygamber alaýhyssalam, kyýamat güni Gurhany göterýän adama her aýat bilen bir hatarda ýokary galmak üçin 'Oka we ýokary çyk' diýiljekdigini öwretdi. Her kimiň başlaýan ýerinden başlaň: Fatiha süresi, her namazda eýýäm okaýan, soň bolsa mushafyň soňundaky gysga süreler yza gaýdyp işleýär.",
      "Hifzdäki iň möhüm sapak garşylykly: täzeden serediş (muraja'ah) täze material goşmakdan has möhümdir. Pygamber alaýhyssalam, ýatlanan Gurhanyň daňylan düýäniň döwülmeginden has çalt süýşýändigini - gözden geçirilmän, ýitip gitjekdigini duýdurdy. Şonuň üçin bu düzgün ýönekeý we berk: eýýäm saklaýan zadyňyzy berk gözden geçirýänçäňiz hiç wagt täze bölüm goşmaň. Birazajyk ýatda saklan bolsa, köp ýatda saklanýar.",
      "Amaly usul: aralyk gaýtalanyşy ulanyň, ýekeje okaýja ýapyşyň, şonuň üçin sazyň özi ýadyňyza degýär, diňe okamak däl-de, her gün ýatda okaýar we mugallymyň ýalňyşlyklaryňyzy diňlemegi we bellemegi - özüňiz eşidip bilmeýän ýalňyşlyklar. Munibiň hifz yzarlaýjy ýazgylary, aýry-aýry aýatlara çenli dowam edýär, şonuň üçin hemişe täzeden seredilmelidigini bilýärsiňiz.",
      "Tapgyryňyza laýyk meýilnama saýlaň. Başlangyç: gysga sürelerden doly Juz Amany ýatda saklaň. Aralyk: al-Mulk, Ya-Sin we al-Kahf ýaly ýygy-ýygydan okalýan on süre goşuň. Ösen: ozalky hemme zady güýçli täzeden gözden geçirmek bilen doly juzy tamamlaň. Hafiz syýahaty: ökde mugallym bilen ýatda saklanýan we iň gowusy, sanad - Pygambere gaýdyp berlen sertifikat zynjyry.",
    ],
    hadith: [
      {
        excerpt:
          "Gurhanyň ýoldaşyna şeýle diýiler: Dünýäde okaýşyňyz ýaly okaň we ýokary çykyň, sebäbi derejäňiz iň soňky okaýan aýatda bolar.",
      },
      {
        excerpt:
          "Gurhanyň ýoldaşy baradaky tymsal, düýäniň eýesiniň tymsalydyr: eger oňa ýykgyn etse, ony saklaýar we goýberse ýitirýär.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Gündelik sapaklar",
    summary: "Her gün bir aýat, kontekst, oýlanma we hereket.",
    body: [
      "Gurhana ömürboýy baglanyşyk, islendik çuňňur endigiň gurulşy ýaly gurulýar - her gün azajyk, her gün. Pygamber alaýhyssalam, Allaha iň söýgüli amallaryň ownuk-uşak bolsa-da yzygiderli edilýändigini we bu ýörelgäniň gündelik sapagyň aňyrsyndadygyny öwretdi. Olaryň her biri size arap dilinde ýekeje aýat, terjimesi, taryhy kontekstinde bellik, oturmak üçin oýlanma soragy we günüňizde ýerine ýetirilmeli anyk bir çäre berýär.",
      "Bu aýatlary okamaga däl-de, janly ýol görkeziji hökmünde kabul ediň. Heartüregiňize täsir edenleri belläň, olara gaýdyp geliň we maşgalaňyz bilen sizi gyzyklandyran zatlary paýlaşyň - başga biri geçen ýagşylygyňyza täsir etse, onuň sylagy hem size ýeter, şonuň üçin öwretmek peýdany köpeldýär.",
      "Kiçijik ululygyň sizi aldatmagyna ýol bermäň. Yzygiderlilik her gezek güýçlenýär: Gurhan bilen her gün bäş sany dogruçyl minut sizi aýda bir gezek seýrek, gahrymançylykly sagatdan has köp üýtgeder. Her gün görkeziň we günler ýygnansyn.",
    ],
    appLinks: [{}],
  },
  {
    title: "Oýlanma (Tadabbur)",
    summary: "Guolbaşçylyk soraglary - Allah näme öwredýär we nädip ýaşarsyňyz?",
    body: [
      'Tadabbur, Gurhany çuňňur pikirlenmek, bir aýaty ýüregiňize öwürýänçä öwürmek diýmekdir. Goşmaça goşmaça däl-de, gönüden-göni buýruk: Allah soraýar: "Gurhan hakda pikir etmeýärlermi ýa-da ýüreklerinde gulplar barmy?" Okamagyň maksady hiç haçan ýönekeý ses däldi - ýürege ýetmek we durmuşy üýtgetmekdi.',
      "Tadabbur tafsir bilen birmeňzeş däl. Tafsir, aýatyň manysynyň ylmy düşündirişidir; tadabbur, bu manysyna düşüneniňizden soň şahsy, hormat bilen jogap bermekdir. Ikisi bilelikde işleýär: ilki bilen ses manysyny tafsirden öwrenýärsiňiz, soň bolsa onuň bilen oturyp, size nähili gürleşýändigini soraýarsyňyz. Peýdaly çarçuwa üç sorag - Allah maňa bu ýerde näme öwredýär? Bu gün meniň edýän işlerimi nädip üýtgedýär? Şol sebäpli haýsy endigi gurmaly ýa-da bozmaly?",
      "Bir berk araçäk tadabbur howpsuzlygyny saklaýar: bir aýatyň senden soraýan zady hakda pikirlen, ýöne tekstiň özi üçin hiç wagt täze many oýlap tapma. Hakyky tafsir düşündirişiň çägini goýsun we şahsy pikirleriňizi öz ýerinde saklasyn - Munib ýaly hususy journalurnal, bir aýatyň size täsir edenini soňrak yzyna gaýdyp almak üçin amatlydyr.",
    ],
    quran: [
      {
        excerpt: "Gurhan hakda pikir etmeýärlermi ýa-da ýüreklerinde gulplar barmy?",
      },
      {
        excerpt:
          "Onda olar Gurhan hakda pikir etmeýärlermi? Eger Alladan başga bolan bolsa, onda köp gapma-garşylyk tapardylar.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Gurhany ulanyň",
    summary: "Şu günki aýatdaky kynçylyk - tamamlanmagy yzarlaň, aýaty ýaşaň.",
    body: [
      "Gurhany bilmek herekete öwrülýär. Allatagala Kitaby okaýan, ýöne muňa garşy ýaşanlary ýiti tankytlady: 'Başgalaryň dogrulygyny buýurýarsyňyzmy we Mukaddes? Azgyny okaýan wagtyňyz özüňizi ýatdan çykarýarsyňyzmy?' Gurhan siziň we Perwerdigäriňiziň arasyndaky ähtdir we her aýat ýuwaşlyk bilen sizden bir zat soraýar - sorag jogap berýärsiňizmi?",
      "Bu kynçylyklar şu. Olaryň hersi belli bir aýaty şu günki güne çenli ýerine ýetirip boljak hereket bilen baglanyşdyrýar: diliňizi mähirli gürlemek, asuda haýyr-sahawat bermek, gadagan edilen zatlardan gözüňizi peseltmek, alyp barýan gahar-gazabyňyzy goýbermek. Bir aýat, bir hereket - hakykatdanam ýerine ýetirmek üçin kiçijik, sizi üýtgetmek üçin hakyky.",
      "Bir kynçylygy diňe hakykatdanam ýerine ýetireniňizde belläň. Gözegçilik nokady görkezilmeýär - bu maksady puja çykarar - başgalaryň görmeýän zadyny görýän Allaha dogruçyl jogapkärçilik. Wagtyň geçmegi bilen, aýat-aýat, okaýyş häsiýetine öwrülýär.",
    ],
    quran: [
      {
        excerpt:
          "Başgalaryň dogrulygyny buýurýarsyňyzmy we Mukaddes? Azgyny okaýarkaňyz özüňizi ýatdan çykarýarsyňyzmy?",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Gurhan wiktorinasy",
    summary:
      "Suranyň atlaryny, gurluşyny, tajweedini, söz baýlygyny we hekaýalaryny gözden geçiriň.",
    body: [
      "Özüňizi barlamak bilimleri berkitmegiň iň täsirli usullaryndan biridir - jogaby ýatlamak ýadyňy täzeden okamakdan has köp güýçlendirýär. Bu wiktorina merkezdäki ähli zatlary öz içine alýar: süreleriň we juzlaryň sany, ilkinji wahý we Gurhanyň nädip saklanyp galandygy, madd we qalkala ýaly tajweed düzgünleri, ýokary ýygylykly söz düzümleri we Gurhanyň hekaýalaryny aýdýan pygamberler.",
      "Niýeti dogry saklaň. Bal, öwrenmek üçin diňe aýna bolup durýar - bu hiç haçan diňe özüne degişli bolan Allah bilen derejäňiziň ölçegi däldir. Gowşak bir ýeri ýüze çykarmak üçin her soragy ulanyň, soňra gabat gelýän sapaga gaýdyp geliň we san yzarlamagyň ýerine şol mowzugy öwreniň.",
      "Iň soňky haýyş, bahalandyrylan sorag däl-de, şöhlelendirmekdir: indiki düşünmek we ýatda saklamak üçin bir süre ýa-da parçany saýlaň, şonuň üçin gözden geçirişiňiz elmydama Kitabyň özüni görkezmek bilen tamamlanýar.",
    ],
    appLinks: [{}],
  },
  {
    title: "Salgylar we çeşmeler",
    summary: "Gurhany, hadyslary, tafsiri we ylmy tapawutlary nädip mysal getirýäris.",
    body: [
      "Yslamyň dogry öwrenilmegi aç-açan subutnamalara esaslanýar, şonuň üçin bu merkezdäki her bir sapak öz işini görkezmegi maksat edinýär. Gurhan baradaky talap, süre süresindäki salgylanma bilen goldanýar: aýat; Sünnetden gelen talap, ýygyndy (Buhari, Musulman, Tirmizi we ş.m.), hadys sanyny we derejesini (sahih, hasan ýa-da has gowşak) atlandyrýar; bir aýatyň manysy baradaky talap, gelip çykan tafsiri atlandyrýar; alymlar hakykatdanam tapawutlanýan ýerlerde tapawut gizlenmän bellendi.",
      "Şeýle hem nämäni düşündirýäninden tapawutlandyrmak möhümdir. Bellenen maglumatlar - bäş günlük doga, Gurhanyň saklanmagy, deňizdäki esasy wakalar aýdyň beýan edilýär. Işatologiýanyň inçe jikme-jiklikleri ýa-da ylmy duýgulary okamak ýaly yhlasly alymlaryň köpden bäri tapawutlanýan meseleleri, kesgitli bir zat däl-de, düşündiriş hökmünde hödürlenýär. Ynam, subutnamanyň güýjüne laýyk gelmelidir.",
      "Has çuňňur öwrenmek üçin esaslandyrylan salgylanmalara bil baglaň: ygtybarly Gurhan terjimeleri (Sahih International ýa-da Pikthall ýaly), ilkinji hadys ýygyndylary (Sahih al-Buhari we Sahih Musulman), hormatlanýan tafsir (Ibn Katir we as-Sa'di) we ygtybarly seerah (Ibn Hişamyň klassiki we ar-Raheekt al-Rahyk).",
      "Netijede, bir programmanyň çäklerini biliň. Munib sizi çeşmelere öwredýär we görkezýär, ýöne dini karar çykarmaýar. Namaz okamak fykhy, tajweed ijaza ýa-da ybadat ýa-da durmuş kararlaryňyza täsir edýän islendik sorag üçin öz mekdebiňizde we sebitiňizde ökde hünärli alym bilen maslahatlaşyň.",
    ],
    sources: [
      "Gurhan - King Fahd toplumy çap edilen / tassyklanan sanly muşaf",
      "Hadys - sunnah.com derejeli çyzgy",
      "Tafsir Ibn Katir (gysgaldylan Darussalam)",
      "Tafsir as-Sa'di (Iňlis)",
    ],
    disclaimer:
      "Munib, açyk bilim mazmunyny jemleýär. Madhhabyňyzda we sebitiňizde ökde alymlar bilen möhüm meseleleri barlaň.",
  },
];

export const QURAN_GUIDE_STRUCTURE_LEVELS_TK: DeepPartial<QuranGuideStructureLevel>[] = [
  {
    count: "1 Kitap",
    detail:
      "Bir kitap - kalam Allah, Allanyň gönümel sözi Muhammet ib Jibreel perişdesiniň üsti bilen aç-açan arap dilinde 23 ýyl töweregi wagt bäri aýan boldy. Dünýäniň hemme ýerinde birmeňzeş tekst.",
  },
  {
    count: "114",
    detail:
      "Gurhan bary-ýogy üç aýatdan 286-a çenli 114 süre bölünýär. Hersiniň ady bar, köplenç içindäki esasy sözden alynýar we Makki ýa-da Madani diýip atlandyrylýar. Mus'fdaky tertibi wahý (tawqifi) bilen kesgitlenýärdi we wahý tertibinden tapawutlanýar.",
  },
  {
    count: "30",
    detail:
      "Okamagy dolandyrmak üçin döredilen otuz töweregi deň bölek. Günde bir juz okamak, Gurhany bir aýda tamamlaýar - Remezan aýynda haty gutarmagyň nusgawy usuly.",
  },
  {
    count: "60",
    detail:
      "Her juz iki hizbä bölünýär, jemi 60 berýär we her hizb kwartallara bölünýär. Bu kiçi bölümler size gündelik ýumşak bölegi - ýarym ýa-da çärýek hizb bellemäge we durnukly endigi saklamaga mümkinçilik berýär.",
  },
  {
    count: "6,236",
    detail:
      "Aýry-aýry aýatlar, şonuň üçin islendik parçany takyk süre hökmünde getirip bolar: aýat. 6,236, adaty Medinäniň sany; beýleki taryhy hasaplaýyş usullary diňe birnäçe aýat araçäkleriniň bellenmegi bilen tapawutlanýar - sözleriň özi birmeňzeş.",
  },
  {
    count: "2 döwür",
    detail:
      "Her süre iki ylham döwrüniň birine degişlidir. Makki (hijri döwründen öň) süreleri köplenç gysga bolýar we ynanç, tawhid we ahyret hakda pikir edýär. Madani (Hijradan soň) süreleri köplenç uzyn bolýar we kanun we jemgyýetiň görkezmesini goşýar. Birnäçe sürede ikisindenem aýatlar bar.",
  },
  {
    count: "Köp",
    detail:
      "Gurhan mowzuk boýunça tertipli däl-de, gaýtalanýan mowzuklarda dokalan. Töwhid, doga, pygamberleriň, maşgalanyň, haýyr-sahawatyň, sabyrlylygyň we ahyretiň hekaýalary Kitabyň hemme ýerinde, köp sürelerde biri-birini güýçlendirýär.",
  },
];

export const QURAN_GUIDE_TIMELINE_TK: DeepPartial<QuranGuideTimelineEvent>[] = [
  {
    title: "Ylhamdan öňki durmuş",
    body: "Pygamberlikden öňki ýyllarda Muhammet Mak Makkan jemgyýetiniň butparazlygy we adalatsyzlygy sebäpli biynjalyk bolup, birnäçe günläp ýalňyzlyk we oýlanmak üçin Hira gowagyna gaýdyp geldi. Daş-töweregindäki dünýä butlara çokunýan bolsa-da, hiç haçan ybadat etmedi we halky oňa şeýle bir doly ynanýardy welin, özüni pygamber diýip atlandyrmazyndan has öň al-Amin diýip atlandyrdylar.",
    location: "Mekge",
  },
  {
    title: "Hira gowagy",
    body: "Remezan aýynda, kyrk töweregi ýaşyndaka, Jibreel perişde gowakda ýekeje buýruk bilen: 'Oka!' Okap ýa-da ýazyp bilmeýän Pygamberimiz, başaryp bilmejekdigine jogap berdi. Perişde ony üç gezek gujaklady, soň bolsa Alaq süresiniň ilkinji sözlerini - 'createdaradany Rebbiň adyndan oka' diýdi. Ol silkindi-de, aýaly Hadyjanyň ýanyna howlugyp, ony eşik bilen baglady we köşeşdirdi.",
    location: "Jabal an-Nur, Mekge",
  },
  {
    title: "Ilkinji ylham - Alaq süresi",
    body: "Okamak buýrugy pygamberligiň we Gurhanyň gelip çykyşynyň başlangyjy boldy. Hadyýa ony öwrenen garyndaşy Waraqah ibn Nawfalyň ýanyna alyp gitdi, perişdäni Musa gelen we pygamberiň halkynyň kowjakdygyny öňünden aýdýan habarçy hökmünde tanady. Ondan soňky Makkan aýatlary, Allanyň birligine, ahyretdäki ynamlara we ahlak özgertmelerine çagyryşdy.",
  },
  {
    title: "Irki Makkan döwri",
    body: "Ilkinji ýyllarda jaň şahsy, soň bolsa açykdy. Ulaldygyça Kuraýşlar imanlylaryň arasynda ejizleri we gullary gynamak üçin yzarlamalara başlady we netijede Pygamberiň urugy Banu Haşime üç ýyllyk boýkot etdi. Zalymlykdan gutulmak üçin bir topar musulman Abyssiýa göçdi we adalatly hristian şasy olara gaçybatalga berdi. Bu döwrüň süreleri adatça gysga, güýçli, ritmiki aýatlarda gürleýärler.",
    location: "Mekge",
  },
  {
    title: "Hijra, Medinä",
    body: "Birnäçe ýyllap yzarlanandan soň we Hadyjany we daýysy Ebu Talyby ýitiren 'gynanç ýylyndan' soň Pygamberimiz we onuň ýoldaşlary Medinä göçüp gitdiler. Bu hijret şeýle bir möhümdi welin, soňra Yslam senenamasynyň başlangyjy boldy. Medinede musulmanlar indi aw edilýän azlyk däl-de, eýsem jemgyýet döredýän bir jemgyýetdi we ylham indi kanun, maşgala, ykdysadyýet we Kitap adamlary bilen gatnaşyklara başlady.",
    location: "Madina",
  },
  {
    title: "Madinan döwri",
    body: "Madinan süreleri, adatça, has uzyn we has jikme-jik bolup, çözülen jemgyýetiň zerur kanunlaryny kesgitleýär: namazyň, zekatyň, agyz beklemegiň, nikalaşmagyň we aýrylyşmagyň, miras, şertnamalar we şertnamalaryň aýratynlyklary. Bu döwürde esasy söweşler - Badr, Uhud we Konfederasiýa bolup geçdi we Gurhan imanlylaryň synaglaryna we ikiýüzlüleriň (munafiqun) meýilnamalaryna aç-açan aýdyňlyk berdi.",
    location: "Madina",
  },
  {
    title: "Hoşlaşyk zyýaraty",
    body: "Pygamber alaýhyssalam hijri edeninden soň onunjy ýylda, Arafatda geçirilen köpçülikleýin ýygnanyşykdan ozal hoşlaşyk wagzyny berdi, ymmatyň ömrüniň we emläginiň mukaddesligini, aýallaryň hukuklaryny, jynsyna garamazdan ähli adamlaryň deňligini we Gurhanda we Sünnetde berk durmak borjuny ýada saldy. Ine, şu aýat aýan boldy: 'Bu gün men seniň diniňi kämilleşdirdim'.",
    location: "Arafat / Mina",
  },
  {
    title: "Ebu Bekriň gollanmasy",
    body: "Pygamberimiz aradan çykanyndan kän wagt geçmänkä, Gurhany tutuş ýatda saklaýan ýoldaşlaryň köpüsi amaamama söweşinde öldürildi. Hafazyň ýitmeginden gorkup, Umar halyf Ebu Bekri Gurhany bir ýere jemlemäge çagyrdy. Ebu Bekir, ýoldaşlaryň ýatlamalaryna garşy barlanan ýazmaça ylhamy üns bilen ýygnan ynamdar kätip Zaýd ibn Tabiti bir sahypada (suhuf) belledi.",
  },
  {
    title: "Standartlaşdyrylan muşaf - Usman",
    body: "Yslam köp ýurtlara ýaýransoň, täze musulmanlaryň arasynda okalýan tapawutlar jedellere sebäp bolup başlady. Ymmatlary bir ýazylan tekstde birleşdirmek üçin halyf Usman, Ebu Bekiriň sufundan Kuraýş şiwesinde göçürilen abraýly nusgalary alyp, beýleki şahsy nusgalarynyň aýrylmagyny haýyş edip, uly şäherlere iberipdir. Bu Usmanly muşaf, tutuş musulman dünýäsiniň şondan bäri dowam edip gelýän standartydyr.",
  },
  {
    title: "Şu güne çenli gorap saklamak",
    body: "On dört asyrdan soň, Gurhan üýtgewsiz galýar, biri-birine bagly üç usul bilen goralýar: her nesilde köpçülikleýin ýat tutmak (hifz), wepaly ýazuw görnüşi we Pygambere gaýdyp gelýän mugallym-okuwçy zynjyrlary (kyrat). Bu, Allanyň beren wadasyny ýerine ýetirýär: 'Hakykatdanam, ýatlatmany iberdik, hakykatdanam gorarys'.",
  },
];

export const QURAN_GUIDE_STORIES_TK: DeepPartial<QuranGuideStory>[] = [
  {
    prophetName: "Adam",
    title: "Adam - ilkinji pygamber we adamzadyň atasy",
    summary: "Crearadylyş, perişdeleriň setrde etmegi, agajyň synagy, toba kabul edildi.",
    body: [
      "Allah ilkinji ynsan Adamy ýarady, palçykdan öz eli bilen, ruhundan dem aldy we oňa başga bir jandar almadyk sowgat berdi: Adam ata ähli zadyň atlaryny öwretdi. Allatagala bu bilimi görkezende, perişdeler öz çäklerini boýun aldylar we Adam atanyň abraýy aýdyň boldy - bilimiň özi adamzady aýyrýan zadyň bir bölegidi.",
      "Soňra Allah perişdelere Adam atasyna hormat bilen sejde etmegi buýurdy we jynlaryň arasynda bolan Iblisden başga hemmeler boýun boldular. Ol özüni otdan we palçykdan ýasalandygyny we özüni beýik hasaplaýandygyny aýdyp, ulumsylykdan ýüz öwürdi. Bu buýsanç, nadanlyk däl-de, onuň ýykylmagydy we Adam atanyň nesillerini azdyrjakdygyna söz berdi.",
      "Adam we aýaly Hawwa bagda ýerleşdirildi we hemme zatdan lezzet alyp biljekdigini, ýöne belli bir agaja ýakynlaşmaly däldigini aýtdylar. Şeýtan iýýänçä, olara yzygiderli pyşyrdady. Derrew ýalaňaçlygy olara äşgär boldy we ýalňyşlyklaryny duýdular. Emma umytdan düşmek ýa-da bahana bermek däl-de, kiçigöwünlilik bilen Allaha ýüz tutdular: 'Rebbimiz, özümize zulum etdik, eger-de bizi bagyşlamasaň we rehim etseň, ýitirenleriň arasynda bolarys'.",
      "Allatagala olaryň tobalaryny kabul etdi we olary ýere iberdi - esassyz jeza hökmünde däl-de, eýsem adamzat synagynyň başlangyjy hökmünde, ýol görkeziji wadasy bilen bilelikde: 'Kim meniň ýol görkezenime ýol bermez, azaşmaz. Adam atanyň kyssasy şeýlelik bilen her bir adamyň kyssasydyr: hormat bilen döredilen, synagdan geçen, ýalňyşmaga ukyply we hemişe gaýdyp bilýän.",
    ],
    lessons: [
      "Toba gapysy elmydama açykdyr - Adamyň bahana ýa-da gijä galman hödürlenýän tawbasy, her bir günäkär üçin görelde bolup durýar.",
      "Ulumsylyk weýrançylygyň kökidir: Iblis hakykaty bilýärdi, ýöne kiçigöwünliliksiz bilimiň ýok edilýändigini görkezip, hakykaty buýsanç bilen ret etdi.",
      "Şeýtanyň usuly güýç däl-de, yzygiderli pyşyrdaýar - tekliplerini tanamak olara garşy durmagyň ýarysydyr.",
      "Ynsan gymmaty bilim bilen baglanyşdyrylýar we günäsiz däl-de, Allaha ýüzlenýär - bu bizi kesgitleýän ýalňyşlyga jogap.",
    ],
    quran: [
      {
        excerpt: "Adam atanyň ýaradylyşy we perişdeleriň setrde etmegi.",
      },
      {
        excerpt: "Synag, ýykylmak we toba.",
      },
    ],
    location: "Jannah, soň ýer",
  },
  {
    prophetName: "Nuh",
    title: "Nuh - asyrlar boýy ret etmek arkaly sabyr",
    summary: "950 ýyllyk dawa, sandy we suw joşmasy ylahy höküm hökmünde.",
    body: [
      "Nuh butlara çokunýan bir halka iberildi we olary haýran galdyryjy uzak wagtlap diňe Allaha ybadat etmäge çagyrdy - Gurhan olaryň arasynda müň ýyl elli ýyldan az galandygyny ýatlaýar. Olary gije-gündiz aç-açan we aç-açan çagyrdy we olara ähli sebäpleri teklip etdi: bagyşlamak, ýagyş, baýlyk, çagalar we baglar. Yetöne nesilden-nesle ýüz öwürdiler, masgaraladylar we gulaklaryny sakladylar.",
      "Mundan beýläk ynanmajakdygy aýdyň bolansoň, Allah Nuh gämini gurmagy buýurdy.Haýsy deňizden uzakda uly gämi guranda, halky ony masgaraladylar, ýöne düşünjek günleriniň geljekdigini aýtdy. Peç suw dökülende alamat geldi; Nuh imanlylara münüp, diňe birnäçe - we her dürli haýwan jübütini aldy.",
      "Suw joşup, ret edenleri gark etdi. Hekaýanyň iň içgysgynç pursatlarynyň birinde Nuhuň ogly suwdan gaçmak üçin bir daga çykjakdygyny aýdyp, münmekden ýüz öwürdi we gark bolanlaryň arasynda - kakanyň hasraty ogluň ynamsyzlygyny basyp alyp bilmedi. Nuh ýalbardy, Allah oglanjygyň eden etmişleriniň arasyndaky iman baglanyşygyny kesendigini öwretdi.",
      "Buýruk gelende suwlar azaldy we Gämi Judi dagynda dynç aldy. Gurhan, Allanyň imanlylary nädip halas edendigini we ahyrsoňy sabyrlylygyň nädip aklanýandygyny görkezýän her bir adam üçin “alamat” hökmünde saklanýar.",
    ],
    lessons: [
      "Az sanly yzarlaýjysy bolan uzak we kyn iş şowsuzlyk däl - Nuh asyrlar boýy wagyz etdi, sanlary däl-de, ak ýürekliligi Allany razy etdi.",
      "Hiç bir maşgala baglanyşygy adamy imansyz halas etmeýär: Nuhuň ogly, ýolbeletiň miras däldigini subut edip gark boldy.",
      "Allaha çagyryşda tutanýerlilik, hatda hemişe masgaralasa-da, ybadat görnüşidir.",
      "Allanyň halas etmegi bellenilen wagtda gelýär - imanly, wada ynanyp, suw joşmazyndan ozal tabynlyk gämisini gurýar.",
    ],
    quran: [
      {
        excerpt: "Nuh hakda hekaýa.",
      },
      {
        excerpt: "Nuhuň halkyna eden haýyşy.",
      },
    ],
    location: "Gadymy Mesopotamiýa (alymlaryň çaklamalary)",
  },
  {
    prophetName: "Ybraýym",
    title: "Ybraýym - Allanyň dosty (Halilullah)",
    summary: "Butlary döwüp, ot sowady, Ysmaýyly gurban etdi, Käbäni gurdy.",
    body: [
      'Ybraýym ýaş wagtynda-da öz halkynyň we kakasynyň oýup, ybadat edýän butlaryny ret edip, tawhid ýoluny pikir edipdir. Ol olar bilen jedel etdi, soň hereket etdi: bir festiwalda bolmadyklarynda, ähli butlaryny döwdi, ýöne iň ulusydy we düşündiriş talap edenlerinde, ybadat edýän zatlarynyň ejizligini paş edip, uly butyň özünden soramagyny isledi. Muňa gahary gelip, uly ot gurup, ony zyňdylar, ýöne Allah: "Eý, ot, Ybraýyma salkynlyk we howpsuzlyk" buýurdy we zyýansyz çykdy.',
      "Allanyň emri bilen aýaly Hajar we bäbek ogly Ysmaýyly Makka jülgesinde galdyrdy. Suwlary gutaransoň, Hajar Safa we Marwah depeleriniň arasynda umytsyzlyk bilen ylgady - kömek gözleýän Musulmanlar Haj sazynda gaýtadan gözlenýär - Zamzam çeşmesi çaganyň aýagynda çykýança. Birnäçe ýyldan soň, Ybraýym düýşünde söýgüli ogluny gurban bermelidigini gördi. Ata we ogul ikisi hem Allanyň islegine boýun boldular; Ybraýym muny ýerine ýetirmekçi bolanda, Allatagala her ýyl Gurban baýramynda ýatlanylýan ajaýyp goç bilen Ysmaýyly satyn aldy.",
      "Ybraýym we ulalan Ysmaýyl bilelikde Mekgede Käbäniň düýbüni galdyrdylar we namaz okaýarlar: 'Rebbimiz, muny bizden kabul et'. Ybraýym, şeýle hem, öz nesilleriniň arasynda bir pygamberiň ýetişmegini dileg etdi - Muhammet pygamberde ýüzlerçe ýyl soň dileg edildi. Allatagala yhlas bilen wepalylygy üçin Ybraýyma özboluşly at berdi: Allanyň ýakyn dosty Halilullah.",
    ],
    lessons: [
      "Töwhid butparazlyk iň meşhur, miras galan kada bolsa-da, oňa garşy durmak howply bolsa-da, ýalan goşulmalary bozmagy talap edýär.",
      "Allaha doly bil baglamak, buýrugy iň kyn bolanda has aýdyň şöhle saçýar - Ybraýym hatda ogluny gurban bermäge-de boýun egdi we Allah synagyň ýerine rehimdarlyk bilen çalyşdy.",
      "Allaha bil baglamak passiwligi aňlatmaýar: Hajar ylgady we gözledi, Zamzam geldi - tagalla we tawakkul bilelikde işleýär.",
      "Yhlasly amallar nesilleriň arasynda ýaňlanýar; Haj dessurlary we Käbäniň abraýy Ybraýymyň tabynlygyndan gözbaş alýar.",
    ],
    quran: [
      {
        excerpt: "Ybraýym, Ysmaýyl we gurban.",
      },
      {
        excerpt: "Bileleşik we miras.",
      },
    ],
    location: "Yrak, Lewant, Mekge",
  },
  {
    prophetName: "Yusufusup",
    title: "Yusufusup - sabyrlylygyň gözelligi (sabr jameel)",
    summary: "Dönüklik, gulçulyk, türme, häkimiýete çykmak - her synagda ynam.",
    body: [
      "Yusufusup oglan wagty on bir ýyldyzyň, Günüň we Aýyň özüne seatedde etmek arzuwyny gördi - bu geljegiň alamaty. Kakasy ubakup, özi-de pygamber, oňa gabanjaň doganlaryndan gizlenmegi buýurdy. Göriplik olary ýeňdi: Yusufusuby guýynyň düýbüne taşladylar we kakasyna möjegiň iýendigini aýtdylar. Geçip barýan kerwen oglany tapyp, Müsüre satdy.",
      'Asylly adamyň öýünde ajaýyp gözellik we dogruçyl adam bolup ýetişdi. Asylly adamyň aýaly ony aldamakçy bolanda, Yusufusup: "Alladan gaçybatalga soraýaryn" -diýip, haýbat atanda günä sebäpli türmäni saýlady. Bigünä bolsa-da, ençeme ýyllap türmä basyldy. Ol ýerde beýleki tussaglaryny tawhid çagyrdy we Allanyň rugsady bilen arzuwlaryny düşündirdi.',
      "Patyşa ýedi semiz sygyr iýen ýedi semiz sygryň düýşüni biynjalyk edeninde, Yusufusup muny ýedi ýyllyk açlyk, ýedi açlyk diýip düşündirdi we däne saklamagy maslahat berdi. Akyllylygy we ygtybarlylygy bilen ahyrsoňy tanalýan Müsüriň ammarlaryna ýolbaşçylyk edildi.",
      "Açlyk ahyrsoňy doganlaryny Müsüre iýmit gözlemäge mejbur etdi, öňlerinde güýçli ministri tanamady. Olary synagdan geçirenden soň, Yusufusup özüni açdy we ar almagyň ýerine olary doly bagyşlady: 'Bu gün size günäkär bolmaz. Alla sizi bagyşlasyn '. Maşgala birleşdi, ene-atasy hormatlandy we çagalyk arzuwy hasyl boldy.",
    ],
    lessons: [
      "Sabr jameel - owadan sabyr - adamlara ajy ýa-da arz-şikaýat etmezden kynçylyklara çydamak, hasratyňyzy diňe ubakubyň edişi ýaly Allaha eltmek diýmekdir.",
      "Päklik her hili gymmada düşýär: Yusufusup günä sebäpli türmäni saýlady we Allatagala bu sebäpli derejesini ýokarlandyrdy.",
      "Allanyň meýilnamasy köplenç görnüp duran betbagtlygyň aňyrsynda gizlenýär - guýy, gulçulyk we türme Yusufusubyň hormatyna tarap ädimdi.",
      "Güýçliler öz güýçlerini bagyşlamak arkaly görkezýärler: güýçli bolanda Yusufusuf özüne zulum edenleri bagyşlady.",
    ],
    quran: [
      {
        excerpt: "Iň gowy hekaýalar - bir sürede aýdylýar.",
      },
    ],
    location: "Kengan, Müsür",
  },
  {
    prophetName: "Musa",
    title: "Musa - Allah bilen gürleşdi we fyrown bilen ýüzbe-ýüz boldy",
    summary: "Ot ýakýan gyrymsy, fyrowna, Çykyş, Töwrat we aýlanyp ýören halka garşy alamatlar.",
    body: [
      'Musa, Allanyň islegi boýunça fyrownyň öz köşgünde ulaldy, ejesi ony fyrownyň Ysraýyl oglanlaryny öldürmeginden halas etmek üçin derýa goýdy. Aaş wagtynda öldürilenden soň Müsürden gaçdy we birnäçe ýyldan soň çölden gaýdyp, Tur dagynda ot gördi. Ol ýerde Allah gönüden-göni gürleşdi - bu Musa, Alla bilen gürleşen Kalimullah adyna eýe bolan hormat: "Hakykatdanam, men siziň Rebbiňiz". Ol dogany Harun bilen goldaw hökmünde zalym fyrownyň ýanyna iberildi: Ysraýyl ogullaryny goýber.',
      "Fyrown hudaýdygyny aýtdy we boýun towlady. Allatagala Musa aç-açan alamatlar berdi - hasasy diri ýylana, eli bolsa ýalpyldawuk ak reňkde boldy. Fyrown özüni abraýdan düşürmek üçin iň ökde jadygöýlerini çagyrdy, ýöne Musanyň işgärleri olaryň hyýallaryny ýuwudanda, jadygöýler hilegärlikden hakyky hakykaty tanadylar we sejde etdiler, Musanyň we Harunyň Rebbine ynanýandyklaryny yglan etdiler, hatda fyrownyň olara ölüm howpy abanýardy. Gyrgynçylyklaryň yzy bilen, fyrown diňe gatylaşdy.",
      "Ahyrynda Allah Musa öz halkyny gijelerine çykarmagy buýurdy. Fyrown olary deňze çykardy. Musa ony hasasy bilen urdy we suw bölünip, imanlylara gury ýerden geçmäge mümkinçilik berdi. Fyrown we onuň goşuny yzarlanda, deňiz olaryň üstünden ýapyldy we gark boldular. Soňra Musa Töwraty kabul etdi, ýöne Bani Ysraýyl birkemsiz subut etdi - ýok wagty altyn göle çokunýardy we wada berlen ýere girmekden ýüz öwürdi we netijede kyrk ýyllap aýlandy.",
    ],
    lessons: [
      "Zalymlyga hakykaty aýdyň, bütinleý Allaha bil baglaň - Musa öz döwrüniň iň güýçli adamy diňe iman bilen ýaraglandy.",
      "Hatda yhlasly imanlylaram yrgyldap bilerler: Musanyň garşysyna çykan jadygöýler, aç-açan bir pursatda gudrat gören bütin halkdan has berk boldular.",
      "Ajaýyplyklara şaýat bolmak öz-özünden iman getirmeýär - ýol görkezmek, Allanyň gödek däl-de, kiçigöwünlilere berýän sowgadydyr.",
      "Allah ezilenleri halas edýär we ulumsylary nähili güýçli bolsa-da hasaplaýar.",
    ],
    quran: [
      {
        excerpt: "Musa Turda we fyrownyň öňünde.",
      },
      {
        excerpt: "Dogulmak we terbiýe.",
      },
    ],
    location: "Müsür, Sinaý",
  },
  {
    prophetName: "Işaýa",
    title: "Isa ibn Merýem - Alladan gelen söz we ruh",
    summary:
      "Gudratly dogluş, alamatlar, Allaha göterildi - Gurhanda öldürilmedi we haça çüýlenmedi.",
    body: [
      'Allatagala öz döwrüniň aýal-gyzlarynyň iň gowusy diýip bellän päk we takwa aýal Merýem maşgalasyndan gündogarda bir ýere gitdi. Ol ýerde Jibreel perişde oňa adam görnüşinde peýda boldy we hiç kim oňa degmedik bolsa-da, Allanyň özüne arassa ogul berjekdigini habar berdi. Ol Allanyň "Bol" sözi bilen göwreli boldy we Isa ýaradyldy - Gurhan ýaradylyşyny, atasyz ýaradylan Adam bilen deňeşdirýär we Allanyň islän zadyny döredýändigini görkezýär.',
      'Çagany göterip gaýdyp gelende, halky ony günäkärledi. Özüni goramak üçin bäbek Isa bäbekden gürledi we özüni Allanyň guly diýip yglan etdi we pygamber etdi - ejesiniň abraýyny gudrat bilen arassalady. Ysraýyl ogullaryna pygamber hökmünde Isa Allanyň rugsady bilen aç-açan alamatlar berdi: körleri we heýwere keselini bejerdi, ölülere jan berdi we uçup barýan palçykdan guş emele getirdi - elmydama bularyň öz güýji bilen "Allanyň rugsady bilen" bolandygyny nygtady.',
      "Gurhan Isanyň öldürilmändigi ýa-da haça çüýlenmändigi aýdyňdyr. tersine, duşmanlaryna şeýle görünmek üçin edildi we Allatagala ony Özüne galdyrdy. Esasy sünni ynanjy, soňky gününden öň gaýdyp geljekdigini öňe sürýär. Iň möhümi, Gurhan Isanyň ynsan pygamberi we Allanyň gulydygyny, ylahy däl-de, Hudaýyň ogly däldigini öňe sürýär.",
    ],
    lessons: [
      "Allatagala isleýşi ýaly ýaradýar - Isanyň atasyz dünýä inişi, Adam atanyň tozandan ýaradylyşy ýaly, Onuň güýjüniň dünýä sebäbiniň ýokdugyny görkezýär.",
      'Isanyň görkezen her gudraty, "Allanyň rugsady bilen" aç-açan aýdylýar, pygamberlere Allanyň güýjüni gönükdirýär, olarda ýok.',
      "Pygamberler Allanyň hormatlanýan bendeleri, hiç haçan ybadat edilmeli däldirler - Gurhan Isanyň hakyky ýagdaýyny çişirmekden goraýar.",
      "Merýemiň päkligi, sabyrlylygy we ynamy ony ähli imanlylar, aýallar we erkekler üçin iman nusgasyna öwürýär.",
    ],
    quran: [
      {
        excerpt: "Dogulmak we bäşlik.",
      },
      {
        excerpt: "Öldürilmedi we haça çüýlenmedi; ulaldy.",
      },
    ],
    location: "Palestina",
  },
  {
    prophetName: "Muhammet ﷺ",
    title: "Muhammet ﷺ - pygamberleriň möhri",
    summary: "Soňky habarçy; Gurhan 23 ýyl bäri wahý etdi; älemlere rehimdarlyk.",
    body: [
      "Muhammet Mak takmynan 570-njy ýylda Mekgede Kuraýş taýpasynda dünýä indi. Petim ýaş - kakasy dünýä inmezden ozal, ejesi bolsa alty ýaşyndaka aradan çykdy - ony ilki atasy, soň daýysy Abu Talib terbiýeledi. Pygamberlikden has öň dogruçyllygy üçin şeýle bir ynam edilipdi welin, halky ony al-Amin, 'ygtybarly' diýip atlandyrdy. Kyrk ýaşynda Hira gowagynda pikirlenip otyrka, Jibreel perişde arkaly Gurhanyň ilkinji wahýyny aldy.",
      "Mekgede on üç ýyllap adamlary diňe Allaha ybadat etmäge çagyrdy we ýiti yzarlamalara sezewar edildi: masgaralamak, yzyna eýerijileriň arasynda ejizleri gynamak we urugynyň maýyp sosial-ykdysady boýkoty. Singleeke-täk gynanç ýylynda, söýgüli aýaly Hadyjany we goragçysy Abu Talyby ýitirdi we golaýdaky Taifden goldaw soranda kowuldy we daş atyldy, ýöne ýok edilmegi däl-de, ýol görkezmegi üçin doga etdi.",
      "Medinä göçenden soň bir jemagat gurup, Badr, Uhud we Konfederasiýa synaglaryndan geçdi. Ahyry güýçli güýç bilen Mekgäni basyp almak üçin gaýdyp gelende, ony gynaýan we kowup çykaranlardan ar almady; olary bagyşlady we: Go Bar, sen azat \"diýip yglan etdi. Gurhan öz wezipesini ýekeje söz bilen jemleýär - 'dünýälere rehimdarlyk' - we borjuny habary aç-açan bermek, hiç kime ynanmaga mejbur etmek däl.",
    ],
    lessons: [
      "Adamda bolup biljek iň oňat häsiýet, Pygamberiň häsiýetidir - seerasyny ýakyndan öwreniň we ony gündelik durmuşda özleşdirmäge çalyşyň.",
      "Merhemet we bagyşlamak ejizlik däl-de güýçdir: güýjüniň iň ýokary derejesinde iň erbet duşmanlaryny bagyşlady.",
      "Allaha jaň eden adam habary çyn ýürekden we sabyr bilen ýetirýär, ýöne netijesini Allaha galdyrýar - ýol görkezmekdir.",
      "Synaglar pygamberleriň ýoludyr; Allanyň razylygy üçin kynçylyklara çydamak, edil imanyň nyşanydyr.",
    ],
    quran: [
      {
        excerpt: "Seni dünýälere rehim etmekden başga ibermedik.",
      },
      {
        excerpt: "Aralarynda rehimdar, kapyrlara garşy berk.",
      },
    ],
    appLinks: [{}],
  },
];

export const QURAN_GUIDE_THEMES_TK: DeepPartial<QuranGuideTheme>[] = [
  {
    title: "Iman (Iman)",
    summary:
      "Allaha, perişdelerine, kitaplaryna, habarçylaryna, ahyret gününe we ylahy kararyna ynanmak.",
    lessons: [
      "Iman, Gurhanyň bir ýerde ýygnan alty makalasyna esaslanýar: Allaha, perişdelerine, aýan edilen kitaplaryna, pygamberlerine, ahyret gününe we ylahy buýruga - onuň gowy we erbet taraplaryna ynanmak.",
      "Iman kesgitli, bir gezeklik tassyklama däl. Esasy sünni ynançlarynda boýun bolmak we ýatlamak bilen köpelýär we günä we biperwaýlyk bilen azalýar, şonuň üçin iman işjeň ösýän zat.",
      "Pygamberimiz, imanyň ýetmişden gowrak şahasynyň bardygyny, iň ulusyndan başlap, Alladan başga hudaýyň ýokdugyna şaýatlyk edip, ýoldan zyýany aýyrýança, hatda ownuk ýagşy amallaryňam imanyň bir bölegidigini öwretdi.",
      "Hakyky iman diliň öňünde ýüregiň meselesidir: Allany hakykatdanam tanamak, Ony hemme zatdan ýokary söýmek, Onuň göwnünden turmazlyk we bütinleý Oňa bil baglamak.",
    ],
    quran: [
      {
        excerpt: "Resul, Rebbinden özüne aýan edilenlere, iman edenlere-de ynanýar ...",
      },
    ],
    hadith: [
      {
        excerpt:
          'Imanyň ýetmişden gowrak şahasy bar; iň beýikleri: "Alladan başga hudaý ýok" diýmek, iň pes zat ýoldan zyýanly bir zady aýyrmak - sadalyk imanyň şahasydyr.',
      },
    ],
    actions: [
      "Şahadaňyzy adaty söz düzümi hökmünde däl-de, manysyna doly üns beriň.",
      "Allanyň atlaryndan birini öwreniň, düşüniň we duaňyzda Oňa çagyryň.",
    ],
  },
  {
    title: "Namaz (Namaz)",
    summary: "Ilkinji amal Kyýamat güni - hyzmatkäri Reb bilen baglanyşdyrýan sütün hakda sorady.",
    lessons: [
      "Namaz yslamyň ikinji sütünidir we kyýamat güni bir hyzmatkäriň ilkinji işi barada sorag ediler - dogry bolsa, ýazgylaryň galan bölegi yzarlanýar.",
      "Gurhan, hakyky ýürek bilen ýerine ýetirilen doga adamy ahlaksyzlykdan we nädogry hereketlerden saklaýar diýýär; bu diňe bir däp-dessur däl, eýsem günde bäş gezek kalbyň gaýtalanýan görnüşi.",
      "Earther ýüzünde aýan edilen beýleki borçlardan tapawutlylykda, salat pygamberiň asmana göterilen döwründe (al-Isra wal-Miýraj) ymmat üçin bellendi, bu aýratyn sowgat we imanly adamyň Allaha çykmak üçin serişdesi hökmünde bellendi.",
      "Günde bäş gezek gaýtalanýandygy sebäpli, namaz bir amal bilen beýlekisiniň arasynda imany dowam etdirýän yzygiderli ritmdir.",
    ],
    quran: [
      {
        excerpt:
          "Hakykatdanam, doga ahlaksyzlygy we ýalňyşlygy gadagan edýär we Allany ýatlamak has uludyr.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Hyzmatkäriň kyýamat güni höküm ediljek ilkinji işi, onuň dogasy bolar; dogry bolsa, üstünlik gazandy, kemçilikli bolsa şowsuzlyga uçrady.",
      },
    ],
    actions: [
      "Al-Fatihanyň sözlerini okaýarka düşünip, şu gün bir namaz okaň.",
      "Namazyňyzyň bir bölegini güýçlendirmek üçin Munibiň “Namaz” gollanmasyny açyň.",
    ],
  },
  {
    title: "Ene-atalar",
    summary:
      "Ene-atalara hoşniýetlilik Allaha ybadat bilen jübütlenýär - şirkden soň olara minnetdarlyk duýulýar.",
    lessons: [
      "Allah, ene-atalara hoşniýetliligi şol bir aýatda gönüden-göni ybadatlaryna goşýar - bu yslamda hukuklarynyň näderejede möhümdigini görkezýär.",
      'Gurhan gahar-gazabyň iň kiçijik alamatyny-da gadagan edýär: olara "uff" diýmek ýa-da gödek gürlemek däl-de, mylaýym, abraýly sözler bilen ýüzlenmek.',
      "Buýruk garrylyk döwründe iň ýokary derejä ýetýär, haçan-da ene-atalar sabyrlylyga mätäç: bir wagtlar size ideg edişleri ýaly olara ideg ediň we rehimdarlyk sebäpli kiçigöwünlilik ganatyny aşak salyň.",
      "Yhlas ölüm bilen gutarmaýar - ene-atalar üçin dua etmegi dowam etdirmek, olaryň adyndan haýyr-sahawat bermek, dostlaryna we wadalaryna hormat goýmak dowam edýän wepalylykdyr.",
    ],
    quran: [
      {
        excerpt:
          "Perwerdigäriňiz Ondan başga hiç kime ybadat etmezligiňizi we ene-atalara mähirli bolmagyňyzy buýurdy ...",
      },
    ],
    actions: [
      "Şu gün hoşniýetli sözler bilen ene-atany çagyryň ýa-da habar iberiň.",
      "Ene-ataňyza dua ediň.",
    ],
  },
  {
    title: "Sabyr (Sabr)",
    summary: "Tabynlykda berk bolmak, günäden saklamak we synaglary kabul etmek.",
    lessons: [
      "Alymlar sabrlary üç görnüşde suratlandyrýarlar: Allaha boýun bolmakda sabyr, günäden uzak durmak üçin sabyr we synaglar başlanda Onuň kararyny kabul etmekde sabyr.",
      "Sabr passiw umytsyzlyk ýa-da dişleriňizi izolirlemek däl - Gurhan ony kömek çeşmesi hökmünde doga bilen jübütleýär, şonuň üçin sabyr işjeňdir we sizi Allaha tarap öwürýär.",
      "Allatagala özüni 'hassanyň ýanyndadygyny' yglan edýär we näsaga sylagyny çäksiz wada berýär - bu başga bir hil diýen ýaly hormat däl.",
      "Pygamberler adamlarda iň synagdan geçirildi we Gurhan görelde hökmünde görelde alýar - keselinde Aýýub, hasratda ubakup, dönüklik we türmede Yusufusuf.",
    ],
    quran: [
      {
        excerpt:
          "Eý iman edenler, sabyr we doga bilen kömek soraň. Hakykatdanam, Allah sabyrlydyr.",
      },
    ],
    actions: [
      "Bu gün gaharlanma ýüze çykanda, duruň, dem alyň we reaksiýa bildirmezden ozal 'Inna lillahi wa inna ilayhi raji'un' diýiň.",
      "Bu hepde bir kyn pursaty arz-şikaýatyň ýerine iki rekagat namaza öwüriň.",
    ],
  },
  {
    title: "Haýyr-sahawat (Sadaka we Zekat)",
    summary: "Baýlygy arassalamak we mätäçlere iýmit bermek - hakyky imanyň alamaty.",
    lessons: [
      "Zekat - baýlygy saýlamak üçin her ýyl arassalaýan haýyr-sahawat - Yslamyň üçünji sütünidir we borçdyr, sadaka bolsa çäksiz we çäksiz görnüşleri bilen meýletin berýär.",
      "Gurhan, Allanyň razylygy üçin sarp edilen baýlygyň ýitirilmän, köpeljekdigini wada berýär: ýedi gulak ösdürip ýetişdirýän, hersi ýüz däne göterýän bir tohum ýaly, Alla islänine has köpelýär.",
      "Haýyr-sahawat diňe pul däl. Pygamberimiz brother ýylgyrýan ýüzüňiz bilen doganyňyza duşmagyň hem haýyr-sahawatdygyny, şonuň üçin hiç kimiň bermäge garyp däldigini öwretdi.",
      "Bermek baýlygy-da, berijini-de arassalaýar, açgözlügi gowşadýar we rehimdarlygy döredýär - şonuň üçin zekat sözüniň özi arassalanmagy we ösmegi aňladýar.",
    ],
    quran: [
      {
        excerpt:
          "Allanyň ýolunda sarp edenleriň mysaly, ýedi tüýdük ösdürip ýetişdirýän däne ýalydyr ...",
      },
    ],
    actions: [
      "Bu gün bir zat beriň - pul, wagtyňyz ýa-da hakyky mähirli söz - kiçi we görünmeýän hem bolsa.",
      "Munibdäki zekat borçlaryňyzy gözden geçiriň we indiki tölegiň haçan bolmalydygyny belläň.",
    ],
  },
  {
    title: "Toba (Tawbah)",
    summary: "Allah toba edenleri söýýär - ruh bokurdagyna ýetýänçä gapy açyk.",
    lessons: [
      "Yhlasly tawbanyň aç-açan şertleri bar: günä üçin çyn ýürekden ökünmek, derrew ony duruzmak we gaýdyp gelmezlik baradaky berk karar - eger günä başga birine zulum eden bolsa, hukuklaryny hem dikeltmek.",
      "Allatagala diňe toba etmäge rugsat bermeýär - Özüne gaýdyp gelýänleri gowy görýär, şonuň üçin süýşenden soň gaýdyp gelmek, size garşy bellik däl-de, Oňa söýgüdir.",
      "Merhemetiň gapysy haýran galdyryjy giňdir: Allatagala hatda özüne zulum edenlere-de umytdan düşmezligi tabşyrýar, çünki çyn ýürekden toba eden adam üçin ähli günäleri bagyşlaýar.",
      "Toba uly günäler ýa-da ajaýyp pursatlar üçin saklanmaýar - günüň dowamynda istighfar (bagyşlamak isleýär) ýüregi ýumşak we hasaby arassa saklaýar.",
    ],
    quran: [
      {
        excerpt:
          "Aýt: Eý, gullarym, özlerine garşy hyýanat edenler, Allanyň rahmetinden umytdan düşmäň ...",
      },
    ],
    actions: [
      "“Astaghirullah” diýiň, şu gün 100 gezek aýdyň, agramyny göteriň.",
      "Allanyň göwnüne degmeýän bir endigiň adyny aýdyň we ony terk etmek üçin ilkinji anyk ädim ätiň.",
    ],
  },
  {
    title: "Jennet (Jannah)",
    summary:
      "Muttaqin üçin taýýarlanan baky sylag - aýdyň we höweslendiriji jikme-jiklikde beýan edilýär.",
    lessons: [
      "Gurhan Jannany aç-açan we täsir galdyryjy jikme-jiklikler bilen düşündirýär - derýalaryň akýan baglary, ebedi rahatlyk we dogruçyllar bilen birleşmek - takyk imanlyny islemek we ymtylmak üçin.",
      "Jennete girmek, diňe amallar bilen däl-de, ahyrsoňy Allanyň rahmeti bilen bolýar. iman we yhlasly zähmet serişdedir, ýöne hiç kimiň işleri Onuň merhemeti bolmazdan baky sylag gazanyp bilmez.",
      "Gurhan imanlylary bäsleşmäge we bagyşlanmaga we “asman we ýer ýaly giň” bagy çagyrmaga çagyrýar - bu passiw umyt edilmän, işjeň yzarlanmalydyr.",
      "Hemmeleriň iň uly sylagy baglar ýa-da derýalar däl-de, eýsem Allanyň ýüzüni görmekdir - Jennet halkyna iň uly şatlyk wada berilýär.",
    ],
    quran: [
      {
        excerpt: "Perwerdigäriňden we asman we ýer ýaly giň bagdan howlukma ...",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Jähennem oty (Jahannam)",
    summary: "Hakyky duýduryş - imanlylary umytdan düşürmek däl-de, ägäligi oýarmak.",
    lessons: [
      "Jahannam metafora däl-de, hakyky duýduryşdyr - Gurhan muny aç-açan suratlandyrýar, adamlar howp abanýar we mümkin boldugyça ugruny üýtgedýär.",
      "Otdan gorkmak, Allanyň rahmetine bolan umyt bilen bilelikde işlemek üçin niýetlenendir: imanly kawf (gorky) bilen raja (umyt) arasynda gezýär, şonuň üçin umytsyzlyk ýa-da ýalan howpsuzlyk öz üstüne almaýar.",
      "Gurhanyň bir günäsi bagyşlanýar, eger bir adam ölse, şirkdir - Allaha şärikdir; islän zadyny bagyşlap bilýäninden az zat.",
      "Allatagala adamlary Özüne gaýdyp getirmek, toba edenleri ezmezlik üçin duýduryş berýär - her duýduryş Gurhanda gaýdyp gelmek üçin açyk çakylyk bilen jübütlenýär.",
    ],
    quran: [
      {
        excerpt:
          "Hakykatdanam, Allah Öz bilen gatnaşygy bagyşlamaz, ýöne isläninden pes zady bagyşlar.",
      },
    ],
    actions: [
      "Şu gün her namazdan soň Alladan sizi otdan goramagyny tüýs ýürekden soraň.",
      "Töwhidiňizi täzeläň: Jahannamdan iň ygtybarly gorag diňe Allaha ybadat ediň.",
    ],
  },
  {
    title: "Adalat",
    summary: "Özüňize ýa-da garyndaşlaryňyza garşy adalat üçin berk duruň.",
    lessons: [
      "Gurhanda adalat barlyşyksyz: hakykat özüňe, ene-ataňa ýa-da iň ýakyn garyndaşlaryňa garşy çyksa-da, oňa berk dur.",
      "Allah halka bolan ýigrenji sizi hiç haçan adalatsyzlyga itermezligi buýurýar - 'adalatly boluň; dogrulyga has ýakyn (takwa) '- şonuň üçin adalat hatda duşmanlara-da bergidir.",
      "Zulum (zulm) garşy berk duýduryş berilýär; Pygamberimiz, nädogry adamyň kyýamat güni garaňkylyk ýaly görünjekdigini öwretdi.",
      "Adalat diňe kazylar we hökümdarlar üçin däl, dogruçyl gürlemekde, adalatly işlemekde, sözüňizi saklamakda we her bir adama öz hukugyny bermekde ýaşaýar.",
    ],
    quran: [
      {
        excerpt:
          "Adalaty goraýjylar, özüňize ýa-da ene-atalaryňyza we garyndaşlaryňyza garşy bolsaňyzam, Allaha şaýat boluň.",
      },
    ],
    actions: [
      "Bu gün birine öz hukugyny beriň - adalatly aýlyk, dogruçyl jogap ýa-da bergiňiz.",
      "Ikitaraplaýynlygyň sizi adalatsyzlyga sezewar edýän pursatyny alyň we ýerine adalat saýlaň.",
    ],
  },
  {
    title: "Bilim",
    summary: "Oka, pikirlen we 'Rebbim, meni bilimde artdyr' diý.",
    lessons: [
      "Gurhanyň ilkinji aýan eden sözi 'Oka' - Yslam däp-dessur bilen däl-de, aňyň sowatlylygyna we ýürek bilimine hormat goýmak bilen açyldy.",
      'Allah hatda Pygamberine has köp zat soramagyny dowam etdirmegi buýurdy: "Lorda Reb, meni bilimde artdyr" - Gurhanyň oňa köpeltmegi tabşyrýan ýeke-täk zady.',
      "Peýdaly bilimler herekete geçmeli we berilmeli; Pygamberimiz alymlaryň baýlygy däl-de, bilimi miras alýan pygamberleriň mirasdüşeridigini öwretdi.",
      "Mukaddes bilim gözlemegiň özi ybadatdyr we Gurhan bilýänler bilen bilmeýänleriň arasynda aç-açan tapawutlandyrýar - 'deňmi?'",
    ],
    quran: [
      {
        excerpt: "We aýdyň: Lorda Reb, meni bilimde artdyr.",
      },
    ],
    actions: [
      "Şu gün Gurhandan täze bir zady öwreniň - aýat, söz ýa-da höküm - we birine öwrediň.",
      "'Rabbi zidni ilma' duasyny ýatda saklaň we okamazdan ozal aýdyň.",
    ],
  },
  {
    title: "Pygamberler",
    summary: "Guidanceolbaşçylyk, synag we ylahy goldaw hekaýalary - güýmenje däl-de, görkezme.",
    lessons: [
      "Gurhan hiç bir milletiň ýol görkezmezden galmandygyny öwredýär: 'Aralarynda duýduryş berleninden başga jemagat ýok' - şol bir tawhid habary hemme ýere iberilýär.",
      "Pygamberleriň hemmesi bir çagyryş getirdiler - diňe Allaha ybadat ediň - we olaryň hekaýalary taryh üçin däl-de, 'düşünýänler' üçin görkezme hökmünde aýdylýar.",
      "Muhammet the pygamberleriň möhüridir, iň soňky habarçydyr we bir musulman özünden öňki pygamberlere - Nuh, Ybraýym, Musa, Isa we beýlekilerine ynanmalydyr - olaryň arasynda hiç hili tapawut goýmaz.",
      "Pygamberler ylahy däl-de, Allanyň adamlary we gullarydy; Gurhan olara hormat goýýar, ýöne olary ýaradylyş tarapynda saklaýar, thearadanyň ýanynda hiç wagt ybadat etmeýär.",
    ],
    quran: [
      {
        excerpt: "Olaryň hekaýalarynda düşünýänler üçin sapak…",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Aýallar",
    summary: "Hukuklar, mertebe we ruhy deňlik - Merýem aýallaryň iň gowularyndandyr.",
    lessons: [
      "Gurhan, Allanyň huzurynda erkekleriň we aýallaryň ruhy deňligini öwredýär: şol bir iman, şol bir amal we şol bir sylag 'imanly erkeklere we imanly aýallara' wada berilýär.",
      "Aýallar we erkekler emläk hökmünde däl-de, imanda birek-biregi goraýjy we goragçy hökmünde häsiýetlendirilýär - dördünji süre, Nisa ('Aýallar'), esasan, hukuklaryny, mertebesini, mirasyny we bejergisini goramak üçin özüni bagyşlaýar.",
      "Gurhan Isanyň ejesi Merýemi ähli imanlylar üçin görelde hökmünde saklaýar we enelere şeýle hormat goýýar welin, meşhur öwrediş jenneti olaryň aýaklarynda goýýar.",
      "Iki jyns hem bir gelip çykyşyndan gözbaş alýar - Nisa süresiniň ilkinji aýatyndan umumy adamzat we mertebe döredýär.",
    ],
    quran: [
      {
        excerpt: "Seni bir ruhdan ýaradan we ondan ýoldaş eden Rebbiňden gork ...",
      },
    ],
    actions: [
      "Häzirki wagtda durmuşyňyzda bir zenany - enäni, aýaly, uýany ýa-da gyzy - belli bir hukugy ýa-da hoşniýetliligi bilen hormatlaň.",
    ],
  },
  {
    title: "Çagalar",
    summary: "Ynam (amana) - tawid we hoşniýetlilik bilen ösdürilmeli.",
    lessons: [
      "Çagalar amana - Allanyň ynamydyr we Gurhan ene-atalary terbiýelemäge jogapkär edýär: 'Özüňizi we maşgalalaryňyzy otdan goraň' olara tawhid we gowy häsiýet öwretmek bilen başlaýar.",
      "Pygamberimiz, Gurhany öwretmegi we öwrenmegi iň oňat işleriň hataryna goşdy, şonuň üçin çagany azajyk okamaga ugrukdyrmak, sogaby ene-atasyna gaýdyp gelýän dowamly ýagşylyk berýär.",
      "Ene-atanyň paýhasynyň giňden ýaýran bölegi çagalara öz döwründe duşuşmagy - ilkinji ýyllarda olar bilen oýnamagy, soň bolsa öwretmegi we ýuwaşlyk bilen terbiýelemegi, soň ulalansoň dostlaşmagy maslahat berýär.",
      "Dogruçyl çagany terbiýelemek bu durmuşyň daşyndaky maýa goýumdyr: ene-atasy üçin doga edýän dogruçyl nesil ölümden soň uzak wagtlap peýdasyny dowam etdirýär.",
    ],
    quran: [
      {
        excerpt: "Eý iman edenler, özüňizi we maşgalalaryňyzy otdan goraň ...",
      },
    ],
    actions: [
      "Çaga sabyrlylyk we höwes bilen şu gün bir gysga aýat ýa-da ýekeje gowy usul öwrediň.",
      "Çagalaryňyza (ýa-da hossarlyk edýän çagalaryňyza) adalatly we Allaha söýgüli bolmagy üçin dua ediň.",
    ],
  },
];

export const QURAN_GUIDE_TAJWEED_TK: DeepPartial<QuranGuideTajweedLesson>[] = [
  {
    title: "Günortan Sakinah we Tanween",
    summary: "Sukun we tanween bilen ن üçin düzgünler - izhar, idgham, iqlab, ikhfa.",
    explanation: [
      "Günortan sakinah - sukun göterýän ن harpy (çekimli ses ýok); aralyk, sözüň soňundaky günortana meňzeýän goşa çekimli ses (an, in, un). Ikisi-de birmeňzeş indiki dört hatara eýerýärler.",
      "Izhar (aýdyň aýdylyşy): alty bokurdak harpynyň biri (ء ه ع ح غ خ) yzyndan ýetende, günortany burun garyşmazdan aç-açan aýdyň aýdyň.",
      "Idgham (birleşmek): 'yarmaloon' (ي ر م ل و ن) harplaryndan öň günortan indiki harp bilen birleşýär - ي ن م و üçin gunnah (burun sesi) we ل ر üçin ghunnah ýok.",
      "Yklab (öwrülişik): ب yzyndan gelensoň, günortan ghunnah bilen bilelikde gizlin meem sesine öwrülýär.",
      "Yhfa (gizlenýär): galan on bäş harpdan öň günortan ne doly aýdylýar, ne-de doly birleşdirilýär - dil indiki harp üçin taýynlyk görýän mahaly ýeňil burun ghunna bilen 'gizlenýär'.",
    ],
    practice:
      "Fatiha süresini ýuwaş-ýuwaşdan okaň we her gezek günortan sakina ýa-da aralykda duşanyňyzda dört düzgüniň haýsysynyň ulanylýandygyny we sebäbini aýdyň.",
  },
  {
    title: "Sakinah",
    summary: "Ihfaa shafawi, idgham shafawi we sukun bilen izhar shafawi.",
    explanation: [
      "Meem sakinah, sukun göterýän م harpy. Onda takmynan üç düzgün bar, hersine 'şafawi' (labial) diýilýär, sebäbi dodak dodaklary bilen öndürilýär we haýsy ulanylsa diňe aşakdaky harplara bagly.",
      "Idgham shafawi (labial birleşmek): bir meak sakinah başga bir meemiň yzyndan ýetende, ikisi ghunnah bilen tutulan bir stresli meme birleşýär.",
      "Ihfa şafawi (labial gizlenmek): ب yzyndan gelende, meem ýeňil gizlenýär - dodaklary ýakynlaşýar, ýöne doly basmaýar - ghunnah bilen bilelikde.",
      "Izhar shafawi (labial aýdyňlyk): beýleki harplardan öň, meem aýdyň aýdylýar. O we ف harplaryndan öň üns beriň, bu ýerde okuwçylaryň bulaşdyrmak üçin iň köp synanyşýan ýeri.",
    ],
    practice:
      "Juz Amanyň birnäçe gysga süresini okaň we her meem sakinany belläň, söz okamazdan ozal onuň düzgünine at beriň.",
  },
  {
    title: "Madd (Uzalma)",
    summary: "Sesleriň tebigy, ikinji we zerur uzalmagy.",
    explanation: [
      "Madd çekimli sesiň uzalmagyny aňladýar we üç sany harp harpynda - alif (ا), waw (و) we ya (ي) - öz sesini götermeýän we gysga sesine eýerenlerinde bolýar.",
      "Madd asli (tebigy madd), takmynan iki sebäbiň uzalmagy bolup, haýsydyr bir madd harpynyň yzyndan hiç hili sebäpsiz ýüze çykan ýerinde bar. Her bir okaýjy ony deň derejede saklaýar.",
      "Madd far'i (ikinji madd) aşakdaky hamza ýa-da sukun bilen ýüze çykýar we has uzyn saklanýar - köplenç dört ýa-da alty gezek. Takyk uzynlygy maddyň görnüşine we yzarlaýan okaýşyňyza baglydyr.",
      "Sözüň soňunda durmak sukun döredip biljekdigi sebäpli, däli hem uzaldyp biler - dowamlylygy çaklamagyň däl-de, ökde mugallymdan diňlemegiň ýene bir sebäbi.",
    ],
    practice:
      "Tanyş gysga süräni saýlaň we her tebigy maddada '1-2' we ikinji derejeli maddada '1-2-3-4' hasaplaň, wagtyňyzy deň saklaň.",
  },
  {
    title: "Ghunnah",
    summary: "Idgham we ikhfa-da günortan we meem bilen bilelikde burun sesi.",
    explanation: [
      "Ghunnah, burun arkaly öndürilýän burun rezonansy, günortan (ن) we meem (م) harplarynyň mahsus hili. Adaty okaýyşda takmynan iki gezek geçirilýär.",
      "Bu, eýýäm duşan birnäçe düzgünleriňizde talap edilýär we aýdylýar: Ghunnah, Ihfa, Iqlab bilen idgham we günortan ýa-da meem şadda göterýän mahaly.",
      "Ses tekiz we gözegçilikde saklanmalydyr - bu aýdym ýa-da saz çalmak däl-de, dogry uzynlyga ölçenen burun äheňi.",
      "Simpleönekeý synag: Ghunna harpyny çykaranyňyzda burnuňyzy ýeňil gysyň; ses petiklenen bolsa, rezonans hakykatdanam burnundan gerekli derejede gelýär.",
    ],
    practice:
      "Günortan ýa-da meemde şadda bilen bir söz okaň, ghunany yzygiderli iki gezek saklaň, soňra özüňizi ýazyň we ökde okaýjy bilen deňeşdiriň.",
  },
  {
    title: "Qalqalah",
    summary: "Sakin ýa-da olaryň üstünde duranyňyzda ق ط ب ج د-de bökmek.",
    explanation: [
      "Qalqalah, bäş harpda berlen sähelçe ýaňlanýar - قُطْبُ جَدٍ, ýagny ق ط ب ج د - haçan-da bir sukun göterenlerinde.",
      "Dynç alyş artikulýasiýa nokadynyň ýeňil titremesi; harpdan soň doly çekimli ses goşmaly däl, diňe arassa 'gaýta' goýmaly.",
      "Harp sözüň ortasynda sukun bolanda has ýeňil (sughra), sözüň soňunda şol harpy saklanyňyzda has güýçli we düşnükli (kubra) bolýar.",
      "Dynçlylygy bitarap saklaň - ony 'a', 'i' ýa-da 'u' sesine öwürmäň; daş-töweregindäki çekimli seslere garamazdan şol bir gysga ses.",
    ],
    practice:
      "Yhlas süresini okaň we her bir kalkal harpynda - “ahad” we “ýulad” harplarynda duruň - arassa yza gaýdyp geliň.",
  },
  {
    title: "Waqf (Durmak)",
    summary: "Nirede durmaly, dem almaly we nädip durmagy aýdylyşy üýtgedýär.",
    explanation: [
      "Waqf nirede we nädip dynmalydygynyň sungatydyr. Muşaf duralga nokatlaryny kiçi nyşanlar bilen belleýär - mysal üçin zerur duralga üçin م, rugsat berlen duralgalar üçin ط we ج, we la manysy bu ýerde durmaň - okyja ýol görkezmek üçin.",
      "Durmak, adatça soňky harpy sukuna öwürip, soňky çekimli sesini dymdyrýar. Soňra bu üýtgeşiklik, qalkala ýa-da uzaldylan madd ýaly beýleki düzgünleri döredip biler, şonuň üçin sözüň üstünde duranyňyzda dowam edeniňizden tapawutly bolup biler.",
      "Arakesmede manysyna täsir edip biler, şonuň üçin orta sözlemi ýoýýan görnüşde bozmaň. Specialörite ýagdaý, üç nokat bilen bellenen mu'anaqa (gujaklaýan) waqf, bu ýerde iki nokadyň birinde durup bilersiňiz, ýöne ikisem däl.",
      "Dogry duralgalary öwrenmegiň iň ygtybarly usuly, ökde okaýjynyň ýanynda waqf belliklerini görkezýän muşafdyr, şonuň üçin arakesmeleriňiz okalýan okama laýyk gelýär.",
    ],
    practice:
      "Waqf bellikleri bolan bir sahypany alyň we tajweed mugallymynyň ýazgylaryndan soň sesleri okaň, nyşanlaryň görkezýän ýerini saklaň.",
  },
];

export const QURAN_GUIDE_VOCABULARY_TK: DeepPartial<QuranGuideVocabEntry>[] = [
  {
    meaning: "Trueeke-täk hakyky Hudaý - ähli owadan atlary öz içine alýan dogry at.",
    frequency: "2700+ hadysa",
    example: "Bismillah - Allanyň ady bilen",
    quranRef: {
      excerpt: "Rehimdar, esasanam rehimdar Allanyň ady bilen.",
    },
  },
  {
    meaning: "Lord, Ussat, Sustainer - döredýän, eýeçilik edýän, terbiýeleýän we dolandyrýan adam.",
    frequency: "Veryygy-ýygydan",
    example: "Rabbana - Rebbimiz",
    quranRef: {
      excerpt: "Hemme öwgi älemleriň Rebbi Allaha şükürdir.",
    },
  },
  {
    meaning: "Alladan we ýaradylyşdan rehimdarlyk, rehimdarlyk, mähir.",
    frequency: "Umumy kök ر-ح-م",
    example: "Ar-Rahman, Ar-Rahim",
  },
  {
    meaning: "Bag, Jennet - sylagyň baky mekany.",
    frequency: "Quygy-ýygydan",
    example: "Derýalaryň akýan baglary",
  },
  {
    meaning: "Ot - Jahannam duýduryş we netijäni aňladýar.",
    frequency: "Quygy-ýygydan",
    example: "Kapyrlar üçin taýýarlanan otdan gorkuň",
  },
  {
    meaning: "Iman, ynanç, Allaha bil baglamak we habaryny kabul etmek.",
    frequency: "Veryygy-ýygydan",
    example: "Eý iman edenler (ya ayyuha alladhina amanu)",
  },
  {
    meaning: "Allanyň razylygy üçin sabyr, çydamlylyk, çydamlylyk.",
    frequency: "Quygy-ýygydan",
    example: "Hakykatdanam Allah sabyrlydyr",
  },
  {
    meaning: "Minnetdarlyk - ýürek, dil we eller bilen bereketleri ykrar etmek.",
    frequency: "Quygy-ýygydan",
    example: "Şükür edýän bolsaňyz, hökman köpelderin",
  },
  {
    meaning: "Taňry düşünjesi, takwa bolmak, Alladan gorkmak bilen özüni günäden goramak.",
    frequency: "Veryygy-ýygydan",
    example: "Allanyň huzurynda iň asyllylaryňyz iň dogruçyllardyr",
  },
  {
    meaning: "Iýmit, ryzk - Allanyň her bir adam üçin emr eden zady.",
    frequency: "Quygy-ýygydan",
    example: "Allatagala iň gowusydyr",
  },
  {
    meaning: "Lightagtylyk - ýol görkezmek, ylham bermek we ýüregiň yşyklandyrylmagy.",
    frequency: "Quygy-ýygydan",
    example: "Allah asmanlaryň we ýeriň nurydyr",
    quranRef: {
      excerpt: "Allah asmanlaryň we ýeriň nurydyr…",
    },
  },
  {
    meaning:
      "Bu dünýä durmuşy - sözme-söz 'aşaky / ýakyn' durmuş. Gurhanda wagtlaýyn we synag, dowamly akiradan tapawutlylykda we imanlylaryň hakyky öýi däl.",
    frequency: "Quygy-ýygydan",
    example: "Bu dünýäniň durmuşy (al-hayat ad-dunya) diňe güýmenje we üýtgeşiklik",
  },
  {
    meaning:
      "Ahyret - ölümden soňky ebedi ýaşaýyş, direliş, höküm, Jennet we dowzah. Gurhan imanlylary işlemäge çagyrýan hakyky we dowamly durmuşdyr.",
    frequency: "Quygy-ýygydan",
    example: "Ahyret (al-akhira) has gowudyr we dowamlydyr",
  },
  {
    meaning:
      "Yslamyň ikinji sütüni bolan däp-dessur her gün bäş gezek okalýardy. Bu söz, Allaha baglanyşyk we ýalbarmak manysyny hem berýär.",
    frequency: "Veryygy-ýygydan",
    example: ".Atlamagym üçin namaz okaň",
  },
  {
    meaning:
      "Kitap ýa-da ureazgy - köplenç Gurhanyň özi ('bu kitap'), ýöne ozal aýan edilen ýazgylar we amallar ýazgysy. K-t-b kökünde, ýazmak üçin.",
    frequency: "Veryygy-ýygydan",
    example: "Bu, şübhesiz Kitapdyr (dhalika al-kitab)",
  },
];

export const QURAN_GUIDE_LETTERS_TK: DeepPartial<QuranGuideLetter>[] = [
  {
    name: "Alif",
    pronunciation: "Uzyn / a / 'kakada' bolşy ýaly (hamza ýa-da madd göterilende)",
  },
  {
    name: "Ba",
    pronunciation: "Iňlis 'b' ýaly",
  },
  {
    name: "Ta",
    pronunciation: "Iňlis dili ýaly",
  },
  {
    name: "Tha",
    pronunciation: "'Pikir etmek' ýaly",
  },
  {
    name: "Jim",
    pronunciation: "“Jam” daky “j” ýaly",
  },
  {
    name: "Ha",
    pronunciation: "Bokurdakdan ýiti dem alýar - iňlisçe 'h' däl",
  },
  {
    name: "Kha",
    pronunciation: "Şotlandiýanyň “loch” ýaly - bokurdakdaky sürtülme",
  },
  {
    name: "Dal",
    pronunciation: "Iňlis dili ýaly",
  },
  {
    name: "Dhal",
    pronunciation: "“Bu” -da “th” ýaly",
  },
  {
    name: "Ra",
    pronunciation: "Aýlanan / trillenen 'r'",
  },
  {
    name: "Zaý",
    pronunciation: "Iňlis 'z' ýaly",
  },
  {
    name: "Günä",
    pronunciation: "Iňlis dilleri ýaly",
  },
  {
    name: "Şin",
    pronunciation: "“Gämide” “ş” ýaly",
  },
  {
    name: "Gynandyryjy",
    pronunciation: "Ajaýyp “s” - dil ýokarlandyrylan, has doly ses",
  },
  {
    name: "Kaka",
    pronunciation: "Ajaýyp “d” - arapça mahsus",
  },
  {
    name: "Ta (ähmiýetli)",
    pronunciation: "Güýçli 't' - agzyň çuňlugy",
  },
  {
    name: "Za (ähmiýetli)",
    pronunciation: "'Dh' sesiniň ähmiýetli wersiýasy",
  },
  {
    name: "Aýn",
    pronunciation:
      "Bokurdagyň ortasyndan sesli gysyş - iňlis diline deň däl; okaýja öýkünip öwreniň",
  },
  {
    name: "Ghayn",
    pronunciation: "Fransuzça 'r' ýa-da 'gh' gargling ýaly",
  },
  {
    name: "Fa",
    pronunciation: "Iňlis 'f' ýaly",
  },
  {
    name: "Kaf",
    pronunciation: "Diliň arkasyndan çuň 'k' - iňlisçe 'k' däl",
  },
  {
    name: "Kaf",
    pronunciation: "Iňlis 'k' ýaly (agzynda öňe)",
  },
  {
    name: "Lam",
    pronunciation: "Iňlis 'l' ýaly",
  },
  {
    name: "Mim",
    pronunciation: "Iňlis 'm' ýaly",
  },
  {
    name: "Nun",
    pronunciation: "Iňlis 'n' ýaly",
  },
  {
    name: "Ha (ýagtylyk)",
    pronunciation: "Sözleriň ahyrynda ýumşak 'h'",
  },
  {
    name: "Waw",
    pronunciation: "'W' ýa-da uzyn 'oo' ýaly",
  },
  {
    name: ".A",
    pronunciation: "'Y' ýa-da uzyn 'ee' ýaly",
  },
];

export const QURAN_GUIDE_PRONUNCIATION_TK: DeepPartial<QuranGuidePronunciationPair>[] = [
  {
    title: "Aýn vs Ha",
    tip: "Ikisem bokurdakdan gelýär, ýöne ses taýdan tapawutlanýar. Aýn (ع) bokurdagyň ortasyndan sesli gysyş - ses şnurlary titreýär. Ha (ح) yrgyldysyz agyr dem ýaly güýçli, sessiz dem alýan sürtülme. Iňlis dilinde-de ýok, şonuň üçin olary bir okaýjydan gulak bilen öwreniň.",
  },
  {
    title: "Ha vs Kha",
    tip: "Ha has ýiti we ýeňil; Kha has sürtülme bilen has çuň - “loch” ýaly.",
  },
  {
    title: "Günä vs Sad",
    tip: "Günä (س) iňlis dilinde “görmek” ýaly ýeňil, inçe. Gynandyryjy (ص) onuň agyr, täsirli ekizidir: diliň arka tarapyny galdyryň, agzyňyzy birneme tegelekläň we ses çuňlaşýar. Olary garyşdyrmak, sözleri okamak bilen sabr (sabyr) üýtgedip biler.",
  },
  {
    title: "Dal vs Kaka",
    tip: "Dal (د) ýönekeý 'd'. Kaka (ض) arap diline mahsus agyr, manyly 'd' - diliň gyrasyny ýokarky mollara basyň we sesiň agzyny doldurmagyna ýol beriň. Bu tapawutly harp sebäpli arapça hatda 'kakanyň dili' lakamy hem berilýär.",
  },
  {
    title: "Ta vs Ta (ähmiýetli)",
    tip: "Emphatic deeper has çuň; diňe iňlis dilini 't' bilen çalyşmaň.",
  },
  {
    title: "Dhal vs Za (ähmiýetli)",
    tip: "Bularyň ikisine-de sesler degişlidir; Hea has agyr we ähmiýetlidir.",
  },
  {
    tip: "Kaf (ك) iňlisçe 'açar' ýaly öňe gidýän 'k'. Kaf (ق) has yza çekilýär - diliň arka tarapy uvula degýär we çuňňur, guttural 'k' berýär, iňlis diline deň däl. Olary aýratyn saklaň: qalb (ýürek) kalb (it) däl.",
    title: "Kaf vs Kaf",
  },
  {
    title: "Ghayn vs Kha",
    tip: "Gaýnyň sesi bar; Kha sessiz sürtülme.",
  },
];

export const QURAN_GUIDE_MEMORIZATION_PLANS_TK: DeepPartial<QuranGuideMemorizationPlan>[] = [
  {
    title: "Başlangyjy - Juz Amma",
    summary:
      "Hemmeler üçin tebigy başlangyç nokady. Mus'hafyň soňundaky gaty gysga sürelerden başlaň - Nasdan yza gaýdyp işlemek - her dogada aňsat, çalt peýdaly we peýdaly.",
    surahs: ["An-Nas", "Al-Falak", "Al-Ihlas", "Al-Masad", "An-Nasr", "Al-Kafirun", "Al-Kawthar"],
    tip: "Günde diňe bir aýaty ýatda saklaň: murattal okaýjynyň ony takmynan on gezek gaýtalamagyny diňläň, akýança sesli ýaňlaň, dowam etmezden ozal saklaýan zadyňyza goşuň.",
  },
  {
    title: "Aralyk - on esasy süre",
    summary:
      "Gysga süreler berk bolansoň, ajaýyp ahlakly we has gowy görülýän has uzyn baplary alyň we köplenç anna we gije okalýar - al-Mulk, -a-Sin, ar-Rahman, al-Wakiýa we al-Kahf.",
    surahs: [
      "Al-Fatiha",
      "Al-Mulk",
      "Ya-Sin",
      "Ar-Rahman",
      "Al-Wakiýa",
      "Al-Kahf",
      "Al-Jumu'ah",
      "Al-Haşr",
    ],
    tip: "Belli bir gündelik ýeri täze ýatda saklaň - Fajrdan soň asuda, düşnükli wagt ideal - şonuň üçin yzygiderlilik agyr göterýär.",
  },
  {
    title: "Ösen - Bir juz",
    summary:
      "Everythinghli zady gaty berk saklamazdan doly juzy tamamlamagy wada beriň. Köpüsi, eýýäm bölekleýin bilýän süreleri 29 ýa-da 30-njy Juzdan başlaýar, soň bolsa bir gezek juzy giňeldýär.",
    surahs: ["Juz saýlaň - köpüsi Juz 29 ýa-da 30-dan başlaýar, soňam giňelýär"],
    tip: "Köne berk täzeden seredilýänçä hiç wagt täze bölek goşmaň. Pygamber alaýhyssalam, ýat tutan Gurhanyň birleşdirilen düýäniň döwülmeginden has çalt süýşýändigini duýdurdy.",
  },
  {
    title: "Hafiz syýahaty",
    summary:
      "Gurhany tutuş ýatlamak - göterýän adamy we Allanyň merhemeti bilen ene-atalaryny beýgeldýän ömürlik hormat. Bu, adatça, birnäçe ýyllap gündelik täze ýat tutmagy we tertipli täzeden gözden geçirmegi öz içine alýar.",
    surahs: ["Tutuş muşaf - adatça gündelik wersiýa bilen 3-7 ýyl"],
    tip: "Diňe synap görmäň: wersiýa tertibiňizi dolandyrmak üçin Munibiň hifz yzarlaýjysyny ulanyň we ýalňyşlaryňyzy tutup we düzedip biljek ökde hafiz ýa-da mugallyma yzygiderli okaň.",
  },
];

export const QURAN_GUIDE_DAILY_LESSONS_TK: DeepPartial<QuranGuideDailyLesson>[] = [
  {
    translation:
      "Eý iman edenler, sabyr we doga bilen kömek soraň. Hakykatdanam, Allah sabyrlydyr.",
    context:
      "Madinada inen Bakara süresinden. Allah kynçylyklara duçar bolan imanly üçin iki güýç çeşmesini jübütleýär - sabyrly çydamlylyk we doga-dileg etmek - berk tutýanlara aýratyn ýoldaşlyk wada berýär.",
    reflection:
      "Bu aýatyň görkezýän sabyrlylygynyň we dogasynyň ýerine çalt gaçmak isleýän ýerimde häzir haýsy synag bilen ýüzbe-ýüz bolýaryn?",
    action:
      "Şu gün gyssagly bir namaz okaň we sujudyňyzda başdan geçirýän synagyňyzda Alladan sabyr soraň.",
  },
  {
    translation: "Rehimim hemme zady öz içine alýar.",
    context:
      "Musanyň we onuň halkynyň kontekstinde aýdylýan Araf süresinden. Allatagala öz rehim-şepagatyny hemme zady öz içine alýar diýip häsiýetlendirýär - rehimdarlyk, ýalňyşlyklaryny dowam etdirýänler üçin berlen jezadan öň we ondan ýokarydyr.",
    reflection: "Özümiňem Allanyň çäksiz rehimine bagly bolsamam, kimiň ýalňyşyny bagyşlaýaryn?",
    action:
      "Göwnüňize degýän bir adamy saýlaň, şu gün ýüregiňizde tüýs ýürekden bagyşlaň we Alladan hem ýol görkezmegini we bagyşlamagyny haýyş edip gysga dua ediň.",
  },
  {
    translation: "Şükür edýän bolsaňyz, hökman köpelderin.",
    context:
      "Ybraýym süresinden, Musanyň ýatlamasynyň bir bölegi Bani Ysraýyla. Allatagala artmagyny gönüden-göni minnetdarlyk bilen baglanyşdyrýar - bereket üçin şükür, ösmegine sebäp bolýan zat, minnetdarlyk bolsa ýitgini çagyrýar.",
    reflection:
      "Allanyň haýsy sowgatlary - saglygym, maşgalam, imanym ýa-da üpjünçiligim - şu hepde adaty we maňa bergili bolup başladymmy?",
    action:
      "Şu gije ýatmazdan ozal üç sany bereket üçin sesli 'Alhamdulillah' diýiň, hersine at dakyň, şonuň üçin minnetdarlyk awtomatiki däl-de, aňly bolýar.",
  },
  {
    translation: "Adamlara gowy sözler aýdyň.",
    context:
      "Ysraýyl süresinden Imanlylaryň özlerini nähili alyp barmalydygy barada görkezmeleriň arasynda Allatagala adamlara - ähli adamlar bilen iň oňat gürleşmegimizi buýurýar, sebäbi gödek sözler Şeýtanyň bölünişik açýan gapylaryndan biridir.",
    reflection:
      "Şu güne ser salanymda, sözlerim köplenç adamlary döredýärmi ýa-da olary kowdy - hatda kyn görýänlere-de 'gowy sözler' aýtdymmy?",
    action:
      "Gizlin tankytlar bilen şu gün bir adama tüýs ýürekden höweslendiriň ýa-da minnetdarlyk bildiriň we aýtjak bolýan bir gödek sözüňizi saklaň.",
  },
  {
    translation: "Kim Allaha bil baglasa, Oňa ýeterlikdir.",
    context:
      "Talak süresinden, aýrylyşmak we üpjün etmek baradaky kararlaryň arasynda - adamlaryň maddy taýdan has aladalanýan ýeri. Şol ýerde Allatagala kimden gorksa, garaşylmadyk ýerinden üpjün etjekdigini we Oňa bil baglaýan adamyň ýeterlik tapjakdygyny wada berýär.",
    reflection:
      "Nirede seresaply meýilnamalar düzýärin, ýöne Allany olardan daşlaşdyrýaryn - ýa-da hiç wagt du'ada Oňa ýüz tutman adamlaryň kömegine bil baglaýaryn?",
    action:
      "Sizi biynjalyk edýän bir karara geliň, iki rekagat namaz okaň ýa-da tüýs ýürekden doga ediň, soň bolsa Allaha ynanyň.",
  },
  {
    translation: "Lorda Reb, meni bilimde artdyr.",
    context:
      "Ta-Ha süresinden. Bu, Gurhanda Allahyň Pygambere more has köp bilim soramagyny tabşyrýan ýeke-täk zat, bu bilimiň näderejede peýdalydygyny we hiç kimiň öwrenip gutarandygyny görkezýär.",
    reflection:
      "Bu gün boş wagtymyň näçesi tükeniksiz aýlanmaga gitdi, hatda onuň bir bölegi ýerine bir aýat ýa-da bir hadys öwrenmäge gidip bilermi?",
    action:
      "'Mugallym zidni ilma' atly bu gysga duany ýatda saklaň we günüňizi başlamazdan öň Fajrdan soň aýtmagy endik ediniň.",
  },
  {
    translation:
      "Baýlygyny Allanyň ýoluna sarp edenleriň mysaly, ýedi tüýdük ösdürip ýetişdirýän tohum ýalydyr…",
    context:
      "Bakara süresinden. Allatagala haýyr-sahawatyň nähili ösýändigini aç-açan suratlandyrýar: ýedi gulakdan çykýan bir tohum, hersi ýüz däne göterýär - ýedi ýüz esse gaýdyp gelýär we islänine has köp köpelýär. Onuň hatyrasyna berlen baýlyk asla ýitmez.",
    reflection:
      "Berenimde, Allanyň razylygy üçin ýuwaşlyk bilen edilýärmi ýa-da beýlekileriň meni duýmagyny we öwmegini isleýänimi görýärinmi?",
    action:
      "Şu gün kiçijik sadaka beriň, mümkin bolsa gizlin beriň - bu diňe siziň bilen Allanyň arasynda.",
  },
];

export const QURAN_GUIDE_APPLY_CHALLENGES_TK: DeepPartial<QuranGuideApplyChallenge>[] = [
  {
    verseExcerpt: "Adamlara gowy sözler aýdyň.",
    challenge:
      "Günüň dowamynda ýekeje gödek, gödek ýa-da masgaralaýjy söz bolmazdan gidiň - hatda gaharly hem bolsaňyz.",
    habit: "Bizar bolanyňyzda, jogap bermezden ozal duruň we dymmagy ýa-da hoşniýetli söz saýlaň.",
  },
  {
    verseExcerpt: "Imanly erkeklere gözlerini aşaklatmagy aýdyň ...",
    challenge:
      "Gözüňizi Allanyň şu gün gadagan eden zatlaryndan - ekranyňyzda, iýmitiňizde we köpçüligiň öňünde bilgeşleýin peseldiň.",
    habit: "Her gezek özüňizi tutanyňyzda, şol pursaty ýerine bäş minut Gurhana gönükdiriň.",
  },
  {
    verseExcerpt: "Olara 'uff' diýmäň ...",
    challenge:
      "Şu gün ene-atanyň ýa-da ýaşulynyň göze görünýän ýumşaklygy we sabyrlylygy bilen gürleş, hiç hili gahar-gazap yzyny görkezme - we olara hyzmat etmek üçin bir zat et.",
    habit: "Diri bolsa, yzygiderli jaň ediň ýa-da baryp görüň; ýok bolsa, olar üçin du'a ediň.",
  },
  {
    verseExcerpt: "Hakykatçylar bilen bile boluň.",
    challenge:
      "Günüň dowamynda ak ýalan sözlemezden, ulaltmazdan we gybat etmezden hakykaty aýdyň - hatda degişmelerde-de.",
    habit: "Süýnseňiz, birbada toba ediň we sözleriňize täsir eden zady düzediň.",
  },
  {
    verseExcerpt: "Allah sabyrlydyr.",
    challenge:
      "Indiki gezek bir zat sizi biynjalyk edeninde, jogap bermezden ozal her bir gödek sözi doly altmyş sekunt saklaň.",
    habit: "Gaharlanma pursatlaryny mümkin boldugyça dikr ýa-da iki rekagat namaza öwüriň.",
  },
  {
    verseExcerpt: "Şükür edýän bolsaňyz, sizi köpelderin.",
    challenge: "Üç sany adama şu gün siziň üçin eden aýratyn bir işi üçin sag bolsun aýdyň.",
    habit: "Munib journalurnalyňyzda bir berekedi belläp, her gije tamamlaň.",
  },
  {
    verseExcerpt: "Kim bagyşlasa we ýaraşsa - sylagy Allaha degişlidir.",
    challenge:
      "Göçüren bir gahar-gazabyňyzy goýuň - tüýs ýürekden boşadyň, iň bolmanda öz ýüregiňizde.",
    habit: "Zyýanlary gaýtalamagyň ýerine saňa zulum eden adam üçin rahat dua et.",
  },
];

export const QURAN_GUIDE_TADABBUR_PROMPTS_TK: DeepPartial<QuranGuideTadabburPrompt>[] = [
  {
    question: "Bu aýatda Allah maňa näme öwredýär?",
    hint: "Aýaty ýuwaş-ýuwaşdan okaň we onuň gurluş böleklerine üns beriň: Allah buýruk, duýduryş, wada berýärmi ýa-da hekaýa aýdýarmy? Atlarynyň haýsysyny ulanýar we bu at bu ýerde biziň bilen nähili işleşýändigini görkezýär?",
  },
  {
    question: "Muny şu gün bir anyk hereketde nädip ulanyp bilerin?",
    hint: "Düşnüksiz kararlar azalýar; aýratynlary ýapyşýarlar. Aýaty ýekeje ýerine ýetirip boljak ädime öwüriň - bir söhbetdeşlik, başlamak endigi, gün gutarmanka bir karar bermek.",
  },
  {
    question: "Bu aýat sebäpli haýsy endigi ösdürmeli ýa-da aýyrmaly?",
    hint: "Aýaty gündelik işiňize - ukyňyza, sözüňize, çykdajylaryňyza, doganyňyza we gatnaşyklaryňyza getiriň. Bu aýat haýsysyna ýuwaşlyk bilen barmak goýýar?",
  },
  {
    question:
      "Bu aýat meni Allanyň rahmetine ýa-da adalatyndan gorkmaga iterýärmi we näme üçin ikisiniňem ähmiýeti bar?",
    hint: "Mömin iki ganat ýaly kawf (Allanyň jezasyndan gorkmak) bilen raja (merhemetine umyt) arasynda gezýär. Bu aýatyň haýsysynyň içiňizde güýçlenýändigini we ýüregiňiziň oňa has köp mätäçdigini soraň.",
  },
  {
    question: "Pygamberimiz bu aýaty nädip ýaşady?",
    hint: "Pygamber alaýhyssalam 'ýörän Gurhan' hökmünde suratlandyryldy. Hakyky seera we tafsire göz aýlaň - Ibn Katir köplenç bir aýaty nädip şekillendirendigini mysal getirýär we amaly nusga hökmünde görelde alyň.",
  },
  {
    question: "Bu aýat haýsy du'a ylham berýär?",
    hint: "Goý, aýat doga bolsun. Sujud wagtynda öz sözleriňiz bilen Alladan soraň, aýatyň nämä sebäp bolandygyny - duýduryşdan goramak, wada paýlaşmak ýa-da buýruga boýun bolmaga kömek etmek.",
  },
];

export const QURAN_GUIDE_READING_LEVELS_TK: DeepPartial<QuranGuideReadingLevel>[] = [
  {
    title: "Arap elipbiýi",
    summary:
      "28 harpyň hemmesini aýratyn görnüşde tanamagy we hersiniň adyny bilmegi öwreniň. Bu arassa tanyşlyk - bir harpy görmek we sesine derrew at dakmak - we beýleki zatlaryň gurýan binýady.",
    topics: ["Harp atlary", "Esasy şekiller", "Sagdan çepe"],
  },
  {
    title: "Harp şekilleri",
    summary:
      "Harplaryň köpüsiniň ýagdaýyna - sözüň başyna, ortasyna ýa-da soňuna baglylykda görnüşini üýtgedýändigine göz ýetiriň - sebäbi arap dili ýaly birleşdirilýär. Haýsy harplaryň yzyndaky harp bilen baglanyşmaýandygyny öwreniň.",
    topics: ["Baglanan ýazgy", "Birikmeýän harplar", "Alif, waw, ya görnüşleri"],
  },
  {
    title: "Harakat (çekimli sesler)",
    summary:
      "Her harpy çekimli ses berýän kiçijik bellikleri özleşdiriň: fatha (a), kasra (i), damma (u), az sesli sukun, iki esse şadda we aralyk aralygy. Bu bellikler sessiz harplary okalýan sözlere öwürýär.",
    topics: ["Gysga çekimli sesler", "Sukun", "Şadda iki esse köpelýär", "Tanween"],
  },
  {
    title: "Harplara goşulmak",
    summary:
      "Bir ýere jemläň: harplary we harakatlaryny bogunlara we gysga sözlere garyşdyryň, sagdan çepe okaň. Sözüň başynda “al” sözüniň nähili aýdylýandygyny kesgitleýän gün we aý harp düzgünine laýyk geliň.",
    topics: ["CV nagyşlary", "Umumy prefiksler", "Gün we aý harplary"],
  },
  {
    title: "Söz okamak",
    summary:
      "Hakyky Gurhanyň söz düzümini haýal we dogry çözmäge başlaň - Bismillahdan we her dogada okaýan al-Fatihanyň sözlerinden başlap, okamak ilkibaşdan ybadat bilen baglanyşar.",
    topics: ["Frequokary ýygylykly sözler", "Bismillah", "Al-Fatiha sözleri"],
  },
  {
    title: "Aýatlary okamak",
    summary:
      "Juzz Ammadan gysga doly aýatlara geçiň, esasy tajweed we dem almak üçin nirede durmalydygyňyzy (waf) elmydama okaýjynyň ýanynda okaň, şonuň üçin gulagyňyz diliňizi ugrukdyrar.",
    topics: ["Juz Amma süreleri", "Waqf bellikleri", "Bir okaýjynyň yzyna düşmek"],
  },
  {
    title: "Arkaýyn okamak",
    summary:
      "Tebigy ulanylýan tajweed düzgünleri bilen rahat, ynamly okama. Gündelik bölegi dowam etdiriň we mugallymy ýa-da ökde hünärli okyjyny barlamagy dowam etdiriň, sebäbi yzygiderli düzediş arkaly arassalanýar, bir gezek gazanylmaýar.",
    topics: ["Gündelik bölüm", "Tajweed düzgünleri ulanylýar", "Mugallymyň pikirleri"],
  },
];

export const QURAN_GUIDE_QUIZ_TK: DeepPartial<QuranGuideQuizQuestion>[] = [
  {
    prompt: "Gurhanda näçe süre (bap) bar?",
    options: ["99", "114", "124", "144"],
    explanation:
      "Gurhanyň üç aýatdan 286-a çenli 114 süresi bar. Olaryň mushafdaky tertibi wahý (tawqifi) bilen kesgitlenildi.",
  },
  {
    prompt: "Gurhan gündelik okamak üçin näçe deň bölege bölünýär?",
    options: ["7", "12", "30", "60"],
    explanation:
      "Otuz juz. Günde bir juz okamak, Gurhany bir aýda tamamlaýar - Remezan aýynda haty gutarmagyň nusgawy usuly.",
  },
  {
    prompt: "286 aýat bilen Gurhanda iň uzyn süre haýsy?",
    options: ["Al-Fatihah", "Al-Bakara", "Ya-Sin", "An-Nas"],
    explanation:
      "Bakara süresi 286 aýat bilen iň uzyn. Kanuna we ýol görkezmesine baý Madani süresi.",
  },
  {
    prompt: "Hakyky ýa-da ýalan: Makki süresi, hijretden öň Medinä aýatdyr.",
    options: ["Dogry", "Sealňyş"],
    explanation:
      "Makki süreleri hijretden ozal inipdir we köplenç ynanç we tawhide gönükdirilipdir; Madani süreleri soň gelip, köplenç kanun we jemgyýetiň görkezmesini goşýarlar.",
  },
  {
    prompt: "Haýsy sürede, Hira gowagynda Pygambere inen ilkinji aýatlar bar?",
    options: ["Al-Fatihah", "Al-Alak (Ykra)", "Al-Bakara", "Al-Ihlas"],
    explanation:
      "Ilkinji ylham, Alak süresiniň (96) aýatlarynyň açylyş aýatlary boldy: 'Ykra' - Createdaradan Rebbiň adyndan oka. '",
  },
  {
    prompt: "Takmynan näçe ýyl bäri Gurhan inderildi?",
    options: ["3 ýyl", "10 ýyl", "23 ýyl", "40 ýyl"],
    explanation:
      "Gurhan takmynan 23 ýylyň dowamynda ýuwaş-ýuwaşdan - Mekgede 13, Medinede 10 hadyslara we zerurlyklara jogap hökmünde aýan edildi.",
  },
  {
    prompt: "Dogry ýa-da ýalan: Gurhan Remezan aýynda, Laylat al-Kadrda wahý edip başlady.",
    options: ["Dogry", "Sealňyş"],
    explanation:
      "Allah Gurhanyň Remezan aýynda (2: 185) Karar gijesinde (97: 1) inendigini aýdýar. Şol gijäni gözlemek ajaýyp häsiýetdir.",
  },
  {
    prompt: "Gündelik namazyň her rekagatynda haýsy süre okalýar?",
    options: ["Al-Ihlas", "Al-Fatihah", "Al-Kawthar", "An-Nasr"],
    explanation:
      "Fatiha süresi - ýedi aýat, her bir namaz okalýar. 'Kitabyň açylyşyny okamaýan adam üçin doga ýok.'",
  },
  {
    prompt: "'Bismillah ir-Rahman ir-Raheem' bilen başlamaýan süre haýsy?",
    options: ["Al-Fatihah", "Tawbah", "Al-Ihlas", "An-Nas"],
    explanation: "Tawba süresi (9), Basmala bilen açylmaýan ýeke-täk süredir.",
  },
  {
    prompt: "Tajweed-de Maddyň düzgüni näme bilen dolandyrylýar?",
    options: [
      "Iki harpy birleşdirmek",
      "Bir çekimli sesiň uzalmagy (uzalmagy)",
      "Käbir harplaryň ýaňlanmagy",
      "Nirede durmaly we dem almaly",
    ],
    explanation:
      "Madd, san sanlary üçin ald (ا), waw (و) we ya (ي) harplaryna çekimli sesiň uzalmagyny aňladýar.",
  },
  {
    prompt: "Qalqalah, sukun göterenlerinde haýsy harplar toplumyna berlen yşyk ýaňlanýar?",
    options: ["ي ر م ل و ن", "ق ط ب ج د", "ء ه ع ح غ خ", "ا و ي"],
    explanation:
      "Bäş sany qalkala harpy قُطْبُ جَدٍ - ق ط ب ج د - sukun göterenlerinde arassa garşylyk görkezilýär.",
  },
  {
    prompt: "Gurhanyň ýygy-ýygydan 'Rabb' (رَبّ) sözi:",
    options: ["Merhemet", "Lord, Ussat, Düzediji", "Kitap", "Bag"],
    explanation:
      "'Rabb', Reb, Ussat we Düzediji diýmekdir - döredýän, eýeçilik edýän, terbiýeleýän we dolandyrýan. 'Rabbana' 'Rebbimiz' diýmekdir.",
  },
  {
    prompt: "'Jannah' (جَنَّة) sözi:",
    options: ["Ot", "Jennet bagy", "Doga", "Oraza"],
    explanation: "'Jannah' bagy - baky sylag mekany, 'derýalaryň akýan baglary' diýmekdir.",
  },
  {
    prompt: "Haýsy pygamber ogly Ysmaýyl bilen bilelikde Mekgede Käbäniň düýbüni galdyrdy?",
    options: ["Nuh", "Musa", "Ybraýym", "Yusufusup"],
    explanation:
      "Ybraýym (Allanyň dosty Halilullah) we Ysmaýyl, 'Rebbimiz, muny bizden kabul et' diýip doga edip, Käbäni gurdular (2: 127).",
  },
  {
    prompt:
      "Haýsy pygamber gönüden-göni Allah bilen gürleşdi, fyrowna garşy çykdy we Bani Ysraýyly bölünen deňziň üstünden alyp bardy?",
    options: ["Işaýa", "Musa", "Adam", "Usunus"],
    explanation:
      "Musa (Kalimullah) Allah bilen gürleşdi, fyrowna iberildi we Allanyň emri bilen deňiz bölünip, halky sag-aman geçdi.",
  },
  {
    prompt: "Haýsy bir süre ýa-da gysga parçany soňundan düşünmek we ýatlamak üçin kesgitlärsiňiz?",
    explanation:
      "Kiçijik yzygiderli ädimler Allanyň kitaby bilen ömürboýy baglanyşyk gurýar. Bölümiňizi saýlaň, manysyny öwreniň we ýygy-ýygydan gözden geçiriň.",
  },
];
