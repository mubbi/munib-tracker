// Swahili translation overlay for the Learn Salah guide content. Mirrors the order of
// its English source in ../salah-guide*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { SalahGuidePhrase, SalahGuideTopic } from "../../types/salah-guide";
import type { DeepPartial } from "./localize";

export const SALAH_GUIDE_TOPICS_SW: DeepPartial<SalahGuideTopic>[] = [
  {
    title: "Swala ni nini?",
    summary: "Nguzo ya pili ya Uislamu - mkutano wako wa kila siku uliowekwa na Mwenyezi Mungu.",
    body: [
      "Swalah ni ibada rasmi ambayo Mwenyezi Mungu amefaradhisha kwa kila Muumini: mfuatano ulioamrishwa wa kusimama (qiyam), rukuu (rukuu), na kusujudu (sujud), unaounganishwa na maneno maalum ya sifa, Qur'ani, na dua, inayofanywa kwa nyakati tano maalum kila siku. Neno Swala linatokana na mzizi wa Kiarabu unaomaanisha uhusiano na dua - ni mstari wa moja kwa moja wa muumini, usiopatanishwa na Muumba, hauhitaji kuhani na hakuna mwombezi.",
      "Rakaa moja kamili ya swala - yenye kusimama hadi sijda ya pili - inaitwa rakaa. Swalah huhesabiwa katika rakaa: Alfajiri ni mbili, Maghrib tatu, na Dhuhr, Asr, na Isha nne. Sala za faradhi zinaitwa fard; Nyongeza za Mtume ﷺ zinazoswaliwa mara kwa mara ni sunna, na swala za hiari zinazotolewa bure ni nafl.",
      "Kipekee miongoni mwa nguzo, Swalah haikuteremshwa kupitia Malaika kushuka ardhini bali ilifaradhishwa moja kwa moja kwa Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) alipoinuliwa mbinguni katika Safari ya Usiku (al-Isra' wa al-Mi'raj). Swala hamsini ziliwekwa mara ya kwanza, kisha - kwa Mtume (Swalla Allaahu ´alayhi wa sallam) kurudi mara kwa mara kutafuta urahisi kwa Ummah wake - kupunguzwa hadi tano kutekelezwa kwa vitendo huku akihifadhi malipo ya hamsini.",
      "Ndiyo maana Swalah inakaa katikati kabisa ya maisha ya Kiislamu: inarudiwa mara tano kila siku, inakatisha kazi, mapumziko, na starehe ili kuutia moyo tena Mwenyezi Mungu, na ni kitendo cha kwanza ambacho mja atahesabiwa Siku ya Kiyama. Ikipatikana sauti, rekodi iliyobaki inaelekea kufuata.",
    ],
    quran: [
      {
        excerpt:
          "Ambao wanayaamini ya ghaibu, na wanasimamisha Sala, na wanatoa katika yale tuliyo waruzuku.",
      },
      {
        excerpt:
          "Soma uliyo teremshiwa katika Kitabu na ushike Sala. Hakika Sala hujiepusha na uchafu na maovu, na kumdhukuru Mwenyezi Mungu ni kukubwa zaidi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Katika Safari ya Usiku Mwenyezi Mungu alifaradhisha Sala hamsini; Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) akawa anarudi kuomba msaada mpaka wakawa na watano - 'Hawa ni watano na hawa hamsini, kwani neno lililo pamoja nami halibadiliki.' (pia Sahih Muislamu 162)",
      },
      {
        excerpt:
          "Jambo la kwanza ambalo mja atahesabiwa Siku ya Qiyaamah ni maombi yake; ikiwa ni sawa matendo yake mengine yote ni sawa. (pia Abu Dawud 864, an-Nasa'i 3991)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kwanini Swala?",
    summary: "Matunda ya kiroho, kimaadili, kisaikolojia na ya milele ya sala tano za kila siku.",
    body: [
      "Swalah ni mazungumzo ya moja kwa moja na Mwenyezi Mungu. Katika msimamo wake unazungumza Naye kupitia maneno yake mwenyewe yaliyofunuliwa; katika kusujudu - mkao wa unyenyekevu wa hali ya juu - wewe ni karibu naye na kuna uwezekano mkubwa wa kujibiwa. Hakuna tendo jingine la ibada linalorudiwa mara kwa mara au kwa ukaribu sana.",
      "Matunda yake ya kwanza ni roho iliyozuiliwa, yenye nidhamu. Mwenyezi Mungu Mwenyewe Anasema kwamba Swala inaposimamishwa ipasavyo, ‘hujizuia na uchafu na uovu’ (29:45): mtu anayesimama kikweli mbele ya Mwenyezi Mungu mara tano kwa siku huona dhambi kuwa ngumu kukaribia. Pia ni utakaso unaorudiwa-rudiwa-Mtume (Swalla Allaahu ´alayhi wa sallam) alilinganisha Swalah tano na mto unaotiririka ambao mtu huoga mara tano kila siku, bila kuacha uchafu nyuma.",
      "Matunda yake ya pili ni amani ya ndani. Qur'ani inaahidi kwamba nyoyo hutulia kwa kumkumbuka Mwenyezi Mungu, na Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) katika nyakati za wasiwasi husema, 'Tupe faraja kwa hayo, Ewe Bilal,' akiomba dua. Alielezea furaha ya macho yake kuwa imewekwa kwenye swalah.",
      "Matunda yake ya kijamii na ya milele yanakamilisha picha: viwango vya sala za jamaa tajiri na masikini katika safu moja na hujenga udugu, na kulinda Swala ni miongoni mwa njia za uhakika za msamaha wa Mwenyezi Mungu na Pepo. Mtume (Swalla Allaahu ´alayhi wa sallam) aliahidi Pepo kwa yeyote anayehifadhi Sala mbili za Alfajiri na Alasiri.",
    ],
    quran: [
      {
        excerpt:
          "Hakika mimi ndiye Mwenyezi Mungu. Hapana mungu ila Mimi, basi niabuduni na ushike Sala kwa kunikumbuka.",
      },
      {
        excerpt: "Hakika wamefaulu Waumini ambao ni wanyenyekevu katika Sala zao.",
      },
    ],
    hadith: [
      {
        excerpt:
          "'Kama kungekuwa na mto mlangoni mwa mmoja wenu anaoga mara tano kwa siku, je, uchafu wowote ungebaki juu yake? Wakasema, Hapana. Akasema: Huo ni mfano wa Sala tano - Mwenyezi Mungu anafuta dhambi nazo. (pia Sahih Muislamu 667)",
      },
      {
        excerpt: "Mwenye kuswali Swalah mbili za baridi - Fajr na Alasiri - ataingia Peponi.",
      },
      {
        excerpt:
          "Nimependelewa kwangu kutokana na dunia yako wanawake na manukato, na ubaridi wa macho yangu uliwekwa kwenye maombi.",
      },
    ],
    actions: [
      "Omba sala moja tu kwa wakati unaofaa leo - uthabiti, sio ukamilifu, ndio lengo la kwanza.",
      "Soma maana ya Al-Fatihah mara moja kabla ya Swala yako inayofuata ili uhisi kuwa unajibiwa.",
      "Washa vikumbusho vya adhana ili kusiwe na dirisha la maombi linalopita bila kutambuliwa.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Cheo chake katika Uislamu",
    summary: "Nguzo ya dini - na amali kubwa ya kupuuza.",
    body: [
      "Mtume ﷺ amefundisha kwamba Uislamu umejengwa juu ya nguzo tano, na Swalah ni ya pili, mara tu baada ya ushahidi wa imani mbili. Ushahidi unakuingiza katika Uislamu; maombi ni uthibitisho unaosimama kwamba ushuhuda unaishi moyoni mwako. Hii ndiyo sababu wanachuoni wanaita Swala 'nguzo ya dini' - nyumba isiyo na nguzo kuu inaporomoka.",
      "Uzito wake unaonekana kwa jinsi maandiko yanavyozungumza juu ya kupuuza. Qur'ani inatahadharisha juu ya kizazi ambacho 'kimepuuza sala na kufuata matamanio' na kinabashiri kuangamia kwao, na Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) akaielezea swala hiyo kuwa ni ahadi yenyewe inayotofautisha imani na ukafiri.",
      "Juu ya hukumu ya mwenye kuacha Swalah, kuna tofauti inayojulikana na yenye heshima miongoni mwa wanachuoni wa Kisunni. Wengine wanashikilia kwamba kuiacha kwa makusudi kabisa - huku wakithibitisha kuwa ni wajibu - ni sawa na ukafiri mkubwa unaomtoa mtu katika Uislamu; walio wengi (Hanafi, Maliki, Shafi'i) wanashikilia kwamba mtu kama huyo anabakia kuwa Mwislamu mwenye dhambi na mwenye hatia ya moja ya madhambi makubwa zaidi, mradi tu hakatai faradhi yake. Wote wanakubali kwamba kuacha Swalah ni janga na kwamba yeyote anayekanusha wajibu wake ametoka katika Uislamu kwa makubaliano.",
      "Somo la kivitendo ni lile lile kwa kila mtazamo: kuchunga sala tano za kila siku si jambo la hiari au la kujadiliwa kwa muumini. Swalah za hiari (sunnah na nafl) kisha hufanya kama wavu wa usalama, na kufanya upungufu katika sala za faradhi Siku ya Qiyaamah.",
    ],
    quran: [
      {
        excerpt:
          "Simamisheni Sala na Sala ya kati, na simameni mbele ya Mwenyezi Mungu na mt'iifu.",
      },
      {
        excerpt:
          "Lakini wakaja baada yao makhalifa waliopuuza Sala na wakafuata matamanio; kwa hiyo wanaenda kukutana na uovu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Uislamu umejengwa juu ya matano: kushuhudia kwamba hapana mungu ila Mwenyezi Mungu na kwamba Muhammad ni Mtume wake, na kusimamisha swala, kutoa zaka, kuhiji, na kufunga Ramadhani. (pia Swahiyh al-Bukhari 8)",
      },
      {
        excerpt:
          "Agano baina yetu na wao ni Sala; mwenye kuiacha amekufuru. (Buraydah; pia an-Nasa'iy, Ibn Majah 1079)",
      },
      {
        excerpt: "Baina ya mtu na ukafiri na kuabudu masanamu kunasimama kuacha sala. (Jabir)",
      },
    ],
    disclaimer:
      "Wanachuoni wametofautiana juu ya hukumu kamili kwa mwenye kuacha swala kwa uvivu (dhambi kubwa kwa walio wengi; ukafiri kwa wengine) dhidi ya anayekanusha faradhi yake (kufuru kwa makubaliano). Programu hii haitoi uamuzi kwa mtu yeyote - wasiliana na mwanachuoni aliyehitimu kwa kesi za kibinafsi.",
  },
  {
    title: "Nani lazima aombe?",
    summary:
      "Kila Mwislamu mwenye akili timamu, mtu mzima - aliye na misamaha iliyoainishwa wazi na makubaliano.",
    body: [
      "Swalah inakuwa faradhi kwa kila Muislamu mwenye akili timamu na amebaleghe (bulugh). Makundi matatu yanaondolewa kutoka kwa uwajibikaji kabisa kwa kanuni ya kweli: mtu anayelala hadi aamke, mtoto hadi atakapokomaa, na asiye na uwezo wa kiakili hadi sababu nzuri irudi.",
      "Watoto bado hawajalazimika, lakini wanazoezwa hatua kwa hatua. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) ameamrisha watoto kuswali kuanzia umri wa miaka saba na kuadhibiwa kwa upole kwa kuipuuza wakiwa na umri wa miaka kumi—ili kwamba kwa kubaleghe, swalah tayari ni tabia iliyotulia, si mzigo wa ghafla.",
      "Wanawake walio katika hedhi (hayd) au kutokwa na damu baada ya kuzaa (nifas) hawaswali wakati huo; Swala za faradhi zilizokoswa hazitungwi baadae - ni rehema na hukumu iliyokubaliwa na wanachuoni. (Saumu zilizokoswa, tofauti na swala, zinatengenezwa.) Mwanamke anarejesha swala mara tu damu inapoisha na ametoharisha kwa ghusl.",
      "Kutokuwa na uwezo wa kweli huleta kibali, kamwe kughairi: ugonjwa mkali, kukosa fahamu, na woga mwingi unaweza kumpa mtu udhuru kwa muda, na wagonjwa wanaomba kulingana na uwezo wao - kukaa, kusema uwongo, au hata kwa ishara. Kusafiri hakuondoi swala bali hurahisisha kwa kufupisha (qasr) na kuchanganya (jam'), iliyoainishwa kwenye Mwongozo wa Kusafiri.",
    ],
    hadith: [
      {
        excerpt:
          "Waamrishe watoto wako kuswali wakiwa na umri wa miaka saba, na waadhibu kwa hiyo saa kumi, na watenge sehemu zao za kulala. (Amr bin Shuayb kutoka kwa baba yake kutoka kwa babu yake)",
      },
    ],
    quran: [
      {
        excerpt: "Na waamrishe ahli zako Sala, na usimame humo.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Masharti kabla ya swalah",
    summary: "Masharti tisa (shurut) ambayo lazima yawepo ili maombi yawe sahihi.",
    body: [
      "Kabla hata sala haijasahihishwa, masharti fulani (shurut al-Swala) lazima yatimizwe. Hali inatofautiana na nguzo: masharti ni sharti zinazokuja kabla ya kuanza na kuendelea kote, ambapo nguzo (arkan) ni sehemu za sala yenyewe. Iwapo hali inayotakiwa inakosekana, sala haikubaliwi hata iwe inafanywa vizuri kiasi gani.",
      "Fikiria hizi tisa kama orodha ya kukagua kabla ya safari ya ndege. Wengi huungana na somo kamili mahali pengine katika mwongozo huu - gusa ili kujifunza kila moja kwa kina. Wawili kati yao (wakielekea Qibla na wakati sahihi) wanaweza kusamehewa kwa kutokuwa na uwezo wa kweli; mengine yanahitajika kwa dhati kila mtu anapoweza.",
    ],
    steps: [
      {
        title: "Uislamu",
        body: "Swala ni kitendo cha Muislamu; si sahihi kutoka kwa - wala si wajibu kwa - asiye Muislamu mpaka waingie katika Uislamu.",
      },
      {
        title: "Akili timamu ('aql)",
        body: "Mtu lazima awe na sababu nzuri. Mtu ambaye amepoteza akili zake hawajibikiwi akiwa katika hali hiyo.",
      },
      {
        title: "Utambuzi (tamyiz)",
        body: "Uwezo wa kutofautisha, ulifikia karibu umri wa miaka saba - umri ambao watoto wanaambiwa kuomba.",
      },
      {
        title: "Kuondoa uchafu mdogo na mkubwa (tahara kutoka kwa hadath)",
        body: "Hali halali ya wudhu, au ghusl baada ya uchafu mkubwa, au tayammamu wakati maji hayawezi kutumika.",
      },
      {
        title: "Kuondoa uchafu (najasah)",
        body: "Mwili, mavazi, na mahali pa sala lazima pasiwe na uchafu wa kiibada kama vile mkojo, damu kwa wingi, na vitu vingine vilivyoorodheshwa.",
      },
      {
        title: "Kufunika awrah",
        body: "Sehemu zinazopaswa kufunikwa zimefunikwa kwa nguo safi, zisizo wazi - tazama somo la Mavazi na awrah.",
      },
      {
        title: "Muda wa maombi umeingia",
        body: "Kila swala ina dirisha lililobainishwa; kuswali kabla ya wakati wake kuanza ni batili. Tumia ratiba na vikumbusho.",
      },
      {
        title: "Kuelekea kibla",
        body: "Kugeukia Ka'aba kwa ukaribu uwezavyo - kusamehewa tu kwa kutokuwa na uwezo wa kweli.",
      },
      {
        title: "Nia (niyyah)",
        body: "Kuazimia moyoni ni maombi gani unakaribia kufanya. Ni kitendo cha ndani na hakizungumzwi kwa sauti.",
      },
    ],
    appLinks: [{}, {}, {}],
    disclaimer:
      "Shule neno na kuhesabu masharti tofauti kidogo (baadhi wanaorodhesha niyyah miongoni mwa nguzo badala ya masharti). Dutu hii imekubaliwa.",
  },
  {
    title: "Utakaso (Tahara)",
    summary: "Usafi wa nafsi, mavazi, na mahali - mlango wa kila sala.",
    body: [
      "Tahara maana yake ni kuondoa uchafu wa kiibada ili uweze kusimama mbele ya Mwenyezi Mungu katika hali ya usafi. Mwenyezi Mungu anawapenda wanaojitakasa, na Mtume ﷺ amefundisha kwamba 'utakaso ni nusu ya imani. Hakuna maombi yanayokubaliwa bila hiyo.",
      "Uchafu ni wa aina mbili. Uchafu mdogo (hadath asghar) - unaosababishwa na vitu kama vile choo au upepo wa kupita - unainuliwa na wudhu. Uchafu mkubwa (hadath akbar au janaba) - kufuatia urafiki, kumwaga manii, au mwisho wa hedhi na kutokwa na damu baada ya kuzaa - huondolewa kwa kuoga kamili ya kiibada (ghusl).",
      "Kando na hali hizi za ibada, uchafu unaoonekana (najasah) - kama vile mkojo, kinyesi, damu inayotiririka, na mengineyo - lazima iondolewe mwilini, nguo, na mahali unaposali. Inawezekana kuwa na wudhu halali lakini bado unahitaji kusafisha doa kwenye nguo zako kabla ya kuswali.",
      "Maji ndio kisafishaji kikuu. Wakati maji kwa kweli hayapatikani, au yangekudhuru kwa sababu ya ugonjwa au baridi kali, Uislamu unaruhusu tayammam - utakaso mkavu kwa kutumia udongo safi - kama mbadala kamili. Utakaso kamwe haukusudiwi kuwa ugumu; ni njia ya kusogea karibu.",
    ],
    hadith: [
      {
        excerpt: "Utakaso ni nusu ya imani… (Abu Malik al-Ash’ariy)",
      },
    ],
    quran: [
      {
        excerpt: "Hakika Mwenyezi Mungu huwapenda wanao tubu na huwapenda wanao jitakasa.",
      },
    ],
    actions: [
      "Jifunze wudhu hatua kwa hatua kabla ya sala yako inayofuata ili kila kiungo kioshwe kwa usahihi.",
      "Weka vazi safi lililotengwa kwa ajili ya maombi ikiwa unafanya kazi katika mazingira machafu.",
      "Tazama sehemu yako ya maombi kwa uchafu unaoonekana kabla ya kuweka mkeka.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Wudhu - wudhuu",
    summary: "Uoshaji ulioamrishwa unaoinua uchafu mdogo na hukutayarisha kwa maombi.",
    body: [
      "Wudhu ni uoshaji wa kiibada unaoondoa uchafu mdogo. Inatakiwa kabla ya kila swala isipokuwa wewe bado uko katika hali halali kutoka kwa ile iliyotangulia, na - kwa mujibu wa wanavyuoni wengi - kabla ya kugusa maandishi halisi ya Qur'ani. Safi zake nne za faradhi zimetajwa moja kwa moja ndani ya Qur'ani (5:6): uso, mikono hadi kwenye viwiko, kupangusa kichwa, na miguu hadi kwenye vifundo vya miguu.",
      "Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) alitoa udhu kwa utaratibu uliowekwa, mara tatu kwa viungo vilivyooshwa, bila ya kupoteza maji - alitahadharisha dhidi ya ubadhirifu hata kwenye mto unaotiririka. Zaidi ya matendo manne ya faradhi, kukojoa mdomo na pua, kuosha mikono kwanza, na kutumia miswak ni sunna zilizowekwa ambazo hukamilisha na kupamba wudhu.",
      "Malipo yake ni makubwa sana: Mtume ﷺ alifundisha kwamba Muumini anapoosha kila kiungo, madhambi yanayotendwa na kiungo hicho huanguka kwa maji - hata chini ya misumari - ili atoke akiwa ametakasika. Kwa hiyo Wudhu sio utaratibu tu bali ni kitendo kidogo cha msamaha kabla ya kila swala.",
      "Wudu huvunjwa na kitu chochote kinachotoka kwenye vijia vya faragha (mkojo, kinyesi, upepo), kwa usingizi mzito ambao huondoa ufahamu, na kupoteza fahamu. Ikikatika wakati wa swala ni lazima usimame, urudishe wudhu, na uanze kuswali tena.",
    ],
    steps: [
      {
        title: "Nia & Bismillah",
        body: "Nia udhu moyoni mwako na anza na 'Bismillah'. Nia ni ya ndani na sio lazima itamkwe.",
        tip: "Tumia miswak (siwak) kabla unapoweza - sunna ambayo Mtume ﷺ aliipenda na karibu kuifanya kuwa ni wajibu.",
      },
      {
        title: "Osha mikono",
        body: "Osha mikono yote miwili kwa mikono mara tatu, maji ya kazi kati ya vidole.",
      },
      {
        title: "Suuza mdomo",
        body: "Kuchukua maji ndani ya kinywa, kuzunguka, na kuifukuza - mara tatu.",
      },
      {
        title: "Suuza pua",
        body: "Chora maji kwenye pua ya pua kwa mkono wa kulia na uifukuze kwa kushoto - mara tatu.",
      },
      {
        title: "Osha uso (fard)",
        body: "Osha uso wote mara moja hadi mara tatu, kutoka kwa nywele hadi kidevu na kutoka sikio hadi sikio; mwanamume anaendesha vidole vilivyolowa kwenye ndevu nene.",
      },
      {
        title: "Osha mikono (fard)",
        body: "Osha mkono wa kulia, kisha kushoto, kutoka kwa vidole hadi na kujumuisha viwiko - mara tatu kila moja.",
      },
      {
        title: "Futa kichwa (fard)",
        body: "Kwa mikono ya mvua, futa kichwa mara moja kutoka mbele hadi nyuma na nyuma tena, kisha uifuta ndani na nyuma ya masikio na unyevu sawa.",
      },
      {
        title: "Osha miguu (fard)",
        body: "Osha mguu wa kulia, kisha kushoto, hadi na ikiwa ni pamoja na vidole - mara tatu kila mmoja, kupitisha vidole kati ya vidole.",
      },
      {
        title: "Ushuhuda wa imani",
        body: "Kamilisha kwa du'a: 'Ashhadu an la ilaha illallah…' - milango minane ya Peponi inafunguliwa kwa yeyote atakayeisema baada ya wudhu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mja anapoosha uso wake kwa wudhu, kila dhambi anayoitazama kwa macho yake huondoka na maji… mpaka atokee ametakasika na dhambi.",
      },
    ],
    quran: [
      {
        excerpt:
          "Enyi mlio amini mnaposimama kuswali osheni nyuso zenu na mikono yenu mpaka kwenye viwiko, mpake vichwa vyenu na osheni miguu yenu mpaka vifundoni.",
      },
    ],
    actions: [
      "Toa wudhu polepole mara moja huku ukisoma kila hatua kwa sauti, ukiangalia viwiko na visigino.",
      "Kariri du'a fupi baada ya wudhu - tazama Maneno ya Swalah.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Mavazi & awrah",
    summary: "Funika kile kinachopaswa kufunikwa - kwa usafi, kiasi, na kwa heshima.",
    body: [
      "Kufunika awrah - sehemu za mwili ambazo lazima zifichwe - ni sharti la sala halali, inayotolewa kutoka kwa amri ya Mwenyezi Mungu ya 'kuchukua pambo lako katika kila sehemu ya sala' (7:31). Nguo lazima ziwe safi za najasah na zisizo wazi kiasi kwamba rangi ya ngozi haionekani.",
      "Kwa wanaume, awrah katika swala, kwa uchache, ni kutoka kwenye kitovu hadi kwenye goti. Hata hivyo, kusali kifua wazi wakati nguo zinapatikana haipendi; Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) ameamrisha kwamba mtu asiswali katika nguo moja bila ya sehemu yake juu ya mabega yake.",
      "Kwa wanawake, mwili wote ni awrah katika swala isipokuwa uso na mikono, kwa mujibu wa wanachuoni wengi; mwanamke hufunika nywele, shingo, na miguu yake, kwa kawaida kwa vazi lililolegea na hijabu. Wanachuoni wanatofautiana juu ya miguu, wengine wakizingatia kuwa ni pamoja na katika kile kinachoweza kuonyeshwa - kusali nayo kufunikwa ni mazoezi salama na ya wengi.",
      "Hukumu mbili za mavazi zinatumika pia nje ya swala: hariri na dhahabu ni haramu kwa wanaume kuvaa (imeruhusiwa kwa wanawake), na nguo zisiwe za kubana sana, tupu, au za kutafuta mazingatio hivi kwamba zinashinda maombi ya staha. Kama kanuni, sali ukiwa na mavazi ambayo ungevaa ili kukutana na mtu unayemheshimu - si nguo za usiku au za ufukweni.",
    ],
    quran: [
      {
        excerpt: "Enyi wana wa Adam, chukueni mapambo yenu katika kila sehemu ya kuswalia.",
      },
    ],
    actions: [
      "Tenga vazi moja safi, la kiasi au vazi maalum la maombi ili uwe tayari kila wakati.",
      "Wakati huna uhakika kama kitu kinafunika vya kutosha, funika zaidi badala ya kidogo.",
    ],
    disclaimer:
      "Maelezo ya awrah (hasa miguu ya mwanamke) ni nukta ya tofauti ya kielimu ya heshima. Fuata udhamini wa ndani unaotegemewa ambapo unatofautiana.",
  },
  {
    title: "Nyakati za maombi",
    summary: "Dirisha tano za kila siku - kila Swala ina mwanzo, mwisho, na wakati unaopendekezwa.",
    body: [
      "Mwenyezi Mungu aliweka swala 'katika nyakati maalumu' (4:103), akigawanya mchana na usiku katika madirisha matano yaliyofungamana na mwendo wa jua. Kuomba kabla ya dirisha kufunguliwa ni batili; kuchelewesha swala kupita dirishani bila udhuru ni dhambi kubwa. Kila inapowezekana, sali mapema dirishani - Mtume ﷺ aliitaja swala mara ya kwanza kuwa miongoni mwa amali zinazopendwa sana na Mwenyezi Mungu.",
      "Dirisha tano ni: Alfajiri, kuanzia alfajiri ya kweli mpaka mawio ya jua; Dhuhr, kutoka jua kupita kilele chake mpaka kivuli cha kitu kinalingana na urefu wake; Asr, kuanzia mwisho wa Dhuhr mpaka kuzama kwa jua (inaswaliwa vyema kabla ya jua kuwa njano); Maghrib, kuanzia machweo hadi machweo mekundu yanafifia; na Isha, tangu kufifia kwa machweo mpaka alfajiri ya kweli (ikisaliwa vyema kabla ya usiku wa manane).",
      "Kuna vipindi vitatu vifupi ambavyo ndani yake swalah ya hiari imeharamishwa, ili ibada isichanganywe kamwe na ibada ya jua: jua linapochomoza mpaka limechomoza kabisa, linaposimama haswa kwenye kilele chake wakati wa adhuhuri, na linapozama mpaka linapotua kabisa. Kusimamisha Swalah ya faradhi ni isipokuwa katika katazo hili.",
      "Saa za saa hubadilika kila siku kwa latitudo na majira yako, ndiyo maana Mtume ﷺ akawafungamanisha na dalili za asili badala ya saa maalum. Programu huzihesabu kwa eneo lako - lakini kujua ishara za msingi hukuweka msingi wakati teknolojia haipatikani.",
    ],
    steps: [
      {
        title: "Alfajiri - rakaa 2 fard",
        body: "Kweli alfajiri hadi jua linachomoza. Imetanguliwa na sunna ya rakaa 2 iliyosisitizwa sana.",
      },
      {
        title: "Dhuhr - rakaa 4 fard",
        body: "Baada ya jua kupita kilele chake mpaka kivuli cha Asr. Sunnah ya 4 kabla na 2 baada.",
      },
      {
        title: "Asr - rakaa 4 fard",
        body: "Kuanzia mwisho wa Dhuhr mpaka kuzama kwa jua; omba kabla ya jua kuwa njano. Mara nyingi huhusishwa na 'sala ya kati' ya 2:238.",
      },
      {
        title: "Maghrib - rakaa 3 fard",
        body: "Kuanzia machweo hadi machweo yanafifia; omba mara moja. Sunnah ya 2 baada ya.",
      },
      {
        title: "Isha - rakaa 4 fard",
        body: "Tangu kufifia kwa machweo hadi alfajiri; bora kabla ya saa sita usiku. Ikifuatiwa na Witr.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kuna nyakati tatu ambazo Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) alitukataza kuswali: linapochomoza jua mpaka linapochomoza, linaposimama adhuhuri, na linapozama mpaka kuzama. (Uqbah bin ́Amir)",
      },
    ],
    quran: [
      {
        excerpt: "Hakika Sala imeandikiwa juu ya Waumini ni sharti la nyakati maalumu.",
      },
      {
        excerpt:
          "Na shikeni Sala katika ncha mbili za mchana na inapokaribia usiku. Hakika matendo mema huondoa maovu.",
      },
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Mwanzo wa Asr una maoni mawili yaliyoripotiwa (kivuli sawa na, au mara mbili, urefu wa kitu). Zote mbili ni halali; fuata hesabu ya eneo lako na jumuiya.",
  },
  {
    title: "Kuelekea kibla",
    summary: "Geuka kuelekea Nyumba Takatifu iliyoko Makkah - mwelekeo unaounganisha ummah.",
    body: [
      "Qiblah ni mwelekeo wa Ka'bah ndani ya Masjid al-Haram huko Makka. Kukabiliana nayo ni sharti la maombi halali. Mapema katika Uislamu Waislamu waliomba kuelekea Jerusalem; kisha Mwenyezi Mungu akateremsha amri ya kurejea Msikiti Mtakatifu, na mwelekeo mmoja umewaunganisha waja wa dunia tangu wakati huo - kila siku, maonyesho ya kimwili ya umma mmoja unaomkabili Mola mmoja.",
      "Unatakiwa kukabiliana na kibla kwa usahihi uwezavyo kubainisha - kwa dira, mihrab ya msikiti, programu inayotegemewa, au jua na nyota unaposafiri. Mkengeuko mdogo, usioepukika husamehewa; cha muhimu ni juhudi za dhati kuelekea mwelekeo sahihi.",
      "Ikiwa kwa kweli huwezi kuamua mwelekeo - uliopotea baharini, kwenye mawingu, katika ardhi usiyoijua usiku - jitahidi kuisuluhisha na kisha uombe kuelekea hukumu yako bora; sala ni halali hata kama itathibitika baadae kidogo. Juu ya gari linalosonga au ndege ambapo kuelekea kibla kwa ajili ya sala ya faradhi haiwezekani, unakabiliana na chochote unachoweza, kwa kuwa Mwenyezi Mungu hailemei nafsi zaidi ya uwezo wake.",
    ],
    quran: [
      {
        excerpt:
          "Basi elekeza uso wako upande wa Masjid al-Haram. Na popote mlipo zielekezeni nyuso zenu humo.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Unapoinuka kuswali, toa wudhu vizuri, kisha elekea kibla na sema takbira. (kutoka katika Hadiyth ya mtu aliyeswali vibaya)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Adhana - wito wa maombi",
    summary: "Maneno yanayolingania ummah, maana yake, na jinsi ya kuyajibu.",
    body: [
      "Adhana ni wito unaotangaza kuwa wakati wa swala umeingia. Ni sunna ya jumuiya kwa ajili ya swala tano za kila siku (si za Iddi au za maiti), zinazotolewa kutoka mahali palipoinuka ili jamii ikusanyike kuabudu. Inafuatwa, kabla tu ya swala kuanza, kwa mwito wa pili, mfupi - iqamah.",
      "Unaposikia adhana, sunna ni kurudia kila ibara baada ya muadhdhini — isipokuwa katika ‘Hayya ‘ala as-Swala’ na ‘Hayya ‘ala al-falah’, ambapo badala yake unasema ‘La hawla wa la quwwata illa billah’ (hakuna uwezo wala nguvu isipokuwa kwa Mwenyezi Mungu). Katika adhana ya Alfajiri mlinganiaji anaongeza 'As-salatu khayrun min an-nawm' (Swala ni bora kuliko kulala).",
      "Baada ya kumalizika kwa adhana, mswalie Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) kisha usome du'a iliyothibiti ukimwomba Mwenyezi Mungu amjaalie daraja tukufu (al-wasilah) - Mtume ﷺ aliahidi uombezi wake kwa atakayesema. Wakati uliopo baina ya adhana na iqamah ni wakati ambapo dua haigeukiwi, hivyo dua kwa uhuru.",
    ],
    steps: [
      {
        title: "Allahu Akbar (×4)",
        body: "Mwenyezi Mungu ndiye Mkubwa zaidi kuliko chochote kinachoweza kukushughulisha.",
      },
      {
        title: "Ashhadu an la ilaha illallah (×2)",
        body: "Nashuhudia ya kwamba hapana mungu ila Mwenyezi Mungu.",
      },
      {
        title: "Ashhadu Anna Muhammad Rasulullah (×2)",
        body: "Nashuhudia kwamba Muhammad ni Mtume wa Mwenyezi Mungu.",
      },
      {
        title: "Hayya 'ala as-Swala (×2)",
        body: "Njoo kwenye maombi. Jibu kwa: La hawla wa la quwwata illa billah.",
      },
      {
        title: "Hayya 'ala al-falah (×2)",
        body: "Njoo kwenye mafanikio. Jibu kwa: La hawla wa la quwwata illa billah.",
      },
      {
        title: "Allahu Akbar (×2)",
        body: "Mwenyezi Mungu ndiye Mkubwa.",
      },
      {
        title: "La ilaha illallah",
        body: "Hapana mungu ila Mwenyezi Mungu - mwito hufunga kwa neno lile lile lililofunguliwa kuelekea.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Yeyote atakayesema baada ya kusikia wito, 'Ewe Mwenyezi Mungu, Mola wa wito huu mkamilifu na sala iliyothibiti, mpe Muhammad wasila na wema…' — uombezi wangu utakuwa wake Siku ya Kiyama. (Jabir)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Swala ya hatua kwa hatua",
    summary: "Mlolongo kamili wa rakaa - kila ibara inayosomwa, pamoja na hukumu yake.",
    body: [
      "Kila swala inajengwa kwa rakaa moja inayorudia - rakaa: unasimama na kusoma, rukuu, unasimama, sujudu mara mbili, na (mwisho wa swala) keti kwa ajili ya tashahhud na utoe salamu. Jifunze vizuri rakaa moja na unaweza kuswali swala yoyote, kwa sababu swala ndefu inarudia raa hii. Hatua zilizo hapa chini zinapeana kila tendo kwa mpangilio, maneno kamili ya kusema kwa Kiarabu pamoja na maana yake, na lebo ndogo inayoonyesha kama kitendo ni nguzo, kitendo kinachotakiwa, au kinachopendekezwa.",
      "Wanachuoni hupanga vitendo vya swala katika viwango vitatu. Fard (nguzo / rukn) ni muhimu: iache - hata kwa makosa - na sala, au rakaa hiyo, ni batili mpaka itolewe. Wajib (kitendo kinachotakiwa) ni wajibu, lakini ukisahau moja unatengeneza Sala kwa sijda ya kusahau (sujud as-sahw) badala ya kuirudia. Sunnah inapendekezwa na thawabu, na sala ni kamili na ni sahihi bila hiyo. Ambapo shule za fiqh huweka kitendo katika kategoria tofauti, vidokezo vinabainisha hilo - mipaka hii yenye sehemu tatu yenyewe ni mojawapo ya maeneo ya kawaida ya tofauti za kielimu.",
      "Kwa muda wote, sifa moja ambayo haipaswi kupotea kamwe ni tuma'ninah - utulivu: kutulia kikamilifu katika kila mkao, na viungo vimepumzika, kabla ya kusonga mbele. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) alimtuma mtu ambaye alikuwa ameswali kwa haraka na kuswali tena mara tatu, akisema: “Rudi na uswali, kwani hukuswali,” kisha akamfundisha kutulia katika kila hali. Sogea baina ya misimamo kwa takbira 'Allahu Akbar', na weka macho yako kwenye sehemu ya kusujudu.",
      "Rakaa ngapi, na mahali unapokaa: Sala ya rakaa mbili (Fajr, na Jumu'ah) ina kikao kimoja - tashahhud ya mwisho baada ya rakaa ya pili - kisha salamu. Swala ya rakaa tatu (Maghrib) na rakaa nne (Dhuhr, Asr, Isha) hukaa kwa tashahhud ya kwanza, fupi baada ya rakaa ya pili, kisha simama kwa rakaa iliyobakia - kusoma Al-Fatiha tu ndani yake, bila surah iliyoongezwa - na keti tena kwa tashahhud ya mwisho na salam.",
      "Kwa sauti au kimya: Al-Fatihah na surah husomwa kwa sauti (jahri) katika Alfajiri, Jumu'ah, na rakaa mbili za mwanzo za Maghrib na Isha; zinasomwa kimya kimya (sirri) katika Dhuhr na Asr, katika rakaa ya tatu ya Maghrib, na katika rakaa ya tatu na ya nne ya Isha. Kila kifungu kingine cha sala - tasbih ya rukuu na sujud, tashahhud, na kadhalika - inasemwa kimya kimya. Mtu anayeswali peke yake anaweza kusoma kwa sauti katika sala kwa sauti au kuiweka chini; mfuasi nyuma ya imamu anasikiliza tu huku imamu anasoma kwa sauti.",
      "Baadhi ya nyongeza ni za maombi au nyakati fulani. Katika sala ya Witr wengi husoma Qunut katika rakaa ya mwisho - wakiinua mikono kuomba mwongozo na ulinzi (maneno yanayojulikana sana yanaanza 'Allahumma-hdini fiman hadayt…'). Wakati wa shida Qunut an-Nazilah inaweza kuongezwa kwenye sala za faradhi, na shule zinatofautiana juu ya Qunut iliyosimama katika Alfajiri. Ukichelewa kujiunga na jamaa (masbuq), chochote utakachokipata kwa imamu kinahesabika, na utalipa rakaa ulizozikosa baada ya salamu yake. Na ukiongeza au kuacha kitu kwa makosa, tazama mwongozo wa sujud as-sahw.",
    ],
    steps: [
      {
        title: "1. Nia na kusimama (niyyah & qiyam)",
        body: "Ielekee kibla na usimame wima - kusimama ni nguzo ya kila sala ya faradhi kwa anayeweza. Tulia moyoni ni maombi gani mahususi ambayo unakaribia kuomba; nia ni azimio la ndani, sio sentensi inayotamkwa kwa sauti.",
        tip: "Yaelekeze macho yako mahali pa sujud na uyaweke hapo. Yeyote ambaye kwa hakika hawezi kusimama anaswali kwa kukaa, kisha kusema uongo - sala yenyewe haiangushwi.",
      },
      {
        title: "2. Kufungua takbir (Takbirat al-Ihram)",
        body: "Inua mikono yako kwenye mabega au ncha za sikio na useme takbir, kisha weka mkono wa kulia juu ya kushoto kwenye kifua. Kwa hili sala huanza, na mazungumzo ya kawaida na harakati sasa ni haramu mpaka salam.",
        translation: "Mwenyezi Mungu ndiye Mkubwa.",
        tip: "Kunyanyua mikono (raf' al-yadayn) kwa takbir ni sunna iliyothibitishwa, sio nguzo.",
      },
      {
        title: "3. Dua ya kufungulia (Du ́a al-Istiftah)",
        body: "Soma kwa utulivu dua fupi ya kufungua ili kutuliza moyo mbele ya maneno ya Mwenyezi Mungu. Maneno kadhaa ya kweli yanaripotiwa; hii ni moja ya kawaida.",
        translation:
          "Utukufu ni Wako, Ewe Mwenyezi Mungu, na sifa njema. Jina lako limebarikiwa na utukufu wako umetukuka. Hapana mungu ila Wewe.",
      },
      {
        title: "4. Ta'awwudh & Basmalah",
        body: "Jikinge kwa Mwenyezi Mungu na Shetani, kisha anza na Basmalah kabla ya Al-Fatihah. Yote mawili yanasemwa kwa utulivu, hata katika maombi ya sauti.",
        translation:
          "Najikinga kwa Mwenyezi Mungu na Shetani, mlaaniwa. Kwa jina la Mwenyezi Mungu, Mwingi wa Rehema, Mwenye kurehemu.",
      },
      {
        title: "5. Soma Al-Fatihah",
        body: "Soma Ufunguzi wa Kitabu katika kila rakaa - 'Hapana Swalah kwa asiyesoma Ufunguzi wa Kitabu.' Imamu na mwabudu peke yao huisoma kwa sauti katika sala za sauti; vinginevyo inasomwa kwa utulivu.",
        translation:
          "Kwa jina la Mwenyezi Mungu, Mwingi wa Rehema, Mwenye kurehemu. Sifa njema zote anastahiki Mwenyezi Mungu, Mola Mlezi wa walimwengu wote, Mwingi wa Rehema, Mwenye kurehemu na Mwenye kurehemu, Mfalme wa Siku ya Malipo. Wewe tunakuabudu na Wewe tunakuomba msaada. Tuongoze kwenye njia iliyonyooka, njia ya wale ulioneemesha, si ya walioghadhibikiwa au waliopotea.",
        tip: "Sema 'Ameen' baada yake (kwa sauti katika sala za sauti). Darasa la Hanafi wakisoma baadhi ya Qur'ani kama nguzo na Al-Fatihah hasa kama wajib; walio wengi wanashikilia Al-Fatihah yenyewe ni nguzo katika kila rakaa.",
      },
      {
        title: "6. Soma surah au baadhi ya aya",
        body: "Katika rakaa mbili za mwanzo pekee, fuata Al-Fatihah kwa surah fupi au aya chache - kwa mfano Surah Al-Ikhlas ('Qul huwa Allahu ahad…'). Katika rakaa ya tatu na ya nne soma Al-Fatiha peke yake.",
        tip: "Imependekezwa kwa mwenye kuabudu peke yake na imamu; mfuasi anasikiliza. Hanafi wanashikilia kuwa kuongeza surah katika rakaa mbili za mwanzo ni wajib.",
      },
      {
        title: "7. Kuinama (ruku)",
        body: "Sema ‘Allahu Akbar’ na inama kwa mgongo ulio sawa, mikono ikishika magoti, na umtukuze Mola wako Mlezi mara tatu au zaidi bila ya haraka.",
        translation: "Utukufu ni wa Mola wangu Mlezi, Mtukufu.",
        tip: "Upinde wenyewe, unaoshikiliwa kwa utulivu, ndio nguzo; tasbihi inayosomwa ndani yake ni sunna (wajib katika baadhi ya shule).",
      },
      {
        title: "8. Kupanda kutoka rukuu (i'tidal)",
        body: "Inuka wima kabisa - imamu na mwabudu peke yake akisema tasmi', na kila mtu anayesema tahmid - na simama tuli kabisa kabla ya kushuka.",
        translation:
          "Mwenyezi Mungu humsikia anayemhimidi. Mola wetu Mlezi, sifa njema zote ni Zako.",
        tip: "Kusimama sawa na kwa urahisi ni nguzo - usizame kwenye sujud hadi utulie hapa.",
      },
      {
        title: "9. Kusujudu (sujud)",
        body: "Sema 'Allahu Akbar' na usujudu juu ya mifupa saba - paji la uso pamoja na pua na viganja vyote viwili, magoti yote na vidole vya miguu yote miwili - ukimtukuza Aliye juu mara tatu au zaidi. Huu ndio mkao ulio karibu zaidi na Mwenyezi Mungu, basi mimina dua baada ya tasbihi.",
        translation: "Utukufu ni wa Mola wangu Mlezi aliye juu.",
        tip: "Weka mikono ya mikono iliyoinuliwa kutoka chini na mbali na pande, na tumbo mbali na mapaja.",
      },
      {
        title: "10. Kuketi baina ya sijda mbili (jalsah)",
        body: "Simama kutoka kwenye sujud ya kwanza kusema 'Allahu Akbar', kaa kwa utulivu na wima, na umuombe msamaha Mola wako Mlezi kabla ya kusujudu tena.",
        translation: "Mola wangu Mlezi, nisamehe.",
        tip: "Keti hadi upate raha - kikao hiki kifupi, kwa utulivu, ni nguzo yenyewe.",
      },
      {
        title: "11. Sijda ya pili",
        body: "Sema 'Allahu Akbar' na sujudu mara ya pili sawa na ile ya kwanza, kwa tasbihi ile ile na utulivu uleule. Hii inakamilisha rakaa moja kamili.",
        translation: "Utukufu ni wa Mola wangu Mlezi aliye juu.",
      },
      {
        title: "12. Simama kwa rakaa inayofuata",
        body: "Sema 'Allahu Akbar' na uinuke kusimama, kisha urudie kutoka kwa Al-Fatihah. Katika rakaa ya tatu na ya nne soma Al-Fatihah tu, bila surah iliyoongezwa.",
        tip: "Katika sala ya rakaa mbili hutasimama tena baada ya rakaa ya pili - unakaa kwa tashahhud ya mwisho.",
      },
      {
        title: "13. Tashahhud ya kwanza (katika sala ya rakaa 3 na 4)",
        body: "Baada ya rakaa ya pili ya Maghrib, Dhuhr, Asr, au Isha, keti na usome At-Tahiyyat, kisha simama kwa rakaa iliyobaki. Swala ya rakaa mbili haina tashahhud ya kwanza.",
        translation:
          "Salamu zote, sala na maneno safi ni ya Mwenyezi Mungu. Amani iwe juu yako, ewe Mtume, na rehema ya Mwenyezi Mungu na baraka zake. Amani iwe juu yetu na juu ya waja wema wa Mwenyezi Mungu. Nashuhudia ya kwamba hapana mungu ila Mwenyezi Mungu, na nashuhudia kwamba Muhammad ni mja na Mtume wake.",
        tip: "Inua kidole cha shahada cha kulia kwenye kikao. Ikiwa umesahau tashahhud ya kwanza na ukaanza kusimama, endelea na ufanye sujud as-sahw kabla ya salam - usikae chini.",
      },
      {
        title: "14. Tashahhud ya mwisho",
        body: "Katika kikao cha mwisho cha kila sala, soma At-Tahiyyat ile ile iliyoonyeshwa hapo juu. Kuketi kwa tashahhud ya mwisho, na kuisoma, ni nguzo ya swala.",
      },
      {
        title: "15. Mswalie Mtume (Swalla Allaahu ´alayhi wa sallam)",
        body: "Baada ya At-Tahiyyat ya mwisho, mswalie Mtume ﷺ kwa maneno ambayo yeye mwenyewe aliwafundisha Maswahaba zake.",
        translation:
          "Ewe Mwenyezi Mungu mrehemu Muhammad na Aali Muhammad kama ulivyombariki Ibrahim na ukoo wa Ibrahim. Hakika Wewe ni Msifiwa, Mtukufu. Ewe Mwenyezi Mungu mrehemu Muhammad na Aali Muhammad kama ulivyo mneemesha Ibrahim na ukoo wa Ibrahim. Hakika Wewe ni Msifiwa, Mtukufu.",
        tip: "Shule za Shafi'i na Hanbali zinazingatia swalawat katika kikao cha mwisho kuwa ni wajibu.",
      },
      {
        title: "16. Dua kabla ya salamu",
        body: "Kabla ya kumalizika, jikinge kwa Mwenyezi Mungu kutokana na mitihani minne - kisha omba dua yoyote unayoitaka katika maisha ya dunia na yajayo kwa Kiarabu au kwa lugha yako.",
        translation:
          "Ewe Mwenyezi Mungu, najikinga Kwako na adhabu ya kaburi, na adhabu ya Jahannam, na mtihani wa maisha na mauti, na shari ya mtihani wa Masihi wa Uongo (Dajjal).",
      },
      {
        title: "17. Kufunga salamu (Taslim)",
        body: "Malizia Swalah kwa kugeuza uso kuliani, kisha kushoto, kutoa salamu za amani kila mara. Kwa salam sala imekamilika.",
        translation: "Amani na rehema za Mwenyezi Mungu ziwe juu yenu.",
        tip: "Taslim ya kwanza (kulia) ni nguzo; ya pili (kushoto) ni sunna katika baadhi ya shule.",
      },
    ],
    hadith: [
      {
        excerpt: "Omba kama ulivyoniona nikiomba. (Malik bin al-Huwayrith)",
      },
      {
        excerpt:
          "“Rudini na mswali, kwani hamjaswali” — akarudia mara tatu — kisha akafundisha: Semeni takbira, soma muwezavyo katika Qur’ani, kisha rukuuni mpaka mpate kutulia, inuka mpaka usimame sawa, sujudu mpaka upate raha…",
      },
      {
        excerpt:
          "Hapana sala kwa asiyesoma Ufunguzi wa Kitabu. (Ubada ibn as-Samit; pia Sahih Muislamu 394)",
      },
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Kila nafasi",
    summary: "Jinsi ya kushikilia mwili wako kwa usahihi katika kila mkao wa maombi.",
    body: [
      "Kila mkao katika Swalah una umbile la mwili alilodhihirisha Mtume ﷺ na Maswahaba zake wamehifadhiwa. Kujifunza umbo sahihi hulinda maombi yako kutokana na makosa ya kawaida ya kimwili na husaidia mwili kuunga mkono unyenyekevu wa moyo badala ya kuukengeusha.",
      "Ukaribu wa sijda unastahiki uangalizi maalum: Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) amesema: 'Mja anayekaribia sana kwa Mola wake ni pale anaposujudu, basi omba dua nyingi.' Kusujudu kwa utulivu na ikhlasi ni miongoni mwa nyakati zenye nguvu sana katika siku za Muumini.",
    ],
    steps: [
      {
        title: "Kusimama (qiyam)",
        body: "Mimea iliyo wima, yenye upana wa takribani mabega, uzito uliosawazishwa, tazama mahali pa sujud, mkono wa kulia juu ya kushoto kwenye kifua.",
      },
      {
        title: "Kuinua mikono (raf' al-yadayn)",
        body: "Viganja vinavyoelekea Qibla, vilivyo sawa na mabega au ncha za masikio - kwenye takbira ya ufunguzi, na (kwa wengi) pia kuingia na kuinuka kutoka kwenye rukuu.",
      },
      {
        title: "Kuinama (ruku)",
        body: "Nyuma ya gorofa na ngazi, kichwa hakikuinuliwa wala kushuka, vidole vinaenea vikishika magoti, mikono imefungwa mbali na pande.",
      },
      {
        title: "Kusujudu (sujud)",
        body: "Paji la uso na pua chini, viganja vikiwa vimetanda karibu na mabega au masikio, viwiko vilivyoinuliwa na kutoka sakafuni, magoti chini, vidole vya miguu vikielekezwa kibla.",
      },
      {
        title: "Kuketi (iftirash)",
        body: "Baina ya sijda mbili na katika tashahhud ya kwanza: keti kwa mguu wa kushoto uliolazwa na mguu wa kulia umenyooka, mikono juu ya mapaja.",
      },
      {
        title: "Kikao cha mwisho (tawarruk)",
        body: "Katika tashahhud ya mwisho ya sala ya rakaa 3 au 4 (sunna ya shule za Shafii na Hanbali): pitisha mguu wa kushoto chini ya mguu wa kulia na ukae chini.",
      },
      {
        title: "Kugeuza kichwa kwa salam (taslim)",
        body: "Geuza uso kikamilifu upande wa kulia, kisha upande wa kushoto, kwa maneno ya amani - kumalizia sala huku ukisalimiana na malaika kwenye kila bega.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mja anayekaribia sana kwa Mola wake Mlezi ni pale anaposujudu, basi omba dua nyingi. (Abu Hurayrah)",
      },
    ],
    disclaimer:
      "Tofauti ndogo katika uwekaji wa mikono, namna ya kukaa, na kuinua mikono yote yanatokana na ripoti za kweli; kila shule inafuata simulizi halali. Hakuna anayebatilisha maombi ya mwingine.",
  },
  {
    title: "Makosa ya kawaida",
    summary: "Makosa ambayo yanadhoofisha maombi kimya kimya - na jinsi ya kusahihisha kila moja.",
    body: [
      "Makosa mengi katika maombi sio dhambi za moyo bali ni tabia za haraka na kutozingatia. Kuzitaja ni hatua ya kwanza ya kuzirekebisha; Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) aliisahihisha sala ya Swahaba kwa subira na moja kwa moja, jambo ambalo linatufundisha kwamba makosa haya ni ya kawaida na yanaweza kurekebishwa.",
      "Kaburi linakimbia - kupekua rukuu na sujudi bila utulivu. Tuma'ninah ni nguzo ya swala kwa wanavyuoni walio wengi, hivyo swalah ya haraka sio tu kutokuwa kamilifu bali inaweza kuwa batili. Fanya kazi kupitia orodha iliyo hapa chini ya tabia moja kwa wakati.",
    ],
    steps: [
      {
        title: "Kuomba haraka sana",
        body: "Kusimama kwa shida katika rukuu au sujud. Baki hadi mwili wako utulie na unaweza kusema dhikr angalau mara tatu bila haraka.",
      },
      {
        title: "Udhu usiokamilika",
        body: "Kavu mabaka kwenye visigino, vifundoni, viwiko, au kati ya vidole. Mtume (Swalla Allaahu ´alayhi wa sallam) alionya: ‘Ole wako visigino kutoka kwa Moto. Osha polepole na vizuri.",
      },
      {
        title: "Imepinda nyuma katika rukuu, ikizama katika sujud",
        body: "Kuinama kwa mgongo wa mviringo, au kupumzika kwa paji la uso bila pua, au kuruhusu mikono ya mikono kulala gorofa kwenye sakafu. Weka kiwango cha nyuma na viwiko vilivyoinuliwa.",
      },
      {
        title: "Macho na moyo unaozunguka",
        body: "Kuangalia kote, au kuangalia simu. Kaza macho mahali pa sujud na ukimya au uondoe simu yako kabla ya takbir.",
      },
      {
        title: "Mbio mbele ya imamu",
        body: "Katika mkusanyiko, kuhamia katika rukuu au sujudi mbele ya imamu. Kumfuata - kamwe kumtangulia - kusonga tu baada ya yeye kufanya.",
      },
      {
        title: "Kuzungumza, kula, au kucheka",
        body: "Hotuba yoyote ya makusudi, kula, kunywa, au kicheko cha kusikika huvunja sala. Swalah ni mazungumzo na Mwenyezi Mungu peke yake.",
      },
      {
        title: "Kusoma Al-Fatihah kimakosa",
        body: "Kuruka maneno, au kufanya makosa ambayo yanabadilisha maana. Jifunze kwa herufi-kamilifu - sala nzima inategemea.",
      },
    ],
    actions: [
      "Sali sala moja leo kwa nusu kasi yako ya kawaida na utambue jinsi inavyohisi tofauti.",
      "Nyamazisha simu yako au uiache kwenye chumba kingine kabla ya kusema takbir ya ufunguzi.",
      "Uliza mtu mwenye ujuzi aangalie moja ya maombi yako na kurekebisha mikao yako.",
    ],
    appLinks: [{}],
  },
  {
    title: "Matendo ya Sunnah",
    summary: "Mtume ﷺ alipendekeza vitendo vinavyopamba na kuzidisha malipo ya swala.",
    body: [
      "Zaidi ya matendo ya faradhi, Mtume ﷺ aliweka mfano wa desturi nyingi zilizopendekezwa (sunan) karibu na swala. Hazitakiwi, hivyo kuacha moja hakubatilishi Swalah - lakini kila moja inakukurubisha kwa Mwenyezi Mungu, inapata malipo ya ziada, na kurekebisha mapungufu katika sala za faradhi.",
      "Swala kuu miongoni mwazo ni swala za kawaida za sunna (sunan rawatib) zinazoswaliwa kabla na baada ya fardhi: mbili kabla ya Alfajiri (ambazo Mtume ﷺ alizitukuza juu ya dunia nzima), nne kabla na mbili baada ya Dhuhr, mbili baada ya Maghrib, na mbili baada ya Isha - rakaa kumi na mbili ambazo malipo yake ni nyumba iliyojengwa Peponi.",
    ],
    actions: [
      "Tumia miswak (siwak) kabla ya wudhu na swala - Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) alikaribia kuifanya kuwa ni wajibu.",
      "Tembea msikitini kwa utulivu na mapema - kila hatua inainua daraja na kufuta dhambi.",
      "Linda rakaa kumi na mbili za sunna rawatib kwa nyumba ya ahadi Peponi.",
      "Ingieni msikitini kwa mguu wa kulia na ondokeni na kushoto kila mmoja na du'a yake.",
      "Soma adhkar imara baada ya kila sala - tazama Baada ya Swalah.",
    ],
    hadith: [
      {
        excerpt:
          "Lau si ningeuelemea ummah wangu, ningewaamrisha kutumia siwak kabla ya kila swala. (Abu Hurayrah; pia Sahih Muislamu 252)",
      },
      {
        excerpt:
          "Mwenye kuswali rakaa kumi na mbili za hiari mchana na usiku, atajengewa nyumba Peponi. (Ummu Habibah)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Khushu - uwepo wa moyo",
    summary: "Lengo la safari nzima: kuomba kana kwamba unamuona Mwenyezi Mungu.",
    body: [
      "Khushu ni unyenyekevu, umakini, na utambuzi kwamba kweli umesimama mbele ya Mwenyezi Mungu. Ndiyo inayogeuza harakati za kimwili za maombi kuwa ibada halisi. Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) amefafanua ubora (ihsan) kuwa ni 'kumuabudu Mwenyezi Mungu kana kwamba unamuona, kwani ingawa humuoni, hakika Yeye anakuona' - na hakuna mahali popote panapofanyika jambo hilo moja kwa moja zaidi kuliko swalah.",
      "Mwenyezi Mungu alifungua maelezo ya waumini waliofaulu kwa hayo: 'wale ambao ni wanyenyekevu katika sala zao' (23:1-2). Na akatahadharisha vikali kinyume chake - 'ole wao wanaoswali, lakini wakaghafilika na maombi yao' - karipio linalowalenga wale ambao miili yao inatembea na hali nyoyo zao hazipo.",
      "Khushu imejengwa, haitakiwi. Jifunze maana ya kile unachokariri ili maneno yakuguse. Ondoa visumbufu kabla ya takbir. Punguza polepole na upe kila mkao utulivu wake. Tafakari juu ya ukuu wa Yule unayezungumza naye na ukweli kwamba sala hii inaweza kuwa ya mwisho kwako. Sali kila Swalah kama Swalah ya kuaga, kama Mtume ﷺ alivyousia.",
      "Usikatishwe tamaa na mawazo ya kutangatanga - hata Maswahabah walipigana nayo. Mapambano ya kurudisha umakini wako, tena na tena, yenyewe ni sehemu ya ibada. Khushu hukua katika maisha yote; uthabiti ndio unaoikuza.",
    ],
    quran: [
      {
        excerpt: "Hakika wamefaulu Waumini ambao ni wanyenyekevu katika Sala zao.",
      },
      {
        excerpt: "Basi ole wao wanaoswali - wale wanaoghafilika na maombi yao.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ihsan ni kumwabudu Mwenyezi Mungu kana kwamba unamuona, kwani ijapokuwa humuoni, hakika Yeye anakuona. (Hadithi ya Jibril, Umar)",
      },
    ],
    actions: [
      "Soma maana ya kifungu kimoja kutoka kwa Maneno ya Sala kabla ya kila sala wiki hii.",
      "Sitisha kwa sekunde tatu bila haraka katika kila mkao kabla ya kusonga mbele.",
      "Zingatia kiwango chako cha umakini katika jarida baada ya Swala na utazame muundo ukibadilika.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nguzo & batili",
    summary: "Ni nini sala haiwezi kuwepo bila - na ni nini kinachoifuta.",
    body: [
      "Matendo ya swala yanaanguka katika safu tatu. Nguzo (arkan) ni sehemu muhimu: kuacha mtu kwa makusudi kunabatilisha Swalah, na kuacha moja kwa kusahau ni lazima kusahihishwa kwa kurejea kwake. Matendo ya faradhi (wajibat) yanatakiwa, lakini yakisahauliwa yanarekebishwa kwa sijda ya kusahau (sujud al-sahw). Sunnah hukamilisha na kuipamba Swalah, na kuziacha hakuna adhabu.",
      "Kujua daraja hili hukulinda kutokana na mambo mawili yaliyokithiri: kuchukulia kutokufanya jambo dogo kama uharibifu, au kutibu nguzo halisi kama hiari. When in doubt about a pillar, the prayer is not sound until it is fulfilled.",
      "Kando, mambo fulani hubatilisha swala pale inapotokea - kwa sababu yanapingana na hali ya maombi yenyewe. Wengine hubatilisha wudhu, ambayo nayo humaliza swala. Jilinde na yote mawili ili usiwahi kuswali katika hali ya batili bila kujua.",
    ],
    steps: [
      {
        title: "Nguzo (arkan)",
        body: "Kusimama inapowezekana, takbira ya ufunguzi, kusoma Al-Fatihah, rukuu, kuinuka kutoka humo, sijda mbili, kukaa baina yake, kikao cha mwisho, tashahhud, salam, tuma'ninah katika kila moja, na kuweka mpangilio sahihi.",
      },
      {
        title: "Vitendo vya lazima (wajibat)",
        body: "Kama vile takbira zingine, maneno ya dhikr katika rukuu na sujud, na tashahhud ya kwanza - iliyorekebishwa na sujud al-sahw ikiwa imesahauliwa (kwa maelezo ya Hanbali; shule zinatofautiana).",
      },
      {
        title: "Vibatilishi vya wudhu",
        body: "Chochote kinachotoka kwenye njia za mbele au za nyuma, usingizi mzito, kupoteza fahamu - na, na baadhi ya wasomi, kugusa moja kwa moja sehemu za siri. Yoyote kati ya haya humaliza sala.",
      },
      {
        title: "Wanabatilisha swala yenyewe",
        body: "Hotuba ya kukusudia, kula au kunywa kwa kukusudia, harakati nyingi zisizo za lazima, kucheka kwa sauti, kugeuza kifua kwa makusudi kutoka kwenye kibla, na kufunua awrah.",
      },
    ],
    appLinks: [{}],
    disclaimer:
      "Shule nne zinaainisha baadhi ya vitendo kwa njia tofauti - kwa mfano kama tashahhud ya kwanza ni wajib au sunna, au orodha kamili ya kile kinachohitaji sujud al-sahw. Jifunze maelezo ya shule yako kutoka kwa mwalimu aliyehitimu.",
  },
  {
    title: "Sujud al-Sahw - kurekebisha makosa",
    summary: "Sijda ya kusahau yenye kurekebisha huteleza katika swala.",
    body: [
      "Hakuna asiyeweza kusahau katika Swalah - hata Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) alisahau, kisha akafundisha: Mimi ni binadamu kama nyinyi; Mimi husahau kama wewe unavyosahau, hivyo ninaposahau, nikumbushe.' Kutokana na mfano wake mwenyewe kunakuja dawa iliyojengewa ndani: sijda mbili za ziada, zinazoitwa sujud al-sahw (sujudu ya kusahau), ambazo huweka makosa madogo ili swalah isirudiwe.",
      "Inaitwa katika hali tatu pana: kuongeza (kuswali rakaa ya ziada au mkao kwa kukosea), kuacha (kuacha wajib kama vile tashahhud ya kwanza), au shaka (kutokuwa na uhakika umeswali rakaa ngapi). Haihitajiki kwa kuacha sunna, wala kwa makosa ya makusudi - hao wana hukumu zao.",
      "Unapokuwa na shaka ya kweli, kanuni inayoongoza ni: ondoeni shaka, jengani juu ya yale mnayo yakini nayo (idadi ndogo), timizeni Sala, kisha sijida mbili. Hii inageuza mkanganyiko kuwa sala iliyotulia, halali badala ya nadhani ya wasiwasi.",
      "Kiutendaji: fanya sijda mbili sawa na sujud yako ya kawaida, kwa takbira kabla na baada, kisha salam. Wanachuoni wanakhitalifiana kuhusu kuja kabla au baada ya salamu kutegemeana na aina ya upotovu - zote mbili zimepokelewa kwa usahihi, kwa hivyo ama inakubalika na wala haibatilishi swala.",
    ],
    hadith: [
      {
        excerpt:
          "Ikiwa mmoja wenu hana yakini katika swala yake na hajui ni ngapi aliswali - tatu au nne - basi aondoe shaka, na ajenge juu ya yale aliyo yakini nayo, kisha asujudu mara mbili kabla ya salamu. (Abu Said al-Khudri)",
      },
      {
        excerpt:
          "Anapotia shaka mmoja wenu katika swala yake, na atafute yaliyo sawa na akamilishe juu yake, kisha atoe salamu na asujudu mara mbili. (Ibn Mas’ud; pia Sahih Muislamu 572)",
      },
    ],
    actions: [
      "Kariri sheria kwa shaka: jenga juu ya nambari ndogo, maliza, kisha sujudu mara mbili.",
      "Ikiwa unatambua katikati ya sala uliacha tashahhud ya kwanza, endelea na ufanye sujud al-sahw mwishoni.",
    ],
    appLinks: [{}],
    disclaimer:
      "Iwapo sijda mbili zinaanguka kabla au baada ya salamu inategemea na makosa, na shule zinatofautiana. Yote mawili yanatokana na sunnah; usiruhusu kutokuwa na hakika hapa kukuzuie kuomba.",
  },
  {
    title: "Aina za Swala",
    summary: "Fard, sunna, witr, na sala za hiari ambazo huboresha siku ya muumini.",
    body: [
      "Maombi yanapangwa kwa faradhi. Swala tano za kila siku ni fard - faradhi kali kwa kila Muislamu anayewajibika. Kando na nje yao kuna ulimwengu tajiri wa maombi ya hiari ambayo kwayo Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) alijikurubisha zaidi kwa Mwenyezi Mungu, na kupitia kwayo sisi tunaweza pia.",
      "Swalah za hiari zina umuhimu kwa sababu mbili: ni vitendo vipendwa vinavyopandisha daraja ya Muumini - Mwenyezi Mungu anasema juu ya ibada ya ziada, 'Mja Wangu huendelea kujikurubisha Kwangu kwa mambo ya khiyari mpaka nimpende' - na hutengeneza sala za faradhi, kwani upungufu wowote katika fardhi hukamilika kutokana na sala ya hiari ya mtu Siku ya Hukumu.",
    ],
    steps: [
      {
        title: "Fadhi tano za kila siku",
        body: "Fajr, Dhuhr, Asr, Maghrib, Isha - msingi wa lazima, usiotelekezwa kamwe.",
      },
      {
        title: "Sunnah rawatib",
        body: "Rakaa za kawaida za sunna kabla na baada ya fard - kumi na mbili kila siku hupata nyumba Peponi.",
      },
      {
        title: "Witr",
        body: "Swala yenye nambari isiyo ya kawaida baada ya Isha, muhuri wa sala ya usiku - sunna mu'akkadah kwa walio wengi, na wajib katika shule ya Hanafi.",
      },
      {
        title: "Tahajjud (qiyam al-layl)",
        body: "Sala ya usiku katika theluthi ya mwisho ya usiku - sala ya hiari iliyo bora zaidi, na tabia ya watu wema.",
      },
      {
        title: "Duha",
        body: "Swala ya katikati ya asubuhi (rakaa 2–8) — ni sadaka inayotozwa kwa kila kiungo cha mwili kila siku.",
      },
      {
        title: "Tarawih",
        body: "Swala ya usiku ya mkusanyiko wa Ramadhani - kuhuisha usiku wa mwezi uliobarikiwa.",
      },
      {
        title: "Eid mbili",
        body: "Rakaa mbili za Eid al-Fitr na Eid al-Adha, ikifuatiwa na khutba.",
      },
      {
        title: "Istikharah",
        body: "Swala ya rakaa mbili ya kuomba mwongozo wa Mwenyezi Mungu kabla ya kufanya uamuzi.",
      },
      {
        title: "Janazah",
        body: "Swala ya mazishi - wajibu wa jumuiya (fard kifayah) inayotolewa kwa kusimama, bila rukuu au sujud.",
      },
    ],
    hadith: [
      {
        excerpt: "Swala bora baada ya sala ya faradhi ni ile ya usiku. (Abu Hurayrah)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Juma'ah - Swalah ya Ijumaa",
    summary: "Wajibu wa kila wiki unaokusanya umma na kuchukua nafasi ya Dhuhr siku ya Ijumaa.",
    body: [
      "Jumu'ah ni swala ya jamaa inayofanyika kila baada ya adhuhuri kila Ijumaa, na ni faradhi mahususi, iliyoamrishwa kwa jina katika Qur'ani: 'Inapoitishwa wito wa kuswali siku ya Ijumaa, nendeni upesi kwenye dhikri ya Mwenyezi Mungu na acheni biashara.' Inajumuisha khutba (khutbah) katika sehemu mbili ikifuatiwa na rakaa mbili zinazoswaliwa kwa sauti nyuma ya imamu, na inachukua nafasi ya Dhuhr kwa wale wanaohudhuria.",
      "Ni wajibu binafsi (fard 'ayn) juu ya kila mtu huru, mtu mzima, mkazi, Muislamu mwenye uwezo. Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) amebainisha kuwa ni 'wajibu kwa kila Muislamu katika jamaa isipokuwa wanne: mtumwa, mwanamke, mtoto au mgonjwa.' Wanawake, wasafiri, na wagonjwa wamesamehewa na kuswali Dhuhr badala yake, ingawa wanaweza kuhudhuria wakitaka.",
      "Kupuuzwa kwake ni hatari kubwa: Mtume ﷺ alionya kwamba yeyote anayeacha Jumaa tatu kwa kughafilika, Mwenyezi Mungu hupiga muhuri moyo wake. Lakini thawabu zake ni kubwa vile vile - Ijumaa ni siku bora zaidi ya kuchomoza jua, na inashikilia saa ambayo du'a inajibiwa.",
      "Jitayarishe kwa ajili yake kama alivyofanya Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam): fanya ghusl, vaa nguo zako safi zilizo bora kabisa, toa manukato, nenda mapema, na usikilize khutbah kwa usikivu kwa ukimya (mazungumzo ya bure wakati wa hayo yanapoteza thawabu). Kusoma Surah al-Kahf siku ya Ijumaa huleta mwanga kati ya Ijumaa mbili.",
    ],
    quran: [
      {
        excerpt:
          "Enyi mlio amini, inapoitishwa sala siku ya Ijumaa, nendeni upesi kwenye dhikri ya Mwenyezi Mungu na acheni biashara. Hayo ni bora kwenu ikiwa mnajua.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Swala ya Ijumaa katika jamaa ni wajibu kwa kila Muislamu, isipokuwa wanne: mtumwa, mwanamke, mtoto au mgonjwa. (Tariq bin Shihab)",
      },
      {
        excerpt:
          "Mwenye kuacha Swalah tatu za Ijumaa kwa kughafilika, Mwenyezi Mungu atapiga muhuri juu ya moyo wake. (Abu al-Jaad; pia Abu Daawuud 1052, at-Tirmidhiy 500)",
      },
      {
        excerpt: "Ghusl siku ya Ijumaa ni wajibu kwa kila aliyebaleghe. (Abu Said al-Khudri)",
      },
    ],
    actions: [
      "Tengeneza ghusl, vaa nguo safi na manukato, na uwasili mapema - wahudhuriaji wa mapema zaidi hupata thawabu kubwa zaidi.",
      "Soma Surah al-Kahf wakati fulani siku ya Ijumaa kwa mwanga kati ya Ijumaa mbili.",
      "Kaa kimya kabisa na usikilize wakati wa khutbah; weka simu mbali.",
    ],
    appLinks: [{}],
    disclaimer:
      "Idadi ndogo ya wanaohudhuria, na kama ghusl ni wajibu au sunnah yenye nguvu, ni nukta za tofauti za kielimu. Fuata mazoezi ya kuaminika ya jumuiya yako ya karibu.",
  },
  {
    title: "Sala ya kusanyiko",
    summary: "Kuswali nyuma ya imamu - malipo yanazidishwa mara ishirini na saba.",
    body: [
      "Kuswali Swalah tano za kila siku kwa jamaa (jama'ah) kunasisitizwa sana, hasa kwa wanaume, na ni alama ya umma wa Kiislamu ulio hai. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) alifundisha kwamba Swalah ya jamaa ni thawabu kubwa mara ishirini na saba kuliko ile inayoswaliwa peke yake - ni kuzidisha hakuna juhudi za mtu binafsi zinazoweza kufanana.",
      "Kusanyiko linasimama kwa safu zilizonyooka, zisizo na mapengo, bega kwa bega, wakimfuata imamu kwa usahihi: unaanza kila harakati tu baada ya yeye kufanya, kamwe kabla yake, na kamwe kwa wakati huo huo. Kunyoosha safu yenyewe ni sehemu ya kukamilisha swala.",
      "Ukifika baada ya imamu kuanza (mchelewaji anaitwa masbuq), jiunge mara moja katika mkao wowote utakaomkuta - sehemu hiyo bado inahesabika kuwa ni kuswali naye. Anapotoa salamu ya mwisho, simama na ukamilishe rakaa ulizozikosa peke yako, kisha umalize.",
      "Jamaa sio tu msikitini: watu wawili wanaoswali pamoja wanaunda Jama'ah, kwa hivyo baba na mtoto wake, au marafiki wawili wanaosafiri, wanaweza kupata malipo yake. Wanawake wanaweza kuswali kwa jamaa na kuhudhuria msikiti ambako kuna vifaa vinavyofaa, ingawa sala zao za nyumbani pia hutuzwa sana.",
    ],
    hadith: [
      {
        excerpt:
          "Swalah ya jamaa ni daraja ishirini na saba yenye kustahiki zaidi kuliko sala inayoswaliwa peke yake. (Ibn Umar; pia Sahih Muislamu 650)",
      },
    ],
    quran: [
      {
        excerpt: "Na simamisheni Sala na toeni zaka na rukuu pamoja na wanao rukuu.",
      },
    ],
    actions: [
      "Sali angalau sala moja msikitini leo, au kusanya kaya yako kwa safu nyumbani.",
      "Jifunze cha kufanya kama mchelewaji: jiunge mara moja, kisha kamilisha rakaa zako ulizokosa baada ya salamu ya imamu.",
    ],
  },
  {
    title: "Kukosa (qada) sala",
    summary: "Kulipa kilichokosekana - mlango wa rehema ya Mwenyezi Mungu hukaa wazi.",
    body: [
      "Iwapo Swalah ya fardhi itakosekana - kwa kulala usingizi, kusahau, au (Mwenyezi Mungu atulinde) uzembe - faradhi haitoweka tu. Ni lazima itungwe (qada), na Mtume (Swalla Allaahu ´alayhi wa sallam) akaiweka wazi hukumu hiyo: “Mwenye kusahau Swalah au akalala kwayo, basi kafara yake ni kuswali anapokumbuka. Hakuna fidia nyingine isipokuwa kuiomba.",
      "Swala ya kujitengenezea inaswaliwa kwa namna ile ile ya asili: Dhuhr iliyokosa rakaa nne inaswaliwa rakaa nne hata kama utaimaliza usiku au ukiwa safarini. Mwenye kukosa swala kwa udhuru wa kweli (kama usingizi mzito) hana dhambi kwa kuchelewa; aliyeziacha kwa makusudi lazima azifanye pamoja na toba ya kweli na ya haraka.",
      "Wanachuoni wanahimiza kufanya maombi yaliyokosa mara moja na kwa utaratibu inapowezekana, bila ya kuwaruhusu kurundikana - kwa sababu mzigo unakua mzito kwa wakati na kuchelewa. Ikiwa idadi kubwa ilikosa kwa miaka mingi, ifikie kwa mpango halisi wa kila siku badala ya kukata tamaa; Mlango wa kurudi kwa Mwenyezi Mungu uko wazi daima.",
    ],
    hadith: [
      {
        excerpt:
          "Mwenye kusahau Swalah au akalala kwayo, kafara yake ni kuswali anapoikumbuka. (Anas; pia Sahih Muislamu 684)",
      },
    ],
    actions: [
      "Kadiria kwa uaminifu ni sala ngapi unadaiwa na uweke shabaha ya uhalisia ya kila siku.",
      "Ioanishe kila swala ya faradhi na swala moja ya kujitengenezea mpaka mlundikano uondoke.",
      "Kamwe usicheleweshe maombi ya sasa ili kuunda ya zamani - weka maombi ya leo kwa wakati.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Baada ya swalah",
    summary: "Adhkar na dua zinazofunga malipo ya kila sala.",
    body: [
      "Mtume ﷺ hakuwahi kuinuka ghafla kutoka kwenye swala. Alikuwa ameketi, akiomba msamaha wa Mwenyezi Mungu na kujishughulisha na ukumbusho - na alifundisha kwamba muda tu baada ya sala ya faradhi ni miongoni mwa nyakati ambazo du'a hujibiwa kwa urahisi zaidi. Kuondoka mara moja kunapoteza baadhi ya tunda kuu la maombi.",
      "Utaratibu uliowekwa wa baada ya swala ni rahisi na mzito: sema 'Astaghfirullah' mara tatu; kisha maneno ya tawhid na sifa; kisha 'SubhanAllah', 'Alhamdulillah', na 'Allahu Akbar' mara thelathini na tatu kila moja, wakipiga muhuri wa mia kwa 'La ilaha illallah…' - atakayefanya hivyo amesamehewa madhambi yake ingawa ni kama povu la bahari.",
      "Kusoma Ayat al-Kursi baada ya kila Swalah ya faradhi huondoa kifo tu baina ya mtu na Pepo kama alivyoahidi Mtume ﷺ. Ifuate kwa Quls tatu (Al-Ikhlas, Al-Falaq, An-Nas), na uongeze adhkar ya asubuhi baada ya Alfajiri na adhkar ya jioni baada ya Asr au Magharibi ambapo zinatumika.",
    ],
    hadith: [
      {
        excerpt:
          "Mwenye kumtakasa, kumhimidi, na kumtakasa Mwenyezi Mungu mara thelathini na tatu kila baada ya kila swala… na akakamilisha mia kwa maneno ya tawhid, dhambi zake husamehewa ingawa ni kama povu la bahari. (Abu Hurayrah)",
      },
      {
        excerpt:
          "Mwenye kusoma Ayat al-Kursi baada ya kila swalah, hakuna kinachosimama baina yake na kuingia Peponi isipokuwa kifo. (Abu Umamah; Sahih iliyowekwa daraja na al-Albani)",
      },
    ],
    actions: [
      "Kariri tasbih ya baada ya swala (33 / 33 / 33 + tahlil) wiki hii.",
      "Soma Ayat al-Kursi na Quls tatu kabla ya kusimama.",
      "Kaa ukiwa umeketi kwa dakika moja ya du'a ya kibinafsi baada ya kila sala ya fardhi.",
    ],
    appLinks: [{}, {}],
  },
];

export const SALAH_GUIDE_PHRASES_SW: DeepPartial<SalahGuidePhrase>[] = [
  {
    title: "Baada ya kumaliza wudhu",
    when: "Mara tu baada ya kumaliza kutawadha, kabla ya swalah.",
    translation:
      "Nashuhudia ya kwamba hapana mungu ila Mwenyezi Mungu peke yake, hana mshirika, na nashuhudia kwamba Muhammad ni mja na Mtume wake.",
    meaning:
      "Kufanya upya ushuhuda wa imani huku mwili wako ukiwa umetakaswa upya. Mtume (Swalla Allaahu ´alayhi wa sallam) aliahidi kwamba yeyote atakayesema hivyo baada ya udhu, hufunguliwa milango minane ya Pepo ili aingie kwa apendavyo.",
  },
  {
    title: "Takbirat al-Ihram",
    when: "Mwanzoni mwa sala, na wakati wa kusonga kati ya nafasi.",
    translation: "Mwenyezi Mungu ndiye Mkubwa.",
    meaning:
      "Swala inaanzia hapa - 'al-ihram' maana yake inaharamisha juu yako mambo ya dunia (kuzungumza, kula, kukengeuka). Mnamtangaza Mwenyezi Mungu kuwa ni mkubwa kuliko chochote kinachoweza kukushughulishani, na mnaingia kwa ukamilifu mbele yake. Kila takbir inayofuata husasisha kujisalimisha.",
  },
  {
    title: "Du'a al-Istiftah (dua ya kufungua)",
    when: "Kimya kimya baada ya takbir ya ufunguzi, kabla ya Al-Fatihah.",
    translation:
      "Utukufu ni Wako, Ewe Mwenyezi Mungu, na sifa njema. Jina lako limebarikiwa na utukufu wako umetukuka. Hapana mungu ila Wewe.",
    meaning:
      "Unafungua mazungumzo kwa kumtakasa na kumhimidi Mwenyezi Mungu na kuthibitisha upweke Wake, ukitulia moyoni kabla ya kusoma maneno Yake. Dua nyingi za ufunguaji mlango zipo - hii ni mojawapo ya maombi yanayotumika sana.",
  },
  {
    title: "Surah Al-Fatihah",
    when: "Kusimama katika kila rakaa - nguzo ambayo bila hiyo rakaa ni batili.",
    translation:
      "Kwa jina la Mwenyezi Mungu, Mwingi wa Rehema, Mwenye kurehemu. Sifa njema zote anastahiki Mwenyezi Mungu, Mola Mlezi wa walimwengu wote, Mwingi wa Rehema, Mwenye kurehemu na Mwenye kurehemu, Mfalme wa Siku ya Malipo. Wewe tunakuabudu na Wewe tunakuomba msaada. Tuongoze kwenye njia iliyonyooka, njia ya wale ulioneemesha, si ya walioghadhibikiwa au waliopotea.",
    meaning:
      "Mama wa Kitabu: nusu ya sifa za Mwenyezi Mungu, na nusu ya kusihi kwa uongofu, na ni bawaba baina ya wewe tunakuabudu. Mwenyezi Mungu amesema ameigawa sura hii baina yake na mja wake - unaposoma kila mstari, Yeye anajibu. Mtume ﷺ amesema hakuna swala kwa asiyeisoma.",
  },
  {
    title: "Dhikr katika rukuu",
    when: "Wakati akiinama, na gorofa, makazi nyuma.",
    translation: "Utukufu ni wa Mola wangu Mlezi, Mtukufu.",
    meaning:
      "Kurukuu ni mkao wa uchaji Mungu, basi unatukuza utukufu wa Mwenyezi Mungu - alisema mara tatu au zaidi bila haraka. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) amefundisha kwamba katika rukuu tunamtukuza Mola, basi tumainia kujibiwa dua yako.",
  },
  {
    title: "Kupanda kutoka ruku",
    when: "Kusimama wima kabisa baada ya kuinama.",
    translation: "Mwenyezi Mungu humsikia anayemhimidi. Mola wetu Mlezi, sifa njema zote ni Zako.",
    meaning:
      "Mnathibitisha kwamba hakika Mwenyezi Mungu humsikia anayemhimidi, kisha mrudishe sifa njema. Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) amesema kwamba Imamu anaposema hivi na watu wakajibu, basi yeyote ambaye maneno yake yanalingana na ya Malaika husamehewa madhambi yao yaliyopita.",
  },
  {
    title: "Dhikr katika sujud",
    when: "Katika kusujudu - nafasi iliyo karibu zaidi na Mwenyezi Mungu.",
    translation: "Utukufu ni wa Mola wangu Mlezi aliye juu.",
    meaning:
      "Katika hatua ya chini kabisa ya kimwili unamtukuza Aliye Juu Zaidi - kitendawili katika moyo wa ibada. Mtume (Swalla Allaahu ´alayhi wa sallam) amesema mja yuko karibu zaidi na Mola wake wakati anasujudu, basi mimina dua hapa baada ya dhikri.",
  },
  {
    title: "Baina ya sijda mbili",
    when: "Kukaa kwa utulivu baina ya sujud ya kwanza na ya pili ya kila rakaa.",
    translation: "Mola wangu Mlezi, nisamehe. Mola wangu Mlezi, nisamehe.",
    meaning:
      "Ombi fupi lakini la moja kwa moja la msamaha katika kila rakaa - ukumbusho kwamba hata katikati ya sala tunahitaji msamaha wa Mwenyezi Mungu. Keti mpaka utulie kabla ya sijda ya pili.",
  },
  {
    title: "At-Tahiyyat (Tashahhud)",
    when: "Katika kikao cha kati na kikao cha mwisho cha swalah.",
    translation:
      "Salamu zote, sala na maneno safi ni ya Mwenyezi Mungu. Amani iwe juu yako, ewe Mtume, na rehema ya Mwenyezi Mungu na baraka zake. Amani iwe juu yetu na juu ya waja wema wa Mwenyezi Mungu. Nashuhudia ya kwamba hapana mungu ila Mwenyezi Mungu, na nashuhudia kwamba Muhammad ni mja na Mtume wake.",
    meaning:
      "Moyo uliokaa wa Swalah: nyinyi mnamuabudu Mwenyezi Mungu peke yake kila aina ya ibada, mswalieni Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) na watu wema, na mrudishe ushahidi mbili. Ibn Mas'ud alijifunza kutoka kwa Mtume ﷺ neno kwa neno, kama mtu anajifunza surah.",
  },
  {
    title: "Salawat Ibrahimiyyah",
    when: "Katika tashahhud ya mwisho, baada ya At-Tahiyyat.",
    translation:
      "Ewe Mwenyezi Mungu mrehemu Muhammad na Aali Muhammad kama ulivyombariki Ibrahim na ukoo wa Ibrahim. Hakika Wewe ni Msifiwa, Mtukufu. Ewe Mwenyezi Mungu mrehemu Muhammad na Aali Muhammad kama ulivyo mneemesha Ibrahim na ukoo wa Ibrahim. Hakika Wewe ni Msifiwa, Mtukufu.",
    meaning:
      "Maswahaba walipouliza jinsi ya kutuma baraka juu yake, Mtume ﷺ aliwafundisha maneno haya hasa - salawat zilizothibitishwa zaidi katika Sunnah. Unamheshimu Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) kama alivyokuamrisha Mwenyezi Mungu, ukimaliza Sala yako kwa mapenzi kwa yule aliyekufundisha kuswali.",
  },
  {
    title: "Kutafuta hifadhi kabla ya salamu",
    when: "Baada ya tashahhud ya mwisho na salawat, kabla tu ya kumaliza sala.",
    translation:
      "Ewe Mwenyezi Mungu, najikinga Kwako na adhabu ya kaburi, na adhabu ya Jahannam, na mtihani wa maisha na mauti, na shari ya mtihani wa Masihi wa Uongo (Dajjal).",
    meaning:
      "Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) aliagiza kwamba baada ya tashahhud ya mwisho mtu ajikinge na hatari hizi nne kabla ya kutoa salam - dua ya mwisho ya swala inafunika maisha haya, kaburi, Moto na mtihani mkubwa zaidi ujao.",
  },
  {
    title: "Taslim (salaam ya mwisho)",
    when: "Kumaliza Swala - kugeuza uso kulia, kisha kushoto.",
    translation: "Amani na rehema za Mwenyezi Mungu ziwe juu yenu.",
    meaning:
      "Unaiacha Sala kama unavyowaacha watu wa hishimiwa - kwa maamkio ya amani kwa Malaika wakiandika katika kila bega na kwa wanaoswali karibu nawe. Salamu ni nguzo; kwayo sala imekamilika.",
  },
];
