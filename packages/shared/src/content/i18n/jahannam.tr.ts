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

// Turkish translation overlay for the Learn Jahannam content. Each overlay mirrors
// the order of its English source array in ../jahannam*.ts (index-aligned);
// untranslated entries fall back to English. Only human-readable text is
// translated — ids, routes, surah/ayah numbers, collections, citations, grades
// and verse-reference labels stay in the English source.

export const JAHANNAM_CORE_TOPICS_TR: DeepPartial<JahannamTopic>[] = [
  {
    title: "Giriş",
    summary: "Allah bizi Cehennem hakkında umutsuzluk için değil, hidayet için bilgilendirir.",
    body: [
      "Cehennem — çoğu zaman Ateş olarak da anılır — Allah'ın Kur'an'da ve Elçisi ﷺ aracılığıyla anlattığı, ahiretteki azap yurdudur. Allah bunu kalpleri korkuyla ezmek için değil, kalpler uyansın, geri dönsün ve kapı hâlâ açıkken merhamet yolunu seçsin diye bildirir.",
      "Merhametli bir Rabbin neden hiç Ateş'ten söz ettiğini anlamak faydalıdır. Uyarı zaten başlı başına bir rahmettir: Karanlıkta önündeki uçurumdan haberdar edilen kişiye bir tehdit değil, bir hediye verilmiştir. Cehennem hakkındaki her ayet, Allah'ın, lütfuyla, dönüş vaktinin geçmesinden önce kullarını geri çağırmasıdır.",
      "İşte bu yüzden vahiy boyunca bu uyarılar tevbe, mağfiret ve Allah'ın engin rahmetine olan umut çağrılarıyla birlikte gelir. Kur'an, Ateş'ten söz ederken nadiren yanına Cenneti, açık tevbe kapısını ve Allah'ın kendisine dönenlere olan sevgisini de anmadan geçer. Amaç, sorumluluk bilincini iyiliğe yöneltmektir — asla umutsuzluğa değil.",
      "Cehennem'e iman etmek; gayba, Allah'ın adaletine ve Ahiret gününün gerçekliğine imanın bir parçasıdır. Bu iman kararlarımıza ağırlık katar ve Cennet umudunu günah konusundaki ciddiyetle dengeler; böylece mümin umut ile korku arasında yürür — Allah'ın rahmetini umarak, kendi kusurlarına karşı da uyanık kalarak.",
      "Ehl-i Sünnet akîdesinin merkezinde yer alan tesellî verici bir nokta bu modülün tamamına yayılmıştır: Yalnızca Allah'a iman ederek ölenler, günahlarının yükü altında olsalar bile, Ateş'te sonsuza dek kalmayacaklardır. Allah'ın rahmeti ve izin verdiği şefaat sayesinde, günahkâr müminler sonunda oradan çıkarılır; yalnızca imanı reddederek ölenler orada kalır. Dolayısıyla mümin için Cehennem'i incelemek, aslında, rahmete ulaşmanın yolunu incelemektir.",
      "Bu modül, metinlerin açıkça belirttiklerini sunar, âlimlerin ihtilaf ettiği noktaları dürüstçe belirtir, yalnızca sahih delilleri nakleder ve seni sürekli tevbeye, salih amele ve Allah'a tevekküle yönlendirir.",
    ],
    quran: [
      {
        excerpt:
          "Kâfirler için hazırlanmış Ateş'ten sakının — ve Allah'a ve Elçisi'ne itaat edin ki merhamet olunasınız.",
      },
      {
        excerpt:
          "De ki: Ey nefislerine karşı aşırı giden kullarım! Allah'ın rahmetinden ümidinizi kesmeyin. Şüphesiz Allah bütün günahları bağışlar.",
      },
      {
        excerpt:
          "Ey iman edenler! Allah'a içtenlikle tevbe edin — umulur ki Rabbiniz kötülüklerinizi sizden giderir ve sizi cennetlere koyar.",
      },
    ],
    appLinks: [{ label: "Allah'ın rahmetine umut" }, { label: "Cennete giden yolculuk" }],
  },
  {
    title: "Allah Cehennemi Neden Yarattı",
    summary: "İlahî adalet, hesap verebilirlik ve özgür seçimin sonuçları.",
    body: [
      "Cehennem, Allah'ın kâmil adaletinin (adl) bir tezahürü olarak var olur. Zalim ile mazlumun, samimi ile hain olanın aynı sona ulaştığı bir evren adil olmazdı. Allah mükemmel derecede adil olduğu için, her haksızlığın karşılık gördüğü, her iyiliğin değer bulduğu nihai bir hesaplaşma olmalıdır.",
      "Bunun merkezinde şu gerçek yatar: Allah kimseye zulmetmez. Ateş'e giren her nefis, kendi sabit ve tevbe edilmemiş seçimleriyle girer — asla keyfî bir hükümle değil. Kur'an açıktır: 'Şüphesiz Allah insanlara hiçbir şekilde zulmetmez; fakat insanlar kendilerine zulmederler' (4:40). Hiç kimse yapmadığı bir şeyden dolayı, ya da hak ettiğinden fazlasıyla cezalandırılmaz.",
      "İnsanlar karanlıkta bırakılmadı. Allah onlara akıl verdi, elçiler gönderdi, apaçık hidayet indirdi; sonra da onu kabul veya reddetme konusunda gerçek bir özgürlükle onurlandırdı: 'Dileyen iman etsin, dileyen inkâr etsin' (18:29). Hakkı reddetmekte, zulümde ya da tevbe etmeden büyük günahta ısrar etmenin ahirette sonuçları vardır — çünkü bu seçim gerçekten insanın kendisine aitti.",
      "Yine de burada bile rahmet adaleti kuşatır. Allah hükmetmeden önce uyarır, dönüşe fırsat vermek için hesabı erteler, istendiğinde hemen bağışlar ve tek bir iyiliği kat kat mükâfatlandırırken tek bir günahı yalnızca bir kez yazar. O'nun adaleti hiçbir zaman rahmetinden ayrı değildir.",
      "Cehennem'in neden var olduğunu düşünmek, takvayı (Allah bilinci) artırmalı ve tevbe için hâlâ bir fırsat olan her günün kıymetini derinleştirmelidir. Bunun amacı, kalbi aynı anda hem ciddi hem umutlu kılmaktır — asla umutsuzlukla felç etmek değil.",
    ],
    quran: [
      {
        excerpt:
          "Şüphesiz Allah insanlara hiçbir şekilde zulmetmez; fakat insanlar kendilerine zulmederler.",
      },
      { excerpt: "O, yaptığından sorumlu tutulmaz; oysa onlar sorguya çekileceklerdir." },
      {
        excerpt:
          "Dileyen iman etsin, dileyen inkâr etsin. Şüphesiz biz zalimler için bir ateş hazırladık.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sizden hiç kimse yalnızca ameliyle Cennete giremez. Dediler ki: Sen de mi ey Allah'ın Elçisi? Buyurdu ki: Ben de giremem, ancak Allah beni rahmetiyle kuşatırsa başka.",
      },
    ],
    appLinks: [{ label: "Akideyi öğren — ilahî adalet" }],
  },
  {
    title: "Ahiretin Gerçekliği",
    summary: "Ölümden hesaba — her aşama gerçektir ve akîdeyle bağlantılıdır.",
    body: [
      "Cehennem'i doğru anlamak için onun bu büyük yolculukta nerede yer aldığını görmek faydalıdır. İslam, ölümden sonra açık bir sıra öğretir: ruh bedenden ayrılır, ardından berzah (kabir hayatı) başlar, sonra bedenlerin diriltileceği Kıyamet, tüm yaratılmışların toplanması, amellerin incelendiği Hesap Günü, amellerin Mizan'da tartılması, Sırat'ın geçilmesi ve nihayet her nefsin Cennet'te ya da Ateş'te yerleşmesi — hepsi Allah'ın hükmü, adaleti ve rahmetiyle.",
      "Bu aşamaların her biri, Kur'an ve sahih Sünnet temelinde Ehl-i Sünnet akîdesinde sabittir. Bu sıralama bir mecaz ya da hikâye değildir; Ahiret gününe imanın bir parçası olarak inanılması gereken bir gerçekliktir ve bunu bile bile inkâr etmek yalnızca bir davranış meselesi değil, akîde meselesidir.",
      "Yolun tamamını görmek, Ateş'i de yeniden çerçeveler. O, her nefsin çoktan yürümekte olduğu yolculuğun sonunda olası bir varış noktasıdır — yani bugünkü seçimler soyut şeyler değildir. Onlar bu yolun adımlarıdır ve onları nereye yönlendireceğimiz hâlâ bizim elimizdedir.",
      "Bu sıralamayı bilmek, mümine korkmak yerine hazırlanmakta yardımcı olur: ölümü sağlıklı bir şekilde hatırlayarak (zikru'l-mevt) yaşamak, hataları Toplanma'ya taşınmadan önce düzeltmek ve amel kapısı açıkken salih amel hesabını doldurmak. Ölüm o kapıyı kapatır; ondan sonra hiçbir şey eklenemez.",
    ],
    quran: [
      {
        excerpt:
          "Sonra siz muhakkak bunun ardından öleceksiniz. Sonra muhakkak Kıyamet gününde diriltileceksiniz.",
      },
      {
        excerpt:
          "Tartıları ağır gelen kimse, hoşnut olunan bir hayat içindedir. Tartıları hafif gelen kimsenin ise anası (varacağı yer) Haviye'dir.",
      },
    ],
    actions: [
      "Her aşamayı Akideyi Öğren bölümünde incele ve imanı günlük kararlarla ilişkilendir.",
      "Rahmet umudunu ihmal etmeden ölümü hatırlamayı (zikru'l-mevt) artır.",
    ],
    appLinks: [
      { label: "Akide — Ahiret günü" },
      { label: "Yeniden diriliş" },
      { label: "Kıyamet günü" },
      { label: "Mizan ve Sırat" },
      { label: "Akidede Cehennem" },
      { label: "Akidede Cennet" },
    ],
  },
  {
    title: "Cehennemin İsimleri",
    summary:
      "Kur'anî isimler ve anlamları — âlimler her ismin ayrı bir derece olup olmadığında ihtilaf eder.",
    body: [
      "Kur'an, Cehennem'i pek çok isimle anar ve bu sadece bir tekrar değildir. Arapçada bir isim çoğu zaman içinde canlı bir tasvir taşır; bu yüzden her isim, işaret ettiği gerçeklik hakkında bir şey öğretir. Bunlar arasında Cehennem, Cahim, Sakar, Sair, Hutame, Haviye ve Leza sayılabilir.",
      "Her isim, şiddetin farklı bir yönüne açılan bir penceredir. Cahim ve Sair, yoğun bir şekilde alevlenen, közlenen bir ateş tasviri sunar; Sakar, yakıp kavuran ve hiçbir şey bırakmayan ateştir; Hutame, içine atılan her şeyi ezip parçalayan ateştir; Haviye, insanın içine düştüğü derin bir uçurumdur; Leza ise saf, kavurucu bir alevdir. Bu isimleri bir arada okumak, kalbin kolayca göz ardı edemeyeceği ciddi bir tablo oluşturur.",
      "İbn Kesir ve Taberî gibi klasik tefsir âlimleri, bu isimleri Arapça köklerinden açıklar ve her birini geçtiği ayetin bağlamında ele alır; bunları statik, teknik bir liste olarak değil.",
      "Burada bir uyarı gereklidir. Bazı sonraki yazarlar her ismi Cehennem'in ayrı, dereceli bir 'katmanı' olarak sunar, bazen ayrıntılı haritalarla. Bu bir yorumdur; Kur'an'da ya da üzerinde ittifak edilmiş hadislerde açıkça belirtilmiş bir liste değildir. Dengeli tutum, metinlerin gerçekten verdiği anlamları öğrenmek ve tahmini haritaları kesin bilgi gibi sunmaktan kaçınmaktır.",
      "İsimleri öğrenmenin amacı meraki gidermek değil, kalbi yumuşatıp bu modülün defalarca işaret ettiği o rahmete yöneltmektir. Her ismin Kur'anî konumu, bağlamı ve tefsir özeti için isimlerin tam derlemesine bakın.",
    ],
    quran: [
      { excerpt: "Onlara Cehennem yeter — ne kötü bir varış yeridir." },
      { excerpt: "O mutlaka Hutame'ye atılacaktır — her şeyi ezip parçalayan ateşe." },
    ],
    appLinks: [{ label: "Tüm isimleri gör" }],
  },
  {
    title: "Cehennemin Dereceleri",
    summary: "Farklı azap dereceleri — kesin yapı metinlerde tam olarak açıklanmamıştır.",
    body: [
      "Kur'an'ın açıkça belirttiği ilke şudur: ceza amellerle orantılıdır — Ateş'te herkes aynı miktarda azap çekmez. 'Herkes için yaptıklarına göre dereceler vardır' (6:132). Bu, adaletin ta kendisinin bir ifadesidir — az zulmeden ile çok zulmeden aynı muameleyi görmez.",
      "Sahih Sünnet de tam olarak bu ilkeyi vurgular. Nebi ﷺ, Ateş'te en hafif azap görecek kişiyi, ayaklarının altına beyninin kaynayacağı iki kor konulan kişi olarak tasvir etmiştir — ve yine de bu, Ateş ehli içinde azap bakımından en hafifidir (Sahih el-Buhari 6562). Bu en az olansa, daha büyük derecelerin ne kadar ağır olacağını ve bugün geri dönmek için ne kadar çok sebep bulunduğunu akıl kavrayabilir.",
      "Bununla birlikte, vahiy müminlere ezberlenmesi gereken, tam ve sayılmış bir Cehennem yapısı haritası sunmaz. Âlimler çeşitli ayet ve rivayetlerden hareketle dereceler, derinlikler ve türler üzerine tartışmışlardır; ancak bunun büyük bölümü, üzerinde ittifak edilmiş açık bir metinden ziyade yorum olarak kalır.",
      "Yine de iki şey kesindir. Birincisi, zulüm, şirk ve tevbe edilmeden ısrarla işlenen büyük günahlar ağır bir uyarı taşır. İkincisi — ve asla unutulmaması gereken — Allah'a içtenlikle dönen herkes için Allah'ın rahmeti ve mağfireti ölüm anına kadar açık kalır. Dereceler hakkında öğrenmenin amacı, seçim hâlâ elimizdeyken daha hafif yolu seçmektir.",
      "Pratikte bunun anlamı, 'yedi kat' ya da benzeri ayrıntılı listelerin kesinleşmiş akîde olarak değil, âlimlerin görüşü olarak görülmesi ve gerçekten koruyan şeye — imana, tevbeye ve salih amele — odaklanılmasıdır.",
    ],
    quran: [
      { excerpt: "Herkes için yaptıklarına göre dereceler vardır." },
      {
        excerpt:
          "Şüphesiz münafıklar Ateş'in en alt tabakasındadır ve onlar için asla bir yardımcı bulamazsın.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ateş ehli içinde en hafif azap görecek olan, ayaklarının altına beyninin kaynayacağı iki kor konulan kişidir.",
      },
    ],
    disclaimer:
      "Bazı kitaplarda bulunan Cehennem dereceleri haritaları, ittifak edilmiş bir icmayı değil, âlimsel bir yorumu yansıtır.",
  },
  {
    title: "Cehennemin Kapıları",
    summary: "Yedi kapı — Kur'an'ın söyledikleri ve yorumun farklılaştığı yerler.",
    body: [
      "Cehennem hakkındaki bir ayrıntı Kur'an'da açık ve şüpheye yer bırakmayacak şekilde belirtilmiştir: 'Şüphesiz Cehennem'in yedi kapısı vardır; her kapı için onlardan belirlenmiş bir pay vardır' (15:44). Dolayısıyla yedi kapıya iman, açık vahye dayanır, spekülasyona değil.",
      "Ayet iki şeyi doğrular: yedi kapı olduğunu ve girenlerin bu kapılara bölüştürüleceğini. Klasik tefsir âlimleri, bu bölüşmenin neye işaret ettiğini tartışırlar — insan türlerine mi, amellere göre azap derecelerine mi, yoksa her ikisine mi. Bu bölüşmenin hikmeti Allah katındadır; O'nun adaleti her nefsi tam olması gereken yere yerleştirir.",
      "Kesinliğin nerede bittiğini not etmek önemlidir. Bazı sonraki kitaplar her belirli kapıyı belirli bir günaha ya da gruba atfeder. Bu özel atıflar erken kaynaklarda tutarlı bir şekilde sabit değildir; bu yüzden bunları nebevi bir belirleme olarak değil, tek tek âlimlerin görüşü olarak sunmak daha isabetlidir.",
      "Dereceler konusunda olduğu gibi, kapılar dersinin de mimari değil ahlakî olduğu unutulmamalıdır: pek çok kapı Ateş'e çıkar ve hepsinden korunmanın yolu tektir — saf iman, büyük günahlardan kaçınma ve bir sürçmenin ardından hemen tevbe.",
    ],
    quran: [
      {
        excerpt:
          "Ve şüphesiz Cehennem hepsine vaad edilen yerdir. Onun yedi kapısı vardır; her kapı için belirlenmiş bir pay vardır.",
      },
    ],
    appLinks: [{ label: "Kapıları ayrıntılı incele" }],
  },
  {
    title: "Cehennemin Nitelikleri",
    summary: "Ateş, sıcaklık, zincirler, pişmanlık — sansasyon değil, saygıyla anlatılmıştır.",
    body: [
      "Kur'an ve sahih Sünnet, Cehennem'i canlı, somut bir dille tasvir eder ve bunun bir sebebi vardır: insan kalbi soyut fikirlerden çok, önünde görebildiği tasvirlerden etkilenir. Bu nitelikler — yoğun ateş, dayanılmaz sıcaklık, sınırlı yiyecek ve içecek, zincirler, karanlık ve derin pişmanlık — tehlikeyi geri çekilecek kadar gerçek hissettirmek içindir.",
      "Bu nitelikler arasında içmek için kaynar su, gıda olarak zakkumun acı ağacı, ateşten kesilmiş giysiler ve insanın bir zamanlar güvendiği her rahatlıktan kopuş yer alır. Nebi ﷺ, bu sıcaklığın bildiğimiz her şeyi ne kadar aştığını anlatarak, bu dünyanın közlenen ateşinin ahiret ateşinin yetmiş parçasından yalnızca biri olduğunu buyurmuştur (Sahih el-Buhari 3265).",
      "Bu nitelikler gerçek uyarılardır, ahireti sonuçlardan arındıracak salt mecazlar değildir. Ehl-i Sünnet âlimleri bunların gerçekliğini doğrular, ancak gaybın tam mahiyetini Allah'ın ilmine bırakır; müminin görevi uyarıyı kalbine yerleştirmek, onu didiklemek değildir.",
      "Bu tür pasajları okumanın bir edebi vardır. Bunlar tevazu, Allah korkusu ve hemen tevbe ile sığınma isteğiyle okunmalıdır — hastalıklı bir merakla değil ve asla umutsuzlukla değil, çünkü uyarının bütün amacı, ondan kaçınmak için hâlâ vaktimiz olduğudur.",
      "Bu niteliklerin belki de en ağırı pişmanlıktır. 'Keşke şöyle yapsaydım…' sözü, amel vaktinin çoktan bittiği bir anda söylenecektir. O pişmanlığı şimdiden duymanın rahmeti, o 'keşke'yi bugün, henüz sonucumuzu değiştirebilecekken hayata geçirebilmemizdir.",
    ],
    quran: [
      {
        excerpt:
          "Önünde Cehennem vardır ve ona irinli bir su içirilecektir. Onu yudum yudum içmeye çalışacak ama yutmayı başaramayacaktır.",
      },
      {
        excerpt:
          "Onlar için ateşten giysiler kesilecek ve başlarının üstünden kaynar su dökülecektir.",
      },
      {
        excerpt:
          "O gün Cehennem getirilir — o gün insan hatırlar, ama bu hatırlamanın ona ne faydası olur?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sizin bu ateşiniz, Cehennem ateşinin yetmiş parçasından biridir. Denildi ki: Ey Allah'ın Elçisi, bu bile yeterdi. Buyurdu ki: O, buna göre altmış dokuz kat daha güçlendirilmiştir, her biri onun sıcaklığı kadar.",
      },
    ],
    appLinks: [{ label: "Cehennemden korunma" }],
  },
  {
    title: "Kim Uyarılmıştır?",
    summary: "Kur'an ve Sünnette türler — belirli bir kişi hakkında hüküm yoktur.",
    body: [
      "Kur'an'ı dikkatle okuyan biri, uyarılarının belirli isimlere değil, tutum ve davranışlara yöneldiğini fark eder. Kur'an, hak apaçık ortaya çıktıktan sonra bile inkârda ısrar edenleri, dışarıda iman iddia edip içte onu reddeden münafıkları, başkalarının haklarını çiğneyen zalimleri, boyun eğmeye karşı kibirlenen mütekebbirleri ve hiç tevbe etmeden büyük günahla ölenleri uyarır.",
      "Kişiler yerine türlere odaklanmak, bilinçli ve rahmete dayalı bir tercihtir. Geçmişi ne olursa olsun, her yaşayan kişi için dönüş kapısı açık kalır, çünkü ölümden önce hiç kimsenin dosyası kapanmış değildir. Uyarı yolu tarif eder ki, şu anda o yolda yürüyen herkes yönünü değiştirebilsin.",
      "İşte bu yüzden İslam, Allah ya da Elçisi ﷺ'nin sahih vahiyde açıkça belirttiği nadir durumlar dışında, belirli bir kişinin nihai akıbetini ilan etmemize — 'bu kişi Ateş'tedir' dememize — izin vermez. Kalplerin ve akıbetlerin hükmü yalnızca Allah'a aittir; bize düşen kendi hesabımızdır.",
      "Öyleyse her uyarıyı okumanın doğru yolu onu içe döndürmektir: 'Bu kime uygulanır?' değil, 'Bunlardan bir kısmı bana uygulanıyor mu ve bugün ne değiştireceğim?' Sen kim olursan ol, Allah'a dönüş çağrısı hâlâ açıktır — ve yarın kimse için garanti değildir.",
    ],
    quran: [
      { excerpt: "Münafıklar Ateş'in en alt tabakasındadır." },
      {
        excerpt:
          "Kim bir kötülük kazanır da hatası onu kuşatırsa — işte onlar Ateş ehlidir, orada ebedî kalırlar.",
      },
      {
        excerpt:
          "Sakın Allah'ı zalimlerin yaptıklarından habersiz sanma. O, onları ancak gözlerin dehşetle açılacağı bir güne erteler.",
      },
    ],
    appLinks: [{ label: "Büyük günahlar" }],
  },
  {
    title: "Büyük Günahlar",
    summary: "Kebâir — içtenlikli tevbe gerektiren ağır günahlar.",
    body: [
      "Âlimler günahları iki türe ayırır ve bu ayrımı anlamak hem ciddiyet hem de rahatlama getirir. Büyük günahlar (el-kebâir), Allah'ın ya da Elçisi'nin ﷺ belirli, ağır bir sonuç bağladığı günahlardır — Ateş tehdidi, lanet, Allah'ın gazabı ya da belirlenmiş bir ceza — şirk, adam öldürme ve faiz yemek gibi. Küçük günahlar (es-sağâir), bu eşiğin altında kalan daha hafif sürçmelerdir.",
      "Rahatlama, ikisinin birbiriyle nasıl ilişkili olduğundadır. Allah, eğer mümin büyük günahlardan kaçınırsa küçük günahların olağan ibadetlerle silineceğine söz verir: 'Eğer size yasaklanan büyük günahlardan kaçınırsanız, küçük kusurlarınızı sizden gideririz' (4:31). Namazdan namaza, cumadan cumaya ve Ramazan'dan Ramazan'a olan süre, büyük günahlardan kaçınılması şartıyla, aralarındaki günahlara kefarettir.",
      "İşte bu yüzden büyük günahlar özel dikkati hak eder: bunlar sıradan ibadetin akışında kendiliğinden silinmez, bilinçli, içtenlikli bir tevbe gerektirir. Eğer dönüş yapılmadan ısrar edilirse nefsi tehlikeye atar; terk edilip tevbe edilirse bağışlanır.",
      "Ve bunların tümünün üzerinde şu ufuk asılıdır: şirk üzere ölme istisnası dışında, küçük olsun büyük olsun her günah, Allah dilerse mağfiretinin kapsamına girer. 'Şüphesiz Allah kendisine ortak koşulmasını bağışlamaz; bunun dışında dilediğini bağışlar' (4:48). Hiçbir mümin, büyük günahlarının kendisini rahmetin dışına ittiği sonucuna varmamalıdır.",
      "Bu modülde her büyük günah konusu, tanımını, delilini, neden ağır olduğunu ve tevbe ile kaçınmanın somut yolunu verir — her zaman aynı açık kapıyla sona ererek.",
    ],
    quran: [
      {
        excerpt:
          "Eğer size yasaklanan büyük günahlardan kaçınırsanız, küçük kusurlarınızı sizden gideririz ve sizi onurlu bir yere koyarız.",
      },
      {
        excerpt:
          "Şüphesiz Allah kendisine ortak koşulmasını bağışlamaz; bunun dışında dilediğini bağışlar.",
      },
      {
        excerpt:
          "Büyük günahlardan ve hayasızlıklardan kaçınanlar, küçük sürçmeler dışında — şüphesiz Rabbin geniş mağfiret sahibidir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "En büyük günahlar şunlardır: Allah'a ortak koşmak, bir cana kıymak, ana-babaya isyan etmek ve yalan yere şahitlik yapmak.",
      },
    ],
    appLinks: [{ label: "Büyük günahlara bak" }, { label: "Tevbe" }],
  },
  {
    title: "Dil Günahları",
    summary: "Gıybet, yalan, alay — işlemesi kolay, telafisi zor günahlar.",
    body: [
      "Dil küçüktür ama sonuçları çok geniştir; birkaç kelimeyle insan güven inşa edebilir ya da bir kişinin onurunu yıkabilir, bir kalbe huzur verebilir ya da onu derinden yaralayabilir. İşte bu yüzden Kur'an ve Sünnet, dil günahlarına bu kadar sık döner: gıybet, iftira, koğuculuk (nemîme), yalan, alay ve yalan yeminler.",
      "Gıybet, kardeşin ya da kız kardeşin hakkında hoşuna gitmeyecek bir şeyi anmaktır, doğru olsa bile — çünkü yalan ise bu, ondan da büyük bir günah olan iftira olur. Kur'an bunu en etkili tasvirlerinden biriyle anlatır: onu ölü kardeşinin etini yemeye benzetir (49:12). Bu şekilde bakıldığında günah, sıradanlığını kaybeder.",
      "Bu günahları bu kadar tehlikeli yapan şey, tam olarak ne kadar kolay ve alışkanlık hâline gelebilir olduklarıdır. İnsanlar sıradan sohbette bir kez daha düşünmeden bunlara kayar; işte bu yüzden Nebi ﷺ imanı doğrudan dilin korunmasına bağladı: 'Allah'a ve ahiret gününe iman eden ya hayır söylesin ya sussun.' Konuşmadan önceki basit bir duraklama, gerçek bir ibadettir.",
      "Dil günahlarından tevbe genel şartlarla ilerler — durmak, pişman olmak, bir daha dönmemeye kesin karar vermek — ama başkasının hakkı söz konusu olduğunda ek bir boyut kazanır. Onun adını temizlemek ya da ondan özür dilemek büyük bir zarar vermeden mümkünse bu tevbenin bir parçasıdır; bunu söylemek yarayı yalnızca derinleştirecekse âlimler, o kişinin iyiliklerini anlatmayı, yokluğunda onu savunmayı ve onun için mağfiret dilemeyi tavsiye ederler.",
    ],
    quran: [
      {
        excerpt:
          "Birbirinizin gıybetini yapmayın. Herhangi biriniz ölü kardeşinin etini yemekten hoşlanır mı?",
      },
      { excerpt: "Diliyle çekiştirip kaş göz işaretiyle ayıplayan herkesin vay hâline." },
    ],
    hadith: [
      {
        excerpt: "Allah'a ve ahiret gününe iman eden ya hayır söylesin ya sussun.",
      },
    ],
    actions: [
      "Konuşmadan önce sor: Bu doğru mu? Bu gerekli mi? Bu iyilikli mi?",
      "Birinin gıybetini yaptıysan onun için dua et ve mümkünse ondan özür dile.",
    ],
    appLinks: [
      { label: "Günlük öz muhasebe" },
      { label: "Cennet — güzel ahlak" },
      { label: "Tevbe" },
    ],
  },
  {
    title: "Başkalarının Haklarını İhlal Etmek",
    summary: "Kul hakları telafi ister — yalnızca Allah'tan tevbe etmek yetmez.",
    body: [
      "İslam, üzerimize düşen hakları iki türe ayırır: Allah hakları (hukûkullah) ve kul hakları (hukûku'l-ibâd). Zulüm, adaletsizlik, emanete hıyanet, ticarette hile, işçilerin ücretini geciktirmek, borçları ödememek ve akraba ilişkilerini koparmak — bunların hepsi kul haklarına girer — ve ahirette özel bir ağırlığı vardır.",
      "Bunun nedeni sarsıcı bir hadiste gösterilmiştir. Nebi ﷺ gerçek müflisi, Kıyamet gününe namaz, oruç ve zekâtla gelen ama birine sövmüş, birine iftira atmış, birinin malını haksız yere almış ve birinin kanını dökmüş kişi olarak tanımlamıştır. Mağdurlarına onun iyi amellerinden hak verilir, ta ki bitene kadar; sonra onların günahları ona yüklenir ve Ateş'e atılır (Sahih Müslim 2581). İnsan ibadette zengin olabilir ama yine de davranışları yüzünden mahvolabilir.",
      "Bu, tevbe hakkında önemli bir ders öğretir: Allah'a dönmek gereklidir, ama bir insanın hakkı çiğnendiğinde bu tek başına yeterli değildir. Mağdurun hakkı, ödenene ya da bağışlanana kadar devam eder. Öyleyse burada tevbenin durmak, pişman olmak ve niyet etmenin ötesinde dördüncü bir şartı vardır — hak edilmiş olanı geri vermek.",
      "Pratikte bu, alınanı ya da onun değerini geri vermek, borçları küçük parçalar hâlinde bile olsa ödemek, zedelenmiş itibarları onarmak ve ilişkisi kesilen akrabalarla barışa yönelmek anlamına gelir. Burada da rahmet vardır: telafinin her adımı başlı başına bir iyiliktir ve Allah, kırdığını onarmaya çıkan içten kalbe kolaylık verir.",
    ],
    quran: [
      { excerpt: "Faizden vazgeçmezseniz, Allah ve Elçisi'nden bir savaş ilanı bilin." },
      { excerpt: "Allah'ın ahdini bozanlar ve birleştirilmesi emredileni koparanlar." },
    ],
    hadith: [
      {
        excerpt:
          "Müflisin kim olduğunu biliyor musunuz? Namaz, oruç ve zekâtla gelen, ama birine sövmüş, iftira atmış, malını haksız yere yemiş ve kan dökmüş kişi — iyilikleri başkalarına verilir.",
      },
    ],
    actions: [
      "Zulmettiğin herkesin bir listesini yap ve bu hafta telafiye doğru bir adım at.",
      "Kalan borçları, küçük taksitler hâlinde bile olsa öde.",
    ],
    appLinks: [{ label: "Yolculuğum" }, { label: "Tevbe" }],
  },
  {
    title: "Münafıklık",
    summary: "İnançta büyük nifak — ve davranışta nifak alametleri.",
    body: [
      "Âlimler nifakın iki türünü açıklar ve bunları ayrı tutmak hem yanlış bir rahatlıktan hem de yanlış bir paniğe düşmekten korur. Birincisi, itikadî büyük nifaktır: dışarıda İslam'ı göstermek, içeride imanı reddetmek. Kur'an'ın en şiddetli şekilde uyardığı nifak budur; bu kişileri 'Ateş'in en alt tabakasına' (4:145) yerleştirir, çünkü gerçekte onlar bir maskenin arkasında kâfir olarak ölmüşlerdir.",
      "İkincisi ise daha hafif, amelî nifaktır: gerçek imanı olan biri için bile olsa, münafıkların davranışlarına benzeyen huylar. Nebi ﷺ bilinen alametleri saymıştır — 'konuştuğunda yalan söyler, söz verdiğinde döner ve kendisine emanet edildiğinde ihanet eder' — ve bir rivayette tartışırken hakaret etmeyi de ekledi. Mümin bunlara düşebilir ve yine de mümin kalabilir, ama bu kaçınılması gereken ciddi bir uyarıdır.",
      "Bu ayrım, bu konuyu nasıl ele alacağımız açısından çok önemlidir. Amelî alametler kendimiz için bir ayna olarak verilmiştir, başkalarına yapıştırılacak bir etiket olarak değil. Nebi ﷺ ve ashabı, kalbin gizli olduğunu ve değişebileceğini bildikleri için, kendi içlerinde nifaktan korkarlardı.",
      "Öyleyse sağlıklı tepki içe dönüktür: kendi doğruluğunu, sözlerine bağlılığını ve emanete riayetini sorgulamak ve Allah'tan ihlas dilemek. Birinin içinde ne olduğunu yalnızca Allah bilir; belirli kişileri nifakla suçlamak, onlara karşı işlenen ciddi bir haksızlığın ta kendisidir.",
    ],
    quran: [
      { excerpt: "Münafıklar Ateş'in en alt tabakasındadır." },
      {
        excerpt:
          "Münafıklar sana geldiklerinde: Şahitlik ederiz ki sen Allah'ın Elçisi'sin, derler — ve Allah, onların yalancı olduklarını bilir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Münafığın üç alameti vardır: konuştuğunda yalan söyler, söz verdiğinde döner ve kendisine emanet edildiğinde ihanet eder.",
      },
    ],
    disclaimer:
      "Kişileri nifakla suçlamayın. Metinler tüm ümmeti uyarır; arınma kendi nefsimizden başlar.",
  },
  {
    title: "Zikredilen Cezalar",
    summary: "Metinlerin belirttikleri — Allah korkusu ve rahmet umuduyla okunmalı.",
    body: [
      "Kur'an ve Sünnet, belirli günahlara özel sonuçlar bağlar — faiz yiyenler, iffetli kadınlara iftira atanlar, mal biriktirip hakkını vermeyenler, namazı zayi edenler ve büyük günahta ısrar edenler için. Bu belirlilik bir açıklama biçimidir: kimseye 'yaptığım şeyden dolayı uyarılmadım' deme fırsatı bırakmaz.",
      "Bu sonuçların bir kısmı kabirde (kabir azabı) zikredilmiştir, bir kısmı da Cehennem'in kendisinde. Ehl-i Sünnet akîdesi her ikisinin gerçekliğini doğrular; ama bu gaybî meselelerin tam 'nasıl'ını insan hayal gücüne değil, Allah'ın ilmine bırakır.",
      "Müminin bütün bunlarla nasıl ilişki kurduğu asıl mesele budur. Amaç ayrıntılı sahnelere takılmak ya da kalbi boğmak değildir; uyarıyı kabul etmek, uygulanan neyse ondan tevbe etmek ve ardından enerjiyi gerçekten koruyan amellere yöneltmektir. İşte bu yüzden bu modül, kasıtlı olarak cezadan çok korunmaya, tevbeye ve rahmete yer verir.",
      "Kısacası, zikredilen herhangi bir cezadan çıkarılacak doğru ders bir korkudan çok bir sorudur: 'Bunu yapıyor muyum — ve eğer öyleyse, nasıl durabilir ve düzeltebilirim?' Bugün dürüstçe cevaplandığında, uyarı rahmet dolu görevini çoktan yerine getirmiş demektir.",
    ],
    quran: [
      { excerpt: "İffetli kadınlara iftira atıp dört şahit getirmeyenlere seksen değnek vurun." },
      {
        excerpt:
          "Altın ve gümüşü biriktirip onu Allah yolunda harcamayanlara acı bir azabı müjdele.",
      },
    ],
    appLinks: [{ label: "Cehennemden korunma" }, { label: "Rahmete umut" }],
  },
  {
    title: "Cehennemden Korunma",
    summary: "Tevhid, namaz, tevbe, sadaka, Kur'an ve dua — bu modülün kalbi.",
    body: [
      "Tüm uyarılardan sonra, asıl mesele şudur: Cehennem, insanın kendisinden korunması gereken bir şeydir ve İslam bu korunma araçlarıyla doludur. Bunların en büyüğü doğru tevhiddir — yalnızca Allah'a, O'nun dışında hiç kimseye değil, ibadet etmek. Her başka amel bu temel üzerine kabul edilir ve tartılır; işte bu yüzden inancını korumak her şeyden önce gelir.",
      "Bu temel üzerine, pratik kalkanlar hem çok hem de erişilebilirdir: beş vakit namazı ikame etmek, içten tevbe, sadaka vermek — Nebi ﷺ'nin, suyun ateşi söndürdüğü gibi günahı söndürdüğünü buyurduğu — oruç, Kur'an'ı okumak ve onunla amel etmek, güzel ahlak, başkalarına merhamet, sürekli zikir ve devamlı istiğfar. Bunların hiçbiri büyük bir servet ya da ilim gerektirmez; hepsi herkese açıktır.",
      "Nebi ﷺ ayrıca Ateş'ten sığınmak için doğrudan dualar da öğretmiş ve bunları sık sık tekrarlamayı teşvik etmiştir. Allah'tan üç kez Cenneti isteyenin, Cennetin bizzat onun girişi için dua ettiğini; üç kez Ateş'ten sığınma dileyenin ise, Ateşin bizzat ondan korunması için dua ettiğini buyurmuştur (Câmiu't-Tirmizî 2572). Bu dualar, namazda selam vermeden önce ve sabah akşam zikirlerinde özel bir yere sahiptir.",
      "Şeriatın kurduğu dengeyi düşün. Korunma araçları, mahvolma sebeplerinden daha güçlü, daha çok vurgulanmış ve daha kolay ulaşılabilirdir — ve bu, Allah'ın rahmetinin bir işaretidir. Kurtulmak, kaybolmaktan çok daha kolaydır.",
      "Bu bölüm, bu modülde bilinçli olarak en büyük bölümdür, çünkü İslam bu meseleyi tam olarak böyle tartar: uyarı her zaman umutla birlikte gelir ve insanın bugün başlayabileceği somut amelden asla ayrılmaz.",
    ],
    quran: [
      {
        excerpt:
          "Rabbimiz, biz iman ettik; bizim günahlarımızı bağışla ve bizi Ateş'in azabından koru diyenler.",
      },
      {
        excerpt:
          "Rabbimiz, bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi Ateş'in azabından koru.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah'tan üç kez Cenneti isteyen kimseye Cennet: Ey Allah'ım, onu Cennete koy, der. Üç kez Ateş'ten sığınma dileyen kimse için de Ateş: Ey Allah'ım, onu Ateş'ten koru, der.",
      },
    ],
    actions: [
      "Namazda selam vermeden önce Cehennemden sığınma duasını ezberle.",
      "Beş vakit namazı vaktinde kıl — en güçlü kalkanlardan biri.",
      "Az da olsa düzenli olarak sadaka ver.",
    ],
    appLinks: [
      { label: "Korunma duaları" },
      { label: "Cennete giden yolculuk" },
      { label: "Sabah akşam zikirleri" },
      { label: "Duayı öğren" },
    ],
  },
  {
    title: "Tevbe",
    summary: "Allah içten tevbeyi kabul eder — ölümden önce hiçbir günah çok büyük değildir.",
    body: [
      "Tevbe — rücû — Allah'ın dinde koyduğu, hiçbir günahın kalıcı olmasına gerek bırakmayan sistemdir. Özünde bu, kalbin Allah'a geri dönüşüdür ve âlimler şartlarını Kur'an ve Sünnet'ten çıkarırlar: günahı içtenlikle terk etmek, ona gerçekten pişman olmak ve bir daha dönmemeye kesin karar vermek. Günah başkasının hakkıyla ilgiliyse dördüncü bir şart eklenir — o hakkı geri vermek ya da ondan özür dilemek.",
      "Tevbeyi bu kadar umut verici kılan, Allah'ın onu nasıl kabul ettiğidir. O, dönen kulu yalnızca hoş görmez; sevinir. Nebi ﷺ, Allah'ın kulunun tevbesinden, ıssız bir çölde bineğini ve tüm eşyasını kaybedip ümidini kestikten sonra onu aniden karşısında bulan kimseden daha çok memnun olduğunu buyurmuştur (Sahih el-Buhari 6309). Aynı karşılama, dönen herkesi beklemektedir.",
      "Dahası, tevbenin kapısı hayat boyunca hiç kapanmaz. Nebi ﷺ, Allah'ın gündüzün günahkârının tevbesini kabul etmek için geceleyin elini uzattığını, gecenin günahkârının tevbesini kabul etmek için de gündüz elini uzattığını buyurmuştur (Sahih Müslim 2759). Tevbe, birey için ruh boğaza gelene kadar, insanlık için de güneş batıdan doğana kadar kabul edilir — dolayısıyla onu ertelemenin hiçbir zaman bir sebebi yoktur.",
      "Bu, birçok kez düşüp birçok kez tevbe etmiş kimse için de geçerlidir. Her dönüş içten olduğu sürece Allah kabul etmeye devam eder; umutsuzluk şeytandandır, dinden değil. Ölümden önce kesinleşmesi gereken tek şey şirktir, çünkü onun üzerine ölen kişi, tevbe için gereken imandan yoksun ölür — işte tam da bu yüzden sadece ve yalnızca Allah'a dönmek en acil rücûdur.",
      "Pratik ders basittir: şimdi tevbe et, tekrar tekrar tevbe et ve bir günahın büyüklüğünün ya da geçmiş düşüşlerinin sayısının, dönüşüne karşı bir delil olmasına asla izin verme. Davet her zaman açıktır.",
    ],
    quran: [
      {
        excerpt:
          "Allah'ın rahmetinden ümidinizi kesmeyin. Şüphesiz Allah bütün günahları bağışlar. O, çok bağışlayan, çok merhamet edendir.",
      },
      {
        excerpt:
          "Tevbe eden, iman eden ve salih amel işleyenler hariç — Allah onların kötülüklerini iyiliklere çevirecektir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah, kulunun tevbesinden, ıssız bir arazide kaybolan bineğini bulan kimseden daha çok memnun olur.",
      },
      {
        excerpt:
          "Allah gündüzün günahkârının tevbesini kabul etmek için geceleyin elini uzatır, gecenin günahkârının tevbesini kabul etmek için de gündüz elini uzatır; ta ki güneş batıdan doğana kadar.",
      },
    ],
    actions: [
      "Gün boyunca 'Estağfirullah' de — yalnızca büyük sürçmelerden sonra değil, sürekliliği hedefle.",
      "Seyyidü'l-istiğfar'ı öğren ve sabah akşam oku.",
    ],
    appLinks: [
      { label: "Günlük zikir ve istiğfar" },
      { label: "Duayı öğren — mağfiret" },
      { label: "Allah'ın rahmetine umut" },
      { label: "Yolculuğum" },
    ],
  },
  {
    title: "Allah'ın Rahmetine Umut",
    summary: "Asla umutsuzluğa kapılma — iyilikler günahları siler; devamlılık önemlidir.",
    body: [
      "Bu modüldeki her şey buraya işaret eder. Allah er-Rahman ve er-Rahim'dir — en merhametli — ve bize rahmetinin gazabını geçtiğini ve 'her şeyi kuşattığını' (7:156) bildirmiştir. Mümin, kuşun iki kanadı gibi, umut ile korku arasında yaşamalıdır: günahtan uyanık kalacak kadar korkmalı, asla ümitsizliğe düşmeyecek kadar mağfirete güvenmelidir.",
      "İşte bu yüzden umutsuzluğun kendisi yersizdir. İnsan ne kadar kaybolmuş hissederse hissetsin, dönüş kapısı açıktır ve çok geç olduğunu fısıldayan Allah değil, şeytandır. Rahmetten ümit kesmek, en merhametli olan hakkında çok az düşünmektir; içten bir kalbin yapması gereken tek şey geri dönmektir.",
      "Ateş hakkındaki Ehl-i Sünnet akîdesinin büyük tesellisi de buradadır. İnkâr üzere ölenler için Cehennem kalıcı bir yurttur. Ama yalnızca Allah'ı ikrar ederek ölen bir mümin, büyük günahların yükü altında olsa bile, orada sonsuza dek kalmayacaktır. Nebi ﷺ, insanların şefaatle ve ardından Allah'ın kendi rahmetiyle Ateş'ten çıkarılacağını öğretmiştir — Cennetin kenarındaki hayat nehrine atılıp orada canlanarak Cennete gireceklerdir (Sahih el-Buhari 7439). Kalbinde bir hardal tanesi kadar iman olan hiç kimsenin Ateş'te kalmayacağını buyurmuştur (Sahih Müslim 183). Öyleyse muvahhid için Ateş — girse bile — hiçbir zaman hikâyenin sonu değildir.",
      "Bu arada, rahmet günlük hayata da işlenmiştir: iyilikler kötülükleri siler (11:114) ve küçük, istikrarlı ibadet — vaktinde kılınan bir namaz, sessiz bir sadaka, Allah için gösterilen bir an sabır — insanı sürekli O'na yaklaştırır ve zarardan uzaklaştırır. Devamlılık, şiddetten daha önemlidir.",
      "Öyleyse çalışmanın özeti şu olsun: uyarıyı ciddiye al, ama umudun korkunun üzerinde kalmasına izin ver. Tehlikeyi bil, rahmet yolunu seç ve o yolda yürü — bir seferde bir adım — Allah'a kavuşana kadar her gün.",
    ],
    quran: [
      { excerpt: "Rahmetim her şeyi kuşatmıştır." },
      {
        excerpt:
          "De ki: Ey nefislerine karşı aşırı giden kullarım! Allah'ın rahmetinden ümidinizi kesmeyin. Şüphesiz Allah bütün günahları bağışlar.",
      },
      { excerpt: "Şüphesiz iyilikler kötülükleri giderir. Bu, hatırlayanlar için bir öğüttür." },
    ],
    hadith: [
      {
        excerpt:
          "Allah buyurur: Melekler şefaat etti, peygamberler şefaat etti, müminler şefaat etti; şimdi en merhametli olandan başka kimse kalmadı. Sonra Ateş'ten bir avuç alır ve hiç iyilik yapmamış insanları çıkarır.",
      },
      {
        excerpt: "Kalbinde hardal tanesi kadar iman bulunan kişi Ateş'ten çıkarılır.",
      },
    ],
    actions: [
      "Her günü istiğfar ve her nimet için şükürle bitir.",
      "Bu modülü Cennete giden yolculukla ilişkilendir — uyarı ve umut birlikte.",
    ],
    appLinks: [
      { label: "Cennete giden yolculuk" },
      { label: "Akide — umut ve tevbe" },
      { label: "Yolculuğum" },
    ],
  },
];

