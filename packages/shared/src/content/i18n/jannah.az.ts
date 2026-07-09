// Azerbaijani translation overlay for the Learn "Journey to Jannah" content. Mirrors the order of
// its English source in ../jannah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  JannahDuaEntry,
  JannahGate,
  JannahPromisedEntry,
  JannahTopic,
  JannahVerseEntry,
} from "../../types/jannah";
import type { DeepPartial } from "./localize";

export const JANNAH_TOPICS_AZ: DeepPartial<JannahTopic>[] = [
  {
    title: "Cənnət nədir?",
    summary: "Allahın müttəqilər üçün hazırladığı Əbədi Cənnət.",
    body: [
      "Cənnət (Cənnət) Allahın Ona iman gətirib saleh əməllər edənlər üçün hazırladığı əbədi mükafat evidir. Sözün hərfi mənasında yamyaşıl, kölgəli bir bağ deməkdir, lakin Qur'an onu yer üzündəki hər hansı bağdan daha böyük bir həqiqət üçün istifadə edir: çaylar, meyvələr, malikanələr və möminin Rəbbinin razılığı ilə əbədi olaraq yaşadığı yoldaşlıq diyarı. Bu, hər bir peyğəmbərin insanları doğru çağırdığı məqsəd və bütün bu səfərin haqqında olduğu hədəfdir.",
      "Cənnət həyatı bu dünyada heç bir şeyə bənzəmir, çünki o, dünya səadətini pozan hər bir qüsurdan azaddır. Ölüm, xəstəlik, qocalma, qorxu, kədər və yorğunluq yoxdur. Onun insanları heç vaxt mübahisə etmir, yorulmur və sevdiklərini heç vaxt itirmirlər. Ürək nə istəsə, qəbul olunar və Allah Öz səxavətindən daha da artırar: “Onlar üçün orada istədikləri hər şey vardır və daha çoxu Bizim dərgahımızdadır” (Qur'an, 50:35).",
      "Cənnətin ləzzətləri insanın təsəvvüründən kənardır. Bir hədis qüdsidə Allah, saleh bəndələri üçün heç bir gözün görmədiyi, heç bir qulağın eşitmədiyi, heç bir qəlbin ağlına belə gətirmədiyi şeyləri hazırladığını bildirir. Məhz buna görə də Qur'an Cənnəti tanış surətlərlə - bağlar, çaylar və kölgələrlə təsvir edir, eyni zamanda həqiqətin hər cür təsvirdən daha böyük olduğunu xatırladır. Ən böyük mükafat cənnətlərin özü deyil, Allahın rizası və ən yüksək dərəcələrə görə Onun əzəmətli Üzünü seyr etmək şərəfidir.",
      "Mömin iki həqiqəti bir arada tutmalıdır. Birincisi, Cənnət həqiqidir, yaxındır və hər cür səyə dəyərdir – Qur'an bizə ona doğru “yarışmağı” deyir (Qur'an 3:133). İkincisi, heç kim Cənnəti təkcə əməli ilə qazanmaz; daxil olmaq, nəticədə Allahın rəhməti ilə, səmimi iman və saleh əməlləri qəbul etmək üçün seçdiyi vəsilədir. Bu tarazlıq təkəbbür yaratmadan ümidi canlı saxlayır: biz əlimizdən gələni edirik, sonra özümüzü Onun mərhəmətinə atırıq.",
      "Praktiki olaraq Cənnət reallığı gündəlik seçimlərinizi formalaşdırsın. İbadət ağırlaşdıqda və ya sınaq güclü hiss etdikdə, nəyin gözlədiyini və nəyin təhlükə altında olduğunu xatırlayın. Allahdan tez-tez Cənnəti dilə, onun üçün ardıcıl olaraq kiçik davamlı yollarla çalış və bu keçici həyatda ona həsrət qəlbini yumşalt.",
    ],
    quran: [
      {
        excerpt:
          "Rəbbiniz tərəfindən bağışlanmağa və genişliyi göylərlə yer qədər olan, müttəqilər üçün hazırlanmış Cənnətə doğru yarışın.",
      },
      {
        excerpt:
          "Allah mömin kişilərə və mömin qadınlara (ağacları) altından çaylar axan, içində əbədi qalacaqları cənnətlər və Ədn cənnətlərində gözəl məskənlər vəd etmişdir. Lakin Allahın razılığı daha böyükdür.",
      },
      {
        excerpt:
          "Etdikləri əməllərin mükafatı olaraq onlar üçün nəyin gizləndiyini heç kəs bilmir.",
      },
      {
        excerpt: "Orada onlar üçün istədikləri hər şey vardır.",
      },
      {
        excerpt: "İman gətirib saleh əməllər edənləri qonaqlıq üçün sığınacaq cənnətləri gözləyir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah buyurdu: “Mən saleh bəndələrim üçün heç bir gözün görmədiyi, heç bir qulağın eşitmədiyi və heç bir qəlbin düşünmədiyi bir şey hazırladım.",
      },
      {
        excerpt:
          "Uca Allah buyurur: Mən saleh qullarım üçün heç bir gözün görmədiyi, heç bir qulağın eşitmədiyi və heç bir insan qəlbinin dərk etmədiyi bir şey hazırlamışam.",
      },
    ],
  },
  {
    title: "Cənnətdə dərəcələr",
    summary: "Cənnətin bir çox dərəcələri var - yeddi nərdivan deyil.",
    body: [
      "Cənnət tək bir düz yer deyil; onun dərəcə adlanan bir çox dərəcələri vardır və möminlər imanlarına və əməllərinə görə onun daxilində yüksəldilirlər. Çox yayılmış yanlış fikir budur ki, Cənnət tam yeddi mərtəbədən ibarətdir. Bu, iki fərqli şeyi qarışdırır: Qur'an yeddi səmadan (səmavatdan) – yuxarımızda yaradılmış səmadan – yeddi sabit Cənnət mərtəbəsindən deyil, bəhs edir. Mətnlər heç vaxt Cənnəti yeddi dərəcə ilə məhdudlaşdırmır.",
      "Həqiqi mənbələrin bizə dediyi budur ki, rütbələr çox və genişdir. Peyğəmbər (salləllahu aleyhi və səlləm) buyurmuşdur ki, Cənnətdə Allah yolunda cihad edənlər üçün yüz mərtəbə hazırlanmışdır və bir mərtəbə ilə digər mərtəbə arasındakı məsafə göylə yer arasındakı məsafə qədərdir. Hətta bu rəqəm qutuları işarələyərək qalxa biləcəyimiz sərt nərdivandan daha çox nəhəngliyə işarə edir.",
      "Allah hər bir mömini imanının gücünə, niyyətinin səmimiliyinə və əməllərinin ağırlığına görə yüksəldir - “Hər kəsin etdiklərinə görə dərəcələr vardır” (Qur'an, 6:132). Hər bir insanın çatacağı məqam yalnız Allaha məlumdur. Vəhy qəsdən bizə “N səviyyəsinə çatmaq üçün X əməl edin” mexaniki yoxlama siyahısını vermir, çünki ibadət dərəcə saymaqla deyil, sevgi və səmimiyyətlə idarə olunmalıdır.",
      "Bunun hikməti gözəldir. Dəqiq yerimizi bilsəydik, bəziləri özündən razı olardı, bəziləri isə ümidsiz olardı. Əksinə, bizə Allaha nəzər salmaq, səy göstərmək və ümid etmək öyrədilir. Mömin yaxşılıqla yarışır - 'bunun üçün rəqiblər yarışsın' - yekun qiymətləndirməni Ən Ədalətliyə buraxır.",
      "Odur ki, nömrəli bir səviyyəni hədəfləməkdənsə, ən yüksək hədəfi hədəfləyin və Allah sizi istədiyi yerə yerləşdirsin. Peyğəmbər (s) səhabələrə təvazökarlıqla kifayətlənməməyi, Cənnətin zirvəsi olan Firdevs üçün xüsusi olaraq istəməyi öyrətdi.",
    ],
    quran: [
      {
        excerpt: "Hər kəsin etdiklərinə görə dərəcələri vardır.",
      },
      {
        excerpt:
          "Bax, Biz onların bəzisini digərindən necə üstün etdik. Axirət isə dərəcə baxımından daha böyük və fərq baxımından daha böyükdür.",
      },
      {
        excerpt:
          "Kim Allaha və Rəsuluna itaət edərsə, onlar Allahın nemət verdiyi kəslərlə: peyğəmbərlərlə, doğru danışanlarla, şəhidlərlə və əməlisalehlərlə birlikdə olarlar. Onlar necə də gözəl yoldaşlardır!",
      },
    ],
    hadith: [
      {
        excerpt:
          "Cənnətdə Allahın Onun yolunda vuruşanlar üçün hazırladığı yüz dərəcə vardır. Hər iki mərtəbə arasındakı məsafə göylə yer arasındakı məsafə kimidir. Odur ki, Allahdan dilədiyiniz zaman Firdevs üçün Ondan istəyin, çünki o, Cənnətin ən yaxşı və ən uca yeridir.",
      },
      {
        excerpt:
          "Allahdan dilədiyiniz zaman Firdevs üçün Ondan istəyin, çünki o, Cənnətin ən uca yeri və Cənnətin ortasıdır və oradan Cənnət çayları axar, onun üstündə isə Rəhmanın ərşi vardır.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Əl-Firdövs - ən yüksək",
    summary: "Cənnətin zirvəsi, Ərşə ən yaxın.",
    body: [
      "Əl-Firdovs, səhih sünnədə adı çəkilən Cənnətin ən yüksək və ən mükəmməl mərtəbəsidir. Peyğəmbər (salləllahu aleyhi və səlləm) onu behiştin ən xeyirlisi və onun ortası, tam qəlbi kimi vəsf etmişdir ki, oradan Cənnət çayları çıxır və onun üstündə də Rəhmanın ərşi yerləşir. Firdövsə çatmaq hər bir məxluq qədər Allaha yaxın olmaqdır.",
      "Bu mövzunu bu qədər praktik edən bir peyğəmbərlik göstərişidir: Cənnət üçün dua edərkən, hədəfimizi aşağı tutmamalıyıq. Peyğəmbər (sallallahu aleyhi və səlləm) səhabələrə öyrətdi ki, Allahdan behişt dilədikləri zaman daha kiçik bir şeylə kifayətlənməkdənsə, xüsusi olaraq Firdevs üçün diləsinlər. Allahın səxavəti hədsizdir, ona görə də Ondan yalnız minimumunu istəmək bir növ əskiklikdir. Bu, bizə ibadətdə şöhrətpərəstliyi öyrədir: zirvəni hədəfə al və qoy Allah Öz mərhəməti ilə səni hara yerləşdirəcəyinə qərar versin.",
      "Necə olur ki, qulluqçu belə bir rütbəyə namizəd olur? Cənnətin özünə aparan, mükəmməlliklə təqib edilən vəsilələrdir: ixlasla bağlı sağlam iman (tövhid), Allahın buyurduğu vacibatları diqqətlə yerinə yetirmək, sonra da onların üzərinə artan könüllü ibadət həyatı - gecə namazı, əlavə oruc, zikr, sədəqə və gözəl əxlaq. Məşhur bir qüdsi hədisdə Allah, qulun Allah onu sevənə qədər ixtiyari əməllərlə ona necə yaxınlaşdığını bildirir.",
      "Ancaq son və həlledici hədiyyə həmişə Allahın rəhmətidir. Ucalığı hədəflədiyimiz nəfəsdə Peyğəmbərin (s) öz kəlamını xatırlayırıq: Heç kim Cənnətə tək öz əməli ilə daxil olmaz, hətta Peyğəmbərin özü belə, Allah onu Öz rəhmətinə bürüməsin. Bu, möminin vurduğu mükəmməl tarazlıqdır: bir tərəfdə yüksələn ümid və ehtiras, digər tərəfdən səmimi təvazökarlıq.",
      "Buna görə də Firdevs namazını səcdədə, gecənin son üçdə birində və yatmazdan əvvəl dualarınızın bir hissəsinə çevirin ki, hər gün səssizcə əlinizdən gələni edin və qalan vaxtlarda Rəbbinizin rəhmətinə arxayın olun.",
    ],
    hadith: [
      {
        excerpt:
          "Allahdan dilədiyiniz zaman Firdevs üçün Ondan istəyin, çünki o, Cənnətin ən uca yeri və Cənnətin ortasıdır və oradan Cənnət çayları axar, onun üstündə isə Rəhmanın ərşi vardır.",
      },
      {
        excerpt:
          "Sizlərdən heç biriniz tək öz əməli ilə Cənnətə daxil olmaz. Dedilər: Sən də deyilsən, ya Rəsulallah? O dedi: “Allah məni Öz tərəfindən rəhmətlə əhatə etmədikcə, mən də deyiləm.",
      },
    ],
    actions: [
      "Duanızda, xüsusən də səcdədə və yatmazdan əvvəl Allahdan Firdevs istəyin.",
      "Özünə vacib olanı kamilləşdir, sonra nafilə ibadəti artır.",
      "Tez-tez tövbəni təzələ və yalnız əməllərinə deyil, Allahın rəhmətinə təvəkkül et.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Axırəti təhlükə altına alan şey",
    summary: "Böyük günahlar səmimi tövbə tələb edir; Allahın bağışlaması genişdir.",
    body: [
      "Bu bölmə sizi ümidsizliyə düçar etmək üçün nəzərdə tutulmayıb - tam əksinə. Allah Özünə ixlasla üz tutanın bütün günahlarını bağışlayar və bunu ən sərt şəkildə bəyan edir: “De: “Ey Mənim özlərinə zülm edən bəndələrim, Allahın rəhmətindən ümidinizi kəsməyin. Həqiqətən, Allah bütün günahları bağışlayar” (Qur'an, 39:53). Burada məqsəd sadəcə olaraq mətnlərin nəyə qarşı xəbərdarlıq etdiyini bilməkdir ki, biz təhlükəni dərk edək və çox gec olmadan Ona tərəf tələsək.",
      "Bütün günahlardan ayrı bir günah var: şirk – ibadətdə Allaha şərik qoşmaq. Bu, Allah Qur'an 4:48-də açıq şəkildə bildirdiyi kimi, tövbə etmədən ölərsə, Allahın onu bağışlamayacağı yeganə günahdır. Qalan hər şey “O, bundan daha azını istədiyi kimsə üçün bağışlayar” altındadır. Məhz buna görə də düzgün tövhid hər qəbul edilən əməlin altında təməldir: çatlamış bünövrə üzərində tikilmiş ev dayanmaz.",
      "Şirkdən sonra mətnlərdə namazı tərk etməyə xüsusi əhəmiyyət verilir. Beş vaxt namazı israrla və üzrsüz olaraq tərk etmək sünnətdə ən ağır xəbərdarlıqlardandır - Peyğəmbər (s) namazı mömini fərqləndirən əhd adlandırmışdır ki, onu tərk etmək küfrə yaxınlaşır. Digər böyük günahlar - haqsız yerə adam öldürmək, haram əlaqə, faiz (riba) yemək, yetimin malını yemək və şiddətli zülm - səmimi tövbə tələb edən və Allah bağışlamazsa əzab verə bilən ciddi işlərdəndir.",
      "“Kiçik” adlanan günahlar da əhəmiyyətlidir və heç vaxt yüngül qəbul edilməməlidir. Qeybət, yalan, təkəbbür, qohumluq əlaqələrini kəsmək, qəflət yavaş-yavaş qəlbi və xasiyyəti korlayır. Peyğəmbər (sallallahu aleyhi və səlləm) xəbərdar etdi ki, yığılan xırda çubuqlar bütöv bir yemək bişirdiyi kimi, yığılan kiçik günahlar da insanı məhv edə bilər. Onların hər birinin Allaha öz dönüşü lazımdır.",
      "Çıxarılan şey fəaliyyətdə ümiddir: heç vaxt icazə verməyin ki, günahın ölçüsü sizi tövbənin mənasız olduğuna inandırsın. Sıxdığın an Allaha tərəf dön, pis bir işin ardınca onu silmək üçün yaxşılıq et və hər gün istiğfar qapısını açıq saxla. Onun mərhəməti həmişə sənin səhvindən böyükdür.",
    ],
    quran: [
      {
        excerpt:
          "Həqiqətən, Allah Özünə şərik qoşmağı bağışlamaz, lakin ondan daha az günahı istədiyi kimsə üçün bağışlayar.",
      },
      {
        excerpt:
          "De: “Ey Mənim özlərinə zülm edən qullarım, Allahın rəhmətindən ümidinizi kəsməyin. Həqiqətən, Allah bütün günahları bağışlayar.",
      },
    ],
    hadith: [
      {
        excerpt: "Bizimlə onların arasında olan əhd namazdır. kim onu ​​tərk edərsə, kafir olmuşdur.",
      },
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Fiqhdə böyük günahların siyahıları alimdən asılı olaraq dəyişir və fərdlər haqqındakı hökmlər ixtisaslı şəxslərə aiddir. Bu, tövbə etmək üçün ümumi bir xatırlatmadır - şəxsi hökm deyil. Vəziyyətiniz üçün etibarlı bir alimlə məsləhətləşin.",
  },
  {
    title: "Mətnlərdə təqdir edilənlər",
    summary: "Peyğəmbərin cənnətlə bağlı adlarını çəkdiyi şəxslər və qruplar.",
    body: [
      "Qur'an və Sünnə bəzi fərdləri, möminlərin kateqoriyalarını və Cənnətlə müjdələnən əməlləri ayırd edir. Bunları düzgün oxumaq vacibdir: onlar həmin konkret şəxslər və ya təsvirlər haqqında dürüst hesabatlardır – onlar sadəcə adlarını eşidən və ya onlara heyran olan hər kəs üçün ötürülə bilən zəmanət deyil. Müjdə onların iman və əməllərinə əsaslanırdı və eyni qapı eyni vasitələrlə bizim üzümüzə açıqdır.",
      "Ən məşhur qrup, Peyğəmbərin ﷺ bir rəvayətdə bir araya gətirdiyi vəd edilmiş On Cənnətdir (Əşəratul-Mübəşşərə): Əbu Bəkr, Ömər, Osman, Əli, Təlhə, Zübeyr, Əbdürrəhman ibn Ovf, Səd ibn Əbi Vəqqas, Səid ibn Əbi Vəqqas, Səid ibn Umeybər, hamısından razıyam). Bunlar Peyğəmbərin (sallallahu aleyhi və səlləm) səhabələrinin ən yaxını və ən fədakarları idi və Əhli-sünnə heç birini həddi aşmadan və aşağılamadan onların hamısını sevir və hörmət edir.",
      "Mətnlərdə adları çəkilən şəxslərdən başqa, müjdəli kateqoriyalar da təsvir edilir: doğru danışanlar və səbir edənlər, İslam şəriətinə görə Allah yolunda həqiqi şəhidlər və dünya həyatında son sözləri iman şəhadəti olan la ilahə illəllah. Hər təsvir yalnız zahiri bir işarə deyil, daxili bir həqiqətə - səmimiyyətə, fədakarlığa və ya son nəfəsdə Allaha bağlanan bir qəlbə işarə edir.",
      "Bizim üçün dərs, birləşməklə təhlükəsiz hiss etmək və ya özümüz üçün bu dərəcələrə sahib olmaq deyil, ilham almaqdır. Qoy onların nümunəsi bizi yuxarıya çəksin: onların sevdiklərini sevin, onlar çalışdıqca cihad edin və bu heyranlığı duaya və əmələ çevirin, Allahdan hər şeydən əvvəl hüsnü-xətimə diləyin – yaxşı sonluq.",
    ],
    hadith: [
      {
        excerpt:
          "Əbu Bəkr cənnətdə, Ömər cənnətdə, Osman cənnətdə, Əli cənnətdə, Təlhə cənnətdə, Zübeyr cənnətdə, Əbdürrəhman ibn Ovf cənnətdə, Səd cənnətdə, Səid ibn Zeyd cənnətdə və Əbu əl-Ubeydədir.",
      },
      {
        excerpt: 'Kimin son sözü "Allahdan başqa ilah yoxdur" olarsa, Cənnətə daxil olar.',
      },
    ],
    disclaimer:
      "Hədislərdəki müjdələr adları çəkilənlərə və ya təsvir edilən kateqoriyalara aiddir. Onlar insanın öz imanı, əməli və yaxşı sonluq ehtiyacını əvəz etmir. Allah daha yaxşı bilir.",
  },
  {
    title: "Tövhid - düzgün etiqad",
    summary: "Səmimi tövhid olmadan heç bir əməl qəbul olunmaz.",
    body: [
      "Tövhid ibadət üçün yalnız Allahı tərifləmək deməkdir - yalnız Onun Rəbb və Yaradan olduğuna, yalnız Ona ibadət olunmağa layiq olduğuna, Onun ad və sifətlərində bənzərsiz olduğuna inanmaqdır. Bu, hər bir peyğəmbərin göndərdiyi mesajdır və insanın İslama ilk daxil olduğu şeydir. İbadət etdiyimiz Allaha aid olduğu üçün bütün din binasının üzərində dayandığı bünövrədir.",
      "Onun əhəmiyyətini qeyd etmək mümkün deyil: Allah Ona şərik qoşan adamdan heç bir əməli qəbul etməz. “Əgər Allaha şərik qoşsanız, əməlləriniz puç olar” (Qur'an, 39:65). Şirk üzərində qurulmuş xeyirli işlərin dağı Qiyamət günü heç bir çəkiyə malik deyil, xalis tövhid üzərində qurulmuş ən kiçik əməl isə hədsiz dərəcədə ağır ola bilər. Buna görə də imanı qorumaq, əməlləri çoxaltmaqdan daha vacibdir.",
      'Tövhid həm də ixlas adlanan ixlas tələb edir - biz Allaha ibadət etməyimizi "dini Ona ixlasla" (Qur\'an 98:5). Buradakı incə təhlükə riyadır, insanlar tərəfindən görülmək və təriflənmək üçün ibadət etməkdir. Peyğəmbər (sallallahu aleyhi və səlləm) xəbərdarlıq etmişdir ki, hətta gizli nümayiş də sakitcə bir işi korlaya bilər. Çıxış yolu niyyəti yeniləməkdir: mən bunu həqiqətən kimin üçün edirəm? Səmimiyyət adi bir hərəkəti dəyərli bir sədaqətə çevirən şeydir.',
      "Tövhidi təməl etmənin hikməti odur ki, qəlbi azad edir. Yalnız Allaha ibadət edən insan yaradılış qorxusundan, hər kəsin razılığını qovmaqdan, bir çox ağalara qulluq etmək yorğunluğundan xilas olur. Onun həyatı vahid, aydın bir istiqamət qazanır: onu yaradanı razı salmaq.",
      "əməli olaraq etibarlı alimlərdən düzgün əqidə öyrənin, ibadətinizi şirk və nifaqdan təmizləyin və əməl etməzdən əvvəl niyyətinizi yoxlayın. Bu ilk addım isteğe bağlı və ya təkmil deyil - Cənnətə gedən hər yolun başladığı yerdir.",
    ],
    quran: [
      {
        excerpt:
          "Sənə və səndən əvvəlkilərə belə vəhy olundu: Əgər Allaha şərik qoşsan, əməlin puça çıxacaq və şübhəsiz ki, ziyana uğrayanlardan olacaqsan.",
      },
      {
        excerpt: "Onlara ancaq Allaha ixlasla ibadət etmək əmr edilmişdi.",
      },
    ],
    hadith: [
      {
        excerpt: "Əməllər ancaq niyyətlərə görədir və hər kəsin ancaq niyyət etdiyi şey olar.",
      },
    ],
    actions: [
      "Tövhidin əsaslarını etibarlı alimlərdən öyrənin.",
      "İbadətlərdən əvvəl niyyətinizi təzələyin.",
      "Gizli nümayiş üçün bağışlanma dilə (riya).",
    ],
  },
  {
    title: "Namaz - sütun",
    summary: "Beş vaxt namazı qorumaq ən böyük əməllərdəndir.",
    body: [
      "Namaz - beş vaxt namaz - İslamın ikinci sütunu və gündəlik ibadətlərin mərkəzi əməlidir. Həzrət Peyğəmbər (s) namazı dinin dirəyi kimi vəsf etmişdir: “Hər kim onu ​​bərqərar edərsə, dini bərqərar edər, ona etinasızlıq edərsə, onu saxlayan şeylərin çoxunu yıxmış olar. Bu, möminin Allahla birbaşa əlaqədə olan beş gündə Rəbbi ilə görüşməsi, ayaq üstə durması, rüku və səcdə etməsidir.",
      "Peyğəmbərin (sallallahu aleyhi və səlləm) qiyamət günü haqqında dediyi sözə görə əməli əməllər arasında onun dərəcəsi misilsizdir: “Bəndənin hesaba çəkiləcəyi ilk iş namazdır. Əgər sağlam olarsa, qalan əməllər də sağlam olar; əskik olarsa, qalanları təhlükə altındadır. Bu həyatda da namaz paklanma vasitəsidir - Peyğəmbər beş vaxt namazı qapının ağzından axan çaya bənzətmişdir: Hər kim gündə beş dəfə onunla qüsl etsə, heç bir kir qalmaz və beləliklə, namaz kiçik günahları yuyar.",
      "Ancaq dua fiziki hərəkətlərdən daha çox olmalıdır. Qur'an 'namazda təvazökar olanları' tərifləyir (Qur'an 23:1-2) və 'namazda sabit olanları' (Qur'an 70:22-23) tərifləyir. Ən çox iki xüsusiyyət önəmlidir: huşu – Allahın hüzurunda dayandığını bilən indiki, təvazökar bir ürək – və hər namazı öz vaxtında qoruyan ardıcıllıq. İmkanı olanlar üçün camaatla namaz qılmaq savabı qat-qat artırır.",
      "Namazın daha dərin hikməti çevrilmədir. Düzgün qılınan namaz insanı ədəbsizlikdən və pis işlərdən çəkindirər; sıx bir gün ərzində ürəyi Allaha qaytaran təkrarlanan sıfırlamadır. Ona görə də üzrsüz qılınan namazı qəza etmək, ixlasla tövbə etməyi və qəza etməyi tələb edən böyük bir məsələdir. Nəfl və rəvatib - fərzlərdən əvvəl və sonra qılınan sünnə namazları daha da nur əlavə edir və məqamı yüksəldir.",
      "Praktik olaraq: beş vaxt namazı öz vaxtlarında mütləq prioritet olaraq qoruyun, buraxdığınız hər hansı bir namazı qəza edin və davam edə biləcəyiniz sünnə namazlarını əlavə edin. Əgər namazınız yaxşılaşarsa, ibadətinizdəki hər şey onunla yaxşılaşar.",
    ],
    quran: [
      {
        excerpt: "Həqiqətən, möminlər nicat tapdılar – o kəslər ki, namazda təvazökarlıq edirlər.",
      },
      {
        excerpt: "Namaz qılanlar istisna olmaqla, namazda sabit olanlar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qiyamət günü qulun hesaba çəkiləcəyi ilk şey onun namazıdır. Sağlamdırsa, uğur qazanmışdır; əgər nöqsanlı olarsa, uğursuz və uduzmuşdur.",
      },
      {
        excerpt:
          "Əgər sizlərdən birinin qapısının ağzında gündə beş dəfə qüsl etdiyi çay olsa, onun üzərində kir qalarmı? Onlar dedilər: Xeyr. O dedi: “Beş vaxt namazın məsəli budur ki, Allah onlarla günahları yox edər.",
      },
    ],
    actions: [
      "Beş vaxt namazı öz vaxtlarında qoruyun.",
      "Qəza namazlarını (qəzəni) ixlasla qıl.",
      "İmkanınız olan yerdə fərzdən əvvəl və sonra sünnət namazlarını əlavə edin.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Səmimi tövbə",
    summary: "Allah daima Ona tərəf dönənləri sevir.",
    body: [
      "Tövbə günahdan sonra Allaha tərəf dönməkdir. Səmimi tövbənin (tövbə-nasuh) aydın dirəkləri vardır: edilənə görə qəlbdə səmimi peşmançılıq hissi, günahı dərhal dayandırmaq və bir daha ona qayıtmamaq üçün qəti qərar - əgər günah başqasına zülm etmək, onun haqqını bərpa etmək və ya ondan bağışlanmaq istəməkdirsə. Bu, tək bir hadisə deyil, ömürlük bir dönüşdür, Allahın hər bir mömin üçün açıq saxladığı bir qapıdır.",
      "Onun əhəmiyyəti ondadır ki, heç bir insan günahdan azad deyil, ona görə də tövbə azsaylı günahkarlar üçün deyil, hamı üçündür. Peyğəmbər (sallallahu aleyhi və səlləm) buyurmuşdur ki, hər bir Adəm övladı günah edər və günah edənlərin ən yaxşısı tövbə edənlərdir. Allah qulunun tövbəsini ölüm anında ruhu boğaza çatana qədər qəbul edir, hətta qərbdən doğan günəş belə dünya üçün son tarixdir - o vaxta qədər dəvət dayanır.",
      "Təəccüblüdür ki, Allah qayıdan quluna sadəcə dözmür, sevinir. Həzrət Peyğəmbər (s) qulunun tövbəsinə Allahı daha çox sevindirdiyini vəsf etmişdir ki, qulunun tövbəsi onu səhrada azmış, dəvəsi bütün yeməyi və suyu ilə sərgərdan yerə getdikdən sonra həyatdan ümidini kəsən, sonra qəflətən onu tapan adamdan daha çox sevinir. Bu hədsiz sevinc obrazı bizə tövbə edən bəndənin Rəbbi yanında nə qədər sevimli olduğunu bildirir.",
      "Müdriklik dərindir: günah insanın hekayəsinin sonu olmamalıdır. “Allah onların pis əməllərini yaxşılıqla əvəz edər” (Qur'an, 25:70) — səmimi tövbə, uğursuzluq rekordunu müvəffəqiyyətə çevirə bilər və yıxılmağı insanı Allaha əvvəlkindən daha da yaxınlaşdıran yeni başlanğıca çevirə bilər. Günahdan sonra ümidsizlik şeytanın tələsidir. Allahın rəhmətinə ümid etmək möminin cavabıdır.",
      "Praktik olaraq: tövbəni bir gün də təxirə salmayın - sürüşdüyünüz anı qaytarın. Hər bir pis əməlin ardınca onu silmək üçün yaxşılıq et və Peyğəmbərin (sallallahu aleyhi və səlləm) bağışlanmasına baxmayaraq hər gün dəfələrlə bağışlanma dilədiyi kimi, gün ərzində dilin istiğfarla axsın.",
    ],
    quran: [
      {
        excerpt:
          "Ey iman gətirənlər, Allaha səmimi-qəlbdən tövbə edin ki, bəlkə Rəbbiniz sizdən günahlarınızı aradan qaldırar və sizi (ağacları) altından çaylar axan cənnətlərə daxil edər.",
      },
      {
        excerpt:
          "Tövbə edib iman gətirib yaxşı işlər görənlərdən başqa, Allah onların pisliklərini yaxşılıqla əvəz edər və Allah Bağışlayandır, Rəhmlidir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah Öz bəndəsinin tövbəsini sizlərdən bir kəsdən daha çox sevindirir ki, dəvəsini çöldə itirib, qəflətən onu yenidən tapar.",
      },
    ],
    actions: [
      "Günah etdiyiniz zaman dərhal tövbə edin - təxirə salmayın.",
      "Günahı silmək üçün yaxşı bir əməllə ardınca get.",
      "Gün boyu istiğfar deyin.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qur'an",
    summary: "Allahın kitabını oxuyun, əzbərləyin və yaşayın.",
    body: [
      "Qur'an Allahın hidayət, rəhmət və qəlblərə şəfa olaraq nazil etdiyi hərfi kəlamıdır. Onunla münasibət qurmaq – onu oxumaq, mənalarını düşünmək, əmrlərinə əməl etmək və başqalarına öyrətmək – möminin bütün ömrünü həsr edə biləcəyi ən böyük və ən savablı ibadətlərdəndir. Bu, Allahın bizə uzadılmış ipidir. Kim ondan möhkəm yapışarsa, düz yola yönəlmiş olar.",
      "Ona əlavə edilən mükafatlar qeyri-adidir. Peyğəmbər (Allahın ona salavat və salamı olsun) Allahın Kitabını oxuyanlara və namaz qılanlara heç vaxt yox olmayan böyük bir mükafat verdiyini (Qur'an 35:29-30) və oxunan hər bir hərf üçün on qat mükafat verildiyini öyrətdi. Hətta sözdə çətinlik çəkən və büdrəyən şəxs, nə qədər ki, cəhd edirsə, ikiqat savabı vardır – biri qiraət üçün, digəri isə səy üçün.",
      "Qur'an da insanın axirətdəki məqamını birbaşa və canlı şəkildə yüksəldir. Peyğəmbər (salləllahu aleyhi və səlləm) qiyamət günü Qur'an səhabəsinə deyiləcək: “Oxu, yüksəl və dünyada oxuduğun kimi oxu. Başqa sözlə desək, insanın Cənnətdəki məqamı Kitabdan olan payla bərabər yüksəlir - bu, əzbərləmək və nəzərdən keçirmək üçün təəccüblü bir təşviqdir.",
      "Ancaq daha dərin məqsəd öz xatirinə oxumaq deyil, dəyişdirməkdir. Allah bizə “Qur'anı ölçüb-biçərək oxumağı” (Qur'an 73:4) əmr edir ki, mənalar bizim düşüncələrimizə, hisslərimizə və davranışlarımıza daxil olub yenidən formalaşsın. Qur'an sadəcə oxunmaq üçün deyil, yaşanmaq üçün göndərilmişdir; səhabələr on ayə öyrənər və onları başa düşüb ona əməl etmədikcə irəli getməzdilər.",
      "Praktik olaraq: hər gün bir hissə, hətta bir neçə ayə oxuyun, ancaq onları düşünərək oxuyun. Yeni surələri əzbərləyin və ya artıq bildiklərinizi qoruyun və ən əsası daha çox öyrənməyə tələsməzdən əvvəl öyrəndiklərinizlə hərəkət edin.",
    ],
    quran: [
      {
        excerpt:
          "Allahın Kitabını oxuyanlar, namaz qılanlar və ruzi olaraq verdiyimiz ruzilərdən xərcləyənlər, heç vaxt boşa çıxmayacaq bir ticarətə ümid bəsləyirlər ki, Allah onların mükafatlarını tam versin və Öz lütfündən artırsın.",
      },
      {
        excerpt: "Qur'anı da ölçü ilə oxuyun.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qur'an səhabəsinə deyiləcək: Oxu və yüksəl və dünyada oxuduğun kimi oxu, çünki sənin dərəcən oxuduğun son ayədə olacaqdır.",
      },
    ],
    actions: [
      "Gündəlik oxuyun - hətta düşüncə ilə bir neçə ayə.",
      "Yeni surələri əzbərləyin və ya bildiklərinizi qoruyun.",
      "Daha çox axtarmadan əvvəl öyrəndiklərinizlə hərəkət edin.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Zikr — zikr",
    summary: "Dildə yüngül, tərəzidə ağır.",
    body: [
      "Zikr, Allahı zikr etmək – Onu təsbih (SubhanAllah), həmd (Əlhəmdulillah), böyütmək (Allahu Əkbər), Onun birliyini təsdiqləmək (Lə iləhə illəllah) və istiğfar (istiqfar) sözləri ilə Onu qəlbdə və dildə saxlamaq deməkdir. Cənnətə aparan bütün yollar içərisində zikr etmək ən asan, lakin ən böyük mükafatlardan biridir, çünki onu hər yerdə, istənilən vəziyyətdə, hər an etmək olar.",
      "Allah Özü bunu səxavətlə əmr edir - \"Ey iman gətirənlər, Allahı çox zikr edin\" (Qur'an 33:41-42) - və bunun üçün bənzərsiz bir bəhrə vəd edir: qəlb rahatlığı. “Həqiqətən, qəlblər Allahı zikr etməklə rahatlıq tapar” (Qur'an, 13:28). Narahat, narahat bir dünyada bu, zikrin ən böyük hədiyyələrindən biridir. Peyğəmbər (salləllahu aleyhi və səlləm) də onun savabını ölçərək buyurmuşdur ki, dildə yüngül, tərəzidə ağır olan və Rəhmana sevimli olan iki kəlmə “SübhanAllahi və bihəmdihi, SübhanAllahil-Azim”dir.",
      "Xüsusi bir kateqoriya səhər və axşam zikridir - Peyğəmbərin (sallallahu aleyhi və səlləm) günün iki sərhədi üçün öyrətdiyi səhih dualar. Bunlar mömini bəlalardan qoruyan, Allahın himayəsini və rizasını çəkən mənəvi bir qala rolunu oynayır. Hər günün əvvəlində və sonunda yalnız bir neçə dəqiqə, varlığı ilə dedi, zamanla ürəyi sakitcə yenidən formalaşdırın.",
      "Zikrin hikməti ondan ibarətdir ki, rəsmi ibadətlər arasında Allahla əlaqəni canlı saxlayır. Zikrlə nəmlənmiş dil və ən əsası gündəlik seçimlərində Allahı zikr edən bir qəlb – qəzəbdən əvvəl, alışdan əvvəl, qərar vermədən əvvəl dayanmaq – əsl məqsəddir. Zikr dodaqda qalmaq üçün nəzərdə tutulmamışdır; həyatı idarə etmək üçün nəzərdə tutulub.",
      "Praktik olaraq: səhər və axşam zikrini gündəlik vərdiş halına salın, boş vaxtlarda təsbih, istiğfar və ya salavatdan sadə bir hissə axsın, xüsusilə yatmazdan əvvəl və oyananda Allahı zikr edin. Bir azdakı ardıcıllıq, çoxluğun partlamalarından daha yaxşıdır.",
    ],
    quran: [
      {
        excerpt:
          "İman gətirib qəlbləri Allahı zikr etməklə aramlıq tapanların qəlbləri, şübhəsiz ki, Allahı zikr etməklə rahatlıq tapar.",
      },
      {
        excerpt: "Ey iman gətirənlər, Allahı çox zikr edin və səhər-axşam Onu təsbih edin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "İki kəlmə dildə yüngül, tərəzidə ağır və Rəhmana sevimlidir: SübhanAllahi və bihəmdihi, SübhanAllahil-Azim.",
      },
    ],
    actions: [
      "Hər gün səhər və axşam adhkarını tamamlayın.",
      "İstiğfar və ya salavat üçün təsbih sayğacından istifadə edin.",
      "Yatmazdan əvvəl və oyandıqdan sonra Allahı yad edin.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Xeyriyyə və zəkat",
    summary: "Allahın sizə verdiyindən gizli və aşkar xərcləyin.",
    body: [
      "İslam dini möminə Allahın ona əmanət etdiyi maldan istər fərz, istərsə də könüllü olaraq verməyi əmr edir. Zəkat, İslamın beş əsasından biri olan sərvət üçün vacib olan illik ödənişdir və onun şərtlərinə cavab verənlər üçün ixtiyari deyildir. Bundan başqa sədəqə durur: Allah rizası üçün istənilən vaxt, könüllü olaraq vermək.",
      "Allah yolunda xərcləmənin savabı adi hesabdan qat-qat artıqdır. Allah Öz yolunda sərf edəni yeddi sünbül verən, hər sünbülündə yüz dənə olan tək bir dənə bənzədir - “Allah istədiyini artırar” (Bəqərə, 261). Sədəqə mal-dövləti azaltmaqdan uzaq, onu pak edər və bərəkəti artırar, suyun odu söndürdüyü kimi günahları da söndürər.",
      "Xeyriyyənin iki forması xüsusi qeyd olunmalıdır. Birincisi gizli sədəqədir, o qədər gizli şəkildə verilir ki, Peyğəmbərin (sallallahu aleyhi və səlləm) təsvir etdiyi kimi, sağ əlin verdiyini sol əl bilmir - bu ixlas Allah yanında xüsusilə sevimlidir və Qiyamət günü insana kölgə salır. İkincisi, xeyri ölümdən sonra da davam edən davamlı sədəqə olan cəriyədir. Həzrət Peyğəmbər (s) buyurur ki, insan öldükdə üç əməldən başqa əməli bitər: daimi sədəqə, fayda verən elm və onun üçün dua edən saleh övlad.",
      "Sədəqənin hikməti odur ki, alana qədər verənə də təsir edir. Qəlbdəki xəsislik məngənəsini açır, mərhəmət yaradır, camaatın bağlarını möhkəmləndirir və varlılara onların həqiqi sahib deyil, müvəkkil olduqlarını xatırladır. İslam isə sədəqənin tərifini genişləndirir ki, heç kəs kənarda qalmasın: Peyğəmbər (s) öyrətdi ki, qardaşına təbəssüm, faydalı söz və hətta yoldan zərərli əşyanı çıxarmaq sədəqədir.",
      "Praktiki olaraq: zəkat borcunuz varsa, onu dəqiq hesablayın və ödəyin; az da olsa müntəzəm sədəqə verin ki, vermək hadisədən çox vərdişə çevrilsin; və qalıcı bir sədəqə axtarın - tələbəyə sponsorluq etmək, quyuya maliyyə vermək və ya məscidi dəstəkləmək - getdiyinizdən sonra da sizi mükafatlandırmağa davam edir.",
    ],
    quran: [
      {
        excerpt:
          "Mallarını Allah yolunda xərcləyənlərin məsəli yeddi sünbül bitirən, hər sünbüldə yüz dənə olan dənə bənzəyir. Allah istədiyini artırar.",
      },
      {
        excerpt:
          "Sizdən birinə ölüm gəlib: “Ey Rəbbim, məni bir az gecikdirsəydin ki, sədəqə verib əməlisalehlərdən olum!” – deməzdən əvvəl sizə verdiyimiz ruzilərdən xərcləyin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "İnsan vəfat etdikdə onun üç əməli istisna olmaqla, əməlləri sona çatar: davamlı sədəqə, faydalı elm və ya onun üçün dua edən saleh övlad.",
      },
    ],
    actions: [
      "Əgər borcunuz varsa, hesablayın və zəkat verin.",
      "Kiçik də olsa, müntəzəm olaraq sədəqə verin.",
      "Sədəqə cəriyə imkanlarını axtarın.",
    ],
    appLinks: [{}],
  },
  {
    title: "Yaxşı xarakter",
    summary: "Tərəzidə ən ağır şey əla davranış ola bilər.",
    body: [
      "Gözəl əxlaq (hüsnül-xuluq) möminin Allahın yaratdıqlarına münasibətdə göstərdiyi nəcib xüsusiyyətlərin məcmusudur: doğruluq, səbir, təvazökarlıq, mərhəmət, alicənablıq, mülayimlik və vədinə əməl etmək. İslam sırf ictimai bir zəriflik olmaqdan uzaq, xasiyyəti imanın əsas ölçüsü və insanın Qiyamət gününə qədər daşıya biləcəyi ən ağır işlərdən biri hesab edir.",
      "Onun rütbəsi ən açıq şəkildə ifadə edilir. Həzrət Peyğəmbər (s) tərəzidə gözəl əxlaqdan daha ağır bir şey olmadığını və iman baxımından ən kamil möminlərin əxlaqı gözəl olanların olduğunu bildirmişdir. O, hətta kamil nəcib xasiyyətə göndərildiyini söyləməklə öz missiyasını yekunlaşdırdı. Bu o deməkdir ki, valideynlərinizə, həyat yoldaşınıza, övladlarınıza, qonşularınıza və hətta qəriblərə münasibətiniz ibadətinizdən ayrı deyil - bu, onun mərkəzi hissəsidir.",
      "Gözəl əxlaq, Peyğəmbərin (sallallahu aleyhi və səlləm) vəd etdiyinə görə güclüdür: mömin onun gözəl əxlaqı ilə bütün günü oruc tutan və gecəni ibadət edən şəxs dərəcəsinə çata bilər. Başqa sözlə desək, əla xasiyyət adi insanı ən sədaqətli ibadət edənlər səviyyəsinə qaldıra bilər, çünki o, çətin, daimi və nəfsi hər addımda sınayır - qəzəbi cilovlamaq, təhqiri bağışlamaq və sərtliyin asan olduğu halda mülayimliyi seçməkdir.",
      "Hikmət budur ki, İslam təkcə insanla Allah arasında şəxsi əlaqə deyil; insanın ətrafındakı hər kəslə necə davrandığına aşmaq deməkdir. Namazı rəftarını yumşaltmayan ibadətçi məqamı əldən vermiş olur, gözəl əxlaq isə canlı nümunə ilə insanları imana yönəldən davatdır. Məhz buna görə də mətnlər Allaha ibadəti təkrar-təkrar Onun yaratdığı fəzilətlə birləşdirir.",
      "Praktik olaraq: hər dəfə bir xüsusiyyət üzərində işləyin - təhrik olunanda dilinizi tutun, sizə zülm edənləri bağışlayın, pozduğunuz münasibətləri düzəldin və vədlər sizə baha başa gəlsə belə, onlara əməl edin. Namazdan sonra o gün insanlarla necə rəftar etdiyinizə dair qısa gündəlik düşüncə, sabit böyümənin sadə yoludur.",
    ],
    quran: [
      {
        excerpt: "Həqiqətən, sən böyük və nəcib xasiyyət sahibisən.",
      },
      {
        excerpt:
          "O kəslər ki, rahatlıqda da, çətinlikdə də xərcləyir, qəzəblərini saxlayar və insanları əfv edərlər. Allah yaxşılıq edənləri sevər.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qiyamət günü möminin tərəzisində gözəl əxlaqdan daha ağır bir şey yoxdur. Həqiqətən, Allah ədəbsiz və kobud adamı sevməz.",
      },
      {
        excerpt:
          "Möminlərin iman baxımından ən kamil olanı gözəl əxlaqlı olandır və sizin ən xeyirliniz zövcəsinə yaxşı davrananınızdır.",
      },
    ],
    actions: [
      "Təhrik olunanda səbr edin.",
      "Başqalarını bağışlayın və pozulmuş münasibətləri düzəldin.",
      "Gündəlik jurnalda namazdan sonra xarakterinizi əks etdirin.",
    ],
    appLinks: [{}],
  },
  {
    title: "Bilik axtarmaq",
    summary: "Allah elm istəyənin cənnətə gedən yolunu asanlaşdırır.",
    body: [
      "Faydalı elm axtarmaq – Allahın və Rəsulunun (sallallahu aleyhi və səlləm) öyrətdiklərini öyrənmək, sonra ona əməl etmək və onu ötürmək – ibadət və onun vacibliyi baxımından hər bir müsəlmanın üzərinə düşən vəzifədir. Bu, imanı aydınlaşdıran, ibadəti paklaşdıran, haqqı batildən ayıran müqəddəs elmdir; özünü göstərmək üçün bilik deyil, hərəkətə rəhbərlik edən işıqdır.",
      "Həzrət Peyğəmbər (s) bu təqibi birbaşa bütün bu səfərin məqsədi ilə əlaqələndirmişdir: “Kim elm öyrənmək üçün bir yola düşərsə, Allah onun üçün Cənnətə gedən yolu asanlaşdırar”. “Yol” həm hərfi, həm də məcazidir — Allah axtaranın bu həyatda yolunu asanlaşdırır, axirətdə isə Cənnətə gedən yolunu asanlaşdırır. O, həmçinin mələklərin elm axtaranın razılığı üçün qanadlarını aşağı saldığını, göylərdə və yerdə olan hər şeyin, hətta dənizdəki balıqların belə, yaxşılığı öyrədən üçün bağışlanma dilədiyini öyrədir.",
      "Elm də nadir əməllərdəndir ki, insanı ölümdən sonra da mükafatlandırır. Peyğəmbər (s) savabı qəbirdə davam edən üç şeydən faydalı elmi, sədəqə və saleh övladın yanında qeyd etmişdir. Beləliklə, faydalı bir məsələni öyrətmək - kiməsə düzgün dua etməyi öyrənməyə kömək etmək, səhih bir hədis paylaşmaq və ya insanı həqiqətə yönəltmək - illər, hətta nəsillər boyu axan bir mükafat axını ola bilər.",
      "Hikmət budur ki, elmsiz əməl kor, əməlsiz bilik isə nəticəsizdir. Düzgün elm insanı bidətdən və azğınlıqdan qoruyur, ixlası dərinləşdirir və ona təkcə özünə fayda verməkdənsə, başqalarına fayda vermək qabiliyyəti verir. İslam alimləri həmişə iki təhlükədən çəkindirmişlər: cahilliklə hərəkət etmək və əməl etmədən bilmək.",
      "Praktik olaraq: müntəzəm olaraq faydalı bir şey öyrənməyə söz verin - ayə, hədis, gündəlik ibadətiniz üçün lazım olan bir hökm. İman, namaz, paklanma və böyük qadağaların vaciblərindən başlayın, sonra tədricən dərinləşdirin. Öyrəndiklərinizi təvazökarlıqla paylaşın və həmişə ilk növbədə özünüzə tətbiq edin.",
    ],
    quran: [
      {
        excerpt:
          "De: Bilənlərlə bilməyənlər eyni ola bilərmi? Yalnız ağıl sahibləri öyüd-nəsihət qəbul edərlər.",
      },
      {
        excerpt: "Və de: “Ey Rəbbim, elmimi artır.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim elm öyrənmək üçün bir yola düşərsə, Allah onun üçün Cənnətə gedən yolu asanlaşdırar.",
      },
      {
        excerpt:
          "İnsan vəfat etdikdə onun üç əməli istisna olmaqla, əməlləri sona çatar: davamlı sədəqə, faydalı elm və ya onun üçün dua edən saleh övlad.",
      },
    ],
    actions: [
      "Hər həftə faydalı bir şey öyrənin.",
      "Təkəbbür olmadan biliyi paylaşın.",
      "Daha çox toplamadan əvvəl öyrəndiklərinizi tətbiq edin.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Könüllü ibadət",
    summary: "Vacibdən artıq nəfslə Allaha yaxınlaşın.",
    body: [
      "Könüllü ibadət (nəfl) dedikdə, möminin Allahın vacib buyurduğundan artıq əlavə ibadətlər - əlavə namazlar, əlavə oruclar, əlavə sədəqə və zikrlər nəzərdə tutulur. Borclar birinci gəlir və müzakirə olunmur, lakin onlar yerinə yetirildikdən sonra nəfs qulun tələb olunan minimumu aşan sevgi, yaxınlıq və həsrət ifadə etdiyi yerdir.",
      "Bunun üzərinə heyrətamiz bir vəd var. Bir hədis qüdsidə Allah buyurur: “Qulum Mənə vacib etdiyim şeydən daha sevimli bir şeylə Mənə yaxınlaşmaz. Mən onu sevənə qədər ixtiyari əməlləri ilə Mənə yaxınlaşmağa davam edər” – və Allah bir bəndəsini sevdikdən sonra onun duası qəbul olunar və işləri yoluna qoyular. Buna görə də könüllü ibadət sırf itaətdən ilahi məhəbbətə doğru yüksələn yaxınlıq nərdivanıdır.",
      "Sünnə onun əlçatan formaları ilə zəngindir: gecənin axır hissəsində gecə namazı (təhəccüd), zöhr namazı (duha), fərzlərdən əvvəl və sonra adi sünnət namazları, bazar ertəsi və cümə axşamı və ya hər ayın ağ günləri kimi könüllü oruc tutmaq. Nəflə ibadət də nöqsanlarımızı sakitcə aradan qaldırır - Peyğəmbər öyrədir ki, fərz namazlardakı hər hansı bir əskiklik Qiyamət günü insanın nafilə namazı ilə tamamlanır.",
      "Hikmət budur ki, nəflin imanı yaşatması və böyüməsi. Öhdəliklər təməli qoruyur, lakin könüllü əməllər ürəyin uzandığı, heç kimin görmədiyi şəxsi ibadətlərin səmimiyyəti formalaşdırdığı və insanın özünü həyatın daha çətin sınaqlarına hazırladığı yerdir. Bu əməllərin isteğe bağlı olması da bir rəhmətdir - Allah çoxlu qapılar açır ki, hər bir insan özünə uyğun gələndən keçə bilsin.",
      "Praktiki olaraq əsas intensivlik deyil, davamlılıqdır. Peyğəmbər (sallallahu aleyhi və səlləm) öyrətdi ki, Allah yanında ən sevimli əməllər kiçik də olsa, ardıcıl əməllərdir. Günlər ərzində yanıb-sönən iddialı bir partlayışdansa, həqiqətən yerinə yetirə biləcəyiniz bir neçə könüllü əməl seçin - iki rükət təhəccüd, həftədə bir oruc, Qur'anın müəyyən bir hissəsi -.",
    ],
    quran: [
      {
        excerpt:
          "Qorxu və ümidlə Rəbbinə yalvardıqları üçün yanları yataqlarını tərk edir və onlara verdiyimiz ruzidən xərcləyirlər. Etdikləri əməllərin mükafatı olaraq onlar üçün hansı rahatlıq gizləndiyini heç kəs bilməz.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qulum Mənə vacib etdiyim şeydən daha sevimli bir şeylə Mənə yaxınlaşmaz. Qulum da ixtiyari əməllərlə Mənə yaxınlaşmağa davam edir, ta ki mən onu sevənə qədər.",
      },
    ],
    actions: [
      "İki rükət də olsa təhəccüd namazını qıl.",
      "Mümkün olduqda könüllü günlər tez.",
      "Fərzdən əvvəl/sonra ardıcıl sünnə namazlarını əlavə edin.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Səbir və minnətdarlıq",
    summary: "Allah səbir edənləri və şükür edənləri sevir.",
    body: [
      "Səbr (səbr) və şükür (şükr) möminin həyatda uçduğu iki qanaddır. Səbir üç sahədə səbirdir: Allaha itaətdə möhkəm qalmaq, asilikdən çəkinmək və Onun hökmündən şikayət etmədən həyatın sınaqlarına dözmək. Şükür, hər bir nemətin Allahdan gəldiyini dərk edib, qəlblə, dillə və itaətkar əməllə şükürlə cavab verməkdir. Onlar birlikdə möminin həm çətinliyə, həm də asanlığa cavabını əhatə edir.",
      "Onların əhəmiyyəti, möminin başına gələn hər şeyi necə qarşıladığını müəyyən etmələridir. Peyğəmbər möminin bütün işinin xeyirli olmasına heyrət etdi: ona bir xeyir çatdıqda şükür edər və bu, onun üçün xeyirlidir, sıxıntı üz verdiyi zaman səbir edər və bu da onun üçün xeyirlidir – bu, mömindən başqa heç kimə verilmiş nemətdir. Deməli, nə gəlirsə, möminin savab yolu var.",
      "Səbrin mükafatı qeyri-məhduddur. Əksər əməllərin mükafatı qat-qat çox olsa da, Allah belə buyurur: “Səbr edənlərin mükafatı hesabsız olaraq veriləcəkdir” (Qur'an, 39:10). Minnətdarlıq isə öz artım vədini daşıyır: “Əgər şükür etsəniz, mən sizi mütləq artıracağam” (Qur'an, 14:7). Deməli, şükür təkcə nemətlərə düzgün cavab deyil, həm də onların böyüməsinə səbəb olan şeydir.",
      "Buradakı müdriklik əzabları tamamilə əks etdirir. Məhkəmələr avtomatik cəza deyil; yaxşı cavab verən mömin üçün bunlar günahları yox edən paklıq və dərəcəni yüksəldən yüksəliş ola bilər. Peyğəmbər (sallallahu aleyhi və səlləm) öyrətdi ki, müsəlmanın başına heç bir yorğunluq, xəstəlik, narahatlıq və hətta tikan sancması belə gəlmir ki, Allah onun günahlarından bəzilərini silməsin. Bu, həyatın ən çətin anlarını xalis itkidən çox fürsətə çevirir.",
      "Praktik olaraq: müsibət üz verən zaman Allahın öyrətdiyi “İnnə lillahi və inna iləyhi raciun” (Həqiqətən biz Allaha məxsusuq və Ona qayıdacağıq) sözləri ilə cavab ver və Onun hökmünü rədd edən şikayətdən dilini tut. Yaxşı günlərdə nemətlərinizi ucadan sayın və hər gün onlardan bir neçəsi üçün Allaha şükür edin; onlara ad vermək ürəyi yumşaq və minnətdar saxlayır.",
    ],
    quran: [
      {
        excerpt:
          "Səbr edənlərə müjdə ver o kəslər ki, bir müsibət üz verdikdə: “Həqiqətən, biz Allaha məxsusuq və biz Ona tərəf qayıdacağıq!” – deyərlər. Onların Rəbbindən bərəkət və mərhəmət vardır və onlar doğru yoldadırlar.",
      },
      {
        excerpt:
          "Əgər şükür etsəniz, sizi artıraram. Əgər inkar etsəniz, şübhəsiz ki, Mənim əzabım şiddətlidir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Möminin işi gözəldir, çünki onun bütün işləri xeyirlidir. Əgər asanlıq gəlsə, şükür edər və bu onun üçün xeyirlidir. Əgər çətinlik gəlsə, səbir edər və bu onun üçün xeyirlidir. Bu, ancaq möminlərə aiddir.",
      },
    ],
    actions: [
      "İmtahan zamanı “inna lillahi və inna ilayhi raciun” deyin.",
      "Gündəlik üç nemət üçün Allaha yüksək səslə şükür edin.",
      "Allahın hökmünü rədd edəcək şəkildə şikayət etməyin.",
    ],
  },
  {
    title: "Allaha çağırış",
    summary: "Kim başqasına hidayət etsə, ona tabe olan kimi savab qazanar.",
    body: [
      "Də'vət başqalarını Allaha də'vət etmək deməkdir - İslamın mesajını paylaşmaq, insana dua etməyi öyrətmək, yaxşılığa təşviq etmək, pislikdən yumşaq bir şəkildə çəkindirmək və ya mübarizə aparan bir müsəlmanın itaətə qayıtmasına kömək etməkdir. Bu, hər bir peyğəmbərin missiyası idi və hər biri öz bacarığına və biliyinə görə cəmiyyətin ortaq məsuliyyətidir. O, alimlər üçün nəzərdə tutulmayıb; Hər kəs bir faydası olsa belə çatdırsa, Allaha çağırışdır.",
      "Onun mükafatı bütün İslamda ən səxavətlilərdən biridir. Peyğəmbər (salləllahu aleyhi və səlləm) buyurmuşdur ki, hər kəs bir yaxşılığa hidayət etsə, ona əməl edənin savabı kimi savabı vardır və başqa bir rəvayətdə də kim hidayətə dəvət etsə, ona tabe olanların savabını alır, öz savabı zərrə qədər də azalmır. Bu o deməkdir ki, hərəkətə gətirdiyiniz yaxşılıq siz hərəkət etdikdən uzun müddət sonra toxunduğu hər bir insan vasitəsilə mükafatınızı artırmağa davam edə bilər.",
      "Amma dəvətin bir ədəbi var - bir üslubu var ki, uğur qazanması üçün ona hörmət edilməlidir. Allah buyurur: “Rəbbinin yoluna hikmətlə və gözəl öyüd-nəsihətlə dəvət et və onlarla ən gözəl şəkildə mübahisə et” (Qur'an, 16:125). Hikmət doğru şeyi, doğru insana, düzgün şəkildə və zamanda söyləmək deməkdir; sərtlik, təkəbbür və xal toplamaq insanları uzaqlaşdırır və məqsədə xəyanət edir. Dəvətin işi yalnız Allaha məxsus olan qəlbləri zorlamaq deyil, çatdırmaq və əkməkdir.",
      "Başqalarını doğru yola yönəltmək üçün belə böyük bir mükafat bağlamağın hikməti hər mömini davamlı yaxşılıq mənbəyinə çevirməsidir. Dəvət edənin öz imanını da qoruyur: başqalarını namaza, halallığa və ibadətə dəvət etmək insanın özündən möhkəm yapışmağı xatırlatmaqdır. Və bu, cəmiyyəti bir-birinə etinasızlıqdan daha çox qarşılıqlı qayğı ilə birləşdirir.",
      "Praktik olaraq evə yaxın başlayın. Öz ailənizi təkmilləşdirin və öyrədin - həyat yoldaşınız, uşağınız, bacı-qardaşınız - çünki onlar sizin ilk və ən davamlı məsuliyyətinizdir. Faydalı biliyi mehribanlıqla paylaşın, kiməsə namaz qılmağı və ya Qur'an oxumağı öyrənməyə kömək edin və unutmayın ki, gözəl əxlaqlı həyat və sabit ibadət çox vaxt ən inandırıcı da'vatdır.",
    ],
    quran: [
      {
        excerpt:
          "Rəbbinin yoluna hikmət və gözəl öyüd-nəsihətlə dəvət et və onlarla ən gözəl tərzdə mübahisə et.",
      },
      {
        excerpt:
          "Allaha dəvət edən, yaxşı işlər görən və: “Həqiqətən, mən müsəlmanlardanam!” – deyən kəsdən daha gözəl danışan kim ola bilər?",
      },
    ],
    hadith: [
      {
        excerpt: "Kim bir insanı yaxşılığa hidayət edərsə, onu edənin mükafatı vardır.",
      },
    ],
    actions: [
      "Faydalı biliyi xeyirxahlıqla paylaşın.",
      "Kiməsə dua etməyi və ya Qur'an oxumağı öyrənməyə kömək edin.",
      "Cəmiyyətdə yaxşı xarakter nümunəsi olun.",
    ],
  },
  {
    title: "Böyük ömürlük əməllər",
    summary: "Həcc, ailə və davamlı sədəqə.",
    body: [
      "Gündəlik və həftəlik ibadətlərlə yanaşı, İslam mömini bir ovuc böyük, ömürlük əməllərə - mükafatı böyük və bəzi hallarda isə heç vaxt bitməyən böyük sərmayələrə yönəldir. Bunlar ətrafdakı həyatı planlaşdırmağa dəyər layihələrdir: həcc ziyarəti, saleh ailənin yetişdirilməsi və davamlı yaxşı işlərin qurulması.",
      "Onların arasında ən başlıcası İslamın beşinci sütunu olan, fiziki və maddi imkanı olan hər bir müsəlmana ömürdə bir dəfə vacib olan həccdir – “Kəbəni həcc etmək, Allah qarşısında bir yol tapmağa qadir olanların borcudur” (Qur'an, 3:97). Onun savabı tam paklıqdır: Peyğəmbər (s) buyurmuşdur ki, hər kim Allah rizası üçün həcc edər, ədəbsiz və günahlardan uzaq olarsa, anasının onu dünyaya gətirdiyi gün kimi pak olar. Qəbul edilmiş həccin cənnətdən az mükafatı olmadığını söylədi. Kiçik həcc olan ümrə də böyük savab daşıyır və bir ümrə ilə digəri arasındakı günahları silir.",
      "İkinci böyük sərmayə sədəqə cəriyədir - ölümdən sonra insanı mükafatlandıran davamlı sədəqədir. Peyğəmbər (salləllahu aleyhi və səlləm) onu qəbirdə insana fayda verən üç şeydən, faydalı elm və onun üçün dua edən saleh övladdan adlandırmışdır. Uşaqları iman və gözəl əxlaq üzərində böyütmək bəlkə də bunların ən böyüyüdür, lakin məscid tikmək və ya ona qulluq etmək, quyu qazmaq, bir yetimə sponsorluq etmək, ağac əkmək və ya təhsili maliyyələşdirmək – hər biri verəndən daha uzun ömür sürən mükafat axınıdır.",
      "Bu əməllərin hikməti odur ki, insanın hesabını ömründən kənara çıxarır. Möminin fəaliyyət illəri qısa olsa da, qazdığı quyu və ya yaxşı böyütdüyü övladı əsrlər boyu ona savab qazandıra bilər. Beləliklə, İslam uzunmüddətli baxışı təşviq edir: təkcə bugünkü dua haqqında deyil, sən gedəndən sonra da səndən hansı xeyirlərin axacağı barədə düşünməyə.",
      "Praktiki olaraq: əgər bacarırsınızsa, həcc və ya ümrəni sonsuza qədər təxirə salmaqdansa, ciddi şəkildə planlaşdırın. Ailənizin imanı və xarakterinə əsl səy göstərin, çünki onlar sizin ən davamlı mirasınızdır. Və ən azı bir davamlı xeyriyyə layihəsini - bilik, su, sığınacaq və ya bir yetim - müəyyən edin ki, yaxşı əməlləriniz ölümdən sonra da davam etsin.",
    ],
    quran: [
      {
        excerpt: "Kəbəni həcc etmək, ona yol tapa bilənlərin Allah qarşısında borcudur.",
      },
      {
        excerpt:
          "İnsanlara həcci təbliğ et. Özləri üçün xeyir görsünlər deyə, hər uzaq keçiddən piyada və hər arıq dəvənin üstündə sənin yanına gələcəklər.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim Allah rizası üçün həcc etsə, ədəbsiz və fasiqlik etməsə, anasının onu dünyaya gətirdiyi gün kimi günahsız qayıdar.",
      },
      {
        excerpt:
          "İnsan vəfat etdikdə onun üç əməli istisna olmaqla, əməlləri sona çatar: davamlı sədəqə, faydalı elm və ya onun üçün dua edən saleh övlad.",
      },
    ],
    actions: [
      "İmkanınız varsa Həcc və ya Ümrəni planlaşdırın.",
      "Ailənizin inancına və xarakterinə sərmayə qoyun.",
      "Davamlı bir xeyriyyə layihəsini dəstəkləyin.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Allahın rəhməti - son söz",
    summary: "Əməllər vasitədir; giriş Onun mərhəməti ilədir.",
    body: [
      "Mömin bütün əməllərdən, bütün cəhdlərdən və bütün yollardan sonra bu yolda son sözü olan alçaldıcı bir həqiqətə çatır: heç kəs yalnız öz əməlinə görə Cənnətə daxil olmaz. Həzrət Peyğəmbər (s) özü haqqında – Allah yanında ən sevimlisi – belə buyurmuşdur ki, o da öz əməli ilə Cənnətə girməz, ancaq Allah onu Öz rəhməti ilə əhatə edər. Onun üçün belədirsə, şübhəsiz ki, bizim üçün də belədir.",
      "Bu, heç vaxt ibadətə etinasızlıq icazəsi kimi anlaşılmamalıdır. Əməllər Allahın seçdiyi və əmr etdiyi vasitə olaraq qalır; O, mərhəmətini iman və saleh əmələ bağlamışdır və onları tərk etmək təvazökarlıq deyil, qəflətdir. Düzgün məna nisbətdir: əməllərimiz nə qədər çox olsa da, Allahın bizə verdiyi nemətlərdən bir zərrə belə əvəzini verə bilməz və əbədi Cənnəti satın ala bilməz. Beləliklə, biz əməllərimizi sevgi və itaət əlaməti olaraq təklif edirik, sonra onları qəbul etmək və bizi qəbul etmək üçün tamamilə Onun lütfünə arxalanırıq.",
      "Bu mərhəmətin əhatə dairəsi heyrətləndiricidir. Peyğəmbər (s) buyurur ki, Allah rəhməti yüz hissəyə bölmüşdür; O, bütün məxluqata yalnız bir hissəni nazil etdi - və bunun sayəsində ana övladına, heyvanlar da balalarına qarşı yumşaq davranır - qalan doxsan doqquz hissəsini isə Qiyamət günü bəndələrinə bəxş etmək üçün Öz yanında saxladı. Bu dünyada gördüyümüz mərhəmət yüzdən bir hissənin cüzi hissəsidir.",
      "Buna görə də balanslı mömin iki qanadlı uçan quş kimi ümid və qorxu arasında yaşayır. O, Allahın ədalətindən, günahdan boyun qaçırmayacaq qədər qorxur, nə qədər azmış olsa da, ümidsizliyə qapılmayacaq qədər Allahın rəhmətinə ümid edər. Tamamilə qorxuya meyl etmək ümidsizliyə səbəb olur; tamamilə ümidə meyl etmək təkəbbür doğurur. Allahın adları - Ər-Rəhman (Rəhman), Ər-Rəhim (Ən Rəhim), Əl-Qafur (Bağışlayan) - ümid qanadında lövbər salır.",
      "Qoy hər gün bağladığınız ruh belə olsun: Allahdan Firdevs istəyin, əlinizdən gələni edin, nöqsanlarınıza görə tövbə edin və sonra son dərəcənizi Adil və Rəhmli Allaha təhvil verin.",
    ],
    quran: [
      {
        excerpt:
          "Mənim rəhmətim hər şeyi əhatə edir. Mən bunu əməlisalehlərə, zəkat verənlərə və ayələrimizə iman gətirənlərə hökm edəcəyəm.",
      },
      {
        excerpt:
          "De: “Ey Mənim özlərinə zülm edən qullarım, Allahın rəhmətindən ümidinizi kəsməyin. Həqiqətən, Allah bütün günahları bağışlayar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sizlərdən heç biriniz tək öz əməli ilə Cənnətə daxil olmaz. Dedilər: Sən də deyilsən, ya Rəsulallah? O dedi: “Allah məni Öz rəhmətinə bürümədikcə, mən də.",
      },
      {
        excerpt:
          "Allahın yüz rəhməti var. O, cinlərin, insanların, heyvanların və həşəratların bir-birinə mərhəmət göstərmələri üçün nazil etdi. O, doxsan doqquz hissəni Özü yanında saxladı ki, Qiyamət günü onunla qullarına rəhm edər.",
      },
    ],
    actions: [
      "Allah qorxusu ilə Onun rəhmətinə ümid bəsləyin.",
      "Günahdan sonra heç vaxt ümidsiz olmayın - tövbə edin və səy göstərməyə davam edin.",
      "Allahdan Firdevs və xeyirli aqibət (hüsnül-xatimə) dilə.",
    ],
    appLinks: [{}, {}],
  },
];

export const JANNAH_GATES_AZ: DeepPartial<JannahGate>[] = [
  {
    name: "Namaz Qapısı",
    deedSummary: "Beş vaxt namazı mühafizə edənlər və bərqərar edənlər üçün.",
    hadith: [
      {
        excerpt:
          "Kim Allah yolunda bir cüt mal xərcləsə, Cənnət qapılarından çağırılacaqdır. Kim namaz əhlindən idisə, Namaz qapısından çağırılacaqdır.",
      },
    ],
  },
  {
    name: "Xeyriyyə qapısı",
    deedSummary: "Allah rizası üçün ixlasla sədəqə verənlər üçün.",
    hadith: [
      {
        excerpt: "Kim sədəqə əhlindən olarsa, o, Sədəqə qapısından çağırılacaqdır.",
      },
    ],
  },
  {
    name: "Ər-Reyyan qapısı",
    deedSummary: "Oruc tutanlar üçün nəzərdə tutulmuşdur - yalnız onların girdiyi bir qapı.",
    hadith: [
      {
        excerpt:
          "Cənnətdə Ər-Reyyan adlı bir qapı vardır ki, Qiyamət günü ondan yalnız oruc tutanlar daxil olar. Onların sonuncusu daxil olduqdan sonra o, bağlanacaq.",
      },
    ],
  },
  {
    name: "Cihad qapısı",
    deedSummary: "Allah yolunda ixlasla cihad edənlər üçün.",
    hadith: [
      {
        excerpt: "Cihad əhlindən olan şəxs Cihad qapısından çağırılacaqdır.",
      },
    ],
  },
  {
    name: "Həccin mükafatı",
    deedSummary: "O kəslər üçün ki, həcc əməllərini xalis yerinə yetirib, günahsız qayıdıblar.",
    hadith: [
      {
        excerpt:
          "Kim Allah rizası üçün həcc etsə, ədəbsiz və fasiqlik etməsə, anasının onu dünyaya gətirdiyi gün kimi günahsız qayıdar.",
      },
    ],
  },
  {
    name: "Hər qapıdan çağırılır",
    deedSummary: "Əbu Bəkr kimi bəziləri bütün qapılardan daxil olmağa çağırılacaqlar.",
    hadith: [
      {
        excerpt:
          "Əbu Bəkr soruşdu: Bütün bu qapılardan kimsə çağırılacaqmı? Dedi: Bəli və ümid edirəm ki, sən də onlardan olarsan.",
      },
    ],
  },
];

export const JANNAH_VERSES_AZ: DeepPartial<JannahVerseEntry>[] = [
  {
    excerpt:
      "Rəbbiniz tərəfindən bağışlanmağa və genişliyi göylərlə yer qədər olan, müttəqilər üçün hazırlanmış Cənnətə doğru yarışın.",
  },
  {
    excerpt:
      "Ağacları altından çaylar axan cənnətlər və Ədn cənnətlərində gözəl məskənlər vardır. Lakin Allahın rizası daha böyükdür.",
  },
  {
    excerpt: "İman gətirib yaxşı işlər görənlər üçün sığınacaq cənnətləridir.",
  },
  {
    excerpt:
      "Etdikləri əməllərin mükafatı olaraq onlar üçün hansı rahatlıq gizləndiyini heç kəs bilmir.",
  },
  {
    excerpt: "Orada onlar üçün istədikləri hər şey vardır.",
  },
  {
    excerpt: "Hər kəsin etdiklərinə görə dərəcələri vardır.",
  },
  {
    excerpt: "Onların Allah yanında dərəcələri vardır və Allah onların nə etdiklərini görəndir.",
  },
  {
    excerpt:
      "Ey Rəbbimiz, bizə dünyada da, axirətdə də yaxşılıq ver və bizi Cəhənnəm əzabından qoru!",
  },
  {
    excerpt: "Allahın rəhmətindən ümidinizi kəsməyin! Həqiqətən, Allah bütün günahları bağışlayar.",
  },
  {
    excerpt: "Ey qullarım, bu gün sizə heç bir qorxu yoxdur və siz qəm-qüssə də olmayacaqsınız.",
  },
  {
    excerpt: "Və qabaqcıllar, qabaqcadan gələnlər – bunlar yaxın olanlardır.",
  },
  {
    excerpt:
      "Beləliklə, Allah onları o günün şərindən qoruyar, onlara nur və xoşbəxtlik bəxş edər.",
  },
];

export const JANNAH_DUAS_AZ: DeepPartial<JannahDuaEntry>[] = [
  {
    context: "Hər iki dünyada xeyir və Cəhənnəmdən qorunmaq üçün hərtərəfli dua.",
  },
  {
    context: "Təşəhhüddən sonra qısa bir dua: Cənnəti dilə və Cəhənnəmdən sığın.",
  },
  {
    context: "Təşəhhüddən sonra Allahın gözəl adlarından istifadə edərək Cənnəti dilə.",
  },
  {
    context: "Allahı görməyin şirinliyini və Onunla görüşmək həsrətini istəyin.",
  },
];

export const JANNAH_PROMISED_AZ: DeepPartial<JannahPromisedEntry>[] = [
  {
    name: "On vəd edilmiş Cənnət",
    summary:
      "Əbu Bəkr, Ömər, Osman, Əli, Təlhə, Zübeyr, Əbdürrəhman ibn Ovf, Səd, Səid ibn Zeyd və Əbu Ubeydə (Allah onlardan razı olsun).",
    note: "Sünən ət-Tirmizidə (3747, səhih) bir hədisdə birlikdə adı çəkilmişdir.",
  },
  {
    name: "Dürüst və səbirli",
    summary: "Allah imanda doğru danışanları, itaətdə və imtahanlarda səbir edənləri tərifləyir.",
    note: "Qur'an 4:69-a və əs-sadiqin və əs-sabirin haqqında bir çox ayələrə baxın.",
  },
  {
    name: "Allah yolunda şəhidlər",
    summary:
      "İslam şəriətinə uyğun olaraq İslamı müdafiə edərək dünyasını dəyişənlərə cənnətlə müjdə verilir.",
    note: "Alimlər şəhadəti dəqiq müəyyən edir; döyüşdə hər ölüm avtomatik olaraq uyğun gəlmir.",
  },
  {
    name: "Son sözləri tövhid olanlar",
    summary: "Kimin son sözü “Lə iləhə illəllah” olarsa, Cənnətə daxil olar.",
    note: "Sünəni Əbu Davud 3116 (səhih). Yaxşı sonluq ömürlük axtarışdır.",
  },
  {
    name: "peyğəmbərlər",
    summary: "Hər bir peyğəmbər Allahın hökmü ilə Cənnətin ən yüksək dərəcələrindədir.",
    note: "Onların məntəqəsinə adi əməllərlə çatmaq olmaz, onlar seçilir və qorunur.",
  },
];
