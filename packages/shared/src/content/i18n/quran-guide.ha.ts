// Hausa translation overlays for the Learn Qur'an content.
// Each overlay mirrors the order of its English source array in ../quran-guide*.ts
// (index-aligned); untranslated entries fall back to English. Only human-readable
// text is translated — ids, routes, surah/ayah numbers, collections, citations,
// grades, and Qur'an verse-reference labels stay in the English source.
import type {
  QuranGuideApplyChallenge,
  QuranGuideDailyLesson,
  QuranGuideLetter,
  QuranGuideMemorizationPlan,
  QuranGuidePronunciationPair,
  QuranGuideQuizQuestion,
  QuranGuideReadingLevel,
  QuranGuideStory,
  QuranGuideStructureLevel,
  QuranGuideTadabburPrompt,
  QuranGuideTajweedLesson,
  QuranGuideTheme,
  QuranGuideTimelineEvent,
  QuranGuideTopic,
  QuranGuideVocabEntry,
} from "../../types/quran-guide";
import type { DeepPartial } from "./localize";

export const QURAN_GUIDE_TOPICS_HA: DeepPartial<QuranGuideTopic>[] = [
  {
    title: "Gabatarwa",
    summary: "Menene Alkur'ani, me ya sa aka saukar da shi, da falalar karatun.",
    body: [
      "Kalmar Kur'ani ta fito ne daga tushen larabci qara'a, ma'ana karantawa ko karantawa da ƙarfi - don haka Littafin yana ɗaukar manufarsa da sunansa: ana son karanta shi akai-akai, akan harshe da zuciya. A cikin akidar Ahlus-Sunnah na al'ada, Alkur'ani shi ne magana ta zahiri, wacce ba a halicce ta ba, wanda Allah ya saukar da shi cikin bayyanannen larabci ga Annabi Muhammad SAW ta hanyar Mala'ika Jibreelu tsawon shekaru 23, tun daga kalmomin farko a Kogon Hira har zuwa jim kadan kafin wafatin Manzon Allah SAW.",
      "Shi ne nassi na karshe da aka aiko wa bil'adama, yana mai tabbatar da gaskiya a cikin ayoyin da suka gabata ga Musa da Dawud da Isa (amincin Allah ya tabbata a gare su) da kuma cika sakon da suke dauke da shi. Allah ya bayyana manufarsa a sarari: An saukar da ita 'a matsayin shiriya ga mutane' - don fitar da mutane daga cikin duhun rudani da bautar gumaka zuwa ga hasken tauhidi, da bautar Allah Shi kadai, da kyawawan halaye, da shiri mai tsanani ga rayuwa mai zuwa. Kowane annabi ya yi kira zuwa ga wannan jigon; Alkur'ani shine sifarsa ta karshe, kariya.",
      "Karatun Alkur'ani shi kansa ibada ne, ba wai karanta bayanai kawai ba. Annabi SAW ya koyar da cewa duk harafi daya da aka karanta yana samun kyakkyawan aiki, kuma kowane aikin alheri yana ninka akalla sau goma - don haka ko mafari ya fitar da layi daya ya riga ya tara lada. A ranar kiyama Alkur'ani zai zo a matsayin mai ceto, yana roko a madadin wadanda suka yi tarayya da shi a rayuwar duniya. Wanda ya karanta ta da kyau yana cikin tawagar mala’iku ma’abota daraja, marubuta, kuma wanda ya yi tuntuɓe a kansa, yana ƙoƙari ya koyi, yana samun lada ninki biyu na ƙoƙarin.",
      "Yana taimakawa wajen bayyana abin da ba Kur'ani ba. Kur'ani kalmomin Allah ne na zahiri a cikin Larabci, ba su canzawa tun wahayi. Hadisin – zantukan Annabi ﷺ, da ayyukansa, da yardarsa na shiru – sun rabu: suna bayani da bayyana Alqur’ani amma faxin Manzon Allah Sallallahu Alaihi Wasallama ne, waxanda ake tsare da su ta hanyar sarqoqin riwayoyi da aka ambata, kuma malamai suka sanya su a matsayin sahihi (ingantacce), hasan (mai kyau), ko da’if (rauni). Dukansu wahayi ne kuma duka biyun suna daurewa, amma Alkur'ani ne kawai ake karantawa a matsayin ibada a cikin addu'a, kuma Alkur'ani ne kawai maganar Allah mai banmamaki, maras cikawa.",
    ],
    quran: [
      {
        excerpt:
          "Watan Ramadan da aka saukar da Alkur’ani a cikinsa a matsayin shiriya ga ‘yan Adam…",
      },
      {
        excerpt:
          "Ka ce: “Da mutane da aljanu sun taru domin su zo da misalin wannan Alkur’ani, ba za su…",
      },
    ],
    hadith: [
      {
        excerpt:
          "Duk wanda ya karanta harafi daga littafin Allah yana da hasanah, kuma hasanah ana ninka shi da goma.",
      },
      {
        excerpt:
          "Ka karanta Alkur'ani, domin zai zo ne a matsayin mai ceto ga sahabbansa ranar kiyama.",
      },
      {
        excerpt:
          "Wanda ya kware a cikin Alkur’ani yana tare da ma’abota ilimi na kwarai, kuma wanda ya karanta shi da kyar, yana takure a kansa, yana da lada ninki biyu.",
      },
    ],
    actions: [
      "Saita ƙayyadaddun lokaci na rana don Kur'ani - ko da minti biyar da aka mayar da hankali yana gina baraka da daidaito.",
      "Karanta aƙalla layi ɗaya mai ma'ana: karanta Larabci, sannan karanta fassarar a hankali.",
      "Bude karatun Alkur'ani Munib ka ci gaba daidai inda ka tsaya.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yadda aka saukar da Alkur'ani",
    summary: "Kogon Hira, Jibrilu, Makkan da Madina, hadawa, kiyayewa.",
    body: [
      "Wahayin ya fara ne a cikin watan Ramadan, a lokacin da Manzon Allah SAW ya cika shekara arba'in da haihuwa, ya tafi kogon Hira a kan wani dutse da ke wajen Makka don kadaici da tunani. Can sai Mala'ika Jibrilu ya zo masa, ya ce: 'Karanta!' Annabi SAW, wanda bai karanta ba, bai rubuta ba, ya amsa cewa ba zai iya ba - har sai Mala'ika ya rungume shi ya isar da ayoyi biyar na farkon surar Alaq: 'Ka yi karatu da sunan Ubangijinka wanda ya yi halitta.' Girgiza kai ya koma gida wajen matarsa ​​Khadijah, ta kwantar masa da hankali, ta kai shi wurin dan uwanta Waraqah bn Nawfal, wani malami mai ilimi wanda ya gane mala'ikan wahayi kuma ya tabbatar da haka shi ne manzon da ya zo wurin Musa.",
      "Sai aka ɗan dakata a wahayi (fatrah), lokacin shiru wanda ya sa Manzon Allah ﷺ ya ɗorawa fiye da haka; sai ya ci gaba da ci gaba a matakai har karshen rayuwarsa. Wahayi ba ta sauko gaba daya ba, amma an saukar da ita ne domin amsa abubuwan da suka faru, da tambayoyi, da bukatu na al'umma - hanya ce sannu a hankali Allah ya siffanta da karfafa zuciyar Annabi SAW da saukaka littafi cikin rayuwar mutane.",
      "Zaman Makkan ya kai kimanin shekaru goma sha uku. surorinsa sau da yawa gajeru ne, masu kauri, da karfi; suna dunkule ginshikan - kadaita Allah, da yakinin tashin kiyama da hisabi, da kissoshin annabawan farko wadanda aka karyata su sannan aka tabbatar da su, da kira mai girma zuwa ga gyara dabi'u a cikin al'ummar da ta kullu cikin bautar gumaka da zalunci.",
      "Bayan Hijira zuwa Madina a shekara ta 622 Miladiyya, Musulmi ba ‘yan tsiraru ne da ake zalunta ba, sai dai al’umma ce ta gina al’umma. ayoyin Madina gaba daya sun fi tsayi da filla-filla, suna shimfida shari’a da tsarin zamantakewar da sabuwar al’umma ke bukata: kebantuwar sallah, zakka, azumi, gado, aure da saki, kwangiloli, yaki da yarjejeniyoyin, tare da tabbatacciyar magana ga munafukai wadanda suke bata al’umma daga ciki.",
      "Tsare nassi ya fara ne tun a zamanin Annabi ﷺ kansa. Sahabbai sun haddace wahayi kamar yadda ya zo, kuma marubuta suka rubuta shi a kan takarda, dabino, kashi, da dutse a karkashin kulawar Annabi SAW kai tsaye. Bayan malaman hadisai da dama sun yi shahada a yakin Yamama, Abubakar ya umurci Zayd bn Thabit da ya tattara rubutaccen Alkur'ani a cikin tarin suhuf guda daya. Bayan haka, yayin da daular ke yaduwa da yarukan yare daban-daban, Usman ya sa aka yi kwafi masu inganci a yaren Kuraishawa aka aika zuwa manyan garuruwa, ya daidaita rubutu guda daya ga al’umma baki daya.",
      "Allah da kansa ya lamunce kariyar Alkur'ani: \"Hakika mun saukar da tunatarwa, kuma lalle ne mu, masu kiyaye shi.\" Wannan alkawari ya cika ta hanyar tsare-tsare guda uku - haddar taro a kowane tsara, da rubutaccen sako a rubuce, da kuma sarkar karantarwa ga dalibi da ba ta karye ba ga Annabi SAW. Ga mai bi wannan alamar tauhidi ce; ga mai tarihin tarihi tabbatacciya ce: Kur'ani da ake karantawa a yau shi ne nassin da aka saukar ƙarni goma sha huɗu da suka gabata.",
    ],
    quran: [
      {
        excerpt: "Lalle Mũ, Mun saukar da tunãtarwa, kuma lalle Mũ, Mãsu tsare shi ne.",
      },
      {
        excerpt: "Ka yi karatu da sunan Ubangijinka, wanda ya yi…",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tsarin Alkur'ani",
    summary: "surorin 114, juz 30, aya, Makki/Madani, oda vs wahayi.",
    body: [
      "Mus'haf - kwafin Kur'ani na zahiri - ya ƙunshi surori 114 (surori), kowannensu yana da sunansa, yawanci ana ɗauka daga kalma mai ban mamaki a cikinsa. An jera su galibi daga mafi tsawo zuwa mafi gajarta, ko da yake ba a kayyade ba: Fatiha, gajeriyar babin budewa, ta zo ta farko a matsayin kofar shiga littafi, kuma Al-Baqarah mai tsawo ta biyo baya. Wannan tsari na tawqfi ne - Jibrilu ne ya koyar da wannan umarni ga Annabi SAW kuma ba shi ne tsarin da aka saukar da ayoyin ba. Don haka jerin abubuwan da kuke karantawa a cikin mus'haf na ganganci ne kuma an daidaita su ne daga Allah, ba akan lokaci ba.",
      "Kowace sura ana karkasa ta da Makki (an saukar da ita kafin Hijira) ko kuma Madani (an saukar da ita bayanta), kadan kuma tana dauke da ayoyin biyun. A matsayin ka'ida, surorin Makki suna mai da hankali kan imani - tauhidi, tashin kiyama, da kissoshin annabawa - a takaice, mafi gaggawar sassa, yayin da surorin Madani suka kara dalla-dalla dokoki da jagorar al'umma da al'ummar da take zaune take bukata. Sanin wacece ke taimaka maka karanta sura a haskenta.",
      "Domin karantarwa mai iya sarrafa alqur'ani kuma an raba shi zuwa kashi 30 daidai gwargwado ana kiransa juz (jam'i ajza'), kuma kowace juz zuwa rabi biyu ana kiransa hizb, yana bada hizbi 60 gaba daya. Wannan shi ne abin da ya sanya Khatm na Ramadan - kammala Alkur'ani a cikin wata guda - ya zama dabi'a: juz'i daya a rana yana gama littafin a cikin kwanaki talatin, rabin juz sau biyu kullum ya fi sauki. A cikin kowace surah an lissafta ayoyi (ayoyi) don haka kowane nassi za a iya kawo shi daidai da surah: aya; Madaidaicin kidayar Madina ita ce ayoyi 6,236, tare da qananan bambance-bambancen rubuce-rubuce kan yadda aka lissafta ’yan iyakoki – nassin da kansa ya yi daidai.",
      "Fahimtar wannan tsarin yana juya maƙasudin niyya zuwa ƙaƙƙarfan shiri. Kuna iya ƙaddamar da ƙayyadaddun rabo na yau da kullun, manufa Juz Amma (banshi na ƙarshe, na talatin, cike da gajerun surori) don haddace, ku bi jigo ɗaya kamar haƙuri a cikin surori da yawa, ko tsara cikakken karatu a kusa da Ramadan. Tsari shine ginshiƙan da ke sa dangantaka ta rayuwa da Alƙur'ani ta kasance mai dacewa.",
    ],
    quran: [
      {
        excerpt:
          "…Littafi ne daki-daki, ayoyinsa daki-daki, Alkur'ani ne na Larabci ga mutane wadanda suke sani.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Koyi karatu",
    summary: "Matakai bakwai daga haruffa zuwa ingantaccen karatu - don cikakken mafari.",
    body: [
      "Kusan kowane musulmi yana sha'awar karanta kur'ani a cikin harshen larabci na asali, kuma manufa ce mai cikakken iko a kowane zamani - manya marasa adadi waɗanda ba su da larabci kafin su koyi karatu sosai. Fahimtar fassarar yana da daraja, amma karanta ainihin kalmomin Larabci shi kansa ibada ne, kuma yana da kyau a yi ƙoƙari. Wannan hanyar tana ɗaukar ku mataki-mataki daga rashin gane harafi ɗaya zuwa karanta ayoyi tare da daidaitattun furci.",
      "Tafiya tana tafiya ta matakai bakwai na halitta. Matakan 1 da 2 suna gina haruffan haruffa - na farko haruffa 28 a cikin keɓewar sigarsu, sannan yadda surarsu ke canzawa a farkon kalma, tsakiya, da ƙarshen kalma. Mataki na 3 yana gabatar da harakat, ƙananan alamomi (fatha, kasra, damma, sukun, shadda, taween) waɗanda ke nuna muku wasali kowane harafi yake ɗauka. Matakai na 4 da na 5 sune inda yake dannawa: kuna haɗa haruffa zuwa harrusai kuma ku fitar da kalmomi gabaɗaya, gami da ka'idojin harafin rana da wata don takamaiman labarin 'al-'. Mataki na 6 da na 7 ya koma ga gajerun ayoyi sannan kuma a santsi, karantawa sosai tare da ainihin ka'idojin tajwidi.",
      "Halaye biyu suna hanzarta komai. Na farko, a koyaushe ku saurari ƙwararrun malami kuma ku yi koyi da shi - Kur'ani an saukar da shi ta hanyar kunne, daga baki zuwa baki, don haka kunnenku shine mafi kyawun ku; kwafi rhythm, tsawon wasula, da siffar kowace sauti. Na biyu, bibibi da rubuta haruffa, a kan takarda ko allo, domin hannu yana ƙarfafa abin da ido da harshe suke koyo.",
      "Tsanaki ɗaya: ƙa'idodi da rakodi suna da kyakkyawan tallafi, amma ba za su iya gyara ku yadda mutum zai iya ba. Annabi SAW ya koyi Alkur'ani kai tsaye daga Jibrilu kuma ya karantar da shi ido-da-ido ga sahabbai, kuma rayayyun tsarin gyara shi ne yadda ake kiyaye karantarwa a koda yaushe. Nemo malami na gida ko tsarin tajweed na kan layi don sauraron ku da gyara kurakurai da ba za ku iya jin kanku ba.",
    ],
    actions: [
      "Yi nazarin harafi ɗaya a rana a cikin sashin haruffan Larabci - duba shi, ji, faɗi, rubuta shi.",
      "Saurari Suratun Fatiha akan maimaitawa yayin da kuke bin kalmomi a cikin mushaf.",
      "Shirya malami - na gida ko kan layi - don jin karatun ku da gyara ku kowane mako.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tajweed",
    summary: "Dokokin kyawawa da karantawa daidai - tsakar rana sakin, madd, waqf, da ƙari.",
    body: [
      "Tajweed ya fito ne daga tushen ma'anar yin wani abu mai kyau ko kyakkyawa. A matsayinsa na ilimi yana nufin ba kowane harafi hakkinsa - madaidaicin inda yake magana a cikin baki ko makogwaro (makhraj), halayensa na asali (sifat), da lokacin da ya dace na wasali da dakatarwa. A taqaice dai tajwidi ita ce fasahar karatun Alqur’ani kamar yadda aka saukar da shi.",
      "Wannan yana da mahimmanci domin Kur'ani ba kowane nassi ne kawai da za a karanta a hankali ba. Ya zo da tajwidi an riga an gina shi a ciki: Jibril ya karanta wa Annabi Sallallahu Alaihi Wasallama da lafazin madaidaici, Annabi Sallallahu Alaihi Wasallama ya karanta ta ga sahabbai, suka ba mu ita ba ta karye. Yin kuskuren harafi ba ƙaramin abu ba ne - kuskuren faɗin harafi yana iya canza kalma gaba ɗaya (misali rikitar da ص da bayyanannun س, ko haruffan makogwaro ع da ح), kuma a wasu wuraren da suke canza ma'anar kalmomin Allah. Ilimin tajwidi ya wanzu don kiyaye shi daidai.",
      "Ba kwa buƙatar sarrafa komai lokaci guda. Ana koyon ainihin ka'idojin: hukunce-hukuncen azahar sakinah da taween (izhar, idgham, iqlab, ikhfa), hukunce-hukuncen meem sakinah, nau'ikan madd (elongation), qalqalah (hasken billa kan wasu haruffa), ghunnah (haskar hanci), da wakafi (inda da yadda ake tsayawa). Kowannensu yana da fayyace ma'anarsa, misalan yau da kullum, da kuma wani abu da za a yi aiki da shi, kuma wannan cibiya ta bi ta su daya bayan daya.",
      "Tsayayyen ƙa'idar babban yatsa: koyi tajweed da kunne daga ƙwararren malami, ba daga littattafai ko apps kaɗai ba. Karanta wa wanda zai iya jin kurakuranka ya gyara su - haka ake koyar da tajwidi a ko da yaushe, kuma ita ce kawai amintacciyar hanya zuwa ga daidaito na hakika kuma, a ƙarshe, ijazah (shararriyar sarkar karantarwa).",
    ],
    hadith: [
      {
        excerpt: "Mafifitanku su ne wadanda suka koyi Alkur'ani kuma suka karantar da shi.",
      },
      {
        excerpt:
          "Wanda ya kware a cikin Alkur’ani yana tare da ma’abota ilimi na kwarai, kuma wanda ya karanta shi da kyar, yana takure a kansa, yana da lada ninki biyu.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "haruffan Larabci",
    summary: "Haruffa masu hulɗa - suna, sauti, misalai na kowane haruffa 28.",
    body: [
      "Harafin Larabci yana da haruffa 28, rubuce da karantawa daga dama zuwa hagu. Ba kamar Turanci ba, yawancin haruffa suna haɗawa da waɗanda ke gefen su, don haka harafi ɗaya na iya ɗaukar ɗan ƙaramin siffa dangane da ko yana tsaye shi kaɗai ko yana zaune a farkon kalma, tsakiya, ko ƙarshen kalma. Koyon gano harafi ɗaya a cikin nau'o'insa daban-daban yana ɗaya daga cikin ainihin ci gaba na farko.",
      "Larabci na Kur'ani ya shimfiɗa wasu ƙarin siffofi a saman ainihin haruffa: hamza (tashawar duniya), haruffan dogon wasali alif, waw, da ya wanda ke shimfiɗa sauti, da kuma tsarin harafin rana da wata da ke yanke hukunci ko 'l' na tabbataccen labarin 'al-' an furta shi ko kuma a shiru cikin harafi na gaba. Waɗannan suna da sauƙi da zarar kun haɗu da su a cikin kalmomi na gaske.",
      "Kowane katin harafi da ke cikin wannan sashe yana ba ku keɓantaccen nau'in harafin, sunansa, fassarar fassararsa, ƙarin magana mai amfani, da kuma misalan Kur'ani na gaske don ku koyi sautin a mahallin maimakon a zahiri. Mafi inganci na yau da kullun shine madauki mai mataki huɗu don kowane harafi: duba shi, ji ana karantawa, faɗi da ƙarfi da kanku, sannan rubuta shi.",
      "Ka kafa kowace sabuwar harafi zuwa kalmomin da ka riga ka gane - Allah, Rabb (Ubangiji), ar-Rahman (Mai jin ƙai), Bismillah. Haɗa sifofin da ba a sani ba zuwa sanannun ma'anar yana sa su manne da sauri fiye da haƙon haruffa a keɓe.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Lafazin lafazin",
    summary: "Jagora masu wuyar haruffa - ayn, ha, bakin ciki, baba, qaf, da ƙarfafawa.",
    body: [
      "Larabci yana ƙunshe da sautuna da yawa waɗanda ba su da daidai daidai da Ingilishi, kuma a nan ne waɗanda ba su iya magana ba sukan zamewa. Rikicin da aka fi sani shine tsakanin haruffa masu kama da kunnen da ba a horar da su ba amma ana furta su daga wurare daban-daban a cikin baki ko makogwaro - kuma haɗuwa da su zai iya canza ma'anar kalma, shi ya sa suka cancanci sadaukar da kai.",
      "Haruffa masu mahimmanci - ṣ (ص), ḍ (ض), ṭ (ط), da ẓ (ظ) - nau'ikan haruffan 'nauyi' ne. Don samar da su kuna ɗaga bayan harshe kuma ku cika baki da cikakkiyar sauti mai zurfi, wani abu da masu magana da harshe ke sha a lokacin ƙuruciya amma dole ne masu koyo su gina su da sane. Kwatanta kowane mai ƙarfafawa kai tsaye tare da takwaransa na haske: س against ص, د against ض, ت against ط, ذ against ظ.",
      "Haruffa na makogwaro su ne sauran babban matsala. Ayn (ع) takura ce daga tsakiyar maƙogwaro, kuma ha (ح) ƙaƙƙarfan gogayya ce, mai numfashi - babu shi a cikin Ingilishi, kuma babu cikakken bayanin da zai maye gurbin jin su. Qaf (ق) shine 'k' mai zurfi daga bayan harshe, daban da kaf na gaba (ك).",
      "Ingantacciyar hanyar ita ce kwatanta nau'i-nau'i a gefe da gefe, sannan ku duba kanku da jinkirin karatun murattal. Yi rikodin muryar ku tana karanta gajeriyar kalma, kunna ta akan mai karantawa, kuma daidaita. Har ma mafi kyau, sami ƙwararren malami ya saurara - wasu kurakurai kusan ba za a iya kama su cikin rikodin naku ba.",
    ],
    appLinks: [{}],
  },
  {
    title: "Kalmomin Kur'ani",
    summary: "Kalmomi masu girma-yawan fahimta duk lokacin da kuke karantawa.",
    body: [
      "Anan akwai wata hujja mai ƙarfafawa: ƙananan kalmomi masu maɗaukakin maɗaukaki—kan ɗaruruwan ƙalilan — suna da kaso mai yawa na nassin kur’ani mai gudana, domin mahimman kalmomin suna maimaita akai-akai. Koyon ainihin ƙamus shine mataki ɗaya mafi girma da za ku iya ɗauka, saboda yana canza karatun daga rafi na sauti zuwa kalmomi waɗanda ainihin ma'anarsu kuke kamawa yayin karantawa.",
      "Ba ka fassara Kur'ani kalma da kalma ta wannan hanya - wato aikin tafsiri da tafsiri - amma ka fara gane sunayen Allah, da umarni, alkawuran, da gargaɗin da suke raye, a lokacin karantawa. Fara da kalmomin da suka fi bayyana kuma suna ɗauke da mafi girman nauyi: Allah, Rabb (Ubangiji), rahmah (rahmah), iman (imani), sabar (haƙuri), takawa (ji tsoron Allah), duniya (duniya), da akhirah (Lahira). Daga saitin anga, faɗaɗa waje kaɗan kaɗan.",
      "Yi amfani da tazarar maimaitawa maimakon murkushewa. Koyan sabbin kalmomi guda biyar a mako da yin bitar dukkansu a kullum zai kai ka a cikin shekara guda fiye da haddace hamsin a zama daya ka manta da su. Allah ya yi alkawari cewa an sauƙaƙa da kur'ani a cikin zuciyarsa - ku kusanci ƙamus ɗinsa a hankali kuma za ku ji wannan sauƙi da idon basira.",
    ],
    quran: [
      {
        excerpt:
          "Kuma lalle ne, haƙĩƙa, Mun sauƙaƙe Alƙur'ãni dõmin tunãwa, to, shin, akwai mai tunãni?",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Tafsiri",
    summary: "Fahimtar wahayi - bayyani, mahallin, da sanannun tushen ilimi.",
    body: [
      "Tafsiri na nufin bayani da tafsirin Alkur'ani - bayyana ma'anar aya, dalilin da ya sa ta sauka, da yadda take aiki. Domin wadannan fa'idodin Allah ne, malamai sun kafa tsari mai tsauri kan yadda za a yi bayanin Alqur'ani, da zama a cikinsa yana kiyaye ku daga bata.",
      "Mafi kyawun tafsirin shi ne Kur'ani yana bayanin kansa: ayar da ta gajarta a wuri guda ana yawan fadada ta a wani wuri, don haka Alkur'ani shi ne mafi kyawun tafsirinsa. Bayan haka kuma bayani ya zo da Sunnah, tunda an aiko Annabi ﷺ daidai ne domin ya bayyanar da wahayi, kuma maganganunsa da ayyukansa suna nuna mana yadda aka yi ta. Bayan haka sai fahimtar sahabbai wadanda suka shaidi wahayi kuma sun san mahallinsa kai tsaye, sannan kuma manyan malamai da suka zo bayansu. Na ƙarshe kuma mafi ƙasƙanci shine fassarar harshen Larabci da kansa. Abin da ba shi da wuri kwata-kwata shine ra'ayi na sirri mara cancanta - karanta ra'ayoyin ku a cikin rubutu.",
      "Muhimmin kayan aiki a cikin tafsiri shine asbab al-nuzul, lokuttan wahayi: sanin aukuwa ko tambayar da ta sa aya kan buɗe ma'anarta. Amma waɗannan rahotannin dole ne su kansu su kasance ingantattun su, tunda ba kowane 'lokuta' da aka riwaito ba ne abin dogaro ba. Ga kowace sura, tafsiri mai kyau yana ba ku tsarin tarihinta inda aka kafa, manyan jigoginta, ayoyinta masu muhimmanci, da darussan da ya kamata ku dauka.",
      "Daga cikin nassoshi da aka fi sani kuma amintacce akwai Tafsiri Ibn Kathir (Mai cikakken bayani da taka tsantsan wajen kawo hadisi da zantuka na farko), Tafsirin as-Sa’di (bayyanannu, na zamani, da mai da hankali kan shiriya a aikace), da Tafsirin Tabari na gargajiya (encyclopaedic, kiyaye fassarori na farko). Duk lokacin da kuka koyi ma'ana, ku lura da wane tushe ya fito. Wannan cibiya tana koyar da hanyoyin; a yi amfani da karatun Alqur'ani na Munib, wanda ke danganta tafsirin dunƙule da na nesa, don nazarin aya-ba-yara.",
    ],
    sources: [
      "Tafsir Ibn Kathir — taqaitaccen Ingilishi da yawa",
      "Tafsir as-Sa'di - taƙaitaccen bayani",
      "Asbab al-Nuzul na al-Wahidi - lokuttan wahayi (tabbatar da ingancin kowane abin da ya faru)",
    ],
    disclaimer:
      "Tafsiri ya bambanta a zurfin. Idan malamai suka yi sabani, a lura da bambanci ba tare da yin da’awar tabbatuwa ba inda Allah bai bayyana shi ba.",
    appLinks: [{}],
  },
  {
    title: "Jigogi na Alkur'ani",
    summary: "Bangaskiya, addu'a, haƙuri, sadaka, annabawa - ayoyin da aka haɗa su da jigo.",
    body: [
      "Ba a tsara Alkur'ani kamar littafin karatu ba, batu daya a kowace sura. A maimakon haka manyan jigoginsa - kadaita Allah, addu'a, hakuri, sadaka, annabawa, Lahira, adalci, iyali - ana saka su a ko'ina, suna bayyana kuma suna sake bayyana a cikin surori da yawa, kowane lokaci daga sabon kusurwa. Abin da ya fara kama da maimaitawa shine ainihin ƙarfafawa: ana gabatar da jigo, sannan a zurfafa, sannan a haɗa shi da wani, har sai duk saƙon ya tsaya a matsayin kira ɗaya.",
      "Yin nazarin Kur'ani da jigo yana bayyana wannan haɗin kai. Lokacin da kuka tattara abin da Kur'ani ya ce game da shi, godiya ko dogara ga Allah daga cikin surorinsa, ayoyi daban-daban suna haskaka juna kuma darasin ya zama cikakke kuma cikakke. Kowane jigo na shiga cikin wannan cibiya yana tattara ayoyin da suka dace, suna tallafawa ingantaccen hadisi inda suke ƙara haske, darussa na asali, da ayyuka na zahiri don ilimin ba zai tsaya a kan ka'ida ba.",
      "Sama da duka, haɗa jigogi zuwa rayuwar ku. Nasiha ga iyaye, gaskiya a kasuwanci, adalci a cikin aure, tsayawa ga adalci ko da ba son ranka ba - wadannan ba surori ne masu ban sha'awa ba, amma yanke shawara na yau da kullun Kur'ani yana neman ku yanke. Karanta kowane jigo kamar tambayar da aka yi maka: ta yaya wannan ya canza abin da nake yi a yau?",
    ],
    appLinks: [{}],
  },
  {
    title: "Labarun cikin Alkur'ani",
    summary: "Annabawa tun daga Adamu har zuwa Muhammad ﷺ - darussa, wurare, ayoyi masu alaƙa.",
    body: [
      "Kur'ani ya ba da labarin annabawa - Adamu, Nuhu, Ibrahim, Yusuf, Musa, Isa, da sauransu da yawa - kuma ya bayyana mana dalilin da ya sa: 'A cikin labaransu akwai darasi ga masu hankali.' Waɗannan asusun ba labari bane ko nishaɗi. Wa'azi ne, wanda Allah ya zaɓa kuma ya gaya musu su koyar da imani, haƙuri, da kuma yadda za a fuskanci jarabawar da ke faruwa a kowane zamani.",
      "Yi la'akari da tsarin da ke gudana ta cikin su. Annabawa sun kira mutanensu zuwa ga bautar Allah Shi kadai; an yi musu ba’a, ana adawa da su, sau da yawa ana kore su; sun yi hakuri da cikakken tawakkali ga Allah (tawakkul); Kuma a karshe wa'adin Allah ya kasance. Lokacin da kuka karanta wahalhalun da suka sha, ku sami ƙarfi daga yadda suka amsa - ba tare da taɓa tunanin matsayinku ya yi daidai da nasu ba. Abin nufi shi ne a shayar da tsayin daka da amana, ba wai a kwatanta matsayi ba.",
      "Kur'ani da kansa ya ware labari guda daya: Suratu Yusuf, wadda Allah ya kira 'mafi kyawun kissoshi'. Ba kamar yadda aka saba ba, daga farko har karshe a cikin sura daya, don haka karanta ta a zaune daya a matsayin tafiya mai dorewa - cin amana, hakuri ta hanyar bauta da zaman kurkuku, daga karshe kuma gafara da haduwa - sannan ka kalli yadda shirin Allah ya wakana a bayan shekaru na bala'i da ya bayyana.",
    ],
    quran: [
      {
        excerpt: "A cikin labaransu hakika darasi ne ga masu fahimta…",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Mu'ujizar Alkur'ani",
    summary:
      "Rashin daidaituwar harshe, adanawa, annabce-annabce - tare da taka tsantsan na ilimi.",
    body: [
      "Babban mu'ujizar Kur'ani ita ce Kur'ani da kansa. An saukar da shi ga wanda ba shi da karatu a cikin mafi kyawun zamanin waƙar Larabci, ta ba da ƙalubalen buɗaɗɗen ƙalubale ga masu adawa da ita - masana harshe - don samar da koda sura guda ɗaya kamar ta. Karni goma sha huɗu bayan wannan ƙalubalen bai cimma ruwa ba. Karfin lafazinsa, da tsarinsa, da yadda jigoginsa suka yi cudanya da juna, da kuma daidaiton shiriyarsa da shari’arsa ana nazarinsa a cikin ilimin zamani na balaga (ilm al-balagha), kuma sun kasance, bisa da’awar Kur’ani, ba za a iya misalta su ba.",
      "Adana shi alama ce ta biyu, tabbataccen tabbaci. An kiyaye rubutun a rubuce, ta hanyar rubuce-rubucen rubuce-rubuce a hankali, da kuma ta baka, ta hanyar ƙira'at - sarƙoƙin masu karantawa waɗanda ba a karye ba suna haddace da koyar da shi daidai, tsara zuwa tsara. Wannan an rubuta tarihi ne, ba hasashe na taƙawa ba, kuma yana cika alƙawarin Allah na kiyaye ambaton.",
      "Za ku kuma ji labarin 'mu'ujiza na kimiyya' - ayoyi da suka shafi matakan amfrayo, fadada sararin samaniya, da makamantansu. Kula da waɗannan da kulawa. Tafsirin na gargajiya sau da yawa suna fahimtar irin waɗannan ayoyin ta hanyoyi daban-daban da masu neman gafara na zamani, kuma tilastawa Kur'ani ya dace da kowace hasashen kimiyya da ke canzawa zai iya komawa baya idan ka'idoji sun canza. Bambance tsantsa tsakanin kafaffen fassarar da zato na zamani.",
      "Hakanan masana sun kawo annabce-annabce na tarihi - nasarar da Romawa suka annabta, da bude Makka cikin lumana - kuma sun cancanci yin nazari, amma ta hanyar tafsiri da seerah, ba faifan bidiyo masu ban sha'awa ba. Mafi qarfi ga Alqur'ani a koda yaushe shi ne tauhidi, da sauye-sauyen dabi'un mutane, da harshe da kiyayewarsa da ba su misaltuwa.",
    ],
    quran: [
      {
        excerpt: "Sai ku zo da sura kwatankwacinsa... idan kun kasance masu gaskiya.",
      },
    ],
    disclaimer:
      "Guji da'awar mu'ujiza ta kimiyya da aka wuce gona da iri wacce ke kunyatar da dawah idan aka bincika. Jagoranci da tauhidi da kyawawan halaye da hujjojin Kur'ani na harshe da tarihi.",
  },
  {
    title: "haddace (Hifz)",
    summary: "Tsare-tsare daga Juz Amma zuwa cikakken hifz - bita, sauti, burin yau da kullun.",
    body: [
      "Haddar Alkur'ani (hifz) yana daya daga cikin mafi daukakar ayyuka a rayuwar mumini, kuma ba a kebance shi ga malamai ko yara ba - manya suma suna kammala shi. Manzon Allah ﷺ ya koyar da cewa a ranar qiyama za a ce wa wanda ya xauki Alqur’ani, ‘Karanta ka hau,’ yana tashi da daraja da kowace aya. Fara daga inda kowa ya fara: Suratul Fatiha, wacce ka riga ka karanta a kowace sallah, sannan gajerun surori a karshen mus'haf, kana aiki a baya.",
      "Babban darasi mafi mahimmanci a cikin hifz shine rashin fahimta: bita (muraja'ah) al'amura fiye da ƙara sabon abu. Manzon Allah SAW ya yi gargadin cewa Alkur’ani da aka haddace yana saurin zamewa fiye da yadda rakumi daure ya fasa – a bar shi ba a bita ba, ya tafi. Don haka ƙa'idar mai sauƙi ce kuma mai tsauri: kar a ƙara sabon yanki har sai kun tabbatar da abin da kuka riga kuka riƙe. Dan haddace da karfi yakan haddace da yawa.",
      "Hanyar da ta dace: yi amfani da tazarar maimaitawa, manne wa mai karantawa guda ɗaya don haka waƙar da kanta ta ba da alamar ƙwaƙwalwar ajiyar ku, karanta daga ƙwaƙwalwar ajiya a kowace rana maimakon karantawa kawai, kuma malami ya saurara kuma ya yi alama kurakurai - kurakurai ba za ku iya jin kanku ba. Munib's hifz tracker records yana ci gaba har zuwa aya guda ɗaya don haka koyaushe ku san abin da ya kamata don bita.",
      "Zaɓi tsarin da ya dace da matakin ku. Mafari: haddace Juz Amma kashi na karshe mai cike da gajerun surori. Matsakaici: ƙara surori goma da ake yawan karantawa kamar al-Mulk, Ya-Sin, da al-Kahf. Na ci gaba: kammala cikakken juz tare da ingantaccen bita ga duk abin da ke gabansa. Da tafiyar Hafiz: dukkan mus'haf, wanda ya haddace tare da ƙwararren malami kuma, a zahiri, sanadi - tabbataccen silsilar isar da sako zuwa ga Annabi ﷺ.",
    ],
    hadith: [
      {
        excerpt:
          "Sai a ce wa ma'abocin Alkur'ani: Ka yi karatu ka hau kamar yadda ka saba karantawa a duniya, don darajarka tana a ayar karshe da ka karanta.",
      },
      {
        excerpt:
          "Misalin ma’abocin Alkur’ani shi ne na ma’abucin rakumi: idan ya kula da shi sai ya ajiye shi, idan kuma ya bari ya tafi ya rasa.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Darussan yau da kullun",
    summary: "Aya ɗaya, mahallin, tunani, da aiki - kowace rana.",
    body: [
      "An gina maƙasudin rayuwa da Kur'ani kamar yadda kowane ɗabi'a mai zurfi ke ginawa - kadan, kowace rana, ba tare da kasala ba. Annabi SAW ya koyar da cewa ayyukan da suka fi soyuwa a wurin Allah su ne wadanda ake yi akai-akai, koda kuwa karami ne, kuma wannan ka'ida ita ce dukkan ra'ayin da ke cikin darasi na yau da kullun. Kowannensu yana ba ku aya guda a cikin harshen Larabci, fassararsa, bayanin kula akan mahallinta na tarihi, tambayar tunani da za ku zauna da ita, da takamaiman aiki guda ɗaya da za ku ɗauka cikin kwanakinku.",
      "Ka ɗauki waɗannan ayoyin a matsayin jagora mai rai, ba karantawa ba. Yi alamar waɗanda suka ratsa zuciyarka, koma gare su, kuma ka raba abin da ya motsa ka da iyalinka - lokacin da wani ya yi abin da ya dace da kai, ladansa ma ya kai gare ka, don haka koyarwa yana ƙara riba.",
      "Kada ƙarami ya yaudare ku. Daidaituwa yana jujjuya ƙarfi kowane lokaci: mintuna biyar na gaskiya tare da Kur'ani kowace rana za su canza muku fiye da sa'a na jarumtaka sau ɗaya a wata. Nuna kullun, kuma bari kwanakin su taru.",
    ],
    appLinks: [{}],
  },
  {
    title: "Waiwaye (Tadabbur)",
    summary: "Tambayoyi masu shiryarwa - menene Allah yake koyarwa, kuma ta yaya za ku rayu?",
    body: [
      "Tadabbur yana nufin zurfafa tunani akan Alqur'ani, juya aya a cikin zuciya har sai ya motsa ka ka canza. Umurni ne kai tsaye, ba ƙari ba: Allah yana tambaya, 'Shin, ba su yin tunani a kan Alƙur'ani, ko kuwa akwai makullai a cikin zukatansu? Makasudin karantawa ba sauti ba ne kawai - don a kai ga zuciya da sake fasalin rayuwa.",
      "Tadabbur ba irin tafsiri ba. Tafsiri shi ne bayanin malamai kan abin da aya ke nufi; tadabbur ita ce kebantacciyar amsawa ga wannan ma'anar da zarar kun fahimce ta. Biyu suna aiki tare: da farko kuna koyon ma'anar sauti daga tafsiri, sannan ku zauna tare da shi kuma ku tambayi yadda yake magana da ku. Tambayoyi uku masu taimako - Menene Allah ke koya mani a nan? Ta yaya wannan zai canza abin da nake yi a yau? Wace dabi'a ce zan gina ko karya saboda ita?",
      "Iyaka mai ƙarfi guda ɗaya tana kiyaye tadabbur lafiya: yi tunani a kan abin da aya ke nema a gare ku, amma kada ku ƙirƙiri sabbin ma'anoni ga nassin da kansa. Bari ingantacciyar tafsiri ya saita iyakokin tawili, kuma ku ajiye tunaninku a matsayinsu - jarida mai zaman kanta, kamar ta Munib, ta dace don ɗaukar abin da aya ta zuga ku da komawa zuwa gare ta daga baya.",
    ],
    quran: [
      {
        excerpt:
          "Shin, ba su yin tunãni a cikin Alƙur'ãni, kõ kuwa a kan zukãtansu akwai ƙullallu?",
      },
      {
        excerpt:
          "Shin, ba su tunãni a kan Alƙur'ãni? Kuma dã yã kasance daga wanin Allah, dã sun sami sãɓã wa jũna a cikinsa.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Aiwatar da Alkur'ani",
    summary: "Kalubalen yau daga aya — kammala waƙa, rayuwa da ayah.",
    body: [
      "Ilimin Alkur'ani yana nufin ya zama aiki. Kuma Allah Ya sõki waɗanda suke karanta Littãfi daga gabãninmu, kuma suka rayu a kansa: \"Shin, kunã umurnin mutãne da ãdalci, kuma ku manta da kanku, alhãli kuwa kuna karatun Littãfi?\" Alkur'ani alkawari ne a tsakanin ku da Ubangijinku, kuma kowace aya tana tambayar ku wani abu a natse - tambayar ita ce ko kun amsa?",
      "Wannan shine abin da waɗannan ƙalubale suke yi. Kowannensu yana danganta wata aya ta musamman da xabi’a guda xaya, mai iya yiwuwa a yau: kiyaye harshenka da magana mai kyau, bayar da sadaka mai natsuwa, runtse idonka daga abin da aka haramta, barin baqin ciki da ka xauka. Aya ɗaya, mataki ɗaya - ƙarami isa a zahiri yi, ainihin isa ya canza ku.",
      "Yi alamar ƙalubalen ya cika kawai lokacin da kuka yi da gaske. Ba a nuna ma'anar bin diddigin - wanda zai karya manufar - amma gaskiya ga Allah, wanda yake ganin abin da wasu ba sa so. Da shigewar lokaci, aya da aya, haka ne karatun yake juyawa ya zama hali.",
    ],
    quran: [
      {
        excerpt:
          "Shin, kunã umurni da ãdalci, kuma ku manta da kanku, alhãli kuwa kuna karatun Littãfi?",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Tambayar Alqur'ani",
    summary: "Yi bitar sunayen surah, tsari, tajweed, ƙamus, da labaru.",
    body: [
      "Gwajin kanku ɗaya ne daga cikin ingantattun hanyoyin da za a sa ilimi ya tsaya - tuno amsa yana ƙarfafa ƙwaƙwalwa fiye da sake karantawa kawai. Wannan kacici-kacici ya yi nuni da duk wani abu da ke cikin cibiyar: adadin surori da juz’i, wahayi na farko da yadda aka kiyaye Alkur’ani, da tajwidi kamar madd da qalqalah, da ma’anar kalmomi masu yawa, da annabawa da Alkur’ani ya ba da labarinsu.",
      "A kiyaye niyya daidai. Maki madubi ne kawai don koyo - ba zai zama ma'auni na darajarka ba a wurin Allah, wanda yake na Shi kaɗai. Yi amfani da kowace tambaya don fallasa wuri mai rauni, sannan komawa zuwa darasin da ya dace kuma kuyi nazarin ainihin batun maimakon neman lamba.",
      "Tambayar ƙarshe ita ce tunani, ba tambaya mai daraja ba: zaɓi sura ɗaya ko nassi don fahimta da haddace na gaba, don haka nazarinku koyaushe yana ƙarewa ta hanyar mayar da ku ga Littafin da kansa.",
    ],
    appLinks: [{}],
  },
  {
    title: "Nassoshi & tushe",
    summary: "Yadda muke kawo Alqur'ani da hadisi da tafsiri da bambance-bambancen ilimi.",
    body: [
      "Ilimin Musulunci ingantattu an gina shi ne bisa hujjoji bayyanannu, don haka kowane darasi a wannan cibiya yana da burin nuna aikinsa. Da'awar game da Kur'ani tana da goyan bayan wani tunani a cikin sura: aya; da'awar Sunnah ta sanya sunan tarin (Bukhari, Musulmi, Tirmizi, da sauransu), lambar hadisi, da darajojinsa (sahih, ko hasan, ko mafi rauni); da'awar ma'anar aya ta sanya sunan tafsirin da ta zo daga gare ta; kuma inda malamai suka bambanta, ana lura da bambancin maimakon a ɓoye.",
      "Hakanan yana da mahimmanci a rarrabe abin da ke tabbata daga abin da yake fassara. tabbatattun bayanai - salloli biyar na rana, kiyaye Alqur'ani, manyan al'amuran seerah - an bayyana su karara. Abubuwan da malamai na gaskiya suka daɗe sun bambanta, kamar cikakkun bayanai na ƙayyadaddun ƙayyadaddun ƙayyadaddun ƙayyadaddun ƙayyadaddun ƙayyadaddun bayanai ko kuma karatun ƙamus na kimiyya, an gabatar da su a matsayin fassarar, ba kamar yadda tabbatattu ba. Amincewa yakamata yayi daidai da ƙarfin shaidar.",
      "Don zurfafa nazari, dogara ga kafaffun nassoshi: ingantattun fassarorin Kur'ani (kamar Sahih International ko Pickthall), tarin hadisai na farko (Sahih al-Bukhari da Sahih Musulmi gaba), tafsirin girmamawa (Ibn Kathir da as-Sa'di), da amintaccen seerah ( Ibn Hisham classic, and ar-Raheeq al-Makhtm na zamani).",
      "A ƙarshe, san iyakar app. Munib yana karantar da ku kuma yana nuna muku madogara, amma ba ya fitar da hukunce-hukuncen addini. Domin neman karatun fiqhu, ko tajweed ijazah, ko kuma duk wata tambaya da ta shafi ibada ko hukuncin rayuwa, sai ka tuntubi kwararen malami a makarantarku da unguwarku.",
    ],
    sources: [
      "Kur'ani - King Fahd Complex print / ingantattun mushaf na dijital",
      "Hadith — sunnah.com grading cross-reference",
      "Tafsir Ibn Kathir (Darussalam)",
      "Tafsir as-Sa'di (Hausa)",
    ],
    disclaimer:
      "Munib ya tattara abubuwan ilimantarwa. Tabbatar da al'amura masu mahimmanci tare da ƙwararrun malamai a cikin madhhab ɗin ku da yankinku.",
  },
];

export const QURAN_GUIDE_STRUCTURE_LEVELS_HA: DeepPartial<QuranGuideStructureLevel>[] = [
  {
    count: "1 Littafi",
    detail:
      "Littafi guda - Kalam Allah, Maganar Allah ta zahiri, wanda aka saukar wa Muhammad ﷺ ta hannun Mala'ika Jibreelu, a cikin larabci bayyananne, a hankali a hankali sama da shekaru 23. Rubutu guda ɗaya ne a ko'ina cikin duniya.",
  },
  {
    count: "114",
    detail:
      "Kur’ani ya kasu zuwa surori 114, daga ayoyi uku kacal zuwa 286. Kowannensu yana da suna, yawanci ana ciro shi daga wata mahimmin kalma a cikinsa, kuma an lasafta shi da Makki ko Madani. Umarninsu a cikin mus’hafi ya kasance da wahayi (tawqfi) kuma ya bambanta da tsarin wahayi.",
  },
  {
    count: "30",
    detail:
      "Kimanin sassa 30 daidai gwargwado, an ƙera su don sarrafa karatu. Karatun juz'i daya a rana yana kammala dukkan Al-Qur'ani a cikin wata guda - hanyar da ta fi dacewa ta gama khat a cikin Ramadan.",
  },
  {
    count: "60",
    detail:
      "Kowane juz'i ya kasu kashi biyu, yana ba da 60 gabaɗaya, kowane hijabi ya ƙara zuwa kwata. Waɗannan ƙananan raka'o'in suna ba ku damar saita sassa na yau da kullun - rabin ko kwata hizb - kuma ku ci gaba da kasancewa a koyaushe.",
  },
  {
    count: "6,236",
    detail:
      "ayoyi guda ɗaya, masu ƙididdige su don haka kowane nassi za a iya kawo su daidai sura: aya. 6,236 ita ce kidayar Madina; sauran hanyoyin kirga na tarihi sun bambanta kawai ta yadda aka yiwa 'yan ayoyi-iyaka alama - kalmomin su kansu iri ɗaya ne.",
  },
  {
    count: "2 zamani",
    detail:
      "Kowace surah tana cikin xaya ne daga cikin lokuta biyu na wahayi. surorin Makki (kafin Hijira) sau da yawa sun fi guntu kuma suna mai da hankali kan imani da tauhidi da Lahira. Madani (bayan Hijira) surori sun fi tsayi kuma suna ƙara shari'a da jagoranci na al'umma. ’Yan surori sun kunshi ayoyi guda biyu.",
  },
  {
    count: "Da yawa",
    detail:
      "Kur'ani an saka shi a kan jigogi masu maimaitawa maimakon shirya jigo da jigo. Tauhidi da addu'a da kissoshin annabawa da dangi da sadaka da hakuri da lahira suna gudana cikin littafin suna karfafa juna a cikin surori masu yawa.",
  },
];

export const QURAN_GUIDE_TIMELINE_HA: DeepPartial<QuranGuideTimelineEvent>[] = [
  {
    title: "Rayuwa kafin wahayi",
    body: "A cikin shekarun da suka gabata kafin annabci, Muhammad ﷺ zai koma kogon Hira na tsawon kwanaki na kadaitaka da tunani, abin bautar gumaka da rashin adalci na al'ummar Makka. Ko da yake duniyar da ke kewaye da shi tana bauta wa gumaka, bai taɓa yin hakan ba, kuma mutanensa sun amince da shi gaba ɗaya har suka kira shi al-Amin—amintaccen—da daɗewa kafin ya taɓa yin da’awar shi annabi ne.",
    location: "Makkah",
  },
  {
    title: "Kogon Hira",
    body: "A cikin watan Ramadan, yana da kimanin shekara arba'in, sai Mala'ika Jibrilu ya zo masa a cikin kogo da umarni guda: \"Karanta!\" Annabi SAW, wanda ba ya iya karatu ko rubutu, ya amsa cewa ba zai iya ba. Mala'ikan ya rungume shi sosai sau uku, sa'an nan ya isar da kalmomin farko na surar Alaq - 'Ka yi karatu da sunan Ubangijinka, wanda ya yi halitta.' Girgiza kai ya yi da sauri ya nufi gida wajen matarsa ​​Khadijah, ta nannade shi cikin alkyabba, ta kwantar masa da hankali.",
    location: "Jabal an-Nur, Makkah",
  },
  {
    title: "Wahayi na farko — Suratul Alaq",
    body: "Umurnin karantawa shine farkon annabci da saukar Kur'ani. Khadijah ta kai shi wurin dan uwanta mai ilimi Waraqah bn Nawfal, wanda ya gane mala'ika a matsayin manzon da ya zo wurin Musa kuma ya annabta cewa mutanen Annabi (SAW) za su kore shi. Farkon ayoyin Makkan da suka biyo baya sun fi mayar da hankali ne kan kadaita Allah, da yakinin Lahira, da kira ga gyara tarbiyya.",
  },
  {
    title: "Farkon lokacin Makkan",
    body: "Shekarun farko kiran na sirri ne, sannan na jama'a. Yayin da ake girma, Kuraishawa suka koma ga zalunci - azabtar da raunana da bayi a cikin muminai - kuma daga karshe suka sanya wa dangin Manzon Allah ﷺ, Banu Hashim, kauracewa kauracewa shekaru uku mai tsanani. Don guje wa zalunci, gungun Musulmai sun yi hijira zuwa Abyssiniya, inda wani sarki Kirista mai adalci ya ba su mafaka. surorin wannan zamani yawanci suna magana a takaice, masu ƙarfi, ayoyi masu ruɗi.",
    location: "Makkah",
  },
  {
    title: "Hijira zuwa Madina",
    body: "Bayan shekaru na zalunci, da kuma bin shekarar bakin ciki, a cikinta ya rasa Khadijah da baffansa Abu Talib, sai Manzon Allah SAW da sahabbansa suka yi hijira zuwa Madina. Wannan Hijira ta kasance mai muhimmancin gaske ta yadda daga baya ta zama farkon kalandar Musulunci. A Madina Musulmi ba ’yan tsiraru ne da ake farauta ba, al’umma ce ta kafa al’umma, kuma a yanzu wahayi ya fara magana kan shari’a, iyali, tattalin arziki, da alaka da Ahlul Kitabi.",
    location: "Madinah",
  },
  {
    title: "Zaman Madina",
    body: "surorin Madina gaba daya sun fi tsayi kuma sun fi filla-filla, suna shimfida dokokin da al’ummar da suke zaune a cikinta suke bukata: kebantattun Sallah, Zakka, Azumi, Aure da saki, Gado, Kwangiloli, da yarjejeniyoyin. Wannan lokaci kuma ya ga manyan yaqe-yaqe – Badar, Uhud, da ‘yan qungiya – kuma Kur’ani ya yi magana a kan fitintinu na muminai da makircin munafukai (munafiqun) da bayyanannu.",
    location: "Madinah",
  },
  {
    title: "Hajjin bankwana",
    body: "A shekara ta goma bayan Hijira Manzon Allah SAW ya yi aikin Hajjinsa daya tilo, sannan ya gabatar da hudubar bankwana gabanin wani gagarumin taro a Arafat, inda ya tunatar da al’umma kan tsarkin rai da dukiya, da hakkin mata, da daidaiton kowa da kowa ba tare da nuna bambancin launin fata ba, da wajibcin riko da Alkur’ani da Sunnah. A nan ne aka saukar da ayar: 'A yau na kammala muku addininku.'",
    location: "Arafat / Mina",
  },
  {
    title: "Tafsirin Abubakar",
    body: "Ba a dade da wafatin Manzon Allah Sallallahu Alaihi Wasallama ba, an kashe sahabbai da dama wadanda suka haddace Alkur’ani a yakin Yamama. Saboda tsoron rashin huffaz, Umar ya bukaci halifa Abubakar da ya sa a tattara Alkur’ani wuri guda. Abubakar ya nada amintaccen marubuci Zayd ibn Thabit, wanda ya tattara rubuce-rubucen wahayi a hankali - wanda aka tabbatar a kan tunanin sahabbai - cikin zanen gado guda (suhuf).",
  },
  {
    title: "Ma'auni mushaf - Uthman",
    body: "Yayin da Musulunci ya yadu a kasashe da dama, bambance-bambancen karatu a tsakanin sabbin Musulmi ya fara haifar da sabani. Domin hada kan al'ummah akan rubutu guda daya, halifa Usman yana da kwafi masu inganci daga suhuf Abubakar a yaren kuraishawa ya tura su manyan garuruwa, yana mai neman a ajiye wasu kwafin nasu. Wannan mushafi na Uthman shine ma'auni da duk duniyar musulmi ke bi tun daga lokacin.",
  },
  {
    title: "Ajiyewa har yau",
    body: "Karni goma sha hudu, Alkur'ani ya kasance bai canza ba, yana kiyaye shi ta hanyoyi guda uku masu hadewa: haddar taro (hifz) a cikin kowane tsararraki, watsawa da aminci a rubuce, da sarkar karatun karatu (qira'at) malami ga dalibi wanda ba a karye ba, yana kaiwa ga Annabi SAW. Wannan ya cika alkawarin Allah: \"Lalle ne Mũ, Mun saukar da Ambato, kuma lalle Mũ, Mãsu tsare shi.\"",
  },
];

export const QURAN_GUIDE_STORIES_HA: DeepPartial<QuranGuideStory>[] = [
  {
    prophetName: "Adamu",
    title: "Adamu - na farko annabi kuma uban bil'adama",
    summary: "Halittu, sujadar mala’iku, da jarrabawar bishiya, tuba ta karba.",
    body: [
      "Allah ya halicci Adamu, mutum na farko, da hannuwansa daga yumbu, ya hura masa ruhinsa, kuma ya ba shi wata baiwar da babu wani mahaluki da ya samu: Ya sanar da Adamu sunayen kowane abu. Lokacin da Allah ya bayyana wannan ilimin, mala'iku sun yarda da iyakokinsu kuma darajar Adamu ta bayyana - ilimin kansa yana cikin abin da ya keɓe ɗan adam.",
      "Sai Allah ya umurci malã'iku da su yi sujada ga Adama, kuma dukansu suka yi ɗã'a - fãce Iblis, wanda yake a cikin aljannu. Ya ki saboda girman kai, yana mai cewa an yi shi da wuta, Adamu kuwa na yumbu ne, don haka ya dauki kansa ya fi shi. Wannan girman kai, ba jahilci ba, shi ne faɗuwar sa, kuma ya sha alwashin batar da zuriyar Adamu.",
      "An sanya Adamu da matarsa ​​Hawwa a cikin Lambun kuma aka gaya musu cewa za su iya jin daɗin komai da yardar rai amma kada su kusanci bishiya ɗaya. Shaidan ya yi ta waswasi da su, har suka ci daga gare ta. Nan take tsiraicinsu ya bayyana a gare su, suka ji kuskurensu. Amma maimakon su yanke kauna ko kuma ba da uzuri, sai suka koma ga Allah suna masu kaskantar da kai: 'Ya Ubangijinmu!",
      'Allah ya karbi tubarsu, kuma ya saukar da su zuwa doron kasa-ba wai don azaba ta sabani ba, a\'a a matsayin farkon jarrabawar mutane, tare da alkawarin shiriya: "Duk wanda ya bi shiriyata ba zai bace ba, kuma ba zai fada cikin wahala ba." Ta haka ne labarin Adamu ya zama labarin kowane ɗan adam: an halicce shi da daraja, jarrabawa, mai yin kuskure, mai ikon komawa koyaushe.',
    ],
    lessons: [
      "Ƙofar tuba a buɗe take koyaushe - Tawbah Adamu, wanda aka miƙa ba tare da uzuri ko jinkiri ba, shine abin koyi ga kowane mai zunubi.",
      "Girman kai shine tushen lalacewa: Iblis ya san gaskiya duk da haka ya ƙi ta saboda girman kai, yana nuna cewa ilimi ba tare da tawali'u yana halakarwa ba.",
      "Hanyar Shaidan ita ce raɗaɗi mai tsayi, ba tilastawa ba - fahimtar shawarwarinsa rabin tsayin daka ne.",
      "Kimar ɗan adam tana da alaƙa da ilimi da komawa ga Allah, ba don zama marasa zunubi ba - amsa ga kuskure ne ke bayyana mu.",
    ],
    quran: [
      {
        excerpt: "Halittar Adamu da Sujadar Mala'iku.",
      },
      {
        excerpt: "Jarabawa, faduwa, da tuba.",
      },
    ],
    location: "Jannah, sai kasa",
  },
  {
    prophetName: "Nuhu",
    title: "Nuhu - haƙuri ta ƙarni na kin amincewa",
    summary: "Shekaru 950 na da'awa, Jirgin ruwa, da tufana a matsayin hukuncin Allah.",
    body: [
      "An aika Nuhu zuwa ga wasu mutanen da suka yi shirka, sai ya kira su zuwa ga bauta wa Allah Shi kadai na tsawon lokaci mai ban mamaki - Alkur'ani ya ce ya zauna a cikinsu shekara dubu kasa da hamsin. Ya kira su dare da rana, a bayyane da boye, yana ba su kowane dalili: gafara, ruwan sama, dukiya, 'ya'ya, da gonaki. Duk da haka tsara bayan tsara suka juya baya, suka yi masa ba'a, suka toshe kunnuwansu.",
      "Lokacin da ya bayyana cewa ba zai ƙara yin imani ba, sai Allah ya umarci Nuhu ya gina jirgin, mutanensa suka yi masa ba'a yayin da ya kera wani babban jirgi nesa da kowane teku, amma ya amsa da cewa wata rana tana zuwa da za su gane. Alamar ta zo lokacin da tanda ta fito da ruwa; Nuhu ya ɗauki muminai kaɗan kawai, da nau'i-nau'i na kowane irin dabba.",
      "Ruwan ya tashi ya nutsar da waɗanda suka ƙi. A wani lokaci da ya fi huda labarin, ɗan Nuhu ya ƙi shiga, yana mai dagewa zai hau dutse don tserewa ruwan, kuma yana cikin waɗanda suka nutse - baƙin cikin uba ba zai iya kawar da rashin imani da ɗansa ba. Yayin da Nuhu ya roke shi, sai Allah ya koyar da cewa zaluncin yaron ya yanke alakar imani a tsakaninsu.",
      "Sa’ad da umurnin ya zo, ruwa ya ja da baya, kuma akwatin ya tsaya a kan Dutsen Judi. Alkur'ani ya adana dukkan lissafin a matsayin 'alama' ga duk wanda ya yi tunani a kan yadda Allah yake kubutar da muminai da kuma yadda aka barranta da hakuri a karshe.",
    ],
    lessons: [
      "Dogon aiki mai wuyar gaske tare da 'yan kaɗan ba gazawa ba ne - Nuhu ya yi wa'azi shekaru aru-aru, kuma gaskiyarsa, ba adadinsa ba, shine abin da ya faranta wa Allah rai.",
      "Babu wani haɗin kai na iyali da zai ceci mutum marar bangaskiya: Ɗan Nuhu ya nutse, ya tabbatar da cewa ba a gadon shiriya.",
      "Dagewa da yin kira zuwa ga Allah, ko da a kan izgili da kullum, shi kansa ibada ce.",
      "Ceton Allah yana zuwa a lokacin ƙayyadaddun lokaci - mai bi yana gina 'jirgin' biyayya kafin rigyawa, yana dogara ga alkawari.",
    ],
    quran: [
      {
        excerpt: "Labarin Nuhu daki-daki.",
      },
      {
        excerpt: "Roƙon Nuhu ga mutanensa.",
      },
    ],
    location: "Mesopotamiya na dā (ƙididdigar masana)",
  },
  {
    prophetName: "Ibrahim",
    title: "Ibrahim - Abokin Allah (Khalilullah)",
    summary: "Karye gumaka, wuta ta yi sanyi, sadaukarwa Ismail, gina Ka'aba.",
    body: [
      "Ko da yake matashi, Ibrahim ya yi tunani a kan hanyarsa ta zuwa tauhidi, yana ƙin gumaka da mutanensa da mahaifinsa suka sassaƙa da bauta. Ya yi musu gardama, sa’an nan ya yi aiki da cewa: Yayin da suke wurin wani biki, sai ya karya dukkan gumakansu amma mafi girma, kuma da suka nemi bayani sai ya ce su tambayi babban gunki da kansa – yana nuna rashin taimakon abin da suke bautawa. A fusace suka gina wata babbar wuta suka jefa shi a cikinta, sai Allah ya yi umarni da cewa: “Ya wuta ki kasance sanyi da aminci ga Ibrahim, sai ya fita ba tare da wani rauni ba.",
      "Da izinin Allah Ibrahim ya bar matarsa ​​Hajar da jaririnsu Isma'il a kwarin Makkah bakarare. A lokacin da ruwansu ya kare, sai Hajar ta ruga a guje tsakanin tsaunukan Safa da Marwah suna neman taimako - wani bincike da musulmi suka sake yi a cikin sa'in Hajji - har ruwan zamzam ya fado a kafafun jaririn. Bayan shekaru da yawa, Ibrahim ya ga a mafarki cewa zai sadaukar da ɗansa ƙaunataccensa. Uba da ɗã, dukansu sun sallama ga iznin Allah; kuma a daidai lokacin da Ibrahim yake shirin aiwatar da shi, sai Allah ya fanshi Isma’il da rago mai karimci, ana tunawa da shi duk shekara a Idin Adxa.",
      "Tare, Ibrahim da Isma'il babba suka ɗaga harsashin ginin Ka'aba a Makkah, suna addu'a yayin da suke ginawa: \"Ya Ubangijinmu, ka karɓi wannan daga gare mu.\" Ibrahim ya kuma yi addu’a don a fito da wani manzo daga zuriyarsu - addu’ar da aka amsa bayan shekaru aru-aru a cikin Annabi Muhammad SAW. Saboda sadaukarwar da ya yi, Allah ya karrama Ibrahim da suna na musamman: Khalilullah, aminin Allah na kusa.",
    ],
    lessons: [
      "Tauhidi yana bukatar warware maƙasudin ƙarya, ko da kuwa bautar gumaka ta zama sananne, al'adar gado da tsayawa gaba da shi yana da haɗari.",
      "Cikakkiyar dogaro ga Allah tana haskakawa a lokacin da umurninSa ya kasance mafi tsanani - Ibrahim ya sallama ko da ya sadaukar da dansa, kuma Allah ya musanya fitina da rahama.",
      "Tawakkali ga Allah ba ya nufin wucewa: Hajar ta gudu ta yi bincike, sai Zamzam ta zo - kokari da tawakkul suna aiki tare.",
      "Ayyukan ibada na gaskiya suna kara bayyana a cikin tsararraki; ayyukan Hajji da darajar Ka'aba sun samo asali ne daga biyayyar Ibrahim.",
    ],
    quran: [
      {
        excerpt: "Ibrahim, Ismail, da sadaukarwa.",
      },
      {
        excerpt: "Alkawari da gado.",
      },
    ],
    location: "Iraq, Levant, Makkah",
  },
  {
    prophetName: "Yusuf",
    title: "Yusuf - beauty of patient (sabr jameel)",
    summary: "Cin amana, bauta, kurkuku, hawan mulki - dogara ta kowace gwaji.",
    body: [
      "Sa’ad da yake yaro, Yusuf ya ga mafarkin taurari goma sha ɗaya, da rana, da wata suna sujada gare shi—alama ce ta makoma mai girma. Mahaifinsa Yakub, shi kansa Annabi, ya ce masa ya boye wa ‘yan’uwansa masu kishi. Hassada ta rinjaye su, suka jefa Yusuf a gindin rijiya, suka ce wa mahaifinsu kerkeci ya cinye shi. Wani ayari da ke wucewa ya sami yaron ya sayar da shi a Masar.",
      "A gidan mai martaba ya girma ya zama mutum mai kyan gani da mutunci. A lokacin da matar mai martaba ta yi yunkurin lallasa shi, Yusuf ya ki, ya ce, ‘Ina neman tsarin Allah,’ sai ta zabi kurkuku a kan zunubi a lokacin da ta yi masa barazana. Ko da yake ba shi da laifi, an daure shi na tsawon shekaru. A nan ya kira 'yan uwansa fursunoni zuwa tauhidi ya fassara mafarkansu da izinin Allah.",
      "Sa’ad da sarki ya damu da mafarkin shanu bakwai masu ƙiba, waɗanda ramagu bakwai suka cinye, Yusufu ya fassara ta a matsayin shekara bakwai na ƙoshi sai yunwa bakwai, ya kuma ba da shawarar a adana hatsi. Da aka gane shi a ƙarshe saboda hikimarsa da amincinsa, aka naɗa shi mai kula da taskar Masar.",
      "A ƙarshe yunwa ta kori ’yan’uwansa Masar don neman abinci, ba tare da sanin wazirin da ke gabansu ba. Bayan ya gwada su, Yusufu ya bayyana kansa kuma - maimakon fansa - ya gafarta musu gaba daya: 'Babu laifi a kanku a yau. Allah Ya gafarta muku.' An sake haduwa da iyali, an girmama iyayensa, kuma mafarkin yarinta ya cika.",
    ],
    lessons: [
      "Sabr jameel - kyakkyawan haƙuri - yana nufin jurewa wahala ba tare da haushi ko kuka ga mutane ba, ɗaukar baƙin cikin ku zuwa ga Allah kawai kamar yadda Yakubu ya yi.",
      "Tsarkakakkiya tana da daraja: Yusufu ya zaɓi kurkuku a kan zunubi, kuma Allah ya ɗaukaka darajarsa saboda haka.",
      "Shirin Allah sau da yawa yana ɓoye bayan shekaru na bala'i na bayyananne - rijiyar, bauta, da kurkuku duk matakai ne zuwa ga darajar Yusufu.",
      "Ƙarfafa suna nuna ƙarfinsu ta hanyar gafara: a lokacin ƙarfin ikonsa, Yusufu ya gafarta wa waɗanda suka zalunce shi.",
    ],
    quran: [
      {
        excerpt: "Mafi kyawun labarun - an fada a cikin sura ɗaya.",
      },
    ],
    location: "Kan'ana, Misira",
  },
  {
    prophetName: "Musa",
    title: "Musa - ya yi magana da Allah kuma ya fuskanci Fir'auna",
    summary: "Kushi mai ƙonewa, alamu ga Fir'auna, Fitowa, Attaura, da al'umma mai yawo.",
    body: [
      "Musa ya girma cikin tsarin Allah a cikin gidan Fir'auna bayan mahaifiyarsa ta ajiye shi a cikin kogin don ceto shi daga kisan gillar da Fir'auna ya yi wa 'ya'yan Isra'ila. Sa’ad da yake matashi ya gudu daga ƙasar Masar bayan an kashe shi, kuma bayan shekaru da yawa, ya dawo ta cikin jeji, ya ga wuta a Dutsen Tur. A nan ne Allah ya yi magana da shi kai tsaye - wata daraja da ta ba Musa lakabi Kalimullah, wanda ya yi magana da Allah - yana cewa, 'Lalle ne ni ne Ubangijinku.' An aika shi, tare da ɗan'uwansa Haruna a matsayin goyon baya, a mayar da shi zuwa ga azzalumi Fir'auna tare da cewa: a saki Bani Isra'ila.",
      "Fir'auna ya yi iƙirari shi ne abin bauta kuma ya ƙi. Allah ya bai wa Musa ayoyi mabayyani, sandarsa ta zama maciji mai rai, hannunsa yana walƙiya da fari. Sai Fir’auna ya kirawo manyan masu sihirinsa don su bata masa suna, amma a lokacin da sandan Musa suka shanye ruɗinsu, masu sihiri suka gane gaskiya daga yaudara kawai suka faɗi cikin sujada, suna bayyana imani da Ubangijin Musa da Haruna – kamar yadda Fir’auna ya yi musu barazanar kisa. Annoba ta biyo baya, duk da haka Fir'auna ya taurare.",
      "Daga karshe Allah ya umurci Musa ya jagoranci mutanensa da dare. Fir'auna ya bi su har zuwa teku; Musa ya buge ta da sandarsa, ruwan ya rabu, ya bar muminai su ketare a kan busasshiyar kasa. Da Fir'auna da rundunarsa suka bi su, sai teku ta rufe su, suka nutse. Sai Musa ya karɓi Attaura, amma Bani Isra'ila ya kasance masu taurin kai - suna bauta wa ɗan maraƙi na zinariya a cikin rashi kuma sun ƙi shiga ƙasar alkawari - kuma suka yi ta yawo har tsawon shekaru arba'in a sakamakon haka.",
    ],
    lessons: [
      "Faɗi gaskiya ga zalunci yayin da yake dogara ga Allah gabaɗaya - Musa ya fuskanci mafi ƙarfin zamaninsa da makamai kawai da imani.",
      "Hatta masu bi na gaskiya na iya tanƙwara: masu sihirin da suka yi gāba da Musa sun kasance, a cikin tsayayyen lokaci guda, sun fi sauran al'umma da suka ga mu'ujizai dagewa.",
      "Shaida abubuwan al'ajabi da kansa ba ya haifar da bangaskiya - shiriya baiwa ce da Allah ke bayarwa ga masu tawali'u, ba mai taurin kai ba.",
      "Kuma Allah ne Yake tsĩrar da waɗanda aka zalunta, kuma Ya kãmã mãsu girman kai, gwargwadon ƙarfinsu.",
    ],
    quran: [
      {
        excerpt: "Musa a Tur da gaban Fir'auna.",
      },
      {
        excerpt: "Haihuwa da tarbiyya.",
      },
    ],
    location: "Misira, Sinai",
  },
  {
    prophetName: "Isa",
    title: "Isa bn Maryam - kalma da ruhi daga Allah",
    summary:
      "Haihuwa ta mu'ujiza, alamu, tashe ta zuwa ga Allah - ba a kashe shi ba kuma ba a gicciye shi ba kowane Kur'ani.",
    body: [
      "Maryam mace ce mai tsafta da ibada da Allah ya kebance mata a zamaninta, ta fice daga danginta zuwa wani wuri a gabas. Can sai Mala'ika Jibrilu ya bayyana gare ta a surar mutum, ya yi bushara da cewa Allah zai ba ta da da tsarkakke, alhali kuwa babu wani mutum da ya taba ta. Ta yi cikinta da kalmar Allah 'Kas', kuma an halicci Isa - Kur'ani ya kwatanta halittarsa ​​da ta Adamu, wanda ba shi da uba, yana nuna cewa Allah yana halitta duk yadda Ya so.",
      "Lokacin da ta dawo dauke da jaririn, mutanenta sun zarge ta. A cikin kariyarta, jaririn Isa ya yi magana a cikin jariri, yana bayyana kansa a matsayin bawan Allah da aka ba da littafi kuma ya mai da shi annabi - yana share darajar mahaifiyarsa da mu'ujiza. A matsayin Annabi Isa ga Bani Isra’ila, an bai wa Isa ayoyi bayyanannu da iznin Allah: ya warkar da makaho da kutare, ya rayar da matattu, ya kuma yi wani tsuntsu daga yumbu mai tashi – kullum yana jaddada cewa wadannan ‘da izinin Allah ne,’ ba da ikonsa ba.",
      "Kur'ani a sarari yake cewa ba a kashe Isa ba, ba a gicciye shi ba; A'a, an bayyana shi ga maƙiyansa, kuma Allah Ya ɗaukaka shi zuwa gare Shi. Aqidar Ahlus-Sunnah ta gama gari sun tafi akan cewa zai dawo gabanin ranar lahira. Mahimmanci, Kur'ani ya nace cewa Isa annabi ne ɗan adam kuma bawan Allah, ba allahntaka ba kuma ba ɗan Allah ba - saƙon da kansa ya yi shelar tun daga jariri har zuwa ƙarshe.",
    ],
    lessons: [
      "Allah Yana halitta yadda Yake so — Haihuwar Isa ba tare da uba ba, kamar yadda Adamu ya yi daga turɓaya, yana nuna ikonsa ba ya daure ba don wani abin duniya ba.",
      "Duk wata mu'ujiza da Isa ya yi a bayyane take 'da izinin Allah,' yana koya wa annabawa ikon Allah, ba su mallake ta.",
      "Annabawa bayin Allah ne masu daraja, waɗanda ba za a taɓa bauta musu ba - Kur'ani ya kiyaye ainihin matsayin Isa daga wuce gona da iri.",
      "Tsaftar Maryama da hakuri da rikon amana sun sanya ta zama abin koyi ga dukkan muminai, mata da maza.",
    ],
    quran: [
      {
        excerpt: "Maganar haihuwa da jariri.",
      },
      {
        excerpt: "Ba a kashe shi ba kuma ba a gicciye ba; tashe",
      },
    ],
    location: "Falasdinu",
  },
  {
    prophetName: "Muhammad ﷺ",
    title: "Muhammad ﷺ - Hatimin Annabawa",
    summary: "Manzo na ƙarshe; Alkur'ani ya sauka a cikin shekaru 23; rahama ga talikai.",
    body: [
      "An haifi Muhammad ﷺ a garin Makkah a shekara ta 570 miladiyya a cikin kabilar Kuraishawa. Marayu - mahaifinsa ya rasu kafin haihuwarsa, mahaifiyarsa kuma yana da shekaru shida - kakansa ya fara rene shi, sannan baffansa Abu Talib. Tun kafin ya zama annabci an aminta da shi don gaskiyarsa har mutanensa suka kira shi al-Amin, 'amintaccen'. Yana da shekaru arba'in a lokacin da yake tunani a cikin Kogon Hira, ya sami saukar Alkur'ani na farko ta hannun Mala'ika Jibrilu.",
      "Tsawon shekaru goma sha uku a Makkah yana kiran mutane zuwa ga bauta wa Allah Shi kadai, ya fuskanci tsangwama mai tsanani: izgili, azabtar da marasa karfi daga cikin mabiyansa, da gurgunta zamantakewa da tattalin arziki na danginsa. A cikin shekara guda na bakin ciki ya rasa matarsa ​​Khadijah da majibincinsa Abu Talib, kuma a lokacin da ya nemi taimako a Ta'if da ke kusa da shi sai aka kore shi aka jefe shi da duwatsu - duk da haka ya yi addu'ar neman shiriyarsu maimakon halakar da su.",
      "Bayan ya yi hijira zuwa Madina ya gina wata al’umma, ya jagorance ta cikin fitintinu na Badar, da Uhudu, da ‘yan qungiya. A karshe da ya dawo ya ci Makkah da karfinsa, bai dauki fansa a kan wadanda suka azabtar da shi suka kore shi ba; Ya gafarta musu, ya ce, 'Ku tafi, gama kuna da 'yanci.' Kur'ani ya takaita aikinsa a cikin jumla guda - 'Rahama ga talikai' - kuma ya bayyana a fili aikinsa shi ne isar da sako a sarari, ba tilasta wa wani ya gaskata ba.",
    ],
    lessons: [
      "Mafi kyawun halayen da mutum zai iya samu shi ne halayen Manzon Allah ﷺ - yin karatun seerah sosai da ƙoƙarin shigar da ita a rayuwar yau da kullun.",
      "Jinƙai da gafara ƙarfi ne, ba rauni ba ne: a ƙarshen ikonsa ya gafarta wa manyan abokan gabansa.",
      "Mai kira zuwa ga Allah yanã iyar da manzanci da ikhlasi da haƙuri kuma yana barin ãƙiba ga Allah, shiriya a gare Shi take.",
      "Fitintinu tafarkin annabawa ne; jurewa wahala saboda Allah, kamar yadda ya yi, shi ne alamar imani na gaskiya.",
    ],
    quran: [
      {
        excerpt: "Ba Mu aike ka ba face domin rahama ga talikai.",
      },
      {
        excerpt: "Masu jin ƙai a tsakãninsu, mãsu ƙarfi a kan kãfirai.",
      },
    ],
    appLinks: [{}],
  },
];

export const QURAN_GUIDE_THEMES_HA: DeepPartial<QuranGuideTheme>[] = [
  {
    title: "Imani (Iman)",
    summary:
      "Imani da Allah, da Mala'ikunSa, da LittattafanSa, da ManzanninSa, da Ranar Lahira, da kaddarar Ubangiji.",
    lessons: [
      "Imani ya ta'allaka ne akan abubuwa guda shida da Alkur'ani ya tattara a wuri guda: Imani da Allah, da Mala'ikunSa, da LittattafanSa da aka saukar, da ManzanninSa, da Ranar Lahira, da kaddarar Ubangiji - alherinsa da marar kyau.",
      "Iman ba kayyadewa ba ce, tabbatarwa daya. A cikin aqidun Ahlus-Sunnah na yau da kullun yana ƙaruwa da biyayya da zikiri kuma yana raguwa da zunubi da gafala, don haka imani wani abu ne da kuke girma.",
      "Annabi SAW ya koyar da cewa imani yana da rassa sama da saba'in, tun daga manya-manya - shaidawa babu abin bautawa da gaskiya sai Allah - har zuwa kawar da cutarwa daga hanya, yana nuna cewa ko da kananan ayyuka na kwarai na daga cikin imani.",
      "Imani na gaskiya al'amari ne na zuciya a gaban harshe: sanin Allah da gaske, da sonsa fiye da kowa, da tsoron bacin ransa, da tawakkali gareshi.",
    ],
    quran: [
      {
        excerpt:
          "Manzo ya yi imani da abin da aka saukar zuwa gare shi daga Ubangijinsa, haka kuma muminai…",
      },
    ],
    hadith: [
      {
        excerpt:
          "Bangaskiya tana da rassa sama da saba'in; mafi daukaka shi ne cewa: \"Babu abin bautawa da gaskiya sai Allah,\" kuma mafi ƙasƙanci shine kawar da wani abu mai cutarwa daga hanya - kuma tawali'u wani reshe ne na imani.",
      },
    ],
    actions: [
      "Sabunta Shahada a yau tare da cikakkiyar kulawa ga abin da ake nufi, ba a matsayin jumlar yau da kullun ba.",
      "Koyi daya daga cikin sunayen Allah, ku fahimce shi, kuma ku yi kira da shi a cikin addu'o'in ku.",
    ],
  },
  {
    title: "Sallah (Sallah)",
    summary:
      "Aikin farko da aka yi tambaya game da shi ranar kiyama - ginshiƙin da ke haɗa bawa zuwa ga Ubangiji.",
    lessons: [
      "Sallah ita ce rukunnan Musulunci na biyu kuma aikin farko da za a tambayi bawa a kansa ranar kiyama - idan ya inganta, sauran littafai suna son bi.",
      "Alkur'ani ya ce addu'a, da ake yinta da zuciya ta hakika, tana kange mutum daga fasikanci da munanan ayyuka; Ba wai kawai al'ada ba ne amma sake dawowar rai sau biyar a rana.",
      "Ba kamar sauran farillai da aka saukar a bayan qasa ba, an wajabta yin Sallah ga al’ummah a lokacin hawan Annabi Sallallahu Alaihi Wasallama (al-Isra wal-Mi’raj) a matsayin wata kyauta ta musamman da kuma hanyar da muminai ke hawa zuwa ga Allah.",
      "Domin ana maimaituwa sau biyar a kowace rana, sallah ita ce tsayuwar lafiyar da ke raya imani tsakanin ibada daya da ta gaba.",
    ],
    quran: [
      {
        excerpt: "Lallai sallah tana haramta alfasha da zalunci, kuma ambaton Allah ya fi girma.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Farkon ayyukan bawa da za a yi masa hukunci ranar kiyama ita ce sallarsa; idan yana da kyau ya yi nasara, idan kuma ta nakasa ya gaza ya yi hasara.",
      },
    ],
    actions: [
      "Yi Sallah daya a yau a hankali, kana fahimtar kalmomin fatiha yayin da kake karanta su.",
      "Bude Jagoran Koyi na Munib don karfafa bangare guda na addu'ar ku.",
    ],
  },
  {
    title: "Iyaye",
    summary:
      "Kyautatawa ga iyaye yana haɗe da bautar Allah - bayan shirka, ana gargaɗin rashin godiya a gare su.",
    lessons: [
      "Allah yana haɗa kyautatawa ga iyaye kai tsaye zuwa ga bautarsa ​​a cikin ayar guda - alamar girman haƙƙinsu a Musulunci.",
      "Alkur'ani ya hana ko da karamar alamar bacin rai: ba wai kawai a ce musu 'uff' ba, ko magana da kakkausan harshe, sai dai ya yi musu magana da tausasa murya.",
      "Umurni yana girma a cikin tsufa, lokacin da iyaye suka fi bukatar haƙuri: ku kula da su kamar yadda suke kula da ku a dā, kuma ku sassauta musu fikafikan tawali'u saboda rahama.",
      "Ibada ba ta ƙarewa a mutuwa - ci gaba da yin addu'a ga iyaye, ba da sadaka a madadinsu, da girmama abokansu da alkawuran ayyukan aminci ne masu gudana.",
    ],
    quran: [
      {
        excerpt:
          "Ubangijinku Ya hukunta kada ku bauta wa kowa face Shi, kuma ku kyautata wa mahaifa…",
      },
    ],
    actions: [
      "Kira ko saƙon iyaye tare da kalmomi masu kyau a yau.",
      "Ku yiwa iyayenku addu'a da sunan.",
    ],
  },
  {
    title: "Hakuri (Sabar)",
    summary: "Dagewa cikin biyayya, kamewa daga zunubi, da yarda da jarabawa.",
    lessons: [
      "Malamai suna siffanta saber da nau'i uku: Hakuri kan da'a ga Allah, da hakurin nisantar zunubi, da hakurin karbar hukuncinSa idan fitinu suka zo.",
      "Sabr ba yanke kauna ba ne ko kuma washe haƙoranka a keɓe - Kur'ani ya haɗa shi da addu'a a matsayin tushen taimako, don haka haƙuri yana aiki kuma yana mai da ku zuwa ga Allah, ba mai nisa ba.",
      "Allah yana bayyana kansa cewa yana 'tare da masu haƙuri,' kuma yana yi wa masu haƙuri alkawarin ladansu ba tare da ƙididdigewa ba - girmamawar da kusan babu wani siffa.",
      "Annabawa sun kasance mafi tsananin jarrabawar mutane, kuma Kur'ani ya tsaya tsayin daka - Ayyub na rashin lafiya, Yakub cikin bakin ciki, Yusuf ta hanyar cin amana da kurkuku - a matsayin abin koyi da za a yi koyi da shi.",
    ],
    quran: [
      {
        excerpt:
          "Ya ku wadanda suka yi imani ku nemi taimako da hakuri da addu'a. Lalle ne Allah Yanã tãre da mãsu haƙuri.",
      },
    ],
    actions: [
      "Idan fushi ya tashi a yau, ka dakata, ka shaƙa, ka ce 'Inna lillahi wa inna ilayhi raji'un' kafin ka amsa.",
      "Juya lokaci guda na wahala a wannan makon zuwa raka'a biyu na sallah maimakon korafi.",
    ],
  },
  {
    title: "Sadaqah & Zakka",
    summary: "Tsarkake dukiya da ciyar da mabukata - alamar bangaskiya ta gaskiya.",
    lessons: [
      "Zakka - sadaka mai tsarkakewa na shekara-shekara akan dukiya - ita ce rukunnan musulunci na uku kuma wajibi ne, yayin da sadaqah ita ce sadaqa da ba ta da iyaka da sifofi marasa iyaka.",
      "Alkur'ani ya yi alkawari cewa dukiyar da aka kashe don Allah ba ta yin hasara, sai dai ta yawaita: kamar kwaya daya da ta shuka zangarniya bakwai, kowacce tana dauke da hatsi dari, kuma Allah yana kara ninkawa ga wanda ya so.",
      "Sadaka ba kudi kadai ba ne. Annabi SAW ya koyar da cewa ko haduwa da dan uwanka da fuskar murmushi sadaka ce, don haka babu wanda ya fi karfin bayarwa.",
      "Ba da kyauta yana tsarkake dukiya da mai bayarwa, da sassauta rikon kwadayi da gina tausayi - shi ya sa ita kanta kalmar zakka tana nufin tsarkakewa da girma.",
    ],
    quran: [
      {
        excerpt:
          "Misãlin waɗanda suke ciyarwa a cikin hanyar Allah, kamar ƙwãya ce wadda ta tsirar da ƙwaya bakwai.",
      },
    ],
    actions: [
      "Ba da wani abu a yau - kuɗi, lokacinku, ko kalmar kirki ta gaske - ko da ƙarami da gaibu.",
      "Ku duba wajibcin zakka a Munib sannan ku lura lokacin da za a biya na gaba.",
    ],
  },
  {
    title: "Tuba (Tawbah)",
    summary: "Allah Yana son masu tũba- ƙõfa a buɗe take, har rai ya kai ga makogwaro.",
    lessons: [
      "Tawbah na ikhlasi yana da sharudda bayyanannu: nadama ta gaskiya game da zunubin, da dakatar da shi nan da nan, da ƙudiri mai ƙarfi ba zai dawo ba - kuma idan zunubin ya zalunci wani, yana maido da haƙƙinsa su ma.",
      "Kuma Allah bã Ya halatta kawai ga tũba, Yanã son mãsu mayar da al'amari zuwa gare Shi, sabõda haka, kõma bãyan zaftawa abin so ne a gare Shi, bãbu wata alama a kanku.",
      "Ƙofar rahama tana da faɗi da ban mamaki: Allah yana cewa hatta waɗanda suka zalunci kansu da yawa kada su yanke kauna, domin yana gafarta zunubai ga wanda ya tuba na gaskiya.",
      "Tuba ba a keɓe shi don manyan zunubai ko lokuta masu ban mamaki - istighfar (neman gafara) a tsawon yini yana kiyaye zuciya da taushi da tsabta.",
    ],
    quran: [
      {
        excerpt:
          "Ka ce: Ya ku bayiNa wadanda suka yi zalunci a kansu, kada ku yanke tsammani daga rahamar Allah…",
      },
    ],
    actions: [
      "Kace 'Astaghfirullah' sau 100 a yau, ma'ana, kuma ka ji nauyin dagawa.",
      "Ka ambata ɗabi'a ɗaya da ka sani ba ta son Allah kuma ka ɗauki matakin farko na kankare don barin ta.",
    ],
  },
  {
    title: "Aljanna (Jannah)",
    summary:
      "Lada na har abada da aka shirya don muttaqin - wanda aka kwatanta a bayyane, daki-daki masu motsa rai.",
    lessons: [
      "Alkur'ani ya siffanta Jannah daki-daki daki-daki - gidãjen Aljanna, ƙoramu na gudãna daga ƙarƙashinsu, da sauƙi madawwami, da haɗuwa da sãlihai - daidai da sanya mumini ya yi kwaɗayinta, kuma ya yi jihãdi.",
      "Shiga Aljanna a qarshe da rahamar Allah ne, ba da ayyuka kadai ba; bangaskiya da ƙoƙari na gaskiya su ne hanya, amma babu ayyukan kowa da zai sami lada na har abada ba tare da alherinsa ba.",
      "Kur'ani ya kwadaitar da muminai da su yi gasa da gaugawa zuwa ga gafara da Aljanna 'fadi kamar sammai da kasa' - ana nufin a bi ta ne da gaske, ba wai kawai ake fata ba.",
      "Mafi girman sakamako ba shine gonaki ko koguna ba, face ganin fuskar Allah - farin ciki na ƙarshe da aka yi wa 'yan Aljanna alkawari.",
    ],
    quran: [
      {
        excerpt:
          "Kuma ku yi gaggawa zuwa ga gafara daga Ubangijinku, da Aljanna mai faɗin sammai da ƙasa…",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Wutar Jahannama (Jahannama)",
    summary: "Gargadi na gaske - ba don yanke kauna ga masu imani ba amma don tayar da hankali.",
    lessons: [
      "Jahannama gargadi ne na gaske, ba misali ba - Kur'ani ya siffanta shi a sarari domin mutane su dauki hadarin da muhimmanci kuma su canza hanya alhalin suna iya.",
      "Tsoron wuta ana nufin yin aiki tare da fatan rahamar Allah: mumini yana tafiya ne tsakanin khawfi (tsoron) da raja (bege), don haka yanke kauna ko tsaro na karya ba zai mamaye ba.",
      "Wanda Alkur’ani ya kebanta da cewa ba ya gafartawa idan mutum ya mutu a kansa shirka ne – shirka da Allah; kõme fãce dõmin Ya gãfarta wa wanda Yake so.",
      "Allah yana yin gargaɗi domin ya mayar da mutane zuwa gare shi, ba domin ya murkushe wanda ya tuba ba - kowane gargaɗi yana haɗe a cikin Alƙur'ani da gayyata ta dawowa.",
    ],
    quran: [
      {
        excerpt:
          "Lalle ne, Allah bã Ya gãfarta yin shirka da Shi, kuma amma Yanã gãfarta abin da bai kai haka ba ga wanda Yake so.",
      },
    ],
    actions: [
      "Bayan kowace sallah yau ka roki Allah da gaske ya kare ka daga wuta.",
      "Ka sabunta tauhidi: ka yi tunani a kan bauta wa Allah Shi kaɗai, tabbataccen kariya daga Jahannama.",
    ],
  },
  {
    title: "Adalci",
    summary: "Ku tsaya tsayin daka don yin adalci ko da kanku ne ko danginku.",
    lessons: [
      "Adalci a cikin Alkur'ani ba shi da rangwame: ka tsaya tsayin daka a kai ko da kuwa gaskiya tana kan kanka, ko iyayenka, ko na kusa da kai.",
      "Allah Ya yi umurni cewa ƙiyayya ga mutane kada ta jefa ku cikin zalunci. Wancan ne mafi kusantar taƙawa (taqwa)' - don haka ana bin ãdalci hatta a kan maƙiya.",
      "An yi wa zalunci (dhulm) gargaɗi mai tsanani a kan; Annabi ﷺ ya koyar da cewa zalunci zai bayyana a matsayin duhu ga wanda ya yi zalunci a ranar kiyama.",
      "Adalci ba ga alƙalai da masu mulki kaɗai ba ne, yana rayuwa cikin gaskiya, adalci, kiyaye maganarka, da ba kowane mutum hakkinsa.",
    ],
    quran: [
      {
        excerpt:
          "Ku kasance masu adalci, kuma ku zama masu shaida ga Allah, ko da a kanku ne ko a kanku ko iyaye da dangi.",
      },
    ],
    actions: [
      "Ba wa wani haƙƙinsa a yau - albashi mai kyau, amsa ta gaskiya, ko bashi da kuke bin su.",
      "Ɗauki lokaci ɗaya inda son zuciya ke jarabtar ku da rashin adalci, kuma ku zaɓi adalci maimakon.",
    ],
  },
  {
    title: "Ilimi",
    summary: 'Ka karanta, ka yi tunani, kuma ka ce: "Ya Ubangiji, Ka ƙara mini ilimi."',
    lessons: [
      "Kalma ta farko da aka saukar a Kur'ani ita ce 'Karanta' - Musulunci ya buɗe ba da wata al'ada ba amma da umarnin koyo, yana girmama ilimin hankali da ilimin zuciya.",
      "Allah ya ce ma AnnabinSa SAW ya ci gaba da neman kari: 'Ya Ubangiji, Ka kara mini ilimi' - abin da Alkur'ani ya umarce shi da ya nemi kari a kansa.",
      "Ilimi mai fa'ida ana nufin a yi aiki da shi kuma a isar da shi; Annabi SAW ya koyar da cewa malamai magada annabawa ne, ba dukiya ba ne suke gadon ilimi.",
      "Neman ilimi mai tsarki ibada ce, kuma Kur'ani ya bambanta a fili tsakanin wadanda suka sani da wadanda ba su sani ba - ' shin daidai suke?'",
    ],
    quran: [
      {
        excerpt: 'Kuma ka ce: "Ya Ubangijina! Ka ƙãra mini ilmi."',
      },
    ],
    actions: [
      "Koyi sabon abu ɗaya daga cikin Kur'ani a yau - aya, kalma, ko hukunci - kuma ku koya wa wani.",
      "Ka haddace addu'ar 'Rabbi zidni ilma' ka fade ta kafin ka yi karatu.",
    ],
  },
  {
    title: "Annabawa",
    summary: "Labarun jagora, gwaji, da goyon bayan Allah - ba nishaɗi ba amma koyarwa.",
    lessons: [
      "Alkur'ani yana karantar da cewa babu wata al'umma da ta bar ba tare da shiriya ba: 'Babu wata al'umma face wani mai gargadi ya shige a cikinsu' - an aiko da sakon tauhidi a ko'ina.",
      "Dukan annabawa sun zo da kira guda ɗaya - su bauta wa Allah Shi kaɗai - kuma ba a ba da labarinsu a matsayin tarihi don kansa ba amma don koyarwa ga 'masu fahimta'.",
      "Muhammadu s.a.w shi ne hatimin Annabawa, kuma manzon karshe, kuma musulmi dole ne ya yi imani da dukkan annabawan da suka gabace shi – Nuhu, Ibrahim, Musa, Isa, da sauran su – ba tare da nuna bambanci a tsakaninsu ba.",
      "Annabawa mutane ne kuma bayin Allah, ba na Ubangiji ba; Alkur'ani yana girmama su amma ya tabbatar da su a bangaren halitta, ba a taba bautawa tare da mahalicci ba.",
    ],
    quran: [
      {
        excerpt: "A cikin labaransu darasi ne ga masu fahimtar…",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Mata",
    summary: "Hakkoki, mutunci, da daidaiton ruhi - Maryam tana cikin mafi kyawun mata.",
    lessons: [
      "Kur'ani yana karantar da daidaiton ruhi na maza da mata a gaban Allah: Imani guda, ayyuka guda, da lada iri daya an yi alkawari ga 'muminai maza da muminai mata' daidai.",
      "An siffanta mata da maza a matsayin abokan tarayya da masu kare juna a cikin imani, ba a matsayin dukiya ba — sura ta huɗu, an-Nisa ('Mata'), ta dukufa wajen kiyaye haƙƙoƙinsu, mutuncinsu, gadonsu, da kulawa.",
      "Kur'ani ya rike Maryam, mahaifiyar Isa, a matsayin abin koyi ga dukan muminai, kuma yana girmama iyaye mata sosai har sanannen koyarwa ya sanya Aljanna a ƙafafunsu.",
      "Dukkan jinsin biyu sun samo asali ne daga asali guda - 'sun halicce ku daga rai ɗaya' - suna kafa mutuntaka da mutunci ɗaya daga ayar farko ta suratun Nisa.",
    ],
    quran: [
      {
        excerpt:
          "Ku bi Ubangijinku da taƙawa, Wanda Ya halitta ku daga rai guda, kuma Ya halitta daga gare shi, ma'auranta…",
      },
    ],
    actions: [
      "Ka girmama mace a rayuwarka a yau - uwa, mata, 'yar'uwa, ko 'yar - tare da takamaiman hakki ko alheri da ake bin ta.",
    ],
  },
  {
    title: "Yara",
    summary: "Amana (amana) - wanda ake ɗaukaka akan tauhidi da kyautatawa.",
    lessons: [
      "'Ya'ya amana ne - amana ce daga Allah - kuma Alkur'ani ya dora wa iyaye alhakin tarbiyyar su: 'Ku tsare kanku da iyalanku daga wuta' ya fara da koya musu tauhidi da kyawawan halaye.",
      "Annabi SAW ya lissafta karantar da karatun Alkur'ani a cikin mafi kyawun ayyuka, don haka shiryar da yaro ya karanta ko da kadan daga cikinsa yana shuka alheri mai dorewa wanda ladansa yake komawa ga iyaye.",
      "Hikimar tarbiyyar da aka maimaita akai-akai tana ba da shawara ga saduwa da yara a matakinsu - yin wasa da su a farkon shekarun farko, sannan koya da horar da su a hankali, sannan abota da su yayin da suke girma.",
      "Tarbiyar adali jarin jari ne da ya wuce wannan rayuwar: zuriyar adali da ke yi wa iyaye addu’a ya ci gaba da amfanar su tun bayan mutuwa.",
    ],
    quran: [
      {
        excerpt: "Ya ku wadanda suka yi imani, ku tsare kanku da iyalanku daga wuta.",
      },
    ],
    actions: [
      "Koyar da yaro gajeriyar aya ɗaya ko hanya mai kyau a yau, cikin haƙuri da ƙarfafawa.",
      "Ku yi wa ‘ya’yanku addu’a (ko ‘ya’yan da ke hannunku) da sunan su zama masu gaskiya da soyuwa ga Allah.",
    ],
  },
];

export const QURAN_GUIDE_TAJWEED_HA: DeepPartial<QuranGuideTajweedLesson>[] = [
  {
    title: "Noon Sakinah & Taween",
    summary: "Dokokin ن tare da sukun da taween - izhar, idgham, iqlab, ikhfa.",
    explanation: [
      "A azahar sakinah ita ce harafin ن mai ɗauke da sukun (ba wasali); taween shine ƙarar wasali sau biyu (an, in, un) wanda yayi daidai da tsakar rana a ƙarshen kalma. Dukansu suna bin ƙa'idodi guda huɗu iri ɗaya, waɗanda aka yanke su gaba ɗaya ta wasiƙar da ke gaba.",
      "Izhar (lafazi mai fa'ida): idan daya daga cikin haruffan makogwaro guda shida (ء ه ع ح غ خ) ya biyo bayan la'asar a fili kuma ba tare da gauraya hanci ba.",
      "Idgham (haɗe): kafin haruffan kalmar 'yarmaloon' (ي ر م ل و ن), tsakar rana ta haɗu zuwa harafi na gaba - tare da ghunnah (sautin hanci) don ي ن م و, kuma ba tare da ghunnah don ل ر ba.",
      "Iqlab (canzawa): idan ب ya biyo baya, ana mayar da la'asar ta zama sautin mem na boye tare da ghunnah.",
      "Ikhfa (boye): kafin sauran haruffa goma sha biyar, la'asar ba ta cika furtawa ba kuma ba a haɗa ta gaba ɗaya ba - tana 'boye' da ghunnah mai haske yayin da harshe ke shirya wa harafi na gaba.",
    ],
    practice:
      "Karanta suratul Fatiha sannu a hankali, kuma duk lokacin da kuka hadu da tsakar rana sakinah ko taween, ku dakata don bayyana sunan wanne daga cikin dokoki guda hudu da kuma dalilin da yasa.",
  },
  {
    title: "Meem Sakinah",
    summary: "Ikhfaa shafawi, idgham shafawi, and izhar shafawi for م with sukun.",
    explanation: [
      "A meem sakinah shine wasika م dauke da sukun. Tana da ka'idoji guda uku daidai, kowanne mai suna 'shafawi' (labial) saboda ana samar da meem da lebe, wanda kuma wanda ake amfani da shi ya dogara ne akan wannan harafi mai zuwa.",
      "Idgham shafawi (labial merging): lokacin da meem sakinah ke biye da wani meem, su biyun suna haɗuwa zuwa ɗaya damuwa mem da ke riƙe da ghunnah.",
      "Ikhfa shafawi (labial hide): idan ب ya biyo baya, mem yana ɓoye a hankali - leɓuna suna zuwa kusa amma ba sa dannawa gaba ɗaya - tare da ghunnah.",
      "Izhar shafawi (labial clarity): kafin kowane harafi, ana furta kalmar meem a fili. Kula da hankali na musamman kafin haruffa و da ف, inda xalibai suka fi sha'awar su ruɗe shi.",
    ],
    practice:
      "Karanta gajerun surori da yawa daga Juz Amma kuma ka yiwa kowane meem sakinah suna, ka sanya sunan tsarinta kafin ka karanta kalmar.",
  },
  {
    title: "Madd (Tsarin girma)",
    summary: "Halitta, sakandare, da kuma tsawaita wajaba na wasulan.",
    explanation: [
      "Madd yana nufin mikewa da sautin wasali, kuma yana faruwa ne akan harufan hauka guda uku - alif (ا), waw (و), da ya (ي) - lokacin da ba su dauke da wasalin nasu ba kuma suka bi gajeriyar wasalinsu.",
      "Madd asli (na halitta madd) shine ainihin haɓaka kusan ƙididdiga biyu, wanda ake gabatarwa duk inda wasiƙar hauka ta bayyana ba tare da wani dalili na musamman ba bayan sa. Kowane mai karatu yana riƙe shi daidai.",
      "Madd far'i (secondary madd) wani hamza ne ko sukun ne ke haifar da shi kuma yana da tsayi - yawanci hudu ko shida. Madaidaicin tsayi ya dogara da nau'in mahaukaci da karatun (riwayah) da kuke bi.",
      "Domin tsayawa a ƙarshen kalma na iya haifar da sukun, kuma yana iya ƙara tsawaita hauka - ƙarin dalili na koyon tsawon lokaci ta kunne daga ƙwararren malami maimakon zato.",
    ],
    practice:
      "Zaɓi gajeriyar surar da kuka saba kuma a hankali kirga '1-2' akan kowane mahaukata na halitta da '1-2-3-4' akan hauka na biyu, kiyaye lokacinku daidai.",
  },
  {
    title: "Ghunnah",
    summary: "Sautin hanci yana raka la'asar da meem a idgham da ikhfa.",
    explanation: [
      "Ghunnah sautin hanci ne da aka samar ta hanci, asalin ingancin haruffan la'asar (ن) da meem (م). A daidaitaccen karatun ana gudanar da shi kusan kirga biyu.",
      "Ana buqata kuma mafi faxi a cikin ka'idoji da dama da kuka riga kuka cika: idgham tare da ghunnah, ikhfa, iqlab, kuma duk lokacin da la'asar ko mem ke ɗaukar shadda.",
      "Ya kamata sauti ya zama santsi da sarrafawa - ba rera waƙa ko ƙwanƙwasa sauti ba ne, amma tsayayyen sautin hanci wanda aka auna zuwa daidai tsayi.",
      "Gwaji mai sauƙi: tsunkule hanci da sauƙi yayin samar da harafin ghunnah; idan an toshe sautin, sautin yana fitowa ta hanci da gaske kamar yadda ya kamata.",
    ],
    practice:
      "Karanta wata kalma da shadda da rana ko rana, ka riƙe ghunnah don ƙidaya biyu, sannan ka yi rikodin kanka kuma ka kwatanta da wanda ya cancanta.",
  },
  {
    title: "Qalqalah",
    summary: "Yin billa akan ق ط ب ج د lokacin sakin ko lokacin tsayawa akan su.",
    explanation: [
      "Qalqalah wata ‘yar billa ce ta ‘billa’ da aka ba wa haruffa biyar – wanda aka tattara a cikin jimlar قُطْبُ جَدٍ, wato ق ط ب ج د — duk lokacin da suke ɗauke da sukun.",
      "Bounce shine girgizar haske na wurin magana; Kada ku ƙara cikakken wasali bayan harafin, kawai ku bar shi ya 'sake' da tsabta.",
      "Yana da sauƙi (sughra) idan harafin yana da sukun a tsakiyar kalma, kuma ya fi ƙarfi da bayyanawa (kubra) idan ka tsaya akan waccan harafin a ƙarshen kalma.",
      "Kiyaye billa tsaka tsaki - kar a karkatar da shi zuwa sautin 'a', 'i', ko 'u'; sauti iri ɗaya ne ba tare da la'akari da wasulan da ke kewaye ba.",
    ],
    practice:
      "Karanta surar al-Ikhlas kuma ka tsaya da kyar akan kowace harafi qalqalah - د na 'ahad' da 'yulad' - suna jin sake dawowa mai tsabta.",
  },
  {
    title: "Wakafi (Tsayawa)",
    summary: "Inda zan tsaya, numfashi, da kuma yadda tsayawa ke canza lafazin.",
    explanation: [
      "Waqf shine fasahar inda da yadda ake tsayawa. Mushaf yana yin alamar tsayawa tare da ƙananan alamomi - misali م don tsayawar da ake buƙata, ط da ج don tsayawar izini, kuma لا ma'anar kada ta tsaya a nan - don jagorantar mai karatu.",
      "Tsayawa yawanci yana rufe wasalin ƙarshe, yana mai da harafin ƙarshe zuwa sukun. Wannan canjin zai iya haifar da wasu ƙa'idodi, kamar qalqalah ko madd mai tsayi, don haka kalma na iya yin sauti daban-daban lokacin da kuka tsaya akanta fiye da lokacin da kuka ci gaba.",
      "Inda ka dakata zai iya rinjayar ma'anar, don haka kada ka karya tsakiyar jumla ta hanyar da ta gurbata shi. Wani lamari na musamman shi ne wakafi na mu’anaqa ( runguma) mai alamar dige-dige guda uku, inda za ka iya tsayawa a daya daga cikin maki biyu amma ba duka ba.",
      "Hanya mafi aminci don koyan tsayawa daidai shine tare da mushaf wanda ke nuna alamar waƙafi tare da ƙwararren mai karantawa, don haka dakatawar ku ta dace da karatun da ake watsawa.",
    ],
    practice:
      "Ɗauki shafi ɗaya tare da alamar waƙafi kuma karanta shi a bayyane yana bin rikodin malamin tajweed, tsayawa daidai inda alamomin suka nuna.",
  },
  {
    title: "Hamzat Wasl",
    summary:
      "The connecting hamza that is pronounced only when starting, and dropped when joining.",
    explanation: [
      "Hamzat wasl (ٱ) is a connecting hamza written with a small saddah-like mark above an alif. It appears at the start of many nouns, verbs, and particles — including the definite article ال.",
      "When you begin recitation on a word that starts with hamzat wasl, you pronounce it with a clear hamza sound so the word can open cleanly.",
      "When the word is joined to what comes before it, the hamzat wasl is silent — you glide from the previous letter straight into the following letter and do not sound a separate hamza.",
      "Recognizing hamzat wasl helps you avoid inserting an extra glottal stop mid-phrase, which is a common beginner habit when reading the mushaf slowly.",
    ],
    practice:
      "Recite the basmalah and Surah al-Fatiha, pausing at each ٱ to decide whether you are starting (pronounce) or joining (drop).",
  },
  {
    title: "Lam Shamsiyah",
    summary: "Sun letters that assimilate the لام of ال, versus moon letters that keep it clear.",
    explanation: [
      "When the definite article ال is attached to a noun, the لام may be pronounced clearly or assimilated, depending on the following letter.",
      "Sun letters (huruf shamsiyah) cause the لام to be silent and the next letter to be doubled with a shaddah — as in ٱلرَّحْمَٰن where the ر absorbs the لام.",
      "Moon letters (huruf qamariyah) keep the لام clear — as in ٱلْقَمَر — so you hear both the لام and the following letter.",
      "Learning the sun and moon sets by heart (or by ear from a teacher) prevents over-pronouncing silent لام and under-pronouncing clear لام.",
    ],
    practice:
      "Open Juz Amma and mark ten nouns with ال: for each, name whether the لام is shamsiyah (silent) or qamariyah (clear) before you recite.",
  },
  {
    title: "Silent Letters",
    summary: "Letters written in the mushaf that are not pronounced in continuous recitation.",
    explanation: [
      "Some letters appear in the Uthmani script for historical or orthographic reasons but are not sounded when you recite — they are marked silent in tajweed colorings.",
      "Common cases include certain alifs that are written but not elongated, and letters that are assimilated into a following shaddah so they leave no separate sound.",
      "Silent marking is a reading aid: it keeps the written mushaf faithful while guiding the tongue not to invent an extra sound.",
      "When in doubt, follow a colored tajweed mushaf or a qualified reciter — the goal is fidelity to the transmitted reading, not guessing from spelling alone.",
    ],
    practice:
      "With tajweed colors on, read one page slowly and whisper only the colored (sounded) letters — skip every silent-marked letter deliberately.",
  },
];

export const QURAN_GUIDE_VOCABULARY_HA: DeepPartial<QuranGuideVocabEntry>[] = [
  {
    meaning: "Allah ɗaya na gaskiya—sunan da ya dace ya ƙunshi dukan kyawawan sunaye.",
    frequency: "2,700+ abubuwan da suka faru",
    example: "Bismillah - Da sunan Allah",
    quranRef: {
      excerpt: "Da sunan Allah, Mai rahama, Mai jin kai.",
    },
  },
  {
    meaning: "Ubangiji, Jagora, Mai dorewa - wanda ya halitta, ya mallaka, rayarwa, da mulki.",
    frequency: "Sau da yawa",
    example: "Rabbana - Our Lord",
    quranRef: {
      excerpt: "Dukkan godiya ta tabbata ga Allah Ubangijin talikai.",
    },
  },
  {
    meaning: "Rahama, Tausayi, Tausayi daga Allah da cikin halittu.",
    frequency: "Tushen gama gari ر-ح-م",
    example: "Ar-Rahman, Ar-Rahim",
  },
  {
    meaning: "Aljanna, Aljanna - madawwami wurin lada.",
    frequency: "Yawaita",
    example: "gidãjen Aljanna ƙoramu na gudãna daga ƙarƙashinsu",
  },
  {
    meaning: "Wuta - tana nufin Jahannama a matsayin gargaɗi da sakamako.",
    frequency: "Yawaita",
    example: "Ku ji tsoron wutar da aka yi tattalinta domin kafirai",
  },
  {
    meaning: "Imani, imani, dogaro ga Allah da kuma yarda da sakonSa.",
    frequency: "Sau da yawa",
    example: "Ya ku wadanda suka yi imani (ya ayyuha alladhina amanu)",
  },
  {
    meaning: "Hakuri, juriya, juriya don Allah.",
    frequency: "Yawaita",
    example: "Lalle ne Allah Yanã tãre da mãsu haƙuri",
  },
  {
    meaning: "Godiya - yarda da albarka tare da zuciya, harshe, da gaɓoɓi.",
    frequency: "Yawaita",
    example: "Idan kun gode, tabbas zan ƙara muku",
  },
  {
    meaning: "Tsoron Allah, Taqawa, kiyaye kai daga zunubi saboda tsoron Allah.",
    frequency: "Sau da yawa",
    example: "Mafi daukakar ku a wurin Allah, shi ne mafi takawa",
  },
  {
    meaning: "arzuta, abin da Allah Ya hukunta ga kowane rai.",
    frequency: "Yawaita",
    example: "Allah ne Mafi alherin masu azurtawa",
  },
  {
    meaning: "Haske - shiriya, wahayi, da hasken zuciya.",
    frequency: "Yawaita",
    example: "Allah ne Hasken sammai da ƙasa",
    quranRef: {
      excerpt: "Allah shine Hasken sammai da ƙasa…",
    },
  },
  {
    meaning:
      "Rayuwar wannan duniya - a zahiri 'rayuwar mafi kusa. A cikin Alkur'ani shi ne na wucin gadi kuma jarrabawa ne, sabanin akhirah mai dorewa, kuma ba gidan muminai na gaskiya ba ne.",
    frequency: "Yawaita",
    example: "Rayuwar duniya (al-hayat ad-dunya) ba kawai abin shagala ba ce, da shagala",
  },
  {
    meaning:
      "Lahira — rai madawwami bayan mutuwa, gami da tashin matattu, hukunci, Aljanna, da Jahannama. Ita ce rayuwa ta hakika kuma madawwama da Alkur'ani ya bukaci muminai su yi aiki a kai.",
    frequency: "Yawaita",
    example: "Kuma Lahira (al-akhirah) ce mafi alheri kuma mafi wanzuwa",
  },
  {
    meaning:
      "Sallar al'ada, ginshiƙi na biyu na Musulunci, ana yinta sau biyar a kowace rana. Haka nan kalmar tana dauke da ma'anar alaka da rokon Allah.",
    frequency: "Sau da yawa",
    example: "Kuma ku tsayar da salla (aqim as-Sallah) domin ambatona",
  },
  {
    meaning:
      "Littafi ko nassi - mafi yawanci Kur'ani da kansa ('Littafi ne'), amma kuma nassosi da aka saukar da farko da tarihin ayyuka. Tushen k-t-b, don rubutawa.",
    frequency: "Sau da yawa",
    example: "Wannan shi ne Littafin (Dhalika al-kitab) wanda babu shakka a kansa",
  },
];

export const QURAN_GUIDE_LETTERS_HA: DeepPartial<QuranGuideLetter>[] = [
  {
    name: "Alif",
    pronunciation: "Dogon /a/ kamar a cikin 'baba' (lokacin ɗaukar hamza ko mahaukaci)",
  },
  {
    name: "Ba",
    pronunciation: "Kamar Turanci 'b'",
  },
  {
    name: "Ta",
    pronunciation: "Kamar Turanci 't'",
  },
  {
    name: "Ta",
    pronunciation: "Kamar 'th' a cikin 'tunanin'",
  },
  {
    name: "Jim",
    pronunciation: "Kamar 'j' in 'jam'",
  },
  {
    name: "Ha",
    pronunciation: "Kaifi numfashi h daga makogwaro - ba Turanci 'h'",
  },
  {
    name: "Kha",
    pronunciation: "Kamar 'loch' na Scotland - gogayya a cikin makogwaro",
  },
  {
    name: "Dal",
    pronunciation: "Kamar Turanci 'd'",
  },
  {
    name: "Dhal",
    pronunciation: "Kamar 'th' a cikin 'wannan'",
  },
  {
    name: "Ra",
    pronunciation: "An yi birgima / trilled 'r'",
  },
  {
    name: "Zay",
    pronunciation: "Kamar Turanci 'z'",
  },
  {
    name: "Zunubi",
    pronunciation: "Kamar Turanci",
  },
  {
    name: "Shin",
    pronunciation: "Kamar 'sh' a cikin 'jirgin ruwa'",
  },
  {
    name: "Bakin ciki",
    pronunciation: "Ƙarfafa 's' - harshe daga sama, cikakken sauti",
  },
  {
    name: "Baba",
    pronunciation: "Ƙaddara 'd' - na musamman ga Larabci",
  },
  {
    name: "Ta (na jaddada)",
    pronunciation: "Ƙaddara 't' - zurfi a cikin baki",
  },
  {
    name: "Za (na jaddada)",
    pronunciation: "Sigar ƙarfafawa ta sautin 'dh'",
  },
  {
    name: "Ayn",
    pronunciation:
      "Ƙunƙarar murya daga tsakiyar makogwaro - babu Turanci daidai; koyi da shi ta hanyar koyi da mai karatu",
  },
  {
    name: "Gayin",
    pronunciation: "Kamar Faransanci 'r' ko gargling 'gh'",
  },
  {
    name: "Fa",
    pronunciation: "Kamar Turanci 'f'",
  },
  {
    name: "Qaf",
    pronunciation: "Deep 'k' daga bayan harshe - ba Turanci 'k'",
  },
  {
    name: "Kaf",
    pronunciation: "Kamar Turanci 'k' (gaba a baki)",
  },
  {
    name: "Lam",
    pronunciation: "Kamar Turanci 'l'",
  },
  {
    name: "Mim",
    pronunciation: "Kamar Turanci 'm'",
  },
  {
    name: "Nun",
    pronunciation: "Kamar Turanci 'n'",
  },
  {
    name: "Ha (haske)",
    pronunciation: "M 'h' a ƙarshen kalmomi",
  },
  {
    name: "Waw",
    pronunciation: "Kamar 'w' ko dogon 'oo'",
  },
  {
    name: "Ya",
    pronunciation: "Kamar 'y' ko dogon 'ee'",
  },
];

export const QURAN_GUIDE_PRONUNCIATION_HA: DeepPartial<QuranGuidePronunciationPair>[] = [
  {
    title: "Ay vs Ha",
    tip: "Dukansu sun fito daga makogwaro amma sun bambanta a murya. Ayn (ع) takura ce daga tsakiyar makogwaro - igiyoyin murya suna rawar jiki. Ha (ح) ƙaƙƙarfan gogayya ce, mara murya, kamar numfashi mai nauyi mara jijjiga. Babu su cikin Ingilishi, don haka koya su da kunne daga mai karatu.",
  },
  {
    title: "Ha vs Kha",
    tip: "Ha ya fi kaifi da haske; Kha ya fi zurfi tare da ƙarin gogayya - kamar 'loch'.",
  },
  {
    title: "Zunubi vs Sad",
    tip: "Sin (س) haske ne, sirara 's' kamar a Turanci 'duba'. Bakin ciki (ص) ita ce tagwayensa mai nauyi, mai ma'ana: ɗaga bayan harshe, zagaye baki kaɗan, kuma sauti yana zurfafawa. Hada su na iya canza kalmomi - sabr (haƙuri) tare da karatun haske.",
  },
  {
    title: "Dal vs Baba",
    tip: "Dal (د) 'd' ne a sarari. Dad (ض) nauyi ne, mai jaddada 'd' na musamman ga Larabci - danna gefen harshe a kan ƙwanƙwasa na sama kuma bari sauti ya cika baki. Harshen Larabci ana yi masa laqabi da 'harshen Dad' saboda wannan harafi na musamman.",
  },
  {
    title: "Ta vs Ta (mafi mahimmanci)",
    tip: "Ƙaddamarwa ط ya fi zurfi; kar a maye gurbinsu da Ingilishi 't' kawai.",
  },
  {
    title: "Dhal vs Za (mafi mahimmanci)",
    tip: "Dukansu sun ƙunshi sautin 'th'; ظ ya fi nauyi da jaddadawa.",
  },
  {
    tip: "Kaf (ك) shine 'k' gaba kamar 'key' na Ingilishi. Qaf (ق) yana gaba da baya sosai - bayan harshe yana taɓa uvula, yana ba da zurfi, guttural 'k' ba tare da Ingilishi daidai ba. Kiyaye su: qalb (zuciya) ba kalb (kare) ba ce.",
    title: "Kaf vs Kaf",
  },
  {
    title: "Ghayn vs Kha",
    tip: "Ghayn yana da murya; Kha shine gogayya mara murya.",
  },
];

export const QURAN_GUIDE_MEMORIZATION_PLANS_HA: DeepPartial<QuranGuideMemorizationPlan>[] = [
  {
    title: "Mafari - Juz Amma",
    summary:
      "Yanayin farawa na halitta ga kowa da kowa. A fara da gajerun surori a karshen mus'haf - daga an-Nas suna aiki a baya - masu sauki, masu saurin lada, masu amfani a kowace sallah.",
    surahs: ["An-Nas", "Al-Falaq", "Al-Ikhlas", "Al-Masad", "An-Nasr", "Al-Kafirun", "Al-Kawthar"],
    tip: "Ka haddace ayah daya kacal a rana: ka saurari mai karanta murattal ya maimaita ta kamar sau goma, ka yi ta da karfi har sai ta kwarara, sannan ka hada ta da abin da ka riga ka rike kafin ka ci gaba.",
  },
  {
    title: "Matsakaici - surori goma na asali",
    summary:
      "Da zarar gajerun surori sun tabbata, sai a dauki surori dogayen surori da ake so wadanda suke dauke da falala mai girma kuma ana karanta su a ranakun Juma'a da dare - al-Mulk, Ya-Sin, ar-Rahman, al-Waqi'ah, da al-Kahf daga cikinsu.",
    surahs: [
      "Al-Fatiha",
      "Al-Mulk",
      "Ya-Sin",
      "Ar-Rahman",
      "Al-Waqi'ah",
      "Al-Kahf",
      "Al-Jumu'ah",
      "Al-Hashr",
    ],
    tip: "Anga sabon abin tunawa zuwa ƙayyadaddun ramin yau da kullun - kwanciyar hankali, lokacin da hankali bayan Fajr ya dace - don haka daidaito yana ɗaukar nauyi.",
  },
  {
    title: "Na ci gaba - Juz ɗaya",
    summary:
      "Ƙaddara don kammala cikakken juz yayin kiyaye komai kafin ya yi ƙarfi. Da yawa suna farawa da Juz'a 29 ko 30, wanda sun riga sun san surorinsu, sa'an nan kuma suna fadada juz'i daya a waje daya.",
    surahs: ["Zaɓi juz - da yawa suna farawa da Juz 29 ko 30, sannan fadada"],
    tip: "Kar a taɓa ƙara sabon yanki har sai an sabunta tsohon sosai. Manzon Allah (SAW) ya yi gargadin cewa Alkur’ani da aka haddace yana gushewa da sauri fiye da yadda rakumin da yake daure yake karyewa.",
  },
  {
    title: "Tafiya Hafiz",
    summary:
      "Haddar Alkur'ani gaba daya - wata daraja ta rayuwa wacce take daukaka wanda yake dauke da shi da yardar Allah iyayensu. Ƙaddamarwa ce mai mahimmanci, yawanci tana ɗaukar shekaru da yawa na sabbin abubuwan tunawa na yau da kullun da ingantaccen bita.",
    surahs: ["Dukan mushaf - yawanci shekaru 3-7 tare da bita kowace rana"],
    tip: "Kada ku gwada shi kadai: yi amfani da Munib's hifz tracker don sarrafa jadawalin bitar ku, kuma ku karanta akai-akai ga ƙwararren hafiz ko malami wanda zai iya kamawa da gyara kuskurenku.",
  },
];

export const QURAN_GUIDE_DAILY_LESSONS_HA: DeepPartial<QuranGuideDailyLesson>[] = [
  {
    translation:
      "Ya ku wadanda suka yi imani ku nemi taimako da hakuri da addu'a. Lalle ne Allah Yanã tãre da mãsu haƙuri.",
    context:
      "Daga Suratul Baqarah, ta sauka a Madina. Allah ya sanya maɓuɓɓugan ƙarfi guda biyu ga mumini yana fuskantar wahala - haƙuri mai haƙuri da mai da hankali ga addu'a - kuma ya yi alkawarin haɗin kai na musamman ga waɗanda suka yi tsayin daka.",
    reflection:
      "Wace jarrabawa nake fuskanta a halin yanzu da na kai ga kubuta a cikin gaggawa maimakon hakuri da addu'a da wannan ayar ta yi nuni da ni?",
    action:
      "Kuyi sallah daya a yau ba tare da gaggawa ba, kuma a cikin sujudar ku ku roki Allah da sunan Allah ya baku hakuri akan takamaiman jarabawar da kuke ciki.",
  },
  {
    translation: "Rahamata ta kewaye dukkan komai.",
    context:
      "Daga Suratul A'araf, wanda aka yi magana a cikin mahallin Musa da mutanensa. Allah Ya siffanta rahamarSa da cewa ta kunshi dukkan komai - rahama ce mai girman gaske da ta gabace ta kuma ta fi karfin azabarSa, wadda aka kebe ga wadanda suka dage da zalunci.",
    reflection:
      "Kuskuren wanene nake kin gafartawa, alhali ni kaina na dogara ga rahamar Allah marar iyaka?",
    action:
      "Zabi mutum guda daya da kake fushi, ka gafarta musu da gaske a cikin zuciyarka a yau, sannan ka yi gajeren addu'a don neman Allah ya shiryar da su kuma ya gafarta musu.",
  },
  {
    translation: "Idan kun gode, tabbas zan ƙara muku.",
    context:
      "Daga suratu Ibrahim, daga cikin ambaton Musa zuwa ga Bani Isra’ila. Allah yana danganta karuwarsa kai tsaye zuwa godiya – godiya ga wata ni’ima ita ce kadai abin da ke sa ta girma, alhali rashin godiya yana kiran hasarar ta.",
    reflection:
      "Wanne daga cikin baiwar Allah - lafiyata, iyali, imani, ko tanadi - na fara ɗaukar wannan makon a matsayin na yau da kullun kuma na bi bashi?",
    action:
      "Kafin ka kwana a daren nan sai ka ce Alhamdulillahi da babbar murya don neman ni'ima guda uku, ka sanya sunan kowannensu don haka sai godiya ta kasance mai hankali, ba ta atomatik ba.",
  },
  {
    translation: "Kuma ku yi wa mutane magana mai kyau.",
    context:
      "Daga Suratul Isra. A cikin shiriya kan yadda muminai za su ɗauki kansu, Allah ya yi umarni da mu yi magana da mutane - dukan mutane - ta hanya mafi kyau, tun da munanan kalmomi ɗaya ne daga cikin kofofin da Shaidan ke shuka rarrabuwa.",
    reflection:
      "Idan muka waiwaya baya a yau, kalmomina sun fi gina mutane ne ko kuma sun rabu da su - kuma na yi magana 'kyakkyawan kalmomi' har ma da waɗanda nake da wuya?",
    action:
      "Ƙarfafawa ko godiya ga mutum ɗaya a yau ba tare da wani ɓoyayyiyar zargi ba, kuma ka riƙe wani mugun magana guda ɗaya da aka jarabce ka ka yi.",
  },
  {
    translation: "Wanda ya dõgara ga Allah, to, Ma'ishinsa.",
    context:
      "Daga cikin suratu at-Talaq, an saita daga cikin hukunce-hukuncen saki da tanadi - daidai inda mutane suka fi damuwa da kud'i. A nan ne Allah Ya yi alkawarin cewa duk wanda ya ji tsoronSa zai azurta shi daga inda ba su zato ba, kuma wanda ya dogara gare Shi zai wadatar da shi.",
    reflection:
      "A ina nake yin tsare-tsare na hankali amma barin Allah daga cikinsu - ko dogaro da taimakon mutane ba tare da na tuba zuwa gare shi ba a cikin addu'a?",
    action:
      "Ɗauki mataki ɗaya wanda ke damun ka, ka yi sallah raka'a biyu na istikhara ko kuma ka yi addu'a a kai, sannan ka dogara ga Allah.",
  },
  {
    translation: "Ya Ubangiji Ka Kara mini ilimi.",
    context:
      "Daga Suratul Ta-Ha. Wannan shi ne kawai abin da Allah ya umurci Annabi ﷺ da ya nemi ilimi - wanda ke nuna yadda ilimi yake da matukar fa'ida da kuma cewa babu wanda ya koyi da ya gama nemansa.",
    reflection:
      "Nawa nawa nawa ne a yau ya tafi gungurawa mara iyaka, kuma ko kaɗan daga cikinsa zai iya zuwa koyon aya ɗaya ko hadisi ɗaya maimakon?",
    action:
      "Ka haddace wannan gajeriyar addu'a, 'Rabbi zidni ilma,' kuma ka kasance da al'adar yin ta bayan fajir kafin ka fara ranarka.",
  },
  {
    translation:
      "Misãlin waɗanda suke ciyar da dũkiyõyinsu a cikin tafarkin Allah, kamar shĩ ne wanda ya tsirar da ƙwai bakwai.",
    context:
      "Daga Suratul Baqarah. Allah ya zana hoton yadda sadaka take girma: iri guda daya ta fito da zangarniya bakwai, kowacce tana dauke da ƙwaya dari - komowar ɗari bakwai, kuma yana ƙara yawa ga wanda ya so. Dukiyar da aka bayar dominsa ba ta taba yin asara da gaske.",
    reflection:
      "Idan na bayar, ana yin shiru ne don Allah, ko kuwa ina son wasu su lura su yaba min?",
    action:
      "Ku yi sadaka karama a yau, kuma idan za ku iya, to, ku bayar da ita a asirce, tsakaninku da Allah kawai take.",
  },
];

export const QURAN_GUIDE_APPLY_CHALLENGES_HA: DeepPartial<QuranGuideApplyChallenge>[] = [
  {
    verseExcerpt: "Kuma ku yi wa mutane magana mai kyau.",
    challenge:
      "Ku tafi dukan yini ba tare da kalma ɗaya mai tsauri, zagi, ko izgili ba - ko da a cikin izgili, ko da lokacin tsokana.",
    habit:
      "Lokacin da bacin rai ya tashi, dakata kafin ka ba da amsa kuma zaɓi ko dai shiru ko kalma mai daɗi.",
  },
  {
    verseExcerpt: "Ka ce wa muminai maza su runtse daga ganinsu…",
    challenge:
      "Da gangan ka kawar da kallonka daga abin da Allah Ya haramta a yau - akan allonka, da abincinka, da kuma cikin jama'a.",
    habit:
      "Duk lokacin da kuka kama kanku, ku juya lokacin zuwa cikin minti biyar na Kur'ani maimakon haka.",
  },
  {
    verseExcerpt: "Kada ku ce musu 'uff'…",
    challenge:
      "Yi magana da iyaye ko dattijo a yau tare da tausasawa da haƙuri a bayyane, ba tare da nuna alamun fushi ba - kuma kuyi wani abu don yi musu hidima.",
    habit:
      "Idan suna raye, ƙaddamar da kira na yau da kullun ko ziyarta; idan ba haka ba, ku yi musu addu'a.",
  },
  {
    verseExcerpt: "Ku kasance tare da masu gaskiya.",
    challenge:
      "Faɗa gaskiya duk rana ba tare da farar ƙarya ba, babu ƙari, kuma ba tsegumi - ko da a cikin barkwanci.",
    habit: "Idan kun zame, ku tuba nan da nan kuma ku gyara duk abin da maganarku ta shafa.",
  },
  {
    verseExcerpt: "Allah yana tare da masu hakuri.",
    challenge:
      "Lokaci na gaba da wani abu ya bata maka rai, rike kowace kalma mai tsauri na tsawon dakika sittin kafin ka amsa.",
    habit: "Juya lokacin fushi zuwa zikiri ko raka'a biyu na sallah a duk lokacin da za ku iya.",
  },
  {
    verseExcerpt: "Idan kun gode, zan ƙara muku.",
    challenge:
      "Godiya ga mutane uku daban-daban da sunan yau don wani takamaiman wani abu da suka yi muku.",
    habit:
      "Ƙare kowane dare ta hanyar lura da albarka guda ɗaya - layi ɗaya a cikin mujallar Munib.",
  },
  {
    verseExcerpt: "Kuma wanda ya yãfe kuma ya gyãra, to, sakamakonsa yana wurin Allah.",
    challenge: "Ka saki ɓacin rai ɗaya da kake ɗauka - sake shi da gaske, aƙalla cikin zuciyarka.",
    habit: "Ka yi wa wanda ya zalunce ka addu'a a maimakon ka sake maimaita cutar.",
  },
];

export const QURAN_GUIDE_TADABBUR_PROMPTS_HA: DeepPartial<QuranGuideTadabburPrompt>[] = [
  {
    question: "Menene Allah yake karantar dani acikin wannan aya?",
    hint: "Karanta ayar a hankali kuma ku lura da tubalan gininta: shin Allah yana ba da umarni, ko gargaɗi, ko alkawari, ko yana ba da labari? Wane sunansa yake amfani da shi, kuma menene wannan sunan ya bayyana game da yadda yake bi da mu a nan?",
  },
  {
    question: "Ta yaya zan iya amfani da wannan a yau a cikin wani takamaiman aiki?",
    hint: "Kudirin da ba su da kyau suna shuɗewa; takamaiman sanda. Juya ayar zuwa mataki guda ɗaya mai yiwuwa - zance ɗaya da za a yi, ɗabi'a ɗaya don farawa, zaɓi ɗaya da za a yi kafin ranar ta ƙare.",
  },
  {
    question: "Wace dabi'a zan inganta ko cirewa saboda wannan ayar?",
    hint: "Ka saukar da ayah zuwa ga ayyukanka na yau da kullun - barcinka, maganarka, ciyarwarka, addu'arka, dangantakarka. Wanne ne wannan ayar ta sanya yatsa a hankali?",
  },
  {
    question:
      "Shin wannan aya ta motsa ni zuwa ga fatan samun rahamar Allah ko kuma tsoron adalcinsa - kuma me yasa duka biyun suke da mahimmanci?",
    hint: "Mumini yana tafiya tsakanin khawfi (tsoron azabar Allah) da raja (da fatan rahamarSa), kamar fikafikai biyu. Tambayi wacce wannan ayar ta karfafa muku a yanzu, kuma ko zuciyarka tana bukatar karinsa.",
  },
  {
    question: "Yaya Annabi ﷺ ya rayu da wannan ayah?",
    hint: "An siffanta Annabi ﷺ a matsayin 'Qur'ani mai tafiya.' Duba ga sahihin seerah da tafsiri – Ibn Kathir ya kan kawo yadda ya kunshi aya – kuma ya dauki misalinsa a matsayin abin koyi a aikace.",
  },
  {
    question: "Wace addu'a ce wannan ayar ta zaburarwa?",
    hint: "Let the verse become a prayer. Ku roki Allah da kalmominku a cikin sujuda, domin abin da aya ta gindaya, kariya daga gargadi, ko rabon alkawari, ko taimakon da'a ga umarni.",
  },
];

export const QURAN_GUIDE_READING_LEVELS_HA: DeepPartial<QuranGuideReadingLevel>[] = [
  {
    title: "haruffan Larabci",
    summary:
      "Koyi don gane duk haruffa 28 a cikin keɓantaccen tsari kuma san kowane da suna. Wannan sanannen sananne ne - ganin harafi da ba da suna nan take - kuma shi ne ginshiƙin duk wani abu ya ginu a kai.",
    topics: ["Sunayen haruffa", "Siffofin asali", "Hanyar dama-zuwa-hagu"],
  },
  {
    title: "Siffofin haruffa",
    summary:
      "Gano cewa mafi yawan haruffa suna canza sura dangane da matsayinsu - farkon, tsakiya, ko ƙarshen kalma - saboda an haɗa Larabci kamar mai lanƙwasa. Koyi waɗanne ƴan haruffa ba su taɓa haɗawa da wanda ke bayansu ba.",
    topics: ["Rubutun da aka haɗa", "Haruffa marasa haɗin kai", "Alif, waw, ya variants"],
  },
  {
    title: "Harakat (wali)",
    summary:
      "Jagoran ƙananan alamomin da ke ba kowane harafi wasalinsa: fata (a), kasara (i), damma (u), sukun maras wasali, shadda mai ninki biyu, da ƙarshen tanween. Waɗannan alamomin su ne ke juya haruffan shiru zuwa kalmomin da za a iya karantawa.",
    topics: ["Gajeren wasali", "Sukun", "Shaddah biyu", "Tanween"],
  },
  {
    title: "Haɗa haruffa",
    summary:
      "Haɗa shi wuri ɗaya: haɗa haruffa da harakarsu zuwa harafi da gajerun kalmomi, karanta dama zuwa hagu. Haɗu da dokar harafin rana da wata wanda ke yanke shawarar yadda ake furta 'al-' a farkon kalma.",
    topics: ["Tsarin CV", "Maganganun gama gari", "Harafin Rana da wata"],
  },
  {
    title: "Karatun kalmomi",
    summary:
      "Ka fara zazzage ƙamus na ainihin Kur'ani sannu a hankali kuma daidai - farawa da Bismillah da lafazin fatiha da kake karantawa a kowace addu'a - ta yadda karatun ya haɗu da ibada tun farkon farawa.",
    topics: ["Kalmomi masu girma", "Bismillah", "Kalmomin Fatiha"],
  },
  {
    title: "Karatun ayoyi",
    summary:
      "Matsa har zuwa gajerun ayoyi na Juz Amma, ƙara wayar da kan tajwidi na asali da kuma inda za a dakata don numfashi (wakafi), koyaushe karanta tare da mai karantawa don haka kunnenka ya jagoranci harshenka.",
    topics: ["Juz Amma surah", "Alamar Waka", "Bin mai karatu"],
  },
  {
    title: "Karatu sosai",
    summary:
      "Isar da karatun sumul, amintacce tare da ka'idojin tajweed da aka yi amfani da su ta halitta. Tsayar da rabon yau da kullun kuma ci gaba da malami ko ƙwararren mai karantawa yana duba ku, tunda ana goge gogewa ta hanyar gyara mai gudana, ba a samu sau ɗaya ba a hagu.",
    topics: ["Rabon yau da kullun", "An yi amfani da dokokin Tajweed", "Ra'ayin malamai"],
  },
];

export const QURAN_GUIDE_QUIZ_HA: DeepPartial<QuranGuideQuizQuestion>[] = [
  {
    prompt: "Surori nawa (surori) ne a cikin Alkur'ani?",
    options: ["99", "114", "124", "144"],
    explanation:
      "Alkur'ani yana da surori 114, daga ayoyi uku zuwa 286. An tsara tsarinsu a cikin mus'hafi ta hanyar wahayi (tawqfi).",
  },
  {
    prompt: "Zuwa kashi nawa (juz) daidai ne aka raba Alkur'ani don karatun yau da kullun?",
    options: ["7", "12", "30", "60"],
    explanation:
      "Juz talatin. Karatun juz'i daya a rana yana kammala dukkan Al-Qur'ani a cikin wata guda - hanyar da ta fi dacewa ta gama khat a cikin Ramadan.",
  },
  {
    prompt: "Wace sura ce mafi tsawo a cikin Alqur'ani, mai ayoyi 286?",
    options: ["Al-Fatiha", "Al-Baqarah", "Ya-Sin", "An-Nas"],
    explanation:
      "Surah al-Baqarah is the longest, with 286 verses. Surar Madani ce mai tarin shari'a da shiriya.",
  },
  {
    prompt: "Gaskiya ko karya: Sura ta Makki wacce aka saukar kafin Hijira zuwa Madina.",
    options: ["Gaskiya", "Karya"],
    explanation:
      "An saukar da surorin Makki kafin Hijira kuma galibi suna mai da hankali kan imani da tauhidi; surorin Madani sun zo bayan kuma sukan ƙara doka da jagorancin al'umma.",
  },
  {
    prompt: "Wace sura ce ta kunshi ayoyin farko da aka saukar wa Annabi SAW a cikin kogon Hira?",
    options: ["Al-Fatiha", "Al'alak (Iqra)", "Al-Baqarah", "Al-Ikhlas"],
    explanation:
      "Saukar da farko ita ce ayoyin bude Suratul Alaq (96): 'Iqra' — Ka yi karatu da sunan Ubangijinka, Wanda Ya yi halitta.",
  },
  {
    prompt: "Kusan shekaru nawa aka saukar da Kur'ani?",
    options: ["shekaru 3", "shekaru 10", "shekaru 23", "shekaru 40"],
    explanation:
      "An saukar da Alkur'ani a hankali a hankali sama da shekaru 23 - 13 a Makkah da 10 a Madina - yana amsa abubuwan da suka faru da bukatu.",
  },
  {
    prompt:
      "Gaskiya ko karya: An fara saukar Alkur’ani ne a cikin watan Ramadan, a ranar Lailatul Kadri.",
    options: ["Gaskiya", "Karya"],
    explanation:
      "Allah ya ce an saukar da Alkur'ani a cikin Ramadan (2:185) a daren Lailatul kadari (97:1). Neman wannan dare babban falala ne.",
  },
  {
    prompt: "Wace sura ce ake karantawa a kowace raka'ah na sallar wuni?",
    options: ["Al-Ikhlas", "Al-Fatiha", "Al-Kawthar", "An-Nasr"],
    explanation:
      "Suratul Fatiha - ayoyi bakwai - ana karanta su a kowace raka'a ta sallah. 'Babu addu'a ga wanda bai karanta bukin littafi ba.",
  },
  {
    prompt: "Wace sura ce wacce ba ta fara da ''Bismillah ir-Rahman ir-Raheem''?",
    options: ["Al-Fatiha", "At-Tawbah", "Al-Ikhlas", "An-Nas"],
    explanation: "Suratul Tawbah (9) ita ce kadai surar da ba a bude ta da Basmala.",
  },
  {
    prompt: "A tajweed me mulkin Madd yake gudanarwa?",
    options: [
      "Haɗa haruffa biyu tare",
      "Mikewa (elongating) sautin wasali",
      "Amsar amsawar akan wasu haruffa",
      "Inda zan tsaya da numfashi",
    ],
    explanation:
      "Madd yana nufin shimfiɗa sautin wasali akan madd haruffa - alif (ا), waw (و), da ya (ي) - don adadin adadin ƙididdiga.",
  },
  {
    prompt:
      "Qalqalah shine haske mai amsawa 'bounce' wanda aka ba wa wanne nau'in haruffa lokacin da suke ɗaukar sukun?",
    options: ["ي ر م ل و ن", "ق ط ب ج د", "ء ه ع ح غ خ", "ا و ي"],
    explanation:
      "Ana tattara haruffan qalqalah guda biyar a cikin jimlar قُطْبُ جَدٍ — ق ط ب ج د - ana yi musu gyara mai tsafta lokacin da suke ɗaukar sukun.",
  },
  {
    prompt: "Lafazin Alqur'ani mai yawan gaske 'Rabb' (رَبّ) yana nufin:",
    options: ["Rahama", "Ubangiji, Jagora, Mai dorewa", "Littafi", "Lambuna"],
    explanation:
      "'Rabb' na nufin Ubangiji, Jagora, kuma Mai rayawa - wanda ya yi halitta, ya mallaka, rayarwa, da mulki. 'Rabbana' na nufin 'Ubangijinmu'.",
  },
  {
    prompt: "Kalmar 'Jannah' (جَنَّة) tana nufin:",
    options: ["Wuta", "Gidan Aljannah", "Addu'a", "Azumi"],
    explanation:
      "'Jannah' na nufin Aljanna - gidan lada na har abada, 'lambunan da koguna ke gudana daga karkashinsu'.",
  },
  {
    prompt: "Wane Annabi ne ya raya harsashin Ka'aba a Makkah tare da dansa Isma'il?",
    options: ["Nuhu", "Musa", "Ibrahim", "Yusuf"],
    explanation:
      "Ibrahim (Khalilullah, Abokin Allah) da Isma'il sun gina Ka'aba, suna masu addu'a 'Ubangijinmu, Ka kar6i wannan daga gare mu' (2:127).",
  },
  {
    prompt:
      "Wane Annabi ne ya yi magana kai tsaye da Allah, ya fuskanci Fir'auna, ya jagoranci Bani Isra'ila ƙetare tekun da ya raba?",
    options: ["Isa", "Musa", "Adamu", "Yunusa"],
    explanation:
      "Musa (Kalimullah) ya yi magana da Allah, aka aiko shi zuwa ga Fir’auna, kuma da iznin Allah teku ta rabu don haka mutanensa suka ketare lafiya.",
  },
  {
    prompt:
      "Wace sura ce ko gajeriyar nassi za ku sa a gaba don fahimta kuma ku haddace in shaa Allahu?",
    explanation:
      "Ƙananan matakai masu daidaituwa suna gina dangantaka ta rayuwa tare da Littafin Allah. Zaɓi ɓangaren ku, koyi ma'anarsa, kuma ku sake maimaita shi akai-akai.",
  },
];
