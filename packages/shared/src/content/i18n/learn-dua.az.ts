// Azerbaijani translation overlay for the Learn Dua content. Mirrors the order of
// its English source in ../learn-dua*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { LearnDuaOccasion, LearnDuaTopic } from "../../types/learn-dua";
import type { DeepPartial } from "./localize";

export const LEARN_DUA_TOPICS_AZ: DeepPartial<LearnDuaTopic>[] = [
  {
    title: "dua nədir?",
    summary: "Dua ibadətdir: Allaha birbaşa, təvazökarlıqla və ümidlə dua etmək.",
    body: [
      "Dua (دعاء) Allaha dua etmək - Ondan xeyir, bağışlanma, hidayət və qorunma diləmək və ehtiyac içində Ona üz tutmaqdır. Həzrət Peyğəmbər (s) kiçik bir əməl olmaqdan uzaq olaraq, “Dua ibadətdir” buyurdu və sonra Allahın “Mənə dua edin” əmrini oxudu. Mən sizə cavab verəcəyəm”. Allahdan istəmək özü də xalis tövhid əməlidir, çünki bütün nəticələri yalnız Onun eşitdiyini, sahibi olduğunu və idarə etdiyini qəbul edir.",
      "İki cür dua bir yerdə cərəyan edir: Məsələ duası, Allahdan bir şey istəmək və dua, zikr və itaət yolu ilə Ona ibadət etmək və ibadət etmək – çünki hər bir ibadət mahiyyət etibarı ilə Onun qəbulu və mükafatını səssizcə diləməkdir. Buna görə də Allahdan başqasına dua etmək şirkdir: yalnız Ona məxsus olanı başqasına verir.",
      "Mömin asanlıqda da, çətinlikdə də, ucadan və gizlində dua edər ki, Allah hər çağırışı eşidir və səmimi olanı əliboş döndərməz. O, o qədər yaxındır ki, “Dəvətçinin çağırışına Məni çağırdığı zaman cavab verirəm” deyir.",
      "Cavab Peyğəmbərin (sallallahu aleyhi və səlləm) öyrətdiyi üç formadan birini alır: Allah soruşulanı verir; ya da onu saxlayar və axirət üçün ona bərabər və ya daha çox mükafat qoyar. ya da ona bərabər olan bir zərəri dəf edər. Beləliklə, heç bir səmimi dua heç vaxt cavabsız qalmır - bəzən ən böyük mərhəmət bizim görmədiyimiz cavabdır.",
    ],
    quran: [
      {
        excerpt: "Rəbbiniz buyurur: “Mənə dua edin. Mən sizə cavab verəcəyəm”.",
      },
      {
        excerpt:
          "Bəndələrim səndən Mənim barəmdə soruşduqda, həqiqətən, Mən yaxınam. Mənə dua edənin çağırışına cavab verirəm.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dua ibadətdir. – sonra o, (sallallahu aleyhi və səlləm) oxudu: “Rəbbin dedi: “Mənə dua et! Mən sizə cavab verəcəyəm”. (ən-Numan ibn Bəşir)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Dua ədəbləri",
    summary: "Həmdlə başlayın, salavat göndərin, səmimi diləyin və əsla təslim olmayın.",
    body: [
      'Duanın Peyğəmbərin (sallallahu aleyhi və səlləm) öyrətdiyi və örnək aldığı bir ədəb (ədəb) var və ona riayət etmək qəbul olunma ehtimalını artırır. Allahı gözəl adları ilə həmd etməklə başlayın, sonra Peyğəmbərə salavat göndərin - o, namaz qılan hər ikisini yerinə yetirənə qədər duanın "dayandırıldığını" öyrətdi - və yalnız bundan sonra istəyinizi bildirin.',
      "Allahı üç batini xüsusiyyətlə çağırın: təvazökarlıq, Onun qadir və cavab verəcəyinə əminlik və Onun barəsində xoş fikirdə olmaq (hüsnül-zənn). Bacardığınız yerdə qibləyə üz tutun, əllərinizi qaldırın, mübarək vaxtları seçin və həm dünya, həm də axirət işlərini istəyin. Mühüm xahişləri təkrarlamaq və başladığınız kimi bitirmək tövsiyə olunur - həmd və salavat.",
      "Hər şeydən əvvəl tələsməyin. Peyğəmbər (sallallahu aleyhi və səlləm) xəbərdarlıq etmişdir ki, insan ümidini kəsib: “Zəng etdim, zəng etdim, amma cavab verilmədi” deməsi və sonra onu tərk etməsi şərtilə dua qəbul olunur. İstəməkdə israrlı olmağın özü ibadətdir və Allah qapısını döyən bəndəsini sevir.",
    ],
    hadith: [
      {
        excerpt:
          "Nökərin duası tələsik deyil, “dua etdim, amma qəbul olunmadı” dediyi müddətcə qəbul olunmağa davam edir. (Əbu Hureyrə)",
      },
      {
        excerpt:
          "Sizlərdən biriniz namaz qılarkən Rəbbinə həmd və şükür etməklə başlasın, sonra Peyğəmbərə salavat göndərsin, sonra istədiyini diləsin. (Fədalə ibn Ubeyd)",
      },
    ],
    actions: [
      "Hər duanı Əlhəmdulillah və Peyğəmbərə salavat ilə açın.",
      "Ehtiyacınıza ən uyğun olan adlarla Allahdan (məsələn, ruzi üçün Ya Rəzzaq, bağışlanma üçün Ya Qafur) dua edin.",
      "Duanı gündəlik vərdiş halına salın - hər namazdan sonra, səcdədə və yatmazdan əvvəl.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qəbul edilən duanın şərtləri",
    summary: "İxlas, halal qazanc, günahdan dönmək cavab qapılarını açır.",
    body: [
      "Duanın qəbul olub-olmamasına ədəbdən başqa bəzi şərtlər güclü təsir göstərir. Bunlardan birincisi ixlasdır - özünü göstərmədən və Ondan başqasını çağırmadan yalnız Allaha ixlasdır. Duada həqiqətən mövcud olan ürək mexaniki oxuyan dildən daha dəyərlidir.",
      "Halal ruzi güclü açardır. Peyğəmbər (s) əllərini göyə qaldıraraq “Ya Rəbbim, ya Rəbbim” deyə fəryad edən bir müsafiri vəsf edir ki, “Onun yeməyi haram, içməsi haram, paltarı haram və haramdan qidalanır, ona necə cavab vermək olar?” Gəliri qorumaq, günahdan tövbə etmək, heç bir günah istəməmək, qohumluq əlaqələrini kəsmək dua ilə onun qəbulu arasındakı maneələri aradan qaldırar.",
      "Buna baxmayaraq, qəbul, nəticədə Allahın rəhmətidir, nəzarət etdiyimiz bir alış-veriş deyil. Buna görə də mömin bütün səylərini - səmimiyyəti, halal yaşayışı, tövbəni - təvazökar təvəkküllə birləşdirər və cavab gecikərsə, heç vaxt ümidini kəsməz. Zəiflik və keçmiş günahlar soruşmağı dayandırmaq üçün səbəb deyil; Onlar Rəhmana dönmək üçün daha çox səbəbdir.",
    ],
    hadith: [
      {
        excerpt:
          "…onun yeməyi haramdır, içkisi haramdır, paltarı haramdır, haramdan qidalanır – ona necə cavab vermək olar? (Əbu Hureyrə)",
      },
      {
        excerpt:
          "Bəndənin duası o qədər qəbul olunur ki, günah bir şey istəməsin və qohumluq əlaqələrinin kəsilməsini istəməsin. (Əbu Hureyrə)",
      },
    ],
    actions: [
      "Gəlir və xərcləmələrinizi halallıq üçün nəzərdən keçirin - bu birbaşa duanıza təsir edir.",
      "Uzun duanı istiğfar və səmimi tövbə ilə qabaqlayın.",
      "Zərər, günah və ya haqsızlıq istəmək üçün heç vaxt dua etməyin.",
    ],
  },
  {
    title: "Dua üçün ən yaxşı vaxtlar və yerlər",
    summary: "Bəzi məqamlar duanın qəbul olması üçün xüsusilə mübarəkdir.",
    body: [
      "Dua istənilən vaxt qəbul olunduğu halda, Peyğəmbər ﷺ bəzi məqamları və qəbulun ən çox ümid edildiyi məqamları qeyd etmişdir. Yalnız böhran gözləməkdənsə, istəklərinizi bunlara bağlayın.",
      "Ən güclüləri bunlardır: gecənin son üçdə bir hissəsi, Allah (əziyyətinə yaraşan şəkildə) ən aşağı səmaya enib: “Kim Məndən istəyər ki, ona verim?” deyə çağırdığı zaman; namazda səcdə, Allaha ən yaxın məqam; azanla iqamə arasındakı an; insan oruc tutarkən, xüsusən də iftar vaxtı; yağış zamanı; və günəş batmazdan əvvəl cümə gününün son saatı, orada duanın rədd edilmədiyi bir saat var.",
      "Mübarək yerlərə və hallara həcc zamanı Ərəfədə ayaq üstə durmaq, hərəmlərdə olmaq, müsafirin, valideynin övladı və zülmə məruz qalanın duası daxildir. Davamlı bir yalvarış ömrü üçün bunları sabit lövbər kimi istifadə edin.",
    ],
    hadith: [
      {
        excerpt:
          "Rəbbimiz hər gecə gecənin son üçdə birində ən aşağı səmaya enir və deyir: Məni çağıran kimdir ki, ona cavab verim? Məndən kim istəyir ki, ona verim? (Əbu Hureyrə)",
      },
      {
        excerpt:
          "Bir qulun Rəbbinə ən yaxını səcdə halında olar, ona görə də orada çoxlu dua et. (Əbu Hureyrə)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Səhər və axşam adhkar",
    summary: 'Gündəlik "müsəlman qalası" - günün hər iki ucunda qorunma və əlaqə.',
    body: [
      "Səhər və axşam zikrləri sünnədə ən çox vurğulanan gündəlik zikrlərdəndir - möminin hər günün əvvəlində və sonunda yenilədiyi mənəvi qala. Allah möminlərə buyurur: “Allahı çox zikr edin və səhər-axşam Onu təsbih edin” (33:41-42).",
      "Ardıcıl oxunanlar, şeytanın vəsvəsələrindən və zərərlərindən qoruyur, Allaha təvəkkül edir (təvəkkül) və günün dəyişən şərtlərində qəlbi Ona bağlı saxlayırlar. Ən vaciblərindən ikisi aşağıdadır; tətbiqin adhkar kolleksiyası tam dəsti daşıyır.",
    ],
    phrases: [
      {
        title: "Seyid əl-İstiğfar (bağışlanma diləyənlərin başçısı)",
        when: "Hər səhər və axşam bir dəfə",
        translation:
          "İlahi, Sən mənim Rəbbimsən. Səndən başqa tanrı yoxdur. Məni Sən yaratdın və mən Sənin qulunam və bacardığım qədər Sənin əhdinə və əhdinə sadiqəm. Etdiyim pislikdən Sənə sığınıram. Mən Sənin mənə olan nemətini etiraf edirəm və günahımı etiraf edirəm, məni bağışla, çünki günahları Səndən başqa heç kəs bağışlamaz.",
      },
      {
        title: "Həsbiyəllahu lə ilahə illə huva",
        when: "Hər səhər və axşam yeddi dəfə",
        translation:
          "Allah mənə kifayətdir. Ondan başqa tanrı yoxdur. Mən Ona təvəkkül edirəm və O, Böyük Ərşin Rəbbidir.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Oyandıqdan sonra və yatmazdan əvvəl",
    summary: "Günün ilk və son sözlərinizi Allahla əlaqə saxlayın.",
    body: [
      'Peyğəmbər (s) oyanmaq və uzanmaq üçün xüsusi zikrlər öyrətdi ki, möminin hər gün ilk şüurlu sözləri şükür, sonuncusu isə təslim olmaqdır. O öyrətdi ki, yuxu "kiçik ölüm", oyanmaq isə kiçik bir dirilişdir - buna görə də adhkar bütün dövranı Allahı dərk etmək üçün çərçivəyə salır.',
      "Onları mütəmadi olaraq oxumaq mənəvi sabitlik yaradır: oyanarkən şükür etmək və yuxudan əvvəl ruhu Allaha tapşırmaq rutinidir. Həzrət Peyğəmbər (s) yatmazdan əvvəl xüsusilə Ayətül-Kürsini oxumağa təşviq etmiş və söz vermişdi ki, qiraət edənin yanında Allah tərəfindən bir vəli qalacaq və səhərə qədər heç bir şeytan yaxınlaşmayacaq.",
    ],
    phrases: [
      {
        title: "Oyanarkən dua",
        when: "Dərhal oyanan kimi",
        translation:
          "Bizi öldürdükdən sonra dirildən Allaha həmd olsun və dirilmək də Ona məxsusdur.",
      },
      {
        title: "Yatmazdan qabaq dua",
        when: "Yatmaq üçün uzanarkən",
        translation: "Sənin adınla, ey Allah, mən ölürəm və yaşayıram.",
      },
      {
        title: "Ayət əl-Kursi yatmazdan əvvəl",
        when: "Yatmadan əvvəl",
        translation:
          "Allah – Ondan başqa heç bir tanrı yoxdur, diridir, hər şeyə ruzi verəndir. Onu nə yuxululuq, nə də yuxu tutar. Göylərdə və yerdə nə varsa, Onundur. Onun izni olmadan Onun yanında kim şəfaət edə bilər? O, onların önlərində və arxalarında olanı bilir. Onun ərşi göyləri və yeri əhatə edir və onları qoruyub saxlamaq Onu yormaz. O, ən ucadır, əzəmətlidir.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ev və məscid duaları",
    summary: "Evinizə və məscidə girərkən və çıxarkən zikr edin.",
    body: [
      "Həzrət Peyğəmbər (s) qısa duaları həyatın məişət həddlərinə bağlamışdır. Evdən çıxarkən və evə girərkən Allahın adını zikr etmək mühafizə və bərəkət gətirir, qapını şeytanın üzünə bağlayır; O öyrətdi ki, bir şəxs Allahı zikr edərək içəri girəndə şeytan öz yoldaşlarına deyir: “Sizin burada gecələməyə yeriniz yoxdur”.",
      "Məscidin öz ədəb-ərkanı var: sağ ayaqla rəhmət qapılarını diləməklə daxil olmaq, sol ayaqla Allahdan lütf diləməklə çıxmaq – məscidin Allah qarşısında rəhmət, nizam-intizam və təvazökarlıq yeri olduğunu xatırladır.",
    ],
    phrases: [
      {
        title: "Evdən çıxarkən dua",
        when: "Evdən bayıra çıxanda",
        translation:
          "Allahın adı ilə; Mən Allaha təvəkkül edirəm. Allahdan başqa heç bir qüdrət və qüdrət yoxdur.",
      },
      {
        title: "Məscidə girən dua",
        when: "Girərkən, sağ ayaqla içəri girmək",
        translation: "İlahi, rəhmət qapılarını üzümə aç.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yemək və içmək üçün dualar",
    summary: "Hər yeməyə bərəkət və şükür gətirən qısa adhkar.",
    body: [
      "İslam adi yemək yeməyi zikr vasitəsilə ibadətə çevirir. Bərəkətə dəvət edən və şeytanın yeməyi bölüşməkdən çəkindirən “Bismillah” ilə başlayın və gündə bir neçə dəfə qəlbi şükür və şükürlə tərbiyə edərək Allaha həmd ilə bitirin.",
      "Sünnə hətta unutqanlığın islahını da nəzərdə tutur: əgər başlanğıcda “Bismillah” deməyi unutsan, yadına düşəndə ​​“Bismillahi əvvalahu və axirəhu” deyin (Əvvəlində və sonunda Allahın adı ilə).",
    ],
    phrases: [
      {
        title: "Yeməkdən əvvəl",
        when: "Yeməyin əvvəlində",
        translation: "Allahın adı ilə.",
      },
      {
        title: "Yeməkdən sonra",
        when: "Yeməyi bitirərkən",
        translation:
          "Həmd olsun Allaha ki, bunu mənə yedizdirən və heç bir qüvvəm və qüdrətim olmadan onu mənə ruziləndirən.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Dəstəmaz və namaz ətrafında dualar",
    summary: "Dəstəmazdan əvvəl və sonra edilən dualar və namazın özündə.",
    body: [
      "Dəstəmaz və namaz qəbul edilən zikr üçün ən böyük gündəlik açılışdır, buna görə də Sünnə onları dua ilə doldurur. Dəstəmazı iman şəhadəti ilə tamamlamaq behiştin səkkiz qapısını açır; və namazın içində - səcdədə və son salamdan dərhal əvvəl - mömin gününün ən çox qəbul edilən anlarından ikisidir.",
      "Bu anlar üçün həqiqi ifadələri öyrənmək ritual hərəkətləri Allahla şüurlu söhbətə çevirir.",
    ],
    phrases: [
      {
        title: "Dəstəmazdan sonra",
        when: "Dəstəmaz aldıqdan dərhal sonra",
        translation:
          "Şəhadət verirəm ki, Allahdan başqa ilah yoxdur, şəriki yoxdur və şəhadət edirəm ki, Məhəmməd Onun qulu və Rəsuludur.",
      },
      {
        title: "Namazda salamdan əvvəl",
        when: "Son təşəhhüddə, namazı bitirməzdən əvvəl",
        translation:
          "Allahım, cəhənnəm əzabından, qəbir əzabından, həyat və ölümün fitnəsindən və yalançı Məsihin (Dəccalın) fitnəsinin şərindən Sənə sığınıram.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Azan və iqamə üçün dua",
    summary: "Dəvətə cavab ver, Allahdan Peyğəmbərin məqamını istə, sonra dua et.",
    body: [
      "Azan deyildikdə, müəzzindən sonra sünnət təkrar etmək, sonra Peyğəmbərə salavat göndərmək, sonra Allahdan ona əl-Vəsilə verməsini istəmək üçün dua oxumaqdır - Peyğəmbər (s) kim bunu edərsə, şəfaətini vəd etmişdir.",
      "Azanla iqamə arasındakı pəncərə şəxsi dua üçün qəbul edilən vaxtlardandır; Peyğəmbər (sallallahu aleyhi və səlləm) dedi ki, o zaman edilən dua geri çevrilməz, ona görə də Allahdan öz ehtiyaclarını istəmək üçün istifadə et.",
    ],
    phrases: [
      {
        title: "Azandan sonra dua",
        when: "Azan bitdikdə",
        translation:
          "Ey bu mükəmməl çağırışın və sabit namazın Rəbbi olan Allahım, Muhəmmədül-Vəsilə və Fadiləni nəsib et və onu vəd etdiyin həmd məqamına yüksəlt.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Azanla iqamə arasında edilən dua rədd edilməz. (Ənəs ibn Malik; həmçinin ət-Tirmizi 212)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Narahatlıq və kədər",
    summary: "Qəlbi təvəkkül və Peyğəmbərin (sallallahu aleyhi və səlləm) öz duaları ilə bağlayın.",
    body: [
      "İslam çətinliyi əməli mənəvi vasitələrlə qarşılayır: dua, zikr, dua və Allahın hökmünə təvəkkül. Özü də qəm-qüssə və çətinliklə üzləşən Peyğəmbər (s) narahat (hamm), hüzn (hazan) və qorxu üçün dəqiq duaları - qəlbi problemdən onu idarə edənə yönəldən sözlər öyrətdi.",
      "Bu dualar qanuni vasitələrlə, o cümlədən lazım olduqda tibbi və ya peşəkar qayğı ilə kömək istəməyi əvəz etmir. Əksinə, o vasitələrlə yanaşı qəlbi də gücləndirir, möminə son kafiliyin yalnız Allaha aid olduğunu xatırladır.",
    ],
    phrases: [
      {
        title: "Narahatlıq və kədər üçün dua",
        when: "Kədər, narahatlıq və ya hədsiz kədər içində",
        translation:
          "İlahi, narahatçılıq və qəm-qüssədən, acizlik və tənbəllikdən, xəsislik və qorxaqlıqdan, borc yükündən və başqalarının üstünə düşməkdən Sənə sığınıram.",
      },
      {
        title: "Allah bizə kifayətdir",
        when: "Qorxduqda və ya əsəbləşdikdə",
        translation: "Allah bizə kifayətdir və O, ən yaxşı vəkildir.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Xəstəlik və qorxu",
    summary: "Halal müalicə vasitələrindən istifadə edərək Allahdan şəfa diləyin.",
    body: [
      "Sünnə dua ilə müalicəni birləşdirir: Peyğəmbər ﷺ “Hər bir dərdin dərmanı var” deyə öyrətdi və müalicə axtarmağı əmr etdi, eyni zamanda ruqyə ilə – Qur'an oxumaq və xəstələrə səhih dualar etməklə qəlbləri və bədənləri sağaltdı. Mömin hər ikisini edir: dərmanı alır və Şəfa verənə üz tutur.",
      "Fəal səbəbin adı vacibdir: Allah əş-Şafidir, şəfa verəndir, dərman isə Onun yaratdığı bir vasitədir. Qorxu içində də qəlb, əmin-amanlıq və möhkəmlik üçün Ona üz tutur, çünki əmin-amanlıq yalnız Odur.",
    ],
    phrases: [
      {
        title: "Şəfa üçün dua",
        when: "Xəstə olanda və ya xəstə olan biri üçün dua edərkən",
        translation:
          "Ey insanların Rəbbi olan Allah, dərdi aradan qaldır və şəfa ver. Sən şəfa verənsən! Səndən başqa əlac yoxdur – heç bir xəstəlik qoymayan bir dərman.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Bağışlama və hidayət",
    summary: "Daim bağışlanma, səbir və doğru hidayət dilə.",
    body: [
      "İstiğfar böyük günahlardan sonra deyil, möminin gündəlik ritmidir. Artıq bağışlanmış Peyğəmbər (salləllahu aleyhi və səlləm) gündə yetmiş dəfədən çox Allahdan bağışlanma diləyir, ürəyin daimi cilalanmasına ehtiyacı olduğunu öyrədirdi.",
      "Rəhbərlik də birdəfəlik deyil, davamlı ehtiyacdır. Hətta möhkəm möminlər də Allahdan onların qəlblərini sabit tutmasını diləyirlər, çünki qəlblər dönür və onları döndərən də Allahdır. Peyğəmbər (sallallahu aleyhi və səlləm) dində möhkəmlənən qəlb üçün çox dua edərdi.",
    ],
    phrases: [
      {
        title: "Tez-tez tövbə etmək",
        when: "Gün ərzində təkrar-təkrar",
        translation: "Mən Allahdan bağışlanma diləyirəm və Ona tövbə edirəm.",
      },
      {
        title: "Möhkəm ürək üçün dua",
        when: "Azğınlıqdan və ya tərəddüddən qorxduqda",
        translation: "Ey qəlbləri döndərən, qəlbimi öz dinində sabit et.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Səyahət və yağış duaları",
    summary: "Yola çıxmaq üçün dualar və yağışın rəhməti üçün.",
    body: [
      "Səyahət həm zəiflik, həm də qəbul edilən bir vəziyyətdir - Peyğəmbər (sallallahu aleyhi və səlləm) müsafirin duasının qəbul olunduğunu öyrətdi və Allahın qüdrətini və Ona qayıdışımızı təsdiq edən nəqliyyat vasitəsinə minmək və yola düşmək üçün dua etdi.",
      "Yağış Allahdan nazil olan bir rəhmətdir, yağdığı an isə dua vaxtıdır. Peyğəmbər (s) yağışı qısa bir dua ilə qarşılayaraq, onun zərərə deyil, faydalı olmasını xahiş edərdi.",
    ],
    phrases: [
      {
        title: "Səfərə çıxarkən dua",
        when: "Nəqliyyatınızı qurarkən və yola salınarkən",
        translation:
          "Biz özümüz bunu edə bilmədiyimiz halda, bunu bizə tabe edən Allah pakdır. Həqiqətən, biz Rəbbimizin hüzuruna qayıdacağıq.",
      },
      {
        title: "Yağış yağanda dua",
        when: "Yağışın əvvəlində",
        translation: "Allahım, onu faydalı leysan et.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Təminat və ailə",
    summary: "Allahdan halal ruzi və evdə yaxşılıq dilə.",
    body: [
      "Ruzi ancaq Allahdandır. mömin dəvəsini - işləyib qazanaraq - bağlayır, sonra isə ruzi verəndən halal ruzi, qazandıqlarının bərəkətini, borcdan azad olmasını və başqalarına möhtac olmaqdan azad olmasını istəyir. Həzrət Peyğəmbər (s) məhz bunu tələb edən gözəl bir dua öyrətdi.",
      "Ev üçün Qur'anın özü salehlərin duasını öyrədir: “gözlərə rahatlıq” olan həyat yoldaşları və övladlar bəxş etmək, iman, dua və mərhəmətlə birləşmiş ailəyə rəhbərlik etmək.",
    ],
    quran: [
      {
        excerpt:
          "Ey Rəbbimiz, bizə zövcələrimizdən və övladlarımızdan gözümüzə nur bəxş et və bizi müttəqilərə rəhbər et.",
      },
    ],
    phrases: [
      {
        title: "Qanuni təminat üçün dua",
        when: "Səhərlər, namazdan sonra və maddi sıxıntıda",
        translation:
          "İlahi, haram etdiyin halal etdiyinlə mənə kifayət et və Öz lütfünlə məni zəngin et ki, Səndən başqasına ehtiyacım olmasın.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Qur'an duaları",
    summary: "Quranda Allahın Özünün öyrətdiyi dualar.",
    body: [
      "Qur'an duaları, Allahın peyğəmbərlərin və möminlərin dillərinə yerləşdirdiyi, sonra bizim təkrarlamağımız üçün qorunub saxlandığı, qısa, əhatəli və təkmilləşdirilməsi mümkün olmayan sözlərdir. Bir çoxları “Rəbbana” (Rəbbimiz) ilə başlayır və onlar əzbərləmək və daimi oxumaq üçün idealdır.",
      "Onların arasında möminin bütün ehtiyaclarını əhatə edir: bağışlanma, hidayət, səbir, mərhəmət, saleh ailə, cəhənnəm odundan qorunma və hər iki dünya uğuru. Allahın öz sözü ilə dua etmək duanın ən etibarlı formalarındandır.",
    ],
    phrases: [
      {
        title: "Hər iki dünyada xeyir",
        when: "Ümumi, çox məqsədli dua - Peyğəmbərin (sallallahu aleyhi və səlləm) ən çox etdiyi dua",
        translation:
          "Ey Rəbbimiz, bizə dünyada da, axirətdə də yaxşılıq ver və bizi cəhənnəm əzabından qoru!",
      },
      {
        title: "İmanda sabitlik",
        when: "Yayılmadan qorxduqda və ya hidayət olunduqdan sonra",
        translation:
          "Ey Rəbbimiz, bizi doğru yola yönəltdikdən sonra qəlblərimizi azdırma və bizə Öz tərəfindən mərhəmət bəxş et. Həqiqətən, Sən bəxş edənsən.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Peyğəmbər duaları",
    summary: "Həzrət Məhəmmədin (sallallahu aleyhi və səlləm) öyrətdiyi dualar.",
    body: [
      'Peyğəmbərə (sallallahu aleyhi və səlləm) "ən geniş nitq" (cəvami\'ül-kəlim) verilmişdir və onun duaları da bunu əks etdirir: sözlə qısa, mənaca geniş və dünya ilə axirət həyatının ehtiyacları arasında mükəmməl tarazlıq. Onlar hidayət, qəlbin təmizliyi, sağlamlıq, bağışlanma, qorunma və gözəl əxlaq diləyirlər.',
      "Əsas prinsip: etibarlı kolleksiyalardan orijinal, yaxşı təsdiqlənmiş dualara riayət edin və ixtira edilmiş mükafatlarla zəif və ya uydurma duaları yaymaqdan çəkinin. Sünnənin həqiqi xəzinəsi artıq kifayətdir.",
    ],
    phrases: [
      {
        title: "Dördün hərtərəfli duası",
        when: "Ümumi gündəlik dua",
        translation: "İlahi, Səndən hidayət, təqva, iffət və kifayətlənmək istəyirəm.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Zikr və təsbih",
    summary: "Böyük çəki və mükafatın qısa xatirələri.",
    body: [
      "Zikr — Allahı zikr etmək — təsbeh (SubhanAllah), təhmid (Əlhəmdulillah), təhlil (Lə iləhə illəllah), təkbir (Allahu Əkbər) və istiğfardan ibarətdir. Bunlar dildə ən yüngül, lakin tərəzinin ən ağır kəlmələrindəndir və canlı qəlbin qəflətdən müdafiəsidir.",
      "Həzrət Peyğəmbər (s) “Dildə yüngül, tərəzidə ağır, Rəhmana sevimli” ifadələrini vəsf etmiş və öyrətmişdir ki, hər kim gündə yüz dəfə “Subhanallahi və bihəmdih” desə, dəniz köpüyü kimi olsa da, günahları silinər. Namazdan sonra və gün boyu tutulan zikr imanı diri tutar.",
    ],
    phrases: [
      {
        title: "Sevimli və günahları silən sözlər",
        when: "Gün ərzində; 100 dəfə günahları silir",
        translation: "Allah pakdır, həmd Ona məxsusdur.",
      },
      {
        title: "Tərəzidə ağır olan iki söz",
        when: "İstənilən vaxt",
        translation: "Allah pakdır, həmd Ona məxsusdur. Böyük Allaha həmd olsun.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Peyğəmbərə salavat",
    summary: "Peyğəmbərə salavat göndərmək gündəlik rəhmət çeşməsidir.",
    body: [
      "Peyğəmbərə salavat göndərmək Quranda Allah tərəfindən buyurulur: “Həqiqətən, Allah və Onun mələkləri Peyğəmbərə salavat göndərirlər; Ey iman gətirənlər, ona salavat və salam göndərin” – və başqa heç bir dua belə zəmanətli qaytarılmır: Peyğəmbər (sallallahu aleyhi və səlləm) buyurmuşdur ki, kim ona bir salavat göndərərsə, Allah ona on salavat göndərər.",
      "Tez-tez salavat oxumaq rəhmət gətirir, dərəcələri yüksəldir, günahları silir və insanı Qiyamət günü Peyğəmbərə (s) ən yaxınlaşdırır. Aşağıdakı tam İbrahim forması - səhabələrindən ona necə salavat göndəriləcəyini soruşduqda öyrətdiyi forma - hər duanın təşəhhüdlərində oxunur və gün ərzində dildə saxlamaq üçün əladır.",
    ],
    quran: [
      {
        excerpt:
          "Həqiqətən, Allah və Onun mələkləri Peyğəmbərə salavat göndərirlər. Ey iman gətirənlər, ona salavat və salam göndərin.",
      },
    ],
    phrases: [
      {
        title: "Tam Salavat İbrahimiyyə",
        when: "Namazın təşəhhüdündə və gün boyu",
        translation:
          "İlahi, İbrahimə və İbrahimin ailəsinə bərəkət verdiyin kimi, Muhəmməd və Muhəmmədin ailəsinə salavat göndər. Həqiqətən, Sən tərifəlayiqsən, izzətlisən! İlahi! Həqiqətən, Sən tərifəlayiqsən, izzətlisən!",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Mənbələr və həqiqilik",
    summary: "Qurana və açıq sitat gətirərək səhih hədislərə üstünlük verin.",
    body: [
      "Bu modul maarifləndirici və tərəfsizdir, tamamilə Qur'an və geniş şəkildə qəbul edilmiş səhih (səhih/həsən) hədislər üzərində qurulub, hər birində izlənilə bilən istinad var. Gündəlik dualar üçün qızıl standart məhz budur: məlum mənbə ilə təsdiqlənmiş mətn.",
      "Dua üçün ciddi bir xəbərdarlıq var: bir çox dualar uydurulmuş sözlər və şişirdilmiş mükafatlarla onlayn olaraq yayılır (“bunu oxu və bütün günahların yox olur”). Uydurma hədislər ciddi məsələdir, ona görə də onu qəbul etməzdən və ya göndərməzdən əvvəl tanış olmayan rəvayətləri yoxlayın.",
      "Əzbərləmək və gündəlik məşq etmək üçün tərk edəcəyiniz uzun dualardansa, həqiqətən davam etdirə biləcəyiniz qısa, həqiqi dualara üstünlük verin - ardıcıllıq Allah üçün həcmdən daha sevimlidir. Məktəblərin sözləri fərqli olduğu yerlərdə ixtisaslı yerli alimdən öyrənin.",
    ],
    actions: [
      "Hər hansı bir tanımadığı duanın mənbəyini paylaşmadan əvvəl onu yoxlayın.",
      "Bir neçə qısa orijinal dua seçin və onları davam etdirə bilməyəcəyiniz bir çox duadansa gündəlik saxlayın.",
      "Hər dərsi real təcrübə ilə əlaqələndirmək üçün proqramın mövzu bağlantılarından istifadə edin.",
    ],
    disclaimer:
      "Təhsil məzmunu fərdiləşdirilmiş fiqhi məsləhətləri əvəz etmir. Müəyyən işlərə dair hökmlər üçün ixtisaslı alimlərdən soruşun.",
    appLinks: [{}, {}, {}, {}],
  },
];

export const LEARN_DUA_OCCASIONS_AZ: DeepPartial<LearnDuaOccasion>[] = [
  {
    title: "Səhər mübarək",
    summary: "Günə xatırlama ilə başlayın",
  },
  {
    title: "Axşam mübarək",
    summary: "Gecədən əvvəl qorunma",
  },
  {
    title: "Oyandıqdan sonra",
    summary: "Oyanan kimi ilk sözlər",
  },
  {
    title: "Yuxudan əvvəl",
    summary: "Gecə üçün dua və zikr",
  },
  {
    title: "Evə girmək",
    summary: "Bismillah və salam",
  },
  {
    title: "Evdən çıxmaq",
    summary: "Çölə çıxarkən təvəkkül",
  },
  {
    title: "Məscid",
    summary: "Məscidə girmək və çıxmaq",
  },
  {
    title: "Yeməkdən əvvəl və sonra",
    summary: "Yeməkdə minnətdarlıq",
  },
  {
    title: "Dəstəmaz",
    summary: "Dəstəmazdan əvvəl və sonra",
  },
  {
    title: "Namaz",
    summary: "Namazdan əvvəl, namaz zamanı və sonra",
  },
  {
    title: "Narahatlıq və narahatlıq",
    summary: "Dua ilə qəlbi sakitləşdir",
  },
  {
    title: "Xəstəlik",
    summary: "Şəfa və səbir",
  },
  {
    title: "bağışlanma",
    summary: "İstiğfar və tövbə",
  },
  {
    title: "Səyahət",
    summary: "Yola düşmək və qayıtmaq",
  },
  {
    title: "Təminat",
    summary: "Allahdan halal rizq istəmək",
  },
  {
    title: "Qur'an duaları",
    summary: "Allahın kitabından dualar",
  },
];
