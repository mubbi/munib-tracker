// Turkmen translation overlay for the Learn "The Last Day" content. Mirrors the order of
// its English source in ../last-day*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  LastDayHadithEntry,
  LastDayQuizQuestion,
  LastDayReferenceEntry,
  LastDayTimelineEvent,
  LastDayTopic,
  LastDayVerseEntry,
} from "../../types/last-day";
import type { DeepPartial } from "./localize";

export const LAST_DAY_TOPICS_TK: DeepPartial<LastDayTopic>[] = [
  {
    title: "Giriş",
    summary: "Soňky gün näme we näme üçin häzirki ýaşaýşymyzy üýtgedýär?",
    body: [
      "Awawm al-Kyýama - Durmuş, direliş we kyýamat güni - her bir adamyň Allaha amallaryny görkezmek we iň soňky mesgenini bermek üçin gaýdyp gelýän güni. Uzakdaky rowaýat ýa-da şahyrana keşp däl. Gurhan muny her sahypada diýen ýaly ýatlaýar we iň irki Mekge sürelerinde oňa ynanmak adamyň bütin ömrüni tertipleşdirýändigi sebäpli agdyklyk edýär. Allanyň huzurynda durmaga hakykatdanam garaşýan wagtyňyz, dogruçyllyk, doga, hoşniýetlilik we päsgelçilik goşmaça bezeg bolmakdan ýüz öwüriň we kimdigiňiziň mazmunyna öwrülýär.",
      "Bu modul syýahat etapyny tapgyrlaýyn dowam etdirýär: ölüm we ruhuň gitmegi, barzagyň gabyrdaky aralygy, sagadyň öňündäki ownuk we esasy alamatlar, surnaý çalmagy, jesetleriň direlmegi, bir giň düzlükde ýygnanmak, ýazgylaryň paýlanmagy, Terez, hasap, ahyrsoňy Pygamber howzy we şepagat, iki köpri, geçelge Her tapgyr Gurhandan we hakyky hadyslardan alyndy.",
      "Iki ýörelge bu ýerde hemme zady dolandyrýar. Birinjiden, bu wakalaryň hakykaty belli we ynanç meselesidir. direlişi ýa-da jogapkärçiligini inkär etmek diniň özüni inkär etmekdir. Ikinjiden, sagadyň takyk wagtyny diňe Alla bilýär - hiç bir alym, senenama ýa-da hasaplama öňünden aýdyp bilmeýär we senä bolan her bir talap ýalan. Pygamber alaýhyssalam hiç haçan ýoldaşlaryna sanamady; ýaşamaga ýol berdi. Şonuň üçin soňky güni öwrenmegiň maksady, çaklama däl-de, taýýarlyk: ýüregi ýumşatmak, ileri tutulýan ugurlary düzetmek we bellenen pursat gelmezden ozal ýagşylyga tarap ylgamak.",
      "Çeşmeler barada bellik: meşhur “ahyrzamanyň alamatlary” gepleşikleri gowşak we hatda toslanan kyssalardan doly. Bu modul diňe hakyky zady öz içine alýar we yhlasly sünni alymlaryň hakykatdanam tapawutlanýan ýerlerini öz içine alýar - mysal üçin käbir möhüm alamatlaryň tertibi boýunça - bu tapawut tapawut hökmünde görkezilýär, ýeňilleşdirilmeýär ýa-da ulaldylmaýar.",
    ],
    quran: [
      {
        excerpt:
          "Soňky ýer titremesi bilen ýer titrese we ýüki agyr bolsa, adam aglaýar: Näme boldy? - şol gün habarlaryny habar berer, sebäbi Rebbiňiz ylham berdi. Şol gün adamlar amallaryny görkezmek üçin aýratyn toparlara bölünerler; Şonuň üçin kim atomyň ýagşylygyny etse, ony görer, atomyň agyrlygyny kim etse, ony görer.",
      },
      {
        excerpt:
          "Öz bendeleriniň ylhamyny, gullarynyň duşuşyk güni - çykjak güni barada duýduryş bermegini isleýär, olar hakda hiç zat Allahdan gizlenmedi. Bu gün özygtyýarlylyk kime degişlidir? Theeňiji bolan Allaha.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Näme üçin soňky güne ynanmaly?",
    summary: "Imanyň alty makalasynyň biri - höwes, umyt we ahyrky adalat.",
    body: [
      "Soňky güne ynanmak, Iman pygamberiň Jibril perişde dine öwretmek üçin geleninde ýazan alty makalasynyň biridir: Allaha, perişdelerine, kitaplaryna, habarçylaryna, soňky güne we ylahy karara, onuň peýdasyna we zyýanyna ynanmak (Sahih Musulman 8). Bu ynam bolmasa jogapkärçiligiň ähli gurluşy ýykylýar - eger Allaha gaýdyp gelmeýän bolsa, zalym we keramatly bir zat gutarýar we her ybadat ybadaty asyl manysy bolmadyk endige öwrülýär.",
      "Gurhan soňky gün üçin ahlak taýdan we paýhasly jedel edýär. Ahlak taýdan: bu adalatsyzlygyň jogaby, sebäbi zulum edýänler öz düşeklerinde rahat ölýärler we ezilenler arkaýyn ölýärler, eger Allah hakykatdanam adalatly bolsa, hekaýanyň soňy bolup bilmez. Rasional: sizi ilkinji gezek hiç zatdan ýaradan, sizi ikinji gezek dikeltmäge ukyply däldir (Gurhan 36: 78–79). Direliş asyl ýaradylyşdan has aňsat, kyn däl.",
      "Bu ynanç, ýüregiň iki hereketlendirijisini - gorkyny we umydy tertipleşdirýär we deňagramlylygy saklaýar. Duýduryşlar hakyky, şonuň üçin imanly ulumsy ýa-da biperwaý ösmeýär; şonda-da Allanyň rahmeti uludyr we toba gapysy ölýänçä açyk bolar, şonuň üçin imanly hiç haçan umytdan düşmez. Gorky bilen umyt arasynda ýaşaýan ýürek, döwülmän çalyşmagy dowam etdirýän ýürekdir.",
      "Iş ýüzünde, soňky gün güýçsizlere mertebe we güýçlilere päsgelçilik berýär. Zalymlara Allah tarapyndan hiç hili ýaranyň ýatdan çykarylmaýandygyny we güýçli adamlara hasapda hiç bir baýlygyň, statusyň ýa-da täsiriň goralmajakdygyny aýdýar. Şonuň üçin oňa ynanmak şahsy rahatlyk däl-de, bu dünýädäki adalatyň, sabyrlylygyň we dogruçyllygyň çeşmesidir.",
    ],
    quran: [
      {
        excerpt:
          "Dogrulyk ýüzüňizi gündogara ýa-da günbatara öwürmek däl-de, eýsem, Allaha, ahyret gününe, perişdelere, kitaba we pygamberlere iman eden we söýgä garamazdan, garyndaşlaryna, ýetimlere, mätäçlere, syýahatçylara we soraýanlara baýlyk berýän adamdyr.",
      },
      {
        excerpt:
          "Allatagalanyň zulum edýänlerinden bihabar diýip pikir etmäň. Olary diňe gözleriň elhençlik bilen seredýän güni üçin gijikdirýär.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Iman, Allaha, perişdelerine, kitaplaryna, habarçylaryna, ahyret gününe we ylahy karara, onuň peýdasyna we zyýanyna ynanýandygyňyzdyr. - din öwretmek üçin geleninde Jibriliň hadyslaryndan.",
      },
    ],
    actions: [
      "Her gün niýetiňizi täzeläň: amallarym Allaha degişlidir we Onuň bilen duşuşjak günüm üçin.",
      "Adalatsyzlyk size agyr degse we ýer ýüzündäki kazyýet jogap bermese, ony soňky gün kazyýetine tabşyryň.",
      "Gorky we umydy bilelikde saklaň - gorky sizi umytsyzlyga salmasyn ýa-da umyt sizi ünsden düşürmesin.",
    ],
    appLinks: [{}],
  },
  {
    title: "Ölüm",
    summary: "Her bir adam ölümi dadar - husn al-hatimah we merhumyň peýdasy.",
    body: [
      "Ölüm hiç kimiň sypdyrmaýan duşuşygydyr. Gurhan muny aç-açan aýdýar: her bir adam ölümi dadyp görer we doly jeza diňe Kyýamat güni berler (Gurhan 3: 185). Ölüm ýok etmek däl-de, başga bir zat - ruh bedenden çykýar we syýahatynyň indiki tapgyryna geçýär. Allanyň tabşyran Ölüm perişdesi jany alýar, soň bolsa Rebbiňize gaýtarylar (Gurhan 32:11).",
      "Ölüm usulynyň möhümdigi sebäpli, imanly adam, Allanyň razy bolan ýagdaýynda ölmek umydy bilen çyn ýürekden toba etmek, yzygiderli doga etmek we gowy häsiýet bilen gowy netijä gelýär. Erbet gutarmak - su 'al-hatimah - günäni dowam etdirýän we toba etmän ýüz öwürýän adamdan gorkulýar. Şeýle-de bolsa, muňa rehimdarlyk uludyr: tawbanyň gapysy ölüm jylawy bokurdaga ýetýänçä açyk bolýar, şonuň üçin dem alýança hiç kim giç diýen netijä gelmeli däldir.",
      "Pygamberimiz death ölümi ýygy-ýygydan ýatlamagy öwretdi - 'Köplenç lezzetleri ýok edijini ýada salyň', ýagny ölümi aňladýar (Jami 'at-Tirmizi 2307, hasan) - bizi biynjalyk etmek üçin däl-de, hüşgär bolmak üçin. Ölümi ýada salmak bu dünýäni gysýar, gahar-gazaby ýok edýär we aslynda möhüm zady tertipleşdirýär. Diňe gowşak habarlarda ýüze çykýan ruhuň gidişi baradaky jikme-jiklikler iň gowusy bir gapdala goýulýar; hakyky material haýran galmak we taýynlyk döretmek üçin ýeterlikdir.",
      "Ölüm, üç kadadan çykma bilen amallaryň sanawyny ýapýar. Pygamber alaýhyssalam, adam ölende amallarynyň üçüsinden başga-da kesilýändigini aýtdy: dowam edýän haýyr-sahawat (sadaka jariýa), peýdasyny dowam etdirýän bilim we onuň üçin doga edýän dogruçyl çaga (Sahih Musulman 1631). Bu çuňňur amaly: diri wagtyňyz gurýan, öwredýän we ösdüren zatlaryňyz, gideniňizden soň uzak wagtlap gazanç edip biljekdigini aňladýar.",
    ],
    quran: [
      {
        excerpt:
          "Her bir adam ölümi dadyp görer we size kyýamat güni doly kompensasiýa berler. Şonuň üçin kim otdan çekilip, Jennete kabul edilse üstünlik gazandy. Bu dünýäniň durmuşy diňe aldawyň lezzetidir.",
      },
      {
        excerpt: "Aýt: Saňa ynanylan ölüm perişdesi seni alar; Şonda sen Rebbiňe gaýdyp gelersiň.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Adam ölse, amallary üçden başga gutarýar: dowam edýän haýyr-sahawat, peýdany alýan bilim ýa-da onuň üçin dileg edýän dogruçyl çaga.",
      },
      {
        excerpt: "Köplenç lezzetleri ýok ediji - ölümi aňladýar.",
      },
    ],
    actions: [
      "Istighfar ulaldyň we wagtynda doga ediň - esasanam sagdyn we işli wagtyňyz, diňe syrkaw wagtyňyz däl.",
      "Gijä goýýan anyk bir zadyňyz üçin şu gün toba ediň; ertir humar oýnamaň.",
      "Üç dowamly işe maýa goýuň: dowamly haýyr-sahawat gurmak, peýdaly bilimleri ýaýratmak we çagalary sypaýy we gowy häsiýetde terbiýelemek.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Barzakh (gabyrdaky durmuş)",
    summary: "Ölümden soň direlişe çenli aralyk - sorag we onuň netijeleri.",
    body: [
      "Barzakh bir päsgelçiligi aňladýar we bu adamyň ölümi bilen kyýamat gününiň arasyndaky aralykdyr. Gurhan bu sözi ölen nädogry adamyň yzyna iberilmegini haýyş edeninde ulanýar: 'Olaryň arkasynda direljek gününe çenli päsgelçilik (barzah) bar (Gurhan 23: 100) - bu ýaşaýşa gaýdyp bolmajak berk diwar. Jeset gömüldi, ýakyldy, gark boldy ýa-da ýitdi, ruh barzaga girýär; gabyr diňe iň ýaýran görnüşdir we ahyretiň ilkinji basgançagydyr.",
      "Hakyky hasabatlar jaýlanandan soň sorag edilişini suratlandyrýar. Iki perişde gelip merhumdan üç sorag berýärler: Rebbiňiz kim? Diniň näme? Size iberilen bu adam kim? Allatagalanyň berk jogap berýän imanlysy: Rebbim Allah, meniň dinim Yslam we bu Muhammet ﷺ; gabyr giňeldilip, onuň üçin ýakylýar. Üns bermedik adam: \"Ah, bilemok\" diýýär we kynçylyklara laýyk gelýär (Jami at-Tirmizi 1071, iki perişde Munkar we Nakir diýip atlandyrylýan hasan). Şonuň üçin Gurhan, imanlylary 'dünýä durmuşynda we ahyretde berk söz bilen' berk saklandygy üçin Allany öwýär (Gurhan 14:27).",
      "Soňra mazarda bagt ýa-da jeza berilýär, hakyky ýazgylarda tassyklanylýar: 'Mazar ýa Jennet baglaryndan bag, ýa-da ot çukurlaryndan çukur' (Jami 'at-Tirmizi 2460, hasan sahih). Gurhan, fyrownyň halkynyň Sagat gelmezinden ozal «ertir we agşam» oda duçar bolmagynyň jezasy barada aýdylýar (Gurhan 40:46). Ahl-Sünnet, takyk tebigatyny Allaha galdyryp, agyr sylag we jeza hakykatyny tassyklaýar, sebäbi görünmeýänlere degişlidir we diriler tarapyndan duýulmaýar.",
      "Gaty sorag etmek, mazaryň bagty ýa-da azaplary hakyky diýen ylalaşyk bar; alymlar has gowy nokatlary ara alyp maslahatlaşýarlar - meselem, bedene, jana ýa-da ikisine-de degýärmi ýa-da adaty mazary bolmadyklara nädip baryp ýetýär - bu soraglaryň nokatdan daşlaşmagyna ýol bermezden. Barzakh iň uly höweslendiriji: mazary ýerdäki deşikden öz işleriniň aýnasyna öwürýär we öňe iberen zadyňyzyň şol ýerde salam berjekdigini aýdyň görkezýär.",
    ],
    quran: [
      {
        excerpt:
          "Ölüm olaryň birine gelýänçä, şeýle diýýär: Lorda Reb, yzymda galdyran zatlarymda dogrulyk edip bilerin diýip, meni yzyna iber. ! Ok! Bu diňe onuň aýdýan sözi; we olaryň arkasynda direljek gününe çenli päsgelçilik bar.",
      },
      {
        excerpt:
          "Ot - oňa irden we agşam täsir edýärler. Sagatyň peýda boljak güni şeýle diýiler: Fyrownyň halkyny iň agyr jeza bilen kabul ediň.",
      },
    ],
    hadith: [
      {
        excerpt: "Mazar ýa-da Jennet baglaryndan bir bag ýa-da Ot çukurlaryndan çukur.",
      },
      {
        excerpt:
          "Merhum jaýlananda, iki perişde gelip, ondan soraýarlar: Perwerdigäriňiz kim? Diniň näme? Pygamberiň kim? Mömin ynam bilen jogap berýär we mazary giňelýär we onuň üçin ýakylýar.",
      },
    ],
    misconceptions: [
      ".Alňyş düşünje: Agyr jeza halkyň ynanjydyr. Düzediş: Sorag bermek, uly bagt ýa-da azap etmek hakykaty hadysda kesgitlenýär we Gurhanda aýdylýar; bu sünni mezhebiniň çözülen nokady.",
      "Nädogry düşünje: Perişdeleriň takyk görnüşi we atlary barada jedel etmeli. Düzediş: Munkar bilen Nakiriň at dakmagy hasan hasabatynda gelýär; Esasy ynam sorag bermegiň özi. Oňa dogry jogap bermäge taýynlyk, jikme-jiklikleri barada jedel etmekden has möhümdir.",
    ],
    actions: [
      "Töwhid we sünnete berk ýapyşyň - mazaryň jogaplary ol ýerde ýatda saklanman, şu ýerde ýaşady.",
      "Pygamberimiziň protection goramak we erjellik hökmünde öwreden ertir we agşam adhkarlaryny goraň.",
    ],
    appLinks: [{}],
  },
  {
    title: "Soňky günüň alamatlary",
    summary: "Ownuk we esasy alamatlar - Sagadyň takyklygy, näbelli wagty.",
    body: [
      "Sagatyň geljekdigi belli, ýöne wagty Allanyň özüne saklaýan syrydyr. Hatda Pygamberimizden haçan geljekdigini soranlarynda, berlen jogap soraýanlardan başga zady bilmeýär - bilimi diňe Allaha degişlidir (Gurhan 7: 187). Şonuň üçin haýsydyr bir “belgi” öwrenmezden ozal çözülmeli zat: alamatlar bizi taýýarlamak üçin berilýär, hiç haçan senäni hasaplamaga ýol bermeýär. Sagat üçin bir ýyl at beren her bir adam Gurhana ters gelýär.",
      "Alymlar alamatlary iki görnüşe bölýärler. Ujypsyz alamatlar (al-'alamat al-sughra) ýuwaş-ýuwaşdan köp asyrlaryň dowamynda emele gelýän kem-kemden jemgyýetçilik, ahlak we dünýä üýtgemeleri. Esasy alamatlar (al-'alamat al-kubra), iň soňunda ýakynlaşýan adatdan daşary, aýdyp bolmajak wakalar toparydyr. Gurhan, \"käbir alamatlarynyň eýýäm gelendigini\" belleýär (Gurhan 47:18) - Pygamberiň gelmegini we Aýyň bölünmegini öz içine alýan salgylanma.",
      "Esasy alamatlar üçin labyr teksti, Pygamberimiziň on sanysyny sanap geçen Hudhayfah ibn Usaýdyň hadysydyr: tüsse (Dukhan), Dajjal, ýer haýwany (Dabbat al-Ard), Günüň dogýan ýerinden çykmagy (günbatar), 'Isa ibn Merýem, Magujid' we 'Maj'juj' gündogar, biri günbatarda we biri Arap ýarym adasynda adamlary ýygnanýan ýerine eltýän ot bilen möhürlenendir (Sahih Musulman 2901). Al-Mahdi we Dajjal beýleki hakyky habarlarda gelýär we Işaýa gelmezinden ozal ýerleşdirilýär.",
      "Yhlasly alymlaryň pozisiýasy, her bir belgi tassyklansa-da, olaryň takyk tertibi tekstler bilen doly kesgitlenmeýär we abraýly sünni alymlary takyk yzygiderlilikde tapawutlanýar. Bu tapawut däp-dessuryň adaty bir bölegi we jedel üçin sebäp ýok. Bularyň hemmesine pygamberlik bilen jogap bermek häzirki wakalar hakda gorkuzmak ýa-da tükeniksiz çaklamalar däl-de, eýsem imanyň, toba we peýdaly hereketleriň artmagydyr.",
    ],
    quran: [
      {
        excerpt:
          "Sagat hakda soraýarlar: haçan geler? Aýt: Bilimi diňe Rebbimdedir. Ondan başga hiç kim wagtyny açmaz. Göklerde we ýerde agyr ýatýar. Garaşylmadyk ýagdaýdan başga saňa gelmez.",
      },
      {
        excerpt:
          "Sagat birden olaryň gelmeginden başga garaşýarlarmy? Käbir alamatlary eýýäm geldi. Themöne başyna gelensoň, nädip ýatladylar?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ondan öň on alamaty görýänçäňiz sagat gelmez: tüsse, Dajjal, Haýwan, günbatardan gün dogmagy, Merýemiň ogly Isa, ajajuj we Majuj, üç sany süýşme - gündogarda, biri günbatarda we biri Arap ýarym adasynda we iň soňkusy adamlary ýygnanýan ot.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ownuk alamatlar",
    summary: "Pygamberimizi kem-kemden üýtgedýär ﷺ suratlandyrdy - howsala taýynlyk.",
    body: [
      'Ujypsyz alamatlar, jemgyýetdäki haýal, jemleýji üýtgeşmeler, ahlak we bilim ýagdaýy, Pygamberimiziň sagadyň ýakynlaşmagy bilen düşündirýär. Olar köp we tebigaty boýunça ýekeje dramatiki pursatda däl-de, uzak wagtlap dowam edýär. Aslynda iň uly kiçijik alamat eýýäm bolup geçdi: Muhammet pygamberiň: "Men we Sagat bu ikisi ýaly iberildik" diýýän iki barmagy bilen birleşip, soňky habarçy we soňky döwür başlandygyny aňladýar.',
      "Hakyky hadysda görkezilen alamatlaryň arasynda: ynamyň ýitmegi, işleriň özüne laýyk dällere berilmegi üçin - 'Ynam ýitirilende, sagada garaşyň' we bu 'mynasyp bolmadyklara ygtyýarlyk berlende' bolýar (Sahih al-Buhari 6496). Jibriliň meşhur hadysynda Pygamber alaýhyssalam iki aç-açan alamat dakypdyr: 'gyrnagyň hojaýynyny dogurar we beýik bina gurmakda ýalaňaç, ýalaňaç, garyp çopanlary görersiň' (Sahih Musulman 8).",
      "Beýlekilerine wagt duýgusynda umumy tizlenme, ýer titremeleriň we öldürmeleriň köpelmegi we bilimiň ýitmegi degişlidir. Bilim babatynda Pygamberimiz the mehanizm barada takyk aýdypdyr: 'Bilim alynýança, ýer titremeler köpelýär, wagt çalt geçýär, muşakgatlar ýüze çykýar we adam öldürýänçä sagat kesgitlenmez' (Sahih al-Buhari 1036). Bilimiň nädip gidýändigini düşündirdi: 'Allah bilimleri adamlardan alyp, alymlary alyp, hiç kim galýança ýok edýär we adamlar nadanlary soralýan we bilimsiz höküm çykarýan ýolbaşçy hökmünde kabul edýärler, şonuň üçin azaşýarlar we başgalary azaşýarlar' (Sahih al-Buhari 100). Şeýlelik bilen, “bilimiň ýitmegi” maglumat ýetmezçiligi däl - bir ýaş maglumatlara gark bolup biler - ýöne sagdyn alymlaryň we durmuş tejribesiniň ýitmegi.",
      "Bu ýerde möhüm düzgün: belli bir döwrebap hadysanyň 'belli bir hadysyň ýerine ýetirilendigini yglan etmek manyly däl. Gök binalardaky ýaryşlar ýa-da artýan jenaýat Pygamberiň sözlerini gaýtalap biler, ýöne ylhamlary sözbaşylara ynam bilen bellemek seresap alymlaryň usuly däl. Her bir ownuk nyşana dogry jogap içindedir: ony Allaha gaýdyp gelmek, dini öwrenmek we hereket etmek, ygtybarlylyga we hakykata berk ýapyşmak üçin okaň - alada ýa-da tomaşa üçin material däl.",
    ],
    hadith: [
      {
        excerpt:
          "Ynam ýitirilende, sagada garaşyň. Ondan soraldy: Allahyň Resuly, nädip ýitirim bolar? Ol aýtdy: Oňa mynasyp bolmadyklara ygtyýar berlende, sagada garaşyň.",
      },
      {
        excerpt:
          "Sagadyň alamatlarynyň arasynda: gyrnagyň hojaýynyny dogurjakdygy we beýik binalaryň gurluşygynda ýalaňaç, ýalaňaç, garyp çopanlary görjekdigini görmek. - Jibriliň hadyslaryndan.",
      },
      {
        excerpt:
          "Allatagala bilimleri elinden almak bilen aýyrmaýar, ýöne alymlary alyp, hiç kim galýança we adamlar nadanlary hökümsiz höküm çykarýança kabul edýärler, şonuň üçin azaşýarlar we başgalary azaşýarlar.",
      },
    ],
    disclaimer:
      "Aýry-aýry wakalara aýratyn ownuk alamatlary ulanmak düşnükli, belli däl. Bu modul, häzirki zaman hadysalarynyň takyk ýerine ýetirilýändigini tassyklamazdan hakyky hadyslary görkezýär.",
    actions: [
      "Hünärli mugallymlardan peýdaly bilim gözläň, hereket ediň we beriň - bu bilimleriň ýitip gitmegine gönüden-göni garşy çykýar.",
      "Sözüňizde, işiňizde we işiňizde ygtybarlylygy we dogruçyllygy goraň.",
      "Aljyraňňylyga ýa-da onlaýn çaklamalara ýangyç däl-de, toba çagyryşy hökmünde her belgini içinden okaň.",
    ],
  },
  {
    title: "Esasy alamatlar",
    summary: "Sahih Musulmanyň on esasy alamaty - Mahdi, Dajjal, 'Isa we başgalar.",
    body: [
      "Esasy alamatlar, ahyrzamanyň golaýynda jemlenýän ajaýyp, aýdyp bolmajak wakalardyr. Olaryň tertipnamasy Hudhayfah ibn Usaýdyň hadysydyr: Pygamber alaýhyssalam sagadyny ara alyp maslahatlaşýan ýoldaşlaryna seredip, on alamaty - tüsse (Dukhan), Dajjal, ýer haýwany (Dabbat al-Ard), günbatardan gün ýaşmagy, günbatardan günbataryň çykmagy, 'Isa ibj Merýem', 'Isa ibn Marym' Arabystan) we ahyrynda adamlary ýygnanýan ýerine eltýän ot (Sahih Musulman 2901). Ujypsyz alamatlardan tapawutlylykda, bular başlansoň biri-birini ýakyndan yzarlaýarlar.",
      "Al-Mahdi, pygamberiň öýündäki zulumdan doluşy ýaly adalat bilen doldurjak adalatly lider hökmünde hakyky habarlarda gelýär (Sunan Abi Dawud 4282, hasan). Ol kanun çykaryjy ýa-da täze pygamber däl - janlanýar, oýlap tapmaýar we ejiz kyssalarda goşmaça jikme-jiklikler aýrylanda, oňa bolan ynam Ahl al-Sünnet tarapyndan tassyklanýar.",
      "Dajjal (ýalan messiýa) dünýädäki iň uly synag. Pygamberimiz ony al-Nawwas ibn Samanyň (Sahih Musulman 2937) uzyn hadysynda beýan edipdir: gözleriniň arasynda 'Kafir' ýazylan bir gözli aldawçy, her pygamberiň halkyna duýduryş beren imany synamak üçin güýç beripdir. Onuň fitnesi jedel bilen däl-de, berk ynam bilen ýeňilýär we Pygamberimiz Kahf süresiniň açylyş aýatlaryny gorag hökmünde ýatda saklamagy öwretdi.",
      "Soňra Isa ibn Merýem (sallaLlahu aleýhi we sellem) iner - sünni mezhebiniň berk nokady. Pygamber alaýhyssalam aýtdy: 'Elimde janym bar bolsa, Merýemiň ogly ýakyn wagtda araňyzda adalatly hökümdar hökmünde iner; haçy döwer, doňuzlary öldürer we jizýany ýok eder, hiç kim kabul etmänkä baýlyk köpeler '(Sahih al-Buhari 3448). Muhammet of yzyna eýeriji bolup gelýär, ymmatyň ymamynyň (Sahih al-Buhari 3439) arkasynda doga edýär, Dajjaly öldürýär we Muhammet şerigatynyň düzgünleri. Ya'juj we Ma'juj soň boşadylýar, galan alamatlar adamzady ýygnanýança ýüze çykýar.",
      "Dogruçyllygyň iki nokady. Ilki bilen, alymlar on alamatly hadysdaky her bir nyşanyň hakykaty bilen ylalaşýarlar, ýöne takyk tertibi boýunça tapawutlanýar we bu tapawut kanuny we köne. Ikinjiden, Duhan we haýwan bu sahih hadysyň bir bölegidir; Aýry-aýrylykda jikme-jik beýan edýän käbir beýleki kyssalar güýç taýdan üýtgeýär, şonuň üçin bu modul has gowşak goşmaçalara däl-de, güýçli on belgili hasabatlara esaslanýar.",
    ],
    hadith: [
      {
        excerpt:
          "On alamaty görýänçäňiz sagat gelmez: tüsse, Dajjal, Haýwan, Günüň günbatardan çykmagy, Merýemiň ogly Isa, ajajuj we Maujujyň düşmegi we üç sany süýşme - biri gündogarda, biri günbatarda we biri Arap ýarym adasynda - iň soňkusy adamlary ýygnanýan ot.",
      },
      {
        excerpt:
          "Elimdäki janym bolan Merýemiň ogly ýakyn wagtda araňyzda adalatly hökümdar hökmünde iner. Ol haçy döwer, doňuzlary öldürer we jizýany ýok eder, baýlyk şeýle bir köp bolar welin, hiç kim ony kabul etmez.",
      },
      {
        excerpt:
          "Bu dünýäniň diňe bir güni galan bolsa, Allah şol gün maşgalamdan (Mahdi) adalatsyzlyk we sütem bilen doldurylan ýaly adalat bilen doldurjak bir adamy ulaltýança uzaldardy.",
      },
    ],
    disclaimer:
      "Esasy alamatlaryň hakykaty tassyklanýar, ýöne takyk yzygiderliligi we wagty alymlar tarapyndan doly ylalaşylmaýar. Sene bellemekden gaça duruň we häzirki şahsyýetiň Mahdi, Dajjal ýa-da Işaýadygyny öňe sürmäň.",
    appLinks: [{}],
  },
  {
    title: "Surnaý",
    summary: "Israfil - birinji partlama, ikinji partlama we direliş.",
    body: [
      "Allatagala ahyrzamany buýranda, surnaý (Sur) ynanylan perişde ony üflär. Oňa “Israfil” dakmak ylmy däplerden gelýär; Gurhanyň berk düzedýän zady, wakanyň özi we terrorçylygydyr. Pygamberimiz mydama munuň nähili ýakyndygyny aýtdy: 'Tüýdük göteriji ony agzyna salyp, maňlaýyny egip, buýrugyň urmagyna garaşsa, nädip rahat bolup bilerin?' - we bu ýoldaşlary biynjalyk edeninde, olara: \"Alla bize ýeterlikdir we iň gowy iş beriji\" diýmegi öwretdi (Jami 'at-Tirmizi 2431, hasan).",
      "Iki partlama bar we Gurhan olary tapawutlandyrýar. Birinjisinde 'surnaý çalynar, kim asmanda we ýerde bolsa, Allanyň islemediklerinden başga-da öler' (Gurhan 39:68) - döredilen tertibi tamamlaýan terror we ölüm partlamasy. Ikinjisi gelýär: 'soň ýene-de üflener we derrew durup, seredip durarlar' (şol aýat dowam edýär) - ähli ýaradylyş ölülerden direljek direliş partlamasy.",
      "Köp alymlar şol bir aýatdan we tassyklaýjy habarlardan başga-da, \"Allanyň islänleri\" urulmadyklar we iki partlamanyň arasyndaky aralyk barada aýdýarlar, ýöne uzynlygy we jikme-jiklikleri dürli güýçleriň habarlaryna esaslanýar we Allaha galdyrylýar. Elbetde, partlamalaryň jübüti: soňy, soňam ýokary galmagy. Muňa 'Duýduryş güni' diýilýär (Gurhan 50:20), sebäbi taýynlyk wagty ýok wagty eşidilen iň soňky çagyryş, hut şu sebäpden çagyryşlara jogap berilmelidir.",
    ],
    quran: [
      {
        excerpt:
          "Surnaý çalynar, asmanda kim bar bolsa, ýer ýüzünde kim Alla islese, öler. Soň ýene üflener we derrew durup, seredip durarlar.",
      },
      {
        excerpt: "Surnaý çalynar. Bu duýduryş güni.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Tüýdük göteriji agzyna goýup, buýrugyň urmagyna garaşyp, maňlaýyny egip, nädip rahat bolup bilerin? Ionsoldaşlar gynandylar, şonuň üçinem olara: Alla bize ýeterlikdir we iň gowy iş beriji.",
      },
    ],
  },
  {
    title: "Direliş",
    summary: "Bedenler dikeldildi - Allanyň öňünde durmagyň ähliumumylygy.",
    body: [
      "Ikinji partlamada ölüler direldi, beden we jan, direliş diňe ruhy däl, hakyky we fiziki. Gurhan şübheçiniň ýaňsylaýjy sözlerine gabat gelýär: bir adam döwülýän süňküni tutup, kime jan berip biljekdigini soraýar; Jogap: 'Aýt: Oňa ilkinji gezek öndüren ýaşaýyş berer we ähli ýaradylyşlary bilýär' (Gurhan 36: 78–79). Seni hiç zatdan emele getirmek Allanyň gudratynda bolsa, seni dikeltmek kyn bolmaz.",
      "Direliş ähliumumydyr - ilkinjiden ahyryna çenli, her bir halkyň direlmegi. Pygamberimiz people adamlaryň ösýän ýagdaýyny şeýle suratlandyrdy: 'Adamlar ýalaňaç, ýalaňaç we sünnetsiz ýygnanarlar'. Aýşa erkekleriň we aýallaryň biri-birine seredip-seredip bilmejekdiklerini soranda, şol günüň meselesiniň hiç kimiň aladasyny edip bilmejekdigini aýtdy (Sahih al-Buhari 6527). Şeýle hem, 'Siz ýalaňaç, ýalaňaç we sünnetsiz ýygnanarsyňyz, kyýamat güni ilkinji geýnen Ybraýym bolar' (Sahih al-Buhari 3349).",
      "Doktrinanyň manysy tomaşa däl-de, ýerine ýetirýän jogapkärçiligi. Allaha gaýdyp geljekdigi şübhesiz, hiç bir iş hakykatdanam şahsy däl we ölüm hakykatdanam gaçmak däldir. 'Kyýamat gelýär, muňa şübhe ýok - Alla mazardakylary direlder' (Gurhan 22: 7). Bedeniň direlmegine ynanmak, bu durmuşyň ahlak agramyny wagtlaýyn däl-de hakyky edýär.",
    ],
    quran: [
      {
        excerpt:
          "Ol bize bir mysal getirýär we ýaradylyşyny ýatdan çykarýar: “Süňkler çüýrän wagty kim jan berer? Aýt: Olara ilkinji gezek döreden durmuşy berer we ähli ýaradylyşlary bilýär.",
      },
      {
        excerpt: "Kyýamatyň geljekdigine, şübhesiz, Allatagala gabyrdakylary direlder.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Arealaňaç, ýalaňaç we sünnetsiz ýygnanarsyňyz. Soň bolsa okady: Ilkinji ýaradylyşy başlanymyzda, ony gaýtalarys. Kyýamat güni geýnen ilkinji adam Ybraýym bolar.",
      },
      {
        excerpt:
          "Adamlar ýalaňaç, ýalaňaç we sünnetsiz ýygnanarlar. Aýşa: Erkekler we aýallar biri-birine seredermi? Ol: Munuň üçin gaty agyr bolar.",
      },
    ],
  },
  {
    title: "Ingygnak (Mahşar)",
    summary: "Allanyň öňünde durmak - ýakyn gün, der we adamlaryň ýagdaýy.",
    body: [
      "Direlenden soň, ähli ýaradylyş höküme garaşmak üçin bir giň, tekiz düzlük - Mahşara gönükdirilýär. Itselferiň özi üýtgedi: 'Eartheriň başga bir ýer, asmanlar bilen çalşyljak güni, ýeňiji bolan Allanyň huzurynda çykar' (Gurhan 14:48). Hiç hili bellikler ýok, gizlenjek mähelle ýok, bil baglamak üçin status ýok - diňe her bir adam açyk we garaşýar.",
      "Şol durmagyň şertleri agyr. Pygamber alaýhyssalam aýtdy: 'Kyýamat güni gün adamlara şeýle bir ýakynlaşar welin, bir mil uzaklykda bolar we amallaryna görä derlerine gark bolar - käbiri topuklaryna, käbiri dyzyna, käbiri biline, käbiri der köşer' (Sahih Musulman 2864). Şol bir wagtyň özünde-de, amallar bilen paýlanylýan rehimdarlygy suratlandyrýar: Pygamberimiziň atlandyran kategoriýasy, Allanyň tagtynyň kölegesinde kölegesi bolmaz, şol bir wagtyň özünde adalatly lider, ybadatda önüp-ösen ýaşlar we çep eli nämäni sarp edendigini bilmeýär.",
      "Garaşmak uzyn - Gurhan “ölçegi elli müň ýyl” hakda aýdýar (Gurhan 70: 4), ýöne uzynlygy hemmeler üçin birmeňzeş däl. Hakyky habarlar, imanlylar üçin iki doganyň arasyndaky wagt ýaly gysga bolar, beýlekilere bolsa agyr degýär diýilýär. Şeýlelik bilen, Mahşar durmuşyň şahsy ýazgysynyň köpçülige hakykata öwrülýän ýeri: şol bir gün, şol bir düzlük we düýbünden başga tejribeler, her bir adamyň iberen zatlaryndan düýbünden alnan.",
    ],
    quran: [
      {
        excerpt:
          "Eartheriň başga bir ýer, asmanlar bilen çalşyljak güni we ýeňiji bolan Allanyň huzurynda çykar.",
      },
      {
        excerpt: "Perişdeler we Ruh elli müň ýyllyk bir günde Oňa çykýarlar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Gün kyýamat güni adamlara bir mil çemesi aralykda ýakynlaşar we amallaryna görä derde gark bolar - käbiri topuklaryna, käbiri dyzyna, käbiri biline, käbiri bolsa derini ýitirer.",
      },
    ],
  },
  {
    title: "Şepagat (Şafa)",
    summary: "Diňe Allanyň rugsady bilen - görnüşler we iň uly şepagat.",
    body: [
      "Şafat şepagatdyr - bir tarap başga biriniň adyndan Allaha ýüzlenýär. Bu hakyky we rehimdir, ýöne hiç haçan garaşsyz däldir: hiç kimiň Allanyň rugsady bolmazdan we diňe razy bolan adamdan başga hiç kim şepagat etmeýär. Gurhan bu düzgüni iki gezek aýdýar: 'Onuň rugsady bolmazdan, Oňa şepagat edip biljek kim?' (Gurhan 2: 255) we 'Şepagat, rugsat bereninden başga hiç hili peýdasy degmez' (Gurhan 34:23). Bu ýeke-täk şert, yslam şepagat taglymatyny her bir korrupsiýadan aýyrýan zat.",
      "Iň ulusy, Muhammet pygambere mahsus bolan “Al-Shafa'ah al-Udhma”. Uzak wagtlap ezilen Mahşarda adamzat pygamberden pygambere - Adam, Ybraýym, Musa, Isa - Muhammet alaýhyssalam gelýänçä özüni bagyşlar. Arşyň aşagynda setrde eder we oňa: 'Kelläňizi galdyryň, soraň, size berler, şepagat edersiňiz we şepagatyňyz kabul ediler' (Sahih al-Buhari 7440; pygamberleriň doly zynjyry Sahih Musulman 195-de). Şeýdip, Alladan hasap başlamagyny we duran ýerinden dynmagyny soraýar - diňe özüne wada berlen öwgi stansiýasy.",
      "Beýleki hakyky görnüşler: käbir imanlylaryň jennete girmezden araçylyk etmegi; derejelerini ýokarlandyrýan şepagat; Iň esasy zat bolsa, pygamberiň, beýleki pygamberleriň, perişdeleriň, imanlylaryň we ahyrsoňy rehimdarlaryň iň rehimdar Allahynyň rehimdarlygy bilen adamlar otdan çykarylmagy üçin imanlylaryň arasynda uly günäkärler üçin şepagat. Pygamberler, şehitler, dogruçyllar we hatda ýaş ölen çagalar-da aýry-aýry habarlaryň güýji dürli-dürli bolsa-da, rugsat bilen şepagat edip bilerler.",
      "Esasy seresaplyk: ahyretdäki şepagat ölüleri ýa-da ýoklary kömek soramaga hiç wagt ygtyýarnama bermeýär. Gabyrda bir pygamber ýa-da keramatly adamy çagyrmak, kynçylyklardan dynmak ýa-da zerurlyklary bermek üçin haýyş etmek, Alladan başga ybadat etmekdir - bu şirkdir we bu ýerde Allanyň islän gününde berýän merhemetidir. Şeýle hem bu durmuşda imanyň we toba zerurlygynyň ýerini tutmaýar; Töwhidde ýaşan we ölenlere Allanyň rahmetidir.",
    ],
    quran: [
      {
        excerpt:
          "Onuň rugsady bolmazdan, Oňa şepagat edip biljek kim? Olardan öňdäki zatlary we soňundan näme boljakdygyny bilýär we bilimlerinden islän zadyny öz içine almaýar.",
      },
      {
        excerpt: "Şepagat etmek, rugsat bereninden başga hiç hili peýdasy degmez.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Adamlar meniň ýanyma gelerler we men Allanyň öňünde seatedde ederin we oňa: Muhammet Muhammet, başyňy galdyr; soraň we size berler, şepagat ediler we şepagatyňyz kabul ediler.",
      },
      {
        excerpt:
          "Adamzat Adam atanyň, soňra Ybraýymyň, soňra Musanyň, soň bolsa Işanyň ýanyna barar we her kim Muhammet alaýhyssalam gelýänçä özüni bagyşlar we oňa iň uly şepagat berilýär.",
      },
    ],
    misconceptions: [
      ".Alňyş düşünje: Şepagat gözlemek Pygambere ýa-da dogruçyllara ybadat edilýändigini aňladýar. Düzediş: Ybadat diňe Allaha degişlidir; ahyret güni şafat, Allanyň rugsady bilen beren rehimidir we bu durmuşda ölüleri çagyrmagy aklamaz.",
    ],
  },
  {
    title: "Amallaryň ýazgysy",
    summary: "Perişdeleri ýazga almak - sag eli, çep eli, hiç zat galdyrylmady.",
    body: [
      "Her bir adamyň amallaryny ýazmak üçin iki sany asylly kätip bar: 'Iki kabul ediji sagda we çepde oturanda, bir sözem aýtmaýar, ýöne özi bilen ýazga geçirmäge taýyn synçy bar' (Gurhan 50: 17-18). Ahyrýet güni bu ýazgylar gowşurylýar we kitabyň kabul edilmeginiň özi ilkinji hökümdir - üstünlik gazananlar üçin sag eliňizde, çep eliňizde ýa-da weýran edilenler üçin arka tarapdan (Gurhan 84: 7–12; 69: 19–37).",
      "Bu ýazgylardan hiç zat aýrylmaýar - iň kiçi hereket däl, işe öwrülen gysga wagtlyk pikir däl. Zalymlar munuň dolylygyna haýran galarlar: 'Diýerler: Waý, bize waý! Recordedazga alandan başga kiçijik ýa-da uly zat galdyrmaýan bu kitap näme? Öňlerinde görkezen zatlaryny taparlar we Perwerdigäriňiz hiç kime zulum etmez '(Gurhan 18:49). Allanyň rahmeti bilen, ýagşy niýetler we terk edilen günäler hem imanlylaryň peýdasyna ýazylýar.",
      "Sahypalary doldurýan dil we eller bolany üçin, olary goramak ýazgyny goraýar. Pygamber alaýhyssalam dili halas etmegiň merkezi etdi: 'Kim maňa eňeginiň we aýagynyň arasyndaky zady kepillendirýän bolsa, men oňa Jennet kepillendirýärin' (Sahih al-Buhari 6474), ýagny kim sözüni we päkligini gorasa. Dogruçyl öz-özüňi gözden geçirmek endigi - bu gün kitaba goşulan zatlary soramak - imanly adamyň saklap biljek iň täsirli we peýdaly amallaryndan biridir.",
    ],
    quran: [
      {
        excerpt:
          "Recordazgy ýerleşdiriler we jenaýatçylaryň içindäki zatlardan gorkýandygyny görersiňiz: “Waý, bize waý! Recordedazga alandan başga kiçijik ýa-da uly zat galdyrmaýan bu kitap näme? We hödürlän zatlaryny taparlar, Rebbiňiz hiç kime zulum etmeýär.",
      },
      {
        excerpt:
          "Recordazgysyny sag eli bilen berlen adam barada aýdylanda bolsa: Ol: Meniň ýazgymy oka! Hasabymy görjekdigime ynanýardym. Şonuň üçin ol ýakymly durmuşda bolar. Hisöne çep elinde ýazgysy berlen biri: Käşgä ýazgym berilmedik bolsa diýer.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim maňa eňeginiň we aýaklarynyň arasyndaky zady kepillendirýän bolsa, men oňa Jennet kepillendirýärin - dili we päkligi.",
      },
    ],
    actions: [
      "Dili hemme zatdan ýokarda saklaň - gowy ýa-da näsag ýazgylary doldurýan zatlaryň köpüsi geçýär.",
      "Sleepatmazdan ozal günüňizi gözden geçiriň: kitabyňyzda ýazylanlary görmek üçin näme isleýändigiňizi we näme gorkjakdygyňyzy soraň.",
    ],
    appLinks: [{}],
  },
  {
    title: "Terez (Mizan)",
    summary: "Agramlanan amallar - yhlas, häsiýet we dikr terezini agyrlaşdyrýar.",
    body: [
      "Mizan, amallaryň doly adalat bilen ölçelýän Terezidir: 'Kyýamat güni adalat terezisini goýýarys, şonuň üçin hiç kime asla zulum edilmez; gorçisa tohumynyň agramy bolsa-da, ony çykararys we hasapçy hökmünde ýeterlikdiris (Gurhan 21:47). Ahl-Sünnet muny diňe bir metafora däl-de, amallaryň ýa-da ýazgylaryň hakyky agramy bilen hakyky deňagramlylyk hökmünde tassyklaýar. Adamyň ykbaly haýsy pananyň gark bolýandygyny görkezýär: 'Terezisi agyr bolsa, ýakymly durmuşda bolar; terezisi ýeňil bolan adam bolsa, gaçybatalga bolar '(Gurhan 101: 6–9).",
      "Terezini agyrlaşdyrýan zat, işjeňligiň göwrümi däl-de, Allanyň huzuryndaky agramydyr, agram bolsa çyn ýürekden gelýär. Pygamber alaýhyssalam, ýöne ägirt uly amallara yşarat etdi: 'Dilde iki söz ýeňil, Terezide agyr, Rehimdarlara söýgüli: SubhanAllahi wa bihamdih, SubhanAllahil-Azim' (Sahih al-Buhari 6406). Şeýle hem, 'Kyýamat güni imanlylaryň terezisinde gowy häsiýetden has agyr zat ýok' diýdi (Jami 'at-Tirmizi 2002, sahih). Şonuň üçin tüýs ýürekden gaýtalanýan ýönekeý ýatlama, ýa-da sabyrly edep-terbiýe, daglyk hereketlerden has ýokary bolup biler.",
      "Munuň tersi, boş işleriň howpy. Adamlar (riýa) tarapyndan görülmeli ýa-da ikiýüzlilik bilen zaýalanan hereketler Terezä agramsyz - daşardan uly, içerki boş bolup biler. Şonuň üçin yhlas (ikhlas) köpleriň arasynda bir fazylet däl-de, eýsem her bir işe öz agramyny berýän zat. Sapak, kiçijik, ak ýürekli, yzygiderli hereketleriň töwereginde gurmak we görünýänleriň arkasyndaky niýeti arassalamakdyr.",
    ],
    quran: [
      {
        excerpt:
          "Kyýamat güni adalat terezisini goýýarys, şonuň üçin hiç kime asla zulum edilmez. Eger bir gorçisa tohumynyň agramy bar bolsa, ony çykararys we hasapçy hökmünde ýeterlikdiris.",
      },
      {
        excerpt:
          "Terezisi agyr bolan adam bolsa, ýakymly durmuşda bolar. Scöne terezisi ýeňil bolan adam barada aýdylanda bolsa, onuň gaçybatalgasy çukur bolar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dilde ýeňil, Terezide agyr, Rehimdarlara söýgüli: SubhanAllahi wa bihamdih, SubhanAllahil-Azim.",
      },
      {
        excerpt:
          "Kyýamat güni imanlylaryň terezisinde gowy häsiýetden has agyr zat ýok. Hakykatdanam, gowy häsiýetleriň biri agyz bekleýän we doga edýän adamyň derejesine ýetýär.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Jogapkärçilik (Hisab)",
    summary: "Ansat hasaplamak, jikme-jik hasaplamak we başgalara bergiler.",
    body: [
      "“Hisab”, her bir adam öz durmuşy üçin jogap bermäge çagyrylanda hasaplanýar. Gurhan munuň iki dürli tejribesini suratlandyrýar: 'Sag elinde ýazgy berlen adama aňsat hasap bilen höküm ediler we halkyna bagtly gaýdyp geler; emma arkasynda ýazgy beren biri heläkçilige çagyrar '(Gurhan 84: 7–11). \"Easyeňil hasap\", synagyň ýoklugy däl-de, rehimdarlykdyr - Pygamberimiz, sorag bermegiň intensiwliginiň özi bir jeza diýip duýduryş berdi.",
      'Pygamberimiziň öz aýaly esasy tapawudy gürrüň berýär. Aýşa oňa: "Kim jogapkärçilige çekilse, heläk bolar" -diýdi. Aýal: Allahöne Allah: "Oňa aňsat hasap bilen höküm ediler" diýmeýärmi? Ol: \'Bu diňe amallaryň görkezilmegi; emma hasapdan kim sorag edilse ýok ediler \'(Sahih al-Buhari 6537). Şeýlelik bilen, imanlynyň umydy ähli barlaglardan gutulmak däl-de, eýsem amallaryny görkezmek, günäleriniň üstüni ýapmak we bagyşlanmakdyr.',
      "Karz kategoriýasy bar, hatda Allanyň bagyşlamagy-da ýok etmeýär: beýleki adamlaryň hukuklary (huquq al-'ibad). Pygamber alaýhyssalam: «Kimiň bankrotdygyny bilýärsiňmi?» Diýip sorady. Diýdiler: Puly ýok biri. Ol: 'Ymmatymyň weýran bolmagy kyýamat güni doga, agyz beklemek we haýyr-sahawat bilen gelýän, ýöne birini kemsidip, birine töhmet atan, başga biriniň baýlygyny alyp, başga biriniň ganyny döken adamdyr, şonuň üçin ýagşy işleri olara berilýär we ýagşy işleri günäleri gutaranda, oda taşlanýar' (Sah). Ybadat adalatsyzlygy ýatyrmaýar; diňe adalatsyzlygy çözmek bolýar.",
      "Amaly netije gyssagly we anyk: tölenmedik bergiler, ogurlanan baýlyklar, töhmetler we döwülen ynamlar bu durmuşda dogry bolmaly - Allaha toba etmek we öwezini dolmak we adamlardan ötünç soramak - sebäbi häzirki döwürde ýagşy amallaryň walýutasyna garanyňda pul we pespällikde ýerleşmek has arzandyr. Bularyň hemmesinde Allanyň adalaty kämildir we rehimdarlygy çyn ýürekden we toba edenleriň hemmesini öz içine alýar.",
    ],
    quran: [
      {
        excerpt:
          "Recordazgysyny sag eli bilen berlen adam barada aýdylanda bolsa, oňa aňsat hasap berler we bagtyna halkyna gaýdyp geler. Hisöne arkasyna ýazgy berlen adam weýrançylyk üçin aglar we oda girer.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim jogapkärçilige çekilse ýok ediler. Aýşa: Allatagala aňsat hasap bilen höküm ediler diýmeýärmi? Ol: Bu diňe amallaryň görkezilmegi; emma kim hasabyndan sorag edilse, ýok ediler.",
      },
      {
        excerpt:
          "Kimiň bankrotdygyny bilýärsiňizmi? Kyýamat gününe doga, agyz beklemek we haýyr-sahawat bilen gelen, ýöne başgalary kemsidýän, töhmet atan we zulum eden adamdyr - şonuň üçin ýagşy işleri olara berilýär, günäleri gutaranda oňa ýüklenýär we oda taşlanýar.",
      },
    ],
    actions: [
      "Karzlary üzüň we bellenen gün gelmezden ozal adalatsyz alnan zatlary yzyna gaýtaryň.",
      "Söz, baýlyk ýa-da mertebe bilen ýalňyşan adamyňyzdan gözläň we ötünç soraň - indi dikeltmek şol wagtky dikeldişden has arzandyr.",
      "Allaha bergisi bolan hukuklary üçin toba ediň we iki kitaby - ylahy we ynsany aýdyň saklaň.",
    ],
    appLinks: [{}],
  },
  {
    title: "Howuz (Hawd)",
    summary: "Pygamberiň basseýni - kim içýär we kim ýüz öwürýär.",
    body: [
      "Hawd, Muhammet pygambere Kyýamat güni berlen beýik howdan, suwsuz ymmatyna şol yssy, ýadaw günde rehimdarlykdyr. Onuň beýany köp we ygtybarly: 'My Hawd bir aýlyk ýol; suwy süýtden ak, hoşboý ysy muskadan has süýji, käseleri asman ýyldyzlaryna meňzeýär. Ondan kim içse, ýene suwsamaz '(Sahih al-Buhari 6579). Hawd-e ynanmak, köpçülikleýin habarlar arkaly döredilen sünni mezhebiniň bir bölegidir.",
      "Pygamberimiziň özi öz yzyna eýerijileri kabul eder: 'Men seniň öňüňde Hawd şäherine bararyn we meniň ýanyma gelenleriňe gözegçilik ederin' (Sahih Musulman 2292). Ymmatlaryny taharet yzlaryndan ýüzlerine, ellerine we aýaklaryna ýagtylyk bilen tanaýar. Oňa ýetmek baky söndürilmeli; Al-Kawthar tarapyndan Allatagalanyň pygamberine Jennetde beren derýasy dogry düşünilýär.",
      "Käbirleri Hawd-den kowular. Pygamber alaýhyssalam käbir adamlara: «Olar senden däl; seniň yzyňdaky dini üýtgetdiler we üýtgetdiler 'ýa-da yzyndan yza gaýdyp geldiler. Alymlar muňa seresap bolýarlar: bu hadysdaky aýry-aýry kategoriýalara degişlidir - meselem, dinden çykmak we gabyrlamak, anyk görkezmeden soň dinde bilgeşleýin täzelik etmek - ýönekeý musulmanlaryň birek-birege aýyplamalary ygtyýarlyk däl. Hawd üçin ygtybarly ýol, sünneti saklamak, tahareti we namazy goramak we imanlylaryň agzybirligini saklamakdyr.",
    ],
    hadith: [
      {
        excerpt:
          "“Hawd” bir aýlyk ýol. Suwy süýtden has ak, hoşboý ysy muskadan has süýji, käseleri asmanyň ýyldyzlary ýaly köp. Ondan kim içse, indi suwsamaz.",
      },
      {
        excerpt:
          "Seniň öňüňde Hawd-e ýeterin we meniň ýanyma gelenleriňe syn ederin. Käbir adamlar menden aýrylar, menem aýdaryn: Lorda Reb, ýoldaşlarym! Aýdylar: Sizden soň näme täzelik edendigini bilmeýärsiňiz.",
      },
    ],
    disclaimer:
      "Hawd-den ýüz öwürenler baradaky hasabatda, esasan, dinden çykmak we dinde düýpli täzelikler bolan hadysda agzalan aýratyn kategoriýalara degişlidir. Musulmanlar üçin biri-birini azaşdyrmak üçin ygtyýarnama däl.",
  },
  {
    title: "Köprü (Sirat)",
    summary: "Jähennemden geçmek - amallara we rehimlere görä tizlik.",
    body: [
      "Sirat, dowzahyň depesine uzalyp gidýän köpri bolup, her bir adam üstünden geçmeli - imanly we kapyr. Gurhan bu geçelgäni kadadan çykarman tassyklaýar: 'Siziň hiç biriňiziň oňa geljekdiginden başga hiç kim ýok. Bu gutulgysyz karar berlen Perwerdigäriňize degişlidir. Şonda Allany ýada salýanlary halas ederis we günäkärleri dyza çökeris '(Gurhan 19: 71–72). Geçiş ähliumumydyr; Uzak tarapa howpsuz gelmek hemme zat we Alla ony goraýanlara berýär.",
      "Geçiş usuly, getiren amallary bilen kesgitlenýär. Pygamberimiz muny şeýle düşündirdi: 'Köpri dowzahyň üstünde goýlar ... we birinjiňiz ýyldyrym ýaly, soň ýel ýaly, soň guşlar ýaly, soň ylgaýan adam ýaly - amallaryna görä geçersiňiz, Pygamberiňiz köpriniň üstünde durup: Lorda Reb, olary gora, howpsuz sakla. Käbirleri ýaralanman halas edilýär, käbiri dyrnaçaklanýar we käbirleri oda taşlanýar '(Sahih al-Buhari 6573). Şol hasabatda köpriniň gapdalynda ygtybarlylyk (amanah) we garyndaşlyk gatnaşyklary dur - bu ynamlara we maşgala gatnaşyklaryna wepalylygyň hakykatdanam bir adama ýol açýan ajaýyp keşbi.",
      "Siratda ýagtylyk we tizlik bu durmuşda gazanylýar. Wagtynda ýerine ýetirilen doga, yzygiderli berilýän haýyr-sahawat, amallarda dogruçyllyk we gowy häsiýet, aslynda biriniň geçýän ýeri we yşygy bolýar. Pygamberimiz ol ýerdäki imanlylar üçin şepagat eder we Allanyň rahmeti bilen her kim başga tarapa ýeter.",
      "Beýleki göze görünmeýän stansiýalarda bolşy ýaly, paýhasly ýol köpriniň fiziki ölçegleri - wahyýyň aýdýanlaryndan has inçe, näderejede ýiti, näçe wagt hakda pikir etmek däl-de, tutuşlygyna geçişi ýagtylandyrýan hereketlere gönükdirmekdir. Surat edip bilmeýän zadyňyz, henizem taýýarlanyp bilersiňiz.",
    ],
    quran: [
      {
        excerpt:
          "Oňa gelmekden başga hiç biriňiz ýok. Bu gutulgysyz karar berlen Perwerdigäriňize degişlidir. Şonda Allany ýada salýanlary halas ederis we günäkärleri dyzlaryna çökeris.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Köpri dowzahyň üstünde gurlar we men ilkinji bolup geçerin. Adamlar amallaryna görä geçerler - ýyldyrym, şemal, guşlar, ylgaýan adam ýaly - men bolsa: Lorda Reb, olary gora, howpsuz sakla. Käbirleri halas edildi, käbiri dyrnaçaklandy we käbirleri oda düşdi.",
      },
    ],
    actions: [
      "Bäş namazy wagtynda doga ediň - doga köpriniň üstünden geçýän yşykdyr.",
      "Az mukdarda hem bolsa haýyr-sahawat beriň.",
      "Garyndaşlyk gatnaşyklaryny saklaň we ynamyňyzy goraň - hadysda Siratyň ýanynda durýarlar.",
    ],
  },
  {
    title: "Jennet",
    summary: "Baky sylag - bagty we ilkinji nobatda Allany görmek.",
    body: [
      "Jannah, Allanyň imanlylar üçin taýýarlan baky öýi, hyýal edip bolmajak hakykat. Pygamber alaýhyssalamyň mukaddes hadysda Allatagalanyň bu hakda şeýle diýendigini aýdýar: 'Dogruçyl bendelerime hiç bir göz görmedik, gulak eşitmedik we adam ýüregi hiç wagt pikir etmedik' (Sahih al-Buhari 3244). Derýalar, baglar, köşkler we ýoldaşlyk Gurhanda ýüregi çekmek üçin beýan edilýär, ýöne beýanylar, olardan doly şatlygy görkezýär.",
      "Rewardhli sylaglaryndan iň ulusy haýsydyr bir bag ýa-da derýa däl-de, Allanyň razylygy we Faceüzüni görmekdir. 'Şol gün ýüzleri parlak bolup, Rebbine sereder' (Gurhan 75: 22-23) - Ahl al-Sünnetiň imanlylar ahyretde Allany görýändiklerine, Jennetiň täji bagtyna, Onuň beýikligine laýyk we ýaradylyşyna meňzemeýän görnüşde düşünerler. Allatagala wada berýär: 'goodagşylyk edenler üçin iň gowy sylag we has köp sylagdyr' (Gurhan 10:26) we has köp zat asyl hadysda asylly aceüzüniň görüşi hökmünde düşündirilýär.",
      "Jennete girmek, Allanyň rahmeti bilen, iman we dogruçyl amallar arkaly kabul edilýär - ikisi hiç haçan garşy çykmaýarlar: rehimdarlyk sebäpdir, amallar Allanyň oňa baglaýan alamatydyr. Ahyrýet güni, Jennet halky üçin hiç wagt öçmejek we gutarmaýan bagt bilen tamamlanýar. Bu modul, Jennete bolan bejergisini maksatly saklaýar; Jannah syýahatynyň doly gollanmasy derwezelerini, derejelerini, oňa alyp barýan işleri we çuňňur dilegleri öz içine alýar.",
    ],
    quran: [
      {
        excerpt:
          "Dogruçyllar üçin taýýarlanan asman we ýer ýaly giň bir Perwerdigäriňizden bagyşlaň.",
      },
      {
        excerpt: "Şol gün ýüzleri parlak bolup, Rebbine sereder.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allatagala şeýle diýýär: Men dogruçyl bendelerime hiç bir göz görmedik, gulak eşitmedik we hiç bir ynsan ýüreginiň pikir etmedik zadyny taýýarladym.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Jähennem",
    summary: "Hakyky duýduryş - hakyky jeza we diri wagtyňyz gaçmagyň gapysy.",
    body: [
      "Jahannam, erbet pikir üçin nyşan ýa-da metafora däl-de, hakyky jeza mekanydyr. Oňa ynanmak, görünmeýänlere we Allanyň adalatyna ynanmagyň bir bölegidir. Gurhan aç-açan duýduryş berýär: \"Çünki Rebbine iman etmedikler dowzahyň jezasydyr, barmaly ýeri betbagtdyr\" (Gurhan 67: 6). Onuň agyrlygy bilesigelijiligi kanagatlandyrmak üçin däl-de, oýanmak üçin suratlandyrylýar: 'fuelangyjy adamlar we daşlar bolan ot' (Gurhan 2:24), Allanyň emr eden zatlaryna boýun egmeýän berk perişdeler tarapyndan goralýar.",
      "Bu duýduryşlaryň maksady gizlenen rehimdir. Ulumsylygy bozmak, hakykaty yzygiderli ret etmegi we adamy giç bolmazdan yzyna öwürmek üçin bar. Şonuň üçin Gurhanda berlen duýduryşlar hemişe diýen ýaly açyk toba gapylary bilen jübütlenýär - Ody suratlandyrmagyň nokady, adamlar henizem mümkin boldugyça olardan gaça durmak üçin. Onuň jezasy adalatly: anyk görkezmä garşy tutanýerli saýlamagyndan başga hiç kim girmeýär we Allah hiç kime zulum etmeýär.",
      "Günäleri göterýän imanlylar üçin sünni mezhebine ynanmak gorky bilen umyt arasyndaky deňagramlylykdyr: günäkär Allanyň islegine görä - bagyşlap ýa-da otda arassalap biler, soň bolsa öň beýan edilen şepagat we rehimdarlyk bilen hatda iman atomy bolanlaryň hemmesini çykaryp biler. Bu modul dowzaha bilkastlaýyn gysga we ölçenen bejergi berýär. Duýduryşlaryny, esasy günälerini we toba we rehimdarlygyň giň gapylaryny has içgin öwrenmek Jahannam düşüniş modulynda we oňa degişli akida temalarynda tapylýar - elmydama umyt bilen çemeleşilýär, hiç haçan umytdan düşmeýär.",
    ],
    quran: [
      {
        excerpt: "Perwerdigärlerine iman etmedikler üçin dowzahyň jezasydyr.",
      },
      {
        excerpt:
          "Aýt: Eý, gullarym, özlerine garşy hyýanat edenler, Allanyň rahmetinden umytdan düşmäň. Hakykatdanam, Allatagala ähli günäleri bagyşlaýar. Hakykatdanam, bagyşlaýjy we rehimdardyr.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Hasaplamazdan kim girýär?",
    summary: "Jikme-jiklikden aýlanyp geçýänlere hakyky hadys - ylmy pikir alyşma.",
    body: [
      "Ahyrzaman gününiň merhemetleriniň arasynda bu ymmatyň bir topary jennete girýär. Pygamber alaýhyssalam aýtdy: «Ymmatymyň ýetmiş müňi jennete girmez, başga bir söz bilen aýdylanda, her müň ýetmiş müň adam bilen jennete girer». Ionsoldaşlar kimdigi bilen gyzyklananda, olary şeýle suratlandyrdy: 'Olar beýlekilerden ruqýa gözlemeýän, erbet zatlara ynanmaýan, seresaplylygy ulanmaýan we Rebbine bil baglaýanlardyr' (Sahih al-Buhari 6541).",
      "Bu düşündirişiň ýüregi tawakkul - çuňňur, Allaha bil baglamak - yrymlardan we sebäplere aladalanmakdan azatlykdyr. Rugsat berlen bejergini gözlemegi ýazgarmaýar; Özünden okalýan ruqýa we kanuny lukmançylyk ikisi hem sünnetde döredilýär. Alkyş edilýän zat, Allaha bil baglaýan adam, ruhy jadygöýligi üçin başgalardan ýalbarmak ýa-da alamatlara ýapyşmak bilen meşgullanmaýan adamdyr.",
      "Alymlar bu sanyň özi barada pikir alyşýarlar: käbirleri ýetmiş müň adamyň sözme-sözdigini, beýlekileriň goşmaça hasabatlar bilen köpelendigini, beýlekileriň bolsa belli bir hasap däl-de, Allanyň merhemetiniň boljagyny aňladýandygyny aýdýarlar. Olaryň ylalaşýan zatlary esasy hakykat - Allanyň rehim-şepagaty, buhgalter hasabatynyň garaşyşlaryndan has ýokarydyr we ahyrky gutulyş şol rehimdarlykdyr.",
      "Bu, ýaltalyk üçin kemçilik däl, umyt stansiýasy. Mömin adamy henizem ybadat edip ýörkä, Allaha hakyky bil baglamaga we yrymlardan uzaklaşdyrmaga ruhlandyrýar. Hiç kim amallary äsgermezlik edip gazanmaýar; biri özüne çekijilik we gorky däl-de, Allaha berk ýürek, ynam we ýürek bilen çekilýär.",
    ],
    hadith: [
      {
        excerpt:
          "Ymmatymyň ýetmiş müňi jennete girmezden girer: beýlekilerden rukýa gözlemeýän, erbet zatlara ynanmaýan, seresap bolmaýan we Rebbine bil baglaýanlar.",
      },
    ],
    disclaimer:
      "Alymlar “hasaplamazdan” kesgitlenen ýetmiş müň ýa-da has uly, jedelsiz san diýmek bilen tapawutlanýar. Hemmeler gutarnykly gutulyşyň Allanyň rahmeti bilen bolýandygyna we munuň amallary äsgermezlik üçin däl-de, umyt üçin sebäp bolandygy bilen ylalaşýarlar.",
  },
  {
    title: "Soňky güne taýýarlyk",
    summary: "Amaly ybadat - her bir endigi Allah bilen duşuşygyňyz bilen baglanyşdyryň.",
    body: [
      "Bütin syýahaty - ölüm, gabyr, alamatlar, surnaý, ýygnanyşyk, ýazgylar, Terez, hasap, köpri we iki öýden geçensoň, ýeke-täk akylly jogap taýýarlanmakdyr. Emma taýýarlyk howsala däl. Pygamberimiz his sahabalaryny hiç wagt gorkuzmady we ysmaz etdi; işlemegini goýdy. Bularyň hemmesiniň düýbi taňry we yhlasdyr (yhlas): amal diňe Allaha we sünnetine laýyklykda edilende kabul edilýär, şonuň üçin has köp amal goşmazdan ozal bar bolanlaryňyzyň aňyrsyny arassalaň.",
      "Terezide agyr ýazylan tekstleri sütünleriň üstünde guruň. Namaz wagtynda labyr we Siratyň çyrasydyr. Gurhan - her gün birnäçe aýat okalýar, eşidilýär we pikirlenýär - ýüregi janlandyrýar. Tawbah ýazgyny arassalaýar: 'Eý imanlylar, çyn ýürekden toba edip Allaha ýüz tutuň' (Gurhan 66: 8). Haýyr-sahawat baýlygy arassalaýar we sadaqah jariýa ýaly ömrüňi dowam etdirýär. Dikr, dilde ýeňil sözler bilen Terezini agyr saklaýar. Pygamberimiz bolsa gowy häsiýet, Terezide goýlan iň agyr zatdyr.",
      "Pygamberimiziň Jennete gönüden-göni baglanan iki zady - dil we päkligi (Sahih al-Buhari 6474) goraň - sebäbi bu, agyr günälerden başga-da, ýazgylary ýuwaşlyk bilen doldurýar ýa-da bozýar. Adamlaryň hukuklaryny henizem çözüp bilersiňiz: bergileri töläň, alnan zady yzyna gaýtaryň, zyýan üçin ötünç soraň we her bir işde adalatly boluň, şonuň üçin doga-dileg edenleriň talaplary bilen iýilýän 'bankrot' bolup bilmersiňiz.",
      "Hemme zat bir niýetden ugur alýar, Sahyh al-Buharynyň ilkinji hadysynda: 'Hereketler diňe niýet bilen.' Munibiň yzarlaýjylaryny bäsdeşlik etmek üçin bal hökmünde däl-de, bu endikler - doga, Gurhan, dikr, haýyr-sahawat, toba etmek üçin ulanyň - hersi ýuwaşlyk bilen günüňizi Allah bilen duşuşmaga gönükdirýär. Wholehli maksat: indi Onuň öňünde durmaga hakykatdanam garaşýan biri hökmünde ýaşamak.",
    ],
    quran: [
      {
        excerpt: "Jynlary we adamzady Maňa ybadat etmekden başga ýaratmadym.",
      },
      {
        excerpt:
          "Eý iman edenler, çyn ýürekden toba edip Allaha ýüz tutuň. Perhapshtimal, Perwerdigäriňiz ýalňyşlyklaryňyzy aýyrar we derýalaryň aşagyndaky baglara kabul eder.",
      },
    ],
    hadith: [
      {
        excerpt: "Hereketler diňe niýet bilen bolýar we her bir adamda diňe islän zady bolar.",
      },
      {
        excerpt:
          "Kim maňa eňeginiň arasyndaky, aýaklarynyň arasyndaky zady - dili we päkligini kepillendirýän bolsa, men oňa Jennet kepillendirýärin.",
      },
    ],
    actions: [
      "Gündelik bäş namazy wagtynda okaň.",
      "Gurhany her gün okaň ýa-da diňläň - hatda birnäçe aýat.",
      "Ertir we agşam adhkar saklaň.",
      "Haýyr-sahawat işini yzygiderli beriň, hatda az mukdarda.",
      "Her gün toba ediň we çyn ýürekden bagyşlaň.",
      "Dili we päkligi goraň we her wadany we ynamy saklaň.",
      "Maşgala, goňşulara we karz berijilere berlen hukuklary ýerine ýetiriň.",
      "Doga journalurnalyňyzda huşu we niýetiň yhlasy hakda pikirleniň.",
    ],
    appLinks: [{}, {}, {}, {}, {}, {}],
  },
];

export const LAST_DAY_HADITH_TK: DeepPartial<LastDayHadithEntry>[] = [
  {
    hadith: {
      excerpt: "Köplenç lezzetleri ýok ediji - ölümi aňladýar.",
    },
    context:
      "Ölümi yzygiderli ýatlamak ýüregi ýumşadýar, gahar-gazaby ýok edýär we umytsyzlygy artdyrmazdan ileri tutulýan zatlary düzedýär.",
  },
  {
    hadith: {
      excerpt:
        "Allanyň iň gowusyny göz öňünde tutup, Rebbiniň rehim-şepagaty hakda gowy pikir etmekden başga hiç biriňiz ölmeli dälsiňiz.",
    },
    context:
      "Çyn ýürekden iman, toba we Alladan gowy garaşmak bilen gowy gutarmak (husn al-hatima) umyt edilýär.",
  },
  {
    hadith: {
      excerpt: "Mazar ýa-da Jennet baglaryndan bir bag ýa-da Ot çukurlaryndan çukur.",
    },
    context:
      "Barzak, Allanyň hikmeti bilen gabyrda sylag ýa-da jeza öz içine alýar - gabyr adamyň eden işlerini görkezýär.",
  },
  {
    hadith: {
      excerpt:
        "Merhum jaýlananda, iki perişde gelip, ondan Rebbi, dini we pygamberi hakda sorag edýärler.",
    },
    context:
      "Mazardaky soraglar hakyky habarlarda tassyklanýar; bu rowaýatda iki perişdäniň ady Munkar we Nakir.",
  },
  {
    hadith: {
      excerpt:
        "Adam ölse, amallary üçden başga gutarýar: dowam edýän haýyr-sahawat, peýdany alýan bilim ýa-da onuň üçin dileg edýän dogruçyl çaga.",
    },
    context: "Merhumyň peýdasyna dowam edýän zat - sahih hadysda.",
  },
  {
    hadith: {
      excerpt:
        "Arealaňaç, ýalaňaç we sünnetsiz ýygnanarsyňyz - kyýamat güni ilkinji geýinjek Ybraýym bolar.",
    },
    context: "Atherygnan güni kiçigöwünlilik; Allatagala islänine hormat goýýar.",
  },
  {
    hadith: {
      excerpt:
        "Gün kyýamat güni adamlara bir mil çemesi aralykda ýakynlaşar we amallaryna görä derlerine gark bolar.",
    },
    context: "Mahşar şertleri - agyrlyk hakyky rowaýatlardaky amallara görä üýtgeýär.",
  },
  {
    hadith: {
      excerpt:
        "Adamlar meniň ýanyma gelerler we men Allanyň öňünde seatedde ederin we şeýle diýiler: Kelläňizi galdyryň; soraň we size berler, şepagat ediler we şepagatyňyz kabul ediler.",
    },
    context: "Iň uly şepagat - Pygambere mahsus bolan al-Shafa'ah al-Udhma.",
  },
  {
    hadith: {
      excerpt:
        "Kim jogapkärçilige çekilse ýok ediler. Aýşa sorady: Allatagala aňsat hasap bilen höküm ediler diýmeýärmi? Ol: Bu diňe amallaryň görkezilmegi; emma kim hasabyndan sorag edilse, ýok ediler.",
    },
    context:
      "'Easyeňil hasap' rehimdarlykdyr - bir zadyň üsti bilen gözden geçirilmän, amallaryny görkezmek we bagyşlamak.",
  },
  {
    hadith: {
      excerpt:
        "Ymmatymyň batmagy, doga, agyz beklemek we haýyr-sahawat bilen gelen, ýöne başgalary kemsidýän, töhmet atan we zulum eden adamdyr - şonuň üçin ýagşy işleri olara berilýär we günäleri oňa ýüklenýär.",
    },
    context:
      "Adamlaryň hukuklary (huquq al-'ibad) ybadat bilen diňe ýatyrylmaýar; güni çözülmeli ýa-da tölenmeli.",
  },
  {
    hadith: {
      excerpt:
        "Ymmatymyň ýetmiş müňüsi jennete girer, hasaplamazdan: başgalardan ruqýa gözlemeýän, erbet zatlara ynanmaýan, seresap bolmaýan we Rebbine bil baglaýanlar.",
    },
    context:
      "Alymlar bu sanyň göçme manyda ýa-da Allanyň rahmetiniň has uly, jedelsiz bollygyny aňladýandygy bilen tapawutlanýar.",
  },
  {
    hadith: {
      excerpt:
        "“Hawd” bir aýlyk ýol. Suwy süýtden has ak, hoşboý ysy muskadan has süýji, käseleri asmanyň ýyldyzlary ýaly köp. Ondan kim içse, indi suwsamaz.",
    },
    context: "Howuz - suwsuzlyk güni Muhammet ymmat üçin rehim.",
  },
  {
    hadith: {
      excerpt:
        "Köprü dowzahyň üstünde goýuldy. Adamlar amallaryna görä geçýärler - ýyldyrym, ýel ýaly, guşlar, ylgaýan adam ýaly - käbiri dyrnaçaklanýar we halas bolýar, käbirleri ýykylýar.",
    },
    context: "Geçiş tizligi imany we amallary görkezýär; Allanyň rahmeti uludyr.",
  },
  {
    hadith: {
      excerpt:
        "On alamaty görýänçäňiz sagat gelmez: tüsse, Dajjal, Haýwan, günbatardan gün ýaşmagy, Merýemiň ogly Isa, ajajuj we Majuj, üç sany süýşme we adamlary ýygnanmaga iterýän ot.",
    },
    context:
      "Hudhayfah ibn Usaýddan on esasy alamat. Alymlar her alamaty tassyklaýarlar, ýöne takyk yzygiderliligi boýunça tapawutlanýar.",
  },
  {
    hadith: {
      excerpt:
        "Elimdäki janym bolan Merýemiň ogly ýakyn wagtda araňyzda adalatly hökümdar hökmünde iner; haçy döwer, doňuzlary öldürer we jizýany ýok eder, hiç kim kabul etmänkä baýlyk dolup gider.",
    },
    context: "Işanyň nesli sünni mezhebiniň berk nokady; Muhammet şerigaty bilen dolandyrýar.",
  },
  {
    hadith: {
      excerpt:
        "Ynam ýitirilende, sagada garaşyň. Soraldy: Nädip ýitiriler? Ol: Oňa mynasyp bolmadyklara ygtyýar berlende.",
    },
    context:
      "Belli kiçi alamat - ygtybarlylygy ýitirmek. Aljyraňňylyga däl-de, taýýarlyga üns beriň.",
  },
  {
    hadith: {
      excerpt:
        "Allatagala bilimleri elinden almak bilen aýyrmaýar, ýöne alymlary alyp, tä hiç kim galýança we nadanlary bilimsiz höküm çykarýan ýolbaşçy hökmünde kabul edýänçä, azaşýarlar we başgalary azaşýarlar.",
    },
    context:
      "'Bilimi ýitirmek', maglumat ýetmezçiligini däl-de, sagdyn alymlaryň we durmuş tejribesiniň ýitmegini aňladýar.",
  },
];

export const LAST_DAY_VERSES_TK: DeepPartial<LastDayVerseEntry>[] = [
  {
    excerpt:
      "Her bir adam ölümi dadyp görer we size kyýamat güni doly kompensasiýa berler. Şonuň üçin kim otdan çekilip, Jennete kabul edilse, üstünlik gazandy we bu dünýäniň durmuşy diňe aldawdan lezzet alýar.",
    context:
      "Ölüm ähliumumy we bu durmuş wagtlaýyn; hasaplaryň hakyky we ahyrky hasaplamasy diňe soňky günde bolýar.",
    tafsirSummary:
      "Bu aýat üstünligi kesgitleýär: bu ýerde baýlyk ýa-da status däl, otdan halas bolmak we ol ýerdäki Jennete kabul etmek.",
  },
  {
    excerpt:
      "Şol gün adamlar amallaryny görkezmek üçin aýratyn toparlara bölünerler. Şonuň üçin kim atomyň ýagşylygyny etse, ony görer, atomyň agyrlygyny kim etse, ony görer.",
    context:
      "Kämil we umumy adalat - iň gowy iş ýa-da erbetlik ýazylýar we ýerine ýetirijisine gaýtarylýar.",
    tafsirSummary:
      'Hiç zat sanamak üçin gaty kiçi däl. Bu aýat, "ownuk" günälerden ýüz öwürmekden ömürboýy seresaplyk we "ownuk" ýagşy amallara ömürlik höwesdir.',
  },
  {
    excerpt:
      "Kyýamat güni adalat terezisini goýýarys, şonuň üçin hiç kime asla zulum edilmez. Bir gorçisa tohumynyň agramy bolsa-da, ony çykararys we hasapçy hökmünde ýeterlikdiris.",
    context: "Mizan (Terez) hakyky we adalaty mutlak.",
    tafsirSummary:
      "Şol gün hiç kim hatda gorçisa tohumynyň agramy bilenem üýtgemez; Allanyň hasabaty kemsizdir.",
  },
  {
    excerpt:
      "Terezisi agyr bolan adam bolsa, ýakymly durmuşda bolar. Scöne terezisi ýeňil bolan adam barada aýdylanda bolsa, onuň gaçybatalgasy çukur bolar.",
    context: "Iň soňky netije, Terezide eden dogry amallarynyň agramyna öwrüler.",
    tafsirSummary:
      "Agram göwrümi däl-de, yhlas bilen gelýär - ýönekeý bir dikr, diňe şowhunly daglardan has ýokary bolup biljekdigini aýtdy.",
  },
  {
    excerpt: "Dogruçyllar üçin taýýarlanan asman we ýer ýaly giň bir Perwerdigäriňizden bagyşlaň.",
    context: "Allatagala bilen duşuşmazdan ozal ýagşylyga we bagyşlanmaga tarap göni buýruk.",
    tafsirSummary:
      "Jennet göz öňüne getirip bolmajak derejede giňdir we oňa barýan ýol howlukmak - toba we ýagşy işleri yza süýşürmek däl.",
  },
  {
    excerpt: "Şol gün ýüzleri parlak bolup, Rebbine sereder.",
    context: "Jennetiň iň uly sylagy hiç bir bag ýa-da derýa däl-de, Allanyň ýüzüni görmekdir.",
    tafsirSummary:
      "Ahl-Sünnet, imanlylaryň Rebbini ahyretde görjekdigine, Onuň beýikligine laýyk we ýaradylyşa meňzemeýän görnüşde - ähli bagtyň täji boljakdygyny tassyklaýar.",
  },
  {
    excerpt: "Perwerdigärlerine iman etmedikler üçin dowzahyň jezasydyr.",
    context: "Jähennem hakyky we adalatly netije - nyşan däl-de, hakyky mesgen.",
    tafsirSummary:
      "Duýduryş, henizem wagt bar bolsa adamy yzyna öwürmek üçin niýetlenen rehimdir; elmydama Gurhanda toba açyk gapylary bilen jübütlenendir.",
  },
  {
    excerpt:
      "Aýt: Eý, gullarym, özlerine garşy hyýanat edenler, Allanyň rahmetinden umytdan düşmäň. Hakykatdanam, Allatagala ähli günäleri bagyşlaýar. Hakykatdanam, bagyşlaýjy we rehimdardyr.",
    context: "Günä nähili uly bolsa-da, çyn ýürekden toba etmegiň gapysy ölüme çenli açyk bolýar.",
    tafsirSummary:
      "Allanyň rahmetinden umytsyzlygyň özi Şeýtandan; imanly adam, Allahyň bagyşlamagyna sarsmaz umyt bilen ot gorkusyny deňleşdirýär.",
  },
  {
    excerpt: "Kyýamatyň geljekdigine, şübhesiz, Allatagala gabyrdakylary direlder.",
    context: "Direliş möhleti gizlin bolsa-da belli.",
    tafsirSummary:
      "Sagady baradaky ynam, wagtyna näbellilik bilen jübütlenen, häzirki ahlak jogapkärçiligini hut şu.",
  },
  {
    excerpt:
      "Onuň rugsady bolmazdan, Oňa şepagat edip biljek kim? Olardan öňdäki zatlary we soňundan näme boljakdygyny bilýär we bilimlerinden islän zadyny öz içine almaýar.",
    context: "Şepagat (şefa) hakyky, ýöne Allanyň rugsadyndan garaşsyz däldir.",
    tafsirSummary:
      "Bu ýeke-täk şert - 'Onuň rugsady bolmazdan' - hakyky şepagaty her bir korrupsiýadan aýyrýan we bu durmuşda ölüleri çagyrmagy gadagan edýän zat.",
  },
  {
    excerpt:
      "Allatagalanyň zulum edýänlerinden bihabar diýip pikir etmäň. Olary diňe gözleriň elhençlik bilen seredýän güni üçin gijikdirýär.",
    context: "Ezilenlere rahatlyk - adalatyň gijikdirilmegi onuň ýoklugy däl.",
    tafsirSummary:
      "Allatagala hiç bir adalatsyzlygy ýatdan çykarmaýar; nädogry zada diňe hiç zat ünsden düşürilmeýän güne çenli rugsat berilýär.",
  },
  {
    excerpt:
      "Oňa gelmekden başga hiç biriňiz ýok. Bu gutulgysyz karar berlen Perwerdigäriňize degişlidir. Şonda Allany ýada salýanlary halas ederis we günäkärleri dyzlaryna çökeris.",
    context:
      "Siratyň üstünden geçmek ähliumumydyr; ygtybarly gelmek Allanyň rahmeti we takwasy bilen berilýär.",
    tafsirSummary:
      "Her kim geçelge gelýär; tapawut kimiň halas edilendigi we kimiň ýykylmagy - öňe iberilen iman we amallar bilen kesgitlenýär.",
  },
  {
    excerpt:
      "Sagat hakda soraýarlar: haçan geler? Aýt: Bilimi diňe Rebbimdedir. Ondan başga hiç kim wagtyny açmaz. Garaşylmadyk ýagdaýdan başga saňa gelmez.",
    context: "Takyk wagty diňe Allaha mälim - taýýarlyk işleri, çaklamalar netijesiz.",
    tafsirSummary:
      "Hatda Pygambere-de sene berilmedi; Ynsanlaryň bir ýyla ýa-da sanalmagyna bolan talaplary bu aýata ters gelýär.",
  },
  {
    excerpt:
      "Recordazgysyny sag eli bilen berlen adam barada aýdylanda bolsa: Ol: Meniň ýazgymy oka! Hasabymy görjekdigime ynanýardym. Şonuň üçin ol ýakymly durmuşda bolar.",
    context: "Kitaby almagyň usuly - sag eli ýa-da çep - özi ilkinji höküm.",
    tafsirSummary:
      "Üstünlik gazananlaryň şatlygy sylaglanan ynamyň şatlygydyr: hasaplamaga garaşyp ýaşadylar, şok däl-de, ýeňillik hökmünde gelýär.",
  },
];

export const LAST_DAY_TIMELINE_TK: DeepPartial<LastDayTimelineEvent>[] = [
  {
    title: "Bu dünýädäki durmuş",
    body: "Ynanmak, ybadat etmek we taýýarlanmak üçin gysga wagt bellendi. Bu dünýä soňky öý däl - amallaryň meýdanydyr.",
  },
  {
    title: "Ölüm",
    body: "Her bir adam ölümi dadar. Mömin, Allanyň rahmetine umyt bilen garşylaýar; biperwaýlyk ony duýdansyz we ajy edýär.",
  },
  {
    title: "Mazar",
    body: "Jynazadan soň ruh barzaga girýär. Mazar, her bir adam üçin ahyretiň birinji basgançagydyr.",
  },
  {
    title: "Barzakh",
    body: "Ölüm bilen direlişiň arasyndaky durmuş - hakyky habarlara görä sorag etmek, bagt ýa-da jeza.",
  },
  {
    title: "Ownuk alamatlar",
    body: "Pygamberimiziň beýan eden kem-kemden jemgyýetçilik we ahlak üýtgemeleri. Köp alymlar birnäçe adamyň peýda bolandygyny bellediler; takyk wagty diňe Allaha degişlidir.",
  },
  {
    title: "Esasy alamatlar",
    body: "Ahyrzamanyň golaýynda bolup geçen dramatiki wakalar - al-Mahdi, Dajjal we Isa (sallaLlahu aleýhi we sellem) hakyky hadysda gaýdyp gelmegi. Alymlaryň arasynda yzygiderlilik jikme-jiklikleri tapawutlanýar.",
  },
  {
    title: "Surnaý",
    body: "Israfil surnaý çalýar. Crearadylyş birinji partlamada ölýär we ikinjisinde direlýär.",
  },
  {
    title: "Direliş",
    body: "Tozanlardan dikeldilen jesetler; ýaradylanlaryň hemmesi Allanyň öňünde dur.",
  },
  {
    title: "Ingygnak (Mahşar)",
    body: "Allhli adamlar ýalaňaç, ýalaňaç we sünnetsiz ýygnandylar, Allanyň isleýşi ýaly, höküme garaşýarlar.",
  },
  {
    title: "Amallaryň ýazgysy",
    body: "Sag eli, çep eli ýa-da arkasy bilen berlen kitaplar. .Azga alnan zatlardan hiç zat aýrylmady.",
  },
  {
    title: "Terez (Mizan)",
    body: "Amallar ajaýyp adalat bilen ölçeldi. Agyr tereziler şatlyk getirýär; ýeňil tereziler ýitgi getirýär.",
  },
  {
    title: "Jogapkärçilik (Hisab)",
    body: "Käbirleri üçin aňsat hasaplamak; beýlekiler üçin jikme-jik sorag. Adamlara berlen hukuklar hem ünsden düşürilmeýär.",
  },
  {
    title: "Şepagat (Şafa)",
    body: "Diňe Allanyň rugsady bilen - iň ulusy Muhammet pygambere degişlidir.",
  },
  {
    title: "Howuz (Hawd)",
    body: "Pygamberimiziň ymmatynyň kyýamat güni içýän giň howzy.",
  },
  {
    title: "Köprü (Sirat)",
    body: "Her bir adam dowzahyň üstünden geçýär - tizlik iman we amallar bilen üýtgeýär.",
  },
  {
    title: "Jennet ýa-da dowzah",
    body: "Baky ýaşaýyş jaýy - Allanyň rahmeti we dogruçyl işleri bilen Janna; Jahannam hakyky duýduryş we diňe netije.",
  },
  {
    title: "Bakylyk",
    body: "Ahyretden soň ölüm ýok. Jennet halky baky bagtda galar; dowzah halky Allanyň isleýşi ýaly galar.",
  },
];

export const LAST_DAY_QUIZ_TK: DeepPartial<LastDayQuizQuestion>[] = [
  {
    prompt: "Soňky güne ynanmak şulardan biridir:",
    options: [
      "Yslamyň bäş sütüni",
      "Alty sany iman makalasy (Iman)",
      "Sevenedi asman",
      "On ýoldaş",
    ],
    explanation:
      "Iman Allaha, perişdelere, kitaplara, habarçylara, ahyret gününe we ylahy karara (kadr) ynanmagy öz içine alýar.",
  },
  {
    prompt: "Barzakh iň gowy suratlandyrylýar:",
    options: [
      "Jähennemiň üstündäki köpri",
      "Ölüm bilen direliş arasyndaky durmuş",
      "Amallaryň gerimi",
      "Surnaý çaldy",
    ],
    explanation: "Barzakh ölümden soň kyýamat gününe çenli aralykdyr.",
  },
  {
    prompt:
      "Dogry ýa-da ýalan: Alymlar sagadyň ähli esasy alamatlarynyň takyk yzygiderliligi barada ylalaşýarlar.",
    options: ["Dogry", "Sealňyş"],
    explanation:
      "Esasy alamatlar hakyky hadysda tassyklanýar, ýöne käbir jikme-jiklikler boýunça alymlar tapawutlanýar. Sagatyň wagty diňe Allaha mälimdir.",
  },
  {
    prompt: "Soňky günde Mizan (masştab):",
    options: [
      "Fiziki bedenleri ölçemek",
      "Amallary kämil adalat bilen ölçemek",
      "Gabyrda wagt ölçemek",
      "Perişdeleri sanamak",
    ],
    explanation: "Mizan amallara agram salýar - yhlas we dogruçyl hereket terezini agyrlaşdyrýar.",
  },
  {
    prompt: "Soňky günde şepagat:",
    options: [
      "Allanyň rugsady bolmazdan bolup geçýär",
      "Diňe Allanyň rugsady bilen",
      "Iman zerurlygyny çalyşýar",
      "Gurhanda inkär edilýär",
    ],
    explanation: "Gurhan 2: 255 we 20: 109 şepagatlary diňe Allanyň rugsady bilen tassyklaýar.",
  },
  {
    prompt: "Ahyret syýahatynda haýsy birinji ýerde durýar?",
    options: ["Direliş", "Ölüm", "Atherygnak", "Surnaý"],
    explanation:
      "Ölüm barzakdan, soň - alamatlardan we surnaýdan soň - direliş we ýygnanşykdan öň.",
  },
  {
    prompt: "Allah bilen duşuşmaga taýynlyk görmek üçin şu hepde haýsy endigi güýçlendirersiňiz?",
    explanation:
      "Taýýarlyk amalydyr: namaz, Gurhan, toba, haýyr-sahawat, gowy häsiýet we başgalaryň hukuklaryny ýerine ýetirmek.",
  },
  {
    prompt: "Dogry ýa-da ýalan: Gurhan 19: 71-e görä, her bir adam Siratdan geçer.",
    options: ["Dogry", "Sealňyş"],
    explanation:
      "Bu aýat hemmeleriň üstünden geçjekdigini aýdýar; Allatagalalary halas edýär. Alymlar kimiň ýykylýandygy barada jikme-jiklikleri ara alyp maslahatlaşýarlar.",
  },
];

export const LAST_DAY_REFERENCES_TK: DeepPartial<LastDayReferenceEntry>[] = [
  {
    title: "Gurhan",
    note: "Direliş, jogapkärçilik, Jennet, dowzah we ylahy adalat üçin esasy çeşme. Bu moduldaky aýatlar süre we aýatlar bilen getirilýär.",
  },
  {
    title: "Sahih al-Buhari we Sahih Musulman",
    note: "Ölüm, gabyr, alamatlar, hasap, şepagat, Hawd we Sirat üçin kanoniki hadys ýygyndylary.",
  },
  {
    title: "Sunan al-Tirmizi we Sunan Abi Dawud",
    note: "Mazar we goşmaça alamatlar barada goşmaça hakyky hasabatlar - ulanylýan ýerlerde bahalar.",
  },
  {
    title: "Ibn Katir - Tafsir",
    note: "Ahyret hakda Gurhanyň aýatlaryna nusgawy düşündiriş. Garaşsyz subutnama hökmünde däl-de, gysga tafsir gysgaça mazmuny üçin ulanylýar.",
  },
  {
    title: "Al-Akidah al-Tahawiýa",
    note: "Direlişi, gerimini, köprini, Jenneti we dowzahy tassyklaýan sünni ynançlary.",
  },
  {
    title: "Ylmy tapawutlar",
    note: "Alymlaryň tapawutlanýan ýerleri - meselem. esasy alamatlaryň yzygiderliligi, Hawd-iň jikme-jiklikleri, hasaplamazdan girýän kategoriýalar - bu modul ýeke-täk dogry pikir hökmünde bir pikiri talap etmezden tapawudy belleýär.",
  },
  {
    title: "Ylham we düşündiriş",
    note: "Açyk Gurhan we mutawatir ýa-da sahih hadyslary düşündirişli pikirlerden (ijtihad) we has gowşak rowaýatlardan tapawutlanýar.",
  },
];
