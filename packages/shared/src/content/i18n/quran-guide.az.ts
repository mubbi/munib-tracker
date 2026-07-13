// Azerbaijani translation overlays for the Learn Qur'an content.
// Each overlay mirrors the order of its English source array in ../quran-guide*.ts
// (index-aligned); untranslated entries fall back to English. Only human-readable
// text is translated — ids, routes, surah/ayah numbers, collections, citations,
// grades, and Qur'an verse-reference labels stay in the English source.
import type {
  QuranGuideApplyChallenge,
  QuranGuideDailyLesson,
  QuranGuideLetter,
  QuranGuideMemorizationPlan,
  QuranGuidePronunciationPair,
  QuranGuideQuizQuestion,
  QuranGuideReadingLevel,
  QuranGuideStory,
  QuranGuideStructureLevel,
  QuranGuideTadabburPrompt,
  QuranGuideTajweedLesson,
  QuranGuideTheme,
  QuranGuideTimelineEvent,
  QuranGuideTopic,
  QuranGuideVocabEntry,
} from "../../types/quran-guide";
import type { DeepPartial } from "./localize";

export const QURAN_GUIDE_TOPICS_AZ: DeepPartial<QuranGuideTopic>[] = [
  {
    title: "Giriş",
    summary: "Qur'an nədir, nə üçün nazil olub və qiraətin fəzilətləri.",
    body: [
      "Qur'an sözü ərəbcə qara'a kökündən gəlir, oxumaq və ya ucadan oxumaq mənasını verir - buna görə də Kitab öz məqsədini öz adında daşıyır: dildə və qəlbdə təkrar-təkrar oxunmaq üçün nəzərdə tutulub. Əsas sünni inancında Qur'an, Hira mağarasındakı ilk sözlərdən Peyğəmbərin (sallallahu aleyhi və səlləm) vəfatından qısa müddət əvvələ qədər təxminən 23 il ərzində Cəbrayıl mələk vasitəsilə Məhəmməd Peyğəmbərə (s.",
      "Musa, Davuda və İsaya (əleyhissəlam) əvvəllər nazil edilən vəhylərdəki həqiqəti təsdiq edən və onların daşıdıqları risaləti tamamlayan, bəşəriyyətə göndərilən son kitabdır. Allah onun məqsədini açıq şəkildə bildirir: “İnsanlara hidayət olaraq” – insanları qarışıqlıq və bütpərəstlik zülmətindən tövhid nuruna, yalnız Allaha ixlasla ibadət, düzgün əxlaq və axirət həyatına ciddi hazırlıq nuruna çıxarmaq üçün nazil edilmişdir. Hər peyğəmbər eyni özə çağırmışdır; Qur'an onun son, qorunan şəklidir.",
      "Qur'an oxumağın özü bir ibadətdir, sadəcə məlumat oxumaq deyil. Peyğəmbər ﷺ öyrətdi ki, oxunan hər bir hərf bir savab qazandırır və hər bir yaxşılıq ən azı on qat artır - beləliklə, hətta bir sətirdən başlayan yeni başlayanlar artıq savab toplayır. Qiyamət günü Qur'an şəfaətçi olaraq gələcək, dünya həyatında onunla dostluq edənlər üçün yalvaracaq. Onu səlis oxuyan alicənab mələk-katiblərin yanında olar və onun üzərində büdrəyərək öyrənmək üçün mübarizə aparan, zəhmətin əvəzini ikiqat qazanar.",
      "Qur'anın nə olmadığını aydınlaşdırmağa kömək edir. Qur'an, nazil olandan bəri dəyişməz olaraq, Allahın ərəbcə öz kəlamıdır. Hədis - Peyğəmbərin (sallallahu aleyhi və səlləm) sözləri, hərəkətləri və səssiz razılıqları ayrıdır: Qur'anı izah edir və nümayiş etdirir, lakin Peyğəmbərin (s) ifadəsidir, adı çəkilən rəvayətlər silsiləsində qorunub saxlanılır və alimlər tərəfindən səhih (mötəbər), həsən (yaxşı) və ya daif (zəif) kimi qiymətləndirilib. Hər ikisi vəhydir, hər ikisi də məcburidir, lakin namazda ibadət olaraq yalnız Qur'an oxunur və yalnız Qur'an Allahın möcüzəvi, təkrarolunmaz nitqidir.",
    ],
    quran: [
      {
        excerpt: "İnsanlara hidayət olaraq Qur'anın nazil olduğu Ramazan ayı...",
      },
      {
        excerpt:
          "De: “Əgər insanlar və cinlər bu Qurana bənzər bir şey gətirmək üçün bir yerə yığışsalar, heç cür...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Hər kəs Allahın kitabından bir hərf oxuyarsa, həsənə çatar və həsənə on qat artır.",
      },
      {
        excerpt: "Qur'anı oxuyun, çünki o, qiyamət günü öz səhabələrinə şəfaətçi kimi gələcək.",
      },
      {
        excerpt:
          "Qurana mahir olan, əzəmətli, saleh katiblərlə birlikdədir, onu çətinliklə, kəkələyərək oxuyana isə ikiqat savab verilir.",
      },
    ],
    actions: [
      "Qur'an üçün sabit gündəlik vaxt təyin edin - hətta beş diqqətli dəqiqə bərəkət və ardıcıllıq yaradır.",
      "Ən azı bir sətir mənasını oxuyun: ərəbcə oxuyun, sonra tərcüməni yavaş-yavaş oxuyun.",
      "Münibin Qur'an oxuyucusunu açın və qaldığınız yerdən davam edin.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qur'an necə nazil olub",
    summary: "Hira mağarası, Cəbrail, Məkkə və Mədinə dövrləri, tərtibi, mühafizəsi.",
    body: [
      "Vəhy Ramazan ayında, Peyğəmbərin (sallallahu aleyhi və səlləm) qırx yaşında ikən tənhalıq və düşünmək üçün Məkkə xaricindəki bir dağdakı Hira mağarasına çəkildiyi vaxt başladı. Orada mələk Cəbrayıl onun yanına gəlib: “Oxu!” – dedi. Oxuyub yazmayan Peyğəmbər (s) cavab verdi ki, mələk onu qucaqlayıb Əl-Ələq surəsinin ilk beş ayəsini çatdırana qədər: “Yaradan Rəbbinin adı ilə oxu!”. O, sarsılaraq evinə arvadı Xədicənin yanına qayıtdı və o, onu sakitləşdirdi və vəhy mələyini tanıyan və bunun Musaya gələn elçi olduğunu təsdiq edən alim olan qohumu Varaqə ibn Nəvfəlin yanına apardı.",
      "Bundan sonra vəhydə (fətrətdə) qısa bir fasilə yarandı, bu sükut dövrü Peyğəmbəri daha çox şeyə həsrət qoydu; sonra yenidən başladı və ömrünün sonuna qədər mərhələlərlə davam etdi. Vəhy birdən-birə nazil olmayıb, hadisələrə, suallara və cəmiyyətin artan ehtiyaclarına cavab olaraq nazil olub - bu, Allahın Peyğəmbərin (sallallahu aleyhi və səlləm) qəlbini gücləndirmək və Kitabı insanların həyatında asanlaşdırmaq kimi təsvir etdiyi mərhələli üsuldur.",
      "Məkkə dövrü təxminən on üç il davam etdi. Onun surələri çox vaxt qısa, ritmik və güclü olur; Onlar təməlləri - Allahın birliyini, dirilmənin və hesab verəcəyinin əminliyini, inkar edilmiş daha sonra haqlı çıxmış əvvəlki peyğəmbərlərin hekayələrini və bütpərəstlik və ədalətsizliyə bürünmüş bir cəmiyyətdə əxlaqi islahata çağırışları döyürlər.",
      "622-ci ildə Mədinəyə hicrət etdikdən sonra müsəlmanlar artıq zülmə məruz qalan azsaylılar deyil, cəmiyyət Qur'an bir cəmiyyət idilər. Mədinə vəhyləri, ümumiyyətlə, daha uzun və təfərrüatlıdır, yeni ümmətin ehtiyac duyduğu qanun və ictimai nizamı ortaya qoyur: namazın, zəkatın, orucluğun, irsiyyətin, nikah və boşanmanın xüsusiyyətləri, müqavilələr, döyüşlər və müqavilələr, həmçinin cəmiyyəti daxildən sarsıdan münafiqlər üçün möhkəm sözlər.",
      "Mətnin mühafizəsi Peyğəmbərin (s) öz sağlığında başlamışdır. Səhabələr vəhy gələn kimi əzbərləyir, katiblər isə Peyğəmbərin (sallallahu aleyhi və səlləm) birbaşa nəzarəti altında onu perqamentə, xurma budaqlarına, sümüklərə və daşa yazırdılar. Yəmamə döyüşündə bir çox hafiz şəhid olduqdan sonra Əbu Bəkr Zeyd ibn Sabitə əmr etdi ki, yazılı Qur'anı bir topluda (sühuf) bir yerə toplasın. Sonralar, imperiya genişləndikcə və dialektlər dəyişdikcə, Osmanın Qüreyş ləhcəsində mötəbər nüsxələri hazırlanaraq böyük şəhərlərə göndərildi və bütün ümmət üçün bir yazılı mətn standartlaşdırıldı.",
      "Allah Özü Qur'anın mühafizəsinə zəmanət vermişdir: “Həqiqətən, Zikri Biz nazil etdik və biz onu qoruyub saxlayacağıq”. Bu vəd bir-birinə bağlı olan üç təminatla yerinə yetirildi: hər nəsildə kütləvi əzbərləmə, diqqətlə yazılı şəkildə ötürmə və Peyğəmbərə (sallallahu aleyhi və səlləm) çatan qırılmayan qiraət zəncirləri müəllimdən şagirdə. Mömin üçün bu, teoloji bir işarədir; tarixçi üçün bu, sənədləşdirilmiş faktdır: bu gün oxunan Qur'an on dörd əsr əvvəl nazil olmuş mətndir.",
    ],
    quran: [
      {
        excerpt: "Həqiqətən, Zikri Biz nazil etdik və onu qoruyub saxlayacağıq.",
      },
      {
        excerpt: "Yaradan Rəbbinin adı ilə oxu...",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qur'anın quruluşu",
    summary: "114 surə, 30 cüz, ayə, Məkki/Mədəni, nizam vs vəhy.",
    body: [
      "Müs'həf - Qur'anın fiziki nüsxəsi - hər birinin öz adı olan, adətən içindəki diqqəti çəkən sözdən götürülmüş 114 surədən (fəsildən) ibarətdir. Onlar, ciddi olmasa da, əsasən ən uzundan ən qısaya doğru düzülür: Kitabın giriş qapısı kimi ilk olaraq Əl-Fatihə, sonra isə uzun Əl-Bəqərə gəlir. Bu nizam təvkifidir - əmri Peyğəmbərə (s) Cəbrayıl öyrətdi və ayələrin nazil olduğu sıra deyil. Deməli, mushəfdə oxuduğunuz ardıcıllıq xronoloji deyil, qəsdən və ilahi şəkildə sabitlənmişdir.",
      "Hər surə Məkki (hicrətdən əvvəl nazil olmuş) və ya Mədəni (ondan sonra nazil olmuşdur) kimi təsnif edilir və bir neçə surə hər ikisinin ayələrini ehtiva edir. Bir qayda olaraq, Məkki surələri əqidə - tövhid, dirilmə və peyğəmbərlərin hekayətləri - daha qısa, daha təcili hissələrdə cəmlənir, Mədəni surələri isə oturmuş cəmiyyətin ehtiyac duyduğu təfərrüatlı qanunvericilik və icma rəhbərliyini əlavə edir. Hansının olduğunu bilmək bir surəni düzgün işıqda oxumağa kömək edir.",
      "İdarə edilə bilən mütaliə üçün Qur'an da cüz (cəmi əcza') adlanan 30 bərabər hissəyə və hər cüz hizb adlanan iki yarıya bölünərək cəmi 60 hizb verir. Ramazan ayı - bütün Qur'anı bir ayda tamamlamağı - bu qədər təbii edən budur: gündə bir cüz Kitabı otuz gündə bitirir və gündə iki dəfə yarım cüz daha yumşaqdır. Hər bir surənin içərisində ayələr (ayələr) nömrələnmişdir ki, hər hansı bir keçid dəqiq surə: ayə; standart Mədinə sayı 6,236 ayədir, bir neçə ayə sərhədlərinin nömrələnməsi ilə bağlı yalnız kiçik, yaxşı sənədləşdirilmiş fərqlər - mətnin özü eynidir.",
      "Bu strukturu başa düşmək qeyri-müəyyən niyyətləri konkret plana çevirir. Siz sabit gündəlik hissə ayıra, əzbərləmək üçün Juz Amma (sonuncu, otuzuncu hissə, qısa surələrlə dolu) hədəfə ala, bir neçə surədə səbir kimi bir mövzuya əməl edə və ya Ramazan ayı ətrafında tam oxunuşu planlaşdıra bilərsiniz. Quruluş Quranla ömürlük əlaqəni əldə edilə bilən bir quruluşdur.",
    ],
    quran: [
      {
        excerpt: "…Ayələri müfəssəl olan bir kitab, bilənlər üçün ərəbcə bir Qurandır.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Oxumağı öyrənin",
    summary: "Əlifbadan səlis qiraətə qədər yeddi səviyyə - mütləq yeni başlayanlar üçün.",
    body: [
      "Demək olar ki, hər bir müsəlman Qur'anı orijinal ərəbcə oxumaq arzusundadır və bu, istənilən yaşda əlçatan bir məqsəddir – əvvəllər ərəb dili olmayan saysız-hesabsız böyüklər səlis oxumağı öyrənirlər. Tərcüməni başa düşmək dəyərlidir, lakin əsl ərəb sözlərini oxumağın özü ibadətdir və buna dəyər. Bu yol sizi bir hərfi tanımamaqdan düzgün tələffüzlə ayələri oxumağa qədər addım-addım aparır.",
      "Səyahət yeddi təbii mərhələdən keçir. Səviyyə 1 və 2 hərf tanınmasını qurur — əvvəlcə təcrid olunmuş formada olan 28 hərf, sonra isə sözün əvvəlində, ortasında və sonunda onların formaları necə dəyişir. Səviyyə 3 hərəkəti, hər hərfin hansı saiti daşıdığını bildirən kiçik işarələri (fatha, kasra, damma, sukun, shaddah, tanween) təqdim edir. Səviyyə 4 və 5-in klikləndiyi yerdir: siz hərfləri hecalara birləşdirirsiniz və 'al-' müəyyən artikli üçün günəş və ay hərfi qaydaları da daxil olmaqla bütün sözləri səsləndirirsiniz. 6 və 7-ci səviyyələr qısa ayələrə keçir və sonra təcvidin əsas qaydaları tətbiq edilməklə hamar, səlis oxunur.",
      "İki vərdiş hər şeyi sürətləndirir. Birincisi, davamlı olaraq ixtisaslı bir qiraətçiyə qulaq asın və tam olaraq təqlid edin — Qur'an qulaqdan, ağızdan ağıza ötürülür, ona görə də qulağınız sizin ən yaxşı müəlliminizdir; ritmi, saitlərin uzunluğunu və hər bir səsin formasını köçürün. İkincisi, kağızda və ya ekranda hərfləri izləyin və yazın, çünki əl gözün və dilin öyrəndiyini gücləndirir.",
      "Bir xəbərdarlıq: proqramlar və qeydlər əla dəstəkdir, lakin onlar sizi bir insanın edə biləcəyi şəkildə düzəldə bilməz. Peyğəmbər (s) Qur'anı birbaşa Cəbrayıldan öyrənmiş və onu səhabələrə üz-üzə öyrətmişdir və canlı islah zənciri, qiraətin hər zaman nə qədər dəqiq qorunub saxlanmasıdır. Sizi dinləmək və özünüz eşitmədiyiniz səhvləri düzəltmək üçün yerli müəllim və ya strukturlaşdırılmış onlayn təcvid proqramı tapın.",
    ],
    actions: [
      "Ərəb hərfləri bölməsində gündə bir hərf öyrənin - baxın, eşidin, söyləyin, yazın.",
      "Mushafdakı sözləri izləyərkən Fatihə surəsini təkrar dinləyin.",
      "Hər həftə oxuduğunuzu eşitmək və düzəltmək üçün yerli və ya onlayn bir müəllim təyin edin.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Təcvid",
    summary: "Gözəl və düzgün qiraət qaydaları — günorta sakini, mədd, vəqf və s.",
    body: [
      "Təcvid bir şeyi əla və ya gözəl etmək mənasını verən kökdən gəlir. Elm olaraq hər hərfin öz haqqını - ağızda və ya boğazda düzgün tələffüz nöqtəsini (məhrəc), xas xüsusiyyətlərini (sifat), sait və pauzaların düzgün vaxtını vermək deməkdir. Bir sözlə, təcvid Qur'anın nazil olduğu kimi oxumaq sənətidir.",
      "Bu vacibdir, çünki Qur'an təsadüfən oxunacaq hər hansı bir mətn deyil. O, artıq qurulmuş təcvidlə nazil oldu: Cəbrail onu Peyğəmbərə (s) dəqiq tələffüzlə oxudu, Peyğəmbər də onu səhabələrə oxudu, onlar da onu pozmadan bizə çatdırdılar. Hərfi səhv etmək kiçik bir şey deyil - hərfi səhv tələffüz etmək sözü tamamilə dəyişdirə bilər (məsələn, vurğulayan ص ilə sadə س və ya ع və ح hərflərini qarışdırmaq) və bəzi yerlərdə Allahın sözlərinin mənasını dəyişdirir. Təcvid elmi məhz bundan qorunmaq üçün mövcuddur.",
      "Hər şeyi bir anda mənimsəmək lazım deyil. Əsas qaydalar ardıcıllıqla öyrənilir: zöhr sakinaya və tənvin (izhar, idğam, iqləb, ixfa), mim sakinə hökmləri, müxtəlif mədd (uzatma), qalqələ (işığın müəyyən hərflərə sıçraması), qünnə (burun rezonansı), vəqf (harada və necə dayanmaq). Hər birinin aydın tərifi, gündəlik nümunələri və məşq ediləcək bir şey var və bu mərkəz bir-bir onların arasından keçir.",
      "Möhtəşəm bir qayda: təcvidi yalnız kitablardan və ya proqramlardan deyil, ixtisaslı müəllimdən qulaqla öyrənin. Səhvlərinizi eşidən və onları düzəldə bilən birinə oxuyun - təcvid həmişə belə öyrədilir və bu, həqiqi dəqiqliyə və nəhayət, icazə (təsdiqlənmiş qiraət zənciri) aparan yeganə etibarlı yoldur.",
    ],
    hadith: [
      {
        excerpt: "Sizin ən xeyirliniz Qur'anı öyrənən və öyrədəndir.",
      },
      {
        excerpt:
          "Qurana mahir olan, əzəmətli, saleh katiblərlə birlikdədir, onu çətinliklə, kəkələyərək oxuyana isə ikiqat savab verilir.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ərəb hərfləri",
    summary: "İnteraktiv əlifba — ad, səs, 28 hərfin hər biri üçün nümunələr.",
    body: [
      "Ərəb əlifbası sağdan sola yazılan və oxunan 28 hərfdən ibarətdir. İngilis dilindən fərqli olaraq, əksər hərflər yanlarında olanlarla birləşir, buna görə də tək hərf tək və ya sözün əvvəlində, ortasında və ya sonunda yerləşməsindən asılı olaraq bir qədər fərqli forma ala bilər. Eyni hərfi müxtəlif formalarda tapmağı öyrənmək ilk real nailiyyətlərdən biridir.",
      "Qur'an ərəbcəsi əsas hərflərin üzərinə bir neçə əlavə xüsusiyyət əlavə edir: həmzə (qırmızı dayanma), səsi uzadan uzun saitli əlif, vav və ya hərfləri və “əl-” təyin artiklinin “l”-inin tələffüz edilib-edilməməsinə qərar verən günəş və ay hərfi hökmü. Onlarla real sözlərlə tanış olduqdan sonra bunlar sadədir.",
      "Bu bölmədəki hər hərf kartı sizə hərfin təcrid olunmuş formasını, adını, transliterasiyasını, praktik tələffüz ipucunu və real Qur'an nümunələrini verir ki, siz səsi mücərrəd deyil, kontekstdə öyrənəsiniz. Ən təsirli iş rejimi hər hərf üçün dörd addımlı döngədir: ona baxın, oxunduğunu eşidin, özünüz ucadan söyləyin, sonra yazın.",
      "Hər yeni hərfi artıq tanıdığınız sözlərə bağlayın - Allah, Rəbb (Rəbb), ər-Rəhman (Rəhman), Bismillah. Tanımadığı fiqurları tanış məna ilə əlaqələndirmək, onları ayrı-ayrılıqda hərfləri qazmaqdan daha sürətli yapışdırır.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tələffüz",
    summary: "Çətin hərfləri mənimsəyin - ayn, ha, sad, dad, qaf və empatik.",
    body: [
      "Ərəb dilində ingilis dilində heç bir dəqiq ekvivalenti olmayan bir neçə səs var və ana dili olmayanların ən çox sürüşdüyü yer budur. Ən çox rast gəlinən çaşqınlıqlar öyrədilməmiş qulağa bənzəyən, lakin ağızda və ya boğazda müxtəlif yerlərdən tələffüz edilən hərflər arasında olur və onları qarışdırmaq sözün mənasını dəyişə bilər, buna görə də onlar xüsusi təcrübəyə layiqdirlər.",
      'Vurğulayan hərflər - ṣ (ص), ḍ (ض), ṭ (ط) və ẓ (ظ) - yüngül hərflərin "ağır" versiyalarıdır. Onları yaratmaq üçün dilin arxasını qaldırıb ağzınızı daha dolğun, daha dərin bir səslə doldurursunuz, ana dili danışanların uşaqlıqda mənimsədiyi, lakin öyrənənlər şüurlu şəkildə qurmalıdırlar. Hər vurğunu birbaşa onun yüngül qarşılığı ilə müqayisə edin: س ص qarşı, د ض qarşı, ت ط qarşı, ذ ظ qarşı.',
      "Boğaz hərfləri digər böyük maneədir. Ayn (ع) boğazın ortasından gələn səsli daralmadır və ha (ح) güclü, nəfəsli sürtünmədir - ingilis dilində bunların heç biri yoxdur və heç bir yazılı təsvir onları eşitmək üçün tam əvəz etmir. Qaf (ق) dilin ən arxa hissəsindən irəli gələn kafdan (ك) fərqli olaraq dərin “k” hərfidir.",
      "Etibarlı üsul cütləri yan-yana müqayisə etmək, sonra yavaş, aydın bir murattal oxuma ilə özünüzü yoxlamaqdır. Qısa sözü oxuyan öz səsinizi yazın, onu oxuyanla səsləndirin və tənzimləyin. Daha yaxşısı, ixtisaslı müəllimə qulaq asın - bəzi səhvləri öz qeydinizdə tutmaq demək olar ki, mümkün deyil.",
    ],
    appLinks: [{}],
  },
  {
    title: "Qur'an lüğəti",
    summary: "Yüksək tezlikli sözlər — hər oxuyanda daha çox başa düş.",
    body: [
      "Bu, ümidverici bir faktdır: nisbətən kiçik yüksək tezlikli sözlər toplusu – bir neçə yüz nəfər olmaqla – Qur'anın işlək mətninin çox böyük bir hissəsini təşkil edir, çünki eyni açar sözlər təkrar-təkrar təkrarlanır. Bu əsas lüğəti öyrənmək, ata biləcəyiniz yeganə ən yüksək təsirli addımdır, çünki o, oxunuşu səs axınından oxuduqca mənasını tutduğunuz sözlərə çevirir.",
      "Siz Qur'anı sözbəsöz tərcümə etmirsiniz - bu, təfsir və tərcümə işidir - ancaq oxuduğunuz anda Allahın adlarını, əmrlərini, vədlərini və xəbərdarlıqlarını canlı tanımağa başlayırsınız. Ən çox görünən və ən ağır yükü daşıyan sözlərlə başlayın: Allah, Rəbb (Rəbb), rəhmət (rəhmət), iman (iman), səbr (səbir), təqva (Allahı dərk etmək), dünya (dünya) və axirət (axirət). Bu lövbər dəstindən bir az kənara doğru genişləyin.",
      "Use spaced repetition rather than cramming. Həftədə beş yeni söz öyrənmək və onların hamısını gündəlik nəzərdən keçirmək sizi bir oturuşda əlli söz əzbərləməkdən və onları unutmaqdan daha da irəli aparacaq. Allah vəd edir ki, Qur'an qəlbə asanlaşdırılıb – onun lüğətinə davamlı şəkildə yaxınlaşın və siz bu asanlığı birbaşa hiss edəcəksiniz.",
    ],
    quran: [
      {
        excerpt:
          "Həqiqətən, Biz Qur'anı zikr etmək üçün asanlaşdırdıq. Öyüd-nəsihət qəbul edən varmı?",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Təfsir",
    summary: "Vəhyi başa düşmək - icmal, kontekst və tanınmış elmi mənbələr.",
    body: [
      "Təfsir Qur'anın izahı və təfsiri deməkdir - ayənin nə demək olduğunu, nə üçün nazil olduğunu və necə tətbiq olunduğunu aydınlaşdırmaq. Bunlar Allahın kəlamları olduğu üçün alimlər Qur'anın necə izah edilməsinə dair ciddi bir səlahiyyət nizamı qurmuşlar və onun daxilində qalmaq sizi səhvlərdən qoruyar.",
      "Ən sağlam təfsir Qur'anın özünü izah etməsidir: bir yerdə qısa olan ayə çox vaxt başqa yerdə genişlənir, ona görə də Qur'an onun ən yaxşı şərhidir. Sonra sünnə ilə izahat gəlir, çünki Peyğəmbər ﷺ vəhyin aydın olması üçün göndərilmişdir və onun sözləri və əməli bizə onun necə yaşandığını göstərir. Bundan sonra vəhyin şahidi olan və onun məzmununu bilavasitə bilən səhabələrin anlayışı gəlir və onlardan sonra gələn böyük alimlər gəlir. Ən sonuncu və ən aşağısı ərəb dilinin özü tərəfindən təfsirdir. Yeri olmayan şey qeyri-şəxsi fikirdir - mətndə öz fikirlərini oxumaq.",
      "Təfsirdə əsas vasitə vəhy halları olan əsbab əl-nüzuldur: ayəyə səbəb olan hadisəni və ya sualı bilmək çox vaxt onun mənasını açır. Lakin bu hesabatların özləri təsdiqlənməlidir, çünki hər bir rəvayət edilən “vəsaə” etibarlı deyildir. Hər bir surə üçün gözəl təfsir sizə qurulduğu tarixi şəraiti, əsas mövzularını, əsas ayələrini və götürmək üçün praktik dərsləri verir.",
      "Ən tanınmış və etibarlı istinadlar arasında Təfsir İbn Kəsir (hədisləri və ilk nəsillərin kəlamlarını hərtərəfli və diqqətli sitat gətirmək), Təfsir əs-Sədi (aydın, müasir və praktiki rəhbərliyə yönəlmiş) və klassik Təfsir ət-Təbəri (ensiklopedik, ən arli şərhlər) daxildir. Mənanı öyrənəndə onun hansı mənbədən gəldiyini qeyd edin. Bu mərkəz metodologiyanı öyrədir; ayə-ayə araşdırması üçün paketli və uzaq təfsirləri birləşdirən Münibin Qur'an oxucusundan istifadə edin.",
    ],
    sources: [
      "Təfsir İbn Kəsir — qısaldılmış ingiliscə geniş yayılmışdır",
      "Təfsir əs-Sədi — əlçatan xülasələr",
      "Əl-Vahidi tərəfindən Əsbab əl-Nuzul - vəhy halları (hər hadisənin həqiqiliyini yoxlayın)",
    ],
    disclaimer:
      "Təfsir dərinliyi müxtəlifdir. Alimlər ixtilaf etdikdə, Allahın aşkar etmədiyi yerdə yəqinlik iddia etmədən fərqə diqqət yetirin.",
    appLinks: [{}],
  },
  {
    title: "Qur'an mövzuları",
    summary: "İman, dua, səbr, sədəqə, peyğəmbərlər — mövzuya görə qruplaşdırılmış ayələr.",
    body: [
      "Qur'an dərslik kimi düzülməyib, hər fəsildə bir mövzu var. Əvəzində onun böyük mövzuları - Allahın birliyi, namaz, səbir, sədəqə, peyğəmbərlər, axirət, ədalət, ailə - bir çox surələrdə hər dəfə yeni bir rakursdan görünür və yenidən üzə çıxır. Əvvəlcə təkrar kimi görünən şey əslində möhkəmləndirmədir: bir mövzu təqdim olunur, sonra dərinləşdirilir, sonra bütün mesaj bir ardıcıl çağırış kimi dayanana qədər digərinə birləşdirilir.",
      "Qur'anı mövzuya görə öyrənmək o birliyi ortaya qoyur. Qur'anın surələri arasından Allaha təvəkkül, şükür və ya təvəkkül haqqında deyilənləri topladığınız zaman ayrı-ayrı ayələr bir-birini işıqlandırır və dərs canlı və tam olur. Bu mərkəzdəki hər bir mövzu girişi müvafiq ayələri birləşdirir, səhih hədisləri dəstəkləyir, burada aydınlıq, əsas dərslər və konkret hərəkətlər əlavə olunur, beləliklə biliklər nəzəri qalmasın.",
      "Hər şeydən əvvəl mövzuları öz həyatınızla əlaqələndirin. Valideynlərə qarşı mehribanlıq, işdə dürüstlük, evlilikdə ədalətli olmaq, öz maraqlarınıza qarşı belə ədalətin tərəfdarı olmaq - bunlar heyran olunası mücərrəd fəsillər deyil, Qur'anın sizdən vermənizi istədiyi gündəlik qərarlardır. Hər bir mövzunu şəxsən sizə ünvanlanmış bir sual kimi oxuyun: bu, mənim bu gün etdiklərimi necə dəyişir?",
    ],
    appLinks: [{}],
  },
  {
    title: "Quranda hekayələr",
    summary: "Adəmdən Məhəmmədə ﷺ peyğəmbərlər - dərslər, yerlər, əlaqəli ayələr.",
    body: [
      "Qur'an, Adəm, Nuh, İbrahim, Yusif, Musa, İsa və bir çox başqa peyğəmbərlərin hekayətlərindən bəhs edir və bunun səbəbini bizə açıq şəkildə bildirir: “Onların hekayətlərində ağıl sahibləri üçün ibrət vardır”. Bu hesablar folklor və ya əyləncə deyil. Onlar iman, səbr və hər dövrdə təkrarlanan eyni sınaqlarla necə qarşılaşmağı öyrətmək üçün Allah tərəfindən seçilmiş və deyilmiş təlimatlardır.",
      "Onların arasından keçən nümunəyə diqqət yetirin. Peyğəmbərlər qövmlərini yalnız Allaha ibadət etməyə çağırırdılar; onlara istehza edilir, qarşı çıxır və tez-tez qovulurdular; Onlar səbirlə və Allaha təvəkkül edərək səbir etdilər; Nəhayət, Allahın vədi gerçək oldu. Onların çətinliklərini oxuduqda, onların necə cavab verdiyindən güc alın - heç vaxt dərəcənizin onlara bərabər olduğunu təsəvvür etmədən. Məsələ statusu müqayisə etmək deyil, onların möhkəmliyini və etibarını mənimsəməkdir.",
      "Qur'anın özündə bir rəvayət xüsusi qeyd olunur: Allah onu “hekayənin ən yaxşısı” adlandırdığı “Yusif” surəsi. Qeyri-adi şəkildə başdan-ayağa tək bir surədə deyilir, ona görə də onu davamlı bir səfər kimi bir oturuşda oxuyun - xəyanət, köləlik və zindanda səbr, nəhayət, bağışlanma və qovuşma - və Allahın planının illər ərzində görünən bədbəxtliyin ardınca necə baş verdiyinə baxın.",
    ],
    quran: [
      {
        excerpt: "Onların hekayətlərində, şübhəsiz ki, ağıl sahibləri üçün bir ibrət vardır...",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Qur'an möcüzələri",
    summary: "Dil təqlidi, qorunma, peyğəmbərliklər - elmi ehtiyatla.",
    body: [
      "Qur'anın mərkəzi möcüzəsi Qur'anın özüdür. Ərəb poeziyasının ən bəlağətli çağında savadsız bir insana nazil olan bu kitab, ən şiddətli müxaliflərinə - dil ustalarına belə bir surə belə gətirmək üçün açıq çağırış etdi. On dörd əsr sonra bu çağırış qarşıya qoyulmur. Onun ritorik qüdrəti, quruluşu, mövzularının bir-birinə bağlı olması, hidayət və qanunun uyğunluğu klassik bəlağət elmində (ilm əl-bəlağə) öyrənilir və Qur'anın öz iddiası ilə misilsiz olaraq qalır.",
      "Onun qorunub saxlanması ikinci, yoxlanıla bilən əlamətdir. Mətn həm yazılı şəkildə, həm diqqətlə ötürülən əlyazmalar vasitəsilə, həm də şifahi şəkildə, qiraət vasitəsilə qorunmuşdur - qırılmayan qiraət zəncirləri onu dəqiqliklə əzbərləyən və nəsildən-nəslə öyrədir. Bu, təqvalı fərziyyə deyil, sənədləşdirilmiş bir tarixdir və Allahın öyüd-nəsihəti qorumaq vədini yerinə yetirir.",
      'Siz həmçinin "elmi möcüzələr" haqqında - embrionun mərhələlərinə toxunan ayələr, kosmosun genişlənməsi və s. Bunları ehtiyatla idarə edin. Klassik təfsir çox vaxt bu cür ayələri müasir apoloqlardan tamamilə fərqli şəkildə başa düşürdü və Qur\'anın hər dəyişən elmi fərziyyə ilə uyğunlaşmasına məcbur edilməsi nəzəriyyələr dəyişdikdə əks nəticə verə bilər. Təsdiq edilmiş təfsir ilə müasir fərziyyəni qəti şəkildə fərqləndirin.',
      "Tarixi peyğəmbərliklər də alimlər tərəfindən - romalıların qabaqcadan söylənilən qələbəsi, Məkkənin sülh yolu ilə açılması - sitat gətirilir və onlar öyrənməyə dəyər, lakin sensasiyalı video kliplər deyil, ayıq təfsir və sirə vasitəsilə. Qur'an üçün ən güclü dəlil həmişə onun tövhidi, bir qövmün əxlaqi dəyişməsi, misilsiz dili və qorunub saxlanması olmuşdur.",
    ],
    quran: [
      {
        excerpt: "Əgər doğru deyirsinizsə, ona bənzər bir surə gətirin.",
      },
    ],
    disclaimer:
      "Nəzərdən keçirildikdə davatı utandıran hədsiz elmi möcüzə iddialarından çəkinin. Tövhid, əxlaq və Qur'anın dil və tarixi dəlilləri ilə rəhbərlik et.",
  },
  {
    title: "Əzbərləmə (Hifz)",
    summary: "Juz Amma-dan tam hifzə qədər planlar — təftiş, audio, gündəlik hədəflər.",
    body: [
      "Qur'anı əzbərləmək (hifz) möminin həyatında ən şərəfli işlərdən biridir və bu, nə alimlərə, nə də uşaqlara aid deyil - böyüklər də onu tamamlayır. Həzrət Peyğəmbər (s) öyrədir ki, Qiyamət günü Qur'anı daşıyana “Oxu ​​və yüksəl!” deyiləcək, hər ayə ilə dərəcə yüksələcək. Hər kəsin başladığı yerdən başlayın: onsuz da hər namazda oxuduğunuz Fatihə surəsi, sonra mus'hafın ən sonundakı qısa surələr, geriyə doğru işləyir.",
      "Hifzdə ən vacib dərs əks-intuitivdir: təftiş (muraca'ah) yeni material əlavə etməkdən daha vacibdir. Peyğəmbər (sallallahu aleyhi və səlləm) xəbərdar etdi ki, əzbərlənmiş Qur'an, bağlanmış dəvənin qopmasından daha tez sürüşür - onu təhrif etmədən buraxın və o, yoxa çıxıb. Beləliklə, qayda sadə və sərtdir: artıq saxladığınız şeyi qəti şəkildə nəzərdən keçirməyincə heç vaxt yeni bir hissə əlavə etməyin. Bir az əzbərləmiş möhkəm döyür, çox əzbərlədi.",
      "Praktiki üsul: aralıq təkrarlardan istifadə edin, tək oxuyandan yapışın ki, melodiya özü yaddaşınıza işarə etsin, yalnız oxumaq əvəzinə hər gün yaddaşdan oxuyun və müəllimə qulaq assın və səhvlərinizi qeyd edin - özünüz eşitmədiyiniz səhvlər. Munib-in hifz izləyicisi fərdi ayələrə qədər irəliləyiş qeyd edir ki, siz həmişə yenidən nəzərdən keçirilməsinin nə lazım olduğunu bilirsiniz.",
      "Səhnənizə uyğun bir plan seçin. Başlanğıc: Cüz Amma, qısa surələrlə dolu sonuncu hissəni əzbərləyin. Ara: əl-Mülk, Ya-Sin və əl-Kəhf kimi tez-tez oxunan on surə əlavə edin. Qabaqcıl: özündən əvvəlki hər şeyə güclü yenidən baxaraq tam cüz tamamlayın. Və Hafiz səyahəti: ixtisaslı bir müəllimin əzbərlədiyi bütün mus'haf və ideal olaraq bir sanad - Peyğəmbərə (sallallahu aleyhi və səlləm) qaytarılması təsdiqlənmiş bir zəncir.",
    ],
    hadith: [
      {
        excerpt:
          "Qur'an səhabəsinə deyiləcək: Dünyada oxuduğun kimi oxu və yüksəl, çünki sənin dərəcən oxuduğun son ayədə olacaqdır.",
      },
      {
        excerpt:
          "Qur'an əhlinin məsəli, bağlanmış dəvə sahibinin məsəlidir: ona qulluq etsə onu saxlayar, buraxsa da itirər.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Gündəlik dərslər",
    summary: "Bir ayə, kontekst, düşüncə və hərəkət - hər gün.",
    body: [
      "Qurana ömürlük bağlılıq, hər hansı bir dərin vərdiş necə qurulursa, elə qurulur - azacıq, hər gün. Peyğəmbər (sallallahu aleyhi və səlləm) öyrətdi ki, Allah yanında ən sevimli əməllər kiçik də olsa, ardıcıl olaraq görülən əməllərdir və bu prinsip gündəlik dərsin arxasında duran bütün fikirdir. Hər biri sizə ərəb dilində bir ayə, onun tərcüməsi, tarixi kontekstinə dair qeyd, oturub düşünmək üçün bir sual və gününüzdə yerinə yetirmək üçün bir konkret hərəkət verir.",
      "Bu ayələri oxumaqdan ötrü deyil, canlı rəhbərlik kimi qəbul edin. Ürəyinizə toxunanları əlfəcin edin, onlara qayıdın və sizi ruhlandıranları ailənizlə bölüşün - başqası sizin ötürdüyünüz yaxşılığa görə hərəkət edəndə, onun mükafatı sizə də çatır, buna görə də öyrətməyin faydası çoxalır.",
      "Kiçik ölçüsün sizi aldatmasına imkan verməyin. Ardıcıllıq hər dəfə intensivliyi döyür: hər gün Quranla beş səmimi dəqiqə sizi ayda bir dəfə keçirilən nadir, qəhrəmanlıq saatından daha çox dəyişdirəcək. Gündəlik göstərin və günlərin yığılmasına icazə verin.",
    ],
    appLinks: [{}],
  },
  {
    title: "Refleksiya (Tədəbbur)",
    summary: "Rəhbər suallar - Allah nə öyrədir və siz bunu necə yaşayacaqsınız?",
    body: [
      "Tədəbbur Qur'anı dərindən düşünmək, bir ayəni səni dəyişməyə sövq edənə qədər qəlbində çevirmək deməkdir. Bu, isteğe bağlı deyil, birbaşa əmrdir: Allah: “Məgər onlar Qur'an haqqında düşünmürlər, yoxsa onların qəlblərində qıfıllar var?” deyə soruşur. Oxumağın məqsədi heç vaxt sadəcə səs deyildi - qəlbə çatmaq və həyatı yenidən formalaşdırmaq idi.",
      "Tədəbbur təfsirlə eyni deyil. Təfsir bir ayənin nə demək olduğunun elmi izahıdır; tadabbur, onu başa düşdükdən sonra bu mənaya şəxsi, hörmətli cavabınızdır. İkisi birlikdə işləyir: əvvəlcə təfsirdən səs mənasını öyrənirsən, sonra onunla oturub səninlə necə danışdığını soruşursan. Faydalı çərçivə üç sualdır - Allah burada mənə nə öyrədir? Bu, bu gün etdiklərimi necə dəyişir? Buna görə hansı vərdişi qurmalı və ya pozmalıyam?",
      "Bir möhkəm sərhəd tadabburu təhlükəsiz saxlayır: bir ayənin sizdən nə tələb etdiyini düşünün, lakin mətnin özü üçün heç vaxt yeni mənalar icad etməyin. Həqiqi təfsir təfsir hüdudlarını təyin etsin və şəxsi düşüncələrinizi öz yerində saxlayın - Münibin jurnalı kimi şəxsi jurnal bir ayənin sizdə nə hiss etdiyini çəkmək və sonra ona qayıtmaq üçün idealdır.",
    ],
    quran: [
      {
        excerpt: "Məgər onlar Qur'an haqqında düşünmürlər, yoxsa onların qəlblərində qıfıllar var?",
      },
      {
        excerpt:
          "Məgər onlar Qur'an haqqında düşünmürlərmi? Əgər o, Allahdan qeyrisi tərəfindən olsaydı, onda çoxlu ziddiyyət tapardılar.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qur'anı tətbiq edin",
    summary: "Bir ayədən bu günün problemi - izi tamamlamaq, ayəni yaşamaq.",
    body: [
      "Qur'an elminin əmələ çevrilməsi nəzərdə tutulur. Allah bizdən əvvəl Kitab oxuyan, lakin ona qarşı olanları sərt şəkildə tənqid etdi: “Siz kitab oxuduğunuz halda başqalarına yaxşılıq etməyi əmr edib özünüzü unudursunuz?”. Qur'an səninlə Rəbbin arasında bağlanmış əhddir və hər ayə sakitcə səndən bir şey soruşur - sual budur ki, cavab verəsənmi?",
      "Bu çağırışlar bunun üçündür. Hər biri müəyyən bir ayəni bu gün üçün yerinə yetirilə bilən tək bir davranışla əlaqələndirir: xoş sözlə dilini qorumaq, sakit sədəqə vermək, haramdan nəzər salmaq, kin-küdurəti buraxmaq. Bir ayə, bir hərəkət - həqiqətən etmək üçün kifayət qədər kiçik, sizi dəyişdirəcək qədər real.",
      "Problemi yalnız həqiqətən yerinə yetirdiyiniz zaman tamamlandığını qeyd edin. İzləmənin məqsədi nümayiş etdirmək deyil - bu, məqsədi məğlub edəcək - başqalarının görmədiyini görən Allah qarşısında vicdanla cavab verməkdir. Zaman keçdikcə ayə beyt, qiraət belə xarakterə çevrilir.",
    ],
    quran: [
      {
        excerpt: "Siz kitab oxuyarkən başqalarına yaxşılıq etməyi əmr edib, özünüzü unudursunuz?",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Qur'an viktorina",
    summary: "Surə adlarını, quruluşunu, təcvidini, lüğətini və hekayələrini nəzərdən keçirin.",
    body: [
      "Özünüzü sınamaq biliyin möhkəmlənməsinin ən təsirli yollarından biridir – cavabı xatırlamaq yaddaşı sadəcə təkrar oxumaqdan daha çox gücləndirir. Bu viktorina mərkəzdəki hər şeyə əsaslanır: surələrin və cüzlərin sayı, ilk vəhy və Qur'anın necə qorunub saxlanması, mədd və kəlqələ kimi təcvid qaydaları, yüksək tezlikli lüğət və Qur'anın hekayətlərini izah edən peyğəmbərlər.",
      "Niyyəti düz tutun. Xal yalnız öyrənməyiniz üçün bir güzgüdür - heç vaxt yalnız Ona məxsus olan Allah yanında dərəcənizin ölçüsü deyil. Zəif nöqtəni üzə çıxarmaq üçün hər sualdan istifadə edin, sonra uyğun dərsə qayıdın və nömrəni təqib etmək əvəzinə məhz həmin mövzunu öyrənin.",
      "Yekun sual qiymətli sual deyil, düşüncədir: növbəti başa düşmək və əzbərləmək üçün bir surə və ya keçid seçin ki, baxışınız həmişə sizi Kitabın özünə yönəltməklə başa çatsın.",
    ],
    appLinks: [{}],
  },
  {
    title: "İstinadlar və mənbələr",
    summary: "Qur'an, hədis, təfsir və elmi ixtilafları necə sitat gətiririk.",
    body: [
      "Sağlam İslami öyrənmə şəffaf dəlillər üzərində qurulub, buna görə də bu mərkəzdəki hər dərs öz işini göstərmək məqsədi daşıyır. Quranla bağlı iddia, surə: ayə; Sünnədən bir iddiada məcmuənin adları (Buxari, Müslim, Tirmizi və s.), hədisin nömrəsi və dərəcəsi (səhih, həsən və ya daha zəif); ayənin mənası ilə bağlı iddia onun gəldiyi təfsirə ad verir; və alimlərin həqiqətən ixtilaf etdiyi yerdə, fərq gizli deyil, qeyd olunur.",
      "Müəyyən olanı şərh edəndən ayırmaq da vacibdir. Müəyyən edilmiş faktlar - beş vaxt namaz, Qur'anın mühafizəsi, sirin əsas hadisələri açıq şəkildə ifadə edilmişdir. Esxatologiyanın incə təfərrüatları və ya elmi eyhamların oxunması kimi səmimi alimlərin çoxdan fikir ayrılığına düşdüyü məsələlər qərarlı əminlik kimi deyil, şərh kimi təqdim olunur. Güvən dəlilin gücünə uyğun olmalıdır.",
      "Daha dərindən öyrənmək üçün müəyyən edilmiş istinadlara istinad edin: etibarlı Qur'an tərcümələri (məsələn, Səhih İnternational və ya Pickthall), əsas hədis topluları (Səhih əl-Buxari və Səhih Müslim ilk növbədə), mötəbər təfsir (İbn Kəsir və əs-Sədi) və etibarlı sirə (İbn Hişamın klassiki və ər-Rax, Net-Rahee, ar-Ther'Mahee). müasir hekayə).",
      "Nəhayət, bir tətbiqin məhdudiyyətlərini bilin. Munib sizi maarifləndirir və mənbələrə işarə edir, ancaq dini hökmlər vermir. Qiraət fiqhi, təcvid icazəsi və ya ibadət və ya həyat qərarlarınıza təsir edən hər hansı bir sual üçün öz məktəbinizdə və bölgənizdə ixtisaslı bir alimlə məsləhətləşin.",
    ],
    sources: [
      "Qur'an — Kral Fəhd Kompleksi çap / doğrulanmış rəqəmsal mushaf",
      "Hədis — sunnah.com qiymətləndirmə çarpaz istinad",
      "Təfsir İbn Kəsir (qısaldılmış Darüssəlam)",
      "Təfsir əs-Sədi (ingiliscə)",
    ],
    disclaimer:
      "Munib açıq təhsil məzmununu birləşdirir. Məzhəbinizdə və bölgənizdə ixtisaslı alimlərlə kritik məsələləri yoxlayın.",
  },
];

export const QURAN_GUIDE_STRUCTURE_LEVELS_AZ: DeepPartial<QuranGuideStructureLevel>[] = [
  {
    count: "1 kitab",
    detail:
      "Bir kitab — kəlam Allah, Allahın hərfi nitqi, Cəbrayıl mələyi vasitəsilə, aydın ərəbcə, təqribən 23 il ərzində tədricən Məhəmmədə nazil olmuşdur. Dünyanın hər yerində eyni tək mətndir.",
  },
  {
    count: "114",
    detail:
      "Qur'an cəmi üç ayədən 286-ya qədər olan 114 surəyə bölünür. Hər birinin bir adı var, adətən içindəki açar sözdən götürülür və Məkki və ya Mədəni olaraq təsnif edilir. Onların mushəfdəki sırası vəhy (təvqifi) ilə sabit olmuşdur və nazil qaydasından fərqlidir.",
  },
  {
    count: "30",
    detail:
      "Oxumağı idarə etmək üçün nəzərdə tutulmuş otuz təxminən bərabər hissə. Gündə bir cüz oxumaq bütün Qur'anı bir ayda tamamlayır - Ramazanda bir xətimi bitirməyin klassik üsulu.",
  },
  {
    count: "60",
    detail:
      "Hər cüz iki hizbə bölünür, cəmi 60 hizbə, hər hizb isə daha sonra məhəlləyə bölünür. Bu kiçik vahidlər sizə gündəlik zərif bir hissə - yarım və ya dörddə bir hizb təyin etməyə və sabit bir vərdiş saxlamağa imkan verir.",
  },
  {
    count: "6,236",
    detail:
      "Ayrı-ayrı ayələr, beləliklə nömrələnmişdir ki, hər hansı bir keçid dəqiq surə: ayə kimi göstərilə bilər. 6,236 standart Mədinə sayıdır; digər tarixi sayma üsulları yalnız bir neçə ayə sərhədinin necə işarələnməsi ilə fərqlənir - sözlərin özləri eynidir.",
  },
  {
    count: "2 dövr",
    detail:
      "Hər surə iki vəhy dövründən birinə aiddir. Məkki (hicrətdən əvvəl) surələri çox vaxt daha qısadır və iman, tövhid və axirətə diqqət yetirir. Mədəni (hicrətdən sonra) surələri çox vaxt daha uzun olur və onlara qanun və icma hidayəti əlavə edir. Bir neçə surədə hər ikisindən ayələr var.",
  },
  {
    count: "Çox",
    detail:
      "Qur'an mövzu-mövzu təşkil etməkdənsə, təkrarlanan mövzular ətrafında toxunmuşdur. Tövhid, namaz, peyğəmbərlərin əhvalatları, ailə, sədəqə, səbr və axirət Kitabda bir çox surələrdə bir-birini gücləndirərək yayılır.",
  },
];

export const QURAN_GUIDE_TIMELINE_AZ: DeepPartial<QuranGuideTimelineEvent>[] = [
  {
    title: "Vəhydən əvvəl həyat",
    body: "Peyğəmbərlikdən əvvəlki illərdə Muhəmməd s. Ətrafındakı dünya bütlərə sitayiş etsə də, o, heç vaxt ibadət etmədi və xalqı ona o qədər etibar etdi ki, peyğəmbər olduğunu iddia etməmişdən çox əvvəl ona əl-Əmin - etibarlı - dedilər.",
    location: "Məkkə",
  },
  {
    title: "Hira mağarası",
    body: "Ramazan ayında, qırx yaşına yaxın olanda Cəbrayıl mələk mağarada onun yanına bircə əmrlə gəldi: “Oxu!”. Oxumağı və yazmağı bilməyən Peyğəmbər (s) cavab verdi ki, bacarmıram. Mələk onu üç dəfə möhkəm qucaqladı və sonra “Ələq” surəsinin ilk kəlmələrini çatdırdı – “Yaradan Rəbbinin adı ilə oxu”. Sarsılmış halda evə tələsik arvadı Xədicənin yanına getdi və o, onu paltara büküb arxayın etdi.",
    location: "Cəbəl ən-Nur, Məkkə",
  },
  {
    title: "İlk nazil olan “Ələq” surəsi",
    body: "Oxu əmri peyğəmbərliyin və Qur'anın enişinin başlanğıcı idi. Xədicə onu öz alim qohumu Varaqə ibn Nəvfəlin yanına apardı. O, mələyin Musaya gələn eyni elçi olduğunu tanıdı və Peyğəmbərin (s) qövmünün onu qovacağını xəbər verdi. Ondan sonra gələn ilk Məkkə ayələri Allahın birliyinə, axirətin qətiliyinə və əxlaqi islahat üçün geniş çağırışa diqqət yetirirdi.",
  },
  {
    title: "Erkən Məkkə dövrü",
    body: "İlk illərdə zəng özəl, sonra ictimai idi. Böyüdükcə Qüreyş təqiblərə - möminlər arasında zəif və kölələrə işgəncə verməklə məşğul oldu və nəticədə Peyğəmbərin (s) qəbiləsinə, Bəni Haşimə qarşı üç illik sərt boykot tətbiq etdi. Qəddarlıqdan xilas olmaq üçün bir qrup müsəlman Həbəşistana köç etdi və burada ədalətli xristian padşah onlara sığındı. Bu dövrün surələri adətən qısa, güclü, ritmik ayələrlə danışır.",
    location: "Məkkə",
  },
  {
    title: "Mədinəyə hicrət",
    body: "İllərcə davam edən təqiblərdən və həm Xədicəni, həm də əmisi Əbu Talibi itirdiyi “qəm ilindən” sonra Peyğəmbər (s) və onun səhabələri Mədinəyə hicrət etdilər. Bu hicrət o qədər mühüm idi ki, sonralar İslam təqviminin başlanğıcı oldu. Mədinədə müsəlmanlar artıq ovlanmış azlıq deyil, cəmiyyət Qur'an bir cəmiyyət idilər və vəhy artıq qanun, ailə, iqtisadiyyat və Əhli-Kitab ilə əlaqələrə toxunmağa başladı.",
    location: "Mədinə",
  },
  {
    title: "Mədinə dövrü",
    body: "Mədinə surələri, ümumiyyətlə, daha uzun və təfərrüatlıdır, məskunlaşmış bir cəmiyyətin ehtiyac duyduğu qanunları müəyyən edir: namaz, zəkat, oruc, nikah və boşanma, miras, müqavilələr və müqavilələrin xüsusiyyətləri. Bu dövrdə həm də böyük döyüşlər - Bədr, Uhud və Konfederasiyalar - oldu və Qur'an möminlərin sınaqlarına və münafiqlərin hiylələrinə aydınlıq gətirdi.",
    location: "Mədinə",
  },
  {
    title: "Əlvida Həcc ziyarəti",
    body: "Həzrət Peyğəmbər (s) hicrətin onuncu ilində yeganə həccini yerinə yetirdi və Ərəfatda böyük bir məclis qarşısında vida xütbəsini söylədi, can və malın müqəddəsliyini, qadınların hüquqlarını, irqindən asılı olmayaraq bütün insanların bərabərliyini, Qur'an və Sünnədən möhkəm yapışmağın vəzifəsini ümmətə xatırlatdı. Məhz burada: “Bu gün dininizi sizin üçün kamil etdim” ayəsi nazil oldu.",
    location: "Ərəfat / Mina",
  },
  {
    title: "Əbu Bəkrin yanında tərtib",
    body: "Peyğəmbərin (sallallahu aleyhi və səlləm) vəfatından az sonra Yəmamə döyüşündə Qur'anı tam əzbər bilən bir çox səhabə şəhid oldu. Huffazın itirilməsindən qorxan Ömər xəlifə Əbu Bəkrə Qur'anı bir yerə toplamağa çağırdı. Əbu Bəkr, səhabələrin xatirələri ilə təsdiqlənmiş yazılı vəhyi diqqətlə toplayan etibarlı katib Zeyd ibn Sabiti bir vərəqdə (suhuf) təyin etdi.",
  },
  {
    title: "Standartlaşdırılmış mushaf — Osman",
    body: "İslam bir çox ölkələrə yayıldıqca yeni müsəlmanlar arasında qiraət fərqləri mübahisələrə səbəb olmağa başladı. Ümməti bir yazılı mətn üzərində birləşdirmək üçün xəlifə Osmanın Qüreyş ləhcəsində Əbu Bəkrin suhufundan mötəbər nüsxələri var idi və digər şəxsi nüsxələrin kənara qoyulmasını xahiş edərək onları böyük şəhərlərə göndərdi. Bu Uthmanic mushaf o vaxtdan bəri bütün müsəlman dünyasının əməl etdiyi standartdır.",
  },
  {
    title: "Bu günə qədər qorunma",
    body: "On dörd əsrdir ki, Qur'an dəyişməz olaraq qalır və bir-birinə bağlı üç vasitə ilə qorunur: hər nəsildə kütləvi hifz (hifz), sadiq yazılı ötürmə və Peyğəmbərə (sallallahu aleyhi və səlləm) çatan qırılmayan müəllimdən şagirdə qiraət zəncirləri. Bu, Allahın: “Həqiqətən, Zikri Biz nazil etdik və biz onu qoruyub saxlayacağıq” vədini yerinə yetirir.",
  },
];

export const QURAN_GUIDE_STORIES_AZ: DeepPartial<QuranGuideStory>[] = [
  {
    prophetName: "Adəm",
    title: "Adəm — bəşəriyyətin ilk peyğəmbəri və atası",
    summary: "Yaradılışı, mələklərin səcdəsi, ağacın imtahanı, tövbəsi qəbul.",
    body: [
      "Allah ilk insan olan Adəmi öz əlləri ilə palçıqdan yaratdı, ona öz ruhundan üfürdü və ona heç bir məxluqatın qəbul etmədiyi bir hədiyyə verdi: Adəmə hər şeyin adlarını öyrətdi. Allah bu biliyi nümayiş etdirəndə mələklər öz hüdudlarını qəbul etdilər və Adəmin izzəti bəlli oldu – biliyin özü bəşəriyyəti fərqləndirən şeylərin bir hissəsi idi.",
      "Sonra Allah mələklərə Adəmə səcdə etməyi əmr etdi və cinlərdən olan İblisdən başqa hamı itaət etdi. O, təkəbbür üzündən imtina edərək özünün oddan, Adəmin isə gildən olduğunu iddia edərək, özünü üstün hesab etdi. Bu qürur, cəhalət yox, onun süqutu idi və Adəmin nəslini yoldan çıxaracağını and içdi.",
      "Adəm və həyat yoldaşı Həvva Cənnətə yerləşdirildi və dedilər ki, onlar hər şeydən sərbəst həzz ala bilərlər, ancaq bir ağaca yaxınlaşmamalıdırlar. Şeytan onlardan yeyənə qədər israrla onlara pıçıldadı. Onların çılpaqlığı dərhal onlara göründü və səhvlərini hiss etdilər. Onlar ümidsizlik və üzr istəməkdənsə, Allaha təvazökarlıqla: “Ey Rəbbimiz, biz özümüzə zülm etdik. Əgər bizi bağışlamasan və bizə rəhm etməsən, şübhəsiz ki, ziyana uğrayanlardan olarıq” dedilər.",
      "Allah onların tövbələrini qəbul etdi və onları ixtiyari bir cəza olaraq deyil, bəşəri imtahanın başlanğıcı olaraq, hidayət vədi ilə birlikdə yerə endirdi: “Hər kim Mənim hidayətimə tabe olsa, nə azğınlığa, nə də bədbəxtliyə düçar olmaz”. Beləliklə, Adəm hekayəsi hər bir insanın hekayəsidir: şərəflə yaradılmış, sınanmış, səhv etməyə qadir və həmişə geri dönə biləndir.",
    ],
    lessons: [
      "Tövbə qapısı hər zaman açıqdır — Adəmin üzrsüz və gecikmədən edilən tövbəsi hər bir günahkar üçün nümunədir.",
      "Təkəbbür xarabalığın köküdür: İblis həqiqəti bilsə də, təkəbbürlə ondan imtina etdi və göstərdi ki, təvazökarlıq olmayan bilik məhv edər.",
      "Şeytanın üsulu zorla deyil, davamlı pıçıldamaqdır - onun təkliflərini tanımaq onlara müqavimət göstərməyin yarısıdır.",
      "İnsani dəyər günahsız olmaq deyil, bilik və Allaha üz tutmaqla bağlıdır - bizi müəyyən edən səhvə cavabdır.",
    ],
    quran: [
      {
        excerpt: "Adəmin yaradılması və mələklərin səcdəsi.",
      },
      {
        excerpt: "Sınaq, yıxılma və tövbə.",
      },
    ],
    location: "Cənnət, sonra yer",
  },
  {
    prophetName: "Nuh",
    title: "Nuh - əsrlər boyu rədd edilən səbr",
    summary: "İlahi hökm olaraq 950 illik da'vat, gəmi və tufan.",
    body: [
      "Nuh bütpərəstliyə düçar olmuş bir qövmə göndərildi və o, onları heyrətamiz bir müddət tək Allaha ibadət etməyə çağırdı - Quranda onun onlardan min əlli il az qaldığı bildirilir. Onları gecə-gündüz, açıq-aşkar və gizlicə çağırır, onlara hər cür səbəb təklif edirdi: bağışlanma, yağış, var-dövlət, övlad və bağça. Bununla belə, nəsildən-nəslə üz çevirdi, Onu ələ saldı və qulaqlarını kəsdi.",
      "Daha heç kəsin iman etməyəcəyi aydın olduqda, Allah Nuha gəmini tikməyi əmr etdi, qövmü onu dənizdən uzaqda böyük bir gəmi tikdiyi üçün məsxərəyə qoydu, lakin o cavab verdi ki, bir gün anlayacaqlar. İşarə təndirdən su çıxanda gəldi; Nuh möminlərin bir neçəsini və hər növ heyvandan cüt-cüt gəmiyə mindi.",
      "Tufan qalxıb inkar edənləri boğdu. Hekayənin ən dəhşətli anlarından birində Nuhun öz oğlu gəmiyə minməkdən imtina edərək, sudan xilas olmaq üçün dağa dırmaşacağını israr etdi və o, boğulanlar arasında idi - atanın kədəri oğlunun inamsızlığını üstələyə bilməzdi. Nuh onun üçün yalvaranda Allah öyrətdi ki, oğlanın zülmü onların arasında iman bağını kəsdi.",
      'Əmr gələndə sular çəkildi və gəmi Cudi dağında dayandı. Allahın möminləri necə xilas etdiyini və səbrin nəhayət doğrulduğunu düşünən hər kəs üçün Qur\'an bütün hesabı bir "ibrət" olaraq qoruyub saxlayır.',
    ],
    lessons: [
      "Uzun və çətin bir missiya az sayda davamçı ilə uğursuzluq deyil - Nuh əsrlər boyu təbliğ etdi və onun sayı deyil, səmimiliyi Allahı razı saldı.",
      "İmansız insanı heç bir ailə bağı xilas edə bilməz: Nuhun öz oğlu suda boğularaq hidayətin irsi olmadığını sübut edir.",
      "Davamlı istehzaya qarşı belə Allahı çağırmaqda inadkar olmaq özü də bir ibadətdir.",
      "Allahın nicatı təyin olunmuş vaxtda gəlir - mömin vədə güvənərək, tufandan əvvəl itaət gəmisi qurur.",
    ],
    quran: [
      {
        excerpt: "Nuhun hekayəsi ətraflı.",
      },
      {
        excerpt: "Nuhun öz qövmünə yalvarışı.",
      },
    ],
    location: "Qədim Mesopotamiya (elmi hesablamalar)",
  },
  {
    prophetName: "İbrahim",
    title: "İbrahim - Allahın dostu (Xəlilullah)",
    summary: "Bütləri sındırıb, od sərinləşdirib, İsmayılı qurban verib, Kəbəni tikib.",
    body: [
      "İbrahim hələ gənc ikən qövmünün və öz atasının həkk edib ibadət etdiyi bütləri rədd edərək tövhidə getdi. O, onlarla mübahisə etdi, sonra hərəkət etdi: onlar bayramda olarkən, ən böyüyü istisna olmaqla, bütün bütlərini sındırdı və izahat tələb etdikdə, onlara ibadət etdiklərinin acizliyini ortaya qoyaraq, böyük bütdən soruşmağı söylədi. Onlar qəzəblənərək böyük bir atəş yandırdılar və onu içəri atdılar, lakin Allah: “Ey atəş, İbrahimə sərinlik və əmin-amanlıq ver” buyurdu və o, sağ-salamat çıxıb getdi.",
      "İbrahim Allahın əmri ilə arvadı Həcəri və körpə oğlu İsmayılı Məkkənin qısır vadisində qoyub getdi. Onların suyu bitdikdə Həcər çarəsizlik içində Səfa və Mərvə təpələri arasında qaçaraq kömək axtardı - Müsəlmanlar Həcc sa'isində yenidən axtarış apardılar - körpənin ayaqları altında Zəmzəm bulağı çıxana qədər. İllər sonra İbrahim yuxuda sevimli oğlunu qurban verəcəyini gördü. Ata və oğul Allahın iradəsinə təslim oldular; İbrahim bunu həyata keçirməyə hazırlaşarkən, Allah İsmayıla hər il Qurban bayramında xatırlanan möhtəşəm bir qoçla fidyə verdi.",
      "İbrahim və böyüyən İsmayıl birlikdə Məkkədə Kəbənin bünövrəsini ucaltdılar və tikərkən belə dua etdilər: “Ey Rəbbimiz, bunu bizdən qəbul et”. İbrahim də onların nəslindən bir elçi yetişdirilməsi üçün dua etdi - bu dua əsrlər sonra Məhəmməd Peyğəmbərdə cavab verdi. Əbədi sədaqətinə görə Allah İbrahimə bənzərsiz bir ləqəb verdi: Allahın yaxın dostu Xəlilullah.",
    ],
    lessons: [
      "Tövhid, bütpərəstliyin məşhur, irsi norma və ona qarşı durmaq təhlükəli olduğu halda belə, batil bağlılığın qırılmasını tələb edir.",
      "Allaha tam təvəkkül Onun əmri ən ağır olanda daha parlaq olur - İbrahim oğlunu belə qurban verməyə təslim oldu və Allah imtahanı rəhmətlə əvəz etdi.",
      "Allaha təvəkkül passivlik demək deyil: Həcər qaçıb axtardı, Zəmzəm gəldi - səy və təvəkkül bir yerdə.",
      "Sədaqətin səmimi əməlləri nəsillər boyu əks-səda verir; Həcc mərasimləri və Kəbənin şərəfi İbrahimin itaətindən qaynaqlanır.",
    ],
    quran: [
      {
        excerpt: "İbrahim, İsmayıl və qurban.",
      },
      {
        excerpt: "Əhd və miras.",
      },
    ],
    location: "İraq, Levant, Məkkə",
  },
  {
    prophetName: "Yusif",
    title: "Yusif - səbr gözəlliyi (sabr jameel)",
    summary: "Xəyanət, köləlik, həbsxana, hakimiyyətə yüksəlmək - hər sınaqda güvən.",
    body: [
      "Yusif uşaq ikən yuxuda on bir ulduzun, günəşin və ayın ona səcdə etdiyini görür, bu da böyük gələcəyin əlamətidir. Özü də peyğəmbər olan atası Yaqub ona dedi ki, bunu paxıl qardaşlarından gizlətsin. Paxıllıqları onlara qalib gəldi: Yusifi quyunun dibinə atdılar və atalarına dedilər ki, canavar onu yeyib. Yoldan keçən bir karvan uşağı tapıb Misirdə satdı.",
      "Bir zadəgan evində o, heyrətamiz gözəllik və düzgünlük sahibi bir insana çevrildi. Əsilzadənin arvadı onu yoldan çıxarmaq istədikdə, Yusif “Allaha sığınıram” deyərək imtina etdi və onu hədələyəndə günahdansa zindanı seçdi. Günahsız olsa da, illərlə həbs edildi. Orada məhbus yoldaşlarını tövhidə dəvət etdi və Allahın izni ilə onların yuxularını yozdu.",
      "Yeddi arıq inək tərəfindən yeyilən yeddi kök inək yuxusu padşahı narahat edəndə, Yusif bunu yeddi bolluq ili, yeddi qıtlıq kimi yozdu və taxıl saxlamağı tövsiyə etdi. Nəhayət, müdrikliyi və etibarlılığı ilə tanınan o, Misirin anbarlarına məsul təyin edildi.",
      "Aclıq nəhayət, qardaşlarını Misirə yemək axtarmağa sövq etdi, onlardan əvvəlki güclü naziri tanımırdı. Onları sınadıqdan sonra Yusif özünü göstərdi və intiqam almaq əvəzinə onları tamamilə bağışladı: “Bu gün sizə heç bir günah yoxdur. Allah səni bağışlasın”. Ailə yenidən qovuşdu, valideynləri şərəfləndi və uşaqlıq arzusu gerçəkləşdi.",
    ],
    lessons: [
      "Səbr camil - gözəl səbir - insanlara acımadan, şikayət etmədən çətinliklərə dözmək, Yaqub kimi dərdini yalnız Allaha çəkmək deməkdir.",
      "İffət nəyin bahasına olursa olsun, Yusif zindanı günahdan üstün tutdu, Allah da buna görə onun dərəcəsini yüksəltdi.",
      "Allahın planı tez-tez görünən bədbəxtlik illərinin arxasında gizlənir - quyu, köləlik və həbsxana Yusifin şərəfinə doğru addımlar idi.",
      "Güclülər öz gücünü bağışlamaqla göstərirlər: Yusif gücü çatanda ona zülm edənləri əfv etdi.",
    ],
    quran: [
      {
        excerpt: "Hekayələrin ən yaxşısı bir surədə deyilmişdir.",
      },
    ],
    location: "Kənan, Misir",
  },
  {
    prophetName: "Musa",
    title: "Musa – Allahla danışdı və Fironla üz-üzə gəldi",
    summary: "Yanan kol, Firon, Çıxış, Tövrat və sərgərdan xalqa qarşı əlamətlər.",
    body: [
      'Musa, anası onu Fironun İsrail oğullarını qırmasından xilas etmək üçün onu çaya qoyduqdan sonra, Allahın planı ilə Fironun öz sarayında böyüdü. Gənc ikən bir qətldən sonra Misirdən qaçdı və illər sonra səhradan qayıdarkən Tur dağında yanğın gördü. Orada Allah onunla birbaşa danışdı - Musaya Allahla danışan Kəlimullah ləqəbini qazandıran bir şərəf - "Həqiqətən, mən sənin Rəbbinəm" dedi. O, qardaşı Harunla birlikdə zalım Fironun hüzuruna: “İsrail oğullarını buraxın” tələbi ilə geri göndərildi.',
      "Firon allah olduğunu iddia etdi və bundan imtina etdi. Allah Musaya açıq-aydın dəlillər verdi - onun əsası canlı ilana çevrildi və əli ağappaq parıldadı. Firon onu gözdən salmaq üçün ən bacarıqlı sehrbazlarını çağırdı, lakin Musanın əsaları onların illüziyalarını udduqda, sehrbazlar əsl həqiqəti sadəcə hiylədən tanıdılar və səcdəyə qapandılar və Musanın və Harunun Rəbbinə iman gətirdiklərini bəyan etdilər - Firon onları ölümlə hədələdi. Bir-birinin ardınca bəlalar gəldi, lakin Firon yalnız sərtləşdi.",
      "Nəhayət, Allah Musaya öz qövmünü gecə vaxtı çıxartmağı əmr etdi. Firon onları dənizə qədər təqib etdi. Musa onu əsası ilə vurdu və su ayrıldı və möminləri qurudan keçib getdi. Firon və qoşunu arxasınca gələndə dəniz onların üzərini bağladı və onlar boğuldular. Sonra Musa Tövratı aldı, lakin Bəni-İsrail inadkar oldu - onun yoxluğunda qızıl buzova sitayiş etdi və vəd edilmiş torpağa daxil olmaqdan imtina etdi - və nəticədə qırx il dolaşdı.",
    ],
    lessons: [
      "Tamamilə Allaha təvəkkül edərək zalımlığa doğru danışın - Musa yalnız imanla silahlanmış dövrünün ən güclü adamı ilə qarşılaşdı.",
      "Səmimi möminlər belə tərəddüd edə bilərlər: Musaya qarşı çıxan sehrbazlar, bir anlıq aydınlıqda, möcüzələr görmüş bütün bir xalqdan daha möhkəm oldular.",
      "Möcüzələrə şahid olmaq öz-özünə iman gətirmir - hidayət Allahın inadkar deyil, təvazökar qəlbə verdiyi bir hədiyyədir.",
      "Allah məzlumları xilas edər, təkəbbürlü görünsələr də, haqq-hesab çəkər.",
    ],
    quran: [
      {
        excerpt: "Musa Turda və Firondan əvvəl.",
      },
      {
        excerpt: "Doğum və tərbiyə.",
      },
    ],
    location: "Misir, Sinay",
  },
  {
    prophetName: "İsa",
    title: "İsa ibn Məryəm - Allahdan gələn söz və ruh",
    summary:
      "Möcüzəvi doğuş, əlamətlər, Allaha qaldırıldı - Qurana görə öldürülməz və çarmıxa çəkilməz.",
    body: [
      "Allahın öz dövrünün qadınlarının ən yaxşısı olaraq seçdiyi iffətli və dindar qadın Məryəm ailəsindən ayrılaraq şərqdə bir yerə getdi. Orada Cəbrail mələk ona kişi surətində göründü və ona heç kim toxunmasa da, Allahın ona pak bir övlad verəcəyini bildirdi. O, Allahın “Ol” sözü ilə hamilə qaldı və İsa da yaradıldı – Qur'an onun yaradılışını atasız yaradılmış Adəmin yaratdığı ilə müqayisə edərək, Allahın istədiyi kimi yaratdığını göstərir.",
      'Körpəni götürüb qayıdanda adamları onu ittiham etdilər. Onu müdafiə edən körpə İsa beşikdən danışaraq özünü Kitab verilmiş Allahın qulu elan etdi və peyğəmbər etdi - anasının şərəfini bir möcüzə ilə təmizlədi. İsaya Bəni-İsrail peyğəmbəri olaraq Allahın izni ilə açıq-aydın dəlillər verildi: o, korları və cüzamlıları sağaltdı, ölüləri diriltdi və palçıqdan uçan bir quş yaratdı - hər zaman bunların "Allahın izni ilə" olduğunu, heç vaxt öz gücü ilə olmadığını vurğuladı.',
      "Qur'an açıq şəkildə bildirir ki, İsa nə öldürülüb, nə də çarmıxa çəkilib; əksinə, düşmənlərinə belə göstərildi və Allah onu Öz hüzuruna yüksəltdi. Əsas sünni inancı onun qiyamət günündən əvvəl qayıdacağına inanır. Ən əsası, Qur'an israr edir ki, İsa bəşər peyğəmbəri və Allahın qulu idi, ilahi deyil və Allahın oğlu deyildi - bu mesajı onun özü beşikdən sona qədər elan etdi.",
    ],
    lessons: [
      "Allah istədiyi kimi yaradır — İsanın atasız doğulması, Adəmin torpaqdan yaradılması kimi Onun qüdrətinin heç bir dünyəvi səbəbə bağlı olmadığını göstərir.",
      "İsanın göstərdiyi hər bir möcüzə açıq-aşkar “Allahın izni ilə” idi, peyğəmbərlərin Allahın qüdrətini yönləndirdiyini, ona malik olmadıqlarını öyrədir.",
      "Peyğəmbərlər Allahın möhtərəm bəşər bəndələridir, heç vaxt ibadət olunmazlar – Qur'an İsanın həqiqi məqamını mübaliğədən qoruyur.",
      "Məryəmin iffəti, səbri və etibarı onu bütün mömin qadınlar və kişilər üçün iman nümunəsi edir.",
    ],
    quran: [
      {
        excerpt: "Doğum və beşik nitqi.",
      },
      {
        excerpt: "Öldürülməmiş və çarmıxa çəkilməmişdir; qaldırdı.",
      },
    ],
    location: "Fələstin",
  },
  {
    prophetName: "Məhəmməd s",
    title: "Muhəmməd - peyğəmbərlərin möhürü",
    summary: "Son messencer; 23 il ərzində nazil olan Qur'an; aləmlərə rəhmət.",
    body: [
      "Muhəmməd 570-ci ildə Məkkədə Qureyş qəbiləsində anadan olmuşdur. Yetim qalan gənc - atası doğulmamışdan əvvəl, anası isə altı yaşında vəfat etdi - o, əvvəlcə babası, sonra əmisi Əbu Talib tərəfindən böyüdü. Peyğəmbərlikdən çox-çox əvvəl o, dürüstlüyünə o qədər etibar edilmişdi ki, qövmü ona əl-Əmin, “etibarlı” deyirdi. Qırx yaşında ikən Hira mağarasında düşünərkən Cəbrail mələk vasitəsilə Qur'anın ilk vəhyini alır.",
      "On üç il Məkkədə insanları tək Allaha ibadət etməyə çağırdı və şiddətli təqiblərlə üzləşdi: istehza, ardıcılları arasında zəiflərə işgəncə və qəbiləsinin sosial və iqtisadi boykot edilməsi. Bir “kədər ilində” o, həm sevimli arvadı Xədicəni, həm də himayədarı Əbu Talibi itirdi və yaxınlıqdakı Taifdə dəstək axtararkən onu qovdular və daş-qalaq etdilər, lakin o, onların məhv edilməsindən daha çox hidayət üçün dua etdi.",
      'Mədinəyə hicrət etdikdən sonra bir icma qurdu və ona Bədr, Uhud və Müttəfiqlərin sınaqlarından keçdi. Nəhayət, böyük bir güclə Məkkəni fəth etmək üçün qayıdanda, ona işgəncə verən və qovub çıxaranlardan qisas almadı; onları bağışladı və dedi: “Gedin, siz azadsınız”. Qur\'an onun missiyasını tək bir cümlə ilə - "aləmlərə rəhmət" ifadəsi ilə yekunlaşdırır və onun vəzifəsinin heç kəsi iman gətirməyə məcbur etmək deyil, açıq şəkildə çatdırmaq olduğunu açıqlayır.',
    ],
    lessons: [
      "İnsanın sahib ola biləcəyi ən gözəl xasiyyət Peyğəmbərin (s) xasiyyətidir - onun sifətini yaxından öyrənin və onu gündəlik həyatda təcəssüm etdirməyə çalışın.",
      "Mərhəmət və bağışlamaq gücdür, zəiflik deyil: qüdrətinin zirvəsində o, ən qatı düşmənlərini əfv etdi.",
      "Allaha dəvət edən şəxs risaləti səmimiyyət və səbirlə çatdırar, amma nəticəsini Allaha buraxar, hidayət Onundur.",
      "Sınaqlar peyğəmbərlərin yoludur; Onun etdiyi kimi, Allah rizası üçün çətinliklərə dözmək həqiqi imanın nişanəsidir.",
    ],
    quran: [
      {
        excerpt: "Biz səni aləmlərə ancaq bir rəhmət olaraq göndərdik.",
      },
      {
        excerpt: "Öz aralarında mərhəmətlidir, kafirlərə qarşı möhkəmdir.",
      },
    ],
    appLinks: [{}],
  },
];

export const QURAN_GUIDE_THEMES_AZ: DeepPartial<QuranGuideTheme>[] = [
  {
    title: "İman (İman)",
    summary: "Allaha, mələklərinə, kitablarına, elçilərinə, axirət gününə və ilahi hökmə iman.",
    lessons: [
      "İman Qur'anın bir yerdə topladığı altı maddəyə əsaslanır: Allaha, Onun mələklərinə, nazil etdiyi kitablara, elçilərinə, axirət gününə və ilahi hökmə - onun xeyirinə və şərinə iman.",
      "İman sabit, birdəfəlik təsdiq deyil. Əsas sünni inancında o, itaət və zikrlə artır və günah və qəflətlə azalır, buna görə də iman sizin fəal şəkildə inkişaf etdirdiyiniz bir şeydir.",
      "Həzrət Peyğəmbər (s) imanın yetmişdən çox şöbəsi olduğunu, ən böyüyü - Allahdan başqa ilah olmadığına şəhadət etməkdən tutmuş, yoldan zərərin aradan qaldırılmasına qədər kiçik yaxşılıqların belə imanın bir parçası olduğunu göstərmişdir.",
      "Həqiqi iman dildən əvvəl qəlb işidir: Allahı həqiqətən tanımaq, Onu hər şeydən çox sevmək, Onun qəzəbindən qorxmaq və bütünlüklə Ona təvəkkül etməkdir.",
    ],
    quran: [
      {
        excerpt: "Peyğəmbər Rəbbindən ona nazil edilənə iman gətirdi, möminlər də...",
      },
    ],
    hadith: [
      {
        excerpt:
          "İmanın yetmişdən çox budağı var; Ən üstünü “Allahdan başqa ilah yoxdur” demək, ən aşağısı isə yoldan zərərli bir şeyi çıxarmaqdır – həya isə imanın bir qoludur.",
      },
    ],
    actions: [
      "Bu gün şəhadətinizi adi bir ifadə kimi deyil, nə demək olduğuna tam diqqət yetirərək yeniləyin.",
      "Allahın adlarından birini öyrənin, anlayın və dualarınızda onunla dua edin.",
    ],
  },
  {
    title: "Namaz (Namaz)",
    summary: "Qiyamət günü haqqında soruşulan ilk əməl – qulu Rəbbə bağlayan sütundur.",
    lessons: [
      "Namaz İslamın ikinci sütunudur və bəndənin Qiyamət günü sorğu-sual ediləcəyi ilk əməldir – əgər səhihdirsə, qalan kitablar ona əməl etməyə meyllidir.",
      "Qur'an buyurur ki, qəlbin hüzuru ilə qılınan namaz insanı əxlaqsızlıqdan və pis işlərdən çəkindirir; bu, sadəcə bir ritual deyil, ruhun gündə beş dəfə təkrarlanan bərpasıdır.",
      "Yer üzündə nazil olan digər vacibatlardan fərqli olaraq, namaz Peyğəmbərin (s) merac zamanı (əl-İsra vəl-Merac) ümmətə vacib edilmiş, onu xüsusi bir hədiyyə və möminin Allaha yüksəliş vasitəsi kimi qeyd etmişdir.",
      "Gündə beş dəfə təkrar olunduğu üçün namaz bir ibadətlə digər ibadət arasında imanı canlı tutan sabit bir ritmdir.",
    ],
    quran: [
      {
        excerpt:
          "Həqiqətən, namaz əxlaqsızlıqdan və pis əməllərdən çəkindirir və Allahı zikr etmək daha böyükdür.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qiyamət günü bəndənin ilk mühakimə olunacaq əməli onun namazı olacaq; sağlamdırsa, uğur qazanmışdır, qüsurludursa, uğursuz və uduzmuşdur.",
      },
    ],
    actions: [
      "Bu gün Fatihənin sözlərini oxuduqca anlayaraq, yavaş-yavaş bir namaz qılın.",
      "Namazınızın bir hissəsini gücləndirmək üçün Munib-in Namazı Öyrənmə təlimatını açın.",
    ],
  },
  {
    title: "Valideynlər",
    summary:
      "Valideynlərə yaxşılıq Allaha ibadətlə qoşalaşır - şirkdən sonra onlara nankorluqdan çəkindirilir.",
    lessons: [
      "Allah eyni ayədə ata-anaya olan mərhəməti birbaşa Öz ibadətinə qovuşdurur ki, bu da onların İslamda haqqının nə qədər böyük olduğuna işarədir.",
      "Qur'an ən kiçik qıcıq əlamətini belə qadağan edir: onlara “uf” demək, sərt söz demək deyil, onlara yumşaq, şərəfli sözlərlə müraciət etmək.",
      "Əmr qocalıqda zirvəyə çatır, o zaman ki, valideynlərin səbrə ən çox ehtiyacı var: bir vaxtlar sənə qayğı göstərdikləri kimi onlara da qayğı göstər və mərhəmət olaraq onlara təvazökarlıq qanadını aşağı sal.",
      "Sədaqət ölümlə bitmir - valideynlər üçün dua etməyə davam etmək, onların adından sədəqə vermək, dostlarına və vədlərinə əməl etmək davamlı sədaqət əməlləridir.",
    ],
    quran: [
      {
        excerpt: "Rəbbin Özündən başqasına ibadət etməməyi və ata-anaya yaxşılıq etməyi buyurdu...",
      },
    ],
    actions: [
      "Bu gün valideynə zəng edin və ya mesaj göndərin.",
      "Valideynləriniz üçün adından dua edin.",
    ],
  },
  {
    title: "Səbr (Sabr)",
    summary: "İtaətdə sabitlik, günahdan çəkinmək və imtahanları qəbul etmək.",
    lessons: [
      "Alimlər səbri üç cür təsvir edirlər: Allaha itaətdə səbir, günahdan uzaq durmaqda səbir və fitnə baş verən zaman Onun hökmünü qəbul etməkdə səbir.",
      "Səbr passiv ümidsizlik və ya ayrı-ayrılıqda dişlərinizi sıxmaq deyil - Qur'an kömək mənbəyi olaraq onu dua ilə birləşdirdiyi üçün səbr aktivdir və sizi uzaqlaşdırmağa deyil, Allaha tərəf yönəldir.",
      "Allah Özünü “səbir edənlərlə” elan edir və səbr edənlərə onların mükafatlarını saysız-hesabsız vəd edir.",
      "Peyğəmbərlər insanların ən şiddətli sınağı idilər və Qur'an onların səbrini - xəstəlikdə Əyyub, qəmdə Yaqub, xəyanət və zindanda Yusif - nümunə kimi göstərir.",
    ],
    quran: [
      {
        excerpt:
          "Ey iman gətirənlər, səbir və namazla kömək diləyin. Həqiqətən, Allah səbir edənlərlədir.",
      },
    ],
    actions: [
      "Bu gün qıcıqlanma artdıqda, reaksiya verməzdən əvvəl fasilə verin, nəfəs alın və “İnnə lillahi və inna ilayhi raciun” deyin.",
      "Bu həftənin bir çətin anını şikayət əvəzinə iki rükət namaza çevirin.",
    ],
  },
  {
    title: "Xeyriyyə (Sədəqə və Zəkat)",
    summary: "Var-dövləti təmizləmək və ehtiyacı olanlara yemək vermək həqiqi imanın əlamətidir.",
    lessons: [
      "Zəkat - mal-dövlətin illik təmizləyici sədəqəsi - İslamın üçüncü sütunu və vacibatdır, sədəqə isə yuxarı həddi olmayan və sonsuz formaları olmayan könüllü verməkdir.",
      "Quranda Allah rizası üçün xərclənən sərvətin itirilməyəcəyi, əksinə çoxalacağı vəd edilir: yeddi sünbül yetişdirən, hər birində yüz dənə olan bir toxum kimi, Allah dilədiyini artırar.",
      "Xeyriyyəçilik təkcə pul deyil. Peyğəmbər (sallallahu aleyhi və səlləm) öyrətdi ki, hətta qardaşınla gülər üzlə görüşmək belə sədəqədir, ona görə də kimsə vermək üçün çox kasıb deyil.",
      "Vermək həm var-dövləti, həm də verəni pak edər, tamahın torunu gevşetir və şəfqət yaradır – buna görə də zəkat sözünün özü paklıq və böyümə deməkdir.",
    ],
    quran: [
      {
        excerpt: "Allah yolunda xərcləyənlərin misalı yeddi sünbül verən taxıl kimidir...",
      },
    ],
    actions: [
      "Bu gün bir şey verin - pul, vaxt və ya həqiqətən xoş söz - kiçik və görünməmiş olsa belə.",
      "Münibdə zəkat öhdəliklərinizi nəzərdən keçirin və növbəti ödənişin nə vaxt olacağını qeyd edin.",
    ],
  },
  {
    title: "Tövbə (tövbə)",
    summary: "Allah tövbə edənləri sevər - ruh boğaza çatana qədər qapı açıqdır.",
    lessons: [
      "Səmimi tövbənin aydın şərtləri var: günaha görə səmimi peşmançılıq, onu dərhal dayandırmaq və bir daha geri qayıtmamaq qərarına gəlmək - və əgər günah başqasına zülm etmişsə, onun da haqqını bərpa etmək.",
      "Allah sadəcə olaraq tövbəyə icazə verməz. O, Ona dönənləri sevər, ona görə də bir az sonra geri qayıtmaq Onun üçün sevimlidir, sizin əleyhinizə bir işarə deyil.",
      "Rəhmət qapısı heyrətamiz dərəcədə genişdir: Allah özlərinə böyük zülm edənlərə belə, ümidsiz olmamalarını bildirir, çünki səmimi qəlbdən tövbə edənin bütün günahlarını bağışlayar.",
      "Tövbə böyük günahlar və ya dramatik anlar üçün nəzərdə tutulmur - gün boyu istiğfar (bağışlanma diləmək) qəlbi yumşaq və hesabı təmiz tutar.",
    ],
    quran: [
      {
        excerpt:
          "De: “Ey Mənim özlərinə zülm edən qullarım, Allahın rəhmətindən ümidinizi kəsməyin...",
      },
    ],
    actions: [
      "Bu gün 100 dəfə “Əstəğfirullah” deyin, bu mənada yükü qaldırın.",
      "Allahın razı olmadığını bildiyiniz bir vərdişi adlandırın və onu tərk etmək üçün ilk konkret addımı atın.",
    ],
  },
  {
    title: "Cənnət (Cənnət)",
    summary:
      "Müttəqin üçün hazırlanmış əbədi mükafat - canlı, həvəsləndirici təfərrüatlarla təsvir edilmişdir.",
    lessons: [
      "Qur'an möminin ona can atması və səy göstərməsi üçün Cənnəti canlı, motivasiya edən təfərrüatlarla - altından çaylar axan cənnətlər, əbədi rahatlıq və əməlisalehlərə qovuşmaq üçün təsvir edir.",
      "Cənnətə daxil olmaq yalnız əməllə deyil, Allahın rəhməti ilədir; iman və səmimi səy vəsilədir, lakin Onun lütfü olmadan heç kəsin işləri əbədi mükafat qazana bilməz.",
      "Qur'an möminləri yarışmağa və bağışlanmağa və “genişliyi göylər və yer qədər olan” Cənnətə doğru tələsməyə çağırır.",
      "Ən böyük mükafat bağlar və çaylar deyil, Allahın Üzünü görməkdir – Cənnət əhlinə vəd edilən ən böyük sevincdir.",
    ],
    quran: [
      {
        excerpt:
          "Rəbbiniz tərəfindən bağışlanmağa və genişliyi göylər və yer qədər olan Cənnətə tələsin...",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Cəhənnəm atəşi (Cəhannam)",
    summary: "Əsl xəbərdarlıq - möminləri ümidsizliyə salmaq deyil, diqqəti oyatmaq üçün.",
    lessons: [
      "Cəhənnəm məcaz deyil, həqiqi bir xəbərdarlıqdır - Qur'an bunu açıq şəkildə təsvir edir ki, insanlar təhlükəni ciddi qəbul etsinlər və hələ də bacardıqları halda kursu dəyişsinlər.",
      "Cəhənnəm qorxusu Allahın rəhmətinə ümidlə yanaşı işləmək üçündür: mömin xavf (qorxu) ilə raca (ümid) arasında gəzir, buna görə də nə ümidsizlik, nə də yalançı təhlükəsizlik öz üzərinə götürür.",
      "Qur'anın bağışlanmaz kimi qeyd etdiyi bir günah, əgər onun üstündə ölərsə, şirkdir - Allaha şərik qoşmaq; Bundan başqa hər şeyi istədiyi şəxs üçün bağışlayar.",
      "Allah insanları Öz hüzuruna qaytarmaq, tövbə edəni əzməmək üçün xəbərdar edir - Quranda hər bir xəbərdarlıq açıq-aydın bir dönüş dəvəti ilə birləşdirilir.",
    ],
    quran: [
      {
        excerpt:
          "Həqiqətən, Allah Özünə şərik qoşmağı bağışlamaz, lakin ondan daha az günahı istədiyi kimsə üçün bağışlayar.",
      },
    ],
    actions: [
      "Bu gün hər namazdan sonra səmimi qəlbdən Allahdan səni Cəhənnəmdən qorumasını dilə.",
      "Tövhidinizi təzələyin: Cəhənnəmdən ən etibarlı qorunma olan tək Allaha ibadət etmək barədə düşün.",
    ],
  },
  {
    title: "Ədalət",
    summary: "Özünüzə və yaxınlarınıza qarşı belə ədalət üçün möhkəm durun.",
    lessons: [
      "Quranda ədalət barışmazdır: həqiqət sənin, valideynlərin və ya ən yaxın qohumların əleyhinə olsa belə, onun üçün möhkəm dayan.",
      "Allah buyurur ki, bir qövmə qarşı kin-küdurət sizi haqsızlığa sövq etməsin. Bu, təqvaya daha yaxındır' - düşmənlərə belə ədalət borcludur.",
      "Zülm (zülm) şiddətlə xəbərdarlıq edilir; Peyğəmbər (Allahın ona salavat və salamı olsun) Qiyamət günü zülmün zalımın üzərinə zülmət kimi görünəcəyini öyrədir.",
      "Ədalət təkcə hakimlər və hökmdarlar üçün deyil, o, dürüst sözlə, ədalətli rəftarla, sözünü tutmaqla və hər kəsə öz haqqını verməklə yaşayır.",
    ],
    quran: [
      {
        excerpt:
          "Özünüzün, ata-ananızın və qohumlarınızın əleyhinə olsa belə, ədalətli olun, Allah üçün şahid olun.",
      },
    ],
    actions: [
      "Bu gün kiməsə haqqını verin - ədalətli əmək haqqı, dürüst cavab və ya onlara borclu olduğunuz kredit.",
      "Qərəzliyin sizi ədalətsizliyə sövq etdiyi bir anı tutun və bunun əvəzinə ədaləti seçin.",
    ],
  },
  {
    title: "Bilik",
    summary: "Oxu, düşün və de: “Ey Rəbbim, elmimi artır!”",
    lessons: [
      "Quranda nazil edilən ilk kəlmə “Oxu” idi – İslam dini ayinlə deyil, həm ağılın savadını, həm də qəlbin elmini şərəfləndirən öyrənmək əmri ilə açılmışdır.",
      "Allah hətta Peyğəmbərinə (sallallahu aleyhi və səlləm) daha çox istəməsini buyurmuşdur: “Rəbbim, mənim elmimi artır!” – Qur'anın ona artırmağı əmr etdiyi yeganə şey budur.",
      "Faydalı biliklərə əməl etmək və ötürmək nəzərdə tutulur; Peyğəmbər (sallallahu aleyhi və səlləm) alimlərin peyğəmbərlərin varisləri olduqlarını, var-dövlət deyil, elm irsi olduğunu öyrətdi.",
      'Müqəddəs elm axtarmağın özü ibadətdir və Qur\'an bilənlərlə bilməyənlər arasında aydın şəkildə fərqləndirilir - "onlar bərabərdirmi?"',
    ],
    quran: [
      {
        excerpt: "Və de: “Ey Rəbbim, elmimi artır.",
      },
    ],
    actions: [
      "Bu gün Qurandan yeni bir şey öyrənin - ayə, söz və ya hökm - və onu kiməsə öyrədin.",
      '"Rabbi zidni ilma" duasını əzbərləyin və öyrənmədən əvvəl deyin.',
    ],
  },
  {
    title: "Peyğəmbərlər",
    summary: "Rəhbərlik, sınaq və ilahi dəstək hekayələri - əyləncə deyil, təlimat.",
    lessons: [
      "Qur'an öyrədir ki, heç bir ümmət hidayətsiz qalmamışdır: “Elə bir ümmət yoxdur ki, onların arasından qorxudan bir peyğəmbər olmasın” – hər yerə eyni tövhid xəbəri göndərilirdi.",
      "Bütün peyğəmbərlər bir əsas çağırış gətirmişlər – yalnız Allaha ibadət edin – və onların hekayətləri tarix kimi deyil, “ağıl sahibləri” üçün ibrət kimi danışılır.",
      "Muhəmməd (s) peyğəmbərlərin möhürüdür, sonuncu elçidir və müsəlman özündən əvvəlki bütün peyğəmbərlərə - Nuh, İbrahim, Musa, İsa və digərləri arasında fərq qoymadan iman etməlidir.",
      "Peyğəmbərlər insan və Allahın qulları idilər, ilahi deyillər; Qur'an onlara hörmət edir, lakin onları məxluqatın tərəfində möhkəm saxlayır, heç vaxt Yaradanla yanaşı ibadət etmir.",
    ],
    quran: [
      {
        excerpt: "Onların hekayətlərində ağıl sahibləri üçün ibrət vardır...",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Qadınlar",
    summary: "Hüquqlar, ləyaqət və mənəvi bərabərlik — Məryəm qadınların ən yaxşılarındandır.",
    lessons: [
      "Qur'an kişi və qadının Allah qarşısında mənəvi bərabərliyini öyrədir: “Mömin kişilərlə mömin qadınlara” eyni iman, eyni əməl və eyni mükafat vəd edilmişdir.",
      "Qadınlar və kişilər bir-birinin imanda şəriki və himayədarı kimi təsvir edilir, mülk kimi deyil – dördüncü surə, ən-Nisa (“Qadınlar”) özünü əsasən onların hüquqlarını, ləyaqətini, irsini və rəftarını qorumağa həsr edir.",
      "Qur'an İsanın anası Məryəmi bütün möminlər üçün örnək kimi göstərir və analara o qədər hörmət edir ki, məşhur təlim Cənnəti onların ayaqları altına qoyur.",
      "Hər iki cins Nisa surəsinin ilk ayəsindən ortaq insanlıq və ləyaqət bərqərar edən vahid mənşəyə - “bir nəfsdən yaratmışdır”a gedib çıxır.",
    ],
    quran: [
      {
        excerpt: "Sizi bir nəfsdən xəlq edən və ondan zövcəsini yaradan Rəbbinizdən qorxun...",
      },
    ],
    actions: [
      "Bu gün həyatınızdakı bir qadına - anaya, həyat yoldaşına, bacısına və ya qızına borclu olduğu xüsusi hüquq və ya xeyirxahlıqla hörmət edin.",
    ],
  },
  {
    title: "Uşaqlar",
    summary: "Əmanət (əmanə) - tövhid və xeyirxahlıq üzərində yüksəlmək.",
    lessons: [
      "Övladlar bir əmanətdir – Allahdan bir əmanətdir və Qur'an onların tərbiyəsini valideynlərə həvalə edir: “Özünüzü və ailənizi oddan qoruyun” onlara tövhidi və gözəl əxlaqı öyrətməklə başlayır.",
      "Peyğəmbər (s) Qur'anı öyrətməyi və öyrənməyi ən gözəl əməllərdən saymışdır, ona görə də övladın azacıq da olsa oxumağa sövq etməsi, savabı ata-anaya dönən davamlı bir xeyir bəxş edər.",
      "Çox vaxt təkrarlanan valideynlik müdrikliyi uşaqları onların mərhələsində görüşməyi məsləhət görür - ilk illərdə onlarla oynamaq, sonra onları öyrətmək və yumşaq bir şəkildə tərbiyə etmək, sonra yetkinləşdikcə onlarla dostluq etmək.",
      "Saleh bir övlad böyütmək bu həyatdan kənar bir sərmayədir: valideyn üçün dua edən saleh nəsil öldükdən sonra da onlara fayda verməyə davam edir.",
    ],
    quran: [
      {
        excerpt: "Ey iman gətirənlər, özünüzü və ailənizi oddan qoruyun...",
      },
    ],
    actions: [
      "Bu gün uşağa səbirlə və həvəslə bir qısa ayə və ya bircə yaxşı davranış öyrədin.",
      "Övladlarınıza (yaxud himayənizdəki övladlarınıza) adları ilə dua edin ki, Allah dərgahında düzgün və sevimli olsunlar.",
    ],
  },
];

export const QURAN_GUIDE_TAJWEED_AZ: DeepPartial<QuranGuideTajweedLesson>[] = [
  {
    title: "Günorta Səkinə və Tanvin",
    summary: "Sükun və tənvinlə ن qaydaları — izhar, idğam, iqləb, ixfa.",
    explanation: [
      "Günorta sakinisi sukun (saitsiz) daşıyan ن hərfidir; tanween sözün sonunda günorta ilə eyni səslənən qoşa sait sonluğudur (an, in, un). Hər ikisi eyni dörd qaydaya əməl edir, tamamilə sonrakı məktubla qərar verilir.",
      "İzhar (aydın tələffüz): altı boğaz hərfindən (ء ه ع ح غ خ) ardınca gələndə günortanı burun qarışığı olmadan aydın və aydın tələffüz edin.",
      "İdğam (birləşmə): 'yarmaloon' (ي ر م ل و ن) sözünün hərflərindən əvvəl günorta növbəti hərfdə birləşir — ي ن م و üçün qunnə (burun səsi) ilə, ل ر üçün isə qunnasız.",
      "İqlab (çevirmə): ب-dən sonra günorta qünnə ilə müşayiət olunan gizli mim səsinə çevrilir.",
      'İxfa (gizlənmək): qalan on beş hərfdən əvvəl zöhr nə tam tələffüz olunur, nə də tam birləşir - dil növbəti hərf üçün hazırlaşarkən yüngül burun qünnəsi ilə "gizlənir".',
    ],
    practice:
      "Fatihə surəsini yavaş-yavaş oxuyun və hər gün günorta sakina və ya tənvinlə rastlaşdığınız zaman dörd qaydadan hansının və nə üçün uyğun olduğunu adlandırmaq üçün fasilə verin.",
  },
  {
    title: "Mim Səkinə",
    summary: "İxfaa şəfavi, idğam şəfavi və sukun ilə م üçün izhar şəfavi.",
    explanation: [
      "Mim sakinah sukun daşıyan م hərfidir. Onun üç qaydası var ki, onların hər biri “şəfavi” (labial) adlanır, çünki mim dodaqlarla əmələ gəlir və hansının tətbiq olunması yalnız aşağıdakı hərfdən asılıdır.",
      "İdğam şəfavi (labial birləşmə): bir mim sakinahdan sonra başqa bir mim gələndə, ikisi qünnə ilə keçirilən bir vurğulanmış mimə birləşir.",
      "İxfa şəfavi (dodaq gizlədilməsi): ب hərfindən sonra mim yüngül şəkildə gizlənir - dodaqlar yaxınlaşır, lakin tam basmır - qünnə ilə müşayiət olunur.",
      "İzhar şəfavi (labial aydınlıq): hər hərfdən əvvəl mim aydın şəkildə tələffüz olunur. و və ف hərflərindən əvvəl xüsusi diqqət yetirin, burada öyrənənlər onu tutqunlaşdırmaq istəyirlər.",
    ],
    practice:
      "Juz Amma-dan bir neçə qısa surə oxuyun və sözü oxumazdan əvvəl onun qaydasını adlandıraraq hər bir mim sakinini qeyd edin.",
  },
  {
    title: "Madd (Uzunma)",
    summary: "Saitlərin təbii, ikinci dərəcəli və zəruri uzanması.",
    explanation: [
      "Mədd sait səsinin uzanması deməkdir və bu, üç mədd hərfində - əlif (ا), waw (و) və ya (ي) - özlərində heç bir sait daşımayan və uyğun olan qısa saiti izlədikdə baş verir.",
      "Madd əsli (təbii mədd) təqribən iki saydan ibarət əsas uzanmadır, ondan sonra heç bir xüsusi səbəb olmadan dəli hərf göründüyü yerdə mövcuddur. Hər oxuyan onu bərabər tutur.",
      "Madd far'i (ikinci dərəcəli mədd) aşağıdakı həmzə və ya sukun tərəfindən tetiklenir və daha uzun tutulur - adətən dörd və ya altı say. Dəqiq uzunluq mədd növündən və əməl etdiyiniz qiraətdən (rivayətə) asılıdır.",
      "Çünki sözün sonunda dayanmaq sukun yarada bilər, həm də bir dəliliyi uzata bilər – təxmin etməkdənsə, müddətləri ixtisaslı müəllimdən qulaqla öyrənmək üçün daha bir səbəb.",
    ],
    practice:
      "Tanış qısa surə seçin və vaxtınızı bərabər saxlayaraq, hər təbii maddada '1-2' və ikinci dərəcəli məddlərdə isə '1-2-3-4' sayın.",
  },
  {
    title: "Ghunnah",
    summary: "İdğam və ixfada günorta və mimi müşayiət edən burun səsi.",
    explanation: [
      "Ghunnah burun vasitəsilə yaranan burun rezonansıdır, günorta (ن) və meem (م) hərflərinin xas keyfiyyətidir. Standart qiraətdə o, təxminən iki say üçün keçirilir.",
      "Bu, artıq tanış olduğunuz bir neçə qaydada tələb olunur və ən çox tələffüz olunur: qünnə ilə idğam, ixfa, iqlab və günorta və ya miim şəddə daşıdıqda.",
      "Səs hamar və idarə olunmalıdır - bu, mahnı oxumaq və ya zümzümə etmək deyil, düzgün uzunluqda ölçülən sabit burun tonudur.",
      "Sadə bir test: gunnah hərfi yazarkən burnunuzu yüngülcə çimdikləyin; səs bloklanırsa, rezonans həqiqətən lazım olduğu kimi burundan keçir.",
    ],
    practice:
      "Günorta və ya mimdə qünnəni iki dəfə tutaraq şəddə ilə bir kəlmə oxuyun, sonra özünüzü qeyd edin və ixtisaslı qiraətçi ilə müqayisə edin.",
  },
  {
    title: "Qalqalah",
    summary: "Sakin və ya onların üzərində dayanarkən ق ط ب ج د-də əks-səda sıçrayışı.",
    explanation: [
      "Qalqalah قُطْبُ جَدٍ, yəni ق ط ب ج د ifadəsində toplanmış beş hərfə verilən yüngül əks-səda doğuran “sıçrayış”dır.",
      "Sıçrayış artikulyasiya nöqtəsinin yüngül vibrasiyasıdır; hərfdən sonra tam sait əlavə etməməlisiniz, yalnız onu təmiz şəkildə 'rebound' edin.",
      "Hərfin sözün ortasında sükun olanda daha yüngül (suğra), sözün sonunda həmin hərfin üzərində dayandıqda isə daha güclü və aydın olur (kübra).",
      "Sıçrayışı neytral saxlayın — onu “a”, “i” və ya “u” səsinə doğru əyməyin; ətrafdakı saitlərdən asılı olmayaraq eyni xırtıldayan əks-sədadır.",
    ],
    practice:
      'Əl-İxlas surəsini oxuyun və hər qalqalah hərfində möhkəm dayanın - "əhad" və "yulad" د - təmiz geri dönüşü hiss edin.',
  },
  {
    title: "Vəqf (Dayanma)",
    summary: "Harada dayanmalı, nəfəs almalı və dayanma tələffüzü necə dəyişir.",
    explanation: [
      "Vəqf harada və necə fasilə vermək sənətidir. Mushaf kiçik simvollarla dayanma nöqtələrini qeyd edir - məsələn, tələb olunan dayanacaq üçün م, icazə verilən dayanacaqlar üçün ط və ج və لا mənası burada dayanmır - oxuyanı istiqamətləndirmək üçün.",
      "Dayanma adətən son saiti susdurur, sonuncu hərfi sukun səsinə çevirir. Bu dəyişiklik daha sonra qalqalah və ya uzadılmış madd kimi digər qaydaları işə sala bilər, buna görə də dayandığınız zaman söz davam etdiyiniz zamandan fərqli səslənə bilər.",
      "Fasilə etdiyiniz yer mənaya təsir edə bilər, buna görə də heç vaxt orta ifadəni təhrif edəcək şəkildə pozmayın. Xüsusi bir hal, üç nöqtə ilə işarələnmiş muanaka (qucaqlayan) vəqfdir ki, burada iki nöqtədən birində dayana bilərsiniz, lakin hər ikisində deyil.",
      "Düzgün dayanma nöqtələrini öyrənməyin ən təhlükəsiz yolu ixtisaslı qiraətçinin yanında vəqf işarələrini göstərən mushafdır, beləliklə, fasilələriniz ötürülən qiraətə uyğun gəlir.",
    ],
    practice:
      "Vəqf işarələri olan bir səhifə götürün və simvolların göstərdiyi yerdə dayanaraq təcvid müəlliminin qeydindən sonra onu ucadan oxuyun.",
  },
  {
    title: "Hamzat Wasl",
    summary:
      "The connecting hamza that is pronounced only when starting, and dropped when joining.",
    explanation: [
      "Hamzat wasl (ٱ) is a connecting hamza written with a small saddah-like mark above an alif. It appears at the start of many nouns, verbs, and particles — including the definite article ال.",
      "When you begin recitation on a word that starts with hamzat wasl, you pronounce it with a clear hamza sound so the word can open cleanly.",
      "When the word is joined to what comes before it, the hamzat wasl is silent — you glide from the previous letter straight into the following letter and do not sound a separate hamza.",
      "Recognizing hamzat wasl helps you avoid inserting an extra glottal stop mid-phrase, which is a common beginner habit when reading the mushaf slowly.",
    ],
    practice:
      "Recite the basmalah and Surah al-Fatiha, pausing at each ٱ to decide whether you are starting (pronounce) or joining (drop).",
  },
  {
    title: "Lam Shamsiyah",
    summary: "Sun letters that assimilate the لام of ال, versus moon letters that keep it clear.",
    explanation: [
      "When the definite article ال is attached to a noun, the لام may be pronounced clearly or assimilated, depending on the following letter.",
      "Sun letters (huruf shamsiyah) cause the لام to be silent and the next letter to be doubled with a shaddah — as in ٱلرَّحْمَٰن where the ر absorbs the لام.",
      "Moon letters (huruf qamariyah) keep the لام clear — as in ٱلْقَمَر — so you hear both the لام and the following letter.",
      "Learning the sun and moon sets by heart (or by ear from a teacher) prevents over-pronouncing silent لام and under-pronouncing clear لام.",
    ],
    practice:
      "Open Juz Amma and mark ten nouns with ال: for each, name whether the لام is shamsiyah (silent) or qamariyah (clear) before you recite.",
  },
  {
    title: "Silent Letters",
    summary: "Letters written in the mushaf that are not pronounced in continuous recitation.",
    explanation: [
      "Some letters appear in the Uthmani script for historical or orthographic reasons but are not sounded when you recite — they are marked silent in tajweed colorings.",
      "Common cases include certain alifs that are written but not elongated, and letters that are assimilated into a following shaddah so they leave no separate sound.",
      "Silent marking is a reading aid: it keeps the written mushaf faithful while guiding the tongue not to invent an extra sound.",
      "When in doubt, follow a colored tajweed mushaf or a qualified reciter — the goal is fidelity to the transmitted reading, not guessing from spelling alone.",
    ],
    practice:
      "With tajweed colors on, read one page slowly and whisper only the colored (sounded) letters — skip every silent-marked letter deliberately.",
  },
];

export const QURAN_GUIDE_VOCABULARY_AZ: DeepPartial<QuranGuideVocabEntry>[] = [
  {
    meaning: "Tək həqiqi Allah - bütün gözəl adları əhatə edən xüsusi ad.",
    frequency: "2700+ hadisə",
    example: "Bismillah - Allahın adı ilə",
    quranRef: {
      excerpt: "Mərhəmətli və Rəhmli Allahın adı ilə!",
    },
  },
  {
    meaning: "Rəbb, Ustad, Rəhbər - yaradan, sahib olan, tərbiyə edən və idarə edən.",
    frequency: "Çox tez-tez",
    example: "Rabbana - Rəbbimiz",
    quranRef: {
      excerpt: "Həmd aləmlərin Rəbbi olan Allaha məxsusdur.",
    },
  },
  {
    meaning: "Rəhmət, şəfqət, Allahdan və məxluqlar arasında olan incəlik.",
    frequency: "Ümumi kök ر-ح-م",
    example: "ər-Rəhman, ər-Rəhim",
  },
  {
    meaning: "Cənnət, Cənnət - əbədi mükafat yurdu.",
    frequency: "Tez-tez",
    example: "(ağacları) altından çaylar axan cənnətlərdir",
  },
  {
    meaning: "Yanğın - Cahannama xəbərdarlıq və nəticə kimi istinad edir.",
    frequency: "Tez-tez",
    example: "Kafirlər üçün hazırlanmış oddan qorxun",
  },
  {
    meaning: "İman, iman, Allaha təvəkkül və Onun risalətini qəbul etmək.",
    frequency: "Çox tez-tez",
    example: "Ey iman gətirənlər (ya eyyuhə allazina əmanu)",
  },
  {
    meaning: "Allah rizası üçün səbir, səbir, dözüm.",
    frequency: "Tez-tez",
    example: "Həqiqətən, Allah səbir edənlərlədir",
  },
  {
    meaning: "Şükür – nemətləri qəlb, dil və əzalarla etiraf etmək.",
    frequency: "Tez-tez",
    example: "Əgər şükür etsəniz, sizi mütləq artıraram",
  },
  {
    meaning: "Allah təəssübkeşliyi, təqva, Allah qorxusundan günahdan qorunmaq.",
    frequency: "Çox tez-tez",
    example: "Allah yanında ən hörmətliniz ən əməlisalehinizdir",
  },
  {
    meaning: "Ruzi, ruzi - Allahın hər bir nəfs üçün yazdığı şey.",
    frequency: "Tez-tez",
    example: "Allah ruzi verənlərin ən yaxşısıdır",
  },
  {
    meaning: "Nur - hidayət, vəhy və qəlbin nuru.",
    frequency: "Tez-tez",
    example: "Allah göylərin və yerin nurudur",
    quranRef: {
      excerpt: "Allah göylərin və yerin nurudur...",
    },
  },
  {
    meaning:
      'Bu dünya həyatı - sözün əsl mənasında "aşağı/yaxın" həyatdır. Quranda bu müvəqqəti və sınaqdır, daimi axirətlə ziddiyyət təşkil edir və heç vaxt möminin həqiqi yurdu deyildir.',
    frequency: "Tez-tez",
    example: "Dünya həyatı (əl-həyat əd-dünya) ancaq əyləncə və əyləncədən ibarətdir",
  },
  {
    meaning:
      "Axirət - ölümdən sonrakı əbədi həyat, o cümlədən dirilmə, hökm, Cənnət və Cəhənnəm. Qur'anın möminləri çalışmağa çağırdığı həqiqi və qalıcı həyatdır.",
    frequency: "Tez-tez",
    example: "Axirət isə daha xeyirli və daha davamlıdır",
  },
  {
    meaning:
      "İslamın ikinci sütunu olan ritual namaz gündə beş dəfə qılınır. Söz həm də Allaha bağlılıq və dua mənasını daşıyır.",
    frequency: "Çox tez-tez",
    example: "Məni yad etmək üçün namazı qıl",
  },
  {
    meaning:
      "Kitab və ya kitab — çox vaxt Qur'anın özü (“bu, Kitabdır”), həm də əvvəllər nazil olan kitablar və əməllərin qeydi. K-t-b-də kök salıb, yazmaq.",
    frequency: "Çox tez-tez",
    example: "Bu, barəsində heç bir şəkk-şübhə olmayan Kitabdır",
  },
];

export const QURAN_GUIDE_LETTERS_AZ: DeepPartial<QuranGuideLetter>[] = [
  {
    name: "Əlif",
    pronunciation: "Uzun /a/ 'ata'da olduğu kimi (həmzə və ya mədd daşıyarkən)",
  },
  {
    name: "Ba",
    pronunciation: "İngilis 'b' kimi",
  },
  {
    name: "Ta",
    pronunciation: "İngilis 't' kimi",
  },
  {
    name: "Tha",
    pronunciation: "'düşünmək'də 'th' kimi",
  },
  {
    name: "Jim",
    pronunciation: '"Cem"dəki "j" kimi',
  },
  {
    name: "ha",
    pronunciation: 'Boğazdan kəskin nəfəsli h - ingiliscə "h" deyil',
  },
  {
    name: "Xa",
    pronunciation: "Şotland 'loch' kimi - boğazda sürtünmə",
  },
  {
    name: "Dal",
    pronunciation: "İngilis 'd' kimi",
  },
  {
    name: "Dhal",
    pronunciation: "'bu'dakı 'th' kimi",
  },
  {
    name: "Ra",
    pronunciation: "Yuvarlanmış/trilled 'r'",
  },
  {
    name: "Zay",
    pronunciation: "İngilis 'z' kimi",
  },
  {
    name: "Günah",
    pronunciation: "İngilis dili kimi",
  },
  {
    name: "Shin",
    pronunciation: "'gəmi'dəki 'sh' kimi",
  },
  {
    name: "Kədərli",
    pronunciation: "Emfatik 's' — dil qaldırılmış, daha dolğun səs",
  },
  {
    name: "ata",
    pronunciation: "Emphatic 'd' — ərəb dilinə xasdır",
  },
  {
    name: "Ta (vurğulayıcı)",
    pronunciation: "Vurğulanan 't' - ağızda daha dərin",
  },
  {
    name: "Za (vurğulayıcı)",
    pronunciation: "'dh' səsinin vurğulanmış versiyası",
  },
  {
    name: "Ayn",
    pronunciation:
      "Boğazın ortasından səsli bir daralma - İngilis ekvivalenti yoxdur; onu oxuyanı təqlid edərək öyrənin",
  },
  {
    name: "Ghayn",
    pronunciation: 'Fransız "r" və ya qarqara "gh" kimi',
  },
  {
    name: "Fa",
    pronunciation: "İngilis 'f' kimi",
  },
  {
    name: "Qaf",
    pronunciation: 'Dilin arxasından dərin "k" - ingiliscə "k" deyil',
  },
  {
    name: "Kaf",
    pronunciation: 'İngilis "k" kimi (ağızda irəli)',
  },
  {
    name: "Lam",
    pronunciation: "İngilis 'l' kimi",
  },
  {
    name: "Mim",
    pronunciation: "İngilis 'm' kimi",
  },
  {
    name: "rahibə",
    pronunciation: "İngilis 'n' kimi",
  },
  {
    name: "Ha (işıq)",
    pronunciation: 'Sözlərin sonunda yumşaq "h"',
  },
  {
    name: "Vay",
    pronunciation: "'w' və ya uzun 'oo' kimi",
  },
  {
    name: "Ya",
    pronunciation: "'y' və ya uzun 'ee' kimi",
  },
];

export const QURAN_GUIDE_PRONUNCIATION_AZ: DeepPartial<QuranGuidePronunciationPair>[] = [
  {
    title: "Ayn Ha vs",
    tip: "Hər ikisi boğazdan gəlir, lakin səs baxımından fərqlənir. Ayn (ع) boğazın ortasından gələn səsli sıxılmadır — səs telləri titrəyir. Ha (ح) güclü, səssiz nəfəsli sürtünmədir, titrəməsiz ağır bir ah kimi. İngilis dilində heç biri yoxdur, ona görə də onları oxuyandan qulaqla öyrənin.",
  },
  {
    title: "Ha vs Kha",
    tip: 'Ha daha kəskin və yüngüldür; Kha daha çox sürtünmə ilə daha dərindir - "loch" kimi.',
  },
  {
    title: "Günah vs Kədər",
    tip: 'Sin (س) ingilis dilində "see" kimi yüngül, nazik "s"dir. Sad (ص) onun ağır, vurğulayıcı əkizidir: dilin arxasını qaldırın, ağzı bir az yuvarlayın və səs dərinləşir. Onları qarışdırmaq sözləri dəyişə bilər - səbr (səbr) və işıq oxunuşu.',
  },
  {
    title: "Dal ataya qarşı",
    tip: "Dal (د) düz 'd'dir. Baba (ض) ərəbə xas ağır, vurğulayıcı 'd' hərfidir - dilin yan hissəsini yuxarı azı dişlərinə qarşı basın və səsin ağzınızı doldurmasına icazə verin. Ərəb dili hətta bu fərqli hərfə görə “atanın dili” ləqəbini də alır.",
  },
  {
    title: "Ta vs Ta (vurğulanmış)",
    tip: "Empatik ط daha dərindir; yalnız ingiliscə 't' ilə əvəz etməyin.",
  },
  {
    title: "Dhal vs Za (vurğulayıcı)",
    tip: "Hər ikisi 'th' səslərini əhatə edir; ظ daha ağır və vurğulayıcıdır.",
  },
  {
    tip: "Kaf (ك) ingiliscə 'açar' kimi irəli 'k'dir. Qaf (ق) çox daha arxada düzəldilmişdir - dilin arxa hissəsi uvulaya toxunur və ingilis dilində heç bir ekvivalenti olmayan dərin, bağırsaq \"k\" verir. Onları fərqləndirin: qəlb (ürək) kəlb (it) deyil.",
    title: "Kaf vs Qaf",
  },
  {
    title: "Ghayn Kha vs",
    tip: "Ghayn səsi var; Kha səssiz sürtünmədir.",
  },
];

export const QURAN_GUIDE_MEMORIZATION_PLANS_AZ: DeepPartial<QuranGuideMemorizationPlan>[] = [
  {
    title: "Başlanğıc — Juz Amma",
    summary:
      "Hər kəs üçün təbii başlanğıc nöqtəsi. Mushəfin sonunda çox qısa surələrlə başlayın - ən-Nasdan geriyə doğru - asan, tez savab verən və hər namazda faydalıdır.",
    surahs: ["Ən-Nas", "Əl-Fələq", "Əl-İxlas", "Əl-Məsəd", "Ən-Nəsr", "Əl-Kafirun", "Əl-Kövsər"],
    tip: "Gündə yalnız bir ayə əzbərləyin: bir murattal oxuyanı dinləyin, onu təxminən on dəfə təkrarlayın, axan qədər ucadan əks-səda verin, sonra davam etməzdən əvvəl onu tutduğunuza birləşdirin.",
  },
  {
    title: "Aralıq — On əsas surə",
    summary:
      "Qısa surələr möhkəm olduqdan sonra, böyük fəzilət daşıyan və tez-tez cümə günləri və gecələr oxunan daha çox sevilən daha uzun surələri götürün - əl-Mülk, Ya-Sin, ər-Rəhman, əl-Vaqiə və əl-Kəhf.",
    surahs: [
      "Əl-Fatihə",
      "Əl-Mülk",
      "Ya-Sin",
      "ər-Rəhman",
      "Əl-Vaqiə",
      "Əl-Kəhf",
      "Əl-Cümə",
      "Əl-Həşr",
    ],
    tip: "Yeni əzbərləməni sabit bir gündəlik vaxta keçirin - sübhdən dərhal sonra sakit, aydın düşüncəli vaxt idealdır - beləliklə, ardıcıllıq ağırlıq qaldırır.",
  },
  {
    title: "Təkmil — Bir juz",
    summary:
      "Hər şeyi möhkəm saxlayarkən tam juzu tamamlamağa qərar verin. Bir çoxları surələrini artıq qismən bildikləri 29 və ya 30-cu Cüzdən başlayır, sonra hər dəfə bir cüz xaricinə doğru genişlənir.",
    surahs: ["Juz seçin - bir çoxları Juz 29 və ya 30 ilə başlayır, sonra genişləndirir"],
    tip: "Köhnəsi möhkəm şəkildə dəyişdirilənə qədər heç vaxt yeni hissə əlavə etməyin. Həzrət Peyğəmbər (s) xəbərdarlıq etmişdir ki, əzbərlənmiş Qur'an, bağlı dəvənin qopmasından daha tez sürüşür.",
  },
  {
    title: "Hafiz səyahəti",
    summary:
      "Qur'anı bütünlüklə əzbərləmək – onu daşıyanı və Allahın lütfü ilə onların valideynlərini böyüdən bir ömürlük şərəfdir. Bu, adətən bir neçə illik gündəlik yeni yadda saxlama və intizamlı təftişi əhatə edən ciddi öhdəlikdir.",
    surahs: ["Bütün mushaf — adətən gündəlik təftişlə 3-7 il"],
    tip: "Tək cəhd etməyin: təftiş cədvəlinizi idarə etmək üçün Munib-in hifz izləyicisindən istifadə edin və səhvlərinizi aşkar edib düzəldə bilən ixtisaslı hafizə və ya müəllimə mütəmadi olaraq oxuyun.",
  },
];

export const QURAN_GUIDE_DAILY_LESSONS_AZ: DeepPartial<QuranGuideDailyLesson>[] = [
  {
    translation:
      "Ey iman gətirənlər, səbir və namazla kömək diləyin. Həqiqətən, Allah səbir edənlərlədir.",
    context:
      "Mədinədə nazil olan Bəqərə surəsindən. Allah çətinliklə üzləşən mömin üçün iki güc mənbəyini - səbirli səbir və namaza yönəlməyi - cütləşdirir və möhkəm olanlara Özünün xüsusi yoldaşlığını vəd edir.",
    reflection:
      "Bu ayənin mənə işarə etdiyi səbir və dua əvəzinə tez xilas olmaq üçün əlimi uzatdığım yerdə hazırda hansı sınaqla üzləşirəm?",
    action:
      "Bu gün tələsmədən bir namaz qılın və səcdənizdə yaşadığınız xüsusi imtahanda Allahdan səbr diləyin.",
  },
  {
    translation: "Mənim rəhmətim hər şeyi əhatə edir.",
    context:
      "Musa və onun qövmü kontekstində deyilən Əraf surəsindən. Allah Öz rəhmətini hər şeyi əhatə edən bir rəhmət olaraq təsvir edir - o qədər böyük bir rəhmət ki, Onun əzabından əvvəldir və ondan daha çoxdur.",
    reflection:
      "Özüm Allahın sonsuz rəhmətinə bağlı olduğum halda, kimin səhvini bağışlamaqdan imtina edirəm?",
    action:
      "Narahat olduğunuz bir insanı seçin, bu gün qəlbinizdə onları səmimi qəlbdən bağışlayın və Allahdan onları da hidayət edib bağışlamasını diləyərək qısa bir dua edin.",
  },
  {
    translation: "Əgər şükür etsəniz, sizi mütləq artıraram.",
    context:
      "Musanın Bəni-İsrailə öyüd-nəsihətindən olan İbrahim surəsindən. Allah öz artmasını birbaşa şükürlə bağlayır - bir nemətə şükür onu artıran şeydir, nankorluq isə onu itirməyə çağırır.",
    reflection:
      "Allahın hansı hədiyyələrini - sağlamlığımı, ailəmi, imanımı və ya ruzimi - bu həftəni adi və mənə borclu hesab etməyə başladım?",
    action:
      'Bu gecə yatmazdan əvvəl üç xüsusi nemət üçün ucadan "Əlhəmdulillah" deyin və hər birinin adını verin ki, şükür avtomatik deyil, şüurlu olsun.',
  },
  {
    translation: "İnsanlara yaxşı sözlər deyin.",
    context:
      "İsra surəsindən. Möminlərin özlərini necə aparmaları lazım olduğuna dair göstərişlər içərisində Allah insanlara, bütün insanlarla ən gözəl şəkildə danışmağımızı əmr edir, çünki sərt sözlər şeytanın parçalanmasına səbəb olan qapılardan biridir.",
    reflection:
      'Bu gün geriyə nəzər saldıqda, sözlərim əsasən insanları gücləndirirmi və ya onlardan uzaqlaşırmı - və hətta çətin hesab etdiyim insanlara da "yaxşı sözlər" deyirdimmi?',
    action:
      "Bu gün heç bir gizli tənqid olmadan bir insanı səmimi qəlbdən ruhlandırın və ya təşəkkür edin və etmək istədiyiniz bir sərt ifadəni geri çəkin.",
  },
  {
    translation: "Kim Allaha təvəkkül etsə, Allah ona kifayət edər.",
    context:
      "Ət-Talaq surəsindən, boşanma və təminatla bağlı hökmlər arasında yer alan - məhz insanların ən çox maddi sıxıntı keçirdikləri yerdə. Orada Allah vəd edir ki, Ondan qorxanlara heç gözləmədikləri yerdən ruzi verəcək və hər kəs Ona təvəkkül etsə, Onu kifayət qədər tapacaqdır.",
    reflection:
      "Mən harada ehtiyatlı planlar qururam ki, Allahı onlardan kənarda qoyub, yoxsa heç vaxt Ona müraciət etmədən insanların köməyinə arxalanmıram?",
    action:
      "Sizi narahat edən bir qərar qəbul edin, iki rükət istixarə namazı qılın və ya onun üçün ürəkdən dua edin və nəticəni Allaha təvəkkül edin.",
  },
  {
    translation: "Ey Rəbbim, elmimi artır.",
    context:
      "Ta-Ha surəsindən. Quranda Allahın Peyğəmbərə (sallallahu aleyhi və səlləm) daha çox - elm istəməsini əmr etdiyi yeganə şey budur ki, bu da elmin nə qədər çox faydalı olduğunu və heç kimin nə qədər alim olsa da, onu axtarıb qurtarmadığını göstərir.",
    reflection:
      "Bu gün boş vaxtımın nə qədəri sonsuz vərəqləməyə keçib və hətta onun bir hissəsi onun əvəzinə bir ayə və ya bir hədis öyrənməyə sərf edə bilərmi?",
    action:
      '"Rabbi zidni ilma" adlı bu qısa duanı əzbərləyin və gününüzə başlamazdan əvvəl sübhdən sonra deməyi vərdiş edin.',
  },
  {
    translation:
      "Mallarını Allah yolunda sərf edənlərin misalı yeddi sünbül verən toxum kimidir...",
    context:
      "Bəqərə surəsindən. Allah sədəqənin necə böyüdüyünü aydın şəkildə göstərir: yeddi sünbül çıxaran, hər birində yüz dənə olan bir toxumun gəliri yeddi yüz qat, dilədiyini isə daha da artırar. Onun rizası üçün verilən sərvət əsla itirilmir.",
    reflection:
      "Verdiyim zaman, Allah rizası üçün səssizcə edilir, yoxsa başqalarının bunu görüb məni tərifləməsini istəyərəm?",
    action:
      "Bu gün kiçik bir sədəqə verin, əgər bacarırsınızsa, gizli şəkildə verin - bu, sizinlə Allah arasındadır.",
  },
];

export const QURAN_GUIDE_APPLY_CHALLENGES_AZ: DeepPartial<QuranGuideApplyChallenge>[] = [
  {
    verseExcerpt: "İnsanlara yaxşı sözlər deyin.",
    challenge:
      "Bütün günü heç bir sərt, istehzalı və ya istehzalı sözlər olmadan keçirin - hətta zarafatla, hətta təhrik olunsa da.",
    habit:
      "Narahatlıq artdıqda, cavab verməzdən əvvəl fasilə verin və ya sükut, ya da xoş söz seçin.",
  },
  {
    verseExcerpt: "Mömin kişilərə de ki, gözlərini diksinlər...",
    challenge:
      "Bu gün nəzərinizi bilərəkdən Allahın haram buyurduğu şeylərdən uzaqlaşdırın - ekranda, lentinizdə və ictimai yerlərdə.",
    habit: "Hər dəfə özünüzü tutanda həmin anı beş dəqiqəlik Qurana yönləndirin.",
  },
  {
    verseExcerpt: "Onlara “uf” demə...",
    challenge:
      "Bu gün valideyn və ya ağsaqqalla görünən yumşaqlıq və səbirlə danışın, heç bir qıcıqlanma izi göstərmədən və onlara xidmət etmək üçün bir şey edin.",
    habit:
      "Əgər onlar sağdırsa, adi bir zəng və ya ziyarət etməyi öhdəsinə götürün; yoxsa, onlar üçün dua et.",
  },
  {
    verseExcerpt: "Doğru danışanların yanında olun.",
    challenge:
      "Bütün günü heç bir ağ yalan, şişirtmə və qeybət olmadan - hətta zarafatla da deyil, həqiqəti söyləyin.",
    habit: "Əgər sürüşsəniz, dərhal tövbə edin və sözünüzə təsir edən hər şeyi düzəldin.",
  },
  {
    verseExcerpt: "Allah səbir edənlərlədir.",
    challenge:
      "Növbəti dəfə bir şey sizi incidirsə, cavab verməzdən əvvəl hər bir sərt sözü tam altmış saniyə saxlayın.",
    habit: "İmkan daxilində qıcıqlanma anlarını zikrə və ya iki rükət namaza çevirin.",
  },
  {
    verseExcerpt: "Əgər şükür etsəniz, sizi artıraram.",
    challenge:
      "Sizin üçün etdikləri xüsusi bir şey üçün bu gün adları ilə üç fərqli insana təşəkkür edirəm.",
    habit: "Hər gecəni Münib jurnalınızda bir nemət - bir sətir qeyd etməklə bitirin.",
  },
  {
    verseExcerpt: "Kim bağışlasa və barışsa, onun mükafatı Allah yanındadır.",
    challenge:
      "Yaşadığınız bir kininizi buraxın - heç olmasa öz ürəyinizdə səmimi şəkildə buraxın.",
    habit: "Sizə zülm edən insan üçün incikliyi təkrarlamaq əvəzinə sakit bir dua edin.",
  },
];

export const QURAN_GUIDE_TADABBUR_PROMPTS_AZ: DeepPartial<QuranGuideTadabburPrompt>[] = [
  {
    question: "Allah bu ayədə mənə nə öyrədir?",
    hint: "Ayəni yavaş-yavaş oxuyun və onun quruluş elementlərinə diqqət yetirin: Allah əmr edir, xəbərdar edir, vəd edir, yoxsa hekayət danışır? O, Onun adlarından hansını istifadə edir və bu ad Onun burada bizimlə necə davranması barədə nəyi göstərir?",
  },
  {
    question: "Bunu bu gün bir konkret hərəkətdə necə tətbiq edə bilərəm?",
    hint: "Qeyri-müəyyən qətnamələr solur; konkret olanlar yapışır. Ayəni həyata keçirilə bilən tək bir addıma çevirin - bir söhbət etmək, başlamaq üçün bir vərdiş, gün bitməzdən əvvəl etmək üçün bir seçim.",
  },
  {
    question: "Bu ayəyə görə hansı vərdişi inkişaf etdirməli və ya aradan qaldırmalıyam?",
    hint: "Ayəni gündəlik işinizə - yuxunuza, danışmağınıza, xərcləməyinizə, namazınıza, münasibətlərinizə salın. Bu ayə sakitcə barmağını hansının üzərinə qoyur?",
  },
  {
    question:
      "Bu ayə məni Allahın rəhmətinə ümid etməyə, yoxsa Onun ədalətindən qorxmağa yönəldirmi və hər ikisi nə üçün vacibdir?",
    hint: "Mömin iki qanad kimi xovf (Allahın əzabından qorxmaq) və rəcə (Onun rəhmətinə ümid etmək) arasında gəzər. Bu ayə sizdə hansını gücləndirir və ürəyinizin buna daha çox ehtiyacı olub olmadığını soruşun.",
  },
  {
    question: "Peyğəmbər (s) bu ayəni necə yaşamışdır?",
    hint: "Peyğəmbər (s) “gəzən Qur'an” kimi təsvir edilmişdir. Səhih sirə və təfsirə baxın - İbn Kəsir tez-tez bir ayəni necə təcəssüm etdirdiyini xatırladır - və əməli nümunə kimi ondan nümunə götürün.",
  },
  {
    question: "Bu ayə hansı duanı ruhlandırır?",
    hint: "Ayə duaya çevrilsin. Səcdə əsnasında öz sözlərinizlə Allahdan diləyin ki, ayə nəyə səbəb olubsa - xəbərdarlıqdan qorunmaq, vəddən pay almaq və ya bir əmrə tabe olmaq üçün kömək etmək.",
  },
];

export const QURAN_GUIDE_READING_LEVELS_AZ: DeepPartial<QuranGuideReadingLevel>[] = [
  {
    title: "Ərəb əlifbası",
    summary:
      "28 hərfin hamısını ayrı formada tanımağı və hər birini adla tanımağı öyrənin. Bu, sırf tanışlıqdır - məktubu görmək və dərhal onun səsini adlandırmaq - və hər şeyin üzərində qurulan təməldir.",
    topics: ["Hərf adları", "Əsas formalar", "Sağdan sola istiqamət"],
  },
  {
    title: "Hərf formaları",
    summary:
      "Kəşf edin ki, əksər hərflər mövqeyindən asılı olaraq forma dəyişir - sözün əvvəli, ortası və ya sonunda - ərəb dili kursiv kimi birləşdirilir. Hansı bir neçə hərfin heç vaxt onlardan sonrakı birinə qoşulmadığını öyrənin.",
    topics: ["Əlaqəli yazı", "Qoşulmayan hərflər", "Əlif, vav, ya variantları"],
  },
  {
    title: "Harakat (saitlər)",
    summary:
      "Hər hərf öz saitini verən kiçik işarələri mənimsəyin: fətha (a), kasra (i), damma (u), saitsiz sukun, ikiqat şəddə və tanvin sonluqları. Bu işarələr səssiz hərfləri oxunaqlı sözlərə çevirənlərdir.",
    topics: ["Qısa saitlər", "Sukun", "Shaddah ikiqat", "Tanween"],
  },
  {
    title: "Birləşmə məktubları",
    summary:
      "Bir yerə qoyun: hərfləri və onların hərəkətini hecalara və qısa sözlərə birləşdirin, sağdan sola oxuyun. Sözün əvvəlindəki 'al-' hərfinin necə tələffüz olunacağına qərar verən günəş və ay hərf qaydası ilə tanış olun.",
    topics: ["CV nümunələri", "Ümumi prefikslər", "Günəş və ay hərfləri"],
  },
  {
    title: "Sözlərin oxunması",
    summary:
      "Həqiqi Qur'an lüğətini yavaş-yavaş və düzgün şəkildə deşifrə etməyə başlayın - Bismillah və hər namazda oxuduğunuz Fatihə kəlmələrindən başlayaraq - oxumaq ibadətlə ilk andan əlaqələndirilir.",
    topics: ["Yüksək tezlikli sözlər", "Bismillah", "Əl-Fatihə sözləri"],
  },
  {
    title: "Ayələri oxumaq",
    summary:
      "Juz Amma-dan qısa tam ayələrə keçin, əsas təcvid və nəfəs almaq üçün harada fasilə veriləcəyini (vəqf) əlavə edin, həmişə qiraətçinin yanında oxuyun ki, qulağınız dilinizi idarə etsin.",
    topics: ["Cüz Amma surələri", "Vəqf nişanları", "Bir qiraətçinin ardınca"],
  },
  {
    title: "Səlis oxumaq",
    summary:
      "Təbii olaraq tətbiq olunan təcvid qaydaları ilə hamar, inamlı qiraətə çatın. Gündəlik hissəni davam etdirin və müəllimin və ya ixtisaslı oxuyanın sizi yoxlamasını davam etdirin, çünki rəvanlıq bir dəfə əldə olunmayıb, davam edən korreksiya vasitəsilə cilalanır.",
    topics: ["Gündəlik hissə", "Təcvid qaydaları tətbiq edilir", "Müəllim rəyi"],
  },
];

export const QURAN_GUIDE_QUIZ_AZ: DeepPartial<QuranGuideQuizQuestion>[] = [
  {
    prompt: "Quranda neçə surə (surə) var?",
    options: ["99", "114", "124", "144"],
    explanation:
      "Quranda üç ayədən 286-ya qədər olan 114 surə vardır. Onların müs'həfdəki sırası vəhy (təvqifi) ilə müəyyən edilmişdir.",
  },
  {
    prompt: "Qur'an gündəlik oxumaq üçün neçə bərabər hissəyə (cüz) bölünür?",
    options: ["7", "12", "30", "60"],
    explanation:
      "Otuz yüz. Gündə bir cüz oxumaq bütün Qur'anı bir ayda tamamlayır - Ramazanda bir xətimi bitirməyin klassik üsulu.",
  },
  {
    prompt: "Quranda 286 ayədən ibarət ən uzun surə hansıdır?",
    options: ["Əl-Fatihə", "Əl-Bəqərə", "Ya-Sin", "Ən-Nas"],
    explanation: "Bəqərə surəsi ən uzundur, 286 ayədir. Qanun və hidayətlə zəngin Mədəni surədir.",
  },
  {
    prompt: "Doğru və ya yalan: Məkki surəsi hicrətdən əvvəl Mədinəyə nazil olan surədir.",
    options: ["Doğrudur", "Yalan"],
    explanation:
      "Məkki surələri hicrətdən əvvəl nazil olub və çox vaxt əqidə və tövhid üzərində dayanır; Mədəni surələr sonra gəldi və tez-tez qanun və icma rəhbərliyi əlavə edir.",
  },
  {
    prompt: "Hira mağarasında Peyğəmbərə (s) nazil olan ilk ayələr hansı surədədir?",
    options: ["Əl-Fatihə", "Əl-Ələq (İqra)", "Əl-Bəqərə", "Əl-İxlas"],
    explanation:
      "İlk nazil olan “Ələq” surəsinin (96) başlanğıc ayələri idi: “İqra” — Oxu, yaradan Rəbbinin adı ilə.",
  },
  {
    prompt: "Qur'an təqribən neçə ildən sonra nazil olub?",
    options: ["3 il", "10 il", "23 il", "40 il"],
    explanation:
      "Qur'an hadisələrə və ehtiyaclara cavab verən təxminən 23 il ərzində - 13-ü Məkkədə, 10-u Mədinədə - tədricən nazil olmuşdur.",
  },
  {
    prompt: "Doğru və ya yalan: Qur'an Ramazan ayında, Qədr gecəsində nazil olmağa başladı.",
    options: ["Doğrudur", "Yalan"],
    explanation:
      "Allah Qur'anın Ramazan ayında (2:185) Qədr gecəsində (97:1) nazil olduğunu bildirir. O gecəni axtarmaq böyük fəzilətdir.",
  },
  {
    prompt: "Gündəlik namazın hər rükətində hansı surə oxunur?",
    options: ["Əl-İxlas", "Əl-Fatihə", "Əl-Kövsər", "Ən-Nəsr"],
    explanation:
      "Hər rükət namazda Fatihə surəsi - yeddi ayə oxunur. “Kitabın açılışını oxumayanın namazı yoxdur”.",
  },
  {
    prompt: "“Bismillahir-Rəhmanir-Rəhim” ilə başlamayan surə hansıdır?",
    options: ["Əl-Fatihə", "ət-Tövbə", "Əl-İxlas", "Ən-Nas"],
    explanation: "Tövbə surəsi (9) Bəsmələ ilə açılmayan yeganə surədir.",
  },
  {
    prompt: "Təcviddə Mədd hökmü nəyi idarə edir?",
    options: [
      "İki hərfin birləşməsi",
      "Sait səsin uzanması (uzadılması).",
      "Əks-səda müəyyən hərflərə sıçrayır",
      "Harada dayanmaq və nəfəs almaq",
    ],
    explanation:
      "Mədd müəyyən sayda saymaq üçün mədd hərfləri - əlif (ا), vav (و) və ya (ي) üzərində sait səsini uzatmaq deməkdir.",
  },
  {
    prompt:
      'Qalqalah, sukun daşıyan hərflərin hansı dəstəsinə verilən işıq əks-sədası "sıçrayışdır"?',
    options: ["ي ر م ل و ن", "ق ط ب ج د", "ء ه ع ح غ خ", "ا و ي"],
    explanation:
      "Beş qalqalah hərfi قُطْبُ جَدٍ - ق ط ب ج د - ifadəsində toplanmışdır, onlar sukun daşıdıqda təmiz geri dönmə verirlər.",
  },
  {
    prompt: "Quranda tez-tez rast gəlinən “Rəbb” (رَبّ) sözü:",
    options: ["Mərhəmət", "Rəbb, Ustad, Rəhbər", "kitab", "Bağ"],
    explanation:
      "'Rəbb' Rəbb, Ustad və Rəhbər deməkdir - yaradan, sahib olan, tərbiyə edən və idarə edən deməkdir. “Rabbana” “Rəbbimiz” deməkdir.",
  },
  {
    prompt: "“Cənnət” (جَنَّة) sözünə işarə edilir:",
    options: ["Yanğın", "Cənnət bağı", "Namaz", "Oruc tutmaq"],
    explanation: "“Cənnət” Cənnət – əbədi mükafat yurdu, “altından çaylar axan bağlar” deməkdir.",
  },
  {
    prompt: "Hansı peyğəmbər oğlu İsmayılla birlikdə Məkkədə Kəbənin bünövrəsini ucaltmışdır?",
    options: ["Nuh", "Musa", "İbrahim", "Yusif"],
    explanation:
      "İbrahim (Allahın dostu Xəlilullah) və İsmayıl “Ey Rəbbimiz, bunu bizdən qəbul et” deyə dua edərək Kəbəni tikdirdilər (2:127).",
  },
  {
    prompt:
      "Hansı peyğəmbər birbaşa Allahla danışıb, Fironla qarşılaşıb və Bəni-İsraili yarılmış dənizdən keçirib?",
    options: ["İsa", "Musa", "Adəm", "Yunus"],
    explanation:
      "Musa (Kəlimullah) Allahla danışdı, Fironun yanına göndərildi və Allahın əmri ilə dəniz yarıldı və qövmü sağ-salamat keçdi.",
  },
  {
    prompt:
      "Bundan sonra hansı surəni və ya qısa parçanı başa düşmək və əzbərləmək üçün yola düşəcəksiniz, in şaa Allah?",
    explanation:
      "Kiçik ardıcıl addımlar Allahın Kitabı ilə ömürlük bir əlaqə qurur. Hissinizi seçin, mənasını öyrənin və tez-tez nəzərdən keçirin.",
  },
];
