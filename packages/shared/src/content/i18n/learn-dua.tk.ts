// Turkmen translation overlay for the Learn Dua content. Mirrors the order of
// its English source in ../learn-dua*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { LearnDuaOccasion, LearnDuaTopic } from "../../types/learn-dua";
import type { DeepPartial } from "./localize";

export const LEARN_DUA_TOPICS_TK: DeepPartial<LearnDuaTopic>[] = [
  {
    title: "Dua näme?",
    summary: "Dua ybadatdyr: pespällik we umyt bilen göni Allaha ýüzlenmek.",
    body: [
      'Dua (دعاء) Allaha ýüzlenýär - Ondan peýda, bagyşlanma, ýol görkeziji we gorag soraýar we mätäçlere ýüzlenýär. Pygamber alaýhyssalam, «Dua ybadatdyr» diýip yglan etdi, soň bolsa Allanyň: «Maňa jaň et! Men saňa jogap bererin "-diýdi. Alladan soramagyň özi arassa tawid amaldyr, sebäbi ähli netijeleri ýeke özi eşidýändigini, eýelik edýändigini we gözegçilik edýändigini boýun alýar.',
      "Bilelikde akýan iki görnüşli dua bar: du'a al-mas'alah, Alladan bir zat soramak we du'a al -ibadah, doga, dikr we boýun bolmak arkaly Oňa ybadat etmek - her bir ybadat, aslynda, kabul edilmegi we sylaglanmagy üçin sessiz haýyşdyr. Şonuň üçin duadan Alladan başga hiç kime gönükdirmek şirkiň bir görnüşidir: başga birine diňe özüne degişli zady berýär.",
      "Bir imanly, Allanyň her jaňy eşidýändigini we hiç haçan çyn ýürekden ýüz öwürmejekdigine ynamly we gizlinlikde dua edýär. Ol şeýle bir ýakyn welin, 'Men jaň edeniň jaňyna jogap bererin' diýýär.",
      "Jogap, Pygamberiň öwreden üç görnüşinden birini alýar: Allah soralan zady berýär; ýa-da ony saklaýar we ahyret üçin deň ýa-da uly sylag saklaýar. ýa-da oňa deň zyýany ret edýär. Şonuň üçin hiç bir çyn ýürekden jogapsyz jogap berilmeýär - käwagt iň uly rehim biziň görmeýän jogabymyzda bolýar.",
    ],
    quran: [{}, {}],
    hadith: [{}],
    appLinks: [{}],
  },
  {
    title: "Duanyň edepleri",
    summary: "Alkyş bilen başlaň, salawat iberiň, tüýs ýürekden soraň we hiç haçan ýüz öwürmäň.",
    body: [
      'Dua pygamberiň öwreden we nusga alýan edepleri (adab) bar we oňa syn etmek kabul etmegi has ähtimallaşdyrýar. Gözel atlary bilen Allany öwmekden başlaň, soňra Pygambere salawat (sallallahu aleýhi wesellem) iberiň - namaz okaýan adamyň ikisini-de ýerine ýetirýänçä duanyň "togtadylýandygyny" öwredýär we diňe haýyşyňyzy berýär.',
      "Üç sany içki häsiýeti bolan Allaha ýüz tutuň: kiçigöwünlilik, jogap berip biljekdigine ynam we Oňa gowy pikir (husn al-zann). Mümkin bolan ýeriňizde kybla ýüz tutuň, elleriňizi galdyryň, mübärek wagtlary saýlaň we bu durmuşyň we ahyretiň meselelerini soraň. Möhüm haýyşlary gaýtalamak we başlanyňyzda - öwgi we salawat bilen gutarmak maslahat berilýär.",
      "Iň esasy zat, howlukmaň. Pygamberimiz, bir adamyň umytsyz bolup, 'jaň etdim, jaň etdim, ýöne jogap bermedim' diýýänçä dua jogap beriljekdigini, soň bolsa terk etjekdigini duýdurdy. Soramakda tutanýerlilik ybadatdyr we Alla gapyny kakmagyny dowam etdirýän hyzmatkäri söýýär.",
    ],
    hadith: [{}, {}],
    actions: [
      "Alhamdulillah we Pygamberimize salawat bilen her duany açyň ﷺ.",
      "Alladan mätäçligiňize laýyk atlar bilen soraň (meselem, Ra Razzaq, bagyşlamak üçin Ga Gafur).",
      "Duany gündelik endige öwüriň - her dogadan soň, sujudda we uklamazdan ozal.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kabul edilen dua üçin şertler",
    summary: "Yhlas, kanuny gazanç we günäden ýüz öwürmek jogap gapylaryny açýar.",
    body: [
      "Edepden başga, käbir şertler duanyň kabul edilmegine güýçli täsir edýär. Iň esasy zat ikhlas - diňe Allaha yhlas, hiç hili görkezmezlik we ýanynda başgalary çagyrmazlyk. Duada hakykatdanam bar bolan ýürek, mehaniki okaýan dilden has gymmatlydyr.",
      "Kanuny rysgal güýçli açardyr. Pygamberimiz, ellerini asmana göterip, 'Lorda Reb, ýa Reb,' diýip aglaýan syýahatçyny suratlandyrdy, ýöne 'iýmit haram, içgisi haram, geýimleri haram we bikanunlar tarapyndan iýmitlenýär - oňa nädip jogap berip bolar?' Girdejisini goramak, günäden toba etmek, günäli bir zat soramazlyk ýa-da maşgala gatnaşyklarynyň kesilmegi, dua bilen kabul edilmegiň arasyndaky päsgelçilikleri aýyrýar.",
      "Şeýle-de bolsa, kabul etmek, gözegçilik edýän geleşigimiz däl-de, ahyrsoňy Allanyň rahmetidir. Şonuň üçin imanly iň güýçli güýjüni - yhlas, halal durmuş, toba - pespäl ynam bilen birleşdirýär we jogap gijikdirilse hiç haçan umytdan düşmeýär. Gowşaklyk we geçmişdäki günäler soramagy bes etmäge sebäp däl; iň rehimdarlyga gaýdyp gelmegiň has köp sebäbi bar.",
    ],
    hadith: [{}, {}],
    actions: [
      "Girdejiňizi we kanunylyk üçin çykdajylaryňyzy gözden geçiriň - bu duaňyza gönüden-göni täsir edýär.",
      "Istighfar we çyn ýürekden toba etmek bilen uzak dileg ediň.",
      "Zyýan, günä ýa-da adalatsyzlyk soramak üçin hiç haçan dua sözlemäň.",
    ],
  },
  {
    title: "Dua üçin iň gowy wagtlar we ýerler",
    summary: "Käbir pursatlar esasanam kabul edilen dileg üçin bereketlidir.",
    body: [
      "Islendik wagt dua jogap berilse-de, Pygamberimiz kabul edilmegiň iň köp garaşylýan pursatlaryny we pursatlaryny aýdyp berdi. Diňe krizise garaşman, haýyşlaryňyzy bulara berkidiň.",
      "Iň güýçlileriň arasynda: gijäniň soňky üçden bir bölegi, Allatagala (beýikligine laýyk görnüşde) iň pes asmana inip: 'Menden kim soraýar, men oňa bererin?'; Allaha iň ýakyn ýerdäki sejde; adhan bilen ikamanyň arasyndaky pursat; adam agyz bekleýän wagty, esasanam agyz bekleýän wagty; ýagyş wagtynda; we anna gününiň gün ýaşmazyndan öň iň soňky sagady, bu ýerde dua ret edilmeýän bir sagat bar.",
      "Bereketli ýerler we ştatlar Haj wagtynda Arafada durmagy, mukaddes uçastoklaryň içinde bolmagy, syýahatçy, çagasy üçin ene-atasy we birine zulum edenleri öz içine alýar. Bulary yzygiderli dileg etmek üçin berk labyr hökmünde ulanyň.",
    ],
    hadith: [{}, {}],
    appLinks: [{}, {}],
  },
  {
    title: "Irden we agşam adhkar",
    summary: "Gündelik 'Musulman galasy' - günüň iki ujunda gorag we baglanyşyk.",
    body: [
      "Ertir we agşam adhkar, Sünnetdäki gündelik ýatlamalaryň arasynda - imanly her günüň başynda we ahyrynda täzelenýän ruhy galadyr. Allah möminlere 'Allany köp ýatlamak we ertir we agşam şöhratlandyrmak' tabşyrýar (33: 41–42).",
      "Yzygiderli okalsa, zyýandan we Şeýtanyň pyşyrdylaryndan goraýarlar, Allaha (tawakkul) bil baglaýarlar we günüň üýtgeýän ýagdaýlarynda ýüregi özüne baglaýarlar. Iň möhümleriň ikisi aşakda; programmanyň adhkar ýygyndysy doly toplumy öz içine alýar.",
    ],
    phrases: [
      {
        title: "Saýyid al-Istighfar (bagyşlanmagy gözleýän başlyk)",
        when: "Her gün irden we agşam bir gezek",
      },
      {
        title: "Hasbiyallahu la ilaha illa Huwa",
        when: "Her gün irden we agşam ýedi gezek",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Oýanandan soň we uklamazdan ozal",
    summary: "Günüň ilkinji we soňky sözlerini Allah bilen baglanyşyk ediň.",
    body: [
      'Pygamber alaýhyssalam, oýanmak we ýatmak üçin aýratyn ýatlamalary öwretdi, şonuň üçin imanlylaryň her gün ilkinji düşünjeli sözleri minnetdarlyk we iň soňkusy boýun bolar. Onuň pikiriçe, uky "ownuk ölüm" we kiçijik direliş oýarmakdyr, şonuň üçin adhkar ähli aýlawy Alladan habardar edýär.',
      "Olary yzygiderli okamak ruhy durnuklylygy döredýär: ukudan oýanmak we kalbyňy Allaha tabşyrmak üçin minnetdarlyk. Pygamberimiz, esasanam, Aýat al-Kursini okamaga çagyrdy we Alladan bir hossaryň okaýjy bilen galjakdygyny we ertire çenli hiç bir şeýtanyň ýakynlaşmajakdygyny wada berdi.",
    ],
    phrases: [
      {
        title: "Dua oýanmak",
        when: "Derrew oýanandan soň",
      },
      {
        title: "Uklamazdan öň Dua",
        when: "Sleepatmak üçin ýatanyňyzda",
      },
      {
        title: "Aýat al-Kursi uklamazdan ozal",
        when: "Sleepingatmazdan ozal",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Öý we metjit dualary",
    summary: "Öýüňize we metjide gireniňizde we çykanyňyzda ýatlamalary dowam etdiriň.",
    body: [
      "Pygamberimiz life durmuşyň gündelik çäklerine gysga dilegler etdi. Öýden çykyp, içeri gireniňde Allanyň adyny ýatlamak gorag we bereket getirýär we Şeýtanyň gapysyny ýapýar; bir adam Allany ýatlamaga girende, Şeýtan ýoldaşlaryna: 'Bu ýerde gijäni geçirmäge ýeriňiz ýok' diýýär.",
      "Metjidiň öz edep-terbiýesi bar: sag aýak bilen rehimdarlyk derwezelerini soraň we çep tarapdan Allanyň nygmatlaryny soraň - bu metjidiň Allanyň öňünde rehim-şepagat, tertip-düzgün we kiçigöwünlidigini ýatladýar.",
    ],
    phrases: [
      {
        title: "Öýden çykanda Dua",
        when: "Jaýdan çykanda",
      },
      {
        title: "Dua metjide girýär",
        when: "Girip, sag aýak bilen ädim ätmek",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Iýmek we içmek üçin duas",
    summary: "Barakah we her nahara minnetdarlyk getirýän gysga adhkar.",
    body: [
      "Yslam adaty iýmitlenişini ýatlamak arkaly ybadatlara öwürýär. Berekedi çagyrýan we Şeýtany nahary paýlaşmakdan saklaýan 'Bismillah' bilen başlaň we Allaha şükür bilen gutaryň, ýüregi günde birnäçe gezek minnetdarlyk we pikirlenmek bilen öwrediň.",
      "Sünnet hatda ýatdan çykarmak üçin düzediş hem berýär: başda 'Bismillah' diýmegi ýatdan çykarsaňyz, 'Bismillahi awwalahu wa akhirahu' (Allanyň ady bilen, başynda we ahyrynda) diýseňiz.",
    ],
    phrases: [
      {
        title: "Nahardan öň",
        when: "Nahar başynda",
      },
      {
        title: "Nahardan soň",
        when: "Nahar gutarandan soň",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Taharet we doga töweregindäki duas",
    summary: "Taharetden öň we soň, doganyň içinde dilegler.",
    body: [
      "Taharet we namaz kabul edilen ýatlamalar üçin gündelik iň uly açyklykdyr, şonuň üçin sünnet olary dua bilen doldurýar. Tahareti imanyň şaýatlygy bilen tamamlamak Jennetiň sekiz derwezesini açýar; namazyň içinde - sujudda we jemagat namazynyň öň ýanynda - imanlylaryň gününde iň kabul edilen iki pursat.",
      "Bu pursatlar üçin hakyky sözlemleri öwrenmek, däp-dessur hereketlerini Allah bilen aňly söhbetdeşlige öwürýär.",
    ],
    phrases: [
      {
        title: "Taharetden soň",
        when: "Taharet gutarandan soň derrew",
      },
      {
        title: "Namazdan öň",
        when: "Namazy gutarmazdan ozal iň soňky daşhudda",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Adanda we ikamada dua",
    summary: "Çagyryşa jogap beriň, Alladan Pygamberimiziň ýerini soraň, soňra dileg ediň.",
    body: [
      "Adhan çagyrylanda, sünnet mu'adhdinden soň gaýtalanmalydyr, soň bolsa Pygamberimize salawat ibermeli, soň bolsa Alladan oňa Wasila bermegini haýyş edip du'a okamaly - Pygamberimiz, her kime şepagat etjekdigini wada berdi.",
      "Adhan bilen ikamanyň arasyndaky penjire, şahsy dileg üçin kabul edilen wagtlaryň biridir; Pygamberimiz then soň edilen duanyň yzyna öwrülmeýändigini aýtdy, şonuň üçin Alladan öz islegleriňizi soraň.",
    ],
    phrases: [
      {
        title: "Adandan soň dua",
        when: "Adhan gutaranda",
      },
    ],
    hadith: [{}],
    appLinks: [{}, {}],
  },
  {
    title: "Alada we gynanç",
    summary: "Tawakkul we Pygamberiň dilegleri bilen ýüregi dakyň.",
    body: [
      "Yslam amaly ruhy gurallar bilen kynçylyklara duçar bolýar: dua, zikr, doga we Allanyň emrine ynanmak. Gaýgy we kynçylyk bilen ýüzbe-ýüz bolan Pygamberimiz, alada (hammam), gynanç (hazan) we gorky üçin takyk dilegleri öwretdi - ýüregiň problemadan ony dolandyrýan adama gönükdirýän sözleri.",
      "Bu dualar, zerur bolan halatynda lukmançylyk ýa-da hünär kömegi bilen kanuny ýollar arkaly kömek soramagyň ýerini tutmaýar. Has dogrusy, bu serişdäniň ýanynda ýüregi güýçlendirýärler, imanlylara ahyrky ýeterlikligiň diňe Allaha degişlidigini ýatladýarlar.",
    ],
    phrases: [
      {
        title: "Alada we gaýgy üçin dua",
        when: "Gynanç, alada ýa-da gaty gynanç",
      },
      {
        title: "Allah bize ýeterlikdir",
        when: "Gorkanyňyzda ýa-da ýüregiňiz gysanda",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kesel we gorky",
    summary: "Kanuny bejergini alýan wagtyňyz Alladan şypa gözläň.",
    body: [
      "Sünnet dua bilen bejergä goşulýar: Pygamber alaýhyssalam: «Her kesel üçin bejergi bar» diýip öwretdi we bejergini gözlemegi buýurdy, şol bir wagtyň özünde ýürekleri we bedenleri ruqýa arkaly bejermek - Gurhan okamak we syrkawlar hakda hakyky dilegler. Imanly ikisini edýär: derman alyp, tebibe ýüzlenýär.",
      "Hereket edýän sebäbiň ady möhümdir: Allah kül-şafi, tebipdir we lukmançylyk diňe ýaradan serişdesidir. Gorky bilen ýürek hem howpsuzlyk we berklik üçin Oňa ýüzlenýär - sebäbi diňe özi howpsuzlyk berýär.",
    ],
    phrases: [
      {
        title: "Sagalmak üçin dua",
        when: "Sickarawsyz ýa-da syrkaw adamyň üstünde doga etmek",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Bagyşlamak we ýol görkezmek",
    summary: "Bagyşlaň, tutanýerlilik we dogry ýol görkezmek üçin yzygiderli soraň.",
    body: [
      "Bagyşlamak (istighfar) uly günälerden soň saklanmaýar - bu imanlylaryň gündelik ritmi. Öňden bagyşlanan Pygamberimiz, ýüregiň hemişe ýalpyldawuk bolmalydygyny öwredip, günde ýetmiş gezekden köp Allanyň günäsini geçdi.",
      "Edil şonuň ýaly-da, bir gezeklik waka däl-de, üznüksiz zerurlyk. Hatda berk amal edýän imanlylar hem Alladan ýüreklerini durnukly saklamagyny soraýarlar, sebäbi ýürekler öwrülýär we olary öwürýän Alladyr. Pygamber alaýhyssalam diniň üstünde durýan ýürek üçin ýygy-ýygydan doga edýärdi.",
    ],
    phrases: [
      {
        title: "Freygy-ýygydan toba",
        when: "Günüň dowamynda gaýta-gaýta",
      },
      {
        title: "Berk ýürek üçin dua",
        when: "Nädogry ýoldan ýa-da sarsmakdan gorkanda",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Syýahat we ýagyş dualary",
    summary: "Outolda ýola düşmek we ýagyşyň ýagmagy üçin dilegler.",
    body: [
      "Syýahat hem gowşaklyk, hem-de kabul ediliş derejesi - Pygamberimiz, syýahatçynyň duasyna jogap berilýändigini öwretdi we ulag gurmak we Allanyň gudratyny we Oňa gaýdyp geljekdigimizi tassyklamak üçin dileg etdi.",
      "Rainagyş, Alladan inýän rehimdir, ýagýan pursady dileg etmegiň wagtydyr. Pygamber alaýhyssalam, ýagyşyň zyýany däl-de, peýdaly bolmagyny haýyş edip, gysga dua bilen salamlaşar.",
    ],
    phrases: [
      {
        title: "Syýahat etmek üçin ýola çykanyňda",
        when: "Ulagyňyzy gurup, ugranyňyzda",
      },
      {
        title: "Rainagyş ýaganda dua",
        when: "Rainagyşyň başynda",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Üpjünçilik we maşgala",
    summary: "Öýde kanuny iýmit we dogrulyk üçin Alladan soraň.",
    body: [
      "Düzgün (rizq) diňe Alladan; imanly adam düýäni baglaýar - işleýär we gazanýar - soň üpjün edijiden kanuny iýmit, gazanýan zadynda barakah, karzdan azatlyk we başgalara mätäçlikden garaşsyzlyk soraýar. Pygamberimiz, muny takyk soraýan owadan dua öwretdi.",
      "Öý üçin, Gurhanyň özi dogruçyllaryň dogasyny öwredýär: ousr-aýallara we çagalara “göz üçin rahatlyk” berilmegi we iman, doga we rehimdarlyk bilen birleşdirilen öý hojalygyny alyp barmak.",
    ],
    quran: [{}],
    phrases: [
      {
        title: "Kanuny üpjün etmek üçin dua",
        when: "Irden, namazdan soň we maddy kynçylykda",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Gurhan duaslary",
    summary: "Allanyň Özi Gurhanyň içinde öwredýän dilegler.",
    body: [
      "Gurhan dualary, Allanyň pygamberleriň we imanlylaryň dillerine ýerleşdiren sözleri, soň bolsa gaýtalanmagymyz üçin saklanylýar - gysga, giňişleýin we gowulaşdyrmak mümkin däl. Köpüsi 'Rabbana' (Rebbimiz) bilen başlaýar we ýat tutmak we hemişe okamak üçin amatlydyr.",
      "Olaryň arasynda imanlylaryň ähli zerurlyklary bar: bagyşlamak, ýol görkezmek, tutanýerlilik, rehimdarlyk, dogruçyl maşgala, otdan goramak we iki dünýäde üstünlik. Allanyň öz sözleri bilen doga etmek, iň ygtybarly görnüşleriň biridir.",
    ],
    phrases: [
      {
        title: "Iki dünýäde-de gowy",
        when: "Umumy, ähli maksatly dua - Pygamberiň iň ýygy-ýygydan",
      },
      {
        title: "Imanda berklik",
        when: "Gyşmakdan gorkanda ýa-da ýol görkezilenden soň",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Pygamberlik dualary",
    summary: "Muhammet pygamberiň özbaşdak öwredýän dilegleri.",
    body: [
      'Pygambere "iň giňişleýin söz" (jawami \'al-kalim) berildi we dilegleri muny görkezýär: gysgaça, many taýdan giň we bu durmuşyň we ahyretiň zerurlyklary arasynda gaty deňagramly. Guidanceolbaşçylyk, ýüregiň arassalygy, saglyk, bagyşlamak, goramak we gowy häsiýet soraýarlar.',
      "Esasy ýörelge: ygtybarly kolleksiýalardan hakyky, oňat tassyklanan dualary saklaň we oýlap tapylan baýraklar bilen gowşak ýa-da ýasalan zatlary ýaýratmaň. Sünnetiň hakyky hazynasy ýeterlik däl.",
    ],
    phrases: [
      {
        title: "Dörtlügiň giňişleýin dua",
        when: "Umumy gündelik dileg",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Dikr we tasbeeh",
    summary: "Uly agram we sylag hakda gysga ýatlamalar.",
    body: [
      "Zikr - Allany ýatlamak - tasbeeh (SubhanAllah), tahmid (Alhamdulillah), tahlil (La ilaha illallah), takbir (Allahu Akbar) we istighfar. Bular dildäki iň ýeňil sözleriň arasynda, Terezide iň agyr sözlerdir we janly ýüregiň biperwaýlykdan goragydyr.",
      "Pygamber alaýhyssalam, iň merhemetli söýgüli, terezide agyr, jümleleri dilde beýan etdi we her gün ýüz gezek “SubhanAllahi wa bihamdih” diýýänleriň deňziň köpügi ýaly bolsa-da, günäleriniň süpürilendigini öwretdi. Namazdan soň we günüň dowamynda saklanan zikr imany diri saklaýar.",
    ],
    phrases: [
      {
        title: "Söýgüli we günäni öçürýän sözler",
        when: "Günüň dowamynda; 100 gezek günäleri ýok edýär",
      },
      {
        title: "Terezide iki söz agyr",
        when: "Islendik wagt",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Pygambere salawat ﷺ",
    summary: "Pygambere bereket ibermek her gün rehimdarlygyň çeşmesidir.",
    body: [
      "Pygambere salawat ibermek Gurhanda Allah tarapyndan emr edilýär - 'Hakykatdanam, Allah we onuň perişdeleri Pygambere salam iberýärler. Eý imanlylar, oňa salam we salam iberiň 'we başga hiç bir dua beýle kepillendirilen gaýdyp gelmeýär: Pygamber alaýhyssalam: «Kim oňa bir nygmat iberse, Allatagala on adama iberýär» diýdi.",
      "Freygy-ýygydan salawat rehimdarlyk getirýär, derejeleri ýokarlandyrýar, günäleri süpürýär we Kyýamat güni Pygambere iň ýakyn adamy özüne çekýär. Aşakdaky Ybraýymyň doly görnüşi - sahabalaryna salam bermegi haýyş edenlerinde öwreden görnüşi - her doganyň daşynda okalýar we günüň dowamynda dilde gürlemek üçin ajaýyp.",
    ],
    quran: [{}],
    phrases: [
      {
        title: "Doly Salawat Ybraýymiýa",
        when: "Doga namazynda we günüň dowamynda",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Çeşmeler we hakykylyk",
    summary: "Gurhany we hakyky hadyslary aýdyň sitata bilen ileri tutuň.",
    body: [
      "Bu modul bilim we partiýa däl bolup, bütinleý Gurhanda gurlan we giňden kabul edilen hakyky (sahih / hasan) hadyslaryna esaslanýar. Gündelik dualar üçin altyn standart hut şu: belli çeşme bilen tassyklanan tekst.",
      "Çynlakaý dileg etmek üçin ulanylýar: köp dua oýlap tapylan sözler we çişirilen sylaglar bilen onlaýn ýaýradylýar ('muny okaň we ähli günäleriňiz ýitýär'). Galplaşdyrylan hadys gaty möhüm zat, şonuň üçin ony kabul etmezden ýa-da ugratmazdan ozal nätanyş bir hekaýany barlaň.",
      ".Atlamak we gündelik amal etmek üçin, taşlajak uzaklaryňyzdan hakykatdanam dowam etdirip boljak gysga, hakyky dualary saýlaň - yzygiderlilik Allaha göwrümden has söýgüdir. Mekdepleriň sözleri bilen tapawutlanýan ýerlerinde, ökde hünärli alymdan öwreniň.",
    ],
    actions: [
      "Nätanyş duanyň çeşmesini paýlaşmazdan ozal barlaň.",
      "Birnäçe gysga hakyky duany saýlaň we dowam etdirip bolmajak köp däl-de, her gün saklaň.",
      "Her sapagy hakyky tejribe bilen jübütlemek üçin programmanyň mowzuk baglanyşyklaryny ulanyň.",
    ],
    disclaimer:
      "Bilim mazmuny şahsylaşdyrylan fykh maslahatynyň ýerini tutmaýar. Aýratyn ýagdaýlar barada karar almak üçin ökde alymlardan soraň.",
    appLinks: [{}, {}, {}, {}],
  },
];

export const LEARN_DUA_OCCASIONS_TK: DeepPartial<LearnDuaOccasion>[] = [
  {
    title: "Irden adkar",
    summary: "Güni ýatlamak bilen başlaň",
  },
  {
    title: "Agşam adhkar",
    summary: "Gijeden öň gorag",
  },
  {
    title: "Oýanandan soň",
    summary: "Oýanandan soň ilkinji sözler",
  },
  {
    title: "Uklamazdan ozal",
    summary: "Duas we adhkar",
  },
  {
    title: "Öýe girmek",
    summary: "Bismillah we salam",
  },
  {
    title: "Öýden çykmak",
    summary: "Tawakkul",
  },
  {
    title: "Metjit",
    summary: "Metjide girmek we çykmak",
  },
  {
    title: "Iýmitden öň we soň",
    summary: "Naharda minnetdarlyk",
  },
  {
    title: "Taharet",
    summary: "Taharetden öň we soň",
  },
  {
    title: "Doga",
    summary: "Namazdan öň, wagtynda we soň",
  },
  {
    title: "Alada we alada",
    summary: "Du'a bilen ýüregi köşeşdiriň",
  },
  {
    title: "Kesel",
    summary: "Şypa we sabyr",
  },
  {
    title: "Bagyşlamak",
    summary: "Istighfar we toba",
  },
  {
    title: "Syýahat",
    summary: "Outoldan çykmak we gaýdyp gelmek",
  },
  {
    title: "Düzgünnama",
    summary: "Alladan halal rizq soramak",
  },
  {
    title: "Gurhan duaslary",
    summary: "Allanyň kitabyndan dilegler",
  },
];
