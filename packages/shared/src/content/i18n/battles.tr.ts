import type {
  BattlesFigure,
  BattlesGlossaryTerm,
  BattlesLessonCard,
  BattlesTimelineEvent,
  BattlesTopic,
  BattlesVerse,
} from "../../types/battles";
import type { DeepPartial } from "./localize";

// Turkish translation overlay for the Learn Battles content. Each overlay mirrors
// the order of its English array in ../battles*.ts (index-aligned); untranslated
// entries fall back to English. Only human-readable text is translated — ids,
// routes, surah/ayah numbers, collections, citations and grades stay in English.
// Qur'an verse-reference labels (e.g. "Qur'an 2:190") are parsed by the UI and
// are left to the English source.

export const BATTLES_TOPICS_TR: DeepPartial<BattlesTopic>[] = [
  // ── Context ───────────────────────────────────────────────────────────────
  {
    title: "Giriş",
    summary: "Tarihi arka plan, zulüm, Hicret ve savaşa ne zaman izin verildi.",
    body: [
      "Mekke'de vahyin ilk on üç yılında Müslümanlara, zulme sabırla katlanmaları emredildi — savaşmaya hiçbir izin verilmedi. Sahabe kendilerini savunmak için izin istediğinde gelen cevap şuydu: \"Ellerinizi çekin, namazı kılın, zekâtı verin\" (Kur'an 4:77). İlk topluluk zulme sebat, hicret ve dua ile karşılık verdi, silahlı isyanla değil.",
      "Medine'ye Hicret (622 M. / 1 H.), topluluğun durumunu değiştirdi, ilkelerini değil. Yesrib'de Müslümanlar, Medine Sözleşmesi'ne bağlı yerleşik bir topluluk haline geldi — şehrin Yahudi kabileleriyle karşılıklı savunma ve birlikte yaşamayı öngören yazılı bir antlaşma. Peygamber ﷺ artık saldırıya uğrayabilecek ve bu yüzden kendini meşru olarak savunabilecek bir devletin başındaydı.",
      'Ancak o zaman, yıllarca süren zulmün ardından, savaşmaya ilk izin indi — belirtilen sebep, inananların zulme uğramış ve sadece "Rabbimiz Allah"tır" dedikleri için yurtlarından çıkarılmış olmalarıydı (Kur\'an 22:39-40). Bu izin savunma ve din özgürlüğünün korunması içindi — aynı ayet, bu savaşın koruduğu şeyler arasında "manastırlar, kiliseler, havralar ve mescitler"in güvenliğini de sayar — fetih, zorla din değiştirme ya da yağma için değil.',
      "Kur'an bu iznin etrafına kalıcı bir sınır koydu: \"Sizinle savaşanlarla Allah yolunda savaşın, fakat aşırı gitmeyin\" (Kur'an 2:190). Savaşmak, topluluğa yönelik saldırganlığa bağlıydı ve asla adaletin sınırlarını aşmamalıydı.",
      "Bu seferler tarihtir: yedinci yüzyıl Arabistan'ının kabile savaşları, bozulan antlaşmalar ve kuşatmalarla dolu belirli bir bağlamında yaşandı. Barış, adalet, merhamet ve iyi komşuluk üzerine genel İslami öğretiler çerçevedir; bu savaşların ayrıntıları o çerçeve içinde okunmalı, ondan koparılıp sloganlara indirgenmemelidir.",
    ],
    quran: [
      {
        excerpt:
          "Permission is given to those who fight because they have been wronged — and Allah is indeed able to give them victory — those who have been driven from their homes without right, only because they said: Our Lord is Allah. Had Allah not repelled some people by means of others, monasteries, churches, synagogues, and mosques — in which the name of Allah is much mentioned — would surely have been demolished.",
      },
      {
        excerpt:
          "Fight in the way of Allah those who fight you, but do not transgress. Indeed, Allah does not like transgressors.",
      },
    ],
    appLinks: [{ label: "Siret zaman çizelgesi" }, { label: "Savaşlar zaman çizelgesi" }],
  },
  {
    title: "Savaşlar neden yaşandı",
    summary: "Zulüm, antlaşma ihlalleri ve topluluğun savunması — saldırganlık değil.",
    body: [
      "Bu savaşların bağlamı ve nedeni, Müslümanların savaş iştahı değil, sürekli bir düşmanlık kampanyasıydı. Mekke'de Kureyş zayıfları işkenceden geçirmiş, tüm kabileyi açlığın sınırına kadar boykot etmiş, göç edenlerin geride bıraktığı malları ele geçirmiş, hatta Peygamber'i ﷺ suikastle öldürmeyi planlamıştı. Medine'ye göç tehdidi sona erdirmedi; sadece yer değiştirdi.",
      "Bedir (Hicri 2) bu çözülmemiş çatışmadan doğdu. Ebu Süfyan'ın Şam'dan — göç edenlerden alınan malları taşıyan — zengin bir Kureyş kervanıyla döndüğü haberi Medine'ye ulaştığında, Peygamber ﷺ onu ele geçirmek için yola çıktı. Kervan kurtuldu, fakat Kureyş zaten yaklaşık bin kişilik bir ordu toplamış ve genç topluluğu güçle ezmeye kararlı olarak yine de yürüyüşe geçmişti. Bedir kuyularındaki meydan savaşı bunun sonucuydu.",
      "Medine'de hayatta kalmak antlaşmalara bağlıydı ve antlaşmalar defalarca bozuldu. Şehrin sözleşmesi altında karşılıklı savunmaya söz veren gruplar, bunun yerine düşmanla işbirliği yaptı — Hendek'te (Hicri 5) Medine'yi kuşatan Müttefikler, tam da Müslümanları tamamen yok etmek için toplanmıştı.",
      "Antlaşma ihlalleri sona kadar belirleyici olmaya devam etti. Kureyş'in müttefiklerinin, Müslümanların müttefiki Huzâa'ya saldırması, Hudeybiye Antlaşması'nı geçersiz kıldı ve — dikkat çekici biçimde — bir katliam yerine Mekke'nin neredeyse kansız fethine yol açtı.",
      "Bütün bunlar boyunca amaçlar tutarlıydı: canı ve dini savunmak, güçsüzleri korumak ve tevhidin zulüm görmeden yaşanabileceği kadar güvenlik kurmak. Amaç asla kendi başına sonu gelmez bir yayılma olmadı ve kaynaklar, düşman barışa meylettiğinde Peygamber'in ﷺ ateşkes ve antlaşmayı tercih ettiğini kaydeder.",
    ],
    hadith: [
      {
        excerpt:
          'I have been ordered to fight the people until they testify that there is no god but Allah and that Muhammad is the Messenger of Allah, establish prayer, and give zakah. If they do so, their lives and property are protected from me except by the right of Islam, and their reckoning is with Allah. — Classical scholars read "the people" as the specific idolaters of Arabia then waging war on Islam after the message had reached them; it is a statement about those hostile combatants, not a licence to attack peaceful non-Muslims or to compel belief, which Qur\'an 2:256 forbids outright.',
      },
    ],
    quran: [
      {
        excerpt:
          "There is no compulsion in religion. The right course has become distinct from error.",
      },
    ],
    disclaimer:
      "Yukarıdaki hadis çoğu zaman bağlamından koparılarak aktarılır. Klasik alimler bunu döneminin özel düşmanlık ortamı içine yerleştirmiş ve dinde zorlamayı yasaklayan Kur'ani hükümle (2:256) ve savaşmanın yalnızca seninle savaşanlara karşı olduğu sınırıyla (2:190) birlikte okumuşlardır.",
    appLinks: [{ label: "Savaş ahlakı" }],
  },
  {
    title: "İslam'da savaş ahlakı",
    summary:
      "Saldırganlık yok, sivillerin sıkı korunması ve insani davranış — Kur'an ve Sünnet'e dayalı.",
    body: [
      "İslam savaş hukuku (siyer) doğrudan Kur'ani sınırlardan ve Peygamber'in ﷺ uygulamasından doğdu. Temeli, her şeyi yöneten tek bir kuraldır: \"Sizinle savaşanlarla savaşın, fakat aşırı gitmeyin\" (Kur'an 2:190). Savaşmak saldırganlığa bir karşılıktır, adaletle sınırlıdır ve düşman durduğu anda durmalıdır.",
      "Sivil olmayanlar sıkı biçimde korunur. Bir seferin ardından öldürülmüş bir kadın bulunduğunda, Peygamber ﷺ kadınların ve çocukların öldürülmesini kesinlikle yasakladı. Fakihler bunu yaşlılara, hücrelerinde inzivaya çekilmiş rahiplere ve ibadet edenlere, tarım işçilerine ve ücretli çalışanlara ve savaşa katılmayan herkese genişletti. Onları öldürmek izin verilen bir aşırılık değil — haramdır.",
      "Aktif çarpışanlara karşı bile asıl mesele kılıçtan önce davetti. Peygamber ﷺ bir kumandan atadığında, ona önce karşı tarafı İslam'a davet etmesini, sonra — reddedilirse — bir barış antlaşmasına çağırmasını, yalnızca ikisi de reddedilirse savaşmasını ve asla sözünden dönmemesini, bir cesede işkence etmemesini ve bir çocuğu öldürmemesini emrederdi (Sahih Müslim 1731).",
      'Hainlik kesinlikle yasaktır: antlaşmalar süresince tutulmalı ve düşmana ihanet yerine adil bir uyarı verilmelidir. "Savaş hiledir" şeklindeki savaş meydanı izni, yalnızca taktik hileye — yanıltma, baskın, yön değiştirme — işaret eder; asla bir antlaşmayı bozmaya ya da korunan bir tarafa yalan söylemeye izin değildir.',
      "Mülkiyet ve toprağın kendisi de korunur. Genel talimat, meyve ağaçlarının gereksiz kesilmesini, ekinlerin yakılmasını ve hayvanların ihtiyaç fazlası kesilmesini yasaklamıştır. Esirler, esir alanların yediği gibi doyurulur ve giyindiği gibi giydirilirdi; Kur'an, Allah sevgisiyle esiri doyuranları över (76:8) ve birçoğu fidye, takas ya da sade bir merhametle serbest bırakıldı — bazıları Bedir'de Müslümanlara okuma yazma öğretme karşılığında.",
      "Bunlar dinin standart öğretileridir. Tarihte bunları ihlal eden bireysel Müslümanlar, İslam'ı tanımlamıyor, ona aykırı davranıyorlardı — tıpkı herhangi bir inancın mensuplarının ihlallerinin o inancın emirlerini değiştirmemesi gibi.",
    ],
    quran: [
      {
        excerpt: "Fight in the way of Allah those who fight you, but do not transgress.",
      },
      {
        excerpt:
          "And if they incline to peace, then incline to it also, and rely upon Allah. Indeed, it is He who is the Hearing, the Knowing.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ibn Umar reported that a woman was found slain in one of the expeditions of the Messenger of Allah ﷺ, so he forbade the killing of women and children.",
      },
      {
        excerpt:
          "When the Prophet ﷺ appointed a commander over an army he charged him: Fight in the name of Allah… do not embezzle the spoils, do not break your pledge, do not mutilate, and do not kill a child. When you meet the enemy, first invite them to Islam; if they refuse, offer them peace; only if they refuse both, then fight.",
      },
      {
        excerpt:
          "Do not kill a decrepit old man, nor a young child, nor a woman. — Some chains of this exact wording are graded weak, but the ruling it states is confirmed by the sahih narration above and by the consensus of the jurists.",
      },
    ],
    actions: [
      "İslam'ın ne emrettiği ile tarihte herhangi bir ordunun gerçekte ne yaptığı arasında net bir ayrım yap.",
      "Herhangi bir savaş anlatısından önce bu ahlak bölümünü oku — yönlendirici ilkeleri olmayan tarih yanlış anlaşılmaya davetiye çıkarır.",
      "Bir kaynak bu kurallara aykırı görünen bir eylem kaydettiğinde, sonuca varmadan önce bağlamını ve sağlamlığını sorgula.",
    ],
    appLinks: [{ label: "Kur'an ayetleri" }],
  },

  // ── Battles during the Prophet ﷺ ──────────────────────────────────────────
  {
    title: "Bedir Savaşı",
    summary: "Hicri 2, 17 Ramazan — ilk büyük savaş, Furkan Günü.",
    body: [
      "Bağlam ve sebep: Hicret'ten sonra Kureyş, göç edenlerin Mekke'de bıraktığı evlere ve mallara el koymuş ve tehditlerini sürdürmüştü. Ebu Süfyan'ın Şam'dan zengin bir kervanla döndüğü haberi Medine'ye ulaştığında, Peygamber ﷺ hafif bir kuvvetle — yaklaşık 313 kişi — yola çıktı; savaşmayı değil, malı ele geçirmeyi bekliyordu.",
      "Ne oldu: Ebu Süfyan sahil boyunca sıyrılıp kurtuldu, fakat zaten Mekke'ye yardım istemişti ve Kureyş yaklaşık bin savaşçı, süvari ve erzakla, Müslümanlara gözdağı vermeye kararlı biçimde yürüyüşe geçti. Savaş, Bedir kuyularında kaçınılmaz hale geldi; burada — Hubab bin Münzir'in tavsiyesi üzerine — Müslümanlar önce suyu ele geçirip düşmanı ondan mahrum bıraktı.",
      "O gece Peygamber ﷺ sabaha kadar namazda kaldı. Kendisinin üç katı bir orduyla karşı karşıya, ellerini kaldırdı ve Rabbine öylesine yalvardı ki cübbesi omuzlarından kaydı, şöyle diyordu: \"Allah'ım! Eğer bu iman edenler topluluğu yok olursa, yeryüzünde Sana ibadet edilmeyecek.\" Kur'an, Allah'ın buna meleklerle takviye göndererek ve mü'minlerin kalplerine sükûnet indirerek karşılık verdiğini kaydeder.",
      "Her iki taraftan üçer yiğidin teke tek çarpışmasının ardından ordular çarpıştı. Kureyş bozguna uğradı. Liderlerinden yaklaşık yetmişi öldürüldü — aralarında topluluğun en azılı zalimi Ebu Cehil de vardı — ve yaklaşık yetmişi esir alındı; on dört Müslüman şehit oldu. Esirlere onurlu davranıldı ve bazıları özgürlüklerini Müslüman çocuklara okuma yazma öğreterek satın aldı.",
      "Önemli şahsiyetler: Peygamber'in ﷺ yanında Ebu Bekir, Ömer, Ali ve amcası Hamza duruyordu; kuyular konusunda Hubab'ın ve strateji konusunda Sa'd bin Muaz'ın görüşleri, zafer vaat edilmiş olsa bile liderliğin danışmayla işlediğini gösterir.",
      "Kur'an bu günü yevmü'l-furkan — Furkan Günü — olarak adlandırır, çünkü tüm yarımadanın önünde hakkı batıldan ayırmıştır. Kalıcı dersi şudur: samimi çaba ve tam hazırlık, Allah'a tam güvenle birleştirilmelidir — mü'minler saflarını düzenledi, yerlerini seçti ve dua etti, zafer ise sayılarına değil Allah'a nispet edildi.",
    ],
    battleDetails: {
      location: "Bedir kuyuları, Medine'nin güneybatısında",
      modernLocation: "Günümüz Bedir yakınında, Suudi Arabistan",
      hijriDate: "Hicri 2, 17 Ramazan",
      muslimForces:
        "Yaklaşık 313 savaşçı, az sayıda at ve deveyle (kaynaklar hafifçe farklılık gösterir)",
      opposingForces: "Yaklaşık 1000 Kureyşli, daha iyi silahlı ve binekli",
      muslimCommander: "Peygamber Muhammed ﷺ",
      opposingCommander: "Amr bin Hişam (Ebu Cehil), savaşta öldürüldü",
      weather:
        "Bir önceki geceki yağmur Müslümanlar için kumu sertleştirdi; suya erişim belirleyici oldu",
      outcome: "Kesin Müslüman zaferi",
      keyEvents: [
        "Hubab bin Münzir, önce kuyulara kamp kurup suyu kontrol etmeyi tavsiye etti.",
        "Peygamber ﷺ gece boyu namaz kıldı, sayıca az mü'minler için Allah'a yalvardı.",
        "Üç Kureyşli yiğit, Hamza, Ali ve Ubeyde tarafından teke tek karşılandı.",
        "Allah mü'minleri meleklerle takviye etti (Kur'an 8:9) ve önde gelen Kureyşli liderleri devirdi.",
        "Düşmanın yaklaşık 70'i öldürüldü, 70'i esir alındı; esirlere insani davranıldı.",
      ],
      leadershipLesson: "İyice hazırlan, bilgi sahiplerine danış, sonra tamamen Allah'a güven.",
      spiritualLesson:
        "İlahi destekle küçük, samimi bir topluluk dünyevi olasılıkları tersine çevirebilir — zafer Allah'tandır.",
      facts: [
        "Bedir, Kur'an'da başka herhangi bir tek çatışmadan daha çok anılır ve anlatılır (Enfal Suresi).",
        "Bazı esirler, Medine çocuklarına okuma yazma öğretme karşılığında serbest bırakıldı.",
      ],
    },
    quran: [
      {
        excerpt:
          "When you were asking help of your Lord and He answered you: I will reinforce you with a thousand angels, following one another.",
      },
      {
        excerpt:
          "There was already a sign for you in the two armies that met — one fighting in the cause of Allah and another of disbelievers.",
      },
      {
        excerpt:
          "You did not kill them, but it was Allah who killed them. And you threw not when you threw, but it was Allah who threw.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Umar reported that on the day of Badr the Prophet ﷺ looked at the enemy of a thousand while his own companions were a little over three hundred, then turned to the qibla, stretched out his hands, and implored his Lord: O Allah, fulfil what You promised me. O Allah, if this band of believers is destroyed, You will not be worshipped on earth. He kept imploring until his cloak fell from his shoulders, and Abu Bakr replaced it and said: Enough, O Prophet of Allah — Allah will fulfil what He promised you.",
      },
    ],
    appLinks: [{ label: "Bedir üzerine Kur'an ayetleri" }, { label: "Önemli sahabiler" }],
  },
  {
    title: "Uhud Savaşı",
    summary: "Hicri 3, Şevval — itaat, disiplin ve sebat üzerine ağır bir ders.",
    body: [
      "Bağlam ve sebep: Bedir'den bir yıl sonra Kureyş, ölülerinin intikamını almak için döndü ve yaklaşık 3000 savaşçı topladı — süvarileri o sırada hâlâ düşman olan Halid bin Velid komuta ediyordu ve kadınlar davullar ve mersiyelerle erkekleri kışkırtıyordu. Bazılarının geri çekilmesinin ardından yaklaşık 700 kişi kalan Müslümanlar, Uhud Dağı'nı arkalarına alarak mevzilendi.",
      'Ne oldu: Peygamber ﷺ, ordunun açık arkasını koruyan bir tepeye elli okçu yerleştirdi ve onlara vurgu için tekrarladığı bir emir verdi: "Kuşların bizi kapıp götürdüğünü görseniz bile ben size haber gönderene kadar bu yeri terk etmeyin." Başlangıçta plan mükemmel işledi — Müslümanlar Kureyş\'i geri püskürttü ve düşman kaçmaya başladı.',
      "Düşmanın dağıldığını ve ganimetin ortada kaldığını gören okçuların çoğu, savaşın kazanıldığından emin olarak emre karşı tepeyi terk etti. Halid bin Velid fırsatı yakaladı, süvarisini savunmasız boşluktan dolaştırdı ve Müslümanlara arkadan vurdu. Düzen kaosa dönüştü.",
      "Önemli şahsiyetler ve kayıp: \"Allah'ın Aslanı\" Hamza bin Abdülmuttalib, yaklaşık yetmiş sahabiyle birlikte şehit oldu. Peygamber'in ﷺ kendisi de yaralandı — dişi kırıldı, yüzü yaralandı — ve meydanda onun öldürüldüğüne dair bir söylenti yayıldı. Mü'minler onun hayatta olduğunu görünce dağın yamacında etrafında toplandı ve Kureyş, onları bitiremeyerek geri çekildi.",
      "Kur'an bu günü Âl-i İmrân Suresi'nde uzun uzun ele alır ve sorumluluğu iman ya da Allah'ın vaadinin herhangi bir başarısızlığına değil, bazılarının itaatsizliğine yükler: \"Andolsun Allah size verdiği sözü doğruladı… ta ki cesaretinizi yitirdiniz, emir hakkında çekiştiniz ve sevdiğiniz şeyi size gösterdikten sonra isyan ettiniz\" (3:152). Yine de aynı bölüm yaralı topluluğu teselli eder ve umutsuzluğu yasaklar.",
      "Bu yüzden Uhud, İslam'ın bir yenilgisi değil, korunmuş bir derstir: daha önce bahşedilen zafer, disiplin bozulduğu an geri alındı; açık emirler cesaret kadar önemlidir; ve sınavlar bir topluluğu arındırır — tövbe edip sebat edenler için sekte, gelişimin tohum yatağı olur.",
    ],
    battleDetails: {
      location: "Uhud Dağı yamaçları, Medine'nin kuzeyinde",
      modernLocation: "Uhud, Medine bölgesi, Suudi Arabistan",
      hijriDate: "Hicri 3, Şevval",
      muslimForces: "Yaklaşık 700 (savaştan önce bazıları geri çekildikten sonra)",
      opposingForces: "Yaklaşık 3000 Kureyşli ve müttefikleri, süvariyle birlikte",
      muslimCommander: "Peygamber Muhammed ﷺ",
      opposingCommander: "Ebu Süfyan bin Harb; Halid bin Velid pergâr süvarisine komuta etti",
      outcome: "Kureyş taktik saha üstünlüğü; Müslüman topluluk sağ salim kaldı",
      keyEvents: [
        "Peygamber ﷺ, bir tepeye kesin emirle asla terk etmemeleri koşuluyla 50 okçu yerleştirdi.",
        "Müslümanlar düşman hattını yardı, fakat çoğu okçu ganimet toplamak için mevzisini terk etti.",
        "Halid bin Velid'in süvarisi boşluktan yararlanıp arkadan vurdu.",
        "Hamza ve yaklaşık 70 sahabi şehit oldu; Peygamber ﷺ yaralandı.",
        "Peygamber'in öldüğüne dair asılsız bir söylenti yayıldı; mü'minler onu diri görünce toparlandı.",
      ],
      leadershipLesson:
        "Açık emirler ve disiplinli uygulama cesaret kadar önemlidir; mevziyi terk etmek bir zaferi tersine çevirebilir.",
      spiritualLesson:
        "Sınavlar mü'minleri arındırır; tövbe ve sebatla karşılanan sekte gelişime yol açar.",
    },
    quran: [
      {
        excerpt:
          "Allah had certainly fulfilled His promise to you when you were killing them by His permission — until you lost courage, disputed over the order, and disobeyed after He had shown you that which you love.",
      },
      {
        excerpt:
          "So do not weaken and do not grieve, for you will be superior if you are true believers.",
      },
    ],
    hadith: [
      {
        excerpt:
          "The Prophet ﷺ appointed Abdullah ibn Jubayr over the fifty archers on the day of Uhud and said: Hold your position; even if you see us being snatched away by birds, do not leave it until I send for you — and even if you see us defeat them, do not leave until I send for you. When the enemy was routed and the archers saw the spoils, they said, The booty! and left their post — so seventy of us were killed.",
      },
    ],
    appLinks: [{ label: "Liderlik dersleri" }, { label: "Önemli sahabiler" }],
  },
  {
    title: "Hendek Savaşı (Ahzab)",
    summary:
      "Hicri 5, Şevval — Müttefikler Medine'yi kuşatır; bir hendek ve bir fırtına onları dağıtır.",
    body: [
      "Bağlam ve sebep: Gazvetü'l-Ahzab (Müttefikler Savaşı) diye de anılan bu, düşmanın İslam'ı kalıcı olarak yok etme yönündeki en büyük çabasıydı. Daha önce hainlik yüzünden sürgün edilen Benî Nadîr'in liderleri, Mekke'ye ve Gatafan'a giderek bir koalisyon topladı — Kureyş, Gatafan ve diğer kabileler — sayıları 10.000 ile 24.000 arasında tahmin ediliyordu. Müslümanlar yaklaşık 3000 kişiydi ve tehlike varoluşsaldı.",
      "Ne oldu: Hiçbir Arap şehrinin açık savaşta dayanamayacağı bir kuşatmayla karşı karşıya kalan Peygamber ﷺ, sahabesine danıştı. Selman el-Farisi, Arap savaşına yabancı bir Fars taktiği önerdi — lav tarlaları, bahçeler ya da tahkimli evlerle korunmayan tek yön olan açık kuzey geçidi boyunca derin bir hendek kazmak. Mü'minler acı soğukta ve açlıkta günlerce kazdı; Peygamber ﷺ sırtında toprak taşıdı ve oruç sancısına karşı karnına taş bağladı.",
      "Hendek işe yaradı. Dev ordu geldiğinde onu geçemediğini fark etti; onu aşan birkaç süvari geri püskürtüldü. Kuşatma, açık bir meydan savaşı yerine yaklaşık iki ila dört haftalık soğuk, gerginlik ve çatışmalara dönüştü.",
      "Topluluk kökten sınandı. Münafıklar bahaneler uydurup sıvışmaya çalıştı; şehrin içindeki Benî Kurayza kabilesi düşmana meyletti; Kur'an kalplerin boğaza dayandığını anlatır. Yine de mü'minler dayandı ve gizlice Müslüman olan Nuaym bin Mesud, müttefik gruplar arasına öyle bir güvensizlik ekti ki birbirlerine düştüler.",
      "Sonra yardım kılıçlardan değil Allah'tan geldi. Şiddetli, dondurucu bir rüzgâr düşman kampını yerle bir etti, ateşleri ve çadırları devirdi ve görünmez ordular onları dehşete boğdu. Zaten parçalanmış ve erzağı azalmış koalisyon, gece karanlığında dağılıp çekildi. Peygamber ﷺ daha sonra Müttefikleri tek başına Allah'ın yendiğini söyledi.",
      "Kalıcı dersler: iyi öğüt nereden gelirse gelsin benimsenmelidir — burada Farisi bir mühtediden; imkânlar sonuna kadar kullanılmalıdır — hendek kazıldı, saflar tutuldu; ve sonra sonuç, bir orduyu bir rüzgârla geri çevirebilen Allah'a bırakılır. Ahzâb Suresi bütün sınavı ve kurtuluşunu muhafaza eder.",
    ],
    battleDetails: {
      location: "Medine'nin kuzey yaklaşım yolları",
      modernLocation: "Medine, Suudi Arabistan",
      hijriDate: "Hicri 5, Şevval",
      muslimForces: "Yaklaşık 3000",
      opposingForces:
        "Müttefikler koalisyonu (yaklaşık 10.000-24.000; kaynaklarda rakamlar farklıdır)",
      muslimCommander: "Peygamber Muhammed ﷺ",
      opposingCommander:
        "Kureyş'e önderlik eden Ebu Süfyan; Gatafan ve diğerlerinin müttefik liderleri",
      weather: "Kazı sırasında acı soğuk; şiddetli ilahi bir rüzgâr kuşatmayı sona erdirdi",
      outcome: "Meydan savaşı olmadan Müslüman zaferi; koalisyon dağıldı",
      keyEvents: [
        "Selman el-Farisi, savunmasız kuzey koridoru boyunca hendek kazmayı önerdi.",
        "Peygamber ﷺ emeğe katıldı, toprak taşıdı ve açlığa karşı taş bağladı.",
        "Hendek devasa orduyu durdurdu, açık savaş yerine kuşatmaya zorladı.",
        "Nuaym bin Mesud, müttefik grupları bölen bir anlaşmazlık ekti.",
        "Dondurucu bir rüzgâr ve görünmez ordular (Kur'an 33:9) düşman kampını darmadağın etti; geri çekildiler.",
      ],
      leadershipLesson:
        "Geniş çapta danış ve iyi fikirleri kaynağına bakmaksızın benimse; topluluğun zorluğuna bizzat ortak ol.",
      spiritualLesson:
        "Kuşatma altında dayan ve sonucu, bir orduyu bir rüzgârla geri çevirebilen Allah'a bırak.",
    },
    quran: [
      {
        excerpt:
          "O you who believe, remember the favour of Allah upon you when armies came to you and We sent against them a wind and armies you did not see… There the believers were tested and shaken with a severe shaking.",
      },
      {
        excerpt:
          "And when the believers saw the Confederates, they said: This is what Allah and His Messenger promised us — and it only increased them in faith and submission.",
      },
    ],
    hadith: [
      {
        excerpt:
          "The Prophet ﷺ supplicated against the Confederates on the day of al-Ahzab, saying: O Allah, Revealer of the Book, Swift in reckoning — defeat the Confederates. O Allah, defeat them and shake them.",
      },
    ],
    appLinks: [{ label: "Selman el-Farisi" }],
  },
  {
    title: "Benî Kurayza",
    summary:
      "Hicri 5 — kuşatma sırasında bozulan bir antlaşma; kararlaştırılmış bir hakem eliyle hüküm.",
    body: [
      "Bağlam ve sebep: Benî Kurayza, Medine'nin karşılıklı savunma sözleşmesiyle Müslümanlara bağlı bir Yahudi kabilesiydi. Hendek'in en kritik anında, Müttefikler Medine'yi kuşatmışken ve topluluğun hayatta kalması bir ipliğe bağlıyken, Benî Nadîr'in lideri Kurayza liderlerini bu sözleşmeyi yırtıp şehir içinden ikinci bir cephe açmaya ikna etti. O anda gelen bu hareket özel bir anlaşmazlık değil, Medine'deki herkesi yok edebilecek bir kuşatma sırasında ihanetti.",
      "Ne oldu: Müttefikler çekildikten sonra Peygamber ﷺ, kalelerine kapanan Benî Kurayza'ya yöneldi. Kuşatma, teslim olmayı kabul edinceye kadar yaklaşık yirmi beş gün sürdü — ama kaderlerinin doğrudan Peygamber ﷺ tarafından değil, kendi seçtikleri bir hakem tarafından belirlenmesini istediler: Evs'in reisi ve kendi eski müttefikleri Sa'd bin Muaz.",
      "Hüküm: Kendisi Hendek'te aldığı bir yarayla can çekişen Sa'd, ihaneti işleyen savaşçı erkeklerin idam edilmesine, kadın ve çocukların ise esir alınmasına hükmetti — her ölçüde ağır, fakat o zaman ve mekânın kuşatma sırasında ihanete ilişkin savaş hukukuna uygun bir karardı. Peygamber ﷺ, Sa'd'ın Allah'ın hükmüne uygun hükmettiğini söyledi.",
      "Bunu dikkatle nasıl okumalı: Bu, topluluğun en savunmasız saatinde bir savunma paktını bozan savaşçıların belirli bir savaş zamanı ihanetinin cezasıydı — bir halka, dinleri yüzünden verilmiş bir hüküm değildi ve kesinlikle Müslümanların Yahudilerle ya da herhangi bir dini toplulukla ilişkilerine dair bir model değildir; Kur'an ve Sünnet, barışçıl gayrimüslimlere karşı adalet ve iyi davranışı emreder (Kur'an 60:8) ve sözlerinde duran Medine'nin diğer Yahudi kabileleri ve bireyleri asla zarar görmedi. Ana akım ilim bunu sınırlı, tarihsel bir ihanet hukuku vakası olarak ele alır ve bazı sonraki alimler aktarılan rakamların ayrıntılarını bile sorgulamıştır.",
      "Kur'an bu olaydan Ahzâb Suresi'nde, Müttefikler savaşının bir sonucu olarak, hiçbir övünme olmaksızın ciddiyetle bahseder. Kalıcı ders, bir sözleşmeyi bozmanın ağırlığıdır — ortak bir tehlike anında güveni ihlal etmek en ağır yükü taşır — bu ilkeyle birlikte: düşman bile olsa kişi, dizginsiz bir intikam yerine kararlaştırılmış ve tarafsız bir hakemin hükmüne hak kazanır.",
    ],
    battleDetails: {
      location: "Medine kenarındaki Benî Kurayza kaleleri",
      modernLocation: "Medine, Suudi Arabistan",
      hijriDate: "Hicri 5, Zilkade (Hendek'ten kısa süre sonra)",
      muslimForces: "Hendek kuşatmasının hemen ardından Medine ordusu",
      opposingForces: "Kalelerine tahkim olmuş Benî Kurayza",
      muslimCommander: "Peygamber Muhammed ﷺ",
      outcome: "Kuşatmanın ardından teslimiyet; kabilenin kendi seçtiği hakem eliyle hüküm",
      keyEvents: [
        "Benî Kurayza, Müttefikler kuşatması sırasında Medine sözleşmesini bozdu.",
        "Müttefikler çekildikten sonra Müslümanlar kalelerini yaklaşık 25 gün kuşattı.",
        "Kabile, kendi eski müttefikleri olan Evs reisi Sa'd bin Muaz tarafından yargılanmayı istedi.",
        "Sa'd, kuşatma altında ihanet için o çağın savaş hukukuna göre hükmetti; Peygamber ﷺ hükmü onayladı.",
      ],
      leadershipLesson:
        "Bir düşmana karşı bile, dizginsiz intikam yerine kararlaştırılmış, tarafsız bir hakemin hükmüne izin ver.",
      spiritualLesson:
        "Ortak bir tehlike anında karşılıklı koruma sözleşmesini bozmak en ağır ihanetler arasındadır.",
    },
    quran: [
      {
        excerpt:
          "And He brought down those of the People of the Scripture who supported them from their fortresses and cast terror into their hearts — a party you killed, and a party you took captive. And He caused you to inherit their land and their homes.",
      },
      {
        excerpt:
          "Allah does not forbid you from those who do not fight you because of religion and do not expel you from your homes — from being righteous toward them and acting justly toward them. Indeed, Allah loves those who act justly.",
      },
    ],
    hadith: [
      {
        excerpt:
          "When Banu Qurayzah agreed to accept the judgement of Sa'd ibn Mu'adh, the Prophet ﷺ sent for him. He came, and the Prophet ﷺ said: Stand for your chief. Sa'd judged that their fighting men be killed and their women and children taken captive. The Prophet ﷺ said: You have judged by the judgement of Allah — or he said, by the judgement of the King.",
      },
    ],
    disclaimer:
      "Bu, savaşçıların işlediği belirli bir savaş zamanı ihanetinin cezasıydı ve kabilenin kendi seçtiği bir hakem tarafından yargılandı. Bu, herhangi bir halka dinleri yüzünden verilmiş bir hüküm değildir ve İslam'ın adalet ve iyilikle davranılmasını emrettiği Yahudilerle ya da herhangi bir dini toplulukla ilişkiler için bir model değildir (Kur'an 60:8). Bazı sonraki alimler aktarılan rakamların ayrıntılarını sorgulamıştır.",
  },
  {
    title: "Hudeybiye Antlaşması",
    summary: "Hicri 6 — bir sekte gibi görünen ve apaçık bir zafere dönüşen bir ateşkes.",
    body: [
      "Bağlam ve sebep: Hicri 6'da Peygamber ﷺ yaklaşık 1400 sahabiyle — yolcu kılıçları dışında silahsız — sadece Kâbe'de umre yapmak niyetiyle, savaşmak için değil yola çıktı. Müslümanların Mekke'ye girdiğini görmeye razı olmayan Kureyş, kutsal sınırdaki Hudeybiye denen yerde yolu kesti.",
      "Rıdvan Biatı: Kampa, Kureyş'in Peygamber'in elçisi Osman bin Affan'ı öldürdüğüne dair bir söylenti ulaştığında, Peygamber ﷺ sahabeyi bir akasya ağacının altında kaçmayacaklarına dair biat etmeye çağırdı. Yaklaşık bin dört yüz kişi bu biati verdi — Bey'atü'r-Rıdvan, İlahi Hoşnutluk Biati — ve Kur'an daha sonra şöyle bildirdi: \"Andolsun, ağacın altında sana biat ederlerken Allah mü'minlerden razı oldu\" (48:18). Osman'ın sağ olduğu ortaya çıktı ve gösterilen bu kararlılık karşısında telaşlanan Kureyş, müzakere için elçi gönderdi.",
      "Ne oldu: Ateşkesin şartları aşağılayıcı görünüyordu. Müslümanlar bu yıl umre yapmadan geri dönecek ve ancak gelecek yıl gelebilecekti. On yıllık bir barış olacaktı. Kureyş'ten Müslümanlara kaçan herkes iade edilecek, fakat tersi olmayacaktı — can sıkan bir madde. Zincire vurulmuş bir Müslüman, Ebu Cendel, tam bu madde gereğince gözlerinin önünde geri sürüklenirken, sahabe neredeyse çözülüyordu; Ömer açıkça sorguladı ve nazikçe Allah'ın Elçisi'ne güvenmesi hatırlatıldı.",
      "Bunun neden bir zafer olduğu: Kureyş ilk kez Müslümanlarla yazılı bir antlaşmada eşit bir güç olarak muamele etti. On yıllık barış yolları açtı; ateşkes süresince İslam hızla ve barışçıl biçimde yayıldı — o iki yılda, önceki tüm yıllardan daha fazla kişi İslam'a girdi. Kureyş cephesinden kurtulan Peygamber ﷺ Hayber'e yönelebildi ve krallara ve kabilelere İslam'a davet mektupları gönderebildi. Dönüş yolculuğunda Fetih Suresi indi ve şöyle başlıyordu: \"Şüphesiz Biz sana apaçık bir fetih verdik.\"",
      "Kalıcı dersler: Bu, bir kararın hikmeti henüz görünür olmadığında dürtü karşısında sabrın ve Allah'a ve Elçisi'ne güvenmenin en üstün örneğidir. Sahabenin önce bir yenilgi olarak hissettiğini Kur'an apaçık bir zafer olarak adlandırdı — ve sadece iki yıl içinde bu, Mekke'nin kendisine giden yolu açtı. Zor bir barışı kabul etme, antlaşmaya sadık kalma ve bekleme isteği burada zayıflığın değil, gücün bir biçimi olarak gösterilmiştir.",
    ],
    battleDetails: {
      location: "Mekke yakınında kutsal sınırdaki Hudeybiye",
      modernLocation: "Mekke yakınında eş-Şümeysi, Suudi Arabistan",
      hijriDate: "Hicri 6, Zilkade",
      muslimForces: "Yaklaşık 1400 hacı, savaşa hazırlıksız",
      opposingForces: "Mekke'ye giden yolu kesen Kureyş",
      muslimCommander: "Peygamber Muhammed ﷺ",
      outcome:
        "On yıllık bir ateşkes; savaş yok; sonradan Kur'an'da apaçık bir zafer olarak adlandırıldı",
      keyEvents: [
        "Müslümanlar savaş için değil umre için yola çıktı ve Hudeybiye'de durduruldu.",
        "Osman'ın öldüğüne dair asılsız bir haber üzerine yaklaşık 1400 kişi ağacın altında Rıdvan Biatı verdi.",
        "Sahabenin acı bulduğu şartlarla (iade maddesi, Ebu Cendel) on yıllık bir ateşkes imzalandı.",
        "Barış süresince İslam hızla yayıldı; Fetih Suresi antlaşmayı apaçık bir zafer olarak adlandırdı.",
      ],
      leadershipLesson:
        "Zor bir barışı kabul et ve ona sadık kal; bugünkü akıllıca bir taviz yarın daha büyük bir kapı açabilir.",
      spiritualLesson:
        "Bir kararın hikmeti gizliyken Allah'a ve Elçisi'ne güven — sabır en gerçek zafer olabilir.",
    },
    quran: [
      {
        excerpt:
          "Indeed, We have given you a manifest victory, that Allah may forgive you what preceded of your sin and what will follow, complete His favour upon you, and guide you to a straight path.",
      },
      {
        excerpt:
          "Certainly was Allah pleased with the believers when they pledged allegiance to you under the tree, and He knew what was in their hearts, so He sent down tranquillity upon them and rewarded them with an imminent conquest.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Jabir ibn Abdullah said: On the day of al-Hudaybiyyah we were fourteen hundred. We pledged allegiance to the Prophet ﷺ under the tree, and he was the best of people.",
      },
    ],
    appLinks: [{ label: "Ders: zaferden önce sabır" }, { label: "Kur'an ayetleri" }],
  },
  {
    title: "Hayber Seferi",
    summary: "Hicri 7 — Müttefikleri desteklemiş olan tahkimli kaleler boyun eğdiriliyor.",
    body: [
      "Bağlam ve sebep: Hayber, Medine'nin kuzeyinde, daha önce hainlik yüzünden sürgün edilen kabilelerin — Hendek'te Müttefik koalisyonunu örgütleyen Benî Nadîr liderleri de dahil — yurdu olan verimli vaha kalelerinden oluşan bir zincirdi. Oradan Medine'ye karşı düşman toplamaya devam ediyorlardı. Kureyş cephesi Hudeybiye ile dondurulmuşken, Peygamber ﷺ bu kalan düşmanlık üssünü etkisiz hale getirmeye yöneldi.",
      "Ne oldu: Müslümanlar — yaklaşık 1600 kişi — kalelere birer birer ilerledi. Sefer zorlu geçti ve haftalarca sürdü. Zorlu bir günde Peygamber ﷺ şöyle dedi: \"Yarın bu sancağı, Allah'ı ve Elçisi'ni seven, Allah'ın ve Elçisi'nin de kendisini sevdiği, elleriyle Allah'ın zafer vereceği bir adama vereceğim.\" Ertesi sabah gözleri ağrıyan Ali bin Ebu Talib'i çağırdı, gözleri iyileşinceye kadar onun için dua etti ve sancağı ona verdi; kilit kale düştü.",
      "Antlaşma: Kaleler ele geçirildiğinde sakinleri sürülmedi. Kalıp toprağı işlemeye devam etmeyi ve Müslümanlara üründen bir pay vermeyi istediler, Peygamber ﷺ de kabul etti. Bu düzenleme — fethedilen çiftçilerin, ürün paylaşımı antlaşması altında topraklarında tutulması — daha sonraki İslam antlaşma ve vergi hukukunda incelenen erken bir emsal oldu.",
      "Önemli şahsiyetler: Sefer her şeyden önce Ali'nin rolü ve sancak hadisinde somutlaşan ahlak açısından hatırlanır — liderliğin sadece rütbeye ya da güce değil, samimiyete ve Allah sevgisine dayanarak emanet edildiği.",
      "Bir dikkat notu: Hayber bazen çok daha sonraki siyasi tartışmalara sürüklenir. Burada kesinlikle klasik siyerde kaydedilen yedinci yüzyıl seferi olarak anlatılır — kitlesel sürgünle değil, müzakere edilmiş bir antlaşmayla sonuçlanan aktif bir düşmanlık üssüne verilen bir karşılık.",
    ],
    battleDetails: {
      location: "Medine'nin kuzeyindeki Hayber vahası",
      modernLocation: "Hayber, Suudi Arabistan",
      hijriDate: "Hicri 7, Muharrem-Safer",
      muslimForces: "Yaklaşık 1600",
      opposingForces: "Birçok kalede tahkimli garnizonlar",
      muslimCommander: "Peygamber Muhammed ﷺ; kesin saldırıya Ali bin Ebu Talib önderlik etti",
      outcome:
        "Kalelerin Müslüman kontrolüne geçmesi; müzakere edilmiş bir ürün paylaşımı antlaşması",
      keyEvents: [
        "Kaleler, haftalarca süren bir kuşatmada birer birer düşürüldü.",
        "Sancak, Peygamber'in ﷺ duasıyla gözleri iyileşen Ali'ye verildi.",
        "Yiğit Merhab alt edildi ve kilit kale düştü.",
        "Sakinler, bir ürün paylaşımı antlaşması altında topraklarında çiftçi olarak kaldı.",
      ],
      leadershipLesson:
        "Sorumluluğu en uygun olanlara — ve kalpleri Allah'a karşı samimi olanlara emanet et.",
      spiritualLesson:
        "Uzayan zorluk karşısında sebat, samimiyetle birleşince Allah'ın yardımını getirir.",
    },
    hadith: [
      {
        excerpt:
          "On the day of Khaybar the Prophet ﷺ said: Tomorrow I will give this banner to a man who loves Allah and His Messenger, and whom Allah and His Messenger love, and through whose hands Allah will grant victory. The next day he called for Ali, who had sore eyes; he spat in his eyes and prayed for him, and Ali was cured as though he had never been ill, and he was given the banner.",
      },
    ],
    appLinks: [{ label: "Ali bin Ebu Talib" }],
  },
  {
    title: "Mute Savaşı",
    summary: "Hicri 8, Cemaziyelevvel — üç kumandanın peş peşe şehit olduğu bir sınır seferi.",
    body: [
      "Bağlam ve sebep: Peygamber ﷺ, Bizans yanlısı kuzeye bir elçi göndermişti ve elçi öldürülmüştü — elçiler uluslararası hukukla korunduğu için ciddi bir ihlaldi. Buna karşılık, Ürdün'ün doğusunda Roma sınırına yakın Mute'ye yaklaşık 3000 kişilik bir ordu gönderdi.",
      "Kumanda zinciri: Yola çıkmadan önce Peygamber ﷺ bir ardıllık sırası belirledi — Zeyd bin Harise önderlik edecek, o düşerse Cafer bin Ebu Talib, o da düşerse Abdullah bin Revâha — belirleyici olacak dikkat çekici bir öngörü hareketi.",
      "Ne oldu: Mute'de Müslümanlar, Bizanslılardan ve müttefik Arap kabilelerinden çok daha büyük bir güçle karşılaştı — kaynaklar on binlerden söz eder, gerçi rakamlar belirsiz ve muhtemelen abartılıdır. Zeyd düştü, sonra Cafer — sancağı iki kolu da kesilene kadar tutmasıyla hatırlanır — sonra da tam Peygamber'in ﷺ belirlediği sırayla Abdullah bin Revâha düştü.",
      "Geri çekiliş: Belirlenen üç kumandan da şehit olunca sahabe sancağı, Hudeybiye'den sonra yeni Müslüman olan Halid bin Velid'e verdi. Bir dizi manevra ve yeniden konuşlanmayla, sayıca az olan orduyu düşmandan kopardı ve büyük ölçüde sağlam biçimde eve getirdi — Peygamber'in ﷺ takdir ettiği bir başarı; sonradan Halid'i \"Allah'ın kılıçlarından bir kılıç\" olarak andı. Medine'de Peygamber ﷺ, Zeyd, Cafer ve İbn Revâha için ağladı ve haberci ulaşmadan önce şehadetlerini bildirdi.",
      "Kalıcı dersler: tehlikeden önce ardılları belirlemek — liderlik sürekliliği — gerçekten bir orduyu kurtardı; ve canları koruyan disiplinli bir geri çekiliş, utanç değil hikmettir. Allah yolunda şehitlik onurdur, siyasi başarısızlık değildir; ve bu savaş, Müslümanları, kısa süre sonra tamamen dinin hizmetine yönelecek olan Halid'in yeteneğiyle de tanıştırdı.",
    ],
    battleDetails: {
      location: "Ürdün Nehri'nin doğusunda Mute",
      modernLocation: "Kerek yakınında, Ürdün",
      hijriDate: "Hicri 8, Cemaziyelevvel",
      muslimForces: "Yaklaşık 3000",
      opposingForces:
        "Bizans ve müttefik Arap kuvvetleri (çok daha büyük; kaynaklarda rakamlar belirsiz)",
      muslimCommander: "Zeyd bin Harise, sonra Cafer, sonra İbn Revâha, sonra Halid bin Velid",
      outcome: "Düzenli Müslüman geri çekilişi; ağır şehadet ama ordu korundu",
      keyEvents: [
        "Peygamber ﷺ, yola çıkmadan önce üç kumandanı ardıllık sırasıyla belirledi.",
        "Üçü de Mute'de tam öngörüldüğü gibi peş peşe düştü.",
        "Halid bin Velid komutayı devraldı ve orduyu güvenle manevra ettirdi.",
        "Peygamber ﷺ Medine'de ağladı ve haber ulaşmadan önce şehitleri açıkladı.",
      ],
      leadershipLesson:
        "Tehlike gelmeden ardılları belirle — açık liderlik sürekliliği canları kurtarır.",
      spiritualLesson:
        "Allah yolunda şehitlik bir onurdur; orduyu kurtaran akıllıca bir geri çekiliş yenilgi değildir.",
    },
    appLinks: [{ label: "Halid bin Velid" }],
  },
  {
    title: "Mekke'nin Fethi",
    summary: "Hicri 8, Ramazan — genel bir af altında Mekke'nin neredeyse kansız açılışı.",
    body: [
      "Bağlam ve sebep: Hudeybiye Antlaşması, Kureyş'in müttefikleri Benî Bekir'in, Müslümanların müttefiki Benî Huzâa'ya saldırana kadar — bazılarını kutsal alanın içinde bile öldürerek — ve Kureyş gizlice silah sağlarken sürdü. Bu, ateşkesi paramparça etti. Kureyş'in bunu kendi başına düzeltme girişimi başarısız olunca, Mekke'nin yolu açıldı.",
      "Ne oldu: Peygamber ﷺ, Kureyş'in direniş örgütleyecek vakti olmayacak kadar hızlı ve gizli biçimde yaklaşık 10.000 sahabiyle yürüdü. Kureyş'in eski kumandanı Ebu Süfyan çıkıp geldi ve girişten bir gece önce İslam'ı kabul etti. Ordu, birkaç yönden neredeyse hiç savaşmadan Mekke'ye girdi — yalnızca bir kol kısa bir silahlı direnişle karşılaştı; Peygamber ﷺ kumandanlarına açıkça, kendileriyle savaşanlar dışında kimseyle savaşmamalarını emretmişti.",
      "Genel af: Fethi tanımlayan an tam da budur. Kendisine işkence eden, boykot eden ve onu kovan şehir artık merhametindeyken Kâbe'nin yanında duran Peygamber ﷺ, Kureyş'e kendisinden ne beklediklerini sordu, sonra — Hz. Yusuf'un kendisine haksızlık eden kardeşlerine söylediği sözleri yankılayarak — şöyle ilan etti: \"Bugün size kınama yok. Gidin, artık özgürsünüz.\" Genel bir af tüm nüfusu kapsadı; yalnızca belirli suçlar işleyen az sayıda kişi istisna tutuldu ve onların da çoğu kendisine geldiğinde affedildi.",
      "Arınma: Peygamber ﷺ, ardından Kâbe'yi \"Hak geldi, batıl yok oldu\" (Kur'an 17:81) diyerek 360 putundan temizledi. Bir zamanlar tam bu şehirde köle olarak işkence gören Bilal bin Rebah, Kâbe'nin üstüne çıktı ve Mekke'ye ezan okudu. \"Allah'ın yardımı ve fetih geldiğinde\" diye başlayan Nasr Suresi, bu açılışı ve dine akın akın girenleri işaret eder.",
      "Kalıcı dersler: Bu, nebevi karakterin iktidarda sergilenmesinin en büyük tezahürlerinden biridir. Zaferde cömertlik, herhangi bir cezanın kazanabileceğinden çok daha fazla kalp kazandı; her aşamada amaç rehberlikti, intikam değil ve güç, nefsin değil mesajın hizmetine sokuldu. Buna yerinde biçimde Fethu Mekke — Açılış — denir, bir yağma değil.",
    ],
    battleDetails: {
      location: "Mekke",
      modernLocation: "Mekke, Suudi Arabistan",
      hijriDate: "Hicri 8, Ramazan",
      muslimForces: "Yaklaşık 10.000",
      opposingForces: "Kureyş (neredeyse hiç savaşmadan teslim oldu)",
      muslimCommander: "Peygamber Muhammed ﷺ",
      outcome: "Mekke neredeyse kan dökülmeden açıldı; genel bir af ilan edildi",
      keyEvents: [
        "Kureyş, Müslümanların müttefiki Huzâa'ya bir saldırıyı desteklediğinde ateşkes bozuldu.",
        "Ordu girmeden önce Ebu Süfyan İslam'ı kabul etti; evi bir güvenlik yeri ilan edildi.",
        "Peygamber ﷺ genel bir af verdi: Bugün size kınama yok — gidin, özgürsünüz.",
        "Kâbe putlardan temizlendi; Bilal üstünden ezan okudu.",
        "Eski düşmanlar büyük sayılarda İslam'ı kabul etti.",
      ],
      leadershipLesson:
        "Zaferde cömertlik, korku ya da intikamdan çok daha kalıcı biçimde kalpleri kazanır.",
      spiritualLesson:
        "Amaç rehberlikti, intikam değil — güç, nefsin değil mesajın hizmetine sokulur.",
    },
    quran: [
      {
        excerpt:
          "When the victory of Allah has come and the conquest, and you see the people entering the religion of Allah in multitudes, then exalt with praise of your Lord and ask His forgiveness. Indeed, He is ever Accepting of repentance.",
      },
      {
        excerpt:
          "He said: No blame upon you today. May Allah forgive you, and He is the most merciful of the merciful. — the words of Prophet Yusuf that the Prophet ﷺ echoed to the Quraysh on the day of the conquest.",
      },
    ],
    appLinks: [{ label: "Ders: zaferden sonra merhamet" }],
  },
  {
    title: "Huneyn Savaşı",
    summary: "Hicri 8, Şevval — Mekke'den sonra bir pusu; güven sınandı, sonra zafer bahşedildi.",
    body: [
      "Bağlam ve sebep: Mekke'nin açılışından henüz iki hafta sonra, güçlü Havazin ve Sakif kabileleri, Müslümanların yeni üstünlüğü henüz yerleşmeden onlara vurmak için toplandı. Peygamber ﷺ, birçoğu yeni Mekkeli mühtedi olan büyük bir orduyla — yaklaşık 12.000 kişi — yola çıktı; bu, o zamana kadar toplanmış en büyük Müslüman güçtü. Bu büyüklük karşısında bazıları alışılmadık bir güven hissetti ve birinin sayıca eksiklikten dolayı yenilemeyeceklerini söylediği aktarılır.",
      "Ne oldu: Düşman, Huneyn'in dar vadisinde pusu kurmuştu. Müslümanlar şafağın alacakaranlığında inerken yükseklerden üzerlerine bir ok yağmuru düştü ve öncü birlik dağıldı. Panik yayıldı ve büyük ordunun çoğu dönüp kaçtı — güveni doğuran o sayı şimdi bozguna yol açıyordu.",
      "Dönüm noktası: Kaosun ortasında Peygamber ﷺ kaçmadı. Katırını düşmana doğru sürdü, yüksek sesle şöyle sesleniyordu: \"Ben peygamberim, bu yalan değil; ben Abdülmuttalib'in oğluyum.\" Muhacirlerden ve Ensar'dan sağlam bir çekirdek — Abbas sahabeyi isimleriyle geri çağırırken — etrafında toplandı. Müslümanlar yeniden saf tuttu, pusucuların üzerine döndü ve onları bozguna uğrattı; esirler ve büyük ganimet alındı.",
      "Sonrası: Sefer, hemen düşmeyen Taif kuşatmasına kadar sürdü. Daha sonra Havazin halkını almaya geldiğinde, Peygamber ﷺ esirleri geri verdi — ganimeti elde tutmak yerine barışı ve kalplerin yumuşamasını seçti ve yeni Mekkeli mühtedilere, onları dine bağlamak için cömertçe lütufta bulundu.",
      "Kur'an bu günü doğrudan ele alır ve sayıya güvenmenin tehlikesini adlandırır: \"Ve Huneyn gününde, çokluğunuz sizi böbürlendirdiğinde ama size hiçbir fayda sağlamadığında… sonra Allah sükûnetini indirdi\" (9:25-26). Kalıcı ders açıktır — asla sayıya, mala ya da yakın zamandaki başarıya dayanma; zafer yalnızca Allah'ın bir bağışıdır — ve bir liderin, takipçileri paniklediğinde sağlam ve görünür kalmasının erdemi.",
    ],
    battleDetails: {
      location: "Mekke ile Taif arasında Huneyn vadisi",
      modernLocation: "Taif yakınında, Suudi Arabistan",
      hijriDate: "Hicri 8, Şevval",
      muslimForces: "Yaklaşık 12.000 (birçoğu yeni Mekkeli mühtedi)",
      opposingForces: "Havazin ve Sakif",
      muslimCommander: "Peygamber Muhammed ﷺ",
      outcome: "Başlangıçtaki bozgunun ardından Müslüman zaferi",
      keyEvents: [
        "O zamana kadarki en büyük Müslüman ordusu, savaştan önce sayısına güven duydu.",
        "Vadideki bir şafak pususu öncü birliği dağıttı ve geniş bir paniğe yol açtı.",
        "Peygamber ﷺ sağlam durdu ve mü'minleri geri çağırdı; sağlam bir çekirdek etrafında toplandı.",
        "Müslümanlar yeniden saf tuttu ve düşmanı bozguna uğrattı; ardından Taif kuşatması geldi.",
        "Esirler daha sonra bir uzlaşma jesti olarak geri verildi.",
      ],
      leadershipLesson:
        "Takipçiler paniklediğinde bir lider görünür ve sağlam olmalıdır — varlığı saflara güç katar.",
      spiritualLesson:
        "Asla sayıya ya da yakın başarıya dayanma; zafer ve sükûnet yalnızca Allah'tan gelir.",
    },
    quran: [
      {
        excerpt:
          "Allah has already given you victory in many regions — and on the day of Hunayn, when your great numbers pleased you but availed you nothing, and the earth, for all its vastness, closed in on you, and you turned back in retreat. Then Allah sent down His tranquillity upon His Messenger and upon the believers.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Al-Bara ibn Azib was asked whether they had fled on the day of Hunayn. He said: But the Messenger of Allah ﷺ did not flee. The people turned back, and the Prophet ﷺ was on his white mule, and he was saying: I am the Prophet, this is no lie; I am the son of Abd al-Muttalib.",
      },
    ],
    appLinks: [{ label: "Ders: güçte alçakgönüllülük" }],
  },
  {
    title: "Tebük Seferi",
    summary: "Hicri 9, Recep — yaz sıcağında en zorlu yürüyüş; savaşsız iman sınavı.",
    body: [
      "Bağlam ve sebep: Medine'ye kuzey sınırında büyük bir Bizans hareketliliğine dair haberler ulaştı. Peygamber ﷺ Tebük'e bir sefer çağrısı yaptı — ve alışılmadık biçimde, hedefi gizlemek yerine açıkça bildirdi, çünkü yürüyüş öylesine uzun ve zorlu olacaktı ki herkesin dürüstçe hazırlanması gerekiyordu. Bu, yolculuğun ve masrafın en ağır olduğu, yüksek yaz sıcağının şiddetinde, hasat zamanında geldi — \"zorluk seferi\" olarak tanındı.",
      "Fedakârlık sınavı: Bu çağrı, topluluğun kalplerini açığa çıkardı. Osman, ordunun büyük bir kısmını kendi malından donattı; Ebu Bekir sahip olduğu her şeyi verdi; Ömer malının yarısını verdi. Verecek hiçbir şeyi olmayan en yoksul sahabiler, katılamadıkları için ağladı — Kur'an onların gözyaşlarını kaydeder (9:92). Karşılarında ise geride kalmak için bahaneler uyduran ve Tevbe Suresi'nin uzun uzun ifşa ettiği münafıklar duruyordu.",
      "Ne oldu: Peygamber'in ﷺ hiç bu kadar büyük bir orduya önderlik etmediği — belki 30.000 kişilik — ordu, yorucu bir yürüyüşün ardından Tebük'e ulaştı. Savaşmak için hiçbir Bizans kuvveti ortaya çıkmadı. Boş bir sonuç yerine, sefer kuzeydeki sınır kabileleri ve hükümdarlarıyla antlaşmalar sağladı, topluluğun güvenliğini genişletti ve saldırganlığı caydıran bir hazırlığı gösterdi.",
      "Geride kalan üç kişi: Geride kalanlar arasında geçerli bir mazereti olmayan ve önemlisi bu konuda yalan söylemeyi reddeden üç samimi mü'min vardı — Ka'b bin Malik, Hilal bin Ümeyye ve Mürâre bin Rebi'. Tövbeleri kabul edilene ve Kur'an bağışlanmalarını duyurana kadar (9:118) elli gün boykot edildiler; yeryüzü \"genişliğine rağmen\" onlara dar geldi. Sınavdaki dürüstlükleri siyerin en dokunaklı bölümlerinden biridir.",
      "Kalıcı dersler: hiçbir kılıç çekilmese bile topluluğu savunmaya hazır olmak başlı başına bir iman eylemidir; görünür bir ödül olmadan fedakârlık en yüksek sınavlardan biridir; ve doğruluk — Ka'b'ın kendini bir yalanla kurtarmayı reddetmesi — Allah katında rahat bir yalandan daha sevgilidir. Tevbe Suresi tüm seferi bu temalar etrafında çerçeveler.",
    ],
    battleDetails: {
      location: "Bizans sınırına giden yolda Tebük",
      modernLocation: "Tebük, Suudi Arabistan",
      hijriDate: "Hicri 9, Recep",
      muslimForces: "Yaklaşık 30.000 (Peygamber'in ﷺ önderlik ettiği en büyük ordu)",
      opposingForces: "Bir Bizans kuvvetinin haberi vardı ama savaşmak için ortaya çıkmadı",
      muslimCommander: "Peygamber Muhammed ﷺ",
      weather: "Hasat zamanında aşırı yaz sıcağı",
      outcome: "Savaş yok; kuzey antlaşmaları sağlandı; topluluk sınandı ve arındırıldı",
      keyEvents: [
        "Peygamber ﷺ, yürüyüşün zorluğu nedeniyle uzak hedefi açıkça bildirdi.",
        "Osman, Ebu Bekir, Ömer ve diğerleri cömertçe verdi; en yoksullar verecek hiçbir şeyleri olmadığı için ağladı.",
        "Münafıklar geride kalmak için bahaneler uydurdu ve Tevbe Suresi'nde ifşa edildi.",
        "Hiçbir düşman çatışmaya girmedi; kuzeydeki kabile ve hükümdarlarla antlaşmalar sağlandı.",
        "Tövbeleri kabul edilene kadar (Kur'an 9:118) üç dürüst mü'min 50 gün boykot edildi.",
      ],
      leadershipLesson:
        "Zorluk ve bedeli hakkında dürüst ol; şeffaflık güven inşa eder ve istekli olanları hazırlar.",
      spiritualLesson:
        "Görünür bir ödül olmadan fedakârlık ve sınavda doğruluk, imanın en yüksek sınavları arasındadır.",
    },
    quran: [
      {
        excerpt:
          "Those who remained behind rejoiced in their staying behind the Messenger of Allah and disliked to strive with their wealth and their lives in the cause of Allah, and said: Do not go forth in the heat. Say: The fire of Hell is more intense in heat, if only they could understand.",
      },
      {
        excerpt:
          "And He forgave the three who were left behind, until the earth, vast as it was, closed in on them, and their own souls closed in on them, and they were certain there is no refuge from Allah except in Him. Then He turned to them in mercy that they might repent.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ka'b ibn Malik related how he stayed behind from Tabuk without excuse and would not lie about it; the Prophet ﷺ ordered the believers not to speak to him and his two companions for fifty nights, until the earth became narrow for them — then the revelation of their forgiveness came, and it was among the happiest days of his life.",
      },
    ],
    appLinks: [{ label: "Ders: fedakârlık ve samimiyet" }],
  },

  // ── Expeditions ───────────────────────────────────────────────────────────
  {
    title: "Gazveler ve Seriyeler",
    summary: "Büyük seferler ile küçük müfrezeler arasındaki fark.",
    body: [
      "Gazve, Peygamber'in ﷺ bizzat katıldığı bir seferdir — alimler yaklaşık yirmi yedi tane sayar, Bedir, Uhud, Hendek, Hudeybiye, Hayber, Mekke'nin fethi, Huneyn ve Tebük dahil.",
      "Seriyye (çoğulu seraya) ise, Peygamber'in ﷺ katılmadığı, adı belirlenmiş bir kumandan altında gönderilen bir müfrezedir — keşif, baskınlara karşılık verme, koruma ya da kabileleri İslam'a davet etmek için kaydedilen yaklaşık elli böyle sefer vardır.",
      "Birçok seriyyede hiç savaş olmadı — bunlar diplomasi, devriye ya da savaşmayı gereksiz kılan bir güç gösterisiydi. Diğerleri, Mute seferi gibi, ciddi çarpışma ve ağır kayıp içeriyordu.",
      "Bu ayrımı anlamak, erken İslam'daki 'savaş' sayısının abartılmasına karşı korur. Yaklaşık on yıl boyunca, gerçek meydan savaşları azdı; çoğu yürüyüş önleyici, diplomatik ya da kansızdı ve kaynaklar tüm nebevi dönemi, kendi çağı için can kaybı bakımından dikkat çekici derecede hafif olarak değerlendirir.",
    ],
    actions: [
      "Hangi olayların meydan savaşı, hangilerinin kuşatma ve hangilerinin savaşsız yürüyüş olduğunu görmek için zaman çizelgesine göz at.",
      "Kategorileri net tutmak için gazve ve seriyye sözlük maddelerini oku.",
    ],
    appLinks: [{ label: "Sözlük" }, { label: "Zaman çizelgesi" }],
  },

  // ── After the Prophet ﷺ ───────────────────────────────────────────────────
  {
    title: "Peygamber'den ﷺ sonraki savaşlar",
    summary: "Râşit Halifeler döneminin büyük çatışmaları — nebevi dönemden ayrı.",
    body: [
      "Peygamber ﷺ Hicri 11'de (M. 632) vefat ettikten sonra topluluğa Halifeler Ebu Bekir, Ömer, Osman ve Ali (Allah hepsinden razı olsun) önderlik etti; bu dönem Ridde (dinden dönme) savaşlarını, Sasani Fars'ına ve Bizans Suriye'sine yayılmayı ve nihayetinde iç fitneyi kapsadı.",
      "Bu olaylar İslam tarihine aittir, fakat Peygamber'in ﷺ kendi eylemleri gibi Sünnet değildir. Bunlar tarihin araçlarıyla ve Müslüman alimlerin bizzat ayrıntıları, saikleri ve dersleri tartıştığının bilinciyle incelenmelidir.",
      "Kadisiye Savaşı (yaklaşık M. 636): Sa'd bin Ebu Vakkas, Irak'ta Sasani ordusuna karşı Müslüman kuvvetlerine önderlik etti — Fars'ın kapısını açan bir dönüm noktası.",
      "Yermük Savaşı (M. 636): Halid bin Velid'in de aralarında bulunduğu kumandanlar, Suriye'de Bizans'ın alan gücünü sona erdiren belirleyici bir seferle Bizanslılarla karşılaştı — nebevi Sünnet olarak değil, askeri tarih olarak incelenir.",
      "Nihavend Savaşı (yaklaşık M. 642): Arapça kaynaklarda 'fethin fethi' olarak anılır, kalan Sasani direnişini kırdı. Tarihçiler arasında tarihler ve rakamlar farklılık gösterir.",
    ],
    actions: [
      "Önce nebevi savaşları incele — bunlar temel ahlaki ve hukuki referanstır.",
      "Sonraki fetihlere incelikle yaklaş; ne savaşı yücelt ne de karmaşık bir tarihi sloganlara indirge.",
    ],
    disclaimer:
      "Peygamber sonrası fetihlerin rakamları, saikleri ve ahlaki değerlendirmeleri tarihçiler arasında tartışmalıdır. Bu özet yönlendirme içindir, tartışma için değil.",
  },

  // ── Wisdom ────────────────────────────────────────────────────────────────
  {
    title: "Liderlik dersleri",
    summary: "Sabır, şûra, merhamet ve Allah'a güven — yalnızca taktik değil.",
    body: [
      "Çatışmada nebevi liderlik modeli, karakteri kurnazlığın üstüne koyar. Büyük kararlar danışma (şûra) yoluyla alınırdı — Bedir'deki kuyular, Müttefikler kuşatmasındaki hendek, Hudeybiye'deki şartlar — vahyin sonucu daha sonra doğrulayacağı yerlerde bile. Liderlik, harekete geçmeden önce dinlerdi.",
      "Sabır her zaferin çizgilerini şekillendirdi. Hudeybiye'nin zor barışı, iki yıl içinde Mekke'nin Fethi'ne yol açtı. Mekke'deki merhamet — \"Gidin, özgürsünüz\" — topluluğa zulmeden aynı insanları kazandı. Uhud'da öğrenilen acı disiplin, o felaketin tekrarını önledi.",
      "Cesaret kılıçta gösterildiği kadar kılıç dışında da gösterildi: Huneyn'de ordu kaçarken sağlam ve görünür durmak; hendekte kazıcılarla birlikte toprak taşımak; ve — en zoru — tam iktidar anında bir zamanlar seni yurdundan çıkaranları affetmek.",
      "Allah'a güven (tevekkül) hiçbir zaman imkânları ihmal etmek anlamına gelmedi. Casuslar gönderildi, arazi seçildi, zırh giyildi, hendekler kazıldı, ardıllar belirlendi ve antlaşmalara sadık kalındı. Mü'minler güçleri dahilinde ellerinden geleni yaptı ve sonra sonucu Allah'a bıraktı — tam çaba ile tam güvenin bu birleşimi modelin özüdür.",
    ],
    actions: [
      "Zor bir karardan önce sor: Gerçekten bilgi sahiplerine danıştım mı?",
      "Bir başarıdan sonra sor: Merhamet mi gösteriyorum, yoksa bu kibre mi dönüştü?",
      "Bir sektede sor: Düzeltilmesi gereken bir itaatsizlik mi var, yoksa Allah'ın benim öğrenmemi istediği bir ders mi?",
    ],
    appLinks: [{ label: "Ders kartları" }],
  },

  // ── Evidence ──────────────────────────────────────────────────────────────
  {
    title: "Savaşlar üzerine sahih hadisler",
    summary: "Derecelendirmeyle seçilmiş rivayetler — davranış, sabır ve önemli olaylar üzerine.",
    body: [
      "Seferler hakkındaki hadislere güvenmeden önce sağlamlıkları kontrol edilmelidir. Aşağıdaki rivayetler sahih koleksiyonlardan alınmıştır ve bu seferlerin davranışı ve ruhuyla ilgilidir; her biri kendi derecesini taşır.",
      "Belirli bir savaşla ilgili rivayetler için o savaşın kendi konusuna bakın. Bağlam içinde tam senetleri ve derecelendirmeyi okumak için Munib'in hadis tarayıcısını kullanın.",
    ],
    hadith: [
      {
        excerpt:
          "Do not wish to meet the enemy, and ask Allah for safety. But when you meet them, be patient, and know that Paradise lies under the shade of the swords.",
      },
      {
        excerpt:
          "The Prophet ﷺ said: War is deceit. — Scholars explain this as permission for tactical stratagem in battle (feints, surprise, misdirection), never as licence to break a treaty or betray a protected party.",
      },
      {
        excerpt:
          "When appointing a commander the Prophet ﷺ charged him to fear Allah, to invite the enemy to Islam before fighting, not to break a pledge, not to mutilate, and not to kill a child.",
      },
    ],
    appLinks: [{ label: "Hadislere göz at" }],
  },
  {
    title: "Referanslar ve kaynaklar",
    summary: "Klasik siyer eserleri ve bunların eleştirel biçimde nasıl okunacağı.",
    body: [
      "Başlıca siyer kaynakları arasında İbn İshak'ın Sîret'i (İbn Hişam eliyle korunmuş), Vâkidî'nin Kitâbü'l-Megâzî'si, İbn Sa'd'ın Tabakât'ı ve İbn Kesir'in el-Bidâye ve'n-Nihâye'si bulunur. Her birinin kendi güçlü yönleri ve kendi ilmî çekinceleri vardır.",
      "İbn İshak (İbn Hişam aracılığıyla) temel anlatıdır; Vâkidî zengin savaş ayrıntısı verir ama bazı rivayetleri hadis eleştirmenlerince tartışmalıdır; İbn Kesir tarihi hadis eleştirisiyle birleştirir ve derecelendirmede özenlidir.",
      "Bu olaylara dair Kur'ani pasajlar en yetkili metinlerdir. Davranış, hukuk ve ahlak sorularında, Buhari ve Müslim'in sahih hadisleri doğrulanmamış siyer rivayetlerine önceliklidir.",
      "Tarihçilerin ayrıldığı yerlerde — kesin ordu büyüklükleri, bazı tarihler ve bazı Peygamber sonrası seferlerin ahlaki değerlendirmesi üzerine — bu modül, sahte bir kesinlik uydurmak yerine belirsizliği belirtir. Burada aktarılan her hadis, numarası ve derecesi için koleksiyonlara karşı kontrol edildi.",
    ],
    actions: [
      "Herhangi bir savaş ayrıntısını önce Kur'an'a, sonra sahih hadise, sonra siyere karşı kontrol et.",
      "Herhangi bir fetva ya da güncel uygulama sorusu için yetkin alimlere danış — bu modül eğitim amaçlıdır, bir fetva değildir.",
    ],
    appLinks: [{ label: "Siret zaman çizelgesi" }, { label: "Kur'an ayetleri" }],
  },
];