export const JAHANNAM_MAJOR_SIN_TOPICS_TR: DeepPartial<JahannamTopic>[] = [
  {
    title: "Şirk",
    summary: "Allah'a ortak koşmak — üzerine ölünürse bağışlanmayan tek günah.",
    body: [
      "Tanım: Şirk, Allah'a ortak koşmaktır — yalnızca O'na ait olan bir davranışı (ibadet, en üstün sevgi, korku, umut, tevekkül ya da yasa koyma hakkı) O'ndan başka bir şeye ya da kimseye yöneltmektir. Bu, tevhidin tam zıddıdır ve yaratılışın var oluş amacına doğrudan saldırır: yalnızca Allah'a ibadet etmek.",
      "Neden en ağır günahtır: Her başka günah, gerçek Rabbi kabul ederken işlenen bir haksızlıktır, ama şirk doğrudan O'na karşı işlenen bir haksızlıktır — yaratılanı Yaratan sanmaktır. İşte bu yüzden Kur'an bunu 'büyük bir zulüm' olarak adlandırır (31:13). Bu, eğer kişi tevbe etmeden üzerine ölürse bağışlanmayan tek günahtır: 'Şüphesiz Allah kendisine ortak koşulmasını bağışlamaz; bunun dışında dilediğini bağışlar' (4:48). Bu şiddetin içinde gizli olan rahmet şudur: şirk dışında her şey Allah'ın mağfiretinin kapsamındadır.",
      "Biçimleri: Âlimler büyük şirki ayırır — putlara, ölülere, evliyaya ya da yaratılmışlara ibadet; yalnızca Allah'ın verebileceği bir şey için O'ndan başkasına yalvarmak; kurban ya da adağı O'ndan başkasına yöneltmek — ki bu, tevbe edilmedikçe kişiyi İslam dairesinden çıkarır. Bunun yanında küçük ve gizli şirk de vardır; ibadette gösteriş yapmak, Allah'tan başkasına yemin etmek ya da falcılık ve muskaya güvenmek gibi; ki bu ağır bir günahtır ama tek başına dinden çıkarmaz.",
      "Uzaklaşma yolu: Tevhidi öğrenerek, yalnızca Allah'a ibadet ederek ve niyeti arındırarak koru ve güçlendir; böylece amellerin yalnızca O'nun için olsun, insanların gözü için değil. Şirke düşmüş biri, ondan içtenlikle vazgeçip yalnızca Allah'a ibadete dönerek tevbe eder — ve o dönüş kapısı hayat boyunca açık kalır.",
    ],
    quran: [
      {
        excerpt:
          "Şüphesiz Allah kendisine ortak koşulmasını bağışlamaz; bunun dışında dilediğini bağışlar.",
      },
      { excerpt: "Ey oğulcuğum, Allah'a ortak koşma. Şüphesiz şirk büyük bir zulümdür." },
    ],
    hadith: [
      {
        excerpt:
          "En büyük günahlar şunlardır: Allah'a ortak koşmak, bir cana kıymak, ana-babaya isyan etmek ve yalan yere şahitlik yapmak.",
      },
    ],
    actions: [
      "Akideyi öğren ve Allah'ın 99 ismi aracılığıyla tevhidi öğren.",
      "İbadette niyeti arındır — her gün Allah'tan ihlas dile.",
    ],
    appLinks: [{ label: "Akide — şirkin açıklaması" }, { label: "Tevbe" }],
  },
  {
    title: "Adam Öldürme",
    summary: "Haksız yere masum bir canı öldürmek — en ağır haksızlıklardan biri.",
    body: [
      "Tanım: Burada adam öldürme, Allah'ın dokunulmaz kıldığı bir canı haksız ve kasıtlı olarak almaktır. İslam meşru biçimleri tanır — uygun yetkiyle uygulanan meşru kısas gibi — ama masum bir canı meşru bir gerekçe olmadan öldürmek en ağır suçlardan biridir.",
      "Neden bu kadar ağır: Kur'an, haksız yere bir cana kıymayı tüm insanlığın tartısında tartar: 'Kim bir cana kıyarsa… sanki bütün insanları öldürmüş gibidir' (5:32), çünkü bir canı yok etmek, her canı koruyan dokunulmazlığı çiğnemektir. Adam öldürme, Âdemoğulları arasındaki ilk günahtı ve vahiy, ahireti mahveden bir şey olarak buna defalarca döner.",
      "Çifte haksızlık: Adam öldürme, aynı anda hem Allah'a karşı bir günahtır — canın dokunulmazlığı üzerindeki hakkı çiğner — hem de kullara karşı bir günahtır — maktul ve geride kalanlar. İşte bu yüzden bunun tevbesi çoğu zaman daha ağırdır: Allah'a dönmek gereklidir, ama mağdurların hakları da devam eder ve ülke hukuku ya da İslam hukuku diyet ya da başka sonuçlar öngörüyorsa, bunlar uygun mercilerle ve yetkili âlimler aracılığıyla yerine getirilmelidir.",
      "Uzaklaşma yolu: Her canı dokunulmaz say, öfke ve düşmanlığı sertleşmeden önce yatıştır ve anlaşmazlıkları şiddet yerine sabır ve adaletle çöz. Ve kullara karşı işlenen bu en büyük suç bile, içtenlikle tevbe eden, ilgili hakları mümkün olduğunca yerine getiren ve o yola bir daha asla dönmeyen kişi için Allah'ın rahmetinin dışında değildir.",
    ],
    quran: [
      {
        excerpt:
          "Kim bir cana ya da yeryüzünde bozgunculuğa karşılık olmaksızın bir cana kıyarsa — sanki bütün insanları öldürmüş gibidir.",
      },
      { excerpt: "Kim bir mümini kasten öldürürse, cezası Cehennemdir; orada ebedî kalır." },
    ],
    hadith: [
      {
        excerpt:
          "En büyük günahlar şunlardır: Allah'a ortak koşmak, bir cana kıymak, ana-babaya isyan etmek ve yalan yere şahitlik yapmak.",
      },
    ],
    actions: ["Her canı değerli say; anlaşmazlıkları sabır ve adaletle çöz."],
    appLinks: [{ label: "Başkalarının haklarını ihlal etmek" }],
  },
  {
    title: "Zina",
    summary: "Gayrimeşru cinsel ilişki — hem cana hem topluma zarar veren yıkıcı bir günah.",
    body: [
      "Tanım: Zina, meşru bir nikâh dışında gerçekleşen her türlü gayrimeşru cinsel ilişkidir; hem evli olmayanlar arasında hem de evli birinin dahil olduğu durumları kapsar. İslam bunu özel bir mesele olarak değil, geniş çaplı zarar veren bir ihlal olarak görür.",
      "Neden bu kadar ağır: Zina, sağlıklı bir toplumun üzerine kurulduğu şeyleri eritir — soy, eşler arası güven, çocukların korunması ve insanı onurlu kılan iffet. Kur'an'ın kendi ifadesi öğreticidir: yalnızca fiili haram kılmakla kalmaz, 'ona yaklaşmayın bile' der (17:32); bu yola götüren bakışlardan, yalnız kalmalardan ve adımlardan sakındırır. Yaklaşmanın bu şekilde yasaklanması bir rahmettir, çünkü insanı arzu kontrolden çıkmadan önce korur.",
      "Engellerdeki hikmet: İnsanları arzuyla en yoğun anında mücadele etmeye bırakmak yerine, İslam onları önceden koruyucu tedbirlerle çevreler — bakışları sakınmak, kılık kıyafet ve davranışta hayâ, yabancıyla baş başa kalmaktan kaçınmak ve bu ihtiyaçların meşru, onurlu yolu olarak nikâhı teşvik etmek. Bu sınırları önceden koymak, kenarda mücadele etmekten çok daha kolaydır.",
      "Dönüş yolu: Düşmüş olan herkes için yol, içten bir tevbedir — günahı tamamen bırakmak, ona pişman olmak, bir daha dönmemeye karar vermek ve geçmişini yaymak yerine örtmek. Zina büyük bir günahtır, ama Allah'ın kendisine dönenleri bağışladığı günahlardan biridir kesinlikle; umutsuzluğa yer yoktur ve yeni bir başlangıç her zaman mümkündür.",
    ],
    quran: [
      {
        excerpt: "Zinaya yaklaşmayın bile. Şüphesiz o bir hayasızlıktır ve çok kötü bir yoldur.",
      },
      {
        excerpt:
          "Ve zina etmeyenler… tevbe eden, iman eden ve salih amel işleyenler hariç — Allah onların kötülüklerini iyiliklere çevirecektir.",
      },
    ],
    actions: [
      "Gözlerini ve sosyal medya kullanımını koru.",
      "Evli değilsen salih bir eş için dua et.",
    ],
    appLinks: [{ label: "Tevbe" }],
  },
  {
    title: "Faiz",
    summary: "Faiz ve tefecilik — Kur'an'da onu yapanlara karşı savaş ilanı.",
    body: [
      "Tanım: Faiz (ribâ), bazı mali işlemlerde haksız bir fazlalıktır — en bilinen biçimi borçlarda alınan ya da verilen faiz, ama aynı türden malların belirli türde eşit olmayan ya da ertelenmiş değişimlerini de kapsar. Özündeki gerçeklik, gerçek bir değer ya da risk olmadan başkasının aleyhine para kazanmaktır.",
      "Neden olağanüstü derecede ağır: Kur'an'ın faize karşı konuştuğu dil, mali günahlar arasında benzersizdir. Allah, buna ısrar edenlere kendisi ve Elçisi ﷺ adına savaş ilan eder (2:279) — başka hiçbir günah için kullanılmayan bir ifade — çünkü faiz ihtiyacı sömürür, serveti birkaç ele toplar ve bir ekonominin sahip olması gereken şefkati boşaltır. Nebi ﷺ, herhangi bir biçimdeki bu işlemlere karşı şiddetle uyarmıştır.",
      "Hikmet ve rahmet: Bu yasak insanları gerçek ticarete, paylaşılan riske ve sadakaya yönlendirir; zayıfları borç yükü altında ezilmekten korur. Burada da Allah'ın rahmeti vardır: emir geldiğinde, daha önce alınan faizin geri çıkarılmasını talep etmedi; müminlerden yalnızca kalanı bırakmalarını istedi — 'sizin olan ana paranız sizindir' (2:279) — bundan dönenler için bir kolaylık.",
      "Uzaklaşma yolu: Mali işlerinde faizli ürünleri gözden geçir, helal alternatifler ara ve gayrimüslim ülkelerde konut kredisi gibi gerçekten zor durumlar için yetkili âlimlere danış. Faizi bırakmak zor mali kararlar gerektirebilir, ama canın esenliği geçici bir kazançtan çok daha değerlidir — ve Allah, kendisinden korkana hiç ummadığı yerden rızık vereceğini vaad eder.",
    ],
    quran: [
      {
        excerpt:
          "Ey iman edenler, Allah'tan korkun ve eğer müminseniz kalan faizi bırakın. Eğer yapmazsanız, Allah ve Elçisi'nden bir savaş ilanı bilin. Eğer tevbe ederseniz, ana paranız sizindir — ne zulmedersiniz ne de zulme uğrarsınız.",
      },
      { excerpt: "Allah faizi mahveder, sadakaları ise artırır." },
    ],
    actions: [
      "Mali işlerinde faizli ürünleri gözden geçir.",
      "Konut kredisi ve borçlar için yetkili bir âlime danış.",
    ],
    appLinks: [{ label: "Zekât rehberi" }],
  },
  {
    title: "Yalan Yere Şahitlik",
    summary: "Yeminle yalan söylemek ya da yalan şahitlik yapmak — adaleti yok eder.",
    body: [
      "Tanım: Yalan yere şahitlik (şehâdetü'z-zûr), gerçek olmayan bir şeye tanıklık etmektir — ve daha geniş anlamda, yeminle yalan söylemek, uydurma suçlamalar yapmak ya da adalet buna bağlıyken doğru tanıklığı gizlemektir.",
      "Neden bu kadar ağır: Bu, adaletin gerçekleştiği aracın ta kendisini bozar. Yalancı bir şahit masum birini felakete sürükleyebilir, hak sahibini mülkünden mahrum bırakabilir ya da bir zalimi serbest bırakabilir — dolayısıyla yalan asla yalnızca yalancıyla sınırlı kalmaz; gerçek insanları ve tüm adalet sistemini yaralar. Nebi ﷺ bunu en büyük günahlar arasında saymış ve bir rivayette buna karşı uyarısını, ashabı onun için susmasını dileyecek kadar tekrarlamıştır.",
      "Dille ilişkisi: Yalan yere şahitlik, dilin daha geniş günahlarının en keskin ucudur. Söz söylemek ucuz olduğu için bu günaha tehlikeli derecede kolay düşülür — bir imza, bir abartma, kolay bir sessizlik — ve yine de Kıyamet gününde ağırlığı çok büyüktür; o gün insanların organları ve dilleri kendi aleyhlerine gerçeği söyleyecektir.",
      "Uzaklaşma yolu: Pahalıya patlasa ya da kendi menfaatine aykırı olsa bile doğrulukta sebat et, şahitliğini bir yalan için verme ve gerektiğinde adaletli tanıklıkla konuş. Yalan yere şahitlik yapan kişi, mümkünse yalanı geri alarak, zararı telafi edip mağdurun haklarını iade etmeye çalışarak ve gerçek bir pişmanlıkla Allah'a dönerek tevbe eder.",
    ],
    quran: [
      {
        excerpt:
          "Ve onlar ki yalan yere şahitlik etmezler; boş sözlerin yanından geçerken vakarla geçerler.",
      },
      { excerpt: "Öyleyse putların pisliğinden ve yalan sözden kaçının." },
    ],
    hadith: [
      {
        excerpt:
          "Size en büyük günahları haber vereyim mi? Allah'a ortak koşmak, ana-babaya isyan etmek — ve yalan yere şahitlik etmek, yalan yere şahitlik etmek.",
      },
    ],
    appLinks: [{ label: "Dil günahları" }],
  },
  {
    title: "Sihir",
    summary: "Büyü, büyücülere gitmek ve gayb ritüelleri — büyük biçimlerinde küfürdür.",
    body: [
      "Tanım: Sihir (büyü), yasak yollar kullanmaktır — çoğunlukla şeytanlara güvenmeye ya da gayb üzerinde güç iddiasına dayanır — insanları ya da olayları etkilemek için. Bunu yapmak, öğrenmek, başkalarından talep etmek ve iddia edenleri doğrulamak, hepsi bu günaha girer.",
      "Neden bu kadar ağır: Sihirin büyük kısmı, şeytanlara yakınlaşma ya da Kur'an'ı küçümseme gibi küfür fiilleri olmadan gerçekleşmez; işte bu yüzden Kur'an onun bilgisini küfre bağlar. Süleyman aleyhisselam döneminde öğrenilen büyüyü anlatırken, Allah şeytanların ve iki meleğin bunu yalnızca bir sınav olarak öğrettiğini, 'sakın küfretme' diye uyardıklarını bildirir (2:102). İnanç tehlikesinin ötesinde, sihir gerçek insanlara zarar verir — eşler arasına nifak sokmak, korku yaymak ve çaresizleri sömürmek.",
      "İlgili ritüeller: Aynı uyarı, kehanete (falcılık), yıldız falını gaybın kesin bilgisi saymaya ve şirk içeren muska ve tılsımlara kadar uzanır. Gizli geleceğin bilgisi yalnızca Allah'a aittir ve onu iddia edenlere başvurmak, tevhidi kökünden zayıflatır.",
      "Uzaklaşma yolu: Bu ritüellere bulaşmış biri için tevbe, bunları tamamen bırakmak, yasak nesneleri yok etmek, bu işi yapanlarla ilişkiyi kesmek ve yalnızca Allah'a saf tevhit ve tevekkülü yenilemek anlamına gelir. Korunma imanda, günlük zikirlerde ve Allah'a sığınmadadır — ve O'nun mağfireti gerçekten dönen herkese açıktır.",
    ],
    quran: [
      {
        excerpt:
          "Ve onlar, Süleyman'ın mülkü döneminde şeytanların okuduklarına uydular… kendilerine zarar veren ve fayda vermeyen şeyi öğreniyorlardı.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim bir kâhine gelir ve onun söylediğini doğrularsa, Muhammed'e ﷺ indirileni inkâr etmiş olur.",
      },
    ],
    appLinks: [{ label: "Akide — tevhid" }],
  },
  {
    title: "Yetim Malını Yemek",
    summary: "Yetimlerin malını haksız yere almak ya da zayi etmek.",
    body: [
      "Tanım: Bu günah, yetimlerin — babası vefat etmiş ve kendi çıkarlarını koruyamayan çocukların — malını almak, zayi etmek ya da kötüye kullanmaktır. Vasi bu malı bir emanet (emânet) olarak tutar, asla bir mülk olarak değil.",
      "Neden bu kadar ağır: Bu, kutsal bir emanete ihanet ile en çaresiz kişiye zulmü bir araya getirir. Kur'an'ın tasviri serttir: yetimlerin malını haksız yere yiyenler 'karınlarına yalnızca ateş doldururlar' (4:10); bir anlık açgözlülüğü kendi üzerlerine dayattıkları bir cezaya çevirirler. Konuşacak kimsesi olmayanı sömürmek, adaletsizliğin en kötü biçimlerindendir; işte bu yüzden uyarı bu kadar keskindir — ve keskin olduğu için vasileri bundan çevirmede bu kadar merhametlidir.",
      "Bu nelere dahildir: Yalnızca açık hırsızlık değil, ince biçimler de — yetimin malını kendi malıyla karıştırıp sınırı bulanıklaştırmak, yetim reşit olduğunda malını iade etmede gecikmek ya da onu hak olmadan ticarete sokmak ya da harcamak. Allah bunun tam tersini emreder: 'Yetimlere mallarını verin ve kötüyü iyiyle değiştirmeyin' (4:2).",
      "Uzaklaşma yolu: Yetimlerin malını özenle koru, ayrı ve hesaplı tut, reşit olur olmaz tam olarak teslim et ve — kusuru olan için — hak edileni uygun bir fazlalıkla geri vererek ve mağdurlardan özür dileyerek tevbe et. Malın ya da soyun hiçbir işe yaramayacağı o günde, böyle bir emaneti iade etmek başlı başına değerli bir iyiliktir.",
    ],
    quran: [
      {
        excerpt: "Yetimlerin malını haksız yere yiyenler — karınlarına yalnızca ateş doldururlar.",
      },
      {
        excerpt:
          "Yetimlere mallarını verin ve kötüyü iyiyle değiştirmeyin, mallarını kendi mallarınızla karıştırıp yemeyin.",
      },
    ],
    appLinks: [{ label: "Başkalarının haklarını ihlal etmek" }],
  },
  {
    title: "Ana-Babaya İsyan",
    summary: "Ukûk — şirkten sonra en büyük günahlardan.",
    body: [
      "Tanım: Ukûku'l-vâlideyn, ana-babaya karşı ağır bir isyan ve kötü davranıştır — onlara acı vermek, onlara küçümseyerek davranmak, ihtiyaçlarında onları ihmal etmek ya da söz ve davranışla onları incitmek. Bu, İslam'ın emrettiği itaatkâr şefkat olan birru'l-vâlideyn'in tam zıddıdır.",
      "Neden bu kadar ağır: Ayet ayet Allah, kendisine ibadet emrini ana-babaya iyilik emriyle birlikte anar, mesela 'Allah'a ibadet edin… ve ana-babaya iyilik edin' (4:36) — onların hakkını kendi hakkının hemen ardına koyarak. Ana-baba, Allah'tan sonra, insanın varlığının ve büyümesinin en yakın kaynağıdır; işte bu yüzden onlara nankörlük derinlere işleyen bir nankörlüktür. Nebi ﷺ onlara kötü davranmayı, şirkten hemen sonra en büyük günahlar arasında saymıştır.",
      "Önemli bir denge: İtaat, Allah'a isyanda ana-babaya itaat anlamına gelmez — Yaratıcı'ya isyanda hiçbir yaratılmışa itaat yoktur. Ama reddetmek gerektiğinde bile, bu yumuşaklık, saygı ve sürekli şefkatle yapılmalıdır. Kur'an, en küçük bir rahatsızlık ifadesini bile yasaklar: 'Onlara öf bile deme' (17:23).",
      "Dönüş yolu: Buradaki rahmet, ana-babanın çoğu zaman hâlâ erişilebilir olmasıdır. Kusuru olan biri için tevbe çoğunlukla pratiktir — şefkati yeniden başlatmak, onlardan özür dilemek, onlara hizmet etmek ve özellikle hayattayken onlar için dua etmek. Ve eğer bir baba ya da anne vefat etmişse, itaat onlar için dua etmek, onlar adına sadaka vermek ve onların akraba ve dostlarına saygı göstermekle devam eder.",
    ],
    quran: [
      {
        excerpt:
          "Rabbin, kendisinden başkasına ibadet etmemenizi ve ana-babaya iyilik etmenizi emretti. Onlara öf bile deme, onları azarlama; onlara güzel söz söyle.",
      },
      {
        excerpt: "Allah'a ibadet edin ve O'na hiçbir şeyi ortak koşmayın; ana-babaya iyilik edin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Size en büyük günahları haber vereyim mi? Allah'a ortak koşmak ve ana-babaya isyan etmek.",
      },
    ],
    actions: ["Bu hafta ana-babanı güzel bir sözle ara ya da ziyaret et."],
    appLinks: [{ label: "Başkalarının haklarını ihlal etmek" }],
  },
  {
    title: "Hırsızlık",
    summary: "Başkalarının malını haksız yere almak — güveni ihlal eder ve ceza gerektirir.",
    body: [
      "Tanım: Hırsızlık (sirkat), başkalarının malını ya da mülkünü hak olmadan almaktır — gizlice, hıyanetle, hile ile ya da hakkı olmayan bir şeyi herhangi gizli bir yolla ele geçirerek.",
      "Neden bu kadar ağır: Hem kul hakkını hem de toplu yaşamın dayandığı güveni ihlal eder. Ciddiyeti, Kur'an'ın uygun durumlar için belirttiği cezada (5:38) görülür — sıkı şartlarla ve yüksek şahitlik standartlarıyla sınırlı bir ceza; bu şiddet öncelikle insanların malını koruyan güçlü bir uyarı olarak işlev görür. İslam'ın amacı, insanların eşyalarıyla güvende hissettiği bir toplumdur.",
      "Modern biçimleri: Hırsızlık yalnızca bir eve girmekle sınırlı değildir. İşverenden çalmak, ticarette hile yapmak, işçilerin ücretini geciktirmek, dijital korsanlık, intihal ve meşru olarak kendine ait olmayan bir şeyden faydalanmak da bunu kapsar. İnsanlardan gizli olan hiçbir şey, her gizli almayı gören Allah'tan gizli değildir.",
      "Dönüş yolu: Bunda bir insan hakkı söz konusu olduğu için, tevbe Allah'a duyulan pişmanlıktan daha fazlasını gerektirir. Çalınan şeyin kendisi ya da değeri, hak sahibi mal sahibine iade edilmeli ve mümkünse ondan özür dilenmelidir; sahip bulunamazsa âlimler bu tutarın onun adına sadaka olarak verilmesini tavsiye eder. Bu şekilde ödendiğinde, hırsızlık da dönen kulu seven Zat tarafından tamamen bağışlanır.",
    ],
    quran: [
      {
        excerpt:
          "Hırsız erkek ve hırsız kadının ellerini kesin, kazandıklarına karşılık — Allah'tan bir ceza.",
      },
    ],
    actions: ["Çalınan eşyaları ya da değerlerini geri ver; mağdurlardan özür dile."],
    appLinks: [{ label: "Tevbe" }],
  },
  {
    title: "Sarhoş Edici Maddeler",
    summary:
      "Alkol ve sarhoş edici maddeler — Kur'an'da aşamalı ve kesin olarak haram kılınmıştır.",
    body: [
      "Tanım: Hamr, aklı örten her sarhoş edici şeydir — şarap ve her tür içki, ve Nebi'nin ﷺ kendi ilkesine göre, biçimi ya da adı ne olursa olsun her sarhoş edici madde. 'Her sarhoş edici hamrdır, her hamr da haramdır.'",
      "Neden bu kadar ağır: Akıl, insanın Allah'ı tanıdığı, doğruyu yanlıştan ayırt ettiği ve her başka sorumluluğu koruduğu güçtür. Sarhoş edici maddeler tam olarak bunu çökertir; işte bu yüzden Kur'an bunları putlar ve kumarla birlikte 'şeytanın işinden bir pislik' olarak nitelendirir ve 'onlardan kaçının' diye emreder (5:90). Bireyin ötesinde, sağlığı, aileleri ve güvenliği tahrip eder ve aklı başında birinin asla yaklaşmayacağı günahların kapısını açar.",
      "Haram kılınmasındaki hikmet: Allah, hamr'ı tek bir ani darbeyle değil, aşamalı olarak haram kıldı; erken toplumu derinden yerleşmiş bir alışkanlıktan yumuşaklıkla vazgeçirdi. Bu tedricîlik bizzat bir rahmet dersidir — ve bugün bunu bırakmaya çalışan herkes için bir umut örneğidir.",
      "Şefkatle dönüş yolu: Bağımlı olanlara hor görmekle değil, yardımla yaklaşılmalıdır. Tevbe, maddeyi bırakmaya karar vermek, onu ve onu tetikleyen şeyleri hayatından çıkarmak, utanmadan yardım ve tedavi aramak ve o boşluğu iyi arkadaşlıkla, zikirle ve ibadetle doldurmak anlamına gelir. Allah'ın kapısı açıktır ve bağımlılıktan uzaklaşan her içten adım, O'nun hoş karşıladığı bir adımdır.",
    ],
    quran: [
      {
        excerpt:
          "Ey iman edenler, şarap, kumar, dikili taşlar (putlar) ve fal okları şeytanın işinden birer pisliktir — onlardan kaçının.",
      },
    ],
    hadith: [
      {
        excerpt: "Her sarhoş edici hamrdır, her hamr da haramdır.",
      },
    ],
    actions: ["Gerekirse yardım al; alışkanlığın yerine zikir ve iyi arkadaşlık koy."],
    appLinks: [{ label: "Günlük zikirler" }],
  },
];

