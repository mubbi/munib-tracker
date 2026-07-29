// Swahili translation overlays for the Learn Qur'an content.
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

export const QURAN_GUIDE_TOPICS_SW: DeepPartial<QuranGuideTopic>[] = [
  {
    title: "Utangulizi",
    summary: "Qur-aan ni nini, kwa nini iliteremshwa, na fadhila za usomaji.",
    body: [
      "Neno Qur'ani linatokana na mzizi wa Kiarabu qara'a, lenye maana ya kukariri au kusoma kwa sauti - hivyo Kitabu kimebeba makusudio yake kwa jina lake hasa: kimekusudiwa kusomwa, tena na tena, kwa ulimi na moyoni. Katika imani ya kawaida ya Sunni, Qur'ani ni neno halisi la Mwenyezi Mungu ambalo halijaumbwa, lililoteremshwa kwa Kiarabu waziwazi kwa Mtume Muhammad (Swalla Allaahu 'alayhi wa aalihi wa sallam) kupitia kwa Malaika Jibriyl kwa takribani miaka 23, kuanzia maneno ya kwanza katika Pango la Hira hadi muda mfupi kabla ya Mtume ﷺ kufariki.",
      "Ni andiko la mwisho lililotumwa kwa wanadamu, linalothibitisha ukweli katika wahyi wa awali waliopewa Musa, Dawud, na Isa (amani iwe juu yao) na kukamilisha ujumbe waliobeba. Mwenyezi Mungu anaeleza makusudio yake kwa uwazi: iliteremshwa 'kama mwongozo kwa wanadamu' - kuwatoa watu kutoka katika giza la kuchanganyikiwa na kuabudu masanamu kuwapeleka kwenye nuru ya tawhiyd, kumwabudu Mwenyezi Mungu kwa dhati, tabia iliyonyooka, na maandalizi mazito kwa maisha yajayo. Kila nabii aliita kwa msingi huo huo; Qur'ani ni umbo lake la mwisho, lililohifadhiwa.",
      "Kusoma Qur'ani yenyewe ni ibada, sio kusoma habari tu. Mtume (Swalla Allaahu ´alayhi wa sallam) alifundisha kwamba kila herufi moja inayosomwa inapata jambo jema, na kila jambo jema linazidishwa angalau mara kumi - hivyo hata anayeanza kutoa mstari mmoja tayari anakuwa anajikusanyia malipo. Siku ya Kiyama Qur'ani itakuja kama mwombezi, inawasihi wale walioshikamana nayo katika maisha haya. Mwenye kuisoma kwa ufasaha yumo katika kundi la Malaika watukufu, na mwenye kujikwaa juu yake, akijitahidi kujifunza, anapata malipo maradufu kwa juhudi.",
      "Inasaidia kuwa wazi juu ya kile ambacho Qur'ani sio. Qur'ani ni maneno ya neno la Mwenyezi Mungu mwenyewe kwa Kiarabu, ambayo hayajabadilika tangu kuteremshwa. Hadithi - kauli za Mtume ﷺ, vitendo na vibali vya kimyakimya - vimetofautiana: vinafafanua na kudhihirisha Qur'ani lakini ni usemi wa Mtume ﷺ, uliohifadhiwa kwa minyororo ya wapokezi waliotajwa na kuwekwa daraja na wanachuoni kama sahih (sahihi), hasan (nzuri), au da'if (dhaifu). Zote mbili ni wahyi na zote mbili ni za lazima, lakini ni Qur'ani tu inayosomwa kama ́ibaadah katika sala, na ni Qur'ani tu ndiyo hotuba ya muujiza na isiyo na mfano ya Mwenyezi Mungu.",
    ],
    quran: [
      {
        excerpt:
          "Mwezi wa Ramadhani ambao imeteremshwa ndani yake Qur-aan kuwa mwongozo kwa watu...",
      },
      {
        excerpt:
          "Sema: Lau wangekusanyika watu na majini kuleta mfano wa hii Qur'ani, wasingeweza...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mwenye kusoma herufi kutoka katika Kitabu cha Mwenyezi Mungu anapokea hasanah, na hasanah inazidishwa kumi.",
      },
      {
        excerpt: "Soma Qur-aan, kwani itakuja kuwa mwombezi kwa maswahaba zake Siku ya Kiyama.",
      },
      {
        excerpt:
          "Mwenye ujuzi wa Qur-aan yu pamoja na waandishi watukufu, waadilifu, na mwenye kuisoma kwa shida, akigugumia juu yake, ana ujira maradufu.",
      },
    ],
    actions: [
      "Weka muda maalum wa kila siku wa Qur'ani - hata dakika tano zinazolenga hujenga baraka na uthabiti.",
      "Soma angalau mstari mmoja wenye maana: soma Kiarabu, kisha usome tafsiri polepole.",
      "Fungua msomaji wa Kurani wa Munib na uendelee pale ulipoishia.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Jinsi Qur-aan ilivyoteremshwa",
    summary: "Pango la Hira, Jibreel, Makka na vipindi vya Madina, mkusanyiko, uhifadhi.",
    body: [
      "Uteremsho ulianza katika mwezi wa Ramadhani, wakati Mtume ﷺ alipokuwa na umri wa miaka arubaini na aliondoka kwenda kwenye pango la Hira kwenye mlima nje ya Makka kwa ajili ya upweke na kutafakari. Hapo Malaika Jibril akamjia na kuamuru: Soma! Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) ambaye alikuwa hasomi wala kuandika, akajibu kwamba hawezi - mpaka Malaika akamkumbatia na kufikisha aya tano za mwanzo za Sura al-Alaq: 'Soma kwa jina la Mola wako Mlezi aliyeumba.' Akiwa ametetemeka, alirudi nyumbani kwa mkewe Khadijah, ambaye alimtuliza na kumpeleka kwa jamaa yake Waraqah ibn Nawfal, mwanachuoni ambaye alimtambua malaika wa wahyi na akathibitisha kuwa huyu ndiye mjumbe yule yule aliyekuja kwa Musa.",
      "Kulifuata kusitishwa kwa wahyi kwa muda mfupi (fatrah), kipindi cha utulivu ambacho kilimfanya Mtume ﷺ kutamani zaidi; kisha ikaanza tena na kuendelea kwa hatua kwa maisha yake yote. Wahyi haukuteremka zote kwa wakati mmoja bali uliteremshwa kwa kujibu matukio, maswali, na mahitaji yanayoongezeka ya umma - njia ya taratibu Mwenyezi Mungu anaielezea kuwa ni kuutia nguvu moyo wa Mtume ﷺ na kukifanya Kitabu katika maisha ya watu.",
      "Kipindi cha Makkan kilidumu takriban miaka kumi na tatu. Sura zake mara nyingi ni fupi, zenye mdundo, na zenye nguvu; wanapiga nyundo kwenye misingi - umoja wa Mwenyezi Mungu, uhakika wa ufufuo na uwajibikaji, hadithi za Mitume wa zamani ambao walikataliwa kisha kuthibitishwa, na mwito mkubwa wa marekebisho ya maadili katika jamii iliyozama katika ibada ya masanamu na dhulma.",
      "Baada ya Hijra hadi Madina mwaka 622 CE, Waislamu hawakuwa tena wachache wanaoteswa bali ni jumuiya inayojenga jamii. Aya za Madina kwa ujumla ni ndefu na zenye maelezo zaidi, zikiweka sheria na utaratibu wa kijamii unaohitajika ummah mpya: makhsusi ya swala, zaka, saumu, urithi, ndoa na talaka, mikataba, vita, na mikataba, sambamba na maneno madhubuti kwa wanafiki walioidhoofisha jumuiya kutoka ndani.",
      "Uhifadhi wa maandishi ulianza katika enzi za uhai wa Mtume ﷺ mwenyewe. Maswahaba walihifadhi wahyi ulipokuja, na waandishi wakauandika kwenye ngozi, mabua ya mitende, mifupa na mawe chini ya usimamizi wa moja kwa moja wa Mtume ﷺ. Baada ya wahifadhi wengi kuuawa kishahidi kwenye Vita vya Yamama, Abu Bakr alimuamuru Zayd ibn Thabit kukusanya Qur'ani iliyoandikwa kwenye mkusanyiko mmoja (suhuf). Baadaye, dola ilipoenea na lahaja zikitofautiana, Uthman alikuwa na nakala zenye mamlaka zilizofanywa katika lahaja ya Maquraishi na kupelekwa kwenye miji mikubwa, kusawazisha maandishi moja yaliyoandikwa kwa ajili ya ummah wote.",
      "Mwenyezi Mungu Mwenyewe aliihakikishia hifadhi ya Qur'ani: 'Hakika Sisi tumeteremsha Ukumbusho na hakika Sisi tutauhifadhi.' Ahadi hiyo imetimizwa kwa njia tatu za ulinzi zinazofungamana - kuhifadhi kwa wingi katika kila kizazi, upokezaji makini wa kimaandishi, na minyororo isiyokatika ya kisomo kutoka kwa mwalimu hadi kwa mwanafunzi (qira'at) inayorejea kwa Mtume (ﷺ). Kwa mwamini hii ni ishara ya kitheolojia; kwa mwanahistoria ni ukweli ulioandikwa: Kurani inayosomwa leo ni maandishi yale yale yaliyoteremshwa karne kumi na nne zilizopita.",
    ],
    quran: [
      {
        excerpt: "Hakika Sisi tumeteremsha Ukumbusho na hakika tutauhifadhi.",
      },
      {
        excerpt: "Soma kwa jina la Mola wako aliye umba...",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Muundo wa Qur'ani",
    summary: "114 surah, 30 juz, ayahs, Makki/Madani, amri dhidi ya ufunuo.",
    body: [
      "Mus'haf - nakala halisi ya Kurani - ina surah (sura) 114, kila moja ikiwa na jina lake, kawaida huchukuliwa kutoka kwa neno la kushangaza ndani yake. Zimepangwa zaidi kutoka ndefu hadi fupi zaidi, ingawa si kwa uthabiti: Al-Fatiha, sura fupi ya ufunguzi, inakuja kwanza kama lango la Kitabu, na Al-Baqarah ndefu inafuata. Mpangilio huu ni tawqifi - amri ilifundishwa kwa Mtume ﷺ na Jibriyl na sio mpangilio ambao Aya ziliteremshwa. Kwa hiyo mfuatano uliousoma katika mus'haf ni wa makusudi na umewekwa ki-Mungu, si wa mpangilio wa matukio.",
      "Kila surah imeainishwa kama Makki (iliyoteremka kabla ya Hijra) au Madani (iliyoteremka baada yake), na chache zina aya za zote mbili. Kama kanuni ya kidole gumba, surah za Makki huzingatia imani - tawhid, ufufuo, na hadithi za mitume - katika vifungu vifupi, vya haraka zaidi, wakati Sura za Madani zinaongeza sheria ya kina na mwongozo wa jamii ambayo jamii imetulia inahitaji. Kujua ni ipi ambayo inakusaidia kusoma surah katika mwanga wake sahihi.",
      "Kwa usomaji unaoweza kudhibitiwa, Qur'ani pia imegawanywa katika sehemu 30 sawa zinazoitwa juz (wingi ajza'), na kila juz katika nusu mbili zinazoitwa hizb, ikitoa hizb 60 kwa jumla. Hili ndilo linaloifanya Khatm ya Ramadhani - kukamilisha Kurani nzima kwa mwezi - kuwa ya asili sana: juz moja kwa siku inamaliza Kitabu katika siku thelathini, na nusu-juz mara mbili kila siku inakuwa laini zaidi. Ndani ya kila sura ayah (aya) zimehesabiwa hivyo kifungu chochote kinaweza kutajwa kama surah:ayah; hesabu ya kawaida ya Madina ni Ayah 6,236, kukiwa na tofauti ndogo tu, zilizothibitishwa vizuri katika jinsi mipaka ya aya chache inavyohesabiwa - maandishi yenyewe yanafanana.",
      "Kuelewa muundo huu hubadilisha nia zisizo wazi kuwa mpango madhubuti. Unaweza kujitolea kwa sehemu maalum ya kila siku, ukilenga Juz Amma (sehemu ya mwisho, ya thelathini, iliyojaa surah fupi) kwa kumbukumbu, kufuata mada moja kama vile subira katika surah kadhaa, au kupanga usomaji kamili karibu na Ramadhani. Muundo ni kiunzi kinachofanya uhusiano wa maisha na Qur'ani kufikiwa.",
    ],
    quran: [
      {
        excerpt:
          "… Kitabu ambacho Aya zake zimepambanuliwa, ni Qur’ani ya Kiarabu kwa watu wanaojua.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Jifunze kusoma",
    summary: "Viwango saba kutoka kwa alfabeti hadi kukariri kwa ufasaha - kwa wanaoanza kabisa.",
    body: [
      "Takriban kila Mwislamu hutamani kusoma Kurani katika Kiarabu chake asilia, na ni lengo linaloweza kufikiwa kikamilifu katika umri wowote - watu wazima wasiohesabika wasio na Kiarabu cha awali hujifunza kukariri kwa ufasaha. Kuelewa tafsiri ni muhimu, lakini kukariri maneno halisi ya Kiarabu ni ibada yenyewe, na inafaa juhudi. Njia hii inakuchukua hatua kwa hatua kutoka kwa kutotambua herufi moja hadi kusoma mistari yenye matamshi sahihi.",
      "Safari inapitia hatua saba za asili. Kiwango cha 1 na 2 huunda utambuzi wa herufi - kwanza herufi 28 katika umbo lao pekee, kisha jinsi maumbo yao yanavyobadilika mwanzoni, katikati na mwisho wa neno. Kiwango cha 3 kinatanguliza harakat, alama ndogo (fatha, kasra, damma, sukun, shaddah, tanween) zinazokuambia ni vokali gani kila herufi inabeba. Viwango vya 4 na 5 ndipo inapobofya: unaunganisha herufi katika silabi na kutoa maneno mazima, ikijumuisha sheria za herufi ya jua na mwezi kwa kifungu bainifu 'al-'. Viwango vya 6 na 7 husogea hadi kwenye aya fupi kisha usomaji laini na ufasaha huku kanuni za msingi za tajweed zikitumika.",
      "Tabia mbili huharakisha kila kitu. Kwanza, sikiliza mara kwa mara msomaji mwenye sifa na uige haswa - Qur'ani ilipitishwa kwa sikio, kutoka mdomo hadi mdomo, kwa hivyo sikio lako ndio mwalimu wako bora; nakili mdundo, urefu wa vokali, na umbo la kila sauti. Pili, fuatilia na uandike herufi, kwenye karatasi au skrini, kwa sababu mkono huimarisha kile ambacho jicho na ulimi vinajifunza.",
      "Tahadhari moja: programu na rekodi ni usaidizi bora, lakini haziwezi kukurekebisha jinsi mtu anavyoweza. Mtume (Swalla Allaahu ´alayhi wa sallam) alijifunza Qur-aan moja kwa moja kutoka kwa Jibriyl na akaifundisha uso kwa uso kwa maswahaba, na kwamba mlolongo hai wa kusahihisha ni jinsi usomaji sahihi ulivyohifadhiwa daima. Tafuta mwalimu wa mtaani au programu ya mtandaoni ya tajweed ili kukusikiliza na kurekebisha makosa ambayo huwezi kusikia mwenyewe.",
    ],
    actions: [
      "Jifunze herufi moja kwa siku katika sehemu ya herufi za Kiarabu - ione, isikie, iseme, iandike.",
      "Sikiliza Surah al-Fatiha kwa kurudia huku ukifuata maneno kwenye mushaf.",
      "Panga mwalimu - wa ndani au mtandaoni - akusikie ukikariri na akurekebishe kila wiki.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tajweed",
    summary: "Sheria za usomaji mzuri na sahihi - sakin ya mchana, madd, waqf, na zaidi.",
    body: [
      "Tajweed inatokana na mzizi unaomaanisha kufanya kitu bora au kizuri. Kama sayansi ina maana ya kutoa kila herufi haki yake - sehemu yake sahihi ya kutamka mdomoni au kooni (makhraj), sifa zake asili (sifat), na muda mwafaka wa vokali na kusitisha. Kwa ufupi, tajweed ni ufundi wa kusoma Qur-aan sawa sawa na ilivyoteremshwa.",
      "Hili ni muhimu kwa sababu Qur'ani si maandishi yoyote tu ya kusomwa kikawaida. Imeshuka na tajweed iliyokwisha jengwa ndani: Jibriyl alimsomea Mtume ﷺ kwa matamshi sahihi, Mtume ﷺ akawasomea maswahaba hivyo hivyo, nao wakatupitishia sisi bila kukatika. Kukosea herufi si jambo dogo — kutamka herufi vibaya kunaweza kubadili neno kabisa (kwa mfano kuchanganya ص yenye msisitizo na س tupu, au herufi za koo ع na ح), na katika baadhi ya sehemu zinazobadili maana ya maneno ya Mwenyezi Mungu. Sayansi ya tajweed ipo ili kujikinga na hilo haswa.",
      "Huna haja ya kusimamia kila kitu mara moja. Kanuni za msingi zinafunzwa kwa mpangilio: hukmu za sakinah ya adhuhuri na tanween (izhar, idgham, iqlab, ikhfa), hukumu za meem sakinah, aina tofauti za madd (kurefusha), qalqalah (mdundo wa nuru kwenye herufi fulani), ghunnah (mdondoko wa pua), na waqf (wapi na vipi). Kila moja ina ufafanuzi wazi, mifano ya kila siku, na kitu cha kufanya mazoezi, na kitovu hiki hupitia moja kwa wakati.",
      "Kanuni thabiti: jifunze tajweed kwa sikio kutoka kwa mwalimu aliyehitimu, si kutoka kwa vitabu au programu pekee. Msomee mtu ambaye anaweza kusikia makosa yako na kuyasahihisha - hivi ndivyo tajweed imekuwa ikifundishwa kila wakati, na ndio njia pekee ya kuaminika ya usahihi wa kweli na, hatimaye, ijazah (msururu ulioidhinishwa wa kisomo).",
    ],
    hadith: [
      {
        excerpt: "Wabora wenu ni wale wanaojifunza Qur-aan na kuifundisha.",
      },
      {
        excerpt:
          "Mwenye ujuzi wa Qur-aan yu pamoja na waandishi watukufu, waadilifu, na mwenye kuisoma kwa shida, akigugumia juu yake, ana ujira maradufu.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Barua za Kiarabu",
    summary: "Alfabeti inayoingiliana - jina, sauti, mifano kwa kila herufi 28.",
    body: [
      "Alfabeti ya Kiarabu ina herufi 28, zilizoandikwa na kusomwa kutoka kulia kwenda kushoto. Tofauti na Kiingereza, herufi nyingi huunganishwa na zile zilizo kando yao, kwa hivyo herufi moja inaweza kuchukua umbo tofauti kidogo kutegemea ikiwa imesimama peke yake au iko mwanzoni, katikati, au mwisho wa neno. Kujifunza kuona herufi moja katika aina zake tofauti ni mojawapo ya mafanikio ya kwanza ya kweli.",
      "Kiarabu cha Kurani huweka vipengele vichache vya ziada juu ya herufi za msingi: hamza (kituo cha glottal), herufi za vokali ndefu alif, waw, na ya ambazo hunyoosha sauti, na kanuni ya herufi ya jua na mwezi ambayo huamua iwapo 'l' ya kifungu bainifu 'al-' kinatamkwa au kuunganishwa kimyakimya kwenye herufi inayofuata. Hizi ni rahisi mara tu unapokutana nazo kwa maneno halisi.",
      "Kila kadi ya herufi katika sehemu hii inakupa namna ya pekee ya herufi, jina lake, unukuzi, kidokezo cha matamshi cha vitendo, na mifano halisi ya Kurani ili ujifunze sauti katika muktadha badala ya katika mukhtasari. Utaratibu wa ufanisi zaidi ni kitanzi cha hatua nne kwa kila barua: tazama, uisikie ikisomwa, sema kwa sauti mwenyewe, kisha uandike.",
      "Anzisha kila herufi mpya kwa maneno ambayo huenda tayari umeyatambua - Allah, Rabb (Mola), ar-Rahman (Mwingi wa Rehema), Bismillah. Kuunganisha maumbo yasiyojulikana kwa maana inayojulikana huwafanya kushikamana haraka zaidi kuliko kuchimba herufi kwa kutengwa.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Matamshi",
    summary: "Mwalimu herufi ngumu - ayn, ha, huzuni, baba, qaf, na msisitizo.",
    body: [
      "Kiarabu kina sauti kadhaa ambazo hazina sawa sawa katika Kiingereza, na hapa ndipo wazungumzaji wasio asilia mara nyingi huteleza. Mikanganyiko ya kawaida ni kati ya herufi zinazosikika sawa kwa sikio ambalo halijazoezwa lakini hutamkwa kutoka sehemu mbalimbali mdomoni au kooni - na kuzichanganya kunaweza kubadilisha maana ya neno, ndiyo maana zinastahili mazoezi ya kujitolea.",
      "Herufi za mkazo — ṣ (ص), ḍ (ض), ṭ (ط), na ẓ (ظ) — ni matoleo 'nzito' ya herufi nyepesi. Ili kuzizalisha, unainua sehemu ya nyuma ya ulimi na kujaza mdomo kwa sauti iliyojaa zaidi, ya kina zaidi, kitu ambacho wazungumzaji asilia hukifyonza utotoni lakini wanafunzi lazima wajenge kwa uangalifu. Linganisha kila msisitizo moja kwa moja na mwenzi wake mwepesi: س dhidi ya ص, د dhidi ya ض, ت dhidi ya ط, ذ dhidi ya ظ.",
      "Herufi za koo ni kikwazo kingine kikubwa. Ayn (ع) ni mfinyo wa sauti kutoka katikati ya koo, na ha (ح) ni msuguano mkali, unaopumua - haupo kwa Kiingereza, na hakuna maelezo yoyote yaliyoandikwa yanachukua nafasi ya kuyasikia. Qaf (ق) ni 'k' ya kina kutoka nyuma kabisa ya ulimi, tofauti na kafu ya mbele (ك).",
      "Njia ya kuaminika ni kulinganisha jozi kwa upande, kisha ujiangalie dhidi ya usomaji wa polepole na wazi wa murattal. Rekodi sauti yako mwenyewe ikikariri neno fupi, icheze dhidi ya msomaji, na urekebishe. Afadhali zaidi, mwalimu aliyehitimu asikilize - baadhi ya makosa ni karibu haiwezekani kupatikana katika rekodi yako mwenyewe.",
    ],
    appLinks: [{}],
  },
  {
    title: "Msamiati wa Qur'ani",
    summary: "Maneno ya masafa ya juu - elewa zaidi kila wakati unapokariri.",
    body: [
      "Hapa kuna ukweli wa kutia moyo: seti ndogo ya maneno yenye masafa ya juu - kwa mpangilio wa mia chache - inachangia sehemu kubwa sana ya maandishi yanayoendelea ya Qur'ani, kwa sababu maneno yale yale muhimu yanajirudia tena na tena. Kujifunza msamiati huo wa msingi ni hatua moja ya juu zaidi unayoweza kuchukua, kwa sababu inabadilisha ukadiriaji kutoka kwa mtiririko wa sauti hadi maneno ambayo maana yake unapata unaposoma.",
      "Huifasiri Qur'ani neno kwa neno namna hii - hiyo ni kazi ya tafsir na tafsiri - lakini unaanza kutambua majina ya Mwenyezi Mungu, maamrisho, ahadi, na maonyo yanaishi, wakati wa kusoma. Anza na maneno yanayoonekana zaidi na yenye uzito zaidi: Allah, Rabb (Mola), rahmah (rehema), iman (imani), sabr (uvumilivu), taqwa (ufahamu wa Mungu), dunya (dunia hii), na akhirah (Akhera). Kutoka kwa seti hiyo ya nanga, panua nje kidogo kwa wakati.",
      "Tumia marudio yaliyopangwa badala ya kubana. Kujifunza maneno matano mapya kwa wiki na kuyapitia yote kila siku kutakupeleka mbali zaidi katika mwaka mmoja kuliko kukariri hamsini kwa kikao kimoja na kuyasahau. Mwenyezi Mungu anaahidi kwamba Qur'ani imefanywa kuwa rahisi kutiliwa moyo - karibia msamiati wake kwa uthabiti na utahisi urahisi huo moja kwa moja.",
    ],
    quran: [
      {
        excerpt:
          "Na bila ya shaka tumeifanya Qur-aan iwe nyepesi kukumbukwa, basi je, yuko anayekumbuka?",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Tafsir",
    summary: "Kuelewa ufunuo - muhtasari, muktadha, na vyanzo vya kitaaluma vinavyotambulika.",
    body: [
      "Tafsir maana yake ni maelezo na tafsiri ya Qur'ani - ikifafanua nini maana ya aya, kwa nini iliteremshwa, na jinsi inavyotumika. Kwa sababu haya ni maneno ya Mwenyezi Mungu, wanavyuoni waliweka amri madhubuti ya jinsi Qur-aan inavyopaswa kufafanuliwa, na kukaa ndani yake kunakukinga na upotofu.",
      "Tafsir yenye sauti kubwa zaidi ni Qur’ani inayojieleza yenyewe: Aya ambayo ni fupi katika sehemu moja mara nyingi hupanuliwa mahali pengine, hivyo Qur’ani ni tafsiri yake bora zaidi. Kinachofuata ni maelezo ya Sunnah, kwa vile Mtume (Swalla Allaahu ´alayhi wa sallam) alitumwa kwa usahihi ili kuweka wazi wahyi na maneno yake na vitendo vyake vinatuonyesha jinsi ulivyoishi. Baada ya hapo unakuja ufahamu wa maswahaba, walioshuhudia wahyi na wakajua muktadha wake moja kwa moja, wakifuatiwa na wanachuoni wakubwa waliokuja baada yao. Mwisho na wa chini kabisa ni tafsiri ya lugha ya Kiarabu yenyewe. Kile ambacho hakina nafasi hata kidogo ni maoni ya kibinafsi yasiyo na sifa - kusoma mawazo yako mwenyewe kwenye maandishi.",
      "Chombo muhimu katika tafsir ni asbab al-nuzul, matukio ya wahyi: kujua tukio au swali lililosababisha aya mara nyingi hufungua maana yake. Lakini ripoti hizi lazima zenyewe zithibitishwe, kwani si kila 'tukio' lililosimuliwa ni la kutegemewa. Kwa kila surah, tafsir nzuri inakupa mazingira yake ya kihistoria pale yalipoanzishwa, mada zake kuu, aya zake muhimu, na masomo ya vitendo ya kuendelea.",
      "Miongoni mwa marejeo yanayotambulika na kutegemewa zaidi ni Tafsir Ibn Kathir (ya kina na makini kunukuu hadith na maneno ya vizazi vya mwanzo), Tafsir as-Sa'di (ya wazi, ya kisasa, na yenye kuzingatia mwongozo wa kivitendo), na Tafsir al-Tabari ya kitambo (ensaiklopidia, inayohifadhi tafsiri za mapema). Wakati wowote unapojifunza maana, kumbuka ni chanzo gani kilitoka. Kitovu hiki kinafundisha mbinu; tumia kisomaji cha Kurani cha Munib, ambacho huunganisha tafsir iliyounganishwa na ya mbali, kwa ajili ya kujifunza mstari kwa mstari.",
    ],
    sources: [
      "Tafsir Ibn Kathir — Kiingereza kilichofupishwa kinapatikana kwa wingi",
      "Tafsir as-Sa'di - muhtasari unaopatikana",
      "Asbab al-Nuzul cha al-Wahidi — matukio ya ufunuo (thibitisha ukweli kwa kila tukio)",
    ],
    disclaimer:
      "Tafsir inatofautiana kwa kina. Wanachuoni wanapohitilafiana, zingatia tofauti bila ya kudai yakini pale ambapo Mwenyezi Mungu hakuweka wazi.",
    appLinks: [{}],
  },
  {
    title: "Mada za Qur'ani",
    summary: "Imani, maombi, subira, hisani, manabii - mistari iliyopangwa kulingana na mada.",
    body: [
      "Qur'ani haijawekwa kama kitabu cha kiada, somo moja kwa kila sura. Badala yake mada zake kuu - umoja wa Mwenyezi Mungu, sala, subira, hisani, Mitume, Akhera, uadilifu, familia - zimesukwa kote, zikijitokeza na kutokea tena katika surah nyingi, kila wakati kutoka kwa mtazamo mpya. Kinachoonekana kwanza kama marudio kwa hakika ni uimarishaji: mandhari hutambulishwa, kisha kuimarishwa, kisha kuunganishwa na nyingine, hadi ujumbe wote usimame kama simu moja madhubuti.",
      "Kusoma Qur'ani kwa mada kunadhihirisha umoja huo. Unapokusanya yale ambayo Qur'ani inasema kuhusu, kusema, shukurani au kumwamini Mwenyezi Mungu kutoka katika surah zake zote, aya tofauti huangazia zenyewe na somo huwa wazi na kamili. Kila ingizo la mada katika kitovu hiki huvuta pamoja aya zinazohusika, zikiunga mkono hadith sahihi ambapo zinaongeza uwazi, mafunzo ya msingi, na vitendo madhubuti ili maarifa yasikae kinadharia.",
      "Zaidi ya yote, unganisha mada na maisha yako mwenyewe. Fadhili kwa wazazi, uaminifu katika biashara, uadilifu katika ndoa, kusimama kwa haki hata dhidi ya maslahi yako binafsi - hizi si sura za kufikirika za kupendeza bali maamuzi ya kila siku ambayo Qur'ani inakutaka ufanye. Soma kila mada kama swali linaloelekezwa kwako kibinafsi: hii inabadilishaje ninachofanya leo?",
    ],
    appLinks: [{}],
  },
  {
    title: "Hadithi katika Qur-aan",
    summary: "Mitume kutoka kwa Adam hadi Muhammad ﷺ - masomo, mahali, aya zinazohusiana.",
    body: [
      "Qur'ani inasimulia hadithi za Mitume - Adam, Nuh, Ibrahim, Yusuf, Musa, Isa, na wengineo wengi - na inatueleza kwa uwazi kwa nini: 'Katika hadithi zao kuna mazingatio kwa wenye akili.' Akaunti hizi si ngano au burudani. Ni maagizo, yaliyochaguliwa na kuambiwa na Mwenyezi Mungu kufundisha imani, subira, na jinsi ya kukabiliana na mitihani ile ile inayojirudia katika kila zama.",
      "Angalia muundo unaopitia kwao. Mitume waliwalingania watu wao katika kumwabudu Mwenyezi Mungu peke yake; walidhihakiwa, kupingwa, na mara nyingi kufukuzwa; wakavumilia kwa subira na kumtegemea Mwenyezi Mungu (tawakkul); na mwishowe ahadi ya Mwenyezi Mungu ikawa kweli. Unaposoma matatizo yao, pata nguvu kutokana na jinsi walivyojibu - bila hata kufikiria kuwa cheo chako ni sawa na chao. Jambo ni kunyonya uimara na uaminifu wao, sio kulinganisha hadhi.",
      "Qur'ani yenyewe inataja simulizi moja: Surah Yusuf, ambayo Mwenyezi Mungu anaiita 'hadithi bora zaidi'. Katika hali isiyo ya kawaida, inasimuliwa kutoka mwanzo hadi mwisho katika surah moja, kwa hiyo isome katika kikao kimoja kama safari yenye kuendelea - khiyana, subira kupitia utumwa na jela, na hatimaye msamaha na kuunganishwa tena - na tazama jinsi mpango wa Mwenyezi Mungu unavyojitokeza nyuma ya miaka ya bahati mbaya.",
    ],
    quran: [
      {
        excerpt: "Hakika katika hadithi zao ni mazingatio kwa wenye akili...",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Miujiza ya Qur'ani",
    summary: "Kutokubalika kwa lugha, uhifadhi, unabii - kwa tahadhari ya kitaaluma.",
    body: [
      "Muujiza mkuu wa Qur'ani ni Qur'ani yenyewe. Iliyofichuliwa kwa mtu asiyejua kusoma na kuandika katika enzi ya ufasaha zaidi wa ushairi wa Kiarabu, ilitoa changamoto ya wazi kwa wapinzani wake wakali - wastadi wa lugha - kutoa hata surah moja kama hiyo. Karne kumi na nne baadaye changamoto hiyo haijatimizwa. Nguvu yake ya balagha, muundo wake, jinsi dhamira zake zinavyofungamana, na mshikamano wa mwongozo na sheria yake vinasomwa katika sayansi ya kitamaduni ya ufasaha ( ilm al-balagha ), na vinabakia, kwa madai ya Qur'ani yenyewe, kuwa hayawezi kuigwa.",
      "Uhifadhi wake ni ishara ya pili, inayoweza kuthibitishwa. Maandishi yamelindwa kwa maandishi, kupitia maandishi yaliyopitishwa kwa uangalifu, na kwa mdomo, kupitia qira'at - minyororo isiyokatika ya wasomaji wa kukariri na kuifundisha haswa, kizazi baada ya kizazi. Hii ni historia iliyoandikwa, si dhana ya uchamungu, na inatimiza ahadi ya Mwenyezi Mungu mwenyewe ya kuchunga mawaidha.",
      "Pia utasikia kuhusu 'miujiza ya kisayansi' - aya zinazogusa hatua za kiinitete, upanuzi wa ulimwengu, na kadhalika. Shughulikia hizi kwa uangalifu. Tafsir ya kawaida mara nyingi ilielewa aya kama hizo kwa njia tofauti kabisa na watetezi wa kisasa, na kulazimisha Qur'ani kupatana na kila nadharia inayobadilika ya kisayansi kunaweza kurudisha nyuma nadharia zinapobadilika. Tofautisha kwa uthabiti kati ya tafsiri thabiti na dhana ya kisasa.",
      "Bishara za kihistoria vile vile zimenukuliwa na wanazuoni - ushindi uliotabiriwa wa Warumi, ufunguzi wa amani wa Makka - na zinafaa kuchunguzwa, lakini kwa njia ya tafsir na seerah, sio klipu za video za kusisimua. Kesi yenye nguvu zaidi kwa Qur'ani daima imekuwa ni tawhid yake, mabadiliko yake ya kimaadili ya watu, na lugha yake isiyo na kifani na kuhifadhi.",
    ],
    quran: [
      {
        excerpt: "Basi leteni surah kama hiyo… ikiwa nyinyi ni wakweli.",
      },
    ],
    disclaimer:
      "Epuka madai mengi ya kisayansi ya miujiza ambayo yanaaibisha dawah inapochunguzwa. Ongoza kwa tawhiyd, maadili, na dalili za kilugha na za kihistoria za Qur'ani.",
  },
  {
    title: "Kukariri (Hifz)",
    summary: "Mipango kutoka Juz Amma hadi hifz kamili - marekebisho, sauti, malengo ya kila siku.",
    body: [
      "Kukariri Qur'ani (hifz) ni miongoni mwa mambo adhimu zaidi katika maisha ya Muumini, na haijatengwa kwa ajili ya wanachuoni au watoto - watu wazima pia huikamilisha. Mtume (Swalla Allaahu ´alayhi wa sallam) amefundisha kwamba Siku ya Qiyaamah yule aliyebeba Qur-aan ataambiwa, “Soma na upande” akipanda daraja kwa kila Aya. Anza pale kila mtu anapoanzia: Surah al-Fatiha, ambayo tayari unaisoma katika kila sala, kisha surah fupi zilizo mwishoni kabisa mwa mus'haf, zikifanya kazi nyuma.",
      "Somo muhimu zaidi katika hifz ni kinyume na angavu: marekebisho (muraja'ah) ni muhimu zaidi kuliko kuongeza nyenzo mpya. Mtume (Swalla Allaahu ´alayhi wa sallam) alionya kwamba Qur-aan iliyohifadhiwa hutoroka haraka kuliko ngamia aliyefungwa hukatika—iache bila kufanyiwa marekebisho na hutoweka. Kwa hivyo sheria ni rahisi na kali: usiongeze kamwe sehemu mpya hadi urekebishe kwa uthabiti kile ambacho tayari umeshikilia. Kidogo kilichokaririwa hupiga sana kilichokaririwa ovyo ovyo.",
      "Mbinu ya vitendo: tumia marudio yaliyopangwa kwa nafasi, shikamana na mkariri mmoja ili wimbo wenyewe urejeshe kumbukumbu yako, soma kutoka kwa kumbukumbu kila siku badala ya kusoma tu, na umuombe mwalimu akusikilize na utie alama makosa yako - makosa ambayo huwezi kuyasikia wewe mwenyewe. Kifuatiliaji cha hifz cha Munib hurekodi maendeleo hadi ayah mahususi ili ujue kila wakati kinachopaswa kusahihishwa.",
      "Chagua mpango unaofaa hatua yako. Anayeanza: kukariri Juz Amma, sehemu ya mwisho, iliyojaa surah fupi. Ya kati: ongeza surah kumi zinazokaririwa mara kwa mara kama vile al-Mulk, Ya-Sin, na al-Kahf. Kina: kamilisha juz kamili na usahihishaji thabiti wa kila kitu kabla yake. Na safari ya Hafidh: mus'haf wote, ulikariri na mwalimu aliyehitimu na, kwa hakika, sanad - mlolongo uliothibitishwa wa upokezi wa kurudi kwa Mtume ﷺ.",
    ],
    hadith: [
      {
        excerpt:
          "Ataambiwa swahaba wa Qur-aan: Soma na uinuke kama ulivyokuwa ukisoma duniani, kwani cheo chako kitakuwa kwenye Aya ya mwisho utakayoisoma.",
      },
      {
        excerpt:
          "Mfano wa sahaba wa Qur-aan ni wa mwenye ngamia aliyefungiwa: akiichunga huihifadhi, na akimuachia humpoteza.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Masomo ya kila siku",
    summary: "Aya moja, muktadha, tafakari, na kitendo - kila siku.",
    body: [
      "Ushikamano wa maisha yote na Qur'ani hujengwa kwa njia ile ile tabia yoyote ya kina hujengwa - kidogo, kila siku, bila kukosa. Mtume (Swalla Allaahu ´alayhi wa sallam) amefundisha kwamba matendo yanayopendwa zaidi na Mwenyezi Mungu ni yale yanayofanywa mara kwa mara, hata kama ni madogo, na kanuni hiyo ndiyo dhana nzima ya somo la kila siku. Kila moja inakupa mstari mmoja katika Kiarabu, tafsiri yake, dokezo kuhusu muktadha wake wa kihistoria, swali la kutafakari la kukaa nalo, na hatua moja madhubuti ya kutekeleza katika siku yako.",
      "Ichukulie mistari hii kama mwongozo hai, sio kupita kusoma. Alamisha yale yanayopiga moyo wako, rudi kwao, na ushiriki kile kilichokuchochea na familia yako - wakati mtu mwingine anatenda kwa wema uliyopitia, thawabu yake inakufikia pia, kwa hivyo kufundisha huongeza faida.",
      "Usiruhusu saizi ndogo ikudanganye. Uthabiti hushinda nguvu kila wakati: dakika tano za uaminifu ukiwa na Qur'ani kila siku moja zitakubadilisha zaidi ya saa adimu, ya kishujaa mara moja kwa mwezi. Onyesha kila siku, na acha siku zikusanyike.",
    ],
    appLinks: [{}],
  },
  {
    title: "Tafakari (Tadabbur)",
    summary: "Maswali yanayoongozwa - ni nini Mwenyezi Mungu anafundisha, na utaishi vipi?",
    body: [
      "Tadabbur maana yake ni kuitafakari Qur'ani kwa kina, kugeuza aya ndani ya moyo mpaka ikusukume kubadilika. Ni amri ya moja kwa moja, si ziada ya hiari: Mwenyezi Mungu anauliza, 'Je, hawaitafakari Qur'ani, au nyoyo zao ziko kufuli? Kusudi la kukariri halikuwa sauti tu - lilikuwa ni kufikia moyo na kuunda upya maisha.",
      "Tadabbur si sawa na tafsir. Tafsir ni maelezo ya kielimu ya maana ya aya; tadabbur ni jibu lako la kibinafsi, la heshima kwa maana hiyo mara tu unapoielewa. Wawili hao hufanya kazi pamoja: kwanza unajifunza maana ya sauti kutoka kwa tafsir, kisha unakaa nayo na kuuliza inazungumzaje nawe. Muundo wa kusaidia ni maswali matatu - Mwenyezi Mungu ananifundisha nini hapa? Je, hii inabadilishaje ninachofanya leo? Ni tabia gani moja lazima nijenge au niivunje kwa sababu yake?",
      "Mpaka mmoja thabiti huiweka tadabbur salama: tafakari juu ya kile ambacho mstari unauliza kutoka kwako, lakini usizuie maana mpya kwa maandishi yenyewe. Acha tafsir halisi iweke mipaka ya tafsiri, na uweke tafakari zako za kibinafsi mahali pake - jarida la kibinafsi, kama vile la Munib, ni bora kwa kunasa kile ambacho aya ilichochea ndani yako na kurudi kwayo baadaye.",
    ],
    quran: [
      {
        excerpt: "Je! hawaitafakari Qur'ani, au nyoyo zao ziko kufuli?",
      },
      {
        excerpt:
          "Basi je, hawaitafakari Qur'ani? Na lau kuwa imetoka kwa asiye kuwa Mwenyezi Mungu, wangeli pata khitilafu nyingi ndani yake.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tumia Qur'ani",
    summary: "Changamoto ya leo kutoka kwa aya - wimbo uliokamilika, moja kwa moja ayah.",
    body: [
      "Elimu ya Qur'ani inakusudiwa kuwa vitendo. Mwenyezi Mungu aliwashutumu vikali walio kuwa kabla yetu wanao soma Kitabu, wakakaa kinyume chake: Je! Qur-aan ni ahadi baina yenu na Mola wenu Mlezi, na kila Aayah inawauliza jambo kwa utulivu - swali ni je, mnajibu.",
      "Hiyo ndiyo sababu ya changamoto hizi. Kila moja inaunganisha aya mahususi na tabia moja, inayoweza kutekelezeka kwa siku ya leo: kuuchunga ulimi wako kwa mazungumzo mazuri, kutoa sadaka ya utulivu, kupunguza macho yako kutokana na yale yaliyokatazwa, kuacha kinyongo ulichobeba. Mstari mmoja, kitendo kimoja—kidogo vya kutosha kufanya, halisi vya kutosha kukubadilisha.",
      "Tia alama kuwa changamoto imekamilika tu ikiwa umeifanya kikweli. Suala la ufuatiliaji sio onyesho - ambalo lingeshinda lengo - lakini uwajibikaji wa uaminifu kwa Mwenyezi Mungu, ambaye huona kile ambacho wengine hawaoni. Baada ya muda, mstari kwa mstari, hivi ndivyo usomaji unavyogeuka kuwa tabia.",
    ],
    quran: [
      {
        excerpt: "Je! mnawaamrisha wengine na mnajisahau na hali mnasoma Kitabu?",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Maswali ya Qur'ani",
    summary: "Kagua majina ya surah, muundo, tajweed, msamiati, na hadithi.",
    body: [
      "Kujijaribu ni mojawapo ya njia bora zaidi za kufanya ujuzi ushikamane - kukumbuka jibu huimarisha kumbukumbu zaidi kuliko kusoma tena. Jaribio hili linatokana na kila kitu katika kitovu: idadi ya surah na juz, wahyi wa kwanza na jinsi Qur'ani ilivyohifadhiwa, sheria za tajweed kama vile madd na qalqalah, msamiati wa masafa ya juu, na mitume ambao Qur'ani inasimulia hadithi zao.",
      "Weka nia sawa. Alama ni kioo tu cha kujifunza kwako - kamwe sio kipimo cha cheo chako mbele ya Mwenyezi Mungu, ambacho ni chake Yeye pekee. Tumia kila swali kufichua sehemu dhaifu, kisha urudi kwenye somo linalolingana na usome mada hiyo haswa badala ya kufukuza nambari.",
      "Kidokezo cha mwisho ni kutafakari, si swali la daraja: chagua surah au kifungu kimoja ili kuelewa na kukariri kinachofuata, ili ukaguzi wako umalizike kwa kukuelekeza kwenye Kitabu chenyewe.",
    ],
    appLinks: [{}],
  },
  {
    title: "Marejeleo na vyanzo",
    summary: "Jinsi tunavyonukuu Qur'ani, Hadith, tafsir, na tofauti za kielimu.",
    body: [
      "Usomaji mzuri wa Kiislamu umejengwa juu ya ushahidi wa uwazi, kwa hivyo kila somo katika kitovu hiki hulenga kuonyesha ufanyaji kazi wake. Madai kuhusu Qur'ani yanaungwa mkono na rejea katika mfumo wa surah:ayah; madai kutoka kwa Sunnah yanataja mkusanyiko (Bukhari, Muislamu, Tirmidhi, na kadhalika), nambari ya Hadith, na daraja lake (sahih, hasan, au dhaifu); dai kuhusu maana ya Aya hutaja tafsir inayotoka; na pale ambapo wanachuoni wanatofautiana kikweli, tofauti hiyo hubainika badala ya kufichwa.",
      "Ni muhimu pia kutofautisha kile ambacho ni hakika na kile kinachofasiri. Mambo yaliyothibitishwa - Swala tano za kila siku, kuhifadhi Qur'ani, matukio makubwa ya sira - yameelezwa kwa uwazi. Mambo ambayo wasomi wanyoofu wametofautiana kwa muda mrefu, kama vile maelezo mazuri ya eskatologia au usomaji wa madokezo ya kisayansi, yanatolewa kama tafsiri, si kama uhakika uliotatuliwa. Kujiamini kunapaswa kuendana na nguvu ya ushahidi.",
      "Kwa utafiti wa kina, tegemea marejeleo yaliyothibitishwa: tafsiri za Kurani zinazotegemewa (kama vile Sahih International au Pickthall), makusanyo ya msingi ya Hadith (Sahih al-Bukhari na Sahih Muislamu ya kwanza), tafsir inayoheshimiwa (Ibn Kathir na as-Sa'di), na seerah ya kutegemewa (Kanuni ya Ibn Hisham, na 'al-Makhtah ya al-Makhtah ya Al-Makhtah ya Ibn Hisham, na al-Makhtah ar-Rakh. simulizi ya kisasa).",
      "Hatimaye, jua mipaka ya programu. Munib inakuelimisha na kukuelekeza kwenye vyanzo, lakini haitoi hukumu za kidini. Kwa fiqh ya kisomo, tajweed ijazah, au kwa swali lolote linaloathiri ibada yako au maamuzi yako ya maisha, wasiliana na mwanachuoni aliyehitimu katika shule yako na eneo lako.",
    ],
    sources: [
      "Qur'ani — Mfalme Fahd Complex amechapisha / mushaf iliyoidhinishwa ya dijiti",
      "Hadith - sunnah.com inaweka alama ya marejeleo mtambuka",
      "Tafsir Ibn Kathir (kwa kifupi Darussalam)",
      "Tafsir as-Sa'di (Kiingereza)",
    ],
    disclaimer:
      "Munib hujumlisha maudhui wazi ya elimu. Thibitisha masuala muhimu na wasomi waliohitimu katika madhhab na eneo lako.",
  },
];

export const QURAN_GUIDE_STRUCTURE_LEVELS_SW: DeepPartial<QuranGuideStructureLevel>[] = [
  {
    count: "1 Kitabu",
    detail:
      "Kitabu kimoja - kalam Allah, hotuba halisi ya Mwenyezi Mungu, iliyoteremshwa kwa Muhammad ﷺ kupitia kwa Malaika Jibreel, kwa Kiarabu kinachoeleweka, polepole kwa muda wa miaka 23. Ni maandishi sawa kila mahali ulimwenguni.",
  },
  {
    count: "114",
    detail:
      "Kurani imegawanywa katika surah 114, kuanzia aya tatu tu hadi 286. Kila moja ina jina, kwa kawaida huchukuliwa kutoka kwa neno kuu ndani yake, na huwekwa kama Makki au Madani. Mpangilio wao katika mus’haf uliwekwa kwa wahyi (tawqifi) na unatofautiana na utaratibu wa wahyi.",
  },
  {
    count: "30",
    detail:
      "Sehemu thelathini takriban sawa, iliyoundwa kufanya usomaji kudhibitiwa. Kukariri juzi moja kwa siku kunakamilisha Kurani nzima kwa mwezi mmoja - njia ya kawaida ya kumaliza khatm wakati wa Ramadhani.",
  },
  {
    count: "60",
    detail:
      "Kila juz inagawanyika katika hizb mbili, ikitoa 60 kwa jumla, na kila hizb zaidi katika robo. Vizio hivi vidogo hukuruhusu kuweka sehemu laini ya kila siku - nusu au robo ya hizb - na uendelee kuwa na mazoea thabiti.",
  },
  {
    count: "6,236",
    detail:
      "Aya za kibinafsi, zilizo na nambari ili kifungu chochote kinaweza kutajwa kama surah:ayah. 6,236 ni hesabu ya kawaida ya Madina; Mbinu zingine za kihistoria za kuhesabu hutofautiana tu katika jinsi mipaka ya mistari michache inavyowekwa alama - maneno yenyewe yanafanana.",
  },
  {
    count: "2 zama",
    detail:
      "Kila surah ni ya mojawapo ya zama mbili za wahyi. Mara nyingi surah za Makki (kabla ya Hijra) huwa fupi zaidi na huzingatia imani, tawhid, na Akhera. Madani (baada ya Hijra) surah mara nyingi huwa ndefu na huongeza sheria na mwongozo wa jamii. Sura chache zina aya kutoka kwa zote mbili.",
  },
  {
    count: "Nyingi",
    detail:
      "Qur'ani imesukwa kwenye mada zinazojirudia badala ya kupangwa mada kwa mada. Tawhid, swala, hadithi za Mitume, jamaa, sadaka, subira na Akhera zinakwenda katika Kitabu chote, zikitiana nguvu katika surah nyingi.",
  },
];

export const QURAN_GUIDE_TIMELINE_SW: DeepPartial<QuranGuideTimelineEvent>[] = [
  {
    title: "Maisha kabla ya ufunuo",
    body: "Katika miaka ya kabla ya utume, Muhammad (Swalla Allaahu 'alayhi wa aalihi wa sallam) alikuwa akiondoka kwenda kwenye Pango la Hira kwa siku za upweke na kutafakari, akisumbuliwa na uabudu masanamu na dhulma ya jamii ya Makka. Ingawa ulimwengu uliomzunguka uliabudu masanamu, hakuwahi kufanya hivyo, na watu wake walimwamini kabisa hadi wakamwita al-Amin - mwaminifu - muda mrefu kabla hajadai kuwa nabii.",
    location: "Makka",
  },
  {
    title: "Pango la Hira",
    body: "Katika mwezi wa Ramadhani, alipokuwa karibu miaka arobaini, Malaika Jibriyl alimjia kwenye pango kwa amri moja: Soma! Mtume ﷺ, ambaye hajui kusoma wala kuandika, akajibu kuwa hawezi. Malaika akamkumbatia kwa nguvu mara tatu kisha akafikisha maneno ya kwanza ya Surah al-Alaq - 'Soma kwa jina la Mola wako aliyeumba.' Akiwa ametikiswa, aliharakisha nyumbani kwa mkewe Khadijah, ambaye alimfunga kanzu na kumtuliza.",
    location: "Jabal an-Nur, Makka",
  },
  {
    title: "Wahyi wa kwanza - Surah al-Alaq",
    body: "Amri ya kusoma iliashiria mwanzo wa utume na kushuka kwa Qur'ani. Khadija alimpeleka kwa jamaa yake msomi, Waraqah ibn Nawfal, ambaye alimtambua Malaika kuwa ni mjumbe yule yule aliyemjia Musa na akabashiri kwamba watu wa Mtume ﷺ watamtoa. Aya za mwanzo kabisa za Makka zilizofuata zilizingatia upweke wa Mwenyezi Mungu, uhakika wa Akhera, na mwito mkubwa wa marekebisho ya maadili.",
  },
  {
    title: "Mapema kipindi cha Makka",
    body: "Kwa miaka ya kwanza simu hiyo ilikuwa ya faragha, kisha ya umma. Kadiri ilivyokua, Maquraishi waligeukia mateso - wakiwatesa wanyonge na watumwa miongoni mwa waumini - na hatimaye wakaweka mgomo mkali wa miaka mitatu kwa ukoo wa Mtume ﷺ, Banu Hashim. Ili kuepuka ukatili huo, kikundi cha Waislamu kilihamia Abyssinia, ambako mfalme Mkristo mwadilifu aliwapa hifadhi. Sura za enzi hii kwa kawaida huzungumza kwa mistari fupi, yenye nguvu na yenye mdundo.",
    location: "Makka",
  },
  {
    title: "Hijra hadi Madina",
    body: "Baada ya miaka ya mateso, na kufuatia 'mwaka wa huzuni' ambapo alipoteza wote wawili Khadijah na ami yake Abu Talib, Mtume ﷺ na masahaba zake walihamia Madinah. Hijra hii ilikuwa muhimu sana kwamba baadaye ikawa mwanzo wa kalenda ya Kiislamu. Huko Madina Waislamu hawakuwa tena watu wachache wanaowindwa bali ni umma unaoanzisha jamii, na wahyi sasa ukaanza kushughulikia sheria, familia, uchumi, na mahusiano na Watu wa Kitabu.",
    location: "Madina",
  },
  {
    title: "Kipindi cha Madina",
    body: "Sura za Madina kwa ujumla ni ndefu na zenye maelezo zaidi, zikiweka sheria ambayo jamii imeihitaji: maalum ya swala, zaka, saumu, ndoa na talaka, urithi, mikataba, na mikataba. Kipindi hiki pia kilishuhudia vita kuu - Badr, Uhud, na Mashirikisho - na Qur'ani ilishughulikia mitihani ya waumini na mipango ya wanafiki (munafiqun) kwa uwazi wa kushangaza.",
    location: "Madina",
  },
  {
    title: "Kwaheri Hija",
    body: "Katika mwaka wa kumi baada ya Hijra, Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) alitekeleza Hijja yake pekee na akatoa Khutba ya kuaga mbele ya mkusanyiko mkubwa wa watu huko Arafat, akikumbusha umma juu ya utakatifu wa maisha na mali, haki za wanawake, usawa wa watu wote bila kujali rangi, na wajibu wa kushikamana na Qur-aan na Sunnah. Hapa ndipo ilipoteremshwa Aya: 'Leo nimekukamilishieni Dini yenu.'",
    location: "Arafat / Mina",
  },
  {
    title: "Mkusanyiko chini ya Abu Bakr",
    body: "Muda mfupi baada ya Mtume ﷺ kupita, masahaba wengi ambao walikuwa wamehifadhi Qur'ani nzima waliuawa katika Vita vya Yamama. Kwa kuogopa kupotea kwa huffaz, Umar alimsihi khalifa Abu Bakr akusanye Qur'ani mahali pamoja. Abu Bakr alimteua mwandishi aliyeaminika Zayd ibn Thabit, ambaye alikusanya kwa uangalifu wahyi ulioandikwa - uliothibitishwa dhidi ya kumbukumbu za masahaba - kuwa seti moja ya karatasi (suhuf).",
  },
  {
    title: "mushaf sanifu - Uthman",
    body: "Uislamu ulipoenea katika nchi nyingi, tofauti za usomaji miongoni mwa Waislamu wapya zilianza kusababisha mabishano. Ili kuunganisha ummah kwenye maandishi moja, khalifa Uthman alikuwa na nakala zenye mamlaka zilizotengenezwa kutoka kwenye suhuf ya Abu Bakr katika lahaja ya Maquraishi na akazipeleka kwenye miji mikubwa, akiomba kwamba nakala nyingine za kibinafsi zitengwe. Mushafu huu wa Uthmanic ndio kiwango ambacho ulimwengu wote wa Kiislamu umefuata tangu wakati huo.",
  },
  {
    title: "Uhifadhi hadi leo",
    body: "Karne kumi na nne baadae, Qur'ani imebakia bila kubadilika, ikilindwa kwa njia tatu zinazofungamana: kuhifadhi kwa wingi (hifz) katika kila kizazi, upokezaji wa maandishi wa uaminifu, na minyororo ya kisomo ya mwalimu kwa mwanafunzi (qira'at) inayorejea kwa Mtume ﷺ. Haya yanatimiza ahadi ya Mwenyezi Mungu: Hakika Sisi tumeteremsha ukumbusho, na hakika sisi tutauhifadhi.",
  },
];

export const QURAN_GUIDE_STORIES_SW: DeepPartial<QuranGuideStory>[] = [
  {
    prophetName: "Adamu",
    title: "Adamu - nabii wa kwanza na baba wa wanadamu",
    summary: "Uumbaji, kusujudu kwa malaika, mtihani wa mti, toba ilikubaliwa.",
    body: [
      "Mwenyezi Mungu alimuumba Adam, mwanadamu wa kwanza, kwa mikono yake mwenyewe kutokana na udongo, akampulizia roho yake, na akampa zawadi ambayo hakuna kiumbe mwingine aliyepokea: Alimfundisha Adam majina ya vitu vyote. Mwenyezi Mungu alipodhihirisha elimu hii, Malaika walikubali mipaka yao na heshima ya Adam ikadhihirika - elimu yenyewe ilikuwa ni sehemu ya yale yaliyowatofautisha wanadamu.",
      "Kisha Mwenyezi Mungu akawaamrisha Malaika wamsujudie Adam kwa heshima, na wakat'ii wote isipokuwa Ibilisi ambaye alikuwa miongoni mwa majini. Alikataa kwa kiburi, akisema kwamba alifanywa kwa moto na Adamu wa udongo, na hivyo akajiona kuwa bora zaidi. Kiburi hicho, na sio ujinga, kilikuwa anguko lake, na aliapa kuwapoteza wazao wa Adamu.",
      "Adam na mkewe Hawwa waliwekwa kwenye Bustani na kuambiwa wangeweza kufurahia kila kitu kwa uhuru lakini wasikaribie mti mmoja mahususi. Shetani akawanong'oneza kwa bidii mpaka wakala. Mara uchi wao ukawadhihirikia, wakahisi makosa yao. Lakini badala ya kukata tamaa au kutoa udhuru, walielekea kwa Mwenyezi Mungu kwa unyenyekevu: Mola wetu Mlezi, tumejidhulumu nafsi zetu, na usipotusamehe na ukaturehemu, bila shaka tutakuwa miongoni mwa walio khasiri.",
      "Mwenyezi Mungu Aliwakubalia toba yao na akawateremsha duniani - si kwa adhabu ya kiholela, bali mwanzo wa mtihani wa mwanadamu, unaoambatana na ahadi ya uwongofu: 'Mwenye kufuata uwongofu wangu hatapotea wala hataanguka katika taabu.' Hadithi ya Adamu kwa hivyo ni hadithi ya kila mwanadamu: aliyeumbwa kwa heshima, amejaribiwa, anayeweza kukosea, na anayeweza kurudi kila wakati.",
    ],
    lessons: [
      "Mlango wa toba daima uko wazi - tawbah ya Adam, inayotolewa bila udhuru au kuchelewa, ni kielelezo kwa kila mwenye dhambi.",
      "Ujeuri ndio mzizi wa uharibifu: Iblis alijua ukweli lakini aliukataa kwa kiburi, akionyesha kwamba elimu bila unyenyekevu inaharibu.",
      "Mbinu ya Shaytan ni kunong'ona kwa kudumu, si kwa nguvu - kutambua mapendekezo yake ni nusu ya kuyapinga.",
      "Thamani ya mwanadamu inafungamana na elimu na kurejea kwa Mwenyezi Mungu, na sio kutokuwa na dhambi - ni jibu la upotofu ndilo linalotufafanua.",
    ],
    quran: [
      {
        excerpt: "Kuumbwa kwa Adam na Malaika kusujudu.",
      },
      {
        excerpt: "Mtihani, anguko, na toba.",
      },
    ],
    location: "Jannah, kisha ardhi",
  },
  {
    prophetName: "Nuh",
    title: "Nuh - uvumilivu kwa karne nyingi za kukataa",
    summary: "Miaka 950 ya da'wah, Safina, na gharika kama hukumu ya Mungu.",
    body: [
      "Nuh alitumwa kwa watu waliotumbukia katika ibada ya masanamu, na akawalingania kumwabudu Mwenyezi Mungu peke yake kwa muda wa kustaajabisha - Qur'ani inamtaja alikaa kati yao miaka elfu chini ya hamsini. Aliwaita mchana na usiku, hadharani na faraghani, akiwapa kila sababu: msamaha, mvua, mali, watoto na bustani. Lakini kizazi baada ya kizazi kiligeuka na kumdhihaki, na kuziba masikio yao.",
      "Ilipodhihirika kuwa hawataamini tena, Mwenyezi Mungu alimwamrisha Nuh atengeneze Safina, watu wake wakamdhihaki kwani alijenga merikebu kubwa mbali na bahari yoyote ile, lakini akajibu kuwa inakuja siku wataelewa. Ishara ilikuja wakati tanuri ilipomwagika maji; Nuh akawapandisha ndani Waumini - wachache tu - na jozi za kila aina ya wanyama.",
      "Mafuriko yalipanda na kuwazamisha wale waliokataa. Katika moja ya nyakati za kutoboa zaidi kwa hadithi, mtoto wa Nuh mwenyewe alikataa kupanda, akisisitiza kwamba angepanda mlima ili kuepuka maji, na alikuwa miongoni mwa waliozama - huzuni ya baba haikuweza kushinda kutokuamini kwa mwana. Nuh alipomsihi, Mwenyezi Mungu alifundisha kwamba dhulma ya kijana huyo imekata mshikamano wa imani baina yao.",
      "Amri ilipokuja, maji yalipungua na Sanduku likatua kwenye Mlima Judi. Qur'ani inahifadhi maelezo yote kama 'ishara' kwa kila mtu anayetafakari jinsi Mwenyezi Mungu anavyowaokoa waumini na jinsi subira inavyothibitishwa hatimaye.",
    ],
    lessons: [
      "Utume mrefu na mgumu wenye wafuasi wachache sio kushindwa - Nuh alihubiri kwa karne nyingi, na uaminifu wake, sio idadi yake, ndiyo iliyompendeza Mwenyezi Mungu.",
      "Hakuna kifungo cha familia kinachookoa mtu asiye na imani: Mwana wa Nuh mwenyewe alizama, akithibitisha kwamba mwongozo haurithiwi.",
      "Kudumu katika kumwomba Mwenyezi Mungu, hata dhidi ya dhihaka za kila mara, yenyewe ni aina ya ibada.",
      "Uokoaji wa Mwenyezi Mungu unakuja kwa wakati uliowekwa - muumini hujenga 'safina' ya utiifu kabla ya gharika, akiiamini ahadi.",
    ],
    quran: [
      {
        excerpt: "Hadithi ya Nuh kwa undani.",
      },
      {
        excerpt: "Ombi la Nuh kwa watu wake.",
      },
    ],
    location: "Mesopotamia ya Kale (makadirio ya wanasayansi)",
  },
  {
    prophetName: "Ibrahim",
    title: "Ibrahim rafiki wa Allah (Khalilullah)",
    summary: "Kuvunja masanamu, moto ukafanya poa, dhabihu ya Ismail, kujenga Ka'ba.",
    body: [
      "Hata alipokuwa kijana, Ibrahim alifikiri njia yake kwenye tawhid, akikataa masanamu ya watu wake na baba yake mwenyewe yaliyochongwa na kuyaabudu. Alibishana nao, kisha akatenda: walipokuwa mbali kwenye sikukuu, alivunja masanamu yao yote isipokuwa kubwa zaidi, na walipotaka maelezo aliwaambia waliulize sanamu kubwa lenyewe - kufichua unyonge wa kile wanachokiabudu. Kwa hasira, wakawasha moto mkubwa na wakamtupa ndani, lakini Mwenyezi Mungu akaamrisha: Ewe moto, kuwa baridi na salama juu ya Ibrahim!",
      "Kwa amri ya Mwenyezi Mungu Ibrahim akamwacha mkewe Hajar na mtoto wao mchanga Ismail katika bonde tasa la Makka. Maji yao yalipoisha, Hajar alikimbia kwa kukata tamaa kati ya vilima vya Safa na Marwah akitafuta msaada - msako ambao Waislamu waliigiza tena katika sa'i ya Hija - hadi chemchemi ya Zamzam ilipopasuka kwenye miguu ya mtoto huyo. Miaka mingi baadaye, Ibrahim aliona katika ndoto kwamba angemtoa dhabihu mwanawe mpendwa. Baba na mwana wote walijisalimisha kwa matakwa ya Mwenyezi Mungu; na pale Ibrahim alipokaribia kuitekeleza, Mwenyezi Mungu alimkomboa Ismail kwa kondoo dume mzuri, anayeadhimishwa kila mwaka katika Eid al-Adha.",
      "Kwa pamoja, Ibrahim na mtu mzima Ismail waliinua misingi ya Al-Ka'bah huko Makka, wakiomba huku wakijenga: 'Mola wetu, tukubalie haya.' Ibrahim pia aliomba Mtume anyanyuliwe kutoka miongoni mwa dhuria zao - dua iliyojibiwa karne nyingi baadaye katika Mtume Muhammad ﷺ. Kwa kujitolea kwake kusikoyumba, Mwenyezi Mungu alimtukuza Ibrahim kwa cheo cha kipekee: Khalilullah, rafiki wa karibu wa Mwenyezi Mungu.",
    ],
    lessons: [
      "Tawhid inadai kuvunja viambatanisho vya uwongo, hata kama kuabudu masanamu ni kawaida, kurithiwa na kusimama dhidi yake ni hatari.",
      "Kumtegemea Mwenyezi Mungu kung'aa zaidi wakati amri yake ni ngumu - Ibrahim alisalimu amri hata kumchinja mwanawe, na Mwenyezi Mungu akabadilisha mtihani kwa rehema.",
      "Kumtegemea Mwenyezi Mungu hakumaanishi uzembe: Hajar alikimbia na kutafuta, na Zamzam akaja - juhudi na tawakkul kufanya kazi pamoja.",
      "Matendo ya dhati ya ibada yanarudia vizazi; Ibada za Hija na heshima ya Al-Ka'ba zinarejea kwenye utiifu wa Ibrahim.",
    ],
    quran: [
      {
        excerpt: "Ibrahim na Ismail na sadaka.",
      },
      {
        excerpt: "Agano na urithi.",
      },
    ],
    location: "Iraq, Levant, Makka",
  },
  {
    prophetName: "Yusuf",
    title: "Yusuf - uzuri wa subira (sabr jameel)",
    summary: "Usaliti, utumwa, gerezani, kupanda kwa mamlaka - uaminifu kupitia kila jaribu.",
    body: [
      "Akiwa mvulana, Yusuf aliona ndoto ya nyota kumi na moja, jua, na mwezi ukimsujudia - ishara ya mustakabali mzuri. Baba yake Yakub, mwenyewe nabii, alimwambia aifiche kwa ndugu zake wenye wivu. Wivu wao ukawazidi nguvu: wakamtupa Yusuf chini ya kisima na wakamwambia baba yao mbwa-mwitu amemla. Msafara uliokuwa ukipita ulimpata mvulana huyo na kumuuza huko Misri.",
      "Katika nyumba ya mtukufu alikua mtu wa uzuri wa kushangaza na uadilifu. Mke wa mtukufu huyo alipojaribu kumlawiti, Yusuf alikataa kwa kusema, ‘Najikinga kwa Mwenyezi Mungu,’ na akachagua jela badala ya dhambi alipomtishia. Ingawa hakuwa na hatia, alifungwa jela kwa miaka mingi. Hapo akawaita wafungwa wenzake kwenye tawhid na akazifasiri ndoto zao kwa idhini ya Mwenyezi Mungu.",
      "Mfalme alipotatizwa na ndoto ya ng’ombe saba wanene walioliwa na ng’ombe saba waliokonda, Yusufu aliifasiri kuwa ni miaka saba ya shibe ikifuatiwa na saba ya njaa, na akashauri kuhifadhi nafaka. Hatimaye, akitambuliwa kwa hekima na kutegemeka, aliwekwa kuwa msimamizi wa ghala za Misri.",
      "Njaa hiyo hatimaye iliwasukuma ndugu zake kwenda Misri kutafuta chakula, bila kumtambua waziri mwenye nguvu mbele yao. Baada ya kuwajaribu, Yusuf alijidhihirisha na - badala ya kulipiza kisasi - akawasamehe kabisa: 'Hamna lawama juu yenu leo. Mwenyezi Mungu akusamehe.' Familia iliunganishwa tena, wazazi wake waliheshimiwa, na ndoto ya utotoni ilitimia.",
    ],
    lessons: [
      "Sabr Jameel - subira nzuri - inamaanisha kuvumilia shida bila uchungu au malalamiko kwa watu, kupeleka huzuni yako kwa Mwenyezi Mungu tu kama Yaqub alivyofanya.",
      "Usafi unafaa kwa gharama yoyote: Yusuf alichagua jela badala ya dhambi, na Mwenyezi Mungu akapandisha daraja yake kwa ajili yake.",
      "Mpango wa Mwenyezi Mungu mara nyingi hujificha nyuma ya miaka ya bahati mbaya - kisima, utumwa, na jela vyote vilikuwa hatua kuelekea kwenye heshima ya Yusuf.",
      "Wenye nguvu wanaonyesha nguvu zao kwa msamaha: katika kilele cha uwezo wake, Yusuf aliwasamehe waliomdhulumu.",
    ],
    quran: [
      {
        excerpt: "Hadithi bora zaidi - zilizosimuliwa katika surah moja.",
      },
    ],
    location: "Kanani, Misri",
  },
  {
    prophetName: "Musa",
    title: "Musa alizungumza na Mwenyezi Mungu na kumkabili Firauni",
    summary:
      "Kichaka kinachowaka moto, ishara dhidi ya Farao, Kutoka, Torati, na taifa linalotangatanga.",
    body: [
      'Musa alikua, kwa mpango wa Mwenyezi Mungu, ndani ya kasri ya Farao mwenyewe baada ya mama yake kumweka mtoni ili kumwokoa kutokana na mauaji ya Farao dhidi ya wavulana wa Kiisraeli. Akiwa kijana alikimbia Misri baada ya kuua, na miaka mingi baadaye, akirudi jangwani, aliona moto kwenye Mlima Turi. Hapo Mwenyezi Mungu alizungumza naye moja kwa moja - heshima iliyompa Musa cheo Kalimullah, ambaye alisema na Mwenyezi Mungu - "Hakika mimi ni Mola wako Mlezi." Alitumwa pamoja na nduguye Harun kama msaidizi, arudishwe kwa Firauni dhalimu na kudai: Waache Wana wa Israili waende zao.',
      "Farao alidai kuwa mungu na akakataa. Mwenyezi Mungu alimpa Musa Ishara zilizo wazi, fimbo yake kuwa nyoka aliye hai, na mkono wake unang'aa kuwa mweupe. Farao aliwaita wachawi wake mahiri zaidi ili kumdharau, lakini fimbo ya Musa ilipomeza udanganyifu wao, wachawi walitambua ukweli halisi kutoka kwa hila tu na wakaanguka kusujudu, wakitangaza kumwamini Mola wa Musa na Harun - kama vile Firauni alivyowatishia kuwaua. Mfululizo wa mapigo ulifuata, lakini Farao akawa mgumu tu.",
      "Hatimaye Mwenyezi Mungu akamuamuru Musa awatoe watu wake usiku. Farao akawafuatia mpaka baharini; Musa akaipiga kwa fimbo yake na maji yakagawanyika, na kuwaruhusu waumini kuvuka kwenye nchi kavu. Firauni na jeshi lake walipowafuata, bahari iliwafunika na wakazama. Kisha Musa akapokea Taurati, lakini Bani Isra'il wakathibitika kuwa wakaidi - wakiabudu ndama wa dhahabu bila yeye na kukataa kuingia katika nchi ya ahadi - na walitangatanga kwa miaka arobaini kama matokeo.",
    ],
    lessons: [
      "Sema ukweli kwa dhulma huku ukimtegemea Mwenyezi Mungu kabisa - Musa alikabiliana na mtu mwenye nguvu zaidi wa zama zake akiwa amejihami kwa imani tu.",
      "Hata waumini waaminifu wanaweza kuyumbayumba: wale wachawi waliokuwa wamempinga Musa wakawa, katika dakika moja ya uwazi, imara zaidi kuliko taifa zima lililoona miujiza.",
      "Kushuhudia maajabu peke yake hakutoi imani - mwongozo ni zawadi Mwenyezi Mungu anaitoa kwa moyo mnyenyekevu, sio wenye ukaidi.",
      "Mwenyezi Mungu huwaokoa wanaodhulumiwa na huwahesabia wenye kiburi hata wanavyoonekana kuwa na nguvu.",
    ],
    quran: [
      {
        excerpt: "Musa huko Tur na mbele ya Firauni.",
      },
      {
        excerpt: "Kuzaliwa na malezi.",
      },
    ],
    location: "Misri, Sinai",
  },
  {
    prophetName: "Isa",
    title: "Isa bin Maryam - neno na roho kutoka kwa Mwenyezi Mungu",
    summary:
      "Kuzaliwa kwa muujiza, ishara, kuinuliwa kwa Mwenyezi Mungu - hakuuawa wala kusulubishwa kwa mujibu wa Qur'ani.",
    body: [
      "Maryam, mwanamke msafi na mcha Mungu aliyeteuliwa na Mwenyezi Mungu kuwa ni mbora wa wanawake wa zama zake, alijitenga na familia yake na kwenda sehemu ya mashariki. Hapo Malaika Jibriyl alimtokea katika umbo la mwanamume na akatangaza kwamba Mwenyezi Mungu atamjaalia mtoto safi, ingawa hakuna mtu aliyemgusa. Alichukua mimba kwa neno la Mwenyezi Mungu 'Kuwa,' na Isa akaumbwa - Qur'ani inalinganisha uumbaji wake na ule wa Adam, ulioumbwa bila ya baba, ikionyesha kwamba Mwenyezi Mungu huumba apendavyo.",
      "Aliporudi akiwa amembeba mtoto mchanga, watu wake walimshtaki. Katika utetezi wake, mtoto Isa alizungumza kutoka katika utoto, akijitangaza kuwa yeye ni mtumishi wa Mwenyezi Mungu aliyepewa Kitabu na akamfanya mtume - akisafisha heshima ya mama yake kwa muujiza. Akiwa nabii kwa Wana wa Israili, Isa alipewa dalili zilizo wazi kwa idhini ya Mwenyezi Mungu: aliwaponya vipofu na wenye ukoma, akawahuisha wafu, na akatengeneza ndege kutokana na udongo unaoruka — siku zote akisisitiza kwamba hawa walikuwa ‘kwa idhini ya Mwenyezi Mungu,’ kamwe si kwa uwezo wake.",
      "Qur'ani iko wazi kwamba Isa hakuuawa wala kusulubiwa; bali, ilionekana hivyo kwa maadui zake, na Mwenyezi Mungu alimnyanyua kwake. Imani kuu ya Sunni inashikilia kuwa atarejea kabla ya Siku ya Mwisho. Kimsingi, Kurani inasisitiza kwamba Isa alikuwa nabii wa kibinadamu na mtumishi wa Mwenyezi Mungu, si wa Mungu na si mwana wa Mungu - ujumbe ambao yeye mwenyewe alitangaza tangu utoto hadi mwisho.",
    ],
    lessons: [
      "Mwenyezi Mungu huumba Apendavyo - Kuzaliwa kwa Isa bila baba, kama vile Adamu alivyoumbwa kutokana na udongo, kunaonyesha uwezo Wake haufungwi na sababu za kidunia.",
      "Kila muujiza alioufanya Isa ulikuwa wazi 'kwa idhini ya Mwenyezi Mungu,' akifundisha kwamba Mitume hupitisha uwezo wa Mwenyezi Mungu, wao hawana.",
      "Mitume ni watumishi wa Mwenyezi Mungu walioheshimika, wasiopaswa kuabudiwa kamwe - Qur'ani inalinda hadhi ya kweli ya Isa dhidi ya kutia chumvi.",
      "Usafi, subira na uaminifu wa Maryam vinamfanya kuwa kielelezo cha imani kwa waumini wote, wanawake na wanaume.",
    ],
    quran: [
      {
        excerpt: "Hotuba ya kuzaliwa na utoto.",
      },
      {
        excerpt: "Si kuuawa wala kusulubiwa; iliyoinuliwa.",
      },
    ],
    location: "Palestina",
  },
  {
    prophetName: "Muhammad ﷺ",
    title: "Muhammad ﷺ - muhuri wa Mitume",
    summary: "Mjumbe wa mwisho; Qur'ani imeteremshwa kwa muda wa miaka 23; rehema kwa walimwengu.",
    body: [
      "Muhammad (Swalla Allaahu 'alayhi wa aalihi wa sallam) alizaliwa Makka karibu mwaka 570 CE katika kabila la Maquraishi. Mtoto yatima - baba yake alikufa kabla ya kuzaliwa na mama yake alipokuwa na umri wa miaka sita - alilelewa kwanza na babu yake na kisha ami yake Abu Talib. Muda mrefu kabla ya utume aliaminiwa sana kwa uaminifu wake kiasi kwamba watu wake walimwita al-Amin, 'mwaminifu.' Akiwa na umri wa miaka arobaini, alipokuwa akitafakari katika Pango Hira, alipokea ufunuo wa kwanza wa Kurani kupitia kwa malaika Jibril.",
      "Kwa muda wa miaka kumi na tatu huko Makka aliwaita watu kumwabudu Mwenyezi Mungu peke yake na alikabiliwa na mateso makali: dhihaka, mateso ya wanyonge miongoni mwa wafuasi wake, na kulemaza kwa ukoo wake wa kijamii na kiuchumi. Katika 'mwaka mmoja wa huzuni' alipoteza wote wawili mke wake kipenzi Khadijah na mlinzi wake Abu Talib, na alipotafuta msaada katika Ta'if iliyokuwa karibu alifukuzwa na kupigwa mawe - hata hivyo aliomba kwa ajili ya uongozi wao badala ya kuangamizwa kwao.",
      "Baada ya kuhamia Madinah alijenga jumuiya na akaiongoza kwenye mitihani ya Badr, Uhud, na Mashirikisho. Hatimaye aliporudi kuiteka Makka kwa nguvu nyingi sana, hakulipiza kisasi kwa wale waliomtesa na kumfukuza; akawasamehe na kusema, 'Nendeni, kwa maana mmekuwa huru.' Qur'ani Tukufu inajumlisha ujumbe wake kwa maneno moja - 'rehema kwa walimwengu' - na inaweka wazi wajibu wake ulikuwa kufikisha ujumbe kwa uwazi, sio kumlazimisha yeyote kuamini.",
    ],
    lessons: [
      "Sifa bora kabisa ambayo mtu anaweza kuwa nayo ni tabia ya Mtume ﷺ - soma risala yake kwa karibu na ujitahidi kuijumuisha katika maisha ya kila siku.",
      "Rehema na msamaha ni nguvu, si udhaifu: katika kilele cha uwezo wake aliwasamehe adui zake mbaya zaidi.",
      "Mwitaji kwa Mwenyezi Mungu hufikisha ujumbe kwa ikhlasi na subira, lakini anamwachia Mwenyezi Mungu marejeo - uwongofu ni wake wa kutoa.",
      "Mitihani ni njia ya manabii; kuvumilia shida kwa ajili ya Mwenyezi Mungu, kama alivyofanya, ni alama ya imani ya kweli.",
    ],
    quran: [
      {
        excerpt: "Hatukukutuma ila uwe rehema kwa walimwengu.",
      },
      {
        excerpt: "Wenye kurehemu wao kwa wao, wenye msimamo dhidi ya makafiri.",
      },
    ],
    appLinks: [{}],
  },
];

export const QURAN_GUIDE_THEMES_SW: DeepPartial<QuranGuideTheme>[] = [
  {
    title: "Imani (Imani)",
    summary:
      "Kumwamini Mwenyezi Mungu, na Malaika wake, na vitabu, na Mitume wake, na Siku ya Mwisho, na hukumu ya Mwenyezi Mungu.",
    lessons: [
      "Imani imeegemea kwenye vifungu sita ambavyo Qur’ani inakusanya sehemu moja: kumuamini Mwenyezi Mungu, Malaika Wake, Vitabu vyake vilivyoteremshwa, Mitume Wake, Siku ya Mwisho, na hukumu ya Mwenyezi Mungu – kheri yake na shari.",
      "Imani sio uthibitisho thabiti, wa mara moja. Katika imani ya kawaida ya Sunni inaongezeka kwa utiifu na ukumbusho na inapungua kwa dhambi na kughafilika, hivyo imani ni kitu unachokikuza kikamilifu.",
      "Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) amefundisha kwamba Imani ina matawi zaidi ya sabini, kuanzia lililo kubwa kabisa - ushahidi kwamba hakuna mungu ila Mwenyezi Mungu - hadi kuondosha madhara barabarani, na kuonesha kwamba hata matendo mema madogo ni sehemu ya imani.",
      "Imani ya kweli ni jambo la moyo mbele ya ulimi: kumjua Mwenyezi Mungu, kumpenda kuliko vyote, kuogopa ghadhabu yake, na kumtegemea Yeye kikamilifu.",
    ],
    quran: [
      {
        excerpt: "Mtume ameamini yaliyoteremshwa kwake kutoka kwa Mola wake Mlezi, na Waumini…",
      },
    ],
    hadith: [
      {
        excerpt:
          "Imani ina matawi zaidi ya sabini; aliye juu zaidi ni kusema: Hakuna mungu ila Mwenyezi Mungu, na aliye chini kabisa anaondoa kitu chenye madhara katika njia - na unyenyekevu ni tawi la imani.",
      },
    ],
    actions: [
      "Sasisha shahada yako leo kwa umakini kamili kwa maana yake, sio kama kifungu cha kawaida cha maneno.",
      "Jifunzeni mojawapo ya majina ya Mwenyezi Mungu, yaeleweni, na muombeni kwayo katika du'a zenu.",
    ],
  },
  {
    title: "Sala (Swala)",
    summary: "Tendo la kwanza liliulizwa siku ya kiama - nguzo inayomuunganisha mja na Bwana.",
    lessons: [
      "Swalah ni nguzo ya pili ya Uislamu na kitendo cha kwanza ambacho mja ataulizwa Siku ya Kiyama - ikiwa ni sawa, kumbukumbu iliyobaki inaelekea kufuata.",
      "Qur'ani inasema sala inayofanywa kwa uwepo halisi wa moyo, humzuia mtu kutokana na uchafu na maovu; sio ibada tu bali ni kurudia upya kwa nafsi mara tano kwa siku.",
      "Tofauti na faradhi nyinginezo zilizoteremshwa duniani, Swalah ilifaradhishwa kwa Ummah wakati wa kupaa kwa Mtume ﷺ (al-Isra wal-Mi'raj), ikiashiria kuwa ni zawadi maalum na njia ya Muumini mwenyewe ya kupandisha kwa Mwenyezi Mungu.",
      "Kwa sababu inarudiwa mara tano kila siku, swalah ni mdundo thabiti unaoweka imani hai kati ya ibada moja na nyingine.",
    ],
    quran: [
      {
        excerpt:
          "Hakika Sala inakataza uchafu na maovu, na kumdhukuru Mwenyezi Mungu ni kukubwa zaidi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Amali ya kwanza ya mja itakayohukumiwa Siku ya Qiyaamah ni maombi yake; ikiwa ni sauti amefaulu, na ikiwa ni kasoro ameshindwa na ameshindwa.",
      },
    ],
    actions: [
      "Sali sala moja leo polepole, ukielewa maneno ya al-Fatiha unapoyasoma.",
      "Fungua mwongozo wa Jifunze Swala wa Munib ili kuimarisha sehemu moja ya maombi yako.",
    ],
  },
  {
    title: "Wazazi",
    summary:
      "Kuwatendea wema wazazi kunaambatana na kumuabudu Mwenyezi Mungu - baada ya shirki, wanaonywa kufuru kwao.",
    lessons: [
      "Mwenyezi Mungu anaunganisha wema kwa wazazi moja kwa moja kwenye ibada yake mwenyewe katika Aya hiyo hiyo - ishara ya jinsi haki yao ilivyo na uzito katika Uislamu.",
      "Qur'ani inakataza hata dalili ndogo kabisa ya kuudhi: sio hata kuwasemea 'uff', wala kuwasema kwa ukali, bali kuwahutubia kwa maneno ya upole na ya heshima.",
      "Amri hufikia kilele katika uzee, wakati wazazi wanahitaji sana subira: wajalie kama walivyokujali, na uwapunguzie bawa la unyenyekevu kwa huruma.",
      "Ibada haiishii wakati wa kifo - kuendelea kuwaombea wazazi du'a, kutoa sadaka kwa niaba yao, na kuwaheshimu marafiki zao na ahadi ni vitendo vinavyoendelea vya uaminifu.",
    ],
    quran: [
      {
        excerpt:
          "Mola wako Mlezi ameamrisha kuwa msimuabudu yeyote ila Yeye tu, na muwafanyie wema wazazi wawili.",
      },
    ],
    actions: [
      "Piga simu au utume ujumbe kwa mzazi kwa maneno mazuri leo.",
      "Waombee wazazi wako kwa majina.",
    ],
  },
  {
    title: "Uvumilivu (Sabr)",
    summary: "Uthabiti katika utii, kujizuia na dhambi, na kukubali majaribu.",
    lessons: [
      "Wanachuoni wanaielezea sabr katika sura tatu: subira katika kumtii Mwenyezi Mungu, subira ya kujiepusha na dhambi, na subira katika kukubali hukumu yake pale mitihani inapotokea.",
      "Sabr sio kukata tamaa tu au kusaga meno kwa kujitenga - Qur'ani inaunganisha pamoja na sala kama chanzo cha msaada, hivyo subira ni kazi na inakuelekeza kwa Mwenyezi Mungu, sio mbali.",
      "Mwenyezi Mungu anajitambulisha kuwa â€œpamoja na wanaosubiriâ€ na huwaahidi wenye subira malipo yao bila ya kipimo - heshima isiyokuwa na sifa nyingine yoyote.",
      "Mitume walikuwa ndio watu waliojaribiwa vikali zaidi, na Qur'ani inashikilia uthabiti wao - Ayyub katika ugonjwa, Yaqub katika huzuni, Yusuf kwa khiyana na jela - kama kigezo cha kuigwa.",
    ],
    quran: [
      {
        excerpt:
          "Enyi mlioamini tafuteni msaada kwa subira na maombi. Hakika Mwenyezi Mungu yu pamoja na wanaosubiri.",
      },
    ],
    actions: [
      "Muwasho unapoongezeka leo, tulia, pumua na useme 'Inna lillahi wa inna ilayhi raji'un' kabla ya kujibu.",
      "Geuza dakika moja ya shida wiki hii kuwa rakaa mbili za sala badala ya malalamiko.",
    ],
  },
  {
    title: "Sadaka (Sadaka na Zakat)",
    summary: "Kusafisha mali na kulisha masikini - ishara ya imani ya kweli.",
    lessons: [
      "Zakat - sadaka ya utakaso ya kila mwaka juu ya mali inayostahiki - ni nguzo ya tatu ya Uislamu na wajibu, wakati sadaqah ni utoaji wa hiari usio na kikomo cha juu na aina zisizo na mwisho.",
      "Qur’ani inaahidi kwamba mali inayotolewa kwa ajili ya Mwenyezi Mungu haipotei bali itazidishwa: kama mbegu moja inayoota masuke saba, kila moja likitoa punje mia moja, na Mwenyezi Mungu humzidishia amtakaye.",
      "Msaada sio pesa tu. Mtume (Swalla Allaahu ´alayhi wa sallam) amefundisha kwamba hata kukutana na ndugu yako mwenye uso wa tabasamu ni sadaka, hivyo hakuna aliye masikini wa kutoa.",
      "Kutoa hutakasa mali na mtoaji, kulegeza mshiko wa uchoyo na kujenga huruma - ndio maana neno la zakat lenyewe linamaanisha utakaso na ukuaji.",
    ],
    quran: [
      {
        excerpt:
          "Mfano wa wanao toa katika Njia ya Mwenyezi Mungu ni kama punje inayoota miiba saba...",
      },
    ],
    actions: [
      "Toa kitu leo ​​- pesa, wakati wako, au neno la fadhili - hata kama kidogo na lisiloonekana.",
      "Kagua wajibu wako wa zakat huko Munib na utambue wakati malipo yanayofuata yanastahili.",
    ],
  },
  {
    title: "Toba (Tawbah)",
    summary: "Mwenyezi Mungu anawapenda wanaotubu - mlango uko wazi mpaka roho ifike kooni.",
    lessons: [
      "Tawbah ya ikhlasi ina masharti yaliyo wazi: majuto ya kweli kwa ajili ya dhambi, kuisimamisha mara moja, na azimio thabiti la kutorejea tena - na kama dhambi hiyo imemdhulumu mtu mwingine, kurejesha haki yake pia.",
      "Hakika Mwenyezi Mungu hairuhusu toba tu. Anawapenda wanaorejea Kwake mara kwa mara, basi kurudi baada ya kuteleza ni kupendwa Kwake, wala si alama juu yenu.",
      "Mlango wa rehema ni mpana wa kustaajabisha: Mwenyezi Mungu anawaambia hata wale waliojidhulumu nafsi zao sana wasikate tamaa, kwani Yeye husamehe madhambi yote kwa mwenye kutubia kwa ikhlasi.",
      "Toba haiko kwa ajili ya dhambi kubwa au matukio makubwa - istighfar (kutafuta msamaha) siku nzima hufanya moyo kuwa laini na akaunti safi.",
    ],
    quran: [
      {
        excerpt:
          "Sema: Enyi waja wangu mliojidhulumu nafsi zao, msikate tamaa na rehema ya Mwenyezi Mungu…",
      },
    ],
    actions: [
      "Sema 'Astaghfirullah' mara 100 leo, ukimaanisha hivyo, na uhisi kuinua uzito.",
      "Taja tabia moja unayojua haimpendezi Mwenyezi Mungu na chukua hatua madhubuti ya kwanza kuiacha.",
    ],
  },
  {
    title: "Peponi (Jannah)",
    summary:
      "Thawabu ya milele iliyotayarishwa kwa ajili ya muttaqin - iliyoelezwa kwa undani wazi na ya kutia moyo.",
    lessons: [
      "Qur'ani inaielezea Jannah kwa maelezo ya wazi na ya kutia moyo - bustani ambazo mito inapita chini yake, urahisi wa milele, na kukutana na watu wema - kwa usahihi ili kumfanya Muumini atamani na kujitahidi.",
      "Kuingia Peponi hatimaye ni kwa rehema ya Mwenyezi Mungu, si kwa matendo pekee; imani na juhudi za dhati ndizo njia, lakini hakuna matendo ya mtu ye yote yangeweza kupata thawabu ya milele bila neema yake.",
      "Qur'ani inawataka waumini kushindana na kuharakisha kuelekea msamaha na Bustani 'iliyo upana wa mbingu na ardhi' - inakusudiwa kufuatiliwa kwa bidii, sio kutegemewa tu.",
      "Malipo makubwa kuliko yote sio mabustani wala mito bali ni kuuona Uso wa Mwenyezi Mungu - furaha kuu ambayo watu wa Peponi wameahidiwa.",
    ],
    quran: [
      {
        excerpt:
          "Na kimbilieni maghfira kutoka kwa Mola wenu Mlezi na Pepo yenye upana wa mbingu na ardhi.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Moto wa Jahannam (Jahannam)",
    summary: "Onyo la kweli - sio kuwakatisha tamaa waumini bali kuamsha usikivu.",
    lessons: [
      "Jahannam ni onyo la kweli, si sitiari - Qur'ani inaielezea kwa uwazi ili watu wachukue hatari hiyo kwa uzito na kubadili mkondo wao wakiwa bado wanaweza.",
      "Kuogopa Moto kunakusudiwa kufanya kazi pamoja na kutumaini rehema ya Mwenyezi Mungu: Muumini anatembea kati ya khawf (hofu) na raja (matumaini), kwa hivyo hakuna kukata tamaa au usalama wa uwongo.",
      "Dhambi moja ambayo Qur'ani inaitaja kuwa ni isiyosameheka ikiwa mtu atakufa juu yake ni shirki - kumshirikisha Mwenyezi Mungu. kila kidogo kuliko kumsamehe amtakaye.",
      "Mwenyezi Mungu anaonya ili kuwarudisha watu Kwake, sio kumponda mwenye kutubia - kila onyo limeunganishwa ndani ya Qur'ani kwa mwaliko wa wazi wa kurejea.",
    ],
    quran: [
      {
        excerpt:
          "Hakika Mwenyezi Mungu hasamehi ushirika naye, lakini husamehe yaliyo duni kuliko hayo kwa amtakaye.",
      },
    ],
    actions: [
      "Baada ya kila swala leo, muombe Mwenyezi Mungu kwa ikhlasi akulinde na Moto.",
      "Rudisha tawhid yako: tafakari juu ya kumwabudu Mwenyezi Mungu peke yake, ulinzi wa uhakika kutoka kwa Jahannam.",
    ],
  },
  {
    title: "Haki",
    summary: "Simameni imara kwa ajili ya uadilifu hata dhidi yenu au jamaa zenu.",
    lessons: [
      "Uadilifu katika Qur'ani haubadiliki: simama imara kwa ajili yake hata kama ukweli unahesabika dhidi yako mwenyewe, wazazi wako, au jamaa yako wa karibu.",
      "Mwenyezi Mungu anaamrisha kwamba chuki dhidi ya watu isikusukumishe katika dhulma - 'kuwa mwadilifu; huko ndiko karibu zaidi na haki (taqwa)' — hivyo uadilifu unadaiwa hata kwa maadui.",
      "Ukandamizaji (dhulm) unaonywa vikali dhidi yake; Mtume (Swalla Allaahu ´alayhi wa sallam) amefundisha kuwa dhulma itadhihirika kama giza juu ya mwenye kudhulumu Siku ya Kiyama.",
      "Haki sio tu kwa majaji na watawala - inaishi katika usemi wa uaminifu, kushughulika kwa haki, kutii neno lako, na kumpa kila mtu haki yake inayostahili.",
    ],
    quran: [
      {
        excerpt:
          "Kuweni wasimamizi wa uadilifu, mashahidi kwa ajili ya Mwenyezi Mungu, ijapokuwa ni juu ya nafsi zenu au wazazi wawili na jamaa.",
      },
    ],
    actions: [
      "Mpe mtu haki yake anayostahili leo - mshahara unaostahili, jibu la uaminifu au salio unalodaiwa.",
      "Pata wakati mmoja ambapo upendeleo hukujaribu kutotenda haki, na badala yake uchague haki.",
    ],
  },
  {
    title: "Maarifa",
    summary: "Soma, tafakari, na useme: Mola wangu Mlezi, nizidishie katika ilimu.",
    lessons: [
      "Neno la kwanza kabisa lililoteremshwa katika Qur'ani Tukufu lilikuwa 'Soma' - Uislamu haukufunguliwa kwa ibada bali kwa amri ya kujifunza, kuheshimu ujuzi wa akili na ujuzi wa moyo.",
      "Mwenyezi Mungu alimwambia hata Mtume Wake (Swalla Allaahu ‘alayhi wa aalihi wa sallam) aendelee kuuliza zaidi: ‘Mola wangu, niongezee elimu’—kitu pekee ambacho Qur’ani inamuelekeza kutafuta kuzidishiwa.",
      "Ujuzi wa manufaa unakusudiwa kufanyiwa kazi na kupitishwa; Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) amefundisha kwamba wanachuoni ni warithi wa Mitume, hawarithi mali bali elimu.",
      "Kutafuta elimu tukufu ni ibada yenyewe, na Qur'ani inabainisha waziwazi baina ya wanaojua na wasiojua - 'Je, wako sawa?'",
    ],
    quran: [
      {
        excerpt: "Na sema: Mola wangu Mlezi, nizidishie ilimu.",
      },
    ],
    actions: [
      "Jifunze jambo moja jipya kutoka kwa Qur'ani leo - aya, neno, au hukumu - na umfundishe mtu.",
      "Ikariri du'a 'Rabbi zidni ilma' na useme kabla ya kusoma.",
    ],
  },
  {
    title: "Manabii",
    summary:
      "Hadithi za mwongozo, majaribio, na usaidizi wa kimungu - sio burudani lakini maagizo.",
    lessons: [
      "Qur'ani inafunza kwamba hakuna taifa lililoachwa bila muongozo: 'hapana umma isipokuwa kupita kati yao mwonyaji' - ujumbe huo wa tawhid ulitumwa kila mahali.",
      "Mitume wote walileta mwito mmoja wa msingi - muabuduni Mwenyezi Mungu peke yake - na hadithi zao zinasimuliwa sio kama historia kwa ajili yake bali kama maagizo kwa 'wale wenye akili'.",
      "Muhammad (Swalla Allaahu ‘alayhi wa aalihi wa sallam) ni Muhuri wa Mitume, Mjumbe wa mwisho, na Mwislamu lazima awaamini Mitume wote waliomtangulia - Nuh, Ibrahim, Musa, Isa na wengineo - bila kutofautisha kati yao.",
      "Mitume walikuwa ni wanadamu na watumishi wa Mwenyezi Mungu, sio waungu; Qur'ani inawaheshimu bado inawaweka imara upande wa viumbe, kamwe hawaabudiwi pamoja na Muumba.",
    ],
    quran: [
      {
        excerpt: "Katika hadithi zao kuna funzo kwa wenye ufahamu...",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Wanawake",
    summary: "Haki, utu, na usawa wa kiroho - Maryam ni miongoni mwa wanawake bora zaidi.",
    lessons: [
      "Qur'ani inafunza usawa wa kiroho wa wanaume na wanawake mbele ya Mwenyezi Mungu: imani sawa, matendo yale yale, na malipo yale yale yameahidiwa 'Waumini wanaume na Waumini wanawake' sawa sawa.",
      "Wanawake na wanaume wanaelezewa kama washirika na walinzi wao kwa wao katika imani, si kama mali - surah ya nne, an-Nisa ('Wanawake'), inajitolea kwa kiasi kikubwa kulinda haki zao, utu, urithi, na matibabu.",
      "Qur'ani inamshikilia Maryam, mama yake Isa, kama kielelezo kwa waumini wote, na inawaheshimu sana akina mama kiasi kwamba mafundisho mashuhuri yanaiweka Pepo miguuni mwao.",
      "Jinsia zote mbili zinarejea kwenye asili moja - 'iliyokuumba kutoka kwa nafsi moja' - ikianzisha ubinadamu na heshima iliyoshirikiwa kutoka kwenye aya ya kwanza kabisa ya Surah an-Nisa.",
    ],
    quran: [
      {
        excerpt:
          "Mcheni Mola wenu Mlezi ambaye amekuumbeni kutokana na nafsi moja na akamuumba mshirika wake kutokana nayo.",
      },
    ],
    actions: [
      "Heshimu mwanamke katika maisha yako leo - mama, mke, dada, au binti - kwa haki maalum au wema anaodaiwa.",
    ],
  },
  {
    title: "Watoto",
    summary: "Amana (amana) - kulelewa juu ya tawhiyd na wema.",
    lessons: [
      "Watoto ni amana - amana kutoka kwa Mwenyezi Mungu - na Qur'ani inawawajibisha wazazi kwa malezi yao: 'Jilindeni nafsi zenu na ahali zenu na Moto' inaanza kwa kuwafundisha tawhid na tabia njema.",
      "Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) amehesabu kufundisha na kujifunza Qur-aan miongoni mwa matendo bora, hivyo kumuongoza mtoto kusoma hata kidogo katika hayo hupanda kheri ya kudumu ambayo malipo yake hurejea kwa mzazi.",
      "Sehemu ya hekima ya uzazi inayorudiwa mara nyingi hushauri kukutana na watoto katika hatua yao - kucheza nao katika miaka ya mapema, kisha kuwafundisha na kuwaadhibu kwa upole, kisha kuwafanya urafiki wanapokua.",
      "Kulea mtoto mwadilifu ni uwekezaji zaidi ya maisha haya: mzao mwadilifu anayeomba kwa ajili ya mzazi anaendelea kumnufaisha muda mrefu baada ya kifo.",
    ],
    quran: [
      {
        excerpt: "Enyi mlio amini jilindeni nafsi zenu na ahali zenu na Moto...",
      },
    ],
    actions: [
      "Mfundishe mtoto mstari mmoja mfupi au namna moja nzuri leo, kwa subira na kutia moyo.",
      "Waombee watoto wako (au watoto unaowalea) kwa majina yao ili wawe wanyoofu na wapendwe kwa Mwenyezi Mungu.",
    ],
  },
];

export const QURAN_GUIDE_TAJWEED_SW: DeepPartial<QuranGuideTajweedLesson>[] = [
  {
    title: "Adhuhuri Sakinah & Tanween",
    summary: "Kanuni za ن zenye sukun na tanween - izhar, idgham, iqlab, ikhfa.",
    explanation: [
      "Sakina ya adhuhuri ni herufi ن kubeba sukun (hakuna vokali); tanween ni mwisho wa vokali mara mbili (an, in, un) inayosikika sawa na adhuhuri mwishoni mwa neno. Wote wawili hufuata sheria nne sawa, zilizoamuliwa kabisa na barua inayofuata.",
      "Izhar (matamshi ya wazi): inapofuatwa na mojawapo ya herufi sita za koo ( ء ه ع ح غ خ), tamka mchana kwa uwazi na kwa uwazi, bila kuchanganya pua.",
      "Idgham (kuunganisha): kabla ya herufi za neno 'yarmaloon' (ي ر م ل و ن), mchana huungana na kuwa herufi inayofuata - na ghunnah (sauti ya puani) kwa ي ن م و, na bila ghunnah kwa ل ر.",
      "Iqlab (uongofu): ikifuatwa na ب, adhuhuri inageuzwa kuwa sauti ya meem iliyofichika inayoambatana na ghunnah.",
      "Ikhfa (kujificha): kabla ya herufi kumi na tano zilizosalia, adhuhuri haijatamkwa kikamilifu wala kuunganishwa kikamilifu - 'imefichwa' na ghunnah nyepesi ya pua huku ulimi ukijiandaa kwa herufi inayofuata.",
    ],
    practice:
      "Soma Surah al-Fatiha polepole, na kila wakati unapokutana na sakinah ya adhuhuri au tanween, tulia ili kutaja ni ipi kati ya kanuni nne inatumika na kwa nini.",
  },
  {
    title: "Meem Sakinah",
    summary: "Ikhfaa shafawi, idgham shafawi, na izhar shafawi kwa م pamoja na sukun.",
    explanation: [
      "A meem sakinah ni herufi م inayobeba sukun. Ina kanuni tatu hasa, kila moja inaitwa 'shafawi' (labial) kwa sababu meem inatolewa kwa midomo, na ambayo inatumika inategemea tu herufi ifuatayo.",
      "Idgham shafawi (kuunganisha labial): wakati meem sakinah inapofuatwa na meem nyingine, hizo mbili huungana na kuwa meem moja iliyosisitizwa inayoshikiliwa na ghunnah.",
      "Ikhfa shafawi (maficho ya labial): inapofuatwa na ب, meem hufichwa kidogo - midomo husogea karibu lakini haishinikii kikamilifu - ikiambatana na ghunnah.",
      "Izhar shafawi (uwazi wa labial): kabla ya kila herufi nyingine, meem hutamkwa kwa uwazi. Kuwa mwangalifu sana kabla ya herufi و na ف, ambapo wanafunzi wanajaribiwa sana kuitia ukungu.",
    ],
    practice:
      "Soma surah kadhaa fupi kutoka Juz Amma na uweke alama kwa kila meem, ukitaja sheria yake kabla ya kukariri neno.",
  },
  {
    title: "Madd (Elongation)",
    summary: "Upanuzi wa asili, wa sekondari na muhimu wa vokali.",
    explanation: [
      "Madd inamaanisha kunyoosha sauti ya vokali, na hutokea kwenye herufi tatu za wazimu - alif (ا), waw (و), na ya (ي) - wakati hazina vokali zao wenyewe na kufuata vokali zao fupi zinazolingana.",
      "Madd asli (madd asilia) ni urefu wa msingi wa takriban hesabu mbili, zilizopo popote ambapo herufi ya wazimu inaonekana bila sababu maalum baada yake. Kila msomaji anaishikilia sawasawa.",
      "Madd far'i (madd ya sekondari) huchochewa na hamza au sukun ifuatayo na hudumu kwa muda mrefu zaidi - kwa kawaida hesabu nne au sita. Urefu kamili unategemea aina ya madd na kisomo (riwayah) unayofuata.",
      "Kwa sababu kusimamisha mwisho wa neno kunaweza kuunda sukun, kunaweza pia kurefusha wazimu - sababu moja zaidi ya kujifunza muda kwa sikio kutoka kwa mwalimu aliyehitimu badala ya kubahatisha.",
    ],
    practice:
      "Chagua surah fupi inayojulikana na uhesabu kwa upole '1-2' kwa kila wazimu asilia na '1-2-3-4' kwenye wazimu wa pili, ukiweka sawa wakati wako.",
  },
  {
    title: "Ghunnah",
    summary: "Sauti ya pua inayoambatana na adhuhuri na meem katika idgham na ikhfa.",
    explanation: [
      "Ghunnah ni mwangwi wa pua unaotolewa kupitia pua, ubora wa asili wa herufi mchana (ن) na meem (م). Katika usomaji wa kawaida hushikiliwa kwa takriban hesabu mbili.",
      "Inatakiwa na inatamkwa zaidi katika kanuni kadhaa ambazo tayari umekutana nazo: idgham na ghunnah, ikhfa, iqlab, na wakati wowote adhuhuri au meem inapobeba shaddah.",
      "Sauti inapaswa kuwa laini na kudhibitiwa - sio kuimba au kuvuma tune, lakini sauti ya pua ya utulivu iliyopimwa kwa urefu sahihi.",
      "Jaribio rahisi: Bana pua yako kidogo huku ukitoa herufi ya ghunnah; ikiwa sauti imezuiwa, resonance inakuja kwa kweli kupitia pua kama inavyopaswa.",
    ],
    practice:
      "Soma neno na shaddah adhuhuri au meem, ukishikilia ghunnah kwa hesabu mbili thabiti, kisha ujirekodi na ulinganishe dhidi ya msomaji aliyehitimu.",
  },
  {
    title: "Qalqalah",
    summary: "Mwangwi wa bounce kwenye ق ط ب ج د wakati sakin au unaposimama juu yao.",
    explanation: [
      "Qalqalah ni mwangwi wa 'mdundo' kidogo unaotolewa kwa herufi tano - zilizokusanywa katika kishazi قُطْبُ جَدٍ, yaani ق ط ب ج د - kila zinapobeba sukun.",
      "Bounce ni vibration nyepesi ya hatua ya kutamka; ni lazima usiongeze vokali kamili baada ya herufi, iruhusu tu 'ijirudishe' kwa usafi.",
      "Ni nyepesi (sughra) wakati herufi ina sukun katikati ya neno, na yenye nguvu zaidi na iliyo wazi zaidi (kubra) unaposimama kwenye herufi hiyo mwishoni mwa neno.",
      "Weka mdundo usio na upande wowote - usiinamishe kuelekea sauti ya 'a', 'i', au 'u'; ni mwangwi sawa crisp bila kujali vokali jirani.",
    ],
    practice:
      "Soma Surah al-Ikhlas na usimame kwa uthabiti kwenye kila herufi ya qalqalah - د ya 'ahad' na 'yulad' - ukihisi mduara safi.",
  },
  {
    title: "Waqfu (Kusimama)",
    summary: "Mahali pa kuacha, kupumua, na jinsi kusitisha mabadiliko ya matamshi.",
    explanation: [
      "Waqfu ni sanaa ya mahali na jinsi ya kusitisha. Mushaf huweka alama za kusimamisha kwa alama ndogo - kwa mfano م kwa kituo kinachohitajika, ط na ج kwa vituo vinavyoruhusiwa, na لا ikimaanisha haiishii hapa - kumwongoza msomaji.",
      "Kuacha kwa kawaida hunyamazisha vokali ya mwisho, na kugeuza herufi ya mwisho kuwa sukun. Badiliko hilo basi linaweza kuanzisha sheria zingine, kama vile qalqalah au kichaa mrefu, kwa hivyo neno linaweza kusikika tofauti unaposimama juu yake kuliko unapoendelea.",
      "Mahali unapositisha kunaweza kuathiri maana, kwa hivyo usiwahi kuvunja kishazi cha kati kwa njia inayokipotosha. Kesi maalum ni mu'anaqa (kukumbatia) waqf, iliyo na alama tatu, ambapo unaweza kusimama kwenye moja ya nukta mbili lakini sio zote mbili.",
      "Njia salama zaidi ya kujifunza vituo sahihi ni mushaf inayoonyesha alama za waqf pamoja na msomaji aliyehitimu, kwa hivyo mapumziko yako yalingane na usomaji unaotumwa.",
    ],
    practice:
      "Chukua ukurasa mmoja wenye alama za waqf na uisome kwa sauti kufuatia rekodi ya mwalimu wa tajweed, ukisimama hasa pale alama zinaonyesha.",
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

export const QURAN_GUIDE_VOCABULARY_SW: DeepPartial<QuranGuideVocabEntry>[] = [
  {
    meaning: "Mungu mmoja wa kweli - jina linalofaa linalojumuisha majina yote mazuri.",
    frequency: "Matukio 2,700+",
    example: "Bismillah - Kwa jina la Mwenyezi Mungu",
    quranRef: {
      excerpt: "Kwa jina la Mwenyezi Mungu, Mwingi wa Rehema, Mwenye kurehemu.",
    },
  },
  {
    meaning: "Bwana, Mwalimu, Mfadhili - yule anayeumba, anayemiliki, anayelea na kutawala.",
    frequency: "Mara kwa mara sana",
    example: "Rabbana - Mola wetu",
    quranRef: {
      excerpt: "Sifa njema zote ni za Mwenyezi Mungu, Mola Mlezi wa walimwengu wote.",
    },
  },
  {
    meaning: "Rehema, huruma, huruma kutoka kwa Mwenyezi Mungu na miongoni mwa viumbe.",
    frequency: "Mzizi wa kawaida ر-ح-م",
    example: "Ar-Rahman, Ar-Rahim",
  },
  {
    meaning: "Bustani, Pepo - makazi ya milele ya malipo.",
    frequency: "Mara kwa mara",
    example: "Bustani zipitazo mito kati yake",
  },
  {
    meaning: "Moto - inarejelea Jahannam kama onyo na matokeo.",
    frequency: "Mara kwa mara",
    example: "Uogopeni Moto ulioandaliwa kwa ajili ya makafiri",
  },
  {
    meaning: "Imani, imani, kumtegemea Mwenyezi Mungu na kukubali ujumbe wake.",
    frequency: "Mara kwa mara sana",
    example: "Enyi mlioamini (ya ayyuha alladhina amanu)",
  },
  {
    meaning: "Subira, uthabiti, subira kwa ajili ya Mwenyezi Mungu.",
    frequency: "Mara kwa mara",
    example: "Hakika Mwenyezi Mungu yu pamoja na wanaosubiri",
  },
  {
    meaning: "Shukrani - kukiri baraka kwa moyo, ulimi, na viungo.",
    frequency: "Mara kwa mara",
    example: "Mkishukuru bila shaka nitakuzidishieni",
  },
  {
    meaning: "Kumcha Mungu, kumcha Mungu, kujilinda na dhambi kwa kumcha Mwenyezi Mungu.",
    frequency: "Mara kwa mara sana",
    example:
      "Aliye mtukufu zaidi miongoni mwenu mbele ya Mwenyezi Mungu ni yule aliye mchamngu zaidi",
  },
  {
    meaning: "Riziki, na riziki - Anayoiandikia Mwenyezi Mungu kwa kila nafsi.",
    frequency: "Mara kwa mara",
    example: "Mwenyezi Mungu ndiye mbora wa wanao ruzuku",
  },
  {
    meaning: "Nuru - mwongozo, ufunuo, na mwanga wa moyo.",
    frequency: "Mara kwa mara",
    example: "Mwenyezi Mungu ni Nuru ya mbingu na ardhi",
    quranRef: {
      excerpt: "Mwenyezi Mungu ni Nuru ya mbingu na ardhi...",
    },
  },
  {
    meaning:
      "Maisha haya ya kidunia - kihalisi maisha ya 'ya chini/ya karibu zaidi'. Katika Qur-aan ni ya muda na ni mtihani, ukilinganishwa na akhirah ya kudumu, na wala sio nyumba ya kweli ya Muumini.",
    frequency: "Mara kwa mara",
    example: "Maisha ya dunia (al-hayat ad-dunya) ni pumbao na pumbao tu",
  },
  {
    meaning:
      "Akhera - uzima wa milele baada ya kifo, ikiwa ni pamoja na ufufuo, hukumu, Paradiso, na Jahannamu. Ndio maisha halisi na ya kudumu ambayo Qur'ani inawahimiza waumini kuyafanyia kazi.",
    frequency: "Mara kwa mara",
    example: "Na Akhera (al-akhirah) ni bora na yenye kudumu zaidi",
  },
  {
    meaning:
      "Sala ya ibada, nguzo ya pili ya Uislamu, ilifanyika mara tano kila siku. Neno hilo pia limebeba maana ya kuunganishwa na kumuomba Mwenyezi Mungu.",
    frequency: "Mara kwa mara sana",
    example: "Simamisha sala (aqim as-Swala) kwa ukumbusho wangu",
  },
  {
    meaning:
      "Kitabu au maandiko - mara nyingi Qur'ani yenyewe ('hicho ni Kitabu'), lakini pia maandiko ya awali yaliyofunuliwa na kumbukumbu ya matendo. Inayo mizizi katika k-t-b, kuandika.",
    frequency: "Mara kwa mara sana",
    example: "Hiki ni Kitabu (dhalika al-kitab) ambacho hakina shaka juu yake",
  },
];

export const QURAN_GUIDE_LETTERS_SW: DeepPartial<QuranGuideLetter>[] = [
  {
    name: "Alif",
    pronunciation: "Muda mrefu /a/ kama katika 'baba' (wakati wa kubeba hamza au wazimu)",
  },
  {
    name: "Ba",
    pronunciation: "Kama Kiingereza 'b'",
  },
  {
    name: "Ta",
    pronunciation: "Kama Kiingereza 't'",
  },
  {
    name: "Tha",
    pronunciation: "Kama 'th' katika 'fikiri'",
  },
  {
    name: "Jim",
    pronunciation: "Kama 'j' kwenye 'jam'",
  },
  {
    name: "Ha",
    pronunciation: "h yenye pumzi kali kutoka kooni — si Kiingereza 'h'",
  },
  {
    name: "Kha",
    pronunciation: "Kama 'loch' ya Kiskoti - msuguano kwenye koo",
  },
  {
    name: "Dal",
    pronunciation: "Kama Kiingereza 'd'",
  },
  {
    name: "Dhal",
    pronunciation: "Kama 'th' katika 'hii'",
  },
  {
    name: "Ra",
    pronunciation: "Imeviringishwa/kukatwa 'r'",
  },
  {
    name: "Zay",
    pronunciation: "Kama Kiingereza 'z'",
  },
  {
    name: "Dhambi",
    pronunciation: "Kama Kiingereza 's'",
  },
  {
    name: "Shin",
    pronunciation: "Kama 'sh' kwenye 'meli'",
  },
  {
    name: "Inasikitisha",
    pronunciation: "Emphatic 's' - ulimi umeinuliwa, sauti kamili zaidi",
  },
  {
    name: "Baba",
    pronunciation: "Emphatic 'd' — pekee kwa Kiarabu",
  },
  {
    name: "Ta (msisitizo)",
    pronunciation: "Msisitizo 't' - ndani zaidi mdomoni",
  },
  {
    name: "Za (msisitizo)",
    pronunciation: "Toleo la kusisitiza la sauti ya 'dh'",
  },
  {
    name: "Ayn",
    pronunciation:
      "Kupunguza sauti kutoka katikati ya koo - hakuna sawa na Kiingereza; jifunze kwa kumwiga msomaji",
  },
  {
    name: "Ghayn",
    pronunciation: "Kama Kifaransa 'r' au kuguna 'gh'",
  },
  {
    name: "Fa",
    pronunciation: "Kama Kiingereza 'f'",
  },
  {
    name: "Qaf",
    pronunciation: "Kina 'k' kutoka nyuma ya ulimi - sio Kiingereza 'k'",
  },
  {
    name: "Kaf",
    pronunciation: "Kama Kiingereza 'k' (mbele mdomoni)",
  },
  {
    name: "Lam",
    pronunciation: "Kama Kiingereza 'l'",
  },
  {
    name: "Mim",
    pronunciation: "Kama Kiingereza 'm'",
  },
  {
    name: "Mtawa",
    pronunciation: "Kama Kiingereza 'n'",
  },
  {
    name: "Ha (mwanga)",
    pronunciation: "Laini 'h' mwishoni mwa maneno",
  },
  {
    name: "Waw",
    pronunciation: "Kama 'w' au 'oo' ndefu",
  },
  {
    name: "Ndiyo",
    pronunciation: "Kama 'y' au 'ee' ndefu",
  },
];

export const QURAN_GUIDE_PRONUNCIATION_SW: DeepPartial<QuranGuidePronunciationPair>[] = [
  {
    title: "Ayn vs Ha",
    tip: "Vyote viwili vinatoka kooni lakini vinatofautiana kwa sauti. Ayn (ع) ni mfinyo wa sauti kutoka katikati ya koo - nyuzi za sauti hutetemeka. Ha (ح) ni msuguano mkali, usio na sauti, kama pumzi nzito isiyo na mtetemo. Wala haipo kwa Kiingereza, kwa hivyo jifunze kwa sikio kutoka kwa msomaji.",
  },
  {
    title: "Ha vs Kha",
    tip: "Ha ni kali na nyepesi; Kha ni ndani zaidi na msuguano zaidi - kama 'loch'.",
  },
  {
    title: "Dhambi dhidi ya huzuni",
    tip: "Sin (س) ni 's' nyepesi, nyembamba kama kwa Kiingereza 'see'. Huzuni (ص) ni pacha wake mzito, msisitizo: inua sehemu ya nyuma ya ulimi, zungusha mdomo kidogo, na sauti huongezeka. Kuzichanganya kunaweza kubadilisha maneno - sabr (uvumilivu) dhidi ya kusoma kwa mwanga.",
  },
  {
    title: "Dal vs Baba",
    tip: "Dal (د) ni 'd' wazi. Baba (ض) ni 'd' nzito na ya kusisitiza ya kipekee kwa Kiarabu — bonyeza upande wa ulimi dhidi ya molari ya juu na uruhusu sauti ijaze kinywa. Kiarabu hata hupewa jina la utani 'lugha ya Baba' kwa sababu ya herufi hii tofauti.",
  },
  {
    title: "Ta dhidi ya Ta (msisitizo)",
    tip: "Msisitizo ط ni wa ndani zaidi; usibadilishe na Kiingereza 't' pekee.",
  },
  {
    title: "Dhal dhidi ya Za (msisitizo)",
    tip: "Zote zinahusisha sauti za 'th'; ظ ni nzito na inasisitiza.",
  },
  {
    tip: "Kaf (ك) ni mbele 'k' kama Kiingereza 'key'. Qaf (ق) imefanywa nyuma zaidi - sehemu ya nyuma ya ulimi inagusa uvula, ikitoa 'k' ya kina, ya ndani bila Kiingereza sawa. Waweke tofauti: qalb (moyo) sio kalb (mbwa).",
    title: "Kafu dhidi ya Qaf",
  },
  {
    title: "Ghayn dhidi ya Kha",
    tip: "Ghayn ana sauti; Kha ni msuguano usio na sauti.",
  },
];

export const QURAN_GUIDE_MEMORIZATION_PLANS_SW: DeepPartial<QuranGuideMemorizationPlan>[] = [
  {
    title: "Anayeanza - Juz Amma",
    summary:
      "Mahali pa kuanzia asili kwa kila mtu. Anza na surah fupi sana mwishoni mwa mus'haf - kutoka kwa an-Nas zinazofanya kazi nyuma - ambazo ni rahisi, zenye malipo ya haraka, na muhimu katika kila sala.",
    surahs: ["An-Nas", "Al-Falaq", "Al-Ikhlas", "Al-Masad", "An-Nasr", "Al-Kafirun", "Al-Kawthar"],
    tip: "Kariri aya moja tu kwa siku: msikilize msomaji wa murattal akiirudia takriban mara kumi, iitikie kwa sauti hadi inatiririka, kisha unganisha na kile ambacho tayari umeshikilia kabla ya kuendelea.",
  },
  {
    title: "Kati - Sura kumi za msingi",
    summary:
      "Pindi Sura fupi zinapokuwa thabiti, chukua sura ndefu zinazopendwa sana ambazo zimebeba fadhila kubwa na mara nyingi husomwa siku ya Ijumaa na usiku - al-Mulk, Ya-Sin, ar-Rahman, al-Waqi'ah, na al-Kahf miongoni mwao.",
    surahs: [
      "Al-Fatiha",
      "Al-Mulk",
      "Ya-Sin",
      "Ar-Rahman",
      "Al-Waqi ́ah",
      "Al-Kahf",
      "Al-Jumu'ah",
      "Al-Hashr",
    ],
    tip: "Anzisha kumbukumbu mpya kwenye nafasi isiyobadilika ya kila siku - wakati tulivu, na wenye nia safi baada tu ya Fajr kuwa bora - kwa hivyo uthabiti hufanya kazi ya kuinua nzito.",
  },
  {
    title: "Advanced - Juz moja",
    summary:
      "Jitolee kukamilisha juz kamili huku ukiweka kila kitu kabla ya kuwa thabiti. Nyingi huanza na Juz 29 au 30, ambazo surah zao tayari wanazijua kwa kiasi, kisha kupanua juz moja kwa wakati mmoja.",
    surahs: ["Chagua juz - nyingi huanza na Juz 29 au 30, kisha kupanua"],
    tip: "Usiongeze kamwe sehemu mpya hadi ya zamani irekebishwe kwa uthabiti. Mtume (Swalla Allaahu ´alayhi wa sallam) alionya kuwa Qur-aan iliyohifadhiwa huteleza haraka kuliko ngamia aliyefungwa anavyokatika.",
  },
  {
    title: "Safari ya Hafidh",
    summary:
      "Kukariri Kurani nzima - heshima ya maisha yote ambayo humwinua yule anayeibeba na, kwa neema ya Mwenyezi Mungu, wazazi wao. Ni ahadi nzito, kwa kawaida huchukua miaka kadhaa ya kumbukumbu mpya ya kila siku na marekebisho ya nidhamu.",
    surahs: ["Mushaf nzima - kwa kawaida miaka 3-7 na masahihisho ya kila siku"],
    tip: "Usijaribu peke yako: tumia kifuatiliaji hifz cha Munib ili kudhibiti ratiba yako ya masahihisho, na ukariri mara kwa mara kwa hafiz au mwalimu aliyehitimu ambaye anaweza kupata na kurekebisha makosa yako.",
  },
];

export const QURAN_GUIDE_DAILY_LESSONS_SW: DeepPartial<QuranGuideDailyLesson>[] = [
  {
    translation:
      "Enyi mlioamini tafuteni msaada kwa subira na maombi. Hakika Mwenyezi Mungu yu pamoja na wanaosubiri.",
    context:
      "Kutoka kwa Surah al-Baqarah, iliyoteremka Madina. Mwenyezi Mungu anaunganisha vyanzo viwili vya nguvu kwa Muumini anayekabiliwa na dhiki - subira ya subira na kurejea kwenye sala - na anaahidi urafiki Wake maalum kwa wale wanaoshikilia.",
    reflection:
      "Je, ni jaribu gani ninalokabiliana nalo sasa hivi ambapo ninafikia kutoroka haraka badala ya subira na maombi aya hii inayonielekeza?",
    action:
      "Sali moja leo bila kuharakisha, na katika sujuud yako muombe Mwenyezi Mungu kwa jina akupe subira katika mtihani maalum unaoupitia.",
  },
  {
    translation: "Rehema yangu imekizunguka kila kitu.",
    context:
      "Kutoka katika Surah al-A'raf, iliyosemwa katika mazingira ya Musa na watu wake. Mwenyezi Mungu anaielezea rehema yake kuwa ni kukikumbatia kila kitu - ni rehema kubwa mno inayotangulia na ipitayo adhabu yake, ambayo imehifadhiwa kwa wanaoendelea kudhulumu.",
    reflection:
      "Je, ni kosa la nani ninakataa kusamehe, ingawa mimi mwenyewe nategemea kabisa rehema ya Mwenyezi Mungu isiyo na mipaka?",
    action:
      "Chagua mtu mmoja unayemchukia, msamehe kwa ikhlasi katika moyo wako leo, na uombe dua fupi kumuomba Mwenyezi Mungu awaongoze na awasamehe pia.",
  },
  {
    translation: "Mkishukuru bila shaka nitakuzidishieni.",
    context:
      "Kutoka kwa Surah Ibrahim, sehemu ya ukumbusho wa Musa kwa Bani Isra'il. Mwenyezi Mungu hufungamanisha ongezeko lake moja kwa moja na shukurani - shukurani kwa ajili ya baraka ndicho kitu hasa kinachoikuza, na kutokushukuru kunakaribisha hasara yake.",
    reflection:
      "Ni zawadi gani kati ya zawadi za Mwenyezi Mungu - afya yangu, familia, imani, au riziki yangu - nimeanza kuichukulia wiki hii kama ya kawaida na ninayodaiwa?",
    action:
      "Kabla ya kulala usiku huu, sema 'Alhamdulillah' kwa sauti kwa ajili ya baraka tatu mahususi, ukitaja kila moja ili shukrani iwe na ufahamu, si ya moja kwa moja.",
  },
  {
    translation: "Na semeni na watu maneno mazuri.",
    context:
      "Kutoka kwa Surah al-Isra. Katika muongozo wa jinsi waumini wanavyopaswa kujibebea, Mwenyezi Mungu anaamuru tuzungumze na watu - watu wote - kwa njia bora, kwani maneno makali ni moja ya milango ambayo Shetani huingiza mgawanyiko.",
    reflection:
      "Nikitazama nyuma leo, je, maneno yangu yaliwajenga watu au kuwadharau - na je, nilizungumza 'maneno mazuri' hata kwa wale ninaowaona kuwa wagumu?",
    action:
      "Mhimize au umshukuru kwa dhati mtu mmoja leo bila ukosoaji uliofichika, na uzuie kauli moja kali uliyojaribiwa kutoa.",
  },
  {
    translation: "Anayemtegemea Mwenyezi Mungu basi Yeye humtosheleza.",
    context:
      "Kutoka kwa Surah at-Talaq, iliyowekwa kati ya hukumu za talaka na utoaji - haswa ambapo watu wanahisi wasiwasi zaidi wa kifedha. Hapo Mwenyezi Mungu anaahidi kwamba anayemcha Yeye atamruzuku mahali ambapo hawakutarajia, na anayemtegemea Yeye atamtosha.",
    reflection:
      "Ni wapi ninapopanga mipango makini lakini nikimuacha Mwenyezi Mungu nje yake - au nikiegemea msaada wa watu bila kurejea Kwake katika dua?",
    action:
      "Chukua uamuzi mmoja unaokutia wasiwasi, sali rakaa mbili za istikhara au uombe dua ya dhati juu yake, kisha utegemee matokeo kwa Mwenyezi Mungu.",
  },
  {
    translation: "Mola wangu Mlezi nizidishie ilimu.",
    context:
      "Kutoka kwa Surah Ta-Ha. Hili ndilo jambo pekee ndani ya Qur'ani ambalo Mwenyezi Mungu anamwagiza Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) kuuliza zaidi - elimu - ambayo inaonyesha jinsi elimu yenye manufaa inavyothaminiwa na kwamba hakuna mtu, hata kama amesoma, haishiwi kuitafuta.",
    reflection:
      "Je, ni muda gani wa muda wangu wa kupumzika leo ambao ulienda kwenye kusogeza bila mwisho, na je, hata sehemu yake inaweza kwenda kujifunza aya moja au hadith moja badala yake?",
    action:
      "Kariri du'a hii fupi, 'Rabbi zidni ilma,' na uwe na mazoea ya kusema baada ya Alfajiri kabla ya kuanza siku yako.",
  },
  {
    translation:
      "Mfano wa wanao toa mali zao katika njia ya Mwenyezi Mungu ni kama mbegu iliyoota miiko saba...",
    context:
      "Kutoka kwa Surah al-Baqarah. Mwenyezi Mungu anachora taswira wazi ya jinsi sadaka inavyomea: mbegu moja ikichipua masuke saba, kila moja yakiwa na punje mia moja - marejeo ya mia saba, na humzidishia amtakaye zaidi. Utajiri unaotolewa kwa ajili yake haupotei kamwe.",
    reflection:
      "Ninapotoa, je, hufanywa kimya kimya kwa ajili ya Mwenyezi Mungu, au najikuta nikitaka wengine wanione na kunisifu kwa hilo?",
    action:
      "Toeni sadaqah ndogo leo, na mkiweza toeni kwa siri, basi ni baina yenu na Mwenyezi Mungu.",
  },
];

export const QURAN_GUIDE_APPLY_CHALLENGES_SW: DeepPartial<QuranGuideApplyChallenge>[] = [
  {
    verseExcerpt: "Na semeni na watu maneno mazuri.",
    challenge:
      "Siku nzima bila neno moja kali, la kejeli au la dhihaka - hata kwa mzaha, hata unapokasirishwa.",
    habit: "Kero inapoongezeka, tulia kabla ya kujibu na uchague kunyamaza au neno la fadhili.",
  },
  {
    verseExcerpt: "Waambie Waumini wanaume wainamishe macho yao...",
    challenge:
      "Inua macho yako kwa makusudi mbali na yale aliyoharamisha Mwenyezi Mungu leo ​​- kwenye skrini yako, mipasho yako na hadharani.",
    habit: "Kila unapojipata, elekeza muda huo kwenye dakika tano za Qur'ani badala yake.",
  },
  {
    verseExcerpt: "Usiseme nao 'uff' ...",
    challenge:
      "Zungumza na mzazi au mzee leo kwa upole na subira inayoonekana, usionyeshe hata chembe ya kuudhika - na ufanye jambo la kuwahudumia.",
    habit:
      "Ikiwa wako hai, jitolea kwa simu ya kawaida au kutembelea; kama sivyo basi waombee dua.",
  },
  {
    verseExcerpt: "Kuwa pamoja na wakweli.",
    challenge:
      "Sema ukweli siku nzima bila uwongo mweupe, utiaji chumvi, na uvumi - hata kwa mzaha.",
    habit: "Ukiteleza, tubu mara moja na urekebishe chochote kilichoathiri maneno yako.",
  },
  {
    verseExcerpt: "Mwenyezi Mungu yu pamoja na wanaosubiri.",
    challenge:
      "Wakati ujao kitu kitakukatisha tamaa, zuia kila neno kali kwa sekunde sitini kamili kabla ya kujibu.",
    habit: "Geuza nyakati za kuudhika kuwa dhikr au rakaa mbili za sala wakati wowote uwezapo.",
  },
  {
    verseExcerpt: "Ukishukuru nitakuzidishia.",
    challenge: "Washukuru watu watatu tofauti kwa majina leo kwa kitu mahususi walichokufanyia.",
    habit:
      "Maliza kila usiku kwa kuandika baraka moja - mstari mmoja katika shajara yako ya Munib.",
  },
  {
    verseExcerpt: "Mwenye kusamehe na akasuluhisha basi malipo yake yako kwa Mwenyezi Mungu.",
    challenge:
      "Acha chuki moja ambayo umekuwa nayo - iachilie kwa dhati, angalau ndani ya moyo wako mwenyewe.",
    habit: "Omba du'a ya utulivu kwa mtu aliyekukosea badala ya kurudia uchungu.",
  },
];

export const QURAN_GUIDE_TADABBUR_PROMPTS_SW: DeepPartial<QuranGuideTadabburPrompt>[] = [
  {
    question: "Mwenyezi Mungu ananifundisha nini katika aya hii?",
    hint: "Soma aya polepole na utambue vizuizi vyake vya ujenzi: je Mwenyezi Mungu anatoa amri, onyo, ahadi, au anasimulia hadithi? Anatumia jina Lake lipi, na jina hilo linafunua nini kuhusu jinsi Anavyoshughulika nasi hapa?",
  },
  {
    question: "Ninawezaje kutumia hii leo katika hatua moja madhubuti?",
    hint: "Maazimio yasiyo wazi hufifia; fimbo maalum. Geuza mstari kuwa hatua moja inayoweza kutekelezeka - mazungumzo moja ya kuwa nayo, tabia moja ya kuanza, chaguo moja la kufanya kabla ya siku kuisha.",
  },
  {
    question: "Je, ni tabia gani ninayopaswa kuboresha au kuondoa kwa sababu ya mstari huu?",
    hint: "Lete ayah kwenye utaratibu wako wa kila siku - usingizi wako, hotuba yako, matumizi yako, maombi yako, mahusiano yako. Je, mstari huu unamnyoshea kidole yupi kimya kimya?",
  },
  {
    question:
      "Je, aya hii inanisukuma kutumainia rehema ya Mwenyezi Mungu au khofu ya uadilifu Wake - na kwa nini yote mawili ni muhimu?",
    hint: "Muumini hutembea kati ya khawf (kuogopa adhabu ya Mwenyezi Mungu) na raja (kutarajia rehema Yake), kama mbawa mbili. Uliza ni ipi aya hii inaimarisha ndani yako hivi sasa, na kama moyo wako unahitaji zaidi yake.",
  },
  {
    question: "Je, Mtume ﷺ aliishije ayah hii?",
    hint: "Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) alielezewa kuwa ni 'Qur'ani inayotembea.' Angalia serah na tafsir - Ibn Kathir mara nyingi anataja jinsi alivyojumuisha aya - na chukua mfano wake kama mfano wa vitendo.",
  },
  {
    question: "Je, aya hii inahimiza du'a gani?",
    hint: "Hebu aya hiyo iwe sala. Muombeni Mwenyezi Mungu kwa maneno yenu wakati wa sujuud, kwa lolote ambalo Aayah imechochea - kujikinga na onyo, sehemu ya ahadi, au msaada wa kutii amri.",
  },
];

export const QURAN_GUIDE_READING_LEVELS_SW: DeepPartial<QuranGuideReadingLevel>[] = [
  {
    title: "Alfabeti ya Kiarabu",
    summary:
      "Jifunze kutambua herufi zote 28 katika umbo lao pekee na ujue kila moja kwa jina. Huu ni ujuzi kamili - kuona barua na kutaja sauti yake papo hapo - na ndio msingi wa kila kitu kingine hujengwa.",
    topics: ["Majina ya barua", "Maumbo ya msingi", "Mwelekeo wa kulia kwenda kushoto"],
  },
  {
    title: "Maumbo ya barua",
    summary:
      "Gundua kwamba herufi nyingi hubadilika umbo kulingana na mahali zilipo - mwanzo, katikati au mwisho wa neno - kwa sababu Kiarabu kimeunganishwa kama laana. Jifunze ni herufi zipi chache ambazo hazijaunganishwa na moja baada yao.",
    topics: ["Uandishi uliounganishwa", "Barua zisizounganishwa", "Alif, waw, ya anuwai"],
  },
  {
    title: "Harakat (vokali)",
    summary:
      "Tamilia alama ndogo zinazoipa kila herufi vokali yake: fatha (a), kasra (i), damma (u), sukun isiyo na vokali, shaddah inayoongezeka maradufu, na miisho ya tanween. Alama hizi ndizo zinazogeuza herufi zisizo na sauti kuwa maneno yanayosomeka.",
    topics: ["Vokali fupi", "Sukun", "Shaddah maradufu", "Tanween"],
  },
  {
    title: "Barua za kujiunga",
    summary:
      "Weka pamoja: changanya herufi na harakat zao kuwa silabi na maneno mafupi, ukisoma kulia kwenda kushoto. Kutana na sheria ya herufi ya jua na mwezi ambayo huamua jinsi neno 'al-' linavyotamkwa mwanzoni mwa neno.",
    topics: ["Mitindo ya CV", "Viambishi awali vya kawaida", "Barua za jua na mwezi"],
  },
  {
    title: "Kusoma maneno",
    summary:
      "Anza kuorodhesha msamiati halisi wa Qur'ani polepole na kwa usahihi - ukianza na Bismillah na maneno ya al-Fatiha unayosoma katika kila sala - ili kusoma kuunganishwe na ibada tangu mwanzo kabisa.",
    topics: ["Maneno ya juu-frequency", "Bismillah", "Maneno ya Al-Fatiha"],
  },
  {
    title: "Kusoma mistari",
    summary:
      "Sogeza hadi ayah fupi kamili kutoka Juz Amma, ukiongeza ufahamu wa tajweed msingi na mahali pa kusitisha ili upate pumzi (waqf), kila wakati soma pamoja na msomaji ili sikio lako liongoze ulimi wako.",
    topics: ["Sura za Juz Amma", "Alama za Waqf", "Kufuatia msomaji"],
  },
  {
    title: "Kusoma kwa ufasaha",
    summary:
      "Fikia usomaji laini, unaojiamini na sheria za tajweed zinazotumika kawaida. Dumisha sehemu ya kila siku na uendelee na mwalimu au msomaji aliyehitimu akikagua, kwa kuwa ufasaha huboreshwa kupitia urekebishaji unaoendelea, haupatikani mara moja na kushoto.",
    topics: ["Sehemu ya kila siku", "Sheria za Tajweed zimetumika", "Maoni ya mwalimu"],
  },
];

export const QURAN_GUIDE_QUIZ_SW: DeepPartial<QuranGuideQuizQuestion>[] = [
  {
    prompt: "Je, kuna surah (sura) ngapi kwenye Qur'ani?",
    options: ["99", "114", "124", "144"],
    explanation:
      "Qur'ani ina surah 114, kuanzia aya tatu hadi 286. Mpangilio wao katika mus'haf uliwekwa kwa wahyi (tawqifi).",
  },
  {
    prompt:
      "Je, ni sehemu ngapi zilizo sawa (juz) ambazo Qur'ani imegawanywa kwa usomaji wa kila siku?",
    options: ["7", "12", "30", "60"],
    explanation:
      "Juz thelathini. Kukariri juzi moja kwa siku kunakamilisha Kurani nzima kwa mwezi mmoja - njia ya kawaida ya kumaliza khatm wakati wa Ramadhani.",
  },
  {
    prompt: "Je, ni sura gani ndefu zaidi katika Kurani, yenye aya 286?",
    options: ["Al-Fatihah", "Al-Baqarah", "Ya-Sin", "An-Nas"],
    explanation:
      "Surah al-Baqarah ndiyo ndefu zaidi, yenye aya 286. Ni Sura ya Madani yenye sheria nyingi na mwongozo.",
  },
  {
    prompt: "Kweli au uongo: Sura ya Makki ni ile iliyoteremshwa kabla ya Hijra kwenda Madina.",
    options: ["Kweli", "Uongo"],
    explanation:
      "Sura za Makki ziliteremshwa kabla ya Hijra na mara nyingi huzingatia imani na tawhid; Sura za Madani zilikuja baada na mara nyingi huongeza sheria na mwongozo wa jamii.",
  },
  {
    prompt:
      "Ni sura gani iliyo na aya za mwanzo kabisa zilizoteremshwa kwa Mtume ﷺ kwenye pango la Hira?",
    options: ["Al-Fatihah", "Al-'Alaq (Iqra)", "Al-Baqarah", "Al-Ikhlas"],
    explanation:
      "Uteremsho wa kwanza ulikuwa ni Aya za mwanzo za Sura al-'Alaq (96): 'Iqra' - Soma kwa jina la Mola wako Mlezi aliyeumba.",
  },
  {
    prompt: "Kwa takribani miaka mingapi Qur'ani iliteremshwa?",
    options: ["miaka 3", "miaka 10", "miaka 23", "miaka 40"],
    explanation:
      "Qur'ani iliteremshwa taratibu kwa takriban miaka 23 - 13 Makka na 10 Madina - ikijibu matukio na mahitaji.",
  },
  {
    prompt:
      "Kweli au si kweli: Qur-aan ilianza kuteremshwa katika mwezi wa Ramadhani, kwenye Laylatul-Qadr.",
    options: ["Kweli", "Uongo"],
    explanation:
      "Mwenyezi Mungu anasema Qur-aan iliteremshwa katika Ramadhani (2:185) katika Usiku wa Qiyaamah (97:1). Kuutafuta usiku huo ni fadhila kubwa.",
  },
  {
    prompt: "Ni sura gani inayosomwa katika kila rakaa ya sala ya kila siku?",
    options: ["Al-Ikhlas", "Al-Fatihah", "Al-Kawthar", "An-Nasr"],
    explanation:
      "Surah al-Fatihah - aya saba - inasomwa katika kila rakaa ya sala. 'Hapana sala kwa asiye soma kufunguliwa kwa Kitabu.",
  },
  {
    prompt: "Ni sura gani moja ambayo haianzi na 'Bismillah ir-Rahman ir-Rahim'?",
    options: ["Al-Fatihah", "At-Tawbah", "Al-Ikhlas", "An-Nas"],
    explanation: "Surah at-Tawbah (9) ndiyo surah pekee ambayo haifunguki na Basmala.",
  },
  {
    prompt: "Katika tajweed, utawala wa Madd unatawala nini?",
    options: [
      "Kuunganisha barua mbili pamoja",
      "Kunyoosha (kurefusha) sauti ya vokali",
      "Mwangwi unadunda kwenye herufi fulani",
      "Wapi kuacha na kupumua",
    ],
    explanation:
      "Madd inamaanisha kunyoosha sauti ya vokali kwenye herufi za madd - alif (ا), waw (و), na ya (ي) - kwa idadi fulani ya hesabu.",
  },
  {
    prompt:
      "Qalqalah ni mwangwi wa nuru 'unaoruka' unaotolewa kwa seti gani ya herufi wakati wanabeba sukun?",
    options: ["ي ر م ل و ن", "ق ط ب ج د", "ء ه ع ح غ خ", "ا و ي"],
    explanation:
      "Herufi tano za qalqalah zimekusanywa katika kifungu cha maneno قُطْبُ جَدٍ — ق ط ب ج د — zimepewa kibandiko safi zinapobeba sukun.",
  },
  {
    prompt: "Neno la mara kwa mara la Qur'ani 'Rabb' (رَبّ) linamaanisha:",
    options: ["Rehema", "Bwana, Bwana, Mlinzi", "Kitabu", "Bustani"],
    explanation:
      "'Rabb' maana yake ni Bwana, Mwalimu, na Mlinzi - Yule anayeumba, anayemiliki, anayelea na kutawala. 'Rabbana' maana yake 'Mola wetu'.",
  },
  {
    prompt: "Neno 'Jannah' (جَنَّة) linamaanisha:",
    options: ["Moto", "Bustani ya Peponi", "Maombi", "Kufunga"],
    explanation:
      "'Jannah' maana yake ni Bustani - makazi ya thawabu ya milele, 'bustani zipitazo mito chini yake'.",
  },
  {
    prompt: "Nabii gani aliinua misingi ya Al-Ka'bah huko Makka pamoja na mwanawe Isma'il?",
    options: ["Nuh", "Musa", "Ibrahim", "Yusuf"],
    explanation:
      "Ibrahim (Khalilullah, rafiki wa Mwenyezi Mungu) na Isma’il walijenga Ka’abah, wakiomba ‘Mola wetu Mlezi, tukubalie haya’ (2:127).",
  },
  {
    prompt:
      "Ni nabii gani aliyezungumza moja kwa moja na Mwenyezi Mungu, akamkabili Firauni, na akawaongoza Bani Israil kuvuka bahari iliyogawanyika?",
    options: ["Isa", "Musa", "Adamu", "Yunus"],
    explanation:
      "Musa (Kalimullah) alizungumza na Mwenyezi Mungu, akatumwa kwa Firauni, na kwa amri ya Mwenyezi Mungu bahari iligawanyika hivyo watu wake wakavuka salama.",
  },
  {
    prompt:
      "Je, ni sura gani moja au kifungu kifupi ambacho utakiweka kuelewa na kukariri kinachofuata, in shaa Allah?",
    explanation:
      "Hatua ndogo thabiti hujenga mafungamano ya maisha yote na Kitabu cha Mwenyezi Mungu. Chagua sehemu yako, jifunze maana yake, na urekebishe mara kwa mara.",
  },
];
