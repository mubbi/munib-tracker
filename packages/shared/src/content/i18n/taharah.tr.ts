import type { TaharahChecklistItem, TaharahTopic } from "../../types/taharah";
import type { DeepPartial } from "./localize";

// Turkish translation overlay for the Learn Taharah content. Mirrors the order of
// TAHARAH_TOPICS in ../taharah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations, grades and Qur'an verse labels stay in English.

export const TAHARAH_TOPICS_TR: DeepPartial<TaharahTopic>[] = [
  // ── Intro ────────────────────────────────────────────────────────────────
  {
    title: "Tahârete Giriş",
    summary: "Temizlik, namazın kapısı ve müminin imanının yarısıdır.",
    body: [
      "Tahâret (طهارة) temizlik demektir: Bir Müslümanın, Allah'ın kabul edeceği bir hâlde O'nun huzurunda durabilmesi için bedeni, elbiseyi ve namaz kılınacak yeri hükmî ve maddî kirlerden arındırmaktır. İbadeti öğrenen kişinin ilk öğrendiği konu budur; çünkü tahâret olmadan hiçbir namaz sahih olmaz: Peygamber ﷺ, 'Namazın anahtarı temizliktir' buyurmuştur.",
      "İslam'da temizliğin iki boyutu vardır. Dış boyutu somut temizliktir: yıkamak, pisliği gidermek, temiz kalmak. İç boyutu ise yıkanmanın uyandırması gereken tevazu, bilinç ve kalbin hazır oluşudur. Peygamber ﷺ temizliği 'imanın yarısı' olarak nitelendirerek bu ikisini birbirine bağlamış, bedenin temizliğini ruhun günahlardan arınmasıyla bir arada zikretmiştir.",
      "Bu modül konunun tamamını sırasıyla ele alır: temizlenmede kullanılan su, abdest (küçük temizlik), gusül (bütün bedenin yıkandığı boy abdesti), teyemmüm (su kullanılamadığında toprakla temizlenme), necaset (maddî pisliğin giderilmesi) ve özel durumlar ile ruhsatlar. Bunu bir kez iyice öğrendiğinizde namaza şüpheyle değil, gönül rahatlığıyla durabilirsiniz.",
    ],
    quran: [
      {
        excerpt:
          "Ey iman edenler! Namaza kalktığınız zaman yüzlerinizi ve dirseklere kadar kollarınızı yıkayın, başlarınızı meshedin ve topuk kemiklerine kadar ayaklarınızı yıkayın.",
      },
      {
        excerpt: "Şüphesiz Allah, çokça tövbe edenleri sever ve temizlenenleri sever.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Namazın anahtarı temizliktir; başlangıcı tekbir, sonu selamdır. (Hz. Ali; ayrıca Tirmizî 3)",
      },
    ],
    actions: [
      "Temizliği aceleyle geçiştirilen bir alışkanlık olarak değil, Allah'ın huzuruna çıkmaya hazırlık olarak görün.",
      "Bütün akış size doğal gelene kadar her gün bir tahâret konusu çalışın.",
    ],
    appLinks: [{ label: "Namazı Öğren merkezi" }],
  },
  {
    title: "Temizliğin Önemi",
    summary: "Temizlik, namazın kesin bir şartı ve müminin alametidir.",
    body: [
      "Temizlik birçok seçenekten biri değildir; namazın sahih olmasının şartıdır. Allah, hades hâlindeki kişinin namazını o kişi temizlenene kadar kabul etmez. Bu yüzden geçerli bir abdest veya gusül olmadan kılınan namaz, ne kadar samimi olursa olsun yeniden kılınmalıdır.",
      "Peygamber ﷺ temizliği müminin belirleyici bir vasfı hâline getirmiş ve onu 'imanın yarısı' olarak nitelendirmiştir. Düzenli temizlik insanı disipline eder, onu neredeyse her an ibadete hazır tutar ve — hadisin öğrettiği üzere — küçük günahları suyla birlikte adeta yıkayıp götürür.",
      "Tahâret namazı koruduğu için, mümini de dikkatsizlik yüzünden geçersiz namaz kılma günahından korur. Bu nedenle hükümlerini iyi öğrenmek, İslam'daki en büyük amellerden birini korumak demektir.",
    ],
    hadith: [
      {
        excerpt: "Temizlik imanın yarısıdır. (Ebû Mâlik el-Eş'arî)",
      },
      {
        excerpt:
          "Allah temizlik olmadan kılınan namazı da, çalıntı maldan verilen sadakayı da kabul etmez. (İbn Ömer)",
      },
    ],
    actions: [
      "Her namazdan önce, başlamadan temiz olduğunuzdan emin olun.",
      "Zihninizde basit bir kontrol listesi tutun: beden, elbise, yer ve abdest.",
    ],
  },
  {
    title: "Temizliğin Çeşitleri",
    summary: "Bilinmesi gereken üç durum: küçük hades, büyük hades ve maddî necaset.",
    body: [
      "İslam hukuku, temizlenmeniz gerekebilecek üç durumu birbirinden ayırır ve her birinin kendine özgü bir çaresi vardır. Hangi durumda olduğunuzu bilmek, doğru yöntemi seçmenin anahtarıdır.",
      "Küçük hades (hades-i asgar), tuvalete gitmek, yel çıkarmak veya derin uyku gibi olağan durumlardan kaynaklanır. Abdestle, su kullanılamadığında ise teyemmümle giderilir.",
      "Büyük hades (hades-i ekber, cünüplük olarak da bilinir); cinsel ilişki, cinsel sıvının gelmesi ve hayız ya da nifas kanının sona ermesiyle meydana gelir. Bütün bedenin yıkandığı gusülle giderilir; su bulunmadığında veya zarar verdiğinde yine teyemmüm onun yerini tutar.",
      "Maddî pislik (necaset) — idrar, dışkı veya akan kan gibi — ayrı bir konudur: Hükmî durumunuz ne olursa olsun bedenden, elbiseden ve namaz kılınan yerden fiilen giderilmesi gerekir. Dört Sünnî mezhep bu üç kategoride ittifak eder; yalnızca temizliği neyin bozduğu veya hangi az miktarların affedildiği gibi bazı ayrıntılarda ayrılır.",
    ],
    quran: [
      {
        excerpt:
          "Eğer cünüp iseniz, iyice temizlenin. Şayet hasta veya yolculukta iseniz… ve su bulamamışsanız, temiz bir toprakla teyemmüm edin.",
      },
    ],
    actions: [
      "Önce durumunuzu belirleyin (küçük hades, büyük hades veya necaset), sonra doğru yöntemi uygulayın.",
      "Ayrıntılardan emin olamadığınızda, tanınmış bir mezhepten ehil bir hocayı tutarlı biçimde takip edin.",
    ],
  },

  // ── Water ────────────────────────────────────────────────────────────────
  {
    title: "İslam'da Su",
    summary: "Temiz su, temizlenmenin asıl aracıdır — eksiksiz kullanılır ama asla israf edilmez.",
    body: [
      "Temizlenmenin asıl aracı sudur. Allah yağmurun 'tertemiz' (tahûr) olarak indirildiğini bildirir; yani hem temizleyen hem de ibadette kullanılabilen bir sudur. Yağmur, nehir, deniz, kaynak, kuyu veya musluk suyu gibi doğal olarak temiz olan her su, içine karışan bir necaset rengini, tadını veya kokusunu değiştirmedikçe temizleyicidir.",
      "Fakihler suyu ayrıntılı biçimde sınıflandırır (hem temiz hem temizleyici, temiz ama temizleyici olmayan ve necis), ancak günlük hayat için pratik kural basittir: Su, bir necaset onu açıkça değiştirmedikçe abdest ve gusül için elverişli kalır. Gerçek bir şüphe olduğunda ve temiz bir alternatif mevcutsa, o alternatifi kullanın.",
      "İslam israfa kaçmadan eksiksizliği öğretir. Peygamber ﷺ tam olarak yıkanır ama şaşırtıcı derecede az su kullanırdı: abdest için yaklaşık bir müd (iki avuç dolusu), tam bir gusül için de bir sâ' (yaklaşık dört müd). Su bol olsa bile israf hoş görülmez; çünkü ölçülülük de ibadet adabının bir parçasıdır.",
    ],
    quran: [
      {
        excerpt: "Ve gökten tertemiz bir su indirdik.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Peygamber ﷺ bir müd su ile abdest alır, bir sâ' ile beş müd arası su ile gusül ederdi. (Enes; ayrıca Müslim 325 — ölçülülük sünneti)",
      },
    ],
    actions: [
      "İyice yıkanmaya yetecek kadar su kullanın, ama musluğu kısın ve aşırılıktan kaçının.",
      "Bir su kaynağının görünüşü veya kokusu necaset yüzünden değişmiş görünüyorsa, açıkça temiz olan en yakın kaynağı arayın.",
    ],
    disclaimer:
      "Sıkça aktarılan 'akan bir nehrin kenarında bile suyu israf etme' rivayeti (İbn Mâce 425) âlimlerin çoğunluğuna göre zayıftır; ölçülülük sünneti ise yukarıdaki müd/sâ' hadisiyle sabittir.",
  },

  // ── Wudu ─────────────────────────────────────────────────────────────────
  {
    title: "Abdest Nedir?",
    summary: "İbadetten önce küçük hadesi gideren dinî temizlik.",
    body: [
      "Abdest (وضوء), belirli uzuvların belirli bir sırayla yıkanması olup küçük hadesi giderir. Dört farzı doğrudan Kur'an'da (5:6) zikredilmiştir: yüzü yıkamak, kolları dirseklere kadar yıkamak, başı meshetmek ve ayakları topuk kemiklerine kadar yıkamak.",
      "Abdest her namazdan önce gereklidir — önceki namazdan kalan geçerli bir abdestiniz yoksa — ve âlimlerin çoğunluğuna göre Kâbe'yi tavaf etmeden ve Kur'an'ın yazılı nüshasına (mushaf) dokunmadan önce de gereklidir.",
      "Abdest yalnızca bir hazırlık değil, başlı başına bir ibadettir. Peygamber ﷺ, 'Allah, abdesti bozulan birinizin namazını, o kişi yeniden abdest alıncaya kadar kabul etmez' buyurarak uyarmıştır; dolayısıyla abdesti korumak namazın kendisini korumaktır.",
    ],
    hadith: [
      {
        excerpt:
          "Allah, abdesti bozulan birinizin namazını, o kişi abdest alıncaya kadar kabul etmez. (Ebû Hüreyre)",
      },
    ],
    appLinks: [{ label: "Namaz rehberinde abdest" }],
  },
  {
    title: "Abdestin Sahih Olmasının Şartları",
    summary:
      "Niyet, temiz su ve suyun ulaşmasına engel olmayan cilt — sağlam bir abdestin ön şartları.",
    body: [
      "Abdestin geçerli olması için bazı şartların (şurût) bulunması gerekir. Kişi akıl sahibi bir Müslüman olmalı ve ibadet için temizlenmeye niyet etmelidir (niyet). Bazı mezhepler niyeti abdestin rüknü, bazıları ise şartı sayar; ancak hepsi niyetin sevap için gerekli olduğunda, çoğu da abdestin sıhhati için gerekli olduğunda ittifak eder.",
      "Kullanılan su hem temiz hem temizleyici olmalıdır. En önemlisi, suyun gerçekten cilde ulaşması gerekir; bu yüzden bir uzvun üzerinde su geçirmez bir tabaka oluşturan her şey (kalın boya, oje, mum, yapıştırıcı) önce giderilmelidir, aksi hâlde altındaki yıkama geçerli olmaz. Suyu engellemeyen sıradan kir veya kına lekesi sorun teşkil etmez.",
      "Şâfiî ve Hanbelî mezhepleri ayrıca yıkamaların Kur'an'daki sıraya göre yapılmasını (tertip), Mâlikî ve Hanbelî mezhepleri ise uzuvların, yıkanan uzuvlar kuruyacak kadar uzun bir ara verilmeden peş peşe yıkanmasını (muvâlât) şart koşar. Hanefî mezhebi ikisini de sünnet sayar. Tutarlılık için tek bir mezhebin yöntemini takip edin.",
    ],
    quran: [
      {
        excerpt:
          "Yüzlerinizi ve dirseklere kadar kollarınızı yıkayın, başlarınızı meshedin ve topuk kemiklerine kadar ayaklarınızı yıkayın.",
      },
    ],
    actions: [
      "Abdestten önce ojeyi, altında su tutan yüzükleri ve cildi kapatan her şeyi çıkarın.",
      "Abdesti sakin ve kesintisiz bir akışla alın ki hiçbir uzuv atlanmasın ya da kurumaya bırakılmasın.",
    ],
  },
  {
    title: "Abdestin Farzları",
    summary:
      "Olmadıkları takdirde abdestin geçersiz olduğu, Kur'an'da belirtilen rükünler (farzlar).",
    body: [
      "Abdestin farzları, Allah'ın ayette zikrettiği kısımlardır: yüzün tamamını yıkamak; iki kolu dirseklerle birlikte yıkamak; başı meshetmek ve iki ayağı topuk kemikleriyle birlikte yıkamak. Bunlardan biri eksik kalırsa abdest tamam olmaz.",
      "Mezhepler bunlara Sünnet'ten ve fıkhî içtihattan başka farzlar da ekler. Niyet çoğu mezhepte farzdır (Hanefîler, küçük hadesi gidermek için niyeti müekked sünnet sayar). Tertip Şâfiîler ve Hanbelîler için, muvâlât ise Mâlikîler ve Hanbelîler için farzdır. Mâlikîler ayrıca uzuvları ovmayı (delk) farz olarak ekler.",
      "Bunların ötesindeki her şey — ağza ve burna su vermek, önce elleri yıkamak, üçer kez yıkamak — farz değil, sünnettir. Bu farkı bilmek, bir abdestin yalnızca eksik mi yoksa gerçekten geçersiz mi olduğunu ayırt edebilmenizi sağlar.",
    ],
    quran: [
      {
        excerpt:
          "Yüzlerinizi ve dirseklere kadar kollarınızı yıkayın, başlarınızı meshedin ve topuk kemiklerine kadar ayaklarınızı yıkayın.",
      },
    ],
    disclaimer:
      "Farzların tam listesi (örneğin niyetin, tertibin ve ovmanın farz olup olmadığı) dört mezhep arasında farklılık gösterir. Güvenilir bir mezhebi öğrenip tutarlı biçimde uygulayın.",
  },
  {
    title: "Abdestin Sünnetleri",
    summary: "Abdesti kemale erdiren ve sevabını çoğaltan tavsiye edilen davranışlar.",
    body: [
      "Peygamber ﷺ, farz olan özün etrafında abdesti tamamlayan ve güzelleştiren birçok sünneti uygulamıştır. Bunlardan birini terk etmek abdesti bozmaz; ancak bunları yerine getirmek ek sevap kazandırır ve onun örneğine daha tam olarak uymak demektir.",
      "Sabit sünnetler şunlardır: başlarken 'Bismillah' demek; başlamadan önce elleri üç kez yıkamak; ağza (mazmaza) ve buruna (istinşak) su vermek; ıslak parmaklarla gür sakalı, el ve ayak parmaklarının aralarını hilallemek (tahlîl); her uzuv çiftinde sağdan başlamak ve her yıkamayı üç kereye kadar tekrarlamak.",
      "İki sünnet özellikle anılmaya değer: Abdestten önce misvak kullanmak — ki Peygamber ﷺ bunu neredeyse farz kılacaktı — ve abdesti bitirdikten sonra kelime-i şehadeti okumak; bunu söyleyen kişiye cennetin sekiz kapısı açılır.",
    ],
    hadith: [
      {
        excerpt:
          "Kim abdestini güzelce alır, sonra 'Allah'tan başka ilah olmadığına… ve Muhammed'in O'nun kulu ve resulü olduğuna şehadet ederim' derse, ona cennetin sekiz kapısı açılır. (Ömer b. Hattâb)",
      },
    ],
    actions: [
      "Sünnetlere uygun tam sıralamayı, doğal alışkanlığınız hâline gelene kadar uygulayın.",
      "Abdestten sonraki şehadeti her seferinde okuyun.",
    ],
    appLinks: [{ label: "Abdestten sonraki dualar" }],
  },
  {
    title: "Adım Adım Abdest",
    summary: "Niyetten kapanış duasına kadar Peygamber'in ﷺ öğrettiği eksiksiz sıra.",
    body: [
      "Peygamber ﷺ abdesti, farzları sünnetlerle bir araya getiren akıcı bir sıra olarak öğretmiştir. Bu, Osman b. Affân'ın insanlara uygulamalı olarak gösterdiği yöntemdir; ardından Peygamber'in ﷺ tam olarak böyle abdest aldığını gördüğünü ve kim de böyle abdest alıp tam bir huzurla iki rekât namaz kılarsa geçmiş günahlarının bağışlanacağını söylemiştir.",
      "Her adımı acele etmeden uygulayın ve suyun gereken her bölgeye ulaştığından emin olun. Yıkanması gereken uzuvlar (yüz, kollar, ayaklar) yıkanır; baş ise yalnızca meshedilir.",
    ],
    steps: [
      {
        title: "Temizlenmeye niyet edin ve Bismillah deyin",
        body: "Abdest niyetini kalbinizde belirleyin ve Allah'ın adıyla başlayın.",
        tip: "Niyet kalbîdir; belirli bir sözün dille söylenmesi gerekmez.",
      },
      {
        title: "Elleri üç kez yıkayın",
        body: "Bileklere kadar yıkayın, suyu parmak aralarından geçirin.",
      },
      {
        title: "Ağza üç kez su verin",
        body: "Ağza su alın, çalkalayın ve dışarı atın.",
      },
      {
        title: "Buruna üç kez su verin",
        body: "Suyu burun deliklerine hafifçe çekin ve sümkürerek dışarı atın.",
      },
      {
        title: "Yüzü üç kez yıkayın (farz)",
        body: "Saç bitiminden çene altına, bir kulaktan diğer kulağa kadar.",
      },
      {
        title: "Önce sağ kolu, sonra sol kolu yıkayın (farz)",
        body: "Her birini parmak uçlarından dirsekle birlikte, üç kereye kadar yıkayın.",
      },
      {
        title: "Başı bir kez meshedin (farz)",
        body: "Islak ellerle önden arkaya doğru meshedip geri getirin, sonra aynı ıslaklıkla kulakları meshedin.",
      },
      {
        title: "Önce sağ ayağı, sonra sol ayağı yıkayın (farz)",
        body: "Her birini topuk kemikleriyle birlikte yıkayın, parmaklarınızı ayak parmaklarının arasından geçirin.",
        tip: "Topuklara ve topuk kemiklerine dikkat edin — en sık atlanan yerler buralardır.",
      },
      {
        title: "Kapanış duasını okuyun",
        body: "Cennetin kapılarının açılması için kelime-i şehadeti okuyun.",
        tip: "Kısa ama sevabı çok büyük bir sünnet.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Osman, Peygamber'i ﷺ yaparken gördüğü gibi her uzvu üçer kez yıkadı, sonra şöyle dedi: Kim böyle abdest alır ve tam bir huzurla iki rekât namaz kılarsa, geçmiş günahları bağışlanır. (Humrân, Osman'dan)",
      },
    ],
    appLinks: [{ label: "Namaz rehberinde abdest" }, { label: "Abdest duası" }],
  },
  {
    title: "Abdestle İlgili Dualar",
    summary: "Abdestten önce ve sonra sahih olarak rivayet edilen dualar.",
    body: [
      "Abdestle ilgili en sağlam rivayet edilen zikirler ikidir: başlangıçta 'Bismillah' demek ve abdesti tamamladıktan sonra kelime-i şehadeti okumak. Kapanıştaki şehadete sahih bir ilave olarak Allah'tan şöyle istenir: 'Beni tövbe edenlerden kıl ve beni temizlenenlerden kıl.'",
      "Bazı kitapçıklarda dolaşan ayrıntılı 'her uzuv için dua' (elleri, yüzü, kolları vb. yıkarken okunan özel dualar) Peygamber'den ﷺ sağlam bir sıhhatle sabit değildir; bunu bilmek önemlidir. Âlimler bunların sünnet olarak ona nispet edilmemesini tavsiye eder; bununla birlikte abdest sırasında genel olarak Allah'ı zikretmekte bir sakınca yoktur.",
      "İşin özü huzurdur: Her uzvun günahlarının döküldüğünün bilinciyle yıkanın ve bu ameli asıl amacına — yalnızca Allah'a imana — yeniden bağlayan şehadetle bitirin.",
    ],
    hadith: [
      {
        excerpt:
          "Kim abdestini güzelce alır, sonra kelime-i şehadeti okursa, ona cennetin sekiz kapısı açılır; dilediğinden girer. (Ömer)",
      },
    ],
    actions: [
      "Henüz ezberlemediyseniz abdest sonrası şehadeti ezberleyin.",
      "Doğrulanmamış uzuv dualarını sabit bir sünnetmiş gibi okumaktan kaçının.",
    ],
    appLinks: [{ label: "Namaz duaları" }, { label: "Abdest duasını öğren" }],
  },
  {
    title: "Abdesti Bozan Şeyler",
    summary: "Abdesti bozan durumlar ve şüphe hâlinde kesinlik kuralı.",
    body: [
      "Âlimlerin ittifakıyla abdesti; iki yoldan çıkan her şey — idrar, dışkı, yel veya başka bir akıntı —, kişinin şuurunu gideren derin uyku ve bayılma ya da sarhoşluk yoluyla şuurun kaybolması bozar.",
      "Diğer bazı konular mezhepler arasında saygıyla karşılanan bir ihtilaf konusudur: Avret yerine doğrudan dokunmak ve namahrem karşı cinsle tenin tene teması, aynı nasların farklı anlaşılması sebebiyle bazı mezheplerde abdesti bozar, bazılarında bozmaz.",
      "Sizi sürekli kaygıdan (vesvese) koruyan çok önemli bir ilke vardır: Kesinlik şüpheyle ortadan kalkmaz. Abdestiniz varsa ve sadece bozup bozmadığınızdan emin değilseniz, abdesti bozan bir şeyin olduğundan emin olana kadar abdestli sayılırsınız. Peygamber ﷺ bu duyguyla rahatsız olan bir adama, 'bir ses duymadıkça veya bir koku almadıkça' namazını bırakmamasını söylemiştir.",
    ],
    hadith: [
      {
        excerpt:
          "Bir ses duymadıkça veya bir koku almadıkça (namazından) ayrılmasın. (Abbâd b. Temîm, amcasından)",
      },
    ],
    disclaimer:
      "Karşı cinse veya kişinin kendi avret yerine dokunmasının abdesti bozup bozmadığı mezhepler arasında farklıdır. Ehil bir yerel hocayı ve tek bir mezhebin yöntemini takip edin.",
  },
  {
    title: "Abdestte Sık Yapılan Hatalar",
    summary: "Sevabı azaltan — ya da abdesti tamamen geçersiz kılan — sık hatalar.",
    body: [
      "Abdestteki kusurların çoğu aceleden kaynaklanır. Suyun bir uzvun tamamına ulaşmayacağı kadar acele etmek — topukta, topuk kemiğinde, dirsekte ya da el ve ayak parmaklarının arasında kuru bir yer bırakmak — abdesti geçersiz kılabilir; çünkü Kur'an'ın emrettiği yıkama orada tamamlanmamıştır.",
      "Peygamber ﷺ bir keresinde, su ulaşmadığı için topukları kuru kalmış kimseler görmüş ve sert bir şekilde, 'Vay o topukların ateşten çekeceğine!' diye uyarmıştır. Topuklar, topuk kemikleri ve yüzün kenarları en sık ihmal edilen yerlerdir.",
      "Bunun tersi olan hata ise aşırılıktır: üç defadan çok daha fazla yıkamak ya da suyu israf etmek; bu, ölçülülük sünnetine aykırıdır. Bazıları da vesveseye (takıntılı şüphe) kapılarak abdesti tekrar tekrar alır; bu da bir hatadır, çünkü kesinlik şüpheyle ortadan kalkmaz.",
    ],
    hadith: [
      {
        excerpt:
          "Vay o topukların ateşten çekeceğine! — abdestte kuru kalmış topukları görünce söylemiştir. (Ebû Hüreyre)",
      },
    ],
    actions: [
      "Yavaşlayın ve özellikle topuklar ile dirsekler olmak üzere yıkanan her uzvun tamamen ıslandığını bilinçli olarak kontrol edin.",
      "Ölçülü su kullanın; takıntılı şüphenin sizi gereksiz tekrara sürüklemesine izin vermeyin.",
    ],
  },
  {
    title: "Abdestin Faziletleri",
    summary: "Abdest günahları siler, dereceleri yükseltir ve kıyamet günü müminleri nurlandırır.",
    body: [
      "Abdest, günahların tekrar tekrar yıkanıp gitmesidir. Peygamber ﷺ, mümin her uzvunu yıkadıkça o uzuvla — gözlerle, ellerle, ayaklarla — işlenen hataların suyla birlikte döküldüğünü ve kişinin sonunda günahlardan arınmış olarak çıktığını öğretmiştir. Böylece abdestle başlanan bir namazdan önce taze bir bağışlanma gelmiş olur.",
      "Abdest ahirette de ayırt edici bir şereftir. Kıyamet günü Peygamber ﷺ ümmetini, abdest izlerinden dolayı yüzlerinde, ellerinde ve ayaklarında görülen parıltıdan tanıyacaktır; bu, bu ümmete özgü olup 'el-gurru'l-muhaccelûn' diye anılan bir nurdur.",
      "Bu faziletler sebebiyle abdestli bulunmak tavsiye edilen bir alışkanlıktır: Her namaz için abdesti yenilemek ve abdestli uyumak, müminin koruyucu alışkanlıkları arasındadır.",
    ],
    hadith: [
      {
        excerpt:
          "Ümmetim kıyamet günü abdest izlerinden dolayı yüzleri, elleri ve ayakları parlak olarak çağrılacaktır. (Ebû Hüreyre)",
      },
    ],
    actions: [
      "İmkân buldukça her namaz vakti için abdestinizi yenileyin.",
      "Abdestli uyumayı her gece uyguladığınız bir sünnet hâline getirin.",
    ],
    appLinks: [{ label: "Namazlarınızı takip edin" }],
  },

  // ── Ghusl ────────────────────────────────────────────────────────────────
  {
    title: "Gusül Nedir?",
    summary: "Büyük hadesi (cünüplük) gideren, bütün bedenin yıkanması.",
    body: [
      "Gusül (غسل), büyük hadesi (cünüplük) gidermek amacıyla niyetle bütün bedenin yıkanmasıdır. Abdest küçük hadesi giderirken gusül; cinsel ilişki, cinsel sıvının gelmesi ve hayız ya da nifasın sona ermesinden sonra oluşan büyük hadesi giderir.",
      "Özü, suyun bedenin dış yüzeyinin her yerine ulaşmasıdır; saç dipleri, deri kıvrımları, kulak arkaları, göbek ve ayak parmaklarının araları dahil hiçbir kuru yer kalmamalıdır. Birçok âlime göre ağza ve buruna su vermek de guslün kapsamındadır.",
      "Cünüplüğü gidermek niyetiyle alınan tek bir gusül küçük hadesi de giderir; dolayısıyla guslünü tamamlayan kişi ayrıca abdest almadan namaz kılabilir (bununla birlikte gusül içinde abdest almak sünnettir).",
    ],
    quran: [
      {
        excerpt: "Eğer cünüp iseniz, iyice temizlenin.",
      },
    ],
    appLinks: [{ label: "Namaza hazırlığa genel bakış" }],
  },
  {
    title: "Guslün Gerektiği Durumlar",
    summary: "Boy abdestini farz veya müstehap kılan durumlar.",
    body: [
      "Gusül belirli birkaç durumda farz olur: şehvetle cinsel sıvının gelmesi (uyanıkken veya ihtilam yoluyla); boşalma olmasa bile cinsel ilişkinin kendisi — Peygamber ﷺ iki sünnet yeri birleştiğinde guslün gerektiğini bildirmiştir — ve hayız ya da nifas kanının sona ermesi. Ölüm de ölünün yıkanmasını yaşayanlara farz kılar.",
      "Diğer bazı gusüller farz değil, müstehaptır: Cuma namazından önce alınan cuma guslü — Peygamber ﷺ bunu o kadar teşvik etmiştir ki 'ergenlik çağına giren herkese bir vazifedir' buyurmuştur —; iki bayram için alınan gusül ve hac ya da umreden önce ihram için alınan gusül.",
      "İslam'a yeni giren kişiye gusül alması emredilir; bu gusül bazı âlimlere göre farz, bazılarına göre ise kuvvetle tavsiye edilen bir davranıştır.",
    ],
    hadith: [
      {
        excerpt:
          "Erkek, eşinin dört uzvu arasına oturup onunla ilişkiye girdiğinde gusül farz olur. (Ebû Hüreyre; ayrıca Müslim 348)",
      },
      {
        excerpt:
          "Cuma günü gusül, ergenlik çağına giren herkese bir vazifedir. (Ebû Saîd el-Hudrî; ayrıca Müslim 846)",
      },
    ],
    disclaimer:
      "Cuma guslünün ve Müslüman olan kişinin guslünün farz mı yoksa kuvvetle tavsiye edilen bir gusül mü olduğu mezhebe ve duruma göre farklılık gösterir.",
    appLinks: [{ label: "Hayız rehberi" }],
  },
  {
    title: "Adım Adım Gusül",
    summary: "Peygamber'in ﷺ yöntemi — asgari farz ile eksiksiz sünnet.",
    body: [
      "Hz. Âişe, Peygamber'in ﷺ guslünü ayrıntılı olarak anlatmıştır; âlimler bundan hem geçerli guslün asgari şeklini hem de daha kapsamlı sünnet yöntemini çıkarmışlardır. Asgari gusül basittir: niyet ve suyun bütün bedene ulaşması (birçok âlime göre ağza ve buruna su vermekle birlikte). Aşağıdaki eksiksiz yöntem ise Peygamber'in ﷺ bizzat uyguladığı yoldur.",
      "Acele etmeden, hiçbir yer kuru kalmayacak şekilde suyu cilde sürerek yıkanın.",
    ],
    steps: [
      {
        title: "Niyet edin",
        body: "Büyük hadesi (cünüplük) gidermeye kalbinizden niyet edin.",
      },
      {
        title: "Bismillah deyin ve ellerinizi yıkayın",
        body: "Allah'ın adıyla başlayın ve iki elinizi yıkayın.",
      },
      {
        title: "Avret mahallini yıkayın",
        body: "Sol elinizle avret yerlerindeki her türlü necaseti giderin.",
      },
      {
        title: "Tam bir abdest alın",
        body: "Namaz için alır gibi abdest alın. Biriken suyun içinde duruyorsanız ayakları yıkamayı sona bırakabilirsiniz.",
      },
      {
        title: "Başa üç kez su dökün",
        body: "Suyu kafa derisine ve saç diplerine ulaştırın.",
      },
      {
        title: "Önce sağ tarafı, sonra sol tarafı yıkayın",
        body: "Sağdan başlayarak bütün bedene su döküp ovun.",
      },
      {
        title: "Suyun her yere ulaştığından emin olun",
        body: "Hiçbir kuru yer bırakmayın — koltuk altları, göbek, diz ve kulak arkaları ile ayak parmaklarının araları.",
        tip: "Kadınların, su saç diplerine ulaştığı sürece örgülü saçlarını çözmeleri gerekmez.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Peygamber ﷺ cünüplükten dolayı yıkandığında ellerini yıkar, namaz için alır gibi abdest alır, parmaklarını saçlarının arasından geçirir, sonra başına üç kez, ardından bedeninin geri kalanına su dökerdi. (Âişe)",
      },
    ],
  },
  {
    title: "Gusülde Sık Yapılan Hatalar",
    summary: "Kuru yer bırakmaktan, niyeti unutmaktan ve sıradan bir duşu gusül sanmaktan kaçının.",
    body: [
      "En temel hata, sıradan bir duşu gusül yerine koymaktır. Gusül, büyük hadesi gidermeye niyet etmeyi gerektirir; niyet olmadan ne kadar uzun yıkanırsanız yıkanın, hükmî durum ortadan kalkmaz. Başlamadan önce niyet edin.",
      "İkinci yaygın hata, kuru yer bırakmaktır. Farz olan, suyun bedenin dış yüzeyinin tamamına değmesidir; saç diplerini, kulakları, göbeği, bel çukurunu veya ayak parmaklarının arasını ihmal etmek guslü eksik bırakır. Emin olmak için suyu bu bölgelere sürün.",
      "Saça gelince: Örgülü saçı olan kadının, su saç diplerine ulaştığı sürece örgülerini çözmesi gerekmez — Peygamber ﷺ Ümmü Seleme'ye başa üç avuç su dökmenin yeterli olduğunu söylemiştir. Erkeklerin saçı genellikle açık olduğundan, suyun diplere ulaşması için saçın arası ovalanmalıdır.",
    ],
    hadith: [
      {
        excerpt:
          "Başına üç avuç su dökmen, sonra bedenine su dökmen yeterlidir; böylece temizlenmiş olursun — örgülerini çözmen gerekmez. (Ümmü Seleme)",
      },
    ],
    actions: [
      "Yıkamanın gusül sayılması için ilk suyu dökmeden önce niyet edin.",
      "Kolayca atlanan bölgelere suyu sürün; emin olamadığınızda şüpheyle bitirmek yerine o bölümü yeniden yıkayın.",
    ],
  },

  // ── Tayammum ─────────────────────────────────────────────────────────────
  {
    title: "Teyemmüm Nedir?",
    summary: "Su kullanılamadığında temiz toprakla yapılan temizlik.",
    body: [
      "Teyemmüm (تيمم), su gerçekten bulunamadığında veya kullanılamadığında abdestin ya da guslün yerini tutan, rahmet dolu bir ruhsattır. Yıkamak yerine avuçlar temiz toprağa vurulur, yüz ve eller meshedilir; bu, su ile temizlenmenin yerini tamamen tutar ve geçerli bir namaz kılmayı mümkün kılar.",
      "Teyemmüm özellikle bu ümmete verilmiş bir lütuftur: Peygamber ﷺ, 'Yeryüzü bana mescit ve temizlik aracı kılındı' buyurmuş ve bunu, önceki peygamberlere değil kendisine verilen özel imtiyazlar arasında saymıştır. Teyemmüm dinin temel bir ilkesini yansıtır: Yükümlülük devam eder, ama zorluk kaldırılır.",
      "Geçici bir tedbirdir: Su bulunup kullanılabilir hâle geldiğinde, su ile olağan temizlenmeye geri dönülür. Bazı mezheplere göre kişinin her namaz için teyemmümü yenilemesi gerekebilir.",
    ],
    quran: [
      {
        excerpt:
          "…ve su bulamazsanız, temiz bir toprakla teyemmüm edin; onunla yüzlerinizi ve ellerinizi meshedin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Yeryüzü bana mescit ve temizlik aracı kılındı. (Câbir — Peygamber'e ﷺ özgü olarak verilen beş şeyden biri)",
      },
    ],
  },
  {
    title: "Teyemmümün Caiz Olduğu Durumlar",
    summary: "Su yokken, zarar verdiğinde veya hayatta kalmak için acilen gerektiğinde caizdir.",
    body: [
      "Teyemmüm genel olarak üç durumda caizdir. Birincisi, makul bir aramadan sonra hiç su bulunamadığında — çöldeki yolcu veya suya gerçekten erişimi olmayan herkes. İkincisi, suyu kullanmak zarar vereceğinde: yarası ya da hastalığı kötüleşecek olan hasta için veya suyu ısıtma imkânı bulunmayan ve gerçek bir zarar riski taşıyan şiddetli soğukta.",
      "Üçüncüsü, eldeki az suya daha acil bir ihtiyaç için gerek duyulduğunda — örneğin kişinin kendisinin, bir başkasının veya bir hayvanın hayatını korumak için içmek gibi. Her durumda şeriat, hayatın ve sağlığın korunmasını tercih edilen temizlenme yönteminin önünde tutar.",
      "Fakihler daha ince eşikler konusunda — suyun ne kadar uzağa kadar aranması gerektiği, ne derece zarar korkusunun yeterli olduğu gibi — ihtilaf eder; ancak temeldeki rahmette ittifak hâlindedirler: İbadet asla düşmez, sadece kolaylaştırılır.",
    ],
    hadith: [
      {
        excerpt:
          "Teyemmüm bölümlerinde rivayet edilmiştir: Kullanılabilir su bulunmadığında temiz toprakla temizlenme ruhsatı.",
      },
    ],
    actions: [
      "Teyemmüme başvurmadan önce makul ölçüde su arayın.",
      "Doktor bir yarayı veya hastalıklı bölgeyi kuru tutmanızı tavsiye ederse buna uyun ve teyemmüm edin.",
    ],
  },
  {
    title: "Adım Adım Teyemmüm",
    summary: "Geçerli bir teyemmüm için kısa ve basit sıra.",
    body: [
      "Teyemmüm bilerek kısa tutulmuştur; bu, zorluk anındaki bir ruhsat olma amacını yansıtır. Toprak, kum, taş veya toz gibi temiz ve doğal bir toprak yüzeyle yapılır. Peygamber'in ﷺ Ammâr b. Yâsir'e bizzat gösterdiği şekliyle özü, avuçları temiz toprağa bir kez vurmak, sonra yüzü ve elleri meshetmektir.",
      "Teyemmüm bilinçli olarak abdestten daha hafif tutulmuştur; bu yüzden onu zorlaştırmayın.",
    ],
    steps: [
      {
        title: "Niyet edin",
        body: "İbadet edebilmek için hükmî kirlilikten (hades) temizlenmeye niyet edin.",
      },
      { title: "Bismillah deyin", body: "Allah'ın adıyla başlayın." },
      {
        title: "Avuçlarınızı temiz toprağa bir kez vurun",
        body: "Avuçlarınızı temiz, tozlu ve doğal bir yüzeye hafifçe koyun.",
      },
      { title: "Yüzü meshedin", body: "İki elinizle yüzün tamamını bir kez meshedin." },
      {
        title: "Elleri meshedin",
        body: "Ellerin üst kısmını meshedin — âlimlerin çoğuna göre bileklere kadar.",
        tip: "Bir mezhebin yöntemini (bileklere mi, kollara mı kadar) tutarlı biçimde takip edin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Peygamber ﷺ avuçlarını yere vurdu, sonra yüzünü ve ellerini meshetti ve Ammâr'a bunun yeterli olduğunu öğretti. (Ammâr b. Yâsir)",
      },
    ],
  },
  {
    title: "Teyemmümü Bozan Şeyler",
    summary: "Abdesti bozan olağan şeylerle — ve kullanılabilir suyun bulunmasıyla — bozulur.",
    body: [
      "Abdest yerine alınan teyemmümü, abdesti bozan her şey bozar: tuvalet ihtiyacını gidermek, yel çıkarmak, derin uyku vb. Gusül yerine alınan teyemmüm ise bunlara ek olarak büyük hadese yol açan her şeyle bozulur.",
      "Teyemmüme özgü olarak, ona izin veren sebebin ortadan kalkması da onu sona erdirir; yani kullanılabilir suya erişmek. Su bulunup kullanılabilir hâle geldiğinde ruhsat sona erer ve kişi abdeste veya gusle geri döner.",
      "Rahmete dayalı pratik bir husus: Teyemmümle geçerli bir şekilde namaz kıldıysanız ve suyu ancak sonradan bulduysanız, çoğunluğa göre tamamlanan namazın iade edilmesi gerekmez — o namaz, o anda geçerli olan hükme göre doğru şekilde kılınmıştır. Ancak su namazdan önce bulunursa, onu kullanmanız gerekir.",
    ],
    actions: [
      "Her namaz vaktinin başında kullanılabilir su olup olmadığını yeniden kontrol edin.",
      "Su kullanılabilir hâle gelir gelmez, gecikmeden su ile temizlenmeye geri dönün.",
    ],
    disclaimer:
      "Bazı ayrıntılar — örneğin su, namazın vakti içinde bulunduğunda namazın iade edilip edilmeyeceği — mezhebe göre farklılık gösterir.",
  },

  // ── Najasah ──────────────────────────────────────────────────────────────
  {
    title: "Necasetler (Pislikler)",
    summary: "Bedenden, elbiseden ve namaz kılınan yerden giderilmesi gereken maddî pislik.",
    body: [
      "Necaset (نجاسة), hadesin hükmî durumlarından farklı olarak somut bir pisliktir. Üzerinde ittifak edilen açık örnekler arasında insan idrarı ve dışkısı, akan kan, domuzun eti ve salgıları ile köpeğin salyası (özel bir yıkama gerektirir) bulunur. Bedenden, giyilen elbiseden ve namaz kılınan yerden necaseti gidermek namazın sahih olmasının şartıdır.",
      "Pislik somut ise su ile giderilir; madde ve izi kaybolana kadar yıkanır. İslam necasetin kaynaklarını da ciddiye alır: Peygamber ﷺ, kabir azabının büyük kısmının idrar konusundaki dikkatsizlikten — idrarın sıçraması ve düzgün temizlenmemekten — kaynaklandığını haber vermiştir.",
      "Mezhepler bazı maddelerin sınıflandırılmasında (örneğin belirli sıvıların az miktarının affedilip affedilmediği) ve hangi kalıntı miktarlarının hoş görüldüğünde ihtilaf eder. Günlük hayat için uygulanabilir ilke şudur: İyice temizleyin ve pisliğe dair bir delil bulunmayan yerde temizlik konusunda kendinize şüphe üretmeyin.",
    ],
    hadith: [
      {
        excerpt:
          "Peygamber ﷺ iki kabrin yanından geçti ve içindekilerin azap gördüğünü söyledi — biri koğuculuk yaptığı için, diğeri ise idrarından sakınmadığı için. (İbn Abbas; ayrıca Müslim 292)",
      },
    ],
  },
  {
    title: "Elbiseyi Necasetten Temizlemek",
    summary: "İçinde kılınan namazın geçerli olması için bir giysi nasıl yıkanır.",
    body: [
      "Elbiseye necaset bulaştığında, maddenin kendisi ve görünen izi gidene kadar bulaşan yeri su ile yıkayın. Peygamber ﷺ, elbisesine hayız kanı bulaşan bir kadına onu kazımasını, sonra su ile ovalamasını, sonra yıkamasını ve onunla namaz kılmasını öğretmiştir.",
      "Samimi ve titiz bir çabadan sonra çıkmayan hafif bir renk lekesi veya hafif bir koku kalırsa, âlimlerin çoğunluğu gerçekten giderilmesi zor olanı affedilmiş sayar — yükümlülük, maddeyi gidermektir; lekesiz bir renk garanti etmek değildir.",
      "Bazı durumların kendine özgü, bilinen ayrıntıları vardır; örneğin anne sütüyle beslenen erkek bebeğin idrarı (rivayet edilen bir ruhsata göre tamamen yıkanmak yerine üzerine su serpilir). Bu yüzden gerçekte karşılaştığınız durumlar için mezhebinizin pratik hükümlerini öğrenin.",
    ],
    hadith: [
      {
        excerpt:
          "Elbiseye bulaşan hayız kanı hakkında: Onu kazı, sonra su ile ovala, sonra yıka ve onunla namaz kıl. (Esmâ bint Ebû Bekir)",
      },
    ],
    actions: [
      "Namaz için en az bir takım temiz elbiseyi ayrı tutun.",
      "Evden uzaktayken elbisenize pislik bulaşırsa, yapabildiğiniz kadarını durulayın ve mümkün olduğunda değiştirin.",
    ],
  },
  {
    title: "Bedenin Temizlenmesi",
    summary: "Bedendeki pisliğin giderilmesi, istincâ ve hijyen adabı.",
    body: [
      "Bedendeki pislik, gücün yettiği ölçüde namazdan önce yıkanıp giderilmelidir. En sık karşılaşılan durum, tuvaleti kullandıktan sonra temizlenmektir (istincâ); bu, bölge temizlenene kadar su ile veya uygun kuru bir malzemeyle yapılır. Peygamber ﷺ tuvalet ihtiyacını giderdikten sonra özenle temizlenmeyi öğretmiş ve bunun için sağ elin kullanılmasını yasaklamıştır.",
      "İslam, pisliği gidermenin ötesinde, bedeni temiz ve ibadete hazır tutan temel bir doğal temizliği (fıtrat) teşvik eder: tırnakları kesmek, koltuk altı ve kasık kıllarını gidermek ve benzerlerini düzenli olarak yapmak.",
      "Bu uygulamalar sadece kültürel incelikler değildir; müminin namazda Allah'ın huzuruna çıkarken taşıdığı vakar ve temizliğin bir parçasıdır.",
    ],
    hadith: [
      {
        excerpt: "Peygamber ﷺ tuvalet ihtiyacını giderdikten sonra su ile temizlenirdi. (Enes)",
      },
    ],
    actions: [
      "Tuvaleti kullandıktan sonra abdestten önce istincâyı mutlaka tamamlayın.",
      "Yolculukta peçete ve mümkünse su taşıyabileceğiniz bir şey bulundurun.",
    ],
  },
  {
    title: "Namaz Kılınan Yerin Temizliği",
    summary: "Namaz yeri bilinen pislikten arınmış olmalı — ama temelsiz şüpheye kapılmadan.",
    body: [
      "Namaz kılınan yer, bilinen necasetten arınmış olmalıdır. Peygamber ﷺ bunu çok canlı bir şekilde öğretmiştir: Bir bedevi mescidin bir köşesine bevlettiğinde, sahabeyi onu sertçe azarlamaktan alıkoymuş, işini bitirmesine izin vermiş, sonra o yerin üzerine bir kova su dökülmesini emretmiştir — böylece hem temizliği hem de yumuşaklığı öğretmiştir.",
      "Belirleyici kural kesinliktir. Yeryüzü genel olarak namaz kılınacak yer kılınmıştır; bu yüzden gerçek bir pislik delili olmadıkça bir yüzeyin temiz olduğu kabul edilir. Orada pislik bulunduğunu biliyorsanız onu giderin veya temiz bir yere geçin; sadece orada olabileceğini düşünüyorsanız, bu vesveseye aldırmayın ve devam edin.",
      "Bu denge ibadeti iki aşırılıktan korur: Açıkça kirlenmiş bir zeminde dikkatsizce namaz kılmak ve her yüzey hakkında temelsiz şüphelerle hareketsiz kalmak.",
    ],
    hadith: [
      {
        excerpt:
          "Bir bedevi mescide bevlettiğinde, Peygamber ﷺ üzerine bir kova su dökülmesini emretti. (Ebû Hüreyre)",
      },
    ],
    actions: [
      "Namazdan önce seccadenize ve zemine bir göz atın.",
      "Gerçek bir pislik delili yoksa, temelsiz kuşkuları bir kenara bırakın ve namazınızı kılın.",
    ],
  },

  // ── Exceptions ───────────────────────────────────────────────────────────
  {
    title: "Hayız ve Temizlik",
    summary: "Hayız ve lohusalık kanının kendine özgü temizlik hükümleri vardır.",
    body: [
      "Hayız ve nifas (lohusalık) süresince kadın namaz kılmaz ve — dinin bir rahmeti olarak — bu süre içinde kılınamayan namazlar sonradan kaza edilmez. Bu sabit bir hükümdür: Hz. Âişe'ye hayızlı kadının neden orucunu kaza edip namazını kaza etmediği sorulduğunda, kendilerine böyle emredildiğini teyit etmiştir.",
      "Oruç ise farklıdır: Ramazan'da hayız sebebiyle tutulamayan oruçlar sonradan kaza edilir; namazlar ise tamamen düşer. Kan kesilip temizlik alameti görüldüğünde kadın gusleder ve namaza ve oruca yeniden başlar.",
      "Hayız ve nifasın en az ve en çok süreleri ile temizliğin sınırdaki alametlerinin nasıl yorumlanacağı, mezheplerin ayrıntıda ihtilaf ettiği konulardır. Kadınlar, güvenilir bir mezhebin pratik hükümlerini ehil bir hocadan öğrenmekle fayda görür.",
    ],
    hadith: [
      {
        excerpt:
          "Hayızlı kadının neden oruçlarını kaza edip namazlarını kaza etmediği sorulunca Âişe şöyle dedi: Oruçları kaza etmekle emrolunurduk, namazları kaza etmekle emrolunmazdık. (Muâze, Âişe'den; ayrıca Müslim 335)",
      },
    ],
    appLinks: [{ label: "Hayız modülü" }],
  },
  {
    title: "Sıkça Sorulan Sorular",
    summary: "Temizlikle ilgili en yaygın endişe ve şüphelere kısa cevaplar.",
    body: [
      "Şüphe abdestimi bozar mı? Hayır. Abdestiniz varsa ve sadece bozup bozmadığınızdan emin değilseniz, abdesti bozan bir şeyden emin olana kadar abdestiniz devam eder. Şüpheye değil kesinliğe göre hareket etmek, sizi takıntılı şüpheden (vesvese) koruyan nebevî bir ilkedir.",
      "Alçı, sargı ve yaralar ne olacak? Bu konuda ruhsatlar vardır. Örtülü bir uzvu yıkamak zarar veriyorsa, onun yerine sargının üzerine meshedebilirsiniz (cebîre üzerine mesh); ulaşılamayan yerler için de teyemmüm yeterli olur — ayrıntılar mezhebe ve duruma göre değişir.",
      "Suyu hiç kullanamıyorsam ne yapmalıyım? Temiz toprakla teyemmüm, su kullanma imkânı geri gelene kadar tamamen geçerlidir.",
      "Kronik durumlar — sürekli kanama (istihaze) veya idrar kaçırma — için hüküm nedir? Bu kişi sürekli bir mazereti olan kimse (mazur) olarak kabul edilir: Temizlenir ve her namaz vakti için abdest alır, sonra akıntı devam etse bile namazını kılar; bu, o namazı bozmaz.",
    ],
    actions: [
      "Sürekli şüphenin ibadetinize engel olmasına izin vermeyin — kuşkuya değil kesinliğe uyun.",
      "Kronik durumlar veya karmaşık meseleler için ehil bir âlimden size özel bir hüküm alın.",
    ],
    appLinks: [{ label: "Namaz rehberi" }, { label: "Temizlik ve kadınlar" }],
    disclaimer:
      "Bu SSS cevapları eğitim amaçlı özetlerdir, kişisel bir fetva değildir. Karmaşık veya kronik durumlar yerel bir âlimle birlikte değerlendirilmelidir.",
  },

  // ── Reference ────────────────────────────────────────────────────────────
  {
    title: "Kaynaklar ve İleri Okuma",
    summary: "Temizlikle ilgili temel Kur'an ayetleri ve hadis bölümleri.",
    body: [
      "Temizlik konusundaki temel Kur'an metni, abdesti, guslü ve teyemmümü birlikte ele alan abdest ayeti, Mâide Suresi 5:6'dır; bunun yanında 2:222 ('Allah temizlenenleri sever') ve suyun temizliğiyle ilgili ayetler (25:48) konunun dayanaklarını oluşturur.",
      "Sünnet'te temel kaynaklar, Sahîh-i Buhârî ve Sahîh-i Müslim'in başında yer alan Temizlik Kitaplarıdır (Kitâbü't-Tahâre / el-Vudû / el-Gusl / el-Hayz); bunları, daha ince hükümleri sıhhat dereceleriyle birlikte toplayan dört Sünen'deki (Ebû Dâvûd, Tirmizî, Nesâî, İbn Mâce) aynı bölümler izler.",
      "Uygulamaya yönelik hükümler için dört Sünnî mezhebin klasik fıkıh eserleri ayrıntılı görüşleri verir — ve aralarındaki farklılıklar bir kusur değil, geleneğin meşru bir parçasıdır. Bu modülü yapılandırılmış bir genel bakış için kullanın, ardından ehil bir hoca ve temel kaynaklarla çalışmanızı derinleştirin.",
    ],
    hadith: [
      {
        excerpt:
          "Eserin başında yer alan; abdest, gusül, teyemmüm ve hayız hakkındaki kapsamlı bölümler.",
      },
      {
        excerpt:
          "Temizlik Kitabı — tahâret hükümleri, adabı ve ilkeleri hakkında sahih rivayetler.",
      },
    ],
    actions: [
      "Dağınık hükümlerin yol açtığı kafa karışıklığından kaçınmak için güvenilir tek bir müfredatı takip edin.",
      "Pratikte kendinizden emin olana kadar bu konuları belli aralıklarla tekrar gözden geçirin.",
    ],
    appLinks: [{ label: "Namaz öğrenme yolu" }, { label: "Namaz duaları" }],
  },
];

export const TAHARAH_CHECKLIST_TR: DeepPartial<TaharahChecklistItem>[] = [
  {
    title: "Sabah namazından önce abdest",
    hint: "Mümkünse güne abdestli olarak başlayın.",
  },
  {
    title: "Misvak / diş fırçalama",
    hint: "Abdestten ve namazdan önce bir sünnettir.",
  },
  {
    title: "Necasetten arınmış namaz elbisesi",
    hint: "Namazdan önce görünür bir pislik olup olmadığını kontrol edin.",
  },
  {
    title: "Temiz namaz yeri",
    hint: "Namaz kıldığınız yerden necis olan her şeyi kaldırın.",
  },
  {
    title: "Abdesti bozan şeylerden sonra abdesti yenileme",
    hint: "Yel, uyku, tuvalet — abdesti neyin bozduğunu bilin.",
  },
  {
    title: "Gerektiğinde gusül",
    hint: "Büyük hadesten, hayzın bitiminden veya lohusalık kanından sonra.",
  },
];
