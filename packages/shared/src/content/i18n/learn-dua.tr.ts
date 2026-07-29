import type { LearnDuaOccasion, LearnDuaTopic } from "../../types/learn-dua";
import type { DeepPartial } from "./localize";

// Turkish translation overlay for the Learn Dua content. Mirrors the order of
// LEARN_DUA_TOPICS / LEARN_DUA_OCCASIONS in ../learn-dua*.ts (index-aligned);
// untranslated entries fall back to English. Only human-readable text is
// translated — ids, routes, surah/ayah numbers, collections, citations and
// grades stay in the English source. Arabic script (`arabic`) is kept verbatim.
export const LEARN_DUA_TOPICS_TR: DeepPartial<LearnDuaTopic>[] = [
  // Intro
  {
    title: "Dua nedir?",
    summary: "Dua ibadettir: Allah'a doğrudan, tevazu ve ümitle yönelmektir.",
    body: [
      "Dua (دعاء), Allah'a yönelmek demektir — O'ndan hayır, mağfiret, hidayet ve korunma dilemek, ihtiyaç anında yalnızca O'na sığınmaktır. Bu, sıradan bir davranış değildir; Peygamber ﷺ, 'Dua ibadettir' buyurmuş, ardından Allah'ın şu emrini okumuştur: 'Bana dua edin, size icabet edeyim.' Allah'tan bir şey dilemek, tevhidin ta kendisidir; çünkü bu, yalnızca O'nun işittiğini, yalnızca O'nun sahip olduğunu ve tüm sonuçların yalnızca O'nun elinde bulunduğunu kabul etmektir.",
      "Dua, iç içe geçen iki türden oluşur: dua-i mesele, yani Allah'tan bir şey istemek; ve dua-i ibadet, yani namaz, zikir ve itaatle O'na kulluk etmek — çünkü her ibadet, aslında O'nun kabulünü ve mükâfatını sessizce dilemektir. İşte bu yüzden duayı Allah'tan başkasına yöneltmek bir şirk çeşididir: bu, yalnızca O'na ait olanı başkasına vermektir.",
      "Mümin, rahatlıkta da zorlukta da, açıktan da gizlice de dua eder; Allah'ın her çağrıyı işittiğine ve samimi bir kulu asla eli boş çevirmediğine emin olarak. O, o kadar yakındır ki şöyle buyurur: 'Bana dua edince, dua edenin duasına icabet ederim.'",
      "İcabet, Peygamber'in ﷺ öğrettiği üç şekilden birinde gerçekleşir: ya Allah istenen şeyi verir; ya da onu geri tutup ahirette eşiti veya daha fazlasını mükâfat olarak biriktirir; ya da eşiti kadar bir zararı ondan uzaklaştırır. Böylece samimi hiçbir dua gerçekte cevapsız kalmaz — bazen en büyük rahmet, göremediğimiz bir cevabın içindedir.",
    ],
    quran: [
      { excerpt: "And your Lord says, 'Call upon Me; I will respond to you.'" },
      {
        excerpt:
          "And when My servants ask you concerning Me — indeed I am near. I respond to the call of the caller when he calls upon Me.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dua is worship. — then he ﷺ recited, 'And your Lord says, Call upon Me; I will respond to you.' (an-Nu'man ibn Bashir)",
      },
    ],
    appLinks: [{ label: "Duaları keşfet" }],
  },
  {
    title: "Duanın âdâbı",
    summary: "Hamd ile başla, salavat getir, samimiyetle dile, ve asla ümidini kesme.",
    body: [
      "Duanın, Peygamber'in ﷺ öğrettiği ve bizzat uyguladığı bir âdâbı vardır; buna riayet etmek icabeti daha da yaklaştırır. Allah'a güzel isimleriyle hamd ederek başla, sonra Peygamber'e ﷺ salavat getir — O ﷺ, dua eden kişi bu ikisini yapmadıkça duanın 'askıda' kaldığını öğretmiştir — ve ancak bundan sonra dileğini sun.",
      "Allah'a üç iç haliyle dua et: tevazu, O'nun icabet edebileceğine ve edeceğine dair kesin bir yakîn, ve O'na karşı güzel bir zan (husnü'z-zan). Mümkünse kıbleye yönel, ellerini kaldır, mübarek vakitleri seç, ve hem bu dünyanın hem de ahiretin işlerini dile. Önemli dilekleri tekrar etmek müstehaptır; başladığın gibi bitir — hamd ve salavat ile.",
      "Her şeyden önce acele etme. Peygamber ﷺ, kişi ümitsizliğe kapılıp 'Durmadan dua ettim ama icabet olunmadı' diyerek duayı bırakmadıkça, duasının kabul olunmaya devam ettiğini haber vermiştir. Dilemekte ısrar etmek, başlı başına bir ibadettir; ve Allah, kapısını çalmaya devam eden kulunu sever.",
    ],
    hadith: [
      {
        excerpt:
          "The servant's dua continues to be answered so long as he is not hasty — saying, 'I made dua but was not answered.' (Abu Hurayrah)",
      },
      {
        excerpt:
          "When one of you prays, let him begin by praising and glorifying his Lord, then send blessings upon the Prophet ﷺ, then ask for what he wishes. (Fadalah ibn 'Ubayd)",
      },
    ],
    actions: [
      "Her duaya Elhamdülillah ve Peygamber'e ﷺ salavat ile başla.",
      "Allah'a ihtiyacına en uygun isimleriyle dile (rızık için Ya Rezzak, mağfiret için Ya Gafur gibi).",
      "Duayı günlük bir alışkanlık hâline getir — her namazdan sonra, secdede, ve uyumadan önce.",
    ],
    appLinks: [{ label: "Namaz duaları" }, { label: "Salavat koleksiyonu" }],
  },
  {
    title: "Duanın kabul şartları",
    summary: "İhlas, helal kazanç ve günahtan dönüş, icabet kapılarını açar.",
    body: [
      "Âdâbın ötesinde, bazı şartlar duanın kabul edilip edilmeyeceğini güçlü biçimde etkiler. Bunların en başında ihlas gelir — hiçbir gösterişe kaçmadan ve O'nunla birlikte başka hiç kimseye yönelmeden, yalnızca Allah'a samimiyet. Duada gerçekten hazır olan bir kalp, mekanik biçimde tekrarlayan bir dilden çok daha değerlidir.",
      "Helal rızık, güçlü bir anahtardır. Peygamber ﷺ, ellerini gökyüzüne kaldırıp 'Ya Rab, ya Rab' diye seslenen bir yolcuyu tasvir etmiştir; ama 'yediği haram, içtiği haram, giydiği haram, haramla beslenmiş — böyle biri nasıl icabet görsün?' Kişinin kazancını korunması, günahtan tövbe etmesi, ve günah işlemeyi veya akrabalık bağlarını koparmayı dilememesi, dua ile onun kabulü arasındaki engelleri kaldırır.",
      "Yine de icabet, nihayetinde Allah'ın rahmetidir; bizim kontrol edebileceğimiz bir alışveriş değildir. Bu yüzden mümin, en iyi çabasını — ihlas, helal bir yaşam, tövbe — mütevazı bir tevekkülle birleştirir ve cevap gecikse dahi asla ümitsizliğe kapılmaz. Zayıflık ve geçmiş günahlar dilemeyi bırakmak için bir sebep değildir; aksine, en Merhametli olana dönmek için daha da fazla sebeptir.",
    ],
    hadith: [
      {
        excerpt:
          "…his food is unlawful, his drink unlawful, his clothing unlawful, nourished by the unlawful — so how can he be answered? (Abu Hurayrah)",
      },
      {
        excerpt:
          "The servant's dua is answered so long as he does not ask for something sinful or for the severing of family ties. (Abu Hurayrah)",
      },
    ],
    actions: [
      "Gelirini ve harcamalarını helal olup olmadığı açısından gözden geçir — bu, duanı doğrudan etkiler.",
      "Uzun dualardan önce istiğfar ve samimi bir tövbe ile başla.",
      "Duanı asla zarar, günah veya haksızlık dilemek üzere kurma.",
    ],
  },
  {
    title: "Duanın en hayırlı vakit ve mekânları",
    summary: "Bazı anlar, kabul olunan dua için özellikle mübarektir.",
    body: [
      "Dua her an icabet görse de, Peygamber ﷺ icabetin en çok umulduğu bazı anları ve halleri özellikle belirtmiştir. Dileklerini yalnızca bir sıkıntı anını beklemek yerine bu anlara bağla.",
      "En güçlü vakitler arasında şunlar sayılır: gecenin son üçte biri, Allah'ın (kendi azametine yaraşır biçimde) dünya semasına inip 'Benden isteyen yok mu, ona vereyim?' diye seslendiği an; namazdaki secde, Allah'a en yakın olunan hâl; ezan ile kamet arasındaki an; oruçlunun hâli, özellikle iftar vakti; yağmur yağarken; ve cuma gününün gün batımından önceki son saati, ki içinde hiçbir duanın reddolunmadığı bir an vardır.",
      "Mübarek yerler ve haller arasında Hac sırasında Arafat'ta durmak, Harem sınırları içinde bulunmak, ve yolcunun duası, ebeveynin çocuğu için duası, ve zulme uğrayanın duası bulunur. Bunları istikrarlı bir dua hayatı için sabit çıpalar olarak kullan.",
    ],
    hadith: [
      {
        excerpt:
          "Our Lord descends each night to the lowest heaven in the last third of the night and says: Who is calling upon Me, that I may answer him? Who is asking of Me, that I may give him? (Abu Hurayrah)",
      },
      {
        excerpt:
          "The closest a servant is to his Lord is while he is prostrating, so make much supplication therein. (Abu Hurayrah)",
      },
    ],
    appLinks: [{ label: "Salah hatırlatıcıları" }, { label: "Günlük zikirler" }],
  },

  // Daily
  {
    title: "Sabah ve akşam zikirleri",
    summary: "Günlük 'Müslümanın kalesi' — günün her iki ucunda koruma ve bağlantı.",
    body: [
      "Sabah ve akşam zikirleri, Sünnet'te en çok vurgulanan günlük zikirler arasındadır — müminin her günün başında ve sonunda tazelediği manevi bir kale. Allah, müminlere 'Allah'ı çokça anın ve O'nu sabah akşam tesbih edin' (33:41–42) diye emreder.",
      "Düzenli olarak okunduğunda, bunlar zarardan ve şeytanın vesveselerinden korur, Allah'a tevekkülü tazeler, ve günün değişen hallerinde kalbi O'na bağlı tutar. En önemlilerinden ikisi aşağıdadır; uygulamanın zikir koleksiyonu tam takımı barındırır.",
    ],
    phrases: [
      {
        title: "Seyyidü'l-İstiğfar (istiğfarın efendisi)",
        when: "Her sabah ve akşam bir kez",
        translation:
          "Allah'ım! Sen benim Rabbimsin, Senden başka ilah yoktur. Beni Sen yarattın ve ben Senin kulunum; gücüm yettiğince Sana verdiğim söz ve ahdimdeyim. Yaptığım şeylerin şerrinden Sana sığınırım. Bana olan nimetini itiraf ederim ve günahımı da itiraf ederim; öyleyse beni bağışla — çünkü günahları Senden başka kimse bağışlamaz.",
        reference:
          "Sahih al-Bukhari 6306 — kim bunu gündüz vakti buna yürekten inanarak söyler ve o gün ölürse cennet ehlindendir",
      },
      {
        title: "Hasbiyallahu la ilahe illa Hu",
        when: "Her sabah ve akşam yedi kez",
        translation:
          "Allah bana yeter, O'ndan başka ilah yoktur. O'na tevekkül ettim, ve O büyük Arş'ın Rabbidir.",
        reference:
          "Qur'an 9:129 (the words); Sunan Abi Dawud 5081 for the morning/evening practice",
      },
    ],
    appLinks: [{ label: "Sabah ve akşam zikirleri" }, { label: "Tüm dualar" }],
  },
  {
    title: "Uyandıktan sonra ve uyumadan önce",
    summary: "Günün ilk ve son sözlerini Allah'la bir bağ hâline getir.",
    body: [
      "Peygamber ﷺ, uyanma ve yatma için özel zikirler öğretmiştir; öyle ki müminin her gün ilk bilinçli sözleri şükür, son sözleri ise teslimiyet olsun. Uyku, O'nun öğrettiği gibi, 'küçük bir ölüm'dür, uyanmak ise küçük bir dirilişdir — böylece bu zikirler tüm döngüyü Allah şuuru içinde çerçeveler.",
      "Bunları düzenli okumak manevi bir istikrar inşa eder: uyanışta bir şükür alışkanlığı, uyumadan önce ise nefsi Allah'a teslim etme alışkanlığı. Peygamber ﷺ uyumadan önce özellikle Ayete'l-Kürsî'nin okunmasını teşvik etmiş ve Allah'tan bir koruyucunun okuyanla birlikte kalacağını, sabaha kadar hiçbir şeytanın ona yaklaşamayacağını müjdelemiştir.",
    ],
    phrases: [
      {
        title: "Uyanma duası",
        when: "Uyanır uyanmaz hemen",
        translation: "Bizi öldürdükten sonra dirilten Allah'a hamdolsun; dönüş de O'nadır.",
        reference: "Sahih al-Bukhari 6312",
      },
      {
        title: "Uyumadan önceki dua",
        when: "Uyumak için yatarken",
        translation: "Allah'ım! Senin adınla ölür ve yaşarım.",
        reference: "Sahih al-Bukhari 6324",
      },
      {
        title: "Uyumadan önce Ayete'l-Kürsî",
        when: "Uyumadan önce",
        translation:
          "Allah — O'ndan başka ilah yoktur, diri, her şeyi ayakta tutandır. O'nu ne bir uyuklama ne de bir uyku tutar. Göklerde ve yerde ne varsa hepsi O'nundur. O'nun izni olmadan katında kim şefaat edebilir? Onların önlerindekini ve arkalarındakini bilir; O'nun dilediği kadarından başka, O'nun ilminden hiçbir şeyi kavrayamazlar. Kürsüsü gökleri ve yeri kaplamıştır; onları koruyup gözetmek O'na ağır gelmez. O, çok yücedir, çok büyüktür.",
        reference:
          "Qur'an 2:255; Sahih al-Bukhari 2311 — a guardian remains with the reciter until morning",
      },
    ],
    appLinks: [{ label: "Uyku duaları" }, { label: "Gece zikirleri" }],
  },
  {
    title: "Ev ve mescit duaları",
    summary: "Evine ve mescide girip çıkarken zikri yanında taşı.",
    body: [
      "Peygamber ﷺ, hayatın günlük eşiklerine kısa dualar bağlamıştır. Evden çıkarken ve girerken Allah'ın adını anmak, koruma ve bereket getirir, şeytana kapıyı kapatır; O ﷺ, bir kişi Allah'ı anarak eve girdiğinde şeytanın arkadaşlarına 'Burada geceleyecek yeriniz yok' dediğini öğretmiştir.",
      "Mescidin kendine özgü âdâbı vardır: sağ ayakla rahmet kapılarını dileyerek gir, sol ayakla Allah'ın lütfunu dileyerek çık — bunlar, mescidin rahmet, disiplin ve Allah'ın huzurunda tevazu yeri olduğunu hatırlatır.",
    ],
    phrases: [
      {
        title: "Evden çıkış duası",
        when: "Evden çıkarken",
        translation: "Allah'ın adıyla; Allah'a tevekkül ettim; güç ve kuvvet ancak Allah iledir.",
        reference: "Sunan Abi Dawud 5095; Jami' at-Tirmidhi 3426 (hasan sahih)",
      },
      {
        title: "Mescide giriş duası",
        when: "Girerken, sağ ayakla adım atarak",
        translation: "Allah'ım! Bana rahmetinin kapılarını aç.",
        reference: "Sahih Muslim 713",
      },
    ],
    appLinks: [{ label: "Salah ile ilgili dualar" }, { label: "Mescit zikirleri" }],
  },
  {
    title: "Yemek ve içmek duaları",
    summary: "Her öğüne bereket ve şükür getiren kısa zikirler.",
    body: [
      "İslam, yemek yeme gibi sıradan bir eylemi zikirle ibadete dönüştürür. 'Bismillah' ile başla — bu bereketi davet eder ve şeytanın yemeğe ortak olmasını engeller — ve Allah'a hamd ile bitir; böylece kalp günde birkaç kez şükre ve bilinçliliğe alıştırılır.",
      "Sünnet, unutkanlık için bile bir düzeltme sunar: eğer başında 'Bismillah' demeyi unutursan, hatırladığın anda 'Bismillahi evvelehu ve ahirahu' (Allah'ın adıyla, başında da sonunda da) de.",
    ],
    phrases: [
      {
        title: "Yemekten önce",
        when: "Yemeğin başında",
        translation: "Allah'ın adıyla.",
        reference:
          "Sahih al-Bukhari 5376; Jami' at-Tirmidhi 1858 (with the correction if forgotten)",
      },
      {
        title: "Yemekten sonra",
        when: "Yemeği bitirirken",
        translation:
          "Bana bunu yediren ve hiçbir güç ve kuvvetim olmaksızın bunu bana rızık kılan Allah'a hamdolsun.",
        reference: "Jami' at-Tirmidhi 3458 (hasan) — his past sins are forgiven",
      },
    ],
    appLinks: [{ label: "Yemek duaları" }],
  },
  {
    title: "Abdest ve namaz etrafındaki dualar",
    summary: "Abdest öncesi ve sonrasında, ve namazın içinde okunan dualar.",
    body: [
      "Abdest ve salah, günlük olarak icabet gören zikrin en büyük kapılarıdır; bu yüzden Sünnet onları dua ile doldurur. Abdesti kelime-i şehadetle tamamlamak cennetin sekiz kapısını açar; namazın içinde de — secdede ve son selamdan hemen önce — müminin gününün en çok kabul gören iki anı bulunur.",
      "Bu anlar için sahih ve öğretilmiş ifadeleri öğrenmek, şekli hareketleri Allah'la bilinçli bir konuşmaya dönüştürür.",
    ],
    phrases: [
      {
        title: "Abdestten sonra",
        when: "Abdesti tamamladıktan hemen sonra",
        translation:
          "Şehadet ederim ki Allah'tan başka ilah yoktur, O tektir, ortağı yoktur; ve şehadet ederim ki Muhammed O'nun kulu ve elçisidir.",
        reference: "Sahih Muslim 234",
      },
      {
        title: "Namazda selamdan önce",
        when: "Son teşehhütte, namazı bitirmeden önce",
        translation:
          "Allah'ım! Cehennem azabından, kabir azabından, hayat ve ölüm fitnesinden, ve Mesih Deccal'in fitnesinin şerrinden Sana sığınırım.",
        reference: "Sahih al-Bukhari 1377; Sahih Muslim 588",
      },
    ],
    appLinks: [{ label: "Namaz duaları" }, { label: "Salah zikirleri" }],
  },
  {
    title: "Ezan ve kamet vaktinde dua",
    summary: "Çağrıya karşılık ver, Peygamber ﷺ için makam dile, sonra dua et.",
    body: [
      "Ezan okunduğunda Sünnet, müezzini tekrarlamak, ardından Peygamber'e ﷺ salavat getirmek, sonra da Allah'tan O'na el-Vesile'yi bahşetmesini dileyen duayı okumaktır — Peygamber ﷺ bunu yapan kişiye kendi şefaatini vaat etmiştir.",
      "Ezan ile kamet arasındaki an, kişisel duanın kabul gördüğü vakitlerden biridir; Peygamber ﷺ o esnada yapılan duanın geri çevrilmediğini bildirmiştir, öyleyse bunu kendi ihtiyaçlarını Allah'tan dilemek için kullan.",
    ],
    phrases: [
      {
        title: "Ezandan sonraki dua",
        when: "Ezan bittiğinde",
        translation:
          "Allah'ım! Bu eksiksiz çağrının ve kılınacak namazın Rabbi! Muhammed'e el-Vesile'yi ve el-Fazile'yi ver, ve O'nu vaat ettiğin övülmüş makama ulaştır.",
        reference: "Sahih al-Bukhari 614",
      },
    ],
    hadith: [
      {
        excerpt:
          "The dua made between the adhan and the iqamah is not rejected. (Anas ibn Malik; also at-Tirmidhi 212)",
      },
    ],
    appLinks: [{ label: "Ezan ve namaz duaları" }, { label: "Zikir kütüphanesi" }],
  },

  // Situational
  {
    title: "Endişe ve üzüntü",
    summary: "Kalbi tevekkülle ve Peygamber'in ﷺ kendi dualarıyla sağlamlaştır.",
    body: [
      "İslam, sıkıntıyla pratik manevi araçlarla yüzleşir: dua, zikir, namaz, ve Allah'ın takdirine güven. Kendisi de keder ve zorluk yaşamış olan Peygamber ﷺ, endişe (hem), üzüntü (hazen) ve korku için özel dualar öğretmiştir — kalbi sorundan, onu kontrol eden Tek Zat'a yönelten sözler.",
      "Bu dualar, ihtiyaç duyulduğunda tıbbi veya profesyonel bakım dahil, meşru yollarla yardım aramanın yerini almaz. Aksine, bu yollarla birlikte kalbi güçlendirir; mümine, nihai yeterliliğin yalnızca Allah'ta olduğunu hatırlatır.",
    ],
    phrases: [
      {
        title: "Endişe ve keder duası",
        when: "Sıkıntı, kaygı veya bunaltıcı üzüntü anında",
        translation:
          "Allah'ım! Endişe ve üzüntüden, âcizlik ve tembellikten, cimrilik ve korkaklıktan, borcun ağırlığından, ve insanların baskısından Sana sığınırım.",
        reference: "Sahih al-Bukhari 6369 (Anas ibn Malik)",
      },
      {
        title: "Allah bize yeter",
        when: "Korku veya bunalma anında",
        translation: "Allah bize yeter, O ne güzel vekildir.",
        reference: "Qur'an 3:173 — the words of the believers when threatened",
      },
    ],
    appLinks: [{ label: "Huzur zikirleri" }, { label: "Genel dualar" }],
  },
  {
    title: "Hastalık ve korku",
    summary: "Meşru tedavi yollarını kullanırken şifayı Allah'tan dile.",
    body: [
      "Sünnet, duayı tedaviyle birleştirir: Peygamber ﷺ, 'Her hastalığın bir çaresi vardır' buyurmuş ve tedavi aramayı emretmiştir; aynı zamanda ruqye yoluyla — hastaya Kur'an ve sahih dualar okuyarak — kalpleri ve bedenleri şifalandırmıştır. Mümin ikisini birden yapar: ilacını alır ve Şâfî olana yönelir.",
      "Etkinin gerçek sahibinin adı önemlidir: Allah eş-Şâfî'dir, şifa verendir, ve ilaç yalnızca O'nun yarattığı bir sebeptir. Korkuda da kalp, güvenlik ve sebat için yine O'na döner — çünkü emniyeti bahşeden yalnızca O'dur.",
    ],
    phrases: [
      {
        title: "Şifa duası",
        when: "Hasta olunduğunda, ya da hasta biri için dua edilirken",
        translation:
          "Allah'ım! İnsanların Rabbi, sıkıntıyı gider ve şifa ver — Sen Şâfî'sin; Senin şifandan başka şifa yoktur — hiçbir hastalık bırakmayan bir şifa ver.",
        reference: "Sahih al-Bukhari 5743; Sahih Muslim 2191 ('Aishah)",
      },
    ],
    appLinks: [{ label: "Şifa duaları" }, { label: "Koruma zikirleri" }],
  },
  {
    title: "Mağfiret ve hidayet",
    summary: "Sürekli olarak af, sebat ve doğru hidayet dile.",
    body: [
      "İstiğfar (mağfiret dilemek), yalnızca büyük günahlardan sonrasına özgü değildir — müminin günlük bir ritmidir. Zaten bağışlanmış olan Peygamber ﷺ, günde yetmiş defadan fazla Allah'tan mağfiret dilemiş; böylece kalbin sürekli cilalanmaya ihtiyaç duyduğunu öğretmiştir.",
      "Hidayet de aynı şekilde, tek seferlik bir olay değil, sürekli bir ihtiyaçtır. Sağlam biçimde amel eden müminler dahi Allah'tan kalplerini sabit tutmasını dilerler; çünkü kalpler döner durur — ve onları çeviren yalnızca Allah'tır. Peygamber ﷺ sıkça, din üzere sabit kılınmış bir kalp için dua ederdi.",
    ],
    phrases: [
      {
        title: "Sık sık tövbe",
        when: "Gün boyunca, tekrar tekrar",
        translation: "Allah'tan mağfiret diler ve O'na tövbe ederim.",
        reference:
          "Sahih al-Bukhari 6307 — the Prophet ﷺ sought forgiveness more than 70 times a day",
      },
      {
        title: "Sebatlı bir kalp için dua",
        when: "Sapma veya kararsızlık korkusunda",
        translation: "Ey kalpleri çeviren! Kalbimi dinin üzere sabit kıl.",
        reference: "Jami' at-Tirmidhi 2140 (hasan) — his most frequent oath and dua",
      },
    ],
    appLinks: [{ label: "Tövbe duaları" }, { label: "Günlük istiğfar" }],
  },
  {
    title: "Yolculuk ve yağmur duaları",
    summary: "Yola çıkış için, ve yağan yağmurun rahmeti için dualar.",
    body: [
      "Yolculuk hem bir zayıflık hem de artmış bir icabet hâlidir — Peygamber ﷺ, yolcunun duasının kabul edildiğini öğretmiş, ve bir taşıta binerken ve yola çıkarken Allah'ın kudretini ve O'na dönüşümüzü kabul eden bir dua vermiştir.",
      "Yağmur, Allah'tan inen bir rahmettir, ve yağdığı an dua etme vaktidir. Peygamber ﷺ, yağmuru faydalı kılınmasını ve zarar sebebi olmamasını dileyen kısa bir duayla karşılardı.",
    ],
    phrases: [
      {
        title: "Yolculuğa çıkarken duası",
        when: "Taşıta binip yola çıkarken",
        translation:
          "Bunu bize boyun eğdiren zât noksan sıfatlardan münezzehtir; biz buna güç yetiremezdik. Ve şüphesiz biz Rabbimize dönenleriz.",
        reference:
          "Qur'an 43:13–14 (the words); Sahih Muslim 1342 (the Prophet's ﷺ travel practice)",
      },
      {
        title: "Yağmur yağarken duası",
        when: "Yağmurun başlangıcında",
        translation: "Allah'ım! Bunu faydalı bir yağmur eyle.",
        reference: "Sahih al-Bukhari 1032 ('Aishah)",
      },
    ],
    appLinks: [{ label: "Yolculuk duaları" }, { label: "Yolculuk rehberi" }],
  },
  {
    title: "Rızık ve aile",
    summary: "Allah'tan helal rızık ve evde salâh dile.",
    body: [
      "Rızık yalnızca Allah'tandır; mümin devesini bağlar — yani çalışır ve kazanır — sonra Rezzak olandan helal rızık, kazancında bereket, borçtan kurtuluş, ve başkalarına muhtaç olmama diler. Peygamber ﷺ, tam olarak bunu dileyen güzel bir dua öğretmiştir.",
      "Ev için ise, Kur'an'ın kendisi salih kimselerin duasını öğretir: 'göz aydınlığı' olacak eş ve çocuklarla rızıklandırılmayı, ve iman, namaz ve rahmetle birbirine bağlı bir hane yürütmeyi.",
    ],
    quran: [
      {
        excerpt:
          "Our Lord, grant us from among our spouses and offspring comfort to our eyes, and make us leaders for the righteous.",
      },
    ],
    phrases: [
      {
        title: "Helal rızık duası",
        when: "Sabahları, namazdan sonra, ve maddi sıkıntıda",
        translation:
          "Allah'ım! Beni helalinle haramından koru, ve lütfunla Senden başkasına muhtaç olmaktan bana yeterli kıl.",
        reference: "Jami' at-Tirmidhi 3563 (hasan) ('Ali ibn Abi Talib)",
      },
    ],
    appLinks: [{ label: "Aile ve hayat duaları" }],
  },

  // Categories
  {
    title: "Kur'ani dualar",
    summary: "Bizzat Allah'ın Kur'an içinde öğrettiği dualar.",
    body: [
      "Kur'ani dualar, Allah'ın peygamberlerin ve müminlerin dillerine koyduğu, sonra da tekrarlamamız için koruduğu sözlerdir — özlü, kapsamlı, ve daha iyisi yapılamaz nitelikte. Birçoğu 'Rabbena' (Rabbimiz) ile başlar, ve ezberlemek ve sürekli okumak için idealdirler.",
      "Aralarında müminin tüm ihtiyaçlarını kapsarlar: mağfiret, hidayet, sebat, rahmet, salih aile, ateşten korunma, ve her iki dünyada da başarı. Allah'ın kendi sözleriyle dua etmek, duanın en emin şekillerindendir.",
    ],
    phrases: [
      {
        title: "Her iki dünyada da hayır",
        when: "Genel amaçlı bir dua — Peygamber'in ﷺ en sık yaptığı",
        translation:
          "Rabbimiz! Bize dünyada iyilik ver, ahirette de iyilik ver, ve bizi ateşin azabından koru.",
        reference: "Qur'an 2:201 (the most frequent dua of the Prophet ﷺ — Sahih al-Bukhari 6389)",
      },
      {
        title: "İmanda sebat",
        when: "Sapma korkusunda veya hidayet bulduktan sonra",
        translation:
          "Rabbimiz! Bizi hidayete erdirdikten sonra kalplerimizi eğriltme, ve katından bize bir rahmet bahşet. Şüphesiz Sen, çok bahşedensin.",
        reference: "Qur'an 3:8",
      },
    ],
    appLinks: [{ label: "Kur'an okuyucu" }, { label: "Kur'ani dualar" }],
  },
  {
    title: "Nebevi dualar",
    summary: "Peygamber Muhammed'den ﷺ sahih olarak öğretilen dualar.",
    body: [
      "Peygamber'e ﷺ 'sözlerin en kapsamlısı' (cevami'ül-kelim) verilmiştir, ve duaları bunu yansıtır: sözde kısa, anlamda geniş, ve bu dünya ile ahiretin ihtiyaçları arasında tam bir denge içinde. Hidayet, kalp temizliği, sağlık, mağfiret, koruma, ve güzel ahlak dilerler.",
      "Önemli bir ilke: güvenilir kaynaklardan gelen sahih ve iyi belgelenmiş dualara sıkı sıkıya tutun, uydurma mükâfatlarla dolaşan zayıf veya uydurma olanlardan kaçının. Sünnet'in gerçek hazinesi zaten fazlasıyla yeterlidir.",
    ],
    phrases: [
      {
        title: "Dördü kapsayan dua",
        when: "Genel bir günlük dua",
        translation: "Allah'ım! Senden hidayet, takva, iffet ve gönül tokluğu dilerim.",
        reference: "Sahih Muslim 2721 (Ibn Mas'ud)",
      },
    ],
    appLinks: [{ label: "Nebevi dualar" }],
  },
  {
    title: "Zikir ve tesbih",
    summary: "Ağırlığı ve mükâfatı çok büyük olan kısa zikirler.",
    body: [
      "Zikir — Allah'ı anmak — tesbih (Sübhanallah), tahmid (Elhamdülillah), tehlil (La ilahe illallah), tekbir (Allahu Ekber) ve istiğfarı içerir. Bunlar dilde en hafif sözlerden olmakla birlikte mizanda en ağır olanlardır, ve diri kalbin gaflete karşı savunmasıdır.",
      "Peygamber ﷺ, 'dilde hafif, mizanda ağır, Rahman'a sevgili' olan sözler tarif etmiş, ve günde yüz kez 'Sübhanallahi ve bihamdihi' diyen kişinin, denizin köpüğü kadar da olsa günahlarının silineceğini öğretmiştir. Namazlardan sonra ve gün boyunca sürdürüldüğünde zikir, imanı canlı tutar.",
    ],
    phrases: [
      {
        title: "Sevgili ve günah silen sözler",
        when: "Gün boyunca; 100 kez günahları siler",
        translation: "Allah noksan sıfatlardan münezzehtir ve tüm hamd O'nadır.",
        reference: "Sahih al-Bukhari 6405; Sahih Muslim 2691",
      },
      {
        title: "Mizanda ağır iki kelime",
        when: "Herhangi bir zamanda",
        translation:
          "Allah noksan sıfatlardan münezzehtir ve hamd O'nundur; Allah, azametli olan, münezzehtir.",
        reference:
          "Sahih al-Bukhari 6406; Sahih Muslim 2694 — light on the tongue, heavy on the Scale",
      },
    ],
    appLinks: [{ label: "Zikir koleksiyonu" }],
  },
  {
    title: "Peygamber'e ﷺ salavat",
    summary: "Peygamber'e ﷺ salavat getirmek, günlük bir rahmet pınarıdır.",
    body: [
      "Peygamber'e ﷺ salavat getirmek Allah'ın Kur'an'daki emridir — 'Şüphesiz Allah ve melekleri Peygamber'e salât ederler; ey iman edenler! Siz de O'na salât edin ve tam bir teslimiyetle selam verin' — ve başka hiçbir duanın böylesine garantili bir karşılığı yoktur: Peygamber ﷺ, kim ona bir kez salavat getirirse Allah'ın ona on kez salât edeceğini buyurmuştur.",
      "Sık salavat getirmek rahmet getirir, dereceleri yükseltir, günahları siler, ve kişiyi Kıyamet Günü Peygamber'e ﷺ en yakın kılar. Aşağıdaki tam İbrahimi form — Sahabe'ye kendisine nasıl salavat getireceklerini sorduklarında öğrettiği form — her namazın teşehhüdünde okunur ve gün boyunca dilde tutulması çok güzeldir.",
    ],
    quran: [
      {
        excerpt:
          "Indeed, Allah and His angels send blessings upon the Prophet. O you who believe, send blessings upon him and greetings of peace.",
      },
    ],
    phrases: [
      {
        title: "Tam Salavat-ı İbrahimiyye",
        when: "Namazın teşehhüdünde ve gün boyunca",
        translation:
          "Allah'ım! İbrahim'e ve İbrahim ailesine salât ettiğin gibi Muhammed'e ve Muhammed ailesine de salât et; şüphesiz Sen övgüye layıksın, şanı yücesin. Allah'ım! İbrahim'e ve İbrahim ailesine bereket verdiğin gibi Muhammed'e ve Muhammed ailesine de bereket ver; şüphesiz Sen övgüye layıksın, şanı yücesin.",
        reference: "Sahih al-Bukhari 3370; Sahih Muslim 406 (Ka'b ibn 'Ujrah)",
      },
    ],
    appLinks: [{ label: "Salavat koleksiyonu" }],
  },

  // Reference
  {
    title: "Kaynaklar ve sıhhat",
    summary: "Açık bir kaynak gösterimiyle Kur'an ve sahih hadisi öncelikli tut.",
    body: [
      "Bu modül eğitim amaçlı ve taraf tutmayan niteliktedir; tamamen Kur'an ve yaygın olarak kabul gören sahih (sahih/hasan) hadise dayanır, her biri izlenebilir bir kaynakla birlikte. Günlük dualar için altın standart tam olarak budur: bilinen bir kaynağı olan, doğrulanmış bir metin.",
      "Duayla ilgili ciddi bir uyarı geçerlidir: birçok dua, internette uydurma ifadeler ve abartılı mükâfatlarla ('bunu oku, tüm günahların silinsin') dolaşmaktadır. Uydurma hadis ciddi bir meseledir, bu yüzden tanımadığın bir rivayeti benimsemeden veya yaymadan önce onu doğrula.",
      "Ezberleme ve günlük uygulama için, terk edeceğin uzun dualar yerine, gerçekten sürdürebileceğin kısa ve sahih duaları tercih et — istikrar, Allah katında çoklıktan daha sevgilidir. Mezheplerin ifadede farklılaştığı yerlerde, yetkin bir yerel âlimden öğren.",
    ],
    actions: [
      "Tanımadığın herhangi bir duayı paylaşmadan önce kaynağını doğrula.",
      "Sürdüremeyeceğin çok sayıda dua yerine, birkaç özlü ve sahih dua seç ve onları günlük olarak sürdür.",
      "Her dersi gerçek bir uygulamayla eşleştirmek için uygulamanın konu bağlantılarını kullan.",
    ],
    disclaimer:
      "Eğitim içeriği, kişiye özel fıkhî tavsiyenin yerini tutmaz. Belirli durumlara ilişkin hükümler için yetkin âlimlere danışın.",
    appLinks: [
      { label: "Dua kütüphanesi" },
      { label: "Kur'an" },
      { label: "Zikir" },
      { label: "Salavat" },
    ],
  },
];

