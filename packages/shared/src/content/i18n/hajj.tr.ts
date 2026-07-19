import type { PilgrimageChecklistItem } from "../../types/hajj-guide";
import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// TR overlay for Hajj & Umrah Learn topics + rite checklists.
// Index-aligned with English sources; untranslated entries fall back to English.
// Only human-readable text is translated — ids, routes, citations stay English.

export const HAJJ_GUIDE_TOPICS_TR: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Kabul edilmiş bir Hac'ın sevabı",
    summary: "Hac-ı mebrur günahları siler ve sevabı Cennet'tir.",
    body: [
      "Ebu Hureyre, Resûlullah ﷺ'in şöyle dediğini rivayet etmiştir: 'Kim Allah rızası için Hac yapar, cinsel ilişkide bulunmaz ve günah işlemezse, annesinin onu doğurduğu günkü hâliyle döner' (Sahih al-Bukhari 1521; Sahih Muslim 1350).",
      "Ayrıca şöyle buyurmuştur: 'Kabul edilmiş bir Hac'ın (Hac-ı mebrur) sevabı Cennet'ten başka bir şey değildir' (Sahih al-Bukhari 1773; Sahih Muslim 1349). Kabul, ihlas ve hac yolculuğunu fuhuş ve kötülükten uzak tutmaya bağlıdır — yalnızca dış görünüşteki adımları tamamlamak yeterli değildir.",
    ],
    hadith: [
      {
        excerpt:
          "Kim Allah rızası için Hac yapar, cinsel ilişkide bulunmaz ve günah işlemezse, annesinin onu doğurduğu günkü hâliyle döner.",
      },
      {
        excerpt:
          "Kim Allah rızası için Hac yapar, cinsel ilişkide bulunmaz ve günah işlemezse, annesinin onu doğurduğu günkü hâliyle döner.",
      },
      {
        excerpt: "Kabul edilmiş bir Hac'ın sevabı Cennet'ten başka bir şey değildir.",
      },
      {
        excerpt: "Kabul edilmiş bir Hac'ın sevabı Cennet'ten başka bir şey değildir.",
      },
    ],
    actions: [
      "Hac'ı yalnızca Allah için niyet edin — yolculuk boyunca dilinizi ve ahlakınızı koruyun.",
      "Uygulamadaki Hac kontrol listesini yalnızca bir hatırlatıcı olarak kullanın; kalbi kabul üzerinde tutun.",
    ],
    appLinks: [
      {
        label: "Hac ibadetleri kontrol listesi",
      },
    ],
  },
  {
    title: "Umre'nin fazileti",
    summary: "Umre'den Umre'ye aradaki günahlar silinir.",
    body: [
      "Ebu Hureyre, Peygamber ﷺ'in şöyle dediğini rivayet etmiştir: 'Umre yapmak, bir önceki Umre ile bu Umre arasında işlenen günahlara kefarettir; kabul edilmiş bir Hac'ın sevabı ise Cennet'ten başka bir şey değildir' (Sahih al-Bukhari 1773; Sahih Muslim 1349).",
      "Umre yılın herhangi bir zamanında yapılabilir. Hac'tan kısadır ancak yine de büyük bir ibadettir: ihram, tawaf, sa'i ve saçın kesilmesi veya tıraş edilmesi.",
    ],
    hadith: [
      {
        excerpt:
          "Umre yapmak, bir önceki Umre ile bu Umre arasında işlenen günahlara kefarettir; kabul edilmiş bir Hac'ın sevabı ise Cennet'ten başka bir şey değildir.",
      },
      {
        excerpt:
          "Umre yapmak, bir önceki Umre ile bu Umre arasında işlenen günahlara kefarettir; kabul edilmiş bir Hac'ın sevabı ise Cennet'ten başka bir şey değildir.",
      },
    ],
    actions: ["İbadetleri sırayla takip etmeye hazır olduğunuzda Umre kontrol listesini açın."],
    appLinks: [
      {
        label: "Umre ibadetleri kontrol listesi",
      },
    ],
  },
  {
    title: "Arafat Günü",
    summary: "Arafat'ta vakfe Hac'ın özüdür — aynı zamanda dua için büyük bir gündür.",
    body: [
      "Abdurrahman ibn Ya'mar, Peygamber ﷺ'in şöyle dediğini rivayet etmiştir: 'Hac, Arafat'tır' (Sunan Abi Dawud 1949; Jami' at-Tirmidhi 889). Arafat sınırları içinde vaktinde vakfe yapmayan, o yılın Hac'ını kaçırmış olur.",
      "Hacda olmayanlar için Arafat Günü'nde oruç tutmak kuvvetle tavsiye edilen bir ameldir: Ebu Katade, Arafat'ta oruç tutmanın geçen yılın ve gelecek yılın günahlarına kefaret olduğunu rivayet etmiştir (Sahih Muslim 1162). Hacılar ise günü duaya ayırmak için oruç tutmaz.",
    ],
    hadith: [
      {
        excerpt: "Hac, Arafat'tır.",
      },
      {
        excerpt: "Hac, Arafat'tır.",
      },
      {
        excerpt:
          "Arafat Günü'nde oruç tutmak, Allah'tan ümit ederim ki, önceki yılın ve sonraki yılın günahlarına kefarettir.",
      },
    ],
  },
  {
    title: "Hac — beşinci rükün",
    summary: "Gücü yeten her Müslümana hayatında bir kez farzdır.",
    body: [
      "Allah buyurur: \"İnsanlardan gücü yetenlerin Beyt'e hac etmesi Allah'a karşı bir haktır. Kim inkâr ederse, şüphesiz Allah âlemlerden müstağnidir\" (Qur'an 3:97).",
      'Çağrı bütün insanlara ilan edildi: "İnsanlara haccı ilan et; yaya ve her yorgun devenin üzerinde sana gelsinler; uzak yollardan gelsinler" (Qur\'an 22:27).',
      "İbn Ömer, Peygamber ﷺ'in İslam'ın beş esası üzerine kurulduğunu söylediğini rivayet etmiştir: şehadet, salah, zakat, Ramazan orucu ve gücü yetenler için Beyt'e Hac (Sahih al-Bukhari 8; Sahih Muslim 16). Alimler, şartlar sağlandığında hayatında bir kez farz olduğunda ittifak etmişlerdir; tekrarlamak ise nafile bir fazilettir.",
    ],
    quran: [
      {
        excerpt:
          "İnsanlardan gücü yetenlerin Beyt'e hac etmesi Allah'a karşı bir haktır — oraya gidecek bir yol bulabilenler için...",
      },
      {
        excerpt: "İnsanlara haccı ilan et; yaya ve her yorgun devenin üzerinde sana gelsinler...",
      },
    ],
    hadith: [
      {
        excerpt:
          "İslam beş esas üzerine kurulmuştur: Allah'tan başka ilah olmadığına ve Muhammed'in Allah'ın Resûlü olduğuna şehadet etmek, salah'ı ikame etmek, zakat vermek, Ramazan'ı oruçla geçirmek ve gücü yetenler için Beyt'e Hac.",
      },
      {
        excerpt:
          "İslam beş esas üzerine kurulmuştur... ve oraya gidecek bir yol bulabilenler için Beyt'e Hac.",
      },
    ],
  },
  {
    title: "Güç yetme (istita'ah)",
    summary: "Sağlık, helal mal ve güvenli yol — bunlar olmadan Hac henüz vacip değildir.",
    body: [
      "Qur'an 3:97'deki şart güç yetmedir (istita'ah). Klasik alimler bunu şöyle özetler: yolculuk için fiziksel sağlık, yolculuğu ve yokken bakmakla yükümlü olduklarının ihtiyaçlarını karşılayacak yeterli helal mal, ve güvenli, açık bir yol.",
      "Bu imkânlardan yoksun olan bu yıl günahkâr sayılmaz; gücü yetene kadar ertelemesi caizdir. Güç yetme duruma göre değerlendirilir — hastalık, ödenmesi gereken borç veya güvensiz yolculuk acil farziyeti kaldırabilir. Durumunuz belirsizse ehil bir alime danışın.",
    ],
    quran: [
      {
        excerpt: "...oraya gidecek bir yol bulabilenler için.",
      },
    ],
    actions: [
      "Rezervasyon yapmadan önce farz borçları ödeyin ve bakmakla yükümlü olduklarınızın geçimini ayarlayın.",
      "Paketleri yalnızca resmi kanallar üzerinden doğrulayın (Hazırlık konularına bakın).",
    ],
  },
  {
    title: "Kadının hac yolculuğu",
    summary:
      "Ekseriyet mahrem şart koşar; bazı sonraki görüşler güvenli güvenilir bir gruba izin verir.",
    body: [
      "İbn Abbas, Peygamber ﷺ'in bir kadının mahrem olmadan yolculuk etmemesi gerektiğini, bir erkeğin de mahrem bulunmadıkça kadının yanına girmemesi gerektiğini söylediğini rivayet etmiştir (Sahih al-Bukhari 1862; Sahih Muslim 1341). Birçok alim bunu Hac ve Umre yolculuğuna uygular.",
      "Bazı sonraki alimler — güvenlik, zaruret ve çağdaş yolculuğu göz önünde bulundurarak — mahrem bulunmadığında kadının farz Hac için güvenilir bir grupla yolculuk etmesine izin verir. Bu, tartışmalı bir fıkıh meselesi olmaya devam etmektedir.",
    ],
    hadith: [
      {
        excerpt:
          "Bir kadın mahrem olmadan yolculuk etmemelidir; bir erkek de mahrem yanında değilken kadının yanına girmemelidir.",
      },
      {
        excerpt:
          "Allah'a ve ahiret gününe iman eden bir kadının mahrem olmadan bir gece gündüz yolculuk etmesi caiz değildir.",
      },
    ],
    madhhabNote:
      "Ekseriyet, kadının hac yolculuğu için mahreme ihtiyaç duyduğunu savunur. Bazı sonraki alimler farz Hac için kadınların güvenli bir grupla yolculuk etmesine izin verir. Güvendiğiniz bir alime ve Hac otoritenizin düzenlemelerine uyun.",
  },
  {
    title: "Hac'ın üç türü",
    summary: "İfrad, Kıran ve Temettu — ihrama girmeden önce seçin.",
    body: [
      "İfrad: yalnızca Hac için ihrama girilir, o ihramda ayrı bir Umre yapılmaz ve ibadetleri birleştirmek nedeniyle kurban gerekmez.",
      "Kıran: Umre ve Hac'ı tek ihramda birleştirir, Hac tamamlanana kadar ihramda kalınır. Kurban (hady) gerekir.",
      "Temettu': Hac aylarında tam bir Umre yapılır, ihramdan çıkılır, ardından 8 Zilhicce'de Hac için yeniden ihrama girilir. Bugün çoğu hacı bunu yapar; bu da hady gerektirir.",
      "Allah, ibadetleri birleştirenler hakkında buyurur: \"...Kim Umre'den Hac'a geçerse, kolaylıkla bulunabilecek kurban hayvanı...\" ve bunu karşılayamayanlar Hac sırasında üç gün, döndüklerinde yedi gün oruç tutar (Qur'an 2:196).",
    ],
    quran: [
      {
        excerpt:
          "Hac ve Umre'yi Allah için tamamlayın... Kim Umre'den Hac'a geçerse, kolaylıkla bulunabilecek kurban hayvanı. Kim bulamazsa — Hac sırasında üç gün, döndükten sonra yedi gün oruç...",
      },
    ],
    actions: [
      "Mikat'a gelmeden önce grup liderinizle türünüze karar verin.",
      "Temettu' yapıyorsanız, Hac için yeniden ihrama girmeden önce Umre'yi tamamen tamamlayın.",
    ],
    appLinks: [
      {
        label: "Umre kontrol listesi",
      },
      {
        label: "Hac kontrol listesi",
      },
    ],
  },
  {
    title: "Beş mikat",
    summary: "Hac veya Umre için ihrama girmeden Mekke'ye doğru mikatı geçmeyin.",
    body: [
      "İbn Abbas, Peygamber ﷺ'in insanlar için mikatları belirlediğini rivayet etmiştir: Medine için Zülhuleyfe, Suriye için El-Cuhfe, Necid için Karnü'l-Menazil, Yemen için Yelamlam; Iraklılar için Dhat Irk. Bunların kendileri ve Hac veya Umre niyetiyle bunlara gelenler için geçerli olduğunu; bu yerlerin içinde oturanların ise Mekke halkının Mekke'den olduğu gibi yola çıktıkları yerden ihrama girmeleri gerektiğini söylemiştir (Sahih al-Bukhari 1524; Sahih Muslim 1181).",
      "Modern hava limanları ve deniz limanlarının karşılık gelen ihram noktaları veya ilan edilen prosedürleri vardır — sınırı ihramsız geçmemek için taşıyıcınızın ve Hac ve Umre Bakanlığı'nın rehberliğine uyun.",
    ],
    hadith: [
      {
        excerpt:
          "Resûlullah ﷺ Medine halkı için Zülhuleyfe'yi, Suriye halkı için El-Cuhfe'yi, Necid halkı için Karnü'l-Menazil'i, Yemen halkı için Yelamlam'ı belirledi... Bu mikatlar o yerlerdeki insanlar ve Hac veya Umre niyetiyle bunlara gelenler içindir...",
      },
      {
        excerpt:
          "Resûlullah ﷺ mikatları belirledi... Bu sınırların içinde oturan kimse yola çıktığı yerden ihrama girmelidir...",
      },
    ],
  },
  {
    title: "İhrama girme",
    summary: "Gusül, elbiseler, niyet ve telbiye kutsal hâli başlatır.",
    body: [
      "İhram, Hac veya Umre niyetiyle girilen kutsal hâldir. Peygamber ﷺ ihramdan önce gusül yapmaya teşvik etmiştir. Erkekler iki dikişsiz beyaz örtü giyer; kadınlar yüzü veya eldivenle elleri ihram elbisesi olarak örtmeden sıradan mütevazı elbiselerini giyer (niqab ve eldiven ayrıntıları fıkıhta tartışılır).",
      "Erkekler ihramdan önce vücuda koku sürebilir, ihrama girdikten sonra ihram elbiselerine değil (Sahih al-Bukhari 1539). Ardından niyet edilir ve telbiye başlatılır.",
      "Peygamber ﷺ'in öğrettiği telbiye şudur: \"Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni'mata laka wal-mulk, la sharika lak\" — Umre için tawaf başlayana kadar, Hac'ta ise bilinen uygulamaya göre Cemre-i Aqaba'ya taş atılana kadar devam edilir (Sahih al-Bukhari 1549; Sahih Muslim 1184).",
    ],
    hadith: [
      {
        excerpt: "Aişe dedi ki: Resûlullah ﷺ ihrama girmeden önce ihramı için koku sürerdim...",
      },
      {
        excerpt:
          "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni'mata laka wal-mulk, la sharika lak.",
      },
      {
        excerpt: "Peygamber ﷺ telbiye ile sesini yükseltti: Labbayk Allahumma labbayk...",
      },
    ],
    actions: [
      "Erkekler için en az iki takım ihram hazırlayın; kokusuz temizlik malzemelerini hazır bulundurun.",
      "Yolculuk öncesi telbiyeyi pratik edin ki yolda akıcı olsun.",
    ],
  },
  {
    title: "İhram yasakları",
    summary: "Mühremin kutsal hâlden çıkana kadar kaçınması gerekenler.",
    body: [
      "İhramdayken kaçının: erkekler için — dikişli/oturan elbiseler ve başı örtmek; koku; saç veya tırnak kesmek; karada avlanmak; evlenmek veya evliliği gerçekleştirmek; ve yakınlık. Kadınlar koku ve diğer ortak yasaklardan kaçınırken mütevazı elbiselerini korur.",
      "Bir yasağı ihlal etmek kefaret (fidyah) gerektirebilir — genellikle oruç, fakirlere yedirme veya kurban — yapılan şeye bağlı olarak. Mezhepler ayrıntıları farklı sınıflandırır. Yasaklara dikkatle uyun ve beklenmedik bir şey olursa ehil bir rehbere sorun.",
    ],
    actions: ["İhramdayken koku, tırnak makası ve makasları kolay ulaşılamayacak yerde tutun."],
    madhhabNote:
      "İhlaller ve kefaretleri listeleri mezhebe göre değişir. Bunu pratik bir uyarı listesi olarak değerlendirin, ardından ayrıntıları mezhebiniz veya Hac rehberinizle teyit edin.",
  },
  {
    title: "Umre — ihram ve telbiye",
    summary: "Mikat'ta veya öncesinde kutsal hâle girin, ardından Allah'ın çağrısına icabet edin.",
    body: [
      "Mikat'ta veya öncesinde, imkân varsa gusül yapın, ihram elbiselerini giyin, Umre niyetini edin ve telbiyeyi başlatın. Kutsal hâl bu niyetle başlar.",
      "Mekke'ye doğru yolculuk ederken tawaf'a başlayana kadar telbiyeyi sık sık tekrarlayın. Bu, yalnızca Allah'ın çağrısına icabet ettiğinizin ilanıdır.",
    ],
    actions: ["Her ibadeti tamamladıkça işaretlemek için Umre kontrol listesini kullanın."],
    appLinks: [
      {
        label: "Umre kontrol listesi",
      },
    ],
  },
  {
    title: "Kabe'nin tawaf'ı",
    summary: "Hacerü'l-Esved'den başlayarak saat yönünün tersine yedi tur.",
    body: [
      "Kabe'yi Hacerü'l-Esved köşesinden başlayıp bitirerek saat yönünün tersine yedi kez dolaşın. Kalabalıksa öpün, dokunun veya takbir ile ona işaret edin — başkalarına zarar vermeden Peygamber'in ﷺ uygulamasını takip edin.",
      "Erkekler ilk üç turda raml (hızlı adım) ve bu varış Umre tawaf'ında idtiba' (sağ omzu açık bırakma) yapar, bilinen Sünnet'e göre.",
      "Yemen Köşesi ile Hacerü'l-Esved arasında şunu söylemek tavsiye edilir: \"Rabbimiz, bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru\" (Qur'an 2:201).",
    ],
    quran: [
      {
        excerpt:
          "Rabbimiz, bize dünyada iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru.",
      },
    ],
  },
  {
    title: "İki rekat ve Zemzem",
    summary: "Mümkünse Makam-ı İbrahim'in arkasında namaz kılın, ardından Zemzem için.",
    body: [
      "Tawaf'tan sonra, yer varsa Makam-ı İbrahim'in arkasında iki rekat namaz kılın, kalabalıksa mescidin başka bir yerinde — Allah'ın sözüne bağlanarak: \"...Ey iman edenler, Makam-ı İbrahim'den bir namaz yeri edinin...\" (Qur'an 2:125).",
      "Ardından Zemzem suyu için. Câbir'in Peygamber'in ﷺ Hac'ını anlattığı rivayet tawaf'tan sonra Zemzem içmeyi içerir; Peygamber ﷺ Zemzem'in ne için içilirse onun için olduğunu söylemiştir (sonraki alimlerin derlediği sahih rivayetler; niyet ve duayı tavsiye edilen olarak değerlendirin).",
    ],
    quran: [
      {
        excerpt: "...Ey iman edenler, Makam-ı İbrahim'den bir namaz yeri edinin...",
      },
    ],
  },
  {
    title: "Safa ile Merve arasında sa'i",
    summary: "Hacer'in su arayışının anısına yedi gidiş-geliş.",
    body: [
      "Allah buyurur: \"Şüphesiz Safa ile Merve Allah'ın nişanelerindendir. Kim Beyt'e hac veya umre yaparsa, aralarında yürümesinde bir günah yoktur...\" (Qur'an 2:158).",
      "Safa'dan başlayarak Safa ile Merve arasında yedi kez yürüyün. Safa'da Kabe'ye yönelin, Peygamber ﷺ'in yaptığı gibi ellerinizi takbir ve dua için kaldırın. Erkekler yeşil işaretler arasında koşar.",
    ],
    quran: [
      {
        excerpt:
          "Şüphesiz Safa ile Merve Allah'ın nişanelerindendir. Kim Beyt'e hac veya umre yaparsa, aralarında yürümesinde bir günah yoktur...",
      },
    ],
  },
  {
    title: "Halq veya taqsir — Umre'yi tamamlama",
    summary:
      "Erkekler tıraş eder veya kısaltır; kadınlar bir parmak ucu kadar keser — ardından ihram kalkar.",
    body: [
      "Erkekler başı tıraş eder (halq) — Peygamber ﷺ üç kez dua etmiştir — veya eşit şekilde kısaltır (taqsir). Kadınlar saçlarını toplar ve yaklaşık bir parmak ucu kadar keser. Bununla Umre tamamlanır ve ihram yasakları kalkar.",
      "Abdullah ibn Ömer, Resûlullah ﷺ'in şöyle dediğini rivayet etmiştir: 'Allah'ım, başlarını tıraş edenlere merhamet et.' Dediler ki: 'Kısaltanlara da, ey Allah'ın Resûlü?' Dedi: 'Allah'ım, başlarını tıraş edenlere merhamet et.' Dediler ki: 'Kısaltanlara da, ey Allah'ın Resûlü?' Üçüncü kez dedi: 'Ve kısaltanlara da' (Sahih al-Bukhari 1727; Sahih Muslim 1301).",
    ],
    hadith: [
      {
        excerpt:
          "Allah'ım, başlarını tıraş edenlere merhamet et... Ve (üçüncü kez) kısaltanlara da.",
      },
      {
        excerpt:
          "Allah'ım, başlarını tıraş edenleri bağışla... sonra üçüncü kez dedi: ve saçlarını kısaltanları da.",
      },
    ],
  },
  {
    title: "8 Zilhicce — Terivye Günü",
    summary: "Hac için ihrama girin ve günü Mina'da geçirin.",
    body: [
      "Temettu' hacıları için: Hac niyetini edin ve Mekke'deki konutunuzdan yeniden ihrama girin, telbiyeyi yenileyin. İfrad ve Kıran hacıları zaten ihramdadır.",
      "Mina'ya gidin ve Öğle, İkindi, Akşam, Yatsı ve ertesi Sabah namazlarını, Câbir'in rivayet ettiği Veda Hacı'ndaki Peygamber'in ﷺ uygulamasına göre her biri kendi vaktinde iki rekata kısaltarak kılın (Sahih Muslim 1218). Günü ve geceyi ibadetle geçirin, Arafat'ı bekleyin.",
    ],
    hadith: [
      {
        excerpt:
          "Câbir'in Peygamber'in ﷺ Veda Hacı'nın uzun rivayeti — Mina'da kalış ve ibadetlerin sırası dahil.",
      },
    ],
    actions: ["8'inin sabahında Hac kontrol listesini açın."],
    appLinks: [
      {
        label: "Hac kontrol listesi",
      },
    ],
  },
  {
    title: "9 Zilhicce — Arafat Günü",
    summary: "Güneş batana kadar Arafat içinde kalın; ardından Müzdelife'ye gidin.",
    body: [
      "Öğleden sonra güneş batana kadar Arafat sınırı içinde dua, zikir ve tövbe ile kalın. Peygamber ﷺ \"Hac, Arafat'tır\" buyurmuştur (Sunan Abi Dawud 1949). Kıbleye yönelin, ellerinizi kaldırın ve Allah'a yalvarın — dua için en büyük zamanlardan biridir.",
      "Öğle ve İkindi'yi birleştirip Öğle vaktinde kısaltarak kılın (cem' takdim), ardından günün geri kalanını nafile namaz yerine duaya ayırın — Peygamber'in ﷺ uygulamasına göre (Sahih Muslim 1218).",
      "Güneş battıktan sonra sakin bir şekilde Müzdelife'ye gidin. Akşam ve Yatsı'yı birleştirin (Yatsı kısaltılmış), geceyi dinlenin ve taş atma için çakıl taşları toplayın. Sünnet'teki bilinen izinlere göre zayıflar ve kadınlar gece yarısından sonra Mina'ya gidebilir.",
    ],
    hadith: [
      {
        excerpt: "Hac, Arafat'tır.",
      },
      {
        excerpt:
          "Peygamber ﷺ Arafat'ta Öğle ve İkindi'yi birleştirdi, ardından güneş battıktan sonra Müzdelife'ye gitti...",
      },
    ],
  },
  {
    title: "10 Zilhicce — Nahr Günü",
    summary: "Taş atma, kurban, saç ve Tawaf al-Ifadah.",
    body: [
      "Mina'ya doğru dönün ve Cemre-i Aqaba'ya (büyük direk) yedi çakıl taşı atın, her atışta Allahu ekber deyin — Veda Hacı sırasındaki günün ilk ibadeti.",
      "Temettu' ve Kıran için gerekli kurbanı sunun (Qur'an 2:196) veya güvenilir bir kurum aracılığıyla ayarlayın. Et yenir ve fakirlere verilir.",
      "Tıraş edin (halq) veya kısaltın (taqsir); kadınlar bir parmak ucu kadar keser. Taş atma ve tıraş/kısaltmadan sonra birinci tahallül (tahallul awwal) uygulanır — çoğu ihram yasağı kalkar, yakınlık hariç.",
      "Hac'ın rüknü olan Tawaf al-Ifadah için Mekke'ye gidin — ve Temettu' hacıları için sa'i (varış tawaf'ıyla sa'i yapan İfrad/Kıran hacıları mezheplerinin hükmüne uyar). Bu, ihramdan tam çıkışı tamamlar.",
    ],
    quran: [
      {
        excerpt: "...Kim Umre'den Hac'a geçerse, kolaylıkla bulunabilecek kurban hayvanı...",
      },
    ],
    madhhabNote:
      "Nahr Günü ibadetlerinin sırası Sünnet'te esneklik vardır; mezhepler tam sırayı ve her Hac türü için sa'i ne zaman gerekli olduğunu farklı değerlendirir. Grup rehberinize uyun.",
  },
  {
    title: "11–13 Zilhicce — Teşrik Günleri",
    summary: "Mina'da geceler, üç Cemre'ye günlük taş atma, ardından veda tawaf'ı.",
    body: [
      "11, 12 (ve erken ayrılmıyorsanız 13) gecelerini Mina'da geçirin. Bunlar yeme, içme ve Allah'ı anma günleridir.",
      "Her öğleden sonra Öğle'den sonra sırayla üç direğe yedişer çakıl taşı atın — küçük, orta, büyük — her atışta takbir. Acele eden 12'de taş attıktan sonra ayrılabilir (Qur'an 2:203).",
      "Mekke'den ayrılmadan önce Tawaf al-Wada yapın ki Beyt ile son amel veda olsun. İbn Abbas, insanlara son ibadetlerinin Beyt'te olması emredildiğini, bunun adet gören kadın için hafifletildiğini rivayet etmiştir (Sahih al-Bukhari 1755; Sahih Muslim 1328).",
    ],
    quran: [
      {
        excerpt:
          "Allah'ı sayılı günlerde anın. Sonra kim iki günde acele ederse — günah yoktur; kim geciktirirse — günah yoktur — Allah'tan korkan için...",
      },
    ],
    hadith: [
      {
        excerpt:
          "İnsanlara son ibadetlerinin Kabe'nin veda tawaf'ı olması emredildi, adet gören kadınlar hariç.",
      },
      {
        excerpt:
          "İnsanlara son ibadetlerinin Beyt'te olması emredildi, ancak adet gören kadın için hafifletildi.",
      },
    ],
  },
  {
    title: "Rükünler ve vacipler",
    summary: "Kaçırılırsa Hac'ı geçersiz kılanlar ve kurbanla telafi edilenler.",
    body: [
      "Rükünler (arkan) Hac'ın özüdür. Bir rükün kaçırılırsa Hac geçersiz olur ve yalnızca kurbanla onarılamaz — yeniden yapılması gerekir. Ekseriyet genellikle şunları sayar: ihram (niyet), Arafat'ta vakfe, Tawaf al-Ifadah ve sa'i.",
      "Vacipler (wajibat) mikat'tan ihrama girmeyi, Müzdelife'de kalmayı, Cemre'lere taş atmayı, Teşrik gecelerini Mina'da geçirmeyi ve Veda Tawaf'ını içerir. Bir vacibi terk etmek Hac'ı geçersiz kılmaz ancak mezheplere göre dam (kurban) ile telafi edilir.",
    ],
    madhhabNote:
      "Tam arkan ve wajibat listeleri dört mezhep arasında farklılık gösterir. Özellikle kalabalık baskısı altında bir şey kaçırılırsa, mezhebiniz için ehil bir rehberle teyit edin.",
  },
  {
    title: "Adab ve ihlas",
    summary: "Dili ve uzuvları koruyun — kabul ahlaka bağlıdır.",
    body: [
      "Günahsız dönüş hadisi (Bukhari 1521; Muslim 1350), Hac'ın fuhuş (rafath), günah (fusuq) ve tartışmayla bozulduğunu açıkça gösterir. Sabır, yumuşaklık ve hacı kardeşlere yardım ibadetin parçasıdır.",
      "Telefonların ve boş sohbetin Arafat ve mescidi domine etmesine izin vermeyin. Tawaf'ta yol verin; Hacerü'l-Esved'e itmeyin. Kabul edilmiş Hac Cennet'in yoldaşıdır — boyunca mükemmel ahlak için çaba gösterin.",
    ],
    hadith: [
      {
        excerpt:
          "Kim Allah rızası için Hac yapar, cinsel ilişkide bulunmaz ve günah işlemezse, annesinin onu doğurduğu günkü hâliyle döner.",
      },
    ],
    actions: ["Günlük bir niyet belirleyin: kalabalığın üstünde bir iyilik ve bir samimi dua."],
  },
  {
    title: "Vize ve kayıt",
    summary: "Resmi kanalları kullanın — Nusuk ve ulusal Hac otoriteniz.",
    body: [
      "Nusuk (nusuk.sa), Suudi Arabistan'ın Hac ve Umre için resmi platformudur — vizeler, konaklama, ulaşım ve kayıtlı paketler. Resmi olmayan aracılar yaygın dolandırıcılık kaynağıdır.",
      "Her ülkeye yıllık Hac kotası verilir; çoğu hacı ulusal Hac otoritesi veya lisanslı bir acente aracılığıyla başvurur. Umre'nin kotası yoktur ve yılın büyük bölümünde onaylı kanallar aracılığıyla ayarlanabilir.",
    ],
    actions: [
      "Sezon açıldığında erken başvurun.",
      "Yalnızca Nusuk'ta listelenen acenteler veya ulusal otoriteniz aracılığıyla rezervasyon yapın.",
      "Para transfer etmeden önce ödeme kanallarını doğrulayın.",
    ],
  },
  {
    title: "Ne paketlemeli",
    summary: "İhram, kokusuz temizlik malzemeleri, belgeler ve yürüme konforu.",
    body: [
      "Erkekler: en az iki takım dikişsiz ihram elbisesi ve belgeler için kemer. Kadınlar: bol mütevazı elbise. Kolayca giyilebilen açık sandaletler; küçük sırt çantası ve su şişesi.",
      "Kokusuz sabun ve güneş kremi paketleyin — ihramda koku yasaktır. Pasaport, vize çıktısı, aşı kayıtları ve acil durum kişilerini ince bir kılıfta tutun. Kalabalıkta güç bankası ve yerel SIM veya eSIM yardımcı olur.",
    ],
    actions: [
      "Kontrol listesi: ihram ×2, sandalet, kokusuz temizlik malzemeleri, belge kılıfı, ilaç, güç bankası.",
      "Sıvı topları bandı taşıyın — hacılar çok yürür.",
    ],
  },
  {
    title: "Kutsal mekânlar bir bakışta",
    summary: "Mekke, Medine, Mina, Arafat ve Müzdelife — pratik notlar.",
    body: [
      "Mescid-i Haram Kabe'yi çevreler — tawaf ve sa'i yeri; yoğun kalabalık bekleyin. Medine'deki Mescid-i Nebevi Hac'ın parçası değildir ancak çoğu hacı ziyaret eder; Ravza girişi resmi uygulamalar aracılığıyla zamanlanır.",
      "Mina, 8 ve 11–13 Zilhicce geceleri için çadır kentidir. Arafat açık bir ovadır — 9'unda susuzluk ve gölge önemlidir. Müzdelife hacıların açık gökyüzü altında dinlendiği ve çakıl taşları topladığı yerdir — tesisler kasıtlı olarak minimaldir.",
    ],
    actions: ["Yolculuk öncesi Mina–Arafat–Müzdelife'nin basit bir haritasını inceleyin."],
  },
  {
    title: "Resmi kaynaklar",
    summary: "Nusuk, ulusal otoriteniz ve Visit Saudi.",
    body: [
      "Vizeler, paketler, Ravza izinleri ve kalabalık rehberliği için Nusuk ile başlayın. Kotayı ve sağlık kurallarını ülkenizin Hac bakanlığından öğrenin. Visit Saudi genel giriş ve seyahat uyarılarını yayınlar.",
      "Bir anlaşma olağandışı ucuz görünüyorsa veya bir aracı resmi kanallar dışında ödeme istiyorsa, ödeme yapmadan önce doğrudan bakanlık portalı ile doğrulayın.",
    ],
    actions: [
      "nusuk.sa ve ulusal Hac otoritesi sitenizi yer imlerine ekleyin.",
      "Grup liderinizden acil durum kişilerini kaydedin.",
    ],
  },
];

