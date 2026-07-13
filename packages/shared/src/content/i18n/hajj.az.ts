// Azerbaijani translation overlay for the Learn Hajj & Umrah guide. Mirrors the order of
// its English source in ../hajj-guide.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { HajjGuideSection } from "../../types/hajj-guide";
import type { DeepPartial } from "./localize";

export const HAJJ_GUIDE_SECTIONS_AZ: DeepPartial<HajjGuideSection>[] = [
  {
    day: "Getməmişdən əvvəl",
    title: "Öhdəlik və şərtlər",
    summary: "Həcc nə üçün vacibdir və kimə vacib olur.",
    steps: [
      {
        title: "Beşinci sütun",
        body: "Həcc İslamın beşinci sütunudur və hər bir imkanlı müsəlmana ömür boyu bir dəfə fərz edilir. Uca Allah buyurur: “İnsanlardan Allaha məxsus olan evi ziyarət etmək, ona bir yol tapmağa gücü çatan şəxs üçün” (Qur'an, 3:97). Bütün insanlara bəyan edildi: “İnsanlara həcc çağırın ki, onlar piyada və hər arıq dəvə ilə yanınıza gələcəklər” (Qur'an, 22:27).",
      },
      {
        title: "Bacarıq (istitaah)",
        body: "Həcc ancaq gücü çatanlara vacibdir: səfər üçün fiziki sağlamlıq, səfər üçün kifayət qədər halal mal-dövlət və uzaqda olarkən himayədarları, təhlükəsiz, açıq yol. Bu il kimin imkanı çatmazsa, gücü çatana qədər gecikdirməkdə günah yoxdur.",
      },
      {
        title: "Qadın səyahəti",
        body: "Alimlərin əksəriyyəti qadının məhrəmi (əri və ya yaxın qohumu) ilə Həcc ziyarətinə getdiyini bildirir; bəzi sonrakı alimlər təhlükəsiz, etibarlı qadınlar qrupu daxilində səyahət etməyə icazə verirlər. Etibar etdiyiniz səriştəli alimin hökmünə və həcc idarənizin qaydalarına əməl edin.",
      },
    ],
  },
  {
    day: "Getməmişdən əvvəl",
    title: "Həccin üç növü",
    summary: "İfrad, Qiran və Təməttu - ehrama girməzdən əvvəl seçin.",
    steps: [
      {
        title: "ifrad",
        body: "Zəvvar yalnız Həcc üçün ehrama girər, ayrıca ümrə etməz və onun hesabına qurban kəsməz. Nəhr gününün ayinlərinə qədər ehramda qalır.",
      },
      {
        title: "Qiran",
        body: "Zəvvar ümrə və həcci bir ehramda birləşdirərək, ümrə ayinlərini yerinə yetirir və həcc başa çatana qədər ehramda qalır. Təməttu kimi, qurban (hady) tələb edir.",
      },
      {
        title: "Tamattu'",
        body: "Zəvvar Həcc aylarında tam ümrə yerinə yetirir, ehramdan çıxır, sonra Zilhiccə ayının 8-də həcc üçün yenidən ehrama girir. Zəvvarların çoxu belə edir; qurban kəsmək lazımdır, yaxud həccdə üç gün, qayıdanda isə yeddi gün oruc tutmaq lazımdır (Qur'an, 2:196).",
      },
    ],
  },
  {
    day: "Getməmişdən əvvəl",
    title: "Miqatlar və Ehramlar",
    summary: "Müqəddəs dövlət haradan başlayır, nəyi qadağan edir.",
    steps: [
      {
        title: "Beş məvaqit",
        body: "Həzrət Peyğəmbər (s) beş miqat təyin etmişdir - ehramsız keçmək olmaz: Zül-Hüleyfə (Mədinə üçün), əl-Cuhfa (Suriya/Misir üçün), Qarnul-Mənazil (Nəcd üçün), Yeləmləm (Yəmən üçün) və Zat-İrq (İraq üçün). Artıq içəridə olanlar olduqları yerdən ehrama girirlər.",
        location: "Miqat",
      },
      {
        title: "Ehram nədir",
        body: "Ehram niyyət və təlbiyyə ilə daxil olan müqəddəs haldır. Kişilər iki tikilməmiş ağ çarşaf geyirlər; qadınlar adi təvazökar geyinməyə davam edirlər. Qüsldən sonra, kişilər üçün isə əvvəlcədən bədənə (paltara deyil) ətir çəkməkdən sonra daxil olur.",
        location: "Miqat",
      },
      {
        title: "Ehramın qadağaları",
        body: "Ehramda olarkən: tikişli paltar və baş örtüyü (kişilər üçün), ətirdən, saç və ya dırnaq kəsməkdən, ov ovlamaqdan, nikah bağlamaqdan və ya evlənməkdən və hər hansı yaxınlıqdan çəkinin. Bunları sındırmaq üçün kəffarə (fidyə) tələb oluna bilər, ona görə də onları diqqətlə saxlayın.",
        location: "Miqat",
      },
    ],
  },
  {
    title: "Ümrə",
    summary: "Kiçik həcc - ilin istənilən vaxtında edilə bilər.",
    steps: [
      {
        title: "Ehrama girin",
        body: "Miqatda və ya ondan əvvəl qüsl almaq, ehram paltarı geyinmək, ümrə niyyətini qurmaq və təlbiyyəyə başlamaq. Qəlbdə niyyət edilir və müqəddəs hal o andan başlayır.",
        location: "Miqat",
      },
      {
        title: "Təlbiyə oxuyun",
        body: "“Ləbbeyk Allahummə ləbbeyk, ləbbeykə lə şərikə ləkə ləbbeyk...” sözlərini tez-tez Məkkəyə doğru səfər edərkən təkrarlayın – bu, Allahın çağırışına tək cavab verdiyinizi bəyan edir – təvafa başlayana qədər davam edin.",
      },
      {
        title: "Kəbəni təvaf etmək",
        body: "Kəbəni saat əqrəbinin əksinə yeddi dəfə dövrələyin, Qara Daş küncündən başlayaraq, orada onu öpün, ona toxunun və ya sadəcə təkbirlə işarə edin. Kişilər ilk üç dövrədə raml (sürətli temp) və idtiba (sağ çiynini açıb) edirlər. Yəmən küncü ilə Qara Daş arasında belə oxunur: “Ey Rəbbimiz, bizə dünyada da, axirətdə də yaxşılıq ver və bizi cəhənnəm əzabından qoru” (Bəqərə, 2:201).",
        location: "Məscidül-Haram",
      },
      {
        title: "İki rükət namaz qıl",
        body: "Tavafdan sonra Məqam İbrahimin arxasında mümkünsə (yaxud camaatın hər hansı bir yerində) iki rükət namaz qılın, sonra zəmzəm suyunu sərbəst iç, çünki Peyğəmbər (sallallahu aleyhi və səlləm) buyurmuşdur ki, zəmzəm içilən hər şey üçündür.",
        location: "Məscidül-Haram",
      },
      {
        title: "Səfa və Mərvə arasında sai",
        body: "Həcərin oğlu İsmayıl üçün su axtarmasını xatırlamaq üçün Səfadan başlayaraq Səfa ilə Mərvə arasında yeddi dəfə gəzin. Allah buyurur: “Həqiqətən, Səfa və Mərvə Allahın rəmzlərindəndir” (Bəqərə, 158). Səfada üzünü Kəbəyə tutub dua və təkbir üçün əllərinizi qaldırın; kişilər yaşıl işarələr arasında qaçırlar.",
        location: "Məscidül-Haram",
      },
      {
        title: "Halq və ya təqsir",
        body: "Kişilər başını qırxırlar (halq, daha çox savabdır) və ya bərabər şəkildə kəsirlər (təqsir); qadınlar saçlarını toplayır və barmaq ucu uzunluğunda kəsdirirlər. Bununla Ümrə tamamlanır və ehram məhdudiyyətləri qaldırılır.",
      },
    ],
  },
  {
    day: "8 Zilhiccə",
    title: "Tərviyə günü - Mina",
    summary: "Həcc ziyarəti başlayır; gün Minada keçir.",
    steps: [
      {
        title: "Həcc üçün ehrama girin",
        body: "Həcc niyyətini edin və təlbiyyəni təzələyərək yenidən ehrama girin. Bu, müqəddəs dövləti yenidən başlayır, buna görə də ehram qadağaları bir daha tətbiq olunur.",
      },
      {
        title: "Minaya səyahət",
        body: "Minaya gedin, zöhr, əsr, məğrib, işa və sonrakı sübh namazlarını, hər biri öz vaxtında iki rükətə qədər qısaldılmış və Peyğəmbərin (s) sünnəsinə əməl edərək qılın. Gecə-gündüz ibadətlə, Ərəfədə dayanmağı gözləyin.",
        location: "Mina",
      },
    ],
  },
  {
    day: "9 Zilhiccə",
    title: "Ərəfə günü",
    summary: "Həccin ən böyük günü Ərəfədə dayanmaqdır.",
    steps: [
      {
        title: "Ərəfədə durun",
        body: "Günortadan sonra gün batana qədər dua, zikr və tövbə ilə Ərəfə hüdudlarında qalın. Peyğəmbər (salləllahu aleyhi və səlləm) buyurdu: “Həcc Ərəfədir” (Tirmizi 889, Əbu Davud 1949, həsən səhih): Kim bu ayaqda dursa, həccdən qaçmışdır. Üzünüzü qibləyə çevirin, əllərinizi qaldırın və Allaha yalvarın - dua üçün ən böyük gündür.",
        location: "Ərəfə",
      },
      {
        title: "Zöhr və Əsri birləşdirin",
        body: "Zöhr və əsr namazlarını birlikdə və zöhr vaxtı qısaldaraq (cəm təqdim), sonra günün qalan hissəsini əlavə namaza deyil, bütünlüklə duaya həsr edin.",
        location: "Ərəfə",
      },
      {
        title: "Müzdəlifəyə köç",
        body: "Gün batdıqdan sonra sakitcə Müzdəlifəyə səyahət edin, məğrib və işanı birləşdirin, gecəni dincəlin və daşqalaq üçün çınqıl toplayın. Zəiflər və qadınlar əzilməmək üçün gecə yarısından sonra Minaya gedə bilərlər.",
        location: "Müzdəlifə",
      },
    ],
  },
  {
    day: "10 Zilhiccə",
    title: "Nəhr günü — Qurban bayramı",
    summary: "Daşlama, qurban kəsmə və əsas təvaf.",
    steps: [
      {
        title: "Daş Cəmrətül-Əqabə",
        body: "Minaya tərəf qayıdın və hər atışda “Allahu əkbər” deyərək böyük sütuna (Cəmrətül-Əqabə) yeddi çınqıl atın. Bu, İbrahimin şeytanı rədd etməsini yenidən gündəmə gətirir və günün ilk ayinidir.",
        location: "Mina",
      },
      {
        title: "Qurban kəs",
        body: "Təməttu və qiran zəvvarları üçün tələb olunduğu kimi, qurbanlıq heyvanı kəsin və ya etibarlı bir qurum vasitəsilə təşkil edin (Qur'an, 2:196). Onun əti yeyilir və kasıblara verilir.",
      },
      {
        title: "Halq və ya təqsir",
        body: "Saçları qırxmaq (halq) və ya kəsmək (təqsir); qadınlar barmaq ucu uzunluğunu kəsirlər. Daşqalaq və təraşdan sonra birinci azadlığa (təhəllül-əvvəl) şamil edilir - həyat yoldaşı ilə yaxınlıq istisna olmaqla, bütün ehram məhdudiyyətləri qaldırılır.",
      },
      {
        title: "Təvaf əl-İfada",
        body: "Həccin sütunu olan İfadə təvafı və sai (təməttu üçün) üçün Məkkəyə gedin. Bu, ehramdan tam azad olmağı tamamlayır və ədəbsizlikdən və günahdan çəkinən şəxs “anası onu doğduğu gün kimi qayıdır” (Buxari 1521, Müslim 1350).",
        location: "Məscidül-Haram",
      },
    ],
  },
  {
    day: "11-13 Zilhiccə",
    title: "Təşrik günləri - Mina",
    summary: "Minada gecələr və hər gün üç sütunun daşlanması.",
    steps: [
      {
        title: "Gecəni Minada qalın",
        body: "11, 12 (və erkən getməsəniz 13) gecələrini Minada keçirin. Bu günlər yemək, içmək, Allahı zikr etmək, ibadət və təkbirlə keçən günlərdir.",
        location: "Mina",
      },
      {
        title: "Üç Cəmərəti daşlayın",
        body: "Hər gün günortadan sonra üç sütunun hər birinə sıra ilə yeddi çınqıl atın - kiçik, sonra orta, sonra böyük - hər atışda təkbir. Tələsən 12-də daşqalaq etdikdən sonra gedə bilər (Qur'an, 2:203).",
        location: "Mina",
      },
      {
        title: "Əlvida Tavaf",
        body: "Məkkədən çıxmazdan əvvəl son ayin olaraq Vəda təvafını edin ki, həccin son əməli Beytullahla olsun. Heyzli qadınlar bundan azaddırlar.",
        location: "Məscidül-Haram",
      },
    ],
  },
  {
    day: "Tamamlama və qərarlar",
    title: "Sütunlar, öhdəliklər və mükafat",
    summary: "Həccin səhih olanı, əvəzi və savabı nədir.",
    steps: [
      {
        title: "Sütunlar (arkan)",
        body: "Sütunlar həccin mahiyyətidir: ehrama girmək, Ərəfədə dayanmaq, təvafül-ifadə və sai (əksəriyyət inanır). Əgər hər hansı bir rükn qaçırılsa, həcc batildir və qurbanla qəzası olmaz – təkrar edilməlidir.",
      },
      {
        title: "Vaciblər (vacibət)",
        body: "Miqatdan ehrama girmək, Müzdəlifədə qalmaq, cəmarətin daşqalaq edilməsi, Minada təşrik gecələrini keçirmək və vida təvafı daxildir. Bir öhdəliyi tərk etmək həcci batil etmir, əksinə bənd (qurban) ilə əvəzlənir. Məzhəblər dəqiq siyahılarda fərqlənir; ixtisaslı bələdçi ilə məsləhətləşin.",
      },
      {
        title: "Məbrur həccinin savabı",
        body: "Qəbul edilmiş həcc (həcc məbrur) – günahsız və ixlasla edilmiş – keçmiş günahları silir və onun mükafatı Cənnətin özüdür. Peyğəmbər (salləllahu aleyhi və səlləm) demişdir: “Qəbul edilmiş həccin savabı cənnətdən başqa yoxdur” (Buxari 1773, Müslim 1349). Əla xarakter və mülayimlik üçün çalışın.",
      },
      {
        title: "Fətva deyil, əməli bələdçi",
        body: "Bu, ayinləri ardıcıllıqla yerinə yetirməyə kömək etmək üçün praktiki icmaldır. Məzhəblər bir çox təfərrüatlara görə hörmətlə fərqlənirlər və hər bir zəvvarın vəziyyəti fərqlidir - xüsusi hökmlər və gözlənilməz hallar üçün həmişə ixtisaslı alim və ya rəsmi Həcc bələdçinizlə məsləhətləşin.",
      },
    ],
  },
  {
    day: "Getməmişdən əvvəl",
    title: "Viza və qeydiyyat",
    summary: "Zəvvarlar rəsmi kanallar vasitəsilə Həcc və ya Ümrə vizasını necə əldə edirlər.",
    steps: [
      {
        title: "Nusuk platforması",
        body: "Nusuk (nusuk.sa) Səudiyyə Ərəbistanının Həcc və Ümrə üçün rəsmi platformasıdır - viza, yaşayış, nəqliyyat və qeydiyyatdan keçmiş tur paketlərini sifariş etmək üçün istifadə olunur. Yalnız Nusuk-u və ya onun vasitəsilə lisenziyalı agentlikləri istifadə edin; qeyri-rəsmi vasitəçilər çox vaxt fırıldaq və ləğv olunmuş səfərlərə səbəb olur.",
      },
      {
        title: "Həcc vizaları və ölkə kvotaları",
        body: "Hər ölkə illik Həcc kvotası alır, ona görə də əksər zəvvarlar fərdi müraciət etmək əvəzinə öz milli Həcc idarəsi və ya lisenziyalı yerli agent vasitəsilə müraciət edirlər. Həcc mövsümü açılan kimi tez müraciət edin - kvotalar və paket yerləri aylarla əvvəl dolur.",
      },
      {
        title: "Ümrə vizaları",
        body: "Həccdən fərqli olaraq, Ümrənin kvotası yoxdur və ilin istənilən vaxtında icra edilə bilər. Əksər millətlər birbaşa Nusuk və ya təsdiqlənmiş səyahət agenti vasitəsilə Ümrə vizası üçün müraciət edə bilər, adətən uçuş və otel sifarişi ilə birlikdə.",
      },
    ],
  },
  {
    day: "Getməmişdən əvvəl",
    title: "Yükləmə siyahısı",
    summary: "Səfərdən əvvəl yükləməli olduğunuz praktiki zəruri əşyalar.",
    steps: [
      {
        title: "İhram geyimləri",
        body: "Kişilər ən azı iki dəst tikilməmiş ihram geyimi (bel örtüyü və çiyin örtüyü) və pul və sənədlər üçün geniş, dəri olmayan ihram kəməri götürməlidirlər. Qadınlar geniş, təvazökar, bəzəksiz üst geyim götürməlidirlər.",
      },
      {
        title: "Ayaqqabı və rahatlıq",
        body: "Asanlıqla geyilib çıxarıla bilən açıq sandallar vacibdir, çünki kişilər üçün ihramda topuqları örtən ayaqqabılar qadağandır. Yüngül çanta, doldurulan su qabı və uzun gözləmələr üçün kiçik namaz xalçası götürün.",
      },
      {
        title: "Ətirsiz gigiyena vasitələri",
        body: "Ətirsiz sabun, günəşdən qoruyucu vasitə və salfetlər götürün - ihramda ətirli məhsullar qadağandır. Yığcam sanitar çantası, həkim qeydi ilə şəxsi dərmanlar və qabarcıq üçün plasterlər çoxlu piyada gedəcəyinizə görə əlavə çəkiyə dəyər.",
      },
      {
        title: "Sənədlər və vacib əşyalar",
        body: "Pasportunuzu, viza çıxarışını, peyvənd sertifikatını (adətən meningit peyvəndi tələb olunur) və təcili əlaqə nömrələrini paltarın altında geyilən yastı çantada saxlayın. Portativ enerji bankı və yerli SIM və ya eSIM izdihamlı yerlərdə naviqasiyanı çox asanlaşdırır.",
      },
    ],
  },
  {
    day: "Getməmişdən əvvəl",
    title: "Müqəddəs yerlər bələdçisi",
    summary: "Ziyarət edəcəyiniz əsas yerlər haqqında qısa praktiki qeydlər.",
    steps: [
      {
        title: "Məscidül-Həram, Məkkə",
        body: "Kəbənin ətrafındaki Böyük Məscid - təvaf və səyin yeri. O, sutka boyu işləyir; Qara Daş yaxınlığında və gündəlik beş namaz zamanı, xüsusən Ramazanın son on gecəsində və Həcc günlərində çox sıxlıq gözləyin.",
        location: "Məkkə",
      },
      {
        title: "Məscidün-Nəbi, Mədinə",
        body: "Peyğəmbərin ﷺ məscidi, Rövzəni və onun dəfn yerini özündə saxlayır, Həccin özünün hissəsi deyil, lakin demək olar ki, bütün zəvvarlar Həccdən əvvəl və ya sonra Mədinəni ziyarət edirlər. Rövzəyə giriş Nusuk və ya Rövzə tətbiqi vasitəsilə vaxtı təyin olunmuş giriş vərəqəsi tələb edir.",
        location: "Mədinə",
      },
      {
        title: "Mina",
        body: "Məkkədən bir neçə kilometr aralı çadır şəhəri, zəvvarların Zilhiccənin 8, 11, 12 (və 13-cü) gecələrini keçirdiyi yer. Kondisionerli, yanmaya davamlı çadır düşərgələri tur operatoru tərəfindən təyin olunur; sadə paylaşılan avadanlıqlar və Cəmərata gedən uzun yol gözləyin.",
        location: "Mina",
      },
      {
        title: "Ərəfat",
        body: "Məkkədən təxminən 20 km aralıda açıq düzənlik, Həccin ən vacib ayini - Zilhiccənin 9-da dayanma - yeri. Kölgəlik qurğular və su nöqtələri var, lakin gündüz istisi çox şiddətlidir; su içmək və gündən qorunma vacibdir.",
        location: "Ərəfat",
      },
      {
        title: "Müzdəlifə",
        body: "Ərəfat və Mina arasında açıq ərazi, zəvvarların Zilhiccənin 9-10-u gecəsini açıq səma altında keçirib rəcm üçün daş yığdıqları yer. Avadanlıqlar qəsdən sadə saxlanılıb - xalça götürün və gecə soyuğuna uyğun geyinin.",
        location: "Müzdəlifə",
      },
    ],
  },
  {
    day: "Getməmişdən əvvəl",
    title: "Rəsmi mənbələr",
    summary: "Etibarlı, ən son rəsmi məlumatı haradan tapmaq olar.",
    steps: [
      {
        title: "Nusuk (nusuk.sa)",
        body: "Səudiyyə Həcc və Ümrə Nazirliyinin viza, akkreditə olunmuş paketlər, Rövzə ziyarət icazələri və real vaxtda izdiham və nəqliyyat təlimatları üçün rəsmi portalı və tətbiqi - hər hansı rəsmi sual üçün ilk mərhələ.",
      },
      {
        title: "Öz ölkənizin Həcc idarəsi",
        body: "Əksər ölkələr illik kvotayı idarə edən, yerli agentləri yoxlayan və yola düşmə cədvəllərini və sağlamlıq tələblərini dərc edən milli Həcc idarəsi və ya nazirlik ofisi işlədir - hər hansı şəxsi agent vasitəsilə sifariş etməzdən əvvəl yoxlayın.",
      },
      {
        title: "Visit Saudi (visitsaudi.com)",
        body: "Krallığın rəsmi turizm saytı giriş tələblərini, uyğun millətlər üçün elektron viza məlumatını və Məkkə, Mədinə və Səudiyyə Ərəbistanı daxilində davamlı səyahət üçün praktiki səyahət məsləhətlərini ehtiva edir.",
      },
      {
        title: "Ödəniş etməzdən əvvəl yoxlayın",
        body: "Yalnız Nusuk-da qeydiyyatdan keçmiş agentliklər və ya öz milli Həcc idarəniz vasitəsilə sifariş edin. Əgər sövdələşmə qeyri-adi ucuz görünürsə və ya vasitəçi rəsmi kanallardan kənar ödəniş tələb edirsə, bunu təhlükə işarəsi kimi qəbul edin və birbaşa nazirlik portalı ilə yoxlayın.",
      },
    ],
  },
];
