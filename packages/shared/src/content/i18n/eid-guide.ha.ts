import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Hausa translation overlay for the Learn Eid guide. Mirrors the order of
// EID_GUIDE_TOPICS in ../eid-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const EID_GUIDE_TOPICS_HA: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Sallar Ƴan Sallah (Eid al-Fitr) — bikin karyawar azumi",
    summary: "Ranar farko ta Shawwal, tana nuna ƙarshen azumin Ramadan.",
    body: [
      "Ƴan Sallah tana faɗuwa a ranar 1 ga Shawwal, nan take bayan Ramadan, kuma rana ce ta farin ciki da godiya saboda an sami ikon yin azumi da ibada tsawon wata. Alkur'ani yana danganta ƙarshen azumi kai tsaye da ambaton Allah da godiya: '...domin ku cika ƙidayar, kuma domin ku girmama Allah a kan ya shiryar da ku, kuma domin ku gode' (Alkur'ani 2:185).",
      "Azumin wannan rana haramun ne a fili, ba kawai abin da ba a so ba — Annabi ﷺ ya ambace ta, tare da Babbar Sallah, a matsayin ɗaya daga cikin kwanaki biyu da aka umarci Musulmi da su ci maimakon yin azumi (Bukhari 1990). Ranar tana farawa da Zakkar Fitr da sallar Sallah, kuma tana ci gaba da ziyartar iyalai, musayar fatan alheri, da farin ciki na gaba ɗaya cikin iyakokin Musulunci.",
    ],
    quran: [
      {
        excerpt:
          "...domin ku cika ƙidayar, kuma domin ku girmama Allah a kan ya shiryar da ku, kuma domin ku gode.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Waɗannan kwanaki biyu ne da Manzon Allah ﷺ ya hana azumi a cikinsu: ranar da kuke karya azuminku (na Ramadan), da ranar da kuke ci daga hadayarku.",
      },
    ],
  },
  {
    title: "Babbar Sallah (Eid al-Adha) — bikin hadaya",
    summary: "Ranar 10 ga Zul-Hijja, tunawa da hadayar Ibrahim.",
    body: [
      "Babbar Sallah tana faɗuwa a ranar 10 ga Zul-Hijja, Ranar Yanka a lokacin Hajji, kuma tana tunawa da shirye-shiryen Ibrahim don yin hadayar ɗansa domin biyayya ga Allah, da jinƙan Allah wanda ya fanshe shi da babbar hadaya maimakonsa (Alkur'ani 37:102–107). A ganin malamai da yawa, ita ce mafi girma daga cikin Sallolin biyu, kuma tana zuwa daidai da ƙarshen Hajji ga masu aikin Hajji.",
      "Kamar Ƴan Sallah, azumi a wannan rana haramun ne (Bukhari 1990). Babban ibadar ta ƴan ƙari shi ne hadaya (udhiyah), wanda masu iko suke bayarwa, domin tunawa da miƙa wuyar Ibrahim, kuma a matsayin aiki na ibada da sadaka a lokaci guda.",
    ],
    quran: [
      {
        excerpt:
          "To, a lokacin da ya kai ga tafiya tare da shi, [Ibrahim] ya ce: Ya ɗana, lalle na ga a mafarki cewa ina yanka ka... Kuma Muka fansheshi da babbar hadaya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Waɗannan kwanaki biyu ne da Manzon Allah ﷺ ya hana azumi a cikinsu: ranar da kuke karya azuminku (na Ramadan), da ranar da kuke ci daga hadayarku.",
      },
    ],
  },
  {
    title: "Yadda za a yi sallar Sallah",
    summary: "Raka'a biyu tare da ƴan kabbara na ƴari — babu kira ko kiran sallah.",
    body: [
      "Sallar Sallah raka'a biyu ce, ana yin ta a cikin jama'a ba tare da kira ko kiran sallah gabaninta ba — Jabir ɗan Abdullah da Ibn Abbas duk sun tabbatar cewa ba a yi kira ba don ko wace Sallah a zamanin Annabi ﷺ (Sahih Muslim 886). Ana bin sallar da khutba, sabanin sallar Juma'a inda khutba take zuwa da farko.",
      "Ana ƴara kabbara ('Allahu Akbar') kafin karatu a kowace raka'a, sama da kabbarorin da ake yi a sallah. Aisha ta ruwaito cewa Annabi ﷺ yana yin kabbara sau bakwai a raka'a ta farko da sau biyar a ta biyu, don Sallolin biyu (Sunan Abi Dawud 1149), lambar da aka kuma ruwaito daga Abdullahi ɗan Amru (Abi Dawud 1151).",
    ],
    hadith: [
      {
        excerpt:
          "Ba a yi kiran sallah ranar Ƴan Sallah lokacin da limami ya fito, ko bayan fitowarsa; ba a yi kiran sallah, ko wani abu makamancin haka a ranar.",
      },
      {
        excerpt:
          "Manzon Allah ﷺ yana yin kabbara sau bakwai a raka'a ta farko kuma sau biyar a raka'a ta biyu a ranar karyawar azumi da ranar hadaya.",
      },
    ],
    madhhabNote:
      "Makarantun fikihu sun bambanta a kan adadin ƴan kabbaran nan daidai. Malaman Shafi'i, Maliki, da Hanbali suna bin ruwayar bakwai-biyar (Abi Dawud 1149/1151) — Maliki da Hanbali suna ƙidaya kabbaran farawa a cikin bakwai, don haka suke faɗin shida-biyar. Makarantar Hanafi kuwa tana riƙe da kabbara 3 ƴan ƙari kafin karatu a raka'a ta farko da 3 kafin sujada a ta biyu (jimla 6) — ra'ayin malaman Kufa wanda ba shi da hadisin marfu' da aka tabbatar daban; ku bi adadin kabbaran limamin jama'arku.",
    actions: [
      "Ku zo a kan lokaci — babu kira ko kiran sallah da za su nuna farawa.",
      "Ku bi adadin kabbaran limaminku; aikin ko wace makaranta yana da inganci.",
      "Ku dakata don khutba bayan sallah.",
    ],
  },
  {
    title: "Sunnoni na ranar",
    summary: "Wanka, tufafi mafi kyau, ci kafin/bayan sallah, da hanyoyi biyu daban-daban.",
    body: [
      "Akwai ƴan Sunnoni da aka ba da shawarar yi kafin da bayan sallar Sallah. A Ƴan Sallah, Annabi ﷺ bai fita zuwa sallah ba sai da ya ci ƴan dabino, adadi mara ma'auni (Bukhari 953) — sabanin Babbar Sallah, inda aka ba da shawarar jira da ci daga hadaya bayan komawa daga sallah.",
      "Sunna ce a yi wanka da sanya tufafi mafi kyau (masu tsafta, na kunya) don wannan lokacin, bin al'adar gaba ɗaya ta sahabbai a Sallolin biyu, ko da yake wannan ruwaya ba ta da ƙarfi kamar sauran a nan, kuma al'ada ce da ake bi sosai fiye da hadisi guda mai daraja sahih.",
      "Sunnah ta musamman ita ce komawa ta hanya dabam da wacce aka bi zuwa. Jabir ɗan Abdullah ya ruwaito: 'A ranar Sallah, Annabi ﷺ yana komawa (bayan yin sallar Sallah) ta hanya dabam da wacce ya bi' (Bukhari 986) — yawanci ana bayyana wannan a matsayin ƴaruwar wuraren da suke shaida ibadar mutum da nuna alamomin Musulunci a fili sosai.",
    ],
    hadith: [
      {
        excerpt:
          "Annabi ﷺ bai taɓa fita ba (zuwa sallah) ranar Ƴan Sallah sai da ya ci ƴan dabino, wanda yake ci a adadi mara ma'auni.",
      },
      {
        excerpt:
          "A ranar Sallah, Annabi ﷺ yana komawa (bayan yin sallar Sallah) ta hanya dabam da wacce ya bi.",
      },
    ],
    actions: [
      "Yi wanka da sanya tufafinku mafi kyau na kunya.",
      "Ku ci dabino adadi mara ma'auni kafin sallar Ƴan Sallah; ku jira ci har bayan sallar Babbar Sallah.",
      "Ku koma ta hanya dabam da wacce kuka bi zuwa sallah.",
    ],
  },
  {
    title: "Zakkar Fitr — asali",
    summary: "Sadaka wajaba ƴar ƴan yara, wacce dole ne a bayar kafin sallar Ƴan Sallah.",
    body: [
      "Zakkar Fitr (Sadakar Fitr) sadaka ce ta daban, ƴar ƴan yara fiye da zakkar dukiya, wajaba a kan kowane Musulmi — babba ko yaro, namiji ko mace, ɗa ko wanda ake kula — wanda shugaban gida yake biya a madadinsu. Ibn Umar ya ruwaito cewa Annabi ﷺ ya wajabta sa'i ɗaya (kimanin kilo 2-3) na dabino ko sha'ir a kan kowane Musulmi, da za a biya kafin mutane su fita zuwa sallar Sallah (Bukhari 1503).",
      "An bayyana manufarta a fili a cikin Sunna: 'tsarkakewa ga mai azumi daga magana banza da ta batsa, da abinci ga matalauta' (Abi Dawud 1609). Biyanta kafin sallar Sallah yana ƴana wannan zakkar musamman ce; biyanta bayan sallah har yanzu ƴana ana lissafa ta a matsayin sadaka gaba ɗaya, amma tana rasa ladar musamman da ke da alaƙa da lokacin.",
      "Yawancin al'ummu a yau suna ƴidaya darajarta a kuɗin gida maimakon rarraba dabino ko sha'ir kai tsaye, bin jagorancin malaman gida da hukumomin zakka a kan dararajojin abinci na asali na yanzu — daidaituwa ta aiki, ba canjin wajibinta ba.",
    ],
    hadith: [
      {
        excerpt:
          "Manzon Allah ﷺ ya wajabta biyan Sa'i ɗaya na dabino ko Sa'i ɗaya na sha'ir a matsayin Zakkar Fitr a kan kowane Musulmi, bawa ko ɗa, namiji ko mace, yaro ko babba, kuma ya umarce da a biya shi kafin mutane su fita don yin sallar Sallah.",
      },
      {
        excerpt:
          "Manzon Allah ﷺ ya wajabta Zakkar Fitr a matsayin tsarkakewa ga mai azumi daga magana banza da ta batsa, da kuma abinci ga matalauta. Wanda ya biya shi kafin sallah, zakka ce da aka karɓa; wanda ya biya shi bayan sallah, sadaka ce (ta gama-gari).",
      },
    ],
    actions: [
      "Ku ƴidaya ku ajiye Zakkar Fitr don kanku da masu dogaro da ku.",
      "Ku biya shi kafin fita zuwa sallar Ƴan Sallah idan zai yiwu.",
    ],
    appLinks: [{ label: "Na'urar lissafin zakka" }],
  },
  {
    title: "Hadaya (udhiyah) — asali",
    summary: "Hadayar dabba wanda ake yi a Babbar Sallah, a raba wa matalauta.",
    body: [
      "Hadaya ita ce yankan dabba mai cancanta (tunkiya, akuya, saniya, ko rakumi, mai cika sharuɗɗan shekaru da lafiya) a Babbar Sallah da kwanakin Tashriq masu zuwa, don tunawa da hadayar Ibrahim. Anas ya ruwaito cewa Annabi ﷺ da kansa ya yanka raguna biyu baƴi da fari da hannunsa, yana ambaton sunan Allah da kabbara a kansu (Bukhari 5558) — wannan ya tabbatar cewa yin yankan da kansa, in za a iya, ita ce mafi kyawun aiki, ko da yake ba wa wani wakilci a madadinku ma yana da inganci.",
      "Alkur'ani yana danganta hadaya kai tsaye da raba naman ta: '...ku ci daga cikinsu ku ciyar da matalauci da mai roƴo' (Alkur'ani 22:36). Ana yawanci raba naman tsakanin gidan mutum, iyali da abokai, da matalauta, don haka lokacin ya haɗa ibada, karamci, da godiya tare.",
      "Yankan ya kamata ya kasance bayan sallar Sallah, ba kafin ba — an umurci sahabi wanda ya yanka da wuri da Annabi ﷺ ya sake yi, saboda hadayar da aka yi kafin sallah ba ta ƴana udhiyah ba. Hukunce-hukuncen kan wanda ya wajabta a kansa, da ainihin lokacin, sun bambanta dangane da makaranta; ku tuntuɓi malamin gida mai cancanta don yanayinku.",
    ],
    quran: [
      {
        excerpt:
          "...kuna da alheri a cikinsu. Ku ambaci sunan Allah a kansu yayin da suke a jere [don yanka]; kuma idan sun kwanta [marasa rai] a gefensu, ku ci daga cikinsu ku ciyar da mai bukata da mai roƴo.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Annabi ﷺ ya yanka raguna biyu, baƴi da fari, kuma na gan shi yana saka ƴafarsa a gefensu yana ambaton Sunan Allah kuma yana yin kabbara. Sa'an nan ya yanka su da hannunsa.",
      },
    ],
    actions: [
      "Ku shirya hadayarku kafin Babbar Sallah idan kuna da iko kuma ta wajaba a kanku.",
      "Ku tabbata yankan ya kasance bayan sallar Sallah, ba kafin ba.",
      "Ku raba naman tsakanin gidanku, iyali/abokai, da matalauta.",
    ],
    disclaimer:
      "Ainihin wanda hadaya ta wajaba a kansa, da ainihin lokacin da ya kamata a yanka, tambayoyin fikihu ne masu cikakken bayani wanda ya bambanta dangane da makaranta. Wannan bayani ne na ilmi na gama-gari, ba fatawa ba — ku tuntuɓi malamin gida mai cancanta don yanayinku.",
  },
];
