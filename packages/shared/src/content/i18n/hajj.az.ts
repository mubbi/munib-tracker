import type { PilgrimageChecklistItem } from "../../types/hajj-guide";
import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Azerbaijani translation overlay for Hajj & Umrah learning topics and rite checklists.
// Entries are index-aligned with the English sources; stable identifiers and references remain unchanged.

export const HAJJ_GUIDE_TOPICS_AZ: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Qəbul olunmuş Həccin mükafatı",
    summary: "Həcc-i məbrur günahları silər və onun mükafatı Cənnətdir.",
    body: [
      "Əbu Hureyra rəvayət edir ki, Allahın Elçisi ﷺ demişdir: «Kim Allah üçün həcc edər, cinsi əlaqəyə girməz və günah işləməzsə, anadan olduğu gündəki kimi qayıdar» (Səhih əl-Buxari 1521; Səhih Müslim 1350).",
      "O, həmçinin demişdir: «Qəbul olunmuş həccin (həcc-i məbrurun) mükafatı Cənnətdən başqa bir şey deyildir» (Səhih əl-Buxari 1773; Səhih Müslim 1349). Qəbul olunma səmimiyyətlə və həccin pozğunluqdan və günahdan uzaq saxlanılması ilə bağlıdır — sadəcə zahiri əməllərin tamamlanması ilə deyil.",
    ],
    hadith: [
      {
        excerpt:
          "Kim Allah üçün həcc edər, cinsi əlaqəyə girməz və günah işləməzsə, anadan olduğu gündəki kimi qayıdar.",
      },
      {
        excerpt:
          "Kim Allah üçün həcc edər, cinsi əlaqəyə girməz və günah işləməzsə, anadan olduğu gündəki kimi qayıdar.",
      },
      { excerpt: "Qəbul olunmuş həccin mükafatı Cənnətdən başqa bir şey deyildir." },
      { excerpt: "Qəbul olunmuş həccin mükafatı Cənnətdən başqa bir şey deyildir." },
    ],
    actions: [
      "Həcci yalnız Allah üçün niyyət et — bütün səfər boyu dilini və xarakterini qoru.",
      "Tətbiqdəki Həcc siyahısından yalnız yaddaş köməkçisi kimi istifadə et; qəlbini qəbul olunmağa yönəlt.",
    ],
    appLinks: [{ label: "Həcc əməlləri siyahısı" }],
  },
  {
    title: "Ümrənin fəziləti",
    summary: "Bir Ümrə digərinə qədər arada olan günahları silər.",
    body: [
      "Əbu Hureyra rəvayət edir ki, Peyğəmbər ﷺ demişdir: «Ümrə etmək onunla əvvəlki arasında işlənən günahlara kəffarədir, qəbul olunmuş həccin mükafatı isə Cənnətdən başqa bir şey deyildir» (Səhih əl-Buxari 1773; Səhih Müslim 1349).",
      "Ümrə ilin istənilən vaxtında əda oluna bilər. O, Həccdən qısadır, lakin hələ də böyük bir ibadətdir: ehram, təvaf, səy, saç kəsmə və ya qırxdırma.",
    ],
    hadith: [
      {
        excerpt:
          "Ümrə etmək onunla əvvəlki arasında işlənən günahlara kəffarədir, qəbul olunmuş həccin mükafatı isə Cənnətdən başqa bir şey deyildir.",
      },
      {
        excerpt:
          "Ümrə etmək onunla əvvəlki arasında işlənən günahlara kəffarədir, qəbul olunmuş həccin mükafatı isə Cənnətdən başqa bir şey deyildir.",
      },
    ],
    actions: ["Əməlləri ardıcıllıqla yerinə yetirməyə hazır olduqda Ümrə siyahısını aç."],
    appLinks: [{ label: "Ümrə əməlləri siyahısı" }],
  },
  {
    title: "Ərəfə günü",
    summary: "Ərəfədə dayanmaq Həccin qəlbidir — və böyük bir dua günüdür.",
    body: [
      "Abdürrəhman ibn Yamər rəvayət edir ki, Peyğəmbər ﷺ demişdir: «Həcc Ərəfədir» (Sünən Əbu Davud 1949; Camiüt-Tirmizi 889). Ərəfə sərhədləri daxilində öz vaxtında dayanmağı buraxan kəs, həmin ilin həccini buraxmış olar.",
      "Həccə getməyənlər üçün Ərəfə günü oruc tutmaq çox tövsiyə olunan bir əməldir: Əbu Qatadə rəvayət edir ki, Ərəfə günü oruc keçmiş ilin və gələn ilin günahlarına kəffarə olur (Səhih Müslim 1162). Hacılar özləri oruc tutmurlar ki, günü duaya həsr edə bilsinlər.",
    ],
    hadith: [
      { excerpt: "Həcc Ərəfədir." },
      { excerpt: "Həcc Ərəfədir." },
      {
        excerpt:
          "Ərəfə günü oruc tutmaq, Allahdan ümid edirəm ki, ondan əvvəlki və sonrakı ilin günahlarına kəffarə olur.",
      },
    ],
  },
  {
    title: "Həcc — beşinci rükn",
    summary: "İmkanı olan hər müsəlmana ömründə bir dəfə vacibdir.",
    body: [
      "Allah buyurur: «İnsanlardan Evə (Kəbəyə) yol tapa bilənlərin həcc etməsi Allahın haqqıdır. Kim kafir olarsa, (bilsin ki) Allah aləmlərdən möhtac deyildir» (Qurani-Kərim 3:97).",
      "Bütün insanlara çağırış edildi: «İnsanlar arasında həcci elan et; onlar sənə piyada və hər arıq dəvə üzərində gələcəklər; onlar hər uzaq yoldan gələcəklər» (Qurani-Kərim 22:27).",
      "İbn Ömər rəvayət edir ki, Peyğəmbər ﷺ demişdir ki, İslam beş əsas üzərində qurulmuşdur: şəhadət, namaz, zəkat, Ramazan orucu və imkanı olan üçün Evə həcc (Səhih əl-Buxari 8; Səhih Müslim 16). Alimlər razılaşırlar ki, şərtlər yerinə yetirildikdə ömürdə bir dəfə vacibdir; onu təkrarlamaq isə könüllü bir fəzilətdir.",
    ],
    quran: [
      {
        excerpt: "İnsanlardan Evə yol tapa bilənlərin həcc etməsi Allahın haqqıdır...",
      },
      {
        excerpt:
          "İnsanlar arasında həcci elan et; onlar sənə piyada və hər arıq dəvə üzərində gələcəklər...",
      },
    ],
    hadith: [
      {
        excerpt:
          "İslam beş əsas üzərində qurulmuşdur: Allahdan başqa ilah olmadığına və Muhəmmədin Onun Elçisi olduğuna şəhadət etmək, namaz qılmaq, zəkat vermək, Ramazan orucunu tutmaq və imkanı olan üçün Evə həcc etmək.",
      },
      {
        excerpt: "İslam beş əsas üzərində qurulmuşdur... və yol tapa bilən üçün Evə həcc.",
      },
    ],
  },
  {
    title: "İmkan (istitaə)",
    summary:
      "Sağlamlıq, halal mal-dövlət və təhlükəsiz yol — bunlar olmadan Həcc hələ vacib olmaz.",
    body: [
      "Qurani-Kərim 3:97-də qeyd olunan şərt imkandır (istitaə). Klassik alimlər onu belə xülasə edirlər: səfər üçün bədən sağlamlığı, səfəri və uzaqdaykən himayəsindəkilərin ehtiyaclarını ödəmək üçün kifayət qədər halal mal-dövlət, təhlükəsiz və açıq yol.",
      "Bu il bu vasitələrə malik olmayan kəs, imkanlı olana qədər gecikdirdiyi üçün günahkar deyildir. İmkan hər kəsin öz vəziyyətinə görə qiymətləndirilir — xəstəlik, ödənilməli borc və ya təhlükəli səfər dərhal vacibliyi qaldıra bilər. Vəziyyətin aydın olmadıqda ixtisaslı bir alimə müraciət et.",
    ],
    quran: [{ excerpt: "...yol tapa bilən üçün." }],
    actions: [
      "Rezervasiya etməzdən əvvəl vacib borcları ödə və himayəndəkilərin təminatını təşkil et.",
      "Paketləri yalnız rəsmi kanallar vasitəsilə yoxla (Hazırlıq mövzularına bax).",
    ],
  },
  {
    title: "Qadının həcc üçün səfəri",
    summary:
      "Əksəriyyət məhrəm tələb edir; sonrakı bəzi baxışlar etibarlı, təhlükəsiz qrup ilə səfərə icazə verir.",
    body: [
      "İbn Abbas rəvayət edir ki, Peyğəmbər ﷺ demişdir ki, qadın məhrəmsiz səfər etməməli, kişi də məhrəm olmadan onun yanına girməməlidir (Səhih əl-Buxari 1862; Səhih Müslim 1341). Çoxlu alim bunu Həcc və Ümrə səfərinə tətbiq edir.",
      "Bəzi sonrakı alimlər — təhlükəsizliyi, zərurəti və müasir səfər imkanlarını nəzərə alaraq — məhrəm olmadıqda qadına vacib Həcc üçün etibarlı bir qrupla səfər etməyə icazə verir. Bu, hələ də mübahisəli bir fiqh məsələsidir.",
    ],
    hadith: [
      {
        excerpt:
          "Qadın məhrəmsiz səfər etməməli, kişi də məhrəm onunla olmadan onun yanına girməməlidir.",
      },
      {
        excerpt:
          "Allaha və Axirət gününə iman edən qadına məhrəmsiz bir gün-gecə səfər etmək halal deyildir.",
      },
    ],
    madhhabNote:
      "Əksəriyyət hesab edir ki, qadın həcc səfəri üçün məhrəmə ehtiyac duyur. Bəzi sonrakı alimlər vacib Həcc üçün etibarlı qadın qrupu ilə səfərə icazə verir. Etibar etdiyin bir alimə və öz Həcc idarənin qaydalarına əməl et.",
    disclaimer: "Bu, ümumi bir baxışdır, sənin vəziyyətin üçün şəxsi fətva deyildir.",
  },
  {
    title: "Həccin üç növü",
    summary: "İfrad, Qiran və Təməttö' — ehrama girmədən əvvəl seç.",
    body: [
      "İfrad: yalnız Həcc üçün ehrama girmək, həmin ehram daxilində ayrı Ümrə olmadan, əməlləri birləşdirməyə görə qurban tələb olunmadan.",
      "Qiran: Ümrə və Həcci bir ehramda birləşdirmək, Həcc başa çatana qədər ehramda qalmaq. Qurban (hədy) tələb olunur.",
      "Təməttö': Həcc aylarında tam bir Ümrə əda etmək, ehramdan çıxmaq, sonra 8 Zilhiccədə Həcc üçün yenidən ehrama girmək. Bu, bu gün hacıların əksəriyyətinin etdiyi şeydir; bu da hədy tələb edir.",
      "Allah əməlləri birləşdirənlər haqqında buyurur: «...Kim Ümrədən Həccə qədər faydalanarsa, qurbanlıq heyvandan asanlıqla əldə edilə biləni versin...» bunu edə bilməyənlər isə Həcc zamanı üç gün, qayıtdıqdan sonra isə yeddi gün oruc tutsunlar (Qurani-Kərim 2:196).",
    ],
    quran: [
      {
        excerpt:
          "Həcci və Ümrəni Allah üçün tamamlayın... Kim Ümrədən Həccə qədər faydalanarsa, qurbanlıq heyvandan asanlıqla əldə edilə biləni versin. Tapa bilməyən isə — Həcc zamanı üç gün və qayıtdıqda yeddi gün oruc tutsun...",
      },
    ],
    actions: [
      "Miqatdan əvvəl növünü qrup rəhbərinlə birlikdə müəyyənləşdir.",
      "Təməttö' edirsənsə, Həcc üçün yenidən ehrama girmədən əvvəl Ümrəni tam başa çatdır.",
    ],
    appLinks: [{ label: "Ümrə siyahısı" }, { label: "Həcc siyahısı" }],
  },
  {
    title: "Beş miqat",
    summary: "Həcc və ya Ümrə üçün ehrama girmədən miqatı Məkkəyə tərəf keçmə.",
    body: [
      "İbn Abbas rəvayət edir ki, Peyğəmbər ﷺ insanlar üçün miqatları müəyyən etdi: Mədinə üçün Zül-Huleyfə, Şam üçün Cuhfə, Nəcd üçün Qərnul-Mənazil və Yəmən üçün Yələmləm; İraq əhli üçün isə Zatü-İrq. Dedi ki, bunlar onlar üçün və Həcc və ya Ümrə niyyəti ilə oraya gələn hər kəs üçündür; bu yerlərin daxilində yaşayan hər kəs isə çıxdığı yerdən ehrama girsin, hətta Məkkə əhli Məkkədən (Səhih əl-Buxari 1524; Səhih Müslim 1181).",
      "Müasir hava limanları və dəniz limanlarında müvafiq ehram nöqtələri və ya elan olunmuş qaydalar mövcuddur — sərhədi ehramsız keçməmək üçün daşıyıcının və Həcc və Ümrə Nazirliyinin göstərişlərinə əməl et.",
    ],
    hadith: [
      {
        excerpt:
          "Allahın Elçisi ﷺ Mədinə əhli üçün Zül-Huleyfəni, Şam əhli üçün Cuhfəni, Nəcd əhli üçün Qərnul-Mənazili və Yəmən əhli üçün Yələmləmi müəyyən etdi... Bu miqatlar bu yerlərin əhalisi üçün, həmçinin Həcc və ya Ümrə niyyəti ilə oraya gələnlər üçündür...",
      },
      {
        excerpt:
          "Allahın Elçisi ﷺ miqatları müəyyən etdi... Bu sərhədlər daxilində yaşayan hər kəs çıxdığı yerdən ehrama girsin...",
      },
    ],
  },
  {
    title: "Ehrama girmək",
    summary: "Qüsl, geyim, niyyət və təlbiyə müqəddəs halın başlanğıcıdır.",
    body: [
      "Ehram Həcc və ya Ümrə üçün niyyətlə girilən müqəddəs haldır. Peyğəmbər ﷺ ehramdan əvvəl qüsl etməyi tövsiyə etmişdir. Kişilər tikilməmiş iki ağ örtük geyinir; qadınlar isə üzü və əlləri əlcəklə örtmədən adi təvazökar geyimlərini ehram geyimi kimi saxlayırlar (niqab və əlcək detalları fiqhdə müzakirə olunur).",
      "Kişilər ehramdan əvvəl bədənə ətir sürtə bilər, ancaq həmin hala girdikdən sonra ehram geyiminə deyil (Səhih əl-Buxari 1539). Sonra niyyət et və təlbiyəyə başla.",
      "Peyğəmbərin ﷺ öyrətdiyi təlbiyə belədir: «Ləbbəyk Allahummə ləbbəyk, ləbbəykə lə şərikə ləkə ləbbəyk, innəl-həmdə vən-ni'mətə ləkə vəl-mülk, lə şərikə lək» — bu, Ümrə üçün təvafa başlayana qədər, ya da Həcc üçün Cəmrətul-Əqəbəni daşlayana qədər məşhur əmələ görə davam edir (Səhih əl-Buxari 1549; Səhih Müslim 1184).",
    ],
    hadith: [
      {
        excerpt:
          "Aişə dedi: Mən Allahın Elçisini ﷺ ehrama girmədən əvvəl ehramı üçün ətirləyirdim...",
      },
      {
        excerpt:
          "Ləbbəyk Allahummə ləbbəyk, ləbbəykə lə şərikə ləkə ləbbəyk, innəl-həmdə vən-ni'mətə ləkə vəl-mülk, lə şərikə lək.",
      },
      { excerpt: "Peyğəmbər ﷺ təlbiyə ilə səsini ucaldırdı: Ləbbəyk Allahummə ləbbəyk..." },
    ],
    actions: [
      "Kişilər üçün ən azı iki dəst ehram götür; qoxusuz gigiyena vasitələrini hazır saxla.",
      "Yol boyu asanlıqla deyilsin deyə səfərdən əvvəl təlbiyəni məşq et.",
    ],
  },
  {
    title: "Ehramın qadağaları",
    summary: "Möhrimin müqəddəs haldan azad olana qədər çəkinməli olduğu şeylər.",
    body: [
      "Ehramdayken çəkin: kişilər üçün — tikilmiş/bədənə uyğun paltar geyinmək və başı örtmək; ətir; saç və ya dırnaq kəsmək; quru yer heyvanlarını ovlamaq; nikah bağlamaq və ya aparmaq; və cinsi yaxınlıq. Qadınlar ətirdən və digər ümumi qadağalardan çəkinərək təvazökar geyimlərini saxlayırlar.",
      "Qadağanı pozmaq nə edildiyinə görə kəffarə (fidyə) tələb edə bilər — adətən oruc, yoxsulu yedirtmə və ya qurban. Məzhəblər detalları fərqli təsnif edir. Qadağalara diqqətlə əməl et və gözlənilməz bir şey baş verərsə ixtisaslı bir bələdçiyə müraciət et.",
    ],
    actions: ["Ehram zamanı ətir, dırnaq kəsən və qayçını asan çatılmayan yerdə saxla."],
    madhhabNote:
      "Pozuntuların və onların kəffarələrinin siyahısı məktəblərə görə dəyişir. Bunu praktik xəbərdarlıq siyahısı kimi qəbul et, sonra detalları öz məzhəbin və ya Həcc bələdçin ilə təsdiqlə.",
    disclaimer: "Bu ümumi baxış, pozuntu baş verdikdə yerindəki bələdçiliyin əvəzi deyildir.",
  },
  {
    title: "Ümrə — ehram və təlbiyə",
    summary: "Miqatda və ya ondan əvvəl müqəddəs hala gir, sonra Allahın çağırışına cavab ver.",
    body: [
      "Miqatında və ya ondan əvvəl, mümkünsə qüsl et, ehram geyimini geyin, Ümrə üçün niyyət et və təlbiyəyə başla. Müqəddəs hal bu niyyətlə başlayır.",
      "Məkkəyə tərəf yol gedərkən təvafa başlayana qədər təlbiyəni tez-tez təkrarla. Bu, təkbaşına Allahın çağırışına cavab verdiyini bildirən bir bəyanatdır.",
    ],
    actions: ["Hər əməli tamamladıqca qeyd etmək üçün Ümrə siyahısından istifadə et."],
    appLinks: [{ label: "Ümrə siyahısı" }],
  },
  {
    title: "Kəbənin təvafı",
    summary: "Qara Daşdan başlayaraq saat əqrəbinin əksinə yeddi dövrə.",
    body: [
      "Kəbəni saat əqrəbinin əksinə yeddi dəfə dövrə vur, Qara Daş guşəsindən başlayıb orada da bitir. Sıxlıq varsa, onu öp, ona toxun, ya da təkbir deyərək ona işarə et — başqalarına zərər vermədən Peyğəmbərin ﷺ əməlinə uyğun.",
      "Kişilər Ümrənin bu gəliş təvafında ilk üç dövrədə rəml (sürətli yerimə) və idtiba' (sağ çiyini açıq saxlamaq) edirlər, məşhur Sünnəyə görə.",
      "Yəmən guşəsi ilə Qara Daş arasında demək tövsiyə olunur: «Ey Rəbbimiz, bizə dünyada da yaxşılıq, axirətdə də yaxşılıq ver və bizi Odun əzabından qoru» (Qurani-Kərim 2:201).",
    ],
    quran: [
      {
        excerpt:
          "Ey Rəbbimiz, bizə dünyada yaxşı olanı, axirətdə də yaxşı olanı ver və bizi Odun əzabından qoru.",
      },
    ],
  },
  {
    title: "İki rükət və Zəmzəm",
    summary: "Mümkünsə Məqami-İbrahimin arxasında namaz qıl, sonra Zəmzəm suyu iç.",
    body: [
      "Təvafdan sonra, yer varsa Məqami-İbrahimin arxasında iki rükət namaz qıl, ya da sıxlıq varsa məsciddə başqa bir yerdə — Allahın sözlərinə əsasən: «...Və İbrahimin dayandığı yeri namaz yeri olaraq götürün, (ey möminlər)...» (Qurani-Kərim 2:125).",
      "Sonra Zəmzəm suyu iç. Cabirin Peyğəmbərin ﷺ Həccini təsviri təvafdan sonra Zəmzəm içməyi ehtiva edir; Peyğəmbər ﷺ demişdir ki, Zəmzəm nə üçün içilirsə onun üçündür (sonrakı alimlər tərəfindən toplanmış səhih rəvayətlər; niyyəti və duayı tövsiyə olunan kimi qəbul et).",
    ],
    quran: [
      { excerpt: "...Və İbrahimin dayandığı yeri namaz yeri olaraq götürün, (ey möminlər)..." },
    ],
  },
  {
    title: "Səfa ilə Mərvə arasında səy",
    summary: "Həcərin su axtarışının xatirəsinə yeddi məsafə.",
    body: [
      "Allah buyurur: «Həqiqətən, Səfa və Mərvə Allahın nişanələrindəndir. Beləliklə, Evə həcc edən və ya Ümrə əda edən kəs — onların arasında getməkdə heç bir günah yoxdur...» (Qurani-Kərim 2:158).",
      "Səfadan başlayaraq Səfa ilə Mərvə arasında yeddi dəfə get. Səfada Kəbəyə üz tut, Peyğəmbərin ﷺ etdiyi kimi əllərini qaldırıb təkbir və dua et. Kişilər yaşıl işarələr arasında yüngül qaçırlar.",
    ],
    quran: [
      {
        excerpt:
          "Həqiqətən, Səfa və Mərvə Allahın nişanələrindəndir. Beləliklə, Evə həcc edən və ya Ümrə əda edən kəs — onların arasında getməkdə heç bir günah yoxdur...",
      },
    ],
  },
  {
    title: "Həlq və ya təqsir — Ümrənin tamamlanması",
    summary:
      "Kişilər saçlarını qırxdırır və ya qısaldır; qadınlar barmaq ucu qədər qısaldır — sonra ehram sona çatır.",
    body: [
      "Kişilər başlarını qırxdırır (həlq) — Peyğəmbərin ﷺ üç dəfə dua etdiyi şey — ya da bərabər qısaldırlar (təqsir). Qadınlar saçlarını yığıb barmaq ucu qədər qısaldırlar. Bununla Ümrə tamamlanır və ehram qadağaları sona çatır.",
      "Abdullah ibn Ömər rəvayət edir ki, Allahın Elçisi ﷺ demişdir: «Allahım, başlarını qırxdıranlara rəhm et.» Dedilər: «Bəs qısaldanlara, ey Allahın Elçisi?» Dedi: «Allahım, başlarını qırxdıranlara rəhm et.» Dedilər: «Bəs qısaldanlara?» Üçüncü dəfə dedi: «Və qısaldanlara» (Səhih əl-Buxari 1727; Səhih Müslim 1301).",
    ],
    hadith: [
      { excerpt: "Allahım, başlarını qırxdıranlara rəhm et... Və (üçüncü dəfə) qısaldanlara." },
      {
        excerpt:
          "Allahım, başlarını qırxdıranları bağışla... sonra üçüncü dəfə dedi: və saçlarını qısaldanları da.",
      },
    ],
  },
  {
    title: "8 Zilhiccə — Tərviyə günü",
    summary: "Həcc üçün ehrama gir və günü Minada keçir.",
    body: [
      "Təməttö' hacıları üçün: Həcc üçün niyyət edin və Məkkədəki mənzilinizdən yenidən ehrama girin, təlbiyəni yeniləyin. İfrad və Qiran hacıları artıq ehramdadır.",
      "Minaya gedin və Zöhr, Əsr, Məğrib, İşa və növbəti Sübh namazlarını qılın, hər biri öz vaxtında iki rükətə qısaldılmış şəkildə, Cabirin rəvayət etdiyi kimi Peyğəmbərin ﷺ Vida Həccindəki əməlinə uyğun (Səhih Müslim 1218). Ərəfəyi gözləyərək gün və gecəni ibadətlə keçirin.",
    ],
    hadith: [
      {
        excerpt:
          "Cabirin Peyğəmbərin ﷺ Vida Həcci haqqında uzun rəvayəti — Minada qalma və əməllərin ardıcıllığını əhatə edir.",
      },
    ],
    actions: ["8-in səhəri Həcc siyahısını aç."],
    appLinks: [{ label: "Həcc siyahısı" }],
  },
  {
    title: "9 Zilhiccə — Ərəfə günü",
    summary: "Gün batana qədər Ərəfədə dayan; sonra Müzdəlifəyə keç.",
    body: [
      "Günortadan sonra gün batana qədər dua, zikr və tövbə ilə Ərəfə sərhədləri daxilində qal. Peyğəmbər ﷺ «Həcc Ərəfədir» demişdir (Sünən Əbu Davud 1949). Qibləyə üz tut, əllərini qaldır və Allaha yalvar — bu, dua üçün ən böyük vaxtlardan biridir.",
      "Zöhr və Əsri Zöhr vaxtında birlikdə və qısaldılmış şəkildə qıl (cəm-i təqdim), sonra günün qalan hissəsini nafilə namaz əvəzinə duaya həsr et — Peyğəmbərin ﷺ əməlinə uyğun (Səhih Müslim 1218).",
      "Gün batdıqdan sonra sakitcə Müzdəlifəyə səfər et. Məğrib və İşanı birləşdir (İşa qısaldılmış), gecə istirahət et və daşlama üçün kiçik daşlar topla. Zəiflər və qadınlar Sünnədəki məşhur icazələrə görə gecə yarısından sonra Minaya gedə bilərlər.",
    ],
    hadith: [
      { excerpt: "Həcc Ərəfədir." },
      {
        excerpt:
          "Peyğəmbər ﷺ Ərəfədə Zöhr və Əsri birləşdirdi, sonra gün batdıqdan sonra Müzdəlifəyə yola çıxdı...",
      },
    ],
  },
  {
    title: "10 Zilhiccə — Nəhr günü",
    summary: "Daşlama, qurban, saç kəsmə və Təvafi-İfadə.",
    body: [
      "Minaya qayıdın və hər daş atarkən Allahu əkbər deyərək Cəmrətul-Əqəbəyə (böyük dirəyə) yeddi daş atın — Vida Həccindəki ardıcıllığa görə günün ilk əməli.",
      "Təməttö' və Qiran üçün tələb olunan qurbanı verin (Qurani-Kərim 2:196), ya da onu etibarlı bir agentlik vasitəsilə təşkil edin. Ət yeyilir və yoxsullara paylanır.",
      "Qırxdırın (həlq) ya da qısaldın (təqsir); qadınlar barmaq ucu qədər qısaltsın. Daşlama və qırxdırma/qısaltmadan sonra ilk azadlıq (təhəllüli-əvvəl) tətbiq olunur — cinsi yaxınlıq istisna olmaqla ehram qadağalarının əksəriyyəti sona çatır.",
      "Təvafi-İfadə üçün — Həccin bir rükni — və Təməttö' hacıları üçün səy üçün Məkkəyə gedin (gəliş təvafı ilə artıq səy edən İfrad/Qiran hacıları öz məzhəblərinin hökmünə əməl edir). Bu, ehramdan tam azadlıqla tamamlanır.",
    ],
    quran: [
      {
        excerpt:
          "...Kim Ümrədən Həccə qədər faydalanarsa, qurbanlıq heyvandan asanlıqla əldə edilə biləni versin...",
      },
    ],
    madhhabNote:
      "Nəhr günü əməllərinin ardıcıllığı Sünnədə çeviklik daşıyır; məzhəblər dəqiq ardıcıllıq və hər Həcc növü üçün səyin nə vaxt tələb olunduğu barədə fərqlənir. Qrupunuzun bələdçisinə əməl edin.",
  },
  {
    title: "11–13 Zilhiccə — Təşriq günləri",
    summary: "Minada gecələr, üç Cəmərata gündəlik daşlama, sonra vida təvafı.",
    body: [
      "11-in, 12-nin (və tezliklə çıxmırsınızsa 13-ün) gecələrini Minada keçirin. Bunlar yemə, içmə və Allahı zikr etmə günləridir.",
      "Hər gün Zöhrdən sonra üç dirəkdən hər birinə ardıcıllıqla — kiçik, sonra orta, sonra böyük — hər atışda təkbir deyərək yeddi daş atın. Tələsən kəs 12-nin daşlamasından sonra çıxa bilər (Qurani-Kərim 2:203).",
      "Məkkədən çıxmadan əvvəl, Evlə son əməlin vida olması üçün Təvafi-Vida edin. İbn Abbas rəvayət edir ki, insanlara son əməllərinin Evdə olması buyurulmuşdu, ancaq heyzli qadın üçün bu yüngülləşdirilmişdi (Səhih əl-Buxari 1755; Səhih Müslim 1328).",
    ],
    quran: [
      {
        excerpt:
          "Allahı müəyyən sayda günlərdə zikr edin. Kim iki gündə tələsərsə — ona günah yoxdur; kim gecikdirsə — ona da günah yoxdur — Allahdan qorxan üçün...",
      },
    ],
    hadith: [
      {
        excerpt:
          "İnsanlara son əməl olaraq Kəbənin vida təvafını etmək buyuruldu, ancaq heyzli qadınlar bundan azad edildi.",
      },
      {
        excerpt:
          "İnsanlara son əməllərinin Evdə olması buyuruldu, ancaq heyzli qadın üçün yüngülləşdirildi.",
      },
    ],
  },
  {
    title: "Rüknlər və vaciblər",
    summary: "Buraxıldıqda Həccin batil olduğu şeylər və qurbanla ödənilə bilənlər.",
    body: [
      "Rüknlər (ərkan) Həccin mahiyyətidir. Bir rükn buraxılarsa, Həcc batil olur və yalnız qurbanla düzəldilə bilməz — təkrar edilməlidir. Əksəriyyət adətən bunları sadalayır: ehram (niyyət), Ərəfədə dayanmaq, Təvafi-İfadə və səy.",
      "Vaciblər (vacibat) miqatdan ehrama girmək, Müzdəlifədə qalmaq, Cəmərata daş atmaq, Təşriq gecələrini Minada keçirmək və Vida Təvafını əhatə edir. Bir vacibin buraxılması Həcci batil etmir, ancaq məzhəblərə görə dəmlə (qurban) ödənilir.",
    ],
    madhhabNote:
      "Dəqiq ərkan və vacibat siyahıları dörd məzhəb arasında fərqlənir. Xüsusilə izdiham təzyiqi altında bir şey buraxılarsa, öz məzhəbin üçün ixtisaslı bir bələdçi ilə təsdiqlə.",
    disclaimer: "Bu praktik bir xülasədir, buraxılmış əməllər üzrə fətva deyildir.",
  },
  {
    title: "Ədəb və səmimiyyət",
    summary: "Dilini və üzvlərini qoru — qəbul olunma xarakterlə bağlıdır.",
    body: [
      "Günahsız qayıdış hədisi (Buxari 1521; Müslim 1350) aydın göstərir ki, Həcc pozğunluq (rəfəs), günah (füsuq) və mübahisə ilə pozulur. Səbir, yumşaqlıq və digər hacılara kömək ibadətin bir hissəsidir.",
      "Telefonların və boş söhbətlərin Ərəfəyə və məscidə hakim olmasına imkan vermə. Təvafda başqalarına yol ver; Qara Daşa tərəf itələmə. Qəbul olunmuş Həcc Cənnətin yoldaşıdır — bütün səfər boyu gözəl xarakter üçün çalış.",
    ],
    hadith: [
      {
        excerpt:
          "Kim Allah üçün həcc edər, cinsi əlaqəyə girməz və günah işləməzsə, anadan olduğu gündəki kimi qayıdar.",
      },
    ],
    actions: ["Hər gün üçün niyyət qoy: izdihamdan üstün bir yaxşılıq əməli və bir səmimi dua."],
  },
  {
    title: "Viza və qeydiyyat",
    summary: "Rəsmi kanallardan istifadə et — Nusuk və öz ölkənin Həcc idarəsi.",
    body: [
      "Nusuk (nusuk.sa) Səudiyyə Ərəbistanının Həcc və Ümrə üçün rəsmi platformasıdır — vizalar, yaşayış yeri, nəqliyyat və qeydiyyatdan keçmiş paketlər. Qeyri-rəsmi vasitəçilər dələduzluğun ümumi bir mənbəyidir.",
      "Hər ölkə illik Həcc kvotası alır; hacıların əksəriyyəti öz milli Həcc idarəsi və ya lisenziyalı agent vasitəsilə müraciət edir. Ümrənin kvotası yoxdur və təsdiqlənmiş kanallar vasitəsilə ilin əksər hissəsində təşkil oluna bilər.",
    ],
    actions: [
      "Mövsüm açıldıqda tez müraciət et.",
      "Yalnız Nusukda sadalanan agentliklər və ya öz milli idarən vasitəsilə rezerv et.",
      "Pul köçürmədən əvvəl ödəniş kanallarını yoxla.",
    ],
    disclaimer: "Giriş qaydaları və platformalar dəyişir; həmişə rəsmi saytları yoxla.",
  },
  {
    title: "Nə götürmək lazımdır",
    summary: "Ehram, qoxusuz gigiyena vasitələri, sənədlər və gəzinti rahatlığı.",
    body: [
      "Kişilər: ən azı iki dəst tikilməmiş ehram geyimi və sənədlər üçün kəmər. Qadınlar: rahat təvazökar geyim. Asanlıqla geyilə bilən açıq sandallar; kiçik bel çantası və su şüşəsi.",
      "Qoxusuz sabun və günəş kremi götür — ehramda ətir qadağandır. Pasportu, viza çapını, peyvənd qeydlərini və təcili əlaqə nömrələrini nazik bir çantada saxla. Portativ zaryad batareyası və yerli SIM və ya eSIM izdihamda köməkçidir.",
    ],
    actions: [
      "Siyahı: ehram ×2, sandal, qoxusuz gigiyena vasitələri, sənəd çantası, dərman, portativ batareya.",
      "Sızıltı yamalarını götür — hacılar uzaq məsafələr gedir.",
    ],
  },
  {
    title: "Müqəddəs yerlərə ümumi baxış",
    summary: "Məkkə, Mədinə, Mina, Ərəfə və Müzdəlifə — praktik qeydlər.",
    body: [
      "Məsçidül-Həram Kəbəni əhatə edir — təvaf və səy yeri; böyük izdiham gözlə. Mədinədəki Məsçidün-Nəbəvi Həccin özünün bir hissəsi deyil, ancaq hacıların əksəriyyəti ziyarət edir; Rövzəyə giriş rəsmi tətbiqlər vasitəsilə vaxta bölünür.",
      "Mina 8-in və 11–13 Zilhiccənin gecələri üçün çadır şəhərdir. Ərəfə açıq bir düzənlikdir — 9-da mayelənmə və kölgə vacibdir. Müzdəlifə hacıların açıq səma altında istirahət edib kiçik daşlar topladığı yerdir — imkanlar qəsdən minimaldır.",
    ],
    actions: ["Səfərdən əvvəl Mina–Ərəfə–Müzdəlifənin sadə xəritəsini öyrən."],
  },
  {
    title: "Rəsmi mənbələr",
    summary: "Nusuk, öz milli idarən və Visit Saudi.",
    body: [
      "Vizalar, paketlər, Rövzə icazələri və izdiham göstərişi üçün Nusukdan başla. Kvota və sağlamlıq qaydaları üçün öz ölkənin Həcc nazirliyindən istifadə et. Visit Saudi ümumi giriş və səyahət tövsiyələri nəşr edir.",
      "Bir təklif adi olmayan qədər ucuz görünürsə və ya bir vasitəçi rəsmi kanallardan kənarda ödəniş tələb edirsə, ödəməzdən əvvəl birbaşa nazirlik portalı ilə təsdiqlə.",
    ],
    actions: [
      "Nusuk.sa və öz ölkənin Həcc idarəsinin saytını əlfəcinlə.",
      "Qrup rəhbərindən təcili əlaqə nömrələrini saxla.",
    ],
    disclaimer: "Praktik bələdçi, rəsmi Həcc/Ümrə təchizatçının əvəzi deyildir.",
  },
];

