import type {
  JannahDuaEntry,
  JannahGate,
  JannahPromisedEntry,
  JannahTopic,
  JannahVerseEntry,
} from "../../types/jannah";
import type { DeepPartial } from "./localize";

// Turkish translation overlay for the Learn "Journey to Jannah" content. Mirrors
// the order of JANNAH_TOPICS / JANNAH_GATES / JANNAH_VERSES / JANNAH_PROMISED /
// JANNAH_DUAS in ../jannah.ts (index-aligned); untranslated entries fall back to
// English. Only human-readable text is translated — ids, routes, duaIds,
// surah/ayah numbers, collections, citations, grades and verse-reference labels
// stay in the English source.

export const JANNAH_TOPICS_TR: DeepPartial<JannahTopic>[] = [
  {
    title: "Cennet nedir?",
    summary: "Allah'ın salih kulları için hazırladığı ebedî bahçe.",
    body: [
      "Cennet, Allah'ın kendisine iman edip salih amel işleyenler için hazırladığı ebedî mükâfat yurdudur. Kelime sözlükte gür ve gölgeli bir bahçe anlamına gelir; ancak Kur'an onu yeryüzündeki her bahçeden çok daha büyük bir gerçeklik için kullanır: müminin Rabbinin rızası içinde ebediyen yaşadığı ırmakların, meyvelerin, köşklerin ve güzel dostlukların diyarı. Bütün peygamberlerin insanları çağırdığı hedef ve bu yolculuğun tamamının yöneldiği varış noktası odur.",
      "Cennetteki hayat bu dünyadaki hiçbir şeye benzemez; çünkü dünya mutluluğunu bozan her kusurdan arınmıştır. Orada ölüm, hastalık, yaşlanma, korku, hüzün ve yorgunluk yoktur. Cennet ehli asla tartışmaz, asla yorulmaz ve sevdiklerini asla kaybetmez. Gönlün dilediği her şey verilir ve Allah cömertliğinden daha fazlasını da ekler: 'Orada onlar için diledikleri her şey vardır; katımızda daha fazlası da vardır' (Kur'an 50:35).",
      "Cennetin nimetleri insan hayalinin ötesindedir. Bir hadis-i kudsîde Allah, salih kulları için hiçbir gözün görmediği, hiçbir kulağın işitmediği ve hiçbir kalbin tasavvur etmediği şeyler hazırladığını bildirir. Kur'an'ın cenneti bahçeler, ırmaklar ve gölgeler gibi tanıdık tasvirlerle anlatırken hakikatin her tasvirden daha büyük olduğunu hatırlatması bundandır. En büyük mükâfat ise bahçelerin kendisi değil, Allah'ın rızası ve en yüksek dereceler için O'nun yüce Vechine bakma şerefidir.",
      "Mümin iki hakikati bir arada tutmalıdır. Birincisi: Cennet gerçektir, yakındır ve her türlü çabaya değer; Kur'an bize ona doğru 'yarışmamızı' emreder (Kur'an 3:133). İkincisi: Hiç kimse cenneti yalnızca amelleriyle kazanamaz; oraya giriş nihayetinde Allah'ın rahmetiyledir; samimi iman ve salih amel ise O'nun kabul etmek için seçtiği vesilelerdir. Bu denge, kibre yol açmadan ümidi canlı tutar: Elimizden gelenin en iyisini yapar, sonra kendimizi O'nun rahmetine bırakırız.",
      "Pratikte, cennetin gerçekliğinin günlük tercihlerinizi şekillendirmesine izin verin. İbadet ağır geldiğinde ya da bir günah arzusu güçlü bastırdığında, sizi neyin beklediğini ve neyin tehlikede olduğunu hatırlayın. Allah'tan sık sık cenneti isteyin, küçük ama sürdürülebilir adımlarla onun için istikrarla çalışın ve ona duyduğunuz özlemin bu fâni hayatta kalbinizi yumuşatmasına izin verin.",
    ],
    quran: [{}, {}, {}, {}, {}],
    hadith: [{}, {}],
  },
  {
    title: "Cennetteki dereceler",
    summary: "Cennetin pek çok derecesi vardır — yedi basamaklı sabit bir merdiven değildir.",
    body: [
      "Cennet tek ve düz bir mekân değildir; derecât denilen pek çok derecesi vardır ve müminler imanlarına ve amellerine göre bu derecelerde yükseltilir. Çok yaygın bir yanlış kanaat, cennetin tam olarak yedi katı olduğudur. Bu, iki farklı şeyi birbirine karıştırmaktır: Kur'an yedi cennet katından değil, yedi gökten (semâvât) — üzerimizdeki yaratılmış semalardan — söz eder. Nasslar cenneti hiçbir zaman yedi dereceyle sınırlamaz.",
      "Sahih kaynakların bize bildirdiği şey, derecelerin çok sayıda ve geniş olduğudur. Peygamber ﷺ, cennette Allah yolunda mücadele edenler için hazırlanmış yüz derece bulunduğunu ve bir derece ile sonraki arasındaki mesafenin gökle yer arasındaki mesafe kadar olduğunu bildirmiştir. Bu sayı bile, kutucuk işaretleyerek tırmanabileceğimiz katı bir merdivenden çok, uçsuz bucaksız bir genişliğe işaret eder.",
      "Allah her mümini imanının gücüne, niyetinin samimiyetine ve amellerinin ağırlığına göre yükseltir: 'Herkesin yaptıklarına göre dereceleri vardır' (Kur'an 6:132). Her bir kişinin ulaşacağı kesin dereceyi yalnızca Allah bilir. Vahiy bilinçli olarak bize 'N derecesine ulaşmak için X amelini yap' türünden mekanik bir kontrol listesi vermez; çünkü ibadetin derece hesabıyla değil, sevgi ve ihlasla yapılması amaçlanır.",
      "Bunda güzel bir hikmet vardır. Kesin yerimizi bilseydik, bazılarımız rehavete kapılır, bazılarımız da ümitsizliğe düşerdi. Bunun yerine bize gözümüzü Allah'a dikmemiz, gayret etmeye ve ümit etmeye devam etmemiz öğretilir. Mümin hayırda yarışır — 'Yarışanlar işte bunun için yarışsın' — son değerlendirmeyi ise adaletin mutlak sahibine bırakır.",
      "O hâlde numaralı bir dereceyi hedeflemek yerine en yükseğini hedefleyin ve Allah'ın sizi dilediği yere yerleştirmesine razı olun. Peygamber ﷺ ashabına mütevazı bir istekle yetinmemeyi, özellikle cennetin en yüksek zirvesi olan Firdevs'i istemeyi öğretmiştir.",
    ],
    quran: [{}, {}, {}],
    hadith: [{}, {}],
    appLinks: [
      {
        label: "Firdevs'i isteyin",
      },
    ],
  },
  {
    title: "Firdevs — en yüksek derece",
    summary: "Cennetin zirvesi, Arş'a en yakın yer.",
    body: [
      "Firdevs, sahih Sünnette adı geçen, cennetin en yüksek ve en üstün derecesidir. Peygamber ﷺ onu cennetin en hayırlısı ve ortası — tam kalbi — olarak tarif etmiştir; cennetin ırmakları oradan doğar ve onun üstünde Rahmân'ın Arşı vardır. Firdevs'e ulaşmak, yaratılmış bir varlığın Allah'a olabileceği kadar yakın olmak demektir.",
      "Bu konuyu bu kadar pratik kılan, nebevî bir rehberliktir: Cennet için dua ettiğimizde hedefimizi düşük tutmamalıyız. Peygamber ﷺ ashabına, Allah'tan cenneti istediklerinde daha aşağısıyla yetinmek yerine özellikle Firdevs'i istemelerini öğretmiştir. Allah'ın cömertliği sınırsızdır; bu yüzden O'ndan yalnızca en azını istemek bir tür eksikliktir. Bu, bize ibadette yüksek himmeti öğretir: Zirveyi hedefleyin ve sizi nereye yerleştireceğine rahmetiyle Allah karar versin.",
      "Bir kul böyle bir dereceye nasıl aday olur? Vesileler, cennete götüren vesilelerin aynısıdır; ancak en güzel şekilde (ihsanla) yerine getirilir: samimiyetle benimsenmiş sahih bir inanç (tevhid), Allah'ın emrettiği farzların özenle yerine getirilmesi ve bunların üzerine giderek artan nafile ibadetlerle dolu bir hayat — gece namazı, nafile oruç, zikir, sadaka ve güzel ahlak. Meşhur bir hadis-i kudsîde Allah, kulun nafile amellerle kendisine yaklaşmaya devam ettiğini, nihayet Allah'ın onu sevdiğini anlatır.",
      "Ne var ki son ve belirleyici ihsan her zaman Allah'ın rahmetidir. En yükseği hedeflediğimiz anda, Peygamber'in ﷺ şu sözünü de hatırlarız: Hiç kimse cennete yalnızca ameliyle girmez — Peygamber ﷺ bile — ancak Allah onu rahmetiyle kuşatırsa müstesna. Müminin tutturduğu kusursuz denge budur: bir yanda yüksek ümit ve himmet, öbür yanda samimi bir tevazu.",
      "O hâlde Firdevs'i dualarınızın düzenli bir parçası yapın — secdede, gecenin son üçte birinde ve uyumadan önce — her gün sessizce elinizden gelenin en iyisini yaparken, gerisi için tamamen Rabbinizin rahmetine dayanın.",
    ],
    hadith: [{}, {}],
    actions: [
      "Dualarınızda, özellikle secdede ve uyumadan önce, Allah'tan Firdevs'i isteyin.",
      "Üzerinize farz olanı en güzel şekilde yerine getirin, sonra nafile ibadeti artırın.",
      "Tövbeyi sık sık yenileyin; yalnızca amellerinize değil, Allah'ın rahmetine güvenin.",
    ],
    appLinks: [
      {
        label: "Cennet duaları",
      },
      {
        label: "Sabah ve akşam zikirleri",
      },
    ],
  },
  {
    title: "Ahireti tehlikeye atan şeyler",
    summary: "Büyük günahlar samimi tövbe gerektirir; Allah'ın bağışlaması geniştir.",
    body: [
      "Bu bölümün amacı sizi korkutup ümitsizliğe düşürmek değildir — tam tersi. Allah, kendisine samimiyetle dönen kişinin bütün günahlarını bağışlar ve bunu en güçlü ifadelerle ilan eder: 'De ki: Ey kendi nefisleri aleyhine haddi aşan kullarım! Allah'ın rahmetinden ümit kesmeyin. Şüphesiz Allah bütün günahları bağışlar' (Kur'an 39:53). Buradaki amaç yalnızca nassların neye karşı uyardığını bilmek, böylece tehlikeyi fark edip iş işten geçmeden O'na koşmaktır.",
      "Diğer bütün günahlardan ayrı duran bir günah vardır: şirk, yani ibadette Allah'a ortak koşmak. Kur'an 4:48'de açıkça bildirildiği gibi, kişi tövbe etmeden bu hâl üzere ölürse Allah'ın bağışlamayacağı tek günah budur. Geri kalan her şey 'Bundan başkasını dilediği kimse için bağışlar' kapsamına girer. Doğru tevhidin kabul edilen her amelin altındaki temel olmasının sebebi budur: Çatlak bir temel üzerine kurulan ev ayakta duramaz.",
      "Şirkten sonra nasslar namazı terk etmeye özel bir ağırlık verir. Beş vakit namazı geçerli bir mazeret olmaksızın ısrarla ihmal etmek, Sünnetteki en ağır uyarılar arasındadır — Peygamber ﷺ namazı mümini ayırt eden ahid olarak nitelendirmiştir; öyle ki onu terk etmek küfre yaklaşmaktır. Diğer büyük günahlar — haksız yere adam öldürmek, gayrimeşru ilişkiler, faiz (riba) yemek, yetim malı yemek ve ağır zulüm — samimi tövbe gerektiren ve Allah bağışlamazsa azaba sebep olabilecek ciddi meselelerdir.",
      "'Küçük' denilen günahlar da önemlidir ve asla hafife alınmamalıdır. Gıybet, yalan, kibir, akrabalık bağlarını koparmak ve gaflet kalbi ve ahlakı yavaş yavaş aşındırır. Peygamber ﷺ, küçük çubuklar bir araya toplanınca koca bir yemeği pişirebildiği gibi, biriken küçük günahların da insanı helak edebileceği konusunda uyarmıştır. Her biri ayrıca Allah'a dönmeyi gerektirir.",
      "Çıkarılacak ders, eyleme dönüşen ümittir: Bir günahın büyüklüğünün sizi tövbenin anlamsız olduğuna inandırmasına asla izin vermeyin. Ayağınız kaydığı anda Allah'a dönün, kötü bir ameli silmesi için ardından iyi bir amel yapın ve istiğfar kapısını her gün açık tutun. O'nun rahmeti her zaman hatanızdan daha büyüktür.",
    ],
    quran: [{}, {}],
    hadith: [{}],
    appLinks: [
      {
        label: "Namaz takibi",
      },
      {
        label: "Kaza ve kaçırılan ibadetleri telafi etme",
      },
    ],
    disclaimer:
      "Fıkıhta büyük günah listeleri âlimden âlime farklılık gösterir; kişiler hakkında hüküm vermek ise ehil kimselere aittir. Bu, tövbeye yönelik genel bir hatırlatmadır — kişisel bir hüküm değildir. Kendi durumunuz için güvenilir bir âlime danışın.",
  },
  {
    title: "Nasslarda övülenler",
    summary: "Peygamber'in ﷺ cennetle ilgili olarak adını andığı kişiler ve topluluklar.",
    body: [
      "Kur'an ve Sünnet, belirli kişileri, mümin gruplarını ve cennet müjdesiyle ilişkilendirilen amelleri öne çıkarır. Bunları doğru okumak önemlidir: Bunlar o belirli kişiler ya da nitelikler hakkında doğru haberlerdir — isimlerini yalnızca duyan ya da onlara hayranlık duyan herkese devredilebilecek bir garanti değildir. Müjde onların imanına ve amellerine dayanıyordu; aynı kapı aynı vesilelerle bize de açıktır.",
      "En meşhur grup, Peygamber'in ﷺ tek bir rivayette birlikte adını andığı, cennetle müjdelenen on sahâbîdir (Aşere-i Mübeşşere): Ebû Bekir, Ömer, Osman, Ali, Talha, Zübeyr, Abdurrahman b. Avf, Sa'd b. Ebû Vakkâs, Saîd b. Zeyd ve Ebû Ubeyde b. Cerrâh (Allah hepsinden razı olsun). Onlar Peygamber'in ﷺ ashabı içinde ona en yakın olan ve en çok fedakârlık gösterenlerdi; Ehl-i Sünnet onların hepsini aşırılığa kaçmadan ve hiçbirini küçümsemeden sever ve onlara saygı gösterir.",
      "Adı geçen kişilerin ötesinde nasslar, müjdelenen grupları da tarif eder: sadıklar ve sabredenler, İslam hukukuna göre Allah yolunda hakiki şehid olarak ölenler ve bu hayattaki son sözü kelime-i tevhid, lâ ilâhe illallah olanlar. Her nitelik içsel bir gerçekliğe — ihlasa, fedakârlığa ya da son nefeste Allah'a bağlı bir kalbe — işaret eder; yalnızca dışa dönük bir etikete değil.",
      "Bizim için ders, bu bağlantıya güvenerek kendimizi emniyette hissetmek ya da bu dereceleri kendimiz için iddia etmek değil, ilham almaktır. Onların örneği bizi yukarı çeksin: Onların sevdiğini sevin, onların gayret ettiği gibi gayret edin ve bu hayranlığı duaya ve amele dönüştürün; her şeyden önce Allah'tan hüsn-i hâtime — güzel bir son — isteyin.",
    ],
    hadith: [{}, {}],
    disclaimer:
      "Hadislerdeki müjdeler, adı geçenlere ya da tarif edilen gruplara yöneliktir. Kişinin kendi imanına, ameline ve güzel bir sona olan ihtiyacının yerini tutmaz. En doğrusunu Allah bilir.",
  },
  {
    title: "Tevhid — doğru inanç",
    summary: "Samimi tevhid olmadan hiçbir amel kabul edilmez.",
    body: [
      "Tevhid, ibadette yalnızca Allah'ı birlemektir: Yalnızca O'nun Rab ve Yaratıcı olduğuna, yalnızca O'nun ibadete layık olduğuna ve isimlerinde ve sıfatlarında eşsiz olduğuna inanmaktır. Her peygamberin gönderildiği mesajın ta kendisi ve kişinin İslam'a girerken üzerine adım attığı ilk şeydir. İbadet ettiğimiz Zât ile ilgili olduğu için, dinin bütün binasının üzerinde yükseldiği temeldir.",
      "Önemi ne kadar vurgulansa azdır: Allah, kendisine ortak koşan bir kişiden hiçbir ameli kabul etmez. 'Eğer Allah'a ortak koşarsan, amellerin mutlaka boşa gider' (Kur'an 39:65). Şirk üzerine kurulmuş dağ gibi salih ameller Hesap Günü hiçbir ağırlık taşımazken, saf tevhid üzerine kurulmuş en küçük amel son derece ağır gelebilir. Bu yüzden inancı korumak, amelleri çoğaltmaktan bile daha acildir.",
      "Tevhid aynı zamanda ihlas denilen samimiyeti gerektirir — yani Allah'a 'dini yalnızca O'na has kılarak' ibadet etmemizi (Kur'an 98:5). Buradaki sinsi tehlike, ibadetleri insanlar görsün ve övsün diye yapmak olan riyadır. Peygamber ﷺ, gizli gösterişin bile bir ameli sessizce bozabileceği konusunda uyarmıştır. Çaresi niyeti sürekli yenilemektir: Bunu gerçekte kimin için yapıyorum? Sıradan bir işi kıymetli bir ibadete dönüştüren ihlastır.",
      "Tevhidi temel kılmanın hikmeti, kalbi özgürleştirmesidir. Yalnızca Allah'a ibadet eden kişi, mahlukat korkusundan, herkesin onayının peşinde koşmaktan ve birçok efendiye hizmet etmenin yorgunluğundan kurtulur. Hayatı tek ve net bir yön kazanır: kendisini yaratanı razı etmek.",
      "Pratikte, doğru inancı güvenilir âlimlerden öğrenin, ibadetinizi şirkten ve nifaktan arındırın ve harekete geçmeden önce niyetinizi kontrol edin. Bu ilk adım isteğe bağlı ya da ileri seviye bir konu değildir — cennete giden her yol buradan başlar.",
    ],
    quran: [{}, {}],
    hadith: [{}],
    actions: [
      "Tevhidin temellerini güvenilir âlimlerden öğrenin.",
      "İbadetlerden önce niyetinizi yenileyin.",
      "Gizli gösteriş (riya) için Allah'tan bağışlanma dileyin.",
    ],
  },
  {
    title: "Namaz — dinin direği",
    summary: "Beş vakit namazı korumak en büyük amellerdendir.",
    body: [
      "Namaz — beş vakit farz namaz — İslam'ın beş şartından ikincisi ve günlük ibadetin merkezidir. Peygamber ﷺ namazı dinin direği olarak tarif etmiştir: Onu ikame eden dini ikame etmiş olur; onu ihmal eden ise dini ayakta tutan şeyin büyük kısmını yıkmış olur. Namaz, müminin Rabbiyle günde beş kez buluşmasıdır; kıyamda, rükûda ve secdede Allah ile doğrudan bağ kurar.",
      "Peygamber'in ﷺ Hesap Günü hakkında söyledikleri sebebiyle namazın, pratik ameller arasında eşi yoktur: Kulun ilk hesaba çekileceği şey namazdır. Namazı düzgün olursa diğer amelleri de düzgün olur; eksik olursa geri kalanı da tehlikededir. Bu dünyada da namaz bir arınma vesilesidir — Peygamber ﷺ beş vakit namazı insanın kapısının önünden akan bir nehre benzetmiştir: Kim günde beş kez orada yıkanırsa üzerinde hiç kir kalmaz; namazlar da küçük günahları böyle temizler.",
      "Ancak namaz bedenî hareketlerden ibaret olmamalıdır. Kur'an 'namazlarında huşû içinde olanları' över (Kur'an 23:1–2) ve 'namazlarında devamlı olanları' onurlandırır (Kur'an 70:22–23). En önemli iki nitelik şunlardır: huşû — Allah'ın huzurunda durduğunu bilen, orada hazır ve mütevazı bir kalp — ve süreklilik, yani her namazı vaktinde korumak. Gücü yetenler için namazı cemaatle kılmak sevabı kat kat artırır.",
      "Namazın daha derin hikmeti dönüşümdür. Gereği gibi kılınan namaz insanı hayâsızlıktan ve kötülükten alıkoyar; yoğun bir gün boyunca kalbi tekrar tekrar Allah'a çeken bir yenilenmedir. Bu nedenle namazları geçerli bir mazeret olmadan kaçırmak, samimi tövbeyi ve kazalarını kılmayı gerektiren ağır bir meseledir. Nafile ve revâtib namazlar — farzlardan önce ve sonra kılınan düzenli sünnetler — ilave nur katar ve dereceyi yükseltir.",
      "Pratikte: Beş vakit namazı vakitlerinde korumayı mutlak önceliğiniz yapın, kaçırdıklarınızı kaza edin ve sürdürebileceğiniz sünnet namazları ekleyin. Namazınız iyileştikçe ibadetinizin geri kalanı da genellikle onunla birlikte iyileşir.",
    ],
    quran: [{}, {}],
    hadith: [{}, {}],
    actions: [
      "Beş vakit namazı vakitlerinde koruyun.",
      "Kaçırılan namazları samimiyetle kaza edin.",
      "İmkânınız olduğunda farzlardan önce ve sonra sünnet namazları ekleyin.",
    ],
    appLinks: [
      {
        label: "Namaz kontrol listesi",
      },
      {
        label: "Namaz vakitleri",
      },
      {
        label: "Namaz rehberi",
      },
      {
        label: "Huşû günlüğü",
      },
    ],
  },
  {
    title: "Samimi tövbe",
    summary: "Allah, sürekli kendisine dönenleri sever.",
    body: [
      "Tövbe, günahtan sonra Allah'a dönmektir. Samimi tövbenin (tevbe-i nasûh) açık rükünleri vardır: yapılan şeyden dolayı kalpte gerçek bir pişmanlık, günahı derhal bırakmak ve ona bir daha asla dönmemeye kesin karar vermek — günah başka birine haksızlık içeriyorsa, onun hakkını iade etmek ya da helallik istemek. Tövbe tek seferlik bir olay değil, ömür boyu süren bir dönüştür; Allah'ın her mümin için açık tuttuğu bir kapıdır.",
      "Önemi şuradadır: Hiçbir insan günahtan uzak değildir; bu yüzden tövbe birkaç günahkâr için değil, herkes içindir. Peygamber ﷺ, Âdemoğlunun hepsinin günah işlediğini ve günah işleyenlerin en hayırlısının tövbe edenler olduğunu söylemiştir. Allah, ölüm anında can boğaza gelene kadar kulun tövbesini kabul eder; güneşin batıdan doğması ise dünya için son sınırdır — o zamana kadar davet geçerlidir.",
      "Hayret verici olan şu ki, Allah dönen kulu yalnızca kabul etmekle kalmaz — onun dönüşüne sevinir. Peygamber ﷺ, Allah'ın kulunun tövbesine, çorak bir çölde kaybolup bütün yiyeceği ve suyuyla birlikte devesi kaçınca hayattan ümidini kesen, sonra onu birden yeniden bulan bir adamın sevincinden daha çok sevindiğini anlatmıştır. Bu taşkın sevinç tablosu, tövbe eden kulun Rabbi katında ne kadar sevimli olduğunu gösterir.",
      "Hikmeti derindir: Günah, bir insanın hikâyesinin sonu olmak zorunda değildir. 'Allah onların kötülüklerini iyiliklere çevirir' (Kur'an 25:70) — samimi tövbe, başarısızlıklarla dolu bir sicili başarıya dönüştürebilir ve bir düşüşü, kişiyi Allah'a öncekinden daha yakın kılan yeni bir başlangıca çevirebilir. Günahtan sonraki ümitsizlik bizzat şeytanın bir tuzağıdır; Allah'ın rahmetine ümit ise müminin cevabıdır.",
      "Pratikte: Tövbeyi bir gün bile ertelemeyin — ayağınız kaydığı anda dönün. Her kötü amelin ardından onu silmesi için iyi bir amel yapın ve Peygamber'in ﷺ bağışlanmış olduğu hâlde günde defalarca istiğfar ettiği gibi, gün boyunca dilinizden istiğfarı eksik etmeyin.",
    ],
    quran: [{}, {}],
    hadith: [{}],
    actions: [
      "Günah işlediğinizde hemen tövbe edin — ertelemeyin.",
      "Günahın ardından onu silecek iyi bir amel yapın.",
      "Gün boyunca istiğfar edin.",
    ],
    appLinks: [
      {
        label: "Sabah ve akşam zikirleri",
      },
      {
        label: "Kaza takibi",
      },
    ],
  },
  {
    title: "Kur'an",
    summary: "Allah'ın Kitabını okuyun, ezberleyin ve onunla yaşayın.",
    body: [
      "Kur'an, hidayet, rahmet ve kalplere şifa olarak indirilmiş, Allah'ın lafzen kelamıdır. Onunla bir bağ kurmak — onu okumak, anlamları üzerinde düşünmek, emirleriyle amel etmek ve başkalarına öğretmek — bir müminin ömrünü adayabileceği en büyük ve en sevaplı ibadetler arasındadır. O, Allah'ın bize uzattığı ipidir; ona sımsıkı sarılan dosdoğru bir yola iletilir.",
      "Ona bağlı sevaplar olağanüstüdür. Peygamber ﷺ, Allah'ın Kitabını okuyan ve namazı ikame edenlere Allah'ın asla tükenmeyecek büyük bir mükâfat verdiğini (Kur'an 35:29–30) ve okunan her bir harf için on katına çıkarılmış bir sevap olduğunu öğretmiştir. Kelimeler üzerinde zorlanan ve takılan kişinin bile, denemeye devam ettiği sürece iki sevabı vardır: biri okuması, diğeri de gösterdiği çaba için.",
      "Kur'an, ahiret hayatında da kişinin derecesini doğrudan ve canlı bir şekilde yükseltir. Peygamber ﷺ, Kıyamet günü Kur'an ehline şöyle denileceğini bildirmiştir: 'Oku ve yüksel; dünyada nasıl okuyor idiysen öyle oku; çünkü senin derecen okuduğun son ayetin yanındadır.' Başka bir deyişle, kişinin cennetteki makamı Kitap'tan nasibi ölçüsünde yükselir — ezberlemeye ve tekrar etmeye devam etmek için çarpıcı bir teşvik.",
      "Ancak daha derin amaç, okumanın kendisi değil dönüşümdür. Allah bize 'Kur'an'ı tertil ile oku' (Kur'an 73:4) diye emreder; ta ki anlamlar içimize işlesin ve düşünme, hissetme ve davranma biçimimizi yeniden şekillendirsin. Kur'an yalnızca okunmak için değil, yaşanmak için indirildi; sahabe on ayet öğrenir, onları anlayıp onlarla amel etmeden ötesine geçmezdi.",
      "Pratikte: Her gün bir bölüm okuyun, birkaç ayet bile olsa, ama tefekkürle okuyun. Yeni sureler ezberleyin ya da bildiklerinizi koruyun ve — en önemlisi — daha fazlasını öğrenmeye koşmadan önce öğrendiğinizle amel edin.",
    ],
    quran: [{}, {}],
    hadith: [{}],
    actions: [
      "Her gün okuyun — tefekkürle birkaç ayet bile olsa.",
      "Yeni sureler ezberleyin ya da bildiklerinizi koruyun.",
      "Daha fazlasını aramadan önce öğrendiğinizle amel edin.",
    ],
    appLinks: [
      {
        label: "Kur'an okuyucu",
      },
      {
        label: "Hatim planlayıcı",
      },
      {
        label: "Hıfz takibi",
      },
    ],
  },
  {
    title: "Zikir — Allah'ı anmak",
    summary: "Dile hafif, mîzanda ağır.",
    body: [
      "Zikir, Allah'ı anmaktır: tesbih (Sübhânallah), hamd (Elhamdülillah), tekbir (Allâhu ekber), O'nun birliğini ikrar (Lâ ilâhe illallah) ve istiğfar sözleriyle O'nu kalpte ve dilde hazır tutmaktır. Cennete giden bütün yollar arasında zikir, yapılması en kolay ama sevabı en büyük olanlardandır; çünkü her yerde, her hâlde ve her an yapılabilir.",
      "Allah bizzat onu bolca yapmayı emreder — 'Ey iman edenler! Allah'ı çokça zikredin' (Kur'an 33:41–42) — ve ona eşsiz bir meyve vaat eder: kalbin huzuru. 'Bilesiniz ki kalpler ancak Allah'ı anmakla huzur bulur' (Kur'an 13:28). Huzursuz ve kaygılı bir dünyada bu, zikrin en büyük armağanlarından biridir. Peygamber ﷺ de onun sevabını tartmış ve dile hafif, mîzanda ağır ve Rahmân'a sevimli iki kelimenin Sübhânallâhi ve bihamdihî, Sübhânallâhi'l-azîm olduğunu bildirmiştir.",
      "Özel bir kategori sabah ve akşam zikirleridir — Peygamber'in ﷺ günün iki ucu için öğrettiği sahih dualar. Bunlar manevi bir kale gibi işler; mümini zarardan korur ve Allah'ın korumasını ve rızasını celbeder. Her günün başında ve sonunda, kalben hazır olarak okunan birkaç dakika, zamanla kalbi sessizce yeniden şekillendirir.",
      "Zikrin hikmeti, belirli vakitlerdeki ibadetlerin arasında Allah ile ilişkiyi canlı tutmasıdır. Zikirle ıslanmış bir dil ve — daha önemlisi — günlük tercihlerinde Allah'ı hatırlayan; öfkelenmeden önce, bir şey satın almadan önce, bir karar vermeden önce duraksayan bir kalp asıl hedeftir. Zikir dudaklarda kalmak için değil, hayatı yönlendirmek içindir.",
      "Pratikte: Sabah ve akşam zikirlerini günlük bir alışkanlık hâline getirin, boş anlarda basit bir miktar tesbih, istiğfar veya salavatı dilinizden eksik etmeyin ve özellikle uyumadan önce ve uyandığınızda Allah'ı anın. Az da olsa devamlı olan, ara sıra yapılan çok amelden daha hayırlıdır.",
    ],
    quran: [{}, {}],
    hadith: [{}],
    actions: [
      "Sabah ve akşam zikirlerini her gün tamamlayın.",
      "İstiğfar veya salavat için tesbih sayacını kullanın.",
      "Uyumadan önce ve uyandıktan sonra Allah'ı anın.",
    ],
    appLinks: [
      {
        label: "Zikir kütüphanesi",
      },
      {
        label: "Tesbih sayacı",
      },
    ],
  },
  {
    title: "Sadaka ve zekât",
    summary: "Allah'ın size verdiğinden gizlice ve açıktan infak edin.",
    body: [
      "İslam, mümine Allah'ın kendisine emanet ettiği maldan hem farz hem de nafile olarak vermesini emreder. Zekât, nisaba ulaşan mal üzerine yıllık olarak farz olan bir yükümlülüktür — İslam'ın beş şartından biridir — ve şartlarını taşıyanlar için isteğe bağlı değil, farzdır. Bunun ötesinde sadaka vardır: Allah rızası için her miktarda ve her zaman yapılan gönüllü bağış.",
      "Allah yolunda harcamanın sevabı sıradan hesapların ötesinde katlanır. Allah, kendi yolunda harcayanı yedi başak bitiren ve her başakta yüz tane bulunan bir tohuma benzetir: 'Allah dilediğine kat kat verir' (Kur'an 2:261). Sadaka malı azaltmak şöyle dursun, onu arındırır ve bereketini artırır; suyun ateşi söndürdüğü gibi günahları da söndürür.",
      "İki sadaka türü özellikle anılmaya değer. Birincisi gizli sadakadır; Peygamber'in ﷺ tarif ettiği gibi o kadar gizli verilir ki sol el sağ elin ne verdiğini bilmez — bu ihlas Allah'a özellikle sevimlidir ve kişiyi Hesap Günü gölgelendirir. İkincisi sadaka-i câriyedir; faydası ölümden sonra da devam eden sürekli sadaka. Peygamber ﷺ, insan ölünce amelinin üç şey dışında sona erdiğini bildirmiştir: sadaka-i câriye, başkalarının faydalandığı ilim ve kendisine dua eden salih evlat.",
      "Sadakanın hikmeti, alan kadar veren üzerinde de etki göstermesidir. Hırsın kalpteki pençesini gevşetir, merhameti geliştirir, toplumun bağlarını güçlendirir ve zenginlere gerçek sahip değil emanetçi olduklarını hatırlatır. İslam sadakanın tanımını hiç kimse dışarıda kalmayacak şekilde genişletir: Peygamber ﷺ, kardeşine gülümsemenin, faydalı bir sözün ve hatta yoldan zararlı bir şeyi kaldırmanın bile sadaka olduğunu öğretmiştir.",
      "Pratikte: Zekât yükümlüsüyseniz onu doğru şekilde hesaplayıp ödeyin; vermek bir olay değil alışkanlık hâline gelsin diye, ne kadar küçük olursa olsun düzenli sadaka verin; ve siz bu dünyadan ayrıldıktan çok sonra da size sevap kazandırmaya devam edecek kalıcı bir sadaka-i câriye arayın — bir öğrenciye burs vermek, bir kuyu açtırmak ya da bir mescidi desteklemek gibi.",
    ],
    quran: [{}, {}],
    hadith: [{}],
    actions: [
      "Yükümlüyseniz zekâtı hesaplayıp ödeyin.",
      "Az da olsa düzenli sadaka verin.",
      "Sadaka-i câriye fırsatlarını arayın.",
    ],
    appLinks: [
      {
        label: "Zekât hesaplayıcı",
      },
    ],
  },
  {
    title: "Güzel ahlak",
    summary: "Mîzanda en ağır gelen şey güzel ahlak olabilir.",
    body: [
      "Güzel ahlak (hüsn-i hulk) yalnızca nezaket ya da bir gülümseme değildir. Bir müminin Allah'a, diğer insanlara ve kendine karşı sürekli olarak sergilediği davranış biçimidir: doğruluk, sabır, tevazu, merhamet, cömertlik, yumuşaklık, sözünde durmak ve öfkeyi yenmek. Allah Resûlünü ﷺ şöyle övmüştür: 'Ve sen elbette yüce bir ahlak üzeresin' (Kur'an 68:4).",
      "Kıyamet Günü'ndeki değeri açıkça bildirilmiştir. Peygamber ﷺ, müminin mîzanında güzel ahlaktan daha ağır bir şey olmadığını söylemiştir (Tirmizî 2002, hasen). İyiliği (birr) bizzat güzel ahlak olarak özetlemiş (Müslim 2553) ve ashabı içinde kendisine en sevimli olanların ve Kıyamet Günü kendisine en yakın olacakların ahlakı en güzel olanlar olduğunu öğretmiştir (Tirmizî 2018, hasen).",
      "Pek çok ibadet öncelikle ibadet edenin kendisine fayda sağlar; güzel ahlak ise çevrenizdeki herkese dokunur. Doğru söz, eziyet görünce sabır, sevmediğiniz birine karşı adalet ve anne-babaya ve komşulara iyilik, sayısız günlük anla amel defterini doldurur. Hüsn-i hulk hakkındaki mîzan vurgusunun bu kadar güçlü olmasının sebebi budur.",
      "Pratikte: Her seferinde bir huy üzerinde çalışın — kışkırtıldığınızda dilinizi tutun, karşılık verebilecekken affedin, kopmuş bir ilişkiyi onarın ve bedeli size ağır gelse bile sözünüzü tutun. Nassların övdüğü huylar için aşağıdaki mozaiği, ahlakı yıkan nitelikler için de karşıt listeyi kullanın.",
    ],
    characterTraits: [
      {
        title: "Doğruluk",
        summary: "Doğrularla beraber olun — dürüstlük güvenin temelidir.",
        quran: {},
      },
      {
        title: "Sabır",
        summary: "Sabır ve namazla yardım dileyin.",
        quran: {},
      },
      {
        title: "Öfkeyi yenmek",
        summary: "Öfkelerini yenen ve insanları affedenler — Allah iyilik yapanları sever.",
        quran: {},
      },
      {
        title: "Başkalarını affetmek",
        summary: "Affetsinler, hoş görsünler — Allah'ın sizi bağışlamasını istemez misiniz?",
        quran: {},
      },
      {
        title: "Tevazu",
        summary: "Rahmân'ın kulları yeryüzünde alçak gönüllü olarak yürürler.",
        quran: {},
      },
      {
        title: "Emanete riayet",
        summary: "Allah size emanetleri ehline vermenizi emreder.",
        quran: {},
      },
      {
        title: "Anne-babaya iyilik",
        summary:
          "Allah'a ibadet edin ve anne-babaya iyilik edin — onların hakkı O'nun hakkından sonra gelir.",
        quran: {},
      },
      {
        title: "Ya hayır söyle ya sus",
        summary: "Allah'a ve ahiret gününe iman eden ya hayır söylesin ya da sussun.",
        hadith: {},
      },
      {
        title: "Samimi bir tebessüm",
        summary: "Kardeşinin yüzüne gülümsemen sadakadır.",
        hadith: {},
      },
      {
        title: "Adalet",
        summary: "Adaletli olun — bu takvaya daha yakındır.",
        quran: {},
      },
    ],
    characterDestroyers: [
      {
        title: "Yalan",
      },
      {
        title: "Gıybet",
      },
      {
        title: "İftira (bühtan)",
      },
      {
        title: "Kibir",
      },
      {
        title: "Zulüm",
      },
      {
        title: "Sözünden dönmek",
      },
      {
        title: "Müminlerle alay etmek",
      },
      {
        title: "Haksız sertlik",
      },
    ],
    quran: [{}, {}],
    hadith: [{}, {}, {}, {}, {}],
    actions: [
      "Kışkırtıldığınızda sabretmeyi alışkanlık edinin.",
      "Başkalarını affedin ve kopmuş ilişkileri onarın.",
      "Ya hayır söyleyin ya susun — dilinizi her gün koruyun.",
      "Namazdan sonra günlük bir defterde ahlakınızı gözden geçirin.",
    ],
    appLinks: [
      {
        label: "Huşû ve ahlak günlüğü",
      },
      {
        label: "Mîzanda ağır gelenler",
      },
      {
        label: "Dilin günahları",
      },
      {
        label: "Başkalarına karşı işlenen günahlar",
      },
    ],
  },
  {
    title: "İlim talebi",
    summary: "Allah, ilim arayana cennetin yolunu kolaylaştırır.",
    body: [
      "Faydalı ilmi aramak — Allah'ın ve Resûlünün ﷺ öğrettiklerini öğrenmek, sonra onunla amel edip başkalarına aktarmak — bir ibadettir ve temel konularında her Müslümana farzdır. Bu, inancı netleştiren, ibadeti arındıran ve doğruyu yanlıştan ayıran dinî ilimdir; gösteriş için bir ilim değil, amele yol gösteren bir nurdur.",
      "Peygamber ﷺ bu arayışı doğrudan bu yolculuğun hedefine bağlamıştır: 'Kim ilim aramak için bir yola girerse, Allah ona cennete giden bir yolu kolaylaştırır.' Buradaki 'yol' hem gerçek hem de mecazi anlamdadır — Allah ilim talebesinin bu dünyadaki yolunu kolaylaştırır, ahirette de cennete giden yolunu kolaylaştırır. Peygamber ﷺ ayrıca meleklerin ilim talebesinden hoşnut olarak kanatlarını yere serdiğini ve göklerde ve yerde olan her şeyin, hatta denizdeki balıkların bile hayrı öğreten için bağışlanma dilediğini öğretmiştir.",
      "İlim, ölümden sonra da insana sevap kazandırmaya devam eden nadir amellerdendir. Peygamber ﷺ faydalı ilmi, sadaka-i câriye ve salih evlatla birlikte, sevabı kabirde de devam eden üç şey arasında saymıştır. Dolayısıyla faydalı tek bir şey öğretmek — birinin namazı doğru kılmayı öğrenmesine yardım etmek, sahih bir hadis paylaşmak ya da birini hakka yöneltmek — yıllarca, hatta nesiller boyu akan bir sevap kaynağına dönüşebilir.",
      "Hikmeti şudur: İlimsiz amel kör, amelsiz ilim ise meyvesizdir. Doğru ilim kişiyi bidatten ve sapkınlıktan korur, ihlası derinleştirir ve ona yalnızca kendisine değil başkalarına da fayda sağlama imkânı verir. İslam âlimleri her zaman iki tehlikeye karşı uyarmıştır: cehaletle amel etmek ve bilip de amel etmemek.",
      "Pratikte: Düzenli olarak faydalı bir şey öğrenmeyi kendinize görev edinin — bir ayet, bir hadis, günlük ibadetiniz için ihtiyaç duyduğunuz bir hüküm. İnancın, namazın, taharetin ve büyük yasakların temelleriyle başlayın, sonra yavaş yavaş derinleşin. Öğrendiklerinizi tevazu ile paylaşın ve her zaman önce kendinize uygulayın.",
    ],
    quran: [{}, {}],
    hadith: [{}, {}],
    actions: [
      "Her hafta faydalı bir şey öğrenin.",
      "İlmi kibirlenmeden paylaşın.",
      "Daha fazlasını biriktirmeden önce öğrendiğinizi uygulayın.",
    ],
    appLinks: [
      {
        label: "Hadis kütüphanesi",
      },
      {
        label: "Namaz rehberi",
      },
      {
        label: "Günün hadisi",
      },
    ],
  },
  {
    title: "Nafile ibadet",
    summary: "Farzların ötesinde nafilelerle Allah'a yaklaşın.",
    body: [
      "Nafile ibadet, müminin Allah'ın farz kıldıklarının ötesinde yaptığı ilave ibadetlerdir — fazladan namazlar, oruçlar, sadaka ve zikir. Farzlar önce gelir ve vazgeçilemez; ancak onlar yerine getirildikten sonra nafileler, kulun gerekli asgarinin ötesine geçen sevgisini, yakınlığını ve özlemini ifade ettiği alandır.",
      "Buna bağlı çarpıcı bir vaat vardır. Bir hadis-i kudsîde Allah şöyle buyurur: 'Kulum bana, kendisine farz kıldığım şeylerden daha sevimli bir şeyle yaklaşamaz. Kulum nafile amellerle bana yaklaşmaya devam eder, nihayet ben onu severim' — Allah bir kulu sevince de duaları kabul edilir ve işleri yoluna girer. Bu yüzden nafile ibadet, sadece itaatten ilahî sevgiye doğru tırmanılan yakınlık merdivenidir.",
      "Sünnet, nafilenin kolay ulaşılabilir türleriyle doludur: gecenin son kısmında kılınan gece namazı (teheccüd), kuşluk namazı (duha), farzlardan önce ve sonra kılınan düzenli sünnetler ve pazartesi-perşembe ya da her ayın eyyâm-ı bîz günleri gibi nafile oruçlar. Nafile ibadet eksiklerimizi de sessizce tamamlar — Peygamber ﷺ, farz namazlardaki herhangi bir eksikliğin Hesap Günü kişinin nafile namazlarıyla tamamlanacağını öğretmiştir.",
      "Hikmeti, nafilenin imanı canlı tutup büyütmesidir. Farzlar temel seviyeyi korur; nafileler ise kalbin genişlediği, kimsenin görmediği gizli ibadetin ihlası inşa ettiği ve kişinin kendini hayatın daha zor imtihanlarına hazırladığı alandır. Bu amellerin isteğe bağlı olması da bir rahmettir — Allah birçok kapı açar ki herkes kendisine uygun olanlardan geçebilsin.",
      "Pratikte anahtar, yoğunluk değil sürekliliktir. Peygamber ﷺ, Allah'a en sevimli amellerin az da olsa devamlı olanlar olduğunu öğretmiştir. Birkaç gün içinde tükenen iddialı bir hamle yerine, gerçekten sürdürebileceğiniz birkaç nafile seçin — iki rekât teheccüd, haftada bir oruç, belirli bir miktar Kur'an.",
    ],
    quran: [{}],
    hadith: [{}],
    actions: [
      "Sadece iki rekât da olsa teheccüd kılın.",
      "Gücünüz yettiğinde nafile oruç tutun.",
      "Farzlardan önce/sonra düzenli sünnet namazları ekleyin.",
    ],
    appLinks: [
      {
        label: "Teheccüd takibi",
      },
      {
        label: "Ramazan ve oruç",
      },
      {
        label: "Namaz kontrol listesi",
      },
    ],
  },
  {
    title: "Sabır ve şükür",
    summary: "Allah sabredenleri ve şükredenleri sever.",
    body: [
      "Sabır ve şükür, müminin hayat boyunca uçtuğu iki kanattır. Sabır üç alanda sebattır: Allah'a itaatte sağlam durmak, isyandan geri durmak ve hayatın imtihanlarına O'nun kaderine karşı şikâyet etmeden katlanmak. Şükür ise her nimetin Allah'tan geldiğini bilmek ve buna kalple, dille ve itaatkâr amellerle teşekkürle karşılık vermektir. İkisi birlikte, müminin hem zorluğa hem de kolaylığa verdiği cevabı kapsar.",
      "Önemleri, müminin başına gelen her şeyi nasıl karşıladığını belirlemelerindedir. Peygamber ﷺ müminin bütün işinin hayır olmasına hayret etmiştir: Ona bir iyilik dokunursa şükreder ve bu onun için hayırdır; bir zorluk dokunursa sabreder ve bu da onun için hayırdır — bu nimet, müminden başka kimseye verilmemiştir. Dolayısıyla ne gelirse gelsin, müminin sevaba giden bir yolu vardır.",
      "Sabrın mükâfatı eşsiz biçimde sınırsızdır. Amellerin çoğu belirli katlarla ödüllendirilirken Allah şöyle buyurur: 'Sabredenlere mükâfatları hesapsız olarak verilir' (Kur'an 39:10). Şükrün de kendine ait bir artış vaadi vardır: 'Eğer şükrederseniz, elbette size nimetimi artırırım' (Kur'an 14:7). Demek ki şükür yalnızca nimetlere verilecek doğru karşılık değil, bizzat onların artmasına sebep olan şeydir.",
      "Buradaki hikmet, acıya bakışı tamamen değiştirir. İmtihanlar kendiliğinden ceza değildir; güzel karşılık veren bir mümin için günahları silen bir arınma ve dereceyi yükselten bir yücelme olabilir. Peygamber ﷺ, bir Müslümanın başına gelen hiçbir yorgunluğun, hastalığın, kaygının, hatta batan bir dikenin bile, Allah onunla bazı günahlarını silmeden geçmediğini öğretmiştir. Bu, hayatın en zor anlarını salt bir kayıp olmaktan çıkarıp fırsata dönüştürür.",
      "Pratikte: Bir musibet geldiğinde Allah'ın öğrettiği sözlerle karşılık verin — 'İnnâ lillâhi ve innâ ileyhi râciûn' (Biz Allah'a aidiz ve şüphesiz O'na döneceğiz) — ve dilinizi O'nun kaderine itiraz eden şikâyetten tutun. İyi zamanlarda nimetlerinizi sesli olarak sayın ve her gün en azından birkaçı için Allah'a şükredin; onları tek tek anmak kalbi yumuşak ve şükreden tutar.",
    ],
    quran: [{}, {}],
    hadith: [{}],
    actions: [
      "İmtihan edildiğinizde 'innâ lillâhi ve innâ ileyhi râciûn' deyin.",
      "Her gün üç nimet için Allah'a sesli olarak şükredin.",
      "Allah'ın kaderine itiraz eder biçimde şikâyet etmeyin.",
    ],
  },
  {
    title: "Allah'a davet",
    summary: "Başkasını hayra yönelten, onu yapan kadar sevap alır.",
    body: [
      "Davet, başkalarını Allah'a çağırmaktır — İslam'ın mesajını paylaşmak, birine namaz kılmayı öğretmek, iyiliği teşvik etmek, kötülükten nazikçe sakındırmak ya da zorlanan bir Müslümanın itaate dönmesine yardım etmek. Bu, her peygamberin vazifesiydi ve herkesin gücü ve bilgisi ölçüsünde topluluğun ortak sorumluluğudur. Yalnızca âlimlere ait değildir; faydalı tek bir şeyi bile aktaran herkes Allah'a davet etmektedir.",
      "Sevabı, İslam'daki en cömert sevaplardan biridir. Peygamber ﷺ, birini hayra yönelten kişinin, o hayrı yapan kadar sevabı olduğunu bildirmiştir; başka bir rivayette ise hidayete davet eden kişinin, kendi sevaplarından hiçbir şey eksilmeden ona uyan herkesin sevabı kadar sevap alacağını bildirmiştir. Bu, başlattığınız iyiliğin, siz çoktan yolunuza devam etmişken bile dokunduğu her kişi aracılığıyla sevabınızı çoğaltmaya devam edebileceği anlamına gelir.",
      "Ancak davetin başarıya ulaşması için gözetilmesi gereken bir âdâbı vardır. Allah şöyle emreder: 'Rabbinin yoluna hikmetle ve güzel öğütle davet et ve onlarla en güzel şekilde mücadele et' (Kur'an 16:125). Hikmet, doğru sözü doğru kişiye, doğru şekilde ve doğru zamanda söylemektir; sertlik, kibir ve tartışmada üstünlük kurma çabası insanları uzaklaştırır ve amaca ihanet eder. Davetçinin görevi tebliğ etmek ve tohum ekmektir; yalnızca Allah'a ait olan kalpleri zorlamak değil.",
      "Böylesine büyük bir sevabı başkalarını hidayete yöneltmeye bağlamanın hikmeti, her mümini sürekli bir hayır kaynağı hâline getirmesidir. Bu aynı zamanda davetçinin kendi imanını da korur: Başkalarını namaza, dürüstlüğe ve ibadete davet etmek, insana bunlara kendisinin de sımsıkı sarılmasını hatırlatır. Ve toplumu karşılıklı ihmal yerine karşılıklı ilgiyle birbirine bağlar.",
      "Pratikte, işe yakınınızdan başlayın. Kendi ailenizi — eşinizi, çocuğunuzu, kardeşinizi — iyileştirin ve onlara öğretin; çünkü onlar ilk ve en kalıcı sorumluluğunuzdur. Faydalı bilgiyi nezaketle paylaşın, birinin namaz kılmayı veya Kur'an okumayı öğrenmesine yardım edin ve unutmayın ki güzel ahlak ve istikrarlı ibadetle geçen bir hayat, çoğu zaman en ikna edici davettir.",
    ],
    quran: [{}, {}],
    hadith: [{}],
    actions: [
      "Faydalı bilgiyi nezaketle paylaşın.",
      "Birinin namaz kılmayı veya Kur'an okumayı öğrenmesine yardım edin.",
      "Toplum içinde güzel ahlakın örneği olun.",
    ],
  },
  {
    title: "Ömür boyu büyük ameller",
    summary: "Hac, aile ve kalıcı sadaka.",
    body: [
      "Günlük ve haftalık ibadetlerin yanı sıra İslam, mümini birkaç büyük ve ömür boyu sürecek amele yönlendirir — sevabı muazzam ve bazı durumlarda hiç bitmeyen büyük yatırımlar. Bunlar, bir hayatın etrafında planlanmaya değer projelerdir: hac, salih bir aile yetiştirmek ve kalıcı hayırlar inşa etmek.",
      "Bunların başında, İslam'ın beşinci şartı olan ve bedenen ve maddeten gücü yeten her Müslümana ömürde bir kez farz olan hac gelir: 'Yoluna gücü yetenlerin Beyt'i haccetmesi, Allah'ın insanlar üzerindeki bir hakkıdır' (Kur'an 3:97). Mükâfatı tam bir arınmadır: Peygamber ﷺ, Allah rızası için hac edip hayâsızlıktan ve günahtan sakınan kişinin, annesinden doğduğu gün gibi günahsız olarak döneceğini bildirmiştir. Kabul edilmiş bir haccın mükâfatı, buyurduğu üzere, cennetten başkası değildir. Küçük hac olan umrenin de büyük sevabı vardır ve iki umre arasındaki günahları siler.",
      "İkinci büyük yatırım sadaka-i câriyedir — ölümden sonra da kişiye sevap kazandırmaya devam eden sürekli sadaka. Peygamber ﷺ onu, faydalı ilim ve kendisine dua eden salih evlatla birlikte, kabirde kişiye fayda sağlamaya devam eden üç şeyden biri olarak saymıştır. Çocukları iman ve güzel ahlak üzere yetiştirmek belki bunların en büyüğüdür; ancak bir mescit yaptırmak ya da ayakta tutmak, kuyu açtırmak, bir yetimin bakımını üstlenmek, ağaç dikmek veya eğitimi finanse etmek de böyledir — her biri, vereninden daha uzun yaşayan bir sevap kaynağıdır.",
      "Bu amellerin hikmeti, kişinin hesabını ömrünün ötesine taşımasıdır. Müminin aktif yılları kısadır; ancak açtırdığı bir kuyu ya da güzel yetiştirdiği bir evlat, ona yüzyıllarca sevap kazandırmaya devam edebilir. İslam böylece uzun vadeli bir bakışı teşvik eder: Yalnızca bugünkü namazı değil, siz gittikten sonra sizden hâlâ akmaya devam edecek hayrı da düşünmeyi.",
      "Pratikte: Gücünüz yetiyorsa, hac veya umreyi sürekli ertelemek yerine ciddi şekilde planlayın. Ailenizin imanına ve ahlakına gerçek bir emek verin; çünkü onlar en kalıcı mirasınızdır. Ve iyi amelleriniz ölümden sonra da devam etsin diye destekleyeceğiniz en az bir kalıcı hayır projesi belirleyin — ilim, su, barınak ya da bir yetim.",
    ],
    quran: [{}, {}],
    hadith: [{}, {}],
    actions: [
      "Gücünüz yetiyorsa hac veya umreyi planlayın.",
      "Ailenizin imanına ve ahlakına yatırım yapın.",
      "Kalıcı bir hayır projesini destekleyin.",
    ],
    appLinks: [
      {
        label: "Hac ve umre rehberi",
      },
      {
        label: "Zekât ve sadaka",
      },
    ],
  },
  {
    title: "Allah'ın rahmeti — son söz",
    summary: "Ameller vesiledir; cennete giriş O'nun rahmetiyledir.",
    body: [
      "Bütün amellerden, bütün gayretlerden ve bütün yollardan sonra mümin, bu yolculuğun son sözü olan ve insanı tevazuya sevk eden bir hakikate ulaşır: Hiç kimse cennete yalnızca amelleri sayesinde girmez. Peygamber ﷺ bunu — Allah katında bütün yaratılmışların en sevimlisi olduğu hâlde — kendisi için de söylemiş; Allah onu rahmetiyle kuşatmadıkça kendisinin bile ameliyle cennete girmeyeceğini bildirmiştir. Onun için böyleyse, bizim için elbette böyledir.",
      "Bu asla ibadeti ihmal etmeye bir izin olarak yanlış anlaşılmamalıdır. Ameller, Allah'ın seçtiği ve emrettiği vesileler olmaya devam eder; O, rahmetini imana ve salih amele bağlamıştır ve bunları terk etmek tevazu değil gaflettir. Doğru anlam bir orantı meselesidir: Amellerimiz, ne kadar çok olursa olsun, Allah'ın üzerimizdeki nimetlerinin küçük bir kısmının bile karşılığını ödeyemez, ebedî bir cenneti de satın alamaz. Bu yüzden amellerimizi bir sevgi ve itaat nişanesi olarak sunar, sonra onları kabul etmesi ve bizi cennetine koyması için tamamen O'nun lütfuna dayanırız.",
      "Bu rahmetin genişliği baş döndürücüdür. Peygamber ﷺ, Allah'ın rahmeti yüz parçaya böldüğünü bildirmiştir; bütün yaratılmışlara yalnızca bir parçasını indirmiştir — bir annenin çocuğuna şefkat göstermesi ve hayvanların yavrularına yumuşak davranması o tek parça sayesindedir — geri kalan doksan dokuz parçayı ise Kıyamet günü kullarına bahşetmek üzere kendi katında tutmuştur. Bu dünyada şahit olduğumuz bütün merhamet, yüz parçadan birinin bir kesridir.",
      "Dengeli mümin bu yüzden, iki kanatla uçan bir kuş gibi korku ile ümit arasında yaşar. Allah'ın adaletinden, asla rehavete kapılmayacak ya da günah konusunda pervasızlaşmayacak kadar korkar; Allah'ın rahmetinden de, ne kadar uzaklaşmış olursa olsun asla ümitsizliğe düşmeyecek kadar ümit eder. Tamamen korkuya meyletmek ümitsizlik doğurur; tamamen ümide meyletmek kibir doğurur. Allah'ın isimleri — er-Rahmân (çok merhametli), er-Rahîm (çok esirgeyen), el-Gafûr (çok bağışlayan) — ümit kanadını sağlamlaştırır.",
      "O hâlde her günü şu ruhla kapatın: Allah'tan Firdevs'i isteyin, dürüstçe elinizden gelenin en iyisini yapın, eksikleriniz için tövbe edin ve sonra nihai derecenizi mutlak adalet ve rahmet sahibi Allah'a bırakın — o Gün için rahmetin doksan dokuz parçasını saklayan Zât'ın, kendisine gayret ederek ve ümit ederek gelen bir kulu geri çevirmeyeceğine güvenerek.",
    ],
    quran: [{}, {}],
    hadith: [{}, {}],
    actions: [
      "Allah korkusunu O'nun rahmetine duyulan ümitle dengeleyin.",
      "Günahtan sonra asla ümitsizliğe düşmeyin — tövbe edin ve gayrete devam edin.",
      "Allah'tan Firdevs'i ve güzel bir son (hüsn-i hâtime) isteyin.",
    ],
    appLinks: [
      {
        label: "Cennet duaları",
      },
      {
        label: "Yolculuğum panosu",
      },
    ],
  },
];

