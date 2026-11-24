// Turkish translation overlays for the Learn Qur'an content.
// Each overlay mirrors the order of its English source array in ../quran-guide*.ts
// (index-aligned); untranslated entries fall back to English. Only human-readable
// text is translated — ids, routes, surah/ayah numbers, collections, citations,
// grades, and Qur'an verse-reference labels stay in the English source.
import type {
  QuranGuideApplyChallenge,
  QuranGuideDailyLesson,
  QuranGuideLetter,
  QuranGuideMemorizationPlan,
  QuranGuidePronunciationPair,
  QuranGuideQuizQuestion,
  QuranGuideReadingLevel,
  QuranGuideStory,
  QuranGuideStructureLevel,
  QuranGuideTadabburPrompt,
  QuranGuideTajweedLesson,
  QuranGuideTheme,
  QuranGuideTimelineEvent,
  QuranGuideTopic,
  QuranGuideVocabEntry,
} from "../../types/quran-guide";
import type { DeepPartial } from "./localize";

export const QURAN_GUIDE_TOPICS_TR: DeepPartial<QuranGuideTopic>[] = [
  {
    title: "Giriş",
    summary: "Kur'an nedir, neden indirildi ve okumanın faziletleri.",
    body: [
      "Kur'an kelimesi, okumak ve sesli okumak anlamına gelen Arapça kara'a kökünden gelir; yani Kitap, amacını bizzat adında taşır: dilde ve kalpte tekrar tekrar okunmak için vardır. Ehl-i Sünnet inancına göre Kur'an, Allah'ın lafzen kelâmıdır ve mahlûk değildir; Hira Mağarası'ndaki ilk kelimelerden Peygamber'in ﷺ vefatından kısa bir süre öncesine kadar, yaklaşık 23 yıl boyunca Cebrail aracılığıyla Peygamber Muhammed'e ﷺ apaçık bir Arapça ile indirilmiştir.",
      "O, insanlığa gönderilen son kitaptır; Musa, Davud ve İsa'ya (Allah'ın selamı onların üzerine olsun) verilen önceki vahiylerdeki hakikati doğrular ve onların taşıdığı mesajı tamamlar. Allah onun amacını açıkça bildirir: O, “insanlara bir hidayet rehberi olarak” indirilmiştir — insanları şaşkınlık ve putperestliğin karanlıklarından tevhidin, yalnızca Allah'a ihlasla kulluğun, dürüst ahlakın ve ahiret hayatına ciddi hazırlığın aydınlığına çıkarmak için. Her peygamber aynı öze davet etmiştir; Kur'an bu davetin son ve korunmuş hâlidir.",
      "Kur'an okumak yalnızca bilgi edinmek değil, başlı başına bir ibadettir. Peygamber ﷺ, okunan her harf için bir hasene (iyilik) yazıldığını ve her hasenenin en az on katıyla karşılık gördüğünü öğretmiştir; dolayısıyla tek bir satırı heceleyerek okuyan bir başlangıç seviyesindeki kişi bile şimdiden sevap biriktirmektedir. Kıyamet gününde Kur'an, bu dünyada kendisiyle beraber olanlara şefaatçi olarak gelecektir. Onu akıcı okuyan, değerli kâtip meleklerle beraberdir; öğrenmeye çalışırken okumakta zorlanıp takılan ise bu gayreti için iki kat sevap kazanır.",
      "Kur'an'ın ne olmadığını netleştirmek de faydalıdır. Kur'an, vahyedildiği günden beri değişmeden kalan, Allah'ın Arapça olarak bizzat kendi sözleridir. Hadisler — Peygamber'in ﷺ sözleri, fiilleri ve sessiz onayları (takrirleri) — bundan ayrıdır: Kur'an'ı açıklar ve uygulamasını gösterir, ancak Peygamber'in ﷺ kendi ifadesidir; ravileri isimleriyle bilinen senetlerle korunmuş ve âlimler tarafından sahih, hasen veya zayıf olarak derecelendirilmiştir. Her ikisi de vahiydir ve her ikisi de bağlayıcıdır; ancak namazda ibadet olarak yalnızca Kur'an okunur ve yalnızca Kur'an, Allah'ın mucize olan, benzeri getirilemeyen kelâmıdır.",
    ],
    quran: [
      {
        excerpt: "Ramazan ayı, insanlara bir hidayet rehberi olarak Kur'an'ın indirildiği aydır…",
      },
      {
        excerpt:
          "De ki: İnsanlar ve cinler bu Kur'an'ın bir benzerini getirmek için bir araya gelseler, onun benzerini getiremezler…",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim Allah'ın Kitabı'ndan bir harf okursa ona bir hasene vardır; hasene de on katıyla verilir.",
      },
      {
        excerpt:
          "Kur'an okuyun; çünkü o, kıyamet gününde kendisiyle beraber olanlara şefaatçi olarak gelecektir.",
      },
      {
        excerpt:
          "Kur'an'ı mahir bir şekilde okuyan, değerli ve itaatkâr kâtip meleklerle beraberdir; onu zorlanarak, kekeleyerek okuyana ise iki kat sevap vardır.",
      },
    ],
    actions: [
      "Kur'an için her gün sabit bir vakit belirle — odaklanılmış beş dakika bile bereket ve süreklilik kazandırır.",
      "En az bir satırı anlamıyla birlikte oku: Arapçasını oku, ardından mealini yavaşça oku.",
      "Munib'in Kur'an okuyucusunu aç ve tam kaldığın yerden devam et.",
    ],
    appLinks: [
      {
        label: "Kur'an oku",
      },
      {
        label: "Günlük ders",
      },
    ],
  },
  {
    title: "Kur'an nasıl indirildi",
    summary: "Hira Mağarası, Cebrail, Mekke ve Medine dönemleri, derleme ve muhafaza.",
    body: [
      "Vahiy, Ramazan ayında, Peygamber ﷺ kırk yaşındayken ve Mekke dışındaki bir dağda bulunan Hira Mağarası'na yalnızlık ve tefekkür için çekildiği bir sırada başladı. Orada melek Cebrail ona geldi ve “Oku!” diye emretti. Okuma yazma bilmeyen Peygamber ﷺ okuyamayacağını söyledi — ta ki melek onu sıkıca kucaklayıp Alak Suresi'nin ilk beş ayetini iletene kadar: “Yaratan Rabbinin adıyla oku.” Sarsılmış bir hâlde evine, eşi Hatice'nin yanına döndü; Hatice onu teskin etti ve akrabası Varaka b. Nevfel'e götürdü. İlim sahibi biri olan Varaka, vahiy meleğini tanıdı ve bunun Musa'ya gelen aynı elçi olduğunu doğruladı.",
      "Ardından vahyin kısa bir süre kesildiği bir ara (fetret) yaşandı; bu sessizlik dönemi Peygamber'in ﷺ vahye özlemini artırdı. Sonra vahiy yeniden başladı ve ömrünün sonuna kadar aşama aşama devam etti. Vahiy bir defada inmedi; olaylara, sorulara ve gelişen topluluğun ihtiyaçlarına cevap olarak indirildi. Allah bu tedrici yöntemi, Peygamber'in ﷺ kalbini sağlamlaştıran ve Kitab'ı insanların hayatına kolaylıkla yerleştiren bir yol olarak anlatır.",
      "Mekke dönemi yaklaşık on üç yıl sürdü. Bu dönemin sureleri çoğunlukla kısa, ahenkli ve güçlüdür; temelleri ısrarla vurgular — Allah'ın birliği, yeniden diriliş ve hesabın kesinliği, önce yalanlanıp sonra haklı çıkarılan önceki peygamberlerin kıssaları ve putperestlik ile zulme gömülmüş bir toplumda kapsamlı bir ahlaki ıslah çağrısı.",
      "Miladi 622'de Medine'ye hicretten sonra Müslümanlar artık zulme uğrayan küçük bir grup değil, bir toplum inşa eden bir topluluktu. Medine'de inen vahiyler genellikle daha uzun ve daha ayrıntılıdır; yeni ümmetin ihtiyaç duyduğu hukuk ve toplumsal düzeni ortaya koyar: namaz, zekât, oruç, miras, evlilik ve boşanma, sözleşmeler, savaş ve antlaşmalarla ilgili ayrıntılar. Bunların yanında, topluluğu içeriden zayıflatan münafıklara yönelik kesin ifadeler de yer alır.",
      "Metnin korunması Peygamber'in ﷺ sağlığında başladı. Sahabe vahyi indikçe ezberledi; vahiy kâtipleri de Peygamber'in ﷺ doğrudan gözetimi altında onu parşömen, hurma dalı, kemik ve taş üzerine yazdı. Yemame Savaşı'nda pek çok hafız şehit düşünce Ebu Bekir, Zeyd b. Sabit'e yazılı Kur'an'ı tek bir derlemede (suhuf) toplamasını emretti. Daha sonra İslam toprakları genişleyip lehçeler çeşitlenince Osman, Kureyş lehçesiyle resmî nüshalar hazırlattı ve bunları büyük şehirlere göndererek bütün ümmet için tek bir yazılı metni standart hâle getirdi.",
      "Kur'an'ın korunmasını bizzat Allah garanti etmiştir: “Şüphesiz Zikri (Kur'an'ı) biz indirdik ve onun koruyucusu da elbette biziz.” Bu vaat, birbirini destekleyen üç güvence ile yerine gelmiştir: her nesilde kitlesel ezber, titiz yazılı aktarım ve Peygamber'e ﷺ kadar uzanan, hocadan talebeye kesintisiz kıraat zincirleri. Mümin için bu ilahi bir alamettir; tarihçi için ise belgelenmiş bir gerçektir: Bugün okunan Kur'an, on dört asır önce indirilenle aynı metindir.",
    ],
    quran: [
      {
        excerpt: "Şüphesiz Zikri biz indirdik ve onun koruyucusu da elbette biziz.",
      },
      {
        excerpt: "Yaratan Rabbinin adıyla oku…",
      },
    ],
    appLinks: [
      {
        label: "Vahiy zaman çizelgesi",
      },
      {
        label: "Siyer",
      },
    ],
  },
  {
    title: "Kur'an'ın yapısı",
    summary: "114 sure, 30 cüz, ayetler, Mekki/Medeni, sıralama ve iniş sırası.",
    body: [
      "Mushaf — Kur'an'ın yazılı nüshası — 114 sureden (bölüm) oluşur; her surenin, genellikle içindeki dikkat çekici bir kelimeden alınan kendine ait bir adı vardır. Sureler, kesin olmamakla birlikte çoğunlukla en uzundan en kısaya doğru sıralanmıştır: Kısa açılış suresi Fatiha, Kitab'ın kapısı olarak ilk sırada gelir, ardından uzun Bakara Suresi gelir. Bu sıralama tevkifidir — yani Peygamber'e ﷺ Cebrail tarafından öğretilmiştir ve ayetlerin iniş sırası değildir. Dolayısıyla mushafta okuduğun sıralama kronolojik değil, bilinçli ve ilahi olarak belirlenmiştir.",
      "Her sure Mekki (hicretten önce inen) veya Medeni (hicretten sonra inen) olarak sınıflandırılır; birkaç sure ise her iki döneme ait ayetler içerir. Genel bir kural olarak Mekki sureler daha kısa ve daha acil üsluplu pasajlarla inanca — tevhid, yeniden diriliş ve peygamber kıssalarına — odaklanır; Medeni sureler ise yerleşik bir toplumun ihtiyaç duyduğu ayrıntılı hükümleri ve toplumsal rehberliği ekler. Hangisinin hangisi olduğunu bilmek, bir sureyi doğru bağlamında okumana yardımcı olur.",
      "Okumayı kolaylaştırmak için Kur'an ayrıca cüz (çoğulu ecza) denilen 30 eşit bölüme, her cüz de hizip denilen iki yarıma ayrılır; böylece toplam 60 hizip olur. Ramazan hatmini — Kur'an'ın tamamını bir ayda bitirmeyi — bu kadar doğal kılan da budur: Günde bir cüz okumak Kitab'ı otuz günde tamamlar; günde iki kez yarım cüz okumak ise daha da kolaydır. Her surede ayetler numaralandırılmıştır; böylece herhangi bir pasaj sure:ayet şeklinde tam olarak gösterilebilir. Standart Medine sayımı 6.236 ayettir; birkaç ayet sınırının numaralandırılmasında yalnızca çok küçük ve iyi belgelenmiş farklar vardır — metnin kendisi aynıdır.",
      "Bu yapıyı anlamak, belirsiz niyetleri somut bir plana dönüştürür. Her gün sabit bir miktar okumayı taahhüt edebilir, ezber için Amme cüzünü (kısa surelerle dolu son, otuzuncu cüz) hedefleyebilir, sabır gibi tek bir konuyu birkaç sure boyunca takip edebilir veya Ramazan'a göre tam bir hatim planlayabilirsin. Yapı, Kur'an ile ömür boyu sürecek bir bağı mümkün kılan iskelettir.",
    ],
    quran: [
      {
        excerpt:
          "…ayetleri bilen bir topluluk için Arapça bir Kur'an olarak ayrıntılı biçimde açıklanmış bir Kitap.",
      },
    ],
    appLinks: [
      {
        label: "Yapı görseli",
      },
      {
        label: "Surelere göz at",
      },
    ],
  },
  {
    title: "Okumayı öğren",
    summary: "Alfabeden akıcı okumaya yedi seviye — sıfırdan başlayanlar için.",
    body: [
      "Hemen her Müslüman Kur'an'ı aslı olan Arapçasıyla okumayı arzular ve bu, her yaşta tamamen ulaşılabilir bir hedeftir — daha önce hiç Arapça bilmeyen sayısız yetişkin akıcı okumayı öğrenmiştir. Bir meali anlamak değerlidir; ancak Arapça kelimelerin kendisini okumak başlı başına bir ibadettir ve bu emeğe değer. Bu yol seni, tek bir harfi tanımadığın noktadan ayetleri doğru telaffuzla okuyabileceğin noktaya adım adım götürür.",
      "Yolculuk yedi doğal aşamadan geçer. 1. ve 2. seviyeler harf tanımayı geliştirir — önce 28 harfin yalın hâli, sonra kelimenin başında, ortasında ve sonunda şekillerinin nasıl değiştiği. 3. seviye harekeleri tanıtır: Her harfin hangi sesliyi taşıdığını gösteren küçük işaretler (üstün, esre, ötre, cezm, şedde, tenvin). 4. ve 5. seviyelerde her şey yerine oturur: Harfleri hecelere birleştirir ve “el-” belirlilik takısı için şemsi ve kameri harf kuralları da dahil olmak üzere kelimelerin tamamını okursun. 6. ve 7. seviyeler kısa ayetlere, ardından temel tecvid kuralları uygulanmış, düzgün ve akıcı okumaya geçer.",
      "İki alışkanlık her şeyi hızlandırır. Birincisi, yetkin bir kâriyi sürekli dinle ve onu birebir taklit et — Kur'an kulaktan kulağa, ağızdan ağıza aktarılmıştır; bu yüzden kulağın en iyi öğretmenindir. Ritmi, seslilerin uzunluğunu ve her sesin şeklini taklit et. İkincisi, harflerin üzerinden geçerek onları kâğıda veya ekrana yaz; çünkü el, gözün ve dilin öğrendiğini pekiştirir.",
      "Bir uyarı: Uygulamalar ve kayıtlar mükemmel birer destektir, ancak seni bir insanın düzelttiği gibi düzeltemezler. Peygamber ﷺ Kur'an'ı doğrudan Cebrail'den öğrendi ve sahabeye yüz yüze öğretti; doğru okuyuş her zaman bu canlı düzeltme zinciriyle korunmuştur. Seni dinleyip kendi kendine duyamadığın hataları düzeltecek yerel bir hoca veya düzenli bir çevrim içi tecvid programı bul.",
    ],
    actions: [
      "Arap harfleri bölümünde her gün bir harf çalış — gör, dinle, söyle, yaz.",
      "Kelimeleri bir mushaftan takip ederken Fatiha Suresi'ni tekrar tekrar dinle.",
      "Okuyuşunu dinleyip her hafta düzeltecek yerel ya da çevrim içi bir hoca ayarla.",
    ],
    appLinks: [
      {
        label: "Okuma seviyeleri",
      },
      {
        label: "Arap harfleri",
      },
    ],
  },
  {
    title: "Tecvid",
    summary: "Güzel ve doğru okumanın kuralları — sakin nun, med, vakf ve daha fazlası.",
    body: [
      "Tecvid, bir şeyi mükemmel veya güzel kılmak anlamına gelen bir kökten gelir. Bir ilim olarak, her harfin hakkını vermek demektir: ağızda veya boğazdaki doğru çıkış noktası (mahreç), harfin kendine has nitelikleri (sıfatlar) ve sesli harflerle duraklamaların doğru zamanlaması. Kısacası tecvid, Kur'an'ı tam indirildiği gibi okuma sanatıdır.",
      "Bu önemlidir; çünkü Kur'an gelişigüzel okunacak sıradan bir metin değildir. O, tecvidiyle birlikte indirilmiştir: Cebrail onu Peygamber'e ﷺ hassas bir telaffuzla okudu, Peygamber ﷺ sahabeye aynı şekilde okudu ve onlar da onu kesintisiz olarak bize aktardı. Bir harfi yanlış okumak küçük bir şey değildir — bir harfi yanlış telaffuz etmek kelimeyi tamamen değiştirebilir (örneğin kalın ص harfini ince س ile ya da boğaz harfleri ع ve ح'yi karıştırmak) ve bazı yerlerde bu, Allah'ın sözlerinin anlamını değiştirir. Tecvid ilmi tam da buna karşı korumak için vardır.",
      "Her şeyi bir anda öğrenmen gerekmez. Temel kurallar sırayla öğrenilir: sakin nun ve tenvin hükümleri (izhar, idgam, iklab, ihfa), sakin mim hükümleri, med (uzatma) çeşitleri, kalkale (belirli harflerdeki hafif sekme), gunne (genizden gelen ses) ve vakf (nerede ve nasıl durulacağı). Her birinin açık bir tanımı, günlük örnekleri ve alıştırması vardır; bu bölüm bunları tek tek ele alır.",
      "Kesin bir kural: Tecvidi yalnızca kitaplardan veya uygulamalardan değil, yetkin bir hocadan dinleyerek öğren. Hatalarını duyup düzeltebilecek birine oku — tecvid her zaman böyle öğretilmiştir ve gerçek doğruluğa ve nihayetinde bir icazete (senetli kıraat zinciri) giden tek güvenilir yol budur.",
    ],
    hadith: [
      {
        excerpt: "Sizin en hayırlınız Kur'an'ı öğrenen ve öğretendir.",
      },
      {
        excerpt:
          "Kur'an'ı mahir bir şekilde okuyan, değerli ve itaatkâr kâtip meleklerle beraberdir; onu zorlanarak, kekeleyerek okuyana ise iki kat sevap vardır.",
      },
    ],
    appLinks: [
      {
        label: "Tecvid dersleri",
      },
    ],
  },
  {
    title: "Arap harfleri",
    summary: "Etkileşimli alfabe — 28 harfin her biri için ad, ses ve örnekler.",
    body: [
      "Arap alfabesi sağdan sola yazılan ve okunan 28 harften oluşur. Türkçenin aksine harflerin çoğu yanındaki harflere bitişir; bu yüzden tek bir harf, yalnız başına durmasına ya da kelimenin başında, ortasında veya sonunda bulunmasına göre biraz farklı bir şekil alabilir. Aynı harfi farklı şekillerinde tanıyabilmek, ilk gerçek atılımlardan biridir.",
      "Kur'an Arapçası, temel harflerin üzerine birkaç ek özellik daha ekler: hemze (gırtlaktan gelen kesik ses), sesi uzatan uzun sesli harfler elif, vav ve ya; ayrıca “el-” belirlilik takısındaki “l” sesinin okunup okunmayacağını ya da bir sonraki harfe sessizce kaynaşıp kaynaşmayacağını belirleyen şemsi ve kameri harf kuralı. Bunları gerçek kelimelerde görünce hepsi kolaylaşır.",
      "Bu bölümdeki her harf kartı sana harfin yalın şeklini, adını, okunuşunu (transliterasyon), pratik bir telaffuz ipucunu ve gerçek Kur'an örneklerini verir; böylece sesi soyut olarak değil, bağlamı içinde öğrenirsin. En etkili yöntem, her harf için dört adımlı bir döngüdür: Gör, okunuşunu dinle, kendin yüksek sesle söyle, sonra yaz.",
      "Her yeni harfi zaten tanıyor olabileceğin kelimelere bağla — Allah, Rab, er-Rahman (Rahmeti en geniş olan), Bismillah. Yabancı şekilleri tanıdık anlamlarla ilişkilendirmek, harfleri tek tek ezberlemekten çok daha hızlı akılda kalmalarını sağlar.",
    ],
    appLinks: [
      {
        label: "Harf gezgini",
      },
      {
        label: "Telaffuz rehberi",
      },
    ],
  },
  {
    title: "Telaffuz",
    summary: "Zor harflerde ustalaş — ayn, ha, sad, dad, kaf ve kalın harfler.",
    body: [
      "Arapçada Türkçede tam karşılığı olmayan birkaç ses vardır ve anadili Arapça olmayanların en çok hata yaptığı yer burasıdır. En yaygın karışıklıklar, eğitilmemiş bir kulağa benzer gelen ama ağzın veya boğazın farklı yerlerinden çıkarılan harfler arasındadır — bunları karıştırmak bir kelimenin anlamını değiştirebilir; bu yüzden özel bir çalışmayı hak ederler.",
      "Kalın (müfahham) harfler — ص (sad), ض (dad), ط (tı) ve ظ (zı) — daha ince harflerin “ağır” karşılıklarıdır. Bunları çıkarmak için dilin arka kısmını kaldırır ve ağzı daha dolgun, daha derin bir sesle doldurursun; anadili Arapça olanlar bunu çocuklukta kazanır, öğrenenler ise bilinçli olarak geliştirmelidir. Her kalın harfi doğrudan ince karşılığıyla karşılaştır: س ile ص, د ile ض, ت ile ط, ذ ile ظ.",
      "Boğaz harfleri diğer büyük engeldir. Ayn (ع) boğazın ortasından gelen sesli bir daralmadır; ha (ح) ise güçlü, nefesli bir sürtünmedir. İkisi de Türkçede yoktur ve hiçbir yazılı açıklama onları duymanın yerini tam olarak tutamaz. Kaf (ق), dilin en arka kısmından çıkan derin bir “k” sesidir ve daha öndeki kef (ك) harfinden farklıdır.",
      "Güvenilir yöntem, harf çiftlerini yan yana karşılaştırmak, ardından kendini yavaş ve net bir mürettel okuyuşla kontrol etmektir. Kısa bir kelimeyi okurken kendi sesini kaydet, kâriyle karşılaştırarak dinle ve düzelt. Daha da iyisi, yetkin bir hocaya dinlet — bazı hataları kendi kaydında yakalamak neredeyse imkânsızdır.",
    ],
    appLinks: [
      {
        label: "Harf karşılaştırmaları",
      },
    ],
  },
  {
    title: "Kur'an kelime hazinesi",
    summary: "Sık geçen kelimeler — her okuyuşta daha fazlasını anla.",
    body: [
      "İşte cesaret verici bir gerçek: Görece küçük bir sık kullanılan kelime grubu — birkaç yüz kadar — Kur'an metninin çok büyük bir bölümünü oluşturur; çünkü aynı anahtar kelimeler tekrar tekrar geçer. Bu temel kelime hazinesini öğrenmek, atabileceğin en verimli adımdır; çünkü okumayı bir ses akışından, anlamını okurken gerçekten yakaladığın kelimelere dönüştürür.",
      "Bu yolla Kur'an'ı kelime kelime tercüme etmiş olmazsın — bu, tefsir ve mealin işidir — ama okuduğun anda Allah'ın isimlerini, emirleri, vaatleri ve uyarıları doğrudan tanımaya başlarsın. En sık geçen ve en çok anlam yükü taşıyan kelimelerle başla: Allah, Rab, rahmet, iman, sabır, takva (Allah bilinci), dünya ve ahiret. Bu temel gruptan yola çıkarak azar azar genişlet.",
      "Bir oturuşta yüklenmek yerine aralıklı tekrar kullan. Haftada beş yeni kelime öğrenip hepsini her gün tekrar etmek, bir yılda seni bir oturuşta elli kelime ezberleyip unutmaktan çok daha ileriye taşır. Allah, Kur'an'ın öğüt almak için kolaylaştırıldığını vaat eder — kelime hazinesine istikrarla yaklaş, bu kolaylığı bizzat hissedeceksin.",
    ],
    quran: [
      {
        excerpt: "Andolsun, biz Kur'an'ı öğüt almak için kolaylaştırdık. Öğüt alan yok mu?",
      },
    ],
    appLinks: [
      {
        label: "Kelime listesi",
      },
    ],
  },
  {
    title: "Tefsir",
    summary: "Vahyi anlamak — genel bakış, bağlam ve kabul görmüş ilmî kaynaklar.",
    body: [
      "Tefsir, Kur'an'ın açıklanması ve yorumlanması demektir — bir ayetin ne anlama geldiğini, neden indirildiğini ve nasıl uygulandığını açıklığa kavuşturmak. Bunlar Allah'ın sözleri olduğu için âlimler, Kur'an'ın nasıl açıklanması gerektiğine dair sıkı bir yetki sıralaması belirlemiştir; bu sıralamanın içinde kalmak seni hatadan korur.",
      "En sağlam tefsir, Kur'an'ın kendi kendini açıklamasıdır: Bir yerde kısaca geçen bir ayet çoğu zaman başka bir yerde genişçe açıklanır; bu yüzden Kur'an kendisinin en iyi tefsiridir. Ardından Sünnet ile açıklama gelir; çünkü Peygamber ﷺ tam da vahyi açıklamak için gönderilmiştir ve onun sözleri ile uygulamaları vahyin nasıl yaşandığını bize gösterir. Ondan sonra vahyin inişine tanık olan ve bağlamını doğrudan bilen sahabenin anlayışı, ardından da onlardan sonra gelen büyük âlimler gelir. En son ve en alt sırada Arap dili aracılığıyla yorum yer alır. Hiç yeri olmayan şey ise ehliyetsiz kişisel görüştür — kendi fikirlerini metne okumak.",
      "Tefsirde temel bir araç esbab-ı nüzuldür, yani ayetlerin iniş sebepleri: Bir ayetin inmesine yol açan olayı veya soruyu bilmek çoğu zaman anlamının kapısını açar. Ancak bu rivayetlerin de sıhhatinin tespit edilmesi gerekir; çünkü rivayet edilen her “sebep” güvenilir değildir. İyi bir tefsir her sure için, sabit olduğu durumlarda tarihî arka planını, ana temalarını, kilit ayetlerini ve hayata taşınacak pratik dersleri sunar.",
      "En çok kabul gören ve güvenilir kaynaklar arasında İbn Kesir Tefsiri (kapsamlı ve hadisleri ile ilk nesillerin sözlerini dikkatle aktaran), Sa'di Tefsiri (açık, çağdaş ve pratik rehberliğe odaklanan) ve klasik Taberi Tefsiri (ansiklopedik, en erken yorumları koruyan) yer alır. Bir anlam öğrendiğinde hangi kaynaktan geldiğini not et. Bu bölüm yöntemi öğretir; ayet ayet çalışma için yerleşik ve çevrim içi tefsirleri birbirine bağlayan Munib'in Kur'an okuyucusunu kullan.",
    ],
    sources: [
      "İbn Kesir Tefsiri — kısaltılmış İngilizce baskısı yaygın olarak bulunur",
      "Sa'di Tefsiri — anlaşılır özetler",
      "Vahidi'nin Esbabü'n-Nüzul'ü — iniş sebepleri (her olay için sıhhati doğrula)",
    ],
    disclaimer:
      "Tefsirlerin derinliği farklıdır. Âlimler ihtilaf ettiğinde, Allah'ın açık kılmadığı yerde kesinlik iddia etmeden farkı not et.",
    appLinks: [
      {
        label: "Kur'an okuyucusunu aç",
      },
    ],
  },
  {
    title: "Kur'an'ın temaları",
    summary: "İman, namaz, sabır, sadaka, peygamberler — konulara göre gruplanmış ayetler.",
    body: [
      "Kur'an, her bölümde tek bir konunun işlendiği bir ders kitabı gibi düzenlenmemiştir. Bunun yerine büyük temaları — Allah'ın birliği, namaz, sabır, sadaka, peygamberler, ahiret, adalet, aile — bütün metne işlenmiştir; pek çok surede, her seferinde yeni bir açıdan, tekrar tekrar karşımıza çıkar. İlk bakışta tekrar gibi görünen şey aslında pekiştirmedir: Bir tema tanıtılır, sonra derinleştirilir, sonra bir başkasıyla ilişkilendirilir ve sonunda bütün mesaj tutarlı tek bir çağrı olarak ortaya çıkar.",
      "Kur'an'ı temalara göre incelemek bu bütünlüğü ortaya koyar. Örneğin şükür veya Allah'a tevekkül hakkında Kur'an'ın söylediklerini surelerin tamamından bir araya getirdiğinde, ayrı ayrı ayetler birbirini aydınlatır ve ders canlı ve eksiksiz hâle gelir. Bu bölümdeki her tema başlığı ilgili ayetleri, açıklık kattığı yerlerde destekleyici sahih hadisleri, temel dersleri ve bilginin teoride kalmaması için somut adımları bir araya getirir.",
      "Her şeyden önce temaları kendi hayatınla ilişkilendir. Anne babaya iyilik, ticarette dürüstlük, evlilikte adalet, kendi çıkarına aykırı olsa bile adaletten yana durmak — bunlar hayranlıkla okunacak soyut bölümler değil, Kur'an'ın senden almanı istediği günlük kararlardır. Her temayı doğrudan sana yöneltilmiş bir soru olarak oku: Bu, bugün yaptıklarımı nasıl değiştiriyor?",
    ],
    appLinks: [
      {
        label: "Temalara göz at",
      },
    ],
  },
  {
    title: "Kur'an'daki kıssalar",
    summary: "Âdem'den Muhammed'e ﷺ peygamberler — dersler, yerler ve ilgili ayetler.",
    body: [
      "Kur'an peygamberlerin kıssalarını — Âdem, Nuh, İbrahim, Yusuf, Musa, İsa ve daha birçoğu — anlatır ve bunun nedenini açıkça bildirir: “Onların kıssalarında akıl sahipleri için bir ibret vardır.” Bu anlatılar halk masalı veya eğlence değildir. Bunlar, imanı, sabrı ve her çağda tekrar eden aynı imtihanlarla nasıl yüzleşileceğini öğretmek için Allah'ın seçip anlattığı öğütlerdir.",
      "Hepsinde süregelen örüntüye dikkat et. Peygamberler kavimlerini yalnızca Allah'a ibadete çağırdılar; alay edildiler, karşı çıkıldılar ve çoğu zaman yurtlarından çıkarıldılar; sabırla ve Allah'a tam bir güvenle (tevekkül) dayandılar; ve sonunda Allah'ın vaadi gerçekleşti. Onların çektiği zorlukları okurken nasıl karşılık verdiklerinden güç al — ama kendi dereceni asla onlarınkine denk görme. Amaç, onların sebatını ve tevekkülünü içselleştirmektir, makam kıyaslamak değil.",
      "Kur'an'ın kendisi bir anlatıyı öne çıkarır: Allah'ın “kıssaların en güzeli” dediği Yusuf Suresi. Alışılmışın dışında bu kıssa baştan sona tek bir surede anlatılır; bu yüzden onu tek oturuşta, kesintisiz bir yolculuk olarak oku — ihanet, kölelik ve zindanda sabır, ve nihayet affediş ve kavuşma — ve Allah'ın planının yıllarca süren görünürdeki talihsizliklerin ardında nasıl açığa çıktığını izle.",
    ],
    quran: [
      {
        excerpt: "Andolsun, onların kıssalarında akıl sahipleri için bir ibret vardır…",
      },
    ],
    appLinks: [
      {
        label: "Peygamber kıssaları",
      },
    ],
  },
  {
    title: "Kur'an'ın mucizeleri",
    summary: "Dilsel eşsizlik, muhafaza, haber verilen olaylar — ilmî ihtiyatla.",
    body: [
      "Kur'an'ın asıl mucizesi Kur'an'ın kendisidir. Arap şiirinin en belagatli çağında okuma yazma bilmeyen bir insana indirilen Kur'an, en çetin muhaliflerine — dilin ustalarına — onun benzeri tek bir sure bile getirmeleri için açık bir meydan okumada bulundu. On dört asır sonra bu meydan okuma hâlâ karşılıksızdır. Onun hitabet gücü, yapısı, temalarının birbirine kenetlenişi ve rehberliği ile hükümlerinin tutarlılığı klasik belagat ilminde (ilmü'l-belâga) incelenir ve Kur'an'ın kendi iddiasına göre bunların benzeri getirilemez.",
      "Korunmuşluğu ikinci ve doğrulanabilir bir alamettir. Metin hem yazılı olarak, titizlikle aktarılmış el yazmalarıyla, hem de sözlü olarak, kıraatlerle — onu nesilden nesile birebir ezberleyip öğreten kesintisiz kârî zincirleriyle — korunmuştur. Bu, dindarca bir tahmin değil, belgelenmiş bir tarihtir ve Allah'ın Zikri koruma vaadini yerine getirir.",
      "“Bilimsel mucizeler” hakkında da şeyler duyacaksın — embriyonun evrelerine, kâinatın genişlemesine ve benzeri konulara değinen ayetler. Bunlara dikkatle yaklaş. Klasik tefsir bu tür ayetleri çoğu zaman modern savunuculardan oldukça farklı biçimlerde anlamıştır; Kur'an'ı sürekli değişen her bilimsel hipoteze uydurmaya zorlamak, teoriler değiştiğinde ters tepebilir. Yerleşik yorum ile çağdaş tahmini kesin bir şekilde birbirinden ayır.",
      "Tarihî kehanetler de âlimler tarafından zikredilir — Rumların önceden haber verilen zaferi, Mekke'nin barış içinde fethi — ve bunlar incelemeye değerdir; ancak sansasyonel video kliplerle değil, ölçülü tefsir ve siyer yoluyla. Kur'an lehine en güçlü delil her zaman onun tevhidi, bir toplumu ahlaken dönüştürmesi ve eşsiz dili ile korunmuşluğu olmuştur.",
    ],
    quran: [
      {
        excerpt: "O hâlde onun benzeri bir sure getirin… eğer doğru söyleyenlerseniz.",
      },
    ],
    disclaimer:
      "İncelendiğinde daveti mahcup düşürecek abartılı bilimsel mucize iddialarından kaçın. Önce tevhidi, ahlakı ve Kur'an'ın dilsel ve tarihî delillerini öne çıkar.",
  },
  {
    title: "Ezber (Hıfz)",
    summary: "Amme cüzünden tam hıfza planlar — tekrar, ses kaydı, günlük hedefler.",
    body: [
      "Kur'an'ı ezberlemek (hıfz), bir müminin hayatındaki en şerefli uğraşlardan biridir ve yalnızca âlimlere veya çocuklara mahsus değildir — yetişkinler de onu tamamlar. Peygamber ﷺ, kıyamet gününde Kur'an'ı taşıyan kişiye “Oku ve yüksel” deneceğini ve onun her ayetle derece derece yükseleceğini öğretmiştir. Herkesin başladığı yerden başla: Zaten her namazda okuduğun Fatiha Suresi, ardından mushafın en sonundaki kısa sureler, geriye doğru ilerleyerek.",
      "Hıfzdaki en önemli ders sezgiye aykırıdır: Tekrar (müraca'a) yeni ezber eklemekten daha önemlidir. Peygamber ﷺ, ezberlenen Kur'an'ın bağlı bir devenin bağından kurtulmasından daha hızlı unutulduğu konusunda uyarmıştır — tekrar edilmeden bırakılırsa gider. Bu yüzden kural basit ve kesindir: Elindekini sağlamca tekrar etmeden asla yeni bir bölüm ekleme. Sağlam ezberlenmiş az, gevşek ezberlenmiş çoktan daha iyidir.",
      "Pratik yöntem: Aralıklı tekrar kullan; melodinin kendisi hafızanı tetiklesin diye tek bir kâriye bağlı kal; her gün sadece metinden okumakla kalma, ezberden oku; ve bir hocanın seni dinleyip kendi duyamadığın hatalarını işaretlemesini sağla. Munib'in hıfz takipçisi ilerlemeni tek tek ayetlere kadar kaydeder; böylece neyin tekrar zamanının geldiğini her zaman bilirsin.",
      "Seviyene uygun bir plan seç. Başlangıç: Kısa surelerle dolu son cüz olan Amme cüzünü ezberle. Orta seviye: Mülk, Yasin ve Kehf gibi sıkça okunan on sure ekle. İleri seviye: Öncekilerin hepsini sağlamca tekrar ederek tam bir cüz tamamla. Ve hafızlık yolculuğu: Yetkin bir hocayla ve ideal olarak bir senetle — Peygamber'e ﷺ kadar uzanan belgeli bir aktarım zinciriyle — ezberlenen mushafın tamamı.",
    ],
    hadith: [
      {
        excerpt:
          "Kur'an ehline şöyle denilecek: Dünyada okuduğun gibi oku ve yüksel; çünkü senin derecen okuduğun son ayettedir.",
      },
      {
        excerpt:
          "Kur'an ehlinin misali, bağlı devenin sahibinin misali gibidir: Onu gözetirse elinde tutar, salıverirse kaybeder.",
      },
    ],
    appLinks: [
      {
        label: "Ezber planları",
      },
      {
        label: "Hıfz takipçisi",
      },
    ],
  },
  {
    title: "Günlük dersler",
    summary: "Bir ayet, bağlam, tefekkür ve eylem — her gün.",
    body: [
      "Kur'an'a ömür boyu bağlılık, her köklü alışkanlık gibi inşa edilir — her gün biraz, aksatmadan. Peygamber ﷺ, Allah'a en sevimli amellerin az da olsa devamlı yapılanlar olduğunu öğretmiştir ve günlük dersin ardındaki fikrin tamamı bu ilkedir. Her ders sana Arapçasıyla tek bir ayet, mealini, tarihî bağlamına dair bir not, üzerinde düşünmen için bir tefekkür sorusu ve gününe taşıyacağın somut bir eylem verir.",
      "Bu ayetlere gelip geçici bir okuma olarak değil, canlı bir rehberlik olarak yaklaş. Kalbine dokunanları işaretle, onlara geri dön ve seni etkileyenleri ailenle paylaş — aktardığın bir iyiliği başkası uyguladığında onun sevabı sana da ulaşır; böylece öğretmek faydayı katlar.",
      "Küçüklüğüne aldanma. Süreklilik her zaman yoğunluğu geçer: Her gün Kur'an'la geçirilen samimi beş dakika, ayda bir yapılan nadir ve kahramanca bir saatten seni çok daha fazla dönüştürür. Her gün orada ol ve günlerin birikmesine izin ver.",
    ],
    appLinks: [
      {
        label: "Bugünün dersi",
      },
    ],
  },
  {
    title: "Tefekkür (Tedebbür)",
    summary: "Rehberli sorular — Allah ne öğretiyor ve sen bunu nasıl yaşayacaksın?",
    body: [
      "Tedebbür, Kur'an üzerinde derinlemesine düşünmek, bir ayeti seni değişmeye sevk edene kadar kalbinde evirip çevirmek demektir. Bu isteğe bağlı bir ek değil, doğrudan bir emirdir: Allah sorar, “Onlar Kur'an'ı düşünmüyorlar mı? Yoksa kalplerinin üzerinde kilitler mi var?” Okumanın amacı hiçbir zaman sadece ses değildi — amaç kalbe ulaşmak ve bir hayatı yeniden şekillendirmekti.",
      "Tedebbür tefsirle aynı şey değildir. Tefsir, bir ayetin ne anlama geldiğinin ilmî açıklamasıdır; tedebbür ise o anlamı kavradıktan sonra senin ona verdiğin kişisel ve saygılı karşılıktır. İkisi birlikte işler: Önce tefsirden sağlam anlamı öğrenir, sonra onun üzerinde durup sana nasıl hitap ettiğini sorarsın. Yardımcı bir çerçeve üç sorudur: Allah burada bana ne öğretiyor? Bu, bugün yaptıklarımı nasıl değiştiriyor? Bu yüzden hangi alışkanlığı edinmeli veya bırakmalıyım?",
      "Kesin bir sınır tedebbürü güvenli tutar: Bir ayetin senden ne istediği üzerinde düşün, ama metnin kendisine asla yeni anlamlar uydurma. Yorumun sınırlarını sahih tefsirin belirlemesine izin ver ve kişisel düşüncelerini kendi yerlerinde tut — Munib'inki gibi özel bir günlük, bir ayetin sende uyandırdıklarını kaydetmek ve daha sonra onlara dönmek için idealdir.",
    ],
    quran: [
      {
        excerpt: "Onlar Kur'an'ı düşünmüyorlar mı? Yoksa kalplerinin üzerinde kilitler mi var?",
      },
      {
        excerpt:
          "Hâlâ Kur'an'ı düşünmüyorlar mı? Eğer o Allah'tan başkası tarafından olsaydı, onda pek çok çelişki bulurlardı.",
      },
    ],
    appLinks: [
      {
        label: "Tedebbür soruları",
      },
      {
        label: "Günlük",
      },
    ],
  },
  {
    title: "Kur'an'ı uygula",
    summary: "Bir ayetten bugünün görevi — tamamlamayı kaydet, ayeti yaşa.",
    body: [
      "Kur'an bilgisinin amele dönüşmesi gerekir. Allah, bizden öncekilerden Kitab'ı okuyup ona aykırı yaşayanları sert bir dille eleştirmiştir: “Siz Kitab'ı okuduğunuz hâlde insanlara iyiliği emredip kendinizi unutuyor musunuz?” Kur'an seninle Rabbin arasında bir ahittir ve her ayet sessizce senden bir şey ister — mesele, senin buna cevap verip vermediğindir.",
      "Bu görevler bunun için vardır. Her biri belirli bir ayeti bugün yapılabilecek tek bir davranışa bağlar: dilini güzel sözle korumak, gizlice bir sadaka vermek, haram olandan gözünü sakınmak, uzun süredir taşıdığın bir kini bırakmak. Bir ayet, bir eylem — gerçekten yapabileceğin kadar küçük, seni değiştirecek kadar gerçek.",
      "Bir görevi ancak gerçekten yaptığında tamamlandı olarak işaretle. Kayıt tutmanın amacı gösteriş değildir — bu, amacın kendisini boşa çıkarır — başkalarının görmediğini gören Allah'a karşı dürüst bir hesap verebilirliktir. Zamanla, ayet ayet, okuyuş böyle karaktere dönüşür.",
    ],
    quran: [
      {
        excerpt:
          "Siz Kitab'ı okuduğunuz hâlde insanlara iyiliği emredip kendinizi unutuyor musunuz?",
      },
    ],
    appLinks: [
      {
        label: "Bugünün görevi",
      },
    ],
  },
  {
    title: "Kur'an testi",
    summary: "Sure adlarını, yapıyı, tecvidi, kelime hazinesini ve kıssaları gözden geçir.",
    body: [
      "Kendini sınamak, bilginin kalıcı olmasını sağlamanın en etkili yollarından biridir — bir cevabı hatırlamaya çalışmak, hafızayı sadece tekrar okumaktan çok daha fazla güçlendirir. Bu test, bölümdeki her şeyden yararlanır: sure ve cüz sayısı, ilk vahiy ve Kur'an'ın nasıl korunduğu, med ve kalkale gibi tecvid kuralları, sık geçen kelimeler ve Kur'an'ın kıssalarını anlattığı peygamberler.",
      "Niyetini doğru tut. Puan yalnızca öğreniminin bir aynasıdır — asla Allah katındaki derecenin ölçüsü değildir; o yalnızca O'na aittir. Her soruyu bir zayıf noktayı ortaya çıkarmak için kullan, sonra bir sayının peşinden koşmak yerine ilgili derse dönüp tam olarak o konuyu çalış.",
      "Son soru puanlanan bir soru değil, bir tefekkürdür: Sırada anlamak ve ezberlemek için bir sure veya pasaj seç; böylece tekrarın her zaman seni Kitab'ın kendisine geri yönlendirerek biter.",
    ],
    appLinks: [
      {
        label: "Teste başla",
      },
    ],
  },
  {
    title: "Kaynaklar ve referanslar",
    summary: "Kur'an, hadis, tefsir ve âlimlerin ihtilaflarını nasıl kaynak gösteriyoruz.",
    body: [
      "Sağlam İslami bilgi şeffaf deliller üzerine kurulur; bu yüzden bu bölümdeki her ders dayanağını göstermeyi amaçlar. Kur'an hakkındaki bir iddia sure:ayet şeklinde bir referansla desteklenir; Sünnet'ten bir iddia, hadis kitabının adını (Buhari, Müslim, Tirmizi vb.), hadis numarasını ve derecesini (sahih, hasen veya daha zayıf) belirtir; bir ayetin anlamına dair bir iddia, dayandığı tefsiri belirtir; âlimlerin gerçekten ihtilaf ettiği yerlerde ise bu fark gizlenmez, not edilir.",
      "Kesin olanı yoruma dayalı olandan ayırmak da önemlidir. Yerleşik gerçekler — beş vakit namaz, Kur'an'ın korunmuşluğu, siyerin başlıca olayları — açıkça ifade edilir. Ahiret hâllerinin ince ayrıntıları veya bilimsel işaretlerin yorumlanması gibi samimi âlimlerin öteden beri ihtilaf ettiği konular ise kesinleşmiş bir gerçek olarak değil, yorum olarak sunulur. Kesinlik derecesi delilin gücüyle örtüşmelidir.",
      "Daha derin çalışma için yerleşik kaynaklara dayan: güvenilir Kur'an mealleri (Sahih International veya Pickthall gibi), temel hadis kaynakları (başta Sahih-i Buhari ve Sahih-i Müslim), saygın tefsirler (İbn Kesir ve Sa'di) ve güvenilir siyer eserleri (İbn Hişam'ın klasik eseri ve modern bir anlatım için er-Rahîku'l-Mahtûm, “Mühürlü Nektar”).",
      "Son olarak, bir uygulamanın sınırlarını bil. Munib eğitir ve seni kaynaklara yönlendirir, ancak dinî fetva vermez. Kıraat fıkhı, bir tecvid icazeti veya ibadetini ya da hayat kararlarını etkileyen herhangi bir soru için kendi mezhebinden ve bölgenden yetkin bir âlime danış.",
    ],
    sources: [
      "Kur'an — Kral Fahd Kompleksi baskısı / doğrulanmış dijital mushaf",
      "Hadis — sunnah.com derecelendirmeleriyle çapraz kontrol",
      "İbn Kesir Tefsiri (Darussalam kısaltması)",
      "Sa'di Tefsiri (İngilizce)",
    ],
    disclaimer:
      "Munib açık eğitim içeriklerini bir araya getirir. Önemli konuları kendi mezhebinden ve bölgenden yetkin âlimlerle teyit et.",
  },
];

