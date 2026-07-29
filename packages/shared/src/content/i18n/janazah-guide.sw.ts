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
];
