import type {
  LastDayHadithEntry,
  LastDayQuizQuestion,
  LastDayReferenceEntry,
  LastDayTimelineEvent,
  LastDayTopic,
  LastDayVerseEntry,
} from "../../types/last-day";
import type { DeepPartial } from "./localize";

// Turkish translation overlay for the Learn "The Last Day" content. Mirrors the
// order of the English arrays in ../last-day*.ts (index-aligned); untranslated
// entries fall back to English. Only human-readable text is translated — ids,
// routes, surah/ayah numbers, collections, citations, grades and verse-reference
// labels stay in the English source.

export const LAST_DAY_TOPICS_TR: DeepPartial<LastDayTopic>[] = [
  {
    title: "Giriş",
    summary: "Ahiret Günü nedir ve bugün yaşayışımızı nasıl değiştirir?",
    body: [
      "Kıyamet Günü — kalkış, diriliş ve hesap günü — her nefsin, yaptıklarının kendisine gösterilmesi ve son durağının verilmesi için Allah'a döndüğü gündür. Bu, uzak bir efsane ya da şiirsel bir tasvir değildir. Kur'an neredeyse her sayfasında ondan söz eder ve ilk Mekki sûrelerin ağırlık merkezi tam da budur; çünkü ona iman etmek, insanın tüm hayatını yeniden düzenler. Allah'ın huzurunda gerçekten duracağını beklediğinde, doğruluk, namaz, merhamet ve nefis terbiyesi artık isteğe bağlı süslemeler olmaktan çıkar, kişiliğinin özü hâline gelir.",
      "Bu modül yolculuğu adım adım ele alır: ölüm ve ruhun bedeni terk edişi, kabirdeki berzah arası, Kıyamet'ten önce gelen küçük ve büyük alâmetler, Sûr'a üfleniş, bedenlerin dirilişi, geniş bir düzlükte toplanma, amel defterlerinin dağıtılması, Mizan, hesap, Peygamber'in havuzu ve şefaati, Sırat'tan geçiş ve nihayet iki ebedî yurt — Cennet ve Cehennem. Her aşama Kur'an ve sahih hadislerden alınmıştır.",
      "Burada her şeyi iki ilke yönetir. Birincisi: bu olayların gerçekliği kesindir ve akîde meselesidir; dirilişi veya hesabı inkâr etmek, dinin kendisini inkâr etmektir. İkincisi: Kıyamet'in tam vaktini yalnız Allah bilir — hiçbir âlim, takvim veya hesap bunu öngöremez, ve her tarih iddiası yanlıştır. Peygamber ﷺ ashabına hiçbir zaman geri sayım vermedi; onlara bir yaşama biçimi verdi. Öyleyse Ahiret Günü'nü öğrenmenin amacı tahmin değil hazırlıktır: kalbi yumuşatmak, önceliği doğrultmak ve belirlenen an gelmeden hayra koşmak.",
      "Kaynaklar üzerine bir not: popüler 'kıyamet alâmetleri' anlatıları zayıf, hatta uydurma rivayetlerle doludur. Bu modül yalnızca sahih olanı içerir; samimi Ehl-i Sünnet âlimlerinin gerçekten ayrıldığı yerlerde — örneğin bazı büyük alâmetlerin sırası gibi — bu ayrılık bir ayrılık olarak sunulur, ne örtbas edilir ne de abartılır.",
    ],
    quran: [
      {
        excerpt:
          "Yer kendine has bir sarsıntıyla sarsıldığı, yeryüzü ağırlıklarını dışarı çıkardığı ve insan 'Ona ne oluyor?' dediği zaman — işte o gün yer, Rabbinin ona vahyetmesiyle kendi haberlerini anlatacaktır. O gün insanlar, amelleri kendilerine gösterilsin diye bölük bölük çıkacaklardır. Kim zerre miktarı hayır işlemişse onu görecek, kim de zerre miktarı şer işlemişse onu görecektir.",
      },
      {
        excerpt:
          "O, kullarından dilediğine emrinden olan ruhu (vahyi) indirir ki, buluşma gününe karşı uyarsın — o gün onlar ortaya çıkarlar, onlardan hiçbir şey Allah'a gizli kalmaz. Bugün mülk kimindir? Tek ve kahhar olan Allah'ındır.",
      },
    ],
    appLinks: [{ label: "Ahiret Zaman Çizelgesi" }, { label: "Akîde Öğren" }],
  },
  {
    title: "Ahiret Gününe Neden İnanırız?",
    summary: "İmanın altı esasından biri — motivasyon, umut ve nihai adalet.",
    body: [
      "Ahiret Gününe iman, Cebrail meleği dini öğretmeye geldiğinde Peygamber'in ﷺ saydığı altı iman esasından biridir: Allah'a, meleklerine, kitaplarına, peygamberlerine, Ahiret Gününe ve kadere — hayrına ve şerrine — inanmak (Sahih Müslim 8). Bu inanç olmadan tüm hesap verme yapısı çöker — çünkü Allah'a bir dönüş yoksa, zalim ile sâlih aynı sona varır ve her ibadet, nihai bir anlamı olmayan sıradan bir alışkanlığa dönüşür.",
      "Kur'an, Ahiret Günü için hem ahlaki hem aklî delil getirir. Ahlaki olarak: bu, zulme verilen cevaptır; zira zalimlerin yataklarında huzur içinde öldüğü, mazlumların ise hakları alınmadan öldüğü bir dünya — Allah gerçekten adilse — hikâyenin sonu olamaz. Aklî olarak: seni ilk kez yoktan var eden, seni ikinci kez var etmekten âciz değildir (Kur'an 36:78-79). Diriliş, ilk yaratılıştan daha zor değil, daha kolaydır.",
      "Bu iman ayrıca kalbin iki temel dürtüsünü — korku ve umudu — dengeler ve disipline eder. Uyarılar gerçektir, bu yüzden mümin ne kibirlenir ne de gaflete düşer; yine de Allah'ın rahmeti geniştir ve tevbe kapısı ölüme dek açıktır, bu yüzden mümin asla umutsuzluğa kapılmaz. Korku ile umut arasında yaşayan bir kalp, yılmadan çabalamaya devam eden bir kalptir.",
      "Pratikte, Ahiret Günü güçsüze onur, güçlüye ise ölçülülük kazandırır. Mazluma, Allah'ın hiçbir haksızlığı unutmadığını söyler; güçlüye ise hesap gününde hiçbir servetin, makamın ya da nüfuzun onu koruyamayacağını söyler. Bu yüzden ona iman, özel bir teselli değil, bu dünyada adaletin, sabrın ve dürüstlüğün kaynağıdır.",
    ],
    quran: [
      {
        excerpt:
          "Yüzlerinizi doğuya veya batıya çevirmeniz iyilik (birr) değildir. Asıl iyi olan; Allah'a, Ahiret Gününe, meleklere, Kitab'a ve peygamberlere iman eden, malını sevmesine rağmen akrabaya, yetimlere, yoksullara, yolda kalmışlara ve isteyenlere veren kimsedir.",
      },
      {
        excerpt:
          "Allah'ı, zalimlerin yaptıklarından habersiz sanma. O, onları ancak gözlerin dehşetle donup kalacağı bir gün için erteliyor.",
      },
    ],
    hadith: [
      {
        excerpt:
          "İman; Allah'a, meleklerine, kitaplarına, peygamberlerine, Ahiret Gününe iman etmen, kadere — hayrına ve şerrine — iman etmendir. — Cebrail hadisinden, o din öğretmeye geldiğinde.",
      },
    ],
    actions: [
      "Her gün niyetini tazele: amellerim Allah için ve O'nunla karşılaşacağım gün içindir.",
      "Bir haksızlık seni üzdüğünde ve hiçbir dünyevi mahkeme cevap vermediğinde, onu Ahiret Gününün mahkemesine havale et.",
      "Korku ile umudu birlikte tut — ne korku seni umutsuzluğa düşürsün, ne de umut seni gaflete sürüklesin.",
    ],
    appLinks: [{ label: "İmanın altı esası" }],
  },

  {
    title: "Ölüm",
    summary: "Her nefis ölümü tadacaktır — güzel son ve ölene fayda veren şeyler.",
    body: [
      "Ölüm, kimsenin kaçamadığı tek randevudur. Kur'an bunu açıkça ifade eder: her nefis ölümü tadacaktır, ve tam karşılık ancak Kıyamet Günü verilir (Kur'an 3:185). Ölüm yok oluş değil, bir geçiştir — ruh bedeni terk eder ve yolculuğunun bir sonraki aşamasına geçer. Allah'ın görevlendirdiği Ölüm Meleği ruhu alır, sonra Rabbine döndürülürsün (Kur'an 32:11).",
      "Ölümün şekli önemli olduğundan, mümin güzel bir son — hüsn-i hâtime — için çalışır: samimi tevbe, düzenli namaz ve güzel ahlak yoluyla, Allah'ın razı olacağı bir hâlde ölmeyi umarak. Kötü son — sû-i hâtime — ise günahta ısrar edip tevbe etmeden yüz çeviren kimse için korkulan bir şeydir. Yine de burada engin bir rahmet vardır: tevbe kapısı can boğaza gelene dek açık kalır, bu yüzden nefes varken kimse 'artık çok geç' dememelidir.",
      "Peygamber ﷺ ölümü sıkça hatırlamayı öğretti — 'Lezzetleri yok edeni, yani ölümü, çokça anın' (Câmiu't-Tirmizî 2307, hasen) — bu bizi karamsarlaştırmak için değil, uyanık tutmak içindir. Ölümü hatırlamak, bu dünyanın hükmünü zayıflatır, kinleri eritir ve gerçekte neyin önemli olduğunu yeniden düzenler. Ruhun çıkışına dair yalnızca zayıf rivayetlerde geçen ayrıntıları bir kenara bırakmak daha isabetlidir; sahih malzeme, haşyet ve hazırlık için yeterlidir.",
      "Ölüm ayrıca amel defterini de kapatır — üç istisna dışında. Peygamber ﷺ, kişi öldüğünde amellerinin üçü hariç kesileceğini bildirdi: sadaka-i câriye, kendisinden faydalanılmaya devam eden ilim ve kendisine dua eden salih evlat (Sahih Müslim 1631). Bu son derece pratiktir: hayattayken inşa ettiğin, öğrettiğin ve yetiştirdiğin şeyler, sen göçtükten çok sonra bile senin adına kazanmaya devam edebilir.",
    ],
    quran: [
      {
        excerpt:
          "Her nefis ölümü tadacaktır. Ecirleriniz ancak Kıyamet Günü eksiksiz verilecektir. Kim ateşten uzaklaştırılıp Cennete konursa, gerçekten kurtulmuştur. Dünya hayatı, aldatıcı bir metadan başka bir şey değildir.",
      },
      {
        excerpt:
          "De ki: Size vekil kılınan Ölüm Meleği canınızı alacak; sonra Rabbinize döndürüleceksiniz.",
      },
    ],
    hadith: [
      {
        excerpt:
          "İnsan öldüğünde ameli kesilir, ancak üç şey müstesna: sadaka-i câriye, kendisinden faydalanılan ilim ya da kendisine dua eden salih evlat.",
      },
      {
        excerpt: "Lezzetleri yok edeni çokça anın — yani ölümü.",
      },
    ],
    actions: [
      "İstiğfarı artır ve namazını vaktinde kıl — özellikle sağlıklı ve meşgulken, yalnız hastalandığında değil.",
      "Ertelediğin belli bir şey varsa bugün tevbe et; yarına bahse girme.",
      "Üç kalıcı amele yatırım yap: sadaka-i câriye kur, faydalı ilmi yay, çocuklarını tevhid ve güzel ahlak üzere yetiştir.",
    ],
    appLinks: [{ label: "Dua Öğren" }, { label: "Zekât ve sadaka" }],
  },
  {
    title: "Berzah (Kabir Hayatı)",
    summary: "Ölümden Kıyamete kadarki ara — sorgu ve sonuçları.",
    body: [
      "Berzah 'engel' anlamına gelir ve bir kimsenin ölümü ile Kıyamet Günü arasındaki tüm aralığın adıdır. Kur'an bu kelimeyi, ölen zalim geri gönderilmeyi yalvardığında kullanır: 'Onların arkasında, tekrar diriltilecekleri güne kadar bir berzah vardır' (Kur'an 23:100) — bu hayata dönüşün olmadığı sağlam bir duvar. Beden ister gömülsün, ister yakılsın, ister boğulsun ya da kaybolsun, ruh berzaha girer; kabir bunun sadece en yaygın biçimidir ve her insan için Ahiretin ilk aşamasıdır.",
      "Sahih rivayetler defnedilmenin ardından bir sorgulamayı anlatır. İki melek gelip ölüye üç soru sorar: Rabbin kim? Dinin ne? Sana gönderilen bu kişi kim? Allah'ın sabit tuttuğu mümin şöyle cevap verir: Rabbim Allah'tır, dinim İslam'dır, bu da Muhammed'dir ﷺ; kabri ardından genişletilir ve aydınlatılır. Gaflet içindeki kişi ise 'Ah, bilmiyorum' der ve daralmayla karşılaşır (Câmiu't-Tirmizî 1071, hasen; burada iki meleğin adı Münker ve Nekir olarak geçer). Kur'an'ın müminleri 'dünya hayatında ve Ahirette sağlam sözle' sabit tuttuğu için Allah'a hamd etmesinin sebebi tam olarak budur (Kur'an 14:27).",
      "Ardından kabirde nimet ya da azap gelir; bu, sahih nasslarda sabittir: 'Kabir ya Cennet bahçelerinden bir bahçe ya da Cehennem çukurlarından bir çukurdur' (Câmiu't-Tirmizî 2460, hasen sahih). Kur'an, Firavun kavminin Kıyamet gelmeden önce bile 'sabah akşam' ateşe sunulduğuna işaret eder (Kur'an 40:46). Ehl-i Sünnet, kabir azabı ve nimetinin gerçekliğini kabul eder, fakat tam mahiyetini gaybe ait olduğu ve dirilerin idrakine girmediği için Allah'a havale eder.",
      "Kabir sorgusunun ve kabirdeki nimet ya da azabın gerçek olduğu konusunda ittifak vardır; âlimler ince noktalarda tartışır — bedene mi, ruha mı yoksa her ikisine mi dokunduğu, ve olağan bir kabri olmayanlara nasıl ulaştığı gibi — ama bu sorular asıl noktadan dikkati dağıtmaz. Berzah en büyük teşviktir: kabri, topraktaki bir çukurdan kişinin kendi amellerinin aynasına dönüştürür ve önden gönderdiğin şeyin orada seni karşılayacağını açıkça gösterir.",
    ],
    quran: [
      {
        excerpt:
          "Nihayet onlardan birine ölüm geldiğinde der ki: Rabbim, beni geri döndür; belki terk ettiğim yerde salih bir amel işlerim. Hayır! Bu, sadece onun söylediği bir sözdür; ve onların arkasında, tekrar diriltilecekleri güne kadar bir berzah vardır.",
      },
      {
        excerpt:
          "Ateş — sabah akşam ona sunulurlar. Kıyamet koptuğu gün de: Firavun ailesini azabın en şiddetlisine sokun, denilecektir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kabir ya Cennet bahçelerinden bir bahçe ya da Cehennem çukurlarından bir çukurdur.",
      },
      {
        excerpt:
          "Ölü defnedildiğinde iki melek gelip ona Rabbini, dinini ve peygamberini sorar. Mümin kesin bir inançla cevap verir ve kabri genişletilip aydınlatılır.",
      },
    ],
    misconceptions: [
      "Yanlış anlama: Kabir azabı, dayanaksız bir halk inancıdır. Düzeltme: Sorgunun ve kabirdeki nimet ya da azabın gerçekliği sahih hadislerde sabittir ve Kur'an'da buna işaret edilir; bu, Ehl-i Sünnet akîdesinin yerleşik bir noktasıdır.",
      "Yanlış anlama: Meleklerin tam görünüşü ve adları üzerinde tartışmalıyız. Düzeltme: Münker ve Nekir isimlendirmesi hasen bir rivayette geçer; asıl inanç, sorgunun kendisidir. Ona doğrulukla cevap vermeye hazırlanmak, ayrıntılarını tartışmaktan çok daha önemlidir.",
    ],
    actions: [
      "Tevhide ve Sünnete şimdi sımsıkı sarıl — kabrin cevapları orada ezberlenmez, burada yaşanır.",
      "Peygamberin ﷺ koruma ve sebat olarak öğrettiği sabah akşam zikirlerini koru.",
    ],
    appLinks: [{ label: "Sabah akşam zikirleri" }],
  },

  {
    title: "Ahiret Gününün Alâmetleri",
    summary: "Küçük ve büyük alâmetler — Kıyamet'in kesinliği, vaktinin bilinmezliği.",
    body: [
      "Kıyamet'in geleceği kesindir, ama vakti Allah'ın kendine sakladığı bir sırdır. Peygamber'e ﷺ bile ne zaman geleceği sorulduğunda, verilen cevap, sorulanın sorandan daha fazlasını bilmediği yönündeydi — onun bilgisi yalnızca Allah'ın katındadır (Kur'an 7:187). Öyleyse herhangi bir 'alâmeti' incelemeden önce netleştirilmesi gereken ilk şey şudur: alâmetler bizi hazırlamak için verilmiştir, asla bir tarih hesaplamamız için değil. Kıyamet için bir yıl belirleyen herkes Kur'an'a aykırı davranmıştır.",
      "Âlimler bu işaretleri iki türe ayırmıştır. Küçük alâmetler (el-alâmâtü's-suğrâ), sonun gelmesinden önceki uzun yüzyıllar boyunca birikerek gelen tedrici toplumsal, ahlaki ve dünyevi değişimlerdir. Büyük alâmetler (el-alâmâtü'l-kübrâ) ise tam sonun yaklaştığı sırada birbiri ardınca gelen olağanüstü, inkâr edilemez olayların bir kümesidir. Kur'an 'onun bazı alâmetleri şimdiden gelmiştir' der (Kur'an 47:18) — bu ifadenin, Peygamberin ﷺ kendisinin gelişini ve ayın yarılmasını da içerdiği anlaşılır.",
      "Büyük alâmetler için temel metin, Huzeyfe bin Üseyd'in hadisidir; Peygamber ﷺ burada on alâmet saymıştır: duman (ed-Duhân), Deccâl, yerin canlısı (Dâbbetü'l-Arz), güneşin battığı yerden (batıdan) doğması, İsa bin Meryem'in (aleyhisselam) inişi, Ye'cûc ve Me'cûc, ve üç büyük yer çöküşü — biri doğuda, biri batıda, biri Arap Yarımadası'nda — ve son olarak insanları toplanma yerlerine süren bir ateş (Sahih Müslim 2901). Mehdî ve Deccâl başka sahih rivayetlerde de geçer ve bunlar İsa'nın (aleyhisselam) inişinden önce yerleştirilir.",
      "Dürüst ilmî tutum şudur: her alâmet sabit olsa da, tam sırası nasslarda tamamen belirlenmemiştir ve güvenilir Ehl-i Sünnet âlimleri bu kesin sıra üzerinde ayrılırlar. Bu ayrılık, geleneğin normal bir parçasıdır ve tartışma sebebi değildir. Bütün bunlara peygamberî cevap, korku salmak veya güncel olaylar üzerine sonu gelmeyen tahminler değil, imanı artırmak, tevbe etmek ve faydalı amel işlemektir.",
    ],
    quran: [
      {
        excerpt:
          "Sana Kıyamet'i, ne zaman gelip çatacağını sorarlar. De ki: Onun bilgisi ancak Rabbimin katındadır. Onun vaktini O'ndan başkası açığa çıkaramaz. O, göklere ve yere ağır basmıştır. O size ancak ansızın gelecektir.",
      },
      {
        excerpt:
          "Onlar Kıyamet'in kendilerine ansızın gelmesinden başka bir şey mi bekliyorlar? Onun bazı alâmetleri şimdiden gelmiştir. Fakat kendilerine geldiğinde, öğüt almaları onlara ne fayda verecek?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ondan önce şu on alâmeti görmedikçe Kıyamet kopmayacaktır: duman, Deccâl, dâbbe, güneşin batıdan doğması, İsa bin Meryem'in inişi, Ye'cûc ve Me'cûc, üç yer çöküşü — biri doğuda, biri batıda, biri Arap Yarımadası'nda — ve bunların sonuncusu, insanları toplanma yerlerine süren bir ateş.",
      },
    ],
    appLinks: [{ label: "Küçük alâmetler" }, { label: "Büyük alâmetler" }],
  },
  {
    title: "Küçük Alâmetler",
    summary: "Peygamberin ﷺ anlattığı tedrici değişimler — panik değil hazırlık.",
    body: [
      "Küçük alâmetler, toplumda, ahlakta ve ilim hâlinde meydana gelen, Peygamberin ﷺ Kıyamet yaklaştıkça artacağını söylediği yavaş, birikimli değişimlerdir. Sayıca çoktur ve yapıları gereği tek bir dramatik anda değil, uzun zaman dilimlerine yayılarak ortaya çıkarlar. Aslında en büyük küçük alâmet çoktan gerçekleşmiştir: Peygamber Muhammed'in ﷺ kendisinin gönderilişi; O, iki parmağını birleştirerek 'Ben ve Kıyamet, şu ikisi gibi gönderildik' buyurmuştur — yani son elçi ve son çağ başlamıştır.",
      "Sahih hadislerde bildirilen alâmetlerden bazıları: emanetin kalkması, öyle ki işler ehil olmayanlara verilir — 'Emanet zayi edildiğinde Kıyamet'i bekle' ve bu, 'yetki ehil olmayana verildiğinde' gerçekleşir (Sahih Buhârî 6496). Meşhur Cebrail hadisinde Peygamber ﷺ iki çarpıcı alâmet zikretmiştir: 'Cariyenin efendisini doğurması, ve yalınayak, çıplak, yoksul çobanların yüksek binalar yapmakta yarıştığını görmen' (Sahih Müslim 8).",
      "Diğerleri arasında zamanın akışının genel olarak hızlanması, depremlerin ve öldürmenin artması, ve ilmin kalkması sayılır. İlim konusunda Peygamber ﷺ mekanizmayı açıkça belirtti: 'İlim kalkmadıkça, depremler artmadıkça, zaman hızla geçmedikçe, fitneler ortaya çıkmadıkça ve öldürme artmadıkça Kıyamet kopmayacaktır' (Sahih Buhârî 1036). Ve ilmin nasıl gittiğini şöyle açıkladı: 'Allah ilmi insanlardan çekip almaz; âlimleri alarak kaldırır, ta ki hiç âlim kalmaz ve insanlar cahilleri önder edinirler; onlara sorulur, onlar da ilimsiz fetva verirler; böylece hem kendileri sapar hem de başkalarını saptırırlar' (Sahih Buhârî 100). Öyleyse 'ilmin kalkması', bilgi eksikliği değildir — bir çağ bilgiye boğulmuş olabilir — asıl olan, hakiki âlimlerin ve yaşanan uygulamanın ortadan kalkmasıdır.",
      "Burada önemli bir disiplin: belirli bir modern olayın falanca hadisin gerçekleşmesi 'olduğunu' ilan etmek, yorumsal (ictihadî) bir şeydir, kesin değil. Gökdelen yarışları ya da artan suç oranları Peygamberin ﷺ sözlerini yankılıyor olabilir, ama vahyi manşetlere kesin bir güvenle yapıştırmak, dikkatli âlimlerin yolu değildir. Her küçük alâmete doğru cevap içseldir: onu, Allah'a dönme, dini öğrenip yaşama, emanet ve doğruluğa sımsıkı sarılma çağrısı olarak oku — kaygı ya da gösteri malzemesi olarak değil.",
    ],
    hadith: [
      {
        excerpt:
          "Emanet zayi edildiğinde Kıyamet'i bekle. Soruldu: Ey Allah'ın Resulü, o nasıl zayi olur? Buyurdu ki: Yetki ehil olmayana verildiğinde Kıyamet'i bekle.",
      },
      {
        excerpt:
          "Kıyamet alâmetlerinden biri: cariyenin efendisini doğurması, ve yalınayak, çıplak, yoksul çobanların yüksek binalar yapmakta yarıştığını görmendir. — Cebrail hadisinden.",
      },
      {
        excerpt:
          "Allah ilmi çekip almaz; âlimleri alarak kaldırır, ta ki hiç âlim kalmaz ve insanlar cahilleri önder edinirler; onlar da ilimsiz fetva verirler; böylece hem sapar hem de saptırırlar.",
      },
    ],
    disclaimer:
      "Belirli küçük alâmetleri belli bir güncel olaya uygulamak yorumsaldır, kesin değildir. Bu modül, hangi modern olguların bunları kesin olarak gerçekleştirdiğini iddia etmeden sahih hadisleri sunar.",
    actions: [
      "Ehil öğretmenlerden faydalı ilim al, onunla amel et ve aktar — bu, kaybolan ilim alâmetine doğrudan karşı koyar.",
      "Konuşmanda, işinde ve muamelelerinde emanet ve doğruluğu koru.",
      "Her alâmeti içsel olarak bir tevbe çağrısı olarak oku, panik ya da çevrimiçi spekülasyon yakıtı olarak değil.",
    ],
  },
  {
    title: "Büyük Alâmetler",
    summary: "Sahih Müslim'deki on büyük alâmet — Mehdî, Deccâl, İsa (a.s.) ve daha fazlası.",
    body: [
      "Büyük alâmetler, tam sonun yaklaştığı sırada bir araya gelen büyük, inkâr edilemez olaylardır. Bunların temel kaynağı Huzeyfe bin Üseyd'in hadisidir: Peygamber ﷺ, ashabının Kıyamet'i konuştuğunu görünce, on alâmeti görmedikçe kopmayacağını söyledi — duman (ed-Duhân), Deccâl, yerin canlısı (Dâbbetü'l-Arz), güneşin batıdan doğması, İsa bin Meryem'in inişi, Ye'cûc ve Me'cûc, üç yer çöküşü (doğu, batı ve Arabistan'da) ve nihayet insanları toplanma yerlerine süren bir ateş (Sahih Müslim 2901). Küçük alâmetlerin aksine, bunlar başladığında birbiri ardınca yakın aralıklarla gelir.",
      "Mehdî, sahih rivayetlerde, yeryüzü zulümle dolduğu gibi onu adaletle dolduracak, Peygamberin ﷺ ehl-i beytinden adil bir önder olarak gelir (Sünen Ebû Dâvûd 4282, hasen). O bir şeriat koyucu ya da yeni bir peygamber değildir — ihya eder, icat etmez — ve ona iman Ehl-i Sünnet tarafından kabul edilirken zayıf rivayetlerdeki ek ayrıntılar bir kenara bırakılır.",
      "Deccâl (sahte mesih) tek başına en büyük dünyevi imtihandır. Peygamber ﷺ onu Nevvâs bin Sem'ân'ın uzun hadisinde ayrıntılıca tasvir etmiştir (Sahih Müslim 2937): iki gözü arasında 'kâfir' yazılı, tek gözlü bir aldatıcı; imanı sınamak için güç verilmiş, ve her peygamberin kavmini kendisine karşı uyardığı biri. Onun fitnesi tartışmayla değil, sağlam imanla yenilir; Peygamber ﷺ Kehf sûresinin ilk âyetlerini ezberlemeyi ondan korunma olarak öğretmiştir.",
      "Ardından İsa bin Meryem (aleyhisselam) inecektir — bu, Ehl-i Sünnet akîdesinin sağlam bir noktasıdır. Peygamber ﷺ şöyle buyurmuştur: 'Canım elinde olana yemin ederim ki, Meryem oğlu aranıza adil bir hakim olarak inecek; haçı kıracak, domuzu öldürecek, cizyeyi kaldıracak ve mal öylesine bollaşacak ki onu kabul eden bulunmayacak' (Sahih Buhârî 3448). O, Muhammed'in ﷺ bir takipçisi olarak iner, ümmetin imamının arkasında namaz kılar (Sahih Buhârî 3439), Deccâl'i öldürür ve Muhammed'in ﷺ şeriatına göre hükmeder. Sonra Ye'cûc ve Me'cûc salıverilir, ve geri kalan alâmetler insanları toplayan ateşe kadar ortaya çıkmaya devam eder.",
      "İki dürüstlük noktası. Birincisi: âlimler on alâmet hadisindeki her alâmetin gerçekliğinde birleşirler ama tam sırasında ayrılırlar, ve bu ayrılık meşru ve eskidir. İkincisi: duman ve dâbbe, bu sahih hadisin bizzat bir parçasıdır; onları ayrı ayrı ayrıntılandıran bazı diğer rivayetlerin gücü değişkenlik gösterir, bu yüzden bu modül inancı zayıf eklemeler yerine güçlü on alâmet rivayetine dayandırır.",
    ],
    hadith: [
      {
        excerpt:
          "Şu on alâmeti görmedikçe Kıyamet kopmayacaktır: duman, Deccâl, dâbbe, güneşin batıdan doğması, İsa bin Meryem'in inişi, Ye'cûc ve Me'cûc, ve üç yer çöküşü — biri doğuda, biri batıda, biri Arap Yarımadası'nda — ve bunların sonuncusu insanları toplanma yerlerine süren bir ateş.",
      },
      {
        excerpt:
          "Canım elinde olana yemin ederim ki, Meryem oğlu aranıza adil bir hakim olarak inecek. Haçı kıracak, domuzu öldürecek ve cizyeyi kaldıracak, ve mal öylesine çoğalacak ki onu kabul eden bulunmayacak.",
      },
      {
        excerpt:
          "Dünyanın sadece bir günü kalsa bile Allah o günü uzatır, ta ki onda ailemden bir adamı (Mehdî'yi) çıkarır; o, yeryüzü zulüm ve haksızlıkla dolduğu gibi onu adaletle doldurur.",
      },
    ],
    disclaimer:
      "Büyük alâmetlerin gerçekliği sabittir, ama tam sırası ve vakti konusunda âlimler arasında tam bir görüş birliği yoktur. Tarih belirlemekten ve herhangi bir güncel kişiyi Mehdî, Deccâl ya da İsa (a.s.) olarak nitelemekten kaçının.",
    appLinks: [{ label: "Akîde — Kıyamet alâmetleri" }],
  },

  {
    title: "Sûr",
    summary: "İsrafil — birinci üfleyiş, ikinci üfleyiş ve diriliş.",
    body: [
      "Allah sonu takdir ettiğinde, Sûr'a görevli melek onu üfleyecektir. Ona İsrafil denmesi ilmî gelenekten gelir; Kur'an'ın kesin olarak sabitlediği şey, olayın ve dehşetinin kendisidir. Peygamber ﷺ bunun her zaman ne kadar yakın olduğunu şöyle aktarmıştır: 'Sûr'u taşıyan, onu ağzına dayamış, alnını eğmiş, üflemek için emri beklerken ben nasıl rahat olabilirim?' — ve bu, ashabı endişelendirdiğinde onlara şunu söylemeyi öğretti: 'Allah bize yeter, O ne güzel vekildir' (Câmiu't-Tirmizî 2431, hasen).",
      "İki üfleyiş vardır ve Kur'an bunları birbirinden ayırır. Birincisinde 'Sûr'a üflenir de Allah'ın diledikleri müstesna, göklerde ve yerde kim varsa hepsi ölüverir' (Kur'an 39:68) — yaratılış düzenini sona erdiren dehşet ve ölüm üfleyişi. Ardından ikincisi gelir: 'Sonra ona bir daha üflenir, bir de bakarsın onlar ayakta bakınıp duruyorlar' (aynı âyetin devamı) — bütün yaratılışın ölülerden kalktığı diriliş üfleyişi.",
      "Birçok âlim, aynı âyetten ve destekleyici rivayetlerden yola çıkarak bir istisnadan söz eder — düşürülmeyen o 'Allah'ın diledikleri' — ve iki üfleyiş arasında bir aradan söz eder, gerçi bunun süresi ve ayrıntıları farklı güçteki rivayetlere dayanır ve Allah'a havale edilir. Kesin olan, üfleyişlerin çiftidir: bir son, ardından bir kalkış. Buna 'Yevmü't-Tenâd' (uyarı günü) denir (Kur'an 50:20), çünkü bu son çağrıdır, hazırlık için artık zaman kalmadığında yükselir — ve tam da bu yüzden bu çağrıya şimdi cevap verilmelidir.",
    ],
    quran: [
      {
        excerpt:
          "Sûr'a üflenir de Allah'ın diledikleri müstesna, göklerde ve yerde kim varsa hepsi ölüverir. Sonra ona bir daha üflenir, bir de bakarsın onlar ayakta bakınıp duruyorlar.",
      },
      {
        excerpt: "Sûr'a üflenir. İşte bu, uyarı günüdür.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sûr'u taşıyan, onu ağzına dayamış ve alnını eğmiş, üflemek için emri beklerken ben nasıl rahat olabilirim? Ashap bundan endişelendi, o da onlara şöyle demelerini söyledi: Allah bize yeter, O ne güzel vekildir.",
      },
    ],
  },
  {
    title: "Diriliş",
    summary: "Bedenlerin yeniden var edilişi — Allah'ın huzurunda durmanın evrenselliği.",
    body: [
      "İkinci üfleyişte ölüler bedeniyle ve ruhuyla diriltilecektir, ve bu diriliş yalnızca ruhani değil, gerçek ve bedenseldir. Kur'an, şüphecinin alaycı sorusuna doğrudan cevap verir: bir adam un ufak bir kemik tutup kimin ona hayat vereceğini sorar; cevap şudur: 'De ki: Onu ilk defa yaratan diriltecektir. O, her yaratmayı hakkıyla bilir' (Kur'an 36:78-79). Seni yoktan var etmek Allah'ın kudretindeyse, seni geri döndürmek daha zor değildir.",
      "Diriliş evrenseldir — ilkinden sonuncusuna, her ulustan her insan diriltilir. Peygamber ﷺ insanların hangi hâlde kalkacağını şöyle tasvir etmiştir: 'İnsanlar yalınayak, çıplak ve sünnetsiz olarak toplanacaktır.' Aişe telaşla erkeklerin ve kadınların birbirine bakıp bakmayacağını sorduğunda, o gün meselenin bundan çok daha ciddi olacağını, kimsenin buna aldırmayacağını söylemiştir (Sahih Buhârî 6527). Ayrıca şöyle buyurmuştur: 'Yalınayak, çıplak ve sünnetsiz olarak toplanacaksınız — ve Kıyamet Günü ilk giydirilecek kişi İbrahim (aleyhisselam) olacaktır' (Sahih Buhârî 3349).",
      "Bu inancın amacı gösteri değil, dayattığı sorumluluktur. Allah'a dönüş kesin olduğundan, hiçbir amel gerçekten özel değildir ve hiçbir ölüm gerçekten bir kaçış değildir. 'Kıyamet mutlaka gelecektir, onda hiç şüphe yoktur; ve Allah kabirlerde olanları diriltecektir' (Kur'an 22:7). Bedensel dirilişe iman, bu hayatın ahlaki ağırlığını geçici değil gerçek kılan şeydir.",
    ],
    quran: [
      {
        excerpt:
          "O, bize bir örnek getirir ve kendi yaratılışını unutur; 'Çürümüş haldeyken kemikleri kim diriltecek?' der. De ki: Onları ilk defa yaratan diriltecektir. O, her yaratmayı hakkıyla bilir.",
      },
      {
        excerpt:
          "Ve Kıyamet mutlaka gelecektir, onda hiç şüphe yoktur; ve Allah kabirlerde olanları diriltecektir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Yalınayak, çıplak ve sünnetsiz olarak toplanacaksınız. Sonra şu âyeti okudu: İlk yaratılışa başladığımız gibi, onu yeniden yaparız. Ve Kıyamet Günü ilk giydirilecek kişi İbrahim olacaktır.",
      },
      {
        excerpt:
          "İnsanlar yalınayak, çıplak ve sünnetsiz olarak toplanacaktır. Aişe dedi ki: Erkekler ve kadınlar birbirlerine bakacaklar mı? Buyurdu ki: İş bundan çok daha ciddi olacaktır.",
      },
    ],
  },
  {
    title: "Mahşer (Toplanma)",
    summary: "Allah'ın huzurunda durmak — güneşin yakınlığı, ter ve insanların hâlleri.",
    body: [
      "Diriliş sonrasında bütün yaratılış, hükmü beklemek üzere geniş, düz bir düzlüğe — Mahşer'e — sürülür. Yerin kendisi değiştirilir: 'O gün yer başka bir yerle değiştirilir, gökler de; ve onlar, tek ve kahhar olan Allah'ın huzuruna çıkarlar' (Kur'an 14:48). Ne bir işaret, ne saklanacak bir kalabalık, ne dayanılacak bir makam vardır — yalnızca her nefis, açıkta ve beklerken.",
      "O duruşun şartları ağırdır. Peygamber ﷺ şöyle buyurmuştur: 'Kıyamet Günü güneş insanlara öylesine yaklaştırılır ki bir mil mesafede olur, ve insanlar amellerine göre kendi terlerine gömülürler — kimi ayak bileklerine, kimi dizlerine, kimi beline kadar, ve kimini de ter gem gibi kuşatır' (Sahih Müslim 2864). Yine de aynı rivayetler, amellere göre dağıtılan bir rahmeti anlatır: Peygamberin ﷺ adını verdiği bir topluluk, O'nun gölgesinden başka gölge olmadığı bir günde Allah'ın Arşının gölgesinde gölgelenecektir — bunlar arasında adil bir yönetici, ibadet içinde büyümüş bir genç ve sol elinin sağ elinin verdiğinden haberi olmayacak kadar gizlice sadaka veren biri vardır.",
      "Bekleyiş uzundur — Kur'an 'ölçüsü elli bin yıl olan bir gün'den söz eder (Kur'an 70:4) — ama uzunluğu herkes için aynı değildir. Sahih rivayetler, bunun mümin için iki namaz arasındaki süre kadar kısa hafifletileceğini, başkalarına ise ağır bastığını söyler. Öyleyse Mahşer, bir hayatın özel defterinin aleni gerçeğe dönüştüğü yerdir: aynı güneş, aynı düzlük, ve tamamen farklı deneyimler — bunların tümü, her kişinin önden ne gönderdiğinden kaynaklanır.",
    ],
    quran: [
      {
        excerpt:
          "O gün yer başka bir yerle değiştirilir, gökler de; ve onlar, tek ve kahhar olan Allah'ın huzuruna çıkarlar.",
      },
      {
        excerpt: "Melekler ve Ruh, ölçüsü elli bin yıl olan bir günde O'na yükselirler.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kıyamet Günü güneş insanlara yaklaştırılır, ta ki yaklaşık bir mil mesafede olur, ve insanlar amellerine göre kendi terlerine gömülürler — kimi ayak bileklerine, kimi dizlerine, kimi beline kadar, ve kimini de ter gem gibi kuşatır.",
      },
    ],
  },
  {
    title: "Şefaat",
    summary: "Yalnızca Allah'ın izniyle — türleri ve en büyük şefaat.",
    body: [
      "Şefaat, aracılık demektir — bir tarafın diğeri adına Allah'a konuşmasıdır. Bu gerçektir ve bir rahmettir, ama asla bağımsız değildir: hiç kimse Allah'ın önceden izni olmadan ve yalnızca O'nun razı olduğu kimse için şefaat edemez. Kur'an bu kuralı iki kez belirtir: 'O'nun izni olmadan katında kim şefaat edebilir?' (Kur'an 2:255) ve 'O'nun katında şefaat, ancak izin verdiği kimseye fayda verir' (Kur'an 34:23). Şefaatin İslami akîdesini her türlü bozulmasından ayıran, işte bu tek şarttır.",
      "En büyüğü, yalnızca Peygamber Muhammed'e ﷺ özgü olan Şefaat-i Uzmâ'dır. Mahşer'de, uzun bekleyişten bunalmış hâlde, insanlar bir peygamberden diğerine gidecektir — Âdem, İbrahim, Musa, İsa (aleyhimüsselam) — her biri özür dileyecek, ta ki Muhammed'e ﷺ gelirler. O, Arş'ın altında secdeye kapanacak ve kendisine şöyle denilecektir: 'Başını kaldır, iste sana verilecek, şefaat et şefaatin kabul edilecek' (Sahih Buhârî 7440; peygamberlerin tam silsilesi Sahih Müslim 195'tedir). Bununla Allah'tan hesabı başlatmasını ve bekleyişin sıkıntısını gidermesini isteyecektir — bu, yalnızca ona vaat edilmiş bir övgü makamıdır (Makam-ı Mahmûd).",
      "Başka sahih türler de vardır: bazı müminlerin hesapsız Cennete girmesini sağlayan şefaat; dereceleri yükselten şefaat; ve hepsinden öte, müminler arasındaki büyük günahkârlar için şefaat — böylece insanlar Peygamberin ﷺ, diğer peygamberlerin, meleklerin, müminlerin ve nihayet merhametlilerin en merhametlisi olan Allah'ın rahmetinin şefaatiyle ateşten çıkarılır. Peygamberler, şehitler, salihler ve hatta küçük yaşta ölen çocuklar da izinle şefaat edebilir, gerçi tek tek rivayetlerin gücü değişkenlik gösterir.",
      "Temel bir uyarı: Ahiretteki şefaat, ölülere ya da gaiplere şimdi yardım için seslenmeyi asla meşru kılmaz. Bir peygamberi ya da veliyi kabirde çağırmak, ondan sıkıntıyı gidermesini ya da ihtiyacı karşılamasını istemek, ibadeti Allah'tan başkasına yöneltmektir — bu şirktir ve burada anlatılan, Allah'ın dilediğine o gün bahşettiği bir lütuf olan şefaatin tam tersidir. Bu, bu hayatta iman ve tevbe ihtiyacının da yerini tutmaz; bu, tevhid üzere yaşayıp ölenlere Allah'ın rahmetidir.",
    ],
    quran: [
      {
        excerpt:
          "O'nun izni olmadan katında kim şefaat edebilir? O, onların önlerindekini ve arkalarındakini bilir; O'nun ilminden, dilediği kadarından başka hiçbir şeyi kavrayamazlar.",
      },
      {
        excerpt: "Ve O'nun katında şefaat, ancak izin verdiği kimseye fayda verir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "İnsanlar bana gelecek, ben de Allah'ın huzurunda secdeye kapanacağım; o zaman şöyle denilecek: Ey Muhammed, başını kaldır; iste sana verilecek, şefaat et şefaatin kabul edilecek.",
      },
      {
        excerpt:
          "İnsanlar Âdem'e gidecek, sonra İbrahim'e, sonra Musa'ya, sonra İsa'ya, ve her biri özür dileyecek, ta ki Muhammed'e ﷺ gelirler, ve ona en büyük şefaat verilecektir.",
      },
    ],
    misconceptions: [
      "Yanlış anlama: Şefaat dilemek, Peygamberin ﷺ ya da salihlerin ibadet edilmesi anlamına gelir. Düzeltme: İbadet yalnızca Allah'a aittir; Ahiret Gününde şefaat, Allah'ın kendi izniyle bahşettiği bir rahmettir ve bu hayatta ölülere seslenmeyi meşru kılmaz.",
    ],
  },
  {
    title: "Amel Defteri",
    summary: "Yazıcı melekler — sağ el, sol el, hiçbir şey eksik kalmaz.",
    body: [
      "Her insanın amellerini yazan iki şerefli kâtip vardır: 'Sağında ve solunda oturan iki alıcı melek yazarken, o hiçbir söz söylemez ki yanında hazır bekleyen bir gözetleyici bulunmasın' (Kur'an 50:17-18). Ahiret Gününde bu defterler dağıtılır, ve kişinin kitabını alış şekli zaten ilk hükümdür — başarılı olan için sağ elinde, mahvolan için sol elinde ya da arkasından (Kur'an 84:7-12; 69:19-37).",
      "Bu defterlerden hiçbir şey eksik kalmaz — en küçük fiil bile, hatta amele dönüşen geçici bir düşünce bile. Zalimler bunun eksiksizliği karşısında şaşkına dönecektir: 'Vay hâlimize! Bu nasıl bir kitaptır ki küçük büyük hiçbir şey bırakmadan hepsini saymış! diyecekler. Ve yaptıklarını karşılarında bulacaklar; Rabbin kimseye zulmetmez' (Kur'an 18:49). Allah'ın rahmetiyle, iyi niyetler ve terk edilen günahlar da müminin lehine yazılır.",
      "Dil ve organlar sayfaları doldurduğundan, onları korumak defteri korumaktır. Peygamber ﷺ kurtuluş için dili merkeze koymuştur: 'Kim bana iki çenesi arasındaki ile iki bacağı arasındakini garanti ederse, ben de ona Cenneti garanti ederim' (Sahih Buhârî 6474) — yani konuşmasını ve iffetini koruyan kimse. Bugün defterine ne eklediğini sorarak yapılan günlük dürüst bir öz muhasebe alışkanlığı, bir müminin sürdürebileceği en uyarıcı ve faydalı alışkanlıklardan biridir.",
    ],
    quran: [
      {
        excerpt:
          "Ve amel defteri ortaya konulur; suçluları içindekinden korkarken görürsün. 'Vay hâlimize! Bu nasıl bir kitaptır ki küçük büyük hiçbir şey bırakmadan hepsini saymış!' derler. Ve yaptıklarını karşılarında bulacaklar; Rabbin kimseye zulmetmez.",
      },
      {
        excerpt:
          "Kime kitabı sağ eline verilirse, 'Alın, kitabımı okuyun! Ben zaten hesabımla karşılaşacağımı biliyordum' der. İşte o, hoş bir hayat içindedir. Kime de kitabı sol eline verilirse, 'Keşke kitabım bana verilmeseydi' der.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim bana iki çenesi arasındaki ile iki bacağı arasındakini garanti ederse, ben de ona Cenneti garanti ederim — yani dilini ve iffetini.",
      },
    ],
    actions: [
      "Dilini neredeyse her şeyden çok koru — hayra ya da şerre defteri dolduran şeylerin çoğu ondan geçer.",
      "Uyumadan önce günü gözden geçir: kitabında görmek isteyeceğin ve korkacağın şeyleri sor.",
    ],
    appLinks: [{ label: "Namaz günlüğü" }],
  },
  {
    title: "Mizan (Terazi)",
    summary: "Amellerin tartılması — ihlas, ahlak ve zikir teraziyi ağırlaştırır.",
    body: [
      "Mizan, amellerin tam bir adaletle tartıldığı teraziidir: 'Kıyamet Günü için adalet terazilerini kurarız, öyle ki hiçbir nefse en ufak bir haksızlık yapılmaz; bir hardal tanesi ağırlığında bile olsa onu getiririz; hesap görücü olarak biz yeteriz' (Kur'an 21:47). Ehl-i Sünnet bunu yalnızca bir mecaz değil, gerçek bir terazi olarak kabul eder — ameller, ya da onların defterleri, gerçekten tartılır. İnsanın sonu, hangi kefenin ağır bastığına bağlıdır: 'Tartıları ağır gelenler, hoş bir hayat içindedir; tartıları hafif gelenlerin ise anaları (sığınağı) Hâviye'dir' (Kur'an 101:6-9).",
      "Bir kefeyi ağırlaştıran şey, salt fiillerin sayısı değil, Allah katındaki ağırlıklarıdır — ve bu ağırlık ihlastan gelir. Peygamber ﷺ, kolay ama muazzam olan amellere işaret etmiştir: 'Dilde hafif, terazide ağır, Rahman'a sevimli iki kelime: Sübhanallahi ve bihamdihi, Sübhanallahil-Azîm' (Sahih Buhârî 6406). Ayrıca şöyle buyurmuştur: 'Kıyamet Günü müminin terazisinde güzel ahlaktan daha ağır bir şey yoktur' (Câmiu't-Tirmizî 2002, sahih). Öyleyse ihlasla tekrarlanan basit bir zikir, ya da sabırlı bir güzel davranış, gösterişli amel dağlarından daha ağır basabilir.",
      "Bunun tersi ise boş amellerin tehlikesidir. İnsanlara gösteriş için yapılan işler (riya) ya da nifakla bozulan ameller, terazide ağırlıksız çıkabilir — görünüşte büyük, özde boş. Bu yüzden ihlas, birçok erdemden biri değil, diğer her ameli ağırlaştıran şeyin ta kendisidir. Ders şudur: günü küçük, samimi, istikrarlı ameller etrafında kur, ve görünen amellerin arkasındaki niyeti arındır.",
    ],
    quran: [
      {
        excerpt:
          "Kıyamet Günü için adalet terazilerini kurarız, öyle ki hiçbir nefse en ufak bir haksızlık yapılmaz. Bir hardal tanesi ağırlığında bile olsa onu getiririz; hesap görücü olarak biz yeteriz.",
      },
      {
        excerpt:
          "Tartıları ağır gelenler, hoş bir hayat içindedir. Tartıları hafif gelenlerin ise anaları (sığınağı) Hâviye'dir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dilde hafif, terazide ağır, Rahman'a sevimli iki kelime: Sübhanallahi ve bihamdihi, Sübhanallahil-Azîm.",
      },
      {
        excerpt:
          "Kıyamet Günü müminin terazisinde güzel ahlaktan daha ağır bir şey yoktur. Şüphesiz güzel ahlaklı kimse, onunla oruçlunun ve namaz kılanın derecesine ulaşır.",
      },
    ],
    appLinks: [{ label: "Tesbih" }, { label: "Zikirler" }],
  },
  {
    title: "Hesap",
    summary: "Kolay hesap, ayrıntılı hesap ve başkalarının hakları.",
    body: [
      "Hesap, her kişinin hayatının hesabını vermeye çağrıldığı sorgulamadır. Kur'an bunun iki çok farklı deneyimini anlatır: 'Kime kitabı sağ eline verilirse, kolay bir hesapla sorguya çekilir ve ailesine sevinçle döner; ama kime kitabı arkasından verilirse, yok oluşu çağırır' (Kur'an 84:7-11). 'Kolay hesap' bir rahmettir, sorgunun yokluğu değil — Peygamber ﷺ, sorgunun şiddetinin kendisinin bir tür ceza olduğunu uyarmıştır.",
      "Peygamberin ﷺ kendi eşi bu önemli farkı rivayet eder. Aişe onun şöyle dediğini nakleder: 'Kim hesaba çekilirse mahvolur.' Dedi ki: Peki Allah, 'kolay bir hesapla sorguya çekilecek' demiyor mu? Buyurdu ki: 'O, yalnızca amellerin arz edilmesidir; ama kim hesapta sıkıca sorgulanırsa mahvolur' (Sahih Buhârî 6537). Öyleyse müminin umudu her sorgudan kaçmak değil, amellerinin kendisine gösterilmesi, günahlarının örtülmesi ve bağışlanması — tek tek sorgulanmak değil.",
      "Allah'ın bağışlaması bile bir çırpıda silmediği bir borç türü vardır: başkalarının hakları (hukûku'l-ibâd). Peygamber ﷺ sordu: 'Müflisin kim olduğunu biliyor musunuz?' Dediler ki: Parası olmayan kimsedir. Buyurdu ki: 'Benim ümmetimin müflisi, Kıyamet Günü namaz, oruç ve sadakayla gelen, ama şuna sövmüş, buna iftira atmış, birinin malını almış, bir başkasının kanını dökmüş olan kimsedir — bu yüzden iyilikleri onlara verilir, ve iyilikleri bitince günahları ona yüklenir, ve ateşe atılır' (Sahih Müslim 2581). İbadet zulmü iptal etmez; onu ancak zulmü gidermek iptal eder.",
      "Pratik sonuç acil ve nettir: ödenmemiş borçlar, çalınan mal, iftira ve bozulmuş emanetler bu hayatta düzeltilmelidir — Allah'a tevbe ve insanlara tazminat ve özürle — çünkü şimdi para ve alçakgönüllülük parasıyla ödemek, o zaman iyilikler parasıyla ödemekten çok daha ucuzdur. Ve bütün bunlarda, Allah'ın adaleti kusursuzdur ve rahmeti, samimiyetle çabalayıp tevbe eden herkesi kuşatır.",
    ],
    quran: [
      {
        excerpt:
          "Kime kitabı sağ eline verilirse, kolay bir hesapla sorguya çekilir ve ailesine sevinçle döner. Ama kime kitabı arkasından verilirse, yok oluşu çağırır ve alevli bir ateşe girer.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim hesaba çekilirse mahvolur. Aişe dedi ki: Allah, 'kolay bir hesapla sorguya çekilecek' demiyor mu? Buyurdu ki: O, yalnızca amellerin arz edilmesidir; ama kim hesapta sıkıca sorgulanırsa mahvolur.",
      },
      {
        excerpt:
          "Müflisin kim olduğunu biliyor musunuz? O, Kıyamet Günü namaz, oruç ve sadakayla gelen, ama başkalarına sövmüş, iftira atmış ve zulmetmiş olandır — bu yüzden iyilikleri onlara verilir, bittiğinde günahları ona yüklenir ve ateşe atılır.",
      },
    ],
    actions: [
      "Belirlenen gün gelmeden borçlarını öde ve haksızca aldığın her şeyi, ne kadar küçük olursa olsun, geri ver.",
      "Söz, mal ya da onurda haksızlık ettiğin herkesi bul ve özür dile — şimdi tazmin etmek, o zaman tazmin etmekten çok daha ucuzdur.",
      "Allah'ın hakları için O'na tevbe et, ve iki defteri de — ilahî ve insani — temiz tut.",
    ],
    appLinks: [{ label: "Kaza ve borçlar" }],
  },
  {
    title: "Havuz",
    summary: "Peygamberin ﷺ havuzu — kimin içeceği, kimin geri çevrileceği.",
    body: [
      "Havuz, Peygamber Muhammed'e ﷺ Kıyamet Gününde bahşedilen büyük havuzdur; o kavurucu, tüketici günde susamış ümmeti için bir rahmettir. Vasıfları sayısız ve sahihtir: 'Havuzum bir aylık mesafe genişliğindedir; suyu sütten daha beyaz, kokusu miskten daha güzel, ve bardakları gökyüzünün yıldızları gibidir. Ondan içen bir daha asla susamaz' (Sahih Buhârî 6579). Havuz'a iman, mütevatir rivayetlerle sabit olan Ehl-i Sünnet akîdesinin bir parçasıdır.",
      "Peygamber ﷺ orada takipçilerini bizzat karşılayacaktır: 'Havuza sizden önce ben ulaşacağım, ve içinizden bana gelecek olanları gözleyeceğim' (Sahih Müslim 2292). Ümmetini abdest izlerinden, yüzlerindeki, ellerindeki ve ayaklarındaki ışıktan tanıyacaktır. Ona ulaşmak sonsuza dek doyurulmaktır; sağlam anlayışa göre bu, Allah'ın Peygamberine ﷺ Cennette verdiği nehir olan Kevser'den beslenir.",
      "Yine de bazı kişiler Havuz'dan geri çevrilecektir. Peygamber ﷺ, kendisine bazı kişiler hakkında 'Bunlar senden değil; senden sonra dini değiştirdiler' denileceğini ya da onun ardından topuklarının üzerinde geri döndüklerini anlatmıştır. Âlimler bu konuda dikkatlidir: bu, hadiste zikredilen belirli kategorilere işaret eder — irtidat ve açık hidayetten sonra dinde ağır, kasıtlı bidat gibi — ve bu, kesinlikle sıradan Müslümanların birbirlerine bu suçlamayı yöneltmesi için bir izin değildir. Havuz'a giden güvenli yol, Sünnet'e sarılmak, abdesti ve namazı korumak ve müminlerin birliğini muhafaza etmektir.",
    ],
    hadith: [
      {
        excerpt:
          "Havuzum bir aylık mesafe genişliğindedir. Suyu sütten daha beyaz, kokusu miskten daha güzel, ve bardakları gökyüzünün yıldızları kadar sayısızdır. Ondan içen bir daha asla susamaz.",
      },
      {
        excerpt:
          "Havuza sizden önce ben ulaşacağım, ve içinizden bana gelecek olanları gözleyeceğim. Bazı kişiler benden uzaklaştırılacak, ben de diyeceğim ki: Rabbim, ashabım! Denilecek ki: Senden sonra ne yenilikler çıkardıklarını bilmiyorsun.",
      },
    ],
    disclaimer:
      "Havuz'dan geri çevrilenlerle ilgili rivayetler, hadiste zikredilen belirli kategorilere, özellikle irtidat ve dinde ağır bidate işaret eder. Bu, Müslümanların birbirini sapkınlıkla suçlaması için bir izin değildir.",
  },
  {
    title: "Sırat Köprüsü",
    summary: "Cehennemin üzerinden geçiş — amellere ve rahmete göre hız.",
    body: [
      "Sırat, Cehennemin üzerine gerilmiş bir köprüdür ve her tek kişi ondan geçmek zorundadır — mümin ve kâfir aynı şekilde. Kur'an bu geçişi istisnasız olarak doğrular: 'Sizden ona uğramayacak hiç kimse yoktur. Bu, Rabbin üzerinde kesinleşmiş bir hükümdür. Sonra Allah'a karşı gelmekten sakınanları kurtarırız, zalimleri ise orada diz üstü çökmüş bırakırız' (Kur'an 19:71-72). Geçiş herkes içindir; öbür tarafa güvenle varmak asıl meseledir, ve bu, Allah'ın koruduğu kimselere bahşedilir.",
      "Geçiş şekli, kişinin beraberinde getirdiği amellerle belirlenir. Peygamber ﷺ bunu şöyle tasvir etmiştir: 'Köprü Cehennemin üzerine konur... ve sizden ilk geçenler şimşek gibi geçer, sonra rüzgâr gibi, sonra kuşlar gibi, sonra koşan bir adam gibi — amellerine göre — Peygamberiniz ise köprüde durmuş, 'Rabbim, kurtar, kurtar' diye söylerken. Kimi sağ salim kurtulur, kimi yaralanarak bırakılır, kimi de ateşe düşer' (Sahih Buhârî 6573). Aynı rivayette, köprünün kenarında emanet ve akrabalık bağları durur — emanetlere ve aile bağlarına sadakatin, gerçekten kişiyle birlikte öbür tarafa geçtiğini gösteren çarpıcı bir manzara.",
      "Sırat'taki ışık ve hız, bu hayatta kazanılır. Vaktinde kılınan namaz, düzenli verilen sadaka, muamelelerde dürüstlük ve güzel ahlak, kişinin geçtiği ayak basacağı yer ve ışığın ta kendisi hâline gelir. Peygamber ﷺ orada müminler için şefaat edecektir, ve birinin öbür tarafa ulaşması tamamen Allah'ın rahmetiyledir.",
      "Diğer gayb konuları gibi, akıllıca olan yol, vahyin belirttiğinin ötesinde köprünün fiziksel boyutları hakkında — ne kadar ince, ne kadar keskin, ne kadar uzun — spekülasyon yapmak değil, tüm dikkati geçişi hafifleten amellere vermektir. Tasavvur edemediğin şey için bile hazırlanabilirsin.",
    ],
    quran: [
      {
        excerpt:
          "Sizden ona uğramayacak hiç kimse yoktur. Bu, Rabbin üzerinde kesinleşmiş bir hükümdür. Sonra Allah'a karşı gelmekten sakınanları kurtarırız, zalimleri ise orada diz üstü çökmüş bırakırız.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Köprü Cehennemin üzerine konur, ve ilk geçen ben olacağım. İnsanlar amellerine göre onun üzerinden geçer — şimşek gibi, rüzgâr gibi, kuşlar gibi, koşan bir adam gibi — ben ise 'Rabbim, kurtar, kurtar' derken. Kimi kurtulur, kimi yaralanarak bırakılır, kimi de ateşe düşer.",
      },
    ],
    actions: [
      "Beş vakit namazı vaktinde kıl — namaz, köprüden geçirten ışıktır.",
      "Az da olsa düzenli olarak sadaka ver.",
      "Akrabalık bağlarını sürdür ve emanetlerini koru — hadiste bunlar bizzat Sırat'ın kenarında durur.",
    ],
  },

  {
    title: "Cennet",
    summary: "Ebedî mükâfat — nimetleri ve hepsinden önemlisi Allah'ı görmek.",
    body: [
      "Cennet, Allah'ın müminler için hazırladığı, tasavvurun ötesinde bir gerçeklik olan ebedî yurttur. Bir kutsi hadiste Peygamber ﷺ, Allah'ın onun hakkında şöyle buyurduğunu aktarmıştır: 'Salih kullarım için hiçbir gözün görmediği, hiçbir kulağın işitmediği ve hiçbir insan kalbinin hayal bile edemediği şeyler hazırladım' (Sahih Buhârî 3244). Nehirleri, bahçeleri, köşkleri ve arkadaşlığı Kur'an'da kalbi çekmek için tasvir edilir, ama bu tasvirler, hepsini fazlasıyla aşan bir sevince işarettir.",
      "Tüm nimetlerinin en büyüğü hiçbir bahçe ya da nehir değil, Allah'ın rızası ve O'nun Yüzünü görmektir. 'O gün bazı yüzler ışıl ışıl parlar, Rablerine bakarlar' (Kur'an 75:22-23) — Ehl-i Sünnet bunu, müminlerin Ahirette Allah'ı, O'nun azametine yakışır bir şekilde ve yaratılmışlara hiç benzemeden görmesi olarak anlar; bu, Cennetin en yüce nimetidir. Allah şöyle vaat eder: 'İyilik edenlere en güzel karşılık ve daha fazlası vardır' (Kur'an 10:26) — ve bu 'daha fazlası', sahih hadislerde O'nun şerefli Yüzünü görmek olarak açıklanır.",
      "Cennete girmek Allah'ın rahmetiyledir; bu, iman ve salih amellerle kucaklanır — ikisi asla birbirine zıt değildir: rahmet sebeptir, ameller ise onun işareti ve Allah'ın ona bağladığı vasıtadır. Ahiret Günü, Cennet ehli için hiç solmayan ve hiç bitmeyen bir nimetle sona erer. Bu modül, Cennet'in ele alınışını kasten kısa tutar; kapılarını, derecelerini, oraya götüren amelleri ve onun için yapılan duaları derinlemesine ele alan tam 'Cennet Yolculuğu' rehberi mevcuttur.",
    ],
    quran: [
      {
        excerpt:
          "Rabbinizin bağışlamasına ve göklerle yer kadar geniş, takva sahipleri için hazırlanmış Cennete koşun.",
      },
      {
        excerpt: "O gün bazı yüzler ışıl ışıl parlar, Rablerine bakarlar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah buyurur: Salih kullarım için hiçbir gözün görmediği, hiçbir kulağın işitmediği ve hiçbir insan kalbinin hayal bile edemediği şeyler hazırladım.",
      },
    ],
    appLinks: [{ label: "Cennet Yolculuğu" }, { label: "Akîde — Cennet" }],
  },
  {
    title: "Cehennem",
    summary: "Gerçek uyarı — hakiki azap ve hayattayken kaçış kapısı.",
    body: [
      "Cehennem, kötü bir ruh hâlinin simgesi ya da mecazı değil, gerçek bir azap yurdudur. Ona iman, gayba ve Allah'ın adaletine imanın bir parçasıdır. Kur'an ciddi bir açıklıkla uyarır: 'Rablerini inkâr edenler için Cehennem azabı vardır; ne kötü bir varış yeridir' (Kur'an 67:6). Şiddeti, merakı gidermek için değil, uyandırmak için tasvir edilmiştir: 'yakıtı insanlar ve taşlar olan bir ateş' (Kur'an 2:24), Allah'ın emrettiğine asla karşı gelmeyen sert meleklerle korunmaktadır.",
      "Bu uyarıların amacı gizli bir rahmettir. Kibri kırmak, hakkı sürekli reddetmeyi durdurmak ve çok geç olmadan kişiyi geri döndürmek için vardırlar. Bu yüzden Kur'an'daki uyarılar neredeyse her zaman açık bir tevbe kapısıyla eşleştirilir — ateşi tasvir etmenin amacı tam olarak insanların mümkün olduğunca ondan kaçınmasıdır. Azabı adildir: kimse ona ancak açık hidayete karşı kendi ısrarlı seçimiyle girer, ve Allah kimseye zulmetmez.",
      "Günah yüklü müminler için sağlam Ehl-i Sünnet inancı, korku ile umut arasında bir dengedir: bir günahkâr Allah'ın dilemesine tabidir — ya bağışlar, ya da ateşte arındırır ve sonra, daha önce anlatılan şefaat ve rahmetle, zerre kadar imanı olan herkesi oradan çıkarır. Bu modül Cehennemi kasten kısa ve dengeli tutar. Uyarılarının, büyük günahların ve engin tevbe ve rahmet kapılarının daha kapsamlı incelemesi 'Cehennemi Anlamak' modülünde ve ilgili akîde konularında bulunur — daima umutla, asla umutsuzlukla değil.",
    ],
    quran: [
      {
        excerpt: "Rablerini inkâr edenler için Cehennem azabı vardır; ne kötü bir varış yeridir.",
      },
      {
        excerpt:
          "De ki: Ey kendi aleyhlerine aşırı giden kullarım! Allah'ın rahmetinden ümidinizi kesmeyin. Şüphesiz Allah bütün günahları bağışlar. Şüphesiz O, çok bağışlayan, çok merhamet edendir.",
      },
    ],
    appLinks: [{ label: "Cehennemi Anlamak" }, { label: "Akîde — Cehennem" }],
  },
  {
    title: "Hesapsız Kim Girer?",
    summary: "Ayrıntılı hesaptan muaf olanlar üzerine sahih hadisler — ilmî tartışma.",
    body: [
      "Ahiret Gününün rahmetlerinden biri, bu ümmetten bir topluluğun hiç hesaba çekilmeden Cennete girecek olmasıdır. Peygamber ﷺ şöyle buyurmuştur: 'Ümmetimden yetmiş bin kişi hesapsız Cennete girecektir,' ve başka bir rivayette: 'her bin ile birlikte yetmiş bin daha.' Ashap bunların kim olduğunu merak edince, onları şöyle tasvir etti: 'Bunlar, başkalarından rukye istemeyen, uğursuzluğa inanmayan, dağlamayla tedavi olmayan ve Rablerine tevekkül edenlerdir' (Sahih Buhârî 6541).",
      "Bu tasvirin özü tevekküldür — Allah'a derin, etkin bir güven — bununla birlikte batıl inançtan ve sebeplere kaygılı bir bağımlılıktan özgürlük. Bu, meşru tıbbi tedavi görmeyi kınamaz; kişinin kendine okuduğu rukye ve helal ilaç, ikisi de Sünnette sabittir. Övülen, güveni öylesine tamamen Allah'a bağlı olan kişidir ki, ruhani muskalar için başkalarına yalvarıp durmaz, ne de uğursuzluklara sarılır.",
      "Âlimler sayının kendisi üzerinde tartışır: kimi yetmiş binin gerçek olduğunu söyler, kimi ek rivayetlerle bunun çok daha fazlasına çıktığını söyler, ve kimi de bunun belirli bir sayı yerine Allah'ın lütfunun sayılamaz bolluğuna işaret ettiğini düşünür. Anlaştıkları temel gerçek şudur: Allah'ın rahmeti, insanın hesap kitabından beklediğinden çok daha fazladır, ve nihai kurtuluş bu rahmettendir.",
      "Bu bir umut makamıdır, tembellik için bir gedik değildir. Müminin Allah'a gerçek bir tevekkülüne ve batıl inançtan uzaklaşmaya teşvik eder, ibadetteki çaba ise devam eder. Kimse buna amelleri terk ederek ulaşmaz; insan buna, muskalar ve korkular yerine Allah'a bağlı bir kalp, ihlas ve tevekkülle çekilir.",
    ],
    hadith: [
      {
        excerpt:
          "Ümmetimden yetmiş bin kişi hesapsız Cennete girecektir: bunlar, başkalarından rukye istemeyen, uğursuzluğa inanmayan, dağlamayla tedavi olmayan ve Rablerine tevekkül edenlerdir.",
      },
    ],
    disclaimer:
      "Âlimler, 'hesapsız' ifadesinin belirli bir yetmiş bini mi yoksa çok daha fazla, sayılamaz bir sayıyı mı kastettiği konusunda ayrılırlar. Hepsi, nihai kurtuluşun Allah'ın rahmetiyle olduğu ve bunun amelleri terk etmek için değil umut için bir sebep olduğu konusunda hemfikirdir.",
  },

  {
    title: "Ahiret Gününe Hazırlanmak",
    summary: "Pratik ibadet — her alışkanlığı Allah'la buluşmana bağla.",
    body: [
      "Tüm yolculuğu kat ettikten sonra — ölüm, kabir, alâmetler, Sûr, toplanma, amel defterleri, Mizan, hesap, köprü ve iki yurt — akla yatkın tek cevap hazırlıktır. Ama hazırlık panik değildir. Peygamber ﷺ ashabını hiçbir zaman korku içinde ve felç olmuş hâlde bırakmadı; onları amel üzere bıraktı. Bunların hepsinin temeli tevhid ve ihlastır: bir amel ancak yalnızca Allah için ve Sünnete uygun yapıldığında kabul edilir, bu yüzden daha fazla amel eklemeden önce, elinde zaten var olanların arkasındaki niyeti arındır.",
      "Günü, nasların Mizan'da ağır kıldığı direkler üzerine kur. Vaktinde kılınan namaz hem çapa hem de Sırat'ın ışığıdır. Kur'an — okunan, dinlenen ve üzerinde tefekkür edilen, günde birkaç âyet bile olsa — kalbi diri tutar. Tevbe defteri temizler: 'Ey iman edenler, Allah'a samimi bir tevbeyle dönün' (Kur'an 66:8). Sadaka malı arındırır ve sadaka-i câriye olarak senden sonra da devam eder. Zikir, dilde hafif kelimelerle dili Mizan'da ağır tutar. Ve güzel ahlak, Peygamberin ﷺ dediği gibi, Mizan'a konulan en ağır şeydir.",
      "Peygamberin ﷺ doğrudan Cennete bağladığı iki şeyi koru — dil ve iffet (Sahih Buhârî 6474) — çünkü dramatik günahlardan daha çok, sessizce defteri dolduran ya da boşaltan şeyler bunlardır. Ve mümkün olduğunca insanların haklarını yerine getir: borçları öde, alınanı geri ver, zarar için özür dile ve her muamelede adil ol, öyle ki asla zulmettiğin kişilerin taleplerinin namazlarını yiyip bitirdiği o 'müflis' olarak varmayasın.",
      "Her şey, Sahih Buhârî'nin ilk hadisinde belirtilen tek bir niyete dayanır: 'Ameller ancak niyetlere göredir.' Munib'in izleyicilerini bir yarışma skoru olarak değil, bu alışkanlıklar — namaz, Kur'an, zikir, sadaka, tevbe — için nazik bir destek olarak kullan; bunların her biri sessizce günü Allah'la buluşmaya doğru yönlendirir. Asıl amaç budur: şimdiden, O'nun huzurunda gerçekten duracağını bekleyen biri gibi yaşamak.",
    ],
    quran: [
      {
        excerpt: "Ben cinleri ve insanları, ancak bana ibadet etsinler diye yarattım.",
      },
      {
        excerpt:
          "Ey iman edenler, Allah'a samimi bir tevbeyle dönün. Umulur ki Rabbiniz kötülüklerinizi sizden giderir ve sizi, altından ırmaklar akan bahçelere sokar.",
      },
    ],
    hadith: [
      {
        excerpt: "Ameller ancak niyetlere göredir, ve her insana ancak niyet ettiği vardır.",
      },
      {
        excerpt:
          "Kim bana iki çenesi arasındaki ile iki bacağı arasındakini — yani dilini ve iffetini — garanti ederse, ben de ona Cenneti garanti ederim.",
      },
    ],
    actions: [
      "Beş vakit farz namazı vaktinde kıl.",
      "Her gün Kur'an oku ya da dinle — birkaç âyet bile olsa.",
      "Sabah akşam zikirlerine devam et.",
      "Az miktarda bile olsa düzenli olarak sadaka ver.",
      "Her gün ihlasla tevbe et ve istiğfar getir.",
      "Dilini ve iffetini koru, ve her sözü ve emaneti yerine getir.",
      "Aile, komşular ve alacaklıların haklarını yerine getir.",
      "Namaz günlüğünde huşu ve niyet ihlası üzerine tefekkür et.",
    ],
    appLinks: [
      { label: "Hazırlık Panom" },
      { label: "Namazı Öğren" },
      { label: "Kur'an Öğren" },
      { label: "Dua Öğren" },
      { label: "Akîde Öğren" },
      { label: "Namaz Takipçisi" },
    ],
  },
];