export const JAHANNAM_NAMES_TR: DeepPartial<JahannamNameEntry>[] = [
  {
    name: "Cehennem",
    transliteration: "Cehennem",
    meaning: "Ateş — cehennem için Kur'an'da en sık geçen isim.",
    quran: {
      excerpt: "Yakıtı insanlar ve taşlar olan, kâfirler için hazırlanmış ateşten sakının.",
    },
    context: "Kur'an boyunca imanı reddedip kötülükte ısrar edenler için azap yurdu olarak geçer.",
    tafsirNote:
      "İbn Kesir, Cehennem'in uyarı ve akıbet olarak hazırlanmış ateşin kapsayıcı ismi olduğunu belirtir.",
    scholarlyNote:
      "Bazı âlimler Cehennem'in cehennemin tamamı mı yoksa belirli bir derece mi olduğunu tartışır — görüşler farklıdır.",
  },
  {
    name: "Cahim",
    transliteration: "Cahim",
    meaning: "Alevlenen ateş — yoğun, kızgın sıcaklık.",
    quran: {
      excerpt: "Siz ve Allah'tan başka taptıklarınız, Cehennem'in yakıtısınız — ona gireceksiniz.",
    },
    context: "Allah'a ortak koşanlar için hazırlanan ateşin şiddetini tasvir eder.",
    tafsirNote:
      "Taberî, Cahim'i hiçbir şey bırakmayan, közlenmiş, alevli bir ateşle ilişkilendirir.",
  },
  {
    name: "Sakar",
    transliteration: "Sakar",
    meaning: "Yakıp kavuran ya da hiçbir şey bırakmayan — şiddetli sıcaklık.",
    quran: {
      excerpt: "Onu Sakar'a sokacağım. Sakar'ın ne olduğunu sen ne bilirsin?",
    },
    context: "Sûretü'l-Müddessir'de vahye sırt çeviren kişi hakkında zikredilir.",
    tafsirNote:
      "Klasik tefsir, Sakar'ı şiddetle yakan bir cehennem derecesi olarak tasvir eder; ayrıntılarda âlimler farklılık gösterir.",
    scholarlyNote:
      "Sakar'ın ayrı bir derece mi yoksa cehennemin tamamının bir ismi mi olduğu tefsirde tartışılır — hiçbir tek metinde açıkça belirtilmez.",
  },
  {
    name: "Sair",
    transliteration: "Sair",
    meaning: "Alevlenen — közlenmiş ateş.",
    quran: {
      excerpt: "Onlar Sair'de olacaklar — alevlenen ateşte.",
    },
    context: "Yetimin malını haksız yere yiyenler için bir uyarı.",
    tafsirNote: "Kökü yakma ve közlenme anlamı verir — etkin, yok edici bir ateşe vurgu.",
  },
  {
    name: "Hutame",
    transliteration: "Hutame",
    meaning: "Ezici — kıran ve paramparça eden.",
    quran: {
      excerpt: "O mutlaka Hutame'ye atılacaktır. Hutame'nin ne olduğunu sen ne bilirsin?",
    },
    context:
      "Gıybet eden ve mal biriktirip bunun kendisini sonsuza dek yaşatacağını sanan kişinin cezası.",
    tafsirNote:
      "İbn Kesir, Hutame'nin ezip yok ettiğini belirtir — Allah'ın tutuşturduğu bir ateş.",
  },
  {
    name: "Haviye",
    transliteration: "Haviye",
    meaning: "Uçurum ya da çukur — derin bir düşüş.",
    quran: {
      excerpt: "Tartıları hafif gelen kimsenin ise anası (varacağı yer) Haviye'dir.",
    },
    context: "İyilikleri Kıyamet gününde çok hafif kalanların varış yeri.",
    tafsirNote:
      "Ateşte derin bir çukur olarak tasvir edilir; Taberî onun derinliği ve şiddeti hakkında görüşler aktarır.",
    scholarlyNote:
      "Bazı tefsirler Haviye'yi belirli bir derece olarak sayar — bunu âlimsel bir yorum olarak aktarın.",
  },
  {
    name: "Leza",
    transliteration: "Leza",
    meaning: "Alev — kavurucu ateş.",
    quran: {
      excerpt: "Hayır! Şüphesiz o, alevlenen bir ateştir (Leza).",
    },
    context: "Sûretü'l-Meâric — Kıyameti inkâr edenler için bir uyarı.",
    tafsirNote: "Yakan ve kavuran bir alevle ilişkilidir — Leza etkin alevlenmeye vurgu yapar.",
  },
];

