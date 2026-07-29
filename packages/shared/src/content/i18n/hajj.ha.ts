import type { PilgrimageChecklistItem } from "../../types/hajj-guide";
import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Hausa translation overlay for Hajj & Umrah learning topics and rite checklists.
// Entries are index-aligned with the English sources; stable identifiers and references remain unchanged.

export const HAJJ_GUIDE_TOPICS_HA: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Ladan Hajji karɓaɓɓe",
    summary: "Hajji mabrur yana share zunubai kuma ladansa Aljanna ce.",
    body: [
      "Abu Hurayrah ya ruwaito cewa Manzon Allah ﷺ ya ce: «Duk wanda ya yi Hajji don Allah, bai yi jima'i ba kuma bai yi zunubi ba, zai dawo kamar yadda yake a ranar da mahaifiyarsa ta haife shi» (Sahih al-Bukhari 1521; Sahih Muslim 1350).",
      "Ya kuma ce: «Hajji karɓaɓɓe (Hajji mabrur) bai da lada sai Aljanna» (Sahih al-Bukhari 1773; Sahih Muslim 1349). Karɓuwa tana da alaƙa da ikhlasi da kiyaye Hajji daga alfasha da laifi — ba kawai kammala matakan waje kaɗai ba.",
    ],
    hadith: [
      {
        excerpt:
          "Duk wanda ya yi Hajji don Allah, bai yi jima'i ba kuma bai yi zunubi ba, zai dawo kamar yadda yake a ranar da mahaifiyarsa ta haife shi.",
      },
      {
        excerpt:
          "Duk wanda ya yi Hajji don Allah, bai yi jima'i ba kuma bai yi zunubi ba, zai dawo kamar yadda yake a ranar da mahaifiyarsa ta haife shi.",
      },
      { excerpt: "Hajji karɓaɓɓe bai da lada sai Aljanna." },
      { excerpt: "Hajji karɓaɓɓe bai da lada sai Aljanna." },
    ],
    actions: [
      "Yi niyyar Hajji don Allah kaɗai — ka kiyaye harshenka da halinka a duk tsawon tafiya.",
      "Yi amfani da jerin ayyukan Hajji na app ɗin ne kawai a matsayin taimakon ƙwaƙwalwa; ka bar zuciyarka a kan karɓuwa.",
    ],
    appLinks: [{ label: "Jerin ayyukan Hajji" }],
  },
  {
    title: "Falalar Umrah",
    summary: "Umrah zuwa Umrah tana share zunubai tsakaninsu.",
    body: [
      "Abu Hurayrah ya ruwaito cewa Annabi ﷺ ya ce: «Yin Umrah kaffara ne ga zunuban da aka aikata tsakaninta da wanda ya gabata, kuma Hajji karɓaɓɓe bai da lada sai Aljanna» (Sahih al-Bukhari 1773; Sahih Muslim 1349).",
      "Za a iya yin Umrah a kowane lokaci na shekara. Ta fi Hajji gajarta amma har yanzu babbar ibada ce: ihram, tawaf, sa'i, da yankewa ko aske gashi.",
    ],
    hadith: [
      {
        excerpt:
          "Yin Umrah kaffara ne ga zunuban da aka aikata tsakaninta da wanda ya gabata, kuma Hajji karɓaɓɓe bai da lada sai Aljanna.",
      },
      {
        excerpt:
          "Yin Umrah kaffara ne ga zunuban da aka aikata tsakaninta da wanda ya gabata, kuma Hajji karɓaɓɓe bai da lada sai Aljanna.",
      },
    ],
    actions: ["Buɗe jerin ayyukan Umrah idan kana shirin bi matakan ibadar bisa tsari."],
    appLinks: [{ label: "Jerin ayyukan Umrah" }],
  },
  {
    title: "Ranar Arafah",
    summary: "Tsayawa a Arafah shine zuciyar Hajji — kuma babbar rana ta addu'a.",
    body: [
      "Abd al-Rahman ibn Ya'mar ya ruwaito cewa Annabi ﷺ ya ce: «Hajji shine Arafah» (Sunan Abi Dawud 1949; Jami' at-Tirmidhi 889). Duk wanda ya rasa tsayawa a cikin iyakokin Arafah a lokacinta, ya rasa Hajjin wannan shekarar.",
      "Ga waɗanda ba su cikin Hajji ba, azumin ranar Arafah aiki ne da aka ƙarfafa sosai: Abu Qatadah ya ruwaito cewa azumin Arafah yana kankare zunuban shekarar da ta gabata da wadda za ta zo (Sahih Muslim 1162). Alhazai da kansu ba sa yin azumi domin su keɓance ranar don addu'a.",
    ],
    hadith: [
      { excerpt: "Hajji shine Arafah." },
      { excerpt: "Hajji shine Arafah." },
      {
        excerpt:
          "Azumin ranar Arafah, ina fatan Allah, zai kankare zunuban shekarar da ta gabata da wadda za ta zo.",
      },
    ],
  },
  {
    title: "Hajji — rukuni na biyar",
    summary: "Wajibi ne sau ɗaya a rayuwa akan duk musulmi mai iyawa.",
    body: [
      "Allah Ya ce: «Kuma Allah na da hakki a kan mutane, na yin Hajji zuwa Gidan — ga wanda ya samu hanya zuwa gareshi. Kuma wanda ya kafirta, to lallai Allah Mawadaci ne daga barin talikai» (Alkur'ani 3:97).",
      "An yi kiran ga dukan mutane: «Kuma ka yi kiran Hajji ga mutane; za su zo maka a kan ƙafa da a kan kowace rakumi maras kiba; za su zo daga kowace hanya mai nisa» (Alkur'ani 22:27).",
      "Ibn Umar ya ruwaito cewa Annabi ﷺ ya ce Musulunci an gina shi bisa abubuwa biyar: shaida, sallah, zakka, azumin Ramadan, da Hajji zuwa Gidan ga wanda ya samu iyawa (Sahih al-Bukhari 8; Sahih Muslim 16). Malamai sun yarda cewa wajibi ne sau ɗaya a rayuwa idan sharuɗɗa sun cika; sake maimaita shi falala ce ta son rai.",
    ],
    quran: [
      {
        excerpt:
          "Kuma Allah na da hakki a kan mutane, na yin Hajji zuwa Gidan — ga wanda ya samu hanya zuwa gareshi...",
      },
      {
        excerpt:
          "Kuma ka yi kiran Hajji ga mutane; za su zo maka a kan ƙafa da a kan kowace rakumi maras kiba...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Musulunci an gina shi bisa abubuwa biyar: shaidawa babu abin bautawa da gaskiya sai Allah kuma Muhammadu Manzon Allah ne, tsayar da sallah, bayar da zakka, azumin Ramadan, da Hajji zuwa Gidan ga wanda ya samu iyawa.",
      },
      {
        excerpt:
          "Musulunci an gina shi bisa abubuwa biyar... da Hajji zuwa Gidan ga wanda ya samu hanyar zuwa gareshi.",
      },
    ],
  },
  {
    title: "Iyawa (istita'ah)",
    summary:
      "Lafiya, dukiya halal, da hanya mai aminci — ba tare da su ba, Hajji bai wajaba tukuna.",
    body: [
      "Sharaɗin da ke cikin Alkur'ani 3:97 shine iyawa (istita'ah). Malaman gargajiya sun taƙaita shi da: lafiyar jiki don tafiya, isasshiyar dukiya halal don biyan tafiya da bukatun waɗanda ke ƙarƙashinsa yayin da ba ya nan, da kuma hanya mai aminci da buɗewa.",
      "Duk wanda bai da waɗannan hanyoyin a wannan shekara, ba shi da laifi idan ya jinkirta har sai ya samu iyawa. Ana tantance iyawa bisa yanayin kowa — rashin lafiya, bashin da dole ne a biya, ko tafiya mai haɗari na iya ɗage wajibcin nan take. Ka tambayi malami masani idan yanayinka bai bayyana ba.",
    ],
    quran: [{ excerpt: "...ga wanda ya samu hanya zuwa gareshi." }],
    actions: [
      "Ka biya basussukan wajibi kuma ka shirya abinci da kula na waɗanda ke ƙarƙashinka kafin yin rijista.",
      "Ka tabbatar da fakitocin tafiya ta hanyoyin hukuma kawai (duba batutuwan shirye-shirye).",
    ],
  },
  {
    title: "Tafiyar mace don aikin hajji",
    summary:
      "Galibin malamai suna buƙatar mahram; wasu ra'ayoyin baya-bayan nan sun ba da izinin tafiya cikin ƙungiya amintacce.",
    body: [
      "Ibn Abbas ya ruwaito cewa Annabi ﷺ ya ce mace kada ta yi tafiya sai da mahram, kuma namiji kada ya shiga wurinta sai da mahram yana nan (Sahih al-Bukhari 1862; Sahih Muslim 1341). Malamai da yawa suna aiwatar da wannan a kan tafiyar Hajji da Umrah.",
      "Wasu malamai na baya — bisa la'akari da aminci, buƙata, da yanayin tafiye-tafiye na zamani — suna ba da izinin mace ta yi tafiyar Hajji wajibi cikin ƙungiya amintacce idan babu mahram. Wannan har yanzu tambaya ce mai sabani a fikihu.",
    ],
    hadith: [
      {
        excerpt:
          "Mace kada ta yi tafiya sai da mahram, kuma namiji kada ya shiga wurinta sai da mahram yana tare da ita.",
      },
      {
        excerpt:
          "Bai halasta wa mace mai imani da Allah da Ranar Ƙarshe ta yi tafiyar yini da dare sai da mahram.",
      },
    ],
    madhhabNote:
      "Galibin malamai suna cewa mace na buƙatar mahram don tafiyar aikin hajji. Wasu malamai na baya sun ba da izinin tafiya cikin ƙungiyar mata amintacce don Hajji wajibi. Ka bi malamin da kake amincewa da shi da ƙa'idodin hukumar Hajji ta ƙasarka.",
    disclaimer: "Wannan bayyani ne na gaba ɗaya, ba fatawa ta musamman ga yanayinka ba.",
  },
  {
    title: "Nau'ukan Hajji uku",
    summary: "Ifrad, Qiran, da Tamattu' — ka zaɓi kafin shiga ihram.",
    body: [
      "Ifrad: shiga ihram don Hajji kaɗai, ba tare da Umrah daban a cikin wannan ihram ba, kuma babu buƙatar yanka domin haɗa ayyuka.",
      "Qiran: haɗa Umrah da Hajji a cikin ihram guda, kana cikin ihram har sai Hajji ya kammala. Ana buƙatar yanka (hady).",
      "Tamattu': yin Umrah cikakke a cikin watannin Hajji, fita daga ihram, sannan sake shiga ihram don Hajji a ranar 8 ga Zulhijja. Wannan shine abin da mafi yawan alhazai ke yi a yau; shi ma yana buƙatar hady.",
      "Allah Ya ce game da waɗanda suka haɗa ayyuka: «...Kuma duk wanda ya more da Umrah zuwa Hajji, sai ya yi abin da ya sauƙaƙa daga dabbobin yanka...» kuma waɗanda ba su da ikon yi haka za su yi azumin kwana uku a lokacin Hajji da bakwai idan sun dawo (Alkur'ani 2:196).",
    ],
    quran: [
      {
        excerpt:
          "Kuma ku cika Hajji da Umrah don Allah... Duk wanda ya more da Umrah zuwa Hajji, sai ya yi abin da ya sauƙaƙa daga dabbobin yanka. Kuma duk wanda bai samu (dabba) ba — sai azumin kwana uku a lokacin Hajji da bakwai idan ya dawo...",
      },
    ],
    actions: [
      "Ka zaɓi nau'in Hajjinka tare da shugaban ƙungiyarka kafin miqat.",
      "Idan kana yin Tamattu', ka kammala Umrah gaba ɗaya kafin sake shiga ihram don Hajji.",
    ],
    appLinks: [{ label: "Jerin ayyukan Umrah" }, { label: "Jerin ayyukan Hajji" }],
  },
  {
    title: "Mawaqit biyar",
    summary: "Kada ka wuce miqat zuwa Makkah ba tare da shiga ihram don Hajji ko Umrah ba.",
    body: [
      "Ibn Abbas ya ruwaito cewa Annabi ﷺ ya ƙayyade miqat don mutane: Dhul-Hulayfah domin Madina, Al-Juhfah domin Sham, Qarn al-Manazil domin Najd, da Yalamlam domin Yemen; da kuma domin mutanen Iraki, Dhat 'Irq. Ya ce waɗannan wurare ne domin su da domin duk wanda ya iso can yana niyyar Hajji ko Umrah; kuma duk wanda yake zaune a cikin waɗannan wurare, sai ya shiga ihram daga inda ya tashi, har da mutanen Makkah daga Makkah (Sahih al-Bukhari 1524; Sahih Muslim 1181).",
      "Filayen jirgin sama da tashar jiragen ruwa na zamani suna da wuraren ihram nasu ko hanyoyin da aka sanar — ka bi jagorar kamfanin jigilarka da Ma'aikatar Hajji da Umrah domin kada ka wuce iyaka ba tare da ihram ba.",
    ],
    hadith: [
      {
        excerpt:
          "Manzon Allah ﷺ ya ƙayyade Dhul-Hulayfah domin mutanen Madina, Al-Juhfah domin mutanen Sham, Qarn al-Manazil domin mutanen Najd, da Yalamlam domin mutanen Yemen... Waɗannan miqat domin mutanen waɗannan wurare ne, da domin duk wanda ya zo can yana niyyar Hajji ko Umrah...",
      },
      {
        excerpt:
          "Manzon Allah ﷺ ya bayyana miqat... Duk wanda yake zaune a cikin waɗannan iyakoki, sai ya shiga ihram daga inda ya tashi...",
      },
    ],
  },
  {
    title: "Shiga ihram",
    summary: "Wanka, tufafi, niyya, da talbiyya sune farkon halin tsarki.",
    body: [
      "Ihram shine halin tsarki da ake shiga ta hanyar niyya don Hajji ko Umrah. Annabi ﷺ ya ƙarfafa yin wanka kafin ihram. Maza suna sanya zanukan fari biyu marasa ɗinki; mata suna sanya tufafin kamewa na yau da kullum ba tare da rufe fuska ko safar hannu a matsayin tufafin ihram ba (dalilan niƙab da safar hannu ana tattauna su a fikihu).",
      "Maza na iya shafa turare a jiki kafin ihram, ba a kan tufafin ihram bayan shiga halin nan ba (Sahih al-Bukhari 1539). Sannan ka yi niyya kuma ka fara talbiyya.",
      "Talbiyya da Annabi ﷺ ya koyar shine: «Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni'mata laka wal-mulk, la sharika lak» — ana ci gaba har sai fara tawaf don Umrah, ko har sai jifan Jamrat al-Aqaba don Hajji bisa aikin da aka fi sani (Sahih al-Bukhari 1549; Sahih Muslim 1184).",
    ],
    hadith: [
      {
        excerpt: "Aisha ta ce: Na kan turaren Manzon Allah ﷺ don ihram kafin ya shiga ihram...",
      },
      {
        excerpt:
          "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni'mata laka wal-mulk, la sharika lak.",
      },
      { excerpt: "Annabi ﷺ ya ɗaga murya da talbiyya: Labbayk Allahumma labbayk..." },
    ],
    actions: [
      "Ka shirya aƙalla kayan ihram biyu don maza; ka shirya kayan wanka marasa turare.",
      "Ka yi aikin talbiyya kafin tafiya domin ta zamo mai sauƙi a hanya.",
    ],
  },
  {
    title: "Abubuwan da aka haramta a ihram",
    summary: "Abin da muhrim dole ya kauce masa har sai ya fita daga halin tsarki.",
    body: [
      "Yayin da kake cikin ihram, ka guji: ga maza — tufafin ɗinki/auna da rufe kai; turare; yankan gashi ko farce; farautar dabbobin daji na ƙasa; ƴancewar ko yin aure; da jima'i. Mata suna guji turare da sauran haramtattun abubuwa gama gari yayin da suke riƙe da tufafin kamewa.",
      "Karya wani haramci na iya buƙatar kaffara (fidyah) — yawanci azumi, ciyar da matalauta, ko yanka — ya danganta da abin da aka yi. Madhabobi suna rarraba dalilan daban-daban. Ka lura sosai da haramtattun abubuwa kuma ka tambayi jagora masani idan wani abu ya faru ba zato.",
    ],
    actions: ["Ka ajiye turare, na'urar yankan farce, da almakashi daga isashen wuri yayin ihram."],
    madhhabNote:
      "Jerin laifuka da kaffarorinsu sun bambanta bisa madhabobi. Ka ɗauki wannan a matsayin jerin gargaɗi mai amfani, sannan ka tabbatar da bayanai tare da madhabinka ko jagoran Hajji.",
    disclaimer:
      "Wannan bayyani na gaba ɗaya bai maye gurbin jagora a fagen aiki idan laifi ya faru ba.",
  },
  {
    title: "Umrah — ihram da talbiyya",
    summary: "Ka shiga halin tsarki a ko kafin miqat, sannan ka amsa kiran Allah.",
    body: [
      "A ko kafin miqat, ka yi wanka idan zai yiwu, ka sanya tufafin ihram, ka yi niyyar Umrah, kuma ka fara talbiyya. Halin tsarki yana farawa da wannan niyya.",
      "Ka maimaita talbiyya sau da yawa yayin da kake tafiya zuwa Makkah har sai ka fara tawaf. Wannan sanarwa ce cewa kai kaɗai kake amsa kiran Allah.",
    ],
    actions: ["Yi amfani da jerin ayyukan Umrah domin alamta kowane aiki yayin da ka kammala shi."],
    appLinks: [{ label: "Jerin ayyukan Umrah" }],
  },
  {
    title: "Tawafin Ka'aba",
    summary: "Zagaye bakwai a bayan agogo, farawa daga Dutsen Baki.",
    body: [
      "Ka zagaya Ka'aba sau bakwai a bayan agogo, farawa da kammalawa a kusurwar Dutsen Baki. Ka sumbata, ko ka taɓa shi, ko ka nuna masa da hannu tare da takbir idan taro ya yi yawa — bin aikin Annabi ﷺ ba tare da cutar wasu ba.",
      "Maza suna yin raml (gudu-gudu) a zagaye uku na farko da idtiba' (buɗe hagun kafada dama) yayin wannan tawafin zuwan Umrah, bisa Sunnah da aka fi sani.",
      "Tsakanin Kusurwar Yemen da Dutsen Baki, an ƙarfafa ka ce: «Ya Ubangijinmu, Ka ba mu alheri a duniya da alheri a Lahira, kuma Ka tsare mu daga azabar Wuta» (Alkur'ani 2:201).",
    ],
    quran: [
      {
        excerpt:
          "Ya Ubangijinmu, Ka ba mu a cikin duniya abin da yake alheri, da cikin Lahira abin da yake alheri, kuma Ka tsare mu daga azabar Wuta.",
      },
    ],
  },
  {
    title: "Raka'a biyu da Zamzam",
    summary: "Ka yi sallah a bayan Maqam Ibrahim idan zai yiwu, sannan ka sha ruwan Zamzam.",
    body: [
      "Bayan tawaf, ka yi sallar raka'a biyu a bayan Maqam Ibrahim idan akwai wuri, ko a wani wuri a masallacin idan taro ya yi yawa — bisa maganar Allah: «...Kuma ku riƙi, (ya ku masu imani), daga wurin tsayawar Ibrahim, wurin sallah...» (Alkur'ani 2:125).",
      "Sannan ka sha ruwan Zamzam. Bayanin Jabir na Hajjin Annabi ﷺ ya haɗa da shan Zamzam bayan tawaf; Annabi ﷺ ya ce Zamzam yana biyan duk abin da an sha shi don shi (rahotanni tabbatattu da malaman baya suka tara; ka ɗauki niyya da addu'a a matsayin abin da aka ƙarfafa).",
    ],
    quran: [
      {
        excerpt:
          "...Kuma ku riƙi, (ya ku masu imani), daga wurin tsayawar Ibrahim, wurin sallah...",
      },
    ],
  },
  {
    title: "Sa'i tsakanin Safa da Marwah",
    summary: "Zagaye bakwai domin tunawa da neman ruwa na Hajar.",
    body: [
      "Allah Ya ce: «Lalle Safa da Marwah suna daga cikin alamomin Allah. Don haka duk wanda ya yi Hajji zuwa Gidan ko ya yi Umrah — babu laifi a kansa ya yi tafiya tsakaninsu...» (Alkur'ani 2:158).",
      "Ka yi tafiya sau bakwai tsakanin Safa da Marwah, farawa daga Safa. A Safa, ka fuskanci Ka'aba, ka daga hannuwanka da takbir da addu'a kamar yadda Annabi ﷺ ya yi. Maza suna yin gudu-gudu tsakanin alamomin kore.",
    ],
    quran: [
      {
        excerpt:
          "Lalle Safa da Marwah suna daga cikin alamomin Allah. Don haka duk wanda ya yi Hajji zuwa Gidan ko ya yi Umrah — babu laifi a kansa ya yi tafiya tsakaninsu...",
      },
    ],
  },
  {
    title: "Halq ko taqsir — kammala Umrah",
    summary: "Maza su aske ko su datse; mata su datse tsawon yatsa — sannan ihram ya ƴanta.",
    body: [
      "Maza su aske kai (halq) — abin da Annabi ﷺ ya yi addu'a sau uku a kai — ko su datse daidai (taqsir). Mata su tara gashinsu su datse tsawon yatsa. Da wannan, Umrah ta kammala kuma hane-hanen ihram sun ƴanta.",
      "Abdullah ibn Umar ya ruwaito cewa Manzon Allah ﷺ ya ce: «Ya Allah, Ka jikan waɗanda suka aske kansu.» Suka ce: «Kuma waɗanda suka datse, ya Manzon Allah?» Ya ce: «Ya Allah, Ka jikan waɗanda suka aske kansu.» Suka ce: «Kuma waɗanda suka datse, ya Manzon Allah?» Ya ce a karo na uku: «Da waɗanda suka datse» (Sahih al-Bukhari 1727; Sahih Muslim 1301).",
    ],
    hadith: [
      {
        excerpt:
          "Ya Allah, Ka jikan waɗanda suka aske kansu... Da (karo na uku) waɗanda suka datse.",
      },
      {
        excerpt:
          "Ya Allah, Ka gafarta wa waɗanda suka aske kansu... sannan ya ce a karo na uku: da waɗanda suka datse gashinsu.",
      },
    ],
  },
  {
    title: "8 Zulhijja — Ranar Tarwiyah",
    summary: "Ka shiga ihram don Hajji ka kwana a Mina.",
    body: [
      "Ga alhazan Tamattu': ku yi niyyar Hajji ku sake shiga ihram daga mazauninku a Makkah, ku sabunta talbiyya. Alhazan Ifrad da Qiran sun riga suna cikin ihram.",
      "Ku tafi Mina ku yi sallar Azahar, La'asar, Magariba, Isha'i, da Asuba mai zuwa, kowanne a taƙaice zuwa raka'a biyu a lokacinsa, bin aikin Annabi ﷺ a Hajjin Bankwana kamar yadda Jabir ya ruwaito (Sahih Muslim 1218). Ku ci gaba da ibada a rana da dare, ana jiran Arafah.",
    ],
    hadith: [
      {
        excerpt:
          "Dogon labarin Jabir game da Hajjin Bankwana na Annabi ﷺ — wanda ya haɗa da zama a Mina da tsarin ayyuka.",
      },
    ],
    actions: ["Buɗe jerin ayyukan Hajji da safiyar ranar 8."],
    appLinks: [{ label: "Jerin ayyukan Hajji" }],
  },
  {
    title: "9 Zulhijja — Ranar Arafah",
    summary: "Ka tsaya a cikin Arafah har faɗuwar rana; sannan ka koma Muzdalifah.",
    body: [
      "Ka kasance cikin iyakar Arafah daga bayan tsakar rana har faɗuwar rana cikin addu'a, zikiri, da tuba. Annabi ﷺ ya ce «Hajji shine Arafah» (Sunan Abi Dawud 1949). Ka fuskanci alkibla, ka daga hannuwanka, ka roƙi Allah — wannan yana daga cikin lokutan mafi girma na addu'a.",
      "Ka yi sallar Azahar da La'asar tare a taƙaice a lokacin Azahar (jam' taqdim), sannan ka keɓe sauran rana ga addu'a maimakon sallar son rai — bin aikin Annabi ﷺ (Sahih Muslim 1218).",
      "Bayan faɗuwar rana, ka tafi cikin nutsuwa zuwa Muzdalifah. Ka haɗa Magariba da Isha'i (Isha'i a taƙaice), ka huta da dare, ka tara tsakuwa domin jifa. Marasa ƙarfi da mata na iya tafiya Mina bayan tsakar dare bisa izinin da aka fi sani a Sunnah.",
    ],
    hadith: [
      { excerpt: "Hajji shine Arafah." },
      {
        excerpt:
          "Annabi ﷺ ya haɗa Azahar da La'asar a Arafah, sannan ya tashi bayan faɗuwar rana zuwa Muzdalifah...",
      },
    ],
  },
  {
    title: "10 Zulhijja — Ranar Nahr",
    summary: "Jifa, yanka, gashi, da Tawaf al-Ifadah.",
    body: [
      "Ku koma zuwa Mina ku jefi tsakuwa bakwai a Jamrat al-Aqaba (babban ginshiƙi), kuna cewa Allahu akbar a kowace jifa — aiki na farko na ranar a tsarin Hajjin Bankwana.",
      "Ku yi yankan da ake buƙata domin Tamattu' da Qiran (Alkur'ani 2:196), ko ku shirya ta hannun kamfani amintacce. Ana cin nama ana kuma bayarwa ga matalauta.",
      "Ku yi aske (halq) ko datsawa (taqsir); mata su datse tsawon yatsa. Bayan jifa da askewa/datsawa, saki na farko (tahallul awwal) ya faru — mafi yawan hane-hanen ihram sun ƴanta sai jima'i.",
      "Ku tafi Makkah domin Tawaf al-Ifadah — rukuni na Hajji — da sa'i domin alhazan Tamattu' (Ifrad/Qiran waɗanda suka riga sun yi sa'i tare da tawafin zuwansu, su bi hukuncin madhabinsu). Wannan yana kammala cikakken saki daga ihram.",
    ],
    quran: [
      {
        excerpt:
          "...Kuma duk wanda ya more da Umrah zuwa Hajji, sai ya yi abin da ya sauƙaƙa daga dabbobin yanka...",
      },
    ],
    madhhabNote:
      "Tsarin ayyukan Ranar Nahr yana da sauƙi a Sunnah; madhabobi sun bambanta kan ainihin tsari da kan lokacin da ake buƙatar sa'i domin kowane nau'in Hajji. Ku bi jagoran ƙungiyarku.",
  },
  {
    title: "11–13 Zulhijja — Kwanakin Tashreeq",
    summary: "Kwana a Mina, jifan Jamarat uku kullum, sannan tawafin bankwana.",
    body: [
      "Ku kwana ranakun 11, 12 (da 13 idan ba ku tafi da wuri ba) a Mina. Waɗannan kwanaki ne na ci, sha, da ambaton Allah.",
      "Kowace la'asar bayan Azahar, ku jefi tsakuwa bakwai a kowane ginshiƙi uku bisa tsari — ƙarami, sannan matsakaici, sannan babba — kuna takbir a kowace jifa. Duk wanda ya gaggauta zai iya tafiya bayan jifar ranar 12 (Alkur'ani 2:203).",
      "Kafin barin Makkah, ku yi Tawaf al-Wada' domin aikin ƙarshe da Gidan ya zama na bankwana. Ibn Abbas ya ruwaito cewa an umarci mutane cewa aikinsu na ƙarshe ya kasance a Gidan, sai an sauwaƙa wa mace mai jinin haila (Sahih al-Bukhari 1755; Sahih Muslim 1328).",
    ],
    quran: [
      {
        excerpt:
          "Kuma ku ambaci Allah cikin kwanaki ƴan ƴan lissafi. Sannan duk wanda ya gaggauta a cikin kwanaki biyu — babu laifi a kansa; kuma duk wanda ya jinkirta — babu laifi a kansa — ga wanda ya ji tsoron Allah...",
      },
    ],
    hadith: [
      {
        excerpt:
          "An umarci mutane su yi tawafin bankwana na Ka'aba a matsayin aiki na ƙarshe, sai matan da suke jinin haila da aka yafe musu.",
      },
      {
        excerpt:
          "An umarci mutane cewa aikinsu na ƙarshe ya kasance a Gidan, amma an sauwaƙa wa mace mai jinin haila.",
      },
    ],
  },
  {
    title: "Rukunnai da wajibobi",
    summary: "Abin da yake ɓata Hajji idan ya ɓace, da abin da za a iya biya da yanka.",
    body: [
      "Rukunnai (arkan) su ne ainihin Hajji. Idan aka rasa rukuni, Hajji ya ɓaci kuma ba za a iya gyara shi da yanka kaɗai ba — dole ne a maimaita. Galibin malamai suna lissafa: ihram (niyya), tsayawa a Arafah, Tawaf al-Ifadah, da sa'i.",
      "Wajibobi (wajibat) sun haɗa da shiga ihram daga miqat, kwana a Muzdalifah, jifan Jamarat, kwana kwanakin Tashreeq a Mina, da Tawafin Bankwana. Rasa wajibi ba ya ɓata Hajji amma ana biya shi da dam (yanka) bisa ga madhabobi.",
    ],
    madhhabNote:
      "Ainihin jerin arkan da wajibat sun bambanta tsakanin madhabobi huɗu. Ka tabbatar da jagora masani domin madhabinka — musamman idan wani abu ya ɓace ƙarƙashin matsin taro.",
    disclaimer: "Wannan taƙaitawa ce mai amfani, ba fatawa a kan ayyukan da suka ɓace ba.",
  },
  {
    title: "Ladabi da ikhlasi",
    summary: "Ka tsare harshe da gaɓoyi — karɓuwa yana da alaƙa da hali.",
    body: [
      "Hadisin dawowa ba tare da zunubi ba (Bukhari 1521; Muslim 1350) ya bayyana cewa Hajji yana ɓata ta alfasha (rafath), zunubi (fusuq), da husuma. Haƙuri, tausasawa, da taimakon sauran alhazai wani sashe ne na ibada.",
      "Ka hana wayoyi da hira mara amfani daga mamaye Arafah da masallaci. Ka bar wa wasu wuri a tawaf; kada ka tura zuwa Dutsen Baki. Hajji karɓaɓɓe abokiyar Aljanna ce — ka yi ƙoƙarin samun hali mafi kyau a duk tsawon tafiya.",
    ],
    hadith: [
      {
        excerpt:
          "Duk wanda ya yi Hajji don Allah, bai yi jima'i ba kuma bai yi zunubi ba, zai dawo kamar yadda yake a ranar da mahaifiyarsa ta haife shi.",
      },
    ],
    actions: [
      "Ka kafa niyya ta kullum: aiki ɗaya na kirki da addu'a ɗaya mai gaskiya sama da taro.",
    ],
  },
  {
    title: "Biza da rijista",
    summary: "Ka yi amfani da hanyoyin hukuma — Nusuk da hukumar Hajji ta ƙasarka.",
    body: [
      "Nusuk (nusuk.sa) shine dandalin hukuma na Saudi Arabia domin Hajji da Umrah — biza, masaukin baƙi, jigilar mutane, da fakitocin rijista. Masu shiga tsakani ba na hukuma ba galibi sune tushen zamba.",
      "Kowace ƙasa tana samun adadin Hajji na shekara-shekara; galibin alhazai suna neman rijista ta hukumar Hajji ta ƙasarsu ko wakilin da aka ba izini. Umrah ba ta da iyakar adadi kuma za a iya shirya ta a mafi yawan lokutan shekara ta hanyoyin da aka amince da su.",
    ],
    actions: [
      "Ka shigar da buƙatarka da wuri lokacin da lokacin ya buɗe.",
      "Ka yi rijista ta kamfanonin da Nusuk ya lissafa ko hukumar ƙasarka kawai.",
      "Ka tabbatar da hanyoyin biyan kuɗi kafin canja kuɗi.",
    ],
    disclaimer:
      "Ƙa'idojin shiga da dandamali suna canzawa; ka koyaushe tabbatar da gidajen yanar gizo na hukuma.",
  },
  {
    title: "Abin da za a tattara",
    summary: "Ihram, kayan wanka marasa turare, takardu, da tafiya cikin sauƙi.",
    body: [
      "Maza: aƙalla kayan ihram biyu marasa ɗinki da bel don takardu. Mata: tufafi masu sauƙi na kamewa. Takalman da za su iya shiga cikin sauƙi; jaka ƙarama da kwalbar ruwa.",
      "Ka tattara sabulu da man rana marasa turare — turare haramun ne a ihram. Ka riƙe fasfo, takardar biza, rikodin allurar rigakafi, da lambobin gaggawa a jaka ƙarama. Batir ta baka da SIM na gida ko eSIM suna taimakawa cikin taro.",
    ],
    actions: [
      "Jerin abubuwa: ihram ×2, takalma, kayan wanka marasa turare, jakar takardu, magani, batir ta baka.",
      "Ka ɗauki filastan raunuka — alhazai suna tafiya nesa.",
    ],
  },
  {
    title: "Wuraren tsarki a taƙaice",
    summary: "Makkah, Madina, Mina, Arafah, da Muzdalifah — bayanai masu amfani.",
    body: [
      "Masallacin Haram yana kewaye da Ka'aba — wurin tawaf da sa'i; ka yi tsammanin taro mai yawa. Masallacin Nabawi a Madina bai kasance sashe na Hajji da kansa ba, amma galibin alhazai suna ziyara; shigar Rawdah ana ƴantawa ta hanyar app na hukuma.",
      "Mina shine garin tanti domin darare 8 da 11–13 Zulhijja. Arafah fili ne mai buɗe — ruwan sha da inuwa suna da muhimmanci a ranar 9. Muzdalifah wurin da alhazai suke huta ƙarƙashin sararin sama suna tara tsakuwa — ana kula da wurin da a sauƙi da niyya.",
    ],
    actions: ["Ka koyi taswirar sauƙi na Mina–Arafah–Muzdalifah kafin tafiya."],
  },
  {
    title: "Kafofin hukuma",
    summary: "Nusuk, hukumar ƙasarka, da Visit Saudi.",
    body: [
      "Ka fara da Nusuk domin biza, fakiti, izinin Rawdah, da jagorar taro. Ka yi amfani da ma'aikatar Hajji ta ƙasarka domin adadi da ƙa'idojin lafiya. Visit Saudi tana bugawa sanarwar shiga da tafiya ta gaba ɗaya.",
      "Idan wata yarjejeniya ta zama mai arha fiye da kima ko wakili ya nemi biya a wajen hanyoyin hukuma, ka tabbatar kai tsaye da dandalin ma'aikatar kafin ka biya.",
    ],
    actions: [
      "Ka ajiye nusuk.sa da gidan yanar gizon hukumar Hajji ta ƙasarka a matsayin abin da ka fi so.",
      "Ka ajiye lambobin gaggawa daga shugaban ƙungiyarka.",
    ],
    disclaimer: "Jagora mai amfani, ba madadin mai baiwa Hajji/Umrah hukuma ba.",
  },
];

