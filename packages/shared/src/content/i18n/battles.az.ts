// Azerbaijani translation overlay for the Learn Battles content. Mirrors the order of
// its English source in ../battles*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  BattlesFigure,
  BattlesGlossaryTerm,
  BattlesLessonCard,
  BattlesTimelineEvent,
  BattlesTopic,
  BattlesVerse,
} from "../../types/battles";
import type { DeepPartial } from "./localize";

export const BATTLES_TOPICS_AZ: DeepPartial<BattlesTopic>[] = [
  {
    title: "Giriş",
    summary: "Tarixi keçmişi, zülmü, hicrəti və döyüşə icazə verildiyi vaxt.",
    body: [
      "Məkkədə nazil olan ilk on üç il ərzində müsəlmanlara zülmə səbirlə dözmək əmr edilmişdi - döyüşməyə icazə verilməmişdir. Səhabələr özlərini müdafiə etmək istədikdə, cavab belə oldu: “Əllərinizi çəkin, namaz qılın və zəkat verin” (Qur'an, 4:77). İlk camaat zülmə silahlı üsyanla deyil, səbir, hicrət və dua ilə cavab verirdi.",
      "Mədinəyə hicrət (miladi 622 / hicri 1-ci il) icmanın prinsiplərini deyil, vəziyyətini dəyişdirdi. Yəsribdə müsəlmanlar Mədinə konstitusiyasına - şəhərin yəhudi qəbilələri ilə qarşılıqlı müdafiə və birgəyaşayışa dair yazılı əhd-peymanla bağlı məskunlaşmış cəmiyyətə çevrildilər. Peyğəmbər (s) indi hücuma məruz qala bilən və buna görə də özünü qanuni şəkildə müdafiə edə bilən bir dövlətin başçısı idi.",
      'Yalnız bundan sonra, illərlə zülmdən sonra, döyüş üçün ilk icazə nazil oldu və bunun açıqlanan səbəbi möminlərin “Rəbbimiz Allahdır” (Qur\'an 22:39-40) dediklərinə görə haqsızlığa uğramaları və yurdlarından qovulmaları idi. İcazə müdafiə və dini azadlığın qorunması üçün idi - eyni ayə "monastırların, kilsələrin, sinaqoqların və məscidlərin" təhlükəsizliyini belə döyüşlərin qoruduğu kimi adlandırır - fəth, zorla din dəyişdirmə və ya talan üçün deyil.',
      "Qur'an bu icazə ətrafında daimi bir həddi müəyyən etmişdir: “Sizinlə vuruşanlarla Allah yolunda vuruşun, lakin həddi aşmayın” (Bəqərə, 190). Mübarizə cəmiyyətə qarşı təcavüzlə bağlı idi və heç vaxt ədalətin sərhədlərini aşmamalıdır.",
      "Bu kampaniyalar tarixdir: onlar 7-ci əsrin xüsusi ərəb kontekstində qəbilə müharibəsi, pozulmuş müqavilələr və mühasirə şəraitində baş verib. Sülh, ədalət, mərhəmət və qonşuluq haqqında ümumi İslam təlimləri çərçivədir; bu döyüşlərin təfərrüatları həmin çərçivənin içində oxunmalıdır, ondan qoparılan şüarlara çevrilməməlidir.",
    ],
    quran: [
      {
        excerpt:
          "Haqsız yerə yurdlarından didərgin salınanlara, zülmə məruz qaldıqları üçün vuruşanlara – Allah onlara qələbə çalmağa qadirdir – ancaq: “Rəbbimiz Allahdır!” – demələrinə görə icazə verildi. Əgər Allah insanların bir qismini digərləri ilə dəf etməsəydi, monastırlar, kilsələr, sinaqoqlar və Allahın adı çox zikr olunan məscidlər, şübhəsiz ki, dağılardı.",
      },
      {
        excerpt:
          "Sizinlə vuruşanlarla Allah yolunda vuruşun, lakin həddi aşmayın. Həqiqətən, Allah həddi aşanları sevməz.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Niyə döyüşlər baş verdi",
    summary: "Təqib, müqavilənin pozulması və cəmiyyətin müdafiəsi - təcavüz deyil.",
    body: [
      "Bu döyüşlərin konteksti və səbəbi müsəlmanların müharibə iştahı deyil, davamlı düşmənçilik kampaniyası idi. Məkkədə Qüreyş zəiflərə işgəncə vermiş, bütün qəbiləni aclıqdan ölənə qədər boykot etmiş, mühacirlərin qoyub getdikləri mal-dövləti ələ keçirmiş, hətta Peyğəmbərə (s) sui-qəsd hazırlamışdı. Mədinəyə köçmək təhlükəni bitirmədi; onu köçürdü.",
      "Bədr (hicri 2) o həll olunmamış münaqişədən çıxdı. Mühacirlərdən alınan sərvətləri daşıyan böyük bir Qureyş karvanının Suriyadan qayıtması xəbəri gəldikdə, Peyğəmbər (s) onun qarşısını almaq üçün yola düşdü. Karvan qaçdı, lakin Qureyş artıq min nəfərə yaxın qoşun yığmışdı və hər halda gənc camaatı zorla əzmək qərarına gələrək irəliləmişdi. Bədr quyuları yanında gedən döyüş bunun nəticəsi idi.",
      "Mədinədə sağ qalmaq müqavilələrə bağlı idi və müqavilələr dəfələrlə pozulmuşdu. Şəhərin əhd-peymanı altında qarşılıqlı müdafiə əhdinə girmiş dəstələr əvəzinə düşmənlə sui-qəsd hazırladılar - Mədinəyə Xəndəkdə (hicri 5-ci il) mühasirəyə alan konfederasiyalar müsəlmanları tamamilə məhv etmək üçün dəqiq toplandılar.",
      "Müqavilə pozuntuları sona qədər həlledici olaraq qaldı. Məhz Qüreyşin müttəfiqləri müsəlmanların müttəfiqləri olan Bənu Xuzaya hücum edərək Hudeybiyyə müqaviləsini ləğv etdi və - diqqətəlayiq şəkildə - Məkkənin qırğına yox, demək olar ki, qansız açılmasına səbəb oldu.",
      "Bütün bunlara baxmayaraq, məqsədlər ardıcıl idi: həyatı və dini müdafiə etmək, zəifləri qorumaq və tövhidin təqib edilmədən həyata keçirilə biləcəyi qədər təhlükəsizlik yaratmaq. Məqsəd heç vaxt öz xatirinə sonsuz genişlənmə deyildi və mənbələrdə Peyğəmbərin (sallallahu aleyhi və səlləm) düşmən sülhə meyl etdiyi zaman atəşkəsə və müqaviləyə üstünlük verdiyi qeyd olunur.",
    ],
    hadith: [
      {
        excerpt:
          "Mənə insanlar Allahdan başqa ilah olmadığına və Muhəmmədin Allahın Rəsulu olduğuna şəhadət verənə, namaz qılıb zəkat verənə qədər onlarla döyüşmək əmr olundu. Əgər belə etsələr, onların canları və malları İslam haqqı istisna olmaqla, məndən qorunur və onların haqq-hesabı Allaha məxsusdur. — Klassik alimlər “xalqı” Ərəbistanın xüsusi bütpərəstləri kimi oxudular və xəbər onlara çatdıqdan sonra İslama qarşı müharibə apardılar; bu, dinc qeyri-müsəlmanlara hücum etmək və ya Qur'an 2:256-nın açıq şəkildə qadağan etdiyi inancı məcbur etmək üçün lisenziya deyil, düşmən döyüşçülər haqqında bəyanatdır.",
      },
    ],
    quran: [
      {
        excerpt: "Dində məcburiyyət yoxdur. Doğru yol xətadan ayrıldı.",
      },
    ],
    disclaimer:
      "Yuxarıdakı hədis tez-tez yerindən çıxarılaraq sitat gətirilir. Klassik alimlər bunu öz dövrünün xüsusi düşmənçilikləri çərçivəsində və Qur'anın dində məcburiyyəti qadağan etməsi (2:256) və döyüşün yalnız sizinlə vuruşanlara qarşı olması hüdudunun (2:190) yanında yerləşdirdilər.",
    appLinks: [{}],
  },
  {
    title: "İslamda döyüş etikası",
    summary:
      "Heç bir təcavüz, mülki şəxslərin ciddi müdafiəsi və insanpərvər davranış - Qur'an və Sünnə əsasında.",
    body: [
      "İslamın müharibə qanunu (siyar) birbaşa Qur'anın hüdudlarından və Peyğəmbərin tətbiqindən çıxdı. Onun əsası hər şeyi idarə edən vahid bir qaydadır: “Sizinlə vuruşanlarla vuruşun, lakin həddi aşmayın” (Bəqərə, 190). Döyüş ədalətlə məhdudlaşan təcavüzə cavabdır və düşmənin dayandığı anda dayanmalıdır.",
      "Qeyri-döyüşçülər ciddi şəkildə qorunur. Bir səfərdən sonra öldürülmüş bir qadın aşkar edildikdə, Peyğəmbər (s) qadın və uşaqların öldürülməsini qəti qadağan etdi. Hüquqşünaslar bunu qocalara, hücrələrində tənha qalan rahiblərə və ibadət edənlərə, əkinçilik işçilərinə və muzdlu işçilərə və döyüşlərdə iştirak etməyən hər kəsə şamil edirdilər. Onları öldürmək icazə verilən həddi aşmaq deyil - haramdır.",
      "Hətta fəal döyüşçülərə qarşı da məsələ qılıncdan əvvəl dəvət idi. Peyğəmbər (sallallahu aleyhi və səlləm) bir sərkərdə təyin edərkən ona əvvəlcə qarşı tərəfi İslama dəvət etməyi, sonra - rədd olunarsa - sülh yolu ilə həll etməyi və hər ikisi rədd edildiyi təqdirdə yalnız döyüşməyi və əsla imanı pozmamağı, cəsədi kəsməməyi və uşağı öldürməməyi tapşırdı (Səhih Müslim 1731).",
      'Xəyanət qəti qadağandır: müqavilələr öz müddətinə qədər yerinə yetirilməlidir və düşmənə xəyanət etməkdənsə, ədalətli xəbərdarlıq edilməlidir. Döyüş meydanında "müharibə hiylədir" icazəsi yalnız taktiki hiylələrə aiddir - hiylələr, sürprizlər, yanlış istiqamətləndirmə - heç vaxt əhdi pozmamaq və ya qorunan tərəfə yalan söyləmək.',
      "Mülkiyyət və yerin özü qorunur. Ümumi qaydalar meyvə ağaclarının kobud şəkildə kəsilməsini, əkinlərin yandırılmasını və mal-qaranın lazımsız şəkildə kəsilməsini qadağan edirdi. Məhkumlar yemək yeyərkən və geyindikləri kimi geyindirilməli idilər; Qur'an Allah sevgisi üçün əsiri yedizdirənləri tərifləyir (76:8) və bir çoxları fidyə, mübadilə və ya sadə mərhəmət yolu ilə azad edildi - bəziləri Bədrdə müsəlmanlara oxumağı öyrətmək müqabilində.",
      "Bunlar dinin normativ təlimləridir. Tarix boyu onları pozan ayrı-ayrı müsəlmanlar İslamı müəyyən etmir, pozurlar, necə ki, hər hansı bir inancın ardıcılları tərəfindən edilən pozuntular o inancın əmr etdiyini yenidən yazmır.",
    ],
    quran: [
      {
        excerpt: "Sizinlə vuruşanlarla Allah yolunda vuruşun, lakin həddi aşmayın.",
      },
      {
        excerpt:
          "Əgər onlar sülhə meyl etsələr, siz də ona meyl edin və Allaha təvəkkül edin. Həqiqətən, O, Eşidəndir, Biləndir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "İbn Ömər rəvayət edir ki, Rəsulullahın (sallallahu aleyhi və səlləm) səfərlərinin birində bir qadın öldürülmüş vəziyyətdə tapıldı və o, qadın və uşaqların öldürülməsini qadağan etdi.",
      },
      {
        excerpt:
          "Peyğəmbər (sallallahu aleyhi və səlləm) bir orduya sərkərdə təyin etdikdə ona buyurdu: “Allahın adı ilə vuruşun... qəniməti mənimsəməyin, əhdi pozmayın, şikəst etməyin və uşağı öldürməyin. Düşmənlə qarşılaşdığınız zaman əvvəlcə onları İslama dəvət edin; Əgər imtina etsələr, onlara sülh təklif edin; ancaq hər ikisindən imtina edərlərsə, vuruşun.",
      },
      {
        excerpt:
          "Əskik qocanı, gənc uşağı, qadını öldürməyin. — Bu dəqiq ifadənin bəzi zəncirləri zəif dərəcəyə malikdir, lakin onun bəyan etdiyi hökm yuxarıdakı səhih rəvayət və fəqihlərin icması ilə təsdiq edilmişdir.",
      },
    ],
    actions: [
      "İslamın əmr etdikləri ilə tarixdəki hər hansı bir ordunun əslində etdiklərini aydın şəkildə ayırın.",
      "Hər hansı bir döyüş hekayəsindən əvvəl bu etika bölməsini oxuyun - idarəetmə prinsipləri olmayan tarix anlaşılmazlığa səbəb olur.",
      "Mənbə bu qaydalara zidd görünən bir hərəkəti qeydə aldıqda, nəticə çıxarmazdan əvvəl onun konteksti və həqiqiliyi barədə soruşun.",
    ],
    appLinks: [{}],
  },
  {
    title: "Bədr döyüşü",
    summary: "17 Ramazan Hicri 2-ci ay — ilk böyük döyüş, Ayırma günü.",
    body: [
      "Məzmun və səbəb: Hicrətdən sonra Qureyş mühacirlərin Məkkədə qoyub getdikləri evləri və sərvətlərini ələ keçirmiş və hədə-qorxularını davam etdirmişdilər. Əbu Süfyanın Suriyadan zəngin bir karvana başçılıq etdiyi xəbəri Mədinəyə çatdıqda, Peyğəmbər (sallallahu aleyhi və səlləm) müharibə etmək üçün deyil, mülkün qarşısını almaq üçün yüngül bir qüvvə ilə - təxminən 313 nəfərlə yola düşdü.",
      "Nə baş verdi: Əbu Süfyan sahil boyu sürüşərək keçdi, lakin o, artıq Məkkəyə kömək üçün göndərmişdi və Qureyş minə yaxın döyüşçü, süvari və ləvazimatla yola çıxdı və müsəlmanlardan nümunə götürməyə qərar verdi. Bədr quyularında döyüş qaçılmaz oldu, burada əl-Hubab ibn əl-Munzirin məsləhəti ilə müsəlmanlar əvvəlcə suyu ələ keçirdilər və düşmənə onu inkar etdilər.",
      "O gecə Peyğəmbər (sallallahu aleyhi və səlləm) səhərə qədər namazda durdu. Özündən üç qat ordu ilə üz-üzə dayanaraq əllərini qaldırıb Rəbbinə elə yalvardı ki, libası çiynindən sürüşdü və dedi: “Allahım, əgər bu mömin dəstəsi məhv olsa, yer üzündə Sənə ibadət olunmaz”. Quranda bildirilir ki, Allah mələklər tərəfindən qüvvətlə cavab verdi və möminlərin qəlblərinə aramlıq saldı.",
      "Hər tərəfdən üç çempion arasında təkbətək döyüşdən sonra ordular toqquşdu. Qureyş qırıldı. Onların yetmişə yaxın lideri öldürüldü, onların arasında Əbu Cəhil də cəmiyyətin ən şiddətli təqibçisi idi və yetmişə yaxını əsir götürüldü; on dörd müsəlman şəhid oldu. Əsirlərlə ləyaqətlə rəftar edildi, bəziləri isə müsəlman uşaqlarına oxumağı və yazmağı öyrətməklə azadlıqlarını satın aldılar.",
      "Əsas fiqurlar: Peyğəmbərin (s) yanında Əbu Bəkr, Ömər, Əli və əmisi Həmzə; əl-Hubabın quyularda və Səd ibn Muazın strategiyada məsləhəti, hətta qələbə vəd edildiyi halda belə, məsləhətləşmə yolu ilə liderliyi göstərir.",
      "Qur'an bütün yarımadanın qarşısında haqqı batildən ayırdığına görə bu günü yəvmül-furqan - ayırd etmə günü adlandırır. Bunun davamlı dərsi budur ki, Allaha təvəkkül etmək üçün səmimi səy və tam hazırlıq birləşdirilməlidir: möminlər sıralarını düzdülər, yerlərini seçdilər və dua etdilər və qələbə onların sayına deyil, Allaha məxsusdur.",
    ],
    battleDetails: {
      location: "Mədinənin cənub-qərbindəki Bədr quyuları",
      modernLocation: "Müasir Bədr yaxınlığında, Səudiyyə Ərəbistanı",
      hijriDate: "17 Ramazan 2 Hicrət",
      muslimForces: "~313 döyüşçü, az sayda at və dəvə (hesabatlar bir qədər dəyişir)",
      opposingForces: "~1000 Qureyş, daha yaxşı silahlanmış və atlı",
      muslimCommander: "Məhəmməd peyğəmbər s",
      opposingCommander: "Əmr ibn Hişam (Əbu Cəhl), döyüşdə öldürüldü",
      weather: "Dünən gecə yağan yağış müsəlmanlar üçün qumu bərkitdi; suya çıxışı həlledici idi",
      outcome: "Müsəlmanların həlledici qələbəsi",
      keyEvents: [
        "Əl-Hubab ibn əl-Munzir əvvəlcə quyularda düşərgə qurmağı, suya nəzarət etməyi tövsiyə etdi.",
        "Peyğəmbər (sallallahu aleyhi və səlləm) gecəni ibadət edərək sayı çox olan möminlər üçün Allaha yalvardı.",
        "Üç Qureyş çempionunu Həmzə, Əli və Ubeydə təkbətək döyüşdə qarşıladılar.",
        "Allah möminləri mələklərlə gücləndirdi (Qur'an 8:9) və əsas Qüreyş başçılarını yerə yıxdı.",
        "Düşmənin 70-ə yaxını öldürüldü, 70-i əsir götürüldü; əsirlərlə insanpərvər davranırdılar.",
      ],
      leadershipLesson:
        "Hərtərəfli hazırlaşın, elm sahibləri ilə məsləhətləşin, sonra bütünlüklə Allaha təvəkkül edin.",
      spiritualLesson:
        "İlahi dəstəyi olan kiçik səmimi bir qrup dünyəvi çətinlikləri dəf edə bilər - qələbə Allahdandır.",
      facts: [
        "Bədr Quranda hər hansı digər nişanlardan (Ənfal surəsi) daha çox adlandırılmış və təsvir edilmişdir.",
        "Mədinə uşaqlarına savad öyrətmək müqabilində bəzi əsirlər azad edildi.",
      ],
    },
    quran: [
      {
        excerpt:
          "O zaman ki, siz Rəbbinizdən kömək diləyirdiniz, O da sizə cavab verdi: “Mən sizə bir-birinin ardınca gələn min mələklə kömək edəcəyəm.",
      },
      {
        excerpt:
          "Qarşılaşan iki orduda sizin üçün bir dəlil var idi: biri Allah yolunda vuruşur, digəri isə kafirlərdəndir.",
      },
      {
        excerpt:
          "Onları siz öldürmədiniz, ancaq Allah öldürdü. Siz atdığınız zaman atmadınız, ancaq Allah atandı.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ömər (radiyallahu anhu) rəvayət edir ki, Bədr günü Peyğəmbər (Ona Allahın salavatı və salamı olsun) öz səhabələri üç yüzdən bir qədər çox olarkən min nəfərin düşməninə baxdı, sonra qibləyə tərəf dönüb əllərini uzadıb Rəbbinə yalvardı: “Allahım, mənə verdiyin vədi yerinə yetir. İlahi, əgər bu mömin dəstəsi məhv olsa, yer üzündə Sənə ibadət olunmaz. O, libası çiynindən düşənə qədər yalvardı və Əbu Bəkr onu əvəz etdi və dedi: Bəsdir, ey Allahın Peyğəmbəri, Allah sənə vəd etdiyini yerinə yetirəcək.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Uhud döyüşü",
    summary: "Hicri 3-cü Şəvval – itaət, nizam-intizam və səbirdə bahalı bir dərs.",
    body: [
      "Məzmun və səbəb: Bədrdən bir il sonra Qüreyş ölülərinin qisasını almaq üçün geri qayıtdı, təxminən 3000 döyüşçü topladı - o vaxt hələ də düşmən olan Xalid ibn əl-Vəlidin başçılıq etdiyi süvarilər və qadınlar nağara və elegiyalarla kişiləri irəliləməyə çağırdılar. Təxminən 700-ə yaxın müsəlman geri çəkildikdən sonra arxalarında Uhud dağı ilə mövqe tutdular.",
      "Nə oldu: Peyğəmbər (sallallahu aleyhi və səlləm) ordunun açıq arxa tərəfini qoruyan bir təpə üzərində əlli oxçu yerləşdirdi və onlara vurğulamaq üçün təkrarladığı əmr verdi: “Bizi quşlar tərəfindən qaçırıldığını görsəniz belə, mən sizi çağırana qədər bu mövqedən çıxmayın”. Əvvəlcə plan mükəmməl işlədi - müsəlmanlar Qureyşi geri qovdu və düşmən qaçmağa başladı.",
      "Düşmənin dağıldığını və qənimətlərin açıq olduğunu görən oxatanların çoxu döyüşün qalib gəldiyinə əmin olaraq əmrə zidd olaraq təpəni tərk etdilər. Xalid ibn Vəlid bu anı dəyərləndirdi, süvarilərini müdafiə olunmayan boşluqdan keçirdi və müsəlmanları arxadan vurdu. Nizam xaosa çökdü.",
      "Əsas rəqəmlər və qiymət: “Allahın Aslanı” Həmzə ibn Əbdül-Müttəlib yetmişə yaxın səhabə ilə birlikdə şəhid oldu. Peyğəmbərin (s) özü də yaralandı - dişi qırıldı və üzü kəsildi - və onun öldürüldüyü barədə bir şayiə yayıldı. Möminlər onun sağ olduğunu görüb dağın yamacında onun yanına toplaşdılar və Qureyş onları bitirə bilməyib geri çəkildi.",
      "Qur'an “Ali-İmran” surəsində bu günə geniş şəkildə xitab edərək, məsuliyyəti imansızlıq və ya Allahın vədinə qarşı deyil, bəzilərinin itaətsizliyi üzərinə qoyur: “Şübhəsiz ki, Allah sizə verdiyi vədini yerinə yetirdi... o vaxta qədər ki, siz cəsarətinizi itirdiniz, əmr üzərində mübahisə etdiniz və sevdiyiniz şeyi sizə göstərdikdən sonra asi oldunuz” (3:152). Ancaq eyni keçid yaralı camaata təsəlli verir və ümidsizlikdən çəkindirir.",
      "Buna görə də Uhud İslamın məğlubiyyəti deyil, qorunub saxlanmış bir dərsdir: əvvəllər verilmiş qələbə nizam-intizam pozulduğu anda geri çəkilir, aydın əmrlər cəsarət qədər vacibdir və sınaqlar bir ümməti təmizləyir - tövbə edib möhkəm dayananlar üçün uğursuzluq böyümənin toxumu olur.",
    ],
    battleDetails: {
      location: "Mədinənin şimalında Uhud dağının yamacları",
      modernLocation: "Uhud, Mədinə bölgəsi, Səudiyyə Ərəbistanı",
      hijriDate: "Şəvval 3 hicri",
      muslimForces: "~700 (bəziləri döyüşdən əvvəl geri çəkildikdən sonra)",
      opposingForces: "~3000 Qureyş və müttəfiqləri, süvariləri ilə",
      muslimCommander: "Məhəmməd peyğəmbər s",
      opposingCommander:
        "Əbu Süfyan ibn Hərb; Xalid ibn əl-Valid cinah süvarilərinə başçılıq edirdi",
      outcome: "Qureyşin taktiki sahədə üstünlüyü; müsəlman icması toxunulmaz şəkildə sağ qalır",
      keyEvents: [
        "Peyğəmbər (s) 50 oxatanı bir təpənin üstündə yerləşdirdi və oradan heç vaxt çıxmamağı əmr etdi.",
        "Müsəlmanlar düşmən xəttini yardılar, lakin oxatanların çoxu qənimət toplamaq üçün postunu tərk etdilər.",
        "Xalid ibn Vəlidin süvariləri boşluqdan istifadə edərək arxadan zərbə endirdi.",
        "Həmzə və 70-ə yaxın səhabə şəhid oldu; Peyğəmbər (s) yaralandı.",
        "Peyğəmbərin ölümü ilə bağlı yalan şayiə yayıldı; möminlər onu sağ-salamat görəndə toplaşdılar.",
      ],
      leadershipLesson:
        "Aydın əmrlər və intizamlı icra igidlik qədər vacibdir; postunuzu tərk etmək qələbəni ləğv edə bilər.",
      spiritualLesson:
        "Sınaqlar möminləri islah edər; uğursuzluq tövbə ilə qarşılaşdı və səbir böyüməyə səbəb olur.",
    },
    quran: [
      {
        excerpt:
          "Siz onları Onun izni ilə öldürdüyünüz zaman, şübhəsiz ki, Allah sizə verdiyi vədini yerinə yetirdi, nəhayət ki, siz cəsarətinizi itirdiniz, əmr üzərində mübahisə etdiniz və sevdiyiniz şeyi sizə göstərdikdən sonra asi oldunuz.",
      },
      {
        excerpt:
          "Odur ki, zəifləməyin və qəm-qüssə etməyin, çünki siz həqiqi möminsinizsə, üstün olarsınız.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Peyğəmbər Uhud günü Abdullah ibn Cübeyri əlli oxçuya təyin etdi və dedi: “Məqsədinizi qoruyun. Əgər bizi quşlar tərəfindən qaçırıldığını görsən də, mən səni çağırana qədər onu tərk etmə. Düşmən darmadağın edildikdə və oxatanlar qənimətləri görəndə dedilər: “Qənimət! və öz vəzifəsini tərk etdilər - yetmiş nəfərimiz öldürüldü.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Xəndək döyüşü",
    summary:
      "Şəvval 5 hicri — Konfederasiyalar Mədinəyə mühasirəyə alırlar; səngər və külək onları parçalayır.",
    body: [
      "Kontekst və səbəb: Həm də Qəzvətul-Əhzab (Müttəfiqlərin Döyüşü) adlanan bu, düşmənin İslamı birdəfəlik məhv etmək üçün ən böyük səyi idi. Əvvəllər xəyanətə görə qovulmuş Bənu Nadirin başçıları Məkkəyə və Qatafana getdilər və koalisiya - Qüreyş, Qatafan və digər qəbilələri topladılar - təxminən 10.000 ilə 24.000 nəfər. Müsəlmanların sayı təxminən 3000 idi və təhlükə ekzistensial idi.",
      "Nə oldu: Heç bir ərəb şəhərinin açıq döyüşdə tab gətirə bilmədiyi mühasirə ilə üzləşən Peyğəmbər (s) səhabələri ilə məsləhətləşdi. Salman əl-Farisi ərəb müharibəsi üçün məlum olmayan fars taktikasını təklif etdi - açıq şimala yaxınlaşma boyunca dərin bir xəndək qazmaq, yeganə tərəfi lava sahələri, meyvə bağları və ya möhkəmləndirilmiş evlərlə qorunmayan tərəf. Möminlər günlərlə acı soyuqda və aclıqda qazdılar, Peyğəmbər (s) öz kürəyində torpaq daşıdı və oruc əzabına qarşı qarnına daş bağladı.",
      "Xəndək işlədi. Böyük ev sahibəsi gələndə o, keçə bilməyib; onu atlayan bir neçə atlı geri qovuldu. Mühasirə meydançalı döyüşdən daha çox iki-dörd həftə soyuq, gərginlik və atışma ilə nəticələndi.",
      "Cəmiyyət öz mahiyyətinə qədər sınaqdan keçirildi. Münafiqlər bəhanələr uydurub qaçmağa çalışırdılar; Şəhər daxilində Bəni Qureyzə qəbiləsi düşmənə doğru tərəddüd etdi. Quranda ürəklərin boğaza çatması təsvir edilir. Bununla belə, möminlər tutdular və Nuaym ibn Məsud - gizlicə yeni müsəlman olmuşdu - konfederasiya fraksiyaları bir-birinə qarşı çıxana qədər aralarında inamsızlıq səpdi.",
      "Sonra qılıncdan deyil, Allahdan yardım gəldi. Şiddətli, dondurucu külək düşmən düşərgəsini qoparıb, yemək bişirən odları və çadırları alt-üst etdi və görünməyən ordular onları dəhşətlə doldurdu. Artıq parçalanmış və təchizatı az olan koalisiya gecə saatlarında dağıldı və geri çəkildi. Peyğəmbər (s) sonra dedi ki, müttəfiqləri yalnız Allah məğlub etdi.",
      "Davamlı dərslər: sağlam nəsihət haradan gəlirsə, qəbul edilməlidir - burada fars iman gətirmiş şəxsdən; vasitələr son həddə çatdırılmalıdır — səngər qazılır, rütbələr tutulur; Sonra isə nəticə, bir ordunu küləklə geri qaytara bilən Allaha tapşırılır. Əhzab surəsi bütün imtahanı və onun rahatlığını qoruyub saxlayır.",
    ],
    battleDetails: {
      location: "Şimal Mədinəyə yaxınlaşır",
      modernLocation: "Mədinə, Səudiyyə Ərəbistanı",
      hijriDate: "Şəvval 5 hicri",
      muslimForces: "~3000",
      opposingForces: "Konfederasiya koalisiyası (~10.000–24.000; rəqəmlər mənbələrdə fərqlidir)",
      muslimCommander: "Məhəmməd peyğəmbər s",
      opposingCommander:
        "Qüreyşə başçılıq edən Əbu Süfyan; Qatafanın müttəfiq başçıları və başqaları",
      weather: "Qazma zamanı kəskin soyuq; şiddətli ilahi külək mühasirəni bitirdi",
      outcome: "Müsəlmanların meydan döyüşsüz qələbəsi; koalisiya dağılır",
      keyEvents: [
        "Salman əl-Farisi həssas şimal dəhlizi boyunca xəndək qazmağı təklif etdi.",
        "Peyğəmbər (salləllahu aleyhi və səlləm) zəhmətə şərik oldu, torpaq daşıdı və aclığa qarşı daş bağladı.",
        "Xəndək açıq döyüş əvəzinə mühasirə etməyə məcbur edərək böyük qoşunu dayandırdı.",
        "Nuaym ibn Məsud müttəfiqləri parçalayan nifaq saldı.",
        "Dondurucu külək və görünməyən ordular (Qur'an 33:9) düşmən düşərgəsini darmadağın etdi; geri çəkildilər.",
      ],
      leadershipLesson:
        "Mənşəyindən asılı olmayaraq geniş şəkildə məsləhətləşin və yaxşı ideyaları qəbul edin; cəmiyyətin sıxıntısını özünüz bölüşün.",
      spiritualLesson:
        "Mühasirə altında möhkəm durun və nəticəsini küləklə bir ordunu geri qaytara bilən Allaha həvalə edin.",
    },
    quran: [
      {
        excerpt:
          "Ey iman gətirənlər, Allahın sizə olan nemətini xatırlayın ki, qoşunlar üzərinizə gəldi və Biz onların üstünə külək və görmədiyiniz ordular göndərdik... Orada möminlər imtahana çəkildi və şiddətli bir sarsıntı ilə sarsıldı.",
      },
      {
        excerpt:
          "Möminlər birlikləri gördükdə dedilər: “Bu, Allahın və Onun Rəsulunun bizə vəd etdiyi şeydir və bu, onların iman və təslimiyyətlərini daha da artırdı.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Həzrət Peyğəmbər (s) Əhzab günü müttəfiqlərin əleyhinə dua edərək dedi: “Ey Kitabı nazil edən, tez haqq-hesab çəkən Allahım, qoşunları məğlub et. İlahi, onları məğlub et və sarsıt.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Bənu Qureyzə",
    summary:
      "5 hicri — mühasirə zamanı xəyanət edilmiş müqavilə; razılaşdırılmış arbitr tərəfindən qərar.",
    body: [
      "Məzmun və səbəb: Bənu Qureyzə Mədinə şəhərinin qarşılıqlı müdafiə əhdi ilə müsəlmanlara bağlı olan yəhudi qəbiləsi idi. Xəndəkin zirvəsində, konfederasiyalar Mədinəyə zəng vurduqda və camaatın sağ qalması iplə asılanda, Bənu Nadirin başçısı Qureyzə başçılarını bu əhdi pozmağa və şəhər daxilindən ikinci cəbhə açmağa razı saldı. O an gəldikdə, bu, şəxsi mübahisə deyil, Mədinədə hər kəsi məhv edə biləcək bir mühasirə zamanı xəyanət idi.",
      "Nə baş verdi: Müttəfiqlər geri çəkildikdən sonra Peyğəmbər  Bəni Qureyzə qövmünə qarşı hərəkət etdi və onlar öz qalalarına qapandılar. Mühasirə təslim olmağa razılaşana qədər təxminən iyirmi beş gün davam etdi, lakin onlar istədilər ki, onların taleyini birbaşa Peyğəmbər (s) yox, öz seçdikləri bir hakim: Evs qəbiləsinin başçısı Səd ibn Muaz, öz uzunmüddətli müttəfiqləri.",
      "Qərar: Səd - özü də Xəndəkdə aldığı yaradan ölür - xəyanəti törədən döyüşçülərin edam edilməsinə, qadın və uşaqların isə əsir götürülməsinə qərar verdi ki, bu hökm, mühasirə altında olan vətənə xəyanətə görə o dövrün və məkanın müharibə qanunlarına uyğun olaraq istənilən standartda sərt idi. Peyğəmbər (salləllahu aleyhi və səlləm) dedi ki, Səd Allahın hökmü ilə hökm etdi.",
      "Bunu necə diqqətlə oxumaq olar: Bu, cəmiyyətin ən həssas vaxtında müdafiə müqaviləsini pozan döyüşçülər tərəfindən müharibə zamanı xəyanətkarlığının xüsusi bir cəzası idi - bir xalqa inandıqlarına görə bir hökm deyil və müsəlmanların yəhudilərə və ya hər hansı bir dini icmaya qarşı necə davranacağına dair bir şablon deyildi. Qur'an və Sünnə sülhsevər qeyri-müsəlmanlara qarşı ədaləti və yaxşı rəftar etməyi əmr edir (Qur'an 60:8) və Mədinənin iman gətirən digər yəhudi qəbilələri və fərdləri heç vaxt zərər görmədilər. Əsas təqaüd bunu xəyanət qanununun məhdud tarixi epizodu kimi qəbul edir və bəzi sonrakı alimlər hətta ötürülən rəqəmlərin təfərrüatlarını şübhə altına alırdılar.",
      "Qur'an, Əhzab surəsində zəfər olmadan konfederasiya müharibəsinin nəticəsi kimi ayıq şəkildə bəhs edir. Davamlı dərs, əhdi pozmağın ağırlığıdır - ortaq təhlükə anında etibara xəyanət ən ağır yükü daşıyır - hətta düşmənin də yoxlanılmamış qisas almaqdansa, razılaşdırılmış və qərəzsiz arbitr tərəfindən mühakimə etmək hüququna malik olması prinsipi ilə yanaşı qoyulur.",
    ],
    battleDetails: {
      location: "Mədinənin kənarındakı Bənu Qureyzə qalaları",
      modernLocation: "Mədinə, Səudiyyə Ərəbistanı",
      hijriDate: "Hicrətin 5-ci ili Zülqədə (Xəndəkdən az sonra)",
      muslimForces: "Mədinə ordusu, Xəndək mühasirəsindən dərhal sonra",
      opposingForces: "Bənu Qureyzə, qalaları daxilində möhkəmləndi",
      muslimCommander: "Məhəmməd peyğəmbər s",
      outcome:
        "Mühasirədən sonra təslim olmaq; qəbilənin öz seçilmiş hakimi tərəfindən çıxarılan hökm",
      keyEvents: [
        "Bənu Qureyzə, Konfederasiya mühasirəsi zamanı Mədinə əhdini pozdu.",
        "Konfederasiyalar geri çəkildikdən sonra müsəlmanlar onların qalalarını təxminən 25 gün mühasirəyə aldılar.",
        "Qəbilə uzun müddət müttəfiqləri olan Evs tayfasının başçısı Səd ibn Muaz tərəfindən mühakimə olunmasını istədi.",
        "Səd mühasirə altında olan vətənə xəyanətə görə dövrün müharibə qanunu ilə hökm edirdi; Peyğəmbər (s) hökmü təsdiq etdi.",
      ],
      leadershipLesson:
        "Düşmənə qarşı belə, yoxlanılmamış qisas almaqdansa, razılaşdırılmış, qərəzsiz arbitr tərəfindən mühakimə olunmağa icazə verin.",
      spiritualLesson:
        "Ortaq təhlükə anında qarşılıqlı qoruma əhdini pozmaq xəyanətlərin ən ağırlarındandır.",
    },
    quran: [
      {
        excerpt:
          "O, kitab əhlindən onlara yardım edənləri qalalarından endirdi və onların qəlblərinə qorxu saldı. Onların torpaqlarını və yurdlarını sizə varis etdi.",
      },
      {
        excerpt:
          "Allah sizə din yolunda sizinlə vuruşmayan və sizi yurdunuzdan çıxartmayanlarla yaxşılıq etməyi və ədalətlə davranmağı sizə qadağan etməz. Həqiqətən, Allah ədalətli olanları sevir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Bəni Qureyzə Səd ibn Muazın hökmünü qəbul etməyə razı olduqda, Peyğəmbər (s) onu çağırtdırdı. O, gəldi və Peyğəmbər (s) buyurdu: “Əşinin yanında ol. Səd hökm etdi ki, onların döyüşən kişiləri öldürülsün, qadın və uşaqları əsir götürülsün. Peyğəmbər (salləllahu aleyhi və səlləm) buyurdu: “Sən Allahın hökmü ilə hökm etdin, ya da padşahın hökmü ilə dedi.",
      },
    ],
    disclaimer:
      "Bu, tayfanın özünün seçdiyi arbitr tərəfindən mühakimə olunan döyüşçülər tərəfindən xüsusi bir müharibə zamanı xəyanət aktına görə cəza idi. Bu, dinlərinə görə heç bir xalqa qarşı bir hökm deyil və İslamın ədalət və xeyirxahlıqla rəftar edilməsini əmr etdiyi yəhudilərlə və ya hər hansı bir inanclı cəmiyyətlə münasibətlər üçün nümunə deyildir (Qur'an 60:8). Bəzi sonrakı alimlər ötürülən nömrələrin təfərrüatlarını şübhə altına aldılar.",
  },
  {
    title: "Hudeybiyyə müqaviləsi",
    summary: "Hicri 6-cı il — uğursuzluğa oxşayan və aşkar qələbəyə çevrilən atəşkəs.",
    body: [
      "Məzmun və səbəb: Hicri 6-cı ildə Peyğəmbər (s) 1400-ə yaxın səhabə ilə - silahsız, lakin səyyahların qılıncları üçün - döyüşmək üçün deyil, yalnız Kəbəyə kiçik həcc (ümrə) etmək niyyəti ilə yola düşdü. Müsəlmanları Məkkəyə buraxarkən görünmək istəməyən Qüreyş müqəddəs sərhəddəki Hudeybiyyə adlı yerdə yolu bağladı.",
      'Rıdvan beyəti: Düşərgəyə Qureyşin Peyğəmbərin elçisi Osman ibn Əffanı öldürdüyü barədə şayiə çatdıqda, Peyğəmbər (s) səhabələri bir akasiya ağacının altında əhd etməyə çağırdı ki, qaçmayacaqlar. Təxminən on dörd yüz nəfər bu beyət - Beyətül-Ridvan, İlahi riza beyəti - verdi və sonralar Qur\'an buyurdu: "Allah möminlər ağacın altında sənə beyət etdikləri zaman onlardan razı qaldı" (48:18). Osmanın sağ olduğunu sübut etdi və nümayiş olunan qərardan narahat olan Qureyş danışıqlara göndərildi.',
      "Nə oldu: Atəşkəsin şərtləri alçaldıcı görünürdü. Müsəlmanlar bu il ümrəsiz geri dönərdilər və yalnız növbəti ildə geri qayıda bilərdilər. On illik sülh olacaqdı. Qüreyşdən müsəlmanlara qaçan hər kəs geri qaytarılacaqdı, amma əksi deyil - bu, incidən bir bənddir. Zəncirlənmiş müsəlman Əbu Cəndəli məhz bu bənd altında onların gözləri önünə sürüklədikdə, səhabələr qırılmağa yaxın idi; Ömər bunu açıq şəkildə soruşdu və Allah Rəsuluna təvəkkül etməyi yumşaq bir şəkildə xatırlatdı.",
      "Nə üçün bu qələbə idi: İlk dəfə olaraq Qureyş yazılı müqavilədə müsəlmanlarla bərabər güc kimi çıxış etdi. On illik sülh yolları açdı; İslam barışıq dövründə sürətlə və dinc şəkildə yayıldı - bu iki ildə İslama əvvəlki illərdən daha çox daxil oldu. Qureyş cəbhəsindən azad olan Peyğəmbər (s) Xeybərə üz tuta bilər və padşahları və qəbilələri İslama dəvət edən məktublar göndərə bilərdi. Qayıdışda: “Həqiqətən, Biz sənə açıq-aydın bir qələbə bəxş etdik” ilə başlayan “Fəth” surəsi nazil oldu.",
      "Qalıcı dərslər: Bu, nəfs üzərində səbrin, qərarın hikməti hələ görünmədiyi zaman Allah və Rəsuluna təvəkkül etməyin ən gözəl nümunəsidir. Səhabələrin əvvəlcə məğlubiyyət kimi hiss etdiklərini Qur'an açıq-aşkar bir qələbə adlandırdı və iki il ərzində Məkkəyə gedən yolu açdı. Sərt sülhü qəbul etmək, müqaviləyə hörmət etmək və gözləmək istəyi burada zəiflik deyil, güc forması kimi göstərilir.",
    ],
    battleDetails: {
      location: "Hudeybiyyə, Məkkə yaxınlığındakı müqəddəs sərhəddə",
      modernLocation: "Əl-Şumaisi, Məkkə yaxınlığında, Səudiyyə Ərəbistanı",
      hijriDate: "Zilqədə 6 hicri",
      muslimForces: "~1400 zəvvar, müharibə üçün təchiz olunmayıb",
      opposingForces: "Qureyş, Məkkəyə gedən yolu bağlayır",
      muslimCommander: "Məhəmməd peyğəmbər s",
      outcome: "On illik atəşkəs; döyüş yoxdur; sonra Quranda açıq-aşkar qələbə adlandırıldı",
      keyEvents: [
        "Müsəlmanlar döyüş üçün deyil, ümrə üçün yola düşdülər və Hudeybiyyədə dayandırıldılar.",
        "Osmanın ölümü ilə bağlı yalan xəbərə görə, ~1400 nəfər ağacın altında Ridvan beyətini verdi.",
        "Səhabələrin acı tapdıqları şərtlərlə on illik atəşkəs imzalandı (qaytarma bəndi, Əbu Cəndal).",
        "İslam sülh dövründə sürətlə yayıldı; Əl-Fəth surəsi bu müqaviləni aşkar qələbə adlandırmışdır.",
      ],
      leadershipLesson:
        "Çətin sülhü qəbul edin və ona hörmət edin; bu gün müdrik bir güzəşt sabah daha böyük bir qapı aça bilər.",
      spiritualLesson:
        "Qərarın hikməti gizləndiyi zaman Allaha və Rəsuluna təvəkkül edin - səbir ən həqiqi qələbə ola bilər.",
    },
    quran: [
      {
        excerpt:
          "Həqiqətən, Biz sənə açıq-aydın bir qələbə bəxş etdik ki, Allah sənin əvvəlki və sonrakı günahlarını bağışlasın, sənə olan nemətini tamamlasın və səni düz yola yönəltsin.",
      },
      {
        excerpt:
          "Şübhəsiz ki, Allah möminlərdən ağacın altında sənə beyət etdikləri zaman onlardan razı qaldı və onların ürəklərində olanı bildi, buna görə də onlara aramlıq nazil etdi və onları yaxın bir fəthlə mükafatlandırdı.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Cabir ibn Abdullah dedi: “Hüdeybiyyə günü biz on dörd yüz idik. Biz ağacın altında Peyğəmbərə beyət etdik və o, insanların ən yaxşısı idi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Xeybər səfəri",
    summary: "Hicri 7-ci il - Konfederasiyaları dəstəkləyən möhkəmləndirilmiş qalalar tabe edildi.",
    body: [
      "Kontekst və səbəb: Xeybər əvvəllər xəyanətə görə qovulmuş qəbilələrin, o cümlədən Xəndəkdə Konfederasiya koalisiyasını təşkil edən Bənu Nadirin başçılarının məskəni olan Mədinənin şimalında münbit vahə qalaları silsiləsi idi. Oradan da düşmənləri Mədinəyə qarşı yığmağa davam etdilər. Qureyş cəbhəsinin Hudeybiyyə tərəfindən dondurulması ilə Peyğəmbər (s) bu düşmənçilik bazasını zərərsizləşdirmək üçün hərəkətə keçdi.",
      "Nə baş verdi: Müsəlmanlar - təxminən 1600 - bir-bir qalalara doğru irəlilədilər. Kampaniya çətin idi və bir neçə həftə ərzində davam etdi. Həzrət Peyğəmbər (s) çətin bir gündə buyurdu: “Sabah bayrağı Allahı və Rəsulunu sevən, Allah və Rəsulunun da sevdiyi, Allah onun əli ilə zəfər bəxş edən şəxsə verəcəyəm”. Səhəri gün o, gözü ağrıyan Əli ibn Əbi Talibi çağırdı və sağalana qədər onun üçün dua etdi və bayrağı ona verdi; əsas qala yıxıldı.",
      "Qəsəbə: Qalalar alınanda sakinlər qovulmadı. Onlar müsəlmanlara məhsuldan bir pay verərək, qalıb əkinçiliyə davam etməyi xahiş etdilər və Peyğəmbər (s) razılaşdı. Bu tənzimləmə - fəth edilmiş fermerlərin öz torpaqlarında məhsul bölgüsü paktı altında saxlanması - sonrakı İslam müqavilələri və vergi qanunlarında öyrənilən ilk presedent oldu.",
      "Əsas rəqəmlər: Kampaniya hər şeydən əvvəl Əlinin rolu və bayraq hədislərində təcəssüm olunan əxlaqı ilə yadda qalıb - rəhbərlik sadəcə rütbə və güc deyil, səmimiyyət və Allah sevgisi əsasında etibar edilir.",
      "Qayğı haqqında qeyd: Xeybər bəzən daha sonrakı siyasi mübahisələrə sürüklənir. Burada o, ciddi şəkildə VII əsr ekspedisiyası kimi təsvir edilir ki, klassik seyrahda qeyd olunur - kütləvi qovulma ilə deyil, danışıqlar yolu ilə həll edilən aktiv düşmən bazasına cavab.",
    ],
    battleDetails: {
      location: "Xeybər vahəsi, Mədinənin şimalında",
      modernLocation: "Xaybar, Səudiyyə Ərəbistanı",
      hijriDate: "Məhərrəm-Səfər hicri 7",
      muslimForces: "Təxminən 1600",
      opposingForces: "Bir neçə qala boyunca möhkəmləndirilmiş qarnizonlar",
      muslimCommander: "Məhəmməd peyğəmbər; Həlledici hücuma Əli ibn Əbi Talib rəhbərlik edirdi",
      outcome: "Qalalara müsəlman nəzarəti; məhsulun bölüşdürülməsi üzrə danışıqlar yolu ilə həll",
      keyEvents: [
        "Bir neçə həftəlik mühasirə zamanı qalalar bir-bir azaldıldı.",
        "Bayraq Peyğəmbərin (sallallahu aleyhi və səlləm) duası ilə gözlərini sağaltdığı Əliyə verildi.",
        "Çempion Mərhaba qalib gəldi və açar qala yıxıldı.",
        "Sakinlər məhsul bölgüsü paktına əsasən əkinçi kimi öz torpaqlarında qaldılar.",
      ],
      leadershipLesson:
        "Məsuliyyəti ən münasib olanlara və qəlbləri Allaha məxsus olanlara həvalə et.",
      spiritualLesson:
        "Uzun sürən çətinliklərə dözmək, ixlasla birləşmək, Allahın köməyini gətirir.",
    },
    hadith: [
      {
        excerpt:
          "Xeybər günü Peyğəmbər (salləllahu aleyhi və səlləm) buyurdu: “Sabah mən bu bayrağı Allahı və Rəsulunu sevən, Allah və Rəsulunun da sevdiyi və Allah onun əli ilə qələbə çalan şəxsə verəcəyəm. Ertəsi gün gözləri ağrıyan Əlini çağırdı; gözlərinə tüpürdü və onun üçün dua etdi və Əli heç xəstələnməmiş kimi sağaldı və bayrağı ona verdilər.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Muta döyüşü",
    summary: "Cüməda əl-Ula hicri 8-ci il — üç komandirin növbə ilə şəhid olduğu sərhəd səfəri.",
    body: [
      "Məzmun və səbəb: Peyğəmbər ﷺ Bizansla birləşən şimala elçi göndərdi və elçi öldürüldü - bu, böyük bir pozuntudur, çünki elçilər millətlərin qanunu ilə qorunurdular. Cavab olaraq o, təxminən 3000 nəfərlik ordunu İordaniyanın şərqindəki Roma sərhəddinə yaxın Mutaya göndərdi.",
      "Əmr zənciri: Onlar yola düşməzdən əvvəl Peyğəmbər (sallallahu aleyhi və səlləm) bir sıra sıralar təyin etdi - Zeyd ibn Harisə, yıxılacağı təqdirdə Cəfər ibn Əbi Talib, yıxılacağı təqdirdə isə Abdullah ibn Rəvahə - həlledici olacaq bir uzaqgörənlik idi.",
      "Nə baş verdi: Mu'tada müsəlmanlar Bizanslıların və müttəfiq ərəb qəbilələrinin xeyli böyük bir qüvvəsi ilə qarşılaşdılar - mənbələr on minlərlə nəfərdən bəhs edir, baxmayaraq ki, rəqəmlər qeyri-müəyyəndir və ehtimal ki, şişirdilmişdir. Zeyd yıxıldı, sonra hər iki qolu kəsilənə qədər bayrağı tutması ilə yadda qalan Cəfər, daha sonra isə Peyğəmbərin (sallallahu aleyhi və səlləm) qoyduğu qaydada Abdullah ibn Rəvahə düşdü.",
      'Geri çəkilmə: Hər üç təyin olunmuş sərkərdə şəhid olduqdan sonra səhabələr bayrağı Hudeybiyyədən sonra yeni müsəlman olan Xalid ibn əl-Validə verdilər. Bir sıra manevrlər və yenidən yerləşdirmələrlə sayca çox olan ordunu sıradan çıxardı və onu böyük ölçüdə bütöv şəkildə vətənə gətirdi - bu, Peyğəmbərin (s) şərəfləndirdiyi bir şücaətdir və sonra Xalidi "Allahın qılıncları arasında qılınc" adlandırır. Peyğəmbər (s) Mədinədə Zeyd, Cəfər və İbn Rəvahə üçün ağladı və heç bir elçi gəlməmişdən əvvəl onlara şəhadət xəbərini verdi.',
      "Davamlı dərslər: təhlükədən əvvəl varislərin adlandırılması - liderliyin davamlılığı - ordunu sözün əsl mənasında xilas etdi; və həyatı qoruyan intizamlı geri çəkilmə rüsvayçılıq deyil, hikmətdir. Allah yolunda şəhadət siyasi uğursuzluq deyil, şərəfdir və döyüş həm də müsəlmanları Xalidin hədiyyələri ilə tanış etdi, tezliklə bütünlüklə imanın xidmətinə çevrildi.",
    ],
    battleDetails: {
      location: "Muta, İordan çayının şərqində",
      modernLocation: "İordaniya, Karak yaxınlığında",
      hijriDate: "Cümədül-ülə hicri 8-ci il",
      muslimForces: "~3000",
      opposingForces:
        "Bizans və müttəfiq ərəb qüvvələri (daha çox; rəqəmlər mənbələrdə qeyri-müəyyəndir)",
      muslimCommander: "Zeyd ibn Harisə, sonra Cəfər, sonra İbn Rəvahə, sonra Xalid ibn əl-Valid",
      outcome: "Müsəlmanların nizamlı şəkildə geri çəkilməsi; ağır şəhadət verdi amma ordu qorudu",
      keyEvents: [
        "Peyğəmbər (sallallahu aleyhi və səlləm) yola düşməzdən əvvəl ardıcıl olaraq üç sərkərdənin adını çəkdi.",
        "Üçü də qabaqcadan deyildiyi kimi növbə ilə Mutaya düşdü.",
        "Xalid ibn əl-Valid komandanı öz üzərinə götürdü və ordunu təhlükəsiz yerə manevr etdi.",
        "Peyğəmbər (s) xəbər gəlməmişdən əvvəl Mədinədə ağladı və şəhidləri xəbər verdi.",
      ],
      leadershipLesson:
        "Təhlükə başlamazdan əvvəl varisləri adlandırın - aydın liderliyin davamlılığı həyatları xilas edir.",
      spiritualLesson:
        "Allah yolunda şəhid olmaq şərəfdir. ordunu xilas edən ağıllı geri çəkilmə məğlubiyyət deyil.",
    },
    appLinks: [{}],
  },
  {
    title: "Məkkənin fəthi",
    summary:
      "Ramazan ayının 8-i hicri-qəməri tarixidir - ümumi amnistiya ilə Məkkənin qansız açılışı.",
    body: [
      "Məzmun və səbəb: Hüdeybiyyə müqaviləsi, Qureyşin müttəfiqləri Bəni Bəkr müsəlmanların müttəfiqləri olan Bəni Xuza tayfasına hücum edərək, hətta müqəddəs bölgədə bəzilərini qətlə yetirərək, Qureyşin gizli şəkildə silahla təmin edilməsinə qədər davam etdi. Bu, atəşkəsi pozdu. Qureyşin onu düzəltmək cəhdi uğursuzluğa düçar olduqdan sonra Məkkəyə gedən yol açıq qaldı.",
      "Nə baş verdi: Peyğəmbər 10.000-ə yaxın səhabə ilə o qədər sürətlə və gizli hərəkət etdi ki, Qureyşin müqavimət göstərməyə vaxtı yox idi. Qüreyşin qoca sərkərdəsi Əbu Süfyan daxil olmaq ərəfəsində çıxıb İslamı qəbul etdi. Ordu demək olar ki, heç bir döyüş olmadan bir neçə istiqamətdən Məkkəyə daxil oldu - yalnız bir kolon qısa silahlı müqavimətlə qarşılaşdı; Peyğəmbər (salləllahu aleyhi və səlləm) öz sərkərdələrinə açıq şəkildə əmr etmişdi ki, onlarla vuruşanlardan başqa döyüşməsinlər.",
      "Amnistiya: Bu fəthi təyin edən məqamdır. Ona işgəncə verən, boykot edən və qovmuş şəhərlə Kəbənin yanında dayanan Peyğəmbər (s) Qureyşdən ondan nə gözlədiklərini soruşdu, sonra Yusifin ona zülm edən qardaşlarına söylədiyi sözləri təkrarlayaraq dedi: “Bu gün sizə heç bir günah yoxdur, gedin, azadsınız”. Ümumi amnistiya əhalini əhatə etdi; yalnız kiçik bir ovuc konkret cinayətlərə görə istisna olunurdu və hətta onların əksəriyyəti onun yanına gəldikdə əfv olundu.",
      'Təmizləmə: Sonra Peyğəmbər (s) Kəbəni 360 bütdən təmizləyərək, “Haqq gəldi, batil yox oldu” (Qur\'an 17:81) deyərək təmizlədi. Bir vaxtlar həmin şəhərdə qul kimi işgəncələrə məruz qalan Bilal ibn Rəbah Kəbənin üstünə çıxıb Məkkə üzərində azan dedi. Ən-Nəsr surəsi - "Allahın zəfəri və fəth gəldiyi zaman" - bu açılışı və onun çoxluğunun imana daxil olmasını qeyd edir.',
      "Davamlı dərslər: bu, hakimiyyətdə həyata keçirilən peyğəmbərlik xarakterinin ən böyük nümayişlərindən biridir. Qələbədəki mərhəmət hər hansı cəzanın verə biləcəyindən daha çox ürək qazandı; bütün müddət ərzində məqsəd intiqam deyil, hidayət idi və güc özünə deyil, mesaja xidmət etmək üçün yaradılmışdı. Bu yerə uyğun olaraq Fəth Məkkə - Açılış - çuval deyil, deyilir.",
    ],
    battleDetails: {
      location: "Məkkə",
      modernLocation: "Məkkə, Səudiyyə Ərəbistanı",
      hijriDate: "Ramazan ayının 8-i",
      muslimForces: "~10,000",
      opposingForces: "Qureyş (demək olar ki, döyüşmədən təslim oldu)",
      muslimCommander: "Məhəmməd peyğəmbər s",
      outcome: "Məkkə demək olar ki, qan tökülmədən açıldı; ümumi amnistiya elan edildi",
      keyEvents: [
        "Qureyş müsəlmanların müttəfiqləri olan Xuzalara hücumu dəstəklədikdə atəşkəs pozuldu.",
        "Əbu Süfyan ordu girməzdən əvvəl İslamı qəbul etdi; onun evi təhlükəsizlik yeri elan edildi.",
        "Peyğəmbər (salləllahu aleyhi və səlləm) ümumi əfv etdi: Bu gün sənə heç bir günah yoxdur, get, azadsan.",
        "Kəbə bütlərindən təmizləndi; Bilal onun üstündən azan dedi.",
        "Keçmiş düşmənlər çoxlu sayda İslamı qəbul etdilər.",
      ],
      leadershipLesson:
        "Qələbədəki mərhəmət ürəkləri qorxu və ya intiqamdan daha uzun müddət qazanır.",
      spiritualLesson:
        "Məqsəd intiqam deyil, rəhbərlik idi - güc özünə deyil, mesaja xidmət etmək üçün verilir.",
    },
    quran: [
      {
        excerpt:
          "Allahın zəfəri və fəth gəldiyi zaman insanların dəstə-dəstə Allahın dininə daxil olduqlarını gördükdə Rəbbini həmd-səna ilə təqdis et və Ondan bağışlanma dilə. Həqiqətən, O, tövbələri qəbul edəndir.",
      },
      {
        excerpt:
          "O dedi: Bu gün sizə heç bir günah yoxdur. Allah sizi bağışlasın və O, rəhm edənlərin ən rəhmlidir. - Həzrət Yusifin sözləri, Peyğəmbər (sallallahu aleyhi və səlləm) fəth günü Qureyşlə səsləşdi.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Huneyn döyüşü",
    summary: "Hicri 8 şəvval — Məkkədən sonra pusqu; güvən sınandı, sonra qələbə qazanıldı.",
    body: [
      "Məzmun və səbəb: Məkkənin açılmasından demək olar ki, iki həftə sonra güclü Həvazin və Səqif qəbilələri müsəlmanları yeni hökmranlıqları qərarlaşmadan vurmaq üçün topladılar. Peyğəmbər (s) böyük bir ordu ilə - təxminən 12.000, o cümlədən bir çox yeni Məkkə müsəlmanları - indiyə qədər toplanmış ən böyük müsəlman qüvvəsi ilə yola çıxdı. Ölçüsünə görə, kişilərdən bəziləri qeyri-adi bir güvən hiss etdilər və məlumat verilir ki, kimsə nömrə çatışmazlığı səbəbindən məğlub ola bilməyəcəklərini qeyd etdi.",
      "Nə oldu: Düşmən dar Huneyn vadisində pusqu qurmuşdu. Müsəlmanlar sübhün yarı işığında enərkən hündürlükdən onların üzərinə ox tufanı yağdı və avanqard qırıldı. Çaxnaşma yayıldı və böyük ordunun çox hissəsi dönüb qaçdı - özünə inam yaradan saylar indi uğursuzluğa düçar oldu.",
      "Dönüş nöqtəsi: Qarışıqlıqda Peyğəmbər (s) qaçmadı. O, qatırını düşmənə tərəf sıxaraq ucadan “Mən Peyğəmbərəm, bu yalan deyil, mən Əbdül-Müttəlibin oğluyam” deyə səsləndi. Mühacir və Ənsarın bir nüvəsi - Abbasın səhabələri adları ilə çağırması ilə - onun ətrafında toplandı. Müsəlmanlar yenidən formalaşdılar, pusquya düşənləri işə saldılar və onları darmadağın etdilər; əsirlər və böyük qənimətlər götürüldü.",
      "Nəticə: Kampaniya Taifin mühasirəsinə qədər davam etdi, lakin bir anda düşmədi. Daha sonra Həvazinlər öz qövmlərini axtarmağa gələndə Peyğəmbər (sallallahu aleyhi və səlləm) əsirləri geri qaytardı - qənimət saxlamaqdansa barışığı və qəlblərin yumşalmasını seçdi və onları imana bağlamaq üçün səxavətlə yeni Məkkəli müsəlmanlara üstünlük verdi.",
      "Qurani-kərim rəqəmlərə güvənməyin təhlükəsini açıqlayaraq bu günə müraciət edir: “Hüneyn günündə çoxluğunuz sizi razı salsa da, sizə heç bir fayda vermədiyi zaman... Allah öz rahatlığını nazil etdi” (9:25-26). Davamlı dərs aydındır - heç vaxt rəqəmlərə, sərvətə və ya son uğura arxalanmayın; Qələbə yalnız Allahın hədiyyəsidir - və ardıcılları çaxnaşmaya düşəndə ​​möhkəm dayanan və görünən liderin əkiz fəzilətidir.",
    ],
    battleDetails: {
      location: "Məkkə ilə Taif arasında yerləşən Huneyn vadisi",
      modernLocation: "Taif yaxınlığında, Səudiyyə Ərəbistanı",
      hijriDate: "Şəvval 8 hicri",
      muslimForces: "~12,000 (bir çox yeni Məkkəyə çevrilənlər daxil olmaqla)",
      opposingForces: "Həvazin və Səqif",
      muslimCommander: "Məhəmməd peyğəmbər s",
      outcome: "İlkin məğlubiyyətdən sonra müsəlmanların qələbəsi",
      keyEvents: [
        "Ən böyük müsəlman ordusu döyüşdən əvvəl öz sayına inamı artırmışdı.",
        "Vadidəki sübh pusqusu avanqardı dağıtdı və geniş çaxnaşma yaratdı.",
        "Peyğəmbər (s) möhkəm dayandı və möminləri geri çağırdı; bir nüvə onun ətrafında cəmləşdi.",
        "Müsəlmanlar yenidən formalaşıb düşməni darmadağın etdilər; Taif mühasirəsi izlədi.",
        "Sonradan barışıq jesti olaraq əsirlər geri qaytarıldı.",
      ],
      leadershipLesson:
        "Rəhbər ardıcıllar çaxnaşmaya düşdükdə görünən və sabit olmalıdır - varlıq sıraları toplayır.",
      spiritualLesson:
        "Heç vaxt rəqəmlərə və ya son nailiyyətlərə etibar etməyin; qələbə və əmin-amanlıq ancaq Allahdandır.",
    },
    quran: [
      {
        excerpt:
          "Allah sizə bir çox bölgələrdə qələbə bəxş etdi və çoxluğunuz sizi razı salsa da, heç bir fayda vermədiyi Huneyn günündə, yer üzü bütün genişliyinə görə üzərinizə qapandı və siz geriyə dönüb geri çəkildiniz. Sonra Allah Öz Peyğəmbərinə və möminlərə öz aramlığını nazil etdi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Əl-Bəra ibn Azibdən soruşdular ki, onlar Huneyn günü qaçıblarmı? Dedi: Amma Rəsulullah (sallallahu aleyhi və səlləm) qaçmadı. Camaat geri döndü və Peyğəmbər (s) ağ qatırının üstündə idi və dedi: Mən Peyğəmbərəm, bu yalan deyil. Mən Əbdül-Müttəlibin oğluyam.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Təbuk ekspedisiyası",
    summary: "Rəcəb 9 hicri - ən ağır yürüş, yayın istisində, döyüşsüz imanı sınamaq.",
    body: [
      'Kontekst və səbəb: Şimal sərhəddində böyük Bizans səfərbərliyi barədə xəbərlər Mədinəyə çatdı. Həzrət Peyğəmbər (s) Təbuk səfərinə çağırdı - və qeyri-adi olaraq, getdiyi yeri gizlətmək əvəzinə açıq şəkildə adlandırdı, çünki yürüş o qədər uzun və çətin olacaq ki, hamı vicdanla hazırlaşmalı idi. O, yüksək yayın şiddətli istisində, məhsul yığımında, səyahət və xərclərin ən ağır olduğu vaxt düşdü - bu, "çətinlik ekspedisiyası" kimi tanındı.',
      "Qurban sınağı: Dəvət camaatın qəlbini açıb. Osman ordunun böyük bir hissəsini öz sərvətindən təchiz etdi; Əbu Bəkr sahib olduğu hər şeyi verdi; Ömər onun yarısını verdi. Verməyə heç nəyi olmayan ən kasıb səhabələr iştirak edə bilmədiklərinə görə ağladılar - Quranda onların göz yaşları qeyd olunur (9:92). Onların qarşısında geridə qalmaq üçün bəhanələr uyduran və Tövbə surəsinin uzun-uzadı ifşa etdiyi münafiqlər dayanmışdı.",
      "Nə baş verdi: Peyğəmbərin (sallallahu aleyhi və səlləm) rəhbərlik etdiyi ən böyük ordu, bəlkə də 30.000 nəfərlik ordu yorucu bir yürüşdən sonra Təbuk şəhərinə çatdı. Döyüşmək üçün heç bir Bizans qüvvəsi görünmədi. Ekspedisiya boş bir nəticədən çox, sərhəd tayfaları və şimal hökmdarları ilə müqavilələr bağladı, cəmiyyətin təhlükəsizliyini genişləndirdi və təcavüzün qarşısını alan bir hazırlıq nümayiş etdirdi.",
      "Geridə qalan üç nəfər: Qalanlar arasında üç səmimi mömin də var idi - Kəb ibn Malik, Hilal ibn Üməyyə və Mürarə ibn Rəbi' - onların heç bir üzrləri yox idi və ən əsası bu barədə yalan danışmaqdan imtina etdilər. Onların tövbələri qəbul olunana və Qur'an onların bağışlanmalarını elan edənə qədər yer üzləri “böyük olduğu kimi” onlara bağlanaraq əlli gün boykot edildi (9:118). Onların mühakimə zamanı dürüstlüyü serahın ən təsirli epizodlarından biridir.",
      "Qalıcı dərslər: camaatı müdafiə etməyə hazır olmaq, qılınc çəkilməsə belə, iman aktıdır; dərhal, görünən mükafatı olmayan qurban kəsmə imtahanların ən yüksəklərindəndir; və doğruluq - Kəbin yalanla özünü xilas etməkdən imtina etməsi - Allah yanında rahat yalandan daha sevimlidir. Tövbə surəsi bütün səfəri bu mövzular ətrafında qurur.",
    ],
    battleDetails: {
      location: "Tabuk, Bizans sərhəddinə doğru yolda",
      modernLocation: "Təbuk, Səudiyyə Ərəbistanı",
      hijriDate: "Rəcəb 9 hicri",
      muslimForces: "~30.000 (Peyğəmbərin (s) rəhbərlik etdiyi ən böyük ordu)",
      opposingForces: "Bizans ordusunun olduğu bildirildi, lakin döyüşə gəlmədi",
      muslimCommander: "Məhəmməd peyğəmbər s",
      weather: "Həddindən artıq yay istisi, məhsul yığımı zamanı",
      outcome: "Döyüş yoxdur; şimal müqavilələri təmin edildi; cəmiyyət sınaqdan keçirdi və süzdü",
      keyEvents: [
        "Həzrət Peyğəmbər (s) yürüşün çətinliyi üzündən uzaq gedəcəyi yeri açıq şəkildə adlandırdı.",
        "Osman, Əbu Bəkr, Ömər və başqaları səxavətlə verdilər; Ən kasıblar verəcək heç nəyi olmadığına ağlayırdılar.",
        "Tövbə surəsində münafiqlər arxada qalmaq üçün bəhanələr gətirdilər və ifşa olundular.",
        "Heç bir düşmən məşğul deyil; şimal tayfaları və hökmdarları ilə müqavilələr bağlanırdı.",
        "Üç sadiq mömin tövbələri qəbul olunana qədər 50 gün ərzində boykot edildi (Qur'an, 9:118).",
      ],
      leadershipLesson:
        "Çətinlik və onun dəyəri haqqında dürüst olun; şəffaflıq inam yaradır və istəyənləri hazırlayır.",
      spiritualLesson:
        "Görünən mükafatı olmayan qurban kəsmək və sınaq zamanı doğruluq imanın ən yüksək imtahanlarındandır.",
    },
    quran: [
      {
        excerpt:
          "Geridə qalanlar isə Allah Rəsulunun (sallallahu aleyhi və səlləm) arxasında qaldıqlarına sevinir, malları və canları ilə Allah yolunda cihad etməyi xoşlamırdılar və dedilər: İstidə döyüşə çıxmayın. De: “Cəhənnəm atəşi daha şiddətlidir, kaş anlaya bilsələr.",
      },
      {
        excerpt:
          "O, geridə qalan üç nəfəri də bağışladı, nə qədər geniş olsa da, yer üzü onların üstünə, öz canları da onlara bağlandı və onlar Allahdan başqa heç bir sığınacaq olmadığına əmin oldular. Sonra tövbə etsinlər deyə, onlara tövbə etdi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kəb ibn Malik üzrsüz olaraq Təbukdan geri qaldığını və bu barədə yalan danışmadığını nəql edir; Peyğəmbər (salləllahu aleyhi və səlləm) möminlərə əmr etdi ki, yer üzü onlar üçün dar olana qədər əlli gecə onunla və iki yoldaşı ilə danışmasınlar - sonra onların bağışlanması nazil oldu və bu, onun həyatının ən xoşbəxt günlərindən idi.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ghazavat və Saraya",
    summary: "Böyük kampaniyalar və kiçik dəstələr arasındakı fərq.",
    body: [
      "Qəzvə, Peyğəmbərin (sallallahu aleyhi və səlləm) şəxsən iştirak etdiyi bir səfərdir - alimlər Bədr, Uhud, Xəndək, Hudeybiyyə, Xeybər, Məkkənin fəthi, Huneyn və Təbukun da daxil olduğu təxminən iyirmi yeddi nəfərdir.",
      "Səriyyə (cəm halında saraya) Peyğəmbərin (sallallahu aleyhi və səlləm) qoşulması olmadan adı çəkilən bir sərkərdə altında göndərilən dəstədir - kəşfiyyat, basqınlara cavab vermək, müşayiət etmək və ya qəbilələri İslama dəvət etmək üçün təxminən 50 belə missiya qeydə alınmışdır.",
      "Bir çox saraya heç bir döyüşə getmədi - bunlar diplomatiya, patrul və ya döyüşü lazımsız edən güc nümayişi idi. Digərləri, Muta səfəri kimi, ciddi döyüşlər və ağır itkilər verdi.",
      "Bu fərqi başa düşmək erkən İslamda “döyüşlərin” sayını şişirtməkdən qoruyur. Təxminən on il ərzində faktiki meydançalı döyüşlər az idi; Əksər yürüşlər qabaqlayıcı, diplomatik və ya qansız idi və mənbələr bütün peyğəmbərlik dövrünü öz dövrü üçün can itkisi baxımından olduqca yüngül hesab edir.",
    ],
    actions: [
      "Hansı hadisələrin döyüşlər, hansı mühasirələr və hansının döyüşsüz yürüşlər olduğunu görmək üçün vaxt cədvəlinə baxın.",
      "Kateqoriyaları aydın tutmaq üçün qəzva və səriyyə üçün lüğət qeydlərini oxuyun.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Peyğəmbərdən sonra gedən döyüşlər",
    summary: "Rəhbəri Xəlifələr altındakı əsas tapşırıqlar peyğəmbərlik dövründən fərqlidir.",
    body: [
      "Həzrət Peyğəmbər (s) hicri 11-ci ildə (miladi 632-ci ildə) vəfat etdikdən sonra camaata xəlifələr Əbu Bəkr, Ömər, Osman və Əli (Allah onlardan razı olsun) tərəfindən Riddə (mürtədlik) müharibələri, Sasani Farsları və Bizans Suriyasına yayılma və nəticədə daxili fitnə baş verdi.",
      "Bu hadisələr İslam tarixinə aiddir, lakin Peyğəmbərin öz hərəkətləri kimi sünnə deyil. Onlar tarixin alətləri ilə və müsəlman alimlərinin özlərinin onların təfərrüatlarını, motivlərini və dərslərini müzakirə etdiklərinin şüuru ilə öyrənilməlidir.",
      "Əl-Qadisiyyə döyüşü (təxminən 636-cı il): Səd ibn Əbi Vəqqas İraqda Sasani ordusuna qarşı müsəlman qüvvələrinə rəhbərlik etdi - bu, Farsları açan bir dönüş nöqtəsi oldu.",
      "Yarmuk Döyüşü (636 CE): Xalid ibn əl-Valid də daxil olmaqla komandirlər Bizanslılarla Levantda böyük Bizans sahə gücünü sona çatdıran həlledici bir kampaniyada Suriyada görüşdülər - peyğəmbərlik sünnəsi kimi deyil, hərbi tarix kimi öyrənildi.",
      "Nəhavənd döyüşü (e. 642-ci il): ərəb mənbələrində “Qələbələrin Qələbəsi” kimi xatırlanan Sasanilərin qalan müqavimətini qırdı. Tarixlər və qoşun rəqəmləri tarixçilər arasında dəyişir.",
    ],
    actions: [
      "Əvvəlcə peyğəmbərlik döyüşlərini öyrənin - bunlar əsas mənəvi və hüquqi istinaddır.",
      "Sonrakı fəthlərə nüansla yanaşın; nə müharibəni tərənnüm edin, nə də mürəkkəb tarixi şüarlara düzəltməyin.",
    ],
    disclaimer:
      "Tarixçilər arasında peyğəmbərlikdən sonrakı fəthlərin sayları, motivləri və əxlaqi qiymətləndirmələri müzakirə olunur. Bu icmal polemik deyil, oriyentasiya üçündür.",
  },
  {
    title: "Liderlik dərsləri",
    summary: "Səbir, şura, rəhmət və Allaha təvəkkül – sadəcə taktika deyil.",
    body: [
      "Münaqişədə liderliyin peyğəmbərlik modeli xarakteri zəkadan üstün tutur. Əsas qərarlar məsləhətləşmə (şura) yolu ilə qəbul edilirdi - Bədrdəki quyular, Konfederasiyanın mühasirəsindəki xəndəklər, Hudeybiyyədəki şərtlər - hətta vəhyin sonradan nəticəni təsdiqlədiyi yerlərdə belə. Rəhbərlik hərəkətə keçməmişdən əvvəl dinlədi.",
      'Səbir hər qələbənin qövsünü formalaşdırırdı. Hüdeybiyyənin çətin sülhü iki il ərzində Məkkənin açılışına səbəb oldu. Məkkədə mərhəmət - "Get, sən azadsan" - camaatı təqib edən insanlara qalib gəldi. Uhudda öyrənilən acı intizam həmin fəlakətin təkrarlanmasının qarşısını aldı.',
      "Qılıncın üstündə olduğu kimi cəsarət göstərildi: ordu Huneyndə qaçanda möhkəm dayandı və göründü; qazıcılarla yanaşı səngərdə torpaq daşımaq; və - ən çətini - bir vaxtlar sizi evinizdən qovmuş insanları tam güc saatında bağışlamaq.",
      "Allaha təvəkkül etmək (təvəkkül) heç vaxt vasitələrdən imtina etmək demək deyildir. Kəşfiyyatçılar göndərildi, yer seçildi, zireh geyildi, səngərlər qazıldı, varislərin adları verildi və müqavilələrə hörmət edildi. Möminlər əllərindən gələni etdilər və nəticəni Allaha tapşırdılar - tam səy və tam təvəkkül birliyi modelin ürəyidir.",
    ],
    actions: [
      "Çətin bir qərar verməzdən əvvəl soruşun: mən həqiqətən elm sahibləri ilə məsləhətləşdimmi?",
      "Müvəffəqiyyətdən sonra soruşun: mərhəmət göstərirəm, yoxsa qürur hissimi?",
      "Uğursuzluq zamanı soruşun: düzəltmək üçün itaətsizlik varmı, yoxsa Allahın mənim üçün öyrənmək istədiyi bir dərs varmı?",
    ],
    appLinks: [{}],
  },
  {
    title: "Döyüşlər haqqında səhih hədislər",
    summary: "Qiymətləndirmə ilə seçilmiş rəvayətlər — davranış, səbir və əsas hadisələr haqqında.",
    body: [
      "Səfərlərlə bağlı hədislərə istinad etməzdən əvvəl səhihliyi yoxlanılmalıdır. Aşağıdakı rəvayətlər “Səhih” məcmuələrindən götürülmüşdür və bu kampaniyaların gedişi və ruhuna aiddir; hər biri öz dərəcəsini daşıyır.",
      "Müəyyən bir nişanla bağlı rəvayətlər üçün həmin döyüşün öz mövzusuna baxın. Tam zəncirləri oxumaq və kontekstdə qiymətləndirmək üçün Munib-in hədis brauzerindən istifadə edin.",
    ],
    hadith: [
      {
        excerpt:
          "Düşmənlə qarşılaşmaq istəməyin və Allahdan salamatlıq diləyin. Onlarla qarşılaşdığınız zaman səbr edin və bilin ki, Cənnət qılıncların kölgəsi altındadır.",
      },
      {
        excerpt:
          "Peyğəmbər (s) buyurur: “Müharibə hiylədir. — Alimlər bunu heç vaxt müqaviləni pozmaq və ya qorunan tərəfə xəyanət etmək üçün lisenziya kimi döyüşdə taktiki hiylələrə icazə (fiints, sürpriz, yanlış istiqamətləndirmə) kimi izah edirlər.",
      },
      {
        excerpt:
          "Peyğəmbər səllallahu aleyhi və səlləm bir sərkərdə təyin edərkən ona Allahdan qorxmağı, döyüşdən əvvəl düşməni İslama dəvət etməyi, əhdi pozmamağı, şikəst etməməyi və uşağı öldürməməyi əmr etdi.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "İstinadlar və mənbələr",
    summary: "Klassik seerah işləri və onları tənqidi oxumaq.",
    body: [
      "Əsas sirə mənbələrinə İbn İshaqın “Sirah”ı (İbn Hişam vasitəsilə qorunub saxlanılmışdır), əl-Vaqidinin “Kitab əl-Məğazi”, İbn Sədin “Tabaqat”ı və İbn Kəsirin “əl-Bidayə vən-Nihayə”si daxildir. Hər birinin öz güclü tərəfləri və elmi xəbərdarlıqları var.",
      "İbn İshaq (İbn Hişam vasitəsilə) əsas rəvayətdir; əl-Vaqidi zəngin döyüş təfərrüatları verir, lakin onun bəzi xəbərləri hədis tənqidçiləri tərəfindən mübahisəlidir; İbn Kəsir tarixi hədis tənqidi ilə sintez edir və qiymət verməkdə diqqətli olur.",
      "Bu hadisələrlə bağlı Qur'an ayələri ən mötəbər mətnlərdir. Davranış, hüquq və əxlaq məsələlərində əl-Buxari və Müslimin səhih hədisi təsdiqlənməmiş sirə xəbərlərindən üstündür.",
      "Tarixçilərin fərqləndiyi yerlərdə - dəqiq ordu ölçüləri, bəzi tarixlər və bəzi post-peyğəmbərlik kampaniyalarının mənəvi qiymətləndirilməsi - bu modul dəqiqlik icad etmək əvəzinə qeyri-müəyyənliyi qeyd edir. Burada qeyd edilən hər bir hədis sayı və dərəcəsinə görə məcmuələr arasında yoxlanılmışdır.",
    ],
    actions: [
      "Əvvəlcə Qurana qarşı hər hansı bir döyüş təfərrüatını, sonra səhih hədisi, sonra sirəni yoxlayın.",
      "Hər hansı bir fətva və ya müasir tətbiqlə bağlı sualınız üçün ixtisaslı alimlərə müraciət edin - bu modul hökm deyil, tərbiyəvidir.",
    ],
    appLinks: [{}, {}],
  },
];

export const BATTLES_VERSES_AZ: DeepPartial<BattlesVerse>[] = [
  {
    excerpt:
      "Zülm edildiyi üçün döyüşənlərə icazə verilir... Əgər Allah bir camaatı digəri ilə yoxlamasaydı, monastırlar, kilsələr, sinaqoqlar, məscidlər dağılardı.",
    context:
      "Döyüş üçün ilk ümumi icazə - Məkkədə uzun illər davam edən silahsız təqiblərdən sonra.",
  },
  {
    excerpt:
      "Sizinlə vuruşanlarla Allah yolunda vuruşun, lakin həddi aşmayın. Həqiqətən, Allah həddi aşanları sevməz.",
    context: "Təməl həddi: yalnız müdafiə, sərhədləri aşmağın qəti qadağanı ilə.",
  },
  {
    excerpt:
      "Siz Rəbbinizdən kömək dilədiyiniz zaman O, belə cavab verdi: “Mən sizi sıra-sətbə min mələklə qüvvətləndirəcəyəm.",
    context: "Bədrlə bağlı nazil olmuşdur – sayca çox olan möminlərə ilahi yardım.",
  },
  {
    excerpt:
      "Qarşılaşan iki orduda sizin üçün bir ibrət vardır: biri Allah yolunda vuruşur, digəri isə kafirlərdəndir.",
    context: "Allah Bədirdə müsəlmanları düşmənə daha çox göstərdi, qəlblərə qüvvət verdi.",
  },
  {
    excerpt:
      "Şübhəsiz ki, siz onları Onun izni ilə öldürdüyünüz zaman Allah sizə verdiyi vədini yerinə yetirdi, nəhayət ki, siz cəsarətinizi itirdiniz, əmr barəsində mübahisə etdiniz və sevdiyiniz şeyi sizə göstərdikdən sonra asi oldunuz.",
    context: "Oxçuların itaətsizliyinə və Uhudda dönüş nöqtəsinə müraciət edir.",
  },
  {
    excerpt:
      "Ey iman gətirənlər, Allahın sizə olan nemətini xatırlayın ki, sizə qoşunlar gəldi və biz onların üstünə külək və görmədiyiniz ordular göndərdik.",
    context: "Əl-Əhzab surəsi Konfederasiya mühasirəsi və ilahi yardım haqqında.",
  },
  {
    excerpt:
      "O, kitab əhlindən onlara yardım edənləri qalalarından endirdi və onların qəlblərinə qorxu saldı. Onların torpaqlarını və yurdlarını sizə varis etdi.",
    context:
      "Mühasirə zamanı əhdi pozan Bənu Qureyzə haqqında Əhzab surəsi — imana qarşı hökm deyil, müharibə zamanı xəyanətin məhdud bir epizodu.",
  },
  {
    excerpt:
      "Həqiqətən, Biz sənə açıq-aydın bir qələbə bəxş etdik ki, Allah sənin əvvəlki və sonrakı günahlarını bağışlasın, sənə olan nemətini tamamlasın və səni düz yola yönəltsin.",
    context:
      "Hüdeybiyyədən qayıdanda nazil oldu - səhabələrin ilk dəfə acı bir güzəşt kimi hiss etdiklərini açıq-aşkar bir qələbə kimi adlandırdılar.",
  },
  {
    excerpt:
      "Şübhəsiz ki, Allah möminlərdən ağacın altında sənə beyət etdikləri zaman onlardan razı qaldı və onların ürəklərində olanı bildi, buna görə də onlara aramlıq nazil etdi və onları yaxın bir fəthlə mükafatlandırdı.",
    context:
      "Rıdvan beyəti — 1400-ə yaxın səhabə bir akasiya ağacının altında qaçmayacağına söz verdi və Allah onlardan razılığını bildirdi.",
  },
  {
    excerpt:
      "Allahın zəfəri və fəth gəldiyi zaman insanların dəstə-dəstə Allahın dininə daxil olduqlarını gördükdə Rəbbini həmd-səna ilə təqdis et və Ondan bağışlanma dilə. Həqiqətən, O, tövbələri qəbul edəndir.",
    context:
      "Ən-Nəsr surəsi Məkkənin açılışı - zəfərlə deyil, həmd-səna, bağışlanma diləməsi və imana daxil olan izdihamla taclanmış bir fəth.",
  },
  {
    excerpt:
      "Allah sizə bir çox bölgələrdə qələbə bəxş etdi... Sonra Allah Öz Peyğəmbərinə və möminlərə rahatlıq nazil etdi.",
    context: "Allah möminlərə xatırladır ki, zəfər Onun hədiyyəsidir, sayla öyünmək deyil.",
  },
  {
    excerpt:
      "Geridə qalanlar isə Rəsulullahdan geri qalmalarına sevinir, Allah yolunda malları və canları ilə cihad etməyi sevmirdilər.",
    context: "Tövbə surəsi çətin Təbuk yürüşündən üzr istəyənlərə xitab edir.",
  },
];

export const BATTLES_TIMELINE_AZ: DeepPartial<BattlesTimelineEvent>[] = [
  {
    title: "İlk ifşa",
    body: "Peyğəmbər (s) Hira mağarasında Əl-Ələq surəsinin ilk ayələrini alır. İllərdir çağırış dinc xarakter daşıyır - döyüşməyə icazə yoxdur.",
    location: "Məkkə",
  },
  {
    title: "İctimai çağırış və təqib",
    body: "Açıq təbliğat işgəncə, boykot və şəhidlik gətirir. Müsəlmanlar silahlı qisas almadan dözürlər - səbir və köç öyrədilmiş cavablardır.",
    location: "Məkkə",
  },
  {
    title: "Mədinəyə hicrət",
    body: "Müsəlman icması Yəsribdə (Mədinədə) hakimiyyət qurur. Yəhudi qəbilələri ilə bağlanan müqavilələr və Mədinə Konstitusiyası birgəyaşayış qaydaları müəyyən edir.",
    location: "Mədinə",
  },
  {
    title: "Bədr döyüşü",
    body: "Ramazan ayının 17-də təxminən 313 müsəlman daha böyük bir Qureyş ordusunu məğlub etdi - ilk böyük döyüş və həlledici mənəvi qələbə.",
    location: "Bədr",
  },
  {
    title: "Uhud döyüşü",
    body: "Müsəlmanlar əvvəlcə yer qazanırlar, lakin oxatanların postlarını tərk etməsi ağrılı uğursuzluğa səbəb olur. Qur'an o günün dərslərinə xitab edir.",
    location: "Uhud dağı",
  },
  {
    title: "Xəndək döyüşü",
    body: "Konfederasiya ordusu Mədinəni mühasirəyə alır. Xəndək qazmaq - Salmanın təklifi - döyüş olmadan mühasirəni qırır.",
    location: "Mədinə",
  },
  {
    title: "Bənu Qureyzə",
    body: "Mühasirə zamanı Mədinə əhd-peymanını pozan Bənu Qureyzə təslim oldu və öz seçdikləri bir hakim Səd ibn Muaz tərəfindən mühakimə olunmasını xahiş etdi.",
    location: "Mədinə",
  },
  {
    title: "Hudeybiyyə müqaviləsi",
    body: "Güzəşt kimi görünən on illik barışıq Qur'anın təbirincə desək, açıq-aşkar qələbəyə çevrildi - ağacın altında Rıdvan beyəti verildi, ibadətlər yayıldı və Məkkəyə gedən yol açıldı.",
    location: "Hudeybiyyə",
  },
  {
    title: "Muta döyüşü",
    body: "Roma sərhədinə ekspedisiya; Xalid ibn əl-Valid ordunu sağ-salamat geri çəkməzdən əvvəl təyin olunmuş üç komandir ardıcıl olaraq şəhid olur.",
    location: "Muta",
  },
  {
    title: "Xeybər səfəri",
    body: "Mədinənin şimalında düşmənçilik edən yəhudi qalaları darmadağın edildi. Əbu Bəkr və Ömərin mühakimə olunmasından sonra bayraq Əli ibn Əbi Talibə verilir.",
    location: "Xeybər",
  },
  {
    title: "Məkkənin fəthi",
    body: "Qureyş müqaviləni pozdu; Peyğəmbər on min səhabə ilə yürüş edir və demək olar ki, qan tökülmədən Məkkəyə daxil olur - ümumi amnistiya elan edilir.",
    location: "Məkkə",
  },
  {
    title: "Huneyn döyüşü",
    body: "Həvazin və Səqif Məkkədən sonra müsəlmanları pusquya salırlar. Peyğəmbər (s) möminləri onun ətrafında toplaşmağa çağırdıqda ilkin çaxnaşma yerini qələbəyə verir.",
    location: "Huneyn",
  },
  {
    title: "Təbuk ekspedisiyası",
    body: "Roma sərhədinə doğru çətin yay yürüşü. Döyüş baş vermir, lakin nifaq üzə çıxır və Tövbə surəsi geridə qalanlara müraciət edir.",
    location: "Təbuk",
  },
  {
    title: "Əlvida Həcc ziyarəti",
    body: "Peyğəmbər (s) həcc ziyarətini yerinə yetirir və vida xütbəsini oxuyur. O, qısa müddət sonra Mədinədə vəfat edir - peyğəmbərlik döyüşləri dövrü bağlanır.",
    location: "Məkkə",
  },
];

export const BATTLES_FIGURES_AZ: DeepPartial<BattlesFigure>[] = [
  {
    name: "Əbu Bəkr əs-Siddiq",
    epithet: "Allah ondan razı olsun",
    summary:
      "Peyğəmbərin ən yaxın yoldaşı, ilk həddi-büluğa çatmış mömin kişi və hicrətdə yoldaşı.",
    role: "Erkən kampaniyalarda məsləhətçi, döyüşçü və bayraqdar.",
    lesson:
      "Təzyiq altında sabit sədaqət və doğruluq - hər hansı bir qələbədən əvvəl sərvətini zülmə məruz qalan müsəlmanları azad etmək üçün sərf etdi.",
  },
  {
    name: "Ömər ibn əl-Xəttab",
    epithet: "Allah ondan razı olsun",
    summary: "Zülm illərində İslama daxil oldu və imanın ən güclü müdafiəçilərindən biri oldu.",
    role: "İkinci xəlifə kimi mübariz və sonradan ədalət memarı.",
    lesson:
      "Cəsarətlə cavabdehlik birləşdi - Hüdeybiyyədə Peyğəmbərin rəyindən fərqli olanda o, nəsihəti açıq qəbul etdi.",
  },
  {
    name: "Əli ibn Əbi Talib",
    epithet: "Allah ondan razı olsun",
    summary: "Peyğəmbərin (s) əmisi oğlu və kürəkəni; İslamı qəbul edən ilk uşaqlar arasındadır.",
    role: "Tək döyüş üzrə çempion və Xeybərdə bayraq daşıyıcısı.",
    lesson:
      "Təvazökarlıqla şücaət - hicrət gecəsi Peyğəmbərin yatağında yatdı və missiyanın davam etməsi üçün həyatını riskə atdı.",
  },
  {
    name: "Həmzə ibn Əbdülmuttalib",
    epithet: "Allah ondan razı olsun",
    summary:
      "İslamı qəbul etdikdən sonra Əsədullah (Allahın Aslanı) kimi tanınan Peyğəmbərin əmisi.",
    role: "Bədr və Uhudda elit döyüşçü və mənəvi lider.",
    lesson:
      "Şəhidlik məğlubiyyət deyil - Uhudda ölümü Peyğəmbəri dərindən kədərləndirdi, lakin missiyanı başa çatdırmaq əzmini gücləndirdi.",
  },
  {
    name: "Xalid ibn əl-Valid",
    epithet: "Allah ondan razı olsun",
    summary:
      "Hudeybiyyədən sonra İslamı qəbul edən və Seyfullah (Allahın qılıncı) olmuş parlaq Qureyş sərkərdəsi.",
    role: "İslamdan əvvəl Uhudda müsəlmanlara qarşı cinah süvarilərinə rəhbərlik etdi; sonra Muta komandanlığını öz üzərinə götürdü və xəlifə yürüşlərində həlledici rol oynadı.",
    lesson:
      "Keçmiş müxalifət səmimi tövbəyə heç bir maneə deyil - Uhudda müsəlmanları vuran bacarıq, iman onun qəlbinə daxil olduqdan sonra tamamilə Allah yolunda yönəldilmişdir.",
  },
  {
    name: "Səd ibn Əbi Vəqqas",
    epithet: "Allah ondan razı olsun",
    summary: "Vəd edilmiş Cənnətdən biri; cəmiyyətin məşhur oxatanıdır.",
    role: "Uhudda oxatan; daha sonra xəlifə Ömərin rəhbərliyi altında əl-Qadisiyyədəki müsəlman ordularına rəhbərlik etdi.",
    lesson:
      "Öz rolunda nizam-intizam — oxatma onun xidmətini müəyyən edirdi; sonralar bu dəqiqliyi bir millətin liderliyinə daşıdı.",
  },
  {
    name: "Salman əl-Farisi",
    epithet: "Allah ondan razı olsun",
    summary: "Uzun bir mənəvi səfərdən sonra Mədinədə müsəlmanlara qoşulan farslı bir axtarıcı.",
    role: "Xəndək qazmağı təklif etdi - ərəblərə tanış olmayan fars taktikası.",
    lesson:
      "Hikmət hər hansı bir fondan gələ bilər - şura, Allah onu harada yerləşdirirsə, eşitmək deməkdir.",
  },
  {
    name: "Zeyd ibn Harisə",
    epithet: "Allah ondan razı olsun",
    summary:
      "Peyğəmbərin azad edilmiş insanı və sevimli yoldaşı və müsəlman ordusuna təyin edilmiş ilk sərkərdə.",
    role: "Muta səfərinə rəhbərlik etdi; Orada şəhid olan üç komandirdən birincisi olaraq adları düşəcək.",
    lesson:
      "Nəsil üzərində ləyaqət - daha yüksək qəbilə rütbəsinə malik kişilər iştirak etdikdə rəhbərlik etmək üçün seçildi.",
  },
  {
    name: "Səd ibn Muaz",
    epithet: "Allah ondan razı olsun",
    summary: "Ənsarın ən qədim və hörmətlilərindən biri olan Mədinənin Əvs qəbiləsinin başçısı.",
    role: "Xəndəkdə yaralananlar; Bəni Qureyzə öz taleyinə hakim olaraq seçilmişdir.",
    lesson:
      "Razılaşdırılmış hakim vasitəsilə ədalət - hətta məğlub olan düşmənə də yoxlanılmamış qisas almaqdansa, qərəzsiz hakimə icazə verilirdi; az sonra aldığı yaradan öldü.",
  },
];

export const BATTLES_LESSON_CARDS_AZ: DeepPartial<BattlesLessonCard>[] = [
  {
    battleTitle: "Bədr döyüşü",
    lesson: "Tam hazırlaşarkən Allaha təvəkkül edin.",
    detail:
      "Təxminən üçə bir olan müsəlmanlar hələ də quyuların başında yer seçir, sıralarını düzür və dua edirdilər - Peyğəmbər ﷺ paltarı düşənə qədər gecə boyu Allaha yalvarırdı. Səy və təvəkkül birlikdə və qələbə Allaha məxsusdur.",
  },
  {
    battleTitle: "Uhud döyüşü",
    lesson: "Əmrə tabe olmaq camaatı qoruyur.",
    detail:
      "Qənimət axtarmaq üçün postunu tərk edən oxatanlar az qala ordunu darmadağın edən cinah açdılar. Qur'an bunu hər nəsil üçün intizam dərsi olaraq qeyd edir.",
  },
  {
    battleTitle: "Xəndək döyüşü",
    lesson: "Planlaşdırma və məsləhətləşmə gücü artırır.",
    detail:
      "Salmanın səngər ideyası Peyğəmbərin şurası və möminlərin zəhməti ilə birləşərək müdafiəçilərdən qat-qat böyük bir koalisiyanı zərərsizləşdirdi.",
  },
  {
    battleTitle: "Hudeybiyyə müqaviləsi",
    lesson: "Səbir ən həqiqi qələbə ola bilər.",
    detail:
      "Səhabələr barışığı rüsvayçılıq kimi hiss etdilər və Ömər bunu açıq şəkildə sorğuladı; Əl-Fəth surəsi bunu aşkar qələbə adlandıraraq cavab verdi. On illik sülh yolları açdı, İslam həmişəkindən daha sürətlə yayıldı və iki il ərzində Məkkəyə gedən yollar açıldı.",
  },
  {
    battleTitle: "Bənu Qureyzə",
    lesson: "Himayə əhdini pozmaq ən ağır xəyanətlərdəndir.",
    detail:
      "Bəni Qureyzə Mədinənin əhd-peymanını müttəfiqlərin şəhəri mühasirəyə aldıqları anda pozdu. Bununla belə, Peyğəmbər (sallallahu aleyhi və səlləm) onların öz seçdikləri hakim tərəfindən mühakimə olunmasına icazə verdi - razılaşdırılmış hakim vasitəsilə ədalət, yoxlanılmamış intiqam deyil.",
  },
  {
    battleTitle: "Məkkənin fəthi",
    lesson: "Qələbədən sonra mərhəmət qalibi yüksəldir.",
    detail:
      "Onu işgəncəyə məruz qoyub qovmuş şəhərlə indi öz mərhəmətinə görə Peyğəmbər (s) Yusifin sözlərini təkrarladı: “Bu gün sənə heç bir günah yoxdur, get, azadsan”. Ümumi amnistiya intiqamı əvəz etdi və heç bir cəzanın qazana bilməyəcəyi ürəklər qazanıldı.",
  },
  {
    battleTitle: "Huneyn döyüşü",
    lesson: "Rəqəmlər və son nailiyyətlər qələbəyə zəmanət vermir.",
    detail:
      "Məkkədən sonra ordunun böyüklüyünə görə qürur ilk çaxnaşmaya səbəb oldu. Möminlər ancaq Peyğəmbərə (sallallahu aleyhi və səlləm) və Allaha tərəf döndükləri zaman yenidən birləşdilər.",
  },
  {
    battleTitle: "Təbuk ekspedisiyası",
    lesson: "Çətinlikdə qurban vermək həqiqi imanı üzə çıxarır.",
    detail:
      "Yürüş şiddətli düşmənə qarşı qızmar istidə baş verdi. Var-dövlətini verənlər də, yoxsulluğa rəğmən yürüş edənlər də eyni cür təriflənirdilər.",
  },
  {
    battleTitle: "Muta döyüşü",
    lesson: "Rəhbərliyin ardıcıllığı planlaşdırılmalıdır.",
    detail:
      "Peyğəmbər  üç sərkərdəni ardıcıllıqla adlandırdı. Hər üçü yıxılanda Xalid geri çəkilməyi yenidən təşkil etdi - ordunu xilas etmək özü bir qələbə idi.",
  },
];

export const BATTLES_GLOSSARY_AZ: DeepPartial<BattlesGlossaryTerm>[] = [
  {
    term: "Qazvah",
    definition:
      "Peyğəmbərin (s) özünün də iştirak etdiyi hərbi səfər. Buna misal olaraq Bədr, Ühüd və Təbuku göstərmək olar.",
  },
  {
    term: "Səriyyə",
    definition:
      "Rəsulullahın (sallallahu aleyhi və səlləm) yürüşə qatılmadığı bir sərkərdə altında göndərilmiş bir dəstə. Onlarla kəşfiyyat, diplomatiya və ya basqınlara cavab vermək üçün baş verdi.",
  },
  {
    term: "Mühacir",
    definition:
      "Allah rizası üçün Məkkədən Mədinəyə gedən mühacirlər. Onlar ənsarlarla birlikdə ilk müsəlman icmasının özəyini təşkil edirdilər.",
  },
  {
    term: "Ənsar",
    definition:
      "Köməkçilər — Mühacirləri qəbul edən, sərvətlərini bölüşən və şəhərin ilk illərində onu müdafiə edən Mədinə müsəlmanları.",
  },
  {
    term: "Şura",
    definition:
      "Əsas qərarlardan əvvəl qarşılıqlı məsləhətləşmə. Xəndək strategiyası və Uhud hazırlıqları peyğəmbərlik modelində məsləhətləşmələri göstərir.",
  },
  {
    term: "Beyah",
    definition:
      "Sədaqət əhdi - liderə siyasi və mənəvi itaət. Əqəbə beyti hicrətdən əvvəl olmuşdur.",
  },
  {
    term: "hicrət",
    definition:
      "Allah rizası üçün hicrət - peyğəmbərlik kontekstində Məkkədən Mədinəyə. Hicri 1-ci il bu hicrətlə başlayır.",
  },
  {
    term: "Əmir",
    definition:
      "Orduya və ya ekspedisiyaya təyin edilmiş komandir və ya rəhbər. Peyğəmbər səlləllahu əleyhi və alihi və səlləm sərəyana rəhbərlər təyin etdi və əgər yıxıldıqları təqdirdə canişinlər təyin etdi.",
  },
  {
    term: "Rayah",
    definition:
      "Ordunun başında daşınan standart və ya bayraq. Peyğəmbərin bayrağını daşımaq şərəf və məsuliyyət əlaməti idi.",
  },
  {
    term: "Liva",
    definition:
      "Daha böyük ordu standartı, bəzən şəxsi rayadan fərqlidir. Livanın rəhbərliyi böyük bir qüvvə üzərində komandanlığı göstərirdi.",
  },
  {
    term: "Cihad",
    definition:
      "Allah yolunda cihad - ilk növbədə nəfsin mübarizəsi və nizamlanmış hərbi formada, müdafiə və əmr edildiyi zaman təcavüzü aradan qaldırmaq.",
  },
  {
    term: "Fi səbilillah",
    definition:
      "Allah yolunda - qanuni mübarizəni qəbilə intiqamından və ya dünyəvi fəthdən fərqləndirən niyyət.",
  },
  {
    term: "Aman",
    definition:
      "Elçilərə, tacirlərə və ya qeyri-döyüşçülərə verilən təhlükəsizlik və ya təhlükəsiz davranış. İslam müharibə qanununda amanı pozmaq haramdır.",
  },
  {
    term: "Sülh",
    definition:
      "Atəşkəs və ya sülh həlli. Hudeybiyyə müqaviləsi daha böyük faydaya xidmət etdiyi zaman sülhü seçməyin ən yaxşı nümunəsidir.",
  },
  {
    term: "Fəth",
    definition:
      "Açılış və ya fəth - şiddətli mühasirədən çox Məkkənin (Fəth Məkkə) dinc açılışı üçün istifadə olunur.",
  },
];