export const JAHANNAM_GATES_TR: DeepPartial<JahannamGateEntry>[] = [
  {
    label: "Birinci kapı",
    quranNote:
      "Allah, Cehennem'in yedi kapısı olduğunu belirtir; her kapı için girenlerden belirlenmiş bir pay vardır (15:44).",
    scholarlyNote:
      "Bazı sonraki tefsirler kapıları günahkâr türleriyle ilişkilendirir. Bu atıflar erken kaynaklarda tutarlı değildir — yorum olarak sunun.",
  },
  {
    label: "İkinci kapı",
    quranNote: "Kur'an genel olarak yedi kapıyı doğrular; açık vahiyde her kapıya isim vermez.",
    scholarlyNote: "İbn Kesir, bu bölüşmenin Allah'ın hikmeti ve adaletinden olduğunu belirtir.",
  },
  {
    label: "Üçüncü kapı",
    quranNote:
      "Yedi kapı — açık bir metin gerçeği. Her kapının sakinlerinin ayrıntısı büyük ölçüde âlimsel tartışmadır.",
  },
  {
    label: "Dördüncü kapı",
    quranNote: "Ayet orantılı bölüşmeyi vurgular — her kapının kendi belirlenmiş payı vardır.",
  },
  {
    label: "Beşinci kapı",
    quranNote:
      "Müminler, tevbe yoluyla bu kapılara götüren yollardan kaçınmaları için uyarılmıştır.",
  },
  {
    label: "Altıncı kapı",
    quranNote: "Cehennem hazırdır — uyarı gerçektir. Korunma iman ve salih amelledir.",
  },
  {
    label: "Yedinci kapı",
    quranNote:
      "Yedi kapı, tek bir ateş — günahkârların ilahî hikmetle nasıl gruplandırıldığı çeşitliliğiyle birlikte uyarının birliği.",
    scholarlyNote:
      "Belirli bir âlim kaynağına atıf yapılmadan, belirli bir günahın belirli bir kapıya atfedilmesini nebevî bir gerçek olarak öğretmeyin.",
  },
];

