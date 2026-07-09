// Azerbaijani translation overlay for the Learn Salah guide content. Mirrors the order of
// its English source in ../salah-guide*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { SalahGuidePhrase, SalahGuideTopic } from "../../types/salah-guide";
import type { DeepPartial } from "./localize";

export const SALAH_GUIDE_TOPICS_AZ: DeepPartial<SalahGuideTopic>[] = [
  {
    title: "Namaz nədir?",
    summary: "İslamın ikinci sütunu – sizin Allahla gündəlik görüşünüz.",
    body: [
      "Namaz Allahın hər bir mömin üçün vacib etdiyi rəsmi ibadətdir: hər gün müəyyən edilmiş beş vaxtda qılınan qiyam, rüku (rüku) və səcdə (səcdə) ardıcıllığı, hər gün müəyyən edilmiş beş vaxtda qılınan həmd, Qur'an və dua ilə birləşir. Namaz sözü ərəb kökündən gəlir, əlaqə və yalvarma mənasını verir - bu, möminin birbaşa, vasitəçi olmadan Yaradanla əlaqəsidir, kahinə və şəfaətçiyə ehtiyacı yoxdur.",
      "Təkcə tam rükət namaza - ikinci səcdəyə qədər ayaq üstə durana - rükət deyilir. Namazlar rükətlərdə sayılır: Sübh iki, məğrib üç, zöhr, əsr və işa dörddür. Vacib namazlara fərz deyilir; Peyğəmbərin (sallallahu aleyhi və səlləm) mütəmadi olaraq qıldığı namazlar sünnət, nafilə qılınan namazlar isə nəfsdir.",
      "Sütunlar arasında özünəməxsus bir cəhəti odur ki, namaz yerə enən mələk vasitəsilə nazil edilməmişdir, ancaq Peyğəmbər ﷺ gecə səfərində (əl-İsra vəl-Mirac) səmalara qaldırılarkən birbaşa ona fərz edilmişdir. Əvvəl əlli namaz fərz edildi, sonra Peyğəmbərin (sallallahu aleyhi və səlləm) ümmətinə rahatlıq gətirmək üçün dəfələrlə qayıtması ilə əlli savabı saxlanılmaqla əməldə beşə endirildi.",
      "Buna görə də namaz İslam həyatının tam mərkəzində oturur: gündə beş dəfə təkrarlanır, işi, istirahəti və istirahəti yarımçıq qoyur ki, qəlbi Allaha qaytarsın və bu, bəndənin Qiyamət günü hesaba çəkiləcəyi ilk əməldir. Səs tapılarsa, qeydin qalan hissəsi izlənməyə meyllidir.",
    ],
    quran: [
      {
        excerpt:
          "O kəslər ki, qeybə inanır, namaz qılır və onlara verdiyimiz ruzidən xərcləyirlər.",
      },
      {
        excerpt:
          "Kitabdan sənə vəhy olunanı oxu və namaz qıl. Həqiqətən, namaz əxlaqsızlıqdan və pis əməllərdən çəkindirər və Allahı zikr etmək daha böyükdür.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Gecə səfərində Allah əlli namazı fərz etdi; Peyğəmbər ﷺ onlar beş yaşına çatana qədər geri qayıdıb şəfa diləyirdi: “Bunlar beşdir, bunlar da əllidir, çünki Mənimlə olan söz dəyişməz”. (həmçinin Səhih Müslim 162)",
      },
      {
        excerpt:
          "Qiyamət günü qulun hesaba çəkiləcəyi ilk şey onun namazıdır; Əgər səhih olarsa, qalan əməlləri də səhihdir. (həmçinin Əbu Davud 864, ən-Nəsai 3991)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Niyə Namaz?",
    summary: "Beş vaxt namazın mənəvi, əxlaqi, psixoloji və əbədi bəhrələri.",
    body: [
      "Namaz Allahla birbaşa söhbətdir. Onun mövqeyində sən Ona Öz vəhy etdiyi sözləri ilə müraciət edirsən; səcdədə - hədsiz dərəcədə təvazökarlıq - sən Ona ən yaxınsan və cavabını alacaqsan. Başqa heç bir ibadət bu qədər tez-tez və ya yaxından təkrar olunmur.",
      "Onun ilk meyvəsi təmkinli, nizam-intizamlı bir ruhdur. Allah Özü buyurur ki, namaz düzgün qurulduqda 'əxlaqsızlıqdan və pis işlərdən çəkindirər' (29:45): Gündə beş dəfə Allahın hüzurunda duran şəxs günaha yaxınlaşmaqda daha çətin olar. Bu, həm də təkrar təmizlənmədir - Peyğəmbər beş vaxt namazı, heç bir kir qoymadan gündə beş dəfə yuyunduğu axan bir çaya bənzətmişdir.",
      "Onun ikinci meyvəsi daxili dinclikdir. Qur'an vəd edir ki, qəlblər Allahı zikr etməklə rahatlıq tapır və Peyğəmbər (sallallahu aleyhi və səlləm) narahatlıq anlarında namaza çağıraraq: “Bununla bizə rahatlıq ver, ey Bilal” deyər. O, gözlərinin ləzzətini namaza qoyulması ilə izah etdi.",
      "Onun ictimai və əbədi bəhrələri mənzərəni tamamlayır: Camaat namazı zəngin və kasıbı bir sıraya düzərək qardaşlıq qurur, namazı qorumaq isə Allahın məğfirətinə və Cənnətə aparan ən etibarlı yollardandır. Peyğəmbər (sallallahu aleyhi və səlləm) sübh və əsrin iki “sərin” namazını qoruyan şəxsə Cənnəti vəd etmişdir.",
    ],
    quran: [
      {
        excerpt:
          "Həqiqətən, mən Allaham. Məndən başqa məbud yoxdur, Mənə ibadət et və Məni zikr etmək üçün namaz qıl.",
      },
      {
        excerpt: "Həqiqətən, möminlər nicat tapdılar – o kəslər ki, namazda təvazökarlıq edirlər.",
      },
    ],
    hadith: [
      {
        excerpt:
          "“Əgər birinizin qapısının ağzında gündə beş dəfə yuyunduğu bir çay olsa, onun üzərində kir qalarmı?” Dedilər: “Yox”. O, (sallallahu aleyhi və səlləm) buyurdu: “Beş vaxt namazın məsəli budur ki, Allah onlarla günahları yox edər”. (həmçinin Səhih Müslim 667)",
      },
      {
        excerpt: "Hər kim iki sərin namazı - Sübh və Əsr namazını qılarsa, Cənnətə daxil olar.",
      },
      {
        excerpt:
          "Sənin aləmindən mənə sevimli qadınlar və ətirlər verildi və gözümün sərinliyi duada oldu.",
      },
    ],
    actions: [
      "Bu gün yalnız bir namazı tam vaxtında qılın - birinci məqsəd mükəmməllik deyil, ardıcıllıqdır.",
      "Cavab aldığınızı hiss etmək üçün növbəti namazınızdan əvvəl bir dəfə Fatihə surəsinin mənasını oxuyun.",
      "Azan xatırlatmalarını yandırın ki, heç bir dua pəncərəsi diqqətdən kənarda qalmasın.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "İslamda onun dərəcəsi",
    summary: "Dinin sütunu - və laqeyd ediləcək ən ağır əməl.",
    body: [
      "Peyğəmbər (sallallahu aleyhi və səlləm) İslamın beş sütun üzərində qurulduğunu, namazın isə imanın iki şəhadətindən dərhal sonra ikinci olduğunu öyrətdi. Şəhadət sizi İslama qəbul edir; dua şəhadətin qəlbinizdə yaşadığının daimi sübutudur. Elə buna görə də alimlər namazı “dinin sütunu” adlandırırlar – mərkəzi sütunu dağılmayan ev.",
      "Onun çəkisi mətnlərin ona məhəl qoymamaqdan bəhs etməsində görünür. Qurani-kərim “namazı tərk edən və nəfsani istəklərin arxasınca gedən” bir nəsildən xəbərdar edir və onların məhv olacağından xəbər verir və Peyğəmbər (s) namazı imanı küfrdən ayıran əhd-peyman kimi təsvir etmişdir.",
      "Namazı tərk edənin hökmü ilə bağlı əhli-sünnə alimləri arasında tanınmış və hörmətli ixtilaf vardır. Bəziləri hesab edir ki, onu qəsdən tamamilə tərk etmək - vacib olduğunu təsdiqləyərək - insanı İslamdan çıxaran böyük küfrə bərabərdir; Əksəriyyət (Hənəfi, Maliki, Şafii) belə bir şəxsin vacibliyini inkar etmədiyi təqdirdə böyük günahlardan birinə görə günahkar müsəlman olaraq qaldığını düşünür. Hamı həmfikirdir ki, namazı tərk etmək fəlakətdir və kim namazı inkar edərsə, icma ilə İslamı tərk etmişdir.",
      "Praktik dərs hər baxışda eynidir: beş vaxt namazı qorumaq mömin üçün ixtiyari və ya razılaşmaq olmaz. Nafilə namazlar (sünnə və nəfl) daha sonra qiyamət günü vacib namazların əskiklərini yerinə yetirərək təhlükəsizlik şəbəkəsi rolunu oynayır.",
    ],
    quran: [
      {
        excerpt: "Namazı və orta namazı ehtiyatla qılın və Allah qarşısında itaətkar olaraq durun.",
      },
      {
        excerpt:
          "Onların ardınca namazı tərk edən və nəfslərin istəklərinə uyan xəlifələr gəldi. Beləliklə, onlar pisliklə qarşılaşacaqlar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "İslam beş üzərində qurulmuşdur: Allahdan başqa ilah olmadığına və Muhəmmədin Onun Rəsulu olduğuna şəhadət vermək, namaz qılmaq, zəkat vermək, həcc və Ramazan orucunu tutmaq. (həmçinin Səhih əl-Buxari 8)",
      },
      {
        excerpt:
          "Bizimlə onların arasında olan əhd namazdır. kim onu ​​tərk edərsə, kafir olmuşdur. (Bureydə; həmçinin ən-Nəsai, İbn Macə 1079)",
      },
      {
        excerpt: "Kişi ilə küfr və bütpərəstlik arasında namazı tərk etmək durur. (Cabir)",
      },
    ],
    disclaimer:
      "Namazı tənbəllik (çoxluq üçün böyük günah; başqaları üçün küfr) üzündən tərk edən şəxslə, vacibliyini inkar edən şəxslə (icma ilə küfr) namazı tərk edənin dəqiq hökmü barədə alimlər ixtilaf edirlər. Bu proqram hər hansı bir şəxs haqqında hökm çıxarmır - şəxsi işlər üçün ixtisaslı alimlə məsləhətləşin.",
  },
  {
    title: "Kim dua etməlidir?",
    summary:
      "Hər bir ağlı başında olan, yetkin müsəlman - aydın şəkildə müəyyən edilmiş istisnalar və güzəştlərlə.",
    body: [
      "Namaz ağlı başında olan və həddi-büluğa çatmış hər bir müsəlmana vacib olur. Üç qrup səhih bir prinsiplə məsuliyyətdən tamamilə uzaqlaşdırılır: yuxudan oyanana qədər, uşaq yetkinləşənə qədər və əqli cəhətdən zəif olanlar sağlam ağıl gələnə qədər.",
      "Uşaqlar hələ məcburi deyillər, lakin tədricən öyrədilirlər. Həzrət Peyğəmbər (s) buyurmuşdur ki, uşaqlara yeddi yaşından namaz qılmağı əmr etsinlər və on yaşında namazı tərk etdiklərinə görə yumşaq bir şəkildə tərbiyə olunsunlar ki, həddi-büluğa çatanda namaz qəfil yük deyil, artıq sabit bir vərdiş olsun.",
      "Heyz (heyd) və ya nifas (nifas) halında olan qadınlar o vaxt namaz qılmazlar; rəhmət və alimlərin razılaşdığı hökmlə qəza edilən vacib namazlar sonra qəza edilmir. (Qatılan oruclar, namazdan fərqli olaraq qəza edilir.) Qadın qan qurtardıqdan və qüsllə paklandıqdan sonra namaza davam edər.",
      "Əsl bacarıqsızlıq güzəşt gətirir, heç vaxt ləğv edilmir: ağır xəstəlik, şüursuzluq və hədsiz qorxu insanı bir müddət bəhanə edə bilər və xəstə öz imkanlarına uyğun olaraq dua edir - oturmaq, yalan danışmaq və ya hətta jestlərlə. Səyahət namazı aradan qaldırmır, lakin Səyahət bələdçisində əhatə olunan qısaltmaqla (qəsr) və birləşdirməklə (mürəbbə) asanlaşdırır.",
    ],
    hadith: [
      {
        excerpt:
          "Övladlarınıza yeddi yaşında namaz qılmağı əmr edin, on yaşında onlara namaz qılmağı əmr edin və yataq yerlərini ayırın. (Amr ibn Şueyb atasından babasından)",
      },
    ],
    quran: [
      {
        excerpt: "Ailənə namaz qılmağı əmr et və ona səbir et.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Namazdan əvvəl şərtlər",
    summary: "Namazın səhih olması üçün mövcud olan doqquz şərt (şurut).",
    body: [
      "Namazın səhih olmasından əvvəl müəyyən şərtlərə (şurutus-sala) əməl edilməlidir. Şərt sütundan fərqlənir: şərtlər siz başlamazdan əvvəl gələn və davam edən ilkin şərtlərdir, sütunlar (arkan) isə namazın özünün hissələridir. Əgər tələb olunan şərt əskik olarsa, nə qədər yaxşı qılınsa da, namaz qəbul olunmur.",
      "Bu doqquzu uçuşdan əvvəl yoxlama siyahısı kimi düşünün. Əksəriyyəti bu təlimatın başqa yerində daha dolğun dərsə qoşulur – hər birini dərindən öyrənmək üçün toxunun. Onlardan ikisi (üzünü qibləyə və düzgün vaxta) həqiqi acizlikdə üzürlü ola bilər; qalanları isə hər kəsin gücü çatdıqda qəti şəkildə tələb olunur.",
    ],
    steps: [
      {
        title: "İslam",
        body: "Namaz müsəlmanın işidir; İslama daxil olana qədər qeyri-müsəlman üçün nə düzgündür, nə də ona vacib deyildir.",
      },
      {
        title: "Sağlam ağıl ('aql)",
        body: "İnsan sağlam ağıl sahibi olmalıdır. Sağlamlığını itirmiş şəxs bu vəziyyətdə olarkən heç bir məsuliyyət daşımır.",
      },
      {
        title: "Ayırma (tamyiz)",
        body: "Ayırma qabiliyyəti təxminən yeddi yaşa çatdı - uşaqlara dua etməli olduğu yaş.",
      },
      {
        title: "Kiçik və böyük murdarlığın (hədəsdən təharənin) çıxarılması",
        body: "Düzgün dəstəmaz və ya böyük nəcasətdən sonra qüsl və ya sudan istifadə oluna bilməyəndə təyəmmüm.",
      },
      {
        title: "Pisliyi aradan qaldırmaq (nəcasə)",
        body: "Bədən, paltar və namaz qılınan yer sidik, miqdar qan və sair sadalanan maddələr kimi ritual çirkinliklərdən təmizlənməlidir.",
      },
      {
        title: "Əvrətin örtülməsi",
        body: "Örtülməli olan hissələr təmiz, qeyri-şəffaf paltarla örtülmüşdür — Geyim və övrət dərsinə baxın.",
      },
      {
        title: "Namaz vaxtı daxil oldu",
        body: "Hər bir namazın müəyyən bir pəncərəsi var; vaxtı başlamamış namaz qılmaq batildir. Cədvəlinizdən və xatırlatmalarınızdan istifadə edin.",
      },
      {
        title: "Üzü qibləyə",
        body: "Müəyyən edə biləcəyiniz qədər yaxından Kəbəyə tərəf dönmək - yalnız həqiqi qabiliyyətsizliyə görə üzrlüdür.",
      },
      {
        title: "Niyyət (niyyah)",
        body: "Hansı namazı qılmaq fikrində olduğunuzu ürəkdə həll etmək. Bu daxili bir hərəkətdir və ucadan deyilmir.",
      },
    ],
    appLinks: [{}, {}, {}],
    disclaimer:
      "Məktəblər şərtləri bir qədər fərqli şəkildə ifadə edir və hesablayırlar (bəziləri şərtləri deyil, niyəti sütunlar arasında qeyd edirlər). Maddə razılaşdırılıb.",
  },
  {
    title: "Təmizləmə (Tahara)",
    summary: "Nəfsin, geyimin və məkanın saflığı - hər duanın qapısı.",
    body: [
      "Təharət, Allahın hüzurunda pak halda durasınız deyə, murdarlığı qaldırmaq deməkdir. Allah paklananları sevir və Peyğəmbər (sallallahu aleyhi və səlləm) “təmizlənmək imanın yarısıdır” demişdir. Onsuz heç bir dua qəbul olmaz.",
      "Nəcis iki cürdür. Tualetə getmək və ya küləkdən ötrü əmələ gələn kiçik nəcasət (hədəs əsğər) dəstəmazla götürülür. Böyük nəcasətlər (hədəs əkbər və ya cənab) – yaxınlıq, boşalma və ya heyz və doğuşdan sonrakı qanaxmadan sonra – tam qüsllə götürülür.",
      "Bu ayin hallarından ayrı olaraq, sidik, nəcis, axan qan və bu kimi maddi çirkinliklər bədəndən, paltardan və namaz qıldığınız yerdən fiziki olaraq təmizlənməlidir. Düzgün dəstəmaz almaq mümkündür, lakin namazdan əvvəl paltarınızdakı ləkəni təmizləmək lazımdır.",
      "Su əsas təmizləyicidir. Su həqiqətən əlçatmaz olduqda və ya xəstəlik və ya şiddətli soyuqluq səbəbindən sizə zərər verərsə, İslam tamamilə əvəzedici olaraq təyəmmümə icazə verir - təmiz torpaqdan istifadə edərək quru təmizləmə. Təmizlənmə heç vaxt çətinliyə çevrilmir; yaxınlaşmaq üçün bir vasitədir.",
    ],
    hadith: [
      {
        excerpt: "Təmizlənmə imanın yarısıdır... (Əbu Malik əl-Əşari)",
      },
    ],
    quran: [
      {
        excerpt: "Həqiqətən, Allah tövbə edənləri və pak olanları sevər.",
      },
    ],
    actions: [
      "Növbəti namazdan əvvəl dəstəmazı addım-addım öyrənin ki, hər bir üzv düzgün yuyulsun.",
      "Əgər çirkli bir mühitdə işləyirsinizsə, namaz üçün ayrılmış təmiz paltarı saxlayın.",
      "Döşəməni qoymazdan əvvəl görünən çirklənmə üçün dua yerinizə nəzər salın.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "dəstəmaz — dəstəmaz almaq",
    summary: "Kiçik murdarlığı qaldıran və sizi namaza hazırlayan əmrli yumaq.",
    body: [
      "Dəstəmaz kiçik murdarlığı aradan qaldıran yuyunma mərasimidir. Hər bir namazdan əvvəl, əgər əvvəlki namazdan hələ də düzgün vəziyyətdə deyilsinizsə və - əksər alimlərin fikrincə - Qur'anın fiziki mətninə toxunmadan əvvəl tələb olunur. Onun dörd vacib yuyulmasının adı Quranda (5:6) birbaşa olaraq qeyd edilmişdir: üz, qolları dirsəklərə qədər, başına məsh çəkmək və ayaqları topuğa qədər.",
      "Peyğəmbər (s) nizamlı qaydada, yuyulmuş üzvlər üçün üç dəfə, hərtərəfli, lakin suyu israf etmədən dəstəmaz alırdı - hətta axan çayda belə israfçılıqdan çəkindirirdi. Dörd vacib əməldən başqa, ağız və burnu yaxalamaq, əvvəlcə əlləri yumaq və misvakdan istifadə etmək dəstəmazı tamamlayan və gözəlləşdirən sabit sünnələrdəndir.",
      "Onun savabı böyükdür: Peyğəmbər (s) öyrədir ki, mömin hər bir üzvünü yuduqca, o üzvün etdiyi günahlar su ilə, hətta dırnaqların altından da olsa, tökülür və o, təmizlənmiş halda çıxır. Buna görə də dəstəmaz sadəcə bir rəsmiyyət deyil, hər namazdan əvvəl kiçik bir bağışlanmadır.",
      "Dəstəmaz şəxsi keçidlərdən çıxan hər şeylə (sidik, nəcis, külək), şüuru aradan qaldıran dərin yuxu ilə və huşunu itirməklə pozulur. Namaz əsnasında pozularsa, dayanıb dəstəmaz almalı və yenidən namaza başlamalısınız.",
    ],
    steps: [
      {
        title: "Niyyət & Bismillah",
        body: 'Qəlbində dəstəmazı niyyət et və "Bismillah" ilə başla. Niyyət daxildədir və dilə gətirilməyə ehtiyac yoxdur.',
        tip: "Mümkünsə, misvakı əvvəlcədən istifadə edin - Peyğəmbərin (sallallahu aleyhi və səlləm) sevdiyi və az qala vacib etdiyi bir sünnə.",
      },
      {
        title: "Əlləri yuyun",
        body: "Hər iki əlinizi biləklərə qədər üç dəfə yuyun, barmaqlar arasında işlək su.",
      },
      {
        title: "Ağzını yuyun",
        body: "Ağzınıza su götürün, onu fırladın və çıxarın - üç dəfə.",
      },
      {
        title: "Burnu yuyun",
        body: "Sağ əlinizlə burun dəliklərinə su çəkin və sol əlinizlə üç dəfə çıxarın.",
      },
      {
        title: "Üzü yumaq (fərz)",
        body: "Saç düzümündən çənəyə və qulaqdan qulağa qədər bütün üzü birdən üç dəfə yuyun; kişi yaş barmaqlarını qalın saqqalın arasından keçir.",
      },
      {
        title: "Qolları yumaq (fərz)",
        body: "Sağ qolu, sonra solu, barmaqların ucundan dirsəklərə qədər hər biri üç dəfə yuyun.",
      },
      {
        title: "Başa məsh çəkmək (fərz)",
        body: "Yaş əllərlə başı bir dəfə qabaqdan arxaya və yenidən arxaya məsh edin, sonra qulaqların içini və arxasını eyni yaşla məsh edin.",
      },
      {
        title: "Ayaqları yumaq (fərz)",
        body: "Sağ ayağı, sonra solu, topuqlara qədər yuyun - hər biri üç dəfə, barmaqları barmaqların arasından keçirin.",
      },
      {
        title: "İmanın şəhadəti",
        body: "“Əşhədu ən la ilahə illəllah...” duası ilə tamamlayın – dəstəmazdan sonra Cənnətin səkkiz qapısı açılar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qul dəstəmazda üzünü yuyanda gözləri ilə baxdığı hər günah su ilə birlikdə çıxır... günahdan təmizlənmiş halda çıxana qədər.",
      },
    ],
    quran: [
      {
        excerpt:
          "Ey iman gətirənlər, namaza qalxdığınız zaman üzünüzü və dirsəklərə qədər qollarınızı yuyun, başınıza məsh çəkin, topuqlara qədər ayaqlarınızı yuyun.",
      },
    ],
    actions: [
      "Hər addımı ucadan oxuyarkən, dirsəkləri və dabanları yoxlayaraq bir dəfə yavaş-yavaş dəstəmaz alın.",
      "Dəstəmazdan sonra qısa duanı əzbərləyin — Namaz kəlmələrinə baxın.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Geyim və avrat",
    summary: "Örtülməli olanı örtün - təmiz, təvazökar və hörmətlə.",
    body: [
      'Övrəti örtmək - bədənin gizlədilməli olan hissələri - Allahın "hər namaz yerində zinətini götür" əmrindən irəli gələn səhih namazın şərtidir (7:31). Paltar nəcasədən təmiz və o qədər şəffaf olmalıdır ki, dəri rəngi görünməsin.',
      "Kişilər üçün namazın övrəti ən azı göbəkdən dizə qədərdir. Lakin paltar olanda sinə çılpaq namaz qılmaq məkruhdur; Peyğəmbər (salləllahu aleyhi və səlləm) buyurmuşdur ki, kişi çiynində bir hissəsi olmayan bir paltarda namaz qılmasın.",
      "Qadınlar üçün əksər alimlərin nəzərinə görə, üz və əllərdən başqa bütün bədəni namazda övrətdir; qadın saçını, boynunu və ayaqlarını adətən boş paltar və baş örtüyü ilə örtür. Alimlər ayaqlara görə fərqlənirlər, bəziləri onları göstərilə biləcək şeylərə daxil etdiyini nəzərə alır - onlarla örtülü dua etmək daha təhlükəsiz və əksəriyyət praktikasıdır.",
      "Namazdan kənarda da iki paltar hökmü var: ipək və qızılı kişilərə geyinməsi haramdır (qadınlar üçün icazəlidir) və paltar o qədər dar, şəffaf və diqqəti cəlb edən olmamalıdır ki, təvazökarlıq namazına qalib gəlsin. Bir qayda olaraq, gecə paltarı və ya çimərlik paltarı deyil, hörmət etdiyiniz bir insanla görüşmək üçün geyinəcəyiniz paltarda dua edin.",
    ],
    quran: [
      {
        excerpt: "Ey Adəm övladları, hər namaz yerində zinətinizi götürün.",
      },
    ],
    actions: [
      "Bir təmiz, təvazökar paltar və ya xüsusi bir namaz paltarı ayırın ki, hər zaman hazır olasınız.",
      "Bir şeyin kifayət qədər əhatə edib-etmədiyindən əmin deyilsinizsə, az deyil, daha çox örtün.",
    ],
    disclaimer:
      "Əvrətin təfərrüatları (xüsusilə qadının ayaqları) hörmətli elmi fərq nöqtəsidir. Fərqli olduğunuz yerlərdə etibarlı yerli təqaüdü izləyin.",
  },
  {
    title: "Namaz vaxtları",
    summary: "Beş gündəlik pəncərə - hər bir namazın başlanğıcı, sonu və üstünlük verilən anı var.",
    body: [
      "Allah gecəni və gündüzü günəşin hərəkətinə bağlı beş pəncərəyə bölərək namazı “müəyyən vaxtlarda” təyin etmişdir (4:103). Pəncərə açılmamış namaz qılmaq batildir; Namazı üzrsüz olaraq pəncərənin qarşısından gecikdirmək böyük günahdır. Mümkünsə, pəncərədə erkən namaz qıl - Peyğəmbər (sallallahu aleyhi və səlləm) ilk dəfə namazı Allah yanında ən sevimli əməllərdən adlandırmışdır.",
      "Beş pəncərə bunlardır: Sübh, sübhdən günəş çıxana qədər; Zöhr, günəşin öz zirvəsindən keçməsindən bir obyektin kölgəsi öz uzunluğuna bərabər olana qədər; Əsr, zöhrün sonundan gün batana qədər (ən yaxşı dua günəşin saralmasından əvvəl); Məğrib, gün batmasından qırmızı alaqaranlığa qədər; və İşa, toranlığın sönməsindən həqiqi səhərə qədər (ən yaxşısı gecə yarısından əvvəl dua edilir).",
      "Nafilə namazın haram olduğu üç qısa müddət vardır ki, ibadət heç vaxt günəşə ibadətlə qarışdırılmasın: günəş tam doğduğu zaman doğduğu zaman, günorta çağı tam öz zirvəsində dayandığı zaman və tam batana qədər batdığı zaman. Qəza edilən vacib namazın qəzası bu qadağadan istisnadır.",
      "Dəqiq saat vaxtları sizin genişliyinizə və mövsümünüzə görə gündəlik dəyişir, buna görə də Peyğəmbər (sallallahu aleyhi və səlləm) onları sabit saatdan çox təbii əlamətlərə bağlamışdır. Tətbiq onları yerinizə görə hesablayır – lakin əsas əlamətləri bilmək texnologiya əlçatan olmayanda sizi əsaslı saxlayır.",
    ],
    steps: [
      {
        title: "Sübh - 2 rükət fərz",
        body: "Günəş çıxana qədər əsl səhər. Güclü vurğulanan 2 rükət sünnətdən əvvəl.",
      },
      {
        title: "Zöhr — 4 rükət fərz",
        body: "Günəş öz zirvəsini keçdikdən sonra əsrin kölgəsinə qədər. 4 əvvəl və sonra 2 sünnət.",
      },
      {
        title: "Əsr — 4 rükət fərz",
        body: "Zöhrün sonundan gün batana qədər; günəş sarıdan əvvəl dua edin. Tez-tez 2:238-in 'orta duası' ilə eyniləşdirilir.",
      },
      {
        title: "Məğrib — 3 rükət fərz",
        body: "Gün batımından toran düşənə qədər; tez dua edin. 2-dən sonra sünnəti.",
      },
      {
        title: "İşa — 4 rükət fərz",
        body: "Alatoranlığın sönməsindən səhərə qədər; ən yaxşısı gecə yarısından əvvəl. Witr izlədi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Peyğəmbərin (sallallahu aleyhi və səlləm) bizə namaz qılmağı qadağan etdiyi üç vaxt vardır: Günəş çıxana qədər, günorta dayananda və batan zaman batana qədər. (Uqbə ibn Amir)",
      },
    ],
    quran: [
      {
        excerpt: "Həqiqətən, namaz möminlərə müəyyən vaxtlarda fərz edilmişdir.",
      },
      {
        excerpt:
          "Günün iki başında və gecəyə yaxınlaşanda namaz qıl. Həqiqətən, yaxşı əməllər pis əməlləri uzaqlaşdırır.",
      },
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Əsrin başlanğıcında iki rəy bildirilmişdir (kölgə obyektin uzunluğuna bərabər və ya iki dəfə). Hər ikisi etibarlıdır; yerli hesablamanıza və icmanıza əməl edin.",
  },
  {
    title: "Üzü qibləyə",
    summary: "Məkkədə Beytül-həram tərəfə - ümməti birləşdirən istiqamətə dönün.",
    body: [
      "Qiblə Məkkədə Məscidül-Həram daxilində Kəbənin istiqamətidir. Onunla qarşılaşmaq namazın səhih şərtidir. İslamın ilk dövrlərində müsəlmanlar Yerusəlimə doğru dua edirdilər; sonra Allah Məscidülhərama tərəf yönəlməyi əmr etdi və o vaxtdan bəri dünya ibadətçilərini bir istiqamət birləşdirdi - bir Rəbbə üz tutan bir cəmiyyətin gündəlik, fiziki ifadəsi.",
      "Səyahət zamanı kompas, məscid mehrabı, etibarlı proqram və ya günəş və ulduzlar ilə əsaslı şəkildə müəyyən edə biləcəyiniz qədər qibləyə üz tutmağınız tələb olunur. Kiçik, qaçınılmaz bir sapma bağışlanır; əsas olan düzgün istiqamətə doğru səmimi səydir.",
      "Əgər sən istiqaməti həqiqətən müəyyən edə bilmirsənsə - dənizdə, buludda, gecələr naməlum torpaqda itirsən - onu işlətməyə çalışırsan və sonra ən yaxşı qərarın üçün dua edirsən; namazı sonradan azacıq da olsa səhihdir. Vacib namaz üçün üzünü qibləyə qılmaq qeyri-mümkün olan hərəkətdə olan nəqliyyat vasitəsində və ya təyyarədə bacardığınız qədər üz-üzə gələ bilərsiniz, çünki Allah heç kəsə gücündən artıq yük verməz.",
    ],
    quran: [
      {
        excerpt:
          "Elə isə üzünü Məscidül-Harama çevir. Harada olursunuzsa olun, üzünüzü ona tərəf çevirin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Namaza qalxdıqda yaxşı dəstəmaz al, sonra üzü qibləyə və təkbir de. (pis namaz qılan kişinin hədisindən)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Azan - azan",
    summary: "Ümməti çağıran sözlər, onların mənası və onlara necə cavab verilməlidir.",
    body: [
      "Azan, namaz vaxtının daxil olduğunu bildirən azandır. Beş vaxt namaz (bayram və ya cənazə namazı üçün deyil) üçün camaatın ibadət üçün toplanması üçün hündür yerdən qılınan ümumi sünnətdir. Bunun ardınca, namaz başlamazdan əvvəl, ikinci, daha qısa çağırış - iqamə gəlir.",
      "Azan eşitdiyiniz zaman sünnət, müəzzindən sonra hər bir cümləni təkrarlamaqdır - “Həyyə əl-səlah” və “Həyyə əl-fəlah” istisna olmaqla, burada “Lə həvlə və la qüvvətə illə billah” (Allahdan başqa heç bir güc və qüvvə yoxdur) deyirsiniz. Sübh azanında azanı “Əs-sələtu xeyrun min ən-nəvm” (namaz yuxudan yaxşıdır) əlavə edir.",
      "Azan bitdikdən sonra Peyğəmbərə salavat göndərin, sonra Allahdan ona həmd məqamı (əl-vəsilə) bəxş etməsini istəmək üçün sabit duanı oxuyun. Azanla iqamə arasındakı an duanın geri qaytarılmadığı bir vaxtdır, ona görə də duanı sərbəst edin.",
    ],
    steps: [
      {
        title: "Allahu Əkbər (×4)",
        body: "Allah ən böyükdür - səni yayındıra biləcək hər şeydən daha böyükdür.",
      },
      {
        title: "Əşhədu ən lə ilahə illəllah (×2)",
        body: "Şəhadət verirəm ki, Allahdan başqa tanrı yoxdur.",
      },
      {
        title: "Əşhədu ənna Muhəmmədən Rəsulullah (×2)",
        body: "Şəhadət verirəm ki, Muhəmməd Allahın Rəsuludur.",
      },
      {
        title: "Həyya ələs-səlah (×2)",
        body: "Namaza gəl. Cavab: Lə həvlə və lə qüvvətə illə billah.",
      },
      {
        title: "Həyya əl-fəlah (×2)",
        body: "Uğura gəlin. Cavab: Lə həvlə və lə qüvvətə illə billah.",
      },
      {
        title: "Allahu Əkbər (×2)",
        body: "Allah ən böyükdür.",
      },
      {
        title: "Lə ilahə illəllah",
        body: "Allahdan başqa heç bir tanrı yoxdur - çağırış ona açılan eyni kəlmə ilə bağlanır.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Hər kim çağırışı eşidib: “Ey bu kamil çağırışın və sabit namazın Rəbbi olan Allahım, Muhəmmədə vəsilə və fəzilət bəxş et...” desə, Qiyamət günü mənim şəfaətim ona olacaqdır. (Cabir)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Addım-addım namaz",
    summary: "Bir rükətin tam ardıcıllığı — hər oxunan cümlə, hökmü ilə.",
    body: [
      "Hər namaz bir təkrar rükətdən qurulur: durub oxuyursan, rüku edirsən, qalxırsan, iki dəfə səcdə edirsən və (namazın sonunda) təşəhhüd üçün oturub salam verirsən. Bir rükət yaxşı öyrən və istənilən namazı qıla bilərsən, çünki uzun namazlar sadəcə bu vahidi təkrarlayır. Aşağıdakı addımlar hər bir hərəkəti ardıcıllıqla, ərəb dilində mənası ilə birlikdə deyiləcək dəqiq sözləri və hərəkətin sütun, tələb olunan və ya tövsiyyə olduğunu göstərən kiçik bir etiket verir.",
      "Alimlər namazın əməllərini üç dərəcəyə ayırırlar. Fərz (rükn/rükn) vacibdir: onu tərk etmək, hətta səhvən də olsa, namaz və ya həmin rükət qılınana qədər batildir. Vacib (vacib əməl) vacibdir, lakin əgər bir şeyi unutsanız, namazı təkrar etmək əvəzinə, unutqanlıq səcdəsi ilə düzəldə bilərsiniz. Sünnə müstəhəb və savablıdır, onsuz da namaz tam və səhihdir. Fiqh məktəblərinin bir hərəkəti fərqli kateqoriyaya yerləşdirdiyi yerdə məsləhətlər bunu qeyd edir - bu üç qatlı sərhəd özü də elmi fərqin klassik sahələrindən biridir.",
      "Bütün müddət ərzində heç vaxt itirilməməli olan bir keyfiyyət tumaninahdır - sükunət: hərəkət etməzdən əvvəl hər bir duruşa tam yerləşmək, əzalar dincəlməkdir. Peyğəmbər  tələsik namaz qılan bir adamı üç dəfə yenidən namaz qılmağa göndərdi və “Geri qayıt namaz qıl, çünki namaz qılmamısan” dedi və ona hər mövqedə sakit olmağı öyrətdi. “Allahu Əkbər” təkbirləri ilə duruşlar arasında keçin və nəzərinizi səcdə yerinə çevirin.",
      "Neçə rükət və harada oturursunuz: iki rükət namazda (Sübh və Cümə) bir oturuş var - ikinci rükətdən sonra son təşəhhüd - sonra salam. Üç rükətli namaz (Məğrib) və dörd rükətli namaz (Zöhr, Əsr, İşa) ikinci rükətdən sonra birinci, daha qısa təşəhhüd üçün oturun, sonra qalan rükət(lər)ə qalxın - onlarda yalnız Fatihə surəsini oxuyun, əlavə surə olmadan - və sonuncu təşəhhüd üçün yenidən oturun.",
      "Ucadan və ya səssiz: Sübh, Cümə və Məğrib və İşa namazlarının ilk iki rükətində Fatihə və surə ucadan (cəhri) oxunur; zöhr və əsrdə, məğribin üçüncü rükətində, işanın üçüncü və dördüncü rükətlərində səssiz (sirri) oxunur. Namazın hər bir başqa cümləsi - rüku və səcdə təsbihi, təşəhhüd və s. - sakitcə deyilir. Namazı tək qılan kimsə ucadan oxuya bilər və ya aşağı sala bilər; imam ucadan qiraət edərkən imamın arxasında olan bir ardıcıl sadəcə dinləyir.",
      'Bəzi əlavələr xüsusi dualara və ya anlara aiddir. Vitr namazında bir çoxları son rükətdə qunut oxuyurlar - hidayət və qorunma üçün dua etmək üçün əlləri qaldırırlar (məşhur bir söz "Allahummə-hdini fiman hədəyt..." başlayır). Çətin vaxtlarda qunut ən-nazilə fərz namazlarına əlavə oluna bilər və məktəblər sübhdə ayaq üstə qunutda ixtilaf edirlər. Əgər camaata gec qoşulsan (məsbuq), imamla tutduğun hər şey sayılır və onun salamından sonra buraxdığın rükətlərin qəzasını tutarsan. Əgər səhvən bir şey əlavə etsəniz və ya buraxsanız, səcdə-səhv bələdçisinə baxın.',
    ],
    steps: [
      {
        title: "1. Niyyət və qiyam (niyyah və qiyam)",
        body: "Üzünü qibləyə çevir və dik dur – gücü çatan hər bir fərz namazın dirəyidir. Hansı namazı qılacağınızı qəlbinizdə qərarlaşdırın; niyyət ucadan deyilən bir cümlə deyil, daxili qərardır.",
        tip: "Gözünü səcdə yerinə dik və orada saxla. Həqiqətən dayana bilməyən hər kəs oturaraq namaz qılır, sonra yalan danışır - namazın özü heç vaxt kəsilmir.",
      },
      {
        title: "2. Təkbirin açılması (Təkbirətül-Ehram)",
        body: "Əllərinizi çiyinlərə və ya qulaq məmələrinə qaldırıb təkbir deyin, sonra sağ əli sol əlin üzərinə sinə üzərinə qoyun. Bununla namaz başlanır və indi salama qədər adi danışıq və hərəkət qadağandır.",
        translation: "Allah ən böyükdür.",
        tip: "Təkbir ilə əlləri qaldırmaq (rəf əl-yədəyn) rükün deyil, təsdiq edilmiş sünnədir.",
      },
      {
        title: "3. Açılış duası (İstiftah duası)",
        body: "Qəlbi Allahın sözlərindən əvvəl sakitləşdirmək üçün qısa bir açılış duası oxuyun. Bir neçə orijinal ifadələr bildirilir; bu ən çox yayılmışlardan biridir.",
        translation:
          "İlahi, Sənə həmd və həmd olsun. Sənin adın mübarəkdir və əzəmətin ucadır. Səndən başqa tanrı yoxdur.",
      },
      {
        title: "4. Təavud və Bəsmələ",
        body: "Şeytandan Allaha sığın, sonra Fatihədən əvvəl Bəsmələ başla. Hər ikisi səssizcə, hətta ucadan dualarda belə deyilir.",
        translation:
          "Mən lənətlənmiş şeytandan Allaha sığınıram. Mərhəmətli və Rəhmli Allahın adı ilə!",
      },
      {
        title: "5. “Fatihə” surəsini oxuyun",
        body: "Kitabın açılışını hər rükətdə oxuyun — “Kitabın açılışını oxumayanın namazı yoxdur”. İmam və tək ibadət edən ucadan dualarda onu ucadan oxuyur; əks halda sakitcə oxunur.",
        translation:
          "Mərhəmətli və Rəhmli Allahın adı ilə! Həmd olsun aləmlərin Rəbbi, mərhəmətli, rəhmli, haqq-hesab gününün sahibi olan Allaha! Sənə ibadət edir və Səndən kömək diləyirik. Bizi düz yola - nemət verdiyin kəslərin yoluna yönəlt, qəzəblənmişlərin və azğınların yoluna deyil.",
        tip: "Bundan sonra (ucadan dualarda ucadan) “Amin” deyin. Hənəfilər sinfi bəzi Qur'anı rükün kimi, Fatihəni isə xüsusi olaraq vacib olaraq oxuyur; Əksəriyyət Əl-Fatihənin özü hər rükətdə sütundur.",
      },
      {
        title: "6. Bir surə və ya bəzi ayələri oxumaq",
        body: "Yalnız ilk iki rükətdə qısa surə və ya bir neçə ayə ilə Fatihə surəsinə əməl edin – məsələn, İxlas surəsi (“Qul huva Allahu əhəd…”). Üçüncü və dördüncü rükətlərdə yalnız Fatihə surəsini oxuyun.",
        tip: "Tək namaz qılan və imama tövsiyyə olunur; izləyici dinləyir. Hənəfilər ilk iki rükətə bir surə əlavə etməyi vacib hesab edirlər.",
      },
      {
        title: "7. Rüku (rüku)",
        body: "“Allahu Əkbər” deyin və düz, düz arxa, əllər dizləri tutaraq rüku edin və tələsmədən üç və ya daha çox dəfə Rəbbinizi təsbih edin.",
        translation: "Mənim əzəmətli Rəbbim pakdır.",
        tip: "Sükunətlə tutulan yayın özü sütundur; orada deyilən təsbih sünnətdir (bəzi məktəblərdə vacibdir).",
      },
      {
        title: "8. Rukudan qalxmaq (i'tidal)",
        body: "Tam dik qalxın - imam və tək abid təsmi' desin və hər kəs təhmid desin - və enməzdən əvvəl tamamilə dayanın.",
        translation: "Allah Ona həmd edəni eşidir. Ey Rəbbimiz, həmd Sənə məxsusdur.",
        tip: "Düz və rahat dayanmaq bir dirəkdir - burada məskunlaşana qədər səcdəyə batmayın.",
      },
      {
        title: "9. Səcdə (səcdə)",
        body: "“Allahu Əkbər” deyin və yeddi sümüyə – alınla burun, iki ovuc, hər iki diz və hər iki ayağın barmaqları üzərində üç dəfə və ya daha çox təsbih edərək səcdə edin. Bu, Allaha ən yaxın duruşdur, ona görə də təsbihdən sonra dua edin.",
        translation: "Uca olan Rəbbim pakdır.",
        tip: "Ön qolları yerdən yuxarı qaldırıb yanlardan, qarnı isə budlardan uzaq tutun.",
      },
      {
        title: "10. İki səcdə arasında oturmaq (cəlsəh)",
        body: "İlk səcdədən “Allahu Əkbər” deyərək qalx, sakit və dik otur və yenidən səcdədən əvvəl Rəbbindən bağışlanma dilə.",
        translation: "Rəbbim, məni bağışla.",
        tip: "Rahat olana qədər oturun - bu qısa oturuş, sükunətlə, özlüyündə bir sütundur.",
      },
      {
        title: "11. İkinci səcdə",
        body: "“Allahu Əkbər” deyin və eyni təsbih və eyni sükunətlə birinci səcdə kimi ikinci dəfə səcdə edin. Bu, tam bir rükət tamamlayır.",
        translation: "Uca olan Rəbbim pakdır.",
      },
      {
        title: "12. Növbəti rükət üçün dayanın",
        body: "“Allahu Əkbər” deyin və ayağa qalxın, sonra Fatihədən təkrar edin. Üçüncü və dördüncü rükətlərdə əlavə surə olmadan yalnız Fatihə surəsini oxuyun.",
        tip: "İki rükətli namazda ikinci rükətdən sonra bir daha durmursan — axırıncı təşəhhüd üçün oturursan.",
      },
      {
        title: "13. İlk təşəhhüd (3 və 4 rükətli namazlarda)",
        body: "Məğrib, zöhr, əsr və ya işa ayının ikinci rükətindən sonra oturub “Təhiyyat”ı oxuyun, sonra qalan rükət(lər) üçün dayanın. İki rükət namazın birinci təşəhhüdü yoxdur.",
        translation:
          "Bütün salamlar, dualar, təmiz sözlər Allah üçündür. Salam olsun sənə, ey Peyğəmbər, Allahın rəhməti və bərəkəti. Salam olsun bizə və Allahın saleh bəndələrinə. Şəhadət verirəm ki, Allahdan başqa ilah yoxdur və şəhadət verirəm ki, Məhəmməd Onun qulu və Rəsuludur.",
        tip: "Oturarkən sağ şəhadət barmağını qaldırın. Əgər birinci təşəhhüdü unudub ayaq üstə durmağa başlamısansa, salamdan əvvəl davam edib səhv səcdəsini yerinə yetir, geri oturma.",
      },
      {
        title: "14. Son təşəhhüd",
        body: "Hər namazın son iclasında yuxarıda göstərilən eyni ət-Təhiyyatı oxuyun. Son təşəhhüd üçün oturmaq və onu oxumaq namazın rükünlərindəndir.",
      },
      {
        title: "15. Peyğəmbərə (sallallahu aleyhi və səlləm) salavat göndərin.",
        body: "Son ət-Təhiyyətdən sonra Peyğəmbərə (sallallahu aleyhi və səlləm) onun öz səhabələrinə öyrətdiyi sözlərlə salavat göndərin.",
        translation:
          "İlahi, İbrahimə və İbrahimin ailəsinə bərəkət verdiyin kimi, Muhəmməd və Muhəmmədin ailəsinə salavat göndər. Həqiqətən, Sən tərifəlayiqsən, izzətlisən! İlahi! Həqiqətən, Sən tərifəlayiqsən, izzətlisən!",
        tip: "Şafii və Hənbəli məzhəbləri son iclasda salavat oxumağı vacib hesab edirlər.",
      },
      {
        title: "16. Salamdan əvvəl dua etmək",
        body: "Bitirməzdən əvvəl dörd fitnədən Allaha sığın - sonra dünya və axirət üçün istədiyin duanı ərəbcə və ya öz dilində et.",
        translation:
          "İlahi, qəbir əzabından, cəhənnəm əzabından, həyatın və ölümün fitnəsindən və yalançı Məsihin (Dəccalın) fitnəsinin şərindən Sənə sığınıram.",
      },
      {
        title: "17. Bağlama salamı (Təslim)",
        body: "Üzü sağa, sonra sola çevirərək hər dəfə salam verərək namazı bitirin. Salamla namaz tamam olur.",
        translation: "Allahın salamı və rəhməti üzərinizə olsun.",
        tip: "Birinci təslim (sağda) sütundur; ikincisi (solda) bəzi məktəblərdə sünnədir.",
      },
    ],
    hadith: [
      {
        excerpt: "Mənim namaz qıldığımı gördüyünüz kimi dua edin. (Malik ibn əl-Hüveyris)",
      },
      {
        excerpt:
          "“Geri dönüb namaz qıl, çünki namaz qılmamısan” – üç dəfə təkrar – sonra o, (sallallahu aleyhi və səlləm) öyrətdi: təkbir de, Qurandan bacardığın qədər oxu, sonra rahat olana qədər rüku et, düz durana qədər qalx, rahat olana qədər səcdə et... (Pis namaz qılan adam; həmçinin Səhih Müslim 397)",
      },
      {
        excerpt:
          "Kitabın açılışını oxumayanın namazı yoxdur. (Ubadə ibn əs-Samit; həmçinin Səhih Müslim 394)",
      },
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Hər mövqe",
    summary: "Namazın hər duruşunda bədəninizi necə düzgün tutmalısınız.",
    body: [
      "Namazdakı hər duruşun Peyğəmbərin (sallallahu aleyhi və səlləm) nümayiş etdirdiyi və səhabələrinin qoruduğu bədən forması vardır. Düzgün formanı öyrənmək duanızı ümumi fiziki səhvlərdən qoruyur və bədənə diqqəti yayındırmaq əvəzinə ürəyin təvazökarlığını dəstəkləməyə kömək edir.",
      "Səcdənin yaxınlığına xüsusi diqqət yetirilməlidir: Peyğəmbər (salləllahu aleyhi və səlləm) buyurmuşdur: “Bəndənin Rəbbinə ən yaxın olanı səcdə halında olar, ona görə də çoxlu dua et”. Sükunət və ixlasla edilən səcdə mömin gününün ən güclü anlarından biridir.",
    ],
    steps: [
      {
        title: "Dayanmaq (qiyam)",
        body: "Dik vəziyyətdə, ayaqları təxminən çiyin genişliyində, çəkisi tarazlanmış, səcdə yerinə baxmaq, sağ əl sol sinə üzərində.",
      },
      {
        title: "Əlləri qaldırmaq (raf'ul-yədəyn)",
        body: "Avuç içi qibləyə, çiyinlərə və ya qulaq məmələrinə bərabər səviyyədə - açılış təkbirində və (əksəriyyətlə) də rükuya girib qalxmaq.",
      },
      {
        title: "Rüku (rüku)",
        body: "Arxa düz və səviyyəli, baş nə qaldırılmış, nə də əyilmiş, barmaqlar dizləri tutaraq yayılır, qollar yanlardan uzaqlaşdırılır.",
      },
      {
        title: "Səcdə (səcdə)",
        body: "Alın və burun yerdə, ovuclar çiyinlərə və ya qulaqlara yaxın düz, dirsəklər qaldırılmış və yerdən, dizlər aşağı, ayaq barmaqları qibləyə əyilmiş.",
      },
      {
        title: "Oturma (iftiraş)",
        body: "İki səcdə arasında və birinci təşəhhüddə: düz qoyulmuş sol ayağın üstündə sağ ayağı dik, əlləri budlara qoyaraq oturmaq.",
      },
      {
        title: "Son iclas (təvarruk)",
        body: "3 və ya 4 rükətli namazın son təşəhhüdündə (Şafii və Hənbəli məzhəbinin sünnəsi): sol ayağı sağ ayağın altından keçirib yerə oturmaq.",
      },
      {
        title: "Başı salama çevirmək (təslim)",
        body: "Sülh sözləri ilə üzü tam sağa, sonra sola çevirin - hər çiyninizdə mələkləri salamlayarkən namazı bitirin.",
      },
    ],
    hadith: [
      {
        excerpt: "Bəndənin Rəbbinə ən yaxın vaxtı səcdə halında olar, çoxlu dua et. (Əbu Hureyrə)",
      },
    ],
    disclaimer:
      "Əllərin yerləşdirilməsi, oturma tərzi və əllərin qaldırılmasındakı kiçik fərqlərin hamısı orijinal hesabatlara əsaslanır; məktəblərin hər biri etibarlı bir rəvayətə əməl edir. Heç kim başqasının namazını batil etməz.",
  },
  {
    title: "Ümumi səhvlər",
    summary: "Duanı sakitcə zəiflədən səhvlər - və hər birini necə düzəltmək olar.",
    body: [
      "Namazda günahların çoxu qəlbin günahları deyil, tələskənlik və diqqətsizlik vərdişləridir. Onlara ad vermək onları düzəltmək üçün ilk addımdır; Peyğəmbərin özü bir səhabənin duasını səbirlə və birbaşa düzəltdi ki, bu da bizə bu səhvlərin ümumi və düzəldilə biləcəyini öyrədir.",
      "Ən qəbir tələsir - sükunət olmadan rüku və səcdədən keçir. Tumaninah (məskunlaşan sükunət) əksər alimlər üçün duanın sütunudur, buna görə də tələsik edilən dua sadəcə olaraq qeyri-kamil deyil, həm də batil ola bilər. Aşağıdakı siyahı üzərində hər dəfə bir vərdiş üzərində işləyin.",
    ],
    steps: [
      {
        title: "Çox tez dua etmək",
        body: "Rukuda və ya səcdədə çətinliklə fasilə vermək. Bədəniniz oturana qədər qalın və tələsmədən ən azı üç dəfə zikr deyə bilərsiniz.",
      },
      {
        title: "Natamam dəstəmaz",
        body: "Dabanlarda, ayaq biləklərində, dirsəklərdə və ya barmaqların arasında quru ləkələr. Peyğəmbər (salləllahu aleyhi və səlləm) “Cəhənnəmdən gələnlərin vay halına!” – deyə xəbərdarlıq etdi. Yavaş-yavaş və hərtərəfli yuyun.",
      },
      {
        title: "Rükuda arxaya əyilmiş, səcdədə batan",
        body: "Kürəyi yuvarlaqlaşdırmaqla əyilmək, ya da alnı burunsuz qoymaq, ya da biləkləri yerə düz qoymaq. Arxa səviyyəni və dirsəkləri qaldırın.",
      },
      {
        title: "Səylənən gözlər və ürək",
        body: "Ətrafa baxır və ya telefonu yoxlayır. Baxışları səcdə yerinə yetirib susmaq və ya təkbirdən əvvəl telefonu çıxarmaq.",
      },
      {
        title: "İmamın qabağında yarışmaq",
        body: "Camaatla, imamdan əvvəl rüku və ya səcdəyə keçmək. Onu izləyin - heç vaxt ondan əvvəl getməyin - yalnız ondan sonra hərəkət edin.",
      },
      {
        title: "Danışmaq, yemək və ya gülmək",
        body: "Hər hansı qəsdən danışıq, yemək, içmək, səsli gülüş namazı pozar. Namaz yalnız Allahla söhbətdir.",
      },
      {
        title: "Fatihəni səhv oxumaq",
        body: "Sözləri atlamaq və ya mənasını dəyişdirən səhvlər etmək. Onu mükəmməl şəkildə öyrənin - bütün dua ondan asılıdır.",
      },
    ],
    actions: [
      "Bu gün adi sürətinizin yarısı ilə bir namaz qılın və bunun nə qədər fərqli olduğunu hiss edin.",
      "Açılış təkbirini deməzdən əvvəl telefonunuzu susdurun və ya başqa otaqda saxlayın.",
      "Bilən birindən dualarınızdan birini izləməsini və duruşunuzu düzəltməsini xahiş edin.",
    ],
    appLinks: [{}],
  },
  {
    title: "Sünnə əməlləri",
    summary: "Peyğəmbər (s) namazı gözəlləşdirən və savabını artıran əməlləri tövsiyə etmişdir.",
    body: [
      "Peyğəmbər ﷺ vacib əməllərdən başqa, namaz ətrafında bir çox müstəhəbb əməlləri (sünən) nümunə götürmüşdür. Bunlar tələb olunmur, ona görə də birini tərk etmək namazı batil etməz, lakin hər biri sizi Allaha yaxınlaşdırar, əlavə savab qazanar və fərz namazlardakı çatışmazlıqları aradan qaldırar.",
      "Bunlardan ən başlıcası fərzdən əvvəl və sonra qılınan adi sünnət namazlarıdır: iki sübhdən əvvəl (Peyğəmbər (sallallahu aleyhi və səlləm) bütün dünyadan üstündür), zöhrdən əvvəl dörd və iki, məğribdən sonra iki və işadan sonra iki rükət - mükafatı cənnətdə tikilmiş bir ev olan on iki rükət.",
    ],
    actions: [
      "Misvakdan dəstəmaz və namazdan əvvəl istifadə edin - Peyğəmbər az qala bunu vacib etdi.",
      "Məscidə sakit və tez gedin - hər addım bir dərəcə yüksəldir və bir günahı silir.",
      "Cənnətdə vəd edilmiş bir ev üçün on iki rükət sünnət rəvatibini qoruyun.",
      "Sağ ayağınızla məscidə girin və hər birinin öz duası ilə solla çıxın.",
      "Hər namazdan sonra müəyyən edilmiş adhkarı oxuyun - Namazdan sonra baxın.",
    ],
    hadith: [
      {
        excerpt:
          "Əgər ümmətimə ağır yük verməsəydim, onlara hər namazdan əvvəl misvakdan istifadə etməyi əmr edərdim. (Əbu Hureyrə; həmçinin Səhih Müslim 252)",
      },
      {
        excerpt:
          "Hər kim gecə-gündüz on iki rükət nafilə namaz qılarsa, onun üçün cənnətdə bir ev tikilər. (Ümmü Həbibə)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Xuşu - ürəyin varlığı",
    summary: "Bütün səfərin məqsədi: Allahı görürmüş kimi dua etmək.",
    body: [
      "Xuşu təvazökarlıq, diqqət və şüurdur ki, həqiqətən Allah qarşısında dayanırsınız. Duanın fiziki hərəkətlərini həqiqi ibadətə çevirən budur. Peyğəmbər (salləllahu aleyhi və səlləm) fəziləti (ehsanı) “Allaha sanki Onu görürsən kimi ibadət etməkdir, çünki sən Onu görməsən də, O, səni görür” deyə tərif etmişdir və bu, namazdan daha birbaşa olaraq heç bir yerdə tətbiq edilməmişdir.",
      "Allah bununla uğur qazanan möminlərin vəsfini açdı: “O kəslər ki, namazlarında təvazökarlar” (23:1-2). Və onun əksi – “vay halına namaz qılanların halına, lakin onların namazından qafillər” – ürəkləri qeyb ikən bədənləri tərpənənlərə qarşı sərt şəkildə xəbərdarlıq etdi.",
      "Xuşu tikilir, arzu olunmur. Oxuduqlarınızın mənalarını öyrənin ki, sözlər sizi hərəkətə gətirir. Təkbirdən əvvəl diqqəti yayındıranları aradan qaldırın. Yavaşlayın və hər duruşa öz sükunətini verin. Müraciət etdiyiniz şəxsin böyüklüyünü və bu duanın sizin sonuncu ola biləcəyi reallığını düşünün. Peyğəmbərin (sallallahu aleyhi və səlləm) tövsiyə etdiyi kimi hər namazı vida duası kimi qılın.",
      "Səhv fikirlərdən ruhdan düşməyin - hətta səhabələr belə onlarla mübarizə apardılar. Diqqətinizi təkrar-təkrar geri qaytarmaq üçün mübarizə ibadətin bir hissəsidir. Khushu bir ömür boyu böyüyür; ardıcıllıq onu qidalandırandır.",
    ],
    quran: [
      {
        excerpt: "Həqiqətən, möminlər nicat tapdılar – o kəslər ki, namazda təvazökarlıq edirlər.",
      },
      {
        excerpt: "Vay halına namaz qılanların - öz namazlarından qafil olanların!",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ehsan, Allaha sanki Onu görürsən kimi ibadət etməkdir, çünki sən Onu görməsən də, O, səni görür. (Cəbrail, Ömər hədisi)",
      },
    ],
    actions: [
      "Bu həftə hər namazdan əvvəl Namazın Sözlərindən bir cümlənin mənasını oxuyun.",
      "Davam etməzdən əvvəl hər duruşda üç tələsik saniyə fasilə verin.",
      "Namazdan sonra jurnalda diqqət səviyyənizi qeyd edin və nümunənin dəyişməsinə baxın.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sütunlar və ləğvedicilər",
    summary: "Duanın onsuz mövcud ola bilməyəcəyi şey - və onu ləğv edən nədir.",
    body: [
      "Namazın əməlləri üç dərəcəyə bölünür. Sütunlar (arkan) vacib hissələrdir: qəsdən tərk etmək namazı batil edir, unutqanlıqla tərk etmək isə ona qayıtmaqla islah edilməlidir. Vacib əməllər (vacibət) tələb olunur, unudularsa, unutqanlıq səcdəsi ilə düzəlir. Sünnə əməlləri namazı tamamlayır və gözəlləşdirir və onları tərk etməyin heç bir cəzası yoxdur.",
      "Bu iyerarxiyanı bilmək sizi iki ifrat vəziyyətdən qoruyur: kiçik bir nöqsanı məhvedici hesab etmək və ya həqiqi sütunu isteğe bağlı hesab etmək. Bir dirək barəsində şəkk etdikdə, yerinə yetirilmədikcə namaz səhih olmaz.",
      "Ayrı-ayrılıqda, bəzi şeylər baş verən an namazı tamamilə batil edir, çünki onlar namazın vəziyyətinə ziddir. Digərləri dəstəmazı batil edir, bu da namazı bitirir. Hər ikisindən qorun ki, heç vaxt batil vəziyyətdə, fərqində olmadan namaz qılmazsınız.",
    ],
    steps: [
      {
        title: "Sütunlar (arkan)",
        body: "Bacardıqca ayaq üstə durmaq, təkbir açmaq, Fatihəni oxumaq, rüku etmək, ondan qalxmaq, iki səcdə, aralarında oturmaq, axır oturuş, təşəhhüd, salam, tuməninah və hər birində düzgün nizam saxlamaq.",
      },
      {
        title: "Vacib əməllər (vacibət)",
        body: "Məsələn, digər təkbirlər, rüku və səcdədəki zikr sözləri və ilk təşəhhüd unudulsa, səcdə səhv ilə təmir edilir (Hənbəli təfərrüatına görə; məktəblər fərqlidir).",
      },
      {
        title: "Dəstəmazı pozanlar",
        body: "Ön və ya arxa keçidlərdən çıxan hər hansı bir şey, dərin yuxu, şüurun itirilməsi - və bəzi alimlərə görə, birbaşa şəxsi hissələrə toxunur. Bunların hər biri namazı bitirir.",
      },
      {
        title: "Namazın özünü batil edənlər",
        body: "Qəsdən danışmaq, qəsdən yemək və ya içmək, çox davam edən lazımsız hərəkətlər, ucadan gülmək, sinəni qəsdən qiblədən çevirmək və övrəti açmaq.",
      },
    ],
    appLinks: [{}],
    disclaimer:
      "Dörd məzhəb bəzi əməlləri fərqli şəkildə təsnif edir - məsələn, birinci təşəhhüdün vacib və ya sünnə olması və ya səcdə-səhv tələb edənlərin dəqiq siyahısı. Məktəbinizin təfərrüatlarını ixtisaslı müəllimdən öyrənin.",
  },
  {
    title: "Sücud əs-Səhv — səhvləri düzəltmək",
    summary: "Namazda sürüşməni düzəldən unutqanlıq səcdəsi.",
    body: [
      'Heç kim namazda unutmaqdan qorunmur - hətta Peyğəmbər (sallallahu aleyhi və səlləm) belə unutdu və sonra öyrətdi: "Mən ancaq sizin kimi bir insanam; Sən unutduğun kimi mən də unuduram, unutduğum zaman mənə xatırlat”. Onun öz nümunəsindən daxili bir dərman gəlir: “Sücud əs-səhv” (unutmaq səcdəsi) adlanan iki əlavə səcdə, kiçik səhvləri düzəldir ki, namazın təkrarlanmasına ehtiyac olmasın.',
      "Üç geniş vəziyyətdə çağırılır: əlavə (əlavə rükət namaz qılmaq və ya səhvən duruş), tərk etmək (birinci təşəhhüd kimi bir vacibi tərk etmək) və ya şəkk (neçə rükət namaz qıldığına əmin olmaq). Nə sünnəti tərk etmək, nə də bilərəkdən səhvlər etmək lazım deyil - onların öz hökmləri var.",
      "Həqiqi şəkk etdiyiniz zaman rəhbər prinsip budur: şəkk-şübhəni tərk edin, əmin olduğunuz (daha az sayda) üzərində qurun, namazı tamamlayın və sonra iki səcdə edin. Bu, çaşqınlığı narahat bir təxmindən çox sabit, etibarlı bir duaya çevirir.",
      "Praktiki olaraq: adi səcdəniz kimi iki səcdə edin, əvvəl və sonra təkbir, sonra isə salam. Alimlər xətanın növünə görə salamdan əvvəl və ya sonra gəlmələri mövzusunda ixtilaf etmişlər - hər ikisi səhihdir, ona görə də hər ikisi məqbuldur və heç biri namazı batil etmir.",
    ],
    hadith: [
      {
        excerpt:
          "Əgər sizdən biriniz namazında əmin deyilsə və neçə namaz qıldığını bilmirsə - üç və ya dörd - şübhəni aradan qaldırsın, əmin olduğu şeyə əsaslansın, sonra salam üçün iki dəfə səcdə etsin. (Əbu Səid əl-Xudri)",
      },
      {
        excerpt:
          "Sizlərdən biriniz öz namazında şəkk etdikdə, düzgün və tam olanı axtarsın, sonra salam verib iki dəfə səcdə etsin. (İbn Məsud; həmçinin Səhih Müslim 572)",
      },
    ],
    actions: [
      "Şübhə üçün qaydanı əzbərləyin: daha az rəqəm üzərində qurun, bitirin, sonra iki dəfə səcdə edin.",
      "Əgər birinci təşəhhüdü tərk etdiyinizi başa düşsəniz, namazın ortasında davam edin və sonunda səhv səcdəsini edin.",
    ],
    appLinks: [{}],
    disclaimer:
      "İki səcdənin salamdan əvvəl və ya sonra düşməsi xətadan asılıdır və məktəblər ixtilaflıdır. Hər ikisi sünnədəndir; burada qeyri-müəyyənlik dua etmək sizə mane olmasın.",
  },
  {
    title: "Namaz növləri",
    summary: "Möminin gününü zənginləşdirən fərz, sünnə, vitr və nafilə namazlar.",
    body: [
      "Namazlar mükəlləfiyyətə görə təsnif edilir. Beş vaxt namaz fərzdir - hər bir müsəlman üçün ciddi bir fərzdir. Onların ətrafında və kənarında, Peyğəmbərin (sallallahu aleyhi və səlləm) Allaha getdikcə yaxınlaşdığı və bizim də onunla bacara biləcəyimiz zəngin bir könüllü dua dünyası var.",
      'Nafilə namazların iki səbəbi var: möminin dərəcəsini yüksəldən sevimli əməllərdir - Allah əlavə ibadət haqqında buyurur: "Bəndəm mən onu sevənə qədər ibadətlə Mənə yaxınlaşmağa davam edər" - və fərz namazlarını düzəldir, çünki fərzdə olan hər hansı bir əskiklik Qiyamət günü insanın könüllü namazı ilə tamamlanır.',
    ],
    steps: [
      {
        title: "Beş günlük fərz",
        body: "Sübh, zöhr, əsr, məğrib, işa – vacib təməldir, heç vaxt tərk edilməz.",
      },
      {
        title: "Sünnə rəvatib",
        body: "Fərzdən əvvəl və sonra müntəzəm sünnə rükətləri - gündə on iki cənnətdə ev qazanır.",
      },
      {
        title: "Vitr",
        body: "İşadan sonra tək nömrəli namaz, gecə namazının möhürü — əksəriyyət üçün sünnə müəkkədə, Hənəfi məzhəbində isə vacib.",
      },
      {
        title: "Təhəccüd (qiyamul-leyl)",
        body: "Gecənin son üçdə birində gecə namazı - ən fəzilətli könüllü namaz və salehlərin vərdişi.",
      },
      {
        title: "Duha",
        body: "Sübh namazı (2-8 rükət) - hər gün bədənin oynaqlarının hər biri üçün lazım olan sədəqədir.",
      },
      {
        title: "Təravih",
        body: "Ramazan ayının camaat gecəsi namazı - mübarək ayın gecələrini dirildən.",
      },
      {
        title: "İki bayram",
        body: "İki rükət Fitr və Qurban bayramı, ardınca xütbə oxunur.",
      },
      {
        title: "İstixarə",
        body: "Qərar verməzdən əvvəl Allahdan hidayət istəyən iki rükət namaz.",
      },
      {
        title: "Cənazə",
        body: "Cənazə namazı rüku və səcdəsiz ayaq üstə qılınan camaat (fərzi kifayə) namazıdır.",
      },
    ],
    hadith: [
      {
        excerpt: "Vacib namazlardan sonra ən fəzilətli namaz gecə namazıdır. (Əbu Hureyrə)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Cümə - cümə namazı",
    summary: "Cümə günü zöhrün yerinə camaatı toplayan həftəlik öhdəlik.",
    body: [
      "Cümə hər cümə günü günortadan sonra qılınan camaat namazıdır və bu, Quranda adı ilə əmr edilmiş xüsusi bir vacibatdır: “Cümə günü namaz üçün azan verildiyi zaman Allahı zikr etməyə tələsin və ticarəti tərk edin”. İki hissədən ibarət xütbədən (xütbədən) və ardınca imamın arxasında ucadan qılınan iki rükət namazdan ibarətdir və iştirak edənlər üçün zöhrün yerini tutur.",
      "Bu, hər bir azad, həddi-büluğa çatmış, sakin, qüdrətli müsəlman kişiyə şəxsi borcdur (fərdi ayn). Peyğəmbər (salləllahu aleyhi və səlləm) buyurmuşdur ki, bu, dörd nəfər istisna olmaqla, camaat halında olan hər bir müsəlmanın üzərinə düşür: kölə, qadın, uşaq və ya xəstə. Qadınlar, müsafirlər və xəstələr üzrlüdürlər və onların əvəzinə zöhr namazını qılırlar.",
      "Onun səhlənkarlığı böyük təhlükədir: Peyğəmbər (s) xəbərdarlıq etmişdir ki, hər kəs qəflət üzündən üç cüməni tərk etsə, Allah onun qəlbini möhürləyər. Bununla belə, onun savabları eyni dərəcədə böyükdür - cümə günəşin doğduğu ən yaxşı gündür və duanın qəbul olunduğu bir saatdır.",
      "Bunun üçün də Peyğəmbərin (sallallahu aleyhi və səlləm) hazırladığı kimi hazır olun: qüsl alın, ən təmiz paltarınızı geyinin, ətir çəkin, tez gedin və sükutla xütbəyə diqqətlə qulaq asın (boş danışmaq savabını itirər). Cümə günü Kəhf surəsinin oxunması iki cümə arasına nur gətirər.",
    ],
    quran: [
      {
        excerpt:
          "Ey iman gətirənlər, cümə günü azan oxunduğu zaman Allahı zikr etməyə tələsin və ticarəti tərk edin. Əgər bilsəniz, bu sizin üçün daha xeyirlidir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Cümə namazını camaatla qılmaq dörd müsəlmandan başqa hər bir müsəlmana vacibdir: kölə, qadın, uşaq və ya xəstə. (Tariq ibn Şihab)",
      },
      {
        excerpt:
          "Kim üç cümə namazını qəflət üzündən tərk edərsə, Allah onun qəlbinə möhür vurar. (Əbu əl-Cəd; həmçinin Əbu Davud 1052, ət-Tirmizi 500)",
      },
      {
        excerpt: "Cümə günü qüsl almaq həddi-büluğa çatmış hər kəsə vacibdir. (Əbu Səid əl-Xudri)",
      },
    ],
    actions: [
      "Qüsl edin, təmiz paltar və ətir geyinin və tez gəlin - ən erkən gələnlər ən böyük mükafatı qazanırlar.",
      "İki cümə arasında nur olması üçün cümə günü Kəhf surəsini oxuyun.",
      "Xütbə zamanı tamamilə susmaq və diqqətli olmaq; telefonu uzaq tutun.",
    ],
    appLinks: [{}],
    disclaimer:
      "İştirakçıların minimum sayı, qüslün vacib və ya güclü sünnə olması elmi fərqlərdir. Yerli icmanızın etibarlı təcrübəsinə əməl edin.",
  },
  {
    title: "Camaat namazı",
    summary: "İmamın arxasında namaz qılmaq - iyirmi yeddi qat savabı.",
    body: [
      "Beş vaxt namazı camaatla (camaatla) qılmaq, xüsusilə kişilər üçün ciddi şəkildə vurğulanır və yaşayan müsəlman cəmiyyətinin əlamətidir. Peyğəmbər (sallallahu aleyhi və səlləm) öyrətdi ki, camaatla edilən namaz tək qılınan namazdan iyirmi yeddi qat savabdır - heç bir fərdi səylə müqayisə oluna bilməz.",
      "Camaat düz, boşluqsuz, çiyin-çiyinə, imama dəqiq tabe olur: siz hər bir hərəkətə yalnız ondan sonra başlayırsınız, heç vaxt ondan əvvəl və heç vaxt eyni anda. Sətirləri düzəltməyin özü namazı tamamlamaqdandır.",
      "Əgər imam işə başlayandan sonra gəlsəniz (gecikmiş şəxs məsbuq adlanır), onu görsəniz, dərhal ona qoşulun - bu hissə yenə də onunla namaz qılmaq sayılır. O, son salamı verəndə ayağa qalx və buraxdığın rükətləri tək başına tamamla, sonra bitir.",
      "Camaat təkcə məsciddə deyil: bir yerdə namaz qılan iki nəfər camaat təşkil edir, ona görə də ata uşağı ilə, yaxud iki dost səfərdə olarsa, onun savabına nail olar. Qadınlar camaatla namaz qıla və uyğun şəraitin olduğu yerlərdə məscidə gedə bilərlər, baxmayaraq ki, onların evdə namazı da böyük savab qazanır.",
    ],
    hadith: [
      {
        excerpt:
          "Camaatla qılınan namaz tək qılınan namazdan iyirmi yeddi dərəcə fəzilətlidir. (İbn Ömər; həmçinin Səhih Müslim 650)",
      },
    ],
    quran: [
      {
        excerpt: "Namaz qılın, zəkat verin və rüku edənlərlə birlikdə rüku edin.",
      },
    ],
    actions: [
      "Bu gün məsciddə heç olmasa bir namaz qılın və ya ailənizi evdə sıraya toplayın.",
      "Gec gələn kimi nə edəcəyinizi öyrənin: dərhal qoşulun, sonra imamın salamından sonra buraxdığınız rükətləri tamamlayın.",
    ],
  },
  {
    title: "Qəza namazları",
    summary: "Qaçırılanları düzəltmək - Allahın rəhmət qapısı açıq qalır.",
    body: [
      "Əgər bir fərz namazı çox yatmaq, unutqanlıq və ya (Allah bizi qorusun) səhlənkarlıq üzündən tərk edərsə, fərz sadəcə olaraq yox olmaz. Qəza edilməlidir və Peyğəmbər (salləllahu aleyhi və səlləm) hökmü açıq şəkildə bildirmişdir: “Hər kim bir namazı unudarsa və ya onu yatırsa, onun kəffarəsi yadına düşəndə ​​namaz qılmaqdır”. Bunun üçün dua etməkdən başqa fidyə yoxdur.",
      "Qəza namazı əsli ilə eyni formada qılınır: qəza edilən dörd rükət zöhr, gecə və ya səfərdə olsa belə, dörd rükət olaraq qılınır. Namazı üzrlü (dərin yuxu kimi) tərk edənin gecikməsinə görə heç bir günah yoxdur; onları qəsdən tərk edən, səmimi, təcili tövbə ilə yanaşı onları qəza etməlidir.",
      "Alimlər qəza namazlarını bir yerə yığmağa imkan vermədən dərhal və mümkün olduğu qədər ardıcıllıqla qılmağa təşviq edirlər - çünki vaxt və gecikmə ilə yük daha da ağırlaşır. Əgər illər ərzində çoxlu sayda qaçırılıbsa, ümidsizliyə qapılmaqdansa, ona real gündəlik planla yanaşın; Allahın dönüş qapısı həmişə açıqdır.",
    ],
    hadith: [
      {
        excerpt:
          "Hər kim bir namazı unudarsa və ya yatıb yatsa, onun kəffarəsi yadına düşəndə ​​onu qılmaqdır. (Ənəs; həmçinin Səhih Müslim 684)",
      },
    ],
    actions: [
      "Nə qədər dua borcunuz olduğunu vicdanla hesablayın və real gündəlik makiyaj hədəfi təyin edin.",
      "Hər bir vacib namazı bir qəza namazı ilə birləşdirin.",
      "Köhnə namazı qəza etmək üçün vaxtı çatan namazı heç vaxt təxirə salmayın – bu günün namazını vaxtında qılın.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Namazdan sonra",
    summary: "Hər namazın savabını möhürləyən zikr və dualar.",
    body: [
      "Peyğəmbər (s) heç vaxt namazdan qəfil qalxmazdı. O, yerində oturar, Allahdan bağışlanma diləyir və zikrlə məşğul olardı və o öyrədirdi ki, vacib namazdan dərhal sonra dualar ən asan qəbul edilən vaxtlardan biridir. Dərhal tərk etmək duanın ən böyük bəhrələrindən bəzilərini itirir.",
      "Namazdan sonra müəyyən edilmiş qayda sadə və ağırdır: üç dəfə “Əstəğfirullah” demək; sonra tövhid və həmd sözləri; sonra otuz üç dəfə “SubhanAllah”, “Əlhəmdulillah” və “Allahu Əkbər” deyərək, yüzüncü hissəsini “Lə iləhə illəllah...” ilə möhürləmək – hər kim bunu etsə, dəniz köpüyü kimi olsa da, günahları bağışlanar.",
      "Hər fərz namazdan sonra Ayətül-Kürsi oxumaq, Peyğəmbərin (sallallahu aleyhi və səlləm) vəd etdiyi kimi insanla Cənnət arasında ancaq ölümü aradan qaldırar. Onu üç qul (İxlas, Əl-Fələq, Ən-Nas) ilə yerinə yetirin və müraciət etdikləri yerlərdə sübh azərini sübhdən sonra, axşam namazını isə əsr və ya məğribdən sonra əlavə edin.",
    ],
    hadith: [
      {
        excerpt:
          "Kim hər namazdan sonra otuz üç dəfə Allahı təsbih, həmd və həmd-səna ilə təqdis etsə... və yüzü tövhid kəlmələri ilə tamamlasa, günahları dəniz köpüyü kimi olsa da bağışlanar. (Əbu Hureyrə)",
      },
      {
        excerpt:
          "Kim hər fərz namazdan sonra Ayətül-Kürsi oxuyarsa, onunla Cənnətə daxil olmaq arasında ölümdən başqa heç nə dayanmaz. (Əbu Umamə; əl-Albani tərəfindən səhih qiymətləndirilmişdir)",
      },
    ],
    actions: [
      "Bu həftə namazdan sonrakı təsbihləri (33/33/33+təhlil) əzbərləyin.",
      "Ayətül-Kürsi və üç Qulları ayağa qalxmazdan əvvəl oxuyun.",
      "Hər fərz namazından sonra bir dəqiqəlik şəxsi dua üçün oturun.",
    ],
    appLinks: [{}, {}],
  },
];

export const SALAH_GUIDE_PHRASES_AZ: DeepPartial<SalahGuidePhrase>[] = [
  {
    title: "Dəstəmaz aldıqdan sonra",
    when: "Dəstəmaz aldıqdan dərhal sonra, namazdan əvvəl.",
    translation:
      "Şəhadət verirəm ki, Allahdan başqa heç bir tanrı yoxdur, şəriki yoxdur və şəhadət edirəm ki, Məhəmməd Onun qulu və Rəsuludur.",
    meaning:
      "Bədəniniz təzə təmizlənərkən iman şəhadətini təzələmək. Peyğəmbər (salləllahu aleyhi və səlləm) vəd etmişdir ki, kim dəstəmaz aldıqdan sonra bunu desə, Cənnətin səkkiz qapısı ona açılar ki, istədiyi qapıdan girsin.",
  },
  {
    title: "Təkbirətül-ehram",
    when: "Namazın əvvəlində və mövqelər arasında hərəkət edərkən.",
    translation: "Allah ən böyükdür.",
    meaning:
      "Namaz burada başlayır — “əl-ehram” sizə dünya işlərini (danışmaq, yemək, üz çevirmək) haram etmək deməkdir. Siz Allahı diqqətinizi yayındıra biləcək hər şeydən böyük elan edirsiniz və Onun hüzuruna tam addımlayırsınız. Sonra gələn hər təkbir o təslimiyyəti təzələyir.",
  },
  {
    title: "Duaul-İstiftah (açılış duası)",
    when: "Açılış təkbirindən sonra, Fatihədən əvvəl səssizcə.",
    translation:
      "İlahi, Sənə həmd və həmd olsun. Sənin adın mübarəkdir və əzəmətin ucadır. Səndən başqa tanrı yoxdur.",
    meaning:
      "Söhbəti Allahı təsbih və təsbih etməklə və Onun birliyini təsdiq etməklə açır, kəlamlarını oxumazdan əvvəl qəlbi sakitləşdirirsiniz. Bir neçə orijinal açılış duaları mövcuddur - bu, ən çox istifadə edilənlərdən biridir.",
  },
  {
    title: "Fatihə surəsi",
    when: "Hər rükətdə ayaq üstə durmaq - bir rükətdir ki, onsuz rükət batildir.",
    translation:
      "Mərhəmətli və Rəhmli Allahın adı ilə! Həmd olsun aləmlərin Rəbbi, mərhəmətli, rəhmli, haqq-hesab gününün sahibi olan Allaha! Sənə ibadət edir və Səndən kömək diləyirik. Bizi düz yola - nemət verdiyin kəslərin yoluna yönəlt, qəzəblənmişlərin və azğınların yoluna deyil.",
    meaning:
      '"Kitabın anası": yarı Allaha həmd, yarısı hidayət, onların arasında "Biz Sənə ibadət edirik" sözü ilə. Allah bu surəni Özü ilə qulu arasında böldüyünü söylədi - hər misranı oxuduqca cavab verir. Peyğəmbər (s) buyurur ki, onu oxumayan üçün namaz yoxdur.',
  },
  {
    title: "Rukuda zikr",
    when: "Təzim edərkən, düz ilə, arxaya oturdu.",
    translation: "Mənim əzəmətli Rəbbim pakdır.",
    meaning:
      "Rüku ehtiram duruşudur, ona görə də sən Allahın əzəmətini tərifləyirsən – üç və ya daha çox dəfə tələsmədən dedi. Peyğəmbər (sallallahu aleyhi və səlləm) öyrətdi ki, rükuda Rəbbi tərifləyirik, ona görə də duanızın qəbul olmasını ümid edin.",
  },
  {
    title: "Rükudan qalxmaq",
    when: "Rükudan sonra tam dik durmaq.",
    translation: "Allah Ona həmd edəni eşidir. Ey Rəbbimiz, həmd Sənə məxsusdur.",
    meaning:
      "Sən təsdiq edirsən ki, Allah Ona həmd edəni həqiqətən eşidir, sonra bütün həmdləri Ona qaytar. Həzrət Peyğəmbər (s) buyurur ki, imam bunu dedikdə və camaat cavab verdikdə, kimin sözü mələklərin sözü ilə üst-üstə düşərsə, keçmiş günahları bağışlanar.",
  },
  {
    title: "Səcdədə zikr",
    when: "Səcdədə - Allaha ən yaxın məqam.",
    translation: "Uca olan Rəbbim pakdır.",
    meaning:
      "Ən aşağı fiziki məqamda siz Uca Allahı izzətləndirirsiniz - ibadətin mərkəzində olan paradoksu. Peyğəmbər (salləllahu aleyhi və səlləm) buyurmuşdur ki, bəndə Rəbbinə səcdə halında ən yaxındır, ona görə də zikrdən sonra burada dua edin.",
  },
  {
    title: "İki səcdə arasında",
    when: "Hər rükətin birinci və ikinci səcdələri arasında sakit oturmaq.",
    translation: "Rəbbim, məni bağışla. Rəbbim, məni bağışla.",
    meaning:
      "Hər rükətdə qısa, lakin birbaşa bağışlanma yalvarışı - hətta orta namazda da Allahın əfvinə möhtac olduğumuzu xatırladan. İkinci səcdədən əvvəl rahat olana qədər oturun.",
  },
  {
    title: "ət-Təhiyyat (Təşəhhüd)",
    when: "Namazın ortasında və son iclasında.",
    translation:
      "Bütün salamlar, dualar, təmiz sözlər Allah üçündür. Salam olsun sənə, ey Peyğəmbər, Allahın rəhməti və bərəkəti. Salam olsun bizə və Allahın saleh bəndələrinə. Şəhadət verirəm ki, Allahdan başqa ilah yoxdur və şəhadət verirəm ki, Məhəmməd Onun qulu və Rəsuludur.",
    meaning:
      "Namazın oturan qəlbi: Hər cür ibadəti yalnız Allaha qılırsan, Peyğəmbərə və salehlərə salam göndərirsən və iki şəhadəti yenidən bəyan edirsən. İbn Məsud onu Peyğəmbərdən (sallallahu aleyhi və səlləm) bir surə öyrəndiyi kimi sözbəsöz öyrənmişdir.",
  },
  {
    title: "Salavat İbrahimiyyə",
    when: "Son təşəhhüddə, ət-Təhiyyətdən sonra.",
    translation:
      "İlahi, İbrahimə və İbrahimin ailəsinə bərəkət verdiyin kimi, Muhəmməd və Muhəmmədin ailəsinə salavat göndər. Həqiqətən, Sən tərifəlayiqsən, izzətlisən! İlahi! Həqiqətən, Sən tərifəlayiqsən, izzətlisən!",
    meaning:
      "Səhabələr ona necə salavat göndərəcəklərini soruşduqda, Peyğəmbər onlara bu dəqiq sözləri öyrətdi - Sünnədəki ən səhih salavat. Allahın buyurduğu kimi Peyğəmbərə (s) hörmət edirsən, sənə namazı öyrədənə məhəbbətlə namazını tamamlayırsan.",
  },
  {
    title: "Salamdan əvvəl sığınmaq",
    when: "Son təşəhhüd və salavatdan sonra, namazın bitməsinə az qalmış.",
    translation:
      "İlahi, qəbir əzabından, cəhənnəm əzabından, həyatın və ölümün fitnəsindən və yalançı Məsihin (Dəccalın) fitnəsinin şərindən Sənə sığınıram.",
    meaning:
      "Peyğəmbər (salləllahu aleyhi və səlləm) son təşəhhüddən sonra insanın salam verməzdən əvvəl bu dörd təhlükədən sığınmasını tapşırdı ki, namazın son nidası dünya həyatı, qəbri, Cəhənnəmi və gələcək ən böyük fitnəni əhatə edir.",
  },
  {
    title: "Təslim (bağlanış salamı)",
    when: "Namazı bitirmək — üzü sağa, sonra sola çevirmək.",
    translation: "Allahın salamı və rəhməti üzərinizə olsun.",
    meaning:
      "Namazı möhtərəmlərin yanından ayrıldığınız kimi tərk edirsiniz - hər çiyninizdə yazılan mələklərə və yanınızda namaz qılanlara salam verərək. Salam bir sütundur; onunla namaz tamam olur.",
  },
];