export const QURAN_GUIDE_STRUCTURE_LEVELS_TR: DeepPartial<QuranGuideStructureLevel>[] = [
  {
    label: "Kur'an",
    count: "1 Kitap",
    detail:
      "Tek bir Kitap — kelâmullah, yani Allah'ın lafzen kelâmı; Cebrail aracılığıyla Muhammed'e ﷺ apaçık bir Arapça ile, yaklaşık 23 yıl boyunca tedricen indirilmiştir. Dünyanın her yerinde aynı ve tek bir metindir.",
  },
  {
    label: "Sureler (bölümler)",
    count: "114",
    detail:
      "Kur'an, yalnızca üç ayetten 286 ayete kadar uzanan 114 sureye ayrılır. Her surenin genellikle içindeki anahtar bir kelimeden alınan bir adı vardır ve Mekki ya da Medeni olarak sınıflandırılır. Surelerin mushaftaki sırası vahiyle belirlenmiştir (tevkifi) ve iniş sırasından farklıdır.",
  },
  {
    label: "Cüz (bölümler)",
    count: "30",
    detail:
      "Okumayı kolaylaştırmak için düzenlenmiş, yaklaşık eşit otuz bölüm. Günde bir cüz okumak Kur'an'ın tamamını bir ayda bitirir — Ramazan'da hatim yapmanın klasik yolu budur.",
  },
  {
    label: "Hizip (kısımlar)",
    count: "60",
    detail:
      "Her cüz iki hizbe ayrılır; böylece toplam 60 hizip olur ve her hizip de çeyreklere bölünür. Bu küçük birimler, hafif bir günlük miktar — yarım veya çeyrek hizip — belirlemeni ve istikrarlı bir alışkanlık sürdürmeni sağlar.",
  },
  {
    label: "Ayetler",
    count: "6.236",
    detail:
      "Tek tek ayetler, herhangi bir pasaj sure:ayet şeklinde tam olarak gösterilebilsin diye numaralandırılmıştır. 6.236, standart Medine sayımıdır; diğer tarihî sayım yöntemleri yalnızca birkaç ayet sınırının nasıl işaretlendiği konusunda farklılık gösterir — kelimelerin kendisi aynıdır.",
  },
  {
    label: "Mekki / Medeni",
    count: "2 dönem",
    detail:
      "Her sure iki vahiy döneminden birine aittir. Mekki (hicretten önce) sureler genellikle daha kısadır ve inanç, tevhid ve ahiret üzerinde durur. Medeni (hicretten sonra) sureler genellikle daha uzundur ve hukuk ile toplumsal rehberlik ekler. Birkaç sure her iki döneme ait ayetler içerir.",
  },
  {
    label: "Temalar",
    count: "Pek çok",
    detail:
      "Kur'an konu konu düzenlenmemiş, tekrar eden temalar etrafında örülmüştür. Tevhid, namaz, peygamber kıssaları, aile, sadaka, sabır ve ahiret Kitab'ın tamamında yer alır ve pek çok surede birbirini pekiştirir.",
  },
];

