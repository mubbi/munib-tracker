import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// tr overlay for janazah-guide. Index-aligned with JANAZAH_GUIDE_TOPICS in ../janazah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const JANAZAH_GUIDE_TOPICS_TR: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Toplumsal bir yükümlülük",
    summary: "Cenaze farz kifayedir; toplumun bunu yerine getirmesi gerekir.",
    body: [
      "Cenaze namazı (Cenaze namazı) toplumsal bir yükümlülüktür (farz-ı kifaye): Eğer cemaatin bir kısmı bunu kılarsa, geri kalanların farzı kalkar; eğer hiçbiri yapmazsa, herkes suçu paylaşır. Namazların ayırt edici bir şekli olan, rüku ve secde olmaksızın ayakta kılınır.",
      "Ebu Hureyre, Resûlullah'ın (s.a.v.) şöyle buyurduğunu bildirmiştir: 'Kim cenazeye namaz kılınıncaya kadar katılırsa bir kırat (ödül) alır, kim de defne kadar hazır bulunursa ona iki kırat verilir.' Kıratın ne olduğu soruldu ve şöyle dedi: 'İki büyük dağ gibi' (Sahih el-Buhari 1325; Sahih Muslim 945).",
      "Cenazeyi takip etmek, gücü yettiğince yıkanmaya ve defnedilmeye yardım etmek, ölü için dua etmek Müslümanın diğeri üzerindeki hakları arasındadır. Vücuda onurlu bir şekilde davranın ve israftan veya delilsiz uygulamalardan kaçının.",
    ],
    actions: [
      "Topluluğunuzda bir cenaze töreni duyurulduğunda hızlı bir şekilde yanıt verin.",
      "Namaza ve ibadete sosyal gösteriş için değil, Allah rızası için niyet edin.",
      "Saygılı bir şekilde yapabildiğiniz takdirde, ailenin pratik ihtiyaçlarına yardımcı olun.",
    ],
    hadith: [
      {
        excerpt:
          "Kim cenaze namazını kılıncaya kadar cenazede bulunursa bir kırat, kim de defnedilene kadar hazır bulunursa iki kırat vardır; her biri büyük bir dağ gibidir.",
      },
      {
        excerpt:
          "Kim imanla ve sevabını umarak bir Müslümanın cenazesine katılır ve namaz kılınıp defin tamamlanıncaya kadar kalırsa, iki kıratla döner...",
      },
    ],
  },
  {
    title: "Yıkama ve kefenleme",
    summary: "Ölen kişinin guslü ve basit bir kefen - israfsız haysiyet.",
    body: [
      "Ölen Müslümanlar (klasik hükümdeki savaş şehitleri hariç) arındırıcı bir yıkamayla yıkanır, ardından temiz beyaz bir bezle kefenlenirler. Ümmü Atiyye, Peygamber Efendimiz'in (s.a.v.) kızının yıkanması hakkında şöyle buyurduğunu bildirmiştir: 'Onu üç veya beş defa veya uygun görürseniz daha fazla su ve sidr ile yıkayın ve sonuncusuna kafur - veya biraz kafur koyun' (Sahih el-Buhari 1253).",
      "Aişe, Allah Resulü'nün (s.a.v.) aralarında ne gömlek ne de türban olmayan üç beyaz Yemen pamuklu giysisiyle kefenlendiğini bildirmiştir (Sahih el-Buhari 1264; Sahih Muslim 941). Sadelik sünnettir; Pahalı gösteriler kehanet örneğiyle çelişiyor.",
      "Kimin kimi yıkadığı, kadın ve erkek için kaç elbise olduğu gibi ayrıntılarda mezhep farklılıkları bulunmaktadır. Aileler, okulun uygulamalarını bilen bilgili bir yerel rehberi veya cenaze hizmetini takip etmelidir; bu genel bakış bir yıkama kılavuzu değildir.",
    ],
    actions: [
      "Mümkünse merhumla aynı cinsiyetten güvenilir kişileri görevlendirin.",
      "Kefeni basit ve temiz tutun; beyaz kumaş kehanet modelidir.",
      "Gereksiz yere vücudun fotoğrafını çekmekten veya açığa çıkarmaktan kaçının.",
    ],
    hadith: [
      {
        excerpt:
          "Onu üç, beş veya lüzum görürseniz daha fazla su ve sidr ile yıkayın ve son yıkamaya kafur veya biraz kafur koyun.",
      },
      {
        excerpt:
          "Allah Resulü ﷺ Yemen pamuklu üç beyaz elbiseyle kefenlendi; aralarında ne gömlek ne de türban vardı.",
      },
    ],
  },
  {
    title: "Ölen kişinin gözleri kapatıldığında",
    summary: "Ölüm anında söylenen bir peygamberlik duası.",
    body: [
      "Ümmü Seleme'nin bildirdiğine göre Rasulullah (s.a.v.) gözleri sabit olunca Ebu Seleme'nin yanına geldi. Bunları kapattı ve şöyle dedi: 'Ruh alındığında gözler onu takip eder' ve ev halkı ağladı. Daha sonra onlara sadece iyi olanı söylemeyi öğretti, çünkü melekler onların söylediklerine âmin derler ve Ebu Seleme için dua etti (Sahih Müslim 920).",
      "Aşağıdaki toplu Hisnul Muslim girişi, gözleri kapatırken kullanılan ifadeyi koruyor. Yumuşak konuşun, Peygamber Efendimiz (s.a.v.)'in yasakladığı şeyler için feryat etmekten kaçının ve dili güzel sözlerle ve istiğfarla meşgul edin.",
    ],
    actions: [
      "Gözlerinizi yavaşça kapatın ve gerçek duayı yapın.",
      "Aileye güzel konuşmasını hatırlatın.",
    ],
    hadith: [
      {
        excerpt:
          "Ebu Seleme'nin gözleri sabitlendiğinde, Peygamber Efendimiz (sav) onları kapattı ve ruh alındığında gözün onu takip ettiğini söyledi ve sonra ev halkına sadece iyi olanı konuşmayı öğretti.",
      },
    ],
  },
  {
    title: "Cenaze nasıl dua edilir",
    summary: "Dört tekbirle ayakta namaz - rükû veya secde yok.",
    body: [
      "Cenaze namazı ayakta kılınır. Rüku, secde, ezan ve kamet yoktur. Enes ve Semure'den gelen rivayetlere göre (bkz. Ebu Davud 3194 ve ilgili rivayetler) imam, ölen bir erkeğin başında veya bir kadın ölenin ortasında durur ve cemaat arkada sıralar halinde oluşur.",
      "Dua dört tekbirden oluşur. İlkinden sonra Fatiha suresi okunur (Buhari 1335). Daha sonra tekbirlerin ardından Peygamber Efendimiz'e salâvat ve merhum için dua edilir. Namaz teslim ile biter. Cabir, Peygamber Efendimiz'in (s.a.v.) Necaşi (Habeş kralı) için cenaze namazı kıldığını ve dört tekbir getirdiğini bildirdi (Sahih el-Buhari 1334).",
      "Tekbiri kaçıran geç kalanlar imamı takip etmeli ve kaçırdıkları şeyi okullarının yetişme kuralına göre tamamlamalıdır; emin olmadıkları takdirde imama veya yerel öğretmene danışmalıdır.",
    ],
    actions: [
      "Sıra halinde durun; rükû ve secde yapmayın.",
      "İmamla birlikte dört tekbir alın.",
      "Uygun tekbirden sonra merhum için samimi dua edin.",
    ],
    hadith: [
      {
        excerpt: "Peygamber Efendimiz Necaşi'nin cenaze namazını kıldı ve dört tekbir getirdi.",
      },
      {
        excerpt:
          "İbn Abbas cenaze namazı kıldı ve bunun sünnetten olduğunu söyleyerek Fatiha okudu.",
      },
    ],
  },
  {
    title: "Cenaze namazında okunacak dualar (yetişkin)",
    summary: "Merhum için otantik Hisnul Müslüman ifadeleri.",
    body: [
      "Tekbirlerden sonra cenazenin kalbi merhum için dua edilir; Allah'tan onları bağışlamasını, onlara merhamet etmesini ve onlara cennet vermesini diler. Hisnu'l-Müslim'de Peygamber Efendimiz (sav)'e ait pek çok sahih ifade muhafaza edilmektedir.",
      "Arapça, harf çevirisi ve anlamı ile okumak için aşağıdaki bağlantılı duayı açın. Birden fazla orijinal ifadeyi öğrenebilirsiniz; samimiyet uzunluktan daha önemlidir.",
    ],
    actions: [
      "En az bir orijinal Cenaze duasını ezberleyin.",
      "Toplantıya katıldığınızda ölen tüm Müslümanlar için genel dua yapın.",
    ],
  },
  {
    title: "Daha fazla cenaze namazı duası",
    summary: "Hisnul Muslim'den ek otantik ifadeler.",
    body: [
      "Hisnul Muslim, Peygamber Efendimiz (sav)'den öğretilen diğer cenaze namazı sözlerini muhafaza ediyor. Bunları dönüşümlü olarak kullanın veya topluluğunuzun en iyi bildiğini öğrenin.",
      "Ölen bir çocuk için özel dualar, Allah'tan çocuğu bir öncü yapmasını ve ebeveynler için bir ödül olarak saklanmasını ister - bir sonraki konuya bakın.",
    ],
  },
  {
    title: "Cenaze namazı duası #3",
    summary: "Ölen yetişkin için başka bir özgün ifade.",
    body: [
      "Cenaze namazı için başka bir Hisnul Müslim ifadesi. İmamınızın uygulamalarının elverdiği ölçüde, uygun tekbirden sonra okuyun.",
    ],
  },
  {
    title: "Cenaze namazı duası #4",
    summary: "Sünnet külliyatından dördüncü sahih ifade.",
    body: [
      "Hisnul Muslim bu ek cenaze namazı duasını da içerir. Her ifadeyi bir kerede toplamak yerine özgünlüğü ve içtenliği seçin.",
    ],
  },
  {
    title: "Ölen çocuk için dua",
    summary: "Ölen kişinin çocuk olması durumunda özel peygamberlik duaları.",
    body: [
      "Ölen kişi çocuk olduğunda, sahih dualar Allah'tan çocuğu anne-baba için saklı bir hazine, bir öncü ve kabul edilen bir şefaatçi kılmasını ister. Aşağıdaki Hisnul Muslim girişleri bu ifadeleri korumaktadır.",
      "Uydurulmuş ritüellerden uzak dururken, aileyi Allah'ın rahmetinden ümit ederek rahatlatın. Aynı dört tekbirli cenaze yapısı geçerlidir; değişen şey duanın içeriğidir.",
    ],
    actions: [
      "Uygun olduğunda çocuğa özel duaları kullanın.",
      "Kederli ebeveynleri varlık ve helal yardımla destekleyin.",
    ],
  },
  {
    title: "Çocuk cenaze duası #2",
    summary: "Ölen bir çocuk için ikinci Hisnul Müslüman ifadesi.",
    body: [
      "Bir çocuğun cenaze namazına ilişkin bir başka sahih ifade, Hisnül Müslim'de muhafaza edilmiştir.",
    ],
  },
  {
    title: "Cenaze ve mezar",
    summary: "Cenazeden sonra cenazeyi kıbleye doğru eğmek ve dua etmek.",
    body: [
      "Merhum, hazırlığın gerektirdiğinin ötesinde, vakarla ve gecikmeden, kıbleye dönük olarak toprağa gömülür. Peygamber Efendimiz (sav) şöyle buyurdu: 'Cenazeyi çabuk yapın...' (Sahih el-Buhari 1315 — cenazeyi hızlandırmak).",
      "Merhumun mezara yerleştirilmesi sırasında Hisnül Müslim'de sahih bir dua korunur. Cenazeden sonra Peygamber Efendimiz (sav) kabrin başında durur ve şöyle derdi: 'Kardeşin için bağışlanma dile ve ondan sabırlı olmasını iste, çünkü o şu anda sorgulanıyor' (Sünen Ebî Davud 3221 — Albani dahil daha sonraki birçok alim tarafından sahih olarak derecelendirilmiştir).",
      "Mezarların üzerine süslü yapılar yapılması, süs amacıyla sıvanması veya abartıyı teşvik eden yazılara karşı sahih rivayetlerde uyarılarda bulunulmaktadır. Yasaların ve yerel geleneklerin tanımlamaya izin verdiği durumlarda işareti basit tutun.",
    ],
    hadith: [
      {
        excerpt:
          "Cenazeyi çabuk yapın; eğer doğruysa, onu iyiliğe acele ediyorsunuz; aksi halde kötülüğü boynunuzdan atmış olursunuz.",
      },
      {
        excerpt:
          "Kardeşin için bağışlanma dile ve onun sabırlı olmasını iste, çünkü o şimdi sorguya çekiliyor.",
      },
    ],
  },
  {
    title: "Cenazeyi defnettikten sonra",
    summary: "Kabir başında sabretmek için dua.",
    body: [
      "Cenazeden sonra kısa bir süre ölü için bağışlanma dilemek ve metanet dilemek Peygamber Efendimiz'den (Ebu Davud 3221) sabittir. Aşağıdaki Hisnul Muslim ifadesi cenazeden sonra içindir.",
      "Sürekli hayırseverlik, dua ve ölen kişinin meşru vasiyetini yerine getirmek, Allah'ın izniyle - delilsiz yıllık törenler icat etmeden - onlara fayda sağlar.",
    ],
    actions: [
      "Defin ettikten sonra mezar başında dua edin.",
      "Merhum için özel dua ve sadaka vermeye devam edin.",
    ],
  },
  {
    title: "Kabirleri ziyaret etmek",
    summary: "Kabirleri ziyaret ederken peygamberlik selamı.",
    body: [
      "Kabir ziyareti ahiret hayatını hatırlatır. Büreyde'nin bildirdiğine göre Rasûlullah (s.a.v.) onlara mezarlığa çıktıklarında şunu söylemeyi öğretiyordu: Müminler ve Müslümanlar arasındaki meskenlerde yaşayanlara selam vermek, Allah'ın izniyle onlara katılacağımızı tasdik etmek ve bizim ve onlar için esenlik dilemek (Sahih Müslim 975; ayrıca İbn Mâce'deki ifadeler).",
      "Aşağıdaki Hisnul Müslim girişi bu selamlamayı koruyor. Ziyaretlerinizi feryat etmekten, ölülerden yardım istemekten veya delilsiz ritüellerden uzak tutun.",
    ],
    actions: [
      "Kabir ehline sahih sözlerle selam verin.",
      "Ölümü düşünün ve salih amelleri yenileyin.",
    ],
    hadith: [
      {
        excerpt:
          "Selam size ey mü'minler ve Müslümanlar arasındaki meskenlerin sakinleri. Allah'ın izniyle biz de aranıza katılacağız. Allah'tan bizim ve sizin için afiyet dileriz.",
      },
    ],
  },
  {
    title: "Hatırlatmalar ve yaygın hatalar",
    summary: "Feryat etmekten, gösteriyi geciktirmekten ve temelsiz ritüellerden kaçının.",
    body: [
      "Peygamber Efendimiz (s.a.v.) gözyaşı dökerek üzüntüye izin verirken ölüler için feryat etmeyi yasakladı. Abdullah ibn Ömer, Sa'd ibn Ubâde'nin bir cenazede ağladığını ve Peygamber Efendimiz'in (s.a.v.) Allah'ın göz yaşı veya kalbin acısından değil, bunun için cezalandırdığını açıkladığını ve dilini işaret ettiğini bildirmiştir (Sahih el-Buhari 1304).",
      "Prestij toplantıları için cenazeyi geciktirmeyin ve fakirleri ihmal ederek kefen ve ziyafet için cömertçe harcamayın. Cenazelere atfedilen yenilikleri asılsız olarak okumayın veya uygulamayın. Taziye, sessiz dua ve aileye pratik yardım sünnet yoludur.",
      "Kadınların duaya ve cenaze törenine katılımı, okullar ve çağlar arasında farklı ayrıntılarla ele alınır; Hem şefkate hem de kehanet sınırlarına saygı duyan güvenilir yerel rehberliği takip edin.",
    ],
    disclaimer:
      "Eğitsel genel bakış - bir cenaze yönetmeni el kitabı veya bir fetva değil. Yıkama, kefenleme ve mezarlık kurallarına ilişkin yerel okul uygulamalarının nitelikli kişiler tarafından doğrulanması gerekir.",
    actions: [
      "Feryat etmeden veya yasak konuşmadan üzülün.",
      "Onurlu bir cenaze törenini hızlandırın.",
      "Aileye israf etmeden, yiyecek ve işlerde yardım edin.",
    ],
    hadith: [
      {
        excerpt:
          "Allah gözün yaşıyla, kalbin acısıyla cezalandırmaz ama bunun için ceza verir veya merhamet eder - ve diline işaret etti.",
      },
    ],
  },
  // --- v2 appended topics (keep index-aligned with English) ---
  {
    title: "Tekbir tekbir — namazın adımları",
    summary: "Dört tekbirin ve aralarında okunanların pratik bir kontrol listesi.",
    body: [
      "Birinci tekbir: elleri kaldırın (mezhebinize göre), Allahu Ekber deyin, sonra Fatiha suresini okuyun. İbn Abbas cenaze namazında Fatiha okumuş ve bunun sünnetten olduğunu söylemiştir (Sahih el-Buhari 1335).",
      "İkinci tekbir: Peygamber Efendimiz'e ﷺ salavat getirin — teşehhütte kullanılan aynı İbrahimî salavat bu adım için yaygın öğretilir. Üçüncü tekbir: merhum için samimi dua edin (bu rehberdeki Hisnul Muslim ifadeleri). Dördüncü tekbir: birçok âlim ardından kısa genel bir dua eder, sonra sağa (ve mezhebe göre sola) selâm vererek bitirir.",
      "Rükû, secde veya oturuş yoktur. Baştan sona ayakta durulur. Birden fazla cenaze varsa, birçok toplulukta hepsi için niyetle tek Janazah kılınır — imamı takip edin. Salavat ile duanın sırası mezhebe göre hafifçe değişebilir; dört tekbir çerçevesi ortaktır.",
    ],
    madhhabNote:
      "Hanefi, Maliki, Şafii ve Hanbeli metinleri her tekbirde el kaldırma ve duanın tam ne zaman söyleneceği konusunda ayrılır. Önünüzdeki imamı takip edin.",
    actions: [
      "İhtiyacınız olmadan önce dört tekbir sırasını öğrenin.",
      "Fatiha'yı, salavatı ve en az bir cenaze duasını ezberleyin.",
    ],
    hadith: [
      {
        excerpt:
          "İbn Abbas cenaze namazı kıldı ve bunun sünnetten olduğunu söyleyerek Fatiha okudu.",
      },
    ],
  },
  {
    title: "Erkekler, kadınlar ve çocuklar için dualar",
    summary: "Aynı nebevî ifadeler — Arapça zamirleri merhuma göre uyarlayın.",
    body: [
      "Hisnul Muslim (ve klasik hadis mecmuaları) Janazah dualarını çoğunlukla eril sığayla kaydeder. Bu, kadınlar için ayrı 'uydurulmuş' bir dua demek değildir. Ana akım âlimler, niyetle eril ifadeyi koruyabileceğinizi veya — tercihen ve yaygın olarak — grameri merhuma göre değiştirebileceğinizi öğretir: لَهُ / هُ / هِ → لَهَا / هَا; عَبْدُكَ → أَمَتُكَ; ابْنُ أَمَتِكَ → ابْنَةُ أَمَتِكَ; ve kız çocuk için اجْعَلْهُ → اجْعَلْهَا, شَفِيعًا مُجَابًا → شَفِيعَةً مُجَابَةً.",
      "Vefat eden bir kadın için bazı âlimler 'eşinden daha hayırlı bir eş' (زَوْجًا خَيْرًا مِنْ زَوْجِهَا) ifadesinde ihtiyat tavsiye eder; cennette kocasıyla buluşabileceğini not ederler — bu cümleyi çıkarabilir veya genel bir ifade kullanabilirsiniz. Çocuklar için yalnızca yetişkin affa odaklı metinler yerine çocuğa özel Hisnul girişlerini (hisn-160, hisn-161) kullanın.",
      "Toplu ifade 'erkeklerimizi ve kadınlarımızı bağışla' (hisn-157) her iki cinsiyeti de değiştirmeden kapsar. Sahih metinlerin gramer uyarlaması dışında yeni Arapça uydurmayız — bağlı yetişkin duayı temel alın ve yukarıdaki zamir haritasını uygulayın.",
    ],
    madhhabNote:
      "Niyetle eril formları korumak ve dişil formlara uyarlamak ana akım âlimler arasında kabul edilir. Emin değilseniz hisn-157'yi (erkekler ve kadınlar) kullanın veya imama sorun.",
    actions: [
      "Ezberlediğiniz dua için dişil zamir değiştirmelerini pratik edin.",
      "Büluğ çağına ulaşmamışlar için çocuğa özel duaları kullanın.",
      "Uzun, senedsiz risaleler yerine özgünlüğü tercih edin.",
    ],
    appLinks: [{ label: "Yetişkin cenaze duası #1" }],
  },
  {
    title: "Şehitler, düşük ve özel durumlar",
    summary: "Yıkama veya Janazah hükümlerinin olağan durumdan farklılaştığı haller.",
    body: [
      "Savaşta ölen muharebe şehitleri, Uhud'dan çıkarılan klasik hükme göre alışılmış gusül olmadan elbiseleriyle gömülür; Peygamber ﷺ Uhud şehitlerinin kanlarıyla gömülmesini ve yıkanmamasını emretmiştir (Sahih el-Buhari 1346). Sevapta 'şehit' sayılan diğer kategoriler (ör. veba, boğulma) genellikle yıkanır ve Janazah kılınır — sınır durumlar için bir âlime sorun.",
      "Düşük veya ölü doğumda mezhepler, cenaze namazı ve tam yıkamanın ne zaman uygulanacağı konusunda ayrılır (çoğunlukla tanınır bir suret veya ruh üflenmesi aşamasına bağlanır). Bir hadis düşük üzerine namaz kılmayı ve anne-baba için bağışlanma ve rahmet dilemeyi teşvik eder (Ebu Davud 3180). Tahmin etmek yerine mezhebinizin cenaze heyetini takip edin.",
      "Müslüman olmayan akrabalara Müslüman Janazah namazı kılınmaz; iyilik, uygunsa meşru defin yardımı ve kişisel yas, müminler için ritüel namazdan ayrıdır. Özel durumları her zaman nitelikli yerel rehberlikle teyit edin.",
    ],
    madhhabNote:
      "Muharebe şehitliği, düşük aşamaları ve ölü doğum üzerine namaz tanımları mezheplere göre değişir. Bu konu sorunları işaret eder — fetva değildir.",
    disclaimer:
      "Özel hükümler hassastır. Harekete geçmeden önce nitelikli bir âlim veya topluluğunuzun cenaze hizmetiyle teyit edin.",
    actions: [
      "Âlim talimatına aykırı olarak muharebe şehidini yıkamayın.",
      "Düşük veya ölü doğum durumlarında cenaze heyetine sorun.",
    ],
    hadith: [
      {
        excerpt: "Peygamber ﷺ Uhud şehitlerinin kanlarıyla gömülmesini emretti ve onlar yıkanmadı.",
      },
      {
        excerpt:
          "Düşük üzerine cenaze namazı kılınır ve anne-baba için bağışlanma ve rahmet dilenir.",
      },
    ],
  },
  {
    title: "Gıyabî Janazah",
    summary: "Peygamber ﷺ ceset uzaktayken Necaşi için namaz kıldı.",
    body: [
      "Cabir'in bildirdiğine göre Peygamber ﷺ ashâbının yanına çıkmış, onları saf tutmuş ve uzak diyarlarda vefat eden Habeş kralı Necaşi (el-Necâşî) için dört tekbir getirmiştir (Sahih el-Buhari 1334; Sahih Müslim 952). Bu, gıyabî Salat al-Janazah'ın (alā al-ghā'ib) ana delilidir.",
      "Mezhepler bu emsalin ne kadar geniş uygulanacağı konusunda ayrılır: bazıları Necaşi gibi durumlarla sınırlar (yerel Müslüman namazı yok), bazıları ceset uzaktayken daha geniş izin verir. Ceset hazırken ve toplum namaz kılabiliyorken yerel Janazah'ı atlamayın. Mezhebinizde gıyabî namazın ne zaman uygun olduğunu güvenilir yerel bir âlimden sorun.",
      "Biçim aynı dört tekbirli namazdır; niyet gıyabî merhum içindir. Aynı sahih duaları kullanın, gerektiğinde cinsiyeti uyarlayın.",
    ],
    madhhabNote:
      "Gıyabî Janazah'ın kapsamı bilinen bir ihtilaf noktasıdır. Topluluğunuzdaki nitelikli imamların uygulamasını tercih edin.",
    actions: [
      "Ceset hazır olduğunda her zaman yerel namaz kılın.",
      "Gıyabî Janazah'ı kamuya açık etkinlik olarak düzenlemeden önce sorun.",
    ],
    hadith: [
      {
        excerpt: "Peygamber ﷺ Necaşi için cenaze namazı kıldı ve dört tekbir getirdi.",
      },
      {
        excerpt:
          "Allah Resulü ﷺ ashâbı saf tuttu ve Necaşi için dört tekbir getirerek namaz kıldı.",
      },
    ],
  },
  {
    title: "Ölüm döşeğinde — son sözler",
    summary: "Ölmekte olanı yumuşaklıkla la ilaha illallah demeye teşvik edin.",
    body: [
      "Peygamber ﷺ buyurdu: 'Ölmekte olanlarınıza la ilaha illallah demeyi telkin edin' (Sahih Müslim 916; Ebu Davud 3117). Hisnul Muslim, son sözü 'Allah'tan başka ibadete layık yoktur' olan kimsenin cennete gireceğini korur (hisn-153, Ebu Davud 3116'dan).",
      "Yumuşak ve sertlik olmadan telkin edin; zorlamayın ve tartışmayın. Ölüme yaklaşanlar Hisnul Muslim'de korunan sahih ümit sözleriyle de teselli edilebilir (hisn-150–152). Ruh alındığında gözleri kapatın ve göz kapatma duasını kullanın (önceki konu).",
      "Yüksek sesle feryattan ve Allah'ı öfkelendiren sözlerden kaçının. Ev halkı güzel söylemelidir; melekler sözlerine âmin der (Sahih Müslim 920).",
    ],
    actions: [
      "Ölmekte olana şehadeti yumuşakça hatırlatın.",
      "Odayı sakin ve güzel sözlerle meşgul tutun.",
    ],
    hadith: [
      {
        excerpt: "Ölmekte olanlarınıza telkin edin: la ilaha illallah.",
      },
      {
        excerpt: "Son sözü 'Allah'tan başka ibadete layık yoktur' olan kimse cennete girer.",
      },
    ],
    appLinks: [{ label: "Hayat ümidi duaları" }, { label: "Gözleri kapatmak" }],
  },
  {
    title: "Taziye ve yaslılar",
    summary: "Dirileri nebevî musibet duasıyla teselli edin.",
    body: [
      "Ümmü Seleme'nin bildirdiğine göre Allah Resulü ﷺ buyurdu: 'Bir Müslüman'a musibet isabet eder de Allah'ın emrettiğini söylerse — \"Biz Allah'a aidiz ve O'na döneceğiz. Allah'ım, musibetimde bana ecir ver ve onu bana daha hayırlısıyla değiştir\" — Allah onu daha hayırlısıyla değiştirir' (Sahih Müslim 918). Hisnul Muslim bu ifadeyi korur (hisn-154).",
      "Kısa ve doğru sözlerle taziye edin; Cafer ailesine dair rivayette olduğu gibi (Ebu Davud 3132) aileyi ağırlamakla yüklemek yerine merhumun ailesine yemek hazırlayın. Delilsiz sabit günlü bid'at törenlerinden kaçının; özel dua, sadaka ve iyiliğe devam edin.",
      "Gözyaşlı yas caizdir; feryat, yanaklara vurmak ve elbise yırtmak yasaklanmıştır. Defin sonrası dulları, yetimleri ve bakmakla yükümlü olunanları meşru yardımla destekleyin.",
    ],
    actions: [
      "Yaslılara musibet duasını öğretin.",
      "Ziyafet beklemek yerine yemek ve işlerle yardım edin.",
      "Merhum için sessiz dua ve sadakaya devam edin.",
    ],
    hadith: [
      {
        excerpt:
          "Hiçbir Müslüman'a musibet isabet edip Allah'a dönüşün emredilen sözlerini söyleyerek daha hayırlı bir bedel dilemez ki Allah onu daha hayırlısıyla değiştirmesin.",
      },
    ],
    appLinks: [{ label: "Sadaka hedefleri" }],
  },
];