// Post-prophetic battle details supplemental overlay (BATTLES_AFTER_PROPHET).
export const BATTLES_AFTER_PROPHET_TR: DeepPartial<{
  title: string;
  body: string;
  location: string;
}>[] = [
  {
    title: "Kadisiye Savaşı",
    body: "Sa'd bin Ebu Vakkas, Irak'ta Sasani ordusuna karşı Müslüman kuvvetlerine önderlik etti. Bu zafer Fars'ı İslam'a açtı; kesin ordu rakamları ve bireysel kumandanların rolü klasik tarihlerde tartışılır.",
    location: "Kadisiye yakınında, Irak",
  },
  {
    title: "Yermük Savaşı",
    body: "Halid bin Velid ve diğer kumandanlar, Suriye'de Bizans ordusuyla karşılaştı. Levant'ta Bizans'ın büyük alan gücünü sona erdiren kesin bir Müslüman zaferi — nebevi Sünnet olarak değil, askeri bir sefer olarak incelenir.",
    location: "Yermük Nehri, Ürdün/Suriye",
  },
  {
    title: "Nihavend Savaşı",
    body: "Arapça kaynaklarda 'fethin fethi' olarak anılır — kalan Sasani direnişini kırdı. Fars İmparatorluğu'nun fiilen sona erişini işaret eder; tarihler ve ayrıntılar tarihçiler arasında hafifçe farklılık gösterir.",
    location: "Nihavend, İran",
  },
];

