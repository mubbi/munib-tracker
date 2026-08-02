// Hausa translation overlay for the Learn "The Last Day" content. Mirrors the order of
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

export const LAST_DAY_TOPICS_HA: DeepPartial<LastDayTopic>[] = [
  {
    title: "Gabatarwa",
    summary: "Menene Ranar Ƙarshe, kuma me ya sa ta canja yadda muke rayuwa a yau?",
    body: [
      "Yawm al-Qiyamah -Ranar Tsayuwa da Alqiyamah - ita ce ranar da kowane rai yake komawa zuwa ga Allah domin a nuna masa ayyukansa, kuma aka ba shi masaukinsa na karshe. Ba labari mai nisa ba ne ko hoton waka. Kur'ani ya ambace shi a kusan kowane shafi, kuma farkon surorin Makkah sun mamaye shi ne dai dai domin imani da shi yana sake tsara rayuwar mutum gaba daya. Lokacin da kuke fatan tsayawa a gaban Allah da gaske, gaskiya, addu'a, kyautatawa da kamun kai ku daina zama kayan ado na zaɓin zaɓi kuma ku zama abin da kuke so.",
      "Wannan manhaja tana tafiya ne bisa mataki: mutuwa da tafiyar rai, da tazarar barzak a cikin kabari, da qanana da manya-manyan alamomin da suke gabanin Sa'a, da busa ƙaho, da tayar da jikkuna, da taro a fili mai faffafi, da fitar da littattafai, da sikeli, da hisabi, koffin Annabi, da ceton gida biyu, da ceton Aljannah biyu, daga qarshe, da gadar Aljannah, da ceto biyu. Jahannama. Kowanne mataki an ciro shi ne daga Alkur’ani da ingantaccen hadisi.",
      "Ka'idoji biyu ne ke sarrafa komai a nan. Na farko, haqiqanin waxannan al’amura tabbatacce ne kuma lamari ne na aqida (aqida); inkarin tashin kiyama ko hisabi shine karyata addinin da kansa. Na biyu, Allah ne kadai ya san lokacin tashin Alkiyama – babu wani malami, kalanda ko lissafi da zai iya hasashenta, kuma duk wani da’awar kwanan wata karya ce. Annabi SAW bai tava yi wa sahabbansa kidaya ba; Ya ba su hanyar rayuwa. Don haka manufar yin nazarin Ranar Ƙarshe shi ne shiri, ba tsinkaya ba: don tausasa zuciya, daidaita abubuwan da suka fi muhimmanci, da tsere zuwa ga alheri kafin lokacin da aka ƙayyade ya isa.",
      "Bayanan kula akan tushe: shahararrun 'alamomin ƙarshen zamani' jawabai cike suke da rauni har ma da ƙirƙira ruwayoyi. Wannan manhajja ta kunshi abin da yake ingantacce ne kawai, kuma inda malaman Sunna na kwarai suka yi sabani na gaske - alal misali a kan jerin wasu manyan alamomi - ana gabatar da sabanin ne a matsayin wani bambanci, ba wai an sassauto ko wuce gona da iri ba.",
    ],
    quran: [
      {
        excerpt:
          'Idan aka girgiza ƙasa da girgizar ƙasa ta ƙarshe, kuma ta fitar da kayanta na nauyi, kuma mutum ya yi kuka: "Mẽne ne a wurinta?" — A rãnar nan, zã ta bãyar da lãbãranta, sabõda abin da Ubangijinka Ya yi wahayi zuwa gare shi. Kuma a rãnar nan mutãne zã su fita dabam-dabam, dõmin a nũna musu ayyukansu. To, wanda ya aikata gwargwadon nauyin zarra na alheri, zai gan shi, kuma wanda ya aikata nauyin zarra na sharri, zai gan shi.',
      },
      {
        excerpt:
          "Yanã yin wahayi zuwa ga umurninSa a kan wanda Yake so daga cikin bãyinSa, dõmin ya yi gargaɗi ga Rãnar Haɗu da su, a rãnar da suke bayyanawa, bãbu wani bõye a gare su daga Allah. Mulki na wane ne a yau? Zuwa ga Allah Makaɗaici, Mai rinjaya.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Don me kuke yin imani da ranar lahira?",
    summary: "Ɗaya daga cikin batutuwa shida na bangaskiya - ƙarfafawa, bege, da adalci na ƙarshe.",
    body: [
      "Imani da ranar lahira na daga cikin abubuwa shida na Imani da Manzon Allah (SAW) ya ambata a lokacin da Mala’ika Jibrilu ya zo yana karantar da addini: Imani da Allah, da Mala’ikunSa, da LittattafanSa, da ManzanninSa, da Ranar Lahira, da kaddarawar Ubangiji, alherinta da cutarwarsa (Sahihu Musulmi 8). Idan ba tare da wannan imani ba gaba daya tsarin hisabi ya ruguje - domin idan ba a koma ga Allah ba, to azzalumi da waliyyai sun kare, kuma kowace ibada ta zama dabi'a wacce ba ta da wata ma'ana ta karshe.",
      "Alkur'ani ya yi jayayya game da ranar lahira a bisa dabi'a da hankali. A dabi’ance: shi ne amsar zalunci, domin duniyar da azzalumai ke mutuwa cikin jin dadi a kan shimfidarsu, wadanda ake zalunta su mutu ba tare da daukar fansa ba, ba za ta iya zama karshen labarin ba idan Allah Ya yi adalci. A hankalce: Wanda ya halicce ku daga komai a karo na farko, ba zai iya sake dawo da ku a karo na biyu ba (Alkurani 36:78-79). Tashin matattu ya fi sauƙi, ba wuya ba, fiye da ainihin halitta.",
      "Wannan imani kuma yana ladabtar da injunan zuciya guda biyu - tsoro da bege - kuma yana kiyaye su cikin daidaito. Gargadi na gaskiya ne, don haka mumini ba ya yin girman kai ko gafala; amma duk da haka rahamar Allah mai girma ce kuma kofar tuba a bude take har mutuwa, don haka mumini ba ya yanke kauna. Zuciyar da ke rayuwa tsakanin tsoro da bege ita ce zuciyar da ta ci gaba da gwagwarmaya ba tare da karaya ba.",
      "Haƙiƙa, ranar ƙarshe tana ba wa marasa ƙarfi girma kuma tana kame maƙarƙashiya. Tana gaya wa wanda aka zalunta cewa, ba wani rauni da Allah ya manta da shi, kuma yana gaya wa masu qarfi cewa babu wani dukiya ko matsayi ko tasiri da zai yi garkuwa da su wajen hisabi. Don haka imani da shi ba jin dadi ba ne na sirri amma tushen adalci, hakuri da rikon amana a wannan duniya.",
    ],
    quran: [
      {
        excerpt:
          "Kuma adalci bai zama ku juyar da fuskõkinku ba wajen gabas ko yamma, kuma salihai shi ne wanda ya yi imani da Allah da Ranar Lahira da Mala'iku da Littafi da Annabawa, kuma ya ciyar da dukiya, ga dangi da marayu da miskinai da matafiyi da masu tambaya.",
      },
      {
        excerpt:
          "Kada ka yi zaton cewa Allah bai zama Mai gafala daga abin da azzalumai suke aikatãwa ba. Abin sani kawai Yanã jinkirtar da su zuwa ga wani yini da idãnu zã su yi firgita.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Imani shine ka yi imani da Allah, da Mala'ikunSa, da LittattafanSa, da ManzanninSa, da Ranar Lahira, kuma ka yi imani da kaddara ta Ubangiji, da alherinta da cutarwarsa. - daga hadisin Jibrilu, lokacin da ya zo karantar da addini.",
      },
    ],
    actions: [
      "Ka sabunta niyya a kowace rana: ayyukana na Allah ne kuma na ranar da zan hadu da Shi.",
      "Sa'ad da zalunci ya shafe ku, kuma babu wata kotu ta duniya da za ta amsa, to, ku ba da shi ga Kotun Ranar Lahira.",
      "Tsaya tsoro da bege tare - kada tsoro ya murkushe ku cikin yanke ƙauna ko bege ya sa ku zama sakaci.",
    ],
    appLinks: [{}],
  },
  {
    title: "Mutuwa",
    summary: "Kowane rai zai dandana mutuwa - husn al-khatimah da abin da ya amfanar da mamaci.",
    body: [
      "Mutuwa ita ce alƙawarin da babu wanda ya ɓace. Alkur'ani ya bayyana shi karara cewa: Kowane rai zai dandana mutuwa, kuma ba a samun cikakken sakamako sai ranar kiyama (k:3:185). Mutuwa ba halaka ba ce amma canja wuri - rai yana barin jiki kuma ya matsa zuwa mataki na gaba na tafiyarsa. Mala'ikan Mutuwa, wanda Allah ya ba wa amana, yana ɗaukar rai, sa'an nan kuma zuwa ga Ubangijinku ake mayar da ku (Alkur'ani 32:11).",
      "Saboda yanayin mutuwa ya shafi mumini yana aiki zuwa ga kyakkyawan karshe - husn al-khatimah - ta hanyar tuba ta gaskiya, da tsayuwar addu'a, da kyawawan halaye, da fatan mutuwa a cikin halin da Allah Ya yarda da shi. Mummunan ƙarshe - su'ul-khatimah - ana tsoron wanda ya dage da zunubi kuma ya juya baya ba tare da ya tuba ba. Amma duk da haka rahamar da ke cikin wannan tana da girma: kofar tawbah tana nan a bude har sai kurwar mutuwa ta isa makogwaro, don haka babu wanda ya isa ya yanke cewa ya makara yayin da numfashi ya ragu.",
      "Manzon Allah ﷺ ya koyar da yawaita ambaton mutuwa – ‘Ku yawaita tuna mai halaka jin daɗi,’ ma’ana mutuwa (Jami’ at-Tirmidhi 2307, hasan) – ba don ya sa mu ɓata lokaci ba, amma don a farke. Tunawa da mutuwa yana rage kamun wannan duniyar, yana warware bacin rai, kuma yana sake tsara abin da ke da mahimmanci. Cikakkun bayanai na tafiyar rai wanda ya bayyana kawai a cikin rahotanni masu rauni sun fi kyau a bar su; ingantaccen abu ya isa ya sanya tsoro da shiri.",
      "Mutuwa kuma tana rufe lissafin ayyuka - tare da keɓance guda uku. Annabi SAW ya ce idan mutum ya mutu ayyukansa suna yanke sai guda uku: sadaka mai gudana (sadaqah jariyah), ilimin da yake ci gaba da amfana da shi, da salihai da ya yi masa addu’a (Sahih Musulmi 1631). Wannan yana da amfani sosai: yana nufin cewa abin da kuke ginawa, koyarwa, da kuma reno yayin da kuke raye zai iya ci gaba da samun riba a gare ku da daɗewa bayan kun tafi.",
    ],
    quran: [
      {
        excerpt:
          "Kõwane rai mai ɗanɗanar mutuwa ne, kuma bã zã a cika ku ba fãce dãɗinku a Rãnar ¡iyãma. To, wanda aka nisantar daga wuta, kuma aka shigar da shi Aljanna, ya rabauta. Kuma rãyuwar dũniya ita ce jin dãɗin rũɗi kawai.",
      },
      {
        excerpt:
          "Ka ce: “Mala’ikan Mutuwa, wanda aka ba ku amana, zai karɓe ku. To, zuwa ga Ubangijinku ake mayar da ku.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Idan mutum ya mutu ayyukansa sun kare sai guda uku: Sadaka mai gudana, ko ilimin da ake samun riba daga gare shi, ko dan salihai ya roke shi.",
      },
      {
        excerpt: "Ka tuna sau da yawa mai lalata jin dadi - ma'anar mutuwa.",
      },
    ],
    actions: [
      "Ƙara yawan istighfar da addu'a akan lokaci-musamman yayin da kuke cikin koshin lafiya da aiki, ba lokacin rashin lafiya kaɗai ba.",
      "Ku tuba yau ga wani takamaiman abin da kuke jinkirtawa; kar a yi caca gobe.",
      "Zuba jari a ayyuka guda uku masu wanzuwa: Gina sadaka mai gudana, da yada ilimi mai fa'ida, da renon yara akan tauhidi da kyawawan halaye.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Barzakh (rayuwa a cikin kabari)",
    summary: "Tazara bayan mutuwa har zuwa tashin matattu - tambaya da sakamakonta.",
    body: [
      "Barzakh yana nufin shamaki, kuma shine sunan dukkan tazara tsakanin mutuwar mutum da ranar kiyama. Kur'ani ya yi amfani da kalmar a lokacin da matattu azzalumi ya roki a mayar da shi cewa: \"A bayansu akwai wani shamaki (barzakh) har zuwa ranar da za a tayar da su\" (Alkur'ani 23:100) - Katanga mai kauri wanda babu komowa a cikinsa. Ko an binne gawa, ko kone, ko a nutse ko aka rasa, rai ya shiga barzak; kabari kawai shine mafi yawan sifarsa, kuma matakin farko na Lahira ga kowane dan Adam.",
      "Ingantattun rahotanni sun bayyana tambaya bayan binnewa. Mala'iku biyu ne suka zo suka yi wa mamacin tambayoyi uku: Wanene Ubangijinka? Menene addininku? Wanene wannan mutumin da aka aiko muku? Muminin da Allah ya tabbatar da shi ya ce: Ubangijina ne Allah, addinina shi ne Musulunci, kuma wannan shi ne Muhammadu SAW; sai a fadada kabari a kunna masa wuta. Sai wanda ya gafala ya ce: “A’a, ban sani ba, sai ya gamu da takura (Jami’ at-Tirmizi 1071, hasan, inda ake kiran Mala’iku biyu Munkar da Nakir). Don haka ne Kur’ani ya yabi Allah da ya tabbatar da muminai ‘da tabbataccen magana a cikin rayuwar duniya da lahira’ (Qur’ani 14:27).",
      "Sai ni'ima ko azaba ta biyo baya a cikin kabari, a cikin ingantattun nassoshi: 'Kabari ko dai lambu ne daga gidajen Aljannah ko kuma rami daga ramukan wuta' (Jami' at-Tirmidhi 2460, hasan sahihi). Kur'ani ya yi ishara da irin azabar da mutanen Fir'auna za su fuskanta a cikin wuta 'safe da maraice' kafin Sa'a ta zo (Alkur'ani 40:46). Ahlus Sunna suna tabbatar da haqiqanin lada da azaba mai tsanani tare da barin ainihin yanayinsa ga Allah, tunda ga gaibi ne, ba a iya riskarsa a wurin rayayye.",
      "An yi ittifaqi a kan cewa tambayar kabari da ni'imar kabari ko azabar kabari gaskiya ne; malamai sun tattauna batutuwa masu kyau—kamar ko ya taɓa jiki, rai, ko duka biyun, da kuma yadda ya kai waɗanda ba su da kabari na yau da kullun—ba tare da barin waɗannan tambayoyin su janye hankalinsu daga batun ba. Barzakh shi ne babban mai kwadaitarwa: yana mai da kabari daga ramin kasa ya zama madubin ayyukansa, kuma yana bayyana cewa abin da ka aika gaba shi ne zai gaishe ka a can.",
    ],
    quran: [
      {
        excerpt:
          "Har idan mutuwa ta je wa ɗayansu, sai ya ce: “Ya Ubangijĩna! A'a! Kalma ce kawai yake cewa; Kuma a bãyansu akwai wani shãmaki har rãnar da ake tãyar da su.",
      },
      {
        excerpt:
          "Wuta ana gitta su a kanta sãfe da maraice. Kuma a rãnar da Sa'a ta bayyana a ce: \"Ku shigar da mutãnen Fir'auna a cikin mafi tsananin azãba.\"",
      },
    ],
    hadith: [
      {
        excerpt: "Kabari ko dai lambu ne daga gidajen Aljannah ko rami daga ramukan wuta.",
      },
      {
        excerpt:
          "Lokacin da aka binne mamacin sai mala'iku biyu suka zo masa suka tambaye shi: Wanene Ubangijinka? Menene addininku? Wanene annabinka? Mumini ya amsa da yak’i sannan aka shimfida masa kabarinsa aka haska masa.",
      },
    ],
    misconceptions: [
      "Kuskure: Hukunci kabari imani ne na jama'a ba tare da tushe ba. GYARA: Hakikanin tambaya da ni'ima ko azaba ya tabbata a cikin ingantaccen hadisi kuma ya yi ishara da shi a cikin Alkur'ani; wuri ne tabbatattu na aqidar Sunna.",
      "Rashin fahimta: Ya kamata mu yi jayayya a kan ainihin kamanni da sunayen mala’iku. Gyara: Sunan Munkar da Nakir ya zo a cikin rahoton hasan; ainihin imani shine tambayar kanta. Shirye-shiryen amsa shi da gaske yana da muhimmanci fiye da yin muhawara da cikakken bayani.",
    ],
    actions: [
      "Ka yi riko da tauhidi da Sunnah a yanzu – ba a haddace amsar kabari a nan, a nan ne.",
      "Ka kiyaye azkar na safe da maraice, wadda Manzon Allah SAW ya koyar a matsayin kariya da tsayin daka.",
    ],
    appLinks: [{}],
  },
  {
    title: "Alamomin Ranar Lahira",
    summary: "Ƙananan alamomi da manyan alamomi - tabbacin Sa'a, lokacin da ba a sani ba.",
    body: [
      "Zuwan Sa'a tabbatacce ne, amma lokacinta wani sirri ne da Allah Ya rufawa kansa. Da ma an tambayi Annabi SAW yaushe zai zo, amsar da aka bayar ita ce, wanda aka tambaya bai sani ba face wanda ya tambaya – iliminsa yana wurin Allah Shi kadai (Alkur’ani 7:187). Don haka abu na farko da za mu daidaita kafin yin nazarin kowace ‘alama’ ita ce: an ba da alamun da za su shirya mu, kada mu ƙyale mu kirga kwanan wata. Duk wanda ya ambaci shekara domin Sa’a ya saba wa Alkur’ani.",
      "Malamai sun haɗa alamomin zuwa nau'i biyu. Ƙananan alamomi (al-'alamat al-sughra) canje-canje ne na zamantakewa, ɗabi'a da na duniya a hankali waɗanda suke tasowa a cikin shekaru masu tsawo kafin ƙarshe. Manyan alamomi (al-'alamat al-kubra) tari ne na ban mamaki, abubuwan da ba za a iya fahimta ba wadanda suka zo kusa da karshe. Kur'ani ya lura cewa 'wasu daga cikin alamominsa sun riga sun zo' (Alkur'ani 47:18) - abin da aka fahimta ya hada da zuwan Annabi SAW da kansa da tsagawar wata.",
      "Nassin nassi ga manya-manyan alamomi shine hadisin Huzaifa bn Usayd, wanda Manzon Allah (SAW) ya lissafta goma: hayaki (Dukhan), Dajjal, Dabbar kasa (Dabbat al-ard), fitowar rana daga inda take faduwa (yamma), saukowar Isa bn Maryam, Yajuj da Ma'jujuj, daya daga cikin Gabas, da Majujuj guda daya, da Majujuj guda daya. a yamma, da kuma daya a yankin Larabawa - wanda wata wuta ta rufe da kai mutane zuwa wurin taronsu (Sahih Musulmi 2901). Al-Mahdi da Dajjal sun zo a cikin wasu ingantattun rahotanni kuma an sanya su gabanin saukar Annabi Isa.",
      "Matsayin malamai na gaskiya shi ne, yayin da kowace alamar ta tabbata, ainihin tsarinsu bai cika nassi ba, kuma manyan malaman Sunna sun yi sabani a kan madaidaicin jeri. Wannan bambancin al'ada ce ta al'ada kuma ba ta da wani sabani. Amsar annabci ga duka ba ta tsoro ba ne ko hasashe marar iyaka game da abubuwan da ke faruwa a yau, amma ƙara imani, tuba, da ayyuka masu fa'ida.",
    ],
    quran: [
      {
        excerpt:
          'Sunã tambayar ka game da Sa\'a, "Yaushe ne makõmarta?" Ka ce: "Abin sani kawai, saninta a wurin Ubangijina yake." Bãbu mai bayyana lõkacinta fãce Shi. Yana kwance a cikin sammai da ƙasa. Bã zã ta zo muku ba fãce bisa ga tsammãni.',
      },
      {
        excerpt:
          "Shin kuma sunã jiran (wani abu) fãce dõmin Sa'a ta je musu kwatsam? Wasu alamominsa sun riga sun zo. To, yãya, idan ta jẽ musu, zã a tunãtar da su?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sa’a ba za ta zo ba, sai kun ga alamu goma a gabanta: hayaki, Dajjal, Dabba, fitowar rana daga yamma, saukar Isa dan Maryama, Ya’juj da Ma’juj, zabtarewar kasa uku – daya a gabas daya a yamma daya kuma a cikin Jaziratul Arab – da na karshensu wata wuta wadda take tara mutane.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ƙananan alamomi",
    summary: "Canje-canje a hankali Manzon Allah ﷺ ya siffanta shi - shiri kan firgici.",
    body: [
      "Qananan alamomin su ne tafiyar hawainiya, tarawa a cikin al’umma, xabi’u da yanayin ilimi da Manzon Allah Sallallahu Alaihi Wasallama ya siffanta da qara kusantar Sa’a. Suna da yawa, kuma ta yanayinsu suna bayyana cikin dogon lokaci maimakon a cikin wani lokaci mai ban mamaki. Mafi girman alamar duka, a haƙiƙa, ta riga ta faru: aiko Annabi Muhammad SAW da kansa, wanda ya ce, 'An aiko ni da Sa'a kamar waɗannan biyun,' yana haɗa yatsunsa guda biyu - ma'ana manzo na ƙarshe kuma ƙarshen zamani ya fara.",
      "Daga cikin alamomin da suka zo a cikin ingantaccen hadisi: Rasa amana, ta yadda za a damqa al’amura ga waxanda ba su dace ba – ‘Idan aka bace, to ku jira Sa’a, kuma hakan yana faruwa ‘idan aka ba da hukuma ga waxanda ba su cancanta ba’ (Sahihul Bukhari 6496). A cikin shahararriyar hadisin Jibrilu, Annabi (SAW) ya ambaci alamomi guda biyu masu haske: ‘Yar kuyanga za ta haifi uwargidanta, kuma za ka ga makiyaya mara takalmi, tsirara, marasa galihu suna gasa wajen gina dogayen gine-gine’ (Sahih Musulmi 8).",
      "Sauran sun haɗa da haɓaka gabaɗaya cikin jin lokaci, ƙaruwar girgizar ƙasa da kisa, da bacewar ilimi. Akan ilimi Annabi ﷺ ya yi daidai game da tsarin: 'Sa'a ba za ta tabbata ba har sai an dauke ilimi, girgizar kasa ta karu, lokaci ya yi sauri ya wuce, fitintinu suka bayyana, kashe-kashe ya karu' (Sahihul Bukhari 1036). Kuma ya yi bayanin yadda ilimi ke tafiya: “Allah ba ya gusar da ilimi ta hanyar fizge shi daga mutane, sai dai ya xauke malamai, har sai babu wanda ya rage, kuma mutane sun xauki jahilai a matsayin shugabanni da ake tambaya, suna bayar da fatawa ba tare da ilimi ba, sai su vata, su batar da wasu.” (Sahihul Bukhari 100). Don haka 'rasa ilimi' ba ƙarancin bayanai ba ne - shekaru na iya nutsewa cikin bayanai - amma asarar ƙwararrun malamai da aiwatar da rayuwa.",
      "Muhimmiyar tarbiyya a nan: fassara ce, ba tabbatacciya ba ce, a ayyana cewa takamaiman abin da ya faru na zamani 'shine' hadisi na musamman ya cika. Gasar sama ko tashe-tashen hankula na iya yin daidai da maganar Annabi, amma sanya wahayi ga kanun labarai da gaba gaɗi ba hanya ce ta malamai masu hankali ba. Madaidaicin amsa ga kowace ƙaramar alama tana cikin ciki: karanta ta a matsayin kira zuwa ga komawa ga Allah, don koyi da aiki da addini, da riko da riƙon amana da gaskiya - ba don abin damuwa ko kallo ba.",
    ],
    hadith: [
      {
        excerpt:
          "Idan amana ta ɓace, to, ku yi jiran Sa'a. Sai aka ce: Ta yaya za a bata ya Manzon Allah? Ya ce: “Idan aka yi wa wadanda ba su cancanta ba, to, ku dakata da Sa’a.",
      },
      {
        excerpt:
          "Daga cikin alamomin Sa'a: cewa kuyanga za ta haifi uwargidanta, kuma za ku ga makiyaya marasa takalmi, tsirara, marasa takalmi suna fafatawa a cikin ginin dogayen gine-gine. - daga hadisin Jibrilu.",
      },
      {
        excerpt:
          "Allah ba ya gusar da ilimi da kwacewa, sai dai yana kawar da shi ta hanyar daukar malamai, har sai babu wanda ya saura, mutane suka dauki jahilai a matsayin shugabanni masu yanke hukunci ba tare da ilmi ba, sai su bata suna batar da wasu.",
      },
    ],
    disclaimer:
      "Aiwatar da ƙayyadaddun alamun ƙayyadaddun ƙayyadaddun al'amuran yau da kullun na fassara ne, ba tabbatacce ba ne. Wannan tsarin yana gabatar da ingantaccen hadisi ba tare da tabbatar da wanne al'amuran zamani ne suka cika su ba.",
    actions: [
      "Nemi ilimi mai fa'ida daga ƙwararrun malamai, yi aiki da shi, kuma a ba da shi - wannan kai tsaye yana tsayayya da alamar ɓataccen ilimi.",
      "Kiyaye rikon amana da gaskiya a cikin maganarku da aikinku da mu'amalarku.",
      "Karanta kowace alama a ciki a matsayin kira zuwa ga tuba, ba a matsayin abin tashin hankali ko jita-jita ta kan layi ba.",
    ],
  },
  {
    title: "Manyan alamomi",
    summary: "Manyan alamomi guda goma a cikin Sahihu Musulmi — Mahdi, Dajjal, Isa, da sauransu.",
    body: [
      "Manyan alamomin su ne manya, abubuwan da ba su da tabbas waɗanda ke taruwa kusa da ƙarshen zamani. Shar’arsu ita ce hadisin Huzaifa bn Usayd: Annabi Sallallahu Alaihi Wasallama ya kalli sahabbansa suna tattauna Sa’a, ya ce ba za ta zo ba sai sun ga alamomi goma – hayaki (Dukhan), Dajjal, Dabbar qasa (Dabbat al-Ard), fitowar rana daga yamma, gangarowar Isa bn Maryam, Majusj, Gabas, da Larabawa uku, da Yadij, da Larabawa da Uku. daga karshe kuma wata gobara da take kai mutane zuwa wurin taronsu (Sahih Musulmi 2901). Ba kamar ƙananan alamun ba, da zarar waɗannan sun fara suna bin juna a hankali.",
      "Al-Mahdi ya zo a cikin ingantattun ruwayoyi a matsayin shugaba adali daga iyalan gidan manzon Allah SAW wanda zai cika duniya da adalci kamar yadda aka cika ta da zalunci (Sunan Abi Dawud 4282, hasan). Shi ba mai bayar da doka ba ne ko sabon annabi – yana rayar da shi, ba ya kirkira – kuma imani da shi Ahlul-Sunnah sun tabbatar da shi yayin da aka kebe karin bayani a cikin ruwayoyi masu rauni.",
      "Dajjal (Almasihu na karya) shine mafi girman fitinar duniya guda daya. Manzon Allah SAW ya siffanta shi da tsawo a cikin dogon hadisin al-Nawwas bn Sam’an (Sahih Musulmi 2937): Mayaudari mai ido daya da aka rubuta ‘Kafir’ a tsakanin idanuwansa, ya ba da ikon gwada imani, wanda kowane Annabi ya gargadi mutanensa. Fitnar sa ba wai hujja ba ce face tabbatacciyar imani, kuma Annabi SAW ya koyar da haddar ayoyin bude Suratul Kahf a matsayin kariya.",
      "Isa bn Maryam (amincin Allah ya tabbata a gare shi) zai sauko - tabbataccen batu na aqidar Sunna. Annabi ﷺ ya ce: “Ina rantsuwa da wanda raina ke hannunsa, da sannu xan Maryamu zai sauka a cikinku yana mai adalci; zai karya giciye, ya kashe alade, ya shafe jiziya, kuma dukiya za ta cika har sai wani ya karbe ta.” (Sahihul Bukhari 3448). Yana sauka a matsayin mabiyin Muhammad s.a.w, yayi sallah a bayan limamin al'ummah (Sahihul Bukhari 3439), ya kashe Dajjal, kuma yana shari'ar Muhammad s.a.w. Sai a saki Yajuj da Ma'juj, sauran alamomin su bayyana har wutar da take tara mutane.",
      "Baki biyu na gaskiya. Na farko malamai sun yi ittifaqi a kan haqiqanin kowace alamar da ke cikin hadisin ayoyi goma amma sun yi savani a kan madaidaicin tsarinsu, kuma bambancin halas ne kuma tsoho. Na biyu, Dukhan da Dabba suna daga cikin wannan hadisin sahih shi kansa; wasu ruwayoyin da ke bayyaninsu daban-daban sun bambanta da ƙarfi, don haka wannan tsarin ya dogara da ƙaƙƙarfan rahoton alamomi goma maimakon a kan ƙararrakin ƙararrawa.",
    ],
    hadith: [
      {
        excerpt:
          "Sa’a ba za ta zo ba sai kun ga alamomi guda goma: hayaki, Dajjal, Dabba, fitowar rana daga yamma, gangarowar Isa dan Maryama, Ya’juju da Ma’juj, da zabtarewar kasa uku – daya a gabas, daya a yamma daya kuma a cikin Jaziratul Arab – na karshensu wuta ce mai kora mutane zuwa ga taronsu.",
      },
      {
        excerpt:
          "Ina rantsuwa da wanda raina ke hannunsa, dan Maryama zai sauka a cikinku yana mai adalci. Zai karya giciye, ya kashe alade, ya shafe jiziya, kuma dukiya za ta yawaita ta yadda babu mai karba.",
      },
      {
        excerpt:
          "Da a ce rana daya ta rage a duniya, da Allah ya tsawaita wannan ranar har sai ya fito da wani mutum daga cikin iyalan gidana (Mahdi) a cikinta wanda zai cika kasa da adalci kamar yadda ta cika da zalunci da zalunci.",
      },
    ],
    disclaimer:
      "An tabbatar da haqiqanin manyan alamomin, amma ainihin tsarinsu da lokacinsu bai dace ba a wajen malamai. Ka guje wa tsara kwanan wata, ka guje wa da'awar duk wani adadi na yau shine Mahdi, Dajjal, ko Isa.",
    appLinks: [{}],
  },
  {
    title: "Kaho",
    summary: "Israfil - fashewa ta farko, fashewa ta biyu, da tashin matattu.",
    body: [
      "Idan Allah Ya hukunta qarshen Mala'ikan da aka wakilta a cikin ƙaho (Sur) zai busa shi. Sunansa Israfil ya zo ta hanyar al’adar malamai; abin da Alkur'ani ya daidaita shi ne lamarin da kansa da kuma ta'addancinsa. Annabi ﷺ ya isar da yadda lamarin yake gabatowa: 'Yaya zan samu natsuwa alhalin mai busa ƙaho ya sanya shi a bakinsa, ya lankwashe goshinsa, yana jiran umarni a busa?' - kuma a lokacin da wannan ya ba wa sahabbai rai, sai ya koya musu cewa, Allah ya ishe mu, kuma shi ne mafificin al'amari (Jami' at-Tirmizi 2431, hasan).",
      "Akwai fashewa guda biyu, kuma Kur'ani ya bambanta su. Da farko, ‘a busa ƙaho, kuma wanda ke a cikin sammai da ƙasa zai faɗi matacce, sai wanda Allah Ya so’ (Alkur’ani 39:68) — Ƙaho na firgita da mutuwa wanda ke ƙare tsarin halitta. Sa'an nan kuma ta biyu: 'Sa'an nan kuma za a sake hura, sa'an nan kuma za su tsaya, suna kallo' (aya ta ci gaba) - tashin tashin kiyama, wanda dukan halitta ke tashi daga matattu.",
      "Malamai da yawa, daga aya guda da rahotanni masu goyan baya, suna magana akan keɓantacce - waɗanda Allah ya so waɗanda ba a kashe su ba - da tazara tsakanin fashewar guda biyu, ko da yake tsayinta da cikakkun bayanai sun dogara ne akan rahotannin ƙarfi dabam-dabam kuma an bar su ga Allah. Tabbacin shine nau'i biyu na fashewa: ƙarewa, sa'an nan kuma tayarwa. Ana kiran wannan 'Ranar Gargaɗi' (Alƙur'ani 50:20) domin ita ce sammaci na ƙarshe, da ake yi lokacin da babu lokacin shiryawa - wanda shine ainihin dalilin da ya sa dole ne a amsa sammacin a yanzu.",
    ],
    quran: [
      {
        excerpt:
          "Kuma aka yi busa a cikin ƙaho, kuma wanda yake a cikin sammai da wanda yake a cikin ƙasa ya mutu, fãce wanda Allah Ya so. Sa'an nan kuma za a sake hura, kuma nan da nan za su tsaya suna kallo.",
      },
      {
        excerpt: "Kuma a yi busa a cikin ƙaho. Wancan ita ce rãnar gargaɗi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Yaya zan sami natsuwa alhali mai ɗaukar ƙaho ya sanya shi a bakinsa, ya tanƙwara goshinsa, yana jiran a yi busa? Sai sahabbai suka shiga damuwa, sai ya ce da su: Allah ya ishe mu, kuma shi ne mafificin al’amura.",
      },
    ],
  },
  {
    title: "Tashin Kiyama",
    summary: "Jiki-jiki sun dawo - duniya ta tsaya a gaban Allah.",
    body: [
      "A busa ta biyu aka ta da matattu, jiki da rai, kuma tashin matattu na gaske ne kuma na zahiri ne, ba na ruhaniya kawai ba. Kur'ani ya gamu da ba'a ga mai shakku: wani mutum ya rike wani kashi da ya ruguje ya ce wa zai iya raya shi; Amsa ita ce, 'Ka ce: Wanda ya ƙãga halittarta a farkon lõkaci zai rãyar da ita, kuma Shĩ Masani ne ga dukan halitta' (k:36:78-79). Kuma dã fitar da ku daga kõme bai kasance a cikin ikon Allah ba, kuma mayar da ku bai zama mafi tsanani ba.",
      "Tashin matattu na duniya ne - kowane mutum daga na farko zuwa na ƙarshe, na kowace al'umma, an ta da shi. Annabi SAW ya siffanta halin da mutane ke tashi a cikinsa: 'Za a tara mutane ba takalmi, tsirara da marasa kaciya.' Yayin da A’isha ta tambaya cikin damuwa ko maza da mata za su kalli juna, sai ya ce al’amarin ranar zai yi tsanani da ba zai shafi kowa ba (Sahihul Bukhari 6527). Ya kuma ce: “Za a tara ku ba takalmi, tsirara da marasa kaciya – kuma farkon wanda za a fara tufatar a ranar qiyama shi ne Ibrahim.” (Sahihul Bukhari 3349).",
      "Batun koyaswar ba abin kallo bane amma alhakin da ta zartar. Domin komawa zuwa ga Allah tabbatacciya ce, babu wani aiki da ya kebanta da gaskiya, kuma babu mutuwa ta zama tsira. 'Sa'a tana zuwa - babu shakka a cikinta - kuma Allah zai tayar da wadanda ke cikin kaburbura' (Alkur'ani 22:7). Imani da tashin matattu shine abin da ke sanya nauyin ɗabi'a na wannan rayuwa ya zama gaskiya maimakon na ɗan lokaci.",
    ],
    quran: [
      {
        excerpt:
          'Kuma Ya buga Mana wani misãli, kuma Ya manta halittarsa, Ya ce: "Wãne ne yake rãyar da ƙasũsuwa, alhãli kuwa sũ, sun ruɓaɓɓe?" Ka ce: "Wanda ya ƙãga halittarsu a farkon lõkaci zai rãyar da su, kuma Shĩ Masani ne ga dukan halitta."',
      },
      {
        excerpt:
          "Kuma lalle ne Sa'a mai zuwa - babu shakka a cikinta - kuma lalle ne Allah Yana tayar da wadanda suke a cikin kaburbura.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Za a tattara ku ba takalmi, tsirara, marasa kaciya. Sai ya karanta: Kamar yadda Muka fara halitta ta farko, za mu maimaita ta. Kuma farkon wanda za a fara tufatar da shi ranar qiyama shi ne Ibrahim.",
      },
      {
        excerpt:
          "Za a tara mutane ba takalmi, tsirara da marasa kaciya. Aisha ta ce: maza da mata za su kalli juna? Ya ce: Al'amarin zai yi tsanani ga haka.",
      },
    ],
  },
  {
    title: "Taron (Mahshar)",
    summary: "Tsaya a gaban Allah - rana kusa, gumi, da yanayin mutane.",
    body: [
      "Bayan tashin matattu, an kori dukkan halitta zuwa wani fili mai fadi - Mahshar - don jiran hukunci. Ƙasa da kanta tana sāke: ‘Ranar da ƙasa za ta musanya da wata ƙasa, da sammai kuma, kuma za su fito ga Allah Makaɗaici, Mai rinjayi’ (Qur’an 14:48). Babu alamun ƙasa, babu taron jama'a da za a ɓuya a ciki, babu matsayi da za a dogara da shi - kowane rai kawai, fallasa da jira.",
      "Yanayin tsayuwar yana da tsanani. Manzon Allah (SAW) ya ce: “A ranar kiyama za a kusantar da rana ga mutane ta yadda za ta yi nisa mil guda, kuma za su nutse cikin zufansu gwargwadon ayyukansu, wasu zuwa ga idon sawu, wasu zuwa gwiwoyinsu, wasu zuwa kugunsu, wasu kuma zufa za su yi tashe.” (Sahih Musulmi 2864). Amma duk da haka rahotannin sun bayyana rahamar da ayyuka ke rarrabawa: wani nau'i na Annabi SAW zai kasance inuwa a cikin inuwar Al'arshin Allah a ranar da babu wata inuwa sai nasa - daga cikinsu akwai shugaba adali, da samari da aka tashi a cikin ibada, da wanda ya yi sadaka a boye hannun hagunsa bai san abin da hannun damansa ya kashe ba.",
      "Jiran ya yi tsawo – Kur’ani ya yi magana a kan ‘rana da gwargwadonsa shekaru dubu hamsin’ (Alkur’ani 70:4) – amma tsawonsa ba daya ba ne ga kowa. Ingantattun rahotanni sun ce za a yi haske ga mumini, gwargwadon lokacin da ake yin sallah a tsakanin salloli biyu, yayin da ta matsa wa wasu. Don haka Mahshar shine inda keɓaɓɓen littafan rayuwa ya zama gaskiya na jama'a: rana ɗaya, fili ɗaya, da gogewa daban-daban, waɗanda aka zana gaba ɗaya daga abin da kowane mutum ya aika gaba.",
    ],
    quran: [
      {
        excerpt:
          "Rãnar da aka musanya ƙasã da wata ƙasã, da sammai kuma, kuma zã su fita ga Allah Makaɗaici, Mai rinjãya.",
      },
      {
        excerpt:
          "Mala'iku da Rũhi suna tãka zuwa gare Shi a cikin yini wanda gwargwadonsa shẽkara dubu hamsin ne.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Za a kusantar da rana zuwa ga mutane a Ranar Kiyama har ta yi nisa kusan mil guda, sai su nutse da gumi bisa ga ayyukansu-wasu zuwa ga idon sawunsu, wani a kan gwiwoyinsu, wani zuwa ga kugu, wani kuma zufan ya kaure.",
      },
    ],
  },
  {
    title: "Ceto (Shafa'ah)",
    summary: "Da iznin Allah kawai - nau'i kuma mafi girman ceto.",
    body: [
      "Shafa'ah ceto ce - wani bangare yana magana da Allah a madadin wani. Haƙiƙa ce kuma rahama ce, amma ba ta zama mai zaman kanta: babu mai yin ceto face da iznin Allah a gabaninsa kuma sai wanda ya yarda da shi. Kur'ani ya bayyana hukuncin sau biyu: 'Wane ne wanda ke yin ceto a wurinSa, face da izninSa?' (Alkurani 2:255), kuma ‘Ceto ba ya amfana a wurinSa sai ga wanda Ya yi izini’ (k:34:23). Wannan sharadi guda daya shi ne ya raba aqidar Musulunci ta ceto da kowane fasadi nasa.",
      "Mafi girman komai shine al-Shafa'ah al-'Udhma, kebanta ga Annabi Muhammad SAW. A kan Mahshar, wanda tsayin daka ya murƙushe, 'yan adam za su yi tafiya daga Annabi zuwa Annabi - Adam, Ibrahim, Musa, Isa - kowanne yana ba da uzuri, har sai sun zo wurin Muhammadu s.a.w. Zai yi sujjada a karkashin Al’arshi, a ce masa: ‘Ka daga kai, ka yi roko a ba ka, a yi ceto kuma a karbi cetonka’ (Sahihul Bukhari 7440; Silsilar Annabawa cikakkiya tana cikin Sahihul Musulmi 195). Da shi ya roki Allah da ya fara hisabi kuma ya sauwake a tsaye - tashar yabo ya yi masa alkawari shi kadai.",
      "Sauran sifofi ingantattu suna zuwa: ceton wasu muminai su shiga Aljanna ba tare da hisabi ba; cẽto mai girma daraja; sannan sama da dukkan ceton masu zunubi daga cikin muminai, domin a fitar da mutane daga wuta ta hanyar ceton Annabi SAW, da sauran annabawa, da mala'iku, da muminai, da kuma rahamar Allah, wanda shi ne mafi rahamar masu rahama. Annabawa, shahidai, salihai, har ma da yara da suka mutu suna ƙanana suna iya yin ceto ta hanyar izini, kodayake ƙarfin rahotannin mutum ɗaya ya bambanta.",
      "Muhimmiyar taka tsantsan: cẽto a Lahira ba ta ba da lasisin yin kira ga matattu ko waɗanda ba su nan don neman taimako a yanzu. Kiran Annabi ko waliyyi a cikin kabari, neman su yaye matsi ko biyan buqata, shi ne shiryar da ibada zuwa ga wanin Allah – wato shirka, kuma savanin shafa’ar da aka siffanta a nan ita ce falala da Allah ke yi wa wanda ya so a wannan ranar. Kuma ba ya maye gurbin buqatar imani da tuba a rayuwar duniya; rahamar Allah ce ga wadanda suka rayu kuma suka mutu akan tauhidi.",
    ],
    quran: [
      {
        excerpt:
          "Wane ne wanda ke yin cẽto a wurinSa, fãce da izninSa? Yanã sanin abin da yake a gaba gare su da abin da yake a bãyansu, kuma bã su kẽwayẽwa daga ilminSa, fãce abin da Yake so.",
      },
      {
        excerpt: "Kuma cẽto bã ya amfãni a wurinSa, fãce ga wanda Ya yi izni.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mutane za su zo gare ni, sai in yi sujada ga Allah, sai a ce: Ya Muhammadu ka daga kan ka; ku yi tambaya za a ba ku, ku yi ceto kuma a karɓe ku.",
      },
      {
        excerpt:
          "Mutane za su je ga Adam, sa'an nan zuwa ga Ibrahim, sa'an nan zuwa ga Musa, sa'an nan zuwa ga Isa, kuma kowa zai ba da uzuri, har sai sun zo ga Muhammadu s.a.w, kuma a gare shi da mafi girma cẽto.",
      },
    ],
    misconceptions: [
      "Kuskure: Neman ceto na nufin Annabi SAW ko salihai ana bautawa. GYARA: Bauta ta Allah ce Shi kaɗai; Shafa'ah a Ranar Lahira wata rahama ce da Allah Ya bayar da izininsa, kuma ba ta halasta kiran matattu a cikin rayuwar duniya.",
    ],
  },
  {
    title: "Rubutun Ayyuka",
    summary: "Mala'iku masu rikodin - hannun dama, hannun hagu, babu abin da aka tsallake.",
    body: [
      "Kowane mutum yana da marubuta maɗaukaki biyu waɗanda aka sanya su rubuta ayyukansu: 'Idan masu karɓa biyu suka karɓa, suna zaune a dama da hagu, ba ya furta wata kalma, sai dai a wurinsa akwai mai lura da shirye-shiryen rubutawa' (Alkur'ani 50: 17-18). A Ranar Lahira ana ba da waɗannan littattafai, kuma hanyar karɓar littafin ita kanta ita ce hukunci na farko - a hannun dama ga masu cin nasara, a hannun hagu ko kuma daga bayan baya ga ɓarna (Alkurani 84:7–12; 69:19–37).",
      "Babu wani abu da aka keɓe daga waɗannan bayanan - ba ƙaramin aiki ba, ba tunani mai wucewa wanda ya zama aiki ba. Kuma azzalumai cikamakinsa za su yi mamaki: ‚Suka ce: “Ya kaitonmu! Menene wannan littafi da bai bar wani ƙarami ko babba ba face ya rubuta shi? Kuma za su sami abin da suka aikata a gaba gare su, kuma Ubangijinka ba Ya zaluntar kowa.” (k:18:49). Da rahamar Allah, kyautata niyya da zunubai da aka yi watsi da su su ma suna cikin falalar mumini.",
      "Domin harshe da gaɓoɓi ne ke cika shafuka, kiyaye su shine kiyaye rikodin. Annabi ﷺ ya sanya harshe a tsakiyan ceto: ‘Duk wanda ya lamunce min abin da ke tsakanin haqoqinsa da abin da ke tsakanin qafafunsa, na lamunce masa Aljannah’ (Sahihul Bukhari 6474) – wato duk wanda ya kiyaye maganarsa da farjinsa. Halin yau da kullun na bita na gaskiya - tambayar abin da ya ƙara a yau a cikin littafin - yana ɗaya daga cikin mafi yawan tunani da ayyuka masu amfani da mumini zai iya kiyayewa.",
    ],
    quran: [
      {
        excerpt:
          'Kuma aka sanya littãfi, sai ka ga mãsu laifi sunã tsõro daga abin da ke cikinsa, sunã cẽwa: "Yã kaitonmu! Menene wannan littafi da bai bar wani ƙarami ko babba ba face ya rubuta shi? Kuma za su sãmi abin da suka aikata a gabãni, kuma Ubangijinka bã Ya zãluntar kowa.',
      },
      {
        excerpt:
          "Amma wanda aka bai wa littafinsa a hannun damansa, sai ya ce: “To, ku karanta littafina! Na tabbata zan hadu da asusuna. Don haka zai kasance a cikin rayuwa mai dadi. Amma wanda aka bai wa littafinsa a hannunsa na hagu zai ce: “Da dai ba a ba ni littafina ba.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Duk wanda ya lamunce min abin da ke tsakanin hakulansa da abin da ke tsakanin kafafunsa, na lamunce masa Aljanna – ma’ana harshensa da farjinsa.",
      },
    ],
    actions: [
      "Kiyaye harshe sama da kowane abu - mafi yawan abin da ke cika rikodin don mai kyau ko mara lafiya ya wuce ta.",
      "Yi nazarin ranar ku kafin barci: tambayi abin da kuke so, da abin da za ku ji tsoro, don ganin an rubuta a cikin littafinku.",
    ],
    appLinks: [{}],
  },
  {
    title: "Mizan (Mizan)",
    summary: "Ayyukan da aka auna - ikhlasi, hali, da zikiri suna sa ma'auni yayi nauyi.",
    body: [
      "Mizan shi ne ma’aunin da ake auna ayyuka da adalci: ‘Mun sanya ma’auni na adalci a ranar qiyama, don haka ba za a zalunce wani rai da kome ba; Kuma ko da nauyin ƙwayar mastad ne, za Mu fitar da shi, kuma Mun isa Mu zama masu lissafi (Alkur'ani: 21:47). Ahlul-Sunnah sun tabbatar da ita a matsayin ma'auni na gaske, ba wai kawai misalta ba - ayyuka, ko bayanansu, an auna su da gaske. Wanne kwanon rufi ya nutse makomar mutum yana cewa: ‚Kuma wanda sikelinsa ya yi nauyi, to, zai kasance a cikin rayuwa mai dadi; amma wanda ma'aunansa suka yi sauƙi, to, mafakarsa ta kasance a cikin rami mai zurfi' (Alkur'ani 101: 6-9).",
      "Abin da ke sa ma'auni yayi nauyi ba yawan aiki ba ne, amma nauyinsa a wurin Allah - kuma nauyi yana zuwa daga ikhlasi. Annabi (SAW) ya yi nuni ga ayyukan da ba su da qoqari amma manya-manya: “Kalmomi guda biyu masu haske a kan harshe, masu nauyi a kan sikeli, soyuwa ga mai rahama: SubhanAllahi wa bihamdih, SubhanAllahil-’Azim” (Sahih al-Bukhari 6406). Ya kuma ce: “Babu wani abu da ya fi nauyi akan ma’aunin mumini a ranar kiyama face kyawawan halaye” (Jami’ at-Tirmidhi 2002, sahihul). Don haka sauƙaƙan zikiri da aka maimaita da gaske, ko kuma ɗabi'a mai haƙuri, na iya fin tsaunin tsaunuka na nuna sha'awa.",
      "Sabanin haka shi ne hatsarin ayyuka maras tushe. Ayyukan da mutane za su gani (riya') ko gurɓata su da munafunci na iya zuwa kan Ma'auni mara nauyi - babba a zahiri, babu komai a ciki. Don haka ne ma ikhlasi (ikhlasi) ba xaya ba ce a tsakanin da yawa sai dai abin da ke baiwa kowane aiki nauyinsa. Darasin shi ne gina ranar a kan kananan ayyuka na gaskiya da daidaito, da tsarkake niyya a bayan abubuwan da ake gani.",
    ],
    quran: [
      {
        excerpt:
          "Kuma Mun sanya ma'auni na adalci ga Rãnar ¡iyãma, sabõda haka ba a zãluntar rai da kõme. Kuma idan nauyin ƙwãyar ƙwaya ta kasance, zã Mu fitar da ita, kuma Mun isa Mu zama mãsu lissafi.",
      },
      {
        excerpt:
          "Amma wanda ma'auninsa suka yi nauyi, to, zai kasance a cikin rayuwa jin daɗi. Kuma amma wanda ma'aunansa suka yi sauƙi, to, makõmarsa ta kasance a cikin rami.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kalmomi guda biyu masu haske akan harshe, masu nauyi akan sikeli, masoyi ga mai rahama: SubhanAllahi wa bihamdih, SubhanAllahil-'Azim.",
      },
      {
        excerpt:
          "Babu wani abu da ya fi nauyi akan ma'aunin mumini a ranar kiyama face kyawawan halaye. Lallai mai kyawun hali yana riskar mai azumi da sallah da shi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Hisab (Hisab)",
    summary: "Hisabi mai sauƙi, dalla dalla dalla-dalla, da haƙƙoƙin da ake bin wasu.",
    body: [
      "Hisab shine hisabi, lokacin da aka yiwa kowane mutum hisabi akan rayuwarsa. Alkur'ani ya bayyana abubuwa guda biyu masu mabambanta a cikinsa: \"Kuma wanda aka bai wa littafinsa da hannun damansa, za a yi masa hisabi da sauki, kuma ya koma ga mutanensa da jin dadi; amma wanda aka bai wa littafinsa a bayansa, zai yi kira zuwa ga halaka” (Qur’an 84:7–11). 'Sauƙaƙin lissafi' rahama ne, ba rashin jarrabawa ba - Annabi ﷺ ya yi gargaɗi cewa tsananin tambaya ita kanta irin azaba ce.",
      'Matar Annabi ﷺ ta ba da labarin banbance-banbance. Aisha ta ruwaito shi tana cewa: "Duk wanda aka yi wa hisabi to ya halaka. Ta ce: "Amma Allah bai ce: "A yi masa hukunci da sauƙi ba?" Ya ce: ‚Wannan ita ce kawai gabatar da ayyuka; amma duk wanda aka yi masa tambaya a kan lissafin to ya lalace.” (Sahihul Bukhari 6537). Don haka begen mumini ba shine ya kubuta daga duk wani bincike ba, amma a nuna masa ayyukansa, a rufe masa zunubansa, kuma a gafarta masa - maimakon a yi masa tambayoyi kan abu daya.',
      "Akwai nau’in bashi wanda hatta gafarar Allah ba wai kawai ya ke shafewa ba: hakkin sauran mutane (huququl-ibad). Sai Annabi SAW ya ce, shin kun san wanda ya yi fatara? Sai suka ce: Wanda ba shi da kudi. Sai ya ce: “Mai barar al’ummata, shi ne wanda ya zo ranar qiyama da sallah da azumi da sadaka, amma wanda ya zagi wannan, ya zagi waccan, ya yi wa waccan kazafi, ya xauki dukiyar wani, ya zubar da jinin wani – sai a danka musu ayyukansa na qwarai, kuma idan ayyukansa na qwarai suka qare sai a dora masa zunubansu, sai a jefa shi a wuta.” (2Sahi 1:8). Ibada ba ta kawar da zalunci; kawai daidaita zalunci yayi.",
      "Ƙarshe a aikace yana da gaggawa kuma takamaiman: basusukan da ba a biya ba, dukiyar da aka sace, da zage-zage, da karyewar amana dole ne a daidaita su a cikin wannan rayuwa ta hanyar tuba zuwa ga Allah da ramawa da neman gafara ga mutane - domin ya fi arha zama a cikin kuɗin kuɗi da tawali'u a yanzu fiye da kuɗin ayyukan alheri a lokacin. Kuma a cikinsa ne adalcin Allah ya cika kuma rahamarsa ta mamaye duk wanda ya yi jihadi da gaskiya kuma ya tuba.",
    ],
    quran: [
      {
        excerpt:
          "Amma wanda aka bai wa littafinsa a hannun damansa, za a yi masa hisabi da sauki, kuma ya koma ga mutanensa da jin dadi. Kuma wanda aka bai wa littãfinsa a bãyansa, to, ya yi kira ga halaka, kuma ya shiga Sa'ĩm.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Duk wanda aka yi wa hisabi za a halaka. A’isha ta ce: Ashe Allah bai ce, za a yi masa hukunci da sauki ba? Sai ya ce: “Wannan ita ce gabatar da ayyuka kawai; Amma wanda aka yi wa tambaya a kansa, za a halaka shi.",
      },
      {
        excerpt:
          "Kun san wanda ya yi fatara? Shi ne wanda ya zo ranar qiyama da sallah da azumi da zakka, amma ya yi zagi, da kazafi, da zalunci, sai a ba su ayyukansa na alheri, kuma idan sun gama sai a dora masa zunubansu, kuma a jefa shi wuta.",
      },
    ],
    actions: [
      "Ku daidaita basussuka, kuma ku mayar da abin da aka karɓe ba da hakki ba, komai kankantarsa, a gabanin ranar da aka ƙaddara ya isa.",
      "Ku nemi gafarar duk wanda kuka zalunta a baki, dukiya ko mutunci - ramawa yanzu ya fi arha fiye da ramawa a lokacin.",
      "Ku tuba zuwa ga Allah a kan haƙƙoƙin da ke gare Shi, kuma ku kiyaye littafai biyu – na Ubangiji da na mutum – dukansu a bayyane.",
    ],
    appLinks: [{}],
  },
  {
    title: "Tafki (Hawd)",
    summary: "Basin Annabi ﷺ - wanda yake sha kuma wanda aka juya baya.",
    body: [
      "Hawdu ita ce babban kwano da aka baiwa Annabi Muhammad SAW ranar kiyama, rahama ce ga al'ummarsa da ke fama da kishirwa a wannan rana mai tsananin zafi. Siffofinsa suna da yawa kuma ingantattu: 'Hawadina tafiyar wata guda ce; Ruwansa ya fi madara fari fari, kamshinsa ya fi miski zaki, kofunansa kamar taurarin sama suke. Wanda ya sha daga cikinsa ba zai sake jin kishirwa ba.” (Sahihul Bukhari 6579). Imani da Hawdi wani bangare ne na aqidar Ahlus-Sunnah, wanda rahotannin da ake yadawa da yawa suka kafa.",
      'Annabi SAW da kansa zai karbi mabiyansa a can: "Zan isa Hauwad da ke gabanku, kuma zan sa ido ga wadanda suke zuwa gare ni" (Sahih Musulmi 2292). Ya gane ummansa annurin fuskokinsu, hannuwa da qafafunsu daga alamun alwala. A kai gare shi a kashe shi har abada; ana ciyar da shi, cikin fahimta mai kyau, ta al-Kausar, kogin Allah ya baiwa Annabi SAW a cikin Aljanna.',
      "Duk da haka wasu za a kore su daga Hawd. Annabi Sallallahu Alaihi Wasallama ya siffanta yadda ake gaya wa wasu mutane cewa, ‘Ba na ku ba ne; sun musanya, kuma suka musanya addini a bãyanku, kõ kuwa suka jũya bãya a bãyansa. Malamai sun yi hattara da wannan: yana nuni ne ga wasu nau’o’i na musamman a cikin hadisi – kamar ridda da kabari, da bidi’a da gangan a cikin addini bayan shiriya bayyananna – kuma ba hurumin ba ne ga musulmi talakawa su rika jifan junansu. Amintaccen tafarkin Hauwadi shi ne riko da Sunnah, da kiyaye alwala da sallah, da kiyaye hadin kan muminai.",
    ],
    hadith: [
      {
        excerpt:
          "Hawd dina tafiyar wata daya ce. Ruwansa ya fi madara fari fari, ƙamshinsa ya fi miski daɗi, kofunansa suna da yawa kamar taurarin sama. Wanda ya sha daga gare ta, ba zai sake jin ƙishirwa ba.",
      },
      {
        excerpt:
          "Zan isa Hawd a gabanku, kuma zan sa ido ga waɗanda suke zuwa gare ni. Za a kwace mini wadansu mazaje, sai in ce: Ya Ubangiji, sahabbai! A ce: Ba ku sanin abin da suka bidi'a a bayanku.",
      },
    ],
    disclaimer:
      "Rahotanni game da wadanda aka bijire daga Hawd suna nuni ne da wasu nau'i na musamman da aka ambata a cikin hadisi, musamman ridda da bidi'a a cikin addini. Ba lasisi ba ne ga musulmi su bayyana juna a cikin bata.",
  },
  {
    title: "Gadar (Sirat)",
    summary: "Ketare kan Jahannama - gudun bisa ga ayyuka da rahama.",
    body: [
      "Sirat wata gada ce wadda aka shimfida a saman saman Jahannama, kuma kowane mutum dole ne ya tsallake ta, mumini da kafiri. Alkur'ani ya tabbatar da tsallaka ba tare da togiya ba: ‚Babu dayanku face ya zo mata. Wancan, a kan Ubangijinka, wajabce ta tabbata. Sa'an nan kuma Mu tsĩrar da waɗanda suka bi Allah da taƙawa, kuma Mu bar azzãlumai a cikinta gurfãne.\" (k:19:71-72). Wuce ta duniya; isowar gaba mai nisa lafiya, shi ne al’amarin baki daya, kuma Allah ne ya bayar da shi ga wadanda ya ke karewa.",
      "Hanyar wucewa ana saita ta da ayyukan da mutum ya kawo. Manzon Allah (SAW) ya siffanta shi da cewa: “Za a dora gada a kan Jahannama… kuma na farkonku zai wuce kamar walkiya, sannan kamar iska, sannan kamar tsuntsaye, sannan kamar mai gudu – gwargwadon ayyukansu – alhalin Annabinku yana tsaye a kan gada yana cewa: Ya Ubangiji ka kiyaye su, ka kiyaye su. Wasu ana tsira ba tare da an same su ba, wasu kuma a tono su a bar su, wasu kuma a jefa su cikin Wuta.” (Sahihul Bukhari 6573). A gefen gadar, a cikin rahoton guda, tsaya rikon amana (amanah) da alakar dangi - wani hoto mai ban sha'awa wanda amincin amana da haɗin dangi yana tare da mutum a fadin.",
      "Haske da sauri akan Sirat ana samun su a wannan rayuwar. Addu'a akan lokaci, sadaka akai-akai, gaskiya a cikin mu'amala, da kyawawan halaye sun zama tushe da hasken da ake tsallakawa da shi. Annabi ﷺ zai yi wa muminai da ke wurin ceto, kuma da rahamar Allah ne kowa ya riski wani vangare kwata-kwata.",
      "Kamar yadda yake tare da sauran tashoshin da ba a iya gani ba, hanya mai hikima ba shine yin hasashe game da girman jiki na gada ba - yadda bakin ciki, yaya kaifi, tsawon lokacin - fiye da abin da wahayi ya fada, amma a mayar da hankali ga ayyukan da ke sa hasken haye. Abin da ba za ku iya hoto ba, har yanzu kuna iya shiryawa.",
    ],
    quran: [
      {
        excerpt:
          "Kuma babu kowa a cikinku face ya je mata. Wancan, a kan Ubangijinka, wajabce ta tabbata. Sa'an nan kuma Mu tsĩrar da waɗanda suka bi Allah da taƙawa, kuma Mu bar azzãlumai a cikinsa gurfãne.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Za a kafa gadar a kan Jahannama, kuma ni ne farkon wanda zai haye. Jama'a za su haye ta bisa ga ayyukansu, kamar walƙiya, kamar iska, kamar tsuntsaye, kamar mai gudu, na ce, Ya Ubangiji, ka kiyaye su, ka kiyaye su. Wasu an tsira, wasu an toke su a sake su, wasu kuma sun fada wuta.",
      },
    ],
    actions: [
      "Yi salloli biyar akan lokaci - addu'ar ita ce hasken da ke jagorantar gada.",
      "Bada sadaka akai-akai koda kadan ne.",
      "Ku kiyaye alakar zumunta kuma ku kiyaye amanarku - a cikin hadisin sun tsaya a gefen Sirat din.",
    ],
  },
  {
    title: "Aljanna",
    summary: "Lada na har abada - ni'imarsa da kuma, fiye da komai, ganin Allah.",
    body: [
      "Jannah ita ce madawwamiyar gida da Allah ya tanadar wa muminai, haqiqanin abin da bai kai ga tunani ba. A cikin wani hadisi mai tsarki, Manzon Allah Sallallahu Alaihi Wasallama ya ce game da shi: “Na yi tattalin bayina salihai abin da ido bai gani ba, ba kunne ba, kuma zuciyar mutum ba ta taba daukar ciki ba.” (Sahihul Bukhari 3244). An siffanta kogunanta da lambuna da wuraren zama da abokantaka a cikin Alkur'ani don jawo zuciya, amma kwatancen suna nuni ne ga farin cikin da ya wuce su.",
      "Mafi girman ladansa ba wani lambu ko kogi ba ne face yardar Allah da ganin fuskarsa. 'A ranar nan wasu fuskõki za su yi haske, suna kallon Ubangijinsu' (Alkur'ani 75:22-23) - Ahlul Sunna sun fahimci cewa muminai suna ganin Allah a Lahira, ni'imar Aljanna, wanda aka ba su ta hanyar da ta dace da daukakarSa, ba tare da kamanta ga halitta ba. Allah ya yi alkawari cewa: 'Ga waɗanda suka kyautata suna da mafi kyawun sakamako, da ƙari' (Qur'ani 10:26) - kuma an bayyana 'ƙarin' a cikin ingantaccen hadisi a matsayin wannan hangen nesa na FuskarSa mai daraja.",
      "Shiga Aljannah da rahamar Allah ne, wanda aka runguma ta hanyar imani da ayyuka na qwarai – ba a tava savawa biyun: rahama ita ce sababi, kuma ayyuka su ne alama da hanyoyin da Allah Ya daure ta da ita. Ranar lahira tana ƙarewa, ga mutanen Aljanna, a cikin ni'ima wadda ba ta shuɗewa kuma ba ta ƙarewa. Wannan tsarin yana taƙaita maganin Aljanna a takaice; cikakken jagorar Tafiya zuwa Aljannah ya kunshi ƙofofinta, da darajoji, da ayyukan da suke kaiwa gare ta, da addu'o'in da ke cikinta a zurfafa.",
    ],
    quran: [
      {
        excerpt:
          "Kuma ku yi gaugãwa zuwa ga gãfara daga Ubangijinku, da Aljanna fãɗinta kamar sammai da ƙasã, an yi tattalinta dõmin mãsu taƙawa.",
      },
      {
        excerpt: "Fuskõki a rãnar nan, zã su yi haske, sunã kallon Ubangijinsu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah yana cewa: Na tanadar wa bayina salihai abin da ido bai taba gani ba, kuma kunne bai ji ba, da abin da zuciyar mutum ba ta taba dauka ba.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Jahannama",
    summary: "Gargadi na gaskiya - hukunci na ainihi, da ƙofar tserewa yayin da suke raye.",
    body: [
      "Jahannama gidan azaba ne na haqiqa, ba alama ko misaltuwa ga mummunan yanayin tunani ba. Imani da shi yana daga cikin imani da gaibu da adalcin Allah. Kur’ani ya yi kashedi da fayyace cewa: ‘Wadanda suka kafirta da Ubangijinsu suna da azabar Jahannama, kuma tir da makoma’ (Qur’an 67:6). An kwatanta tsananinta don a farke, ba don gamsar da sha'awa ba: 'Wuta ce wadda makamashinta mutane ne da duwatsu' (Alkur'ani 2:24), waɗanda ke ƙarƙashin ikon mala'iku waɗanda ba sa saba wa Allah a cikin abin da ya umarce su.",
      "Manufar waɗannan gargaɗin shine jinƙai a ɓoye. Suna wanzuwa don su karya girman kai, su daina ƙin yarda da gaskiya, da kuma mayar da mutum baya kafin lokaci ya kure. Shi ya sa kusan kullum gargadin da ke cikin Alkur'ani yana hade da bude kofar tuba - batun siffanta Wuta shi ne dai dai domin mutane su guje ta alhalin suna iyawa. Azãbarta ãdalci ce: bãbu mai shiga cikinta fãce da zãɓensu daga shiriya bayyananna, kuma Allah bã Ya zãluntar kõwa.",
      "Ga muminai masu xauke da zunubai, ingantaccen imanin Ahlus-Sunnah shi ne ma’auni tsakanin tsoro da bege: mai zunubi yana qarqashin iznin Allah – Ya gafartawa, ko kuma ya tsarkake wuta, sa’annan ta hanyar ceto da rahamar da aka ambata a baya, ya fitar da duk wanda yake da koda kwatankwacin zarra na imani. Wannan tsarin yana ba da Jahannama taƙaitaccen magani da gangan. Cikakken nazarin gargaɗinsa, da manyan zunubai, da faffadan kofofin tuba da rahama ana samun su a cikin Fahimtar Jahannama da batutuwan aqida masu alaƙa - wanda ake kusantar da shi koyaushe da bege, ba yanke yanke ƙauna ba.",
    ],
    quran: [
      {
        excerpt:
          "Kuma waɗanda suka kãfirta da Ubangijinsu suna da azãbar Jahannama, kuma tir da makoma.",
      },
      {
        excerpt:
          "Ka ce: Ya ku bayiNa wadanda suka yi zalunci a kansu, kada ku yanke tsammani daga rahamar Allah. Lallai Allah yana gafarta zunubai baki daya. Lalle Shĩ, Shĩ ne Mai gãfara, Mai jin ƙai.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Wanene ya shiga ba tare da hisabi ba?",
    summary: "Hadisi ingantacce akan wadanda suka ketare hisab dalla-dalla - tattaunawa ta ilimi.",
    body: [
      "Daga cikin rahamar ranar lahira akwai gungun wannan al'ummah sun shiga Aljanna ba tare da wani hisabi ba. Annabi SAW ya ce, dubu saba'in daga cikin al'ummata za su shiga Aljanna ba tare da hisabi ba, a wata lafazin kuma, 'da kowane dubu saba'in. Yayin da sahabbai suka yi mamakin ko su wane ne, sai ya siffanta su da cewa: “Su ne wadanda ba sa neman ruqya a wajen wasu, ba su yin imani da mugun nufi, ba sa yin tawakkali, kuma suke dogara ga Ubangijinsu.” (Sahihul Bukhari 6541).",
      "Zuciyar wannan siffa ita ce tawakkul - mai zurfi, tawakkali ga Allah - tare da 'yanci daga camfi da kuma tawakkali ga dalili. Ba ya la'anci neman izinin magani; ruqyah da ake karantawa akan kai da kuma maganin halal duk sun tabbata a cikin Sunnah. Abin yabo shi ne mutumin da tawakkali ya kasance ga Allah gaba xaya ta yadda ba sa zagayawa suna roqon wasu layukan ruhi ko riqo da ishara.",
      "Malamai sun yi magana akan adadin da kansa: wasu suna ganin dubu saba'in na zahiri ne, wasu kuma an ninka ta da ƙarin rahotanni, wasu kuma suna nuni da yawan falalar Allah da ba za a iya ƙididdige shi ba maimakon ƙayyadaddun ƙididdiga. Abin da suka yi ittifaqi a kai shi ne ainihin gaskiya - cewa rahamar Allah ta zarce abin da ’yan adam za su yi tsammani, kuma ceto na ƙarshe ta wannan rahamar ne.",
      "Wannan tasha ce ta bege, ba madogarar kasala ba. Tana kwadaitar da mumini zuwa ga tawakkali na gaske ga Allah da nisantar camfe-camfe, alhali yana jihadin bauta. Ba wanda yake samunsa ta hanyar barin ayyuka; an jawo mutum zuwa gare ta da ikhlasi da tawakkali da zuciya mai ma'ana ga Allah fiye da fara'a da tsoro.",
    ],
    hadith: [
      {
        excerpt:
          "Dubu saba'in daga cikin al'ummata za su shiga Aljanna ba tare da hisabi ba: su ne wadanda ba sa neman ruqya a wurin wani, ba su yi imani da mugun nufi ba, ba sa yin tawakkali, kuma suka dogara ga Ubangijinsu.",
      },
    ],
    disclaimer:
      "Malamai sun yi sabani a kan ko ‘ba tare da hisabi ba’ na nufin tsayayyen adadi dubu saba’in ko mafi girma, wanda ba a iya tantancewa ba. Dukkansu sun yi ittifaqi a kan cewa ceto na qarshe da rahamar Allah ne, kuma wannan dalili ne na bege, ba ga barin ayyuka ba.",
  },
  {
    title: "Shiri don Yinin Ƙarshe",
    summary: "Ibada mai aiki - haɗa kowane ɗabi'a zuwa gamuwa da Allah.",
    body: [
      "Bayan tafiya dukan tafiya - mutuwa, kabari, alamu, ƙaho, taro, rubuce-rubuce, Sikeli, hisabi, gada, da gidaje biyu - kawai amsa mai hankali shine shirya. Amma shiri ba tsoro bane. Annabi ﷺ bai taba barin sahabbansa a firgice da gurguje ba; ya barsu suna aiki. Asalinsa duka shi ne tauhidi da ikhlasi (ikhlas): Ana karbar aiki ne kawai idan an yi shi ne don Allah shi kadai, kuma bisa tafarkin Sunna, don haka kafin ka kara wasu ayyuka, ka tsarkake niyya a bayan wadanda ka riga ka ke da su.",
      "Gina ranar akan ginshiƙai nassosi sun yi nauyi akan Sikeli. Sallah akan lokaci ita ce anka da hasken Sirat. Kur'ani - karantawa, ji, da kuma tunani akai, ko da ayoyi kaɗan a kullum - yana raya zuciya. Tawbah ya share littafin: 'Ya ku muminai, ku tuba zuwa ga Allah da tuba na gaskiya' (Alkur'ani 66:8). Sadaka tana tsarkake dukiya kuma tana raya ka a matsayin sadaqah jariyah. Dhikr yana kiyaye harshe nauyi akan Sikeli tare da kalmomi masu haske akan harshe. Kuma kyawawan halaye, Annabi SAW ya ce, shi ne mafi nauyin abin da aka dora akan Ma'auni.",
      "Ka kiyaye abubuwa guda biyu da Annabi ﷺ ya daure kai tsaye da Aljanna – harshe da tsafta (Sahihul Bukhari 6474) – domin wadannan, fiye da manya-manyan zunubai, su ne suke cika ko barar da wani littafi cikin nutsuwa. Kuma ku daidaita hakkin mutane alhalin kuna iya: ku biya bashi, ku mayar da abin da aka karbe, ku nemi afuwar cutarwa, ku yi adalci a cikin kowace mu’amala, ta yadda ba za ku isa a matsayin ‘basarai’ wanda addu’arsa ta ci da da’awar waxanda ya zalunta.",
      "Komai yana kan niyya guda ne, a cikin hadisin farko na Sahihul Bukhari cewa: ‚Ayyuka ba su kasance ba sai da niyya. Kada ku yi amfani da maƙiyan Munib a matsayin maki don yin gasa amma a hankali a hankali don waɗannan halaye - addu'a, Alƙur'ani, zikiri, sadaka, tuba - kowane ɗayanku a hankali yana nuna ranarku ga saduwa da Allah. Wannan ita ce dukan manufar: rayuwa a yanzu kamar wanda yake fatan tsayawa a gabansa da gaske.",
    ],
    quran: [
      {
        excerpt: "Kuma ban halicci aljanu da mutane ba face domin su bauta Mini.",
      },
      {
        excerpt:
          "Ya ku wadanda suka yi imani ku tuba zuwa ga Allah da tuba na gaskiya. Tsammãnin Ubangijinku Ya kankare muku ayyukanku, kuma Ya shigar da ku gidãjen Aljanna, ƙoramu na gudãna daga ƙarƙashinsu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ayyuka kawai bisa niyya ne, kuma kowane mutum zai sami abin da ya yi niyya ne kawai.",
      },
      {
        excerpt:
          "Duk wanda ya lamunce min abin da ke tsakanin hakulansa da abin da ke tsakanin kafafunsa – harshensa da farjinsa – Na lamunce masa Aljanna.",
      },
    ],
    actions: [
      "Yi salloli biyar akan lokaci.",
      "Karanta ko sauraron Kur'ani kullum - har ma da ayoyi kaɗan.",
      "Ka kiyaye safiya da maraice.",
      "Ba da sadaka akai-akai, koda kadan ne.",
      "Tuba kullum da neman gafara da ikhlasi.",
      "Ku kiyaye harshe da farji, kuma ku kiyaye kowane alkawari da aminci.",
      "Cika haƙƙoƙin da ake bin iyali, maƙwabta, da masu bashi.",
      "Yi tunani a cikin littafin addu'ar ku akan khushu da ikhlasi na niyya.",
    ],
    appLinks: [{}, { label: "Mai nauyi a Mizan" }, {}, {}, {}, {}, {}],
  },
  {
    title: "Mai nauyi a Mizan",
    summary:
      "Ayyukan da ingantattun nassosi suka kira masu nauyi, masu cika ma'auni, ko mafi soyuwa.",
    body: [
      "Alkur'ani da Sunna ba su ba da jeri na dukkan ayyuka ba; muna tsaya ga kalmomin nassosi.",
      "Nauyi a Mizan yana fara ne da ikhlasi; ƙaramin aiki na gaskiya zai fi babban riya nauyi.",
      "Ku dawwama a kan wannan zikiri da kyawawan halaye da zuciya mai hankali.",
    ],
    mizanDeeds: [
      {
        title: "Kyakkyawan hali",
        summary: "Babu abin da ya fi kyakkyawan hali nauyi a ma'aunin mumini.",
        hadith: {
          excerpt: "Babu abin da ya fi kyakkyawan hali nauyi a ma'aunin mumini.",
        },
      },
      {
        title: "Kalmomi biyu masu sauƙi",
        summary: "Masu sauƙi a harshe, masu nauyi a Mizan kuma masoya ga Mai rahama.",
        hadith: {
          excerpt: "Subhanallahi wa bihamdihi, Subhanallahil-azim.",
        },
      },
      {
        title: "Alhamdulillah yana cika Mizan",
        summary: "Godiya ga Allah tana cika ma'auni.",
        hadith: {
          excerpt: "Alhamdulillah yana cika Mizan.",
        },
      },
      {
        title: "Katin shahada",
        summary: "Tauhidi na gaskiya ya fi takardun zunubi nauyi.",
        hadith: {
          excerpt: "Katin shahada ya fi takardun zunubi nauyi.",
        },
      },
      {
        title: "Mafi alherin zikiri",
        summary: "Mafi alherin zikiri shi ne La ilaha illallah.",
        hadith: {
          excerpt: "Mafi alherin zikiri shi ne La ilaha illallah.",
        },
      },
      {
        title: "Kalmomi huɗu mafi soyuwa",
        summary: "Magana mafi soyuwa ga Allah kalmomi huɗu ne.",
        hadith: {
          excerpt: "Subhanallah, Alhamdulillah, La ilaha illallah, Allahu Akbar.",
        },
      },
      {
        title: "Subhanallahi wa bihamdihi ×100",
        summary: "Wanda ya faɗa sau ɗari a rana an yi masa albishir da gafara.",
        hadith: {
          excerpt: "Wanda ya faɗa sau ɗari a rana, za a gafarta masa zunubansa.",
        },
      },
    ],
    quran: [
      {
        excerpt: "Aiki da ikhlasi yana da nauyi a Mizan.",
      },
      {
        excerpt: "Kyakkyawan hali yana da nauyi ƙwarai a ma'aunin mumini.",
      },
    ],
    hadith: [
      {
        excerpt: "Babu abin da ya fi kyakkyawan hali nauyi a ma'aunin mumini.",
      },
      {
        excerpt: "Subhanallahi wa bihamdihi, Subhanallahil-azim.",
      },
      {
        excerpt: "Alhamdulillah yana cika Mizan.",
      },
      {
        excerpt: "Katin shahada ya fi takardun zunubi nauyi.",
      },
    ],
    misconceptions: [
      "Alkur'ani da Sunna ba su ba da jeri na dukkan ayyuka ba; muna tsaya ga kalmomin nassosi.",
      "Nauyi a Mizan yana fara ne da ikhlasi; ƙaramin aiki na gaskiya zai fi babban riya nauyi.",
    ],
    actions: [
      "Ku dawwama a kan wannan zikiri da kyawawan halaye da zuciya mai hankali.",
      "Masu sauƙi a harshe, masu nauyi a Mizan kuma masoya ga Mai rahama.",
      "Godiya ga Allah tana cika ma'auni.",
      "Babu abin da ya fi kyakkyawan hali nauyi a ma'aunin mumini.",
    ],
    appLinks: [
      {
        label: "Mai nauyi a Mizan",
      },
      {
        label: "Kalmomi biyu masu sauƙi",
      },
      {
        label: "Alhamdulillah yana cika Mizan",
      },
      {
        label: "Gaskiya",
      },
      {
        label: "Shirin Mizan mai nauyi",
      },
    ],
  },
];

export const LAST_DAY_HADITH_HA: DeepPartial<LastDayHadithEntry>[] = [
  {
    hadith: {
      excerpt: "Ka tuna sau da yawa mai lalata jin dadi - ma'anar mutuwa.",
    },
    context:
      "Zikirin mutuwa akai-akai yana tausasa zuciya, yana narkar da bacin rai, yana gyara abubuwan da suka fi dacewa ba tare da haifar da yanke kauna ba.",
  },
  {
    hadith: {
      excerpt:
        "Kada ɗayanku ya mutu face yana mai zato ga Allah, yana mai kyautata zaton rahamar Ubangijinsa.",
    },
    context:
      "Kyakkyawar kyakyawan qarshe (husn al-khatimah) ana fatan samun qarshen imani da tuba da kyakkyawan fatan Allah.",
  },
  {
    hadith: {
      excerpt: "Kabari ko dai lambu ne daga gidajen Aljannah ko rami daga ramukan wuta.",
    },
    context:
      "Barzakh ya hada da lada ko ukuba a cikin kabari, da hikimar Allah - kabari yana madubin ayyukan mutum.",
  },
  {
    hadith: {
      excerpt:
        "Idan aka binne mamacin sai mala'iku biyu suka zo suna tambayarsa game da Ubangijinsa, da addininsa, da Annabinsa.",
    },
    context:
      "Tambayoyi a cikin kabari sun tabbata a cikin ingantattun rahotanni; a cikin wannan ruwaya ana kiran Mala'iku biyu Munkar da Nakir.",
  },
  {
    hadith: {
      excerpt:
        "Idan mutum ya mutu ayyukansa sun kare sai guda uku: Sadaka mai gudana, ko ilimin da ake samun riba daga gare shi, ko dan salihai ya roke shi.",
    },
    context: "Abin da ya ci gaba da amfanar mamaci - ya tabbata a hadisi sahihi.",
  },
  {
    hadith: {
      excerpt:
        "Za a tara ku ba takalmi, tsirara da marasa kaciya, kuma farkon wanda za a fara tufatar da ku ranar kiyama shi ne Ibrahim.",
    },
    context: "Tawali'u a Ranar Tara; Allah Yana girmama wanda Yake so, yadda Yake so.",
  },
  {
    hadith: {
      excerpt:
        "Za a kusantar da rana zuwa ga mutane a Ranar Kiyama har ta yi nisa kamar mil guda, kuma za su nutse cikin zufansu gwargwadon ayyukansu.",
    },
    context: "Sharuɗɗa akan Mahshar - tsanani ya bambanta da ayyuka a cikin ingantattun ruwayoyi.",
  },
  {
    hadith: {
      excerpt:
        "Mutane za su zo gare ni, sai in yi sujada ga Allah, sai a ce: ku daga kai; ku yi tambaya za a ba ku, ku yi ceto kuma a karɓe ku.",
    },
    context: "Mafi girman ceto - al-Shafa'ah al-'Udhma, keɓanta ga Annabi ﷺ.",
  },
  {
    hadith: {
      excerpt:
        "Duk wanda aka yi wa hisabi za a halaka. A’isha ta ce: Ashe Allah bai ce za a yi masa hukunci da sauki ba? Sai ya ce: “Wannan ita ce gabatar da ayyuka kawai; Amma wanda aka yi wa tambaya a kansa, za a halaka shi.",
    },
    context:
      "'Asusu mai sauƙi' jinƙai ne - ana nuna wa mutum ayyukansa kuma a gafarta masa, ba abin da aka yi masa tambayoyi da abu ba.",
  },
  {
    hadith: {
      excerpt:
        "Bakar al'ummata, shi ne wanda ya zo da sallah da azumi da sadaka, amma ya zage shi, ya zage shi, ya zalunce shi - don haka a ba su kyawawan ayyukansa, an ɗora masa zunubansu.",
    },
    context:
      "Hakkokin mutane (huquq al-'ibad) ba wai kawai ana soke su ta hanyar ibada ba; dole ne a daidaita su ko a biya su a ranar.",
  },
  {
    hadith: {
      excerpt:
        "Dubu saba'in daga cikin al'ummata za su shiga Aljanna ba tare da hisabi ba: wadanda ba su neman ruqya a wajen wani ba, ba su yi imani da mugun nufi ba, ba su yi tawakkali ba, kuma suka dogara ga Ubangijinsu.",
    },
    context:
      "Malamai sun yi sabani a kan shin adadin na zahiri ne ko kuma yana nuni da girman rahamar Allah mai girma, wanda ba a iya misalta shi.",
  },
  {
    hadith: {
      excerpt:
        "Hawd dina tafiyar wata daya ce. Ruwansa ya fi madara fari fari, ƙamshinsa ya fi miski daɗi, kofunansa suna da yawa kamar taurarin sama. Wanda ya sha daga gare ta, ba zai sake jin ƙishirwa ba.",
    },
    context: "Tafki - rahama ga al'ummar Muhammad ﷺ ranar kishirwa.",
  },
  {
    hadith: {
      excerpt:
        "An saita gadar akan Jahannama. Jama'a suna haye ta bisa ga ayyukansu - kamar walƙiya, kamar iska, kamar tsuntsaye, kamar mai gudu - wasu kuma an ɗebo su sun tsira, wasu kuma sun faɗi.",
    },
    context: "Gudun ketare yana nuna bangaskiya da ayyuka; Rahamar Allah mai girma ce.",
  },
  {
    hadith: {
      excerpt:
        "Sa’a ba za ta zo ba, sai kun ga alamomi guda goma: hayaki, Dajjal, Dabba, fitowar rana daga yamma, gangarowar Isa dan Maryama, Yajuju da Ma’juj, zabtarewar kasa uku, da wata wuta wadda ke kai mutane zuwa ga taronsu.",
    },
    context:
      "Manyan alamomi guda goma, daga Huzaifa bn Usayd. Malamai suna tabbatar da kowace alamar amma sun bambanta akan ainihin jerin.",
  },
  {
    hadith: {
      excerpt:
        "Ina rantsuwa da wanda raina ke hannunSa, da dan Maryama zai sauka a cikinku yana mai adalci. zai karya giciye, ya kashe alade, ya shafe jiziya, kuma dukiya za ta cika har sai wani ya karbe ta.",
    },
    context:
      "Saukar Annabi Isa wani batu ne tabbatacce na aqidar Sunna; yana yin hukunci da shariar Muhammad ﷺ.",
  },
  {
    hadith: {
      excerpt:
        "Idan amana ta ɓace, to, ku yi jiran Sa'a. Sai aka ce: Ta yaya za a yi asara? Ya ce: Idan aka ba da mulki ga wanda bai cancanta ba.",
    },
    context:
      "Alamar ƙananan sanannun sanannun - asarar amana. Mai da hankali kan shiri, ba tsoro ba.",
  },
  {
    hadith: {
      excerpt:
        "Allah ba ya gusar da ilimi da kwacewa, sai dai da daukar malamai, har sai babu wanda ya saura, kuma mutane suka riki jahilai shugabanni masu yanke hukunci ba tare da ilimi ba, sai su bata suna batar da wasu.",
    },
    context:
      "'Rashin ilimi' yana nufin asarar ƙwararrun malamai da aikin rayuwa - ba ƙarancin bayanai ba.",
  },
  {
    hadith: {
      excerpt: "Aiki da ikhlasi yana da nauyi a Mizan.",
    },
    context: "Shirin Mizan mai nauyi",
  },
  {
    hadith: {
      excerpt: "Kyakkyawan hali yana da nauyi ƙwarai a ma'aunin mumini.",
    },
    context: "Mai nauyi a Mizan",
  },
  {
    hadith: {
      excerpt: "Zikiri mai sauƙi a harshe yana da nauyi a Mizan.",
    },
    context: "Mai nauyi a Mizan",
  },
];

export const LAST_DAY_VERSES_HA: DeepPartial<LastDayVerseEntry>[] = [
  {
    excerpt:
      "Kõwane rai mai ɗanɗanar mutuwa ne, kuma bã zã a cika ku ba fãce dãɗinku a Rãnar ¡iyãma. To, wanda aka nisantar daga wuta, kuma aka shigar da shi Aljanna, to, ya rabauta, kuma rãyuwar dũniya ba ta zama ba fãce jin dãɗin rũɗi.",
    context:
      "Mutuwa ta duniya ce kuma wannan rayuwa ta ɗan lokaci ce; hisãbi na gaskiya da na ƙarshe bã ya zuwa fãce a Rãnar Lãhira.",
    tafsirSummary:
      "Ayar ta sake bayyana nasara: ba dukiya ko matsayi a nan ba, sai dai tsira daga wuta kuma a shigar da shi Aljanna a can.",
  },
  {
    excerpt:
      "A rãnar nan, mutãne zã su fita ƙungiya-ƙungiya dabam-dabam, dõmin a nuna musu ayyukansu. To, wanda ya aikata gwargwadon nauyin zarra na alheri, zai gan shi, kuma wanda ya aikata nauyin zarra na sharri, zai gan shi.",
    context:
      "Cikakken adalci kuma cikakke - ƙaramin aiki, mai kyau ko mara kyau, ana rubuta shi kuma a mayar da shi ga mai yin sa.",
    tafsirSummary:
      "Babu wani abu da ya yi ƙanƙanta da za a ƙidaya. Wannan aya taka tsantsan ce ta tsawon rayuwa akan kawar da 'kananan' zunubai da kwarin gwiwa ga 'kananan' ayyuka nagari.",
  },
  {
    excerpt:
      "Kuma Mun sanya ma'auni na adalci ga Rãnar ¡iyãma, sabõda haka ba a zãluntar rai da kõme. Kuma kõ dã ya kasance nauyin ƙwãyar ƙyãma, zã Mu fitar da shi, kuma Mũ, Mũ, Mãsu lissafi ne.",
    context: "Mizan (Scale) gaskiya ne kuma adalcinsa cikakke ne.",
    tafsirSummary:
      "Kuma bãbu wani rai, a rãnar nan, da gwargwadon nauyin ƙwayar mustard. lissafin Allah bashi da aibi.",
  },
  {
    excerpt:
      "Amma wanda sikelinsa ya yi nauyi, to, yana a cikin rayuwa mai dadi. Kuma amma wanda ma'aunansa suka yi sauƙi, to, makõmarsa ta kasance a cikin rami.",
    context: "Sakamako na ƙarshe yana kunna nauyin ayyukan adalci na mutum akan Sikeli.",
    tafsirSummary:
      "Nauyi ya fito ne daga ikhlasi, ba ƙarar ƙaranci ba - zikiri mai sauƙi wanda aka ce zalla zai iya fin girman tsaunuka na ayyukan ban sha'awa.",
  },
  {
    excerpt:
      "Kuma ku yi gaugãwa zuwa ga gãfara daga Ubangijinku, da Aljanna fãɗinta kamar sammai da ƙasã, an yi tattalinta dõmin mãsu taƙawa.",
    context:
      "Umurni kai tsaye ga yin tsere zuwa ga alheri, kuma zuwa ga gafara a gabanin haduwa da Allah.",
    tafsirSummary:
      "Aljanna tana da girman da ba za ta yi hasashe ba, kuma hanyar da za ta kai gare ta ita ce gaugawa - ba a jinkirta tuba da ayyukan alheri ba.",
  },
  {
    excerpt: "Fuskõki a rãnar nan, zã su yi haske, sunã kallon Ubangijinsu.",
    context: "Mafi girman lada na Aljanna ba wani lambu ko kogi ba ne face ganin fuskar Allah.",
    tafsirSummary:
      "Ahlus Sunna sun tabbatar da cewa muminai za su ga Ubangijinsu a Lahira, ta hanyar da ta dace da daukakarSa, ba tare da kamanceceniya da halitta ba - rawanin ni'ima.",
  },
  {
    excerpt:
      "Kuma waɗanda suka kãfirta da Ubangijinsu suna da azãbar Jahannama, kuma tir da makoma.",
    context: "Jahannama sakamako ne na gaskiya da adalci - wurin zama na gaske, ba alama ba.",
    tafsirSummary:
      "Gargadi wata rahama ce da ake nufin mayar da mutum baya alhali da sauran lokaci; a koda yaushe yana haɗe a cikin Alƙur'ani tare da buɗe kofar tuba.",
  },
  {
    excerpt:
      "Ka ce: Ya ku bayiNa wadanda suka yi zalunci a kansu, kada ku yanke tsammani daga rahamar Allah. Lallai Allah yana gafarta zunubai baki daya. Lalle Shĩ, Shĩ ne Mai gãfara, Mai jin ƙai.",
    context: "Duk da girman zunubin, ƙofar tuba ta gaskiya a buɗe take har mutuwa.",
    tafsirSummary:
      "Shi kansa yanke yanke tsammani daga rahamar Allah daga Shaidan yake; mumini yana daidaita tsoron wuta da fata mara yankewa da gafarar Allah.",
  },
  {
    excerpt:
      "Kuma lalle ne Sa'a mai zuwa - babu shakka a cikinta - kuma lalle ne Allah Yana tayar da wadanda suke a cikin kaburbura.",
    context: "Tashin kiyama ya tabbata, duk da cewa lokacinsa yana boye.",
    tafsirSummary:
      "Tabbatacce game da Sa'a, haɗe tare da rashin tabbas game da lokacinta, shine ainihin abin da ke tabbatar da alhakin ɗabi'a a halin yanzu.",
  },
  {
    excerpt:
      "Wane ne wanda ke yin cẽto a wurinSa, fãce da izninSa? Yanã sanin abin da yake a gaba gare su da abin da yake a bãyansu, kuma bã su kẽwayẽwa daga ilminSa, fãce abin da Yake so.",
    context: "Ceto (shafa'ah) gaskiya ce amma ba ta barranta daga iznin Allah ba.",
    tafsirSummary:
      "Wannan sharadi guda - 'sai da izininsa' - shi ne yake raba ceto na gaskiya daga kowane fasadi nasa, kuma ya haramta kiran matattu a cikin rayuwar duniya.",
  },
  {
    excerpt:
      "Kuma kada ka yi zaton cewa Allah bai zama Mai gafala ba daga abin da azzalumai suke aikatãwa. Abin sani kawai Yanã jinkirtar da su zuwa ga wani yini da idãnu zã su yi firgita.",
    context: "Ta'aziyya ga wanda aka zalunta - jinkirin da aka yi na adalci ba shine rashinsa ba.",
    tafsirSummary:
      "Ba a manta zalunci a wurin Allah; Abin sani kawai anã yi wa azzãlumai jinkiri zuwa wani yini da bã a ƙetare haddi.",
  },
  {
    excerpt:
      "Kuma babu kowa a cikinku face ya je mata. Wancan, a kan Ubangijinka, wajabce ta tabbata. Sa'an nan kuma Mu tsĩrar da waɗanda suka bi Allah da taƙawa, kuma Mu bar azzãlumai a cikinsa gurfãne.",
    context: "Wucewa Siratu na duniya ne; rahmar Allah da takawa ta tabbata agareshi.",
    tafsirSummary:
      "Kowa ya zo wucewa; Bambanci shine wanda ya sami ceto da wanda ya fadi - yanke shawara ta bangaskiya da ayyukan da aka aiko gaba.",
  },
  {
    excerpt:
      'Sunã tambayar ka game da Sa\'a, "Yaushe ne makõmarta?" Ka ce: "Abin sani kawai, saninta a wurin Ubangijina yake." Bãbu mai bayyana lõkacinta fãce Shi. Bã zã ta zo muku ba fãce bisa ga tsammãni.',
    context:
      "Madaidaicin lokacin Allah ne kaɗai ya sani - al'amuran shirye-shirye, tsinkaya banza ce.",
    tafsirSummary:
      "Hatta Annabi SAW ba a ba shi kwanan wata ba; duk da'awar mutum na shekara ko kirgawa ya saba wa wannan ayar.",
  },
  {
    excerpt:
      "Amma wanda aka bai wa littafinsa a hannun damansa, sai ya ce: “To, ku karanta littafina! Na tabbata cewa zan hadu da asusuna. Don haka zai kasance a cikin rayuwa mai dadi.",
    context:
      "Yadda ake karɓar littafin mutum - hannun dama ko hagu - shine shi kansa hukunci na farko.",
    tafsirSummary:
      "Abin farin cikin masu nasara shine jin daɗin tabbataccen lada: sun rayu suna tsammanin hisabi, kuma yana zuwa da sauƙi, ba girgiza ba.",
  },
];

export const LAST_DAY_TIMELINE_HA: DeepPartial<LastDayTimelineEvent>[] = [
  {
    title: "Rayuwa a duniya",
    body: "Ƙayyadaddun lokaci don yin imani, bauta, da shiryawa. Wannan duniyar ba ita ce gida ta ƙarshe ba - filin ayyuka ne.",
  },
  {
    title: "Mutuwa",
    body: "Kowane rai mai ɗanɗanar mutuwa ne. Mumini ya riske shi da fatan rahamar Allah; rashin gafala yana sanya shi kwatsam da daci.",
  },
  {
    title: "Kabari",
    body: "Bayan an binne shi, rai ya shiga barzakh. Kabari shine matakin farko na Lahira ga kowane mutum.",
  },
  {
    title: "Barzakh",
    body: "Rayuwa tsakanin mutuwa da tashin matattu - tambayoyi, ni'ima, ko hukunci bisa ingantattun rahotanni.",
  },
  {
    title: "Ƙananan alamomi",
    body: "Sannu a hankali canje-canjen zamantakewa da ɗabi'a Manzon Allah ﷺ ya siffanta su. Malamai da yawa sun lura da yawa sun bayyana; ainihin lokaci na Allah ne Shi kaɗai.",
  },
  {
    title: "Manyan alamomi",
    body: "Abubuwa masu ban mamaki a kusa da ƙarshe - ciki har da al-Mahdi, Dajjal, da dawowar Annabi Isa (amincin Allah ya tabbata a gare shi) a cikin ingantaccen hadisi. Bayanan jeri sun bambanta tsakanin malamai.",
  },
  {
    title: "Kaho",
    body: "Israfil za ta busa ƙaho. Halittu tana mutuwa a busa ta farko kuma ana ta da ita a karo na biyu.",
  },
  {
    title: "Tashin Kiyama",
    body: "Jiki daga kura; dukkan talikai suna tsaye a gaban Allah.",
  },
  {
    title: "Taron (Mahshar)",
    body: "Dukan mutane sun taru ba takalmi, tsirara, da marasa kaciya - kamar yadda Allah ya so - suna jiran hukunci.",
  },
  {
    title: "Rubutun Ayyuka",
    body: "Littattafan da aka bayar a hannun dama, hagu, ko bayan baya. Babu wani abu da ya rage daga abin da aka rubuta.",
  },
  {
    title: "Mizan (Mizan)",
    body: "Ayyukan da aka auna da cikakken adalci. Ma'aunin nauyi yana kawo farin ciki; ma'aunin haske yana kawo hasara.",
  },
  {
    title: "Hisab (Hisab)",
    body: "Sauƙaƙan hisabi ga wasu; cikakken tambaya ga wasu. Ba a yin watsi da haƙƙin da ake bin mutane.",
  },
  {
    title: "Ceto (Shafa'ah)",
    body: "Da iznin Allah kawai - mafi girman na Annabi Muhammad ﷺ ne.",
  },
  {
    title: "Tafki (Hawd)",
    body: "Falo mai faffadar da al'ummar Manzon Allah Sallallahu Alaihi Wasallama ke sha daga gare shi ranar qiyama.",
  },
  {
    title: "Gadar (Sirat)",
    body: "Kowane mutum yana ketare wuta - gudun yana bambanta da imani da ayyuka a cikin ingantattun ruwayoyi.",
  },
  {
    title: "Aljanna ko wuta",
    body: "Wuri na har abada - Jannah da rahamar Allah da ayyukansa na qwarai; Jahannama a matsayin gargadi na gaskiya da sakamako kawai.",
  },
  {
    title: "Dawwama",
    body: "Babu mutuwa bayan Lahira. Mutanen Aljanna suna dawwama a cikin ni'ima. ’yan wuta suna dawwama kamar yadda Allah Ya so.",
  },
];

export const LAST_DAY_QUIZ_HA: DeepPartial<LastDayQuizQuestion>[] = [
  {
    prompt: "Imani da ranar lahira yana daga cikin:",
    options: [
      "Rukunnan Musulunci guda biyar",
      "Kassai shida na imani (Iman)",
      "Sammai bakwai",
      "Sahabbai goma",
    ],
    explanation:
      "Imani ya hada da imani da Allah, da Mala'iku, da Littattafai, da Manzanni, da Ranar Lahira, da kaddara (kadr).",
  },
  {
    prompt: "An fi siffanta Barzakh da cewa:",
    options: [
      "Gadar kan Jahannama",
      "Rayuwa tsakanin mutuwa da tashin matattu",
      "Ma'aunin ayyuka",
      "Busa ƙaho",
    ],
    explanation: "Barzakh shine tazara bayan mutuwa har zuwa tashin kiyama.",
  },
  {
    prompt:
      "Gaskiya ko karya: Malamai sun yi ittifaqi a kan ainihin jerin dukkan manyan alamomin Sa’a.",
    options: ["Gaskiya", "Karya"],
    explanation:
      "Manyan alamomi sun tabbata a cikin ingantaccen hadisi, amma malamai sun yi sabani a kan wasu bayanan da aka jera. Allah kawai Ya san lokacin Sa'a.",
  },
  {
    prompt: "Mizan (ma'auni) a ranar lahira yana nufin:",
    options: [
      "Auna jikin jiki",
      "Yin auna ayyuka da cikakken adalci",
      "Aunawa lokaci a cikin kabari",
      "Kidayar mala'iku",
    ],
    explanation: "Mizan yana auna ayyuka - ikhlasi da aiki na gaskiya suna sa ma'auni yayi nauyi.",
  },
  {
    prompt: "Ceto (shafa'ah) a Ranar Lahira.",
    options: [
      "Yana faruwa ba tare da izinin Allah ba",
      "Abin sani kawai da iznin Allah",
      "Yana maye gurbin buƙatar bangaskiya",
      "An musanta a cikin Alkur'ani",
    ],
    explanation: "Alkur'ani 2:255 da 20:109 sun tabbatar da ceto da iznin Allah kawai.",
  },
  {
    prompt: "Wanne ya zo na farko a tafiyar Lahira?",
    options: ["Tashin Kiyama", "Mutuwa", "Taro", "Kaho"],
    explanation:
      "Mutuwa ta gabaci Barzakh, sannan -bayan alamomi da busa - tashin matattu da taro.",
  },
  {
    prompt: "Wace dabi'a za ku karfafa a wannan makon don yin shiri don saduwa da Allah?",
    explanation:
      "Shiri a aikace: sallah, alqur'ani, tuba, sadaka, kyakykyawan dabi'a, da biyan hakkin wasu.",
  },
  {
    prompt: "Gaskiya ko karya: A cewar Kur'ani 19:71, kowane mutum zai haye kan Sirat.",
    options: ["Gaskiya", "Karya"],
    explanation:
      "Ayar ta ce duk za su wuce ta; Allah yana tsĩrar da masu hankali. Malamai sun tattauna cikakken bayani kan wanda ya fadi.",
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

export const LAST_DAY_REFERENCES_HA: DeepPartial<LastDayReferenceEntry>[] = [
  {
    title: "Alqur'ani",
    note: "Tushen farko na tashin matattu, hisabi, Aljanna, wuta, da adalcin Allah. An kawo ayoyi a cikin wannan manhajja ta surah da ayah.",
  },
  {
    title: "Sahihul Bukhari & Sahih Musulmi",
    note: "Tarin Hadisai na Mutuwa, Kabari, Alamu, Hisabi, Ceto, Hawd, da Sirat.",
  },
  {
    title: "Sunan Tirmidhi & Sunan Abi Dawud",
    note: "Ƙarin ingantattun rahotanni kan kabari da ƙananan alamomi - maki da aka lura a inda ya dace.",
  },
  {
    title: "Ibn Kathir - Tafsir",
    note: "Tafsirin gargajiya akan ayoyin Alqur'ani game da Lahira. An yi amfani da shi don taƙaitaccen tafsiri, ba a matsayin hujja mai zaman kanta ba.",
  },
  {
    title: "Al-Aqidah al-Tahawiyyah",
    note: "Aqidar Ahlus-Sunnah ta asasi tana tabbatar da tashin qiyama, sikeli, gada, Aljanna, da wuta.",
  },
  {
    title: "Bambance-bambancen ilimi",
    note: "Inda malamai suka bambanta - misali. jerin manyan alamomi, cikakkun bayanai na Hawd, nau'ikan shiga ba tare da ƙididdigewa ba - wannan rukunin yana lura da bambanci ba tare da da'awar ra'ayi ɗaya kawai ba.",
  },
  {
    title: "Wahayi vs. fassarar",
    note: "Qur'ani bayyananne da mutawatiri ko hadisi sahihi sun bambanta da ra'ayoyin tawili (ijtihadi) da ruwayoyi masu rauni.",
  },
];