export const HAJJ_CHECKLIST_TR: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Hac için ihrama gir",
    hint: "Hac niyet et ve ihrama gir (temettu' için Mekke'den); telbiyeyi yenile.",
    day: "8 Zilhicce",
  },
  {
    title: "Mina'ya git",
    hint: "Mina'da Öğle'den Sabah'a kadar her namazı kendi vaktinde kısaltarak kıl.",
    location: "Mina",
    day: "8 Zilhicce",
  },
  {
    title: "Arafat'ta vakfe yap",
    hint: "Öğleden sonra güneş batana kadar Arafat içinde dua ve zikirle kal.",
    location: "Arafah",
    day: "9 Zilhicce",
  },
  {
    title: "Öğle ve İkindi'yi birleştir",
    hint: "Öğle ve İkindi'yi birleştirip Öğle vaktinde kısalt, ardından duaya odaklan.",
    location: "Arafah",
    day: "9 Zilhicce",
  },
  {
    title: "Müzdelife'ye git",
    hint: "Güneş battıktan sonra Akşam ve Yatsı'yı birleştir, dinlen ve çakıl taşları topla.",
    location: "Muzdalifah",
    day: "9 Zilhicce",
  },
  {
    title: "Cemre-i Aqaba'ya taş at",
    hint: "Büyük direğe yedi çakıl taşı at, her atışta takbir.",
    location: "Mina",
    day: "10 Zilhicce",
  },
  {
    title: "Kurban sun",
    hint: "Temettu' ve kıran için gerekli — kes veya güvenilir bir kurum aracılığıyla ayarla.",
    day: "10 Zilhicce",
  },
  {
    title: "Halq veya taqsir",
    hint: "Erkekler tıraş eder veya kısaltır; kadınlar bir parmak ucu kadar keser (birinci tahallül).",
    day: "10 Zilhicce",
  },
  {
    title: "Tawaf al-Ifadah",
    hint: "Tawaf al-Ifadah ve temettu' için sa'i yap — Hac'ın rüknü.",
    location: "Masjid al-Haram",
    day: "10 Zilhicce",
  },
  {
    title: "Mina'da gece kal",
    hint: "11, 12 (ve erken ayrılmıyorsan 13) gecelerini Mina'da geçir.",
    location: "Mina",
    day: "11–13 Zilhicce",
  },
  {
    title: "Üç Cemre'ye taş at",
    hint: "Her gün Öğle'den sonra küçük, orta, büyük — her birine yedişer.",
    location: "Mina",
    day: "11–13 Zilhicce",
  },
  {
    title: "Veda Tawaf'ı",
    hint: "Mekke'den ayrılmadan Tawaf al-Wada yap (adet gören kadınlar muaf).",
    location: "Masjid al-Haram",
    day: "Departure",
  },
];

export const UMRAH_CHECKLIST_TR: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "İhrama gir",
    hint: "Mikat'ta veya öncesinde: gusül, ihram elbiseleri, Umre niyeti, telbiye.",
    location: "Miqat",
  },
  {
    title: "Telbiyeyi oku",
    hint: "Tawaf'a başlayana kadar Labbayk… sık sık tekrarla.",
  },
  {
    title: "Kabe'nin tawaf'ı",
    hint: "Hacerü'l-Esved'den saat yönünün tersine yedi tur; erkekler: raml ve idtiba'.",
    location: "Masjid al-Haram",
  },
  {
    title: "İki rekat namaz kıl",
    hint: "Mümkünse Makam-ı İbrahim'in arkasında, ardından Zemzem için.",
    location: "Masjid al-Haram",
  },
  {
    title: "Safa ile Merve arasında sa'i",
    hint: "Safa'dan başlayarak yedi gidiş-geliş; erkekler yeşil işaretler arasında koşar.",
    location: "Masjid al-Haram",
  },
  {
    title: "Halq veya taqsir",
    hint: "Erkekler tıraş eder veya kısaltır; kadınlar bir parmak ucu kadar keser — Umre tamamlandı.",
  },
];
