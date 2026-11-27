// Turkmen translation overlay for the Learn "Jahannam" content. Mirrors the order of
// its English source in ../jahannam*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  JahannamDuaEntry,
  JahannamGateEntry,
  JahannamHadithEntry,
  JahannamNameEntry,
  JahannamReferenceEntry,
  JahannamReflectionEntry,
  JahannamTopic,
  JahannamVerseEntry,
} from "../../types/jahannam";
import type { DeepPartial } from "./localize";

export const JAHANNAM_CORE_TOPICS_TK: DeepPartial<JahannamTopic>[] = [
  {
    title: "Giriş",
    summary: "Allah bize Jahannam hakda ýol görkezmek üçin umytdan düşürýär.",
    body: [
      "Jahannam - köplenç dowzah ýa-da ot diýlip terjime edilýär - ahyretde Allanyň Gurhanda we Resulynyň üsti bilen beýan eden jezasydyr. Heartüregi gorky bilen ezmeli däl-de, gapylar açyk wagty ýürekleriň oýanyp, yza gaýdyp, rehimdarlyk ýoluny saýlamagy üçin bize aýdýar.",
      "Rehimdar Rebbiň ot hakda näme üçin asla gürleýändigine düşünmäge kömek edýär. Duýduryşyň özi rehimdir: garaňkyda öňdäki gaýa hakda aýdylýan adama howp däl-de, sowgat berildi. Jahannam hakda her aýat, merhemeti bilen gullaryny gaýdyp gelmezden ozal çagyrýan Allahdyr.",
      "Şonuň üçin duýduryşlar ylhamyň dowamynda toba, bagyşlamaga we Allanyň rehim-şepagatyna umyt etmek bilen jübütlenendir. Gurhan, ýakyn ýerde, bagy, tawabanyň açyk gapysyny we Allanyň gaýdyp gelýänlere bolan söýgüsini ýatlamazdan, Ody seýrek ýatlaýar. Maksat dogrulyga alyp barýan jogapkärçilikdir - hiç haçan umytdan düşmäň.",
      "Jahannama ynanmak, görünmeýän (al-geýb), ylahy adalata we ahyret gününe ynanmagyň bir bölegidir. Bu, saýlanlarymyza ähmiýet berýär we Jennetdäki umydy günä çynlakaýlygy bilen deňleşdirýär, şeýdip imanly umyt bilen gorkynyň arasynda gezer - Allanyň rahmetine umyt edip, kemçiliklerine gözegçilik eder.",
      "Sünni ynançlarynyň esasy rahatlygy bu modulyň içinden geçýär: diňe Allaha iman edip ölýänler, hatda günä ýüklenen hem bolsa, otda ebedi galmazlar. Allanyň rahmeti we rugsat berýän şepagaty bilen, günäkär imanlylar ahyrsoňy çykarylýar; diňe imany ret edip ölýänler galýar. Şeýlelik bilen Jahannam öwrenmek, imanlylar üçin ahyrsoňy rehimdarlyga nädip ýetmelidigini öwrenmekdir.",
      "Bu modul, tekstleriň aýdyň beýan edýän zatlaryny görkezýär, alymlaryň tapawutlanan ýerlerinde dogruçyl bellik edýär, diňe hakyky subutnamalary görkezýär we sizi yzygiderli tawba, ýagşy amallara we Allaha bil baglamaga gönükdirýär.",
    ],
    quran: [{}, {}, {}],
    appLinks: [{}, {}],
  },
  {
    title: "Näme üçin Allah Jahannam ýaratdy",
    summary: "Ylahy adalat, jogapkärçilik we erkin saýlamagyň netijeleri.",
    body: [
      "Jahannam, Allanyň kämillik adalatynyň ýüze çykmagy hökmünde bar. Zalymlaryň we ezilenleriň, yhlasly we dönükleriň hemmesiniň bir soňuna çykan älemi adalatly bolmazdy. Allatagala adalatly bolany üçin, her bir ýalňyşlyga jogap berilýän we her ýagşylyga hormat goýulýan gutarnykly hasap bolmaly.",
      'Allanyň hiç kime zulum etmeginiň esasy sebäbi. Oda giren her bir adam, öz çözgüdi, toba edilmedik saýlawlary bilen girýär - hiç haçan esassyz karar bilen. Gurhan: "Allatagala asla zulum etmeýär, halk özlerine zulum edýär" (10:44). Hiç kim etmedikleri üçin ýa-da mynasyp bolanlary üçin jezalandyrylmaýar.',
      "Adamlar garaňkyda galmady. Allatagala olara akyl berdi, habarçylar iberdi we anyk görkezmeleri açdy, soň olary kabul etmek ýa-da ret etmek üçin hakyky erkinlige hormat goýdy: 'Kim islese iman etsin; kim islese, imansyz bolsun '(18:29). Hakykaty ret etmekde, sütemde ýa-da toba etmezden uly günäde bolmak, ahyretde netijäni getirýär, sebäbi saýlamagyň hakykatdanam özüne mahsusdygy.",
      "Şeýle-de bolsa, bu ýerde rehimdarlyk adalaty düzýär. Allatagala höküm çykarmazdan ozal duýduryş berýär, yzyna gaýtarylmak üçin hasap bermegi gijikdirýär, soralanda aňsatlyk bilen bagyşlaýar we bir günä ýazga geçirilende bir ýagşy ýagşylygy birnäçe gezek sylaglaýar. Adalaty hiç wagt rehimdarlygyndan aýrylmaýar.",
      "Jahannamyň näme üçin barlygy hakda oýlanmak, takwany (Taňry aňy) artdyrmaly we toba etmek üçin henizem pursat bolan durmuşyň her güni üçin minnetdarlygy çuňlaşdyrmalydyr. Heartüregi birbada çynlakaý we umytly etmek üçin - hiç haçan umytsyzlyk bilen ysmaz etmek üçin.",
    ],
    quran: [{}, {}, {}],
    hadith: [{}],
    appLinks: [{}],
  },
  {
    title: "Ahyret hakykaty",
    summary: "Ölümden höküme çenli - her bir basgançak hakyky we akida bilen baglanyşyklydyr.",
    body: [
      "Jahannama dogry düşünmek üçin has uly syýahatda nirede oturandygyny görmäge kömek edýär. Yslam ölümden soň aýdyň yzygiderliligi öwredýär: jan bedeni terk edýär, soňra barzak (mazaryň aralyk ömri) başlaýar, soň jesetler direlende direliş, ähli ýaradylyşlaryň ýygnanmagy, amallaryň barlanylýan hökümi, Terezide amallaryň ölçegi (al-Mizan), köpriniň kesilmegi we Allahyň karary, ahyrsoňy Allanyň karary. rehimdarlyk.",
      "Bu etaplaryň her biri, esasy sünni mezhebinde Gurhan we hakyky sünnet esasynda tassyklanýar. Bu wagt çyzgysy nyşan ýa-da hekaýa däl; ahyret gününe ynanmagyň bir bölegi hökmünde ynanmak hakykat we muny bilgeşleýin inkär etmek diňe bir amal däl-de, ynanç meselesidir.",
      "Roadoluň hemmesini görmek Ody täzeleýär. Syýahatyň ahyrynda her bir adamyň eýýäm syýahat edýän bir nokady - bu günki saýlawlaryň abstrakt däldigini aňladýar. Olar şol ýoluň basgançaklary we henizem ugrukdyrmak biziňki.",
      "Bu yzygiderliligi bilmek imanlylara gorky däl-de, taýynlyk görmäge kömek edýär: ölümi sagdyn ýatlamak (dhikr al-mawt), ýygnanyşykdan ozal ýalňyşlyklary düzetmek we hereket gapysy açyk wagty ýagşy amallaryň hasabyny doldurmak. Ölüm şol gapyny ýapýar; ondan soň hiç zat goşup bolmaz.",
    ],
    quran: [{}, {}],
    actions: [
      "“Aqeedah” -y öwrenmegiň her tapgyryny öwreniň we ynamy gündelik saýlawlar bilen baglanyşdyryň.",
      "Rehim-şepagat umydyny ýatdan çykarman ölümi (dhikr al-mawt) ýatlamagy artdyrmak.",
    ],
    appLinks: [{}, {}, {}, {}, {}, {}],
  },
  {
    title: "Jähennemiň atlary",
    summary:
      "Gurhanyň atlary manyly - alymlaryň hersiniň aýratyn derejedigi ýa-da däldigi barada tapawutlanýar.",
    body: [
      "Gurhan dowzaha birnäçe at bilen degişlidir we bu diňe gaýtalanma däl. Arap dilinde bir at köplenç aç-açan düşündiriş berýär, şonuň üçin her bir at görkezýän hakykaty hakda bir zat öwredýär. Olaryň arasynda Jahannam, Jaheem, Sakar, Sair, al-Hutamah, al-Hawiyah we Lazaa bar.",
      "Her bir at, agyrlygyň başga tarapyna penjire açýar. Jaheem we Sair güýçli ýanýan, ot ýakdy; Sakar, hiç zady ýakmaýan we galdyrmaýan zat; al-Hutamah, oňa zyňylan zady döwýän döwüji; al-Hawiýa, biriniň düşýän çuň çukury; we arassa, ýalpyldawuk alaw Lazaa. Atlary bilelikde okamak, ýüregiň aňsatlyk bilen ünsden düşürip bilmeýän düýpli suratyny döredýär.",
      "Ibn Katir we al-Tabari ýaly tafsiriň nusgawy alymlary bu atlary arap köklerinden düşündirýärler we kesgitli tehniki sanaw hökmünde garamak däl-de, aýatyň kontekstinde ara alyp maslahatlaşýarlar.",
      "Bu ýerde seresap bolmaly. Käbir soňraky ýazyjylar her bir ady dowzahyň aýratyn, derejeli 'derejesi' hökmünde görkezýärler, käte jikme-jik diagrammalar bilen. Bu, Gurhanda ýa-da ylalaşylan hadysda görkezilen aç-açan gözegçilik sanawy däl-de, ylmy düşündirişdir. Deňagramly çemeleşme, tekstleriň aslynda berýän manylaryny öwrenmek we spekulýatiw kartalary takyk görkezmekden saklanmakdyr.",
      "Atlary öwrenmegiň maksady bilesigelijiligi kanagatlandyrmak däl-de, ýüregi ýumşatmak we bu modulyň görkezýän rehimine tarap hereket etmekdir. Her atyň Gurhanda ýüze çykmagy, mazmuny we tafsir gysgaça mazmuny üçin doly atlar ýygyndysyna göz aýlaň.",
    ],
    quran: [{}, {}],
    appLinks: [{}],
  },
  {
    title: "Jähennemiň derejeleri",
    summary: "Dürli jeza derejesi - takyk gurluşy tekstlerde doly jikme-jik däl.",
    body: [
      "Gurhanyň aç-açan aýdýan ýörelgesi, jezanyň deňeşdirilendigi: Otdakylaryň hemmesi muny deň derejede başdan geçirmeýär. 'Hemmeler üçin edenlerine görä derejeler bolar' (6: 132). Munuň özi adalatyň beýanydyr - az zulum eden adama kän zulum eden ýaly garalmaýar.",
      "Hakyky sünnet şol bir ýörelgäni görkezýär. Pygamberimiz, otda iň az jezalandyrylan adamy, aýaklarynyň aşagyndaky iki ember ýerleşdirilen, beýnisi gaýnap duran adam hökmünde häsiýetlendirdi, emma ähli halkyna azar bermekde iň ýeňil adamdy (Sahih al-Buhari 6562). Iň az bolsa, aň has uly derejeleriň nähili bolmalydygyny we şu gün yza gaýdyp gelmegiň näçeräk sebäbine düşünýär.",
      "Şol bir wagtyň özünde, ylham imanlylara ýat tutmaga mejbur bolan dowzahyň gurluşynyň doly, sanly kartasyny bermeýär. Alymlar dürli aýatlardan we hasabatlardan alnan derejeleri, çuňluklary we kategoriýalary ara alyp maslahatlaşdylar, ýöne bularyň köpüsi ylalaşylan, aç-açan tekst däl-de, düşündiriş bolup galýar.",
      "Twoöne iki zat belli. Birinjiden, bu sütem (zulm), şirk we toba etmezden dowam edýän uly günä berk duýduryş berýär. Ikinjiden, Allanyň rehim-şepagaty we bagyşlanmagy, çyn ýürekden gaýdyp gelen her bir adam üçin ölüm pursatyna çenli açyk bolmagyny ýatdan çykarmaly däldir. Derejeler barada öwrenmegiň maksady, saýlaw galýarka has ýeňil ýoly saýlamakdyr.",
      "Iş ýüzünde, bu “ýedi dereje” ýa-da şuňa meňzeş shemalaryň jikme-jik sanawlaryna kesgitlenen doktrinanyň ýerine alymlaryň pikiri hökmünde garamagy we hakykatda goraýan zatlara üns bermegi aňladýar: iman, toba we dogruçyl işler.",
    ],
    quran: [{}, {}],
    hadith: [{}],
    disclaimer:
      "Käbir kitaplarda tapylan dowzahyň derejeleriniň diagrammalary biragyzdan däl-de, alymlaryň düşündirişini görkezýär.",
  },
  {
    title: "Jähennemiň derwezeleri",
    summary: "Sevenedi derweze - Gurhanyň aýdýanlary we düşündirişi nirede tapawutlanýar.",
    body: [
      "Jahannam hakda bir jikme-jiklik Gurhanda aç-açan we birkemsiz beýan edilýär: 'Hakykatdanam, dowzahyň ýedi derwezesi bar; çünki her derwezäniň kesgitlenen bölegi \"(15:44). Şonuň üçin ýedi derwezä ynanmak çaklamalara däl-de, aç-açan aýanlyga esaslanýar.",
      "Bu aýat iki zady tassyklaýar: ýedi derwezäniň bardygyny we girýänleriň arasynda paýlanýandygyny. Tafsiriň nusgawy alymlary paýlaşmagyň nämäni aňladýandygyny - adamlaryň kategoriýalaryna, amallara laýyk jeza derejelerine ýa-da ikisine-de degişlidigini ara alyp maslahatlaşýarlar. Bölünmegiň aňyrsyndaky paýhas, Allaha degişlidir, adalat her bir adamy özüne degişli ýerde goýýar.",
      "Ynamyň nirede gutarýandygyny bellemek möhümdir. Käbir eserler her bir derwezäni belli bir günä ýa-da topara belleýär. Bu aýratyn tabşyryklar has irki çeşmelerde birmeňzeş kesgitlenmedi, şonuň üçin olar pygamberlik kesgitlemesi hökmünde däl-de, aýry-aýry alymlaryň pikirleri hökmünde hödürlenýär.",
      "Derejelerdäki ýaly, derwezeleriň sapagy binagärlik däl-de, ahlaklydyr: Oda tarap barýan köp gapy bar we olaryň hemmesinden howpsuz bolmagyň ýoly birmeňzeşdir - çyn ýürekden ynanmak, uly günälerden gaça durmak we süýşüp başlanda çalt toba etmek.",
    ],
    quran: [{}],
    appLinks: [{}],
  },
  {
    title: "Jahannamyň beýany",
    summary: "Ot, ýylylyk, zynjyrlar, ökünç - sensasiýa däl-de, hormat bilen görkezilýär.",
    body: [
      "Gurhan we hakyky sünnet Jahannamany aç-açan, anyk dil bilen suratlandyrýar we bir sebäbe görä şeýle edýär: adam ýüregi abstrakt ideýalara däl-de, suratlandyryp boljak şekillere has täsir edýär. Düşündirişler - güýçli ot, çydap bolmajak yssy, çäklendirilen iýmit we içgi, zynjyrlar, garaňkylyk we çuňňur gynanç - howpy bizi ondan daşlaşdyrmak üçin hakyky etmek üçin niýetlenendir.",
      "Beýan etmeleriň arasynda içmek üçin berlen gaýnag suw, zakumyň ajy agajy iýmit, otdan kesilen eşikler we adamyň ozal bil baglaýan ähli rahatlyklaryndan aýralyk bar. Pygamberimiz, bu yssynyň bilýänlerimizden näderejede ýokarydygyny aýdyp, bu dünýäde ýakýan odymyzyň ahyret odunyň ýetmiş böleginiň bir bölegidigini aýtdy (Sahih al-Buhari 3265).",
      "Bu düşündirişler, ahyreti boşadýan metaforalar däl-de, hakyky duýduryşlardyr. Sünni alymlar, hakykatlary tassyklaýarlar, görünmeýän zatlaryň takyklygyny Allanyň bilimine goýýarlar; imanly adamyň wezipesi, duýduryşy bölmek däl-de, ýüregine düwmekdir.",
      "Şeýle parçalary okamak üçin edep (adab) bar. Olara kiçigöwünlilik, Alladan gorkmak we toba etmäge we gaçybatalga bermäge itergi berilýär - haýran galdyryjy täsir bilen däl we hiç haçan umytdan düşmeýär, sebäbi duýduryşyň ähli maksady henizem ondan gaça durmaga wagtymyz bar.",
      "Bu düşündirişlerdäki iň agyr tema ökünmekdir. 'Käşgä bolan bolsam ...' hereketiň wagty gutaranda aýdylýar. Indi bu puşmanlygy eşitmekdäki rehimdarlyk, şu günki günümizi üýtgedip bilýän bolsa, \"diňe\" bolsa hereket edip bileris.",
    ],
    quran: [{}, {}, {}],
    hadith: [{}],
    appLinks: [{}],
  },
  {
    title: "Kim duýduryş berilýär?",
    summary: "Gurhanda we Sünnetdäki kategoriýalar - şahsyýetlere höküm däl.",
    body: [
      "Gurhany üns bilen okaýan, duýduryşlarynyň ady belli adamlara däl-de, özüni alyp barşyna we garaýşyna gönükdirilendigini görýär. Hakykat aýdyň bolansoň, imansyzlygy dowam etdirýänlere, içini inkär edip, daşardan imany aýdýan ikiýüzlülere, başgalaryň hukuklaryny basýan zulum edýänlere, boýun egmäge buýsanýan tekepbirlere we hiç haçan toba etmän uly günä bilen ölýänlere duýduryş berýär.",
      "Adamlara däl-de, kategoriýalara gönükdirilen bu bilgeşleýin we rehimli. Geçmişine garamazdan her bir diri adam üçin gaýdyp gelmek gapysy açyk bolýar, sebäbi ölüme çenli hiç kimiň faýly ýapylmaýar. Duýduryş ýoly dowam etdirýär, şonuň üçinem henizem ýörän her kim gidip biler.",
      'Şol sebäpli Yslam, haýsydyr bir şahsyýetiň soňky ykbalyny yglan etmäge - "bu adam otda" diýmäge rugsat bermeýär - seýrek ýagdaýlardan başga ýagdaýlarda, Allah ýa-da Resulynyň hakyky wahýda aç-açan beýan eden halatlaryndan başga ýagdaýlarda. Heartsüreklere we ahyrýetlere baha bermek diňe Allaha degişlidir. biziň wezipämiz öz hasabymyzdyr.',
      "Şonuň üçin her duýduryşy okamagyň dogry usuly ony içeri öwürmekdir: 'muny kim suratlandyrýar?' ýöne 'bularyň haýsydyr biri meni suratlandyrýarmy, şu gün näme üýtgederin?' Kim bolsaňyzam, Allaha gaýdyp gelmek çakylygy şu wagt açyk - ertir hiç kime wada berilmeýär.",
    ],
    quran: [{}, {}, {}],
    appLinks: [{}],
  },
  {
    title: "Esasy günäler",
    summary: "Kabair - çyn ýürekden tawba talap edýän agyr günäler.",
    body: [
      "Alymlar günäleri iki topara bölýärler we tapawudyna düşünmek hem çynlakaýlygy, hem rahatlygy getirýär. Esasy günäler (al-kabair), Allahyň ýa-da Resulynyň, ot howpy, nälet, Allanyň gahary ýa-da şirk, adam öldürmek we gyzyklanmak ýaly belli bir jezasy bolan agyr netijelerdir. Uly bolmadyk günäler (al-sagha'ir), bu çäkden çykmaýan kiçijik süýşmelerdir.",
      "Reliefeňillik, ikisiniň nähili baglanyşygyndadyr. Allatagala imanly uly günälerden gaça dursa, kämillik ýaşyna ýetmedikleriň adaty ybadatlar bilen süpüriljekdigini wada berýär: 'Gadagan edilen esasy günälerden gaça dursaň, has az günäleriňi aýyrarys' (4:31). Namaz üçin doga, Juma'dan Juma'a, Remezan aýyndan Remezan aýyna çenli uly günälerden gaça durýança, olaryň arasyndaky zatlary arassalaýar.",
      "Şonuň üçin esasy günäler ünsi jemlemelidir: gündelik ybadat akymynda ýuwulman, bilgeşleýin, çyn ýürekden toba etmegi talap edýänlerdir. Yzyna gaýdyp durman, jana howp salýarlar; taşlandy we toba etdi, bagyşlandy.",
      "Ine, bularyň hemmesine gözýetim bar: şirkde ölmekden başga her bir günä - uly ýa-da kiçi - islese Allanyň günäsine düşýär. 'Hakykatdanam, Allah Öz bilen gatnaşygy bagyşlamaýar, ýöne isläninden pes zady bagyşlaýar' (4:48). Hiç bir imanly adam, uly günäleriniň rehimdarlykdan daşdadygy barada netije çykarmaly däldir.",
      "Bu moduldaky her bir uly günä mowzugy, kesgitlemesini, subutnamalaryny, näme üçin agyrdygyny, toba we gaçmagyň anyk ýoluny berýär - hemişe şol bir açyk gapyda gutarýar.",
    ],
    quran: [{}, {}, {}],
    hadith: [{}],
    appLinks: [{}, {}],
  },
  {
    title: "Diliň günäleri",
    summary:
      "Gaýrat etmek, ýalan sözlemek, masgaralamak - etmek aňsat we yzyna gaýtarmak kyn günäler.",
    body: [
      "Dil az, ýöne netijeleri gaty uly; adam birnäçe söz bilen ynam döredip ýa-da abraýy ýok edip, ýüregi rahatlandyryp ýa-da çuňňur ýaralap biler. Şonuň üçin Gurhan we Sünnet sözleriň günälerine ýygy-ýygydan gaýdyp gelýärler: gybat etmek (gibah), töhmet (buhtan), erteki götermek (namimah), ýalan sözlemek, masgaralamak we ýalan kasamlar.",
      "Gaýrat etmek, doganyňyz ýa-da aýal doganyňyzyň halamajak bir zadyny aýtmagy aňladýar, hatda hakykat bolsa-da, ýalan bolsa, töhmetiň has erbet günäsi bolar. Gurhan özüne haýran galdyryjy şekilleriň birini berýär: ony ölen doganynyň etini iýmek bilen deňeşdirýär (49:12). Şeýle usul bilen çarçuwalanan günä, tötänleýin ýitýär.",
      "Bu günäleri şeýle howply edýän zat, olaryň nähili aňsat we adatydygy. Adamlar adaty söhbetdeşlikde ikinji gezek pikir etmän içeri girýärler, şonuň üçin Pygamber alaýhyssalam imany özüni goramak bilen baglanyşdyrdy: 'Kim Allaha we ahyret gününe iman etsin, gowy gürlesin ýa-da dymsyn'. Geplemezden ozal ýönekeý arakesme hakyky ybadatdyr.",
      "Diliň günäsinden toba etmek adaty şertlere eýerýär - sakla, ökün, gaýdyp gelmezlik kararyna - başga biriniň hukugy goşulanda goşmaça ölçeg bilen. Adyny arassalamak ýa-da günäsini geçmek üçin uly zyýan ýetirmezden edilip bilinjek bolsa, bu tobaň bir bölegidir; alymlara habar bermek diňe şikesleri hasam çuňlaşdyrar, alymlar muňa derek olar hakda gowy gürlemegi, ýok wagtynda goramagy we bagyşlanmagyny dileýärler.",
    ],
    quran: [{}, {}],
    hadith: [{}],
    actions: [
      "Geplemezden ozal soraň: Dogrymy? Zerurmy? Bu mylaýymmy?",
      "Eger kimdir birini masgaralasaň, olar üçin dua et we mümkin boldugyça bagyşlanmagyny gözle.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Başgalaryna garşy günäler",
    summary: "Adamlaryň hukuklary öwezini dolmagy talap edýär - diňe Allaha toba etmek däl.",
    body: [
      "Yslam, bergilerimizi iki görnüşe bölýär: Allanyň (huqq Allah) we adamlaryň hukuklary (huqq al -ibad). Zulum (zulm), adalatsyzlyk, ynamlary bozmak, söwdada aldamak, aýlyk haklaryny tölemek, tölenmedik bergiler we maşgala gatnaşyklaryny kesmek - bularyň hemmesi adamlaryň hukugyna degişlidir we bu ahyretde aýratyn çynlakaý ähmiýete eýe.",
      "Munuň sebäbi düýpli hadysda görkezilýär. Pygamberimiz, hakykatdanam bankrot adamy kyýamat gününe doga, agyz beklemek we haýyr-sahawat bilen gelýän, ýöne baýlygy kemsidýän, töhmet atýan, bikanun alyp, gan dökýän adam hökmünde suratlandyrdy. Pidalaryna eden ýagşy işleri gutarýança tölenýär, soň bolsa günäleri oňa ýüklenýär we oda taşlanýar (Sahih Musulman 2581). Ynsan ybadatda baý bolup, başgalara nähili garamagy bilen zaýalanyp biler.",
      "Bu toba hakda möhüm bir sapak berýär: Allaha ýüzlenmek zerurdyr, ýöne ynsan hukugy bozulanda, özi ýeterlik däl. Zalym adamyň talaby çözülýänçä ýa-da bagyşlanýança saklanýar. Şonuň üçin bu ýerde toba etmek, ökünmek we çözmekden başga-da dördünji şert bar - bergiňizi yzyna gaýtarmak.",
      "Iş ýüzünde alnan zady ýa-da gymmaty yzyna gaýtarmak, bergileri ýuwaş-ýuwaşdan tölemek, zeper ýeten abraýyňyzy dikeltmek we kesilen garyndaşlary bilen ýaraşmak diýmekdir. Onda-da rehimdarlyk bar: dikeltmegiň her ädiminiň özi ýagşy amaldyr we Allatagala döwülen zady düzetmek üçin yhlasly ýüregi ýeňilleşdirýär.",
    ],
    quran: [{}, {}],
    hadith: [{}],
    actions: [
      "Nädogry edenleriňizi sanaň we şu hepde abatlamak üçin ädim ätiň.",
      "Dolandyryp bilýän bolsaňyz, ownuk karzlary hem töläň.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ikiýüzlülik",
    summary: "Ynamdaky esasy ikiýüzlilik - we özüni alyp barşynda ikiýüzlüligiň aýratynlyklary.",
    body: [
      "Alymlar ikiýüzlüligiň iki görnüşini tapawutlandyrýarlar we olary biri-birinden uzaklaşdyrmak ýalan rahatlygyň we ýalan howsalanyň öňüni alýar. Birinjisi, ynanjyň esasy ikiýüzliligi (nifaq i'tiqadi): içini inkär edip, yslamy daşardan görkezmek. Bu, Gurhanyň şeýle adamlary 'otuň iň çuňlugyna' ýerleşdirmegi (4: 145) ikiýüzlülikdir, aslynda olar maskanyň aňyrsynda kapyr bolup ölüpdirler.",
      "Ikinjisi has az, özüni alyp barşyň ikiýüzliligi (nifaq 'amali): ikiýüzlüleriň özüni alyp barşyna meňzeýän häsiýetler, hatda imany hakyky adamda-da. Pygamberimiz belli alamatlara at dakdy - 'gürläninde ýalan sözleýär, döwjekdigini wada bereninde we özüne ynanylanda dönüklik edýär' - we başga bir rowaýatda dawa-jenjeliň üstüni açdy. Bir imanly bu zatlara düşüp biler we henizem imanly bolup biler, ýöne olardan goranmak üçin çynlakaý duýduryşdyr.",
      "Bu tapawut, mowzugy nähili ulanýandygymyz üçin möhümdir. Özüňi alyp baryş alamatlary, başgalaryna degmek üçin bellik hökmünde däl-de, özi üçin aýna hökmünde berilýär. Pygamber alaýhyssalam we sahabalar ýüregiň gizlenendigi we üýtgäp biljekdigi sebäpli ikiýüzlülikden gorkýardylar.",
      "Şeýlelik bilen sagdyn jogap içerde: adamyň dogruçyllygyny, wadalara wepalylygyny we ygtybarlylygyny barlamak we Alladan çyn ýürekden soramak (ikhlas). Adamyň içindäki zatlary diňe Allatagala bilýär we belli adamlary ikiýüzlilikde aýyplamak, olara garşy agyr jenaýatdyr.",
    ],
    quran: [{}, {}],
    hadith: [{}],
    disclaimer:
      "Şahsy adamlary nifakda günäkärlemäň. Tekstler bileleşigi duýdurýar; arassalanmak özi bilen başlaýar.",
  },
  {
    title: "Jezalar agzaldy",
    summary: "Tekstleriň beýan edýän zady - Alladan gorkup okaň we rehimine umyt ediň.",
    body: [
      "Gurhan we sünnet belli bir ýalňyşlyklar üçin - riba iýýän, päk aýallara töhmet atýan, baýlygy saklaýan we hakyny saklaýan, namazy äsgermezlik edýän we uly günäleri dowam etdirýänler üçin belli netijeleri görkezýär. Aýratynlyk aýdyňlygyň bir görnüşidir: hiç kimiň eden işi barada duýduryş berilmändigini aýdyp bilmeýär.",
      "Bu netijeleriň käbiri gabyrda (adhab al-qabr), beýlekisi Jahannamyň özünde beýan edilýär. Esasy sünni akyda, bu görünmeýän zatlaryň takyk “nädip” ynsan hyýalyna däl-de, Allanyň bilimine ynanyp, ikisiniň hakykatyny tassyklaýar.",
      "Bir imanlynyň bu zatlar bilen nähili meşgullanmagy möhümdir. Maksat hiç haçan grafiki jikme-jikliklere ünsi çekmek ýa-da ýüregiň çümmegine ýol bermek däl; duýduryşy kabul etmek, ulanylýan zatlardan toba etmek we energiýany hakykatdanam goraýan amallara gönükdirmekdir. Şonuň üçin bu modul bilkastlaýyn jeza, gorag, toba we rehimdarlyga has köp ýer berýär.",
      "Gysgaça aýdylanda, agzalan jezalardan dogry çykmak gorky däl-de, soragdyr: 'Men muny edýärinmi - eger şeýle bolsa, nädip saklamaly we dogry etmeli?' Şu gün dogruçyl jogap berlen duýduryş eýýäm rehimli işini etdi.",
    ],
    quran: [{}, {}],
    appLinks: [{}, {}],
  },
  {
    title: "Jähennemden gorag",
    summary: "Tewhid, Namaz, tawba, haýyr-sahawat, Gurhan we du'a - bu modulyň ýüregi.",
    body: [
      "Allhli duýduryşlardan soň meseläniň özeni: Jahannam adamyň goralmaly bir zady we Yslam bu gorag serişdelerinden doly. Olardan iň ulusy, dogry Allaha ybadat etmek, Ondan başga hiç zat ýok. Beýleki her bir amal kabul edilýär we diňe şu esasda ölçelýär, şonuň üçin adamyň ynamyny goramak hemme zatdan öň gelýär.",
      "Şol esasda amaly galkanlar köp we elýeterli: gündelik bäş namazy okamak, çyn ýürekden toba etmek, haýyr-sahawat bermek - Pygamberimiziň aýdyşy ýaly, suw ody öçürýär - agyz beklemek, Gurhan okamak we oňa amal etmek, gowy häsiýet, başgalara rehimdarlyk, yzygiderli ýatlamak (dikr) we hemişe bagyşlamak gözlemek. Bularyň hiç biri-de uly baýlyk ýa-da bilim talap etmeýär; hemmeler üçin açykdyr.",
      "Pygamber alaýhyssalam otdan gaçybatalga sorady we bize köplenç soramaga çagyrdy. Kim Alladan üç gezek Jennet sorasa, Jennetiň özi kabul edilmegi üçin doga edýändigini, kim üç gezek otdan gaçybatalga sorasa, otuň halas bolmagyny dileg edýändigini aýtdy (Jami 'at-Tirmizi 2572). Namazda, ertir we agşam adhkar namazynyň öňüsyrasynda bu duatlaryň aýratyn orny bar.",
      "Şerigatyň deňagramlylygyna üns beriň. Gorag serişdeleri weýrançylyk sebäplerinden has köp, has nygtalýar we has elýeterli - bu bolsa Allanyň rehiminiň alamatydyr. Halas bolmakdan halas bolmak has aňsat.",
      "Bu bölüm modulda bilkastlaýyn iň ulusydyr, sebäbi yslamyň özi şeýle meseläni çözýär: duýduryş elmydama umyt bilen jübütlenýär we hiç haçan adam şu gün başlap biljek anyk hereketlerden aýrylmaýar.",
    ],
    quran: [{}, {}],
    hadith: [{}],
    actions: [
      "Namazda namaz okamazdan öň Jahannamdan gaçybatalga gözleýän duany ýatda saklaň.",
      "Gündelik bäş namazy wagtynda - iň güýçli galkanlaryň arasynda okaň.",
      "Haýyr-sahawat işini yzygiderli beriň, hatda az mukdarda.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Toba (Tawbah)",
    summary:
      "Allah tüýs ýürekden toba etmegi kabul edýär - ölümden öň hiç bir günä gaty uly däldir.",
    body: [
      "Tawba - toba - Allanyň diniň içinde hiç bir günäniň hemişelik bolmazlygy üçin guran mehanizmidir. Munuň düýbünde ýüregiň Allaha tarap öwrülmegi bolup, alymlar onuň şertlerini Gurhandan we Sünnetden alýarlar: günäni tüýs ýürekden bes ediň, çyn ýürekden öküniň we gaýdyp gelmezligiňizi berk tutuň. Günä başga biriniň hukugyny öz içine alanda, dördünji şert goşulýar - şol hukugy dikeltmek ýa-da günäsini geçmek.",
      "Töwbäni şeýle umytly edýän zat, Allanyň kabul ediş usulydyr. Ol diňe gaýdyp gelýän hyzmatkäre çydam etmeýär; Ol begenýär. Pygamber alaýhyssalam, belent çölde ähli iýmitleri bilen dagyny ýitirip, umydyny üzüp, birden huzurynda duranyny gören adamdan Allanyň bendesiniň toba etmeginden has begenýändigini aýtdy (Sahih al-Buhari 6309). Yza gaýdyp gelenlere garaşýan şatlyk.",
      "Mundan başga-da, onuň gapysy ömrüň dowamynda hiç haçan ýapylmaýar. Pygamberimiz, Allatagalanyň günäsiniň toba etmegini kabul etmek üçin gije elini uzadýandygyny we gijäniň günäsiniň toba etmegini kabul etmek üçin gündiz elini uzadýandygyny aýtdy (Sahih Musulman 2759). Toba, adam öleninde bokurdaga ýetýänçä we günbatardan gün dogýança adamzat üçin kabul edilýär - şonuň üçin hiç wagt yza süýşürmäge sebäp ýok.",
      "Bu hatda birnäçe gezek ýykylan we toba eden adam üçinem dogrydyr. Her gezek gaýdyp gelmek çyn ýürekden bolsa, Allah kabul edýär; umytsyzlyk dinden däl-de, Şeýtandan. Ölümden öň çözülmeli bir zat şirkdir, sebäbi üstünde ölen adam toba talap edýän imansyz ölýär - hut şu sebäpden diňe Allaha ýüzlenmek hemmeleriň iň gyssagly gaýdyp gelmegidir.",
      "Amaly usul ýönekeý: indi toba ediň, ýygy-ýygydan toba ediň we günäniň ululygyna ýa-da geçmişiň sanyna gaýdyp gelmegiňiz barada jedel etmäň. Çakylyk elmydama açykdyr.",
    ],
    quran: [{}, {}],
    hadith: [{}, {}],
    actions: [
      "Günüň dowamynda Astagfirullah diýiň - diňe esasy süýşmelerden soň däl-de, yzygiderliligi maksat ediniň.",
      "Saýyid al-Istighfary öwreniň we ertir we agşam okaň.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Allanyň rahmetine umyt baglaýaryn",
    summary: "Hiç haçan umytdan düşmäň - ýagşy işler günäleri ýok edýär; yzygiderlilik meselesi.",
    body: [
      "Bu moduldaky hemme zat şu ýerde görkezilýär. Allah iň rehimdar ar-Rahman ar-Rahimdir we bize rehimdarlygynyň gazabyndan has ýokarydygyny we ähli zady gurşap alýandygyny aýtdy (7: 156). Iman eden, guşuň iki ganaty ýaly umyt bilen gorkynyň arasynda ýaşamagy maksat edinýär: hüşgär bolmak üçin günäden gorkýan, bagyşlanmaga umytly, hiç haçan ýüz öwürmez.",
      "Şol sebäpli umytsyzlygyň özi ýok. Adam özüni azaşandygyny duýsa-da, gapy açyk we giçdigini pyşyrdýan Allah däl-de, Şeýtandyr. Rehim-şepagatdan umytsyzlyk, Rahym hakda gaty az pikir etmekdir; tüýs ýürekden iş diňe gaýdyp gelmek.",
      "Ynha, sünni mezhebine bolan ynam hakda uly rahatlyk ýatyr. Ynamsyzlykdan ölenler üçin Jahannam hemişelik mesgenidir. Aloneöne uly günäler bilen agramlanan hem bolsa, diňe Allany tassyklaýan ölen imanly, baky galmaz. Pygamberimiz, adamlaryň şepagat arkaly, soň bolsa Allanyň merhemeti bilen Jennetiň etegindäki Durmuş derýasyna taşlanjakdygyny we dikeldiljekdigini we oňa girjekdigini öwretdi (Sahih al-Buhari 7439). Heartürekde hatda gorçisa tohumynyň agramy bolan otda hiç kimiň galmajakdygyny aýtdy (Sahih Musulman 183). Şonuň üçin monoteist üçin ot - aslynda girizilen bolsa - hekaýanyň soňy däl.",
      "Bu aralykda, rehimdarlyk gündelik durmuşda gurulýar: ýagşy işler erbetleri süpürýär (11: 114) we ownuk, yzygiderli ybadat - wagtynda doga edilen bir doga, bir ümsüm haýyr-sahawat, Allanyň razylygy üçin tutulan bir pursat sabyr - adamy yzygiderli özüne ýakynlaşdyrýar we zyýandan uzaklaşdyrýar. Dowamlylyk intensiwlikden has möhümdir.",
      "Şonuň üçin bu okuwyňyzyň netijesi bolsun: duýduryşa çynlakaý serediň, ýöne umyt gorkudan has güýçli bolsun. Howpy biliň, rehimdarlyk ýoluny saýlaň we her gün Allah bilen duşuşýançaňyz bir ädim ädim ýöräň.",
    ],
    quran: [{}, {}, {}],
    hadith: [{}, {}],
    actions: [
      "Her günüňi istighfar we her bereket üçin minnetdarlyk bilen tamamla.",
      "Bu moduly Jannah syýahaty bilen jübütläň - duýduryş we bilelikde umyt ediň.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Heläk ediji günäler",
    summary: "Allanyň rehmetinden daşlaşdyrýan uly günälerden saklanyň.",
    body: [
      "Uly günäler Gurhanda we Sünnetde berk duýdurylýar.",
      "Töwbe gapysy ölüm gelýänçä açykdyr.",
      "Günäni taşlaň, puşman boluň we gaýtmazlyga niýetleniň.",
      "Adamlaryň hakyny gaýtarmak töwbäniň bir bölegidir.",
      "Allanyň rehmetinden umytsyz bolmaň.",
    ],
    destructiveItems: [
      {
        title: "Şirk",
        summary: "Alla şärik goşmak iň uly zulumdyr.",
      },
      {
        title: "Jadygöýlük",
        summary: "Jady etmek ýa-da jadygöýe ýüz tutmak haramdyr.",
      },
      {
        title: "Adam öldürmek",
        summary: "Bigünä jany öldürmek örän agyr jenaýatdyr.",
      },
      {
        title: "Süýthorlyk",
        summary: "Riba almak hem bermek haramdyr.",
      },
      {
        title: "Ýetimiň maly",
        summary: "Ýetimiň malyny nähak iýmek.",
      },
      {
        title: "Söweşden gaçmak",
        summary: "Kanuny söweşde meýdandan gaçmak.",
      },
      {
        title: "Päk kişä töhmet",
        summary: "Päk mömine zyna töhmetini atmak.",
      },
      {
        title: "Müflislik",
        summary: "Kyýamatda adamlaryň haky sebäpli sogapdan galmak.",
      },
    ],
    quran: [{}, {}, {}],
    hadith: [{}, {}, {}, {}, {}],
    actions: [
      "Yhlasly töwbe ediň.",
      "Adamlaryň hakyny gaýtaryň.",
      "Günä eltýän ýollardan daşlaşyň.",
    ],
    appLinks: [
      {
        label: "Töwbe dogalary",
      },
      {
        label: "Namaz gözegçiligi",
      },
      {
        label: "Karzlar we amanatlar",
      },
      {
        label: "Gündelik zikr",
      },
    ],
  },
];

export const JAHANNAM_MAJOR_SIN_TOPICS_TK: DeepPartial<JahannamTopic>[] = [
  {
    title: "Şirk",
    summary: "Allaha şärik etmek - biriniň üstünde ölse günä bagyşlanmaz.",
    body: [
      "Kesgitleme: Şirk, Allaha şärik goşmakdyr - özüne degişli islendik hereketi (ybadat, ahyrky söýgi, gorky, umyt, bil baglamak ýa-da kanun çykarmak hukugy) Ondan başga birine gönükdirmekdir. Töwhidiň düýbünden tersi we ýaradylyşyň maksadyna: diňe Allaha ybadat etmekdir.",
      "Näme üçin ähli günäleriň iň ulusy: beýleki günäler hakyky Rebbi tanamak bilen edilen ýalňyşlykdyr, ýöne şirk gönüden-göni Oňa garşy edilen ýalňyşlykdyr - thearadyjy üçin ýaradylyşy ýalňyşýar. Şonuň üçin Gurhan muny great uly nädogrylyk “diýip atlandyrýar (31:13). Bir adam toba etmän ölse, bagyşlanmazlygy ýeke-täk günädir: 'Hakykatdanam, Allatagala Onuň bilen gatnaşygy bagyşlamaz, ýöne isläninden pes zady bagyşlar' (4:48). Bu agyrlykda-da gizlenen rehim, şirkden mahrum bolan zatlaryň hemmesiniň Allanyň bagyşlamagynda galmagydyr.",
      "Onuň görnüşleri: alymlar esasy şirki tapawutlandyrýarlar - butlara, ölülere, mukaddeslere ýa-da ýaradylan zatlara çokunmak; diňe berip biljek zady üçin Alladan başga dileg etmek; we Ondan başga birine gurban bermek ýa-da kasam etmek - bu toba edilmese Yslamyň daşyndaky adamy alýar. Ybadatda görkezmek (riýa), Alladan başga ant içmek ýa-da jadygöýlige we jadygöýlige bil baglamak ýaly has kiçi we gizlin şirk hem bar, bu çynlakaý günä, ýöne özi dinden çykarmaýar.",
      "Ondan daşlaşýan ýol: Tewhidi öwrenip, diňe Allaha ybadat etmek we amallary adamlaryň gözleri üçin däl-de, Oňa niýet etmek üçin arassalamak we berkitmek. Kim şirke düşen bolsa, tüýs ýürekden ýüz öwrüp, diňe Allaha ybadat etmek bilen toba edýär we bu gaýdyp gelýän gapy ömürboýy açyk bolýar.",
    ],
    quran: [{}, {}],
    hadith: [{}],
    actions: [
      "“Aqeedah” -y we Allanyň 99 adyny öwreniň.",
      "Ybadatda niýetleri arassala - her gün Alladan çyn ýürekden sora.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Adam öldürmek",
    summary: "Bikanun durmuşy bikanun alyp barmak - iň agyr düzgünleriň arasynda.",
    body: [
      "Kesgitleme: Bu ýerde adam öldürmek, Allanyň mukaddes eden durmuşyny bikanun, bilkastlaýyn almagy aňladýar. Yslam, degişli ygtyýarlyklar bilen amala aşyrylýan kanuny qisalar (kanuny jeza) ýaly kanuny işleri ykrar edýär, ýöne bigünä adamyň sebäpsiz öldürilmegi iň agyr jenaýatlaryň biridir.",
      "Näme üçin beýle agyr: Gurhan tutuş adamzadyň arasynda ýekeje adalatsyz öldürme bar: 'Kim jany öldürse ... bütin adamzady öldüren ýalydyr' (5:32), sebäbi bir ömri ýok etmek her bir durmuşy goraýan mukaddesligi bozmakdyr. Adam öldürmek Adam atanyň çagalarynyň arasynda edilen ilkinji günädi we ylham ahyreti ýok ediji hökmünde oňa gaýdyp gelýär.",
      "Iki gezek ýalňyşlyk: adam öldürmek birbada ýaşaýşyň mukaddesligine bolan hukugy aýak astyna alnan Allaha garşy günädir we adamlara - pidanyň we yzda galdyranlaryna garşy günädir. Şonuň üçin toba etmek köplerden has agyrdyr: Allaha ýüzlenmek zerurdyr, ýöne zulum edilenleriň hukuklary hem bar, ýeriň kanuny ýa-da yslam kanuny gan puluny (diýa) ýa-da beýleki netijeleri kesgitlän ýerinde, bular degişli kanallar we ökde alymlar arkaly berjaý edilmelidir.",
      "Ondan uzak ýol: her durmuşy mukaddes tutuň, gahar-gazaby we duşmançylygy berkitmezden ozal çözüň we jedelleri zorluk däl-de sabyr we adalat arkaly çözüň. Adamlara garşy edilen iň uly jenaýat hatda çyn ýürekden toba eden, hukuklaryny mümkin boldugyça boşadýan we hiç haçan beýle ýoldan gaýdyp gelmeýän adama Allanyň rehiminden başga däldir.",
    ],
    quran: [{}, {}],
    hadith: [{}],
    actions: ["Her durmuşy gadyr et; jedelleri sabyr we adalat bilen çözüň."],
    appLinks: [{}],
  },
  {
    title: "Zina",
    summary: "Bikanun jynsy gatnaşyklar - jana we jemgyýete garşy weýran ediji günä.",
    body: [
      "Kesgitleme: Zina, zyna (durmuşa çykmadyklaryň arasynda) we zyna (nikaly adamyň gatnaşmagy) öz içine alýan hakyky nikanyň daşyndaky islendik bikanun jynsy gatnaşyk. Yslam muňa şahsy mesele hökmünde däl-de, giň zyýan bilen garamak hökmünde garaýar.",
      'Näme üçin agyr: zina sagdyn jemgyýetiň gurýan zatlaryny - nesil, är-aýalyň arasyndaky ynam, çagalaryň howpsuzlygy we adamy mertebe edýän päkligi düzedýär. Gurhanyň sözleriniň özi öwrediji: bu diňe bir hereketi gadagan etmeýär, oňa "ýakynlaşmaň" diýýär (17:32), garaýyşlara, şahsy durmuşyňyza we oňa tarap ädimleriňize duýduryş berýär. Çemeleşmegiň gadagan edilmegi rehimdir, sebäbi synaga aşa düşmezden ozal adamy goraýar.',
      "Päsgelçiliklerdäki paýhas: Yslam adamlary iň ýokary derejä ýetmek üçin terk etmegiň ýerine, ozalky goraglar bilen gurşap alýar - nazary peseltmek, geýim we gylyk-häsiýet bilen sypaýy bolmak, garşy jynsdan aýrylmazlyk we bu zerurlyklar üçin kanuny, abraýly kanal hökmünde nikany höweslendirmek. Bu serhetleri öňünden gurmak, gyrada garşylyk görkezmekden has aňsat.",
      "Yza gaýdyp barýan ýol: ýykylan her bir adam üçin çykalga çyn ýürekden tawba - günäni doly terk etmek, ökünmek, gaýdyp gelmezlik kararyna gelmek we geçmişini köpçülige ýetirmek däl-de, ýapmak. Zina uly günädir, ýöne Allanyň özüne ýüz tutan adam üçin bagyşlaýanlarynyň arasynda; umytsyzlygyň ýeri ýok we täze başlangyç elmydama bar.",
    ],
    quran: [{}, {}],
    actions: [
      "Gözleri we sosial media sarp edişini goraň.",
      "Öýlenmedik bolsa, dogry är-aýal üçin dua ediň.",
    ],
    appLinks: [{}],
  },
  {
    title: "Riba",
    summary: "Gyzyklanma we göterim - Gurhanda amal edýänlere garşy söweş yglan edildi.",
    body: [
      "Kesgitleme: Riba, käbir maliýe amallarynyň bikanun ýokarlanmagydyr - iň meşhursy, karzlar boýunça alynýan ýa-da tölenýän göterimler, şeýle hem harytlar ýaly belli bir deňsiz ýa-da yza süýşürilen bir exchangalary goşmak bilen. Onuň manysy, başga biriniň hasabyna hakyky gymmaty ýa-da töwekgelçiligi bolmazdan baýlyk gazanmakdyr.",
      "Näme üçin gaty agyr: riba, Gurhanyň garşysyna ulanýan dilindäki maliýe günäleriniň arasynda özboluşlydyr. Allah Özünden we Resulyndan söweşi dowam etdirýänlere garşy yglan edýär (2: 279) - bu başga bir günä üçin ulanylmaýar - sebäbi riba mätäçligi ulanýar, baýlygy birnäçe adamyň elinde jemleýär we ykdysadyýetiň alyp barjak rehim-şepagatyny açýar. Pygamber alaýhyssalam bu meselede her hili iş etmezlik barada berk duýduryş berdi.",
      "Paýhas we rehimdarlyk: gadaganlyk adamlary hakyky söwda, umumy töwekgelçilik we haýyr-sahawata gönükdirýär we ejizleri bergilerden ezmekden goraýar. Bu ýerde-de bolsa, Allanyň rehim-şepagaty bar: buýruk gelende, ozal alnan gyzyklanmalaryň yzyna alynmagyny talap etmedi, ýöne imanlylara galan zatlardan ýüz öwürmegi buýurdy - “başlygyň bolar” (2: 279) - ondan ýüz öwürýänler üçin ýeňillik.",
      "Ondan uzak ýol: göterim esasly önümler üçin maliýe serişdeleriňizi barlaň, halal alternatiwalary gözläň we musulman däl ýurtlarda ipoteka ýaly hakykatdanam kyn ýagdaýlar üçin ökde alymlara ýüz tutuň. Ribany terk etmek kyn maliýe saýlawlaryny aňladyp biler, ýöne kalbyň howpsuzlygy wagtlaýyn gazançdan ýokarydyr - we Alla ondan gorkýan adama garaşmaýan ýerinden üpjün etmegi wada berýär.",
    ],
    quran: [{}, {}],
    actions: [
      "Göterim esasly önümler üçin maliýe hasabatyny barlaň.",
      "Ipoteka we bergiler boýunça ökde alym bilen maslahatlaşyň.",
    ],
    appLinks: [{}],
  },
  {
    title: "Sealňyş görkezme",
    summary: "Kasam içmek ýa-da ýalan şaýatlyk etmek - adalaty ýok edýär.",
    body: [
      "Kesgitleme: sealan şaýatlyk (shahadat al-zur) nädogry bir zada şaýatlyk edýär - has giňişleýin, kasam edip ýalan sözleýär, aýyplamalary ýasaýar ýa-da adalat bagly bolanda hakykat şaýatlaryny saklaýar.",
      "Näme üçin agyr: adalatyň guralyny zaýalaýar. Falseeke-täk ýalan şaýat bigünä adamy ýok etmek, emläginiň hukuk eýesini talamak ýa-da sütemçini boşatmak üçin iberip biler - şonuň üçin ýalançy hiç haçan ýalançyda bolmaz; hakyky adamlary we adalatlylygyň ähli tertibini ýaralaýar. Pygamberimiz muny iň uly günäleriň hataryna goşdy we bir rowaýatda özüne garşy duýduryşy gaýtalamakda şeýle bir tutanýerli boldy welin, sahabalary onuň aladasy sebäpli bes edilmegini islediler.",
      "Dil bilen baglanyşygy: ýalan şaýatlyk, sözleriň has giň günäleriniň iň ýiti gyrasydyr. Sözleri aýtmak arzan bolany üçin, bu günä howp salmak aňsat - gol, ulaltmak, amatly dymmak - we kyýamat gününde onuň agramy gaty uludyr, haçan-da adamlaryň aýaklary we dilleri olara garşy dogry şaýatlyk eder.",
      "Ondan uzak ýol: gymmat düşse-de ýa-da öz bähbidine garşy bolsa-da hakykaty saklaň, sözüňizi ýalan sözlemekden ýüz öwüriň we zerur bolanda diňe şaýatlyk ediň. Falsealan şaýatlyk eden adam, mümkin boldugyça ýalany yzyna almak, zyýany ödemek we zulum edilenleriň hukuklaryny dikeltmek we çyn ýürekden Allaha ýüzlenmek bilen toba edýär.",
    ],
    quran: [{}, {}],
    hadith: [{}],
    appLinks: [{}],
  },
  {
    title: "Jadygöýlik",
    summary: "Jady, jadygöý gözlemek we okkult amallary - esasy görnüşlerde kufr.",
    body: [
      "Kesgitleme: Sihr (jadygöýlik ýa-da jady), adamlara ýa-da hadysalara täsir etmek üçin köplenç şeýtanlara bil baglamak ýa-da görünmeýän zatlaryň üstünden höküm sürmek bilen baglanyşykly gadagan serişdeleri ulanmakdyr. Oňa amal etmek, öwrenmek, beýlekilerden gözlemek we hemmesini öňe sürýänlere ynanmak bu günäniň aşagyndadyr.",
      "Näme üçin beýle agyr: sihriň köpüsini şeýtanlara ýakynlaşmak ýa-da Gurhany kemsitmek ýaly ynamsyzlyk etmezden ýerine ýetirip bolmaz, şonuň üçin Gurhan bilimlerini kufr bilen baglanyşdyrýar. Süleýmanyň döwründe öwrenilen jady hakda aýdanymyzda, Allatagala şeýtanlaryň we şol iki perişdäniň muny diňe synag hökmünde öwredendigini, 'ynanmaň' diýip duýduryş berdi (2: 102). Ynanç howpundan başga-da, sihr hakyky adamlara zyýan berýär - är-aýalyň arasynda bölünişik ekmek, gorkyny ýaýratmak we umytsyzlary ekspluatasiýa etmek.",
      "Degişli amallar: şol bir duýduryş jadygöýlige, astrologiýa görünmeýän belli bir bilim hökmünde garamaga, şirk göterýän amuletlere we jadylara degişlidir. Gizlin gelejek hakda bilim almak diňe Allaha degişlidir we muny aýdýanlara ýüzlenmek, köküniň düýbüni pese gaçyrýar.",
      "Ondan uzak ýol: bu amallara goşulan biri üçin toba, olary bütinleý terk etmegi, gadagan edilen zatlary ýok etmegi, söwda edýänler bilen gatnaşyklary kesmegi, çyn ýürekden tämizlenmegi we diňe Allaha bil baglamagy aňladýar. Gorag imanda, gündelik adhkarda we Allaha gaçybatalga tapylýar - we hakykatdanam gaýdyp gelen adam üçin onuň bagyşlanmagy açykdyr.",
    ],
    quran: [{}],
    hadith: [{}],
    appLinks: [{}],
  },
  {
    title: "Petim baýlygy sarp etmek",
    summary: "Petimleriň emlägini adalatsyz almak ýa-da biderek sarp etmek.",
    body: [
      "Kesgitleme: Bu günä ýetimleriň - kakasyny ýitiren we öz bähbitlerini gorap bilmeýän çagalaryň emlägini almak, isrip etmek ýa-da hyýanatçylykly peýdalanmakdyr. Howandar, baýlygyny hiç wagt eýesi hökmünde ynam (amanah) hökmünde saklaýar.",
      "Näme üçin agyr: iki ýalňyşlygy birleşdirýär - mukaddes ynama dönüklik we iň goragsyzlara sütem. Gurhanyň keşbi gaty agyr: ýetimleriň baýlygyny adalatsyz sarp edýänler, diňe garnyna ot ýakýarlar (4:10), açgözlik pursatyny öz-özüni jezalandyrýar. Olar üçin gürläp biljek adamy ulanmazlyk adalatsyzlygyň iň erbet görnüşleriniň biridir, şonuň üçin duýduryş gaty ýiti we hossarlary ondan daşlaşdyrmakda ýiti we rehimli.",
      "Oňa öz içine alýan zatlar: diňe bir aç-açan ogurlyk däl, eýsem inçe görnüşler - ýetimiň emlägini çyzygyň bulaşmagy üçin garyşdyrmak, ýetim ýaşy dolandan soň gaýdyp gelmegini gijikdirmek, ýa-da maýa goýmak ýa-da haksyz harçlamak. Allah tersine buýruk berýär: 'petimlere emlägini beriň, erbetini ýagşylyga çalyşmaň' (4: 2).",
      "Ondan uzak ýol: ýetimleriň baýlygyny seresaplylyk bilen goraň, aýratyn saklaň we hasaba alyň, kämillik ýaşyna ýetende tabşyryň we kemeldilen adam üçin bergisini yzyna gaýtaryp, zulum edilenleriň günäsini geçmek bilen toba ediň. Sagdyn ýürekden başga hiç bir baýlygyň ýa-da nesiliň kömek etmejek güni, şeýle ynamy dikeltmegiň özi gymmatly işdir.",
    ],
    quran: [{}, {}],
    appLinks: [{}],
  },
  {
    title: "Ene-atalara boýun bolmazlyk",
    summary: "Uquq - şirkden soňky esasy günäleriň arasynda.",
    body: [
      "Kesgitleme: 'Uqq al-walidayn ene-atasyna çynlakaý boýun egmezlik we sütem etmek - olara zyýan bermek, olara äsgermezlik etmek, mätäçlere äsgermezlik etmek ýa-da söz ýa-da amal bilen ýaralamak. Yslamyň buýruk berýän hoşniýetliligi birr al-walidaynyň tersidir.",
      "Näme üçin beýle agyr: aýatda bir aýatda Allah, Allaha ybadat etmek ... we ene-atalara ýagşylyk etmek ýaly (4:36) bolşy ýaly, ene-atalara-da gowy bolmak buýrugy bilen jübütlenýär. Ene-atalar, Allanyň yzyndan, adamyň barlygynyň we terbiýesiniň iň ýakyn çeşmesidir, şonuň üçin olara minnetdarlyk çuňňur çuňňur minnetdarlykdyr. Pygamber alaýhyssalam, sütemlerinden soň ikinji ýerde iň uly günäleriň hataryna girdi.",
      "Möhüm deňagramlylyk: edeplilik ene-atalara Allaha boýun bolmazlygy tabşyrmagy aňlatmaýar - Creataradana garşy hiç bir jandar boýun egmeýär. Emma ýüz öwürmeli ýerinde-de mylaýymlyk, hormat we dowamly hoşniýetlilik bilen edilýär. Gurhan hatda iň kiçijik sözi-de gadagan edýär: 'olara uff diýmäň' (17:23).",
      "Yzyna gaýdyp gelmek ýoly: bu ýerdäki rehim, ene-atalaryň henizem elýeterli bolmagydyr. Şowsuzlyga uçran adam üçin toba esasan amalydyr - hoşniýetliligi dowam etdiriň, bagyşlaň, olara hyzmat ediň we esasanam dirikä olar üçin dua ediň. Ene-atasy aradan çykan bolsa, ýerine ýetiriş olar üçin doga etmek, olaryň adyndan haýyr-sahawat bermek we gatnaşyklaryna we dostlaryna hormat goýmak arkaly dowam edýär.",
    ],
    quran: [{}, {}],
    hadith: [{}],
    actions: ["Şu hepde hoşniýetli söz bilen ene-atalara jaň ediň ýa-da baryp görüň."],
    appLinks: [{}],
  },
  {
    title: "Ogurlyk",
    summary: "Başgalaryň emlägini bikanun almak - ynamy bozýar we jeza çagyrýar.",
    body: [
      "Kesgitleme: Ogurlyk (saryka) başgalaryň baýlygyny ýa-da emlägini hukuksyz alýar - ogurlyk, ogurlamak, galplyk ýa-da hiç kimiň talap etmeýän zadyny gizlin ele almak.",
      "Näme üçin agyr: bu adamlaryň hukugyny we jemgyýetçilik durmuşyna bagly ynamy bozýar. Munuň çynlakaýlygy, Gurhanyň kär derejesi üçin bellenen jezasy bilen bellenýär (5:38) - berk şertler we ýokary subutnamalar bilen berkidilen jeza, şonuň üçin onuň agyrlygy esasan adamlaryň emlägini howpsuz saklaýan güýçli päsgelçilik bolup hyzmat edýär. Yslamyň maksady, adamlar öz zatlary bilen özlerini howpsuz duýýan jemgyýetdir.",
      "Häzirki zaman keşpleri: ogurlyk diňe bir jaýa girmek bilen çäklenmeýär. Bu iş berijiden almagy, işde aldamak, işçileriň aýlyk haklaryny saklamak, sanly garakçylyk, göçürme we kanuny taýdan özüne degişli bolmadyk zatlardan peýdalanmagy öz içine alýar. Beýleki adamlardan gizlenýän zat, her bir şahsy zady görýän Alladan gizlenmeýär.",
      "Yza gaýdyp gelmek ýoly: ynsan hukugy bilen baglanyşykly bolany üçin, toba etmek Allanyň öňünde ökünmekden has köp zady talap edýär. Ogurlanan zadyň özüni ýa-da gymmatyny degişli eýesine gaýtaryp bermeli we mümkin boldugyça günäsini geçmeli; eýesi tapylmasa, alymlar bu mukdary öz adyndan sadaka bermegi maslahat berýärler. Bu ýol bilen boşadylan, hatda ogurlyk hem gaýdyp gelýän hyzmatkäri söýýän tarapyndan doly bagyşlanýar.",
    ],
    quran: [{}],
    actions: [
      "Ogurlanan zatlary ýa-da olaryň bahasyny yzyna gaýtarmak; zulum edilenlerden bagyşlanmagyny sora.",
    ],
    appLinks: [{}],
  },
  {
    title: "Intoksikantlar",
    summary: "Şerap we serhoş ediji - Gurhanda kem-kemden we aýgytly gadagan.",
    body: [
      "Kesgitleme: Hamr akyly serhoş edýän we bulutlandyrýan islendik zat - şerap we ähli spirtli içgiler we Pygamberiň ýörelgesi boýunça, görnüşi ýa-da ady bolsun her serhoş ediji madda. 'Her serhoş haram, her bir haram gadagan.'",
      "Näme üçin agyr: akyl, adamyň Allany tanaýan, dogry bilen ýalňyşlygy kesgitleýän we beýleki jogapkärçiligi goraýan fakultetdir. Serhoşlar hut şol zady sökýärler, şonuň üçin Gurhan olary butlar we humar oýunlary bilen “Şeýtanyň işinden haramlyk” diýip atlandyrýar we “olardan gaça duruň” (5:90). Adamdan başga-da, saglygy, maşgalalary we howpsuzlygy bozýarlar we akylly adamyň hiç haçan ýakynlaşmajak günälerine gapy açýarlar.",
      "Gadagan edilmeginiň pähim-paýhasy: Allatagala birden duýdansyz urmagy gadagan etmedi, ýöne irki jemgyýeti çuňňur kök uran endikden ýuwaşlyk bilen süýtden aýyrdy. Bu ýuwaş-ýuwaşdan özi rehimdarlyk sapagydyr we şu gün terk etmek üçin göreşýänleriň hemmesine umyt nusgasydyr.",
      "Rehim-şepagat bilen gaýdyp gelmek ýoly: endikde tutulanlary ýigrenmeli däl, goldamaly. Toba diýmek, maddany terk etmegi, ony we onuň sebäplerini adamyň durmuşyndan aýyrmagy, utançsyz kömek we bejergini gözlemegi, boşlugy gowy şärik, zikr we ybadat bilen doldurmagy aňladýar. Allanyň gapysy giňdir we serhoşlardan her çyn ýürekden ädim ätmekdir.",
    ],
    quran: [{}],
    hadith: [{}],
    actions: ["Gerek bolsa kömek soraň; endigi dhikr we gowy kompaniýa bilen çalyşyň."],
    appLinks: [{}],
  },
];

export const JAHANNAM_NAMES_TK: DeepPartial<JahannamNameEntry>[] = [
  {
    name: "Jahannam",
    meaning: "Ot - dowzah üçin iň ýygy-ýygydan Gurhanyň ady.",
    quran: {},
    context:
      "Imany inkär edýän we nädogry hereketleri dowam etdirýänler üçin jeza çäresi hökmünde Gurhanyň hemme ýerinde ulanylýar.",
    tafsirNote:
      "Ibn Katir Jahannamyň duýduryş we netije hökmünde taýýarlanan Otuň giňişleýin adydygyny belleýär.",
    scholarlyNote:
      "Käbir alymlar Jahannamyň tutuş dowzahdygyny ýa-da belli bir derejedigini ara alyp maslahatlaşýarlar - garaýyşlar tapawutlanýar.",
  },
  {
    name: "Jaheem",
    meaning: "Ot ýakýan ot - güýçli, güýçli yssy.",
    quran: {},
    context: "Allah bilen garşydaşlaryny alýanlara garaşýan otuň güýjüni suratlandyrýar.",
    tafsirNote: "Al-Tabari jaheemi hiç zady gaýgyrmaýan ýanýan ot bilen baglanyşdyrýar.",
  },
  {
    name: "Sakar",
    meaning: "Hiç zady ýakmaýan ýa-da galdyrmaýan zat - güýçli yssy.",
    quran: {},
    context: "Ylhamdan ýüz öwüren adam hakda Muddaththir süresinde agzalyp geçilýär.",
    tafsirNote:
      "Nusgawy tafsir Sakary güýçli ýanýan dowzah derejesi hökmünde suratlandyrýar; jikme-jiklikler alymlaryň arasynda tapawutlanýar.",
    scholarlyNote:
      "Sakaryň aýratyn derejedigi ýa-da dowzahyň adydygy tafsirde ara alnyp maslahatlaşylýar - bir ylalaşylan tekstde aç-açan däl.",
  },
  {
    name: "Sair",
    meaning: "Ot ýakmak - ot ýakmak.",
    quran: {},
    context: "Petim baýlygy adalatsyz sarp edýänlere duýduryş.",
    tafsirNote: "Kök ýakmagy we ýakmagy aňladýar - işjeň, ýanýan oty nygtaýar.",
  },
  {
    name: "Hutamah",
    meaning: "Crusher - döwýän we ezýän zat.",
    quran: {},
    context: "Baýlygy gybat edýän we ölmez-ýitmez eder öýdüp, jeza.",
    tafsirNote:
      "Ibn Katir Hutamanyň Allah tarapyndan ýakylýan oty döwýändigini we sarp edýändigini düşündirýär.",
  },
  {
    name: "Hawiýa",
    meaning: "Çukur ýa-da çukur - çuňňur ýykylmak.",
    quran: {},
    context: "Kyýamat güni ýagşy işleri gaty ýeňil bolanlaryň barjak ýeri.",
    tafsirNote:
      "Otdaky çuň çukur hökmünde suratlandyrylýar; al-Tabari çuňlugy we agyrlygy baradaky pikirleri ýazga alýar.",
    scholarlyNote:
      "Käbir tafsir eserleri Hawiýany belli bir dereje hökmünde görkezýär - ylmy düşündiriş hökmünde görkezýär.",
  },
  {
    name: "Lazaa",
    meaning: "Alaw - ýanýan ot.",
    quran: {},
    context: "Ma'arij süresi - Sagaty inkär edýänlere duýduryş.",
    tafsirNote: "Süýnüp, ýanýan alaw bilen baglanyşykly - Lazaa işjeň ýanmagy nygtaýar.",
  },
];

export const JAHANNAM_GATES_TK: DeepPartial<JahannamGateEntry>[] = [
  {
    quranNote:
      "Allah dowzahyň ýedi derwezesiniň bardygyny aýdýar; her derwezä girýänleriň bellenen bölegi bar (15:44).",
    scholarlyNote:
      "Käbir soňraky tafsir eserleri derwezeleri günäkärleriň kategoriýalary bilen baglanyşdyrýar. Bu ýumuşlar irki çeşmelerde birmeňzeş däl - düşündiriş hökmünde hödürlenýär.",
  },
  {
    quranNote:
      "Gurhan ýedi derwezäni bilelikde tassyklaýar; aç-açan ylhamda her derwezäniň adyny tutmaýar.",
    scholarlyNote:
      "Ibn Katir, bölünişigiň Allanyň hikmeti we adalaty bilen bolandygyny ara alyp maslahatlaşýar.",
  },
  {
    quranNote:
      "Sevenedi derweze - aýdyň tekst hakykaty. Her derwezäni eýeleýänleriň jikme-jiklikleri esasan ylmy pikir alyşýar.",
  },
  {
    quranNote: "Aýat proporsional tabşyrygy nygtaýar - her derwezäniň bellenen paýy bar.",
  },
  {
    quranNote:
      "Iman edenlere toba etmek arkaly bu derwezelere eltýän zatlardan gaça durmak üçin duýduryş berilýär.",
  },
  {
    quranNote: "Jähennem taýýar - duýduryş hakyky. Gorag iman we dogruçyl amallar arkaly bolýar.",
  },
  {
    quranNote:
      "Sevenedi derweze, bir ot - günäkärleriň ylahy hikmet bilen toparlanýandyklary bilen duýduryş birligi.",
    scholarlyNote:
      "Belli bir ylmy işe salgylanmasaňyz, günä-gapy kartalaryny pygamberlik hakykaty hökmünde öwretmekden gaça duruň.",
  },
];

export const JAHANNAM_VERSES_TK: DeepPartial<JahannamVerseEntry>[] = [
  {
    context: "Imanlylara ýüzlenilýär - gorky boýun bolmaga itergi hökmünde.",
    tafsirSummary: "Ibn Katir: takwa çagyryşy, Resula boýun bolmak bilen jübütlenendir.",
  },
  {
    context: "Günälerinden gorkýanlara teselli bermek üçin açyldy.",
    tafsirSummary: "Umydyň esasy daşy - yza gaýdýanlar üçin rehimdarlyk giňdir.",
  },
  {
    context: "Maşgala we özüni alyp barşyňyzdan soň imanlylara buýruk beriň.",
    tafsirSummary: "Nasuh tawbah - günä gaýdyp gelmezden çyn ýürekden toba etmek.",
  },
  {
    context: "Ylahy adalat - amallara görä sylag we jeza.",
    tafsirSummary: "Derejeler Jennete we Jähenneme degişlidir.",
  },
  {
    context: "Ylahy hökümiň ​​adalatlydygyna kepillik.",
  },
  {
    context: "Dünýä we beýleki dünýädäki gowy zatlary birleşdirýänleriň duasy.",
    tafsirSummary: "Gurhanda öwredilen pygamberlik dilegi - dünýä bilen ahiranyň deňagramlylygy.",
  },
  {
    context: "Iblisiň adamlary azdyrjakdygyna kasam edýän böleginden soň gelýär.",
    tafsirSummary:
      "Sevenedi derwezäni aç-açan ýatlamak - tabşyrygyň jikme-jiklikleri ylahy hikmetdir.",
  },
  {
    context: "Uly günäleriň sanawyndan soň kadadan çykma.",
    tafsirSummary: "Toba edenlere umyt - amallar rehimdarlyk bilen üýtgedilip bilner.",
  },
  {
    context: "Mülk süresi - görünmeýän zatlary ýatlatmak.",
  },
  {
    context: "Günüň iki ujunda namaz okamagy buýruň.",
    tafsirSummary: "Yzygiderli ybadat etmek höwes, geçmişdäki ýazgylary ýok edýär.",
  },
  {
    context: "Muttaqiniň beýany (Hudaýy bilýän).",
  },
  {
    context: "Kariýa süresi - amallaryň agramy.",
  },
];

export const JAHANNAM_HADITH_TK: DeepPartial<JahannamHadithEntry>[] = [
  {
    hadith: {},
    context: "Jannah üçin yzygiderli dua etmek we Jahannamdan gaçybatalga bermek.",
  },
  {
    hadith: {},
  },
  {
    hadith: {},
    context: "Deňagramlylyk: amallara ymtyl, ýöne rehime bil bagla.",
  },
  {
    hadith: {},
  },
  {
    hadith: {},
    context: "Namazy äsgermezlik etmegiň iň agyr duýduryşlarynyň arasynda.",
  },
  {
    hadith: {},
    context: "Adamlaryň hukuklary kyýamat güni amallardan öň çözülip bilner.",
  },
  {
    hadith: {},
  },
  {
    hadith: {},
    context: "Dili goramak - gündelik jogapkärçilik.",
  },
];

export const JAHANNAM_REFLECTIONS_TK: DeepPartial<JahannamReflectionEntry>[] = [
  {
    question: "Şu gün hiç kime zulum etdimmi - sözde, hereketde ýa-da äsgermezlikde?",
  },
  {
    question: "Bu gün çyn ýürekden we gaýta-gaýta Alladan bagyş soradymmy?",
  },
  {
    question: "Dilimi gürlemekden, ýalan sözlemekden we masgaralamakdan goradymmy?",
  },
  {
    question: "Wagtynda we barlygynda doga etdimmi?",
  },
  {
    question: "Özümi tanamadyk biri bilen ýaraşmak üçin ädim ätdimmi?",
  },
  {
    question: "Şu gün haýyr-sahawat ýa-da hoşniýetlilik berdimmi - hatda kiçi bir zatmy?",
  },
  {
    question: "Şu gün Gurhany okadymmy ýa-da diňledimmi?",
  },
];

export const JAHANNAM_REFERENCES_TK: DeepPartial<JahannamReferenceEntry>[] = [
  {
    title: "Gurhan",
    note: "Atlar, duýduryşlar, rehimdarlyk we toba üçin esasy çeşme. Terjimeler dürli-dürli; takyklygy üçin arap diline serediň.",
  },
  {
    title: "Sahih al-Buhari we Sahih Musulman",
    note: "Kanoniki hadys ýygyndylary, bahalandyrylan sahih bolan bu modulda getirildi.",
  },
  {
    title: "Tafsir Ibn Katir",
    note: "Jähennemiň atlary we esasy duýduryş aýatlary üçin kontekst üçin salgylanylýar - ylmy düşündiriş.",
  },
  {
    title: "Tafsir al-Tabari",
    note: "Irki giňişleýin tafsir - Jahannam hakda nusgawy pikirlere düşünmek üçin peýdaly.",
  },
  {
    title: "Alymlaryň tapawudy",
    note: "Alymlaryň arasynda dowzahyň takyk derejeleri, derwezäniň tabşyryklary we käbir at manylary ara alnyp maslahatlaşylýar - ylhamda elmydama aç-açan däl.",
  },
];

export const JAHANNAM_DUAS_TK: DeepPartial<JahannamDuaEntry>[] = [
  {
    context: "Iki dünýäde-de ýagşylyk we otdan gorag soraň - Gurhan du'a.",
  },
  {
    context: "Taşahuddan soň: Jennet we otdan gaçybatalga soraň.",
  },
  {
    context: "Irden ýatlamak: gabyr jezasyndan we otdan gaçybatalga.",
  },
];

export const JAHANNAM_REFUGE_DUA_TK: { translation?: string } = {};