export const BATTLES_VERSES_TR: DeepPartial<BattlesVerse>[] = [
  {
    excerpt:
      "Permission is given to those who fight because they have been wronged… Had Allah not checked one set of people by means of another, monasteries, churches, synagogues, and mosques would have been destroyed.",
    context: "Savaşa ilk genel izin — Mekke'de yıllarca süren silahsız zulmün ardından.",
  },
  {
    excerpt:
      "Fight in the way of Allah those who fight you, but do not transgress. Indeed, Allah does not like transgressors.",
    context: "Temel sınır: yalnızca savunma ve sınırları aşmanın kesin yasağı.",
  },
  {
    excerpt:
      "When you asked your Lord for help, He answered: I will reinforce you with a thousand angels, rank upon rank.",
    context: "Bedir hakkında indi — sayıca az mü'minlere ilahi yardım.",
  },
  {
    excerpt:
      "There has already been for you a sign in the two armies that met — one fighting in the way of Allah and another of disbelievers, seeing them twice their number with their eyes.",
    context:
      "Allah, Bedir'de Müslümanları düşmanın gözünde daha büyük gösterdi ve kalpleri güçlendirdi.",
  },
  {
    excerpt:
      "Allah had certainly fulfilled His promise to you when you were killing them by His permission, until you lost courage and fell to disputing about the order and disobeyed after He had shown you that which you love.",
    context: "Okçuların itaatsizliğini ve Uhud'daki dönüm noktasını ele alır.",
  },
  {
    excerpt:
      "O you who believe, remember the favour of Allah upon you when armies came to you and We sent against them a wind and armies you did not see.",
    context: "Ahzâb Suresi, Müttefikler kuşatması ve ilahi yardım hakkında.",
  },
  {
    excerpt:
      "And He brought down those of the People of the Scripture who supported them from their fortresses and cast terror into their hearts — a party you killed, and a party you took captive. And He caused you to inherit their land and their homes.",
    context:
      "Ahzâb Suresi, kuşatma sırasında sözleşmeyi bozan Benî Kurayza hakkında — bir dine karşı hüküm değil, sınırlı bir savaş zamanı ihaneti vakası.",
  },
  {
    excerpt:
      "Indeed, We have given you a manifest victory, that Allah may forgive you what preceded of your sin and what will follow, complete His favour upon you, and guide you to a straight path.",
    context:
      "Hudeybiye'den dönüşte indi — sahabenin önce acı bir uzlaşma olarak hissettiğini apaçık bir zafer olarak adlandırır.",
  },
  {
    excerpt:
      "Certainly was Allah pleased with the believers when they pledged allegiance to you under the tree, and He knew what was in their hearts, so He sent down tranquillity upon them and rewarded them with an imminent conquest.",
    context:
      "Rıdvan Biatı — yaklaşık 1400 sahabi bir akasya ağacının altında kaçmamaya biat etti ve Allah onlardan razı olduğunu bildirdi.",
  },
  {
    excerpt:
      "When the victory of Allah has come and the conquest, and you see the people entering the religion of Allah in multitudes, then exalt with praise of your Lord and ask His forgiveness. Indeed, He is ever Accepting of repentance.",
    context:
      "Mekke'nin açılışı üzerine Nasr Suresi — övünçle değil, hamd, bağışlanma dileme ve dine akın akın giren kalabalıklarla taçlanan bir zafer.",
  },
  {
    excerpt:
      "Allah has already given you victory in many regions… Then Allah sent down His tranquillity upon His Messenger and upon the believers.",
    context:
      "Allah, mü'minlere zaferin kendisinden bir bağış olduğunu, sayıca övünmenin sonucu olmadığını hatırlatır.",
  },
  {
    excerpt:
      "Those who remained behind rejoiced in their staying behind the Messenger of Allah and disliked to strive with their wealth and their lives in the cause of Allah.",
    context: "Tevbe Suresi, Tebük'ün zorlu yürüyüşünden kendilerini muaf tutanlara seslenir.",
  },
];