export const QURAN_GUIDE_TIMELINE_TR: DeepPartial<QuranGuideTimelineEvent>[] = [
  {
    title: "Vahiyden önceki hayat",
    body: "Peygamberlikten önceki yıllarda Muhammed ﷺ, Mekke toplumundaki putperestlik ve zulümden rahatsız olarak günlerce yalnızlık ve tefekkür için Hira Mağarası'na çekilirdi. Etrafındaki dünya putlara taparken o hiçbir zaman tapmadı; kavmi de ona o kadar güveniyordu ki, peygamberlik iddiasından çok önce ona el-Emin — güvenilir — diyorlardı.",
    location: "Mekke",
  },
  {
    title: "Hira Mağarası",
    body: "Ramazan ayında, yaklaşık kırk yaşındayken melek Cebrail mağarada ona tek bir emirle geldi: “Oku!” Okuma yazma bilmeyen Peygamber ﷺ okuyamayacağını söyledi. Melek onu üç kez sıkıca kucakladı ve ardından Alak Suresi'nin ilk kelimelerini iletti: “Yaratan Rabbinin adıyla oku.” Sarsılmış hâlde evine, eşi Hatice'nin yanına koştu; Hatice onu bir örtüye sardı ve teskin etti.",
    location: "Nur Dağı, Mekke",
  },
  {
    title: "İlk vahiy — Alak Suresi",
    body: "Okuma emri, peygamberliğin ve Kur'an'ın inişinin başlangıcı oldu. Hatice onu ilim sahibi akrabası Varaka b. Nevfel'e götürdü; Varaka meleği Musa'ya gelen aynı elçi olarak tanıdı ve Peygamber'in ﷺ kavminin onu yurdundan çıkaracağını önceden haber verdi. Bunu izleyen en erken Mekke vahiyleri Allah'ın birliğine, ahiretin kesinliğine ve kapsamlı bir ahlaki ıslah çağrısına odaklandı.",
  },
  {
    title: "Erken Mekke dönemi",
    body: "İlk yıllarda davet gizliydi, sonra açık hâle geldi. Davet büyüdükçe Kureyş zulme başvurdu — müminler arasındaki zayıflara ve kölelere işkence etti — ve sonunda Peygamber'in ﷺ kabilesi Haşimoğullarına üç yıl süren ağır bir boykot uyguladı. Bu zulümden kurtulmak için bir grup Müslüman Habeşistan'a hicret etti; orada adil bir Hristiyan kral onlara sığınak verdi. Bu dönemin sureleri genellikle kısa, güçlü ve ahenkli ayetlerle hitap eder.",
    location: "Mekke",
  },
  {
    title: "Medine'ye hicret",
    body: "Yıllar süren zulümden ve hem Hatice'yi hem de amcası Ebu Talib'i kaybettiği “hüzün yılı”ndan sonra Peygamber ﷺ ve ashabı Medine'ye hicret etti. Bu hicret o kadar önemliydi ki sonradan İslami takvimin başlangıcı oldu. Medine'de Müslümanlar artık takip edilen bir azınlık değil, bir toplum kuran bir topluluktu; vahiy de artık hukuk, aile, ekonomi ve Ehl-i Kitap ile ilişkiler konularına değinmeye başladı.",
    location: "Medine",
  },
  {
    title: "Medine dönemi",
    body: "Medeni sureler genellikle daha uzun ve daha ayrıntılıdır; yerleşik bir topluluğun ihtiyaç duyduğu hükümleri ortaya koyar: namaz, zekât, oruç, evlilik ve boşanma, miras, sözleşmeler ve antlaşmalarla ilgili ayrıntılar. Bu dönemde büyük savaşlar da yaşandı — Bedir, Uhud ve Hendek (Ahzab) — ve Kur'an müminlerin imtihanlarını ve münafıkların entrikalarını çarpıcı bir açıklıkla ele aldı.",
    location: "Medine",
  },
  {
    title: "Veda Haccı",
    body: "Hicretin onuncu yılında Peygamber ﷺ tek haccını yaptı ve Arafat'ta büyük bir kalabalık önünde Veda Hutbesi'ni irat etti; ümmete can ve malın dokunulmazlığını, kadınların haklarını, ırk ayrımı gözetmeksizin bütün insanların eşitliğini ve Kur'an ile Sünnet'e sımsıkı sarılma yükümlülüğünü hatırlattı. Şu ayet de burada indi: “Bugün sizin için dininizi kemale erdirdim.”",
    location: "Arafat / Mina",
  },
  {
    title: "Ebu Bekir döneminde derleme",
    body: "Peygamber'in ﷺ vefatından kısa bir süre sonra, Kur'an'ın tamamını ezberlemiş pek çok sahabi Yemame Savaşı'nda şehit oldu. Hafızların kaybından endişe eden Ömer, halife Ebu Bekir'i Kur'an'ı tek bir yerde toplatmaya teşvik etti. Ebu Bekir güvenilir vahiy kâtibi Zeyd b. Sabit'i görevlendirdi; Zeyd yazılı vahyi — sahabenin ezberleriyle karşılaştırarak doğrulayıp — titizlikle tek bir sayfalar topluluğunda (suhuf) bir araya getirdi.",
  },
  {
    title: "Standart mushaf — Osman",
    body: "İslam pek çok diyara yayıldıkça yeni Müslümanlar arasındaki okuyuş farklılıkları anlaşmazlıklara yol açmaya başladı. Ümmeti tek bir yazılı metin üzerinde birleştirmek için halife Osman, Ebu Bekir'in suhufundan Kureyş lehçesiyle resmî nüshalar çoğalttırdı ve bunları büyük şehirlere gönderdi; diğer şahsi nüshaların bir kenara bırakılmasını istedi. Bu Hz. Osman mushafı (Mushaf-ı Osmanî), o günden beri bütün Müslüman dünyanın takip ettiği standarttır.",
  },
  {
    title: "Bugüne kadar korunmuşluk",
    body: "On dört asır sonra Kur'an değişmeden durmaktadır; birbirini destekleyen üç yolla korunmuştur: her nesilde kitlesel ezber (hıfz), sadık yazılı aktarım ve Peygamber'e ﷺ kadar uzanan, hocadan talebeye kesintisiz kıraat zincirleri. Bu, Allah'ın bizzat kendi vaadini yerine getirir: “Şüphesiz Zikri biz indirdik ve onun koruyucusu da elbette biziz.”",
  },
];