export const LAST_DAY_HADITH_TR: DeepPartial<LastDayHadithEntry>[] = [
  {
    hadith: { excerpt: "Lezzetleri yok edeni çokça anın — yani ölümü." },
    context:
      "Ölümü düzenli olarak hatırlamak kalbi yumuşatır, kinleri eritir ve umutsuzluk yaratmadan öncelikleri düzeltir.",
  },
  {
    hadith: {
      excerpt:
        "Sizden biriniz ancak Allah hakkında hüsn-i zan besleyerek — Rabbinin rahmeti hakkında iyi düşünerek — ölsün.",
    },
    context:
      "Güzel bir son (hüsn-i hâtime), gerçek iman, tevbe ve Allah'tan iyi beklenti yoluyla umulur.",
  },
  {
    hadith: {
      excerpt: "Kabir ya Cennet bahçelerinden bir bahçe ya da Cehennem çukurlarından bir çukurdur.",
    },
    context:
      "Berzah, Allah'ın hikmetiyle kabirde nimet ya da azabı içerir — kabir, kişinin kendi amellerinin aynasıdır.",
  },
  {
    hadith: {
      excerpt: "Ölü defnedildiğinde iki melek gelip ona Rabbini, dinini ve peygamberini sorar.",
    },
    context:
      "Kabir sorgusu sahih rivayetlerde sabittir; bu rivayette iki meleğin adı Münker ve Nekir olarak geçer.",
  },
  {
    hadith: {
      excerpt:
        "İnsan öldüğünde ameli kesilir, ancak üç şey müstesna: sadaka-i câriye, kendisinden faydalanılan ilim ya da kendisine dua eden salih evlat.",
    },
    context: "Ölene fayda vermeye devam eden şey — sahih hadislerde sabittir.",
  },
  {
    hadith: {
      excerpt:
        "Yalınayak, çıplak ve sünnetsiz olarak toplanacaksınız — ve Kıyamet Günü ilk giydirilecek kişi İbrahim olacaktır.",
    },
    context: "Toplanma gününde alçakgönüllülük; Allah dilediğine, dilediği şekilde ikram eder.",
  },
  {
    hadith: {
      excerpt:
        "Kıyamet Günü güneş insanlara yaklaştırılır, ta ki yaklaşık bir mil mesafede olur, ve insanlar amellerine göre kendi terlerine gömülürler.",
    },
    context: "Mahşer'in şartları — sahih rivayetlerde şiddeti amellere göre değişir.",
  },
  {
    hadith: {
      excerpt:
        "İnsanlar bana gelecek, ben de Allah'ın huzurunda secdeye kapanacağım; o zaman denilecek: Başını kaldır; iste sana verilecek, şefaat et şefaatin kabul edilecek.",
    },
    context: "En büyük şefaat — yalnızca Peygambere ﷺ özgü olan Şefaat-i Uzmâ.",
  },
  {
    hadith: {
      excerpt:
        "Kim hesaba çekilirse mahvolur. Aişe sordu: Allah, 'kolay bir hesapla sorguya çekilecek' demiyor mu? Buyurdu ki: O, yalnızca amellerin arz edilmesidir; ama kim hesapta sıkıca sorgulanırsa mahvolur.",
    },
    context:
      "'Kolay hesap' bir rahmettir — amellerin gösterilmesi ve bağışlanması, tek tek sorgulanmak değil.",
  },
  {
    hadith: {
      excerpt:
        "Ümmetimin müflisi, namaz, oruç ve sadakayla gelen, ama başkalarına sövmüş, iftira atmış ve zulmetmiş olandır — bu yüzden iyilikleri onlara verilir, ve günahları ona yüklenir.",
    },
    context:
      "Başkalarının hakları (hukûku'l-ibâd), ibadetle öylece iptal olmaz; o gün ödenmeli ya da tazmin edilmelidir.",
  },
  {
    hadith: {
      excerpt:
        "Ümmetimden yetmiş bin kişi hesapsız Cennete girecektir: başkalarından rukye istemeyen, uğursuzluğa inanmayan, dağlamayla tedavi olmayan ve Rablerine tevekkül edenler.",
    },
    context:
      "Âlimler bu sayının gerçek mi yoksa Allah'ın rahmetinin çok daha büyük, sayılamaz bolluğuna mı işaret ettiği konusunda ayrılırlar.",
  },
  {
    hadith: {
      excerpt:
        "Havuzum bir aylık mesafe genişliğindedir. Suyu sütten daha beyaz, kokusu miskten daha güzel, ve bardakları gökyüzünün yıldızları kadar sayısızdır. Ondan içen bir daha asla susamaz.",
    },
    context: "Havuz — susuzluk gününde Peygamber Muhammed'in ﷺ ümmeti için bir rahmet.",
  },
  {
    hadith: {
      excerpt:
        "Köprü Cehennemin üzerine konur. İnsanlar amellerine göre onun üzerinden geçer — şimşek gibi, rüzgâr gibi, kuşlar gibi, koşan bir adam gibi — ve kimi yaralanarak kurtulur, kimi de düşer.",
    },
    context: "Geçiş hızı iman ve amelleri yansıtır; Allah'ın rahmeti geniştir.",
  },
  {
    hadith: {
      excerpt:
        "Şu on alâmeti görmedikçe Kıyamet kopmayacaktır: duman, Deccâl, dâbbe, güneşin batıdan doğması, İsa bin Meryem'in inişi, Ye'cûc ve Me'cûc, üç yer çöküşü ve insanları toplanma yerlerine süren bir ateş.",
    },
    context:
      "On büyük alâmet, Huzeyfe bin Üseyd'den. Âlimler her alâmeti kabul eder ama tam sırası üzerinde ayrılırlar.",
  },
  {
    hadith: {
      excerpt:
        "Canım elinde olana yemin ederim ki, Meryem oğlu aranıza adil bir hakim olarak inecek; haçı kıracak, domuzu öldürecek, cizyeyi kaldıracak ve mal öylesine bollaşacak ki onu kabul eden bulunmayacak.",
    },
    context:
      "İsa'nın (a.s.) inişi, Ehl-i Sünnet akîdesinin sağlam bir noktasıdır; o, Muhammed'in ﷺ şeriatına göre hükmeder.",
  },
  {
    hadith: {
      excerpt:
        "Emanet zayi edildiğinde Kıyamet'i bekle. Soruldu: O nasıl zayi olur? Buyurdu ki: Yetki ehil olmayana verildiğinde.",
    },
    context: "Bilinen bir küçük alâmet — emanetin kalkması. Panik yerine hazırlığa odaklan.",
  },
  {
    hadith: {
      excerpt:
        "Allah ilmi çekip almaz; âlimleri alarak kaldırır, ta ki hiç âlim kalmaz ve insanlar cahilleri önder edinirler; onlar ilimsiz fetva verir, böylece hem sapar hem de saptırırlar.",
    },
    context:
      "'İlmin kalkması' hakiki âlimlerin ve yaşanan uygulamanın ortadan kalkması demektir — bilgi eksikliği değil.",
  },
];

