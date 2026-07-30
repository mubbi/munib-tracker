// Swahili translation overlay for the Learn "Journey to Jannah" content. Mirrors the order of
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

export const JANNAH_TOPICS_SW: DeepPartial<JannahTopic>[] = [
  {
    title: "Jannah ni nini?",
    summary: "Pepo ya milele Mwenyezi Mungu ameitayarisha kwa ajili ya watu wema.",
    body: [
      "Jannah (Pepo) ni nyumba ya malipo ya milele ambayo Mwenyezi Mungu amewaandalia wale wanaomuamini na wakatenda mema. Neno hili kihalisi lina maana ya bustani iliyositawi, yenye kivuli - lakini Qur'ani inaitumia kwa uhalisi mkubwa zaidi kuliko bustani yoyote duniani: eneo la mito, matunda, majumba ya kifahari, na usuhuba ambapo muumini huishi milele kwa radhi za Mola wake. Ni lengo ambalo kila nabii aliwaita watu kuelekea na marudio ya safari hii yote.",
      "Maisha ya Jannah hayafanani na chochote katika dunia hii kwa sababu haina kila dosari inayoharibu furaha ya dunia. Hakuna kifo, hakuna ugonjwa, hakuna kuzeeka, hakuna woga, hakuna huzuni, hakuna uchovu. Watu wake hawabishani kamwe, hawachoki, na hawapotezi wanachopenda. Chochote unachotaka moyo hupewa, na Mwenyezi Mungu huongeza zaidi katika ukarimu wake - 'Watapata humo wanayoyataka, na sisi tuko zaidi' (Qur'ani 50:35).",
      "Starehe za Pepo ni zaidi ya mawazo ya mwanadamu. Katika hadithi qudsi, Mwenyezi Mungu anasema amewaandalia waja wake wema kile ambacho jicho halijapata kuona, sikio halijapata kusikia, na hakuna moyo uliowahi kushika mimba. Ndiyo maana Qur'ani inaielezea Pepo kwa taswira zilizozoeleka - bustani, mito na vivuli - huku ikitukumbusha kuwa ukweli ni mkubwa kuliko maelezo yoyote. Malipo makubwa kuliko yote sio mabustani yenyewe bali ni radhi ya Mwenyezi Mungu na, kwa daraja za juu, heshima ya kuutazama Uso Wake mtukufu.",
      "Muumini anapaswa kushikilia kweli mbili pamoja. Kwanza, Pepo ni ya kweli, karibu, na yenye thamani ya kila juhudi - Qur'ani inatuambia 'tukimbilie' (Qur'ani 3:133). Pili, hakuna anayeipata Pepo kwa matendo peke yake; kuingia ni hatimaye kwa rehema ya Mwenyezi Mungu, huku imani ya kweli na matendo mema yakiwa ndiyo njia aliyochagua kuikubali. Mizani hii huweka matumaini hai bila kuzaliana kiburi: tunajitahidi kadiri tuwezavyo, kisha tunajitupa juu ya rehema zake.",
      "Kwa kweli, acha ukweli wa Jannah utengeneze maamuzi yako ya kila siku. Wakati ibada inahisi nzito au jaribu linahisi kuwa na nguvu, kumbuka ni nini kinachongojea na kile kilicho hatarini. Mwombe Mwenyezi Mungu Pepo mara kwa mara, ifanyie kazi mara kwa mara kwa njia ndogo zenye kudumu, na acha kuitamani kulainisha moyo wako katika maisha haya ya kupita.",
    ],
    quran: [
      {
        excerpt:
          "Kimbilieni maghfira kutoka kwa Mola wenu Mlezi na Pepo ambayo upana wake ni mbingu na ardhi, iliyo andaliwa kwa ajili ya watu wema.",
      },
      {
        excerpt:
          "Mwenyezi Mungu amewaahidi Waumini wanaume na Waumini wanawake Bustani zipitazo mito kati yake, watakaa humo milele, na makazi mazuri katika Bustani za kudumu milele. Lakini radhi za Mwenyezi Mungu ni kubwa zaidi.",
      },
      {
        excerpt:
          "Nafsi yoyote haijui waliyo fichiwa ni faraja kuwa ni malipo ya yale waliyokuwa wakiyatenda.",
      },
      {
        excerpt: "Humo watapata wanachokitaka, na sisi tuko zaidi.",
      },
      {
        excerpt: "Wale walio amini na wakatenda mema watapata Pepo za makimbilio kuwa makaribisho.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mwenyezi Mungu alisema: Nimewaandalia waja Wangu wema yale ambayo jicho halijaona, sikio lililosikia, na moyo haujafikiri.",
      },
      {
        excerpt:
          "Amesema Mwenyezi Mungu Mtukufu: Nimewaandalia waja Wangu wema ambayo jicho halijaona, sikio halijasikia, na moyo wa mwanadamu haujapata kutambua.",
      },
    ],
  },
  {
    title: "Vyeo Peponi",
    summary: "Paradiso ina digrii nyingi - sio ngazi ya kudumu ya saba.",
    body: [
      "Paradiso si sehemu moja tambarare; ina daraja nyingi, zinazoitwa darajat, na waumini wanainuliwa ndani yake kwa mujibu wa imani na matendo yao. Dhana potofu iliyozoeleka sana ni kwamba Jannah ina viwango saba haswa. Hii inachanganya mambo mawili tofauti: Qur'ani inazungumzia mbingu saba (samawat) - anga zilizoumbwa juu yetu - sio ngazi saba za kudumu za Pepo. Maandiko hayana mipaka ya Jannah kwa safu saba.",
      "Nini vyanzo vya kweli vinatuambia ni kwamba safu ni nyingi na kubwa. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) amesema Pepo ina viwango mia moja vilivyoandaliwa kwa ajili ya wale wanaopigania njia ya Mwenyezi Mungu, na kwamba masafa baina ya daraja moja na daraja la pili ni kama umbali baina ya mbingu na ardhi. Hata nambari hii inaashiria ukubwa badala ya ngazi ngumu tunaweza kupanda kwa kuweka alama kwenye masanduku.",
      "Mwenyezi Mungu humnyanyua kila Muumini kwa kadiri ya nguvu ya imani yao, unyoofu wa nia yao, na uzito wa matendo yao - 'Kwa wote kutakuwa na daraja kulingana na waliyoyafanya' (Qur'ani 6:132). Cheo halisi anachofikia kila mtu anajulikana kwa Mwenyezi Mungu peke yake. Ufunuo kwa makusudi hautupi orodha ya kukagua kimawazo ya 'fanya tendo X ili kufikia kiwango cha N,' kwa sababu ibada inakusudiwa kuendeshwa na upendo na uaminifu, si kwa kuhesabu vyeo.",
      "Hekima katika hili ni nzuri. Ikiwa tungejua mahali tulipoweka, wengine wangeridhika na wengine wangekata tamaa. Badala yake, tunafundishwa kuweka macho yetu kwa Mwenyezi Mungu, kuendelea kujitahidi, na kuendelea kutumaini. Muumini hushindana katika wema - 'kwa hili wacha washindani washindane' - huku akiacha alama ya mwisho kwa Mwenye Haki Zaidi.",
      "Kwa hivyo badala ya kulenga kiwango cha kuhesabiwa, lenga juu kabisa na umruhusu Mwenyezi Mungu akuweke pale anapopenda. Mtume (Swalla Allaahu ´alayhi wa sallam) aliwafundisha maswahaba kutokubali ombi la kawaida bali waombe hasa Al-Firdaws, kilele cha Pepo.",
    ],
    quran: [
      {
        excerpt: "Kwa wote kutakuwa na digrii kulingana na walivyofanya.",
      },
      {
        excerpt:
          "Tazama jinsi tulivyo wafadhilisha baadhi yao kuliko wengine - na Akhera ni kubwa zaidi kwa daraja na kupambanua zaidi.",
      },
      {
        excerpt:
          "Na mwenye kumtii Mwenyezi Mungu na Mtume, basi watakuwa pamoja na wale alio waneemesha Mwenyezi Mungu: Manabii, na wakweli, na Mashahidi, na watu wema. Wao ni masahaba wazuri kama nini!",
      },
    ],
    hadith: [
      {
        excerpt:
          "Pepo ina viwango mia moja ambavyo Mwenyezi Mungu amewaandalia wale wanaopigana katika njia yake. Umbali kati ya kila ngazi mbili ni kama umbali kati ya mbingu na ardhi. Basi unapomuomba Mwenyezi Mungu, muombeni Al-Firdaws, kwani hiyo ndiyo sehemu bora na ya juu kabisa ya Pepo.",
      },
      {
        excerpt:
          "Mnapomuomba Mwenyezi Mungu, muombeni Al-Firdaws, kwani hiyo ni sehemu ya juu kabisa ya Pepo na katikati ya Pepo, na kutoka humo mito ya Peponi inapita, na juu yake ni Arshi ya Mwingi wa Rehema.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Al-Firdaws - ya juu zaidi",
    summary: "Kilele cha Pepo, kilicho karibu zaidi na Arshi.",
    body: [
      "Al-Firdaws ni kiwango cha juu na bora kabisa cha Pepo kilichotajwa katika Sunnah sahihi. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) ameielezea kuwa ni pepo iliyo bora kabisa na katikati yake - moyo wake kabisa - ambayo inatoka mito ya Peponi, na juu yake ni Arshi ya Mwingi wa Rehema. Kumfikia Al-Firdaws ni kuwa karibu na Mwenyezi Mungu kama vile kiumbe chochote kinavyoweza kuwa.",
      "Kinachoifanya mada hii kuwa ya vitendo sana ni kipande cha mwongozo wa kinabii: tunapofanya du'a kwa ajili ya Pepo, hatupaswi kulenga chini. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) amewafundisha maswahaba kwamba wanapomuomba Allah Pepo, waombe makhsusi kwa ajili ya Al-Firdaws badala ya kuridhika na ombi dogo. Ukarimu wa Mwenyezi Mungu hauna kikomo, hivyo ni aina fulani ya upungufu kumuomba Yeye tu kwa uchache. Hili linatufundisha tamaa katika ibada: lenga kilele na mwache Mwenyezi Mungu, kwa rehema zake, aamue mahali pa kukuweka.",
      "Mtumishi anakuwaje mgombea wa cheo hicho? Njia ni njia zile zile zinazoongoza kwenye Pepo yenyewe, inayofuatiliwa kwa ubora: imani iliyo sawa (tawhiyd) iliyoshikiliwa kwa ikhlasi, utimilifu wa makini wa faradhi alizoziamrisha Mwenyezi Mungu, na kisha kukua kwa maisha ya ibada ya kujitolea juu yao - Sala ya usiku, saumu ya ziada, mawaidha, sadaka, na tabia njema. Katika Hadith qudsi mashuhuri, Mwenyezi Mungu anaeleza jinsi mja anavyoendelea kujikurubisha kupitia matendo ya hiari mpaka Mwenyezi Mungu atakapompenda.",
      "Bado zawadi ya mwisho na yenye uamuzi daima ni rehema ya Mwenyezi Mungu. Katika pumzi ile ile tunayoikusudia ya juu, tunakumbuka maneno ya Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam): \"Haingii Peponi kwa vitendo vyake peke yake - hata Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) mwenyewe - isipokuwa kwamba Mwenyezi Mungu humfunika kwa rehema zake. Huu ndio usawa kamili ambao muumini hupiga: kuongezeka kwa matumaini na tamaa upande mmoja, unyenyekevu wa dhati kwa upande mwingine.",
      "Basi ifanyeni Al-Firdaws kuwa ni sehemu ya dua zenu, katika kusujudu, katika theluthi ya mwisho ya usiku, na kabla ya kulala, nanyi mkifanya kila mwezavyo kwa utulivu kila siku, na mkiegemea kabisa rehema ya Mola wenu kwa ajili ya wengine.",
    ],
    hadith: [
      {
        excerpt:
          "Mnapomuomba Mwenyezi Mungu, muombeni Al-Firdaws, kwani hiyo ni sehemu ya juu kabisa ya Pepo na katikati ya Pepo, na kutoka humo mito ya Peponi inapita, na juu yake ni Arshi ya Mwingi wa Rehema.",
      },
      {
        excerpt:
          "Hataingia Peponi hata mmoja wenu kwa vitendo vyake peke yake. Wakasema: Hata wewe ewe Mtume wa Mwenyezi Mungu? Akasema: Hata mimi, isipokuwa Mwenyezi Mungu amenifunika rehema itokayo kwake.",
      },
    ],
    actions: [
      "Muombe Mwenyezi Mungu Al-Firdaws katika dua yako, haswa katika sujud na kabla ya kulala.",
      "Timizeni yaliyo wajibu juu yenu, basi zidisheni ibada ya kujitolea.",
      "Rudisha toba mara kwa mara na utegemee rehema ya Mwenyezi Mungu, na si kwa matendo yako pekee.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nini kinahatarisha Akhera",
    summary: "Dhambi kubwa zinahitaji toba ya kweli; Msamaha wa Mwenyezi Mungu ni mkubwa.",
    body: [
      "Sehemu hii haikusudiwi kukutisha katika kukata tamaa - kinyume kabisa. Mwenyezi Mungu humsamehe madhambi yote yule anayerejea kwake kwa ikhlasi, na analitangaza hili kwa maneno yenye nguvu zaidi: “Sema: Enyi waja wangu mliojidhulumu nafsi zenu, msikate tamaa na rehema ya Mwenyezi Mungu. Hakika Mwenyezi Mungu husamehe dhambi zote” (Qur’ani 39:53). Kusudi hapa ni kujua tu kile maandiko yanaonya dhidi yake, ili tutambue hatari na turudi kwake haraka kabla haijachelewa.",
      "Kuna dhambi moja inayojitenga na nyingine zote: Shirki - kumshirikisha Mwenyezi Mungu katika ibada. Hii ndiyo dhambi moja ambayo Mwenyezi Mungu hataisamehe ikiwa mtu atakufa juu yake bila ya kutubia, kama Anavyoeleza waziwazi katika Qur'ani 4:48. Kila kitu kingine kiko chini ya 'Yeye husamehe yaliyo duni kuliko hayo kwa amtakaye.' Ndiyo maana tawhiyd sahihi ni msingi chini ya kila amali iliyokubaliwa: nyumba iliyojengwa juu ya msingi uliopasuka haiwezi kusimama.",
      "Baada ya shirki, maandiko yanatoa uzito maalum wa kuacha swala. Kupuuza Swalah tano za kila siku, kwa mfululizo na bila udhuru, ni miongoni mwa maonyo makubwa katika Sunnah - Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) aliitaja Swala kuwa ni ahadi inayompambanua Muumini, kiasi kwamba kuiacha kunakaribia ukafiri. Madhambi mengine makubwa - kuua bila ya haki, mahusiano ya haramu, kula riba, kula mali ya yatima, na dhulma kali - ni mambo mazito yanayohitaji toba ya kweli na yanaweza kuleta adhabu ikiwa Mwenyezi Mungu hatasamehe.",
      "Dhambi zinazoitwa 'ndogo' pia ni muhimu, na hazipaswi kamwe kuchukuliwa kirahisi. Kusengenya, kusema uwongo, majivuno, kuvunja uhusiano wa kifamilia, na kutojali polepole huharibu moyo na tabia. Mtume ﷺ ameonya kwamba madhambi madogo yanayorundikana yanaweza kumuangamiza mtu kama vile vijiti vidogo vilivyokusanywa pamoja vinaweza kupika chakula kizima. Kila mmoja wao anahitaji marejeo yake kwa Mwenyezi Mungu.",
      "Uondoaji ni matumaini katika vitendo: kamwe usiruhusu ukubwa wa dhambi kukushawishi kwamba toba haina maana. Rejea kwa Mwenyezi Mungu pale unapoteleza, na fuata uovu kwa wema ili uufute, na uweke wazi mlango wa istighfar kila siku. Huruma yake daima ni kubwa kuliko kosa lako.",
    ],
    quran: [
      {
        excerpt:
          "Hakika Mwenyezi Mungu hasamehi ushirika naye, lakini husamehe yaliyo duni kuliko hayo kwa amtakaye.",
      },
      {
        excerpt:
          "Sema: Enyi waja wangu mliojidhulumu nafsi zao, msikate tamaa na rehema ya Mwenyezi Mungu. Hakika Mwenyezi Mungu husamehe dhambi zote.",
      },
    ],
    hadith: [
      {
        excerpt: "Agano baina yetu na wao ni Sala; mwenye kuiacha amekufuru.",
      },
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Orodha za madhambi makubwa katika fiqh hutofautiana kwa mwanachuoni, na hukumu za watu binafsi ni za watu waliohitimu. Huu ni ukumbusho wa jumla wa kutubu - sio uamuzi wa kibinafsi. Wasiliana na mwanachuoni mwaminifu kwa hali yako.",
  },
  {
    title: "Wale wanaoheshimiwa katika maandiko",
    summary: "Watu na makundi ya Mtume ﷺ aliyoyataja kuhusiana na Pepo.",
    body: [
      "Qur'ani Tukufu na Sunnah zinabainisha baadhi ya watu binafsi, makundi ya waumini, na matendo yanayofungamana na bishara ya Pepo. Ni muhimu kusoma haya kwa usahihi: ni ripoti za uaminifu kuhusu watu hao mahususi au maelezo - sio dhamana inayoweza kuhamishwa kwa mtu yeyote anayesikia tu majina yao au kuwavutia. Habari njema iliegemea juu ya imani yao na matendo yao, na mlango huo huo uko wazi kwetu kwa njia hiyo hiyo.",
      "Kundi mashuhuri zaidi ni Pepo Kumi Iliyoahidiwa (al-Asharah al-Mubashsharah), iliyotajwa pamoja na Mtume ﷺ katika riwaya moja: Abu Bakr, Umar, Uthman, Ali, Talhah, Zubayr, Abd al-Rahman ibn Awf, Sa'd ibn Abi Waqqas, Sa'id al-Jayd al-Ibn Ibn Ibn Abuu. (Mwenyezi Mungu awe radhi nao wote). Hawa ndio waliokuwa maswahaba wa Mtume ﷺ wa karibu na wa kutoa kafara zaidi, na Ahlul-Sunnah wanawapenda na kuwaheshimu wote bila ya kupita kiasi au kumdharau hata mmoja wao.",
      "Zaidi ya watu waliotajwa majina, maandiko yanaelezea makundi yaliyopewa bishara: wakweli na wenye subira, wale wanaokufa kama mashahidi wa kweli katika njia ya Mwenyezi Mungu kwa mujibu wa sheria ya Kiislamu, na wale ambao maneno yao ya mwisho katika maisha haya ni ushahidi wa imani, la ilaha illallah. Kila maelezo yanaelekeza kwenye uhalisi wa ndani - unyofu, dhabihu, au moyo unaoshikamana na Mwenyezi Mungu katika pumzi ya mwisho - sio tu lebo ya nje.",
      "Somo kwetu si kujisikia salama kwa ushirika, wala kujidai vyeo hivi sisi wenyewe, bali kuhamasishwa. Hebu mfano wao utuvute juu zaidi: tupende kile walichokipenda, jitahidi kadri walivyopigania, na ugeuze kusifiwa huko kuwa du'a na kitendo, tukimuomba Mwenyezi Mungu juu ya yote kwa ajili ya husn al-khatimah - mwisho mwema.",
    ],
    hadith: [
      {
        excerpt:
          "Abu Bakr yuko Peponi, Umar yuko Peponi, Uthman yuko Peponi, Ali yuko Peponi, Talha yuko Peponi, Zubeir yuko Peponi, Abd al-Rahman bin Awf yuko Peponi, Sa'd yuko Peponi, Said bin Zayd yuko Peponi, na Abu Ubaydah ibn al-Jarray yuko Peponi.",
      },
      {
        excerpt:
          "Yeyote ambaye maneno yake ya mwisho ni 'Hakuna mungu ila Mwenyezi Mungu' ataingia Peponi.",
      },
    ],
    disclaimer:
      "Habari njema katika Hadith inarejea kwa wale waliotajwa au kwenye kategoria zilizoelezwa. Hazibadilishi hitaji la imani ya mtu mwenyewe, matendo, na mwisho mwema. Mwenyezi Mungu ndiye Mjuzi zaidi.",
  },
  {
    title: "Tawhiyd - imani sahihi",
    summary: "Hakuna amali inayokubaliwa bila tauhidi ya kweli.",
    body: [
      "Tawhiyd maana yake ni kumpwekesha Mwenyezi Mungu peke yake kwa ajili ya ibada - kuamini kwamba Yeye pekee ndiye Mola na Muumba, kwamba Yeye pekee ndiye anayestahiki kuabudiwa, na kwamba Yeye ni wa kipekee katika majina na sifa Zake. Ndio ujumbe uleule ambao kila mtume alitumwa nao na jambo la kwanza mtu kuingia nalo katika Uislamu. Kwa sababu inahusu Yule tunayemuabudu, ni msingi ambao jengo zima la dini limesimama juu yake.",
      "Umuhimu wake hauwezekani kupindukia: Mwenyezi Mungu hakubali kitendo chochote kutoka kwa mtu anayemshirikisha. “Mkimshirikisha Mwenyezi Mungu bila shaka amali zenu zitaharibika” (Qur’ani 39:65). Mlima wa matendo mema uliojengwa juu ya shirki hauna uzito wowote Siku ya Kiyama, na amali ndogo kabisa iliyojengwa juu ya tawhidi safi inaweza kuwa nzito mno. Ndio maana kuchunga imani ni jambo la dharura zaidi kuliko kuzidisha vitendo vyake.",
      "Tawhiyd pia inadai unyoofu, unaoitwa ikhlas - kwamba tumwabudu Mwenyezi Mungu 'tukiwa na ikhlasi Kwake katika dini' (Qur'ani 98:5). Hatari ya hila hapa ni riya, kufanya vitendo vya ibada ili kuonekana na kusifiwa na watu. Mtume ﷺ alionya kwamba hata kujionyesha kwa siri kunaweza kuharibu kitendo kimya kimya. Dawa ni kuendelea kufanya upya nia: ninafanya hivi kwa ajili ya nani hasa? Unyoofu ndio unaogeuza kitendo cha kawaida kuwa kitendo chenye kuthaminiwa cha ibada.",
      "Hekima ya kuifanya tawhiyd kuwa msingi ni kuwa inaufungua moyo. Mwenye kumuabudu Mwenyezi Mungu peke yake amekombolewa na khofu ya viumbe, na kufukuzia ridhaa ya kila mtu, na kutoka katika uchovu wa kuwatumikia mabwana wengi. Maisha yake hupata mwelekeo mmoja ulio wazi: kumpendeza Yule aliyemuumba.",
      "Kwa hakika, jifunze imani sahihi kutoka kwa wanachuoni waaminifu, itakase ibada yako ya shirki na unafiki, na chunguza nia yako kabla ya kutenda. Hatua hii ya kwanza si ya hiari au ya juu - ni mahali ambapo kila njia ya Peponi inapoanzia.",
    ],
    quran: [
      {
        excerpt:
          "Imefunuliwa kwako na kwa walio kuwa kabla yako: Ikiwa utamshirikisha Mwenyezi Mungu, basi amali zako zitaharibika, na hakika utakuwa miongoni mwa walio khasiri.",
      },
      {
        excerpt: "Hawakuamrishwa isipokuwa kumwabudu Mwenyezi Mungu kwa kumsafishia Dini.",
      },
    ],
    hadith: [
      {
        excerpt: "Vitendo ni kwa nia, na kila mtu atakuwa na kile alichokusudia.",
      },
    ],
    actions: [
      "Jifunze misingi ya tawhiyd kutoka kwa wanachuoni waaminifu.",
      "Fanya upya nia yako kabla ya matendo ya ibada.",
      "Omba msamaha kwa kujionyesha kwa siri (riya).",
    ],
  },
  {
    title: "Swala - nguzo",
    summary: "Kuhifadhi Sala tano za kila siku ni miongoni mwa amali kubwa.",
    body: [
      "Swala - sala tano za kila siku - ni nguzo ya pili ya Uislamu na tendo kuu la ibada ya kila siku. Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) ameielezea swala kuwa ni nguzo ya Dini: Mwenye kuisimamisha anaisimamisha Dini, na anayeipuuza basi amebomoa mengi yaliyoishikilia. Ni miadi tano za kila siku za Muumini pamoja na Mola wake, kusimama, rukuu, na kusujudu kwa uhusiano wa moja kwa moja na Mwenyezi Mungu.",
      "Daraja yake hailingani na matendo ya kivitendo kwa sababu ya yale aliyoyasema Mtume (Swalla Allaahu ´alayhi wa sallam) kuhusu Siku ya Qiyaamah: jambo la kwanza kabisa atalohesabiwa mja ni swala. Ikiwa ni sawa, matendo yaliyosalia yatakuwa sawa; ikiwa ni pungufu, iliyobaki iko hatarini. Katika maisha haya pia, swala ni njia ya utakaso - Mtume (Swalla Allaahu ´alayhi wa sallam) alilinganisha Swalah tano na mto unaotiririka kwenye mlango wa mtu: anayeoga humo mara tano kwa siku hatokuwa na uchafu, na hivyo swala hizo huosha madhambi madogo.",
      "Lakini sala inakusudiwa kuwa zaidi ya mwendo wa kimwili. Qur'ani inawasifu 'wale ambao ni wanyenyekevu katika maombi yao' (Qur'ani 23:1–2) na inawaheshimu 'wale ambao wanadumu katika sala zao' (Qur'ani 70:22–23). Sifa mbili muhimu zaidi: khushu - moyo wa sasa, mnyenyekevu unaojua kuwa umesimama mbele ya Mwenyezi Mungu - na msimamo, unaolinda kila sala kwa wakati wake. Kuomba katika mkusanyiko, kwa wale wanaoweza, huzidisha thawabu mara nyingi.",
      "Hekima ya ndani zaidi ya swalah ni mabadiliko. Sala ikifanywa ipasavyo, humzuia mtu na mambo machafu na maovu; ni kurudia tena kurudia moyo kurudi kwa Mwenyezi Mungu katika siku yenye shughuli nyingi. Kwa hiyo kukosa Swalah bila ya udhuru ni jambo zito linalohitaji toba ya kweli na kuzifanya (qada). Nafl na rawatib - swala za sunna za kawaida kabla na baada ya faradhi - zinaongeza nuru zaidi na kupandisha daraja.",
      "Kivitendo: linda sala tano za kila siku kwa nyakati zake kama kipaumbele chako kabisa, fanya chochote ambacho umekosa, na ongeza sala za sunna unazoweza kudumisha. Ikiwa maombi yako yanaboreka, kila kitu kingine katika ibada yako huelekea kuboreka nacho.",
    ],
    quran: [
      {
        excerpt: "Hakika wamefaulu Waumini ambao ni wanyenyekevu katika Sala zao.",
      },
      {
        excerpt: "Isipokuwa wale wanaoswali - ambao wanadumu katika Sala zao.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Jambo la kwanza ambalo mja atahisabiwa siku ya Qiyaamah ni swala yake. Ikiwa ni sauti, amefaulu; ikiwa ni kasoro, ameshindwa na ameshindwa.",
      },
      {
        excerpt:
          "Na lau kungekuwa na mto mlangoni mwa mmoja wenu anaoga mara tano kwa siku, je, uchafu ungebaki juu yake? Wakasema: Hapana. Akasema: Huo ni mfano wa Sala tano - kwa hizo Mwenyezi Mungu hufuta madhambi.",
      },
    ],
    actions: [
      "Zilinde Sala tano za kila siku kwa nyakati zake.",
      "Tengeneza swalah zilizokosa (qaza) kwa ikhlasi.",
      "Ongeza swalah za sunna kabla na baada ya fardhi pale unapoweza.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Toba ya dhati",
    summary: "Mwenyezi Mungu anawapenda wanaorejea kwake daima.",
    body: [
      "Tawbah ni kurejea kwa Mwenyezi Mungu baada ya dhambi. Toba ya kweli (tawbah nasuh) ina nguzo zilizo wazi: majuto ya kweli moyoni kwa yale yaliyofanywa, kuacha mara moja dhambi, na azma thabiti ya kutorejea tena - na ikiwa dhambi itahusisha kumdhulumu mtu mwingine, kurejesha haki yake au kuomba msamaha wake. Si tukio hata moja bali ni marejeo ya maisha yote, ni mlango ambao Mwenyezi Mungu huweka wazi kwa kila Muumini.",
      "Umuhimu wake ni kwamba hakuna mwanadamu asiye na dhambi, hivyo toba si ya wachache wenye dhambi bali ni ya kila mtu. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) amesema kuwa kila mtoto wa Aadam anafanya dhambi, na bora wa wanaofanya dhambi ni wale wanaotubia. Mwenyezi Mungu huikubali toba ya mja mpaka pale roho inapofika kooni wakati wa kufa, na hata jua linalochomoza kutoka magharibi ni muda wa mwisho wa dunia - mpaka hapo mwaliko unasimama.",
      "Inastaajabisha kwamba Mwenyezi Mungu hamvumilii tu mja anayerejea - Yeye hufurahi. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) amemtaja Mwenyezi Mungu kuwa anafurahishwa zaidi na toba ya mja wake kuliko mtu ambaye, alipotea katika jangwa lisilo na maji, akakata tamaa ya maisha baada ya ngamia wake kutangatanga na chakula chake na maji yake yote, kisha akapata tena ghafla. Picha hiyo ya furaha kubwa inatueleza jinsi mja anayetubu anavyopendwa na Mola wake.",
      "Hekima ni ya kina: dhambi sio lazima iwe mwisho wa hadithi ya mtu. 'Mwenyezi Mungu atabadilisha maovu yao kwa wema' (Qur'ani 25:70) - toba ya kweli inaweza kubadilisha rekodi ya kushindwa kuwa moja ya mafanikio, na inaweza kugeuza anguko kuwa mwanzo mpya unaomkurubisha mtu kwa Mwenyezi Mungu kuliko hapo awali. Kukata tamaa baada ya dhambi yenyewe ni mtego wa Shetani; matumaini katika rehema ya Mwenyezi Mungu ni jibu la Muumini.",
      "Kivitendo: usiahirishe toba kwa siku moja - rudisha wakati unapoteleza. Fuata kila jambo baya kwa tendo jema ili kulifuta, na weka istighfar katika ulimi wako mchana kutwa, kama vile Mtume ﷺ alivyoomba msamaha mara nyingi kila siku licha ya kusamehewa.",
    ],
    quran: [
      {
        excerpt:
          "Enyi mlio amini tubuni kwa Mwenyezi Mungu kwa toba ya kweli, huenda Mola wenu Mlezi akakufutieni maovu yenu na akakuingizeni katika Pepo zipitazo mito kati yake.",
      },
      {
        excerpt:
          "Isipokuwa wale waliotubu, na wakaamini, na wakatenda mema, basi Mwenyezi Mungu atawabadilishia maovu yao mema, na Mwenyezi Mungu ni Mwenye kusamehe, Mwenye kurehemu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mwenyezi Mungu ameridhika na toba ya mja wake kuliko mmoja wenu ambaye amempoteza ngamia wake katika ardhi kame, akampata tena kwa ghafla.",
      },
    ],
    actions: [
      "Tubu mara moja unapofanya dhambi - usiahirishe.",
      "Fuata dhambi kwa amali njema ili kuifuta.",
      "Sema istighfar siku nzima.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qur'ani",
    summary: "Soma, kariri, na uishi kwa Kitabu cha Mwenyezi Mungu.",
    body: [
      "Qur-aan ni maneno halisi ya Mwenyezi Mungu, yaliyoteremshwa kama mwongozo, rehema na uponyaji kwa nyoyo. Kujenga uhusiano nayo—kuikariri, kutafakari maana zake, kutenda kulingana na amri zake, na kuifundisha kwa wengine—ni miongoni mwa matendo makuu na yenye thawabu zaidi ya ibada ambayo muumini anaweza kujitolea maisha yake yote. Ni kamba ya Mwenyezi Mungu iliyonyoshwa kwetu; anayeshikamana nayo ameongoka kwenye njia iliyonyooka.",
      "Thawabu zilizoambatanishwa nayo ni za ajabu. Mtume (Swalla Allaahu ´alayhi wa sallam) amefundisha kuwa Mwenyezi Mungu huwapa wale wanaosoma Kitabu Chake na wakasimamisha Swala ujira mkubwa usioharibika (Qur'ani 35:29-30), na kwamba kwa kila herufi moja inayosomwa kuna ujira unaozidishwa mara kumi. Hata yule anayejitahidi na kujikwaa juu ya maneno, maadamu anaendelea kujaribu, ana thawabu mara mbili - moja kwa kisomo na moja kwa juhudi.",
      "Qur'ani pia inainua daraja ya mtu katika maisha yajayo kwa njia ya moja kwa moja na ya wazi. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) amesema kuwa swahaba wa Qur-aan ataambiwa Siku ya Qiyaamah: “Soma na uinuke, na soma kama ulivyokuwa ukisoma duniani, kwani cheo chako kitakuwa kwenye Aya ya mwisho utakayoisoma. Kwa maneno mengine, kisimamo cha mtu Peponi kinainuka sambamba na sehemu yake ya Kitabu - himizo la kushangaza la kuendelea kuhifadhi na kuhakiki.",
      "Kusudi la kina, hata hivyo, si kukariri kwa ajili yake bali ni mabadiliko. Mwenyezi Mungu anatuamuru 'kusoma Qur'ani kwa kisomo kilichopimwa' (Qur'ani 73:4) kwa usahihi ili maana ziingie ndani na kuunda upya jinsi tunavyofikiri, kuhisi, na tabia. Qur'ani ilitumwa kuishi, sio kusomwa tu; maswahaba wangejifunza Aya kumi na wasiendelee mbele mpaka wazielewe na kuzifanyia kazi.",
      "Kwa vitendo: soma sehemu kila siku, hata aya chache tu, lakini zisome kwa kutafakari. Kariri surah mpya au udumishe yale ambayo tayari unajua, na - muhimu zaidi - tenda kile unachojifunza kabla ya kukimbilia kujifunza zaidi.",
    ],
    quran: [
      {
        excerpt:
          "Wale wanao soma Kitabu cha Mwenyezi Mungu, na wakasimamisha Sala, na wakatoa katika yale tuliyo ruzuku, wanataraji biashara isiyo haribika, ili awalipe ujira wao kwa ukamilifu, na awazidishie katika fadhila yake.",
      },
      {
        excerpt: "Na soma Qur'ani kwa kisomo cha kipimo.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ataambiwa swahaba wa Qur-aan: Soma na uinuke, na soma kama ulivyokuwa ukisoma duniani, kwani cheo chako kitakuwa kwenye Aya ya mwisho utakayoisoma.",
      },
    ],
    actions: [
      "Soma kila siku - hata aya chache zenye tafakari.",
      "Kariri surah mpya au udumishe kile unachojua.",
      "Tenda juu ya kile unachojifunza kabla ya kutafuta zaidi.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Dhikr - ukumbusho",
    summary: "Mwanga kwa ulimi, nzito kwa kiwango.",
    body: [
      "Dhikr maana yake ni kumdhukuru Mwenyezi Mungu - kumweka ndani ya moyo na ulimi kwa maneno ya kumtukuza (SubhanAllah), sifa (Alhamdulillah), kumtukuza (Allahu Akbar), kuthibitisha upweke wake (La ilaha illallah), na kuomba msamaha (istighfar). Kati ya njia zote za kwenda Peponi, dhikr ni miongoni mwa njia rahisi zaidi kuzifanya bado miongoni mwa njia kuu zaidi za malipo, kwa sababu inaweza kufanywa popote, katika hali yoyote, wakati wowote.",
      "Mwenyezi Mungu Mwenyewe anaiamuru kwa ukarimu - 'Enyi mlioamini, mkumbukeni Mwenyezi Mungu kwa ukumbusho mwingi' (Qur'ani 33:41-42) - na anaahidi tunda la kipekee kwa hilo: utulivu wa moyo. “Hakika kwa kumkumbuka Mwenyezi Mungu nyoyo hutulia” (Qur’ani 13:28). Katika ulimwengu usiotulia, wenye wasiwasi, hii ni mojawapo ya zawadi kuu za dhikr. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) pia alipima ujira wake, akasema kwamba maneno mawili mepesi kwenye ulimi lakini mazito kwenye Mizani, na yanayopendwa na Mwingi wa Rehema, ni SubhanAllahi wa bihamdihi, SubhanAllahil-Aziym.",
      "Kategoria maalum ni adhkar ya asubuhi na jioni - dua sahihi alizozifundisha Mtume ﷺ kwa mipaka miwili ya siku. Hawa wanafanya kama ngome ya kiroho, inayomlinda Muumini kutokana na madhara na kuteremsha ulinzi na radhi za Mwenyezi Mungu. Dakika chache tu mwanzoni na mwisho wa kila siku, ikisema pamoja na uwepo, tengeneza upya moyo kwa utulivu baada ya muda.",
      "Hekima ya dhikr ni kwamba inaweka uhusiano na Mwenyezi Mungu hai kati ya ibada rasmi. Ulimi wenye unyevunyevu wa ukumbusho na, muhimu zaidi, moyo unaomkumbuka Mwenyezi Mungu katika chaguzi zake za kila siku - kutua kabla ya hasira, kabla ya kununua, kabla ya uamuzi - ndio lengo la kweli. Dhikr haikusudiwi kukaa kwenye midomo; inakusudiwa kuongoza maisha.",
      "Kiutendaji: fanya adhkar ya asubuhi na jioni kuwa tabia ya kila siku, weka sehemu rahisi ya tasbeeh, istighfar, au salawat wakati wa kupumzika, na mkumbuke Mwenyezi Mungu haswa kabla ya kulala na wakati wa kuamka. Uthabiti katika kidogo ni bora kuliko kupasuka kwa mengi.",
    ],
    quran: [
      {
        excerpt:
          "Hakika walio amini na zikatua nyoyo zao kwa kumkumbuka Mwenyezi Mungu, hakika nyoyo hutulia kwa kumkumbuka Mwenyezi Mungu.",
      },
      {
        excerpt:
          "Enyi mlio amini, mkumbukeni Mwenyezi Mungu kwa ukumbusho mwingi, na mtukuzeni asubuhi na jioni.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Maneno mawili ni mepesi katika ulimi, mazito kwenye Mizani, na yanapendwa na Mwingi wa Rehema: SubhanAllahi wa bihamdihi, SubhanAllahil-Azeem.",
      },
    ],
    actions: [
      "Kamilisha adhkar ya asubuhi na jioni kila siku.",
      "Tumia kaunta ya tasbeeh kwa istighfar au salawat.",
      "Mkumbukeni Mwenyezi Mungu kabla ya kulala na baada ya kuamka.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sadaka & zakah",
    summary: "Toeni katika alivyo kupeni Mwenyezi Mungu kwa siri na kwa uwazi.",
    body: [
      "Uislamu unamuamuru muumini kutoa kutokana na mali aliyokabidhiwa na Mwenyezi Mungu, kwa faradhi na kwa hiari. Zakah ni malipo ya faradhi ya kila mwaka juu ya mali inayostahiki - moja ya nguzo tano za Uislamu - na inastahili, sio hiari, kwa wale wanaotimiza masharti yake. Zaidi yake kuna sadaqah: utoaji wa hiari wa kiasi chochote, wakati wowote, kwa ajili ya Mwenyezi Mungu.",
      "Thawabu za kutumia katika njia ya Mwenyezi Mungu huzidishwa kupita hesabu za kawaida. Mwenyezi Mungu Anamlinganisha anayetoa katika njia Yake na punje moja inayoota masuke saba, kila suke lina punje mia moja - 'na Mwenyezi Mungu humzidishia amtakaye' (Qur'ani 2:261). Mbali na kupungua mali, sadaka huitakasa na kuiongeza baraka, huku ikizima madhambi kama maji yanavyozima moto.",
      "Aina mbili za hisani zinastahili kutajwa maalum. Ya kwanza ni sadaka iliyofichika, inayotolewa kwa busara kiasi kwamba, kama alivyoeleza Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam), mkono wa kushoto haujui mkono wa kulia umetoa nini - uaminifu huu ni wa kupendwa sana na Mwenyezi Mungu na hutia kivuli mtu Siku ya Hukumu. Ya pili ni sadaqah jariyah, sadaka inayoendelea ambayo manufaa yake huendelea baada ya kifo. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) amesema kuwa anapokufa mtu huisha amali zake isipokuwa tatu tu: Sadaka inayoendelea, elimu yenye manufaa kwa wengine, na mtoto mwema anayemuombea dua.",
      "Hekima ya sadaka ni kwamba inafanya kazi kwa mtoaji kama vile mpokeaji. Hulegeza mshiko wa uchoyo moyoni, hujenga huruma, huimarisha vifungo vya jumuiya, na huwakumbusha matajiri kwamba wao ni wadhamini, si wamiliki wa kweli. Na Uislamu unapanua ufafanuzi wa sadaka kwa hivyo hakuna yeyote anayetengwa: Mtume (Swalla Allaahu ´alayhi wa sallam) amefundisha kwamba kutabasamu kwa ndugu yako, neno la kusaidia, na hata kuondoa kitu kibaya barabarani ni aina zote za sadaqah.",
      "Kiutendaji: ikiwa unawajibika kwa zakah, hesabu na ulipe kwa usahihi; toa sadaqah ya kawaida, hata iwe ndogo, ili kutoa iwe mazoea badala ya tukio; na utafute jariyah ya sadaqah ya kudumu - kumfadhili mwanafunzi, kufadhili kisima, au kusaidia msikiti - ambayo inaendelea kukuthawabisha muda mrefu baada ya kuondoka.",
    ],
    quran: [
      {
        excerpt:
          "Mfano wa wanao toa mali zao katika Njia ya Mwenyezi Mungu ni kama punje inayoota mashuke saba, katika kila suke punje mia moja. Na Mwenyezi Mungu humzidishia amtakaye.",
      },
      {
        excerpt:
          "Toeni katika yale tuliyo kupeni kabla hayajamfika mmoja wenu mauti, na akasema: Mola wangu Mlezi, laiti ungenichelewesha kwa muda kidogo ili nitoe sadaka na niwe miongoni mwa watu wema.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Anapokufa mtu amali zake hukatika isipokuwa tatu: Sadaka inayoendelea, elimu yenye manufaa, au mtoto mwema anayemuombea dua.",
      },
    ],
    actions: [
      "Piga hesabu na ulipe zakah ikiwa unawajibika.",
      "Toa sadaka mara kwa mara, hata kama ni ndogo.",
      "Tafuta fursa za sadaqah jariyah.",
    ],
    appLinks: [{}],
  },
  {
    title: "Tabia nzuri",
    summary: "Jambo gumu zaidi kwenye Mizani inaweza kuwa tabia bora.",
    body: [
      "Tabia njema (husn al-khuluq) ni mkusanyo wa sifa tukufu anazozionyesha muumini katika kushughulika na viumbe vya Mwenyezi Mungu: ukweli, subira, unyenyekevu, rehema, ukarimu, upole, na kutimiza ahadi za mtu. Mbali na kuwa wema wa kijamii tu, Uislamu unaichukulia tabia kama kipimo cha msingi cha imani na mojawapo ya matendo mazito sana ambayo mtu anaweza kubeba hadi Siku ya Hukumu.",
      "Cheo chake kinaelezwa kwa maneno yaliyo wazi zaidi. Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) amesema kuwa hakuna chochote kinachowekwa kwenye Mizani zaidi kuliko tabia njema, na kwamba waumini walio kamili zaidi katika imani ni wale wenye tabia bora. Hata alitoa muhtasari wa utume wake mwenyewe kwa kusema alitumwa kwa ukamilifu wa tabia ya kiungwana. Hii ina maana jinsi unavyowatendea wazazi wako, mwenzi wako, watoto wako, majirani zako, na hata watu usiowajua si tofauti na ibada yako - ni sehemu kuu yake.",
      "Tabia nzuri ina nguvu kwa sababu ya yale aliyoahidi Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam): kwa tabia zake njema Muumini anaweza kufikia daraja ya yule anayefunga mchana kutwa na kuswali usiku kucha. Kwa maneno mengine, tabia bora inaweza kuinua mtu wa kawaida kwa kiwango cha waabudu waliojitolea zaidi, kwa sababu ni vigumu, mara kwa mara, na hujaribu ego kila wakati - kuzuia hasira, kusamehe matusi, na kuchagua upole wakati ukali itakuwa rahisi.",
      "Hekima ni kwamba Uislamu sio tu uhusiano wa kibinafsi kati ya mtu na Mwenyezi Mungu; ina maana ya kufurika katika jinsi mtu anavyowatendea kila mtu karibu naye. Mwabudu ambaye maombi yake hayalainishi shughuli zake amekosa uhakika, ambapo tabia njema yenyewe ni dawah, inayowavuta watu kuelekea kwenye imani kupitia mfano hai. Hii ndiyo sababu maandiko yanaoanisha ibada ya Mwenyezi Mungu na ubora kuelekea uumbaji Wake tena na tena.",
      "Kivitendo: fanyia kazi sifa moja baada ya nyingine - shikilia ulimi wako unapokasirishwa, wasamehe wanaokukosea, rekebisha uhusiano ambao umeuacha uvunjike, na utimize ahadi zako hata kama zitakugharimu. Tafakari fupi ya kila siku baada ya Swala juu ya jinsi ulivyowatendea watu siku hiyo ni njia rahisi ya kukua kwa kasi.",
    ],
    quran: [
      {
        excerpt: "Na hakika wewe una tabia kubwa na tukufu.",
      },
      {
        excerpt:
          "Ambao hutoa kwa urahisi na dhiki, na wakajizuia ghadhabu zao, na wanasamehe watu, na Mwenyezi Mungu anawapenda wafanyao wema.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Hakuna kizito katika Mizani ya Muumini Siku ya Kiyama kuliko tabia njema. Hakika Mwenyezi Mungu hampendi mtu mchafu na mkali.",
      },
      {
        excerpt:
          "Waumini waliokamilika zaidi katika Imani ni wale wenye tabia njema, na walio bora zaidi miongoni mwenu ni wale walio bora kwa wake zao.",
      },
    ],
    actions: [
      "Jizoeze kuwa na subira unapokasirishwa.",
      "Samehe wengine na urekebishe mahusiano yaliyovunjika.",
      "Tafakari juu ya tabia yako baada ya Swala katika jarida la kila siku.",
    ],
    appLinks: [
      {},
      {
        label: "Sins against others",
      },
    ],
    characterTraits: [
      {
        title: "Ukweli",
        summary: "Ukweli wa kauli na tendo.",
        quran: {
          excerpt: "Kuweni pamoja na wakweli.",
        },
      },
      {
        title: "Subira",
        summary: "Kustahimili majaribu.",
        quran: {
          excerpt: "Allah yu pamoja na wenye subira.",
        },
      },
      {
        title: "Kuzuia hasira",
        summary: "Kujidhibiti unapokasirika.",
        hadith: {
          excerpt: "Mwenye nguvu ni anayejizuia wakati wa hasira.",
        },
      },
      {
        title: "Msamaha",
        summary: "Kusamehe makosa.",
        quran: {
          excerpt: "Wasamehe na wapuuze.",
        },
      },
      {
        title: "Unyenyekevu",
        summary: "Usijione bora.",
        hadith: {
          excerpt: "Anayenyenyekea kwa Allah, Allah humuinua.",
        },
      },
      {
        title: "Uaminifu",
        summary: "Kulinda amana.",
        quran: {
          excerpt: "Wanalinda amana na ahadi zao.",
        },
      },
      {
        title: "Wazazi",
        summary: "Heshima na wema.",
        quran: {
          excerpt: "Usiwaambie hata «uff».",
        },
      },
      {
        title: "Maneno mema",
        summary: "Sema mema au nyamaza.",
        hadith: {
          excerpt: "Aseme mema au anyamaze.",
        },
      },
      {
        title: "Tabasamu",
        summary: "Uso wa bashasha.",
        hadith: {
          excerpt: "Tabasamu kwa ndugu ni sadaka.",
        },
      },
      {
        title: "Uadilifu",
        summary: "Kutenda haki.",
        quran: {
          excerpt: "Fanyeni uadilifu; uko karibu na uchamungu.",
        },
      },
    ],
    characterDestroyers: [
      {
        title: "Uongo",
      },
      {
        title: "Kusengenya",
      },
      {
        title: "Udaku",
      },
      {
        title: "Kiburi",
      },
      {
        title: "Dhuluma",
      },
      {
        title: "Kuvunja ahadi",
      },
      {
        title: "Kudhihaki",
      },
      {
        title: "Ukali",
      },
    ],
  },
  {
    title: "Kutafuta maarifa",
    summary: "Mwenyezi Mungu humrahisishia njia ya Peponi mwenye kutaka elimu.",
    body: [
      "Kutafuta elimu yenye manufaa - kujifunza aliyoyafundisha Mwenyezi Mungu na Mtume wake, kisha kuyafanyia kazi na kuyapitisha - ni ibada na, katika mambo yake muhimu, ni faradhi kwa kila Muislamu. Hii ndiyo elimu takatifu inayobainisha imani, kuitakasa ibada, na kupambanua haki na batili; si maarifa ya kujionyesha, bali ni nuru inayoongoza matendo.",
      "Mtume (Swalla Allaahu ´alayhi wa sallam) aliufungamanisha ufuatiliaji huu moja kwa moja na lengo la safari hii yote: 'Mwenye kushika njia kutafuta elimu, Mwenyezi Mungu atamrahisishia njia ya kwenda Peponi.' 'Njia' ni halisi na ya mfano - Mwenyezi Mungu hurahisisha njia ya mtafutaji katika maisha haya na kurahisisha njia yake ya kwenda Jannah katika ijayo. Vile vile alifundisha kwamba Malaika wanainamisha mbawa zao ili kumridhia mtafutaji elimu, na kwamba kila kilichomo mbinguni na ardhini, hata samaki wa baharini, vinamuombea msamaha yule anayefundisha mema.",
      "Elimu pia ni miongoni mwa matendo adimu ambayo huendelea kumlipa mtu baada ya kufa. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) alitaja elimu yenye manufaa miongoni mwa vitu vitatu ambavyo malipo yake yanaendelea kaburini, sambamba na sadaka na mtoto mwema. Kwa hivyo kufundisha jambo moja la manufaa - kumsaidia mtu kujifunza kusali kwa usahihi, kushiriki hadithi sahihi, au kumwongoza mtu kwenye ukweli - kunaweza kuwa mkondo wa malipo unaotiririka kwa miaka, hata vizazi.",
      "Hekima ni kwamba kitendo bila maarifa ni upofu na maarifa bila matendo hayana matunda. Ujuzi sahihi humlinda mtu dhidi ya uzushi na upotovu, huongeza unyoofu, na humpa uwezo wa kuwanufaisha wengine badala ya kujinufaisha yeye mwenyewe. Wanachuoni wa Uislamu daima walitahadharisha dhidi ya hatari mbili: kutenda kwa ujinga, na kujua bila kutenda.",
      "Kivitendo: jitolee kujifunza kitu chenye manufaa mara kwa mara - aya, hadith, hukumu unayohitaji kwa ajili ya ibada yako ya kila siku. Anza na mambo muhimu ya imani, sala, utakaso, na makatazo makubwa, kisha uimarishe polepole. Shiriki kile unachojifunza kwa unyenyekevu, na utumie kwako kila wakati kwanza.",
    ],
    quran: [
      {
        excerpt:
          "Sema: Je! Wanalingana wale wanaojua na wasio jua? Ni wenye ufahamu tu ndio huzingatia.",
      },
      {
        excerpt: "Na sema: Mola wangu Mlezi, nizidishie ilimu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mwenye kushika njia kutafuta elimu, Mwenyezi Mungu atamsahilishia njia ya kwenda Peponi.",
      },
      {
        excerpt:
          "Anapokufa mtu amali zake hukatika isipokuwa tatu: Sadaka inayoendelea, elimu yenye manufaa, au mtoto mwema anayemuombea dua.",
      },
    ],
    actions: [
      "Jifunze kitu chenye manufaa kila juma.",
      "Shiriki maarifa bila kiburi.",
      "Tumia kile unachojifunza kabla ya kukusanya zaidi.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Ibada ya hiari",
    summary: "Jikurubisheni kwa Mwenyezi Mungu kupitia nafsi isiyo ya faradhi.",
    body: [
      "Ibada ya kujitolea (nafl) inarejelea matendo ya ziada ya ibada ambayo Muumini hutoa zaidi ya yale ambayo Mwenyezi Mungu ameyalazimisha - sala za ziada, saumu za ziada, sadaka ya ziada na mawaidha. Wajibu huja kwanza na hauwezi kujadiliwa, lakini mara tu zinapotekelezwa, nafl ni pale mja anapoonyesha upendo, ukaribu, na hamu ambayo inapita kiwango cha chini kinachohitajika.",
      "Kuna ahadi ya kushangaza iliyoambatanishwa nayo. Katika Hadith qudsi, Mwenyezi Mungu anasema: 'Mja wangu hanikaribii na kitu chochote kinachopendwa zaidi Kwangu kuliko kile nilichomjibisha. Na anaendelea kujikurubisha Kwangu kwa amali za hiyari mpaka nimpende’ — na mara Mwenyezi Mungu anapompenda mja, hujibiwa dua zake na mambo yake hurekebishwa. Kwa hiyo ibada ya hiari ndiyo ngazi ya ukaribu, ikipanda kutoka kwa utiifu tu kuelekea upendo wa Mungu.",
      "Sunnah ni nyingi na aina zake zinazoweza kufikiwa: Swalah ya usiku (tahajjud) katika sehemu ya mwisho ya usiku, sala ya adhuhuri (duha), sala ya kawaida ya sunna kabla na baada ya faradhi, na saumu ya hiari kama Jumatatu na Alhamisi au siku nyeupe za kila mwezi. ́Ibaadah ya Nafl pia inafunga dosari kwa utulivu - Mtume (Swalla Allaahu ´alayhi wa sallam) alifundisha kwamba upungufu wowote katika sala za faradhi utakamilika kutokana na sala ya hiari ya mtu Siku ya Hukumu.",
      "Hekima ni kwamba nafl huweka imani hai na kukua. Wajibu hudumisha msingi, lakini matendo ya hiari ni pale ambapo moyo hutanda, ambapo ibada ya faragha hakuna mtu anayeona hujenga unyoofu, na ambapo mtu hujizoeza kwa ajili ya majaribu magumu zaidi ya maisha. Pia ni rehema kwamba vitendo hivi ni vya hiari - Mwenyezi Mungu hufungua milango mingi ili kila mtu aweze kupitia ile inayomfaa.",
      "Kwa kweli, ufunguo ni uendelevu, sio nguvu. Mtume (Swalla Allaahu ´alayhi wa sallam) amefundisha kwamba matendo yanayopendwa zaidi na Mwenyezi Mungu ni yenye kufuatana, hata kama ni madogo. Chagua vitendo vichache vya hiari unavyoweza kushika kwa dhati - rakaa mbili za tahajjud, mfungo mmoja kwa wiki, sehemu isiyobadilika ya Qur'ani - badala ya mlipuko wa tamaa unaoteketeza ndani ya siku chache.",
    ],
    quran: [
      {
        excerpt:
          "Mbavu zao zinaacha vitanda huku wakimwomba Mola wao Mlezi kwa khofu na matumaini, na wanatoa katika yale tuliyo waruzuku. Nafsi yoyote haijui ni faraja gani wanayo fichiwa kuwa ni malipo ya yale waliyokuwa wakiyatenda.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mja wangu hanikaribii na kitu chochote kinachopendwa zaidi Kwangu kuliko kile nilichomjibisha. Na mja Wangu huendelea kujikurubisha Kwangu kwa vitendo vya khiyari mpaka nimpende.",
      },
    ],
    actions: [
      "Omba tahajjud hata kama rakaa mbili tu.",
      "Kufunga siku za hiari wakati unaweza.",
      "Ongeza swala za sunna kabla/baada ya fardhi.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Uvumilivu na shukrani",
    summary: "Mwenyezi Mungu huwapenda wenye subira na wenye kushukuru.",
    body: [
      "Subira (sabr) na shukrani (shukr) ni mbawa mbili ambazo kwazo muumini huruka maishani. Subira ni uthabiti katika medani tatu: Kukaa imara katika kumtii Mwenyezi Mungu, kujizuia na maasi, na kubeba mitihani ya maisha bila malalamiko dhidi ya amri yake. Kushukuru ni kutambua kila neema kuwa inatoka kwa Mwenyezi Mungu na kuitikia kwa shukrani moyoni, kwa ulimi, na kwa vitendo vya utiifu. Kwa pamoja hufunika jibu la muumini kwa shida na urahisi.",
      "Umuhimu wao ni kwamba wao hufafanua jinsi muumini hukutana na kila kitu kinachotokea kwake. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) anastaajabu kuwa mambo yote ya Muumini ni kheri: inapomfikia kheri hushukuru na ni kheri kwake, na inapotokea msiba huvumilia na hilo pia ni kheri kwake – baraka haipewi yeyote ila Muumini. Kwa hivyo chochote kinachokuja, Muumini ana njia ya malipo.",
      "Thawabu ya subira haina kikomo pekee. Ingawa matendo mengi yanalipwa kwa kipimo, Mwenyezi Mungu anasema: “Wanaosubiri watapewa ujira wao bila ya kipimo.” (Qur’ani 39:10). Na shukurani imebeba ahadi yake ya ongezeko: “Mkishukuru, bila shaka nitakuzidishieni” (Qur’ani 14:7). Kwa hiyo, shukrani si tu itikio linalofaa kwa baraka—ni jambo hasa linalozifanya zikue.",
      "Hekima hapa inarekebisha mateso kabisa. Majaribio si adhabu moja kwa moja; kwa Muumini anayeitikia vizuri, zinaweza kuwa ni utakaso unaofuta dhambi na kunyanyua daraja. Mtume (Swalla Allaahu ´alayhi wa sallam) amefundisha kwamba hakuna uchovu, maradhi, wasiwasi, au hata mchomo wa mwiba unaompata Mwislamu bila ya Mwenyezi Mungu kufuta baadhi ya dhambi zake. Hii inageuza nyakati ngumu zaidi za maisha kuwa fursa badala ya hasara tupu.",
      "Kiukweli: inapotokea msiba, jibu kwa maneno aliyofundisha Mwenyezi Mungu - 'Inna lillahi wa inna ilayhi raji'un' (Hakika sisi ni wa Mwenyezi Mungu, na kwake Yeye tunarejea) - na uzuie ulimi wako na malalamiko yanayokataa amri yake. Katika nyakati nzuri, zihesabu baraka zako kwa sauti na umshukuru Mwenyezi Mungu kwa angalau chache kati ya hizo kila siku; kuwataja hufanya moyo kuwa laini na wa shukrani.",
    ],
    quran: [
      {
        excerpt:
          "Wape bishara wanaosubiri, wale ambao ukifika msiba husema: Hakika sisi ni wa Mwenyezi Mungu, na kwake Yeye tutarejea. Juu yao ziko baraka zitokazo kwa Mola wao Mlezi na rehema, na hao ndio walioongoka.",
      },
      {
        excerpt:
          "Mkishukuru bila shaka nitakuzidishieni; lakini mkikataa basi adhabu yangu ni kali.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ni ajabu jambo la Muumini, kwani mambo yake yote ni mazuri. Ukifika wepesi anashukuru, na hilo ni kheri kwake. na ikifika msiba huvumilia, na hilo ni kheri kwake. Haya si kwa yeyote ila Muumini.",
      },
    ],
    actions: [
      "Sema 'inna lillahi wa inna ilayhi raji'un' unapojaribiwa.",
      "Asante Mwenyezi Mungu kwa baraka tatu kila siku.",
      "Msinung'unike kwa njia ya kukanusha hukumu ya Mwenyezi Mungu.",
    ],
  },
  {
    title: "Kulingania kwa Mwenyezi Mungu",
    summary: "Mwenye kumuongoza mwengine anapata ujira kama anayeufuata.",
    body: [
      "Da'wah maana yake ni kuwalingania wengine kwa Mwenyezi Mungu - kushirikisha ujumbe wa Uislamu, kumfundisha mtu kuswali, kuhimiza mema, kukata tamaa kwa upole, au kumsaidia Mwislamu anayejitahidi kurudi kwenye utiifu. Ulikuwa ni utume wa kila nabii na ni wajibu wa pamoja wa jumuiya, kila mmoja kulingana na uwezo wake na ujuzi wake. Haikuwekwa kwa wanachuoni; mwenye kufikisha hata kitu kimoja chenye manufaa analingania kwa Mwenyezi Mungu.",
      "Malipo yake ni mojawapo ya ukarimu zaidi katika Uislamu wote. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) amesema kuwa mwenye kumuongoza mtu kwenye wema ana ujira kama wa mwenye kuufanyia kazi, na katika riwaya nyingine, anayelingania kwenye uongofu anapata ujira wa wale wanaoufuata, bila ya kupunguziwa ujira wao hata kidogo. Hii inamaanisha kuwa nzuri uliyoweka inaweza kuendelea kuzidisha zawadi yako kupitia kila mtu inayomgusa, muda mrefu baada ya wewe kusonga mbele.",
      "Lakini da'wah ina adabu - namna - ambayo lazima iheshimiwe ili ifanikiwe. Mwenyezi Mungu anaamuru: “Waite kwenye Njia ya Mola wako Mlezi kwa hikima na mawaidha mema, na ujadiliane nao kwa njia iliyo bora kabisa.” (Qur’ani 16:125) Hekima maana yake ni kusema jambo sahihi, kwa mtu sahihi, kwa njia na wakati sahihi; ukali, kiburi, na alama za alama hufukuza watu na kusaliti kusudi. Kazi ya mlinganiaji ni kufikisha na kupanda, sio kulazimisha nyoyo ambazo ni za Mwenyezi Mungu peke yake.",
      "Hekima ya kufunga thawabu kubwa kama hii kwa kuwaongoza wengine ni kwamba inamfanya kila muumini kuwa chanzo cha wema unaoendelea. Pia inalinda imani ya mpigaji mwenyewe: kuwaalika wengine kwenye sala, uaminifu, na ibada ni kukumbushwa kushikilia kwao wenyewe. Na inafungamanisha umma pamoja katika kujaliana badala ya kupuuza.",
      "Kwa kweli, anza karibu na nyumbani. Boresha na ufundishe familia yako mwenyewe - mwenzi, mtoto, kaka - kwani ndio jukumu lako la kwanza na la kudumu. Shiriki maarifa yenye manufaa kwa wema, msaidie mtu kujifunza kusali au kusoma Qur'ani, na kumbuka kwamba maisha ya tabia njema na ibada thabiti mara nyingi ndiyo da'wah yenye ushawishi kuliko zote.",
    ],
    quran: [
      {
        excerpt:
          "Waite kwenye Njia ya Mola wako Mlezi kwa hikima na mawaidha mema, na ujadiliane nao kwa njia iliyo bora.",
      },
      {
        excerpt:
          "Na ni nani mbora wa kusema kuliko aitaye kwa Mwenyezi Mungu, na akatenda mema, na akasema: Hakika mimi ni katika Waislamu.",
      },
    ],
    hadith: [
      {
        excerpt: "Anaye muongoza mtu kwenye wema atapata ujira kama afanyaye.",
      },
    ],
    actions: [
      "Shiriki maarifa yenye faida kwa wema.",
      "Msaidie mtu kujifunza kusali au kusoma Kurani.",
      "Kuwa mfano wa tabia njema hadharani.",
    ],
  },
  {
    title: "Matendo makuu ya maisha yote",
    summary: "Hija, familia, na sadaka ya kudumu.",
    body: [
      "Sambamba na ibada za kila siku na za kila wiki, Uislamu unamwelekeza muumini kwenye matendo makuu machache ya maisha yote - uwekezaji mkubwa ambao thawabu yake ni kubwa na, katika hali nyingine, isiyoisha. Hii ndiyo miradi yenye thamani ya kupanga maisha karibu: Hija, kulea familia yenye haki, na ujenzi wa matendo mema ya kudumu.",
      "Ya kwanza kabisa miongoni mwao ni Hijja, nguzo ya tano ya Uislamu, ambayo ni faradhi mara moja katika maisha kwa kila Muislamu mwenye uwezo wa kimwili na kifedha - 'Hija kwenye Nyumba ni wajibu wa Mwenyezi Mungu na watu wanaoweza kupata njia' (Qur'ani 3:97). Malipo yake ni utakaso kamili: Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) amesema kuwa mwenye kuhiji kwa ajili ya Mwenyezi Mungu na akajiepusha na mambo machafu na dhambi atarejea akiwa hana dhambi, ni msafi kama siku aliyojifungua mama yake. Hija iliyokubaliwa, alisema, haina malipo kidogo kuliko Pepo. Umra, Hija ndogo, pia ina ujira mkubwa na inafuta madhambi baina ya Umra moja na inayofuata.",
      "Uwekezaji mkubwa wa pili ni sadaqah jariyah - hisani inayoendelea ambayo humtuza mtu baada ya kifo. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) ameitaja katika mambo matatu yanayoendelea kumnufaisha mtu kaburini, pamoja na elimu yenye manufaa na mtoto mwema anayemuombea dua. Kulea watoto kwa imani na tabia njema labda ndilo kubwa zaidi kati ya haya, lakini vivyo hivyo kujenga au kudumisha msikiti, kuchimba kisima, kufadhili yatima, kupanda mti, au kufadhili elimu - kila moja ni mkondo wa malipo ambayo huishi zaidi ya mtoaji.",
      "Hekima ya matendo haya ni kwamba yanarefusha hesabu ya mtu zaidi ya muda wake wa kuishi. Miaka ya utumishi ya mwamini ni mifupi, lakini kisima alichochimba au mtoto aliyemlea vizuri anaweza kuendelea kumletea thawabu kwa karne nyingi. Kwa hivyo Uislamu unahimiza maono ya muda mrefu: kufikiria sio tu juu ya sala ya leo, lakini juu ya kile kizuri ambacho bado kitatiririka kutoka kwako baada ya kuondoka.",
      "Kivitendo: kama unaweza, panga kwa umakini kwa ajili ya Hija au Umra badala ya kuiahirisha bila kikomo. Mimina juhudi za kweli katika imani na tabia ya familia yako, kwa kuwa wao ni urithi wako wa kudumu zaidi. Na tambua angalau mradi mmoja wa usaidizi wa kudumu wa kusaidia - maarifa, maji, makazi, au yatima - ili matendo yako mema yaendelee baada ya kifo.",
    ],
    quran: [
      {
        excerpt:
          "Na Hija kwenye Nyumba ni wajibu kwa Mwenyezi Mungu na watu wanaoweza kupata njia ya kuiendea.",
      },
      {
        excerpt:
          "Na watangazie watu Hija; watakujieni kwa miguu na juu ya kila ngamia aliyekonda kutoka katika kila njia ya mbali, ili washuhudie manufaa yao wenyewe.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mwenye kuhiji kwa ajili ya Mwenyezi Mungu, na asifanye uchafu au uadui, atarejea akiwa hana dhambi, kama siku aliyozaliwa na mama yake.",
      },
      {
        excerpt:
          "Anapokufa mtu amali zake hukatika isipokuwa tatu: Sadaka inayoendelea, elimu yenye manufaa, au mtoto mwema anayemuombea dua.",
      },
    ],
    actions: [
      "Panga Hija au Umrah ukiweza.",
      "Wekeza katika imani na tabia ya familia yako.",
      "Saidia mradi wa hisani wa kudumu.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Rehema ya Mwenyezi Mungu ni neno la mwisho",
    summary: "Matendo ni njia; kuingia ni kwa rehema zake.",
    body: [
      "Baada ya matendo yote, juhudi zote, na njia zote, Muumini anafika kwenye ukweli mnyenyekevu ambao ni neno la mwisho katika safari hii: hakuna yeyote anayeingia Peponi kwa sababu ya matendo yake peke yake. Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) ameeleza juu yake mwenyewe - kipenzi cha viumbe vyote kwa Mwenyezi Mungu - akisema kwamba hata yeye hataingia Peponi kwa vitendo vyake, isipokuwa Mwenyezi Mungu amemfunika kwa rehema yake. Ikiwa ni hivyo kwake, hakika sisi ni hivyo.",
      "Hii haipaswi kamwe kueleweka vibaya kama leseni ya kupuuza ibada. Matendo yanabaki kuwa njia aliyoichagua Mwenyezi Mungu na kuamrisha; Amefungamanisha rehema zake kwenye imani na matendo mema, na kuachana nayo si unyenyekevu bali ni kughafilika. Maana sahihi ni moja ya uwiano: matendo yetu, hata yawe mengi vipi, hayangeweza kamwe kulipa hata sehemu ya baraka za Mwenyezi Mungu juu yetu, wala kununua umilele wa Pepo. Kwa hiyo tunatoa matendo yetu kama ishara ya upendo na utiifu, kisha tunategemea kabisa neema yake ili kuyakubali na kutukubali.",
      "Upeo wa rehema hiyo ni wa kushangaza. Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) ameigawanya rehema katika sehemu mia moja; Aliteremsha sehemu moja tu kwa viumbe vyote - na ni kwa sehemu hiyo moja ambapo mama huwa na huruma kwa mtoto wake na wanyama huwa wapole kwa watoto wao - na aliweka sehemu tisini na tisa zilizobaki Kwake ili kuwapa waja Wake Siku ya Kiyama. Rehema yoyote ambayo tumewahi kushuhudia katika ulimwengu huu ni sehemu ya sehemu moja ya mia.",
      "Hii ndiyo sababu mwamini mwenye uwiano anaishi kati ya matumaini na hofu, kama ndege anayeruka na mbawa mbili. Anaogopa uadilifu wa Mwenyezi Mungu kiasi cha kutoridhika au kughafilika na dhambi, na anataraji rehema ya Mwenyezi Mungu kiasi cha kutokukata tamaa, hata awe amepotoka kiasi gani. Kuinamia kabisa kuelekea woga huzaa kutokuwa na tumaini; kuelekea kabisa tumaini huzaa kiburi. Majina ya Mwenyezi Mungu - Ar-Rahman (Mwingi wa Rehema), Ar-Rahim (Mwingi wa Rehema), Al-Ghafoor (Mwingi wa kusamehe) - yanatia bawa la matumaini.",
      "Basi hii iwe ndiyo roho mnayofunga kila siku: Muombeni Mwenyezi Mungu kwa ajili ya Al-Firdaws, fanyeni wema wenu, tubuni kwa ajili ya mapungufu yenu, na kisha mkabidhi cheo chenu kwa Mwingi wa Haki na Mwingi wa Rehema - mkiamini kwamba Yule aliyeweka sehemu tisini na tisa za rehema kwa Siku hiyo hatamkataa mja aliyemjia kwa juhudi na kutaraji.",
    ],
    quran: [
      {
        excerpt:
          "Na rehema yangu imekizunguka kila kitu. Basi nitawawekea walio fanya wema na watoe zaka na walio ziamini Aya zetu.",
      },
      {
        excerpt:
          "Sema: Enyi waja wangu mliojidhulumu nafsi zao, msikate tamaa na rehema ya Mwenyezi Mungu. Hakika Mwenyezi Mungu husamehe dhambi zote.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Hataingia Peponi hata mmoja wenu kwa vitendo vyake peke yake. Wakasema: Hata wewe ewe Mtume wa Mwenyezi Mungu? Akasema: Hata mimi, isipokuwa Mwenyezi Mungu amenifunika kwa rehema yake.",
      },
      {
        excerpt:
          "Mwenyezi Mungu ana sehemu mia moja za rehema. Ameiteremsha sehemu moja miongoni mwa majini, watu, wanyama na wadudu, kwa hayo wanahurumiana wao kwa wao. na akajiwekea sehemu tisini na tisa ambazo kwazo atawarehemu waja wake Siku ya Kiyama.",
      },
    ],
    actions: [
      "Sawazisha kumcha Mwenyezi Mungu na kutaraji rehema yake.",
      "Usikate tamaa baada ya dhambi - tubu na endelea kujitahidi.",
      "Muombeni Mwenyezi Mungu Al-Firdaws na mwisho mwema (husn al-khatimah).",
    ],
    appLinks: [{}, {}],
  },
];

export const JANNAH_GATES_SW: DeepPartial<JannahGate>[] = [
  {
    name: "Lango la Maombi",
    deedSummary: "Kwa wale waliochunga na kusimamisha Swalah tano za kila siku.",
    hadith: [
      {
        excerpt:
          "Atakayetoa jozi ya kitu chochote katika Njia ya Mwenyezi Mungu ataitwa kutoka kwenye milango ya Pepo. Aliyekuwa miongoni mwa watu wa kuswali ataitwa kutoka kwenye Mlango wa Swala.",
      },
    ],
  },
  {
    name: "Lango la Hisani",
    deedSummary: "Kwa wale waliotoa sadaka kwa ikhlasi kwa ajili ya Mwenyezi Mungu.",
    hadith: [
      {
        excerpt:
          "Aliyekuwa miongoni mwa watu wa kutoa sadaka ataitwa kutoka kwenye mlango wa sadaka.",
      },
    ],
  },
  {
    name: "Lango la Ar-Rayyan",
    deedSummary: "Imetengwa kwa ajili ya wale waliofunga - mlango tu wao kuingia.",
    hadith: [
      {
        excerpt:
          "Peponi kuna mlango unaoitwa Ar-Rayyan, ambao ni wale waliofunga tu watakaoingia Siku ya Kiyama. Wakati wa mwisho wao ameingia, itafungwa.",
      },
    ],
  },
  {
    name: "Mlango wa Jihad",
    deedSummary: "Kwa wale walio pigania Njia ya Mwenyezi Mungu kwa ikhlasi.",
    hadith: [
      {
        excerpt:
          "Yeyote aliyekuwa miongoni mwa watu wa jihadi ataitwa kutoka kwenye Mlango wa Jihad.",
      },
    ],
  },
  {
    name: "Malipo ya Hija",
    deedSummary: "Kwa wale waliohiji kwa uthabiti tu, na kurudi bila ya dhambi.",
    hadith: [
      {
        excerpt:
          "Mwenye kuhiji kwa ajili ya Mwenyezi Mungu, na asifanye uchafu au uadui, atarejea akiwa hana dhambi, kama siku aliyozaliwa na mama yake.",
      },
    ],
  },
  {
    name: "Inaitwa kutoka kwa kila lango",
    deedSummary: "Wengine, kama Abu Bakr, wataitwa kuingia kutoka kwenye milango yote.",
    hadith: [
      {
        excerpt:
          "Abu Bakr akauliza: Je, kuna yeyote ataitwa kutoka katika milango yote hii? Akasema: Ndio, na natumai utakuwa mmoja wao.",
      },
    ],
  },
];

export const JANNAH_VERSES_SW: DeepPartial<JannahVerseEntry>[] = [
  {
    excerpt:
      "Kimbilieni kwenye maghfira kutoka kwa Mola wenu Mlezi na Pepo yenye upana wa mbingu na ardhi iliyo andaliwa kwa ajili ya watu wema.",
  },
  {
    excerpt:
      "Bustani zipitazo mito kati yake, na maskani mazuri katika Bustani za kudumu, lakini radhi za Mwenyezi Mungu ni kubwa zaidi.",
  },
  {
    excerpt: "Bustani za makimbilio kuwa makaribisho kwa walio amini na wakatenda mema.",
  },
  {
    excerpt:
      "Nafsi yoyote haijui ni faraja gani iliyofichika kwao kuwa ni malipo ya yale waliyokuwa wakiyatenda.",
  },
  {
    excerpt: "Humo watapata wanachokitaka, na sisi tuko zaidi.",
  },
  {
    excerpt: "Kwa wote kutakuwa na digrii kulingana na walivyofanya.",
  },
  {
    excerpt: "Wao ni daraja kwa Mwenyezi Mungu, na Mwenyezi Mungu anayaona wanayo yatenda.",
  },
  {
    excerpt: "Mola wetu Mlezi, tupe mema duniani na Akhera mema, na utulinde na adhabu ya Moto.",
  },
  {
    excerpt:
      "Msikate tamaa na rehema ya Mwenyezi Mungu, hakika Mwenyezi Mungu husamehe dhambi zote.",
  },
  {
    excerpt: "Waja wangu - haitakuwa khofu juu yenu leo, wala nyinyi hamtahuzunika.",
  },
  {
    excerpt: "Na waliotangulia, waliotangulia - hao ndio wanaokaribishwa.",
  },
  {
    excerpt: "Basi Mwenyezi Mungu atawalinda na shari ya Siku hiyo na kuwapa nuru na furaha.",
  },
];

export const JANNAH_DUAS_SW: DeepPartial<JannahDuaEntry>[] = [
  {
    context: "Du'a kamili ya wema katika walimwengu wote na ulinzi na Moto.",
  },
  {
    context: "Dua fupi baada ya tashahhud: omba Pepo na hifadhi ya Moto.",
  },
  {
    context: "Omba Pepo kwa Majina mazuri ya Mwenyezi Mungu baada ya tashahhud.",
  },
  {
    context: "Omba utamu wa kumuona Mwenyezi Mungu na kutamani kukutana Naye.",
  },
];

export const JANNAH_PROMISED_SW: DeepPartial<JannahPromisedEntry>[] = [
  {
    name: "Pepo Kumi Iliyoahidiwa",
    summary:
      "Abu Bakr, Umar, Uthman, Ali, Talhah, Zubeir, Abd al-Rahman bin Awf, Sa’d, Said bin Zayd, na Abu Ubaydah (radhi za Allah ziwe juu yao).",
    note: "Imetajwa pamoja katika Hadith katika Sunan al-Tirmidhiy (3747, Sahih).",
  },
  {
    name: "Wakweli na wenye subira",
    summary:
      "Mwenyezi Mungu anawasifu wakweli katika imani na wenye subira katika utiifu na mitihani.",
    note: "Tazama Qur'ani 4:69 na aya nyingi za as-sadiqeen na as-sabireen.",
  },
  {
    name: "Mashahidi katika njia ya Mwenyezi Mungu",
    summary:
      "Wale wanaokufa wakiutetea Uislamu kwa mujibu wa sheria za Kiislamu wanapewa bishara ya Pepo.",
    note: "Wanachuoni wanafafanua shahada kwa usahihi; sio kila kifo katika vita kinastahili moja kwa moja.",
  },
  {
    name: "Wale ambao maneno yao ya mwisho ni tawhiyd",
    summary: "Yeyote ambaye maneno yake ya mwisho ni 'La ilaha illallah' ataingia Peponi.",
    note: "Sunan Abu Daawuud 3116 (sahih). Mwisho mzuri ni harakati ya maisha yote.",
  },
  {
    name: "Manabii",
    summary: "Kila Nabii yuko katika daraja za juu kabisa za Pepo kwa amri ya Mwenyezi Mungu.",
    note: "Kituo chao hakifikiwi na matendo ya kawaida - huchaguliwa na kulindwa.",
  },
];