export const QURAN_GUIDE_STORIES_TR: DeepPartial<QuranGuideStory>[] = [
  {
    prophetName: "Hz. Âdem",
    title: "Hz. Âdem — ilk peygamber ve insanlığın atası",
    summary: "Yaratılış, meleklerin secdesi, ağaç imtihanı, kabul edilen tövbe.",
    body: [
      "Allah ilk insan olan Âdem'i kendi elleriyle balçıktan yarattı, ona ruhundan üfledi ve ona başka hiçbir varlığa verilmeyen bir lütuf bahşetti: Âdem'e her şeyin isimlerini öğretti. Allah bu bilgiyi ortaya koyduğunda melekler kendi sınırlarını itiraf ettiler ve Âdem'in şerefi açığa çıktı — insanlığı diğerlerinden ayıran şeyin bir parçası bizzat ilimdi.",
      "Ardından Allah meleklere Âdem'e saygı secdesi etmelerini emretti ve hepsi itaat etti — cinlerden olan İblis hariç. O kibrinden dolayı reddetti; kendisinin ateşten, Âdem'in ise balçıktan yaratıldığını öne sürerek kendini üstün gördü. Onun sonunu getiren cehalet değil, işte bu kibirdi ve Âdemoğullarını saptıracağına yemin etti.",
      "Âdem ve eşi Havva cennete yerleştirildi ve her şeyden serbestçe yararlanabilecekleri, ancak belirli bir ağaca yaklaşmamaları gerektiği bildirildi. Şeytan onlara ısrarla vesvese verdi ve sonunda o ağaçtan yediler. Hemen avret yerleri kendilerine göründü ve hatalarını hissettiler. Ama ümitsizliğe düşmek ya da bahane üretmek yerine alçakgönüllülükle Allah'a yöneldiler: “Rabbimiz! Biz kendimize zulmettik. Eğer bizi bağışlamaz ve bize merhamet etmezsen, mutlaka kaybedenlerden oluruz.”",
      "Allah onların tövbesini kabul etti ve onları yeryüzüne indirdi — keyfî bir ceza olarak değil, hidayet vaadiyle birlikte insanlık imtihanının başlangıcı olarak: “Kim benim hidayetime uyarsa o ne sapar ne de bedbaht olur.” Böylece Âdem'in kıssası her insanın kıssasıdır: şerefle yaratılmış, imtihan edilen, hata yapabilen ve her zaman geri dönebilen.",
    ],
    lessons: [
      "Tövbe kapısı her zaman açıktır — Âdem'in bahanesiz ve gecikmesiz yaptığı tövbe, her günahkâr için örnektir.",
      "Kibir helakin köküdür: İblis hakkı bildiği hâlde kibrinden onu reddetti; bu, tevazu olmadan bilginin insanı mahvettiğini gösterir.",
      "Şeytanın yöntemi zorlama değil, ısrarlı vesvesedir — telkinlerini tanımak, onlara direnmenin yarısıdır.",
      "İnsanın değeri günahsız olmaya değil, ilme ve Allah'a geri dönmeye bağlıdır — bizi tanımlayan, hataya verdiğimiz karşılıktır.",
    ],
    quran: [
      {
        excerpt: "Âdem'in yaratılışı ve meleklerin secdesi.",
      },
      {
        excerpt: "İmtihan, düşüş ve tövbe.",
      },
    ],
    location: "Cennet, sonra yeryüzü",
  },
  {
    prophetName: "Hz. Nuh",
    title: "Hz. Nuh — asırlar süren inkâr karşısında sabır",
    summary: "950 yıllık davet, gemi ve ilahi hüküm olarak tufan.",
    body: [
      "Nuh, putperestliğe düşmüş bir kavme gönderildi ve onları şaşırtıcı derecede uzun bir süre yalnızca Allah'a ibadete çağırdı — Kur'an onun aralarında bin yıldan elli yıl eksik kaldığını bildirir. Onları gece gündüz, açıktan ve gizliden çağırdı; onlara her türlü gerekçeyi sundu: bağışlanma, yağmur, mal, evlat ve bahçeler. Yine de nesilden nesile yüz çevirdiler, onunla alay ettiler ve kulaklarını tıkadılar.",
      "Artık kimsenin iman etmeyeceği anlaşılınca Allah Nuh'a gemiyi yapmasını emretti. O, herhangi bir denizden çok uzakta büyük bir gemi inşa ederken kavmi onunla alay etti; ama o, anlayacakları bir günün geleceğini söyledi. Alamet, tandırdan su fışkırdığında geldi; Nuh iman edenleri — ki sadece birkaç kişiydiler — ve her hayvan türünden birer çifti gemiye aldı.",
      "Tufan yükseldi ve inkârcıları boğdu. Kıssanın en yürek burkan anlarından birinde Nuh'un kendi oğlu, sudan kurtulmak için bir dağa tırmanacağında ısrar ederek gemiye binmeyi reddetti ve boğulanlar arasında yer aldı — bir babanın acısı, bir oğulun inkârının önüne geçemezdi. Nuh onun için Allah'a yalvardığında Allah, oğlunun kötü amelinin aralarındaki iman bağını kopardığını öğretti.",
      "Emir geldiğinde sular çekildi ve gemi Cudi Dağı'nın üzerine oturdu. Kur'an bütün bu olayı, Allah'ın iman edenleri nasıl kurtardığını ve sabrın nihayetinde nasıl haklı çıktığını düşünen herkes için “bir ibret” olarak korur.",
    ],
    lessons: [
      "Az sayıda takipçiyle sürdürülen uzun ve zorlu bir görev başarısızlık değildir — Nuh asırlarca tebliğ etti; Allah'ın hoşnut olduğu şey takipçi sayısı değil, onun samimiyetiydi.",
      "Hiçbir aile bağı imanı olmayan birini kurtaramaz: Nuh'un kendi oğlu boğuldu; bu, hidayetin miras kalmadığını gösterir.",
      "Sürekli alaylara rağmen Allah'a davette sebat etmek, başlı başına bir ibadettir.",
      "Allah'ın kurtarışı takdir edilen vakitte gelir — mümin, vaade güvenerek tufandan önce itaat “gemisini” inşa eder.",
    ],
    quran: [
      {
        excerpt: "Nuh'un ayrıntılı kıssası.",
      },
      {
        excerpt: "Nuh'un kavmine yakarışı.",
      },
    ],
    location: "Antik Mezopotamya (ilmî tahminler)",
  },
  {
    prophetName: "Hz. İbrahim",
    title: "Hz. İbrahim — Allah'ın dostu (Halilullah)",
    summary: "Putları kırmak, serinleyen ateş, İsmail'in kurban edilişi, Kâbe'nin inşası.",
    body: [
      "İbrahim daha genç bir adamken aklını kullanarak tevhide ulaştı; kavminin ve kendi babasının yontup taptığı putları reddetti. Onlarla tartıştı, sonra harekete geçti: Onlar bir bayram için dışarıdayken en büyüğü dışındaki bütün putları kırdı; bir açıklama istediklerinde de büyük putun kendisine sormalarını söyledi — böylece taptıkları şeyin acizliğini ortaya koydu. Öfkeye kapılan kavmi büyük bir ateş yakıp onu içine attı; ama Allah “Ey ateş! İbrahim'e karşı serin ve esenlik ol” diye emretti ve o, ateşten hiçbir zarar görmeden çıktı.",
      "Allah'ın emriyle İbrahim, eşi Hacer'i ve bebek oğulları İsmail'i Mekke'nin çorak vadisinde bıraktı. Suları tükenince Hacer, yardım aramak için çaresizlik içinde Safa ile Merve tepeleri arasında koştu — Müslümanların hac sırasında sa'yde canlandırdığı arayış budur — ta ki bebeğin ayaklarının dibinden Zemzem pınarı fışkırana kadar. Yıllar sonra İbrahim rüyasında sevgili oğlunu kurban edeceğini gördü. Baba da oğul da Allah'ın iradesine teslim oldu; tam İbrahim bunu yerine getirmek üzereyken Allah, İsmail'e karşılık büyük bir koçu fidye olarak verdi; bu olay her yıl Kurban Bayramı'nda anılır.",
      "İbrahim ve yetişkin olan İsmail birlikte Mekke'de Kâbe'nin temellerini yükselttiler ve inşa ederken şöyle dua ettiler: “Rabbimiz! Bizden kabul buyur.” İbrahim ayrıca soylarından bir peygamber gönderilmesi için dua etti — asırlar sonra Peygamber Muhammed ﷺ ile kabul edilen bir dua. Sarsılmaz bağlılığından dolayı Allah İbrahim'i eşsiz bir unvanla şereflendirdi: Halilullah, Allah'ın samimi dostu.",
    ],
    lessons: [
      "Tevhid, putperestlik yaygın ve atalardan kalma bir gelenek olsa ve ona karşı durmak tehlikeli olsa bile sahte bağlılıkları kırmayı gerektirir.",
      "Allah'a tam güven, O'nun emri en ağır olduğunda en parlak şekilde görünür — İbrahim oğlunu kurban etmeye bile teslim oldu ve Allah bu imtihanı rahmetle değiştirdi.",
      "Allah'a tevekkül pasiflik demek değildir: Hacer koştu ve aradı, ardından Zemzem geldi — gayret ve tevekkül birlikte işler.",
      "Samimi ibadetler nesiller boyunca yankılanır; haccın menasiki ve Kâbe'nin şerefi İbrahim'in itaatine dayanır.",
    ],
    quran: [
      {
        excerpt: "İbrahim, İsmail ve kurban.",
      },
      {
        excerpt: "Ahit ve miras.",
      },
    ],
    location: "Irak, Şam diyarı, Mekke",
  },
  {
    prophetName: "Hz. Yusuf",
    title: "Hz. Yusuf — güzel sabır (sabr-ı cemil)",
    summary: "İhanet, kölelik, zindan, iktidara yükseliş — her imtihanda tevekkül.",
    body: [
      "Yusuf çocukken rüyasında on bir yıldız ile güneş ve ayın kendisine secde ettiğini gördü — büyük bir geleceğin işareti. Kendisi de bir peygamber olan babası Yakub, ona bunu kıskanç kardeşlerinden gizlemesini söyledi. Kıskançlıkları onlara galip geldi: Yusuf'u bir kuyunun dibine attılar ve babalarına onu bir kurdun yediğini söylediler. Oradan geçen bir kervan çocuğu buldu ve Mısır'da sattı.",
      "Bir ileri gelenin evinde göz alıcı güzellikte ve dürüst bir adam olarak büyüdü. O ileri gelenin karısı onu baştan çıkarmaya çalıştığında Yusuf “Allah'a sığınırım” diyerek reddetti; kadın onu tehdit edince de günah yerine zindanı seçti. Masum olduğu hâlde yıllarca hapsedildi. Orada zindan arkadaşlarını tevhide davet etti ve Allah'ın izniyle rüyalarını yorumladı.",
      "Kral, yedi zayıf ineğin yedi semiz ineği yediği bir rüyayla huzursuz olunca Yusuf bunu yedi bolluk yılının ardından yedi kıtlık yılı gelecek şeklinde yorumladı ve tahılın depolanmasını tavsiye etti. Sonunda hikmeti ve güvenilirliğiyle tanınarak Mısır'ın ambarlarının başına getirildi.",
      "Kıtlık nihayet kardeşlerini yiyecek aramak için Mısır'a getirdi; karşılarındaki güçlü veziri tanımadılar. Onları sınadıktan sonra Yusuf kendini tanıttı ve intikam almak yerine onları tamamen affetti: “Bugün size bir kınama yok. Allah sizi bağışlasın.” Aile yeniden bir araya geldi, anne babası onurlandırıldı ve çocukluk rüyası gerçek oldu.",
    ],
    lessons: [
      "Sabr-ı cemil — güzel sabır — zorluğa acılaşmadan ve insanlara şikâyet etmeden katlanmak, Yakub'un yaptığı gibi derdini yalnızca Allah'a götürmek demektir.",
      "İffet her bedele değer: Yusuf günah yerine zindanı seçti ve Allah bu sebeple onun derecesini yükseltti.",
      "Allah'ın planı çoğu zaman yıllar süren görünürdeki talihsizliklerin ardında gizlidir — kuyu, kölelik ve zindan, Yusuf'un şerefine giden adımlardı.",
      "Güçlüler güçlerini affederek gösterir: Gücünün zirvesinde Yusuf kendisine zulmedenleri bağışladı.",
    ],
    quran: [
      {
        excerpt: "Kıssaların en güzeli — tek bir surede anlatılır.",
      },
    ],
    location: "Kenan, Mısır",
  },
  {
    prophetName: "Hz. Musa",
    title: "Hz. Musa — Allah ile konuştu ve Firavun'un karşısına çıktı",
    summary:
      "Yanan ağaç, Firavun'a karşı mucizeler, Mısır'dan çıkış, Tevrat ve yolunu kaybeden kavim.",
    body: [
      "Annesi onu Firavun'un İsrailoğullarının erkek çocuklarını katletmesinden kurtarmak için nehre bıraktıktan sonra Musa, Allah'ın takdiriyle bizzat Firavun'un sarayında büyüdü. Genç bir adamken bir ölüm olayının ardından Mısır'dan kaçtı; yıllar sonra çölden dönerken Tur Dağı'nda bir ateş gördü. Orada Allah onunla doğrudan konuştu — Musa'ya Kelimullah, yani Allah ile konuşan unvanını kazandıran bir şeref — ve “Şüphesiz ben senin Rabbinim” buyurdu. Destekçisi olarak kardeşi Harun ile birlikte zorba Firavun'a şu taleple geri gönderildi: İsrailoğullarını salıver.",
      "Firavun ilahlık iddia etti ve reddetti. Allah Musa'ya apaçık mucizeler verdi — asasının canlı bir yılana dönüşmesi ve elinin bembeyaz parlaması. Firavun onu itibarsızlaştırmak için en usta sihirbazlarını çağırdı; ama Musa'nın asası onların göz boyamalarını yutunca sihirbazlar gerçek hakikati basit bir hileden ayırt ettiler ve Firavun onları ölümle tehdit ederken bile Musa ile Harun'un Rabbine iman ettiklerini ilan ederek secdeye kapandılar. Ardından birbiri ardına belalar geldi, fakat Firavun yalnızca daha da katılaştı.",
      "Sonunda Allah Musa'ya kavmini geceleyin çıkarmasını emretti. Firavun onları denize kadar takip etti; Musa asasıyla denize vurdu ve sular yarılarak müminlerin kuru toprak üzerinde geçmesine izin verdi. Firavun ve ordusu peşlerinden gelince deniz üzerlerine kapandı ve boğuldular. Ardından Musa Tevrat'ı aldı; ancak İsrailoğulları inatçı çıktı — onun yokluğunda altından bir buzağıya taptılar ve vaat edilen topraklara girmeyi reddettiler — ve bunun sonucunda kırk yıl boyunca başıboş dolaştılar.",
    ],
    lessons: [
      "Tamamen Allah'a dayanarak zulme karşı hakkı söyle — Musa, çağının en güçlü adamının karşısına yalnızca imanla donanmış olarak çıktı.",
      "Samimi müminler bile tereddüt edebilir: Musa'ya karşı çıkan sihirbazlar, tek bir açıklık anında, mucizeler görmüş koca bir kavimden daha sebatlı hâle geldiler.",
      "Mucizelere tanık olmak tek başına iman doğurmaz — hidayet, Allah'ın inatçı kalbe değil, alçakgönüllü kalbe verdiği bir lütuftur.",
      "Allah mazlumları kurtarır ve kibirlileri, ne kadar güçlü görünürlerse görünsünler hesaba çeker.",
    ],
    quran: [
      {
        excerpt: "Musa Tur'da ve Firavun'un huzurunda.",
      },
      {
        excerpt: "Doğumu ve yetişmesi.",
      },
    ],
    location: "Mısır, Sina",
  },
  {
    prophetName: "Hz. İsa",
    title: "Meryem oğlu Hz. İsa — Allah'tan bir kelime ve bir ruh",
    summary:
      "Mucizevi doğum, mucizeler, Allah katına yükseltiliş — Kur'an'a göre ne öldürüldü ne de çarmıha gerildi.",
    body: [
      "Allah'ın kendi zamanındaki kadınların en hayırlısı olarak seçtiği iffetli ve dindar bir kadın olan Meryem, ailesinden ayrılarak doğu tarafında bir yere çekildi. Orada melek Cebrail ona bir insan suretinde göründü ve kendisine hiçbir erkek dokunmamış olmasına rağmen Allah'ın ona tertemiz bir oğul bağışlayacağını müjdeledi. Allah'ın “Ol” sözüyle hamile kaldı ve İsa yaratıldı — Kur'an onun yaratılışını babasız yaratılan Âdem'in yaratılışına benzetir ve Allah'ın dilediğini dilediği gibi yarattığını gösterir.",
      "Bebeği kucağında taşıyarak döndüğünde kavmi onu suçladı. Onu savunmak için bebek İsa beşikte konuştu; kendisinin Allah'ın kulu olduğunu, kendisine Kitap verildiğini ve peygamber kılındığını ilan etti — annesinin namusunu bir mucizeyle temize çıkardı. İsrailoğullarına gönderilen bir peygamber olarak İsa'ya Allah'ın izniyle apaçık mucizeler verildi: Körleri ve cüzamlıları iyileştirdi, ölüleri diriltti ve çamurdan bir kuş şekli yapıp uçurdu — bunların her zaman kendi gücüyle değil, “Allah'ın izniyle” olduğunu vurguladı.",
      "Kur'an İsa'nın ne öldürüldüğünü ne de çarmıha gerildiğini açıkça bildirir; aksine bu, düşmanlarına öyle gösterildi ve Allah onu kendi katına yükseltti. Ehl-i Sünnet inancına göre o, kıyamet gününden önce geri dönecektir. En önemlisi, Kur'an İsa'nın bir insan peygamber ve Allah'ın kulu olduğunu, ilah olmadığını ve Allah'ın oğlu olmadığını vurgular — bu, onun beşikten sonuna kadar bizzat ilan ettiği mesajdır.",
    ],
    lessons: [
      "Allah dilediği gibi yaratır — İsa'nın babasız doğumu, Âdem'in topraktan yaratılışı gibi, O'nun kudretinin hiçbir dünyevi sebebe bağlı olmadığını gösterir.",
      "İsa'nın gösterdiği her mucize açıkça “Allah'ın izniyle” idi; bu, peygamberlerin Allah'ın kudretine aracılık ettiğini, ona sahip olmadıklarını öğretir.",
      "Peygamberler Allah'ın şerefli insan kullarıdır, asla ibadet edilmezler — Kur'an İsa'nın gerçek konumunu aşırılığa karşı korur.",
      "Meryem'in iffeti, sabrı ve tevekkülü onu kadın erkek bütün müminler için bir iman örneği yapar.",
    ],
    quran: [
      {
        excerpt: "Doğumu ve beşikte konuşması.",
      },
      {
        excerpt: "Ne öldürüldü ne de çarmıha gerildi; yükseltildi.",
      },
    ],
    location: "Filistin",
  },
  {
    prophetName: "Muhammed ﷺ",
    title: "Muhammed ﷺ — peygamberlerin sonuncusu",
    summary: "Son elçi; 23 yılda indirilen Kur'an; âlemlere rahmet.",
    body: [
      "Muhammed ﷺ miladi 570 yılı civarında Mekke'de Kureyş kabilesinde dünyaya geldi. Küçük yaşta yetim kaldı — babası o doğmadan, annesi ise o altı yaşındayken vefat etti — önce dedesi, sonra amcası Ebu Talib tarafından büyütüldü. Peygamberlikten çok önce dürüstlüğüyle öylesine güven kazanmıştı ki kavmi ona “güvenilir” anlamında el-Emin derdi. Kırk yaşında, Hira Mağarası'nda tefekkür ederken Cebrail aracılığıyla Kur'an'ın ilk vahyini aldı.",
      "Mekke'de on üç yıl boyunca insanları yalnızca Allah'a ibadete çağırdı ve şiddetli bir zulümle karşılaştı: alay, takipçilerinden zayıf olanlara işkence ve kabilesine uygulanan, hayatı felç eden sosyal ve ekonomik boykot. Tek bir “hüzün yılı”nda hem sevgili eşi Hatice'yi hem de koruyucusu Ebu Talib'i kaybetti; yakındaki Taif'te destek aradığında ise oradan kovuldu ve taşlandı — yine de onların helakı için değil, hidayeti için dua etti.",
      "Medine'ye hicret ettikten sonra bir topluluk kurdu ve onu Bedir, Uhud ve Hendek imtihanlarından geçirdi. Sonunda ezici bir güçle Mekke'yi fethetmek üzere geri döndüğünde, kendisine işkence edip onu yurdundan çıkaranlardan intikam almadı; onları affetti ve “Gidiniz, serbestsiniz” dedi. Kur'an onun görevini tek bir ifadeyle özetler — “âlemlere rahmet” — ve görevinin kimseyi iman etmeye zorlamak değil, mesajı açıkça tebliğ etmek olduğunu bildirir.",
    ],
    lessons: [
      "Bir insanın sahip olabileceği en güzel ahlak, Peygamber'in ﷺ ahlakıdır — onun siyerini dikkatle incele ve onu günlük hayatında yaşamaya gayret et.",
      "Merhamet ve affedicilik zayıflık değil, güçtür: Gücünün zirvesinde en azılı düşmanlarını bağışladı.",
      "Allah'a davet eden kişi mesajı samimiyet ve sabırla tebliğ eder, ama sonucu Allah'a bırakır — hidayet vermek O'na aittir.",
      "İmtihanlar peygamberlerin yoludur; onun yaptığı gibi Allah rızası için zorluklara katlanmak, gerçek imanın alametidir.",
    ],
    quran: [
      {
        excerpt: "Biz seni ancak âlemlere rahmet olarak gönderdik.",
      },
      {
        excerpt: "Kendi aralarında merhametli, inkârcılara karşı çetindirler.",
      },
    ],
    appLinks: [
      {
        label: "Siyer zaman çizelgesi",
      },
    ],
  },
];