export const BATTLES_TIMELINE_TR: DeepPartial<BattlesTimelineEvent>[] = [
  {
    title: "İlk vahiy",
    body: "Peygamber ﷺ, Hira Mağarası'nda Alak Suresi'nin ilk ayetlerini alır. Yıllarca çağrı barışçıldır — savaşmaya hiçbir izin yoktur.",
    location: "Mekke",
  },
  {
    title: "Açık davet ve zulüm",
    body: "Açık tebliğ işkence, boykot ve şehadet getirir. Müslümanlar silahlı karşılık vermeden katlanır — sabır ve hicret öğretilen tepkilerdir.",
    location: "Mekke",
  },
  {
    title: "Medine'ye Hicret",
    body: "Müslüman topluluk Yesrib'de (Medine) bir devlet kurar. Yahudi kabileleriyle antlaşmalar ve Medine Sözleşmesi bir arada yaşama kurallarını belirler.",
    location: "Medine",
  },
  {
    title: "Bedir Savaşı",
    body: "17 Ramazan'da yaklaşık 313 Müslüman, çok daha büyük bir Kureyş ordusunu yener — ilk büyük savaş ve kesin bir ahlaki zafer.",
    location: "Bedir",
  },
  {
    title: "Uhud Savaşı",
    body: "Müslümanlar başlangıçta üstünlük kazanır, fakat okçuların mevzilerini terk etmesi acı bir sekteye yol açar. Kur'an o günün derslerini ele alır.",
    location: "Uhud Dağı",
  },
  {
    title: "Hendek Savaşı",
    body: "Müttefik bir ordu Medine'yi kuşatır. Hendek kazmak — Selman'ın önerisi — hiçbir meydan savaşı olmadan kuşatmayı kırar.",
    location: "Medine",
  },
  {
    title: "Benî Kurayza",
    body: "Kuşatma sırasında Medine Sözleşmesi'ni bozan Benî Kurayza teslim olur ve kendi seçtikleri bir hakem olan Sa'd bin Muaz tarafından yargılanmayı ister.",
    location: "Medine",
  },
  {
    title: "Hudeybiye Antlaşması",
    body: "Bir taviz gibi görünen on yıllık bir ateşkes, Kur'an'ın ifadesiyle apaçık bir zafere dönüştü — ağacın altında Rıdvan Biatı verildi, din değiştirmeler yayıldı ve Mekke'nin yolu açıldı.",
    location: "Hudeybiye",
  },
  {
    title: "Mute Savaşı",
    body: "Roma sınırına bir sefer; Halid bin Velid orduyu güvenle geri getirmeden önce üç belirlenmiş kumandan peş peşe şehit olur.",
    location: "Mute",
  },
  {
    title: "Hayber Seferi",
    body: "Medine'nin kuzeyinde düşmanlık besleyen Yahudi kaleleri boyun eğdirilir. Ebu Bekir ve Ömer denendikten sonra sancak Ali bin Ebu Talib'e verilir.",
    location: "Hayber",
  },
  {
    title: "Mekke'nin Fethi",
    body: "Kureyş antlaşmayı bozar; Peygamber ﷺ on bin sahabiyle yürür ve Mekke'ye neredeyse kan dökülmeden girer — genel af ilan edilir.",
    location: "Mekke",
  },
  {
    title: "Huneyn Savaşı",
    body: "Havazin ve Sakif, Mekke'den sonra Müslümanlara pusu kurar. Peygamber ﷺ mü'minleri etrafında toplanmaya çağırınca ilk panik zafere dönüşür.",
    location: "Huneyn",
  },
  {
    title: "Tebük Seferi",
    body: "Roma sınırına doğru zorlu bir yaz yürüyüşü. Savaş olmaz, fakat münafıklık ifşa olur ve Tevbe Suresi geride kalanlara seslenir.",
    location: "Tebük",
  },
  {
    title: "Veda Haccı",
    body: "Peygamber ﷺ hac yapar ve Veda Hutbesi'ni verir. Kısa süre sonra Medine'de vefat eder — nebevi savaşlar dönemi kapanır.",
    location: "Mekke",
  },
];

