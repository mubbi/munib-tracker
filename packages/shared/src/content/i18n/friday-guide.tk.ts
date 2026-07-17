import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Turkmen translation overlay for the Learn Friday (Jumu'ah) guide. Mirrors the order of
// FRIDAY_GUIDE_TOPICS in ../friday-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const FRIDAY_GUIDE_TOPICS_TK: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Anna gününiň fazletleri",
    summary: "Güniň iň gowy dogan güni — Adamyň ýaradylyşy, we iki anna aralygyndaky bagyşlanma.",
    body: [
      "Anna (Ýawmul-Jumga) bu ymmatyň hepdelik ýygnanyş güni. Ebu Hureýra rowaýat edişine görä, Allanyň Resuly ﷺ şeýle diýdi: 'Güniň iň gowy dogan güni annadyr; şol günde Adam ýaradyldy, şol günde ol Jennete girizildi, şol günde ondan çykaryldy, we Kyýamat güni hem diňe anna gününde bolar' (Sahyh Muslim 854).",
      "Onuň ybadaty şeýle hem yzygiderli bagyşlanma wadasyny özünde saklaýar. Ebu Hureýra rowaýat edişine görä, Pygamber ﷺ şeýle diýdi: 'Kim anna güni ýuwunsa, soň anna namazyna gelse, imam wagyz aýdyp durka diňläp we dymyp otursa, şol adamyň şol anna bilen indiki anna aralygyndaky günäleri, ýene üç güne goşulyp bagyşlanar' (Sahyh Muslim 857).",
      "Bu fazletler öňünden taýýarlanmaga, üns bilen diňlemäge, we anna gününi hepdelik ruhy täzelenme hasaplamaga çagyryşdyr — diňe işden dynç alyş güni hökmünde däl.",
    ],
    hadith: [
      {
        excerpt:
          "Güniň iň gowy dogan güni annadyr; şol günde Adam ýaradyldy, şol günde ol Jennete girizildi, şol günde ondan çykaryldy, we Kyýamat güni hem diňe anna gününde bolar.",
      },
      {
        excerpt:
          "Kim anna güni ýuwunsa, soň anna namazyna gelse, imam wagyz aýdyp durka diňläp we dymyp otursa, şol adamyň şol anna bilen indiki anna aralygyndaky günäleri, ýene üç güne goşulyp bagyşlanar.",
      },
    ],
    actions: [
      "Anna güni ertirinden niýet ediň: gusul almak, iň gowy eşik, we ir gelmek.",
      "Wagzy ybadat hökmünde kabul ediň — dymmak we üns bermek sylagyň bir bölegidir.",
    ],
  },
  {
    title: "Anna — hepdelik borç",
    summary:
      "Kurany-Kerimde farz edilen jemagat anna namazy, gatnaşýanlar üçin öýlän namazynyň deregine geçýär.",
    body: [
      "Alla anna namazyny öz ady bilen farz edýär: 'Eý iman edenler! Anna güni namaza çagyrylan wagty, Allany ýatlamaga howlugyň we söwda-satygy taşlaň. Eger bilseňiz, bu siziň üçin has ýagşydyr' (Kuran, 62:9). Soňraky aýatlar namazdan soň ýer ýüzüne dargamaga we Allanyň nesibesini gözlemäge rugsat berýär (Kuran, 62:10–11).",
      "Anna iki bölekli wagyzdan we soň imamyň yzynda ses bilen okalýan iki rekatdan ybarat, we ol gatnaşýanlar üçin öýlän namazynyň deregine geçýär. Tariq ibn Şihab rowaýat edişine görä, Pygamber ﷺ jemagat anna namazynyň her musulmana farz bolandygyny, dört adamdan başga: gul, aýal, çaga, ýa-da näsag diýip aýtdy (Ebu Dawudyň Sunany 1067).",
      "Ony äsgermezlik agyr duýduryşdyr: Ebul-Jagd rowaýat edişine görä, kim ünsüzlik sebäpli üç anna namazyny goýberse, Alla onuň ýüregine möhür basar (Nesaýynyň Sunany 1369). Wagyz wagtynda gerekmejek gürrüň sylagy ýitirer — Ebu Hureýra rowaýat edişine görä, eger dostuňyza imam wagyz okap durka 'Dym' diýseňiz, siz özüňiz gerekmejek gürrüň etdiňiz (Sahyh Buhary 934).",
      "Annadan soň dört rekat okamak maslahat berilýär: Ebu Hureýra rowaýat edişine görä, Pygamber ﷺ şeýle diýdi, 'Biriňiz anna namazyny okanda, soňra dört (rekat) okasyn' (Sahyh Muslim 881).",
    ],
    quran: [
      {
        excerpt:
          "Eý iman edenler! Anna güni namaza çagyrylan wagty, Allany ýatlamaga howlugyň we söwda-satygy taşlaň. Eger bilseňiz, bu siziň üçin has ýagşydyr. Namaz tamamlanandan soň, ýer ýüzüne dargaň we Allanyň keremini gözläň...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Jemagat anna namazy her musulmana farz, dört adamdan başga: gul, aýal, çaga, ýa-da näsag.",
      },
      {
        excerpt: "Kim ünsüzlik sebäpli üç anna namazyny goýberse, Alla onuň ýüregine möhür basar.",
      },
      {
        excerpt:
          "Eger dostuňyza imam anna güni wagyz okap durka 'Dym' diýseňiz, siz özüňiz gerekmejek gürrüň (lagw) etdiňiz.",
      },
      { excerpt: "Biriňiz anna namazyny okanda, soňra dört (rekat) okasyn." },
    ],
    actions: [
      "Ýoluňyzy wagyz başlamazdan öň metjide ýetmek üçin meýilleşdiriň.",
      "Telefonlaryňyzy dymdyryň we wagyz wagtynda gürleşmekden saklanyň.",
      "Mümkin bolanda annadan soň dört rekat okaň.",
    ],
    appLinks: [{ label: "Namazy öwreniň — anna sapagy" }, { label: "Yzarlaýjyny açyň" }],
    disclaimer:
      "Annanyň dogry bolmagy üçin gatnaşyjylaryň iň az sany, şeýle hem aýallaryň we ýolagçylaryň gatnaşmaga höweslendirilýändigi — bu mezhepler we ýerli däp-dessurlar boýunça üýtgeýän jikme-jik fykh meseleleridir. Gatnaşmaýan aýallar, ýolagçylar, we näsaglar deregine öýlän namazyny okarlar. Bu bilim beriş mazmuny, fetwa däldir.",
  },
  {
    title: "Anna güni üçin taýýarlyk",
    summary: "Gusul almak, arassa eşik, ýakymly ys, we ir gelmek iň uly sylag üçin.",
    body: [
      "Taýýarlyk anna sünnetiniň bir bölegidir. Ebu Said el-Hudri rowaýat edişine görä, Allanyň Resuly ﷺ şeýle diýdi: 'Anna güni gusul almak balaga ýeten her kim üçin farzdyr' (Sahyh Muslim 846). Sahyh Buharydaky (877) meňzeş hadys hem anna gusulyny balaga ýetenlere baglanyşdyrýar.",
      "Gusuldan başga, Pygamber ﷺ mümkin bolanda has gowy görünmäge höweslendirdi. Salman el-Farisi rowaýat edişine görä, Pygamber ﷺ şeýle diýdi: 'Kim anna güni ýuwunsa, mümkin boldugyça arassalansa, soň saç ýagyny ýa-da ysly zady ulansa, soň çyksa, we iki adamyň arasyndan geçmese, öz ornunda otursa, imamy diňlese ol gutarýança, soň özüne farz edilen namazy okasa — onuň günäleri şol anna bilen indiki anna aralygynda bagyşlanar' (Sahyh Buhary 883).",
      "Ir gelmek sylagy köpeldýär. Ebu Hureýra rowaýat edişine görä, kim birinji sagatda barsa, düýe gurban eden adam ýaly, soň sygyr, soň goýun, soň towuk, soň ýumurtga — imam çykanda, perişdeler ýazgylaryny ýygnap, wagyzy diňlärler (Sahyh Buhary 881).",
    ],
    hadith: [
      { excerpt: "Anna güni gusul almak balaga ýeten her kim üçin farzdyr." },
      { excerpt: "Anna güni gusul almak balaga ýeten her musulman erkek üçin farzdyr." },
      {
        excerpt:
          "Kim anna güni ýuwunsa, mümkin boldugyça arassalansa, soň saç ýagyny ýa-da ysly zady ulansa, soň çyksa, we iki adamyň arasyndan geçmese, öz ornunda otursa, imamy diňlese ol gutarýança, soň özüne farz edilen namazy okasa — onuň günäleri şol anna bilen indiki anna aralygynda bagyşlanar.",
      },
      {
        excerpt:
          "Kim anna güni ýuwunsa, soň ir barsa, düýe gurban eden adam ýaly... soň sygyr... soň goýun... soň towuk... soň ýumurtga. Imam çykanda, perişdeler wagyzy diňlemek üçin gelerler.",
      },
    ],
    actions: [
      "Anna güni ertirine (ýa-da metjide gitmezden öň) gusul alyň.",
      "Iň gowy we arassa eşigiňizi geýiň, mümkin bolsa ýumşak ysly zat ulanyň.",
      "Ir bariň — iň ir barýanlar iň uly sylagy alarlar.",
    ],
    appLinks: [{ label: "Arassalygy öwreniň — Gusul" }],
    disclaimer:
      "Anna gusulynyň berk farz ýa-da güýçli maslahat berilýän sünnet bolmagy mezhepler arasyndaky klassiki tapawutdyr. Ählisi onuň uly fazletine ylalaşýar; jemgyýetiňiziň kabul eden tejribesine eýeriň.",
  },
  {
    title: "Anna güni Kehf sürasy",
    summary: "Iki anna aralygyndaky nur, we ilkinji on aýatda goragyň.",
    body: [
      "Kehf sürasyny (Kuran 18) anna güni okamak söýülýän hepdelik amaldyr. Ebu Said el-Hudri rowaýat edişine görä, Pygamber ﷺ şeýle diýdi: 'Kim anna güni Kehf sürasyny okasa, oňa iki anna aralygynda nur ýalpyldar.' Bu hadys el-Hakim we el-Beýhaki arkaly gelip ýetdi we Şeýh el-Albani sahyh diýip bahalandyrdy; köp jemgyýetler ony berkarar bolan anna sünneti hökmünde eýerýär.",
      "Bulardan aýry, Kehf sürasynyň ilkinji on aýaty Dejjalyň fitnesinden goragdyr. Ebu Derda rowaýat edişine görä, Pygamber ﷺ şeýle diýdi: 'Kim Kehf sürasynyň ilkinji on aýatyny ýat tutsa, Dejjaldan goralar' (Sahyh Muslim 809).",
      "Penşenbe agşamy bilen anna güni Gün ýaşyşynyň aralygynda süräni okamak üçin wagt tapyň — bölümiň hemmesini tamamlap bilmeseňiz-de, ilkinji aýatlardan başlaň we mümkin boldugyça gaýdyp geliň.",
    ],
    quran: [
      {
        excerpt:
          "Bütin öwgi Allaha degişlidir, ol öz gulyna Kitaby indirdi we onda hiç bir eğrilik goýmady... Ýa-da siz gowak we ýazgy eýeleriniň biziň belgilerimiziň arasynda geň bir zat bolandygyny pikir edýärsiňizmi?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim anna güni Kehf sürasyny okasa, oňa iki anna aralygynda nur ýalpyldar. (Şeýh el-Albani sahyh diýip bahalandyrdy)",
      },
      { excerpt: "Kim Kehf sürasynyň ilkinji on aýatyny ýat tutsa, Dejjaldan goralar." },
    ],
    actions: [
      "Anna güni Kehf sürasyny açyň we mümkin boldugyça ünsli okaň.",
      "Dejjaldan goranmak üçin ilkinji on aýaty ýat tutuň ýa-da gaýtalaň.",
    ],
    appLinks: [{ label: "Kehf sürasyny okaň" }],
    disclaimer:
      "'Iki anna aralygyndaky nur' hadysy Alty esasy kitapda ýok; ol soňraky, giňden kabul edilen rowaýata esaslanýar. Ilkinji on aýatyň goragy (Muslim 809) jedelsiz sahyhdyr.",
  },
  {
    title: "Anna güni Pygambere ﷺ salawat",
    summary: "Hepdäniň iň gowy gününde, Pygambere ﷺ salawaty köpeldiň.",
    body: [
      "Anna köp salawat üçin bellenendir. Aws ibn Aws rowaýat edişine görä, Pygamber ﷺ şeýle diýdi: 'Siziň iň gowy günleriňiziň biri annadyr; şonuň üçin şol günde maňa salawaty köpeldiň, sebäbi siziň salawatlaryňyz maňa ýetiriler.' Olar sorady: 'Eý Allanyň Resuly, sen toprak bolan wagty biziň salawatlarymyz saňa nädip ýetiriler?' Ol jogap berdi: 'Alla ýere pygamberleriň bedenlerini iýmegi gadagan etdi' (Ebu Dawudyň Sunany 1047).",
      "Islendik ynamdar salawat formulasy kabul ederlikdir — namazda öwredilýän salawatlar bolsun ýa-da Sünnetden gelen has uzyn görnüşler. Möhüm zat anna güni gaýtalanma we ihlaslylykdyr, berk san däl.",
    ],
    hadith: [
      {
        excerpt:
          "Siziň iň gowy günleriňiziň biri annadyr; şonuň üçin şol günde maňa salawaty köpeldiň, sebäbi siziň salawatlaryňyz maňa ýetiriler.",
      },
    ],
    actions: [
      "Anna güni üçin şahsy salawat maksadyňyzy belläň — az sanam bolsa, yzygiderli bolsun.",
      "Taýýar formula gerek bolsa, programmadaky salawat ýygyndysyny ulanyň.",
    ],
    appLinks: [{ label: "Salawat" }],
  },
  {
    title: "Kabul ediliş sagady",
    summary: "Anna güni doganyň ret edilmeýän sagady — muny aýratyn ikindiden soň agtaryň.",
    body: [
      "Ebu Hureýra rowaýat edişine görä, Allanyň Resuly ﷺ annany ýatlap şeýle diýdi: 'Anna güninde bir sagat bar, eger musulman gul şonda dursa we Alladan bir zat sorasa, Ol oňa berer' — we eli bilen onuň gysga bolandygyny görkezdi (Sahyh Buhary 935; şeýle hem Sahyh Muslim 852).",
      "Alymlar bu sagadyň takyk haçandygy barada dürli pikirdedirler. Güýçli bir garaýyş ony anna gününiň ikindiden soňky soňky bölegine ýerleşdirýär: Jabir ibn Abdylla rowaýat edişine görä, Pygamber ﷺ şeýle diýdi: 'Anna on iki sagatdan ybarat, we onda bir sagat bar, eger musulman gul Alladan bir zat sorasa, Ol oňa berer — şonuň üçin ony ikindiden soňky soňky sagatda agtaryň' (Ebu Dawudyň Sunany 1048).",
      "Haýsy garaýşy eýerseňiz-de, anna gününi — aýratyn hem günüň soňky bölegini — ihlasly dogalar, istigfar, we salawat bilen dolduryň, Allanyň jogap bermek wadasyna ynanyp.",
    ],
    hadith: [
      {
        excerpt:
          "Anna güninde bir sagat bar, eger musulman gul şonda dursa we Alladan bir zat sorasa, Ol oňa berer — we eli bilen onuň gysga bolandygyny görkezdi.",
      },
      {
        excerpt:
          "Anna güninde bir sagat bar, eger musulman namazda durup Alladan bir zat sorasa, Ol oňa berer.",
      },
      {
        excerpt:
          "Anna on iki sagatdan ybarat, we onda bir sagat bar, eger musulman gul Alladan bir zat sorasa, Ol oňa berer — şonuň üçin ony ikindiden soňky soňky sagatda agtaryň.",
      },
    ],
    actions: [
      "Anna güni ikindiden soň, gysga dogalar sanawy bilen otur we ihlasly sora.",
      "Dogany salawat bilen birleşdiriň — ikisi hem şol günde aýratyn maslahat berilýär.",
    ],
    appLinks: [{ label: "Doga ýygyndysy" }],
    disclaimer:
      "Kabul ediliş sagadynyň takyk wagty alymlar arasynda jedelli meseledir (wagyz wagty, ikindiden soň, we başga garaýyşlar). Sagadyň özüniň bardygy Buhary we Muslimde jedelsiz sahyhdyr.",
  },
];
