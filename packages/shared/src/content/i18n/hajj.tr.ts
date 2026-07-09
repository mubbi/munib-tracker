import type { HajjGuideSection } from "../../types/hajj-guide";
import type { DeepPartial } from "./localize";

// Turkish translation overlay for the Learn Hajj & Umrah guide. Mirrors the order
// of HAJJ_GUIDE_SECTIONS in ../hajj-guide.ts (index-aligned); untranslated entries
// fall back to English. Only human-readable text is translated — ids and the
// section `kind` stay in the English source.
export const HAJJ_GUIDE_SECTIONS_TR: DeepPartial<HajjGuideSection>[] = [
  {
    day: "Yola çıkmadan önce",
    title: "Farziyet ve şartlar",
    summary: "Hac neden farzdır ve kime farz olur.",
    steps: [
      {
        title: "Beşinci şart",
        body: "Hac, İslam'ın beşinci şartıdır; gücü yeten her Müslümana ömründe bir kez farzdır. Allah Teâlâ şöyle buyurur: \"Yoluna güç yetirebilenlerin Beytullah'ı haccetmesi, Allah'ın insanlar üzerindeki hakkıdır\" (Kur'an 3:97). Bu çağrı bütün insanlığa duyurulmuştur: \"İnsanları hacca çağır; sana yürüyerek yahut yorgun argın develer üzerinde gelsinler\" (Kur'an 22:27).",
      },
      {
        title: "İstitâat (güç yetirme)",
        body: "Hac yalnızca gücü yetenlere farzdır: yolculuğa dayanacak beden sağlığı, hem yolculuk hem de geride bıraktığı ailesinin nafakasına yetecek helal mal, ve güvenli, açık bir yol. Bu yıl imkânı olmayan kimse, gücü yetince hacca gitmek üzere ertelemekten dolayı günahkâr olmaz.",
      },
      {
        title: "Kadının yolculuğu",
        body: "Âlimlerin çoğunluğu, kadının hacca bir mahremiyle (eşi veya nikâhı kendisine ebediyen haram olan bir yakını) gitmesi gerektiği görüşündedir; bazı sonraki dönem âlimler ise güvenilir ve emniyetli bir kadın topluluğuyla seyahati de câiz görmüştür. Güvendiğiniz yetkin bir âlimin görüşünü ve bağlı olduğunuz hac kurumunun kurallarını izleyin.",
      },
    ],
  },
  {
    day: "Yola çıkmadan önce",
    title: "Haccın üç türü",
    summary: "İfrad, Kırân ve Temettu — ihrama girmeden önce seçin.",
    steps: [
      {
        title: "İfrad",
        body: "Hacı yalnızca hac için ihrama girer, ayrıca umre yapmaz ve bu sebeple kurban kesmesi gerekmez. Nahr Günü'nün menâsikine kadar ihramlı kalır.",
      },
      {
        title: "Kırân",
        body: "Hacı, umre ile haccı tek bir ihramda birleştirir; umre menâsikini yerine getirir ve hac tamamlanana dek ihramlı kalır. Temettu gibi bunda da kurban (hedy) gerekir.",
      },
      {
        title: "Temettu",
        body: "Hacı, hac aylarında tam bir umre yapar, ihramdan çıkar, sonra 8 Zilhicce'de hac için yeniden ihrama girer. Hacıların çoğu bu şekli uygular; kurban gerektirir, ona gücü yetmeyen kimse ise hac günlerinde üç, dönüşünde de yedi gün olmak üzere oruç tutar (Kur'an 2:196).",
      },
    ],
  },
  {
    day: "Yola çıkmadan önce",
    title: "Mîkatlar ve İhram",
    summary: "Kutsal hâlin başladığı sınır ve bu hâlde yasak olanlar.",
    steps: [
      {
        title: "Beş mîkat",
        body: "Peygamber ﷺ beş mîkat belirlemiştir — ihramsız geçilmemesi gereken sınır noktaları: Zülhuleyfe (Medine halkı için), Cuhfe (Şam ve Mısır halkı için), Karnu'l-Menâzil (Necid halkı için), Yelemlem (Yemen halkı için) ve Zâtü Irk (Irak halkı için). Bu sınırların içinde bulunanlar bulundukları yerden ihrama girer.",
        location: "Mîkat",
      },
      {
        title: "İhram nedir",
        body: "İhram, niyet ve telbiye ile girilen kutsal bir hâldir. Erkekler dikişsiz iki beyaz örtü giyer; kadınlar ise her zamanki tesettürlü kıyafetlerini korur. Gusülden sonra, erkekler için ise önceden bedene (elbiseye değil) koku sürüldükten sonra bu hâle girilir.",
        location: "Mîkat",
      },
      {
        title: "İhram yasakları",
        body: "İhramlı iken şunlardan kaçının: dikişli/vücuda oturan giysiler ve başı örtmek (erkekler için), koku sürünmek, saç veya tırnak kesmek, av avlamak, nikâh kıymak veya kıydırmak ve her türlü cinsel yakınlık. Bunları çiğnemek fidye gerektirebilir, bu yüzden bunlara özenle riayet edin.",
        location: "Mîkat",
      },
    ],
  },
  {
    title: "Umre",
    summary: "Küçük hac — yılın herhangi bir zamanında yapılabilir.",
    steps: [
      {
        title: "İhrama girin",
        body: "Mîkatta veya öncesinde gusül alın, ihram elbiselerini giyin, umre niyeti edin ve telbiyeye başlayın. Niyet kalp ile yapılır ve kutsal hâl o andan itibaren başlar.",
        location: "Mîkat",
      },
      {
        title: "Telbiyeyi okuyun",
        body: "Mekke'ye doğru yol alırken sıkça \"Lebbeyk Allahümme lebbeyk, lebbeyke lâ şerîke leke lebbeyk…\" diye tekrar edin — bunu söylemek, yalnızca Allah'ın çağrısına uyduğunuzun bir ilanıdır — ve tavafa başlayana dek buna devam edin.",
      },
      {
        title: "Kâbe'yi tavaf edin",
        body: "Kâbe'nin etrafında saat yönünün tersine yedi kez dönün; Hacerülesved köşesinden başlayıp yine orada bitirin, burada onu öpebilir, dokunabilir veya sadece tekbir getirerek işaret edebilirsiniz. Erkekler ilk üç turda remel (hızlı yürüyüş) yapar ve ıztıba (sağ omzu açık bırakma) uygularlar. Rükn-i Yemânî ile Hacerülesved arasında şunu okuyun: \"Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateşin azabından koru\" (Kur'an 2:201).",
        location: "Mescid-i Haram",
      },
      {
        title: "İki rekât namaz kılın",
        body: "Tavaftan sonra, mümkünse Makam-ı İbrahim'in arkasında iki rekât namaz kılın (kalabalıksa mescidin herhangi bir yerinde olur), sonra Zemzem suyundan gönlünüzce için; çünkü Peygamber ﷺ Zemzem'in içildiği niyete göre fayda verdiğini bildirmiştir.",
        location: "Mescid-i Haram",
      },
      {
        title: "Safa ile Merve arasında sa'y yapın",
        body: "Safa'dan başlayarak Safa ile Merve arasında yedi kez yürüyün; bu, Hz. Hâcer'in oğlu İsmail için su ararken yaptığı koşuşu anmak içindir. Allah şöyle buyurur: \"Şüphesiz Safa ile Merve, Allah'ın (dininin) sembollerindendir\" (Kur'an 2:158). Safa'da Kâbe'ye yönelin ve dua ile tekbir getirirken ellerinizi kaldırın; erkekler yeşil işaretler arasında hızlı adımlarla yürür.",
        location: "Mescid-i Haram",
      },
      {
        title: "Halk veya taksir",
        body: "Erkekler saçlarını tamamen tıraş eder (halk, sevabı daha büyüktür) veya eşit şekilde kısaltır (taksir); kadınlar saçlarını toplayıp bir parmak ucu kadar keser. Bununla umre tamamlanır ve ihram yasakları kalkar.",
      },
    ],
  },
  {
    day: "8 Zilhicce",
    title: "Terviye Günü — Mina",
    summary: "Hac başlar; bu gün Mina'da geçirilir.",
    steps: [
      {
        title: "Hac için ihrama girin",
        body: "Hac niyeti edin ve yeniden ihrama girin (temettu yapanlar Mekke'deki konaklama yerlerinden), telbiyeyi tazeleyin. Bu, kutsal hâlin yeniden başlaması demektir; dolayısıyla ihram yasakları tekrar geçerli olur.",
      },
      {
        title: "Mina'ya gidin",
        body: "Mina'ya gidin ve Peygamber ﷺ'in sünnetine uyarak öğle, ikindi, akşam, yatsı namazlarını ve ertesi günün sabah namazını, her birini vaktinde iki rekâta kısaltarak kılın. Gün ve geceyi ibadetle geçirin, Arafat'taki vakfeyi bekleyin.",
        location: "Mina",
      },
    ],
  },
  {
    day: "9 Zilhicce",
    title: "Arafe Günü",
    summary: "Haccın en büyük günü — Arafat'ta vakfe.",
    steps: [
      {
        title: "Arafat'ta durun (vakfe)",
        body: "Öğleden sonrasından güneş batımına kadar Arafat sınırları içinde dua, zikir ve tövbe ile kalın. Peygamber ﷺ şöyle buyurmuştur: \"Hac, Arafat'tır\" (Tirmizî 889, Ebû Dâvûd 1949, hasen sahih): bu vakfeyi kaçıran kimse haccı kaçırmış olur. Kıbleye yönelin, ellerinizi kaldırın ve Allah'a yalvarın — bu, dua için en büyük gündür.",
        location: "Arafat",
      },
      {
        title: "Öğle ile ikindiyi birleştirin",
        body: "Öğle vaktinde öğle ve ikindi namazlarını birleştirip (cem-i takdim) kısaltarak kılın, ardından günün geri kalanını nafile namaz yerine tamamen duaya ayırın.",
        location: "Arafat",
      },
      {
        title: "Müzdelife'ye geçin",
        body: "Güneş battıktan sonra sakince Müzdelife'ye gidin, akşam ile yatsıyı birleştirin (yatsı kısaltılarak), geceyi orada geçirin ve şeytan taşlamak için çakıl taşları toplayın. Güçsüzler ve kadınlar kalabalıktan kaçınmak için gece yarısından sonra Mina'ya hareket edebilir.",
        location: "Müzdelife",
      },
    ],
  },
  {
    day: "10 Zilhicce",
    title: "Nahr Günü — Kurban Bayramı",
    summary: "Şeytan taşlama, kurban ve ana tavaf.",
    steps: [
      {
        title: "Akabe Cemresi'ni taşlayın",
        body: "Mina'ya doğru dönün ve büyük direğe (Akabe Cemresi) her taşta \"Allahu ekber\" diyerek yedi çakıl taşı atın. Bu, Hz. İbrahim'in şeytanı reddedişinin anılmasıdır ve günün ilk menâsikidir.",
        location: "Mina",
      },
      {
        title: "Kurban kesin",
        body: "Kurban hayvanını kendiniz kesin ya da güvenilir bir kuruma vekâlet verin; bu, temettu ve kırân yapan hacılar için gereklidir (Kur'an 2:196). Eti hem yenir hem de fakirlere dağıtılır.",
      },
      {
        title: "Halk veya taksir",
        body: "Saçları tıraş edin (halk) veya kısaltın (taksir); kadınlar bir parmak ucu kadar keser. Taşlama ve tıraştan sonra birinci tahallül (tahallül-i evvel) gerçekleşir — eşle yakınlık dışında bütün ihram yasakları kalkar.",
      },
      {
        title: "Tavaf-ı İfâda",
        body: "Haccın bir rüknü olan Tavaf-ı İfâda'yı yapmak ve (temettu yapanlar için) sa'y için Mekke'ye gidin. Bununla ihramdan tam olarak çıkılmış olur ve çirkin söz ile günahtan sakınan kimse \"annesinin onu doğurduğu gündeki gibi\" (Buhârî 1521, Müslim 1350) döner.",
        location: "Mescid-i Haram",
      },
    ],
  },
  {
    day: "11–13 Zilhicce",
    title: "Teşrik Günleri — Mina",
    summary: "Mina'da geceleme ve üç cemrenin her gün taşlanması.",
    steps: [
      {
        title: "Mina'da geceleyin",
        body: "11. ve 12. geceleri (erken ayrılmıyorsanız 13.'yü de) Mina'da geçirin. Bu günler, yemenin, içmenin ve Allah'ı anmanın günleridir; ibadet ve tekbirle geçirilir.",
        location: "Mina",
      },
      {
        title: "Üç cemreyi taşlayın",
        body: "Her öğleden sonra, öğle namazından sonra üç direğin her birine sırasıyla — önce küçük, sonra orta, sonra büyük — yedişer çakıl taşı atın; her taşta tekbir getirin. Acele etmek isteyen, 12. günde taşlamadan sonra ayrılabilir (Kur'an 2:203).",
        location: "Mina",
      },
      {
        title: "Veda Tavafı",
        body: "Mekke'den ayrılmadan önce, haccın son ameli Kâbe ile olsun diye son menâsik olarak Veda Tavafı'nı yapın. Âdet gören kadınlar bundan muaftır.",
        location: "Mescid-i Haram",
      },
    ],
  },
  {
    day: "Tamamlanma ve hükümler",
    title: "Rükünler, vacipler ve sevap",
    summary: "Haccı geçerli kılan nedir, neyin telâfisi vardır ve sevabı nedir.",
    steps: [
      {
        title: "Rükünler (erkân)",
        body: "Rükünler haccın özüdür: ihrama girmek, Arafat'ta vakfe, Tavaf-ı İfâda ve (çoğunluğun görüşüne göre) sa'y. Bir rükün terk edilirse hac geçersiz olur ve kurbanla telâfi edilemez — yeniden yapılması gerekir.",
      },
      {
        title: "Vacipler (vâcibât)",
        body: "Vacipler arasında mîkattan ihrama girmek, Müzdelife'de durmak, cemreleri taşlamak, Teşrik gecelerini Mina'da geçirmek ve Veda Tavafı sayılabilir. Bir vacibin terk edilmesi haccı geçersiz kılmaz, ancak dem (kurban) ile telâfi edilir. Mezhepler bu listelerin ayrıntısında farklılık gösterir; yetkin bir âlime danışın.",
      },
      {
        title: "Makbul haccın sevabı",
        body: 'Kabul edilmiş hac (hacc-ı mebrûr) — günahtan arınmış ve samimiyetle yapılmış olan — geçmiş günahları siler ve karşılığı cennetin ta kendisidir. Peygamber ﷺ şöyle buyurmuştur: "Hacc-ı mebrûrun karşılığı ancak cennettir" (Buhârî 1773, Müslim 1349). Yolculuk boyunca güzel ahlak ve yumuşak huyluluk için gayret edin.',
      },
      {
        title: "Bir uygulama rehberi, fetva değil",
        body: "Bu, menâsiki sırasıyla yerine getirmenize yardımcı olacak pratik bir özettir. Mezhepler birçok ayrıntıda birbirine saygılı biçimde farklılık gösterir ve her hacının durumu farklıdır — özel hükümler ve beklenmedik durumlar için her zaman yetkin bir âlime veya resmi hac rehberinize danışın.",
      },
    ],
  },
];
