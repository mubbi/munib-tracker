import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// tr overlay for fidyah-guide. Index-aligned with FIDYAH_GUIDE_TOPICS in ../fidyah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const FIDYAH_GUIDE_TOPICS_TR: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Kaza mı, fidye mi, keffaret mi?",
    summary: "Üç farklı çözüm; bunları karıştırmayın.",
    body: [
      "Kaçırılan Ramazan oruçlarının hepsi aynı şekilde muamele görmez. Geçici sakatlık (iyileşmeyi beklediğiniz hastalık, seyahat, oruç tutmanın zarar vereceği halde hamilelik veya emzirme ve benzeri mazeretler) daha sonra diğer günlerde oruç tutmakla telafi edilir. Kur'an şöyle der: '...kim hasta olursa veya yolculukta olursa, o kadar başka günler de vardır' (Kuran 2:185).",
      "Fidye (fakirleri doyurmanın fidyesi), oruç tutamayanlar ve günleri telafi etme konusunda gerçekçi bir umudu olmayanlar, yani orucun kendileri için kalıcı bir zorluk olduğu klasik yaşlılar veya kronik hastalar içindir. Kur'an-ı Kerim'de oruç tutmakta zorlanan kimselerin fidye olarak bir fakiri doyurmaktan söz ettiği bildirilmektedir (Bakara, 2:184). Bu ayet sağlıklıyken orucu terk etmeye izin değildir.",
      "Kefaret (kefaret) daha ağırdır. Bu, bir kişinin geçerli bir mazeret olmaksızın, okulların kefaret olarak kabul ettiği şekillerde Ramazan orucunu kasıtlı olarak bozması durumunda geçerlidir; en açık şekilde, Sahih Müslim'deki meşhur rivayette olduğu gibi, Ramazan gündüzleri cinsel ilişki. Kasten yeme veya içmenin de aynı kefareti farz kılıp kılmadığı konusunda mezhepler farklılık göstermektedir. Bu yardımcı yalnızca tutarları tahmin eder; Nitelikli bir yerel bilim adamının durumunuzu sınıflandırması gerekir.",
    ],
    actions: [
      "Daha sonra oruç tutarak günleri telafi edebiliyorsanız fidye değil kaza planlayın.",
      "Oruç tutmak sürekli olarak mümkün değilse, kaçırılan her gün için bir alimden fidye isteyin.",
      "Orucunuzu kasıtlı olarak bozduysanız, bir uygulama tahminine güvenmeyin; bir bilim adamına hangi hükmün geçerli olduğunu sorun.",
    ],
    quran: [
      {
        excerpt:
          "...(Zorlukla oruç tutmaya gücü yetenlere) bir fakiri doyurmanın fidyesi... Kim hasta veya yolculukta olursa, o kadar başka günler.",
      },
    ],
  },
  {
    title: "Kaçırılan oruçların fidyesi nedir?",
    summary: "Kaza mümkün olmadığında kaçırılan her gün için bir fakir doyurulur.",
    body: [
      "Uzun süren zorluklarla oruç tutamayanların Kur'an'daki fidyesi, her gün için bir fakiri doyurmaktır (Bakara, 2:184). Alimler bunu fidye birimi olarak ele alırlar: Bir günlük kaçırılan oruç, bir ihtiyaç sahibi kişinin doyurulmasına (veya bulunduğunuz bölgede yaygın olarak kullanılan gıdanın eşdeğerinin verilmesine) karşılık gelir.",
      "Yiyeceğin kesin ölçüsü (mudd, sa' veya yerel yemek) ve nakit eşdeğerinin kabul edilip edilmeyeceği okula ve yerel fetva konseylerinin uygulamalarına göre değişir. Birçok topluluk, bir fakirin beslenme masrafına göre yıllık fidye miktarı yayınlamaktadır. Toplamı tahmin etmek için o yerel birimi yardımcıya girin; bu bir planlama aracıdır, bağlayıcı bir değerlendirme değil.",
      "Fidye, tövbe etmenin veya asgari sınırın ötesindeki yoksullarla ilgilenmenin yerini almaz. Samimiyetle verin ve daha sonra oruç tutma yeteneğiniz geri gelirse, sizin durumunuzda başka bir kazaya gerek olup olmadığını bir alime sorun.",
    ],
    actions: [
      "Davanızın fidye (sadece kaza değil) olduğunu bir alim ile teyit edin.",
      "Mümkün olduğunda yerel mescidinizin veya belediyenizin günlük fidya ücretini kullanın.",
      "Bir planlama tahmini için gün × bir öğün (veya yayınlanmış fidya birimi) ile çarpın.",
    ],
    quran: [
      {
        excerpt:
          "...Ve (zorlukla oruç tutmaya gücü yetenlere) bir fakiri doyurmanın fidyesi. Kim iyilik yapmaya gönüllü olursa, bu onun için daha hayırlıdır. Ve eğer bilirseniz oruç tutmanız sizin için daha hayırlıdır.",
      },
    ],
  },
  {
    title: "Fidyeyi genellikle kim öder?",
    summary: "Kalıcı yetersizlik – her orucu kaçıran bir durum değildir.",
    body: [
      "Geç oruç yerine fidye için klasik vakalar, oruç tutamayan ve günleri telafi etmeyi makul bir şekilde bekleyemeyen kişilerdir - ileri yaş veya orucun kalıcı zarara neden olacağı kronik bir hastalık gibi. Daha sonra geçen geçici hastalıklar genellikle diğer günlerde oruç tutmakla telafi edilir (Kuran 2:185).",
      "Hamilelik ve emzirme okullarda dikkatle ele alınıyor: bazıları sadece kazaya ihtiyaç duyuyor; diğerleri ise orucun anneye veya çocuğa zarar verebileceği durumlara ek olarak fidyeyi tartışıyor. Tek başına hesap makinesine bakarak karar vermeyin.",
      "Birisi kaçırılan Ramazan orucu borcuyla ölürse, mirasçılar onun adına oruç tutabilir veya sahih raporlara ve bilimsel ayrıntılara göre fakirleri doyurabilir (merhum adına oruç tutmak için bkz. Buhari 1952). Ailenizin durumunu bir bilim adamına sorun.",
    ],
    disclaimer:
      "Hamilelik, emzirme ve kronik hastalıkların sınıflandırılması bilimsel bir yargıdır. Bu konu yalnızca eğitim amaçlıdır.",
    quran: [
      {
        excerpt:
          "...Kim ayın [hilalini] görürse oruç tutsun; Kim hasta veya yolculukta olursa, o kadar başka günler de tutar. Allah sizin için kolaylık diler, zorluk dilemez...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Bir adam dedi ki: Annem oruç sebebiyle vefat etti. Onun adına oruç tutmalı mıyım? Peygamber Efendimiz (sav) şöyle buyurdu: Evet, Allah'ın borcunun ödenmesi daha haktır.",
      },
    ],
  },
  {
    title: "Orucu kasten bozmanın keffareti",
    summary: "Bir köle azad etmek veya art arda altmış oruç tutmak veya altmış fakiri doyurmak.",
    body: [
      "Ebu Hureyre'nin bildirdiğine göre bir adam Peygamber Efendimiz'e (s.a.v.) gelerek, Ramazan ayında oruçluyken hanımıyla ilişkiye girdiği için mahvolduğunu söylemişti. Peygamber ﷺ bir köleyi azat edip edemeyeceğini sordu; sonra iki ay üst üste oruç tutabilir mi; sonra altmış fakiri doyurup besleyemeyeceği ve doyuramadığında ona yardım edip edemeyeceği (Sahih Müslim 1111; ayrıca Buhari 1936).",
      "Bu kademeli kefaret, Ramazan orucu gününde cinsel ilişki keffaretinin metinsel temelidir. Rivayetteki sıra şöyledir: azat etme, sonra altmış gün aralıksız oruç tutma, sonra altmış fakiri doyurma. Her adımdaki yetersizlik, okulların raporu okumasına göre kişiyi bir sonraki seçeneğe taşıyor.",
      "Özürsüz olarak bilerek yemenin veya içmenin de aynı keffareti farz kıldığı mezhepler arasında iyi bilinen bir farklılıktır. Yardımcının 'keffaret' tahmin modelleri, olay birimi başına altmış fakir insanı (veya altmış günlük orucu) doyuruyor - ancak bir alim size keffaretin geçerli olduğunu söyledikten sonra.",
    ],
    actions: [
      "Samimi bir şekilde tövbe edin ve günahtan derhal vazgeçin.",
      "Nitelikli bir alime, eğer varsa, hangi kefareti borçlu olduğunuzu sorun.",
      "Altmış fakiri doyurmak yerine getirebileceğiniz bir seçenekse, planlama rakamı olarak yerel yemek maliyetini × 60 kullanın.",
    ],
    hadith: [
      {
        excerpt:
          "Bir adam dedi ki: Mahvoldum ey Allah'ın Resulü, Ramazan ayında eşimle ilişkide bulundum. Bir köle azad etmesi, iki ay aralıksız oruç tutması ve altmış fakiri doyurması soruldu...",
      },
      {
        excerpt:
          "Peygamber Efendimiz (sav)'in yanında otururken bir adam geldi ve şöyle dedi: Mahvoldum... Oruçluyken hanımıyla ilişkiye girdi...",
      },
    ],
  },
  {
    title: "Bu yardımcı nasıl kullanılır?",
    summary: "Yalnızca tahminler — yerel yemek veya fidya fiyatlarını girin.",
    body: [
      "Fidye tahmini, gün sayısını bir fakir kişiyi (veya yayınlanmış yerel fidya biriminizi) besleme maliyetiyle çarpar. Kefaret tahmini, Sahih Müslim 1111'deki beslenme seçeneğini yansıtacak şekilde olay birimi başına altmış öğünle çarpılır veya bunun yerine bu seçenek seçilirse ardı ardına altmış oruç gününü gösterir.",
      "Tutarları kendi para biriminizde girin. Güvenilir bir yerel mescidin, İslam merkezinin veya ilim meclisinin cari yıl için açıkladığı fidye faizini tercih edin. Hiçbiri yayınlanmazsa, ihtiyaç sahibi bir kişi için temel besleyici bir yemeğin gerçekçi maliyeti, ortak bir planlama vekili olacaktır ve hâlâ bilimsel onaya tabidir.",
      "Ekrandaki toplamı asla fetva olarak görmeyin. Kaza, fidye, keffaret veya tövbe dışında bir borcunuz olup olmadığından emin değilseniz, hesap makinesini durdurun ve durumunuzu bilen bir alime sorun.",
    ],
    disclaimer: "Munib Tracker yalnızca eğitimsel tahminler sağlar. İslami hukuk hükümleri vermez.",
    actions: [
      "Tahmin etmeden önce bu yılın yerel fidya oranına bakın.",
      "Kendi kayıtlarınız için günleri ve tutarları not edin.",
      "Yoksullara ulaşan güvenilir bir kanaldan bağış yapın.",
    ],
  },
];
