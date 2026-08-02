// Azerbaijani translation overlay for the Learn "The Last Day" content. Mirrors the order of
// its English source in ../last-day*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  LastDayHadithEntry,
  LastDayQuizQuestion,
  LastDayReferenceEntry,
  LastDayTimelineEvent,
  LastDayTopic,
  LastDayVerseEntry,
} from "../../types/last-day";
import type { DeepPartial } from "./localize";

export const LAST_DAY_TOPICS_AZ: DeepPartial<LastDayTopic>[] = [
  {
    title: "Giriş",
    summary: "Axır gün nədir və nə üçün bu gün həyatımızı dəyişir?",
    body: [
      "Yəvmül-Qiyamə – Qiyamət, Qiyamət və Qiyamət günü – hər bir nəfsin əməlləri göstərilmək və son mənzili vermək üçün Allah dərgahına qayıtdığı gündür. Bu, uzaq bir əfsanə və ya poetik obraz deyil. Qur'an demək olar ki, hər səhifədə ondan bəhs edir və ilk Məkkə surələri məhz ona görə üstünlük təşkil edir ki, ona inanmaq insanın bütün həyatını yenidən nizamlayır. Həqiqətən Allahın hüzurunda dayanmağı gözlədiyiniz zaman dürüstlük, dua, mehribanlıq və təmkin isteğe bağlı bəzək olmaqdan çıxıb kim olduğunuzun mahiyyətinə çevrilir.",
      "Bu modul səyahət mərhələsini mərhələ-mərhələ gəzir: ölüm və ruhun getməsi, qəbirdə bərzəx intervalı, qiyamətdən əvvəl gələn kiçik və böyük əlamətlər, surun üfürülməsi, cəsədlərin dirilməsi, geniş bir düzənlikdə toplanılması, dəftərlərin yayılması, tərəzi, həzrətin şəfaəti, şəfaət və xaç. Körpü və nəhayət, iki əbədi ev - Cənnət və Cəhənnəm. Hər bir mərhələ Qurandan və səhih hədislərdən götürülüb.",
      "Burada hər şeyi iki prinsip idarə edir. Birincisi, bu hadisələrin gerçəkliyi qətidir və əqidə (əqidə) məsələsidir; dirilməyi və ya hesab verməyi inkar etmək dinin özünü inkar etməkdir. İkincisi, Qiyamətin dəqiq vaxtı yalnız Allaha məlumdur - heç bir alim, təqvim və ya hesablama bunu proqnozlaşdıra bilməz və tarixlə bağlı hər bir iddia batildir. Peyğəmbər (sallallahu aleyhi və səlləm) heç vaxt səhabələrinə geri sayım verməzdi; onlara yaşamaq üçün bir yol verdi. Beləliklə, axır gününü öyrənməkdə məqsəd proqnoz deyil, hazırlıqdır: ürəyi yumşaltmaq, prioritetləri düzəltmək və təyin olunmuş an gəlməmişdən əvvəl yaxşılığa doğru yarışmaqdır.",
      "Mənbələrə dair qeyd: məşhur “axırzamanın əlamətləri” söhbətləri zəif və hətta uydurma rəvayətlərlə doludur. Bu modul yalnız həqiqi olanı əhatə edir və səmimi sünni alimlərinin həqiqətən fərqləndiyi yerlərdə - məsələn, bəzi əsas əlamətlərin sırasına görə - bu fərq hamarlanmır və ya şişirdilmir, fərq kimi təqdim olunur.",
    ],
    quran: [
      {
        excerpt:
          "Yer son zəlzələ ilə silkələndiyi, yükünü atdığı və insan: “Bunun nə işi var? - O gün Rəbbinin ona vəhy etdiyinə görə öz xəbərini verəcəkdir. O gün insanlar əməllərini göstərmək üçün dəstə-dəstə ayrılacaqlar. Kim zərrə qədər yaxşılıq etsə, onu görəcək, kim zərrə qədər yaxşılıq etsə, onu görəcəkdir.",
      },
      {
        excerpt:
          "O, Öz əmrini vəhyini bəndələrindən istədiyi kəsi qiyamət günü ilə – onların zühur edəcəyi günlə qorxutmaq üçün vəhy edər. Bu gün hökmranlıq kimə məxsusdur? Tək olan, Qalib olan Allaha məxsusdur.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Niyə axirət gününə inanırsınız?",
    summary: "İmanın altı maddəsindən biri - motivasiya, ümid və son ədalət.",
    body: [
      "Qiyamət gününə iman Peyğəmbərin (sallallahu aleyhi və səlləm) mələk Cəbrail dini öyrətmək üçün gəldiyi zaman adlandırdığı imanın altı şərtindən biridir: Allaha, Onun mələklərinə, kitablarına, elçilərinə, axirət gününə və ilahi hökmə, onun xeyir və zərərinə inanmaq (Səhih Müslim 8). Bu inanc olmadan bütün məsuliyyət strukturu çökər, çünki Allaha qayıdış yoxdursa, zalımla övliyanın sonu eynidir və hər ibadət son mənası olmayan bir vərdişə çevrilir.",
      "Qur'an qiyamət günü üçün həm əxlaqi, həm də ağılla mübahisə edir. Mənəvi cəhətdən: bu, ədalətsizliyə cavabdır, çünki zalımların yataqlarında rahat öldüyü, məzlumların isə qisas almadan öldüyü bir dünya, əgər Allah həqiqətən ədalətlidirsə, hekayənin sonu ola bilməz. Ağıllı olaraq: sizi ilk dəfə yoxdan yaradan ikinci dəfə sizi bərpa etməyə qadir deyildir (Qur'an 36:78-79). Dirilmə ilk yaradılışdan daha asan, çətin deyil.",
      "Bu inanc həm də ürəyin iki mühərrikini – qorxu və ümidi nizama salır və onları tarazlıqda saxlayır. Xəbərdarlıqlar həqiqətdir, ona görə də mömin təkəbbür və qəflət etməz; lakin Allahın rəhməti genişdir və tövbə qapısı ölənə qədər açıqdır, buna görə də mömin heç vaxt ümidini kəsməz. Qorxu və ümid arasında yaşayan ürək, qırılmadan səy göstərən ürəkdir.",
      "Faktiki olaraq Qiyamət günü acizlərə ləyaqət, güclülərə isə təmkin verir. Zalımlara Allah tərəfindən heç bir zərərin unudulmamasından xəbər verilir, güclülərə isə haqq-hesab zamanı heç bir sərvət, məqam və təsirin onları qoruya bilməyəcəyini bildirir. Ona görə də ona inanmaq şəxsi rahatlıq deyil, bu dünyada ədalət, səbir və düzgünlük mənbəyidir.",
    ],
    quran: [
      {
        excerpt:
          "Yaxşılıq üzünüzü məşriqə və ya qərbə çevirməyiniz deyil, saleh o kəsdir ki, Allaha, axirət gününə, mələklərə, kitaba və peyğəmbərlərə iman gətirib, onu sevməsinə baxmayaraq malını qohum-əqrəbasına, yetimlərə, yoxsullara, müsafirə və istəyənlərə verir.",
      },
      {
        excerpt:
          "Heç vaxt Allahın zalımların etdiklərindən xəbərsiz olduğunu sanma. O, onları ancaq gözlərin qorxu ilə baxacağı günə qədər gecikdirir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "İman odur ki, Allaha, mələklərinə, kitablarına, elçilərinə, axirət gününə iman gətirəsən, ilahi hökmə, onun xeyir və zərərinə iman gətirəsən. — Cəbrail hədisdən, o, dini öyrətməyə gəldiyi zaman.",
      },
    ],
    actions: [
      "Niyyətinizi hər gün yeniləyin: Mənim əməllərim Allah üçün və Ona qovuşacağım gün üçündür.",
      "Haqsızlıq sizi ağrıtdıqda və heç bir yer məhkəməsi cavab vermədikdə, onu Qiyamət Məhkəməsinə həvalə edin.",
      "Qorxu və ümidi birlikdə saxlayın - nə qorxu sizi ümidsizliyə sürükləməsin, nə də ümid sizi laqeydliyə sürükləməsin.",
    ],
    appLinks: [{}],
  },
  {
    title: "Ölüm",
    summary: "Hər bir nəfs ölümü dadacaqdır - hüsnü-xatimə və mərhuma fayda verən şeylər.",
    body: [
      "Ölüm heç kimin qaçırmadığı bir görüşdür. Qur'an bunu açıq şəkildə bildirir: Hər bir nəfs ölümü dadacaqdır və əvəzi ancaq Qiyamət günü veriləcəkdir (Qur'an, 3:185). Ölüm məhv deyil, bir köçürmədir - ruh bədəni tərk edir və səyahətinin növbəti mərhələsinə keçir. Allahın əmanət etdiyi ölüm mələyi canı alır, sonra isə Rəbbinə qaytarılacaqsan (Qur'an, 32:11).",
      "Ölümün tərzi önəmli olduğu üçün mömin, Allah`ın razı qaldığı bir vəziyyətdə ölmək ümidi ilə səmimi tövbə, sabit dua və gözəl əxlaqla yaxşı bir son - hüsnü-xətimə doğru çalışır. Günahda israr edib tövbə etmədən üz döndərən şəxs üçün pis sonluq - su'ul-hatimə - qorxulur. Bununla belə, mərhəmət çox böyükdür: ölüm cingiltisi boğaza çatana qədər tövbənin qapısı açıq qalır, buna görə də heç kim nəfəsin qaldığı müddətdə çox gec olduğu qənaətinə gəlməməlidir.",
      'Peyğəmbər (s) ölümü tez-tez yada salmağı öyrədirdi - "Ləzzətləri məhv edəni çox xatırla", yəni ölümü (Cami ət-Tirmizi 2307, həsən) - bizi xəstələndirmək üçün deyil, oyaq qalmamaq üçün. Ölümü xatırlamaq bu dünyanın təsirini azaldır, kinləri yox edir və əslində vacib olanı yenidən sıralayır. Yalnız zəif hesabatlarda görünən ruhun gedişinin təfərrüatlarını bir kənara qoymaq daha yaxşıdır; orijinal material qorxu və hazırlığı aşılamaq üçün kifayətdir.',
      "Ölüm həm də əməllər dəftərini bağlayır - üç istisna olmaqla. Peyğəmbər (sallallahu aleyhi və səlləm) buyurdu ki, insan öldükdə üç əməldən başqa əməli kəsilir: daimi sədəqə (sədəqə cəriyə), faydası davam edən elm və onun üçün dua edən saleh övlad (Səhih Müslim 1631). Bu, çox praktikdir: bu o deməkdir ki, sağ ikən qurduğunuz, öyrətdiyiniz və böyütdüyünüz şeylər siz getdikdən sonra uzun müddət sizin üçün qazanmağa davam edə bilər.",
    ],
    quran: [
      {
        excerpt:
          "Hər bir nəfs ölümü dadacaqdır və Qiyamət günü sizə ancaq əvəziniz tam olaraq veriləcəkdir. Beləliklə, kim Cəhənnəmdən uzaqlaşdırılıb Cənnətə daxil edilərsə, nicat tapmışdır. Dünya həyatı isə ancaq aldanmaqdan ibarətdir.",
      },
      {
        excerpt:
          "De: “Sənə əmanət edilmiş ölüm mələyi səni götürəcək. sonra Rəbbinizin hüzuruna qaytarılacaqsınız.",
      },
    ],
    hadith: [
      {
        excerpt:
          "İnsan vəfat etdikdə onun üç əməli istisna olmaqla, əməli sona çatar: daimi sədəqə, fayda əldə edilən elm və ya onun üçün dua edən saleh övlad.",
      },
      {
        excerpt: "Zövqləri məhv edəni tez-tez xatırlayın - ölüm deməkdir.",
      },
    ],
    actions: [
      "İstiğfarı artırın və namazı vaxtında qılın - xüsusən də sağlam və məşğul olduğunuz zaman, təkcə xəstələnəndə deyil.",
      "Bu gün gecikdirdiyiniz hər şey üçün tövbə edin; sabah qumar oynamayın.",
      "Üç qalıcı əmələ sərmayə qoyun: davamlı sədəqə qurmaq, faydalı elm yaymaq və övladları tövhid və gözəl əxlaq üzərində böyütmək.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Bərzəx (qəbir həyatı)",
    summary: "Ölümdən sonra dirilməyə qədər olan fasilə - sorğu-sual və onun nəticələri.",
    body: [
      "Bərzəx maneə deməkdir və insanın ölümü ilə Qiyamət günü arasında olan bütün fasilənin adıdır. Quranda ölü zalım geri qaytarılmaq üçün yalvardığı zaman belə bir söz işlədilir: “Onların arxasında diriləcəkləri günə qədər bir sədd (bərzəx) vardır” (Qur'an, 23:100) – möhkəm bir divardır ki, oradan dünya həyata qayıtmaq mümkün deyil. Bədən basdırılsa da, yandırılsa da, boğulsa da, itsə də, ruh bərzəxə girər; qəbir sadəcə olaraq onun ən ümumi forması və hər bir insan üçün axirətin ilk mərhələsidir.",
      "Həqiqi hesabatlar dəfn edildikdən sonra sorğu-sualdan bəhs edir. İki mələk gəlib mərhuma üç sual verir: Rəbbin kimdir? Sizin dininiz nədir? Sənə göndərilən bu adam kimdir? Allahın möhkəm saxladığı mömin belə cavab verir: “Rəbbim Allahdır, dinim İslamdır, o da Muhəmməddir. sonra onun üçün qəbir genişləndirilir və yandırılır. Qafil olan: “Ah, bilmirəm” deyir və sıxıntıya rast gəlir (Cami ət-Tirmizi 1071, həsən, burada iki mələyin adı Münkər və Nəkirdir). Buna görə də Qur'an möminləri “dünya və axirətdə möhkəm sözlə” möhkəm saxladığı üçün Allaha həmd edir (Qur'an, 14:27).",
      "Daha sonra səadət və ya əzab qəbirdə gəlir və səhih mətnlərdə təsdiqlənir: “Qəbir ya Cənnət bağlarından bir bağdır, ya da Cəhənnəm çuxurlarından bir çuxurdur” (Cami ət-Tirmizi 2460, həsən səhih). Quranda Firon qövmünün qiyamət qopmadan “səhər-axşam” Cəhənnəmə düçar edilməsi əzabından bəhs edilir (Qur'an 40:46). Əhli-sünnə qeybə aid olduğu və dirilər tərəfindən dərk oluna bilmədiyi üçün onun dəqiq mahiyyətini Allaha buraxaraq, böyük mükafat və əzabın gerçəkliyini təsdiq edir.",
      "Qəbir sorğu-sualının və qəbir səadətinin və ya əzabının həqiqi olması haqqında ittifaq vardır; alimlər daha incə məqamları müzakirə edirlər - məsələn, bədənə, ruha və ya hər ikisinə toxunub-toxunmaması və adi məzarı olmayanlara necə çatması kimi - bu sualların diqqətini yayındırmağa imkan vermədən. Bərzəx böyük həvəsləndiricidir: qəbri yerin çuxurundan öz əməllərinin güzgüsünə çevirir və açıq-aydın göstərir ki, qabağa göndərdiyiniz şey sizi orada qarşılayacaq.",
    ],
    quran: [
      {
        excerpt:
          "Nəhayət, onlardan birinə ölüm gəldiyi zaman: “Ey Rəbbim, məni geri qaytar ki, qoyub getdiklərimdə yaxşılıq edim!” – deyər. Xeyr! Onun dediyi yalnız bir sözdür; Onların arxasında isə diriləcəkləri günə qədər bir maneə vardır.",
      },
      {
        excerpt:
          "Cəhənnəm – onlar səhər-axşam onun qarşısındadırlar. Qiyamət qopduğu gün: “Firon əhlini ən şiddətli əzaba düçar edin!” – deyiləcək.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qəbir ya cənnət bağlarından bir bağdır, ya da cəhənnəm çuxurlarından bir çuxurdur.",
      },
      {
        excerpt:
          "Mərhum dəfn edildikdə, iki mələk onun yanına gəlib soruşur: Rəbbin kimdir? Sizin dininiz nədir? sənin peyğəmbərin kimdir? Mömin yəqinliklə cavab verir və qəbri onun üçün genişlənir və işıqlandırılır.",
      },
    ],
    misconceptions: [
      "Yanlış fikir: Ağır cəza heç bir əsası olmayan xalq inancıdır. İslah: Sorğu-sualın, qəbir səadətinin və ya əzabın həqiqəti səhih hədislərdə təsbit edilmiş və Quranda işarə edilmişdir; sünni əqidəsinin oturuşmuş nöqtəsidir.",
      "Yanlış fikir: Mələklərin dəqiq görünüşü və adları üzərində mübahisə etməliyik. Düzəltmə: Münkər və Nəkirin adları həsən rəvayətdə gəlir; əsas inanc sualın özüdür. Ona doğru cavab verməyə hazırlaşmaq onun təfərrüatlarını müzakirə etməkdən daha vacibdir.",
    ],
    actions: [
      "İndi tövhid və sünnəyə möhkəm sarılın - qəbrin cavabları orada əzbərlənmir, burada yaşayır.",
      "Peyğəmbərin (sallallahu aleyhi və səlləm) qoruma və səbir olaraq öyrətdiyi səhər və axşam zikrini qoruyun.",
    ],
    appLinks: [{}],
  },
  {
    title: "Qiyamətin əlamətləri",
    summary: "Kiçik və böyük əlamətlər - Saatın dəqiqliyi, bilinməyən vaxt.",
    body: [
      'Qiyamətin qopacağı müəyyəndir, lakin onun vaxtı Allahın Özünə saxladığı bir sirrdir. Hətta Peyğəmbərdən (sallallahu aleyhi və səlləm) onun nə vaxt gələcəyini soruşduqda belə cavab verildi ki, soruşan soruşandan başqasını bilməz - onun elmi yalnız Allaha məxsusdur (Qur\'an 7:187). Beləliklə, hər hansı bir "işarəni" öyrənməzdən əvvəl həll edilməli olan ilk şey budur: əlamətlər bizi hazırlamaq üçün verilir, heç vaxt tarixi hesablamamıza icazə vermir. Hər kim bir ili qiyamət üçün adlandırsa, Qurana zidd olmuşdur.',
      "Alimlər əlamətləri iki cür qruplaşdırırlar. Kiçik əlamətlər (əl-əlamət əl-süğra) sona çatmazdan əvvəl uzun əsrlər ərzində formalaşan tədricən ictimai, əxlaqi və dünyəvi dəyişikliklərdir. Böyük əlamətlər (əl-əlamətul-kübra) sonda bir-birinə yaxınlaşan qeyri-adi, şübhəsiz hadisələr toplusudur. Qur'an qeyd edir ki, “onun bəzi əlamətləri artıq gəlib” (Qur'an 47:18) – bu, Peyğəmbərin ﷺ özünün gəlişi və ayın yarılmasını əhatə edir.",
      "Əsas dəlillərin əsas mətni Huzeyfə ibn Üseydin hədisidir ki, Peyğəmbər on hədisi sadalamışdır: tüstü (Duxan), Dəccal, yerin heyvanı (Dəbbətül-ərd), günəşin batdığı yerdən (qərbdən çıxması), Məryəm ibn Useydin (Məryəm ibn Üseydin) enməsi, Məcun və Məcun (ə) Məcuc) və üç böyük sürüşmə - biri şərqdə, biri qərbdə və biri də Ərəbistan yarımadasında - insanları toplaşdıqları yerə aparan yanğınla möhürlənmişdir (Səhih Müslim 2901). Mehdi və Dəccal başqa səhih rəvayətlərdə gəlir və İsanın enişindən əvvəl qoyulur.",
      "Dürüst elmi mövqe ondan ibarətdir ki, hər bir əlamət təsdiq edilsə də, onların dəqiq sırası mətnlər tərəfindən tam şəkildə müəyyən edilməmişdir və mötəbər sünni alimləri dəqiq ardıcıllıqla ixtilaf edirlər. Bu fərq ənənənin normal bir hissəsidir və mübahisəyə səbəb yoxdur. Bütün bunlara peyğəmbərin cavabı qorxu və ya cari hadisələr haqqında sonsuz fərziyyə deyil, imanın, tövbənin və faydalı əməllərin artmasıdır.",
    ],
    quran: [
      {
        excerpt:
          "Səndən o Saat haqqında soruşurlar ki, o nə vaxt qopacaq? De: “Onun elmi ancaq Rəbbimin yanındadır. Onun vaxtını Ondan başqa heç kəs aşkar edə bilməz. O, göylərdə və yerdə ağırdır. O, ancaq gözlənilmədən başınıza gəlməyəcək.",
      },
      {
        excerpt:
          "Məgər onlar o Saatın qəflətən başlarına gəlməsinimi gözləyirlər? Onun bəzi əlamətləri artıq gəlib. Bəs onlara (qiyamət günü) gəldikdə, necə xatırlanacaqlar?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Siz ondan əvvəl on əlamət görməyincə qiyamət qopmaz: tüstü, Dəccal, heyvan, günəşin qərbdən çıxması, Məryəm oğlu İsanın enməsi, Yəcuc və Məcuc, biri şərqdə, biri qərbdə, biri də Ərəbistan yarımadasında üç sürüşmə və sonuncusu da insanları atəşə qovuşdurur.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kiçik əlamətlər",
    summary: "Peyğəmbərin ﷺ təsvir etdiyi tədricən dəyişikliklər - çaxnaşma üzərində hazırlıq.",
    body: [
      "Kiçik əlamətlər, Peyğəmbərin (sallallahu aleyhi və səlləm) qiyamət yaxınlaşdıqca artır olaraq xarakterizə etdiyi cəmiyyətdə, əxlaqda və elmdə yavaş, məcmu dəyişikliklərdir. Onlar çoxdur və təbiətlərinə görə bir dramatik anda deyil, uzun müddət ərzində açılırlar. Ən böyük kiçik əlamət, əslində, artıq baş vermişdir: “Mən və Qiyamət bu ikisi kimi göndərilmişik” deyən Məhəmməd Peyğəmbərin iki barmağını birləşdirərək göndərilməsi, yəni son elçi və son dövr başlamışdır.",
      "Mötəbər hədisdə qeyd olunan əlamətlərdən: işlərin onlara yaraşmayanlara təhvil verilməsi üçün əmanətin itirilməsi - “Əmanət itirildikdə, Qiyaməti gözləyin” və “haqqı olmayanlara səlahiyyət verildikdə” baş verir (Səhih əl-Buxari 6496). Cəbrailin məşhur hədisində Peyğəmbər (s) iki parlaq əlamət göstərmişdir: “Kəriyə öz məşuqəsini dünyaya gətirəcək və sən ayaqyalın, çılpaq, kimsəsiz çobanların hündür binalar tikməkdə yarışdığını görəcəksən” (Səhih Müslim 8).",
      'Digərlərinə zamanın hiss olunmasında ümumi sürətlənmə, zəlzələlərin və ölümlərin artması və biliyin yox olması daxildir. Elmlə bağlı Peyğəmbər (s) mexanizm haqqında dəqiq buyurmuşdur: “Elm götürülmədikcə, zəlzələlər çoxalmadıqca, vaxt tez keçmədikcə, fitnələr görünmədikcə və qətllər çoxalmayınca, qiyamət qopmaz” (Səhih əl-Buxari 1036). Və elmin necə getdiyini belə izah etdi: “Allah elmi insanlardan qoparmaqla deyil, alimləri əlindən almaqla, heç biri qalmayana qədər və insanlar cahilləri rəhbər tutaraq soruşulanları rəhbər tuturlar və elmsiz hökm verirlər, beləliklə də azarlar və başqalarını da azdırarlar” (Səhih əl-Buxari 100). Beləliklə, "bilik itkisi" məlumat çatışmazlığı deyil - bir yaş məlumatlarda boğula bilər - sağlam alimlərin və yaşanmış təcrübənin itirilməsidir.',
      "Burada mühüm bir nizam-intizam: müəyyən bir müasir hadisənin müəyyən bir hədisin yerinə yetirildiyini bəyan etmək qəti deyil, təfsirdir. Göydələn yarışları və ya artan cinayətlər Peyğəmbərin sözləri ilə səsləşə bilər, lakin başlıqlara inamla vəhy təyin etmək diqqətli alimlərin yolu deyil. Hər kiçik əlamətə düzgün cavab batinidir: onu Allaha qayıtmağa, dini öyrənmək və ona əməl etməyə çağırış kimi oxuyun, təşviş və tamaşa üçün deyil, əmanət və doğruluqdan möhkəm yapışın.",
    ],
    hadith: [
      {
        excerpt:
          "Etibar itirildikdə, Saatı gözləyin. Soruşdular: Necə itəcək, ya Rəsulallah? Buyurdu: “Hakimiyyət ona layiq olmayanlara verildikdə, o saatı gözləyin.",
      },
      {
        excerpt:
          "Qiyamətin əlamətlərindən: kəniz öz məşuqəsini dünyaya gətirəcək və hündür binaların tikintisində ayaqyalın, çılpaq, kimsəsiz çobanların yarışdığını görəcəksən. - Cəbrail hədisindən.",
      },
      {
        excerpt:
          "Allah biliyi əlindən almaqla aradan qaldırmaz, ancaq alimləri götürməklə aradan götürər, nə qədər ki, heç biri qalmasın və insanlar nadanları nadanları rəhbər tutsunlar, beləliklə də onlar azdırıb başqalarını da azdırsınlar.",
      },
    ],
    disclaimer:
      "Müəyyən cari hadisələrə xüsusi kiçik işarələrin tətbiqi təfsirlidir, müəyyən deyil. Bu modul hansı müasir hadisələrin onları qəti şəkildə yerinə yetirdiyini iddia etmədən səhih hədisləri təqdim edir.",
    actions: [
      "İxtisaslı müəllimlərdən faydalı bilik axtarın, ona uyğun hərəkət edin və ötürün - bu, biliyin yox olması əlamətinə birbaşa müqavimət göstərir.",
      "Danışıqda, işinizdə və rəftarınızda etibarlılığı və doğruluğu qoruyun.",
      "Hər işarəni çaxnaşma və ya onlayn fərziyyə üçün yanacaq kimi deyil, tövbəyə çağırış kimi daxilən oxuyun.",
    ],
  },
  {
    title: "Əsas əlamətlər",
    summary: "Səhih Müslimdə on əsas əlamət - Mehdi, Dəccal, İsa və s.",
    body: [
      "Əsas əlamətlər, zamanın sonuna yaxın toplanan böyük, şübhəsiz hadisələrdir. Onların nizamnaməsi Huzeyfə ibn Üseydin hədisidir: Peyğəmbər (s) qiyamət haqqında danışan səhabələrinə baxdı və dedi ki, onlar on əlamət – tüstü (Duxan), Dəccal, yerin heyvanı (Dəbbətül-ərd), günəşin Yəsibinin qərbindən çıxması, Məryəmin qürubdan çıxması, Məryəmin qütbündən doğulması və mərhəmətin on əlamətini görməyincə o saat gəlməyəcək. Məcuc, üç sürüşmə (şərq, qərb və Ərəbistanda) və nəhayət insanları toplaşdıqları yerə aparan yanğın (Səhih Müslim 2901). Kiçik əlamətlərdən fərqli olaraq, bunlar başlayan kimi bir-birini yaxından izləyirlər.",
      "Mehdi, yer üzünü zülmlə dolduğu kimi ədalətlə dolduracaq, Peyğəmbərin (sallallahu aleyhi və səlləm) ailəsindən ədalətli bir rəhbər kimi səhih xəbərlərdə gəlir (Sünən Əbi Davud 4282, həsən). O, şəriətçi və ya yeni peyğəmbər deyil – dirildir, uydurmur – ona imanı Əhli-sünnə təsdiq edir, zəif rəvayətlərdə əlavə təfərrüatlar bir kənara qoyulur.",
      "Dəccal (yalançı Məsih) ən böyük dünya imtahanıdır. Nəvvas ibn Səmənin (Səhih Müslim 2937) uzun hədisində Peyğəmbər (s) onu uzun-uzadı təsvir etmişdir: Gözlərinin arasına “kafir” yazılmış, hər bir peyğəmbərin öz qövmünü xəbərdar etdiyi imanı sınamaq üçün güc vermiş, tək gözlü bir aldadıcı idi. Onun fitnəsi mübahisə ilə deyil, möhkəm imanla məğlub olur və Peyğəmbər (salləllahu aleyhi və səlləm) Kəhf surəsinin ilk ayələrini əzbərləməyi qorumağı öyrədir.",
      "İsa ibn Məryəm (əleyhissalam) daha sonra sünni əqidəsinin möhkəm nöqtəsi olan nazil olacaq. Peyğəmbər (salləllahu aleyhi və səlləm) buyurdu: “Nəfsim əlində olana and olsun ki, Məryəm oğlu tezliklə aranıza ədalətli bir hökmdar olaraq nazil olacaqdır. xaçı sındıracaq, donuzları öldürəcək, cizyəni ləğv edəcək və heç kim onu ​​qəbul etməyənə qədər sərvət aşıb-daşacaq” (Səhih əl-Buxari 3448). O, Muhəmmədin (s) ardıcılı olaraq nazil olur, ümmətin imamının arxasında namaz qılır (Səhih əl-Buxari 3439), Dəccalı öldürür və Məhəmmədin (s) şəriəti ilə hökm edir. Sonra Yəcuc və Məcuc azad edilir və qalan əlamətlər insanları bir yerə toplayan atəşə qədər açılır.",
      "Dürüstlüyün iki nöqtəsi. Birincisi, alimlər on nişanəlik hədisdəki hər işarənin həqiqəti ilə bağlı həmfikirdirlər, lakin onların dəqiq sırası ilə bağlı ixtilaf edirlər və bu fərq qanuni və köhnədir. İkincisi, Duxan və Heyvan bu səhih hədisin bir hissəsidir; onları ayrı-ayrılıqda təfərrüatlandıran bəzi digər rəvayətlər güc baxımından dəyişir, ona görə də bu modul zəif əlavələrə deyil, güclü on işarəli hesabata inanır.",
    ],
    hadith: [
      {
        excerpt:
          "On əlamət görməyincə Qiyamət qopmayacaq: tüstü, Dəccal, vəhşi heyvan, günəşin qərbdən çıxması, Məryəm oğlu İsanın enməsi, Yəcuc və Məcuc, biri şərqdə, biri qərbdə, biri də Ərəbistan yarımadasında üç sürüşmə, axırıncısı isə camaatı özlərinə doğru aparan oddur.",
      },
      {
        excerpt:
          "Canım əlində olana and olsun ki, Məryəm oğlu tezliklə aranıza ədalətli bir hökmdar olaraq nazil olacaqdır. O, xaçı sındıracaq, donuzları öldürəcək, cizyəni ləğv edəcək və var-dövlət o qədər çoxalacaq ki, heç kim onu ​​qəbul etməyəcək.",
      },
      {
        excerpt:
          "Əgər dünyadan bircə gün qalsaydı, Allah o günü uzadardı, ta ki, mənim ailəmdən (Mehdi) yer üzünü haqsızlıq və zülmlə dolduğu kimi ədalətlə dolduracaq bir kişi çıxartdı.",
      },
    ],
    disclaimer:
      "Əsas əlamətlərin reallığı təsdiq edilmişdir, lakin onların dəqiq ardıcıllığı və vaxtı alimlər tərəfindən tam razılaşdırılmamışdır. Tarix təyin etməkdən çəkinin və indiki şəxsiyyətlərin Mehdi, Dəccal və ya İsa olduğunu iddia etməkdən çəkinin.",
    appLinks: [{}],
  },
  {
    title: "Trompet",
    summary: "İsrafil — birinci partlayış, ikinci partlayış və dirilmə.",
    body: [
      "Allah aqibəti təyin etdikdə ona əmanət verilən mələk (Sur) üfürür. Ona İsrafil adının verilməsi elmi rəvayətdən irəli gəlir; Qur'anın qəti şəkildə təsbit etdiyi hadisənin özü və dəhşətidir. Peyğəmbər (salləllahu aleyhi və səlləm) onun nə qədər yaxın olduğunu bildirmişdir: “Mən necə rahat ola bilərəm ki, sur sahibi onu ağzına qoyub, alnını əyib və üfürmək əmrini gözləyir?”. - və bu, səhabələri sıxdığı zaman onlara deməyi öyrətdi: “Allah bizə kifayətdir və O, ən yaxşı vəkildir” (Cami ət-Tirmizi 2431, həsən).",
      "İki partlayış var və Qur'an onları fərqləndirir. Birincisi, “Sur üfürüləcək, Allahın istədiyindən başqa, göylərdə və yerdə olanlar ölüb yıxılacaqlar” (Qur'an 39:68) – yaradılmış nizamı sona çatdıran qorxu və ölüm səsi. Sonra ikincisi gəlir: “Sonra yenidən üfürüləcək və dərhal durub baxacaqlar” (eyni ayə davam edir) – bütün məxluqatın ölülərdən dirildiyi dirilmə partlayışı.",
      "Bir çox alimlər, eyni ayədən və əlavə xəbərlərdən, bir istisnadan - \"Allahın istədiyi kimsələrdən\" vurulmayanlardan - və iki partlayış arasındakı fasilədən bəhs edir, baxmayaraq ki, onun uzunluğu və təfərrüatları müxtəlif güclü xəbərlərə əsaslanır və Allaha buraxılır. Əminlik cüt partlayışdır: sonluq, sonra yüksəliş. Bu, 'Xəbərdarlıq Günü' (Qur'an 50:20) adlanır, çünki bu, hazırlaşmaq üçün vaxt olmadıqda səslənən son çağırışdır - məhz buna görə də çağırışa indi cavab vermək lazımdır.",
    ],
    quran: [
      {
        excerpt:
          "Sur üfürüləcək, Allahın istədiyi kimsələrdən başqa, göylərdə və yerdə olanlar ölüb yıxılacaqlar. Sonra yenidən üfürüləcək və dərhal dayanıb baxacaqlar.",
      },
      {
        excerpt: "Sur üfürüləcəkdir. O, xəbərdarlıq günüdür.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mən necə rahat ola bilərəm ki, zurnalı onu ağzına qoyub, alnını əyib üfürmək əmrini gözləyir? Səhabələr sıxıldılar və onlara dedi: “Allah bizə kifayətdir və O, ən yaxşı vəkildir”.",
      },
    ],
  },
  {
    title: "Dirilmə",
    summary: "Bərpa olunan bədənlər - Allah qarşısında dayanmağın universallığı.",
    body: [
      "İkinci partlayışda ölülər dirilir, bədən və ruh və dirilmə yalnız ruhani deyil, həqiqi və fizikidir. Qur'an şübhəlinin istehzasına baş-başa cavab verir: bir adam dağılmış sümüyü qaldırıb soruşur ki, onu kim canlandıra bilər; Cavab belədir: “De: “Onu ilk dəfə yaradan O, dirildəcək və O, hər şeyi biləndir” (Qur'an, 36:78-79). Əgər səni yoxdan var etmək Allahın ixtiyarında olsaydı, səni bərpa etmək daha çətin deyil.",
      "Dirilmə ümumbəşəridir - birincidən sonuncuya qədər hər bir insan, hər bir millət dirildi. Peyğəmbər (salləllahu aleyhi və səlləm) insanların ayağa qalxdığı vəziyyəti belə təsvir etmişdir: “İnsanlar ayaqyalın, çılpaq və sünnətsiz toplanacaqlar”. Aişə qorxu içində kişi və qadınların bir-birinə baxıb-gözləməyəcəyini soruşduqda o, o günün məsələsinin heç kimi narahat etməyəcək qədər ağır olacağını söylədi (Səhih əl-Buxari 6527). Həmçinin dedi: “Siz ayaqyalın, çılpaq və sünnətsiz olaraq toplanacaqsınız və Qiyamət günü ilk geyinən İbrahim olacaq” (Səhih əl-Buxari 3349).",
      "Doktrinanın məqsədi tamaşa deyil, onun tətbiq etdiyi məsuliyyətdir. Çünki Allaha qayıdış mütləqdir, heç bir əməl həqiqətən məxfi deyil və heç bir ölüm xilas yolu deyil. “Qiyamət qopacaq – ona heç bir şəkk-şübhə yoxdur – və Allah qəbirlərdə olanları dirildəcəkdir” (Qur'an, 22:7). Bədənin dirilməsinə inam bu həyatın əxlaqi ağırlığını müvəqqəti deyil, gerçək edən şeydir.",
    ],
    quran: [
      {
        excerpt:
          "O, Bizə bir misal gətirir və öz yaradılışını unudaraq deyir: “Çürümüş sümükləri kim dirildər? De: “Onları ilk dəfə yaradan Allah onları dirildəcək. O, hər şeyi biləndir.",
      },
      {
        excerpt:
          "Qiyamətin gələcəyinə – buna heç bir şəkk-şübhə yoxdur – və Allah qəbirlərdə olanları dirildəcəkdir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ayaqyalın, çılpaq və sünnətsiz toplanacaqsınız. Sonra oxudu: İlk yaradılışa başladığımız kimi, onu da təkrar edəcəyik. Qiyamət günü ilk geyinən də İbrahimdir.",
      },
      {
        excerpt:
          "İnsanlar ayaqyalın, çılpaq və sünnətsiz toplanacaq. Aişə dedi: Kişilər və qadınlar bir-birinə baxacaqlarmı? O dedi: İş bunun üçün çox ağır olacaq.",
      },
    ],
  },
  {
    title: "Toplantı (Məhşər)",
    summary: "Allahın hüzurunda dayanmaq - günəş yaxın, tər və insanların halları.",
    body: [
      "Qiyamətdən sonra bütün yaradılış hökmü gözləmək üçün bir geniş, düz düzənliyə - Məhşərə sürülür. Yerin özü dəyişdirilir: “O gün yer və göylər də başqa bir yerlə əvəzlənəcək və onlar tək və hakim olan Allahın hüzuruna çıxacaqlar” (Qur'an, 14:48). Heç bir əlamətdar yer, gizlənmək üçün heç bir izdiham, söykənəcək status yoxdur - yalnız açıq və gözləyən hər bir ruh var.",
      "O dayanmağın şərtləri ağırdır. Peyğəmbər (salləllahu aleyhi və səlləm) demişdir: “Qiyamət günü günəş insanlara o qədər yaxınlaşacaq ki, bir mil məsafədə olacaq və onlar əməllərinə görə tər içində batarlar – bəziləri topuqlarına, bəziləri dizlərinə, bəziləri bellərinə, bəziləri isə tər cilovlayar” (Səhih Müslim 2864). Halbuki eyni rəvayətlərdə mərhəmət əməllərlə bölüşdürülür: Peyğəmbərin (sallallahu aleyhi və səlləm) adını çəkdiyi bir kateqoriya Allahın Ərşinin kölgəsində Onun kölgəsindən başqa heç bir kölgə olmadığı bir gündə Allahın Ərşinin kölgəsində kölgələnəcəkdir - onların arasında ədalətli rəhbər, ibadətlə böyüdülmüş gənclər və gizli sədəqə verənin sol əli sağ əlinin nə xərclədiyini bilmirdi.",
      "İntizar uzundur – Qur'an “ölçüsü əlli min il olan bir gündən” bəhs edir (Qur'an 70:4), lakin onun uzunluğu hamı üçün eyni deyil. Səhih xəbərlərdə deyilir ki, bu, mömin üçün iki namaz arasındakı vaxt qədər qısa, digərləri üçün isə yüngülləşəcək. Beləliklə, Mahşar həyatın şəxsi dəftərinin ictimai reallığa çevrildiyi yerdir: eyni günəş, eyni düzənlik və tamamilə fərqli təcrübələr, tamamilə hər bir insanın irəliyə göndərdiklərindən alınır.",
    ],
    quran: [
      {
        excerpt:
          "O gün yer və göylər başqa yerlə əvəzlənəcək və onlar tək olan Allahın hüzuruna çıxacaqlar.",
      },
      {
        excerpt:
          "Mələklər və Ruh (Cəbrail) Onun hüzuruna ölçüsü əlli min il olan bir gündə yüksələr.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qiyamət günü günəş insanlara bir mil qədər yaxınlaşana qədər yaxınlaşdırılacaq və onlar əməllərinə görə tərə qərq olacaqlar - bəziləri topuqlarına, bəziləri dizlərinə, bəziləri bellərinə, bəziləri isə tər cilovlanacaq.",
      },
    ],
  },
  {
    title: "Şəfaət (Şəfa)",
    summary: "Yalnız Allahın izni ilə - növlər və ən böyük şəfaət.",
    body: [
      "Şəfaət şəfaətdir - bir zümrə digərinin adından Allahla danışır. O, həqiqidir və rəhmətdir, lakin heç vaxt müstəqil deyildir: Allahın izni olmadan və yalnız Onun razı olduğu şəxsə şəfaət edən yoxdur. Qurani-kərim hökmü iki dəfə bəyan edir: “Onun izni olmadan Onun yanında kim şəfaət edə bilər?”. (Bəqərə, 255) və “Onun dərgahında icazə verdiyi kimsədən başqa şəfaət fayda verməz” (Qur'an, 34:23). İslamın şəfaət doktrinasını onun hər bir fəsadından ayıran da məhz bu şərtdir.",
      "Ən böyüyü, Həzrət Muhəmməd s. Uzun müddət əzilən Məhşərdə bəşəriyyət peyğəmbərdən peyğəmbərə - Adəm, İbrahim, Musa, İsa - hər biri üzrlü olaraq Məhəmmədin (s) yanına gedəcəklər. Ərşin altına səcdə edər və ona deyərlər: “Başını qaldır, istə, sənə veriləcək, şəfaət et və şəfaətin qəbul olunacaq” (Səhih əl-Buxari 7440; peyğəmbərlərin tam silsiləsi Səhih Müslim 195). Bununla o, Allahdan haqq-hesabın başlamasını və ayağa qalxmasını istəyir - yalnız ona vəd edilmiş həmd məqamı.",
      "Digər möminlərin hesabsız olaraq Cənnətə daxil olmalarına şəfaət; dərəcələri yüksəldən şəfaət; və hər şeydən əvvəl möminlər arasında olan böyük günahkarlara şəfaətdir ki, insanlar Peyğəmbərin , digər peyğəmbərlər, mələklər, möminlərin şəfaəti və nəhayət, rəhm edənlərin ən rəhmlisi olan Allahın rəhməti ilə Cəhənnəm odundan çıxarılsınlar. Peyğəmbərlər, şəhidlər, salehlər və hətta kiçik yaşda vəfat etmiş uşaqlar, fərdi xəbərlərin gücü fərqli olsa da, icazə ilə şəfaət edə bilərlər.",
      "Vacib xəbərdarlıq: axirətdə şəfaət heç vaxt ölü və ya qeybi indi köməyə çağırmağa icazə vermir. Qəbirdə peyğəmbərə və ya övliyaya dua etmək, sıxıntını aradan qaldırmaq və ya ehtiyacını ödəmək istəmək Allahdan qeyrisinə ibadətə yönəltməkdir, yəni şirkdir və burada təsvir edilən şəfaətin əksinədir ki, bu da Allahın o gündə istədiyinə bəxş etdiyi bir nemətdir. Həm də bu həyatda iman və tövbə ehtiyacını əvəz etmir; tövhidlə yaşayıb ölənlərə Allahın mərhəmətidir.",
    ],
    quran: [
      {
        excerpt:
          "Onun izni olmadan Onun yanında kim şəfaət edə bilər? O, onların önündə olanı da, sonrakıları da bilir.",
      },
      {
        excerpt: "İzn verdiyi kimsə istisna olmaqla, şəfaət Onun yanında fayda verməz.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Camaat yanıma gələcək, mən də Allaha səcdəyə qapanacağam və deyiləcək: Ey Məhəmməd, başını qaldır! istəsən, sənə veriləcək, şəfaət et və şəfaətin qəbul olunacaq.",
      },
      {
        excerpt:
          "İnsanlar Adəmə, sonra İbrahimə, sonra Musaya, sonra İsaya (ə) gedəcək və hər biri Muhəmmədin (sallallahu aleyhi və səlləm) hüzuruna gələnə qədər üzr istəyəcək və ona ən böyük şəfaət veriləcəkdir.",
      },
    ],
    misconceptions: [
      "Yanlış fikir: Şəfaət istəmək Peyğəmbərə (s) və ya salehlərə ibadət etmək deməkdir. Düzəliş: İbadət yalnız Allaha məxsusdur; Qiyamət günü şəfaət Allahın izni ilə bəxş etdiyi bir rəhmətdir və bu dünyada ölüləri çağırmağa haqq qazandırmaz.",
    ],
  },
  {
    title: "Əməllərin qeydi",
    summary: "Qeyd edən mələklər - sağ əl, sol əl, heç bir şey buraxılmayıb.",
    body: [
      "Hər bir insanın əməllərini yazmaq üçün iki nəcib katibi vardır: “İki qəbuledici sağda və solda oturaraq qəbul etdikdə, heç bir söz söyləməz, yanında yazmağa hazır olan bir müşahidəçi olmalıdır” (Qur'an, 50:17-18). Qiyamət günü bu qeydlər paylanır və insanın kitabını alma tərzinin özü ilk hökmdür - müvəffəq olan üçün sağ əldə, sol əldə və ya xarab olan üçün arxadan (Qur'an 84:7-12; 69:19-37).",
      "Bu qeydlərdən heç bir şey buraxılmır - ən kiçik bir hərəkət, əmələ çevrilən keçici düşüncə deyil. Zalımlar onun tamlığından məəttəl qalacaqlar: “Onlar deyəcəklər: “Vay halımıza! Bu kitab nədir ki, onu qeyd etməsindən başqa kiçik və ya böyük heç nə qoymur? Onlar özlərinin qarşısında etdiklərini görəcəklər və sənin Rəbbin heç kəsə zülm etməz” (Qur'an, 18:49). Allahın rəhməti ilə yaxşı niyyətlər və tərk edilmiş günahlar da möminin lehinə yazılır.",
      "Çünki vərəqləri dolduran dil və əzalardır, onları qorumaq dəftəri qorumaqdır. Həzrət Peyğəmbər (s) dili qurtuluşun mərkəzinə qoymuşdur: “Kim mənə çənəsi arasında və ayaqlarının arasında olana zəmanət verərsə, mən də ona Cənnəti zəmanət verərəm” (Səhih əl-Buxari 6474) – yəni hər kəs öz sözünü və iffətini qoruyar. Gündəlik özünü vicdanla nəzərdən keçirmək vərdişi - bu gün kitaba nə əlavə olunduğunu soruşmaq - möminin saxlaya biləcəyi ən ayıq və faydalı təcrübələrdən biridir.",
    ],
    quran: [
      {
        excerpt:
          "Və dəftər qoyulacaq və günahkarların içindəkilərdən qorxaraq: “Vay halımıza! Bu kitab nədir ki, onu qeyd etməsindən başqa kiçik və ya böyük heç nə qoymur? Və onlar etdikləri hər şeyi üzə çıxaracaqlar və sənin Rəbbin heç kəsə zülm etməz.",
      },
      {
        excerpt:
          "Kimin dəftəri sağ əlinə verilsə, o deyəcək: Budur, mənim dəftərimi oxu! Hesabımla görüşəcəyimə əmin idim. Beləliklə, o, xoş bir həyatda olacaq. Amma dəftəri sol əlinə verilən şəxs deyəcək: “Kaş ki, dəftərim mənə verilməsəydi”.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim mənə çənəsi və ayaqları arasında zəmanət verərsə, mən də ona Cənnəti, yəni dilini və iffətini təmin edirəm.",
      },
    ],
    actions: [
      "Dili demək olar ki, hər şeydən üstün tutun - yaxşı və ya pis rekordu dolduran şeylərin çoxu ondan keçir.",
      "Yatmazdan əvvəl gününüzü nəzərdən keçirin: kitabınızda yazılanları görmək üçün nə istədiyinizi və nədən qorxduğunuzu soruşun.",
    ],
    appLinks: [{}],
  },
  {
    title: "Tərəzi (Mizan)",
    summary: "Tərəzi çəkilən əməllər - ixlas, xarakter və zikr tərəzisini ağır edər.",
    body: [
      "Mizan, əməllərin mütləq ədalətlə çəkildiyi tərəzidir: “Biz ədalət tərəzisini Qiyamət günü üçün qoyuruq ki, heç kəsə haqsızlıq edilməz. xardal dənəsi ağırlığında olsa belə, Biz onu çıxardacağıq. Əhli-sünnə bunu adi bir məcaz deyil, həqiqi bir tərəzi kimi təsdiq edir - əməllər və ya onların qeydləri həqiqətən ölçülür. İnsanın taleyi hansı tavanın batacağına çevrilir: “Tərəzisi ağır olana gəlincə, o, xoş həyatda olar; Kimin tərəzisi yüngül olarsa, onun sığınacağı yer uçurum olacaqdır” (Qur'an, 101:6-9).",
      "Tərəzinin ağırlığını çəkən şey, işin çoxluğu deyil, Allah yanında ağırlığıdır və çəkisi ixlasdandır. Həzrət Peyğəmbər (salləllahu aleyhi və səlləm) zəhmətsiz, lakin böyük olan əməllərə işarə etmişdir: “Dildə yüngül, tərəzidə ağır, Rəhmana sevimli olan iki kəlmə: SübhanAllahi və bihəmdih, SübhanAllahil-Əzim” (Səhih əl-Buxari 6406). Həmçinin buyurmuşdur: “Qiyamət günü möminin tərəzisində gözəl əxlaqdan daha ağır bir şey yoxdur” (Cami ət-Tirmizi 2002, səhih). Beləliklə, səmimi bir şəkildə təkrarlanan sadə bir xatırlama və ya səbirli yaxşı davranış, möhtəşəm fəaliyyətin dağlarını üstələyə bilər.",
      "Bunun əksi boş işlərin təhlükəsidir. İnsanlara görünmək üçün edilən (riya) və ya riya ilə pozulan hərəkətlər tərəziyə çəkisiz – zahirən böyük, daxilən boş gələ bilər. Buna görə də ixlas çoxlu fəzilətlərdən biri deyil, hər bir əmələ öz çəkisini verən şeydir. Dərs günü kiçik, səmimi, ardıcıl əməllər ətrafında qurmaq və görünənlərin arxasındakı niyyəti təmizləməkdir.",
    ],
    quran: [
      {
        excerpt:
          "Biz qiyamət günü üçün ədalət tərəzisini qoyuruq ki, heç kəsə haqsızlıq edilməsin. Əgər bir xardal dənəsi ağırlığında olsa, onu çıxardarıq və Biz mühasib olaraq kifayət edirik.",
      },
      {
        excerpt:
          "Kimin tərəzisi ağır olarsa, o, xoş həyatda olar. Kimin tərəzisi yüngül olarsa, onun sığınacağı yer uçurum olar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dildə yüngül, tərəzidə ağır, Rəhmana sevimli olan iki kəlmə: SübhanAllahi və bihəmdih, SübhanAllahil-Əzim.",
      },
      {
        excerpt:
          "Qiyamət günü möminin tərəzisində gözəl əxlaqdan daha ağır bir şey yoxdur. Həqiqətən, gözəl əxlaqlı şəxs bununla oruc tutan və namaz qılan məqamına çatar.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Məsuliyyət (Hisab)",
    summary: "Asan hesablaşma, təfərrüatlı hesablaşma və başqalarına borclu olan hüquqlar.",
    body: [
      "Hisab, hər kəsin öz həyatına görə haqq-hesab çəkilməsidir. Qurani-kərimdə bunun iki çox fərqli yaşandığı bildirilir: “Kimin dəftəri sağ əlinə verilsə, o, asan bir haqq-hesabla mühakimə olunacaq və qövmünün yanına xoşbəxtliklə qayıdacaq; ancaq arxasınca dəftəri verilən şəxs məhvə çağırar” (Qur'an 84:7-11). “Asan hesab” imtahandan əskiklik deyil, mərhəmətdir – Peyğəmbər (sallallahu aleyhi və səlləm) xəbərdar etdi ki, sorğu-sualın şiddəti özü də bir növ cəzadır.",
      "Əsas fərqi Peyğəmbərin (s) öz xanımı nəql edir. Aişə ona dedi: “Hər kim haqq-hesab çəkərsə, məhv olar”. Qadın dedi: “Bəs Allah: “O, asan bir haqq-hesabla mühakimə olunacaq” deməzmi? O dedi: “Bu, ancaq əməllərin təqdimatıdır. lakin kim haqq-hesab üçün sorğu-sual edilərsə, məhv olar” (Səhih əl-Buxari 6537). Beləliklə, möminin ümidi hər cür təftişdən qaçmaq deyil, onun əməllərini göstərmək, günahlarını örtmək və bağışlanmaqdır - maddə-maddə çarpaz yoxlanmaqdansa.",
      "Elə bir borc kateqoriyası var ki, onu hətta Allahın bağışlaması belə sadəcə silmir: başqa insanların haqqı (hüquq əl-ibad). Peyğəmbər (salləllahu aleyhi və səlləm) soruşdu: “Sən kimin müflis olduğunu bilirsənmi?” Dedilər: Pulu olmayan biri. Buyurdu: “Ümmətimin müflisi o kəsdir ki, Qiyamət günü namaz, oruc və sədəqə ilə gəlsə, amma onu təhqir edib, ona böhtan atıb, başqasının malını alıb, başqasının qanını töküb yaxşı əməlləri onların əlinə keçər, yaxşılıqları bitdikdə isə günahları ona yüklənər və cəhənnəm oduna yüklənər”. 2581). İbadət haqsızlığı aradan qaldırmaz; yalnız ədalətsizliyi həll edir.",
      "Praktiki nəticə təcili və konkretdir: ödənilməmiş borclar, oğurlanmış sərvətlər, böhtanlar və sındırılmış əmanətlər bu həyatda - Allaha tövbə etmək, əvəzini ödəmək və insanlardan üzr istəmək yolu ilə düzəldilməlidir, çünki indi pul və təvazökarlıq valyutası ilə hesablaşmaq o vaxtkı yaxşı əməllərin valyutası ilə müqayisədə daha ucuzdur. Və bütün bunlarla Allahın ədaləti mükəmməldir və Onun rəhməti ixlasla cihad edən və tövbə edən hər kəsi əhatə edir.",
    ],
    quran: [
      {
        excerpt:
          "Kimin dəftəri sağ əlinə verilsə, o, asan hesabla mühakimə olunacaq və qövmünün yanına xoşbəxtliklə qayıdacaq. Kimə dəftəri arxadan verilmişdirsə, o, məhv olmaq üçün fəryad edib Cəhənnəmə girəcəkdir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim hesaba çəkilsə, məhv olar. Aişə dedi: “Məgər Allah, asan hesabla mühakimə olunacağını demirmi? O dedi: “Bu, ancaq əməllərin təqdimatıdır. lakin kim onun hesabına sorğu-sual edilərsə, məhv olar.",
      },
      {
        excerpt:
          "Kimin müflis olduğunu bilirsinizmi? O kəsdir ki, Qiyamət günü namaz, oruc və zəkatla gələr, lakin başqalarını təhqir etmiş, böhtan atmış və haqsızlıq etmişsə, ona görə də yaxşı əməlləri onlara verilmiş, günahları bitdikdə isə onun üzərinə qoyulmuş və Cəhənnəmə atılmışdır.",
      },
    ],
    actions: [
      "Borcları həll edin və haqsız olaraq alınan hər şeyi, kiçik də olsa, təyin olunmuş gün gəlməmişdən əvvəl qaytarın.",
      "Sözdə, sərvətdə və ya ləyaqətdə haqsızlıq etdiyiniz hər kəsi axtarın və üzr istəyin - indi bərpa o vaxtkı bərpadan qat-qat ucuzdur.",
      "Allaha olan haqqlar üçün tövbə edin və iki kitabı - ilahi və insani - hər ikisini açıq saxlayın.",
    ],
    appLinks: [{}],
  },
  {
    title: "Gölet (Hawd)",
    summary: "Peyğəmbərin (s) hövzəsi – içən və üz döndərən.",
    body: [
      "Havd, qiyamət günü Məhəmməd Peyğəmbərə (sallallahu aleyhi və səlləm) bəxş edilmiş böyük hövzədir, o qızmar və yorucu gündə onun susuz ümməti üçün bir rəhmətdir. Onun təsvirləri çoxlu və həqiqidir: 'Mənim Hawd bir aylıq yoldur; suyu süddən ağ, ətri müşkdən daha şirin, stəkanları səma ulduzları kimidir. Kim ondan içsə, bir daha susuz qalmaz” (Səhih əl-Buxari 6579). Havda inancı, kütləvi şəkildə ötürülən xəbərlərlə qurulan sünni əqidəsinin bir hissəsidir.",
      "Peyğəmbər (Ona Allahın salavatı və salamı olsun) özü tərəfdarlarını orada qəbul edəcək: “Mən sizdən əvvəl Havda çatacağam və sizdən yanıma gələnləri gözətləyəcəm” (Səhih Müslim 2292). Dəstəmaz izlərindən ümmətini üzlərindəki nurdan, əl və ayaqlarından tanıyır. Ona çatmaq əbədi sönməkdir; Allahın Öz Peyğəmbərinə səllallahu aleyhi və səlləm cənnətdə bəxş etdiyi Kövsər çayı ilə sağlam anlayışla qidalanır.",
      "Lakin bəziləri Havddan qovulacaqlar. Həzrət Peyğəmbər (s) bəzi insanlara belə deyilməsini təsvir etmişdir: “Onlar sizdən deyillər. onlar səndən sonra dini dəyişdilər və ya ondan sonra geri döndülər. Alimlər buna diqqət yetirirlər: hədisdəki müəyyən kateqoriyalara - məsələn, azğınlıq və qəbir, aydın hidayətdən sonra dində qəsdən yenilik kimi - aiddir və adi müsəlmanların bir-birini ittiham etməsi qəti şəkildə icazə verilmir. Havda aparan təhlükəsiz yol sünnəyə bağlı qalmaq, dəstəmaz və namazı qorumaq, möminlərin birliyini qorumaqdır.",
    ],
    hadith: [
      {
        excerpt:
          "Mənim Hawd bir aylıq yoldur. Onun suyu süddən ağ, ətri müşkdən şirin, stəkanları isə göy ulduzları qədərdir. Kim ondan içsə, bir daha susuz qalmaz.",
      },
      {
        excerpt:
          "Mən sizdən əvvəl Havda çatacağam və sizdən mənə gələnləri gözətləyəcəm. Bəzi insanlar məndən uzaqlaşdırılacaq və mən deyəcəyəm: “Ey Rəbbim, mənim yoldaşlarım! Deyəcəklər: “Sən bilmirsən ki, onlar səndən sonra nə bidət qoydular.",
      },
    ],
    disclaimer:
      "Həvddən üz döndərənlər haqqındakı xəbərlər hədisdə adı çəkilən xüsusi kateqoriyalara, əsasən də azğınlığa və dindəki böyük bidətə aiddir. Müsəlmanların bir-birlərini azğınlıq etmələri üçün onlar bir icazə deyil.",
  },
  {
    title: "Körpü (Sirat)",
    summary: "Cəhənnəmi keçmək – əməl və rəhmətə görə sürət.",
    body: [
      "Sirat cəhənnəmin zirvəsi üzərində uzanan bir körpüdür və hər kəs, mömin və kafir onun üstündən keçməlidir. Qurani-kərim keçidi istisnasız olaraq təsdiq edir: “Sizdən heç biriniz oraya gəlməsin. Bu, sənin Rəbbinə vacib hökmdür. Sonra Allahdan qorxanlara nicat verəcəyik və zalımları orada diz çökmüş halda qoyacağıq” (Qur'an, 19:71-72). Keçid universaldır; uzaq tərəfə salamat çatmaq hər şeydir və bunu Allah qoruduğuna bəxş edir.",
      "Keçməyin qaydası insanın gətirdiyi əməllərlə müəyyən edilir. Peyğəmbər (salləllahu aleyhi və səlləm) bunu belə təsvir etmişdir: “Körpü cəhənnəmin üzərində qurulacaq... və sizdən birinciniz şimşək kimi, sonra külək kimi, sonra quşlar kimi, sonra da öz əməllərinə görə qaçan adam kimi keçəcək, halbuki Peyğəmbəriniz körpünün üstündə dayanıb: “Ya Rəbb, onları qoru, onları qoru. Bəziləri sağ-salamat xilas olur, bəziləri cızılıb buraxılır, bəziləri isə oda atılır” (Səhih əl-Buxari 6573). Körpünün yanında, eyni hesabatda, etibarlılıq (amanah) və qohumluq əlaqələri dayanır - əmanətlərdə və ailə bağlarında sədaqət əslində insanı müşayiət edən təəccüblü bir görüntü.",
      "Sirat üzərində işıq və sürət bu həyatda qazanılır. Vaxtında qılınan namaz, mütəmadi olaraq verilən sədəqə, rəftarda dürüstlük və gözəl əxlaq, əslində, insanın keçdiyi dayaq və nura çevrilir. Peyğəmbər orada möminlər üçün şəfaət edər və Allahın rəhməti ilə hər kəs o tərəfə çatar.",
      "Digər görünməmiş stansiyalarda olduğu kimi, müdrik kurs körpünün fiziki ölçüləri - nə qədər nazik, nə qədər iti, nə qədər uzun olması barədə fərziyyələr söyləmək deyil, tamamilə keçidi işıqlandıran əməllərə diqqət yetirməkdir. Təsvir edə bilməyəcəyiniz şeyə hələ də hazırlaşa bilərsiniz.",
    ],
    quran: [
      {
        excerpt:
          "Sizlərdən heç kəs yoxdur ki, ona yetişsin. Bu, sənin Rəbbinə vacib hökmdür. Sonra Allahdan qorxanlara nicat verəcəyik, zalımları isə orada diz çökmüş halda qoyacağıq.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Körpü cəhənnəmin üzərində qurulacaq və birinci mən keçəcəyəm. İnsanlar öz əməllərinə görə onun üstündən keçəcəklər - şimşək kimi, külək kimi, quşlar kimi, qaçan adam kimi - Mən deyirəm: Ya Rəbb, onları qoru, onları qoru. Bəziləri xilas olur, bəziləri cızılıb sərbəst buraxılır, bəziləri isə Cəhənnəmə düşür.",
      },
    ],
    actions: [
      "Beş vaxt namazı vaxtında qılın - namaz körpünün üstündən keçən nurdur.",
      "Kiçik miqdarda da olsa, müntəzəm olaraq sədəqə verin.",
      "Qohumluq əlaqələrini qoruyun və əmanətlərinizi qoruyun – hədisdə onlar Siratın yanındadırlar.",
    ],
  },
  {
    title: "Cənnət",
    summary: "Əbədi mükafat onun səadəti və hər şeydən əvvəl Allahı görməkdir.",
    body: [
      "Cənnət Allahın möminlər üçün hazırladığı əbədi yurddur, təsəvvürünə çatmayan bir həqiqətdir. Bir müqəddəs hədisdə Peyğəmbər (sallallahu aleyhi və səlləm) bu haqda belə buyurur: “Mən saleh bəndələrim üçün heç bir gözün görmədiyini, heç bir qulağın eşitmədiyini və heç bir insan qəlbinin ağlına belə gətirmədiyini hazırladım” (Səhih əl-Buxari 3244). Onun çayları, bağları, malikanələri və yoldaşlıqları Quranda qəlbləri cəlb etmək üçün təsvir edilmişdir, lakin təsvirlər onları tamamilə aşan bir sevincə işarədir.",
      "Onun mükafatlarının ən böyüyü heç bir bağ və ya çay deyil, Allahın rizası və Üzünün görünməsidir. “O gün üzlər nurlu olacaq, Rəbbinə baxacaqdır” (Qur'an 75:22-23) – Əhli-sünnə möminlərin axirətdə Allaha, Onun əzəmətinə yaraşan şəkildə və yaradılışa bənzərsiz olaraq bəxş edilmiş Cənnət səadətinə baxmaq kimi başa düşülür. Allah vəd edir: “Yaxşılıq edənlər üçün ən gözəl mükafat və daha çox mükafat vardır” (Qur'an, 10:26) – və “daha ​​çox” isə səhih hədislərdə Onun uca sifətinin bu baxışı kimi izah edilir.",
      "Cənnətə daxil olmaq Allahın mərhəməti ilə, iman və saleh əməllə qəbul edilir - ikisi heç vaxt bir-birinə zidd olmaz: rəhmət səbəb, əməl əlamət və Allahın ona bağladığı vasitədir. Cənnət əhli üçün qiyamət heç vaxt sönməyən və bitməyən bir səadətlə başa çatır. Bu modul məqsədyönlü olaraq Cənnətə münasibətini qısaca saxlayır; Tam Cənnətə Səyahət bələdçisi onun qapılarını, dərəcələrini, ona aparan əməlləri və onun üçün edilən duaları dərindən əhatə edir.",
    ],
    quran: [
      {
        excerpt:
          "Rəbbiniz tərəfindən bağışlanmağa və genişliyi göylərlə yer qədər olan, müttəqilər üçün hazırlanmış Cənnətə tələsin.",
      },
      {
        excerpt: "O gün üzlər nurlu olacaq və Rəbbinə baxacaqdır.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah buyurur: Mən saleh bəndələrim üçün heç bir gözün görmədiyini, heç bir qulağın eşitmədiyini və heç bir insan qəlbinin təsəvvür etmədiyini hazırlamışam.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "cəhənnəm",
    summary: "Əsl xəbərdarlıq - həqiqi cəza və diri ikən qaçış qapısı.",
    body: [
      "Cahannam pis ruh halının simvolu və ya metaforası deyil, əsl cəza yurdudur. Ona inanmaq qeybə və Allahın ədalətinə iman gətirməyin bir hissəsidir. Qur'an ayıq bir şəkildə xəbərdarlıq edir: “Rəbbini inkar edənləri Cəhənnəm əzabı və necə də pis aqibət gözləyir” (Qur'an, 67:6). Onun şiddəti marağı təmin etmək üçün deyil, oyanmaq üçün təsvir edilmişdir: “Yanacağı insanlar və daşlar olan bir od” (Qur'an, 2:24), Allahın əmrlərinə asi olmayan sərt mələklər tərəfindən qorunur.",
      "Bu xəbərdarlıqların məqsədi maskalanmış mərhəmətdir. Onlar təkəbbürü qırmaq, həqiqəti inadla rədd etməyi dayandırmaq və çox gec olmadan insanı geri qaytarmaq üçün mövcuddurlar. Məhz buna görə də Qurandakı xəbərdarlıqlar, demək olar ki, həmişə açıq tövbə qapısı ilə birləşdirilir - Od haqqında təsvir edilmənin məqsədi məhz buna görədir ki, insanlar hələ də bacardıqları halda ondan qaçsınlar. Onun əzabı ədalətlidir. Heç kəs ora öz ixtiyarından başqa, açıq-aydın hidayət yolu ilə daxil ola bilməz və Allah heç kəsə zülm etməz.",
      "Günah daşıyan möminlər üçün sağlam sünni inancı qorxu və ümid arasında bir tarazlıqdır: günahkar Allahın iradəsi altındadır - O, bağışlayar və ya Cəhənnəmdə pak olar, sonra isə yuxarıda təsvir edilən şəfaət və mərhəmətlə zərrə qədər imanı olan hər kəsi oradan çıxarar. Bu modul Cəhənnəmə qəsdən qısa və ölçülmüş müalicə verir. Onun xəbərdarlıqlarının, böyük günahların, tövbə və mərhəmətin geniş qapılarının daha dolğun tədqiqi Cəhənnəmi Anlamaq modulunda və əlaqəli əqidə mövzularında tapılır - həmişə ümidlə, heç vaxt ümidsizliyə qapılmamaqla yanaşır.",
    ],
    quran: [
      {
        excerpt: "Rəbbini inkar edənləri isə cəhənnəm əzabı və necə də pis aqibət gözləyir.",
      },
      {
        excerpt:
          "De: “Ey Mənim özlərinə zülm edən qullarım, Allahın rəhmətindən ümidinizi kəsməyin. Həqiqətən, Allah bütün günahları bağışlayar. Həqiqətən, O, Bağışlayandır, Rəhmlidir.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kim girir hesabsız?",
    summary: "Müfəssəl hisabdan yan keçənlər haqqında səhih hədis — elmi müzakirə.",
    body: [
      "Qiyamət gününün mərhəmətlərindən biri də budur ki, bu ümmətdən bir dəstə heç bir hesab-hesabsız Cənnətə daxil olur. Həzrət Peyğəmbər (s) buyurdu: “Ümmətimdən yetmiş min nəfər hesabsız cənnətə girəcək” və başqa bir ifadə ilə “hər min yetmiş min nəfər daha çox olacaq”. Səhabələr onların kim olduqları ilə maraqlandıqda, o, onları belə vəsf etdi: “Onlar başqalarından ruqyə istəməzlər, bədxahlara inanmazlar, qızartmazlar və öz Rəbbinə təvəkkül edənlərdir” (Səhih əl-Buxari 6541).",
      "Bu təsvirin ürəyi təvəkküldür - Allaha dərin, fəal təvəkkül - xurafatdan və səbəblərdən narahat asılılıqdan azad olmaqdır. O, icazə verilən tibbi müalicəyə müraciət etməyi pisləmir; öz üzərində oxunan ruqyə və halal dərman həm sünnədə sabitdir. Həmd olunan o kəsdir ki, təvəkkülü o qədər Allahadır ki, ətrafda gəzib başqalarından ruhani cazibə dilənməsin və ya nişanələrdən yapışmasın.",
      "Alimlər rəqəmin özünü müzakirə edirlər: bəziləri yetmiş minin hərfi olduğunu, bəziləri bunun əlavə hesabatlarla çox artırıldığını, digərləri isə sabit sayından çox Allahın lütfünün ölçülməz bolluğundan xəbər verir. Onların razılaşdıqları əsas həqiqətdir - Allahın rəhməti insan mühasibatlığının gözlədiyindən qat-qat artıqdır və son qurtuluş da bu mərhəmətdir.",
      "Bu, tənbəllik üçün boşluq deyil, ümid stansiyasıdır. Mömini ibadətdə səy göstərərkən, həqiqi təvəkkülə və xurafatdan uzaq olmağa təlqin edir. Heç kim onu ​​əməllərə etinasızlıq etməklə qazanmaz; İnsanı ona cazibə və qorxudan daha çox səmimiyyət, təvəkkül və Allaha bağlı bir ürək çəkir.",
    ],
    hadith: [
      {
        excerpt:
          "Ümmətimdən yetmiş min nəfər Cənnətə haqq-hesabsız daxil olacaqlar: onlar başqalarından ruqyə istəməyənlər, bədxahlara inanmayanlar, qızartmayanlar və Rəbbinə təvəkkül edənlərdir.",
      },
    ],
    disclaimer:
      "Alimlər “hesabsız”ın sabit yetmiş min, yoxsa daha çox, ölçülə bilməyən bir rəqəm olması barədə ixtilaf edirlər. Hamı yekdildir ki, son qurtuluş Allahın rəhməti ilədir və bu, əməllərə etinasızlıq üçün deyil, ümid üçün səbəbdir.",
  },
  {
    title: "Son Günə Hazırlaşır",
    summary: "Əməli ibadət - hər bir vərdişi Allahla görüşünüzə bağlayın.",
    body: [
      "Bütün səyahəti getdikdən sonra - ölüm, qəbir, nişanələr, zurna, məclis, kitablar, tərəzi, hesab, körpü və iki ev - yeganə sağlam cavab hazırlamaqdır. Ancaq hazırlıq panika deyil. Peyğəmbər (sallallahu aleyhi və səlləm) heç vaxt səhabələrini qorxu və iflic vəziyyətində qoymadı; onları işdə qoyub. Bunların hamısının əsası tövhid və ixlasdır: əməl yalnız Allah üçün və sünnəyə uyğun olaraq edildiyi zaman qəbul olunur, ona görə də əlavə əməllər əlavə etməzdən əvvəl, artıq olanların arxasındakı niyyəti təmizləyin.",
      "Tərəzi üzərində ağırlaşan mətnləri sütunlar üzərində qurun. Vaxtında qılınan namaz siratın lövbəri və nurudur. Hər gün oxunan, eşidilən və üzərində düşünülmüş, hətta bir neçə ayə olan Qur'an qəlbi canlı saxlayır. Tövbə bunu açıqlayır: “Ey iman gətirənlər, Allaha səmimi tövbə edin” (Qur'an, 66:8). Sədəqə mal-dövləti pak edər və sədəqə cəriyə kimi ömür sürər. Zikr, dilin tərəzidə ağır, sözlərin dildə yüngül olmasını təmin edər. Yaxşı əxlaq isə tərəziyə qoyulan ən ağır şeydir.",
      "Peyğəmbərin birbaşa Cənnətə bağladığı iki şeyi - dil və iffəti (Səhih əl-Buxari 6474) qoruyun, çünki bunlar dramatik günahlardan daha çox, bir qeydi sakitcə dolduran və ya iflas edən şeylərdir. İnsanların haqqını hələ də bacardığınız halda həll edin: borcunuzu ödəyin, alınanı qaytarın, zərərə görə üzr istəyin və hər işdə ədalətli olun ki, zülm etdiyi kəslərin iddiaları ilə duaları yeyilən “iflas” kimi heç vaxt yetişməyəsiniz.",
      "“Səhih əl-Buxarinin” birinci hədisində hər şey bir niyyətə əsaslanır: “Əməllər ancaq niyyətlərə görədir”. Münibin izləyicilərindən yarışmaq üçün deyil, bu vərdişlər üçün - namaz, Qur'an, zikr, sədəqə, tövbə - hər biri sakitcə gününüzü Allahla görüşə yönəltmək üçün yumşaq bir dəstək kimi istifadə edin. Bütün məqsəd budur: indi həqiqətən Onun qarşısında dayanmağı gözləyən biri kimi yaşamaq.",
    ],
    quran: [
      {
        excerpt: "Mən cinləri və insanları ancaq Mənə ibadət etmək üçün yaratdım.",
      },
      {
        excerpt:
          "Ey iman gətirənlər, Allaha səmimi qəlbdən tövbə edin. Ola bilsin ki, Rəbbiniz günahlarınızı sizdən sovuşdursun və sizi (ağacları) altından çaylar axan Cənnət bağlarına daxil etsin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Əməllər ancaq niyyətlərə görədir və hər bir insan ancaq niyyət etdiyinə sahib olar.",
      },
      {
        excerpt:
          "Kim mənə çənəsi və ayaqlarının arasına zəmanət verərsə, dilinə və iffətinə zəmanət verərsə, ona Cənnəti zəmanət verirəm.",
      },
    ],
    actions: [
      "Beş vaxt namazı vaxtında qılın.",
      "Hər gün Qur'anı oxuyun və ya dinləyin - hətta bir neçə ayə.",
      "Səhər və axşam zikrini saxlayın.",
      "Kiçik miqdarda da olsa, müntəzəm olaraq sədəqə verin.",
      "Hər gün tövbə edin və səmimiyyətlə bağışlanma diləyin.",
      "Dili və iffəti qoruyun, hər bir sözə və əmanətə əməl edin.",
      "Ailəyə, qonşulara və kreditorlara borclu olan hüquqları yerinə yetirin.",
      "Namaz jurnalınızda huşunu və niyyətin səmimiyyətini əks etdirin.",
    ],
    appLinks: [{}, { label: "Tərəzidə ağır olanlar" }, {}, {}, {}, {}, {}],
  },
  {
    title: "Tərəzidə ağır olanlar",
    summary: "Səhih mətnlərin ağır, dolduran və ən sevimli adlandırdığı əməllər.",
    body: [
      "Qur'an və Sünnə bütün əməllər üçün rəqəmli siyahı vermir; mətnin öz sözlərinə bağlı qalırıq.",
      "Tərəzidə ağırlığın əsası ixlasdır; kiçik, səmimi əməl böyük görünən riyakarlıqdan ağır ola bilər.",
      "Bu zikrləri və gözəl əxlaqı davamlı, qəlb oyaq şəkildə yaşayın.",
    ],
    mizanDeeds: [
      {
        title: "Gözəl əxlaq",
        summary: "Möminin tərəzisində gözəl əxlaqdan ağır heç nə yoxdur.",
        hadith: {
          excerpt: "Qiyamət günü möminin tərəzisində gözəl əxlaqdan ağır heç nə yoxdur.",
        },
      },
      {
        title: "İki yüngül kəlmə",
        summary: "Dildə yüngül, tərəzidə ağır və Rəhmana sevimlidir.",
        hadith: {
          excerpt: "Sübhanəllahi və bihəmdihi, Sübhanəllahil-azim.",
        },
      },
      {
        title: "Əlhəmdülillah tərəzini doldurur",
        summary: "Həmd Allaha məxsusdur və tərəzini doldurur.",
        hadith: {
          excerpt: "Əlhəmdülillah tərəzini doldurur.",
        },
      },
      {
        title: "Şəhadət kartı",
        summary: "Səmimi tövhid günah dəftərlərindən ağır gəlir.",
        hadith: {
          excerpt: "Şəhadət kartı tərəzidə günah dəftərlərindən ağır gəldi.",
        },
      },
      {
        title: "Ən yaxşı zikr",
        summary: "Ən üstün zikr: Lə iləhə illəllah.",
        hadith: {
          excerpt: "Ən yaxşı zikr Lə iləhə illəllahdır.",
        },
      },
      {
        title: "Ən sevimli dörd kəlmə",
        summary: "Allaha ən sevimli sözlər dörd zikrdir.",
        hadith: {
          excerpt: "Sübhanallah, Əlhəmdülillah, Lə iləhə illəllah, Allahu əkbər.",
        },
      },
      {
        title: "Sübhanəllahi və bihəmdihi ×100",
        summary: "Gündə yüz dəfə deyənə günahlarının bağışlanması vəd edilmişdir.",
        hadith: {
          excerpt: "Kim bunu gündə yüz dəfə desə, günahları bağışlanar.",
        },
      },
    ],
    quran: [
      {
        excerpt: "Tərəziyə ağır gələn səmimi əməl.",
      },
      {
        excerpt: "Gözəl əxlaq möminin tərəzisində çox ağırdır.",
      },
    ],
    hadith: [
      {
        excerpt: "Qiyamət günü möminin tərəzisində gözəl əxlaqdan ağır heç nə yoxdur.",
      },
      {
        excerpt: "Sübhanəllahi və bihəmdihi, Sübhanəllahil-azim.",
      },
      {
        excerpt: "Əlhəmdülillah tərəzini doldurur.",
      },
      {
        excerpt: "Şəhadət kartı tərəzidə günah dəftərlərindən ağır gəldi.",
      },
    ],
    misconceptions: [
      "Qur'an və Sünnə bütün əməllər üçün rəqəmli siyahı vermir; mətnin öz sözlərinə bağlı qalırıq.",
      "Tərəzidə ağırlığın əsası ixlasdır; kiçik, səmimi əməl böyük görünən riyakarlıqdan ağır ola bilər.",
    ],
    actions: [
      "Bu zikrləri və gözəl əxlaqı davamlı, qəlb oyaq şəkildə yaşayın.",
      "Dildə yüngül, tərəzidə ağır və Rəhmana sevimlidir.",
      "Həmd Allaha məxsusdur və tərəzini doldurur.",
      "Möminin tərəzisində gözəl əxlaqdan ağır heç nə yoxdur.",
    ],
    appLinks: [
      {
        label: "Tərəzidə ağır olanlar",
      },
      {
        label: "İki yüngül kəlmə",
      },
      {
        label: "Əlhəmdülillah tərəzini doldurur",
      },
      {
        label: "Doğruluq",
      },
      {
        label: "Ağır tərəziyə hazırlıq",
      },
    ],
  },
];

export const LAST_DAY_HADITH_AZ: DeepPartial<LastDayHadithEntry>[] = [
  {
    hadith: {
      excerpt: "Zövqləri məhv edəni tez-tez xatırlayın - ölüm deməkdir.",
    },
    context:
      "Ölümü mütəmadi olaraq xatırlamaq ürəyi yumşaldır, kinləri yox edir və ümidsizlik yaratmadan prioritetləri düzəldir.",
  },
  {
    hadith: {
      excerpt:
        "Sizlərdən heç biriniz Allaha yaxşılıq etmək və Rəbbinin mərhəmətini gözəl düşünməkdən başqa ölməsin.",
    },
    context:
      "Səmimi iman, tövbə və Allahdan yaxşı gözləmə ilə yaxşı sonluq (hüsnül-xatimə) ümid edilir.",
  },
  {
    hadith: {
      excerpt: "Qəbir ya cənnət bağlarından bir bağdır, ya da cəhənnəm çuxurlarından bir çuxurdur.",
    },
    context:
      "Bərzəx, Allahın hikməti ilə qəbirdə mükafat və ya cəzanı ehtiva edir - qəbir insanın öz əməllərini əks etdirir.",
  },
  {
    hadith: {
      excerpt:
        "Mərhum dəfn edildikdə, iki mələk gəlib ondan Rəbbi, dini və peyğəmbəri haqqında soruşur.",
    },
    context:
      "Qəbirdə sorğu-sual edilməsi səhih xəbərlərdə təsdiq edilmişdir; bu rəvayətdə iki mələyin adı Münkər və Nəkirdir.",
  },
  {
    hadith: {
      excerpt:
        "İnsan vəfat etdikdə onun üç əməli istisna olmaqla, əməli sona çatar: daimi sədəqə, fayda əldə edilən elm və ya onun üçün dua edən saleh övlad.",
    },
    context: "Ölüyə fayda verməyə davam edən şey - səhih hədisdə sabitdir.",
  },
  {
    hadith: {
      excerpt:
        "Siz ayaqyalın, çılpaq və sünnətsiz olaraq toplanacaqsınız və Qiyamət günü ilk geyindirilən İbrahim olacaq.",
    },
    context: "Qiyamət günü təvazökarlıq; Allah istədiyini istədiyi kimi ehtiram edər.",
  },
  {
    hadith: {
      excerpt:
        "Günəş Qiyamət günü insanlara təxminən bir mil uzaqlaşana qədər yaxınlaşdırılacaq və onlar öz əməllərinə görə tərlərinə qərq olacaqlar.",
    },
    context: "Məhşərin şərtləri — səhih rəvayətlərdə əmələ görə şiddət dəyişir.",
  },
  {
    hadith: {
      excerpt:
        "Camaat yanıma gələcək, mən də Allaha səcdəyə qapanacaq və deyiləcək: “Başını qaldır! istəsən, sənə veriləcək, şəfaət et və şəfaətin qəbul olunacaq.",
    },
    context: "Ən böyük şəfaət Peyğəmbərə (sallallahu aleyhi və səlləm) xas olan Şəfa əl-Üzmədir.",
  },
  {
    hadith: {
      excerpt:
        "Kim hesaba çəkilsə, məhv olar. Aişə soruşdu: Məgər Allah, asan hesabla mühakimə olunacağını demirmi? O dedi: “Bu, ancaq əməllərin təqdimatıdır. lakin kim onun hesabına sorğu-sual edilərsə, məhv olar.",
    },
    context:
      "'Asan hesab' bir mərhəmətdir - insanın öz əməllərinin göstərilməsi və bağışlanması, maddə-maddə çarpaz yoxlanılması deyil.",
  },
  {
    hadith: {
      excerpt:
        "Mənim ümmətimin müflisi o kəsdir ki, namaz, oruc və sədəqə ilə gəlir, lakin başqalarını təhqir etmiş, böhtan atmış və haqsızlıq etmiş, ona görə də yaxşı əməlləri onlara verilir və günahları onun üzərinə yüklənir.",
    },
    context:
      "İnsanların haqqı (hüquq əl-ibad) sadəcə olaraq ibadətlə ləğv olunmur; günündə ödənilməli və ya ödənilməlidir.",
  },
  {
    hadith: {
      excerpt:
        "Mənim ümmətimdən yetmiş min nəfər hesabsız cənnətə daxil olacaqlar: o kəslər ki, başqalarından ruqyə istəməzlər, bədxahlara inanmazlar, qəzəblənməzlər və Rəbbinə təvəkkül edərlər.",
    },
    context:
      "Alimlər bu rəqəmin hərfi olması və ya Allahın rəhmətinin daha böyük, saysız-hesabsız bolluğunu ifadə etməsi mövzusunda ixtilaf edirlər.",
  },
  {
    hadith: {
      excerpt:
        "Mənim Hawd bir aylıq yoldur. Onun suyu süddən ağ, ətri müşkdən şirin, stəkanları isə göy ulduzları qədərdir. Kim ondan içsə, bir daha susuz qalmaz.",
    },
    context: "Hovuz - susuzluq günü Muhəmmədin (s) ümməti üçün bir rəhmətdir.",
  },
  {
    hadith: {
      excerpt:
        "Körpü Cəhənnəm üzərində qurulub. İnsanlar onu əməllərinə görə keçir - şimşək kimi, külək kimi, quşlar kimi, qaçan adam kimi - bəziləri cızılıb xilas olur, bəziləri isə yıxılır.",
    },
    context: "Keçid sürəti iman və əməlləri əks etdirir; Allahın rəhməti genişdir.",
  },
  {
    hadith: {
      excerpt:
        "On əlamət görməyincə qiyamət qopmayacaq: tüstü, Dəccal, heyvan, günəşin qərbdən çıxması, Məryəm oğlu İsanın, Yəcuc və Məcucun yerə enməsi, üç sürüşmə və insanları öz məclislərinə aparan od.",
    },
    context:
      "On böyük əlamət, Huzeyfə ibn Üseyddən. Alimlər hər bir işarəni təsdiq edirlər, lakin dəqiq ardıcıllıqla fərqlənirlər.",
  },
  {
    hadith: {
      excerpt:
        "Canım əlində olana and olsun ki, Məryəm oğlu tezliklə aranıza ədalətli bir hökmdar olaraq nazil olacaqdır. xaçı sındıracaq, donuzları öldürəcək, cizyəni ləğv edəcək və heç kim onu ​​qəbul etməyənə qədər sərvət daşacaq.",
    },
    context: "İsanın enməsi sünni əqidəsinin möhkəm nöqtəsidir; Məhəmmədin şəriəti ilə hökm edir.",
  },
  {
    hadith: {
      excerpt:
        "Etibar itirildikdə, Saatı gözləyin. Soruşdular: Necə itəcək? Buyurdu: Hakimiyyət layiq olmayanlara verildikdə.",
    },
    context:
      "Tanınmış kiçik bir əlamət - etibarlılığın itirilməsi. Panikaya deyil, hazırlığa diqqət yetirin.",
  },
  {
    hadith: {
      excerpt:
        "Allah biliyi əlindən almaqla yox, alimləri götürməklə aradan qaldırır ki, heç kim qalmasın və insanlar nadanları rəhbər tutsunlar ki, onlar nadan olub, başqalarını da azdırsınlar.",
    },
    context:
      "“Bilik itkisi” sağlam alimlərin və yaşamış təcrübənin itirilməsi deməkdir – məlumat çatışmazlığı deyil.",
  },
  {
    hadith: {
      excerpt: "Tərəziyə ağır gələn səmimi əməl.",
    },
    context: "Ağır tərəziyə hazırlıq",
  },
  {
    hadith: {
      excerpt: "Gözəl əxlaq möminin tərəzisində çox ağırdır.",
    },
    context: "Tərəzidə ağır olanlar",
  },
  {
    hadith: {
      excerpt: "Zikr dildə yüngül, tərəzidə ağırdır.",
    },
    context: "Tərəzidə ağır olanlar",
  },
];

export const LAST_DAY_VERSES_AZ: DeepPartial<LastDayVerseEntry>[] = [
  {
    excerpt:
      "Hər bir nəfs ölümü dadacaqdır və Qiyamət günü sizə ancaq əvəziniz tam olaraq veriləcəkdir. Beləliklə, kim Cəhənnəmdən uzaqlaşdırılıb Cənnətə daxil edilərsə, nicat tapmışdır.",
    context:
      "Ölüm universaldır və bu həyat müvəqqətidir; həqiqi və son hesablaşma yalnız Qiyamət günü olur.",
    tafsirSummary:
      "Ayə müvəffəqiyyəti yenidən təyin edir: burada var-dövlət və məqam yox, cəhənnəm odundan xilas olub orada Cənnətə daxil olmaq.",
  },
  {
    excerpt:
      "O gün insanlar öz əməllərini göstərmək üçün ayrı-ayrı dəstələr şəklində yola düşəcəklər. Kim zərrə qədər yaxşılıq etsə, onu görəcək, kim zərrə qədər pislik etsə, onu görəcək.",
    context:
      "Mükəmməl və tam ədalət - yaxşı və ya pis ən xırda əməl qeydə alınır və onu edənə qaytarılır.",
    tafsirSummary:
      "Heç bir şey saymaq üçün çox kiçik deyil. Bu ayə “kiçik” günahları rədd etməkdən ömürlük xəbərdarlıq və “kiçik” yaxşı işlərə ömürlük təşviqdir.",
  },
  {
    excerpt:
      "Biz qiyamət günü üçün ədalət tərəzisini qoyuruq ki, heç kəsə haqsızlıq edilməsin. Bir xardal dənəsi ağırlığında olsa belə, Biz onu çıxardacağıq.",
    context: "Mizan (Tərəzi) həqiqi və ədaləti mütləqdir.",
    tafsirSummary:
      "O gün heç kəs bir xardal dənəsi ağırlığında belə dəyişməz. Allahın hesabı qüsursuzdur.",
  },
  {
    excerpt:
      "Kimin tərəzisi ağır olarsa, o, xoş həyatda olar. Kimin tərəzisi yüngül olarsa, onun sığınacağı yer uçurum olar.",
    context: "Son nəticə, tərəzidə insanın saleh əməllərinin ağırlığına çevrilir.",
    tafsirSummary:
      "Çəki səmimilikdən irəli gəlir, böyük həcmdən deyil - sadə bir zikrin deyildiyi kimi, sırf şöhrətli fəaliyyətin dağlarını üstələyə bilər.",
  },
  {
    excerpt:
      "Rəbbiniz tərəfindən bağışlanmağa və genişliyi göylərlə yer qədər olan, müttəqilər üçün hazırlanmış Cənnətə tələsin.",
    context: "Allahla görüşməzdən əvvəl yaxşılığa və bağışlanmağa doğru yarışmağın birbaşa əmri.",
    tafsirSummary:
      "Cənnət təsəvvür edilə bilməyəcək qədər genişdir və ona gedən yol tələsməkdən keçir – tövbə və yaxşı əməlləri təxirə salmamaqdır.",
  },
  {
    excerpt: "O gün üzlər nurlu olacaq və Rəbbinə baxacaqdır.",
    context: "Cənnətin ən böyük mükafatı heç bir bağ və ya çay deyil, Allahın Üzünü görməkdir.",
    tafsirSummary:
      "Əhli-sünnə təsdiq edir ki, möminlər axirətdə öz Rəbbini Onun əzəmətinə yaraşan bir şəkildə və yaradılışa bənzərsiz şəkildə – bütün nemətlərin tacı olaraq görəcəklər.",
  },
  {
    excerpt: "Rəbbini inkar edənləri isə cəhənnəm əzabı və necə də pis aqibət gözləyir.",
    context: "Cəhənnəm həqiqi və ədalətli nəticədir - simvol deyil, həqiqi yaşayış yeridir.",
    tafsirSummary:
      "Xəbərdarlıq insanı hələ vaxt varken geri çevirmək üçün nəzərdə tutulmuş mərhəmətdir; Quranda həmişə açıq tövbə qapısı ilə qoşalaşmışdır.",
  },
  {
    excerpt:
      "De: “Ey Mənim özlərinə zülm edən qullarım, Allahın rəhmətindən ümidinizi kəsməyin. Həqiqətən, Allah bütün günahları bağışlayar. Həqiqətən, O, Bağışlayandır, Rəhmlidir.",
    context: "Günah nə qədər böyük olsa da, səmimi tövbə qapısı ölənə qədər açıq qalır.",
    tafsirSummary:
      "Allahın rəhmətindən ümidini kəsmək şeytandandır. mömin cəhənnəm qorxusu ilə Allahın bağışlanmasına ümid bəsləyir.",
  },
  {
    excerpt:
      "Qiyamətin gələcəyinə – buna heç bir şəkk-şübhə yoxdur – və Allah qəbirlərdə olanları dirildəcəkdir.",
    context: "Qiyamətin vaxtı gizli olsa da, mütləqdir.",
    tafsirSummary:
      "Qiyamətə dair əminlik və onun vaxtı ilə bağlı qeyri-müəyyənlik indiki zamanda mənəvi məsuliyyəti daşıyan şeydir.",
  },
  {
    excerpt:
      "Onun izni olmadan Onun yanında kim şəfaət edə bilər? O, onların önündə olanı da, sonrakıları da bilir.",
    context: "Şəfaət (şəfaət) həqiqidir, lakin heç vaxt Allahın icazəsindən asılı deyildir.",
    tafsirSummary:
      "Bu yeganə şərt – “Onun izni olmadan” – həqiqi şəfaəti onun hər bir fəsadından ayıran və dünya həyatında ölüləri çağırmağı qadağan edən şeydir.",
  },
  {
    excerpt:
      "Heç vaxt Allahın zalımların etdiklərindən xəbərsiz olduğunu düşünmə. O, onları ancaq gözlərin qorxu ilə baxacağı günə qədər gecikdirir.",
    context: "Məzlumun rahatlığı - ədalətin görünən gecikməsi onun yoxluğu deyil.",
    tafsirSummary:
      "Allah heç bir zülmü unuda bilməz. Zalıma ancaq heç bir şeyin gözdən düşməyəcəyi bir günə qədər möhlət verilir.",
  },
  {
    excerpt:
      "Sizlərdən heç kəs yoxdur ki, ona yetişsin. Bu, sənin Rəbbinə vacib hökmdür. Sonra Allahdan qorxanlara nicat verəcəyik, zalımları isə orada diz çökmüş halda qoyacağıq.",
    context:
      "Sirat üzərindən keçmək universaldır; salamat gəlişi Allahın rəhməti və təqvası ilə bəxş edilir.",
    tafsirSummary:
      "Hamı keçidə gəlir; fərq kimin xilas olub, kimin yıxılacağıdır - iman və qabaqcadan göndərilən əməllərlə qərar verilir.",
  },
  {
    excerpt:
      "Səndən o Saat haqqında soruşurlar ki, o nə vaxt qopacaq? De: “Onun elmi ancaq Rəbbimin yanındadır. Onun vaxtını Ondan başqa heç kəs aşkar edə bilməz. O, ancaq gözlənilmədən başınıza gəlməyəcək.",
    context: "Dəqiq vaxt yalnız Allaha məlumdur - hazırlıq işidir, proqnoz vermək əbəsdir.",
    tafsirSummary:
      "Hətta Peyğəmbərə xurma verilməmişdir; hər insanın bir il və ya geri sayım iddiası bu ayə ilə ziddiyyət təşkil edir.",
  },
  {
    excerpt:
      "Kimin dəftəri sağ əlinə verilsə, o deyəcək: Budur, mənim dəftərimi oxu! Hesabımla görüşəcəyimə əmin idim. Beləliklə, o, xoş bir həyatda olacaq.",
    context: "Kitabı alma tərzi - sağ və ya sol - özü birinci hökmdür.",
    tafsirSummary:
      "Müvəffəqiyyətlilərin sevinci mükafatlandırılan əminlik sevincidir: onlar hesabı gözləyərək yaşadılar və bu, şok deyil, rahatlıq kimi gəlir.",
  },
];

export const LAST_DAY_TIMELINE_AZ: DeepPartial<LastDayTimelineEvent>[] = [
  {
    title: "Bu dünyada həyat",
    body: "İnanmaq, ibadət etmək və hazırlamaq üçün təyin olunmuş qısa vaxt. Bu dünya son ev deyil - əməllər meydanıdır.",
  },
  {
    title: "Ölüm",
    body: "Hər bir nəfs ölümü dadacaqdır. Mömin onu Allahın rəhmətinə ümidlə qarşılar; qəflət onu qəfil və acı edər.",
  },
  {
    title: "Qəbir",
    body: "Dəfn edildikdən sonra ruh bərzəxə daxil olur. Qəbir hər bir insan üçün axirətin ilk mərhələsidir.",
  },
  {
    title: "Bərzəx",
    body: "Ölüm və dirilmə arasındakı həyat - həqiqi xəbərlərə görə sorğu-sual, xoşbəxtlik və ya cəza.",
  },
  {
    title: "Kiçik əlamətlər",
    body: "Tədricən baş verən ictimai və əxlaqi dəyişiklikləri Peyğəmbər ﷺ təsvir etmişdir. Bir çox alim qeyd edir ki, bir neçəsi peyda olub; dəqiq vaxt yalnız Allaha məxsusdur.",
  },
  {
    title: "Əsas əlamətlər",
    body: "Sona yaxın dramatik hadisələr - Mehdi, Dəccal və səhih hədislərdə İsanın (əleyhissalam) qayıdışı da daxil olmaqla. Ardıcıllıq təfərrüatları alimlər arasında fərqlidir.",
  },
  {
    title: "Trompet",
    body: "İsrafil sur çalacaq. Yaradılış ilk partlayışda ölür, ikinci partlayışda dirilir.",
  },
  {
    title: "Dirilmə",
    body: "Tozdan bərpa edilmiş bədənlər; bütün məxluqat Allahın hüzurundadır.",
  },
  {
    title: "Toplantı (Məhşər)",
    body: "Bütün insanlar Allahın istədiyi kimi ayaqyalın, çılpaq və sünnətsiz bir yerə toplaşıb hökm gözləyirdilər.",
  },
  {
    title: "Əməllərin qeydi",
    body: "Sağ əldə, sol əldə və ya arxadan verilən kitablar. Qeyd edilənlərdən heç nə buraxılmayıb.",
  },
  {
    title: "Tərəzi (Mizan)",
    body: "Əməllər mükəmməl ədalətlə ölçülür. Ağır tərəzilər sevinc gətirir; yüngül tərəzi itki gətirir.",
  },
  {
    title: "Məsuliyyət (Hisab)",
    body: "Bəziləri üçün asan hesablaşma; başqaları üçün ətraflı sorğu. İnsanlara olan hüquqlar diqqətdən kənarda qalmır.",
  },
  {
    title: "Şəfaət (Şəfa)",
    body: "Yalnız Allahın izni ilə - ən böyüyü Məhəmməd Peyğəmbərə məxsusdur.",
  },
  {
    title: "Gölet (Hawd)",
    body: "Peyğəmbərin (s) ümmətinin Qiyamət günü ondan içdiyi geniş bir hövzə.",
  },
  {
    title: "Körpü (Sirat)",
    body: "Hər bir insan Cəhənnəmi keçər – mötəbər rəvayətlərdə sürət iman və əmələ görə dəyişir.",
  },
  {
    title: "Cənnət və ya Cəhənnəm",
    body: "Əbədi məskən — Allahın rəhməti və saleh əməlləri ilə Cənnət; Cahannam əsl xəbərdarlıq və ədalətli nəticə kimi.",
  },
  {
    title: "Əbədilik",
    body: "Axirətdən sonra ölüm yoxdur. Cənnət əhli əbədi olaraq səadət içində qalır; cəhənnəm əhli Allahın istədiyi kimi qalır.",
  },
];

export const LAST_DAY_QUIZ_AZ: DeepPartial<LastDayQuizQuestion>[] = [
  {
    prompt: "Qiyamət gününə iman bunlardan biridir:",
    options: ["İslamın beş sütunu", "Altı iman şərti (İman)", "Yeddi cənnət", "On yoldaş"],
    explanation:
      "İman Allaha, mələklərə, kitablara, elçilərə, axirət gününə və ilahi hökmə (qədr) iman gətirməkdən ibarətdir.",
  },
  {
    prompt: "Bərzəx ən yaxşı şəkildə belə təsvir edilmişdir:",
    options: [
      "Cəhənnəm üzərində körpü",
      "Ölümlə dirilmə arasındakı həyat",
      "Əməllərin miqyası",
      "Truba səsi",
    ],
    explanation: "Bərzəx ölümdən sonra Qiyamət gününə qədər olan fasilədir.",
  },
  {
    prompt:
      "Doğru və ya yalan: Alimlər Qiyamətin bütün əsas əlamətlərinin dəqiq ardıcıllığı ilə bağlı həmfikirdirlər.",
    options: ["Doğrudur", "Yalan"],
    explanation:
      "Böyük əlamətlər səhih hədislərdə təsdiq edilmişdir, lakin bəzi ardıcıllıq təfərrüatlarında alimlər ixtilaf edirlər. Qiyamətin vaxtı ancaq Allaha məlumdur.",
  },
  {
    prompt: "Qiyamət gününün Mizan (miqyası) aşağıdakılara işarə edir:",
    options: [
      "Fiziki bədənlərin çəkisi",
      "Əməlləri mükəmməl ədalətlə ölçmək",
      "Qəbirdə vaxtın ölçülməsi",
      "Mələkləri saymaq",
    ],
    explanation: "Mizan əməlləri ölçür - ixlas və saleh əməl tərəzisini ağırlaşdırır.",
  },
  {
    prompt: "Qiyamət günü şəfaət (şəfaət):",
    options: [
      "Allahın izni olmadan baş verir",
      "Yalnız Allahın izni ilə",
      "İman ehtiyacını əvəz edir",
      "Quranda inkar olunur",
    ],
    explanation: "Qur'an 2:255 və 20:109 yalnız Allahın izni ilə şəfaəti təsdiq edir.",
  },
  {
    prompt: "Axirət səfərində hansı birinci gəlir?",
    options: ["Dirilmə", "Ölüm", "Toplantı", "Trompet"],
    explanation:
      "Ölüm bərzəxdən, sonra əlamətlərdən və surdan sonra dirilmə və məclisdən əvvəldir.",
  },
  {
    prompt: "Allahla görüşə hazırlaşmaq üçün bu həftə hansı vərdişi gücləndirəcəksiniz?",
    explanation:
      "Hazırlıq əməli işdir: namaz, Qur'an, tövbə, sədəqə, gözəl əxlaq və başqalarının haqqını yerinə yetirmək.",
  },
  {
    prompt: "Doğru və ya yalan: Qur'an 19:71 ayəsinə görə, hər kəs Siratdan keçəcək.",
    options: ["Doğrudur", "Yalan"],
    explanation:
      "Ayədə hər şeyin onun üzərindən keçəcəyi bildirilir; Allah düşünənləri xilas edər. Alimlər kimin yıxılmasının təfərrüatlarını müzakirə edirlər.",
  },
  {
    prompt:
      "Which phrase did the Prophet ﷺ describe as light on the tongue and heavy on the Scale?",
    options: [
      "Only the five daily prayers",
      "SubhanAllahi wa bihamdih and SubhanAllahil-'Azim",
      "Any long speech in Arabic",
      "Silence alone",
    ],
    explanation:
      "Sahih al-Bukhari 6406: two words light on the tongue, heavy on the Scale, beloved to the Most Merciful.",
  },
];

export const LAST_DAY_REFERENCES_AZ: DeepPartial<LastDayReferenceEntry>[] = [
  {
    title: "Qur'an",
    note: "Dirilmə, hesab vermə, Cənnət, Cəhənnəm və ilahi ədalət üçün ilkin mənbə. Bu moduldakı ayələrə surə və ayə ilə istinad edilir.",
  },
  {
    title: "Səhih əl-Buxari və Səhih Müslim",
    note: "Ölüm, qəbir, əlamətlər, hesab, şəfaət, Havd və Sirat üçün kanonik hədis topluları.",
  },
  {
    title: "Sünən ət-Tirmizi və Sünəni Əbi Davud",
    note: "Qəbir və kiçik əlamətlər haqqında əlavə orijinal hesabatlar - mümkün olduqda qiymətlər qeyd olunur.",
  },
  {
    title: "İbn Kəsir - Təfsir",
    note: "Qur'an ayələrinin axirətlə bağlı klassik şərhi. Müstəqil dəlil kimi deyil, qısa təfsir xülasələri üçün istifadə olunur.",
  },
  {
    title: "Əl-Əqidə ət-Təhaviyyə",
    note: "Dirilmə, miqyas, körpü, Cənnət və Cəhənnəmi təsdiq edən əsas sünni əqidəsi.",
  },
  {
    title: "Elmi fərqlər",
    note: "Alimlərin fərqli olduğu yerlərdə - məsələn. əsas işarələrin ardıcıllığı, Hawd təfərrüatları, hesablaşmadan daxil olan kateqoriyalar — bu modul bir baxışı yeganə etibarlı rəy olaraq iddia etmədən fərqi qeyd edir.",
  },
  {
    title: "Vəhy və təfsir",
    note: "Açıq-aydın Qur'an və mütəvatir və ya səhih hədislər təfsir rəylərindən (ictihad) və daha zəif rəvayətlərdən fərqlənir.",
  },
];