export const BATTLES_FIGURES_TR: DeepPartial<BattlesFigure>[] = [
  {
    name: "Ebu Bekir es-Sıddîk",
    epithet: "Allah ondan razı olsun",
    summary:
      "Peygamber'in ﷺ en yakın sahabisi, ilk yetişkin erkek mü'min ve Hicret'teki yol arkadaşı.",
    role: "Erken seferlerde danışman, savaşçı ve sancaktar.",
    lesson:
      "Baskı altında sarsılmaz sadakat ve doğruluk — herhangi bir zaferden önce zulme uğrayan Müslümanları özgürleştirmek için malını harcadı.",
  },
  {
    name: "Ömer bin Hattab",
    epithet: "Allah ondan razı olsun",
    summary: "Zulüm yıllarında İslam'a girdi ve dinin en güçlü savunucularından biri oldu.",
    role: "Savaşçı ve daha sonra ikinci Halife olarak adaletin mimarı.",
    lesson:
      "Hesap verebilirlikle birleşen cesaret — Hudeybiye'de görüşü Peygamber'inkinden farklıyken açıkça öğüdü kabul etti.",
  },
  {
    name: "Ali bin Ebu Talib",
    epithet: "Allah ondan razı olsun",
    summary: "Peygamber'in ﷺ amcaoğlu ve damadı; İslam'ı kabul eden ilk çocuklardan.",
    role: "Teke tek çarpışmanın yiğidi ve Hayber'de sancaktar.",
    lesson:
      "Alçakgönüllülükle birleşen yiğitlik — Hicret gecesi Peygamber'in ﷺ yatağında uyudu, misyonun sürebilmesi için canını tehlikeye attı.",
  },
  {
    name: "Hamza bin Abdülmuttalib",
    epithet: "Allah ondan razı olsun",
    summary:
      "Peygamber'in ﷺ amcası, İslam'ı kabul ettikten sonra Esedullah (Allah'ın Aslanı) diye tanındı.",
    role: "Bedir ve Uhud'da seçkin savaşçı ve moral lideri.",
    lesson:
      "Şehitlik yenilgi değildir — Uhud'daki şehadeti Peygamber'i ﷺ derinden üzdü ama misyonu tamamlama kararlılığını güçlendirdi.",
  },
  {
    name: "Halid bin Velid",
    epithet: "Allah ondan razı olsun",
    summary:
      "Hudeybiye'den sonra İslam'ı kabul edip Seyfullah (Allah'ın Kılıcı) olan parlak bir Kureyş generali.",
    role: "İslam'ından önce Uhud'da Müslümanlara karşı pergâr süvarisine önderlik etti; sonra Mute'de komutayı devraldı ve hilafet seferlerinde belirleyici oldu.",
    lesson:
      "Geçmiş muhalefet samimi tövbenin önünde engel değildir — Uhud'da Müslümanlara vuran aynı yetenek, iman kalbe girer girmez tamamen Allah yoluna yöneltildi.",
  },
  {
    name: "Sa'd bin Ebu Vakkas",
    epithet: "Allah ondan razı olsun",
    summary: "Cennetle müjdelenen on kişiden biri; topluluğun ünlü okçusu.",
    role: "Uhud'da okçu; sonradan Halife Ömer döneminde Kadisiye'de Müslüman ordularına önderlik etti.",
    lesson:
      "Kendi rolünde disiplin — okçuluk hizmetinin damgası oldu; sonra aynı isabeti bir ulusun liderliğine taşıdı.",
  },
  {
    name: "Selman el-Farisi",
    epithet: "Allah ondan razı olsun",
    summary:
      "Uzun bir manevi yolculuğun ardından Medine'de Müslümanlara katılan Fars'lı bir hak arayıcısı.",
    role: "Hendek kazmayı önerdi — Araplara yabancı bir Fars taktiği.",
    lesson:
      "Hikmet her geçmişten gelebilir — şûra, uzmanlığı Allah'ın onu koyduğu yerde dinlemek demektir.",
  },
  {
    name: "Zeyd bin Harise",
    epithet: "Allah ondan razı olsun",
    summary:
      "Peygamber'in ﷺ azatlısı ve sevgili sahabisi ve bir Müslüman orduya atanan ilk kumandan.",
    role: "Mute seferine önderlik etti; belirlenen üç kumandan içinde ilk düşen o oldu.",
    lesson:
      "Soydan üstün liyakat — daha yüksek kabile mertebesindeki insanlar mevcutken liderliğe seçildi.",
  },
  {
    name: "Sa'd bin Muaz",
    epithet: "Allah ondan razı olsun",
    summary: "Medine'nin Evs kabilesinin reisi, Ensar'ın en eski ve saygın isimlerinden biri.",
    role: "Hendek'te yaralandı; Benî Kurayza tarafından kaderlerinin hakemi olarak seçildi.",
    lesson:
      "Kararlaştırılmış bir hakem eliyle adalet — yenilmiş bir düşman bile dizginsiz intikam yerine tarafsız bir hakem buldu; kısa süre sonra yarasından vefat etti.",
  },
];

