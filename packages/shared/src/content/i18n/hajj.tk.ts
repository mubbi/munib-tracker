import type { PilgrimageChecklistItem } from "../../types/hajj-guide";
import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// TK overlay for Hajj & Umrah Learn topics + rite checklists (Turkmen, Latin).
// Index-aligned with English sources; only human-readable text is translated.

export const HAJJ_GUIDE_TOPICS_TK: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Kabul edilen hajynyň sowgy",
    summary: "Mabrur haj günäni ýok edýär we sowgy — jenet.",
    body: [
      "Ebu Hurayra ﷺ Resulullahyň (s) şeýle diýendigini rivayat etdi: «Kim Alla üçin haj eder we rafas hem-de günä etmez, enesini dogan günündäki ýaly gaýdyp gelýär» (Sahih al-Bukhari 1521; Sahih Muslim 1350).",
      "Ol şehem diýdi: «Kabul edilen hajyň (mabrur hajyň) sowgy jenetden başga hiç zat däl» (Sahih al-Bukhari 1773; Sahih Muslim 1349). Kabul edilmek yhlas bilen we hajy ahlaksyzlykdan we günäden saklamak bilen baglanyşykly — diňe daşky ädimleri ýerine ýetirmek bilen däl.",
    ],
    hadith: [
      {
        excerpt:
          "Kim Alla üçin haj eder we rafas hem-de günä etmez, enesini dogan günündäki ýaly gaýdyp gelýär.",
      },
      {
        excerpt:
          "Kim Alla üçin haj eder we rafas hem-de günä etmez, enesini dogan günündäki ýaly gaýdyp gelýär.",
      },
      {
        excerpt: "Kabul edilen hajyň sowgy jenetden başga hiç zat däl.",
      },
      {
        excerpt: "Kabul edilen hajyň sowgy jenetden başga hiç zat däl.",
      },
    ],
    actions: [
      "Hajy diňe Alla üçin niýet et — sapar boyunca dilini we hulguny gorap dur.",
      "Programmadaky haj sanawyny diňe ýatlatma hökmünde ulanyň; ýürek kabul edilmäge gönükdirilen bolsun.",
    ],
    appLinks: [
      {
        label: "Haj aýinleri sanawy",
      },
    ],
  },
  {
    title: "Umrahynyň fazileti",
    summary: "Umradan umra arasyndaky günäni ýok edýär.",
    body: [
      "Ebu Hurayra ﷺ Peygamberimiziň (s) şeýle diýendigini rivayat etdi: «Umra etmek öňki umra bilen arasyndaky günäni ýok edýär, kabul edilen hajyň sowgy bolsa jenetden başga zat däl» (Sahih al-Bukhari 1773; Sahih Muslim 1349).",
      "Umra ýylyň islendik wagtynda edilip bilner. Hajdan gysga, ýöne uly ibadat: ihram, tawaaf, sa'i we saçy almak ýa-da gysmak.",
    ],
    hadith: [
      {
        excerpt:
          "Umra etmek öňki umra bilen arasyndaky günäni ýok edýär, kabul edilen hajyň sowgy bolsa jenetden başga zat däl.",
      },
      {
        excerpt:
          "Umra etmek öňki umra bilen arasyndaky günäni ýok edýär, kabul edilen hajyň sowgy bolsa jenetden başga zat däl.",
      },
    ],
    actions: ["Aýinleri yzygiderli ýerine ýetirmäge taýyn bolanyňyzda umra sanawyny açyň."],
    appLinks: [
      {
        label: "Umra aýinleri sanawy",
      },
    ],
  },
  {
    title: "Arafa günü",
    summary: "Arafada durmak — hajyň ýüregi; uly dua günü.",
    body: [
      "Abd ar-Rahman ibn Ya'mar ﷺ Peygamberimiziň (s) şeýle diýendigini rivayat etdi: «Haj — Arafadyr» (Sunan Abi Dawud 1949; Jami' at-Tirmidhi 889). Arafanyň çäginde belgilenen wagtda durmakdan galan adam o ýylyň hajyny ýitirýär.",
      "Hajda bolmadyklar üçin Arafa günü oňaşlyk örän maslahat berilýär: Ebu Katada Arafada oňaşlygyň geçen we geljek ýylyň günäni ýok edýändigini rivayat etdi (Sahih Muslim 1162). Hajylar özleri oňaş tutmaýarlar, günü duaga bagyşlaýarlar.",
    ],
    hadith: [
      {
        excerpt: "Haj — Arafadyr.",
      },
      {
        excerpt: "Haj — Arafadyr.",
      },
      {
        excerpt: "Arafa günü oňaşlygy, Alladan umyt edýän, öň we soňky ýylyň günäni ýok edýär.",
      },
    ],
  },
  {
    title: "Haj — bäşinji rukn",
    summary: "Her ukyplu musulmana ömürde bir gezek farz.",
    body: [
      "Alla şeýle diýýär: «We adamlara Öýe haj farz — oňa barmagy mümkin bolanlar üçin. Kim inkär etse — Alla dünýälerden müstağnidir» (Qur'an 3:97).",
      "Adamlara çagyryldy: «Adamlara hajy yglan et; olar sana aýak bilen we her arassa deýä bilen uzak geçelgelerden geljekdir» (Qur'an 22:27).",
      "Ibn Umar ﷺ Resulullahyň (s) Islam bäş zat üstünde durýar diýendigini rivayat etdi: şehadat, namaz, zakat, Ramazan oňaşlygy we ukyplular üçin Öýe haj (Sahih al-Bukhari 8; Sahih Muslim 16). Ulamalar şertler ýerine ýetende ömürde bir gezek farz diýip ylalaşýarlar; gaýtalamak — gönüden-göni fazilet.",
    ],
    quran: [
      {
        excerpt: "We adamlara Öýe haj farz — oňa barmagy mümkin bolanlar üçin...",
      },
      {
        excerpt: "Adamlara hajy yglan et; olar sana aýak bilen we her arassa deýä bilen...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Islam bäş zat üstünde durýar: Alladan başga ilah ýok we Muhammed Allanyň elçisidir diýen şehadat, namazy ýerine ýetirmek, zakat bermek, Ramazan oňaşlygy we ukyplular üçin Öýe haj.",
      },
      {
        excerpt: "Islam bäş zat üstünde durýar... we oňa barmagy mümkin bolanlar üçin Öýe haj.",
      },
    ],
  },
  {
    title: "Ukyplulyk (istita'ah)",
    summary: "Saglyk, halal emläk we howpsuz ýol — bular bolmasa haj entek farz däl.",
    body: [
      "Qur'an 3:97-de şert — ukyplulyk (istita'ah). Klassik ulemalar muny şeýle jemleýärler: sapar üçin beden saglygy, sapar we giden wagtynda garamagyndakylaryň zerurlyklary üçin ýeterlik halal pul we howpsuz açyk ýol.",
      "Bu ýyl bu mümkinçilikleri ýok bolan adam ukyplýança gecikdirmekde günäkär däl. Ukyplulyk ýagdaýa görä bahalanýar — kesel, tölenmeli borç ýa-da howpsuz däl sapar derrew farzy aýyrýar. Ýagdaýyň anyk däl bolsa, hünärli ulemadan sor.",
    ],
    quran: [
      {
        excerpt: "...oňa barmagy mümkin bolanlar üçin.",
      },
    ],
    actions: [
      "Bron etmezden ozal farz borçlary tölä we garamagyndakylary üpjün et.",
      "Paketleri diňe resmi kanallar arkaly barla (Taýýarlyk mowzuklaryna seret).",
    ],
  },
  {
    title: "Aýalynyň haj sapary",
    summary:
      "Köpçülik mahram talap edýär; käbir soňky pikirler howpsuz ynamly topary rugsat berýär.",
    body: [
      "Ibn Abbas ﷺ Resulullahyň (s) aýal mahramsyz sapar etmeli däl we erkek mahram bolmasa onuň ýanyna girmeli däl diýendigini rivayat etdi (Sahih al-Bukhari 1862; Sahih Muslim 1341). Köp ulemalar muny haj we umra saparyna degişli edýärler.",
      "Käbir soňky ulemalar — howpsuzlygy, zerurlygy we häzirki sapary göz öňünde tutup — mahram bolmadyk ýagdaýda aýala farz haj üçin ynamly toparda sapar etmäge rugsat berýärler. Bu fiqh meseleleri bahasly.",
    ],
    hadith: [
      {
        excerpt: "Aýal mahramsyz sapar etmeli däl we erkek mahram bolmasa onuň ýanyna girmeli däl.",
      },
      {
        excerpt:
          "Alla we Ahyrky güne ynanýan aýala mahramsyz bir gün bir gije sapar etmek halal däl.",
      },
    ],
    madhhabNote:
      "Köpçülik aýala haj saparynda mahram gerek diýýär. Käbir soňky ulemalar farz haj üçin howpsuz aýal toparynda sapary rugsat berýär. Ynanýan ulemaňy we haj edaranyň düzgünlerini yzarla.",
    disclaimer: "Bu umumy maglumat, ýagdaýyňyz üçin şahsy fetwa däl.",
  },
  {
    title: "Hajyň üç görnüşi",
    summary: "Ifrad, qiran we tamattu' — ihrama girmezden ozal saýla.",
    body: [
      "Ifrad: diňe haj üçin ihrama gir, şol ihramda aýratyn umra ýok we aýinleri birleşdirmek sebäpli kurban talap edilmeýär.",
      "Qiran: umra we hajy bir ihramda birleşdir we haj tamamlanýança ihramda gal. Kurban (hady) talap edilýär.",
      "Tamattu': haj aýlarynda doly umra et, ihramdan çyk, soňra 8 Zul-Hijje haj üçin gaýtadan ihrama gir. Bu gün köp hajylar edýär; hady hem talap edilýär.",
      "Alla aýinleri birleşdirýänler hakda: «...Kim umradan haja peýdalanýan bolsa, aňsatlyk bilen kurban...» diýýär; tapyp bilmeýän bolsa hajda üç gün, gaýdandan soň ýedi gün oňaş tut (Qur'an 2:196).",
    ],
    quran: [
      {
        excerpt:
          "We hajy we umrany Alla üçin tamamla... Kim umradan haja peýdalanýan bolsa, aňsatlyk bilen kurban. Tapyp bilmeýän bolsa hajda üç gün, gaýdanyňyzda ýedi gün oňaş...",
      },
    ],
    actions: [
      "Miqatdan ozal topar ýolbaşçy bilen görnüşi kesgit.",
      "Tamattu' edýän bolsaň, haj ihramyna girmän ozal umrany doly tamamla.",
    ],
    appLinks: [
      {
        label: "Umra sanawy",
      },
      {
        label: "Haj sanawy",
      },
    ],
  },
  {
    title: "Bäş miqat",
    summary: "Haj ýa-da umra ihramy bolmasa Mekkä tarap miqatdan geçme.",
    body: [
      "Ibn Abbas ﷺ Resulullahyň (s) adamlar üçin miqatlary kesgitlendigini rivayat etdi: Medine üçin Zul-Hulayfa, Şam üçin Al-Juhfa, Nejd üçin Qarn al-Manazil, Ýemen üçin Yalamlam; Irak üçin Dhat 'Irq. Ol muny olar we haj ýa-da umra niýet edip geçýänler üçin, şol çäklerde ýaşaýanlar bolsa nireden ýola çyksa şol ýerden ihrama girsin, hatda Mekke ýaşaýjylary hem Mekkeden (Sahih al-Bukhari 1524; Sahih Muslim 1181).",
      "Häzirki howa menzilleri we deňiz portlarynda degişli ihram nokatlary ýa-da yglan edilen tertipler bar — daşyjy we Haj we Umra ministrliginiň görkezmelerini yzarla, ihram bolmasa çäkden geçme.",
    ],
    hadith: [
      {
        excerpt:
          "Resulullah ﷺ Medine üçin Zul-Hulayfa, Şam üçin Al-Juhfa, Nejd üçin Qarn al-Manazil, Ýemen üçin Yalamlam kesgitledi... Bu miqatlar ol ýerler we haj ýa-da umra niýet edip geçýänler üçin...",
      },
      {
        excerpt:
          "Resulullah ﷺ miqatlary kesgitledi... Bu çäklerde ýaşaýan adam nireden ýola çyksa şol ýerden ihrama girsin...",
      },
    ],
  },
  {
    title: "Ihrama girmek",
    summary: "Ghusl, eşik, niýet we telbiya — mukaddes ýagdaý başlanýar.",
    body: [
      "Ihram — haj ýa-da umra niýeti bilen girilýän mukaddes ýagdaý. Resulullah ﷺ ihramdan ozal ghusl maslahat berdi. Erkekler iki tikilmedik ak eşik geýýär; aýallar adaty örtükli eşik saklaýar, ýüz ýa-da eljagaz ihram eşigi hökmünde örtmeýär (niqab we eljagaz jikme-jiklikleri fiqhde).",
      "Erkekler ihramdan ozal bedene atyr sürebilir, ýagdaýa girensoň ihram eşiklerine däl (Sahih al-Bukhari 1539). Soňra niýet et we telbiyany başla.",
      "Resulullahyň ﷺ öwretýän telbiyasy: «Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni'mata laka wal-mulk, la sharika lak» — umra tawaafy başlanýança ýa-da hajda Jamrat al-Aqaba çenli (Sahih al-Bukhari 1549; Sahih Muslim 1184).",
    ],
    hadith: [
      {
        excerpt:
          "Aisha aýtdy: Men Resulullahy ﷺ ihrama girmezden ozal onuň ihramy üçin atyr sürdüm...",
      },
      {
        excerpt:
          "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni'mata laka wal-mulk, la sharika lak.",
      },
      {
        excerpt: "Resulullah ﷺ telbiyany sesli aýtdy: Labbayk Allahumma labbayk...",
      },
    ],
    actions: [
      "Erkekler üçin azyndan iki ihram komplekti; atyrsyz zatlary taýýar sakla.",
      "Sapardan ozal telbiyany türgenleşdir, ýolda aňsatlyk bilen aýdyp bilsin.",
    ],
  },
  {
    title: "Ihramyň gadaganlary",
    summary: "Muhrim mukaddes ýagdaýdan çykýança nämeden gaça durmaly.",
    body: [
      "Ihramda gaça dur: erkekler üçin — tikilen/ýapynjak eşik we başy örtmek; atyr; saç ýa-da dyrnak kesmek; ýer haýwanyny awlamak; nika baglaşmak ýa-da geçirmek; jynsy gatnaşyk. Aýallar atyr we beýleki umumy gadaganlardan gaça durýar, örtükli eşik saklaýar.",
      "Gadagany bozmak fidya talap edip bilner — köplenç oňaş, garyplara iýmit ýa-da kurban — edilen zada görä. Mezhebler jikme-jiklikde tapawutlanýar. Gadaganlara berk saklan we garaşylmadyk zat bolsa hünärli gollanmany sor.",
    ],
    madhhabNote:
      "Bozulmalar we fidýa sanawy mezhebe görä tapawutlanýar. Muny amaly duýduryş hökmünde al we jikme-jiklikleri mezhebiň ýa-da haj gollanmanyň bilen tassykla.",
    disclaimer: "Bu umumy syn, bozulma ýüz berende ýerde zerur görkezmeleriň ýerini almaýar.",
    actions: ["Ihramda atyr, dyrnak gyrasy we gaýçy el ýetýän ýerden uzak sakla."],
  },
  {
    title: "Umra — ihram we telbiya",
    summary: "Miqatda ýa-da ondan ozal mukaddes ýagdaýa gir, soňra Allanyň çagyrmasyna jogap ber.",
    body: [
      "Miqatyňyzda ýa-da ondan ozal, mümkin bolsa ghusl ediň, ihram eşiklerini geýiň, umra niýetini ediň we telbiyany başlaň. Mukaddes ýagdaý şol niýet bilen başlanýar.",
      "Mekkä tarap sapar edýänçäňiz tawaaf başlanýança telbiyany köp aýdyň. Bu — diňe Allanyň çagyrmasyna labbayk diýýäniňizi bildirýär.",
    ],
    actions: ["Her aýini tamamlananda belläp bilmek üçin umra sanawyny ulanyň."],
    appLinks: [
      {
        label: "Umra sanawy",
      },
    ],
  },
  {
    title: "Ka'banyň tawaafy",
    summary: "Gara daşdan başlap sagat aýlawyna garşy ýedi aýlanma.",
    body: [
      "Ka'bany sagat aýlawyna garşy ýedi gezek aýlan, Gara daş burçundan başlap we tamamla. Gygyr bolsa öp, deg ýa-da tekbir bilen görkez — Resulullahyň ﷺ amaly boýunça başgalara zyýan ýetirmezden.",
      "Erkekler ilkinji üç aýlanmada raml (çalt ädim) we bu umra geliş tawaafynda idtiba' (sag çygy) — meşhur sunnet.",
      "Ýemen burçy bilen Gara daş arasynda maslahat: «Rabbimiz, bize bu dünýäde we ahiretde gowylyk ber we ot azabyndan gorap dur» (Qur'an 2:201).",
    ],
    quran: [
      {
        excerpt: "Rabbimiz, bize bu dünýäde we ahiretde gowylyk ber we ot azabyndan gorap dur.",
      },
    ],
  },
  {
    title: "Iki rekat we Zemzem",
    summary: "Mümkin bolsa Makam Ibrahim arkasynda namaz oka, soňra Zemzem iç.",
    body: [
      "Tawaafdan soň ýer bolsa Makam Ibrahim arkasynda iki rekat oka, gygyr bolsa mesjide başga ýerde — «...We ynanýanlar, Ibrahim ýerinden namaz ýeri alyň...» (Qur'an 2:125).",
      "Soňra Zemzem suwuny iç. Jabir Resulullahyň ﷺ hajynda tawaafdan soň Zemzem içendigini beýan edýär; Zemzem içilen maksat üçin diýilýär (soňky ulemalar jemleýän durust hadisler; niýet we dua maslahat).",
    ],
    quran: [
      {
        excerpt: "...We ynanýanlar, Ibrahim ýerinden namaz ýeri alyň...",
      },
    ],
  },
  {
    title: "Safa bilen Marwa arasynda sa'i",
    summary: "Hajar suw gözleýşini ýatda saklap ýedi gezek.",
    body: [
      "Alla şeýle diýýär: «Hakykatdanam Safa we Marwa Allanyň nyşanlarynyň biri. Öýe haj ýa-da umra eden adam olaryň arasynda ýöräninde günäkär bolmaýar...» (Qur'an 2:158).",
      "Safa bilen Marwa arasynda ýedi gezek ýör, Safadan başla. Safada Ka'bä tarap dur, Resulullah ﷺ eden ýaly tekbir we dua üçin elleri galdyr. Erkekler ýaşyl bellikler arasynda ylgamakly ýör.",
    ],
    quran: [
      {
        excerpt:
          "Hakykatdanam Safa we Marwa Allanyň nyşanlarynyň biri. Öýe haj ýa-da umra eden adam olaryň arasynda ýöräninde günäkär bolmaýar...",
      },
    ],
  },
  {
    title: "Halq ýa-da taqsir — umrany tamamlamak",
    summary:
      "Erkekler saç aldyrýar ýa-da gysýar; aýallar bir barmak uzynlygynda gysýar — ihram açylýar.",
    body: [
      "Erkekler başy aldyrýar (halq) — Resulullah ﷺ üç gezek dua etdi — ýa-da deňes gysýar (taqsir). Aýallar saçyny ýygnaýar we bir barmak uzynlygynda gysýar. Şeýlelikde umra tamamlanýar we ihram çäklendirmeleri açylýar.",
      "Abdullah ibn Umar ﷺ Resulullahyň (s) «Allahumma, baş aldyranlara rahmet et» diýendigini rivayat etdi. «Gysanlara hem, ey Resul?» — «Baş aldyranlara rahmet et» — «Gysanlara hem?» — üçünji gezek: «Gysanlara hem» (Sahih al-Bukhari 1727; Sahih Muslim 1301).",
    ],
    hadith: [
      {
        excerpt: "Allahumma, baş aldyranlara rahmet et... We (üçünji gezek) gysanlara hem.",
      },
      {
        excerpt: "Allahumma, baş aldyranlary bagyşla... soňra üçünji gezek: gysanlara hem.",
      },
    ],
  },
  {
    title: "8 Zul-Hijje — Tarwiya günü",
    summary: "Haj üçin ihrama gir we günü Minada geçir.",
    body: [
      "Tamattu' hajylar üçin: haj niýetini et we Mekkedäki ýaşaýan ýeriňden gaýtadan ihrama gir, telbiyany täzele. Ifrad we qiran hajylar eýýäm ihramda.",
      "Minaga git we Dhuhr, Asr, Magrib, Isha we ertirki Fajr — her biri öz wagtynda iki rekata gysgaldyryp oka, Resulullahyň ﷺ Wida hajyndaky amaly ýaly Jabir rivayat etdi (Sahih Muslim 1218). Gün we gijäni ibadatda geçir, Arafany garaş.",
    ],
    hadith: [
      {
        excerpt:
          "Jabir Resulullahyň ﷺ Wida hajy barada uzyn beýany — Minada galmak we aýinler yzygideri.",
      },
    ],
    actions: ["Sekizinji gün irden haj sanawyny aç."],
    appLinks: [
      {
        label: "Haj sanawy",
      },
    ],
  },
  {
    title: "9 Zul-Hijje — Arafa günü",
    summary: "Gün ýaý bolýança Arafada dur, soňra Muzdalifä git.",
    body: [
      "Günortadan soň gün ýaý bolýança Arafanyň çäginde dua, zikir we töwbe bilen gal. Resulullah ﷺ «Haj — Arafadyr» diýdi (Sunan Abi Dawud 1949). Qibla tarap dur, elleri galdyr we Alla ýalvar — uly dua wagtlarynyň biri.",
      "Dhuhr wagtynda Dhuhr we Asr jama gysgaldyryp oka, galan günü nafile däl-de duaga bagyşla — Resulullahyň ﷺ amaly (Sahih Muslim 1218).",
      "Gün ýaý bolandan soň sakin Muzdalifä git. Magrib-Isha jama (Isha gysgaldyryp), gijäni dynç al we taş ýygna. Gowşaklar we aýallar garaşylýan ruxsat boýunça garaşynyň ýarymyndan soň Minaga gidip bilýärler.",
    ],
    hadith: [
      {
        excerpt: "Haj — Arafadyr.",
      },
      {
        excerpt:
          "Resulullah ﷺ Arafada Dhuhr we Asr jama etdi, gün ýaý bolandan soň Muzdalifä gitdi...",
      },
    ],
  },
  {
    title: "10 Zul-Hijje — Nahr günü",
    summary: "Taş atmak, kurban, saç almak we Tawaf al-Ifada.",
    body: [
      "Minaga tarap gaýdyp Jamrat al-Aqaba (ululy sütun) üçin ýedi taş at, her birinde Allahu akbar — Wida hajy yzygiderinde günüň ilkinji aýini.",
      "Tamattu' we qiran üçin talap edilýän kurban ber (Qur'an 2:196) ýa-da ynamly agentlik arkaly sazlaş. Et iýilýär we garyplara berilýär.",
      "Halq ýa-da taqsir; aýallar bir barmak uzynlygynda gysýar. Taş atmak we saç almakdan soň birinji tahallul — köp ihram gadaganlary açylýar, diňe jynsy gatnaşyk galýar.",
      "Mekkä Tawaf al-Ifada — hajyň rukny — we tamattu' üçin sa'i git. Ifrad/qiran geliş tawaafy bilen sa'i edenler mezheb hukumyna yzarla. Şeýlelikde doly ihramdan çykyş tamamlanýar.",
    ],
    quran: [
      {
        excerpt: "...Kim umradan haja peýdalanýan bolsa, aňsatlyk bilen kurban...",
      },
    ],
    madhhabNote:
      "Nahr günü aýinler yzygiderinde sunnetde çeýelik bar; mezhebler takyk yzygideri we her haj görnüşi üçin sa'i wagty barada tapawutlanýar. Topar gollanmany yzarla.",
  },
  {
    title: "11–13 Zul-Hijje — Taşriq günleri",
    summary: "Minada gijeler, her gün üç jamra taş atmak, soňra hoşlaşyk tawaafy.",
    body: [
      "11, 12 (we ir gitmeýän bolsaňyz 13) gijelerini Minada geçiriň. Bu — iýmit, suw we Allany ýatlamak günleridir.",
      "Her gün Duhrdan soň üç sütuna yzygider bilen — kiçi, orta, ululy — her birine ýedi taş, her birinde tekbir. Tela eden 12-nji gün taş atandan soň gidip bilýär (Qur'an 2:203).",
      "Mekkeden gitmezden ozal Tawaf al-Wada et, Öý bilen soňky amal hoşlaşyk bolsun. Ibn Abbas adamlara soňky amallaryny Öýde etmeli diýip buyruk berildi, ýöne hayzly aýal üçin ýeňilleşdirildi (Sahih al-Bukhari 1755; Sahih Muslim 1328).",
    ],
    quran: [
      {
        excerpt:
          "Allany sanalylan günlerde ýadyňa sal. Kim iki günde tela eder — günäkär däl; kim gecikdirer — günäkär däl — Alladan gorkýanlar üçin...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Adamlara soňky amallary Ka'ba hoşlaşyk tawaafy bolmaly diýip buyruk berildi, hayzly aýallar goýuldyy.",
      },
      {
        excerpt:
          "Adamlara soňky amallary Öýde bolmaly diýip buyruk berildi, hayzly aýal üçin ýeňilleşdirildi.",
      },
    ],
  },
  {
    title: "Ruknlar we wajibler",
    summary: "Näme ýitirilse haj geçersiz bolýar; näme kurban bilen düzedilýär.",
    body: [
      "Ruknlar — hajyň esasy. Rukn ýitirilse haj geçersiz we diňe kurban bilen düzedilmeýär — ýerine ýetirmeli. Köpçülik köplenç sanaw: ihram (niýet), Arafada durmak, Tawaf al-Ifada we sa'i.",
      "Wajibler: miqatdan ihram, Muzdalifede galmak, jamralara taş atmak, Taşriq gijelerini Minada geçirmek we hoşlaşyk tawaafy. Wajib ýitirmek hajy geçersiz etmeýär, ýöne mezhebe görä dam (kurban) bilen düzedilýär.",
    ],
    madhhabNote:
      "Dört mezhebde rukn we wajib sanawlary tapawutlanýar. Mezhebiňiz üçin hünärli gollanmany tassykla — aýratyn gygyrly ýagdaýda bir zat ýitirilse.",
    disclaimer: "Bu amaly jemleme, ýitirilen aýinler barada fetwa däl.",
  },
  {
    title: "Edep we yhlas",
    summary: "Dil we azaarlary gorap dur — kabul edilmek hulka bilen baglanyşykly.",
    body: [
      "Günäsiz gaýdyp gelmek hadysy (Bukhari 1521; Muslim 1350) hajy rafas, fusuk we jedel bozýar diýip görkezýär. Sabr, ýumşaklyk we beýleki hajylara kömek — ibadatyň bir bölegi.",
      "Telefon we boş söhbeti Arafada/mesjide üstünlik etmesine ýol ber. Tawaafda ýol ber; Gara daşa iterek etme. Kabul edilen haj jenet bilen bile — sapar boyunca gowy hulka üçin çyndyr.",
    ],
    hadith: [
      {
        excerpt:
          "Kim Alla üçin haj eder we rafas hem-de günä etmez, enesini dogan günündäki ýaly gaýdyp gelýär.",
      },
    ],
    actions: ["Her gün niýet: bir gowy iş we bir yhlasly dua gygyrdan ýokary."],
  },
  {
    title: "Wiza we hasaba alyş",
    summary: "Resmi kanallary ulanyň — Nusuk we milli haj edaranyňyz.",
    body: [
      "Nusuk ( nusuk.sa ) — Saud Arabistanyň haj we umra üçin resmi platformasy: wiza, ýaşaýyş, transport we hasaba alnan paketler. Resmi däl brokerler aldamaklygyň ýygy ýeri.",
      "Her ýurt ýyllyk haj kwotasy alýar; köp hajylar milli haj edarasy ýa-da lisenziýaly agent arkaly arza berýär. Umra kwotasy ýok we ýylyň köp böleginde tassyklanan kanallar arkaly sazlaşyp bolýar.",
    ],
    actions: [
      "Möwsüm açylansoň ir arza ber.",
      "Diňe Nusuk sanawyndaky agentlikler ýa-da milli edara arkaly bron et.",
      "Pul geçirmän ozal töleg kanallaryny barla.",
    ],
    disclaimer: "Giriş düzgünleri we platformalar üýtgeýär; hemişe resmi saýtlardan barla.",
  },
  {
    title: "Näme ýygnamaly",
    summary: "Ihram, atyrsyz zatlar, resminamalar we ýöriş rahatlygy.",
    body: [
      "Erkekler: azyndan iki tikilmedik ihram we resminama üçin kemer. Aýallar: giň örtükli eşik. Açyk aýakgaby aňsatlyk bilen geýilýän; kiçi sumka we suw çüýşesi.",
      "Atyrsyz sabyn we gün goragy ýygnap — ihramda atyr gadagan. Pasport, wiza çap etmesi, sanitar hasabatlary we gyssagly aloqa kiçi halta. Gygyrda power bank, ýerli SIM ýa-da eSIM peýdaly.",
    ],
    actions: [
      "Sanaw: ihram ×2, aýakgaby, atyrsyz zatlar, resminama halta, derman, power bank.",
      "Blister plastyr — hajylar köp ýörýär.",
    ],
  },
  {
    title: "Mukaddes ýerler gysgaça",
    summary: "Mekke, Medine, Mina, Arafa we Muzdalifa — amaly bellikler.",
    body: [
      "Masjid al-Haram Ka'banyň daşynda — tawaaf we sa'i; uly gygyr garaş. Medinadaky Masjid an-Nabawi hajyň özüniň bir bölegi däl, ýöne köp hajylar barýar; Rawda giriş resmi programmalar bilen wagtlaýyn.",
      "Mina — 8 we 11–13 Zul-Hijje gijeleri üçin çadyr şäheri. Arafa — açyk deşik; 9-njy günde suw we kölge möhüm. Muzdalifa — hajylar açyk asmanyň astynda dynç alýar we taş ýygnaýar; mümkinçilikler bilerek çäklendirilen.",
    ],
    actions: ["Sapardan ozal Mina–Arafa–Muzdalifa ýönekeý kartasyny öwren."],
  },
  {
    title: "Resmi çeşmeler",
    summary: "Nusuk, milli edaraňyz we Visit Saudi.",
    body: [
      "Wiza, paket, Rawda rugsatlary we gygyr görkezmeleri üçin Nusukdan başla. Kwota we saglyk düzgünleri üçin ýurduň haj ministrligini ulanyň. Visit Saudi umumy giriş we sapar maslahatlaryny çap edýär.",
      "Teklif adatyndan arzan ýa-da broker resmi kanallardan daşary töleg talap etse, tölemezden ozal ministrlik portalyny göni barla.",
    ],
    actions: [
      "nusuk.sa we milli haj edarasynyň saýtyny belläň.",
      "Topar ýolbaşçysynyň gyssagly aloqa maglumatlaryny sakla.",
    ],
    disclaimer: "Amaly gollanma, resmi haj/umra üpjün edijiniň ýerini almaýar.",
  },
];

