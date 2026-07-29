import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Turkish translation overlay for the Learn Friday (Jumu'ah) guide. Mirrors the order of
// FRIDAY_GUIDE_TOPICS in ../friday-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const FRIDAY_GUIDE_TOPICS_TR: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Cuma gününün faziletleri",
    summary:
      "Güneşin doğduğu en hayırlı gün — Âdem'in yaratılışı ve iki cuma arasındaki bağışlanma.",
    body: [
      "Cuma (Yevmü'l-Cuma), bu ümmetin haftalık toplanma günüdür. Ebu Hureyre, Allah'ın Resûlü ﷺ'in şöyle buyurduğunu rivayet etmiştir: 'Güneşin doğduğu en hayırlı gün Cuma'dır; o gün Âdem yaratıldı, o gün Cennet'e girdirildi, o gün oradan çıkarıldı ve Kıyamet de Cuma gününden başka bir günde kopmayacaktır' (Sahih-i Müslim 854).",
      "Onun ibadeti de sürekli bir bağışlanma vaadi taşır. Ebu Hureyre, Peygamber ﷺ'in şöyle buyurduğunu rivayet etmiştir: 'Kim Cuma günü gusül alır, sonra Cuma namazına gelir, imam hutbe verirken dinler ve susarsa, o Cuma ile bir sonraki Cuma arasındaki günahları, bir de üç gün daha eklenerek bağışlanır' (Sahih-i Müslim 857).",
      "Bu faziletler, erkenden hazırlanmaya, dikkatle dinlemeye ve Cuma'yı haftalık bir ruhi tazelenme olarak görmeye bir çağrıdır — sadece işten bir tatil günü olarak değil.",
    ],
    hadith: [
      {
        excerpt:
          "Güneşin doğduğu en hayırlı gün Cuma'dır; o gün Âdem yaratıldı, o gün Cennet'e girdirildi, o gün oradan çıkarıldı ve Kıyamet de Cuma gününden başka bir günde kopmayacaktır.",
      },
      {
        excerpt:
          "Kim Cuma günü gusül alır, sonra Cuma namazına gelir, imam hutbe verirken dinler ve susarsa, o Cuma ile bir sonraki Cuma arasındaki günahları, bir de üç gün daha eklenerek bağışlanır.",
      },
    ],
    actions: [
      "Cuma sabahı şu niyeti koyun: gusül, en güzel kıyafet ve erken gitmek.",
      "Hutbeyi bir ibadet olarak görün — sessizlik ve dikkat de sevabın bir parçasıdır.",
    ],
  },
  {
    title: "Cuma — haftalık farz",
    summary:
      "Kur'an'da farz kılınan, katılanlar için öğle namazının yerini tutan cemaatle kılınan Cuma namazı.",
    body: [
      "Allah, Cuma namazını kendi adıyla farz kılar: 'Ey iman edenler! Cuma günü namaza çağrıldığında, Allah'ı zikretmeye koşun ve alışverişi bırakın. Eğer bilirseniz bu sizin için daha hayırlıdır' (Kur'an, 62:9). Sonraki ayetler, namazdan sonra yeryüzüne yayılıp Allah'ın rızkını aramaya izin verir (Kur'an, 62:10–11).",
      "Cuma, iki bölümlü bir hutbe ve ardından imamın arkasında sesli okunan iki rekâttan oluşur ve katılanlar için öğle namazının yerini tutar. Tarık bin Şihab, Peygamber ﷺ'in cemaatle Cuma namazının, köle, kadın, çocuk veya hasta olan dört kişi hariç her Müslümana farz olduğunu söylediğini rivayet etmiştir (Ebu Davud'un Sünen'i 1067).",
      "Onu ihmal etmek ağır bir uyarıdır: Ebu'l-Ca'd, ihmal yüzünden üç Cuma namazını bırakan kimsenin kalbine Allah'ın mühür vuracağını rivayet etmiştir (Nesai'nin Sünen'i 1369). Hutbe sırasında gereksiz konuşmak sevabı kaybettirir — Ebu Hureyre, imam hutbe verirken arkadaşına 'Sus' dersen, sen de boş söz söylemiş olursun demiştir (Sahih-i Buhari 934).",
      "Cuma'dan sonra dört rekât kılmak önerilir: Ebu Hureyre, Peygamber ﷺ'in 'Sizden biri Cuma namazını kıldığında, ardından dört (rekât) kılsın' buyurduğunu rivayet etmiştir (Sahih-i Müslim 881).",
    ],
    quran: [
      {
        excerpt:
          "Ey iman edenler! Cuma günü namaza çağrıldığında, Allah'ı zikretmeye koşun ve alışverişi bırakın. Eğer bilirseniz bu sizin için daha hayırlıdır. Namaz kılındığında ise yeryüzüne yayılın ve Allah'ın lütfundan isteyin...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Cemaatle Cuma namazı, köle, kadın, çocuk veya hasta olan dört kişi hariç her Müslümana farzdır.",
      },
      { excerpt: "İhmal yüzünden üç Cuma namazını bırakan kimsenin kalbine Allah mühür vurur." },
      {
        excerpt:
          "İmam Cuma günü hutbe verirken arkadaşına 'Sus' dersen, sen de boş söz (lağv) söylemiş olursun.",
      },
      { excerpt: "Sizden biri Cuma namazını kıldığında, ardından dört (rekât) kılsın." },
    ],
    actions: [
      "Hutbe başlamadan önce camiye ulaşmak için yolculuğunuzu planlayın.",
      "Telefonlarınızı sessize alın ve hutbe sırasında konuşmaktan kaçının.",
      "Mümkün olduğunda Cuma'dan sonra dört rekât kılın.",
    ],
    appLinks: [{ label: "Namazı öğren — Cuma dersi" }, { label: "Takipçiyi aç" }],
    disclaimer:
      "Cuma'nın geçerli olması için gereken en az katılımcı sayısı ve kadınların, yolcuların katılmaya teşvik edilip edilmediği, mezheplere ve yerel geleneğe göre değişen ayrıntılı fıkıh meseleleridir. Katılmayan kadınlar, yolcular ve hastalar bunun yerine öğle namazını kılarlar. Bu eğitici içeriktir, fetva değildir.",
  },
  {
    title: "Cuma'ya hazırlık",
    summary: "Gusül, temiz kıyafet, güzel koku ve erken gelmek en büyük sevap için.",
    body: [
      "Hazırlık, Cuma sünnetinin bir parçasıdır. Ebu Said el-Hudri, Allah'ın Resûlü ﷺ'in şöyle buyurduğunu rivayet etmiştir: 'Cuma günü gusül almak, ergenlik yaşına gelmiş her kişiye farzdır' (Sahih-i Müslim 846). Sahih-i Buhari'de (877) benzer bir hadis de Cuma gusülünü ergenlik yaşına gelenlere bağlar.",
      "Gusülün yanı sıra Peygamber ﷺ mümkün olduğunca iyi görünmeyi tavsiye etmiştir. Selman el-Farisi, Peygamber ﷺ'in şöyle buyurduğunu rivayet etmiştir: 'Kim Cuma günü gusül alır, mümkün olduğunca temizlenirse, sonra saç yağı veya güzel koku kullanırsa, sonra çıkar ve iki kişinin arasına girmeden kendi yerine oturursa, imam bitirene kadar dinlerse, sonra kendisine farz kılınan namazı kılarsa — o Cuma ile bir sonraki Cuma arasındaki günahları bağışlanır' (Sahih-i Buhari 883).",
      "Erken gelmek sevabı katlar. Ebu Hureyre, ilk saatte gidenin bir deve kurban eden kişi gibi olduğunu, sonra sığır, sonra koç, sonra tavuk, sonra yumurta kurban eden kişi gibi olduğunu; imam çıktığında meleklerin kayıtlarını topladığını ve hatırlatmayı dinlediklerini rivayet etmiştir (Sahih-i Buhari 881).",
    ],
    hadith: [
      { excerpt: "Cuma günü gusül almak, ergenlik yaşına gelmiş her kişiye farzdır." },
      { excerpt: "Cuma günü gusül almak, ergenlik yaşına gelmiş her Müslüman erkeğe farzdır." },
      {
        excerpt:
          "Kim Cuma günü gusül alır, mümkün olduğunca temizlenirse, sonra saç yağı veya güzel koku kullanırsa, sonra çıkar ve iki kişinin arasına girmeden kendi yerine oturursa, imam bitirene kadar dinlerse, sonra kendisine farz kılınan namazı kılarsa — o Cuma ile bir sonraki Cuma arasındaki günahları bağışlanır.",
      },
      {
        excerpt:
          "Kim Cuma günü gusül alır, sonra erken giderse, bir deve kurban eden kişi gibidir... sonra sığır... sonra koç... sonra tavuk... sonra yumurta. İmam çıktığında melekler hatırlatmayı dinlemek için gelirler.",
      },
    ],
    actions: [
      "Cuma sabahı (veya camiye gitmeden önce) gusül alın.",
      "En güzel ve temiz kıyafetlerinizi giyin, mümkünse hafif bir koku sürün.",
      "Erken gidin — en erken gidenler en büyük sevabı alır.",
    ],
    appLinks: [{ label: "Temizliği öğren — Gusül" }],
    disclaimer:
      "Cuma gusülünün kesin bir farz mı yoksa şiddetle tavsiye edilen bir sünnet mi olduğu, mezhepler arasındaki klasik bir farktır. Herkes onun büyük faziletinde hemfikirdir; cemaatinizin kabul ettiği uygulamayı izleyin.",
  },
  {
    title: "Cuma günü Kehf Suresi",
    summary: "İki cuma arasında bir nur ve ilk on ayette koruma.",
    body: [
      "Kehf Suresi'ni (Kur'an 18) Cuma günü okumak sevilen haftalık bir uygulamadır. Ebu Said el-Hudri, Peygamber ﷺ'in şöyle buyurduğunu rivayet etmiştir: 'Kim Cuma günü Kehf Suresi'ni okursa, ona iki cuma arasında bir nur ışıldar.' Bu hadis el-Hakim ve el-Beyhaki yoluyla rivayet edilmiştir ve Şeyh el-Elbani tarafından sahih olarak değerlendirilmiştir; birçok topluluk bunu yerleşik bir Cuma sünneti olarak takip eder.",
      "Bunun dışında, Kehf Suresi'nin ilk on ayeti Deccal'in fitnesinden korunmadır. Ebu Derda, Peygamber ﷺ'in şöyle buyurduğunu rivayet etmiştir: 'Kim Kehf Suresi'nin ilk on ayetini ezberlerse, Deccal'den korunur' (Sahih-i Müslim 809).",
      "Sureyi okumak için Perşembe akşamı ile Cuma günü güneş batımı arasında zaman bulun — tüm bölümü tamamlayamasanız bile, ilk ayetlerden başlayın ve mümkün olduğunca sık geri dönün.",
    ],
    quran: [
      {
        excerpt:
          "Hamd, kuluna Kitabı indiren ve onda hiçbir çarpıklık koymayan Allah'a mahsustur... Yoksa siz mağara ve kitabe sahiplerinin bizim ayetlerimizden şaşılacak bir şey olduklarını mı sandınız?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim Cuma günü Kehf Suresi'ni okursa, ona iki cuma arasında bir nur ışıldar. (Şeyh el-Elbani tarafından sahih olarak değerlendirilmiştir)",
      },
      { excerpt: "Kim Kehf Suresi'nin ilk on ayetini ezberlerse, Deccal'den korunur." },
    ],
    actions: [
      "Cuma günü Kehf Suresi'ni açın ve mümkün olduğunca dikkatle okuyun.",
      "Deccal'den korunmak için ilk on ayeti ezberleyin veya tekrar edin.",
    ],
    appLinks: [{ label: "Kehf Suresi'ni oku" }],
    disclaimer:
      "'İki cuma arasındaki nur' hadisi Altı Ana Kitap'ta bulunmaz; daha sonra yaygın olarak kabul edilen bir rivayete dayanır. İlk on ayetin koruması (Müslim 809) tartışmasız sahihtir.",
  },
  {
    title: "Cuma günü Peygamber'e ﷺ salavat",
    summary: "Haftanın en hayırlı gününde, Peygamber'e ﷺ salavatı çoğaltın.",
    body: [
      "Cuma, salavatın çoğaltılması için ayrılmıştır. Evs bin Evs, Peygamber ﷺ'in şöyle buyurduğunu rivayet etmiştir: 'Günlerinizin en hayırlılarından biri Cuma'dır; o gün bana çok salavat getirin, çünkü salavatlarınız bana ulaştırılır.' Onlar: 'Ey Allah'ın Resûlü, sen toprak olduğunda salavatlarımız sana nasıl ulaştırılır?' diye sordular. O: 'Allah, toprağa peygamberlerin bedenlerini yemeyi haram kılmıştır' buyurdu (Ebu Davud'un Sünen'i 1047).",
      "Sahih olan her salavat formülü uygundur — namazda öğretilen salavatlar olsun ya da sünnetten gelen daha uzun biçimler olsun. Önemli olan Cuma günü tekrar ve samimiyettir, sabit bir sayı değil.",
    ],
    hadith: [
      {
        excerpt:
          "Günlerinizin en hayırlılarından biri Cuma'dır; o gün bana çok salavat getirin, çünkü salavatlarınız bana ulaştırılır.",
      },
    ],
    actions: [
      "Cuma günü için kişisel bir salavat hedefi belirleyin — az ama düzenli bir sayı olsa da.",
      "Hazır bir formül istiyorsanız, uygulamadaki salavat koleksiyonunu kullanın.",
    ],
    appLinks: [{ label: "Salavat" }],
  },
  {
    title: "Kabul edilme saati",
    summary: "Cuma günü duanın reddedilmediği bir saat — bunu özellikle ikindiden sonra arayın.",
    body: [
      "Ebu Hureyre, Allah'ın Resûlü ﷺ'in Cuma'yı zikrederek şöyle buyurduğunu rivayet etmiştir: 'Cuma'da bir saat vardır, eğer bir Müslüman kul o saatte durup Allah'tan bir şey isterse, Allah ona onu verir' — ve eliyle onun kısa olduğunu gösterdi (Sahih-i Buhari 935; ayrıca Sahih-i Müslim 852).",
      "Âlimler bu saatin tam olarak ne zaman olduğu konusunda farklı görüşlere sahiptir. Güçlü bir görüş bunu Cuma günü ikindiden sonraki son bölüme yerleştirir: Cabir bin Abdullah, Peygamber ﷺ'in şöyle buyurduğunu rivayet etmiştir: 'Cuma on iki saattir ve içinde bir saat vardır, eğer bir Müslüman kul Allah'tan bir şey isterse, Allah ona onu verir — o yüzden bunu ikindiden sonraki son saatte arayın' (Ebu Davud'un Sünen'i 1048).",
      "Hangi görüşü izlerseniz izleyin, Cuma gününü — özellikle günün son kısmını — samimi dua, istiğfar ve salavatla doldurun, Allah'ın cevap verme vaadine güvenerek.",
    ],
    hadith: [
      {
        excerpt:
          "Cuma'da bir saat vardır, eğer bir Müslüman kul o saatte durup Allah'tan bir şey isterse, Allah ona onu verir — ve eliyle onun kısa olduğunu gösterdi.",
      },
      {
        excerpt:
          "Cuma'da bir saat vardır, eğer bir Müslüman namazda durup Allah'tan bir şey isterse, Allah ona onu verir.",
      },
      {
        excerpt:
          "Cuma on iki saattir ve içinde bir saat vardır, eğer bir Müslüman kul Allah'tan bir şey isterse, Allah ona onu verir — o yüzden bunu ikindiden sonraki son saatte arayın.",
      },
    ],
    actions: [
      "Cuma günü ikindiden sonra, kısa bir dua listesiyle oturun ve samimiyetle isteyin.",
      "Duayı salavatla birleştirin — ikisi de özellikle bu günde tavsiye edilir.",
    ],
    appLinks: [{ label: "Dua koleksiyonu" }],
    disclaimer:
      "Kabul edilme saatinin tam zamanı âlimler arasında tartışmalı bir konudur (hutbe sırasında, ikindiden sonra ve diğer görüşler). Bu saatin varlığının kendisi Buhari ve Müslim'de tartışmasız sahihtir.",
  },
];
