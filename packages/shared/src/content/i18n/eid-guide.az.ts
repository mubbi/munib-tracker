import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Azerbaijani translation overlay for the Learn Eid guide. Mirrors the order of
// EID_GUIDE_TOPICS in ../eid-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const EID_GUIDE_TOPICS_AZ: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Ramazan bayramı — orucu açma bayramı",
    summary: "Şəvvalın ilk günü, Ramazan orucunun sona çatmasının nişanəsi.",
    body: [
      "Ramazan bayramı Şəvvalın 1-ci günü, Ramazandan dərhal sonra qeyd olunur və bir ay boyu oruc tutmaq və ibadət etmək nəsib olmasına görə sevinc və şükür günüdür. Quran orucun sona çatmasını birbaşa zikr və şükürlə bağlayır: '...sayı tamamlamağınız və sizi doğru yola yönəltdiyinə görə Allahı təkbir etməniz və şükür etməniz üçündür' (Bəqərə, 2:185).",
      "Bu gün oruc tutmaq sadəcə bəyənilməmir, açıq şəkildə qadağandır — Peyğəmbər ﷺ Qurban bayramı ilə birlikdə bu günü müsəlmanların oruc tutmaq əvəzinə yemək yeməyə əmr olunduğu iki gündən biri kimi qeyd etmişdir (Buxari 1990). Gün fitr zəkatı və bayram namazı ilə başlayır, qohum-əqrəba ziyarəti, xoş arzuların mübadiləsi və islami çərçivədə ümumi şənliklə davam edir.",
    ],
    quran: [
      {
        excerpt:
          "...sayı tamamlamağınız və sizi doğru yola yönəltdiyinə görə Allahı təkbir etməniz və şükür etməniz üçündür.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Bunlar Allahın Elçisinin ﷺ oruc tutmağı qadağan etdiyi iki gündür: Ramazan orucunuzu açdığınız gün və qurbanınızdan yediyiniz gün.",
      },
    ],
  },
  {
    title: "Qurban bayramı — fədakarlıq bayramı",
    summary: "Zülhiccənin 10-cu günü, İbrahimin qurbanının xatirəsi.",
    body: [
      "Qurban bayramı Zülhiccənin 10-cu günündə, Həcc zamanı Qurban kəsmə günündə qeyd olunur və İbrahimin Allaha itaət edərək oğlunu qurban vermək istəyini, və Allahın onu böyük bir qurbanla əvəz etməsi mərhəmətini xatırladır (Quran, 37:102–107). Çoxlu alimin fikrincə, bu, iki bayramın böyüyüdür və hacılar üçün həccin tamamlanması ilə üst-üstə düşür.",
      "Ramazan bayramı kimi, bu gündə də oruc tutmaq qadağandır (Buxari 1990). Onun əsas əlavə ibadəti qurbandır (udhiyyə), buna qadir olanlar tərəfindən İbrahimin təslimiyyətinin xatirəsinə, ibadət və sədəqəni birləşdirən bir əməl kimi təqdim olunur.",
    ],
    quran: [
      {
        excerpt:
          "Uşaq onunla birlikdə yeriyib-gəzəcək yaşa çatdıqda, [İbrahim] dedi: Oğlum! Yuxuda gördüm ki, səni qurban kəsirəm... Biz onu böyük bir qurbanla əvəz etdik.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Bunlar Allahın Elçisinin ﷺ oruc tutmağı qadağan etdiyi iki gündür: Ramazan orucunuzu açdığınız gün və qurbanınızdan yediyiniz gün.",
      },
    ],
  },
  {
    title: "Bayram namazı necə qılınır",
    summary: "Əzan və qamətsiz, əlavə təkbirlərlə iki rükət.",
    body: [
      "Bayram namazı, əvvəlcədən əzan və qamət olmadan camaatla qılınan iki rükətdir — Cabir ibn Abdullah və İbn Abbas hər ikisi Peyğəmbər ﷺ dövründə hər iki bayram üçün namaza çağırış edilmədiyini təsdiqləmişdir (Səhih Müslim 886). Namazdan sonra xütbə oxunur, xütbənin əvvəl olduğu Cümə namazından fərqli olaraq.",
      "Hər rükətdə qiraətdən əvvəl, namazın adi təkbirlərinə əlavə olaraq əlavə təkbirlər ('Allahu Əkbər' demək) əlavə edilir. Aişə rəvayət edir ki, Peyğəmbər ﷺ hər iki bayramda birinci rükətdə yeddi, ikinci rükətdə beş dəfə təkbir demişdir (Əbu Davud 1149), bu say Abdullah ibn Amrdan da rəvayət olunmuşdur (Əbu Davud 1151).",
    ],
    hadith: [
      {
        excerpt:
          "Ramazan bayramı günü imam çıxdıqda əzan yox idi, çıxdıqdan sonra da yox idi; həmin gün qamət, çağırış və ya buna bənzər bir şey də yox idi.",
      },
      {
        excerpt:
          "Allahın Elçisi ﷺ oruc açma günündə və qurban günündə birinci rükətdə yeddi, ikinci rükətdə beş dəfə təkbir deyərdi.",
      },
    ],
    madhhabNote:
      "Məzhəblər əlavə təkbirlərin dəqiq sayı barədə fərqli fikirdədir. Şafii, Maliki və Hənbəli fəqihlər yeddi-beş rəvayətinə əməl edirlər (Əbu Davud 1149/1151) — Maliki və Hənbəlilər açılış təkbirini yeddiyə daxil edərək altı-beş deyirlər. Hənəfi məzhəbi isə birinci rükətdə qiraətdən əvvəl 3 və ikinci rükətdə rükudan əvvəl 3 əlavə təkbir (cəmi 6) görüşündədir — bu, ayrıca sübut olunmuş mərfu hədisi olmayan Kufə fəqihlərinin bir fikridir; camaatınızın imamının təkbir sayına əməl edin.",
    actions: [
      "Vaxtında gəlin — namazın başladığını bildirən əzan və ya qamət yoxdur.",
      "İmamınızın təkbir sayına əməl edin; hər iki məzhəbin əməli düzgündür.",
      "Namazdan sonra xütbəyə qalın.",
    ],
  },
  {
    title: "Bayram günündəki sünnətlər",
    summary: "Qusl, ən yaxşı geyim, namazdan əvvəl/sonra yemək, və iki fərqli yol.",
    body: [
      "Bayram namazından əvvəl və sonra bir neçə kiçik sünnət tövsiyə olunur. Ramazan bayramında Peyğəmbər ﷺ tək sayda bir neçə xurma yeməmiş namaza çıxmazdı (Buxari 953) — Qurban bayramının əksinə olaraq, orada namazdan qayıtdıqdan sonra qurbandan yeməyi gözləmək tövsiyə olunur.",
      "Bu münasibətlə qusl almaq və ən yaxşı (təmiz, həyalı) geyimi geyinmək sünnətdir, hər iki bayramda səhabələrin ümumi əməlinə əməl edərək, baxmayaraq ki, bu konkret rəvayət buradakı digərlərindən daha az möhkəm sübut olunmuşdur, və tək bir səhih dərəcəli hədisdən daha çox geniş yayılmış bir əməldir.",
      "Xüsusi bir sünnət evə getdiyi yoldan fərqli bir yolla qayıtmaqdır. Cabir ibn Abdullah rəvayət edir: 'Bayram günü Peyğəmbər ﷺ (bayram namazını qıldırdıqdan sonra) getdiyi yoldan fərqli bir yolla qayıdardı' (Buxari 986) — bu, adətən onun ibadətinə şahid olan yerləri artırmaq və İslamın rəmzlərini daha geniş göstərmək kimi izah olunur.",
    ],
    hadith: [
      {
        excerpt:
          "Peyğəmbər ﷺ Ramazan bayramı günü tək sayda bir neçə xurma yeməmiş heç vaxt (namaza) çıxmazdı.",
      },
      {
        excerpt:
          "Bayram günü Peyğəmbər ﷺ (bayram namazını qıldırdıqdan sonra) getdiyi yoldan fərqli bir yolla qayıdardı.",
      },
    ],
    actions: [
      "Qusl alın və ən yaxşı həyalı geyiminizi geyinin.",
      "Ramazan bayramı namazından əvvəl tək sayda xurma yeyin; Qurban bayramı namazından sonraya qədər yeməyi gözləyin.",
      "Namaza getdiyiniz yoldan fərqli bir yolla qayıdın.",
    ],
  },
  {
    title: "Fitr zəkatı — əsaslar",
    summary: "Ramazan bayramı namazından əvvəl ödənilməli kiçik vacib sədəqə.",
    body: [
      "Fitr zəkatı (sədəqətül-fitr) sərvətə əsaslanan zəkatdan ayrı, daha kiçik bir sədəqədir, hər müsəlman üçün vacibdir — kiçik və ya böyük, kişi və ya qadın, azad və ya himayədə olan — və ailə başçısı onların adından ödəyir. İbn Ömər rəvayət edir ki, Peyğəmbər ﷺ hər müsəlman üçün bir sa' (təxminən 2–3 kq) xurma və ya arpa vacib etmişdir, bu, insanlar bayram namazına çıxmadan əvvəl ödənilməlidir (Buxari 1503).",
      "Onun məqsədi sünnətdə açıq şəkildə bildirilmişdir: 'oruc tutan şəxsi boş və pis sözlərdən təmizləmək, və yoxsullar üçün yemək' (Əbu Davud 1609). Bayram namazından əvvəl ödəmək bu xüsusi zəkatı yerinə yetirmiş sayılır; namazdan sonra ödəmək ümumi sədəqə sayılır, lakin vaxtla bağlı xüsusi mükafatı əldən verir.",
      "Bu gün əksər cəmiyyətlər xurma və ya arpa birbaşa paylamaq əvəzinə, dəyəri yerli valyutada hesablayır, yerli alimlərin və zəkat qurumlarının cari əsas ərzaq qiymətləri barədə rəhbərliyinə əməl edərək — bu praktik bir yüngülləşdirmədir, əsas vəzifədə dəyişiklik deyil.",
    ],
    hadith: [
      {
        excerpt:
          "Allahın Elçisi ﷺ hər müsəlman üçün, kölə və ya azad, kişi və ya qadın, kiçik və ya böyük, bir Sa' xurma və ya bir Sa' arpanın Fitr zəkatı kimi ödənilməsini vacib etdi və insanlar bayram namazına çıxmadan əvvəl ödənilməsini əmr etdi.",
      },
      {
        excerpt:
          "Allahın Elçisi ﷺ Fitr zəkatını oruc tutan şəxsi boş və pis sözlərdən təmizləmək, və yoxsullar üçün yemək kimi vacib etdi. Kim onu namazdan əvvəl ödəsə, bu qəbul edilmiş zəkatdır; kim namazdan sonra ödəsə, bu (adi) sədəqədir.",
      },
    ],
    actions: [
      "Özünüz və himayənizdə olanlar üçün Fitr zəkatını hesablayıb ayırın.",
      "Mümkünsə Ramazan bayramı namazına getməzdən əvvəl ödəyin.",
    ],
    appLinks: [{ label: "Zəkat kalkulyatoru" }],
  },
  {
    title: "Qurban (udhiyyə) — əsaslar",
    summary: "Qurban bayramında kəsilən, yoxsullarla bölüşülən heyvan qurbanı.",
    body: [
      "Qurban, İbrahimin qurbanının xatirəsinə Qurban bayramı və sonrakı Təşriq günlərində uyğun şərtləri (yaş və sağlamlıq) daşıyan bir heyvanın (qoyun, keçi, mal-qara və ya dəvə) kəsilməsidir. Ənəs rəvayət edir ki, Peyğəmbər ﷺ öz əlləri ilə qara-ağ rəngli iki qoç kəsmiş, üzərlərində Allahın adını çəkib təkbir demişdir (Buxari 5558) — bu, mümkün olduqda kəsimi özü etməyin daha fəzilətli əməl olduğunu, lakin başqasına vəkalət verməyin də düzgün olduğunu təsdiq edir.",
      "Quran qurbanı birbaşa ətinin bölüşdürülməsi ilə bağlayır: '...ondan yeyin və ehtiyacı olana və diləyənə yedirin' (Quran, 22:36). Ət ümumiyyətlə öz ailəsi, qohum-əqrəba və dostları, və yoxsullar arasında bölüşdürülür, beləliklə bu münasibət ibadət, comərdlik və şükrü birləşdirir.",
      "Kəsim bayram namazından sonra, əvvəl deyil, olmalıdır — vaxtından əvvəl kəsmiş bir səhabəyə Peyğəmbər ﷺ bunu təkrar etməsini söyləmişdir, çünki namazdan əvvəl təqdim olunan qurban udhiyyə sayılmır. Dəqiq kimin vacib olduğu, və dəqiq vaxt aralığı barədə qərarlar məzhəbə görə fərqlənir; vəziyyətiniz üçün ixtisaslı yerli alimlə məsləhətləşin.",
    ],
    quran: [
      {
        excerpt:
          "...sizin üçün onda xeyir var. Onları [qurban kəsmək üçün] düzülmüş halda ikən Allahın adını çəkin; yanları üstə [cansız] yıxıldıqda isə onlardan yeyin və ehtiyacı olana və diləyənə yedirin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Peyğəmbər ﷺ qara-ağ rəngli iki qoç kəsdi, mən onun ayağını onların yanlarına qoyub Allahın Adını çəkdiyini və təkbir dediyini gördüm. Sonra onları öz əlləri ilə kəsdi.",
      },
    ],
    actions: [
      "İmkanınız varsa və vacibdirsə, qurbanınızı Qurban bayramından əvvəl təşkil edin.",
      "Kəsimin namazdan sonra, əvvəl deyil, olmasına əmin olun.",
      "Əti öz ailəniz, qohum-dostlarınız və yoxsullar arasında bölüşdürün.",
    ],
    disclaimer:
      "Dəqiq kimə qurban vacib olduğu, və kəsim üçün dəqiq etibarlı vaxt aralığı, məzhəbə görə fərqlənən ətraflı fiqh məsələləridir. Bu ümumi təhsil məzmunudur, fətva deyil — vəziyyətiniz üçün ixtisaslı yerli alimlə məsləhətləşin.",
  },
];
