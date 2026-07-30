// Hausa translation overlay for the Learn "Journey to Jannah" content. Mirrors the order of
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

export const JANNAH_TOPICS_HA: DeepPartial<JannahTopic>[] = [
  {
    title: "Menene Jannah?",
    summary: "Aljannar dawwama Allah ya yi tanadi ga masu takawa.",
    body: [
      "Jannah (Aljannah) ita ce madawwama gidan lada wanda Allah ya tanadar wa wadanda suka yi imani da shi kuma suka aikata ayyukan qwarai. Kalmar a zahiri tana nufin lambun da ba a so, mai inuwa - amma Kur'ani ya yi amfani da shi a zahirin gaskiya fiye da kowane lambun duniya: daular koguna, 'ya'yan itace, gidaje, da abokan tarayya inda mumini yake rayuwa har abada cikin yardar Ubangijinsa. Manufar da kowane annabi ya kira mutane zuwa gare shi ne kuma makomar wannan tafiya gaba ɗaya ta ke.",
      'Rayuwa a Jannah ba kamar komai ba ce a wannan duniya domin ba ta da kowane aibi da ke bata jin dadin duniya. Babu mutuwa, babu ciwo, ba tsufa, ba tsoro, ba baƙin ciki, ba gajiyawa. Mutanenta ba sa yin gardama, ba sa gajiyawa, kuma ba sa rasa abin da suke so. Duk abin da zuciya ta so, an ba shi, kuma Allah Ya ƙarawa daga karimcinSa - "Suna da abin da suke so a cikinsa, kuma a wurinMu akwai ƙari" (k:50:35).',
      "Jin dadin Aljanna ya wuce tunanin dan Adam. A cikin hadisi qudsi, Allah ya ce ya tanadar wa bayinsa salihai abin da ido bai tava gani ba, kunne bai tava ji ba, kuma babu wata zuciya da ta yi ciki. Wannan shine dalilin da ya sa Kur'ani ya siffanta Aljanna a cikin sanannun siffofi - lambuna, koguna, da inuwa - yayin da yake tunatar da mu cewa gaskiyar ta fi kowane kwatance. Mafi girman lada daga gare su, ba wai gidajen Aljannar ba ne, amma yardar Allah, kuma ga madaukakar darajoji, da kallon fuskarSa madaukaka.",
      "Mumini ya riqe gaskiya guda biyu wuri guda. Na farko, Aljanna gaskiya ce, kusa ce, kuma tana da amfani ga kowane ƙoƙari - Kur'ani ya gaya mana mu 'yi tsere' zuwa gare ta (Alkur'ani 3:133). Na biyu, babu mai samun Aljanna ta hanyar aiki kadai; Shigowar qarshe ne da rahamar Allah, tare da ikhlasi na imani da ayyuka na qwarai sune hanyar da ya zava ya karva. Wannan ma'auni yana raya bege ba tare da haifar da girman kai ba: muna yin iyakar ƙoƙarinmu, sannan mu jefa kanmu ga rahamarSa.",
      "A zahiri, bari gaskiyar Jannah ta tsara zaɓin ku na yau da kullun. Lokacin da ibada ta ji nauyi ko kuma jaraba ta ji ƙarfi, ku tuna abin da ake jira da abin da ke kan gungumen azaba. Ka yawaita roqon Allah Aljannah, ka yi mata aiki akai-akai ta qananan hanyoyi masu dorewa, kuma ka bar kwadayin ta tausasa zuciyarka a cikin wannan rayuwa mai gushewa.",
    ],
    quran: [
      {
        excerpt:
          "Ku yi tsẽre zuwa ga gãfara daga Ubangijinku da Aljanna wadda faɗinta ya kasance na sammai da ƙasã, an yi tattalinta dõmin mãsu taƙawa.",
      },
      {
        excerpt:
          "Kuma Allah Yã yi wa´adi ga mũminai maza da mummunai mãtã gidãjen Aljanna, ƙoramu na gudãna daga ƙarƙashinsu, sunã madawwama a cikinsu, da ɗãkirai mãsu dãɗi a cikin gidãjen Aljannar zama. Kuma yardar Allah ne mafi girma.",
      },
      {
        excerpt:
          "Bãbu wani rai sanin abin da aka bõye musu na dãɗi da sakamakon abin da suka kasance sunã aikatãwa.",
      },
      {
        excerpt: "Suna da abin da suke so a cikinta, kuma a wurinMu akwai ƙari.",
      },
      {
        excerpt:
          "Lalle ne waɗanda suka yi ĩmãni, kuma suka aikata ayyukan ƙwarai, sunã da gidãjen Aljannar mafaka.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah ya ce: Na tanadar wa bayina salihai abin da ido bai gani ba, kunne bai ji ba, kuma zuciya ba ta yi ciki ba.",
      },
      {
        excerpt:
          "Allah Maxaukakin Sarki ya ce: “Na tanadar wa bayina salihai abin da ido bai gani ba, kunne bai ji ba, kuma zuciyar mutum ba ta taba gani ba.",
      },
    ],
  },
  {
    title: "Darajoji a Aljanna",
    summary: "Aljanna tana da digiri da yawa - ba ƙayyadadden tsani na bakwai ba.",
    body: [
      "Aljanna ba wuri guda ba ce mai lebur; tana da darajoji da yawa, ana kiranta darajat, kuma muminai suna daga cikinta gwargwadon imaninsu da ayyukansu. Babban kuskuren da ya zama ruwan dare shine cewa Jannah tana da matakai bakwai daidai. Wannan ya rikitar da abubuwa biyu mabanbanta: Kur'ani ya yi maganar sammai bakwai (samawat) - sammai da aka halitta a samanmu - ba madaidaitan matakai guda bakwai na Aljanna ba. Nassosin ba su takaita Jannah zuwa darajoji bakwai ba.",
      "Abin da ingantattun majiyoyi suka gaya mana shi ne, darajoji suna da yawa kuma suna da yawa. Manzon Allah SAW yace Aljanna tana da darajoji dari da aka tanadar wa wadanda suka yi jihadi a tafarkin Allah, kuma tazarar da ke tsakanin mataki daya da na gaba kamar tazarar sammai da kasa ne. Ko da wannan lambar tana nuna girma maimakon tsani mai tsauri da za mu iya hawa ta hanyar buga kwalaye.",
      "Allah yana ɗaukaka kowane mumini gwargwadon ƙarfin imaninsa, da ikhlasin niyyarsu, da nauyin ayyukansu - 'Dukansu suna da darajoji gwargwadon abin da suka aikata' (Alkur'ani 6:132). Matsakaicin matsayi da kowane mutum ya kai Allah ne kaɗai ya san shi. Ru’ya ta Yohanna da gangan ba ta ba mu lissafin injina na ‘yi aiki X don kai matakin N’ ba, domin ana nufin bautar da ƙauna da ikhlasi ne ke motsa su, ba ta ƙidayar daraja ba.",
      "Hikimar da ke cikin wannan kyakkyawa ce. Idan mun san ainihin wurin da aka sanya mu, wasu za su yi farin ciki, wasu kuma za su yanke kauna. A maimakon haka, an koyar da mu da mu zuba ido ga Allah, mu ci gaba da yin jihadi, da kuma yin fata. Mumini yana gasa mai kyau - 'don wannan bari masu fafatawa su yi takara' - yayin da suke barin ƙimar ƙarshe zuwa Mafi Adalci.",
      "Don haka maimakon kididdige kididdigar kididdigar, ku yi nufi zuwa ga kololuwa, kuma Allah Ya sanya ku a inda ya so. Manzon Allah Sallallahu Alaihi Wasallama ya koyar da sahabbai cewa kada su yi tawassuli da wata buqata, sai dai su roqo musamman Al-Firdaws, kololuwar Aljanna.",
    ],
    quran: [
      {
        excerpt: "Domin duk za a sami digiri gwargwadon abin da suka yi.",
      },
      {
        excerpt:
          "Ka dũba yadda Muka fĩfĩta sãshensu a kan sãshe, kuma Lãhira ce mafi girma da darajõji, kuma mafi girma ga rarrabẽwa.",
      },
      {
        excerpt:
          "Kuma wanda ya yi ɗã'a ga Allah da ManzonSa, to, waɗannan sunã tãre da waɗanda Allah Ya yi ni'ima a kansu: annabawa, da masu gaskiya, da shahidai, da sãlihai. To, madalla da abõkan tãrayya!",
      },
    ],
    hadith: [
      {
        excerpt:
          "Aljanna tana da darajoji dari wanda Allah ya tanadar wa masu yaki a tafarkinsa. Tazarar da ke tsakanin kowane matakan biyu kamar tazarar da ke tsakanin sammai da ƙasa ne. Don haka idan za ku roki Allah, ku roke shi Firdausi, domin ita ce mafifici kuma mafi daukakar Aljanna.",
      },
      {
        excerpt:
          "Idan za ku roki Allah, ku roke shi Firdausi, domin ita ce mafi kololuwar Aljanna da tsakiyar Aljanna, kuma daga gare ta ne kogunan Aljanna suke gudana, kuma a samansa akwai Al'arshin Mai rahama.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Al-Firdaws - mafi girma",
    summary: "Kololuwar Aljanna, mafi kusa da Al'arshi.",
    body: [
      "Al-Firdaws shine mafi kololuwar darajar Aljanna mai suna a cikin ingantacciyar Sunnah. Annabi ﷺ ya siffanta ta da mafificin Aljannah da tsakiyarta – ita kanta zuciyarta – wadda kogunan Aljanna suke fitowa, kuma a samanta akwai Al’arshin Mai rahama. Zuwa ga Al-Firdaws shine kusanci ga Allah kamar yadda kowane halitta zai iya zama.",
      "Abin da ya sa wannan maudu'i ya kasance mai amfani shi ne ɗan ja-gorar annabci: idan muka yi addu'a don Aljanna, kada mu yi ƙasƙanci. Manzon Allah ﷺ ya koyar da sahabbai cewa idan sun roki Allah Aljannah, su nemi alfarmar Firdausi ta musamman maimakon su zauna da wata karamar bukata. Karimcin Allah ba shi da iyaka, don haka wani nau'in nakasu ne a roke shi mafi kankanta. Wannan yana koya mana kishi a cikin ibada: Nufin koli kuma sai Allah cikin rahamarSa Ya yanke shawarar inda zai sanya ku.",
      "Ta yaya bawa zai zama dan takarar irin wannan matsayi? Hanyoyi guda daya ne da suke kaiwa ga ita kanta Aljanna, ana bin su da kyawawa: ingantaccen imani (tauhidi) riko da gaskiya, da cikar farillai da Allah ya yi umarni da su, sannan kuma raya rayuwar ibada ta son rai a kansu - sallar dare, da karin azumi, da zikiri, da sadaka, da kyawawan halaye. A cikin wani shahararren hadisi qudsi, Allah ya bayyana yadda bawa yake kusantarsa ​​ta hanyar ayyukan sa kai har Allah ya so shi.",
      "Amma duk da haka kyauta ta ƙarshe kuma mai yanke hukunci kullum rahamar Allah ce. Haka nan kuma da muke nufi zuwa ga mafi daukaka, muna tunawa da fadin Manzon Allah SAW cewa: babu mai shiga Aljanna da ayyukansa shi kadai, har ma da Annabi SAW, face Allah ya lullube shi da rahamarSa. Wannan shi ne madaidaicin ma'auni da mumini ya zo da shi: babban bege da buri a gefe guda, tawali'u na gaske a daya bangaren.",
      "Sabõda haka, ka sanya Al-Firdaws ya zama wani ɓangare na addu'arka, a cikin sujada, a cikin ukun ƙarshe na dare, da kuma gabãnin barci, alhãli kuwa kana yin natsuwa a kowace rana, kuma ka dõgara ga rahamar Ubangijinka ga saura.",
    ],
    hadith: [
      {
        excerpt:
          "Idan za ku roki Allah, ku roke shi Firdausi, domin ita ce mafi kololuwar Aljanna da tsakiyar Aljanna, kuma daga gare ta ne kogunan Aljanna suke gudana, kuma a samansa akwai Al'arshin Mai rahama.",
      },
      {
        excerpt:
          "Babu dayanku da zai shiga Aljanna da aikinsa shi kadai. Sai suka ce: Ba kai ma ya Manzon Allah ba? Ya ce: “Ko da ni, sai Allah Ya lullube ni da wata rahama daga gare Shi.",
      },
    ],
    actions: [
      "Ku roki Allah a cikin addu'o'in ku musamman sujudi da kafin barci.",
      "Kuma ku cika abin da ya wajaba a kanku, sa'an nan kuma ku ƙãra ibada.",
      "Ka yawaita tuba kuma ka dogara da rahamar Allah, ba akan ayyukanka kadai ba.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Abin da ke cutar da Lahira",
    summary: "Manyan zunubai suna bukatar tuba ta gaskiya; gafarar Allah mai girma ce.",
    body: [
      "Wannan sashe ba yana nufin ya tsoratar da ku cikin yanke ƙauna ba - akasin haka. Kuma Allah yana gafarta zunubai ga wanda ya tuba zuwa gare shi da gaskiya, kuma Ya yi bushara da wannan da qarfi: ‚Ka ce: Ya ku bayiNa waxanda suka yi zalunci ga kawunansu, kada ku yanke tsammani daga rahamar Allah. Lallai ne Allah yana gafarta zunubai baki daya.” (k:39:53). Manufar anan ita ce kawai mu san abin da nassosi suka yi gargaɗi a kansa, domin mu gane haɗari kuma mu gaggauta komawa gare shi kafin lokaci ya kure.",
      "Zunubi guda daya ne wanda ya kebanta da kowa: shirka - shirka da Allah a cikin bauta. Wannan zunubi daya ne da Allah ba zai gafartawa ba idan mutum ya mutu a kansa ba tare da ya tuba ba, kamar yadda ya fada a cikin Alkur'ani 4:48. Komai yana karkashin 'Yana gafarta abin da bai kai wannan ba ga wanda Ya so. Don haka ne ma tauhidi madaidaici ya zama ginshiƙi a ƙarƙashin kowane aiki da aka yarda da shi: Gidan da aka gina a kan tsagewar harsashi ba zai iya tsayawa ba.",
      "Bayan shirka, nassoshi suna ba da nauyi na musamman ga barin sallah. Yin watsi da salloli biyar, dagewa ba tare da wani uzuri mai inganci ba, yana daga cikin manya-manyan gargaxi a cikin Sunnah – Manzon Allah SAW ya kira sallah alqawari da ke banbance mumini, ta yadda barin ta yana kusantar kafirci. Sauran manyan zunubai - kisa na zalunci, haramtacciyar dangantaka, cin riba (riba), cin dukiyar maraya, da zalunci mai tsanani - batutuwa ne masu tsanani da suke buƙatar tuba na gaskiya kuma suna iya jawo azaba idan Allah bai gafarta ba.",
      "Abubuwan da ake kira 'ƙananan' zunubai suna da mahimmanci, kuma bai kamata a ɗauke su da wasa ba. Bata, karya, girman kai, yanke zumunta, da rashin gafala a hankali suna zubar da zuciya da hali. Manzon Allah SAW ya yi gargadin cewa kananan zunubai da aka tara suna iya halaka mutum kamar yadda kananan sandunan da aka taru su ke dafa abinci gaba daya. Kowannen su yana bukatar komawar sa zuwa ga Allah.",
      "Abin da za a ɗauka shine bege cikin aiki: kada ka bari girman zunubi ya rinjaye ka cewa tuba ba ta da ma'ana. Ku koma ga Allah idan kun zame, ku bi mummunan aiki da mai kyau don shafe shi, kuma a bude kofar istighfari kowace rana. Rahamarsa kullum tana da girma fiye da kuskurenka.",
    ],
    quran: [
      {
        excerpt:
          "Lalle ne, Allah bã Ya gãfarta yin shirka da Shi, kuma amma Yanã gãfarta abin da bai kai haka ba ga wanda Yake so.",
      },
      {
        excerpt:
          "Ka ce: Ya ku bayiNa wadanda suka yi zalunci a kansu, kada ku yanke tsammani daga rahamar Allah. Lallai Allah yana gafarta zunubai baki daya.",
      },
    ],
    hadith: [
      {
        excerpt: "Alkawarin dake tsakaninmu da su shine sallah; wanda ya bar ta ya yi kafirci.",
      },
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Jerin manyan zunubai a fiqhu sun bambanta a wurin malamai, kuma hukunce-hukuncen daidaikun mutane na mutanen da suka cancanta ne. Wannan tunatarwa ce ta gaba ɗaya don tuba - ba hukunci na mutum ba. Tuntuɓi wani amintaccen malami don halin ku.",
  },
  {
    title: "Wadanda aka girmama a cikin matani",
    summary: "Mutane da kungiyoyi da Annabi ﷺ sunansa dangane da Aljanna.",
    body: [
      "Alkur'ani da Sunna sun kebance wasu mutane, da nau'o'in muminai, da ayyukan da suke daure da bushara da Aljanna. Yana da mahimmanci a karanta waɗannan daidai: rahotanni ne na gaskiya game da waɗancan takamaiman mutane ko kwatance - ba garanti ba ne ga duk wanda kawai ya ji sunansu ko ya yaba su. Bisharar ta dogara ne a kan imaninsu da ayyukansu, kuma kofa ɗaya a buɗe take gare mu ta hanyar iri ɗaya.",
      "Mafi shaharar rukuni ita ce Aljannar Alkawari Goma (al-Asharah al-Mubashsharah), wanda Manzon Allah SAW ya hada sunansa a cikin ruwaya guda daya: Abubakar, Umar, Usman, Ali, Talhah, Zubayr, Abd al-Rahman ibn Awf, Sa'ad bn Abi Waqqas, Sa'id ibn Zayd, da Abu Ubaidah (Allah Ya yarda da su) tare da su Abu Ubaidar (Allah Ya yarda da su). Wadannan su ne mafi kusanci kuma mafi sadaukarwa daga Sahabban Manzon Allah Sallallahu Alaihi Wasallama, da Ahlul-Sunnah suna son su da girmama su baki daya ba tare da wuce gona da iri ko wulakanta kowa daga cikinsu ba.",
      "Bayan wasu mutane masu suna, nassosin sun yi bayanin nau'ikan bushara: masu gaskiya da hakuri, wadanda suka mutu a matsayin shahidai na hakika a tafarkin Allah bisa shari'ar Musulunci, da wadanda kalmominsu na karshe a rayuwar duniya su ne shaidar imani, la ilaha illallah. Kowane kwatanci yana nuni zuwa ga zahirin gaskiya - ikhlasi, sadaukarwa, ko zuciya mai ma'ana ga Allah a numfashin ƙarshe - ba wai kawai alama ta zahiri ba.",
      "Darasin a gare mu ba shine mu sami kwanciyar hankali ta hanyar tarayya ba, ko kuma mu ɗauki waɗannan darajoji don kanmu, amma don samun wahayi. Bari misalinsu ya ja mu zuwa sama: mu so abin da suke so, mu yi jihadi yayin da suke kokari, kuma su mayar da wannan sha’awar ta zama addu’a da aiki, tare da rokon Allah a sama da komai na husn al-khatimah – kyakkyawan karshe.",
    ],
    hadith: [
      {
        excerpt:
          "Abubakar yana Aljanna, Umar yana Aljannah, Usman yana Aljanna, Ali yana Aljannah, Talhah yana Aljannah, Zubairu yana Aljannah, Abdurrahman bn Awf yana Aljannah, Sa'ad yana Aljannah, Sa'id bn Zaid yana Aljannah, Abu Ubaydah bn Al-Jarrah yana Aljannah.",
      },
      {
        excerpt:
          "Duk wanda kalmar karshensa ta kasance 'Babu abin bautawa da gaskiya sai Allah' zai shiga Aljannah.",
      },
    ],
    disclaimer:
      "Bishara a cikin hadisi tana komawa ga wadanda aka ambata ko kuma nau'ikan da aka siffanta su. Ba su maye gurbin buƙatun imani, ayyuka, da kyakkyawan ƙarshe ba. Allah ne mafi sani.",
  },
  {
    title: "Tauhidi - daidai imani",
    summary: "Babu wani aiki da ake karba sai da tauhidi na gaskiya.",
    body: [
      "Tauhidi na nufin kebance Allah shi kadai don bauta – Imani da cewa Shi kadai ne Ubangiji kuma Mahalicci, kuma Shi kadai ya cancanci a bauta masa, kuma Shi kadai ya kebanta da sunayenSa da sifofinSa. Shi ne ainihin sakon da aka aiko kowane Annabi da shi kuma farkon abin da mutum ya fara shiga Musulunci a kansa. Domin ya shafi wanda muke bautawa, shi ne ginshikin da ginin addini gaba daya ya tsaya a kansa.",
      'Muhimmancinsa ba ya yiwuwa a wuce gona da iri: Allah ba ya karbar wani aiki daga wanda ya yi shirka da shi. "Idan kuka yi shirki da Allah, to, ayyukanku za su vaci." (k:39:65). Dutsen kyawawan ayyuka da aka gina akan shirka ba shi da awo a ranar qiyama, alhali kuwa mafi kankantar aikin da aka gina akan tauhidi zalla yana da nauyi mai yawa. Shi ya sa kiyaye imanin mutum ya fi gaggawa fiye da ninka ayyukansa.',
      "Tauhidi kuma yana buƙatar ikhlasi, wanda ake kira ikhlas - cewa mu bauta wa Allah 'muna masu tsarkake addini gare shi' (Alkur'ani 98:5). Hatsarin da ke da hankali a nan shi ne riya, yin ayyukan ibada don a gani da kuma yaba wa mutane. Annabi ﷺ ya yi gargadin cewa ko da bayyanuwa na iya lalata wani aiki cikin nutsuwa. Maganin shine a ci gaba da sabunta niyya: don wa nake yin haka? Ikhlasi ita ce ke mayar da aikin na yau da kullun zuwa aikin ibada mai daraja.",
      "Hikimar sanya tauhidi ya zama ginshikin shi ne yantar da zuciya. Wanda ya bautawa Allah shi kadai, ya kubuta daga tsoron halitta, da neman yardar kowa, da gajiyar hidimar ubangiji da yawa. Rayuwarsa tana samun jagora guda ɗaya, bayyananne: faranta wa wanda ya yi shi.",
      "A zahiri, ka koyi ingantacciyar aqida daga malamai amintattu, ka tsarkake ibadarka da shirka da munafunci, ka duba niyyarka kafin ka aikata. Wannan mataki na farko ba na zaɓi ba ne ko ci gaba - a nan ne kowace hanyar zuwa Aljanna ta fara.",
    ],
    quran: [
      {
        excerpt:
          'An yi wahayi zuwa gare ku, kuma zuwa ga waɗanda suke a gabãninku: "Lalle ne idan kun yi shirki da Allah, lalle ne ayyukanku sun ɓãci, kuma lalle ne kanã kasancẽwa daga mãsu hasãra."',
      },
      {
        excerpt: "Ba a umarce su ba face su bauta wa Allah, suna masu tsarkake addini gare Shi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ayyuka kawai bisa niyya ne, kuma kowane mutum zai sami abin da ya yi niyya ne kawai.",
      },
    ],
    actions: [
      "Koyi tushen tauhidi daga malamai amintattu.",
      "Ka sabunta niyyarka kafin ayyukan ibada.",
      "Ku nemi gafarar bayyanar (riya).",
    ],
  },
  {
    title: "Sallah - ginshiƙi",
    summary: "Kiyaye salloli biyar na daga cikin manya-manyan ayyuka.",
    body: [
      "Sallah - salloli biyar - ita ce ginshiƙi na biyu na Musulunci kuma cibiyar ibada ta yau da kullum. Annabi SAW ya siffanta sallah a matsayin ginshikin addini: duk wanda ya tabbatar da ita ya tabbatar da addini, wanda kuma ya yi sakaci ya ruguza da yawa daga cikin abin da yake rike da ita. Shi ne wa'adi biyar mumini a wurin Ubangijinsa, da tsayuwa, da ruku'u, da yin sujada ga Allah kai tsaye.",
      "Darajanta ba ta da misaltuwa daga cikin ayyuka na zahiri saboda abin da Manzon Allah Sallallahu Alaihi Wasallama ya ce game da ranar qiyama: Farkon abin da za a fara fara wa bawa hisabi a kansa shi ne sallah. Idan ya inganta, sauran ayyukan za su yi kyau; idan ta yi karanci, saura yana cikin hadari. A cikin rayuwar nan ma, salla wata hanya ce ta tsarkakewa – Annabi Sallallahu Alaihi Wasallama ya kwatanta salloli biyar da kogi da ke gudana a qofar mutum: duk wanda ya yi wanka a cikinta sau biyar a rana, to ba shi da qazanta, don haka sallah tana kankare qananan zunubai.",
      "Amma addu'a ana nufin ta wuce motsin jiki. Kur'ani ya yabi 'masu tawali'u a cikin addu'arsu' (Alkur'ani 23:1-2) kuma yana girmama 'waɗanda suka dawwama a cikin addu'arsu' (Alkur'ani 70:22-23). Siffofin guda biyu sun fi muhimmanci: khushu—zuciya mai kaskantar da kai wacce ta san tana tsaye a gaban Allah – da daidaito, tana kiyaye kowace sallah a lokacinta. Yin addu'a a cikin jama'a, ga waɗanda suka iya, yana ninka lada sau da yawa.",
      "Zurfin hikimar Sallah shine canji. Addu’a, idan aka yi ta yadda ya kamata, tana kange mutum daga alfasha da alfasha; sake saiti ne mai maimaitawa wanda ke jan zuciya zuwa ga Allah a cikin yini mai aiki. Don haka bacewar sallah ba tare da uzuri ingantacce ba lamari ne mai girma da ke bukatar tuba ta gaskiya da sanya ta (qada). Nafil da rawatib – sallolin sunna da aka saba yi gabanin farilla da bayan farilla- suna kara haske da daukaka darajar mutum.",
      "A zahiri: Ka kiyaye salloli biyar a lokutansu a matsayin cikakkiyar fifikonka, ka gyara abin da ka rasa, sannan ka kara sallolin sunna da za ka iya rayawa. Idan sallarka ta gyaru, to komai na ibadarka yakan inganta da ita.",
    ],
    quran: [
      {
        excerpt:
          "Lalle ne mũminai, waɗanda suka yi tawali'u a cikin addu'arsu, sun yi babban rabo.",
      },
      {
        excerpt: "Fãce waɗanda suka yi salla, sũ ne mãsu dawwama a cikin sallarsu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Farkon al’amarin da za a fara wa bawa hisabi a ranar qiyama ita ce sallarsa. Idan mai sauti ne, ya yi nasara; idan ta kasance mai lahani, ya gaza kuma ya yi hasara.",
      },
      {
        excerpt:
          "Idan akwai wani kogi a kofar dayanku wanda yake wanka a cikinsa sau biyar a rana, shin wani datti zai sauka akansa? Suka ce: A'a. Ya ce: Wannan misalin salloli biyar ne, da su ne Allah ke kankare zunubai.",
      },
    ],
    actions: [
      "Ka kiyaye salloli biyar a lokutansu.",
      "Ka gyara sallolin da aka rasa (qaza) da gaske.",
      "Ka kara sallolin sunnah kafin farida da bayan farida inda zaka iya.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Tuba ta gaskiya",
    summary: "Allah Yana son masu komawa zuwa gare Shi.",
    body: [
      "Tauba tana komawa ga Allah bayan zunubi. Tuba ta gaskiya (tawbah nasuh) tana da ginshiƙai bayyanannu: Nadama ta gaske a cikin zuciya ga abin da aka aikata, da tsai da zunubi nan da nan, da ƙudiri mai ƙarfi ba za ta sake komawa gare shi ba - kuma idan zunubin ya haɗa da zaluntar wani, komar da haƙƙinsa ko neman gafararsa. Ba abu guda ba ne, sai dai dawowar rayuwa, kofa ce da Allah ke buxe ta ga kowane mumini.",
      "Muhimmancinsa shi ne cewa babu wani mahaluki da ya kuɓuta daga zunubi, don haka tuba ba na ƴan kaɗan ne masu zunubi ba amma ta kowa da kowa. Annabi s.a.w yace duk dan Adam yayi zunubi, kuma mafificin masu zunubi shine wanda ya tuba. Allah yana karbar tuban bawa har zuwa lokacin da rai ya kai makogwaro a lokacin mutuwa, kuma ko da fitowar rana daga yamma ita ce ajalin duniya - har sai gayyata ta tsaya.",
      "Abin mamaki, Allah ba ya jure wa bawa mai dawowa kawai - Yana murna. Manzon Allah SAW ya siffanta Allah a matsayin wanda ya fi jin dadin tuban bawanSa fiye da mutumin da ya rasa a cikin sahara, ya yanke kauna a rayuwa bayan rakuminsa ya yi yawo da dukkan abincinsa da ruwansa, sannan ya sake samunsa kwatsam. Wannan siffar farin ciki mai yawa ya gaya mana yadda ƙaunataccen bawa mai tuba yake ga Ubangijinsa.",
      "Hikimar tana da zurfi: zunubi bai kamata ya zama ƙarshen labarin mutum ba. ‘Allah zai musanya munanan ayyukansu da alheri’ (Alkur’ani 25:70) — Tuba na gaskiya zai iya canza tarihin gazawa zuwa nasara, kuma yana iya juyar da faduwa zuwa wani sabon farawa da zai kusantar da mutum zuwa ga Allah fiye da da. Bacin rai bayan zunubi shi kansa tarkon shaidan ne; Fatan rahamar Allah shine amsawar mumini.",
      "A zahiri: kar a jinkirta tuba na kwana ɗaya - mayar da lokacin da kuka zame. Ka bi kowane mummunan aiki da kyakykyawan aiki domin shafe shi, kuma ka yawaita yin istighfari a harshenka tsawon yini, kamar yadda Annabi SAW ya yawaita neman gafara a kullum duk da an gafarta masa.",
    ],
    quran: [
      {
        excerpt: "Yã ku waɗanda suka yi ĩmãni!",
      },
      {
        excerpt:
          "Fãce waɗanda suka tũba, kuma suka yi ĩmãni, kuma suka aikata ayyukan ƙwarai, Allah zai musanya musu mũnanan ayyukansu da alhẽri, kuma Allah Mai gãfara ne, Mai jin ƙai.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah ya fi yarda da tuban bawanSa fiye da dayanku wanda ya rasa rakuminsa a cikin kasa bakarara, kwatsam ya sake same shi.",
      },
    ],
    actions: [
      "Ku tuba nan da nan lokacin da kuka yi zunubi - kada ku jinkirta.",
      "Ku bi zunubi da aiki mai kyau don shafe shi.",
      "Ka ce stighfar cikin yini.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Alqur'ani",
    summary: "Karanta, ku haddace, kuma ku rayu da Littafin Allah.",
    body: [
      "Alkur'ani shine ainihin maganar Allah, wanda aka saukar da shi a matsayin shiriya, rahama, da waraka ga zukata. Gina dangantaka da ita - karanta ta, da yin tunani a kan ma'anoninsa, da aiki da umarninsa, da karantar da ita ga wasu - yana daga cikin ibadu mafi girma da lada mafi girma da mumini zai iya sadaukar da rayuwarsa a rayuwarsa. Igiyar Allah ce ta shimfida mana; wanda ya yi riko da ita, to, an shiryar da shi zuwa ga tafarki madaidaici.",
      "Ladan da ke tattare da shi yana da ban mamaki. Annabi SAW ya koyar da cewa Allah yana ba wa wadanda suka karanta littafinsa kuma suka tsai da salla wani lada mai girma da ba ya halaka (Alkur'ani 35:29-30), kuma ga kowane harafi guda daya karanta yana da ladan rubanya goma. Shi ma wanda ya yi ta fama da tuntube a kan maganar, matukar ya ci gaba da kokari, yana da lada biyu - daya na karatu daya kuma na kokari.",
      "Har ila yau, Alkur'ani yana daukaka darajar mutum a rayuwa ta gaba kai tsaye da fayyace. Manzon Allah SAW ya ce za a ce wa ma'abocin Alkur'ani ranar kiyama: 'Ka karanta ka hau, ka karanta kamar yadda ka saba karantawa a duniya, domin darajarka tana cikin ayar karshe da ka karanta'. A wasu kalmomi, tsayawar mutum a cikin Aljanna yana tashi a mataki tare da sashin Littafin - ƙarfafawa mai ban sha'awa don ci gaba da haddace da bita.",
      "Maƙasudin zurfafa, ko da yake, ba karatun don kansa ba ne amma canji. Allah ya umarce mu da mu ‘karatun Alkur’ani da ma’auni karatun’ (Alkur’ani 73:4) daidai da haka ma’anoni sun nutse kuma su sake fasalin yadda muke tunani, ji, da halayenmu. An aiko da Alkur’ani don a rayu, ba wai kawai a karanta ba; Sahabbai za su koyi ayoyi goma ba su ci gaba ba har sai sun fahimta kuma suka yi aiki da su.",
      "A zahiri: karanta wani yanki kowace rana, har ma da ayoyi kaɗan, amma karanta su da tunani. Ƙirƙirar sababbin surori ko kula da abin da kuka riga kuka sani, kuma - mafi mahimmanci - kuyi aiki akan abin da kuka koya kafin yin gaggawar gaba don ƙarin koyo.",
    ],
    quran: [
      {
        excerpt:
          "Waɗanda suke karãtun Littãfin Allah, kuma suka tsayar da salla, kuma suka ciyar daga abin da Muka azurta su, sunã fatan wani fatauci bã ya halaka, kuma dõmin Ya cika musu ijãrarsu, kuma Ya ƙãra musu daga falalarSa.",
      },
      {
        excerpt: "Kuma ku karanta Alqur'ani tare da gwargwado.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sai a ce wa ma'abocin Alkur'ani: Karanta ka hau, ka karanta kamar yadda ka saba karantawa a duniya, domin darajarka ita ce ayar karshe da ka karanta.",
      },
    ],
    actions: [
      "Karanta kullun - har ma da ayoyi kaɗan tare da tunani.",
      "Ka haddace sabbin surori ko kiyaye abin da ka sani.",
      "Yi aiki da abin da kuka koya kafin neman ƙarin.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Zikr - zikiri",
    summary: "Haske akan harshe, nauyi akan sikeli.",
    body: [
      "Zikiri yana nufin ambaton Allah - kiyaye Shi a cikin zuciya da harshe ta hanyar kalmomin tasbihi (SubhanAllah), da yabo (Alhamdulillah), da daukaka (Allahu Akbar), da tabbatar da kadaitaSa (La ilaha illallah), da neman gafara (istighfar). Daga cikin dukkan hanyoyin shiga Aljannah, zikiri yana daga cikin mafi saukin yinsa duk da haka a cikin mafi girman lada, domin ana iya yinsa a ko'ina, a kowace jiha, a kowane lokaci.",
      'Allah da kansa ya yi umurni da shi da karimci – ‘Ya ku waxanda suka yi imani, ku ambaci Allah ambato mai yawa’ (Alqur’ani 33:41–42) – kuma ya yi alkawarin ‘ya’yan itace na musamman a gare shi: natsuwar zuciya. "Lalle ne, a cikin ambaton Allah zukata suke natsuwa" (Alkur\'ani 13:28). A cikin duniya mara natsuwa, damuwa, wannan yana daga cikin mafi girman baiwar zikiri. Haka nan Annabi SAW ya auna ladansa, yana mai cewa kalmomi guda biyu masu sauki a harshe amma masu nauyi a kan sikelin, kuma soyuwa ga mai rahama, su ne SubhanAllahi wa bihamdihi, SubhanAllahil-Azeem.',
      "Wani nau'i na musamman shi ne la'asar safiya da maraice - Addu'o'in da Manzon Allah Sallallahu Alaihi Wasallama ya koyar game da iyakoki guda biyu na yini. Wadannan suna aiki ne a matsayin kagara na ruhi, suna tsare mumini daga cutarwa da kuma jawo kariyar Allah da yardarsa. 'Yan mintoci kaɗan a farkon da ƙarshen kowace rana, in ji tare da kasancewa, a hankali suna sake fasalin zuciya akan lokaci.",
      "Hikimar zikiri ita ce ta raya alaka da Allah tsakanin ayyukan ibada. Harshen da yake da danshi tare da ambaton kuma, mafi mahimmanci, zuciyar da ke ambaton Allah a cikin zabinta na yau da kullun - tsayawa kafin fushi, kafin siye, kafin yanke hukunci - ita ce manufa ta gaskiya. Ba a nufin yin zikiri a kan lebe; ana nufin tafiyar da rayuwa.",
      "A aikace: Ka sanya ladar safiya da marece ta zama al'ada ta yau da kullun, ka kiyaye tasbihi, ko istighfar, ko salawati mai sauki a lokutan zaman banza, da ambaton Allah musamman kafin barci da tashi. Daidaitawa a cikin ɗan kaɗan ya fi fashe da yawa.",
    ],
    quran: [
      {
        excerpt:
          "Lalle ne waɗanda suka yi ĩmãni kuma zukãtansu suka natsu da ambaton Allah, lalle ne zukãtansu na natsuwa da ambaton Allah.",
      },
      {
        excerpt:
          "Ya ku wadanda suka yi imani ku ambaci Allah ambato mai yawa, kuma ku yi tasbihi a safiya da maraice.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kalmomi guda biyu masu sauki a kan harshe, masu nauyi a kan sikeli, kuma soyuwa ga mai rahama: SubhanAllahi wa bihamdihi, SubhanAllahil-Azeem.",
      },
    ],
    actions: [
      "Cikakken adhkar na safe da maraice.",
      "Yi amfani da injin tasbeeh don istighfar ko salawat.",
      "Ambaton Allah kafin barci da bayan an tashi.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sadaka & zakka",
    summary: "Ku ciyar daga abin da Allah Ya azurta ku, a asirce da bayyane.",
    body: [
      "Musulunci ya umurci mumini da ya bayar daga dukiyar da Allah ya ba shi amana, na farilla da na son rai. Zakka ita ce wajibcin abin da ya wajaba na shekara-shekara kan dukiya - daya daga cikin rukunan Musulunci guda biyar - kuma ta wajaba, ba na tilas ba, ga wanda ya cika sharuddansa. Bayan haka akwai sadaqah: bayarwa na son rai na kowane adadi, a kowane lokaci, saboda Allah.",
      "Ladan ciyarwa a tafarkin Allah yana ninkuwa fiye da na yau da kullun. Allah yana kwatanta wanda ya ciyar a tafarkinsa da kwaya daya wadda ta tsirar zangarniya bakwai, kowace zangar tana dauke da hatsi dari – kuma Allah yana ninkawa ga wanda Yake so. Nisa daga tauye dukiya, sadaka tana tsarkake ta kuma tana karawa a cikin baraka, yayin da take kashe zunubai kamar yadda ruwa ke kashe wuta.",
      "Siffofin sadaka guda biyu sun cancanci ambaton musamman. Na farko ita ce sadaka boyayye, ana bayar da ita a hankali, kamar yadda Annabi SAW ya bayyana, hannun hagu bai san abin da hannun dama ya bayar ba - wannan ikhlasi na musamman soyuwa ne a wurin Allah, kuma yana inuwar mutum a ranar sakamako. Na biyu kuma ita ce sadaqah jariyah, sadaka mai gudana wacce fa'idarta ke ci gaba da wanzuwa bayan mutuwa. Annabi SAW ya ce idan mutum ya mutu ayyukansa sun kare sai guda uku: Sadaka mai gudana, da ilimin da yake amfanar mutane, da dan salihai da ya yi masa addu'a.",
      "Hikimar sadaka ita ce tana aiki a kan mai bayarwa kamar yadda mai karɓa. Yana sassauta damƙar kwadayi a cikin zuciya, yana ƙarfafa tausayi, yana ƙarfafa zumuncin al'umma, yana tunatar da masu hannu da shuni cewa amintattu ne, ba masu gaskiya ba. Kuma Musulunci ya fadada ma’anar sadaka don haka ba a kebe kowa: Annabi SAW ya koyar da cewa murmushi ga dan’uwanka, kalma mai taimako, har ma da kawar da abu mai cutarwa daga hanya duk nau’in sadaka ne.",
      "A zahiri: idan kuna da alhakin zakka, ku lissafta kuma ku biya daidai; a ba da wata sadaqa ta yau da kullum, komai kankantarta, ta yadda bayarwa ya zama dabi’a a maimakon wani lamari; kuma ku nemi dauwamammiyar sadaqah jariya - daukar nauyin almajiri, ko bayar da tallafin rijiya, ko tallafawa masallaci - wanda ke ci gaba da baku lada bayan baku.",
    ],
    quran: [
      {
        excerpt:
          "Misãlin waɗanda suke ciyar da dũkiyõyinsu a cikin hanyar Allah, kamar ƙwãya ce wadda ta tsirar da zangarniya bakwai, a cikin kõwace ƙwaya ɗari. Kuma Allah yana riɓanya wanda Yake so.",
      },
      {
        excerpt:
          "Ku ciyar daga abin da Muka azurta ku a gabanin mutuwa ta zo wa ɗayanku, sai ya ce: “Ya Ubangiji!",
      },
    ],
    hadith: [
      {
        excerpt:
          "Idan mutum ya mutu ayyukansa sun kare sai guda uku: Sadaka mai gudana, ko ilimi mai amfani, ko dan salihai da ya yi masa addu’a.",
      },
    ],
    actions: [
      "Ku lissafta kuma ku fitar da zakka idan kuna da hakki.",
      "Ba da sadaka akai-akai, koda kuwa karama ne.",
      "Nemo damar sadaqah jariyah.",
    ],
    appLinks: [{}],
  },
  {
    title: "Kyakkyawan hali",
    summary: "Abu mafi nauyi akan Sikelin na iya zama kyawawan halaye.",
    body: [
      "Kyawawan halaye (husn al-khuluq) shi ne tarin halaye masu daraja da mumini ke nunawa wajen mu'amala da halittun Allah: gaskiya, hakuri, tawakkali, rahama, karamci, tausasawa, da kiyaye alkawari. Nisa daga zama kyakyawan zamantakewa kawai, Musulunci yana daukar hali a matsayin ma'aunin imani kuma daya daga cikin ayyuka mafi nauyi da mutum zai iya dauka har zuwa ranar sakamako.",
      "An bayyana matsayinsa a cikin madaidaicin sharuddan. Manzon Allah SAW ya ce babu wani abu da aka dora akan ma'auni fiye da kyawawan dabi'u, kuma muminai mafi cikar imani su ne wadanda suka fi dacewa. Har ma ya taqaita nasa aikin da ya ce an aiko shi zuwa ga kamala mai daraja. Wannan yana nufin yadda kuke bi da iyayenku, da matanku, da ’ya’yanku, da maƙwabtanku, har ma da baƙi ba a raba su da ibadarku ba—haka ce ta tsakiya.",
      "Kyawun hali yana da qarfi saboda abin da Annabi Sallallahu Alaihi Wasallama ya yi alqawarin zai iya samu: da kyawawan xabi’unsa mumini zai iya kai matsayin wanda ya yi azumin yini kuma ya yi sallar dare. A wasu kalmomi, kyakkyawan hali na iya ɗaga ɗan ƙasa zuwa matakin masu ibada, domin yana da wahala, dawwama, kuma yana gwada girman kai a kowane lokaci - kame fushi, gafarta zagi, da zabar tausasawa lokacin da zazzaɓi zai kasance da sauƙi.",
      "Hikimar ita ce, Musulunci ba wai dangantaka ce ta sirri tsakanin mutum da Allah kadai ba; ana so a zube cikin yadda mutum zai yi da duk wanda ke kusa da shi. Mai ibadar da addu’a ba ta sassauta masa ma’amalarsa ya rasa ma’anarsa, alhali kuwa kyawawan halaye ita ce dawah a cikinta, yana jawo mutane zuwa ga imani ta wurin koyi mai rai. Wannan shine dalilin da ya sa nassosin suka haɗa bautar Allah tare da ɗaukaka zuwa ga halittarsa ​​akai-akai.",
      "A zahiri: yi aiki da ɗabi'a guda ɗaya - ka riƙe harshenka lokacin da aka tsokane ka, gafarta wa waɗanda suka zalunce ka, gyara dangantakar da ka bari, kuma ka cika alkawuran da ka yi ko da sun kashe ka. Takaitaccen tunani na yau da kullun bayan sallah akan yadda kuka yiwa mutane a wannan rana hanya ce mai sauƙi don girma a hankali.",
    ],
    quran: [
      {
        excerpt: "Kuma lalle ne kai, haƙlƙa, haƙlƙa, haƙiƙa, haƙiƙa ne, mai girma da daraja.",
      },
      {
        excerpt:
          "Waɗanda suke ciyarwa a cikin sauƙi da wahala, kuma suke kange fushinsu, kuma suke gãfartawa mutãne, kuma Allah Yanã son mãsu kyautatãwa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Babu wani abu da ya fi nauyi a ma'aunin mumini a ranar kiyama kamar kyawawan halaye. Lalle ne, Allah Yana ƙin batsa, mai ƙasƙanci.",
      },
      {
        excerpt:
          "Mafi cikar muminai da imani su ne waxanda suka fi xabi’u, kuma mafi alherin ku su ne waxanda suka kyautata wa matansu.",
      },
    ],
    actions: [
      "Yi haƙuri idan an tsokane shi.",
      "Gafarta wa wasu kuma gyara alaƙar da ta karye.",
      "Ka yi la'akari da halinka bayan yin sallah a cikin jarida na yau da kullum.",
    ],
    appLinks: [
      {},
      {
        label: "Sins against others",
      },
    ],
    characterTraits: [
      {
        title: "Gaskiya",
        summary: "Ku kasance tare da masu gaskiya.",
        quran: {
          excerpt: "Ku ji tsoron Allah kuma ku kasance tare da masu gaskiya.",
        },
      },
      {
        title: "Haƙuri",
        summary: "Ku nemi taimako da haƙuri da salla.",
        quran: {
          excerpt: "Ku nemi taimako da haƙuri da salla.",
        },
      },
      {
        title: "Kame fushi",
        summary: "Allah yana son masu kame fushi.",
        quran: {
          excerpt: "Waɗanda suke kame fushinsu kuma suke yafe wa mutane.",
        },
      },
      {
        title: "Yafiya",
        summary: "Ku yafe kuma ku kau da kai.",
        quran: {
          excerpt: "Shin ba ku son Allah Ya gafarta muku?",
        },
      },
      {
        title: "Tawali'u",
        summary: "Bayin Mai rahama suna tafiya da tawali'u.",
        quran: {
          excerpt: "Bayin Mai rahama suna tafiya a ƙasa da tawali'u.",
        },
      },
      {
        title: "Amana",
        summary: "Ku mayar da amana ga masu ita.",
        quran: {
          excerpt: "Allah Ya umarce ku ku mayar da amana ga masu ita.",
        },
      },
      {
        title: "Kyakkyawan hali ga iyaye",
        summary: "Ku kyautata wa iyaye.",
        quran: {
          excerpt: "Ku bauta wa Allah kuma ku kyautata wa iyaye.",
        },
      },
      {
        title: "Magana mai kyau",
        summary: "Ku faɗi alheri ko ku yi shiru.",
        hadith: {
          excerpt: "Mai imani da Allah da Ranar Lahira ya faɗi alheri ko ya yi shiru.",
        },
      },
      {
        title: "Murmushi na gaskiya",
        summary: "Murmushi ga ɗan'uwanka sadaka ne.",
        hadith: {
          excerpt: "Murmushinka ga fuskar ɗan'uwanka sadaka ne.",
        },
      },
      {
        title: "Adalci",
        summary: "Ku yi adalci; shi ya fi kusa da taƙawa.",
        quran: {
          excerpt: "Ku yi adalci; shi ya fi kusa da taƙawa.",
        },
      },
    ],
    characterDestroyers: [
      {
        title: "Ƙarya",
      },
      {
        title: "Gulma",
      },
      {
        title: "Ƙage",
      },
      {
        title: "Girman kai",
      },
      {
        title: "Zalunci",
      },
      {
        title: "Saɓa alkawari",
      },
      {
        title: "Izgili",
      },
      {
        title: "Tsaurin rashin adalci",
      },
    ],
  },
  {
    title: "Neman ilimi",
    summary: "Allah ya sauwaka wa mai neman ilimi hanyar Aljannah.",
    body: [
      "Neman ilimi mai fa'ida - koyan abin da Allah da Manzonsa ﷺ suka koyar, sannan kuma aiki da shi, da kuma isar da shi - ibada ce, kuma a cikin muhimmanta, wajibi ne akan kowane musulmi. Wannan shi ne ilimi mai tsarki da yake fayyace imani, yana tsarkake ibada, da kuma banbance mai kyau da mara kyau; Ba ilimi ba ne don nunawa, amma haske ne ke jagorantar aiki.",
      "Annabi ﷺ ya daura wannan bibiyar kai tsaye da hadafin wannan tafiya baki daya: 'Duk wanda ya dauki hanya domin neman ilimi, Allah zai sauwake masa hanyar shiga Aljannah. 'Hanyar' ta zahiri ce kuma ta alama - Allah yana sauƙaƙa wa mai neman hanyar rayuwar duniya kuma ya sauƙaƙa masa hanyar zuwa Aljanna a lahira. Ya kuma karantar da cewa mala'iku suna runtse fikafikansu don yarda ga mai neman ilimi, kuma abin da ke cikin sammai da kasa, hatta kifayen da ke cikin teku, suna neman gafara ga wanda ya karantar da alheri.",
      "Ilmi kuma yana daga cikin ayyukan da ba kasafai ake samun lada ba wadanda suke rike da lada bayan mutuwa. Annabi SAW ya ambaci ilimi mai fa'ida a cikin abubuwa uku da ladansu ke ci gaba da wanzuwa a cikin kabari, tare da sadaka mai gudana da kuma salihai. Don haka koyar da al’amari guda ɗaya mai fa’ida—taimaka wa wani ya koyi yin addu’a daidai, raba ingantaccen hadisi, ko shiryar da mutum zuwa ga gaskiya—yana iya zama magudanar lada mai gudana tsawon shekaru, har ma da tsararraki.",
      "Hikimar ita ce, aiki ba tare da ilimi makaho ba ne, ilimi kuma ba shi da amfani. Ingantacciyar ilimi yana kare mutum daga bidi'a da bata, yana zurfafa ikhlasi, yana ba shi ikon amfanar da wasu maimakon kawai ya amfanar da kansa. Malaman Musulunci a ko da yaushe suna yin gargadi a kan hatsarori guda biyu: aiki da jahilci, da sani ba tare da aiki ba.",
      "A zahiri: ka himmantu wajen koyon wani abu mai fa'ida akai-akai - aya, hadisi, hukunce-hukuncen da kuke buqata don ibadar ku ta yau da kullum. A fara da muhimman abubuwan imani, da addu'a, da tsarkakewa, da manyan hani, sannan a zurfafa a hankali. Raba abin da kuka koya cikin tawali’u, kuma koyaushe fara amfani da shi ga kanku.",
    ],
    quran: [
      {
        excerpt:
          "Ka ce: Shin waɗanda suka sani suna daidaita da waɗanda ba su sani ba? Ma'abuta hankula kawai su yi tunani.",
      },
      {
        excerpt: 'Kuma ka ce: "Ya Ubangijina! Ka ƙãra mini ilmi."',
      },
    ],
    hadith: [
      {
        excerpt:
          "Duk wanda ya dauki hanya domin neman ilimi, Allah zai saukake masa hanyar shiga Aljannah.",
      },
      {
        excerpt:
          "Idan mutum ya mutu ayyukansa sun kare sai guda uku: Sadaka mai gudana, ko ilimi mai amfani, ko dan salihai da ya yi masa addu’a.",
      },
    ],
    actions: [
      "Koyi wani abu mai amfani kowane mako.",
      "Raba ilimi ba tare da girman kai ba.",
      "Aiwatar da abin da kuka koya kafin tara ƙarin.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Ibadar son rai",
    summary: "Ku kusanci Allah ta hanyar nafila bayan farilla.",
    body: [
      "Ibada na son rai (nafl) tana nufin karin ayyukan ibada da mumini yayi bayan abin da Allah ya wajabta - karin sallah, karin azumi, karin zakka da zikiri. Wajibai suna zuwa na farko kuma ba za su iya yin sulhu ba, amma da zarar an cika su, Nafl ita ce inda bawa yake nuna soyayya, kusanci da buri wanda ya wuce iyakar abin da ake bukata.",
      "Akwai alkawari mai ban sha'awa a makale da shi. A cikin hadisi qudsi, Allah yana cewa: “Bawana ba ya kusantar Ni da wani abu da ya fi soyuwa gare ni face abin da na wajabta masa. Kuma ya ci gaba da kusantar Ni ta hanyar ayyuka na son rai har sai na so shi’ – kuma da zarar Allah Ya so bawa, sai a amsa masa addu’o’insa kuma a daidaita al’amuransa. Don haka bauta ta son rai itace tsanin kusanci, hawa daga biyayya kawai zuwa ga soyayyar Allah.",
      "Sunna tana da wadatuwa da nau'o'inta: Sallar dare (tahajjud) a karshen dare, sallar la'asar (duha), sallolin sunna da aka saba kafin farilla da bayan farilla, da azumin nafila kamar Litinin da Alhamis ko kuma farare na kowane wata. Ibadar Nafila ita ma a natse tana tafe mana gazawarmu - Annabi SAW ya koyar da cewa duk wata nakasu a cikin sallolin farilla za a cika ta daga sallolin da mutum ya yi na son rai a ranar kiyama.",
      "Hikimar ita ce, nafl yana raya imani da girma. Wajibai suna kiyaye ginshiƙi, amma ayyuka na son rai su ne inda zuciya ta miƙe, inda bauta ta sirri ba wanda ya gani yana gina ikhlasi, kuma inda mutum ya horar da kansa don gwaji mafi tsanani na rayuwa. Kuma rahama ne cewa waɗannan ayyuka na zaɓi ne - Allah yana buɗe kofofin da yawa don kowane mutum ya bi ta waɗanda suka dace da shi.",
      "A zahiri, mabuɗin shine dorewa, ba ƙarfi ba. Manzon Allah Sallallahu Alaihi Wasallama ya koyar da cewa mafi soyuwar ayyuka a wurin Allah su ne mafi daidaito ko da qanana. Zaɓi wasu ayyuka na son rai da gaske waɗanda za ku iya kiyayewa - raka'a biyu na tahajjud, azumi ɗaya a mako, ƙayyadaddun yanki na Kur'ani - maimakon fashewar buri da ke ƙonewa cikin kwanaki.",
    ],
    quran: [
      {
        excerpt:
          "Sana'o'insu suna barin gadajensu, alhali kuwa suna kiran Ubangijinsu, bisa ga tsoro da tsamani, kuma daga abin da Muka azurta su suna ciyarwa. Bãbu wani rai sanin abin da aka ɓõye musu na dãɗi da sakamakon abin da suka kasance sunã aikatãwa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Bawana ba ya kusantar Ni da wani abu da ya fi soyuwa gare ni face abin da na wajabta masa. Kuma bawaNa ya ci gaba da kusantar Ni ta hanyar ayyuka na son rai har sai na so shi.",
      },
    ],
    actions: [
      "Kuyi tahajjud koda raka'a biyu ne.",
      "Azumin kwanaki na son rai idan iya.",
      "A yawaita sallolin sunnah kafin/bayan farida.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Hakuri & godiya",
    summary: "Allah yana son masu hakuri da godiya.",
    body: [
      "Hakuri (sabri) da godiya (shukr) su ne fukafukai biyu da mumini ke yawo a rayuwa da su. Hakuri shi ne tsayin daka a fagage guda uku: Tsayuwa ga Allah, da kamewa daga sabawa, da jure wa jarabawar rayuwa ba tare da korafi kan hukuncinsa ba. Godiya shine sanin kowace ni'ima daga Allah da amsa godiya a cikin zuciya, da harshe, kuma ta hanyar aiki na biyayya. Tare suna rufe martanin mumini ga wahala da sauƙi.",
      "Muhimmancinsu shi ne su bayyana yadda mumini yake saduwa da duk abin da ya same shi. Annabi ﷺ ya yi mamakin cewa al’amarin mumini gaba xaya yana da kyau: idan alheri ya riske shi sai ya gode masa kuma ya kyautata masa, idan wahala ta same shi sai ya yi haquri, shi ma yana da alheri a gare shi – falala da ba kowa ba face mumini. Don haka duk abin da ya zo, mumini yana da hanyar samun lada.",
      "Ladan haƙuri ba shi da iyaka. Yayin da mafi yawan ayyuka ana samun lada ta hanyar ma'auni, Allah yana cewa: \"Masu haƙuri za a ba su ladarsu ba tare da ƙididdigewa ba\" (Alkur'ani 39:10). Kuma godiya tana ɗaukar alƙawarin nata na karuwa: 'Idan kun gode, to, lalle ne zan ƙara muku' (Alkur'ani 14:7). Godiya, don haka, ba kawai amsa daidai ba ne ga albarka - shi ne ainihin abin da ke sa su girma.",
      "Hikima a nan tana gyara wahala gaba ɗaya. Gwaji ba hukunci ba ne kai tsaye; ga mumini wanda ya amsa da kyau, za su iya zama tsarkakewa mai kankare zunubai da daukaka mai daukaka daraja. Manzon Allah (SAW) ya koyar da cewa babu gajiya, ko rashin lafiya, ko damuwa, ko ma tsinuwar qaya da za ta samu musulmi ba tare da Allah ya shafe wasu zunubai da ita ba. Wannan yana juya mafi tsananin lokutan rayuwa zuwa dama maimakon asara mai tsafta.",
      "A zahiri: idan musiba ta same ku, ku amsa da kalmomin da Allah ya koyar – ‘Inna lillahi wa inna ilayhi raji’un’ (Lalle mu na Allah ne, kuma gare Shi muke komawa) – kuma ka kame harshenka daga korafe-korafen da ke karyata dokarSa. A cikin lokuta masu kyau, ku kidaya ni'imominku da babbar murya, kuma ku gode wa Allah a kalla kadan daga cikinsu a kowace rana; sanya musu suna yana sanya zuciya taushi da godiya.",
    ],
    quran: [
      {
        excerpt:
          'Ka yi bushãra ga mãsu haƙuri, waɗanda idan wata masĩfa ta sãme su, sai su ce: "Lalle ne mũ ga Allah muke, kuma zuwa gare Shi mãsu kõmãwa." A kansu akwai albarka daga Ubangijinsu da wata rahama, kuma waɗannan su ne shiryayyu.',
      },
      {
        excerpt:
          "Idan kun gõde, to, lalle ne zan ƙãra muku; To, idan kun ƙaryata, to, lalle azãbãTa, haƙĩƙa, mai tsanani ce.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Abin al'ajabi ne ga mumini, domin dukkan al'amuransa suna da kyau. Idan sauƙi ya zo, sai ya gode, kuma wannan alhħri ne a gare shi. Kuma idan wahala ta zo sai ya yi hakuri, kuma hakan ne alheri gare shi. Wannan ba na kowa ba ne face mumini.",
      },
    ],
    actions: [
      "Ka ce inna lillahi wa inna ilayhi raji'un idan an gwada.",
      "Godiya ga Allah da ƙarfi don ni'ima uku kullum.",
      "Kada ku yi ƙorafi ga abin da ya kãfirta da umurnin Allah.",
    ],
  },
  {
    title: "Kira zuwa ga Allah",
    summary: "Wanda ya shiryar da wani yana da lada kamar wanda ya bi shi.",
    body: [
      "Da'awah na nufin kiran wasu zuwa ga Allah - raba sakon Musulunci, koyawa mutum yin addu'a, kwadaitar da alheri, a hankali hana mummuna, ko taimaka wa musulmi mai fafutuka komawa ga biyayya. Manzo ne na kowane Annabi kuma nauyi ne da ya rataya a wuyan al’umma, kowa gwargwadon iyawarsa da iliminsa. Ba a kebance shi ga malamai; duk wanda ya isar da ko da abu daya ne mai fa'ida to kira zuwa ga Allah.",
      "Ladarta tana daga cikin mafi falala a cikin dukkan Musulunci. Annabi SAW ya ce wanda ya shiryar da wani zuwa ga alheri yana da lada kwatankwacin wanda ya yi aiki da shi, kuma a wata ruwaya, wanda ya yi kira zuwa ga shiriya yana da ladan wanda ya bi ta, ba tare da an rage musu lada ko kadan ba. Wannan yana nufin kyawawan abubuwan da kuka tsara zasu iya ci gaba da ninka ladan ku ta kowane mutum da ya taɓa, da daɗewa bayan kun ci gaba.",
      "Amma da'awah tana da adab - hanya - wanda dole ne a girmama shi don samun nasara. Allah ya yi umarni da cewa: \"Ka yi kira zuwa ga hanyar Ubangijinka da hikima da wa'azi mai kyau, kuma ka yi jayayya da su da mafi kyawu\" (k:16:125). Hikima tana nufin faɗin abin da ya dace, ga wanda ya dace, ta hanya da lokaci; kaushi, girman kai, da nuna maki suna korar mutane da cin amanar manufa. Aikin mai kira shi ne isarwa da shuka, ba tilasta zukata ba, na Allah Shi kaɗai.",
      "Hikimar daure irin wannan lada mai yawa ga shiryar da wasu ita ce ta sanya kowane mumini ya zama tushen alheri mai dorewa. Haka nan yana kare imanin mai kiran kansa: kiran mutane zuwa ga addu’a da gaskiya da ibada shi ne tunatar da kan su riko da su. Kuma yana hada al'umma wuri guda a cikin kulawar juna maimakon sakaci da juna.",
      "A zahiri, fara kusa da gida. Inganta kuma ku koyar da danginku - mata, ɗa, ɗan'uwa - tunda su ne alhakinku na farko kuma mafi ɗorewa. Raba ilimi mai fa'ida tare da kyautatawa, a taimaki mutum ya koyi addu'a ko karanta Alkur'ani, kuma a tuna cewa rayuwa ta kyawawan halaye da tsayuwar ibada ita ce da'awah mafi gamsarwa.",
    ],
    quran: [
      {
        excerpt:
          "Ka yi kira zuwa ga hanyar Ubangijinka da hikima da wa'azi mai kyau, kuma ka yi jãyayya da su da abin da yake mafi kyau.",
      },
      {
        excerpt:
          'Kuma wãne ne mafi kyau ga magana daga wanda ya yi kira zuwa ga Allah, kuma ya aikata aiki na ƙwarai, kuma ya ce: "Lalle nĩ inã daga Musulmi."',
      },
    ],
    hadith: [
      {
        excerpt: "Wanda ya shiryar da wani zuwa ga alheri, yana da lada kamar wanda ya aikata shi.",
      },
    ],
    actions: [
      "Ku raba ilimi mai fa'ida da alheri.",
      "Taimaka wa wani ya koyi addu'a ko karanta Qur'ani.",
      "Zama misalin kyawawan halaye a cikin jama'a.",
    ],
  },
  {
    title: "Manyan ayyuka na rayuwa",
    summary: "Hajji, iyali, da sadaka mai dorewa.",
    body: [
      "Tare da ayyukan ibada na yau da kullun da na mako-mako, Musulunci yana nuni ga mumini ga wasu manyan ayyuka na rayuwa - manyan jarin da ladansu ke da yawa kuma, a wasu lokuta, ba ya ƙarewa. Waɗannan su ne ayyukan da ya kamata a tsara rayuwa a kusa da su: aikin hajji, da raya iyali salihai, da gina ayyuka nagari masu wanzuwa.",
      "Na farko a cikinsu shi ne Hajji, rukuni na biyar na Musulunci, wanda ya wajaba sau daya a rayuwarsa a kan kowane musulmi da yake da karfin jiki da na kudi - 'Hajjin Dakin wani hakki ne da Allah ke da shi a kan mutanen da suke iya samun hanya' (Alkur'ani 3:97). Ladarsa tsarkakewa ce: Annabi (SAW) ya ce duk wanda ya yi aikin Hajji don Allah, kuma ya nisanci alfasha da zunubi ya koma ba laifi, kamar ranar da mahaifiyarsa ta haife shi. Hajji karbabbe, ya ce, ba shi da lada kasa da Aljanna. Umrah, karamar hajji, ita ma tana xauke da lada mai yawa da kankare zunubai tsakanin umra xaya da ta gaba.",
      "Babban jari na biyu shine sadaqah jariyah - sadaka mai gudana wacce ke ci gaba da ladabtar da mutum bayan ya mutu. Manzon Allah SAW ya ambaci sunansa cikin abubuwa guda uku da suke ci gaba da amfanar mutum a cikin kabari, tare da ilimi mai fa'ida da kuma salihai da yake yi masa addu'a. Tarbiyantar da ‘ya’ya akan imani da kyawawan halaye watakila shine mafi girman wadannan, amma haka gina masallaci ko kula da shi, ko rijiya, ko daukar nauyin marayu, da dasa bishiya, ko kuma ba da tallafi ga ilimi – kowane rafi na lada wanda ya wuce wanda ya bayar.",
      "Hikimar wadannan ayyuka ita ce, suna fadada lissafin mutum fiye da tsawon rayuwarsa. Shekarun mumini gajeru ne, amma rijiya da ya haƙa ko yaron da ya rene da kyau zai iya ci gaba da samun lada har tsawon ƙarni. Don haka Musulunci ya ƙarfafa hangen nesa na dogon lokaci: don yin tunani ba kawai game da addu'ar yau ba, amma game da irin alherin da zai gudana daga gare ku bayan kun tafi.",
      "A zahiri: idan za ku iya, ku yi shiri sosai don aikin Hajji ko Umrah maimakon jinkirta shi ba tare da ƙarewa ba. Zuba ƙoƙari na gaske a cikin bangaskiya da halayen dangin ku, tunda sune mafi wanzuwar gadonku. Kuma gano aƙalla aikin jinƙai ɗaya mai ɗorewa don tallafawa - ilimi, ruwa, matsuguni, ko maraya - domin ayyukanku na alheri su ci gaba bayan mutuwa.",
    ],
    quran: [
      {
        excerpt:
          "Kuma hajjin Ɗaki wani aiki ne da Allah ya rataya a wuyan waɗanda suka sami hanyar zuwa gare shi.",
      },
      {
        excerpt:
          "Kuma ka yi bushara ga mutane da Hajji; Zã su zo muku da ƙafãfu da kuma a kan kõwane rãƙumi sãɓã wa jũna daga kõwane mai nĩsa, dõmin su yi shaidar amfãni ga kansu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Duk wanda ya yi aikin Hajji don Allah, bai yi alfasha ko fasiqanci ba, ya koma ba laifi, kamar ranar da mahaifiyarsa ta haife shi.",
      },
      {
        excerpt:
          "Idan mutum ya mutu ayyukansa sun kare sai guda uku: Sadaka mai gudana, ko ilimi mai amfani, ko dan salihai da ya yi masa addu’a.",
      },
    ],
    actions: [
      "Ka tsara aikin Hajji ko Umra idan za ka iya.",
      "Saka hannun jari a cikin bangaskiya da halayen dangin ku.",
      "Taimakawa aikin agaji mai ɗorewa.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Rahamar Allah - kalma ta ƙarshe",
    summary: "Ayyuka suna nufin; Shigar da rahamarSa take.",
    body: [
      "Bayan dukkan ayyuka, da dukkan himma, da dukkan tafarki, mumini ya isa ga gaskiya mai kaskantar da kai, ita ce kalma ta karshe a wannan tafiya: babu mai shiga Aljanna saboda ayyukansa shi kadai. Manzon Allah Sallallahu Alaihi Wasallama ya faxi game da kansa – wanda ya fi soyuwa ga Allah – yana cewa ko da shi ba zai shiga Aljanna da ayyukansa ba, face Allah ya lulluve shi da rahamarSa. Idan kuwa haka ne a gare shi, to lalle haka gare mu.",
      "Kada a taɓa fahimtar wannan a matsayin lasisin sakaci da ibada. Ayyuka sun kasance hanyar da Allah Ya zaɓa kuma Ya yi umarni; Ya danganta rahamarSa da imani da aiki na qwarai, kuma barinsu ba tawali’u ba ne face gafala. Ma'anar ma'ana daidai gwargwado: Ayyukanmu ko da yake sun yi yawa, ba za su taba iya biya ko da juzu'in ni'imar Allah a kanmu ba, kuma ba za su iya saya madawwamin Aljanna ba. Don haka muna ba da ayyukanmu a matsayin alamar kauna da biyayya, sannan mu dogara ga alherinsa gaba ɗaya don karɓe su kuma ya shigar da mu.",
      "Iyalin wannan rahama yana da ban mamaki. Annabi SAW yace Allah ya raba rahama kashi dari; Kuma bai saukar da kashi ɗaya kawai ga talikai ba, kuma a cikin wannan sashe ne uwa ta kasance mai tausayi ga ɗiyanta, kuma dabbõbi suna yin tausasãwa ga ɗiyansu, kuma Ya ajiye sauran kashi casa'in da tara a wurinSa, dõmin Ya bãyar da bãyinSa a Rãnar ¡iyãma. Duk wata rahamar da muka taba gani a wannan duniyar, to kashi daya ne na kashi dari.",
      "Don haka ne madaidaicin mumini ke rayuwa tsakanin bege da tsoro, kamar tsuntsu mai tashi da fikafikai biyu. Yana jin tsoron adalcin Allah ba ya gajiyawa ko gafala da zunubi, kuma yana fatan rahamar Allah ba zai yanke kauna ba, komai nisansa. karkata gaba ɗaya zuwa ga tsoro yana haifar da rashin bege; karkata gaba ɗaya zuwa ga bege yana haifar da girman kai. Sunayen Allah - Ar-Rahman (Mai jin ƙai), Ar-Raheem (Mai jin ƙai), Al-Ghafoor (Mai gafara) - anga reshen bege.",
      "To, wannan shi ne ruhin da kuke rufewa da shi kowace rana: ku roki Allah Firdausi, ku yi iyakar kokarinku, ku tuba kan kurakuranku, sannan ku mika darajarku ta karshe ga mai adalci da jin kai – kuna da imani cewa wanda ya kiyaye kashi casa’in da tara na rahama a wannan ranar ba zai karkatar da wani bawan da ya je masa yana jihadi da fata ba.",
    ],
    quran: [
      {
        excerpt:
          "Kuma rahamaTa, Mai kẽwayẽwa ce ga dukan kõme. To, zan hukunta shi a kan waɗanda suka yi taƙawa, kuma suke bayar da zakka, da waɗanda suka yi imani da ayoyinMu.",
      },
      {
        excerpt:
          "Ka ce: Ya ku bayiNa wadanda suka yi zalunci a kansu, kada ku yanke tsammani daga rahamar Allah. Lallai Allah yana gafarta zunubai baki daya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Babu dayanku da zai shiga Aljanna da aikinsa shi kadai. Sai suka ce: Ba kai ma ya Manzon Allah ba? Ya ce: “Ko da ni, sai dai idan Allah Ya lullube ni da rahamarSa.",
      },
      {
        excerpt:
          "Allah yana da sassa dari na rahama. Ya saukar da wani bangare a cikin aljannu da mutane da dabbobi da kwari, da su suke tausayawa junansu; kuma ya kiyaye kashi casa’in da tara a wurinSa, domin ya yi rahama ga bayinSa a Ranar kiyama.",
      },
    ],
    actions: [
      "Ka daidaita tsoron Allah da fatan rahamarSa.",
      "Kada ku yanke ƙauna bayan zunubi - tuba kuma ku ci gaba da ƙoƙari.",
      "Ka roki Allah ya saka masa da Aljannah Firdausi da kyakkyawan karshe (husn al-khatimah).",
    ],
    appLinks: [{}, {}],
  },
];

export const JANNAH_GATES_HA: DeepPartial<JannahGate>[] = [
  {
    name: "Kofar Sallah",
    deedSummary: "Ga wadanda suka kiyaye kuma suka tsayar da salloli biyar.",
    hadith: [
      {
        excerpt:
          "Wanda ya ciyar da wani abu guda biyu a cikin tafarkin Allah, za a kira shi daga kofofin Aljanna. Kuma wanda ya kasance daga ma'abuta salla za a kira shi daga qofar Sallah.",
      },
    ],
  },
  {
    name: "Kofar Sadaka",
    deedSummary: "Ga wadanda suka yi sadaka da gaskiya don Allah.",
    hadith: [
      {
        excerpt: "Wanda ya kasance daga cikin ma'abuta sadaka za a kira shi daga kofar Sadaka.",
      },
    ],
  },
  {
    name: "Gate of Ar-Rayyan",
    deedSummary: "An keɓe wa waɗanda suka yi azumi - kofa kawai suna shiga.",
    hadith: [
      {
        excerpt:
          "A cikin Aljanna akwai wata kofa mai suna Ar-Rayyan, wacce ta cikinta ne masu azumi za su shiga ranar kiyama. Idan na karshensu ya shiga sai a rufe.",
      },
    ],
  },
  {
    name: "Kofar Jihad",
    deedSummary: "Ga waɗanda suka yi jihadi a cikin hanyar Allah da ikhlasi.",
    hadith: [
      {
        excerpt: "Duk wanda yake cikin mutanen jihadi za a kira shi daga kofar Jihadi.",
      },
    ],
  },
  {
    name: "Ladan aikin Hajji",
    deedSummary: "Ga wadanda suka yi aikin Hajji zalla, suna komawa ba tare da zunubi ba.",
    hadith: [
      {
        excerpt:
          "Duk wanda ya yi aikin Hajji don Allah, bai yi alfasha ko fasiqanci ba, ya koma ba laifi, kamar ranar da mahaifiyarsa ta haife shi.",
      },
    ],
  },
  {
    name: "Ana kiranta daga kowace kofa",
    deedSummary: "Wasu kamar Abubakar, za a kira su su shigo daga dukkan kofofin.",
    hadith: [
      {
        excerpt:
          "Abubakar ya ce: Shin za a kira wani daga dukkan wadannan kofofin? Ya ce: Eh, kuma ina fatan za ka kasance cikinsu.",
      },
    ],
  },
];

export const JANNAH_VERSES_HA: DeepPartial<JannahVerseEntry>[] = [
  {
    excerpt:
      "Ku yi tsẽre zuwa ga gãfara daga Ubangijinku, da Aljanna mai faɗin sammai da ƙasã, an yi tattalinta dõmin mãsu taƙawa.",
  },
  {
    excerpt:
      "Gidãjen Aljanna, ƙoramu na gudãna daga ƙarƙashinsu, da ɗãkuna mãsu dãɗi a cikin gidãjen Aljannar zama, kuma yardar Allah ne mafi girma.",
  },
  {
    excerpt:
      "gidãjen Aljannar mafaka, liyafa ga waɗanda suka yi ĩmãni kuma suka aikata ayyukan ƙwarai.",
  },
  {
    excerpt:
      "Bãbu wani rai sanin abin da aka ɓõye musu na dãɗi, dõmin sakamako ga abin da suka kasance sunã aikatãwa.",
  },
  {
    excerpt: "Suna da abin da suke so a cikinta, kuma a wurinMu akwai ƙari.",
  },
  {
    excerpt: "Domin duk za a sami digiri gwargwadon abin da suka yi.",
  },
  {
    excerpt: "Waɗannan darajõji ne a wurin Allah, kuma Allah Mai gani ne ga abin da suke aikatãwa.",
  },
  {
    excerpt:
      "Ya Ubangijinmu ka bamu mai kyau a duniya da mai kyau a lahira, kuma ka kare mu daga azabar wuta.",
  },
  {
    excerpt:
      "Kada ku yanke tsammani daga rahamar Allah. Lalle ne, Allah Yana gafarta zunubai gaba daya.",
  },
  {
    excerpt: "BãyiNa bãbu tsõro a kanku a yau, kuma bã zã ku yi baƙin ciki ba.",
  },
  {
    excerpt: "Kuma magabatan farko, wadanda aka kusantar.",
  },
  {
    excerpt:
      "Don haka Allah zai kare su daga sharrin wannan ranar, kuma Ya ba su haske da jin dadi.",
  },
];

export const JANNAH_DUAS_HA: DeepPartial<JannahDuaEntry>[] = [
  {
    context: "Cikakken addu'ar alheri a cikin talikai da kariya daga wuta.",
  },
  {
    context: "Addu'a taqaice bayan tashahud: ku nemi Aljannah da tsari daga Wuta.",
  },
  {
    context: "Ku nemi Aljannah tare da kyawawan sunayen Allah bayan tashahud.",
  },
  {
    context: "Ka nemi dadin ganin Allah da kwadayin haduwa da shi.",
  },
];

export const JANNAH_PROMISED_HA: DeepPartial<JannahPromisedEntry>[] = [
  {
    name: "Aljannar Alkawari Goma",
    summary:
      "Abu Bakr, Umar, Uthman, Ali, Talhah, Zubair, Abdurrahman bn Awf, Sa'ad, Sa'id bn Zaid, da Abu Ubaidah (Allah Ya yarda da su).",
    note: "Sunan su tare a cikin wani hadisi a Sunan al-Tirmidhi (3747, sahih).",
  },
  {
    name: "Masu gaskiya da hakuri",
    summary: "Allah ya yabi masu gaskiya da imani da hakuri akan biyayya da jarrabawa.",
    note: "Duba Alkur'ani 4:69 da ayoyi masu yawa akan as-sadiqeen da as-sabireen.",
  },
  {
    name: "Shahidai a tafarkin Allah",
    summary:
      "Wadanda suka mutu suna kare Musulunci a shari'ar Musulunci, ana yi musu bushara da Aljanna.",
    note: "Malamai suna ayyana shahadah daidai gwargwado; Ba kowane mutuwa a cikin yaƙi ke cancanta ta atomatik ba.",
  },
  {
    name: "Wadanda maganarsu ta karshe tauhidi ce",
    summary: "Wanda karshen kalmarsa ta kasance 'La'ilaha illallah' zai shiga Aljannah.",
    note: "Sunan Abu Dawud 3116 (sahih). Kyakkyawar ƙarewa ita ce bi ta rayuwa.",
  },
  {
    name: "Annabawa",
    summary: "Kowane Annabi yana cikin mafi girman darajoji na Aljanna da izinin Allah.",
    note: "Ba a isa tashar su ta hanyar ayyukan yau da kullun - ana zaɓe su kuma ana kiyaye su.",
  },
];