export const JAHANNAM_VERSES_TR: DeepPartial<JahannamVerseEntry>[] = [
  {
    excerpt: "Kâfirler için hazırlanmış Ateş'ten sakının.",
    context: "Müminlere hitap — itaate iten bir korku olarak.",
    tafsirSummary: "İbn Kesir: Elçiye itaatle birleştirilmiş bir takva çağrısı.",
  },
  {
    excerpt: "Allah'ın rahmetinden ümidinizi kesmeyin. Şüphesiz Allah bütün günahları bağışlar.",
    context: "Günahlarının çok büyük olduğundan korkanları teselli etmek için indirilmiştir.",
    tafsirSummary: "Umudun temel ayeti — dönenler için rahmet geniştir.",
  },
  {
    excerpt: "Allah'a içtenlikle tevbe edin — umulur ki Rabbiniz kötülüklerinizi giderir.",
    context: "Aile ve ahlak konusunda rehberlik verildikten sonra müminlere bir emir.",
    tafsirSummary: "Tevbe-i nasûh — ardından günaha dönülmeyen içten tevbe.",
  },
  {
    excerpt: "Herkes için yaptıklarına göre dereceler vardır.",
    context: "İlahî adalet — mükâfat ve ceza amellerle orantılıdır.",
    tafsirSummary: "Dereceler hem Cennet'e hem de cehenneme uygulanır.",
  },
  {
    excerpt: "Allah insanlara hiçbir şekilde zulmetmez; fakat insanlar kendilerine zulmederler.",
    context: "İlahî hükmün tamamen adil olduğuna dair güvence.",
  },
  {
    excerpt: "Rabbimiz, bize her iki dünyada da iyilik ver ve bizi Ateş'in azabından koru.",
    context: "Dünyevî ve uhrevî iyiliği birleştirenlerin duası.",
    tafsirSummary: "Kur'an'da öğretilen nebevî dua — dünya ve ahiret dengesi.",
  },
  {
    excerpt: "Cehennem'in yedi kapısı vardır; her kapı için belirlenmiş bir pay vardır.",
    context: "İbrahim aleyhisselamın kendi kavmiyle tartışması bağlamında zikredilir.",
    tafsirSummary: "Yedi kapının açık zikri — bölüşmenin ayrıntısı ilahî hikmettir.",
  },
  {
    excerpt:
      "Tevbe eden, iman eden ve salih amel işleyenler hariç — Allah kötülüğü iyiliğe çevirecektir.",
    context: "Ağır günahların listesinden sonra bir istisna.",
    tafsirSummary: "Tevbe edenler için umut — ameller rahmetle değiştirilebilir.",
  },
  {
    excerpt: "Rablerini inkâr edenler için Cehennem azabı vardır — ne kötü bir varış yeri.",
    context: "Sûretü'l-Mülk — gaybın hatırlatılması.",
  },
  {
    excerpt: "Şüphesiz iyilikler kötülükleri giderir.",
    context: "Günün her iki ucunda namazı ikame etme emri.",
    tafsirSummary: "İstikrarlı ibadetin geçmiş sürçmeleri sildiğine dair bir teşvik.",
  },
  {
    excerpt: "Rabbimiz, günahlarımızı bağışla ve bizi Ateş'in azabından koru.",
    context: "Muttakilerin (Allah'tan korkanların) tasviri.",
  },
  {
    excerpt: "Tartıları hafif gelen kimsenin ise anası (varacağı yer) Haviye'dir.",
    context: "Sûretü'l-Kâria — amellerin tartılması.",
  },
];