export const LAST_DAY_VERSES_TR: DeepPartial<LastDayVerseEntry>[] = [
  {
    excerpt:
      "Her nefis ölümü tadacaktır, ve ecirleriniz ancak Kıyamet Günü eksiksiz verilecektir. Kim ateşten uzaklaştırılıp Cennete konursa, gerçekten kurtulmuştur, ve dünya hayatı aldatıcı bir metadan başka bir şey değildir.",
    context:
      "Ölüm evrenseldir ve bu hayat geçicidir; hesabın gerçek ve nihai kararı ancak Ahiret Gününde verilir.",
    tafsirSummary:
      "Bu âyet başarıyı yeniden tanımlar: burada mal ya da makam değil, orada ateşten kurtuluş ve Cennete giriş.",
  },
  {
    excerpt:
      "O gün insanlar, amelleri kendilerine gösterilsin diye bölük bölük çıkacaklardır. Kim zerre miktarı hayır işlemişse onu görecek, kim de zerre miktarı şer işlemişse onu görecektir.",
    context:
      "Kusursuz ve eksiksiz adalet — en küçük fiil bile, hayır ya da şer, yazılır ve failine döndürülür.",
    tafsirSummary:
      "Hiçbir şey sayılmayacak kadar küçük değildir. Bu âyet, 'ufak' günahları hafife almaya karşı ve 'küçük' iyi amellere ömür boyu teşviktir.",
  },
  {
    excerpt:
      "Kıyamet Günü için adalet terazilerini kurarız, öyle ki hiçbir nefse en ufak bir haksızlık yapılmaz. Bir hardal tanesi ağırlığında bile olsa onu getiririz; hesap görücü olarak biz yeteriz.",
    context: "Mizan (terazi) gerçektir ve adaleti mutlaktır.",
    tafsirSummary:
      "O gün kimseye bir hardal tanesi kadar bile eksiklik yapılmaz; Allah'ın hesabı kusursuzdur.",
  },
  {
    excerpt:
      "Tartıları ağır gelenler, hoş bir hayat içindedir. Tartıları hafif gelenlerin ise anaları (sığınağı) Hâviye'dir.",
    context: "Nihai sonuç, terazideki salih amellerin ağırlığına bağlıdır.",
    tafsirSummary:
      "Ağırlık ihlastan gelir, salt hacimden değil — samimiyetle söylenmiş basit bir zikir, gösterişli amel dağlarından ağır basabilir.",
  },
  {
    excerpt:
      "Rabbinizin bağışlamasına ve göklerle yer kadar geniş, takva sahipleri için hazırlanmış Cennete koşun.",
    context: "Allah'la buluşmadan önce hayra ve bağışlanmaya koşmak için doğrudan bir emir.",
    tafsirSummary:
      "Cennet, tasavvurun çok ötesinde geniştir, ve ona giden yol acele etmektir — tevbeyi ve iyi amelleri ertelemek değil.",
  },
  {
    excerpt: "O gün bazı yüzler ışıl ışıl parlar, Rablerine bakarlar.",
    context:
      "Cennetin en büyük mükâfatı hiçbir bahçe ya da nehir değil, Allah'ın Yüzünü görmektir.",
    tafsirSummary:
      "Ehl-i Sünnet, müminlerin Ahirette Rablerini, O'nun azametine yakışır bir şekilde ve yaratılmışlara benzemeden görecekleri konusunda hemfikirdir — bu, tüm nimetlerin tacıdır.",
  },
  {
    excerpt: "Rablerini inkâr edenler için Cehennem azabı vardır; ne kötü bir varış yeridir.",
    context: "Cehennem, gerçek ve adil bir sonuçtur — simge değil, hakiki bir yurt.",
    tafsirSummary:
      "Bu uyarı, insanı vaktinde geri döndürmeyi amaçlayan bir rahmettir; Kur'an'da her zaman açık bir tevbe kapısıyla eşleştirilir.",
  },
  {
    excerpt:
      "De ki: Ey kendi aleyhlerine aşırı giden kullarım! Allah'ın rahmetinden ümidinizi kesmeyin. Şüphesiz Allah bütün günahları bağışlar. Şüphesiz O, çok bağışlayan, çok merhamet edendir.",
    context: "Günah ne kadar büyük olursa olsun, samimi tevbe kapısı ölüme dek açık kalır.",
    tafsirSummary:
      "Allah'ın rahmetinden umut kesmek şeytandandır; mümin, ateş korkusunu Allah'ın bağışlamasına olan kırılmaz umutla dengeler.",
  },
  {
    excerpt:
      "Ve Kıyamet mutlaka gelecektir, onda hiç şüphe yoktur; ve Allah kabirlerde olanları diriltecektir.",
    context: "Diriliş kesindir, gerçi vakti gizlidir.",
    tafsirSummary:
      "Kıyamet'in kesinliğiyle vaktinin bilinmezliğinin bir arada olması, ahlaki sorumluluğu şimdiki zamanda sağlam tutan şeyin ta kendisidir.",
  },
  {
    excerpt:
      "O'nun izni olmadan katında kim şefaat edebilir? O, onların önlerindekini ve arkalarındakini bilir; O'nun ilminden, dilediği kadarından başka hiçbir şeyi kavrayamazlar.",
    context: "Şefaat gerçektir ama Allah'ın izninden asla bağımsız değildir.",
    tafsirSummary:
      "İşte bu tek şart — 'O'nun izni olmadan' — hakiki şefaati her türlü bozulmasından ayırır ve bu hayatta ölülere seslenmeyi yasaklar.",
  },
  {
    excerpt:
      "Allah'ı, zalimlerin yaptıklarından habersiz sanma. O, onları ancak gözlerin dehşetle donup kalacağı bir gün için erteliyor.",
    context: "Mazlumlar için teselli — adaletin görünürdeki gecikmesi, onun yokluğu değildir.",
    tafsirSummary:
      "Hiçbir zulüm Allah tarafından unutulmaz; zalime yalnızca hiçbir şeyin göz ardı edilmeyeceği o güne kadar mühlet verilir.",
  },
  {
    excerpt:
      "Sizden ona uğramayacak hiç kimse yoktur. Bu, Rabbin üzerinde kesinleşmiş bir hükümdür. Sonra Allah'a karşı gelmekten sakınanları kurtarırız, zalimleri ise orada diz üstü çökmüş bırakırız.",
    context:
      "Sırat'tan geçiş herkes içindir; güvenle varmak Allah'ın rahmeti ve takvasıyla bahşedilir.",
    tafsirSummary:
      "Herkes geçişe gelir; fark, kimin kurtulduğu ve kimin düştüğüdür — bu, önden gönderilen iman ve amellerle belirlenir.",
  },
  {
    excerpt:
      "Sana Kıyamet'i, ne zaman gelip çatacağını sorarlar. De ki: Onun bilgisi ancak Rabbimin katındadır. Onun vaktini O'ndan başkası açığa çıkaramaz. O size ancak ansızın gelecektir.",
    context: "Tam vakit yalnız Allah'ın katındadır — hazırlık önemlidir, tahmin faydasızdır.",
    tafsirSummary:
      "Peygambere ﷺ bile tarih verilmedi; bir yıl ya da geri sayım için her insani iddia bu âyete aykırıdır.",
  },
  {
    excerpt:
      "Kime kitabı sağ eline verilirse, 'Alın, kitabımı okuyun! Ben zaten hesabımla karşılaşacağımı biliyordum' der. İşte o, hoş bir hayat içindedir.",
    context: "Kitabını alış şekli — sağ elde ya da sol elde — zaten ilk hükümdür.",
    tafsirSummary:
      "Başarılının sevinci, ödüllendirilen kesinliğin sevincidir: hesabı bekleyerek yaşadılar, ve o şok değil ferahlama olarak geldi.",
  },
];

