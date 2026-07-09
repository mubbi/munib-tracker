// Azerbaijani translation overlay for the Learn "Prophets" content. Mirrors the order of
// its English source in ../prophets*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { ProphetsTimelineEvent, ProphetsTopic } from "../../types/prophets";
import type { DeepPartial } from "./localize";

export const PROPHETS_TOPICS_AZ: DeepPartial<ProphetsTopic>[] = [
  {
    title: "Peyğəmbərlərə giriş",
    summary: "Allah niyə peyğəmbərlər göndərdi və onların hekayələri niyə indi vacibdir?",
    body: [
      "Allah peyğəmbərləri rəhmət, hidayət və dəlil olaraq göndərmişdir ki, insanlar Onu tanısınlar, Ona düzgün ibadət etsinlər, ədalətlə və məqsədlə yaşasınlar.",
      "Onların Qurandakı hekayələri yalnız uzaq tarix deyil; onlar iman, səbir, ailə həyatı, liderlik və tövbə üçün əməli dərslərdir.",
      "Bütün peyğəmbərlərə iman imanın bir hissəsidir. Müsəlmanlar onların hamısına hörmət edir, mübaliğədən çəkinir və Məhəmmədin (sallallahu aleyhi və səlləm) gətirdiyi son risalətə əməl edirlər.",
    ],
    quran: [
      {
        excerpt:
          "Elçilər müjdəçi və qorxudandırlar ki, elçilərdən sonra insanların Allaha qarşı heç bir mübahisəsi olmasın.",
      },
      {
        excerpt:
          "Şübhəsiz ki, Biz hər ümmətə: “Allaha ibadət edin və batildən çəkinin!” – deyə bir peyğəmbər göndərdik.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "İslamda peyğəmbər nədir?",
    summary: "Vəhy alan və insanları Allaha dəvət edən seçilmiş insan.",
    body: [
      "Peyğəmbər, vəhy almaq, insanları tövhidə, ibadətə və saleh əməllərə yönəltmək üçün Allah tərəfindən seçilmiş bir insandır.",
      "Peyğəmbərlər ilahi deyillər və heç vaxt ibadət olunmurlar. Onlar itaətdə, əxlaqda və əmanətdə yaradılışın ən yaxşısıdırlar, eyni zamanda Allaha qul olaraq qalırlar.",
      "Onların missiyası əsasda birdir: yalnız Allaha ibadət edin. Xüsusi hüquqi detallar Allahın hikməti ilə cəmiyyətlər arasında fərqli ola bilər.",
    ],
    quran: [
      {
        excerpt:
          "Elçiləri onlara dedilər: “Biz də sizin kimi kişilərik, lakin Allah Öz bəndələrindən istədiyinə lütf edər.",
      },
      {
        excerpt:
          "Biz səndən əvvəl heç bir peyğəmbər göndərmədik ki, ona: “Məndən başqa heç bir tanrı yoxdur, Mənə ibadət edin!” – deyə vəhy etdik.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nəbi Rəsulə qarşı",
    summary: "Elmdə faydalı bir fərq, ikisi də şərəfli peyğəmbərlər.",
    body: [
      "İslam elmində ümumi bir fərq budur ki, hər rəsul nəbidir, lakin hər nəbi rəsul deyil. Rəsul tez-tez bir xalqa fərqli bir vəzifə ilə göndərilmiş kimi təsvir edilir, bir nəbi isə vəhy vasitəsilə hidayəti davam etdirir.",
      "Qur'an hər iki termini şərəflə işlədir və müsəlmanlar heç birini rədd etmədən bütün peyğəmbərlərə və elçilərə inanırlar.",
      "Dəqiq texniki təriflər elmi ifadələrə görə dəyişə bilər, lakin praktiki dərs ardıcıldır: təvazökarlıqla vəhy alın və Allahın rəhbərliyinə tabe olun.",
    ],
    quran: [
      {
        excerpt: "O, seçilmiş, elçi və peyğəmbər idi.",
      },
      {
        excerpt: "Biz Onun elçiləri arasında heç bir fərq qoymuruq.",
      },
    ],
    disclaimer:
      "Terminologiya təfərrüatları geniş, alim üçün neytral şəkildə təqdim olunur; qabaqcıl teoloji təsnifatlar üçün ixtisaslı müəllimlərə müraciət edin.",
    appLinks: [{}],
  },
  {
    title: "Peyğəmbərlərdən paylaşılan dərslər",
    summary: "Təkrarlanan mövzular: tövhid, səbir, tövbə və mənəvi şücaət.",
    body: [
      "Nəsillər boyu peyğəmbərlər bir təmələ çağırıblar: yalnız Allaha ibadət edin və şirkdən çəkinin. Bu, vəhyin dəyişməz özəyidir.",
      "Onların həyatları da rədd edilməkdə səbr, qeyri-müəyyənlikdə Allaha təvəkkül, hikmət və cəsarətlə cəmiyyəti islah etmək istəyini nümayiş etdirir.",
      "Onları öyrənmək dözümlülük yaradır: möminlər tez tövbə etməyi, etik qaydada rəhbərlik etməyi və həqiqət populyar olmayanda belə prinsipial qalmağı öyrənirlər.",
    ],
    quran: [
      {
        excerpt: "Onların hekayətlərində ağıl sahibləri üçün ibrət vardır.",
      },
      {
        excerpt: "Onlar Allahın doğru yola yönəltdiyi kimsələrdir, onların hidayətinə tabe ol.",
      },
    ],
    actions: [
      "Hər həftə bir peyğəmbərlik dərsi seçin və onu qəsdən tətbiq edin.",
      "Namazdan sonra daha çox səbir və ya tövbəyə ehtiyacınız olduğu barədə düşünün.",
      "Ailə və ya dostlarınıza müntəzəm olaraq bir həqiqi peyğəmbərlik hekayəsi öyrədin.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Möcüzələr və peyğəmbərlik əlamətləri",
    summary: "Möcüzələr Allahın izni ilə həqiqəti təsdiq edir, lakin imana məcbur etmir.",
    body: [
      "Allah peyğəmbərlərə ümmətlərinə uyğun açıq-aydın dəlillər verdi: Nuhun gəmisi, Musanın Firon qarşısındakı möcüzələri, Allahın izni ilə İsanın möcüzələri və Muhəmməd (s) üçün Qur'an.",
      "Möcüzələr peyğəmbərlərin müstəqil səlahiyyətləri deyil; Onlar vəhyi dəstəkləmək və dəlil yaratmaq üçün Allahın iradəsi ilə meydana gəlirlər.",
      "Qur'an göstərir ki, bəzi möcüzələrə baxmayaraq hələ də inkar olunur, hidayətin sübutu yalnız tamaşadan deyil, ixlas və təslimiyyətdən asılıdır.",
    ],
    quran: [
      {
        excerpt:
          "Biz peyğəmbərlərimizi açıq-aydın dəlillərlə göndərdik, onlarla birlikdə Kitab və tərəzi nazil etdik.",
      },
      {
        excerpt:
          "De: “Ayələr ancaq Allahın yanındadır... Onlara oxunan Kitabı sənə nazil etməyimiz onlar üçün kifayət deyilmi?",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qur'anın peyğəmbərlərə baxışı",
    summary: "Quranda iyirmi beş peyğəmbərin adı çəkilir və bir ardıcıl xəbər verilir.",
    body: [
      "Qur'an birbaşa olaraq iyirmi beş peyğəmbərin adını çəkir və daha bir çox elçilərə istinad edir. Onların hekayələri düşünmək və hidayət etmək üçün surələr arasında paylanır.",
      "Şərtlər fərqli olsa da, onların çağırışı birdir: tövhid, salehlik, məsuliyyət və tövbə vasitəsilə mərhəmət.",
      "Bu modul Qurana əsaslanaraq qalır və etibarlı dəlillərlə dəstəklənməyənə qədər ikinci dərəcəli tarixi təfərrüatları qısa saxlayır.",
    ],
    quran: [
      {
        excerpt:
          "Biz səndən əvvəl də elçilər göndərmişdik. Onların içərisində sənə rəvayət etdiyimiz də var, sənə aid etmədiyimiz də.",
      },
      {
        excerpt:
          "Biz Allaha, nazil edilənə... və Musaya, İsaya və peyğəmbərlərə Rəbbi tərəfindən verilənə iman gətirdik.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "İstinadlar və oxu metodu",
    summary: "Həqiqilik, balans və fayda ilə peyğəmbərləri necə öyrənmək olar.",
    body: [
      "Qur'an ayələri ilə başlayın, sonra səhih hədisləri oxuyun, sonra kontekst üçün etibarlı təfsirlə məsləhətləşin. Bu əmr vəhy əsasında öyrənməyə davam edir.",
      "Qur'an prinsipləri və ya peyğəmbərlik ləyaqəti ilə ziddiyyət təşkil edən sensasiyalı və ya zəif xəbərlərdən çəkinin. Hər məşhur hekayənin əsaslı sübutu yoxdur.",
      "Yalnız tarixi faktları toplamaq üçün deyil, öz ibadətinizi və xarakterinizi islah etmək üçün peyğəmbərlik tərcümeyi-hallarından istifadə edin.",
    ],
    quran: [
      {
        excerpt:
          "Sözə qulaq asıb onun ən gözəlinə tabe olanlar, Allahın doğru yola yönəltdiyi kimsələrdir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim elm öyrənmək üçün bir yola getsə, Allah onun üçün Cənnətə gedən yolu asanlaşdırar.",
      },
    ],
    actions: [
      "Həftəlik bir peyğəmbər hekayəsini birbaşa Qurandan oxuyun.",
      "Nəinki vaxt qrafiki faktlarını deyil, praktiki dərslər haqqında da qeydlər aparın.",
      "İkinci dərəcəli rəvayətləri etibarlı alimlərlə təsdiq edin.",
    ],
    disclaimer:
      "Tarixi tarixlər və dəqiq yerlər mənbələrdə fərqlənə bilər; bu mərkəz razılaşdırılmış, mətn əsaslı təlimata üstünlük verir.",
    appLinks: [{}, {}],
  },
];

export const PROPHETS_BIO_TOPICS_AZ: DeepPartial<ProphetsTopic>[] = [
  {
    title: "Adəm (ə)",
    summary: "Elmlə şərəfləndirilmiş və itaətlə sınaqdan keçirilmiş ilk insan və ilk peyğəmbər.",
    body: [
      "Adəm (əleyhissalam) bəşər tarixinin və peyğəmbərliyin başladığı yerdir. Allah onu öz əlləri ilə palçıqdan yaratmış, ona öz ruhundan üfürmüş və ona hər şeyin adlarını öyrətmişdir. Mələklərə Adəmə ehtiramla səcdə etmək əmr edildikdə, onlar itaət etdilər - lakin İblis təkəbbür göstərərək bundan imtina etdi və o andan etibarən onun Adəmə və onun övladlarına düşmənçiliyi elan edildi. Bu açılış səhnəsi hər bir insan həyatının əsas dramını təşkil edir: təvazökar itaətkarlıqla məğrur üsyan arasında seçim (Qur'an 2:30-39).",
      "Allah Adəmi və həyat yoldaşı Həvvanı cənnətdə yerləşdirdi və onlara bir ağacdan başqa hər şeyi halal etdi. Şeytan ona vəsvəsə edərək ondan yedilər. Lakin onların İblislə fərqinə diqqət yetirin: İblis günahına haqq qazandırdı, Adəm və Həvva isə dərhal peşman oldular və Allahın onlara öyrətdiyi “Rəbbimiz! Allah onların tövbələrini qəbul etdi və tabe olacaq hər kəs üçün hidayət vədi ilə onları yer üzünə göndərdi.",
      "Adəmin dərsi ümid dərsidir: insan şərəfli və ləyaqətli, lakin sınaqdan keçirilir və sürüşəcək. Mömini təyin edən günahsız olmaq deyil - yalnız Allah kamildir - tövbədə tez və səmimiyyətlə qayıtmaqdır. Adəmin hekayəsi də öyrədir ki, Şeytan elan edilmiş, açıq düşməndir, onun yeganə silahı pıçıltıdır; cavab Allahı zikr etmək və Ondan bağışlanma diləməkdir. Adəmdən başlayaraq yer üzünə enmə cəza deyil, bəşəriyyətin həqiqi sınaq mərhələsidir.",
    ],
    profile: {
      nation: "Erkən insanlıq",
      location: "Cənnət sonra yer",
      era: "Bəşər tarixinin başlanğıcı",
      mission: "İlk insanlara tövhidi və Allaha itaəti öyrədin.",
      challenges: [
        "İblisin düşmənçiliyi",
        "Yerə endikdən sonra həyat",
        "İlk insan ailəsinə rəhbərlik",
      ],
      miracles: ["Allahın əmri ilə valideynsiz yaradılış", "Hər şeyin adları öyrədilir"],
      majorEvents: [
        "Adəmin yaradılması və adların öyrədilməsi",
        "Mələklərin səcdəsi və İblisin rəddi",
        "Cənnətdəki sürüşmə, səmimi tövbə və yerə enmə",
      ],
      lessons: [
        "İnsan şərəfi məsuliyyətlə birləşir",
        "Səmimi tövbə hər hansı bir səhvdən sonra qapını yenidən açır",
        "Şeytan aşkar, daimi düşməndir",
      ],
      facts: ["Adəm ilk insan və ilk peyğəmbərdir", "Onun tövbəsi Qur'anın ilk tövbə modelidir"],
    },
    quran: [
      {
        excerpt:
          "Yadına salın o zaman ki, Rəbbin mələklərə demişdi: “Mən yer üzündə bir-birinin ardınca bir hökmranlıq yaradacağam... Sonra Adəm Rəbbindən söz aldı və O, onun tövbəsini qəbul etdi.",
      },
      {
        excerpt:
          "Onlar dedilər: “Ey Rəbbimiz, biz özümüzə zülm etdik və əgər bizi bağışlamasan və bizə rəhm etməsən, şübhəsiz ki, ziyana uğrayanlardan olarıq”.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qiyamət günü insanlar Adəmin yanına gəlib deyəcəklər: Sən insanların atasısan; Rəbbinin yanında bizim üçün şəfaət et.",
      },
      {
        excerpt:
          "Adəmlə Musa mübahisə etdilər. Musa dedi: “Sən Allahın Öz əli ilə yaratdığı kimsəsən. Adəm dedi: “Allah məni yaratmamışdan əvvəl mənim üçün yazmış olduğu bir işdə məni qınayırsınız? Beləliklə, Adəm mübahisədə Musaya qalib gəldi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "İdris (ə)",
    summary:
      "Səbri ilə mədh edilən və Allah tərəfindən uca məqama qaldırılan doğru danışan peyğəmbər.",
    body: [
      "Quranda İdrisdən (əleyhissalam) qısaca bəhs edilir, lakin onun haqqında hər söz tərifdir. Allah onu “haqq adamı, peyğəmbər” adlandırır (Qur'an 19:56) və onu İsmayıl və Zül-Kifllə yanaşı səbirlilər və salehlər sırasına salır (Qur'an 21:85-86). Onun hekayəti göstərir ki, Allah yanında insanın xasiyyəti - doğruluğu, səbri, səbrli ibadəti onun tərcümeyi-halının uzunluğundan daha vacibdir.",
      "Allah onun haqqında buyurur: “Biz onu yüksək məqama ucaltdıq” (Qur'an, 19:57). Alimlər bunu onun Allah yanında yüksək məqamına işarə etmək üçün başa düşmüşlər. Qur'anın və səhih xəbərlərin təsdiq etdiyindən başqa, İdrislə bağlı məşhur nağıllar (məsələn, qələmlə yazan ilk şəxs və ya müəyyən dünyəvi peşələr) əsaslı dəlillərlə müəyyən edilməmişdir, buna görə də diqqətli mömin vəhyin bəzəməkdənsə, təsdiq etdiyinə riayət edər.",
      "İdrisin dərsi budur ki, Allaha yaxınlıq şöhrət və ya uzun hekayə ilə deyil, səmimiyyət və ardıcıllıqla ölçülür. Sakit, doğru danışan, səbirli bir bəndə Allah yanında bir məqamı tarixdə adları ucadan xatırlanan bir çox insandan daha yüksək tuta bilər.",
    ],
    profile: {
      era: "Adəmdən sonrakı ilk nəsillər",
      mission: "İnsanları doğruluq və salehliklə Allaha ibadət etməyə çağırın.",
      lessons: [
        "Doğruçuluq bəndənin dərəcəsini yüksəldir",
        "Hər peyğəmbərin hekayəsi təfərrüatlı deyil - və bu dizaynladır",
        "Sabit, sadiq ardıcıllıq Allaha sevimlidir",
      ],
      facts: [
        "Quranda doğru danışan və peyğəmbər kimi adı çəkilmişdir",
        "Allah tərəfindən yüksək məqama yüksəldilmiş kimi təsvir edilmişdir",
      ],
    },
    quran: [
      {
        excerpt:
          "Kitabda İdrisi də xatırla. Həqiqətən, o, haqq adamı və peyğəmbər idi. Biz onu yüksək bir məqama qaldırdıq.",
      },
      {
        excerpt:
          "İsmayıl, İdris və Zül-Kifl – hamısı səbirlilərdən idi. Biz onları öz mərhəmətimizə qovuşdurduq. Həqiqətən, onlar əməlisalehlərdən idilər.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nuh (ə)",
    summary: "Daşqından əvvəl əsrlər boyu xalqını çağıran qeyri-adi səbir elçisi.",
    body: [
      "Nuh (əleyhissalam) tövhidi tərk edib bütlərə sitayiş edən bir qövmə göndərildi. Onun tək və sarsılmaz sözü bu idi: “Ey qövmüm, Allaha ibadət edin! Sizin Ondan başqa məbudunuz yoxdur” (Qur'an, 7:59). Qur'an Nuh surəsində missiya ilə bağlı öz hesabını qoruyur: O, gecə-gündüz, aşkar və gizli olaraq onları çağırır, həm təşviq edir, həm də xəbərdar edir, Allaha qayıtmağın yağış, mal-dövlət, övlad və bağlar gətirdiyini xatırladır. Lakin nəsildən-nəslə əksəriyyət üz çevirdi, barmaqlarını qulaqlarına qoydu və daha da təkəbbürləndi (Qur'an 71:1-28).",
      "Qur'an onun səbrinin nə qədər uzun olduğunu vurğulayır: o, onların arasında \"min əlli ildən az\" qaldı (Qur'an 29:14) və hələ də yalnız bir neçəsi iman gətirdi. Artıq imanı qəbul etməyəcəyi məlum olduqda, Allah ona əmr etdi ki, kafirlər məsxərəyə qoyarkən ilahi göstərişlə gəmi tiksin. Sonra sel suları hökm kimi gəldi. Nuhun öz oğlu atasının xəbərdarlığı ilə bir dağa güvənərək gəmiyə minməkdən imtina etdi və boğulanlar arasında idi - qan bağlarının imanı əvəz edə bilməyəcəyini dərin bir xatırlatma (Qur'an 11:42-46).",
      "Nuhun hekayəsi Qur'anın da'vatdakı ustad dərsidir: dəvət edənin vəzifəsi səmimi, səbirli, aydın çatdırılmadır - nəticələr yalnız Allaha məxsusdur. O, həmçinin öyrədir ki, hidayət nəsil deyil, qəlb işidir: peyğəmbər övladı itirilə bilər, yad adamlar isə xilas ola bilər. Gəmiyə minən möminlər yenilənmiş bir bəşəriyyətin toxumu oldular və Nuh, qəti qərarlı (ulul-əzm) beş ən böyük elçisindən biri kimi şərəfləndirilir.",
    ],
    profile: {
      nation: "Onun xalqı daşqından əvvəl",
      location: "Qədim Mesopotamiya bölgəsi (geniş istinad edilir)",
      era: "Çox erkən antik dövr",
      mission: "Xalqını tövhidə və tövbəyə çağır.",
      challenges: [
        "Liderlərdən və elitadan istehza",
        "Bir neçə möminlə əsrlər boyu rədd",
        "Öz oğlunun inamsızlığı və boğulması",
      ],
      miracles: ["İlahi göstərişlə tikilmiş gəmi", "Möminlərin sel vasitəsilə xilası"],
      majorEvents: [
        "Təxminən min il davam edən tövhid çağırışı",
        "Allahın əmri ilə gəminin tikilməsi",
        "Tufan və möminlər üçün yeni başlanğıc",
      ],
      lessons: [
        "Də'vətdə israrlı olmaq, nəticəsini Allaha buraxmaq",
        "Ailə bağları imanı əvəz edə bilməz",
        "Allah həmişə səmimi olanları qoruyur",
      ],
      facts: [
        "Qətiyyətli beş elçidən biri (ulul-əzm)",
        "Onun hekayəsi bir çox surələrdə, o cümlədən onun adını daşıyan surədə rast gəlinir",
      ],
    },
    quran: [
      {
        excerpt:
          "Nuha vəhy olundu ki, sənin qövmündən iman gətirənlərdən başqa heç kəs iman gətirməyəcək.",
      },
      {
        excerpt:
          "O dedi: “Ey Rəbbim, mən ümmətimi gecə-gündüz dəvət etdim, lakin mənim dəvətim onları ancaq qaçmaqda artırdı.",
      },
    ],
    hadith: [
      {
        excerpt: "İnsanlar Nuhun yanına gəlib deyəcəklər: “Ey Nuh! bizə şəfaət et.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Hud (ə)",
    summary: "Ad qövmünə qüdrətli və qüdrətli bir tayfa göndərildi.",
    body: [
      "Hud (əleyhissalam) Ad qövmünə göndərilmişdir. Bu sivilizasiya Quranda fiziki cəhətdən güclü və hündür, mürəkkəb tikililər tikməkdə məşhur olan “yer üzündə heç vaxt belə yaradılmamış” bir sivilizasiyadır (Qur'an 89:6-8). Hud bu qürurlu qövmə, hər bir peyğəmbərlə eyni xəbəri çatdırdı: “Ey qövmüm, Allaha ibadət edin! Sizin Ondan başqa tanrınız yoxdur. Məgər Ondan qorxmursunuz?” (Qur'an, 7:65). O, özlərindən idi, heç bir mükafat istəməz, yalnız şükürə çağırır, zülmdən uzaqlaşırdı.",
      "Onların rəhbərləri istehza ilə cavab verdilər, onu axmaqlıqda və yalançılıqda ittiham edərək atalarının bütlərindən yapışdılar. Onlar heç bir qüvvənin onların gücünə bərabər ola bilməyəcəyinə əmin olaraq xəbərdarlıq etdiyi cəzanı çəkməyə çağırdılar (Qur'an 46:21-25). Hud onları açıq şəkildə xəbərdar etdi ki, dünya qüdrətinin və böyük sivilizasiyanın Allahın ayələrini inkar edən və yer üzündə təkəbbür göstərən heç bir kəsi qoruya bilməz.",
      "Hökm qəzəbli, ulayan bir külək kimi gəldi ki, Allah “bir-birinin ardınca yeddi gecə və səkkiz gün onlara həvalə etdi” (Qur'an 69:6-7), bir vaxtlar qüdrətli insanları içi boş gövdələr kimi yerə yıxdı – Hud və möminlər isə Allahın rəhməti ilə xilas oldular. Ad qövmünün hekayəti Quranda daimi bir xəbərdarlıq olaraq təkrarlanır: güc, zənginlik və nailiyyət qürurla deyil, təvazökarlıqla və minnətdarlıqla qarşılanacaq hədiyyələrdir. Bir millət nə qədər inkişaf etsə də, Allah qarşısında cavabdehdir.",
    ],
    profile: {
      nation: "Ad əhli",
      location: "Əl-Əhqaf bölgəsi (klassik təfsirdə Cənubi Ərəbistan ərazisi)",
      era: "Nuhdan sonra",
      mission: "Ad qövmü arasında tövhid, şükür və ədaləti bərpa et.",
      challenges: [
        "Güc və sərvət üzərində qurulmuş kollektiv təkəbbür",
        "Vəhyə və peyğəmbərə istehza",
        "Dərhal cəza tələbi",
      ],
      miracles: ["Cəza zamanı möminlərin müdafiəsi"],
      majorEvents: [
        "Tövbə və şükür çağırışı",
        "Şiddətli külək xəbərdarlığı",
        "Ad qövmünün məhvi yeddi gecə səkkiz gündür",
      ],
      lessons: [
        "Təvazökarlıq olmadan güc məhvə aparır",
        "Millətlər və sivilizasiyalar Allah qarşısında cavabdehdirlər",
        "Peyğəmbər xəbərdarlıqları hökmdən əvvəl göndərilən mərhəmətdir",
      ],
      facts: ["“Ad” hekayəsi Quranda sonrakı ümmətlərə xəbərdarlıq olaraq təkrarlanır"],
    },
    quran: [
      {
        excerpt:
          "Ad qövmünə də qardaşları Hudu (göndərdik). O dedi: “Ey qövmüm, Allaha ibadət edin. Sizin Ondan başqa tanrınız yoxdur. Məgər Ondan qorxmursunuz?",
      },
      {
        excerpt:
          "Onlar onu vadilərinə yaxınlaşan bulud kimi gördükdə dedilər: “Bu, bizə yağış yağdıran buluddur! Əksinə, bu, sizin səbirsizliyinizdir. Onun içindəki külək ağrılı-acılı bir əzabdır.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Saleh (ə)",
    summary:
      "Səmud qövmünə göndərildi, onlara dişi dəvənin möcüzəsi verildi və istədikləri əlaməti məhv etdilər.",
    body: [
      "Saleh (əleyhissalam) Ad qövmündən sonra dağlarda böyük evlər tikmək və rahat yaşamaqla məşhur olan Səmud tayfasına göndərildi (Qur'an 7:74). Onları öz qardaşları kimi tək Allaha ibadət etməyə və rəhbərlərinin fitnə-fəsadını tərk etməyə çağırdı. Onlar onun doğruluğunu sübut etmək üçün bir möcüzə tələb etdikdə, Allah açıq və aşkar bir mö'cüzə verdi: bir dişi dəvəni müəyyən bir gündə, onlar da başqa bir gündə içəcəklər (Qur'an, 26:155-156).",
      "Saleh onları açıq şəkildə xəbərdar etdi: “Ona pislik etməyin, yoxsa yaxın bir əzaba düçar olarsınız” (Qur'an, 26:156). Bu əlamət təmkin sınağı idi - onlar Allahın qoyduğu həddi yerinə yetirə bilərdilərmi? Lakin onların ən azğınları açıq üsyanda dişi dəvəni kəsib öldürdülər, sonra Salehi vəd edilmiş əzabı gətirməyə çağırdılar (Qur'an, 7:77). Dəvənin öldürülməsi yazıq az adamın əməli adlandırılsa da, bütün xalq buna razılıq verərək cinayətə şərik olur.",
      "Əzab üç gün ərzində baş verdi: güclü bir partlayış və zəlzələ onları evlərində yaxaladı, Səmud qövmü isə cansız qaldı, Allah Salehi və iman gətirənləri xilas etdi (Qur'an, 7:78-79; 91:14). Dərs kəskindir: möcüzələr inadkar qəlbi yumşaltmaz; onlar yalnız cavabdehlik riskini qaldırırlar. İstənilən və sonra etiraz edilən bir işarə, tələb edənlərə qarşı bir arqumentə çevrilir. Şər qarşısında susmaq isə neytrallıq deyil – bir neçə nəfərin əməlinə görə bütün xalq məsuliyyət daşıyırdı.",
    ],
    profile: {
      nation: "Səmud qövmü",
      location: "Əl-Hicr / şimal-qərb Ərəbistan",
      era: "Reklamdan sonra",
      mission: "Səmudunu bütpərəstlikdən və fitnədən tövhidə çağırın.",
      challenges: [
        "Möcüzə tələbi, sonra onu rədd etmək",
        "Aydın işarə verildikdən sonra açıq itaətsizlik",
        "Saleh və möminlərə qarşı təhdidlər",
      ],
      miracles: ["Dişi dəvə Allah tərəfindən aşkar bir möcüzə olaraq göndərildi"],
      majorEvents: [
        "Dişi dəvənin görünüşü və ortaq su",
        "Dişi dəvənin dizlərinin kəsilməsi və öldürülməsi",
        "Rədd edənləri məhv edən partlayış",
      ],
      lessons: [
        "Möcüzələr inadkar ürəyə fayda vermir",
        "Allahın qoyduğu həddi aşmaq isə real nəticələrə səbəb olur",
        "Pisliyə razılıq onun günahına şərik olur",
      ],
      facts: ["Səmud qövmü dağlarda nəfis evlər oymaqla tanınırdı"],
    },
    quran: [
      {
        excerpt:
          "Bu sizin üçün bir ibrət olaraq Allahın dişi dəvəsidir. Onu Allahın torpağında yeməsi üçün buraxın və ona pislik etməyin, yoxsa ağrılı-acılı bir əzab sizi yaxalayar.",
      },
      {
        excerpt:
          "Onların ən bədbəxtləri göndərildiyi zaman Səmud azğınlıqlarına görə yalançı saydı... Rəbbi də günahlarına görə onların üzərinə fəlakət endirdi və onları bərabərləşdirdi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "İbrahim (ə)",
    summary:
      "Allahın dostu və xalis tövhid nümunəsi olan Xəlilullah hər imtahanda sınanmış və qalib gəlmişdir.",
    body: [
      "İbrahim (əleyhissalam) Qur'anın təfəkkür və şücaətlə əldə etdiyi xalis tövhidin ən yüksək nümunəsidir. Bütə ibadətdə boğulan bir cəmiyyətdə bir gənc olaraq, o, xalqı, atası və hətta padşahı ilə açıq şəkildə mülahizə yürütdü: günəş, ay və ulduzlar hamısı qürub və sönür, bəs onlar necə tanrı ola bilər? (Qur'an, 6:75-79). Bütlərin gücsüzlüyünü üzə çıxarmaq üçün ən böyüyü istisna olmaqla, hamısını sındırdı və xalqına nə baş verdiyini bütlərin özlərindən soruşmağı tapşırdı - onları tanrılarının nə danışa, nə də özlərini müdafiə edə bilməyəcəyini etiraf etməyə məcbur etdi (Qur'an 21:57-67).",
      "Bu dayandığı üçün o, yanan oda atıldı, lakin Allah buyurdu: “Ey atəş, İbrahimə sərinlik və əmin-amanlıq ver” (Qur'an, 21:69) və o, sağ-salamat çıxdı. Onun həyatı tam təslimiyyətlə qarşılaşan sınaqlar silsiləsi oldu: Allah rizası üçün vətənini tərk etdi, qocalıqda saleh övladlar üçün dua etdi və İsmayıla və İshaqa nəsib oldu, sevimli oğlunu qurban kəsmək əmri ilə imtahana çəkildi - Allah uşağı fidyə verməzdən əvvəl həm ata, həm də oğul bunu qəbul etdilər - və Məkkə ümmətinin əsasını Məkkədə iman gətirdilər. və onların arasında bir elçi göndərilməsi üçün (Qur'an, 2:124-129; 37:100-107).",
      "Bu misilsiz sədaqətinə görə Allah İbrahimi xəlil - yaxın dost (Qur'an 4:125) qəbul etdi və onu bütün bəşəriyyət üçün imam, rəhbər etdi (Qur'an, 2:124). Onun mirası onun nəslindən olan peyğəmbərlər, həcc ayinləri və “haqqa meylli İbrahimin dininə” tabe olmaq əmr edilən müsəlmanın şəxsiyyəti vasitəsilə keçir (Qur'an 3:95). Onun hekayəsi ən çətin sınaqlarda təvəkkül öyrədir, həqiqi liderlik fədakarlıq üzərində qurulur və səmimi iman bütün nəsilləri yenidən formalaşdıra bilər.",
    ],
    profile: {
      nation: "Mesopotamiya və Levant icmaları",
      location: "İraq, Levant və Məkkə",
      era: "Orta antik dövr",
      mission: "Xalis tövhidi dirilt və davamlı təslimiyyət mirası yarat.",
      challenges: [
        "Bütpərəstlərlə, öz atası və tiran padşahla qarşı-qarşıya",
        "Vətənindən Allah üçün hicrət",
        "Sevdiyi oğlunu qurban vermənin məhkəməsi",
      ],
      miracles: ["Od Allahın əmri ilə sərin və təhlükəsiz etdi", "Qocalıqda verilən saleh övlad"],
      majorEvents: [
        "Mübahisə etmək və bütləri sındırmaq",
        "Odun içinə atılır və təslim edilir",
        "İsmayılla Kəbənin tikilməsi və böyük fədakarlıq imtahanı",
      ],
      lessons: [
        "Ən ağır sınaqlarda təvəkkül (Allaha təvəkkül).",
        "Həqiqi liderlik qurban tələb edir",
        "Səmimi iman nəsilləri yenidən formalaşdıra bilər",
      ],
      facts: [
        "Allahın yaxın dostu Xəlilullah kimi tanınır",
        "İsmayıl və İshaq vasitəsilə peyğəmbərlərin atası",
      ],
    },
    quran: [
      {
        excerpt:
          "Yadına salın o zaman ki, İbrahim Rəbbi tərəfindən əmrlərlə imtahana çəkildi və o, onları yerinə yetirdi. O dedi: “Həqiqətən, mən səni insanlara rəhbər edəcəyəm.",
      },
      {
        excerpt:
          "Biz dedik: Ey od, İbrahimə sərinlik və əmin-amanlıq ver. Onlar ona zərər vermək istəyirdilər, lakin Biz onları ən çox ziyana uğrayanlardan etdik.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ayaqyalın, çılpaq və sünnətsiz toplanacaqsınız. Qiyamət günü ilk geyinən İbrahim olacaq.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Lut (ə)",
    summary:
      "Öz qövmünü onlardan əvvəl heç bir ümmətin etmədiyi böyük bir əxlaqsızlıqdan çəkindirən peyğəmbər.",
    body: [
      "Lut (əleyhissalam) İbrahimin müasiri və qohumu idi, onunla birlikdə hicrət etmiş, sonra Sodom və yaxınlıqdakı şəhərlərə göndərilmişdir. Onun qövmü, yalnız Allaha ibadət etməyə çağırışla yanaşı, Quranda deyilir ki, “əvvəllər aləmlərdə heç kimin etmədiyi” həyasız bir əxlaqsızlıq – qadınların əvəzinə kişilərə yaxınlaşmaq və onların məclislərində açıq-aydın ədəbsizlik etmək (Qur'an, 7:80-81; 29:28-29). Lut onları səmimiyyətlə paklığa və Allahın qoyduğu təbii sərhədlərə çağırdı.",
      "Onlar onun islahını mübahisə ilə deyil, düşmənçiliklə qarşıladılar, onu ölkədən qovacaqları ilə hədələdilər və ədəb-ərkan çağırışına istehza etdilər: “Onları öz şəhərinizdən qovun. Onlar özlərini pak tutan insanlardır!” (Qur'an, 7:82). Hətta onun öz ailəsində də sınaq ağır idi - arvadı pozğunların tərəfini tutdu və iman gətirmədi, bir daha sübut etdi ki, hidayət Allah tərəfindən verilir və nikah və ya qan vasitəsilə miras alınmır (Qur'an 66:10).",
      "Fərman gəldikdə, Allah mələkləri qonaq şəklində göndərdi. Camaat hətta onlara zərər vurmağa tələsdi və mələklər onların kimliyini açıb ona gecə vaxtı möminlərlə birlikdə getməyi əmr edənə qədər Lut özünü aciz hiss etdi. Sübh çağı şəhərlər alt-üst edildi və daş-qalaq edildi (Qur'an 11:77-83). Lutun hekayəsi, cəmiyyətin günahı bəyəndiyi və onu açıq şəkildə normallaşdırdığı üçün əxlaqi həqiqətin dəyişməyəcəyinə dair açıq bir xəbərdarlıqdır və Allah ixlaslıları, nə qədər az olsa da, həmişə xilas edir.",
    ],
    profile: {
      nation: "Sodom və qonşu şəhərlərin əhalisi",
      location: "Ölü dənizin bölgəsi (geniş sitat gətirilir)",
      era: "İbrahimin vaxtı",
      mission: "Onun qövmünü açıq ədəbsizlikdən və küfrdən tövhidə və paklığa dəvət et.",
      challenges: [
        "Köklənmiş ictimai əxlaqsızlıq",
        "İstehza və qovulma hədələri",
        "Öz arvadının inamsızlığı",
      ],
      majorEvents: [
        "Əxlaqsızlığa qarşı davamlı xəbərdarlıqlar",
        "Mələklərin ziyarəti qonaq qiyafəsində",
        "Şəhərlərin çevrilməsi",
      ],
      lessons: [
        "Əxlaqi həqiqət ictimai bəyənmə ilə dəyişmir",
        "Möminlər çox az ola bilər",
        "Allah ixlaslıları topluca məhv olmaqdan xilas edər",
      ],
      facts: ["İbrahimin onunla birlikdə hicrət edən və Sodoma göndərilən qohumu"],
    },
    quran: [
      {
        excerpt:
          "Siz aləmlərdən kişilərə yaxınlaşıb Rəbbinizin sizin üçün yaratdığını zövcə olaraq tərk edirsiniz? Əksinə, siz həddi aşan bir tayfasınız.",
      },
      {
        excerpt:
          "Əmrimiz gəldikdə şəhərlərin ən hündür yerlərini aşağı saldıq və onların üzərinə qat-qat gildən daşlar yağdırdıq.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "İsmayıl (ə)",
    summary: "Sözünün üstündə duran, imtahana səbir edən, atası İbrahimlə Kəbəni tikən peyğəmbər.",
    body: [
      "İsmayıl (əleyhissalam) İbrahimin qocalıqda bəxş edilmiş ilk oğlu idi. Onun həyatı heyrətamiz bir təvəkkül sınağı ilə başladı: İbrahim Allahın əmri ilə körpə İsmayılı və anası Həcəri Məkkənin heç bir məhsul bitməyən, su axmayan vadisində qoyub getdi. Məhz orada Həcər Səfa və Mərvə təpələri arasında su axtarmaq üçün qaçarkən, Allah Zəmzəm bulağının fışqırmasına səbəb oldu - bu, Həcərin nəslinin və hər bir zəvvarın bu günə qədər Həcc və Ümrə sailərində canlandırdığı bir təminat aktıdır.",
      "Gənc ikən İsmayıl atası ilə birlikdə ən böyük imtahanla üzləşdi: İbrahim ona onu qurban kəsmək görüntüsünü dedikdə, İsmayıl nəfəs kəsən təslimiyyətlə cavab verdi: “Atacan, sənə əmr olunanı et; Əgər Allah istəsə, məni səbirlilərdən taparsan” (Qur'an, 37:102). Hər ikisi tam təslim oldu və Allah İsmayıla böyük bir fədakarlıqla fidyə verdi və onların itaətini əbədi olaraq şərəfləndirdi. Daha sonra ata-oğul birlikdə Kəbənin bünövrəsini qaldıraraq dua etdilər: “Ey Rəbbimiz, bunu bizdən qəbul et! Həqiqətən, Sən Eşidənsən, Biləndir!” (Bəqərə, 127).",
      "Qur'an onun xasiyyətini əzbərləməyə dəyər bir misra ilə belə ifadə edir: “O, vədinə sadiq idi, elçi və peyğəmbər idi. O, ailəsinə namaz qılmağı və zəkat verməyi əmr edərdi və Rəbbinin razılığını qazanardı” (Qur'an, 19:54-55). İsmayılın həyatı sözün üstündə durmağın, səbrli ibadət etməyin, Allaha itaət yolunda bir ailənin həmrəy olmasının gözəlliyini öyrədir. Onun vasitəsilə ərəblərin peyğəmbərlik xətti nəhayət, son peyğəmbər olan Məhəmmədə (s) çatdı.",
    ],
    profile: {
      nation: "Məkkə bölgəsinin ilk əhalisi",
      location: "Məkkə",
      era: "İbrahimin hicrətindən sonra",
      mission: "Tövhidi və ibadəti müdafiə et, ailəsinə namazı və zəkatını əmr et.",
      challenges: [
        "Qısır bir vadidə həyatın sərt başlanğıcı",
        "Qurbanın sınağı",
        "İbadət mərkəzli həyat və müqəddəs əmanət saxlamaq",
      ],
      miracles: ["Səhrada təmin edilən Zəmzəm bulağı", "Allah tərəfindən kəsilən qurbandan fidyə"],
      majorEvents: [
        "Məkkə vadisində anası Həcərlə birlikdə ayrıldı",
        "Qurban sınağı, tam təslimiyyətlə qarşılandı",
        "İbrahimlə Kəbəni tikmək",
      ],
      lessons: [
        "Vədlərinizə sədaqətlə əməl edin",
        "Ailə ibadət və itaətdə əməkdaşlıq edə bilər",
        "Müqəddəs miras güclü xarakter tələb edir",
      ],
      facts: [
        "Quranda vədinə sadiq olaraq təsvir edilmişdir",
        "Ərəb qəbilələrinin əcdadı və son peyğəmbərlik xətti",
      ],
    },
    quran: [
      {
        excerpt:
          "Kitabda İsmayılı da xatırla. Həqiqətən, o, vədinə sadiq idi, elçi və peyğəmbər idi. O, ailəsinə namaz qılmağı və zəkat verməyi əmr edərdi və Rəbbinin razılığını qazanardı.",
      },
      {
        excerpt:
          "İbrahim evin və İsmayılın bünövrəsini ucaltdığı zaman: “Ey Rəbbimiz, bunu bizdən qəbul et! Həqiqətən, Sən Eşidənsən, Biləndir.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "İshaq (ə)",
    summary: "Yaqubun atası İbrahimə müjdə verən mübarək bir peyğəmbər.",
    body: [
      "İshaq (əleyhissalam) İbrahim və arvadı Saranın qocalıq çağlarında dünyaya gəldi - uşaqlıq çağını keçmiş Sara heyrətlə gülən zaman mələklər bu doğumu müjdə olaraq bildirdilər. Qurani-kərim bu anı qeyd edir: “Biz onu İshaqla və İshaqdan sonra Yəqubla müjdələdik” (Qur'an, 11:71). Onun dünyaya gəlməsi, Allahın qüdrət və rəhmətinin adi insan sərhədləri ilə bağlı olmadığına işarə, çətin bir ümidlə gözləyən hər mömin üçün bir rahatlıq idi.",
      "Qur'an ardıcıl olaraq saleh, seçilmiş və əzəmətli peyğəmbərlər arasında İshaqın adını çəkir, onu və Yəqubu “ibadət və görmə gücü” (Qur'an 38:45-47) kimi təsvir edir. İshaq vasitəsilə Yaqub (İsrail) gəldi və Yəqubdan Bəni-İsrailə göndərilən uzun bir peyğəmbərlər silsiləsi gəldi - beləliklə, İshaq peyğəmbərliyin atası, nəsillər arasında hidayətin davamlılığında bir halqa kimi dayanır.",
      "Onun hekayəsi qısa olsa da, iki davamlı dərs daşıyır: Allahın gözlədiyimizdən artıq bəxş etdiyi nemətlərə görə minnətdarlıq və saleh nəslin əmanət olduğunu dərk etmək – iman təkcə irsi olaraq deyil, ötürülməlidir. İbrahimin ailəsinə qoyulan nemət Allaha bağlı qullar tərəfindən daşındığı üçün qorunub saxlanılmışdır.",
    ],
    profile: {
      nation: "Levant icmaları",
      location: "Levant (Şam)",
      era: "İbrahimdən sonra",
      mission: "İbrahimin mübarək nəslində peyğəmbərlik rəhbərliyini davam etdirin.",
      miracles: ["Yaşlı valideynlərə doğum müjdə verdi"],
      majorEvents: [
        "İbrahim və Saraya verilən müjdə",
        "Yəqub vasitəsilə peyğəmbərlik nəslinin davamı",
      ],
      lessons: [
        "Allah insana gözlədiyindən çox şey bəxş edir",
        "Saleh nəsli qorunmalı əmanətdir",
        "Sadiq ardıcıllıq rəhbərliyi canlı saxlayır",
      ],
      facts: [
        "Yaqubun atası",
        "Seçilmiş bir ailə olaraq İbrahim və Yaqubla yanaşı adlandırılmışdır",
      ],
    },
    quran: [
      {
        excerpt:
          "Arvadı isə durmuşdu və güldü. Sonra onu İshaqla və İshaqdan sonra Yəqubla müjdələdik.",
      },
      {
        excerpt:
          "Qüdrətli və bəsirətli bəndələrimiz İbrahimi, İshaqı və Yəqubu yada sal! Həqiqətən, Biz onları xüsusi bir xüsusiyyətə görə seçdik: Evi zikr etmək.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yaqub (ə)",
    summary:
      "İsrail də adlanır, qəm-qüssə ilə gözəl səbri Allaha sarsılmaz təvəkkül nümunəsi olan bir peyğəmbərdir.",
    body: [
      "İsrail də adlandırılan Yəqub (əleyhissalam) İshaqın oğlu və Bəni-İsrail qəbilələrindən olan on iki nəfərin, o cümlədən Yusifin atası idi. Övladlarını tövhid üzərində böyütdü və ölüm yatağında onlardan aldığı əhd-peymanı Quranda qoruyub saxladı: “Məndən sonra nəyə ibadət edəcəksiniz?”. Cavab verdilər: “Biz sənin və atalarının Allahına ibadət edəcəyik... bir olan Allaha və biz Ona təslim olmuşuq” (Qur'an, 2:132-133). Onun ən dərin qayğısı sona qədər gələcək nəslin imanı idi.",
      "Onun böyük sınaqları Yusifin hekayəsində baş verir. Oğulları Yusifin köynəyini və canavarın onu yediyini iddia edərək geri qayıtdıqda, Yəqub hiyləni başa düşdü və qəzəblə deyil, təmkinlə cavab verdi: “Beləliklə, səbr etmək daha layiqdir və Allah sizin təsvir etdiyiniz şeylərə qarşı kömək istənəndir” (Qur'an, 12:18). Uzun illər ayrılıqda o, Qur'anın acı bir şəkildə dediyi kimi, kədərdən gözləri ağarana qədər kədərləndi - buna baxmayaraq kədərini boğdu və heç vaxt ümidini kəsmədi (Qur'an 12:84).",
      "Yəqubun misalının ürəyi bir cümlədir: “Allahın rəhmətindən ümidinizi kəsməyin; Həqiqətən, kafir qövmdən başqa heç kəs Allahın mərhəmətindən ümidini kəsər” (Qur'an, 12:87). Onun səbr cəmil nümunəsidir - gözəl səbr - passiv təslim olmaq deyil, Allahın hikmətinin vaxtında ortaya çıxacağına aktiv, ümidli inamdır. Nəhayət, Yusifin yanına qayıtdıqda və gözləri açıldıqda, bu səbri doğruldu. Yəqub hər qəmli möminə həm kədəri, həm də yəqini eyni qəlbdə saxlamağı öyrədir.",
    ],
    profile: {
      nation: "Bəni-İsrailin mənşəyi",
      location: "Misirə köç ilə Levant",
      era: "Yusif nəsli",
      mission: "Onun ailəsini və nəslini tövhiddə hidayət et.",
      challenges: [
        "Oğulları arasında gərginlik və qısqanclıq",
        "Yusifdən uzun müddət ayrılıq",
        "Ümidini itirmədən dərin kədərə dözmək",
      ],
      majorEvents: [
        "Oğullarına verdiyi nəsihət və tövhid əhdi",
        "Yusif üçün uzun illər səbr kədəri",
        "Misirdə Yusiflə sevincli görüş",
      ],
      lessons: [
        "Gözəl səbr (səbr cəmil) aktiv, ümidverici imandır",
        "Valideynlər övladlarının iman mirasını formalaşdırırlar",
        "Allahın rəhmətindən əsla ümidinizi kəsməyin",
      ],
      facts: ["İsrail də deyilir", "Yusifin atası və Bəni-İsrail qəbilələri"],
    },
    quran: [
      {
        excerpt:
          "Buyurdu: Əksinə, nəfsiniz sizi bir şeyə sövq etmişdir. Beləliklə, səbir ən uyğundur. Ola bilsin ki, Allah onların hamısını mənim yanıma gətirsin.",
      },
      {
        excerpt:
          "Onlar dedilər: “Biz sənin məbuduna, ataların İbrahimin, İsmayılın və İshaqın İlahına ibadət edəcəyik və biz Ona təslim olmuşuq.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yusif (ə)",
    summary:
      "Bir quyudan Misir taxtına gedən yolu paklığı, səbri və bağışlamağı öyrədən peyğəmbər.",
    body: [
      "Yusif (əleyhissalam) Qur'anın ən mükəmməl tək hekayəsinin - Allahın \"Həqiqətlərin ən yaxşısı\" adlandırdığı Yusif surəsinin mövzusudur (Qur'an 12:3). O, uşaq ikən həqiqi yuxuda on bir ulduzun, günəşin və ayın ona səcdə etdiyini gördü. Paxıl qardaşları onu quyuya atıb Misirdə köləliyə satdılar və orada güclü bir məmurun evinə satın aldılar. Yusif hər dönüşdə öz imanını və bütövlüyünü qorudu.",
      "Ağasının arvadı onu aldatmaq istəyəndə onun saflığı sınandı. O, “Allaha sığınıram” deyərək imtina etdi və zindanı günahdan üstün tutdu: “Mənə zindan onların məni dəvət etdiklərindən daha sevimlidir” (Qur'an, 12:33). Günahsız olmasına baxmayaraq, o, illərlə həbsdə yatdı və hətta orada məhbus yoldaşlarını tövhidə çağırdı və yuxularını yozdu. Padşahın yeddi illik aclıq haqqında yuxusu sarayı çaşdırdıqda, Yusifin Allahın verdiyi təfsir hədiyyəsi onu padşahın hüzuruna gətirdi və o, onu Misir xəzinələrinə rəhbərlik etdi. Xalqı aclıqdan hikmət və ədalətlə idarə etdi.",
      "Hekayənin kulminasiyası güc deyil, bağışlanmadır. Qardaşları aclıqdan onu tanımadıqları halda onun qarşısında dayandıqda, Yusif özünü göstərdi və dedi: “Bu gün sənə heç bir günah yoxdur. Allah sizi bağışlayar və O, rəhm edənlərin ən rəhmlidir” (Qur'an, 12:92). O, Rəbbinin onu zindandan çıxarıb ailəyə qovuşdurduğu zaman lütfkarlıq etdiyini söyləyərək, hər bir xeyir üçün Allaha borclu idi. Yusif iffət və təqvanın mömini qoruduğunu, Allahın planının hər bir insan hiyləsini sakitcə alt-üst etdiyini və intiqam deyil, bağışlamağın zadəganlığın əlaməti olduğunu öyrədir.",
    ],
    profile: {
      nation: "Misirdə Bəni-İsrail nəsli",
      location: "Kənan və Misir",
      era: "Musadan əvvəl",
      mission: "Cəmiyyətə xidmət edərkən tövhidi, paklığı və ədaləti qoruyun.",
      challenges: [
        "Qardaşları tərəfindən xəyanət",
        "Sınaq və yalançı böhtan",
        "Günahsız olmasına baxmayaraq uzun müddət həbs",
      ],
      miracles: ["Həqiqi yuxu təfsiri üçün Allahın verdiyi hədiyyə"],
      majorEvents: [
        "Quyu və atasından ayrılıq",
        "Həbs illəri",
        "Misirdə hakimiyyətə yüksəlin və ailəsi ilə qovuşun",
      ],
      lessons: [
        "İffət və namus imanı qoruyur",
        "Bağışlamaq ailələri sağaldır",
        "Allahın planı hər bir insanın hiyləsindən üstündür",
      ],
      facts: [
        "Qissaların ən yaxşısı adlandırılan “Yusif” surəsinin hamısı onun həyatından bəhs edir",
      ],
    },
    quran: [
      {
        excerpt:
          "O dedi: Bu gün sizə heç bir günah yoxdur. Allah sizi bağışlasın; O, rəhm edənlərin ən rəhmlidir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Əsilzadə, əsil oğlu, əsil oğlu, əsil oğlu: Yusif, Yəqub oğlu, İshaq oğlu, İbrahim oğlu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Şueyb (ə)",
    summary:
      "Ticarətdə imanı dürüstlüyə bağlayan, Mədyanı saxtakarlıq və haqsızlıqdan xəbərdar edən peyğəmbər.",
    body: [
      "Şüeyb (əleyhissalam) aldatmaqla iqtisadiyyatını fəsad törətmiş ticarət camaatı olan Mədyən əhlinə göndərilmişdi: ölçü və çəkini az vermək, insanların mallarını aldatmaq və yer üzündə zülm yaymaq. Onun mesajı insanların tez-tez ayırmağa çalışdıqları imanın iki yarısını - ibadət və əxlaqı birləşdirdi: “Ey qövmüm, Allaha ibadət edin; Sizin Ondan başqa tanrınız yoxdur. Ölçü və çəkini ədalətlə tam verin və insanların haqqını əsirgəməyin!” (Qur'an, 11:84-85).",
      "Onun xalqı müqavimət göstərərək, onun dualarının atalarının saxta adətlərindən əl çəkmələrini və öz malları ilə istədiklərini etmələrini tələb edib-etməmələrini istehza ilə soruşdular (Qur'an 11:87). Onu ələ saldılar, onu və möminləri qovulmaqla hədələdilər, hətta yolları bağladılar. Şüeyb şəfqət və açıq-aydın öyüd-nəsihətlə israr etdi və təkid etdi ki, gücü yetdiyi qədər islahat axtardı və uğurunun yalnız Allahdan olduğunu söylədi: “Mənim uğurum ancaq Allahdandır. Mən Ona təvəkkül etdim və mən də Ona qayıdacağıq” (Qur'an, 11:88). O, xalqını çağırmaqda bəlağəti ilə yadda qalıb.",
      "Onlar inkar etməkdə israr etdikdə, əzab gəlib zalımları yaxaladı, Allah isə Şueybi və möminləri xilas etdi (Qur'an, 7:91-93). Onun tərcümeyi-halı tez-tez nəzərdən qaçırılan bir dərs verir: iqtisadi dürüstlük dindən ayrı deyil - bu, onun bir hissəsidir. Bazarda fırıldaqçılıq, zəifləri istismar etmək, tədbirləri manipulyasiya etmək iman məsələsidir və ədalətsizliyi qanuniləşdirən bir cəmiyyət Allahın hökmünü dəvət edir.",
    ],
    profile: {
      nation: "Mədyən əhli",
      location: "Şimal-Qərbi Ərəbistan / Levant ticarət bölgəsi",
      era: "İbrahimin nəsillərindən sonra",
      mission: "Tövhidə, ticarətdə dürüstlüyə və ədalətə çağırın.",
      challenges: ["Bazarda kök salmış korrupsiya", "Elitadan istehza", "Qovulma təhdidləri"],
      majorEvents: [
        "Tam ölçüyə və ədalətli sövdələşməyə çağırış",
        "İctimai müxalifət və təhdidlər",
        "Davamlı inkarçıların cəzası",
      ],
      lessons: [
        "İman biznesdə dürüstlük tələb edir",
        "İctimai ədalətsizlik ilahi hökmü dəvət edir",
        "Peyğəmbərlər təkcə rituallara deyil, sosial və iqtisadi etikaya müraciət edirlər",
      ],
      facts: ["Yalnız çəki və ölçüləri vurğulamaqla tanınır"],
    },
    quran: [
      {
        excerpt:
          "Ey qövmüm, Allaha ibadət edin. Sizin Ondan başqa tanrınız yoxdur. Ölçü və çəkini tam verin, insanların haqqını əsirgəməyin və yer üzündə fitnə-fəsad törətməyin.",
      },
      {
        excerpt: "Mənim uğurum ancaq Allahdandır. Mən Ona təvəkkül etdim və Ona da qayıdıram.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Əyyub (ə)",
    summary: "Qur'anın səbr modeli: uzun sürən xəstəlik və itki ilə bağlılıqda sarsılmaz.",
    body: [
      "Əyyub (əleyhissalam) — Əyyub — Quranda səbrin daimi simvoludur. O, sağlamlıq, var-dövlət və ailə ilə bərəkətli, sonra onları itirməklə və uzun, ağrılı bir xəstəliklə imtahana çəkilmiş bir peyğəmbər idi. Bütün bunlara görə o, heç vaxt qəzəblənmədi və Rəbbini haqsızlıqda ittiham etmədi; şükür və zikrdən möhkəm yapışdı. Qur'an onu bütün hekayətini əhatə edən sözlərlə tərifləyir: “Həqiqətən, Biz onu səbirli, gözəl bir bəndə gördük. Həqiqətən, o, təkrar-təkrar Allaha tərəf dönən biri idi” (Qur'an, 38:44).",
      "Nəhayət, sıxıntı çoxaldıqda, onun duasının mükəmməl ədəbinə (ədəbinə) diqqət yetirin. Allahın hökmündən tələb və şikayət etmədi; o, Rəbbinin hüzurunda sadə və təvazökarlıqla öz halını belə ifadə etdi: “Həqiqətən, mənə müsibət üz verdi və Sən rəhm edənlərin ən rəhmlisisən” (Qur'an, 21:83). O, Allahın rəhmətini soruşduğu anda təsdiq etdi. Allah ona belə cavab verdi: “Ayağını yerə vur. Bu, sərin bir hamam və içkidir” və O, Öz tərəfindən bir mərhəmət və ibadət edənlər üçün bir öyüd-nəsihət olaraq bəlaları aradan qaldırdı, ailəsini və daha çoxunu bərpa etdi (Qur'an 21:84; 38:41-43).",
      "Əyyub öyrədir ki, səbr passiv dözümlülük deyil, aktiv ibadətdir - sınaq zamanı Allaha davamlı dönüş. Onun nümunəsi də dua etməyimizi gözəlləşdirir: təvazökarlıqla, hökmdən şikayət etmədən və Allahın rəhmətinə yəqinliklə. Və onun sonu, sınanmış hər bir mömini əmin edir ki, imanla gətirilən sınaqlar bəndənin dərəcəsini yüksəldə bilər və həmişə Allahın zamanında rahatlıq gətirir.",
    ],
    profile: {
      era: "İbrahimdən sonrakı peyğəmbərlik dövrü (geniş kontekst)",
      mission: "Çətinlikdə səbir və ibadətlə təcəssüm etdirərək qövmünə hidayət et.",
      challenges: [
        "Uzun və ağrılı bir xəstəlik",
        "Sərvət və ailə itkisi",
        "Uzun müddətli sınaq altında dözümlülük",
      ],
      miracles: [
        "Allahın əmri ilə şəfa və rahatlıq",
        "Ailənin bərpası və sınaqdan sonra xeyir-dua",
      ],
      majorEvents: ["Çətinlikdə onun təvazökar yalvarışı", "İlahi rahatlıq, şəfa və bərpa"],
      lessons: [
        "Səbir fəal ibadət növüdür",
        "Dua təvazökar və şikayətsiz olduqda ən gözəldir",
        "İmanla çəkilən sınaqlar insanın dərəcəsini yüksəldə bilər",
      ],
      facts: ["İslam ənənəsində səbrin nümunəsi kimi göstərilmişdir"],
    },
    quran: [
      {
        excerpt:
          "Əyyubu da Rəbbinə nida etdiyi zaman: “Mənə bir müsibət üz verdi və Sən rəhm edənlərin ən rəhmlisisən.",
      },
      {
        excerpt:
          "Həqiqətən, Biz onu səbirli, gözəl bir bəndə gördük. Həqiqətən, o, Allaha dönən biri idi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Zül-Kifl (ə)",
    summary: "Saleh peyğəmbər səbirlilərdən sayılır, hekayəsi qısa olsa da, şərəflidir.",
    body: [
      "Zül-Kifl (əleyhissalam) Quranda iki dəfə, hər ikisi də möhtərəm peyğəmbərlərlə birlikdə çəkilmişdir. Allah onu İsmayıl və İdrislə birlikdə sıralayır - hamısı səbirlilərdəndir. Biz onları öz mərhəmətimizə qovuşdurduq. Həqiqətən, onlar əməlisalehlərdən idilər” (Qur'an 21:85-86) – və yenə də onu İsmayıl və Əl-Yəsa ilə birlikdə ən yaxşılardan xatırlayır” (Qur'an 38:48). Təfərrüatlı bir hekayə verilməsə də, hər qeyd tərifdir.",
      "Qur'an və mötəbər Sünnə onun həyatını genişləndirmədiyi üçün klassik alimlər hətta əsas təfərrüatlarda da fikir ayrılığına malikdirlər - bəziləri onun peyğəmbər və ya saleh insan olduğunu düşünürdülər, baxmayaraq ki, o, əsas müsəlman siyahılarında peyğəmbərlər sırasında sayılır. Diqqətli mömin sükutu təsdiqlənməmiş nağıllarla doldurmaqdan çəkinir və Allahın təsdiq etdiyi şeyləri yerinə yetirir: səbirli və saleh idi və bu, kifayət qədər şərəfdir.",
      "Onun daxil olması sakit bir ibrət dərsi daşıyır: Allah tərəfindən sevilən hər bir bəndənin arxasında məşhur bir hekayə qalmaz. Ardıcıl, sədaqətli xidmət - tarixdə heç vaxt qeydə alınmayan, lakin Allaha tam məlum olan xidmət - məhz Onun mərhəmətini qazanan növdür. Gizli möhkəmlik az deyil; o, saleh həyatın mahiyyətidir.",
    ],
    profile: {
      era: "Daha sonra İsadan əvvəlki peyğəmbərlik dövrləri (geniş şəkildə yerləşdirilmiş)",
      mission: "Xalqını itaətə və salehliyə dəvət et.",
      lessons: [
        "Səbir peyğəmbərlik xarakterinin əsasını təşkil edir",
        "Məhdud təfərrüat hələ də güclü təlimat daşıyır",
        "Sadiq, qeybi xidmət Allaha sevimlidir",
      ],
      facts: [
        "Xəstələr arasında İsmayıl və İdris adları çəkildi",
        "Əsas müsəlman siyahılarında peyğəmbərlər arasında sayılır",
      ],
    },
    quran: [
      {
        excerpt:
          "İsmayıl, İdris və Zül-Kifl – hamısı səbirlilərdən idi. Biz onları öz mərhəmətimizə qovuşdurduq. Həqiqətən, onlar əməlisalehlərdən idilər.",
      },
      {
        excerpt: "Və İsmayılı, Əl-Yəsa'yı və Zül-Kifli xatırlayın ki, hamısı üstün olanlardandır.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Musa (ə)",
    summary: "Fironun zülmü ilə qarşılaşan və Tövratı alan Bəni-İsrailin böyük elçisi.",
    body: [
      "Musa (əleyhissalam) Quranda ən çox adı çəkilən peyğəmbərdir və onun hekayəsi zəngin təfərrüatlarla izah edilir. Fironun Bəni-İsrail oğullarını öldürmək əmri ilə doğulmuş, o, körpə ikən anası tərəfindən - Allahın ilhamı ilə - Nil çayına səbətə qoyulmuş və Allahın planı ilə Fironun öz sarayında böyütülmüşdür (Qur'an 28:7-13). İllər sonra Misirdən çıxıb Mədyəndə evləndikdən sonra Allah onu müqəddəs Tuva vadisinə çağırdı, Allah onunla birbaşa danışdı, ona əsas və əl işarəsini göstərdi və qardaşı Harunla birlikdə zalım Fironun yanına göndərdi (Qur'an, 20:9-36).",
      "Onun vəzifəsi iki şeyi çatdırmaq idi: tək Allaha ibadət etməyə çağırış və məzlum İsrail övladlarını azad etmək tələbi. Özünün tanrı olduğunu iddia edən firon onu itaətsizliklə qarşıladı və hətta bir sıra açıq-aydın əlamətlərdən sonra - ilana çevrilən və sehrbazların hiylələrini və bəlalarını uddu - o, boyun əyməkdən imtina etdi. Musa Bəni-İsraili çıxaranda Firon onları dənizə qədər təqib etdi. Orada Allah: “Əsanla dənizi vur!” əmrini verdi və dəniz ikiyə ayrıldı və Firon və ordusu boğulduqda möminlər quruya keçdilər (Qur'an, 26:63-66).",
      "But liberation was only the beginning. Musa daha sonra çətin və çox vaxt nankor bir xalqa rəhbərlik etmək üçün daha çətin, daha uzun sınaqlardan keçdi: o, Tövratı dağda aldı, ancaq qayıdıb onları qızıl buzova sitayiş etdiklərini gördü; şikayətləri, tələbləri və səbirli, möhkəm rəhbərliyə tabe olmamaları ilə üzləşdi. Musanın həyatı iki böyük mövzunu birləşdirir - ədalətsizliyə və zülmə qarşı durmaq cəsarəti və insanları azad olduqdan sonra itaətə doğru istiqamətləndirmək üçün tələb olunan dözüm. O, ülul-əzmlərdən biri kimi bir cəmiyyətin həm islahatçısının, həm də çobanının nümunəsidir.",
    ],
    profile: {
      nation: "Bəni-İsrail (Firon qövmünə çağırışla)",
      location: "Misir və Sinay",
      era: "Davuddan və Süleymandan əvvəl",
      mission: "Tövhidə çağırın, Fironun zülmü ilə üzləşin və Tövratı çatdırın.",
      challenges: [
        "İlahlıq iddiasında olan Fironla üz-üzə gəlmək",
        "Müqavimətli və nankor xalqa rəhbərlik etmək",
        "Daimi təzyiq altında davamlı liderlik",
      ],
      miracles: [
        "İlana çevrilən əsa",
        "Allahın əmri ilə dənizin yarılması",
        "Fironun qarşısında göstərilən çoxlu əlamətlər",
      ],
      majorEvents: [
        "Allah müqəddəs vadidə onunla danışır",
        "Firon və sehrbazlarla qarşıdurma",
        "Çıxış və Tövratın nazil olması",
      ],
      lessons: [
        "Zalımlığa qarşı cəsarətlə durun",
        "İnsanlar üzərində liderlik böyük səbir tələb edir",
        "Azadlıq Allaha itaətlə birləşdirilməlidir",
      ],
      facts: [
        "Qətiyyətli beş elçidən biri (ulul-əzm)",
        "Kəlimullah adlanır - Allahın birbaşa danışdığı şəxs",
      ],
    },
    quran: [
      {
        excerpt:
          "Mən səni seçdim, nazil olana qulaq as. Həqiqətən, mən Allaham. Məndən başqa məbud yoxdur, Mənə ibadət et və Məni zikr etmək üçün namaz qıl.",
      },
      {
        excerpt:
          "Musanın anasına belə vəhy etdik: “Onu əmizdirin, onun üçün qorxduğunuz zaman onu çaya atın və qorxmayın və kədərlənməyin. Həqiqətən, Biz onu sənə qaytaracağıq.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ölüm mələyi Musaya göndərildi. Onun yanına gəldikdə Musa onu vurdu və Allah onun gözünü bərpa etdi və ölüm vaxtı ilə bağlı ona seçim verdi.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Harun (ə)",
    summary: "Musanın fəsahətli qardaşı, Firondan əvvəl ona köməkçi peyğəmbər təyin edilmişdi.",
    body: [
      "Harun (əleyhissalam) Musanın böyük qardaşı və öz növbəsində peyğəmbər idi. Allah Musanı Fironun yanına göndərən zaman Musa ondan dəstək istədi: “Və mənim üçün ailəmdən bir vəzir təyin et, qardaşım Harunu. Onun vasitəsilə qüvvətimi artır və işimə şərik ol” (Qur'an, 20:29-32). Allah xahişi yerinə yetirdi və Quranda Onun cavabı qeyd olunur: “Qardaşın vasitəsilə sənin qolunu gücləndirəcəyik” (Qur'an, 28:35). Danışıqda daha bəlağətli olduğu səciyyələndirilən Harun, Allahın xəbərini tirana çatdırarkən Musanın yanında dayanmışdı.",
      "Onun ən sınaq anı Musanın yoxluğuna təsadüf edir. Musa Tövratı qəbul etmək üçün dağa gedəndə Bəni-İsrail qızıl bir buzova ibadət etməyə başladı. Harun onları saxlamağa çalışaraq: “Ey qövmüm, sizi ancaq bununla imtahana çəkirsiniz və həqiqətən, Rəbbiniz Rəhmlidir, mənə tabe olun və əmrimə itaət edin!” – deyərək, onun hakimiyyətinə qalib gəldilər və az qala ona zərər verəcəklər” (Qur'an, 20:90-94). Musa qəzəblə qayıdanda Harun izah etdi ki, o, daha şiddətli davranaraq, Musa geri dönməzdən əvvəl camaatı döyüşən qruplara parçalayacağından qorxurdu (Qur'an 7:150).",
      "Harunun tərcümeyi-halı Allaha xidmətdə komanda işinin dəyərini - ikinin daşıdığı missiya birdən daha güclüdür - və həqiqəti heç vaxt pozmadan birliyi qorumağın incə hikmətini vurğulayır. Bəzən sədaqətli liderlik, parçalanan icmanı bir yerdə saxlamaq və işlər yoluna qoyulana qədər zərərin qarşısını almaq deməkdir. Harun Quranda doğru yolda olanlar arasında şərəflidir və Allah ona və Musaya sonrakı nəsillər arasında əbədi həmd qoyub getmişdir (Qur'an 37:119-122).",
    ],
    profile: {
      nation: "Bəni İsrail",
      location: "Misir və Sinay",
      era: "Musanın dövrü",
      mission: "Musaya tövhidə dəvət və Bəni-İsraili doğru yola yönəltməkdə dəstək olun.",
      challenges: [
        "Firon rejimi ilə qarşıdurma",
        "Musanın yoxluğunda camaatı idarə etmək",
        "Xalq arasında daha böyük parçalanmanın qarşısını almaq",
      ],
      majorEvents: [
        "Musaya nazir təyin edilməsi və dəstəklənməsi",
        "Firon qarşısındakı missiya",
        "Qızıl buzovun sınağı",
      ],
      lessons: [
        "Komanda işi Allaha dəvəti gücləndirir",
        "Liderlik bəzən böhran vəziyyətində insanları bir arada tutmaq deməkdir",
        "Həqiqətdən heç vaxt güzəştə getmədən birliyi qoruyun",
      ],
      facts: ["Musanın böyük qardaşı", "Quranda bəlağətinə görə təriflənmişdir"],
    },
    quran: [
      {
        excerpt:
          "Mənə ailəmdən bir vəzir – qardaşım Harunu təyin et. Onun vasitəsilə gücümü artır və tapşırığıma şərik çıxmasına icazə ver.",
      },
      {
        excerpt:
          "Dedi: Anamın oğlu, həqiqətən, camaat mənə qalib gəldi və məni öldürmək istəyirdilər, qoy düşmənlər mənə sevinməsinlər.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Davud (ə)",
    summary:
      "Bir peyğəmbər-padşah hikmət, ədalət və zəbur və ibadət mərkəzli liderlik nümunəsi verdi.",
    body: [
      "Davud (əleyhissalam) - Davud gənc ikən Talutun (Şaul) ordusunda zalım Caluta (Caliata) qarşı çıxdı. Davud Calutu vurdu və “Allah ona hökmranlıq və hikmət verdi və ona istədiyini öyrətdi” (Bəqərə, 251). Sonra Allah ona padşahlıq, peyğəmbərlik və nazil olan kitab olan Zəbur (Zəbur) bəxş etdi və onu həm də sadiq ibadət edən nadir bir hökmdar nümunəsi etdi.",
      "Allah ona heyrətamiz hədiyyələr verdi: dağlar və quşlar Allahı təsbih etmək üçün ona qoşulardı və zireh hazırlaya bilsin deyə, onun əllərində dəmir yumşaldılırdı (Qur'an 21:79; 34:10-11). Bununla belə, Davud bütün bu qüdrətlə çox təvazökar və sadiq qaldı. Onun ibadəti o qədər şiddətli idi ki, Peyğəmbər  Davudun orucunu - hər gün oruc tutmağı - Allah yanında ən sevimli oruc, gecə namazını isə ən sevimli namaz kimi vəsf etmişdir. Quranda həmçinin bir mühakimə epizodu təqdim edilir ki, Davud yumşaq bir şəkildə düzəldib dərhal səcdəyə qapandı, bağışlanma dilədi və Rəbbinə tərəf döndü (Qur'an 38:24).",
      "Davudun həyatı hakimiyyətin imtiyaz deyil, əmanət olduğunu öyrədir. Allah birbaşa ona xitab edir: “Ey Davud, Biz səni yer üzündə canişin etdik, insanlar arasında ədalətlə hökm et və nəfsin istəklərinə tabe olma” (Qur'an, 38:26). Ədalət, daim Allahı zikr etmək, tez tövbə və nizam-intizamlı ibadət həyatı saleh liderliyi təmin edir. Güc ən çox əyilənin əlindədir.",
    ],
    profile: {
      nation: "Bəni İsrail",
      location: "Yerusəlim bölgəsi",
      era: "Süleymanın hökmranlığından əvvəl",
      mission: "Ədalətlə rəhbərlik et, haqq ilə hökm et və xalqını Allaha dəvət et.",
      challenges: [
        "Məhkəmə məsuliyyətinin çəkisi",
        "Gücü təvazökarlıqla balanslaşdırmaq",
        "Rəhbərlikdə ictimai hesabatlılıq",
      ],
      miracles: [
        "Onunla birlikdə Allahı təsbih edən dağlar və quşlar",
        "Dəmir Allahın izni ilə onun əlində yumşaldılır",
      ],
      majorEvents: [
        "Calutun gəncliyində məğlubiyyəti",
        "Şahlıq, peyğəmbərlik və Zəburun nazil olması",
        "Miras oğlu Süleymana keçdi",
      ],
      lessons: [
        "Ədalət ədalətli idarəetmənin mərkəzidir",
        "Hər hansı bir səhvdən sonra tez tövbə edin",
        "İntizamlı ibadət həyatı liderliyi gücləndirir",
      ],
      facts: ["Zəbur (Zəbur) alan", "Calutu (Goliath) gənc ikən məğlub etdi"],
    },
    quran: [
      {
        excerpt: "Ey Davud!",
      },
      {
        excerpt:
          "Biz dağları Davudla birlikdə təsbih etmək üçün ram etdik, quşları da... Sizi düşməninizdən qorumaq üçün ona zirehli paltarlar tikməyi öyrətdik.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah yanında ən sevimli dua Davudun namazıdır, Allah yanında ən sevimli oruc isə Davudun orucudur: bir gün oruc tutar, bir gün iftar edərdi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Süleyman (ə)",
    summary:
      "Bir peyğəmbər-padşaha misilsiz səlahiyyət verilmiş, lakin minnətdarlıq və müdrikliyə əsaslanmışdır.",
    body: [
      "Süleyman (əleyhissalam) — Süleyman həm padşahlığı, həm də peyğəmbərliyi atası Davuddan miras almışdır və Qur'an onu “gözəl bir bəndə, həqiqətən də Allaha dönən bir bəndə” kimi tərifləyir (Qur'an 38:30). O, gələcək heç bir səltənətə bənzəməyən bir səltənət üçün dua etdi və Allah ona qeyri-adi imkanlar verdi: onun əmri ilə axan küləyə əmr etmək; Allahın izni ilə onun üçün tikib göyərçin edən cinlərin xidməti; və quşların və digər canlıların nitqini başa düşmək (Qur'an 21:81-82; 34:12-13; 27:16).",
      "İki səhnə onun xarakterini ələ keçirir. Bir qarışqa Süleymanın ordusunun bilmədən onları əzməsi üçün öz koloniyasına sığınmaq üçün xəbərdarlıq etdikdə, Süleyman gülümsədi və Allaha anlayış lütfü üçün şükr etdi, şükür və saleh olmaq üçün dua etdi (Qur'an 27:18-19) - güc onu daha da təvazökar etdi, daha az deyildi. O, Səba mələkəsinin (Səba) və onun qövmünün günəşə sitayiş etdiyini eşidəndə, onları zorla məğlub etmədi, əksinə onları Allaha təslim olmağa dəvət etdi və nəticədə hikmət və Allahın ona verdiyini nümayiş etdirməklə onu iman gətirdi (Qur'an, 27:22-44). Hətta verdiyi geniş nemətləri də imtahan kimi qələmə verdi: “Bu, Rəbbimin lütfündəndir ki, məni sınamaq üçün şükür edib nankorluq edib,” (Qur'an, 27:40).",
      "Süleyman qüdrətin ən ağır imtahanlardan biri olduğunu və şükürün (şükrün) dərmanı olduğunu öyrədir. Möminə verilən sərvət, qabiliyyət və səlahiyyət ondan ədalət üçün istifadə etmək və insanları heç vaxt lovğalıq üçün deyil, Allaha dəvət etmək məqsədi daşıyır. Onun bütün səltənəti, bütün möcüzələri ilə, onu bəxş edənə işarə edir - və bu, yüksəldən bir nemət ilə pozan bir nemət arasındakı fərqdir.",
    ],
    profile: {
      nation: "Bəni-İsrail və ətraf səltənətlər",
      location: "Yerusəlim və daha geniş bölgə",
      era: "Davuddan sonra",
      mission: "Ədalətlə hökm edin və xalqları Allaha ibadət etməyə çağırın.",
      challenges: [
        "Böyük bir səltənəti idarə etmək",
        "Böyük qüdrət arasında minnətdarlığı qorumaq",
        "Müxtəlif qüvvələri məsuliyyətlə idarə etmək",
      ],
      miracles: [
        "Allahın izni ilə küləyə əmr et",
        "Cinlərin tikinti və dalğıcda xidməti",
        "Quşların və qarışqaların nitqini başa düşmək",
      ],
      majorEvents: [
        "Davudun padşahlığına və peyğəmbərliyinə varis olmaq",
        "Qarışqa epizodu və onun minnətdarlığı",
        "Səba kraliçası ilə yazışmalar və onun inancı",
      ],
      lessons: [
        "Güc dərin bir sınaqdır",
        "Minnətdarlıq təkəbbürdən qoruyur",
        "Hikmət və dəvət ürəkləri gücdən daha yaxşı çevirə bilər",
      ],
      facts: ["Quranda ən dolğun təsvir olunan peyğəmbər-padşahlar arasında"],
    },
    quran: [
      {
        excerpt:
          "O, gülümsədi, onun danışığından əyləndi və dedi: “Ey Rəbbim, mənə və ata-anama bəxş etdiyin nemətə şükür etməyi və razı olduğun yaxşı işlər görməyi mənə nəsib et.",
      },
      {
        excerpt:
          "Səhər yolu bir aylıq, günortadan sonra isə bir aylıq yol qət edən küləyi Süleymana da ram etdik.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "İlyas (ə)",
    summary: "Bə'lə ibadətlə qarşılaşan və qövmünü Allaha tərəf çağıran peyğəmbər.",
    body: [
      "İlyas (əleyhissalam) – İlyas – Bəni-İsrailin bütpərəstliyə düşmüş bir ümmətinə göndərildi. Qurani-kərim onun birbaşa etirazını bildirir: “Məgər Allahdan qorxmursunuz? Siz Bələ yalvarıb ən gözəl yaradanı – sizin Rəbbiniz və ilk atalarınızın Rəbbi olan Allahı tərk edirsiniz?” (Qur'an 37:124-126). Onun çağırışı əbədi peyğəmbərlik çağırışı idi: yalançı tanrıları soyun və yalnız Yaradana ibadət edin.",
      "Qur'an onun missiyasını tanış peyğəmbərlik nümunəsi ilə yekunlaşdırır - açıq-aydın dəvət, əksəriyyət tərəfindən rədd edilməsi və səmimi insanlar üçün qorunan şərəf. “Onlar onu inkar etdilər, buna görə də Allahın seçilmiş bəndələri istisna olmaqla, onlar [əzab üçün] gətiriləcəklər” (Qur'an, 37:127-128). Allah onu salehlərdən adlandırır və ona əbədi salam və həmd qoyur: “Salam olsun İlyasa” (Qur'an 37:129-130) və onu Zəkəriyyə, Yəhya və İsa ilə birlikdə doğru yolda olanlardan qeyd edir (Qur'an, 6:85).",
      "İlyasın dərsi budur ki, həqiqi islahat ibadəti islah etməkdən başlayır. Cəmiyyət sədaqəti yalançı obyektlərə - istər həqiqi bütlərə, istərsə də müasir istək, sərvət və status bütlərinə yönəldərkən düzəldilə bilməz. Tövhid, bütün davamlı əxlaqi yenilənmənin üzərində qurulduğu təməldir və hətta mömin bir qrup az və sayca çox olsa belə, Allah haqq tərəfdarları hörmətlə qarşılayır.",
    ],
    profile: {
      nation: "Bəni-İsrail arasında bir ümmət",
      location: "Levant bölgəsi",
      era: "Sonrakı israillilərin peyğəmbərlik dövrləri",
      mission: "Xalqını Bələ ibadətdən tövhidə çağır.",
      challenges: ["Dərin kök salmış bütpərəstlik", "Rəhbərliyin müqaviməti"],
      majorEvents: [
        "Xalq Ba'la ibadət etməyə çağırır",
        "Əksəriyyət tərəfindən rədd edilməsi və möminlərin qorunub saxlanması",
      ],
      lessons: [
        "Tövhid bütün islahatların təməlidir",
        "Kiçik bir mömin qrup hələ də Allah üçün vacibdir",
        "Peyğəmbərlər xalq səhvinə qarşı danışır, onunla deyil",
      ],
      facts: ["Salehlər arasında adlanır", "Bütə ibadətlə qarşı-qarşıya qaldı Ba'l"],
    },
    quran: [
      {
        excerpt:
          "O, öz qövmünə demişdi: “Məgər Allahdan qorxmursunuz? Bəli çağırıb ən yaxşı yaradıcıları tərk edirsən?",
      },
      {
        excerpt: "Zəkəriyya, Yəhya, İsa və İlyas da – hamısı əməlisalehlərdən idi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Əl-Yəsa (ə)",
    summary: "İsrail nəslindən olan saleh peyğəmbər, Quranda adı görkəmli şəxslər arasındadır.",
    body: [
      "Əl-Yəsa (əleyhissalam) — Elişanın adı Quranda iki yerdə peyğəmbərlər arasında çəkilmiş və hər iki yerdə təriflənmişdir. O, Allahın “aləmlərdən üstün tutduğu” İsmayıl, Yunus və Lutla (Qur'an 6:86-87) və yenə də İsmayıl və Zül-Kifllə (Qur'an 38:48) görkəmli şəxslər arasında görünür. Mətn təfərrüatlı bir hekayəni izah etməkdənsə, onun dərəcəsini yüksəldir.",
      "Vəhy onun haqqında bilərəkdən qısa olduğundan, müsəlmanlar dəqiq olanı təsdiqləyirlər - o, öz qövmü arasında tək Allaha ibadət çağırışını müdafiə edən həqiqi peyğəmbərdir - və ona əsası olmayan nağılları bağlamaqdan çəkinirlər. Bu təmkin özü də sağlam inancın bir hissəsidir: biz peyğəmbərə onun ətrafında hekayət uydurmaqla deyil, onun haqqında həqiqəti saxlamaqla hörmət edirik.",
      "Onun xatırladılması, Allahın çoxlu elçilər göndərdiyini xatırladır və bir peyğəmbərin dəyəri onun hekayəsinin nə qədər davam etməsi ilə deyil, missiyaya sadiqliyi ilə ölçülür. Qurani-Kərimin başqa yerdə buyurduğu kimi, “hekayələrini sənə izah etdiyimiz peyğəmbərlər və hekayətlərini izah etmədiyimiz elçilər” (Qur'an 40:78) olub və onların hamısına məlum və bilinməyən iman müsəlmanın imanının bir hissəsidir.",
    ],
    profile: {
      nation: "Bəni İsrail",
      location: "Levant bölgəsi",
      era: "Sonrakı israillilərin peyğəmbərlik dövrləri",
      mission: "Onun qövmü arasında tövhidə çağırışa davam et.",
      lessons: [
        "Bütün peyğəmbərlərə iman baxımından bərabər hörmət edin",
        "Qısa bir Qur'an qeydi hələ də həqiqi hidayəti çatdırır",
        "Saleh davamlılıq iman icmalarını qoruyur",
      ],
      facts: ["Bilavasitə Quranda görkəmli və seçilmişlər arasında adı çəkilir"],
    },
    quran: [
      {
        excerpt: "İsmayılı, Əl-Yəsəni, Yunusu və Lutu və hər şeyi aləmlərdən üstün tutduq.",
      },
      {
        excerpt: "Və İsmayılı, Əl-Yəsa'yı və Zül-Kifli xatırlayın ki, hamısı üstün olanlardandır.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yunus (ə)",
    summary: "Qaranlıqda tövbəsi ümiddə sonsuz bir dərsə çevrilən balina peyğəmbəri.",
    body: [
      "Yunus (əleyhissalam) - Yunus - Nineva xalqına göndərildi, lakin onlar israrla onun dəvətini rədd etdikdə, Allah ona getməyə icazə verməzdən əvvəl onları qəzəblə tərk etdi. Quranda bundan sonra baş verənlər belə təsvir edilir: “Balıq adamını da yadına sal ki, o, qəzəbli halda getdi və düşündü ki, Biz ona [heç bir çətinliklə] hökm etməyəcəyik” (Qur'an, 21:87). Gəmiyə minərək dənizə atıldı və böyük bir balıq tərəfindən uduldu, qaranlığın qatlarına - gecənin, dənizin və balığın qarnının qaranlığına qərq oldu.",
      "Yunus o böyük zülmətdə İslamın ən sevimli dualarından birinə çevrilən sözlərlə belə səsləndi: “Səndən başqa məbud yoxdur; Sən pak və müqəddəssən. Həqiqətən, mən zalımlardan olmuşam!” (Qur'an, 21:87). O, ümidsizliyə qapılmadı; Allahın kamilliyini təsdiq etdi və öz günahını etiraf etdi. Allah belə cavab verdi: “Biz də onun duasını qəbul etdik və onu sıxıntıdan xilas etdik. Biz möminləri belə xilas edirik” (Qur'an, 21:88). Balıq onu sahilə atdı və Allah onun zəifləmiş bədənini qorumaq üçün bir bitki yetişdirdi.",
      "Sonra əlamətdar sonluq gəldi: Yunus öz qövmünün yanına qayıtdı və Qurandakı demək olar ki, hər bir ümmətdən fərqli olaraq, onlar iman gətirdilər və xilas oldular – “Beləliklə, Biz də onları bir müddət istifadə etdik” (Qur'an 37:147-148; 10:98). Onun hekayəsi bir-birinə toxunmuş iki dərs verir: qaranlıq nə qədər dərin olursa olsun, Allahın rəhmətindən əsla ümidinizi kəsməyin, çünki səmimi tövbə itirilmiş şeyi bərpa edir; və Yunus duası sıxıntı içində olan hər bir mömin üçün bir həyat ipidir. Peyğəmbər (sallallahu aleyhi və səlləm) öyrətdi ki, heç bir müsəlman onunla dua etməz ki, Allah ona cavab versin.",
    ],
    profile: {
      nation: "Nineva xalqı",
      location: "Mesopotamiya bölgəsi",
      era: "İsadan əvvəlki peyğəmbərlik dövrü",
      mission: "Xalqını tövhidə və tövbəyə çağır.",
      challenges: [
        "Də'vətdə davamlı rəddin gərginliyi",
        "Dənizin qaranlığında şəxsi məhkəmə",
        "Düzəlişdən sonra missiyaya qayıtmaq",
      ],
      miracles: [
        "Balıqların içindən xilas edin",
        "Onun üstündə sığınacaq bitkisi yetişdirildi",
        "Bütün xalqının inancı",
      ],
      majorEvents: [
        "Xalqını və dəniz sınaqlarını buraxaraq",
        "Üç qat qaranlıqda dua",
        "Ninevanın qayıdışı və inamı",
      ],
      lessons: [
        "Allahın rəhmətindən əsla ümidinizi kəsməyin",
        "Səmimi tövbə missiyanı bərpa edir",
        "Çətinlikdə edilən dua dəyişdiricidir",
      ],
      facts: ["Quranda Zun-Nun (balıq adamı) da adlandırılır"],
    },
    quran: [
      {
        excerpt:
          "Zülmətlər içində nida etdi: “Səndən başqa məbud yoxdur. Sən pak və müqəddəssən. Həqiqətən, mən zalımlardan olmuşam.",
      },
      {
        excerpt:
          "Məgər Yunus qövmündən başqa elə bir məmləkət yoxdurmu ki, iman gətirdi və imanı ona fayda verdi? Onlar iman gətirdikləri zaman rüsvayçılıq əzabını onlardan uzaqlaşdırdıq.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Zun-Nunun balığın qarnından Allahı çağırdığı zaman duası: La ilahə illə əntə, subhənəkə, inni kuntu minaz-zəlimin. Heç bir müsəlman onunla heç bir şey üçün dua etməz ki, Allah ona cavab verməsin.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Zəkəriyyə (ə)",
    summary:
      "Qocalıqda saleh bir varis üçün dua edən və Yəhya ilə cavablandırılan sədaqətli peyğəmbər.",
    body: [
      "Zəkəriyyə (salavat və salam və rəhmət və bərəkət) - Zəkəriyya Bəni-İsrailin mömin peyğəmbəri və Məryəmin vəlisi idi. Nə zaman ki, onun namaz otağına daxil olarsa, onun yanında ruzi tapır və bunun necə gəldiyini soruşur və o: “Allah tərəfindəndir” deyə cavab verirdi. Həqiqətən, Allah istədiyinə hesabsız ruzi verər” (Qur'an, 3:37). Allahın Məryəmə bəxş etdiyi ruziyə şahid olmaq, Allahın insana qeyri-mümkün görünən bir şeyi verə biləcəyinə ümidini artırdı.",
      "Zəkəriyyə qocalmasına və arvadı qısır olmasına baxmayaraq, sakit və səmimi bir dua ilə Allaha üz tutdu: “Ey Rəbbim, həqiqətən, mənim sümüklərim zəiflədi, başım ağ oldu və mən Sənə dua etməkdən əsla bədbəxt olmadım” (Qur'an, 19:4). O, var-dövlət və ya dünyəvi mənfəət üçün deyil, peyğəmbərlik missiyasını yerinə yetirəcək və Allaha ibadəti qoruyacaq saleh bir varis istədi. Allah övladı ilə müjdə verdi, Yəhya - bu ad, Allah dedi ki, əvvəllər heç kimə verilməmişdi (Qur'an 19:7). Zəkəriyyə bir əlamət olaraq, dilini Allahı zikr etməyə həsr edərək, işarə ilə istisna olmaqla, üç gün insanlarla danışmaqdan çəkinməli idi (Qur'an 19:10-11).",
      "Zəkəriyyanın həyatı möminə duadan heç vaxt əl çəkməməyi, cavabı çətin görünsə də, Allahdan xüsusilə saleh ailə hədiyyəsi və imanın davamlılığını istəməyi öyrədir. Onun ən böyük qayğısı özü deyil, ondan sonra həqiqəti kimin daşıyacağı idi. Onun hekayəti həm də ibadət yerlərində sakit xidməti nəcib və sevimli bir əməl kimi şərəfləndirir.",
    ],
    profile: {
      nation: "Bəni İsrail",
      location: "Yerusəlim bölgəsi",
      era: "İsadan əvvəl",
      mission: "Onun xalqına rəhbərlik et və peyğəmbərlik ibadətini qoru.",
      challenges: [
        "Uşaqsız qocalığa çatmaq",
        "İnamın ardıcıllığı üçün narahatlıq",
        "Gərgin bir cəmiyyətdə ibadəti saxlamaq",
      ],
      miracles: ["Yəhyanın qocalıqda müjdəsi", "Üç gün danışmağın əlaməti"],
      majorEvents: [
        "Məryəmin himayəsi və onun ruzisinə şahidlik etmək",
        "Varis üçün ürəkdən dua",
        "Cavab duası və Yəhyanın doğulması",
      ],
      lessons: [
        "Duada ümidinizi heç vaxt itirməyin",
        "Allahdan saleh ailə və nəsil istə",
        "İbadətdə fədakar xidmət şərəflidir",
      ],
      facts: ["Məryəmin vəlisi", "Doğulması duasına cavab verən Yəhyanın atası"],
    },
    quran: [
      {
        excerpt:
          "Orada Zəkəriyya Rəbbinə yalvarıb dedi: “Ey Rəbbim, mənə Öz tərəfindən pak bir övlad bəxş et. Həqiqətən, Sən duaları eşidənsən.",
      },
      {
        excerpt:
          "O dedi: “Ey Rəbbim, həqiqətən mənim sümüklərim zəiflədi, başım ağ oldu və mən heç vaxt Sənə dua etməkdən bədbəxt olmadım, ey Rəbbim.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Yəhya (ə)",
    summary:
      "Gəncliyindən salehlik bəxş edilmiş və Allahın salamı ilə şərəfləndirilmiş pak, müdrik peyğəmbər.",
    body: [
      "Yəhya (salavat və salam və rəhmət və bərəkət) - Yəhya - atası Zəkəriyyanın doğulmazdan əvvəl Allah tərəfindən adlandırılan duasının cavabı idi. Allah birbaşa ona xitab etdi: “Ey Yəhya, qətiyyətlə Kitabı al”. O, 'ona hələ uşaq ikən hikmət verdi' (Qur'an 19:12) - onun erkən mənəvi yetkinliyini göstərən nadir təsvir. Gəncliyindən yaşını aşaraq Allaha ciddiyyətlə bağlı idi.",
      "Qur'an onun xasiyyətini gözəl ardıcıllıqla tərifləyir: Allah ona “Bizim tərəfimizdən bir şəfqət və paklıq bəxş etdi, o, Allahdan qorxan, ata-anasına yaxşılıq edən, zalım və asi deyildi” (Qur'an, 19:13-14). O, iffətli və mömin idi, salehlər arasında xatırlanırdı. O, öz qövmünü itaətə və haqqa dəvət etdi və İsadan qabaq getdi, Allahdan gələn kəlamı təsdiq etdi və qəlbləri hidayətə hazırladı (Qur'an, 3:39).",
      "Allah Yəhyanı həyatın üç ən həssas məqamında salamatlıqla izzətləndirdi: “Doğduğu gün, öldüyü gün və diri dirildiyi gün salam olsun!” (Qur'an, 19:15). Onun tərcümeyi-halı həm kiçik, həm də qocaya bir mesajdır: Allaha yaxınlıq sonrakı illərə təxirə salınmır. Qəlb təmizliyi, ibadətdə ciddilik, ata-anaya qarşı mehribanlıq insanda hələ gənc ikən çiçək aça bilər - və belə bir həyat Allaha sevimlidir.",
    ],
    profile: {
      nation: "Bəni İsrail",
      location: "Levant bölgəsi",
      era: "Zəkəriyyə ilə müasir və İsanın dövrünə yaxındır",
      mission: "Yaxşılığa çağır və qəlbləri hidayətə hazırla.",
      challenges: [
        "Mənəvi cəhətdən gərgin bir mühitdə ictimai islahatlar",
        "Təmizliyi və prinsipi qorumaq",
      ],
      majorEvents: [
        "Cavab edilən bir dua olaraq doğulması",
        "Gəncliyində hikmət verilmişdir",
        "Onun saflığına və sədaqətinə görə tanınma",
      ],
      lessons: [
        "Gənclər salehliyə rəhbərlik edə bilər",
        "Qəlbin saflığı əsl gücdür",
        "Valideynlərə yaxşılıq etmək təqvanın bir hissəsidir",
      ],
      facts: [
        "Doğulmazdan əvvəl Allah tərəfindən adlandırılmışdır",
        "Doğuşda, ölümdə və dirilişdə sülhlə şərəflənir",
      ],
    },
    quran: [
      {
        excerpt:
          "Ey Yəhya, Kitabı qətiyyətlə qəbul et. Biz ona hələ uşaq ikən hikmət, Özümüzdən bir şəfqət və paklıq verdik və o, Allahdan qorxurdu.",
      },
      {
        excerpt:
          "Allah səni Allah tərəfindən olan bir kəlamı təsdiq edən Yəhya ilə müjdə verir: şərəfli, çəkinən və əməlisalehlərdən bir peyğəmbər.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "İsa ibn Məryəm (ə)",
    summary:
      "Məryəmdən möcüzə nəticəsində dünyaya gələn, Allahı açıq-aşkar dəlillərlə çağıran qüdrətli bir elçi - ilahi deyil, bir qul.",
    body: [
      "İsa (əleyhissalam) – İsa – Allahın əmri ilə, Onun mütləq qüdrətinin nişanəsi olaraq, Məryəmdən atasız dünyaya gəlmişdir: “Həqiqətən, Allah yanında İsanın məsəli Adəmin misalı kimidir. Onu torpaqdan yaratdı, sonra ona dedi: “Ol, o oldu” (Qur'an, 3:59). Məryəm yeni doğulmuş uşağı qövmünün yanına gətirəndə, onu ittiham edən körpə İsa beşikdən onu müdafiə edərək dedi: “Həqiqətən, mən Allahın quluyam. O, mənə kitab verdi və məni peyğəmbər etdi” (Qur'an, 19:30). Bu ilk bəyanat onun bütün missiyasının tonunu təyin etdi - o, Allahın qulu idi.",
      "İsa özündən əvvəlki Tövratı təsdiq etmək və İncil (İncil) gətirmək üçün Bəni-İsrailə göndərildi. Allah Öz izni ilə onu açıq-aşkar möcüzələrlə dəstəklədi: o, korlara və cüzamlılara şəfa verdi, ölüləri diriltdi və Allahın izni ilə palçıqdan uçan bir quş yaratdı (Qur'an, 3:49). Onun mesajı insanları “Mənim Rəbbim və sizin də Rəbbiniz olan Allaha” (Qur'an, 3:51) ibadət etməyə, ixlas və salehliyə çağırırdı. Yaxın şagirdləri olan Həvariyyun ona iman gətirmiş və onu dəstəkləmişdir.",
      "Qur'an İsa ilə bağlı iki ifratı düzəldir. İnkar edənlərə və onu öldürmək üçün plan quranlara qarşı, onun nə öldürüldüyünü, nə də çarmıxa çəkildiyini bildirir; Əksinə, belə göründü və Allah onu Öz dərgahına qaldırdı (Qur'an 4:157-158). Mübaliğə edənlərə qarşı təkid edir ki, o, Allah və ya Allahın oğlu deyil, əzəmətli bir peyğəmbər və elçidir – “Məryəm oğlu Məsih ancaq bir elçi deyildi” (Qur'an, 5:75). Sünni inancında qiyamətdən əvvəl qayıdacaqdır. Onun hekayəsi Allahın qüdrətinin bütün təbii səbəblərdən üstün olduğunu, peyğəmbərlərin şərəfli qul olduqlarını və heç vaxt ilahi olmadığını, həqiqəti həm inkardan, həm də mübaliğədən qorumaq lazım olduğunu öyrədir.",
    ],
    profile: {
      nation: "Bəni İsrail",
      location: "The Levant",
      era: "1-ci əsr",
      mission: "Tövhidi təzələ, Tövratı təsdiq et və yaxşılığa çağır.",
      challenges: [
        "Onu rədd edənlərin müxalifəti və hiyləsi",
        "Onun statusunun sonradan şişirdilməsi",
        "Saf monoteizmi müdafiə etmək",
      ],
      miracles: ["Atasız doğulmaq", "Beşikdə danışan", "Allahın izni ilə şəfa və həyat vermək"],
      majorEvents: [
        "Onun möcüzəvi doğulması və anasının müdafiəsi",
        "Açıq əlamətlərlə ictimai çağırış",
        "Allah dərgahına yüksəldilir, öldürülmür",
      ],
      lessons: [
        "Allahın qüdrəti adi səbəblərdən üstündür",
        "Peyğəmbərlər Allahın hörmətli bəndələridir, heç vaxt ilahi deyillər",
        "Həqiqət həm inkardan, həm də mübaliğədən qorunmalıdır",
      ],
      facts: ["İncil (İncil) nəzərə alınmaqla", "Sünni inancında qiyamətdən əvvəl qayıdacaq"],
    },
    quran: [
      {
        excerpt:
          '[İsa dedi]: "Həqiqətən, Allah mənim də Rəbbimdir, sizin də Rəbbinizdir. Ona ibadət edin. Bu, düz yoldur.',
      },
      {
        excerpt:
          "Onu öldürmədilər və çarmıxa çəkmədilər. Lakin onlara belə göstərildi... Əksinə, Allah onu Öz hüzuruna qaldırdı.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mən Məryəm oğlu İsaya insanların ən yaxınıyam. Peyğəmbərlər müxtəlif anaların qardaşlarıdır, lakin onların dini birdir və aramızda peyğəmbər olmayıb.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Məhəmməd s",
    summary: "Bütün aləmlərə rəhmət olaraq göndərilmiş son elçi və peyğəmbərlik möhürüdür.",
    body: [
      "Muhəmməd peyğəmbərlərin sonuncusudur, bir qövmə deyil, bütün bəşəriyyətə göndərilmişdir, Qur'an son və qorunmuş vəhydir. Allah onun missiyasını bir ayədə belə bildirir: “Biz səni aləmlərə ancaq bir rəhmət olaraq göndərdik” (Qur'an, 21:107). Məkkədə doğulmuş, ilk vəhyi qırx yaşında Hira mağarasında almış və sonrakı iyirmi üç il ərzində insanları tək Allaha ibadət etməyə, qəlblərini təmizləməyə, ədalət və mərhəmətlə yaşamağa çağırmışdır - özündən əvvəlki hər bir peyğəmbərin risalətini tamamlayır və təsdiqləyir.",
      "Onun yolu davamlı fədakarlıq yolu idi. Məkkədə o və ilk möminlər istehzaya, işgəncələrə və illərlə boykota tab gətirdilər. Sonra hicrət, Mədinəyə hicrət gəldi və burada o, ilk müsəlman icmasını qurdu - namaz qıldı, mühacirlər və yardımçılar arasında qardaşlıq, müqavilələr və tövhid köklü bir cəmiyyət qurdu. Çətinliklər və son zəfər illərində onun xarakteri heç vaxt tərəddüd etmədi; Qur'an şəhadət edir ki, “Həqiqətən, sən böyük əxlaq sahibisən” (Qur'an 68:4) və o, özü də kamil əxlaq üçün göndərildiyini söyləyir.",
      "Allah onu “Allahın Rəsulu və peyğəmbərlərin möhürü” elan edir (Qur'an 33:40) – Ondan sonra peyğəmbər yoxdur. Onun ən böyük möcüzəsi Qur'anın özüdür, hələ də milyardlarla insana yol göstərən daimi əlamətdir və o, İsra və Merac, gecə səfəri və merac ilə şərəfləndirilmişdir. Mömin üçün o, üsvah-həsənədir - gözəl nümunədir (Qur'an 33:21) - Sünnəsi imanın əməli yoludur. Onu sevmək, hidayətinə tabe olmaq və ona salavat göndərmək müsəlman həyatının əsasını təşkil edir.",
    ],
    profile: {
      nation: "Bütün insanlıq",
      location: "Məkkə və Mədinə",
      era: "7-ci əsr",
      mission: "Son vəhyi çatdırın və bütün xalqlar üçün peyğəmbərlik xəbərini tamamlayın.",
      challenges: [
        "Məkkədə zülm və boykot",
        "Münaqişə və ədalətli cəmiyyət qurmaq",
        "Qəbilələr və millətlər arasında universal mesajı çatdırmaq",
      ],
      miracles: [
        "Qalıcı bir möcüzə olaraq Qur'an",
        "İsra və Merac (gecə səfəri və merac)",
        "Allahın izni ilə verilən bir çox əlamətlər",
      ],
      majorEvents: [
        "Məkkədə vəhyin başlanğıcı",
        "Mədinəyə hicrət",
        "Mesajın və Vida Xütbəsinin tamamlanması",
      ],
      lessons: [
        "Rəhbərlikdə mərhəmət və nəcib xarakter",
        "Təzyiq altında sabitlik",
        "Vəhy və sünnəyə birlikdə əməl edin",
      ],
      facts: ["Peyğəmbərlərin möhürü", "Möminlər üçün ən gözəl nümunə (usvah-həsənə)."],
    },
    quran: [
      {
        excerpt:
          "Muhəmməd sizin kişilərinizdən heç birinin atası deyil, lakin o, Allahın Rəsulu və peyğəmbərlərin möhürüdür.",
      },
      {
        excerpt: "Biz səni ancaq aləmlərə rəhmət olaraq göndərdik.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mənim və məndən əvvəlki peyğəmbərlərin nümunəsi, bir kərpic yeri istisna olmaqla, gözəl və tam bir ev tikmiş bir insanın nümunəsidir. Mən o kərpicəm, peyğəmbərlərin möhürüyəm.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
];

export const PROPHETS_TIMELINE_AZ: DeepPartial<ProphetsTimelineEvent>[] = [
  {
    era: "Başlanğıc",
    title: "Adəm - ilk peyğəmbər",
    body: "Allah Adəmi yaratdı, ona adlar öyrətdi və onu yer üzündə canişin etdi.",
  },
  {
    era: "Qədimlik",
    title: "İdris, Nuh və ilk ümmətlər",
    body: "İlk peyğəmbərlər öz qövmlərini yenidən tövhidə dəvət etmişlər. Nuh əsrlər boyu təbliğ etdi; inkar davam etdikdə tufan gəldi və gəmi möminləri bir əlamət olaraq xilas etdi.",
  },
  {
    era: "Mesopotamiya / Levant",
    title: "İbrahim və ailəsi",
    body: "Allahın dostu Xəlilullah: bütləri sındırdı, oddan xilas oldu, İsmayılla birlikdə Kəbə tikdi, İsmayıl və İshaqdan nəsli peyğəmbərlər yetişdirdi.",
  },
  {
    era: "Misir və Sinay",
    title: "Musa və Bəni-İsrail",
    body: "Firondan qurtuluş, Tövratın nazil olması, Bəni-İsrailə qədər uzun peyğəmbərlər cərgəsi.",
  },
  {
    era: "Misir",
    title: "Yusif Misirdə",
    body: "Xəyanət, həbs və hakimiyyətə yüksəlmə yolu ilə səbir - etibar modeli.",
  },
  {
    era: "Yerusəlim",
    title: "Davud və Süleyman",
    body: "Padşahlıq, hikmət, Zəbur və səltənət Quranda vəsf olunur.",
  },
  {
    era: "1-ci əsr",
    title: "İsa ibn Məryəm",
    body: "Möcüzəvi şəkildə doğulmuş, beşikdə danışmış, Allah üçün qaldırılmış - Qurana görə çarmıxda öldürülməmişdir.",
  },
  {
    era: "7-ci əsr",
    title: "Muhəmməd - peyğəmbərlərin möhürü",
    body: "Bütün bəşəriyyətə son elçi; Qur'an qiyamətə qədər qorunub saxlanılmışdır.",
  },
];