export const QURAN_GUIDE_THEMES_TR: DeepPartial<QuranGuideTheme>[] = [
  {
    title: "İman",
    summary: "Allah'a, meleklerine, kitaplarına, peygamberlerine, ahiret gününe ve kadere iman.",
    lessons: [
      "İman, Kur'an'ın bir arada zikrettiği altı esasa dayanır: Allah'a, meleklerine, indirdiği kitaplara, peygamberlerine, ahiret gününe ve kadere — hayrına ve şerrine — iman.",
      "İman sabit, bir defalık bir onay değildir. Ehl-i Sünnet'in çoğunluğunun görüşüne göre iman itaat ve zikirle artar, günah ve gafletle azalır; dolayısıyla iman, senin aktif olarak büyüttüğün bir şeydir.",
      "Peygamber ﷺ imanın yetmişi aşkın şubesi olduğunu öğretmiştir; bunların en yükseği “Allah'tan başka ilah yoktur” şahadeti, en aşağısı ise yoldan eziyet veren bir şeyi kaldırmaktır. Bu da küçük iyiliklerin bile imandan olduğunu gösterir.",
      "Gerçek iman, dilden önce kalbin işidir: Allah'ı gerçekten tanımak, O'nu her şeyden çok sevmek, O'nun hoşnutsuzluğundan korkmak ve tamamen O'na dayanmak.",
    ],
    quran: [
      {
        excerpt: "Peygamber, Rabbinden kendisine indirilene iman etti, müminler de…",
      },
    ],
    hadith: [
      {
        excerpt:
          "İman yetmiş küsur şubedir; en üstünü “Allah'tan başka ilah yoktur” demek, en aşağısı ise yoldan eziyet veren bir şeyi kaldırmaktır — haya da imandan bir şubedir.",
      },
    ],
    actions: [
      "Bugün şahadetini sıradan bir söz olarak değil, anlamına tam dikkat ederek yenile.",
      "Allah'ın isimlerinden birini öğren, anlamını kavra ve duanda O'na bu isimle yalvar.",
    ],
  },
  {
    title: "Namaz",
    summary: "Kıyamet gününde ilk sorulacak amel — kulu Rabbine bağlayan direk.",
    lessons: [
      "Namaz İslam'ın ikinci şartıdır ve kulun kıyamet gününde ilk hesaba çekileceği ameldir — o sağlam olursa amel defterinin geri kalanı da genellikle onu izler.",
      "Kur'an, kalbin gerçek huzuruyla kılınan namazın insanı hayâsızlıktan ve kötülükten alıkoyduğunu bildirir; namaz yalnızca bir ritüel değil, günde beş kez tekrarlanan bir ruh yenilenmesidir.",
      "Yeryüzünde indirilen diğer farzların aksine namaz, Peygamber'in ﷺ miracı (İsra ve Miraç) sırasında ümmete farz kılınmıştır; bu, onu özel bir hediye ve müminin Allah'a yükselişinin aracı olarak öne çıkarır.",
      "Günde beş kez tekrarlandığı için namaz, bir ibadetle diğeri arasında imanı canlı tutan istikrarlı bir ritimdir.",
    ],
    quran: [
      {
        excerpt:
          "Şüphesiz namaz hayâsızlıktan ve kötülükten alıkoyar. Allah'ı anmak ise elbette en büyüktür.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kıyamet gününde kulun amellerinden ilk hesaba çekileceği şey namazıdır; o düzgün olursa kurtuluşa erer ve başarır, bozuk olursa hüsrana uğrar ve kaybeder.",
      },
    ],
    actions: [
      "Bugün bir namazı, okurken Fatiha'nın kelimelerini anlayarak yavaşça kıl.",
      "Namazının bir yönünü güçlendirmek için Munib'in Namaz Öğren rehberini aç.",
    ],
  },
  {
    title: "Anne baba",
    summary:
      "Anne babaya iyilik Allah'a ibadetle birlikte zikredilir — şirkten sonra onlara nankörlük konusunda uyarılır.",
    lessons: [
      "Allah, anne babaya iyiliği aynı ayette doğrudan kendisine ibadetle birlikte zikreder — bu, İslam'da onların hakkının ne kadar ağır olduğunun bir işaretidir.",
      "Kur'an en küçük bir rahatsızlık belirtisini bile yasaklar: onlara “öf” bile demeyi, sert konuşmayı yasaklar ve onlara yumuşak, saygılı sözlerle hitap etmeyi emreder.",
      "Bu emir, anne babanın sabra en çok ihtiyaç duyduğu yaşlılık döneminde doruğa ulaşır: Bir zamanlar onlar sana nasıl baktıysa sen de onlara öyle bak ve merhametinden dolayı onlara tevazu kanadını indir.",
      "Bağlılık ölümle bitmez — anne baba için dua etmeye devam etmek, onlar adına sadaka vermek, dostlarına ve verdikleri sözlere saygı göstermek süregelen vefa davranışlarıdır.",
    ],
    quran: [
      {
        excerpt:
          "Rabbin, kendisinden başkasına kulluk etmemenizi ve anne babaya iyi davranmanızı kesin olarak emretti…",
      },
    ],
    actions: [
      "Bugün annene ya da babana güzel sözlerle telefon et veya mesaj gönder.",
      "Anne baban için isimlerini anarak dua et.",
    ],
  },
  {
    title: "Sabır",
    summary: "İtaatte sebat, günahtan uzak durma ve imtihanları kabullenme.",
    lessons: [
      "Âlimler sabrı üç şekilde tarif eder: Allah'a itaatte sabır, günahtan uzak durmakta sabır ve imtihanlar geldiğinde O'nun kaderini kabullenmekte sabır.",
      "Sabır, pasif bir umutsuzluk ya da yalnız başına dişini sıkmak değildir — Kur'an onu bir yardım kaynağı olarak namazla birlikte anar; yani sabır aktiftir ve seni Allah'tan uzaklaştırmaz, O'na yöneltir.",
      "Allah kendisinin “sabredenlerle beraber” olduğunu bildirir ve sabredenlere mükâfatlarını hesapsız vereceğini vaat eder — bu, neredeyse başka hiçbir vasfa verilmeyen bir şereftir.",
      "Peygamberler insanların en ağır imtihan edilenleriydi ve Kur'an onların sebatını — hastalıkta Eyyub'u, kederde Yakub'u, ihanet ve zindan karşısında Yusuf'u — örnek alınacak model olarak sunar.",
    ],
    quran: [
      {
        excerpt:
          "Ey iman edenler! Sabır ve namazla yardım dileyin. Şüphesiz Allah sabredenlerle beraberdir.",
      },
    ],
    actions: [
      "Bugün öfke yükseldiğinde, tepki vermeden önce dur, nefes al ve “İnnâ lillâhi ve innâ ileyhi râciûn” de.",
      "Bu hafta bir zorluk anını şikâyete değil, iki rekât namaza dönüştür.",
    ],
  },
  {
    title: "Sadaka (Sadaka ve Zekât)",
    summary: "Malı arındırmak ve ihtiyaç sahiplerini doyurmak — gerçek imanın alameti.",
    lessons: [
      "Zekât — nisaba ulaşan maldan verilen yıllık arındırıcı sadaka — İslam'ın üçüncü şartı ve bir farzdır; sadaka ise üst sınırı olmayan ve sayısız şekli bulunan gönüllü bir bağıştır.",
      "Kur'an, Allah yolunda harcanan malın kaybolmadığını, aksine katlandığını vaat eder: tıpkı yedi başak bitiren ve her başakta yüz tane bulunan tek bir tohum gibi; Allah dilediğine daha da katlar.",
      "Sadaka sadece para değildir. Peygamber ﷺ, kardeşini güler yüzle karşılamanın bile sadaka olduğunu öğretmiştir; dolayısıyla hiç kimse veremeyecek kadar fakir değildir.",
      "Vermek hem malı hem de vereni arındırır, açgözlülüğün pençesini gevşetir ve merhameti geliştirir — zekât kelimesinin kendisinin arınma ve artış anlamına gelmesinin nedeni de budur.",
    ],
    quran: [
      {
        excerpt:
          "Mallarını Allah yolunda harcayanların durumu, yedi başak bitiren bir tanenin durumu gibidir…",
      },
    ],
    actions: [
      "Bugün bir şey ver — para, zamanın ya da gerçekten güzel bir söz — küçük ve görünmez olsa bile.",
      "Munib'de zekât yükümlülüklerini gözden geçir ve bir sonraki ödemenin ne zaman olduğunu not et.",
    ],
  },
  {
    title: "Tövbe",
    summary: "Allah tövbe edenleri sever — can boğaza gelinceye kadar kapı açıktır.",
    lessons: [
      "Samimi tövbenin açık şartları vardır: günahtan gerçekten pişmanlık duymak, ondan hemen vazgeçmek ve bir daha dönmemeye kesin olarak azmetmek — eğer günah başka bir insana zulüm içeriyorsa onun hakkını da iade etmek.",
      "Allah tövbeye yalnızca izin vermekle kalmaz — kendisine tekrar tekrar dönenleri sever; dolayısıyla bir sürçmeden sonra geri dönmek senin aleyhine bir leke değil, bizzat O'nun sevdiği bir şeydir.",
      "Rahmet kapısı şaşırtıcı derecede geniştir: Allah, kendilerine çokça zulmetmiş olanlara bile ümitsizliğe düşmemelerini söyler; çünkü samimiyetle tövbe edenin bütün günahlarını bağışlar.",
      "Tövbe yalnızca büyük günahlara veya dramatik anlara mahsus değildir — gün boyu istiğfar (bağışlanma dilemek) kalbi yumuşak, amel defterini temiz tutar.",
    ],
    quran: [
      {
        excerpt:
          "De ki: Ey kendi nefisleri aleyhine haddi aşan kullarım! Allah'ın rahmetinden ümidinizi kesmeyin…",
      },
    ],
    actions: [
      "Bugün anlamını düşünerek 100 kez “Estağfirullah” de ve yükün hafiflediğini hisset.",
      "Allah'ın hoşnut olmadığını bildiğin bir alışkanlığı belirle ve onu bırakmak için ilk somut adımı at.",
    ],
  },
  {
    title: "Cennet",
    summary:
      "Muttakiler için hazırlanan ebedî mükâfat — canlı ve teşvik edici ayrıntılarla anlatılır.",
    lessons: [
      "Kur'an cenneti canlı ve teşvik edici ayrıntılarla anlatır — altından ırmaklar akan bahçeler, sonsuz huzur ve salih kimselerle kavuşma — tam da müminin onu özlemesi ve onun için gayret etmesi için.",
      "Cennete girmek nihayetinde yalnızca amellerle değil, Allah'ın rahmetiyledir; iman ve samimi gayret vesiledir, ama O'nun lütfu olmadan hiç kimsenin ameli ebedî mükâfatı kazanamaz.",
      "Kur'an müminleri bağışlanmaya ve “genişliği göklerle yer kadar olan” bir cennete koşmaya ve yarışmaya teşvik eder — cennet pasif olarak umulacak değil, aktif olarak peşinden gidilecek bir hedeftir.",
      "En büyük mükâfat bahçeler veya ırmaklar değil, Allah'ın yüzünü görmektir — cennet ehline vaat edilen en yüce sevinç.",
    ],
    quran: [
      {
        excerpt:
          "Rabbinizden bir bağışlanmaya ve genişliği göklerle yer kadar olan bir cennete koşun…",
      },
    ],
    appLinks: [
      {
        label: "Cennete yolculuk",
      },
    ],
  },
  {
    title: "Cehennem",
    summary:
      "Gerçek bir uyarı — müminleri ümitsizliğe düşürmek için değil, uyanıklık kazandırmak için.",
    lessons: [
      "Cehennem bir mecaz değil, gerçek bir uyarıdır — Kur'an onu açıkça anlatır ki insanlar tehlikeyi ciddiye alsın ve henüz fırsat varken yön değiştirsin.",
      "Ateş korkusu, Allah'ın rahmetine duyulan ümitle birlikte işlemek içindir: Mümin havf (korku) ile reca (ümit) arasında yürür; böylece ne ümitsizlik ne de sahte bir güven duygusu ona hâkim olur.",
      "Kur'an'ın, kişi onun üzerine ölürse bağışlanmaz olarak belirttiği tek günah şirktir — Allah'a ortak koşmak; bundan aşağısını ise dilediği kimse için bağışlayabilir.",
      "Allah insanları ezmek için değil, kendisine geri döndürmek için uyarır; tövbe edeni ezmez — Kur'an'da her uyarı, geri dönüş için açık bir davetle birlikte gelir.",
    ],
    quran: [
      {
        excerpt:
          "Şüphesiz Allah kendisine ortak koşulmasını bağışlamaz; bundan başkasını ise dilediği kimse için bağışlar.",
      },
    ],
    actions: [
      "Bugün her namazdan sonra Allah'tan samimiyetle seni ateşten korumasını dile.",
      "Tevhidini yenile: Cehenneme karşı en sağlam koruma olan yalnızca Allah'a ibadet etmek üzerine tefekkür et.",
    ],
  },
  {
    title: "Adalet",
    summary: "Kendinizin veya yakınlarınızın aleyhine bile olsa adaleti ayakta tutun.",
    lessons: [
      "Kur'an'da adalet tavizsizdir: Hak senin, anne babanın veya en yakın akrabalarının aleyhine olsa bile adaletten yana sağlam dur.",
      "Allah, bir topluluğa duyulan nefretin seni asla adaletsizliğe sürüklememesini emreder — “Adaletli olun; bu takvaya daha yakındır” — yani adalet düşmanlara bile borçludur.",
      "Zulüm şiddetle yasaklanmıştır; Peygamber ﷺ zulmün kıyamet gününde zalimin üzerinde karanlıklar olarak görüneceğini öğretmiştir.",
      "Adalet yalnızca hâkimler ve yöneticiler için değildir — dürüst sözde, adil alışverişte, sözünü tutmakta ve herkese hakkını vermekte yaşar.",
    ],
    quran: [
      {
        excerpt:
          "Kendinizin, anne babanızın ve akrabalarınızın aleyhine de olsa Allah için şahitler olarak adaleti ayakta tutun.",
      },
    ],
    actions: [
      "Bugün birine hakkını ver — adil bir ücret, dürüst bir cevap ya da ona borçlu olduğun bir takdir.",
      "Önyargının seni haksızlığa ittiği bir anı yakala ve onun yerine adaleti seç.",
    ],
  },
  {
    title: "İlim",
    summary: "Oku, düşün ve “Rabbim, ilmimi artır” de.",
    lessons: [
      "Kur'an'dan indirilen ilk kelime “Oku” idi — İslam bir ritüelle değil, öğrenme emriyle başladı; hem aklın okuryazarlığını hem de kalbin ilmini onurlandırdı.",
      "Allah, Peygamber'ine ﷺ bile daha fazlasını istemeye devam etmesini söyledi: “Rabbim, ilmimi artır” — Kur'an'ın ona artırılmasını istemesini emrettiği tek şey budur.",
      "Faydalı ilim uygulanmak ve aktarılmak içindir; Peygamber ﷺ âlimlerin peygamberlerin varisleri olduğunu, onlardan mal değil ilim miras aldıklarını öğretmiştir.",
      "Dinî ilim talep etmek başlı başına bir ibadettir ve Kur'an bilenlerle bilmeyenleri açıkça birbirinden ayırır — “hiç bir olurlar mı?”",
    ],
    quran: [
      {
        excerpt: "Ve de ki: Rabbim, ilmimi artır.",
      },
    ],
    actions: [
      "Bugün Kur'an'dan yeni bir şey öğren — bir ayet, bir kelime veya bir hüküm — ve onu birine öğret.",
      "“Rabbi zidnî ilmâ” duasını ezberle ve çalışmaya başlamadan önce oku.",
    ],
  },
  {
    title: "Peygamberler",
    summary: "Hidayet, imtihan ve ilahi yardım kıssaları — eğlence değil, öğüt.",
    lessons: [
      "Kur'an hiçbir milletin hidayetsiz bırakılmadığını öğretir: “İçinden bir uyarıcı gelip geçmemiş hiçbir ümmet yoktur” — aynı tevhid mesajı her yere gönderilmiştir.",
      "Bütün peygamberler tek bir temel çağrı getirdi — yalnızca Allah'a ibadet edin — ve onların kıssaları tarih olsun diye değil, “akıl sahipleri” için öğüt olarak anlatılır.",
      "Muhammed ﷺ peygamberlerin sonuncusu (Hâtemü'n-Nebiyyîn), son elçidir; bir Müslüman ondan önceki bütün peygamberlere — Nuh, İbrahim, Musa, İsa ve diğerlerine — aralarında ayrım yapmadan iman etmelidir.",
      "Peygamberler ilah değil, insan ve Allah'ın kullarıydı; Kur'an onları onurlandırır ama onları kesin olarak yaratılmışlar tarafında tutar, asla Yaratıcı ile birlikte ibadet edilmezler.",
    ],
    quran: [
      {
        excerpt: "Onların kıssalarında akıl sahipleri için bir ibret vardır…",
      },
    ],
    appLinks: [
      {
        label: "Peygamber kıssaları",
      },
    ],
  },
  {
    title: "Kadınlar",
    summary: "Haklar, onur ve manevi eşitlik — Meryem kadınların en hayırlılarındandır.",
    lessons: [
      "Kur'an, Allah katında kadın ve erkeğin manevi eşitliğini öğretir: Aynı iman, aynı ameller ve aynı mükâfat “mümin erkeklere ve mümin kadınlara” eşit olarak vaat edilmiştir.",
      "Kadınlar ve erkekler mülk olarak değil, imanda birbirlerinin yardımcıları ve koruyucuları olarak anlatılır — dördüncü sure olan Nisa (“Kadınlar”), büyük ölçüde onların haklarını, onurlarını, miraslarını ve onlara nasıl davranılacağını güvence altına almaya ayrılmıştır.",
      "Kur'an, İsa'nın annesi Meryem'i bütün müminler için bir örnek olarak sunar ve anneleri o kadar yüceltir ki, bilinen bir öğreti cenneti onların ayaklarının altına yerleştirir.",
      "Her iki cins de tek bir kökene dayanır — “sizi tek bir nefisten yarattı” — ve bu, Nisa Suresi'nin ilk ayetinden itibaren ortak bir insanlık ve onur temeli kurar.",
    ],
    quran: [
      {
        excerpt: "Sizi tek bir nefisten yaratan ve ondan da eşini yaratan Rabbinizden sakının…",
      },
    ],
    actions: [
      "Bugün hayatındaki bir kadını — annen, eşin, kız kardeşin veya kızın — ona borçlu olduğun belirli bir hak veya iyilikle onurlandır.",
    ],
  },
  {
    title: "Çocuklar",
    summary: "Bir emanet — tevhid ve şefkat üzere yetiştirilmeli.",
    lessons: [
      "Çocuklar bir emanettir — Allah'tan bir emanet — ve Kur'an anne babayı onların terbiyesinden sorumlu tutar: “Kendinizi ve ailenizi bir ateşten koruyun” emri, onlara tevhidi ve güzel ahlakı öğretmekle başlar.",
      "Peygamber ﷺ Kur'an'ı öğrenmeyi ve öğretmeyi amellerin en hayırlıları arasında saymıştır; bu yüzden bir çocuğu ondan azıcık da olsa okumaya yönlendirmek, sevabı anne babaya dönmeye devam eden kalıcı bir hayır eker.",
      "Yaygın olarak aktarılan bir terbiye hikmeti, çocuklara içinde bulundukları evreye göre davranmayı öğütler — ilk yıllarda onlarla oynamak, ardından onlara öğretmek ve onları yumuşaklıkla terbiye etmek, büyüdüklerinde ise onlarla dost olmak.",
      "Salih bir çocuk yetiştirmek bu hayatın ötesine uzanan bir yatırımdır: Anne babası için dua eden salih bir evlat, ölümlerinden çok sonra da onlara fayda sağlamaya devam eder.",
    ],
    quran: [
      {
        excerpt: "Ey iman edenler! Kendinizi ve ailenizi bir ateşten koruyun…",
      },
    ],
    actions: [
      "Bugün bir çocuğa kısa bir ayet veya tek bir güzel davranış öğret; sabırla ve cesaretlendirerek.",
      "Çocukların (veya bakımındaki çocuklar) için, dürüst ve Allah'ın sevdiği kimseler olmaları için isimlerini anarak dua et.",
    ],
  },
];

