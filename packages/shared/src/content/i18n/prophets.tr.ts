import type { ProphetsTimelineEvent, ProphetsTopic } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// Turkish translation overlay for the Learn "Prophets" content. Mirrors the order
// of the English source arrays in ../prophets.ts, ../prophets-bios.ts and
// ../prophets-timeline.ts (index-aligned); untranslated entries fall back to
// English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
//
// PROPHETS_TOPICS_TR covers the non-biography topics in the SAME composed order
// used by the accessor: context topics (3), then theme topics (2), then evidence
// topics (2) = 7 items. The 25 biography topics live in PROPHETS_BIO_TOPICS_TR.

export const PROPHETS_TOPICS_TR: DeepPartial<ProphetsTopic>[] = [
  // — context topics —
  {
    title: "Peygamberlere Giriş",
    summary: "Allah neden peygamberler gönderdi ve onların kıssaları bugün neden önemli.",
    body: [
      "Allah, insanlar O'nu tanısın, doğru şekilde ibadet etsin ve adaletle, bir amaç uğruna yaşasın diye peygamberleri rahmet, hidayet ve hüccet olarak gönderdi.",
      "Kur'an'daki kıssaları yalnızca uzak bir tarih değildir; iman, sabır, aile hayatı, liderlik ve tövbe konusunda uygulanabilir derslerdir.",
      "Bütün peygamberlere iman etmek imanın bir parçasıdır. Müslümanlar hepsine saygı gösterir, aşırılıktan kaçınır ve Muhammed sallallahu aleyhi ve sellemin getirdiği son mesaja tabi olur.",
    ],
    quran: [
      {
        excerpt:
          "Müjdeleyici ve uyarıcı olarak gönderilen elçiler, ta ki elçilerden sonra insanların Allah'a karşı bir bahaneleri kalmasın.",
      },
      {
        excerpt:
          "Andolsun, biz her ümmete, 'Allah'a kulluk edin, tağuttan kaçının' diye bir elçi gönderdik.",
      },
    ],
    appLinks: [
      { label: "Peygamberler zaman çizelgesini keşfet" },
      { label: "Muhammed sallallahu aleyhi ve sellemin siretini oku" },
    ],
  },
  {
    title: "İslam'da peygamber nedir?",
    summary: "Vahiy alan ve insanları Allah'a çağıran seçilmiş bir insan.",
    body: [
      "Peygamber, vahiy almak ve insanları tevhide, ibadete ve doğru ahlaka yöneltmek üzere Allah tarafından seçilen bir insandır.",
      "Peygamberler ilah değildir ve asla ibadet edilmezler. İtaatte, ahlakta ve güvenilirlikte yaratılmışların en hayırlısıdırlar, ama yine de Allah'ın kullarıdır.",
      "Görevleri temelde birdir: yalnız Allah'a kulluk. Allah'ın hikmetiyle, toplumlar arasında belirli şeriat hükümleri farklılık gösterebilirdi.",
    ],
    quran: [
      {
        excerpt:
          "Elçileri onlara dedi ki: Biz de ancak sizin gibi birer insanız, fakat Allah kullarından dilediğine lütufta bulunur.",
      },
      {
        excerpt:
          "Senden önce gönderdiğimiz her elçiye, 'Benden başka ilah yoktur, öyleyse bana kulluk edin' diye vahyettik.",
      },
    ],
    appLinks: [
      { label: "Enbiya Suresi'ni oku" },
      { label: "Peygamberler zaman çizelgesini keşfet" },
    ],
  },
  {
    title: "Nebi ile Resul Arasındaki Fark",
    summary: "İkisi de saygın birer peygamber olsa da, ilimde faydalı bir ayrım.",
    body: [
      "İslami ilimlerde yaygın bir ayrım şudur: her resul aynı zamanda bir nebidir, ama her nebi resul değildir. Resul, çoğunlukla bir topluma özel bir görevle gönderilen kişi olarak tanımlanırken, nebi vahiy yoluyla hidayeti sürdürür.",
      "Kur'an her iki terimi de saygıyla kullanır ve Müslümanlar hiçbirini inkâr etmeden tüm nebilere ve resullere iman eder.",
      "Kesin teknik tanımlar âlimlerin ifade tarzına göre değişebilir, ama pratik ders değişmez: vahyi tevazuyla kabul et ve Allah'ın hidayetine tabi ol.",
    ],
    quran: [
      { excerpt: "O seçilmiş biriydi; hem resul hem de nebiydi." },
      { excerpt: "O'nun elçilerinden hiçbirini birbirinden ayırt etmeyiz." },
    ],
    disclaimer:
      "Terminoloji ayrıntıları geniş, mezhep gözetmeyen bir bakış açısıyla sunulmuştur; ileri düzey akaid sınıflandırmaları için yetkin hocalara danışın.",
    appLinks: [{ label: "Meryem Suresi'ni oku" }],
  },
  // — theme topics —
  {
    title: "Peygamberlerden Ortak Dersler",
    summary: "Tekrar eden temalar: tevhid, sabır, tövbe ve ahlaki cesaret.",
    body: [
      "Nesiller boyunca peygamberler tek bir temele çağırdı: yalnız Allah'a kulluk edin ve her türlü şirkten kaçının. Bu, vahyin değişmeyen özüdür.",
      "Hayatları ayrıca, reddedilme karşısında sabrı, belirsizlik anlarında Allah'a güveni ve hikmet ile cesaretle toplumu ıslah etme isteğini de gösterir.",
      "Onları incelemek dayanıklılık kazandırır: mü'minler hızlı tövbe etmeyi, ahlaklı liderlik yapmayı ve hak sevilmese bile ilkeli kalmayı öğrenir.",
    ],
    quran: [
      { excerpt: "Andolsun, onların kıssalarında akıl sahipleri için bir ibret vardır." },
      {
        excerpt:
          "İşte onlar, Allah'ın hidayet ettiği kimselerdir; öyleyse sen de onların yoluna uy.",
      },
    ],
    actions: [
      "Her hafta bir peygamber dersi seç ve onu bilinçli şekilde uygula.",
      "Namazdan sonra, daha fazla sabra veya tövbeye ihtiyacın olan yerleri düşün.",
      "Doğru bir peygamber kıssasını düzenli olarak ailene veya arkadaşlarına anlat.",
    ],
    appLinks: [
      { label: "Peygamberler zaman çizelgesini keşfet" },
      { label: "Canlı örnekler için Siret'i oku" },
    ],
  },
  {
    title: "Nübüvvetin Mucizeleri ve Delilleri",
    summary: "Mucizeler Allah'ın izniyle hakikati doğrular, ama imana zorlamaz.",
    body: [
      "Allah, peygamberlere kendi toplumlarına uygun açık deliller verdi: Nuh'un gemisi, Musa'nın Firavun'un önündeki mucizeleri, İsa'nın Allah'ın izniyle gösterdiği mucizeler ve Muhammed sallallahu aleyhi ve sellem için Kur'an.",
      "Mucizeler peygamberlerin kendi başına sahip olduğu güçler değildir; vahyi desteklemek ve delili ortaya koymak için Allah'ın dilemesiyle gerçekleşir.",
      "Kur'an, bazılarının delillere rağmen yine de inkâr ettiğini gösterir; bu da hidayetin yalnızca gösteriye değil, samimiyete ve teslimiyete bağlı olduğunu kanıtlar.",
    ],
    quran: [
      {
        excerpt:
          "Andolsun, elçilerimizi apaçık delillerle gönderdik ve onlarla birlikte Kitab'ı ve mizanı indirdik.",
      },
      {
        excerpt:
          "De ki: Deliller ancak Allah katındadır… Sana okunmakta olan Kitab'ı indirmemiz onlara yetmedi mi?",
      },
    ],
    appLinks: [
      { label: "Kasas Suresi'ni oku (Musa'nın mucizeleri)" },
      { label: "Meryem Suresi'ni oku (İsa'nın mucizeleri)" },
    ],
  },
  // — evidence topics —
  {
    title: "Kur'an'da Peygamberlere Genel Bakış",
    summary: "Kur'an yirmi beş peygamberi isimlendirir ve tek, tutarlı bir mesaj sunar.",
    body: [
      "Kur'an doğrudan yirmi beş peygamberin adını verir ve pek çok başka elçiye de işaret eder. Kıssaları, tefekkür ve hidayet için surelere yayılmıştır.",
      "Ortamlar farklı olsa da çağrıları birdir: tevhid, salih amel, hesap verilebilirlik ve tövbe yoluyla rahmet.",
      "Bu bölüm Kur'an merkezli kalır ve güvenilir bir delil olmadıkça ikincil tarihi ayrıntıları kısa tutar.",
    ],
    quran: [
      {
        excerpt:
          "Andolsun, senden önce elçiler gönderdik; onlardan sana kıssalarını anlattıklarımız da var, anlatmadıklarımız da var.",
      },
      {
        excerpt:
          "Allah'a ve bize indirilene iman ettik… ve Musa'ya, İsa'ya ve peygamberlere Rablerinden verilene de.",
      },
    ],
    appLinks: [
      { label: "Peygamberler zaman çizelgesini keşfet" },
      { label: "Kur'an okuyucusuna göz at" },
    ],
  },
  {
    title: "Kaynaklar ve Okuma Yöntemi",
    summary: "Peygamberleri özgünlük, denge ve faydayla nasıl inceleyeceğin.",
    body: [
      "Önce Kur'an ayetleriyle başla, sonra sahih hadisi oku, ardından bağlam için güvenilir tefsire başvur. Bu sıralama öğrenmeyi vahye bağlı tutar.",
      "Kur'ani ilkelere veya nübüvvet makamına aykırı sansasyonel ya da zayıf rivayetlerden kaçın. Meşhur her kıssanın senedi sağlam değildir.",
      "Peygamberlerin sirelerini yalnızca tarihi bilgi toplamak için değil, kendi ibadet ve ahlakını ıslah etmek için kullan.",
    ],
    quran: [
      {
        excerpt:
          "Sözü dinleyip onun en güzeline tabi olanlar var ya, işte onlar Allah'ın hidayet ettiği kimselerdir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim ilim öğrenmek için bir yola girerse, Allah ona cennete giden yolu kolaylaştırır.",
      },
    ],
    actions: [
      "Her hafta bir peygamberin kıssasını doğrudan Kur'an'dan oku.",
      "Sadece zaman çizelgesi bilgilerini değil, pratik dersleri de not al.",
      "İkincil rivayetleri güvenilir âlimlerle doğrula.",
    ],
    disclaimer:
      "Tarihi tarihler ve kesin konumlar kaynaklara göre farklılık gösterebilir; bu bölüm üzerinde uzlaşılan, metne dayalı hidayeti önceliklendirir.",
    appLinks: [
      { label: "Peygamberler zaman çizelgesini aç" },
      { label: "Siret çalışmalarına devam et" },
    ],
  },
];

