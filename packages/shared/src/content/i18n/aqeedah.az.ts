// Azerbaijani translation overlay for the Learn Aqeedah content. Mirrors the order of
// its English source in ../aqeedah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { AqeedahGlossaryTerm, AqeedahTopic } from "../../types/aqeedah";
import type { DeepPartial } from "./localize";

export const AQEDAH_TOPICS_AZ: DeepPartial<AqeedahTopic>[] = [
  {
    title: "Giriş",
    summary: "Əqidə ibadəti, xarakter və məqsədi formalaşdıran imanın əsasıdır.",
    body: [
      "Əqidə (عقيدة) sözü möhkəm bağlamaq və ya bağlamaq kökündən gəlir - bu, bir müsəlmanın elə əminliklə sahib olduğu inanclar toplusudur ki, qəlb onlara şübhə ilə bağlıdır. Məşhur Cəbrail hədisində Peyğəmbər (s) bunu altı iman olaraq ümumiləşdirmişdir: Allaha, mələklərinə, kitablarına, elçilərinə, axirət gününə və ilahi hökmə (qədr), xeyirinə və acısına.",
      "Əhli-sünnə vəl-camaat üçün - sünni müsəlmanların əsas orqanı - əqidə əvvəlcə Qurandan, sonra Peyğəmbərin səhabələri və ilk nəsillər (sələflər) tərəfindən başa düşülən mötəbər sünnətdən götürülmüşdür. Ağıldan istifadə edildiyi yerdə, onu ləğv etməkdənsə, vəhyə xidmət edir.",
      "Əqidə mücərrəd seminar mövzusu deyil; bütün ibadətlərin və xarakterlərin yetişdiyi kökdür. İnsanın Allahın kim olduğu, nə üçün yaradıldığı və hara getdiyi ilə bağlı inancları onun necə dua edəcəyini, başqaları ilə necə rəftar edəcəyini, çətinlik və ölümlə necə qarşılaşacağını müəyyən edir.",
      "Düzgün iman qəlbi böyük ibadət halları - sevgi və qorxu, ümid və qorxu, təvəkkül və səy, şükür və tövbə arasında tarazlıqda saxlayır ki, mömin nə Allahın rəhmətindən ümidini kəsməsin, nə də Onun hesabından arxayın olmasın.",
    ],
    quran: [
      {
        excerpt:
          "Yaxşılıq odur ki, Allaha, axirət gününə, mələklərə, kitaba və peyğəmbərlərə iman gətirsin...",
      },
      {
        excerpt:
          "Ey iman gətirənlər, Allaha, Onun Elçisinə, Onun Elçisinə nazil etdiyi Kitaba və daha əvvəl nazil etdiyi kitaba iman gətirin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "İman Allaha, mələklərinə, kitablarına, elçilərinə, axirət gününə inanmaq, ilahi hökmə, onun xeyirinə və acısına inanmaqdır. (Cəbrail hədisi, Ömər rəvayət etmişdir)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Əqidə nədir?",
    summary: "Əqidə fəlsəfə dərsi deyil; vəhyə söykənən yaşanan inancdır.",
    body: [
      "Əqidə qəlbin yəqinliklə təsdiq etdiyi və sonra ibadət və davranışda göstərdiyi şeydir - sadəcə olaraq müzakirə üçün əzbərlənmiş bir nəzəriyyə deyil. Qur'an möhkəm möminləri vəhy haqqında: “Biz ona iman gətirdik; bunların hamısı Rəbbimizdəndir!” (3:7): Onlar açıq-aydın olana təslim olub, qeybi Allaha tapşırırlar.",
      "İlkin alimlər yığcam əqidə mətnlərini (məsələn, əl-Əqidə ət-Təhaviyyə) məhz bu aydınlığı qorumaq üçün - adi möminləri iki təhlükədən qorumaq üçün yazmışlar: dinə əlavələr edən mübaliğə və Allahın təsdiq etdiyini aradan qaldıran inkar.",
      "Əhli-sünnə daxilində tanınmış kəlam məktəbləri - xüsusilə Əthari, Əşəri və Maturidi yanaşmaları mövcuddur ki, onlar imanın əsasları üzərində tamamilə həmfikirdirlər, eyni zamanda bəzi məsələlərin, xüsusən də ilahi sifətlərin ifadəsinin bəzi texniki üsullarında fərqlidirlər. Onların ortaq təməli bir və möhkəmdir: Allahın mütləq birliyi, vəhyinin doğruluğu və axirətdə haqq hesabı.",
      "Beləliklə, əqidə canlı inanc kimi ən yaxşı şəkildə öyrənilir: hər bir etiqad nöqtəsi bir ibadət tərzinə, bir davranış tərzinə və rahatlıq mənbəyinə bağlıdır.",
    ],
    quran: [
      {
        excerpt: "Elmdə möhkəm olanlar: “Biz ona iman gətirdik. Bunların hamısı Rəbbimizdəndir”.",
      },
    ],
    actions: [
      "Əqidəni sosial media müzakirələrindən deyil, etibarlı alimlərdən və ilkin mətnlərdən öyrənin.",
      "Öyrəndiyiniz hər bir inanc üçün soruşun: bu, mənim ibadət və yaşayış tərzimi necə dəyişir?",
    ],
  },
  {
    title: "Niyə Əqidə Vacibdir",
    summary: "Səs inancı mənəvi sabitlik verir və ifratlardan qoruyur.",
    body: [
      "İman sağlam və sabit olduqda, əməllər ixlaslı və sabit olar; inanc sarsıldığında, ibadət qeyri-sabit olur, sırf emosional olur və ya arzu və şübhə ilə asanlıqla sarsılır. Allah vəd edir ki, iman gətirənləri dünya həyatında, qəbrin və axirətin qorxunc anında möhkəm sözlə möhkəm saxlayacaq.",
      "Düzgün əqidə də mömini bütün həyat boyu aparan şeydir: çətin anlarda Allahın hökmünə səbirli olmağı, nemətlərə təvazökar şükür etməyi, qeyri-müəyyənlik və ölüm qarşısında sakit əmin olmağı öyrədir. Qədr və axirətə həqiqi inanan insan imtahan olunduğu zaman yıxılmaz.",
      "Nəhayət, sağlam əqidə ixtilafda ədəb - yaxşı davranış - öyrədir: səmimi alimlərin uzun müddətdir ixtilaf etdikləri ikinci dərəcəli məsələlərdə hörmət və təmkin nümayiş etdirərkən aydın əsaslara möhkəm riayət etmək. Etiqad bilgisi təvazökarlığı və mərhəməti artırmalıdır, heç vaxt təkəbbür olmamalıdır.",
    ],
    quran: [
      {
        excerpt: "Allah iman gətirənləri dünya həyatında da, axirətdə də möhkəm sözlə sabit tutar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sənə fayda verən şeylərə can at, Allahdan kömək dilə və aciz qalma... (Əbu Hureyrə)",
      },
    ],
  },
  {
    title: "İmanın altı maddəsi",
    summary: "Peyğəmbər (s) imanı altı əsas əqidədə ümumiləşdirmişdir.",
    body: [
      "Altı məqalə İslamın ən mühüm hədislərindən biri olan Cəbrail hədisindən gəlir. Cəbrail mələk kişi surətində gəlib səhabələrin qarşısında Peyğəmbərdən (s) İslam, iman və ehsan haqqında sual verdi. O, iman haqqında soruşduqda, Peyğəmbər bu altı əqidə ilə cavab verdi - Cəbrayıl da onu təsdiq etdi, sonra insanlara dinlərini öyrətməyə gəlib oradan ayrıldı.",
      "Bu altısı bunlardır: Allaha iman; Onun mələklərində; nazil etdiyi kitablarda; Onun elçilərində; qiyamət günündə; İlahi hökmdə (qədrdə) onun xeyiri və acısı. Onlardan hər hansı birini rədd etmək həqiqi imandan kənara çıxmaq deməkdir, çünki onlar tək bir parçadır.",
      "Onlar həm də bir-biri ilə sıx bağlıdır. Kitablara və elçilərə iman, qiyamət və haqq-hesab haqqında biliklərə səbəb olur; qiyamət gününə iman hər bir əmələ qiymət verir; Qədr inancı isə Allaha təvəkkül və Onun hikməti qarşısında təvazökar olmağı öyrədir. Onları ardıcıllıqla öyrənmək aydın və balanslı dünyagörüşünü formalaşdırır.",
    ],
    hadith: [
      {
        excerpt:
          "...Allaha, mələklərinə, kitablarına, elçilərinə, axirət gününə iman gətirməyinizə, hökmə, onun xeyirinə və acısına inanmağınız. (Cəbrail hədisi)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Allaha iman",
    summary: "Allaha iman Onun rəbbliyini, yeganə ibadət haqqını, ad və sifətlərini əhatə edir.",
    body: [
      "Allaha iman bütün inancların ən böyüyü, qalanlarının isə köküdür. Əminliklə başlayır ki, O, hər şeyin Yaradıcısı, Sahibi və Rəhbəri olan tək Allahdır, heç bir şəriki, tayı-bərabəri və yaratdıqlarının heç birinə ehtiyacı yoxdur.",
      "Buradan belə nəticə çıxır ki, hər cür ibadətə yalnız O layiqdir: dua, dua, ümid, qorxu, təvəkkül, ən yüksək mənada məhəbbət, qurban və nəzir Allah`ın Özündən başqa heç kimə yönəldilə bilməyəcəyi haqqıdır. “Allahdan başqa ilah yoxdur” şəhadətinin mənası budur.",
      "Əhli-sünnə, Allahın Özü üçün təsdiq etdiyi gözəl adları və uca sifətləri, Rəsulunun (sallallahu aleyhi və səlləm) Onun üçün təsdiq etdiyi əzəmətinə yaraşan bir tərzdə - Onu məxluqatına bənzətmədən və məna sifətlərini (ta'til) inkar etmədən və boşaltmadan təsdiq edir. Rəhbər ayə belədir: “Onun bənzəri yoxdur, O, Eşidəndir, Görəndir” (42:11) – bu həm bənzərliyi inkar edir, həm də Onun eşitdiyini və görməsini təsdiq edir.",
      "Allahı Onun adları ilə tanımaq – Mərhəmətli, Biləndir, Əbədi Yaşayan, Hökmdar, Bağışlayan – qəlbin qidasıdır: Onu nə qədər çox tanısan, bir o qədər çox sevərsən, qorxur və Ona yönəlirsən.",
    ],
    quran: [
      {
        excerpt: "De: “O, Tək olan Allahdır... O, doğulmur, doğulmur və Onun bənzəri yoxdur.",
      },
      {
        excerpt: "Ən gözəl adlar da Allaha məxsusdur. Ona bu adlarla dua edin.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Mələklərə İnam",
    summary: "Mələklər Allahın izzətli, qeyb bəndələridir və heç vaxt Ona asi olmazlar.",
    body: [
      "Mələklər (mələklər) nurdan yaradılmış geniş məxluqdurlar. Onların itaətsizlik etmək iradələri yoxdur: Allaha davamlı olaraq ibadət edir və Onun hər əmrini mükəmməl şəkildə yerinə yetirir, 'Allahın onlara buyurduqlarına asi olmayaraq, onlara əmr olunanı yerinə yetirirlər'.",
      "Onlara inanmaq, qeyb aləminin ətrafımızda real və aktiv olduğuna inanmaq deməkdir. Mələklər vəhy gətirir, insanları qoruyur, hər sözü və əməli qeyd edir, ölüm anında canları alır, yerin və göyün işini Allahın izni ilə idarə edir.",
      "Mətnlərdə bir neçəsinin adı xüsusi rollarla çəkilir: Cəbrail vəhy mələyi; Yağış və ruzi həvalə edilmiş Mikayıl; Sur çalacaq İsrafil; Mələk əl-Mövt, ölüm mələyi; və hər kəsin əməllərini yazan alicənab katiblər (Kiraman Katibin). Münkər və Nəkir mərhumu qəbirdə sorğu-sual edirlər.",
    ],
    quran: [
      {
        excerpt:
          "Onun üstündə sərt və şiddətli mələklər vardır ki, onlar Allahın buyurduqlarına asi olmayan və özlərinə əmr olunanı yerinə yetirirlər.",
      },
      {
        excerpt:
          "De: “Kim Cəbrailə düşməndirsə, Allahın izni ilə onu sənin qəlbinə nazil edən də odur.",
      },
    ],
    actions: ["Şüurla yaşayın ki, qeyd edən mələklər heç bir söz və ya əməli əldən verməzlər."],
  },
  {
    title: "İlahi kitablara iman",
    summary:
      "Allah hidayət olaraq kitablar göndərdi. Qur'an onları təsdiq edir və son meyar kimi dayanır.",
    body: [
      "Müsəlmanlar inanırlar ki, Allah öz elçilərinə hidayət və mərhəmət olaraq kitablar nazil etmişdir. Quranda bir neçəsinin adı çəkilir: İbrahimin və Musanın suhufu, Musaya verilən Tövrat, Davuda Zəbur, İsaya İncil və nəhayət, Məhəmmədə (s.",
      "Qur'an unikal bir rütbəyə malikdir. Bu, “özündən əvvəl gələnləri təsdiq edən və onun üzərində bir hökm olaraq” göndərilmiş son vəhydir (5:48), yəni o, hökm edir və islah edir, çünki əvvəlki kitablar öz orijinal vəziyyətində qalmamış, dəyişdirilmiş (təhrif) edilmiş və nəsillər boyu itmişdir.",
      "Qurani-Kərim bütün müqəddəs kitablar arasında bənzərsiz olaraq Allah tərəfindən fəsaddan qorunur: “Həqiqətən, Zikri Biz nazil etdik və həqiqətən də, Biz onu qoruyanıq” (15:9). Buna görə də kitablara iman gətirmək vəhyə hörmət etmək, Qur'anı düşünərək oxumaq və həyatda onun hidayətinə təslim olmaq deməkdir.",
    ],
    quran: [
      {
        excerpt:
          "Biz sənə Kitabı haqq olaraq, özündən əvvəlkiləri təsdiq edən və onu ayırd edən bir məqam olaraq nazil etdik.",
      },
      {
        excerpt: "Həqiqətən, Zikri Biz nazil etdik və şübhəsiz ki, Biz onu qoruyacağıq.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Peyğəmbərlərə iman",
    summary: "Bütün peyğəmbərlər eyni əsas həqiqəti çatdırmışlar; Muhəmməd (s) son elçidir.",
    body: [
      "Müsəlman Allahın göndərdiyi bütün peyğəmbərlərə və elçilərə inanar, heç birini rədd edər. Adəmdən Nuhdan İbrahimə, Musaya və İsaya kimi Muhəmməd səllallahu aleyhi və səlləm hamısı eyni vacib risaləyə səsləndi: yalnız Allaha ibadət edin və düz yaşayın. Quranda iyirmi beşinin adı çəkilir; onların ümumi sayı ancaq Allaha məlumdur.",
      "Peyğəmbərlər doğruluq və etibarlılıq baxımından yaradılışın ən yaxşısıdır, Allah tərəfindən risalət haqqında yalan danışmaqdan və böyük günahlardan qorunur, lakin onlar ilahi deyil, insan olaraq qalırlar və onlara heç vaxt ibadət olunmaz. “Qətiyyətli” elçilər (ulu əl-əzm) olaraq beş nəfər seçilir: Nuh, İbrahim, Musa, İsa və Muhəmməd.",
      "Muhəmməd Peyğəmbərlərin möhürüdür (xatəm ən-nəbiyyin): Ondan sonra heç bir peyğəmbər gəlməz və onun risaləti universaldır - Qiyamət gününə qədər bütün bəşəriyyətə göndərilir. Ona iman gətirmək, onu sevmək, əmrlərinə tabe olmaq, xəbərlərinə inanmaq və yalnız onun öyrətdiyi şəkildə ibadət etməkdir.",
    ],
    quran: [
      {
        excerpt: "…Biz Onun elçiləri arasında heç bir fərq qoymuruq…",
      },
      {
        excerpt:
          "Məhəmməd sənin kişilərindən heç birinin atası deyil, Allahın Rəsulu və peyğəmbərlərin möhürüdür.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Qiyamət gününə iman",
    summary: "Həyat Allahla son görüşə, mükəmməl ədalətə və sonsuz nəticələrə gətirib çıxarır.",
    body: [
      "Qiyamət gününə iman ölümdən sonra olan hər şeyə imandır: qəbir sorğu-sualına və həyatına (bərzəx), sur çalınmağa, bütün insanların dirilməsinə, böyük məclisə, haqq-hesab çəkməyə, əməllərin tərəzidə çəkilməsinə, körpünün keçilməsinə və iki əbədi yurd - Cənnət və Cəhənnəm.",
      "Bu inanc hər anına mənəvi yük verir. Allah qeybi görən və ən kiçik əməli qeyd etdiyi üçün heç bir yaxşılıq boşa getməz və heç bir pislik gözdən qaçmaz: “Kim zərrə qədər yaxşılıq etsə, onu görəcək, kim zərrə qədər pislik etsə, onu görəcəkdir”.",
      "Əhli-sünnə bütün bu həqiqətləri qətiliklə təsdiq edir, onlara tam olaraq xəbər verildiyi kimi inanır, eyni zamanda alimlərin konkret hadisələrin və əlamətlərin bəzi incə detallarının təfsirində ixtilaf olduğunu etiraf edir. İnancın məqsədi fərziyyə deyil, hazırlıqdır.",
    ],
    quran: [
      {
        excerpt:
          "...Beləliklə, kim zərrə qədər yaxşılıq etsə, onu görəcək, kim zərrə qədər pislik etsə, onu görəcəkdir.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qədr inancı (İlahi hökm)",
    summary: "Allahın elmi və hökmü tamdır, lakin insanlar həqiqətən seçirlər və cavabdehdirlər.",
    body: [
      "Qədr inancı çox vaxt dörd səviyyədə cəmlənir: Allah hər şeyi sonsuza qədər bilir; Onların hamısını yaradılışdan əlli min il əvvəl Lövhi-məhfuzda yazdığını; Onun iradəsindən başqa heç nə baş verməz; və qullarının əməlləri də daxil olmaqla, mövcud olan hər şeyi Yaradandır.",
      "Eyni zamanda, insanların Allahın icazə verdiyi şeylər daxilində həqiqi bir iradə və həqiqi seçim vardır - əmr və qadağalar, mükafat və cəza məhz buna görə ədalətli və mənalıdır. İnsan namaz qılmağı və ya yalan danışmağı seçir və haqlı olaraq məsuliyyət daşıyır; Allahın seçim haqqında əvvəlcədən bilməsi onu məcbur etmir.",
      "Əhli-sünnə iki xəta arasında gedir: hökmü inkar etmək (sanki hadisələr Allahın elmindən və iradəsindən qaçır) və fatalizm (insan məsuliyyətini aradan qaldırmaq və günahı bağışlamaq üçün hökmdən istifadə etmək). Mömin vəsiləni mükəmməl götürər, sonra nəticəsini Allaha tapşırar.",
      "Praktiki olaraq, Qədr sülhün böyük mənbəyidir: üzərinizə düşəni etdikdən sonra şüurunuzda dincəlirsiniz ki, sizə çatan hər şey sizi heç vaxt əldən verə bilməz və əldən verdiyiniz hər şey sizə çata bilməz.",
    ],
    hadith: [
      {
        excerpt:
          "…Əgər sənə bir iş gəlsə, “kaş mən belə etsəydim” demə, “Allah yazdı, istədiyini etdi” de. (Əbu Hureyrə)",
      },
    ],
    quran: [
      {
        excerpt: "Həqiqətən, Biz hər şeyi bir ölçü ilə yaratdıq.",
      },
      {
        excerpt: "Həqiqətən, bir qövm öz nəfsini dəyişməyincə, Allah onların vəziyyətini dəyişməz.",
      },
    ],
    misconceptions: [
      "Yanlış fikir: Hər şey hökmlüdürsə, səy mənasızdır. İslah: İslam səy, plan, dua və tövbə etməyi əmr edir - vasitələrdən istifadə etmək fərmanın bir hissəsidir.",
      "Yanlış fikir: Qədr o deməkdir ki, mənim günahımda Allah günahkardır. İslah: Bəndə seçir və hesab verir; fərman heç vaxt itaətsizlik üçün bəhanə deyil.",
      "Yanlış fikir: Çətinlik Allahın məndən narazı olduğunu sübut edir. Düzəliş: Sınaqlar təmizlənmə, rütbənin yüksəldilməsi, xəbərdarlıq və ya geri qayıtmağa çağırış ola bilər - çox vaxt qəzəb deyil, qayğı əlaməti.",
    ],
    actions: [
      "Vasitəni yaxşılıqla götür, sonra Allahın hökmünə təvəkkül et.",
      '"Əgər..." peşmanlıq dövrələrini "Qəddar Allah" və konstruktiv növbəti addım ilə əvəz edin.',
    ],
  },
  {
    title: "Tövhid izah etdi",
    summary:
      "Tövhid Allahın rəbbliyini, Onun yeganə ibadət haqqını, ad və sifətlərini birləşdirir.",
    body: [
      "Tövhid (توحيد) - Allahın mütləq birliyi - İslamın qəlbi və hər bir peyğəmbərin risalətidir. Bu, yalnız Ona məxsus olan hər şeydə yalnız Allahı təsbit etmək və Onun kamilliyini Onun Özünü vəsf etdiyi kimi təsdiq etmək deməkdir.",
      "Alimlər tövhidi başa düşməyi və qorumağı asanlaşdırmaq üçün adətən üç əlaqəli aspekt vasitəsilə öyrədirlər. Tövhid ər-Rububiyyə: hər şeyi yaradan, sahibi və idarə edən yalnız Allahdır. Tövhidul-Uluhiyyə: Bütün ibadətə yalnız Allah layiqdir - elçilərin ən çox vurğuladığı və kafirlərin ən çox müqavimət göstərdiyi cəhət budur. Tövhid əl-Əsma vəl-Sifat: Allahın ad və sifətlərini təhrif etmədən, inkar etmədən və bənzərlik olmadan nazil olduğu kimi təsdiq etmək.",
      "Bu üç hissədən ibarət çərçivə bölgü mənbəyi deyil, tədris vasitəsidir; məqsədi möminə ixlasın qorunmasına və birliyin harada poza biləcəyini anlamasına kömək etməkdir. Bütün bunlar hər bir müsəlmanın duasının açılış duasında qeyd olunur: “Biz yalnız Sənə ibadət edirik və yalnız Səndən kömək diləyirik”.",
      "Əhəmiyyətli bir fikir: Allahın Yaradan olduğunu etiraf etmək (rububiyyə) tək başına kifayət deyil. Peyğəmbərləri inkar edənlərin bir çoxu hələ də Allahın göyləri və yeri yaratdığını etiraf edirdilər - onlar tək Ona ibadət etməkdən imtina etdilər (uluhiya). Həqiqi tövhid ibadətlə sübuta yetirilir, təkcə mənşəyinə inanmaqla deyil.",
    ],
    quran: [
      {
        excerpt: "Yalnız Sənə ibadət edir və yalnız Səndən kömək diləyirik.",
      },
      {
        excerpt: "Allah - Ondan başqa heç bir tanrı yoxdur. Ən gözəl adlar Ona məxsusdur.",
      },
    ],
    misconceptions: [
      "Yanlış fikir: Tövhid sadəcə bir cümlə deməkdən ibarətdir. İslah: Qəlbin əqidəsi, dilin bəyanı və ibadətdə yaşanmış bir həqiqətdir.",
      "Yanlış təsəvvür: Allahın Yaradan olduğuna inanmaq bütün tövhiddir. Düzəltmə: Hətta bir çox kafirlər belə təsdiq etdilər ki, imtahan yalnız Allaha ibadət etməkdir.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Şirk izah etdi",
    summary: "Şirk, Allahın hər hansı müstəsna haqqını Ondan başqasına yönəltməkdir.",
    body: [
      "Şirk (شرك) — Allaha şərik qoşmaq — tövhidin əksinədir və Quranda insanın tövbə etmədən vəfat etməsi halında bağışlanmaz olduğunu qeyd etdiyi bir günahdır: “Allah Ona şərik qoşanları bağışlamaz, lakin ondan daha azını istədiyi kimsə üçün bağışlayar”.",
      "Böyük şirk (əl-şirk əl-əkbər) bir ibadəti Allahdan başqasına yönəltməkdir - yalnız Allahın verə biləcəyi şeylər üçün ölü və ya qeybi çağırmaq, yaradılmışlara qurban vermək və ya nəzir etmək və ya bir şeyi Allahı sevmək və itaət etmək lazım olduğu kimi sevmək və itaət etməkdir. İnsanın tövbə etmədən ölməsi İslamdan kənara çıxar.",
      "Kiçik şirk (əl-şirk əl-əsğər) İslamdan xaric etmir, lakin çox təhlükəlidir və əməllərin savabını puç edə bilər. Onun ən aydın forması riyadır - insanlar tərəfindən görülmək və təriflənmək üçün ibadət etməkdir - Peyğəmbər (s) ümməti üçün ən çox qorxduğu şey adlandırmışdır. Allahdan qeyrisinə ucaldacaq şəkildə and içmək burada da düşür.",
      "Əhli-sünnə dil və mühakimə ilə diqqətlidir: ümumiyyətlə şirklə bağlı xəbərdarlıq vacib və aydındır, lakin konkret bir şəxsi müşrik və ya kafir elan etmək (təkfir) elm, etibarlı dəlil və üzrlərin aradan qaldırılması tələb edən ağır bir məsələdir - bu, adi insanlara və ya internetə deyil, ixtisaslı alimlərə aiddir.",
    ],
    quran: [
      {
        excerpt:
          "Həqiqətən, Allah Özünə şərik qoşmağı bağışlamaz, lakin ondan daha az günahı istədiyi kimsə üçün bağışlayar.",
      },
      {
        excerpt: "Ey oğlum, Allaha şərik qoşma. Həqiqətən, birləşmək böyük bir zülmdür (zülm).",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sizin üçün ən çox qorxduğum şey kiçik şirkdir. Bunun nə olduğunu soruşduqda, o, buyurdu: Özünü göstərmək (riya). (Mahmud ibn Ləbid)",
      },
    ],
    misconceptions: [
      "Yanlış fikir: Hər dil sürüşməsi böyük şirkdir. Düzəliş: Alimlər böyükdən kiçikdən fərqləndirirlər və hər bir işi dəlillərlə diqqətlə mühakimə edirlər.",
      "Yanlış fikir: Şirkdən xəbərdar olmaq insanlara qarşı sərt davranmağı tələb edir. Düzəltmə: Peyğəmbərlik yolu həqiqətin aydınlığını mərhəmət və səbirli təlimlə birləşdirir.",
    ],
  },
  {
    title: "Səmimiyyət (İxlas)",
    summary: "Yalnız sırf Allah üçün edilərsə, əməllər qəbul olar.",
    body: [
      "İxlas (إخلاص) məqam, tərif, var-dövlət və ya insanlar üzərində təsir yolu ilə deyil, yalnız bir əməllə Allahın rizasını axtarmaqdır. Bu, hər bir əməlin qəbul olunmasının asılı olduğu batini şərtdir: Peyğəmbər (sallallahu aleyhi və səlləm) buyurmuşdur ki, “əməllər ancaq niyyətlərə görədir və hər kəsə ancaq niyyət etdiyi şey olar”.",
      "Mükafat niyyətdən asılı olduğundan, Allah üçün səmimi olaraq edilən kiçik, sakit bir əməl, şöhrət üçün edilən böyük, açıq bir əməldən üstün ola bilər. Eyni zahiri əməl – sədəqə vermək, dua etmək, öyrətmək – arxasındakı qəlbdən asılı olaraq ibadət və ya boşluq ola bilər.",
      "Səmimiyyət bir dəfə deyil, davamlı olaraq yenilənir, çünki mənlik diqqət axtarmağa meyllidir. Buna görə də möminlər dəfələrlə niyyətlərini təmizləyir və Allahdan onları riya şirkindən və özünü aldatmaqdan qorumasını diləyirlər.",
    ],
    quran: [
      {
        excerpt: "Onlara ancaq dini Ona məxsus olan Allaha ibadət etmək əmr olundu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Əməllər ancaq niyyətlərə görədir və hər bir insan ancaq niyyət etdiyinə sahib olar. (Ömər ibn əl-Xəttab)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Allah sevgisi və qorxusu",
    summary: "Sağlam bir ürək sevgi, ümid və ehtiramlı qorxu qanadlarında Allaha ibadət edər.",
    body: [
      'Qəlbin ibadəti üç böyük məqama əsaslanır: məhəbbət (məhəbbət), ümid (rəca) və ehtiramlı qorxu (xəvf). Allah sevgisi bütün ibadətlərin əsası və hərəkətverici qüvvəsidir - möminlərin "Allaha sevgisi hər şeydən daha güclüdür" - Onun qəzəbindən qorxmaq isə nəfsi günah və qəflətdən çəkindirir.',
      "Əhli-sünnə öyrədir ki, bunlar iki qanadlı və başlı uçan quş kimi tarazlıqda olmalıdır. Qorxusuz sevgi və ümid, qəflət və Allahın rəhmətini adi bir hal kimi qəbul edə bilər; Ümidsiz qorxu ümidsizliyə çevrilə bilər. Qur'an da onlara qoşulur: “Ona qorxu və ümidlə dua edin”.",
      "Bu tarazlıq sadəcə bir hiss deyil; əməldə - namazı qorumaqda, tövbə etməyə tələsməkdə, başqalarına xidmət etməkdə, qəzəbini saxlamaqda və onu hökm edənə məhəbbətdən əziyyətə səbir etməkdə görünür.",
    ],
    quran: [
      {
        excerpt: "...İman gətirənlərin isə Allah sevgisi daha güclüdür.",
      },
      {
        excerpt:
          "...Və qorxu və ümidlə Ona dua edin. Həqiqətən, Allahın mərhəməti yaxşı əməl sahiblərinə yaxındır.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ümid və Tövbə",
    summary:
      "Səmimi tövbə və Allahın geniş rəhmətinə ümid etmək üçün heç bir günah çox böyük deyil.",
    body: [
      "Əhli-sünnənin əsas əqidəsi budur ki, insan günahları nə qədər böyük olursa olsun, Allahın rəhmətindən heç vaxt ümidini kəsməməli, əməlləri nə qədər çox olsa da, Onun hesabından arxayın olmamalıdır. Həm ümid, həm də özünü islah etmək möminin həyatında davamlı olaraq keçir.",
      "Allahın dəvəti heyrətamiz dərəcədə səxavətlidir: “De: “Ey Mənim özlərinə zülm edən bəndələrim, Allahın rəhmətindən ümidinizi kəsməyin. Həqiqətən, Allah bütün günahları bağışlayar”. Günəş qərbdən çıxana və ya insanın öz ölümü yaxınlaşana qədər tövbə qapısı açıq qalır.",
      "Səmimi tövbənin aydın şərtləri var: günahı dərhal tərk etmək, ona görə səmimi peşman olmaq və bir daha geri qayıtmayacağına qəti qərar vermək - və əgər günah başqa bir insanın hüquqlarını əhatə edirsə, bu hüquqları bərpa etmək və ya ondan bağışlanmaq istəmək. Bunlar yerinə yetirildikdə, Allahın cavabı sadəcə qəbul deyil, sevincdir: O, “qulunun tövbəsindən daha çox sevinər”, nəinki itmiş dağını və azuqəsini boş səhrada geri qaytaran adamdan.",
    ],
    quran: [
      {
        excerpt:
          "De: “Ey Mənim özlərinə zülm edən qullarım, Allahın rəhmətindən ümidinizi kəsməyin. Həqiqətən, Allah bütün günahları bağışlayar.",
      },
      {
        excerpt: "Ey iman gətirənlər, Allaha səmimi qəlbdən tövbə edin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah öz bəndəsinin tövbəsinə minəsini yeyib-içdiyi halda bərbad yerdə itirib onu yenidən tapan adamdan daha çox sevinər. (İbn Məsud)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Cənnət (Cənnət)",
    summary: "Cənnət Allahın mərhəməti ilə möminlər üçün hazırladığı əbədi mükafatdır.",
    body: [
      "Cənnət realdır, əbədidir və insan ağlının təsəvvür edə biləcəyi hər şeydən daha yüksəkdir. Peyğəmbər (Allahın ona salavat və salamı olsun) Allahın kəlamını çatdırdı: “Mən saleh bəndələrim üçün heç bir gözün görmədiyini, heç bir qulağın eşitmədiyini və heç bir qəlbin düşünmədiyini hazırlamışam”. Onun ən böyük mükafatı Allahın rizası və Üzünü görməsidir.",
      "Cənnətə daxil olmaq, nəhayət, Allahın rəhməti ilə - heç kəsin yalnız əməli sonsuz səadətə səbəb ola bilməz - ancaq səmimi iman və saleh əməl Allahın təyin etdiyi və qəbul etdiyi vəsilədir. İkisi bir-birinə zidd deyil: mərhəmət səbəb, iman və əməl isə Onun açdığı yoldur.",
      "Cənnətə iman insanın indi necə yaşadığını yenidən formalaşdırır: səbri çətinliklərlə, səxavətlə zənginliklə, ibadətdə əzmkarlıqla alovlandırır, çünki mömin keçib gedən dünyanı əbədi evə dəyişir. Qur'an bizi ona doğru “yarışmağa” çağırır.",
    ],
    quran: [
      {
        excerpt:
          "Rəbbiniz tərəfindən bağışlanmağa və genişliyi göylərlə yer qədər olan, müttəqilər üçün hazırlanmış Cənnətə tələsin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah buyurdu: “Mən saleh bəndələrim üçün heç bir gözün görmədiyini, heç bir qulağın eşitmədiyini və heç bir insan qəlbinin düşünmədiyini hazırlamışam. (Əbu Hureyrə; həmçinin Səhih Müslim 2824)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Cəhənnəm (Cəhənnəm)",
    summary: "Cəhənnəm əsl xəbərdarlıqdır, çox gec olmadan qəlbləri Allaha qaytarmaq üçündür.",
    body: [
      "Cəhənnəmə (Cəhənnəmə) iman, qeybə və Allahın kamil ədalətinə iman gətirməyin bir hissəsidir. Bu, insanların təhlükəni ciddi qəbul etmələri üçün Qur'an və Sünnədə canlı ifadələrlə təsvir edilən əsl cəza yurdudur.",
      "Xəbərdarlıqlar mərhəmətli bir məqsədə xidmət edir: onlar insanları təsvir etdikləri nəticələrdən qorumaq üçün mövcuddur - təkəbbür, zülm və israrlı, həqiqəti inkar edənləri yoxlamaq və qafilləri qapı açıq ikən tövbə etməyə təşviq etmək.",
      "Əhli-sünnə xəbərdarlıq və rəhməti bir yerdə saxlayır. Təhdidlər ciddi və realdır, lakin Ona tərəf dönənlər üçün Allahın rəhməti genişdir - və tövhid əhli arasında Cəhənnəmə daxil olan günahkarlar orada əbədi qalmayacaqlar, lakin nəticədə Allahın rəhməti və icazə verdiyi şəfaətlə oradan çıxarılacaqlar.",
    ],
    quran: [
      {
        excerpt:
          "Ey iman gətirənlər, özünüzü və ailənizi yanacağı insanlar və daşlar olan oddan qoruyun.",
      },
      {
        excerpt:
          "…Allahın rəhmətindən ümidinizi kəsməyin. Həqiqətən, Allah bütün günahları bağışlayar.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dirilmə",
    summary: "Ölümdən sonra bütün insanlar Allahın hüzurunda durmaq üçün bədəncə dirildiləcəklər.",
    body: [
      "Dirilmə (əl-Bəs) rəmz və ya məcaz deyil, bədən və gerçəkdir. Çürümüş sümüklərin yenidən yaşaya biləcəyinə şübhə edənlərə Allah ən sadə məntiqlə belə cavab verir: onları ilk dəfə yoxdan yaradan, şübhəsiz ki, onları bərpa edə bilər və bizcə, yenidən yaratmaq, yaranmaqdan daha asandır.",
      "Ölümlə dirilmə arasında bərzəx - sorğu-suala, asanlığı və ya çətinliyi ilə qəbrin aralıq həyatı var. Sonra sur üfürülür və bütün məxluqat dirildilib Allahın hüzurunda haqq-hesab üçün toplanar.",
      "İnsan həyatına mənəvi ciddilik verən də bu inancdır: dirilmədən rahat ölən zalımla haqsızlıqla ölən məzlum eyni aqibətlə qarşılaşacaq. Bununla hər bir pisliyə cavab verilir və hər yaxşılıq mükafatlandırılır, səbir və ədalətə məna verir.",
    ],
    quran: [
      {
        excerpt:
          "Deyir ki, sümüklər çürümüş halda onları kim dirildər? De: “Onları ilk dəfə dirildən dirildəcək...”",
      },
      {
        excerpt: "Şübhəsiz ki, o Saat gələcəkdir və Allah qəbirlərdə olanları dirildəcəkdir.",
      },
    ],
  },
  {
    title: "Qiyamət günü",
    summary: "Hər bir nəfs Allahın hüzurundadır. Onun ədaləti mükəmməl və tamdır.",
    body: [
      "Qiyamət günü hər bir insan, əməl və niyyətlərinə görə, Allahın haqqına və başqa insanların haqqına görə o qədər dəqiq bir ədalətlə hesaba çəkilir ki, zərrə qədər də olsa, “heç bir kəsə zülm edilməyəcək”.",
      "O gün nə nəsil, nə var-dövlət, nə təbəqə, nə millət, nə dünyəvi dərəcə heç kimə fayda verməz; ancaq Allahın qəbul etdiyi səmimi iman və saleh əməl fayda verər. Dəftərlər paylanır, əməllər ölçülür, hətta insanlar arasında edilən pisliklər də yaxşı və pis əməllərin ötürülməsi ilə aradan qaldırılır.",
      "Bu əminlik indi xasiyyəti dəyişdirmək üçün nəzərdə tutulmuşdur: mömini düzlüyə, etibarlılığa, başqalarının haqqını qorumağa, səhvləri düzəltməyə və borcun pulla deyil, əməllə ödənildiyi gündən əvvəl borcunu qaytarmağa çağırır.",
    ],
    quran: [
      {
        excerpt: "Biz ədalət tərəzisini Qiyamət günü üçün qoyuruq ki, heç bir kəsə zülm olunmaz.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Tərəzi və Sirat",
    summary: "Mizanda əməllər ölçülür, insanlar iman və əməlləri ilə Siratdan keçirlər.",
    body: [
      "Əhli-sünnə, Mizan (Tərəzi) və Siratı (Cəhənnəm üzərindəki Körpü) axirətin gerçək hadisələri kimi təsdiq edir, tam olaraq xəbər verildiyi kimi inanır. Tərəzidə əməllər və onu görənlər insafla ölçülür: “Kimin tərəzisi ağır olarsa, o, xoş həyatda olar. Kimin tərəzisi yüngül olarsa, onun sığınacağı yer uçurum olar”.",
      "Sirat Cəhənnəm üzərində uzanan bir körpüdür ki, hamı keçməlidir. Qurani-Kərim buyurur: “Sizdən elə bir kəs yoxdur ki, onun üstündən keçməsin”, sonra “Allahdan qorxanları xilas edəcəyik”. İnsanlar əməllərinə görə - bəziləri işıq və ya külək kimi sürətlə, digərləri mübarizə apararaq, bəziləri isə sürüşərək - Allahın rəhməti və ədaləti ilə keçirlər.",
      "Bu həqiqətlər boş yerə qorxutmaq üçün deyil, ciddilik yetişdirmək üçün deyilmişdir: kiçik işlərin ağırlığı haqqında, ibadətlərin ixlası və başqalarının haqqına hörmətlə yanaşmaq, çünki bunların hamısı ölçüləcəkdir.",
    ],
    quran: [
      {
        excerpt:
          "Kimin tərəzisi ağır olarsa, o, xoş həyatda olar. Kimin tərəzisi yüngül olarsa, onun sığınacağı yer uçurum olar.",
      },
      {
        excerpt: "Sizdən heç kəs onu keçib getməsin... Sonra Allahdan qorxanları xilas edəcəyik.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Şəfaət (Şəfa)",
    summary: "Şəfaət gerçəkdir - ancaq Allahın izni ilə, Onun razı olduğu kəslər üçün.",
    body: [
      "Qiyamət günü şəfaət (şəfaət) Qur'an və Sünnədə qəti şəkildə təsdiq edilmişdir. Hamısının ən böyüyü, Həzrəti Məhəmməd Peyğəmbərə (s) bəxş edilmiş “Məqimül-mahmud”dur ki, o zaman o, məxluqatın hesaba başlaması üçün şəfaət edər və onun ümməti arasında böyük günah sahibləri üçün başqa şəfaətləri olacaqdır.",
      "Amma heç kim öz səlahiyyəti ilə vasitəçilik etmir. Hər bir səhih şəfaət ancaq “Onun izni ilə” və ancaq Allahın razı olduğu kəslər üçün olar: “Onun izni olmadan Onun yanında kim şəfaət edə bilər?” Bu, Allahın nəticə üzərində mütləq hökmranlığını qoruyur.",
      "Alimlər bir neçə təsdiqlənmiş şəfaət növlərini təsvir edirlər - hesabın başlaması, insanların Cənnətə daxil olması, günahkar möminlərin bağışlanması və ya cəhənnəmdən uzaqlaşdırılması - eyni zamanda son hökmün həmişə yalnız Allaha aid olduğu qənaətindədirlər.",
    ],
    quran: [
      {
        excerpt: "Onun izni olmadan Onun yanında kim şəfaət edə bilər?",
      },
      {
        excerpt:
          "O gün Rəhmanın izn verdiyi və sözünü bəyəndiyi kimsədən başqa şəfaət fayda verməz.",
      },
    ],
    hadith: [
      {
        excerpt:
          "İnsanlar mənim yanıma gələcək və mən də Rəbbimə səcdə edəcəyəm. sonra deyiləcək: Başını qaldır, istə və sənə veriləcək, şəfaət et və sənin şəfaətin qəbul olunacaq. (Əbu Səid - böyük şəfaət)",
      },
    ],
    misconceptions: [
      "Yanlış fikir: Şəfaət tövbə ehtiyacını aradan qaldırar. İslah: Yalnız Allahın izni ilə baş verir və heç vaxt günahda israr etməyə icazə vermir.",
      "Yanlış fikir: İnsan indi peyğəmbərləri və ya salehləri şəfaət etməyə çağıra bilər. İslah: İbadət və dua yalnız Allaha məxsusdur; axirətdə şəfaət Onun təqdiri ilədir, Onun razılığı ilə istənilir.",
      "Yanlış fikir: Şəfaət Allahın ədalətinə ziddir. İslah: Onun mərhəmətinin bir ifadəsidir ki, Onun kamil ədaləti çərçivəsində və yalnız Onun izni ilə fəaliyyət göstərir.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qiyamətin əlamətləri",
    summary:
      "Kiçik və böyük əlamətlər doğrudur; müdriklər fərziyyədən daha çox hazırlığa diqqət yetirirlər.",
    body: [
      "Səhih mətnlər qiyamətdən əvvəl gələn əlamətləri kiçik əlamətlər (bir çoxları artıq görünmüşdür, məsələn, Peyğəmbərin (s) özünün göndərilməsi, cəhalətin yayılması və geniş yayılmış qəflət kimi) və axıra yaxın baş verəcək əsas əlamətləri təsvir edir.",
      "Peyğəmbərin (s) bir hədisində on əsas əlamət birlikdə adlandırılmışdır: Dəccalın zühuru, İsanın (Məryəm oğlu) enməsi, Yəcuc və Məcucun zühuru, üç böyük sürüşmə, tüstü, günəşin qərbdən çıxması və insanları son toplanışa aparan od.",
      "Alimlər bəzən bəzi əlamətlərin dəqiq ardıcıllığı ilə bağlı ixtilaf edirlər, lakin onlar iki şeydə həmfikirdirlər: Qiyamətin qopması mütləqdir və onun dəqiq vaxtı Allahdan başqa heç kəsə məlum deyil, hətta Cəbrail ondan soruşanda Peyğəmbərə (s) məlumdur. Buna görə də əlamətlərə peyğəmbərlik cavabı praktiki xarakter daşıyır, spekulyativ deyil: sonsuz proqnozdan daha çox iman, tövbə, ədalət və faydalı əməlləri artırın.",
    ],
    quran: [
      {
        excerpt:
          "Səndən o Saat haqqında soruşurlar ki, o nə vaxt qopacaq? De: “Onun elmi ancaq Rəbbimin yanındadır.",
      },
      {
        excerpt:
          "Məgər onlar o Saatın qəflətən başlarına gəlməsinimi gözləyirlər? Onun əlamətləri artıq gəlib.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Siz on əlamət görməyincə Qiyamət qopmayacaq: tüstü, Dəccal, Heyvan, qərbdən çıxan günəş, İsa, Yəcuc və Məcuc enməsi və üç sürüşmə... (Hüzeyfə ibn Useyd)",
      },
    ],
    misconceptions: [
      "Yanlış fikir: Hər bir böyük dünya hadisəsi mütləq son əlamətdir. Düzəliş: Bu cür iddialar sensasiya deyil, həqiqi sübut və elmi ehtiyat tələb edir.",
      "Yanlış fikir: İşarələri bilmək bizə Qiyamətin tarixini təyin etməyə imkan verir. Düzəliş: Dəqiq vaxt yalnız Allaha məlumdur; əlamətlər bizi proqnozlaşdırmağa deyil, hazırlamağa çağırır.",
    ],
    appLinks: [{}],
  },
  {
    title: "Əqidə ilə bağlı tez-tez verilən suallar",
    summary: "Ümumi etiqad sualları tarazlıq, dəlil və yaxşı ədəbiyyatla cavablandırılır.",
    body: [
      "Sual: Bütün sünnilər hər bir əqidə baxımından eynidirlərmi? Cavab: Əhli-sünnə bir əsası bölüşür və əsas məsələlərdə tamamilə həmfikirdir; tanınmış ilahiyyat məktəbləri (Əthari, Əşəri, Maturidi) yalnız bəzi texniki təriflərdə fərqlənir və buna düşmənçiliklə deyil, hörmətli öyrənmə ilə yanaşmaq lazımdır.",
      "Sual: Düzgün əqidəyə sahib olmaq üçün qabaqcıl fəlsəfəyə ehtiyacım varmı? Cavab: Xeyr. Hər bir müsəlman öz ehtiyacına uyğun əsasları – altı maddə və xalis tövhidi – öyrənməlidir, eyni zamanda ixtisaslı müəllimlər tərəfindən daha dərindən öyrənmək faydalıdır.",
      "Sual: Əqidəni bilmək məni başqalarına qarşı sərt etməlidirmi? Cavab: Xeyr. Sağlam əqidə təvazökarlığı, minnətdarlığı, mərhəməti və diqqətli nitqi artırmalıdır. Müsəlmanları alçaltmaq və ya təkfirə tələsmək üçün əqidədən istifadə etməyin özü çox ciddi səhvdir.",
      "Sual: İman, İslam və ehsan arasında fərq nədir? Cavab: Cəbrail hədisində İslam zahiri ibadətlər, iman batini etiqadlar (altı şərt), ehsan isə hər ikisinin kamilliyi - Allahı görürmüş kimi ibadət etməkdir.",
    ],
    actions: [
      "Mübahisəli texniki detallardan əvvəl aydın, razılaşdırılmış əsaslara üstünlük verin.",
      "Mürəkkəb bir inanc məsələsi praktikanıza həqiqətən təsir etdikdə ixtisaslı yerli alimlərlə məsləhətləşin.",
    ],
  },
  {
    title: "İstinadlar və Əlavə Tədqiqat",
    summary: "Qur'an və həqiqi Sünnə ilə başlayın, sonra etibarlı sünni əqidəsinin əsasları.",
    body: [
      "Etiqad üçün əsas istinad həmişə Qur'an və səhih Sünnədir, onu səhabələr və Əhli-sünnənin ilk alimləri başa düşdükləri kimi başa düşülür - mətnlərdə oxunan sonrakı cərəyanlar vasitəsilə deyil.",
      "Faydalı tədqiqata etibarlı müəllimlər tərəfindən səviyyənizə uyğun izahatla öyrədilmiş qısa klassik əqidə əsasları (məsələn, əl-Əqidə ət-Təhaviyyə və ilk alimlərin əsərləri) daxildir.",
      "Alimlər ikinci dərəcəli məsələlərdə ixtilaf etdikdə, təvazökarlıqla dəlilləri öyrənin və texniki ixtilafları məzhəb düşmənçiliyinə çevirməkdən çəkinin - möminlərin əsas üzərində birləşməsi dinin bir əmridir.",
    ],
    disclaimer:
      "Bu modul tədris xarakterlidir və polemik deyil. Şəxsi qərarlar və ya həssas inanc problemləri üçün etibar etdiyiniz ixtisaslı alimlərə müraciət edin.",
    actions: [
      "Bir müəllim və ya etibarlı bir primer ilə hər həftə bir inanc mövzusunu öyrənin.",
      "Altı iman maddəsini əzbərləyin və hər birini öz sözlərinizlə izah etməyi bacarın.",
    ],
    appLinks: [{}, {}, {}],
  },
];

export const AQEDAH_GLOSSARY_AZ: DeepPartial<AqeedahGlossaryTerm>[] = [
  {
    term: "Əqidə",
    definition:
      "Etiqad – müsəlmanın Allaha, Onun mələklərinə, kitablarına, elçilərinə, axirət gününə və ilahi hökmə inandığı şeydir.",
  },
  {
    term: "Tövhid",
    definition: "Rəbblikdə, ibadətdə və adlarda/sifətlərdə Allahın birliyi – İslamın təməli.",
  },
  {
    term: "Şirk",
    definition:
      "İbadətlərdə və ya yalnız Onun malik olduğu sifətlərdə Allaha şərik qoşmaq – tövhidin əksinədir.",
  },
  {
    term: "İman",
    definition: "İman – qəlblə iman, dillə təsdiq və əzalarla əməl etməkdir.",
  },
  {
    term: "Qədr",
    definition:
      "Allahın hər şeyin sonsuz elmi və hökmü - xeyir və şər Onun izni və hikməti ilə mövcuddur.",
  },
  {
    term: "Nəbi",
    definition: "Peyğəmbər – vəhy alan və onu çatdırmaq əmr edilən; əvvəlki qanuna əməl edə bilər.",
  },
  {
    term: "Rəsul",
    definition: "Elçi — öz qövmünə yeni kitab və ya qanunla göndərilmiş peyğəmbər.",
  },
  {
    term: "Sirat",
    definition: "Qiyamət günü cəhənnəm üzərində körpü - möminlər əməllərinə görə keçirlər.",
  },
];
