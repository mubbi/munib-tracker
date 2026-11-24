import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// tr overlay for islamic-finance. Index-aligned with ISLAMIC_FINANCE_TOPICS in ../islamic-finance.ts.
export const ISLAMIC_FINANCE_TOPICS_TR: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "İslami Finans Nedir?",
    summary:
      "Paraya ahlaki bir bakış; ayrı bir ürün kategorisi değil — bu rehber yalnızca eğitim amaçlıdır.",
    body: [
      "İslami finans bir yatırım ürünü markası değildir; paranın nasıl kazanıldığına, ödünç verildiğine, harcandığına ve bağışlandığına İslam ahlakının uygulanmasıdır. Özünde bir avuç ilke vardır: servet başlı başına bir amaç değil, Allah'ın bir emanetidir; işlemler sömürüden ve aşırı belirsizlikten arınmış olmalıdır; kâr ise bir borç üzerinden garanti edilmiş bir bedele değil, gerçek ekonomik faaliyete ve paylaşılan riske dayanmalıdır.",
      "Bu rehber söz konusu ilkeleri genel ve eğitici bir düzeyde tanıtır: riba (faiz/tefecilik) yasağı, ticarette adalet, zekât ve gönüllü sadaka yükümlülükleri ve tekafülün (yardımlaşmaya dayalı sigorta) temel kavramı. Bilerek fon taraması yapmaz, hisse senedi veya borsa yatırım fonu listelemez ve belirli bir ürün ya da kurum önermez.",
      "Modern finansal ürünler (konut kredileri, kredi kartları, sigorta poliçeleri, emeklilik hesapları ve daha fazlası) pek çok farklı şekilde yapılandırılır ve bunlara dair hükümler sözleşmenin tam şartlarına ve bulunduğunuz ülkenin hukukuna bağlı olabilir. Bu rehber size temel ilkeleri verir; kendi durumunuza dair bir hüküm için ehil ve sertifikalı bir İslami finans âlimiyle veya kurumuyla görüşün.",
    ],
    disclaimer:
      "Yalnızca eğitim amaçlı içeriktir — finansal tavsiye ve fetva değildir. Belirli hiçbir fonu, hisse senedini, kurumu veya finansal ürünü önermez, taramaz ya da derecelendirmez.",
  },
  {
    title: "Emanet Olarak Servet",
    summary:
      "Sahip olduğunuz her şey nihayetinde Allah'ındır — siz onun gerçek sahibi değil, emanetçisisiniz.",
    body: [
      "Kur'an'da tekrar tekrar işlenen bir tema, servetin öncelikle Allah'a ait olduğudur; insan yalnızca bir süreliğine onun emanetçisidir ve nasıl kazanıldığından ve nasıl kullanıldığından sorumludur. Bu bakış, parayı salt kişisel bir mülk olmaktan çıkarıp hakkında hesap sorulacak bir şeye dönüştürür — nereden geldiği ve nereye gittiği.",
      "Bu emanetin başkalarıyla ilişkilerde nasıl yaşanacağını iki emir belirler: akitleri ve anlaşmaları eksiksiz yerine getirmek ve başkasının malını asla haksızlık, aldatma ya da sömürü yoluyla değil, yalnızca karşılıklı rızaya dayalı adil ticaretle almak.",
      "Bu ilkeler birlikte ele alındığında, İslami finans ahlakının neden hep aynı birkaç soruya döndüğü anlaşılır: Bu kâr gerçek emek, risk ve değer üretimiyle mi kazanıldı? Karşı tarafa tam bir dürüstlükle davranıldı mı? Üstlendiğim bir yükümlülük yerine getiriliyor mu?",
    ],
  },
  {
    title: "Riba Yasağı",
    summary: "Riba (faiz/tefecilik), Kur'an'da en sert biçimde kınanan işlemlerden biridir.",
    body: [
      "Riba — genellikle faiz ya da tefecilik olarak çevrilir; geniş anlamıyla bir borç üzerine önceden belirlenmiş, garanti edilmiş her türlü fazlalıktır — Bakara suresinin art arda gelen beş ayetinde (2:275–279) alışılmadık derecede sert bir dille yasaklanır; bu, Kur'an'da tek bir konuda yapılan en ağır uyarılar arasındadır.",
      "Bu pasaj bilinçli bir karşıtlık kurar: “Allah alışverişi helal, faizi haram kıldı” (2:275). Ticaret — her iki tarafın da gerçek risk ve emeği paylaştığı alım, satım ve yatırım — övülür; sonuç ne olursa olsun ödenmesi gereken sabit bir bedel olan riba ise kınanır. Sure, müminlere kalan bütün ribadan tamamen vazgeçmelerini emreder, bunda ısrar edenleri ciddi sonuçlara karşı uyarır ve tövbe edenin yalnızca anaparasını — ne fazla ne eksik — alabileceğini bildirir.",
      "Bu, her modern finansal ürünü kendi başınıza denetlemeniz için bir kontrol listesi değil, bilinmesi gereken temel bir öğretidir. Belirli bir sözleşmenin (konut kredisi, borç, mevduat hesabı) uygulamada riba içerip içermediğini anlamak, gerçek şartlarının İslami finans konusunda ehil biriyle birlikte incelenmesini gerektirir.",
    ],
  },
  {
    title: "Ticaret Neden Faizden Farklıdır?",
    summary:
      "Meşru kâr risk ve emekle bağlantılıdır; riba ise sonuç ne olursa olsun garanti edilmiş bir bedeldir.",
    body: [
      "Bu ayrımı akılda tutmanın basit bir yolu şudur: ticarette ya da gerçek bir yatırımda sermaye veya mal sağlayan kişi sonuca ortak olur — kâr edebilir ama zarar da edebilir, çünkü bir girişimin gerçek performansına maruz kalır. Ribaya dayalı bir borçta ise borç verene, borç alanın girişimi başarılı olsa da, zorlansa da, batsa da sabit bir getiri garanti edilir.",
      "Klasik âlimler bunu bir adalet meselesi olarak ele alır: acil ihtiyaç içinde borç alan bir kişi, borç aldığından çok daha fazlasını geri ödemeye mahkûm edilebilir; risk tamamen ona yüklenir, borç verene hiç yüklenmez — Kur'an'ın “Allah faizi eksiltir, sadakaları bereketlendirir” (2:276) ifadesiyle kınadığı dengesizlik tam olarak budur; bu ifade, sömürüyle kurulan servet ile cömertlikle büyüyen servet arasında doğrudan bir karşıtlıktır.",
      "Bu, genel ve eğitici bir karşılaştırmadır; belirli bir finansal araç hakkında hüküm değildir (bazı modern yapılar ticaret ile borç vermeyi karmaşık biçimlerde iç içe geçirir). Belirli bir ürünün bu yelpazenin neresinde durduğu, yalnızca genel ilkelere bakarak karar verilecek bir konu değil, tam da ehil bir İslami finans âlimine ya da sertifikalı bir danışmana götürülmesi gereken bir sorudur.",
    ],
  },
  {
    title: "Sünnet Ribayı Ne Kadar Ciddiye Alır?",
    summary:
      "Peygamber ﷺ, bir riba işlemine dahil olan herkesin onun günahına ortak olduğunu bildirmiştir.",
    body: [
      "Kur'an'ın kendi uyarılarının ötesinde Peygamber ﷺ, riba sorumluluğunun yalnızca onu doğrudan talep edenle sınırlı olmadığını açıkça ortaya koymuştur. Sahih bir hadiste onun ﷺ, ribayı yiyene, yedirene, sözleşmesini yazana ve iki şahidine lanet ettiği ve hepsinin bunda eşit olduğunu söylediği rivayet edilir.",
      "Bundan genellikle çıkarılan ders, yalnızca bireysel suçlama değil, topluca kaçınmadır: riba, sadece borç veren ile borç alan arasındaki özel bir mesele olarak değil, bütün bir işlemin ve ona bilerek taraf olan herkesin uzak durması gereken bir şey olarak ele alınır.",
      "Kur'an ayetlerinde olduğu gibi bu hadis de ilkenin ciddiyetini ortaya koyar; belirli bir modern finansal ürünü nasıl sınıflandıracağınızı kendi başına söylemez. Bu takdir, gerçek sözleşmeyi inceleyen ehil âlimlere aittir.",
    ],
  },
  {
    title: "Ticarette Dürüstlük",
    summary: "Dürüst ve güvenilir tüccara ahirette en yüksek derecelerden biri verilir.",
    body: [
      "Ribaya dair uyarıların tam aksine, dürüst ticaret defalarca övülür. Peygamber Muhammed ﷺ peygamberliğinden önce bizzat ticaretle uğraşmış ve peygamber olarak tanınmasından çok önce, iş ilişkilerindeki dürüstlüğü sebebiyle Mekke'de el-Emîn — “güvenilir” — lakabıyla tanınmıştı.",
      "O ﷺ daha sonra şöyle öğretmiştir: “Dürüst ve güvenilir tüccar; Peygamberler ve peygamberleri tasdik eden doğru kimseler ve şehîdlerle beraberdir.” Bu, çarşıda adil davranmak gibi sıradan bir şeye bağlanmış olağanüstü yüksek bir mertebedir.",
      "Uygulamada adil ticaret şunlar demektir: mal ve hizmetleri doğru tarif etmek, bilinen kusurları gizlemek yerine açıklamak, kararlaştırılan fiyat ve şartlara uymak ve aldatmaktan, yanıltıcı reklamdan ya da alıcının veya satıcının bilgisizliğini istismar etmekten kaçınmak. Bunlar her gelenekte iyi ve sürdürülebilir ticareti sağlayan aynı içgüdülerdir — İslam ise bunları ayrıca ebedî mükâfata bağlar.",
    ],
  },
  {
    title: "Modern Finansal Ürünler Karşısında Yol Bulmak",
    summary:
      "Konut kredileri, kredi kartları ve sigorta gerçekten karmaşıktır — bu rehber ilkelerde durur.",
    body: [
      "Modern finansal hayat, ilk Müslüman nesillerin bugünkü biçimleriyle hiç karşılaşmadığı ürünleri içerir: konut kredileri, kredi kartları, emeklilik hesapları, sigorta ve pek çok farklı şekilde yapılandırılmış yatırım fonları. Asırlık ilkeleri bu ürünlere uygulamak, birkaç genel ayetten yola çıkarak tek başına akıl yürütülecek bir şey değil, gerçek ve titiz bir ilmî çalışmadır.",
      "Bu nedenle günümüzdeki İslami finans kurumları ve sertifikalı âlimler, modern sözleşmeleri bu ilkelere uygunluk açısından incelemekte özel olarak uzmanlaşır ve çoğu zaman belirli ürünler veya yapılar hakkında ayrıntılı hükümler ortaya koyar. Bu uzmanlık gerektiren inceleme, bu uygulamanın kapsamı dışındadır.",
      "Gerçek bir finansal kararı tartıyorsanız — bir ev alımı, bir borç, bir yatırım, bir sigorta poliçesi — sorumlu bir sonraki adım, bu rehber gibi genel eğitim içeriklerine güvenmek değil, gerçek sözleşme şartlarına bakabilecek ehil ve sertifikalı bir İslami finans danışmanına veya âlimine başvurmaktır.",
    ],
    disclaimer:
      "Bu uygulama belirli hiçbir finansal ürünü, fonu veya kurumu değerlendirmez, taramaz ya da önermez; bu rehber de kendi mali durumunuzla ilgili ehil mesleki veya ilmî tavsiyenin yerini tutmaz.",
  },
  {
    title: "Zekât: Malla Yapılan İbadet",
    summary: "Zekât, sözle ya da hareketle değil, malla yerine getirilen farz bir ibadettir.",
    body: [
      "Zekât — asgari bir sınırın (nisap) üzerindeki zekâta tabi servet üzerinden her yıl ödenen, oranı belirlenmiş farz bir paydır — İslam'ın beş şartından biridir; vermeyi isteğe bağlı bir cömertlik olarak değil, namaz ve oruçla aynı seviyede ele alır.",
      "Kur'an, zekâtı gerçek imanın bir göstergesi olarak sürekli namazla birlikte anar ve hem namazı kılıp hem zekâtı verenler için şöyle buyurur: “… Rab'leri katında ecirleri vardır. Onlara korku yoktur ve onlar üzülmeyeceklerdir.” Mali açıdan zekât, bir serveti arındırma mekanizması işlevi görür — birikmiş servetin küçük ve düzenli bir payını, birkaç elde süresiz olarak atıl kalmasına izin vermek yerine ihtiyaç sahiplerine yeniden dağıtır.",
      "Hesaplama sizin birikimlerinize, varlıklarınıza ve yerel nisap değerlerine bağlı olduğundan, bu uygulamada ayrı bir Zekât rehberi ve hesaplayıcısı vardır — buradaki genel ilkelerden tahmin yürütmek yerine doğrudan onu kullanın.",
    ],
    appLinks: [{ label: "Zekât rehberi ve hesaplayıcısı" }],
  },
  {
    title: "Sadaka: Gönüllü Bağış",
    summary:
      "Farz olan zekâtın ötesindeki her gönüllü bağışa sadaka denir — ve aslında size hiçbir şey kaybettirmez.",
    body: [
      "Sadaka, Allah rızası için herhangi bir miktarda ve herhangi bir zamanda verilen gönüllü bağıştır — zekâtın belirlenmiş yükümlülüğünün ötesindedir. Önemli mali bağışlardan güzel bir söz söylemek ya da birinin yolundan eziyet veren bir şeyi kaldırmak kadar küçük şeylere uzanır; hadis literatüründe bunların hepsi sadaka çeşitleri olarak sayılır.",
      "Vermekte tereddüt eden herkes için en güven verici öğretilerden biri, Peygamber'in ﷺ sadakanın malı eksiltmediğini bildirmesidir — Kur'an da başka yerlerde Allah yolunda harcamayı, sadece tükenen bir şey olarak değil, Allah'ın yerine koyduğu ve karşılığını verdiği bir şey olarak anlatarak bunu destekler.",
      "Uygulamada bu, cömertliğe bakışı değiştirir: vermek, mali güvenliğinizle yarışan bir şey değil, onu her zaman bir bilançoda görünmeyen yollarla koruyan ve büyüten bir şey olarak sunulur.",
    ],
    appLinks: [{ label: "Zekât ve sadaka rehberi" }, { label: "Sadaka hedefleri" }],
  },
  {
    title: "Tekafül: Yardımlaşmaya Dayalı Risk Paylaşımı",
    summary: "Geleneksel sigortaya İslami alternatiflerin ardındaki kavrama genel bir bakış.",
    body: [
      "Tekafül (karşılıklı kefalet anlamına gelen Arapça bir kökten), sigorta benzeri korumaya yönelik İslami yaklaşımların ardındaki genel kavramdır: bir grup katılımcı ortak bir fona katkıda bulunur ve bu fon, kapsam dahilindeki bir zarara uğrayan üyelere yardım etmek için kullanılır; varsa fazlası, ayrı bir sigortacının garantili kârı olarak tutulmak yerine genellikle katılımcılar arasında paylaştırılır ya da sonraki döneme aktarılır.",
      "Temel fikir, garantili bir prim karşılığında riskin devredilmesi değil, yardımlaşmaya dayalı risk paylaşımıdır: katılımcılar birbirlerine karşılıklı yardım eden kişiler olarak görülür; fonun işletmecisi ise genellikle riski üstlenen taraf olarak değil, ücret karşılığında yönetici ya da vekil olarak hareket eder.",
      "Bu yalnızca genel ve kavramsal bir tanımdır. Gerçek tekafül ürünleri kurumlara ve ülkelere göre yapı bakımından büyük farklılıklar gösterir; belirli bir planın gerçekten bu şekilde yapılandırılıp yapılandırılmadığını değerlendirmek, gerçek şartlarının ehil bir İslami finans âlimi veya kurumuyla incelenmesini gerektirir — bu uygulama belirli hiçbir tekafül (veya sigorta) kurumunu ya da planını önermez veya değerlendirmez.",
    ],
    disclaimer:
      "Yalnızca genel eğitim amaçlıdır. Bu, tekafülün geleneksel sigortaya ya da belirli bir kurum veya plana tercih edilmesi yönünde bir tavsiye değildir — kendi durumunuz için ehil bir danışmana başvurun.",
  },
  {
    title: "Tekafül ve Geleneksel Sigortanın Genel Karşılaştırması",
    summary:
      "İkisinin amacı ortaktır — riski yönetmek — ama bu riskin nasıl yapılandırıldığı farklıdır.",
    body: [
      "Geleneksel sigorta genellikle, poliçe sahibinin prim ödediği ve ayrı bir ticari taraf olan sigortacının bu ücret karşılığında riski üstlendiği bir sözleşme olarak yapılandırılır; prim havuzu çoğu zaman faiz getirili araçları da içerebilecek şekillerde yatırıma yönlendirilir. Bazı klasik âlimler bu yapının riba, garar (ödeme konusunda aşırı belirsizlik) ve riskin paylaşılmak yerine sabit bir ücret karşılığında devredilmesi gibi konulara temas ettiği yönünde endişelerini dile getirmiştir.",
      "Tekafül, genel olarak bu belirli endişeleri karşılıklı ve yardımlaşmaya dayalı bir yapıyla gidermeye yönelik bir girişim olarak geliştirilmiştir — ancak âlimler ve kurumlar, tam olarak hangi yapıların bu amaca tamamen ulaştığı konusunda farklı görüşlere sahiptir ve tekafül kurumlarının kendileri de tasarım bakımından önemli ölçüde farklılık gösterir.",
      "Hem endişeler hem de alternatif yapılar gerçek teknik ayrıntılar içerdiğinden (ve bulunduğunuz yer, teminat ihtiyaçları ve mevcut kurumlar gibi kişisel şartlar son derece farklılık gösterdiğinden), bu karşılaştırma yalnızca genel bir arka plan olarak sunulmaktadır — düşünüyor olabileceğiniz belirli bir poliçe hakkında bir hüküm olarak değil.",
    ],
    disclaimer:
      "Yalnızca eğitim amaçlı bir karşılaştırmadır; genel olarak sigorta veya tekafül ya da belirli bir ürün hakkında fetva değildir. Âlimlerin modern sigorta yapıları hakkında çeşitli görüşleri vardır; kendi durumunuz için ehil bir danışmana başvurun.",
  },
  {
    title: "SSS: Bu Bir Finansal Tavsiye mi?",
    summary: "Hayır — bu rehber yalnızca ilkeleri öğretir ve ehil bir tavsiyenin yerini tutamaz.",
    body: [
      "S: Belirli bir kredinin, yatırımın veya sigorta ürününün benim için caiz olup olmadığına karar vermek için bu rehberi kullanabilir miyim? C: Hayır. Bu rehber parayla ilgili genel İslami ilkeleri açıklar — sözleşmeleri incelemez, ürün önermez ve hüküm vermez. Belirli finansal kararlar ehil bir finans uzmanıyla ve caizlik soruları için ehil bir İslami finans âlimiyle birlikte verilmelidir.",
      "S: Bu uygulama helal hisse senetlerini, fonları veya borsa yatırım fonlarını derecelendiriyor ya da listeliyor mu? C: Hayır ve bu rehberin bir parçası olarak asla yapmayacak — fon taraması ve yatırım tavsiyeleri kapsamının dışındadır ve bu içeriğin sağlamadığı lisanslı finansal uzmanlık gerektirir.",
      "S: Bu rehber bir fetva mı? C: Hayır. Fetva, ehil bir âlimin belirli bir soruya ve bağlama cevap olarak verdiği belirli bir dinî hükümdür. Bu rehber yalnızca genel ilkeleri öğretir; kendi durumunuzla ilgili gerçek bir hüküm için doğrudan ehil ve güvenilir bir âlime başvurun.",
    ],
    disclaimer:
      "Bu rehberin tamamı eğitim içeriğidir; finansal tavsiye ve fetva değildir. Kendi paranızla ilgili kararlar için her zaman ehil finans ve din uzmanlarına danışın.",
  },
  {
    title: "SSS: Şer'î Esaslara Uygun Seçenekleri Nasıl Bulurum?",
    summary:
      "Bir liste değil, sertifikalı bir uzmanlık arayın — bu uygulama bilerek böyle bir liste sunmaz.",
    body: [
      "S: Helal bankaların, fonların veya yatırım platformlarının bir listesini nerede bulabilirim? C: Tasarım gereği bu uygulamada değil — ürün listeleri sürekli değişir, ülkeden ülkeye büyük farklılıklar gösterir ve ancak uzman kurumların gereği gibi sürdürebileceği kesintisiz bir uygunluk denetimi gerektirir. Bunun yerine, isimleri belli gerçek bir danışma (şer'î denetim) kuruluna ve yayımlanmış bir uygunluk metodolojisine sahip kurumları arayın.",
      "S: Bir âlimin veya sertifikanın meşru olup olmadığını nasıl anlarım? C: Gayriresmî çevrim içi iddialar yerine, bölgenizde ya da uluslararası alanda köklü İslami finans standart belirleyici kuruluşlarınca tanınan âlimleri veya kurulları arayın. Saygın bir kurum, ürünlerini kimin ve nasıl incelediği konusunda şeffaf olacaktır.",
      "S: Yaşadığım yerde hiç İslami finans seçeneği bulamazsam ne yapmalıyım? C: Bu gerçek ve yaygın bir durumdur. Bunu bilgili bir mahallî imamla veya âlimle konuşun — size özgü şartlarda mevcut seçenekleri tartmanıza yardımcı olabilirler, çünkü bu konudaki rehberlik büyük ölçüde sizin için gerçekten hangi alternatiflerin bulunduğuna bağlı olabilir.",
    ],
    actions: [
      "Pazarlama iddialarına güvenmek yerine, isimleri belli ve şeffaf bir şer'î denetim kuruluna sahip kurumları arayın.",
    ],
  },
  {
    title: "SSS: Konut Kredileri, Kartlar ve Borçlar",
    summary:
      "Bunlar, genel bir rehberin değil, tam da ehil bir âlimin cevaplaması gereken sorulardır.",
    body: [
      "S: Konut kredisi her zaman riba mıdır? C: Yapılar farklılık gösterir — bazı geleneksel konut kredileri faize dayalı borçlardır; bazı kurumlar ise faizden kaçınmayı amaçlayan alternatif yapılar (azalan ortaklık veya kiralayarak mülk edinme modelleri gibi) sunar. Belirli bir ürünün bunu uygulamada başarıp başarmadığı, gerçek sözleşmesiyle ilgili ilmî bir sorudur; her iki yönde de varsayımda bulunulacak bir şey değildir.",
      "S: Bakiyenin tamamını her zaman öder ve hiç faiz ödemezsem kredi kartı kullanabilir miyim? C: Âlimlerin bu konuda farklı görüşleri vardır; bunun bir sebebi, uygulamada hiç tetiklenmese bile temel sözleşmenin teknik olarak bir faiz maddesi içerebilmesidir. Bu, ehil görüşlerin gerçekten ayrıştığı bir alandır — tek ve evrensel bir cevap varsaymak yerine güvendiğiniz bir âlime sorun.",
      "S: Bazı şartlarda kaçınılmaz olabilen öğrenim kredileri veya diğer borçlar ne olacak? C: Zaruret ve meşakkat, âlimlerin dikkatle tarttığı gerçek etkenlerdir ve görüşler şartlara ve ülkeye göre değişir. Böyle bir kararla karşı karşıyaysanız, meseleyi yalnızca genel okumalarla çözmeye çalışmak yerine kendi özel durumunuzu ehil bir âlime götürün.",
    ],
    disclaimer:
      "Bunlar gerçekten ihtilaflı ve sözleşmeye özgü sorulardır. Bu SSS size yalnızca her birinin ne tür bir soru olduğunu gösterir — hiçbirini sizin durumunuz için cevaplamaz.",
  },
];
