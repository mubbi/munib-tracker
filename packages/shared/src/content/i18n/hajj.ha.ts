// Hausa translation overlay for the Learn Hajj & Umrah guide. Mirrors the order of
// its English source in ../hajj-guide.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { HajjGuideSection } from "../../types/hajj-guide";
import type { DeepPartial } from "./localize";

export const HAJJ_GUIDE_SECTIONS_HA: DeepPartial<HajjGuideSection>[] = [
  {
    day: "Kafin ka tafi",
    title: "Wajibi & Sharuɗɗa",
    summary: "Me ya sa Hajji ya wajaba, da kuma wanda ya wajaba a kansa.",
    steps: [
      {
        title: "Rukuni na biyar",
        body: 'Hajji shi ne rukunnan Musulunci na biyar, wanda ya wajaba sau daya a rayuwa a kan kowane musulmi mai iko. Allah yana cewa: "Kuma ga Allah akwai hajji daga mutane zuwa ga Ɗaki, ga wanda ya sãmi wata hanya a gare shi" (k:3:97). An yi shela ga dukkan mutane cewa: “Kuma ka yi wa mutane bushara da aikin hajji, za su zo maka da ƙafafu da kowane raƙumi raƙuman ruwa.” (k:22:27).',
      },
      {
        title: "Iya (istita'ah)",
        body: "Aikin Hajji yana wajaba ne a kan mawadata kawai: lafiyar jiki ga tafiya, da wadatar halal wadda za ta iya rufe tafiyar da abin dogaro da shi a lokacin da yake tafiya, da amintacciyar hanya mabudi. Duk wanda ya rasa wadata a wannan shekara, to, ba ya da laifi ga jinkirtawa har sai ya sami iko.",
      },
      {
        title: "Tafiyar mace",
        body: "Mafi yawan malamai suna ganin cewa mace ta yi tafiya aikin Hajji tare da muharrama (miji ko dangin da ba a yi aure ba); Wasu malamai daga baya sun ba da izinin tafiya a cikin amintattun rukunin mata. Ku bi hukunce-hukuncen malamin da kuka amince da shi da kuma dokokin hukumar Hajjin ku.",
      },
    ],
  },
  {
    day: "Kafin ka tafi",
    title: "Nau'o'in Hajji guda uku",
    summary: "Ifrad, Qiran, da Tamattu' - zabi kafin shiga ihrami.",
    steps: [
      {
        title: "Ifrad",
        body: "Mahajjaci yana shiga ihrami ne kawai don aikin hajji, ba ya yin umra daban, kuma ba ya bayar da layya akansa. Yana nan yana cikin harama har zuwa ibadun ranar Nahr.",
      },
      {
        title: "Qiran",
        body: "Mahajjaci ya hada umra da hajji a ihrami guda, ya yi aikin umra da zama a cikin harami har zuwa kammala aikin hajji. Kamar Tamattu'i, yana buƙatar sadaukarwa (hady).",
      },
      {
        title: "Tamattu'",
        body: "Mahajjaci ya cika Umra a cikin watannin Hajji, ya fita ihrami, sannan ya sake shiga ihrami don aikin Hajji ranar 8 ga Zul-Hijjah. Wannan shi ne abin da mafi yawan alhazai suke yi; tana bukatar layya, ko azumin kwana uku a Hajji, da dawowar bakwai idan mutum ba zai iya ba (Alkur’ani 2:196).",
      },
    ],
  },
  {
    day: "Kafin ka tafi",
    title: "Miqat & Ihrami",
    summary: "Inda kasa mai tsarki ta fara, da abin da ta hana.",
    steps: [
      {
        title: "Mawaqit biyar",
        body: "Manzon Allah ﷺ ya kayyade mikatoci guda biyar wadanda ba za a ketare su ba sai da ihrami: Zul-Hulayfah (na Madina), Al-Juhfah (na Syria/Masar), Qarn al-Manazil (na Najd), Yalamlam (na Yemen), da Dhat 'Irq (na Iraki). Wadanda suka riga sun shiga cikin ihrami daga inda suke.",
        location: "Miqat",
      },
      {
        title: "Menene ihrami",
        body: "Ihrami ita ce kasa mai tsarki da aka shiga da niyya da talbiya. Maza suna sanye da fararen zanen gado guda biyu marasa dinki; mata suna ci gaba da sanya tufafi masu kyau. Ana shigar da ita ne bayan gulma, kuma ga maza ana shafa turare a jiki (ba tufa ba) tukuna.",
        location: "Miqat",
      },
      {
        title: "Haramcin ihrami",
        body: "Yayin da yake cikin ihrami ka nisanci: dinki/cikakken tufafi da rufe kai (na maza), turare, yanke gashi ko farce, farauta, kulla ko gudanar da aure, da duk wani kusanci. Karya wadannan na iya bukatar kaffara (fidiya), don haka a kiyaye su a hankali.",
        location: "Miqat",
      },
    ],
  },
  {
    title: "Umrah",
    summary: "Karamin aikin hajji - za a iya yi a kowane lokaci na shekara.",
    steps: [
      {
        title: "Shiga ihrami",
        body: "A lokacin miqat ko gabanin miqat, sai a yi guzuri, a sa tufafin ihrami, a yi niyyar umra, sannan a fara talbiya. An yi niyya a cikin zuciya, kuma yanayin tsarki yana farawa daga wannan lokacin.",
        location: "Miqat",
      },
      {
        title: "Karanta talbiya",
        body: 'Maimaita "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk..." sau da yawa yayin da kuke tafiya zuwa Makkah - shelar cewa kun amsa kiran Allah shi kaɗai - ci gaba har sai kun fara tawafi.',
      },
      {
        title: "Tawafin Ka'abah",
        body: "Zagaye Ka'aba sau bakwai gaba da agogo, farawa da ƙarewa a kusurwar Black Stone, inda za ku sumbace ta, taɓa shi, ko kawai nuna ta da takbir. Maza suna yin raml (taki da sauri) a cikin da'irori uku na farko da idtiba' (kunna kafaɗar dama). Tsakanin Kusurwar Yaman da Baƙin Dutse ana karantawa: \"Ya Ubangijinmu, Ka ba mu mai kyau a cikin duniya, da mai kyau a cikin Lahira, kuma Ka kare mu daga azabar wuta\" (k:2:201).",
        location: "Masjid al-Haram",
      },
      {
        title: "Sallah raka'a biyu",
        body: "Bayan an yi tawafi, sai a yi sallah raka'a biyu bayan Maqam Ibrahim idan zai yiwu (ko kuma a ko'ina a cikin masallaci idan cunkoso), sannan a sha ruwan zamzam kyauta, domin Annabi SAW ya ce zamzam na duk abin da aka sha ne.",
        location: "Masjid al-Haram",
      },
      {
        title: "Sa'i tsakanin Safa & Marwah",
        body: "Tafiya sau bakwai tsakanin Safa da Marwah, tun daga Safa, domin tunawa da neman ruwa da Hajar ta nema wa danta Isma'il. Allah yana cewa: “Hakika as-Safa da Marwah suna daga cikin alamomin Allah” (k:2:158). A Safa, ku fuskanci Ka'aba, ku ɗaga hannuwanku don yin addu'a da takbir; maza suna tsere tsakanin koren alamomi.",
        location: "Masjid al-Haram",
      },
      {
        title: "Halq ko taqsir",
        body: "Maza suna aske kai (halq, mafi lada) ko kuma a datse shi daidai gwargwado (taqsir); mata suna tattara gashin kansu suna datsa tsayin ɗan yatsa. Da wannan ne Umra ta cika sannan aka dauke hani.",
      },
    ],
  },
  {
    day: "8 Zul-Hijjah",
    title: "Ranar Tarwiyah - Mina",
    summary: "An fara aikin hajji; ranar a Mina.",
    steps: [
      {
        title: "Shiga ihrami don aikin Hajji",
        body: "Ka yi niyyar Hajji ka sake shiga ihrami (daga mazauninka a Makka don tamattu'i), sabunta talbiya. Wannan ya sake farawa da harami, don haka haramcin ihrami ya sake komawa.",
      },
      {
        title: "Tafiya zuwa Mina",
        body: "Ku tafi Mina ku yi Sallar Zuhur, da La'asar, da Magriba, da Isha'i, da Asuba ta gaba, kowanne ya rage raka'a biyu a lokacinsa, yana bin Sunnar Annabi SAW. Ku ciyar dare da rana kuna ibada, kuna jiran tsayuwar Arafah.",
        location: "Mina",
      },
    ],
  },
  {
    day: "9 Zul-Hijjah",
    title: "Ranar Arafah",
    summary: "Mafi girman ranar Hajji - tsayuwa a Arafah.",
    steps: [
      {
        title: "Tsaya a Arafah",
        body: "Kasance cikin iyakar Arafah daga bayan rana har zuwa faduwar rana a cikin addu'a da zikiri da tuba. Manzon Allah (SAW) ya ce, “Hajji Arafah ne” (Tirmizi 889, Abu Dawud 1949, hasan sahihi): Duk wanda ya rasa wannan tsayuwar to ya yi hajji. Ku fuskanci alƙibla, ku ɗaga hannuwanku, kuma ku roƙi Allah - ita ce mafi girman yinin addu'a.",
        location: "Arafah",
      },
      {
        title: "Haɗa Dhuhr & Asr",
        body: "Ku yi Sallar Zuhur da La'asar tare kuma a gajarta a lokacin zahur (jam' taqdim), sannan ku sadaukar da sauran ranar gaba daya ga addu'a maimakon karin sallah.",
        location: "Arafah",
      },
      {
        title: "Matsa zuwa Muzdalifah",
        body: "Bayan faduwar rana a nitse zuwa Muzdalifah, sai a hada Maghrib da Isha (Isha a takaice), a huta da dare, a tara tsakuwa domin jifa. Masu rauni da mata na iya tashi zuwa Mina bayan tsakar dare don guje wa murkushe su.",
        location: "Muzdalifa",
      },
    ],
  },
  {
    day: "10 Zul-Hijjah",
    title: "Ranar Nahr - Eid al-Adha",
    summary: "Jifa, sadaukarwa, da babban tawafi.",
    steps: [
      {
        title: "Dutse Jamrat al-Aqaba",
        body: 'Koma zuwa Mina, ku jefa duwatsu bakwai a kan babban ginshiƙi (Jamrat al-Aqaba), kuna cewa "Allahu akbar" da kowace jifa. Wannan ya sake tabbatar da kin amincewar Ibrahim ga Shaidan kuma ita ce ta farko a ranar.',
        location: "Mina",
      },
      {
        title: "Bayar da hadaya",
        body: "Yanka dabbar layya, ko kuma a shirya ta ta hanyar wata hukuma amintacciya, kamar yadda ake buqata ga mahajjata tamattu’i da qiran (Alkur’ani 2:196). Ana ci namansa ana ba wa talakawa.",
      },
      {
        title: "Halq ko taqsir",
        body: "Aske (halq) ko datsa (taqsir) gashi; mata suna gyara tsayin yatsa. Bayan jifa da aske, sakin farko (tahalul awwal) ya shafi - duk haramcin haramun sai dai kusantar juna da abokin aure.",
      },
      {
        title: "Tawaf al-Ifadah",
        body: "Jeka Makkah don Tawaf al-Ifadah - Rukunin Hajji - da sa'i (don tamattu'i). Wannan ya cika cikakkar ‘yantuwa daga ihrami, kuma wanda ya nisanci alfasha da zunubi “ya koma kamar ranar da mahaifiyarsa ta haife shi” (Bukhari 1521, Musulmi 1350).",
        location: "Masjid al-Haram",
      },
    ],
  },
  {
    day: "11–13 Zul-Hijja",
    title: "Kwanakin Tashreeq - Mina",
    summary: "Dare a Mina da jifan ginshiƙai uku kullum.",
    steps: [
      {
        title: "Ku kwana a Mina",
        body: "Ku ciyar da dare na 11, 12 (da 13th idan ba a tashi da wuri ba) a Mina. Wadannan ranaku ne na ci da sha da zikirin Allah, wadanda ake ciyar da su a cikin ibada da takbir.",
        location: "Mina",
      },
      {
        title: "Jifa Jamarat uku",
        body: "Kowace rana bayan Zuhur, sai a jefa tsakuwa guda bakwai a kan kowanne daga cikin ginshiƙan guda uku a jere - ƙarami, sannan na tsakiya, sannan babba - tare da takbir akan kowace jifa. Wanda ya yi gaggawa zai iya fita bayan jifan ranar 12 ga (Alkur'ani 2:203).",
        location: "Mina",
      },
      {
        title: "Wallahi Tawaf",
        body: "Kafin fita daga Makkah, sai a yi Tawafin Wada a matsayin ibadar karshe, ta yadda aikin Hajji na karshe ya kasance tare da Daki. Matan masu haila an barranta daga gare ta.",
        location: "Masjid al-Haram",
      },
    ],
  },
  {
    day: "Kammalawa & hukunce-hukunce",
    title: "Ginshikai, wajibai & lada",
    summary: "Abin da ya inganta aikin Hajji, da abin da ake biya, da ladansa.",
    steps: [
      {
        title: "ginshikan (arkan)",
        body: "Rukunnan su ne ainihin aikin Hajji: shiga ihrami, da tsayuwa a Arafah, da Tawaf al-Ifadah, da sa’ayi (kamar yadda mafi rinjaye suka yi riko da shi). Idan kuma aka rasa wani ginshiki, to Hajji ba shi da inganci kuma ba za a iya hada shi da hadaya ba – sai a maimaita shi.",
      },
      {
        title: "The wajibai (wajibat)",
        body: "wajibcin sun hada da shiga ihrami daga miqat, da zama a Muzdalifah, da jifan Jamarat, da raya dararen Tashriq a Mina, da Tawafin bankwana. Cire farilla ba ya bata aikin Hajji sai dai dam (layya) ya biya shi. Madhhabs sun bambanta akan ainihin lissafin; tuntuɓi ƙwararren jagora.",
      },
      {
        title: "Ladan Hajji mabrur",
        body: "Hajji karbabbu (Hajji mabrur) - ba tare da zunubi da gaskiya ba - yana kankare zunuban da ya gabata kuma ladansa Aljanna ce kanta. Annabi SAW ya ce, “Hajji karbabbe ba shi da lada sai Aljanna” (Bukhari 1773, Musulmi 1349). Yi ƙoƙari don kyakkyawan hali da tawali'u a ko'ina.",
      },
      {
        title: "Jagora a aikace, ba fatawa ba",
        body: "Wannan bayyani ce mai amfani don taimaka muku bin ƙa'idodi cikin tsari. Madhabbai sun bambanta cikin girmamawa akan cikakkun bayanai da yawa, kuma kowane mahajjaci halin da ake ciki ya bambanta - ko da yaushe tuntuɓi ƙwararren malami ko jagorar aikin Hajjin ku don takamaiman hukunce-hukunce da shari'o'in da ba zato ba tsammani.",
      },
    ],
  },
];