export const QURAN_GUIDE_TAJWEED_TR: DeepPartial<QuranGuideTajweedLesson>[] = [
  {
    title: "Sâkin Nun ve Tenvin",
    summary: "Sükûnlu ن ve tenvinin hükümleri — izhâr, idğam, iklâb, ihfâ.",
    explanation: [
      "Sâkin nun, üzerinde cezm (sükûn) bulunan, yani harekesiz ن harfidir; tenvin ise kelime sonunda nun gibi duyulan çift harekedir (an, in, un). İkisi de aynı dört hükme tabidir ve hangisinin uygulanacağını tamamen kendilerinden sonra gelen harf belirler.",
      "İzhâr (açık okuma): Altı boğaz harfinden (ء ه ع ح غ خ) biri geldiğinde nun, genizden ses karıştırılmadan açık ve net okunur.",
      "İdğam (katma): “Yermelûn” (ي ر م ل و ن) kelimesindeki harflerden önce nun, sonraki harfe katılır — ي ن م و harflerinde gunneli, ل ر harflerinde ise gunnesiz olarak.",
      "İklâb (çevirme): ب harfi geldiğinde nun, gunne eşliğinde gizli bir mim sesine çevrilir.",
      "İhfâ (gizleme): Geriye kalan on beş harften önce nun ne tam açık okunur ne de tamamen katılır; dil sonraki harfe hazırlanırken hafif bir gunneyle “gizlenir”.",
    ],
    practice:
      "Fâtiha sûresini yavaşça okuyun; her sâkin nun veya tenvinle karşılaştığınızda durup dört hükümden hangisinin uygulandığını ve nedenini söyleyin.",
  },
  {
    title: "Sâkin Mim",
    summary: "Sükûnlu م için ihfâ-i şefevî, idğam-ı şefevî ve izhâr-ı şefevî.",
    explanation: [
      "Sâkin mim, üzerinde cezm bulunan م harfidir. Tam olarak üç hükmü vardır; mim dudaklarla çıkarıldığı için her biri “şefevî” (dudakla ilgili) diye adlandırılır ve hangisinin uygulanacağı yalnızca sonraki harfe bağlıdır.",
      "İdğam-ı şefevî (dudak idğamı): Sâkin mimden sonra başka bir mim gelirse ikisi birleşerek gunneyle tutulan tek, şeddeli bir mim olur.",
      "İhfâ-i şefevî (dudak ihfâsı): ب harfi geldiğinde mim hafifçe gizlenir — dudaklar birbirine yaklaşır ama tam kapanmaz — ve buna gunne eşlik eder.",
      "İzhâr-ı şefevî (dudak izhârı): Diğer bütün harflerden önce mim açıkça okunur. Öğrencilerin onu en çok bulanıklaştırmaya meylettiği و ve ف harflerinden önce özellikle dikkatli olun.",
    ],
    practice:
      "Amme cüzünden birkaç kısa sûre okuyun ve her sâkin mimi işaretleyin; kelimeyi okumadan önce hükmünü söyleyin.",
  },
  {
    title: "Med (Uzatma)",
    summary: "Harekelerin tabiî, fer'î ve gerekli uzatılması.",
    explanation: [
      "Med, bir ünlü sesi uzatmak demektir ve üç med harfinde — elif (ا), vav (و) ve ye (ي) — bu harfler kendileri harekesiz olup kendilerine uygun kısa harekeden sonra geldiğinde gerçekleşir.",
      "Med-di aslî (med-di tabiî), yaklaşık iki hareke süren temel uzatmadır; ardında özel bir sebep bulunmadan med harfinin geçtiği her yerde vardır. Her kâri onu eşit ölçüde uzatır.",
      "Med-di fer'î, ardından gelen bir hemze veya sükûn sebebiyle oluşur ve daha uzun tutulur — genellikle dört veya altı hareke. Tam uzunluk, meddin türüne ve takip ettiğiniz rivayete bağlıdır.",
      "Kelime sonunda durmak bir sükûn oluşturabileceği için meddi de uzatabilir — süreleri tahminle değil, ehil bir hocadan dinleyerek öğrenmek için bir sebep daha.",
    ],
    practice:
      "Bildiğiniz kısa bir sûre seçin; her tabiî medde hafifçe “1-2”, her fer'î medde “1-2-3-4” diye sayın ve temponuzu eşit tutun.",
  },
  {
    title: "Gunne",
    summary: "İdğam ve ihfâda nun ile mime eşlik eden genizden gelen ses.",
    explanation: [
      "Gunne, burundan çıkan bir geniz sesidir ve nun (ن) ile mim (م) harflerinin doğal bir sıfatıdır. Standart okuyuşta yaklaşık iki hareke tutulur.",
      "Daha önce gördüğünüz birkaç hükümde gereklidir ve en belirgin hâlini alır: gunneli idğam, ihfâ, iklâb ve nun ya da mim şeddeli olduğunda.",
      "Ses yumuşak ve kontrollü olmalıdır — bu, şarkı söylemek ya da bir ezgi mırıldanmak değil, doğru uzunlukta ölçülmüş sabit bir geniz sesidir.",
      "Basit bir deneme: Gunneli bir harfi söylerken burnunuzu hafifçe sıkın; ses kesiliyorsa, gunne olması gerektiği gibi gerçekten burundan geliyor demektir.",
    ],
    practice:
      "Nun veya mimi şeddeli bir kelime okuyun, gunneyi sabit iki hareke boyunca tutun; sonra kendinizi kaydedip ehil bir kâriyle karşılaştırın.",
  },
  {
    title: "Kalkale",
    summary:
      "ق ط ب ج د harfleri sâkin olduğunda veya üzerlerinde durulduğunda yapılan yankılı sekme.",
    explanation: [
      "Kalkale, “kutbu cedin” (قُطْبُ جَدٍ) ifadesinde toplanan beş harfe — ق ط ب ج د — sâkin olduklarında verilen hafif, yankılı bir “sekme”dir.",
      "Bu sekme, harfin mahrecinde hafif bir titreşimdir; harften sonra tam bir hareke eklememeli, yalnızca onun temiz biçimde “geri sekmesine” izin vermelisiniz.",
      "Harf kelimenin ortasında sâkin olduğunda daha hafiftir (kalkale-i suğrâ); kelime sonunda o harf üzerinde durduğunuzda ise daha güçlü ve belirgindir (kalkale-i kübrâ).",
      "Sekmeyi nötr tutun — onu “a”, “i” veya “u” sesine kaydırmayın; çevresindeki harekeler ne olursa olsun aynı net yankıdır.",
    ],
    practice:
      "İhlâs sûresini okuyun ve her kalkale harfinde — “ehad” ve “yûled” kelimelerindeki د harfinde — net sekmeyi hissederek sağlamca durun.",
  },
  {
    title: "Vakf (Durma)",
    summary: "Nerede durulur, nefes alınır ve durmak telaffuzu nasıl değiştirir.",
    explanation: [
      "Vakf, nerede ve nasıl duraklanacağını bilme sanatıdır. Mushaf, okuyana yol göstermek için durak yerlerini küçük işaretlerle gösterir — örneğin durmanın gerekli olduğu yer için م, durmanın caiz olduğu yerler için ط ve ج, “burada durma” anlamında da لا.",
      "Durmak genellikle son harekeyi düşürür ve son harfi sâkin yapar. Bu değişiklik kalkale veya uzatılmış bir med gibi başka hükümleri doğurabilir; bu yüzden bir kelime, üzerinde durduğunuzda devam ettiğiniz zamankinden farklı okunabilir.",
      "Nerede durduğunuz anlamı etkileyebilir; bu nedenle cümlenin ortasında anlamı bozacak şekilde asla kesmeyin. Özel bir durum, üç noktayla işaretlenen muânaka (kucaklaşma) vakfıdır: iki yerden birinde durabilirsiniz, ama ikisinde birden değil.",
      "Doğru durakları öğrenmenin en güvenli yolu, vakf işaretlerini gösteren bir mushafı ehil bir kâriyle birlikte kullanmaktır; böylece duraklarınız nakledilen kıraate uygun olur.",
    ],
    practice:
      "Vakf işaretli bir sayfa alın ve bir tecvid hocasının kaydını takip ederek sesli okuyun; tam olarak işaretlerin gösterdiği yerlerde durun.",
  },
  {
    title: "Vasl Hemzesi",
    summary:
      "Yalnızca okumaya başlarken söylenen, önceki kelimeye bağlanırken düşen bağlantı hemzesi.",
    explanation: [
      "Vasl hemzesi (ٱ), elifin üzerinde küçük, sad başına benzeyen bir işaretle yazılan bağlantı hemzesidir. Birçok isim, fiil ve edatın başında — belirlilik takısı ال dahil — bulunur.",
      "Vasl hemzesiyle başlayan bir kelimeden okumaya başladığınızda, kelimenin düzgün açılabilmesi için onu net bir hemze sesiyle okursunuz.",
      "Kelime kendinden öncekine bağlandığında vasl hemzesi okunmaz — önceki harften doğrudan sonraki harfe geçersiniz ve ayrı bir hemze sesi çıkarmazsınız.",
      "Vasl hemzesini tanımak, cümlenin ortasına fazladan bir gırtlak duraksaması eklemekten kaçınmanıza yardımcı olur; bu, mushafı yavaş okurken yeni başlayanlarda sık görülen bir alışkanlıktır.",
    ],
    practice:
      "Besmeleyi ve Fâtiha sûresini okuyun; her ٱ işaretinde durup okumaya başlıyor musunuz (okunur) yoksa bağlıyor musunuz (düşer), karar verin.",
  },
  {
    title: "Şemsî Lam",
    summary: "ال takısının lamını kendine katan şemsî harfler ve onu açık bırakan kamerî harfler.",
    explanation: [
      "Belirlilik takısı ال bir isme eklendiğinde, لام sonraki harfe göre ya açık okunur ya da o harfe katılır.",
      "Şemsî harfler (hurûf-ı şemsiyye), لام harfinin okunmamasına ve sonraki harfin şeddeyle iki kat okunmasına yol açar — ٱلرَّحْمَٰن kelimesinde ر harfinin لام harfini kendine katması gibi.",
      "Kamerî harfler (hurûf-ı kameriyye) لام harfini açık bırakır — ٱلْقَمَر kelimesinde olduğu gibi; böylece hem لام hem de sonraki harf duyulur.",
      "Şemsî ve kamerî harf gruplarını ezberlemek (veya bir hocadan dinleyerek öğrenmek), okunmayan lamı fazladan okumayı ve açık lamı eksik okumayı önler.",
    ],
    practice:
      "Amme cüzünü açın ve ال takılı on isim işaretleyin: her biri için okumadan önce lamın şemsî (okunmaz) mi yoksa kamerî (açık) mi olduğunu söyleyin.",
  },
  {
    title: "Okunmayan Harfler",
    summary: "Mushafta yazılı olduğu hâlde kesintisiz okumada telaffuz edilmeyen harfler.",
    explanation: [
      "Bazı harfler tarihî veya imlâ sebepleriyle Osmânî hatta yer alır, ancak okunurken seslendirilmez — tecvid renklendirmelerinde okunmaz olarak işaretlenir.",
      "Sık görülen durumlar arasında yazılıp uzatılmayan bazı elifler ve sonraki şeddeli harfe katıldığı için ayrı bir ses bırakmayan harfler bulunur.",
      "Okunmazlık işareti bir okuma yardımcısıdır: Yazılı mushafı aslına sadık tutarken dilin fazladan bir ses uydurmamasına rehberlik eder.",
      "Şüphe ettiğinizde renkli tecvidli bir mushafı veya ehil bir kâriyi takip edin — amaç, yalnızca imlâya bakarak tahmin etmek değil, nakledilen okuyuşa sadık kalmaktır.",
    ],
    practice:
      "Tecvid renkleri açıkken bir sayfayı yavaşça okuyun ve yalnızca renkli (okunan) harfleri fısıldayın — okunmaz olarak işaretlenen her harfi bilerek atlayın.",
  },
];