export const LAST_DAY_TIMELINE_TR: DeepPartial<LastDayTimelineEvent>[] = [
  {
    title: "Dünya Hayatı",
    body: "İman etmek, ibadet etmek ve hazırlanmak için kısa, belirlenmiş bir süre. Bu dünya nihai yurt değildir — amellerin ekim tarlasıdır.",
  },
  {
    title: "Ölüm",
    body: "Her nefis ölümü tadacaktır. Mümin ona Allah'ın rahmetine umutla karşılık verir; gaflet onu ani ve acı kılar.",
  },
  {
    title: "Kabir",
    body: "Defnedilmenin ardından ruh berzaha girer. Kabir, her insan için Ahiretin ilk aşamasıdır.",
  },
  {
    title: "Berzah",
    body: "Ölüm ile diriliş arasındaki hayat — sahih rivayetlere göre sorgu, nimet ya da azap.",
  },
  {
    title: "Küçük Alâmetler",
    body: "Peygamberin ﷺ anlattığı tedrici toplumsal ve ahlaki değişimler. Birçok âlim bunların çoğunun ortaya çıktığını söyler; tam vakti yalnız Allah'a aittir.",
  },
  {
    title: "Büyük Alâmetler",
    body: "Sonun yakınındaki dramatik olaylar — Mehdî, Deccâl ve İsa'nın (aleyhisselam) dönüşü dahil, sahih hadislerde. Sıra ayrıntılarında âlimler ayrılır.",
  },
  {
    title: "Sûr",
    body: "İsrafil Sûr'a üfleyecektir. Birinci üfleyişte yaratılış ölür, ikincisinde dirilir.",
  },
  {
    title: "Diriliş",
    body: "Bedenler topraktan yeniden var edilir; tüm yaratılış Allah'ın huzurunda durur.",
  },
  {
    title: "Mahşer (Toplanma)",
    body: "Herkes yalınayak, çıplak ve sünnetsiz olarak — Allah'ın dilediği gibi — toplanır, hükmü beklerken.",
  },
  {
    title: "Amel Defteri",
    body: "Defterler sağ elde, sol elde ya da arkadan verilir. Yazılanlardan hiçbir şey eksik kalmaz.",
  },
  {
    title: "Mizan (Terazi)",
    body: "Ameller kusursuz bir adaletle tartılır. Ağır teraziler sevinç getirir; hafif teraziler kayıp getirir.",
  },
  {
    title: "Hesap",
    body: "Bazıları için kolay hesap; başkaları için ayrıntılı sorgu. İnsanların hakları göz ardı edilmez.",
  },
  {
    title: "Şefaat",
    body: "Yalnızca Allah'ın izniyle — en büyüğü Peygamber Muhammed'e ﷺ aittir.",
  },
  {
    title: "Havuz",
    body: "Peygamberin ﷺ ümmetinin Kıyamet Gününde içtiği geniş bir havuz.",
  },
  {
    title: "Sırat Köprüsü",
    body: "Her kişi Cehennemin üzerinden geçer — sahih rivayetlerde hız, iman ve amele göre değişir.",
  },
  {
    title: "Cennet ya da Cehennem",
    body: "Ebedî yurt — Cennet Allah'ın rahmeti ve salih amellerle; Cehennem gerçek bir uyarı ve adil bir sonuç olarak.",
  },
  {
    title: "Ebediyet",
    body: "Ahiretten sonra ölüm yoktur. Cennet ehli sonsuza dek nimet içinde kalır; Cehennem ehli Allah'ın dilediği gibi kalır.",
  },
];