export const PROPHETS_BIO_TOPICS_TR: DeepPartial<ProphetsTopic>[] = [
  // adam
  {
    title: "Âdem aleyhisselam",
    summary: "İlk insan ve ilk peygamber; ilimle onurlandırıldı, itaatle sınandı.",
    body: [
      "Âdem aleyhisselam, insanlık tarihinin ve nübüvvetin başladığı noktadır. Allah onu kendi kudretiyle topraktan yarattı, ona kendi ruhundan üfledi ve ona tüm eşyanın isimlerini öğretti. Melekler Âdem'e saygı secdesi yapmakla emrolununca itaat ettiler — fakat İblis kibrinden dolayı reddetti ve o andan itibaren Âdem'e ve onun soyuna karşı düşmanlığı ilan edildi. Bu açılış sahnesi, her insan hayatının merkezi dramını belirler: alçakgönüllü itaat ile kibirli isyan arasındaki seçim (Kur'an 2:30-39).",
      "Allah, Âdem'i ve eşi Havva'yı Cennet'e yerleştirdi ve bir ağaç dışında her şeye izin verdi. Şeytan'ın fısıltısına kapılıp o ağaçtan yediler. Fakat onlarla İblis arasındaki farka dikkat et: İblis günahını haklı çıkarmaya çalıştı, Âdem ve Havva ise hemen pişmanlık duyup Allah'ın kendilerine öğrettiği şu sözlerle O'na yöneldiler — 'Rabbimiz! Biz kendimize zulmettik; eğer bizi bağışlamaz ve bize merhamet etmezsen mutlaka hüsrana uğrayanlardan oluruz' (Kur'an 7:23). Allah onların tövbesini kabul etti ve onları, gelecek nesillere hidayet vaadiyle yeryüzüne gönderdi.",
      "Âdem'in dersi bir umut dersidir: insan onurlandırılmıştır, ama sınanır ve hata yapar. Mü'mini tanımlayan şey günahsız olmak değildir — kâmil olan yalnızca Allah'tır — bilakis hızlı ve samimi bir şekilde tövbeye dönmektir. Âdem'in kıssası ayrıca, Şeytan'ın açık, ilan edilmiş bir düşman olduğunu ve tek silahının vesvese olduğunu öğretir; cevap Allah'ı anmak ve O'ndan bağışlanma dilemektir. Âdem'den itibaren yeryüzüne inişi bir ceza değil, insanlığın gerçek imtihanının sahnesidir.",
    ],
    profile: {
      nation: "İlk insanlık",
      location: "Önce Cennet, sonra yeryüzü",
      era: "İnsanlık tarihinin başlangıcı",
      mission: "İlk insanlara tevhidi ve Allah'a itaati öğretmek.",
      challenges: [
        "İblis'in düşmanlığı",
        "Yeryüzüne indikten sonraki hayat",
        "İlk insan ailesine rehberlik etmek",
      ],
      miracles: [
        "Ana babasız, Allah'ın emriyle yaratılış",
        "Bütün eşyanın isimlerinin öğretilmesi",
      ],
      majorEvents: [
        "Âdem'in yaratılışı ve isimlerin öğretilmesi",
        "Meleklerin secdesi ve İblis'in reddi",
        "Cennet'teki hata, samimi tövbe ve yeryüzüne iniş",
      ],
      lessons: [
        "İnsan onuru sorumlulukla birlikte gelir",
        "Samimi tövbe her hatadan sonra kapıyı yeniden açar",
        "Şeytan açık, kalıcı bir düşmandır",
      ],
      facts: ["Âdem ilk insan ve ilk peygamberdir", "Onun tövbesi Kur'an'daki ilk tövbe örneğidir"],
    },
    quran: [
      {
        excerpt:
          "Hani Rabbin meleklere demişti ki: Ben yeryüzünde bir halife yaratacağım… Sonra Âdem Rabbinden birtakım kelimeler aldı, Allah da onun tövbesini kabul etti.",
      },
      {
        excerpt:
          "Dediler ki: Rabbimiz! Biz kendimize zulmettik; eğer bizi bağışlamaz ve bize merhamet etmezsen mutlaka hüsrana uğrayanlardan oluruz.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kıyamet günü insanlar Âdem'e gelip: Sen insanlığın babasısın; bizim için Rabbine şefaat et, diyecekler.",
      },
      {
        excerpt:
          "Âdem ile Musa tartıştılar. Musa dedi ki: Sen, Allah'ın kendi eliyle yarattığı kişisin. Âdem dedi ki: Beni yaratılmamdan önce Allah'ın benim için takdir ettiği bir konuda mı kınıyorsun? Böylece Âdem tartışmada Musa'ya galip geldi.",
      },
    ],
    appLinks: [
      { label: "Bakara Suresi bölümlerini oku" },
      { label: "Peygamberler zaman çizelgesini gör" },
    ],
  },
  // idris
  {
    title: "İdris aleyhisselam",
    summary: "Sabrıyla övülen ve Allah'ın yüce bir makama yükselttiği doğru sözlü bir peygamber.",
    body: [
      "İdris aleyhisselam Kur'an'da yalnızca kısaca zikredilir, ama onun hakkındaki her söz bir övgüdür. Allah onu 'doğru sözlü bir kimse, bir peygamber' olarak adlandırır (Kur'an 19:56) ve onu İsmail ile Zülkifl'in yanında sabredenler ve salihler arasında sayar (Kur'an 21:85-86). Onun kıssası, Allah katında bir kişinin karakterinin — doğruluğunun, sabrının, kararlı ibadetinin — biyografisinin uzunluğundan daha önemli olduğunu gösterir.",
      "Allah onun hakkında şöyle buyurur: 'Ve onu yüce bir makama yükselttik' (Kur'an 19:57). Âlimler bunu, onun Allah katındaki yüksek rütbesine işaret olarak anlamışlardır. Kur'an ve sahih rivayetlerin doğruladığının ötesinde, İdris'e atfedilen popüler anlatılar (kalemle yazan ilk kişi olması veya belirli dünyevi meslekler gibi) sağlam bir delille sabit değildir; bu yüzden dikkatli bir mü'min süslemek yerine vahyin doğruladığına bağlı kalır.",
      "İdris'in dersi şudur: Allah'a yakınlık şöhretle veya uzun bir hikâyeyle ölçülmez, samimiyet ve istikrarla ölçülür. Sessiz, doğru sözlü, kararlı bir kul, tarihin adını yüksek sesle andığı nicelerinden daha yüksek bir mertebeye Allah katında sahip olabilir.",
    ],
    profile: {
      era: "Âdem'den sonraki ilk nesiller",
      mission: "İnsanları doğrulukla ve salih amelle Allah'a kulluğa çağırmak.",
      lessons: [
        "Doğruluk bir kulun mertebesini yükseltir",
        "Her peygamberin kıssası ayrıntılı anlatılmaz — ve bu bilinçli bir tercihtir",
        "İstikrarlı, sadık kararlılık Allah'ın sevdiği bir haldir",
      ],
      facts: [
        "Kur'an'da doğru sözlü ve peygamber olarak anılır",
        "Allah tarafından yüce bir makama yükseltildiği bildirilir",
      ],
    },
    quran: [
      {
        excerpt:
          "Kitap'ta İdris'i de an. Şüphesiz o doğru sözlü bir kimse, bir peygamberdi. Ve onu yüce bir makama yükselttik.",
      },
      {
        excerpt:
          "İsmail, İdris ve Zülkifl de — hepsi sabredenlerdendi. Onları rahmetimize kattık; şüphesiz onlar salihlerdendi.",
      },
    ],
    appLinks: [{ label: "Meryem Suresi'ni oku" }, { label: "Peygamberler zaman çizelgesini gör" }],
  },
  // nuh
  {
    title: "Nuh aleyhisselam",
    summary: "Tufandan önce kavmini asırlarca davet eden, olağanüstü sabır sahibi bir elçi.",
    body: [
      "Nuh aleyhisselam, tevhidi bırakıp putlara tapmaya başlamış bir topluma gönderildi. Onun tek, değişmez mesajı şuydu: 'Ey kavmim! Allah'a kulluk edin; sizin O'ndan başka ilahınız yoktur' (Kur'an 7:59). Kur'an, Nuh Suresi'nde görevinin kendi anlatımını korur: onları gece gündüz, açık ve gizli çağırdı, hem teşvik hem uyarıda bulundu — Allah'a dönmenin yağmur, mal, çocuklar ve bahçeler getirdiğini hatırlattı. Yine de nesiller boyu çoğu yüz çevirdi, parmaklarını kulaklarına tıkadı ve daha da kibirlendi (Kur'an 71:1-28).",
      "Kur'an, sabrının uzunluğunu vurgular: aralarında 'elli yıl eksik bin yıl' kaldı (Kur'an 29:14), yine de yalnızca birkaç kişi iman etti. Artık kimsenin imana gelmeyeceği açıkça belli olunca Allah ona, kâfirler alay ederken, ilahi talimatla gemi yapmasını emretti. Sonra tufan sular bir hüküm olarak geldi. Nuh'un kendi oğlu, babasının uyarısı yerine bir dağa güvenip gemiye binmeyi reddetti ve boğulanlar arasına katıldı — kan bağının imanın yerini tutamayacağının acı bir hatırlatıcısı (Kur'an 11:42-46).",
      "Nuh'un kıssası, Kur'an'ın davet konusundaki başyapıtıdır: davetçinin görevi samimi, sabırlı, açık bir tebliğdir — sonuçlar yalnızca Allah'a aittir. Ayrıca hidayetin soydan değil kalpten geldiğini öğretir: bir peygamberin oğlu kaybolabilirken yabancılar kurtulabilir. Gemiye binen mü'minler yeni bir insanlığın tohumu oldular ve Nuh, azim sahibi beş büyük elçiden (ulül-azm) biri olarak onurlandırılır.",
    ],
    profile: {
      nation: "Tufandan önceki kavmi",
      location: "Antik Mezopotamya bölgesi (genel olarak belirtilir)",
      era: "Çok erken çağ",
      mission: "Kavmini tevhide ve tövbeye çağırmak.",
      challenges: [
        "Liderlerin ve seçkinlerin alayı",
        "Asırlarca inkâr ve çok az mü'min",
        "Kendi oğlunun inkârı ve boğulması",
      ],
      miracles: ["İlahi talimatla yapılan gemi", "Tufan aracılığıyla mü'minlerin kurtuluşu"],
      majorEvents: [
        "Neredeyse bin yıl süren tevhid çağrısı",
        "Allah'ın emriyle geminin inşası",
        "Tufan ve mü'minler için yeni bir başlangıç",
      ],
      lessons: [
        "Davette sebat etmek, sonucu Allah'a bırakmak",
        "Kan bağı imanın yerini tutamaz",
        "Allah her zaman samimi olanları kurtarır",
      ],
      facts: [
        "Azim sahibi beş elçiden (ulül-azm) biridir",
        "Kıssası, biri kendi adını taşıyan olmak üzere birçok surede geçer",
      ],
    },
    quran: [
      {
        excerpt:
          "Nuh'a şöyle vahyedildi: Kavminden, daha önce iman etmiş olanlardan başkası asla iman etmeyecek; artık onların yaptıklarına üzülme.",
      },
      {
        excerpt:
          "Dedi ki: Rabbim! Ben kavmimi gece gündüz davet ettim, fakat davetim onların ancak kaçışını artırdı.",
      },
    ],
    hadith: [
      {
        excerpt:
          "İnsanlar Nuh'a gelip: Ey Nuh! Sen yeryüzü halkına gönderilen ilk elçisin ve Allah seni şükreden bir kul diye adlandırdı; bizim için şefaat et, diyecekler.",
      },
    ],
    appLinks: [{ label: "Nuh Suresi'ni oku" }, { label: "Peygamberler zaman çizelgesini gör" }],
  },
  // hud
  {
    title: "Hud aleyhisselam",
    summary: "Gücünü kibre çeviren güçlü ve iri yapılı bir kavim olan Âd'a gönderildi.",
    body: [
      "Hud aleyhisselam, Kur'an'ın 'benzeri yeryüzünde hiç yaratılmamış' yapılar inşa etmesiyle ünlü, bedenen güçlü bir uygarlık olarak tanımladığı Âd kavmine gönderildi (Kur'an 89:6-8). Bu kibirli kavme Hud, her peygamberin getirdiği aynı mesajı getirdi: 'Ey kavmim! Allah'a kulluk edin; sizin O'ndan başka ilahınız yoktur. Sakınmaz mısınız?' (Kur'an 7:65). O da onlardandı, hiçbir karşılık istemiyor, yalnızca onları şükre ve zulümden uzaklaşmaya çağırıyordu.",
      "Liderleri alayla karşılık verdi, onu akılsızlık ve yalancılıkla suçladılar, atalarının putlarına sarıldılar. Hiçbir gücün kendi kudretlerine denk olamayacağına güvenerek onu, uyardığı azabı getirmekle meydan okudular (Kur'an 46:21-25). Hud onlara açıkça uyardı: dünyevi güç ve büyük medeniyet, Allah'ın ayetlerini inkâr edip yeryüzünde kibirlenen hiç kimseyi korumaz.",
      "Hüküm, Allah'ın 'yedi gece sekiz gün ardı ardına üzerlerine musallat ettiği' (Kur'an 69:6-7) şiddetli, uğultulu bir rüzgâr olarak geldi ve bir zamanlar güçlü olan kavmi içi boş kütükler gibi devirdi — Hud ve mü'minler ise Allah'ın rahmetiyle kurtuldu. Âd'ın kıssası Kur'an boyunca sürekli bir uyarı olarak tekrarlanır: güç, servet ve başarı, kibirle değil tevazu ve şükürle karşılanması gereken armağanlardır. Bir millet, ne kadar ileri gitmiş olursa olsun Allah'a karşı sorumludur.",
    ],
    profile: {
      nation: "Âd kavmi",
      location: "Ahkaf bölgesi (klasik tefsirde güney Arabistan)",
      era: "Nuh'tan sonra",
      mission: "Âd'da tevhidi, şükrü ve adaleti yeniden tesis etmek.",
      challenges: [
        "Güç ve servete dayalı toplu kibir",
        "Vahiy ve peygamberle alay edilmesi",
        "Anında azap için inatçı bir talep",
      ],
      miracles: ["Azap sırasında mü'minlerin korunması"],
      majorEvents: [
        "Tövbe ve şükre çağrı",
        "Şiddetli bir rüzgâr uyarısı",
        "Âd'ın yedi gece sekiz günde helâk edilmesi",
      ],
      lessons: [
        "Tevazusuz güç yıkıma götürür",
        "Milletler ve medeniyetler Allah'a karşı sorumludur",
        "Peygamber uyarıları azaptan önce bir rahmettir",
      ],
      facts: ["Âd'ın kıssası, sonraki topluluklara uyarı olarak Kur'an'da tekrar tekrar geçer"],
    },
    quran: [
      {
        excerpt:
          "Âd kavmine kardeşleri Hud'u gönderdik. Dedi ki: Ey kavmim! Allah'a kulluk edin; sizin O'ndan başka ilahınız yoktur. Sakınmaz mısınız?",
      },
      {
        excerpt:
          "Onu vadilerine doğru gelen bir bulut olarak görünce dediler ki: Bu bize yağmur getirecek bir buluttur! Hayır, o sizin acele istediğiniz şeydir: içinde acı bir azap bulunan bir rüzgâr.",
      },
    ],
    appLinks: [{ label: "Ahkaf Suresi'ni oku" }, { label: "Peygamberler zaman çizelgesini gör" }],
  },
  // salih
  {
    title: "Salih aleyhisselam",
    summary:
      "Semud'a gönderildi; kendisine deve mucizesi verildi ve onlar istedikleri mucizeyi öldürdüler.",
    body: [
      "Salih aleyhisselam, Âd'dan sonra gelen ve dağlarda görkemli evler oyup rahat bir hayat sürmesiyle tanınan Semud kavmine gönderildi (Kur'an 7:74). Onları, kendi kardeşleri olarak, yalnızca Allah'a kulluk etmeye ve liderlerinin fesadını terk etmeye çağırdı. Onun doğruluğunu kanıtlamak için bir mucize istediklerinde, Allah açık ve herkesin görebileceği bir mucize verdi: bir dişi deve, belirli bir düzenle bir gün suyu onun içeceği, diğer gün onların içeceği şekilde (Kur'an 26:155-156).",
      "Salih onları açıkça uyardı: 'Ona bir kötülükle dokunmayın, yoksa sizi yakın bir azap yakalar' (Kur'an 26:156). Bu mucize bir öz denetim sınavıydı — Allah'ın koyduğu bir sınıra saygı gösterebilecekler miydi? Fakat aralarındaki en azgın kişi açık bir isyanla deveyi kesip öldürdü, sonra Salih'e vadedilen azabı getirmesi için meydan okudu (Kur'an 7:77). Devenin öldürülmesi birkaç bedbahtın eylemi olarak adlandırılsa da, tüm kavim buna razı olarak suça ortak oldu.",
      "Azap üç gün içinde geldi: şiddetli bir gürleme ve deprem onları evlerinde yakaladı ve Semud cansız yere serildi — Allah ise Salih'i ve iman edenleri kurtardı (Kur'an 7:78-79; 91:14). Ders keskindir: mucizeler inatçı bir kalbi yumuşatmaz; yalnızca hesap verme yükünü artırır. İstenip sonra karşı gelinen bir mucize, isteyenlerin aleyhine bir delil olur. Kötülük karşısında sessizlik tarafsızlık değildir — birkaç kişinin eylemi için tüm kavim sorumlu tutuldu.",
    ],
    profile: {
      nation: "Semud kavmi",
      location: "Hicr / kuzeybatı Arabistan",
      era: "Âd'dan sonra",
      mission: "Semud'u putperestlik ve fesattan tevhide çağırmak.",
      challenges: [
        "Bir mucize talebi, sonra onun reddi",
        "Açık mucizeden sonra alenî isyan",
        "Salih'e ve mü'minlere yönelik tehditler",
      ],
      miracles: ["Allah'tan görünür bir mucize olarak gönderilen dişi deve"],
      majorEvents: [
        "Devenin ortaya çıkışı ve sırayla su içme",
        "Devenin kesilip öldürülmesi",
        "İnkârcıları helâk eden gürleme",
      ],
      lessons: [
        "Mucizeler inatçı bir kalbe fayda vermez",
        "Allah'ın koyduğu bir sınırı çiğnemenin gerçek sonuçları vardır",
        "Kötülüğe razı olmak onun suçuna ortak eder",
      ],
      facts: ["Semud, dağlarda görkemli evler oymasıyla tanınırdı"],
    },
    quran: [
      {
        excerpt:
          "Bu, Allah'ın dişi devesidir, sizin için bir mucizedir; bırakın onu Allah'ın toprağında otlasın ve ona kötülükle dokunmayın, yoksa sizi acı bir azap yakalar.",
      },
      {
        excerpt:
          "Semud, azgınlığı yüzünden yalanladı; içlerinden en bedbaht olanı ayağa kalktığında… Rableri günahları sebebiyle üzerlerine helâk indirdi ve onları yerle bir etti.",
      },
    ],
    appLinks: [{ label: "Şems Suresi'ni oku" }, { label: "Peygamberler zaman çizelgesini gör" }],
  },
  // ibrahim
  {
    title: "İbrahim aleyhisselam",
    summary:
      "Halilullah, Allah'ın dostu ve saf tevhidin örneği; her sınavda denendi ve başarılı oldu.",
    body: [
      "İbrahim aleyhisselam, Kur'an'da tefekkür ve cesaretle ulaşılan saf tevhidin en yüce örneğidir. Putperestliğe boğulmuş bir toplumda genç bir adam olarak kavmiyle, babasıyla, hatta kralla açıkça tartıştı: güneş, ay ve yıldızlar batıp kayboluyorsa, bunlar nasıl ilah olabilir? (Kur'an 6:75-79). Putların çaresizliğini göstermek için en büyüğü hariç hepsini kırdı ve kavmine, olanları putların kendilerine sormalarını söyledi — bu da onları, ilahlarının ne konuşabildiğini ne de kendilerini savunabildiğini kabul etmeye zorladı (Kur'an 21:57-67).",
      "Bu duruşu yüzünden alevli bir ateşe atıldı, fakat Allah emretti: 'Ey ateş! İbrahim'e karşı serin ve esenlik ol' (Kur'an 21:69) ve o zarar görmeden çıktı. Hayatı, tam bir teslimiyetle karşılanan sınavlar zincirine dönüştü: Allah uğruna vatanını terk etti, ileri yaşta salih bir evlat için dua etti ve kendisine İsmail ile İshak verildi, sevgili oğlunu kurban etme emriyle sınandı — Allah çocuğu fidyeyle kurtarmadan önce hem baba hem oğul teslimiyetle bunu kabul etti — ve İsmail ile birlikte Mekke'de Kâbe'nin temellerini yükseltti, mü'min bir ümmet ve aralarına bir elçi gönderilmesi için dua ederek (Kur'an 2:124-129; 37:100-107).",
      "Bu eşsiz bağlılık sebebiyle Allah İbrahim'i halil — yakın dost — edindi (Kur'an 4:125) ve onu tüm insanlığa önder, bir imam kıldı (Kur'an 2:124). Mirası, onun soyundan gelen peygamberler aracılığıyla, Hac ibadetleri aracılığıyla ve 'hakka yönelerek İbrahim'in dinine' tabi olmakla emrolunan Müslümanın kimliği aracılığıyla devam eder (Kur'an 3:95). Kıssası, en zorlu sınavlarda tevekkülü, gerçek liderliğin fedakârlık üzerine kurulduğunu ve samimi imanın tüm nesilleri değiştirebileceğini öğretir.",
    ],
    profile: {
      nation: "Mezopotamya ve Levant toplulukları",
      location: "Irak, Levant ve Mekke",
      era: "Orta antik çağ",
      mission: "Saf tevhidi yeniden canlandırmak ve kalıcı bir teslimiyet mirası kurmak.",
      challenges: [
        "Putperestlerle, kendi babasıyla ve zalim bir kralla yüzleşmek",
        "Allah uğruna vatanından göç etmek",
        "Sevgili oğlunu kurban etme sınavı",
      ],
      miracles: [
        "Ateşin Allah'ın emriyle serin ve güvenli hale gelmesi",
        "İleri yaşta salih bir evladın verilmesi",
      ],
      majorEvents: [
        "Putlarla tartışma ve onları kırma",
        "Ateşe atılıp kurtarılma",
        "İsmail ile Kâbe'yi inşa etme ve büyük kurban sınavı",
      ],
      lessons: [
        "En ağır sınavlarda Allah'a tevekkül",
        "Gerçek liderlik fedakârlık gerektirir",
        "Samimi iman nesilleri değiştirebilir",
      ],
      facts: [
        "Halilullah, Allah'ın yakın dostu olarak bilinir",
        "İsmail ve İshak aracılığıyla peygamberlerin atası",
      ],
    },
    quran: [
      {
        excerpt:
          "Hani İbrahim'i Rabbi birtakım emirlerle sınamış, o da onları yerine getirmişti. Buyurdu ki: Seni insanlara önder kılacağım.",
      },
      {
        excerpt:
          "Dedik ki: Ey ateş! İbrahim'e karşı serin ve esenlik ol. Ona kötülük yapmak istediler, ama biz onları en büyük hüsrana uğrattık.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Yalınayak, çıplak ve sünnetsiz olarak haşrolunacaksınız. Kıyamet günü ilk giydirilecek kişi İbrahim olacaktır.",
      },
    ],
    appLinks: [
      { label: "Bakara Suresi'ni oku" },
      { label: "Siret'ten öğren" },
      { label: "Peygamberler zaman çizelgesini gör" },
    ],
  },
  // lut
  {
    title: "Lut aleyhisselam",
    summary:
      "Kavmini, kendilerinden önce hiçbir milletin yapmadığı ağır bir ahlaksızlığa karşı uyaran bir peygamber.",
    body: [
      "Lut aleyhisselam, İbrahim'in çağdaşı ve akrabasıydı; onunla birlikte göç etti ve ardından Sodom ile çevresindeki kasabaların halkına gönderildi. Yalnızca Allah'a kulluk çağrısının yanında, kavmi Kur'an'ın 'âlemlerde hiç kimsenin daha önce yapmadığı' dediği utanmaz bir ahlaksızlığı işliyordu — kadınlar yerine erkeklere yönelmek ve topluluklarında alenen edepsizlik yapmak (Kur'an 7:80-81; 29:28-29). Lut onları samimiyetle, temizliğe ve Allah'ın koyduğu doğal sınırlara çağırdı.",
      "Islahına, tartışmayla değil düşmanlıkla karşılık verdiler, onu sürgün etmekle tehdit ettiler ve edep çağrısıyla alay ettiler: 'Onları kasabanızdan çıkarın; onlar kendilerini temiz tutan insanlarmış!' (Kur'an 7:82). Kendi evinde bile sınav ağırdı — eşi bozulmuş olanlardan yana çıkıp iman etmedi; bu da yine hidayetin evlilik veya kan bağıyla değil, Allah tarafından verildiğini kanıtladı (Kur'an 66:10).",
      "Hüküm geldiğinde Allah, misafir kılığında melekler gönderdi. Kavim onlara bile zarar vermeye koştu ve melekler kimliklerini açıklayıp ona mü'minlerle birlikte geceleyin ayrılmasını söyleyene kadar Lut kendini çaresiz hissetti. Şafak vakti kasabalar altüst edildi ve taş yağmuruna tutuldu (Kur'an 11:77-83). Lut'un kıssası, ahlaki hakikatin bir toplum günahı onaylayıp aleni hale getirse bile değişmediğinin ve Allah'ın samimi olanları — ne kadar az olurlarsa olsunlar — her zaman kurtardığının açık bir uyarısıdır.",
    ],
    profile: {
      nation: "Sodom ve komşu kasabaların halkı",
      location: "Ölü Deniz bölgesi (genel olarak belirtilir)",
      era: "İbrahim'in zamanı",
      mission: "Kavmini alenî edepsizlikten ve küfürden tevhide ve temizliğe çağırmak.",
      challenges: [
        "Kökleşmiş toplumsal ahlaksızlık",
        "Alay ve sürgün tehditleri",
        "Kendi eşinin inkârı",
      ],
      majorEvents: [
        "Edepsizliğe karşı sürekli uyarılar",
        "Meleklerin misafir kılığında ziyareti",
        "Kasabaların altüst edilmesi",
      ],
      lessons: [
        "Ahlaki hakikat toplumsal onayla değişmez",
        "Mü'minler çok az sayıda olabilir",
        "Allah samimi olanları toplu yıkımdan kurtarır",
      ],
      facts: ["İbrahim'in kendisiyle göç eden ve Sodom'a gönderilen bir akrabası"],
    },
    quran: [
      {
        excerpt:
          "Siz âlemler içinde erkeklere mi gidiyorsunuz ve Rabbinizin sizin için yarattığı eşlerinizi mi bırakıyorsunuz? Hayır, siz sınırı aşan bir kavimsiniz.",
      },
      {
        excerpt:
          "Emrimiz gelince, o şehirlerin üstünü altına getirdik ve üzerlerine istif edilmiş sert kil taşları yağdırdık.",
      },
    ],
    appLinks: [{ label: "Şuara Suresi'ni oku" }, { label: "Peygamberler zaman çizelgesini gör" }],
  },
  // ismail
  {
    title: "İsmail aleyhisselam",
    summary:
      "Sözüne sadık, sınavda sabırlı ve babası İbrahim ile birlikte Kâbe'nin mimarı bir peygamber.",
    body: [
      "İsmail aleyhisselam, İbrahim'in ileri yaşta verilen ilk oğluydu. Hayatı, sarsıcı bir güven sınavıyla başladı: Allah'ın emriyle İbrahim, bebek İsmail'i ve annesi Hacer'i, ne ekin biten ne su akan Mekke'nin çorak vadisinde bıraktı. Hacer, Safa ile Merve tepeleri arasında su ararken Allah, Zemzem pınarını fışkırttı — Hacer'in soyunun ve her hacının bugün hâlâ Hac ve Umre'nin sa'yinde tekrarladığı bir rızık lütfu.",
      "Genç bir adamken İsmail, babasıyla birlikte en büyük sınavla karşılaştı: İbrahim ona, kendisini kurban etme rüyasını anlattığında İsmail nefes kesici bir teslimiyetle karşılık verdi: 'Babacığım! Emrolunduğun şeyi yap; inşallah beni sabredenlerden bulacaksın' (Kur'an 37:102). İkisi de tam bir teslimiyetle boyun eğdi ve Allah, İsmail'i büyük bir kurbanla fidye ederek onların itaatini ebediyen onurlandırdı. Sonra baba ve oğul birlikte Kâbe'nin temellerini yükselttiler ve dua ettiler: 'Rabbimiz! Bunu bizden kabul et; şüphesiz Sen işitensin, bilensin' (Kur'an 2:127).",
      "Kur'an, onun karakterini akılda kalıcı bir cümlede özetler: 'O sözüne sadıktı ve bir resul, bir nebiydi. Ailesine namazı ve zekâtı emrederdi ve Rabbinin katında hoşnutluğa layıktı' (Kur'an 19:54-55). İsmail'in hayatı, söz tutmanın güzelliğini, kararlı ibadeti ve bir ailenin Allah'a itaatte iş birliği yapabileceğini öğretir. Onun aracılığıyla Arap peygamberlik silsilesi sonunda son Peygamber Muhammed sallallahu aleyhi ve selleme ulaştı.",
    ],
    profile: {
      nation: "Mekke bölgesinin ilk sakinleri",
      location: "Mekke",
      era: "İbrahim'in göçünden sonra",
      mission: "Tevhidi ve ibadeti korumak, ailesine namazı ve zekâtı emretmek.",
      challenges: [
        "Çorak bir vadide hayatın sert başlangıcı",
        "Kurban sınavı",
        "İbadet merkezli bir hayatı ve kutsal emaneti sürdürmek",
      ],
      miracles: [
        "Çölde Zemzem pınarının verilmesi",
        "Kurban etmekten Allah tarafından fidye ile kurtarılma",
      ],
      majorEvents: [
        "Annesi Hacer ile Mekke vadisinde bırakılma",
        "Tam teslimiyetle karşılanan kurban sınavı",
        "İbrahim ile Kâbe'yi inşa etme",
      ],
      lessons: [
        "Sözlerine sadakatle bağlı kal",
        "Bir aile ibadette ve itaatte iş birliği yapabilir",
        "Kutsal bir miras güçlü bir karakter gerektirir",
      ],
      facts: [
        "Kur'an'da sözüne sadık olarak tanımlanır",
        "Arap kabilelerinin ve son peygamberlik silsilesinin atası",
      ],
    },
    quran: [
      {
        excerpt:
          "Kitap'ta İsmail'i de an. Şüphesiz o sözüne sadıktı ve bir resul, bir nebiydi. Ailesine namazı ve zekâtı emrederdi ve Rabbinin katında hoşnutluğa layıktı.",
      },
      {
        excerpt:
          "İbrahim ve İsmail, Beyt'in temellerini yükseltirken (dua ettiler): Rabbimiz! Bunu bizden kabul et. Şüphesiz Sen işitensin, bilensin.",
      },
    ],
    appLinks: [
      { label: "Meryem Suresi'ni oku" },
      { label: "Siret'ten öğren" },
      { label: "Peygamberler zaman çizelgesini gör" },
    ],
  },
  // ishaq
  {
    title: "İshak aleyhisselam",
    summary: "İbrahim'e müjde olarak verilen mübarek bir peygamber ve Yakub'un babası.",
    body: [
      "İshak aleyhisselam, İbrahim'e ve eşi Sare'ye ileri yaşlarında verildi — çocuk yaşını geçmiş olan Sare'nin şaşkınlıkla güldüğü, meleklerin müjdelediği bir doğum. Kur'an bu anı şöyle kaydeder: 'Ona İshak'ı, İshak'ın ardından da Yakub'u müjdeledik' (Kur'an 11:71). Doğumunun kendisi, Allah'ın kudretinin ve rahmetinin sıradan insani sınırlarla bağlı olmadığının bir işaretiydi ve zor bir umudu bekleyen her mü'mine bir tesellidir.",
      "Kur'an, İshak'ı sürekli olarak salihler, seçkinler ve şerefli peygamberler arasında sayar; onu ve Yakub'u 'ibadet ve basirette güç sahibi' olarak tanımlar (Kur'an 38:45-47). İshak aracılığıyla Yakub (İsrail) geldi ve Yakub'dan Beni İsrail'e gönderilen uzun bir peygamberler zinciri türedi — böylece İshak, nesiller boyu hidayetin sürekliliğinde bir halka, nübüvvetin bir babası olarak durur.",
      "Kıssası kısaca anlatılsa da iki kalıcı ders taşır: Allah'ın beklentimizin ötesinde bahşettiği nimetlere şükür ve salih bir soyun bir emanet olduğu bilinci — iman miras kalmaz, aktarılması gerekir. İbrahim'in hanesine konan bereket, Allah'a adanmış kullar tarafından taşındığı için korunmuştur.",
    ],
    profile: {
      nation: "Levant toplulukları",
      location: "Levant (Şam)",
      era: "İbrahim'den sonra",
      mission: "İbrahim'in mübarek aile silsilesinde peygamberlik hidayetini sürdürmek.",
      miracles: ["Yaşlı ana babaya müjde olarak verilen bir doğum"],
      majorEvents: [
        "İbrahim ve Sare'ye verilen müjde",
        "Yakub aracılığıyla peygamberlik silsilesinin devamı",
      ],
      lessons: [
        "Allah insan beklentisinin çok ötesinde bahşeder",
        "Salih soy korunması gereken bir emanettir",
        "Sadık bir devamlılık hidayeti canlı tutar",
      ],
      facts: ["Yakub'un babası", "İbrahim ve Yakub ile birlikte seçkin bir aile olarak anılır"],
    },
    quran: [
      {
        excerpt: "Eşi ayaktaydı, güldü. Ona İshak'ı, İshak'ın ardından da Yakub'u müjdeledik.",
      },
      {
        excerpt:
          "Kuvvet ve basiret sahibi kullarımız İbrahim'i, İshak'ı ve Yakub'u an. Şüphesiz onları özel bir özellikle — ahiret yurdunu anmakla — seçtik.",
      },
    ],
    appLinks: [{ label: "Hud Suresi'ni oku" }, { label: "Peygamberler zaman çizelgesini gör" }],
  },
  // yaqub
  {
    title: "Yakub aleyhisselam",
    summary:
      "İsrail olarak da anılır; kederde gösterdiği güzel sabır, Allah'a sarsılmaz güvenin bir örneğidir.",
    body: [
      "Yakub aleyhisselam, İsrail olarak da anılır; İshak'ın oğlu ve Beni İsrail'in oymakları haline gelen on iki oğlun babasıydı — bunlardan biri de Yusuf'tu. Çocuklarını tevhid üzere yetiştirdi ve Kur'an, ölüm döşeğinde onlardan aldığı ahdi korur: 'Benden sonra kime kulluk edeceksiniz?' Cevap verdiler: 'Senin ilahına ve ataların İbrahim'in, İsmail'in ve İshak'ın ilahına kulluk edeceğiz… tek bir ilaha, ve biz O'na teslim olanlarız' (Kur'an 2:132-133). En derin kaygısı, sonuna kadar, sonraki neslin imanıydı.",
      "Büyük sınavı Yusuf'un kıssası içinde açılır. Oğulları, Yusuf'un gömleğiyle ve onu bir kurdun yediği yalanıyla döndüklerinde Yakub aldatmacayı sezdi ve öfke yerine öz denetimle karşılık verdi: 'Sabretmek daha uygundur; anlattığınız şeye karşı yardımı istenecek olan ancak Allah'tır' (Kur'an 12:18). Uzun ayrılık yıllarında öylesine üzüldü ki, Kur'an'ın dokunaklı bir şekilde ifade ettiği gibi, gözleri hüzünden ağardı — yine de kederini bastırdı ve asla umutsuzluğa kapılmadı (Kur'an 12:84).",
      "Yakub'un örneğinin özü tek bir cümledir: 'Allah'ın rahmetinden umut kesmeyin; şüphesiz Allah'ın rahmetinden ancak kâfirler umut keser' (Kur'an 12:87). Bu, sabr-ı cemil — güzel sabır — örneğidir; edilgen bir teslimiyet değil, Allah'ın hikmetinin zamanında ortaya çıkacağına dair etkin, umutlu bir güvendir. Yusuf sonunda ona kavuşup görme yetisi geri döndüğünde, bu sabır doğrulandı. Yakub, her kederli mü'mine hem hüznü hem kesin inancı aynı kalpte taşımayı öğretir.",
    ],
    profile: {
      nation: "Beni İsrail'in kökenleri",
      location: "Levant, Mısır'a göçle birlikte",
      era: "Yusuf'un nesli",
      mission: "Ailesine ve soyuna tevhid üzere rehberlik etmek.",
      challenges: [
        "Oğulları arasındaki gerginlik ve kıskançlık",
        "Yusuf'tan uzun süreli ayrılık",
        "Umudu kaybetmeden derin kederi taşımak",
      ],
      majorEvents: [
        "Oğullarına tevhid nasihati ve ahdi",
        "Yusuf için uzun yıllar süren sabırlı keder",
        "Mısır'da Yusuf ile mutlu kavuşma",
      ],
      lessons: [
        "Güzel sabır (sabr-ı cemil) etkin, umutlu bir imandır",
        "Ana babalar çocuklarının iman mirasını şekillendirir",
        "Allah'ın rahmetinden asla umut kesme",
      ],
      facts: ["İsrail olarak da anılır", "Yusuf'un ve Beni İsrail oymaklarının babası"],
    },
    quran: [
      {
        excerpt:
          "Dedi ki: Hayır, nefisleriniz sizi bir işe sürüklemiş. Artık bana düşen güzel bir sabırdır. Umulur ki Allah onların hepsini bana getirir.",
      },
      {
        excerpt:
          "Dediler ki: Senin ilahına ve ataların İbrahim'in, İsmail'in ve İshak'ın ilahına kulluk edeceğiz — tek bir ilaha, ve biz O'na teslim olanlarız.",
      },
    ],
    appLinks: [{ label: "Yusuf Suresi'ni oku" }, { label: "Peygamberler zaman çizelgesini gör" }],
  },
  // yusuf
  {
    title: "Yusuf aleyhisselam",
    summary:
      "Bir kuyudan Mısır tahtına uzanan yolculuğu iffet, sabır ve affı öğreten bir peygamber.",
    body: [
      "Yusuf aleyhisselam, Kur'an'ın en eksiksiz tek anlatısının — Allah'ın 'en güzel kıssa' dediği (Kur'an 12:3) Yusuf Suresi'nin — konusudur. Çocukken on bir yıldızın, güneşin ve ayın kendisine secde ettiğini gören gerçek bir rüya gördü. Kıskanç kardeşleri onu bir kuyuya attı ve Mısır'da köle olarak sattı; orada nüfuzlu bir memurun evine satın alındı. Her ters durumda Yusuf, imanını ve dürüstlüğünü korudu.",
      "İffeti, efendisinin karısı onu baştan çıkarmaya çalıştığında sınandı. 'Allah'a sığınırım' diyerek reddetti ve günaha karşı hapsi tercih etti: 'Zindan bana, onların beni davet ettiği şeyden daha sevimlidir' (Kur'an 12:33). Masum olmasına rağmen yıllarca hapsedildi — orada bile hapishane arkadaşlarını tevhide çağırdı ve rüyalarını yorumladı. Kralın yedi yıllık kıtlık hakkındaki rüyası sarayı şaşırttığında, Yusuf'un Allah vergisi yorum yeteneği onu kralın huzuruna çıkardı ve kral onu Mısır'ın hazinelerinden sorumlu kıldı. Milleti kıtlık boyunca hikmet ve adaletle yönetti.",
      "Kıssanın doruk noktası güç değil affediliştir. Açlıktan kıvranan kardeşleri onu tanımadan huzurunda dururken Yusuf kendini açıkladı ve dedi ki: 'Bugün size kınama yoktur. Allah sizi bağışlasın; O merhamet edenlerin en merhametlisidir' (Kur'an 12:92). Her iyiliği Allah'a bağladı, Rabbinin kendisini hapisten çıkardığında ve aileyi bir araya getirdiğinde ona lütufta bulunduğunu söyledi. Yusuf, iffet ve takvanın mü'mini koruduğunu, Allah'ın planının her insani tuzağı sessizce alt ettiğini ve affetmenin — intikamın değil — asaletin nişanesi olduğunu öğretir.",
    ],
    profile: {
      nation: "Mısır'daki Beni İsrail soy hattı",
      location: "Kenan ve Mısır",
      era: "Musa'dan önce",
      mission: "Topluma hizmet ederken tevhidi, iffeti ve adaleti sürdürmek.",
      challenges: [
        "Kardeşlerinin ihaneti",
        "Baştan çıkarma ve yalan iftira",
        "Masumiyetine rağmen uzun hapis",
      ],
      miracles: ["Gerçek rüya yorumlama konusunda Allah vergisi yetenek"],
      majorEvents: [
        "Kuyu ve babasından ayrılış",
        "Hapiste geçen yıllar",
        "Mısır'da iktidara yükseliş ve ailesiyle kavuşma",
      ],
      lessons: [
        "İffet ve dürüstlük imanı korur",
        "Af aileleri birleştirir",
        "Allah'ın planı her insani tuzağı aşar",
      ],
      facts: [
        "En güzel kıssa olarak adlandırılan Yusuf Suresi'nin tamamı onun hayatı etrafında döner",
      ],
    },
    quran: [
      {
        excerpt:
          "Dedi ki: Bugün size kınama yoktur. Allah sizi bağışlasın; O merhamet edenlerin en merhametlisidir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Şerefli, şereflinin oğlu, şereflinin oğlu, şereflinin oğlu: Yusuf, Yakub'un oğlu, İshak'ın oğlu, İbrahim'in oğlu.",
      },
    ],
    appLinks: [{ label: "Yusuf Suresi'ni oku" }, { label: "Peygamberler zaman çizelgesini gör" }],
  },
  // shuayb
  {
    title: "Şuayb aleyhisselam",
    summary:
      "İmanı ticarette dürüstlükle birleştiren ve Medyen'i hile ile adaletsizliğe karşı uyaran bir peygamber.",
    body: [
      "Şuayb aleyhisselam, hile yoluyla ekonomisini bozmuş bir ticaret topluluğu olan Medyen halkına gönderildi: ölçü ve tartıda eksiltme, insanların mallarında hile yapma ve yeryüzünde adaletsizlik yayma. Mesajı, insanların çoğu zaman ayırmaya çalıştığı imanın iki yarısını birleştirdi — ibadet ve ahlak: 'Ey kavmim! Allah'a kulluk edin; sizin O'ndan başka ilahınız yoktur. Ölçüyü ve tartıyı adaletle tam yapın, insanların eşyasını eksik vermeyin' (Kur'an 11:84-85).",
      "Kavmi direndi, alaycı bir şekilde namazlarının atalarının hileli geleneklerini bırakmayı ve kendi malları hakkında istediklerini yapmayı gerektirip gerektirmediğini sordu (Kur'an 11:87). Onunla alay ettiler, onu ve mü'minleri sürgünle tehdit ettiler, hatta yolları kestiler. Şuayb, şefkat ve açık hatırlatmalarla sebat etti, gücü yettiğince yalnızca ıslah aradığını ve başarısının yalnızca Allah'tan olduğunu vurguladı: 'Başarım ancak Allah iledir. O'na güvendim ve O'na yönelirim' (Kur'an 11:88). Kavmini davet etmekteki güzel konuşmasıyla hatırlanır.",
      "Reddetmekte ısrar ettiklerinde azap gelip zalimleri yakaladı, Allah ise Şuayb'ı ve mü'minleri kurtardı (Kur'an 7:91-93). Sireti, sıkça göz ardı edilen bir ders verir: ekonomik dürüstlük dinden ayrı değildir — onun bir parçasıdır. Pazarda hile yapmak, güçsüzleri sömürmek ve ölçüleri değiştirmek iman meseleleridir ve adaletsizliği meşrulaştıran bir toplum Allah'ın hükmünü davet eder.",
    ],
    profile: {
      nation: "Medyen halkı",
      location: "Kuzeybatı Arabistan / Levant ticaret bölgesi",
      era: "İbrahim'in nesillerinden sonra",
      mission: "Tevhide ve ticarette dürüstlük ile adalete çağırmak.",
      challenges: ["Kökleşmiş piyasa yolsuzluğu", "Seçkinlerin alayı", "Sürgün tehditleri"],
      majorEvents: [
        "Tam ölçü ve adil alışverişe çağrı",
        "Kamusal muhalefet ve tehditler",
        "Israrlı inkârcıların cezalandırılması",
      ],
      lessons: [
        "İman, ticarette dürüstlük gerektirir",
        "Alenî adaletsizlik ilahi hükmü davet eder",
        "Peygamberler yalnızca ibadeti değil, toplumsal ve ekonomik ahlakı da ele alır",
      ],
      facts: ["Adil ölçü ve tartıya verdiği önemle tanınır"],
    },
    quran: [
      {
        excerpt:
          "Ey kavmim! Allah'a kulluk edin; sizin O'ndan başka ilahınız yoktur. Ölçüyü ve tartıyı tam yapın, insanların eşyasını eksik vermeyin ve yeryüzünde bozgunculuk yapmayın.",
      },
      {
        excerpt: "Başarım ancak Allah iledir. O'na güvendim ve O'na yönelirim.",
      },
    ],
    appLinks: [{ label: "Hud Suresi'ni oku" }, { label: "Peygamberler zaman çizelgesini gör" }],
  },
  // ayyub
  {
    title: "Eyyub aleyhisselam",
    summary: "Kur'an'ın sabır örneği: uzun süreli hastalık ve kayıp boyunca ibadette sarsılmaz.",
    body: [
      "Eyyub aleyhisselam, Kur'an'da sabrın kalıcı simgesidir. Sağlık, servet ve aile ile nimetlendirilmiş bir peygamberdi; sonra bunları kaybetmekle ve uzun, acı verici bir hastalıkla sınandı. Bütün bunlar boyunca hiç acı bir söz söylemedi, Rabbini adaletsizlikle suçlamadı; şükre ve zikre sıkı sıkıya sarıldı. Kur'an onu, tüm kıssasını özetleyen sözlerle över: 'Gerçekten biz onu sabreden bir kul bulduk, ne güzel kuldu! Şüphesiz o, Allah'a çokça yönelen biriydi' (Kur'an 38:44).",
      "Sıkıntı sonunda dayanılmaz hale geldiğinde, duasının kusursuz edebine dikkat et. Allah'ın hükmüne karşı bir talepte veya şikâyette bulunmadı; sadece basit ve alçakgönüllülükle durumunu Rabbinin önüne koydu: 'Gerçekten bana zarar dokundu, Sen ise merhamet edenlerin en merhametlisisin' (Kur'an 21:83). Tam istediği anda Allah'ın rahmetini kabul etti. Allah ona cevap verdi: 'Ayağını yere vur; işte serin bir yıkanma ve içme suyu', sıkıntısını giderdi ve ailesini ve daha fazlasını geri verdi; kendinden bir rahmet ve ibadet edenler için bir hatırlatma olarak (Kur'an 21:84; 38:41-43).",
      "Eyyub, sabrın edilgen bir katlanma değil, ibadetin etkin bir biçimi olduğunu öğretir — sınav altında Allah'a sürekli bir dönüş. Örneği ayrıca duamızı da inceltir: alçakgönüllülükle, hükme şikâyet etmeden ve Allah'ın rahmetine kesin bir güvenle. Ve sonu, her sınanan mü'mine, iman ile taşınan sıkıntıların bir kulun mertebesini yükseltebileceğini ve Allah'ın zamanlamasında rahatlığın her zaman ardından geldiğini teselli eder.",
    ],
    profile: {
      era: "İbrahim sonrası peygamberlik dönemi (genel bağlam)",
      mission: "Zorlukta sabrı ve ibadeti örnekleyerek kavmine rehberlik etmek.",
      challenges: [
        "Uzun ve acı verici bir hastalık",
        "Servet ve aile kaybı",
        "Uzun süreli bir sınavda dayanıklılık",
      ],
      miracles: [
        "Allah'ın emriyle şifa ve rahatlama",
        "Sınavdan sonra ailenin ve bereketin geri verilmesi",
      ],
      majorEvents: ["Zorlukta alçakgönüllü yakarışı", "İlahi rahatlama, şifa ve geri verilme"],
      lessons: [
        "Sabır ibadetin etkin bir biçimidir",
        "Dua, alçakgönüllü ve şikâyetten uzak olduğunda en güzelidir",
        "İman ile taşınan sınavlar mertebeyi yükseltebilir",
      ],
      facts: ["İslami gelenek boyunca sabrın örneği olarak anılır"],
    },
    quran: [
      {
        excerpt:
          "Eyyub da, Rabbine seslendiğinde: Gerçekten bana zarar dokundu, Sen ise merhamet edenlerin en merhametlisisin.",
      },
      {
        excerpt:
          "Gerçekten biz onu sabreden bir kul bulduk, ne güzel kuldu! Şüphesiz o, Allah'a çokça yönelen biriydi.",
      },
    ],
    appLinks: [{ label: "Enbiya Suresi'ni oku" }, { label: "Peygamberler zaman çizelgesini gör" }],
  },
  // dhul-kifl
  {
    title: "Zülkifl aleyhisselam",
    summary: "Kıssası kısa olsa da sabredenler arasında sayılan salih bir peygamber.",
    body: [
      "Zülkifl aleyhisselam'ın adı Kur'an'da iki kez, her ikisinde de onurlu peygamberlerin yanında geçer. Allah onu İsmail ve İdris ile birlikte sayar — 'hepsi sabredenlerdendi. Onları rahmetimize kattık; şüphesiz onlar salihlerdendi' (Kur'an 21:85-86) — ve tekrar İsmail ve Elyesa ile birlikte seçkinler arasında zikreder (Kur'an 38:48). Her zikir bir övgüdür, ayrıntılı bir anlatı verilmemiş olsa da.",
      "Kur'an ve sahih Sünnet onun hayatını genişletmediği için, klasik âlimler temel ayrıntılarda bile ihtilaf etmişlerdir — bazıları onun bir peygamber mi yoksa salih bir kişi mi olduğunu tartışmıştır, ancak yaygın Müslüman listelerinde peygamberler arasında sayılır. Dikkatli bir mü'min bu sessizliği doğrulanmamış anlatılarla doldurmaktan kaçınır ve Allah'ın doğruladığına bağlı kalır: sabırlı ve salihti, bu da yeterli bir şereftir.",
      "Onun anılması sessiz bir ders taşır: Allah'ın sevdiği her kul arkasında meşhur bir hikâye bırakmaz. Tarihin asla kaydetmediği ama Allah'ın tam olarak bildiği tutarlı, sadık hizmet — tam olarak O'nun rahmetini kazandıran şeydir. Gizli kararlılık daha aşağı değildir; salih bir hayatın özüdür.",
    ],
    profile: {
      era: "İsa'dan önceki sonraki peygamberlik dönemleri (genel olarak yerleştirilir)",
      mission: "Kavmini itaate ve salih amele çağırmak.",
      lessons: [
        "Sabır, peygamberlik karakterinin merkezindedir",
        "Sınırlı ayrıntı bile güçlü bir rehberlik taşır",
        "Sadık, görünmeyen hizmet Allah'ın sevdiği bir haldir",
      ],
      facts: [
        "İsmail ve İdris ile birlikte sabredenler arasında adı geçer",
        "Yaygın Müslüman listelerinde peygamberler arasında sayılır",
      ],
    },
    quran: [
      {
        excerpt:
          "İsmail, İdris ve Zülkifl de — hepsi sabredenlerdendi. Onları rahmetimize kattık; şüphesiz onlar salihlerdendi.",
      },
      {
        excerpt: "İsmail'i, Elyesa'yı ve Zülkifl'i an; hepsi seçkinlerdendir.",
      },
    ],
    appLinks: [{ label: "Enbiya Suresi'ni oku" }, { label: "Peygamberler zaman çizelgesini gör" }],
  },
  // musa
  {
    title: "Musa aleyhisselam",
    summary: "Firavun'un zulmüyle yüzleşen ve Tevrat'ı alan, Beni İsrail'e gönderilen büyük elçi.",
    body: [
      "Musa aleyhisselam, Kur'an'da en sık zikredilen peygamberdir ve kıssası zengin ayrıntılarla anlatılır. Firavun'un Beni İsrail'in erkek çocuklarını öldürme emri altında doğdu; annesi tarafından, Allah'ın ilhamıyla bebekken bir sepet içinde Nil'e bırakıldı ve Allah'ın planıyla Firavun'un sarayında büyütüldü (Kur'an 28:7-13). Yıllar sonra, Mısır'dan ayrılıp Medyen'de evlendikten sonra Allah onu Tuva'nın kutsal vadisinde çağırdı; Allah onunla doğrudan konuştu, ona asa ve el mucizesini gösterdi ve onu kardeşi Harun ile birlikte zalim Firavun'a gönderdi (Kur'an 20:9-36).",
      "Görevi iki şeyi iletmekti: yalnız Allah'a kulluk çağrısı ve Beni İsrail'in ezilenlerini özgür bırakma talebi. İlah olduğunu iddia eden Firavun ona kafa tuttu ve bir dizi açık mucizeden sonra bile — büyücülerin hilelerini yutan yılana dönüşen asa ve çeşitli belalar — teslim olmayı reddetti. Musa Beni İsrail'i çıkardığında Firavun onları denize kadar takip etti. Orada Allah emretti: 'Asanla denize vur' ve deniz yarıldı; mü'minler kuru toprakta geçerken Firavun ve ordusu boğuldu (Kur'an 26:63-66).",
      "Fakat özgürlük yalnızca başlangıçtı. Musa daha sonra zor ve çoğu zaman nankör bir kavme rehberlik etmenin daha ağır, daha uzun sınavını yüklendi: dağda Tevrat'ı aldı, sadece dönüp onları altın bir buzağıya taparken bulmak için; şikâyetlerine, taleplerine ve itaatsizliklerine sabırlı, kararlı bir liderlikle karşı koydu. Musa'nın hayatı iki büyük temayı birleştirir — adaletsizliğe ve zulme karşı durma cesareti ve özgürlükten sonra insanları itaate yöneltmek için gereken dayanıklılık. Azim sahibi elçilerden (ulül-azm) biri olarak, hem ıslahatçının hem de bir toplumun çobanının örneğidir.",
    ],
    profile: {
      nation: "Beni İsrail (davet Firavun'un kavmine yönelikti)",
      location: "Mısır ve Sina",
      era: "Davud ve Süleyman'dan önce",
      mission: "Tevhide çağırmak, Firavun'un zulmüyle yüzleşmek ve Tevrat'ı iletmek.",
      challenges: [
        "İlahlık iddia eden Firavun ile yüzleşmek",
        "Dirençli ve nankör bir kavme liderlik etmek",
        "Sürekli baskı altında kalıcı liderlik",
      ],
      miracles: [
        "Yılana dönüşen asa",
        "Allah'ın emriyle denizin yarılması",
        "Firavun'un önünde gösterilen birçok mucize",
      ],
      majorEvents: [
        "Allah'ın kutsal vadide onunla konuşması",
        "Firavun ve büyücülerle yüzleşme",
        "Çıkış ve Tevrat'ın vahyi",
      ],
      lessons: [
        "Zulme karşı cesaretle dur",
        "İnsanlara liderlik büyük sabır gerektirir",
        "Özgürlük, Allah'a itaatle birleştirilmelidir",
      ],
      facts: [
        "Azim sahibi beş elçiden (ulül-azm) biri",
        "Kelimullah olarak anılır — Allah'ın doğrudan konuştuğu kişi",
      ],
    },
    quran: [
      {
        excerpt:
          "Seni seçtim, öyleyse vahyedilene kulak ver. Şüphesiz ben Allah'ım. Benden başka ilah yoktur, öyleyse bana kulluk et ve beni anmak için namazı kıl.",
      },
      {
        excerpt:
          "Musa'nın annesine şöyle ilham ettik: Onu emzir, onun için korktuğunda onu nehre bırak, korkma ve üzülme. Şüphesiz biz onu sana geri vereceğiz.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ölüm meleği Musa'ya gönderildi. Ona geldiğinde Musa ona bir tokat vurdu, Allah da onun gözünü geri verdi ve Musa'ya ölüm zamanı konusunda bir seçim hakkı tanıdı.",
      },
    ],
    appLinks: [
      { label: "Taha Suresi'ni oku" },
      { label: "Kasas Suresi'ni oku" },
      { label: "Peygamberler zaman çizelgesini gör" },
    ],
  },
  // harun
  {
    title: "Harun aleyhisselam",
    summary:
      "Musa'nın güzel konuşan kardeşi; Firavun'un önünde onun destekçi peygamberi olarak atandı.",
    body: [
      "Harun aleyhisselam, Musa'nın büyük kardeşiydi ve kendi başına bir peygamberdi. Allah, Musa'yı Firavun'a gönderdiğinde Musa destek istedi: 'Ailemden bana bir vezir tayin et — kardeşim Harun'u. Onunla gücümü artır ve onu görevime ortak et' (Kur'an 20:29-32). Allah bu isteği kabul etti ve Kur'an cevabını kaydeder: 'Kardeşin aracılığıyla senin kolunu güçlendireceğiz' (Kur'an 28:35). Konuşmada daha güzel ifadeli olarak tanımlanan Harun, Allah'ın mesajını zalime iletirken Musa'nın yanında durdu.",
      "En zorlu anı Musa'nın yokluğunda geldi. Musa dağda Tevrat'ı almaya gittiğinde Beni İsrail altın bir buzağıya tapmaya başladı. Harun onları durdurmaya çalıştı ve uyardı: 'Ey kavmim! Siz bununla ancak sınanıyorsunuz ve şüphesiz Rabbiniz Rahman'dır, öyleyse bana uyun ve emrime itaat edin' — fakat onlar onun otoritesini bastırdılar ve neredeyse ona zarar veriyorlardı (Kur'an 20:90-94). Musa öfkeyle döndüğünde Harun, Musa dönmeden önce daha sert davranmanın topluluğu çatışan gruplara bölmesinden korktuğunu açıkladı (Kur'an 7:150).",
      "Harun'un sireti, Allah'a hizmette ekip çalışmasının değerini — iki kişinin taşıdığı bir görev birden güçlüdür — ve hakikatten asla ödün vermeden birliği koruma konusundaki hassas hikmeti öne çıkarır. Bazen sadık liderlik, işler düzelene kadar dağılan bir ümmeti bir arada tutmak ve zararı önlemek anlamına gelir. Harun, Kur'an'da hidayete erenler arasında onurlandırılır ve Allah, onun ve Musa'nın için sonraki nesiller arasında kalıcı bir övgü bırakmıştır (Kur'an 37:119-122).",
    ],
    profile: {
      nation: "Beni İsrail",
      location: "Mısır ve Sina",
      era: "Musa'nın dönemi",
      mission: "Tevhide çağırmada ve Beni İsrail'e rehberlik etmede Musa'ya destek olmak.",
      challenges: [
        "Firavun'un yönetimiyle yüzleşmek",
        "Musa'nın yokluğunda topluluğu yönetmek",
        "Halk arasında daha büyük bir bölünmeyi önlemek",
      ],
      majorEvents: [
        "Musa'nın veziri ve destekçisi olarak atanma",
        "Firavun'un önündeki görev",
        "Altın buzağı sınavı",
      ],
      lessons: [
        "Ekip çalışması Allah'a davetin gücünü artırır",
        "Liderlik bazen bir krizde insanları bir arada tutmaktır",
        "Hakikatten asla ödün vermeden birliği koru",
      ],
      facts: ["Musa'nın büyük kardeşi", "Kur'an'da güzel konuşmasıyla övülür"],
    },
    quran: [
      {
        excerpt:
          "Ailemden bana bir vezir tayin et — kardeşim Harun'u. Onunla gücümü artır ve onu görevime ortak et.",
      },
      {
        excerpt:
          "Dedi ki: Ey anamın oğlu! Kavim beni güçsüz gördü ve neredeyse beni öldürüyorlardı; öyleyse düşmanları bana güldürme.",
      },
    ],
    appLinks: [{ label: "Taha Suresi'ni oku" }, { label: "Peygamberler zaman çizelgesini gör" }],
  },
  // dawud
  {
    title: "Davud aleyhisselam",
    summary:
      "Kendisine hikmet, adalet ve Zebur verilen; ibadet merkezli liderliğin örneği bir peygamber-kral.",
    body: [
      "Davud aleyhisselam, genç bir adam olarak Talut'un (Saul) ordusunda zalim Calut'a (Golyat) karşı başladı. Calut'u indiren Davud'du ve 'Allah ona hükümdarlık ve hikmet verdi ve ona dilediğinden öğretti' (Kur'an 2:251). Sonra Allah ona hükümdarlık, peygamberlik ve indirilmiş bir kitap olan Zebur'u verdi; onu aynı zamanda adanmış bir ibadetçi olan nadir bir hükümdar örneği yaptı.",
      "Allah ona olağanüstü nimetler verdi: dağlar ve kuşlar onunla birlikte Allah'ı tesbih ederdi ve demir, zırh yapabilmesi için ellerinde yumuşatıldı (Kur'an 21:79; 34:10-11). Yine de bunca güce rağmen Davud son derece alçakgönüllü ve adanmış kaldı. İbadeti öylesine yoğundu ki Peygamber sallallahu aleyhi ve sellem, Davud'un orucunu — bir gün oruç, bir gün iftar — Allah katında en sevilen oruç, gece namazını da en sevilen namaz olarak nitelendirdi. Kur'an ayrıca, nazikçe uyarılan Davud'un hemen secdeye kapanıp bağışlanma dilediği ve Rabbine döndüğü bir hüküm olayını da sunar (Kur'an 38:24) — gücü onu asla hesap vermenin üstüne koymadı.",
      "Davud'un hayatı, otoritenin bir ayrıcalık değil bir emanet olduğunu öğretir. Allah ona doğrudan hitap eder: 'Ey Davud! Seni yeryüzünde halife kıldık, öyleyse insanlar arasında hakla hükmet ve arzuya uyma' (Kur'an 38:26). Adalet, Allah'ı sürekli anmak, hızlı tövbe ve disiplinli bir ibadet hayatı, salih liderliği ayakta tutan şeylerdir. Güç, en çok eğilenlerin elinde en güvenlidir.",
    ],
    profile: {
      nation: "Beni İsrail",
      location: "Kudüs bölgesi",
      era: "Süleyman'ın hükümdarlığından önce",
      mission: "Adaletle liderlik etmek, hakla hükmetmek ve kavmini Allah'a çağırmak.",
      challenges: [
        "Yargı sorumluluğunun ağırlığı",
        "Gücü alçakgönüllülükle dengelemek",
        "Liderlikte kamusal hesap verebilirlik",
      ],
      miracles: [
        "Dağların ve kuşların onunla birlikte Allah'ı tesbih etmesi",
        "Demirin Allah'ın izniyle ellerinde yumuşaması",
      ],
      majorEvents: [
        "Gençliğinde Calut'un yenilgisi",
        "Hükümdarlık, peygamberlik ve Zebur'un vahyi",
        "Mirasın oğlu Süleyman'a geçmesi",
      ],
      lessons: [
        "Adalet salih yönetimin merkezindedir",
        "Her hatadan sonra hızla tövbe et",
        "Disiplinli bir ibadet hayatı liderliği güçlendirir",
      ],
      facts: ["Zebur'un (Mezmurlar) sahibi", "Gençliğinde Calut'u (Golyat) yendi"],
    },
    quran: [
      {
        excerpt:
          "Ey Davud! Seni yeryüzünde halife kıldık, öyleyse insanlar arasında hakla hükmet ve arzuya uyma, yoksa seni Allah'ın yolundan saptırır.",
      },
      {
        excerpt:
          "Dağları ve kuşları Davud ile birlikte tesbih etmeleri için boyun eğdirdik… Ona, sizi düşmanınızdan korumak için zırh yapma sanatını öğrettik.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah katında en sevilen namaz Davud'un namazıdır ve Allah katında en sevilen oruç Davud'un orucudur: bir gün oruç tutar, ertesi gün iftar ederdi.",
      },
    ],
    appLinks: [{ label: "Sad Suresi'ni oku" }, { label: "Peygamberler zaman çizelgesini gör" }],
  },
  // sulayman
  {
    title: "Süleyman aleyhisselam",
    summary: "Eşsiz bir otorite verilen, yine de şükür ve hikmette köklü kalan bir peygamber-kral.",
    body: [
      "Süleyman aleyhisselam, babası Davud'dan hem hükümdarlığı hem peygamberliği miras aldı ve Kur'an onu 'ne güzel kuldu; şüphesiz o çokça Allah'a yönelendi' diye över (Kur'an 38:30). Kendisinden sonra kimseye nasip olmayacak bir hükümdarlık için dua etti ve Allah ona olağanüstü imkânlar bahşetti: emriyle esen rüzgâr üzerinde hâkimiyet; Allah'ın izniyle onun için inşa eden ve dalış yapan cinlerin hizmeti; kuşların ve diğer yaratıkların dilini anlama (Kur'an 21:81-82; 34:12-13; 27:16).",
      "İki sahne onun karakterini çizer. Bir karınca, topluluğunu Süleyman'ın ordusunun farkında olmadan onları ezmemesi için saklanmaya uyardığında Süleyman gülümsedi ve anlama nimeti için Allah'a şükretti, şükreden ve salih biri kılınmak için dua etti (Kur'an 27:18-19) — güç onu daha alçakgönüllü yaptı, daha az değil. Sebe Melikesi'nin ve kavminin güneşe taptığını duyduğunda ise onları güçle fethetmedi, aksine Allah'a teslim olmaya davet etti ve nihayetinde hikmet ve Allah'ın kendisine verdiği bir gösterimle onu imana kazandırdı (Kur'an 27:22-44). Geniş nimetlerini bile bir sınav olarak çerçeveledi: 'Bu, Rabbimin lütfundandır; şükür mü yoksa nankörlük mü edeceğimi sınamak için' (Kur'an 27:40).",
      "Süleyman, gücün en zor sınavlardan biri olduğunu ve şükrün onun çaresi olduğunu öğretir. Servet, yetenek veya otorite verilen bir mü'min, bunu adalet için ve başkalarını Allah'a çağırmak için kullanmalı, asla kibir için değil. Tüm harikalarıyla birlikte krallığının tamamı, onu bahşedene işaret eder — ve bu, yücelten bir nimet ile bozan bir nimet arasındaki farktır.",
    ],
    profile: {
      nation: "Beni İsrail ve çevredeki krallıklar",
      location: "Kudüs ve daha geniş bölge",
      era: "Davud'dan sonra",
      mission: "Adaletle hükmetmek ve milletleri Allah'a kulluğa çağırmak.",
      challenges: [
        "Geniş bir krallığı yönetmek",
        "Muazzam güç ortasında şükrü sürdürmek",
        "Çeşitli güçleri sorumlu bir şekilde yönlendirmek",
      ],
      miracles: [
        "Allah'ın izniyle rüzgâr üzerinde hâkimiyet",
        "İnşaat ve dalışta cinlerin hizmeti",
        "Kuşların ve karıncaların dilini anlama",
      ],
      majorEvents: [
        "Davud'dan hükümdarlığı ve peygamberliği miras alma",
        "Karınca olayı ve şükrü",
        "Sebe Melikesi ile yazışma ve onun imana gelmesi",
      ],
      lessons: [
        "Güç derin bir sınavdır",
        "Şükür kibirden korur",
        "Hikmet ve davet, güçten daha iyi kalpleri döndürebilir",
      ],
      facts: ["Kur'an'da en ayrıntılı anlatılan peygamber-krallardan biri"],
    },
    quran: [
      {
        excerpt:
          "Onun sözüne gülümseyerek güldü ve dedi ki: Rabbim! Bana ve ana babama bahşettiğin nimetine şükretmemi ve razı olacağın salih bir amel işlememi sağla.",
      },
      {
        excerpt:
          "Süleyman'a rüzgârı boyun eğdirdik — sabahki gidişi bir aylık, akşamki gidişi de bir aylık mesafeydi.",
      },
    ],
    appLinks: [{ label: "Neml Suresi'ni oku" }, { label: "Peygamberler zaman çizelgesini gör" }],
  },
  // ilyas
  {
    title: "İlyas aleyhisselam",
    summary: "Put Ba'l'e tapınmayla yüzleşen ve kavmini Allah'a geri çağıran bir peygamber.",
    body: [
      "İlyas aleyhisselam, Beni İsrail'in putperestliğe düşmüş, putlarının başında Ba'l'in bulunduğu bir topluluğuna gönderildi. Kur'an onun doğrudan meydan okumasını kaydeder: 'Sakınmaz mısınız? Ba'l'e mi taparsınız ve yaratıcıların en iyisini — sizin de Rabbiniz, önceki atalarınızın da Rabbi olan Allah'ı — bırakır mısınız?' (Kur'an 37:124-126). Daveti, o ebedi peygamberlik çağrısıydı: sahte ilahları kaldır ve ibadeti yalnızca Yaratıcı'ya döndür.",
      "Kur'an, görevini tanıdık peygamberlik kalıbıyla özetler — açık bir davet, çoğunluğun inkârı ve samimi olanlar için korunan şeref. 'Onu yalanladılar, öyleyse şüphesiz onlar (azap için) huzura getirileceklerdir, Allah'ın halis kulları hariç' (Kur'an 37:127-128). Allah onu salihler arasında sayar ve onun için kalıcı bir esenlik ve övgü bırakır: 'İlyas'a selam olsun' (Kur'an 37:129-130) ve onu Zekeriya, Yahya ve İsa ile birlikte hidayete erenler arasında sayar (Kur'an 6:85).",
      "İlyas'ın dersi şudur: gerçek ıslah, ibadeti düzeltmekle başlar. Bir toplum, bağlılığını sahte amaçlara — ister görünür putlar ister arzu, servet ve statü gibi modern putlar olsun — yönelttiği sürece düzelemez. Tevhid, tüm kalıcı ahlaki yenilenmenin üzerine inşa edildiği temeldir ve samimi bir grup küçük ve sayıca az olsa bile Allah, hak üzerinde sebat edenleri onurlandırır.",
    ],
    profile: {
      nation: "Beni İsrail'in bir topluluğu",
      location: "Levant bölgesi",
      era: "Sonraki İsrailoğulları peygamberlik dönemleri",
      mission: "Kavmini Ba'l'e tapınmaktan tevhide çağırmak.",
      challenges: ["Derinden kök salmış putperestlik", "Liderlik direnci"],
      majorEvents: [
        "Ba'l'e tapınmaya karşı kamusal davet",
        "Çoğunluğun inkârı ve mü'minlerin korunması",
      ],
      lessons: [
        "Tevhid her ıslahın temelidir",
        "Küçük, samimi bir grup bile Allah katında önemlidir",
        "Peygamberler yaygın hataya karşı konuşur, onunla birlikte değil",
      ],
      facts: ["Salihler arasında adı geçer", "Put Ba'l'e tapınmayla yüzleşti"],
    },
    quran: [
      {
        excerpt:
          "Kavmine dediğinde: Sakınmaz mısınız? Ba'l'e mi taparsınız ve yaratıcıların en iyisini bırakır mısınız?",
      },
      {
        excerpt: "Zekeriya, Yahya, İsa ve İlyas da — hepsi salihlerdendi.",
      },
    ],
    appLinks: [{ label: "Saffat Suresi'ni oku" }, { label: "Peygamberler zaman çizelgesini gör" }],
  },
  // al-yasa
  {
    title: "Elyesa aleyhisselam",
    summary:
      "İsrailoğulları silsilesinden salih bir peygamber; Kur'an'da seçkinler arasında adı geçer.",
    body: [
      "Elyesa aleyhisselam'ın adı Kur'an'da iki yerde peygamberler arasında geçer ve her ikisinde de övülür. İsmail, Yunus ve Lut ile birlikte, Allah'ın 'âlemler üzerine üstün kıldığı' hidayete erenler arasında yer alır (Kur'an 6:86-87) ve tekrar İsmail ve Zülkifl ile birlikte seçkinler arasında (Kur'an 38:48). Metin onun mertebesini yüceltir, ayrıntılı bir anlatı vermez.",
      "Vahiy onun hakkında bilinçli olarak kısa olduğu için Müslümanlar yalnızca kesin olanı kabul ederler — kavminde yalnız Allah'a kulluk çağrısını sürdüren gerçek bir peygamber olduğunu — ve sağlam senedi olmayan hikâyeler atfetmekten kaçınırlar. Bu ihtiyat, doğru akidenin kendisinin bir parçasıdır: bir peygamberi, etrafında hikâyeler uydurarak değil, onun hakkındaki gerçeğe bağlı kalarak onurlandırırız.",
      "Anılması, Allah'ın birçok elçi gönderdiğinin ve bir peygamberin değerinin, kıssasının ne kadar korunduğuyla değil, görevine sadakatiyle ölçüldüğünün bir hatırlatıcısıdır. Kur'an'ın başka bir yerde söylediği gibi, bazı elçiler 'kıssalarını sana anlattığımız' ve bazıları 'anlatmadığımız' kimselerdir (Kur'an 40:78) — ve bunların hepsine, bilinenlere ve bilinmeyenlere, iman etmek bir Müslümanın imanının bir parçasıdır.",
    ],
    profile: {
      nation: "Beni İsrail",
      location: "Levant bölgesi",
      era: "Sonraki İsrailoğulları peygamberlik dönemleri",
      mission: "Kavmi içinde tevhid davetini sürdürmek.",
      lessons: [
        "Tüm peygamberlere akidede eşit saygı göster",
        "Kur'an'ın kısa bir zikri bile gerçek bir rehberlik taşır",
        "Salih bir devamlılık, iman topluluklarını korur",
      ],
      facts: ["Kur'an'da doğrudan seçkinler ve seçilmişler arasında adı geçer"],
    },
    quran: [
      {
        excerpt: "İsmail, Elyesa, Yunus ve Lut da — hepsini âlemler üzerine üstün kıldık.",
      },
      {
        excerpt: "İsmail'i, Elyesa'yı ve Zülkifl'i an; hepsi seçkinlerdendir.",
      },
    ],
    appLinks: [{ label: "En'am Suresi'ni oku" }, { label: "Peygamberler zaman çizelgesini gör" }],
  },
  // yunus
  {
    title: "Yunus aleyhisselam",
    summary: "Balık sahibi peygamber; karanlıkta ettiği tövbe, umudun kalıcı bir dersi oldu.",
    body: [
      "Yunus aleyhisselam Ninova halkına gönderildi, fakat onlar davetini sürekli reddedince Allah'ın izin vermesinden önce öfkeyle onları terk etti. Kur'an sonrasını şöyle anlatır: '(Balık sahibini de an), hani o öfkeyle gitmiş ve kendisini asla sıkıştırmayacağımızı sanmıştı' (Kur'an 21:87). Bir gemiye bindi, denize atıldı ve büyük bir balık onu yuttu; karanlık katmanlarının içine itildi — gecenin karanlığı, denizin karanlığı ve balığın karnının karanlığı.",
      "O derin karanlıkta Yunus, İslam'da en sevilen dualardan biri olan şu sözlerle seslendi: 'Senden başka ilah yoktur; Sen yücesin. Şüphesiz ben zalimlerden oldum' (Kur'an 21:87). Umutsuzluğa kapılmadı; Allah'ın yüceliğini kabul etti ve kendi hatasını itiraf etti. Allah cevap verdi: 'Duasını kabul ettik ve onu kederden kurtardık. İşte biz mü'minleri böyle kurtarırız' (Kur'an 21:88). Balık onu sahile bıraktı ve Allah, zayıf bedenine gölge yapması için üzerinde bir asma bitkisi yeşertti.",
      "Sonra dikkat çekici bir sonuç geldi: Yunus kavmine geri döndü ve Kur'an'daki hemen her diğer kavmin aksine, onlar iman etti ve kurtuldu — 'onları bir süreye kadar geçindirdik' (Kur'an 37:147-148; 10:98). Kıssası iki dersi birlikte örer: karanlık ne kadar derin olursa olsun Allah'ın rahmetinden asla umut kesme, çünkü samimi tövbe kaybolanı geri getirir; ve Yunus'un duası her sıkıntılı mü'min için bir dayanaktır. Peygamber sallallahu aleyhi ve sellem, bir Müslümanın bu dua ile dua etmesi halinde Allah'ın onun duasını mutlaka kabul edeceğini öğretti.",
    ],
    profile: {
      nation: "Ninova halkı",
      location: "Mezopotamya bölgesi",
      era: "İsa'dan önceki peygamberlik dönemi",
      mission: "Kavmini tevhide ve tövbeye çağırmak.",
      challenges: [
        "Davette sürekli reddedilme baskısı",
        "Denizin karanlığında kişisel sınav",
        "Uyarıdan sonra göreve dönüş",
      ],
      miracles: [
        "Balığın içinden kurtuluş",
        "Kendisine gölge yapan bir asma bitkisinin yeşermesi",
        "Tüm kavminin iman etmesi",
      ],
      majorEvents: [
        "Kavmini terk edip denizde sınanma",
        "Üç katlı karanlıkta dua",
        "Geri dönüş ve Ninova'nın iman etmesi",
      ],
      lessons: [
        "Allah'ın rahmetinden asla umut kesme",
        "Samimi tövbe görevi geri kazandırır",
        "Zorlukta dua hayatı değiştirir",
      ],
      facts: ["Kur'an'da Zünnun (balık sahibi) olarak da anılır"],
    },
    quran: [
      {
        excerpt:
          "Karanlıklar içinde seslendi: Senden başka ilah yoktur; Sen yücesin. Şüphesiz ben zalimlerden oldum.",
      },
      {
        excerpt:
          "Yunus'un kavmi dışında, iman edip de imanı kendisine fayda vermiş bir şehir halkı olmadı. Onlar iman edince, dünya hayatındaki rezillik azabını üzerlerinden kaldırdık.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Zünnun'un balığın karnındayken Allah'a ettiği dua şuydu: Lâ ilâhe illâ ente sübhâneke innî küntü minez-zâlimîn. Hangi Müslüman bununla bir şey için dua ederse Allah mutlaka duasını kabul eder.",
      },
    ],
    appLinks: [
      { label: "Enbiya Suresi'ni oku" },
      { label: "Yunus Suresi'ni oku" },
      { label: "Peygamberler zaman çizelgesini gör" },
    ],
  },
  // zakariyya
  {
    title: "Zekeriya aleyhisselam",
    summary:
      "İleri yaşta salih bir varis için dua eden ve Yahya ile nimetlendirilen, ibadetkâr bir peygamber.",
    body: [
      "Zekeriya aleyhisselam, Beni İsrail'in ibadetkâr bir peygamberi ve Meryem'in vasisiydi. Ne zaman onun ibadet mahalline girse yanında bir rızık bulur ve bunun nereden geldiğini sorardı; o da 'Bu, Allah katındandır. Şüphesiz Allah, dilediğine hesapsız rızık verir' diye cevap verirdi (Kur'an 3:37). Meryem'e Allah'ın rızkının ulaşmasını görmek, Zekeriya'da Allah'ın görünürde insanen imkânsız olanı verebileceği umudunu yeniden uyandırdı.",
      "Yaşlanmış olmasına ve eşinin kısır olmasına rağmen Zekeriya, sessiz, samimi bir duayla Allah'a yöneldi: 'Rabbim! Kemiklerim gevşedi ve baş, ihtiyarlıktan tutuştu, alev alev ağardı; ve Rabbim! Sana dua etmekle hiç mahrum kalmadım' (Kur'an 19:4). Mal veya dünyevi bir fayda istemedi, peygamberlik görevini sürdürecek ve Allah'a ibadeti koruyacak salih bir varis istedi. Allah, ona bu ada daha önce kimsenin sahip olmadığını buyurarak bir oğul, Yahya, müjdesiyle karşılık verdi (Kur'an 19:7). Bir mucize olarak Zekeriya'ya üç gün işaretle dışında insanlarla konuşmaması emredildi, dilini Allah'ı anmaya adayarak (Kur'an 19:10-11).",
      "Zekeriya'nın hayatı mü'mine, cevap ne kadar uzak görünse de duayı asla bırakmamayı ve özellikle Allah'tan salih bir aile ve iman devamlılığı hediyesini istemeyi öğretir. En büyük kaygısı kendisi değil, kendisinden sonra hakikate kimin sahip çıkacağıydı. Kıssası, ibadet mahallerindeki sessiz hizmeti de onurlu ve sevilen bir amel olarak taltif eder.",
    ],
    profile: {
      nation: "Beni İsrail",
      location: "Kudüs bölgesi",
      era: "İsa'dan önce",
      mission: "Kavmine rehberlik etmek ve peygamberlik ibadetini korumak.",
      challenges: [
        "Çocuksuz ileri yaşa ulaşmak",
        "İman mirasının devamı kaygısı",
        "Gergin bir toplumda ibadeti sürdürmek",
      ],
      miracles: ["İleri yaşta Yahya'nın müjdesi", "Üç gün konuşamama mucizesi"],
      majorEvents: [
        "Meryem'in vasiliği ve rızkını gözlemleme",
        "Bir varis için içten dua",
        "Kabul edilen dua ve Yahya'nın doğumu",
      ],
      lessons: [
        "Duada asla umudu kaybetme",
        "Allah'tan salih bir aile ve nesil dile",
        "İbadette içten hizmet onurludur",
      ],
      facts: ["Meryem'in vasisi", "Doğumu duasının cevabı olan Yahya'nın babası"],
    },
    quran: [
      {
        excerpt:
          "İşte orada Zekeriya Rabbine dua etti, dedi ki: Rabbim! Bana kendi katından tertemiz bir soy bahşet. Şüphesiz Sen duayı işitensin.",
      },
      {
        excerpt:
          "Dedi ki: Rabbim! Kemiklerim gevşedi ve baş, ihtiyarlıktan tutuştu, alev alev ağardı; ve Rabbim! Sana dua etmekle hiç mahrum kalmadım.",
      },
    ],
    appLinks: [
      { label: "Âl-i İmran Suresi'ni oku" },
      { label: "Meryem Suresi'ni oku" },
      { label: "Peygamberler zaman çizelgesini gör" },
    ],
  },
  // yahya
  {
    title: "Yahya aleyhisselam",
    summary:
      "Temiz, hikmetli bir peygamber; daha çocukluğunda salih amel verildi ve Allah onu esenlikle onurlandırdı.",
    body: [
      "Yahya aleyhisselam, babası Zekeriya'nın duasının cevabıydı ve Allah adını doğumundan önce koydu. Allah ona doğrudan hitap etti: 'Ey Yahya! Kitab'a sımsıkı sarıl.' Ve ona 'daha çocukken hikmet verdi' (Kur'an 19:12) — onun erken ruhi olgunluğunu öne çıkaran nadir bir ifade. Daha gençken yaşının çok ötesinde bir ciddiyetle Allah'a adandı.",
      "Kur'an, onun karakterini güzel bir sıralamayla över: Allah ona 'kendi katından bir şefkat ve temizlik verdi; o Allah'tan sakınan, ana babasına iyi davranan biriydi ve o azgın, asi biri değildi' (Kur'an 19:13-14). Temiz ve ibadetkârdı, salihler arasında anılırdı. Kavmini itaate ve hakka çağırdı ve İsa'dan önce geldi, Allah'tan bir kelimeyi doğrulayıp kalpleri hidayete hazırlayarak (Kur'an 3:39).",
      "Allah, Yahya'yı hayatın en kritik üç anında esenlikle onurlandırdı: 'Doğduğu gün, öleceği gün ve diri olarak kaldırılacağı gün ona selam olsun' (Kur'an 19:15). Sireti hem genç hem yaşlı herkes için bir mesajdır: Allah'a yakınlık, ileriki yıllara ertelenmez. Kalp temizliği, ibadette ciddiyet ve ana babaya iyi davranış, gençlikte bile bir insanda çiçek açabilir — ve böyle bir hayat Allah'ın sevdiği bir hayattır.",
    ],
    profile: {
      nation: "Beni İsrail",
      location: "Levant bölgesi",
      era: "Zekeriya'nın çağdaşı ve İsa dönemine yakın",
      mission: "Salih amele çağırmak ve kalpleri hidayete hazırlamak.",
      challenges: ["Ahlaki açıdan gergin bir ortamda kamusal ıslah", "Temizliği ve ilkeyi korumak"],
      majorEvents: [
        "Kabul edilen bir dua olarak doğumu",
        "Gençlikte hikmet verilmesi",
        "Temizliği ve ibadetiyle tanınması",
      ],
      lessons: [
        "Gençler salih amelde öncülük edebilir",
        "Kalp temizliği gerçek güçtür",
        "Ana babaya iyi davranış takvanın bir parçasıdır",
      ],
      facts: [
        "Allah adını doğumundan önce koydu",
        "Doğumda, ölümde ve kıyamette esenlikle onurlandırıldı",
      ],
    },
    quran: [
      {
        excerpt:
          "Ey Yahya! Kitab'a sımsıkı sarıl. Ona daha çocukken hikmet verdik, kendi katımızdan bir şefkat ve temizlik de; o Allah'tan sakınan biriydi.",
      },
      {
        excerpt:
          "Allah seni, Allah'tan bir kelimeyi doğrulayan, seçkin, iffetli ve salihlerden bir peygamber olan Yahya ile müjdeler.",
      },
    ],
    appLinks: [{ label: "Meryem Suresi'ni oku" }, { label: "Peygamberler zaman çizelgesini gör" }],
  },
  // isa
  {
    title: "İsa bin Meryem aleyhisselam",
    summary:
      "Meryem'den mucizevi şekilde doğan büyük bir elçi; açık mucizelerle Allah'a çağıran — bir kul, ilah değil.",
    body: [
      "İsa aleyhisselam, Meryem'den babasız, Allah'ın emriyle doğdu; O'nun mutlak kudretinin bir işareti olarak: 'Şüphesiz Allah katında İsa'nın durumu, Âdem'in durumu gibidir. Onu topraktan yarattı, sonra ona 'Ol' dedi, o da oluverdi' (Kur'an 3:59). Meryem yeni doğanı, kendisini suçlayan kavmine getirdiğinde bebek İsa, onu savunmak için beşikten konuştu: 'Şüphesiz ben Allah'ın kuluyum. Bana Kitab'ı verdi ve beni peygamber kıldı' (Kur'an 19:30). Bu ilk açıklama, tüm görevinin tonunu belirledi — kendisinin Allah'ın kulu olduğu.",
      "İsa, kendisinden önceki Tevrat'ı doğrulamak ve İncil'i getirmek üzere Beni İsrail'e gönderildi. Allah onu, kendi izniyle açık mucizelerle destekledi: körü ve alacalıyı iyileştirdi, ölüleri diriltti ve Allah'ın izniyle uçan bir kuş şeklini çamurdan yaptı (Kur'an 3:49). Mesajı insanları 'Allah'a, benim Rabbime ve sizin Rabbinize' kulluk etmeye (Kur'an 3:51) ve samimiyet ile salih amele çağırıyordu. Yakın havarileri iman etti ve ona destek oldu.",
      "Kur'an, İsa hakkında iki aşırılığı düzeltir. Onu yalanlayıp öldürme planı yapanlara karşı, onun öldürülmediğini veya çarmıha gerilmediğini, bilakis kendilerine öyle gösterildiğini ve Allah'ın onu kendine yükselttiğini ilan eder (Kur'an 4:157-158). Onun hakkında aşırılığa gidenlere karşı ise onun saygın bir peygamber ve elçi olduğunda ısrar eder, ilah veya Allah'ın oğlu değil — 'Meryem oğlu Mesih, ancak bir elçidir' (Kur'an 5:75). Sünni akaidde kıyametten önce geri dönecektir. Kıssası, Allah'ın kudretinin tüm doğal sebeplerin üzerinde olduğunu, peygamberlerin saygın kullar olup asla ilah olmadığını ve hakkın hem inkârdan hem aşırılıktan korunması gerektiğini öğretir.",
    ],
    profile: {
      nation: "Beni İsrail",
      location: "Levant",
      era: "Milattan sonra birinci yüzyıl",
      mission: "Tevhidi yenilemek, Tevrat'ı doğrulamak ve salih amele çağırmak.",
      challenges: [
        "Onu yalanlayanların muhalefeti ve tuzağı",
        "Sonraki nesillerde mertebesi hakkında aşırılık",
        "Saf tevhidi savunmak",
      ],
      miracles: [
        "Babasız doğum",
        "Beşikte konuşma",
        "Allah'ın izniyle şifa verme ve hayat bahşetme",
      ],
      majorEvents: [
        "Mucizevi doğumu ve annesini savunması",
        "Açık mucizelerle kamusal davet",
        "Allah'a yükseltilmesi, öldürülmemesi",
      ],
      lessons: [
        "Allah'ın kudreti olağan sebeplerin üzerindedir",
        "Peygamberler Allah'ın saygın kullarıdır, asla ilah değil",
        "Hak hem inkârdan hem aşırılıktan korunmalıdır",
      ],
      facts: ["İncil verildi", "Sünni akaidde kıyametten önce geri dönecek"],
    },
    quran: [
      {
        excerpt:
          "(İsa dedi ki): Şüphesiz Allah benim Rabbim ve sizin Rabbinizdir, öyleyse O'na kulluk edin. İşte doğru yol budur.",
      },
      {
        excerpt:
          "Onu ne öldürdüler ne de çarmıha gerdiler; fakat onlara öyle gösterildi… bilakis Allah onu kendine yükseltti.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ben, insanlar içinde Meryem oğlu İsa'ya en yakın olanım. Peygamberler baba bir kardeşlerdir (babaları bir, anneleri farklı), dinleri birdir ve aramızda hiçbir peygamber yoktu.",
      },
    ],
    appLinks: [
      { label: "Âl-i İmran Suresi'ni oku" },
      { label: "Nisa Suresi'ni oku" },
      { label: "Peygamberler zaman çizelgesini gör" },
    ],
  },
  // muhammad
  {
    title: "Muhammed sallallahu aleyhi ve sellem",
    summary: "Son elçi; tüm âlemlere rahmet olarak gönderildi ve peygamberlerin sonuncusu.",
    body: [
      "Muhammed sallallahu aleyhi ve sellem, peygamberlerin sonuncusudur; tek bir kavme değil tüm insanlığa gönderilmiştir ve Kur'an, son ve korunmuş vahiy olarak onunla birliktedir. Allah görevini tek bir ayette özetler: 'Seni ancak âlemlere rahmet olarak gönderdik' (Kur'an 21:107). Mekke'de doğdu, kırk yaşında Hira Mağarası'nda ilk vahyi aldı ve sonraki yirmi üç yıl boyunca insanları yalnız Allah'a kulluğa, kalp temizliğine ve adalet ile merhametle yaşamaya çağırdı — kendinden önceki her peygamberin mesajını tamamlayıp doğrulayarak.",
      "Yolu sürekli bir fedakârlıktı. Mekke'de o ve ilk mü'minler alay, eziyet ve yıllarca süren boykotu göğüsledi. Sonra hicret geldi, Medine'ye; orada ilk Müslüman toplumunu kurdu — namaz, muhacirler ve ensar arasında kardeşlik, antlaşmalar ve tevhid üzerine kurulu bir toplum. Yıllarca süren zorluklar ve nihayetinde başarı boyunca karakteri hiç sarsılmadı; Kur'an şahitlik eder, 'Şüphesiz sen büyük bir ahlak üzeresin' (Kur'an 68:4) ve kendisi, güzel ahlakı tamamlamak için gönderildiğini söylemiştir.",
      "Allah onu 'Allah'ın Resulü ve peygamberlerin sonuncusu' olarak nitelendirir (Kur'an 33:40) — ondan sonra hiçbir peygamber yoktur. En büyük mucizesi Kur'an'ın kendisidir; bugün hâlâ milyarlarca insana hidayet veren kalıcı bir mucize; ve İsra ile Miraç'a, gece yolculuğuna ve göklere yükselişe onurlandırılmıştır. Mü'min için o, üsve-i hasene — güzel örnektir (Kur'an 33:21) — sünneti imanın pratik yoludur. Onu sevmek, hidayetine tabi olmak ve ona salavat getirmek Müslüman hayatının merkezindedir.",
    ],
    profile: {
      nation: "Tüm insanlık",
      location: "Mekke ve Medine",
      era: "Miladi yedinci yüzyıl",
      mission: "Son vahyi iletmek ve tüm milletler için peygamberlik mesajını tamamlamak.",
      challenges: [
        "Mekke'de eziyet ve boykot",
        "Çatışma ve adil bir toplum inşa etmek",
        "Kabileler ve milletler arasında evrensel bir mesaj iletmek",
      ],
      miracles: [
        "Kur'an kalıcı bir mucize olarak",
        "İsra ve Miraç (gece yolculuğu ve yükseliş)",
        "Allah'ın izniyle verilen birçok mucize",
      ],
      majorEvents: [
        "Mekke'de vahyin başlaması",
        "Medine'ye hicret",
        "Mesajın tamamlanması ve Veda Hutbesi",
      ],
      lessons: [
        "Liderlikte rahmet ve güzel ahlak",
        "Baskı altında sebat",
        "Hem vahye hem sünnete tabi ol",
      ],
      facts: ["Peygamberlerin sonuncusu", "Mü'minler için en güzel örnek (üsve-i hasene)"],
    },
    quran: [
      {
        excerpt:
          "Muhammed, sizin erkeklerinizden hiçbirinin babası değildir; ancak o, Allah'ın Resulü ve peygamberlerin sonuncusudur.",
      },
      {
        excerpt: "Seni ancak âlemlere rahmet olarak gönderdik.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Benim ve benden önceki peygamberlerin örneği, bir adamın bir ev inşa edip onu güzelleştirmesi ve mükemmelleştirmesi gibidir, yalnızca bir tuğlanın yeri hariç. İşte ben o tuğlayım ve ben peygamberlerin sonuncusuyum.",
      },
    ],
    appLinks: [
      { label: "Siret'ten öğren" },
      { label: "Ahzab Suresi'ni oku" },
      { label: "Peygamberler zaman çizelgesini gör" },
    ],
  },
];