export const HAJJ_CHECKLIST_HA: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Shiga ihram don Hajji",
    hint: "Yi niyyar Hajji ka shiga ihram (daga Makkah domin tamattu'); sabunta talbiyya.",
    day: "8 Zulhijja",
  },
  {
    title: "Tafiya Mina",
    hint: "Yi sallar Azahar har Asuba a Mina, kowanne a taƙaice a lokacinsa.",
    location: "Mina",
    day: "8 Zulhijja",
  },
  {
    title: "Tsayawa a Arafah",
    hint: "Ka kasance cikin Arafah daga bayan tsakar rana har faɗuwar rana cikin addu'a da zikiri.",
    location: "Arafah",
    day: "9 Zulhijja",
  },
  {
    title: "Haɗa Azahar da La'asar",
    hint: "Yi sallar Azahar da La'asar tare a taƙaice a lokacin Azahar, sannan ka mai da hankali ga addu'a.",
    location: "Arafah",
    day: "9 Zulhijja",
  },
  {
    title: "Koma Muzdalifah",
    hint: "Bayan faɗuwar rana, haɗa Magariba da Isha'i, huta, ka tara tsakuwa.",
    location: "Muzdalifah",
    day: "9 Zulhijja",
  },
  {
    title: "Jifan Jamrat al-Aqaba",
    hint: "Jefi tsakuwa bakwai a babban ginshiƙi kana takbir a kowace jifa.",
    location: "Mina",
    day: "10 Zulhijja",
  },
  {
    title: "Yin yanka",
    hint: "Ana buƙata domin tamattu' da qiran — yanka ko shirya ta kamfani amintacce.",
    day: "10 Zulhijja",
  },
  {
    title: "Halq ko taqsir",
    hint: "Maza su aske ko datse; mata su datse tsawon yatsa (saki na farko).",
    day: "10 Zulhijja",
  },
  {
    title: "Tawaf al-Ifadah",
    hint: "Yi Tawaf al-Ifadah da sa'i domin tamattu' — rukuni na Hajji.",
    location: "Masjid al-Haram",
    day: "10 Zulhijja",
  },
  {
    title: "Kwana a Mina",
    hint: "Ka kwana ranakun 11, 12 (da 13 idan ba ka tafi da wuri ba) a Mina.",
    location: "Mina",
    day: "11–13 Zulhijja",
  },
  {
    title: "Jifan Jamarat uku",
    hint: "Bayan Azahar kowace rana, jefi ƙarami, matsakaici, sannan babba — bakwai kowanne.",
    location: "Mina",
    day: "11–13 Zulhijja",
  },
  {
    title: "Tawafin Bankwana",
    hint: "Yi Tawaf al-Wada' kafin barin Makkah (an yafe wa mata masu jinin haila).",
    location: "Masjid al-Haram",
    day: "Tashi",
  },
];

export const UMRAH_CHECKLIST_HA: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Shiga ihram",
    hint: "A ko kafin miqat: wanka, tufafin ihram, niyyar Umrah, talbiyya.",
    location: "Miqat",
  },
  { title: "Karanta talbiyya", hint: "Maimaita Labbayk... sau da yawa har sai ka fara tawaf." },
  {
    title: "Tawafin Ka'aba",
    hint: "Zagaye bakwai a bayan agogo daga Dutsen Baki; maza: raml da idtiba'.",
    location: "Masjid al-Haram",
  },
  {
    title: "Yi sallar raka'a biyu",
    hint: "A bayan Maqam Ibrahim idan zai yiwu, sannan sha Zamzam.",
    location: "Masjid al-Haram",
  },
  {
    title: "Sa'i tsakanin Safa da Marwah",
    hint: "Zagaye bakwai farawa daga Safa; maza suna gudu-gudu tsakanin alamomin kore.",
    location: "Masjid al-Haram",
  },
  {
    title: "Halq ko taqsir",
    hint: "Maza su aske ko datse; mata su datse tsawon yatsa — Umrah ta kammala.",
  },
];
