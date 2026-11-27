import type { SahabaProfile } from "../../types/sahaba";
import type { DeepPartial } from "./localize";

// sw overlay for sahaba. Index-aligned with SAHABA_PROFILES in ../sahaba.ts.
export const SAHABA_PROFILES_SW: DeepPartial<SahabaProfile>[] = [
  {
    name: "Abu Bakr as-Siddiq",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 573 – 13 H / 634 M",
    summary:
      "Rafiki wa karibu zaidi wa Mtume ﷺ na mwanamume mzima wa kwanza kuamini, aliyekuwa Khalifa wa kwanza na kuushikilia pamoja umma changa baada ya kifo chake.",
    body: "Abu Bakr alikuwa mfanyabiashara wa Makka mwenye kuheshimika na rafiki wa muda mrefu zaidi wa Mtume ﷺ, tangu kabla ya wahyi kuanza. Mtume ﷺ alipomsimulia safari ya usiku kwenda Yerusalemu na zaidi ya hapo (al-Isra wal-Mi'raj), Abu Bakr alimwamini papo hapo bila kuomba ushahidi — ndiyo sababu aliitwa as-Siddiq, 'yule anayeusadikisha ukweli.' Alitumia sehemu kubwa ya mali yake kuwakomboa watumwa Waislamu waliokuwa wakiteswa, na miongoni mwa waumini wa mwanzo kabisa, yeye ndiye aliyewaleta watu wengi zaidi kwenye Uislamu kupitia da'wah yake mwenyewe.\n\nAlikuwa mwenzi pekee wa Mtume ﷺ katika Hijra, akijificha pamoja naye ndani ya Pango la Thawr huku Maquraishi wakiwatafuta nje — tukio ambalo Qur'ani inalikumbuka moja kwa moja: \"…yeye ni wapili kati ya wawili… pindi alipomwambia rafiki Yake… «Usihuzunike, Mungu Yupo pamoja na sisi»\" (Qur'ani 9:40). Mtume ﷺ alipougua ugonjwa wake wa mwisho, Abu Bakr alichaguliwa kuongoza swala mahali pake, na baada ya kifo chake Abu Bakr aliituliza Madina iliyojaa huzuni kwa maneno yaliyorekodiwa katika Sahih al-Bukhari 1242: \"Whoever used to worship Muhammad, then Muhammad has died; but whoever worships Allah, then Allah is Ever-Living and never dies.\" (maana kwa Kiingereza)\n\nAkiwa Khalifa wa kwanza, alipigana vita vya Ridda ili kuuzuia umma dhaifu usisambaratike, na baada ya wahifadhi wengi wa Qur'ani kuuawa vitani, alimwamuru Zayd bin Thabit aikusanye Qur'ani katika mkusanyiko mmoja (Sahih al-Bukhari 4986) — hatua ya kwanza kuelekea Msahafu ambao Waislamu wanausoma leo. Funzo: ikhlasi isiyohitaji kubishaniwa ili iamini, na uthabiti unaoishikilia jamii pamoja wakati ambapo imejawa na hofu zaidi.",
  },
  {
    name: "Umar bin al-Khattab",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 584 – 23 H / 644 M",
    summary:
      "Aliitwa al-Faruq — yule anayepambanua kati ya haki na batili — alitoka kuwa adui mkali wa Uislamu hadi kuwa Khalifa wake wa pili na mjenzi wa dola ya haki na yenye nidhamu.",
    body: "Kabla ya Uislamu, Umar alijulikana kote Makka kwa nguvu zake za mwili na hasira kali, na alikuwa miongoni mwa wapinzani wakali zaidi wa dini hiyo mpya. Seerah ya kitamaduni inasimulia kwamba kusilimu kwake kulikuja baada ya kusikia watu wa nyumba ya dada yake wakisoma Surat Taha na kuguswa na uzuri wake — aliingia Uislamu muda mfupi baadaye, na tangu siku hiyo msimamo wa Waislamu mbele ya mateso ya Maquraishi ukawa wa ujasiri zaidi waziwazi, kwa kuwa mmoja wa wanaume wao wenye nguvu zaidi sasa alisimama pamoja nao hadharani.\n\nAkiwa Khalifa wa pili, Umar alijenga sehemu kubwa ya mfumo wa dola ya haki: alianzisha daftari la umma (diwan) la posho, aliteua magavana aliowawajibisha yeye mwenyewe, na akaanzisha kalenda ya Hijria ili tarehe za mambo ya umma zihesabiwe kuanzia mwaka wa Hijra. Licha ya kutawala dola iliyokuwa ikipanuka kwa kasi, alijulikana kwa kutembea mitaa ya Madina usiku akiwa amevaa joho lenye viraka ili kuwaangalia wahitaji yeye mwenyewe, bila mlinzi wala taadhima.\n\nAlichomwa kisu na mtu mwenye kinyongo alipokuwa akiongoza swala ya Alfajiri mwaka 23 H, na akiwa kitandani karibu kufariki aliteua baraza la masahaba sita wakubwa ili wamchague mrithi wake badala ya kumtaja mmoja yeye mwenyewe. Funzo: mamlaka yanayoshikwa kwa unyenyekevu, na dhamira inayoelekea daima kwa walio dhaifu zaidi katika jamii — hiyo ndiyo maana ya kweli zaidi ambayo kwayo 'alipambanua' haki na batili.",
  },
  {
    name: "Uthman bin Affan",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 576 – 35 H / 656 M",
    summary:
      "Anajulikana kama Dhun-Nurayn kwa kuwaoa binti wawili wa Mtume ﷺ; Khalifa wa tatu mwenye haya na mkarimu aliyeupa umma nakala moja sanifu ya Qur'ani.",
    body: "Uthman alikuwa miongoni mwa waliosilimu mwanzo kabisa na miongoni mwa matajiri zaidi wao, na ukarimu wake ukawa wa kupigiwa mfano — anakumbukwa kwa kununua kisima cha Rumah ili watu wa Madina wapate maji bure, na kwa kugharimia sehemu kubwa ya jeshi la safari ngumu ya Tabuk. Alimuoa Ruqayyah binti wa Mtume ﷺ, na baada ya kifo chake akamuoa dada yake Umm Kulthum, hivyo akapata lakabu ya Dhun-Nurayn, 'mwenye nuru mbili.'\n\nHaya yake ilikuwa kubwa kiasi kwamba siku moja Mtume ﷺ aliketi sawasawa na kuyatengeneza mavazi yake hasa Uthman alipowasili, ingawa hakufanya hivyo kwa Abu Bakr wala Umar muda mfupi kabla; Aisha alipomuuliza sababu, alijibu: \"Should I not feel shy of a man whom even the angels feel shy of?\" (maana kwa Kiingereza) (Sahih Muslim 2401). Akiwa Khalifa wa tatu, alipopata habari kwamba mikoa tofauti ilikuwa ikisoma Qur'ani kwa maneno yanayotofautiana kidogo, alimpa Zayd bin Thabit na kamati ndogo jukumu la kutengeneza nakala kuu sanifu kutoka kwenye msahafu wa Hafsa, na akapeleka moja katika kila eneo kubwa (Sahih al-Bukhari 4987) — Msahafu wa Uthman ambao ndio msingi wa Msahafu unaotumika duniani kote leo.\n\nMiaka yake ya mwisho ilikumbwa na machafuko ya kisiasa yaliyozidi kuongezeka, yaliyoishia kwa kuuawa kwake mwaka 35 H alipokuwa ameketi akisoma Qur'ani nyumbani kwake — tukio lenye uchungu linaloelezwa katika muktadha wake wa kihistoria kwenye ratiba ya historia ya Kiislamu. Funzo hapa ni rahisi zaidi: haya ya hali ya juu na ukarimu wa mkono wazi, pamoja na nidhamu ya kukihifadhi Kitabu cha Mwenyezi Mungu katika muundo mmoja thabiti kwa kila kizazi kilichokuja baada yake.",
  },
  {
    name: "Ali bin Abi Talib",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 601 – 40 H / 661 M",
    summary:
      "Binamu na mkwe wa Mtume ﷺ, aliyelelewa nyumbani kwake tangu utotoni, akawa Khalifa wa nne na kielelezo cha ushujaa uliounganika na elimu.",
    body: 'Nyumba ya Abu Talib ilipokumbwa na hali ngumu, Mtume ﷺ — kabla ya kupewa utume — alimchukua binamu yake mdogo Ali nyumbani kwake ili kupunguza mzigo, na Ali akakua akimtazama kwa karibu miaka kadhaa kabla ya wahyi wa kwanza. Alikuwa miongoni mwa watu wa kwanza kabisa kuukubali Uislamu, akiwa bado mtoto, na baadaye akamuoa Fatimah binti wa Mtume ﷺ.\n\nUshujaa wake ulionekana mapema na mara kwa mara: usiku wa Hijra alilala kitandani mwa Mtume ﷺ ili wanaomfuatilia wadhani Mtume ﷺ bado yuko nyumbani, na alibeba bendera ya Waislamu katika ushindi wa Khaybar. Mtume ﷺ alipoondoka kwenda Tabuk na kumwacha Ali asimamie Madina, Ali alihofia kwamba hilo lilionekana kama kutengwa; Mtume ﷺ alimtuliza: "Will you not be pleased that you will be to me like Aaron to Musa? But there will be no prophet after me" (maana kwa Kiingereza) (Sahih al-Bukhari 4416, Sahih Muslim 2404) — ulinganisho na uwakilishi wa muda wa Harun kwa Musa, si dai la utume.\n\nAkiwa Khalifa wa nne, Ali alirithi jamii iliyokwisha tikiswa na kuuawa kwa Uthman, na alitumia sehemu kubwa ya utawala wake akijaribu kuishikilia pamoja kupitia migogoro ya ndani ya Ngamia na Siffin, inayoelezwa kwa kina katika ratiba ya historia ya Kiislamu. Alipigwa pigo la kifo na muuaji wa Kikhawarij alipokuwa akiswali katika msikiti wa Kufa mwaka 40 H. Funzo: elimu, ushujaa, na uaminifu kwa watu wa nyumba ya Mtume ﷺ vinaheshimiwa pamoja katika maisha yake, na hata kiongozi aliyeongoka anaweza kukabiliwa na mgawanyiko ambao hakuuchagua.',
  },
  {
    name: "Talha bin Ubaydullah",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 594 – 36 H / 656 M",
    summary:
      "Mmoja wa kumi walioahidiwa Pepo, aliyeitwa 'Talha Mwema' kwa ukarimu wake, aliyemkinga Mtume ﷺ kwa mwili wake mwenyewe huko Uhud.",
    body: "Talha aliukubali Uislamu katika siku zake za mwanzo kabisa kupitia da'wah ya Abu Bakr, na kwa sababu hiyo Maquraishi walimfunga kwa muda mfupi akiwa amefungwa pamoja naye. Baadaye akawa mmoja wa wanaume matajiri zaidi Madina kupitia biashara, na alijulikana kwa kutumia mali hiyo kwa ukarimu kwa maskini na kwa familia za mashahidi.\n\nKatika Vita vya Uhud, safu za Waislamu zilipovunjika na Mtume ﷺ akabaki wazi mbele ya adui, Talha alijiweka mbele yake na kupokea pigo baada ya pigo lililokusudiwa kwa Mtume ﷺ, hadi akapoteza kabisa uwezo wa kutumia baadhi ya vidole vyake. Wafasiri kama Ibn Kathir wanauhusisha uaminifu wa aina hii wenye gharama kubwa na Qur'ani 33:23, inayowasifu \"…wanaume waliotekeleza ahadi zao walizomuahidi Mwenyezi Mungu…\". Alikuwa mmoja wa masahaba tisa waliotajwa katika hadithi ya Kumi Walioahidiwa Pepo (Jami' at-Tirmidhi 3747, riwaya hasan).\n\nAliuawa katika mgogoro wa ndani wa Ngamia mwaka 36 H, tukio lenye uchungu katika historia ya umma ambalo ratiba ya historia ya Kiislamu inalieleza bila kuegemea upande wowote. Funzo: ukarimu wa kweli una gharama, iwe ni mali inayotolewa au mwili unaowekwa kati ya hatari na mtu unayempenda.",
  },
  {
    name: "Az-Zubayr bin al-Awwam",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 594 – 36 H / 656 M",
    summary:
      "Binamu wa Mtume ﷺ ambaye, akiwa kijana mdogo, inasemekana alikuwa wa kwanza kuchomoa upanga wake kuutetea Uislamu.",
    body: "Az-Zubayr alikuwa bado mvulana wa takriban miaka kumi na tano aliposikia uvumi kwamba Mtume ﷺ ameuawa Makka, akakimbia mitaani akiwa ameshika upanga tayari kupigana — Mtume ﷺ, akiwa salama, baadaye alitabasamu kwa ari yake, tukio linalojulikana sana katika seerah ya kitamaduni. Alikua na kuwa mmoja wa wapiganaji hodari zaidi wa jamii, akishiriki Badr, Uhud, Handaki, na Khaybar, na akamuoa Asma binti Abi Bakr, dada wa Aisha.\n\nAlitajwa miongoni mwa Kumi Walioahidiwa Pepo katika hadithi iliyosimuliwa na Sa'id bin Zayd (Jami' at-Tirmidhi 3747), na mwanawe Abdullah bin az-Zubayr baadaye alijulikana kwa uchaji na ushujaa wake mwenyewe. Az-Zubayr anakumbukwa kwa kutafakari kwa kina nafasi yake katika mgogoro wa Ngamia na kujiondoa vitani kabla hajauawa mwaka 36 H — wakati ambao wanahistoria wanauchukulia kama kitendo cha dhamira katikati ya mzozo wa ndani wa kusikitisha.\n\nFunzo: ushujaa wa ujanani unaodumu hadi uzeeni unastahili kupongezwa, lakini vivyo hivyo unyenyekevu wa kurudi nyuma na kufikiri upya pale vita havitumikii tena ukweli.",
  },
  {
    name: "Abdur-Rahman bin Awf",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 581 – 32 H / 652 M",
    summary:
      "Muhajiri asiye na chochote aliyekuwa mfanyabiashara aliyefanikiwa zaidi Madina na mmoja wa wafadhili wakubwa zaidi wa jamii.",
    body: "Abdur-Rahman aliwasili Madina baada ya Hijra bila chochote. Mtume ﷺ alipowaunganisha Muhajirina na Ansari wenyeji katika vifungo vya udugu, ndugu yake Sa'd bin ar-Rabi' alijitolea kugawana naye mali yake na hata mmoja wa wake zake; Abdur-Rahman alimshukuru lakini akaomba tu aonyeshwe soko (Sahih al-Bukhari 3780). Kupitia biashara akawa mmoja wa wanaume matajiri zaidi Madina, na akaitumia mali hiyo kugharimia safari za kijeshi, kuwakomboa watumwa, na kuwasaidia maskini kwa kiwango kikubwa.\n\nYeye ndiye sahaba aliyesimulia moja kwa moja hadithi ya Kumi Walioahidiwa Pepo, ambamo Mtume ﷺ alimtaja miongoni mwa kumi hao (Jami' at-Tirmidhi 3747). Baadaye, Khalifa Umar alipokuwa karibu kufariki na kuteua baraza la masahaba sita wakubwa ili wamchague Khalifa ajaye, alikuwa Abdur-Rahman aliyeongoza mashauriano yaliyoishia kwa kuchaguliwa kwa Uthman — akikataa kwa makusudi kujipendekeza yeye mwenyewe.\n\nFunzo: mali ni amana ya kuchumwa kwa uaminifu na kutumiwa kwa ukarimu, na uongozi wa kweli wakati mwingine humaanisha kujiweka kando na mamlaka ili kufanya uamuzi wa haki kwa ajili ya wengine.",
  },
  {
    name: "Sa'd bin Abi Waqqas",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 595 – 55 H / 675 M",
    summary:
      "Mmoja wa waliosilimu mapema, anayesemekana kuwa mtu wa kwanza kurusha mshale katika njia ya Mwenyezi Mungu, baadaye jemadari aliyeongoza ufunguzi wa Uajemi.",
    body: "Sa'd aliukubali Uislamu akiwa kijana Makka licha ya upinzani mkali wa mama yake; wafasiri wa kitamaduni wanauhusisha shinikizo la familia yake juu yake na mafundisho ya Qur'ani kwamba muumini lazima bado awatendee wazazi wema, bila kuwatii kamwe katika ukafiri (Qur'ani 29:8, 31:15). Alipigana Badr, Uhud, na Handaki, na alijulikana maisha yake yote kwa ustadi wake wa upinde.\n\nAlitajwa miongoni mwa Kumi Walioahidiwa Pepo (Jami' at-Tirmidhi 3747). Miongo kadhaa baadaye, chini ya Khalifa Umar, Sa'd aliongoza majeshi ya Waislamu katika vita vya maamuzi vya al-Qadisiyyah dhidi ya Dola ya Kisasani, akifungua njia ya ufunguzi wa Iraki, na baadaye akaasisi mji wa kambi ya kijeshi wa Kufa.\n\nFunzo: subira na familia yenye changamoto bila kamwe kuiacha imani yako, na ustadi uliojengwa mapema maishani kutumika baadaye kuhudumia jamii nzima.",
  },
  {
    name: "Sa'id bin Zayd",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 594 – 51 H / 671 M",
    summary:
      "Sahaba ambaye yeye mwenyewe alisimulia hadithi inayowataja Kumi Walioahidiwa Pepo, kutoka katika familia iliyokuwa tayari ikitafuta tawhidi safi kabla ya Uislamu.",
    body: "Baba yake Sa'id, Zayd bin Amr, alijulikana kabla ya utume wa Mtume ﷺ kama hanif — mtu aliyekuwa amekataa masanamu ya Makka akitafuta imani safi ya Ibrahim, ingawa hakuishi kuuona Uislamu wenyewe. Sa'id alikua katika roho hiyo hiyo, akasilimu mapema, na akamuoa Fatimah binti al-Khattab, dada wa Umar. Alishiriki karibu kila vita vikubwa vya mwanzo vya jamii ya Waislamu.\n\nNafasi yake ya kudumu katika kumbukumbu za historia inatokana na tukio la uadilifu rahisi: mtu mmoja katika msikiti wa Kufa alipomzungumzia Ali kwa dharau, Sa'id alisimama na kushuhudia mbele ya mkusanyiko kwamba yeye mwenyewe alimsikia Mtume ﷺ akiwataja masahaba kumi — Abu Bakr, Umar, Uthman, Ali, Talha, az-Zubayr, Abdur-Rahman bin Awf, Sa'd bin Abi Waqqas, Abu Ubaydah, na, alipobanwa amtaje wa kumi, yeye mwenyewe — kuwa ni watu wa Peponi (Jami' at-Tirmidhi 3747).\n\nFunzo: kurekebisha dharau dhidi ya yeyote kati ya masahaba wa Mtume ﷺ kunahitaji ushahidi wa utulivu na wenye msingi imara badala ya hasira — ukweli unaotetewa kwa dalili, si kwa jazba.",
  },
  {
    name: "Abu Ubaydah bin al-Jarrah",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 583 – 18 H / 639 M",
    summary:
      "Aliyeitwa na Mtume ﷺ 'mwaminifu wa umma huu', jemadari mpole lakini thabiti aliyeongoza ufunguzi wa Sham.",
    body: 'Abu Ubaydah alikuwa mmoja wa waliosilimu mapema aliyepigana Badr na kila vita vikubwa vilivyofuata, akijulikana daima kwa upole wake na kutegemewa kwake kikamilifu. Ujumbe kutoka Yemen ulipomwomba Mtume ﷺ awatumie mtu mwaminifu wa kuwafundisha, alimshika mkono Abu Ubaydah na kusema: "Every nation has a trustworthy man, and the trustworthy man of this nation is Abu Ubaydah ibn al-Jarrah" (maana kwa Kiingereza) (Sahih al-Bukhari 7255).\n\nChini ya Makhalifa Abu Bakr na Umar, aliongoza majeshi ya Waislamu yaliyoiteka Dameski na sehemu kubwa ya Sham, akiyatawala maeneo mapya kwa uadilifu ule ule ambao Mtume ﷺ aliusifu ndani yake. Alifariki katika tauni ya Amwas mwaka 18 H akiwa bado anahudumu Sham, pamoja na masahaba wengine wengi.\n\nFunzo: uaminifu — kuwa mtu ambaye wengine wanaweza kumkabidhi majukumu yao nyeti zaidi bila kusita — ni wenyewe cheo cha heshima katika Uislamu, katika daraja moja na ushujaa au ukarimu.',
  },
  {
    name: "Hamza bin Abdul-Muttalib",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 568 – 3 H / 625 M",
    summary:
      "Ami yake Mtume ﷺ aliyekaribiana naye kwa umri, aliyejulikana kama Asadullah, 'Simba wa Mwenyezi Mungu,' baada ya kusilimu.",
    body: "Hamza alikuwa mkubwa kwa miaka michache tu kuliko mpwa wake, Mtume ﷺ, na alikua karibu naye. Aliukubali Uislamu katika miaka ya mwanzo ya Makka na, alipofanya hivyo, akawa mmoja wa watetezi wa jamii changa ya Waislamu walioogopwa zaidi na Maquraishi — maarufu kwa kumkabili Abu Jahl hadharani baada ya kusikia kwamba alimtukana Mtume ﷺ.\n\nAlipigana Badr kwa umahiri na akafa shahidi mwaka uliofuata katika Vita vya Uhud, mojawapo ya misiba yenye uchungu zaidi katika maisha ya Mtume ﷺ; mwili wake ulitendewa ukatili mkubwa na adui mara baada ya vita, jambo ambalo Mtume ﷺ baadaye alilisamehe badala ya kulipiza kisasi kwa namna hiyo hiyo.\n\nFunzo: kufa shahidi katika maisha haya si kushindwa bali ni kukamilika kwa msimamo uliokwisha chukuliwa — kifo cha Hamza kilimhuzunisha Mtume ﷺ sana, lakini hakikudhoofisha azma ya jamii aliyosaidia kuilinda.",
  },
  {
    name: "Zayd bin Harithah",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 581 – 8 H / 629 M",
    summary:
      "Mtumwa aliyeachwa huru na mwana wa kulelewa wa Mtume ﷺ, na sahaba pekee aliyetajwa kwa jina lake moja kwa moja ndani ya Qur'ani.",
    body: "Zayd alipewa Mtume ﷺ kabla ya wahyi kuanza, na Mtume ﷺ akamwacha huru na kumlea kama mwanawe mwenyewe. Baba mzazi wa Zayd alipokuja baadaye kumtafuta na kujitolea kumkomboa moja kwa moja, Zayd alichagua kubaki — uaminifu ambao Mtume ﷺ hakuusahau kamwe. Alikuwa miongoni mwa waliosilimu mwanzo kabisa.\n\nBaada ya wahyi kufafanua kwamba kumlea mtoto hakumfanyi kuwa ndugu wa damu kwa madhumuni ya sheria za mirathi au ndoa, Zayd anatajwa moja kwa moja — \"Basi Zayd alipomaliza haja yake kwa Zaynab…\" (Qur'ani 33:37) — jambo linalomfanya kuwa sahaba pekee anayetajwa kwa jina lake mwenyewe popote katika Qur'ani. Baadaye alichaguliwa na Mtume ﷺ kuwa amiri wa kwanza wa jeshi la Waislamu huko Mu'tah, mbele ya wanaume wenye hadhi kubwa zaidi kikabila, na akafa shahidi huko mwaka 8 H.\n\nFunzo: katika Uislamu, ukaribu na Mtume ﷺ na uongozi katika jamii havikuwahi kutegemea nasaba — uaminifu wa kweli na uwezo vilitangulia, hata kwa mtu aliyewahi kuwa mtumwa.",
  },
  {
    name: "Ja'far bin Abi Talib",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 590 – 8 H / 629 M",
    summary:
      "Kaka mkubwa wa Ali, aliyechaguliwa kuwaongoza wakimbizi Waislamu huko Uhabeshi na kuzungumza kwa niaba yao mbele ya mfalme wake Mkristo.",
    body: "Ja'far, binamu wa Mtume ﷺ, alikuwa miongoni mwa kundi lililohamia Uhabeshi kukimbia mateso ya Makka — hijra ya kwanza katika historia ya Kiislamu. Maquraishi walipotuma wajumbe kumtaka Negus (an-Najashi) awarudishe wakimbizi hao, alikuwa Ja'far aliyezungumza kwa niaba ya Waislamu, akieleza jinsi Uislamu ulivyowatoa katika ujinga na ukatili hadi kwenye rehema na ukweli, na akasoma aya za Surat Maryam kuhusu kuzaliwa kwa Nabii Isa. Negus aliguswa hadi akatokwa na machozi, na akakataa kuwakabidhi.\n\nBaadaye Ja'far alirudi kupigania jamii ya Waislamu na akafa shahidi katika Vita vya Mu'tah mwaka 8 H; inasimuliwa kwamba aliendelea kushika bendera hata baada ya kupoteza mikono yake yote miwili vitani, jambo lililompa katika kumbukumbu za baadaye lakabu ya heshima 'mwenye mbawa mbili.'\n\nFunzo: hoja yenye nguvu zaidi kwa ajili ya jamii iliyodhulumiwa inaweza kuwa tabia njema na ukweli ulio wazi, unaozungumzwa kwa heshima badala ya hasira — na ujasiri unaosimama imara hata kwa gharama kubwa kabisa.",
  },
  {
    name: "Al-Abbas bin Abdul-Muttalib",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 566 – 32 H / 653 M",
    summary:
      "Ami yake Mtume ﷺ, mzee wa Makka mwenye kuheshimika aliyewasaidia Waislamu kimyakimya kwa miaka mingi kabla ya kutangaza imani yake waziwazi.",
    body: "Al-Abbas alisimamia huduma tukufu ya kuwapa maji mahujaji wa Al-Ka'ba (siqayah), cheo chenye hadhi halisi Makka, na alitumia ushawishi wake kumlinda mpwa wake na jamii ya Waislamu hata wakati Maquraishi walipoendelea kuwa na uadui. Alikuwepo, kwa siri, katika Kiapo cha Pili cha al-Aqabah, akijiridhisha kwamba wanaume wa Yathrib walikusudia kwa dhati kumlinda Mtume ﷺ kabla ya kuruhusu makubaliano yaendelee.\n\nKusilimu kwake kwa kawaida kunawekwa muda mfupi kabla ya Ufunguzi wa Makka, na baada ya hapo aliihudumia jamii waziwazi; vizazi vyake baadaye viliasisi nasaba ya Bani Abbas (Abbasiyya), vizazi kadhaa baada ya kipindi kinachoelezwa hapa.\n\nFunzo: kuunga mkono ukweli kunaweza kuchukua sura ya subira na ya nyuma ya pazia muda mrefu kabla ya kuwa tangazo la hadhara — tahadhari ya Al-Abbas iliwalinda watu hata wakati imani yake mwenyewe ilipokuwa bado ikikomaa.",
  },
  {
    name: "Al-Hasan bin Ali",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "3 – 50 H / 625 – 670 M",
    summary:
      "Mjukuu mkubwa wa Mtume ﷺ, ambaye alitabiri kwamba siku moja angeyapatanisha makundi mawili ya Waislamu yaliyogawanyika.",
    body: 'Al-Hasan alizaliwa Madina kwa Ali na Fatimah na alipendwa sana na babu yake, Mtume ﷺ, aliyekuwa akimbeba na kucheza naye waziwazi mbele ya jamii. Siku moja, akizungumza kutoka mimbarini huku Al-Hasan ameketi kando yake, Mtume ﷺ alisema: "This son of mine is a chief (sayyid), and perhaps Allah will bring about reconciliation between two great groups of Muslims through him" (maana kwa Kiingereza) (Sahih al-Bukhari 3746).\n\nUtabiri huo ulitimia karibu miongo mitatu baadaye: baada ya Ali kuuawa mwaka 40 H, Al-Hasan alipewa kiapo cha utii kama Khalifa, lakini ndani ya miezi michache, alipoona jamii ikigawanyika na umwagaji damu zaidi ukikaribia, alijiuzulu kwa hiari yake kwa ajili ya umoja — mwaka huo ukaja kujulikana kama Aam al-Jama\'ah, Mwaka wa Umoja, na unaashiria mwisho wa kipindi cha Makhalifa Waongofu (Rashidun) kinachoelezwa kwenye ratiba ya historia ya Kiislamu.\n\nFunzo: wakati mwingine aina yenye nguvu zaidi ya uongozi ni kujua wakati wa kuachia mamlaka kwa ajili ya amani ya jamii pana.',
  },
  {
    name: "Al-Husayn bin Ali",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "4 – 61 H / 626 – 680 M",
    summary:
      "Mjukuu mdogo wa Mtume ﷺ, ambaye maisha yake katika kipindi kinachoelezwa hapa yalikuwa ya ibada ya utulivu ndani ya nyumba ya babu yake.",
    body: 'Al-Husayn alizaliwa Madina mwaka mmoja baada ya kaka yake Al-Hasan, na wavulana hao wawili walilelewa kwa mapenzi ya karibu kabisa na Mtume ﷺ, ambaye inasimuliwa alisema kuhusu wote wawili: "Whoever loves them has loved me, and whoever hates them has hated me" (maana kwa Kiingereza) — kauli inayojulikana sana ya huruma aliyowaonyesha wajukuu wake.\n\nKatika kipindi kinachoelezwa na ratiba hii — hadi mwisho wa ukhalifa wa Rashidun mwaka 41 H — Al-Husayn aliishi kwa kiasi kikubwa ndani ya nyumba ya baba yake Ali huko Kufa na Madina, kijana aliyejitolea kwa swala na elimu, ambaye bado hakuwa mtu wa kisiasa wa hadhara; matukio ambayo kwayo anakumbukwa zaidi yalitokea katika kipindi cha baadaye cha Bani Umayya na yako nje ya wigo huu wa mwanzo.\n\nFunzo la miaka hii ni rahisi: nyumba iliyojengwa juu ya mapenzi kwa Mtume ﷺ na ibada ya dhati, inayoishiwa kwa utulivu, yenyewe ni msingi — muda mrefu kabla mtihani wowote wa hadhara haujafika.',
  },
  {
    name: "Khadijah binti Khuwaylid",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 555 – 619 M",
    summary:
      "Mke wa kwanza wa Mtume ﷺ na mtu wa kwanza kabisa kumwamini, mfanyabiashara wa Makka aliyefanikiwa kwa haki yake mwenyewe.",
    body: "Khadijah alikuwa mfanyabiashara mwanamke mwenye kuheshimika aliyemwajiri kijana Muhammad ﷺ — aliyekwisha julikana kote Makka kama al-Amin ('mwaminifu') — kuongoza msafara wake wa biashara kwenda Sham. Akivutiwa na uaminifu wake, alipendekeza ndoa; yeye alikuwa na takriban miaka arobaini na Muhammad ﷺ takriban ishirini na mitano, na ndoa yao ikawa ushirikiano wa mapenzi ya kina uliodumu takriban miaka ishirini na mitano.\n\nWahyi wa kwanza ulipomwacha akitetemeka, alikuwa Khadijah aliyemfunika, kumtuliza, na kumpeleka kwa binamu yake msomi Waraqah bin Nawfal kwa uthibitisho — akawa binadamu wa kwanza kuamini utume wake, kabla ya mwanamume yeyote. Baadaye Mtume ﷺ alisema: \"The best of the women of her time was Mary, daughter of Imran, and the best of the women of her time was Khadija, daughter of Khuwailid\" (maana kwa Kiingereza) (Sahih al-Bukhari 3432, Sahih Muslim 2430).\n\nAlimzalia watoto wake na kumsaidia katika miaka migumu zaidi ya mateso, hadi kifo chake muda mfupi kabla ya Hijra, katika kile Mtume ﷺ alichokiita Mwaka wa Huzuni. Funzo: imani na msaada usioyumba na usio na masharti, katika wakati ambapo ukweli ni mgumu zaidi kuutetea, ni urithi unaodumu kuliko maisha ya aliyeutoa.",
  },
  {
    name: "Aisha binti Abi Bakr",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 613/614 – 58 H / 678 M",
    summary:
      "Binti wa Abu Bakr na mke wa Mtume ﷺ, aliyekuwa mmoja wa walimu muhimu zaidi wa sheria ya Kiislamu baada ya kifo chake.",
    body: "Aisha aliolewa na Mtume ﷺ huko Madina baada ya Hijra, na kwa maelezo yake mwenyewe, alikuwa kipenzi chake zaidi kuliko watu wote: sahaba mmoja alipomuuliza ni nani anayempenda zaidi, alijibu kwa urahisi, \"Aisha,\" na miongoni mwa wanaume akamtaja baba yake, Abu Bakr (Sahih al-Bukhari 4358, Sahih Muslim 2384). Uvumi wa kashfa ulipoenezwa dhidi yake wakati wa safari moja, Qur'ani yenyewe iliteremka kumtakasa kwa urefu (Qur'ani 24:11–26), kifungu ambacho bado kinasomwa leo kama ushahidi wa kutokuwa na hatia kwake.\n\nBaada ya kifo cha Mtume ﷺ, Aisha akawa mmoja wa vyanzo vikuu vya elimu vya umma: yeye ni mmoja wa wapokezi wa hadithi wanaonukuliwa zaidi katika historia ya Kiislamu, na wanachuoni wa baadaye na hata masahaba wakubwa walikuwa wakimwuliza mara kwa mara kuhusu mambo ya sheria, tiba, na mwenendo wa faragha wa Mtume ﷺ ambao ni watu wa nyumbani kwake tu wangeweza kuujua.\n\nFunzo: ukaribu na Mtume ﷺ nyumbani kwake ukawa, baada ya kifo chake, maisha yote ya huduma ya hadhara kwa uelewa wa umma kuhusu dini yake — huzuni iliyogeuzwa kuwa miongo ya kufundisha.",
  },
  {
    name: "Fatimah binti Muhammad",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 605 – 11 H / 632 M",
    summary:
      "Binti mdogo wa Mtume ﷺ na mtoto wake wa karibu zaidi aliyebaki hai, ambaye alimweleza kuwa kiongozi wa wanawake wa Peponi.",
    body: 'Fatimah alikua akishuhudia miaka migumu zaidi ya mateso Makka kando ya baba yake, na aliendelea kuwa mmoja wa watu wa karibu zaidi naye katika maisha yake yote. Aliolewa na Ali bin Abi Talib na akamzalia Al-Hasan na Al-Husayn, ambao Mtume ﷺ aliwapenda sana.\n\nMtume ﷺ alisema kumhusu: "Fatimah is the leader of the women of the people of Paradise" (maana kwa Kiingereza) (Sahih al-Bukhari 3624), na Aisha alisimulia kwamba kati ya watu wote, mwendo na mazungumzo ya Fatimah ndiyo yaliyofanana zaidi na ya baba yake. Aliishi miezi michache tu baada ya kifo cha Mtume ﷺ mwaka 11 H, akiwa na huzuni kubwa kwa kumpoteza.\n\nFunzo: maisha yaliyotumika katika ibada ya utulivu kwa familia na kwa Mwenyezi Mungu, bila kutafuta cheo cha hadhara, yalimpa Fatimah sifa ya heshima isiyo na mfano miongoni mwa wanawake — ushahidi kwamba ukubwa mbele ya Mwenyezi Mungu haupimwi kwa kuonekana kidunia.',
  },
  {
    name: "Hafsa binti Umar",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 605 – 45 H / 665 M",
    summary:
      "Binti wa Umar na mke wa Mtume ﷺ, aliyekabidhiwa kwa miaka mingi msahafu mkuu wa Qur'ani.",
    body: "Hafsa alifiwa na mume akiwa bado kijana — mume wake wa kwanza alikuwa ameuawa katika Vita vya Badr — na Mtume ﷺ akamuoa muda mfupi baadaye, kwa sehemu ili kuisaidia familia ya sahaba iliyokuwa katika dhiki. Alijulikana kwa kufunga swaumu mara kwa mara na kuswali usiku.\n\nBaada ya Ukhalifa wa Abu Bakr, msahafu mmoja uliokusanywa ambao Zayd bin Thabit aliuandaa ulihifadhiwa chini ya uangalizi wa Hafsa — kwanza wakati wa Ukhalifa wa Umar na kisha wa Uthman — hadi Uthman alipouazima rasmi ili kutengeneza nakala kuu sanifu zilizotumwa katika dola yote, kisha akamrudishia nakala asili (Sahih al-Bukhari 4987, Sahih al-Bukhari 7191).\n\nFunzo: kukabidhiwa kitu cha thamani — kwake yeye, kihalisi Kitabu cha Mwenyezi Mungu katika muundo wake wa kwanza kabisa wa maandishi — ni yenyewe aina ya huduma kwa umma mzima, iliyotekelezwa kimyakimya kwa miaka mingi.",
  },
  {
    name: "Umm Salama (Hind binti Abi Umayyah)",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 596 – 62 H / 681 M",
    summary:
      "Mke wa Mtume ﷺ ambaye ushauri wake wa utulivu ulitatua mvutano mkali katika Mkataba wa Hudaybiyyah.",
    body: "Umm Salama alikuwa amehamia Uhabeshi katika miaka ya mwanzo kabisa ya mateso, na baadaye Madina pamoja na mume wake wa kwanza, Abu Salama; baada ya kifo chake kutokana na majeraha aliyopata vitani, Mtume ﷺ alimuoa. Alijulikana katika maisha yake yote marefu kwa busara yake, na mara nyingi Mtume ﷺ mwenyewe alitaka ushauri wake moja kwa moja.\n\nHuko Hudaybiyyah, masahaba walipovunjika moyo sana kwa masharti ya mapatano na wakawa wazito kutii agizo la Mtume ﷺ la kutoka katika hali ya ihram na kuchinja wanyama wao, alikuwa Umm Salama aliyemshauri, kwa mujibu wa seerah, afanye yeye mwenyewe kwanza bila kurudia amri — walipomwona akitenda, masahaba walifuata mara moja.\n\nFunzo: ushauri wa busara, unaotolewa faraghani na kufanyiwa kazi kwa unyenyekevu, unaweza kutatua mgogoro ambao maagizo ya moja kwa moja peke yake yasingeweza.",
  },
  {
    name: "Sumayyah binti Khayyat",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "alifariki takriban 615 M",
    summary: "Shahidi wa kwanza wa Uislamu, aliyeuawa Makka kwa kukataa kuiacha imani yake.",
    body: "Sumayyah alikuwa mtumwa wa ukoo mmoja wa Makka pamoja na mume wake Yasir na mwana wao Ammar. Imani ya wazi ya familia hiyo ilipoamsha hasira ya Abu Jahl na viongozi wengine wa Maquraishi, waliteswa hadharani katika jaribio la kuwalazimisha kuikana. Simulizi za kitamaduni za seerah (Ibn Ishaq kupitia Ibn Hisham) zinaeleza kwamba Sumayyah alikataa hadi mwisho na akauawa kwa sababu hiyo, hivyo akawa mtu wa kwanza kufa kwa ajili ya Uislamu.\n\nHakuwa na mali, wala ulinzi wa kikabila, wala nguvu yoyote katika mpangilio wa kijamii wa Makka — alikuwa na imani yake tu. Mume wake Yasir naye alifariki kutokana na mateso hayo, na mwana wao Ammar aliendelea kuishi na kuwa mmoja wa masahaba walioheshimiwa zaidi katika miaka ya baadaye.\n\nFunzo: gharama ya mwanzo na nzito zaidi ya kusimama kwa ajili ya ukweli iliwaangukia wale waliokuwa na nguvu ndogo zaidi za kidunia za kujitetea, na uthabiti wao unakumbukwa hasa kwa sababu haukuomba chochote kama malipo.",
  },
  {
    name: "Nusaybah binti Ka'b (Umm Ammarah)",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "alifariki baada ya 11 H / 632 M",
    summary:
      "Sahaba wa Madina aliyepigana ana kwa ana kumtetea Mtume ﷺ huko Uhud baada ya safu za Waislamu kuvunjika.",
    body: "Nusaybah alikuwa amekuja Uhud, kama walivyofanya wanawake kadhaa, kuleta maji na kuwahudumia majeruhi. Mwelekeo wa vita ulipobadilika na Mtume ﷺ ghafla akawa wazi na hatarini, alichukua upanga na ngao na kupigana pamoja na kikundi kidogo kilichokuwa kikimlinda moja kwa moja, akipata majeraha katika hali hiyo; simulizi za kihistoria (Ibn Sa'd, Ibn Hisham) zinaeleza kwamba baadaye Mtume ﷺ aliusifu ushujaa wake kwa kumtaja kwa jina.\n\nBaadaye alipigana tena katika vita vya Ridda dhidi ya makabila yaliyoritadi baada ya kifo cha Mtume ﷺ, na akapoteza mkono mmoja katika Vita vya Yamama.\n\nFunzo: kuutetea ukweli hakukuwahi kuwekewa mipaka ya jinsia katika jamii ya kwanza ya Waislamu — utayari wa Nusaybah kuingia hatarini katika wakati wa maamuzi unasimama sambamba na wa Ansari yeyote aliyepigana siku hiyo.",
  },
  {
    name: "Bilal bin Rabah",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 580 – 20 H / 641 M",
    summary:
      "Sahaba Mhabeshi aliyekuwa mtumwa zamani, aliyekuwa muadhini wa kwanza wa Uislamu, akiadhini kwa ombi la Mtume ﷺ mwenyewe.",
    body: 'Bilal alikuwa mtumwa Makka na aliteswa vikali na bwana wake Umayyah bin Khalaf kwa kuukubali Uislamu; alilazimishwa kulala juu ya mchanga unaounguza chini ya jiwe zito huku akirudia tu "Ahad, Ahad" (Mmoja, Mmoja) — akikataa kuukana upweke wa Mwenyezi Mungu hata katika mateso. Abu Bakr alimnunua na kumwacha huru, na akawa mmoja wa waabudu waliojitolea zaidi katika jamii.\n\nAdhana ilipowekwa Madina, Mtume ﷺ alimchagua Bilal kwa sauti yake nzuri ili aadhini, kazi aliyoishikilia kwa maisha yote yaliyobaki ya Mtume ﷺ. Katika swala ya Alfajiri asubuhi moja, Mtume ﷺ alimwambia: "Tell me of the best deed you did after embracing Islam, for I heard your footsteps in front of me in Paradise" (maana kwa Kiingereza); Bilal alijibu kwamba hakuwahi kutenguka udhu wake bila kuswali mara moja swala yoyote ya sunna aliyoiweza (Sahih al-Bukhari 1149).\n\nFunzo: si hadhi ya kijamii ya kuzaliwa wala mateso ya zamani yanayoamua nafasi ya mtu mbele ya Mwenyezi Mungu — ibada ya faragha iliyodumishwa ilimpatia Bilal sifa ya heshima kutoka kwa Mtume ﷺ mwenyewe.',
  },
  {
    name: "Salman al-Farisi",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 568 – 33 H / 654 M",
    summary:
      "Mtafuta ukweli kutoka Uajemi ambaye safari yake ndefu kupitia jamii mbalimbali za kidini hatimaye ilimfikisha kwenye Uislamu huko Madina.",
    body: "Salman aliiacha nchi yake ya Uajemi akitafuta dini ya kweli, akisoma kwa miaka mingi chini ya mfululizo wa watawa wa Kikristo ambao, mmoja baada ya mwingine walipokaribia kufa, walimwelekeza mbele kuelekea nabii wa mwisho aliyetarajiwa kudhihiri Uarabuni. Akiwa amefanywa mtumwa njiani, hatimaye alifika Madina, akazitambua kwa Mtume ﷺ ishara alizoambiwa azitafute, kisha akakombolewa na kupokelewa katika jamii, kama ilivyoelezwa katika seerah ya kitamaduni ya maisha yake.\n\nWakati wa kuzingirwa kwa Madina kunakojulikana kama Vita vya Handaki, alikuwa Salman aliyependekeza kuchimba handaki pana la kujihami kuzunguka njia za mji zilizokuwa wazi — mbinu isiyojulikana kwa Waarabu — iliyolikwamisha jeshi la muungano hadi likaondoka.\n\nFunzo: kutafuta ukweli kwa dhati na kwa subira kunaheshimiwa bila kujali mtu ameanzia wapi, na hekima inastahili kuchukuliwa popote inapopatikana — Mtume ﷺ alikubali kwa urahisi ushauri wa mgeni badala ya desturi ya wenyeji iliyozoeleka.",
  },
  {
    name: "Abu Dharr al-Ghifari",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "alifariki 32 H / 653 M",
    summary:
      "Miongoni mwa waliosilimu mwanzo kabisa, anayejulikana kwa ukweli wa wazi bila kuficha na kwa kutojali mali kwa uzuhdi.",
    body: 'Abu Dharr inasemekana alikuwa mmoja wa watu wachache wa kwanza kabisa kuukubali Uislamu; alisafiri hadi Makka mahsusi kuchunguza habari za nabii mpya, na akatangaza imani yake huko waziwazi licha ya hatari, kabla ya kurudi kuliita kabila lake kwenye dini hiyo.\n\nBaadaye alihamia Madina na akashiriki katika kampeni nyingi, lakini aliendelea kujulikana katika maisha yake yote kwa mwenendo wake wa wazi usiolegeza msimamo na kutoridhika kwake sana na ulimbikizaji wa mali aliouona ukiongezeka katika dola ya Kiislamu iliyokuwa ikipanuka. Mtume ﷺ alimpa nasaha ambayo Abu Dharr aliishikilia kwa maisha yake yote: "Fear Allah wherever you are, follow a bad deed with a good deed and it will erase it, and treat people with good character" (maana kwa Kiingereza) (Jami\' at-Tirmidhi 1987, riwaya hasan-sahih).\n\nFunzo: taqwa ya kudumu — kumcha Mwenyezi Mungu katika kila hali — pamoja na tabia njema kwa wengine, ni kanuni rahisi ya maisha ya uadilifu bila kujali hulka ya mtu au nafasi yake.',
  },
  {
    name: "Mus'ab bin Umayr",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "alifariki 3 H / 625 M",
    summary:
      "Kijana tajiri wa Makka aliyeacha maisha ya starehe ili kuwa mwalimu wa kwanza wa Uislamu aliyetumwa Madina.",
    body: "Kabla ya Uislamu, Mus'ab alijulikana Makka kama mmoja wa vijana waliovaa kwa umaridadi zaidi, kutoka familia yenye neema. Baada ya kuukubali Uislamu alivumilia kupoteza starehe na hadhi hiyo bila kulalamika, na ujumbe wa kwanza kutoka Yathrib ulipoikubali imani huko al-Aqabah, Mtume ﷺ alimtuma Mus'ab arudi pamoja nao kama mlinganiaji na mwalimu wa kwanza wa Uislamu — kupitia mafundisho yake ya subira, imani ilienea haraka katika nyumba za mji uliokuja kuwa Madina.\n\nAlikufa shahidi akiitetea bendera ya Mtume ﷺ katika Vita vya Uhud. Baadaye, masahaba hawakupata kitu cha kumkafini isipokuwa joho moja dogo lenye mistari; walipofunika kichwa chake miguu ilionekana, na walipofunika miguu yake kichwa kilionekana, hivyo Mtume ﷺ akawaagiza wafunike kichwa chake na kuweka majani ya idhkhir juu ya miguu yake (Sahih al-Bukhari 1276/3914, Sahih Muslim 940). Khabbab bin al-Aratt, akikumbuka tukio hili, alisema kwamba baadhi ya masahaba kama Mus'ab walifariki bila kuonja chochote cha malipo ya dunia hii, huku wengine wakiishi kufurahia matunda ya kile walichokijenga.\n\nFunzo: starehe za dunia zinazoachwa kwa ajili ya Mwenyezi Mungu, na maisha yaliyotumika kuwafundisha wengine kwa subira, yanaweza kuwa muhimu zaidi kuliko jinsi mtu anavyokumbukwa mwishoni kabisa.",
  },
  {
    name: "Abdullah bin Mas'ud",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 594 – 32 H / 653 M",
    summary:
      "Mvulana mchungaji mdogo na mwembamba wa Makka aliyekuwa mmoja wa wasomaji na walimu wakubwa zaidi wa Qur'ani.",
    body: "Ibn Mas'ud alikuwa akifanya kazi ya uchungaji alipokutana kwa mara ya kwanza na Mtume ﷺ na Abu Bakr, waliomwomba maziwa; alisilimu mapema muda mfupi baadaye na alikuwa mmoja wa watu wa kwanza kusoma Qur'ani hadharani na waziwazi Makka, kwa hatari halisi kwake mwenyewe.\n\nUmbo lake jembamba liliwahi kuwa sababu ya baadhi ya masahaba kucheka alipopanda mti kwa ombi la Mtume ﷺ na miguu yake myembamba ikaonekana; Mtume ﷺ aliwarekebisha mara moja, akisema kwamba mguu wa Abdullah utakuwa mzito zaidi kwenye mizani Siku ya Kiyama kuliko Mlima Uhud (Musnad Ahmad 920, pia katika al-Adab al-Mufrad 237). Katika tukio jingine Mtume ﷺ aliwaambia masahaba: \"Take (learn) the Qur'an from four: Abdullah ibn Mas'ud, Salim, Mu'adh, and Ubay ibn Ka'b\" (maana kwa Kiingereza) (Sahih al-Bukhari 4999), akimtaja kwanza miongoni mwa wasomaji bora wa jamii.\n\nFunzo: umbo la mwili halina uhusiano wowote na uzito mbele ya Mwenyezi Mungu — kujitolea kwa dhati kwa Qur'ani, kunakobebwa na mtu ambaye wengine wangeweza kumpuuza, kunaweza kuwa na uzito kuliko mlima.",
  },
  {
    name: "Abu Hurayrah",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 598 – 59 H / 679 M",
    summary:
      "Aliyesilimu baadaye kutoka Yemen, akawa msimulizi aliyepokeza kwa wingi zaidi kuliko wote maneno ya Mtume ﷺ yaliyohifadhiwa leo.",
    body: "Abu Hurayrah aliukubali Uislamu katika mwaka wa saba baada ya Hijra na, badala ya kutafuta mali au cheo, alichagua kutumia muda wake mwingi kuhudhuria vikao vya Mtume ﷺ, akihifadhi alichokisikia kwa bidii isiyo ya kawaida — baadaye alisema kwamba alijitolea kwa jambo hilo wakati wengine walikuwa wakishughulika na kilimo au biashara.\n\nUsikivu huo wa kudumu ulimaanisha kwamba, kati ya masahaba wote, yeye ndiye aliyepokeza idadi kubwa zaidi ya hadithi zilizohifadhiwa katika mikusanyiko mikuu — ukweli uliothibitika vyema katika elimu ya hadithi na wa msingi katika jinsi vizazi vya baadaye vilivyokuja kuujua kwa undani mwongozo wa Mtume ﷺ. Baadaye alihudumu kama gavana wa Bahrain na kisha wa Madina chini ya Umar na Uthman.\n\nFunzo: kuchagua kutanguliza kujifunza na kuhifadhi elimu, hata kwa gharama ya maendeleo ya kidunia, kunaweza kuacha urithi unaonufaisha kila kizazi kinachofuata.",
  },
  {
    name: "Khalid bin al-Walid",
    epithet: "Mwenyezi Mungu awe radhi naye",
    lifespan: "takriban 585 – 21 H / 642 M",
    summary:
      "Jemadari hodari wa Maquraishi aliyepigana dhidi ya Waislamu huko Uhud kabla ya kuukubali Uislamu na kuwa mmoja wa majemadari wake bora zaidi.",
    body: "Kabla ya kusilimu, Khalid aliongoza shambulizi la wapanda farasi lililovunja upande wa wapiga mishale wa Waislamu huko Uhud, likigeuza ushindi uliokaribia kuwa kushindwa kwa gharama kubwa kwa Waislamu. Miaka kadhaa baadaye, baada ya Mkataba wa Hudaybiyyah kufungua kipindi cha mawasiliano tulivu zaidi kati ya pande hizo mbili, aliukubali Uislamu na akasafiri hadi Madina kujiunga na Mtume ﷺ.\n\nKatika Vita vya Mu'tah, baada ya majemadari wote watatu wa Waislamu walioteuliwa kufa shahidi mmoja baada ya mwingine, Khalid alichukua uongozi kwa hiari yake na akaongoza kurudi nyuma kwa mpangilio na ustadi kulikookoa jeshi lisiangamizwe; akieleza habari za vita hivyo baadaye, Mtume ﷺ ameripotiwa kuusifu mwenendo wake huko, na kutokana na hilo Khalid akaja kukumbukwa kama 'Sayfullah,' Upanga wa Mwenyezi Mungu. Baadaye aliongoza kampeni za maamuzi wakati wa vita vya Ridda na ufunguzi wa mwanzo wa Iraki na Sham chini ya Abu Bakr na Umar.\n\nFunzo: toba ya kweli na kubadilisha upande kunaweza kuelekeza hata ujuzi mkali zaidi wa mtu kikamilifu kwenye wema — upinzani wa zamani dhidi ya ukweli si kizuizi cha kudumu pindi moyo unapogeuka.",
  },
];
