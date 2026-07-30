import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// tk overlay for janazah-guide. Index-aligned with JANAZAH_GUIDE_TOPICS in ../janazah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const JANAZAH_GUIDE_TOPICS_TK: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Jemgyýetçilik borjy",
    summary: "Janazah fard kifayah - jemagat ony ýerine ýetirmeli.",
    body: [
      "Jynaza namazy (Salat al-Janazah) jemagat borjydyr (fard kifayah): eger jemagatyň käbiri muny ýerine ýetirse, borç galanlardan aýrylýar; hiç kim etmese, hemmesi günäkär. Ruku ýa-da sujudsyz, doga-dilegleriň arasynda tapawutly görnüş bolup durulýar.",
      "Ebu Hureýra, Allahyň Resulynyň (saw): «Kim namaz okalýança jynaza gatnaşsa, bir kyrat alar we jaýlanmaga gatnaşýan kişi iki kirata eýe bolar» diýdi. Gyratyň nämedigini soranlarynda, ol: 'Iki beýik dag ýaly' (Sahih al-Buhari 1325; Sahih Muslim 945) diýdi.",
      "Jynazadan soň, adamyň ukybyna görä ýuwulmaga we jaýlanmaga kömek etmek we merhum üçin dua etmek musulmanlaryň başga birine bolan hukugynyň biridir. Bedene mertebe bilen çemeleşiň we subutnamasyz isrip etmekden ýa-da amallardan gaça duruň.",
    ],
    actions: [
      "Jemgyýetiňizde jaýlanyş çäresi yglan edilende çalt jogap beriň.",
      "Jemgyýetçilik görkezişi däl-de, Allanyň razylygy üçin doga we okamagy maksat ediniň.",
      "Hormat bilen edip bilseňiz, maşgalanyň amaly zerurlyklaryna kömek ediň.",
    ],
    hadith: [
      {
        excerpt:
          "Jynaza namazyny okaýança kimiň jynaza namazyny okaýan bolsa, bir kyrat bolar, jaýlanmaga gatnaşan kişi iki kirata eýe bolar - hersi beýik dag ýaly.",
      },
      {
        excerpt:
          "Kim musulmanyň jynazasyny imandan alyp, sylag gözläp, namaz okalýança we jaýlanyş gutarýança galsa, iki kirat bilen gaýdyp geler ...",
      },
    ],
  },
  {
    title: "Inguwmak we örtmek",
    summary: "Merhumyň Gusly we ýönekeý kafan - isripsiz mertebe.",
    body: [
      "Ölen musulmanlar (nusgawy hökümde söweş meýdanynda şehit bolanlardan başga) arassalaýjy ýuwulýar, soňra arassa ak mata bilen örtülýär. Umm Atiýa, Pygamberimiziň daughter gyzynyň ýuwulmagy barada şeýle diýendigini habar berdi: 'Isleseňiz, ony suw ýa-da sidr bilen üç ýa-da bäş gezek ýuwuň we iň soňkusyna kamfora ýa-da bir kamfor goýuň' (Sahih al-Buhari 1253).",
      "Aýşa, Allahyň Resulynyň Yemenemeniň üç sany ak pagta eşiginde, ne köýnek, ne-de selle geýendigini habar berdi (Sahih al-Buhari 1264; Sahih Muslim 941). Plönekeýlik sünnetdir; gymmat bahaly görkezişler pygamberlik mysalyna ters gelýär.",
      "Kim ýuwýar, erkekler we aýallar üçin näçe mata we şuňa meňzeş jikme-jiklikler mezhep tapawudyna eýe. Maşgalalar mekdebiň tejribesini bilýän bilimli ýerli gollanma ýa-da jaýlanyş hyzmatyna eýermelidirler - bu umumy syn ýuwmak üçin gollanma däl.",
    ],
    actions: [
      "Mümkin boldugyça merhum bilen deň jynsdaky ynamdar adamlary belläň.",
      "Kepegi ýönekeý we arassa saklaň - ak mata pygamberlik nusgasydyr.",
      "Bedeniňizi zerurlyksyz surata düşürmekden ýa-da paş etmekden gaça duruň.",
    ],
    hadith: [
      {
        excerpt:
          "Zerur bolanda suw we sidr bilen üç gezek, ýa-da bäş ýa-da ondanam köp ýuwuň we iň soňky ýuwulanda kamfora ýa-da kamfor goýuň.",
      },
      {
        excerpt:
          "Allahyň Resuly three üç sany Yemenemenli pagta eşigi bilen örtüldi; olaryň arasynda ne köýnek, ne-de selle bardy.",
      },
    ],
  },
  {
    title: "Merhumyň gözüni ýumanda",
    summary: "Ölüm pursatynda pygamberlik dua.",
    body: [
      "Umm Salamah, Allahyň Resulynyň Abu Salamah gözleri dikilensoň gelendigini habar berdi. Olary ýapdy-da: 'Ruh alnanda, gözüň yzyndan gelýär' diýdi we maşgalasy aglady. Soňra olara diňe gowy zady aýtmagy öwretdi, çünki perişdeler aýdýanlaryna amin diýýärler we Abu Salama üçin dua etdi (Sahih Muslim 920).",
      "Aşakdaky bukulan Hisnul musulman ýazgysy, gözüňi ýummakda ulanylýan sözleri saklaýar. Entlyuwaşlyk bilen gürläň, Pygamberimiziň gadagan eden aglamalaryndan gaça duruň we gowy sözler bilen dil alyň we bagyşlaň.",
    ],
    actions: [
      "Gözleri ýuwaşlyk bilen ýumuň we hakyky dua ediň.",
      "Maşgalanyň gowy gürlemegini ýada salyň.",
    ],
    hadith: [
      {
        excerpt:
          "Ebu Salamanyň gözleri dikeldilende, Pygamber alaýhyssalam olary ýapdy we ruh görlende onuň yzyndan ýetendigini, soň bolsa öý hojalygyna diňe gowy zatlary gürlemegi öwredendigini aýtdy.",
      },
    ],
  },
  {
    title: "Janaza nädip doga etmeli",
    summary: "Dört takbir bilen hemişelik doga - ruku ýa-da sujud ýok.",
    body: [
      "Jynaza namazy dik durulýar. Ruku ýok, sujud ýok, adhan ýa-da ikama ýok. Ymam, Anasyň we Samuranyň habarlaryna görä ölen bir erkek adamyň kellesinde ýa-da ölen aýalyň ortasynda dur (Abu Dawud 3194 we şuňa meňzeş wakalara serediň) we ýygnak yzda hatar düzýär.",
      "Namaz dört takbirden ybaratdyr. Birinjisinden soň, Fatiha süresi okalýar (Buhari 1335). Soňra takbirlerden soň Pygambere salawat we merhum üçin dua edilýär. Namaz taslim bilen tamamlanýar. Jabir, Pygamberimiziň Negus (Abyssiýa şasy) üçin jaýlanyş namazyny okandygyny we dört takbir (Sahih al-Buhari 1334) aýtdy.",
      "Takbirini ýitirenler, ymamyň yzyna düşmeli we tutmak üçin mekdebiniň düzgünine laýyklykda sypdyran zatlaryny doldurmaly - ynamsyz bolsa ymamdan ýa-da ýerli mugallymdan soramaly.",
    ],
    actions: [
      "Setirlerde dur; baş egmäň we sejde etmäň.",
      "Ymam bilen dört takbir diýiň.",
      "Degişli takbirden soň merhum üçin çyn ýürekden dua ediň.",
    ],
    hadith: [
      {
        excerpt: "Pygamber alaýhyssalam Negus üçin jynaza namazyny okady we dört takbir aýtdy.",
      },
      {
        excerpt: "Ibn Abbas jynaza namazyny okady we sünnetdigini aýdyp, Fatihany okady.",
      },
    ],
  },
  {
    title: "Jynaza namazynda duas (ulular)",
    summary: "Merhum üçin hakyky Hisnul musulman sözleri.",
    body: [
      "Takbirlerden soň, Janazanyň ýüregi merhum üçin dua - Alladan olary bagyşlamagyny, rehim etmegini we Jennet bermegini soraýar. Hisnul Musulmanda Pygamberimizden birnäçe hakyky sözler saklanýar.",
      "Arap, transliterasiýa we many bilen okamak üçin aşakdaky baglanyşyk duasyny açyň. Birden köp hakyky sözleri öwrenip bilersiňiz; yhlas uzynlykdan has möhümdir.",
    ],
    actions: [
      "Iň bolmanda bir hakyky Janazah duasyny ýatda saklaň.",
      "Gatnaşanyňyzda ölen ähli musulmanlar üçin umumy dua ediň.",
    ],
  },
  {
    title: "Has köp jynaza namazy",
    summary: "Hisnul Musulmandan goşmaça hakyky sözler.",
    body: [
      "Hisnul Musulman, Pygamberimizden öwredilen jynaza-doga sözlerini dowam etdirýär. Olary aýlawda ulanyň ýa-da jemgyýetiňiziň iň gowy bilýänini öwreniň.",
      "Ölen çaga üçin aýratyn duýgular Alladan çagany öňdebaryjy we ene-atalar üçin sylag saklamagyny soraýar - indiki mowzuga serediň.",
    ],
  },
  {
    title: "Jynaza namazy # 3",
    summary: "Uly ýaşly merhum üçin başga bir hakyky söz.",
    body: [
      "Jynaza namazy üçin ýene bir Hisnul musulman sözi. Ymamyňyzyň amal edişi ýaly, degişli takbirden soň okaň.",
    ],
  },
  {
    title: "Jynaza namazy # 4",
    summary: "Sünnet korpusyndan dördünji hakyky söz.",
    body: [
      "Hisnul Musulman bu goşmaça jynaza-doga duasyny öz içine alýar. Her sözlemi birbada ýygnamakdan hakykylygyny we ýüregiň barlygyny saýlaň.",
    ],
  },
  {
    title: "Ölen çaga üçin duas",
    summary: "Merhum çaga bolanda ýörite pygamberlik dualary.",
    body: [
      "Merhum çaga wagty, hakyky duýgular Alladan çagany ene-atasy üçin saklanylýan hazyna, öňdebaryjy we jogapçy şepagatçy etmegini soraýar. Aşakdaky Hisnul musulman ýazgylary bu sözleri saklaýar.",
      "Oýlap tapylan däp-dessurlardan gaça durmak bilen maşgalany Allanyň rahmetine umyt bilen teselli beriň. Şol dört takbir Janazah gurluşy ulanylýar; dua mazmuny üýtgeýän zat.",
    ],
    actions: [
      "Zerur bolanda çagalara mahsus dualary ulanyň.",
      "Gynanýan ene-atalara barlygy we halal kömegi bilen goldaw beriň.",
    ],
  },
  {
    title: "Çaga jaýlanyş dua # 2",
    summary: "Ikinji Hisnul Musulman ölen çaga üçin söz.",
    body: ["Hisnul Musulmanda saklanylýan çaganyň jynaza namazy üçin başga bir hakyky söz."],
  },
  {
    title: "Jynaza we mazar",
    summary: "Bedeni aşak düşürmek, gibla we jaýlanyndan soň dua.",
    body: [
      "Merhum mertebesi bilen we taýynlygyň talap edişinden has gijikdirmän gibla bilen ýüzbe-ýüz ýerde jaýlanýar. Pygamber alaýhyssalam aýtdy: 'Jynaza bilen gyssagly boluň ...' (Sahih al-Buhari 1315 - jaýlanyşy gyssagly).",
      "Merhumyň guburyna ýerleşdirilende, Hisnul Musulmanda hakyky dua saklanýar. Jynazadan soň Pygamberimiz gabyrda durup: 'Doganyňyzdan ötünç soraň we berk bolmagyny soraň, sebäbi indi sorag edilýär' (Sunan Abi Dawud 3221 - al-Albani ýaly köp alymlar tarapyndan bahalandyrylan sahih).",
      "Mazarlaryň üstünde bezeg desgalaryny gurmak, bezemek üçin gipslemek ýa-da ulaltmagy höweslendirýän ýazgy, hakyky habarlarda duýduryş berilýär. Kanun we ýerli adat kesgitlemäge mümkinçilik berýän belligi ýönekeý saklaň.",
    ],
    hadith: [
      {
        excerpt:
          "Jynaza bilen gyssagly boluň: dogry bolsa, ony gowulaşdyrmaga howlukýarsyňyz; bolmasa, boýnuňdan erbetlik goýýarsyň.",
      },
      {
        excerpt:
          "Doganyňyzdan ötünç soraň we tutanýerli bolmagyny soraň, sebäbi indi sorag edilýär.",
      },
    ],
  },
  {
    title: "Merhum jaýlanandan soň",
    summary: "Mazardaky berklik üçin dua.",
    body: [
      "Merhumdan ötünç soramak we çydamlylyk üçin jaýlanylandan soň gysga durmak Pygamberimizden kesgitlenýär Abu (Abu Dawud 3221). Aşakdaky Hisnul musulman sözi jaýlanandan soň.",
      "Dowam edýän haýyr-sahawat, dua we merhumyň kanuny wesýetlerini ýerine ýetirmek, Allanyň rugsady bilen - subutnamasy bolmadyk ýyllyk dabaralary oýlap tapmazdan.",
    ],
    actions: [
      "Jynazadan soň mazarda dua ediň.",
      "Merhum üçin şahsy dua we sadaqany dowam etdiriň.",
    ],
  },
  {
    title: "Mazarlara zyýarat",
    summary: "Mazarlara zyýarat edende pygamberlik salamy.",
    body: [
      "Mazarlara zyýarat etmek ahyret durmuşyny ýada salýar. Buraidah, Allahyň Resulynyň mazara gidenlerinde aýtmagy öwredýändigini habar berdi: imanlylaryň we musulmanlaryň arasynda ýaşaýanlaryň ýaşaýjylaryna parahatçylyk salamy, Alla islese, olara goşuljakdygymyzy we biziň we olar üçin abadançylyk soraýarys (Sahih Musulman 975; Ibn Majada-da söz).",
      "Aşakdaky Hisnul musulman ýazgysy bu gutlagy gorap saklaýar. Saparlary aglamazdan, ölülerden kömek sorap ýa-da subutnamasyz däp-dessurlary dowam etdiriň.",
    ],
    actions: [
      "Mazarlaryň ýaşaýjylaryna hakyky sözler bilen salam beriň.",
      "Ölüm hakda pikirleniň we dogry amallary täzeläň.",
    ],
    hadith: [
      {
        excerpt:
          "Salam, imanlylar we musulmanlaryň arasynda ýaşaýanlar! Alla islese, size goşularys. Alladan biziň we siziň üçin abadançylyk soraýarys.",
      },
    ],
  },
  {
    title: "Inderatlatmalar we umumy ýalňyşlyklar",
    summary: "Aglamakdan, görkezmek üçin gijä galmakdan we esassyz däp-dessurlardan gaça duruň.",
    body: [
      "Pygamberimiz, gözýaşly gam-gussa ýol berip, ölüleriň üstünde aglamagy gadagan etdi. Abdylla ibn Umar Sa'd ibn Ubadanyň jynaza namazynda aglandygyny we Pygamber alaýhyssalamyň Allanyň gözüň ýyrtylmagy ýa-da ýüregiň hasraty üçin jeza bermeýändigini, ýöne munuň üçin dilini görkezendigini düşündirdi (Sahih al-Buhari 1304).",
      "Abraýly ýygnanyşyklar üçin jaýlanmagy gijikdirmäň, garyplary äsgermezlik edip, kelläňize we toýuňyza köp sarp etmäň. Jynaza bilen baglanyşykly täzelikleri hakyky esassyz okamaň ýa-da amal etmäň. Gynanç, asuda dua we maşgala üçin amaly kömek sünnet ýoludyr.",
      "Aýal-gyzlaryň namaza we jaýlanyşa gatnaşmagy mekdeplerde we döwürlerde uly gyzyklanma döredýär; rehimdarlyga we pygamberlik çäklerine hormat goýýan ygtybarly ýerli görkezmä eýeriň.",
    ],
    disclaimer:
      "Bilim syny - jynaza müdiriniň gollanmasy ýa-da fatwa däl. Hinguwmak, örtmek we gonamçylyk düzgünleri üçin ýerli mekdep tejribesi hünärli adamlar bilen tassyklanmalydyr.",
    actions: [
      "Aglamazdan ýa-da gadagan sözlemezden gynan.",
      "Mertebeli jaýlanmagy howlukmaň.",
      "Maşgalaňyzy isripsizlik etmezden iýmit we işler bilen kömek ediň.",
    ],
    hadith: [
      {
        excerpt:
          "Allah gözüň ýyrtylmagy ýa-da ýüregiň hasraty üçin jeza bermeýär, ýöne muňa jeza berýär ýa-da rehim edýär - we dilini görkezdi.",
      },
    ],
  },
  // --- v2 appended topics (keep index-aligned with English) ---
  {
    title: "Takbirden takbire — namazyň ädimleri",
    summary: "Dört takbiriň we olaryň arasyndaky işleriň amaly sanawy.",
    body: [
      "Birinji takbir: elleriňizi galdyryň (mezhebiňize görä), «Allahu ekber» diýiň, soňra «el-Fatiha» süresini okaň. Ibn Abbas jynaza namazynda «el-Fatiha»ny okady we onuň sünnetdigini aýtdy (Sahih al-Buhari 1335).",
      "Ikinji takbir: Pygambere ﷺ salawat iberiň — teşehhudda ulanylýan Ibrahimy salawat bu ädimde giňden öwredilýär. Üçünji takbir: merhum üçin çyn ýürekden dua ediň (şu gollanmadaky Hisnul Muslim sözleri). Dördünji takbir: köp alymlar gysga umumy dua edýärler, soňra saga (we mezhebe görä çepe) taslim bilen gutarýarlar.",
      "Ruku, sujud ýa-da oturyş ýok. Bütin wagt duruň. Birnäçe jynaza bolsa, köp jemagatlarda hemmä bir niýet bilen bir jynaza okalýar — ymamyň yzyna düşüň. Salawat bilen duanyň ýeri mezhebe görä birneme üýtgäp biler; dört takbirli çarçuwa umumydyr.",
    ],
    madhhabNote:
      "Hanefi, Maliki, Şafiýi we Hanbeli kitaplary her takbirde eliň galdyrylmagy we duanyň takyk haçan aýdylmagy boýunça tapawutlanýar. Öňüňizdäki ymamyň yzyna düşüň.",
    actions: [
      "Dört takbir yzygiderliligini gerek bolmazdan öň öwreniň.",
      "Fatihany, salawaty we azyndan bir jynaza duasyny ýatlaň.",
    ],
    hadith: [
      {
        excerpt:
          "Ibn Abbas jynaza namazyny okady we «el-Fatiha»ny okady hem onuň sünnetdigini aýtdy.",
      },
    ],
  },
  {
    title: "Erkekler, aýallar we çagalar üçin dualar",
    summary: "Şol bir pygamberlik sözler — arap çalyşmalaryny merhuma laýyklaň.",
    body: [
      "Hisnul Muslim (we klasik hadis ýygyndylary) jynaza dualaryny esasan erkek görnüşinde ýazýar. Bu aýallar üçin aýratyn «ýasalan» dua diýmek däl. Esasy alymlar erkek lafzy şahsa niýet bilen galdyrmaga, ýa-da — has gowy we köplenç — grammatikany merhuma laýyk üýtgetmäge öwredýärler: لَهُ / هُ / هِ → لَهَا / هَا; عَبْدُكَ → أَمَتُكَ; ابْنُ أَمَتِكَ → ابْنَةُ أَمَتِكَ; we gyz çaga üçin اجْعَلْهُ → اجْعَلْهَا, شَفِيعًا مُجَابًا → شَفِيعَةً مُجَابَةً.",
      "Ölen aýal üçin käbir alymlar «äreninden has gowy ýanýoldaş» (زَوْجًا خَيْرًا مِنْ زَوْجِهَا) sözüne seresaplylyk maslahat berýärler — ol Jennetde äri bilen ýene birleşip biler; şol bendi aýryp goýup ýa-da umumy lafzy saklap bilersiňiz. Çagalar üçin diňe ulular üçin bagyşlanmaga gönükdirilen tekstlere däl-de, çaga mahsus Hisnul ýazgylaryny (hisn-160, hisn-161) ulanyň.",
      "«Erkeklerimizi we aýallarymyzy bagyşla» diýen umumy lafz (hisn-157) iki jynsy hem üýtgetmezden öz içine alýar. Biz hakyky tekstleriň grammatik laýyklaşdyrylmagyndan başga täze arapça oýlap tapmaýarys — baglanan ulular duasyny esas edip açyň we ýokardaky çalyşma kartasyny ulanyň.",
    ],
    madhhabNote:
      "Erkek görnüşleri niýet bilen saklamak hem, aýal görnüşlerine laýyklaşdyrmak hem esasy alymlaryň arasynda kabul edilýär. Ynançly bolmasaňyz, hisn-157 (erkekler we aýallar) ulanyň ýa-da ymamdan soraň.",
    actions: [
      "Ýatlaýan duaňyz üçin aýal çalyşmalaryny çalyşmagy meşgullanyp öwreniň.",
      "Balygata ýetmedikler üçin çaga mahsus dualary ulanyň.",
      "Uzyn tassyklanmadyk kitapçalardan has gowy hakykylygy saýlaň.",
    ],
    appLinks: [{ label: "Ulular jynaza duasy №1" }],
  },
  {
    title: "Şehitler, düşük we ýörite ýagdaýlar",
    summary: "Ýuwmak ýa-da jynaza hökümleri adaty ýagdaýdan tapawutlananda.",
    body: [
      "Söweşde ölen söweş meýdany şehitleri Uhuddan alnan nusgawy hökümde adaty guslsuz eşiklerinde jaýlanýar; Pygamber ﷺ Uhud şehitleriniň ganlary bilen ýuwulman jaýlanmagyny buýurdy (Sahih al-Buhari 1346). Sowapda «şehit» diýilýän beýleki toparlar (mysal üçin, waba, gark bolmak) adatça ýuwulýar we jynaza okalýar — çäk ýagdaýlarda alymdan soraň.",
      "Düşük ýa-da öli doglan bäbek üçin mekdepler jynaza namazy we doly ýuwmak haçan ulanylýandygy boýunça tapawutlanýar (köplenç tanalýan görnüş ýa-da ruh üfleniş basgançagy bolandymy diýen bahalamaga bagly). Bir hadis düşügiň üstünde namaz okamagy we ene-ata bagyşlamak we rehim dilemegi höweslendirýär (Ebu Dawud 3180). Çaklamak ýerine mezhebiňiziň jynaza komitetine eýeriň.",
      "Musulman däl garyndaşlara musulman jynaza namazy okalmaýar; rehimlilik, kanuny jaýlamak kömegi (ulanylýan ýerde) we şahsy gynanç — möminleriň ybadat namazyndan aýrydyr. Ýörite ýagdaýlary hemişe bilimli ýerli gollanma bilen tassyklaň.",
    ],
    madhhabNote:
      "Söweş meýdany şehitligi, düşük basgançaklary we öli doglan bäbegiň üstünde namazyň kesgitlemeleri mekdebe görä üýtgeýär. Bu mowzuk meseleleri belläýär — ol fatwa däl.",
    disclaimer:
      "Ýörite hökümler duýgur. Hereket etmezden öň bilimli alymdan ýa-da jemgyýetiňiziň jynaza hyzmatyndan tassyklaň.",
    actions: [
      "Alymyň görkezmesine garşy söweş meýdany şehidini ýuwmaň.",
      "Düşük ýa-da öli dogluş ýagdaýlary barada jynaza komitetinden soraň.",
    ],
    hadith: [
      {
        excerpt:
          "Pygamber ﷺ Uhud şehitleriniň ganlary bilen jaýlanmagyny buýurdy we olar ýuwulmady.",
      },
      {
        excerpt: "Düşügiň üstünde jynaza namazy okalýar we ene-ata bagyşlamak we rehim dilenýär.",
      },
    ],
  },
  {
    title: "Gäýybana jynaza",
    summary: "Pygamber ﷺ jeset uzakda bolanda Negus üçin namaz okady.",
    body: [
      "Jabir habar berýär: Pygamber ﷺ Sahabalaryna çykdy, olary hatara düzdi we daşary ýurtda ölen Habesh şasy Negus (el-Nejaşi) üçin dört takbir okady (Sahih al-Buhari 1334; Sahih Muslim 952). Bu gäýybana jynaza namazynyň (alā al-ghā'ib) esasy delilidir.",
      "Mekdepler bu nusgany näçe giň ulanmak boýunça tapawutlanýarlar: käbirleri ony Negus ýaly ýagdaýlar bilen çäklendirýärler (ýerli musulman namazy bolmadykda), beýlekileri jeset uzakda bolanda has giň rugsat berýärler. Jeset bar we jemagat namaz okaýan bolsa, ýerli jynazany geçirmäň. Mezhebiňizde gäýybana namaz haçan laýykdygyny ynamdar ýerli alymdan soraň.",
      "Görnüşi — şol bir dört takbirli namaz; niýet — gäýyb merhum üçin. Şol bir hakyky dualary ulanyň, jynsy gerek bolsa laýyklaň.",
    ],
    madhhabNote:
      "Gäýybana jynazanyň gerimi belli tapawut nokady. Jemgyýetiňizdäki bilimli ymamlar tejribesini ileri tutuň.",
    actions: [
      "Jeset bar bolanda hemişe ýerli namaz okaň.",
      "Gäýybana jynazany köpçülik çäresi hökmünde guramazdan öň soraň.",
    ],
    hadith: [
      {
        excerpt: "Pygamber ﷺ Negus üçin jynaza namazyny okady we dört takbir aýtdy.",
      },
      {
        excerpt:
          "Allahyň Resuly ﷺ Sahabalary hatara düzdi we Negus üçin dört takbir bilen namaz okady.",
      },
    ],
  },
  {
    title: "Ölüm ýatagyna — soňky sözler",
    summary: "Ölüme ýakyn adamy ýuwaşlyk bilen «la ilaha illallah» diýmäge höweslendiriň.",
    body: [
      "Pygamber ﷺ: «Ölüme ýakynlaryňyzy «la ilaha illallah» diýmäge höweslendiriň» diýdi (Sahih Muslim 916; Ebu Dawud 3117). Hisnul Muslim kimin soňky sözleri «Allahdan başga ybadat edilmäge mynasyp hiç kim ýok» bolsa, ol Jennete girer diýen görkezmäni saklaýar (hisn-153, Ebu Dawud 3116-dan).",
      "Ýuwaşlyk bilen we gatylyksyz höweslendiriň; mejbur etmäň we jedelleşmäň. Ölüme ýakynlary Hisnul Muslimda saklanan umyt sözleri bilen hem ynjalyp bolýar (hisn-150–152). Jan alynanda gözleri ýumuň we göz ýummak duasyny ulanyň (öňki mowzuk).",
      "Ýokary sesli aglamakdan we Allahy gaharlandyrýan sözden gaça duruň. Maşgala gowy zat aýtmaly, çünki perişdeler olaryň sözlerine amin diýýärler (Sahih Muslim 920).",
    ],
    actions: [
      "Ölüme ýakyn adama şehadeti ýuwaşlyk bilen ýatlatyň.",
      "Otagy arkaýyn saklaň we gowy söz bilen dolduryň.",
    ],
    hadith: [
      {
        excerpt: "Ölüme ýakynlaryňyzy: la ilaha illallah diýmäge höweslendiriň.",
      },
      {
        excerpt:
          "Kimin soňky sözleri «Allahdan başga ybadat edilmäge mynasyp hiç kim ýok» bolsa, ol Jennete girer.",
      },
    ],
    appLinks: [{ label: "Ömrüň umyt dualary" }, { label: "Gözleri ýummak" }],
  },
  {
    title: "Teselli we ýas tutýanlar",
    summary: "Dirileri pygamberlik musibat duasy bilen ynjaladyň.",
    body: [
      "Umm Salamah, Allahyň Resulynyň ﷺ: «Hiç bir musulman musibete uçrap, Allahyň buýranyny aýtmasa — „Biz Allaha degişli we Oňa gaýdarys. Eý Allah, musibetimde maňa sowap ber we ony maňa has gowy zat bilen çalyş“ — Allah ony olara has gowy zat bilen çalyşar» diýendigini habar berdi (Sahih Muslim 918). Hisnul Muslim bu lafzy saklaýar (hisn-154).",
      "Gysga, dogry sözler bilen teselli beriň; maşgalany myhmançylyk ýüküne salman, merhumyň maşgalasyna nahar taýýarlaň (Ebu Dawud 3132 — Jaferiň maşgalasy baradaky habar). Subutnamasyz bellenen günli bidgat dabaralardan gaça duruň, şahsy dua, sadaka we rehimliligi dowam ediň.",
      "Gözýaşly gynanç rugsat edilýär; aglamak, ýüze urmak we eşik ýyrtmak gadagan edilipdi. Jaýlanandan soň dul aýallara, ýetimlere we garaşlylara kanuny kömek ediň.",
    ],
    actions: [
      "Ýas tutýanlara musibat duasyny öwrediň.",
      "Zýýapat garaşmak ýerine nahar we işlerde kömek ediň.",
      "Merhum üçin arkaýyn dua we sadakany dowam ediň.",
    ],
    hadith: [
      {
        excerpt:
          "Hiç bir musulman musibete uçrap, Allaha gaýdyş baradaky buýrulan sözleri aýdyp, has gowy zat bilen çalyşmagy dilese, Allah ony has gowy zat bilen çalyşar.",
      },
    ],
    appLinks: [{ label: "Sadaka maksatlary" }],
  },
];
