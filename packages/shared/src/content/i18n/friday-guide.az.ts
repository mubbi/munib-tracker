import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Azerbaijani translation overlay for the Learn Friday (Jumu'ah) guide. Mirrors the order of
// FRIDAY_GUIDE_TOPICS in ../friday-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const FRIDAY_GUIDE_TOPICS_AZ: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Cümənin fəzilətləri",
    summary: "Günəşin doğduğu ən yaxşı gün — Adəmin yaradılışı və iki cümə arasında bağışlanma.",
    body: [
      "Cümə (Yevm əl-Cümə) bu Ümmətin həftəlik toplantı günüdür. Əbu Hureyrə rəvayət edir ki, Allahın Elçisi ﷺ dedi: 'Günəşin doğduğu ən yaxşı gün Cümədir; bu gün Adəm yaradıldı, bu gün o, Cənnətə daxil edildi, bu gün oradan çıxarıldı və Qiyamət yalnız cümə günü qopacaq' (Səhih Müslim 854).",
      "Onun ibadəti həmçinin bağışlanma vədini daşıyır. Əbu Hureyrə rəvayət edir ki, Peyğəmbər ﷺ dedi: 'Kim cümə günü qüsl alar, sonra cümə namazına gələr, imam xütbə söyləyərkən qulaq asıb sükut edərsə, onun bu cümə ilə növbəti cümə arasındakı günahları, üstəlik üç gün də əlavə olunmaqla bağışlanar' (Səhih Müslim 857).",
      "Bu fəzilətlər tez hazırlaşmağa, diqqətlə qulaq asmağa və Cüməyə sadəcə istirahət günü kimi deyil, həftəlik mənəvi təzələnmə kimi yanaşmağa çağırışdır.",
    ],
    hadith: [
      {
        excerpt:
          "Günəşin doğduğu ən yaxşı gün Cümədir; bu gün Adəm yaradıldı, bu gün o, Cənnətə daxil edildi, bu gün oradan çıxarıldı və Qiyamət yalnız cümə günü qopacaq.",
      },
      {
        excerpt:
          "Kim cümə günü qüsl alar, sonra cümə namazına gələr, imam xütbə söyləyərkən qulaq asıb sükut edərsə, onun bu cümə ilə növbəti cümə arasındakı günahları, üstəlik üç gün də əlavə olunmaqla bağışlanar.",
      },
    ],
    actions: [
      "Cümə səhəri niyyət edin: qusl, ən yaxşı geyim və tez gəlmək.",
      "Xütbəni ibadət kimi qəbul edin — sükut və diqqət mükafatın bir hissəsidir.",
    ],
  },
  {
    title: "Cümə — həftəlik vacib əməl",
    summary:
      "Quranda əmr olunan icma cümə namazı, iştirak edənlər üçün Zöhr namazının yerini tutur.",
    body: [
      "Allah Cümə namazını adı ilə əmr edir: 'Ey iman gətirənlər! Cümə günü namaza çağırıldıqda Allahın zikrinə tələsin və alış-verişi tərk edin. Bilsəniz, bu sizin üçün daha xeyirlidir' (Quran, 62:9). Sonrakı ayələr isə namazdan sonra dağılıb Allahın lütfünü axtarmağa icazə verir (Quran, 62:10–11).",
      "Cümə iki hissəli xütbədən sonra imamın ardınca səsli qılınan iki rükətdən ibarətdir və iştirak edənlər üçün Zöhr namazının yerini tutur. Tariq ibn Şihab rəvayət edir ki, Peyğəmbər ﷺ dörd nəfər istisna olmaqla — kölə, qadın, uşaq və ya xəstə — hər müsəlman üçün icma cümə namazının vacib bir vəzifə olduğunu söyləmişdir (Sünən Əbu Davud 1067).",
      "İhmal ağır bir xəbərdarlıqdır: Əbu əl-Cad rəvayət edir ki, kim səhlənkarlıqdan üç cümə namazını tərk edərsə, Allah onun qəlbinə möhür qoyar (Sünən ən-Nəsai 1369). Xütbə zamanı boş danışıq mükafatı puça çıxarır — Əbu Hureyrə rəvayət edir ki, imam danışarkən yoldaşına 'Sus' desəniz, yanlış danışmış olarsınız (Səhih əl-Buxari 934).",
      "Cümədən sonra dörd rükət qılmaq tövsiyə olunur: Əbu Hureyrə rəvayət edir ki, Peyğəmbər ﷺ dedi: 'Sizdən biri cümə namazını qıldıqdan sonra, ardınca dörd rükət qılsın' (Səhih Müslim 881).",
    ],
    quran: [
      {
        excerpt:
          "Ey iman gətirənlər! Cümə günü namaza çağırıldıqda Allahın zikrinə tələsin və alış-verişi tərk edin. Bilsəniz, bu sizin üçün daha xeyirlidir. Namaz qılındıqdan sonra isə yer üzünə yayılın və Allahın lütfünü axtarın...",
      },
    ],
    hadith: [
      {
        excerpt:
          "İcma cümə namazı dörd nəfər istisna olmaqla hər müsəlman üçün vacib bir vəzifədir: kölə, qadın, uşaq və ya xəstə.",
      },
      {
        excerpt:
          "Kim səhlənkarlıqdan üç cümə namazını tərk edərsə, Allah onun qəlbinə möhür qoyar.",
      },
      {
        excerpt:
          "Cümə günü imam xütbə söyləyərkən yoldaşınıza 'Sus' desəniz, yanlış danışmış olarsınız (laghawta).",
      },
      {
        excerpt: "Sizdən biri cümə namazını qıldıqdan sonra, ardınca dörd rükət qılsın.",
      },
    ],
    actions: [
      "Xütbə başlamazdan əvvəl məscidə çatmaq üçün yolu planlaşdırın.",
      "Telefonları səssiz saxlayın və xütbə zamanı danışmaqdan çəkinin.",
      "Bacardıqda Cümədən sonra dörd rükət qılın.",
    ],
    appLinks: [{ label: "Salahı öyrənin — Cümə dərsi" }, { label: "İzləyicini aç" }],
    disclaimer:
      "Etibarlı bir Cümənin minimum iştirakçı sayı, qadınların və səyahətdə olanların iştirakının təşviq edilib-edilmədiyi, məzhəbdən və yerli adətdən asılı olaraq dəyişən təfsilatlı fiqh məsələlərdir. İştirak etməyən qadınlar, səyahətdə olanlar və xəstələr əvəzinə Zöhr namazı qılırlar. Bu təhsil məzmunudur, fətva deyil.",
  },
  {
    title: "Cüməyə hazırlıq",
    summary: "Ən böyük mükafat üçün qusl, təmiz geyim, ətir və tez gəlmək.",
    body: [
      "Hazırlıq Cümə sünnəsinin bir hissəsidir. Əbu Səid əl-Xudri rəvayət edir ki, Allahın Elçisi ﷺ dedi: 'Cümə günü qusl həddi-buluğa çatan hər kəs üçün vacibdir' (Səhih Müslim 846). Səhih əl-Buxaridə (877) paralel bir ifadə də cümə günü çimməyi həddi-buluğa çatanlarla əlaqələndirir.",
      "Qusldan əlavə, Peyğəmbər ﷺ ən yaxşı görünüşü təşviq etmişdir. Səlman əl-Farisi rəvayət edir ki, Peyğəmbər ﷺ dedi: 'Kim cümə günü çimər, bacardığı qədər təmizlənər, sonra yağını və ya ətrini istifadə edər, sonra çıxıb, iki nəfər arasına sıxışmadan öz yerində oturub imamı sona qədər dinləyər, sonra özünə əmr olunan namazı qılarsa — onun bu cümə ilə növbəti cümə arasındakı günahları bağışlanar' (Səhih əl-Buxari 883).",
      "Tez gəlmək mükafatı çoxaldır. Əbu Hureyrə rəvayət edir ki, kim ilk saatda gedərsə, bu, dəvə, sonra inək, sonra qoç, sonra toyuq, sonra yumurta sədəqə edən kimidir — imam çıxdıqda mələklər dəftərlərini bağlayıb xatırlatmaya qulaq asarlar (Səhih əl-Buxari 881).",
    ],
    hadith: [
      { excerpt: "Cümə günü qusl həddi-buluğa çatan hər kəs üçün vacibdir." },
      { excerpt: "Cümə günü çimmək həddi-buluğa çatan hər kişi müsəlman üçün vacibdir." },
      {
        excerpt:
          "Kim cümə günü çimər, bacardığı qədər təmizlənər, sonra yağını və ya ətrini istifadə edər, sonra çıxıb, iki nəfər arasına sıxışmadan öz yerində oturub imamı sona qədər dinləyər, sonra özünə əmr olunan namazı qılarsa — onun bu cümə ilə növbəti cümə arasındakı günahları bağışlanar.",
      },
      {
        excerpt:
          "Kim cümə günü çimər, sonra tez (məscidə) gedərsə, bu, dəvə qurban etmiş kimidir... sonra inək... sonra qoç... sonra toyuq... sonra yumurta. İmam çıxdıqda mələklər xatırlatmaya qulaq asmaq üçün gələrlər.",
      },
    ],
    actions: [
      "Cümə səhəri (və ya məscidə getməzdən əvvəl) qusl alın.",
      "Təmiz, həyalı ən yaxşı geyiminizi geyinin və bacardıqda yüngül ətir vurun.",
      "Tez çıxın — ən erkən gələnlər ən böyük mükafatı qazanır.",
    ],
    appLinks: [{ label: "Təmizlənməni öyrənin — Qusl" }],
    disclaimer:
      "Cümə qüslunun ciddi bir vəzifə, yoxsa güclü şəkildə tövsiyə olunan sünnə olması məzhəblər arasında klassik bir fərq nöqtəsidir. Hamısı onun böyük fəzilətinə razıdır; icmanızın etibarlı təcrübəsini izləyin.",
  },
  {
    title: "Cümə günü Kəhf surəsi",
    summary: "İki cümə arasında bir işıq və ilk on ayədə qorunma.",
    body: [
      "Cümə günü Kəhf surəsini (Quran 18) oxumaq sevimli həftəlik bir əməldir. Əbu Səid əl-Xudri rəvayət edir ki, Peyğəmbər ﷺ dedi: 'Kim cümə günü Kəhf surəsini oxursa, onun üçün iki cümə arasında bir işıq şölələnər.' Bu ifadə əl-Hakim və əl-Beyhəqi vasitəsilə rəvayət olunub və Şeyx əl-Albani tərəfindən səhih hesab edilib; bir çox icmalar bunu qəbul edilmiş bir Cümə sünnəsi kimi izləyir.",
      "Ayrıca, Kəhf surəsinin ilk on ayəsi Dəccalın fitnəsindən qoruyan bir qalxandır. Əbu Dərda rəvayət edir ki, Peyğəmbər ﷺ dedi: 'Kim Kəhf surəsinin əvvəlindən on ayə əzbərləsə, Dəccaldan qorunar' (Səhih Müslim 809).",
      "Cümə axşamından cümə axşamına (Məğribinə) qədər surəni oxumaq üçün vaxt tapın — bütün surəni bitirə bilməsəniz belə, açılış ayələrindən başlayın və bacardıqca davam edin.",
    ],
    quran: [
      {
        excerpt:
          "Həmd olsun Allaha ki, Öz qulu üzərinə bu Kitabı nazil etdi və onda heç bir əyrilik qoymadı... Yoxsa sən elə güman etdin ki, mağara və kitab sahibləri Bizim ayələrimiz arasında qəribə bir şeydir?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim cümə günü Kəhf surəsini oxursa, onun üçün iki cümə arasında bir işıq şölələnər. (əl-Albani tərəfindən səhih hesab edilib)",
      },
      { excerpt: "Kim Kəhf surəsinin əvvəlindən on ayə əzbərləsə, Dəccaldan qorunar." },
    ],
    actions: [
      "Cümə günü Kəhf surəsini açın və qəlb hüzuru ilə bacardığınızı oxuyun.",
      "Dəccaldan qorunmaq üçün ilk on ayəni əzbərləyin və ya təkrarlayın.",
    ],
    appLinks: [{ label: "Kəhf surəsini oxu" }],
    disclaimer:
      "'İki cümə arasında işıq' rəvayəti Altı Kitabda (Kutub as-Sittah) yoxdur; sonrakı təsdiqləmə əsasında geniş qəbul edilib. İlk on ayənin qorunması (Müslim 809) mübahisəsiz səhihdir.",
  },
  {
    title: "Cümə günü Peyğəmbərə ﷺ salavat",
    summary: "Həftənin ən yaxşı günündə Peyğəmbərə ﷺ salavatı artırın.",
    body: [
      "Cümə çoxlu salavat üçün xüsusi seçilib. Əvs ibn Əvs rəvayət edir ki, Peyğəmbər ﷺ dedi: 'Günlərinizin ən yaxşılarından biri Cümədir; ona görə də o gün mənə salavatınızı artırın, çünki salavatlarınız mənə təqdim ediləcək.' Dedilər: 'Ey Allahın Elçisi, sən çürüyəndən sonra salavatlarımız sənə necə təqdim ediləcək?' Dedi: 'Allah yerin peyğəmbərlərin bədənlərini yeməsini qadağan etmişdir' (Sünən Əbu Davud 1047).",
      "Hər hansı etibarlı salavat formulu sayılır — namazda öyrədilən durudlar, ya da Sünnədən daha uzun formalar. Əsas olan sabit bir say deyil, Cümə günündə bolluq və səmimiyyətdir.",
    ],
    hadith: [
      {
        excerpt:
          "Günlərinizin ən yaxşılarından biri Cümədir; ona görə də o gün mənə salavatınızı artırın, çünki salavatlarınız mənə təqdim ediləcək.",
      },
    ],
    actions: [
      "Cümə günü üçün şəxsi bir salavat hədəfi qoyun — hətta mötədil, sabit bir say olsa belə.",
      "Hazır bir formul istəyirsinizsə, tətbiqdəki durud toplusundan istifadə edin.",
    ],
    appLinks: [{ label: "Durudlar" }],
  },
  {
    title: "Qəbul saatı",
    summary: "Duanın rədd edilmədiyi Cümə saatı — xüsusilə İkindidən sonra axtarın.",
    body: [
      "Əbu Hureyrə rəvayət edir ki, Allahın Elçisi ﷺ Cüməni xatırladıb dedi: 'Cümədə bir saat var ki, heç bir müsəlman qul o saatda dayanıb Allahdan bir şey istəməz, məgər ki O, ona verər' — və əli ilə onun qısa olduğunu göstərdi (Səhih əl-Buxari 935; həmçinin Səhih Müslim 852).",
      "Alimlər bu saatın dəqiq nə vaxt olduğu barədə fərqli fikirdədirlər. Güclü bir rəyə görə, o, Cümənin son hissəsində İkindidən sonradır: Cabir ibn Abdullah rəvayət edir ki, Peyğəmbər ﷺ dedi: 'Cümə on iki saatdır və onda bir saat var ki, heç bir müsəlman qul Allahdan bir şey istəməz, məgər ki O, ona verər — onu İkindidən sonrakı son saatda axtarın' (Sünən Əbu Davud 1048).",
      "Hansı fikri izləsəniz də, Cüməni — xüsusilə günortadan sonranı — səmimi dua, istiğfar və salavatla doldurun, Allahın cavab vədinə güvənərək.",
    ],
    hadith: [
      {
        excerpt:
          "Cümədə bir saat var ki, heç bir müsəlman qul o saatda dayanıb Allahdan bir şey istəməz, məgər ki O, ona verər — və əli ilə onun qısa olduğunu göstərdi.",
      },
      {
        excerpt:
          "Cümədə bir saat var ki, heç bir müsəlman namaz qılıb Allahdan bir şey istədiyi halda tapılmaz, məgər ki O, ona verər.",
      },
      {
        excerpt:
          "Cümə on iki saatdır və onda bir saat var ki, heç bir müsəlman qul Allahdan bir şey istəməz, məgər ki O, ona verər — onu İkindidən sonrakı son saatda axtarın.",
      },
    ],
    actions: [
      "Cümə günü İkindidən sonra qısa bir dua siyahısı ilə oturun və hüzurla istəyin.",
      "Duayı salavatla birləşdirin — hər ikisi bu gündə xüsusi vurğulanır.",
    ],
    appLinks: [{ label: "Dua toplusu" }],
    disclaimer:
      "Qəbul olunan saatın dəqiq vaxtı elmi fərq mövzusudur (xütbə zamanı, İkindidən sonra və digər rəylər). Saatın özünün mövcudluğu Buxari və Müslimdə sabitdir.",
  },
];
