import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// az overlay for islamic-finance. Index-aligned with ISLAMIC_FINANCE_TOPICS in ../islamic-finance.ts.
export const ISLAMIC_FINANCE_TOPICS_AZ: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "İslam maliyyəsi nədir?",
    summary:
      "Ayrıca məhsul kateqoriyası deyil, pula etik baxış — bu bələdçi yalnız maarifləndirmə xarakterlidir.",
    body: [
      "İslam maliyyəsi investisiya məhsulunun bir markası deyil; o, pulun necə qazanılması, borc verilməsi, xərclənməsi və paylanmasına İslam etikasının tətbiqidir. Onun əsasında bir neçə prinsip dayanır: var-dövlət özlüyündə məqsəd deyil, Allahdan bir əmanətdir; əməliyyatlar istismardan və həddindən artıq qeyri-müəyyənlikdən azad olmalıdır; mənfəət isə borca qoyulan zəmanətli haqqa deyil, real iqtisadi fəaliyyətə və bölüşdürülən riskə bağlı olmalıdır.",
      "Bu bələdçi həmin prinsipləri ümumi, maarifləndirici səviyyədə təqdim edir: ribanın (faizin/sələmin) qadağan olunması, ticarətdə ədalətli davranış, zəkat və könüllü sədəqə vəzifələri və təkafülün (kooperativ sığortanın) əsas anlayışı. O, qəsdən fondları yoxlamır, səhm və ya ETF siyahıları vermir və heç bir konkret məhsul və ya təminatçını tövsiyə etmir.",
      "Müasir maliyyə məhsulları (ipoteka, kredit kartları, sığorta polisləri, pensiya hesabları və s.) çox müxtəlif şəkildə qurulur və onlar barədə hökmlər müqavilənin dəqiq şərtlərindən və yaşadığınız ölkənin qanunvericiliyindən asılı ola bilər. Bu bələdçi sizə əsas prinsipləri verir; konkret vəziyyətiniz barədə hökm üçün ixtisaslı, sertifikatlı İslam maliyyəsi alimi və ya qurumu ilə danışın.",
    ],
    disclaimer:
      "Yalnız maarifləndirici məzmun — maliyyə məsləhəti və fətva deyil. Heç bir konkret fondu, səhmi, təminatçını və ya maliyyə məhsulunu tövsiyə etmir, yoxlamır və qiymətləndirmir.",
  },
  {
    title: "Var-dövlət əmanət kimi",
    summary:
      "Sahib olduğunuz hər şey son nəticədə Allahındır — siz onun son sahibi deyil, əmanətdarısınız.",
    body: [
      "Quranda təkrarlanan mövzulardan biri var-dövlətin ilk növbədə Allaha məxsus olmasıdır; insan isə müəyyən müddət üçün onun yalnız əmanətdarıdır və onu necə qazandığına və necə istifadə etdiyinə görə hesab verəcək. Bu, pula sırf şəxsi mülk kimi deyil, haqqında soruşulacağınız bir şey kimi baxmağa yönəldir — haradan gəldiyi və haraya getdiyi.",
      "Başqaları ilə münasibətlərdə bu əmanətin necə həyata keçdiyini iki əmr müəyyən edir: müqavilə və razılaşmalara tam əməl etmək və başqasının malını heç vaxt haqsızlıq, aldatma və ya istismar yolu ilə deyil, yalnız qarşılıqlı razılıqla ədalətli ticarət yolu ilə əldə etmək.",
      "Birlikdə götürüldükdə, bu prinsiplər İslam maliyyə etikasının niyə həmişə eyni bir neçə suala qayıtdığını izah edir: bu mənfəət real zəhmət, risk və dəyər yaratmaqla qazanılıbmı? Qarşı tərəflə tam dürüst davranılıbmı? Üzərimə götürdüyüm hər hansı öhdəliyə əməl olunurmu?",
    ],
  },
  {
    title: "Ribanın qadağan olunması",
    summary: "Riba (faiz/sələm) Quranda ən sərt şəkildə pislənən əməliyyatlardan biridir.",
    body: [
      "Riba — adətən faiz və ya sələm kimi tərcümə olunur, geniş mənada borca qoyulan hər hansı əvvəlcədən müəyyən edilmiş, zəmanətli artımdır — Bəqərə surəsinin ardıcıl beş ayəsində (2:275–279) qeyri-adi dərəcədə sərt dillə qadağan edilir; bu, Quranda tək bir mövzu ilə bağlı ən ağır xəbərdarlıqlardandır.",
      "Bu ayələr qəsdən qarşılaşdırma aparır: “Allah alış-verişi halal, sələm (faiz) almağı isə haram (qadağan) etmişdir” (2:275). Ticarət — hər iki tərəfin real riski və zəhməti bölüşdüyü alış, satış və investisiya — tərifə layiq görülür; nəticədən asılı olmayaraq borclu olunan sabit haqq olan riba isə pislənir. Surə davamında möminlərə qalan ribadan tamamilə imtina etməyi əmr edir, israr edənləri ağır nəticələr barədə xəbərdar edir, tövbə edənlərə isə yalnız əsas məbləği — nə artıq, nə əskik — saxlamağı vəd edir.",
      "Bu, bilinməsi vacib olan əsas təlimdir, hər müasir maliyyə məhsulunu özünüz yoxlamaq üçün yoxlama siyahısı deyil. Konkret müqavilənin (ipoteka, kredit, əmanət hesabı) praktikada riba ehtiva edib-etmədiyini müəyyən etmək onun real şərtlərini İslam maliyyəsi üzrə ixtisaslı biri ilə nəzərdən keçirməyi tələb edir.",
    ],
  },
  {
    title: "Ticarət faizdən nə ilə fərqlənir",
    summary:
      "Halal mənfəət riskə və zəhmətə bağlıdır; riba isə nəticədən asılı olmayan zəmanətli haqdır.",
    body: [
      "Bu fərqi yadda saxlamağın sadə yolu belədir: ticarətdə və ya həqiqi investisiyada kapital və ya mal verən şəxs nəticəni bölüşür — o, qazana bilər, lakin itirə də bilər, çünki layihənin real göstəricilərinə məruz qalır. Ribaya əsaslanan borcda isə borclunun işi uğurlu olsa da, çətinlik çəksə də, iflasa uğrasa da, borc verənə sabit gəlir təmin olunur.",
      "Klassik alimlər bunu ədalət məsələsi kimi izah edirlər: təcili ehtiyacı olan və borc alan insan götürdüyündən qat-qat artıq qaytarmaq məcburiyyətində qala bilər, bütün risk onun üzərinə düşür, borc verənin üzərinə isə heç nə — Quranın “Allah sələmi … məhv edər, sədəqələri … isə artırar” (2:276) ifadəsində pislədiyi məhz bu qeyri-bərabərlikdir; bu, istismarla qurulan var-dövlətlə səxavətlə artan var-dövlət arasında birbaşa qarşılaşdırmadır.",
      "Bu, hər hansı konkret alət barədə hökm deyil, ümumi maarifləndirici qarşılaşdırmadır (bəzi müasir strukturlar ticarətlə borc verməni mürəkkəb şəkildə qarışdırır). Konkret məhsulun bu miqyasda harada yerləşməsi məhz yalnız ümumi prinsiplərə əsasən qərar vermək əvəzinə ixtisaslı İslam maliyyəsi alimi və ya sertifikatlı məsləhətçiyə veriləcək bir sualdır.",
    ],
  },
  {
    title: "Sünnə ribaya nə qədər ciddi yanaşır",
    summary:
      "Peyğəmbər ﷺ xəbərdarlıq edib ki, riba əməliyyatında iştirak edən hər kəs onun günahına şərikdir.",
    body: [
      "Quranın öz xəbərdarlıqlarından əlavə, Peyğəmbər ﷺ aydın etmişdir ki, riba məsuliyyəti yalnız onu birbaşa alanla məhdudlaşmır. Səhih bir hədisdə rəvayət olunur ki, o ﷺ ribanı yeyənə, onu verənə, müqaviləni yazana və onun iki şahidinə lənət etmiş və onların hamısının bu işdə bərabər olduğunu buyurmuşdur.",
      "Bundan adətən çıxarılan dərs təkcə fərdi qınaq deyil, birgə çəkinmədir: riba yalnız borc verənlə borclu arasında şəxsi məsələ deyil, bütövlükdə əməliyyatın və ona bilə-bilə tərəf olan hər kəsin uzaq durmalı olduğu bir şey kimi qəbul edilir.",
      "Quran ayələrində olduğu kimi, bu hədis prinsipin ciddiliyini müəyyən edir; o, özlüyündə konkret müasir maliyyə məhsulunu necə təsnif etməyi sizə demir. Bu qərar real müqaviləni nəzərdən keçirən ixtisaslı alimlərə aiddir.",
    ],
  },
  {
    title: "Ticarətdə dürüstlük",
    summary: "Dürüst, etibarlı tacirə Axirətdə ən yüksək dərəcələrdən biri verilir.",
    body: [
      "Riba barədəki xəbərdarlıqlardan fərqli olaraq, dürüst ticarət dəfələrlə təriflənir. Peyğəmbər Muhəmməd ﷺ özü peyğəmbərlikdən əvvəl tacir kimi çalışmış və peyğəmbər kimi tanınmazdan çox əvvəl ticarətdəki dürüstlüyünə görə Məkkədə əl-Əmin — “Etibarlı” — ləqəbi ilə tanınmışdı.",
      "O ﷺ sonralar öyrətmişdir ki, “the truthful, trustworthy merchant will be with the prophets, the truthful, and the martyrs” (ingiliscə mənası) — yəni doğruçu, etibarlı tacir Qiyamət günü peyğəmbərlər, siddiqlər və şəhidlərlə birlikdə olacaq; bu, bazarda ədalətli davranış kimi adi bir işə verilən fövqəladə yüksək məqamdır.",
      "Praktikada ədalətli ticarət bu deməkdir: mal və xidmətləri düzgün təsvir etmək, bilinən qüsurları gizlətmək əvəzinə açıqlamaq, razılaşdırılmış qiymət və şərtlərə əməl etmək, aldatmadan, yalançı reklamdan və alıcının və ya satıcının məlumatsızlığından sui-istifadə etməkdən çəkinmək. Bunlar istənilən ənənədə yaxşı, davamlı biznes yaradan eyni instinktlərdir — İslam sadəcə onları əbədi mükafata da bağlayır.",
    ],
  },
  {
    title: "Müasir maliyyə məhsullarında yol tapmaq",
    summary: "İpoteka, kartlar və sığorta həqiqətən mürəkkəbdir — bu bələdçi prinsiplərdə dayanır.",
    body: [
      "Müasir maliyyə həyatına ilk müsəlman nəsillərinin indiki formada heç vaxt rastlaşmadığı məhsullar daxildir: ipoteka, kredit kartları, pensiya hesabları, sığorta və çox müxtəlif şəkildə qurulmuş investisiya fondları. Əsrlərlə əvvəlki prinsipləri bu məhsullara tətbiq etmək real, diqqətli elmi işdir — bir neçə ümumi ayəyə əsasən təkbaşına çıxarılacaq bir şey deyil.",
      "Bu səbəbdən müasir İslam maliyyə qurumları və sertifikatlı alimlər məhz müasir müqavilələrin bu prinsiplərə uyğunluğunu yoxlamaq üzrə ixtisaslaşır və çox vaxt konkret məhsul və ya strukturlar barədə ətraflı hökmlər hazırlayırlar. Belə ixtisaslaşmış yoxlama bu tətbiqin əhatə dairəsindən kənardır.",
      "Əgər real maliyyə qərarı — ev alışı, kredit, investisiya, sığorta polisi — üzərində düşünürsünüzsə, məsuliyyətli növbəti addım bu bələdçi kimi ümumi maarifləndirici məzmuna güvənmək deyil, real müqavilə şərtlərinə baxa bilən ixtisaslı, sertifikatlı İslam maliyyəsi məsləhətçisi və ya alimi ilə məsləhətləşməkdir.",
    ],
    disclaimer:
      "Bu tətbiq heç bir konkret maliyyə məhsulunu, fondu və ya təminatçını qiymətləndirmir, yoxlamır və tövsiyə etmir; bu bələdçi real maliyyə vəziyyətinizlə bağlı ixtisaslı peşəkar və ya alim məsləhətini əvəz etmir.",
  },
  {
    title: "Zəkat: var-dövlətlə ibadət",
    summary: "Zəkat söz və ya hərəkətlə deyil, mal ilə yerinə yetirilən vacib ibadətdir.",
    body: [
      "Zəkat — minimum həddi (nisab) aşan müvafiq var-dövlətdən verilən sabit, vacib illik haqq — İslamın beş rüknündən biridir və verməyi könüllü səxavət kimi deyil, namaz və oruc ilə eyni səviyyədə tutur.",
      "Quran zəkatı ardıcıl olaraq namazla birlikdə həqiqi imanın nişanəsi kimi qeyd edir və həm namazı qılan, həm də zəkat verənlərə vəd edir ki, “…Rəbbi yanında mükafatları vardır. Onların (axirətdə) heç bir qorxusu yoxdur və onlar qəm-qüssə görməzlər.” Maliyyə baxımından o, var-dövləti paklayan bir mexanizm kimi işləyir — yığılmış sərvətin kiçik, müntəzəm hissəsini onun bir neçə əldə qeyri-müəyyən müddət boş qalmasına imkan vermək əvəzinə ehtiyac sahiblərinə yenidən bölüşdürür.",
      "Hesablama sizin konkret əmanətlərinizdən, aktivlərinizdən və yerli nisab dəyərlərindən asılı olduğu üçün bu tətbiqdə ayrıca Zəkat bələdçisi və kalkulyatoru var — burada ümumi prinsiplərə əsasən təxmin etmək əvəzinə birbaşa ondan istifadə edin.",
    ],
    appLinks: [{ label: "Zəkat bələdçisi və kalkulyatoru" }],
  },
  {
    title: "Sədəqə: könüllü vermək",
    summary:
      "Vacib zəkatdan əlavə, hər hansı könüllü verməyə sədəqə deyilir — və o, sizə heç vaxt həqiqətən baha başa gəlmir.",
    body: [
      "Sədəqə zəkatın sabit vəzifəsindən əlavə, istənilən miqdarda, istənilən vaxt Allah rizası üçün verilən könüllü xeyriyyədir. O, böyük maddi hədiyyələrdən tutmuş xoş bir söz və ya kiminsə yolundan zərərli bir şeyi götürmək kimi kiçik əməllərə qədər geniş bir sahəni əhatə edir — hədis ədəbiyyatında bunların hamısı sədəqə növü sayılır.",
      "Verməkdə tərəddüd edən hər kəs üçün ən arxayınlaşdırıcı təlimlərdən biri Peyğəmbərin ﷺ sədəqənin malı azaltmadığı barədə sözüdür — Quran da başqa yerlərdə Allah yolunda xərcləməyi sadəcə tükənən bir şey kimi deyil, Allahın əvəzini verdiyi və mükafatlandırdığı bir əməl kimi təsvir edərək bu fikri dəstəkləyir.",
      "Praktikada bu, səxavətə yeni baxış gətirir: vermək maliyyə təhlükəsizliyinizlə rəqabət aparmır, əksinə onu — həmişə balans hesabatında görünməyən yollarla — qoruyan və artıran bir şey kimi təqdim olunur.",
    ],
    appLinks: [{ label: "Zəkat və sədəqə bələdçisi" }, { label: "Sədəqə hədəfləri" }],
  },
  {
    title: "Təkafül: kooperativ risk bölgüsü",
    summary: "Ənənəvi sığortaya İslami alternativlərin arxasındakı anlayışa ümumi baxış.",
    body: [
      "Təkafül (qarşılıqlı zəmanət mənasını verən ərəb kökündəndir) sığortaya bənzər müdafiəyə İslami yanaşmaların arxasındakı ümumi anlayışdır: bir qrup iştirakçı ortaq fonda töhfə verir və bu fond əhatə olunan zərərlə üzləşən üzvlərə kömək üçün istifadə olunur; hər hansı artıq vəsait isə adətən ayrıca sığortaçının zəmanətli mənfəəti kimi saxlanılmır, iştirakçılar arasında bölüşdürülür və ya növbəti dövrə keçirilir.",
      "Əsas ideya zəmanətli haqq müqabilində riskin ötürülməsi deyil, kooperativ risk bölgüsüdür: iştirakçılar bir-birinə qarşılıqlı kömək edən tərəflər kimi görülür, fondun operatoru isə adətən riski daşıyan tərəfin özü kimi deyil, haqq müqabilində idarəçi və ya agent kimi çıxış edir.",
      "Bu, yalnız ümumi, konseptual təsvirdir. Real təkafül məhsulları təminatçılar və ölkələr arasında quruluşca çox fərqlənir və konkret planın həqiqətən bu şəkildə qurulub-qurulmadığını qiymətləndirmək onun real şərtlərini ixtisaslı İslam maliyyəsi alimi və ya qurumu ilə nəzərdən keçirməyi tələb edir — bu tətbiq heç bir konkret təkafül (və ya sığorta) təminatçısını və ya planını tövsiyə etmir və qiymətləndirmir.",
    ],
    disclaimer:
      "Yalnız ümumi maarifləndirmə. Bu, təkafülün ənənəvi sığortadan üstün tutulması və ya hər hansı konkret təminatçı və ya plan barədə tövsiyə deyil — vəziyyətiniz üçün ixtisaslı məsləhətçiyə müraciət edin.",
  },
  {
    title: "Təkafül və ənənəvi sığorta — ümumi müqayisə",
    summary:
      "Hər ikisinin məqsədi eynidir — riski idarə etmək — lakin həmin riskin necə qurulduğu ilə fərqlənirlər.",
    body: [
      "Ənənəvi sığorta adətən elə bir müqavilə kimi qurulur ki, sığortalı haqq ödəyir və ayrıca kommersiya tərəfi olan sığortaçı bu haqq müqabilində riski daşıyır, çox vaxt haqlar hovuzunu faiz gətirən alətlər də daxil olmaqla müxtəlif yollarla investisiya edir. Bəzi klassik alimlər bu strukturun riba, qərər (ödəniş barədə həddindən artıq qeyri-müəyyənlik) və riskin bölüşdürülməsi əvəzinə sabit haqq müqabilində ötürülməsi ilə bağlı narahatlıqlar doğurduğunu qeyd etmişlər.",
      "Təkafül, ümumi desək, bu konkret narahatlıqları bunun əvəzinə qarşılıqlı, kooperativ struktur vasitəsilə aradan qaldırmaq cəhdi kimi işlənib hazırlanmışdır — baxmayaraq ki, alimlər və qurumlar hansı strukturların bu məqsədə tam nail olduğu barədə fərqli fikirdədirlər və təkafül təminatçılarının özləri də quruluşca xeyli fərqlənir.",
      "Həm narahatlıqlar, həm də alternativ strukturlar real texniki təfərrüatlar ehtiva etdiyi üçün (həmçinin yer, əhatə ehtiyacları və mövcud təminatçılar kimi şəxsi şərait çox fərqli olduğu üçün) bu müqayisə yalnız ümumi məlumat kimi təqdim olunur — nəzərdən keçirdiyiniz hər hansı konkret polis barədə hökm kimi deyil.",
    ],
    disclaimer:
      "Yalnız maarifləndirici müqayisə; ümumilikdə sığorta və ya təkafül, yaxud hər hansı konkret məhsul barədə fətva deyil. Alimlərin müasir sığorta strukturları barədə müxtəlif görüşləri var; vəziyyətiniz üçün ixtisaslı məsləhətçiyə müraciət edin.",
  },
  {
    title: "Tez-tez verilən suallar: bu, maliyyə məsləhətidirmi?",
    summary: "Xeyr — bu bələdçi yalnız prinsipləri öyrədir və ixtisaslı məsləhəti əvəz edə bilməz.",
    body: [
      "Sual: Konkret kreditin, investisiyanın və ya sığorta məhsulunun mənim üçün caiz olub-olmadığına qərar vermək üçün bu bələdçidən istifadə edə bilərəmmi? Cavab: Xeyr. Bu bələdçi pul barədə ümumi İslam prinsiplərini izah edir — müqavilələri yoxlamır, məhsul tövsiyə etmir və hökm vermir. Konkret maliyyə qərarları ixtisaslı maliyyə mütəxəssisi ilə, caizlik məsələlərində isə ixtisaslı İslam maliyyəsi alimi ilə birlikdə verilməlidir.",
      "Sual: Bu tətbiq halal səhmləri, fondları və ya ETF-ləri qiymətləndirir və ya siyahıya alırmı? Cavab: Xeyr və bu bələdçinin bir hissəsi kimi heç vaxt bunu etməyəcək — fondların yoxlanılması və investisiya tövsiyələri onun əhatə dairəsindən kənardır və bu məzmunun təqdim etmədiyi lisenziyalı maliyyə ekspertizası tələb edir.",
      "Sual: Bu bələdçi fətvadırmı? Cavab: Xeyr. Fətva ixtisaslı alimin konkret suala və şəraitə cavab olaraq verdiyi konkret dini hökmdür. Bu bələdçi yalnız ümumi prinsipləri öyrədir; vəziyyətiniz barədə real hökm üçün birbaşa ixtisaslı, etibarlı alimə müraciət edin.",
    ],
    disclaimer:
      "Bütün bu bələdçi maarifləndirici məzmundur — maliyyə məsləhəti və fətva deyil. Öz pulunuzla bağlı qərarlar üçün həmişə ixtisaslı maliyyə və din mütəxəssislərinə müraciət edin.",
  },
  {
    title: "Tez-tez verilən suallar: Şəriətə uyğun variantları necə tapım?",
    summary:
      "Siyahı deyil, sertifikatlı ekspertiza axtarın — bu tətbiq qəsdən siyahı təqdim etmir.",
    body: [
      "Sual: Halal bankların, fondların və ya investisiya platformalarının siyahısını harada tapa bilərəm? Cavab: Bu tətbiqdə yox — bu, qəsdən belədir: məhsul siyahıları daim dəyişir, ölkədən ölkəyə kəskin fərqlənir və yalnız ixtisaslaşmış qurumların düzgün apara biləcəyi davamlı uyğunluq nəzarəti tələb edir. Bunun əvəzinə həqiqi, adı açıqlanmış Şəriət nəzarət şurası və dərc edilmiş uyğunluq metodologiyası olan qurumlar axtarın.",
      "Sual: Alimin və ya sertifikatın etibarlı olduğunu necə bilə bilərəm? Cavab: Qeyri-rəsmi onlayn iddialar əvəzinə, bölgənizdə və ya beynəlxalq səviyyədə tanınmış İslam maliyyəsi standartlarını müəyyən edən qurumlar tərəfindən tanınan alimləri və ya şuraları axtarın. Nüfuzlu qurum məhsullarını kimin və necə yoxladığı barədə şəffaf olacaq.",
      "Sual: Yaşadığım yerdə heç bir İslam maliyyəsi variantı tapa bilməsəm, nə etməliyəm? Cavab: Bu, real və geniş yayılmış vəziyyətdir. Bunu bilikli yerli imam və ya alimlə müzakirə edin — onlar konkret şəraitiniz üçün mövcud variantları dəyərləndirməyə kömək edə bilərlər, çünki buradakı istiqamət sizin üçün həqiqətən hansı alternativlərin mövcud olmasından çox asılı ola bilər.",
    ],
    actions: [
      "Reklam iddialarına güvənmək əvəzinə, adı açıqlanmış, şəffaf Şəriət nəzarət şurası olan qurumlar axtarın.",
    ],
  },
  {
    title: "Tez-tez verilən suallar: ipoteka, kartlar və kreditlər",
    summary:
      "Bunlar məhz ümumi bələdçinin deyil, ixtisaslı alimin cavab verməli olduğu suallardır.",
    body: [
      "Sual: İpoteka həmişə ribadırmı? Cavab: Strukturlar fərqlənir — bəzi ənənəvi ipotekalar faizli kreditlərdir, bəzi təminatçılar isə faizdən qaçmaq məqsədi daşıyan alternativ strukturlar (məsələn, azalan ortaqlıq və ya icarə-alış modelləri) təklif edir. Konkret məhsulun praktikada buna nail olub-olmaması onun real müqaviləsi ilə bağlı elmi sualdır, nə bu, nə də digər istiqamətdə fərz ediləcək bir şey deyil.",
      "Sual: Həmişə borcun tamamını ödəsəm və heç vaxt faiz yaranmasa, kredit kartından istifadə edə bilərəmmi? Cavab: Alimlərin bu barədə fərqli görüşləri var, qismən ona görə ki, praktikada heç vaxt işə düşməsə belə, əsas müqavilə texniki olaraq faiz bəndini ehtiva edə bilər. Bu, ixtisaslı alimlərin həqiqətən fərqli fikirdə olduğu bir sahədir — yeganə universal cavab olduğunu fərz etmək əvəzinə etibar etdiyiniz alimdən soruşun.",
      "Sual: Bəzi hallarda qaçılmaz ola bilən tələbə kreditləri və ya digər kreditlər barədə nə demək olar? Cavab: Zərurət və çətinlik alimlərin diqqətlə nəzərə aldığı real amillərdir və görüşlər şəraitə və ölkəyə görə fərqlənir. Əgər belə bir qərarla üzləşirsinizsə, onu yalnız ümumi oxu əsasında həll etməyə çalışmaq əvəzinə konkret vəziyyətinizi ixtisaslı alimə təqdim edin.",
    ],
    disclaimer:
      "Bunlar həqiqətən ixtilaflı, müqaviləyə bağlı suallardır. Bu bölmə yalnız hər birinin hansı növ sual olduğunu göstərir — onların heç birinə sizin vəziyyətiniz üçün cavab vermir.",
  },
];