export const JANNAH_GATES_TR: DeepPartial<JannahGate>[] = [
  {
    name: "Namaz Kapısı",
    deedSummary: "Beş vakit namazı koruyan ve ikame edenler için.",
    hadith: [{}],
  },
  {
    name: "Sadaka Kapısı",
    deedSummary: "Allah rızası için samimiyetle sadaka verenler için.",
    hadith: [{}],
  },
  {
    name: "Reyyân Kapısı",
    deedSummary: "Oruç tutanlara ayrılmıştır — yalnızca onların girdiği bir kapı.",
    hadith: [{}],
  },
  {
    name: "Cihad Kapısı",
    deedSummary: "Allah yolunda ihlasla mücadele edenler için.",
    hadith: [{}],
  },
  {
    name: "Haccın mükâfatı",
    deedSummary: "Haccı halis niyetle yapıp günahsız dönenler için.",
    hadith: [{}],
  },
  {
    name: "Bütün kapılardan çağrılanlar",
    deedSummary: "Ebû Bekir gibi bazıları bütün kapılardan girmeye çağrılacaktır.",
    hadith: [{}],
  },
];

export const JANNAH_VERSES_TR: DeepPartial<JannahVerseEntry>[] = [
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
];

export const JANNAH_DUAS_TR: DeepPartial<JannahDuaEntry>[] = [
  {
    context: "İki dünyada iyilik ve ateşten korunma için kapsamlı dua.",
  },
  {
    context: "Teşehhüdden sonra kısa bir dua: Cenneti isteyin ve ateşten Allah'a sığının.",
  },
  {
    context: "Teşehhüdden sonra Allah'ın güzel isimleriyle cenneti isteyin.",
  },
  {
    context: "Allah'ı görmenin lezzetini ve O'na kavuşma özlemini isteyin.",
  },
];