export const LEARN_DUA_OCCASIONS_TR: DeepPartial<LearnDuaOccasion>[] = [
  { title: "Sabah zikirleri", summary: "Güne zikirle başla" },
  { title: "Akşam zikirleri", summary: "Geceden önce koruma" },
  { title: "Uyandıktan sonra", summary: "Uyanışın ilk sözleri" },
  { title: "Uyumadan önce", summary: "Gecenin duaları ve zikirleri" },
  { title: "Eve giriş", summary: "Bismillah ve selam" },
  { title: "Evden çıkış", summary: "Dışarı çıkarken tevekkül" },
  { title: "Mescit", summary: "Mescide giriş ve çıkış" },
  { title: "Yemekten önce ve sonra", summary: "Yemekte şükür" },
  { title: "Abdest", summary: "Abdestten önce ve sonra" },
  { title: "Salah", summary: "Namazdan önce, esnasında ve sonrasında" },
  { title: "Endişe ve kaygı", summary: "Kalbi dua ile sakinleştir" },
  { title: "Hastalık", summary: "Şifa ve sabır" },
  { title: "Mağfiret", summary: "İstiğfar ve tövbe" },
  { title: "Yolculuk", summary: "Gidiş ve dönüş" },
  { title: "Rızık", summary: "Allah'tan helal rızık dilemek" },
  { title: "Kur'ani dualar", summary: "Allah'ın Kitabından dualar" },
];
