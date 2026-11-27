import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Turkish translation overlay for the Learn ruqyah guide. Mirrors the order of
// RUQYAH_TOPICS in ../ruqyah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const RUQYAH_TOPICS_TR: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Rukye nedir?",
    summary: "Şifa için Kur'an, Allah'ın İsimleri veya Peygamber'in dualarını okumak.",
    body: [
      "Rukye, kendi üzerine veya başka birinin üzerine Kur'an, Allah'ın İsim ve Sıfatlarını veya sahih Peygamber dualarını okumaktır — çoğu zaman hafif bir nefes üflemeyle — sadece Allah'tan şifa veya koruma dilemek. İslam öncesinde genel bir Arap büyü âdeti olarak var olmuştur ve Peygamber ﷺ'e bunun izin verilip verilmediği doğrudan soruldu.",
      "Avf bin Malik, sahabelerin şöyle dediğini rivayet etti: 'Cahiliye döneminde rukye yapardık; bu konuda ne düşünüyorsunuz?' Peygamber ﷺ şöyle cevap verdi: 'Bana rukyenizi gösterin — içinde şirk olmadığı sürece rukyede bir zarar yoktur' (Sahih Müslim 2200). Bu tek hadis, bu kılavuzdaki her şeyin temelidir: rukyenin kendisi caizdir; önemli olan içeriğidir.",
    ],
    hadith: [{}],
  },
  {
    title: "Helal ve haram rukye",
    summary: "Kur'an, Allah'ın İsimleri ve anlaşılır dua — asla şirk veya gaybın bilgisi değil.",
    body: [
      "Meşru rukye, alimlerin hadisten çıkardığı şartlara dayanır: Kur'an, Allah'ın İsim ve Sıfatları veya sahih bir Peygamber duası kullanır; anlamı bilinen bir dildedir (bilinmeyen heceler veya sembollerle değil); ve okuyan kişi ile tedavi edilen kişi, rukyenin kendisinin hiçbir gücü olmadığına inanır — şifa yalnızca Allah'tandır ve kelimeler O'nun izin verdiği bir araçtır.",
      "Peygamber ﷺ bunu bizzat örneklendirdi: Aişe, hastalandığında Muavvizat'ı (son iki sureyi) kendi üzerine okuyup üflediğini, son hastalığı ağırlaştığında ise kendisinin onun için aynısını yaparak bereketini umarak elini vücuduna sürdüğünü bildirdi (Buhari 5016). Bu, rukyenin en açık ve en sahih halidir.",
      "Rukye, şirke girdiğinde haram olur: Allah'tan başkasına seslenmek, cinlerden yardım istemek, anlamı belirsiz bilinmeyen kelimeler veya semboller kullanmak, muska veya tılsım takmak, ya da rukye yapan kişinin gayb bilgisine sahip olduğunu veya garantili bir tedaviye sahip olduğunu iddia etmek. Ayrıca beş vakit namazın veya uygun tıbbi tedavi aramanın yerini asla tutmaz — ikisini de yerine getirmez, ikisini de tamamlar.",
    ],
    hadith: [{}],
    disclaimer:
      "Rukye ruhani bir uygulamadır, tıbbi bir tedavi değildir. Fiziksel veya ruhsal hastalık için nitelikli bir doktora görünmenin ya da beş vakit namazın yerini tutmaz.",
  },
  {
    title: "Rukye olarak Fatiha Suresi",
    summary: "Açılış suresi — geçerli bir rukye olarak açıkça teyit edilmiştir.",
    body: [
      "Ebu Said el-Hudri, bir kabile liderinin yılan tarafından sokulduğunda, Peygamber'in ﷺ sahabelerinden birinin onun üzerine Fatiha Suresi'ni okuduğunu ve iyileştiğini rivayet etti. Sahabeler daha sonra Peygamber'e ﷺ bunun caiz olup olmadığını sorduklarında, gülümsedi ve şöyle dedi: 'Bunun bir rukye olduğunu nasıl bildiniz?' — Fatiha'nın, samimi iman ve anlayışla okunduğunda, kendisinin geçerli bir rukye olduğunu teyit etti (Buhari 5736).",
      "Bu uygulamanın Kur'an okuyucusu, Fatiha'nın tam metnini ve çevirisini içerir; bu kılavuz onu burada tekrar üretmek yerine sadece bir rukye kaynağı olarak işaret eder.",
    ],
    quran: [{}],
    hadith: [{}],
    appLinks: [{ label: "Fatiha'yı oku" }],
  },
  {
    title: "Ayetü'l-Kürsi (2:255)",
    summary: "Taht Ayeti — geceleri Allah'ın koruması için okunur.",
    body: [
      "Ayetü'l-Kürsi (Kur'an 2:255) Allah'ın mutlak hükümranlığını tanımlar ve özellikle uyumadan önce koruma için yaygın olarak okunur. Ebu Hureyre, koruduğu zekattan çalan gece ziyaretçisinin ona şöyle söylediğini rivayet etti: 'Ne zaman yatağına gitsen, Ayetü'l-Kürsi'yi oku — Allah'tan bir koruyucu seninle kalacak ve sabaha kadar hiçbir şeytan sana yaklaşmayacak.' Peygamber ﷺ bunu işitince şöyle teyit etti: 'Sana doğruyu söyledi, ama o bir yalancıdır — o bir şeytandı' (Buhari 5010).",
      "Bu kılavuzdaki diğer ayetler gibi, burada sadece kısa bir alıntı verilmiştir; tam ayeti ve çevirisini uygulamanın Kur'an okuyucusunda okuyun.",
    ],
    quran: [{}],
    hadith: [{}],
    appLinks: [{ label: "Ayetü'l-Kürsi'yi oku" }],
  },
  {
    title: "İhlas, Felak ve Nas (112–114)",
    summary: "Son üç sure — Peygamber'in ﷺ gecelik rukyesi.",
    body: [
      "Aişe, Peygamber'in ﷺ gecelik rutinini şöyle tarif etti: her gece uyumadan önce ellerini birleştirir, İhlas Suresi'ni, Felak Suresi'ni ve Nas Suresi'ni okur, ellerine üfler ve onları vücuduna sürerdi — baş ve yüzden başlayarak — bunu üç kez tekrarlardı (Buhari 5017). Aynı bu üç sure (İhlas Allah'ın birliğini onaylar, iki Muavvizat ise kötülükten sığınma diler) hastalık döneminde kendi üzerine okuduğu şeylerdi de (Buhari 5016).",
      "Birlikte, mevcut en basit ve en sahih günlük rukye rutinlerinden birini oluştururlar — ezberlemek için yeterince kısa ve Sünnet'te doğrudan belgelenmiştir.",
    ],
    quran: [{}, {}, {}],
    hadith: [{}],
    actions: [
      "İhlas, Felak ve Nas'ı ezberleyin.",
      "Peygamber'in ﷺ yaptığı gibi, her gece uyumadan önce onları okuyun.",
    ],
    appLinks: [{ label: "Üç sureyi oku" }],
  },
  {
    title: "Günlük koruma: sabah ve akşam zikirleri",
    summary: "Koruma için rukyenin sürekli, günlük şekli.",
    body: [
      "Belirli bir hastalık için rukyenin ötesinde, Peygamber ﷺ sürekli ruhani koruma olarak işlev gören bir sabah ve akşam zikirleri (adhkar) setini öğretti — bunların çoğu, diğer sahih dualarla birlikte bu kılavuzda ele alınan aynı ayetlerdir (Ayetü'l-Kürsi, son üç sure). Sadece bir şeyler ters gittiğinde rukyeye başvurmak yerine, onları sürekli okumak, her gün Allah'ın korumasını dilemenin Sünnet yoludur.",
      "Bu uygulamanın zikir kütüphanesi, sabah ve akşam zikirlerinin tam, kaynaklı koleksiyonunu bir yerde tutar, okumaya veya günlük takip etmeye hazır.",
    ],
    actions: [
      "Sabah zikirlerini Fecir'den sonra okuyun.",
      "Akşam zikirlerini Akşam/gün batımından önce okuyun.",
    ],
    appLinks: [{ label: "Sabah ve akşam zikirleri" }],
  },
  {
    title: "Falcılardan ve kâhinlerden kaçının",
    summary: "Allah'tan başkasından gaybı aramak ciddi bir uyarıdır.",
    body: [
      "İslam, sahih rukye ile falcılara, kâhinlere, astrologlara veya gaybı bildiğini veya İslami olmayan yollarla ruhani bir sıkıntıyı kaldırdığını iddia eden herkese danışmak arasında kesin bir çizgi çizer. Peygamber ﷺ şöyle uyardı: 'Kim bir falcıya (arraf) gider ve ona bir şey sorarsa, kırk gece namazı kabul edilmez' (Sahih Müslim 2230) — sadece merak için bile böyle iddiaları test etmeye karşı şiddetli bir uyarı.",
      "Eğer bir kişi ayrıca falcının gayb hakkındaki iddialarına inanırsa, alimler bunu bir küfür meselesi olarak görürler, çünkü sadece Allah gaybı bilir (Kur'an 27:65). Birini böyle bir kişiyi düşünmeye iten zorluk ne olursa olsun, bu kılavuzun öğretisindeki doğru yanıt her zaman sahih rukyeye, duaya ve güvenilir tıbbi veya bilimsel yardıma başvurmaktır — asla gizli bilgi iddia edenlere değil.",
    ],
    hadith: [{}],
    actions: ["Falcılara, astrologlara veya gaybı bildiğini iddia edenlere asla danışmayın."],
  },
  {
    title: "Tevekkül — sadece Allah'a güven",
    summary: "Rukye bir vasıtadır; şifa ve sonuç Allah'a aittir.",
    body: [
      "Bu kılavuzdaki son ve en önemli hatırlatma tevekküldür: Allah'ın verdiği izin verilen vasıtaları kullanırken O'na samimi güven duymak. Rukye okumak, tıbbi bakım aramak ve başkalarından sizin için dua etmelerini istemek hepsi meşru vasıtalardır — ama kalbin güveni sadece Allah'a dayanmalı, okunan kelimelere veya onları okuyan kişiye değil. Bu, bu kılavuzun ilk hadisindeki şartı tam olarak yansıtır: 'İçinde şirk olmadığı sürece rukyede bir zarar yoktur' (Sahih Müslim 2200).",
      "Bu kılavuz, internette yaygın olarak dolaşan halk 'protokollerini' ve semptom kontrol listelerini kasıtlı olarak dışarıda bırakmıştır — bunların hiçbirinin Kur'an veya sahih Sünnet'te güçlü bir temeli yoktur ve onlara güvenmek, sessizce bir kişinin güvenini Allah'tan bir ritüele veya tahmin listesine kaydırabilir. Metinsel olarak temellendirilmiş olana sadık kalın ve gerisini Allah'ın takdirine bırakın.",
    ],
    hadith: [{}],
    disclaimer:
      "Bu, Kur'an ve sahih hadisten ana akım Sünni öğretiyi özetleyen genel eğitici içeriktir. Bir fetva değildir ve tıbbi veya psikolojik bir tedavi değildir. Ciddi veya kalıcı bir sıkıntı için, hem nitelikli bir yerel alime hem de uygun bir tıbbi uzmana danışın.",
  },
];
