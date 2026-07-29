import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// az overlay for fidyah-guide. Index-aligned with FIDYAH_GUIDE_TOPICS in ../fidyah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const FIDYAH_GUIDE_TOPICS_AZ: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Qəza, fidyə, yoxsa kəffarə?",
    summary: "Üç müxtəlif vasitə - onları qarışdırmayın.",
    body: [
      "Tutulan Ramazan oruclarının hamısı eyni deyil. Müvəqqəti acizlik - sağalacağını gözlədiyiniz xəstəlik, səyahət, hamiləlik və ya südvermə zamanı oruc tutmaq zərər verə bilər və buna bənzər bəhanələr - başqa günlərdə (qazada) oruc tutmaqla sonradan qəza edilir. Quranda buyurulur: “...Kim xəstə və ya səfərdə olarsa, başqa günlərin sayı qədərdir” (Bəqərə, 185).",
      "Fidyə (kasıbı doyurmaq üçün fidyə) oruc tuta bilməyən və günlərini tutmağa real ümidi olmayanlar üçündür - klassik olaraq yaşlılar və ya xroniki xəstələr üçün oruc tutmaq uzun sürən bir çətinlikdir. Quran oruc tutmaq çox çətin olanlar üçün fidyə olaraq bir kasıbı yedirtməkdən bəhs edir (Bəqərə, 184). Bu ayə sağlam ikən oruc tutmaq üçün icazə deyil.",
      'Kəffarə (kəffarə) daha ağırdır. Bu, bir şəxs, məktəblərin kəffarə tələb edən üsullarla Ramazan orucunu qəsdən pozduğu zaman tətbiq edilir - ən açıq şəkildə "Səhih Müslim"də məşhur rəvayətdə olduğu kimi, Ramazan ayının gündüz vaxtı cinsi əlaqə. Məktəblər qəsdən yemək və ya içmənin də eyni kəffarənin vacib olub-olmaması məsələsində ixtilaf edirlər. Bu köməkçi yalnız məbləğləri təxmin edir; ixtisaslı yerli alim sizin işinizi təsnif etməlidir.',
    ],
    actions: [
      "Əgər daha sonra oruc tutmaqla günlərin qəzasını tuta bilirsinizsə, fidyə yox, qəza planlaşdırın.",
      "Əgər oruc tutmaq həmişəlik qeyri-mümkündürsə, hər buraxılan gün üçün bir alimdən fidyə haqqında soruşun.",
      "Əgər qəsdən orucu pozmusunuzsa, tətbiqin hesablamalarına etibar etməyin - hansı hökmün tətbiq olunduğunu alimdən soruşun.",
    ],
    quran: [
      {
        excerpt:
          "...Və [oruc tutmağa, lakin çətinliklə] gücü çatanlara – bir yoxsulu doyurmaq fidyəsi... Kim xəstə və ya səfərdə olarsa, ona bərabər sayda başqa günlər.",
      },
    ],
  },
  {
    title: "Tutulan oruclar üçün fidyə nədir?",
    summary: "Qəza mümkün olmayan bir gündə bir kasıba yemək verilir.",
    body: [
      "Qalıcı çətinliklə oruc tuta bilməyənlər üçün Quran fidyəsi hər gün üçün bir kasıbı yedirtməkdir (Bəqərə, 184). Alimlər bunu fidyə vahidi kimi qiymətləndirirlər: bir gün oruc tutmaq bir ehtiyacı olanı yedizdirməyə (yaxud yaşadığınız ərazidə geniş istifadə olunan qida ekvivalentini vermək) uyğun gəlir.",
      "Yeməyin dəqiq ölçüsü (müdd, sa' və ya yerli yemək) və pul ekvivalentinin qəbul edilib-edilməməsi məktəbə və yerli fətva şuralarının təcrübəsinə görə dəyişir. Bir çox icmalar bir kasıbı qidalandırmaq xərclərinə əsaslanaraq illik fidyə məbləği dərc edirlər. Cəmi qiymətləndirmək üçün köməkçiyə həmin yerli vahidi daxil edin - bu, məcburi qiymətləndirmə deyil, planlaşdırma vasitəsidir.",
      "Fidyə tövbəni əvəz etmir və yoxsullara minimumdan artıq qayğı göstərmir. İxlasla verin və əgər oruc tutmaq qabiliyyətiniz sonradan geri qayıdarsa, alimdən vəziyyətinizdə başqa qəzanın olub-olmadığını soruşun.",
    ],
    actions: [
      "İşinizin fidyə olduğunu bir alimlə təsdiq edin (yalnız qəza deyil).",
      "Yerli məscidinizin və ya şuranın gündəlik fidya tarifindən istifadə edin.",
      "Planlaşdırma təxmini üçün günləri × bir yemək (yaxud nəşr edilmiş fidya vahidi) çarpın.",
    ],
    quran: [
      {
        excerpt:
          "...Və [oruc tutmağa, lakin çətinliklə] gücü çatanlara isə bir fəqiri yedirtmək fidyəsi. Kim könüllü olaraq yaxşılıq etsə, bu, onun üçün daha xeyirlidir. Əgər bilsəniz oruc tutmaq sizin üçün daha xeyirlidir.",
      },
    ],
  },
  {
    title: "Kim adətən fidyə ödəyir?",
    summary: "Daimi qabiliyyətsizlik - hər bir orucu qaçırmır.",
    body: [
      "Sonrakı oruc əvəzinə fidyə üçün klassik hallar, oruc tuta bilməyən və günlərini tutmağı ağlabatan şəkildə gözləyə bilməyənlərdir - məsələn, yaşlılıq və ya orucun davamlı zərər verə biləcəyi xroniki xəstəlik. Sonradan keçən müvəqqəti xəstəlik, adətən, başqa günlərdə oruc tutmaqla tamamlanır (Quran, 2:185).",
      "Hamiləlik və ana südü ilə bağlı məktəblərdə diqqətlə müalicə olunur: bəziləri yalnız qəza tələb edir; başqaları oruc tutmaq anaya və ya uşağa zərər verərsə, əlavə olaraq fidyanı müzakirə edirlər. Yalnız bir kalkulyatordan qərar verməyin.",
      "Əgər kimsə hələ də tutmadığı Ramazan orucu ilə vəfat edərsə, varislər mötəbər xəbərlərə və elmi təfərrüata əsasən onların adından oruc tuta və ya yoxsulları yedizdirə bilərlər (bax: Buxari 1952, mərhumun orucuna dair). Ailənizin vəziyyətini bir alimdən soruşun.",
    ],
    disclaimer:
      "Hamiləliyin, ana südü ilə qidalanmanın və xroniki xəstəliklərin təsnifatı elmi mühakimədir. Bu mövzu yalnız maarifləndiricidir.",
    quran: [
      {
        excerpt:
          "...Hər kim o ayı [yeni ayı] görsə, oruc tutsun. Kim xəstədirsə və ya səfərdə olsa, başqa günlərin sayı qədərdir. Allah sizin üçün asanlıq istər, çətinlik istəməz...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Bir kişi dedi: Anam oruc tutduğu üçün öldü. Mən onun əvəzinə oruc tutmalıyam? Peyğəmbər (salləllahu aleyhi və səlləm) buyurdu: Bəli, Allahın borcunun ödənilməsinə daha çox haqqı vardır.",
      },
    ],
  },
  {
    title: "Qəsdən orucu pozmağa görə kəffarə",
    summary: "Bir kölə azad etmək və ya altmış ardıcıl oruc tutmaq və ya altmış yoxsulu yedirtmək.",
    body: [
      "Əbu Hureyrə (radiyallahu anhu) rəvayət edir ki, bir kişi Peyğəmbərin (sallallahu aleyhi və səlləm) yanına gəlib Ramazan ayında oruc tutan zövcəsi ilə yaxınlıq etdiyi üçün həlak olduğunu dedi. Peyğəmbər (s) bir kölə azad edə biləcəyini soruşdu; sonra iki ay ardıcıl oruc tuta bilərmi? sonra altmış kasıbı yedizdirə bildimi - və bacarmadığı halda ona kömək etdi (Səhih Müslim 1111; həmçinin Buxari 1936).",
      "Bu dərəcəli kəffarə Ramazan orucu günlərində cinsi əlaqənin kəffarəsi üçün mətn əsasıdır. Rəvayətdəki qayda belədir: azad olmaq, sonra altmış gün ardıcıl oruc tutmaq, sonra altmış fəqiri yedirtmək. Hər addımda bacarıqsızlıq, hesabatı məktəblərin oxumasına görə insanı növbəti varianta keçir.",
      "Üzrsüz olaraq qəsdən yemək və ya içməyin də bu kəffarəni vacib etməsi məzhəblər arasında məlum fərqdir. Köməkçinin 'kəffarə' təxmini modelləri altmış yoxsulu (və ya altmış gün oruc tutmaqla) bir hadisə vahidinə yedizdirir - yalnız bir alim kəffarənin tətbiq olunduğunu bildirdikdən sonra.",
    ],
    actions: [
      "Səmimi olaraq tövbə edin və günah işini dərhal dayandırın.",
      "Əgər varsa, hansı kəffarə borcunuz olduğunu ixtisaslı alimdən soruşun.",
      "Altmış kasıbı qidalandırmaq yerinə yetirə biləcəyiniz seçimdirsə, planlaşdırma rəqəmi kimi yerli yemək dəyəri × 60 istifadə edin.",
    ],
    hadith: [
      {
        excerpt:
          "Bir kişi dedi: Mən xarab oldum, ey Allahın Rəsulu, Ramazan ayında həyat yoldaşımla yaxınlıq etdim. Ondan bir kölə azad etmək, iki ay dalbadal oruc tutmaq və altmış kasıbı yedizdirmək barədə soruşdular...",
      },
      {
        excerpt:
          "Biz Peyğəmbərin (sallallahu aleyhi və səlləm) yanında oturduğumuz zaman bir kişi gəlib dedi: Mən xarab oldum... O, oruc tutan zövcəsi ilə yaxınlıq etdi...",
      },
    ],
  },
  {
    title: "Bu köməkçidən necə istifadə etmək olar",
    summary: "Yalnız təxminlər — yerli yemək və ya fidya tariflərini daxil edin.",
    body: [
      "Fidyə təxmini günlərin sayını bir kasıbı (və ya dərc edilmiş yerli fidya vahidinizi) qidalandırmaq xərclərinə vurur. Kəffarə təxmini hər hadisə vahidi üçün altmış yeməklə çoxalır, bu da Səhih Müslim 1111-dəki qidalanma variantını əks etdirir - və ya bu seçim yerinə seçilərsə, altmış ardıcıl oruc gününü göstərir.",
      "Məbləğləri öz valyutanızda daxil edin. Cari il üçün etibarlı yerli məscid, İslam mərkəzi və ya elmi şuranın elan etdiyi fidyə dərəcəsinə üstünlük verin. Heç biri dərc olunmazsa, bir ehtiyacı olan şəxs üçün əsas qidalandırıcı yeməyin real dəyəri ümumi planlaşdırma proksisidir - hələ də elmi təsdiqə tabedir.",
      "Heç vaxt ekrandakı cəmini fətva kimi qəbul etməyin. Əgər qəza, fidyə, kəffarə və ya tövbədən başqa bir şey borcunuz olmadığına əmin deyilsinizsə, kalkulyatoru dayandırın və vəziyyətinizi bilən bir alimdən soruşun.",
    ],
    disclaimer:
      "Munib Tracker yalnız təhsil təxminlərini təqdim edir. İslam qanuni hökmləri vermir.",
    actions: [
      "Təxmin etməzdən əvvəl bu ilki yerli fidya dərəcəsinə baxın.",
      "Öz qeydləriniz üçün gün və məbləğləri qeyd edin.",
      "Kasıblara çatan etibarlı kanal vasitəsilə verin.",
    ],
  },
];
