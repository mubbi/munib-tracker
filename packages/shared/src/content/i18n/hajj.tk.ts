// Turkmen translation overlay for the Learn Hajj & Umrah guide. Mirrors the order of
// its English source in ../hajj-guide.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { HajjGuideSection } from "../../types/hajj-guide";
import type { DeepPartial } from "./localize";

export const HAJJ_GUIDE_SECTIONS_TK: DeepPartial<HajjGuideSection>[] = [
  {
    day: "Gitmezden ozal",
    title: "Borç we şertler",
    summary: "Haj näme üçin berjaý edilýär we kime farz bolýar?",
    steps: [
      {
        title: "Bäşinji sütün",
        body: 'Haj yslamyň bäşinji sütünidir, ömründe bir gezek her bir musulman üçin hökmanydyr. Allatagala şeýle diýýär: "Allatagaladan Allaha şükür etmek, öýe zyýaratdyr - kim oňa ýol tapyp biler" (Gurhan 3:97). Peoplehli adamlara: "Haja halka habar beriň, pyýada we her bir düýe bilen size gelerler" (Gurhan 22:27).',
      },
      {
        title: "Başarnyk (istita'ah)",
        body: "Haj diňe başarýanlar üçin farzdyr: syýahat üçin beden saglygy, syýahaty ýapmak üçin ýeterlik kanuny baýlyk we uzakdaky adamyň garaşly adamlary we howpsuz, açyk ýol. Kimde-kim bu ýyl serişdesi ýetmezçilik etse, gijikdirmek üçin günäkär däldir.",
      },
      {
        title: "Aýalyň syýahaty",
        body: "Alymlaryň köpüsi aýalyň mahram (adamsy ýa-da durmuşa çykmadyk ýakyn garyndaşy) bilen Haja gitjekdigini çaklaýarlar; käbir soňraky alymlar ygtybarly, ygtybarly aýallar toparynda syýahat etmäge rugsat berýärler. Özüňize ynanýan ökde alymyň kararyna we Haj ygtyýaryňyzyň düzgünlerine eýeriň.",
      },
    ],
  },
  {
    day: "Gitmezden ozal",
    title: "Hajyň üç görnüşi",
    summary: "Ifrad, Qiran we Tamattu '- ihram girmezden ozal saýlaň.",
    steps: [
      {
        title: "Ifrad",
        body: "Zyýaratçy diňe Haj üçin yhrama girýär, aýry-aýry Umra namazlaryny okamaýar we hasabyndan gurban bermeýär. Nahr gününiň däp-dessurlaryna çenli ihramda galýar.",
      },
      {
        title: "Kiran",
        body: "Zyýaratçy Umra bilen Hajy bir yhramda jemleýär, Umra dessurlaryny ýerine ýetirýär we haj gutarýança yhramda galýar. Tamattu 'ýaly, gurban gerek (hadys).",
      },
      {
        title: "Tamattu '",
        body: "Zyýaratçy Haj aýlarynda doly Umrany okaýar, yhramdan çykýar, soň bolsa 8-nji Zul-Hijjada haj üçin yhrama girýär. Zyýaratçylaryň köpüsi şeýle edýär; gurban kesmegi ýa-da Hajda üç gün agyz beklemegi, eger başaryp bilmeýän bolsa ýedi gün agyz beklemegi talap edýär (Gurhan 2: 196).",
      },
    ],
  },
  {
    day: "Gitmezden ozal",
    title: "Mikatlar we Ihram",
    summary: "Mukaddes döwletiň nireden başlanýandygy we nämäni gadagan edýändigi.",
    steps: [
      {
        title: "Bäş mawakit",
        body: "Pygamberimiz bäş miqat - ihramsyz geçmeli däl araçäk nokatlaryny kesgitledi: Dhul-Hulaýfah (Madina üçin), Al-Juhfah (Siriýa / Müsür üçin), Karn al-Manazil (Nejd üçin), Yalamlam (Yemenemen üçin) we Dhat 'Irq (Yrak üçin). Içinde bolanlar niredediginden ihram girýärler.",
        location: "Mikat",
      },
      {
        title: "Yhram näme",
        body: "Yhram, niýet we talbiýa bilen giren mukaddes döwletdir. Erkekler iki sany gözlenmedik ak list geýýärler; aýallar adaty sada köýnek geýýärler. Ghusldan soň we erkekler üçin bedene atyr (egin-eşik däl) ulanylýar.",
        location: "Mikat",
      },
      {
        title: "Yhramyň gadaganlygy",
        body: "Yhramda bolanyňyzda: tikilen / enjamlaşdyrylan eşikler we kelläni ýapmak (erkekler üçin), atyr, saç ýa-da dyrnak kesmek, aw oýny, şertnama baglaşmak ýa-da nikalaşmak we islendik ýakynlyk. Bulary bozmak üçin günä (fidýa) gerek bolup biler, şonuň üçin olary üns bilen saklaň.",
        location: "Mikat",
      },
    ],
  },
  {
    title: "Umra",
    summary: "Has az zyýarat - ýylyň islendik wagtynda edilip bilner.",
    steps: [
      {
        title: "Yhram giriziň",
        body: "Mykatda ýa-da ondan ozal ghus ýasap, yhram eşiklerini geýiň, Umra niýetini emele getiriň we talbiýa başlaň. Niýet ýürekde edilýär we mukaddes ýagdaý şol pursatdan başlaýar.",
        location: "Mikat",
      },
      {
        title: "Talbiýany okaň",
        body: '"Labbayk Allahumma labbayk, labbayka la sharika laka labbayk ..." -ni ýygy-ýygydan Mekgä tarap syýahat edeniňizde gaýtalaň - Taňrynyň çagyryşyna diňe jogap berýändigiňizi yglan edip, tawaf başlaýançaňyz dowam ediň.',
      },
      {
        title: "Käbäniň tawafy",
        body: 'Käbäni ýedi gezek tersine öwrüp, Gara daş burçundan başlap, soňuna çenli öpýärsiňiz, degýärsiňiz ýa-da takbir bilen görkezýärsiňiz. Erkekler ilkinji üç zynjyrda raml (çalt depginde) we idtiba \'(sag egnini gysyp) edýärler. Ememen burçunyň we Gara daşyň arasynda: "Lorda Reb, bize bu dünýäde ýagşylyk we ahyretde ýagşylyk ber we bizi ot jezasyndan gora" (Gurhan 2: 201).',
        location: "Metjit al-haram",
      },
      {
        title: "Iki rekagat namaz oka",
        body: "Tawfdan soň, mümkin boldugyça Makam Ybraýymyň (ýa-da metjidiň islendik ýerinde) iki rekagat namaz okaň, soňam Zamzam suwuny arkaýyn içiň, Pygamberimiz Zamzamyň serhoş bolan zady üçin bolandygyny aýtdy.",
        location: "Metjit al-haram",
      },
      {
        title: "Safa bilen Marwanyň arasynda Sa'i",
        body: 'Hajaryň ogly Ysmaýyl üçin suw gözläp, Safadan başlap, Safa bilen Marwanyň arasynda ýedi gezek ýöräň. Allatagala şeýle diýýär: "Hakykatdanam, Safa we al-Marwah Allanyň nyşanlaryndan biridir" (Gurhan 2: 158). Safada Käbä ýüz tutuň we du\'a we takbirde elleriňizi galdyryň; erkekler ýaşyl markerleriň arasynda ylgaýarlar.',
        location: "Metjit al-haram",
      },
      {
        title: "Halq ýa-da taksir",
        body: "Erkekler saçyny syrýarlar (halq, has köp sylaglanýar) ýa-da deň derejede kesýärler (taksir); aýallar saçlaryny ýygnaýarlar we barmak ujunyň uzynlygyny kesýärler. Munuň bilen umre doly we yhram çäklendirmeleri ýatyrylýar.",
      },
    ],
  },
  {
    day: "8 Dhul-Hijja",
    title: "Tarwiýa güni - Mina",
    summary: "Haj zyýaraty başlaýar; gün Minada geçirilýär.",
    steps: [
      {
        title: "Haj üçin ihram giriziň",
        body: "Haj niýetini ediň we talbiýany täzeläp, ihramy (Makkadaky ýaşaýyş jaýyňyzdan tamattu üçin) giriň. Bu mukaddes ýagdaýy täzeden başlaýar, şonuň üçin yhram gadaganlyklary ýene bir gezek ulanylýar.",
      },
      {
        title: "Mina syýahat",
        body: "Mina gidip, Dhuhr, Asr, Magrib, Işa we indiki Fajr namazlaryny okap, hersiniň pygamberiň sünnetine eýerip, öz wagtynda iki raka çenli gysgaldyldy. Arafada durup, gije-gündiz ybadatda geçiriň.",
        location: "Mina",
      },
    ],
  },
  {
    day: "9 Dhul-Hijja",
    title: "Arafah güni",
    summary: "Hajyň iň uly güni - Arafada durmak.",
    steps: [
      {
        title: "Arafada dur",
        body: "Arafanyň çäginde günortandan soň du'a, zikr we toba günlerinde gün ýaşýança galyň. Pygamber alaýhyssalam aýtdy: \"Haj Arafadyr\" (Tirmizi 889, Abu Dawud 1949, hasan sahih): kim bu ýagdaýy sypdyrsa, hajy sypdyrmaz. Kybla ýüz tutuň, elleriňizi galdyryň we Alladan ýalbaryň - bu du'a üçin iň uly gün.",
        location: "Arafah",
      },
      {
        title: "Dhuhr & Asr-i birleşdiriň",
        body: "Dhuhr we Asr bilen bilelikde doga ediň we Dhuhr (jam 'takdim) wagtynda gysgaldyň, günüň galan bölegini goşmaça doga däl-de, dileg ediň.",
        location: "Arafah",
      },
      {
        title: "Muzdalifa göç",
        body: "Gün ýaşandan soň Muzdalifa arkaýyn syýahat ediň, Magrib bilen Işany birleşdiriň (Işa gysgaldyldy), gijäni dynç alyň we daşlamak üçin daş ýygnaň. Ejizler we aýallar ýarylmazlyk üçin ýary gijeden soň Mina gidip bilerler.",
        location: "Muzdalifah",
      },
    ],
  },
  {
    day: "10 Dhul-Hijja",
    title: "Nahr güni - Gurban baýramy",
    summary: "Daşlamak, gurban bermek we esasy tawaf.",
    steps: [
      {
        title: "Daş Jamrat al-Aqaba",
        body: 'Mina tarap gaýdyp, her zyňmak bilen "Allahu akbar" diýip, uly sütüne (Jamrat al-Aqaba) ýedi sany daş atyň. Bu, Ybraýymyň Şeýtany ret etmegine täzeden täsir edýär we günüň ilkinji dessurydyr.',
        location: "Mina",
      },
      {
        title: "Gurbanlyk beriň",
        body: "Gurban kesilýän haýwany soýuň ýa-da tamattu 'we kiran zyýaratçylary üçin talap edilişi ýaly ygtybarly guramanyň üsti bilen guraň (Gurhan 2: 196). Onuň eti iýilýär we garyplara berilýär.",
      },
      {
        title: "Halq ýa-da taksir",
        body: "Saçyňyzy syryň (halq) ýa-da saçyňyzy kesiň (taksir); aýallar barmak ujunyň uzynlygyny kesýärler. Daşlamak we saç syrmakdan soň ilkinji goýberiş (tahallul awwal) ulanylýar - ýanýoldaşyňyz bilen ýakynlykdan başga ähli ihram çäklendirmeleri ýatyrylýar.",
      },
      {
        title: "Tawaf al-Ifadah",
        body: 'Hajyň sütüni bolan Tawaf al-Ifadah üçin we Mekgä gidiň we sa\'i (tamattu üçin). Bu, yhramdan doly boşadylmagyny tamamlaýar we ahlaksyzlykdan we günäden gaça durýan biri "ejesiniň dünýä inen güni ýaly gaýdyp gelýär" (Buhari 1521, Musulman 1350).',
        location: "Metjit al-haram",
      },
    ],
  },
  {
    day: "11–13 Dhul-Hijja",
    title: "Daşreýk günleri - Mina",
    summary: "Minada gijeler we üç sütüniň gündelik daşlanmagy.",
    steps: [
      {
        title: "Bir gije Minada boluň",
        body: "11-nji, 12-nji (we 13-nji gijäni ir gitmeseňiz) geçiriň. Bu günler iýmek, içmek we Allany ýatlamak, ybadat we takbir bilen geçiren günleridir.",
        location: "Mina",
      },
      {
        title: "Üç Jamaraty daşlaň",
        body: "Dhuhrdan soň her gün öýlänsoň, üç sütüniň hersine ýedi sany daş atyň - kiçi, soň ortasy, soňra uly - her okda takbir bilen. Gyssagly biri 12-nji daşdan soň gidip biler (Gurhan 2: 203).",
        location: "Mina",
      },
      {
        title: "Hoşlaşyk Tawaf",
        body: "Mekgeden çykmazdan ozal iň soňky dessur hökmünde Tawaf al-Wadany ýerine ýetiriň, şonuň üçin Hajyň iň soňky eden işi Öýde bolar. Aýbaşyly aýallar ondan boşadylýar.",
        location: "Metjit al-haram",
      },
    ],
  },
  {
    day: "Tamamlamak we kararlar",
    title: "Sütünler, borçlar we sylag",
    summary: "Hajy tassyklaýan zat, öwezini dolmak we sylagy.",
    steps: [
      {
        title: "Sütünler (arkan)",
        body: "Sütünler Hajyň özenidir: ihrama girmek, Arafada, Tawaf al-Ifadah we sa'i (köpleriň pikiriçe) durmak. Haýsydyr bir sütün sypdyrylsa, haj nädogrydyr we gurban kesip bolmaz - gaýtalanmalydyr.",
      },
      {
        title: "Borçlar (wajibat)",
        body: "Borçlar, mykatdan ihram girmegi, Muzdalifada galmagy, Jamaratyň daşlanmagyny, Daşrikiň gijelerini Minada geçirmegi we Hoşlaşyk Tawafyny öz içine alýar. Borçdan ýüz öwürmek hajyň güýjüni ýitirmeýär, ýöne bent (gurban) bilen öwezini dolýar. Madhhablar takyk sanawlarda tapawutlanýar; ökde gollanma bilen maslahatlaşyň.",
      },
      {
        title: "Haj mabruryň sylagy",
        body: "Kabul edilen Haj (Haj mabrur) - günäsiz we çyn ýürekden edilen - geçmişdäki günäleri ýok edýär we sylagy Jennetiň özi. Pygamber alaýhyssalam: «Kabul edilen Hajyň Jennetden başga sylagy ýok» (Buhari 1773, Musulman 1349) diýdi. Tutuşlygyna ajaýyp häsiýet we ýumşaklyk üçin çalyşyň.",
      },
      {
        title: "Fatwa däl-de, amaly gollanma",
        body: "Bu däp-dessurlary tertipli ýerine ýetirmäge kömek etmek üçin amaly syn. Madhhablar köp jikme-jiklikler bilen hormat bilen tapawutlanýar we her bir zyýaratçynyň ýagdaýy başga - belli bir kararlar we garaşylmadyk ýagdaýlar üçin hemişe ökde alym ýa-da resmi Haj gollanmaňyz bilen maslahatlaşyň.",
      },
    ],
  },
];