export const PROPHETS_TIMELINE_TR: DeepPartial<ProphetsTimelineEvent>[] = [
  {
    era: "Başlangıç",
    title: "Âdem — ilk peygamber",
    body: "Allah Âdem'i yarattı, ona isimleri öğretti ve onu yeryüzünde kendi halifesi kıldı.",
  },
  {
    era: "Antik çağ",
    title: "İdris, Nuh ve ilk milletler",
    body: "İlk peygamberler kavimlerini tevhide geri çağırdı. Nuh asırlarca tebliğ etti; inkâr sürünce tufan geldi ve gemi, bir işaret olarak mü'minleri kurtardı.",
  },
  {
    era: "Mezopotamya / Levant",
    title: "İbrahim ve ailesi",
    body: "Halilullah, Allah'ın dostu: putları parçaladı, ateşten kurtarıldı, İsmail ile Kâbe'yi inşa etti ve İsmail ile İshak aracılığıyla bir peygamberler silsilesinin atası oldu.",
  },
  {
    era: "Mısır ve Sina",
    title: "Musa ve Beni İsrail",
    body: "Firavun'dan özgürleşme, Tevrat'ın vahyi, Beni İsrail'e gönderilen uzun peygamberler silsilesi.",
  },
  {
    era: "Mısır",
    title: "Mısır'da Yusuf",
    body: "İhanet, hapis ve iktidara yükseliş boyunca sabır — bir güven örneği.",
  },
  {
    era: "Kudüs",
    title: "Davud ve Süleyman",
    body: "Hükümdarlık, hikmet, Zebur ve Kur'an'da övülen krallık.",
  },
  {
    era: "Milattan sonra birinci yüzyıl",
    title: "İsa bin Meryem",
    body: "Mucizevi şekilde doğdu, beşikte konuştu, Allah'a yükseltildi — Kur'an'a göre çarmıhta öldürülmedi.",
  },
  {
    era: "Miladi yedinci yüzyıl",
    title: "Muhammed sallallahu aleyhi ve sellem — peygamberlerin sonuncusu",
    body: "Tüm insanlığa gönderilen son elçi; Kur'an kıyamete kadar korunmuştur.",
  },
];