export const JAHANNAM_HADITH_TR: DeepPartial<JahannamHadithEntry>[] = [
  {
    hadith: {
      excerpt:
        "Allah'tan üç kez Cenneti isteyen kimseye Cennet: Ey Allah'ım, onu Cennete koy, der. Üç kez Ateş'ten sığınma dileyen kimse için de Ateş: Ey Allah'ım, onu Ateş'ten koru, der.",
    },
    context: "Cennet ve Cehennemden sığınmak için düzenli dua etmeyi teşvik eder.",
  },
  {
    hadith: {
      excerpt:
        "Allah, kulunun tevbesinden, ıssız bir arazide kaybolan bineğini bulan kimseden daha çok memnun olur.",
    },
  },
  {
    hadith: {
      excerpt:
        "Sizden hiç kimse yalnızca ameliyle Cennete giremez — ben de giremem, ancak Allah beni rahmetiyle kuşatırsa başka.",
    },
    context: "Denge: amelde çaba göster ama güvenini rahmete bağla.",
  },
  {
    hadith: {
      excerpt:
        "Sizin bu ateşiniz, Cehennem ateşinin yetmiş parçasından biridir, her biri onun sıcaklığı kadar.",
    },
  },
  {
    hadith: {
      excerpt: "Bizimle onlar arasındaki ahit namazdır; onu terk eden küfre girmiştir.",
    },
    context: "Namazı ihmal etmenin ağırlığı — en büyük uyarılardan biri.",
  },
  {
    hadith: {
      excerpt:
        "Müflis, namaz, oruç ve zekâtla gelen ama sövmüş, iftira atmış, malını haksız yere yemiş ve kan dökmüş kişidir.",
    },
    context: "Kul hakları Kıyamet gününde amellerden önce ödenebilir.",
  },
  {
    hadith: {
      excerpt:
        "Allah gündüzün günahkârının tevbesini kabul etmek için geceleyin elini uzatır, gecenin günahkârının tevbesini kabul etmek için de gündüz elini uzatır.",
    },
  },
  {
    hadith: {
      excerpt: "Allah'a ve ahiret gününe iman eden ya hayır söylesin ya sussun.",
    },
    context: "Dilin korunması — günlük öz muhasebe.",
  },
];

