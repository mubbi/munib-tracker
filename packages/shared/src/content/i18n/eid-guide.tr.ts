import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Turkish translation overlay for the Learn Eid guide. Mirrors the order of
// EID_GUIDE_TOPICS in ../eid-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const EID_GUIDE_TOPICS_TR: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Ramazan Bayramı — orucu açma bayramı",
    summary: "Şevval ayının ilk günü, Ramazan orucunun sona erdiğini müjdeler.",
    body: [
      "Ramazan Bayramı, Ramazan'ın hemen ardından Şevval'in 1. günü kutlanır ve bir ay boyunca oruç tutup ibadet etmeye muvaffak kılınmanın sevinç ve şükür günüdür. Kur'an, orucun bitişini doğrudan zikir ve şükürle bağlar: '...sayıyı tamamlamanız ve size doğru yolu göstermesine karşılık Allah'ı tekbir etmeniz ve şükretmeniz içindir' (Bakara 2:185).",
      "Bu günde oruç tutmak sadece hoş karşılanmayan bir şey değil, açıkça yasaktır — Peygamber ﷺ, Kurban Bayramı ile birlikte bu günü, Müslümanların oruç değil yemek yemekle emrolunduğu iki gün olarak belirtmiştir (Buhari 1990). Gün, Fıtır Zekâtı ve Bayram namazıyla başlar; akraba ziyaretleri, iyi dilek alışverişi ve İslami sınırlar içinde genel bir şenlikle sürer.",
    ],
    quran: [
      {
        excerpt:
          "...sayıyı tamamlamanız ve size doğru yolu göstermesine karşılık Allah'ı tekbir etmeniz ve şükretmeniz içindir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah Resûlü ﷺ'in oruç tutmayı yasakladığı iki gün vardır: Ramazan orucunuzu açtığınız gün ve kurbanınızdan yediğiniz gün.",
      },
    ],
  },
  {
    title: "Kurban Bayramı — fedakârlık bayramı",
    summary: "Zilhicce'nin 10. günü, İbrahim'in kurbanının anısı.",
    body: [
      "Kurban Bayramı, Hac esnasında Nahr Günü olan Zilhicce'nin 10. gününde kutlanır ve İbrahim'in Allah'a itaat ederek oğlunu kurban etmeye razı olmasını, Allah'ın da onu büyük bir kurbanla fidye ederek bağışlamasını hatırlatır (Kur'an 37:102–107). Birçok âlimin görüşüne göre iki bayramın en büyüğüdür ve haccın tamamlanmasıyla çakışır.",
      "Ramazan Bayramı gibi, bu günde oruç tutmak da yasaktır (Buhari 1990). Ana ek ibadeti, İbrahim'in teslimiyetinin hatırasına, gücü yetenlerin sunduğu kurbandır (udhiyah); bu ibadet ve sadakayı birleştiren bir eylemdir.",
    ],
    quran: [
      {
        excerpt:
          "Çocuk kendisiyle birlikte yürüyüp koşacak yaşa gelince İbrahim ona: Yavrucuğum, dedi, ben rüyada seni boğazladığımı gördüm... Ve biz onu büyük bir kurbanlıkla fidalandırdık.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah Resûlü ﷺ'in oruç tutmayı yasakladığı iki gün vardır: Ramazan orucunuzu açtığınız gün ve kurbanınızdan yediğiniz gün.",
      },
    ],
  },
  {
    title: "Bayram namazı nasıl kılınır",
    summary: "Ezan ve kamet olmaksızın ek tekbirlerle iki rekât.",
    body: [
      "Bayram namazı, öncesinde ezan ve kamet olmaksızın cemaatle kılınan iki rekâttır — Câbir bin Abdullah ve İbn Abbas, Peygamber ﷺ zamanında her iki bayram için de ezan okunmadığını doğrulamıştır (Sahih Müslim 886). Namazın ardından hutbe okunur; bu, hutbenin önce geldiği Cuma namazından farklıdır.",
      "Her rekâtta kıraatten önce, namazın normal tekbirlerine ilaveten ek tekbirler ('Allahu Ekber' demek) eklenir. Âişe, Peygamber ﷺ'in her iki bayramda birinci rekâtta yedi, ikinci rekâtta beş kez tekbir getirdiğini rivayet etmiştir (Sünen-i Ebû Dâvûd 1149); bu sayı Abdullah bin Amr'dan da rivayet edilmiştir (Ebû Dâvûd 1151).",
    ],
    hadith: [
      {
        excerpt:
          "Ramazan Bayramı'nda imam çıktığında da, çıktıktan sonra da ezan yoktu; o gün kamet, çağrı ya da buna benzer bir şey de yoktu.",
      },
      {
        excerpt:
          "Allah Resûlü ﷺ Ramazan ve Kurban Bayramlarında, birinci rekâtta yedi, ikinci rekâtta beş kez tekbir getirirdi.",
      },
    ],
    madhhabNote:
      "Mezhepler ek tekbirlerin tam sayısı konusunda ayrılır. Şâfiî, Mâlikî ve Hanbelî fakihler yedi-beş rivayetini (Ebû Dâvûd 1149/1151) esas alır — Mâlikî ve Hanbelîler açılış tekbirini yediye dâhil ettiğinden altı-beş der. Hanefî mezhebi ise birinci rekâtta kıraatten önce 3, ikinci rekâtta rükûdan önce 3 ek tekbir (toplam 6) görüşündedir — bu, ayrı bir merfu hadisle sabit olmayan Kûfe fakihlerinin bir görüşüdür; cemaatinizin imamının tekbir sayısına uyun.",
    actions: [
      "Vaktinde gelin — namazın başladığını bildiren bir ezan ya da kamet yoktur.",
      "İmamınızın tekbir sayısına uyun; her iki mezhebin uygulaması da geçerlidir.",
      "Namazdan sonra hutbe için kalın.",
    ],
  },
  {
    title: "Bayram günündeki sünnetler",
    summary: "Gusül, en güzel elbise, namazdan önce/sonra yemek ve iki farklı yol.",
    body: [
      "Bayram namazından önce ve sonra yapılması tavsiye edilen birkaç küçük sünnet vardır. Ramazan Bayramı'nda Peygamber ﷺ, tek sayıda birkaç hurma yemeden namaza gitmezdi (Buhari 953) — Kurban Bayramı'nın aksine, orada namazdan dönene kadar bekleyip kurban etinden yemek tavsiye edilir.",
      "Bu vesileyle gusül almak ve en güzel (temiz, sade) kıyafeti giymek sünnettir; bu, sahâbenin her iki bayramdaki genel uygulamasını takip eder, gerçi bu özel rivayet buradaki diğerlerine göre daha az sağlam olup, tek bir sahih dereceli hadisten çok yaygın olarak uygulanan bir gelenektir.",
      "Ayırt edici bir sünnet, eve gidilen yoldan farklı bir yoldan dönmektir. Câbir bin Abdullah şöyle rivayet etmiştir: 'Peygamber ﷺ bayram günü (namazı kıldırdıktan sonra) gittiği yoldan farklı bir yoldan dönerdi' (Buhari 986) — bu genellikle kişinin ibadetine şahitlik eden yerleri çoğaltmak ve İslam'ın şiarlarını daha geniş çapta göstermek olarak açıklanır.",
    ],
    hadith: [
      {
        excerpt:
          "Peygamber ﷺ Ramazan Bayramı gününde tek sayıda birkaç hurma yemeden asla (namaza) gitmezdi.",
      },
      {
        excerpt:
          "Peygamber ﷺ bayram günü (Bayram namazını kıldırdıktan sonra) gittiği yoldan farklı bir yoldan dönerdi.",
      },
    ],
    actions: [
      "Gusül alın ve en güzel, sade kıyafetinizi giyin.",
      "Ramazan Bayramı namazından önce tek sayıda hurma yiyin; Kurban Bayramı namazından sonrasına kadar yemeyi bekleyin.",
      "Namaza giderken kullandığınız yoldan farklı bir yoldan eve dönün.",
    ],
  },
  {
    title: "Fıtır Zekâtı — temel bilgiler",
    summary: "Ramazan Bayramı namazından önce ödenmesi gereken küçük bir farz sadaka.",
    body: [
      "Fıtır Zekâtı (Sadaka-i Fıtır), servete dayalı zekâttan ayrı, daha küçük bir sadakadır; her Müslüman üzerine farzdır — küçük ya da büyük, erkek ya da kadın, hür ya da köle — ve aile reisi onların adına öder. İbn Ömer, Peygamber ﷺ'in her Müslümana bir sâ' (yaklaşık 2–3 kg) hurma veya arpa farz kıldığını ve bunun insanlar Bayram namazına çıkmadan önce ödenmesini emrettiğini rivayet etmiştir (Buhari 1503).",
      "Amacı sünnette açıkça belirtilmiştir: 'oruç tutan kişiyi boş ve çirkin sözlerden temizlemek ve fakirlere yiyecek sağlamak' (Sünen-i Ebû Dâvûd 1609). Bunu Bayram namazından önce ödemek bu özel zekâtı yerine getirmiş olur; namazdan sonra ödemek genel bir sadaka olarak sayılır ancak zamana bağlı özel sevabı kaçırır.",
      "Günümüzde çoğu toplum, doğrudan hurma veya arpa dağıtmak yerine, mahalli âlimlerin ve zekât kurumlarının mevcut temel gıda değerleri konusundaki rehberliğini takip ederek yerel para birimiyle değer hesaplar — bu pratik bir kolaylıktır, temel yükümlülükte bir değişiklik değildir.",
    ],
    hadith: [
      {
        excerpt:
          "Allah Resûlü ﷺ, köle veya hür, erkek veya kadın, küçük veya büyük her Müslüman üzerine bir sâ' hurma veya bir sâ' arpa olarak Fıtır Zekâtı'nı farz kıldı ve bunun insanlar Bayram namazına çıkmadan önce ödenmesini emretti.",
      },
      {
        excerpt:
          "Allah Resûlü ﷺ, Fıtır Zekâtı'nı oruç tutan kişiyi boş ve çirkin sözlerden temizlemek, fakirlere de yiyecek sağlamak olarak farz kıldı. Kim onu namazdan önce öderse, bu kabul edilmiş bir zekâttır; kim namazdan sonra öderse, bu (olağan) bir sadakadır.",
      },
    ],
    actions: [
      "Kendiniz ve bakmakla yükümlü olduklarınız için Fıtır Zekâtı'nı hesaplayıp ayırın.",
      "Mümkünse Ramazan Bayramı namazına gitmeden önce ödeyin.",
    ],
    appLinks: [{ label: "Zekât hesaplayıcı" }],
  },
  {
    title: "Kurban (udhiyah) — temel bilgiler",
    summary: "Kurban Bayramı'nda kesilen ve fakirlerle paylaşılan bir hayvan kurbanı.",
    body: [
      "Kurban, İbrahim'in kurbanının anısına Kurban Bayramı ve sonrasındaki Teşrik günlerinde uygun bir hayvanın (yaş ve sağlık şartlarını taşıyan koyun, keçi, sığır veya deve) kesilmesidir. Enes, Peygamber ﷺ'in kendi elleriyle siyah-beyaz iki koç kestiğini, Allah'ın adını anıp üzerlerine tekbir getirdiğini rivayet etmiştir (Buhari 5558) — bu, mümkün olduğunda kesimi bizzat yapmanın daha faziletli olduğunu, ancak birinin adına yaptırmanın da geçerli olduğunu ortaya koyar.",
      "Kur'an kurbanı doğrudan etinin paylaşılmasına bağlar: '...onlardan yiyin ve ihtiyaç sahibine, yoksula yedirin' (Kur'an 22:36). Et genellikle kişinin kendi hane halkı, aile ve arkadaşları ile fakirler arasında paylaşılır, böylece bu vesile ibadet, cömertlik ve şükrü birleştirir.",
      "Kurban, namazdan önce değil, Bayram namazından sonra kesilmelidir — erkenden kesmiş olan bir sahabîye Peygamber ﷺ bunu tekrar etmesini söylemiştir, çünkü namazdan önce sunulan bir kurban udhiyah olarak sayılmaz. Tam olarak kimin yükümlü olduğu ve kesin zaman aralıkları mezhebe göre değişir; durumunuz için yetkin bir mahalli âlime danışın.",
    ],
    quran: [
      {
        excerpt:
          "...sizin için onlarda hayır vardır. Onları (kesim için) sıraya dizildiklerinde üzerlerine Allah'ın adını anın; yanları üzerine yere düştüklerinde onlardan yiyin, ihtiyacını gizleyene de açıkça isteyene de yedirin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Peygamber ﷺ siyah-beyaz iki koç kesti; onları kendi elleriyle keserken, ayağını yanlarına koyup Allah'ın adını andığını ve tekbir getirdiğini gördüm.",
      },
    ],
    actions: [
      "Gücünüz varsa ve size farz ise kurbanınızı Kurban Bayramı'ndan önce düzenleyin.",
      "Kurbanın namazdan önce değil, sonra kesildiğinden emin olun.",
      "Eti hane halkınız, aile/arkadaşlarınız ve fakirler arasında paylaştırın.",
    ],
    disclaimer:
      "Kurbanın tam olarak kime farz olduğu ve kesim için geçerli tam zaman aralığı, mezhebe göre değişen ayrıntılı fıkıh meseleleridir. Bu genel eğitim içeriğidir, fetva değildir — durumunuz için yetkin bir mahalli âlime danışın.",
  },
];