export const LAST_DAY_QUIZ_TR: DeepPartial<LastDayQuizQuestion>[] = [
  {
    prompt: "Ahiret Gününe iman, şunlardan hangisinin bir parçasıdır:",
    options: ["İslam'ın beş şartı", "İmanın altı esası", "Yedi kat gök", "On sahabi"],
    explanation:
      "İman, Allah'a, meleklere, kitaplara, peygamberlere, Ahiret Gününe ve kadere (kadere) inanmayı içerir.",
  },
  {
    prompt: "Berzah'ın en iyi tanımı şudur:",
    options: [
      "Cehennemin üzerindeki köprü",
      "Ölüm ile diriliş arasındaki hayat",
      "Amellerin terazisi",
      "Sûr'un üfleniş anı",
    ],
    explanation: "Berzah, ölümden Kıyamet Gününe kadarki aradır.",
  },
  {
    prompt:
      "Doğru mu yanlış mı: Âlimler, Kıyamet'in tüm büyük alâmetlerinin tam sırası konusunda hemfikirdir.",
    options: ["Doğru", "Yanlış"],
    explanation:
      "Büyük alâmetler sahih hadislerde sabittir, ama âlimler bazı sıralama ayrıntılarında ayrılır. Kıyamet'in vakti yalnız Allah'a aittir.",
  },
  {
    prompt: "Ahiret Gününde Mizan (terazi) neyi ifade eder:",
    options: [
      "Fiziksel bedenlerin tartılması",
      "Amellerin kusursuz bir adaletle tartılması",
      "Kabirde geçen zamanın ölçülmesi",
      "Meleklerin sayılması",
    ],
    explanation: "Mizan amelleri tartar — ihlas ve salih amel teraziyi ağırlaştırır.",
  },
  {
    prompt: "Ahiret Gününde şefaat (aracılık):",
    options: [
      "Allah'ın izni olmadan gerçekleşir",
      "Yalnızca Allah'ın izniyle gerçekleşir",
      "İman ihtiyacının yerini alır",
      "Kur'an'da inkâr edilir",
    ],
    explanation: "Kur'an 2:255 ve 20:109, şefaatin ancak Allah'ın izniyle olduğunu doğrular.",
  },
  {
    prompt: "Ahiret yolculuğunda ilk olarak ne gelir?",
    options: ["Diriliş", "Ölüm", "Toplanma", "Sûr"],
    explanation:
      "Ölüm berzahtan önce gelir, sonra — alâmetler ve Sûr'dan sonra — diriliş ve toplanma gelir.",
  },
  {
    prompt: "Allah'la buluşmaya hazırlanmak için bu hafta hangi bir alışkanlığı güçlendireceksin?",
    explanation:
      "Hazırlık pratiktir: namaz, Kur'an, tevbe, sadaka, güzel ahlak ve başkalarının haklarını yerine getirmek.",
  },
  {
    prompt: "Doğru mu yanlış mı: Kur'an 19:71'e göre, herkes Sırat'tan geçecektir.",
    options: ["Doğru", "Yanlış"],
    explanation:
      "Âyet, herkesin ondan geçeceğini belirtir; Allah takva sahiplerini kurtarır. Âlimler kimin düştüğüne dair ayrıntıları tartışır.",
  },
];

