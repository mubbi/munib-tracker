import type { PilgrimageChecklistItem } from "../../types/hajj-guide";
import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// KK overlay for Hajj & Umrah Learn topics + rite checklists.
// Index-aligned with English sources; only human-readable text is translated.

export const HAJJ_GUIDE_TOPICS_KK: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Қабылданған haj сыйлығы",
    summary: "Haj mabrur күнәларды жояды, сыйлығы — жәннат.",
    body: [
      "Абу Хурайра Пайғамбар ﷺ былай дегенін хабарлады: «Кім Аллаһ үшін haj жасап, жыныстық қатынас пен күнәдан сақталса, анасы оны туған күніндегідей қайтарады» (Sahih al-Bukhari 1521; Sahih Muslim 1350).",
      "Ол сондай-ақ: «Қабылданған haj (haj mabrur) сыйлығы жәннаттан басқа ештеңе емес» (Sahih al-Bukhari 1773; Sahih Muslim 1349). Қабылдану шын ниет пен haj-ты ар-ождан және күнәдан сақтаумен байланысты — тек сыртқы рәсімдерді орындаумен емес.",
    ],
    hadith: [
      {
        excerpt:
          "Кім Аллаһ үшін haj жасап, жыныстық қатынас пен күнәдан сақталса, анасы оны туған күніндегідей қайтарады.",
      },
      {
        excerpt:
          "Кім Аллаһ үшін haj жасап, жыныстық қатынас пен күнәдан сақталса, анасы оны туған күніндегідей қайтарады.",
      },
      { excerpt: "Қабылданған haj сыйлығы жәннаттан басқа ештеңе емес." },
      { excerpt: "Қабылданған haj сыйлығы жәннаттан басқа ештеңе емес." },
    ],
    actions: [
      "Haj-ты тек Аллаһ үшін ниет етіңіз — бүкіл сапар бойы тіліңіз бен мінезіңізді сақтаңыз.",
      "Қолданбадағы haj тізімін тек еске салу үшін пайдаланыңыз; жүрегіңізді қабылдануға бағытыңыз.",
    ],
    appLinks: [{ label: "Haj рәсімдері тізімі" }],
  },
  {
    title: "Umra ерекшeliği",
    summary: "Umra dan umra ga дейінгі күнәлар кешіріледі.",
    body: [
      "Абу Хурайра Пайғамбар ﷺ былай дегенін хабарлады: «Umra орындау алдыңғысынан кейінгі күнәларға кешірім, қабылданған haj сыйлығы жәннаттан басқа ештеңе емес» (Sahih al-Bukhari 1773; Sahih Muslim 1349).",
      "Umra жылдың кез келген уақытында орындалады. Haj dan qysqa, бірақ бәрібір үлкен ғибадат: ihram, tawaf, sa'y және bas qyru nemese qysqartu.",
    ],
    hadith: [
      {
        excerpt:
          "Umra орындау алдыңғысынан кейінгі күнәларға кешірім, қабылданған haj сыйлығы жәннаттан басқа ештеңе емес.",
      },
      {
        excerpt:
          "Umra орындау алдыңғысынан кейінгі күнәларға кешірім, қабылданған haj сыйлығы жәннаттан басқа ештеңе емес.",
      },
    ],
    actions: ["Рәсімдерді ретімен орындауға дайын болғанда umra тізімін ашыңыз."],
    appLinks: [{ label: "Umra рәсімдері тізімі" }],
  },
  {
    title: "Arofa күні",
    summary: "Arofada тұру haj-тың жүрегі — және dua үшін ұлы күн.",
    body: [
      "Абдуррахман ибн Я'mar Пайғамбар ﷺ былай дегенін хабарлады: «Haj — Arofa» (Sunan Abi Dawud 1949; Jami' at-Tirmidhi 889). Arofa шекарасында уақытында тұруды қалдырған сол жыл haj-ты қалдырған болады.",
      "Haj da bolmaǵandar үшін Arofa күнinde oraza tutu қатаң ұсынылады: Абу Катада хабарлағандай, Arofa oraza sy өткен және келесі жыл күнәларын кешіреді (Sahih Muslim 1162). Hojylar dua үшін күннің өзіне беріліп, oraza tutпayды.",
    ],
    hadith: [
      { excerpt: "Haj — Arofa." },
      { excerpt: "Haj — Arofa." },
      {
        excerpt:
          "Arofa күнinde oraza tutu — Аллаhtan өткен және келесі жыл күнәларын кешіру деп үміттенемін.",
      },
    ],
  },
  {
    title: "Haj — бесінші rukn",
    summary: "Өмірінде bir ret әр qabiletli musylmanǵa farz.",
    body: [
      "Алла Тағала айтады: «Адамдарға Үйден (Ka'ba) haj farz — jol taba alatyn ǵariz adam ushin. Kim kufr qylsa — Аллаh olamlardan g'oniy» (Qur'an 3:97).",
      "Адамдарға haj жарияланды: «Адамдарға haj жарияла; olar piyoda jəne har turli atlyq pen senge keledi; har uzaq jol boyy keledi» (Qur'an 22:27).",
      "Ибн Umar Пайғамбар ﷺ былай дегенін хабарлады: Ислам bes asasqa qurylǵan: shohodat, namaz, zakat, Ramazan orazaсы jəne qodir bolǵandar ushin Uyǵa haj (Sahih al-Bukhari 8; Sahih Muslim 16). Ғұламалар шарттар орындалғанда өмірде bir ret farz ekenine kelisti; qaitalau ixtiyariy fazilet.",
    ],
    quran: [
      { excerpt: "Адамдарға Үйden haj farz — jol taba alatyn ǵariz adam ushin..." },
      { excerpt: "Адамдарға haj жарияла; olar piyoda jəne har turli atlyq pen senge keledi..." },
    ],
    hadith: [
      {
        excerpt:
          "Ислам bes asasqa qurylǵan: Allahtan basqa ilah joq jəne Muhammad Allah Resuli, namaz oqu, zakat beru, Ramazan orazaсы jəne jol taba alatynlar ushin Uyǵa haj.",
      },
      { excerpt: "Ислам bes asasqa qurylǵan... jəne jol taba alatynlar ushin Uyǵa haj." },
    ],
  },
  {
    title: "Istitoat (qabilet)",
    summary: "Den saulyǵy, halal mol jəne qauipsiz jol — bularsyz haj azhe farz emes.",
    body: [
      "Qur'an 3:97 dagy shart istitoat. Klassik ulama bunu quyidaǵysha jamlaydy: saparǵa shydamdy jismen saulyq, sapar jəne joq uaqytta qaramagyndagylar ehtiyajtaryn qoptau ushin jetkilikti halal mol, jəne qauipsiz ashqy jol.",
      "Bul jyl bul imkoniyattardan ayrǵan keşiktiru ushin künәkor emes, qodir bolǵansha kutui mumkin. Istitoat jaǵday boyysha bahalanady — kesellik, tolanysy shart qarz nemese qauipsiz bolmaǵan sapar daraw farzdı alip tastausy mumkin. Jaǵdayyńyz aniq emes bolsa, malikeli alimnen surańyz.",
    ],
    quran: [{ excerpt: "...jol taba alatyn ǵariz adam ushin." }],
    actions: [
      "Bron qyludan buryn farz qarzdar toleń jəne qaramagyndagylar taminotyn tartipke salysyz.",
      "Paketterdi tek resmi arnalardy tekseriń (dayyndyq taqyryptaryna qarań).",
    ],
  },
  {
    title: "Әйeldiń haj sapary",
    summary:
      "Kopchilik mahram talap qylady; keibіr keiingi pikirler qauipsiz senimdi topǵa ruxsat beredi.",
    body: [
      "Ибн Abbas rivayat qylǵanynda, Payg'ambar ﷺ dedi: aiel mahramsyz sapar qylmasyn, erkek de mahram bolmaǵansha unyń uine kirmesin (Sahih al-Bukhari 1862; Sahih Muslim 1341). Kop ulama bunu haj jəne umra saparyna qoldanady.",
      "Keibіr keiingi ulama — qauipsizdik, zarurat jəne zamanaǵy transportty eske alǵan holda — mahram bolmaǵanda aielge farz haj ushin senimdi top qurylymynda sapar qyluǵa ruxsat beredi. Bul fiqh maselasynda bahsli.",
    ],
    hadith: [
      { excerpt: "Aiel mahramsyz sapar qylmasyn, erkek de mahram bolmaǵansha unyń uine kirmesin." },
      {
        excerpt:
          "Allah jəne Akhirat kunege iman keltirgen aielge bir kun jəne tun mahramsyz sapar qylu halal emes.",
      },
    ],
    madhhabNote:
      "Kopchilik aiel haj saparynda mahram kerek dep esepteydi. Keibіr keiingi ulama farz haj ushin qauipsiz aieler topy men saparǵa ruxsat beredi. Senimdi alim jəne haj idarasy qoidalaryna amal qylyńyz.",
  },
  {
    title: "Hajnyń ush turi",
    summary: "Ifrad, Qiran jəne Tamattu' — ihramǵa kirudin buryn turin tanysyz.",
    body: [
      "Ifrad: tek haj ushin ihram, sol ihramda alohida umra joq, rәsimderdi birlestiru tuyndy qurbanlyq talap qylunbady.",
      "Qiran: umra jəne hajdy bir ihramda birlestiru, haj tamam bolǵansha ihramda qalu. Qurbanlyq (hady) talap qylunady.",
      "Tamattu': haj aylarinda tolyq umra oryndau, ihramnan shyǵu, keyin 8 zul-hijjada haj ushin qaita ihram. Bugin kop hojylar bunu qylady; bul da hady talap qylady.",
      "Allah rәsimderdi birlestirgender turaly aytdy: «...Kim umradan hajǵa paydalanǵan bolsa, oson tabylatyn qurban hayvanlary...» taba almaǵandar hajda ush kun, qaytǵanda zheti kun oraza tutady (Qur'an 2:196).",
    ],
    quran: [
      {
        excerpt:
          "Haj jəne umrany Allah ushin tolyq oryndań... Kim umradan hajǵa paydalanǵan bolsa, oson tabylatyn qurban hayvanlary. Taba almaǵan — hajda ush kun, qaytqanyńyzda zheti kun oraza...",
      },
    ],
    actions: [
      "Miqatqa kelmeden buryn top basysy men turinizdi kesin qylsyńyz.",
      "Tamattu' qylsańyz, haj ushin qaita ihramǵa kirmeden buryn umrany tolyq oryndańyz.",
    ],
    appLinks: [{ label: "Umra tizimi" }, { label: "Haj tizimi" }],
  },
  {
    title: "Bes miqat",
    summary: "Haj nemese umra ushin ihram kirmesten Makkaǵa jol alǵan miqatty kesip otpeńiz.",
    body: [
      "Ibn Abbas rivayat qylǵanynda, Payg'ambar ﷺ adamlar ushin miqattardy belgiledi: Madina ushin Zul-Hulayfa, Sham ushin Al-Juhfa, Najd ushin Qarn al-Manazil, Yemen ushin Yalamlam; jəne Iraq ushin Zat 'Irq. Ol dedi: bular sol jerler ahalysy jəne olardan haj nemese umra niety men otetinder ushin; shekaralar ishinde turǵyndar qayerden jol alsa sol jerden ihram kiredi, hatto Makka ahalysy Makkadan (Sahih al-Bukhari 1524; Sahih Muslim 1181).",
      "Zamanaǵy aeroport jəne porttarda sáykes ihram nýktelesi nemese jariyalangan tartipter bar — tashuyshy jəne Haj jəne Umra vazirligi kórsetimderine amal qylyńyz, shekarany ihramsyz otpeńiz.",
    ],
    hadith: [
      {
        excerpt:
          "Rasulullah ﷺ Madina ahalysy ushin Zul-Hulayfa, Sham ahalysy ushin Al-Juhfa, Najd ahalysy ushin Qarn al-Manazil, Yemen ahalysy ushin Yalamlam belgiledi... Bul miqattar sol jerler jəne haj nemese umra niety men olardan otetinder ushin...",
      },
      {
        excerpt:
          "Rasulullah ﷺ miqattardy belgiledi... Shekaralar ishinde turǵyndar qayerden jol alsa sol jerden ihram kiredi...",
      },
    ],
  },
  {
    title: "Ihramǵa kiru",
    summary: "Ghusl, kiyim, niет jəne talbiya muqaddas jaǵdaydy baslaydy.",
    body: [
      "Ihram haj nemese umra niety men kirilatyn muqaddas jaǵday. Payg'ambar ﷺ ihramǵa kirudin buryn ghusl qyluǵa usynys etti. Erkekter eki tikilmegen aq mato kiyedi; aiel kadiri jabyq kiyimde qalady, betin japmady nemese ihram kiyimi retinde qol qapqochty kiyinbeydi (niqab jəne qol qapqochtary fiqh maselasy).",
      "Erkek ihramǵa kirudin buryn tanasyna atir surtui mumkin, jaǵdayǵa kirgennen keyin ihram matolaryna emes (Sahih al-Bukhari 1539). Keyin niет qylyń jəne talbiyany baslańyz.",
      "Payg'ambar ﷺ oǵytylǵan talbiya: «Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni'mata laka wal-mulk, la sharika lak» — umra tawafy baslangansha nemese hajda mashhur amal boyysha Jamrat al-Aqaba tas taslangansha (Sahih al-Bukhari 1549; Sahih Muslim 1184).",
    ],
    hadith: [
      { excerpt: "Aisha dedi: Men Rasulullah ﷺ ni ihramǵa kirudin buryn atir surtardym..." },
      {
        excerpt:
          "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni'mata laka wal-mulk, la sharika lak.",
      },
      { excerpt: "Payg'ambar ﷺ talbiyany baland dauys pen aytdy: Labbayk Allahumma labbayk..." },
    ],
    actions: [
      "Erkekter ushin keminde eki toplam ihram alyńyz; atirsiz taza quraldardy dayyndyńyz.",
      "Sapardan buryn talbiyany mashq qylyńyz, jolda oson aitu ushin.",
    ],
  },
  {
    title: "Ihram tyiymdary",
    summary: "Muhrim muqaddas jaǵdaydan shyǵansha nelerden saqtanuy kerek.",
    body: [
      "Ihramda quyidaǵylardan saqtańyz: erkekter — tikilgen mos kiyim jəne bas jabу; atir; bas nemese tirnaq kesu; jer hayvanyn ov qylu; nikah tuzu nemese otkizu; jynystyq qatynas. Aiel atir jəne basqa umumiy tyiymdardan saqtanady, jabyq kiyimde qalady.",
      "Tyiym buzylsa fidyа talap qylu mumkin — adette oraza, kambag'alardy tamaktandyru nemese qurbanlyq — qylǵan iske qarap. Mazhabtar tafsilotty farq qylady. Tyiymdarga qatyq riaya qylyńyz; kutilmegen jaǵday bolsa, malikeli jolbasshy surańyz.",
    ],
    actions: ["Ihramda atir, tirnaq qyrǵysh jəne qaychy qol astynda bolmasyn."],
    madhhabNote:
      "Buzylular jəne fidyа tizimderi mazhab boyysha farq qylady. Buldy amaliy eskertu retinde qabyldanyńyz, keyin mazhabyńyz nemese haj jolbasshyńyz ben tafsilotty rastanyńyz.",
  },
  {
    title: "Umra — ihram jəne talbiya",
    summary:
      "Miqatta nemese undan buryn muqaddas jaǵdayǵa kiriń, keyin Allah shaqyryǵyna zhauap bering.",
    body: [
      "Miqatta nemese undan buryn, mumkin bolsa ghusl qylyńyz, ihram kiyimin kiyiniz, umra niety qylyńyz jəne talbiyany baslańyz. Muqaddas jaǵday sol niет pen baslanady.",
      "Makkaǵa jol alǵanda tawaf baslangansha talbiyany zhii qaytalańyz. Bul Allah shaqyryǵyna zhoǵary zhauap beresiz dep bildiredi.",
    ],
    actions: ["Ǵariz rәsimdi oryndaganda belgileu ushin umra tizimin paidalanysyz."],
    appLinks: [{ label: "Umra tizimi" }],
  },
  {
    title: "Ka'ba tawafy",
    summary: "Qara Tosh burchagyndan baslap saǵat qaǵytyna qarsy zheti aylana.",
    body: [
      "Ka'bany zheti ret saǵat qaǵytyna qarsy aylanyńyz, Qara Tosh burchagyndan baslap jəne ayaqtap. Koptik bolsa busanǵyz, teginiz nemese takbir men korsetseńiz — Payg'ambar ﷺ amaline amal qylyp, basqalarǵa ziyan zhetkizbeńiz.",
      "Erkekter alǵashy ush aylanada raml (zhyldam qadam) jəne bul kelis umra tawafynda idtiba' (oń jelke ashqy) qylady, mashhur sunnat boyysha.",
      "Yaman burchagy men Qara Tosh arasynda aitilu usynylady: «Rabbimiz, bizge dunyada zhaqsylyq jəne akhiratda zhaqsylyq ber, do'zax azabyndan asra» (Qur'an 2:201).",
    ],
    quran: [
      {
        excerpt:
          "Rabbimiz, bizge dunyada zhaqsylyq jəne akhiratda zhaqsylyq ber, do'zax azabyndan asra.",
      },
    ],
  },
  {
    title: "Eki rakat jəne Zamzam",
    summary: "Mumkin bolsa Maqam Ibrahim artynda namaz oqyńyz, keyin Zamzam ishińiz.",
    body: [
      "Tawafdan keyin, oryn bolsa Maqam Ibrahim artynda eki rakat oqyńyz, koptik bolsa meshittin basqa jerinde — Allah sozine amal: «...Ey iman keltirgender, Ibrahim turǵan jerden namaz oqu jeri qylyń...» (Qur'an 2:125).",
      "Keyin Zamzam suyn ishińiz. Jabir Payg'ambar ﷺ haj tasvirinde tawafdan keyin Zamzam ishu bar; Payg'ambar ﷺ dedi Zamzam niет qylǵan narsa ushin ishiladi (keiingi ulama zhinaǵan sahih rivayatlar; niет jəne dua usynylady).",
    ],
    quran: [{ excerpt: "...Ey iman keltirgender, Ibrahim turǵan jerden namaz oqu jeri qylyń..." }],
  },
  {
    title: "Safa men Marwa arasynda sa'y",
    summary: "Hojar su izdeuine eske alǵan zheti saf.",
    body: [
      "Allah aytdy: «Albatta, Safa jəne Marwa Allah belgilerinin birі... Kim Uyǵa haj nemese umra qylsa — olar arasynda zhyruynda künә joq...» (Qur'an 2:158).",
      "Safa men Marwa arasynda zheti ret zhyryńyz, Safadan baslap. Safada Ka'baga qarap, Payg'ambar ﷺ qylǵanynda qollardy takbir jəne dua ushin kotaryńyz. Erkekter zhasyl belgiler arasynda zhygirady.",
    ],
    quran: [
      {
        excerpt:
          "Albatta, Safa jəne Marwa Allah belgilerinin birі. Kim Uyǵa haj nemese umra qylsa — olar arasynda zhyruynda künә joq...",
      },
    ],
  },
  {
    title: "Halq nemese taqsir — umrany ayaqtau",
    summary:
      "Erkekter qyryp alady nemese qysqartady; aieler barmak ushy qysqartady — keyin ihram ashylady.",
    body: [
      "Erkek basy halq qylady — Payg'ambar ﷺ ush ret dua qyldy — nemese teń qysqartady (taqsir). Aiel shashyn zhynap barmak ushy qysqartady. Sonda umra tamam bolady jəne ihram shekteuleri ashylady.",
      "Abdullah ibn Umar rivayat qylǵanynda, Rasulullah ﷺ dedi: «Allahym, qyrylǵandardyǵa rahm qyl». Dedі: «Qysqartylǵandardy da, ey Rasulullah?» Dedі: «Allahym, qyrylǵandardyǵa rahm qyl». Taǵy dedі: «Qysqartylǵandardy da?» Ushinshi ret dedi: «Jəne qysqartylǵandardy» (Sahih al-Bukhari 1727; Sahih Muslim 1301).",
    ],
    hadith: [
      { excerpt: "Allahym, qyrylǵandardyǵa rahm qyl... ushinshi ret: jəne qysqartylǵandardy." },
      {
        excerpt:
          "Allahym, qyrylǵandardy kefforat qyl... ushinshi ret dedi: jəne qysqartylǵandardy.",
      },
    ],
  },
  {
    title: "8 zul-hijja — Tarviya kuni",
    summary: "Haj ushin ihram kiriń jəne kundі Mina'da otkiziniz.",
    body: [
      "Tamattu' hojylary: haj niety qylyń jəne Makkadagy turar jeringizden qaita ihram kiriń, talbiyany zhanańyz. Ifrad jəne Qiran hojylary allaqashan ihramda.",
      "Mina'ǵa baryń jəne Zuhur, Asr, Maghrib, Isha jəne keyingi Fajrni ǵaribi uaqtynda eki rakatqa qysqartyp oqyńyz, Jabir rivayat qylǵan Veda haj amaline amal (Sahih Muslim 1218). Kun jəne tundі ibadatta, Arofany kutip otkiziniz.",
    ],
    hadith: [
      {
        excerpt:
          "Jabir Payg'ambar ﷺ Veda haj nyń uzaq rivayaty — Mina'da tunau jəne rәsimder ketіstіgі.",
      },
    ],
    actions: ["8-kun ertalap haj tizimin ashysyz."],
    appLinks: [{ label: "Haj tizimi" }],
  },
  {
    title: "9 zul-hijja — Arofa күні",
    summary: "Kun batqansha Arofa ishinde turyńyz; keyin Muzdalifaga otyńyz.",
    body: [
      "Arofa shegarasynda tuskennen keyin kun batqansha dua, zikr jəne tauabada qalyńyz. Payg'ambar ﷺ dedi «Haj — Arofa» (Sunan Abi Dawud 1949). Qyblaǵa qarap, qollardy kotaryńyz jəne Allahtan otinіńiz — dua ushin eń ulken uaqytтар.",
      "Zuhur men Asrni Zuhur uaqtynda birlestirip qysqartyp oqyńyz (jam' taqdim), qalǵan kundі ixtiyariy namaz ornyna duaga bagyshtanyńyz — Payg'ambar ﷺ amaly (Sahih Muslim 1218).",
      "Kun batqan soń, tinsh Muzdalifaga baryńyz. Maghrib men Ishany birlestirińiz (Isha qysqartylǵan), tundі dem alyńyz jəne tas taslaу ushin tas zhynanyńyz. Ayu jəne aieler mashhur sunnat ruxsaty men tungi zharym keiin Mina'ǵa ketui mumkin.",
    ],
    hadith: [
      { excerpt: "Haj — Arofa." },
      {
        excerpt:
          "Payg'ambar ﷺ Arofada Zuhur men Asrni birlestirdi, keyin kun batqan soń Muzdalifaga jol aldy...",
      },
    ],
  },
  {
    title: "10 zul-hijja — Nahru kuni",
    summary: "Tas taslaу, qurbanlyq, shash jəne Tawaf al-Ifada.",
    body: [
      "Mina tomǵa qaytyń jəne Jamrat al-Aqaba (ulken ustun)ǵa zheti tas taslanyńyz, ǵariz tas taslauda Allahu akbar — Veda haj ketіstіgіnde kunning birinshi amaly.",
      "Tamattu' jəne Qiran ushin talap qylynatyn qurbanlyqty berińiz (Qur'an 2:196) nemese senimdi idara arqyly tartip qylsyńyz. Et zheledi jəne kambag'alarga beriledi.",
      "Halq nemese taqsir; aiel barmak ushy qysqartady. Tas taslaу men halq/taqsirdan keyin birinshi tahallul — ihram shekteulerinin kopi ashylady, jynystyq qatynastan basqa.",
      "Makkaǵa Tawaf al-Ifada — haj rukni — jəne tamattu' hojylary ushin sa'y. Ifrad/Qiran kelis tawafy men sa'y qylǵandar mazhab hukmine amal qylady. Bul tolyq ihramnan shyǵu tamamlanady.",
    ],
    quran: [
      { excerpt: "...Kim umradan hajǵa paydalanǵan bolsa, oson tabylatyn qurban hayvanlary..." },
    ],
    madhhabNote:
      "Nahru kuni amaldar ketіstіgіnde sunnatda ilgilik bar; mazhabtar aniq tartip jəne ǵariz haj turi ushin sa'y uaqtynda farq qylady. Top jolbasshy korsetimine amal qylyńyz.",
  },
  {
    title: "11–13 zul-hijja — Tashriq künderi",
    summary: "Mina'da tunder, ǵariz kuni ush Jamrat tas taslaу, keyin qosh kon tawaf.",
    body: [
      "11, 12 (jəne erte ketpeiseniz 13) tunderin Mina'da otkiziniz. Bul kunder zheu, ishu jəne Allahty eske alu künderi.",
      "Ǵariz kuni Zuhurdan keyin ush ustunǵa tartip pen zheti tas — kishі, orta, ulken — ǵariz tas taslauda takbir. Ashyqushylar 12-kun tas taslagan soń ketui mumkin (Qur'an 2:203).",
      "Makkadan ketmeden buryn Tawaf al-Wada qylyńyz, Uy men sońǵy baiǵansy qosh kon bolsyn. Ibn Abbas rivayat qylǵanynda, adamlarǵa sońǵy marosim Uyda bolu buyrylǵan, hayzli aiel ushin zhenildetilgen (Sahih al-Bukhari 1755; Sahih Muslim 1328).",
    ],
    quran: [
      {
        excerpt:
          "Allahty sanalǵan künderde eske alysyz. Kim eki kunde ashyq bolsa — künә joq; kim keşiktirse — künә joq — Allahtan qorqqandar ushin...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Adamlarǵa Ka'ba qosh kon tawafy sońǵy marosim retinde buyrylǵan, hayzli aiel keşiktirilgen.",
      },
      { excerpt: "Adamlarǵa sońǵy marosim Uyda bolu buyrylǵan, hayzli aiel ushin zhenildetilgen." },
    ],
  },
  {
    title: "Rukn jəne wajib",
    summary: "Qaldyrylsa hajdy bokka qylatyn jəne qurbanlyq pen kefforat qylatyn narseler.",
    body: [
      "Rukn (arkan) haj nyń mazasy. Rukn qaldyrylsa, haj bokka jəne tek qurbanlyq tuzetpeydi — oryndau shart. Kopchilik adette sanaydy: ihram (niет), Arofada turu, Tawaf al-Ifada jəne sa'y.",
      "Wajib (vajibat): miqatqa ihram, Muzdalifada tunau, Jamrat tas taslaу, Tashriq tunderin Mina'da otkizu jəne Qosh kon tawaf. Wajib qaldyru hajdy bokka qylmaydy, biraq mazhabtarda dam (qurbanlyq) pen kefforat qylunady.",
    ],
    madhhabNote:
      "Aniq arkan jəne vajibat tizimderi tort mazhabta farq qylady. Mazhabyńyz ushin malikeli jolbasshy men rastanyńyz — ayniqsa koptik qysymy astynda bir narsе qaldyrylsa.",
  },
  {
    title: "Adap jəne shyn niет",
    summary: "Til men azaqtardy saqtańyz — qabyldanu minez-mulq pen baylanysty.",
    body: [
      "Künәsiz qaitu hadisi (Bukhari 1521; Muslim 1350) hajdy ar-ojdan (rafast), fisoq jəne bahas pen buzatatynyn korsetedi. Sabr, zhumyshtylyq jəne basqa hojylarga komek ibadat bolіgі.",
      "Telefon jəne behuda soz Arofa men meshitti bosmasyn. Tawafda jol bering; Qara Toshqa itermeyiniz. Qabyldanǵan haj jannat serіgі — butun saparda zhaksy minez-mulq ushin intilіńiz.",
    ],
    hadith: [
      {
        excerpt:
          "Кім Аллаһ үшін haj жасап, жыныстық қатынас пен күнәдан сақталса, анасы оны туған күніндегідей қайтарады.",
      },
    ],
    actions: ["Kundіk niет qylyńyz: bir meyirimshilik jəne koptikten zhogary bir shyn dua."],
  },
  {
    title: "Visa jəne tirkelu",
    summary: "Resmi arnalardy paidalanysyz — Nusuk jəne ulttyq haj idarasy.",
    body: [
      "Nusuk (nusuk.sa) Saudiya Arabstanynyń resmi haj jəne umra platformasy — vizalar, turar jay, transport jəne tirkelgen paketter. Resmi emes vositachylar alayaktardyqtyń ken manbai.",
      "Ǵariz el jyldyq haj kvotasyna ie; kopchilik ulttyq haj idarasy nemese litsenziyalangan agent arqyly otinim beredi. Umra kvotasy joq jəne jylnyń kop boliǵynda rastangan arnalardy arqyly uyymdastyrylady.",
    ],
    actions: [
      "Mausym ashylǵanda erte otinim bering.",
      "Tek Nusuk tizimindegi agenttar nemese ulttyq idara arqyly bron qylyńyz.",
      "Aqsha audarymdan buryn tolem arnalaryn tekserińiz.",
    ],
  },
  {
    title: "Ne alyp ketu kerek",
    summary: "Ihram, atirsiz taza quraldar, qujattar jəne zhyru qonysy.",
    body: [
      "Erkekter: keminde eki toplam tikilmegen ihram jəne qujattar ushin kemer. Aieler: ken jabyq kiyim. Oson kiyiletin ashqy sandal; kishі ryukzak jəne su idishi.",
      "Atirsiz sabyn jəne quyash kremi alyńyz — ihramda atir tyiym. Pasport, viza nusqasy, emdeu jazbalary jəne shuǵyl bailanys nysandaryn ing qopshada saqtańyz. Power bank jəne jergilikti SIM nemese eSIM koptik ishinde komektesedi.",
    ],
    actions: [
      "Tizim: ihram ×2, sandal, atirsiz quraldar, qujat qopshasy, dori, power bank.",
      "Ayak zharasy plastirin alyńyz — hojylar uzaq zhyrady.",
    ],
  },
  {
    title: "Muqaddas jerler qysqasha",
    summary: "Makka, Madina, Mina, Arofa jəne Muzdalifa — amaliy eskertuler.",
    body: [
      "Masjid al-Haram Ka'bany qorap alady — tawaf jəne sa'y jeri; ulken koptik kutińiz. Madinadagy Masjid an-Nabawi hajnyń uzi emes, biraq kop hojylar ziyarat qylady; Ravda kirisi resmi qoldanbalar arqyly uaqyt belgilenedi.",
      "Mina 8 jəne 11–13 zul-hijja tunderi ushin shatyrlar qalasy. Arofa ashqy tekislik — 9-kunde su jəne kolenke mańyzdy. Muzdalifa hojylar ashqy aspan astynda dem alyp tas zhynaytyn jer — imkoniyattar niyatpen az.",
    ],
    actions: ["Sapardan buryn Mina–Arofa–Muzdalifa qylay kartasyn orenińiz."],
  },
  {
    title: "Resmi derekkozder",
    summary: "Nusuk, ulttyq idarasyńyz jəne Visit Saudi.",
    body: [
      "Vizalar, paketter, Ravda ruxsaty jəne koptik jolbasshylyǵy ushin Nusuktan baslańyz. El haj vazirliginen kvota jəne den saulyǵy qoidalaryn alyńyz. Visit Saudi umumiy kiru jəne sapar kestelerin jariyalaydy.",
      "Kelisim g'ayrioddiy arzan korsinse nemese vositachi resmi arnalardan tys tolem surasa, tolemeden buryn tikelen vazirlik portaly arqyly tekserińiz.",
    ],
    actions: [
      "nusuk.sa jəne ulttyq haj idarasy saityn betbelshege qosyńyz.",
      "Top basysynyń shuǵyl bailanys nysandaryn saqtańyz.",
    ],
  },
];

