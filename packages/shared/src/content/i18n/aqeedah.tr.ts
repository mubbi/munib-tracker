import type { AqeedahGlossaryTerm, AqeedahTopic } from "../../types/aqeedah";
import type { DeepPartial } from "./localize";

// Turkish translation overlay for the Learn Aqeedah content. Mirrors the order of
// AQEDAH_TOPICS in ../aqeedah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
export const AQEDAH_TOPICS_TR: DeepPartial<AqeedahTopic>[] = [
  {
    title: "Giriş",
    summary: "Akide, ibadeti, ahlakı ve hayatın gayesini şekillendiren imanın temelidir.",
    body: [
      "Akide (عقيدة) kelimesi, bir şeyi sıkıca bağlamak anlamına gelen bir kökten gelir — bu, Müslümanın öyle bir kesinlikle sarıldığı inançlar bütünüdür ki kalp onlara bağlanır ve hiçbir şüpheyle sarsılmaz. Meşhur Cibril hadisinde Peygamber ﷺ bunu altı inançta özetlemiştir: Allah'a, meleklerine, kitaplarına, peygamberlerine, ahiret gününe ve kaderin hayrına-şerrine iman.",
      "Ehl-i Sünnet ve'l-Cemaat — yani Sünni Müslümanların çoğunluğu — akideyi önce Kur'an'dan, sonra sahih sünnetten alır ve bunu sahabe ile ilk nesillerin (selef) anlayışına göre kavrar. Akıl kullanıldığında vahye hizmet eder, ona hükmetmez.",
      "Akide kuru bir akademik konu değildir; tüm ibadet ve ahlakın filizlendiği köktür. İnsanın Allah'ın kim olduğuna, kendisinin neden yaratıldığına ve nereye gittiğine dair inançları, namazını nasıl kıldığını, başkalarına nasıl davrandığını ve sıkıntı ile ölümle nasıl yüzleştiğini sessizce yönlendirir.",
      "Doğru akide, kalbi ibadetin büyük hâlleri arasında dengede tutar — sevgi ve saygı, ümit ve korku, tevekkül ve çaba, şükür ve tövbe — böylece mümin ne Allah'ın rahmetinden ümidini keser ne de O'nun cezasından emin olur.",
    ],
    quran: [
      {
        excerpt:
          "İyilik, Allah'a, ahiret gününe, meleklere, kitaba ve peygamberlere iman etmektir…",
      },
      {
        excerpt:
          "Ey iman edenler! Allah'a, Resulüne, Resulüne indirdiği kitaba ve daha önce indirdiği kitaba iman edin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "İman, Allah'a, meleklerine, kitaplarına, peygamberlerine ve ahiret gününe iman etmen, kadere -hayrına ve şerrine- iman etmendir. (Cibril hadisi, Ömer r.a.'dan rivayet)",
      },
    ],
    appLinks: [{ label: "Allah'ın İsimleri" }, { label: "Cennete Giden Yol" }],
  },
  {
    title: "Akide Nedir?",
    summary: "Akide bir felsefe dersi değildir; vahiyde köklenmiş yaşayan bir imandır.",
    body: [
      "Akide, kalbin kesinlikle tasdik ettiği ve sonra ibadette ve davranışta ortaya çıkan şeydir — sadece tartışmak için ezberlenen bir teori değildir. Kur'an, ilimde derinleşmiş müminleri, vahiy hakkında 'Buna inandık, hepsi Rabbimizdendir' (3:7) diyen kişiler olarak tanımlar: açık olana teslim olurlar ve gaybın ayrıntılarını Allah'a havale ederler.",
      "İlk âlimler, bu netliği korumak için kısa akide metinleri (el-Akîdetü't-Tahâviyye gibi) yazdılar — sıradan müminleri iki tehlikeden korumak için: dine ekleme yapan aşırılık ve Allah'ın sabit kıldığı bir şeyi silen inkâr.",
      "Ehl-i Sünnet içinde kelam ilminde bilinen birkaç ekol vardır — özellikle Eserî, Eş'arî ve Mâturîdî yöntemler — bunlar imanın temel esaslarında tam mutabakat içindedirler, ancak özellikle ilahi sıfatlar konusunda bazı meseleleri ifade etmenin birkaç teknik yolunda ayrılırlar. Ortak temelleri tek ve sağlamdır: Allah'ın mutlak birliği, vahyinin doğruluğu ve ahirette gerçek hesap verme.",
      "Öyleyse akide en iyi şekilde yaşayan bir iman olarak öğrenilir: her akide meselesi bir ibadet biçimine, bir davranış tarzına ve bir huzur kaynağına bağlıdır.",
    ],
    quran: [
      {
        excerpt: "İlimde derinleşmiş olanlar derler ki: 'Buna inandık, hepsi Rabbimizdendir.'",
      },
    ],
    actions: [
      "Akideyi güvenilir âlimlerden ve temel metinlerden öğren, sosyal medya tartışmalarından değil.",
      "Her akide konusunu incelerken sor: Bu, ibadetimi ve hayatımı nasıl değiştirir?",
    ],
  },
  {
    title: "Akide Neden Önemlidir",
    summary: "Doğru akide ruhsal istikrar verir ve aşırılıktan korur.",
    body: [
      "Akide doğru ve sağlam olduğunda ameller ihlaslı ve sarsılmaz olur; akide zayıfladığında ibadet çoğu zaman tutarsız, salt duygusal ya da arzu ve şüphe karşısında kolayca sallanan bir hâl alır. Allah, 'iman edenleri sağlam sözle sabit kılacağını' vaad eder — hem bu dünyada hem de kabir ve ahiretin dehşetli anında.",
      "Doğru akide, mümini hayatın her hâlinde taşıyan şeydir: sıkıntıda Allah'ın kaderine sabır ve tevekkül, nimette alçakgönüllü şükür, belirsizlik ve ölüm karşısında huzurlu bir kesinlik öğretir. Kadere ve ahirete gerçekten inanan kişi, imtihan karşısında yıkılmaz.",
      "Son olarak, doğru akide anlaşmazlıkta edep öğretir: açık esasları sıkıca tutmak ve samimi âlimlerin her zaman ayrıldığı ikincil meselelerde saygı ve hoşgörü göstermek. Akide bilgisi tevazuyu ve merhameti artırmalı, kibri asla değil.",
    ],
    quran: [
      {
        excerpt: "Allah, iman edenleri dünya hayatında da ahirette de sağlam sözle sabit kılar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sana fayda verecek şeye düşkün ol, Allah'tan yardım dile ve âciz kalma… (Ebu Hureyre r.a.)",
      },
    ],
  },

  // ── İmanın Altı Şartı ───────────────────────────────────────────────────────
  {
    title: "İmanın Altı Şartı",
    summary: "Peygamber ﷺ imanı altı temel inançta özetledi.",
    body: [
      "Altı şart, İslam'ın en önemli hadislerinden biri olan Cibril hadisinden gelir. Melek Cibril insan suretinde geldi ve sahabenin önünde Peygamber ﷺ'e İslam, iman ve ihsan hakkında sorular sordu. İman hakkında sorduğunda, Peygamber ﷺ tam olarak bu altı inançla cevap verdi — Cibril de onu doğruladı, sonra ayrıldı; insanlara dinlerini öğretmeye gelmişti.",
      "Bu altısı şunlardır: Allah'a iman; meleklerine iman; indirdiği kitaplara iman; peygamberlerine iman; ahiret gününe iman; ve kaderin hayrına ve şerrine iman. Bunlardan herhangi birinin inkârı gerçek imandan çıkarır, çünkü hepsi tek bir dokudur.",
      "Bunlar aynı zamanda birbirine derinden bağlıdır. Kitaplara ve peygamberlere iman, ahiret günü ve hesap bilgisine götürür; ahiret gününe iman her ameli tartar; kadere iman ise Allah'a tevekkül ve O'nun hikmeti karşısında tevazu öğretir. Bunları sırayla öğrenmek, açık ve dengeli bir hayat görüşü inşa eder.",
    ],
    hadith: [
      {
        excerpt:
          "…Allah'a, meleklerine, kitaplarına, peygamberlerine ve ahiret gününe iman etmen, kadere -hayrına ve şerrine- iman etmendir. (Cibril hadisi)",
      },
    ],
    appLinks: [{ label: "Akide Sözlüğü" }],
  },
  {
    title: "Allah'a İman",
    summary:
      "Allah'a iman, O'nun rububiyetini, yalnızca O'na has ibadet hakkını ve isim ile sıfatlarını kapsar.",
    body: [
      "Allah'a iman, tüm inançların en büyüğü ve diğerlerinin köküdür. Her şeyin tek Yaratıcısı, Sahibi ve Rabbi olduğuna dair kesin inançla başlar — hiçbir ortağı, hiçbir dengi olmayan ve mahlûkatından hiçbirine muhtaç olmayan tek gerçek ilah.",
      "Bundan şu sonuç çıkar: her türlü ibadete yalnızca O layıktır — namaz, dua, ümit, korku, tevekkül, en üstün anlamda sevgi, kurban ve adak — bunların hepsi O'ndan başkasına yöneltilmesi caiz olmayan Allah'ın haklarıdır. 'Allah'tan başka ilah yoktur' şehadetinin anlamı tam da budur.",
      "Ehl-i Sünnet, Allah'ın kendisi için sabit kıldığı ve Resulü ﷺ'in O'nun için sabit kıldığı güzel isimleri ve yüce sıfatları, O'nun şanına yakışır bir şekilde ispat eder — ne O'nu mahlûkatına benzeterek (temsil), ne de sıfatlarını inkâr edip anlamsızlaştırarak (ta'til). Yol gösterici ayet şudur: 'O'nun benzeri hiçbir şey yoktur; O, hakkıyla işitendir, hakkıyla görendir' (42:11) — bu ayet hem benzetmeyi reddeder hem de O'nun işitme ve görmesini ispat eder.",
      "Allah'ı isimleriyle tanımak — En Merhametli, Her Şeyi Bilen, Ebedî Diri, Hükümdar, Bağışlayan — kalbin gıdasıdır: O'nu ne kadar tanırsan, O'nu o kadar sever, O'ndan o kadar korkar ve O'na o kadar yönelirsin.",
    ],
    quran: [
      {
        excerpt:
          "De ki: O, Allah'tır, bir tektir… O doğurmamış ve doğurulmamıştır; hiçbir şey O'na denk değildir.",
      },
      { excerpt: "En güzel isimler Allah'ındır; öyleyse O'na o isimlerle dua edin." },
    ],
    appLinks: [{ label: "Allah'ın İsimlerini Keşfet" }],
  },
  {
    title: "Meleklere İman",
    summary: "Melekler, Allah'ın şerefli ve görünmez kullarıdır; asla O'na isyan etmezler.",
    body: [
      "Melekler, nurdan yaratılmış muazzam bir mahlûkattır. İsyan güçleri yoktur: sürekli Allah'a ibadet ederler ve her emrini kusursuzca yerine getirirler, 'Allah'ın emrettiği hususta O'na isyan etmezler ve kendilerine emredileni yaparlar.'",
      "Onlara iman etmek, görünmeyen âlemin gerçek olduğuna ve çevremizde etkin olduğuna inanmaktır. Melekler vahiy getirir, insanları korur, her söz ve ameli yazar, ölüm anında ruhları alır ve Allah'ın izniyle yer ile göklerin işlerini yürütür — bu yüzden mümin gerçekte asla yalnız veya gözetimsiz değildir.",
      "Birçoğunun ismi, nasslarda belirli görevlerle birlikte geçer: vahiy meleği Cibril; yağmur ve rızıktan sorumlu Mikâil; sûru üfleyecek olan İsrafil; ölüm meleği Azrail; ve her insanın amellerini yazan şerefli kâtipler (kirâmen kâtibîn). Münker ve Nekir kabirde ölüye soru sorar.",
    ],
    quran: [
      {
        excerpt:
          "Onun üzerinde, Allah'ın kendilerine emrettiği hususta O'na isyan etmeyen ve emredildiklerini yapan sert ve güçlü melekler vardır.",
      },
      {
        excerpt:
          "De ki: Cibril'e kim düşman olursa (bilsin ki) onu Allah'ın izniyle senin kalbine o indirmiştir.",
      },
    ],
    actions: ["Yazıcı meleklerin hiçbir söz veya ameli asla kaçırmadığı bilinciyle yaşa."],
  },
  {
    title: "İlahi Kitaplara İman",
    summary:
      "Allah hidayet için kitaplar indirdi; Kur'an bunları doğrular ve nihai ölçüt olarak durur.",
    body: [
      "Müslümanlar, Allah'ın peygamberlerine hidayet ve rahmet olarak kitaplar indirdiğine inanır. Kur'an bunlardan birkaçının adını verir: İbrahim ve Musa'nın sahifeleri, Musa'ya verilen Tevrat, Davud'a verilen Zebur, İsa'ya verilen İncil ve nihayet Muhammed ﷺ'e verilen Kur'an — bunların tümüne, ilk indirilen hâlleriyle toptan iman edilir.",
      "Kur'an eşsiz bir konuma sahiptir. Bu, 'kendinden önceki kitapları doğrulayıcı ve onlara şahit olarak' (5:48) indirilen son vahiydir — yani hükmeder ve düzeltir, çünkü önceki kitaplar asıl hâllerinde kalmamış, nesiller boyunca tahrif edilmiş ve kaybolmuştur.",
      "Tüm kitaplar arasında yalnız Kur'an, ilahi olarak tahriften korunmuştur: 'Şüphesiz zikri (Kur'an'ı) biz indirdik ve onu koruyacak olan da elbette biziz' (15:9). Öyleyse kitaplara iman, vahye saygı, Kur'an'ı düşünerek okumak ve hayatta onun hidayetine teslim olmak demektir.",
    ],
    quran: [
      {
        excerpt:
          "Ve sana, kendinden önceki kitabı doğrulayıcı ve ona şahit olarak hakla kitabı indirdik.",
      },
      {
        excerpt: "Şüphesiz zikri biz indirdik ve onu koruyacak olan da elbette biziz.",
      },
    ],
    appLinks: [{ label: "Kur'an'ı Oku" }],
  },
  {
    title: "Peygamberlere İman",
    summary: "Tüm peygamberler aynı temel gerçeği tebliğ etti; Muhammed ﷺ son peygamberdir.",
    body: [
      "Müslüman, Allah'ın gönderdiği tüm peygamberlere ve resullere iman eder, hiçbirini inkâr etmez. Âdem'den Nuh'a, İbrahim'e, Musa'ya ve İsa'ya (aleyhimüsselam), oradan Muhammed ﷺ'e kadar hepsi aynı temel mesajı verdi: yalnız Allah'a ibadet edin ve doğrulukla yaşayın. Kur'an'da yirmi beş isim geçer; toplam sayılarını yalnızca Allah bilir.",
      "Peygamberler, doğruluk ve emanette yaratılmışların en üstünüdür; Allah onları mesajla ilgili yalandan ve büyük günahtan korumuştur — yine de onlar insandır, ilahi değildir ve asla ibadet edilmeye layık değildirler. Beşi 'Ülü'l-Azm' (azim sahibi) peygamberler olarak öne çıkar: Nuh, İbrahim, Musa, İsa ve Muhammed ﷺ.",
      "Muhammed ﷺ, peygamberlerin sonuncusudur (Hatemü'n-Nebiyyîn): ondan sonra peygamber gelmez ve mesajı evrenseldir — kıyamete kadar tüm insanlığa gönderilmiştir. Ona iman, onu sevmeyi, emirlerine itaat etmeyi, haberlerini doğrulamayı ve yalnızca öğrettiği şekilde ibadet etmeyi içerir.",
    ],
    quran: [
      { excerpt: "…O'nun peygamberlerinden hiçbirini diğerinden ayırt etmeyiz…" },
      {
        excerpt:
          "Muhammed, sizin erkeklerinizden hiçbirinin babası değildir; fakat o, Allah'ın Resulü ve peygamberlerin sonuncusudur.",
      },
    ],
    appLinks: [{ label: "Peygamberlerin Kıssaları" }],
  },
  {
    title: "Ahiret Gününe İman",
    summary: "Hayat, Allah ile nihai karşılaşmaya, tam adalete ve ebedî bir sonuca doğru ilerler.",
    body: [
      "Ahiret gününe iman, ölümden sonra gelen her şeye imandır: kabirdeki sorgu ve hayat (berzah), sûra üfürülmesi, tüm insanların yeniden diriltilmesi, büyük toplanma, hesap, amellerin tartılması, sırattan geçiş ve iki ebedî yurt — cennet ve cehennem.",
      "Bu iman, her anı ahlaki bir ağırlıkla yükler. Allah gizliyi görür ve en küçük ameli bile yazdığı için, hiçbir iyilik boşa gitmez ve hiçbir kötülük gözden kaçmaz: 'Kim zerre miktarı hayır işlerse onu görür, kim de zerre miktarı şer işlerse onu görür.'",
      "Ehl-i Sünnet, bu gerçeklerin hepsini kesinlikle ispat eder, nakledildikleri gibi iman eder; âlimlerin bazı belirli olayların ve alametlerin ince ayrıntılarını yorumlamada farklılaştığını kabul ederler. Bu imanın amacı spekülasyon değil hazırlıktır.",
    ],
    quran: [
      {
        excerpt:
          "…Kim zerre miktarı hayır işlerse onu görür, kim de zerre miktarı şer işlerse onu görür.",
      },
    ],
    appLinks: [{ label: "Kıyamet Günü" }, { label: "Cennet Yolculuğu" }],
  },
  {
    title: "Kadere (İlahi Takdire) İman",
    summary:
      "Allah'ın ilmi ve takdiri kâmildir — yine de insanlar gerçekten iradeye ve sorumluluğa sahiptir.",
    body: [
      "Kadere iman genellikle dört mertebede özetlenir: Allah'ın ezelden her şeyi bildiği; yaratılıştan elli bin yıl önce her şeyi Levh-i Mahfuz'a yazdığı; O'nun dilemesi olmadan hiçbir şeyin gerçekleşmediği; ve kullarının amelleri de dâhil, var olan her şeyin yaratıcısının O olduğu.",
      "Bununla birlikte, insanların Allah'ın izin verdiği alanda gerçek bir iradesi ve hakiki bir seçme özgürlüğü vardır — emirlerin ve yasakların, mükâfat ve cezanın adil ve anlamlı olmasının sebebi de budur. Kişi namaz kılmayı veya yalan söylemeyi seçer ve haklı olarak sorumlu tutulur; Allah'ın o seçimi önceden bilmesi onu buna zorlamaz.",
      "Ehl-i Sünnet iki hata arasında denge kurar: kaderi inkâr (sanki olaylar Allah'ın ilim ve iradesinin dışına çıkabiliyormuş gibi) ve cebriyecilik (kaderi insan sorumluluğunu ortadan kaldırmak ve günah için bahane olarak kullanmak). Mümin en iyi şekilde sebeplere sarılır, sonra sonucu Allah'a bırakır.",
      "Pratikte kader, büyük bir huzur kaynağıdır: üzerine düşeni yaptıktan sonra, sana ulaşan hiçbir şeyin senden kaçamayacağını, senden kaçan hiçbir şeyin de sana ulaşamayacağını bilerek rahat edersin.",
    ],
    hadith: [
      {
        excerpt:
          "…Sana bir musibet isabet ederse 'keşke şöyle yapsaydım' deme, bunun yerine 'Allah takdir etti, dilediğini yaptı' de — çünkü 'keşke' şeytana kapı açar. (Ebu Hureyre r.a.)",
      },
    ],
    quran: [
      { excerpt: "Şüphesiz biz her şeyi bir kader ile yarattık." },
      {
        excerpt:
          "Şüphesiz Allah, bir toplum kendi durumlarını değiştirmedikçe onların durumunu değiştirmez.",
      },
    ],
    misconceptions: [
      "Yanlış anlama: Her şey takdir edilmişse çaba göstermek anlamsızdır. Düzeltme: İslam çabayı, planlamayı, duayı ve tövbeyi emreder — sebeplere sarılmak kaderin bizzat bir parçasıdır.",
      "Yanlış anlama: Kader, günahımdan Allah'ın sorumlu olduğu anlamına gelir. Düzeltme: Kul seçim yapar ve sorumludur; kader asla itaatsizlik için bir bahane değildir.",
      "Yanlış anlama: Musibet, Allah'ın bana kızgın olduğunu kanıtlar. Düzeltme: Sınavlar arınma, derece yükseltme, uyarı veya yönelme çağrısı olabilir — çoğu zaman kızgınlık değil, bir lütuf işaretidir.",
    ],
    actions: [
      "Sebeplere en iyi şekilde sarıl, sonra Allah'ın kaderine güven.",
      "'Keşke…' pişmanlık döngülerini 'kaddarallah' (Allah takdir etti) demeye ve yapıcı bir sonraki adıma dönüştür.",
    ],
  },

  // ── Tevhid ve Kalbin Ameli ─────────────────────────────────────────────────
  {
    title: "Tevhidin Açıklaması",
    summary:
      "Tevhid, Allah'ın rububiyetini, yalnızca O'na has ibadet hakkını ve isim ile sıfatlarını birleştirir.",
    body: [
      "Tevhid — Allah'ın mutlak birliği — İslam'ın kalbi ve her peygamberin mesajıdır. Bu, yalnızca O'na ait olan her şeyde Allah'ı tek kılmak ve kendini tanımladığı gibi kemalini aynen ispat etmek demektir.",
      "Âlimler genellikle tevhidi, anlaşılmasını ve korunmasını kolaylaştırmak için birbirine bağlı üç yönle öğretir. Tevhid-i Rububiyet: Allah'ın tek başına her şeyi yaratan, sahip olan ve kontrol eden olduğu. Tevhid-i Ulûhiyet: yalnız Allah'ın her türlü ibadete layık olduğu — bu, peygamberlerin en çok vurguladığı ve inkârcıların en çok direndiği yöndür. Tevhid-i Esma ve Sıfat: Allah'ın isimlerini ve sıfatlarını, indirildiği gibi, tahrif, inkâr veya benzetme olmadan ispat etmek.",
      "Bu üçlü yapı, ayrılık için değil, öğretim aracı olarak kullanılır; amacı mümine ihlasını korumasında ve tevhidin nerede zedelenebileceğini fark etmesinde yardımcı olmaktır. Bunların hepsi, her Müslümanın namazının açılış duasında özetlenir: 'Yalnız sana ibadet eder, yalnız senden yardım dileriz.'",
      "Önemli bir kavrayış: Allah'ın Yaratıcı olduğuna inanmak (rububiyet) tek başına yeterli değildir. Peygamberleri inkâr eden birçok kişi, yine de Allah'ın gökleri ve yeri yarattığına inanıyordu — inkâr ettikleri yalnızca O'na has ibadetti (ulûhiyet). Gerçek tevhid ibadette ispatlanır, sadece yaratılış hakkındaki bir inançta değil.",
    ],
    quran: [
      { excerpt: "Yalnız sana ibadet eder ve yalnız senden yardım dileriz." },
      {
        excerpt: "Allah — O'ndan başka ilah yoktur. En güzel isimler O'nundur.",
      },
    ],
    misconceptions: [
      "Yanlış anlama: Tevhid sadece bir cümleyi söylemektir. Düzeltme: Bu, kalbin inancı, dilin ikrarı ve ibadette yaşanan bir gerçekliktir.",
      "Yanlış anlama: Allah'ın Yaratıcı olduğuna inanmak tevhidin tamamıdır. Düzeltme: Birçok inkârcı da buna inanıyordu — gerçek imtihan yalnızca Allah'a ibadettir.",
    ],
    appLinks: [{ label: "Allah'ın İsimleri" }, { label: "Cennete Giden Yol: Tevhid" }],
  },
  {
    title: "Şirkin Açıklaması",
    summary: "Şirk, Allah'a has belirli bir hakkı O'ndan başkasına yöneltmektir.",
    body: [
      "Şirk — Allah'a ortak koşmak — tevhidin zıddıdır ve Kur'an'ın, tövbe etmeden bu hâl üzere ölen kişi için affedilemez ilan ettiği tek günahtır: 'Allah, kendisine ortak koşulmasını bağışlamaz; bunun dışında dilediğini bağışlar.'",
      "Büyük şirk (şirk-i ekber), herhangi bir ibadet türünün Allah'tan başkasına yöneltilmesidir — ölülere veya gaipteki kişilere yalnızca Allah'ın verebileceği bir şey için dua etmek, mahlûk için kurban kesmek veya adak adamak, ya da bir şeyi Allah'a duyulması gereken sevgi ve itaatle sevmek. Tövbe etmeden bu hâl üzere ölmek kişiyi İslam'dan çıkarır.",
      "Küçük şirk (şirk-i asğar) kişiyi İslam'dan çıkarmaz ama ciddi derecede tehlikelidir ve amellerin sevabını geçersiz kılabilir. En belirgin biçimi riyadır — insanların görüp övmesi için ibadet etmek — Peygamber ﷺ'in ümmeti için en çok korktuğu şey olarak nitelendirdiği şeydir. Allah'tan başkası adına, O'nu yücelten bir şekilde yemin etmek de buraya girer.",
      "Ehl-i Sünnet dil ve hükümde dikkatlidir: genel olarak şirkten sakındırmak gerekli ve açıktır, ama belirli bir kişiyi müşrik veya kâfir ilan etmek (tekfir), ilim, sağlam delil ve engellerin kaldırılmasını gerektiren ağır bir meseledir — bu, sıradan insanların veya çevrimiçi tartışmaların değil, ilim ehlinin işidir.",
    ],
    quran: [
      {
        excerpt:
          "Şüphesiz Allah, kendisine ortak koşulmasını bağışlamaz; bunun dışında dilediğini bağışlar.",
      },
      {
        excerpt: "Ey oğulcuğum! Allah'a ortak koşma. Şüphesiz şirk, büyük bir zulümdür.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sizin hakkınızda en çok korktuğum şey küçük şirktir. Ne olduğu soruldu, o da: Riya (gösteriş), buyurdu. (Mahmud ibn Lebid)",
      },
    ],
    misconceptions: [
      "Yanlış anlama: Dildeki her sürçme büyük şirktir. Düzeltme: Âlimler büyüğü küçükten ayırır ve her durumu delille dikkatlice değerlendirir.",
      "Yanlış anlama: Şirkten sakındırmak için insanlara sert davranmak gerekir. Düzeltme: Nebevi yöntem, hakkı netleştirmeyi merhamet ve sabırla öğretmekle birleştirir.",
    ],
  },
  {
    title: "İhlas",
    summary: "Ameller ancak yalnız Allah rızası için yapıldığında kabul edilir.",
    body: [
      "İhlas, bir amelle yalnızca Allah'ın rızasını aramaktır — makam, övgü, mal veya insanlar üzerinde etki değil. Bu, her amelin kabulünün bağlı olduğu iç hâldir: Peygamber ﷺ, 'Ameller niyetlere göredir ve herkese niyet ettiği şey vardır' diye öğretmiştir.",
      "Sevap niyete bağlı olduğu için, yalnız Allah için yapılan küçük, sessiz bir amel, şöhret için yapılan büyük, alenî bir amelden daha ağır basabilir. Aynı görünen amel — sadaka vermek, namaz kılmak, öğretmek — kalbin niyetine göre hem bir ibadet hem de içi boş bir gösteri olabilir.",
      "İhlas bir kere kazanılıp bir daha geri dönülmeyen bir şey değildir; sürekli yenilenir, çünkü nefis dikkat çekmeye meyillidir. Bu yüzden müminler niyetlerini defalarca arındırır ve Allah'a, kendilerini riyanın gizli şirkinden ve kendini kandırmaktan koruması için dua ederler.",
    ],
    quran: [
      {
        excerpt:
          "Hâlbuki onlara, dini yalnız Allah'a has kılarak O'na ibadet etmeleri emredilmişti.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ameller niyetlere göredir ve herkese niyet ettiği şey vardır. (Ömer bin Hattab r.a.)",
      },
    ],
    appLinks: [{ label: "Dua ve Niyetleri Öğren" }],
  },
  {
    title: "Allah'ı Sevmek ve O'ndan Korkmak",
    summary: "Selim bir kalp, Allah'a sevgi, ümit ve saygılı korku kanatlarıyla ibadet eder.",
    body: [
      "Kalbin ibadeti üç büyük hâl üzerine kuruludur: sevgi (muhabbet), ümit (reca) ve saygılı korku (havf). Allah sevgisi tüm ibadetin temeli ve itici gücüdür — müminler her şeyden çok 'Allah'ı sevmede en güçlü olanlardır' — O'nun hoşnutsuzluğundan korku ise nefsi günahtan ve gaflet göstermekten alıkoyar.",
      "Ehl-i Sünnet, bunların bir kuşun iki kanat ve bir başla uçması gibi dengede kalması gerektiğini öğretir. Korkusuz sevgi ve ümit, kayıtsızlığa ve Allah'ın rahmetini hafife almaya sürükleyebilir; ümitsiz korku ise çaresizliğe yol açabilir. Kur'an bunları birleştirir: 'O'na korku ve ümitle dua edin.'",
      "Bu denge yalnızca bir duygu değildir; eylemde ortaya çıkar — namazı korumada, tövbeye koşmada, başkalarına hizmette, öfkeyi dizginlemede ve kaderini takdir edene olan sevgiyle sıkıntıya sabretmede.",
    ],
    quran: [
      { excerpt: "…iman edenler ise Allah'ı sevmede en güçlü olanlardır." },
      {
        excerpt:
          "…ve O'na korku ve ümitle dua edin. Şüphesiz Allah'ın rahmeti iyilik yapanlara yakındır.",
      },
    ],
    appLinks: [{ label: "Allah'ın İsimleri" }, { label: "Dualar" }],
  },
  {
    title: "Ümit ve Tövbe",
    summary:
      "Hiçbir günah, samimi bir tövbe ve Allah'ın geniş rahmetine olan ümitle bağışlanamayacak kadar büyük değildir.",
    body: [
      "Ehl-i Sünnet'in belirgin bir inancı şudur: kişi, günahları ne kadar büyük olursa olsun Allah'ın rahmetinden asla ümidini kesmemeli, iyilikleri ne kadar çok olursa olsun O'nun cezasından asla emin olmamalıdır. Ümit ve nefis muhasebesi ikisi de müminin hayatında sürekli devam eder.",
      "Allah'ın çağrısı şaşırtıcı derecede cömerttir: 'De ki: Ey kendi aleyhlerine aşırı giden kullarım! Allah'ın rahmetinden ümidinizi kesmeyin. Şüphesiz Allah bütün günahları bağışlar.' Tövbe kapısı, güneş batıdan doğana veya kişinin kendi ölümü yaklaşana kadar açık kalır.",
      "Samimi tövbenin açık şartları vardır: günahı hemen terk etmek, ona gerçekten pişman olmak ve bir daha dönmemeye kesin karar vermek — günah başka birinin hakkıyla ilgiliyse, o hakkı geri vermek veya ondan özür dilemek. Bu şartlar yerine geldiğinde Allah'ın tepkisi yalnızca kabul değil, sevinçtir: O, 'kulunun tövbesinden', ıssız bir çölde kaybolan bineğini ve azığını yeniden bulan kişiden daha çok 'sevinir.'",
    ],
    quran: [
      {
        excerpt:
          "De ki: Ey kendi aleyhlerine aşırı giden kullarım! Allah'ın rahmetinden ümidinizi kesmeyin. Şüphesiz Allah bütün günahları bağışlar.",
      },
      { excerpt: "Ey iman edenler! Allah'a içtenlikle tövbe edin." },
    ],
    hadith: [
      {
        excerpt:
          "Allah, kulunun tövbesinden, çölde üzerinde yiyeceği ve içeceği bulunan bineğini kaybedip sonra onu yeniden bulan kişiden daha çok sevinir. (İbn Mesud r.a.)",
      },
    ],
    appLinks: [{ label: "Günlük Dualar" }],
  },

  // ── Ahiret ───────────────────────────────────────────────────────────────────
  {
    title: "Cennet",
    summary: "Cennet, Allah'ın rahmetiyle müminler için hazırladığı ebedî mükâfattır.",
    body: [
      "Cennet gerçektir, ebedîdir ve insan zihninin tasavvur edebileceği her şeyden üstündür. Peygamber ﷺ, Allah'ın şu sözünü nakletmiştir: 'Salih kullarım için hiçbir gözün görmediği, hiçbir kulağın işitmediği ve hiçbir kalbin hayal edemediği şeyler hazırladım.' En büyük ödülü ise Allah'ın rızası ve O'nun cemalini görmektir.",
      "Cennete girmek nihayetinde Allah'ın rahmetiyledir — kimsenin amelleri tek başına ebedî nimeti hak edemez — yine de gerçek iman ve salih amel, Allah'ın belirlediği ve kabul ettiği vesilelerdir. İkisi arasında çelişki yoktur: rahmet sebeptir, iman ve ameller ise O'nun açtığı yoldur.",
      "Cennete iman, insanın artık nasıl yaşadığını yeniden şekillendirir: sıkıntıda sabrı, malda cömertliği ve ibadette istikrarı besler, çünkü mümin geçici bir dünyayı ebedî bir yurt karşılığında vermektedir. Kur'an bizi ona doğru 'koşmaya' çağırır.",
    ],
    quran: [
      {
        excerpt:
          "Rabbinizin bağışlamasına ve genişliği göklerle yer kadar olan, takva sahipleri için hazırlanmış cennete koşun.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah buyurdu: Salih kullarım için hiçbir gözün görmediği, hiçbir kulağın işitmediği ve hiçbir insan kalbinin hayal edemediği şeyler hazırladım. (Ebu Hureyre; ayrıca Sahih Müslim 2824)",
      },
    ],
    appLinks: [{ label: "Cennete Yolculuk" }],
  },
  {
    title: "Cehennem",
    summary: "Cehennem gerçek bir uyarıdır; geç olmadan kalpleri Allah'a döndürmek içindir.",
    body: [
      "Cehenneme iman, görünmeyene ve Allah'ın kusursuz adaletine imanın bir parçasıdır. Bu, insanların tehlikeyi ciddiye alması için Kur'an ve sünnette açık ifadelerle tarif edilen gerçek bir azap yeridir.",
      "Bu uyarıların merhametli bir amacı vardır: insanları anlattıkları sona düşmekten korumak — kibri, zulmü ve hakkı bile bile ısrarla inkâr etmeyi engellemek ve gafil olanları kapı açıkken tövbeye yöneltmek içindir.",
      "Ehl-i Sünnet, uyarıları ve rahmeti bir arada tutar. Tehditler ciddi ve gerçektir, yine de Allah'ın rahmeti O'na dönen herkes için geniştir — tevhid ehlinden, ateşe girecek olan günahkârlar dahi orada ebedî kalmayacak, sonunda Allah'ın rahmeti ve izin verdiği şefaatle çıkarılacaklardır.",
    ],
    quran: [
      {
        excerpt:
          "Ey iman edenler! Kendinizi ve ailenizi, yakıtı insanlar ve taşlar olan bir ateşten koruyun.",
      },
      {
        excerpt:
          "…Allah'ın rahmetinden ümidinizi kesmeyin. Şüphesiz Allah bütün günahları bağışlar.",
      },
    ],
    appLinks: [{ label: "Cehennemi Anlamak" }, { label: "Tövbe Dersi" }],
  },
  {
    title: "Yeniden Diriliş",
    summary: "Ölümden sonra tüm insanlar, Allah'ın huzurunda durmak üzere bedenen diriltilecektir.",
    body: [
      "Yeniden diriliş (el-Ba's) bedensel ve gerçektir, sembolik veya mecazi değildir. Allah, çürümüş kemiklerin yeniden hayat bulabileceğinden şüphe edenlere en yalın mantıkla cevap verir: onları ilk kez yoktan var eden, elbette onları yeniden var edebilir — ve yeniden yaratmak, bizim anlayışımıza göre ilk kez yaratmaktan daha kolaydır.",
      "Ölüm ile yeniden diriliş arasında berzah vardır — kabirdeki ara hayat, kendi sorgusu ve kendi kolaylığı veya zorluğuyla. Sonra sûra üfürülür ve tüm yaratılmışlar hesap için Allah'ın huzurunda diriltilip toplanır.",
      "İşte bu iman, insan hayatına ahlaki ciddiyetini kazandırır: yeniden diriliş olmasaydı, rahatça ölen zalim ile mazlumiyet içinde ölen mazlum aynı sona ulaşırdı. Bununla birlikte, her haksızlığın hesabı sorulur ve her iyiliğin karşılığı verilir, bu da sabrı ve adaleti anlamlı kılar.",
    ],
    quran: [
      {
        excerpt:
          "Der ki: 'Kemikleri, onlar çürümüşken kim diriltecek?' De ki: 'Onları ilk defa yaratan diriltecek…'",
      },
      {
        excerpt:
          "Ve şüphesiz kıyamet günü gelecektir — bunda hiç şüphe yoktur — ve Allah, kabirlerde olanları diriltecektir.",
      },
    ],
  },
  {
    title: "Kıyamet Günü",
    summary: "Her can Allah'ın huzurunda durur; O'nun adaleti kusursuz ve tamdır.",
    body: [
      "Kıyamet gününde her insanın hesabı görülür — amellerin ve niyetlerin, Allah'ın haklarının ve diğer insanların haklarının — öyle ince bir adaletle ki 'hiçbir cana zerre kadar zulmedilmeyecektir.'",
      "O gün, hiçbir soy, mal, statü, milliyet veya dünyevi mevki kimseye fayda vermez; yalnızca Allah katında kabul edilen gerçek iman ve salih amel işe yarar. Amel defterleri dağıtılır, ameller tartılır ve insanlar arasındaki haksızlıklar, iyilik ve kötülüklerin aktarılmasıyla dahi telafi edilir.",
      "Bu kesinlik, şimdiden karakteri değiştirmek içindir: mümini doğruluğa, güvenilirliğe, başkalarının haklarını korumaya ve borçların paradan ziyade amellerle ödeneceği o günden önce haksızlıkları düzeltmeye ve hakları geri vermeye çağırır.",
    ],
    quran: [
      {
        excerpt:
          "Kıyamet günü için adalet terazilerini kurarız, hiçbir cana zerre kadar zulmedilmez.",
      },
    ],
    appLinks: [{ label: "Kıyamet Günü — Tam Rehber" }],
  },
  {
    title: "Mizan ve Sırat",
    summary: "Ameller mizanda tartılır ve insanlar imanlarına ve amellerine göre sırattan geçer.",
    body: [
      "Ehl-i Sünnet, mizanı (terazi) ve sıratı (cehennem üzerindeki köprü) ahiretin gerçek olayları olarak ispat eder, nakledildikleri gibi iman eder. Mizanda, ameller ve onları işleyenler tam bir adaletle tartılır: 'Kimin tartıları ağır gelirse, o hoşnut bir hayat içindedir; kimin tartıları hafif gelirse, onun anası (varacağı yer) haviyedir (uçurumdur).'",
      "Sırat, cehennemin üzerine gerilmiş bir köprüdür, herkesin üzerinden geçmesi gerekir. Kur'an şöyle buyurur: 'İçinizden hiçbiri yoktur ki ona uğramasın,' sonra, 'sonra biz, Allah'a karşı gelmekten sakınanları kurtarırız.' İnsanlar amellerine göre geçer — kimileri ışık veya rüzgâr gibi hızlı, kimileri zorlukla, kimileri de sürçerek — Allah'ın rahmeti ve adaletiyle.",
      "Bu gerçekler, boşuna korkutmak için değil, ciddiyet uyandırmak için bildirilmiştir: küçük amellerin ağırlığı, ibadetteki ihlas ve başkalarının haklarına saygı hakkında, çünkü bunların hepsi tartılacaktır.",
    ],
    quran: [
      {
        excerpt:
          "Kimin tartıları ağır gelirse, o hoşnut bir hayat içindedir; kimin tartıları hafif gelirse, onun anası (varacağı yer) haviyedir.",
      },
      {
        excerpt:
          "İçinizden hiçbiri yoktur ki ona uğramasın… sonra biz, Allah'a karşı gelmekten sakınanları kurtarırız.",
      },
    ],
    appLinks: [{ label: "Mizan" }, { label: "Sırat Köprüsü" }],
  },
  {
    title: "Şefaat",
    summary: "Şefaat gerçektir — ama yalnızca Allah'ın izniyle, O'nun razı olduğu kimseler için.",
    body: [
      "Kıyamet günündeki şefaat, Kur'an ve sünnette sağlam bir şekilde ispatlanmıştır. Bunların en büyüğü, Peygamber Muhammed ﷺ'e verilecek olan 'Makam-ı Mahmud'dur; o zaman hesabın başlaması için toplanmış yaratılmışlara şefaat edecektir — ayrıca kendi ümmetinin büyük günah işleyenleri için de başka şefaatler olacaktır.",
      "Ama hiç kimse kendi yetkisiyle şefaat etmez. Her meşru şefaat yalnızca 'O'nun izninden sonra' ve yalnızca Allah'ın razı olduğu kimseler içindir: 'O'nun izni olmadan katında kim şefaat edebilir?' Bu, sonuç üzerindeki mutlak Allah hâkimiyetini korur.",
      "Âlimler, birkaç sabit şefaat türünü sayar — hesabın başlaması için, insanların cennete girmesi için, günahkâr müminlerin bağışlanması veya ateşten çıkarılması için — ve nihai kararın her zaman yalnızca Allah'a ait olduğu konusunda hemfikirdirler.",
    ],
    quran: [
      { excerpt: "O'nun izni olmadan katında kim şefaat edebilir?" },
      {
        excerpt:
          "O gün, Rahman'ın izin verdiği ve sözünden razı olduğu kimseden başkasının şefaati fayda vermez.",
      },
    ],
    hadith: [
      {
        excerpt:
          "İnsanlar bana gelecek ve ben Rabbimin huzurunda secdeye kapanacağım; sonra denilecek: Başını kaldır, iste sana verilecek, şefaat et şefaatin kabul edilecek. (Ebu Said — büyük şefaat)",
      },
    ],
    misconceptions: [
      "Yanlış anlama: Şefaat, tövbe ihtiyacını ortadan kaldırır. Düzeltme: Bu yalnızca Allah'ın izniyle olur ve asla günahta ısrar etmek için bir izin belgesi değildir.",
      "Yanlış anlama: Artık şefaat için peygamberlere veya salih kişilere dua edilebilir. Düzeltme: İbadet ve dua yalnızca Allah'adır; ahiretteki şefaat O'nun emriyledir, O'nun rızası aracılığıyla talep edilir.",
      "Yanlış anlama: Şefaat Allah'ın adaletine aykırıdır. Düzeltme: Bu, O'nun kusursuz adaleti içinde işleyen ve yalnızca O'nun izniyle gerçekleşen bir rahmet tezahürüdür.",
    ],
    appLinks: [{ label: "Kıyamet Günü" }, { label: "Cennete Yolculuk" }],
  },

  // ── Alametler ─────────────────────────────────────────────────────────────────
  {
    title: "Kıyametin Alametleri",
    summary:
      "Küçük ve büyük alametler gerçektir; akıllı kişiler spekülasyon yerine hazırlığa odaklanır.",
    body: [
      "Sahih nasslar, kıyametten önce gelecek alametleri anlatır; bunlar küçük alametler (çoğu zaten görülmüştür, örneğin Peygamber ﷺ'in kendisinin gönderilmesi, cehaletin yayılması ve yaygın gaflet) ve büyük alametler (sonun yaklaşmasıyla meydana gelecek olanlar) olarak ayrılır.",
      "On büyük alamet, Peygamber ﷺ'in bir hadisinde topluca sayılmıştır: Deccal'in ortaya çıkışı, Meryem oğlu İsa'nın inişi, Ye'cüc ve Me'cüc'ün çıkışı, üç büyük yere batış, bir duman, güneşin battığı yerden doğması ve insanları son toplanma yerlerine sürecek bir ateş.",
      "Âlimler bazı alametlerin tam sırası konusunda zaman zaman ayrılırlar, ama iki noktada hemfikirdirler: kıyametin geleceği kesindir ve tam vaktini Allah'tan başka kimse bilmez — Cibril kendisine sorduğunda Peygamber ﷺ bile bilmiyordu. Bu yüzden alametlere nebevi tepki spekülatif değil pratiktir: tahmin yerine iman, tövbe, adalet ve faydalı amelleri artırmaktır.",
    ],
    quran: [
      {
        excerpt:
          "Sana kıyametin ne zaman kopacağını soruyorlar. De ki: Onun bilgisi ancak Rabbimin katındadır.",
      },
      {
        excerpt:
          "Onlar sadece kıyametin ansızın kendilerine gelmesini mi bekliyorlar? Onun alametleri şüphesiz gelmiştir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "On alameti görmedikçe kıyamet kopmayacaktır: duman, Deccal, dabbe (hayvan), güneşin battığı yerden doğması, İsa'nın inişi, Ye'cüc ve Me'cüc ve üç yere batış… (Huzeyfe bin Esid r.a.)",
      },
    ],
    misconceptions: [
      "Yanlış anlama: Her büyük dünya olayı kesinlikle belirleyici bir alamettir. Düzeltme: Bu tür iddialar, heyecan verici anlatılar yerine sağlam delil ve ilmî tedbir gerektirir.",
      "Yanlış anlama: Alamet bilgisi bize kıyametin tarihini belirleme imkânı verir. Düzeltme: Kesin vakti yalnızca Allah bilir; alametler bizi tahmine değil hazırlığa çağırır.",
    ],
    appLinks: [{ label: "Kıyametin Alametleri" }],
  },

  // ── Referanslar ───────────────────────────────────────────────────────────────
  {
    title: "Akide Hakkında Sıkça Sorulan Sorular",
    summary: "Yaygın akide sorularına denge, delil ve güzel edeple cevaplar.",
    body: [
      "Soru: Tüm Sünniler her akide meselesinde aynı fikirde mi? Cevap: Ehl-i Sünnet ortak bir temeli paylaşır ve esaslarda tam mutabakat içindedir; bilinen kelam ekolleri (Eserî, Eş'arî, Mâturîdî) yalnızca bazı teknik yorumlarda farklılık gösterir ve bu, düşmanlık değil edepli bir öğrenmeyle ele alınmalıdır.",
      "Soru: Doğru akide için ileri düzey felsefeye ihtiyacım var mı? Cevap: Hayır. Her Müslümanın kendi ihtiyacına göre esasları öğrenmesi gerekir — altı şart ve halis tevhid — ilim ehli hocaların altında derinlemesine çalışma ise faydalıdır.",
      "Soru: Akideyi bilmek beni başkalarına karşı katı mı yapar? Cevap: Hayır. Selim akide tevazuyu, şükrü, merhameti ve dikkatli konuşmayı artırmalıdır. Akideyi Müslümanları küçümsemek veya tekfire koşmak için kullanmak, kendi başına ciddi bir hatadır.",
      "Soru: İman, İslam ve ihsan arasındaki fark nedir? Cevap: Cibril hadisinde İslam, ibadetin dışa dönük amelleridir; iman, içteki inançlardır (altı şart); ihsan ise ikisinin de kemalidir — yani Allah'a sanki O'nu görüyormuşçasına ibadet etmektir.",
    ],
    actions: [
      "Tartışmalı teknik ayrıntılardan önce açık, üzerinde mutabık olunan esaslara öncelik ver.",
      "Karmaşık bir akide meselesi gerçekten uygulamanı etkilediğinde, ilim ehli yerel âlimlere danış.",
    ],
  },
  {
    title: "Referanslar ve Daha Fazla Çalışma",
    summary: "Kur'an ve sahih sünnetten başla, sonra güvenilir Sünni akide temel metinlerinden.",
    body: [
      "Akidenin birincil kaynağı her zaman Kur'an ve sahih sünnettir, sahabenin ve Ehl-i Sünnet'in ilk âlimlerinin anladığı şekilde kavranır — sonraki eğilimleri nasslara geri okumak değil.",
      "Faydalı çalışmalar arasında kısa klasik akide metinleri (el-Akîdetü't-Tahâviyye ve ilk âlimlerin eserleri gibi) yer alır; bunlar seviyene uygun açıklamayla güvenilir hocalardan okunmalıdır.",
      "Âlimler ikincil noktalarda ayrıldığında, tevazuyla delili öğren ve teknik farklılıkları mezhepçi düşmanlığa dönüştürmekten kaçın — esaslarda müminlerin birliği dinin bizzat bir emridir.",
    ],
    disclaimer:
      "Bu modül eğitim amaçlıdır ve tartışmacı değildir. Kişisel hükümler veya hassas akide meseleleri için, güvendiğin ilim ehli âlimlere danış.",
    actions: [
      "Her hafta bir akide konusunu bir hoca veya güvenilir bir metinle çalış.",
      "İmanın altı şartını ezberle ve her birini kendi kelimelerinle açıklayabilecek hâle gel.",
    ],
    appLinks: [{ label: "Kur'an" }, { label: "Hadis" }, { label: "Dua Öğren" }],
  },
];

