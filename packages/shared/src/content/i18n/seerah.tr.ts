import type { SeerahEvent } from "../../types/seerah";
import type { DeepPartial } from "./localize";

// Turkish translation overlay for the Seerah timeline. Mirrors the order of
// SEERAH_EVENTS in ../seerah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, years and Hijri
// numbers stay in the English source.

export const SEERAH_EVENTS_TR: DeepPartial<SeerahEvent>[] = [
  {
    title: "İslam öncesi Arabistan (Cahiliye)",
    location: "Arabistan",
    body: "Peygamber ﷺ'yi anlamak için önce onun gönderildiği dünyayı gözünüzde canlandırmanız gerekir. Altıncı yüzyıl Arabistanı, merkezi bir devleti olmayan, soy, onur ve Mekke'deki Kâbe'nin kutsallığıyla birbirine bağlanan dağınık kabilelerin ülkesiydi — İbrahim ve İsmail'in tek Allah'a ibadet için inşa ettiği, fakat artık yaklaşık üç yüz altmış putla çevrili bir mabet.\n\nBu döneme Cahiliye, yani \"cehalet çağı\" denir — Arapların zekâsı yok diye değil (şiirleri ve hafızaları olağanüstüydü), rehberlikten yoksun oldukları için. Kabile düşmanlıkları nesiller boyu sürebilir, güçlü zayıfa baskı yapar, kız çocukları utanç veya yoksulluk korkusuyla bazen diri diri gömülürdü — Kur'an bunu sonra doğrudan kınayacaktı (Kur'an 81:8–9). Putperestliğin yanında birkaç \"hanif\" hâlâ İbrahim'in saf tevhidini arıyordu; yarımadada küçük Yahudi ve Hristiyan topluluklar da vardı.\n\nDers: Vahiy boşluğa inmedi; derin yaraları olan gerçek bir topluma indi ve ilk iyileştirdiği şey insan ile Yaratıcısı arasındaki bağ oldu. Zaman çizelgesi ilerledikçe bu arka planı aklınızda tutun — Peygamber ﷺ'nin neredeyse her reformu Cahiliye adaletsizliklerine doğrudan bir cevaptır.",
  },
  {
    title: "Mekke'de doğum",
    location: "Mekke",
    body: "Peygamber ﷺ, Fil Yılı'nda (Am al-Fil) Mekke'de doğdu; adı, o yıl Yemen valisi Ebrehe'nin Kâbe'yi yıkmak için fillerle ordu götürüp mucizevi geri püskürtüldüğü için verilmiştir — Kur'an bunu Fil Suresi'nde anar (Kur'an 105). Bu anlamlı yılda Kureyş'in en itibarlı kolu Beni Haşim'den bir çocuk dünyaya geldi.\n\nDoğumunda bile yetimdi: babası Abdullah, uzak bir ticaret yolculuğunda aylar önce vefat etmişti. Annesi Amine bint Vehb ona Muhammed — \"çok övülen\" — adını verdi; Araplar arasında neredeyse bilinmeyen bir isimdi. Mekke adetine uygun olarak Banu Sa'd arasında, Halime es-Sa'diyye'nin bakımında çöl havasında büyütülmek üzere gönderildi.\n\nMümin için ders: Allah katındaki yücelik dünyevi güvenceyle ilgili değildir. Son elçi babasız başladı, kısa süre sonra annesiz de kaldı; fakat onu Allah korudu — \"Seni yetim bulup barındırmadı mı?\" (Kur'an 93:6). Ayrıca bkz. \"Annesinin vefatı\" ve \"Ebu Talib'in himayesi\".",
  },
  {
    title: "Annesinin vefatı",
    location: "Abva",
    body: "Yaklaşık altı yaşındayken Amine, oğlunu Yathrib'deki (sonra Medine) akrabalarını ziyarete ve babasının kabrini görmeye götürdü. Dönüş yolunda Abva'da — Mekke ile Medine arasında — hastalandı ve orada vefat edip defnedildi. Küçük Muhammed ﷺ artık her iki ebeveynini de kaybetmişti.\n\nAilesinin azatlı hizmetçisi Ümm Eymen onu Mekke'ye getirdi; Kureyş'in saygın reisi dedesi Abdülmuttalib onu büyüttü, onu çok sever ve Kâbe yanında yanına oturturdu.\n\nDers: Peygamber ﷺ erken ve tekrar tekrar birçok insanın taşıdığı kederi — yas, yoksunluk, başkalarına bağımlılık — tattı. Bu, onun hazırlığının parçasıydı. Kaybı bilen bir kalp, yetim, dul ve yabancının acısını hisseder; ümmeti tam da bu merhamet üzerine kurulacaktı. Bu iz \"Hüzün Yılı\"nda sürer.",
  },
  {
    title: "Ebu Talib'in himayesi",
    location: "Mekke",
    body: "Annesinden iki yıl sonra dedesi Abdülmuttalib de, çocuk yaklaşık sekiz yaşındayken vefat etti. Ölüm döşeğinde sevgili torununu oğlu Ebu Talib'e emanet etti. Ebu Talib zengin değildi; çocuğu evine aldı ve en sevdiği çocuklarından biri gibi gördü.\n\nEbu Talib, Mekke'deki en zor zulüm yılları boyunca kırk yıldan fazla onun koruyucusu oldu. Genç Muhammed ﷺ'yi Şam ticaret yolculuklarına götüren de oydu; meşhur rivayete göre Bahira adlı keşiş onda nübüvvet alametleri gördü (siyerde korunan bir rivayet, ayrıntıları farklı güçte aktarılmıştır).\n\nDers: Allah, Peygamber ﷺ'nin her aşamasında sadık ve onurlu kimseler koydu. Ebu Talib'in onlarca yıllık koruması bir rahmetti — hakikati ve akrabalığı desteklemenin, henüz iman etmemiş olsalar bile asil bir makam olduğunu hatırlatır. Onu Hüzün Yılı'nda kaybetmek her şeyi değiştirecekti.",
  },
  {
    title: "Hatice ile evlilik",
    location: "Mekke",
    body: "Gençlikte Muhammed ﷺ, hiçbir servetle satın alınamayacak bir ün kazandı: es-Sıdık, doğru; el-Emin, güvenilir. İnsanlar değerli eşyalarını ona emanet eder, sözüne tamamen güvenirdi — başka ilahlara tapanlar bile.\n\nHatice bint Huveylid (Allah ondan razı olsun), Kureyş'in saygın ve başarılı bir tüccarı, onu kervanını Şam'a götürmesi için tuttu. Dürüstlüğünden ve ahlakından etkilenince arkadaşı Havle bint Hakim aracılığıyla evlilik teklifi gönderdi. O yaklaşık yirmi beş, Hatice yaklaşık kırk yaşındaydı; derin sevgi ve ortaklık dolu bir evlilik oldu. Çocuklarını o doğurdu ve vefatına kadar yaklaşık yirmi beş yıl tek eşi kaldı.\n\nDers: Ahlak, sonra gelen her şeyin temelidir. Nabi denmeden önce Mekke onu en dürüst insan olarak tanıyordu — bu yüzden ilk vahiyde Hatice'nin anında güvenmesi çok belirleyiciydi (bkz. \"İlk vahiy\"). Günlük işlerde dürüstlük başlı başına bir davettir.",
  },
  {
    title: "Hilfü'l-Fudûl ve Hacerü'l-Esved",
    location: "Mekke",
    body: "Peygamberlik öncesi iki olay, sonra bir millet kuracağı değerleri gösterir. Birincisi Hilfü'l-Fudûl: Kureyş'in birkaç kolunun, Mekke'de yerli veya yabancı her zulme uğrayanın hakkı geri verilene kadar yanında duracağına yemin ettiği kutsal bir anlaşma. Peygamber ﷺ katıldı ve sonra böyle bir paktı İslam'da bile yerine getireceğini söyledi — çünkü adaleti savunuyordu.\n\nİkincisi, selden sonra Kâbe'nin yeniden inşası. Kabileler kutsal Hacerü'l-Esved'i yerine koyma onuru için neredeyse çarpışırken, içeri girecek ilk adamın hükmünü kabul ettiler — o da Muhammed ﷺ'ydi. Ünlü hikmeti: taşı bir örtüye koydu, her kabilenin bir köşesini kaldırmasını sağladı, sonra kendi eliyle yerleştirdi; böylece onur paylaşıldı, kimse küçük görülmedi.\n\nDers: Adalet ve uzlaşma, vahiy onları doğrulamadan önce onun içgüdüsüydü. Mümin, zulme uğrayanı savunur ve bölmek yerine birleştirmenin yolunu arar — Hilfü'l-Fudûl, Hicret sonrası kuracağı adil toplumun habercisiydi.",
  },
  {
    title: "İlk vahiy",
    location: "Hira Mağarası",
    body: "Otuzlu yaşlarının sonunda Peygamber ﷺ, Mekke dışındaki Nûr Dağı'nda Hira Mağarası'nda ibadet ve tefekkür için giderek daha çok inzivaya çekildi. Ramazan ayında, yaklaşık kırk yaşında Cebrail geldi ve \"Oku!\" dedi. O okuyamadığını söyledi; melek onu üç kez sıkıca kucakladı ve Alak Suresi'nin açılış ayetlerini indirdi — \"Yaratan Rabbinin adıyla oku…\" (Kur'an 96:1–5), Kur'an'ın ilk sözleri.\n\nTitreyerek eve döndü; Hatice onu örttü ve imanı ile ahlakını ortaya koyan sözlerle teselli etti: Allah onu asla rezil etmez, çünkü akrabalık bağlarını korur, başkalarının yükünü taşır, hak sahiplerine yardım eder. Onu, önceki kitaplara vâkıf yaşlı Vekâka bin Nevfel'e götürdü; o gelenin Musa'ya gelen aynı \"Nâmûs\" (melek) olduğunu ve bunun vaat edilen nübüvvet olduğunu söyledi. Tüm bu olay Sahih-i Buhari 3'te kayıtlıdır.\n\nDers: Vahiy güç iddiasıyla değil \"Oku\" sözüyle başladı — ilim ve tevazu üzerine kurulu bir din. İlk inananlara bakın: bir eş ve dürüst bir hane. Hakikat, zaten samimi yaşayanların tanıdığı şeydir.",
  },
  {
    title: "Gizli davet yılları",
    location: "Mekke",
    body: "İlk vahiylerden sonra bir ara (fetret) geldi; sonra Allah Peygamber ﷺ'ye yalnızca O'na ibadet etmeye çağırmasını emretti. İlk yaklaşık üç yıl bu çağrı sessiz ve kişiseldi — sokaklarda ilan edilmeden yakın aile ve güvenilir dostlara.\n\nEn önce inananlar, \"es-Sâbikûn el-Evvelûn\", toplumun her kesiminden geldi: eşi Hatice; genç kuzeni Ali bin Ebi Talib; azatlı hizmetçisi ve evlatlığı Zeyd bin Harise; sadık dostu Ebu Bekir es-Sıddık (Allah hepsinden razı olsun). Ebu Bekir de birçok kişiyi İslam'a getirdi. Gizlice toplanıp namaz kılarlardı, çoğu Kâbe yakınındaki el-Erkam evinde.\n\nDers: İslam önce güven ve ilişkiyle büyüdü, gösterişle değil. İlk kalplerin genişliğine bakın — zengin kadın, çocuk, azatlı köle, tüccar — ırk ve makam ayrımını silecek bir inancın ön habercisi. Davet en yakından, samimiyet ve sabırla başlar.",
  },
  {
    title: "Açık İslam daveti",
    location: "Safa Tepesi",
    body: "Allah \"En yakın akrabanı uyarı\" (Kur'an 26:214) ayetini indirince Peygamber ﷺ Kâbe yanındaki Safa Dağı'na çıktı ve Kureyş kabilelerine seslendi. Önce tepenin ardında bir ordu olduğunu söylese inanır mısınız diye sordu; yalan söylediğini hiç görmediklerini söylediler. Sonra gelecek azabı uyardı ve yalnız Allah'a ibadete çağırdı.\n\nBu açık mesaj Mekke düzeninin özüne dokundu. Putlar yalnız din değil, geçim ve prestij kaynağıydı — şehrin mabet bekçiliği hacı ve ticareti çekiyordu. Putların güçsüz olduğunu söylemek Kureyş'in ekonomisine, soylarına ve gururuna birden meydan okumaktı. Zulüm keskinleşti; en çok zayıflar ve köle müminlere, Bilal bin Rabah ve Yâsir ailesi gibi, indi.\n\nDers: Açıkça söylenen hak, kökleşmiş çıkarları sarsar. Peygamber ﷺ önce dürüstlüğüne şahitliklerini istedi — tehditten önce akıl ve dürüstlük — sonra sebat etti. Tevhid için dünyevi bedel ödenebilir. Bu zorluk doğrudan \"Habeşistan'a hicret\"e götürür.",
  },
  {
    title: "Habeşistan'a hicret",
    location: "Habeşistan",
    body: "Zulüm dayanılmaz hale gelince Peygamber ﷺ bir grup sahâbeye, adil Hristiyan Habeşistan (Etiyopya) kralı Necâşî'ye sığınmalarını söyledi; orada kimseye zulmedilmezdi. İlk kafile Kızıldeniz'i geçti; daha büyük ikinci göç geldi — İslam'daki ilk hicret.\n\nKureyş elçiler gönderip mültecileri teslim isteyince Necâşî onları çağırdı. Cafer bin Ebi Talib (Allah ondan razı olsun) Müslümanlar adına konuştu: cehaletten hak, merhamet ve güzel ahlak dolu bir inanca nasıl çıktıklarını anlattı, sonra Meryem Suresi'nden İsa ve annesi hakkında ayetler okudu. Hristiyan kral ağladı, yerde çizgi çekti ve inançları arasındaki farkın o çizgiden geniş olmadığını söyleyerek teslim etmeyi reddetti.\n\nDers: Bu, samimi Ehl-i Kitap ile hoşgörü ve köprü kurmanın dönüm noktasıdır. Adil gayrimüslim otorite altında zulümden kaçmak da caizdir. Günü kazanan argüman güzel ahlak ve okunan Allah kelamıydı — güç değil.",
  },
  {
    title: "Beni Haşim boykotu",
    location: "Şi'b Ebi Talib",
    body: "İslam'ın yayılmasını durduramayınca ve Peygamber ﷺ'ye kabilesi korurken ulaşamayınca Kureyş liderleri toplu cezaya başvurdu. Bir pakt yazıp Kâbe'ye astılar: Beni Haşim (ve müttefiki Beni Mutallib) boykot — evlilik yok, ticaret yok, sosyal ilişki yok, Muhammed ﷺ teslim edilene kadar.\n\nYaklaşık üç yıl kabile — inanan ve inanmayan Haşimliler — Şi'b Ebi Talil vadisinde hapsoldu; çocuk ağlamaları duyulur, yaprak yiyilir hale geldi. Boykot, adil birkaç Kureyşlinin açıkça reddetmesi ve parşömenin Allah adı geçen kısımlar dışında kemirilmiş bulunmasıyla çöktü.\n\nDers: Batıl aşırıya kaçar. Boykotun zulmü zalimleri ve müminlerin azmini ortaya çıkardı. Düşman toplumda adaletle saf dışı kalan birkaç kişinin onuru — vicdan en sert muhalefette bile ayakta kalabilir.",
  },
  {
    title: "Hüzün Yılı",
    location: "Mekke",
    body: "Boykot bitince kısa sürede Peygamber ﷺ iki yıkıcı kayıp yaşadı; yıl Am el-Huzn, Hüzün Yılı oldu. Önce ömür boyu koruyucusu amcası Ebu Talib vefat etti — onlarca yıl Kureyş'ten koruyan. Sonra yaklaşık yirmi beş yıllık eşi, ilk inanan ve en yakın destekçisi Hatice (Allah ondan razı olsun) de vefat etti.\n\nSosyal koruması ve manevi dayanağı birden gidince Kureyş daha cesur zulmetti. Bu dönemde Taif'e gitti; halk mesajı reddedip çocuklara taş attırdı, ayakları kanadı. Şehrin yıkılması teklif edilince bile torunlarının Allah'a ibadet etmesi için dua etti — onu tanımlayan merhamet.\n\nDers: Peygamberler bile art arda keder ve reddedilmeyle sınanır; cevap acısız sabırdır. İnsani kayıp ilahi terk değildir; teselli yakındı — İsra ve Miraç. Bkz. \"İsra ve Miraç\".",
  },
  {
    title: "İsra ve Miraç",
    location: "Kudüs",
    body: "Hüzün Yılı'ndan sonra olağanüstü bir şeref gecesi geldi. İsra'da Peygamber ﷺ bir gecede Mekke'deki Mescid-i Haram'dan Kudüs'teki Mescid-i Aksa'ya götürüldü — Kur'an İsra Suresi'ni bununla açar (Kur'an 17:1). Orada önceki peygamberlere namaz kıldırdı. Miraç'ta yedi kat göğe yükseldi; Âdem, Musa ve İbrahim dahil peygamberlerle buluştu ve yaratılmışlardan daha yakın bir makama ulaştı.\n\nO gecenin asıl armağanı beş vakit namazdı. Sahih-i Buhari 3887'ye göre önce elli olarak farz kılındı; Musa'nın öğüdüyle Peygamber ﷺ tekrar tekrar hafifletme istedi, uygulamada beşe indi, sevabı elli kaldı. Tarih konusunda âlimler ihtilaf eder; çoğu Hicret öncesi yıllara koyar.\n\nDers: Kederli Peygamber ﷺ'yi teselli eden armağan namazdı — her gece Allah'a yükselişimiz. Beş vakit namaz melekle yere indirilmedi; kabul için göklere çıkarıldı; mümin hayatındaki ağırlığının işaretidir.",
  },
  {
    title: "Birinci Akabe Biatı",
    location: "Mina",
    body: "Her yıl hacılar Mekke'de toplanır, Peygamber ﷺ gelen kabilelere İslam'ı sunardı. Mina yakınındaki Akabe'de Yathrib'den (Medine) — Aws ve Hazrec arasında uzun süren kavgalarla yıpranmış, Yahudi cemaati sayesinde tevhidi tanımış bir şehirden — küçük bir grup dinledi, iman etti, mesajı götürdü.\n\nErtesi sezon on ikisi döndü ve Birinci Akabe Biatı'nı verdi: yalnız Allah'a ibadet, hırsızlık ve zina yok, çocuk öldürme yok, Peygamber ﷺ'ye iyilikte itaat. Genç sahâbi Mus'ab bin Umeyr'i (Allah ondan razı olsun) ilk öğretmen ve elçi olarak gönderdi; onunla iman Yathrib evlerine hızla yayıldı.\n\nDers: Mekke'de kapalı görünen kapı Medine'de açıldı. Topluluk eğitimle kuruldu — Kur'an'la gönderilen bir genç öğretmen tüm şehri İslam'ın beşiği olmaya hazırladı. Bu, İkinci Biat ve Hicret'e doğrudan götürür.",
  },
  {
    title: "İkinci Akabe Biatı",
    location: "Mina",
    body: "Birinci biattan bir yıl sonra Yathrib'den çok daha büyük bir heyet — yetmiş üç erkek ve iki kadın — hac mevsiminde gizlice Peygamber ﷺ'ye Akabe'de geldi. Bu kez taahhüt daha ileri gitti: onu karı ve çocuklarını korudukları gibi koruyacaklar, zulüm gören Mekke Müslümanlarını şehirlerine alacaklardı.\n\nDönüm noktasıydı: genç cemaatin ilk kez bir yurdu ve onu savunmaya yeminli insanları vardı. Tehlikeyi görünce Peygamber ﷺ Mekke'deki sahâbeye küçük gruplar halinde Yathrib'e hicret etmelerini sessizce söyledi.\n\nDers: Samimi taahhüt sorumluluk getirir. Ensar, henüz bir şey kazanmadan can ve yurtlarını koydu — yalnızca iman için. Cömertlikleri İslam kardeşliğinin modeli oldu; \"Medine'ye hicret\"te muhacirleri aile gibi karşıladılar.",
  },
  {
    title: "Medine'ye hicret",
    location: "Medine",
    body: "Kureyş Peygamber ﷺ'yi öldürmeyi planlayınca Allah hicret izni verdi. En yakın dostu Ebu Bekir'le (Allah ondan razı olsun) yola çıktı; emanetleri iade için Ali'yi yatağında bıraktı. Sevr Mağarası'nda üç gece saklandılar; takipçiler o kadar yaklaştı ki Ebu Bekir endişelendi — Peygamber ﷺ \"Allah'ın üçüncüsü olan iki kişi hakkında ne dersin?\" dedi. Sahih-i Buhari 3653 ve Kur'an: \"…mağarada iken arkadaşına 'Üzülme, şüphesiz Allah bizimle beraberdir' dedi\" (Kur'an 9:40).\n\nKuba'ya vardılar, ilk mescid orada kuruldu; sonra Yathrib'e — sonra Medinetü'l-Münevvere, \"Aydınlık Şehir\" — girdiler. Her muhaciri bir ensar ile kardeş yaptı; Sa'd bin Rebi kısmetinin yarısını Abdurrahman bin Avf'a teklif etti, o sadece çarşıyı göstermesini istedi (Sahih-i Buhari 3780/3906).\n\nHicret o kadar önemliydi ki Ömer sonra İslam takviminin başı yaptı — 1 H. Ders: Bazen iman her şeyi Allah için bırakmayı, kardeşlikle yeniden inşayı gerektirir.",
  },
  {
    title: "Medine Sözleşmesi",
    location: "Medine",
    body: "Kabile savaşlarıyla parçalanmış bir şehre gelince Peygamber ﷺ yalnız Müslümanları değil, bir topluluk kurdu. İbn İshak siyerinde korunan yazılı Sahife veya Medine Anayasası'nı çizdi: muhacirler, ensar ve şehrin Yahudi kabilelerini karşılıklı savunma anlaşmasına bağladı.\n\nŞartları dönemine göre dikkat çekiciydi: taraflar anlaşma kapsamında \"tek ümmet\", her grup dinini korur, anlaşmazlıklar Peygamber ﷺ'ye, zulüm yasak, dış saldırıya hep birlikte savunma. Medine, kan davası yerine hak ve görevleri olan bir şehir-devlet oldu.\n\nDers: İslam yalnız özel ibadet değil, adil toplum düzenidir. Peygamber ﷺ çoğul birlikte yaşamayı, kabile intikamı yerine anlaşmalı hukuku ve ahde vefa örnekledi — önündeki çatışma yıllarında sınanacak ilkeler.",
  },
  {
    title: "Bedir Savaşı",
    location: "Bedir",
    body: "Hicretten ikinci yılda nefsi müdafaa için savaş izni verildi (Kur'an 22:39). 2 H. 17 Ramazan'da yaklaşık 313 Müslüman — zayıf silahlı, birkaç at — Medine güneybatısındaki Bedir kuyularında bin civarı Kureyş ordusuyla karşılaştı. İslam'ın ilk büyük savaşı.\n\nBeklenmedik şekilde Müslümanlar açık üstünlük kazandı; zalim Kureyş ileri gelenlerinden birçoğu öldü. Kur'an bunu yalnız askeri başarı değil ayet sayar: \"Allah Bedir'de sizi zayıf haldeyken yardım etmişti\" (Kur'an 3:123), melek yardımından bahseder (Kur'an 3:124–125). Genç cemaat Arabistan'da gerçek bir güç oldu.\n\nDers: Sonuç Allah'ındır, sayı ve teçhizatın değil. Bedir \"furkan günü\"dür — samimi tevekkül ve samimi çaba önemlidir. Ertesi yıl Uhud tamamlayıcı dersi öğretecekti.",
  },
  {
    title: "Uhud Savaşı",
    location: "Uhud Dağı",
    body: "Bedir'den bir yıl sonra Kureyş intikam için çok daha büyük orduyla döndü; taraflar Medine yakınındaki Uhud eteğinde buluştu. Peygamber ﷺ elli okçuyu ne olursa olsun yerlerini terk etmemeleri için bir tepeye koydu. Savaşın başında Müslümanlar üstündü; düşman kaçınca okçuların çoğu ganimet için mevziyi bıraktı. Henüz Müslüman olmayan Halid bin Velid'in süvarisi açık kanattan dönünce gün ağır ve acılı bitti.\n\nBirçok sahâbi şehit oldu; aralarında \"Allah'ın Aslanı\" Hamza (Allah ondan razı olsun). Peygamber ﷺ yaralandı, dişi kırıldı, yüzü kanadı. Sonra Kur'an aksiliği açıkça anlattı: emre isyân ve dünyaya tamahın sonucu ve imtihan (Kur'an 3:152, 3:165–166).\n\nDers: Uhud disiplin ve itaatin büyük dersidir. Küçük görünen bir disiplinsizlik neredeyse zaferi bozdu. Allah onları terk etmedi — öğretti, bağışladı, toparladı. Dürüstçe karşılanan yenilgi zaferden çok öğretebilir.",
  },
  {
    title: "Hendek Savaşı",
    location: "Medine",
    body: "Beşinci yılda Kureyş, diğer Arap kabileleri ve düşman gruplar — \"Ahzab\" ittifakı — belki on bin kişilik güçle Medine'yi yok etmek için toplandı. Açık savaşta karşılanamayacak düşmana karşı Peygamber ﷺ, Farslı sahâbi Selman-ı Farisi'nin (Allah ondan razı olsun) şehrin kuzeyinde geniş hendek kazma önerisini kabul etti — Arapların alışık olmadığı bir taktik.\n\nHendek kuşatmayı durdurdu. Haftalarca soğuk, açlık ve korku sürdü; Kur'an Ahzab Suresi'nde müminlerin imtihanını canlı anlatır (Kur'an 33:10). Sonunda şiddetli rüzgar ve iç çekişme ittifakı dağıttı, büyük muharebe olmadan çekildiler. Kur'an kurtuluşu Allah'a verir (Kur'an 33:9).\n\nDers: Bilge şura ve herkesten — burada yabancının mühendisliğinden — iyi fikre açıklık imanın parçasıdır. İnsan çabası tam verildikten sonra kurtuluş yine Allah'tandır. Bu başarısız kuşatma Kureyş'in saldırı gücünü fiilen bitirdi.",
  },
  {
    title: "Hudeybiye Antlaşması",
    location: "Hudeybiye",
    body: "Altıncı yılda Peygamber ﷺ yaklaşık 1400 sahâbiyle savaş için değil, umre için yola çıktı; niyetin barışçıl olduğunu ihramla gösterdi. Kureyş onları mukaddes toprak sınırındaki Hudeybiye'de durdurdu. Gergin müzakereden on yıllık ateşkes çıktı; birçok sahâbiye aşağılayıcı görünen şartlarla: o yıl dönecekler, gelecek yıl gelecekler; Kureyş'ten kaçan iade edilecek, tersi değil.\n\nDönüşte Allah bunun \"apaçık bir fetih\" olduğunu bildirdi (Kur'an 48:1, Fetih Suresi). Sahâbiler daha büyük fetih görmediklerini söyledi — çünkü barışta insanlar rahatça dinledi, savaş yıllarından çok daha fazla İslam'a girdi; Buhari 4606. Ateşkes Müslümanları fiilen eşit güç olarak tanıdı.\n\nDers: Geri adım gibi görünen şey en büyük açılım olabilir. Peygamber ﷺ kısa vadeli kayıp için uzun vadeli hayırı seçti, acı olsa da sözü tuttu. Sabır, özdenetim ve ahde vefa çatışmanın yapamadığını başarır.",
  },
  {
    title: "Hayber seferi",
    location: "Hayber",
    body: "Hudeybiye'den kısa sonra Peygamber ﷺ kuzeydeki zengin, kaleli Hayber vahasını hedef aldı. Hayber, Medine kuşatmasını organize eden ve Müslümanlara karşı komplo kurmaya devam eden düşmanların üssü olmuştu. Amaç tehdidi sona erdirmekti.\n\nKaleler sert çarpışmalarla birer birer düştü; belirleyici günün sancağı Ali bin Ebi Talib'e (Allah ondan razı olsun) verildi. Sonra Peygamber ﷺ halkın toprakta kalıp ürünün bir payı karşılığında çiftçiliğe devam etmesine izin verdi — herkesi sürmek yerine Medine için gıda ve istikrar. Burada bir kadın da koyun etiyle zehirlemeyi denedi; uyarıldı.\n\nDers: Güvenlik ve ahde vefa birlikte yürür. Kanıtlanmış düşmana karşıydı, yenilenler geçimlerini sürdüren bir uzlaşmayla bitti. İslam'da güç, yok etmek için değil güvenlik ve adalet içindir.",
  },
  {
    title: "Mekke'nin fethi",
    location: "Mekke",
    body: 'Kureyş\'in müttefikleri Hudeybiye şartlarını ihlal edip Müslüman müttefike saldırınca ateşkes bozuldu. Sekizinci yıl Ramazan\'da Peygamber ﷺ on bin kişilik orduyla — en büyük güç — yürüdü; yirmi yıl zulüm, boykot ve savaş gören şehir neredeyse kan dökülmeden teslim oldu.\n\nSonunda galip olarak, onu sürenlerin önünde Mekkelilere ne beklediklerini sordu. Asil bir kardeşin merhametini umdular; Yusuf\'un kardeşlerine sözleriyle cevap verdi: "Bugün size bir ayıp yok" — "Gidin, hürssünüz" dedi. Kâbe\'ye girdi, 360 putu temizledi, "Hak geldi, batıl zail oldu" (Kur\'an 17:81) okuyarak İbrahim mabedini saf tevhide döndürdü. Nasr Suresi (Kur\'an 110) insanların "Allah\'ın dinine akın akın girdiği" anı anlatır.\n\nDers: Peygamberî merhamet ve bağışlamanın zirvesi. İntikam gücü varken affetti. Güçlü, cezalandırabildiğinde bağışlayandır; amaç intikam değil hidayetti.',
  },
  {
    title: "Tebük seferi",
    location: "Tebük",
    body: "Dokuzuncu yılda Medine'ye kuzey sınırında Bizans (Rum) hareketliliği haberi geldi. Hasat olgun, yol uzun ve yaz sıcağında Peygamber ﷺ belki otuz bin kişilik — en büyük — orduyu Tebük'e çağırdı. Bu \"zorluk saati\"ydi (Kur'an 9:117); samimiyeti eşi görülmemiş sınadı.\n\nSavaş olmadı; kararlılık yeterli oldu, birkaç kuzey reisi antlaşma yaptı. Sefer özellikle kalpleri ortaya çıkardı. Tevbe Suresi'nin çoğu buna ayrılır — her şeyini verenleri över (Ebu Bekir tüm malını verdi), mazeret uyduran münafıkları açığa çıkarır, Ka'b bin Malik gibi üç samimi müminin dürüst itirafı ve affını anlatır (Kur'an 9:118).\n\nDers: İtaat rahatken kolay; bedel isteyince gerçek ortaya çıkar. Tebük samimi ile mazeretçiyi ayırdı; Arabistan'da örgütlü putperestliğe direniş fiilen bitti. Hata itirafının dürüstlüğü Allah'a dönüş yoludur.",
  },
  {
    title: "Veda Haccı",
    location: "Arafat",
    body: "Onuncu yılda Peygamber ﷺ hayatındaki tek tam haccını, yüz binden fazla sahâbiyle yaptı; menâsiki bizzat öğretti. Arafat'ta Veda Hutbesi'ni verdi — İslam'ın kurduğu her şeyin özeti.\n\nHer can, mal ve ırzın kutsallığını ilan etti — \"Kanınız, malınız ve ırzınız, tıpkı bu gün, bu ay ve bu belde gibi mukaddes\" (Buhari 1741). Cahiliye kan davalarını ve ribayı kaldırdı, kadınlara iyi davranmayı Allah'ın emanetı saydı, Arap'ın Arap olmayana üstünlüğünü yalnız takvada olduğunu hatırlattı, Kur'an'a sarılmayı emretti. Bu haccın Arafat günü — Cuma'ya denk geldi — Allah \"Bugün sizin için dininizi kemale erdirdim…\" (Kur'an 5:3) ayetini indirdi; Ömer tarihini net hatırladı (Buhari 45).\n\nDers: Veda Hutbesi insan onuru, adalet ve eşitliğin İslam senedidir; dinin tamamlandığı ilanıyla mühürlenmiştir. Müminin görevi eklemek değil yaşamaktır.",
  },
  {
    title: "Vefatı",
    location: "Medine",
    body: "Veda Haccı'ndan birkaç ay sonra Peygamber ﷺ ateşli hastalığa yakalandı. Son günlerinde eşlerinden Aişe'nin (Allah ondan razı olsun) odasında bakılmasını istedi; namazlara Ebu Bekir'i imam yaptı. Son sabah perdeyi aralayıp namaz kılan safı gördü, ümmetinden memnun gülümsedi, sonra kapattı. 11 H. 12 Rebiülevvel Pazartesi vefat etti; başı Aişe'nin göğsü ile çenesi arasında — onun Buhari 4449/4451 rivayeti.\n\nMedine'de keder büyüktü; Ömer başta kabul etmedi. Ebu Bekir kalktı, yüzünü öptü, Buhari 1241/1242'de kayıtlı sözlerle cemaati sakinleştirdi: \"Kim Muhammed'e tapıyorsa, Muhammed öldü; kim Allah'a tapıyorsa, Allah Hayy'dır, ölmez.\" \"Muhammed yalnızca bir elçidir; ondan önce de elçiler gelip geçti…\" (Kur'an 3:144) okudu.\n\nDers: Mesaj tamamlandı, artık ümmetindir. Peygamber ﷺ faniydi; getirdiği — Kur'an ve Sünnet — değil. Ebu Bekir'in cevabı kalıcı teselli: bağlılığımız ölmeyen Allah'a; Peygamber ﷺ'yi sevmenin yolu onun rehberliğini yaşamaktır.",
  },
];