export const HAJJ_CHECKLIST_KK: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Haj ushin ihram",
    hint: "Haj niety qylyń jəne ihram kiriń (tamattu' ushin Makkadan); talbiyany zhanańyz.",
    day: "8 zul-hijja",
  },
  {
    title: "Mina'ǵa baryń",
    hint: "Mina'da Zuhurdan Fajrge dein ǵariz namazdy uaqtynda qysqartyp oqyńyz.",
    location: "Mina",
    day: "8 zul-hijja",
  },
  {
    title: "Arofada turyń",
    hint: "Arofa ishinde tuskennen keyin kun batqansha dua jəne zikrde qalyńyz.",
    location: "Arofa",
    day: "9 zul-hijja",
  },
  {
    title: "Zuhur men Asrni birlestiriń",
    hint: "Zuhur men Asrni Zuhur uaqtynda birlestirip qysqartyp oqyńyz, keyin duaga qaratylyńyz.",
    location: "Arofa",
    day: "9 zul-hijja",
  },
  {
    title: "Muzdalifaga otyń",
    hint: "Kun batqan soń Maghrib men Ishany birlestirińiz, dem alyńyz jəne tas zhynanyńyz.",
    location: "Muzdalifa",
    day: "9 zul-hijja",
  },
  {
    title: "Jamrat al-Aqaba tas taslaу",
    hint: "Ulken ustunǵa zheti tas taslanyńyz, ǵariz tas taslauda takbir.",
    location: "Mina",
    day: "10 zul-hijja",
  },
  {
    title: "Qurbanlyq berińiz",
    hint: "Tamattu' jəne qiran ushin talap — oziniz nemese senimdi idara arqyly.",
    day: "10 zul-hijja",
  },
  {
    title: "Halq nemese taqsir",
    hint: "Erkekter qyryp alady nemese qysqartady; aiel barmak ushy (birinshi tahallul).",
    day: "10 zul-hijja",
  },
  {
    title: "Tawaf al-Ifada",
    hint: "Tawaf al-Ifada jəne tamattu' ushin sa'y — haj rukni.",
    location: "Masjid al-Haram",
    day: "10 zul-hijja",
  },
  {
    title: "Mina'da tunau",
    hint: "11, 12 (jəne erte ketpeiseniz 13) tunderin Mina'da otkiziniz.",
    location: "Mina",
    day: "11–13 zul-hijja",
  },
  {
    title: "Ush Jamrat tas taslaу",
    hint: "Ǵariz kuni Zuhurdan keyin kishі, orta, keyin ulken — ǵaribi zheti.",
    location: "Mina",
    day: "11–13 zul-hijja",
  },
  {
    title: "Qosh kon tawaf",
    hint: "Makkadan ketmeden buryn Tawaf al-Wada (hayzli aiel keşiktirilgen).",
    location: "Masjid al-Haram",
    day: "Ketу",
  },
];

export const UMRAH_CHECKLIST_KK: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Ihramǵa kiru",
    hint: "Miqatta nemese undan buryn: ghusl, ihram kiyimi, umra niety, talbiya.",
    location: "Miqat",
  },
  { title: "Talbiyany oqyń", hint: "Tawaf baslangansha Labbayk... zhii qaytalańyz." },
  {
    title: "Ka'ba tawafy",
    hint: "Qara Toshdan baslap zheti aylana saǵat qaǵytyna qarsy; erkekter: raml jəne idtiba'.",
    location: "Masjid al-Haram",
  },
  {
    title: "Eki rakat oqyń",
    hint: "Mumkin bolsa Maqam Ibrahim artynda, keyin Zamzam ishińiz.",
    location: "Masjid al-Haram",
  },
  {
    title: "Safa men Marwa arasynda sa'y",
    hint: "Safadan baslap zheti saf; erkekter zhasyl belgiler arasynda zhygirady.",
    location: "Masjid al-Haram",
  },
  {
    title: "Halq nemese taqsir",
    hint: "Erkekter qyryp alady nemese qysqartady; aiel barmak ushy — umra tamam.",
  },
];
