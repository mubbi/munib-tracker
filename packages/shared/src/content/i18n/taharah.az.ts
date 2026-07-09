// Azerbaijani translation overlay for the Learn Taharah content. Mirrors the order of
// its English source in ../taharah*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { TaharahChecklistItem, TaharahTopic } from "../../types/taharah";
import type { DeepPartial } from "./localize";

export const TAHARAH_TOPICS_AZ: DeepPartial<TaharahTopic>[] = [
  {
    title: "Tahara giriş",
    summary: "Təmizlik namaza açılan qapı və möminin imanının yarısıdır.",
    body: [
      "Təharət (طهارة) təmizlənmək deməkdir - müsəlmanın Allahın hüzurunda Onun qəbul etdiyi bir vəziyyətdə dayanması üçün bədəni, paltarı və namaz yerini ayin və cismani çirkabdan təmizləməkdir. İbadət tələbəsinin öyrəndiyi ilk şey budur, çünki onsuz heç bir namaz səhih olmaz: Peyğəmbər (s) buyurmuşdur: “Namazın açarı paklıqdır”.",
      "İslamda təmizlənmənin iki ölçüsü var. Zahiri təmizlik hiss olunur - yumaq, çirkləri çıxarmaq, təmiz saxlamaq. Batin, təvazökarlıq, təfəkkür və qəlbin hazır olmasıdır ki, yuyulmanın oyatmaq üçün nəzərdə tutulmuşdur. Peyğəmbər (salləllahu aleyhi və səlləm) cismani təmizliyi nəfsin günahdan paklanması ilə birləşdirərək “imanın yarısı” deyəndə ikisini bir-birinə bağladı.",
      "Bu modul bütün mövzunu ardıcıllıqla gəzir: təmizlədiyin su, dəstəmaz (kiçik dəstəmaz), qüsl (tam hamam), təyəmmüm (sudan istifadə edilmədikdə quru təmizlənmə), nəcasə (fiziki çirkinliyi aradan qaldırmaq) və xüsusi hallar və güzəştlər. Bunu bir dəfə öyrənin və dua şübhə ilə deyil, inamla girə biləcəyiniz bir şeyə çevrilir.",
    ],
    quran: [
      {
        excerpt:
          "Ey iman gətirənlər, namaza qalxdığınız zaman üzünüzü və dirsəklərə qədər qollarınızı yuyun, başınıza məsh çəkin, topuqlara qədər ayaqlarınızı yuyun.",
      },
      {
        excerpt: "Həqiqətən, Allah tövbə edənləri və pak olanları sevər.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Namazın açarı paklıqdır; başlanğıcı təkbir, sonu isə təslimdir. (Əli; həmçinin Cami ət-Tirmizi 3)",
      },
    ],
    actions: [
      "Təmizliyi tələsik iş deyil, Allahla görüşə hazırlıq kimi qəbul edin.",
      "Bütün axın təbii hiss olunana qədər hər gün bir təharət mövzusunu öyrənin.",
    ],
    appLinks: [{}],
  },
  {
    title: "Saflığın Önəmi",
    summary: "Təmizlik namazın vacib şərti və möminin nişanəsidir.",
    body: [
      "Təmizləmə çoxları arasında bir seçim deyil - bu, namazın səhih olmasının şərtidir. Natəmiz adamın namazını Allah paklanana qədər qəbul etməz. Bu səbəbdən dəstəmazsız və qüslsüz qılınan namaz nə qədər səmimi olsa da, təkrar edilməlidir.",
      "Peyğəmbər (s) paklığı möminin müəyyən xüsusiyyətinə yüksəltmiş və onu “imanın yarısı” adlandırmışdır. Daimi təmizlənmə insanı tərbiyə edir, onu ibadətə demək olar ki, daimi hazır vəziyyətdə saxlayır və - hədis öyrədir - kiçik günahları sözün əsl mənasında su ilə yuyur.",
      "Namazı qoruduğu üçün təharət də mömini ehtiyatsızlıq üzündən batil namaz qılmaq günahından qoruyar. Buna görə də onun hökmlərini yaxşı öyrənmək İslamın ən böyük əməllərindən birini qorumaqdır.",
    ],
    hadith: [
      {
        excerpt: "Təmizlənmə imanın yarısıdır. (Əbu Malik əl-Əşari)",
      },
      {
        excerpt:
          "Allah paklanmadan namazı və oğurlanandan verilən sədəqəni qəbul etməz. (İbn Ömər)",
      },
    ],
    actions: [
      "Hər namazdan əvvəl, başlamazdan əvvəl təmizliyinizi təsdiqləyin.",
      "Sadə bir zehni yoxlama siyahısı saxlayın: bədən, geyim, yer və dəstəmaz.",
    ],
  },
  {
    title: "Təmizliyin növləri",
    summary: "Üç halı bilmək lazımdır: kiçik nəcasət, böyük nəcasət və fiziki nəcasət.",
    body: [
      "İslam şəriəti paklamalı ola biləcəyiniz üç şeyi ayırd edir və hər birinin öz çarəsi var. Hansı vəziyyətdə olduğunuzu bilmək düzgün metodu seçmək üçün açardır.",
      "Kiçik ritual nəcasət (hədəs-əsğər) tualetdən istifadə, külək ötürmək və ya dərin yuxu kimi adi hadisələrdən qaynaqlanır. Dəstəmazla, sudan istifadə etmək mümkün olmayanda isə təyəmmümlə qaldırılır.",
      "Böyük ayin nəcisləri (hədəs-əkbər, cənab də adlanır) yaxınlıq, cinsi ifrazat və menstruasiya və ya doğuşdan sonrakı qanaxmanın bitməsi nəticəsində yaranır. Qüsllə, yəni bütün bədəni əhatə edən ibadət hamamı ilə qaldırılır - su tapılmadıqda və ya zərərli olduqda yenidən təyəmmümlə əvəz edilir.",
      "Sidik, nəcis və ya axan qan kimi fiziki murdarlıq (nəcasə) ayrı bir məsələdir: ritual vəziyyətindən asılı olmayaraq bədəndən, paltardan və namaz yerindən fiziki olaraq təmizlənməlidir. Dörd sünni məzhəbi bu üç kateqoriyada həmfikirdirlər, yalnız nəyin paklığı ləğv etdiyi və ya hansı miqdarların üzrlü olduğuna dair bəzi təfərrüatlarda fərqlənirlər.",
    ],
    quran: [
      {
        excerpt:
          "Əgər cənabətdəsinizsə, özünüzü təmizləyin. Əgər xəstəsinizsə və ya səfərdəsinizsə... su tapmasanız, təmiz torpaqla təyəmmüm edin.",
      },
    ],
    actions: [
      "Əvvəlcə vəziyyətinizi müəyyən edin (kiçik, əsas və ya çirkin), sonra düzgün metodu tətbiq edin.",
      "Təfərrüatlar barədə əmin olmadığınız zaman, tanınmış məktəbdən bir ixtisaslı müəllimi ardıcıl olaraq izləyin.",
    ],
  },
  {
    title: "İslamda su",
    summary:
      "Saf su əsas təmizləyicidir - hərtərəfli istifadə olunur, lakin heç vaxt sərf edilmir.",
    body: [
      "Təmizləmə üçün standart vasitə sudur. Allah yağışı həm təmizlənə, həm də ibadət üçün istifadə oluna bilən “pak” (tahur) olaraq endirdiyini bildirir. İstənilən təbii təmiz su - yağış, çay, dəniz, bulaq, quyu və ya kran - o vaxta qədər təmizlənir ki, onun rəngi, dadı və ya qoxusu ona qarışan murdarlıqdan dəyişməyib.",
      "Fəqihlər suyu təfərrüatlı şəkildə (təmiz və təmizləyici, pak, lakin təmizləyici olmayan və natəmiz) kateqoriyalara ayırırlar, lakin gündəlik həyat üçün əməli qayda sadədir: bir nəcasə onu açıq-aşkar dəyişdirməsə, su dəstəmaz və qüslə uyğun olaraq qalır. Mövcud təmiz alternativlə əsl şübhəniz olduqda, alternativdən istifadə edin.",
      "İslam israf etmədən hərtərəfli olmağı öyrədir. Peyğəmbər (s) tamamilə yuyunsa da, olduqca az su istifadə etdi - dəstəmaz üçün bir palçıq (iki ovuc ovuc), tam qüsl üçün isə bir sa (təxminən dörd). Suyun çox olduğu halda belə israf etməkdən çəkindirilir, çünki mötədillik özü də ibadət ədəbindəndir.",
    ],
    quran: [
      {
        excerpt: "Biz göydən təmiz su endirdik.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Peyğəmbər (salləllahu aleyhi və səlləm) bir palçıq su ilə dəstəmaz, beş muda qədər sa' ilə qüsl alırdı. (Ənəs; həmçinin Səhih Müslim 325 - mötədillik sünnəsi)",
      },
    ],
    actions: [
      "Hərtərəfli yuyulmaq üçün kifayət qədər su istifadə edin, lakin kranı aşağı çevirin və artıqlığın qarşısını alın.",
      "Su mənbəyi çirkliliklə dəyişmiş görünürsə və ya iyi gəlirsə, ən yaxın təmiz mənbəni axtarın.",
    ],
    disclaimer:
      "Çox sitat gətirilən “axan çayda belə suyu israf etmə” (İbn Macə 425) alimlərin çoxu tərəfindən zəif (daif) olaraq qiymətləndirilmişdir; mötədillik sünnəsi yuxarıdakı mudd/sa hədisi ilə yerinə yetirilmişdir.",
  },
  {
    title: "Dəstəmaz nədir?",
    summary: "İbadətdən əvvəl kiçik murdarlığı qaldıran ritual dəstəmaz.",
    body: [
      "Dəstəmaz (وضوء) xüsusi əzaların müəyyən bir qaydada yuyulmasıdır ki, xırda ritual nəcabətini qaldırır. Onun dörd vacib yuyulmasının adı birbaşa Quranda (5:6) qeyd edilmişdir: üz, qollardan dirsəklərə qədər, başına məsh çəkmək və ayaqları topuğa qədər.",
      "Hər namazdan əvvəl - əvvəlki namazdan sonra səhih vəziyyətdə qalmadığınız halda - və əksər alimlərin fikrincə, Kəbə ətrafında təvaf etməzdən əvvəl və Qur'anın fiziki mətninə (müshaf) toxunmazdan əvvəl lazımdır.",
      "Dəstəmaz özlüyündə bir ibadətdir, sadəcə bir başlanğıc deyil. Peyğəmbər (salləllahu aleyhi və səlləm) xəbərdar etdi ki, “Sizlərdən heç biriniz dəstəmazını pozana qədər Allah onun namazını qəbul etməz” – ona görə də onu qorumaq namazın özünü qorumaqdır.",
    ],
    hadith: [
      {
        excerpt:
          "Allah sizlərdən birinizin dəstəmazını pozana qədər onun namazını qəbul etməz. (Əbu Hureyrə)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Etibarlı dəstəmazın şərtləri",
    summary: "Niyyət, təmiz su və maneəsiz dəri - sağlam dəstəmazın ilkin şərtləri.",
    body: [
      "Dəstəmazın sayılması üçün müəyyən şərtlər (şurut) olmalıdır. İnsan ibadət (niyyah) üçün təmizlənmək niyyətində olan sağlam düşüncəli müsəlman olmalıdır. Bəzi məktəblər niyyəti hərəkətin sütunu, digərləri isə şərt kimi təsnif edir, lakin hamı bunun mükafat və əksəriyyət üçün etibarlılıq üçün tələb olunduğu ilə razılaşır.",
      "İstifadə olunan su saf və təmizləyici olmalıdır. Əsas odur ki, o, həqiqətən dəriyə çatmalıdır - buna görə də bir əza üzərində suya davamlı maneə yaradan hər şey (qalın boya, dırnaq lakı, mum, yapışqan) əvvəlcə çıxarılmalı və ya onun altındakı yuyulma etibarlı deyil. Suya mane olmayan adi kir və ya xına ləkəsi problem deyil.",
      "Şafii və Hənbəli məzhəbləri də yuyunmaların Qur'an qaydasına uyğun və uzun fasiləsiz (muvalat) edilərək üzvlərin qurumasını tələb edir. Hənəfi və Malikinin ciddi ardıcıllıq və davamlılıq mövqeyi bəzi hallarda daha yumşaqdır. Ardıcıllıq üçün bir məktəbin metoduna əməl edin.",
    ],
    quran: [
      {
        excerpt:
          "Üzünüzü və qollarınızı dirsəklərə qədər yuyun, başınıza məsh çəkin və topuqlara qədər ayaqlarınızı yuyun.",
      },
    ],
    actions: [
      "Dəstəmazdan əvvəl dırnaq lakını, suyu tutan üzükləri və dərini bağlayan hər şeyi çıxarın.",
      "Dəstəmazı bir axarda sakitcə alın ki, heç bir üzv əskik olmasın və ya qurumasın.",
    ],
  },
  {
    title: "Dəstəmazın vacib əməlləri",
    summary: "Dəstəmaz batil olmayan Qur'an rüknləri (fəraid).",
    body: [
      "Dəstəmazın vacib əməlləri Allahın ayədə qeyd etdiyi hissələrdir: Bütün üzü yumaq; hər iki qolun dirsəklərə qədər yuyulması; başını silmək; və iki ayağı da topuğa qədər yumaq. Bunlardan hər hansı birini qaçırsanız, dəstəmazı natamamdır.",
      "Bunlara məktəblər sünnədən və fiqhi mülahizələrdən əlavə öhdəliklər əlavə edirlər. Əksər məzhəblərdə niyyət vacibdir (Hənəfilər bunu kiçik murdarlığı aradan qaldırmaq üçün güclü vurğulanan sünnə kimi təsnif edirlər). Nizam (tartib) və davamlılıq (müvalət) Şafii və Hənbəlilərə vacibdir. Malikilər əzalara sürtməyi (dalk) vacib hesab edirlər.",
      "Bunlardan başqa hər şey - ağız və burnu yaxalamaq, əvvəl əlləri yumaq, üç dəfə yumaq - vacib deyil, müstəhəbbdir (sünnə). Fərqi bilmək o deməkdir ki, siz dəstəmazın sadəcə qeyri-kamil olduğunu və əslində etibarsız olduğunu deyə bilərsiniz.",
    ],
    quran: [
      {
        excerpt:
          "Üzünüzü və qollarınızı dirsəklərə qədər yuyun, başınıza məsh çəkin və topuqlara qədər ayaqlarınızı yuyun.",
      },
    ],
    disclaimer:
      "Fəraidlərin dəqiq siyahısı (məsələn, niyyət, əmr və sürtmək vacib olub-olmaması) dörd məzhəb arasında fərqlidir. Bir etibarlı məktəbi ardıcıl olaraq öyrənin və tətbiq edin.",
  },
  {
    title: "Dəstəmazın Sünnə əməlləri",
    summary: "Dəstəmazın savabını kamilləşdirən və artıran müstəhəb əməllər.",
    body: [
      "Həzrət Peyğəmbər (s) vacib əsas ətrafında dəstəmazı tamamlayan və gözəlləşdirən çoxlu müstəhəb əməllər (sünən) yerinə yetirmişdir. Dəstəmazı tərk etmək dəstəmazı pozmaz, əksinə, əlavə savab qazanar və ondan nümunə götürər.",
      "Sabit sünnə əməllərə aşağıdakılar daxildir: başlanğıcda “Bismillah” demək; başlamazdan əvvəl əlləri üç dəfə yuyun; ağız (mədmədə) və burnu (istinşaq) yaxalamaq; yaş barmaqları qalın saqqaldan və barmaq və ayaq barmaqlarının arasında gəzdirmək (təhlil); hər bir cüt üzvü sağdan başlayaraq; və hər yuyulma üç dəfəyə qədər təkrarlanır.",
      "İki sünnəni xüsusi qeyd etmək lazımdır: misvakdan (Misvakdan) əvvəlcədən istifadə etmək - Peyğəmbərin  az qala vacib etdiyi misvak - bitirdikdən sonra iman şəhadətini oxumaq ki, bunu deyənə Cənnətin səkkiz qapısını açır.",
    ],
    hadith: [
      {
        excerpt:
          "Kim yaxşı dəstəmaz alar, sonra “Şəhadət verirəm ki, Allahdan başqa ilah yoxdur... və Muhəmməd Onun qulu və Rəsuludur” desə, Cənnətin səkkiz qapısı onun üzünə açılır. (Ömər ibn əl-Xəttab)",
      },
    ],
    actions: [
      "Təbii rutininizə çevrilənə qədər tam sünnət ardıcıllığını tətbiq edin.",
      "Hər dəfə dəstəmazdan sonrakı şəhadəti oxuyun.",
    ],
    appLinks: [{}],
  },
  {
    title: "Addım-addım Dəstəmaz",
    summary: "Niyyətdən son duaya qədər tam peyğəmbərlik ardıcıllığı.",
    body: [
      "Peyğəmbər ﷺ dəstəmazı sünnə əməlləri ilə birlikdə vacibləri birləşdirən bir ardıcıllıqla öyrətdi. Bu, Osman ibn Əffanın insanlara nümayiş etdirdiyi üsuldur və sonra Peyğəmbərin (sallallahu aleyhi və səlləm) dəstəmaz aldığını gördüyünü və kim bunu edib iki rükət namaz qılsa, onun keçmiş günahları bağışlandığını söylədi.",
      "Hər addımı tələsmədən yerinə yetirin, suyun hər tələb olunan sahəyə çatdığından əmin olun. Yuyulmuş əzalar (üz, qollar, ayaqlar) yuyulur; baş yalnız silinir.",
    ],
    steps: [
      {
        title: "Təmizlənməyə niyyət edin və Bismillah deyin",
        body: "Dəstəmaz niyyətini ürəyində yerləşdir və Allahın adı ilə başla.",
        tip: "Niyyət daxilidir - heç bir danışıq formuluna ehtiyac yoxdur.",
      },
      {
        title: "Hər iki əlinizi üç dəfə yuyun",
        body: "Barmaqların arasından su keçirərək biləklərə qədər yuyun.",
      },
      {
        title: "Ağzınızı üç dəfə yuyun",
        body: "Ağzınıza su götürün, çevirin və çıxarın.",
      },
      {
        title: "Burunu üç dəfə yuyun",
        body: "Burun dəliklərinə yumşaq bir şəkildə su çəkin və üfürün.",
      },
      {
        title: "Üzü üç dəfə yumaq (fərz)",
        body: "Saç xəttindən çənə altına və qulaqdan qulağa qədər.",
      },
      {
        title: "Sağ qolu, sonra sol qolu yuyun (fərzi)",
        body: "Hər biri barmaqların ucundan dirsəyə qədər, o cümlədən üç dəfəyə qədər.",
      },
      {
        title: "Başa bir dəfə məsh çəkmək (fərz)",
        body: "Yaş əllərlə öndən arxaya doğru məsh edin və geri dönün, sonra qulaqları eyni yaşla silin.",
      },
      {
        title: "Sağ ayağı, sonra sol ayağı yuyun (fərzi)",
        body: "Ayaq biləyinə qədər hər biri, barmaqları ayaq barmaqları arasından keçir.",
        tip: "Dabanlara və topuqlara diqqət yetirin - ən çox qaçırılan ləkələr.",
      },
      {
        title: "Son duanı oxuyun",
        body: "Cənnət qapılarını açmaq üçün iman şəhadətini de.",
        tip: "Qısa, lakin çox mükafatlandırılan bir sünnə.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Osman, Peyğəmbərin (sallallahu aleyhi və səlləm) gördüyü kimi hər bir üzvünü üç dəfə yudu, sonra dedi: “Kim belə dəstəmaz alar və iki rükət namaz qılarsa, keçmiş günahları bağışlanar. (Humran, Osmandan)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dəstəmazla əlaqədar dualar",
    summary: "Dəstəmazdan əvvəl və sonra səhih bildirilən dualar.",
    body: [
      "Dəstəmaz ətrafında rəvayət edilən ən güclü zikr ikidir: əvvəlində “Bismillah” demək və onu bitirdikdən sonra iman şəhadəti. Sonuncu şəhadətə mötəbər əlavə olaraq Allahdan soruşur: “Məni tövbə edənlərdən qərar ver və məni paklananlardan et”.",
      "Bilmək lazımdır ki, bəzi kitabçalarda keçən hər bir üzv üçün təfərrüatlı dua (əl, üz, qol və s. yuyarkən xüsusi dua) Peyğəmbərdən (s) mötəbər mötəbərliklə təsdiqlənməmişdir. Alimlər dəstəmazda Allahı zikr etməyin heç bir eybi olmadığı halda, bunları ona sünnə aid etməməyi tövsiyə edirlər.",
      "İşin mahiyyəti hüzurdur: hər bir üzvün günahlarının azaldığını bilə-bilə yuyun və işi öz məqsədinə bağlayan şəhadətlə – yalnız Allaha imanla bitir.",
    ],
    hadith: [
      {
        excerpt:
          "Kim yaxşı dəstəmaz alıb sonra iman şəhadətini oxuyarsa, Cənnətin səkkiz qapısı ona açılar ki, istədiyi qapıdan girsin. (Ömər)",
      },
    ],
    actions: [
      "Dəstəmazdan sonrakı şəhadəti əzbərləməmisinizsə, əzbərləyin.",
      "Təsdiq edilməmiş düsturları sünnə kimi söyləməkdən çəkinin.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dəstəmazı pozan nədir?",
    summary: "Dəstəmazı batil edənlər – və şəkk etdikdə yəqinlik hökmü.",
    body: [
      "Elmi razılığa əsasən, dəstəmaz iki xüsusi keçiddən çıxan hər şeylə - sidik, nəcis, külək və ya digər ifrazatlar - həmçinin insanın şüurunu aradan qaldıran dərin yuxu ilə və huşunu itirmə və ya sərxoşluq nəticəsində huşunu itirməklə pozulur.",
      "Digər məsələlərdə məktəblər arasında ehtiram fərqi var: övrətə birbaşa toxunmaq və əks cinsdən olan naməhrəmlə dəridən-qabıqdan təmas bəzi məktəblərdə eyni mətnlərin fərqli oxunuşlarına əsaslanaraq batildir, digərlərində isə yox.",
      "Həyati bir idarəetmə prinsipi sizi daimi narahatlıqdan (vəsvasdan) qoruyur: əminlik şübhə ilə aradan qaldırılmır. Əgər dəstəmaz almısınızsa və onu pozub-qalmadığınıza əmin deyilsinizsə, batilin baş verdiyinə əmin olana qədər dəstəmazlı sayılırsınız. Həzrət Peyğəmbər (s) bu hissdən narahat olan bir adama buyurmuşdur ki, “bir səs eşitməyincə və ya bir qoxu tapana qədər namazını tərk etmə”.",
    ],
    hadith: [
      {
        excerpt:
          "Bir səs eşitməyincə və ya qoxu tapmayınca (namazını) tərk etməməlidir. (Abbad ibn Təmim, əmisindən)",
      },
    ],
    disclaimer:
      "Qarşı cinsə toxunmağın, yaxud övrət yerinə toxunmağın dəstəmazı pozması məktəblər arasında fərqlidir. İxtisaslı yerli müəllimə və bir məktəbin metoduna əməl edin.",
  },
  {
    title: "Ümumi Dəstəmaz Səhvləri",
    summary: "Mükafatı azaldan və ya dəstəmazı tamamilə batil edən tez-tez səhvlər.",
    body: [
      "Dəstəmazın xətalarının çoxu tələsməkdəndir. Suyun bütün üzvə – dabanda, topuqda, dirsəkdə, yaxud barmaq və ayaq barmaqlarının arasında olan quru ləkəyə çatmaması üçün tələsmək dəstəmazı batil edə bilər, çünki orada Qur'an yuyulması tamamlanmamışdır.",
      "Həzrət Peyğəmbər (s) bir dəfə su onlara çatmadığı üçün dabanları quru qalan insanları gördü və kəskin şəkildə: “Vay halına cəhənnəm odunun dabanlarına!” dedi. Dabanlar, topuqlar və üzün küncləri ən çox diqqətdən kənarda qalan ləkələrdir.",
      "Əks xəta həddindən artıqdır: üç dəfədən çox yumaq və ya sudan israfçılıqla istifadə etmək, təvazökarlıq sünnəsinə ziddir. Digərləri dəstəmazı təkrar-təkrar təkrar edərək vəsvasa (obsesif şübhəyə) düşürlər - bu da səhvdir, çünki yəqinlik şübhə ilə pozulmur.",
    ],
    hadith: [
      {
        excerpt:
          "Vay halına Cəhənnəmdən! – dabanlarının dəstəmazda quru qaldığını görəndə dedi. (Əbu Hureyrə)",
      },
    ],
    actions: [
      "Yavaşlayın və hər yuyulmuş əzanın, xüsusən dabanların və dirsəklərin tam örtülməsini şüurlu şəkildə təsdiqləyin.",
      "orta dərəcədə su istifadə edin; obsesif şübhənin sizi lazımsız təkrarlara sövq etməsinə imkan verməyin.",
    ],
  },
  {
    title: "Dəstəmazın fəzilətləri",
    summary:
      "Dəstəmaz günahları silir, dərəcələri yüksəldir və möminləri Qiyamət günü nurlandırar.",
    body: [
      "Dəstəmaz günahların təkrar yuyulmasıdır. Həzrət Peyğəmbər (s) öyrədir ki, mömin hər bir üzvünü yuduqca, o üzvün etdiyi səhv əməllər su ilə – gözləri, əlləri, ayaqları ilə – insan günahdan təmizlənmiş halda üzə çıxıncaya qədər tökülür. Dəstəmazdan əvvəl edilən duadan əvvəl yeni bir bağışlanma gəlir.",
      'Bundan sonrakı həyatda da fərqləndirici bir şərəfdir. Qiyamət günü Peyğəmbər (salləllahu aleyhi və səlləm) öz ardıcıllarını üzlərində, əllərində və ayaqlarında olan dəstəmazın izlərindən gələn nurdan tanıyacaqdır - bu ümmətə xas olan, "əl-gurrul-mühəccəlun" adlanan nurdur.',
      "Bu fəzilətlərə görə dəstəmazlı vəziyyətdə qalmaq müstəhəbb bir adətdir: onu hər namaz üçün təzələmək və dəstəmazlı yatmaq möminin qoruyucu işlərindəndir.",
    ],
    hadith: [
      {
        excerpt:
          "Ümmətim Qiyamət günü dəstəmaz izlərindən nurlu üzlər, əllər və ayaqlarla çağırılacaqdır. (Əbu Hureyrə)",
      },
    ],
    actions: [
      "Bacardığınız yerdə hər namaz pəncərəsi üçün dəstəmazı yeniləyin.",
      "Dəstəmazlı yatmağı gecənin sünnəti et.",
    ],
    appLinks: [{}],
  },
  {
    title: "Qüsl nədir?",
    summary: "Böyük nəcisləri (cənabəh) qaldıran bütün bədən ritual vannası.",
    body: [
      "Qüsl (غسل) böyük murdarlığı (cənabəti) aradan qaldırmaq niyyəti ilə bütün bədənin yuyulmasıdır. Dəstəmaz kiçik murdarlığa toxunduğu halda, qüsl yaxınlıqdan, cinsi ifrazatdan, heyz və ya doğuşdan sonrakı qanaxmanın bitməsindən sonra gələn daha böyük vəziyyətə aiddir.",
      "Onun mahiyyəti ondan ibarətdir ki, suyun xarici bədənin hər bir hissəsinə çatır - saçın kökləri, dəri qıvrımları, qulaqların arxasında, göbək və ayaq barmaqları arasında quru ləkələr qala bilməz. Ağız və burnu yaxalamaq bir çox alimlər tərəfindən qüslə daxildir.",
      "Cənabəni qaldırmaq niyyəti ilə alınan tək qüsl kiçik nəcasəti də aradan qaldırır, ona görə də qüsl almış şəxs ayrıca dəstəmazsız namaz qıla bilər (baxmayaraq ki, qüsl daxilində dəstəmaz almaq sünnətdir).",
    ],
    quran: [
      {
        excerpt: "Əgər cənabətdəsinizsə, özünüzü təmizləyin.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Qüsl lazım olduqda",
    summary: "Tam ritual hamamı məcbur edən və ya tövsiyə edilən vəziyyətlər.",
    body: [
      "Bir neçə müəyyən hallarda qüsl vacib (fərz) olur: istəklə cinsi mayenin çıxması (istər oyaq, istərsə də yaş yuxu ilə); cinsi əlaqənin özü, hətta boşalmadan da - Peyğəmbər (sallallahu aleyhi və səlləm) buyurdu ki, ikisi birləşdikdə qüsl lazımdır; və heyz (heyd) və ya doğuşdan sonra (nifas) qanaxmanın bitməsi. Ölüm də diriyə meyyitin qüslünü vacib edir.",
      "Vacib deyil, başqa qüsllər müstəhəbdir: Cümə günündən əvvəl cümə günü qüslü o qədər güclüdür ki, Peyğəmbər (sallallahu aleyhi və səlləm) bunu “həddi-büluğa çatmış hər kəsə borcdur” adlandırmışdır; iki bayram üçün qüsl; və həcc və ya ümrədən əvvəl ehram qüslü.",
      "Yeni bir müsəlmana İslama daxil olduqdan sonra qüsl alması göstərişi verilir ki, bu da bəzi alimlər tərəfindən vacib, bəziləri tərəfindən isə şiddətlə tövsiyə edilir.",
    ],
    hadith: [
      {
        excerpt:
          "Kişi arvadının dörd üzvü arasında oturub onunla yaxınlıq etdikdə qüsl vacib olur. (Əbu Hureyrə; həmçinin Səhih Müslim 348)",
      },
      {
        excerpt:
          "Cümə günü qüsl almaq həddi-büluğa çatmış hər kəsə vacibdir. (Əbu Səid əl-Xudri; həmçinin Səhih Müslim 846)",
      },
    ],
    disclaimer: "Cümə və qüslünün vacib və ya müstəhəbb olması məktəbə və şəraitə görə dəyişir.",
    appLinks: [{}],
  },
  {
    title: "Addım-addım qüsl",
    summary: "Peyğəmbərlik üsulu - minimum öhdəlik və tam sünnə.",
    body: [
      "Aişə Peyğəmbərin (sallallahu aleyhi və səlləm) qüslünü təfərrüatlı şəkildə təsvir etdi və alimlər ondan həm minimum səhih qüsl, həm də daha dolğun sünnət üsulunu çıxardılar. Minimum sadədir: niyyət və bütün bədənə çatan su (çoxları üçün ağız və burun yuyulması ilə). Aşağıdakı tam üsul, Peyğəmbərin özünün bunu necə etdiyidir.",
      "Tələsmədən həyata keçirin, suyu dəriyə sürtün ki, heç bir şey quru qalmasın.",
    ],
    steps: [
      {
        title: "Niyyəti formalaşdırın",
        body: "Qəlbinizdə böyük ayin murdarlığını (cənabəti) qaldırmağa niyyət edin.",
      },
      {
        title: "Bismillah deyin və əllərinizi yuyun",
        body: "Allahın adı ilə başlayın və hər iki əlinizi yuyun.",
      },
      {
        title: "Şəxsi ərazini yuyun",
        body: "Sol əli ilə övrət yerlərindən nəcasəti çıxarın.",
      },
      {
        title: "Tam dəstəmaz alın",
        body: "Namazda olduğu kimi dəstəmaz alın. Əgər toplanmış suda durursanız, ayaqların yuyulmasını sona qədər təxirə sala bilərsiniz.",
      },
      {
        title: "Başın üstünə üç dəfə su tökün",
        body: "Suyu baş dərisinə və saç köklərinə sürtün.",
      },
      {
        title: "Sağ tərəfi, sonra sol tərəfi yuyun",
        body: "Sağdan başlayaraq bütün bədənə su tökün və sürtün.",
      },
      {
        title: "Tam əhatəni təmin edin",
        body: "Heç bir quru yer buraxmayın - qoltuqaltı, göbək, diz və qulaqların arxasında və ayaq barmaqları arasında.",
        tip: "Suyun baş dərisinə çatması şərti ilə qadınların hörüklü saçlarını açmasına ehtiyac yoxdur.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Peyğəmbər (salləllahu aleyhi və səlləm) cənabədən qüsl alanda, əllərini yuyanda, namaz kimi dəstəmaz alar, barmaqlarını saçlarında gəzdirir, sonra üç dəfə başının üstünə və bədəninin qalan hissəsinə su tökürdü. (Aişə)",
      },
    ],
  },
  {
    title: "Ümumi qüsl xətaları",
    summary: "Quru yerlərdən, qəsdən niyyətdən və duşu qüsllə səhv salmaqdan çəkinin.",
    body: [
      "Ən əsas səhv adi bir duşa qüsl kimi baxmaqdır. Qüsldə böyük nəcasəti aradan qaldırmaq niyyəti lazımdır; onsuz, nə qədər uzun yuyursan, ritual vəziyyət qaldırılmır. Başlamazdan əvvəl niyyətinizi formalaşdırın.",
      "İkinci ümumi səhv quru ləkələri tərk etməkdir. Vacib odur ki, suyun bütün bədənə toxunması, başın köklərinə, qulaqlara, göbəkə, kürəyin kiçik hissəsinə və ya ayaq barmaqlarının arasına etinasız yanaşmaq qüslü yarımçıq qoyur. Əmin olmaq üçün suyu bu yerlərə sürtün.",
      "Saç üçün: Saçları hörük olan qadının hörükləri açması lazım deyil, nə qədər ki, su başın köklərinə çatsın - Peyğəmbər Ümmü Sələməyə dedi ki, başına üç ovuc tökmək kifayətdir. Kişinin saçları, adətən boş olduğundan, suyun köklərə çatması üçün işlənməlidir.",
    ],
    hadith: [
      {
        excerpt:
          "Başınızın üstünə üç ovuc su tökmək kifayətdir, sonra özünüzə su tökün və təmizləndiniz - hörüklərinizi açmaq lazım deyil. (Ümmü Sələmə)",
      },
    ],
    actions: [
      "Birinci tökmədən əvvəl niyyəti deyin ki, yumaq qüsl sayılır.",
      "Asanlıqla buraxılan yerlərə su sürtün; qeyri-müəyyən olduqda, şübhə ilə bitirmək əvəzinə bir hissəni yenidən yuyun.",
    ],
  },
  {
    title: "Təyəmmüm nədir?",
    summary: "Sudan istifadə etmək mümkün olmadıqda təmiz torpaqla quru təmizləmə.",
    body: [
      "Təyəmmüm (تيمم) su həqiqətən olmadığı və ya istifadə oluna bilməyəcəyi halda dəstəmaz və ya qüslün mərhəmətli əvəzidir. Yuyunmaq əvəzinə ovuc içi ilə təmiz torpağa vurub üz və əllərə məsh çəkmək - bu, suyun təmizlənməsinin yerini tam olaraq tutur, namazı səhih edir.",
      "Təyəmmüm xüsusilə bu ümmətə bir hədiyyədir: Peyğəmbər (s) buyurmuşdur: “Yer mənim üçün namaz yeri və paklanma vasitəsi edildi” və onu əvvəlki peyğəmbərlərə deyil, ona verilən xüsusi imtiyazlar sırasına saldı. O, dinin mərkəzi prinsipini təcəssüm etdirir - öhdəlik qalır, lakin çətinlik aradan qaldırılır.",
      "Bu müvəqqəti tədbirdir: su mövcud və istifadəyə yararlı olduqdan sonra su ilə adi təmizləmə davam etdirilir. Bəzi məktəblərə görə insan hər namaz üçün təyəmmümü təzələməlidir.",
    ],
    quran: [
      {
        excerpt:
          "...və su tapmasanız, təmiz torpaqla təyəmmüm edin, onunla üzlərinizə və əllərinizə məsh edin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Yer mənim üçün ibadət yeri və paklanma vasitəsi edildi. (Cabir – Peyğəmbərə (sallallahu aleyhi və səlləm) verilən beş şeydən)",
      },
    ],
  },
  {
    title: "Təyəmmüm icazəli olduqda",
    summary:
      "Su olmadıqda, zərərli olduqda və ya yaşamaq üçün təcili ehtiyac olduqda icazə verilir.",
    body: [
      "Təyəmmüm üç geniş vəziyyətdə icazəlidir. Birincisi, ağlabatan axtarışdan sonra su tapılmadıqda - səhrada olan səyahətçi və ya həqiqətən girişi olmayan hər kəs. İkincisi, su istifadə edərkən zərər verə bilər: kimin yaraları və ya xəstəlik pisləşəcək xəstələr üçün, və ya su qızdırmaq üçün heç bir vasitə ilə şiddətli soyuq və zərər real risk.",
      "Üçüncüsü, mövcud olan az su daha vacib ehtiyaclar üçün, məsələn, içmək, öz və ya başqasının və ya bir heyvanın həyatını qorumaq üçün lazım olduqda. Hər bir halda şəriət həyat və sağlamlığın qorunmasını üstünlük verilən təmizlənmə üsulundan üstün tutur.",
      "Fəqihlər daha incə hədlər üzərində ixtilaf edirlər - insanın nə qədər su axtarmalı, nə qədər zərər qorxusu kifayətdir - lakin onlar əsas mərhəmətdə yekdildirlər: ibadət heç vaxt tərk edilmir, yalnız asanlaşdırılır.",
    ],
    hadith: [
      {
        excerpt:
          "Təyəmmüm fəsillərində rəvayət edilmişdir: istifadəyə yararlı su olmadığı halda təmiz torpaqla təmizlənməyə güzəşt.",
      },
    ],
    actions: [
      "Təyəmmüm etməzdən əvvəl suyu ağlabatan şəkildə axtarın.",
      "Əgər həkim yara və ya xəstəliyi quru saxlamağı tövsiyə edərsə, ona əməl edin və təyəmmüm edin.",
    ],
  },
  {
    title: "Addım-addım Təyəmmüm",
    summary: "Etibarlı quru təmizləmə üçün qısa, sadə ardıcıllıq.",
    body: [
      "Təyəmmüm qəsdən qısadır - çətinlikdə güzəşt kimi məqsədinin əksidir. Təmiz, təbii torpaq səthi ilə həyata keçirilir: torpaq, qum, daş və ya toz. Onun mahiyyəti, Peyğəmbərin (s) özünün nümayişindən Əmmar ibn Yasirə qədər, ovucların təmiz torpağa bir dəfə vurulması, sonra üzün və əllərin məsh edilməsidir.",
      "Bu dizayn baxımından dəstəmazdan daha yüngüldür, ona görə də ona fəsadlar əlavə etməyin.",
    ],
    steps: [
      {
        title: "Niyyəti formalaşdırın",
        body: "İbadət etmək üçün ritual murdarlığı qaldırmağa niyyət edin.",
      },
      {
        title: "Bismillah deyin",
        body: "Allahın adı ilə başla.",
      },
      {
        title: "Hər iki ovucunuzla təmiz torpağa bir dəfə vurun",
        body: "Avuçlarınızı təmiz, tozlu, təbii səthə yüngülcə qoyun.",
      },
      {
        title: "Üzü silin",
        body: "İki əlinizlə bir dəfə bütün üzü silin.",
      },
      {
        title: "Əlləri silin",
        body: "Əllərin arxasına – biləklərə qədər məsh edin əksər alimlər.",
        tip: "Davamlı olaraq bir məktəbin metoduna əməl edin (biləklər və ön kollar).",
      },
    ],
    hadith: [
      {
        excerpt:
          "Peyğəmbər (salləllahu aleyhi və səlləm) ovucları ilə yerə vurdu, sonra üzünə və əllərinə məsh çəkdi və Əmmərə bunun kifayət etdiyini öyrətdi. (Əmmar ibn Yasir)",
      },
    ],
  },
  {
    title: "Təyəmmümü pozan nədir?",
    summary: "Adi dəstəmaz pozanlarla və istifadəyə yararlı suyun qaytarılması ilə ləğv edilir.",
    body: [
      "Dəstəmaz əvəzinə alınan təyəmmüm dəstəmazı pozan hər şeylə batildir: rahatlıq, külək keçmək, dərin yuxu və s. Qüsl yerinə təyəmmüm də böyük murdarlığa səbəb olarsa, batil olur.",
      "Bənzərsiz olaraq, təyəmmüm də səbəbinin aradan qaldırılması ilə, yəni istifadə olunan suya çıxış əldə etməklə sona çatır. Su tapıldıqdan və istifadə oluna biləndən sonra güzəşt pozulur və dəstəmaz və ya qüslə qayıdır.",
      "Praktik bir rəhmət məqamı: əgər təyəmmümlə düzgün namaz qılmısınızsa və yalnız bundan sonra su tapmısınızsa, əksəriyyət tamamlanmış namazı təkrar etməyə ehtiyac olmadığını düşünür - o vaxt tətbiq olunan hökmə əsasən düzgün qılınmışdır. Amma namazdan əvvəl su görünsə, ondan istifadə etməlisiniz.",
    ],
    actions: [
      "Hər namaz vaxtının əvvəlində mövcud suyun olub olmadığını yenidən yoxlayın.",
      "Su istifadə edilə bilən kimi, gecikmədən su ilə təmizlənməyə qayıdın.",
    ],
    disclaimer:
      "Bəzi təfərrüatlar - məsələn, namazın vaxtında su tapıldıqdan sonra təkrar edilib-edilməməsi kimi - məktəbə görə fərqlənir.",
  },
  {
    title: "Nəcabətlər (Nəcasə)",
    summary: "Bədəndən, paltardan və namaz qılınan yerdən təmizlənməlidir.",
    body: [
      "Nəcasə (نجاسة) hədisin ritual hallarından fərqli olaraq hiss edilən ritual çirkabdır. Razılaşdırılmış aydın nümunələrə insan sidiyi və nəcisi, axan qan, donuzun əti və axıntısı və itin tüpürcəyi (xüsusi yuyulma tələb olunur) daxildir. Bədəndən nəcasəni, geyilən paltarı və namaz yerini çıxarmaq namazın səhih şərtidir.",
      "Çıxarılma çirkin göründüyü yerdə su ilə, maddə və onun izi yox olana qədər yuyulur. İslamda nəcasənin mənbələrinə də ciddi yanaşır: Peyğəmbər (s) xəbərdarlıq etmişdir ki, qəbrin əzabının çoxu sidiklə ehtiyatsızlıqdan – sidiklə sıçramaqdan və düzgün təmizlənməməkdən gəlir.",
      "Məktəblər bəzi maddələrin təsnifatı (məsələn, az miqdarda müəyyən mayelərin üzrlü olub-olmaması) və hansı iz miqdarının tolere ediləcəyi ilə bağlı fərqlidirlər. Gündəlik həyat üçün işlək prinsip: hərtərəfli təmizləyin və çirkinlik sübutu olmayan yerdə təmizliyə şübhə yaratmayın.",
    ],
    hadith: [
      {
        excerpt:
          "Həzrət Peyğəmbər (s) iki qəbrin yanından keçərək, onların əhlinin cəzalandırıldıqlarını söylədi: biri böhtan atdığına görə, digəri isə sidiyindən qorunmadığına görə. (İbn Abbas; həmçinin Səhih Müslim 292)",
      },
    ],
  },
  {
    title: "Paltarları murdarlıqdan təmizləmək",
    summary: "Paltarı necə yumaq lazımdır ki, onda namaz düzgün olsun.",
    body: [
      "Nəcasə paltarın üstünə daxil olduqda, maddənin özü və görünən izi yox olana qədər təsirlənmiş ərazini su ilə yuyun. Peyğəmbər (salləllahu aleyhi və səlləm) paltarı heyz qanına bulaşmış bir qadına göstəriş verdi ki, paltarını sürt, sonra su ilə məsh et, sonra yuyub, onunla namaz qıl.",
      "Səmimi və hərtərəfli səydən sonra çıxmayacaq zəif bir rəng ləkəsi və ya yüngül bir qoxu qalsa, alimlərin əksəriyyəti çıxarmaq həqiqətən çətin olanı bəhanə edir - öhdəlik ləkəsiz bir boyaya zəmanət vermək deyil, maddəni çıxarmaqdır.",
      "Bəzi halların öz tanınmış detalları var, məsələn, ana südü ilə qidalanan körpənin sidiyi (məlumatda verilən güzəştdə tam yuyulmuş deyil, səpilir) - buna görə də həqiqətən qarşılaşdığınız vəziyyətlər üçün məktəbinizin praktiki qaydalarını öyrənin.",
    ],
    hadith: [
      {
        excerpt:
          "Paltarın heyz qanı haqqında: onu qaşımaq, sonra su ilə sürtmək, sonra yumaq və onunla namaz qılmaq. (Əsma bint Əbi Bəkr)",
      },
    ],
    actions: [
      "Namaz üçün ən azı bir təmiz paltar ayırın.",
      "Evdən uzaqda paltarlarınıza çirk toxunarsa, mümkün olanı yuyun və mümkün olduqda dəyişdirin.",
    ],
  },
  {
    title: "Bədənin Təmizlənməsi",
    summary: "Bədəndən murdarlığı çıxarmaq, İstinca və təmizlik ədəbi.",
    body: [
      "Namazdan əvvəl bədəndəki çirkləri öz imkanı daxilində yumaq lazımdır. Ən çox rast gəlinən hal tualetdən istifadə etdikdən sonra özünü təmizləməkdir - istinizə - bu, su ilə və ya uyğun bir quru materialla, ərazi təmizlənənə qədər edilir. Həzrət Peyğəmbər (salləllahu aleyhi və səlləm) rahatlıq əldə etdikdən sonra təmizlik etməyi öyrətdi və bunun üçün sağ əldən istifadə etməyi qadağan etdi.",
      "İslam çirkinliyi aradan qaldırmaqla yanaşı, bədəni təmiz və ibadətə hazır saxlayan təbii gigiyena (fitrə) əsasını təşviq edir: dırnaqların kəsilməsi, qoltuqaltı və qasıq tüklərinin çıxarılması və s.",
      "Bu əməllər sadəcə mədəni incəliklər deyil, möminin duada Allah qarşısında özünü göstərdiyi ləyaqət və təmizliyin bir hissəsidir.",
    ],
    hadith: [
      {
        excerpt: "Peyğəmbər  sağaldıqdan sonra su ilə təmizlənirdi. (Ənəs)",
      },
    ],
    actions: [
      "Tualetdən istifadə etdikdən sonra həmişə dəstəmazdan əvvəl istincanı tamamlayın.",
      "Səyahət zamanı salfetlər və bacardığınız yerdə su aparın.",
    ],
  },
  {
    title: "Namaz yerlərinin təmizlənməsi",
    summary: "Namaz yeri məlum çirkinliklərdən təmizlənməlidir - əsassız şübhə olmadan.",
    body: [
      "Namaz qılınan yer məlum nəcasədən təmiz olmalıdır. Həzrət Peyğəmbər (s) bunu açıq şəkildə öyrədir: bir bədəvi məscidin küncünə idrar edərkən səhabələrin onu sərt məzəmmət etməkdən çəkindirdi, sözünü bitirsin, sonra da həmin yerə bir vedrə su tökməyi əmr etdi - həm təmizliyi, həm də mülayimliyi öyrətdi.",
      "İdarəetmə qaydası əminlikdir. Yer bütövlükdə ibadət yeri olub, ona görə də sizdə murdarlığa dair real dəlil yoxdursa, səth təmiz sayılır. Əgər murdarlıq olduğunu bilirsinizsə, onu çıxarın və ya təmiz yerə keçin; sadəcə orada ola biləcəyini təsəvvür edirsinizsə, pıçıltıya məhəl qoymayın və davam edin.",
      "Bu tarazlıq qoruyucuları iki ifratdan ibadət edirlər: açıq-aşkar çirkli torpaqda ehtiyatsızlıqla dua etmək və hər səthə dair əsassız şübhə ilə iflic olmaq.",
    ],
    hadith: [
      {
        excerpt:
          "Bir bədəvi məsciddə idrar edərkən Peyğəmbər (s) üzərinə bir vedrə su tökməyi əmr etdi. (Əbu Hureyrə)",
      },
    ],
    actions: [
      "Namazdan əvvəl döşəyinizə və döşəməyə nəzər salın.",
      "Əsl çirkin dəlil olmadan, əsassız şübhələri rədd edin və dua edin.",
    ],
  },
  {
    title: "Hayd və Saflıq",
    summary: "Heyz və doğuşdan sonrakı qanaxmanın öz təmizlənmə hökmləri vardır.",
    body: [
      "Heyz (heyd) və doğuşdan sonrakı qan (nifas) zamanı qadın namaz qılmaz və dinin rəhməti ilə həmin vaxtda qılınan namazlar sonra qəza olmaz. Bu qərara gəldi: Aişədən soruşduqda ki, nə üçün heyzli qadın orucunu qəza edir, amma namazını qılmır, o, onlara belə buyurulduğunu təsdiqlədi.",
      "Oruc tutmaq fərqlidir: Ramazanda heyz səbəbiylə tutulmayan oruclar sonradan qəza edilir, namaz isə sadəcə olaraq qaldırılır. Qanaxma bitdikdə və paklıq əlaməti göründükdə qadın qüsl alıb namaza və oruc tutmağa davam edər.",
      "Heyd və nifasın dəqiq minimum və maksimum müddətləri, paklığın sərhəd nişanələrinin necə oxunması məktəblərin təfərrüatları ilə fərqləndiyi məsələlərdir. Qadınlar ixtisaslı müəllimlə bir etibarlı məktəbin əməli hökmlərini öyrənməkdən bəhrələnirlər.",
    ],
    hadith: [
      {
        excerpt:
          "Aişə (radiyallahu anhə) nə üçün heyzli qadının namaz qılmır, orucun qəzasını tutması ilə bağlı suala belə cavab verdi: “Bizə oruc tutmaq əmr olundu, namazın qəzası isə əmr olunmadı. (Muazha, Aişədən; həmçinin Səhih Müslim 335)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Tez-tez verilən suallar",
    summary: "Ən çox görülən təmizlənmə narahatlıqlarına və şübhələrinə qısa cavablar.",
    body: [
      "Şübhə dəstəmazımı pozarmı? Xeyr. Əgər dəstəmaz almısınızsa və onu pozub-qalmadığınıza əmin deyilsinizsə, batil olduğuna əmin olana qədər dəstəmazınız dayanır. Şübhə üzərində yəqinliklə hərəkət etmək sizi vəsvəsə (vəsvas) şübhədən qoruyan peyğəmbərlik prinsipidir.",
      "Bəs gipslər, sarğılar və yaralar? Güzəştlər var. Üzü örtülmüş əzanın yuyulmasının zərərli olduğu yerdə paltarın (məş əl-cəbirə) yerinə məsh çəkə bilərsiniz, təyəmmüm isə əlçatmaz olanı örtür - təfərrüatlar məktəbə və vəziyyətə görə dəyişir.",
      "Mən ümumiyyətlə sudan istifadə edə bilməsəm nə olar? Təmiz torpaqla təyəmmüm, sudan istifadə etmək imkanı qayıdana qədər tam qüvvədə qalır.",
      "Bəs xroniki vəziyyətlər - davamlı qanaxma (istihadə) və ya sidik tutmamaq? Daimi üzr (mədhur) ilə şəxsə rəftar edilir: təmizlənir və hər namazın vaxtı üçün dəstəmaz alır, sonra axıntı davam etsə belə namaz qılır və bu namazı batil etmir.",
    ],
    actions: [
      "Daimi şübhənin ibadətinizə mane olmasına imkan verməyin - şübhəyə deyil, yəqinliyə əməl edin.",
      "Xroniki vəziyyətlər və ya mürəkkəb hallar üçün ixtisaslı alimdən fərdi qərar alın.",
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Bu FAQ cavabları şəxsi fətva deyil, maarifləndirici xülasələrdir. Mürəkkəb və ya xroniki hallar yerli alimlə nəzərdən keçirilməlidir.",
  },
  {
    title: "İstinadlar və Əlavə Tədqiqat",
    summary: "Təmizliyə dair əsas Qur'an ayələri və hədis fəsilləri.",
    body: [
      'Təmizlənmək üçün əsas Qur\'an mətni dəstəmaz, qüsl və təyəmmümü bir araya gətirən dəstəmaz ayəsi olan Maidə surəsi 5:6; Bununla yanaşı, 2:222 ("Allah pak olanları sevir") və suyun paklığına dair ayələr (25:48) mövzunu əsaslandırır.',
      "Sünnədə əsas mənbələr Səhih əl-Buxari və Səhih Müslimi açan Təmizləmə Kitablarıdır (Kitab-ət-Təharə / əl-Vudu / əl-Qüsl / əl-Heyd), ardınca dörd sünnənin eyni fəslləri (Əbu Davud, ət-Tirmizi, ən-Nəsai, İbn-Rəhman, İbn-Rəhman)dır.",
      "Tətbiqi hökmlər üçün dörd sünni məktəbinin klassik fiqh kitabçaları ətraflı mövqelər verir - və onların fərqləri nöqsan deyil, ənənənin qanuni hissəsidir. Strukturlaşdırılmış icmal üçün bu moduldan istifadə edin, sonra ixtisaslı müəllim və əsas mətnlərlə işinizi dərinləşdirin.",
    ],
    quran: [{}, {}],
    hadith: [
      {
        excerpt: "Məcmuəni açan dəstəmaz, qüsl, təyəmmüm və heyd haqqında geniş fəsillər.",
      },
      {
        excerpt:
          "Təmizləmə kitabı — təharət hökmləri, ədəb və prinsipləri haqqında səhih xəbərlər.",
      },
    ],
    actions: [
      "Səpələnmiş qərarlardan çaşqınlığın qarşısını almaq üçün etibarlı bir kurrikuluma əməl edin.",
      "Praktik etimad sabit olana qədər bu mövzuları vaxtaşırı nəzərdən keçirin.",
    ],
    appLinks: [{}, {}],
  },
];

export const TAHARAH_CHECKLIST_AZ: DeepPartial<TaharahChecklistItem>[] = [
  {
    title: "Sübhdən əvvəl dəstəmaz",
    hint: "Günə mümkün olduqca təmiz bir vəziyyətdə başlayın.",
  },
  {
    title: "Misvak / dişləri fırçalamaq",
    hint: "Dəstəmazdan əvvəl və namazdan əvvəl bir sünnə.",
  },
  {
    title: "Nəcasətsiz namaz paltarı",
    hint: "Namazdan əvvəl görünən nəcis olub olmadığını yoxlayın.",
  },
  {
    title: "Təmiz namaz yeri",
    hint: "Namaz qıldığınız yerdən murdar hər şeyi çıxarın.",
  },
  {
    title: "Dəstəmazı batil edənlərdən sonra təzələyin",
    hint: "Külək, yuxu, tualet - bil ki, dəstəmazı pozur.",
  },
  {
    title: "Lazım olduqda qüsl almaq",
    hint: "Böyük murdarlıqdan sonra heyz bitər və ya doğuşdan sonrakı qanaxma.",
  },
];