export const QURAN_GUIDE_VOCABULARY_TR: DeepPartial<QuranGuideVocabEntry>[] = [
  {
    meaning: "Tek gerçek ilah — bütün güzel isimleri kapsayan özel isim.",
    frequency: "2.700'den fazla geçer",
    example: "Bismillah — Allah'ın adıyla",
    quranRef: {
      excerpt: "Rahmân ve Rahîm olan Allah'ın adıyla.",
    },
  },
  {
    meaning:
      "Rab, Efendi, Terbiye edip besleyen — yaratan, sahip olan, besleyip büyüten ve yöneten.",
    frequency: "Çok sık",
    example: "Rabbenâ — Rabbimiz",
    quranRef: {
      excerpt: "Hamd, âlemlerin Rabbi Allah'a mahsustur.",
    },
  },
  {
    meaning: "Allah'tan gelen ve yaratılmışlar arasındaki rahmet, merhamet ve şefkat.",
    frequency: "Yaygın kök: ر-ح-م",
    example: "er-Rahmân, er-Rahîm",
    quranRef: {
      excerpt: "O, Rahmân'dır, Rahîm'dir.",
    },
  },
  {
    meaning: "Bahçe, Cennet — mükâfatın ebedî yurdu.",
    frequency: "Sık",
    example: "Altından ırmaklar akan cennetler",
  },
  {
    meaning: "Ateş — bir uyarı ve sonuç olarak Cehennem'i ifade eder.",
    frequency: "Sık",
    example: "Kâfirler için hazırlanmış ateşten sakının",
  },
  {
    meaning: "İman, inanç; Allah'a güven ve O'nun mesajını kabul etmek.",
    frequency: "Çok sık",
    example: "Ey iman edenler (yâ eyyühellezîne âmenû)",
  },
  {
    meaning: "Allah rızası için sabır, sebat ve dayanıklılık.",
    frequency: "Sık",
    example: "Şüphesiz Allah sabredenlerle beraberdir",
  },
  {
    meaning: "Şükür — nimetleri kalple, dille ve azalarla tanıyıp karşılığını vermek.",
    frequency: "Sık",
    example: "Şükrederseniz elbette size (nimetimi) artıracağım",
  },
  {
    meaning: "Takva — Allah bilinci, Allah korkusuyla kendini günahtan korumak.",
    frequency: "Çok sık",
    example: "Allah katında en değerliniz, takvâca en ileri olanınızdır",
  },
  {
    meaning: "Rızık, geçim — Allah'ın her can için takdir ettiği.",
    frequency: "Sık",
    example: "Allah rızık verenlerin en hayırlısıdır",
  },
  {
    meaning: "Nur — hidayet, vahiy ve kalbin aydınlanması.",
    frequency: "Sık",
    example: "Allah göklerin ve yerin nurudur",
    quranRef: {
      excerpt: "Allah, göklerin ve yerin nurudur…",
    },
  },
  {
    meaning:
      "Bu dünya hayatı — kelime anlamıyla “daha aşağı/daha yakın” hayat. Kur'an'da geçici ve bir imtihandır; kalıcı olan ahiretle karşılaştırılır ve asla müminin gerçek yurdu değildir.",
    frequency: "Sık",
    example: "Dünya hayatı (el-hayâtü'd-dünyâ) ancak bir oyun ve eğlencedir",
  },
  {
    meaning:
      "Ahiret — ölümden sonraki ebedî hayat; diriliş, hesap, Cennet ve Cehennem dahil. Kur'an'ın müminleri uğrunda çalışmaya teşvik ettiği gerçek ve kalıcı hayattır.",
    frequency: "Sık",
    example: "Ahiret (el-âhire) ise daha hayırlı ve daha kalıcıdır",
  },
  {
    meaning:
      "Namaz — İslâm'ın ikinci şartı; günde beş vakit kılınır. Kelime, Allah'a bağlanma ve O'na dua etme anlamını da taşır.",
    frequency: "Çok sık",
    example: "Beni anmak için namaz kıl (ekımi's-salâte)",
  },
  {
    meaning:
      "Kitap veya ilahî yazı — çoğunlukla Kur'an'ın kendisi (“o Kitap”), ama aynı zamanda önceki indirilmiş kitaplar ve amel defteri. Yazmak anlamındaki k-t-b kökünden gelir.",
    frequency: "Çok sık",
    example: "Bu, kendisinde hiç şüphe olmayan Kitap'tır (zâlike'l-kitâb)",
  },
];

export const QURAN_GUIDE_LETTERS_TR: DeepPartial<QuranGuideLetter>[] = [
  {
    name: "Elif",
    pronunciation: "Uzun /a/ — “âlem” kelimesindeki â gibi (hemze veya med taşıdığında)",
  },
  {
    name: "Be",
    pronunciation: "Türkçedeki “b” gibi",
  },
  {
    name: "Te",
    pronunciation: "Türkçedeki “t” gibi",
  },
  {
    name: "Se",
    pronunciation:
      "İngilizce “think” kelimesindeki “th” gibi — dil ucu dişler arasında, peltek bir s",
  },
  {
    name: "Cîm",
    pronunciation: "“cam” kelimesindeki “c” gibi",
  },
  {
    name: "Hâ",
    pronunciation: "Boğazdan çıkan keskin, nefesli h — Türkçedeki düz “h” değil",
  },
  {
    name: "Hı",
    pronunciation: "İskoçça “loch” kelimesindeki ses gibi — boğazda sürtünme",
  },
  {
    name: "Dal",
    pronunciation: "Türkçedeki “d” gibi",
  },
  {
    name: "Zel",
    pronunciation:
      "İngilizce “this” kelimesindeki “th” gibi — dil ucu dişler arasında, peltek bir z",
  },
  {
    name: "Ra",
    pronunciation: "Titrek, yuvarlanan “r”",
  },
  {
    name: "Ze",
    pronunciation: "Türkçedeki “z” gibi",
  },
  {
    name: "Sîn",
    pronunciation: "Türkçedeki “s” gibi",
  },
  {
    name: "Şın",
    pronunciation: "“şeker” kelimesindeki “ş” gibi",
  },
  {
    name: "Sad",
    pronunciation: "Kalın (tefhimli) “s” — dil kalkık, daha dolgun bir ses",
  },
  {
    name: "Dad",
    pronunciation: "Kalın “d” — Arapçaya özgü",
  },
  {
    name: "Tı",
    pronunciation: "Kalın “t” — ağzın daha derininden",
  },
  {
    name: "Zı",
    pronunciation: "Peltek “z” (th) sesinin kalın hâli",
  },
  {
    name: "Ayn",
    pronunciation:
      "Boğazın ortasından gelen sesli bir daralma — Türkçede karşılığı yoktur; bir kâriyi taklit ederek öğrenin",
  },
  {
    name: "Gayn",
    pronunciation: "Fransızca “r” gibi ya da gargara yapar gibi “ğ”",
  },
  {
    name: "Fe",
    pronunciation: "Türkçedeki “f” gibi",
  },
  {
    name: "Kaf",
    pronunciation: "Dilin en arka kısmından çıkan derin “k” — Türkçedeki ince “k” değil",
  },
  {
    name: "Kef",
    pronunciation: "Türkçedeki ince “k” gibi (ağzın ön tarafında)",
  },
  {
    name: "Lam",
    pronunciation: "Türkçedeki “l” gibi",
  },
  {
    name: "Mim",
    pronunciation: "Türkçedeki “m” gibi",
  },
  {
    name: "Nun",
    pronunciation: "Türkçedeki “n” gibi",
  },
  {
    name: "He (hafif)",
    pronunciation: "Kelime sonlarında yumuşak “h”",
  },
  {
    name: "Vav",
    pronunciation: "İngilizce “w” veya uzun “u” gibi",
  },
  {
    name: "Ye",
    pronunciation: "“y” veya uzun “i” gibi",
  },
];

export const QURAN_GUIDE_PRONUNCIATION_TR: DeepPartial<QuranGuidePronunciationPair>[] = [
  {
    title: "Ayn ile Hâ",
    tip: "İkisi de boğazdan çıkar ama seslilik bakımından ayrılır. Ayn (ع), boğazın ortasından gelen sesli bir daralmadır — ses telleri titrer. Hâ (ح) ise güçlü, sessiz ve nefesli bir sürtünmedir; titreşimsiz, derin bir iç çekiş gibi. İkisi de Türkçede yoktur; bu yüzden onları bir kâriden dinleyerek öğrenin.",
  },
  {
    title: "Hâ ile Hı",
    tip: "Hâ daha keskin ve hafiftir; Hı daha derin ve daha sürtünmelidir — “loch” kelimesindeki gibi.",
  },
  {
    title: "Sîn ile Sad",
    tip: "Sîn (س), Türkçedeki “sen” kelimesinde olduğu gibi hafif, ince bir “s”dir. Sad (ص) ise onun kalın, tefhimli ikizidir: dilin arkasını kaldırın, ağzınızı hafifçe yuvarlayın; ses derinleşir. İkisini karıştırmak kelimeleri değiştirebilir — sabr (sabır) ile ince s ile yapılan bir okuyuş aynı değildir.",
  },
  {
    title: "Dal ile Dad",
    tip: "Dal (د) düz bir “d”dir. Dad (ض) ise Arapçaya özgü kalın, tefhimli bir “d”dir — dilin kenarını üst azı dişlerine bastırın ve sesin ağzı doldurmasına izin verin. Arapçaya bu ayırt edici harf sebebiyle “Dad dili” (lügatü'd-dâd) bile denir.",
  },
  {
    title: "Te ile Tı",
    tip: "Kalın ط daha derindir; onu düz bir “t” ile değiştirmeyin.",
  },
  {
    title: "Zel ile Zı",
    tip: "İkisi de peltek “th” sesi içerir; ظ daha kalın ve tefhimlidir.",
  },
  {
    tip: "Kef (ك), İngilizce “key” kelimesindeki gibi ağzın önünden çıkan bir “k”dir. Kaf (ق) çok daha arkadan çıkar — dilin en arka kısmı küçük dile değer ve Türkçede tam karşılığı olmayan derin, gırtlaksı bir “k” verir. İkisini ayrı tutun: kalb (kalp), kelb (köpek) değildir.",
    title: "Kef ile Kaf",
  },
  {
    title: "Gayn ile Hı",
    tip: "Gayn seslidir; Hı ise titreşimsiz (sessiz) bir sürtünmedir.",
  },
];

export const QURAN_GUIDE_MEMORIZATION_PLANS_TR: DeepPartial<QuranGuideMemorizationPlan>[] = [
  {
    title: "Başlangıç — Amme Cüzü",
    summary:
      "Herkes için doğal başlangıç noktası. Mushafın sonundaki çok kısa sûrelerle — Nâs sûresinden geriye doğru — başlayın; bunlar kolaydır, çabuk meyvesini verir ve her namazda işe yarar.",
    surahs: ["Nâs", "Felak", "İhlâs", "Tebbet", "Nasr", "Kâfirûn", "Kevser"],
    tip: "Günde yalnızca bir âyet ezberleyin: Bir kârinin onu tertil ile yaklaşık on kez tekrar edişini dinleyin, akıcı hâle gelene kadar sesli tekrarlayın, sonra devam etmeden önce onu zaten ezberinizde olanlara ekleyin.",
  },
  {
    title: "Orta Seviye — On temel sûre",
    summary:
      "Kısa sûreler sağlamlaştıktan sonra, büyük fazileti olan ve sıklıkla cuma günleri ve geceleri okunan sevilen uzun sûrelere geçin — Mülk, Yâsîn, Rahmân, Vâkıa ve Kehf bunlar arasındadır.",
    surahs: ["Fâtiha", "Mülk", "Yâsîn", "Rahmân", "Vâkıa", "Kehf", "Cuma", "Haşr"],
    tip: "Yeni ezberi her gün sabit bir vakte bağlayın — sabah namazından hemen sonraki sakin ve zihnin berrak olduğu vakit idealdir — böylece yükün büyük kısmını süreklilik taşır.",
  },
  {
    title: "İleri Seviye — Bir cüz",
    summary:
      "Öncesindeki her şeyi sapasağlam tutarken tam bir cüzü bitirmeyi hedefleyin. Birçok kişi, sûrelerini kısmen zaten bildiği 29. veya 30. cüzle başlar, sonra her seferinde bir cüz olmak üzere genişletir.",
    surahs: ["Bir cüz seçin — birçok kişi 29. veya 30. cüzle başlar, sonra genişletir"],
    tip: "Eskisi sağlamca tekrar edilmeden asla yeni bir bölüm eklemeyin. Peygamber ﷺ, ezberlenen Kur'an'ın, bağlı bir devenin bağından kurtulmasından daha hızlı kaçıp gittiği konusunda uyarmıştır.",
  },
  {
    title: "Hâfızlık Yolculuğu",
    summary:
      "Kur'an'ın tamamını ezberlemek — onu taşıyanı ve Allah'ın lütfuyla anne babasını yücelten, ömür boyu süren bir şereftir. Ciddi bir taahhüttür; genellikle her gün yeni ezber ve disiplinli tekrarla birkaç yıla yayılır.",
    surahs: ["Mushafın tamamı — genellikle günlük tekrarla 3–7 yıl"],
    tip: "Bunu tek başınıza denemeyin: Tekrar programınızı yönetmek için Munib'in hıfz takipçisini kullanın ve hatalarınızı yakalayıp düzeltebilecek ehil bir hâfıza veya hocaya düzenli olarak okuyun.",
  },
];

