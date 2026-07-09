// Swahili translation overlay for the Learn Aqeedah content. Mirrors the order of
// its English source in ../aqeedah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { AqeedahGlossaryTerm, AqeedahTopic } from "../../types/aqeedah";
import type { DeepPartial } from "./localize";

export const AQEDAH_TOPICS_SW: DeepPartial<AqeedahTopic>[] = [
  {
    title: "Utangulizi",
    summary: "Aqiydah ndio msingi wa imani ambao hutengeneza ibada, tabia na madhumuni.",
    body: [
      "Neno aqeedah (عقيدة) linatokana na mzizi wenye maana ya kufunga au kufunga kwa uthabiti - ni seti ya imani ambazo Muislamu anazo kwa yakini kiasi kwamba moyo umefungwa kwao, bila kusumbuliwa na shaka. Katika Hadiyth mashuhuri ya Jibril, Mtume ﷺ ameifupisha kuwa ni imani sita: kwa Mwenyezi Mungu, Malaika Wake, Vitabu vyake, Mitume wake, Siku ya Mwisho, na hukumu ya Mwenyezi Mungu (qadr), wema wake na uchungu wake.",
      "Kwa Ahlul-Sunnah wa'l-Jama'ah - kundi kuu la Waislamu wa Sunni - itikadi inachukuliwa kwanza kutoka kwa Qur'ani, kisha Sunnah sahihi, inayoeleweka katika njia ya Maswahaba wa Mtume na vizazi vya mwanzo (salaf). Pale ambapo akili inatumika, hutumikia ufunuo badala ya kuubatilisha.",
      "Aqiydah sio mada ya semina ya kufikirika; ni mzizi ambamo ibada na tabia zote hukua. Imani za mtu kuhusu Mwenyezi Mungu ni nani, kwa nini aliumbwa, na anakoelekea hutawala kimya kimya jinsi anavyoomba, jinsi anavyowatendea wengine, na jinsi wanavyokutana na shida na kifo.",
      "Imani sahihi huweka moyo sawa kati ya hali kuu za ibada - upendo na khofu, matumaini na khofu, kuegemea na juhudi, shukrani na toba - ili Muumini asikate tamaa na rehema ya Mwenyezi Mungu wala asijisikie salama kutokana na uwajibikaji Wake.",
    ],
    quran: [
      {
        excerpt:
          "Uadilifu ni kumuamini Mwenyezi Mungu, na Siku ya Mwisho, na Malaika, na Kitabu, na Manabii.",
      },
      {
        excerpt:
          "Enyi mlio amini, muaminini Mwenyezi Mungu, Mtume wake, na Kitabu alicho kiteremsha juu ya Mtume wake, na Kitabu alicho kiteremsha kabla yake.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Imani ni kumuamini Mwenyezi Mungu, na Malaika wake, na vitabu vyake, na Mitume wake, Siku ya Mwisho, na kuamini hukumu ya Mwenyezi Mungu, wema wake na uchungu wake. (Hadithi ya Jibril, Imepokewa na Umar)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Aqiydah Ni Nini?",
    summary: "Aqiydah si tabaka la falsafa; ni imani iliyoishi inayokita mizizi katika ufunuo.",
    body: [
      "Aqiydah ni kile ambacho moyo unathibitisha kwa yakini na kile kinachoonyeshwa katika ibada na mwenendo - sio tu nadharia iliyohifadhiwa kwa mjadala. Qur'ani Tukufu inawaelezea Waumini walio na misingi madhubuti kama wale wanaosema juu ya wahyi, 'Tumeuamini; yote yametoka kwa Mola wetu Mlezi.” (3:7) wanasilimu kwa yaliyo wazi na wanamkabidhi Mwenyezi Mungu mambo ya ghaibu.",
      "Wanavyuoni wa mwanzo waliandika maandiko mafupi ya itikadi (kama vile al-'Aqidah al-Tahawiyya) kwa usahihi ili kuhifadhi uwazi huu - kuwalinda waumini wa kawaida kutokana na hatari mbili: kutia chumvi ambayo inaongeza dini, na kukanusha ambako kunaondoa yale aliyoyathibitisha Mwenyezi Mungu.",
      "Ndani ya Ahlul-Sunnah kuna shule za theolojia zinazotambulika—hasa zaidi mikabala ya Athari, Ash’ari, na Maturidi—ambazo zinakubaliana kabisa juu ya mambo muhimu ya imani huku zikitofautiana katika baadhi ya mbinu za kitaalamu za kueleza mambo fulani, hasa sifa za kiungu. Msingi wao wa pamoja ni mmoja na madhubuti: Upweke kamili wa Mwenyezi Mungu, ukweli wa wahyi Wake, na uwajibikaji wa kweli huko Akhera.",
      "Kwa hivyo aqeedah inafunzwa vyema kama imani hai: kila nukta ya imani inaunganishwa na njia ya kuabudu, njia ya tabia, na chanzo cha faraja.",
    ],
    quran: [
      {
        excerpt:
          "Na walio imara katika ilimu wanasema: Tumeiamini. Yote yametoka kwa Mola wetu Mlezi.",
      },
    ],
    actions: [
      "Jifunze aqeedah kutoka kwa wasomi wanaotegemewa na maandishi ya msingi, sio kutoka kwa mijadala ya mitandao ya kijamii.",
      "Kwa kila imani unayojifunza, uliza: je, hii inabadilishaje jinsi ninavyoabudu na kuishi?",
    ],
  },
  {
    title: "Kwa Nini Aqiydah Ni Muhimu",
    summary: "Imani nzuri hutoa utulivu wa kiroho na hulinda dhidi ya kupita kiasi.",
    body: [
      "Imani inapokuwa nzuri na imetulia, matendo huwa ya dhati na thabiti; imani inapoyumba, ibada huelekea kutokuwa thabiti, kihisia tu, au kutikiswa kwa urahisi na tamaa na mashaka. Mwenyezi Mungu anaahidi kwamba 'Anawaweka imara wale walioamini kwa kauli thabiti' - katika maisha ya dunia na wakati wa kutisha wa kaburi na Akhera.",
      "Imani iliyo sahihi pia ndiyo inayombeba muumini katika safu kamili ya maisha: inamfundisha subira kuamini amri ya Mwenyezi Mungu wakati wa dhiki, shukrani ya unyenyekevu katika baraka, na yakini tulivu mbele ya mashaka na kifo. Mtu ambaye hakika anaamini Qadr na Akhera haporomoki anapojaribiwa.",
      "Hatimaye, aqeedah yenye sauti hufunza adab - mwenendo mzuri - katika kutokubaliana: kushikilia kwa uthabiti misingi iliyo wazi huku ikionyesha heshima na kujizuia katika mambo ya upili ambapo wanazuoni wanyofu wametofautiana kwa muda mrefu. Ujuzi wa imani unapaswa kuongeza unyenyekevu na rehema, kamwe kiburi.",
    ],
    quran: [
      {
        excerpt:
          "Mwenyezi Mungu huwaweka imara walio amini kwa kauli thabiti katika maisha ya dunia na Akhera.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kuweni na shauku ya manufaa yenu, na ombeni msaada kwa Mwenyezi Mungu, wala msilegee… (Abu Hurayrah).",
      },
    ],
  },
  {
    title: "Nakala Sita za Iman",
    summary: "Mtume ﷺ alitoa mukhtasari wa iman katika imani sita za msingi.",
    body: [
      "Makala sita yanatoka katika Hadithi ya Jibril, moja ya hadithi muhimu sana katika Uislamu. Malaika Jibril alikuja katika sura ya mtu na akamuuliza Mtume ﷺ mbele ya Maswahaba kuhusu Uislamu, iman na ihsan. Alipouliza kuhusu Imani, Mtume ﷺ akajibu kwa imani hizi sita - na Jibril akamthibitisha, kisha akaondoka, akiwa amekuja kuwafundisha watu dini yao.",
      "Sita hizo ni: kumuamini Mwenyezi Mungu; katika malaika zake; katika vitabu vyake vilivyoteremshwa; katika Mitume Wake; katika Siku ya Mwisho; na katika hukumu ya Mwenyezi Mungu (qadr), wema wake na uchungu wake. Kumkataa yeyote kati yao ni kutoka nje ya Imani ya kweli, kwani wao ni kitambaa kimoja.",
      "Pia zimeunganishwa kwa kina. Kuamini Vitabu na Mitume kunapelekea elimu ya Siku ya Mwisho na hisabu; Kuamini Siku ya Mwisho kunakipa uzito kila kitendo; na kuamini Qadr kunafunza kumtegemea Mwenyezi Mungu na kunyenyekea mbele ya hekima yake. Kujifunza kwao kwa utaratibu hujenga mtazamo wazi na uwiano wa ulimwengu.",
    ],
    hadith: [
      {
        excerpt:
          "....kwamba muamini Mwenyezi Mungu, na Malaika wake, na Vitabu vyake, na Mitume wake, na Siku ya Mwisho, na kuamini hukumu, na kheri yake, na uchungu wake. (Hadithi ya Jibril)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Imani kwa Mwenyezi Mungu",
    summary:
      "Kumwamini Mwenyezi Mungu kunaenea ubwana Wake, haki yake pekee ya kuabudiwa, na majina yake na sifa zake.",
    body: [
      "Kumwamini Mwenyezi Mungu ni imani kuu kuliko imani zote na mzizi wa nyinginezo. Inaanza kwa uhakika kwamba Yeye pekee ndiye Muumba, Mmiliki, na Mlinzi wa kila kitu - Mungu wa pekee wa kweli, asiye na mshirika, asiyelingana naye, na hakuna haja ya kiumbe chake chochote.",
      "Ifuatayo ni kwamba Yeye pekee ndiye anayestahiki kuabudiwa kwa kila namna: sala, dua, matumaini, khofu, tegemeo, upendo katika maana yake ya juu kabisa, kafara, na nadhiri zote ni haki za Mwenyezi Mungu ambazo haziwezi kuelekezwa kwa yeyote asiyekuwa Yeye. Hii ndiyo maana ya ushahidi 'hapana mungu ila Mwenyezi Mungu.'",
      "Ahlul-Sunnah wanathibitisha majina mazuri na sifa tukufu alizozithibitisha Mwenyezi Mungu kwa ajili yake, na kwamba Mtume Wake (Swalla Allaahu ‘alayhi wa aalihi wa sallam) amemthibitishia kwa njia inayolingana na utukufu wake, bila ya kumfananisha na viumbe vyake (tamthil) na bila ya kukanusha au kufuta sifa zake (ta’til). Aya inayoongoza ni: “Hakuna chochote mfano wake, naye ni Mwenye kusikia, Mwenye kuona.” (42:11) – ambayo yote mawili yanapinga kufanana na yanathibitisha kusikia kwake na kuona kwake.",
      "Kumjua Mwenyezi Mungu kwa majina Yake - Mwingi wa Rehema, Mjuzi wa yote, Aliye hai, Mfalme, Mwenye kusamehe - ni chakula cha moyo: kadiri unavyomjua Yeye, ndivyo unavyompenda, na khofu, na uelekee kwake.",
    ],
    quran: [
      {
        excerpt:
          "Sema: Yeye ni Mwenyezi Mungu Mmoja. Hazai wala hazai, na hakuna anayefanana naye.",
      },
      {
        excerpt: "Na Mwenyezi Mungu ana majina mazuri kabisa, basi muombeni kwayo.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Imani katika Malaika",
    summary:
      "Malaika ni waja wa Mwenyezi Mungu walio hishimiwa, wasioonekana ambao kamwe hawamuasi.",
    body: [
      "Malaika (malaikah) ni viumbe vikubwa vilivyotengenezwa kwa nuru. Hawana hiari ya kuasi: wanamuabudu Mwenyezi Mungu mfululizo na wanatekeleza kila amri yake kikamilifu, 'wasimwasi Mwenyezi Mungu katika anayowaamrisha, na kufanya wanayoamrishwa.'",
      "Kuamini kwao ni kuamini kwamba ulimwengu usioonekana ni halisi na unafanya kazi karibu nasi. Malaika wanaleta wahyi, wanawalinda wanadamu, wanaandika kila neno na vitendo, wanazitoa roho wakati wa kufa, na wanasimamia mambo ya ardhi na mbingu kwa idhini ya Mwenyezi Mungu.",
      "Kadhaa wametajwa katika maandiko yenye majukumu maalum: Jibril, malaika wa wahyi; Mikail, aliyekabidhiwa mvua na riziki; Israfil, atakayepuliza Baragumu; Malak al-Mawt, malaika wa mauti; na waandishi watukufu (Kiraman Katibin) wanaoandika matendo ya kila mtu. Munkar na Nakir wanamhoji marehemu kaburini.",
    ],
    quran: [
      {
        excerpt:
          "Juu yake wamo Malaika wakali na wakali, wasiomuasi Mwenyezi Mungu katika yale Anayoamrisha na wanafanya wanayoamrishwa.",
      },
      {
        excerpt:
          "Sema: Aliye kuwa adui wa Jibril, basi huyo ndiye aliyeiteremsha juu ya moyo wako kwa idhini ya Mwenyezi Mungu.",
      },
    ],
    actions: ["Ishi kwa ufahamu kwamba malaika wanaorekodi hawakosi neno au tendo."],
  },
  {
    title: "Imani katika Vitabu vya Kimungu",
    summary:
      "Mwenyezi Mungu aliteremsha maandiko kama mwongozo; Qur'ani inayathibitisha na kusimama kama kigezo cha mwisho.",
    body: [
      "Waislamu wanaamini kwamba Mwenyezi Mungu aliteremsha maandiko kwa Mitume wake kama mwongozo na rehema. Qur'ani inataja kadhaa: Suhuf za Ibrahim na Musa, Tawrah aliyopewa Musa, Zabur kwa Dawud, Injil kwa 'Isa, na hatimaye Qur'ani kwa Muhammad ﷺ - iliyoaminiwa kwa ujumla, katika hali yao ya asili iliyoteremshwa.",
      "Qur'ani ina daraja la kipekee. Ni wahyi wa mwisho, uliotumwa 'kuthibitisha yale yaliyotangulia na kuwa kigezo juu yake' (5:48) - maana yake inahukumu na kusahihisha, kwani maandiko ya awali hayakubaki katika hali yake ya asili bali yalibadilishwa (tahrif) na kupotea kwa vizazi.",
      "Kipekee miongoni mwa Vitabu vyote, Qur’ani imehifadhiwa na Mwenyezi Mungu kutokana na ufisadi: “Hakika Sisi tumeteremsha Ukumbusho, na hakika Sisi ni Walinzi wake” (15:9). Kwa hiyo kuamini vitabu kunamaanisha kuheshimu wahyi, kusoma Qur-aan kwa kutafakari, na kusalimu amri katika maisha yake.",
    ],
    quran: [
      {
        excerpt:
          "Na tumekuteremshia Kitabu kwa haki, kinachosadikisha yaliyo kuwa kabla yake katika Kitabu, na ni upambanuzi juu yake.",
      },
      {
        excerpt: "Hakika Sisi ndio tulio teremsha Ukumbusho, na hakika Sisi ndio tutakaoulinda.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Imani kwa Manabii",
    summary: "Mitume wote walifikisha ukweli huo wa msingi; Muhammad ﷺ ndiye mjumbe wa mwisho.",
    body: [
      "Mwislamu anaamini Mitume na Mitume wote waliotumwa na Mwenyezi Mungu, asimkatalie hata mmoja wao. Kuanzia kwa Adam hadi kwa Nuh, Ibrahim, Musa, na Isa hadi kwa Muhammad ﷺ, wote walilingania ujumbe mmoja muhimu: Muabuduni Mwenyezi Mungu peke yake, na ishini kwa unyofu. Ishirini na tano wametajwa katika Qur'ani; idadi yao yote inajulikana kwa Mwenyezi Mungu tu.",
      "Mitume ni viumbe bora katika ukweli na uaminifu, wamelindwa na Mwenyezi Mungu dhidi ya kusema uwongo juu ya ujumbe na kutokana na dhambi kubwa - lakini wanabakia kuwa wanadamu, sio waungu, na hawapaswi kuabudiwa. Watano wametajwa kama mitume 'wakamili' (ulu al-'azm): Nuh, Ibrahim, Musa, Isa, na Muhammad ﷺ.",
      "Muhammad (Swalla Allaahu ‘alayhi wa aalihi wa sallam) ni Muhuri wa Mitume (Khatam an-nabiyyin): hakuna Nabii anayekuja baada yake, na ujumbe wake ni wa ulimwengu wote—unatumwa kwa wanadamu wote mpaka Siku ya Hukumu. Kumwamini kunatia ndani kumpenda, kutii amri zake, kuamini ripoti zake, na kuabudu tu katika njia aliyofundisha.",
    ],
    quran: [
      {
        excerpt: "...Hatutafautishi baina ya yeyote katika Mitume wake...",
      },
      {
        excerpt:
          "Muhammad si baba wa yeyote katika wanaume wenu, ila ni Mtume wa Mwenyezi Mungu na muhuri wa Manabii.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Imani Katika Siku ya Mwisho",
    summary:
      "Maisha yanaongoza kwenye mkutano wa mwisho na Mwenyezi Mungu, uadilifu kamilifu, na matokeo ya milele.",
    body: [
      "Kuamini Siku ya Mwisho ni kuamini kila kinachofuata kifo: kuswali na uhai wa kaburi (barzakh), kupulizwa kwa Baragumu, kufufuliwa watu wote, mkusanyiko mkubwa, hisabu, mizani ya vitendo katika Mizani, kuvuka daraja, na makazi mawili ya milele - Pepo na Moto.",
      "Imani hii inatoa uzito wa maadili kwa kila wakati. Kwa sababu Mwenyezi Mungu anayaona yaliyofichika na anaandika jambo dogo, hakuna jema linaloharibika na hakuna ubaya unaopuuzwa: 'Mwenye kutenda chembe ya wema atauona, na anayefanya chembe ya uovu atauona.'",
      "Ahlul-Sunnah wanayathibitisha haya yote kwa yakini, wakiyaamini sawa na yalivyoripotiwa, huku wakikiri kwamba wanachuoni wanatofautiana katika kufasiri baadhi ya maelezo mazuri zaidi ya matukio na dalili maalum. Suala la imani si kubahatisha bali ni maandalizi.",
    ],
    quran: [
      {
        excerpt: "…Basi anayefanya chembe ya wema atauona, na anayefanya chembe ya ubaya atauona.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kuamini Qadr (Haki ya Mwenyezi Mungu)",
    summary:
      "Ujuzi wa Mwenyezi Mungu na hukumu yake ni kamili - lakini wanadamu hakika wanachagua na wanawajibika.",
    body: [
      "Imani ya qadr mara nyingi inafupishwa katika viwango vinne: kwamba Mwenyezi Mungu anajua kila kitu milele; kwamba aliyaandika yote katika Ubao Uliohifadhiwa miaka elfu hamsini kabla ya kuumbwa; kwamba hakuna kinachotokea isipokuwa kwa mapenzi yake; na kwamba Yeye ndiye Muumba wa kila kilichopo, pamoja na matendo ya waja Wake.",
      "Wakati huo huo, wanadamu wana dhamira ya kweli na chaguo la kweli ndani ya yale anayoruhusu Mwenyezi Mungu - ndiyo maana hasa amri na makatazo, malipo na adhabu, ni za haki na zenye maana. Mtu anachagua kusali au kusema uwongo, na anawajibika ipasavyo; Ujuzi wa awali wa Mwenyezi Mungu juu ya uchaguzi haulazimishi.",
      "Ahlul-Sunnah wanaongoza baina ya makosa mawili: kukanusha amri (kana kwamba matukio yanaepuka elimu ya Mwenyezi Mungu na mapenzi yake), na fatalism (kutumia amri kufuta jukumu la mwanadamu na udhuru wa dhambi). Muumini huchukua njia kwa ubora, kisha anamkabidhi Mwenyezi Mungu mwisho.",
      "Kiuhalisia, qadr ni chanzo kikubwa cha amani: baada ya kufanya sehemu yako, unapumzika katika ujuzi kwamba chochote kitakachokufikia hakiwezi kamwe kukukosa, na chochote kilichokukosa kisingeweza kukufikia.",
    ],
    hadith: [
      {
        excerpt:
          "…Ikikusibuni, msiseme ‘laiti ningefanya hayo’, bali sema ‘Mwenyezi Mungu Amehukumu, na Alichokitaka Amekifanya’ — kwani ‘laiti’ hufungua mlango kwa Shetani. (Abu Hurayrah)",
      },
    ],
    quran: [
      {
        excerpt: "Hakika Sisi tumekiumba kila kitu kwa kipimo.",
      },
      {
        excerpt:
          "Hakika Mwenyezi Mungu habadili yaliyomo kwa watu mpaka wabadili yaliyomo nafsini mwao.",
      },
    ],
    misconceptions: [
      "Dhana potofu: Ikiwa kila kitu kimeamuliwa, juhudi haina maana. Marekebisho: Uislamu unaamuru juhudi, mipango, sala, na toba - kuchukua njia yenyewe ni sehemu ya amri.",
      "Dhana potofu: Qadr ina maana kwamba Allah ndiye wa kulaumiwa kwa dhambi yangu. Sahihisho: Mtumishi anachagua na anawajibika; amri hiyo kamwe si kisingizio cha uasi.",
      "Dhana potofu: Ugumu unathibitisha kwamba Mwenyezi Mungu amechukizwa na mimi. Marekebisho: Majaribio yanaweza kuwa utakaso, mwinuko wa cheo, onyo, au wito wa kurudi - mara nyingi ni ishara ya kujali, si hasira.",
    ],
    actions: [
      "Chukueni njia kwa ubora, basi tegemeeni hukumu ya Mwenyezi Mungu.",
      "Badilisha nafasi ya 'ikiwa tu…' mizunguko ya majuto na 'Qaddar Allah' na hatua inayofuata ya kujenga.",
    ],
  },
  {
    title: "Tawhiyd Imeeleza",
    summary:
      "Tawhiyd inaunganisha ubwana wa Mwenyezi Mungu, haki yake pekee ya kuabudiwa, na majina yake na sifa zake.",
    body: [
      "Tawhiyd (توحيد) - umoja kamili wa Mwenyezi Mungu - ndio moyo wa Uislamu na ujumbe wa kila mtume. Maana yake ni kumpwekesha Mwenyezi Mungu peke yake katika kila kitu ambacho ni Chake pekee, na kuthibitisha ukamilifu wake kama vile alivyojieleza Mwenyewe.",
      "Wanachuoni kwa kawaida hufundisha tawheed kupitia vipengele vitatu vilivyounganishwa ili kuifanya iwe rahisi kuelewa na kulinda. Tawhiyd al-Rububiyyah: kwamba Mwenyezi Mungu pekee ndiye anayeumba, anamiliki, na anadhibiti kila kitu. Tawhiyd al-Uluhiyyah: kwamba Mwenyezi Mungu pekee ndiye anastahiki kuabudiwa - hii ndiyo kipengele ambacho Mitume walisisitiza zaidi na makafiri wanapinga. Tawhiyd al-Asma' wa'l-Sifat: kuthibitisha majina ya Mwenyezi Mungu na sifa kama zilivyoteremshwa, bila ya upotoshaji, ukanushaji, au mfano.",
      "Mfumo huu wa sehemu tatu ni chombo cha kufundishia, si chanzo cha mgawanyiko; madhumuni yake ni kumsaidia muumini kulinda uaminifu na kutambua mahali ambapo umoja unaweza kuhatarishwa. Yote hayo yamenaswa katika du'a ya ufunguzi wa sala ya kila Muislamu: 'Wewe peke yako tunakuabudu, na Wewe tu tunakuomba msaada.'",
      "Ufahamu muhimu: kukiri kwamba Mwenyezi Mungu ndiye Muumba (rububiyyah) haitoshi peke yake. Wengi waliokanusha Mitume bado walikiri kuwa Mwenyezi Mungu ameumba mbingu na ardhi - walichokataa ni kumuabudu Yeye peke yake (Uluhiyyah). Tawhiid halisi inathibitishwa katika ibada, sio tu katika imani juu ya asili.",
    ],
    quran: [
      {
        excerpt: "Wewe tu tunakuabudu, na Wewe tu tunakuomba msaada.",
      },
      {
        excerpt: "Mwenyezi Mungu - hapana mungu ila Yeye. Yeye ndiye Mwenye majina mazuri kabisa.",
      },
    ],
    misconceptions: [
      "Dhana potofu: Tawhiyd ni kusema sentensi moja tu. Kusahihisha: Ni imani ya moyo, kauli ya ulimi, na ukweli unaoishi katika ibada.",
      "Dhana potofu: Kuamini kuwa Mwenyezi Mungu ndiye Muumba ni tawhiyd nzima. Usahihishaji: Hata makafiri wengi wamethibitisha kuwa mtihani ni kumuabudu Mwenyezi Mungu peke yake.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shirk Ameeleza",
    summary: "Shirki ni kuelekeza haki makhsusi ya Mwenyezi Mungu kwa kitu kisichokuwa Yeye.",
    body: [
      "Shirki (شرك) - kumshirikisha Mwenyezi Mungu - ni kinyume cha tawhiyd na dhambi moja ambayo Qur'ani inaitaja kuwa ni isiyosameheka ikiwa mtu atakufa juu yake bila ya kutubia: 'Mwenyezi Mungu hasamehe kushirikishwa, lakini husamehe kidogo kuliko hayo kwa amtakaye.'",
      "Shirki kubwa (al-shirk al-akbar) ni kuelekeza ibada kwa asiyekuwa Mwenyezi Mungu - kuwalingania maiti au kutokuwepo kwa yale ambayo Mwenyezi Mungu pekee ndiye anaweza kutoa, kutoa kafara au kuweka nadhiri kwa viumbe vilivyoumbwa, au kupenda na kutii kitu kama inavyompasa mtu kumpenda na kumtii Mwenyezi Mungu. Inamtoa mtu nje ya Uislamu ikiwa atakufa juu yake bila kutubu.",
      "Shirki ndogo (al-shirk al-asghar) haitoi katika Uislamu bali ni hatari sana na inaweza kubatilisha malipo ya matendo. Umbo lake la wazi kabisa ni riya - kufanya ibada ili kuonekana na kusifiwa na watu - ambayo Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) aliitaja kuwa ni kitu alichokiogopa zaidi kwa umma wake. Kuapa kwa asiyekuwa Mwenyezi Mungu kwa namna inayotukuza kunaangukia hapa pia.",
      "Ahlul-Sunnah wako makini na lugha na hukumu: kuonya dhidi ya shirki kwa ujumla ni muhimu na ni wazi, lakini kumtangaza mtu makhsusi kuwa ni mushrik au kafiri (takfir) ni jambo zito linalohitaji elimu, dalili halali, na kuondoa visingizio - ni mali ya wanachuoni waliobobea, si ya watu wa kawaida au hoja ya mtandaoni.",
    ],
    quran: [
      {
        excerpt:
          "Hakika Mwenyezi Mungu hasamehi ushirika naye, lakini husamehe yaliyo duni kuliko hayo kwa amtakaye.",
      },
      {
        excerpt: "Ewe mwanangu, usimshirikishe Mwenyezi Mungu. Hakika ushirika ni dhulma kubwa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kitu ninachokuhofia zaidi ni shirki ndogo. Alipoulizwa ni nini, ﷺ akasema: kujionyesha (riya). (Mahmud ibn Labid)",
      },
    ],
    misconceptions: [
      "Dhana potofu: Kila kuteleza kwa ulimi ni shirki kubwa. Usahihishaji: Wanazuoni hutofautisha kubwa na ndogo na huhukumu kila kesi kwa uangalifu kwa ushahidi.",
      "Dhana potofu: Kuonya dhidi ya shirki kunahitaji ukali kwa watu. Marekebisho: Njia ya kinabii inaunganisha uwazi wa ukweli na rehema na mafundisho yenye subira.",
    ],
  },
  {
    title: "Uaminifu (Ikhlas)",
    summary: "Matendo yanakubaliwa pale tu yanapofanywa kwa ajili ya Mwenyezi Mungu.",
    body: [
      "Ikhlas (إخلاص) ni kutafuta radhi za Mwenyezi Mungu kwa kitendo tu - si hadhi, sifa, mali, au ushawishi juu ya watu. Ni hali ya ndani ambayo kukubaliwa kwa kila amali kunategemea: Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) alifundisha kwamba 'matendo ni kwa nia, na kila mtu atakuwa na kile alichokusudia.'",
      "Kwa sababu malipo yanategemea nia, kitendo kidogo, cha utulivu kinachofanywa kwa ikhlasi kwa ajili ya Mwenyezi Mungu kinaweza kushinda kitendo kikubwa cha hadhara kinachofanywa kwa ajili ya sifa. Tendo lile lile la nje - kutoa sadaka, kuomba, kufundisha - inaweza kuwa ibada au utupu kutegemea moyo nyuma yake.",
      "Unyoofu haupatikani mara moja bali unafanywa upya daima, kwa sababu ubinafsi unaelekea kutafuta uangalizi. Kwa hiyo Waumini mara kwa mara huitakasa nia yao na kumuomba Mwenyezi Mungu Awakinge na shirki iliyofichika ya riya na kujidanganya.",
    ],
    quran: [
      {
        excerpt: "Na hawakuamrishwa ila wamuabudu Mwenyezi Mungu kwa kumtakasia Dini.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Vitendo ni kwa nia, na kila mtu atakuwa na kile alichokusudia. (Umar bin al-Khattab)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Upendo na Hofu ya Mwenyezi Mungu",
    summary:
      "Moyo ulio sawa humwabudu Mwenyezi Mungu juu ya mbawa za upendo, matumaini, na hofu ya uchaji.",
    body: [
      "Ibada ya moyo inategemea hali tatu kuu: upendo (mahabbah), matumaini (raja'), na hofu ya heshima (khawf). Kumpenda Mwenyezi Mungu ndio msingi na nguvu inayosukuma ya ibada zote - Waumini wana 'nguvu zaidi katika mapenzi kwa Mwenyezi Mungu' kuliko kitu chochote kile - wakati woga wa kumkasirisha Yeye huizuia roho na dhambi na kughafilika.",
      "Ahlul-Sunnah wanafundisha kwamba hawa lazima wakae katika usawa, kama ndege anayeruka na mbawa mbili na kichwa. Upendo na matumaini bila woga vinaweza kuelekezea katika uzembe na kuchukua rehema ya Mwenyezi Mungu kuwa jambo la kawaida; hofu bila matumaini inaweza kuanguka katika kukata tamaa. Qur'ani inaungana nao: 'Muombeni kwa khofu na matumaini.'",
      "Usawa huu sio hisia tu; inaonekana katika matendo - katika kulinda sala, kuharakisha kutubu, kuwahudumia wengine, kuzuia hasira, na kubaki na subira katika shida kutokana na upendo kwa Yule aliyeiamuru.",
    ],
    quran: [
      {
        excerpt: "…Lakini walio amini wana mapenzi makubwa zaidi kwa Mwenyezi Mungu.",
      },
      {
        excerpt:
          "…Na muombeni kwa khofu na kwa matumaini. Hakika rehema ya Mwenyezi Mungu iko karibu na wafanyao wema.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tumaini na Toba",
    summary:
      "Hakuna dhambi kubwa sana kwa toba ya kweli na kutumaini rehema kubwa ya Mwenyezi Mungu.",
    body: [
      "Imani inayobainisha ya Ahlul-Sunnah ni kwamba mtu hatakiwi kukata tamaa na rehema ya Mwenyezi Mungu, hata dhambi zake ni kubwa kiasi gani, na kamwe asijisikie kuwa yuko salama kutokana na uwajibikaji Wake, hata amali zake nyingi vipi. Tumaini na kujisahihisha huendelea mfululizo katika maisha ya mwamini.",
      "Mwaliko wa Mwenyezi Mungu ni ukarimu wa kustaajabisha: Sema: Enyi waja wangu mliojidhulumu nafsi zao, msikate tamaa na rehema ya Mwenyezi Mungu. Hakika Mwenyezi Mungu husamehe dhambi zote. Mlango wa toba (tawbah) hubaki wazi hadi jua lichomoze kutoka magharibi au kifo cha mtu binafsi kinakaribia.",
      "Toba ya kweli ina masharti yaliyo wazi: kuacha dhambi mara moja, kuhisi majuto ya kweli kwa ajili yake, na kuazimia kwa uthabiti kutorudi tena - na, ambapo dhambi ilihusisha haki za mtu mwingine, kurejesha haki hizo au kutafuta msamaha wao. Haya yanapofikiwa, jibu la Mwenyezi Mungu si kukubaliwa tu bali ni furaha: Yeye 'hufurahishwa zaidi na toba ya mja Wake' kuliko mtu anayerudisha mlima wake uliopotea na riziki katika jangwa lisilo na kitu.",
    ],
    quran: [
      {
        excerpt:
          "Sema: Enyi waja wangu mliojidhulumu nafsi zao, msikate tamaa na rehema ya Mwenyezi Mungu. Hakika Mwenyezi Mungu husamehe dhambi zote.",
      },
      {
        excerpt: "Enyi mlioamini tubuni kwa Mwenyezi Mungu toba ya kweli.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mwenyezi Mungu anafurahishwa na toba ya mja wake kuliko mtu aliyepoteza mlima wake, akibeba chakula chake na kinywaji chake katika nchi kame, kisha akakipata tena. (Ibn Mas'ud)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Peponi (Jannah)",
    summary:
      "Jannah ni malipo ya milele ambayo Mwenyezi Mungu amewaandalia Waumini kwa rehema zake.",
    body: [
      "Paradiso ni halisi, ni ya milele, na zaidi ya chochote ambacho akili ya mwanadamu inaweza kuwazia. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) alifikisha maneno ya Mwenyezi Mungu: “Nimewaandalia waja Wangu wema yale ambayo jicho halijaona, sikio halijasikia, na moyo haujafikiri. Malipo yake makubwa kuliko yote ni radhi za Mwenyezi Mungu na muono wa Uso Wake.",
      "Kuingia Peponi hatimaye ni kwa rehema ya Mwenyezi Mungu - hakuna amali ya mtu peke yake inayoweza kupata neema ya milele - lakini imani ya kweli na matendo mema ndiyo njia ambayo Mwenyezi Mungu ameiweka na kuikubali. Viwili hivyo havipingani: rehema ndio sababu, na imani na vitendo ndio njia aliyoifungua.",
      "Imani ya Peponi hutengeneza upya jinsi mtu anavyoishi sasa: inakuza subira kupitia shida, ukarimu na mali, na uvumilivu katika ibada, kwa sababu muumini anafanya biashara ya ulimwengu unaopita kwa nyumba ya milele. Qur'ani inatuita 'kukimbia' kuielekea.",
    ],
    quran: [
      {
        excerpt:
          "Na kimbilieni maghfira kutoka kwa Mola wenu Mlezi na Pepo yenye upana wa mbingu na ardhi iliyo andaliwa kwa ajili ya watu wema.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mwenyezi Mungu alisema: Nimewaandalia waja Wangu wema kile ambacho jicho halijapata kuona, sikio lililosikia, na moyo wa mwanadamu haujafikiri. (Abu Hurayrah; pia Sahih Muislamu 2824)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Kuzimu (Jahannam)",
    summary:
      "Jahannam ni onyo la kweli, linalokusudiwa kuzirudisha nyoyo kwa Mwenyezi Mungu kabla haijachelewa.",
    body: [
      "Kuamini Jahannam (Jahannam) ni sehemu ya kuamini ghaibu na uadilifu kamili wa Mwenyezi Mungu. Ni makazi ya kweli ya adhabu, iliyoelezwa kwa maneno ya wazi katika Qur'ani na Sunnah ili watu wachukue hatari hiyo kwa uzito.",
      "Maonyo hayo yana kusudi la rehema: yapo ili kuwalinda watu kutokana na matokeo yale yale wanayoeleza - kuangalia kiburi, uonevu, na wanaoendelea, wakijua kukataa ukweli, na kuwafanya wasiojali kutubu wakati mlango uko wazi.",
      "Ahlul-Sunnah wanashikilia maonyo na rehema pamoja. Vitisho hivyo ni vikubwa na vya kweli, lakini rehema ya Mwenyezi Mungu inabaki kuwa kubwa kwa anayerejea Kwake - na miongoni mwa watu wa tawhiyd, wakosefu wanaoingia Motoni hawatabaki humo milele lakini hatimaye watatolewa kwa rehema ya Mwenyezi Mungu na uombezi Anaoruhusu.",
    ],
    quran: [
      {
        excerpt:
          "Enyi mlio amini jilindeni nafsi zenu na ahali zenu na Moto ambao kuni zake ni watu na mawe.",
      },
      {
        excerpt:
          "…Msikate tamaa na rehema ya Mwenyezi Mungu. Hakika Mwenyezi Mungu husamehe dhambi zote.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ufufuo",
    summary:
      "Baada ya kifo, watu wote watanyanyuliwa kimwili ili kusimama mbele ya Mwenyezi Mungu.",
    body: [
      "Ufufuo (al-ba'th) ni wa kimwili na halisi, si ishara au sitiari. Mwenyezi Mungu anawajibu wale wanaotilia shaka kwamba mifupa iliyooza inaweza kuishi tena kwa mantiki rahisi zaidi: Yule aliyeiumba bila kitu mara ya kwanza bila shaka anaweza kuirejesha - na kuunda upya ni, kwa ufahamu wetu, rahisi zaidi kuliko asili.",
      "Baina ya kifo na ufufuo ipo barzakh - maisha ya kati ya kaburi, pamoja na maswali yake na urahisi au ugumu wake. Kisha litapulizwa Baragumu, na viumbe vyote vinanyanyuliwa na kukusanywa mbele ya Mwenyezi Mungu kwa ajili ya hisabu.",
      "Imani hii ndiyo inayoyapa maisha ya mwanadamu uzito wake wa kimaadili: bila kufufuliwa, dhalimu anayekufa kwa raha na aliyedhulumiwa akifa amedhulumiwa angepata mwisho huo huo. Kwa hayo, kila ubaya hujibiwa na kila jema hulipwa, yenye maana ya subira na uadilifu.",
    ],
    quran: [
      {
        excerpt:
          "Anasema: Ni nani atakayeihuisha mifupa na hali imeharibika? Sema: Atawahuisha aliye waumba mara ya kwanza.",
      },
      {
        excerpt:
          "Na hakika Saa itakuja bila shaka nayo, na Mwenyezi Mungu atawafufua walio makaburini.",
      },
    ],
  },
  {
    title: "Siku ya Hukumu",
    summary: "Kila nafsi inasimama mbele ya Mwenyezi Mungu; Haki yake ni kamilifu na kamili.",
    body: [
      "Siku ya Kiyama, kila mtu atahisabiwa - kwa matendo na nia, kwa haki za Mwenyezi Mungu na haki za watu wengine - kwa uadilifu uliosahihi sana kwamba 'hakuna nafsi itakayodhulumiwa hata kidogo,' hata kwa uzito wa chembe.",
      "Siku hiyo, hakuna nasaba, mali, tabaka, utaifa, wala cheo cha kidunia kitakachomnufaisha yeyote; Imani ya kweli tu na matendo mema, yanayokubaliwa na Mwenyezi Mungu, yatafaa. Kumbukumbu zinasambazwa, matendo yanapimwa, na hata makosa yanayofanywa baina ya watu yanatatuliwa kwa kuhamisha matendo mema na mabaya.",
      "Hakika hii inakusudiwa kubadilisha tabia sasa: inamwita Muumini kwenye uaminifu, uaminifu, kulinda haki za wengine, na kurekebisha makosa na kurejesha kile kinachodaiwa kabla ya Siku ambayo madeni yanalipwa kwa vitendo badala ya fedha.",
    ],
    quran: [
      {
        excerpt:
          "Na tunaweka mizani ya uadilifu kwa Siku ya Kiyama, basi hakuna nafsi itakayodhulumiwa hata kidogo.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Mizani na Sirat",
    summary: "Matendo yanapimwa juu ya Mizan, na watu huvuka Sirat kwa imani na matendo yao.",
    body: [
      "Ahlul-Sunnah wanathibitisha Mizan (Mizani) na Sirat (Daraja la Motoni) kama matukio halisi ya Akhera, yanayoaminika kama ilivyoripotiwa. Juu ya Mizani, vitendo na watendaji wake vinapimwa kwa uadilifu kamilifu. Na ambaye mizani yake ni nzito, atakuwa katika maisha mazuri. na ambaye mizani yake ni nyepesi, kimbilio lake litakuwa kuzimu.",
      'Sirat ni daraja lililonyoshwa juu ya Jahannam ambalo kila kitu lazima kipite. Qur\'ani inasema: "Hakuna yeyote katika nyinyi ila atapita juu yake, basi tutawaokoa walio mcha Mwenyezi Mungu." Watu huvuka kwa amali zao - wengine wepesi kama wepesi au upepo, wengine wanashindana, na wengine wakiteleza - kwa rehema ya Mwenyezi Mungu na uadilifu.',
      "Uhalisia huu hauambiwi kuogopesha bila kazi bali kustawisha uzito: kuhusu uzito wa matendo madogo, juu ya uaminifu wa ibada, na juu ya kuheshimu haki za wengine, kwani yote yatapimwa.",
    ],
    quran: [
      {
        excerpt:
          "Ama yule ambaye mizani yake itakuwa nzito, atakuwa katika maisha mazuri. lakini mtu ambaye mizani yake ni nyepesi, kimbilio lake litakuwa kuzimu.",
      },
      {
        excerpt:
          "Na hakuna yeyote katika nyinyi ila atapita juu yake… Kisha tutawaokoa wale wanaomcha Mwenyezi Mungu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Uombezi (Shafaa ́ah)",
    summary: "Uombezi ni wa kweli, ila kwa idhini ya Mwenyezi Mungu, kwa wale Anaowaridhia.",
    body: [
      "Uombezi (shafaa) Siku ya Kiyama umethibitishwa kwa uthabiti katika Qur-aan na Sunnah. Kubwa kuliko yote ni ‘Sifa Kubwa’ (al-maqam al-mahmud) aliyopewa Mtume Muhammad (Swalla Allaahu ‘alayhi wa aalihi wa sallam), atakapowaombea viumbe vilivyokusanywa kuanza hesabu - na atakuwa na maombezi mengine kwa watu wa madhambi makubwa miongoni mwa umma wake.",
      "Lakini hakuna mtu anayeomba kwa mamlaka yake mwenyewe. Kila uombezi wa halali hutokea tu baada ya idhini yake, na kwa wale ambao Mwenyezi Mungu ameridhika nao: Ni nani awezaye kumuombea isipokuwa kwa idhini yake? Hii inahifadhi ufalme wa Mwenyezi Mungu juu ya matokeo.",
      "Wanachuoni wanaelezea aina kadhaa za uombezi uliothibitishwa - kwa ajili ya hesabu ianze, kwa watu kuingia Peponi, kwa waumini wenye dhambi kusamehewa au kuondolewa Motoni - huku wakikubaliana kwamba hukumu ya mwisho daima inabakia kuwa ya Mwenyezi Mungu peke yake.",
    ],
    quran: [
      {
        excerpt: "Ni nani awezaye kumuombea isipokuwa kwa idhini yake?",
      },
      {
        excerpt:
          "Siku hiyo hautafaa uombezi ila yule ambaye Arrahmani Mwingi wa Rehema amemruhusu na akaridhia neno lake.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Watu watanijia, nami nitasujudu mbele ya Mola wangu; kisha itasemwa: Inua kichwa chako, omba nawe utapewa, ombea na uombezi wako utakubaliwa. (Abu Said - uombezi mkubwa)",
      },
    ],
    misconceptions: [
      "Dhana potofu: Uombezi huondoa hitaji la toba. Kusahihisha: Inatokea tu kwa idhini ya Mwenyezi Mungu na kamwe si ruhusa ya kuendelea kufanya dhambi.",
      "Maoni yasiyo sahihi: Mtu anaweza kuwaita manabii au watu wema sasa waombee. Masahihisho: Ibada na dua ni za Mwenyezi Mungu peke yake; uombezi wa Akhera ni kwa amri yake, inayotafutwa kwa kumridhisha.",
      "Dhana potofu: Uombezi unapingana na uadilifu wa Mwenyezi Mungu. Kusahihisha: Ni onyesho moja la rehema Yake inayotenda kazi ndani ya uadilifu Wake kamilifu, na kwa idhini Yake tu.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dalili za Siku ya Mwisho",
    summary:
      "Ishara ndogo na kubwa ni kweli; wenye busara huzingatia maandalizi badala ya kubahatisha.",
    body: [
      "Maandiko Sahihi yanaelezea dalili zilizotangulia Saa, zikiwa zimepangwa katika ishara ndogo ndogo (nyingi kati ya hizo zimekwisha dhihirika, kama vile kutumwa kwa Mtume (Swalla Allaahu ´alayhi wa sallam), kuenea kwa ujinga, na kughafilika kwa watu wengi) na dalili kubwa zitakazotokea karibu na mwisho.",
      "Ishara kumi kuu zimetajwa pamoja katika Hadith ya Mtume (Swalla Allaahu ´alayhi wa sallam): miongoni mwao kudhihiri kwa Dajjal, kushuka kwa Isa (mwana wa Maryam), kutokea kwa Yaajuj na Majuj, maporomoko matatu makubwa ya ardhi, moshi, kuchomoza jua kutoka magharibi, na moto unaowapeleka watu kwenye mkusanyiko wao wa mwisho.",
      "Wanachuoni wakati fulani wanahitilafiana juu ya mfuatano kamili wa baadhi ya dalili, lakini wanaafikiana katika mambo mawili: Kuja kwa Saa ni ya hakika, na muda wake mahususi haujulikani yeyote ila Mwenyezi Mungu - hata kwa Mtume ﷺ pale Jibril alipomuuliza. Kwa hiyo mwitikio wa kinabii kwa ishara ni wa vitendo, si wa kubahatisha: ongeza imani, toba, haki, na matendo yenye manufaa badala ya utabiri usio na mwisho.",
    ],
    quran: [
      {
        excerpt:
          "Wanakuuliza kuhusu Saa (ya Kiyama): lini kufika kwake? Sema: Ilimu yake iko kwa Mola wangu Mlezi.",
      },
      {
        excerpt: "Je! wanangoja isipokuwa iwafikie Saa kwa ghafla? Ishara zake tayari zimekuja.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Haitakuja Saa mpaka muone dalili kumi: Moshi, Dajjal, Mnyama, na jua linalochomoza magharibi, na kushuka kwa Isa, Ya'juj na Ma'juj, na maporomoko matatu ya ardhi.",
      },
    ],
    misconceptions: [
      "Dhana potofu: Kila tukio kuu la ulimwengu bila shaka ni ishara ya mwisho. Marekebisho: Madai kama haya yanahitaji ushahidi wa kweli na tahadhari ya kitaalamu, si hisia.",
      "Dhana potofu: Kujua ishara hutuwezesha tarehe ya Saa. Masahihisho: Wakati halisi anajulikana kwa Mwenyezi Mungu peke yake. ishara zinatuita kujiandaa, sio kutabiri.",
    ],
    appLinks: [{}],
  },
  {
    title: "Maswali Yanayoulizwa Mara kwa Mara ya Aqeedah",
    summary: "Maswali ya kawaida ya imani yanajibiwa kwa usawa, ushahidi, na adabu nzuri.",
    body: [
      "Swali: Je, Sunni wote wanafanana katika kila nukta ya imani? Jibu: Ahlul-Sunnah wanashiriki msingi mmoja na wanakubaliana kabisa juu ya mambo muhimu; shule za theolojia zinazotambulika (Athari, Ash'ari, Maturidi) hutofautiana tu katika baadhi ya miundo ya kiufundi, na hii inapaswa kushughulikiwa kwa kujifunza kwa heshima, si uadui.",
      "Swali: Je, ninahitaji falsafa ya hali ya juu ili kuwa na aqida sahihi? J: Hapana. Kila Muislamu anatakiwa kujifunza mambo muhimu kulingana na mahitaji yao - vifungu sita na tawhidi safi - wakati kusoma kwa kina kuna faida chini ya walimu waliohitimu.",
      "Swali: Je, kujua Aqiydah kunanifanya niwe mkali kwa wengine? J: Hapana. Imani nzuri inapaswa kuongeza unyenyekevu, shukrani, rehema, na usemi makini. Kutumia imani kuwadharau Waislamu au kukimbilia takfir yenyewe ni kosa kubwa.",
      "Swali: Kuna tofauti gani kati ya iman, uislamu na ihsan? Jibu: Katika Hadiyth ya Jibril, Uislamu ni ibada za nje, iman ni imani ya ndani (makala sita), na ihsan ni ukamilifu wa zote mbili - kumuabudu Mwenyezi Mungu kana kwamba unamuona.",
    ],
    actions: [
      "Tanguliza mambo ya msingi yaliyo wazi, yaliyokubaliwa kabla ya maelezo ya kiufundi yanayobishaniwa.",
      "Wasiliana na wasomi wa ndani waliohitimu wakati suala tata la imani linaathiri utendaji wako.",
    ],
  },
  {
    title: "Marejeleo na Utafiti Zaidi",
    summary:
      "Anza na Qur'ani na Sunnah sahihi, kisha vitangulizi vya imani vya Kisunni vinavyoaminika.",
    body: [
      "Rejeo la msingi la itikadi siku zote ni Qur'ani na Sunnah sahihi, zinazoeleweka kama Maswahaba na wanazuoni wa mwanzo wa Ahlul-Sunnah walivyozielewa - sio kupitia mielekeo ya baadaye iliyosomwa nyuma kwenye maandiko.",
      "Utafiti wa manufaa ni pamoja na vianzio mafupi vya kanuni za kitambo (kama vile al-'Aqidah al-Tahawiyya na kazi za wanazuoni wa awali) zilizofundishwa kwa maelezo yanayolingana na kiwango chako na walimu wa kutegemewa.",
      "Wanachuoni wanapotofautiana katika mambo ya msingi, jifunzeni ushahidi kwa unyenyekevu na epuka kugeuza mizozo ya kiufundi kuwa uadui wa kimadhehebu - umoja wa waumini juu ya mambo muhimu yenyewe ni amri ya dini.",
    ],
    disclaimer:
      "Moduli hii ni ya kielimu na isiyo ya kisiasa. Kwa maamuzi ya kibinafsi au masuala nyeti ya imani, wasiliana na wasomi waliohitimu unaowaamini.",
    actions: [
      "Jifunze mada moja ya imani kila wiki na mwalimu au kitangulizi kinachoaminika.",
      "Kariri makala sita za imani na uweze kueleza kila moja kwa maneno yako mwenyewe.",
    ],
    appLinks: [{}, {}, {}],
  },
];

export const AQEDAH_GLOSSARY_SW: DeepPartial<AqeedahGlossaryTerm>[] = [
  {
    term: "Aqiydah",
    definition:
      "Imani - kile Muislamu anachokiamini juu ya Mwenyezi Mungu, Malaika Wake, vitabu, Mitume, Siku ya Mwisho, na hukumu ya Mwenyezi Mungu.",
  },
  {
    term: "Tawhiyd",
    definition: "Umoja wa Mwenyezi Mungu katika ubwana, ibada, na majina/sifa - msingi wa Uislamu.",
  },
  {
    term: "Shirki",
    definition:
      "Kumshirikisha Mwenyezi Mungu katika ibada au sifa alizonazo Yeye pekee - kinyume cha tawhiyd.",
  },
  {
    term: "Imani",
    definition: "Imani - imani ndani ya moyo, uthibitisho wa ulimi, na hatua kwa viungo.",
  },
  {
    term: "Qadr",
    definition:
      "Ujuzi wa Mwenyezi Mungu wa milele na hukumu ya kila kitu - mema na mabaya yapo kwa idhini yake na hekima yake.",
  },
  {
    term: "Nabii",
    definition:
      "Mtume - mwenye kupokea wahyi na akaamrishwa kuufikisha; inaweza kufuata sheria iliyotangulia.",
  },
  {
    term: "Rasul",
    definition: "Mtume - nabii aliyetumwa na maandiko mapya au sheria kwa watu wake.",
  },
  {
    term: "Sirat",
    definition: "Daraja juu ya Jahannamu Siku ya Hukumu - waumini huvuka kulingana na matendo yao.",
  },
];
