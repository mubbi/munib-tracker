import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// tr overlay for new-muslim. Index-aligned with NEW_MUSLIM_TOPICS in ../new-muslim.ts.
export const NEW_MUSLIM_TOPICS_TR: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "İslam'a Hoş Geldiniz",
    summary: "Yolculuğunuzun ilk günleri ve haftaları için kısa ve pratik bir yol haritası.",
    body: [
      "Tebrikler — ve hoş geldiniz. Müslüman olmak bir bitiş çizgisi değil, Allah ile ömür boyu sürecek bir bağın başlangıcıdır; bu bağ bir anda değil, ilim, ibadet ve cemaat yoluyla yavaş yavaş gelişir. Kimse sizden ilk günden her şeyi bilmenizi beklemez; Peygamber Efendimiz'in ﷺ kendi ashabı da dahil olmak üzere her Müslüman dinini adım adım öğrenmiştir.",
      "İslam'a yeni girmiş biri için en teselli edici öğretilerden biri, geçmişinizin gerçekten geride kalmış olmasıdır: Geçmiş günahlarından endişe eden bir sahabiye Peygamber ﷺ, “İslam'ın kendisinden önce olanları yıktığını … bilmiyor muydun?” buyurmuştur. Allah katında tertemiz bir sayfayla başlıyorsunuz.",
      "Bu rehber temel konuları — şehadetin anlamını, İslam'ın beş şartını, imanın esaslarını ve namaza ilk bakışı — ele alır; ardından gerçek bir derinlik için sizi bu uygulamadaki kapsamlı Namaz, Akide, Dua Öğren ve Kur'an rehberlerine yönlendirir. Her seferinde bir bölüm ilerleyin.",
    ],
    actions: [
      "Kendi hızınızda ilerleyin — bu rehberin tamamını bir kerede değil, her oturuşta bir bölümünü okuyun.",
      "Okurken aklınıza gelen soruları not edin; daha sonra bunları bir hocaya veya bilgili bir dostunuza sorun.",
    ],
  },
  {
    title: "Şehadetin Anlamı",
    summary: "İslam'ın bütün anlamını taşıyan iki kısa cümle.",
    body: [
      "Şehadet — iman tanıklığı — şöyledir: “Eşhedü en lâ ilâhe illallâh ve eşhedü enne Muhammeden Resûlullâh” (“Şahitlik ederim ki Allah'tan başka ilah yoktur ve yine şahitlik ederim ki Muhammed Allah'ın Resulüdür”). İki bölümden oluşur ve her ikisi de önemlidir.",
      "Birinci bölüm olan lâ ilâhe illallâh, Allah'tan başka hiç kimsenin ve hiçbir şeyin — ne paranın, ne makamın, ne ataların, ne putların, ne de herhangi bir yaratılmışın — ibadete, ibadet niyetiyle itaate ya da nihai tevekküle layık olmadığı anlamına gelir. Bu, yalnızca kimin var olduğuna değil, kimin ibadet edilmeye hakkı olduğuna dair bir beyandır.",
      "İkinci bölüm, Muhammed'in ﷺ bütün insanlara hidayetle gönderilmiş, Allah'ın son peygamberi olduğunu tasdik eder. Bunu tasdik etmek, onun ﷺ Allah, ibadet ve nasıl yaşanacağı hakkında öğrettiklerine güvenmek demektir — işte bu yüzden Kur'an ve onun sahih öğretileri (Sünnet), bu rehberin tamamının dayandığı iki kaynaktır.",
      "Bu tanıklık sihirli bir formül değil, kalpte yerleşmiş bir kanaatin ifadesidir. Onu anlamını kavrayarak ve samimiyetle söylemek, bir insanı Müslüman — yani “teslim olan” — yapar.",
    ],
    appLinks: [{ label: "Akide Öğren — Allah'a iman" }],
  },
  {
    title: "Müslüman Olmak",
    summary: "Önemli olan, şehadeti anlayarak ve niyet ederek samimiyetle söylemektir.",
    body: [
      "Müslüman olmak için din adamına, törene, ücrete veya resmî evraka gerek yoktur. Gereken samimiyettir: şehadetin anlamını kavramak ve onu, sizinle Allah arasında, inancınız olarak benimseme niyetiyle söylemek.",
      "Pek çok kişi şehadeti başkalarının huzurunda — mahallî bir imam, bir cami cemaati ya da arkadaşlar önünde — söylemeyi tercih eder; çünkü bu, o ana tanıklar kazandırır ve sizi ilk günden bir destek ağına bağlar. Bu, tanıklığın kendisi için katı bir şart değil, yaygın olarak tavsiye edilen bir uygulamadır.",
      "Bazı yeni Müslümanlar, namazı öğrenmeye başlamadan önce sembolik ve pratik bir yeni başlangıç olarak bu dönemde gusül (bütün bedenin dinî olarak yıkanması) de alırlar; bunun tam olarak ne zaman ve nasıl yapılacağına dair uygulamalar ve görüşler topluluktan topluluğa değişir, bu yüzden tahmin yürütmek yerine bulunduğunuz yerde neyin âdet olduğunu bir hocaya sorun.",
      "Henüz emin olmayıp araştırma aşamasındaysanız, bu da olağan ve saygı duyulan bir aşamadır — okuyun, sorular sorun ve acele etmeyin. Şehadet baskı altında değil, kanaatle söylenmelidir.",
    ],
    actions: [
      "Hazırsanız, şehadeti mahallî bir imamın, bir cami cemaatinin ya da güvendiğiniz Müslüman arkadaşlarınızın huzurunda söylemeyi düşünün.",
      "Bulunduğunuz yerde âdet olan sonraki adımları (gusül gibi) yakınınızdaki bir camiye veya hocaya sorun.",
    ],
  },
  {
    title: "İslam'ın Beş Şartı",
    summary: "İslam, Peygamber ﷺ tarafından birlikte sayılan beş temel ibadet üzerine kuruludur.",
    body: [
      "Peygamber ﷺ İslami uygulamanın yapısını tek bir hadiste özetlemiştir: İslam beş temel üzerine bina edilmiştir — Allah'tan başka ilah olmadığına ve Muhammed'in O'nun Resulü olduğuna şahitlik etmek (şehadet); günlük beş vakit namazı kılmak (namaz); yıllık farz mali ibadet olan zekâtı vermek; Ramazan ayında oruç tutmak ve gücü yetenler için ömründe en az bir kez Mekke'ye hac yolculuğu yapmak (hac).",
      "Bunları bir ev gibi düşünün: şehadet her şeyin üzerine oturduğu temeldir; diğer dördü ise yapıyı ayakta tutan sütunlardır — düzenli ibadet (namaz), düzenli infak (zekât), her yıl bir aylık nefis terbiyesi (oruç) ve yolculuk için sağlığı ve imkânı olanlara ömürde bir kez hac.",
      "Beşinde de hemen ustalaşmanız gerekmez. Şehadeti zaten öğrendiniz; namaz bu rehberde sırada ele alınıyor; zekât ve oruç her yıl vakti geldikçe yavaş yavaş öğrenilir; hac ise şartlar elverdiğinde hayatın ilerleyen dönemleri için planlanır.",
    ],
  },
  {
    title: "Bir Bakışta Zekât, Oruç ve Hac",
    summary: "Zamanla gündeme gelen üç şart — bugün bunlarla ilgili bir şey yapmanız gerekmiyor.",
    body: [
      "Zekât, asgari bir sınırın (nisap) üzerindeki birikim ve zekâta tabi mallardan, belirli ihtiyaç sahibi gruplara verilen, küçük ve sabit oranlı yıllık bir farzdır. Genellikle yaklaşık bir yıl boyunca birikiminiz olduğunda gündeme gelir, bu yüzden acele etmeye gerek yoktur; uygulamanın Zekât rehberi, ihtiyaç duyduğunuzda bütün ayrıntıları ele alır.",
      "Ramazan orucu, her yıl bir kameri ay boyunca, tan yeri ağarmadan önceden güneş batana kadar yemekten, içmekten ve eşler arası ilişkiden uzak durmak; bunun yanında fazladan namaz kılmak ve Kur'an okumaktır. Zorlu ama derin bir şekilde mükâfatlandırıcı bir şarttır; yeni Müslümanların çoğu ona yalnız başına değil, cemaatlerinin rehberliğiyle yavaş yavaş alışır.",
      "Hac, Mekke'ye yapılan ve yalnızca bedenen ve maddi olarak yolculuğa gücü yetenlere ömürde bir kez farz olan yolculuktur. Şu an imkânınız dahilinde değilse üzerinizde bir yük yoktur — Allah kişiden ancak gücünün yettiğini ister.",
    ],
    appLinks: [{ label: "Zekât rehberi" }],
  },
  {
    title: "Şartlar Günlük Hayatı Nasıl Şekillendirir?",
    summary: "Beş şart, imanı gün be gün ve yıl be yıl gerçekten yaşadığınız bir ritme dönüştürür.",
    body: [
      "Yeni Müslümanların çoğu zaman en güzel bulduğu şeylerden biri, şartların sıradan hayata nasıl bir ritim kattığıdır: her gün namaz için beş kısa mola, her yıl bir oruç ve tefekkür mevsimi, yıllık bir infak ve — nihayetinde — ömürde bir kez hac. Bunların hiçbiri soyut bir teoloji değildir; hepsi yaşanır.",
      "Bu ritim bunaltıcı değil, sürdürülebilir olsun diye vardır. Peygamber ﷺ, Allah'ın en sevdiği amellerin, az da olsa devamlı yapılanlar olduğunu öğretmiştir — tükenişe yol açan ani yoğunluk patlamaları değil. Önce küçük ve istikrarlı alışkanlıklar edinin; derinlik zamanla gelir.",
    ],
    actions: [
      "Her şeyi bir anda yapmaya çalışmak yerine, bu hafta başlamak için küçük ve sürdürülebilir bir alışkanlık seçin.",
    ],
  },
  {
    title: "İmanın Altı Esası",
    summary:
      "Bir Müslümanın neye inandığı, doğrudan Peygamber ﷺ tarafından öğretilen altı maddede.",
    body: [
      "Beş şart bir Müslümanın ne yaptığını anlatırken, imanın altı esası bir Müslümanın neye inandığını anlatır. Bunlar Cibril hadisinden gelir; bu hadiste melek Cibril, bir adam suretinde gelerek toplanmış sahabilerin önünde Peygamber'den ﷺ imanı açıklamasını istemiştir.",
      "Peygamber ﷺ şöyle cevap verdi: Allah'a, meleklerine, indirdiği kitaplara, peygamberlerine, ahiret gününe ve kadere — hayrına ve acısına — iman etmek. Bu altı esas, gerçekliğin birbirine bağlı tek bir tablosunu oluşturur: sizi kimin yarattığı, görünmeyen âlemi kimin idare ettiği, hidayetin insanlığa nasıl ulaştığı, onu kimin tebliğ ettiği, hayatın nereye gittiği ve hem kolaylığı hem zorluğu Allah'a tevekkülle nasıl karşılayacağınız.",
      "Her esasın arkasındaki felsefede bugün ustalaşmanız gerekmiyor — bu uygulamadaki Akide rehberi, daha derine inmeye hazır olduğunuzda altı esasın tamamını delilleriyle birlikte ayrıntılı olarak ele alır.",
    ],
    appLinks: [{ label: "Akide Öğren — altı esas" }],
  },
  {
    title: "Allah Kimdir?",
    summary:
      "Ortağı, dengi ve hiçbir ihtiyacı olmayan tek İlah — kendi güzel isimleriyle tanıtılır.",
    body: [
      "Allah, İslam'da Yaratıcı'nın özel ismidir — farklı bir ilah değil, önceki kutsal kitapların işaret ettiği aynı tek gerçek Yaratıcı'dır; artık O'nun kendi seçtiği isimle bilinir ve insan tahminleriyle değil, vahyedilmiş sıfatlarıyla tanıtılır.",
      "Kur'an'daki en açık kısa tanım İhlâs suresidir: O birdir; ortağı ve dengi yoktur; doğurmamış ve doğurulmamıştır. Allah'ın zihinde canlandırılabilecek bir bedeni yoktur ve O'nu temsil etmek için asla bir suret yapılmamalıdır — O'nu tanımak resimlerle ya da fiziksel benzetmelerle değil, isimleri (Rahmân — çok merhametli, Alîm — her şeyi bilen, Semî — her şeyi işiten gibi) ve yaratılıştaki fiilleri yoluyla olur.",
      "Allah'ı isimleri aracılığıyla tanımak, çoğu zaman imanın ilk dönemlerinin duygusal olarak en çok huzur veren yanıdır: O'nun nasıl olduğunu öğrendikçe namaz ve günlük hayatta O'na dayanmak mekanik olmaktan çıkıp kişisel bir hâl almaya başlar.",
    ],
    appLinks: [{ label: "Allah'ın İsimleri" }],
  },
  {
    title: "Kur'an ve Son Mesaj",
    summary: "Kur'an, indirildiği günden beri değişmeden korunan Allah'ın kendi kelamıdır.",
    body: [
      "Müslümanlar, Kur'an'ın yaklaşık 23 yıl boyunca Peygamber Muhammed'e ﷺ vahyedilen Allah'ın lafzî kelamı olduğuna ve o günden beri kelimesi kelimesine korunduğuna — nesiller boyu Müslümanlar tarafından ezberlendiğine ve asla değiştirilmediğine — inanır.",
      "Kur'an, hem hidayet hem de önceki peygamberlerin kıssalarını içerse de Peygamber'in ﷺ bir biyografisi ya da bir tarih kitabı değildir; o öncelikle azar azar okunmak, tilavet edilmek, üzerinde düşünülmek ve yaşanmak için indirilmiş bir hidayet kitabıdır.",
      "Başlamak için Arapça okuyabiliyor olmanız gerekmez. Anladığınız bir dildeki bir mealle, ilginizi çeken herhangi bir sırayla başlayın; Arapça tilavete aşinalığınız namazınızla birlikte yavaş yavaş artsın.",
    ],
    appLinks: [{ label: "Kur'an Oku" }],
  },
  {
    title: "Namaz Nasıl Kılınır? — Genel Bakış",
    summary: "Günde beş kısa namaz; her biri kıyam, rükû ve secdeden oluşan belirli bir sıradır.",
    body: [
      "Namaz günde beş kez belirli vakitlerde kılınır — sabah, öğle, ikindi, akşam ve yatsı — ve düzeni öğrendikten sonra her seferinde yalnızca birkaç dakika sürer. Bu uygulamanın namaz vakitleri ve takip ekranı, bulunduğunuz yerde her vaktin tam olarak ne zaman girdiğini gösterir.",
      "Her namaz rekât denen birimlerden oluşur (sabah namazı iki, öğle/ikindi/yatsı dört, akşam üç rekâttır) ve her rekât aynı temel şekli izler: okuyarak ayakta durmak (kıyam), eğilmek (rükû) ve iki secde; her konumda belirli tesbih sözleri ve Kur'an okunur.",
      "Namazdan önce abdest alırsınız — ellerin, ağzın, yüzün, kolların, başın ve ayakların kısa bir dinî temizliği — ve Mekke'deki Kâbe yönüne (kıble) dönerek namaz kılarsınız; bu uygulama size kıbleyi de gösterebilir.",
      "Bu genel bakış bilerek yüzeysel tutulmuştur. Her konumda söylenen sözlerin tam metni, adım adım uygulamalı anlatım ve başlangıç seviyesinde eksiksiz bir kurs, ayrı Namaz rehberinde yer alır — sıradaki adım olarak oradan başlayın ve sözleri okunuşu ve anlamıyla öğrenmek için yanında ifadeler rehberini kullanın.",
    ],
    appLinks: [{ label: "Namaz Öğren — tam rehber" }, { label: "Namaz ifadeleri (okunuşlarıyla)" }],
  },
  {
    title: "Abdest: Namaza Hazırlanmak",
    summary: "Bedeni ve kalbi Allah'ın huzurunda durmaya hazırlayan kısa bir dinî temizlik.",
    body: [
      "Abdest her namazdan önce gereklidir (önceden aldığınız abdest hâlâ geçerli değilse) ve belirli bir sırayı izler: elleri yıkamak, ağzı ve burnu çalkalamak, yüzü yıkamak, kolları dirseklerle birlikte yıkamak, başı ve kulakları meshetmek ve ayakları topuklarla birlikte yıkamak.",
      "Öğrenildikten sonra uzun sürmez — çoğu kişi iki dakikadan kısa sürede alır — ve manevi bir anlam da taşır: hadis literatüründe yıkanan her uzuv, küçük kusurların da onunla birlikte yıkanıp gitmesi fikriyle birlikte anılır.",
      "Bu uygulamadaki kapsamlı Temizlik (Taharet) rehberi, abdesti adım adım anlatır ve abdestinizin hâlâ geçerli olup olmadığından emin olmadığınızda ne yapmanız gerektiğini de açıklar.",
    ],
    appLinks: [{ label: "Temizlik (Taharet) rehberi" }],
  },
  {
    title: "Namazın Sözlerini Öğrenmek",
    summary: "Okunuş ve anlamla başlayın; Arapçadaki akıcılık zamanla tekrarla gelir.",
    body: [
      "Namaz Arapça kılınır ve bu, başta en zor kısım gibi gelebilir — ancak başlamak için akıcı olmanız beklenmez. Yeni Müslümanların çoğu, Arapçasının yanında okunuşu ve anlamıyla birlikte bir avuç kısa ve temel ifadeyi (iftitah tekbiri, kısa bir sure, rükû ve secdede söylenen sözler ve sondaki selam) öğrenerek başlar.",
      "Bunları bir seferde değil küçük parçalar hâlinde ezberleyin ve her gün tekrar edin — namaz ifadeleri, siz bilinçli olarak bir şey ezberlemeye çalışmadan önce bile, namaz kılmanın kendisindeki tekrar sayesinde hızla hafızaya yerleşir.",
      "Bu uygulamadaki ifadeler rehberi, her temel ifadeyi Arapçası, okunuşu ve anlamıyla bir arada, namazda söylendiği yere göre düzenlenmiş olarak sunar — onu günlük çalışma aracınız olarak kullanın.",
    ],
    appLinks: [{ label: "Namaz ifadeleri rehberi" }],
  },
  {
    title: "İlk Adımlar Kontrol Listeniz",
    summary: "İlk haftalarınızda bir şeyleri öğrenmek için basit ve gerçekçi bir sıra.",
    body: [
      "Şehadetten sonra öğrenmenin zorunlu tek bir sırası yoktur; ancak yeni Müslümanlar, hiçbir şey bir anda bunaltıcı gelmesin diye kabaca bir sıralamayı çoğu zaman faydalı bulur. Bunu bir yarış olarak değil, esnek bir rehber olarak kullanın.",
    ],
    actions: [
      "Abdesti öğrenin ve doğal gelene kadar pratik yapın.",
      "İfadeler rehberini kullanarak tam bir namazın temel sözlerini öğrenin.",
      "Başta kusurlu da olsa günlük beş vakit namazı kılmaya başlayın — başlangıçta mükemmellikten çok devamlılık önemlidir.",
      "Uyanırken, yemek yerken ve evden çıkarken okunan birkaç kısa günlük duayı öğrenin.",
      "Destek ve sorularınız için yakınınızda bir cami ya da çevrim içi bir topluluk bulun.",
      "Her gün biraz olmak üzere Kur'an'ı mealinden okumaya başlayın.",
      "Kendinizi hazır hissettiğinizde, kendi hızınızda, güvendiğiniz birine — ailenizden birine ya da yakın bir arkadaşınıza — söyleyin.",
    ],
  },
  {
    title: "Cemaat Bulmak",
    summary:
      "Diğer Müslümanlarla birlikte öğrenmek, yolculuğu kolaylaştırır ve daha sevinçli kılar.",
    body: [
      "İslam yalnızca bireysel olarak değil, cemaat içinde yaşanmak içindir. Cemaatle namaz, yakındaki bir cami ve Müslüman arkadaşlar gündelik sorularınızı (“Unutursam namazda bunu nasıl söylerim?”) cevaplayabilir, sizi cesaretlendirebilir ve yeni bir tecrübede kendinizi daha az yalnız hissetmenizi sağlar.",
      "Nereden başlayacağınızdan emin değilseniz, camilerin çoğu yeni Müslümanları sıcak bir şekilde karşılar ve çoğu zaman yeni gelenlere temel konularda yardım etmekten özellikle memnun olan biri bulunur — sormak tuhaf değil, olağan ve beklenen bir şeydir.",
      "Şu an yüz yüze gidebileceğiniz bir cami yoksa, çevrim içi topluluklar ve bu uygulamanın kendi rehberleri, bir cami bulana kadar — ya da durumunuz buysa kalıcı olarak — bu boşluğu doldurabilir; her iki durumda da geniş Müslüman topluluğunun (ümmet) tam bir parçasısınız.",
    ],
    actions: [
      "Yakınınızdaki camileri veya İslami merkezleri araştırın ve bir namaz vaktinde ya da bir etkinlikte ziyaret etmeyi düşünün.",
      "Yüz yüze bir topluluğa henüz ulaşamıyorsanız, destek için denetimli bir çevrim içi Müslüman topluluğu arayın.",
    ],
  },
  {
    title: "Öğrenmeye Devam Etmek",
    summary:
      "Bu rehber bir başlangıç noktasıdır — hazır olduğunuzda sizi üç kapsamlı rehber bekliyor.",
    body: [
      "Bu rehberdeki temel konular size rahat gelmeye başladığında, bu uygulamadaki üç tamamlayıcı rehber sizi daha derine götürmek için hazırlanmıştır: imanın her esasının ayrıntıları için Akide, gündelik anlara dair dualar için Dua Öğren ve günlük tilavet ve tefekkür için Kur'an okuyucusu.",
      "Hiçbirini hızla bitirmek zorunda değilsiniz. İslam bir ömür boyu öğrenilir ve aynı konuya aylar ya da yıllar sonra, daha fazla tecrübeyle geri dönmek tamamen olağandır — hatta beklenen bir şeydir.",
    ],
    appLinks: [{ label: "Akide Öğren" }, { label: "Dua Öğren" }, { label: "Kur'an Oku" }],
  },
  {
    title: "SSS: İlk Dönemde Sık Yapılan Hatalar",
    summary: "Herkes kusurlu başlar — ilk tökezlemelere nasıl bakmanız gerektiği burada.",
    body: [
      "S: Namazın bazı kısımlarını sürekli karıştırıyor ya da sözleri unutuyorum — bu bir sorun mu? C: Hayır. Öğrenirken herkes sözleri unutur ve adımları karıştırır; ifadeler rehberiyle pratik yapmaya devam edin, birkaç hafta içinde doğal hâle gelecektir. Öğrenirken samimiyet, başlangıçtaki mükemmellikten çok daha önemlidir.",
      "S: Her şeyi (oruç, nafile namazlar, Kur'an ezberi) hemen yapamadığım için suçluluk duyuyorum. C: Her şeyi bir anda yapmaya çalışmak, yeni Müslümanların sık düştüğü ve çoğu zaman tükenmişliğe yol açan bir hatadır. İlk istikrarlı alışkanlığınız olarak günlük beş vakit namazı oturtun, sonra yavaş yavaş ekleyin — Allah hiç kimseye gücünün üstünde yük yüklemez.",
      "S: Bir namazı kaçırırsam ya da namazda bir hata yaparsam ne olur? C: Düzeni öğrenirken ara sıra bir namazı kaçırmak ya da namazda küçük bir hata yapmak dünyanın sonu değildir — hatırladığınızda kaza edin, devam edin ve bir aksaklığın sizi bir sonraki namazı kılmaktan alıkoymasına izin vermeyin.",
    ],
    actions: [
      "Bir hata yaptığınızda, bunu vazgeçmek için bir sebep olarak değil, öğrenmenin olağan bir parçası olarak görün.",
    ],
  },
  {
    title: "SSS: Arapça Öğrenmem Gerekir mi?",
    summary:
      "Arapça yıllar içinde sizinle birlikte gelişir — ibadete başlamanın ön şartı değildir.",
    body: [
      "S: Namaz kılabilmek ya da Kur'an okuyabilmek için önce Arapça konuşabilmem gerekir mi? C: Hayır. Bugün bir avuç kısa ifadenin okunuşuyla namaza başlayabilir, Arapça tilavetiniz zamanla tekrar yoluyla gelişirken Kur'an'ı kendi dilinizde okuyabilirsiniz.",
      "S: Öğrenirken Arapçayı yanlış telaffuz etmek saygısızlık mı? C: Hayır — her nesildeki her kâri bir zamanlar acemiydi. Öğrenirken gösterilen gayret değerlidir; mükemmellik başlangıç şartı değil, uzun vadeli bir hedeftir.",
      "S: Arapça okumayı öğrenmek için (sohbet için değil, namaz için) bir kursa katılmalı mıyım? C: Pek çok yeni Müslüman, namazın temelleri rahat gelmeye başladığında kısa bir Kur'an okuma (temel tecvit) kursunu çok faydalı bulur — bu ilk adım değil, iyi bir sonraki adımdır.",
    ],
    actions: [
      "Tilavet doğal gelene kadar Arapçanın yanında okunuşu ve anlamı kullanmaya devam edin — bunun bir son tarihi yok.",
    ],
  },
  {
    title: "SSS: Aile ve İlişkiler",
    summary: "İnançlar artık farklı olsa bile aileye iyilik bir görev olmaya devam eder.",
    body: [
      "S: Ailem Müslüman değil ve nasıl tepki vereceklerinden endişeliyim — İslam burada benden ne ister? C: Anne babaya ve aileye iyilik, inanç farklı olsa bile Kur'an'da emredilmiştir: “… onlara itaat etme; dünya işlerinde onlarla güzel geçin” (itaat etmeme, imanınızdan ödün vermenizi gerektiren konularla sınırlıdır). Yeni inancınız sizi ailenize karşı açıkça daha yumuşak ve daha vefalı kılmalı, daha az değil.",
      "S: Aileme nasıl söyleyebilirim ya da anlaşmazlığı bir krize dönüşmeden nasıl idare edebilirim? C: Tek bir doğru yol yoktur — hız, zamanlama ve ne kadarını paylaşacağınız, ailenize ve güvenliğinize bağlıdır. Bu gerçekten kişisel bir karardır; zor konuşmalardan önce durumu güvendiğiniz mahallî bir imamla, bir danışmanla ya da tecrübeli bir ihtida destek grubuyla konuşmak, bunu tamamen tek başınıza yürütmeye çalışmaktan daha akıllıcadır.",
      "S: Müslüman olmayan ailemle ya da arkadaşlarımla bağlarımı koparmak zorunda mıyım? C: Hayır — güzel ilişkileri sürdürmek ve akrabalık bağlarını gözetmek (sıla-i rahim) İslam'da bir görev olmaya devam eder. Belirli uygulamalara (örneğin bazı kutlamalara veya etkinliklere) dair sınırlar ise ayrı ve kişisel bir konudur; bunu en iyi, durumunuzu bilen bilgili bir mahallî hocayla konuşabilirsiniz.",
    ],
    disclaimer:
      "Bu SSS, ilk dönemde sık sorulan sorular için fetva niteliği taşımayan genel bir rehberlik sunar. Ailenize, güvenliğinize veya kişisel şartlarınıza özgü durumlar için lütfen mahallî bir imamla, ehil bir danışmanla ya da güvendiğiniz bir cemaat büyüğüyle konuşun.",
  },
];