export const JAHANNAM_REFLECTIONS_TR: DeepPartial<JahannamReflectionEntry>[] = [
  {
    question: "Bugün birine zulmettim mi — sözle, davranışla ya da ihmalle?",
    appLink: { label: "Günlük" },
  },
  {
    question: "Bugün Allah'tan mağfiret diledim mi — içtenlikle ve tekrar tekrar?",
    appLink: { label: "Zikirler ve istiğfar" },
  },
  {
    question: "Dilimi gıybet, yalan ve alaydan korudum mu?",
    appLink: { label: "Dil günahları" },
  },
  {
    question: "Namazı vaktinde ve huzur-i kalp ile kıldım mı?",
    appLink: { label: "Namaz takipçisi" },
  },
  {
    question: "Uzaklaştığım biriyle barışa doğru bir adım attım mı?",
    appLink: { label: "Başkalarının haklarını ihlal etmek" },
  },
  {
    question: "Bugün sadaka verdim mi ya da bir iyilik yaptım mı — küçük bile olsa?",
    appLink: { label: "Cennete giden yolculuk" },
  },
  {
    question: "Bugün Kur'an okudum mu ya da dinledim mi?",
    appLink: { label: "Kur'an" },
  },
];

export const JAHANNAM_REFERENCES_TR: DeepPartial<JahannamReferenceEntry>[] = [
  {
    title: "Kur'an",
    note: "İsimlerin, uyarıların, rahmetin ve tevbenin ana kaynağı. Çeviriler değişir; doğruluk için Arapçaya başvurun.",
  },
  {
    title: "Sahih el-Buhari ve Sahih Müslim",
    note: "Sahih derecesi verilen standart hadis derlemeleri, bu modülde alıntılanmıştır.",
  },
  {
    title: "Tefsir İbn Kesir",
    note: "Cehennemin isimleri ve başlıca uyarı ayetlerinin bağlamı için referans alınmıştır — âlimsel yorum.",
  },
  {
    title: "Tefsir Taberî",
    note: "Erken dönem kapsamlı tefsir — Cehennem üzerine klasik görüşleri anlamak için faydalıdır.",
  },
  {
    title: "Âlimlerin İhtilaf Ettiği Yerler",
    note: "Cehennemin kesin dereceleri, kapıların atıfları ve bazı isimlerin anlamları âlimler arasında tartışmalıdır — vahiyde her zaman açık değildir.",
  },
];

export const JAHANNAM_DUAS_TR: DeepPartial<JahannamDuaEntry>[] = [
  {
    context: "Her iki dünyada da iyilik ve Ateşten korunma dile — Kur'anî dua.",
  },
  {
    context: "Teşehhüdden sonra: Cennet ve Ateşten sığınma dile.",
  },
  {
    context: "Sabah zikirleri: kabir ve Ateş azabından sığınma.",
  },
];

export const JAHANNAM_REFUGE_DUA_TR: { translation: string } = {
  translation:
    "Allah'ım, senden Cehennem azabından, kabir azabından, hayatın ve ölümün fitnelerinden ve Mesih Deccal'in fitnesinin şerrinden sana sığınırım.",
};
