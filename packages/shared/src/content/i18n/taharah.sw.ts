// Swahili translation overlay for the Learn Taharah content. Mirrors the order of
// its English source in ../taharah*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { TaharahChecklistItem, TaharahTopic } from "../../types/taharah";
import type { DeepPartial } from "./localize";

export const TAHARAH_TOPICS_SW: DeepPartial<TaharahTopic>[] = [
  {
    title: "Utangulizi wa Tahara",
    summary: "Utakaso ni mlango wa maombi na nusu ya imani ya muumini.",
    body: [
      "Tahara (طهارة) maana yake ni utakaso - kuuweka huru mwili, nguo, na mahali pa kuswalia kutokana na uchafu wa kiibada na kimwili ili Muislamu asimame mbele ya Mwenyezi Mungu katika hali anayoikubali. Ni jambo la kwanza kabisa ambalo mwanafunzi wa ibada anajifunza, kwa sababu bila hiyo hakuna swala inayosahihishwa: Mtume (Swalla Allaahu ´alayhi wa sallam) amesema, 'Ufunguo wa Swala ni utakaso.'",
      "Utakaso katika Uislamu una pande mbili. Nje ni usafi unaoonekana - kuosha, kuondoa uchafu, kuweka safi. Ndani ni unyenyekevu, uangalifu, na utayari wa moyo ambao kuosha kunakusudiwa kuamsha. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) alivifunganisha viwili hivyo pale alipoita utakaso kuwa ni ‘nusu ya imani,’ akiunganisha usafi wa kimwili na utakaso wa roho kutokana na dhambi.",
      "Moduli hii inapitia somo zima kwa mpangilio: maji unayotakasa nayo, wudhu (udhu mdogo), ghusl (uogaji kamili wa kiibada), tayammamu (utakaso mkavu wakati maji hayawezi kutumika), najasah (kuondoa uchafu wa mwili), na kesi maalum na makubaliano. Jifunze mara moja na maombi inakuwa kitu ambacho unaweza kuingia kwa ujasiri badala ya shaka.",
    ],
    quran: [
      {
        excerpt:
          "Enyi mlio amini mnaposimama kuswali osheni nyuso zenu na mikono yenu mpaka kwenye viwiko, mpake vichwa vyenu na osheni miguu yenu mpaka vifundoni.",
      },
      {
        excerpt: "Hakika Mwenyezi Mungu huwapenda wanao tubu na huwapenda wanao jitakasa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ufunguo wa maombi ni utakaso; mwanzo wake ni takbir na mwisho wake ni taslim. (Ali; pia Jami' at-Tirmidhiy 3)",
      },
    ],
    actions: [
      "Chukua utakaso kama matayarisho ya kukutana na Mwenyezi Mungu, na sio mazoea ya kukurupuka.",
      "Jifunze mada moja ya tahara kila siku hadi mtiririko mzima uhisi wa kawaida.",
    ],
    appLinks: [{}],
  },
  {
    title: "Umuhimu wa Usafi",
    summary: "Usafi ni sharti kali kwa Swalah na alama ya Muumini.",
    body: [
      "Utakaso sio chaguo moja kati ya nyingi - ni sharti la uhalali wa maombi. Mwenyezi Mungu haikubali maombi ya mtu ambaye yuko katika hali ya uchafu wa kiibada mpaka atoharishe. Hii ndiyo sababu sala inayoswaliwa bila wudhu halali au ghusl halali lazima irudiwe, hata kama ilikuwa ya dhati.",
      "Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) aliinua utakaso hadi katika sifa ya wazi ya Muumini, akiiita 'nusu ya imani.' Utakaso wa mara kwa mara humtia mtu adabu, humuweka katika hali ya kukaribia kila mara ya utayarifu wa kuabudu, na - Hadith inafundisha - kwa hakika huosha dhambi ndogo kwa maji.",
      "Kwa sababu inahifadhi swalah, twahara pia inamlinda Muumini na dhambi ya kuswali batili kwa kughafilika. Kujifunza vizuri hukumu zake ni kitendo cha kulinda moja ya matendo makubwa katika Uislamu.",
    ],
    hadith: [
      {
        excerpt: "Utakaso ni nusu ya imani. (Abu Malik al-Ash'ariy)",
      },
      {
        excerpt:
          "Mwenyezi Mungu haipokei Sala bila ya utakaso, wala sadaka katika kilichoibiwa. (Ibn Umar)",
      },
    ],
    actions: [
      "Kabla ya kila sala, thibitisha hali yako ya usafi kabla ya kuanza.",
      "Weka orodha rahisi ya kiakili: mwili, mavazi, mahali na udhu.",
    ],
  },
  {
    title: "Aina za Usafi",
    summary: "Hali tatu za kujua: uchafu mdogo, uchafu mkubwa, na najasah ya kimwili.",
    body: [
      "Sheria ya Kiislamu inatofautisha mambo matatu ambayo unaweza kuhitaji kujitakasa kwayo, na kila moja ina dawa yake. Kujua ni hali gani uliyonayo ni ufunguo wa kuchagua njia sahihi.",
      "Uchafu mdogo wa kiibada (hadath asghar) hutokana na matukio ya kawaida kama vile kutumia choo, kupitisha upepo, au usingizi mzito. Huinuliwa kwa wudhu, au kwa tayammamu wakati maji hayawezi kutumika.",
      "Uchafu mkubwa wa kiibada (hadath akbar, pia huitwa janaba) hutokana na urafiki, kutokwa na uchafu wa ngono, na mwisho wa hedhi au kutokwa na damu baada ya kuzaa. Huinuliwa na ghusl, uogaji wa kiibada wa mwili mzima - na tayammam tena ikibadilishwa wakati maji hayapatikani au yanadhuru.",
      "Uchafu wa kimwili (najasah) - kama vile mkojo, kinyesi, au damu inayotiririka - ni jambo tofauti: lazima liondolewe kimwili kutoka kwa mwili, nguo, na mahali pa maombi bila kujali hali yako ya kiibada. Shule nne za Kisunni zinaafikiana juu ya kategoria hizi tatu, zikitofautiana tu katika baadhi ya maelezo ya kile kinachobatilisha usafi au ni kiasi gani kinasamehewa.",
    ],
    quran: [
      {
        excerpt:
          "Na mkiwa katika hali ya janaba, basi jitakaseni. Na mkiwa wagonjwa au mko safarini… na hamkupata maji, basi fanyeni tayammam kwa udongo safi.",
      },
    ],
    actions: [
      "Tambua hali yako kwanza (ndogo, kubwa, au uchafu), kisha utumie njia sahihi.",
      "Wakati huna uhakika kuhusu maelezo, fuata mwalimu mmoja aliyehitimu kutoka shule inayotambulika mara kwa mara.",
    ],
  },
  {
    title: "Maji katika Uislamu",
    summary: "Maji safi ni kisafishaji kikuu - hutumiwa kikamilifu, lakini haipotezi kamwe.",
    body: [
      "Njia ya kawaida ya utakaso ni maji. Mwenyezi Mungu anaielezea mvua kama iliyoteremshwa 'safi' (tahur) - inayoweza kusafisha na kutumika kwa ibada. Maji yoyote safi ya asili - mvua, mto, bahari, chemchemi, kisima au bomba - yanasafisha mradi tu rangi, ladha au harufu yake haijabadilishwa na uchafu unaochanganyika ndani yake.",
      "Mafakihi wanayaainisha maji kwa kina (yalio safi na yanayotakasa, yaliyo safi lakini yasiyo tohara, na najisi), lakini kanuni ya kivitendo kwa maisha ya kila siku ni rahisi: maji yanabakia kuwa yanafaa kwa wudhu na ghusl isipokuwa najasah imeyabadilisha kwa uwazi. Ukiwa na shaka ya kweli na mbadala safi inayopatikana, tumia mbadala.",
      "Uislamu unafundisha ukamilifu bila ubadhirifu. Mtume (Swalla Allaahu ´alayhi wa sallam) aliosha kabisa lakini alitumia maji kidogo sana - kiasi cha tope (vikombe viwili vya mikono) kwa wudhu na sa' (takriban vinne) kwa ghusl kamili. Kupoteza maji kunakatishwa tamaa hata yakiwa mengi, kwa sababu kiasi chenyewe ni sehemu ya adabu ya ibada.",
    ],
    quran: [
      {
        excerpt: "Na tumeteremsha kutoka mbinguni maji safi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mtume ﷺ alikuwa akitawadha kwa tope la maji na ghusl kwa sa'a hadi tope tano. (Anas; pia Sahih Muislamu 325 - sunna ya wastani)",
      },
    ],
    actions: [
      "Tumia maji ya kutosha kuosha vizuri, lakini punguza bomba chini na uepuke kupita kiasi.",
      "Ikiwa chanzo cha maji kinaonekana au harufu iliyobadilishwa na uchafu, tafuta chanzo safi kilicho karibu nawe.",
    ],
    disclaimer:
      "Riwaya iliyonukuliwa sana ya 'usipoteze maji hata kwenye mto unaotiririka' (Ibn Majah 425) imeorodheshwa kuwa dhaifu (da'if) na wanachuoni wengi; Sunnah ya wastani imethibitishwa badala yake na Hadith ya mudd/sa' hapo juu.",
  },
  {
    title: "Wudu ni nini?",
    summary: "Udhu wa kiibada unaoondoa uchafu mdogo kabla ya ibada.",
    body: [
      "Wudhu (وضوء) ni uoshaji wa kiibada wa viungo maalum, kwa mpangilio maalum, ambao huinua uchafu mdogo wa kiibada. Safi zake nne za faradhi zimetajwa moja kwa moja ndani ya Qur'ani (5:6): uso, mikono hadi kwenye viwiko, kupangusa kichwa, na miguu hadi kwenye vifundo vya miguu.",
      "Inatakiwa kabla ya kila swala - isipokuwa ubakie katika hali halali kutokana na swala iliyotangulia - na, kwa mujibu wa wanavyuoni wengi, kabla ya kufanya tawaf kuzunguka Ka'bah na kabla ya kugusa maandishi halisi (mushaf) ya Qur'ani.",
      "Wudhu ni ibada kwa haki yake yenyewe, si utangulizi tu. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) ameonya kuwa Mwenyezi Mungu haikubali Swalah ya yeyote miongoni mwenu anayevunja udhu mpaka arudishe udhu, basi kuichunga ni kuichunga Swalah yenyewe.",
    ],
    hadith: [
      {
        excerpt:
          "Mwenyezi Mungu haikubali maombi ya mmoja wenu anayevunja udhu mpaka atoe udhu. (Abu Hurayrah)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Masharti ya Wudhu Sahihi",
    summary: "Nia, maji safi, na ngozi isiyozuiliwa - mahitaji ya udhu wa sauti.",
    body: [
      "Masharti fulani (shurut) lazima yawepo ili udhu uweze kuhesabiwa. Mtu huyo lazima awe Muislamu mwenye akili timamu, anayekusudia utakaso kwa ajili ya ibada (niyyah). Baadhi ya shule huainisha nia kama nguzo ya kitendo na nyingine kama sharti, lakini zote zinakubali kwamba inahitajika kwa ajili ya malipo na, kwa wengi, kwa uhalali.",
      "Maji yanayotumiwa lazima yawe safi na yenye utakaso. Muhimu sana, lazima ifike kwenye ngozi - kwa hivyo kitu chochote kinachotengeneza kizuizi cha kuzuia maji juu ya kiungo (rangi nene, rangi ya kucha, nta, gundi) lazima kiondolewe kwanza, la sivyo kitu kilichooshwa chini yake si halali. Uchafu wa kawaida au stain ya hina ambayo haizuii maji sio tatizo.",
      "Shule za Shafi'i na Hanbali pia zinataka kuosha kufanyike kwa utaratibu wa Qur'ani na bila ya usumbufu mrefu (muwalat) unaoruhusu viungo vyake kukauka. Nafasi za Hanafi na Maliki juu ya mfuatano mkali na mwendelezo ni laini zaidi katika baadhi ya hali. Fuata mbinu ya shule moja kwa uthabiti.",
    ],
    quran: [
      {
        excerpt:
          "Osheni nyuso zenu na mikono yenu mpaka kwenye viwiko, mpake vichwa vyenu, na osheni miguu yenu mpaka vifundoni.",
      },
    ],
    actions: [
      "Ondoa rangi ya kucha, pete zinazonasa maji, na chochote kinachoziba ngozi kabla ya wudhu.",
      "Toa udhu kwa utulivu katika mtiririko mmoja ili kisipoteze kiungo au kiachwe kikauke.",
    ],
  },
  {
    title: "Matendo ya Wajibu ya Wudhu",
    summary: "Nguzo za Qur-aan (faraid) ambazo bila yake wudhu ni batili.",
    body: [
      "Matendo ya wajibu ya wudhu (faraid yake) ni sehemu ambazo Mwenyezi Mungu amezitaja katika Aya: kuosha uso wote; kuosha mikono yote miwili hadi na kujumuisha viwiko; kuifuta kichwa; na kuosha miguu yote miwili hadi na kujumuisha vifundo vya miguu. Kosa lolote kati ya haya na udhu haujakamilika.",
      "Kwa haya, shule zinaongeza wajibu zaidi kutoka kwa Sunnah na hoja za kifiqhi. Nia ni wajibu katika shule nyingi (Hanafi wanaiainisha kuwa ni sunna iliyosisitizwa sana kwa ajili ya kuondoa uchafu mdogo). Agizo (tartib) na kuendelea (muwalat) ni wajibu kwa Shafii na Hanbali. Akina Maliki huongeza kupaka viungo (dalk) kama wajibu.",
      "Kila kitu zaidi ya haya - suuza kinywa na pua, kuosha mikono kwanza, kuosha mara tatu - inapendekezwa (sunnah) badala ya wajibu. Kujua tofauti kunamaanisha kuwa unaweza kujua wakati wudhu sio kamili dhidi ya batili.",
    ],
    quran: [
      {
        excerpt:
          "Osheni nyuso zenu na mikono yenu mpaka kwenye viwiko, mpake vichwa vyenu, na osheni miguu yenu mpaka vifundoni.",
      },
    ],
    disclaimer:
      "Orodha kamili ya faraid (k.m. kama nia, utaratibu, na kusugua ni wajibu) hutofautiana kati ya shule nne. Jifunze na utumie shule moja inayotegemewa mara kwa mara.",
  },
  {
    title: "Sunnah Matendo ya Wudhu",
    summary: "Vitendo vilivyopendekezwa ambavyo vinakamilisha na kuzidisha malipo ya wudhu.",
    body: [
      "Karibu na msingi wa faradhi, Mtume ﷺ alifanya vitendo vingi vilivyopendekezwa (sunan) ambavyo vinakamilisha na kupamba wudhu. Kuacha mtu hakubatilishi udhu, bali kuwajumuisha kunapata malipo ya ziada na kufuata mfano wake kikamilifu zaidi.",
      "Matendo ya Sunnah yaliyothibitishwa ni pamoja na: kusema 'Bismillah' mwanzoni; kuosha mikono mara tatu kabla ya kuanza; kusuuza kinywa (madmadah) na pua (istinshaq); kukimbia vidole vya mvua kupitia ndevu nene na kati ya vidole na vidole (takhlil); kuanza kila jozi ya viungo na haki; na kurudia kila safisha hadi mara tatu.",
      "Sunnah mbili zinastahiki kutajwa makhsusi: kutumia miswak (siwak) kabla - ambayo Mtume (Swalla Allaahu ´alayhi wa sallam) alikaribia kuwajibisha - na kusoma ushahidi wa imani baada ya kumaliza, ambayo hufungua milango minane ya Pepo kwa mwenye kuisema.",
    ],
    hadith: [
      {
        excerpt:
          "Mwenye kutawadha vyema, kisha akasema: “Nashuhudia ya kwamba hapana mungu ila Mwenyezi Mungu… na kwamba Muhammad ni mja wake na Mtume Wake,” hufunguliwa milango minane ya Pepo. (Umar bin al-Khattab)",
      },
    ],
    actions: [
      "Jizoeze mlolongo kamili wa sunnah hadi iwe utaratibu wako wa kawaida.",
      "Soma shahada ya baada ya wudhu kila wakati.",
    ],
    appLinks: [{}],
  },
  {
    title: "Wudu wa Hatua kwa Hatua",
    summary: "Mfuatano kamili wa kinabii kuanzia nia hadi dua ya kufunga.",
    body: [
      "Mtume (Swalla Allaahu ´alayhi wa sallam) alifundisha udhu kama mlolongo unaotiririka ambao unasuka faradhi pamoja na matendo ya sunna. Hii ndiyo njia aliyowadhihirishia Uthman bin Affan kwa watu baada ya kusema kwamba amemwona Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam akitiwa udhu hivyo hivyo) na kwamba mwenye kufanya vivyo hivyo na akaswali rakaa mbili kwa ukamilifu amesamehewa madhambi yake yaliyopita.",
      "Fanya kila hatua bila haraka, hakikisha maji yanafikia kila eneo linalohitajika. Viungo vilivyoosha (uso, mikono, miguu) huoshwa; kichwa kinafutwa tu.",
    ],
    steps: [
      {
        title: "Nia utakaso na useme Bismillah",
        body: "Weka nia ya wudhu moyoni mwako na anza kwa jina la Mwenyezi Mungu.",
        tip: "Kusudi ni la ndani - hakuna fomula ya mazungumzo inahitajika.",
      },
      {
        title: "Osha mikono yote mara tatu",
        body: "Osha kwa mikono, kupitisha maji kati ya vidole.",
      },
      {
        title: "Suuza kinywa mara tatu",
        body: "Chukua maji mdomoni, uzungushe na uifute.",
      },
      {
        title: "Suuza pua mara tatu",
        body: "Chora maji kwa upole kwenye pua ya pua na uipige nje.",
      },
      {
        title: "Osha uso mara tatu (fard)",
        body: "Kutoka kwa mstari wa nywele hadi chini ya kidevu na kutoka sikio hadi sikio.",
      },
      {
        title: "Osha mkono wa kulia, kisha wa kushoto (fard)",
        body: "Kila moja kutoka kwa vidole hadi na kujumuisha kiwiko, hadi mara tatu.",
      },
      {
        title: "Futa kichwa mara moja (fard)",
        body: "Kwa mikono ya mvua, futa kutoka mbele hadi nyuma na kurudi, kisha uifuta masikio na unyevu sawa.",
      },
      {
        title: "Osha mguu wa kulia, kisha wa kushoto (fard)",
        body: "Kila moja kwa pamoja na kifundo cha mguu, kupitisha vidole kati ya vidole.",
        tip: "Jihadharini na visigino na vifundoni - matangazo ya kawaida yaliyokosa.",
      },
      {
        title: "Soma dua ya kufunga",
        body: "Sema ushuhuda wa imani ili ufungue milango ya Pepo.",
        tip: "Sunnah fupi lakini yenye thawabu nyingi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "'Uthman aliosha kila kiungo mara tatu kama alivyomuona Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) kisha akasema: Mwenye kutawadha hivi na akaswali rakaa mbili kwa umakini kamili, atasamehewa madhambi yake yaliyopita. (Humran kutoka kwa Uthman)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dua Zinazohusiana na Wudhu",
    summary: "Dua zilizoripotiwa kwa usahihi kabla na baada ya wudhu.",
    body: [
      "Mawaidha yenye nguvu yaliyosimuliwa kuhusu wudhu ni mawili: Kusema 'Bismillah' mwanzoni, na ushahidi wa imani baada ya kuimaliza. Kwa shahada ya kumalizia, nyongeza ya kweli inamuomba Mwenyezi Mungu, 'Nijaalie niwe miongoni mwa wanaotubu na unijaalie niwe miongoni mwa wanaojitakasa.'",
      "Ni muhimu kujua kwamba 'dua' ya kina kwa kila kiungo (dua maalum wakati wa kuosha mikono, uso, mikono, na kadhalika) inayozunguka katika baadhi ya vijitabu haijathibitishwa kwa usahihi wa sauti kutoka kwa Mtume ﷺ. Wanavyuoni wanashauri kutozihusisha kwake kuwa ni sunna, na hali hakuna ubaya katika kumdhukuru Mwenyezi Mungu wakati wa wudhu.",
      "Moyo wa jambo ni uwepo: osha kwa ufahamu kwamba dhambi za kila kiungo zinaanguka, na malizia kwa shahada inayounganisha tena kitendo na makusudio yake - imani kwa Mwenyezi Mungu pekee.",
    ],
    hadith: [
      {
        excerpt:
          "Mwenye kutawadha vyema kisha akasoma ushahidi wa imani, hufunguliwa milango minane ya Pepo ili aingie kwa apendavyo. (Umar)",
      },
    ],
    actions: [
      "Kariri shahada ya baada ya wudhu ikiwa bado hujaipata.",
      "Epuka kukariri fomula ambazo hazijathibitishwa kwa kila kiungo kana kwamba ni sunna iliyothibitishwa.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nini Huvunja Wudhu?",
    summary: "Vibatilishi vya wudhu - na kanuni ya yakini inapokuwa na shaka.",
    body: [
      "Kwa makubaliano ya kielimu, udhu huvunjwa na kitu chochote kinachotoka kwenye njia mbili za siri - mkojo, kinyesi, upepo, au uchafu mwingine - na vile vile kwa usingizi mzito unaoondoa ufahamu wa mtu, na kwa kupoteza fahamu kwa kuzirai au ulevi.",
      "Masuala mengine yanakabiliwa na tofauti za heshima kati ya shule: kugusa sehemu za siri moja kwa moja, na kugusana ngozi kwa ngozi na mtu asiye Mahram wa jinsia tofauti, ni batili katika baadhi ya shule lakini si nyingine, kwa kuzingatia usomaji tofauti wa maandiko sawa.",
      "Kanuni muhimu ya uongozi inakulinda kutokana na wasiwasi wa mara kwa mara (waswas): uhakika hauondolewi na shaka. Ikiwa ulikuwa na wudhu na huna uhakika kama umeuvunja, bado unachukuliwa kuwa una wudhu mpaka uhakikishe kuwa kibatilishi kimetokea. Mtume (Swalla Allaahu ´alayhi wa sallam) alimwambia mtu aliyekuwa akisumbuliwa na hisia hii kwamba asiiache sala yake mpaka asikie sauti au apate harufu.",
    ],
    hadith: [
      {
        excerpt:
          "Asitoke (sala yake) mpaka asikie sauti au apate harufu. (Abbad ibn Tamim, from his uncle)",
      },
    ],
    disclaimer:
      "Ama kugusa jinsia tofauti au sehemu za siri za mtu kukatika udhu kunatofautiana kati ya shule. Fuata mwalimu wa mtaani aliyehitimu na mbinu ya shule moja.",
  },
  {
    title: "Makosa ya kawaida ya Wudu",
    summary: "Makosa ya mara kwa mara ambayo hupunguza malipo - au kubatilisha wudhu kabisa.",
    body: [
      "Makosa mengi ya wudhu yanatokana na haraka. Kukimbia ili maji yasifike kiungo kizima - sehemu kikavu kwenye kisigino, kifundo cha mguu, kiwiko, au kati ya vidole na vidole vya miguu - kunaweza kuuacha udhu ukiwa batili, kwa sababu uoshaji wa Qur'ani haukukamilika hapo.",
      "Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) siku moja aliwaona watu ambao visigino vyao vimekauka kwa vile maji hayajawafikia, na akaonya kwa ukali: 'Ole wao visigino vya Moto!' Visigino, vifundo vya miguu, na pembe za uso ni matangazo ya kawaida ya kupuuzwa.",
      "Hitilafu iliyo kinyume chake ni kupindukia: kuosha kwa mbali zaidi ya mara tatu, au kutumia maji ovyo, jambo ambalo linapingana na sunna ya kiasi. Wengine wanaangukia kwenye waswas (mashaka ya kupindukia), kurudia wudhu tena na tena - hili nalo ni kosa, kwani hakika haibatiliwi na tuhuma.",
    ],
    hadith: [
      {
        excerpt:
          "Ole wao walio visigino na Moto! - alisema alipoona visigino vikiwa vimekauka kwenye wudhu. (Abu Hurayrah)",
      },
    ],
    actions: [
      "Punguza polepole na uthibitishe kwa uangalifu ufunikaji kamili wa kila kiungo kilichooshwa, haswa visigino na viwiko.",
      "Tumia maji ya wastani; usiruhusu shaka kupita kiasi ikusukume katika kurudia-rudia bila sababu.",
    ],
  },
  {
    title: "Fadhila za Wudhu",
    summary:
      "Wudhu inafuta madhambi, inapandisha daraja, na itawafanya waumini wang'ae Siku ya Kiyama.",
    body: [
      "Wudhu ni kuosha dhambi mara kwa mara. Mtume (Swalla Allaahu ´alayhi wa sallam) amefundisha kwamba Muumini anapoosha kila kiungo, matendo maovu yanayofanywa na kiungo hicho huanguka na maji - kwa macho, mikono, miguu - mpaka mtu huyo atokee ametakasika na dhambi. Sala inayotanguliwa na wudhu hivyo hutanguliwa na msamaha mpya.",
      "Pia ni heshima ya kutofautisha katika maisha yajayo. Siku ya Qiyaamah Mtume ﷺ atawatambua wafuasi wake kwa mng'aro wa nyuso zao, mikono na miguu kutokana na athari za wudhu - nuru ya kipekee kwa umma huu, uitwao al-ghurr al-muhajjalun.",
      "Kwa sababu ya fadhila hizi, kukaa katika wudhu ni tabia iliyopendekezwa: kuufanya upya kwa kila sala, na kulala juu ya wudhu, ni miongoni mwa taratibu za ulinzi za Muumini.",
    ],
    hadith: [
      {
        excerpt:
          "Ummah wangu utaitwa Siku ya Kiyama kwa nyuso, mikono na miguu yenye kung'aa kutokana na athari za wudhu. (Abu Hurayrah)",
      },
    ],
    actions: [
      "Rudisha wudhu kwa kila dirisha la maombi pale unapoweza.",
      "Fanya kulala juu ya wudhu kuwa ni sunna ya usiku.",
    ],
    appLinks: [{}],
  },
  {
    title: "Ghusl ni nini?",
    summary: "Uogaji wa kitamaduni wa mwili mzima ambao huinua uchafu mkubwa (janabah).",
    body: [
      "Ghusl (غسل) ni ibada ya kuosha mwili mzima, kwa nia ya kuondoa uchafu mkubwa wa kiibada (janabah). Ambapo wudhu hushughulikia uchafu mdogo, ghusl hushughulikia hali kubwa zaidi inayofuata urafiki, kutokwa na uchafu wa ngono, na mwisho wa hedhi au kutokwa na damu baada ya kuzaa.",
      "Kiini chake ni kwamba maji hufikia kila sehemu ya mwili wa nje - hakuna doa kavu inaweza kubaki, ikiwa ni pamoja na mizizi ya nywele, ngozi ya ngozi, nyuma ya masikio, kitovu, na kati ya vidole. Kusafisha mdomo na pua kunajumuishwa katika ghusl na wanachuoni wengi.",
      "Ghusli moja inayofanywa kwa nia ya kunyanyua janaba pia huondoa uchafu mdogo, hivyo mtu aliyemaliza ghusl anaweza kuswali bila ya wudhu tofauti (ingawa kutia wudhu ndani ya ghusl ni sunna).",
    ],
    quran: [
      {
        excerpt: "Na mkiwa katika hali ya janaba, basi jitakaseni.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Wakati Ghusl Inahitajika",
    summary: "Hali ambazo hufanya umwagaji kamili wa ibada kuwa wa lazima au uliopendekezwa.",
    body: [
      "Ghusl inakuwa ya lazima (fard) katika matukio kadhaa yaliyofafanuliwa: utoaji wa maji ya ngono kwa hamu (iwe macho au kwa njia ya ndoto ya mvua); kujamiiana yenyewe, hata bila kumwaga manii - Mtume ﷺ amesema kwamba mara tu viwili hivyo vinapounganishwa, ghusl inatakiwa; na mwisho wa hedhi (hayd) au kutokwa na damu baada ya kuzaa (nifas). Kifo pia kinawajibisha ghusl ya marehemu kwa walio hai.",
      "Ghusl zingine zinapendekezwa (mustahabb) badala ya faradhi: ghusl ya Ijumaa kabla ya Jumu'ah, ambayo inasisitizwa sana hadi Mtume ﷺ akaiita 'wajibu kwa kila aliyebaleghe'; ghusl kwa Eid mbili; na ghusl ya ihram kabla ya Hija au Umrah.",
      "Mwislamu mpya anaagizwa kufanya ghusl anapoingia katika Uislamu - iliyolazimishwa na baadhi ya wanachuoni na inapendekezwa kwa nguvu na wengine.",
    ],
    hadith: [
      {
        excerpt:
          "Mwanaume anapokaa baina ya viungo vinne vya mke wake na kumuingilia, ghusl inakuwa ni wajibu. (Abu Hurayrah; pia Sahih Muislamu 348)",
      },
      {
        excerpt:
          "Ghusl siku ya Ijumaa ni wajibu kwa kila aliyefikia umri wa baleghe. (Abu Said al-Khudri; pia Sahih Muislamu 846)",
      },
    ],
    disclaimer:
      "Iwapo siku ya Ijumaa na ghusli za kubadilisha ni wajibu au zimependekezwa sana inatofautiana kwa shule na mazingira.",
    appLinks: [{}],
  },
  {
    title: "Ghusl ya Hatua kwa Hatua",
    summary: "Njia ya unabii - wajibu wa chini zaidi pamoja na sunnah kamili.",
    body: [
      "'Aishah alielezea ghusl ya Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) kwa kina, na kutoka humo wanavyuoni wanapata ghusl ya chini kabisa halali na njia kamili ya sunnah. Kima cha chini ni: nia pamoja na maji kufikia mwili mzima (kwa suuza kinywa na pua kwa wengi). Njia kamili hapa chini ni jinsi Mtume ﷺ mwenyewe alivyofanya.",
      "Ifanye bila haraka, ukisugua maji kwenye ngozi ili hakuna kitakachoachwa kikavu.",
    ],
    steps: [
      {
        title: "Tengeneza nia",
        body: "Nia moyoni mwako kuinua uchafu mkubwa wa kiibada (janabah).",
      },
      {
        title: "Sema Bismillah na osha mikono",
        body: "Anza kwa jina la Mwenyezi Mungu na osha mikono yote miwili.",
      },
      {
        title: "Osha eneo la kibinafsi",
        body: "Ondoa uchafu wowote kutoka kwa sehemu za siri kwa mkono wa kushoto.",
      },
      {
        title: "Toa wudhu kamili",
        body: "Timizeni wudhu kama kwa swala. Unaweza kuchelewesha kuosha miguu hadi mwisho ikiwa umesimama kwenye maji yaliyokusanywa.",
      },
      {
        title: "Mimina maji juu ya kichwa mara tatu",
        body: "Kazi ya maji kwa kichwa na mizizi ya nywele.",
      },
      {
        title: "Osha upande wa kulia, kisha kushoto",
        body: "Mimina na kusugua maji juu ya mwili mzima, kuanzia kulia.",
      },
      {
        title: "Hakikisha chanjo kamili",
        body: "Usiache sehemu kavu - kwapa, kitovu, nyuma ya magoti na masikio, na kati ya vidole.",
        tip: "Wanawake hawahitaji kutendua nywele zilizosokotwa, mradi maji yafike kichwani.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mtume (Swalla Allaahu ´alayhi wa sallam) alipooga kutoka janaba, akaosha mikono yake, akatawadha, akapitisha vidole vyake kwenye nywele zake, kisha akamimina maji juu ya kichwa chake mara tatu na juu ya mwili wake wote. (Aisha)",
      },
    ],
  },
  {
    title: "Makosa ya Kawaida ya Ghusl",
    summary: "Epuka maeneo kavu, nia ya kukosa, na kukosea kuoga kama ghusl.",
    body: [
      "Kosa la msingi zaidi ni kutibu oga ya kawaida kama ghusl. Ghusl inahitaji nia ya kuondoa uchafu mkubwa; bila hiyo, hata muda gani unaosha, hali ya ibada haijainuliwa. Tengeneza nia kabla ya kuanza.",
      "Hitilafu ya pili ya kawaida ni kuacha matangazo kavu. Wajibu ni maji kugusa mwili wote wa nje, hivyo kupuuza mizizi ya kichwa, masikio, kitovu, udogo wa nyuma, au kati ya vidole huacha ghusl pungufu. Sugua maji juu ya maeneo haya ili kuwa na uhakika.",
      "Kwa nywele: mwanamke mwenye kusuka nywele hatakiwi kung'oa suka, maadamu maji yanafika kwenye mizizi ya ngozi ya kichwa - Mtume ﷺ alimwambia Umm Salamah kwamba inatosha kumwaga konzi tatu juu ya kichwa. Nywele za mwanamume, zikiwa zimelegea, zinapaswa kufanyiwa kazi ili maji yafike kwenye mizizi.",
    ],
    hadith: [
      {
        excerpt:
          "Inatosha kumwaga mikono mitatu ya maji juu ya kichwa chako, kisha uimimine maji juu yako na utakaswa - huna haja ya kufuta braids yako. (Umm Salamah)",
      },
    ],
    actions: [
      "Sema nia kabla ya kumwaga mara ya kwanza, kwa hivyo kuosha kunahesabika kama ghusl.",
      "Mimina maji kwenye sehemu ambazo hazipatikani kwa urahisi; inapokosekana, osha upya sehemu badala ya kumaliza kwa mashaka.",
    ],
  },
  {
    title: "Tayammum ni nini?",
    summary: "Utakaso kavu na ardhi safi wakati maji hayawezi kutumika.",
    body: [
      "Tayammum (تيمم) ni kibadala cha rehema cha wudhu au ghusl wakati maji hayapatikani kikweli au hayawezi kutumika. Badala ya kuosha, mtu hupiga udongo safi kwa viganja na kuifuta uso na mikono - na hii inachukua kikamilifu nafasi ya utakaso wa maji, kuruhusu maombi halali.",
      "Tayammum ni zawadi kwa Ummah huu hasa: Mtume (Swalla Allaahu ´alayhi wa sallam) amesema, 'Ardhi imefanywa kwa ajili yangu kuwa ni pahala pa kuswalia na njia ya kujitakasa,' akiiorodhesha miongoni mwa upendeleo maalum aliopewa na sio Mitume wa mwanzo. Inajumuisha kanuni kuu ya dini - wajibu unabaki, lakini ugumu unaondolewa.",
      "Ni kipimo cha muda: mara tu maji yanapopatikana na kutumika, utakaso wa kawaida na maji huanza tena. Mtu anaweza kuhitaji kufanya upya tayammamu kwa kila sala kulingana na baadhi ya shule.",
    ],
    quran: [
      {
        excerpt:
          "Na msipate maji, basi fanyeni tayammam kwa udongo safi na mpake nyuso zenu na mikono yenu kwa hayo.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ardhi imefanywa kwa ajili yangu kuwa mahali pa sala na njia ya utakaso. (Jabir ni miongoni mwa mambo matano aliyopewa Mtume ﷺ)",
      },
    ],
  },
  {
    title: "Wakati Tayammum Inaruhusiwa",
    summary:
      "Inaruhusiwa wakati maji hayapo, yanadhuru, au yanahitajika kwa haraka kwa ajili ya kuishi.",
    body: [
      "Tayammum inaruhusiwa katika hali tatu pana. Kwanza, wakati hakuna maji yanaweza kupatikana baada ya utafutaji unaofaa - msafiri katika jangwa, au mtu yeyote bila ufikiaji. Pili, wakati wa kutumia maji inaweza kusababisha madhara: kwa wagonjwa ambao majeraha au ugonjwa itakuwa mbaya zaidi, au katika baridi kali na hakuna njia ya joto maji na hatari ya kweli ya madhara.",
      "Tatu, wakati maji kidogo yanayopatikana yanapohitajika kwa hitaji kubwa zaidi - kama vile kunywa, kuhifadhi maisha, iwe ya mtu au ya mtu mwingine au ya mnyama. Katika kila hali shari ́ah inapima kuhifadhi uhai na afya kuliko njia inayopendekezwa ya utakaso.",
      "Mafakihi wanatofautiana juu ya vizingiti bora zaidi - ni umbali gani mtu lazima atafute maji, ni kiasi gani cha hofu ya madhara inatosha - lakini wanakubaliana juu ya rehema ya msingi: ibada haiangushwi, inafanywa rahisi tu.",
    ],
    hadith: [
      {
        excerpt:
          "Imepokewa katika sura za tayammam: ruhusa ya kutakasa kwa udongo safi pasipo kuwepo maji yanayoweza kutumika.",
      },
    ],
    actions: [
      "Tafuta maji ipasavyo kabla ya kutumia tayammam.",
      "Ikiwa daktari anashauri kuweka jeraha au ugonjwa kavu, fanya hivyo na ufanye tayammam.",
    ],
  },
  {
    title: "Tayammum ya hatua kwa hatua",
    summary: "Mlolongo mfupi, rahisi wa utakaso halali wa kavu.",
    body: [
      "Tayammum ni fupi kimakusudi - onyesho la madhumuni yake kama kujiruhusu katika shida. Inafanywa kwa uso safi, wa asili wa udongo: udongo, mchanga, jiwe, au vumbi. Asili yake, kutokana na dhihirisho la Mtume ﷺ mwenyewe kwa Ammar ibn Yasir, ni pigo moja la viganja kwenye ardhi safi, kisha kupangusa uso na mikono.",
      "Huu ni wepesi kuliko wudhu kwa muundo, kwa hivyo usiuongezee matatizo.",
    ],
    steps: [
      {
        title: "Tengeneza nia",
        body: "Nia ya kuondoa uchafu wa kiibada ili kuabudu.",
      },
      {
        title: "Sema Bismillah",
        body: "Anza kwa jina la Mwenyezi Mungu.",
      },
      {
        title: "Piga ardhi safi mara moja kwa mitende yote miwili",
        body: "Weka mitende kwa urahisi kwenye uso safi, wa vumbi, wa asili.",
      },
      {
        title: "Futa uso",
        body: "Futa uso wote mara moja kwa mikono miwili.",
      },
      {
        title: "Futa mikono",
        body: "Futa nyuma ya mikono - kwa mikono na wasomi wengi.",
        tip: "Fuata mbinu ya shule moja (mikono dhidi ya mikono ya mbele) mara kwa mara.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mtume (Swalla Allaahu ´alayhi wa sallam) aliipiga ardhi kwa viganja vyake, kisha akapangusa uso wake na mikono yake - akimfundisha Ammar kwamba hayo yanatosha. (Ammar bin Yasir)",
      },
    ],
  },
  {
    title: "Nini Kinachovunja Tayammum?",
    summary: "Imebatilishwa na vivunja udhu vya kawaida - na kwa kurudisha maji yanayotumika.",
    body: [
      "Tayammum inayofanywa badala ya wudhu inabatilika kwa kila kinachovunja udhu: kujinusuru, kupita upepo, usingizi mzito, na kadhalika. Tayammum badala ya ghusl pia hubatilika na kitu chochote kinachosababisha uchafu mkubwa.",
      "Kipekee, tayammamu pia inamalizwa na urejesho wa sababu yake kuondolewa - yaani, kupata maji yanayoweza kutumika. Mara tu maji yanapopatikana na yanaweza kutumika, makubaliano huisha na mtu anarudi kwenye wudhu au ghusl.",
      "Jambo la kivitendo la rehema: ikiwa ulisali kwa tayammam kwa uhalali na ukapata maji tu baadaye, walio wengi wanashikilia kwamba sala iliyokamilishwa haihitaji kurudiwa - ilifanywa kwa usahihi chini ya hukumu iliyotumika wakati huo. Lakini ikiwa maji yanaonekana kabla ya sala, lazima utumie.",
    ],
    actions: [
      "Angalia tena maji yanayopatikana mwanzoni mwa kila wakati wa maombi.",
      "Mara tu maji yanaweza kutumika, kurudi kwenye utakaso na maji bila kuchelewa.",
    ],
    disclaimer:
      "Baadhi ya maelezo - kama vile kama sala inarudiwa baada ya maji kupatikana ndani ya muda wake - hutofautiana kulingana na shule.",
  },
  {
    title: "Uchafu (Najasah)",
    summary:
      "Uchafu wa kimwili ambao lazima uondolewe kutoka kwa mwili, mavazi, na mahali pa sala.",
    body: [
      "Najasah (نجاسة) ni uchafu wa kiibada unaoonekana, tofauti na hali za kitamaduni za hadath. Mifano ya wazi iliyokubaliwa ni pamoja na mkojo na kinyesi cha binadamu, damu inayotiririka, nyama na uchafu wa nguruwe, na mate ya mbwa (ambayo yanahitaji kuoshwa maalum). Kutoa najasah mwilini, nguo iliyovaliwa, na sehemu ya kuswali ni sharti la Swalah halali.",
      "Kuondolewa ni kwa maji ambapo uchafu unaonekana, kuosha mpaka dutu na athari yake imekwisha. Uislamu pia unavichukulia kwa uzito vyanzo vya najasah: Mtume ﷺ alionya kwamba nyingi ya adhabu ya kaburi inatokana na uzembe na mkojo - kupaka na kutosafisha ipasavyo.",
      "Shule hutofautiana juu ya kuainisha baadhi ya vitu (kwa mfano, ikiwa kiasi kidogo cha vimiminika fulani hakiruhusiwi) na ni kiasi gani cha athari kinachoruhusiwa. Kanuni inayoweza kutumika kwa maisha ya kila siku: safisha kabisa, na usitengeneze shaka juu ya usafi ambapo hakuna ushahidi wa uchafu.",
    ],
    hadith: [
      {
        excerpt:
          "Mtume (Swalla Allaahu ´alayhi wa sallam) akapita makaburi mawili na akasema wakaaji wake wanaadhibiwa - moja kwa kueneza kashfa, na jingine kwa sababu hakujikinga na mkojo wake. (Ibn Abbas; pia Sahih Muislamu 292)",
      },
    ],
  },
  {
    title: "Kusafisha Nguo kutoka kwa Uchafu",
    summary: "Jinsi ya kuosha nguo ili kuomba ndani yake ni halali.",
    body: [
      "Wakati najasah inapoingia kwenye nguo, osha eneo lililoathiriwa na maji hadi dutu yenyewe na athari yake inayoonekana kuondolewa. Mtume (Swalla Allaahu ´alayhi wa sallam) amemuusia mwanamke ambaye nguo yake imepakwa damu ya hedhi aipakue, kisha apake kwa maji, kisha ayaoshe, na aswali humo.",
      "Ikiwa, baada ya jitihada za dhati na za kina, doa la rangi iliyofifia au harufu kidogo inabakia ambayo haitatoka, wengi wa wasomi husamehe kile ambacho ni vigumu kweli kuondoa - wajibu ni kuondoa dutu, si kuhakikisha rangi isiyo na doa.",
      "Baadhi ya matukio yana maelezo yao wenyewe yanayojulikana, kama vile mkojo wa mvulana anayenyonyeshwa (kunyunyiziwa badala ya kuosha kabisa, kwa makubaliano yaliyoripotiwa) - kwa hivyo jifunze kanuni za vitendo za shule yako kwa hali ambazo unakabiliana nazo.",
    ],
    hadith: [
      {
        excerpt:
          "Kuhusu damu ya hedhi kwenye nguo: ipasue, kisha ipake kwa maji, kisha ioshe, na uswali ndani yake. (Asma binti Abi Bakr)",
      },
    ],
    actions: [
      "Weka angalau vazi moja safi kwa ajili ya maombi.",
      "Ikiwa uchafu unagusa nguo zako mbali na nyumbani, suuza unachoweza na ubadilishe inapowezekana.",
    ],
  },
  {
    title: "Kusafisha Mwili",
    summary: "Kuondoa uchafu kutoka kwa mwili, na adabu ya istinja na usafi.",
    body: [
      "Uchafu mwilini lazima uoshwe kabla ya Swalah, ndani ya uwezo wa mtu. Kesi ya mara kwa mara ni kujisafisha baada ya kutumia choo - istinja - ambayo inafanywa kwa maji, au kwa nyenzo za kavu zinazofaa, mpaka eneo liwe safi. Mtume (Swalla Allaahu ´alayhi wa sallam) alifundisha kusafisha kwa uangalifu baada ya kujisaidia na akakataza kutumia mkono wa kulia kwa ajili yake.",
      "Zaidi ya kuondoa uchafu, Uislamu unahimiza msingi wa usafi wa asili (fitrah) ambao huweka mwili safi na tayari kwa ibada: kupunguza kucha, kuondoa kwapa na nywele za pubic, na kadhalika, mara kwa mara.",
      "Vitendo hivi sio tu uzuri wa kitamaduni - ni sehemu ya utu na usafi ambao muumini hujiwasilisha mbele ya Mwenyezi Mungu katika sala.",
    ],
    hadith: [
      {
        excerpt: "Mtume ﷺ alikuwa akijisafisha kwa maji baada ya kujisaidia. (Anas)",
      },
    ],
    actions: [
      "Daima kamilisha istinja kabla ya wudhu baada ya kutumia choo.",
      "Kubeba tishu na, ambapo unaweza, njia ya maji wakati wa kusafiri.",
    ],
  },
  {
    title: "Kusafisha Maeneo ya Maombi",
    summary: "Mahali pa maombi lazima lisiwe na uchafu unaojulikana - bila shaka isiyo na msingi.",
    body: [
      "Mahali pa kuswalia lazima pasiwe na najasah inayojulikana. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) alifundisha hivi: Bedui mmoja alipokojoa kwenye pembe ya msikiti, aliwazuia Maswahaba wasimkemee kwa ukali, basi amalize, kisha akaamrisha ndoo ya maji kumwagiwa mahali hapo - akifundisha usafi na upole.",
      "Kanuni inayoongoza ni uhakika. Ardhi ilifanywa kwa ujumla kuwa mahali pa kuswalia, hivyo uso unachukuliwa kuwa safi isipokuwa kama una ushahidi wa kweli wa uchafu. Ikiwa unajua uchafu upo, uondoe au uhamishe mahali safi; ukifikiria tu inaweza kuwa pale, puuza kunong'ona na uendelee.",
      "Mizani hii hulinda ibada kutoka kwa mambo mawili ya kupindukia: kuswali ovyoovyo kwenye ardhi ambayo ni wazi iliyochafuliwa, na kulemazwa na tuhuma zisizo na msingi juu ya kila uso.",
    ],
    hadith: [
      {
        excerpt:
          "Bedui mmoja alipokojoa msikitini, Mtume ﷺ aliamrisha ndoo ya maji imwagiwe juu yake. (Abu Hurayrah)",
      },
    ],
    actions: [
      "Tazama mkeka wako na sakafu kabla ya swalah.",
      "Bila ushahidi wa kweli wa uchafu, ondoa shaka zisizo na msingi na uombe.",
    ],
  },
  {
    title: "Hayd na Usafi",
    summary: "Hedhi na kutokwa na damu baada ya kuzaa hubeba maamuzi yao ya utakaso.",
    body: [
      "Wakati wa hedhi (hayd) na damu ya baada ya kuzaa (nifas), mwanamke haswali, na - kwa rehema ya Dini - Swalah zilizokosekana katika wakati huo hazitolewi baadaye. Hili linatatuliwa: Aishah alipoulizwa kwa nini mwenye hedhi afungishe saumu zake na si swalah zake, alithibitisha kuwa hivyo ndivyo walivyoamrishwa.",
      "Saumu ni tofauti: Saumu zilizokoswa katika Ramadhani kwa sababu ya hedhi hufanywa baadaye, wakati sala huinuliwa tu. Damu inapoisha na dalili ya utakaso inaonekana, mwanamke hufanya ghusl na kuanza tena sala na saumu.",
      "Muda kamili wa chini na upeo wa hayd na nifas, na jinsi ya kusoma alama za mpaka za usafi, ni mambo ambayo shule hutofautiana kwa undani. Wanawake hunufaika kwa kujifunza kanuni za vitendo za shule moja inayotegemewa yenye mwalimu aliyehitimu.",
    ],
    hadith: [
      {
        excerpt:
          "Alipoulizwa kwa nini mwenye hedhi anafunga na sio kuswali, Aishah alisema: Tumeamrishwa kufidia saumu na hatukuamrishwa kusimamisha swala. (Mu'adhah, kutoka kwa 'Aishah; pia Sahih Muislamu 335)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Maswali Yanayoulizwa Mara Kwa Mara",
    summary: "Majibu mafupi kwa wasiwasi wa kawaida wa utakaso na mashaka.",
    body: [
      "Je, shaka inavunja wudhu wangu? Hapana. Ikiwa ulikuwa na udhu na huna uhakika kama umeuvunja, udhu wako unasimama mpaka uwe na uhakika wa kubatilisha. Kutenda kwa uhakika juu ya tuhuma ni kanuni ya kinabii ambayo inakukinga na mashaka makubwa (waswas).",
      "Vipi kuhusu casts, bandeji, na majeraha? Kuna makubaliano. Ambapo kuosha kiungo kilichofunikwa kunadhuru, unaweza kufuta juu ya vazi (mash 'ala al-jabirah) mahali pake, na tayammam inashughulikia kile ambacho hakiwezi kufikiwa - maelezo yanatofautiana kulingana na shule na hali.",
      "Je, ikiwa siwezi kutumia maji hata kidogo? Tayammum yenye udongo safi hubakia kuwa halali kabisa hadi uwezo wa kutumia maji urudi.",
      "Vipi kuhusu hali sugu - kutokwa na damu mfululizo (istihada) au kutoweza kujizuia? Mtu huyo huchukuliwa kuwa ni mwenye udhuru wa kudumu (ma'dhur): hujisafisha na kuweka wudhu kwa kila wakati wa swalah, kisha huswali japo kutokwa kwake kutaendelea, na haibatilishi swala hiyo.",
    ],
    actions: [
      "Usiruhusu mashaka ya mara kwa mara yazuie ibada yako - fuata hakika, na sio tuhuma.",
      "Kwa hali sugu au kesi ngumu, pata uamuzi wa kibinafsi kutoka kwa mwanachuoni aliyehitimu.",
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Majibu haya ya Maswali Yanayoulizwa Mara kwa Mara ni muhtasari wa kielimu, sio fatwa ya kibinafsi. Kesi tata au sugu zinapaswa kukaguliwa na mwanazuoni wa karibu.",
  },
  {
    title: "Marejeleo na Utafiti Zaidi",
    summary: "Aya za msingi za Qur'ani na sura za hadithi juu ya utakaso.",
    body: [
      "Maandiko ya msingi ya Qur'ani kwa ajili ya utakaso ni aya ya wudhuu, Surah al-Ma'idah 5:6, ambayo inaweka wudhu, ghusl, na tayammamu pamoja; kando yake, 2:222 ('Mwenyezi Mungu huwapenda wanaojitakasa') na aya za utakaso wa maji (25:48) zinatilia mkazo mada.",
      "Katika Sunnah, vyanzo vya msingi ni Vitabu vya Utakaso (Kitab al-Taharah / al-Wudu / al-Ghusl / al-Hayd) ambavyo vinafungua Sahih al-Bukhari na Sahih Muislamu, na kufuatiwa na sura sawa katika Sunan nne (Abu Dawud, at-Tirmidhi, an-Nasa'i, Ibn Majjah), ambayo hukusanya faini ya Ibn.",
      "Kwa maamuzi yanayotumika, miongozo ya kitamaduni ya fiqh ya shule nne za Sunni inatoa misimamo ya kina - na tofauti zao ni sehemu halali ya mila, sio kasoro. Tumia moduli hii kwa muhtasari uliopangwa, kisha imarisha somo lako na mwalimu aliyehitimu na matini za msingi.",
    ],
    quran: [{}, {}],
    hadith: [
      {
        excerpt: "Sura za kina juu ya wudhu, ghusl, tayammamu, na hayd zinazofungua mkusanyiko.",
      },
      {
        excerpt: "Kitabu cha Utakaso - ripoti sahihi juu ya hukumu, adabu, na kanuni za tahara.",
      },
    ],
    actions: [
      "Fuata mtaala mmoja unaoaminika ili kuepuka mkanganyiko kutoka kwa maamuzi yaliyotawanyika.",
      "Rudia mada hizi mara kwa mara hadi imani ya vitendo iwe thabiti.",
    ],
    appLinks: [{}, {}],
  },
];

export const TAHARAH_CHECKLIST_SW: DeepPartial<TaharahChecklistItem>[] = [
  {
    title: "Wudhu kabla ya Alfajiri",
    hint: "Anza siku katika hali ya usafi inapowezekana.",
  },
  {
    title: "Siwak / mswaki meno",
    hint: "Sunnah kabla ya wudhu na kabla ya swala.",
  },
  {
    title: "Nguo za maombi bila najasah",
    hint: "Angalia uchafu unaoonekana kabla ya swalah.",
  },
  {
    title: "Mahali pa sala safi",
    hint: "Ondoa kitu chochote kichafu mahali unaposali.",
  },
  {
    title: "Rudia wudhu baada ya vibatilishi",
    hint: "Upepo, usingizi, choo — jua kinachovunja wudhu.",
  },
  {
    title: "Ghusl inapohitajika",
    hint: "Baada ya uchafu mwingi, hedhi huisha, au kutokwa na damu baada ya kuzaa.",
  },
];
