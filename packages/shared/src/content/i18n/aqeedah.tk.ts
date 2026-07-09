// Turkmen translation overlay for the Learn Aqeedah content. Mirrors the order of
// its English source in ../aqeedah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { AqeedahGlossaryTerm, AqeedahTopic } from "../../types/aqeedah";
import type { DeepPartial } from "./localize";

export const AQEDAH_TOPICS_TK: DeepPartial<AqeedahTopic>[] = [
  {
    title: "Giriş",
    summary: "Aqida, ybadaty, häsiýeti we maksady emele getirýän imanyň esasydyr.",
    body: [
      "Aqeedah (عقيدة) sözi berk baglamak ýa-da baglamak manysyndan gelip çykýar - bu bir musulmanyň ýüregiň olara baglydygyna, şübhelenmezden, ynanjyna baglydyr. Meşhur Jibril hadysynda Pygamberimiz ony alty ynanç hökmünde jemledi: Allatagalada, perişdelerinde, kitaplarynda, habarçylarynda, ahyret güni we ylahy karar (kadr), ýagşy we ajy.",
      "Sünni musulmanlaryň esasy akymy bolan Ahl al-Sünnet wa'l-Jama'a üçin ynanç ilki Gurhandan, soňra bolsa Pygamberimiziň sahabalarynyň we ilkinji nesilleriniň (salaf) düşünýän hakyky sünnetidir. Akyl nirede ulanylsa, ylhamy ýerine ýetirmek däl-de, hyzmat edýär.",
      "Akida abstrakt seminar temasy däl; ähli ybadatlaryň we häsiýetleriň ösýän kökidir. Adamyň Allanyň kimdigi, näme üçin ýaradylandygy we nirä barýandyklary baradaky ynançlary, nädip doga edýändiklerini, başgalara nähili garaýandyklaryny we kynçylyklara we ölüme nähili duş gelýändiklerini ýuwaşlyk bilen dolandyrýar.",
      "Dogry ynanç ýüregi beýik ybadat ýagdaýlary - söýgi we gorky, umyt we gorky, bil baglamak we tagalla etmek, minnetdarlyk we toba etmek arasynda deňagramlylygy saklaýar - şonuň üçin bir imanly Allanyň rahmetinden umytdan düşmez ýa-da jogapkärçiliginden özüni arkaýyn duýmaz.",
    ],
    quran: [
      {
        excerpt:
          "Dogrulyk, Allaha, ahyret gününe, perişdelere, kitaba we pygamberlere iman etmekdir ...",
      },
      {
        excerpt:
          "Eý iman edenler, Allaha, Resulyna, Resulyna iberen kitabyna we ozal iberen ureazgylaryna iman ediň.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Iman Allaha, perişdelerine, kitaplaryna, pygamberlerine, ahyret gününe we ylahy karara, ýagşylygyna we ajylygyna ynanmalydyr. (Jibriliň hadysy, Umar rowaýat edipdir)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Akida näme?",
    summary: "Akida filosofiýa synpy däl; ylhamdan kök uran ynamdyr.",
    body: [
      "Akida, ýüregiň ynam bilen tassyklaýan zady, ybadatda we özüni alyp barşynda görkezýän zat - diňe jedel üçin ýatda saklanan teoriýa däl. Gurhan, esasly imanlylary wahyý hakda aýdýanlar hökmünde suratlandyrýar: 'Biz muňa ynanýarys; bularyň hemmesi Rebbimizden gelýär (3: 7): aýdyň zatlara boýun bolýarlar we görünmeýän zatlary Allaha tabşyrýarlar.",
      "Ilkinji alymlar bu aýdyňlygy saklamak üçin - adaty imanlylary iki howpdan goramak üçin takyk ynanç tekstlerini (al-Akidah al-Tahawiýa ýaly) ýazypdyrlar: dine goşant goşýan ulaltmak we Allanyň tassyklaýan zatlaryny inkär etmek.",
      "Ahl-Sünnetiň içinde ykrar edilen ylahyýet mekdepleri bar - esasanam Atari, Aşari we Maturidi çemeleşmeleri - käbir meseleleri beýan etmegiň käbir tehniki usullary, esasanam ylahy sypatlar bilen tapawutlanmak bilen imanyň esaslary barada doly ylalaşýarlar. Olaryň umumy binýady bir we berkdir: Allanyň mutlak birligi, wahýynyň dogrulygy we ahyretdäki hakyky jogapkärçiligi.",
      "Şonuň üçin akida janly ynanç hökmünde has gowy öwrenilýär: her bir ynanç nokady ybadat, özüni alyp barmak we rahatlyk çeşmesine baglanýar.",
    ],
    quran: [
      {
        excerpt: "Bilimi berk bolanlar: 'Biz muňa ynanýarys. Bularyň hemmesi Rebbimizden. '",
      },
    ],
    actions: [
      "Akedany sosial-media jedellerinden däl-de, ygtybarly alymlardan we başlangyç tekstlerden öwreniň.",
      "Öwrenýän her bir ynanjyňyz üçin soraň: bu meniň ybadat etmegimi we ýaşaýşymy nädip üýtgedýär?",
    ],
  },
  {
    title: "Akida näme üçin möhüm?",
    summary: "Ses ynanjy ruhy durnuklylygy üpjün edýär we aşa aşa goraýar.",
    body: [
      "Ynam dogry we çözülende amallar yhlasly we durnukly bolýar; ynanç titrese, ybadat durnuksyz bolýar, diňe duýgy döredýär ýa-da isleg we şübhe bilen aňsatlyk bilen sarsýar. Allatagala, bu durmuşda, gabryň we ahyretiň elhenç pursatynda 'berk söz bilen iman edenleri berk tutjakdygyny' wada berýär.",
      "Dogry ynanç, imanlyny durmuşyň ähli çäginde göterýän zatdyr: kynçylyk wagtynda Allanyň kararyna ynamly bolmagy, bereketde kiçigöwünliligi we näbellilik we ölümiň öňünde rahatlygy öwredýär. Kadra we ahyretine çyn ýürekden ynanýan adam synag edilende ýykylmaz.",
      "Netijede, akydah adab - oňat gylyk-häsiýeti ylalaşmazlygy öwredýär: yhlasly alymlaryň köpden bäri tapawutlanýan ikinji derejeli meselelerinde hormat we saklanmak bilen bir hatarda aýdyň esaslara berk ýapyşmagy öwredýär. Ynamy bilmek, kiçigöwünliligi we rehimdarlygy artdyrmalydyr, hiç haçan ulumsylyk etmeli.",
    ],
    quran: [
      {
        excerpt: "Allah dünýä durmuşynda we ahyretde berk söz bilen iman edenleri berk saklaýar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Size peýdaly boljak zatlara höwes ediň, Alladan kömek soraň we ejiz bolmaň ... (Abu Hureýra)",
      },
    ],
  },
  {
    title: "Imanyň alty makalasy",
    summary: "Pygamberimiz imany alty sany esasy ynançda jemledi.",
    body: [
      "Alty makala Yslamyň iň möhüm hadyslaryndan biri bolan Jibriliň hadyslaryndan gelýär. Jibril perişde adam görnüşinde gelip, Pygamberden sahabalardan Yslam, iman we ihsan hakda sorag berdi. Pygamberimiz iman hakda soranlarynda, bu alty ynanç bilen jogap berdi we Jibril ony tassyklady, soň bolsa halka öz dinini öwretmek üçin geldi.",
      "Alty: Allaha ynanmak; perişdelerinde aýan edilen kitaplarynda; pygamberlerinde ahyret güni; we ylahy kararda, ýagşy we ajy. Olaryň haýsydyr birini ret etmek hakyky imanyň daşynda bolmak, sebäbi olar bir mata.",
      "Şeýle hem olar çuňňur baglanyşyklydyr. Kitaplara we habarçylara ynanmak, ahyret gününi we hasaplary bilmeklige alyp barýar; ahyret gününe bolan ynam her bir işe ähmiýet berýär; we kadrlara ynanmak, hikmetiniň öňünde Allaha bil baglamagy we kiçigöwünliligi öwredýär. Olary öwrenmek üçin aýdyň we deňagramly dünýägaraýyş döredýär.",
    ],
    hadith: [
      {
        excerpt:
          "... Allaha, perişdelerine, kitaplaryna, pygamberlerine, ahyret gününe ynanýandygyňyzy we buýruga, onuň gowy we ajydygyna ynanýarsyňyz. (Jibriliň hadyslary)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Allaha ynanmak",
    summary:
      "Allaha ynanmak Onuň hökümdarlygyny, ybadat etmekdäki ýeke-täk hukugyny, atlaryny we sypatlaryny öz içine alýar.",
    body: [
      "Allaha ynanmak ähli ynançlaryň iň ulusy we galanlaryň kökidir. Everythinghli zadyň Creatoraradyjysy, eýesi we goldawçysy - ýeke-täk hakyky Hudaý, hiç hili şärigi, deňi-taýy ýok we ýaradylyşyna hiç hili zerurlyk ýokdugy bilen başlaýar.",
      "Netijede, diňe özi her görnüşde ybadat etmäge mynasypdyr: doga, dileg, umyt, gorky, bil baglamak, iň ýokary manyda söýgi, gurbanlyk we wadalar, Alladan başga hiç kime gönükdirilip bilinmeýän ähli hukuklardyr. Bu 'Alladan başga hudaý ýok' şaýatlygynyň manysy.",
      "Ahl-Sünnet, Allanyň özi üçin tassyklan ajaýyp atlaryny we belent sypatlaryny, Resulynyň bolsa Özüniň beýikligine laýyk gelýän görnüşde - Ony ýaradylyşy (tamthil) bilen deňeşdirmezden we many sypatlaryny inkär etmezden ýa-da boşatmazdan tassyklaýar. Guolbaşçy aýat: 'Oňa meňzeş zat ýok, Ol hem eşidýän, hemme zady görýän' (42:11) - ikisiniň hem meňzeşligini inkär edýär we eşidişini we görýändigini tassyklaýar.",
      "Allany Öz atlary bilen tanamak - Iň rehimdar, hemme zady bilýän, hemişe ýaşaýan, patyşa, bagyşlaýjy - ýüregiň iýmitidir: Ony näçe köp tanasaňyz, şonça-da söýýärsiňiz, gorkýarsyňyz we Oňa ýüzlenýärsiňiz.",
    ],
    quran: [
      {
        excerpt:
          "Aýt: Ol Allatagaladyr ... Ol ne dünýä inýär, ne-de dünýä inýär, hem-de Oňa deňeşdirip boljak zat ýok.",
      },
      {
        excerpt: "Iň owadan atlar Allaha degişlidir, şonuň üçin Oňa ýüz tutuň.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Perişdelere ynanmak",
    summary: "Perişdeler, Allanyň hiç wagt Oňa gulak asmaýan gullarydyr.",
    body: [
      "Perişdeler (mala'ikah), ýagtylykdan ýasalan giň ýaradylyşdyr. Olara boýun bolmazlyk islegi ýok: olar hemişe Allaha ybadat edýärler we her buýrugyny kämillik bilen ýerine ýetirýärler, 'Allaha emr eden zatlaryna boýun bolmazlyk we emr edilenleri ýerine ýetirmek'.",
      "Olara ynanmak, görünmeýän dünýäniň daş-töweregimizde hakyky we işjeňdigine ynanmakdyr. Perişdeler ylham getirýär, adamlary goraýar, her sözi we amallary ýazga alýar, ölümde ruhlary alýar we Allanyň rugsady bilen ýer we gök işlerini dolandyrýar - şonuň üçin imanly hiç haçan hakykatdanam ýeke ýa-da gözegçilik edilmeýär.",
      "Tekstlerde belli bir roly bar: Jibril, ylham perişdesi; Rainagyş we üpjünçilik ynanylan Mika'il; Surnaý çaljak Israfil; Malak al-Mawt, ölüm perişdesi; we her bir adamyň eden işini ýazýan asylly kätipler (Kiraman Katibin). Munkar we Nakir gabyrda merhumdan sorag edýärler.",
    ],
    quran: [
      {
        excerpt:
          "Munuň üstünde Allaha emr eden zatlaryna boýun egmeýän we emr edenlerini ýerine ýetirýän perişdeler, gödek we agyr.",
      },
      {
        excerpt:
          "Aýt: Kim Jibriliň duşmany bolsa, Allanyň rugsady bilen ony ýüregiňe salan adamdyr.",
      },
    ],
    actions: [
      "Angelsazga alýan perişdeleriň hiç haçan bir söz ýa-da amal sypdyrmaýandygyna göz ýetiriň.",
    ],
  },
  {
    title: "Ylahy kitaplara ynanmak",
    summary:
      "Allatagala ýol görkeziji hökmünde iberdi. Gurhan olary tassyklaýar we iň soňky ölçeg hökmünde durýar.",
    body: [
      "Musulmanlar Allanyň resullaryna ýol görkeziji we rehimdarlyk hökmünde aýatlary aýan edendigine ynanýarlar. Gurhan birnäçe at dakýar: Ybraýymyň we Musanyň Suhufy, Musa berlen Tawra, Zabur Dawuda, Injil 'Isa' we ahyrsoňy Muhammet alaýhyssalam üçin Gurhan - umuman, ilkibaşdaky görnüşine ynanýardy.",
      "Gurhan özboluşly derejäni eýeleýär. 'Ondan ozalkylary tassyklaýan we oňa kriteriýa hökmünde' iberilen iň soňky ylham (5:48) - bu höküm çykarýar we düzedýär, sebäbi öňki ýazgylar öňki ýagdaýynda galman, üýtgedilipdir (tahrif) we nesiller boýunça ýitirilipdir.",
      "Scriptazgylaryň arasynda ýeke-täk Gurhan korrupsiýadan Hudaý tarapyndan goralýar: 'Hakykatdanam, ýatlatmany iberdik we hakykatdanam biz onuň goragçysydyrys' (15: 9). Şonuň üçin kitaplara ynanmak ylhamy hormatlamagy, Gurhany oýlanmak bilen okamagy we durmuşdaky görkezmelerine boýun bolmagy aňladýar.",
    ],
    quran: [
      {
        excerpt:
          "Biz size Mukaddes .azgydan ozalky zatlary tassyklaýan we munuň üçin ölçeg hökmünde hakykaty aýan etdik.",
      },
      {
        excerpt: "Hakykatdanam, eratlatmany iberen hut özümiz, hossar bolarys.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Pygamberlere ynanmak",
    summary:
      "Prophetshli pygamberler şol bir esasy hakykaty aýtdylar; Muhammet final iň soňky habarçydyr.",
    body: [
      "Bir musulman, Allanyň iberen pygamberlerine we pygamberlerine ynanýar, bularyň hiç birini-de ret etmeýär. Adamdan Nuh, Ybraýym, Musa we Işaýadan Muhammede çenli all hemmesi şol bir möhüm habara çagyrdylar: diňe Allaha ybadat ediň we dik duruň. Gurhanda ýigrimi bäş adamyň ady bar; Olaryň umumy sanyny diňe Alla bilýär.",
      "Pygamberler hakykatda we ygtybarlylykda ýaradylanlaryň iň gowularydyr, Allah tarapyndan habar ýalan sözlemekden we uly günälerden goralýar - şonda-da olar ynsan bolup galýarlar we hiç haçan ybadat edilmeli däldirler. Bäş adam “tutanýerli” habarçylar (ulu al-azm) hökmünde bellendi: Nuh, Ybraýym, Musa, Isa we Muhammet ﷺ.",
      "Muhammet the Pygamberleriň möhüri (hatam an-nabiýyin): yzyndan hiç bir pygamber gelmeýär we habary ähliumumy - kyýamat gününe çenli bütin adamzada iberilýär. Oňa ynanmak, ony söýmek, buýruklaryna boýun bolmak, habarlaryna ynanmak we diňe öwredişi ýaly ybadat etmegi öz içine alýar.",
    ],
    quran: [
      {
        excerpt: "... Biz hiç bir habarçysynyň arasynda tapawut goýmaýarys ...",
      },
      {
        excerpt: "Muhammet siziň erkekleriňiziň atasy däl, Allahyň Resuly we pygamberleriň möhri.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Soňky güne ynanmak",
    summary:
      "Durmuş, Allah bilen gutarnykly duşuşyga, kämillik adalatyna we baky netijelere alyp barýar.",
    body: [
      "Soňky güne ynanmak ölümden soňky ähli zada ynanmakdyr: mazaryň sorag edilmegi we durmuşy (barzak), surnaý çalmagy, ähli adamlaryň direlmegi, uly ýygnanyşyk, hasaplaşyk, Terezide amallaryň agramy, köpriniň kesilmegi we iki ebedi ýaşaýyş jaýy - Jennet we dowzah.",
      "Bu ynanç her pursata ahlak taýdan ähmiýet berýär. Sebäbi Allah gizlin zady görýär we iň ownuk işi ýazýar, hiç bir gowy zat biderek bolmaýar we hiç bir ýamanlyk hem ünsden düşürilmeýär: 'Kim atomyň ýagşylygyny etse, ony görer we atomyň agyrlygyny eden adam görer.'",
      "Ahl-Sünnet, bu hakykatlaryň hemmesini takyk habar berýär, habar berişleri ýaly ynanýar, şol bir wagtyň özünde alymlaryň belli wakalaryň we alamatlaryň has inçe jikme-jikliklerini düşündirmekde tapawutlanýandygyny boýun alýar. Ynamyň pikiri spekulasiýa däl-de, taýýarlyk.",
    ],
    quran: [
      {
        excerpt:
          "… Şonuň üçin kim atomyň ýagşylygyny etse, ony görer, atomyň agyrlygyny kim etse, ony görer.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kadra ynanmak (Ylahy karar)",
    summary:
      "Allanyň bilimi we karary doly - ýöne adamlar hakykatdanam saýlaýarlar we jogapkärçilik çekýärler.",
    body: [
      "Kadra ynanmak köplenç dört derejede jemlenýär: Allatagalanyň hemme zady ebedilik bilýändigi; bularyň hemmesini ýaradylyşdan elli müň ýyl öň Goragly Planşetde ýazandygyny; Onuň isleginden başga hiç zadyň bolmaýandygyny; we gullarynyň hereketlerini hem öz içine alýan ähli zady Creatoraradandyr.",
      "Şol bir wagtyň özünde, ynsanlaryň Allanyň rugsat beren zatlarynda hakyky erk we hakyky saýlawy bar - şonuň üçin buýruklar we gadaganlyklar, sylag we jeza adalatly we manyly. Adam doga etmegi ýa-da ýalan sözlemegi saýlaýar we jogapkärçilik çekýär; Allanyň saýlamagy öňünden bilişi ony mejbur etmeýär.",
      "Ahl-Sünnet iki ýalňyşlygyň arasynda hereket edýär: buýrugy inkär etmek (wakalar Allanyň biliminden we erkinden gaçýan ýaly) we fatalizm (bu karary adam jogapkärçiligini ýatyrmak we günäni bahana etmek). Mömin serişdäni artykmaçlyk bilen alýar, soň bolsa netijäni Allaha tabşyrýar.",
      "Iş ýüzünde, kadr parahatçylygyň iň uly çeşmesidir: öz işiňizi ýerine ýetireniňizden soň, size ýetip boljak zatlaryň sizi hiç haçan sypdyryp bilmejekdigini we sypdyran zatlaryňyzyň hiç haçan size ýetip bilmejekdigine göz ýetirýärsiňiz.",
    ],
    hadith: [
      {
        excerpt:
          "... Saňa bir zat gelse, 'diňe şeýle eden bolsam' diýmäň, ýöne 'Alla karar berdi we islän zadyny' diýmäň, sebäbi \"diňe\" şeýtanyň gapysyny açýar. (Abu Hureýra)",
      },
    ],
    quran: [
      {
        excerpt: "Hakykatdanam, hemme zady ölçeg (kadar) boýunça ýaratdyk.",
      },
      {
        excerpt:
          "Hakykatdanam, Allatagala öz içindäki zatlary üýtgetýänçä, halkyň ýagdaýyny üýtgetmeýär.",
      },
    ],
    misconceptions: [
      "Nädogry düşünje: Hemme zat karar berlen bolsa, tagallanyň manysy ýok. Düzediş: Yslam tagallany, meýilleşdirmegi, doga etmegi we toba etmegi buýurýar - serişdeleri ulanmagyň özi kararyň bir bölegidir.",
      "Nädogry düşünje: Kadr, meniň günäm üçin Allanyň günäkärdigini aňladýar. Düzediş: Hyzmatkär saýlaýar we jogapkärçilik çekýär; karar hiç haçan boýun bolmazlyk üçin bahana däldir.",
      "Nädogry düşünje: Kynçylyk Allanyň menden nägileligini subut edýär. Düzediş: Synaglar arassalanmak, derejäniň ýokarlanmagy, duýduryş ýa-da gaýdyp gelmek çagyryşy bolup biler - köplenç gahar däl-de, aladanyň alamaty.",
    ],
    actions: [
      "Üstünlik bilen serişdeleri alyň, soňra Allanyň emrine bil baglaň.",
      "'Diňe ...' puşmanlyk aýlawlaryny 'Kaddar Allah' we konstruktiw indiki ädim bilen çalyşyň.",
    ],
  },
  {
    title: "Töwhid düşündirildi",
    summary:
      "Töwhid Allanyň hökümdarlygyny, ybadat etmekdäki ýeke-täk hukugyny we atlaryny we sypatlaryny birleşdirýär.",
    body: [
      "Töwhid (توحيد) - Allanyň mutlak birligi - Yslamyň ýüregi we her pygamberiň habarydyr. Bu, diňe özüne mahsus bolan ähli zatlarda Allany ýeke-täk saýlamagy we Özüni beýan edişi ýaly kämilligini tassyklamagy aňladýar.",
      "Alymlar düşünmek we goramak aňsatlaşdyrmak üçin köplenç üç sany baglanyşyk arkaly öwredýärler. Töwhid al-Rububiýa: ähli zady diňe Allanyň ýaradýandygyny, eýelik edýändigini we oňa gözegçilik edýändigini. Töwhid al-Uluhiýa: ähli ybadatlara diňe Allaha mynasypdygyny - pygamberleriň iň köp nygtaýan we kapyrlaryň iň garşy çykan tarapy şu. Töwhid al-Asma wa'l-Sifat: Allanyň atlaryny we häsiýetlerini ýoýulmazdan, inkär etmezden ýa-da meňzeş bolmazdan tassyklamak.",
      "Bu üç bölümli çarçuwanyň bölüniş çeşmesi däl-de, öwrediş guralydyr; maksady, imanlylara ak ýürekliligi goramaga we agzybirligiň nirede bozulyp biljekdigini tanamaga kömek etmekdir. Bularyň hemmesi her bir musulmanyň doga-dileginde ýazylýar: 'Siz ýeke-täk ybadat edýäris, ýeke-täk kömek soraýarys'.",
      "Möhüm düşünje: Allanyň Creatoraradandygyny boýun almak (rububiýa) özbaşdak däl. Pygamberleri inkär edenleriň köpüsi, Allanyň asmanlary we ýeri ýaradandygyny boýun aldylar - ret edenleri diňe Oňa ybadat etmekdi (uluhiýa). Hakyky tawid diňe gelip çykyşyna bolan ynam bilen däl-de, ybadatda subut edilýär.",
    ],
    quran: [
      {
        excerpt: "Diňe sen ybadat edýäris, diňe sen kömek soraýarys.",
      },
      {
        excerpt: "Allah - Ondan başga hudaý ýok. Iň owadan atlar Oňa degişlidir.",
      },
    ],
    misconceptions: [
      "Nädogry düşünje: Töwhid diňe bir söz aýdýar. Düzediş: heartürege bolan ynam, diliň beýany we ybadatda ýaşan hakykat.",
      ".Alňyş düşünje: Allaharadana Allaha ynanmak, bütin tewhiddir. Düzediş: Hatda köp kapyrlaram synagyň diňe Allaha ybadat edýändigini tassykladylar.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Şirk düşündirildi",
    summary: "Şirk, Allanyň islendik aýratyn hukugyny Ondan başga zada gönükdirýär.",
    body: [
      "Şirk (شرك) - Allaha şärik etmek - tewhidiň tersidir we bir adam toba etmän ölse, Gurhanyň bagyşlap bolmajak bir günäsi: 'Allah şärikleriň Onuň bilen baglanyşyklydygyny bagyşlamaz, islän zadyndan az zady bagyşlar.'",
      "Esasy şirk (al-shirk al-akbar), diňe Allanyň berip biljek zady üçin ölüleri çagyrmak, ýaradylanlara gurban bermek ýa-da wada bermek, ýa-da Allany söýmek we boýun bolmak ýaly bir zady söýmek we boýun bolmak üçin Alladan başga ybadat etmekdir. Yslamdan daşgary bir adam, toba etmese ölse gerek.",
      "Kiçijik şirk (al-shirk al-asghar) Yslamdan çykmaýar, ýöne gaty howply we amallaryň sylagyny ýatyryp biler. Iň düşnükli görnüşi, riýa - adamlar tarapyndan görülmeli we öwülmeli ybadat etmekdir, Pygamberimiz öz jemgyýeti üçin iň gorkýan zady diýip atlandyrdy. Alladan başga-da beýgeldýän görnüşde ant içmek hem şu ýere düşýär.",
      "Ahl al-Sünnet dil we höküm meselesinde seresaplydyr: umuman şirke garşy duýduryş bermek möhümdir we düşnüklidir, ýöne belli bir adamyň muşrik ýa-da kapyrdygyny (takfir) yglan etmegi bilim, ygtybarly subutnamalar we bahanalary aýyrmagy talap edýän agyr mesele - bu ýönekeý adamlara ýa-da onlaýn argumentlere däl-de, ökde alymlara degişlidir.",
    ],
    quran: [
      {
        excerpt:
          "Hakykatdanam, Allah Öz bilen gatnaşygy bagyşlamaz, ýöne isläninden pes zady bagyşlar.",
      },
      {
        excerpt:
          "Eý, oglum, Allaha şärik etme. Hakykatdanam, birleşmek uly adalatsyzlykdyr (zulm).",
      },
    ],
    hadith: [
      {
        excerpt:
          "Siziň üçin iň gorkýan zadym ownuk şirk. Munuň nämedigini soranlarynda off aýtdy: görkezmek (riýa). (Mahmud ibn Labid)",
      },
    ],
    misconceptions: [
      ".Alňyş düşünje: Diliň her bir süýşmesi esasy şirkdir. Düzediş: Alymlar maýory kiçi bilen tapawutlandyrýarlar we her işe subutnama bilen üns berýärler.",
      "Nädogry düşünje: Şirke garşy duýduryş adamlara gödeklik talap edýär. Düzediş: Pygamberlik usuly hakykatyň aýdyňlygyny rehimdarlyk we sabyrly öwretmek bilen jübütleýär.",
    ],
  },
  {
    title: "Yhlas (Ihlas)",
    summary: "Amallar diňe Allah üçin edilende kabul edilýär.",
    body: [
      "Yhlas (إخلاص), adamlara status, öwgi, baýlyk ýa-da täsir däl-de, amal bilen diňe Allanyň razylygyny gözlemekdir. Her bir işiň kabul edilmegine bagly bolan içki şert: Pygamber alaýhyssalam 'amallar diňe niýet bilen bolýar we her bir adamyň diňe islän zady bolar' diýip öwretdi.",
      "Sylag niýet bilen baglanyşykly bolany üçin, Alla üçin çyn ýürekden edilen kiçijik, asuda amal, abraý üçin ýerine ýetirilen uly, köpçülikleýin işden has ýokary bolup biler. Şol bir daşky hereket - haýyr-sahawat bermek, doga etmek, öwretmek - arkasyndaky ýürege baglylykda ybadat ýa-da boşluk bolup biler.",
      "Yhlas bir gezek gazanylmaýar, ýöne yzygiderli täzelenýär, sebäbi öz-özüne üns bermäge ýykgyn edýär. Şonuň üçin iman edenler niýetlerini birnäçe gezek arassalaýarlar we Alladan riýanyň gizlin şirkinden we özüni aldamakdan goramagyny soraýarlar.",
    ],
    quran: [
      {
        excerpt: "Olara dinde çyn ýürekden Allaha ybadat etmekden başga buýruk berilmedi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Hereketler diňe niýet bilen bolýar we her bir adamda diňe islän zady bolar. (Umar ibn al-Hatab)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Alladan söýgi we gorky",
    summary: "Sagdyn ýürek, söýgi, umyt we gorky ganatlarynda Allaha ybadat edýär.",
    body: [
      "Heartürege ybadat üç beýik ýagdaýa esaslanýar: söýgi (mahabbah), umyt (raja) we hormat gorkusy (khawf). Allany söýmek, ähli ybadatlaryň esasy we hereketlendiriji güýji - imanlylar hemme zatdan “Allaha bolan söýgüden has güýçlüdir”, şol bir wagtyň özünde-de Ondan göwnühoş bolmak gorkusy ruhy günäden we biperwaýlykdan saklaýar.",
      "Ahl-Sünnet, bularyň iki ganaty we kellesi bilen uçýan guş ýaly deňagramlylykda bolmalydygyny öwredýär. Söýgi we umyt gorkusyzlyga siňip, Allanyň rehim-şepagatyna ähmiýet berip biler; umytsyz gorky umytsyzlyga çümüp biler. Gurhan olara goşulýar: 'Gorky we umyt bilen Oňa ýüz tutuň'.",
      "Bu deňagramlylyk diňe bir duýgy däl; hereketde ýüze çykýar - namazy goramakda, toba etmäge howlukmakda, başgalara hyzmat etmekde, gaharyňy saklamakda we karar bereniň söýgüsi sebäpli kynçylyklarda sabyrly bolmakda.",
    ],
    quran: [
      {
        excerpt: "… Emma iman edenler Allany söýmekde has güýçlidir.",
      },
      {
        excerpt:
          "... We gorky we umyt bilen Oňa ýüz tutuň. Hakykatdanam, Allanyň rahmeti ýagşylyk edýänlere ýakyn.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Umyt we toba",
    summary:
      "Tüýs ýürekden toba etmek we Allanyň rehimine umyt etmek üçin hiç bir günä gaty uly däldir.",
    body: [
      "Ahl-Sünnetiň kesgitleýji ynamy, adamyň günäleri näçe uly bolsa-da, Allanyň rehiminden hiç wagt umytdan düşmeli däldir we köp ýagşy işleri bolsa-da hiç wagt Öz jogapkärçiliginden özüni arkaýyn duýmaz. Umyt we öz-özüňi düzetmek imanly adamyň durmuşynda yzygiderli dowam edýär.",
      "Allanyň çakylygy haýran galdyryjy sahydyr: 'Aýt: Eý, özlerine garşy hyýanat eden gullarym, Allanyň rehiminden umytdan düşmäň. Hakykatdanam, Allatagala ähli günäleri bagyşlaýar. ' Toba gapysy, günbatardan gün dogýança ýa-da adamyň ölümi ýakynlaşýança açyk bolýar.",
      "Tüýs ýürekden toba etmegiň aýdyň şertleri bar: günäni derrew terk etmek, oňa çyn ýürekden gynanmak we gaýdyp gelmezlik kararyna gelmek we günäniň başga biriniň hukuklaryna degişlidigi, şol hukuklaryň dikeldilmegi ýa-da günäsiniň geçilmegi. Bular ýerine ýetirilende, Allahyň beren jogaby diňe bir kabul etmek däl-de, şatlykdyr: lostitirilen dagyny we çöllük çölüni dikeldýän adama garanyňda, “gulunyň toba etmeginden has hoşal”.",
    ],
    quran: [
      {
        excerpt:
          "Aýt: Eý, gullarym, özlerine garşy hyýanat edenler, Allanyň rahmetinden umytdan düşmäň. Hakykatdanam, Allatagala ähli günäleri bagyşlaýar.",
      },
      {
        excerpt: "Eý iman edenler, çyn ýürekden toba edip Allaha ýüz tutuň.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allatagala dagyny ýitiren, iýmitini we içgisini ümsüm bir ýerde, soň ýene tapýan adamdan has begendir. (Ibn Masud)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Jennet (Jannah)",
    summary: "Jannah, Allanyň merhemeti bilen imanlylar üçin taýýarlan baky sylagydyr.",
    body: [
      "Jennet hakyky, baky we adam aňynyň göz öňüne getirip biljek zatlaryndan has ýokarydyr. Pygamber alaýhyssalam Allahyň sözlerini ýetirdi: 'Men dogruçyl bendelerime hiç bir göz görmedik, gulak eşitmedik we ýürek emele getirmedik zatlary taýýarladym'. Hemmeleriň iň ýokary sylagy Allanyň razylygy we Onuň ýüzüni görmekdir.",
      "Jennete girmek ahyrsoňy Allanyň rahmeti bilen amala aşyrylýar - hiç kimiň eden işi baky bagt gazanyp bilmez - ýöne çyn ýürekden iman we dogruçyl amal Allanyň bellän we kabul eden serişdesidir. Ikisi gapma-garşy däl: rehimdarlyk sebäpdir, iman we amallar oňa açan ýoludyr.",
      "Jennete ynanmak, adamyň häzirki ýaşaýşyny üýtgedýär: kynçylyk, sabyrlylyk, baýlyk bilen sahylyk we ybadatda erjellik bilen sabyr edýär, sebäbi imanly adam baky jaý üçin gysga dünýäni satýar. Gurhan bizi oňa tarap “ýaryşa” çagyrýar.",
    ],
    quran: [
      {
        excerpt:
          "Dogruçyllar üçin taýýarlanan asman we ýer ýaly giň bagyňyzdan Perwerdigäriňizden bagyşlaň.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allatagala aýtdy: Dogruçyl bendelerime hiç bir göz görmedik, gulak eşitmedik we ynsan ýüregi emele getirmedik zatlary taýýarladym. (Abu Hureýra; şeýle hem Sahih Musulman 2824)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Jähennem (Jahannam)",
    summary: "Jahannam, giç bolmazdan ýürekleri Allaha öwürmek üçin hakyky duýduryşdyr.",
    body: [
      "Jähenneme ynanmak (Jahannam), görünmeýänlere we Allanyň kämil adalatyna ynanmagyň bir bölegidir. Adamlaryň howpy çynlakaý kabul etmegi üçin Gurhanda we Sünnetde aç-açan beýan edilen hakyky jeza mekanydyr.",
      "Duýduryşlar rehimdar maksat bilen hyzmat edýär: adamlary beýan eden netijelerinden goramak üçin - ulumsylygy, sütemleri we tutanýerliligi barlamak, hakykatyň ret edilýändigini bilmek we gapy açyk wagty toba etmek üçin biperwaý adamlary herekete getirmek üçin bar.",
      "Ahl-Sünnet duýduryşlary we rehimdarlygy bilelikde saklaýar. Howplar çynlakaý we hakyky, emma her kim özüne ýüz tutsa, Allanyň rahmeti uludyr we tawid halkynyň arasynda oda girýän günäkärler ol ýerde hemişelik galmazlar, ahyrsoňy Allanyň rahmeti we rugsat beren şepagaty bilen çykarylar.",
    ],
    quran: [
      {
        excerpt:
          "Eý iman edenler, özüňizi we maşgalalaryňyzy ýangyjy adamlar we daş bolan otdan goraň.",
      },
      {
        excerpt:
          "... Allanyň rahmetinden umytdan düşmäň. Hakykatdanam, Allatagala ähli günäleri bagyşlaýar.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Direliş",
    summary: "Ölümden soň ähli adamlar Allanyň öňünde durmak üçin beden taýdan direlerler.",
    body: [
      "Direliş (al-ba'th) simwol ýa-da metafora däl-de, beden we hakykydyr. Alla çüýrän süňkleriň iň ýönekeý logika bilen gaýtadan ýaşap biljekdigine şübhelenýänlere jogap berýär: Olary ilkinji gezek hiç zatdan ýaradan adam hökman dikeldip biler - we biziň pikirimizçe täzeden döretmek, döremekden has aňsat.",
      "Ölüm bilen direlişiň arasynda barzah - gabryň aralyk durmuşy, sorag edilmegi we ýeňilligi ýa-da kynlygy bilen ýatyr. Soňra surnaý çalynýar we ähli ýaradylyşlar hasaba alynmak üçin Allanyň huzuryna ýygnalýar.",
      "Bu ynanç, ynsan durmuşyna ahlak taýdan çynlakaýlygy berýär: direlmezden rahat ölýän zulum we zulum edilen ezilenler şol bir netijä geler. Munuň bilen her bir ýalňyşlyga jogap berilýär we sabyr we adalat manysyny berýän her bir ýagşylyk berilýär.",
    ],
    quran: [
      {
        excerpt:
          "Ol: 'Süňkler çüýrän wagty kim jan berer?' Diýýär. Aýt: 'Olara ilkinji gezek döreden durmuşy berer ...'",
      },
      {
        excerpt: "Hakykatdanam, kyýamat gelýär, şübhesiz, Allah gabyrdakylary direlder.",
      },
    ],
  },
  {
    title: "Kyýamat güni",
    summary: "Her bir adam Allanyň öňünde dur. Adalaty kämildir we doly.",
    body: [
      'Kyýamat güni her bir adam, amallar we niýetler, Allanyň hukuklary we beýleki adamlaryň hukuklary üçin jogapkärçilik bilen jogapkärçilige çekiler, hatda atomyň agramy bilenem "hiç kime asla zulum edilmez".',
      "Şol gün hiç bir nesil, baýlyk, synp, millet ýa-da dünýä derejesi hiç kime peýdasy degmez; diňe Alla tarapyndan kabul edilen çyn ýürekden iman we dogruçyl amal peýda bolar. Sazgylar paýlanýar, amallar ölçelýär we hatda adamlaryň arasynda edilen ýalňyşlyklar ýagşy amallary we erbet işleri geçirmek arkaly çözülýär.",
      "Bu ynam häzir häsiýeti üýtgetmek üçin niýetlenendir: imanly adamy dogruçyllyga, ygtybarlylyga, başgalaryň hukuklaryny goramaga we ýalňyşlyklary düzetmäge we bergiler pul däl-de amallar bilen tölenýän günüň öňüsyrasynda yzyna gaýtarmaga çagyrýar.",
    ],
    quran: [
      {
        excerpt:
          "Kyýamat güni adalat terezisini goýýarys, şonuň üçin hiç bir adama asla adalatsyz garalmaz.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Terez we Sirat",
    summary: "Amallar Mizanda ölçelýär we adamlar imanlary we amallary bilen Siratdan geçýärler.",
    body: [
      "Ahl al-Sünnet, Mizany (Terezini) we Siraty (dowzahyň üstündäki köpri) ahyretdäki wakalar diýip tassyklaýar. Terezide amallar we ýerine ýetirijiler ajaýyp adalat bilen ölçelýärler: 'Terezisi agyr bolsa, ýakymly durmuşda bolar; Terezisi ýeňil bolsa, gaçybatalgasy çukur bolar '.",
      'Sirat, dowzahyň üstünden uzalyp gidýän köpri. Gurhan: "Sizden hiç kim ýok, ýöne ondan geçersiňiz" diýýär, soň bolsa "Allany ýada salýanlary halas ederis" diýilýär. Adamlar amallaryna görä geçýärler - käbiri ýagtylyk ýa-da şemal ýaly çalt, käbiri göreşýär, käbiri bolsa süýşýär - Allanyň rahmeti we adalaty bilen.',
      "Bu hakykatlara gorkuzmak däl-de, çynlakaýlygy ösdürmek diýilýär: ownuk amallaryň agramy, ybadatyň yhlasy we başgalaryň hukuklaryny hormatlamak hakda, sebäbi bularyň hemmesi agramly bolar.",
    ],
    quran: [
      {
        excerpt:
          "Terezisi agyr bolsa, ýakymly durmuşda bolar; Terezisi ýeňil bolsa, gaçybatalgasy çukur bolar.",
      },
      {
        excerpt: "Ondan başga hiç biriňiz ýok ... Onda Alladan gorkýanlary halas ederis.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Şepagat (Şafa)",
    summary: "Şepagat hakykydyr, ýöne diňe Allanyň razylygy bilen razy bolanlary üçin.",
    body: [
      "Kyýamat güni şepagat (şafagat) Gurhanda we Sünnetde berk tassyklanýar. Iň ulusy, Muhammet alaýhyssalam pygambere berlen 'Alkyşly beked' (al-maqam al-mahmud), hasaplaşyk başlamak üçin ýygnanan ýaraşyk üçin şepagat eder we ymmatynyň arasynda uly günäli adamlar üçin başga şepagatlar eder.",
      'Emma hiç kim öz ygtyýaryna şepagat etmeýär. Her bir şepagat diňe "Onuň rugsadyndan soň" bolup geçýär we diňe Allanyň razy bolanlary üçin bolýar: "Onuň rugsady bolmazdan, Oňa şepagat edip biljek kim?" Bu, Allanyň netijä bolan doly özygtyýarlylygyny saklaýar.',
      "Alymlar tassyklanylýan şepagatyň birnäçe görnüşini suratlandyrýarlar - hasaplaryň başlamagy, adamlaryň Jennete girmegi, günäkär imanlylaryň bagyşlanmagy ýa-da otdan aýrylmagy üçin - ahyrky hökümiň ​​hemişe Allanyň ýeke-täkdigi bilen ylalaşýarlar.",
    ],
    quran: [
      {
        excerpt: "Onuň rugsady bolmazdan, Oňa şepagat edip biljek kim?",
      },
      {
        excerpt:
          "Şol gün, iň rehimdar kime rugsat beren we sözüni makullaýan adamdan başga şepagat peýdasy bolmaz.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Adamlar meniň ýanyma gelerler, men Rebbimiň öňünde se setde ederin; şonda diýiler: Kelläňizi galdyryň, soraň we size berler, şepagat ediler we şepagatyňyz kabul ediler. (Ebu Said - uly şepagat)",
      },
    ],
    misconceptions: [
      "Nädogry düşünje: Şepagat toba etmegiň zerurlygyny aradan aýyrýar. Düzediş: Diňe Allanyň rugsady bilen ýüze çykýar we hiç haçan günä etmek üçin ygtyýarnama ýok.",
      ".Alňyş düşünje: Pygamberleri ýa-da dogruçyllary şepagat etmäge çagyryp biler. Düzediş: Ybadat we ýalbarmak diňe Allaha degişlidir; ahyretde şepagat etmek, Onuň razylygy bilen gözlenýän karary bilen.",
      "Nädogry düşünje: Şepagat Allanyň adalatyna ters gelýär. Düzediş: Bu, merhemetiniň kämillik adalatynyň çäginde we diňe rugsady bilen hereket edýär.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Soňky günüň alamatlary",
    summary:
      "Uly we uly alamatlar dogry; akyllylar spekulýasiýa däl-de, taýýarlyga ünsi jemleýärler.",
    body: [
      "Hakyky tekstlerde, kiçijik alamatlara bölünen (köpüsi Pygamberiň iberilmegi, nadanlygyň ýaýramagy we giňden ýaýran biperwaýlyk ýaly) Sagatdan öňki alamatlar we ahyryna ýakyn boljak esasy alamatlar beýan edilýär.",
      "On esasy alamat Pygamberiň bir hadysynda bilelikde atlandyrylýar among olaryň arasynda Dajjalyň peýda bolmagy, Isa (Merýemiň ogly) nesli, ajajuj we Majujyň döremegi, üç sany uly süýşme, tüsse, günüň günbatardan çykmagy we adamlary soňky ýygnanyşygyna iterýän ot.",
      "Alymlar käwagt käbir alamatlaryň takyk yzygiderliligi boýunça tapawutlanýar, ýöne olar iki zat barada ylalaşýarlar: Kyýamatyň geljekdigi belli we takyk wagty Jibril soranda Alladan başga hiç kime mälim däl, hatda Pygambere-de mälim däl. Alamatlara pygamberlik jogaby spekulýatiw däl, amalydyr: tükeniksiz çaklama däl-de, imany, toba, adalat we peýdaly işleri artdyryň.",
    ],
    quran: [
      {
        excerpt: "Sagat hakda soraýarlar: haçan geler? Aýt: bilimi diňe Rebbimdedir.",
      },
      {
        excerpt:
          "Sagat birden olaryň gelmeginden başga garaşýarlarmy? Onuň alamatlary eýýäm geldi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "On alamaty görýänçäňiz sagat gelmez: tüsse, Dajjal, Haýwan, günbatardan çykýan gün, 'Isa ,'ajuj we Ma'juj' we üç sany süýşme ... (Hudhayfah ibn Usaýd)",
      },
    ],
    misconceptions: [
      "Nädogry düşünje: Dünýädäki her bir möhüm waka hökman soňky alamatdyr. Düzediş: Şeýle talaplar sensasiýa däl-de, hakyky subutnamalary we ylmy seresaplygy talap edýär.",
      ".Alňyş düşünje: Alamatlary bilmek, sagady bellemäge mümkinçilik berýär. Düzediş: Takyk wagty diňe Alla bilýär; alamatlary çaklamaga däl-de, taýynlanmaga çagyrýar.",
    ],
    appLinks: [{}],
  },
  {
    title: "Akeda soraglary",
    summary:
      "Umumy ynanç soraglaryna deňagramlylyk, subutnamalar we gowy adab bilen jogap berildi.",
    body: [
      "S: Sünnüleriň hemmesi ynanç nukdaýnazaryndan birmeňzeşmi? J: Ahl-Sünnet bir binýady paýlaşýar we esasy zatlar barada doly ylalaşýar; ykrar edilen ylahy mekdepler (Athari, Aşari, Maturidi) diňe käbir tehniki formulalarda tapawutlanýar we muňa duşmançylyk däl-de, hormat bilen öwrenmek gerek.",
      "S: Dogry akyda bolmagy üçin maňa ösen pelsepe gerekmi? J: No.ok. Her bir musulmandan zerur zatlary - alty makalany we sap tawhidi öwrenmek zerur, şol bir wagtyň özünde ökde mugallymlar has çuňňur öwrenmek peýdalydyr.",
      "S: Akydany bilmek meni beýlekiler bilen gödek etmelimi? J: No.ok. Ses ynanjy pespälligi, minnetdarlygy, rehimdarlygy we seresaply gürlemegi artdyrmalydyr. Musulmanlary kemsitmek ýa-da takfir etmek üçin ynanç ulanmak çynlakaý ýalňyşlyk.",
      "S: Yman, yslam we ihsanyň arasynda näme tapawut bar? J: Jibril hadysynda yslam daşky ybadatdyr, iman içki ynançdyr (alty makala), ihsan ikisiniňem kämilligi - Allany görşüňiz ýaly ybadat etmekdir.",
    ],
    actions: [
      "Jedelli tehniki jikme-jikliklerden öň anyk, ylalaşylan esaslary ileri tutuň.",
      "Çylşyrymly ynanç meselesi, iş tejribäňize täsir edeninde, ökde ýerli alymlar bilen maslahatlaşyň.",
    ],
  },
  {
    title: "Salgylar we goşmaça okuw",
    summary: "Gurhan we hakyky sünnet bilen başlaň, soňra bolsa sünni mezhebine ynanýanlar.",
    body: [
      "Ynanç üçin esasy salgylanma hemişe Gurhan we sahabalardyr, sahabalar we Ahl-Sünnetiň ilkinji alymlary olara düşünipdirler - tekstlere gaýtadan okalýan tendensiýalar däl-de.",
      "Peýdaly okuw, ygtybarly mugallymlar tarapyndan siziň derejäňize laýyk düşündiriş bilen öwredilen gysga klassiki ynanç başlangyçlaryny (al-Akida al-Tahawiýa we irki alymlaryň eserleri) öz içine alýar.",
      "Alymlar ikinji derejeli nukdaýnazardan tapawutlananda, subutnamalary kiçigöwünlilik bilen öwreniň we tehniki düşünişmezlikleri mezhep duşmançylygyna öwürmäň - imanlylaryň esasy zatlara jebisleşmegi diniň buýrugydyr.",
    ],
    disclaimer:
      "Bu modul bilim we polemiki däl. Şahsy kararlar ýa-da ynandyryjy ynançlar üçin özüňize ynanýan ökde alymlar bilen maslahatlaşyň.",
    actions: [
      "Her hepde bir ynanç mowzugyny mugallym ýa-da ynamdar başlangyç bilen öwreniň.",
      "Alty iman makalasyny ýatda saklaň we hersini öz sözleriňiz bilen düşündirip bilersiňiz.",
    ],
    appLinks: [{}, {}, {}],
  },
];

export const AQEDAH_GLOSSARY_TK: DeepPartial<AqeedahGlossaryTerm>[] = [
  {
    term: "Akida",
    definition:
      "Ynam - musulmanyň Allaha, perişdelerine, kitaplaryna, habarçylaryna, ahyret gününe we ylahy kararyna ynanýan zatlary.",
  },
  {
    term: "Tawhid",
    definition:
      "Häkimiýetde, ybadatda we atlarda / häsiýetlerde Allanyň ýeke-täkligi - Yslamyň esasy.",
  },
  {
    term: "Şirk",
    definition:
      "Allatagala ybadat etmekde ýa-da diňe özüne mahsus bolan sypatlarda şärik etmek - tewhidiň tersi.",
  },
  {
    term: "Iman",
    definition: "Iman - ýürege ynanmak, dil bilen tassyklamak we el-aýaklar bilen hereket etmek.",
  },
  {
    term: "Kadr",
    definition:
      "Allanyň ebedi bilimi we ähli zadyň karary - ýagşylyk we ýamanlyk Onuň rugsady we paýhasy bilen bar.",
  },
  {
    term: "Nabi",
    definition: "Pygamber - wahy alýan we oňa ýetirmek tabşyrylan adam; öňki kanuna eýerip biler.",
  },
  {
    term: "Resul",
    definition: "Resul - halkyna täze ýazgy ýa-da kanun bilen iberilen pygamber.",
  },
  {
    term: "Sirat",
    definition: "Kyýamat güni dowzahyň üstündäki köpri - imanlylar amallaryna görä geçýärler.",
  },
];
