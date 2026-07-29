import type { ProphetsGenealogyNode } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// tr overlay for prophets-genealogy. Index-aligned with PROPHETS_GENEALOGY_NODES in ../prophets-genealogy.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const PROPHETS_GENEALOGY_NODES_TR: DeepPartial<ProphetsGenealogyNode>[] = [
  {
    name: "Adem",
    relationNote:
      "Allah, Adem'i kendi eliyle yarattı ve ona isimleri öğretti. O, insanlığın babasıdır; insan ebeveyni değildir.",
  },
  {
    name: "Nuh",
    relationNote:
      "Kur'an, Adem'in soyunun yeryüzüne yayılmasından sonra Nuh'u elçi olarak bildirir, ancak Adem ile Nuh arasındaki ara babaların isimlerini vermez. O, bu dalda Adem'in yanında, Adem'in birinci derece oğlu olarak değil, peygamberlik tarihinde atalardan kalma bir varis olarak görünür.",
  },
  {
    name: "İbrahim",
    relationNote:
      "İbrahim, Kur'an'ın peygamberlik tarihinde Nuh'un torunlarından biridir. Kur'an aralarındaki her nesli listelemez; Nuh'un birinci dereceden oğlu gibi görünmek yerine kendi evinin başkanlığını yapıyor.",
  },
  {
    name: "İsmail",
    relationNote:
      "İsmail İbrahim'in oğludur. Birlikte Kabe'nin temellerini yükselttiler. Kuran'da İbrahim'in sabırlı bir oğulla müjdelenmesi ve kurban hikâyesi anlatılmaktadır.",
  },
  {
    name: "İshak",
    relationNote:
      "İshak, İbrahim'in İsmail'den sonra bahşedilen ve babasıyla birlikte mübarek olan oğludur.",
  },
  {
    name: "Lut",
    relationNote:
      "Kur'an, Lut'u İbrahim'in göçü ve misyonuyla yakından ilişkilendirir ancak Lut'un İbrahim'in oğlu olduğunu belirtmez. Klasik tefsir onu sıklıkla İbrahim'in yeğeni olarak adlandırır. İbrahim'in şubesinde çağdaş bir ortak olarak görünüyor; herhangi bir ebeveyn üstünlüğü iddia edilmiyor.",
  },
  {
    name: "Yakup (İsrail)",
    relationNote:
      "Yakub, İshak'ın oğludur. Allah, İbrahim, İshak ve Yakub'un torunlarına peygamberlik ve kitap verdi.",
  },
  {
    name: "Yusuf",
    relationNote:
      "Yusuf, Yakub'un oğludur. Yusuf Suresi, babası ve kardeşleriyle olan hikâyesini uzun uzun anlatıyor.",
  },
  {
    name: "Musa",
    relationNote:
      "Musa İsrailoğullarındandır. Kur'an, kardeşi Harun'un ve annesinin isimlerini verir, ancak bu ağaca bir peygamber-anne-babanın yazılmasını gerektirmez. Musa-Harun kolunun başıdır.",
  },
  {
    name: "Harun",
    relationNote:
      "Harun, Musa'nın kardeşidir. Musa, Allah'tan Harun'u ailesinden bir yardımcı olarak atamasını istedi. Aynı şubeyi baba-oğul olarak değil, kardeş olarak paylaşıyorlar.",
  },
  {
    name: "Davud",
    relationNote:
      "Dâvûd'a hükümdarlık ve Zebur verildi. Kur'an onun peygamberliğini ve Süleyman'ın ondan miras aldığını tasdik etmektedir.",
  },
  {
    name: "Süleyman",
    relationNote:
      "Süleyman, Davud'un oğludur ve onun krallığını ve peygamberliğini miras almıştır.",
  },
  {
    name: "Zekeriya",
    relationNote: "Zekeriyye, mirasçı için dua eden bir peygamberdi. Allah ona Yahya'yı bağışladı.",
  },
  {
    name: "Yahya",
    relationNote: "Yahya, Zekeriyye'nin babasının duası üzerine bahşedilen oğludur.",
  },
  {
    name: "Meryem",
    relationNote:
      "İmran kızı Meryem, Kuran'da yüceltilmektedir. İsa'nın annesidir ve İsa'nın doğumunda kocası olmamıştır; bu Allah'ın bir işaretidir.",
  },
  {
    name: "İsa",
    relationNote:
      "İsa, Meryem'in, Allah'ın \"Ol\" sözüyle, babasız olarak yarattığı oğludur. Ebeveyn bağlantısı annesi Meryem'e aittir.",
  },
  {
    name: "Muhammed ﷺ",
    relationNote:
      "Peygamber Efendimiz İbrahim oğlu İsmail'in soyundandır. İsmail ile Kureyş arasındaki detaylı isimlendirilmiş nesiller klasik siyerde korunmuştur; Kur'an, her atayı listelemeksizin İbrahim'in mirasını tasdik eder. Burada doğrudan bir baba-oğul ayrımı söz konusu değil; yalnızca mühürlü peygamberlik ve İsmaili soyundan söz ediliyor.",
  },
  // —— v2 appends ——
  {
    name: "Şit (Seth)",
    relationNote:
      "Klasik İslam geleneği Şit'i Adem'in oğlu ve erken nesillerde bir halka olarak anar. Şit ile Nuh arasındaki ara isimler büyük ölçüde İsrailiyat'tır ve sağlam baba bağı olarak çizilmez.",
  },
  {
    name: "İdris",
    relationNote:
      "Kur'an İdris'i yüksek makama yükseltilmiş doğru bir peygamber olarak anar. Klasik listeler onu çoğu kez Adem ile Nuh arasına koyar, ancak Kur'an babasını adlandırmz — baba bağı çizilmez.",
  },
  {
    name: "İmran",
    relationNote:
      "Allah İmran ailesini âlemlere üstün kıldı. Meryem İmran'ın kızıdır. (Bu İmran Meryem'in babasıdır — burada Musa/Harun babası olarak kullanılmaz.)",
  },
  {
    name: "Adnan",
    relationNote:
      "İslam geleneğine göre Muhammed ﷺ Adnan soyundandır ve Adnan İsmail soyundandır — ancak Adnan'dan İsmail'e adlı nesep kayıptır. Adnan Adnani Arapların klasik başıdır; İsmail'e baba bağı çizilmez.",
  },
  {
    name: "Haşim b. Abd Menaf",
    relationNote:
      "Haşim, Beni Haşim'in eponimi ve Peygamber ﷺ'in klasik atasidir. Adnan→Haşim kabile listesi siyerde vardır ama burada ara nesiller olarak atlanır — peygamber değildirler. Haşim bu haritada yakın Haşimi omurgayı yönetir.",
  },
  {
    name: "Abdülmuttalib",
    relationNote:
      "Abdülmuttalib (Şeybe) Peygamber ﷺ'in baba dedesi ve klasik siyerde Haşim'in oğludur.",
  },
  {
    name: "Abdullah b. Abdülmuttalib",
    relationNote:
      "Abdullah, Peygamber Muhammed ﷺ'in babası ve klasik siyerde Abdülmuttalib'in oğludur.",
  },
];
