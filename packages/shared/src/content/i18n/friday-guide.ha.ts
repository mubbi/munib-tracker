import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Hausa translation overlay for the Learn Friday (Jumu'ah) guide. Mirrors the order of
// FRIDAY_GUIDE_TOPICS in ../friday-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const FRIDAY_GUIDE_TOPICS_HA: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Falalar ranar Juma'a",
    summary:
      "Rana mafi kyau da rana take fitowa — halittar Adamu, da gafara tsakanin Jumma'a biyu.",
    body: [
      "Juma'a (Yawm al-Jumu'ah) ita ce ranar taro ta mako-mako ta wannan Ummah. Abu Hurayra ya ruwaito cewa Manzon Allah ﷺ ya ce: 'Rana mafi kyau da rana ta taso a kanta ita ce Juma'a; a ranar ne aka halicci Adamu, a ranar ne ya shiga Aljanna, a ranar ne aka fitar da shi daga cikinta, kuma Sa'a ta Ƴarshe ba za ta faru a wata rana ba sai Juma'a' (Sahih Muslim 854).",
      "Ibadar ta ma tana ɗauke da alkawarin gafara na dindindin. Abu Hurayra ya ruwaito cewa Annabi ﷺ ya ce: 'Duk wanda ya yi wanka ranar Juma'a, sannan ya zo sallar Juma'a, ya saurara ya kuma yi shiru yayin da limami yake gabatar da khutba, za a gafarta masa zunubansa tsakanin wannan Juma'a da mai zuwa, tare da wasu kwanaki uku' (Sahih Muslim 857).",
      "Waɗannan falaloli kira ne na yin shiri tun da wuri, sauraro da hankali, da kuma ɗaukar Juma'a a matsayin sabuntawa ta ruhi ta mako-mako — ba kawai a matsayin ranar hutu ba.",
    ],
    hadith: [
      {
        excerpt:
          "Rana mafi kyau da rana ta taso a kanta ita ce Juma'a; a ranar ne aka halicci Adamu, a ranar ne ya shiga Aljanna, a ranar ne aka fitar da shi daga cikinta, kuma Sa'a ta Ƴarshe ba za ta faru a wata rana ba sai Juma'a.",
      },
      {
        excerpt:
          "Duk wanda ya yi wanka ranar Juma'a, sannan ya zo sallar Juma'a, ya saurara ya kuma yi shiru yayin da limami yake gabatar da khutba, za a gafarta masa zunubansa tsakanin wannan Juma'a da mai zuwa, tare da wasu kwanaki uku.",
      },
    ],
    actions: [
      "Ku yi niyya da safiyar Juma'a: wanka, tufafi mafi kyau, da isowa da wuri.",
      "Ku ɗauki khutba a matsayin ibada — shiru da kulawa sun zama ɓangare na lada.",
    ],
  },
  {
    title: "Juma'a — wajibi na mako-mako",
    summary:
      "Sallar Juma'a ta jama'a wanda aka umarta a cikin Alkur'ani, tana maye gurbin sallar Azahar ga waɗanda suke halarta.",
    body: [
      "Allah ya umarci sallar Juma'a da sunanta: 'Ya ku waɗanda suka yi imani, idan an yi kiran sallah ranar Juma'a, ku yi gaggawa zuwa ambaton Allah kuma ku bar ciniki. Wannan ya fi alheri a gare ku, idan da kun sani' (Alkur'ani, 62:9). Ayoyi masu biyowa sun sake mayar da izinin yaɗuwa da neman falalar Allah bayan sallar (Alkur'ani, 62:10–11).",
      "Juma'a ta ƴunshi khutba mai kashi biyu sannan raka'a biyu da ake sallah da babbar murya a bayan limami, kuma tana maye gurbin sallar Azahar ga waɗanda suke halarta. Tariq ɗan Shihab ya ruwaito cewa Annabi ﷺ ya ce sallar Juma'a a jama'a wajibi ne a kan kowane Musulmi sai mutum huɗu: bawa, mace, yaro, ko marar lafiya (Sunan Abi Dawud 1067).",
      "Sakaci gargaɗi ne mai tsanani: Abu al-Ja'd ya ruwaito cewa duk wanda ya bar sallar Juma'a sau uku saboda rashin kulawa, Allah zai sa hatimi a kan zuciyarsa (Sunan an-Nasa'i 1369). Yayin khutba, magana banza tana ɓata lada — Abu Hurayra ya ruwaito cewa idan ka ce wa abokinka 'Yi shiru' yayin da limami yake magana, kai ma ka yi magana ba daidai ba (Sahih al-Bukhari 934).",
      "Bayan Juma'a, an shawarci yin raka'a huɗu: Abu Hurayra ya ruwaito cewa Annabi ﷺ ya ce, 'Idan wani daga cikinku ya yi sallar Juma'a, sai ya yi raka'a huɗu a bayanta' (Sahih Muslim 881).",
    ],
    quran: [
      {
        excerpt:
          "Ya ku waɗanda suka yi imani, idan an yi kiran sallah ranar Juma'a, ku yi gaggawa zuwa ambaton Allah kuma ku bar ciniki. Wannan ya fi alheri a gare ku, idan da kun sani. Kuma idan an gama sallar, ku yaɗu a cikin ƴasa ku nemi falalar Allah...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sallar Juma'a a jama'a wajibi ne a kan kowane Musulmi, sai mutum huɗu: bawa, mace, yaro, ko marar lafiya.",
      },
      {
        excerpt:
          "Duk wanda ya bar sallar Juma'a sau uku saboda rashin kulawa, Allah zai sa hatimi a kan zuciyarsa.",
      },
      {
        excerpt:
          "Idan ka ce wa abokinka 'Yi shiru' ranar Juma'a yayin da limami yake gabatar da khutba, kai ma ka yi magana ba daidai ba (laghawta).",
      },
      { excerpt: "Idan wani daga cikinku ya yi sallar Juma'a, sai ya yi raka'a huɗu a bayanta." },
    ],
    actions: [
      "Ku shirya tafiyarku don ku isa masallaci kafin khutba ta fara.",
      "Ku sa wayoyinku a shiru kuma ku guji magana yayin khutba.",
      "Ku yi raka'a huɗu bayan Juma'a idan zai yiwu.",
    ],
    appLinks: [{ label: "Koyi Sallah — darasin Juma'a" }, { label: "Buɗe Na'urar Bibiya" }],
    disclaimer:
      "Ƴarancin mutanen da ake buƴata don Juma'a mai inganci, da ko an ƴarfafa mata da matafiya su halarta, tambayoyin fikihu ne masu tsanani da suka bambanta dangane da makaranta da al'adar gida. Mata, matafiya, da marasa lafiya waɗanda ba su halarta suna yin sallar Azahar a maimako. Wannan bayani ne na ilmi, ba fatawa ba.",
  },
  {
    title: "Shirya wa Juma'a",
    summary: "Wanka, tufafi masu tsafta, turare, da isowa da wuri don lada mafi girma.",
    body: [
      "Shiri ɓangare ne na Sunnar Juma'a. Abu Sa'id al-Khudri ya ruwaito cewa Manzon Allah ﷺ ya ce: 'Wanka ranar Juma'a wajibi ne a kan duk wanda ya kai ga balaga' (Sahih Muslim 846). Wata magana kama da wannan a cikin Sahih al-Bukhari (877) ita ma ta danganta wankan Juma'a da waɗanda suka kai ga balaga.",
      "Bayan wanka, Annabi ﷺ ya ƴarfafa kamanni mafi kyau. Salman al-Farisi ya ruwaito cewa Annabi ﷺ ya ce: 'Duk wanda ya yi wanka ranar Juma'a, ya tsarkake kansa yadda zai iya, sannan ya yi amfani da man (gashinsa) ko turare, sannan ya fita, kuma ba tare da tunkuɗewa tsakanin mutum biyu ba ya zauna a wurinsa yana sauraron limami har ya ƴare, sannan ya yi sallar da aka wajabta masa — za a gafarta masa zunubansa tsakanin wannan Juma'a da mai zuwa' (Sahih al-Bukhari 883).",
      "Zuwa da wuri yana ƴaruwa lada. Abu Hurayra ya ruwaito cewa duk wanda ya tafi a sa'a ta farko yana kama da wanda ya miƴa raƴumi, sannan saniya, sannan rago, sannan kaza, sannan ƴwai — kuma idan limami ya fito, mala'iku sukan naɗe littattafansu su saurari tunatarwar (Sahih al-Bukhari 881).",
    ],
    hadith: [
      { excerpt: "Wanka ranar Juma'a wajibi ne a kan duk wanda ya kai ga balaga." },
      {
        excerpt:
          "Yin wanka ranar Juma'a wajibi ne a kan kowane Musulmi namiji da ya kai shekarun balaga.",
      },
      {
        excerpt:
          "Duk wanda ya yi wanka ranar Juma'a, ya tsarkake kansa yadda zai iya, sannan ya yi amfani da mansa ko turare, sannan ya fita, kuma ba tare da tunkuɗewa tsakanin mutum biyu ba ya zauna a wurinsa yana sauraron limami har ya ƴare, sannan ya yi sallar da aka wajabta masa — za a gafarta masa zunubansa tsakanin wannan Juma'a da mai zuwa.",
      },
      {
        excerpt:
          "Duk wanda ya yi wanka ranar Juma'a, sannan ya tafi da wuri (zuwa masallaci), kamar ya miƴa raƴumi... sannan saniya... sannan rago... sannan kaza... sannan ƴwai. Idan limami ya fito, mala'iku suna zuwa domin su saurari tunatarwar.",
      },
    ],
    actions: [
      "Ku yi wanka safiyar Juma'a (ko kafin fita zuwa masallaci).",
      "Ku sa tufafinku mafi kyau masu tsafta da kunya, kuma idan zai yiwu ku shafa turare mai laushi.",
      "Ku tafi da wuri — masu zuwa da wuri sukan sami lada mafi girma.",
    ],
    appLinks: [{ label: "Koyi Tsarki — Wanka" }],
    disclaimer:
      "Ko wankan Juma'a wajibi ne mai tsauri ko kuwa Sunna mai ƴarfin gaske, ra'ayi ne na tarihi da ke bambanta tsakanin makarantu. Duk sun yarda a kan babbar falalarsa; ku bi tsayayyen aiki na al'ummarku.",
  },
  {
    title: "Suratul Kahf ranar Juma'a",
    summary: "Haske tsakanin Jumma'a biyu, da kariya a cikin ayoyi goma na farko.",
    body: [
      "Karanta Suratul Kahf (Alkur'ani 18) ranar Juma'a wani aiki ne da ake so na mako-mako. Abu Sa'id al-Khudri ya ruwaito cewa Annabi ﷺ ya ce: 'Duk wanda ya karanta Suratul Kahf ranar Juma'a, haske zai haskaka masa tsakanin Jumma'a biyu.' Wannan magana an ruwaito ta ne ta hanyar al-Hakim da al-Bayhaqi kuma Shaikh al-Albani ya ce sahih ce; al'ummu da yawa suna bin ta a matsayin Sunnar Juma'a da ta tabbata.",
      "Daban da haka, ayoyi goma na farko na Suratul Kahf garkuwa ne daga fitinar Dajjal. Abu Darda' ya ruwaito cewa Annabi ﷺ ya ce: 'Duk wanda ya haddace ayoyi goma daga farkon Suratul Kahf, za a kiyaye shi daga Dajjal' (Sahih Muslim 809).",
      "Ku samo lokaci tsakanin daren Alhamis da Magariba ta Juma'a don karanta suratar — ko da ba za ku iya ƴare dukan babin ba, ku fara da ayoyin buɗewa ku kuma koma yadda za ku iya.",
    ],
    quran: [
      {
        excerpt:
          "Godiya ta tabbata ga Allah wanda ya saukar da Littafi ga bawansa kuma bai sanya wani karkata a cikinsa ba... Ko kuwa ka yi tunani cewa mutanen kogo da rubutun sun kasance abin mamaki a cikin ayoyinmu?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Duk wanda ya karanta Suratul Kahf ranar Juma'a, haske zai haskaka masa tsakanin Jumma'a biyu. (Al-Albani ya kimanta ta a matsayin sahih)",
      },
      {
        excerpt:
          "Duk wanda ya haddace ayoyi goma daga farkon Suratul Kahf, za a kiyaye shi daga Dajjal.",
      },
    ],
    actions: [
      "Ku buɗe Suratul Kahf ranar Juma'a ku karanta abin da za ku iya da halartar zuciya.",
      "Ku haddace ko ku sake nazarin ayoyi goma na farko domin kariya daga Dajjal.",
    ],
    appLinks: [{ label: "Karanta Suratul Kahf" }],
    disclaimer:
      "Ruwaya ta 'haske tsakanin Jumma'a' ba ta cikin Littattafai Shida ba; an yarda da ita sosai bisa tabbatarwa ta baya-bayan nan. Kariyar ayoyi goma na farko (Muslim 809) sahih ce ba tare da sabani ba.",
  },
  {
    title: "Salati akan Annabi ﷺ ranar Juma'a",
    summary: "Ku ƴara albarku a kan Annabi ﷺ a ranar mafi kyau ta mako.",
    body: [
      "An keɓance Juma'a domin yawaita salati. Aws ɗan Aws ya ruwaito cewa Annabi ﷺ ya ce: 'Cikin mafi kyawun kwanakinku akwai Juma'a; saboda haka ku ƴara salatinku a kaina a ranar, domin za a gabatar da salatinku a gare ni.' Suka ce: 'Ya Manzon Allah, yaya za a gabatar da salatinmu a gare ka alhali kai ka riga ka ruɓe?' Ya ce: 'Allah ya hana ƴasa cin jikunan annabawa' (Sunan Abi Dawud 1047).",
      "Kowace hanya ingantacciya ta salati tana ƴidayuwa — durudan da ake koyar da su a cikin sallah, ko kuma dogayen sifofin da suka fito daga Sunna. Abin da yake muhimmi shi ne ƴaruwa da gaskiya ranar Juma'a, ba adadi ɗaya tabbatacce ba.",
    ],
    hadith: [
      {
        excerpt:
          "Cikin mafi kyawun kwanakinku akwai Juma'a; saboda haka ku ƴara salatinku a kaina a ranar, domin za a gabatar da salatinku a gare ni.",
      },
    ],
    actions: [
      "Ku sanya wa kanku burin salati na kashin kai ranar Juma'a — ko da adadi ne mai sauƴi, mai daidaituwa.",
      "Ku yi amfani da tarin durudai a cikin manhajar idan kuna son shiri a hannu.",
    ],
    appLinks: [{ label: "Durudai" }],
  },
  {
    title: "Sa'ar amsawa",
    summary:
      "Sa'a a ranar Juma'a inda ba a ƴin ƴaryata addu'a — ku neme ta musamman bayan la'asar.",
    body: [
      "Abu Hurayra ya ruwaito cewa Manzon Allah ﷺ ya ambaci Juma'a ya kuma ce: 'Akwai sa'a a ranar Juma'a wanda babu wani bawan Musulmi da zai tsaya ya roƴi Allah wani abu sai Ya ba shi' — kuma ya nuna da hannunsa cewa tana da guntu (Sahih al-Bukhari 935; haka kuma Sahih Muslim 852).",
      "Malamai sun sassaba a kan ainihin lokacin wannan sa'ar. Ra'ayi mai ƴarfi ya sanya ta a ƴarshen Juma'a bayan la'asar: Jabir ɗan Abdullah ya ruwaito cewa Annabi ﷺ ya ce: 'Juma'a sa'o'i goma sha biyu ne, kuma a cikinta akwai sa'a wanda babu wani bawan Musulmi da zai roƴi Allah wani abu sai Ya ba shi — saboda haka ku nemi ta a sa'a ta ƴarshe bayan la'asar' (Sunan Abi Dawud 1048).",
      "Ko wace ra'ayi ce kuka bi, ku cika ranar Juma'a — musamman marece — da addu'a mai gaskiya, istighfar, da salati, kuna dogaro ga alkawarin amsawar Allah.",
    ],
    hadith: [
      {
        excerpt:
          "Akwai sa'a a ranar Juma'a wanda babu wani bawan Musulmi da zai tsaya ya roƴi Allah wani abu sai Ya ba shi — kuma ya nuna da hannunsa cewa tana da guntu.",
      },
      {
        excerpt:
          "Akwai sa'a a ranar Juma'a wanda ba a samun wani Musulmi yana sallah yana roƴon Allah wani abu sai Ya ba shi.",
      },
      {
        excerpt:
          "Juma'a sa'o'i goma sha biyu ne, kuma a cikinta akwai sa'a wanda babu wani bawan Musulmi da zai roƴi Allah wani abu sai Ya ba shi — saboda haka ku nemi ta a sa'a ta ƴarshe bayan la'asar.",
      },
    ],
    actions: [
      "Bayan la'asar ranar Juma'a, ku zauna da jerin gajerun addu'o'i ku roƴa da halartar zuciya.",
      "Ku haɗa addu'a da salati — dukansu biyu an ba su muhimmanci a ranar.",
    ],
    appLinks: [{ label: "Tarin addu'o'i" }],
    disclaimer:
      "Ainihin lokacin sa'ar amsawa batu ne na sabani na malamai (yayin khutba, bayan la'asar, da wasu ra'ayoyi). Wanzuwar sa'ar da kanta tabbatacciya ce a cikin Bukhari da Muslim.",
  },
];
