import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Azerbaijani translation overlay for the Learn ruqyah guide. Mirrors the order of
// RUQYAH_TOPICS in ../ruqyah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const RUQYAH_TOPICS_AZ: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Ruqyə nədir?",
    summary: "Şəfa üçün Quran, Allahın adları, ya da peyğəmbər dualarının oxunması.",
    body: [
      "Ruqyə — öz üzərinə və ya başqa bir insanın üzərinə Quran, Allahın adlarını və sifətlərini, yaxud səhih peyğəmbər dualarını oxumaq — çox vaxt yüngül nəfəs üfürməklə — yalnız Allahdan şəfa və ya qorunma diləməkdir. Bu, İslamdan əvvəl ümumi ərəb adəti kimi mövcud idi və Peyğəmbərdən ﷺ bunun icazəli olub-olmadığı birbaşa soruşulmuşdu.",
      "Auf ibn Malik rəvayət edir ki, səhabələr dedilər: 'Biz cahiliyyə dövründə ruqyə edirdik; bu barədə fikrin nədir?' Peyğəmbər ﷺ cavab verdi: 'Ruqyənizi mənə göstərin — ruqyədə şirk olmadıqca heç bir zərər yoxdur' (Səhih Müslim 2200). Bu tək hədis bu bələdçidəki hər şeyin əsasıdır: ruqyənin özü icazəlidir; əsas olan onun məzmunudur.",
    ],
    hadith: [
      {
        excerpt:
          "Biz cahiliyyə dövründə ruqyə edirdik və dedik: Ey Allahın Elçisi, bu barədə fikrin nədir? O dedi: Ruqyənizi mənə göstərin — ruqyədə şirk olmadıqca heç bir zərər yoxdur.",
      },
    ],
  },
  {
    title: "Halal və haram ruqyə",
    summary: "Quran, Allahın adları, aydın dua — heç vaxt şirk və ya qeyb.",
    body: [
      "Qanuni ruqyə alimlərin hədisdən çıxardığı şərtlərə əsaslanır: o, Quranı, Allahın adlarını və sifətlərini, yaxud səhih bir peyğəmbər duasını istifadə edir; mənası anlaşılan bir dildədir (naməlum hərflər və ya simvollar deyil); və oxuyan şəxs və müalicə olunan şəxs hər ikisi ruqyənin özündə heç bir güc olmadığına inanır — şəfa yalnız Allahdandır, sözlər isə Onun icazə verdiyi bir vasitədir.",
      "Peyğəmbər ﷺ bunu şəxsən nümayiş etdirdi: Aişə rəvayət edir ki, hər dəfə xəstələndikdə o, Muavvizatı (son iki surəni) öz üzərinə oxuyub üfürərdi, son xəstəliyi ağırlaşdıqda isə Aişə onun üçün eyni şeyi edərdi, bərəkət umaraq onun bədənini öz əli ilə silərdi (Buxari 5016). Bu, ruqyənin ən aydın, ən səhih formasıdır.",
      "Ruqyə şirkə keçdikdə haram olur: Allahdan başqasına müraciət etmək, cinlərdən kömək istəmək, mənası aydın olmayan naməlum sözlər və ya simvollardan istifadə etmək, tilsim və ya amulet asmaq, yaxud ruqyə edənin qeyb elmi olduğunu və ya təminatlı şəfa verdiyini iddia etmək. O, heç vaxt beş vaxt namazın və ya lazımi tibbi müalicə axtarmağın əvəzi deyil — o, hər ikisini tamamlayır, əvəz etmir.",
    ],
    hadith: [
      {
        excerpt:
          "Allahın Elçisi ﷺ hər dəfə xəstələndikdə Muavvizatı oxuyub sonra bədəninə üfürərdi. O ağır xəstələndikdə mən onları oxuyub bərəkət umaraq bədənini onun əli ilə silərdim.",
      },
    ],
    disclaimer:
      "Ruqyə mənəvi əməldir, tibbi müalicə deyil. Fiziki və ya psixi xəstəlik üçün ixtisaslı həkimə müraciəti əvəz etmir, beş vaxt namazı da əvəz etmir.",
  },
  {
    title: "Ruqyə kimi Fatihə surəsi",
    summary: "Açılış surəsi — açıq şəkildə etibarlı ruqyə kimi təsdiqlənib.",
    body: [
      "Əbu Səid əl-Xudri rəvayət edir ki, bir qəbilə başçısını ilan sancdıqda, Peyğəmbərin ﷺ səhabələrindən biri onun üzərinə Fatihə surəsini oxudu və o sağaldı. Səhabələr sonra Peyğəmbərdən ﷺ bunun icazəli olub-olmadığını soruşduqda, o, təbəssüm edib dedi: 'Sən haradan bilirsən ki, bu ruqyədir?' — Fatihənin, səmimi iman və anlayışla oxunduqda, özü etibarlı ruqyə olduğunu təsdiqləyərək (Buxari 5736).",
      "Bu tətbiqin Quran oxuyucusu Fatihənin tam mətnini və tərcüməsini daşıyır; bu bələdçi onu burada təkrar çap etmədən sadəcə ruqyə mənbəyi kimi göstərir.",
    ],
    quran: [{ excerpt: "Mərhəmətli, Rəhmli Allahın adı ilə..." }],
    hadith: [
      {
        excerpt:
          "Onlardan biri Fatihə surəsini oxumağa başladı... xəstə sağaldı. Peyğəmbərdən ﷺ soruşduqda, o, təbəssüm edib dedi: Fatihənin ruqyə olduğunu haradan bilirsiniz?",
      },
    ],
    appLinks: [{ label: "Fatihəni oxu" }],
  },
  {
    title: "Ayət əl-Kursi (2:255)",
    summary: "Taxt ayəsi — gecə Allahın qorunması üçün oxunur.",
    body: [
      "Ayət əl-Kursi (Quran 2:255) Allahın mütləq hakimiyyətini təsvir edir və xüsusilə yatmazdan əvvəl qorunma üçün geniş oxunur. Əbu Hüreyrə rəvayət edir ki, gözlədiyi zəkatdan oğurluq edən gecə qonağı ona dedi: 'Yatağına girəndə Ayət əl-Kursini oxu — Allahdan bir qoruyucu səninlə qalacaq, və heç bir şeytan sənə səhərə kimi yaxınlaşmayacaq.' Peyğəmbər ﷺ bunu eşitdikdə təsdiqlədi: 'O sənə doğru dedi, halbuki o yalançıdır — bu bir şeytan idi' (Buxari 5010).",
      "Bu bələdçidəki digər ayələr kimi, burada yalnız qısa bir hissə verilib; tam ayəni və tərcüməsini tətbiqin Quran oxuyucusunda oxuyun.",
    ],
    quran: [{ excerpt: "Allah — Ondan başqa ilah yoxdur, Əbədi Yaşayan, Varlığı Qoruyan." }],
    hadith: [
      {
        excerpt:
          "Yatağına girəndə Ayət əl-Kursini oxu — Allahdan bir qoruyucu bütün gecə səni qoruyacaq, və heç bir şeytan sənə səhərə kimi yaxınlaşmayacaq.",
      },
    ],
    appLinks: [{ label: "Ayət əl-Kursini oxu" }],
  },
  {
    title: "İxlas, Fələq və Nas (112–114)",
    summary: "Üç yekun surə — Peyğəmbərin ﷺ gecə ruqyəsi.",
    body: [
      "Aişə Peyğəmbərin ﷺ gecə rejimini təsvir etdi: hər gecə yatmazdan əvvəl o, ovuçlarını birləşdirər, İxlas surəsini, Fələq surəsini, və Nas surəsini oxuyar, ovuçlarına üfürər, və onları bədəninə sürtərdi — başdan və üzdən başlayaraq — bunu üç dəfə təkrarlayardı (Buxari 5017). Bu üç surə (İxlas Allahın vahidliyini təsdiqləyir, iki Muavvizat isə şərdən sığınacaq axtarır) həm də onun xəstəlik zamanı öz üzərinə oxuduğu şeylər idi (Buxari 5016).",
      "Birlikdə onlar mövcud ən sadə və ən səhih gündəlik ruqyə rejimlərindən birini təşkil edir — əzbərləmək üçün kifayət qədər qısadır, və Sünnədə birbaşa təsdiqlənib.",
    ],
    quran: [
      { excerpt: "De: O, Allahdır, Bir olandır." },
      { excerpt: "De: Sübh Rəbbinə sığınıram." },
      { excerpt: "De: İnsanların Rəbbinə sığınıram." },
    ],
    hadith: [
      {
        excerpt:
          "Peyğəmbər ﷺ yatağına girəndə ovuçlarını birləşdirər və İxlas, Fələq və Nas surələrini oxuduqdan sonra onlara üfürərdi, sonra əlləri ilə çata bildiyi bədən hissələrini sürtərdi, başdan və üzdən başlayaraq. O, bunu üç dəfə edərdi.",
      },
    ],
    actions: [
      "İxlas, Fələq, və Nası əzbərləyin.",
      "Peyğəmbərin ﷺ etdiyi kimi, hər gecə yatmazdan əvvəl onları oxuyun.",
    ],
    appLinks: [{ label: "Üç surəni oxu" }],
  },
  {
    title: "Gündəlik qorunma: səhər və axşam zikrləri",
    summary: "Qorunma üçün ruqyənin davamlı, gündəlik forması.",
    body: [
      "Müəyyən bir xəstəlik üçün ruqyədən əlavə, Peyğəmbər ﷺ davamlı mənəvi qorunma kimi işləyən səhər və axşam zikrləri (adhkar) toplusunu öyrətdi — onların çoxu, digər səhih dualarla yanaşı bu bələdçidə qeyd olunan eyni ayələrdir (Ayət əl-Kursi, üç yekun surə). Nəsə səhv gedən kimi ancaq ruqyəyə əl atmaq əvəzinə onları davamlı oxumaq, hər gün Allahın qorunmasını axtarmağın Sünnə yoludur.",
      "Bu tətbiqin zikr kitabxanası səhər və axşam zikrlərinin tam, mənbəli toplusunu bir yerdə saxlayır, oxumaq və ya gündəlik izləmək üçün hazırdır.",
    ],
    actions: [
      "Sübh namazından sonra səhər zikrlərini oxuyun.",
      "Axşam/gün batımından əvvəl axşam zikrlərini oxuyun.",
    ],
    appLinks: [{ label: "Səhər və axşam zikrləri" }],
  },
  {
    title: "Falçılardan və kahinlərdən çəkinin",
    summary: "Allahdan başqa hər kəsdən qeyb axtarmaq ciddi bir xəbərdarlıqdır.",
    body: [
      "İslam səhih ruqyə ilə falçılara, kahinlərə, ulduzbaxanlara, ya da qeybi bildiyini və ya qeyri-İslami vasitələrlə mənəvi bəlanı aradan qaldırdığını iddia edən hər kəsə müraciət etmək arasında sərt bir sərhəd çəkir. Peyğəmbər ﷺ xəbərdarlıq etdi: 'Kim bir falçıya (ərraf) gedib ondan nə isə soruşsa, onun namazı qırx gecə qəbul olunmaz' (Səhih Müslim 2230) — sadəcə maraq üzündən belə iddiaları sınamağa qarşı da sərt bir xəbərdarlıq.",
      "Əgər bir insan həmçinin falçının qeyb haqqında iddialarına inanırsa, alimlər bunu küfr məsələsi hesab edir, çünki qeybi yalnız Allah bilir (Quran 27:65). İnsanı belə bir şəxsi düşünməyə vadar edən çətinlik nə olursa olsun, bu bələdçinin öyrətdiyinə görə düzgün cavab həmişə səhih ruqyəyə, duaya, və etibarlı tibbi və ya elmi köməyə üz tutmaqdır — heç vaxt gizli bilik iddia edənlərə deyil.",
    ],
    hadith: [
      {
        excerpt:
          "Kim bir falçıya (ərraf) gedib ondan nə isə soruşsa, onun namazı qırx gecə qəbul olunmaz.",
      },
    ],
    actions: [
      "Heç vaxt falçılara, ulduzbaxanlara, və ya qeybi bildiyini iddia edənlərə müraciət etməyin.",
    ],
  },
  {
    title: "Təvəkkül — yalnız Allaha güvənmək",
    summary: "Ruqyə bir vasitədir; şəfa və nəticə Allaha aiddir.",
    body: [
      "Bu bələdçidəki son və ən vacib xatırlatma təvəkküldür: Onun verdiyi icazəli vasitələrdən istifadə edərkən Allaha səmimi güvənmək. Ruqyə oxumaq, tibbi yardım axtarmaq, və başqalarından sənin üçün dua etməyi istəmək — hamısı qanuni vasitələrdir — amma qəlbin etibarı yalnız Allaha qalmalıdır, oxunan sözlərə və ya onları oxuyan şəxsə deyil. Bu, bu bələdçinin ilk hədisindəki şərti tam olaraq əks etdirir: 'Ruqyədə şirk olmadıqca heç bir zərər yoxdur' (Səhih Müslim 2200).",
      "Bu bələdçi internetdə geniş yayılmış xalq 'protokollarını' və simptom siyahılarını qəsdən buraxdı — bunların heç birinin Quranda və ya səhih Sünnədə güclü bir əsası yoxdur, və onlara güvənmək bir insanın etibarını sakitcə Allahdan bir ritual və ya təxmin siyahısına doğru sürüşdürə bilər. Mətnlə əsaslandırılana sadiq qalın, qalanını Allahın hökmünə qoyun.",
    ],
    hadith: [{ excerpt: "Ruqyədə şirk olmadıqca heç bir zərər yoxdur." }],
    disclaimer:
      "Bu, Qurandan və səhih hədisdən əsas sünni təlimini ümumiləşdirən ümumi təhsil məzmunudur. Bu, fətva deyil, tibbi və ya psixoloji müalicə deyil. Ciddi və ya davamlı bəla üçün, ixtisaslı yerli alim və müvafiq tibb mütəxəssisi ilə məsləhətləşin.",
  },
];