export const HAJJ_CHECKLIST_TK: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Haj üçin ihrama gir",
    hint: "Haj niýet et we ihrama gir (tamattu' üçin Mekkeden); telbiyany täzele.",
    day: "8 Zul-Hijje",
  },
  {
    title: "Minaga git",
    hint: "Minada Duhrdan Fajr çenli her namazy öz wagtynda gysgaldyryp oka.",
    location: "Mina",
    day: "8 Zul-Hijje",
  },
  {
    title: "Arafada dur",
    hint: "Günortadan soň gün ýaý bolýança Arafada dua we zikir bilen gal.",
    location: "Arafa",
    day: "9 Zul-Hijje",
  },
  {
    title: "Dhuhr we Asr jama",
    hint: "Dhuhr wagtynda Dhuhr we Asr jama gysgaldyryp oka, soňra duaga gönük.",
    location: "Arafa",
    day: "9 Zul-Hijje",
  },
  {
    title: "Muzdalifä git",
    hint: "Gün ýaý bolandan soň Magrib-Isha jama, dynç al we taş ýygna.",
    location: "Muzdalifa",
    day: "9 Zul-Hijje",
  },
  {
    title: "Jamrat al-Aqaba taş at",
    hint: "Ululy sütuna ýedi taş at, her birinde tekbir.",
    location: "Mina",
    day: "10 Zul-Hijje",
  },
  {
    title: "Kurban ber",
    hint: "Tamattu' we qiran üçin farz — soý ýa-da ynamly agentlik arkaly.",
    day: "10 Zul-Hijje",
  },
  {
    title: "Halq ýa-da taqsir",
    hint: "Erkekler saç aldyr ýa-da gysar; aýallar bir barmak (birinji tahallul).",
    day: "10 Zul-Hijje",
  },
  {
    title: "Tawaf al-Ifada",
    hint: "Tawaf al-Ifada we tamattu' üçin sa'i — hajyň rukny.",
    location: "Masjid al-Haram",
    day: "10 Zul-Hijje",
  },
  {
    title: "Minada gije geçir",
    hint: "11, 12 (we ir gitmeýän bolsaňyz 13) gijelerini Minada geçir.",
    location: "Mina",
    day: "11–13 Zul-Hijje",
  },
  {
    title: "Üç jamra taş at",
    hint: "Her gün Duhrdan soň kiçi, orta, ululy — her birine ýedi.",
    location: "Mina",
    day: "11–13 Zul-Hijje",
  },
  {
    title: "Hoşlaşyk tawaafy",
    hint: "Mekkeden gitmezden ozal Tawaf al-Wada (hayzly aýallar goýuldy).",
    location: "Masjid al-Haram",
    day: "Gidiş",
  },
];

export const UMRAH_CHECKLIST_TK: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Ihrama gir",
    hint: "Miqatda ýa-da ondan ozal: ghusl, ihram eşigi, umra niýeti, telbiya.",
    location: "Miqat",
  },
  {
    title: "Telbiya oka",
    hint: "Tawaaf başlanýança Labbayk... köp aýt.",
  },
  {
    title: "Ka'banyň tawaafy",
    hint: "Gara daşdan sagat aýlawyna garşy ýedi aýlanma; erkekler: raml we idtiba'.",
    location: "Masjid al-Haram",
  },
  {
    title: "Iki rekat oka",
    hint: "Mümkin bolsa Makam Ibrahim arkasynda, soňra Zemzem iç.",
    location: "Masjid al-Haram",
  },
  {
    title: "Safa-Marwa sa'i",
    hint: "Safadan başlap ýedi gezek; erkekler ýaşyl bellikler arasynda ylgamakly ýör.",
    location: "Masjid al-Haram",
  },
  {
    title: "Halq ýa-da taqsir",
    hint: "Erkekler saç aldyr ýa-da gysar; aýallar bir barmak — umra tamam.",
  },
];