export const LAST_DAY_REFERENCES_TR: DeepPartial<LastDayReferenceEntry>[] = [
  {
    title: "Kur'an",
    note: "Diriliş, hesap verme, Cennet, Cehennem ve ilahî adalet için temel kaynak. Bu modüldeki âyetler sûre ve âyet numarasıyla belirtilmiştir.",
  },
  {
    title: "Sahih Buhârî ve Sahih Müslim",
    note: "Ölüm, kabir, alâmetler, hesap, şefaat, Havuz ve Sırat için kanonik hadis koleksiyonları.",
  },
  {
    title: "Sünen Tirmizî ve Sünen Ebû Dâvûd",
    note: "Kabir ve küçük alâmetler üzerine ek sahih rivayetler — dereceler geçerli olduğu yerde belirtilmiştir.",
  },
  {
    title: "İbn Kesir — Tefsir",
    note: "Ahiret hakkındaki Kur'an âyetleri üzerine klasik tefsir. Kısa tefsir özetleri için kullanılmıştır, bağımsız bir delil olarak değil.",
  },
  {
    title: "El-Akîdetü't-Tahâviyye",
    note: "Dirilişi, teraziyi, köprüyü, Cenneti ve Cehennemi doğrulayan temel Ehl-i Sünnet akîdesi.",
  },
  {
    title: "Âlimlerin görüş ayrılıkları",
    note: "Âlimlerin ayrıldığı yerlerde — örneğin büyük alâmetlerin sırası, Havuz'un ayrıntıları, hesapsız girenlerin kategorileri — bu modül tek bir görüşü yegâne doğru olarak iddia etmeden ayrılığı not eder.",
  },
  {
    title: "Vahiy karşısında içtihat",
    note: "Açık Kur'an ve mütevatir ya da sahih hadis, yorumsal görüşlerden (içtihat) ve daha zayıf rivayetlerden ayrı tutulmuştur.",
  },
];