export const QURAN_GUIDE_DAILY_LESSONS_TR: DeepPartial<QuranGuideDailyLesson>[] = [
  {
    translation:
      "Ey iman edenler! Sabrederek ve namaz kılarak (Allah'tan) yardım dileyin. Şüphesiz Allah sabredenlerle beraberdir.",
    context:
      "Medine'de inen Bakara sûresinden. Allah, sıkıntıyla karşılaşan mümin için iki güç kaynağını bir araya getirir — sabırla direnmek ve namaza yönelmek — ve sebat edenlere özel beraberliğini vaat eder.",
    reflection:
      "Şu anda hangi imtihanla karşı karşıyayım ki bu âyetin gösterdiği sabır ve namaz yerine hızlı bir kaçış yolu arıyorum?",
    action:
      "Bugün bir vakit namazı acele etmeden kılın ve secdenizde, içinden geçtiğiniz belirli imtihan için Allah'tan açıkça sabır dileyin.",
  },
  {
    translation: "Rahmetim her şeyi kuşatmıştır.",
    context:
      "A'râf sûresinden; Mûsâ (a.s.) ve kavmi bağlamında söylenmiştir. Allah rahmetini her şeyi kuşatan bir rahmet olarak anlatır — o kadar geniştir ki, yalnızca haksızlıkta ısrar edenlere ayrılmış olan azabından önce gelir ve ona galip gelir.",
    reflection:
      "Ben kendim tamamen Allah'ın sınırsız rahmetine muhtaçken, kimin hatasını affetmeyi reddediyorum?",
    action:
      "Kırgın olduğunuz bir kişiyi seçin, bugün onu kalbinizde içtenlikle affedin ve Allah'ın ona da hidayet vermesi ve onu bağışlaması için kısa bir dua edin.",
  },
  {
    translation: "Eğer şükrederseniz, elbette size (nimetimi) artıracağım.",
    context:
      "İbrâhîm sûresinden; Mûsâ'nın İsrâiloğulları'na yaptığı hatırlatmanın bir parçası. Allah, nimetini artırmayı doğrudan şükre bağlar — bir nimete şükretmek onu çoğaltan şeyin ta kendisidir, nankörlük ise onun kaybını davet eder.",
    reflection:
      "Allah'ın hangi nimetlerine — sağlığıma, aileme, imanıma veya rızkıma — bu hafta sıradan ve bana borçlu bir şeymiş gibi davranmaya başladım?",
    action:
      "Bu gece uyumadan önce belirli üç nimet için sesli olarak “Elhamdülillah” deyin; her birini adıyla anın ki şükrünüz otomatik değil, bilinçli olsun.",
  },
  {
    translation: "İnsanlara güzel söz söyleyin.",
    context:
      "İsrâ sûresinden. Müminlerin nasıl davranması gerektiğine dair yönlendirmeler arasında Allah, insanlara — bütün insanlara — en güzel şekilde konuşmamızı emreder; çünkü sert sözler, şeytanın ayrılık tohumu ektiği kapılardan biridir.",
    reflection:
      "Bugüne dönüp baktığımda, sözlerim insanları daha çok yüreklendirdi mi yoksa yıprattı mı — ve zor bulduğum kişilere bile “güzel söz” söyledim mi?",
    action:
      "Bugün bir kişiyi, içinde gizli bir eleştiri olmadan içtenlikle teşvik edin veya ona teşekkür edin; söylemeye niyetlendiğiniz sert bir sözü de tutun.",
  },
  {
    translation: "Kim Allah'a tevekkül ederse, O ona yeter.",
    context:
      "Talâk sûresinden; boşanma ve geçim hükümleri arasında — insanların maddi açıdan en çok kaygılandığı yerde. Allah orada, kendisinden sakınana hiç ummadığı yerden rızık vereceğini, kendisine tevekkül edenin de O'nu yeterli bulacağını vaat eder.",
    reflection:
      "Nerede dikkatli planlar yapıp Allah'ı onların dışında bırakıyorum — ya da hiç O'na dua ile yönelmeden insanların yardımına mı dayanıyorum?",
    action:
      "Sizi kaygılandıran bir kararı ele alın, onun için iki rekât istihare namazı kılın veya içten bir dua edin, sonra sonucu Allah'a bırakın.",
  },
  {
    translation: "Rabbim, ilmimi artır.",
    context:
      "Tâhâ sûresinden. Bu, Kur'an'da Allah'ın Peygamber'e ﷺ daha fazlasını istemesini emrettiği tek şeydir — ilim. Bu da faydalı ilmin ne kadar değerli olduğunu ve ne kadar âlim olursa olsun hiç kimsenin onu aramayı bitirmediğini gösterir.",
    reflection:
      "Bugün boş vaktimin ne kadarı bitmek bilmeyen ekran kaydırmaya gitti ve bunun küçük bir kısmı bile bir âyet veya bir hadis öğrenmeye ayrılabilir miydi?",
    action:
      "Bu kısa duayı, “Rabbi zidnî ilmâ”yı ezberleyin ve güne başlamadan önce sabah namazından sonra onu söylemeyi alışkanlık hâline getirin.",
  },
  {
    translation:
      "Mallarını Allah yolunda harcayanların durumu, yedi başak bitiren bir tanenin durumu gibidir…",
    context:
      "Bakara sûresinden. Allah, sadakanın nasıl büyüdüğüne dair canlı bir tablo çizer: Tek bir tohum yedi başak verir, her başakta yüz tane vardır — yedi yüz katlık bir karşılık; Allah dilediğine daha da kat kat verir. O'nun rızası için verilen mal asla gerçekten kaybolmaz.",
    reflection:
      "Verdiğimde bunu sessizce Allah rızası için mi yapıyorum, yoksa başkalarının fark edip beni övmesini mi istiyorum?",
    action:
      "Bugün küçük bir sadaka verin ve mümkünse onu gizlice verin — böylece tamamen sizinle Allah arasında kalsın.",
  },
];

export const QURAN_GUIDE_APPLY_CHALLENGES_TR: DeepPartial<QuranGuideApplyChallenge>[] = [
  {
    verseExcerpt: "İnsanlara güzel söz söyleyin.",
    challenge:
      "Bütün günü tek bir sert, alaycı veya küçümseyici söz söylemeden geçirin — şaka bile olsa, kışkırtılsanız bile.",
    habit:
      "İçinizde sinir yükseldiğinde, cevap vermeden önce durun ve ya susmayı ya da güzel bir sözü seçin.",
  },
  {
    verseExcerpt: "Mümin erkeklere söyle, gözlerini haramdan sakınsınlar…",
    challenge:
      "Bugün Allah'ın haram kıldığı şeylerden bilinçli olarak gözünüzü sakının — ekranınızda, akışınızda ve toplum içinde.",
    habit:
      "Kendinizi her yakaladığınızda, o anı bunun yerine beş dakikalık Kur'an okumaya çevirin.",
  },
  {
    verseExcerpt: "Onlara “öf” bile deme…",
    challenge:
      "Bugün anne babanızdan biriyle veya bir büyüğünüzle, hiçbir rahatsızlık belirtisi göstermeden, gözle görülür bir yumuşaklık ve sabırla konuşun — ve onlara hizmet edecek bir şey yapın.",
    habit:
      "Hayattalarsa düzenli bir arama veya ziyaret sözü verin; değillerse onlar için dua edin.",
  },
  {
    verseExcerpt: "Doğrularla beraber olun.",
    challenge: "Bütün gün beyaz yalan, abartı ve dedikodu olmadan doğruyu söyleyin — şakada bile.",
    habit: "Ayağınız kayarsa hemen tövbe edin ve sözlerinizin etkilediği şeyi düzeltin.",
  },
  {
    verseExcerpt: "Allah sabredenlerle beraberdir.",
    challenge:
      "Bir dahaki sefere bir şey canınızı sıktığında, cevap vermeden önce her sert sözü tam altmış saniye boyunca tutun.",
    habit: "Mümkün olduğunca sinirlenme anlarını zikre veya iki rekât namaza dönüştürün.",
  },
  {
    verseExcerpt: "Şükrederseniz size (nimetimi) artırırım.",
    challenge:
      "Bugün üç farklı kişiye, sizin için yaptıkları belirli bir şey için adlarını anarak teşekkür edin.",
    habit: "Her geceyi bir nimeti not ederek bitirin — Munib günlüğünüzde tek bir satır.",
  },
  {
    verseExcerpt: "Kim affeder ve arayı düzeltirse, onun mükâfatı Allah'a aittir.",
    challenge:
      "Taşıdığınız bir kini bırakın — en azından kendi kalbinizde onu içtenlikle salıverin.",
    habit:
      "Kırgınlığı zihninizde tekrar tekrar yaşamak yerine, size haksızlık eden kişi için sessizce dua edin.",
  },
];

export const QURAN_GUIDE_TADABBUR_PROMPTS_TR: DeepPartial<QuranGuideTadabburPrompt>[] = [
  {
    question: "Allah bu âyette bana ne öğretiyor?",
    hint: "Âyeti yavaşça okuyun ve yapı taşlarını fark edin: Allah bir emir mi veriyor, bir uyarı mı yapıyor, bir vaatte mi bulunuyor, yoksa bir kıssa mı anlatıyor? Hangi isimlerini kullanıyor ve bu isim, burada bize nasıl muamele ettiğine dair neyi gösteriyor?",
  },
  {
    question: "Bunu bugün somut bir eylemle nasıl uygulayabilirim?",
    hint: "Belirsiz kararlar unutulur; belirli olanlar kalıcı olur. Âyeti yapılabilir tek bir adıma dönüştürün — yapılacak bir konuşma, başlanacak bir alışkanlık, gün bitmeden verilecek bir karar.",
  },
  {
    question: "Bu âyet sebebiyle hangi alışkanlığımı düzeltmeli ya da bırakmalıyım?",
    hint: "Âyeti günlük rutininize indirin — uykunuza, konuşmanıza, harcamalarınıza, namazınıza, ilişkilerinize. Bu âyet sessizce hangisinin üzerine parmak basıyor?",
  },
  {
    question:
      "Bu âyet beni Allah'ın rahmetine ümide mi, yoksa adaletinden korkmaya mı yöneltiyor — ve neden ikisi de önemlidir?",
    hint: "Mümin, iki kanat gibi, havf (Allah'ın azabından korku) ile recâ (rahmetine ümit) arasında yürür. Bu âyetin şu anda içinizde hangisini güçlendirdiğini ve kalbinizin ona daha çok ihtiyaç duyup duymadığını kendinize sorun.",
  },
  {
    question: "Peygamber ﷺ bu âyeti nasıl yaşadı?",
    hint: "Peygamber ﷺ “yürüyen Kur'an” olarak tarif edilmiştir. Sahih siyer ve tefsir kaynaklarına bakın — İbn Kesîr onun bir âyeti nasıl hayata geçirdiğini sıkça aktarır — ve onun örneğini uygulamalı bir model olarak alın.",
  },
  {
    question: "Bu âyet hangi duaya ilham veriyor?",
    hint: "Âyetin bir duaya dönüşmesine izin verin. Secdede kendi sözlerinizle, âyetin içinizde uyandırdığı her şeyi Allah'tan isteyin — bir uyarıdan korunmayı, bir vaatten pay almayı ya da bir emre uymak için yardımı.",
  },
];

export const QURAN_GUIDE_READING_LEVELS_TR: DeepPartial<QuranGuideReadingLevel>[] = [
  {
    title: "Arap alfabesi",
    summary:
      "28 harfin hepsini yalın (tek başına) hâlleriyle tanımayı ve her birini adıyla bilmeyi öğrenin. Bu tamamen bir aşinalık çalışmasıdır — bir harfi görüp sesini hemen söylemek — ve diğer her şeyin üzerine kurulduğu temeldir.",
    topics: ["Harf adları", "Temel şekiller", "Sağdan sola yön"],
  },
  {
    title: "Harf şekilleri",
    summary:
      "Arapça el yazısı gibi bitişik yazıldığı için harflerin çoğunun kelimedeki konumuna — başta, ortada veya sonda — göre şekil değiştirdiğini keşfedin. Kendisinden sonraki harfe hiç bağlanmayan birkaç harfi öğrenin.",
    topics: ["Bitişik yazı", "Bağlanmayan harfler", "Elif, vav ve ye biçimleri"],
  },
  {
    title: "Harekeler (ünlüler)",
    summary:
      "Her harfe ünlüsünü veren küçük işaretlere hâkim olun: üstün (a), esre (i), ötre (u), ünlüsüz cezm (sükûn), harfi iki kat okutan şedde ve tenvin sonları. Sessiz harfleri okunabilir kelimelere dönüştüren bu işaretlerdir.",
    topics: ["Kısa harekeler", "Cezm (sükûn)", "Şedde ile ikizleştirme", "Tenvin"],
  },
  {
    title: "Harfleri birleştirme",
    summary:
      "Hepsini bir araya getirin: Harfleri ve harekelerini sağdan sola okuyarak hecelere ve kısa kelimelere birleştirin. Kelime başındaki “el-” takısının nasıl okunacağını belirleyen şemsî ve kamerî harf kuralıyla tanışın.",
    topics: ["Harf-hareke (hece) kalıpları", "Yaygın önekler", "Şemsî ve kamerî harfler"],
  },
  {
    title: "Kelime okuma",
    summary:
      "Gerçek Kur'an kelimelerini yavaş ve doğru bir şekilde sökmeye başlayın — her namazda okuduğunuz Besmele ve Fâtiha kelimeleriyle başlayarak — böylece okuma en başından ibadetle bağlantılı olsun.",
    topics: ["Sık geçen kelimeler", "Besmele", "Fâtiha kelimeleri"],
  },
  {
    title: "Âyet okuma",
    summary:
      "Amme cüzünden kısa ve tam âyetlere geçin; temel tecvid bilgisini ve nefes almak için nerede durulacağını (vakf) ekleyin; kulağınız dilinize yol göstersin diye her zaman bir kâriyle birlikte okuyun.",
    topics: ["Amme cüzü sûreleri", "Vakf işaretleri", "Bir kâriyi takip etme"],
  },
  {
    title: "Akıcı okuma",
    summary:
      "Tecvid kurallarının doğal olarak uygulandığı, pürüzsüz ve kendinden emin bir okuyuşa ulaşın. Günlük bir vird sürdürün ve bir hoca veya ehil bir kâri sizi kontrol etmeye devam etsin; çünkü akıcılık bir kez elde edilip bırakılmaz, sürekli düzeltmeyle cilalanır.",
    topics: ["Günlük vird", "Tecvid kurallarının uygulanması", "Hoca geri bildirimi"],
  },
];

export const QURAN_GUIDE_QUIZ_TR: DeepPartial<QuranGuideQuizQuestion>[] = [
  {
    prompt: "Kur'an'da kaç sûre vardır?",
    options: ["99", "114", "124", "144"],
    explanation:
      "Kur'an'da, üç âyetten 286 âyete kadar uzanan 114 sûre vardır. Mushaftaki sıraları vahiyle belirlenmiştir (tevkîfî).",
  },
  {
    prompt: "Kur'an, günlük okuma için kaç eşit bölüme (cüz) ayrılmıştır?",
    options: ["7", "12", "30", "60"],
    explanation:
      "Otuz cüz. Her gün bir cüz okumak Kur'an'ın tamamını bir ayda bitirir — Ramazan'da hatim yapmanın klasik yolu.",
  },
  {
    prompt: "286 âyetiyle Kur'an'ın en uzun sûresi hangisidir?",
    options: ["Fâtiha", "Bakara", "Yâsîn", "Nâs"],
    explanation:
      "Bakara sûresi 286 âyetiyle en uzun sûredir. Hüküm ve rehberlik bakımından zengin, Medine'de inmiş bir sûredir.",
  },
  {
    prompt: "Doğru mu, yanlış mı: Mekkî sûre, Medine'ye hicretten önce inen sûredir.",
    options: ["Doğru", "Yanlış"],
    explanation:
      "Mekkî sûreler hicretten önce inmiştir ve çoğunlukla iman ve tevhid üzerinde durur; Medenî sûreler sonra inmiştir ve çoğunlukla hükümler ile toplum hayatına dair rehberlik ekler.",
  },
  {
    prompt: "Hira mağarasında Peygamber'e ﷺ inen ilk âyetler hangi sûrededir?",
    options: ["Fâtiha", "Alak (İkra')", "Bakara", "İhlâs"],
    explanation:
      "İlk vahiy, Alak sûresinin (96) ilk âyetleridir: “İkra' — Yaratan Rabbinin adıyla oku.”",
  },
  {
    prompt: "Kur'an yaklaşık kaç yılda indirilmiştir?",
    options: ["3 yıl", "10 yıl", "23 yıl", "40 yıl"],
    explanation:
      "Kur'an, olaylara ve ihtiyaçlara cevap vererek yaklaşık 23 yılda — 13 yıl Mekke'de, 10 yıl Medine'de — tedricen indirilmiştir.",
  },
  {
    prompt: "Doğru mu, yanlış mı: Kur'an'ın inişi Ramazan ayında, Kadir Gecesi'nde başlamıştır.",
    options: ["Doğru", "Yanlış"],
    explanation:
      "Allah, Kur'an'ın Ramazan ayında (2:185), Kadir Gecesi'nde (97:1) indirildiğini bildirir. O geceyi aramak büyük bir fazilettir.",
  },
  {
    prompt: "Günlük namazların her rekâtında hangi sûre okunur?",
    options: ["İhlâs", "Fâtiha", "Kevser", "Nasr"],
    explanation:
      "Yedi âyetten oluşan Fâtiha sûresi namazın her rekâtında okunur. “Fâtiha'yı okumayanın namazı yoktur.”",
  },
  {
    prompt: "“Bismillâhirrahmânirrahîm” ile başlamayan tek sûre hangisidir?",
    options: ["Fâtiha", "Tevbe", "İhlâs", "Nâs"],
    explanation: "Tevbe sûresi (9), besmeleyle başlamayan tek sûredir.",
  },
  {
    prompt: "Tecvidde med kuralı neyi düzenler?",
    options: [
      "İki harfi birbirine katmayı",
      "Bir ünlü sesi uzatmayı",
      "Belirli harflerdeki yankılı sekmeyi",
      "Nerede durulup nefes alınacağını",
    ],
    explanation:
      "Med, med harflerinde — elif (ا), vav (و) ve ye (ي) — bir ünlü sesi belirli sayıda hareke uzatmak demektir.",
  },
  {
    prompt: "Kalkale, sâkin olduklarında hangi harf grubuna verilen hafif, yankılı “sekme”dir?",
    explanation:
      "Beş kalkale harfi “kutbu cedin” (قُطْبُ جَدٍ) ifadesinde toplanmıştır — ق ط ب ج د — ve sâkin olduklarında net bir sekmeyle okunur.",
  },
  {
    prompt: "Kur'an'da sık geçen “Rab” (رَبّ) kelimesinin anlamı nedir?",
    options: ["Rahmet", "Rab, Efendi, Terbiye eden", "Kitap", "Bahçe"],
    explanation:
      "“Rab”; Rab, Efendi ve Terbiye edip besleyen demektir — yaratan, sahip olan, besleyip büyüten ve yöneten O'dur. “Rabbenâ” ise “Rabbimiz” anlamına gelir.",
  },
  {
    prompt: "“Cennet” (جَنَّة) kelimesi neyi ifade eder?",
    options: ["Ateş", "Cennet bahçesi", "Namaz", "Oruç"],
    explanation:
      "“Cennet” bahçe demektir — mükâfatın ebedî yurdu, “altından ırmaklar akan cennetler”.",
  },
  {
    prompt: "Hangi peygamber, oğlu İsmâil ile birlikte Mekke'de Kâbe'nin temellerini yükseltti?",
    options: ["Nûh", "Mûsâ", "İbrâhîm", "Yûsuf"],
    explanation:
      "İbrâhîm (Halîlullah, Allah'ın dostu) ve İsmâil, “Rabbimiz! Bizden kabul buyur” diye dua ederek Kâbe'yi inşa ettiler (2:127).",
  },
  {
    prompt:
      "Hangi peygamber Allah ile doğrudan konuştu, Firavun'a karşı durdu ve İsrâiloğulları'nı yarılan denizden geçirdi?",
    options: ["Îsâ", "Mûsâ", "Âdem", "Yûnus"],
    explanation:
      "Mûsâ (Kelîmullah) Allah ile konuştu, Firavun'a gönderildi ve Allah'ın emriyle deniz yarılarak kavmi güvenle karşıya geçti.",
  },
  {
    prompt:
      "İnşallah bir sonraki adımda anlamak ve ezberlemek için hangi sûreyi ya da kısa bölümü seçeceksiniz?",
    explanation:
      "Küçük ama düzenli adımlar, Allah'ın Kitabı ile ömür boyu sürecek bir bağ kurar. Bölümünüzü seçin, anlamını öğrenin ve sık sık tekrar edin.",
  },
];