export const JANNAH_PROMISED_TR: DeepPartial<JannahPromisedEntry>[] = [
  {
    name: "Cennetle müjdelenen on sahâbî",
    summary:
      "Ebû Bekir, Ömer, Osman, Ali, Talha, Zübeyr, Abdurrahman b. Avf, Sa'd, Saîd b. Zeyd ve Ebû Ubeyde (Allah onlardan razı olsun).",
    note: "Sünen-i Tirmizî'deki bir hadiste birlikte anılmışlardır (3747, sahih).",
  },
  {
    name: "Sadıklar ve sabredenler",
    summary: "Allah, imanında sadık, itaatte ve imtihanlarda sabırlı olanları över.",
    note: "Bkz. Kur'an 4:69 ve sâdıkîn ile sâbirîn hakkındaki pek çok ayet.",
  },
  {
    name: "Allah yolunda şehid olanlar",
    summary: "İslam hukukuna göre İslam'ı savunurken ölenler cennetle müjdelenmiştir.",
    note: "Âlimler şehadeti titizlikle tanımlar; savaşta gerçekleşen her ölüm kendiliğinden bu kapsama girmez.",
  },
  {
    name: "Son sözü tevhid olanlar",
    summary: "Son sözü 'Lâ ilâhe illallah' olan kimse cennete girer.",
    note: "Sünen-i Ebû Dâvûd 3116 (sahih). Güzel bir son, ömür boyu sürdürülen bir arayıştır.",
  },
  {
    name: "Peygamberler",
    summary: "Her peygamber, Allah'ın takdiriyle cennetin en yüksek derecelerindedir.",
    note: "Onların makamına sıradan amellerle ulaşılmaz — onlar seçilmiş ve korunmuş kimselerdir.",
  },
];

export const JANNAH_FIRDAWS_DUA_TR: DeepPartial<{
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}> = {
  reference: "Sahîh-i Buhârî 7423'e dayanır — özellikle Firdevs'i isteyin.",
};
