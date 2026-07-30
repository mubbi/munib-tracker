// Hausa translation overlay for the Learn "Jahannam" content. Mirrors the order of
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

export const JAHANNAM_CORE_TOPICS_HA: DeepPartial<JahannamTopic>[] = [
  {
    title: "Gabatarwa",
    summary: "Allah ya sanar da mu game da Jahannama don shiriya - ba yanke kauna ba.",
    body: [
      "Jahannama - ana fassara shi da Wuta ko Wuta - ita ce gidan azaba a Lahira wanda Allah ya siffanta shi a cikin Alkur'ani da ta hanyar Manzonsa SAW. Ya ce mana kada mu murkushe zuciya da tsoro, amma domin zukata su farka, su juya baya, mu zabi hanyar rahama yayin da kofa a bude take.",
      "Yana taimakawa wajen fahimtar dalilin da yasa Ubangiji mai jinƙai yake maganar wuta kwata-kwata. Gargadi kansa jinƙai ne: wanda aka gaya wa wani dutse na gaba a cikin duhu, an ba shi kyauta, ba barazana ba. Duk wata aya game da Jahannama, Allah cikin rahamarSa, Mai kiran bayinsa ne, tun kafin lokacin dawowa ya wuce.",
      "Wannan shine dalilin da ya sa aka haɗa gargaɗin a tsawon wahayi tare da kira zuwa ga tuba, gafara, da fatan rahamar Allah mai girma. Qur'ani ba kasafai yake ambaton wuta ba, a kusa, yana ambaton Aljanna, bude kofar tawbah, da kaunar Allah ga masu komowa. Manufar ita ce lissafin da ke kaiwa ga adalci - kada a yanke ƙauna.",
      "Imani da Jahannama yana daga cikin imani da gaibu (al-ghayb), da adalcin Ubangiji, da hakikanin ranar lahira. Yana ba da nauyi ga zaɓinmu kuma yana daidaita bege a cikin Aljanna tare da tsanani game da zunubi, domin mumini ya yi tafiya tsakanin bege da tsoro - mai begen rahamar Allah, mai lura da kasawarsa.",
      "Wani batu na ta'aziyya na tsakiya ga akidar Ahlus-Sunnah yana gudana ta cikin wannan tsari duka: wadanda suka mutu suna masu imani da Allah Shi kadai, ko da zunubi ya dora su, ba za su dawwama a cikin wuta ba har abada. Da rahamar Allah da ceton da Ya yi izini, daga karshe ana fitar da muminai masu zunubi; Sai waɗanda suka mutu alhãli kuwa sunã kãfirta. Don haka karatun Jahannama shi ne, ga mumini, daga qarshe nazarin yadda ake samun rahama.",
      "Wannan tsarin yana gabatar da abin da nassoshi suka yi bayani a sarari, ya lura da gaskiya a inda malamai suka yi sabani, ya kawo ingantacciyar hujja kawai, kuma yana jagorantar ku zuwa ga tawbah, da ayyukan alheri, da dogaro ga Allah.",
    ],
    quran: [
      {
        excerpt:
          "Ku ji tsoron wutar da aka yi tattalinta domin kafirai, kuma ku yi da'a ga Allah da ManzonSa, tsammaninku a yi muku rahama.",
      },
      {
        excerpt:
          "Ka ce: Ya ku bayiNa wadanda suka yi zalunci a kansu, kada ku yanke tsammani daga rahamar Allah. Lallai Allah yana gafarta zunubai baki daya.",
      },
      {
        excerpt: "Yã ku waɗanda suka yi ĩmãni, ku tũba zuwa ga Allah da tũba na gaskiya.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Me yasa Allah Ya Halicci Jahannama",
    summary: "Adalci na Ubangiji, da hisabi, da sakamakon zaɓe na 'yanci.",
    body: [
      "Jahannama ta wanzu a matsayin bayyanar da cikakken adalcin Allah ('adl). Duniyar da azzalumai da wanda aka zalunta, masu gaskiya da ha'inci, duk suka hadu da shi ba za su yi adalci ba. Domin Allah shi ne mai adalci, dole ne a yi hisabi na karshe inda za a amsa duk wani kuskure da kuma girmama kowane alheri.",
      "Babban abin nan shi ne Allah ba ya zaluntar kowa. Kuma dukan rai wanda ya shiga Wuta, to, yanã shigar ta bisa ga abũbuwan shirkinsa, ba a tũba ba, bã da wani hukunci ba. Kur'ani ya nanata cewa: 'Allah ba ya zaluntar mutane da komai, amma mutane suna zaluntar kansu' (4:40). Babu wanda ake azabtar da abin da bai aikata ba, ko fiye da abin da ya cancanta.",
      "Ba a bar mutane a cikin duhu ba. Allah Ya ba su hankali, Ya aiko manzanni, kuma Ya saukar da shiriya bayyananna, sa’an nan kuma Ya girmama su da ‘yancin karva ko qaryata su: “Wanda ya so – ya yi imani; Kuma wanda ya so, to, ya kafirta.” (18:29). Dagewa cikin ƙin gaskiya, cikin zalunci, ko babban zunubi ba tare da tuba ba yana da sakamako a cikin Lahira daidai domin zaɓin na mutum ne da gaske.",
      "Amma duk da haka ma a nan jinƙai ya tsara adalci. Allah yana yin gargaɗi a gabanin yanke hukunci, yana jinkirta hisabi ya ba da damar mayarwa, yana gafartawa idan an tambaye shi, kuma yana ba da ladan wani aikin alheri mai yawa a yayin rubuta zunubi guda ɗaya. Adalcinsa ba ya rabuwa da rahamarSa.",
      "Yin tunani a kan dalilin da ya sa Jahannama ta wanzu ya kamata a kara takawa (sanin Allah) da zurfafa godiya ga kowace rana ta rayuwa da har yanzu dama ce ta tuba. Ana nufin sanya zuciya mai mahimmanci da bege lokaci guda - kar a taɓa gurɓata ta da yanke ƙauna.",
    ],
    quran: [
      {
        excerpt: "Lalle ne, Allah bã Ya zãluntar mutãne da kõme, amma mutãne suna zãlunta kansu.",
      },
      {
        excerpt: "Bã a tambayar sa ga abin da Yake aikatãwa, kuma amma sũ anã tambayar su.",
      },
      {
        excerpt:
          "To, wanda ya so, to, ya yi ĩmãni. Kuma wanda ya so, to, ya kafirta. Lalle Mũ, Mun yi tattalin wuta ga azzãlumai.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Babu dayanku da zai shiga Aljanna da aikinsa shi kadai. Sai suka ce: Ba kai ma ya Manzon Allah ba? Ya ce: “Ba ni ma, sai dai idan Allah Ya lullube ni da rahamarSa.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Hakikanin Lahira",
    summary: "Daga mutuwa zuwa hukunci - kowane mataki na gaske ne kuma yana da alaƙa da aqida.",
    body: [
      "Don fahimtar Jahannama daidai, yana taimakawa wajen ganin inda yake a cikin babbar tafiya. Musulunci ya koyar da jerin abubuwa bayyananne bayan mutuwa: rai ya fita daga jiki, sa'an nan Barzakh (lokacin rayuwar kabari) ya fara, sannan tashin kiyama idan aka tayar da jikkuna, da Tara dukkan halitta, da hukuncin da ake tantance ayyuka, da ma'aunin ayyuka a sikelin (al-mizan), da haye gada (as-Sirat), da matsewar gada (as-Sirat), da matsewar gada (as-Sirat), da mahangar kowane rai a cikin Aljanna. adalci, da rahama.",
      "Kowanne daga cikin wadannan marhaloli an tabbatar da su ne a cikin aqidun Ahlus-Sunnah na yau da kullun bisa tushen Alkur’ani da Sunna ingantattu. Wannan lokacin ba alama ba ne ko labari; Haqiqa gaskiya ne a yi imani da shi a matsayin wani vangare na imani da ranar qarshe, kuma karyata ta da saninta lamari ne na akida, ba kawai na aiki ba.",
      "Ganin duk hanyar kuma yana gyara Wuta. Hanya ɗaya ce mai yuwuwa a ƙarshen tafiya kowane rai ya riga ya yi tafiya - wanda ke nufin zaɓin yau ba su da hankali. Matakai ne a kan hanyar, kuma har yanzu su namu ne don yin jagora.",
      "Sanin wannan jeri yana taimaka wa mumini ya yi shiri maimakon tsoro: rayuwa da lafiyayyen ambaton mutuwa (zikiril mawt), gyara kurakurai kafin a kai su cikin Taro, da cika lissafin ayyukan alheri alhali kuwa kofar aiki a bude take. Mutuwa ta rufe wannan kofa; babu abin da za a ƙara bayansa.",
    ],
    quran: [
      {
        excerpt:
          "Sa'an nan kuma lalle ne ku, a bãyan wancan, mai mutuwa ne. Sa'an nan kuma lalle ne zã a tãyar da ku a Rãnar ¡iyãma.",
      },
      {
        excerpt:
          "Amma wanda ma'aunansa suka yi nauyi, to, zai kasance a cikin rayuwa mai dadi. Amma wanda ma'aunansa suka yi sauƙi, to, mafakarsa za ta kasance rami mai zurfi.",
      },
    ],
    actions: [
      "Yi nazarin kowane mataki a cikin Koyi Aqeedah kuma ku haɗa imani da zaɓin yau da kullun.",
      "Ka yawaita ambaton mutuwa (zikiril mawt) ba tare da sakaci da fatan rahama ba.",
    ],
    appLinks: [{}, {}, {}, {}, {}, {}],
  },
  {
    title: "Sunayen Jahannama",
    summary: "Sunayen Kur'ani masu ma'ana - malamai sun yi sabani kan ko kowanne matakin daban ne.",
    body: [
      "Kur'ani yana nufin wuta da sunaye da yawa, kuma wannan ba maimaitawa ba ne kawai. A cikin Larabci, suna sau da yawa yana ɗauke da bayyananniyar siffa a cikinsa, don haka kowane suna yana koyar da wani abu game da haƙiƙanin da yake nuni da shi. Daga cikinsu akwai Jahannama, da Jaheem, da Saqar, da Sa’ir, da al-Hutamah, da al-Hawiyah, da Lazaa.",
      "Kowane suna yana buɗe taga zuwa wani bangare daban na tsanani. Jaheem da Sa'ir suna tada wata wuta mai tsananin gaske, mai tashewa; Saqar, abin da yake quna, bai bar kome ba; al-Hutamah, mai murƙushe duk abin da aka jefa a cikinsa; al-Hawiyah, wani rami mai zurfi wanda mutum ya fada cikinsa; da Lazaa, tsarkakkiyar harshen wuta. Karatun sunayen tare yana gina kyakkyawan hoto da zuciya ba za ta iya yin watsi da ita cikin sauƙi ba.",
      "Malaman tafsiri na gargajiya - irin su Ibn Kathir da al-Tabari - sun bayyana wadannan sunaye daga tushensu na Larabci kuma suna tattauna kowannensu a cikin mahallin ayar da ta zo, maimakon daukar su a matsayin tsayayyen jeri na fasaha.",
      "Yana da kyau a yi taka tsantsan a nan. Wasu marubutan daga baya suna gabatar da kowane suna a matsayin daban, matsayi na 'matakin' Jahannama, wani lokaci tare da cikakken zane. Wannan fassarori ce ta ilimi, ba wai wani fitaccen abin dubawa da aka ambata a cikin Alkur’ani ko hadisin da aka yarda da shi ba. Madaidaicin hanya ita ce koyon ma'anar da nassin ke bayarwa a zahiri da kuma guje wa gabatar da taswirori a matsayin tabbaci.",
      "Manufar koyan sunayen ba don gamsar da sha'awa ba ne amma don tausasa zuciya da motsa ta zuwa ga rahamar da wannan tsarin ke ci gaba da nunawa. Bincika cikakken tarin sunaye don kowane suna na faruwar Alqur'ani, mahallinsa, da taƙaitaccen tafsiri.",
    ],
    quran: [
      {
        excerpt: "Ya isa Jahannama a matsayin wurin hutawa - Jahannama.",
      },
      {
        excerpt: "Za a jefa shi a cikin al-Hutamah - Wuta mai raɗaɗi.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Matakan Jahannama",
    summary:
      "Matsayi daban-daban na hukunci - ainihin tsarin ba a cika dalla-dalla ba a cikin matani.",
    body: [
      'Ka’idar da Kur’ani ya bayyana a sarari ita ce, azaba ta yi daidai: ba duk wanda ke cikin Wuta ke fuskantarsa ​​daidai gwargwado ba. "Dukansu suna da darajoji gwargwadon abin da suka aikata" (6:132). Wannan shi kansa nuna adalci ne – wanda ya yi zalunci kadan ba a daukarsa kamar wanda ya zalunci mai yawa.',
      "Sunna ingantacciya ta nuna irin wannan ka'ida. Manzon Allah SAW ya sifanta mafi qarancin azaba a matsayin wanda aka sanya garwashi biyu a qarqashin qafafunsa, wanda qwaqwalwarsa ke tafasa daga gare ta – amma duk da haka shi ne mafi raunin azaba ga dukkan mutanenta (Sahihul Bukhari 6562). Idan wannan shine mafi ƙanƙanta, hankali yana fahimtar yadda babban digiri dole ne ya kasance, da kuma menene dalilin da zai sa a koma yau.",
      "Haka kuma, wahayi baya baiwa muminai cikakken taswirar tsarin Jahannama mai lamba wanda ya wajaba su haddace. Malamai sun tattauna matakai, zurfafawa, da nau'o'in da aka zana daga ayoyi da rahotanni daban-daban, amma yawancin wannan ya kasance fassarar fiye da yarda, nassi bayyananne.",
      "Abubuwa biyu kuwa, sun tabbata. Na farko, zalunci (Dhulm), shirka, da kuma babban zunubi ba tare da tuba ba yana da gargaɗi mai tsanani. Na biyu – kuma kada a manta – cewa rahamar Allah da gafararSa suna nan a bude har zuwa lokacin wafati ga duk wanda ya koma gare shi da gaskiya. Manufar koyo game da digiri shine zaɓi mafi sauƙi yayin da zaɓi ya rage.",
      "A zahiri, wannan yana nufin ɗaukar cikakken jerin 'matakai bakwai' ko tsare-tsare makamantan haka a matsayin ra'ayi na ilimi maimakon ƙayyadaddun koyaswar, da kuma kula da abin da a zahiri ke karewa: bangaskiya, tuba, da ayyuka na adalci.",
    ],
    quran: [
      {
        excerpt: "Domin duk za a sami digiri gwargwadon abin da suka yi.",
      },
      {
        excerpt:
          "Lalle ne munãfukai suna a cikin mafi ƙasƙan wuta, kuma bã zã ka sãmi mataimaki a kansu ba.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mafi qarancin azaba daga cikin mutanen Wuta, shi ne mutumin da aka sanya garwashi biyu a ƙarƙashin ƙafãfunsa, daga gare ta suke tafasa.",
      },
    ],
    disclaimer:
      "Zane-zane na matakan Jahannama da aka samu a wasu littattafai suna nuna fassarar masana, ba yarjejeniya ɗaya ba.",
  },
  {
    title: "Ƙofofin Jahannama",
    summary: "Ƙofofi bakwai — abin da Kur’ani ya faɗa da inda tafsiri ya bambanta.",
    body: [
      "Wani dalla-dalla game da Jahannama ya zo a sarari kuma ba tare da wata shakka ba a cikin Alkur’ani cewa: ‘Lallai Jahannama tana da kofofi bakwai; Kuma kowace ƙõfa tana da wani yanki da aka keɓe daga gare su.” (15:44). Don haka imani da ƙofofin bakwai ya ta'allaka ne akan wahayi bayyananne, ba akan hasashe ba.",
      "Ayar ta tabbatar da abubuwa guda biyu: cewa akwai kofofi guda bakwai, kuma wadanda suke shiga a raba su. Malaman tafsiri na gargajiya sun tattauna abin da rabon yake nufi - ko yana nuni ne ga nau'ikan mutane, zuwa matakan ukuba da suka dace da ayyuka, ko duka biyun. Hikimar da ke tattare da rarraba ta Allah ce, wanda adalcinsa ya sanya kowane rai daidai inda yake.",
      "Yana da mahimmanci a lura inda tabbaci ya ƙare. Wasu ayyuka daga baya suna sanya kowace takamaiman kofa zuwa takamaiman zunubi ko rukuni. Waɗannan ayyuka na musamman ba a kafa su iri ɗaya a farkon tushe ba, don haka an fi gabatar da su a matsayin ra'ayoyin malamai guda ɗaya maimakon ƙayyadaddun annabci.",
      "Kamar yadda yake a cikin matakan, darasin ƙofofin ba na gine-gine ba ne amma ɗabi'a: akwai kofofi da yawa waɗanda suke kaiwa zuwa ga wuta, kuma hanyar tsira daga dukkansu iri ɗaya ne - imani na gaskiya, nisantar babban zunubi, da saurin tuba lokacin da mutum ya zame.",
    ],
    quran: [
      {
        excerpt:
          "Kuma lalle ne Jahannama ita ce wa'adinsu gabã ɗaya. Tana da kofofi bakwai; Domin kowace kofa tana da rabo da aka ba ta.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Bayanin Jahannama",
    summary: "Wuta, zafi, sarƙoƙi, baƙin ciki - an gabatar da girmamawa, ba abin mamaki ba.",
    body: [
      "Kur'ani da Sunna ingantattu sun siffanta Jahannama da bayyanannun harshe na zahiri, kuma suna yin haka ne saboda wani dalili: Zuciyar mutum ta fi motsi da hotuna da za ta iya zana fiye da ta hanyar ra'ayi. Bayanin - wuta mai tsanani, zafi da ba za a iya jurewa ba, ƙuntataccen abinci da abin sha, sarƙoƙi, duhu, da baƙin ciki mai zurfi - ana nufin su sa haɗarin ya zama ainihin isa ya kawar da mu daga gare ta.",
      "Daga cikin bayanin akwai tafasasshen ruwa da ake sha, da bishiyar zaqqum a matsayin abinci, da tufafin da aka yanke daga wuta, da rabuwa da duk wani jin daɗi da mutum ya taɓa dogara da shi. Manzon Allah Sallallahu Alaihi Wasallama ya isar da nisan da wannan zafin ya zarce duk wani abu da muka sani, yana mai cewa wutar da muke kunnawa a nan duniya, daya ce daga cikin sassa saba'in na wutar Lahira (Sahihul Bukhari 3265).",
      "Waɗannan kwatancin gargaɗi ne na gaske, ba kwatanci kawai da ke ɓarna Lahira ba. Malaman Sunna suna tabbatar da haqiqanin su tare da barin ainihin tsarin gaibu ga sanin Allah; Aikin mumini shi ne ya dauki gargadin a zuciya, ba rarraba shi ba.",
      "Akwai ladubba (adab) wajen karanta irin wadannan nassosin. Ana kusantar su da tawali’u, da tsoron Allah, da matsawa nan da nan don tuba da neman tsari—ba tare da sha’awar mugun nufi ba, kuma ba tare da yanke ƙauna ba, tun da dukan manufar gargaɗin ita ce har yanzu muna da lokacin guje wa hakan.",
      "Wataƙila jigon mafi nauyi a cikin waɗannan kwatancin shine nadama. 'Idan da na samu...' za a ce lokacin da lokacin aiki ya riga ya rufe. Jinƙan da muka ji game da wannan nadama a yanzu shi ne cewa za mu iya yin aiki a kan 'idan da' a yau, yayin da zai iya canza ƙarshenmu.",
    ],
    quran: [
      {
        excerpt:
          "A gaba gare shi akwai Jahannama, kuma a shayar da shi wani ruwa mai radadi. Zai ƙwace ta amma da ƙyar ya haɗiye.",
      },
      {
        excerpt: "Za a yanka musu tufafin wuta, a zuba musu ruwan tafasasshen ruwa.",
      },
      {
        excerpt:
          "Jahannama, a rãnar nan, ake yin ta, a rãnar nan, mutum zai yi tunãni, to, mene ne tunãni a gare shi?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Wutar ku daya ce daga cikin kashi saba'in na wutar Jahannama. Aka ce: Ya Manzon Allah, da wannan wuta ta isa. Ya ce: An ba shi qarfin kashi sittin da tara fiye da shi, kowane vangare kamar zafinsa ne.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Wanene Aka Gargadi?",
    summary: "Rukuni a cikin Kur'ani da Sunnah - ba hukunce-hukuncen mutane ba.",
    body: [
      "Mai karatun kur'ani a tsanake ya lura cewa gargadin da ya yi yana kan halaye da halaye ne, ba ga wasu mutane da aka ambata ba. Tana gargaɗi ga waɗanda suka dawwama a kan kafirci bayan gaskiya ta bayyana a gare su, da munafukai waɗanda suke riya da imani a zahiri alhali kuwa suna kafirta ta a cikinta, da azzalumai masu tauye haƙƙin wasu, da masu girman kai masu girman kai ga mika wuya, da masu mutuwa akan babban zunubi ba tare da sun tuba ba.",
      "Wannan mayar da hankali ga nau'ikan maimakon mutane da gangan ne da jinƙai. Ƙofar dawowa a buɗe take ga kowane mai rai, komai nasa na baya, domin ba a rufe fayil ɗin kowa har mutuwa. Gargadin ya bayyana hanyar, ta yadda duk wanda ke tafiya da ita zai iya tashi.",
      "Don haka, Musulunci bai ba mu damar bayyana makomar wani keɓaɓɓen mutum ba - mu ce 'wannan mutumin yana cikin Wuta' - sai dai a wasu lokuta da ba kasafai ba, inda Allah ko Manzonsa ﷺ ya bayyana hakan a sarari cikin wahayi. Hukuncin zukata da qarshensu na Allah ne Shi kadai; Aikin mu shine hisabi namu.",
      "Don haka hanyar da ta dace don karanta kowane gargaɗin ita ce juya shi cikin ciki: ba 'wane ne wannan ya kwatanta ba?' amma 'ko ɗaya daga cikin waɗannan ya kwatanta ni, kuma me zan canza a yau?' Ko wanene kai, gayyatar zuwa ga Allah a bayyane take a yanzu – kuma gobe ba a yi wa kowa alkawari ba.",
    ],
    quran: [
      {
        excerpt: "Munafukai suna a cikin mafi ƙasƙancin wuta.",
      },
      {
        excerpt:
          "To, wanda ya yi tsiwirwirin zunubi, kuma aka rufe shi da shi, to, waɗannan su ne abõkan Wuta, madawwama.",
      },
      {
        excerpt:
          "Kada ka yi zaton Allah Mai gafala ne daga abin da azzalumai suke aikatãwa. Abin sani kawai Yanã jinkirta su zuwa wani yini da idãnu suke kallo.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Manyan Zunubai",
    summary: "Kabair - manyan zunubai masu bukatar tawbah na gaskiya.",
    body: [
      "Malamai sun kasu zunubai gida biyu, fahimtar bambancin yana kawo tsanani da sauki. Manyan zunubai (al-kaba'ir) su ne wanda Allah ko Manzonsa ﷺ ya lissafta takamaiman sakamako mai tsanani - barazanar wuta, ko la'ana, fushin Allah, ko hukuncin da aka kayyade - kamar shirka, kisan kai, da cin riba. Ƙananan zunubai (al-sagha'ir) su ne ƙananan zamewa waɗanda ba su kai ga wannan kofa ba.",
      "Taimakon ya ta'allaka ne a kan yadda suke da alaƙa. Allah ya yi alkawari cewa idan mumini ya nisanci manyan zunubai, to ana shafe kananun da ayyukan ibada na yau da kullum: 'Idan kun nisanci manyan zunubai an hana ku, za mu kankare muku kananan zunubai' (4:31). Sallar sallah da juma'a da juma'a da ramadan da ramadana suna kankare abin da ke tsakaninsu matukar an nisanci manyan zunubai.",
      "Wannan shine dalilin da ya sa manyan zunubai suka cancanci a mai da hankali sosai: sune waɗanda ba a wanke su kawai a cikin kwararar ibadar yau da kullun ba amma suna kira zuwa ga tuba na gaskiya (tawbah). Sun dage ba tare da sun juya baya ba, suna jefa rai cikin haɗari; watsi da tuba daga, an gafarta musu.",
      'Ga kuma sararin samammu gaba xaya: in ban da mutu’a akan shirka, kowane zunubi – babba ko qarami – yana cikin gafarar Allah idan Ya so. "Lalle ne, Allah ba Ya gafarta shirka da Shi, kuma Yana gafarta abin da bai kai wannan ba ga wanda Yake so" (4:48). Kada wani mumini ya taba yanke cewa manyan zunubbansu ba su da wata rahama.',
      "Kowane babban batu na zunubi a cikin wannan tsarin yana ba da ma'anarsa, shaidarsa, dalilin da ya sa ya zama kabari, da tabbataccen hanyar tuba da nisantar juna - koyaushe yana ƙarewa a wannan buɗewar kofa.",
    ],
    quran: [
      {
        excerpt:
          "Idan kun nĩsanci manyan zunubai waɗanda aka hana ku, zã Mu kuranye mafi ƙanƙanta daga gare ku, kuma Mu shigar da ku ga wata mashiga ta karimci.",
      },
      {
        excerpt:
          "Lalle ne, Allah bã Ya gãfarta yin shirka da Shi, kuma amma Yanã gãfarta abin da bai kai haka ba ga wanda Yake so.",
      },
      {
        excerpt:
          "Kuma waɗanda ke nisantar manyan zunubai da alfãsha, fãce kaɗan. Lalle ne Ubangijinka, haƙĩƙa, Mai gãfara ne.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mafi girman manyan zunubai su ne: shirka da Allah, da kashe rai, da saba wa iyaye, da shaidar zur.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Zunuban Harshe",
    summary: "Ƙarya, ƙarya, izgili - zunubai masu sauƙin aikatawa kuma masu wuyar warwarewa.",
    body: [
      "Harshe karami ne amma sakamakonsa yana da yawa; da ‘yan kalmomi mutum na iya gina amana ko lalata suna, ya ta’azantar da zuciya ko kuma ya raunata ta sosai. Don haka ne Alqur’ani da Sunnah sukan koma ga zunubban magana: gulma (ghibah), zage-zage (buhtan), xaukar labari (namimah), qarya, izgili, rantsuwar qarya.",
      "Ƙarya yana nufin faɗin ɗan’uwanku ko ’yar’uwarku abin da ba za su so ba, ko da gaskiya ne—domin idan ƙarya ce, zai zama mafi muni na zagi. Alkur'ani ya ba shi daya daga cikin siffofi masu ban mamaki: ya kamanta shi da cin naman dan'uwansa da ya mutu (49:12). An tsara shi ta hanyar, zunubin ya rasa rashin jin daɗi.",
      'Abin da ya sa waɗannan zunubai su kasance masu haɗari shine daidai yadda suke da sauƙi da kuma al\'ada. Mutane suna shiga cikin su cikin zance na yau da kullun ba tare da tunani na biyu ba, shi ya sa Annabi ﷺ ya daure imani da kansa da kiyaye magana: "Duk wanda ya yi imani da Allah da ranar lahira, to ya fadi alheri ko ya yi shiru." Dakata a sauƙaƙa kafin yin magana ibada ce ta gaske.',
      "Tuba daga zunubin harshe yana bin sharuɗɗan da aka saba - tsayawa, nadama, yanke shawara ba za a dawo ba - tare da ƙarin girma lokacin da hakkin wani ya shiga. Inda za a iya share suna ko neman afuwarsu ba tare da cutar da su ba, wannan yana daga cikin tuba; inda sanar da su ba zai kara zurfafa rauni ba, malamai suna ba da shawara a maimakon su yi magana mai kyau, a kare su idan ba su nan, da kuma yi musu addu’ar gafara.",
    ],
    quran: [
      {
        excerpt: "Kada ku zagi juna. Shin ɗayanku zai so ya ci naman ɗan'uwansa matacce?",
      },
      {
        excerpt: "Bone ya tabbata ga dukkan mai izgili da izgili.",
      },
    ],
    hadith: [
      {
        excerpt: "Wanda ya yi imani da Allah da Ranar Lahira, to ya fadi alheri ko ya yi shiru.",
      },
    ],
    actions: [
      "Kafin yin magana, tambaya: Shin gaskiya ne? Shin wajibi ne? Yana da kirki?",
      "Idan kuka zagi wani, yi musu addu'a kuma ku nemi gafarar sa idan ya yiwu.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Laifin Wasu",
    summary: "Haƙƙin mutane na buƙatar ramawa - ba tuba ga Allah kaɗai ba.",
    body: [
      "Musulunci ya raba hakkokin da muke bin mu zuwa gida biyu: hakkin Allah (hukuq Allah) da hakkin mutane (huquq al-'ibad). Zalunci (dhulm), zalunci, karya amana, zamba a kasuwanci, hana albashi, basussukan da ba a biya ba, da yanke alakar iyali duk sun fada karkashin hakkin mutane - kuma wadannan suna da matukar muhimmanci a Lahira.",
      "An nuna dalilin a cikin wani hadisi mai hankali. Annabi SAW ya siffanta mutumin da ya yi fatara da gaske a matsayin wanda ya zo ranar kiyama da addu’a da azumi da sadaka – duk da haka ya ci mutuncinsa, ya zage shi, ya kwaci dukiya, da zubar da jini. Ana biyan abin da aka yi masa na alheri har sai sun kare, sannan a dora masa zunubansu a jefa shi wuta (Sahih Musulmi 2581). Mutum zai iya arzuta a ibada kuma zai iya lalata shi ta yadda ya bi da wasu.",
      "Wannan yana koyar da darasi mai mahimmanci game da tuba: komawa ga Allah wajibi ne, amma idan aka tauye haƙƙin ɗan adam, bai wadatar da kanta ba. Da'awar wanda aka zalunta ya kasance har sai an daidaita ko kuma a gafarta masa. Don haka tuba a nan yana da sharadi na huɗu da ya wuce tsayawa, nadama, da warwarewa - mayar da abin da ake bi bashi.",
      "A aikace wannan yana nufin mayar da abin da aka karbe ko kimarsa, biyan basussuka ko da sannu a hankali, maido da martabar da mutum ya lalace, da kuma kai ga sasantawa da ’yan uwa da aka yanke. Kuma a cikin wannan ma akwai rahama: duk wani mataki na ramawa shi kansa aikin alheri ne, kuma Allah yana sassauta zuciya mai ikhlasi da ta yi niyyar gyara abin da ya karye.",
    ],
    quran: [
      {
        excerpt: "Idan ba ku hanu daga riba ba, to ku lura da yaqi daga Allah da ManzonSa.",
      },
      {
        excerpt:
          "Waɗanda suke warware alkawarin Allah, kuma suka yanke abin da Ya yi umurni da shi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kun san waye wanda ya yi fatara? Wanda ya zo da salla, da azumi, da sadaka, amma ya zage-zage, ya zage-zage, da cin dukiyar haram, da zubar da jini, don haka ayyukansa na alheri ake bai wa wasu.",
      },
    ],
    actions: [
      "Ka lissafa duk wanda ka yi wa laifi kuma ka ɗauki mataki don gyara wannan makon.",
      "Biyan basussukan da ba su da yawa ko da a cikin ƙanƙanta kaɗan idan wannan shine kawai za ku iya sarrafa.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Munafunci",
    summary: "Babban munafunci a cikin imani - da halayen munafunci a cikin hali.",
    body: [
      "Malamai sun bambanta nau'ikan munafunci guda biyu, kuma ware su yana hana ta'aziyya ta ƙarya da firgita na ƙarya. Na farko shi ne babban munafuncin imani (nifaq i'itiqadi): bayyanar da Musulunci a zahiri alhali kuwa a zahiri kin imani. Wannan ita ce munafuncin da Kur'ani ya yi kashedi da shi mafi girma, yana sanya irin wadannan mutane a cikin mafi ƙasƙancin wuta (4:145), domin a zahiri sun mutu suna kafirai a bayan abin rufe fuska.",
      "Na biyu kuma shi ne karami, munafuncin halayya (nifaq 'amali): dabi'un da suke kama da halin munafukai hatta a cikin mutumin da imaninsa ya tabbata. Manzon Allah Sallallahu Alaihi Wasallama ya ambaci sunayen sanannun alamomin – ‘idan yana magana sai ya yi qarya, idan ya yi alkawari sai ya warware, idan aka ba shi amana sai ya ci amana’ – a wata ruwayar kuma ya kara da husuma a cikin sabani. A believer can fall into these and still be a believer, but they are a serious warning to guard against.",
      "Wannan bambanci yana da mahimmanci ga yadda muke amfani da batun. Ana ba da alamun halayen a matsayin madubi don kansa, ba a matsayin lakabin da za a lika kan wasu ba. Annabi SAW da Sahabbansa sun ji tsoron munafunci a cikin su daidai domin zuciya a boye take kuma tana iya canzawa.",
      "Don haka lafiyayyen amsa yana cikin ciki: don tantance gaskiyarsa, da rikon alqawari, da riqon amana, da roqon Allah ikhlasi. Allah ne kawai ya san abin da ke cikin mutum, kuma zargin wasu mutane da munafunci shi kansa babban zalunci ne a kansu.",
    ],
    quran: [
      {
        excerpt: "Munafukai suna a cikin mafi ƙasƙancin wuta.",
      },
      {
        excerpt:
          'Kuma idan munafukai suka zo maka sai su ce: "Mun shaida lalle kai Manzon Allah ne, kuma Allah Ya san su maƙaryata ne."',
      },
    ],
    hadith: [
      {
        excerpt:
          "Alamomin munafiki guda uku ne: idan ya yi magana sai ya yi karya, idan ya yi alkawari sai ya warware, idan aka ba shi amana sai ya ci amana.",
      },
    ],
    disclaimer:
      "Kada ku zargi mutane da nifaq. Nassosin sun gargadi al'umma; tsarkakewa yana farawa da kansa.",
  },
  {
    title: "An Ambato Hukunci",
    summary: "Abin da nassosin suka bayyana - karanta tare da tsoron Allah da fatan rahamarSa.",
    body: [
      "Kur'ani da Sunnah sun bayyana takamaiman sakamako ga kebantattun laifuffuka - ga masu cin riba, masu zagin mata masu kamun kai, masu tara dukiya da hana ta, masu barin sallah, kuma suka dage da aikata manyan zunubai. Ƙayyadaddun ƙayyadaddun nau'i ne na bayyanawa: ba ya barin wani ya ce ba a yi musu gargaɗi game da ainihin abin da suke yi ba.",
      "An siffanta wasu daga cikin wadannan sakamakon a cikin kabari (adhab al-qabr) wasu kuma a cikin Jahannama ita kanta. Aqida ta Ahlus-Sunnah ta gama gari tana tabbatar da haƙiƙanin haƙiƙanin biyun, tare da baiwa ainihin 'yadda' waɗannan al'amuran gaibi ga sanin Allah maimakon tunanin ɗan adam.",
      "Yadda mumini ke shagaltuwa da duk wannan shi ne abin da yake da muhimmanci. Manufar ba shine a taɓa yin tunani a kan dalla-dalla ba ko kuma a bar zuciya ta nutse; shi ne a karɓi gargaɗi, tuba daga duk abin da ya shafi, sa'an nan kuma juya kuzari zuwa ga ayyukan da a zahiri karewa. Shi ya sa da gangan wannan tsarin ya ba da ƙarin sarari ga kariya, tuba, da rahama fiye da azabtarwa.",
      "A taƙaice, ɗaukar daidai daga kowane hukunci da aka ambata tambaya ce, ba tsoro ba: 'Ina yin wannan - kuma idan haka ne, ta yaya zan tsaya in gyara shi?' An amsa da gaskiya a yau, gargaɗin ya riga ya yi aikin jinƙai.",
    ],
    quran: [
      {
        excerpt:
          "Waɗanda suke zargin mata tsarguwa kuma ba su zo da shaidu huɗu ba, to, ku yi musu bulala tamanin.",
      },
      {
        excerpt:
          "Waɗanda suke yin tarar zinariya da azurfa, kuma ba su ciyar da su a cikin tafarkin Allah, to, ka yi musu bushãra da azãba mai raɗaɗi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kariya daga wuta",
    summary: "Tauhidi, Sallah, tawbah, sadaka, Alqur'ani, da addu'a - zuciyar wannan module.",
    body: [
      "Bayan dukkan gargaxi, wannan ita ce zuciyar al’amarin: Jahannama wani abu ne da ake son a kiyaye mutum daga gare shi, kuma Musulunci ya cika da hanyoyin wannan kariya. Mafi girmansu shi ne tauhidi ingantattu, bauta wa Allah Shi kadai, ba da kome ba, baicinSa. Duk wani aiki da ake karba kuma a auna shi a kan wannan asasi ne kawai, shi ya sa kiyaye imanin mutum ke gaba da komai.",
      "A kan wannan tushe, garkuwa a aikace suna da yawa kuma ba za a iya isa ba: Tsaida salloli biyar, tuba ta gaskiya, ba da sadaka - wanda Annabi SAW ya ce yana kashe zunubi kamar yadda ruwa ke kashe wuta - azumi, karatun Alkur'ani da aiki da shi, kyawawan halaye, jinkai ga sauran mutane, zikiri (zikiri), da yawaita neman gafara. Babu ɗayan waɗannan da ke buƙatar babban arziki ko ilimi; a bude suke ga kowa.",
      "Haka nan Annabi SAW ya koyar da addu’o’in neman tsari daga wuta kai tsaye, kuma ya kwadaitar da mu da yawaita roko. Ya ce, duk wanda ya roki Allah Aljanna sau uku, Aljannar kanta ta yi addu’ar shigarsa, wanda kuma ya nemi tsari daga Wuta sau uku, to ita kanta Wuta tana addu’ar Allah ya raba shi da ita (Jami’at-Tirmizi 2572). Wadannan addu'o'in suna da wani wuri na musamman kafin sallama a cikin sallah da azkar safe da yamma.",
      "Ku lura da ma'aunin da Sharia ta yi. Hanyoyin kariya sun fi yawa, sun fi ba da fifiko, kuma sun fi samuwa fiye da abubuwan da ke haifar da lalacewa - kuma wannan shi kansa alamar rahamar Allah ne. Ya fi sauƙi a sami ceto da a rasa.",
      "Wannan sashe da niyya shi ne mafi girma a cikin tsarin, saboda haka Musulunci da kansa ya auna al'amarin: gargadi ko da yaushe yana tare da bege, kuma ba zai taba rabuwa da wani aiki na zahiri da mutum zai iya farawa a yau ba.",
    ],
    quran: [
      {
        excerpt: "Waɗanda suke cewa: “Ya Ubangijinmu!",
      },
      {
        excerpt:
          "Ya Ubangijinmu ka bamu mai kyau a duniya da mai kyau a lahira, kuma ka kare mu daga azabar wuta.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Duk wanda ya roki Allah Aljannah sau uku, Aljannah ta ce: Ya Allah ka shigar da shi Aljannah. Wanda ya nemi tsari daga wuta sau uku, wuta ta ce: Ya Allah ka kare shi daga wuta.",
      },
    ],
    actions: [
      "Ka haddace addu'o'in neman tsari daga Jahannama kafin sallama a cikin sallah.",
      "Yi salloli biyar akan lokaci - daga cikin garkuwa mafi ƙarfi.",
      "Ba da sadaka akai-akai, koda kadan ne.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Tuba (Tawbah)",
    summary: "Allah yana karɓar tuba na gaskiya - babu zunubi da ya fi girma kafin mutuwa.",
    body: [
      "Tawbah — tuba — ita ce tsarin da Allah Ya gina a cikin addini ta yadda babu wani zunubi da ya kamata ya dawwama. A cikinsa shi ne komawar zuciya zuwa ga Allah, kuma malamai sun ciri sharuddansa daga Alkur’ani da Sunna: da gaske ku daina zunubi, ku ji nadamarsa ta gaske, kuma ku dage ba za ta dawo ba. Lokacin da zunubin ya shafi haƙƙin wani, an ƙara sharadi na huɗu - maido da wannan haƙƙin ko neman gafarar su.",
      "Abin da ya sa tawbah ta kasance da bege, shi ne yadda Allah yake karbar ta. Ba ya ƙyale bawan da ya dawo kawai; Yana murna. Manzon Allah SAW ya ce Allah ya fi farin ciki da tuban bawansa fiye da mutumin da ya rasa dutsen sa da duk abin da zai ciyar da shi a cikin sahara bakarara kuma ya yanke bege, sai ya same ta a tsaye a gabansa (Sahihul Bukhari 6309). Wannan ita ce maraba da ke jiran duk wanda ya juya baya.",
      "Ƙofarsa, haka kuma, ba ta rufewa a tsawon rayuwa. Manzon Allah SAW yace Allah yana mika hannunsa da dare domin karbar tuban mai zunubin yini, kuma yana mika hannunsa da rana domin karban tuban mai zunubin dare (Sahih Musulmi 2759). Ana karɓar tuba ga mutum har sai rai ya kai makogwaro a mutuwa, kuma ga ɗan adam har sai rana ta fito daga yamma - don haka babu wani dalili na jinkirta shi.",
      "Wannan gaskiya ne har ma ga wanda ya fadi kuma ya tuba. Matukar komawar ta kasance ta gaskiya a kowane lokaci, Allah yana karba; yanke kauna daga Shaidan ne, ba daga addini ba. Abu daya da ya wajaba a daidaita shi kafin mutuwa shi ne shirka, tunda wanda ya mutu a kanta ya mutu ba tare da imanin da tuba ke bukata ba - wanda shi ne ma ya sa komawa ga Allah kadai shi ne mafi gaggawar dawowar kowa.",
      "Hanya mai amfani mai sauƙi ce: tuba yanzu, tuba akai-akai, kuma kada ka bari girman zunubi, ko adadin faɗuwar da ya gabata, yayi gardama akan dawowa. Gayyatar tana buɗewa koyaushe.",
    ],
    quran: [
      {
        excerpt:
          "Kada ku yanke kauna daga rahamar Allah. Lallai Allah yana gafarta zunubai baki daya. Shĩ ne Mai gãfara, Mai jin ƙai.",
      },
      {
        excerpt:
          "Fãce waɗanda suka tũba, kuma suka yi ĩmãni, kuma suka aikata ayyukan ƙwarai, Allah zai musanya miyãgun ayyukansu da alhẽri.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kuma Allah Ya fi yarda da tuban bawanSa fiye da wanda ya iske dutsen da ya bata a cikin kasa bakarara.",
      },
      {
        excerpt:
          "Allah yana mika hannunsa da dare domin karbar tuban mai zunubin yini, kuma yana mika hannunsa da rana domin karbar tuban mai zunubin dare, har sai rana ta fito daga yammacinta.",
      },
    ],
    actions: [
      "Ka ce Astaghfirullah a tsawon yini - nufin samun daidaito, ba kawai bayan manyan zamewa ba.",
      "Koyi sayyid al-istigfar a karanta safe da yamma.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Da fatan Allah Ya jikansa",
    summary: "Kada ka yanke ƙauna - ayyuka nagari suna shafe zunubai; daidaito al'amura.",
    body: [
      "Duk abin da ke cikin wannan tsarin yana nuni a nan. Allah shi ne ar-Rahman ar-Raheem-Mai jin ƙai - kuma Ya gaya mana cewa rahamarSa ta fi ƙarfin fushinsa kuma 'ya kewaye dukkan komai' (7:156). Ana nufin mumini ya rayu tsakanin bege da tsoro, kamar fuka-fuki biyu na tsuntsu: mai tsoron isa ga zunubi ya tsaya a faɗake, mai yawan bege ga gafara ba zai daina ba.",
      "Saboda haka, yanke kauna ba ta da tushe. Duk da yake mutum yana jin sun ɓace, kofa a buɗe take, kuma Shaidan ne - ba Allah ba - wanda ke rada cewa ya makara. Kuma yanke kauna daga rahama shi ne kaxan yi tunanin mai rahama. aikin zuciya mai gaskiya shine kawai komawa.",
      "Anan akwai babban ta'aziyyar aqidar Sunna game da Wuta. Ga waɗanda suka mutu a kan kafirci, Jahannama ta kasance matabbata. Amma muminin da ya mutu yana tabbatar da Allah shi kadai, ko da manyan zunubai sun yi nauyi, ba zai dawwama a cikinsa ba har abada. Annabi SAW ya koyar da cewa za a fitar da mutane daga wuta ta hanyar ceto sannan kuma da rahamar Allah - a jefa su a cikin kogin rayuwa a gefen Aljanna, inda za a dawo da su kuma a shigar da su (Sahihul Bukhari 7439). Ya ce babu wanda zai saura a cikin wuta wanda ke da nauyin imani ko da kwaya a cikin zuciya (Sahih Musulmi 183). Don haka mai tauhidi, wuta – idan aka shige ta kwata-kwata – ba ita ce karshen labari ba.",
      "A halin yanzu, ana gina jinƙai a cikin rayuwar yau da kullun: ayyuka na gari suna shafe munanan ayyuka (11:114), da ƙarama, daɗaɗɗen ibada - addu'a ɗaya akan lokaci, aikin sadaka guda ɗaya, haƙuri ɗaya da aka yi don Allah - yana kusantar mutum zuwa gare shi kuma yana nisanta daga cutarwa. Matsakaicin al'amura fiye da tsanani.",
      "Don haka bari wannan ya zama ƙarshen bincikenku: ku ɗauki gargaɗin da gaske, amma bari bege ya fi tsoro. Ku san hatsarin, ku zabi hanyar rahama, kuma ku yi tafiya da shi - mataki daya - kowace rana har sai kun hadu da Allah.",
    ],
    quran: [
      {
        excerpt: "Rahamata ta kewaye dukkan komai.",
      },
      {
        excerpt:
          "Ka ce: Ya ku bayiNa wadanda suka yi zalunci a kansu, kada ku yanke tsammani daga rahamar Allah. Lallai Allah yana gafarta zunubai baki daya.",
      },
      {
        excerpt:
          "Lallai aikin kwarai yana kawar da munanan ayyuka. Wancan tunãtarwa ce ga waɗanda suke tunãwa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah zai ce: Mala’iku sun yi ceto, annabawa sun yi ceto, kuma muminai sun yi ceto, kuma babu wanda ya rage sai mai rahama mai jin kai. Zai karɓi dãɓãya kaɗan daga Wuta, kuma Ya fitar da mutãne waɗanda ba su kyautatãwa ba.",
      },
      {
        excerpt:
          "Duk wanda yake da imaninsa a cikin zuciyarsa nauyin ƙwayar mastad za a fitar da shi daga wuta.",
      },
    ],
    actions: [
      "Ƙare kowace rana tare da istighfar da godiya ga kowace ni'ima.",
      "Haɗa wannan tsarin tare da Tafiya zuwa Jannah - gargaɗi da bege tare.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Zunubai masu halakarwa",
    summary: "Zunubai bakwai masu halakarwa, manyan zunubai, da gargadi kan hakkokin mutane.",
    body: [
      "Alkur'ani da Sunna suna bayyana tsananin zunubi da harshen gargadi; ba jerin darajar Mizan ba ne.",
      "Annabi ﷺ ya umarce mu mu nisanci zunubai bakwai masu halakarwa.",
      "Mai take hakkokin mutane na iya ba su kyawawan ayyukansa.",
      "Kada ku yanke ƙauna daga rahamar Allah; ƙofar tuba a buɗe take har mutuwa.",
      "Sai mutuwa a kan shirka ba tare da tuba ba, Allah yana gafarta wa wanda Ya so.",
    ],
    destructiveItems: [
      {
        title: "Shirka",
        summary: "Haɗa wani da Allah shi ne zunubi mafi girma.",
      },
      {
        title: "Sihiri",
        summary: "Yin sihiri yana cikin zunubai masu halakarwa.",
      },
      {
        title: "Kisa ba da hakki ba",
        summary: "Kashe ran da Allah Ya haramta sai da hakki.",
      },
      {
        title: "Cin riba",
        summary: "Riba da anfani zunubi ne mai nauyi.",
      },
      {
        title: "Cin dukiyar maraya",
        summary: "Kwace dukiyar maraya da zalunci.",
      },
      {
        title: "Gudun fagen yaƙi",
        summary: "Juya baya yayin da runduna take gaba.",
      },
      {
        title: "Zargin mata masu tsarki",
        summary: "Zargin mata muminai masu tsarki da zina.",
      },
      {
        title: "Maflisi",
        summary: "Wanda ake ɗaukar kyawawan ayyukansa domin hakkokin mutane.",
      },
    ],
    quran: [
      {
        excerpt: "Kada ku yanke ƙauna daga rahamar Allah; ƙofar tuba a buɗe take har mutuwa.",
      },
      {
        excerpt: "Sai mutuwa a kan shirka ba tare da tuba ba, Allah yana gafarta wa wanda Ya so.",
      },
      {
        excerpt: "Annabi ﷺ ya umarce mu mu nisanci zunubai bakwai masu halakarwa.",
      },
    ],
    hadith: [
      {
        excerpt: "Annabi ﷺ ya umarce mu mu nisanci zunubai bakwai masu halakarwa.",
      },
      {
        excerpt: "Mai take hakkokin mutane na iya ba su kyawawan ayyukansa.",
      },
      {
        excerpt: "Shirka",
      },
      {
        excerpt: "Kisa ba da hakki ba",
      },
      {
        excerpt: "Wanda ake ɗaukar kyawawan ayyukansa domin hakkokin mutane.",
      },
    ],
    actions: [
      "Annabi ﷺ ya umarce mu mu nisanci zunubai bakwai masu halakarwa.",
      "Mai take hakkokin mutane na iya ba su kyawawan ayyukansa.",
      "Kada ku yanke ƙauna daga rahamar Allah; ƙofar tuba a buɗe take har mutuwa.",
    ],
    appLinks: [
      {
        label: "Zunubai masu halakarwa",
      },
      {
        label: "Mai nauyi a Mizan",
      },
      {
        label: "Shirin Mizan mai nauyi",
      },
      {
        label: "Gaskiya",
      },
    ],
  },
];

export const JAHANNAM_MAJOR_SIN_TOPICS_HA: DeepPartial<JahannamTopic>[] = [
  {
    title: "Shirka",
    summary: "Yin shirka da Allah, wanda ba a gafarta masa zunubi idan ya mutu a kansa.",
    body: [
      "Ma’ana: Shirka ita ce shirka da Allah – don shiryar da duk wani aiki da yake nasa shi kadai (bauta, so na karshe, ko tsoro, ko bege, ko tawakkali, ko hakki na shari’a) zuwa ga wani abu ko waninSa. Ita ce kishiyar tauhidi, kuma tana kaiwa zuwa ga ainihin manufar da halitta ta kasance gare ta: bauta wa Allah Shi kadai.",
      "Me ya sa shi ne mafi girman dukkan zunubai: kowane zunubi kuskure ne da aka yi shi yayin da yake yarda da Ubangiji na gaskiya, amma shirka kuskure ne da aka yi masa kai tsaye - yana kuskuren halitta ga Mahalicci. Don haka ne Kur'ani ya kira shi 'zalunci mai girma' (31:13). Shi ne zunubin da, idan mutum ya mutu a kansa ba tare da ya tuba ba, ba a gafarta masa: \"Lalle ne, Allah ba Ya gafarta shirka da Shi, kuma Yana gafarta abin da bai kai ba ga wanda Yake so\" (4:48). Rahamar da ke boye ko da a cikin wannan tsanani shi ne duk abin da ya rage na shirka yana nan karkashin gafarar Allah.",
      "Siffofinta: malamai sun bambanta babbar shirka – bautar gumaka, matattu, waliyyai, ko abubuwan halitta; kiran wanin Allah ga abin da Shi kadai yake iya bayarwa. da bayar da sadaukarwa ko bakance ga waninSa - wanda ke fitar da mutum daga Musulunci idan bai tuba ba. Haka nan akwai shirka karama da boye, kamar nuna bajinta a cikin ibada (riya’), rantsuwa da wanin Allah, ko dogaro da ishara da laya, wanda babban zunubi ne amma ba shi kadai ya kore shi daga addini ba.",
      "Hanyar nisantarsa: kiyayewa da karfafa tauhidi da koyonsa, da bautar Allah Shi kadai, da tsarkake niyya domin ayyuka su kasance nasa ne ba na idanun mutane ba. Duk wanda ya fada cikin shirka ya tuba ta hanyar barranta daga gaskiya da komawa zuwa ga bautar Allah Shi kadai – kuma kofar komowa a bude take matukar mutum yana raye.",
    ],
    quran: [
      {
        excerpt:
          "Lalle ne, Allah bã Ya gãfarta yin shirka da Shi, kuma amma Yanã gãfarta abin da bai kai haka ba ga wanda Yake so.",
      },
      {
        excerpt: "Ya kai dana kada ka yi shirka da Allah. Lallai ne tarayya zalunci ne mai girma.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mafi girman manyan zunubai su ne: shirka da Allah, da kashe rai, da saba wa iyaye, da shaidar zur.",
      },
    ],
    actions: [
      "Koyi tauhidi ta hanyar Koyi Aqida da Sunayen Allah 99.",
      "Tsarkake niyya a cikin ibada - ku roƙi Allah ikhlasi kullum.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kisa",
    summary: "Ɗaukar rayukan marasa laifi ba bisa ka'ida ba - daga cikin manyan laifuka.",
    body: [
      "Ma'ana: Kisan kai a nan yana nufin haramun, da gangan kashe rayuwar da Allah ya sanya. Musulunci ya amince da shari'o'i na halal - kamar qisas halal (hukuncin shari'a) wanda hukuma ta dace ta aiwatar - amma kashe rai wanda ba shi da laifi ba tare da hakki ba yana daga cikin manya-manyan laifuffuka.",
      "Me ya sa ya zama kabari: Alkur’ani ya auna kisa guda na zalunci a kan sikelin dukkan bil’adama: ‘Duk wanda ya kashe rai... kamar ya kashe mutane ne baki daya’ (5:32), domin halakar rai daya shi ne keta alfarmar da ke kare kowace rai. Kisan kai shine zunubi na farko da aka aikata tsakanin ’ya’yan Adamu, kuma wahayi ya sake komawa gare shi a matsayin mai halakar da Lahira.",
      "Kuskure biyu: kisan kai zunubi ne ga Allah, wanda aka tattake haƙƙinsa a kan alfarmar rayuwa, kuma zunubi ne a kan mutane - waɗanda aka kashe da waɗanda suka bari. Shi ya sa tubarta ta fi mafi yawa nauyi: komawa ga Allah wajibi ne, amma kuma hakkin wanda aka zalunta shi ma ya tsaya, kuma a inda shari’ar kasa ko shari’ar Musulunci ta tsara kudin jini (diyah) ko wasu sakamakonsa, to dole ne a cim ma wadannan ta hanyoyin da suka dace da kuma kwararrun malamai.",
      "Hanyar nisantar ta: Ku riƙi kowace rayuwa da tsarki, ku kawar da fushi da ƙiyayya kafin su taurare, kuma a warware husuma ta hanyar haƙuri da adalci maimakon tashin hankali. Kuma ko da mafi girman laifuffukan da ake yi wa mutane bai wuce rahamar Allah ba ga wanda ya tuba na gaskiya, ya sauke haqqoqin da ke cikinsa gwargwadon iko, kuma bai koma ga irin wannan tafarki ba.",
    ],
    quran: [
      {
        excerpt:
          "Kuma wanda ya kashe rai fãce da wani rai, kõ kuwa ɓarna a cikin ƙasa, to, kamar dai ya kashe mutãne ne.",
      },
      {
        excerpt:
          "Kuma wanda ya kashe mũminai da ganganci, to, sakamakonsa Jahannama, yana madawwama a cikinta.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mafi girman manyan zunubai su ne: shirka da Allah, da kashe rai, da saba wa iyaye, da shaidar zur.",
      },
    ],
    actions: ["Kimar kowace rayuwa; warware sabani da hakuri da adalci."],
    appLinks: [{}],
  },
  {
    title: "Zina",
    summary: "Jima'i ba bisa ka'ida ba - zunubi mai halakarwa ga rai da al'umma.",
    body: [
      "Ma’ana: Zina ita ce duk wata alaka da ba ta halatta ba a wajen aure mai inganci, wanda ke tattare da fasikanci (tsakanin marar aure) da zina (wanda ya shafi mai aure). Musulunci ba ya daukarsa a matsayin abin da ya kebanta da shi, sai dai a matsayin cin zarafi da cutarwa mai fadi.",
      "Me ya sa kabari: zina tana lalata abubuwan da aka gina al’umma lafiya a kai – nasaba, amana tsakanin ma’aurata, tsaron ‘ya’ya, da tsaftar da ke girmama mutum. Lafazin Kur'ani da kansa yana da koyarwa: ba wai kawai ya haramta aikin ba amma yana cewa 'kada ku kusace shi' (17:32), yana gargaɗi game da kallo, keɓewa, da matakan da za su kai gare shi. Wannan haramcin kusanci rahama ne, domin yana kiyaye mutum kafin fitina ta yi yawa.",
      "Hikimar da ke cikin shingayen: maimakon barin mutane don yakar sha’awa a kololuwarta, Musulunci ya kewaye su da kariyar da ta gabata - runtse ido, da kunya a cikin sutura da dabi’u, da nisantar keɓancewa da kishiyar jinsi, da ƙarfafa aure a matsayin halal, tashar daraja ga waɗannan buƙatu. Gina waɗannan iyakoki a gaba ya fi sauƙi fiye da tsayayya a gefen.",
      "Hanyar komawa: ga duk wanda ya fadi, mafita ita ce tawbah na gaskiya - barin zunubi gaba daya, da nadama, da warwarewa ba zai dawo ba, da yin sutura maimakon bayyana abin da ya gabata. Zina zunubi ne babba, amma yana daga cikin wadanda Allah ke gafartawa ga wanda ya tuba zuwa gare Shi; yanke ƙauna ba shi da wuri, kuma sabon farawa koyaushe yana samuwa.",
    ],
    quran: [
      {
        excerpt:
          "Kada ku kusanci jima'i na haram. Lalle ne ita alfasha ce kuma tafarki ne mummuna.",
      },
      {
        excerpt:
          "Kuma waɗanda ba su yi zina ba... fãce wanda ya tũba, kuma ya yi ĩmãni, kuma ya aikata aiki na ƙwarai, to, Allah zai musanya musu mũnanan ayyukansu da alhẽri.",
      },
    ],
    actions: [
      "Kare idanu da amfani da kafofin sada zumunta.",
      "Yi addu'a ga ma'aurata salihai idan ba a yi aure ba.",
    ],
    appLinks: [{}],
  },
  {
    title: "Riba",
    summary: "Riba da riba - yaki da aka ayyana a kan masu yin sa a cikin Alkur'ani.",
    body: [
      "Ma'anar: Riba shine karuwa da ba bisa ka'ida ba a cikin wasu mu'amalar kudi - mafi yawan ribar da ake karba ko biya akan lamuni, amma kuma ya hada da takamaiman musanya mara daidaito ko jinkirta musaya na kayayyaki kamar. Asalinsa shine samun arziki ba tare da kima na gaske ko kasada ba, a kudin wani.",
      "Dalilin da ya sa ta zama kabari na musamman: riba ta bambanta a cikin zunubai na kuɗi a cikin harshen da Kur'ani ya yi amfani da shi a kansa. Allah ya shelanta yaki daga kansa da manzonsa s.a.w akan wadanda suka dage akansa (2:279) — jumlar da ba a amfani da ita ba don wani zunubi ba - saboda riba tana amfani da bukata, tana tattara dukiya a hannun ‘yan kadan, kuma tana tauye tausayin tattalin arziki da ake son aiwatarwa. Annabi ﷺ ya yi gargadi mai tsanani a kan mu’amala da ita ta kowace irin hali.",
      "Hikima da jinƙai: haramcin yana karkatar da mutane zuwa ga kasuwanci na gaske, haɗarin haɗari, da sadaka, kuma yana kare masu rauni daga murkushe su ta hanyar bashi. Ko a nan, ko da yake, rahamar Allah tana nan: a lokacin da umurnin ya zo, bai nemi a wargaza riba da ta gabata ba, amma ya ce wa muminai su yi watsi da abin da ya saura – ‘Kuna da shugabanku’ (2:279) – sauki ga masu bijirewa daga gare ta.",
      "Hanyar da ke nesa da shi: bincikar kuɗin ku don samfuran ruwa, nemi hanyoyin halal, da tuntuɓar kwararrun malamai don shari'o'i masu wahala na gaske kamar jinginar gida a ƙasashen da ba na musulmi ba. Barin riba na iya nufin zaban kudi mai wuyar gaske, amma amincin rai ya fi kowane riba na wucin gadi - kuma Allah ya yi alkawari zai azurta wanda ya ji tsoronsa daga inda ba ya zato.",
    ],
    quran: [
      {
        excerpt:
          "Ya ku wadanda suka yi imani ku bi Allah da takawa, kuma ku bar abin da ya rage na riba, idan kun kasance muminai. Idan ba ku aikata ba, to, a ba ku labari game da yaƙi daga Allah da ManzonSa. To, idan kun tũba, to, zã ku sami shugabanku, bã zã ku yi zãlunci ba, kuma ba a zãlunce ku ba.",
      },
      {
        excerpt: "Allah yana halakar da riba kuma yana ƙãra sadaka.",
      },
    ],
    actions: [
      "Bincika kuɗi don samfuran tushen riba.",
      "Tuntuɓi ƙwararren malami don jinginar gidaje da basussuka.",
    ],
    appLinks: [{}],
  },
  {
    title: "Shaidar Qarya",
    summary: "Yin ƙarya a ƙarƙashin rantsuwa ko yin shaidar zur - yana lalata adalci.",
    body: [
      "Ma’ana: Shaidar qarya (shahadat al-zur) ita ce shaidar wani abu na rashin gaskiya – kuma mafi fa’ida, yin qarya a qarqashin rantsuwa, qirqirar zarge-zarge, ko hana shedar gaskiya idan adalci ya dogara da shi.",
      "Me ya sa ya zama kabari: yana lalata kayan aikin da ake yin adalci da shi. Shaidar ƙarya ɗaya na iya aika marar laifi ya lalatar da shi, ko ya ƙwace mai hakki daga dukiyarsa, ko kuma ya 'yantar da azzalumi - don haka ƙarya ba ta taɓa kasancewa ga maƙaryata ba; yana cutar da mutane na gaske da kuma dukan tsari na adalci. Annabi ﷺ ya lissafta shi a cikin manya-manyan zunubai, kuma a wata ruwaya ya karu ya nanata kashedi a kansa, har Sahabbansa suka yi fatan ya daina, saboda damuwa da shi.",
      "Alakarsa da harshe: shaidar zur ita ce mafi kaifin mafi girman zunubban magana. Saboda kalmomi suna da arha a faɗowa, wannan zunubi yana da sauƙin faɗowa cikin haɗari - sa hannu, wuce gona da iri, shiru mai dacewa - amma duk da haka nauyinsa a ranar kiyama yana da girma, lokacin da gaɓoɓin gabobi da harsunan mutane za su yi shaida da gaskiya a kansu.",
      "Hanyar nisantar ta: ka yi riko da gaskiya ko da kuwa tana da tsada ko kuma ta sabawa maslaha, ka qin ba da lamuni ga kowace irin qarya, kuma ka yi magana da shaidar gaskiya a lokacin da ake buqata. Wanda ya yi shaidar zur ya tuba ta hanyar janye karyar a inda ya yiwu, da kokarin gyara barna da mayar da hakkin duk wanda aka zalunta, da komawa ga Allah da nadama na gaske.",
    ],
    quran: [
      {
        excerpt:
          "Kuma waɗanda ba su yi shaidar zur ba, kuma idan sun shuɗe munanan magana, sai su shuɗe suna masu mutunci.",
      },
      {
        excerpt: "Don haka ku nisanci kazantar gumaka, kuma ku nisanci zancen karya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Shin, ba zan ba ku labari mafi girman zunubai ba? Shirka da Allah, da sava wa iyaye - da yin shaidar zur, da shaidar zur.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "sihiri",
    summary: "Sihiri, neman masu sihiri, da ayyukan sihiri - kufr a manyan sifofi.",
    body: [
      "Ma'anar: Sihr (sihiri ko sihiri) shine amfani da hanyoyin da aka haramta - sau da yawa ya shafi dogara ga shaidanu ko da'awar ikon gaibi - don shafar mutane ko al'amura. Yin aiki da shi, koyan shi, nemansa daga wasu, da kuma gaskata waɗanda suke da'awar shi duka suna cikin wannan zunubi.",
      "Me ya sa ya zama kabari: mafi yawan sihr ba za a yi shi ba sai da ayyukan kafirci, kamar kusantar shaidanu ko wulakanta Alkur'ani, shi ya sa Alkur'ani ya danganta iliminsa da kafiri. Da yake magana game da sihirin da aka koya a zamanin Sulaiman, Allah ya ce shaidanu da mala'iku biyu sun koyar da shi kawai a matsayin gwaji, yana gargadin 'kada ku kafirta' (2:102). Bayan hatsarori na gaskiya, sihr yana cutar da mutane na gaske - shuka rarrabuwa tsakanin ma'aurata, yada tsoro, da cin gajiyar matsananciyar wahala.",
      "Abubuwan da ke da alaƙa: wannan gargaɗin ya kai ga yin duba, da ɗaukar falaki a matsayin wani ilimin gaibi, da layya da laya masu ɗauke da shirka. Da'awar ilimin boyayyen gaba na Allah ne Shi kadai, kuma komawa ga masu da'awar shi yana raunana tauhidi daga tushensa.",
      "Hanyar nisantarsa: ga wanda ya tsunduma cikin wadannan ayyuka, tuba yana nufin barinsu gaba daya, da ruguza duk wani abu da aka haramta, da yanke alaka da wadanda suke hulda da su, da sabunta tauhidi na gaskiya da tawakkali ga Allah Shi kadai. Ana samun kariya a cikin imani, da zakka, da neman tsari ga Allah, kuma gafararSa ta bayyana ga wanda ya komo da gaske.",
    ],
    quran: [
      {
        excerpt:
          "Suna bin abin da shaidanun suke karantawa a zamanin Sulemanu… kuma suna koyon abin da yake cutar da su kuma ba ya amfanar su.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Duk wanda ya je wajen boka, kuma ya yi imani da abin da ya fada, ya kafirta da abin da aka saukar wa Muhammadu.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Cin Dukiyar Marayu",
    summary: "Daukar ko barnatar da dukiyar marayu bisa zalunci.",
    body: [
      "Ma’ana: Wannan zunubin shi ne ƙwace, almubazzaranci, ko kuma yin amfani da dukiyar marayu ta hanyar da ba ta dace ba—’ya’yan da suka yi rashin uba kuma ba za su iya kare bukatun kansu ba. Majiɓinci yana riƙe dukiyarsu a matsayin amana (amanah), ba a matsayin mai shi ba.",
      "Dalilin da ya sa ya zama kabari: yana haɗuwa da laifuffuka biyu - cin amanar amana mai tsarki da zalunci mafi ƙarancin karewa. Siffar Alkur'ani mai tsanani ce: wadanda suke cin dukiyar marayu bisa zalunci 'suna cin wuta kawai a cikin cikunansu' (4:10), suna mai da wani lokaci na kwadayi zuwa azabar kai. Yin amfani da wanda ba shi da mai magana a kansu yana daga cikin mafi munin zalunci, shi ya sa gargaɗin ya yi kaifi sosai - kuma, da kaifi, mai jin ƙai wajen nisantar da waliyyai daga gare ta.",
      "Abin da ya haɗa da: ba kawai sata na zahiri ba, amma nau'ikan dabara - haɗa kayan marayu da nasa don ɓata layi, jinkirta dawo da ita da zarar maraya ya girma, ko saka hannun jari ko kashe ta ba tare da haƙƙi ba. Allah ya yi umurni da akasin haka: “Ku ba marayu dukiyoyinsu, kuma kada ku musanya mummuna da mai kyau” (4:2).",
      "Hanyar nisantar ta: Ku kiyayi dukiyar marayu da tsafta, ku kebe ta da hisabi, ku mika ta cikakkiya idan sun balaga, kuma – ga wanda ya gaza – ku tuba ta hanyar mayar da abin da ake bi bashi da wani kari da kuma neman gafarar wadanda aka zalunta. A rãnar da wani dũkiya kuma bã zã su sãmu ba, fãce madaidaicin zuciya.",
    ],
    quran: [
      {
        excerpt:
          "Waɗanda suke cin dũkiyar marãyu da zãlunci, wuta kawai suke ci a cikin cikkunansu.",
      },
      {
        excerpt:
          "Ku bai wa marayu dukiyoyinsu, kuma kada ku musanya mummuna da mai kyau, kuma kada ku ci dukiyoyinsu da dukiyoyinku.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Biyayyar Iyaye",
    summary: "Uquq - yana daga cikin manyan zunubai bayan shirka.",
    body: [
      "Ma’ana: “Uquq al-walidayn babban bijirewa ne da zaluntar iyaye – cutar da su, ko wulakanta su, ko sakar musu da buqata, ko raunata su ta hanyar magana ko aiki. Kishiyar bir al-walidayn ne, alherin da Musulunci ya yi umarni da shi.",
      "Me ya sa ya zama kabari: a cikin aya bayan aya Allah ya daidaita umarnin bauta masa da umarnin kyautatawa ga iyaye, kamar yadda yake cikin ‘Bautar Allah... kuma ga iyaye da kyautatawa’ (4:36) – yana sanya hakkinsu nan da nan bayan nasa. Iyaye bayan Allah su ne mafi kusancin tushen rayuwa da tarbiyyar mutum, don haka rashin godiya gare su wani nau'in butulci ne da ke zurfafawa. Manzon Allah SAW ya lissafta zaluncinsu a cikin manya manyan zunubai, na biyu sai shirka.",
      "Ma'auni mai mahimmanci: Taƙawa ba yana nufin yin biyayya ga iyaye a cikin saba wa Allah ba - babu wani halitta da ake biyayya da zunubi ga mahalicci. Amma ko da inda dole ne mutum ya ƙi, ana yin shi da tausasawa, girmamawa, da ci gaba da alheri. Kur'ani ya hana ko da mafi kankantar kalma na fushi: 'Kada ku ce musu uff' (17:23).",
      "Hanyar komawa: rahama a nan shi ne cewa iyaye yawanci har yanzu ba su isa ba. Ga wanda ya yi kasala, tuba tana da amfani sosai - sake dawowa da alheri, neman gafarar su, yi musu hidima, da yi musu addu'a, musamman ma suna raye. Kuma idan iyaye sun shude, aikin ibada yana ci gaba da yi musu addu'a, da yin sadaka a madadinsu, da girmama alakokinsu da abokansu.",
    ],
    quran: [
      {
        excerpt:
          "Ubangijinku Ya rubũta kada ku bauta wa kowa fãce Shi, kuma ga mahaifan mahaifa ku kyautata. Kada ku ce musu 'uff', kuma kada ku tunkuɗe su, kuma ku faɗa musu magana mai karimci.",
      },
      {
        excerpt: "Ku bauta wa Allah, kuma kada ku yi shirki da Shi, kuma ku kyautata wa mahaifa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Shin, ba zan ba ku labari mafi girman zunubai ba? Yin shirka da Allah, da sava wa iyaye.",
      },
    ],
    actions: ["Kira ko ziyarci iyaye a wannan makon tare da kalma mai kyau."],
    appLinks: [{}],
  },
  {
    title: "Sata",
    summary: "Dauke dukiyar wasu ba bisa ka'ida ba - ya saba wa amana kuma yana kiran hukunci.",
    body: [
      "Ma’ana: Sata (sariqah) ita ce karvar dukiya ko dukiyoyin wasu ba tare da hakki ba – walau ta hanyar sata, ko almubazzaranci, zamba, ko wani abin da mutum ba shi da da’awa a boye.",
      "Me ya sa ya zama kabari: yana keta haƙƙin mutane da kuma amanar da rayuwar al'umma ta dogara a kai. Muhimmancinsa yana nuni da hukuncin da Kur'ani ya ambata game da shari'o'in da suka cancanta (5:38) - hukuncin da ke tattare da tsauraran sharudda da ma'auni masu yawa, ta yadda tsananinsa ya kasance babban abin hanawa da ke kiyaye dukiyar mutane. Manufar Musulunci ita ce al'ummar da mutane za su ji aminta da dukiyoyinsu.",
      "Fuskokinsa na zamani: sata ba ta iyakance ga shiga gida ba. Ya haɗa da karban ma’aikata, yin ha’inci a kasuwanci, hana albashin ma’aikata, satar fasaha ta zamani, sata, da cin gajiyar abin da ba nasa ba. Abin da yake boye ga sauran mutane bai taba boyewa ga Allah ba, wanda yake ganin duk wani abin da yake boye.",
      "Hanyar komawa: saboda hakkin dan Adam ya shiga, tuba yana bukatar fiye da nadama a wurin Allah. Dole ne mutum ya mayar da abin da aka sace da kansa, ko kimarsa, ga mai shi, sannan a nemi afuwarsu a inda ya yiwu; idan ba a samu mai shi ba, malamai suna ba da shawarar bayar da adadin sadaka a madadinsu. Korar da aka yi ta wannan hanya, hatta sata ana gafartawa Mai son bawa mai dawowa.",
    ],
    quran: [
      {
        excerpt:
          "To, amma ɓarawo, namiji da mace, sai suka yanke hannãyensu, sabõda sakamakon abin da suka kasance sunã aikatãwa, a kan hani daga Allah.",
      },
    ],
    actions: ["Koma kayan da aka sace ko kimarsu; ku nemi gafara daga wadanda aka zalunta."],
    appLinks: [{}],
  },
  {
    title: "Abubuwan sa maye",
    summary: "Giya da abubuwan sa maye - an hana su ci gaba da yanke hukunci a cikin Kur'ani.",
    body: [
      "Ma'anarsa: Khamr duk wani abu ne da yake sa hankali da gizagizai - giya da dukkan giya, kuma da ka'idar Annabi SAW, kowane abu mai sa maye ko wane iri ne ko sunansa. 'Duk wani abu mai sa maye khamr ne, kuma kowane khamr haramun ne.",
      "Me ya sa ya zama kabari: Hankali shi ne ikon da mutum ya san Allah da shi, yana sanin abin da yake daidai da marar kyau, kuma ya kiyaye kowane nauyi. Abin sa maye yana wargaza daidai wannan, wanda shine dalilin da ya sa Kur'ani ya jingina su da gumaka da caca a matsayin 'ƙazanta daga aikin Shaiɗan' kuma ya ba da umarni, 'ku guje su' (5:90). Bayan mutum ɗaya, suna lalata lafiya, iyalai, da aminci, kuma suna buɗe ƙofar zunubai mai hankali ba zai taɓa kusantarsa ​​ba.",
      "Hikimar yadda aka haramta ta: Allah bai hana khamr bugun jini ba sai dai ya haramta shi daki-daki, yana yaye al'ummar farko daga dabi'a mai tushe a hankali. Wancan sannu a hankali darasi ne na jinƙai - kuma abin koyi ne na bege ga duk wanda ke fafutukar barinsa a yau.",
      "Hanyar dawowa, tare da tausayi: waɗanda aka kama a cikin jaraba ba za a raina ba amma a tallafa musu. Tuba yana nufin yanke shawara ga barin abu, da kawar da shi da abubuwan da ke haifar da shi daga rayuwar mutum, da neman taimako da magani ba tare da kunya ba, da cike gurbi da shirka na gari da zikiri da ibada. Ƙofar Allah a buɗe take, kuma duk wani mataki na gaskiya daga abin sa maye, mataki ne da Ya ke maraba da shi.",
    ],
    quran: [
      {
        excerpt:
          "Yã ku waɗanda suka yi ĩmãni, lalle giya, da cãca, da gumaka, da kiban duba, ƙazanta ne daga aikin Shaiɗan, ku nisance su.",
      },
    ],
    hadith: [
      {
        excerpt: "Duk abin sa maye khamr ne, kuma duk wani khamr haramun ne.",
      },
    ],
    actions: ["Nemi taimako idan an buƙata; maye gurbin al'ada da zikiri da kyakkyawan kamfani."],
    appLinks: [{}],
  },
];

export const JAHANNAM_NAMES_HA: DeepPartial<JahannamNameEntry>[] = [
  {
    name: "Jahannama",
    meaning: "Wuta — sunan Jahannama mafi yawan Alƙur'ani.",
    quran: {
      excerpt:
        "Ku ji tsoron wuta wadda makamashinta mutane ne da duwatsu, an yi tattalinta domin kafirai.",
    },
    context:
      "An yi amfani da shi a ko'ina cikin Kur'ani a matsayin gidan azaba ga waɗanda suka kafirta kuma suka ci gaba da yin zalunci.",
    tafsirNote:
      "Ibn Kathir ya lura Jahannam shine cikakken sunan wuta da aka shirya don gargaɗi da sakamako.",
    scholarlyNote:
      "Wasu malamai suna magana akan ko Jahannama ita ce jahannama gaba ɗaya ko wani takamaiman matakin - ra'ayoyi sun bambanta.",
  },
  {
    name: "Jaheem",
    meaning: "Wuta mai zafi - mai tsanani, zafi mai zafi.",
    quran: {
      excerpt: "Ku da abin da kuke bautãwa, baicin Allah, makãmashin Jahannama ne, zã ku shige ta.",
    },
    context: "Ya bayyana tsananin wutar da ke jiran waɗanda suka riki kishiyoyi a wurin Allah.",
    tafsirNote: "Al-Tabari ya danganta jaheem da hura wutar da ba ta bar komai ba.",
  },
  {
    name: "Saqar",
    meaning: "Abin da ke ƙonewa ko barin kome - zafi mai tsanani.",
    quran: {
      excerpt: "Zan kore shi cikin Saqar. Kuma me zai sanar da kai menene Saqar?",
    },
    context: "An ambata a cikin suratu al-Muddaththir dangane da wanda ya bijire wa wahayi.",
    tafsirNote:
      "Tafsirin gargajiya ya siffanta Saqar a matsayin matakin Jahannama mai tsananin zafi; cikakkun bayanai sun bambanta tsakanin malamai.",
    scholarlyNote:
      "Ko Saqar wani matsayi ne na musamman ko suna ga Jahannama gabaɗaya an tattauna shi a cikin tafsiri - ba a bayyane a cikin rubutu ɗaya da aka yarda da shi ba.",
  },
  {
    name: "Sa'ir",
    meaning: "Wuta mai walƙiya.",
    quran: {
      excerpt: "Sunã a cikin Sa'ir, Jahĩm.",
    },
    context: "Gargadi ga masu cin dukiyar marayu da zalunci.",
    tafsirNote: "Tushen yana isar da ƙonawa da hurawa - yana jaddada aiki, yana cinye wuta.",
  },
  {
    name: "Hutamah",
    meaning: "The Crusher - abin da ya karye da murkushe.",
    quran: {
      excerpt: "Za a jefa shi cikin al-Hutamah. Kuma me zai sanar da kai menene al-Hutamah?",
    },
    context: "Hukunci ga wanda ya yi gulma da tara dukiya, yana tunanin hakan zai sa shi dauwama.",
    tafsirNote:
      "Ibn Kathir ya bayyana Hutamah tana murkushewa kuma tana cinyewa - wutar da Allah ya kunna.",
  },
  {
    name: "Hawayyah",
    meaning: "A abyss ko rami - zurfin fall.",
    quran: {
      excerpt: "Amma wanda ma'auninsa suka yi sauƙi, to, makomarsa ita ce Hawiyah.",
    },
    context: "Makomarsu ga wadanda ayyukansu suka yi sauki a ranar sakamako.",
    tafsirNote:
      "An siffanta shi da rami mai zurfi a cikin Wuta; al-Tabari ya rubuta ra'ayoyi kan zurfinsa da tsananinsa.",
    scholarlyNote:
      "Wasu ayyukan tafsiri suna lissafta Hawiyah a matsayin takamaiman matakin - a kawo matsayin tafsirin malamai.",
  },
  {
    name: "Laza",
    meaning: "harshen wuta - wuta mai zafi.",
    quran: {
      excerpt: "A’a! Wutar Allah ce mai hurawa.",
    },
    context: "Surah al-Ma'arij - gargadi ga waɗanda suke ƙaryatãwa game da Sa'a.",
    tafsirNote:
      "An haɗa shi da harshen wuta wanda ke kaɗewa yana konewa - Lazaa yana jaddada hurawa mai ƙarfi.",
  },
];

export const JAHANNAM_GATES_HA: DeepPartial<JahannamGateEntry>[] = [
  {
    quranNote:
      "Allah ya ce wuta tana da kofofi bakwai; kowace kofa tana da rabo daga masu shiga (15:44).",
    scholarlyNote:
      "Wasu tafsirin daga baya suna haɗa ƙofofin da nau'ikan masu zunubi. Waɗannan ayyukan ba iri ɗaya ba ne a tushen farko - suna nan azaman fassarar.",
  },
  {
    quranNote:
      "Alkur'ani ya tabbatar da kofofi bakwai a dunkule; ba ya sunan kowace kofa a bayyane.",
    scholarlyNote: "Ibn Kathir ya tattauna cewa rabon da hikimar Allah ne da adalcinsa.",
  },
  {
    quranNote:
      "Ƙofofin bakwai - tabbataccen gaskiyar rubutu. Cikakkun bayanai na mazauna kofa galibi tattaunawa ce ta ilimi.",
  },
  {
    quranNote: "Ayar ta nanata daidaitattun ayyuka - kowace kofa tana da rabon da aka keɓe.",
  },
  {
    quranNote:
      "An gargadi muminai don su nisanci abin da ke kaiwa ga wadannan kofofin ta hanyar tuba.",
  },
  {
    quranNote:
      "Jahannama an shirya - gargaɗin gaskiya ne. Kariya ta hanyar imani ne da ayyuka na qwarai.",
  },
  {
    quranNote:
      "Ƙofofi bakwai, Wuta ɗaya - haɗin kai na gargaɗi tare da bambancin yadda ake tara masu zunubi da hikimar Allah.",
    scholarlyNote:
      "A guji koyar da takamaiman taswirar zunubi-zuwa-ƙofa a matsayin gaskiyar annabci sai dai in faɗi wani aikin bincike mai suna.",
  },
];

export const JAHANNAM_VERSES_HA: DeepPartial<JahannamVerseEntry>[] = [
  {
    excerpt: "Ku ji tsoron wutar da aka yi tattalinta domin kafirai.",
    context: "Bayar da magana ga masu bi - tsoro a matsayin dalili zuwa ga biyayya.",
    tafsirSummary: "Ibn Kathir: kira zuwa ga takawa hade da biyayya ga Manzo.",
  },
  {
    excerpt: "Kada ku yanke kauna daga rahamar Allah. Lallai Allah yana gafarta zunubai baki daya.",
    context: "An bayyana don ta'azantar da waɗanda suke tsoron zunubansu sun yi yawa.",
    tafsirSummary: "Ayar ginshiƙin bege, jinƙai yana da yawa ga waɗanda suka juya baya.",
  },
  {
    excerpt:
      "Ku tuba zuwa ga Allah da tũba na gaskiya, akwai tsammãnin Ubangijinku Ya kankare muku ayyukanku.",
    context: "Umurni ga muminai bayan shiriya kan iyali da halaye.",
    tafsirSummary: "Nasuh tawbah - tuba na gaskiya ba tare da komawa ga zunubi ba.",
  },
  {
    excerpt: "Domin duk za a sami digiri gwargwadon abin da suka yi.",
    context: "Adalcin Allah - lada da azaba gwargwadon ayyuka.",
    tafsirSummary: "Digiri ya shafi Aljanna da Wuta.",
  },
  {
    excerpt: "Kuma Allah bã Ya zãluntar mutãne da kõme, amma mutãne suna zãlunta kansu.",
    context: "Tabbatar da cewa hukuncin Allah daidai ne.",
  },
  {
    excerpt:
      "Ya Ubangijinmu Ka bamu abu mai kyau a cikin talikai biyu, kuma Ka kare mu daga azabar wuta.",
    context: "Addu'ar wadanda suka hada na duniya da lahira.",
    tafsirSummary: "Addu'ar annabci da aka koyar a cikin Kur'ani - ma'auni na duniya da akhirah.",
  },
  {
    excerpt: "Jahannama tana da kofofi bakwai; Domin kowace kofa tana da rabo da aka ba ta.",
    context: "An gabatar da shi a cikin mahallin muhawarar Ibrahim da mutanensa.",
    tafsirSummary: "Bayyanar ƙofofin bakwai - cikakkun bayanai na aiki hikima ce ta Allah.",
  },
  {
    excerpt:
      "Fãce waɗanda suka tũba, kuma suka yi ĩmãni, kuma suka aikata ayyukan ƙwarai, Allah zai musanya mummuna da alhẽri.",
    context: "Banda bayan lissafta manyan zunubai.",
    tafsirSummary: "Fata ga masu tuba - ayyuka na iya canzawa ta wurin jinƙai.",
  },
  {
    excerpt: "Kuma waɗanda suka kãfirta da Ubangijinsu, sunã da azãbar Jahannama, tir da makoma.",
    context: "Suratul Mulk — tunatarwa ga gaibi.",
  },
  {
    excerpt: "Lallai aikin kwarai yana kawar da munanan ayyuka.",
    context: "Umurni da tsai da sallah a karshen yini biyu.",
    tafsirSummary: "Ƙarfafawa cewa tsayayyen ibada yana goge zamewar da ta gabata.",
  },
  {
    excerpt: "Ubangijinmu Ka gafarta mana zunubanmu, kuma Ka tsare mu daga azabar wuta.",
    context: "Bayanin muttaqin (mai tsoron Allah).",
  },
  {
    excerpt: "Amma wanda ma'auninsa suka yi sauƙi, to, makomarsa ita ce Hawiyah.",
    context: "Surah al-Qari'ah - ma'aunin ayyuka.",
  },
];

export const JAHANNAM_HADITH_HA: DeepPartial<JahannamHadithEntry>[] = [
  {
    hadith: {
      excerpt:
        "Duk wanda ya roki Allah Aljannah sau uku, Aljannah ta ce: Ya Allah ka shigar da shi Aljannah. Wanda ya nemi tsari daga wuta sau uku, wuta ta ce: Ya Allah ka kare shi daga wuta.",
    },
    context: "Ƙarfafa yin addu'a ga Jannah da fakewa daga Jahannama.",
  },
  {
    hadith: {
      excerpt:
        "Kuma Allah Ya fi yarda da tuban bawanSa fiye da wanda ya iske dutsen da ya bata a cikin kasa bakarara.",
    },
  },
  {
    hadith: {
      excerpt:
        "Babu dayanku da zai shiga Aljanna da aikinsa shi kadai, ko da ni, face Allah Ya lullube ni da rahamarSa.",
    },
    context: "Ma'auni: yi ƙoƙari a cikin ayyuka amma dogara ga rahama.",
  },
  {
    hadith: {
      excerpt:
        "Wutar ku daya ce daga cikin kashi saba'in na wutar Jahannama, kowane bangare kamar zafinta ne.",
    },
  },
  {
    hadith: {
      excerpt: "Alkawari tsakaninmu da su shine addu'a; wanda ya bar ta ya yi kafirci.",
    },
    context: "Tsananin sakaci da sallah - yana cikin gargaxi mafi girma.",
  },
  {
    hadith: {
      excerpt:
        "Mai ɓarna yana zuwa da addu'a, azumi, da sadaka - amma ya zagi, ya zage shi, ya cinye dukiya ba bisa ƙa'ida ba, ya zubar da jini.",
    },
    context: "Ana iya warware haƙƙoƙin mutane kafin ayyuka a Ranar Shari'a.",
  },
  {
    hadith: {
      excerpt:
        "Allah yana mika hannunsa da dare domin karbar tuban mai zunubin yini, kuma yana mika hannunsa da rana domin karbar tuban mai zunubin dare.",
    },
  },
  {
    hadith: {
      excerpt: "Wanda ya yi imani da Allah da Ranar Lahira, to ya fadi alheri ko ya yi shiru.",
    },
    context: "Kare harshe - lissafin yau da kullum.",
  },
];

export const JAHANNAM_REFLECTIONS_HA: DeepPartial<JahannamReflectionEntry>[] = [
  {
    question: "Shin na zalunci kowa a yau - a magana, aiki, ko sakaci?",
  },
  {
    question: "A yau na nemi gafarar Allah - da gaske kuma akai-akai?",
  },
  {
    question: "Na kiyaye harshena daga gulma, ƙarya, da izgili?",
  },
  {
    question: "Na yi addu'a a kan lokaci kuma tare da halarta?",
  },
  {
    question: "Na dauki matakin sulhu da wanda na rabu?",
  },
  {
    question: "Shin na yi sadaka ko alheri a yau - ko da wani abu karami?",
  },
  {
    question: "Yau na karanta ko na saurari Alkur'ani?",
  },
];

export const JAHANNAM_REFERENCES_HA: DeepPartial<JahannamReferenceEntry>[] = [
  {
    title: "Alqur'ani",
    note: "Tushen asali na sunaye, gargaɗi, rahama, da tuba. Fassarorin sun bambanta; tuntubi Larabci don daidaito.",
  },
  {
    title: "Sahihul Bukhari & Sahih Musulmi",
    note: "Tarin hadisan canonical da aka kawo a cikin wannan rukunin inda aka sami sahih.",
  },
  {
    title: "Tafsir Ibn Kathir",
    note: "An koma ga mahallin sunayen Jahannama da manyan ayoyin gargaɗi - fassarar malamai.",
  },
  {
    title: "Tafsirin Tabari",
    note: "Cikakken tafsiri na farko - mai amfani don fahimtar ra'ayoyin gargajiya akan Jahannam.",
  },
  {
    title: "Inda malamai suka bambanta",
    note: "Matsakaicin matakan Jahannama, ayyukan kofa, da wasu ma'anoni suna magana a tsakanin malamai - ba koyaushe ba a bayyane a cikin wahayi.",
  },
];

export const JAHANNAM_DUAS_HA: DeepPartial<JahannamDuaEntry>[] = [
  {
    context: "Ka nemi alheri a cikin talikai biyu da kariya daga wuta - Addu'ar Alkur'ani.",
  },
  {
    context: "Bayan tashahud: ku nemi Aljannah da tsari daga Wuta.",
  },
  {
    context: "Zikirin safiya: tsari daga azabar kabari da wuta.",
  },
];

export const JAHANNAM_REFUGE_DUA_HA: { translation: string } = {
  translation:
    "Ya Allah ina neman tsarinka daga azabar wuta, da azabar kabari, da fitintinu na rayuwa da mutuwa, da mugunyar fitinar Al-Masihu Qarya.",
};