export const BATTLES_LESSON_CARDS_TR: DeepPartial<BattlesLessonCard>[] = [
  {
    battleTitle: "Bedir Savaşı",
    lesson: "Tam hazırlıkla birlikte Allah'a güven.",
    detail:
      "Yaklaşık üçe bir sayıca az olsalar da Müslümanlar kuyularda kendi arazilerini seçti, saflarını düzenledi ve dua etti — Peygamber ﷺ cübbesi düşene kadar gece boyu Allah'a yalvardı. Çaba ve güven bir arada, zafer ise Allah'a nispet edildi.",
  },
  {
    battleTitle: "Uhud Savaşı",
    lesson: "Emre itaat topluluğu korur.",
    detail:
      "Ganimet peşinde mevzisini terk eden okçular, orduyu neredeyse yok eden bir açık kapı bıraktı. Kur'an bunu her nesil için disiplin dersi olarak kaydeder.",
  },
  {
    battleTitle: "Hendek Savaşı",
    lesson: "Planlama ve danışma gücü kat kat artırır.",
    detail:
      "Selman'ın hendek fikri, Peygamber'in şûrasıyla ve mü'minlerin emeğiyle birleşince, savunanlardan çok daha büyük bir koalisyonu etkisiz hale getirdi.",
  },
  {
    battleTitle: "Hudeybiye Antlaşması",
    lesson: "Sabır en gerçek zafer olabilir.",
    detail:
      "Sahabe ateşkesi bir aşağılanma olarak hissetti ve Ömer bunu açıkça sorguladı; Fetih Suresi bunu apaçık bir zafer diyerek yanıtladı. On yıllık barış yolları açtı, İslam her zamankinden hızlı yayıldı ve sadece iki yıl içinde Mekke'nin yolu açıldı.",
  },
  {
    battleTitle: "Benî Kurayza",
    lesson: "Koruma sözleşmesini bozmak en ağır ihanetler arasındadır.",
    detail:
      "Benî Kurayza, Müttefikler şehri kuşatırken tam o anda Medine Sözleşmesi'ni yırttı. Yine de Peygamber ﷺ onların kendi seçtikleri bir hakem tarafından yargılanmasına izin verdi — dizginsiz intikam değil, kararlaştırılmış bir hakem eliyle adalet.",
  },
  {
    battleTitle: "Mekke'nin Fethi",
    lesson: "Zaferden sonraki merhamet bir fatihi yüceltir.",
    detail:
      "Kendisine işkence eden ve onu kovan şehir artık merhametindeyken, Peygamber ﷺ Hz. Yusuf'un sözlerini yankıladı: 'Bugün size kınama yok — gidin, özgürsünüz.' İntikamın yerini genel bir af aldı ve hiçbir cezanın kazanamayacağı kalpler kazanıldı.",
  },
  {
    battleTitle: "Huneyn Savaşı",
    lesson: "Sayı ve yakın başarı zaferi garanti etmez.",
    detail:
      "Mekke'den sonra ordunun büyüklüğüyle övünmek başlangıçtaki paniğe katkıda bulundu. Mü'minler ancak Peygamber'e ﷺ ve Allah'a döndüklerinde yeniden toparlandı.",
  },
  {
    battleTitle: "Tebük Seferi",
    lesson: "Zorlukta fedakârlık gerçek imanı ortaya çıkarır.",
    detail:
      "Yürüyüş, güçlü bir düşmana karşı kavurucu sıcakta gerçekleşti. Malını verenler ile yoksulluğa rağmen yola çıkanlar aynı ölçüde övüldü.",
  },
  {
    battleTitle: "Mute Savaşı",
    lesson: "Liderlik ardıllığı planlanmalıdır.",
    detail:
      "Peygamber ﷺ üç kumandanı ardıllık sırasıyla belirledi. Üçü de düşünce, Halid geri çekilişi düzenledi — orduyu kurtarmak başlı başına bir zaferdi.",
  },
];

