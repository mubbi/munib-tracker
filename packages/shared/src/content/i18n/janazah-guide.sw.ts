import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// sw overlay for janazah-guide. Index-aligned with JANAZAH_GUIDE_TOPICS in ../janazah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const JANAZAH_GUIDE_TOPICS_SW: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Wajibu wa jumuiya",
    summary: "Janazah ni fard kifayah — lazima jumuiya itimize.",
    body: [
      "Swala ya maiti (Swala ya Janazah) ni faradhi ya jumuia (fard kifayah): ikiwa baadhi ya umma huitekeleza, wajibu huondolewa kutoka kwa wengine; ikiwa hakuna anayefanya, wote wanashiriki lawama. Inaswaliwa kwa kusimama, bila rukuu au sujud - aina ya pekee miongoni mwa sala.",
      "Imepokewa kutoka kwa Abu Hurayrah kwamba Mtume wa Mwenyezi Mungu (ﷺ) amesema: \"Mwenye kuhudhuria mazishi mpaka Swalah iswaliwe basi atapata qirat (ya malipo), na atakayehudhuria mpaka maziko atakuwa na qirati mbili.\" Aliulizwa qirat ni nini, na akasema: 'Kama milima miwili mikubwa' (Sahih al-Bukhari 1325; Sahih Muslim 945).",
      "Kufuatia mazishi, kusaidia kuosha na kuzika kulingana na uwezo wa mtu, na kuomba dua kwa ajili ya marehemu ni miongoni mwa haki za Muislamu juu ya mwingine. Tibu mwili kwa heshima na epuka ubadhirifu au mazoea bila ushahidi.",
    ],
    actions: [
      "Jibu haraka mazishi yanapotangazwa katika jumuiya yako.",
      "Kusudi sala na mahudhurio kwa ajili ya Mwenyezi Mungu, na sio maonyesho ya kijamii.",
      "Msaada kwa mahitaji ya vitendo ya familia wakati unaweza kufanya hivyo kwa heshima.",
    ],
    hadith: [
      {
        excerpt:
          "Mwenye kuhudhuria mazishi mpaka aswali swalah atapata qirat moja, na atakayehudhuria mpaka kuzikwa atakuwa na qirati mbili - kila mmoja kama mlima mkubwa.",
      },
      {
        excerpt:
          "Atakayefuata mazishi ya Muislamu kwa imani na kutaka malipo, na akakaa mpaka Swalah ikamalizika, atarudi na qirati mbili...",
      },
    ],
  },
  {
    title: "Kuosha na kufunika",
    summary: "Ghusl ya marehemu na kafan sahili - hadhi bila ubadhirifu.",
    body: [
      "Waislamu wanaokufa (mbali na mashahidi wa uwanja wa vita katika sheria ya kitamaduni) huoshwa kwa kuosha kwa utakaso, kisha kuvikwa nguo safi nyeupe. Ummu Atiyyah amepokea kutoka kwa Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) kuhusu kuosha binti yake: “Muoshe mara tatu au tano, au zaidi ukiona inafaa, kwa maji na sidr, na weka kafuri au kafuri katika mwisho” (Sahih al-Bukhari 1253).",
      "Imepokewa kutoka kwa Aisha kwamba Mjumbe wa Mwenyezi Mungu (ﷺ) alikuwa amevikwa nguo tatu nyeupe za pamba za Yemeni, kati ya hizo hapakuwa na shati wala kilemba (Sahih al-Bukhari 1264; Sahih Muslim 941). Usahili ni sunna; maonyesho ya gharama kubwa yanapingana na mfano wa kinabii.",
      "Nani anafua nani, nguo ngapi za wanaume na wanawake, na maelezo yanayohusiana yana tofauti za madhhab. Familia zinapaswa kufuata mwongozo wa mahali ulipo au huduma ya mazishi inayofahamu mazoezi ya shule - muhtasari huu si mwongozo wa kunawa.",
    ],
    actions: [
      "Teua watu wanaoaminika wa jinsia sawa na marehemu inapowezekana.",
      "Weka sanda rahisi na safi - nguo nyeupe ni mfano wa kinabii.",
      "Epuka kupiga picha au kufichua mwili bila hitaji.",
    ],
    hadith: [
      {
        excerpt:
          "Mwoshe mara tatu, au tano, au zaidi ikiwa unaona kama ni lazima, kwa maji na sidr, na uweke kafuri au kafuri katika kuosha mara ya mwisho.",
      },
      {
        excerpt:
          "Mtume wa Mwenyezi Mungu ﷺ alikuwa amevikwa nguo tatu nyeupe za pamba za Yemen; hakuna shati wala kilemba miongoni mwao.",
      },
    ],
  },
  {
    title: "Wakati wa kufunga macho ya marehemu",
    summary: "Dua ya kinabii wakati wa kifo.",
    body: [
      "Umm Salamah amepokea kutoka kwa Mtume wa Mwenyezi Mungu (Swalla Allaahu ´alayhi wa sallam) alipomjia Abu Salamah macho yake yakiwa yametulia. Akavifunga na kusema: “Inapotwaliwa nafsi, maono yanaifuata,” na watu wa nyumba yake wakalia. Kisha akawafundisha kusema yaliyo mema tu, kwani Malaika husema amin kwa wanayoyasema, na akaomba dua kwa ajili ya Abu Salamah (Sahih Muslim 920).",
      "Ingizo lililounganishwa la Hisnul Muslim hapa chini linahifadhi maneno yanayotumika katika kufunga macho. Semeni kwa upole, jiepusheni na maombolezo aliyoyakataza Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam), na ushikishe ulimi kwa maneno mazuri na kuomba msamaha.",
    ],
    actions: ["Funga macho kwa upole na ufanye dua ya kweli.", "Ikumbushe familia kusema vizuri."],
    hadith: [
      {
        excerpt:
          "Macho ya Abu Salamah yalipokodoka, Mtume (Swalla Allaahu ´alayhi wa sallam) akayafumba na kusema kwamba inapotwaliwa nafsi macho huifuata, kisha akawafundisha watu wa nyumbani kuzungumza yaliyo mema tu.",
      },
    ],
  },
  {
    title: "Jinsi ya kuomba Janazah",
    summary: "Swala ya kisimamo yenye takbira nne - hakuna rukuu au sujudi.",
    body: [
      "Swala ya maiti inaswaliwa kwa kusimama. Hakuna rukuu, hakuna sujudi, na hakuna adhana wala iqamah. Imamu anasimama kichwani mwa marehemu mwanamume au katikati ya marehemu wa kike kwa mujibu wa riwaya kutoka kwa Anas na Samurah (tazama Abu Dawud 3194 na riwaya zinazohusiana), na mkusanyiko huunda safu nyuma.",
      "Swalah ina takbira nne. Baada ya ya kwanza, inasomwa Surat al-Fatihah (Bukhari 1335). Baada ya takbira, swala kwa Mtume ﷺ na dua kwa marehemu hufanywa. Swala inaisha kwa taslim. Jabir ameripoti kwamba Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) aliswali swala ya maiti ya Negus (mfalme wa Kihabeshi) na akatoa takbira nne (Sahih al-Bukhari 1334).",
      "Waliochelewa wanaokosa takbir wanapaswa kumfuata imamu na kukamilisha kile walichokosa kulingana na kanuni ya shule yao ya kukamata - waulize imamu au mwalimu wa ndani ikiwa huna uhakika.",
    ],
    actions: [
      "Simama kwa safu; usiiname wala usisujudu.",
      "Sema takbira nne pamoja na imamu.",
      "Toa dua ya dhati kwa marehemu baada ya takbir ifaayo.",
    ],
    hadith: [
      {
        excerpt: "Mtume ﷺ aliswali swala ya maiti ya Negus na akatoa takbira nne.",
      },
      {
        excerpt:
          "Ibn Abbas aliswali swala ya maiti na akasoma Fatihah akisema ni kutoka kwenye sunna.",
      },
    ],
  },
  {
    title: "Duas katika sala ya mazishi (mtu mzima)",
    summary: "Maneno Halisi ya Hisnul Muslim kwa ajili ya marehemu.",
    body: [
      "Baada ya takbira, moyo wa Janazah ni dua kwa marehemu - kumuomba Mwenyezi Mungu awasamehe, awarehemu, na awape Pepo. Maneno mengi sahihi yamehifadhiwa katika Hisnul Muslim kutoka kwa Mtume ﷺ.",
      "Fungua dua iliyounganishwa hapa chini ili kukariri kwa Kiarabu, unukuzi na maana. Unaweza kujifunza zaidi ya maneno moja ya kweli; uaminifu ni muhimu zaidi ya urefu.",
    ],
    actions: [
      "Kariri angalau dua moja halisi ya Janazah.",
      "Toa dua ya jumla kwa Waislamu wote waliofariki unapohudhuria.",
    ],
  },
  {
    title: "Dua zaidi za maombi ya mazishi",
    summary: "Maneno ya ziada ya kweli kutoka kwa Hisnul Muslim.",
    body: [
      "Hisnul Muslim anahifadhi maneno mengine ya sala ya mazishi yaliyofundishwa kutoka kwa Mtume ﷺ. Zitumie kwa kupokezana au ujifunze ile ambayo jumuiya yako inaifahamu vyema.",
      "Kwa mtoto aliyekufa, dua maalum humwomba Mwenyezi Mungu amfanye mtoto kuwa mtangulizi na malipo yaliyohifadhiwa kwa wazazi - tazama mada inayofuata.",
    ],
  },
  {
    title: "Maombi ya Mazishi dua #3",
    summary: "Maneno mengine ya kweli kwa mtu mzima aliyekufa.",
    body: [
      "Maneno zaidi ya Hisnul Muslim kwa sala ya mazishi. Isome baada ya takbir ifaayo kadri mazoezi ya imamu wako yanavyoruhusu.",
    ],
  },
  {
    title: "Maombi ya mazishi dua #4",
    summary: "Maneno ya nne ya kweli kutoka kwa koposi ya sunnah.",
    body: [
      "Hisnul Muslim inajumuisha dua hii ya ziada ya maombi ya mazishi. Chagua uhalisi na uwepo wa moyo juu ya kukusanya kila neno mara moja.",
    ],
  },
  {
    title: "Duas kwa mtoto aliyekufa",
    summary: "Dua mahususi za kinabii wakati marehemu ni mtoto.",
    body: [
      "Marehemu anapokuwa mtoto, dua za kweli zinamwomba Mwenyezi Mungu amjaalie mtoto kuwa ni hazina iliyohifadhiwa, mtangulizi, na muombezi aliyejibiwa kwa wazazi. Maandishi ya Hisnul Muslim hapa chini yanahifadhi maneno hayo.",
      "Ifariji familia kwa matumaini katika rehema ya Mwenyezi Mungu huku ukiepuka mila potofu. Muundo uleule wa Janazah wa takbir nne unatumika; yaliyomo katika dua ndio yanabadilika.",
    ],
    actions: [
      "Tumia dua maalum za mtoto inapofaa.",
      "Saidia wazazi walio na huzuni kwa uwepo na usaidizi halali.",
    ],
  },
  {
    title: "dua #2 ya mazishi ya Mtoto",
    summary: "Maneno ya Pili ya Hisnul Muslim kwa mtoto aliyekufa.",
    body: [
      "Maneno mengine sahihi kwa sala ya mazishi ya mtoto, yaliyohifadhiwa katika Hisnul Muslim.",
    ],
  },
  {
    title: "Mazishi na kaburi",
    summary: "Kushusha mwili, kuelekea kibla, na dua baada ya mazishi.",
    body: [
      'Marehemu amezikwa ardhini akitazama kibla, kwa heshima na bila kukawia zaidi ya yale ambayo matayarisho yanahitaji. Mtume (Swalla Allaahu \'alayhi wa aalihi wa sallam) akasema: "Fanya haraka na mazishi" (Swahiyh al-Bukhari 1315 - kuharakisha mazishi).',
      "Wakati wa kumweka marehemu kaburini, dua ya kweli huhifadhiwa katika Hisnul Muslim. Baada ya kuzikwa, Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) alikuwa akisimama kaburini na kusema: ‘Muombeeni msamaha ndugu yenu, na muombeni asimamishwe, kwani hivi sasa anaulizwa’ (Sunan Abi Daawuud 3221 – imetolewa daraja la Sahih na wanachuoni wengi wa baadae akiwemo al-Albani).",
      "Kujenga miundo ya mapambo juu ya makaburi, kuyapaka kwa ajili ya mapambo, au maandishi ambayo yanahimiza kutia chumvi yanaonywa dhidi yake katika ripoti za kweli. Weka alama rahisi ambapo sheria na desturi za eneo huruhusu kitambulisho.",
    ],
    hadith: [
      {
        excerpt:
          "Haraka na mazishi: ikiwa ni haki, mnaiharamishia kheri; ikiwa sivyo, mnaweka ubaya shingoni mwenu.",
      },
      {
        excerpt: "Muombee msamaha ndugu yako na umuombe awe imara, kwani sasa anaulizwa.",
      },
    ],
  },
  {
    title: "Baada ya kumzika marehemu",
    summary: "Dua kwa uthabiti kaburini.",
    body: [
      "Kusimama muda mfupi baada ya kuzikwa kuomba msamaha na uthabiti kwa marehemu kumethibiti kutoka kwa Mtume ﷺ (Abu Dawud 3221). Maneno ya Hisnul Muslim hapa chini ni ya baada ya mazishi.",
      "Sadaka inayoendelea, dua, na kutimiza matakwa ya halali ya marehemu huwanufaisha kwa idhini ya Mwenyezi Mungu - bila ya kubuni sherehe za kila mwaka ambazo hazina ushahidi.",
    ],
    actions: [
      "Fanya dua kaburini baada ya kuzikwa.",
      "Endelea dua na sadaqah ya faragha kwa marehemu.",
    ],
  },
  {
    title: "Kutembelea makaburi",
    summary: "Salamu za kinabii wakati wa kutembelea makaburi.",
    body: [
      "Kutembelea makaburi kunawakumbusha walio hai Akhera. Imepokewa kutoka kwa Buraidah kuwa Mtume wa Mwenyezi Mungu (Swalla Allaahu ‘alayhi wa aalihi wa sallam) alikuwa akiwafunza kusema wanapotoka kwenda makaburini: maamkio ya amani yawafikie watu wa maskani miongoni mwa waumini na Waislamu, akithibitisha kwamba Mwenyezi Mungu akipenda tutaungana nao na kutuombea kheri sisi na wao (Sahih Muslim 975; maneno pia katika Ibn Majah).",
      "Ingizo la Hisnul Muslim hapa chini linahifadhi salamu hiyo. Weka ziara bila kilio, kutafuta msaada kutoka kwa wafu, au mila bila ushahidi.",
    ],
    actions: [
      "Wasalimuni wenyeji wa makaburi kwa maneno ya kweli.",
      "Tafakari juu ya kifo na ufanye upya matendo ya haki.",
    ],
    hadith: [
      {
        excerpt:
          "Amani iwe juu yenu, enyi wakazi wa maskani miongoni mwa Waumini na Waislamu. Mwenyezi Mungu akipenda tutakuunganisha. Tunamuomba Mwenyezi Mungu kheri yetu na nyinyi.",
      },
    ],
  },
  {
    title: "Vikumbusho na makosa ya kawaida",
    summary: "Epuka kulia, kuchelewesha kwa maonyesho, na matambiko yasiyo na msingi.",
    body: [
      "Mtume ﷺ amekataza kuwalilia wafu huku akiruhusu huzuni ya machozi. Imepokewa kutoka kwa Abdullah bin Umar kwamba Sa'd bin Ubadah alilia kwenye mazishi na Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) akaeleza kwamba Mwenyezi Mungu haadhibu kwa machozi au huzuni ya moyo, bali kwa ajili ya hayo - na akaashiria kwenye ulimi wake (Sahih al-Bukhari 1304).",
      "Usichelewe kuzika kwa ajili ya mikusanyiko ya heshima, wala usitumie kwa anasa kwenye sanda na karamu huku ukiwasahau maskini. Usikariri au kujizoeza ubunifu unaohusishwa na mazishi bila msingi halisi. Rambirambi, dua ya utulivu, na usaidizi wa kivitendo kwa familia ndio njia ya sunnah.",
      "Mahudhurio ya wanawake kwenye sala na maziko yanazingatiwa kwa njia tofauti katika shule na zama; fuata mwongozo wenye kutegemeka wa wenyeji unaoheshimu huruma na mipaka ya kiunabii.",
    ],
    disclaimer:
      "Muhtasari wa elimu — si mwongozo wa mkurugenzi wa mazishi au fatwa. Mazoezi ya shule za mitaa kwa kuosha, kufunika, na sheria za makaburi lazima zidhibitishwe na watu waliohitimu.",
    actions: [
      "Onda bila kulia au usemi uliokatazwa.",
      "Haraka maziko ya heshima.",
      "Saidia familia kwa chakula na mambo bila kuwalemea kwa ubadhirifu.",
    ],
    hadith: [
      {
        excerpt:
          "Mwenyezi Mungu haadhibu kwa chozi la jicho au huzuni ya moyo, lakini Yeye huadhibu au hurehemu kwa hili - na akaashiria kwenye ulimi wake.",
      },
    ],
  },
  // --- v2 appended topics (keep index-aligned with English) ---
  {
    title: "Takbira kwa takbira — hatua za swala",
    summary: "Orodha ya vitendo ya takbira nne na kile kinachokuja kati yake.",
    body: [
      "Takbira ya kwanza: inua mikono (kulingana na shule yako), sema Allahu Akbar, kisha soma Surat al-Fatihah. Ibn Abbas alisome al-Fatihah katika swala ya maiti akasema ni kutoka sunnah (Sahih al-Bukhari 1335).",
      "Takbira ya pili: peleka salawat juu ya Mtume ﷺ — salawat ya Ibrahimiyya ileile inayotumika katika tashahhud inafundishwa sana kwa hatua hii. Takbira ya tatu: toa dua ya dhati kwa marehemu (maneno ya Hisnul Muslim katika mwongozo huu). Takbira ya nne: wanazuoni wengi hutoa dua fupi ya jumla, kisha wamaliza kwa taslim upande wa kulia (na kushoto, kulingana na shule).",
      "Hakuna rukuu, sujudi, wala kukaa. Simama muda wote. Ikiwa majanaza kadhaa yapo, Janazah moja yenye nia kwa wote inafanywa katika jamii nyingi — mfuateni imamu. Mahali pa salawat dhidi ya dua yanaweza kubadilika kidogo kwa madhhab; mfumo wa takbira nne ni wa pamoja.",
    ],
    madhhabNote:
      "Vitabu vya Hanafi, Maliki, Shafi'i, na Hanbali vinatofautiana iwapo mikono inainuliwa kila takbira na hasa lini dua husemwa. Mfuateni imamu aliye mbele yenu.",
    actions: [
      "Jifunze mpangilio wa takbira nne kabla ya kuhitaji.",
      "Kariri Fatihah, salawat, na angalau dua moja ya mazishi.",
    ],
    hadith: [
      {
        excerpt: "Ibn Abbas aliswali swala ya maiti na akasoma Fatihah akisema ni kutoka sunnah.",
      },
    ],
  },
  {
    title: "Dua kwa wanaume, wanawake, na watoto",
    summary: "Maneno yale yale ya kinabii — rekebisha viwakilishi vya Kiarabu kwa marehemu.",
    body: [
      "Hisnul Muslim (na makusanyo ya hadithi ya kale) hurekodi dua za Janazah hasa kwa umbo la kiume. Hilo halimaanishi dua tofauti 'iliyobuniwa' kwa wanawake. Wanazuoni wa jumla hufundisha kuwa unaweza kubaki na maneno ya kiume ukiwa na nia kwa mtu huyo, au — bora zaidi na kwa kawaida — ubadilishe sarufi ili ifanane na marehemu: لَهُ / هُ / هِ → لَهَا / هَا؛ عَبْدُكَ → أَمَتُكَ؛ ابْنُ أَمَتِكَ → ابْنَةُ أَمَتِكَ؛ na kwa mtoto wa kike اجْعَلْهُ → اجْعَلْهَا، شَفِيعًا مُجَابًا → شَفِيعَةً مُجَابَةً.",
      "Kwa mwanamke aliyefariki, wanazuoni wengine wanashauri uangalifu kwa kifungu 'mume bora kuliko mume wake' (زَوْجًا خَيْرًا مِنْ زَوْجِهَا), wakibainisha anaweza kuunganishwa tena na mumewe Peponi — unaweza kuacha kifungu hicho au kubaki na maneno ya jumla. Kwa watoto, tumia maingizo maalum ya Hisnul ya watoto (hisn-160, hisn-161) badala ya maandishi ya watu wazima yanayolenga msamaha pekee.",
      "Maneno ya pamoja 'wasamehe wanaume wetu na wanawake wetu' (hisn-157) tayari yanajumuisha jinsia zote bila kubadilisha. Hatubuni Kiarabu kipya zaidi ya kurekebisha sarufi ya maandishi sahihi — fungua dua ya mtu mzima iliyounganishwa kama msingi na utumie ramani ya viwakilishi hapo juu.",
    ],
    madhhabNote:
      "Kubaki na umbo la kiume kwa nia na kurekebisha umbo la kike vyote vinakubaliwa miongoni mwa wanazuoni wa jumla. Ukiwa na shaka, tumia hisn-157 (wanaume na wanawake) au muulize imamu.",
    actions: [
      "Fanya mazoezi ya kubadilisha viwakilishi vya kike katika dua unayokariri.",
      "Tumia dua maalum za watoto kwa wale ambao bado hawajafikia baligh.",
      "Pendekeza uhalali kuliko vijitabu virefu visivyothibitishwa.",
    ],
    appLinks: [{ label: "Dua ya mazishi ya mtu mzima #1" }],
  },
  {
    title: "Mashahidi, kuharibika kwa mimba, na hali maalum",
    summary: "Wakati hukumu za kuosha au Janazah zinapotofautiana na hali ya kawaida.",
    body: [
      "Mashahidi wa uwanja wa vita wanaokufa vitani, katika hukumu ya kale inayotokana na Uhud, huzikwa katika nguo zao bila ghusl ya kawaida; Mtume ﷺ aliamuru mashahidi wa Uhud wazikwe pamoja na damu zao bila kuoshwa (Sahih al-Bukhari 1346). Makundi mengine yanayoitwa 'mashahidi' katika thawabu (k.m. tauni, kuzama) kwa kawaida huoshwa na hupata Janazah — mwulize mwanazuoni katika hali za pembeni.",
      "Kwa kuharibika kwa mimba au mtoto aliyezaliwa amekufa, shule zinotofautiana lini swala ya maiti na kuosha kamili hutumika (mara nyingi kunahusiana na iwapo umbo linalotambulika au hatua ya kuvuta roho imeonekana). Hadithi inahimiza kuswali juu ya mimba iliyoharibika na kutafuta msamaha na rehema kwa wazazi (Abu Dawud 3180). Fuata kamati ya mazishi ya madhhab yako badala ya kukisia.",
      "Ndugu wasio Waislamu hawapewi swala ya Janazah ya Kiislamu; wema, msaada wa kisheria wa kuzika inapohitajika, na huzuni binafsi ni tofauti na swala ya ibada kwa waumini. Thibitisha daima hali maalum kwa mwongozo wa ndani wenye sifa.",
    ],
    madhhabNote:
      "Ufafanuzi wa ushahidi wa uwanja wa vita, hatua za kuharibika kwa mimba, na swala juu ya mtoto aliyezaliwa amekufa hutofautiana kwa shule. Mada hii inaonyesha masuala — si fatwa.",
    disclaimer:
      "Hukumu maalum ni nyeti. Thibitisha na mwanazuoni mwenye sifa au huduma ya mazishi ya jamii yako kabla ya kutenda.",
    actions: [
      "Usimuoshe shahidi wa uwanja wa vita kinyume cha maagizo ya wanazuoni.",
      "Uliza kamati ya mazishi kuhusu kesi za kuharibika kwa mimba au kuzaliwa amekufa.",
    ],
    hadith: [
      {
        excerpt: "Mtume ﷺ aliamuru mashahidi wa Uhud wazikwe pamoja na damu zao, na hawakuoshwa.",
      },
      {
        excerpt:
          "Swala ya maiti hutolewa juu ya mimba iliyoharibika, na wazazi huombelea msamaha na rehema.",
      },
    ],
  },
  {
    title: "Janazah bila kuwepo kwa mwili",
    summary: "Mtume ﷺ alimsvalia Negus wakati mwili ulikuwa mbali.",
    body: [
      "Jabir aliripoti kwamba Mtume ﷺ alitoka kwa Masahaba wake, akawaweka safu, na akatoa takbira nne kwa Negus (al-Najashi), mfalme wa Kihabeshi aliyekufa nje (Sahih al-Bukhari 1334; Sahih Muslim 952). Hii ndiyo dalili kuu ya Salat al-Janazah bila kuwepo (alā al-ghā'ib).",
      "Shule zinotofautiana jinsi ya kutumia mfano huo kwa upana: baadhi huupunguza kwa hali kama za Negus (hakuna swala ya Kiislamu ya ndani), wengine huruhusu zaidi mwili ukiwa mbali. Usiruke Janazah ya ndani mwili ukiwepo na jamii inaweza kuswali. Fuata mwanazuoni wa ndani anayeaminika kwa lini swala bila kuwepo inafaa katika shule yako.",
      "Umbo ni swala ileile ya takbira nne; nia ni kwa marehemu asiye po. Tumia dua zile zile sahihi, ukirekebisha jinsia inapohitajika.",
    ],
    madhhabNote:
      "Wigo wa Janazah bila kuwepo ni tofauti inayojulikana. Pendekeza mazoea ya mamu wenye sifa katika jamii yako.",
    actions: [
      "Sali ndani kila mwili ukiwepo.",
      "Uliza kabla ya kuandaa Janazah bila kuwepo kama tukio la umma.",
    ],
    hadith: [
      {
        excerpt: "Mtume ﷺ aliswali swala ya maiti kwa Negus na akatoa takbira nne.",
      },
      {
        excerpt:
          "Mtume wa Allah ﷺ aliwaweka Masahaba safu na akamsvalia Negus, akitoa takbira nne.",
      },
    ],
  },
  {
    title: "Kwenye kitanda cha kifo — maneno ya mwisho",
    summary: "Mhimiza mwenye kufa aseme la ilaha illallah kwa upole.",
    body: [
      "Mtume ﷺ alisema: 'Wahimizeni wanaokufa wenu waseme la ilaha illallah' (Sahih Muslim 916; Abu Dawud 3117). Hisnul Muslim inahifadhi maagizo kwamba yeyote maneno yake ya mwisho yakiwa 'Hakuna anayestahiki kuabudiwa isipokuwa Allah' ataingia Peponi (hisn-153, kutoka Abu Dawud 3116).",
      "Himiza kwa upole bila ukali; usilazimishe wala kubishana. Walio karibu na kifo wanaweza pia kufarijiwa kwa maneno sahihi ya matumaini yaliyohifadhiwa katika Hisnul Muslim (hisn-150–152). Funga macho roho inapochukuliwa na utumie dua ya kufunga macho (mada iliyotangulia).",
      "Epuka kilio kikubwa na hotuba inayomkasirisha Allah. Watu wa nyumbani waseme yaliyo mema, kwa maana malaika husema amin kwa maneno yao (Sahih Muslim 920).",
    ],
    actions: [
      "Kwa upole mkumbushe mwenye kufa shahadah.",
      "Weka chumba kimya na kikiwa na hotuba njema.",
    ],
    hadith: [
      {
        excerpt: "Wahimizeni wanaokufa wenu waseme: la ilaha illallah.",
      },
      {
        excerpt:
          "Yeyote maneno yake ya mwisho yakiwa 'Hakuna anayestahiki kuabudiwa isipokuwa Allah' ataingia Peponi.",
      },
    ],
    appLinks: [{ label: "Dua za matumaini ya maisha" }, { label: "Kufunga macho" }],
  },
  {
    title: "Pole na waliofiwa",
    summary: "Wafariji walio hai kwa dua ya kinabii ya msiba.",
    body: [
      "Umm Salamah aliripoti kwamba Mtume wa Allah ﷺ alisema: 'Hakuna Mwislamu anayepatwa na msiba kisha akasema aliyoamrishwa na Allah — \"Sisi ni wa Allah na kwake Tunarejea. Ewe Allah, nijaze thawabu katika msiba wangu na unibadilishie kitu bora\" — ila Allah atambadilishia kitu bora' (Sahih Muslim 918). Hisnul Muslim inahifadhi maneno haya (hisn-154).",
      "Toa pole kwa maneno mafupi ya kweli; andaa chakula kwa familia ya marehemu badala ya kuwakabidhi mzigo wa kuwaandaa wageni (Abu Dawud 3132 — ripoti kuhusu familia ya Ja'far). Epuka sherehe za uvumbuzi za siku zilizowekwa bila dalili huku ukiendelea na dua ya faragha, sadaqah, na wema.",
      "Huzuni yenye machozi inaruhusiwa; kilio, kupiga mashavu, na kurarua nguo vilikatazwa. Saidia wajane, mayatima, na wategemezi kwa msaada wa halali baada ya kuzika.",
    ],
    actions: [
      "Wafundishe waliofiwa dua ya msiba.",
      "Saidia kwa chakula na shughuli badala ya kutarajia karamu.",
      "Endelea na dua tulivu na sadaqah kwa marehemu.",
    ],
    hadith: [
      {
        excerpt:
          "Hakuna Mwislamu anayepatwa na msiba akasema maneno yaliyoamrishwa ya kurejea kwa Allah na akaomba badala bora, ila Allah humbadilishia bora.",
      },
    ],
    appLinks: [{ label: "Malengo ya sadaqah" }],
  },
];
