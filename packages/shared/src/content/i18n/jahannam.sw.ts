// Swahili translation overlay for the Learn "Jahannam" content. Mirrors the order of
// its English source in ../jahannam*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  JahannamDuaEntry,
  JahannamGateEntry,
  JahannamHadithEntry,
  JahannamNameEntry,
  JahannamReferenceEntry,
  JahannamReflectionEntry,
  JahannamTopic,
  JahannamVerseEntry,
} from "../../types/jahannam";
import type { DeepPartial } from "./localize";

export const JAHANNAM_CORE_TOPICS_SW: DeepPartial<JahannamTopic>[] = [
  {
    title: "Utangulizi",
    summary: "Mwenyezi Mungu anatufahamisha kuhusu Jahannam kwa uwongofu - sio kukata tamaa.",
    body: [
      "Jahannam - ambayo mara nyingi hutafsiriwa kama Jahannam au Moto - ni makazi ya adhabu huko Akhera ambayo Mwenyezi Mungu ameielezea ndani ya Qur'ani na kupitia kwa Mtume wake ﷺ. Anatuambia juu ya hilo tusiuponde moyo kwa hofu, bali ili nyoyo ziamke, zirudi nyuma, na kuchagua njia ya rehema wakati mlango uko wazi.",
      "Inasaidia kuelewa kwa nini Bwana mwenye rehema anazungumza juu ya Moto hata kidogo. Onyo yenyewe ni rehema: mtu anayeambiwa juu ya mwamba gizani amepewa zawadi, sio tishio. Kila aya kuhusu Jahannam ni Mwenyezi Mungu, kwa wema wake, akiwaita waja wake kabla ya kupita muda wa kurudi.",
      "Ndio maana maonyo yanaunganishwa katika ufunuo wote na wito wa toba, msamaha, na matumaini katika rehema kubwa ya Mwenyezi Mungu. Qur'ani ni nadra kuutaja Moto bila ya kuwa karibu, kutaja Pepo, mlango ulio wazi wa tawbah, na mapenzi ya Mwenyezi Mungu kwa wanaorejea. Lengo ni uwajibikaji unaoongoza kwenye haki - usikate tamaa kamwe.",
      "Kuamini Jahannam ni sehemu ya kuamini ghaibu (al-ghayb), haki ya Mwenyezi Mungu, na ukweli wa Siku ya Mwisho. Inazipa uzito uchaguzi wetu na kusawazisha matumaini ya Peponi na uzito wa dhambi, ili Muumini atembee kati ya matumaini na khofu - akiwa na matumaini ya rehema ya Mwenyezi Mungu, akiangalia mapungufu yake mwenyewe.",
      "Jambo kuu la faraja katika imani ya Sunni linapitia katika somo hili zima: wale wanaokufa wakiwa wanamwamini Mwenyezi Mungu pekee, hata kama wamelemewa na dhambi, hawatabaki Motoni milele. Kwa rehema ya Mwenyezi Mungu na uombezi Anaoruhusu, hatimaye Waumini wakosefu wanatolewa; ni wale tu wanaokufa na kukataa imani wanabaki. Kwa hiyo utafiti wa Jahannam, kwa Muumini, hatimaye ni somo la jinsi ya kufikia rehema.",
      "Moduli hii inawasilisha yale ambayo maandiko yanaeleza kwa uwazi, inabainisha kwa uaminifu pale ambapo wanachuoni wametofautiana, inataja ushahidi sahihi tu, na mara kwa mara inakuelekeza kwenye tawbah, matendo mema, na kumtegemea Mwenyezi Mungu.",
    ],
    quran: [
      {
        excerpt:
          "Uogopeni Moto ulioandaliwa kwa ajili ya makafiri, na mtiini Mwenyezi Mungu na Mtume ili mrehemewe.",
      },
      {
        excerpt:
          "Sema: Enyi waja wangu mliojidhulumu nafsi zao, msikate tamaa na rehema ya Mwenyezi Mungu. Hakika Mwenyezi Mungu husamehe dhambi zote.",
      },
      {
        excerpt:
          "Enyi mlio amini, tubuni kwa Mwenyezi Mungu toba ya kweli, huenda Mola wenu Mlezi akakufutieni maovu yenu na akakuingizeni katika Mabustani.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kwanini Allah Ameumba Jahannam",
    summary: "Haki ya Kimungu, uwajibikaji, na matokeo ya uchaguzi huru.",
    body: [
      "Jahannam ipo kama dhihirisho la uadilifu kamili wa Mwenyezi Mungu ('adl). Ulimwengu ambamo dhalimu na mdhulumiwa, wanyofu na wasaliti, wote walikutana na mwisho mmoja haungekuwa wa haki. Kwa sababu Mwenyezi Mungu ni Muadilifu kabisa, lazima kuwe na hesabu ya mwisho ambapo kila ubaya hujibiwa na kila jema huheshimiwa.",
      "Muhimu katika hili ni kwamba Mwenyezi Mungu hamdhulumu yeyote. Kila nafsi inayoingia Motoni inaingia humo kwa khiari yake iliyo pita bila kutubia. Qur’ani inasisitiza: “Mwenyezi Mungu hawadhulumu watu hata kidogo, bali watu wanajidhulumu nafsi zao.” (4:40). Hakuna anayeadhibiwa kwa yale ambayo hakufanya, wala zaidi ya yale yanayostahiki.",
      "Wanadamu hawakuachwa gizani. Mwenyezi Mungu aliwapa akili, na akatuma Mitume, na akateremsha uwongofu ulio wazi, kisha akawatukuza kwa uhuru wa kweli wa kuukubali au kuukataa. na anayetaka basi na akufuru” (18:29). Kudumu katika kukataa ukweli, ukandamizaji, au katika dhambi kubwa bila kutubu kunaleta matokeo huko Akhera kwa sababu kwa hakika uchaguzi ulikuwa wa mtu mwenyewe.",
      "Lakini hata hapa rehema hutengeneza haki. Mwenyezi Mungu anaonya kabla ya kuhukumu, anachelewesha hisabu ili kutoa nafasi ya kurudi, anasamehe kwa upesi anapoombwa, na analipa kheri moja mara nyingi huku akiandika dhambi moja kuwa moja. Haki yake kamwe haitenganishwi na rehema zake.",
      "Kutafakari kwa nini Jahannam ipo kunapaswa kuongeza taqwa (kumcha Mungu) na kuongeza shukurani kwa kila siku ya maisha ambayo bado ni nafasi ya kutubu. Inakusudiwa kuufanya moyo kuwa mzito na wenye tumaini mara moja - usiwahi kuupooza kwa kukata tamaa.",
    ],
    quran: [
      {
        excerpt:
          "Hakika Mwenyezi Mungu hawadhulumu watu hata kidogo, lakini watu wanajidhulumu nafsi zao.",
      },
      {
        excerpt: "Haulizwi kwa anayoyafanya, lakini wao wataulizwa.",
      },
      {
        excerpt: "Anayetaka na aamini; na anayetaka na akufuru. Tumewaandalia madhalimu Moto.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Hataingia Peponi hata mmoja wenu kwa vitendo vyake peke yake. Wakasema: Hata wewe ewe Mtume wa Mwenyezi Mungu? Akasema: Si mimi, isipokuwa Mwenyezi Mungu amenifunika kwa rehema yake.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ukweli wa Akhera",
    summary: "Kutoka kifo hadi hukumu - kila hatua ni ya kweli na inahusishwa na aqiydah.",
    body: [
      "Ili kuelewa Jahannam ipasavyo, inasaidia kuona mahali inapokaa katika safari kubwa zaidi. Uislamu unafundisha mlolongo wa wazi baada ya kifo: roho inatoka kwenye mwili, kisha barzakh (maisha ya muda wa kaburi) huanza, kisha Ufufuo wakati miili itafufuliwa, kukusanya viumbe vyote, Hukumu ambapo vitendo vinachunguzwa, kupima amali kwenye Mizani (al-Mizan), kuvuka kwa Daraja (as-Sirat) na kila nafsi ya Mwenyezi Mungu. amri, haki, na rehema.",
      "Kila moja ya hatua hizi imethibitishwa katika aqiydah ya kawaida ya Kisunni kwa misingi ya Qur-aan na Sunnah sahihi. Ratiba hii sio ishara au hadithi; ni ukweli unaopaswa kuaminiwa kuwa ni sehemu ya kuamini Siku ya Mwisho, na kuikana huku tukijua ni suala la itikadi, si la mazoea tu.",
      "Kuona barabara nzima pia hurekebisha Moto. Ni eneo moja linalowezekana mwishoni mwa safari ambayo kila mtu tayari anasafiri - ambayo inamaanisha kuwa chaguzi za leo sio za kufikirika. Ni hatua kando ya barabara hiyo, na bado ni zetu kuzielekeza.",
      "Kujua mlolongo huu kunamsaidia Muumini kujiandaa badala ya kuogopa: kuishi na kumbukumbu yenye afya ya kifo (dhikr al-mawt), kurekebisha makosa kabla ya kuingizwa kwenye Mkusanyiko, na kujaza hesabu ya matendo mema wakati mlango wa kutenda bado uko wazi. Mauti hufunga mlango huo; hakuna kinachoweza kuongezwa baada yake.",
    ],
    quran: [
      {
        excerpt: "Kisha hakika mtakufa baada ya hayo. Kisha hakika mtafufuliwa Siku ya Kiyama.",
      },
      {
        excerpt:
          "Ama yule ambaye mizani yake ni nzito, atakuwa katika maisha ya furaha. Ama yule ambaye mizani yake ni nyepesi - kimbilio lake ni shimo.",
      },
    ],
    actions: [
      "Jifunze kila hatua katika Jifunze Aqeedah na uunganishe imani na chaguo za kila siku.",
      "Ongeza ukumbusho wa kifo (dhikr al-mawt) bila ya kupuuza matumaini katika rehema.",
    ],
    appLinks: [{}, {}, {}, {}, {}, {}],
  },
  {
    title: "Majina ya Kuzimu",
    summary:
      "Majina ya Qur'ani yenye maana - wanazuoni wanatofautiana kuhusu kama kila moja ni ngazi tofauti.",
    body: [
      "Qur'ani inaitaja Jahannam kwa majina kadhaa, na huku sio kurudiarudia tu. Katika Kiarabu, jina mara nyingi hubeba maelezo ya wazi ndani yake, kwa hivyo kila jina hufundisha kitu kuhusu ukweli unaoelekeza. Miongoni mwao ni Jahannam, Jaheem, Saqar, Sa'ir, al-Hutamah, al-Hawiyah, na Lazaa.",
      "Kila jina hufungua dirisha kwenye kipengele tofauti cha ukali. Jaheem na Sa'ir wanaamsha moto mkali unaowaka; Saqar, kile kisichochoma na kisichoacha chochote; al-Hutamah, kiponda kivunjacho chochote kinachotupwa humo; al-Hawiyah, shimo refu ambalo mtu huanguka; na Lazaa, mwali wa moto safi. Kusoma majina pamoja hujenga taswira nzuri ambayo moyo hauwezi kupuuza kwa urahisi.",
      "Wanachuoni wa kitambo wa tafsir - kama vile Ibn Kathir na al-Tabari - wanaelezea majina haya kutoka kwa mizizi yao ya Kiarabu na wanajadili kila moja katika muktadha wa aya inapoonekana, badala ya kuyachukulia kama orodha ya kiufundi isiyobadilika.",
      "Ni thamani ya neno la tahadhari hapa. Waandishi wengine wa baadaye huwasilisha kila jina kama 'kiwango' cha kuzimu, wakati mwingine na michoro ya kina. Hiyo ni tafsiri ya kielimu, si orodha ya wazi iliyotajwa ndani ya Qur'ani au katika hadithi zilizokubaliwa. Mbinu iliyosawazishwa ni kujifunza maana ambazo matini hutoa na kuepuka kuwasilisha ramani za kubahatisha kama uhakika.",
      "Madhumuni ya kujifunza majina si kukidhi udadisi bali kulainisha moyo na kuusogeza kwenye rehema ile ile moduli hii inaendelea kuelekeza. Vinjari mkusanyiko kamili wa majina kwa kila jina kutokea kwa Qur'ani, muktadha na muhtasari wa tafsir.",
    ],
    quran: [
      {
        excerpt: "Inatosha Jahannamu kama mahali pa kupumzika - Jahannam.",
      },
      {
        excerpt: "Atatupwa katika Hutamah, Moto unao angamiza.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ngazi za Kuzimu",
    summary: "Viwango tofauti vya adhabu - muundo halisi haujaelezewa kikamilifu katika maandishi.",
    body: [
      "Kanuni ambayo Qur'ani inaeleza kwa uwazi ni kwamba adhabu ni sawia: si kila mtu kwenye Moto anaipitia kwa kipimo sawa. “Kwa wote watakuwa na daraja kwa yale waliyokuwa wakiyatenda” (6:132). Hii yenyewe ni kielelezo cha uadilifu - yule aliyedhulumu kidogo hachukuliwi kama yule aliyedhulumu sana.",
      "Sunnah sahihi inaeleza kanuni hiyo hiyo. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) amemtaja mtu aliyeadhibiwa kidogo sana na Moto kuwa ni yule ambaye chini ya miguu yake pamewekwa makaa mawili, ambayo ubongo wake unachemka – na bado yeye ndiye mwenye adhabu nyepesi kuliko watu wake wote (Swahiyh al-Bukhari 6562). Ikiwa hilo ndilo jambo dogo zaidi, akili hufahamu jinsi viwango vikubwa zaidi vinapaswa kuwa, na kuna sababu ngapi ya kurejea leo.",
      "Wakati huo huo, ufunuo hauwapi waumini ramani kamili, yenye nambari ya muundo wa Kuzimu ambayo wanalazimika kukariri. Wanachuoni wamejadili viwango, kina, na kategoria zilizotolewa kutoka kwa aya na ripoti mbalimbali, lakini mengi ya haya yanabaki kuwa tafsiri badala ya maandishi yaliyokubalika, yaliyo wazi.",
      "Mambo mawili, hata hivyo, ni ya uhakika. Kwanza, dhulma hiyo (dhulm), shirki, na madhambi makubwa yanayoendelea bila kutubia yana onyo kali. Pili - na kamwe isisahaulike - kwamba rehema na msamaha wa Mwenyezi Mungu hubaki wazi hadi wakati wa kifo kwa yeyote anayerejea Kwake kwa uaminifu. Jambo la kujifunza kuhusu digrii ni kuchagua njia nyepesi huku chaguo likibaki.",
      "Kivitendo, hii ina maana ya kutilia maanani orodha za kina za 'viwango saba' au mipango inayofanana na hiyo kama maoni ya wasomi badala ya mafundisho yaliyotulia, na kuzingatia kile hasa kinacholinda: imani, toba, na matendo ya haki.",
    ],
    quran: [
      {
        excerpt: "Kwa wote kutakuwa na digrii kulingana na walivyofanya.",
      },
      {
        excerpt:
          "Hakika wanaafiki watakuwa katika kina cha chini kabisa cha Moto, wala hutapata wa kuwanusuru.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Atakayeadhibiwa mdogo kabisa katika watu wa Motoni ni mtu ambaye chini ya miguu yake pamewekwa makaa mawili, ambayo ubongo wake unachemka.",
      },
    ],
    disclaimer:
      "Michoro ya viwango vya Kuzimu inayopatikana katika baadhi ya vitabu inaonyesha tafsiri ya kitaalamu, si makubaliano ya pamoja.",
  },
  {
    title: "Milango ya Kuzimu",
    summary: "Milango saba - yale ambayo Qur'ani inaeleza na ambapo tafsiri inatofautiana.",
    body: [
      "Maelezo moja kuhusu Jahannam yameelezwa kwa uwazi na bila utata ndani ya Qur'ani: 'Hakika Jahannamu ina milango saba; kwani kila mlango ni sehemu yao maalumu” (15:44). Kwa hiyo, kuamini milango saba kunatokana na ufunuo ulio wazi, na sio katika kubahatisha.",
      "Aya inasadikisha mambo mawili: kwamba kuna milango saba, na kwamba wanaoingia wamegawiwa. Wanachuoni wa kitamaduni wa tafsir wanajadili maana ya ugawaji - kama unaelekeza kwenye kategoria za watu, viwango vya adhabu vinavyolingana na vitendo, au vyote viwili. Hekima iliyo nyuma ya mgawanyiko ni ya Mwenyezi Mungu ambaye uadilifu wake unaiweka kila nafsi pale inapostahili.",
      "Ni muhimu kutambua ambapo uhakika unaisha. Kazi zingine za baadaye zinaweka kila lango maalum kwa dhambi au kikundi fulani. Kazi hizi mahususi hazijaanzishwa kwa usawa katika vyanzo vya awali, kwa hivyo zinawasilishwa vyema kama maoni ya wasomi binafsi badala ya maelezo ya kinabii.",
      "Kama ilivyo kwa viwango, somo la milango si la usanifu bali ni la kimaadili: kuna milango mingi inayoongoza kuelekea Motoni, na njia ya kuwa salama kutokana na yote ni sawa - imani ya kweli, kuepuka dhambi kubwa, na toba ya haraka wakati mtu anapoteleza.",
    ],
    quran: [
      {
        excerpt:
          "Na hakika Jahannamu ndio mahala pao pa ahadi kwa wote. Ina milango saba; kwani kila lango lina fungu.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Maelezo ya Jahannam",
    summary: "Moto, joto, minyororo, majuto - iliyotolewa kwa heshima, sio hisia.",
    body: [
      "Qur'ani Tukufu na Sunnah sahihi zinaielezea Jahannam kwa lugha ya wazi na thabiti, na wanafanya hivyo kwa sababu fulani: moyo wa mwanadamu unasukumwa zaidi na picha unazoweza kuzipiga picha kuliko mawazo ya kufikirika. Maelezo - moto mkali, joto lisiloweza kuvumiliwa, chakula na vinywaji vilivyozuiliwa, minyororo, giza, na majuto makubwa - yanalenga kufanya hatari kuwa halisi ya kutosha kutuelekeza mbali nayo.",
      "Miongoni mwa maelezo hayo ni maji yanayochemka yanayonyweshwa, mti mchungu wa zaqqum kama chakula, nguo zilizokatwa moto, na kujitenga na kila starehe aliyokuwa akiitegemea mtu. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) ameeleza jinsi joto hili linavyopita chochote tunachokijua, akisema kwamba moto tunaouwasha hapa duniani ni sehemu moja tu ya sehemu sabini za Moto wa Akhera (Sahih al-Bukhari 3265).",
      "Maelezo haya ni maonyo halisi, si mafumbo tu ambayo yanaondoa matokeo ya Akhera. Wanachuoni wa Kisunni wanathibitisha ukweli wao huku wakiiacha hali halisi ya ghaibu kwa ujuzi wa Mwenyezi Mungu; kazi ya mwamini ni kuchukua onyo kwa moyo, si kulichambua.",
      "Kuna adabu (adab) ya kusoma vifungu hivyo. Wanafikiwa kwa unyenyekevu, khofu kwa Mwenyezi Mungu, na msukumo wa haraka wa kutubu na kutafuta hifadhi - sio kwa mvuto mbaya, na kamwe kwa kukata tamaa, kwani madhumuni yote ya onyo ni kwamba bado tuna wakati wa kuliepuka.",
      "Labda mada nzito zaidi katika maelezo haya ni majuto. 'Laiti ningekuwa…' itasemwa wakati wa kuchukua hatua tayari umekwisha. Rehema ya kusikia kuhusu majuto hayo sasa ni kwamba tunaweza kutenda kulingana na 'ikiwa tu' leo, ilhali inaweza kubadilisha mwisho wetu.",
    ],
    quran: [
      {
        excerpt:
          "Kabla yake ipo Jahannamu, na atanyweshwa maji machafu. Ataimeza lakini hataimeza.",
      },
      {
        excerpt:
          "Nguo za moto zitakatwa kwa ajili yao, na maji yanayo chemka yatamiminwa juu ya vichwa vyao.",
      },
      {
        excerpt:
          "Jahannamu siku hiyo italetwa - Siku hiyo mwanadamu atakumbuka, lakini ni kheri gani kwake kukumbuka?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Moto wako ni sehemu moja ya sehemu sabini za moto wa Jahannamu. Ikasemwa: Ewe Mtume wa Mwenyezi Mungu, moto huu ungetosha. Akasema: Imepewa nguvu ya sehemu sitini na tisa zaidi yake, kila sehemu ni kama joto lake.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Nani Anaonywa?",
    summary: "Makundi katika Qur'ani na Sunnah - sio hukumu kwa watu binafsi.",
    body: [
      "Msomaji makini wa Qur'ani anaona kwamba maonyo yake yanalenga tabia na mienendo, sio kwa watu waliotajwa. Inawatahadharisha wale wanaong’ang’ania ukafiri baada ya kuwabainikia ukweli, wanafiki wanaokiri imani kwa nje huku wakiikataa kwa ndani, madhalimu wanaokanyaga haki za wengine, wenye kiburi wanaojivuna kusalimu amri, na wanaokufa juu ya dhambi kubwa bila ya kutubia.",
      "Kuzingatia huku kwa kategoria badala ya watu ni kwa makusudi na huruma. Mlango wa kurudi unabaki wazi kwa kila mtu aliye hai, haijalishi maisha yake ya zamani, kwa sababu hakuna faili la mtu lililofungwa hadi kifo. Onyo hilo linaelezea barabara, ili mtu yeyote ambaye bado anaitembea aweze kuondoka.",
      "Kwa sababu hii, Uislamu hauturuhusu sisi kutangaza hatima ya mtu yeyote makhsusi - kusema 'mtu huyu yuko Motoni' - isipokuwa katika matukio ya nadra ambapo Mwenyezi Mungu au Mtume Wake (Swalla Allaahu 'alayhi wa aalihi wa sallam) waliieleza kwa uwazi katika wahyi sahihi. Nyoyo zinazo hukumu na mwisho ni wa Mwenyezi Mungu peke yake; kazi yetu ni hesabu yetu wenyewe.",
      "Kwa hivyo njia sahihi ya kusoma kila onyo ni kuligeuza ndani: sio 'hii inaelezea nani?' lakini 'je, lolote kati ya haya linanielezea, na nitabadilisha nini leo?' Yeyote wewe ni nani, mwaliko wa kurejea kwa Mwenyezi Mungu uko wazi sasa hivi - na kesho hakuahidiwa yeyote.",
    ],
    quran: [
      {
        excerpt: "Wanaafiki watakuwa katika kina cha chini kabisa cha Moto.",
      },
      {
        excerpt: "Wanaochuma madhambi na kumezwa nayo, hao ndio watu wa Motoni, wadumuo milele.",
      },
      {
        excerpt:
          "Usimdhanie Mwenyezi Mungu kughafilika na wanayoyafanya madhalimu. Hakika Yeye anawachelewesha ila Siku ambayo macho yatakodoa.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Dhambi Kuu",
    summary: "Kabair - dhambi kubwa zinazohitaji tawbah ya kweli.",
    body: [
      "Wanachuoni hugawanya dhambi katika makundi mawili, na kuelewa tofauti huleta uzito na utulivu. Madhambi makubwa (al-kaba’ir) ni yale ambayo Mwenyezi Mungu au Mtume wake (Swalla Allaahu ‘alayhi wa aalihi wa sallam) ameambatanisha na matokeo makhsusi katika - tishio la Moto, laana, ghadhabu ya Mwenyezi Mungu, au adhabu iliyoamriwa - kama vile shirki, kuua na kula riba. Dhambi ndogondogo (al-sagha'ir) ni miteremko midogo inayopungukiwa na kizingiti hicho.",
      "Afueni iko katika jinsi wawili hao wanavyohusiana. Mwenyezi Mungu anaahidi kwamba ikiwa Muumini atajiepusha na madhambi makubwa, madogo yanafutika kwa ibada za kawaida: “Mkiepuka madhambi makubwa mnayoharamishiwa, tutakuondoleeni madhambi yenu madogo” (4:31). Swalah ya Swalah, Jumu'ah hadi Jumaa, na Ramadhani hadi Ramadhani hufuta yaliyomo baina yao, madhambi makubwa yanaepukika.",
      "Ndiyo maana madhambi makubwa yanastahiki kuangaliwa kwa umakini: ni zile ambazo hazijaoshwa tu katika mtiririko wa ibada ya kila siku bali zinataka toba ya makusudi na ya kweli (tawbah). Wakiendelea bila kurudi nyuma, wanahatarisha nafsi; walioachwa na kutubu, wamesamehewa.",
      "Na huu ndio upeo wa hayo yote: isipokuwa kufa juu ya shirki, kila dhambi kubwa au ndogo huangukia kwenye msamaha wa Mwenyezi Mungu akipenda. “Hakika Mwenyezi Mungu hasamehi ushirika naye, lakini husamehe yaliyo duni kuliko hayo kwa amtakaye.” (4:48). Hakuna mwamini anayepaswa kuhitimisha kwamba dhambi zao kuu zinawaweka zaidi ya huruma.",
      "Kila mada kuu ya dhambi katika somo hili inatoa ufafanuzi wake, ushahidi wake, kwa nini ni mbaya, na njia madhubuti ya toba na kuepukana - daima ikiishia kwenye mlango ule ule ulio wazi.",
    ],
    quran: [
      {
        excerpt:
          "Mkijiepusha na madhambi makubwa mnayokatazwa, tutakuondoleeni madhambi yenu madogo na tutakuingizeni kwenye mlango mzuri.",
      },
      {
        excerpt:
          "Hakika Mwenyezi Mungu hasamehi ushirika naye, lakini husamehe yaliyo duni kuliko hayo kwa amtakaye.",
      },
      {
        excerpt:
          "Ambao wanajiepusha na madhambi makubwa na uchafu, ila wakifanya madogo, hakika Mola wako Mlezi ni Mkubwa wa kusamehe.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dhambi kubwa miongoni mwa madhambi makubwa ni kumshirikisha Mwenyezi Mungu, kuua nafsi, kuwaasi wazazi na kutoa ushahidi wa uwongo.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dhambi za Lugha",
    summary:
      "Kusengenya, kusema uwongo, dhihaka - dhambi ambazo ni rahisi kufanya na ngumu kutengua.",
    body: [
      "Ulimi ni mdogo lakini matokeo yake ni makubwa; kwa maneno machache mtu anaweza kujenga uaminifu au kuharibu sifa, kufariji moyo au kuumia sana. Hii ndiyo sababu Qur-aan na Sunnah mara nyingi hurudi kwenye dhambi za usemi: kusengenya (ghibah), kashfa (buhtan), kubeba hadithi (namimah), uwongo, dhihaka, na viapo vya uwongo.",
      "Kusengenya kunamaanisha kutaja juu ya kaka au dada yako kitu ambacho hawatakipenda, hata kama ni kweli - kwani ikiwa ni ya uwongo, itakuwa dhambi mbaya zaidi ya kashfa. Qur’ani inaipa moja ya picha zake za kushangaza: inaifananisha na kula nyama ya ndugu aliyekufa (49:12). Ikiwa imeandaliwa kwa njia hiyo, dhambi hiyo inapoteza hali yake ya kawaida.",
      "Kinachofanya dhambi hizi kuwa hatari ni jinsi zilivyo rahisi na mazoea. Watu huingia ndani yao katika mazungumzo ya kawaida bila ya kufikiria tena, ndiyo maana Mtume (Swalla Allaahu ´alayhi wa sallam) akafungamanisha imani yenyewe na maneno ya kulinda: 'Mwenye kumuamini Mwenyezi Mungu na Siku ya Mwisho, basi na aseme mema au anyamaze.' Kutua kidogo kabla ya kuzungumza ni tendo la kweli la ibada.",
      "Kutubu kutokana na dhambi ya ulimi hufuata masharti ya kawaida - kuacha, kujuta, kuazimia kutorudi - kwa mwelekeo wa ziada wakati haki ya mtu mwingine inahusika. Ambapo kusafisha jina lao au kutafuta msamaha wao kunaweza kufanywa bila kusababisha madhara makubwa zaidi, hiyo ni sehemu ya toba; ambapo kuwafahamisha kungezidisha maudhi, wanachuoni wanashauri badala ya kuwasema vyema, kuwatetea wakiwa hawapo, na kuwaombea msamaha.",
    ],
    quran: [
      {
        excerpt: "Msisemezane. Je! mmoja wenu anapenda kula nyama ya nduguye aliyekufa?",
      },
      {
        excerpt: "Ole wake kila mwenye dharau na mzaha.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mwenye kumuamini Mwenyezi Mungu na Siku ya Mwisho, basi na aseme mema au anyamaze.",
      },
    ],
    actions: [
      "Kabla ya kuzungumza, uliza: Je! Je, ni lazima? Je, ni fadhili?",
      "Ukimsengenya mtu, mfanyie dua na umuombee msamaha inapowezekana.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Dhambi Dhidi ya Wengine",
    summary: "Haki za watu zinahitaji kurejeshwa - sio tu toba kwa Mwenyezi Mungu.",
    body: [
      "Uislamu unagawanya haki tunazodaiwa katika aina mbili: haki za Allah (huquq Allah) na haki za watu (huquq al-'ibad). Ukandamizaji (dhulm), dhulma, kuvunja amana, kudanganya katika biashara, kunyima mishahara, madeni ambayo hayajalipwa, na kukata mahusiano ya kifamilia yote iko chini ya haki za watu - na haya yana uzito fulani huko Akhera.",
      "Sababu imeonyeshwa katika Hadith yenye kutia maanani. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) amemtaja mtu aliyefilisika kuwa ni yule anayefika Siku ya Kiyama na Swalah, Saumu na Sadaka, lakini alikuwa amekashifu, akakashifu, amechukua mali kwa njia isiyo halali na kumwaga damu. Wahasiriwa wake hulipwa kutokana na matendo yake mema mpaka yanaisha, kisha dhambi zao zinabebeshwa juu yake na kutupwa Motoni (Sahih Muislamu 2581). Mtu anaweza kuwa tajiri katika ibada na bado akaharibiwa na jinsi alivyowatendea wengine.",
      "Hii inafundisha somo muhimu kuhusu toba: kurejea kwa Mwenyezi Mungu ni muhimu, lakini wakati haki ya binadamu imekiukwa, yenyewe haitoshi. Dai la mtu aliyedhulumiwa linabakia mpaka litatuliwe au lisamehewe. Kwa hivyo toba hapa ina sharti la nne zaidi ya kuacha, kujuta, na kusuluhisha - kurudisha kile kinachodaiwa.",
      "Kwa mazoezi hilo lamaanisha kurudisha kile kilichochukuliwa au thamani yake, kulipa deni hata hatua kwa hatua, kurejesha sifa ambazo mtu ameharibu, na kufikia kupatana na watu wa ukoo mtu amekata. Na katika hili pia kuna rehema: kila hatua ya urejeshaji yenyewe ni amali njema, na Mwenyezi Mungu huutuliza moyo wa ikhlasi unaojipanga kutengeneza uliyoivunja.",
    ],
    quran: [
      {
        excerpt:
          "Ikiwa nyinyi hamuachi Riba, basi angalieni vita kutoka kwa Mwenyezi Mungu na Mtume wake.",
      },
      {
        excerpt: "Wale wanao vunja ahadi ya Mwenyezi Mungu na kukata Aliyo amrisha wanajiunga.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Je, unamfahamu aliyefilisika ni nani? Yule anayekuja na swala, saumu, na sadaka, lakini alitukana, akakashifu, akala mali kwa haramu, na kumwaga damu - basi amali zake njema hupewa wengine.",
      },
    ],
    actions: [
      "Orodhesha mtu yeyote ambaye huenda umemkosea na uchukue hatua ya kurekebisha wiki hii.",
      "Lipa madeni ambayo hujalipa hata kwa awamu ndogo ikiwa ni hivyo tu unaweza kusimamia.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Unafiki",
    summary: "Unafiki mkuu katika imani - na sifa za unafiki katika tabia.",
    body: [
      "Wanachuoni hutofautisha aina mbili za unafiki, na kuziweka kando huzuia faraja ya uwongo na hofu ya uwongo. Ya kwanza ni unafiki mkubwa wa imani (nifaq i'tiqadi): kuudhihirisha Uislamu kwa nje huku ndani ukiikataa imani. Huu ndio unafiki ambao Qur'ani inaonya kuuhusu sana, kuwaweka watu kama hao 'katika vilindi vya Moto' (4:145), kwani hakika walikufa wakiwa makafiri nyuma ya mask.",
      "Ya pili ni unafiki mdogo wa kitabia (nifaq 'amali): sifa zinazofanana na mwenendo wa wanafiki hata kwa mtu ambaye imani yake ni ya kweli. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) alizitaja dalili zinazojulikana: ‘anaposema husema uwongo, anapoahidi huvunja, na anapokabidhiwa husaliti’ na katika riwaya nyingine aliongeza uchafu katika mabishano. Muumini anaweza kuanguka katika haya na bado akawa muumini, lakini ni onyo zito la kujilinda.",
      "Tofauti hii ni muhimu sana kwa jinsi tunavyotumia mada. Ishara za tabia hutolewa kama kioo cha mtu mwenyewe, sio kama lebo ya kuwabandika wengine. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) na Maswahaba zake waliogopa unafiki ndani yao kwa hakika kwa sababu moyo umefichika na unaweza kubadilika.",
      "Kwa hiyo jibu lenye afya ni la ndani: kuangalia uaminifu wa mtu mwenyewe, uaminifu kwa ahadi, na uaminifu, na kumwomba Mwenyezi Mungu ikhlasi (ikhlas). Mwenyezi Mungu pekee ndiye anayejua yaliyomo ndani ya mtu, na kuwatuhumu watu makhsusi kwa unafiki yenyewe ni uasi mkubwa dhidi yao.",
    ],
    quran: [
      {
        excerpt: "Wanaafiki watakuwa katika kina cha chini kabisa cha Moto.",
      },
      {
        excerpt:
          "Wanapokujia wanaafiki husema: Tunashuhudia kwamba wewe ni Mtume wa Mwenyezi Mungu, na Mwenyezi Mungu anajua kuwa ni waongo.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Alama za mnafiki ni tatu: anaposema husema uwongo, anapoahidi huvunja, na anapokabidhiwa hufanya khiyana.",
      },
    ],
    disclaimer:
      "Usiwatuhumu watu binafsi kwa nifaq. Maandiko hayo yanaonya jamii; utakaso huanza na wewe mwenyewe.",
  },
  {
    title: "Adhabu Zimetajwa",
    summary: "Maandiko yanaelezea nini - soma kwa kumcha Mwenyezi Mungu na kutarajia rehema yake.",
    body: [
      "Qur'ani Tukufu na Sunnah zinataja matokeo mahususi kwa makosa makhsusi - kwa wale wanaokula riba, wanaokashifu wanawake wasafi, wanaojilimbikizia mali na kuzinyima haki yake, wanaopuuza Swala, na wanaoendelea kufanya dhambi kubwa. Umaalumu ni aina ya uwazi: haimwachi mtu yeyote anayeweza kusema hawakuonywa juu ya jambo lile walilokuwa wakifanya.",
      "Baadhi ya matokeo haya yameelezwa katika kaburi (adhab al-qabr) na mengine katika Jahannam yenyewe. Aqiydah kuu ya Kisunni inathibitisha ukweli wa zote mbili, huku ikikabidhi 'jinsi' halisi ya mambo haya ya ghaibu kwa ujuzi wa Mwenyezi Mungu badala ya mawazo ya mwanadamu.",
      "Jinsi muumini anavyojishughulisha na haya yote ndio muhimu. Kusudi sio kamwe kukaa juu ya maelezo ya picha au kuruhusu moyo kuzama; ni kupokea onyo, kutubu kutokana na chochote kinachohusika, na kisha kuelekeza nguvu kwenye matendo ambayo kwa hakika yanalinda. Ndio maana moduli hii kwa makusudi inatoa nafasi zaidi kwa ulinzi, toba, na rehema kuliko adhabu.",
      "Kwa ufupi, uondoaji sahihi wa adhabu yoyote iliyotajwa ni swali, sio woga: 'Je, ninafanya hivi - na kama ni hivyo, nitaachaje na kulisahihisha?' Likijibiwa kwa uaminifu leo, onyo hilo tayari limefanya kazi yake ya rehema.",
    ],
    quran: [
      {
        excerpt:
          "Wale wanaowasingizia wanawake wema na wasilete mashahidi wanne, basi wapigeni bakora themanini.",
      },
      {
        excerpt:
          "Wale wanao kusanya dhahabu na fedha, wala hawazitumii katika Njia ya Mwenyezi Mungu, wabashirie adhabu iumizayo.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ulinzi kutoka Kuzimu",
    summary: "Tawhiyd, swala, tawbah, sadaka, Qur'ani, na du'a - kiini cha somo hili.",
    body: [
      "Baada ya maonyo yote, huu ndio kiini cha jambo: Jahannam ni kitu ambacho mtu amekusudiwa kulindwa nacho, na Uislamu umejaa njia za ulinzi huo. Kubwa katika wao ni tawhiyd iliyo sawa - kumuabudu Mwenyezi Mungu peke yake, pasipo chochote badala yake. Kila amali nyingine inakubaliwa na kupimwa juu ya msingi huu tu, na ndiyo maana kulinda imani ya mtu kunakuja kabla ya kila kitu kingine.",
      "Juu ya msingi huo, ngao za kivitendo ni nyingi na zinazoweza kufikiwa: kusimamisha sala tano za kila siku, toba ya kweli, kutoa sadaka - ambayo Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) amesema huzima dhambi kama vile maji yanavyozima moto - saumu, kusoma Qur'ani na kuifanyia kazi, tabia njema, rehema kwa wengine, kukumbuka mara kwa mara (dhikr), na kuomba msamaha daima. Hakuna chochote kati ya haya kinachohitaji utajiri mkubwa au ujuzi; ziko wazi kwa kila mtu.",
      "Mtume ﷺ pia alifundisha dua za moja kwa moja za kujikinga na Moto, na akatuhimiza kuswali mara kwa mara. Amesema mwenye kumuomba Mwenyezi Mungu Pepo mara tatu, Pepo yenyewe inamuombea uingilio, na anayeomba kujikinga na Moto mara tatu, Moto wenyewe huomba aepushwe (Jami’ at-Tirmidhiy 2572). Du'a hizi zina nafasi maalum kabla ya salam katika swala na adhkar ya asubuhi na jioni.",
      "Angalia usawa wa Sharia. Njia za ulinzi ni nyingi zaidi, zimesisitizwa zaidi, na zinapatikana zaidi kuliko sababu za uharibifu - na hii yenyewe ni ishara ya rehema ya Mwenyezi Mungu. Ni rahisi sana kuokolewa kuliko kupotea.",
      "Sehemu hii kwa makusudi ndiyo kubwa zaidi katika moduli, kwa sababu hivyo ndivyo Uislamu wenyewe unavyolipima jambo hilo: onyo daima linaambatana na matumaini, na kamwe halijatenganishwa na hatua madhubuti ambayo mtu anaweza kuanza leo.",
    ],
    quran: [
      {
        excerpt:
          "Wale wanao sema: Mola wetu Mlezi, tumeamini, basi tusamehe madhambi yetu na utulinde na adhabu ya Moto.",
      },
      {
        excerpt:
          "Mola wetu Mlezi, tupe mema duniani na Akhera mema, na utulinde na adhabu ya Moto.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mwenye kumuomba Mwenyezi Mungu Pepo mara tatu, basi husema: Ewe Mwenyezi Mungu, muingize Peponi. Mwenye kujikinga na Moto mara tatu, Moto husema: Ewe Mwenyezi Mungu, mkinge na Moto.",
      },
    ],
    actions: [
      "Kukariri du'a ya kuomba hifadhi kutoka kwa Jahannam kabla ya salamu katika swala.",
      "Omba sala tano za kila siku kwa wakati - kati ya ngao kali zaidi.",
      "Toa hisani mara kwa mara, hata kwa kiasi kidogo.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Toba (Tawbah)",
    summary: "Mwenyezi Mungu anakubali toba ya kweli - hakuna dhambi kubwa sana kabla ya kifo.",
    body: [
      "Tawbah - toba - ni utaratibu ambao Mwenyezi Mungu ameujenga katika dini ili kwamba hakuna dhambi ya kudumu. Katika kiini chake ni kugeuza moyo kurudi kwa Mwenyezi Mungu, na wanachuoni wanapata masharti yake kutoka kwa Qur'ani na Sunnah: acheni dhambi kwa ikhlasi, jisikieni majuto ya kweli juu yake, na aazimie kwa dhati kutorejea tena. Wakati dhambi inapohusika na haki ya mtu mwingine, sharti la nne linaongezwa - kurejesha haki hiyo au kutafuta msamaha wao.",
      "Kinachofanya tawbah kuwa na matumaini ni namna Mwenyezi Mungu anavyoipokea. Hamvumilii tu mja anayerejea; Anafurahi. Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) amesema Mwenyezi Mungu anafurahishwa sana na toba ya mja wake kuliko mtu ambaye, baada ya kupoteza mlima wake pamoja na riziki zake katika jangwa lisilo na matunda na akakata tamaa, ghafla akaukuta umesimama mbele yake (Swahiyh al-Bukhari 6309). Huo ndio ukaribisho unaomngojea yeyote anayegeuka nyuma.",
      "Mlango wake, zaidi ya hayo, haufungi kamwe wakati wa maisha. Mtume (Swalla Allaahu ´alayhi wa sallam) amesema Mwenyezi Mungu hunyosha mkono wake usiku ili kupokea toba ya mtenda dhambi wa mchana, na hunyoosha mkono wake mchana ili kupokea toba ya mtenda dhambi wa usiku (Sahih Muislamu 2759). Toba inakubaliwa kwa mtu binafsi mpaka roho ifike kooni wakati wa kufa, na kwa ubinadamu mpaka jua lichomoze kutoka magharibi - kwa hivyo hakuna sababu ya kuchelewesha.",
      "Hii ni kweli hata kwa yule ambaye ameanguka na kutubu mara nyingi. Maadamu marejeo ni ya kweli kila wakati, Mwenyezi Mungu huendelea kupokea; kukata tamaa kunatokana na Shetani, sio katika dini. Jambo moja linalopaswa kutatuliwa kabla ya kifo ni shirki, kwani mtu anayekufa juu yake hufa bila ya imani inayohitajiwa na toba - ndio maana hasa kurejea kwa Mwenyezi Mungu pekee ndiyo marejeo ya haraka kuliko yote.",
      "Uondoaji wa vitendo ni rahisi: tubu sasa, tubu mara kwa mara, na usiruhusu ukubwa wa dhambi, au idadi ya maporomoko ya zamani, kukupinga ili usirudi tena. Mwaliko uko wazi kila wakati.",
    ],
    quran: [
      {
        excerpt:
          "Msikate tamaa na rehema za Mwenyezi Mungu. Hakika Mwenyezi Mungu husamehe dhambi zote. Yeye ni Mwenye kusamehe, Mwenye kurehemu.",
      },
      {
        excerpt:
          "Isipokuwa wale walio tubu, na wakaamini, na wakatenda mema, Mwenyezi Mungu atawabadilishia maovu yao mema.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mwenyezi Mungu ameridhika zaidi na toba ya mja wake kuliko mmoja wenu anayeukuta mlima wake uliopotea katika ardhi kame.",
      },
      {
        excerpt:
          "Mwenyezi Mungu hunyoosha mkono wake usiku ili kupokea toba ya mtenda dhambi wa mchana, na ananyoosha mkono wake mchana kupokea toba ya mtenda dhambi wa usiku, mpaka jua lichomoze kutoka magharibi yake.",
      },
    ],
    actions: [
      "Sema Astaghfirullah siku nzima - lenga uthabiti, sio tu baada ya mteremko mkubwa.",
      "Jifunze Sayyid al-Istighfar na uisome asubuhi na jioni.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Tumaini rehema za Mwenyezi Mungu",
    summary: "Usikate tamaa kamwe - matendo mema hufuta dhambi; mambo ya uthabiti.",
    body: [
      'Kila kitu katika moduli hii kinaelekeza hapa. Mwenyezi Mungu ni ar-Rahman ar-Raheem - Mwingi wa kurehemu - na ametuambia kwamba rehema yake ni kubwa kuliko ghadhabu yake na "inakizunguka kila kitu" (7:156). Muumini anakusudiwa kuishi kati ya tumaini na woga, kama mabawa mawili ya ndege: mwenye hofu ya kutosha ya dhambi kukaa macho, akiwa na matumaini ya kutosha katika msamaha na asikate tamaa kamwe.',
      "Kwa sababu hii, kukata tamaa ni yenyewe nje ya mahali. Hata kama mtu anahisi kuwa amepotoka, mlango wa nyuma uko wazi, na ni Shetani - sio Mwenyezi Mungu - anayenong'oneza kwamba amechelewa. Kukata tamaa ya rehema ni kumfikiria kidogo sana Mwingi wa Rehema; kazi ya moyo wa dhati ni kurudi tu.",
      "Hapa kuna faraja kubwa ya imani ya Sunni kuhusu Moto. Kwa wale walio kufa katika ukafiri, Jahannam ni makazi ya kudumu. Lakini Muumini aliye kufa hali ya kuwa Mwenyezi Mungu peke yake, hata akiwa ameelemewa na madhambi makubwa, hatadumu humo milele. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) alifundisha kwamba watu watatolewa motoni kwa uombezi na kisha kwa rehema ya Mwenyezi Mungu mwenyewe - kutupwa kwenye Mto wa Uzima kwenye ukingo wa Pepo, ambapo watarejeshwa na kuingia humo (Sahih al-Bukhari 7439). Alisema hakuna atakayebakia Motoni ambaye ana uzito wa imani hata ya punje ya haradali moyoni (Sahih Muislamu 183). Kwa muuhidi, basi, Moto - ikiwa utaingizwa hata kidogo - sio mwisho wa hadithi.",
      "Wakati huo huo, rehema inajengwa katika maisha ya kila siku: matendo mema yanafuta mabaya (11:114), na ibada ndogo, yenye msimamo - sala moja inayoswaliwa kwa wakati, tendo moja la utulivu la sadaka, dakika moja ya subira iliyofanyika kwa ajili ya Mwenyezi Mungu - inamvuta mtu karibu naye na zaidi kutoka kwa madhara. Uthabiti ni muhimu zaidi kuliko nguvu.",
      "Kwa hivyo acha hili liwe hitimisho la somo lako: chukua onyo kwa umakini, lakini acha tumaini liwe kubwa kuliko hofu. Ijueni hatari, chagua njia ya rehema, na itembee - hatua kwa wakati - kila siku mpaka ukutane na Mwenyezi Mungu.",
    ],
    quran: [
      {
        excerpt: "Rehema yangu imekizunguka kila kitu.",
      },
      {
        excerpt:
          "Sema: Enyi waja wangu mliojidhulumu nafsi zao, msikate tamaa na rehema ya Mwenyezi Mungu. Hakika Mwenyezi Mungu husamehe dhambi zote.",
      },
      {
        excerpt: "Hakika mema huondoa maovu. Huo ni ukumbusho kwa wanao kumbuka.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mwenyezi Mungu atasema: Malaika wameombea, Mitume wameombea, na Waumini wameombea, na hakuna aliyesalia ila Mwingi wa Rehema kuliko wanaorehemu. Atachukua konzi kutoka Motoni na atawatoa watu ambao hawakufanya wema wowote.",
      },
      {
        excerpt: "Mwenye Imani moyoni mwake uzito wa chembe ya haradali atatolewa Motoni.",
      },
    ],
    actions: [
      "Malizia kila siku kwa istighfar na shukurani kwa kila baraka.",
      "Oanisha sehemu hii na Safari ya kwenda Jannah - onyo na matumaini pamoja.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Dhambi zenye kuangamiza",
    summary: "Jilinde na madhambi makubwa yanayokuondoa kwenye rehema za Allah.",
    body: [
      "Madhambi makubwa yameonywa vikali katika Qurani na Sunna.",
      "Mlango wa toba uko wazi hadi kifo.",
      "Acha dhambi, juta na azimia kutorudia.",
      "Kurudisha haki za watu ni sehemu ya toba.",
      "Usikate tamaa na rehema za Allah.",
    ],
    destructiveItems: [
      {
        title: "Shirki",
        summary: "Kumshirikisha Allah.",
      },
      {
        title: "Uchawi",
        summary: "Kufanya au kutafuta uchawi.",
      },
      {
        title: "Mauaji",
        summary: "Kuua nafsi isiyo na hatia.",
      },
      {
        title: "Riba",
        summary: "Kuchukua au kutoa riba.",
      },
      {
        title: "Mali ya yatima",
        summary: "Kula mali ya yatima bila haki.",
      },
      {
        title: "Kukimbia vita",
        summary: "Kukimbia mapambano halali.",
      },
      {
        title: "Kuchafua heshima",
        summary: "Kumzulia mwema uzinzi.",
      },
      {
        title: "Mufilisi",
        summary: "Kupoteza thawabu kwa haki za watu.",
      },
    ],
    quran: [
      {
        excerpt: "Allah hasamehe kushirikishwa.",
      },
      {
        excerpt: "Kumuua mmoja bila haki ni kama kuua watu wote.",
      },
      {
        excerpt: "Walao mali ya yatima kwa dhuluma wanakula moto.",
      },
    ],
    hadith: [
      {
        excerpt: "Jiepusheni na madhambi saba yenye kuangamiza.",
      },
      {
        excerpt: "Mufilisi huja na swala lakini amewadhulumu watu.",
      },
      {
        excerpt: "Jilindeni na shirki.",
      },
      {
        excerpt: "Mwenye kutubu ni kama asiye na dhambi.",
      },
      {
        excerpt: "Allah hufurahia toba ya mja Wake.",
      },
    ],
    actions: ["Tubu kwa kweli.", "Rudisha haki za watu.", "Epuka njia za dhambi."],
    appLinks: [
      {
        label: "Dua za toba",
      },
      {
        label: "Ufuatiliaji wa swala",
      },
      {
        label: "Madeni na amana",
      },
      {
        label: "Dhikri ya kila siku",
      },
    ],
  },
];

export const JAHANNAM_MAJOR_SIN_TOPICS_SW: DeepPartial<JahannamTopic>[] = [
  {
    title: "Shirki",
    summary: "Kumshirikisha Mwenyezi Mungu ni dhambi moja isiyosamehewa mtu akifa kwayo.",
    body: [
      "Ufafanuzi: Shirki ni kumshirikisha Mwenyezi Mungu - kuelekeza kitendo chochote kinachomilikiwa na Yeye pekee (ibada, upendo wa mwisho, woga, matumaini, kutegemea, au haki ya kutunga sheria) kwa kitu au mtu asiyekuwa Yeye. Ni kinyume kabisa cha tawhiyd, na inagonga kwenye lengo hasa ambalo uumbaji upo: kumwabudu Mwenyezi Mungu peke yake.",
      "Why it is the gravest of all sins: every other sin is a wrong done while acknowledging the true Lord, but shirk is a wrong done against Him directly — mistaking the creation for the Creator. Ndiyo maana Qur-aan inayaita ‘dhambi kubwa’ (31:13). Ni dhambi moja ambayo mtu akifa juu yake bila ya kutubia, hasamehewi: “Hakika Mwenyezi Mungu hasamehi kushirikishwa naye, lakini husamehe yaliyo duni kuliko hayo kwa amtakaye.” (4:48). Rehema iliyofichika hata katika ukali huu ni kwamba kila kilichopungukiwa na shirki kinabakia chini ya msamaha wa Mwenyezi Mungu.",
      "Aina zake: wanachuoni wanatofautisha shirki kuu - kuabudu masanamu, wafu, watakatifu, au vitu vilivyoumbwa; kumwomba asiye kuwa Mwenyezi Mungu kwa awezaye kutoa; na kuelekeza sadaka au nadhiri kwa asiyekuwa Yeye - jambo ambalo humtoa mtu nje ya Uislamu ikiwa hajatubu. Pia kuna shirki ndogo na iliyofichika, kama vile kujionyesha katika ibada (riya'), kuapa kwa asiyekuwa Mwenyezi Mungu, au kutegemea ishara na hirizi, ambayo ni dhambi kubwa lakini yenyewe haitoi katika dini.",
      "Njia iliyo mbali nayo: ilinde na uimarishe tawhiyd kwa kuisoma, kumuabudu Mwenyezi Mungu peke yake, na kutakasa nia ili matendo yawe kwa ajili Yake na si kwa macho ya watu. Yeyote aliyetumbukia katika shirki anatubia kwa kuikana ikhlasi na kurejea kumwabudu Mwenyezi Mungu peke yake - na mlango huo wa kurudi unabaki wazi muda wote wa kuishi.",
    ],
    quran: [
      {
        excerpt:
          "Hakika Mwenyezi Mungu hasamehi ushirika naye, lakini husamehe yaliyo duni kuliko hayo kwa amtakaye.",
      },
      {
        excerpt:
          "Ewe mwanangu, usimshirikishe Mwenyezi Mungu na chochote. Hakika ushirika ni dhambi kubwa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dhambi kubwa miongoni mwa madhambi makubwa ni kumshirikisha Mwenyezi Mungu, kuua nafsi, kuwaasi wazazi na kutoa ushahidi wa uwongo.",
      },
    ],
    actions: [
      "Jifunze tawhiyd kupitia Jifunze Aqiydah na Majina 99 ya Mwenyezi Mungu.",
      "Safisheni nia katika ibada - muombe Mwenyezi Mungu ikhlasi kila siku.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Mauaji",
    summary:
      "Kuchukua maisha ya watu wasio na hatia kinyume cha sheria - kati ya ukiukwaji mkubwa zaidi.",
    body: [
      "Ufafanuzi: Kuua hapa maana yake ni kuua maisha ambayo Mwenyezi Mungu ameyafanya kuwa haramu na ya kimakusudi. Uislamu unatambua kesi halali - kama vile qisas halali (malipizo ya kisheria) inayofanywa na mamlaka sahihi - lakini kuua roho isiyo na hatia nje ya sababu ya haki ni miongoni mwa uhalifu mbaya sana.",
      "Kwa nini ni kubwa sana: Qur’ani inapima mauaji moja ya dhulma katika mizani ya wanadamu wote: ‘Mwenye kuua nafsi... ni kama ameua watu wote’ (5:32), kwani kuangamiza uhai mmoja ni kukiuka utakatifu unaolinda kila uhai. Mauaji yalikuwa ni dhambi ya kwanza iliyotendwa baina ya wana wa Adamu, na wahyi unarejea tena na tena kama mharibifu wa Akhera.",
      "Udhalimu maradufu: kuua mara moja ni dhambi kwa Mwenyezi Mungu, ambaye haki yake juu ya utakatifu wake imepondwa, na ni dhambi kwa watu, waliodhulumiwa na wanao waacha nyuma. Ndiyo maana toba yake ni nzito kuliko nyingi: kurejea kwa Mwenyezi Mungu ni jambo la lazima, lakini haki za aliyedhulumiwa pia zinasimama, na pale ambapo sheria ya ardhi au sheria ya Kiislamu inaelekeza pesa za damu (diyah) au matokeo mengine, haya lazima yapatikane kupitia njia sahihi na wanachuoni waliohitimu.",
      "Njia ya kujiepusha nayo: fanyeni kila maisha kuwa matakatifu, punguza hasira na uadui kabla ya kuwa migumu, na suluhisha migogoro kwa subira na uadilifu badala ya vurugu. Na hata uhalifu huu mkubwa zaidi dhidi ya watu hauko nje ya rehema ya Mwenyezi Mungu kwa yule anayetubia kwa ikhlasi, na kutekeleza haki zinazohusika kadiri inavyowezekana, na wala harudi tena kwenye njia hiyo.",
    ],
    quran: [
      {
        excerpt:
          "Mwenye kuua nafsi isipokuwa kwa ajili ya nafsi au kwa ufisadi katika ardhi ni kama ameua watu wote.",
      },
      {
        excerpt:
          "Mwenye kumuuwa Muumini kwa kukusudia, basi malipo yake ni Jahannamu, atakaa humo milele.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dhambi kubwa miongoni mwa madhambi makubwa ni kumshirikisha Mwenyezi Mungu, kuua nafsi, kuwaasi wazazi na kutoa ushahidi wa uwongo.",
      },
    ],
    actions: ["Thamini kila maisha; kutatua migogoro kwa subira na haki."],
    appLinks: [{}],
  },
  {
    title: "Zina",
    summary: "Mahusiano haramu ya ngono - dhambi mbaya dhidi ya roho na jamii.",
    body: [
      "Ufafanuzi: Zina ni uhusiano wowote wa kingono usio halali nje ya ndoa halali, unaofunika uasherati (kati ya wasiooa) na uzinzi (unaohusisha mtu aliyefunga ndoa). Uislamu haulichukulii kama jambo la kibinafsi bali kama ukiukaji wenye madhara makubwa.",
      "Kwa nini ni mbaya: zina huharibu mambo ambayo jamii yenye afya imejengwa juu yake - ukoo, uaminifu kati ya wenzi wa ndoa, usalama wa watoto, na usafi wa kiadili unaomheshimu mtu. Maneno ya Qur'ani yenyewe ni yenye kufundisha: haikatazi tu kitendo bali inasema 'hata msiikaribie' (17:32), ikionya dhidi ya mtazamo, faragha, na hatua zinazoelekea huko. Kukatazwa huko kwa njia ni rehema, kwa sababu humlinda mtu kabla ya majaribu kuwa makubwa.",
      "Hekima katika vizuizi: badala ya kuwaacha watu wapigane na matamanio katika kilele chake, Uislamu unawazunguka kwa ulinzi wa awali - kupunguza macho, kujisitiri katika mavazi na mwenendo, kuepuka kutengwa na jinsia tofauti, na kuhimiza ndoa kama njia halali, yenye heshima kwa mahitaji haya. Kuunda mipaka hii mapema ni rahisi sana kuliko kupinga ukingoni.",
      "Njia ya kurudi: kwa yeyote ambaye ameanguka, njia ya kutokea ni tawbah ya kweli - kuacha dhambi kabisa, kujuta, kuazimia kutorejea tena, na kufunika badala ya kutangaza yaliyopita. Zina ni dhambi kubwa, lakini inasisitizwa sana miongoni mwa wale Mwenyezi Mungu humsamehe mwenye kutubia; kukata tamaa hakuna mahali, na mwanzo mpya unapatikana kila wakati.",
    ],
    quran: [
      {
        excerpt: "Usikaribie kujamiiana haramu. Hakika ni uchafu na njia mbaya.",
      },
      {
        excerpt:
          "Na wale ambao hawazini haramu... isipokuwa aliyetubia, na akaamini, na akatenda mema, Mwenyezi Mungu atawabadilishia maovu yao kwa wema.",
      },
    ],
    actions: [
      "Linda macho na matumizi ya mitandao ya kijamii.",
      "Mfanyie dua mume au mke mwema ikiwa hujaoa.",
    ],
    appLinks: [{}],
  },
  {
    title: "Riba",
    summary: "Riba na riba - vita vilivyotangazwa dhidi ya watendaji wake katika Qur'ani.",
    body: [
      "Ufafanuzi: Riba ni ongezeko lisilo halali katika shughuli fulani za kifedha - kwa kawaida riba inayotozwa au kulipwa kwa mikopo, lakini pia ikijumuisha ubadilishanaji maalum usio na usawa au ulioahirishwa wa bidhaa kama hizo. Asili yake ni kupata utajiri bila thamani ya kweli au hatari, kwa gharama ya mwingine.",
      "Kwa nini ni mbaya sana: riba ni ya kipekee miongoni mwa dhambi za kifedha katika lugha ambayo Qur'ani inaitumia dhidi yake. Mwenyezi Mungu Anatangaza vita kutoka Kwake na Mtume Wake (Swalla Allaahu ‘alayhi wa aalihi wa sallam) juu ya wanao dumu humo (2:279) – neno lisilotumika kwa dhambi nyingine – kwa sababu riba hutumia haja, hujilimbikizia mali mikononi mwa watu wachache, na huififisha huruma iliyokusudiwa kuibeba uchumi. Mtume (Swalla Allaahu ´alayhi wa sallam) alionya vikali dhidi ya kushughulika nayo kwa nafasi yoyote ile.",
      "Hekima na rehema: katazo huelekeza watu kwenye biashara halisi, hatari ya pamoja, na hisani, na huwalinda walio hatarini dhidi ya kubanwa na deni. Hata hapa, hata hivyo, rehema za Mwenyezi Mungu zipo: ilipokuja amri, hakudai kwamba riba iliyokwisha chukuliwa irudishwe nyuma, bali aliwaambia waumini waache tu yaliyobakia - 'mtapata mkuu wenu' (2:279) - ni wepesi kwa wale wanaojiepusha nayo.",
      "Njia iliyo mbali nayo: kagua fedha zako kwa bidhaa zinazotegemea riba, tafuta njia mbadala za halali, na uwasiliane na wanazuoni waliohitimu kwa kesi ngumu kama vile rehani katika nchi zisizo za Kiislamu. Kuondoka kwa riba kunaweza kumaanisha uchaguzi mgumu wa kifedha, lakini usalama wa nafsi unashinda faida yoyote ya muda - na Mwenyezi Mungu anaahidi kumruzuku yule anayemcha kutoka mahali ambapo hatarajii.",
    ],
    quran: [
      {
        excerpt:
          "Enyi mlioamini mcheni Mwenyezi Mungu na acheni mabaki ya riba ikiwa nyinyi ni Waumini. Msipofanya hivyo julisheni vita kutoka kwa Mwenyezi Mungu na Mtume wake. Lakini mkitubu, mnaweza kuwa na wakuu wenu - hamtendi, wala hamdhulumiwi.",
      },
      {
        excerpt: "Mwenyezi Mungu huondoa riba na huongeza sadaka.",
      },
    ],
    actions: [
      "Kagua fedha za bidhaa zinazotegemea riba.",
      "Wasiliana na msomi aliyehitimu kwa rehani na deni.",
    ],
    appLinks: [{}],
  },
  {
    title: "Ushuhuda wa Uongo",
    summary: "Uongo chini ya kiapo au kutoa ushahidi wa uwongo - huharibu haki.",
    body: [
      "Ufafanuzi: Ushahidi wa uwongo (shahadat al-zur) ni kushuhudia jambo lisilo la kweli - na kwa upana zaidi, kusema uwongo chini ya kiapo, kutunga mashtaka, au kutotoa ushuhuda wa ukweli wakati haki inategemea.",
      "Kwa nini ni kaburi: inaharibu chombo chenyewe ambacho haki inatendeka. Shahidi mmoja wa uwongo anaweza kutuma mtu asiye na hatia kuharibu, kumvua mwenye haki mali yake, au kumwachilia mdhalimu - kwa hivyo uwongo hauzuiwi kwa mwongo; inaumiza watu halisi na utaratibu mzima wa haki. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) aliihesabu kuwa ni miongoni mwa madhambi makubwa zaidi, na katika riwaya moja alikua akisisitiza katika kurudia onyo dhidi yake kiasi kwamba Maswahabah zake walitamani angeacha, kwa kumjali.",
      "Kiungo chake kwa ulimi: ushuhuda wa uongo ni makali makali ya dhambi pana za usemi. Kwa sababu maneno ni rahisi kutamka, dhambi hii ni rahisi sana kuangukia kwayo - sahihi, kutia chumvi, ukimya unaofaa - na bado uzito wake Siku ya Kiyama ni mkubwa sana, wakati viungo na ndimi za watu zitakaposhuhudia ukweli dhidi yao.",
      "Njia ya mbali nayo: shikamana na ukweli hata kama ni wa gharama au dhidi ya maslahi ya mtu mwenyewe, kataa kutoa neno la mtu kwa uwongo wowote, na sema kwa ushuhuda wa haki inapohitajika. Mwenye kutoa ushahidi wa uwongo hutubia kwa kufuta uwongo pale inapowezekana, na kujitahidi kufuta ubaya na kurejesha haki za yeyote aliyedhulumiwa, na kurejea kwa Mwenyezi Mungu kwa majuto ya kweli.",
    ],
    quran: [
      {
        excerpt:
          "Na wale ambao hawashuhudii uwongo, na wanapopita karibu na maneno machafu, wanapita kwa heshima.",
      },
      {
        excerpt: "Basi jiepusheni na uchafu wa masanamu na jiepusheni na maneno ya uwongo.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Je, nisikuambie dhambi kubwa kabisa? Kumshirikisha Mwenyezi Mungu, na kuwaasi wazazi wawili, na kutoa ushahidi wa uwongo, na kutoa ushahidi wa uwongo.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Uchawi",
    summary: "Uchawi, kutafuta wachawi, na mazoea ya uchawi - kufr katika aina kuu.",
    body: [
      "Ufafanuzi: Sihr (uchawi au uchawi) ni matumizi ya njia zilizokatazwa - mara nyingi zinazohusisha kutegemea mashetani au kudai kuwa na mamlaka juu ya ghaibu - kuathiri watu au matukio. Kuitenda, kujifunza, kuitafuta kutoka kwa wengine, na kuamini wale wanaodai yote huanguka chini ya dhambi hii.",
      "Kwa nini ni kali sana: Sihr nyingi haziwezi kufanywa bila matendo ya ukafiri, kama vile kujikurubisha kwa mashetani au kuidhalilisha Qur'ani, ndiyo maana Qur'ani inaunganisha elimu yake na ukafiri. Akizungumzia uchawi uliofunzwa katika zama za Sulayman, Mwenyezi Mungu anasema mashetani na hao Malaika wawili waliufundisha kama mtihani tu, wakionya 'msikufuru' (2:102). Zaidi ya hatari ya imani, sihr huwadhuru watu halisi - kupanda mgawanyiko kati ya wenzi wa ndoa, kueneza hofu, na kuwadhulumu waliokata tamaa.",
      "Matendo yanayohusiana: onyo hilohilo linahusu kutabiri, kutibu unajimu kama elimu fulani ya ghaibu, na hirizi na hirizi zinazobeba shirki. Kudai ujuzi wa mustakbali uliofichika ni wa Mwenyezi Mungu peke yake, na kuwaelekea wale wanaodai kunadhoofisha tawhiyd katika mizizi yake.",
      "Njia ya kujiepusha nayo: kwa mtu aliyenasa katika matendo haya, toba maana yake ni kuyaacha kabisa, kuharibu vitu vilivyoharamishwa, kukata mafungamano na wale wanaovifanyia kazi, na kufanya upya tawhiid ya kweli na kumtegemea Mwenyezi Mungu pekee. Ulinzi unapatikana katika imani, katika adhkar za kila siku, na katika kutafuta hifadhi kwa Mwenyezi Mungu - na msamaha wake uko wazi kwa anayerejea kikweli.",
    ],
    quran: [
      {
        excerpt:
          "Walifuata yale waliyosoma mashetani katika enzi ya Sulaiman… na wanajifunza yale yanayowadhuru na hayawanufaishi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Anayemjia mpiga ramli na akaamini anayoyasema, basi amekufuru yaliyoteremshwa kwa Muhammad.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Kula Utajiri wa Yatima",
    summary: "Kuchukua au kuharibu mali ya mayatima bila ya haki.",
    body: [
      "Ufafanuzi: Dhambi hii ni kuchukua, kuharibu, au kutumia vibaya mali ya yatima - watoto ambao wamefiwa na baba na hawawezi kulinda masilahi yao wenyewe. Mlinzi anashikilia mali zao kama amana (amana), kamwe kama mmiliki.",
      "Kwa nini ni mbaya: inachanganya makosa mawili - usaliti wa amana takatifu na ukandamizaji wa wasio na ulinzi zaidi. Taswira ya Qur'ani ni kali: wale wanaokula mali ya mayatima kwa dhulma 'wanakula moto tu matumboni mwao' (4:10), na kugeuza dakika ya uchoyo kuwa adhabu ya kujitakia. Kumnyonya yule ambaye hana wa kuwasemea ni miongoni mwa aina mbaya zaidi za dhulma, ndiyo maana onyo hilo ni kali sana - na, kuwa mkali, mwenye huruma sana katika kuwaelekeza walinzi mbali nayo.",
      "Inachojumuisha: sio tu wizi wa moja kwa moja, lakini njia za hila - kuchanganya mali ya yatima na ya mtu binafsi ili kutia ukungu, kuchelewesha kurudi kwake mara tu yatima anapozeeka, au kuwekeza au kuitumia bila haki. Mwenyezi Mungu anaamrisha kinyume chake: “Wapeni mayatima mali zao, wala msibadilishe uovu kwa wema.” (4:2).",
      "Njia ya kujiepusha nayo: Linda mali ya mayatima kwa uangalifu mkubwa, iweke tofauti na hesabu, toa kwa ukamilifu wakishapevuka, na - kwa yule aliyepungukiwa - tubu kwa kurudisha deni kwa nyongeza yoyote inayostahiki na kuomba msamaha kwa waliodhulumiwa. Siku ambayo haitasaidia mali wala kizazi ila mwenye moyo mwema.",
    ],
    quran: [
      {
        excerpt:
          "Wale wanao kula mali ya mayatima kwa dhulma, basi hao wanakula matumboni mwao moto tu.",
      },
      {
        excerpt:
          "Wapeni mayatima mali zao, wala msibadilishe baya kwa wema, wala msile mali zao kwa mali zenu.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Kutotii Wazazi",
    summary: "Uquq - miongoni mwa madhambi makubwa baada ya shirki.",
    body: [
      "Ufafanuzi: 'Uquq al-walidayn ni uasi mkubwa na unyanyasaji wa wazazi wa mtu - kuwadhuru, kuwatendea kwa dharau, kuwapuuza katika haja, au kuwajeruhi kwa maneno au vitendo. Ni kinyume cha birr al-walidayn, wema wa utiifu unaoamrisha Uislamu.",
      "Kwa nini ni kubwa sana: katika Aya baada ya Aya Mwenyezi Mungu anaunganisha amri ya kumwabudu Yeye na amri ya kuwafanyia wema wazazi wawili, kama katika 'Muabudu Mwenyezi Mungu ... na wazazi wawili watendee wema' (4:36) - kuweka haki yao mara moja baada ya yake. Wazazi ni, baada ya Mwenyezi Mungu, chanzo cha karibu zaidi cha maisha na malezi ya mtu, hivyo kutokuwa na shukurani kwao ni aina ya utovu wa shukurani unaoingia ndani kabisa. Mtume (Swalla Allaahu ´alayhi wa sallam) aliorodhesha dhulma zao miongoni mwa madhambi makubwa zaidi, ya pili baada ya shirki.",
      "Mizani muhimu: Uchamungu haumaanishi kuwatii wazazi katika kumuasi Mwenyezi Mungu - hakuna kiumbe anayetiiwa katika dhambi dhidi ya Muumba. Lakini hata pale ambapo mtu lazima apunguze, inafanywa kwa upole, heshima, na kuendelea kwa wema. Qur'ani inakataza hata neno dogo la kukasirisha: 'usiwaambie uff' (17:23).",
      "Njia ya kurudi: rehema hapa ni kwamba wazazi kwa kawaida bado wanaweza kufikiwa. Kwa yule ambaye amepungukiwa, toba ni ya kimatendo kwa kiasi kikubwa - rudisha wema, waombe msamaha, watumikie, na waombee du'a, haswa wakiwa hai. Na ikiwa mzazi amepita, basi uchamngu huendelea kwa kuwaombea dua, kutoa sadaka kwa niaba yao, na kuwaheshimu mafungamano na marafiki zao.",
    ],
    quran: [
      {
        excerpt:
          "Mola wako Mlezi ameamrisha kuwa msimuabudu yeyote ila Yeye, na wazazi wawili muwatendee wema. Usiwaambie 'uff' wala kuwafukuza, lakini sema nao neno tukufu.",
      },
      {
        excerpt:
          "Muabuduni Mwenyezi Mungu wala msimshirikishe na chochote, na wafanyieni wema wazazi wawili.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Je, nisikuambie dhambi kubwa kabisa? Kumshirikisha Mwenyezi Mungu, na kuwaasi wazazi.",
      },
    ],
    actions: ["Piga simu au tembelea wazazi wiki hii kwa neno la fadhili."],
    appLinks: [{}],
  },
  {
    title: "Wizi",
    summary:
      "Kuchukua mali ya wengine kinyume cha sheria - kunakiuka uaminifu na kukaribisha adhabu.",
    body: [
      "Ufafanuzi: Wizi (sariqah) ni kuchukua mali au mali ya wengine bila haki - iwe kwa wizi, ubadhirifu, ulaghai, au kukamata kwa siri kitu ambacho mtu hana madai nacho.",
      "Kwa nini ni mbaya: inakiuka haki za watu na imani ambayo maisha ya jumuiya inategemea. Uzito wake unasisitizwa na adhabu iliyoamriwa ambayo Qur'ani inaitaja kwa kesi zinazostahiki (5:38) - adhabu iliyozingirwa na masharti magumu na viwango vya juu vya ushahidi, hivyo kwamba ukali wake unatumika hasa kama kizuizi chenye nguvu kinachoweka mali ya watu salama. Madhumuni ya Uislamu ni jamii ambayo watu hujihisi salama na mali zao.",
      "Nyuso zake za kisasa: wizi sio mdogo kwa kuvunja nyumba. Inajumuisha kuchukua kutoka kwa mwajiri, kudanganya katika biashara, kuzuia mishahara ya wafanyakazi, uharamia wa kidijitali, wizi, na kufaidika na kile ambacho si mali ya mtu kihalali. Yanayofichika kwa watu wengine kamwe hayafichiki kwa Mwenyezi Mungu, ambaye anaona kila siri.",
      "Njia ya kurudi: kwa sababu haki ya binadamu inahusika, toba inahitaji zaidi ya majuto mbele ya Mwenyezi Mungu. Ni lazima mtu arudishe kitu kilichoibiwa chenyewe, au thamani yake, kwa mmiliki wake halali, na kuomba msamaha inapowezekana; ikiwa mmiliki hawezi kupatikana, wanachuoni wanashauri kutoa kiasi hicho katika sadaka kwa niaba yao. Kuachiliwa kwa njia hii, hata wizi husamehewa kikamilifu na Yule anayempenda mja anayerudi.",
    ],
    quran: [
      {
        excerpt:
          "Ama mwizi, mwanamume na mwanamke, wakate mikono yao kwa malipo ya waliyo yachuma, ni kizuizi cha Mwenyezi Mungu.",
      },
    ],
    actions: ["Rudisha vitu vilivyoibiwa au thamani yao; omba msamaha kwa waliodhulumiwa."],
    appLinks: [{}],
  },
  {
    title: "Vileo",
    summary: "Mvinyo na vileo - vimeharamishwa polepole na kwa uamuzi katika Qur'ani.",
    body: [
      "Ufafanuzi: Khamr ni kitu chochote kinacholewesha na kuficha akili - mvinyo na pombe zote, na kwa kanuni ya Mtume ﷺ mwenyewe, kila kileo kiwe cha aina yake au jina lake. 'Kila kileo ni khamr, na kila khamr ni haramu.'",
      "Kwa nini ni kaburi: akili ni uwezo ambao mtu humjua Mwenyezi Mungu, hupambanua haki na batili, na hulinda kila jukumu jingine. Vileo vinasambaratisha hivyo kabisa, ndiyo maana Qur-aan inawafunga kwa masanamu na kucheza kamari kama 'najisi kutokana na kazi ya Shetani' na inaamrisha, 'Jiepusheni' (5:90). Zaidi ya mtu binafsi, wao huharibu afya, familia, na usalama, na hufungua mlango wa dhambi ambao mtu mwenye akili timamu hawezi kamwe kuukaribia.",
      "Hekima ya jinsi ilivyokatazwa: Mwenyezi Mungu hakuipiga marufuku khamr kwa mpigo mmoja wa ghafla bali aliiharamisha kwa hatua, na kuiondoa jamii ya mwanzo katika tabia iliyokita mizizi kwa upole. Taratibu hiyo yenyewe ni somo la rehema - na kielelezo cha matumaini kwa mtu yeyote anayejitahidi kuiacha leo.",
      "Njia ya kurudi, kwa huruma: wale walionaswa katika uraibu si wa kudharauliwa bali kuungwa mkono. Kutubia maana yake ni kuazimia kuacha kitu, kukiondoa na vichochezi vyake kutoka kwa maisha ya mtu, kutafuta msaada na matibabu bila haya, na kujaza utupu kwa ushirika mzuri, dhikr na ibada. Mlango wa Mwenyezi Mungu uko wazi, na kila hatua ya ikhlasi kutoka kwenye ulevi ni hatua anayoikaribisha.",
    ],
    quran: [
      {
        excerpt:
          "Enyi mlio amini! Hakika mvinyo, kamari, na masanamu, na mishale ya kupiga ramli, ni najisi kutokana na kazi ya Shet'ani.",
      },
    ],
    hadith: [
      {
        excerpt: "Kila kileo ni khamr, na kila khamr ni haramu.",
      },
    ],
    actions: ["Tafuta msaada ikiwa inahitajika; badala ya tabia na dhikr na kampuni nzuri."],
    appLinks: [{}],
  },
];

export const JAHANNAM_NAMES_SW: DeepPartial<JahannamNameEntry>[] = [
  {
    name: "Jahannam",
    meaning: "Moto - jina la kawaida la Qur'ani la Jahannam.",
    quran: {
      excerpt:
        "Uogopeni Moto ambao kuni zake ni watu na mawe, ulio andaliwa kwa ajili ya makafiri.",
    },
    context:
      "Imetumika katika Qur'ani yote kama makazi ya adhabu kwa wale walioikataa imani na wanaoendelea kufanya makosa.",
    tafsirNote:
      "Ibn Kathir anabainisha kuwa Jahannam ni jina la jumla la Moto lililotayarishwa kama onyo na matokeo.",
    scholarlyNote:
      "Baadhi ya wanachuoni wanajadili kama Jahannam ni Jahannam nzima au ni kiwango maalum - mitazamo inatofautiana.",
  },
  {
    name: "Jaheem",
    meaning: "Moto mkali - mkali, joto kali.",
    quran: {
      excerpt:
        "Nyinyi na hao mnaowaabudu badala ya Mwenyezi Mungu ni kuni za Jahannamu mtaingia humo.",
    },
    context:
      "Inaelezea ukali wa Moto unaowangoja wale waliofanya washirika pamoja na Mwenyezi Mungu.",
    tafsirNote:
      "Al-Tabari anaihusisha Jaheem na moto unaowaka, unaowasha ambao haubakiza chochote.",
  },
  {
    name: "Saqar",
    meaning: "Kile kisichochoma au kuacha chochote - joto kali.",
    quran: {
      excerpt: "Nitampeleka Saqar. Na nini kinaweza kukujulisha Saqar ni nini?",
    },
    context: "Imetajwa katika Surah al-Muddaththir kuhusu yule aliyejiepusha na wahyi.",
    tafsirNote:
      "Tafsir ya kawaida inaelezea Saqar kama kiwango cha Jahannam kinachowaka sana; maelezo hutofautiana kati ya wasomi.",
    scholarlyNote:
      "Kama Saqar ni kiwango tofauti au jina la Kuzimu kwa ujumla inajadiliwa katika tafsir - sio wazi katika kifungu kimoja kilichokubaliwa.",
  },
  {
    name: "Sa'ir",
    meaning: "Kuwaka - kuwasha moto.",
    quran: {
      excerpt: "Watakuwa katika Sa'ir - Moto mkali.",
    },
    context: "Onyo kwa wale wanaokula mali ya mayatima kwa dhulma.",
    tafsirNote: "Mzizi hupeleka kuungua na kuwasha - kusisitiza kazi, moto unaoteketeza.",
  },
  {
    name: "Hutamah",
    meaning: "Crusher - kile kinachovunja na kuponda.",
    quran: {
      excerpt: "Atatupwa katika al-Hutamah. Na nini kinaweza kukujulisha al-Hutamah ni nini?",
    },
    context:
      "Adhabu kwa yule anayesengenya na kujilimbikizia mali, akidhani kuwa itamfanya kuwa asiyekufa.",
    tafsirNote:
      "Ibn Kathir anaeleza Hutamah huponda na kuteketeza - moto uliowashwa na Mwenyezi Mungu.",
  },
  {
    name: "Hawiyah",
    meaning: "Shimo au shimo - kuanguka kwa kina.",
    quran: {
      excerpt: "Ama yule ambaye mizani yake ni nyepesi - kimbilio lake ni Hawiyah.",
    },
    context: "Marejeo ya wale ambao matendo yao mema ni mepesi sana Siku ya Kiyama.",
    tafsirNote:
      "Imefafanuliwa kama shimo kubwa katika Moto; al-Tabari inarekodi maoni juu ya kina na ukali wake.",
    scholarlyNote:
      "Baadhi ya kazi za tafsir zinaorodhesha Hawiyah kama kiwango mahususi - inanukuu kama tafsiri ya kielimu.",
  },
  {
    name: "Lazaa",
    meaning: "Moto - moto mkali.",
    quran: {
      excerpt: "La hasha! Ni Moto wa Mwenyezi Mungu uliowashwa.",
    },
    context: "Surah al-Ma'arij - inawaonya wanaoikadhibisha Saa.",
    tafsirNote: "Imeunganishwa na mwali unaowaka na kuwaka - Lazaa anasisitiza kuwaka kwa moto.",
  },
];

export const JAHANNAM_GATES_SW: DeepPartial<JahannamGateEntry>[] = [
  {
    quranNote:
      "Mwenyezi Mungu anasema Jahannamu ina milango saba; kila mlango una sehemu ya wale wanaoingia (15:44).",
    scholarlyNote:
      "Baadhi ya kazi za tafsir za baadaye zinahusisha milango na makundi ya wakosefu. Kazi hizi si sawa katika vyanzo vya awali - sasa kama tafsiri.",
  },
  {
    quranNote:
      "Qur'ani inathibitisha milango saba kwa pamoja; halitaji kila lango katika ufunuo wa wazi.",
    scholarlyNote:
      "Ibn Kathir anajadili kwamba mgawanyiko huo ni kwa hekima na uadilifu wa Mwenyezi Mungu.",
  },
  {
    quranNote:
      "Milango saba - ukweli wa maandishi wazi. Maelezo ya wakaaji wa kila lango ni majadiliano ya kitaalamu.",
  },
  {
    quranNote: "Mstari huu unasisitiza mgawo wa uwiano - kila lango lina sehemu yake maalum.",
  },
  {
    quranNote:
      "Waumini wanaonywa ili waepuke yale yanayowapeleka kwenye malango haya kwa njia ya toba.",
  },
  {
    quranNote: "Kuzimu imeandaliwa - onyo ni kweli. Ulinzi ni kupitia imani na matendo mema.",
  },
  {
    quranNote:
      "Milango saba, Moto mmoja - umoja wa maonyo na tofauti katika jinsi wenye dhambi wanavyopangwa kwa hekima ya kimungu.",
    scholarlyNote:
      "Epuka kufundisha uchoraji wa ramani mahususi wa dhambi kwa mlango kama ukweli wa kinabii isipokuwa utajaribisha kazi ya kitaaluma.",
  },
];

export const JAHANNAM_VERSES_SW: DeepPartial<JahannamVerseEntry>[] = [
  {
    excerpt: "Uogopeni Moto ulioandaliwa kwa ajili ya makafiri.",
    context: "Inaelekezwa kwa waumini - hofu kama motisha kuelekea utii.",
    tafsirSummary: "Ibn Kathir: mwito wa taqwa ulioambatana na utii kwa Mtume.",
  },
  {
    excerpt:
      "Msikate tamaa na rehema za Mwenyezi Mungu. Hakika Mwenyezi Mungu husamehe dhambi zote.",
    context: "Iliyofunuliwa ili kuwafariji wale ambao waliogopa dhambi zao walikuwa kubwa sana.",
    tafsirSummary: "Mstari wa msingi wa matumaini - rehema ni kubwa kwa wale wanaorudi nyuma.",
  },
  {
    excerpt:
      "Tubuni kwa Mwenyezi Mungu kwa toba ya kweli, huenda Mola wenu Mlezi akakufutieni maovu yenu.",
    context: "Amri kwa waumini baada ya mwongozo juu ya familia na mwenendo.",
    tafsirSummary: "Nasuh tawbah - toba ya kweli bila ya kurudi kwenye dhambi.",
  },
  {
    excerpt: "Kwa wote kutakuwa na digrii kulingana na walivyofanya.",
    context: "Uadilifu wa Mwenyezi Mungu - malipo na adhabu kulingana na vitendo.",
    tafsirSummary: "Digrii zinatumika kwa Pepo na Kuzimu.",
  },
  {
    excerpt: "Mwenyezi Mungu hawadhulumu watu hata kidogo, lakini watu wanajidhulumu nafsi zao.",
    context: "Uhakikisho kwamba hukumu ya Mungu ni ya haki kabisa.",
  },
  {
    excerpt: "Mola wetu Mlezi, tupe mema katika walimwengu wote na utulinde na adhabu ya Moto.",
    context: "Du'a ya wale wanaochanganya wema wa dunia na ulimwengu mwingine.",
    tafsirSummary: "Dua ya kinabii inayofunzwa ndani ya Qur'ani - usawa wa dunya na akhirah.",
  },
  {
    excerpt: "Kuzimu ina milango saba; kwani kila lango lina fungu.",
    context: "Imeshughulikiwa katika muktadha wa mjadala wa Ibrahim na watu wake.",
    tafsirSummary: "Kutajwa kwa wazi kwa milango saba - maelezo ya kazi ni hekima ya kimungu.",
  },
  {
    excerpt:
      "Isipo kuwa walio tubu, na wakaamini, na wakatenda mema, basi Mwenyezi Mungu ataubadilisha ubaya kwa wema.",
    context: "Isipokuwa baada ya kuorodhesha dhambi kubwa.",
    tafsirSummary: "Tumaini kwa wanaotubu - matendo yanaweza kubadilishwa kwa rehema.",
  },
  {
    excerpt:
      "Kwa walio mkufuru Mola wao Mlezi watapata adhabu ya Jahannamu, ni marejeo mabaya kabisa.",
    context: "Surah al-Mulk - ukumbusho wa ghaibu.",
  },
  {
    excerpt: "Hakika mema huondoa maovu.",
    context: "Amri ya kusimamisha swala mwisho wa siku.",
    tafsirSummary: "Kutia moyo kwamba ibada thabiti hufuta miteremko ya zamani.",
  },
  {
    excerpt: "Mola wetu Mlezi, tusamehe dhambi zetu na utulinde na adhabu ya Moto.",
    context: "Maelezo ya muttaqin (mcha Mungu).",
  },
  {
    excerpt: "Ama yule ambaye mizani yake ni nyepesi - kimbilio lake ni Hawiyah.",
    context: "Surah al-Qari'ah - kipimo cha vitendo.",
  },
];

export const JAHANNAM_HADITH_SW: DeepPartial<JahannamHadithEntry>[] = [
  {
    hadith: {
      excerpt:
        "Mwenye kumuomba Mwenyezi Mungu Pepo mara tatu, basi husema: Ewe Mwenyezi Mungu, muingize Peponi. Mwenye kujikinga na Moto mara tatu, Moto husema: Ewe Mwenyezi Mungu, mkinge na Moto.",
    },
    context: "Kuhimiza kuomba du'a mara kwa mara kwa ajili ya Jannah na kimbilio kutoka Jahannam.",
  },
  {
    hadith: {
      excerpt:
        "Mwenyezi Mungu ameridhika zaidi na toba ya mja wake kuliko mmoja wenu anayeukuta mlima wake uliopotea katika ardhi kame.",
    },
  },
  {
    hadith: {
      excerpt:
        "Hataingia Peponi hata mmoja wenu kwa vitendo vyake peke yake, hata mimi, isipokuwa Mwenyezi Mungu amenifunika kwa rehema yake.",
    },
    context: "Mizani: Jihadi katika vitendo lakini tegemea rehema.",
  },
  {
    hadith: {
      excerpt:
        "Moto wako ni sehemu moja ya sehemu sabini za Moto wa Jahannamu, kila sehemu ikiwa kama joto lake.",
    },
  },
  {
    hadith: {
      excerpt: "Agano baina yetu na wao ni maombi; mwenye kuiacha amekufuru.",
    },
    context: "Ukali wa kupuuza Swalah - miongoni mwa maonyo makubwa.",
  },
  {
    hadith: {
      excerpt:
        "Aliyefilisika anakuja na maombi, saumu, na hisani - lakini alitukana, akakashifu, akala mali isivyo halali, na kumwaga damu.",
    },
    context: "Haki za watu zinaweza kutatuliwa mbele ya matendo Siku ya Hukumu.",
  },
  {
    hadith: {
      excerpt:
        "Mwenyezi Mungu hunyoosha mkono wake usiku ili kupokea toba ya mtenda dhambi wa mchana, na ananyoosha mkono wake mchana ili kukubali toba ya mtenda dhambi wa usiku.",
    },
  },
  {
    hadith: {
      excerpt: "Mwenye kumuamini Mwenyezi Mungu na Siku ya Mwisho, basi na aseme mema au anyamaze.",
    },
    context: "Kuchunga ulimi - uwajibikaji wa kila siku.",
  },
];

export const JAHANNAM_REFLECTIONS_SW: DeepPartial<JahannamReflectionEntry>[] = [
  {
    question: "Je, nimemkosea mtu yeyote leo - kwa hotuba, vitendo, au kupuuza?",
  },
  {
    question: "Je, nimeomba msamaha kwa Mwenyezi Mungu leo ​​- kwa dhati na kwa kurudia rudia?",
  },
  {
    question: "Je, niliulinda ulimi wangu dhidi ya usengenyaji, uwongo na dhihaka?",
  },
  {
    question: "Je, niliomba kwa wakati na kwa uwepo?",
  },
  {
    question: "Je, nilichukua hatua ya kurudiana na mtu niliyeachana naye?",
  },
  {
    question: "Je, nilitoa hisani au fadhili leo - hata kitu kidogo?",
  },
  {
    question: "Je, nimesoma au kusikiliza Kurani leo?",
  },
];

export const JAHANNAM_REFERENCES_SW: DeepPartial<JahannamReferenceEntry>[] = [
  {
    title: "Qur'ani",
    note: "Chanzo kikuu cha majina, maonyo, rehema, na toba. Tafsiri hutofautiana; wasiliana na Kiarabu kwa usahihi.",
  },
  {
    title: "Sahih al-Bukhari & Sahih Muislamu",
    note: "Mkusanyo wa Hadith za kisheria zilizotajwa kote kwenye moduli hii ambapo zimepangwa sahih.",
  },
  {
    title: "Tafsir Ibn Kathir",
    note: "Inarejelewa kwa muktadha wa majina ya Kuzimu na aya kuu za onyo - tafsiri ya kitaalamu.",
  },
  {
    title: "Tafsir al-Tabari",
    note: "Tafsir ya kina ya mapema - ni muhimu kwa kuelewa maoni ya kitambo kuhusu Jahannam.",
  },
  {
    title: "Ambapo wasomi wanatofautiana",
    note: "Viwango kamili vya Kuzimu, kazi za lango, na baadhi ya maana za majina hujadiliwa miongoni mwa wasomi - sio wazi kila wakati katika ufunuo.",
  },
];

export const JAHANNAM_DUAS_SW: DeepPartial<JahannamDuaEntry>[] = [
  {
    context: "Omba kheri katika ulimwengu wote na ulinzi na Moto - du'a ya Qur'ani.",
  },
  {
    context: "Baada ya tashahhud: omba Pepo na hifadhi kutoka kwa Moto.",
  },
  {
    context: "Ukumbusho wa asubuhi: makimbilio na adhabu ya kaburi na Moto.",
  },
];

export const JAHANNAM_REFUGE_DUA_SW: { translation: string } = {
  translation:
    "Ewe Mwenyezi Mungu, najikinga Kwako na adhabu ya Jahannam, na adhabu ya kaburi, na mitihani ya maisha na mauti, na mtihani mbaya wa Masihi wa Uongo.",
};