export const BATTLES_GLOSSARY_TR: DeepPartial<BattlesGlossaryTerm>[] = [
  {
    term: "Gazve",
    definition:
      "Peygamber'in ﷺ bizzat katıldığı askeri bir sefer. Örnekleri arasında Bedir, Uhud ve Tebük vardır.",
  },
  {
    term: "Seriyye",
    definition:
      "Peygamber'in ﷺ yürüyüşe katılmadığı, bir kumandan altında gönderilen bir müfreze. Onlarcası keşif, diplomasi ya da baskınlara karşılık vermek için gerçekleşti.",
  },
  {
    term: "Muhacir",
    definition:
      "Allah rızası için Mekke'yi bırakıp Medine'ye gelen göçmenler. Ensar ile birlikte erken Müslüman topluluğun çekirdeğini oluşturdular.",
  },
  {
    term: "Ensar",
    definition:
      "Yardımcılar — Muhacirleri ağırlayan, mallarını paylaşan ve erken yıllarda şehri savunan Medineli Müslümanlar.",
  },
  {
    term: "Şûra",
    definition:
      "Büyük kararlardan önce karşılıklı danışma. Hendek stratejisi ve Uhud hazırlıkları nebevi modeldeki danışmayı örnekler.",
  },
  {
    term: "Biat",
    definition:
      "Bir bağlılık yemini — lidere siyasi ve manevi itaat. Akabe Biatları Hicret'ten önce gerçekleşti.",
  },
  {
    term: "Hicret",
    definition:
      "Allah rızası için göç etmek — nebevi bağlamda Mekke'den Medine'ye. Hicri 1. yıl bu göçle başlar.",
  },
  {
    term: "Emir",
    definition:
      "Bir ordu ya da sefer için atanan kumandan ya da lider. Peygamber ﷺ seriyeler için liderler atadı ve düşmeleri halinde ardıllar belirledi.",
  },
  {
    term: "Raye",
    definition:
      "Ordunun önünde taşınan bir bayrak ya da sancak. Peygamber'in ﷺ sancağını taşımak bir onur ve sorumluluk işaretiydi.",
  },
  {
    term: "Livâ",
    definition:
      "Bazen kişisel rayeden farklı olan daha büyük bir ordu sancağı. Bir livâya önderlik etmek, büyük bir kuvvet üzerinde komutayı gösterirdi.",
  },
  {
    term: "Cihad",
    definition:
      "Allah yolunda çaba göstermek — öncelikle nefsin mücadelesi ve düzenlenmiş askeri biçiminde, emredildiğinde savunma ve saldırganlığın giderilmesi.",
  },
  {
    term: "Fi sebilillah",
    definition:
      "Allah yolunda — meşru mücadeleyi kabile husumetinden ya da dünyevi fetihten ayıran niyet.",
  },
  {
    term: "Emân",
    definition:
      "Elçilere, tüccarlara ya da savaşçı olmayanlara verilen güvenlik ya da güvenli geçiş garantisi. İslam savaş hukukunda emânı ihlal etmek haramdır.",
  },
  {
    term: "Sulh",
    definition:
      "Bir ateşkes ya da barış antlaşması. Hudeybiye Antlaşması, daha büyük bir hayır için barışı seçmenin en üstün örneğidir.",
  },
  {
    term: "Fetih",
    definition:
      "Açılış ya da fetih — genellikle şiddetli bir kuşatma yerine Mekke'nin barışçıl açılışı (Fethu Mekke) için kullanılır.",
  },
];
