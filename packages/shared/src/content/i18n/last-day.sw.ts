// Swahili translation overlay for the Learn "The Last Day" content. Mirrors the order of
// its English source in ../last-day*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  LastDayHadithEntry,
  LastDayQuizQuestion,
  LastDayReferenceEntry,
  LastDayTimelineEvent,
  LastDayTopic,
  LastDayVerseEntry,
} from "../../types/last-day";
import type { DeepPartial } from "./localize";

export const LAST_DAY_TOPICS_SW: DeepPartial<LastDayTopic>[] = [
  {
    title: "Utangulizi",
    summary: "Siku ya Mwisho ni nini, na kwa nini inabadilisha jinsi tunavyoishi leo?",
    body: [
      "Yawm al-Qiyamah - Siku ya Kusimama, Kiyama na Hukumu - ni siku ambayo kila nafsi inarudi kwa Mwenyezi Mungu ili kuonyeshwa vitendo vyake na kupewa makazi yake ya mwisho. Sio hadithi ya mbali au taswira ya kishairi. Qur'ani inaitaja karibu kila ukurasa, na surah za mwanzo kabisa za Makkah zinatawaliwa nayo haswa kwa sababu imani ndani yake hupanga upya maisha ya mtu. Unapotarajia kweli kusimama mbele ya Mwenyezi Mungu, uaminifu, sala, upole na kujizuia acha kuwa mapambo ya hiari na uwe kiini cha vile ulivyo.",
      "Moduli hii inatembea hatua kwa hatua ya safari: kifo na kuondoka kwa roho, muda wa barzakh kaburini, dalili ndogo na kubwa zinazotangulia Saa, kupulizwa kwa Baragumu, kufufuliwa kwa miili, kukusanyika kwenye tambarare moja kubwa, kutoa kumbukumbu, Mizani, hisabu, Daraja la Mtukufu Mtume (s.a.w.w). Peponi na Kuzimu. Kila hatua imechorwa kutoka kwenye Qur'ani na Hadith sahihi.",
      "Kanuni mbili zinatawala kila kitu hapa. Kwanza, ukweli wa matukio haya ni hakika na ni suala la itikadi (aqiydah); kukataa ufufuo au kuwajibika ni kukana dini yenyewe. Pili, muda halisi wa Saa anajulikana kwa Mwenyezi Mungu peke yake - hakuna mwanachuoni, kalenda au hesabu inayoweza kuitabiri, na kila madai ya tarehe ni ya uwongo. Mtume ﷺ hakuwahi kuwapa masahaba wake kuhesabu; aliwapa njia ya kuishi. Kwa hivyo lengo la kusoma Siku ya Mwisho ni maandalizi, sio kutabiri: kulainisha moyo, kusahihisha vipaumbele, na kukimbia kuelekea mema kabla ya wakati uliowekwa kufika.",
      "Ujumbe juu ya vyanzo: mazungumzo maarufu ya 'ishara za nyakati za mwisho' yamejaa masimulizi dhaifu na hata ya kubuni. Moduli hii inajumuisha yale tu ambayo ni sahihi, na pale ambapo wanazuoni waaminifu wa Kisunni wanatofautiana kikweli - kwa mfano kwa mpangilio wa baadhi ya ishara kuu - tofauti hiyo inawasilishwa kama tofauti, isiyolainishwa au kutiwa chumvi.",
    ],
    quran: [
      {
        excerpt:
          "Itakapotikisika ardhi kwa mtetemeko wake wa mwisho, na ikatoa mizigo yake, na mwanaadamu atasema: Kuna nini? Siku hiyo itatangaza khabari zake kwa sababu Mola wako Mlezi ameifunulia. Siku hiyo watu wataondoka makundi makundi ili waonyeshwe vitendo vyao. basi anayefanya chembe ya wema atauona, na anayefanya chembe ya ubaya atauona.",
      },
      {
        excerpt:
          "Anaweka wahyi wa amri yake juu ya amtakaye katika waja wake kuonya Siku ya Mkutano - Siku watakayotoka, hakuna chochote katika wao kinachofichika kwa Mwenyezi Mungu. Ufalme ni wa nani siku hii? Kwa Mwenyezi Mungu Mmoja, Mwenye kushinda.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kwa nini uamini Siku ya Mwisho?",
    summary: "Moja ya vifungu sita vya imani - motisha, tumaini, na haki ya mwisho.",
    body: [
      "Kuamini Siku ya Mwisho ni miongoni mwa makala sita za Iman ambazo Mtume (Swalla Allaahu ´alayhi wa sallam) alizitaja alipokuja Malaika Jibril kufundisha Dini: Kumwamini Mwenyezi Mungu, Malaika Wake, Vitabu Vyake, Mitume Wake, Siku ya Mwisho, na hukumu ya Mwenyezi Mungu, wema wake na madhara yake (Sahih Muislamu 8). Bila ya imani hii muundo mzima wa uwajibikaji huporomoka - kwani ikiwa hakuna marejeo kwa Mwenyezi Mungu, basi dhalimu na mtakatifu huisha vile vile, na kila tendo la ibada huwa ni tabia isiyo na maana ya mwisho.",
      "Qur'ani inabishana kuhusu Siku ya Mwisho kimaadili na kimantiki. Kimaadili: ni jawabu la dhulma, kwani ulimwengu ambao madhalimu hufa kwa raha katika vitanda vyao na wanaodhulumiwa hufa bila kulipizwa kisasi hauwezi kuwa mwisho wa hadithi ikiwa Mwenyezi Mungu ni mwadilifu kweli. Kwa mantiki: Yule aliyekuumbeni bila kitu mara ya kwanza hana uwezo wa kukurejesha kwa mara ya pili (Qur'ani 36:78-79). Ufufuo ni rahisi, sio ngumu zaidi, kuliko uumbaji wa asili.",
      "Imani hii pia inaadhibu injini mbili za moyo - hofu na matumaini - na kuziweka katika usawa. Maonyo ni ya kweli, kwa hiyo Muumini hafanyi kiburi au kughafilika; lakini rehema ya Mwenyezi Mungu ni kubwa na mlango wa toba uko wazi mpaka kufa, basi Muumini hakati tamaa kamwe. Moyo unaoishi kati ya hofu na matumaini ni moyo unaoendelea kujitahidi bila kuvunja.",
      "Kiuhalisia, Siku ya Mwisho inawapa hadhi wasio na uwezo na kuwazuia wenye nguvu. Inawaambia waliodhulumiwa kwamba hakuna ubaya wowote unaosahauliwa na Mwenyezi Mungu, na inawaambia wenye nguvu kwamba hakuna mali, hadhi au athari itakayowakinga kwenye hisabu. Kwa hiyo imani ndani yake si faraja binafsi bali ni chanzo cha haki, subira na uadilifu katika ulimwengu huu.",
    ],
    quran: [
      {
        excerpt:
          "Uadilifu sio kwamba muelekeze nyuso zenu upande wa mashariki au magharibi, bali wema ni yule anayemuamini Mwenyezi Mungu, Siku ya Mwisho, Malaika, Kitabu na Manabii, na akawapa mali bila ya kuvipenda, jamaa, mayatima, masikini, msafiri na wanaoswali.",
      },
      {
        excerpt:
          "Wala usidhani Mwenyezi Mungu hana khabari na wanayoyafanya madhalimu. Hakika Yeye anawachelewesha ila Siku ambayo macho yatakodoka kwa khofu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Imani ni kuwa muamini Mwenyezi Mungu, na Malaika wake, na Vitabu vyake, na Mitume wake, na Siku ya Mwisho, na kuamini hukumu ya Mwenyezi Mungu, na kheri yake na madhara yake. - kutoka katika Hadithi ya Jibril, alipokuja kufundisha dini.",
      },
    ],
    actions: [
      "Fanya upya nia yako kila siku: vitendo vyangu ni vya Mwenyezi Mungu, na Siku nitakayokutana Naye.",
      "Wakati dhuluma inakuumiza na hakuna mahakama ya kidunia inayojibu, ikabidhi kwa Mahakama ya Siku ya Mwisho.",
      "Weka hofu na tumaini pamoja - usiruhusu hofu isikukatishe tamaa au tumaini ikushawishi usahau.",
    ],
    appLinks: [{}],
  },
  {
    title: "Kifo",
    summary: "Kila nafsi itaonja mauti - husn al-khatimah na kile kinachomfaidisha marehemu.",
    body: [
      "Kifo ni miadi ambayo hakuna mtu anayekosa. Qur’ani inaeleza kwa uwazi: kila nafsi itaonja mauti, na malipo kamili yatatolewa Siku ya Kiyama tu (Qur’ani 3:185). Kifo si maangamizo bali ni uhamisho - roho inauacha mwili na kuelekea hatua inayofuata ya safari yake. Malaika wa mauti, aliyekabidhiwa na Mwenyezi Mungu, huichukua roho, kisha kwa Mola wako Mlezi utarejeshwa (Qur'ani 32:11).",
      "Kwa sababu njia ya kifo ni muhimu, Muumini anafanya kazi kuelekea mwisho mwema - husn al-khatimah - kwa toba ya kweli, sala ya kudumu, na tabia nzuri, akitarajia kufa katika hali ambayo Mwenyezi Mungu ameridhika nayo. Mwisho mbaya - su' al-khatimah - anaogopwa kwa mtu anayeendelea na dhambi na akageuka bila ya kutubia. Lakini rehema katika hili ni kubwa sana: mlango wa tawbah hukaa wazi mpaka njuga ya mauti ifike kooni, kwa hiyo mtu yeyote asihitimishe kuwa amechelewa na pumzi inabaki.",
      "Mtume (Swalla Allaahu ´alayhi wa sallam) alifundisha kukumbuka mara kwa mara kifo - 'Mkumbuke mara kwa mara mwenye kuharibu starehe,' maana yake ni kifo (Jami' at-Tirmidhi 2307, hasan) - sio kutufanya tuwe na huzuni bali kutuweka macho. Kukumbuka kifo kunapunguza mshiko wa ulimwengu huu, huondoa kinyongo, na kupanga upya mambo ambayo hasa ni muhimu. Maelezo ya kuondoka kwa roho ambayo yanaonekana tu katika ripoti dhaifu ni bora kuachwa; nyenzo halisi inatosha kutia hofu na utayari.",
      "Kifo pia hufunga daftari la matendo - isipokuwa tatu. Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) amesema kuwa anapokufa mtu hukatwa matendo yake isipokuwa matatu: Sadaka inayoendelea (sadaqah jariyah), elimu inayoendelea kunufaika, na mtoto mwema anayemuombea dua (Sahih Muislamu 1631). Hii ni ya vitendo sana: inamaanisha kwamba kile unachojenga, kufundisha, na kukuza ukiwa hai kinaweza kuendelea kukuletea mapato muda mrefu baada ya wewe kuondoka.",
    ],
    quran: [
      {
        excerpt:
          "Kila nafsi itaonja mauti, na mtapewa ila Siku ya Kiyama ujira wenu kamili. Basi anaye tolewa na Moto na akaingizwa Peponi amefaulu. Na maisha ya dunia ni starehe ya udanganyifu.",
      },
      {
        excerpt:
          "Sema: Atakushikeni Malaika wa Mauti aliye kabidhiwa kwenu. kisha mtarejeshwa kwa Mola wenu Mlezi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Anapokufa mtu hukatika amali zake isipokuwa tatu: Sadaka inayoendelea, elimu ambayo kwayo hupatikana manufaa, au mtoto mwema anayemuombea dua.",
      },
      {
        excerpt: "Kumbuka mara nyingi mharibifu wa anasa - maana yake kifo.",
      },
    ],
    actions: [
      "Ongeza istighfar na omba kwa wakati - haswa ukiwa na afya na shughuli nyingi, sio tu wakati mgonjwa.",
      "Tubu leo ​​kwa jambo lolote maalum unalochelewesha; usicheze kamari kesho.",
      "Wekeza katika mambo matatu yenye kudumu: jenga sadaka inayoendelea, sambaza elimu yenye manufaa, na kulea watoto juu ya tawhiyd na tabia njema.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Barzakh (maisha kaburini)",
    summary: "Muda baada ya kifo hadi ufufuo - maswali na matokeo yake.",
    body: [
      "Barzakh maana yake ni kizuizi, na ni jina la muda wote kati ya kifo cha mtu na Siku ya Kiyama. Qur'ani Tukufu imetumia neno hili pale mhalifu aliyekufa anapoomba arejeshwe: 'Nyuma yao kipo kizuizi (barzakh) mpaka Siku watakayofufuliwa' (Qur'ani 23:100) - ukuta madhubuti ambao hakuna marejeo ya maisha haya. Mwili ukizikwa, kuchomwa, kuzama au kupotea, roho inaingia barzakh; kaburi ni sura yake ya kawaida, na hatua ya kwanza ya Akhera kwa kila mwanadamu.",
      "Ripoti za kweli zinaelezea kuhojiwa baada ya mazishi. Malaika wawili wanakuja na kumuuliza marehemu maswali matatu: Ni nani Mola wako Mlezi? Dini yako ni ipi? Ni nani huyu mtu aliyetumwa kwako? Muumini ambaye Mwenyezi Mungu amemwekea sawa hujibu: Mola wangu Mlezi ni Mwenyezi Mungu, Dini yangu ni Uislamu, na huyu ndiye Muhammad ﷺ; kaburi basi hupanuliwa na kuwashwa kwa ajili yake. Yule aliyeghafilika husema, 'Ah, sijui,' na akakutana na dhiki (Jami' at-Tirmidhi 1071, hasan, ambapo Malaika wawili wanaitwa Munkar na Nakir). Ndiyo maana Qur’ani inamhimidi Mwenyezi Mungu kwa kuwaweka Waumini imara ‘kwa kauli thabiti katika maisha ya dunia na Akhera’ (Qur’ani 14:27).",
      "Furaha au adhabu hufuata kaburini, iliyothibitishwa katika maandiko sahihi: 'Kaburi ima ni bustani kutoka kwenye bustani za Peponi au shimo kutoka kwenye mashimo ya Moto' (Jami' at-Tirmidhi 2460, hasan sahih). Qur'ani inaashiria adhabu ya watu wa Firauni kuingizwa Motoni 'asubuhi na jioni' kabla hata Saa haijafika (Qur'ani 40:46). Ahlul-Sunnah wanathibitisha ukweli wa malipo na adhabu kubwa huku wakimuachia Mwenyezi Mungu asili yake, kwani ni ya ghaibu na haiwezi kutambuliwa na walio hai.",
      "Kuna makubaliano kwamba kuuliza kaburi na raha au mateso ya kaburi ni kweli; wasomi hujadili mambo bora zaidi - kama vile ikiwa inagusa mwili, roho, au zote mbili, na jinsi inavyowafikia wale wasio na kaburi la kawaida - bila kuruhusu maswali hayo kuvuruga kutoka kwa jambo hilo. Barzakh ndiye mchochezi mkuu: huligeuza kaburi kutoka kwenye shimo la ardhi kuwa kioo cha matendo ya mtu mwenyewe, na inabainisha wazi kwamba kile unachokitangulia ndicho kitakachokusalimu hapo.",
    ],
    quran: [
      {
        excerpt:
          "Mpaka yanapomfikia mmoja wao mauti husema: Mola wangu Mlezi nirudishe ili nifanye wema katika yale niliyoyaacha. Hapana! Ni neno tu analosema; na nyuma yao kipo kizuizi mpaka Siku watakayo fufuliwa.",
      },
      {
        excerpt:
          "Motoni wanadhihirika humo asubuhi na jioni. Na Siku itapo simama Saa itasemwa: Waingizeni watu wa Firauni kwenye adhabu kali kabisa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kaburi ima ni Bustani itokayo katika Pepo au shimo kutoka kwenye mashimo ya Moto.",
      },
      {
        excerpt:
          "Marehemu anapozikwa, humjia Malaika wawili na kumuuliza: Ni nani Mola wako Mlezi? Dini yako ni ipi? Nabii wako ni nani? Muumini hujibu kwa yakini na kaburi lake hupanuliwa na kuwashwa kwa ajili yake.",
      },
    ],
    misconceptions: [
      "Dhana potofu: Adhabu kali ni imani ya watu isiyo na msingi. Usahihishaji: Uhakika wa kuuliza na wa neema au adhabu umethibitika katika Hadith sahihi na kudokezwa ndani ya Qur'ani; ni hatua iliyotulia ya itikadi ya Sunni.",
      "Maoni yasiyo sahihi: Tunapaswa kubishana kuhusu sura na majina ya malaika. Masahihisho: Kutajwa kwa Munkar na Nakir kunakuja katika ripoti ya hasan; imani ya msingi ni kuhoji yenyewe. Kujitayarisha kujibu kwa ukweli ni muhimu zaidi kuliko kujadili maelezo yake.",
    ],
    actions: [
      "Shikilia tawhiyd na Sunnah sasa - majibu ya kaburi hayakariri hapo bali yaliishi hapa.",
      "Linda adhkar ya asubuhi na jioni, ambayo Mtume ﷺ ameifundisha kama ulinzi na uthabiti.",
    ],
    appLinks: [{}],
  },
  {
    title: "Dalili za Siku ya Mwisho",
    summary: "Ishara ndogo na kuu - uhakika wa Saa, wakati usiojulikana.",
    body: [
      "Kufika kwa Saa ni hakika, lakini muda wake ni siri Mwenyezi Mungu amejiwekea. Alipoulizwa hata Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) itakuja lini, jibu lililotolewa ni kwamba mwenye kuulizwa hajui zaidi ya yule anayeuliza — ujuzi wake uko kwa Mwenyezi Mungu peke yake (Qur’ani 7:187). Kwa hivyo jambo la kwanza kabisa la kutulia kabla ya kusoma 'ishara' yoyote ni hii: ishara zimetolewa ili kututayarisha, kamwe tusiruhusu tuhesabu tarehe. Yeyote anayetaja mwaka kwa Saa amepingana na Qur-aan.",
      "Wanachuoni wanaziweka ishara katika aina mbili. Alama ndogo ndogo (al-'alamat al-sughra) ni mabadiliko ya taratibu ya kijamii, kimaadili na ya kidunia ambayo yanajijenga kwa muda wa karne nyingi kabla ya mwisho. Dalili kuu (al-'alamat al-kubra) ni mkusanyiko wa matukio ya ajabu, yasiyoweza kukosewa ambayo yanakaribiana karibu na mwisho kabisa. Qur'ani inabainisha kwamba 'baadhi ya dalili zake zimekwisha kuja' (Qur'ani 47:18) - rejea inayoeleweka kuwa ni pamoja na kuja kwa Mtume ﷺ mwenyewe na kupasuka kwa mwezi.",
      "Nakala ya nanga ya alama kuu ni Hadiyth ya Hudhayfah ibn Usayd, ambamo Mtume ﷺ ameorodhesha kumi: Moshi (Dukhan), Dajjal, Mnyama wa ardhi (Dabbat al-Ard), kuchomoza kwa jua kutoka sehemu yake ya machweo (magharibi), kushuka kwa Isa bin Maryam, Majugdis tatu na Majugdi (Majugdi) na Majugdi tatu. upande wa mashariki, mmoja magharibi, na mwingine katika Bara Arabu - uliotiwa muhuri na moto unaowapeleka watu mahali pao pa kukutanikia (Sahih Muislamu 2901). Al-Mahdi na Dajjal wamekuja katika riwaya zingine zilizo sahihi na zimewekwa kabla ya kushuka kwa ́Iysaa.",
      "Msimamo wa kielimu waaminifu ni kwamba wakati kila ishara inathibitishwa, mpangilio wao kamili haujawekwa kikamilifu na maandiko, na wanachuoni wanaoheshimika wa Sunni wanatofautiana juu ya mlolongo sahihi. Tofauti hiyo ni sehemu ya kawaida ya mila na hakuna sababu ya mabishano. Mwitikio wa kinabii kwa hayo yote si uzushi wa kutisha au ubashiri usio na mwisho juu ya matukio ya sasa, bali iman iliyoongezeka, toba, na hatua ya manufaa.",
    ],
    quran: [
      {
        excerpt:
          "Wanakuuliza kuhusu Saa (ya Kiyama): lini kufika kwake? Sema: Ilimu yake iko kwa Mola wangu Mlezi. Hakuna atakaye dhihirisha wakati wake ila Yeye. Ni zito katika mbingu na ardhi. Hayatakujieni ila kwa ghafla.",
      },
      {
        excerpt:
          "Je! wanangoja isipokuwa iwafikie Saa kwa ghafla? Baadhi ya ishara zake tayari zimekuja. Lakini vipi, itakapowafikia, watakumbushwa?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Haitakuja Saa mpaka muone dalili kumi kabla yake: Moshi, Dajjal, Mnyama, kuchomoza jua kutoka magharibi, kushuka kwa Isa bin Maryam, Yaajuj na Majuj, maporomoko matatu ya ardhi, moja mashariki, moja magharibi na moja katika Bara Arabu - na mwisho wao ni moto wao unaowakusanya watu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ishara ndogo",
    summary: "Mabadiliko ya taratibu aliyoyaeleza Mtume ﷺ - kujitayarisha juu ya hofu.",
    body: [
      "Alama ndogondogo ni mabadiliko ya polepole, yanayoongezeka katika jamii, maadili na hali ya elimu ambayo Mtume (Swalla Allaahu ´alayhi wa sallam) aliieleza kuwa inaongezeka kadiri Saa inavyosogea. Wao ni wengi, na kwa asili yao hujitokeza kwa muda mrefu badala ya wakati mmoja wa kushangaza. Ishara kubwa kuliko zote, kwa hakika, imekwisha tokea: Kutumwa kwa Mtume Muhammad (Swalla Allaahu 'alayhi wa aalihi wa sallam) mwenyewe, ambaye alisema, 'Mimi na Saa tulitumwa kama hivi viwili,' akiunganisha vidole vyake viwili - maana yake mjumbe wa mwisho na zama za mwisho zilikuwa zimeanza.",
      "Miongoni mwa dalili zilizotajwa katika Hadith sahihi: kupotea uaminifu, ili mambo yakabidhiwe kwa wale wasiofaa kwao - 'Inapopotea amana, basi ingojeni Saa,' na hii hutokea 'wakati mamlaka inapotolewa kwa wale wasiostahiki' (Sahih al-Bukhari 6496). Katika hadithi mashuhuri ya Jibril, Mtume (ﷺ) alizitaja dalili mbili za wazi: ‘kwamba kijakazi atamzaa bibi yake, na kwamba utawaona wachungaji wasio na viatu, uchi na fukara wakishindana katika kujenga majengo marefu’ (Sahih Muislamu 8).",
      "Nyingine ni pamoja na kuongeza kasi ya jumla katika hisia ya wakati, ongezeko la matetemeko ya ardhi na mauaji, na kutoweka kwa ujuzi. Juu ya elimu, Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) alikuwa sahihi kuhusu utaratibu: “Kiyama hakitasimama mpaka elimu iondolewe, matetemeko ya ardhi yaongezeke, muda unapita haraka, dhiki kutokea, na mauaji yanaongezeka” (Sahih al-Bukhari 1036). Na akaeleza jinsi elimu inavyoondoka: ‘Mwenyezi Mungu haiondoi elimu kwa kuinyakua kutoka kwa watu, bali kwa kuwatoa wanachuoni, mpaka pasiwepo hata mmoja, na watu wanawafanya wajinga kuwa ni viongozi wanaoulizwa na kutoa hukumu bila ya kujua, basi wanapotea na kuwapoteza wengine’ (Swahiyh al-Bukhari 100). Kwa hivyo 'kupoteza maarifa' sio uhaba wa habari - umri unaweza kuzama katika data - lakini upotezaji wa wasomi wa sauti na mazoezi ya kuishi.",
      "Nidhamu muhimu hapa: inafasiri, si hakika, kutangaza kwamba tukio mahususi la kisasa 'ni' Hadith fulani iliyotimizwa. Mashindano ya angani au uhalifu unaoongezeka unaweza kurudia maneno ya Mtume, lakini kuweka ufunuo kwenye vichwa vya habari kwa kujiamini sio njia ya wanazuoni makini. Jibu sahihi kwa kila dalili ndogo ni ya ndani: isome kama wito wa kurejea kwa Mwenyezi Mungu, kujifunza na kuifanyia kazi dini, na kushikamana na uaminifu na ukweli - sio kama nyenzo ya wasiwasi au tamasha.",
    ],
    hadith: [
      {
        excerpt:
          "Wakati uaminifu umepotea, subiri Saa. Ikaulizwa: Vipi itapotea ewe Mtume wa Mwenyezi Mungu? Akasema: Wakipewa mamlaka wale wasiostahiki, basi ingojeeni Saa.",
      },
      {
        excerpt:
          "Miongoni mwa alama za Saa ya Kiyama: kwamba kijakazi atamzaa bibi yake, na kwamba utawaona wachungaji wasio na viatu, uchi, fukara wakishindana katika ujenzi wa majengo marefu. - kutoka kwa Hadiyth ya Jibril.",
      },
      {
        excerpt:
          "Mwenyezi Mungu haiondoi elimu kwa kuinyakua, bali huiondoa kwa kuwachukua wanachuoni, mpaka isibaki hata mmoja na watu wakawafanya wajinga kuwa ni viongozi wanaotoa hukumu bila ya kujua, basi wanapotea na kuwapoteza wengine.",
      },
    ],
    disclaimer:
      "Kutumia ishara maalum ndogo kwa matukio fulani ya sasa ni tafsiri, sio hakika. Moduli hii inawasilisha hadith sahihi bila kudai ni matukio yapi ya kisasa ambayo hakika yanayatimiza.",
    actions: [
      "Tafuta maarifa yenye manufaa kutoka kwa walimu waliohitimu, yafanyie kazi, na yapitishe - hii inapinga moja kwa moja ishara ya kutoweka kwa maarifa.",
      "Linda uaminifu na ukweli katika usemi wako, kazi yako na matendo yako.",
      "Soma kila ishara kwa ndani kama mwito wa toba, si kama kichocheo cha hofu au uvumi mtandaoni.",
    ],
  },
  {
    title: "Ishara kuu",
    summary: "Ishara kumi kuu katika Sahih Muislamu - Mahdi, Dajjal, 'Isa, na zaidi.",
    body: [
      "Ishara kuu ni matukio makubwa, yasiyoweza kukosewa ambayo hukusanyika karibu na mwisho wa wakati. Mkataba wao ni Hadiyth ya Hudhayfah bin Usayd: Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) akawatazama maswahaba zake wakiijadili Saa na akasema haitakuja mpaka waone dalili kumi: Moshi (Dukhan), Dajjal, Mnyama wa ardhi (Dabbat al-Ard), kuchomoza kwa jua kutoka magharibi, kushuka kwa Yajudi, Mahari tatu, Mayahudi na Madina. magharibi na Uarabuni), na hatimaye moto unaowapeleka watu mahali pao pa kukutanikia (Sahih Muislamu 2901). Tofauti na ishara ndogo, hizi zinapoanza hufuatana kwa karibu.",
      "Al-Mahdi amekuja katika riwaya sahihi kama kiongozi muadilifu kutoka katika nyumba ya Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) ambaye ataijaza ardhi kwa uadilifu kama ilivyokuwa imejaa dhulma (Sunan Abi Dawud 4282, hasan). Yeye si mtoa sheria au Mtume mpya - anahuisha, hazushi - na imani juu yake inathibitishwa na Ahlul-Sunnah huku maelezo ya ziada katika riwaya dhaifu yakiwekwa kando.",
      "Dajjal (Masihi wa uwongo) ndiye mtihani mkubwa kabisa wa kidunia. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) alimuelezea kwa kirefu katika Hadith ndefu ya al-Nawwas ibn Sam’an (Sahih Muislamu 2937): “Mdanganyifu mwenye jicho moja lililoandikwa ‘Kafir’ katikati ya macho yake, alitoa uwezo wa kupima imani, ambaye kila Mtume aliwaonya watu wake juu yake. Fitnah yake haishindwi kwa hoja bali kwa imani thabiti, na Mtume ﷺ alifundisha kuhifadhi aya za mwanzo za Surat al-Kahf kama kinga.",
      "Kisha Isa ibn Maryam (amani iwe juu yake) atateremka - uhakika madhubuti wa itikadi ya Sunni. Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) amesema: “Naapa kwa Yule ambaye nafsi yangu imo Mikononi mwake, basi hivi karibuni atashuka bin Maryam akiwa ni mtawala muadilifu. atauvunja msalaba, ataua nguruwe, na atakomesha jizyah, na mali itafurika mpaka hakuna atakayeikubali” (Sahih al-Bukhari 3448). Anashuka kama mfuasi wa Muhammad ﷺ, anaswali nyuma ya imamu wa umma (Sahih al-Bukhari 3439), anamuua Dajjal, na anatawala kwa Sharia ya Muhammad ﷺ. Kisha Ya'juj na Ma'juj huachiliwa, na ishara zilizobakia hufunguka mpaka moto unaowakusanya watu.",
      "Pointi mbili za uaminifu. Kwanza, wanavyuoni wanakubaliana juu ya uhalisia wa kila dalili katika Hadith yenye dalili kumi lakini wanatofautiana katika mpangilio wao sahihi, na tofauti hiyo ni halali na ya zamani. Pili, Dukhan na Mnyama ni sehemu ya Hadith hii Sahih yenyewe; baadhi ya masimulizi mengine yanayoelezea kila mmoja wao hutofautiana katika nguvu, kwa hivyo moduli hii inaweka imani kwenye ripoti kali ya ishara kumi badala ya nyongeza dhaifu.",
    ],
    hadith: [
      {
        excerpt:
          "Haitakuja Saa mpaka muone dalili kumi: Moshi, Dajjal, Mnyama, kuchomoza jua kutoka magharibi, kushuka kwa Isa bin Maryam, Yaajuj na Majuj, na maporomoko matatu ya ardhi - moja mashariki, moja magharibi na moja katika Bara Arabu - mwisho wao ni moto unaowakusanya watu.",
      },
      {
        excerpt:
          "Naapa kwa Ambaye nafsi yangu imo Mikononi mwake, basi hivi karibuni atashuka mwana wa Maryam akiwa mtawala muadilifu. Atauvunja msalaba, kuua nguruwe, na kukomesha jizyah, na mali itakuwa nyingi sana kwamba hakuna mtu atakayeikubali.",
      },
      {
        excerpt:
          "Lau ingebakia siku moja tu ya dunia hii, Mwenyezi Mungu angeirefusha siku hiyo mpaka atakapomletea mtu katika familia yangu (Mahdi) ambaye ataijaza ardhi kwa uadilifu kwa vile ilivyokuwa imejaa dhulma na dhulma.",
      },
    ],
    disclaimer:
      "Ukweli wa dalili kuu unathibitishwa, lakini mlolongo wao kamili na wakati wake haukubaliwa kikamilifu na wanachuoni. Epuka kupanga tarehe na epuka kudai mtu yeyote wa siku hizi ni Mahdi, Dajjal, au Isa.",
    appLinks: [{}],
  },
  {
    title: "Baragumu",
    summary: "Israfil - mlipuko wa kwanza, mlipuko wa pili, na ufufuo.",
    body: [
      "Mwenyezi Mungu atakapo amuru mwisho, Malaika aliyekabidhiwa Baragumu ataipiga. Kumtaja kwa jina la Israfil kunatokana na hadithi ya kielimu; Qur'ani inachokirekebisha kwa uthabiti ni tukio lenyewe na utisho wake. Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) ameeleza jinsi ilivyo karibu kila wakati: 'Nitawezaje kustarehe na hali mbeba Baragumu ameliweka mdomoni mwake, ameinamisha paji la uso wake, na anangojea amri ipigwe?' — na hayo yalipowahuzunisha maswahaba akawafundisha kusema, ‘Mwenyezi Mungu anatutosheleza, na Yeye ndiye Mbora wa mambo’ (Jami’ at-Tirmidhi 2431, hasan).",
      "Kuna milipuko miwili, na Qur'ani inaipambanua. Mara ya kwanza, 'Tarumbeta itapulizwa, na watakufa waliomo mbinguni na ardhini, isipokuwa amtakaye Mwenyezi Mungu' (Qur'ani 39:68) - mlio wa vitisho na mauti unaomaliza utaratibu ulioumbwa. Kisha inakuja ya pili: 'kisha itapulizwa tena, na mara watakuwa wamesimama wakitazama' (aya hiyo hiyo inaendelea) - mlipuko wa ufufuo, ambapo viumbe vyote vinafufuka kutoka kwa wafu.",
      "Wanachuoni wengi, kutoka katika aya hiyo hiyo na riwaya zinazounga mkono, wanazungumzia jambo la kipekee - wale 'Awapendao Mwenyezi Mungu' wasiopigwa - na juu ya muda kati ya milipuko miwili, ingawa urefu na maelezo yake yanatokana na riwaya zenye nguvu tofauti na zimeachwa kwa Mwenyezi Mungu. Hakika ni jozi ya milipuko: mwisho, kisha kuinua. Hii inaitwa 'Siku ya Onyo' (Qur'ani 50:20) kwa sababu ni wito wa mwisho, unaotolewa wakati hakuna tena wakati wa kujiandaa - ndiyo maana hasa wito huo lazima ujibiwe sasa.",
    ],
    quran: [
      {
        excerpt:
          "Na litapulizwa barugumu, na watakufa waliomo mbinguni na waliomo ardhini isipokuwa amtakaye Mwenyezi Mungu. Kisha itapigwa tena, na mara moja watakuwa wamesimama, wakitazama.",
      },
      {
        excerpt: "Na Baragumu itapulizwa. Hiyo ndiyo Siku ya Maonyo.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Nitastarehe vipi na hali mbeba Baragumu ameliweka mdomoni mwake na akainamisha paji la uso wake, akingoja amri ipigwe? Maswahaba wakahuzunika, akawaambia waseme: Mwenyezi Mungu anatutosha, na Yeye ndiye Mbora wa mambo.",
      },
    ],
  },
  {
    title: "Ufufuo",
    summary: "Miili iliyorejeshwa - umoja wa kusimama mbele ya Mwenyezi Mungu.",
    body: [
      "Katika mlipuko wa pili wafu wanafufuliwa, mwili na roho, na ufufuo ni halisi na wa kimwili, si wa kiroho tu. Qur'ani inakutana na dharau ya mwenye shaka uso kwa uso: mtu anainua mfupa unaovunjika na kuuliza ni nani angeweza kuupa uhai; Jibu ni, 'Sema: Atamfufua aliyeiumba mara ya kwanza, na Yeye ni Mjuzi wa viumbe vyote' (Qur'ani 36:78-79). Na lau kuwa katika uwezo wa Mwenyezi Mungu kukutoeni hali si kitu, basi kukurejesheni si jambo gumu zaidi.",
      "Ufufuo ni wa ulimwengu wote - kila mwanadamu kutoka wa kwanza hadi wa mwisho, wa kila taifa, anainuliwa. Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) alielezea hali ya watu kuinuka: 'Watu watakusanywa peku, uchi na wasiotahiriwa.' Aisha alipouliza kwa mshangao kama wanaume na wanawake watatazamana, alisema jambo la Siku hiyo litakuwa zito sana kwa hilo kumhusu mtu yeyote (Swahiyh al-Bukhari 6527). Pia alisema, 'Mtakusanywa bila viatu, uchi na hamjatahiriwa - na wa kwanza kuvikwa Siku ya Kiyama atakuwa Ibrahim' (Sahih al-Bukhari 3349).",
      "Jambo la fundisho sio tamasha bali ni jukumu linalotekeleza. Kwa sababu marejeo ya Mwenyezi Mungu ni ya hakika, hakuna amali iliyo siri na hakuna kifo ni njia ya kuepusha. “Saa inakuja, hapana shaka nayo, na Mwenyezi Mungu atawafufua walio makaburini” (Qur’ani 22:7). Imani katika ufufuo wa mwili ndiyo inayofanya uzito wa kimaadili wa maisha haya kuwa halisi badala ya kuwa wa muda.",
    ],
    quran: [
      {
        excerpt:
          "Na anatupigia mfano, na akasahau kuumbwa kwake, na kusema: Ni nani atakayeihuisha mifupa na hali imeharibika? Sema: Atawahuisha aliye waumba mara ya kwanza, na Yeye ni Mjuzi wa viumbe vyote.",
      },
      {
        excerpt:
          "Na kwamba Saa itakuja, hapana shaka juu yake, na kwamba Mwenyezi Mungu atawafufua walio makaburini.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Utakusanywa bila viatu, uchi na hujatahiriwa. Kisha akasoma: Kama tulivyouanza uumbaji wa kwanza, tutaurudia. Na wa kwanza kuvikwa nguo Siku ya Kiyama ni Ibrahim.",
      },
      {
        excerpt:
          "Watu watakusanywa bila viatu, uchi na wasiotahiriwa. Aisha akasema: Je, wanaume na wanawake watatazamana? Akasema: Jambo hilo litakuwa kubwa mno.",
      },
    ],
  },
  {
    title: "Mkusanyiko (Mahshar)",
    summary: "Kusimama mbele ya Mwenyezi Mungu - jua karibu, jasho, na hali za watu.",
    body: [
      "Baada ya ufufuo, viumbe vyote vinasukumwa kwenye uwanda mmoja mkubwa, tambarare - Mahshar - kusubiri hukumu. Ardhi yenyewe inageuzwa: “Siku ardhi itabadilishwa na ardhi nyingine, na mbingu pia, na watatoka mbele ya Mwenyezi Mungu Mmoja, Mwenye kushinda.” (Qur’ani 14:48). Hakuna alama, hakuna umati wa kujificha, hakuna hadhi ya kuegemea - ni kila roho tu, iliyofichuliwa na kusubiri.",
      "Masharti ya kusimama huko ni kali. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) amesema: “Siku ya Qiyaamah jua litaletwa karibu na watu kiasi kwamba litakuwa umbali wa maili moja, na watatokwa na jasho lao kwa mujibu wa matendo yao – wengine kwenye vifundo vyao vya miguu, wengine magotini, wengine viunoni, na wengine jasho litakuwa lijamu” (Sahih Muislamu 2864). Lakini riwaya hizo hizo zinaelezea rehema iliyogawanywa kwa vitendo: kundi la Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) litatiwa kivuli kwenye kivuli cha Arshi ya Mwenyezi Mungu siku ambayo hakuna kivuli isipokuwa Chake - miongoni mwao ni kiongozi muadilifu, na kijana aliyeinuliwa katika ibada, na aliyetoa sadaka kwa siri mkono wake wa kushoto hajui unatoa nini mkono wake wa kulia.",
      "Kusubiri ni muda mrefu - Qur'ani inazungumzia 'Siku ambayo kipimo chake ni miaka hamsini elfu' (Qur'ani 70:4) - lakini urefu wake si sawa kwa wote. Ripoti za kweli zinasema itafanywa kuwa nyepesi kwa muumini, kwa ufupi kama muda kati ya sala mbili, wakati inasisitiza sana kwa wengine. Kwa hiyo Mahshar ni pale ambapo daftari la kibinafsi la maisha linakuwa ukweli wa umma: jua lile lile, uwanda uleule, na uzoefu tofauti kabisa, unaotokana kabisa na yale ambayo kila mtu aliyatanguliza.",
    ],
    quran: [
      {
        excerpt:
          "Siku itapobadilishwa ardhi na ardhi nyingine, na mbingu pia, na watatoka mbele ya Mwenyezi Mungu, Mmoja, Mwenye kushinda.",
      },
      {
        excerpt:
          "Malaika na Roho hupanda Kwake katika Siku ambayo kipimo chake ni miaka khamsini elfu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Jua litaletwa kwa watu Siku ya Kiyama mpaka lifike umbali wa maili moja, na watatokwa na jasho kwa mujibu wa vitendo vyao - wengine miguuni mwao, wengine magotini, wengine viunoni, na wengine jasho litawashika hatamu.",
      },
    ],
  },
  {
    title: "Uombezi (Shafaa ́ah)",
    summary: "Kwa idhini ya Mwenyezi Mungu, mifano na uombezi mkubwa kabisa.",
    body: [
      "Shafaa ni uombezi - kundi moja linazungumza na Mwenyezi Mungu kwa niaba ya jingine. Ni ya kweli na ni rehema, lakini haijitegemei: hapana aombeaye ila kwa idhini ya Mwenyezi Mungu ila kwa yule Anayemridhia. Qur'ani inaeleza kanuni mara mbili: 'Ni nani awezaye kumuombea isipokuwa kwa idhini yake?' (Qur’ani 2:255), na ‘Uombezi haufai kitu Kwake isipokuwa kwa yule Anayemruhusu’ (Qur’ani 34:23). Sharti hili pekee ndilo linalotenganisha mafundisho ya Kiislamu ya uombezi na kila upotovu wake.",
      "Kubwa kuliko zote ni al-Shafa'ah al-'Udhma, pekee kwa Mtume Muhammad ﷺ. Juu ya Mahshar, iliyovunjwa kwa muda mrefu, watu watatoka kwa Nabii hadi Nabii - Adam, Ibrahim, Musa, Isa - kila mmoja akijitolea nafsi yake, mpaka wafike kwa Muhammad ﷺ. Atasujudu chini ya Arshi na kuambiwa, 'Inua kichwa chako, omba na utapewa, ombea na uombezi wako utakubaliwa' (Sahih al-Bukhari 7440; mlolongo kamili wa Mitume upo katika Sahih Muislamu 195). Kwa hayo anamwomba Mwenyezi Mungu aanze hisabu na aondoe kisimamo - kisimamo cha sifa alichoahidiwa yeye peke yake.",
      "Namna nyingine zilizo sahihi zinafuata: uombezi kwamba baadhi ya waumini waingie Peponi bila ya hesabu; maombezi yanayoinua daraja; na juu ya yote uombezi wa wakosefu wakubwa miongoni mwa Waumini, ili watu watolewe Motoni kwa uombezi wa Mtume ﷺ, Mitume wengine, Malaika, Waumini, na hatimaye rehema ya Mwenyezi Mungu, ambaye ni Mwingi wa Rehema kuliko wanaorehemu. Manabii, mashahidi, watu wema, na hata watoto waliokufa wakiwa wachanga wanaweza kuombea kwa ruhusa, ingawa nguvu ya ripoti za mtu binafsi inatofautiana.",
      "Tahadhari muhimu: uombezi katika Akhera kamwe hautoi leseni ya kuwaita wafu au wasiokuwepo kwa ajili ya usaidizi sasa. Kumuomba Nabii au walii kaburini, kuwaomba awaondolee dhiki au watoe haja, ni kuelekeza ibada kwa asiyekuwa Mwenyezi Mungu - hiyo ni shirki, na ni kinyume cha shafaa iliyoelezwa hapa, ambayo ni neema ambayo Mwenyezi Mungu humpa siku hiyo amtakaye. Wala haibadilishi hitaji la imani na toba katika maisha haya; ni rehema ya Mwenyezi Mungu kwa walio hai na wakafa juu ya tawhiyd.",
    ],
    quran: [
      {
        excerpt:
          "Ni nani awezaye kumuombea isipokuwa kwa idhini yake? Anayajua yaliyo mbele yao na yatakayokuwa baada yao, na wao hawajumui chochote katika ilimu yake ila apendavyo.",
      },
      {
        excerpt: "Na uombezi haumnufaishi Yeye ila kwa yule Aliyemruhusu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Watu watanijia na nitaanguka kwa kusujudu mbele ya Mwenyezi Mungu, na itasemwa: Ewe Muhammad, inua kichwa chako; ombeni nanyi mtapewa, ombeni na maombezi yenu yatakubaliwa.",
      },
      {
        excerpt:
          "Wanaadamu watakwenda kwa Adam, kisha kwa Ibrahim, kisha kwa Musa, kisha kwa Isa, na kila mmoja atajitolea nafsi yake, mpaka wafike kwa Muhammad (Swalla Allaahu 'alayhi wa aalihi wa sallam), na kwake yeye ndiye anayepewa uombezi mkubwa zaidi.",
      },
    ],
    misconceptions: [
      "Dhana potofu: Kuomba uombezi maana yake ni Mtume ﷺ au watu wema wanaabudiwa. Masahihisho: Ibada ni ya Mwenyezi Mungu peke yake; Shafaa ya Siku ya Mwisho ni rehema Mwenyezi Mungu anaitoa kwa idhini yake, na haihalalishi kuwaita wafu katika maisha haya.",
    ],
  },
  {
    title: "Rekodi ya Matendo",
    summary: "Kurekodi malaika - mkono wa kulia, mkono wa kushoto, hakuna kitu kilichoachwa.",
    body: [
      "Kila mwanadamu ana waandishi wawili watukufu waliopewa kazi ya kuandika matendo yao: ‘Wapokezi wawili wanapopokea, walioketi kulia na kushoto, hatamki neno lolote bali yuko pamoja naye mwangalizi aliye tayari kuandika’ (Qur’ani 50:17–18). Katika Siku ya Mwisho kumbukumbu hizi zinatolewa, na namna ya kupokea kitabu cha mtu yenyewe ndiyo hukumu ya kwanza - katika mkono wa kulia kwa waliofaulu, kwa mkono wa kushoto au kutoka nyuma ya mgongo kwa walioharibika (Qur'ani 84:7–12; 69:19–37).",
      "Hakuna kitu kinachoachwa kutoka kwa rekodi hizi - sio kitendo kidogo zaidi, sio mawazo ya muda mfupi ambayo yalifanyika tendo. Watastaajabishwa na madhalimu kwa ukamilifu wake. Watasema: Ole wetu! Ni kitabu gani hiki ambacho hakiachi chochote kidogo au kikubwa isipokuwa kwamba kimekiandika? Na watayakuta waliyo kuwa wakiyatenda yakiwa mbele yao, na Mola wako Mlezi hamdhulumu yeyote.” (Qur’ani 18:49). Kwa rehema ya Mwenyezi Mungu, nia njema na madhambi yaliyoachwa pia yameandikwa kwa neema ya Muumini.",
      "Kwa sababu ulimi na viungo ndivyo vinavyojaza kurasa, kuvilinda ni kulinda kumbukumbu. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) aliufanya ulimi kuwa msingi wa wokovu: “Yeyote anayenidhaminia yaliyo baina ya taya zake na yaliyo baina ya miguu yake, basi mimi namdhaminia Pepo” (Swahiyh al-Bukhari 6474) – yaani, yeyote anayelinda maneno yake na usafi wake. Tabia ya kila siku ya kujikagua kwa uaminifu - kuuliza kile kilichoongezwa kwenye kitabu leo ​​- ni moja wapo ya mazoea muhimu na muhimu ambayo mwamini anaweza kushika.",
    ],
    quran: [
      {
        excerpt:
          "Na itawekwa kumbukumbu, na utawaona wakosefu wanaogopa yaliyomo ndani yake, wakisema: Ole wetu! Ni kitabu gani hiki ambacho hakiachi chochote kidogo au kikubwa isipokuwa kwamba kimekiandika? Na watayakuta waliyo kuwa wakiyatenda yakihudhuriwa, na Mola wako Mlezi hamdhulumu yeyote.",
      },
      {
        excerpt:
          "Ama atakaye pewa daftari lake kwa mkono wake wa kulia, atasema: Haya! Nilikuwa na hakika ningekutana na akaunti yangu. Kwa hivyo atakuwa katika maisha ya kupendeza. Lakini atakaye pewa kitabu chake kwa mkono wake wa kushoto atasema: Laiti nisingalipewa daftari langu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mwenye kunidhaminia yaliyo baina ya taya zake na yaliyo baina ya miguu yake, basi mimi namdhaminia Pepo - maana ya ulimi wake na utupu wake.",
      },
    ],
    actions: [
      "Linda ulimi kuliko kitu kingine chochote - mengi ya yale yanayojaza rekodi kwa mema au mabaya hupita juu yake.",
      "Kagua siku yako kabla ya kulala: uliza nini ungependa, na nini ungeogopa, kuona kimeandikwa katika kitabu chako.",
    ],
    appLinks: [{}],
  },
  {
    title: "Kiwango (Mizan)",
    summary: "Matendo yaliyopimwa - uaminifu, tabia, na dhikr hufanya mizani kuwa nzito.",
    body: [
      "Mizani ni Mizani ambayo matendo yanapimwa kwa uadilifu kamili: 'Tunaweka mizani ya uadilifu kwa ajili ya Siku ya Kiyama, kwa hivyo hakuna nafsi itakayodhulumiwa chochote; hata ikiwa uzito wa chembe ya haradali tutaitoa, na tunatosha sisi kuwa wahisani.” (Qur’ani 21:47). Ahlul-Sunnah wanaithibitisha kuwa ni mizani ya kweli, si sitiari tu - matendo, au kumbukumbu zake, hupimwa kikweli. Hatima ya mtu huigeukia sufuria ambayo huzama: 'Ama yule ambaye mizani yake ni nzito, atakuwa katika maisha ya raha; lakini ambaye mizani yake ni nyepesi, kimbilio lake ni shimo.” (Qur’ani 101:6–9).",
      "Kinachofanya mizani kuwa nzito si ujazo wa shughuli bali uzito wake mbele ya Mwenyezi Mungu, na uzito unatokana na ikhlasi. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) aliashiria vitendo ambavyo havina juhudi lakini ni vikubwa sana: ‘Maneno mawili mepesi kwenye ulimi, mazito kwenye Mizani, kipenzi cha Mwingi wa Rehema: SubhanAllahi wa bihamdih, SubhanAllahil-‘Azim’ (Sahih al-Bukhari 6406). Pia alisema, 'Hakuna kitu kizito zaidi kwenye Mizani ya Muumini Siku ya Kiyama kuliko tabia njema' (Jami' at-Tirmidhi 2002, Sahih). Kwa hiyo ukumbusho rahisi unaorudiwa kwa unyoofu, au tabia njema yenye subira, unaweza kupita milima ya utendaji wa kujionyesha.",
      "Kinyume chake ni hatari ya matendo matupu. Vitendo vinavyofanywa ili kuonekana na watu (riya') au kupotoshwa na unafiki vinaweza kufika kwenye Mizani isiyo na uzito - kubwa ya nje, tupu ndani. Ndiyo maana uaminifu (ikhlas) si fadhila moja miongoni mwa nyingi bali ni jambo lenyewe linaloipa kila amali nyingine uzito wake. Funzo ni kuijenga siku kwa vitendo vidogo, vya ikhlasi, vilivyo thabiti, na kutakasa nia nyuma ya yale yanayoonekana.",
    ],
    quran: [
      {
        excerpt:
          "Na tunaweka mizani ya uadilifu kwa Siku ya Kiyama, basi hakuna nafsi itakayodhulumiwa chochote. Na ikiwa ni uzito wa chembe ya haradali tutaileta, na tunatosha kuwa wahisani.",
      },
      {
        excerpt:
          "Ama yule ambaye mizani yake ni nzito, atakuwa katika maisha ya raha. Lakini mtu ambaye mizani yake ni nyepesi, kimbilio lake litakuwa shimo.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Maneno mawili mepesi kwenye ulimi, mazito kwenye Mizani, kipenzi cha Mwingi wa Rehema: SubhanAllahi wa bihamdih, SubhanAllahil-'Azim.",
      },
      {
        excerpt:
          "Hakuna kizito katika Mizani ya Muumini Siku ya Kiyama kuliko tabia njema. Hakika mwenye tabia njema hufikia daraja ya mwenye kufunga na kuswali.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Uwajibikaji (Hisab)",
    summary: "Hesabu rahisi, hesabu ya kina, na haki zinazodaiwa na wengine.",
    body: [
      "Hisab ni hesabu, kila mtu anapoitwa kuwajibika kwa ajili ya maisha yake. Qur'ani Tukufu inaeleza matukio mawili tofauti kabisa juu yake: 'Ama atakayepewa daftari lake kwa mkono wake wa kulia, atahukumiwa kwa hisabu nyepesi na atarejea kwa watu wake kwa furaha; lakini aliyepewa kumbukumbu zake nyuma ya mgongo wake ataita maangamizo” (Qur’ani 84:7–11). 'Hesabu rahisi' ni rehema, sio kutochunguzwa - Mtume ﷺ alionya kwamba ukali wa kuuliza yenyewe ni aina ya adhabu.",
      "Mke wa Mtume ﷺ mwenyewe anasimulia tofauti kuu. Aisha alimsimulia akisema, 'Yeyote atakayehesabiwa ataangamizwa.' Akasema: Je! Mwenyezi Mungu hasemi: Atahukumiwa kwa hisabu nyepesi? Akajibu: Huo ni udhihirisho wa vitendo tu; lakini atakayeulizwa juu ya hesabu hiyo ataangamizwa” (Sahih al-Bukhari 6537). Kwa hiyo tumaini la mwamini si kukwepa uchunguzi wote bali kuonyeshwa matendo yake, kufunikwa dhambi zake, na kusamehewa - badala ya kuchunguzwa kipengele kwa kipengele.",
      "Kuna kundi la deni ambalo hata msamaha wa Mwenyezi Mungu haufuti tu: haki za watu wengine (huquq al-'ibad). Mtume ﷺ akauliza: Je, unamjua aliyefilisika? Wakasema: Mtu asiye na pesa. Akasema: Mufilisi wa Ummah wangu ni yule anayekuja Siku ya Qiyaamah kwa Swalah, Saumu na Sadaka, lakini ambaye alimtukana huyu, akamsingizia kwamba, akachukua mali ya mwingine, na kumwaga damu ya mwengine - basi wema wake hukabidhiwa kwao, na pindi wema wake unapokwisha hubebeshwa juu yake dhambi zao, na anatupwa Motoni 1 Muislamu. Ibada haibatilishi dhuluma; kutatua dhuluma tu.",
      "Hitimisho la kivitendo ni la dharura na mahususi: madeni ambayo hayajalipwa, mali iliyoibiwa, kashfa, na amana zilizovunjika lazima zirekebishwe katika maisha haya - kwa njia ya toba kwa Mwenyezi Mungu na urejeshaji na kuomba msamaha kwa watu - kwa sababu ni nafuu zaidi kukaa katika sarafu ya fedha na unyenyekevu sasa kuliko katika sarafu ya wema wakati huo. Na katika hayo yote uadilifu wa Mwenyezi Mungu ni kamilifu na rehema yake inamzunguka kila aliyepigania kwa ikhlasi na akatubia.",
    ],
    quran: [
      {
        excerpt:
          "Ama atakaye pewa daftari lake kwa mkono wake wa kulia, atahukumiwa kwa hisabu nyepesi na atarejea kwa watu wake kwa furaha. Lakini atakaye pewa daftari lake nyuma ya mgongo wake atalia maangamizo na ataingia Motoni.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Yeyote anayeitwa kuwajibika ataangamizwa. Aisha akasema: Je! Mwenyezi Mungu hasemi kuwa atahukumiwa kwa hisabu nyepesi? Akasema: Huko ni kudhihirisha vitendo tu. lakini atakaye ulizwa juu ya hesabu yake ataangamizwa.",
      },
      {
        excerpt:
          "Je! unajua ni nani aliyefilisika? Yeye ndiye atakayekuja Siku ya Kiyama kwa Swalah, Saumu na Sadaka, lakini alikuwa akiwatukana, akawatukana na kuwadhulumu wengine, basi wanapewa mema yake, na yanapokwisha huwekwa juu yake na anatupwa Motoni.",
      },
    ],
    actions: [
      "Lipa deni na urudishe chochote kilichochukuliwa bila haki, hata kiwe kidogo, kabla ya siku iliyopangwa kufika.",
      "Tafuta na uombe msamaha kwa mtu yeyote uliyemkosea kwa neno, mali au heshima - kurejesha sasa ni nafuu zaidi kuliko kurejesha wakati huo.",
      "Tubuni kwa Mwenyezi Mungu kwa haki, na ziwekeni daftari mbili, za Mwenyezi Mungu na za kibinadamu.",
    ],
    appLinks: [{}],
  },
  {
    title: "Bwawa (Hawd)",
    summary: "Bahari ya Mtume ﷺ ni nani anakunywa na kugeuzwa.",
    body: [
      "Hawd ni bonde kubwa alilopewa Mtume Muhammad ﷺ Siku ya Qiyaamah, ni rehema kwa ummah wake wenye kiu katika Siku hiyo kali na yenye kuchosha. Maelezo yake ni mengi na sahihi: 'Hawd yangu ni safari ya mwezi kuvuka; maji yake ni meupe kuliko maziwa, na harufu yake ni tamu kuliko miski, na vikombe vyake ni kama nyota za mbinguni. Yeyote atakayekunywa humo hataona kiu tena” (Sahih al-Bukhari 6579). Imani katika Hawd ni sehemu ya imani ya Sunni, iliyoanzishwa na ripoti zinazopitishwa kwa wingi.",
      "Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) mwenyewe atawapokea wafuasi wake huko: ‘Nitafikia Hawd kabla yenu, na nitawaangalia wale wanaonijia miongoni mwenu’ (Swahiyh Muislamu 2292). Anautambua ummah wake kwa nuru ya nyuso zao, mikono na miguu yao kutokana na athari za wudhu. Kuifikia ni kuzimwa milele; unalishwa, kwa ufahamu mzuri, na al-Kawthar, mto Mwenyezi Mungu aliompa Mtume wake (Swalla Allaahu 'alayhi wa aalihi wa sallam) peponi.",
      "Lakini wengine watafukuzwa kutoka kwa Hawd. Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) alieleza kuambiwa watu fulani, 'Hao si katika nyinyi; wakabadili dini baada yenu, au wakarudi nyuma kwa visigino vyao. Wanachuoni wako makini na hili: inahusu makundi maalum katika Hadith - kama vile uasi na kaburi, uzushi wa kimakusudi katika dini baada ya mwongozo ulio wazi - na kwa msisitizo sio leseni kwa Waislamu wa kawaida kutupiana lawama. Njia iliyo salama ya Hawd ni kushika Sunnah, kuchunga wudhu na kuswali, na kuweka umoja wa waumini.",
    ],
    hadith: [
      {
        excerpt:
          "Hawd yangu ni safari ya mwezi mzima. Maji yake ni meupe kuliko maziwa, na harufu yake ni tamu kuliko miski, na vikombe vyake ni vingi kama nyota za angani. Yeyote atakayekunywa humo hataona kiu tena.",
      },
      {
        excerpt:
          "Nitaifikia Hawd iliyo kabla yenu, na nitawatazama wale wanaonijia miongoni mwenu. Wataondolewa watu kutoka kwangu, nami nitasema: Mola wangu Mlezi, masahaba wangu! Itasemwa: Wewe hujui waliyozua baada yako.",
      },
    ],
    disclaimer:
      "Ripoti kuhusu wale waliojitenga na Hawd zinarejelea makundi maalum yaliyotajwa katika Hadith, hasa uasi na uzushi mkubwa katika dini. Wao si leseni kwa Waislamu kutangaza upotevu wao kwa wao.",
  },
  {
    title: "Daraja (Sirat)",
    summary: "Kuvuka Kuzimu - kasi kulingana na matendo na rehema.",
    body: [
      "Sirat ni daraja lililonyoshwa juu ya Jahannam, na kila mtu lazima apite juu yake - muumini na kafiri sawa sawa. Qur'ani Tukufu inathibitisha kuvuka bila ya kubagua: 'Hapana yeyote katika nyinyi isipokuwa ataufikia. Hayo ni juu ya Mola wako Mlezi yaliyo faradhishiwa. Kisha tutawaokoa walio mcha Mwenyezi Mungu, na tutawaacha madhalimu humo wamepiga magoti.” (Qur’ani 19:71–72). Kifungu ni cha ulimwengu wote; kuwasili salama upande wa mbali ni jambo zima, na amepewa na Mwenyezi Mungu wale anaowalinda.",
      "Namna ya kuvuka huwekwa na matendo anayoleta mtu. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) ameeleza: “Daraja litawekwa juu ya Jahannam… na wa kwanza wenu atapita kama umeme, kisha kama upepo, kisha kama ndege, kisha kama mkimbiaji kwa mujibu wa vitendo vyao—na Mtume wako amesimama juu ya daraja akisema: “Ewe Mola Wahifadhi, Walinde. Wengine wameokolewa bila kujeruhiwa, wengine wanakwaruzwa na kuachiwa, na wengine wanatupwa Motoni” (Sahih al-Bukhari 6573). Kando ya daraja, katika ripoti hiyo hiyo, simama uaminifu (amana) na uhusiano wa jamaa - picha ya kushangaza kwamba uaminifu katika amana na dhamana za familia huambatana na mtu kuvuka.",
      "Nuru na kasi kwenye Sirat hupatikana katika maisha haya. Sala inayofanywa kwa wakati, hisani inayotolewa mara kwa mara, uaminifu katika shughuli, na tabia njema huwa, kwa hakika, msingi na nuru ambayo mtu huvuka kwayo. Mtume (Swalla Allaahu ´alayhi wa sallam) atawaombea Waumini huko, na ni kwa rehema za Mwenyezi Mungu kwamba mtu yeyote atafika upande wa pili.",
      "Kama ilivyo kwa vituo vingine visivyoonekana, njia ya busara si kukisia juu ya vipimo vya kimwili vya daraja - jinsi nyembamba, jinsi kali, kwa muda gani - zaidi ya kile ambacho ufunuo unasema, lakini kuzingatia kabisa matendo ambayo hufanya mwanga wa kuvuka. Kile ambacho huwezi kupiga picha, bado unaweza kujiandaa.",
    ],
    quran: [
      {
        excerpt:
          "Na hapana yeyote katika nyinyi ila ataifikia. Hayo ni juu ya Mola wako Mlezi yaliyo faradhishiwa. Kisha tutawaokoa walio mcha Mwenyezi Mungu, na tutawaacha madhalimu humo wamepiga magoti.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Daraja litawekwa juu ya Kuzimu, na nitakuwa wa kwanza kuvuka. Watu watapita juu yake kwa kadiri ya matendo yao - kama umeme, kama upepo, kama ndege, kama mtu anayekimbia, nikisema: Ee Bwana, uwalinde, uwalinde. Wengine wameokolewa, wengine wanakwaruzwa na kutolewa, na wengine wanaanguka Motoni.",
      },
    ],
    actions: [
      "Omba sala tano kwa wakati - sala ni nuru inayoongoza kuvuka daraja.",
      "Toa hisani mara kwa mara, hata kwa kiasi kidogo.",
      "Shikeni mafungamano ya jamaa na zilinde amana zenu - katika Hadith wanasimama kando ya Sirat yenyewe.",
    ],
  },
  {
    title: "Paradiso",
    summary: "Malipo ya milele ni furaha yake na, juu ya yote, kumuona Mwenyezi Mungu.",
    body: [
      "Jannah ni nyumba ya milele ambayo Mwenyezi Mungu amewaandalia waumini, jambo ambalo haliwezi kufikiwa. Katika Hadith tukufu Mtume ﷺ anasimulia kwamba Mwenyezi Mungu anasema kuhusu hilo: “Nimewaandalia waja Wangu wema kile ambacho jicho halijapata kuona, sikio halijasikia, na moyo wa mwanadamu haujapata kuchukua mimba” (Swahiyh al-Bukhari 3244). Mito yake, mabustani, majumba na usahaba vimeelezwa ndani ya Qur'ani ili kuuvuta moyo, lakini maelezo ni viashiria vya furaha inayowazidi kikamilifu.",
      "Malipo makubwa kuliko yote si bustani wala mto ila radhi ya Mwenyezi Mungu na uoni wa uso wake. “Siku hiyo nyuso zitang’aa, zikimtazama Mola wao Mlezi” (Qur’ani 75:22–23) — inayoeleweka na Ahlul-Sunnah kuwa ni Waumini wanaomtazama Mwenyezi Mungu huko Akhera, neema ya Peponi, iliyotolewa kwa namna inayolingana na utukufu Wake na isiyo na mfano wa viumbe. Mwenyezi Mungu anaahidi: 'Kwa wale waliofanya wema watapata malipo bora na zaidi' (Qur'ani 10:26) - na 'zaidi' inaelezwa katika hadithi sahihi kama uoni huu wa Uso Wake mtukufu.",
      "Kuingia Peponi ni kwa rehema ya Mwenyezi Mungu, iliyo fumbatwa kwa imani na vitendo vyema - viwili hivyo havipingiwi: Rehema ndio sababu, na amali ni Ishara na njia ambayo Mwenyezi Mungu amefungamana nayo. Siku ya Mwisho inaisha, kwa watu wa Peponi, katika neema isiyofifia na isiyoisha. Moduli hii inaweka matibabu yake ya Paradiso kwa ufupi kwa makusudi; mwongozo kamili wa Safari ya kwenda Jannah unafunika milango yake, madaraja yake, amali zinazoiongoza, na dua zake kwa kina.",
    ],
    quran: [
      {
        excerpt:
          "Na kimbilieni maghfira kutoka kwa Mola wenu Mlezi na Pepo iliyo upana wa mbingu na ardhi, iliyo andaliwa kwa ajili ya wachamngu.",
      },
      {
        excerpt: "Siku hiyo nyuso zitang'aa zikimtazama Mola wao Mlezi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mwenyezi Mungu anasema: Nimewaandalia waja Wangu wema ambayo jicho halijapata kuona, sikio halijasikia, na ambayo moyo wa mwanadamu haujapata kuwaza.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kuzimu",
    summary: "Onyo la kweli - adhabu ya kweli, na mlango wa kutoroka ukiwa hai.",
    body: [
      "Jahannam ni makazi halisi ya adhabu, si ishara au sitiari ya hali mbaya ya akili. Kuiamini ni sehemu ya kuamini ghaibu na uadilifu wa Mwenyezi Mungu. Qur’ani inaonya kwa uwazi kabisa: “Kwa wale waliomkufuru Mola wao Mlezi ni adhabu ya Jahannamu, na ni ubaya wa marudio” (Qur’ani 67:6). Ukali wake umeelezewa ili kuamsha, si kukidhi udadisi: 'Moto ambao kuni zake ni watu na mawe' (Qur'ani 2:24), unaolindwa na Malaika wakali wasiomuasi Mwenyezi Mungu katika yale Anayoamrisha.",
      "Makusudio ya maonyo haya ni rehema kwa kujificha. Zipo ili kuvunja kiburi, kukomesha kukataa kweli kwa kuendelea, na kumrudisha mtu nyuma kabla haijachelewa. Ndio maana maonyo katika Qur'ani karibu kila mara yanaambatanishwa na mlango ulio wazi wa toba - maana ya kuuelezea Moto ni kwa usahihi ili watu wauepuke wakati bado wanaweza. Adhabu yake ni ya uadilifu. Haingii humo ila kwa hiari yao wenyewe dhidi ya uwongofu ulio wazi, na Mwenyezi Mungu hamdhulumu yeyote.",
      "Kwa waumini wanaobeba madhambi, imani thabiti ya Sunni ni mizani baina ya khofu na matumaini: mtenda dhambi yuko chini ya matakwa ya Mwenyezi Mungu - Anaweza kusamehe, au kutakasa katika Moto na kisha, kwa uombezi na rehema iliyoelezwa hapo awali, amtoe humo kila aliyekuwa na chembe hata ya imani. Moduli hii inatoa Jahannamu matibabu mafupi na kipimo kwa makusudi. Utafiti kamili wa maonyo yake, madhambi makubwa, na milango mikubwa ya toba na rehema unapatikana katika moduli ya Uelewa wa Jahannam na mada zinazohusiana na aqeedah - zinazoshughulikiwa kila mara kwa matumaini, kamwe hazikati tamaa.",
    ],
    quran: [
      {
        excerpt:
          "Na walio mkufuru Mola wao Mlezi watapata adhabu ya Jahannamu, na ni maangamivu marejeo.",
      },
      {
        excerpt:
          "Sema: Enyi waja wangu mliojidhulumu nafsi zao, msikate tamaa na rehema ya Mwenyezi Mungu. Hakika Mwenyezi Mungu husamehe dhambi zote. Hakika Yeye ni Mwenye kusamehe, Mwenye kurehemu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nani anaingia bila hesabu?",
    summary: "Hadith Sahihi juu ya wale wanaokwepa hisab - majadiliano ya kielimu.",
    body: [
      'Miongoni mwa rehema za Siku ya Mwisho ni kwamba kundi la ummah huu linaingia Peponi bila hesabu yoyote. Mtume (Swalla Allaahu \'alayhi wa aalihi wa sallam) amesema: "Wataingia Peponi elfu sabini bila hesabu," na kwa maneno mengine, "kila elfu na sabini elfu zaidi." Maswahaba walipojiuliza wao ni akina nani, aliwaeleza: “Hao ni wale ambao hawatafuti ruqyah kutoka kwa wengine, hawaamini ishara mbaya, hawaogopi, na wanamtegemea Mola wao Mlezi” (Sahih al-Bukhari 6541).',
      "Moyo wa maelezo hayo ni tawakkul - kumtegemea Mwenyezi Mungu kwa kina, kwa vitendo - pamoja na uhuru kutoka kwa ushirikina na kutoka kwa utegemezi wa wasiwasi juu ya sababu. Hailaani kutafuta matibabu yanayoruhusiwa; Ruqyah anajisomea mwenyewe na dawa halali zote zimethibiti katika Sunnah. Kinachosifiwa ni yule ambaye tegemeo lake liko kwa Mwenyezi Mungu kikamilifu kiasi kwamba hawazunguki kuwaomba wengine hirizi za kiroho au kushikamana na ishara.",
      "Wanachuoni wanaijadili idadi yenyewe: wengine wanashikilia kwamba elfu sabini ni halisi, wengine kwamba inazidishwa sana na riwaya za ziada, na wengine bado kwamba inaashiria wingi usio na shaka wa neema za Mwenyezi Mungu badala ya hesabu iliyowekwa. Wanachokubaliana juu yake ni ukweli wa msingi - kwamba rehema ya Mwenyezi Mungu inazidi sana kile ambacho utunzaji wa hesabu wa mwanadamu ungetarajia, na kwamba wokovu wa mwisho ni kwa rehema hiyo.",
      "Hiki ni kituo cha matumaini, si mwanya wa uvivu. Humtia msukumo muumini kuelekea kwenye kumtegemea Mwenyezi Mungu kikweli na kujiepusha na ushirikina, huku akiendelea kujitahidi katika ibada. Hakuna anayeichuma kwa kupuuza matendo; mtu huvutwa kuelekea humo kwa ikhlasi, uaminifu, na moyo ulioshikamana na Mwenyezi Mungu badala ya hirizi na khofu.",
    ],
    hadith: [
      {
        excerpt:
          "Elfu sabini katika Ummah wangu wataingia Peponi bila hesabu, ni wale ambao hawatafuti ruqyah kutoka kwa wengine, hawaamini ishara mbaya, hawahatarishi, na wanamtegemea Mola wao Mlezi.",
      },
    ],
    disclaimer:
      "Wanachuoni wanatofautiana iwapo 'bila hesabu' maana yake ni elfu sabini maalum au idadi kubwa zaidi isiyoweza kubainika. Wote wanakubali kwamba wokovu wa mwisho ni kwa rehema ya Mwenyezi Mungu, na kwamba hii ni sababu ya matumaini, sio ya kupuuza matendo.",
  },
  {
    title: "Kujitayarisha kwa Siku ya Mwisho",
    summary: "Ibada ya vitendo - unganisha kila tabia kwenye mkutano wako na Mwenyezi Mungu.",
    body: [
      "Baada ya kutembea safari nzima - kifo, kaburi, ishara, Baragumu, mkusanyiko, kumbukumbu, Mizani, hesabu, Daraja, na nyumba mbili - jibu pekee la akili ni kujiandaa. Lakini maandalizi sio hofu. Mtume ﷺ hakuwaacha maswahaba wake wakiwa na khofu na kupooza; akawaacha wakifanya kazi. Msingi wa yote hayo ni tawhiyd na ikhlasi (ikhlas): amali inakubaliwa pale tu inapofanywa kwa ajili ya Mwenyezi Mungu peke yake na kwa mujibu wa Sunnah, hivyo kabla ya kuongeza amali nyingi zaidi, safisha nia nyuma ya yale uliyonayo tayari.",
      "Jenga siku kwenye nguzo maandishi yaliyofanywa kuwa mazito kwenye Mizani. Swalah kwa wakati ndio nanga na nuru ya Sirat. Qur'ani - inayosomwa, kusikia, na kutafakari, hata aya chache kila siku - huweka moyo kuwa hai. Tawbah inafuta kumbukumbu: “Enyi waumini, tubuni kwa Mwenyezi Mungu toba ya kweli.” (Qur’ani 66:8). Sadaka husafisha mali na kukuishia kama sadaqah jariyah. Dhikr huweka ulimi mzito kwenye Mizani na maneno mepesi kwenye ulimi. Na tabia njema, Mtume ﷺ amesema, ni kitu kizito kinachowekwa kwenye Mizani.",
      "Linda mambo mawili ambayo Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) aliyofungamanishwa moja kwa moja na Pepo - ulimi na usafi (Sahih al-Bukhari 6474) - kwa sababu haya, zaidi ya madhambi makubwa, ndiyo yanajaza au kufilisi kumbukumbu. Na suluhisheni haki za watu mkiwa bado mnaweza: lipa deni, lirudisheni lililochukuliwa, ombeni msamaha kwa madhara, na fanyeni uadilifu katika kila jambo, ili msije mkafika kuwa 'mufilisi' ambaye maombi yake huliwa na madai ya wale aliowadhulumu.",
      "Kila kitu kinategemea nia moja, iliyoelezwa katika hadithi ya kwanza ya Sahih al-Bukhari: 'Matendo hayawi ila kwa makusudio.' Tumia vifuatiliaji vya Munib kama alama ya kushindana bali kama kiunzi laini cha tabia hizi - sala, Qur'ani, dhikr, sadaka, toba - kila moja ikielekeza siku yako kwa utulivu kuelekea mkutano na Mwenyezi Mungu. Hilo ndilo lengo zima: kuishi sasa kama mtu ambaye kweli anatarajia kusimama mbele zake.",
    ],
    quran: [
      {
        excerpt: "Nami sikuwaumba majini na watu ila waniabudu Mimi.",
      },
      {
        excerpt:
          "Enyi mlioamini tubuni kwa Mwenyezi Mungu toba ya kweli. Huenda Mola wenu Mlezi akakufutieni maovu yenu, na akakuingizeni katika Mabustani yapitayo mito kati yake.",
      },
    ],
    hadith: [
      {
        excerpt: "Vitendo ni kwa nia, na kila mtu atakuwa na kile alichokusudia.",
      },
      {
        excerpt:
          "Mwenye kunidhaminia yaliyo baina ya taya zake na yaliyo baina ya miguu yake - ulimi wake na utupu wake - mimi namdhaminia Pepo.",
      },
    ],
    actions: [
      "Omba sala tano za kila siku kwa wakati.",
      "Soma au sikiliza Qur'ani kila siku - hata aya chache.",
      "Weka adhkar asubuhi na jioni.",
      "Toa hisani mara kwa mara, hata kwa kiasi kidogo.",
      "Tubu kila siku na utafute msamaha kwa ikhlasi.",
      "Linda ulimi na usafi, na shika kila ahadi na uaminifu.",
      "Timiza haki zinazodaiwa na familia, majirani, na wadai.",
      "Tafakari katika shajara yako ya maombi juu ya khushu na uaminifu wa nia.",
    ],
    appLinks: [{}, { label: "Nzito katika mizani" }, {}, {}, {}, {}, {}],
  },
  {
    title: "Amali nzito katika mizani",
    summary: "Amali ndogo zenye ikhlasi zitakuwa nzito Siku ya Kiyama.",
    body: [
      "Allah huangalia ikhlasi, si wingi pekee.",
      "Ulimi, tabia na moyo vina uzito.",
      "Ongeza mema madogo ya kudumu.",
    ],
    mizanDeeds: [
      {
        title: "Tabia njema",
        summary: "Upole na muamala mwema.",
        hadith: {
          excerpt: "Hakuna kizito zaidi katika mizani kuliko tabia njema.",
        },
      },
      {
        title: "Maneno mawili",
        summary: "Mepesi ulimini, mazito mizani.",
        hadith: {
          excerpt: "Subhanallahi wa bihamdihi, Subhanallahil-azim.",
        },
      },
      {
        title: "Alhamdulillah",
        summary: "Hujaza mizani.",
        hadith: {
          excerpt: "Alhamdulillah hujaza mizani.",
        },
      },
      {
        title: "Kadi",
        summary: "Tawhidi hushinda madhambi.",
        hadith: {
          excerpt: "Kadi ya La ilaha illallah hufanya mizani nzito.",
        },
      },
      {
        title: "Dhikri bora",
        summary: "Tamka tawhidi.",
        hadith: {
          excerpt: "Dhikri bora ni La ilaha illallah.",
        },
      },
      {
        title: "Maneno manne",
        summary: "Yanayopendwa na Allah.",
        hadith: {
          excerpt: "Subhanallah, Alhamdulillah, La ilaha illallah, Allahu akbar.",
        },
      },
      {
        title: "Tasbihi mia",
        summary: "Sababu ya msamaha.",
        hadith: {
          excerpt: "Mwenye kusema Subhanallah mara mia husamehewa.",
        },
      },
    ],
    quran: [
      {
        excerpt: "Mizani itawekwa kwa uadilifu.",
      },
      {
        excerpt: "Mwenye mizani nzito atakuwa katika maisha ya kuridhisha.",
      },
    ],
    hadith: [
      {
        excerpt: "Amali ipendwayo ni yenye kudumu hata ikiwa ndogo.",
      },
      {
        excerpt: "Usidharau wema wowote.",
      },
      {
        excerpt: "Tabasamu lako ni sadaka.",
      },
      {
        excerpt: "Muislamu ni yule watu wako salama na ulimi na mkono wake.",
      },
    ],
    misconceptions: ["Wingi bila ikhlasi hautoshi.", "Amali za moyo zina umuhimu."],
    actions: [
      "Fanya dhikri kila siku.",
      "Boresha tabia.",
      "Chagua amali ndogo ya kudumu.",
      "Anza kwa ikhlasi.",
    ],
    appLinks: [
      {
        label: "Dhikri ya kila siku",
      },
      {
        label: "Dua",
      },
      {
        label: "Kusoma Qurani",
      },
      {
        label: "Shajara ya sadaka",
      },
      {
        label: "Kukuza tabia",
      },
    ],
  },
];

export const LAST_DAY_HADITH_SW: DeepPartial<LastDayHadithEntry>[] = [
  {
    hadith: {
      excerpt: "Kumbuka mara nyingi mharibifu wa anasa - maana yake kifo.",
    },
    context:
      "Kukumbuka kifo kwa ukawaida hulainisha moyo, huondoa kinyongo, na kusahihisha mambo ya kutanguliza bila kukata tamaa.",
  },
  {
    hadith: {
      excerpt:
        "Asife yeyote katika nyinyi ila hali ya kuwa anamtukuza Mwenyezi Mungu, na akiifikiri rehema ya Mola wake Mlezi.",
    },
    context:
      "Mwisho mwema (husn al-khatimah) unatarajiwa kwa imani ya kweli, toba, na matarajio mema ya Mwenyezi Mungu.",
  },
  {
    hadith: {
      excerpt: "Kaburi ima ni Bustani itokayo katika Pepo au shimo kutoka kwenye mashimo ya Moto.",
    },
    context:
      "Barzakh inajumuisha malipo au adhabu kaburini, kwa hekima ya Mwenyezi Mungu - kaburi huakisi matendo ya mtu mwenyewe.",
  },
  {
    hadith: {
      excerpt:
        "Marehemu anapozikwa, wanakuja Malaika wawili na kumuuliza juu ya Mola wake, Dini yake, na Nabii wake.",
    },
    context:
      "Kuswali kaburini kunathibitishwa katika ripoti sahihi; katika riwaya hii Malaika wawili wanaitwa Munkar na Nakir.",
  },
  {
    hadith: {
      excerpt:
        "Anapokufa mtu hukatika amali zake isipokuwa tatu: Sadaka inayoendelea, elimu ambayo kwayo hupatikana manufaa, au mtoto mwema anayemuombea dua.",
    },
    context:
      "Ni nini kinachoendelea kumnufaisha marehemu - kilichothibitishwa katika Hadith Sahih.",
  },
  {
    hadith: {
      excerpt:
        "Mtakusanywa bila viatu, uchi na hamjatahiriwa - na wa kwanza kuvikwa nguo Siku ya Kiyama ni Ibrahim.",
    },
    context: "Unyenyekevu Siku ya Mkusanyiko; Mwenyezi Mungu humtukuza amtakaye apendavyo.",
  },
  {
    hadith: {
      excerpt:
        "Litasogezwa jua kwa watu Siku ya Kiyama mpaka likawa umbali wa maili moja, na watazama kwa jasho lao kwa mujibu wa vitendo vyao.",
    },
    context: "Masharti juu ya Mahshar - ukali hutofautiana kwa vitendo katika riwaya sahihi.",
  },
  {
    hadith: {
      excerpt:
        "Watu watanijia na nitaanguka kwa kusujudu mbele ya Mwenyezi Mungu, na itasemwa: Inua kichwa chako; ombeni nanyi mtapewa, ombeni na maombezi yenu yatakubaliwa.",
    },
    context: "Uombezi mkubwa kabisa - al-Shafa'ah al-'Udhma, pekee kwa Mtume ﷺ.",
  },
  {
    hadith: {
      excerpt:
        "Yeyote anayeitwa kuwajibika ataangamizwa. Aisha akauliza: Je, Mwenyezi Mungu hasemi kuwa atahukumiwa kwa hisabu nyepesi? Akasema: Huko ni kudhihirisha vitendo tu. lakini atakaye ulizwa juu ya hesabu yake ataangamizwa.",
    },
    context:
      "'Akaunti rahisi' ni rehema - kuonyeshwa matendo ya mtu na kusamehewa, si jambo linalochunguzwa kwa kipengele.",
  },
  {
    hadith: {
      excerpt:
        "Muflisi wa Ummah wangu ni yule anayekuja na Swalah, Saumu na Sadaka, lakini alikuwa akiwatukana, akawatukana na kuwadhulumu wengine - basi wanapewa mema yake, na dhambi zao zinabebeshwa juu yake.",
    },
    context:
      "Haki za watu (huquq al-'ibad) hazifutwi tu kwa ibada; lazima walipwe au walipwe kwa Siku hiyo.",
  },
  {
    hadith: {
      excerpt:
        "Elfu sabini katika Ummah wangu wataingia Peponi bila hesabu: wale ambao hawatafuti ruqyah kutoka kwa wengine, hawaamini ishara mbaya, hawaongoi, na wanaomtegemea Mola wao Mlezi.",
    },
    context:
      "Wanachuoni wanatofautiana juu ya kama idadi hiyo ni halisi au inaashiria wingi mkubwa zaidi wa rehema za Mwenyezi Mungu.",
  },
  {
    hadith: {
      excerpt:
        "Hawd yangu ni safari ya mwezi mzima. Maji yake ni meupe kuliko maziwa, na harufu yake ni tamu kuliko miski, na vikombe vyake ni vingi kama nyota za angani. Yeyote atakayekunywa humo hataona kiu tena.",
    },
    context: "Bwawa ni rehema kwa umma wa Muhammad ﷺ siku ya kiu.",
  },
  {
    hadith: {
      excerpt:
        "Daraja limewekwa juu ya Kuzimu. Watu huvuka kwa mujibu wa matendo yao - kama umeme, kama upepo, kama ndege, kama mtu anayekimbia - na wengine hupigwa na kuokolewa, wakati wengine huanguka.",
    },
    context: "Kasi ya kuvuka huonyesha imani na matendo; Rehema ya Mwenyezi Mungu ni kubwa.",
  },
  {
    hadith: {
      excerpt:
        "Haitakuja Saa mpaka muone dalili kumi: Moshi, Dajjal, Mnyama, kuchomoza jua kutoka magharibi, kushuka kwa Isa bin Maryam, Yaajuj na Majuj, maporomoko matatu ya ardhi, na moto unaowapeleka watu kwenye mkusanyiko wao.",
    },
    context:
      "Ishara kumi kuu, kutoka kwa Hudhayfah ibn Usayd. Wanachuoni wanathibitisha kila ishara lakini wanatofautiana katika mfuatano halisi.",
  },
  {
    hadith: {
      excerpt:
        "Naapa kwa Ambaye nafsi yangu imo Mikononi Mwake, basi hivi karibuni atashuka mwana wa Maryam akiwa mtawala muadilifu. atauvunja msalaba, ataua nguruwe, na atakomesha jizyah, na mali itafurika mpaka hakuna atakayeikubali.",
    },
    context:
      "Kushuka kwa Isa ni nukta madhubuti ya itikadi ya Sunni; anatawala kwa Sharia ya Muhammad ﷺ.",
  },
  {
    hadith: {
      excerpt:
        "Wakati uaminifu umepotea, subiri Saa. Iliulizwa: Itapoteaje? Akasema: Wakati mamlaka yanapotolewa kwa wale wasiostahiki.",
    },
    context: "Ishara ndogo inayojulikana - kupoteza uaminifu. Kuzingatia maandalizi, si hofu.",
  },
  {
    hadith: {
      excerpt:
        "Mwenyezi Mungu haiondoi elimu kwa kuipokonya, bali kwa kuwachukua wanavyuoni, mpaka isibaki hata mmoja na watu wakawachukua wajinga kuwa ni viongozi wanaotoa hukumu bila ya kujua, basi wanapotea na kuwapoteza wengine.",
    },
    context:
      "'Kupoteza maarifa' kunamaanisha kupotea kwa wasomi wazuri na mazoezi ya kuishi - sio uhaba wa habari.",
  },
  {
    hadith: {
      excerpt: "Usafi ni nusu ya imani.",
    },
    context: "Imani huipa mizani uzito.",
  },
  {
    hadith: {
      excerpt: "Neno jema ni sadaka.",
    },
    context: "Ulimi mwema una thawabu.",
  },
  {
    hadith: {
      excerpt: "Allah hupenda upole.",
    },
    context: "Tenda kwa upole kila siku.",
  },
];

export const LAST_DAY_VERSES_SW: DeepPartial<LastDayVerseEntry>[] = [
  {
    excerpt:
      "Kila nafsi itaonja mauti, na mtapewa ila Siku ya Kiyama ujira wenu kamili. Basi anaye tolewa na Moto na akaingizwa Peponi amefaulu, na maisha ya dunia ni starehe ya udanganyifu.",
    context:
      "Kifo ni cha ulimwengu wote na maisha haya ni ya muda; usuluhisho wa kweli na wa mwisho wa hesabu unakuja tu Siku ya Mwisho.",
    tafsirSummary:
      "Aya inafafanua tena mafanikio: sio mali au hadhi hapa, lakini kuokolewa na Moto na kuingizwa Peponi hapo.",
  },
  {
    excerpt:
      "Siku hiyo watu watatoka kwa makundi makundi tofauti ili waonyeshwe vitendo vyao. Basi anayefanya chembe ya wema atauona, na anayefanya chembe ya ubaya atauona.",
    context:
      "Haki kamilifu na kamili - tendo dogo kabisa, jema au baya, hurekodiwa na kurudishwa kwa mtendaji wake.",
    tafsirSummary:
      "Hakuna kitu kidogo sana kuhesabu. Aya hii ni tahadhari ya maisha yote dhidi ya kutupilia mbali dhambi 'ndogo' na kutia moyo kwa maisha 'madogo' mema.",
  },
  {
    excerpt:
      "Na tunaweka mizani ya uadilifu kwa Siku ya Kiyama, basi hakuna nafsi itakayodhulumiwa chochote. Hata ikiwa ni uzito wa chembe ya haradali tutaitoa, na Sisi tunatosha kuwa wahisani.",
    context: "Mizan (Mizani) ni halisi na haki yake ni kamili.",
    tafsirSummary:
      "Hakuna mtu siku hiyo atakayepunguzwa uzito wa chembe ya haradali; Hesabu ya Mwenyezi Mungu haina dosari.",
  },
  {
    excerpt:
      "Ama yule ambaye mizani yake ni nzito, atakuwa katika maisha mazuri. Lakini mtu ambaye mizani yake ni nyepesi, kimbilio lake litakuwa shimo.",
    context: "Matokeo ya mwisho yanageuza uzito wa matendo ya haki ya mtu kwenye Mizani.",
    tafsirSummary:
      "Uzito unatokana na unyoofu, si ujazo tu - dhikr rahisi alisema inaweza kupita milima ya shughuli za kujionyesha.",
  },
  {
    excerpt:
      "Na kimbilieni maghfira kutoka kwa Mola wenu Mlezi na Pepo iliyo upana wa mbingu na ardhi, iliyo andaliwa kwa ajili ya wachamngu.",
    context:
      "Amri ya moja kwa moja ya kukimbilia wema na msamaha kabla ya kukutana na Mwenyezi Mungu.",
    tafsirSummary:
      "Pepo ni kubwa zaidi ya kufikiria, na njia ya kuiendea ni haraka - sio kuahirisha toba na amali njema.",
  },
  {
    excerpt: "Siku hiyo nyuso zitang'aa zikimtazama Mola wao Mlezi.",
    context:
      "Malipo makubwa zaidi ya Pepo si bustani wala mto ila kuutazama Uso wa Mwenyezi Mungu.",
    tafsirSummary:
      "Ahlul-Sunnah wanathibitisha kwamba Waumini watamuona Mola wao Akhera, kwa namna inayolingana na utukufu wake na bila mfano wa viumbe - taji ya neema zote.",
  },
  {
    excerpt:
      "Na walio mkufuru Mola wao Mlezi watapata adhabu ya Jahannamu, na ni maangamivu marejeo.",
    context: "Kuzimu ni matokeo ya kweli na ya haki - makao halisi, sio ishara.",
    tafsirSummary:
      "Onyo hilo ni rehema inayokusudiwa kumrudisha mtu nyuma wakati ungalipo; daima imeunganishwa katika Qur'ani na mlango ulio wazi wa toba.",
  },
  {
    excerpt:
      "Sema: Enyi waja wangu mliojidhulumu nafsi zao, msikate tamaa na rehema ya Mwenyezi Mungu. Hakika Mwenyezi Mungu husamehe dhambi zote. Hakika Yeye ni Mwenye kusamehe, Mwenye kurehemu.",
    context: "Ingawa dhambi ni kubwa kiasi gani, mlango wa toba ya kweli hubaki wazi hadi kifo.",
    tafsirSummary:
      "Kukata tamaa kwa rehema ya Mwenyezi Mungu ni kutoka kwa Shetani; Muumini husawazisha khofu ya Moto na matumaini yasiyokatika katika msamaha wa Mwenyezi Mungu.",
  },
  {
    excerpt:
      "Na kwamba Saa itakuja, hapana shaka juu yake, na kwamba Mwenyezi Mungu atawafufua walio makaburini.",
    context: "Ufufuo ni hakika, ingawa wakati wake umefichwa.",
    tafsirSummary:
      "Uhakika kuhusu Saa, ukiambatanishwa na kutokuwa na uhakika kuhusu wakati wake, ndiyo hasa inayoimarisha uwajibikaji wa kimaadili kwa sasa.",
  },
  {
    excerpt:
      "Ni nani awezaye kumuombea isipokuwa kwa idhini yake? Anayajua yaliyo mbele yao na yatakayokuwa baada yao, na wao hawajumui chochote katika ilimu yake ila apendavyo.",
    context: "Uombezi (shafaa) ni wa kweli lakini kamwe hautegemei idhini ya Mwenyezi Mungu.",
    tafsirSummary:
      "Sharti hili pekee - 'isipokuwa kwa idhini Yake' - ndilo linalotenganisha uombezi wa kweli na kila uharibifu wake, na linakataza kuwaita wafu katika maisha haya.",
  },
  {
    excerpt:
      "Wala usidhani Mwenyezi Mungu hana khabari na wanayoyafanya madhalimu. Hakika Yeye anawachelewesha ila Siku ambayo macho yatakodoka kwa khofu.",
    context: "Faraja kwa waliodhulumiwa - ucheleweshaji dhahiri wa haki sio kutokuwepo kwake.",
    tafsirSummary:
      "Hakuna dhulma inayosahauliwa na Mwenyezi Mungu; mwenye kudhulumu anapewa muhula mpaka Siku ambayo hakuna kitu kitapuuzwa.",
  },
  {
    excerpt:
      "Na hapana yeyote katika nyinyi ila ataifikia. Hayo ni juu ya Mola wako Mlezi yaliyo faradhishiwa. Kisha tutawaokoa walio mcha Mwenyezi Mungu, na tutawaacha madhalimu humo wamepiga magoti.",
    context:
      "Kupita juu ya Sirat ni kwa wote; kufika salama kunatolewa kwa rehema na taqwa ya Mwenyezi Mungu.",
    tafsirSummary:
      "Kila mtu anakuja kuvuka; tofauti ni nani anaokolewa na nani anaanguka - kuamuliwa kwa imani na matendo yaliyotangulia.",
  },
  {
    excerpt:
      "Wanakuuliza kuhusu Saa (ya Kiyama): lini kufika kwake? Sema: Ilimu yake iko kwa Mola wangu Mlezi. Hakuna atakaye dhihirisha wakati wake ila Yeye. Hayatakujieni ila kwa ghafla.",
    context:
      "Muda halisi anajulikana kwa Mwenyezi Mungu pekee - mambo ya maandalizi, utabiri ni bure.",
    tafsirSummary:
      "Hata Mtume ﷺ hakupewa tarehe; kila madai ya mwanadamu kwa mwaka mmoja au kuhesabu kurudi nyuma yanapingana na aya hii.",
  },
  {
    excerpt:
      "Ama atakaye pewa daftari lake kwa mkono wake wa kulia, atasema: Haya! Nilikuwa na hakika kwamba ningekutana na akaunti yangu. Kwa hivyo atakuwa katika maisha ya kupendeza.",
    context:
      "Namna ya kupokea kitabu cha mtu - mkono wa kulia au wa kushoto - yenyewe ndiyo hukumu ya kwanza.",
    tafsirSummary:
      "Furaha ya waliofaulu ni furaha ya hakika yenye thawabu: waliishi wakitarajia hisabu, na inafika kama kitulizo, si mshtuko.",
  },
];

export const LAST_DAY_TIMELINE_SW: DeepPartial<LastDayTimelineEvent>[] = [
  {
    title: "Maisha katika ulimwengu huu",
    body: "Muda mfupi uliowekwa wa kuamini, kuabudu, na kujiandaa. Ulimwengu huu sio nyumba ya mwisho - ni uwanja wa vitendo.",
  },
  {
    title: "Kifo",
    body: "Kila nafsi itaonja mauti. Muumini hukutana nayo kwa kutaraji rehema za Mwenyezi Mungu; kughafilika huifanya kuwa ya ghafla na chungu.",
  },
  {
    title: "kaburi",
    body: "Baada ya kuzikwa, roho huingia barzakh. Kaburi ni hatua ya kwanza ya Akhera kwa kila mtu.",
  },
  {
    title: "Barzakh",
    body: "Maisha kati ya kifo na ufufuo - maswali, furaha, au adhabu kulingana na ripoti za kweli.",
  },
  {
    title: "Ishara ndogo",
    body: "Mabadiliko ya taratibu ya kijamii na kimaadili aliyoyaeleza Mtume ﷺ. Wanazuoni wengi wanaona kadhaa zimeonekana; muda halisi ni wa Mwenyezi Mungu peke yake.",
  },
  {
    title: "Ishara kuu",
    body: "Matukio ya kushangaza karibu na mwisho - ikiwa ni pamoja na al-Mahdi, Dajjal, na kurudi kwa 'Isa (amani iwe juu yake) katika hadithi sahihi. Maelezo ya mlolongo hutofautiana kati ya wasomi.",
  },
  {
    title: "Baragumu",
    body: "Israfil atapiga tarumbeta. Uumbaji hufa katika mlipuko wa kwanza na hufufuliwa katika mlipuko wa pili.",
  },
  {
    title: "Ufufuo",
    body: "Miili iliyorejeshwa kutoka kwa vumbi; viumbe vyote vinasimama mbele ya Mwenyezi Mungu.",
  },
  {
    title: "Mkusanyiko (Mahshar)",
    body: "Watu wote walikusanyika bila viatu, uchi na hawajatahiriwa - Apendavyo Mwenyezi Mungu - wakingojea hukumu.",
  },
  {
    title: "Rekodi ya Matendo",
    body: "Vitabu vilivyotolewa kwa mkono wa kulia, mkono wa kushoto, au nyuma ya nyuma. Hakuna chochote kilichoachwa kutoka kwa kile kilichorekodiwa.",
  },
  {
    title: "Kiwango (Mizan)",
    body: "Matendo yamepimwa kwa haki kamilifu. Mizani nzito huleta furaha; mizani nyepesi huleta hasara.",
  },
  {
    title: "Uwajibikaji (Hisab)",
    body: "Rahisi kuhesabu kwa baadhi; maswali ya kina kwa wengine. Haki zinazodaiwa na watu hazipuuzwi.",
  },
  {
    title: "Uombezi (Shafaa ́ah)",
    body: "Kwa idhini ya Mwenyezi Mungu tu - kubwa zaidi ni ya Mtume Muhammad ﷺ.",
  },
  {
    title: "Bwawa (Hawd)",
    body: "bonde kubwa ambalo umma wa Mtume ﷺ hunywa humo Siku ya Qiyaamah.",
  },
  {
    title: "Daraja (Sirat)",
    body: "Kila mtu anavuka Jahannamu - kasi inatofautiana kwa imani na vitendo katika simulizi za kweli.",
  },
  {
    title: "Peponi au Kuzimu",
    body: "Makazi ya milele - Jannah kwa rehema ya Mwenyezi Mungu na matendo mema; Jahannam ni onyo la kweli na natija ya haki.",
  },
  {
    title: "Milele",
    body: "Hakuna kifo baada ya Akhera. Watu wa Peponi watabaki milele katika furaha; watu wa Motoni watabaki vile apendavyo Mwenyezi Mungu.",
  },
];

export const LAST_DAY_QUIZ_SW: DeepPartial<LastDayQuizQuestion>[] = [
  {
    prompt: "Imani katika Siku ya Mwisho ni mojawapo ya:",
    options: [
      "Nguzo tano za Uislamu",
      "Nakala sita za imani (Iman)",
      "Mbingu saba",
      "Masahaba kumi",
    ],
    explanation:
      "Imani inajumuisha kumuamini Mwenyezi Mungu, Malaika, vitabu, Mitume, Siku ya Mwisho, na amri ya Mwenyezi Mungu (qadr).",
  },
  {
    prompt: "Barzakh inaelezewa vyema kama:",
    options: [
      "Daraja la Kuzimu",
      "Maisha kati ya kifo na ufufuo",
      "Kiwango cha vitendo",
      "Mlio wa tarumbeta",
    ],
    explanation: "Barzakh ni muda baada ya kifo hadi Siku ya Kiyama.",
  },
  {
    prompt:
      "Kweli au si kweli: Wanachuoni wanakubaliana juu ya mfuatano kamili wa dalili zote kuu za Saa.",
    options: ["Kweli", "Uongo"],
    explanation:
      "Ishara kuu zinathibitishwa katika Hadith sahihi, lakini wanachuoni wanatofautiana katika baadhi ya maelezo ya mfuatano. Wakati wa Kiyama anajulikana kwa Mwenyezi Mungu tu.",
  },
  {
    prompt: "Mizani (mizani) ya Siku ya Mwisho inahusu:",
    options: [
      "Kupima miili ya kimwili",
      "Kupima amali kwa uadilifu kamilifu",
      "Kupima muda katika kaburi",
      "Kuhesabu malaika",
    ],
    explanation: "Mizani hupima vitendo - uaminifu na vitendo vya haki hufanya mizani kuwa nzito.",
  },
  {
    prompt: "Uombezi (shafaa) Siku ya Mwisho:",
    options: [
      "Hutokea bila idhini ya Mwenyezi Mungu",
      "Ni kwa idhini ya Mwenyezi Mungu tu",
      "Inachukua nafasi ya hitaji la imani",
      "Imekanushwa katika Qur'ani",
    ],
    explanation: "Qur'ani 2:255 na 20:109 zinathibitisha uombezi kwa idhini ya Mwenyezi Mungu tu.",
  },
  {
    prompt: "Ni kipi kinatangulia katika safari ya Akhera?",
    options: ["Ufufuo", "Kifo", "Mkusanyiko", "Baragumu"],
    explanation:
      "Mauti hutangulia barzakh, kisha - baada ya ishara na baragumu - ufufuo na mkusanyiko.",
  },
  {
    prompt: "Ni tabia gani moja utaiimarisha wiki hii ili kujiandaa kukutana na Mwenyezi Mungu?",
    explanation:
      "Maandalizi ni ya kivitendo: Swalah, Qur'ani, toba, sadaka, tabia njema, na kutimiza haki za wengine.",
  },
  {
    prompt: "Kweli au si kweli: Kwa mujibu wa Qur'ani 19:71, kila mtu atapita juu ya Sirat.",
    options: ["Kweli", "Uongo"],
    explanation:
      "Aya inasema yote yatapita juu yake; Mwenyezi Mungu huwaokoa wachamngu. Wasomi wanajadili maelezo ya nani anayeanguka.",
  },
  {
    prompt:
      "Which phrase did the Prophet ﷺ describe as light on the tongue and heavy on the Scale?",
    options: [
      "Only the five daily prayers",
      "SubhanAllahi wa bihamdih and SubhanAllahil-'Azim",
      "Any long speech in Arabic",
      "Silence alone",
    ],
    explanation:
      "Sahih al-Bukhari 6406: two words light on the tongue, heavy on the Scale, beloved to the Most Merciful.",
  },
];

export const LAST_DAY_REFERENCES_SW: DeepPartial<LastDayReferenceEntry>[] = [
  {
    title: "Qur'ani",
    note: "Chanzo kikuu cha ufufuo, uwajibikaji, Paradiso, Kuzimu, na haki ya kimungu. Aya katika moduli hii zimetajwa na surah na aya.",
  },
  {
    title: "Sahih al-Bukhari & Sahih Muislamu",
    note: "Mkusanyo wa Hadith za kisheria za kifo, kaburi, ishara, hisabu, maombezi, Hawd, na Sirat.",
  },
  {
    title: "Sunan al-Tirmidhiy & Sunan Abi Dawud",
    note: "Ripoti za ziada za kweli kuhusu kaburi na ishara ndogo - alama zinabainishwa inapohitajika.",
  },
  {
    title: "Ibn Kathir - Tafsir",
    note: "Ufafanuzi wa kitambo juu ya aya za Qur'ani kuhusu Akhera. Hutumika kwa muhtasari mfupi wa tafsir, sio kama uthibitisho huru.",
  },
  {
    title: "Al-'Aqidah al-Tahawiyyah",
    note: "Imani ya msingi ya Sunni inayothibitisha ufufuo, mizani, daraja, Paradiso, na Kuzimu.",
  },
  {
    title: "Tofauti za kitaaluma",
    note: "Ambapo wasomi hutofautiana - k.m. mlolongo wa ishara kuu, maelezo ya Hawd, kategoria zinazoingia bila hesabu - moduli hii inabainisha tofauti bila kudai mtazamo mmoja kama maoni pekee halali.",
  },
  {
    title: "Ufunuo dhidi ya tafsiri",
    note: "Qur'ani Tukufu na Hadith Mutawatir au Sahih zinatofautishwa na maoni ya kifasiri (ijtihad) na riwaya dhaifu.",
  },
];
