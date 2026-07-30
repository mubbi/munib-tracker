// Azerbaijani translation overlay for the Learn "Jahannam" content. Mirrors the order of
// its English source in ../jahannam*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  JahannamDuaEntry,
  JahannamGateEntry,
  JahannamHadithEntry,
  JahannamNameEntry,
  JahannamReferenceEntry,
  JahannamReflectionEntry,
  JahannamTopic,
  JahannamVerseEntry,
} from "../../types/jahannam";
import type { DeepPartial } from "./localize";

export const JAHANNAM_CORE_TOPICS_AZ: DeepPartial<JahannamTopic>[] = [
  {
    title: "Giriş",
    summary: "Allah ümidsizlik üçün deyil, hidayət üçün Cəhənnəm haqqında bizə xəbər verir.",
    body: [
      "Cəhənnəm - çox vaxt Cəhənnəm və ya Cəhənnəm kimi tərcümə olunur - Allahın Quranda və Rəsulu (sallallahu aleyhi və səlləm) vasitəsilə təsvir etdiyi axirət əzab yurdudur. Bizə bunu deyir ki, qəlbi qorxu ilə əzməsin, ancaq qapı hələ açıq ikən qəlblər oyansın, geri dönsün və rəhmət yolunu seçsin.",
      "Bu, mərhəmətli Rəbbin niyə ümumiyyətlə Od haqqında danışdığını anlamağa kömək edir. Xəbərdarlığın özü bir mərhəmətdir: qaranlıqda qabaqda uçurum deyən adama hədə deyil, hədiyyə verilir. Cəhənnəmlə bağlı hər bir ayə Allah Öz lütfü ilə, dönüş vaxtı keçməmiş qullarını geri çağırır.",
      "Buna görə də xəbərdarlıqlar vəhy boyu tövbə, bağışlanma və Allahın geniş rəhmətinə ümid etməyə çağırışlarla birləşdirilir. Quranda Cənnətdən, açıq tövbə qapısından və Allahın qayıdanlara olan sevgisindən bəhs edən Cənnətdən çox az bəhs edilir. Məqsəd salehliyə aparan cavabdehlikdir - heç vaxt ümidsiz olmayın.",
      "Cəhənnəmə iman gətirmək qeybə (əl-qeybə), ilahi ədalətə və qiyamət gününün həqiqətinə iman gətirməyin bir hissəsidir. Seçimlərimizə ağırlıq verir və Cənnət ümidini günaha qarşı ciddiliklə tarazlaşdırır ki, mömin ümidlə qorxu arasında - Allahın rəhmətinə ümid edərək, öz nöqsanlarına diqqət yetirərək gedir.",
      "Sünni inancının mərkəzi bir rahatlıq nöqtəsi bütün bu moduldan keçir: tək Allaha iman gətirərək ölənlər, günah yükü altında olsalar belə, əbədi olaraq Cəhənnəmdə qalmayacaqlar. Günahkar möminlər Allahın rəhməti və icazə verdiyi şəfaətlə nəticədə çıxarılır; yalnız imanı inkar edərək ölənlər qalır. Beləliklə, Cahannamın öyrənilməsi mömin üçün son nəticədə mərhəmətə necə çatmağın öyrənilməsidir.",
      "Bu modul mətnlərin açıq-aydın ifadə etdiklərini təqdim edir, alimlərin ixtilaf etdikləri yerləri səmimi şəkildə qeyd edir, yalnız mötəbər dəlillərə istinad edir və sizi ardıcıl olaraq tövbəyə, yaxşı əməllərə və Allaha təvəkkülə yönəldir.",
    ],
    quran: [
      {
        excerpt:
          "Kafirlər üçün hazırlanmış oddan qorxun, Allaha və Peyğəmbərə itaət edin ki, bəlkə rəhm olunasınız.",
      },
      {
        excerpt:
          "De: “Ey Mənim özlərinə zülm edən qullarım, Allahın rəhmətindən ümidinizi kəsməyin. Həqiqətən, Allah bütün günahları bağışlayar.",
      },
      {
        excerpt:
          "Ey iman gətirənlər, Allaha səmimi tövbə ilə tövbə edin ki, Rəbbiniz günahlarınızı sizdən sovuşdurub Cənnət bağlarına daxil etsin.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Allah Cəhənnəmi niyə yaratdı",
    summary: "İlahi ədalət, məsuliyyət və azad seçimin nəticələri.",
    body: [
      "Cəhənnəm Allahın kamil ədalətinin (ədl) təcəllisi olaraq mövcuddur. Zalımla məzlumun, ixlaslı ilə xainin eyni sonla qarşılaşdığı bir kainat ədalətli olmazdı. Allah ədalətli olduğu üçün hər bir səhvə cavab verildiyi və hər bir yaxşılığa layiq görüldüyü bir son haqq-hesab olmalıdır.",
      "Əsas odur ki, Allah heç kəsə zülm etməz. Cəhənnəmə daxil olan hər bir nəfs ona öz qərarlı, tövbə etməmiş seçimləri ilə daxil olur - heç vaxt özbaşına bir hökmlə deyil. Quranda vurğulanır: “Allah insanlara əsla zülm etməz, lakin insanlar özlərinə zülm edərlər” (4:40). Heç kim nə etmədiyinə görə, nə də layiq olduğundan artıq cəzalandırılmır.",
      "İnsan qaranlıqda qalmadı. Allah onlara ağıl verdi, elçilər göndərdi, açıq-aydın hidayət nazil etdi, sonra onu qəbul etmək və ya rədd etməkdə onlara həqiqi hürriyyət verdi: “Kim istəyirsə, iman gətirsin. Kim istəsə, kafir olsun!” (18:29). Tövbə etmədən haqqı inkar etməkdə, zülm etməkdə və ya böyük günahda israr etmək, axirətdə nəticələrinə səbəb olur, çünki seçim həqiqətən insanın öz ixtiyarındadır.",
      "Hələ burada da mərhəmət ədaləti çərçivəyə salır. Allah mühakimə etməzdən əvvəl xəbərdar edir, hesabı geri qaytarmaq üçün gecikdirir, istənildikdə bağışlayar və tək bir günahı bir kimi yazarkən, bir yaxşılığı dəfələrlə çox mükafatlandırar. Onun ədaləti heç vaxt mərhəmətindən ayrı deyil.",
      "Cəhənnəmin niyə mövcud olduğu üzərində düşünmək, təqvanı (Allah şüurunu) artırmalı və həyatın hələ də tövbə etmək şansı olan hər günü üçün şükürü dərinləşdirməlidir. Ürəyi bir anda ciddi və ümidli etmək üçün nəzərdə tutulub - heç vaxt onu ümidsizliklə iflic etməmək.",
    ],
    quran: [
      {
        excerpt:
          "Həqiqətən, Allah insanlara əsla zülm etməz, lakin insanlar özlərinə zülm edərlər.",
      },
      {
        excerpt: "O, etdiyi əməllərdən sorğu-sual olunmaz, lakin onlar sorğu-sual olunacaqlar.",
      },
      {
        excerpt:
          "Kim istəsə, iman gətirsin. Kim istəsə, kafir olsun. Biz zalımlar üçün od hazırlamışıq.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sizlərdən heç biriniz tək öz əməli ilə Cənnətə daxil olmaz. Dedilər: Sən də deyilsən, ya Rəsulallah? O dedi: “Allah məni Öz rəhmətinə bürümədikcə, mən də.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Axirət həqiqəti",
    summary: "Ölümdən qiyamətə qədər - hər mərhələ gerçəkdir və əqidə ilə bağlıdır.",
    body: [
      "Cahannamı düzgün başa düşmək üçün onun daha böyük səyahətdə harada oturduğunu görmək kömək edir. İslam ölümdən sonra aydın ardıcıllığı öyrədir: ruh bədəndən ayrılır, sonra bərzəx (qəbrin fasiləsiz həyatı) başlayır, sonra cəsədlər dirildildikdə qiyamət, bütün məxluqatın bir yerə toplanması, əməllərin yoxlanılacağı hökm, əməllərin tərəzidə çəkilməsi (əl-Mizan), hər bir körpünün keçməsi, Cənnət və ya Cəhənnəm - hamısı Allahın hökmü, ədaləti və rəhməti ilə.",
      "Bu mərhələlərin hər biri əsas sünni əqidəsində Qur'an və həqiqi Sünnə əsasında təsdiq edilmişdir. Bu zaman qrafiki simvol və ya hekayə deyil; qiyamət gününə iman gətirməyin bir hissəsi kimi iman edilməli olan bir həqiqətdir və onu bilərəkdən inkar etmək sadəcə əməldə deyil, əqidə məsələsidir.",
      "Bütün yolu görmək Atəşi də yenidən əhatə edir. Bu, hər bir ruhun artıq səyahət etdiyi bir səyahətin sonunda mümkün bir yerdir - bu o deməkdir ki, bu günün seçimləri mücərrəd deyil. Onlar o yolun addımlarıdır və hələ də istiqamətləndirmək bizimdir.",
      "Bu ardıcıllığı bilmək möminə qorxudan daha çox hazırlaşmağa kömək edir: ölümü sağlam zikr etməklə (zikrül-mövt) yaşamaq, məclisə daşınmazdan əvvəl səhvləri düzəltmək və əməlin qapısı hələ açıq ikən yaxşılıqların hesabını doldurmaq. Ölüm o qapını bağlayır; ondan sonra heç nə əlavə etmək olmaz.",
    ],
    quran: [
      {
        excerpt:
          "Həqiqətən, bundan sonra siz öləcəksiniz. Sonra siz Qiyamət günü dirildiləcəksiniz.",
      },
      {
        excerpt:
          "Kimin tərəzisi ağır olarsa, o, xoş həyatda olar. Tərəzisi yüngül olanın sığınacağı yer uçurum olacaqdır.",
      },
    ],
    actions: [
      "Aqeedah öyrənməyin hər bir mərhələsini öyrənin və imanı gündəlik seçimlərlə əlaqələndirin.",
      "Rəhmət ümidini əsirgəmədən ölümü (zikrül-məvti) zikr et.",
    ],
    appLinks: [{}, {}, {}, {}, {}, {}],
  },
  {
    title: "Cəhənnəm adları",
    summary:
      "Mənaları olan Qur'an adları — alimlər hər birinin ayrı-ayrı səviyyə olub-olmaması barədə ixtilaf edirlər.",
    body: [
      "Qur'an Cəhənnəmi bir neçə adla xatırladır və bu, sadəcə təkrar deyil. Ərəb dilində bir ad tez-tez onun içərisində parlaq təsvir daşıyır, buna görə də hər bir ad işarə etdiyi reallıq haqqında bir şey öyrədir. Onların arasında Cəhənnəm, Cahim, Səqar, Sair, əl-Hütəmə, əl-Haviyə və Ləzadır.",
      "Hər ad ciddiliyin fərqli aspektinə bir pəncərə açır. Cahim və Sair şiddətli alovlu, alovlu bir alov doğurur; Səqar, yandırıb-yaxan və heç nə buraxmayan; əl-Hütəmə, içinə atılan hər şeyi sındıran sındıran; əl-Həviyə, insanın düşdüyü dərin uçurum; və Lazaa, saf, soyulan alov. Adları birlikdə oxumaq ürəyin asanlıqla göz ardı edə bilməyəcəyi ayıq bir mənzərə yaradır.",
      "İbn Kəsir və ət-Təbəri kimi klassik təfsir alimləri bu adları ərəb köklərindən izah edir və hər birini sabit texniki siyahı kimi nəzərdən keçirməkdənsə, onların keçdiyi ayənin kontekstində müzakirə edirlər.",
      'It is worth a word of caution here. Bəzi sonrakı yazıçılar hər bir adı Cəhənnəmin fərqli, sıralanmış "səviyyəsi" kimi təqdim edirlər, bəzən ətraflı diaqramlarla. Bu, Quranda və ya razılaşdırılmış hədislərdə qeyd olunan açıq bir yoxlama siyahısı deyil, elmi şərhdir. Balanslaşdırılmış yanaşma mətnlərin əslində verdiyi mənaları öyrənmək və spekulyativ xəritələri əminlik kimi təqdim etməkdən çəkinməkdir.',
      "Adları öyrənməkdə məqsəd marağı təmin etmək deyil, ürəyi yumşaltmaq və onu bu modulun işarə etdiyi mərhəmətə doğru hərəkət etdirməkdir. Hər bir adın Qur'an hadisəsi, konteksti və təfsir xülasəsi üçün tam adlar toplusuna baxın.",
    ],
    quran: [
      {
        excerpt: "Cəhənnəm istirahət yeri olaraq kifayətdir - Cəhənnəm.",
      },
      {
        excerpt: "O, Hutəmə - sarsıdıcı atəşə atılacaqdır.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Cəhənnəmin Səviyyələri",
    summary: "Cəzanın müxtəlif dərəcələri — mətnlərdə dəqiq struktur tam təfərrüatlı deyil.",
    body: [
      "Qur'anın açıq şəkildə bildirdiyi bir prinsip, cəzanın mütənasib olmasıdır: Cəhənnəmdəki hər kəs onu eyni ölçüdə yaşamır. “Hər kəsin etdiklərinə görə dərəcələri vardır” (6:132). Bu özü ədalətin ifadəsidir - az zülm edənə çox zülm edən kimi davranılmır.",
      "Səhih Sünnə də eyni prinsipi göstərir. Peyğəmbər (salləllahu aleyhi və səlləm) cəhənnəm əhlinin ən az əzab çəkəni, ayaqlarının altına iki köz qoyulmuş, beyni qaynayan və bununla belə, bütün əhlinin əzabında ən yüngül olanı vəsf etmişdir (Səhih əl-Buxari 6562). Əgər bu ən kiçikdirsə, ağıl daha böyük dərəcələrin nə qədər ciddi olduğunu və bu gün geri dönmək üçün nə qədər səbəb olduğunu anlayır.",
      "Eyni zamanda, vəhy möminlərə əzbərləmək məcburiyyətində olduqları Cəhənnəmin quruluşunun tam, nömrələnmiş xəritəsini vermir. Alimlər müxtəlif ayələrdən və hesabatlardan götürülmüş səviyyələri, dərinlikləri və kateqoriyaları müzakirə etdilər, lakin bunların çoxu razılaşdırılmış, açıq mətndən daha çox təfsir olaraq qalır.",
      "Ancaq iki şey əmindir. Birincisi, o zülm (zülm), şirk və tövbə etmədən davam edən böyük günah ciddi xəbərdarlıqdır. İkincisi – və heç vaxt unudulmamalıdır ki, Allahın hüzuruna səmimiyyətlə qayıdan hər kəs üçün ölüm anına qədər Allahın rəhməti və bağışlaması açıqdır. Dərəcələr haqqında öyrənməyin məqsədi seçim qalarkən daha yüngül yolu seçməkdir.",
      "Praktiki olaraq bu, “yeddi səviyyə” və ya oxşar sxemlərin təfərrüatlı siyahılarını sabit doktrina deyil, elmi rəy kimi nəzərdən keçirmək və əslində qoruyan şeylərə diqqət yetirmək deməkdir: iman, tövbə və saleh əməllər.",
    ],
    quran: [
      {
        excerpt: "Hər kəsin etdiklərinə görə dərəcələri vardır.",
      },
      {
        excerpt:
          "Həqiqətən, münafiqlər cəhənnəm odunun ən aşağı qatında olacaqlar və sən onlara heç vaxt köməkçi tapa bilməzsən.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Cəhənnəm əhlinin ən az cəzası ayaqlarının altına iki köz qoyulmuş, beyni qaynayan adamdır.",
      },
    ],
    disclaimer:
      "Bəzi kitablarda tapılan Cəhənnəm səviyyələrinin diaqramları yekdil razılığı deyil, elmi şərhi əks etdirir.",
  },
  {
    title: "Cəhənnəm qapıları",
    summary: "Yeddi qapı – Qur'anın nə dediyini və təfsirinin fərqli olduğu yer.",
    body: [
      "Cəhənnəmlə bağlı bir təfərrüat Quranda açıq-aşkar və birmənalı olaraq belə bildirilir: “Həqiqətən, Cəhənnəmin yeddi qapısı vardır. Hər qapı üçün onların müəyyən bir hissəsi vardır” (15:44). Yeddi qapıya inam fərziyyələrə deyil, aydın vəhyə əsaslanır.",
      "Ayə iki şeyi təsdiq edir: yeddi qapının olması və içəri girənlərin onların arasında bölüşdürülməsi. Klassik təfsir alimləri bölüşdürmənin nə demək olduğunu müzakirə edirlər - istər insanların kateqoriyalarına, istər əməllərə uyğun gələn cəza dərəcələrinə, istərsə də hər ikisinə işarə edir. Bölünmənin arxasındakı hikmət, ədaləti hər bir canı aid olduğu yerə yerləşdirən Allaha məxsusdur.",
      "Əminliyin harada bitdiyini qeyd etmək vacibdir. Bəzi sonrakı əsərlər hər bir xüsusi qapını müəyyən bir günaha və ya qrupa təyin edir. Bu xüsusi tapşırıqlar ilkin mənbələrdə vahid şəkildə təsbit edilməmişdir, ona görə də onlar ən yaxşı şəkildə peyğəmbərlik kimi deyil, ayrı-ayrı alimlərin fikirləri kimi təqdim olunur.",
      "Səviyyələrdə olduğu kimi, darvazaların dərsi memarlıq deyil, əxlaqdır: Cəhənnəmə aparan çoxlu qapılar var və onların hamısından qorunmağın yolu eynidir - səmimi iman, böyük günahdan çəkinmək və sürüşəndə ​​tez tövbə etmək.",
    ],
    quran: [
      {
        excerpt:
          "Həqiqətən, Cəhənnəm onların hamısı üçün vəd edilmiş yerdir. Onun yeddi qapısı var; Hər bir qapı üçün bir hissə var.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Cahannamın təsvirləri",
    summary:
      "Yanğın, istilik, zəncir, təəssüf hissi - sensasiya ilə deyil, hörmətlə təqdim olunur.",
    body: [
      "Qur'an və mötəbər Sünnə Cəhənnəmi canlı, konkret dillə təsvir edir və onlar bunu bir səbəbə görə edirlər: insan qəlbi mücərrəd fikirlərdən daha çox təsvir edə biləcəyi şəkillərlə hərəkətə gəlir. Təsvirlər - şiddətli yanğın, dözülməz istilik, məhdud yemək və içki, zəncirlər, qaranlıq və dərin təəssüf - təhlükəni bizi ondan uzaqlaşdırmaq üçün kifayət qədər reallaşdırmaq üçün nəzərdə tutulub.",
      "Təriflər arasında içməyə verilən qaynar su, yemək kimi acı zəqqum ağacı, oddan biçilmiş paltarlar, bir zamanlar güvəndiyi hər rahatlıqdan ayrılıq var. Peyğəmbər (s) bu istiliyin bildiyimiz hər şeydən nə qədər üstün olduğunu çatdıraraq demişdir ki, bu dünyada yandırdığımız odun axirət odunun yetmiş hissəsinin ancaq bir hissəsidir (Səhih əl-Buxari 3265).",
      "Bu təsvirlər axirətin nəticəsini boşaldan məcaz deyil, həqiqi xəbərdarlıqdır. Sünni alimləri qeybin dəqiq modallığını Allahın elminə buraxaraq öz həqiqətlərini təsdiq edirlər; möminin vəzifəsi xəbərdarlığı parçalamaq deyil, ürəyinə almaqdır.",
      "Belə hissələri oxumağın bir etiketi (ədəb) var. Onlara təvazökarlıqla, Allah qorxusu ilə və dərhal tövbə edib sığınmaq üçün bir təkanla yanaşırlar - nə xəstə bir məftunluqla, nə də heç vaxt ümidsizliklə, çünki xəbərdarlığın bütün məqsədi ondan qaçmaq üçün hələ vaxtımızın olmasıdır.",
      "Bu təsvirlərdə bəlkə də ən ağır mövzu peşmançılıqdır. Fəaliyyət vaxtı artıq bağlandıqda 'Kaş ki...' deyiləcək. İndi bu peşmançılığı eşitməyin mərhəməti odur ki, biz bu gün \"əgər\" hərəkət edə bilərik, halbuki o hələ də sonumuzu dəyişə bilər.",
    ],
    quran: [
      {
        excerpt:
          "Onun önündə Cəhənnəm vardır və ona murdar su içiriləcəkdir. O, udacaq, amma çətinliklə udacaq.",
      },
      {
        excerpt: "Onlar üçün oddan paltarlar kəsiləcək və başlarına qaynar su töküləcək.",
      },
      {
        excerpt: "O gün Cəhənnəm dirildiləcək, o gün insan xatırlayacaq.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sənin atəşin cəhənnəm odunun yetmiş hissəsinin bir hissəsidir. Dedilər: Ya Rəsulullah, bu atəş kifayət edərdi. Buyurdu: Ona altmış doqquz hissənin gücü ondan daha çox verilmişdir, hər bir hissəsi onun istisi kimidir.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Kim Xəbərdardır?",
    summary: "Qur'an və Sünnədəki kateqoriyalar – fərdlər üzərində hökmlər deyil.",
    body: [
      "Diqqətlə oxuyan Qur'anın xəbərdarlığının adları çəkilən şəxslərə deyil, davranış və rəftarlara yönəldiyini görür. Haqq onlara bəlli olduqdan sonra küfrdə israr edənləri, imanı zahirdə inkar edərək, batinini inkar edən münafiqləri, başqalarının haqqını tapdalayan zalımları, təslim olmaqdan qürurlanan təkəbbürlüləri və heç vaxt tövbə etmədən küfrdə ölənləri xəbərdar edir.",
      "Şəxslərə deyil, kateqoriyalara diqqət yetirmək məqsədyönlü və mərhəmətlidir. Keçmişi nə olursa olsun, hər yaşayan insan üçün bir dönüş qapısı açıq qalır, çünki heç kimin faylı ölənə qədər bağlı deyil. Xəbərdarlıq yolu təsvir edir ki, hələ də oradan keçən hər kəs kənara çəkilə bilsin.",
      "Bu səbəbdən, İslam dini, Allah və ya Rəsulunun səhih vəhydə açıq şəkildə bildirdiyi nadir hallar istisna olmaqla, hər hansı bir konkret şəxsin son taleyini bəyan etməyə – “bu adam cəhənnəmdədir” deməyimizə icazə vermir. Qəlbləri və sonları hökm etmək ancaq Allaha məxsusdur. bizim vəzifəmiz öz hesabımızdır.",
      "Beləliklə, hər xəbərdarlığı oxumağın düzgün yolu onu içəri çevirməkdir: 'bu kimi təsvir edir?' lakin 'bunlardan hər hansı biri məni təsvir edirmi və mən bu gün nəyi dəyişəcəyəm?' Kim olursan ol, Allaha qayıtmaq dəvəti indi açıqdır və sabah heç kimə vəd edilməmişdir.",
    ],
    quran: [
      {
        excerpt: "Münafiqlər Cəhənnəmin ən aşağı qatında olacaqlar.",
      },
      {
        excerpt:
          "Kim günah qazanarsa və ona qərq olarsa, onlar əbədi qalacaqları Cəhənnəm əhlidirlər.",
      },
      {
        excerpt:
          "Allahın zalımların etdiklərindən xəbərsiz olduğunu sanma. O, onları ancaq gözlərin baxacağı günə qədər gecikdirir.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Böyük Günahlar",
    summary: "Kəbair — səmimi tövbə tələb edən böyük günahlar.",
    body: [
      "Alimlər günahları iki yerə bölürlər və fərqi dərk etmək həm ciddilik, həm də rahatlıq gətirir. Böyük günahlar (əl-kəbair) Allahın və ya Rəsulunun cəhənnəm qorxusu, lənət, Allahın qəzəbi və ya müəyyən edilmiş bir cəzaya şirk, adam öldürmə və sələm kimi xüsusi ağır bir nəticə verdikləridir. Kiçik günahlar (əs-səğəir) o həddən çatmayan kiçik günahlardır.",
      "Rahatlıq bu ikisinin münasibətindədir. Allah-təala vəd edir ki, mömin böyük günahlardan çəkinərsə, kiçik günahlar da adi ibadətlərlə silinər: “Əgər sizə qadağan olunmuş böyük günahlardan çəkinsəniz, kiçik günahlarınızı da sizdən sovuşdurarıq” (4:31). Namazla namaz, Cümə ilə Cümə, Ramazandan Ramazan aralarında olanı kəffarə edər, nə qədər ki, böyük günahlardan uzaq olunsun.",
      "Buna görə də böyük günahlar diqqətə layiqdir: onlar gündəlik ibadət zamanı sadəcə yuyulmur, həm də qəsdən, səmimi tövbəyə (tövbəyə) çağıran günahlardır. Geriyə dönmədən içəridə israrla, ruhu təhlükəyə atırlar; tərk edilmiş və tövbə etmişlər, bağışlanmışlar.",
      "Və bütün bunların üzərində üfüq budur: şirk üstündə ölmək istisna olmaqla, böyük və ya kiçik hər bir günah, istəsə, Allahın bağışlanması altına düşür. “Həqiqətən, Allah Ona şərik qoşmağı bağışlamaz, lakin ondan daha az günahı istədiyi kimsə üçün bağışlayar” (4:48). Heç bir mömin, böyük günahlarının onları mərhəmətdən üstün tutduğu qənaətinə gəlməməlidir.",
      "Bu moduldakı hər bir böyük günah mövzusu öz tərifini, sübutunu, nə üçün ağır olduğunu və tövbə və qaçmağın konkret yolunu verir - həmişə eyni açıq qapıda bitir.",
    ],
    quran: [
      {
        excerpt:
          "Əgər sizə qadağan olunmuş böyük günahlardan çəkinsəniz, kiçik günahlarınızı sizdən uzaqlaşdırar və sizi uca bir girişə daxil edərik.",
      },
      {
        excerpt:
          "Həqiqətən, Allah Özünə şərik qoşmağı bağışlamaz, lakin ondan daha az günahı istədiyi kimsə üçün bağışlayar.",
      },
      {
        excerpt:
          "O kəslər ki, böyük günahlardan və çirkin işlərdən çəkinər, ancaq kiçik günahlardan çəkinərlər. Həqiqətən, sənin Rəbbinin bağışlaması genişdir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Böyük günahların ən böyüyü: Allaha şərik qoşmaq, can öldürmək, ata-anaya asi olmaq, yalandan şahidlik etməkdir.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dilin Günahları",
    summary: "Qeybət, yalan, məsxərə - törətməsi asan və qaytarılması çətin olan günahlar.",
    body: [
      "Dil kiçikdir, amma nəticələri çox böyükdür; bir neçə sözlə insan inam yarada və ya reputasiyanı məhv edə, qəlbinə təsəlli verə və ya onu dərindən yaralaya bilər. Buna görə də Qur'an və Sünnə tez-tez söz günahlarına qayıdır: qeybət, böhtan, nağıl, yalan, istehza və yalan and içmək.",
      "Qeybət etmək, qardaşın və ya bacın haqqında onların bəyənmədiyi bir şeyi söyləmək deməkdir, hətta bu həqiqət olsa belə, çünki bu, yalan olsaydı, böhtandan daha böyük günah olardı. Qur'an onun ən təəccüblü surətlərindən birini verir: onu ölü qardaşının ətini yeməyə bənzədir (49:12). Bu şəkildə çərçivəyə salınan günah öz təsadüfiliyini itirir.",
      "Bu günahları bu qədər təhlükəli edən məhz onların nə qədər asan və adi olmasıdır. İnsanlar heç fikirləşmədən adi söhbətlərdə onların içinə girirlər, buna görə də Peyğəmbər (sallallahu aleyhi və səlləm) imanı qoruyan sözə bağladı: “Kim Allaha və axirət gününə inanırsa, ya yaxşı danışsın, ya da sussun”. Danışmazdan əvvəl sadə bir pauza əsl ibadətdir.",
      "Dilin günahından tövbə etmək adi şərtlərə uyğundur - dayanmaq, peşman olmaq, geri qayıtmamaq qərarına gəlmək - başqa bir insanın haqqına əlavə bir ölçü ilə. Onların adlarını təmizləmək və ya onlardan əfv istəmək daha böyük zərər vermədən həyata keçirilə bilərsə, bu, tövbənin bir hissəsidir; Onları xəbərdar etmək yalnız zərəri daha da artıracaqsa, alimlər onlar haqqında yaxşı danışmağı, onların yoxluğunda onları müdafiə etməyi və onların bağışlanması üçün dua etməyi məsləhət görürlər.",
    ],
    quran: [
      {
        excerpt:
          "Bir-birinizin qeybətini etməyin. Sizlərdən biriniz ölmüş qardaşının ətini yemək istəyərmi?",
      },
      {
        excerpt: "Vay halına hər istehza edən və istehza edən!",
      },
    ],
    hadith: [
      {
        excerpt: "Kim Allaha və axirət gününə inanırsa, ya xeyir danışsın, ya da sussun.",
      },
    ],
    actions: [
      "Danışmazdan əvvəl soruşun: doğrudurmu? Lazımdırmı? Bu mehribandır?",
      "Əgər kiminsə qeybətini etsəniz, onun üçün dua edin və imkan daxilində ondan bağışlanma diləyin.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Başqalarına qarşı günahlar",
    summary: "İnsanların haqqının qaytarılması tələb olunur - təkcə Allaha tövbə etmək deyil.",
    body: [
      "İslam bizim borcumuz olan haqqı iki yerə bölür: Allahın haqqı (hüquq Allah) və insanların haqqı (hüquq əl-ibad). Zülm, haqsızlıq, əmanəti qırmaq, ticarətdə fırıldaqçılıq, maaşı kəsmək, ödənilməmiş borclar, qohumluq əlaqələrini kəsmək bütün insanların haqqıdır ki, bunlar da axirətdə xüsusi əhəmiyyət kəsb edir.",
      "Səbəbi ayıq bir hədisdə göstərilmişdir. Həzrət Peyğəmbər (s) həqiqətən müflis olanı qiyamət gününə namaz, oruc və sədəqə ilə gəlib çatan, lakin təhqir etmiş, böhtan atmış, haqsız yerə mal almış və qan tökmüş şəxs kimi təsvir etmişdir. Qurbanları tükənənə qədər etdiyi yaxşılıqların əvəzini alır, sonra günahları onun üzərinə yüklənir və o, Cəhənnəmə atılır (Səhih Müslim 2581). İnsan ibadətlə zəngin ola bilər və yenə də başqaları ilə necə davrandığına görə məhv ola bilər.",
      "Bu, tövbə ilə bağlı mühüm bir dərs verir: Allaha üz tutmaq lazımdır, lakin insan hüququ pozulduqda, bu, öz-özünə kifayət etmir. Zülmə məruz qalan şəxsin iddiası həll olunana və ya bağışlanana qədər qalır. Beləliklə, burada tövbənin dayandırmaq, peşman olmaq və həll etməkdən başqa dördüncü şərti var - borcunu qaytarmaq.",
      "Praktikada bu, alınanı və ya onun dəyərini geri vermək, borcları hətta tədricən ödəmək, zədələnmiş reputasiyanı bərpa etmək və kəsilmiş qohumlarla barışmaq üçün əl uzatmaq deməkdir. Bunda da bir mərhəmət var: əvəzin hər bir addımının özü bir xeyirdir və Allah sındırdığını düzəltmək üçün yola çıxan səmimi qəlbi asanlaşdırır.",
    ],
    quran: [
      {
        excerpt: "Əgər ribadan əl çəkməsəniz, Allahdan və Onun Elçisindən müharibə xəbərini alın.",
      },
      {
        excerpt: "Allahın əhd-peymanını pozanlar və Onun əmr etdiyini kəsənlər birləşdilər.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Müflis olanın kim olduğunu bilirsinizmi? O kəs ki, namaz, oruc və zəkatla gəlib, amma təhqir edib, böhtan atıb, haram mal yeyib, qan töksə, onun yaxşı əməlləri başqalarına verilir.",
      },
    ],
    actions: [
      "Haqsızlıq etdiyiniz hər kəsi siyahıya alın və bu həftə təmirə doğru addım atın.",
      "Ödəməmiş borcları hətta kiçik hissələrlə ödəyin, əgər idarə edə bilərsiniz.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "ikiüzlülük",
    summary: "İnancda böyük ikiüzlülük və davranışda ikiüzlülük xüsusiyyətləri.",
    body: [
      "Alimlər iki cür riyanı ayırd edirlər və onları bir-birindən ayırmaq həm yalançı rahatlığın, həm də yalançı panikanın qarşısını alır. Birincisi, imanın böyük ikiüzlülüyü (nifaq etiqadi): İslamı zahirdə göstərmək, batində isə imanı inkar etmək. Bu, Qur'anın ən ciddi şəkildə xəbərdar etdiyi ikiüzlülükdür və belə insanları “cəhənnəm odunun ən aşağı diblərinə” qoyur (4:145), çünki onlar əslində maska ​​​​arxasında kafir kimi ölürdülər.",
      "İkincisi isə daha kiçik, rəftar nifaqıdır (nifaq 'amali): hətta imanı həqiqi olan adamda da münafiqlərin rəftarına oxşayan xüsusiyyətlər. Peyğəmbər (sallallahu aleyhi və səlləm) məşhur əlamətləri – “danışanda yalan danışır, vəd verdikdə onu yerinə yetirir, ona əmanət verildikdə isə xəyanət edir” – adlarını çəkmiş və başqa bir rəvayətdə ixtilafda çirkinlik də əlavə etmişdir. Bir mömin bunlara düşə bilər və yenə də mömin ola bilər, lakin bunlar ciddi bir xəbərdarlıqdır.",
      "Bu fərq bizim mövzudan necə istifadə etdiyimiz üçün çox vacibdir. Davranış əlamətləri başqalarına yapışdırmaq üçün etiket kimi deyil, özünə güzgü kimi verilir. Həzrət Peyğəmbər (s) və onun səhabələri özlərində ikiüzlülükdən qorxurdular, çünki qəlb gizlidir və dəyişə bilir.",
      "Deməli, sağlam cavab batinidir: öz dürüstlüyünü, vədə vəfasını, etibarını yoxlamaq və Allahdan ixlas istəmək. İnsanın içində olanları ancaq Allah bilir və müəyyən şəxsləri nifaqla ittiham etmək onlara qarşı böyük bir günahdır.",
    ],
    quran: [
      {
        excerpt: "Münafiqlər Cəhənnəmin ən aşağı qatında olacaqlar.",
      },
      {
        excerpt:
          "Münafiqlər sənin yanına gəldikləri zaman: “Şəhadət veririk ki, sən Allahın elçisisən, Allah onların yalançı olduqlarını bilir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Münafiqin əlaməti üçdür: danışanda yalan danışar, söz verdikdə vəfa edər, əmanət veriləndə xəyanət edər.",
      },
    ],
    disclaimer:
      "Şəxsləri nifaqda ittiham etməyin. Mətnlər cəmiyyəti xəbərdar edir; təmizlənmə özündən başlayır.",
  },
  {
    title: "Qeyd olunan cəzalar",
    summary: "Mətnlərdə təsvir olunanlar - Allah qorxusu və Onun rəhmətinə ümid edərək oxuyun.",
    body: [
      "Qur'an və Sünnə riba yeyənlər, iffətli qadınlara böhtan atanlar, sərvət yığıb haqqını kəsənlər, namazı tərk edənlər və böyük günahda israr edənlər üçün konkret günahların konkret nəticələrini qeyd edir. Spesifiklik aydınlıq formasıdır: bu, heç kimin etdikləri barədə xəbərdarlıq edilmədiyini söyləmək imkanı vermir.",
      "Bu nəticələrin bəziləri qəbirdə (əzhəb əl-qəbr), digərləri isə Cəhənnəmin özündə təsvir edilmişdir. Əsas sünni əqidəsi hər ikisinin reallığını təsdiq edir, eyni zamanda bu qeybi məsələlərin dəqiq “necə” olduğunu insanın təxəyyülünə deyil, Allahın elminə həvalə edir.",
      "Möminin bütün bunlarla necə məşğul olduğu önəmlidir. Məqsəd heç vaxt qrafik detallar üzərində dayanmaq və ya ürəyin batmasına imkan vermək deyil; bu, xəbərdarlığı qəbul etmək, tətbiq olunan hər şeydən tövbə etmək və sonra enerjini həqiqətən qoruyan əməllərə yönəltməkdir. Buna görə də bu modul qəsdən cəzadan daha çox müdafiə, tövbə və mərhəmətə yer verir.",
      "Bir sözlə, qeyd olunan hər hansı cəzadan düzgün çıxış qorxu deyil, sualdır: 'Mən bunu edirəmmi və əgər belədirsə, onu necə dayandırıb düzəldə bilərəm?' Bu gün vicdanla cavablandırılan xəbərdarlıq artıq öz mərhəmətli işini görüb.",
    ],
    quran: [
      {
        excerpt: "İffətli qadınları ittiham edib dörd şahid gətirməyənlərə səksən şallaq vurun.",
      },
      {
        excerpt:
          "Qızıl-gümüş yığıb Allah yolunda sərf etməyənləri ağrılı-acılı bir əzabla müjdələ.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Cəhənnəmdən qorunma",
    summary: "Tövhid, namaz, tövbə, sədəqə, Qur'an və dua – bu modulun ürəyidir.",
    body: [
      "Bütün xəbərdarlıqlardan sonra məsələnin mahiyyəti budur: Cəhənnəm insanın ondan qorunması nəzərdə tutulan bir şeydir və İslam bu qorunma vasitələri ilə doludur. Onların ən böyüyü sağlam tövhiddir - Ondan başqa heç bir şey olmadan yalnız Allaha ibadət etməkdir. Bütün digər əməllər yalnız bu təməl üzərində qəbul edilir və ölçü götürülür, ona görə də əqidəni qorumaq hər şeydən əvvəl gəlir.",
      "Bu təməl üzərində əməli sipərlər çoxdur və əlçatmazdır: beş vaxt namazı qılmaq, səmimi tövbə, sədəqə vermək - Peyğəmbərin (s) dediyi kimi, suyun odu söndürdüyü kimi günahı söndürür - oruc tutmaq, Qur'an oxumaq və ona əməl etmək, gözəl əxlaq, başqalarına qarşı mərhəmət, zikr etmək, zikr etmək, davamlı olmaq. Bunların heç biri böyük sərvət və ya bilik tələb etmir; onlar hər kəs üçün açıqdır.",
      "Peyğəmbər (s) Cəhənnəmdən sığınmaq üçün birbaşa duaları da öyrətdi və bizi tez-tez soruşmağa təşviq etdi. O demişdir ki, hər kim Allahdan üç dəfə Cənnəti diləsə, Cənnət özü onun daxil olması üçün dua edər, kim Cəhənnəmdən üç dəfə sığınarsa, Cəhənnəm özü ondan xilas olması üçün dua edər (Cami ət-Tirmizi 2572). Bu duaların namazda salamdan əvvəl, səhər və axşam zikrində xüsusi yeri vardır.",
      "Şəriətin vurduğu tarazlığa diqqət yetirin. Qorunma vasitələri məhvə səbəb olan səbəblərdən daha çox, daha çox vurğulanmış və daha əlçatandır - və bunun özü də Allahın rəhmət nişanəsidir. İtirməkdən xilas olmaq daha asandır.",
      "Bu bölmə qəsdən modulun ən böyüyüdür, çünki İslamın özü məsələni belə qiymətləndirir: xəbərdarlıq həmişə ümidlə birləşdirilir və heç vaxt konkret fəaliyyətdən ayrılmadan insan bu gün başlaya bilər.",
    ],
    quran: [
      {
        excerpt:
          "O kəslər ki: “Ey Rəbbimiz, biz iman gətirdik, günahlarımızı bağışla və bizi Cəhənnəm əzabından qoru!”",
      },
      {
        excerpt:
          "Ey Rəbbimiz, bizə dünyada da, axirətdə də yaxşılıq ver və bizi Cəhənnəm əzabından qoru!",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim Allahdan üç dəfə Cənnəti diləsə, Cənnət buyurur: İlahi, onu Cənnətə daxil et. Kim üç dəfə Cəhənnəmdən sığınarsa, Cəhənnəm deyir: İlahi, onu Cəhənnəmdən qoru.",
      },
    ],
    actions: [
      "Namazda salamdan əvvəl Cəhənnəmdən sığınmaq duasını əzbərləyin.",
      "Beş vaxt namazı vaxtında qıl - ən güclü qalxanlardan.",
      "Kiçik miqdarda da olsa, müntəzəm olaraq sədəqə verin.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Tövbə (tövbə)",
    summary: "Allah səmimi tövbəni qəbul edir - ölümdən əvvəl heç bir günah çox böyük deyil.",
    body: [
      "Tövbə – tövbə – Allahın dində yerləşdirdiyi mexanizmdir ki, heç bir günah daimi olmasın. Bunun mahiyyətində qəlbin Allaha tərəf dönməsidir və alimlər onun şərtlərini Qur'an və Sünnədən götürürlər: günahı səmimiyyətlə dayandırın, ona görə səmimi peşmançılıq hissi keçirin və bir daha geri qayıtmayacağına qəti qərar verin. Günah başqa bir şəxsin haqqına aid olduqda, dördüncü şərt əlavə olunur - bu hüququ bərpa etmək və ya onun bağışlanmasını istəmək.",
      "Tövbəni bu qədər ümidverici edən, Allahın onu qəbul etmə tərzidir. O, sadəcə olaraq geri qayıdan xidmətçiyə dözmür; Sevinir. Peyğəmbər (sallallahu aleyhi və səlləm) buyurmuşdur ki, Allah Öz qulunun tövbəsinə bütün azuqələri ilə birlikdə minəsini boş bir səhrada itirmiş və ümidini kəsmiş, qəfil onun qarşısında dayandığını görən adamdan daha çox sevinər (Səhih əl-Buxari 6309). Bu, geri dönən hər kəsi gözləyən xoş qarşılanmadır.",
      "Üstəlik, onun qapısı ömür boyu bağlanmır. Peyğəmbər (sallallahu aleyhi və səlləm) buyurmuşdur ki, Allah gecə əlini gündüzün günahkarının tövbəsini qəbul etmək üçün, gündüz isə gecənin günahkarının tövbəsini qəbul etmək üçün uzatır (Səhih Müslim 2759). Tövbə fərd üçün ruhu ölüm anında boğaza çatana qədər, bəşəriyyət üçün isə günəş qərbdən çıxana qədər qəbul edilir - ona görə də onu gecikdirmək üçün heç vaxt səbəb yoxdur.",
      "Bu, hətta dəfələrlə yıxılıb tövbə edənə də aiddir. Dönüş hər dəfə səmimi olduğu müddətcə Allah qəbul edər; ümidsizlik şeytandandır, dindən deyil. Ölümdən əvvəl həll edilməli olan bir şey şirkdir, çünki ölümlə vəfat edən insan tövbənin tələb etdiyi iman olmadan ölür - məhz buna görə də bütünlüklə yalnız Allaha yönəlmək ən təcili dönüşdür.",
      "Praktik çıxış sadədir: indi tövbə edin, tez-tez tövbə edin və heç vaxt günahın ölçüsünə və ya keçmişin sayına görə geri qayıtmağınız barədə mübahisə etməyin. Dəvət həmişə açıqdır.",
    ],
    quran: [
      {
        excerpt:
          "Allahın rəhmətindən ümidinizi kəsməyin. Həqiqətən, Allah bütün günahları bağışlayar. O, Bağışlayandır, Rəhmlidir.",
      },
      {
        excerpt:
          "Tövbə edib iman gətirib yaxşı işlər görənlərdən başqa, Allah onların pisliklərini yaxşılıqla əvəz edər.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah Öz bəndəsinin tövbəsini sizlərdən biriniz itmiş dağını boş bir yerdə tapandan daha çox sevindirir.",
      },
      {
        excerpt:
          "Allah gecə öz əlini gündüzün günahkarının tövbəsini qəbul etmək üçün, gündüz isə gecənin günahkarının tövbəsini qəbul etmək üçün günəş qərbindən çıxana qədər uzadır.",
      },
    ],
    actions: [
      "Gün ərzində Əstəğfirullah deyin - yalnız böyük sürüşmələrdən sonra deyil, ardıcıllığı hədəfləyin.",
      "Seyyid əl-İstiqfarı öyrən və səhər-axşam oxu.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Allahın Rəhmətinə Ümid",
    summary: "Heç vaxt ümidsiz olmayın - yaxşı əməllər günahları silir; ardıcıllıq vacibdir.",
    body: [
      "Bu moduldakı hər şey bura işarə edir. Allah ər-Rəhman ər-Rəhimdir, rəhmlidir və O, bizə mərhəmətinin qəzəbindən üstün olduğunu və “hər şeyi əhatə etdiyini” bildirmişdir (7:156). Mömin quşun iki qanadı kimi ümidlə qorxu arasında yaşamaq üçün nəzərdə tutulub: ayıq qalmaq üçün günahdan kifayət qədər qorxan, heç vaxt təslim olmayacaq qədər bağışlanma ümidli.",
      "Buna görə də ümidsizliyin özü yersizdir. İnsan nə qədər azdığını hiss etsə də, arxa qapı açıqdır və artıq gec olduğunu pıçıldayan Allah deyil, şeytandır. Rəhmətdən ümidini kəsmək Rəhman haqqında çox az düşünməkdir; səmimi qəlbin işi sadəcə geri qayıtmaqdır.",
      "Sünni inancının Odla bağlı böyük rahatlığı da buradadır. Küfr üstündə ölənlər üçün Cəhənnəm əbədi yurddur. Amma Allahı təsdiq edərək ölən mömin, böyük günahlarla ağırlaşsa belə, orada əbədi qalmaz. Peyğəmbər (sallallahu aleyhi və səlləm) öyrətdi ki, insanlar şəfaətlə Cəhənnəmdən çıxarılacaq, sonra isə Allahın öz rəhməti ilə Cənnətin kənarındakı Həyat çayına atılacaq, orada bərpa olunacaq və oraya daxil olacaqlar (Səhih əl-Buxari 7439). Qəlbində xardal dənəsi ağırlığında iman olan heç kəs Cəhənnəmdə qalmaz dedi (Səhih Müslim 183). Buna görə də, monoteist üçün, Od - ümumiyyətlə daxil olarsa - heç vaxt hekayənin sonu deyil.",
      "Bu arada, mərhəmət gündəlik həyatda qurulur: yaxşı əməllər pisləri silir (11:114), kiçik, ardıcıl ibadət - vaxtında qılınan bir namaz, bir sakit sədəqə, Allah rizası üçün edilən bir anlıq səbir - insanı davamlı olaraq Ona yaxınlaşdırır və zərərdən uzaqlaşdırır. Ardıcıllıq intensivlikdən daha vacibdir.",
      "Beləliklə, tədqiqatınızın nəticəsi budur: xəbərdarlığı ciddi qəbul edin, amma ümid qorxudan daha güclü olsun. Təhlükəni bilin, mərhəmət yolunu seçin və Allahla görüşənə qədər hər gün addım-addım get.",
    ],
    quran: [
      {
        excerpt: "Mənim rəhmətim hər şeyi əhatə edir.",
      },
      {
        excerpt:
          "De: “Ey Mənim özlərinə zülm edən qullarım, Allahın rəhmətindən ümidinizi kəsməyin. Həqiqətən, Allah bütün günahları bağışlayar.",
      },
      {
        excerpt:
          "Həqiqətən, yaxşı əməllər pislikləri aradan qaldırar. Bu, xatırlayanlar üçün bir öyüd-nəsihətdir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah buyuracaq: Mələklər şəfaət etmişlər, peyğəmbərlər şəfaət etmişlər, möminlər də şəfaət etmişlər və Rəhmanların Rəhmindən başqa heç kəs qalar. O, Cəhənnəmdən bir ovuc götürəcək və heç bir yaxşılıq etməyən insanları çıxaracaq.",
      },
      {
        excerpt: "Qəlbində xardal dənəsi ağırlığında iman olan kəs Cəhənnəmdən çıxarılar.",
      },
    ],
    actions: [
      "Hər günü istiğfar və hər nemətə şükürlə bitir.",
      "Bu modulu Cənnətə Səyahət ilə birləşdirin - xəbərdarlıq və birlikdə ümid edin.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Məhv edən günahlar",
    summary: "Yeddi məhv edən günah, ən ağır günahlar və əməlləri yox edən zülm.",
    body: [
      "Qur'an və Sünnə günahların ağırlığını xəbərdarlıq dili ilə bildirir; bu, tərəzidə sıralama deyil.",
      "Peyğəmbər ﷺ yeddi məhv edən günahdan çəkinməyi əmr etmişdir.",
      "İnsanların haqqını tapdalayan kəs yaxşı əməllərini zərərçəkənlərə verə bilər.",
      "Allahın rəhmətindən ümid kəsməyin; tövbə qapısı ölümə qədər açıqdır.",
      "Şirkdən tövbəsiz ölmək istisna olmaqla, Allah istədiyini bağışlayar.",
    ],
    destructiveItems: [
      {
        title: "Şirk",
        summary: "Allaha şərik qoşmaq ən böyük günahdır.",
      },
      {
        title: "Sehr",
        summary: "Sehrlə məşğul olmaq məhv edən günahlardandır.",
      },
      {
        title: "Haqqsız öldürmək",
        summary: "Allahın haram etdiyi canı haqsız almaq.",
      },
      {
        title: "Riba yemək",
        summary: "Faiz və sələm ağır, məhv edən günahdır.",
      },
      {
        title: "Yetimin malını yemək",
        summary: "Yetimin malını haqsızlıqla mənimsəmək.",
      },
      {
        title: "Döyüşdən qaçmaq",
        summary: "Ordu irəliləyərkən geri dönmək.",
      },
      {
        title: "İffətli mömin qadınlara böhtan",
        summary: "İffətli qadınları zinada günahlandırmaq.",
      },
      {
        title: "Müflis insan",
        summary: "Başqalarının haqqı üçün savabları əlindən alınan kəs.",
      },
    ],
    quran: [
      {
        excerpt: "Allahın rəhmətindən ümid kəsməyin; tövbə qapısı ölümə qədər açıqdır.",
      },
      {
        excerpt: "Şirkdən tövbəsiz ölmək istisna olmaqla, Allah istədiyini bağışlayar.",
      },
      {
        excerpt: "Peyğəmbər ﷺ yeddi məhv edən günahdan çəkinməyi əmr etmişdir.",
      },
    ],
    hadith: [
      {
        excerpt: "Peyğəmbər ﷺ yeddi məhv edən günahdan çəkinməyi əmr etmişdir.",
      },
      {
        excerpt: "İnsanların haqqını tapdalayan kəs yaxşı əməllərini zərərçəkənlərə verə bilər.",
      },
      {
        excerpt: "Şirk",
      },
      {
        excerpt: "Haqqsız öldürmək",
      },
      {
        excerpt: "Başqalarının haqqı üçün savabları əlindən alınan kəs.",
      },
    ],
    actions: [
      "Peyğəmbər ﷺ yeddi məhv edən günahdan çəkinməyi əmr etmişdir.",
      "İnsanların haqqını tapdalayan kəs yaxşı əməllərini zərərçəkənlərə verə bilər.",
      "Allahın rəhmətindən ümid kəsməyin; tövbə qapısı ölümə qədər açıqdır.",
    ],
    appLinks: [
      {
        label: "Məhv edən günahlar",
      },
      {
        label: "Tərəzidə ağır olanlar",
      },
      {
        label: "Ağır tərəziyə hazırlıq",
      },
      {
        label: "Doğruluq",
      },
    ],
  },
];

export const JAHANNAM_MAJOR_SIN_TOPICS_AZ: DeepPartial<JahannamTopic>[] = [
  {
    title: "Şirk",
    summary: "Allaha şərik qoşmaq – onun üzərində ölən bir günah bağışlanmaz.",
    body: [
      "Tərif: Şirk Allaha şərik qoşmaqdır - yalnız Ona məxsus olan hər hansı bir işi (ibadət, son sevgi, qorxu, ümid, təvəkkül və ya qanun çıxarma haqqı) Ondan başqa bir şeyə və ya başqasına yönəltməkdir. Bu, tövhidin tam əksidir və o, yaradılışın var olduğu məqsədə dəlalət edir: yalnız Allaha ibadət etmək.",
      "Nə üçün bu, bütün günahların ən ağırıdır: bütün digər günahlar həqiqi Rəbbi tanıyarkən edilən səhvdir, lakin şirk birbaşa Ona qarşı edilən səhvdir - yaradılışı Yaradanla səhv salmaq. Buna görə də Qur'an bunu “böyük zülm” adlandırır (31:13). Bir günah odur ki, əgər insan tövbə etmədən ölərsə, bağışlanmaz: “Həqiqətən, Allah Ona şərik qoşmağı bağışlamaz, lakin ondan daha azını istədiyi kimsə üçün bağışlayar” (4:48). Bu şiddətdə belə gizlənən mərhəmət, şirkdən başqa hər şeyin Allahın bağışlaması altında qalmasıdır.",
      "Onun formaları: alimlər böyük şirki ayırırlar - bütlərə, ölülərə, övliyalara və ya yaradılmışlara ibadət etmək; yalnız Onun verə biləcəyi şeylər üçün Allahdan başqasına dua etmək; və qurban kəsmək və ya nəzir etmək Ondan başqasına yönəldilir. İbadətdə (riyada) özünü göstərmək, Allahdan qeyrisinə and içmək, əlamət və cazibəyə arxalanmaq kimi kiçik və gizli şirk də vardır ki, bu da böyük günahdır, lakin öz-özünə dindən çıxarmaz.",
      "Ondan uzaq olan yol: tövhidi öyrənməklə, yalnız Allaha ibadət etməklə və niyyəti pak etməklə qoruyun və möhkəmləndirin ki, əməllər insanların gözü üçün deyil, Onun üçün olsun. Kim şirkə düşmüşdürsə, onu səmimi qəlbdən tərk edərək, yalnız Allaha ibadətə qayıtmaqla tövbə edər və bu dönüş qapısı sağ olduğu müddətcə açıq qalır.",
    ],
    quran: [
      {
        excerpt:
          "Həqiqətən, Allah Özünə şərik qoşmağı bağışlamaz, lakin ondan daha az günahı istədiyi kimsə üçün bağışlayar.",
      },
      {
        excerpt:
          "Ey oğlum, Allaha heç bir şeyi şərik qoşma. Həqiqətən də, birləşmək böyük zülmdür.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Böyük günahların ən böyüyü: Allaha şərik qoşmaq, can öldürmək, ata-anaya asi olmaq, yalandan şahidlik etməkdir.",
      },
    ],
    actions: [
      "Əqidə və Allahın 99 adını öyrənərək tövhidi öyrənin.",
      "İbadətdə niyyətləri təmizləyin - hər gün Allahdan səmimiyyət istəyin.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qətl",
    summary: "Günahsız insan həyatına qanunsuz qəsd etmək - ən ağır pozuntular arasında.",
    body: [
      "Tərif: Burada adam öldürmək Allahın haram buyurduğu canı haram, bilərəkdən almaq deməkdir. İslam qanuni halları - məsələn, müvafiq orqan tərəfindən həyata keçirilən qanuni qisasları (qanuni qisas) tanıyır, lakin günahsız bir insanın haqlı səbəb xaricində öldürülməsi ən ağır cinayətlərdən biridir.",
      "Niyə bu qədər ağırdır: Qur'an bircə haqsız qətli bütün bəşəriyyətin tərəzisində çəkir: “Kim bir canı öldürsə... sanki bütün insanları öldürmüşdür” (5:32), çünki bir canı məhv etmək hər bir canlını qoruyan müqəddəsliyi pozmaq deməkdir. Qətl Adəm övladı arasında edilən ilk günah idi və vəhy axirətin məhvedicisi kimi ona təkrar-təkrar qayıdır.",
      "İkiqat haqsızlıq: adam öldürmək eyni zamanda həyatın müqəddəsliyi üzərində haqqı tapdalanan Allaha qarşı günahdır, həm də insanlara – qurbana və onların qoyub getdiyi insanlara qarşı günahdır. Məhz buna görə də onun tövbəsi əksəriyyətdən daha ağırdır: Allaha üz tutmaq lazımdır, lakin zülmə məruz qalanın haqqı da dayanır və ölkə qanunları və ya İslam şəriətinin qan pulu (diyah) və ya digər nəticələri nəzərdə tutduğu yerdə, bunlar lazımi kanallar və ixtisaslı alimlər vasitəsilə qarşılanmalıdır.",
      "Ondan uzaqlaşan yol: hər həyatı müqəddəs tutun, qəzəb və düşmənçiliyi sərtləşmədən aradan qaldırın və mübahisələri zorakılıqla deyil, səbir və ədalətlə həll edin. İnsanlara qarşı edilən bu ən böyük cinayət belə, səmimi şəkildə tövbə edən, haqqını bacardığı qədər yerinə yetirən və bir daha belə bir yola qayıtmayan üçün Allahın rəhmətindən kənar deyildir.",
    ],
    quran: [
      {
        excerpt:
          "Kim bir cana və ya yer üzündə fitnə-fəsad törətməkdən başqa, bir canı öldürərsə, bütün insanları öldürmüş kimidir.",
      },
      {
        excerpt: "Kim bir mömini qəsdən öldürərsə, onun cəzası içində əbədi qalacağı Cəhənnəmdir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Böyük günahların ən böyüyü: Allaha şərik qoşmaq, can öldürmək, ata-anaya asi olmaq, yalandan şahidlik etməkdir.",
      },
    ],
    actions: ["Hər həyata dəyər verin; mübahisələri səbir və ədalətlə həll edin."],
    appLinks: [{}],
  },
  {
    title: "Zina",
    summary: "Qanunsuz cinsi əlaqə ruha və cəmiyyətə qarşı dağıdıcı bir günahdır.",
    body: [
      "Tərif: Zina həm əxlaqsızlığı (evli olmayanlar arasında), həm də zinanı (evli şəxslə) əhatə edən etibarlı nikahdan kənar hər hansı qeyri-qanuni cinsi əlaqədir. İslam bunu şəxsi məsələ kimi deyil, geniş zərərli pozuntu kimi qəbul edir.",
      "Niyə ağırdır: zina sağlam cəmiyyətin üzərində qurulan şeyləri – nəsli, ər-arvad arasında inamı, övladların təhlükəsizliyini və insanı şərəfləndirən iffəti korlayır. Qur'anın təfsiri özü də ibrətamizdir: o, nəinki əməli qadağan etmir, həm də ona “yaxınlaşma” deyir (17:32), ona doğru aparan baxışlardan, gizlilikdən və addımlardan xəbərdar edir. O yanaşmanın qadağan edilməsi rəhmətdir, çünki o, insanı vəsvəsə ağırlaşmadan qoruyur.",
      "Maneələrdəki hikmət: İslam insanları ehtirasla zirvədə mübarizə aparmağa buraxmaqdansa, onları daha əvvəlki müdafiələrlə əhatə edir - baxışları aşağı salmaq, geyim və davranışda təvazökarlıq, əks cinslə təcriddən çəkinmək və bu ehtiyaclar üçün nikahı qanuni, şərəfli kanal kimi təşviq etmək. Bu sərhədləri əvvəlcədən qurmaq kənarda müqavimət göstərməkdən daha asandır.",
      "Geriyə yol: yıxılan hər kəs üçün çıxış yolu səmimi tövbədir - günahı tamamilə tərk etmək, peşman olmaq, bir daha qayıtmayacağına qərar vermək və keçmişini ictimailəşdirməkdənsə, ört-basdır etməkdir. Zina böyük günahlardandır, lakin bu, Allahın tövbə edənin bağışladığı günahlardan biridir. ümidsizliyə yer yoxdur və yeni başlanğıc həmişə mövcuddur.",
    ],
    quran: [
      {
        excerpt: "Qanunsuz cinsi əlaqəyə yaxınlaşmayın. Həqiqətən, bu, əxlaqsız və pis bir yoldur.",
      },
      {
        excerpt:
          "Tövbə edib iman gətirən və yaxşı işlər görənlərdən başqa, haram cinsi yaxınlıq etməyənlərin isə Allah onların pisliklərini yaxşılıqla əvəz edər.",
      },
    ],
    actions: [
      "Gözləri və sosial media istehlakını qoruyun.",
      "Əgər evli deyilsə, saleh həyat yoldaşı üçün dua edin.",
    ],
    appLinks: [{}],
  },
  {
    title: "Riba",
    summary: "Faiz və sələm – Quranda onun əməl sahiblərinə qarşı elan edilmiş müharibə.",
    body: [
      "Tərif: Riba müəyyən maliyyə əməliyyatlarının qeyri-qanuni artımıdır – ən çox tanış olduğu kimi kreditlər üzrə hesablanmış və ya ödənilən faizlər, eyni zamanda oxşar malların xüsusi qeyri-bərabər və ya təxirə salınmış mübadiləsi də daxildir. Onun mahiyyəti başqasının hesabına həqiqi dəyər və risk olmadan sərvət əldə etməkdir.",
      "Niyə fövqəladə ağırdır: Qur'anın ona qarşı işlətdiyi dildə riba maliyyə günahları arasında unikaldır. Allah Özündən və Rəsulundan (sallallahu aleyhi və səlləm) bunda israr edənlərə müharibə elan edir (2:279) - başqa heç bir günahı olmayan bir ifadədir - çünki riba ehtiyacdan istifadə edir, sərvəti az adamın əlində cəmləşdirir və iqtisadiyyatın daşıyacağı mərhəməti boşa çıxarır. Peyğəmbər (sallallahu aleyhi və səlləm) bu işdə hər cür rəftardan çəkindirdi.",
      "Hikmət və mərhəmət: qadağa insanları real ticarətə, ortaq riskə və xeyriyyəçiliyə yönləndirir və zəifləri borcun əzilməsindən qoruyur. Baxmayaraq ki, burada da Allahın rəhməti var: Əmr gəldikdə, keçmiş faizlərin geri qaytarılmasını tələb etmədi, sadəcə olaraq, möminlərə qalanı tərk etmələrini söylədi - “əsas sizindir” (2:279) - ondan üz döndərənlər üçün bir asanlıqdır.",
      "Ondan uzaq olan yol: faizə əsaslanan məhsullar üçün maliyyənizi yoxlayın, halal alternativlər axtarın və qeyri-müsəlman ölkələrində ipoteka kimi həqiqətən çətin işlərdə ixtisaslı alimlərlə məsləhətləşin. Ribadan çıxmaq çətin maliyyə seçimləri demək ola bilər, lakin ruhun təhlükəsizliyi hər hansı müvəqqəti qazancdan üstündür - və Allah Ondan qorxanı gözləmədiyi yerdən təmin edəcəyini vəd edir.",
    ],
    quran: [
      {
        excerpt:
          "Ey iman gətirənlər, əgər möminsinizsə, Allahdan qorxun və ribadan qalanı tərk edin. Əgər bunu etməsəniz, Allah və Onun Elçisindən bir müharibə xəbəri alın. Əgər tövbə etsən, sənin əsas borcun ola bilər - nə sən zülm edirsən, nə də sənə zülm edirlər.",
      },
      {
        excerpt: "Allah faizi yox edər, sədəqələri artırar.",
      },
    ],
    actions: [
      "Faiz əsaslı məhsullar üçün maliyyə auditi.",
      "İpoteka və borclar üçün ixtisaslı alimlə məsləhətləşin.",
    ],
    appLinks: [{}],
  },
  {
    title: "Yalan Şəhadət",
    summary: "And altında yatmaq və ya yalançı şahidlik etmək - ədaləti məhv edir.",
    body: [
      "Tərif: Yalan şahidlik (şəhadət əz-zur) həqiqətə uyğun olmayan bir şeyə şəhadət verməkdir - daha geniş şəkildə desək, and içmək, iftiralar uydurmaq və ya ədalət ondan asılı olduqda doğru şəhadəti gizlətməkdir.",
      "Niyə ağırdır: o, ədaləti təmin edən aləti korlayır. Tək bir yalançı şahid günahsız bir insanı məhv etməyə, əmlakının qanuni sahibini soyunmağa və ya zülm edəni azad etməyə göndərə bilər - beləliklə, yalan heç vaxt yalançıya bağlanmaz; real insanları və bütün ədalət nizamını yaralayır. Peyğəmbər (s) bunu ən böyük günahlardan saymış və bir rəvayətdə ona qarşı xəbərdarlıqları təkrar etməkdə israrlı olmuşdur ki, səhabələri ondan narahat olduqları üçün ondan əl çəkməyi arzu etmişlər.",
      "Onun dillə əlaqəsi: yalan şəhadət nitqin daha geniş günahlarının ən kəskin kənarıdır. Sözlər ucuz olduğu üçün, bu günahın altına düşmək çox təhlükəlidir - imza, mübaliğə, rahat sükut - və buna baxmayaraq, insanların üzvlərinin və dilinin onlara qarşı doğru şəhadət verəcəyi Qiyamət günündə onun ağırlığı çox böyükdür.",
      "Ondan uzaqlaşan yol: baha başa gələn və ya öz mənafeyinə zidd olsa belə, haqqa sarıl, yalana söz verməkdən boyun qaçır, lazım gəldikdə ədalətli şəhadətlə danış. Yalançı şahidlik edən şəxs, mümkün olduğu qədər yalandan əl çəkərək, zülmə məruz qalanın zərərini aradan qaldırmağa və haqqını bərpa etməyə çalışaraq və səmimi peşmançılıqla Allaha üz tutaraq tövbə edər.",
    ],
    quran: [
      {
        excerpt:
          "O kəslər ki, yalana şəhadət verməzlər və pis sözə yaxınlaşdıqda ləyaqətlə keçərlər.",
      },
      {
        excerpt: "Ona görə də bütlərin murdarlığından çəkinin və yalan danışmaqdan çəkinin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sizə böyük günahların ən böyüyü barədə xəbər verimmi? Allaha şərik qoşmaq, ata-anaya asi olmaq, yalançı şahidlik etmək və yalandan şahidlik etmək.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Sehrbazlıq",
    summary: "Sehr, sehrbaz axtarma və gizli əməllər - əsas formalarda küfr.",
    body: [
      "Tərif: Sihr (sehr və ya sehr) insanlara və ya hadisələrə təsir etmək üçün qadağan olunmuş vasitələrdən istifadədir - çox vaxt şeytanlara güvənmək və ya qeyb üzərində hakimiyyət iddiasını ehtiva edir. Onu tətbiq etmək, öyrənmək, başqalarından axtarmaq və bunu iddia edənlərə inanmaq bu günahın altına düşür.",
      "Niyə bu qədər ağırdır: Şeytanlara yaxınlaşmaq və ya Qur'anı alçaltmaq kimi küfr əməlləri olmadan sihrin çoxu yerinə yetirilə bilməz, buna görə də Qur'an öz elmini küfrə bağlayır. Süleymanın zamanında öyrənilən sehrdən danışarkən Allah, şeytanların və o iki mələyin bunu yalnız imtahan üçün öyrətdiyini və “kafir olmayın” (2:102) xəbərdarlığı kimi deyir. Kreedal təhlükədən başqa, sihr real insanlara zərər verir - həyat yoldaşları arasında parçalanma səpmək, qorxu yaymaq və ümidsizləri istismar etmək.",
      "Əlaqədar əməllər: eyni xəbərdarlıq fal baxmağa, astrologiyaya qeyb haqqında müəyyən bilik kimi yanaşmağa və şirk daşıyan amulet və cazibələrə aiddir. Gizli gələcəyə dair elmin yalnız Allaha məxsus olduğunu iddia etmək, onu iddia edənlərə müraciət etmək isə tövhidi kökündən sarsıdar.",
      "Ondan uzaqlaşmanın yolu: Bu əməllərə qapılan şəxs üçün tövbə onları tamamilə tərk etmək, haram olan hər şeyi məhv etmək, onlarla məşğul olanlarla əlaqəni kəsmək, səmimi tövhidi təzələmək və yalnız Allaha təvəkkül etmək deməkdir. Himayə imanda, gündəlik zikrdə və Allaha sığınmaqdadır və Onun bağışlaması hər kəsə açıqdır.",
    ],
    quran: [
      {
        excerpt:
          "Süleymanın padşahlığı dövründə şeytanların oxuduqlarına tabe oldular... Onlara zərər verəni də, faydası olmayanı da öyrənirlər.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim falçının yanına gəlib onun dediklərinə inanarsa, Məhəmmədə nazil olanı inkar etmişdir.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Yetim sərvətini istehlak etmək",
    summary: "Yetimlərin malını haqsız yerə almaq və ya israf etmək.",
    body: [
      "Tərif: Bu günah yetimlərin - atasını itirmiş və öz mənafeyini qoruya bilməyən uşaqların malını ələ keçirmək, israf etmək və ya sui-istifadə etməkdir. Vəli onların sərvətlərini əmanət kimi saxlayır, heç vaxt sahib kimi.",
      "Niyə ağırdır: özündə iki səhvi birləşdirir - müqəddəs əmanətə xəyanət və ən müdafiəsizlərin zülmü. Qur'anın təsviri şiddətlidir: yetimlərin malını haqsız yerə yeyənlər “qarınlarına ancaq od yeyərlər” (4:10), tamahkarlıq anını özlərinin əzabına çevirərlər. Onların sözünü deyəcək kimsəsi olmayanı istismar etmək ədalətsizliyin ən çirkin formalarından biridir, buna görə xəbərdarlıq bu qədər kəskindir - və qəyyumları ondan uzaqlaşdırmaqda kəskin, mərhəmətlidir.",
      "Buraya nə daxildir: təkcə açıq-aşkar oğurluq deyil, daha incə formalar - xətti bulandırmaq üçün yetimin əmlakını öz mülkü ilə qarışdırmaq, yetim yetkinlik yaşına çatdıqdan sonra onun qaytarılmasını gecikdirmək və ya haqsız yerə investisiya qoymaq və ya xərcləmək. Allah bunun əksini buyurur: “Yetimlərin mallarını verin, pisi yaxşıya dəyişməyin” (4:2).",
      "Ondan uzaqlaşan yol: yetimlərin malını diqqətlə qoruyun, onları ayrı-ayrılıqda və hesaba alın, həddi-büluğa çatdıqda tam şəkildə təhvil verin və əskik olan kəs üçün borcunu artırıb qaytararaq tövbə edin və zülmə məruz qalanların bağışlanmasını diləyin. Sağlam qəlbdən başqa heç bir sərvətin və nəslin kömək etməyəcəyi gündə belə bir əmanəti bərpa etməyin özü dəyərli bir əməldir.",
    ],
    quran: [
      {
        excerpt: "Yetimlərin malını haqsız yerə yeyənlər qarınlarını ancaq od yeyərlər.",
      },
      {
        excerpt:
          "Yetimlərin mallarını verin, pisi yaxşıya dəyişməyin və mallarınızla onların mallarını yeməyin.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Valideynlərə itaətsizlik",
    summary: "Uquq — şirkdən sonra böyük günahlardan.",
    body: [
      "Tərif: “Uququl-vəlideyn” ata-anaya qarşı böyük itaətsizlik və pis rəftar – onlara əziyyət vermək, onlara nifrət etmək, ehtiyac içində onlara etinasız yanaşmaq və ya söz və ya əməllə yaralamaqdır. İslamın buyurduğu mərhəmətin birrül-vəlidəyninin əksidir.",
      "Niyə bu qədər ağırdır: Allah ayə ardınca Ona ibadət etməyi əmri ata-anaya yaxşılıq əmri ilə qoşalaşdırır, məsələn, “Allaha ibadət edin... və ata-anaya yaxşılıq edin” (4:36) – onların haqqını dərhal Özündən sonra qoyur. Valideynlər, Allahdan sonra insanın varlığının və tərbiyəsinin ən yaxın qaynağıdır, ona görə də onlara qarşı nankorluq dərin bir nankorluq növüdür. Peyğəmbər onların pis rəftarını şirkdən sonra ən böyük günahlardan saydı.",
      "Əhəmiyyətli bir tarazlıq: nəzakətlilik Allaha asi olaraq ata-anaya itaət etmək demək deyil - heç bir məxluq Yaradana qarşı günahda itaət olunmaz. Ancaq imtina etməli olduğu yerdə belə, mülayimliklə, hörmətlə və davamlı xeyirxahlıqla edilir. Qur'an ən kiçik qəzəbli kəlməni belə qadağan edir: “Onlara uf demə” (17:23).",
      "Qayıdış yolu: burada mərhəmət odur ki, valideynlər adətən hələ də əlçatandırlar. Natamam olan bir şəxs üçün tövbə daha çox əməli işdir - xeyirxahlığı davam etdirin, onlardan bağışlanma diləyin, onlara xidmət edin və xüsusilə sağ ikən onlar üçün dua edin. Valideynlərdən biri vəfat edibsə, onlar üçün dua etmək, onların adından sədəqə vermək, rəfiqələrinə və dostlarına hörmət etmək kimi əməllər davam edir.",
    ],
    quran: [
      {
        excerpt:
          "Rəbbin yalnız Ona ibadət etməyi və ata-ana ilə yaxşı rəftar etməyi əmr etmişdir. Onlara “uf” demə, onları dəf etmə, onlara gözəl söz söylə.",
      },
      {
        excerpt: "Allaha ibadət edin, Ona heç bir şeyi şərik qoşmayın və ata-anaya yaxşılıq edin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sizə böyük günahların ən böyüyü barədə xəbər verimmi? Allaha şərik qoşmaq, ata-anaya asi olmaq.",
      },
    ],
    actions: ["Bu həftə valideynlərə xoş sözlə zəng edin və ya ziyarət edin."],
    appLinks: [{}],
  },
  {
    title: "Oğurluq",
    summary:
      "Başqalarının əmlakını qanunsuz olaraq ələ keçirmək - etibarı pozur və cəzaya dəvət edir.",
    body: [
      "Tərif: Oğurluq (sariqət) başqalarının malını və ya malını haqsız olaraq - istər gizli, mənimsəmə, fırıldaqçılıq və ya heç bir iddiası olmayan hər hansı bir gizli ələ keçirmə yolu ilə ələ keçirməkdir.",
      "Niyə ağırdır: həm insanların hüquqlarını, həm də ictimai həyatın asılı olduğu inamı pozur. Onun ciddiliyi, Qurani Kərimdə əsaslandırılmış işlər üçün nəzərdə tutulan cəza ilə vurğulanır (5:38) – ciddi şərtlər və yüksək sübut standartları ilə qorunan cəza, belə ki, onun ciddiliyi əsasən insanların əmlakını təhlükəsiz saxlayan güclü çəkindirici amil rolunu oynayır. İslamın məqsədi insanların öz əşyaları ilə özlərini təhlükəsiz hiss etdikləri bir cəmiyyətdir.",
      "Onun müasir üzləri: oğurluq təkcə evə girməklə məhdudlaşmır. Buraya işəgötürəndən pul almaq, biznesdə fırıldaqçılıq, işçilərin əmək haqlarını tutmaq, rəqəmsal piratçılıq, plagiatlıq və qanuni olaraq özünə məxsus olmayan şeylərdən faydalanmaq daxildir. İnsanlardan gizli qalan, hər bir şəxsi almağı görən Allahdan heç vaxt gizli qalmaz.",
      "Qayıdış yolu: insan haqqı olduğu üçün tövbə Allah qarşısında peşmançılıqdan daha çox tələb edir. Oğurlanmış əşyanın özünü və ya dəyərini qanuni sahibinə qaytarmalı və mümkün olduqda onlardan əfv istəməlidir; sahibi tapılmasa, alimlər həmin məbləği onların adından sədəqə verməyi məsləhət görürlər. Bu şəkildə boşalmış, hətta oğurluq da geri dönən bəndəsini sevən tərəfindən tamamilə bağışlanar.",
    ],
    quran: [
      {
        excerpt:
          "Oğru kişi və qadının əllərini Allahdan çəkindirmək üçün qazandıqlarının əvəzini kəsin.",
      },
    ],
    actions: [
      "Oğurlanmış əşyaları və ya onların dəyərini qaytarın; zülm edənlərdən bağışlanma dilə.",
    ],
    appLinks: [{}],
  },
  {
    title: "Sərxoşedicilər",
    summary: "Şərab və sərxoşedicilər - Quranda tədricən və qəti şəkildə haram edilmişdir.",
    body: [
      "Tərif: Xəmr, ağılları məst edən və bulandıran hər şeydir - şərab və bütün spirtli içkilər və Peyğəmbərin (s) öz prinsipinə əsasən, forması və adı nə olursa olsun, hər bir məstedici maddədir. “Hər sərxoşedici xəmrdir, hər xəmr isə haramdır”.",
      "Nə üçün ağırdır: Ağıl insanın Allahı tanıdığı, doğrunu batildən ayırdığı və digər bütün məsuliyyətləri qoruduğu bir qabiliyyətdir. Sərxoşedicilər məhz bunu sökərlər, buna görə də Qur'an onları bütlərlə və qumarla mötərizə edərək “şeytanın işindən murdardır” və buyurur: “Onlardan çəkinin” (5:90). Fərddən başqa, onlar sağlamlığı, ailələri və təhlükəsizliyi məhv edir və ayıq bir insanın heç vaxt yaxınlaşmayacağı günahların qapısını açır.",
      "Haram olmasının hikməti: Allah xəmri bircə dəfə də olsa qadağan etmədi, onu mərhələ-mərhələ haram etdi, ilk camaatı köklü vərdişdən yumşaq bir şəkildə çıxardı. Bu tədricilik özü mərhəmət dərsidir və bu gün onu tərk etməkdə çətinlik çəkən hər kəs üçün bir ümid modelidir.",
      "Qayıdış yolu, şəfqətlə: aludəçilikdə tutulanlara xor baxılmalı deyil, dəstəklənməlidir. Tövbə, maddəni tərk etməyə qərar vermək, onu və onun tətikləyicilərini həyatından çıxarmaq, utanmadan kömək və müalicə istəmək, boşluğu gözəl ünsiyyət, zikr və ibadətlə doldurmaq deməkdir. Allahın qapısı açıqdır və sərxoşedicilərdən uzaqlaşan hər səmimi addım Onun qəbul etdiyi bir addımdır.",
    ],
    quran: [
      {
        excerpt:
          "Ey iman gətirənlər, şübhəsiz ki, şərab, qumar, bütlər və fal oxları şeytanın işindən murdardır, onlardan çəkinin.",
      },
    ],
    hadith: [
      {
        excerpt: "Hər sərxoşedici xəmrdir, hər xəmr haramdır.",
      },
    ],
    actions: ["Lazım gələrsə kömək axtarın; vərdişi zikr və yaxşı dostluqla əvəz edin."],
    appLinks: [{}],
  },
];

export const JAHANNAM_NAMES_AZ: DeepPartial<JahannamNameEntry>[] = [
  {
    name: "Cahannam",
    meaning: "Od — Quranda Cəhənnəmin ən çox yayılmış adı.",
    quran: {
      excerpt: "Yanacağı insanlar və daşlar olan, kafirlər üçün hazırlanmış oddan qorxun.",
    },
    context:
      "Bütün Quranda imanı inkar edən və zülm etməkdə israr edənlər üçün cəza yurdu kimi istifadə edilmişdir.",
    tafsirNote:
      "İbn Kəsir qeyd edir ki, Cəhənnəm xəbərdarlıq və nəticə olaraq hazırlanmış Odun hərtərəfli adıdır.",
    scholarlyNote:
      "Bəzi alimlər Cəhənnəmin bütövlükdə Cəhənnəm və ya müəyyən bir səviyyə olduğunu müzakirə edirlər - baxışlar fərqlidir.",
  },
  {
    name: "Cahim",
    meaning: "Yanan atəş - şiddətli, şiddətli istilik.",
    quran: {
      excerpt:
        "Siz və Allahdan başqa ibadət etdikləriniz cəhənnəmin yanacağısınız və ora daxil olacaqsınız.",
    },
    context: "Allaha şərik qoşanları gözləyən Cəhənnəmin şiddətini təsvir edir.",
    tafsirNote: "Əl-Təbəri cəhimi heç bir şeyi əsirgəməyən alovlu, alovlu odla əlaqələndirir.",
  },
  {
    name: "Saqar",
    meaning: "Yanan və ya heç nə buraxmayan - şiddətli istilik.",
    quran: {
      excerpt: "Mən onu Səqərə aparacağam. Sən nə bilirsən ki, Səqar nədir?",
    },
    context: "Müddəssir surəsində vəhydən üz döndərən şəxs haqqında qeyd edilmişdir.",
    tafsirNote:
      "Klassik təfsir Səqarı şiddətlə yanan Cəhənnəmin səviyyəsi kimi təsvir edir; təfərrüatlar alimlər arasında dəyişir.",
    scholarlyNote:
      "Səqarın ayrı bir səviyyə və ya ümumi olaraq Cəhənnəmin adı olması təfsirdə müzakirə olunur - razılaşdırılmış bir mətndə açıq deyil.",
  },
  {
    name: "Sair",
    meaning: "Yanan - alovlanan od.",
    quran: {
      excerpt: "Onlar Sairdə – alovlu Cəhənnəmdə olacaqlar.",
    },
    context: "Yetim malını haqsız yerə yeyənlərə xəbərdarlıq.",
    tafsirNote: "Kök yanan və alışqanlığı çatdırır - aktiv, istehlak edən yanğını vurğulayır.",
  },
  {
    name: "Hutamə",
    meaning: "Kırıcı - qıran və əzən.",
    quran: {
      excerpt: "O, Hutamə atılacaq. Sən nə bilirsən ki, Hutəmə nədir?",
    },
    context: "Qeybət edən və mal-dövlət yığan kəsin cəzası, onu ölümsüz edəcək.",
    tafsirNote:
      "İbn Kəsir Hutəmənin Allah tərəfindən yandırılan odunu əzdiyini və yandırdığını izah edir.",
  },
  {
    name: "Həviyyə",
    meaning: "Uçurum və ya çuxur - dərin bir düşmə.",
    quran: {
      excerpt: "Tərəzisi yüngül olanın sığınacağı Həviyyədir.",
    },
    context: "Yaxşılıqları çox yüngül olanların Qiyamət günü gedəcəyi yer.",
    tafsirNote:
      "Odda dərin bir çuxur olaraq təsvir edilir; ət-Təbəri onun dərinliyi və şiddəti haqqında fikirləri qeyd edir.",
    scholarlyNote:
      "Bəzi təfsir əsərlərində Həviyənin xüsusi bir səviyyə kimi sadalanması - elmi şərh kimi göstərilir.",
  },
  {
    name: "Lazaa",
    meaning: "Alov - alovlu alov.",
    quran: {
      excerpt: "Heç bir halda! O, Allahın alovudur.",
    },
    context: "“Məaric” surəsi – Qiyaməti inkar edənləri xəbərdar edir.",
    tafsirNote: "Sönən və yanan alova bağlıdır - Lazaa aktiv alovu vurğulayır.",
  },
];

export const JAHANNAM_GATES_AZ: DeepPartial<JahannamGateEntry>[] = [
  {
    quranNote:
      "Allah Cəhənnəmin yeddi qapısı olduğunu bildirir; Hər qapının daxil olanlardan müəyyən bir hissəsi vardır (15:44).",
    scholarlyNote:
      "Sonrakı bəzi təfsir əsərlərində qapıları günahkarların kateqoriyaları ilə əlaqələndirirlər. Bu tapşırıqlar ilkin mənbələrdə vahid deyil - şərh kimi təqdim olunur.",
  },
  {
    quranNote:
      "Qur'an yeddi qapını birlikdə təsdiq edir; açıq-aydın vəhydə hər qapının adını çəkmir.",
    scholarlyNote: "İbn Kəsir bölgü Allahın hikməti və ədaləti ilə olduğunu müzakirə edir.",
  },
  {
    quranNote:
      "Yeddi qapı - aydın mətn faktı. Hər bir qapının sakinlərinin təfərrüatları əsasən elmi müzakirədir.",
  },
  {
    quranNote: "Ayədə mütənasib təyinat vurğulanır - hər qapının öz payı var.",
  },
  {
    quranNote:
      "Möminlərə xəbərdarlıq edilir ki, tövbə yolu ilə bu qapılara aparan şeylərdən çəkinsinlər.",
  },
  {
    quranNote: "Cəhənnəm hazırdır - xəbərdarlıq realdır. Qoruma iman və saleh əməllədir.",
  },
  {
    quranNote:
      "Yeddi qapı, bir Od – günahkarların ilahi hikmətə görə qruplaşdırılmasında müxtəliflik ilə xəbərdarlıq birliyi.",
    scholarlyNote:
      "Adlandırılmış elmi işə istinad etmədikcə, xüsusi günah-qapı xəritələrini peyğəmbərlik faktı kimi öyrətməkdən çəkinin.",
  },
];

export const JAHANNAM_VERSES_AZ: DeepPartial<JahannamVerseEntry>[] = [
  {
    excerpt: "Kafirlər üçün hazırlanmış oddan qorxun.",
    context: "Möminlərə xitabən - qorxu itaət üçün motivasiya kimi.",
    tafsirSummary: "İbn Kəsir: Peyğəmbərə itaətlə birləşdirilən təqva çağırışı.",
  },
  {
    excerpt: "Allahın rəhmətindən ümidinizi kəsməyin. Həqiqətən, Allah bütün günahları bağışlayar.",
    context: "Günahlarından qorxanların təsəllisi çox böyük idi.",
    tafsirSummary: "Ümidin təməl daşı ayəsi - mərhəmət geri dönənlər üçün genişdir.",
  },
  {
    excerpt: "Allaha səmimi tövbə ilə tövbə edin ki, Rəbbiniz günahlarınızı aradan qaldırar.",
    context: "Ailə və rəftarla bağlı hidayətdən sonra möminlərə əmr et.",
    tafsirSummary: "Nəsuh tövbəsi - günaha qayıtmadan səmimi tövbə.",
  },
  {
    excerpt: "Hər kəsin etdiklərinə görə dərəcələri vardır.",
    context: "İlahi ədalət - əməllərə nisbətdə mükafat və cəza.",
    tafsirSummary: "Dərəcələr həm Cənnətə, həm də Cəhənnəmə aiddir.",
  },
  {
    excerpt: "Allah insanlara əsla zülm etməz, lakin insanlar özlərinə zülm edərlər.",
    context: "İlahi hökmün tamamilə ədalətli olduğuna əminlik.",
  },
  {
    excerpt: "Ey Rəbbimiz, bizə hər iki dünyada xeyir ver və bizi Cəhənnəm əzabından qoru!",
    context: "Dünya və axirət xeyirini birləşdirənlərin duası.",
    tafsirSummary: "Quranda öyrədilən peyğəmbərlik duası - dünya və axirət tarazlığı.",
  },
  {
    excerpt: "Cəhənnəmin yeddi qapısı var; Hər bir qapı üçün bir hissə var.",
    context: "İbrahimin öz qövmü ilə müzakirəsi kontekstində xitab etdi.",
    tafsirSummary:
      "Yeddi qapının açıq-aydın qeyd edilməsi - tapşırığın təfərrüatları ilahi hikmətdir.",
  },
  {
    excerpt:
      "Tövbə edib iman gətirib yaxşı işlər görənlərdən başqa, Allah pisliyi yaxşılıqla əvəz edər.",
    context: "Böyük günahları sıraladıqdan sonra istisna.",
    tafsirSummary: "Tövbə edənə ümid - əməllər mərhəmətlə dəyişdirilə bilər.",
  },
  {
    excerpt: "Rəbbini inkar edənləri Cəhənnəm əzabı gözləyir – necə də pis yerdir.",
    context: "əl-Mülk surəsi — qeybi xatırladan.",
  },
  {
    excerpt: "Həqiqətən, yaxşı əməllər pislikləri aradan qaldırar.",
    context: "Günün hər iki başında namaz qılmağı əmr et.",
    tafsirSummary: "Davamlı ibadətin keçmiş sürüşmələrini sildiyinə dair təşviq.",
  },
  {
    excerpt: "Ey Rəbbimiz, günahlarımızı bağışla və bizi Cəhənnəm əzabından qoru!",
    context: "Müttəqin (Allahdan qorxan) təsviri.",
  },
  {
    excerpt: "Tərəzisi yüngül olanın sığınacağı Həviyyədir.",
    context: "Qariə surəsi — əməllərin tərəzisi.",
  },
];

export const JAHANNAM_HADITH_AZ: DeepPartial<JahannamHadithEntry>[] = [
  {
    hadith: {
      excerpt:
        "Kim Allahdan üç dəfə Cənnəti diləsə, Cənnət buyurur: İlahi, onu Cənnətə daxil et. Kim üç dəfə Cəhənnəmdən sığınarsa, Cəhənnəm deyir: İlahi, onu Cəhənnəmdən qoru.",
    },
    context: "Cənnət üçün mütəmadi olaraq dua etməyə və Cəhənnəmdən sığınmağa təşviq etmək.",
  },
  {
    hadith: {
      excerpt:
        "Allah Öz bəndəsinin tövbəsini sizlərdən biriniz itmiş dağını boş bir yerdə tapandan daha çox sevindirir.",
    },
  },
  {
    hadith: {
      excerpt:
        "Allah məni rəhmətinə bürümədikcə heç biriniz, hətta mən də öz əməli ilə Cənnətə girə bilməzsiniz.",
    },
    context: "Müvazinət: əməldə səy göstər, amma mərhəmətə arxalan.",
  },
  {
    hadith: {
      excerpt:
        "Sənin atəşin cəhənnəm odunun yetmiş hissəsinin bir hissəsidir, hər bir hissəsi onun hərarəti kimidir.",
    },
  },
  {
    hadith: {
      excerpt: "Bizimlə onların arasında olan əhd namazdır. kim onu ​​tərk edərsə, kafir olmuşdur.",
    },
    context: "Namazı tərk etmənin şiddəti - ən ağır xəbərdarlıqlardan biridir.",
  },
  {
    hadith: {
      excerpt:
        "İflas namazı, orucu və sədəqəsi ilə gəlir, amma təhqir edir, böhtan atır, haram mal yeyir, qan tökür.",
    },
    context: "İnsanların haqqları Qiyamət günü əməllər qarşısında həll oluna bilər.",
  },
  {
    hadith: {
      excerpt:
        "Allah gecə əlini gündüzün günahkarının tövbəsini qəbul etmək üçün, gündüz isə gecənin günahkarının tövbəsini qəbul etmək üçün uzatır.",
    },
  },
  {
    hadith: {
      excerpt: "Kim Allaha və axirət gününə inanırsa, ya xeyir danışsın, ya da sussun.",
    },
    context: "Dili qorumaq - gündəlik məsuliyyət.",
  },
];

export const JAHANNAM_REFLECTIONS_AZ: DeepPartial<JahannamReflectionEntry>[] = [
  {
    question: "Bu gün kiməsə zülm etmişəmmi - danışıqda, hərəkətdə və ya etinasızlıqda?",
  },
  {
    question: "Mən bu gün səmimiyyətlə və dəfələrlə Allahdan bağışlanma dilədimmi?",
  },
  {
    question: "Mən dilimi qeybətdən, yalandan və istehzadan qorudummu?",
  },
  {
    question: "Namazı vaxtında və hüzurla qıldımmı?",
  },
  {
    question: "Ayrıldığım adamla barışmaq üçün addım atdım?",
  },
  {
    question: "Bu gün sədəqə və ya xeyirxahlıq etdim, hətta kiçik bir şey də?",
  },
  {
    question: "Mən bu gün Qur'an oxudum, yoxsa dinlədim?",
  },
];

export const JAHANNAM_REFERENCES_AZ: DeepPartial<JahannamReferenceEntry>[] = [
  {
    title: "Qur'an",
    note: "Adlar, xəbərdarlıqlar, mərhəmət və tövbə üçün əsas mənbə. Tərcümələr dəyişir; dəqiqlik üçün ərəb dili ilə məsləhətləşin.",
  },
  {
    title: "Səhih əl-Buxari və Səhih Müslim",
    note: "Səhihlərin qiymətləndirildiyi bu modul boyunca istinad edilən kanonik hədis topluları.",
  },
  {
    title: "Təfsir İbn Kəsir",
    note: "Cəhənnəm adları və əsas xəbərdarlıq ayələri ilə bağlı kontekst üçün istinad edilmişdir - elmi şərh.",
  },
  {
    title: "Təfsir ət-Təbəri",
    note: "Erkən hərtərəfli təfsir — Cahannam haqqında klassik fikirləri başa düşmək üçün faydalıdır.",
  },
  {
    title: "Alimlərin fərqli olduğu yerlər",
    note: "Cəhənnəmin dəqiq səviyyələri, qapı tapşırıqları və bəzi ad mənaları alimlər arasında müzakirə olunur - vəhydə həmişə açıq deyil.",
  },
];

export const JAHANNAM_DUAS_AZ: DeepPartial<JahannamDuaEntry>[] = [
  {
    context: "Hər iki dünyada xeyir dilə və Cəhənnəmdən qoru - Qur'an duası.",
  },
  {
    context: "Təşəhhüddən sonra: Cənnəti dilə və Cəhənnəmdən sığın.",
  },
  {
    context: "Sübh zikri: Qəbir və Cəhənnəm əzabından sığın.",
  },
];

export const JAHANNAM_REFUGE_DUA_AZ: { translation: string } = {
  translation:
    "Allahım, cəhənnəm əzabından, qəbir əzabından, həyatın və ölümün fitnəsindən və yalançı Məsihin şər fitnəsindən Sənə sığınıram.",
};