export const AQEDAH_GLOSSARY_TR: DeepPartial<AqeedahGlossaryTerm>[] = [
  {
    term: "Akide",
    transliteration: "عقيدة",
    definition:
      "Akide — Müslümanın Allah, melekleri, kitapları, peygamberleri, ahiret günü ve kader hakkında inandığı şey.",
  },
  {
    term: "Tevhid",
    transliteration: "توحيد",
    definition: "Rububiyette, ibadette ve isim ile sıfatlarda Allah'ın birliği — İslam'ın temeli.",
  },
  {
    term: "Şirk",
    transliteration: "شرك",
    definition:
      "İbadette veya yalnızca Allah'a has olan sıfatlarda Allah'a ortak koşmak — tevhidin zıddı.",
  },
  {
    term: "İman",
    transliteration: "إيمان",
    definition: "İman — kalbin tasdiki, dilin ikrarı ve organların ameli.",
  },
  {
    term: "Kader",
    transliteration: "قَدَر",
    definition:
      "Allah'ın ezelî ilmi ve her şeyin takdiri — hayır ve şer, O'nun izni ve hikmetiyle var olur.",
  },
  {
    term: "Nebi",
    transliteration: "نبي",
    definition:
      "Nebi — kendisine vahiy gelen ve onu tebliğ etmekle emrolunan kişi; önceki şeriata tabi olabilir.",
  },
  {
    term: "Resul",
    transliteration: "رسول",
    definition: "Resul — kendi kavmine yeni bir kitap veya şeriatla gönderilen peygamber.",
  },
  {
    term: "Sırat",
    transliteration: "صِراط",
    definition: "Kıyamet gününde cehennemin üzerindeki köprü — müminler amellerine göre geçer.",
  },
];