export const HAJJ_CHECKLIST_AZ: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Həcc üçün ehrama gir",
    hint: "Həcc üçün niyyət et və ehrama gir (tamattö üçün Məkkədən); təlbiyəni yenilə.",
    day: "8 Zilhiccə",
  },
  {
    title: "Minaya səfər et",
    hint: "Minada Zöhrdən Sübhə qədər hər birini öz vaxtında qısaldılmış şəkildə qıl.",
    location: "Mina",
    day: "8 Zilhiccə",
  },
  {
    title: "Ərəfədə dayan",
    hint: "Günortadan sonra gün batana qədər dua və zikr ilə Ərəfə daxilində qal.",
    location: "Ərəfə",
    day: "9 Zilhiccə",
  },
  {
    title: "Zöhr və Əsri birləşdir",
    hint: "Zöhr və Əsri Zöhr vaxtında birlikdə və qısaldılmış qıl, sonra duaya diqqət et.",
    location: "Ərəfə",
    day: "9 Zilhiccə",
  },
  {
    title: "Müzdəlifəyə keç",
    hint: "Gün batdıqdan sonra Məğrib və İşanı birləşdir, istirahət et, kiçik daşlar topla.",
    location: "Müzdəlifə",
    day: "9 Zilhiccə",
  },
  {
    title: "Cəmrətul-Əqəbəyə daş at",
    hint: "Böyük dirəyə hər atışda təkbir deyərək yeddi daş at.",
    location: "Mina",
    day: "10 Zilhiccə",
  },
  {
    title: "Qurban ver",
    hint: "Təməttö' və qiran üçün tələb olunur — kəs və ya etibarlı agentlik vasitəsilə təşkil et.",
    day: "10 Zilhiccə",
  },
  {
    title: "Həlq və ya təqsir",
    hint: "Kişilər qırxdırsın və ya qısaltsın; qadınlar barmaq ucu qədər qısaltsın (ilk azadlıq).",
    day: "10 Zilhiccə",
  },
  {
    title: "Təvafi-İfadə",
    hint: "Təməttö' üçün Təvafi-İfadə və səy et — Həccin bir rükni.",
    location: "Məsçidül-Həram",
    day: "10 Zilhiccə",
  },
  {
    title: "Minada gecələ",
    hint: "11, 12-nin (və tezliklə çıxmırsansa 13-ün) gecələrini Minada keçir.",
    location: "Mina",
    day: "11–13 Zilhiccə",
  },
  {
    title: "Üç Cəmərata daş at",
    hint: "Hər gün Zöhrdən sonra kiçik, orta, sonra böyüyə — hər birinə yeddi daş at.",
    location: "Mina",
    day: "11–13 Zilhiccə",
  },
  {
    title: "Vida təvafı",
    hint: "Məkkədən çıxmadan əvvəl Təvafi-Vida et (heyzli qadınlar azaddır).",
    location: "Məsçidül-Həram",
    day: "Ayrılış",
  },
];

export const UMRAH_CHECKLIST_AZ: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Ehrama gir",
    hint: "Miqatda və ya ondan əvvəl: qüsl, ehram geyimi, Ümrə niyyəti, təlbiyə.",
    location: "Miqat",
  },
  { title: "Təlbiyəni oxu", hint: "Təvafa başlayana qədər Ləbbəyk... -i tez-tez təkrarla." },
  {
    title: "Kəbənin təvafı",
    hint: "Qara Daşdan saat əqrəbinin əksinə yeddi dövrə; kişilər: rəml və idtiba'.",
    location: "Məsçidül-Həram",
  },
  {
    title: "İki rükət namaz qıl",
    hint: "Mümkünsə Məqami-İbrahimin arxasında, sonra Zəmzəm iç.",
    location: "Məsçidül-Həram",
  },
  {
    title: "Səfa və Mərvə arasında səy",
    hint: "Səfadan başlayaraq yeddi məsafə; kişilər yaşıl işarələr arasında yüngül qaçır.",
    location: "Məsçidül-Həram",
  },
  {
    title: "Həlq və ya təqsir",
    hint: "Kişilər qırxdırsın və ya qısaltsın; qadınlar barmaq ucu qədər qısaltsın — Ümrə tamamlanır.",
  },
];
