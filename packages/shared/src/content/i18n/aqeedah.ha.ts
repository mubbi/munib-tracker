// Hausa translation overlay for the Learn Aqeedah content. Mirrors the order of
// its English source in ../aqeedah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { AqeedahGlossaryTerm, AqeedahTopic } from "../../types/aqeedah";
import type { DeepPartial } from "./localize";

export const AQEDAH_TOPICS_HA: DeepPartial<AqeedahTopic>[] = [
  {
    title: "Gabatarwa",
    summary: "Aqida ita ce ginshikin imani da ke siffanta ibada da xabi’a da manufa.",
    body: [
      "Kalmar aqidah (عقيدة) ta fito ne daga tushen ma'anar daurewa ko daurewa dagewa - ita ce tsarin akidar da musulmi ya yi riko da ita da yakini cewa zuciya ta daure da su, ba tare da shakku ba. A cikin shahararren Hadisin Jibrilu, Annabi SAW ya taqaita shi da imani guda shida: ga Allah, da Mala’ikunSa, da LittattafanSa, da ManzanninSa, da Ranar Lahira, da qaddara (qadr), alherinta da xacinta.",
      "Domin Ahlul Sunna wal-Jama'ah - babbar kungiyar Musulmi Ahlus-Sunnah - an fara daukar akida daga Alkur'ani, sannan ingantacciyar Sunna, ana fahimtar ta a tafarkin Sahabban Annabi da na farko (salaf). Inda aka yi amfani da hankali, yana hidimar wahayi ne maimakon tauye shi.",
      "Aqeedah ba batu ne na taron karawa juna sani ba; shi ne tushen da dukkan ibada da halaye suke tasowa daga gare shi. Imani da mutum game da wane ne Allah, dalilin da ya sa aka halicce su, da kuma inda aka dosa a natse, suna nuna yadda suke addu’a, yadda suke bi da wasu, da yadda suke fuskantar wahala da mutuwa.",
      "Ingantacciyar imani yana sanya zuciya ta daidaita tsakanin manya-manyan jahohin ibada - soyayya da tsoro, bege da tsoro, tawakkali da kokari, godiya da tuba - ta yadda mumini ba zai yanke kauna daga rahamar Allah ba, ko kuma ya samu amintuwa daga hisabi.",
    ],
    quran: [
      {
        excerpt:
          "Adalci shi ne wanda ya yi imani da Allah, da Ranar Lahira, da Mala’iku, da Littafi, da Annabawa…",
      },
      {
        excerpt:
          "Ya ku waxanda suka yi imani, ku yi imani da Allah, da ManzonSa, da Littafin da Ya saukar a kan ManzonSa, da Littafin da Ya saukar daga gabani.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Imani shi ne ka yi imani da Allah, da Mala’ikunSa, da LittattafanSa, da ManzanninSa, da Ranar Lahira, da yin imani da kaddarawar Ubangiji, mai kyaunta da daci. (Hadisin Jibril Umar ne ya ruwaito shi).",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Menene Aqeedah?",
    summary: "Aqida ba ajin Falsafa ba ce; imani ne mai rai wanda ya samo asali daga wahayi.",
    body: [
      "Aqida ita ce abin da zuciya ta tabbatar da yaqini sannan kuma abin da yake nunawa a cikin ibada da xa'a - ba wai kawai ka'idar da aka haddace don yin muhawara ba. Alkur'ani ya siffanta muminai tabbatattu a matsayin wadanda suka ce game da wahayi, 'Mun yi imani da shi; dukkansa daga Ubangijinmu yake.” (3:7): Suna sallamawa ga abin da yake bayyananne, kuma suna jingina gaibi ga Allah.",
      "Malamai na farko sun rubuta takaitattun nassoshi na aqida (irin su al-Aqidah al-Tahawiyya) dai dai don kiyaye wannan fayyace –domin kare talakawan muminai daga haxari guda biyu: wuce gona da iri da ke qara wa addini, da inkarin kore abin da Allah ya tabbatar.",
      "A cikin Ahlul Sunna akwai sanannun mazhabobin tauhidi - musamman ma hanyoyin Athari, Ash'ari, da Maturidi - wadanda suka yi ittifaqi gaba daya a kan muhimman abubuwan imani yayin da suka sha bamban da wasu hanyoyin fasaha na bayyana wasu al'amura, musamman ma sifofin Ubangiji. Tushensu guda daya ne tabbatacce: kadaita Allah cikakkiya, da gaskiyar wahayinSa, da hisabi na hakika a Lahira.",
      "Don haka an fi koyan aqida a matsayin imani mai rai: kowane batu na akida yana da alaka da hanyar ibada, da dabi’a, da samun nutsuwa.",
    ],
    quran: [
      {
        excerpt:
          'Kuma waɗanda suka tabbata a cikin ilmi suka ce: "Mun yi ĩmãni da shi." Dukansa daga Ubangijinmu yake.',
      },
    ],
    actions: [
      "Koyi aqida daga ingantattun malamai da nassosi na farko, ba daga mahawara ta social media ba.",
      "Ga kowane imani da kuka yi nazari, tambaya: ta yaya wannan ke canza yadda nake bauta da rayuwa?",
    ],
  },
  {
    title: "Me yasa Aqeedah ke da matsala",
    summary:
      "Sahihanci mai kyau yana ba da kwanciyar hankali na ruhaniya kuma yana karewa daga wuce gona da iri.",
    body: [
      "Idan imani ya tabbata kuma ya tabbata, ayyuka sun zama na gaskiya kuma su tabbata; lokacin da imani ya girgiza, ibada takan zama marar tsayayye, kawai ta raini, ko kuma cikin sauƙi ta girgiza da sha'awa da shakku. Allah ya yi alƙawarin cewa ‘ya tabbatar da waɗanda suka yi imani da magana tabbatacciya’—a cikin duniya da kuma a lokacin kabari da Lahira mai ban tsoro.",
      "Ita kuma aqida ingantacciya ita ce wacce take xauke da mumini ta tsawon rayuwa: tana karantar da masu haquri da dogaro da hukuncin Allah a cikin tsanani, da qanqan da kai cikin ni'ima, da nutsuwar yaqini wajen fuskantar rashin tabbas da mutuwa. Mutumin da ya yi imani da kadar da lahira da gaske ba ya rugujewa idan an jarraba shi.",
      "A karshe, aqida ingantacciya tana karantar da adab - kyakykyawan hali - cikin sabani: riko da tabbatattu a fili tare da nuna girmamawa da kamun kai a cikin al'amura na biyu da malamai na gaskiya suka dade da sabani. Ilimin akida ya kamata ya kara tawali'u da jin kai, kada ya zama girman kai.",
    ],
    quran: [
      {
        excerpt:
          "Kuma Allah Yanã tabbatar da waɗanda suka yi ĩmãni da magana tabbatacciya a cikin rãyuwar dũniya da Lãhira.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ka yi kwadayin abin da zai amfane ka, ka nemi taimako a wurin Allah, kuma kada ka kasance mai tawaya… (Abu Huraira).",
      },
    ],
  },
  {
    title: "Kasidu Shida na Imani",
    summary: "Annabi ﷺ ya taqaita imani da aqidu guda shida.",
    body: [
      "Makaloli shida sun zo ne daga Hadisin Jibrilu, daya daga cikin hadisai muhimmai a Musulunci. Mala'ika Jibrilu ya zo a siffar mutum ya tambayi Annabi SAW a gaban Sahabbai game da Musulunci da Imani da ihsani. Da ya tambayi Imani, Annabi SAW ya amsa da wadannan aqidu guda shida – sai Jibrilu ya tabbatar da shi, sannan ya tafi, bayan ya zo ya koya wa mutane addininsu.",
      "Siddan su ne: Imani da Allah; a cikin mala'ikunSa; a cikin littafanSa da aka saukar; a cikin manzanninSa; a Ranar Lahira; kuma a cikin kaddara (kadri) mai kyaunta da daci. ƙin ko ɗaya daga cikinsu shi ne faɗuwa a wajen Imani na gaskiya, domin su ƙyalle ɗaya ne.",
      "Hakanan suna da alaƙa mai zurfi. Imani da littattafai da manzanni yana kaiwa ga sanin ranar lahira da hisabi; Imani da Ranar Lahira yana sanya nauyi ga kowane aiki; kuma imani da kadar yana karantar da tawakkali ga Allah da tawakkali a gaban hikimarsa. Koyan su cikin tsari yana gina ra'ayi mai ma'ana da daidaito a duniya.",
    ],
    hadith: [
      {
        excerpt:
          "…Domin ku yi imani da Allah, da Mala’ikunSa, da LittattafanSa, da ManzanninSa, da Ranar Lahira, kuma ku yi imani da hukunci da alherinsa da daci. (Hadisin Jibrilu)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Imani da Allah",
    summary:
      "Imani da Allah ya kebanta da Ubangijinsa, da haqqinsa na ibada, da sunayenSa da sifofinSa.",
    body: [
      "Imani da Allah shi ne mafi girman dukkan imani da tushen saura. Ya fara da tabbata cewa Shi kaɗai ne Mahalicci, Mamallaki, kuma Mai ɗorewa ga kowane abu - Allah ɗaya na gaskiya, ba shi da abokin tarayya, ba daidai ba, kuma ba ya bukatar wani daga cikin halittunsa.",
      "Ta haka ne shi kadai ya cancanci bauta ta kowace fuska: addu’a, addu’a, bege, tsoro, tawakkali, soyayya a ma’anarta mafi girma, sadaukarwa, da bakance dukkan hakkokin Allah ne wanda ba ya nufin waninSa. Wannan ita ce ma'anar shaidar 'babu abin bautawa face Allah.'",
      "Ahlus Sunna sun tabbatar da kyawawan sunaye da sifofin madaukaka waxanda Allah ya tabbatar wa kansa, kuma Manzonsa SAW ya tabbatar masa, ta hanyar da ta dace da xaukakarsa – ba tare da kamanta shi da halittarsa ​​(tamthil) ba, ba tare da inkarin ko vata sifofinsa na ma’anarsa (ta’til). Ayar da take shiryarwa ita ce: 'Babu wani abu kamarsa, kuma Shi ne Mai ji, Mai gani' (42:11) - wanda duka biyun suka qaryata kamanni, kuma suna tabbatar da jinSa da ganinSa.",
      "Sanin Allah da sunayenSa –Mai jin ƙai, Masani, Mai Rayayye, Sarki, Mai gafara—abinci ne na zuciya: gwargwadon saninsa, gwargwadon yadda kuke so, da jin tsoro, kuma ku tuba zuwa gare shi.",
    ],
    quran: [
      {
        excerpt:
          'Ka ce: "Shi ne Allah Makaɗaici... bã Ya haihuwa, kuma bã a haife shi, kuma bãbu wani misãli a gare Shi."',
      },
      {
        excerpt: "Kuma ga Allah akwai mafifitan sunaye, sai ku yi kira da su.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Imani da Mala'iku",
    summary: "Mala'iku suna girmama bayin Allah gaibi wadanda ba su saba masa ba.",
    body: [
      "Mala'iku (mala'ika) halitta ce mai girman gaske da aka yi daga haske. Ba su da 'yancin yin saɓawa: suna bauta wa Allah dawwama kuma suna aiwatar da kowane umurni nasa daidai, 'ba sa saba wa Allah a cikin abin da ya umarce su, kuma suna aikata abin da aka umarce su.'",
      "Yin imani da su shine gaskata cewa duniyar gaibu ta gaske ce kuma tana aiki a kusa da mu. Mala'iku suna yin wahayi, suna tsare mutane, suna rubuta kowace magana da aiki, suna karɓar rayuka a lokacin mutuwa, kuma suna tafiyar da al'amuran ƙasa da sammai da iznin Allah - don haka mumini ba ya zama shi kaɗai, kuma ba a gani.",
      "Wasu sunaye a cikin matani masu takamaiman matsayi: Jibrilu, mala'ikan wahayi; Mika’il, wanda aka ba wa amanar ruwan sama da wadata; Israfil, wanda zai busa ƙaho; Malak al-Mawt, mala'ikan mutuwa; da manyan malamai (Kiraman Katibin) masu rubuta ayyukan kowane mutum. Munkar da Nakir suna tambayar marigayin a cikin kabari.",
    ],
    quran: [
      {
        excerpt:
          "A cikinsa akwai mala'iku masu tsanani da tsanani, ba sa saba wa Allah a cikin abin da Ya yi umurni da su, kuma suna aikata abin da aka umarce su.",
      },
      {
        excerpt:
          'Ka ce: "Wanda ya kasance maƙiyi ga Jibrilu, to, lalle ne ya saukar da shi a kan zũciyarku, da iznin Allah."',
      },
    ],
    actions: ["Rayuwa tare da sanin cewa mala'iku masu rikodin ba su rasa kalma ko aiki ba."],
  },
  {
    title: "Imani da Littattafan Ubangiji",
    summary:
      "Allah Ya saukar da littattafai a matsayin shiriya; Alkur'ani ya tabbatar da su kuma ya tsaya a matsayin ma'auni na karshe.",
    body: [
      "Musulmai sun yi imani cewa Allah ya saukar da litattafai ga manzanninsa a matsayin shiriya da rahama. Kur'ani ya ambaci sunayen da dama: Suhuf na Ibrahim da Musa, da Tauhidi da aka bai wa Musa, da Zabur ga Dawud, da Injila ga Isa, da kuma a karshe Kur'ani ga Muhammadu ﷺ - sun yi imani gaba daya, a cikin siffa ta asali.",
      "Kur'ani yana da matsayi na musamman. Shi ne wahayi na ƙarshe, wanda aka aiko da ‘tabbatar da abin da ke gabansa, kuma a matsayin ma’auni a kansa’ (5:48) — ma’ana yana yin hukunci kuma yana gyarawa, tun da nassosin da suka gabata ba su kasance cikin yanayinsu na asali ba amma an canza su (tahrif) kuma sun ɓace a kan tsararraki.",
      'Musamman a cikin dukkan nassosi, Kur\'ani yana da kariya daga Allahntaka daga ɓarna: "Lalle ne, Mun saukar da Ambato, kuma Mu ne Majiɓintansa" (15:9). Don haka imani da littafai yana nufin girmama wahayi, karatun kur’ani da tunani, da mika wuya ga shiriyarsa a rayuwa.',
    ],
    quran: [
      {
        excerpt:
          "Kuma Muka saukar da Littãfi zuwa gare ka da gaskiya, yana mai gaskatãwa ga abin da yake a gabãninsa na Littãfi, kuma da rarrabẽwa a kansa.",
      },
      {
        excerpt: "Lalle Mũ ne Muka saukar da Ambato, kuma lalle Mũ, Mũ ne MajiɓintanSa.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Imani da Annabawa",
    summary: "Dukan annabawa sun ba da gaskiya guda ɗaya; Muhammad ﷺ shine manzon karshe.",
    body: [
      "Musulmi ya yi imani da dukkan annabawa da manzannin da Allah ya aiko, ba ya kore kowa daga cikinsu. Daga Adamu ta hanyar Nuhu, Ibrahim, Musa, da Isa har zuwa Muhammadu s.a.w, duk sun yi kira zuwa ga sako guda daya: Ku bauta wa Allah Shi kadai, kuma ku yi rayuwa ta gaskiya. Ashirin da biyar suna cikin Alkur'ani; Allah ne kaɗai Ya san adadinsu.",
      "Annabawa su ne mafificin halitta cikin gaskiya da rikon amana, Allah ya kiyaye su daga yin qarya game da saqo da manyan zunubai – amma duk da haka sun kasance mutane ne ba na Ubangiji ba, kuma ba za a bauta musu ba. An keɓance guda biyar a matsayin ‘ƙaƙƙarfan’ manzanni (ulu al-’azm): Nuhu, Ibrahim, Musa, Isa, da Muhammad ﷺ.",
      "Muhammadu ﷺ shine hatimin Annabawa (khatam an-nabiyyin): babu wani Annabi da zai zo bayansa, kuma sakonsa na duniya ne – wanda aka aiko shi zuwa ga dukkan bil’adama har zuwa ranar sakamako. Yin imani da shi ya haɗa da ƙaunarsa, yin biyayya da dokokinsa, gaskata rahotanninsa, da kuma bauta wa hanyar da ya koyar kawai.",
    ],
    quran: [
      {
        excerpt: "...Ba mu rarrabewa tsakanin daya daga manzanninSa...",
      },
      {
        excerpt:
          "Muhammadu bai zama uban kõwa ba daga mazajenku, kuma amma Manzon Allah ne kuma cikon annabãwa.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Imani da Ranar Lahira",
    summary:
      "Rayuwa tana kaiwa ga saduwa ta ƙarshe da Allah, cikakkiyar adalci, da sakamako na har abada.",
    body: [
      "Imani da ranar lahira shi ne imani da duk abin da ya biyo bayan mutuwa: tambaya da rayuwar kabari (barzakh), da busa kaho, da tayar da mutane baki daya, da babban taro, da hisabi, da ma'aunin ayyuka a ma'auni, da hayewar gada, da matsuguni guda biyu na dawwama - Aljanna da wuta.",
      'Wannan imani yana ba da nauyin ɗabi\'a ga kowane lokaci. Domin Allah yana ganin boye kuma yana rubuta mafi kankantar aiki, babu wani abu mai kyau da ba a tozarta shi, kuma ba a manta da wani mummuna: "Wanda ya aikata nauyin kwayar zarra na alheri zai gan shi, kuma wanda ya aikata nauyin kwayar zarra na sharri zai gan shi."',
      "Ahlus Sunna sun tabbatar da dukkan wadannan haqiqanin haqiqanin gaskiya, tare da gaskata su daidai da yadda aka ruwaito su, tare da yarda da cewa malamai sun yi savani wajen tafsirin wasu filla-filla na zahiri da alamomi. Batun imani ba hasashe bane amma shiri.",
    ],
    quran: [
      {
        excerpt:
          "…To wanda ya aikata gwargwadon nauyin zarra na alheri zai gan shi, kuma wanda ya aikata nauyin zarra na sharri zai gan shi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Imani da Qadr (Dokar Ubangiji)",
    summary:
      "Ilimin Allah da kaddarawarsa cikakke ne - duk da haka mutane suna zaɓe kuma suna da hisabi.",
    body: [
      "Imani da kadar ana yawan taqaita shi ne a matakai hudu: cewa Allah madawwami ne ga dukkan komai; cewa ya rubuta su duka a cikin Allunan Kiyaye shekaru dubu hamsin kafin halitta; cewa babu wani abu da ke faruwa face da izninSa; kuma Shi ne Mahaliccin dukkan abin da ya kasance, har da ayyukan bayinsa.",
      "Haka nan, ’yan Adam suna da ainihin nufi da zaɓe na gaske cikin abin da Allah Ya ƙyale - shi ya sa umarni da hani da lada da azaba suke da adalci da ma’ana. Mutum ya zaɓi ya yi addu’a ko ya yi ƙarya, kuma an yi masa alhakin daidai; Ilimin da Allah ya riga ya sani na zabi ba ya tilastawa.",
      "Ahlus Sunna suna tafiyar da kurakurai guda biyu: karyata hukuncin (kamar abin da ya faru ya kubuta daga ilmin Allah da iradarSa), da kisa (ta hanyar yin amfani da hukuncin soke alhakin dan Adam da uzuri). Mumini ya riƙi hanya da kyau, sa'an nan kuma ya dõgara ga Allah sakamako.",
      "A zahiri, kadar ita ce mabubbugar aminci mai girma: bayan ka yi aikinka, ka natsu da sanin cewa duk abin da ya kai ka ba zai taba kewarka ba, kuma duk abin da ya rasa ba za ka taba isa gare ka ba.",
    ],
    hadith: [
      {
        excerpt:
          "...Idan wani abu ya same ku, kada ku ce 'da na aikata haka', a'a ku ce 'Allah ne ya hukunta, kuma ya aikata abin da Yake so' - domin 'idan da' ya bude kofar Shaidan. (Abu Huraira)",
      },
    ],
    quran: [
      {
        excerpt: "Lalle Mũ, Mun halitta kõme a kan gwargwado.",
      },
      {
        excerpt:
          "Lalle ne, Allah bã Ya canja abin da yake ga mutãne sai sun musanya abin da yake a cikin ransu.",
      },
    ],
    misconceptions: [
      "Kuskure: Idan an hukunta komai, ƙoƙari ba shi da ma'ana. Gyara: Musulunci ya yi umarni da ƙoƙari, tsarawa, addu'a, da kuma tuba - ɗaukar hanyoyin da kansa wani ɓangare ne na hukunci.",
      "Ra'ayi: Kadr yana nufin Allah ne laifin zunubi na. Gyara: Bawa ya zaɓa kuma yana da hisabi; hukuncin bai zama uzuri ba ga rashin biyayya.",
      "Kuskure: Wahala ta tabbatar da cewa Allah bai yarda da ni ba. Gyara: Gwaji na iya zama tsarkakewa, ɗaukaka a matsayi, faɗakarwa, ko kiran dawowa - yawanci alamar kulawa, ba fushi ba.",
    ],
    actions: [
      "Ku yi aiki da kyau, sa'an nan kuma ku dõgara ga umurnin Allah.",
      "Maye gurbin 'idan kawai…' nadama madaukai da 'Qaddar Allah' da ingantaccen mataki na gaba.",
    ],
  },
  {
    title: "Tauhidi ya bayyana",
    summary: "Tauhidi ya hada UbangijinSa, da haqqinsa na ibada, da sunayenSa da sifofinSa.",
    body: [
      "Tauhidi (توحيد) - kadaita Allah - ita ce zuciyar Musulunci kuma sakon kowane Annabi. Yana nufin kebanta Allah shi kadai a cikin dukkan abin da ya kebanta da shi, da tabbatar da kamalarSa kamar yadda ya siffanta kansa.",
      "Malamai sukan koyar da tauhidi ta fuskoki guda uku masu alaƙa don samun sauƙin fahimta da kariya. Tauhidi Rububiyyah: Allah ne kadai ya halitta, ya mallaka, kuma yake sarrafa komai. Tauhidi Uluhiyyah: cewa Allah Shi kadai ya cancanci a bauta masa - wannan ita ce bangaren da manzanni suka fi jaddadawa da kafirai. Tauhidi Asma'u Sifat: Tabbatar da sunayen Allah da sifofinsa kamar yadda aka saukar, ba tare da murdiya, ko inkari, ko kamanceceniya ba.",
      "Wannan tsarin kashi uku kayan aikin koyarwa ne, ba tushen rarraba ba; manufarsa ita ce ta taimaki mumini kiyaye ikhlasi da sanin inda za a iya warware kadaitaka. An kama shi gabaɗaya a cikin addu'ar buɗe addu'ar kowane musulmi: \"Kai kaɗai muke bauta wa, kuma kai kaɗai muke neman taimako.\"",
      "Hankali mai mahimmanci: yarda da cewa Allah shi ne mahalicci (rububiyyah) bai wadatar da kansa ba. Yawancin waɗanda suka ƙaryata annabawa har yanzu sun yarda cewa Allah ya halicci sammai da ƙasa - abin da suka ƙi shi ne su bauta masa shi kaɗai (uluhiyyah). An tabbatar da tauhidi na gaske a cikin ibada, ba kawai a kan imani game da asali ba.",
    ],
    quran: [
      {
        excerpt: "Kai kadai muke bautawa, kuma Kai kadai muke neman taimako.",
      },
      {
        excerpt: "Allah bãbu abin bautãwa fãce Shi. Shi ne da mafi kyaun sunaye.",
      },
    ],
    misconceptions: [
      "Rashin fahimta: Tauhidi yana faɗin jimla ɗaya kawai. Gyara: Imani ne na zuciya, magana ce ta harshe, da hakikanin rayuwa cikin ibada.",
      "Kuskure: Imani da Allah shi ne mahalicci dukkan tauhidi ne. Gyara: Hatta kafirai da yawa sun tabbatar da cewa - jarrabawa ita ce bautar Allah Shi kadai.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shirka Yayi Bayani",
    summary: "Shirka ita ce ke jagorantar duk wani hakki na Allah zuwa ga waninSa.",
    body: [
      "Shirka (شرك) — shirka da Allah – kishiyar tauhidi ce kuma wanda ya yi zunubi Alkur’ani ya kebanta da cewa ba za a gafarta masa ba idan mutum ya mutu a kansa ba tare da tuba ba: “Allah ba Ya gafartawa a yi shirka da shi, amma yana gafarta abin da bai kai wannan ba ga wanda Yake so.",
      "Babbar shirka (al-shirk al-akbar) ita ce shiryar da wata ibada ga wanin Allah - kiran matattu ko wanda ba ya nan a kan abin da Allah kadai ke iya bayarwa, ko sadaukarwa ko ba da alwashi ga halittu, ko son wani abu da biyayya kamar yadda ya kamata mutum ya so da biyayya ga Allah. Yana fitar da mutum a wajen Musulunci idan sun mutu akansa bai tuba ba.",
      "Karamar shirka (al-shirk al-asghar) ba ta fita daga Musulunci amma tana da hatsarin gaske kuma tana iya soke ladan ayyuka. Mafi bayyanan siffarta ita ce riya - yin ibadar da mutane za su gani da yabo - wanda Annabi SAW ya kira abin da ya fi tsoro ga al'ummarsa. Rantsuwa da wanin Allah tafarki maxaukaki ya faxa a nan ma.",
      "Ahlus Sunna sun yi taka tsantsan da harshe da hukunci: gargadi ga shirka gaba daya yana da muhimmanci kuma bayyananne, amma ayyana wani mutum a matsayin mushriki ko kafiri (takfir) lamari ne mai nauyi da ke bukatar ilimi, da kwararan hujjoji, da kawar da uzuri - ya kasance na kwararrun malamai ne, ba na talakawan kasa ba ne ko hujja ta yanar gizo.",
    ],
    quran: [
      {
        excerpt:
          "Lalle ne, Allah bã Ya gãfarta yin shirka da Shi, kuma amma Yanã gãfarta abin da bai kai haka ba ga wanda Yake so.",
      },
      {
        excerpt:
          "Ya kai dana kada ka yi shirka da Allah. Lallai tarayya zalunci ne mai girma (zulm).",
      },
    ],
    hadith: [
      {
        excerpt:
          "Abin da na fi tsoratar da ku shi ne karamar shirka. An tambaye shi menene, sai ya ce: riya (riya). (Mahmud bin Labid)",
      },
    ],
    misconceptions: [
      "Kuskure: Duk zamewar harshe shirka ce babba. Gyara: Malamai sun bambanta babba da ƙanana kuma suna yin hukunci a hankali tare da shaida.",
      "Kuskure: Gargadi game da shirka yana bukatar tsangwama ga mutane. Gyara: Hanyar annabci ta haɗa haske da gaskiya tare da jinƙai da koyarwar haƙuri.",
    ],
  },
  {
    title: "Ikhlasi (Ikhlas)",
    summary: "Ana karbar ayyuka ne kawai idan aka yi don Allah kawai.",
    body: [
      "Ikhlas (إخلاص) ita ce neman yardar Allah kawai ta hanyar aiki - ba matsayi, yabo, dukiya, ko tasiri akan mutane ba. Shi ne sharadi na ciki wanda yarda da kowane aiki ya dogara a kansa: Annabi SAW ya koyar da cewa 'ayyuka ba su kasance ba sai da niyya, kuma kowane mutum yana da abin da ya yi niyya ne kawai.'",
      "Domin lada ya rataya ne a kan niyya, karamin aiki na shiru da aka yi da gaske don Allah zai iya fin girman babban aikin da aka yi a bainar jama'a don suna. Irin wannan aikin na waje - bada sadaka, addu'a, koyarwa - na iya zama ibada ko fanko dangane da zuciyar da ke bayansa.",
      "Ba a samun ikhlasi sau ɗaya amma ana sabunta su akai-akai, domin kai yana da saurin neman kulawa. Don haka muminai sukan tsarkake niyyarsu da rokon Allah ya kare su daga boyayyun shirkar riya da yaudarar kai.",
    ],
    quran: [
      {
        excerpt:
          "Kuma ba a umurce su ba, face su bauta wa Allah, suna masu tsarkake addini gare Shi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ayyuka kawai bisa niyya ne, kuma kowane mutum zai sami abin da ya yi niyya ne kawai. (Umar ibn al-Khattab)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Soyayya da Tsoron Allah",
    summary: "Kyakkyawar zuciya tana bautawa Allah akan fikafikan so, bege, da tsoro mai girma.",
    body: [
      "Ibadar zuciya tana kan manyan jahohi guda uku: soyayya (mahabbah), bege (raja'), da tsoro mai girma (khawf). Ƙaunar Allah ita ce ginshiƙi da ƙarfi na dukkan ibada – muminai sun ‘fi qarfin son Allah’ fiye da kowane abu – alhali kuma tsoron rashin yardarsa ya kan kame rai daga zunubi da gafala.",
      'Ahlus Sunna suna karantar da cewa dole ne wadannan su tsaya a daidaita, kamar tsuntsu mai tashi da fukafukai biyu da kai. Ƙauna da bege ba tare da tsoro ba na iya shiga cikin rashin kulawa da ɗaukar rahamar Allah a banza; tsoro ba tare da bege ba na iya rushewa cikin yanke kauna. Alkur\'ani ya hada su da cewa: "Ku kiraye Shi a kan tsoro da bege."',
      "Wannan ma'auni ba ji kawai ba ne; tana bayyana a aikace – wajen kiyaye sallah, da gaggawar tuba, da hidima ga wasu, da hani da fushi, da kuma haquri cikin wahala domin soyayya ga wanda ya hukunta ta.",
    ],
    quran: [
      {
        excerpt: "Amma wadanda suka yi imani sun fi tsananin son Allah.",
      },
      {
        excerpt:
          "…Kuma ku kirãye Shi a kan tsõro da tsammãni. Lallai rahamar Allah makusanciya ce ga masu kyautatawa.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Fata da Tuba",
    summary:
      "Babu wani zunubi da ya kai girman tuba na gaskiya da fatan samun rahamar Allah mai girma.",
    body: [
      "Ma’anar akidar Ahlul-Sunnah ita ce, kada mutum ya yanke kauna daga rahamar Allah, komai girman zunubansa, kuma kada ya taba samun amintuwa daga hisabinsa, komai yawan ayyukansu na alheri. Dukansu bege da gyaran kai suna ci gaba da gudana cikin rayuwar mumini.",
      "Gayyatar Allah mai karamci ce: 'Ka ce: Ya ku bayiNa wadanda suka yi zalunci a kansu, kada ku yanke tsammani daga rahamar Allah. Lallai Allah yana gafarta zunubai baki daya. Ƙofar tuba (tawbah) tana buɗewa har sai rana ta fito daga yamma ko kuma mutuwar mutum ta gabato.",
      "Tuba ta gaskiya tana da fayyace sharuddan: barin zunubin nan da nan, da nadamarsa ta gaske, da tsai da shawarar ba za ta sake dawowa ba - kuma, inda zunubin ya ƙunshi haƙƙin wani, maido da waɗannan haƙƙoƙin ko neman gafarar su. Idan aka hadu da wadannan, amsawar Allah ba kawai karbuwa ba ce, sai dai farin ciki: Ya ‘fi jin dadin tuban bawansa’ fiye da mutumin da ya kwato dutsen da ya bace da guzurinsa a cikin sahara bakarara.",
    ],
    quran: [
      {
        excerpt:
          "Ka ce: Ya ku bayiNa wadanda suka yi zalunci a kansu, kada ku yanke tsammani daga rahamar Allah. Lallai Allah yana gafarta zunubai baki daya.",
      },
      {
        excerpt: "Ya ku wadanda suka yi imani ku tuba zuwa ga Allah da tuba na gaskiya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah Ya fi jin daɗin tuban bawanSa fiye da wanda ya yi hasarar dutsensa, yana ɗauke da abincinsa da abin shansa, a cikin ƙasa bakarara, sa'an nan kuma ya sake same ta. (Ibn Mas'ud)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Aljanna (Jannah)",
    summary: "Jannah ita ce sakamako na dindindin da Allah ya tanadar wa muminai da rahamarSa.",
    body: [
      'Aljanna ta gaske ce, madawwamiya ce, kuma fiye da duk abin da hankalin ɗan adam zai iya kwatanta. Annabi SAW ya isar da fadin Allah cewa: "Na tanadar wa bayina salihai abin da ido bai taba gani ba, kunne bai ji ba, kuma zuciya ba ta yi ciki ba." Mafi girman sakamakonsa shi ne yardar Allah da ganin fuskarsa.',
      "Shiga Aljanna daga }arshe ne da rahamar Allah – babu wani aikin da ya yi shi kaxai da zai iya samun ni’ima ta har abada – duk da haka Imani na qwarai da aiki na qwarai su ne hanyoyin da Allah Ya sanya kuma Ya karva. Biyu ba sa sabani: rahama ce sanadi, kuma imani da ayyuka su ne hanyar da ya bude mata.",
      "Imani da Aljanna yana sake fasalin yadda mutum yake rayuwa a yanzu: yana haifar da hakuri ta hanyar wahala, karimci da dukiya, da juriya ga ibada, domin mumini yana cinikin duniya mai shudewa zuwa gida madawwami. Kur'ani ya kira mu da mu yi tsere zuwa gare shi.",
    ],
    quran: [
      {
        excerpt:
          "Kuma ku yi gaugãwa zuwa ga gãfara daga Ubangijinku, da Aljanna fãɗinta kamar sammai da ƙasã, an yi tattalinta dõmin mãsu taƙawa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah ya ce: Na tanadar wa bayina salihai abin da ido bai gani ba, kunne bai ji ba, kuma zuciyar mutum ba ta yi ciki ba. (Abu Huraira, kuma Sahih Musulmi 2824).",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Jahannama (Jahannama)",
    summary:
      "Jahannama gargadi ne na gaskiya, wanda ake nufin mayar da zukata zuwa ga Allah tun kafin lokaci ya kure.",
    body: [
      "Imani da jahannama (Jahannama) yana daga cikin imani da gaibu da kuma cikakken adalcin Allah. Haqiqa gidan azaba ne, wanda Alqur’ani da Sunnah suka siffanta shi da kyau domin mutane su xauki hatsarin da muhimmanci.",
      "Gargadi yana aiki da manufa ta rahama: sun wanzu don kare mutane daga ainihin sakamakon da suka siffanta - don duba girman kai, zalunci, da tsayin daka, da sanin kin gaskiya, da motsa waɗanda suka gafala su tuba yayin da kofa a buɗe take.",
      "Ahlus Sunna sun yi riko da gargadi da rahama a wuri daya. Barazanar ta kasance babba kuma ta haqiqa, amma duk da haka rahamar Allah ta kasance mai girma ga wanda ya komo zuwa gare shi – kuma a cikin ma’abuta tauhidi, masu yin zunubi wadanda suka shiga wuta ba za su dawwama a cikinta ba har abada, kuma a qarshe za a fitar da su da rahamar Allah da ceton da Ya yi izini.",
    ],
    quran: [
      {
        excerpt:
          "Ya ku wadanda suka yi imani, ku tsare kanku da iyalanku daga wata wuta wadda makamashinta mutane da duwatsu ne.",
      },
      {
        excerpt:
          "…Kada ku yanke tsammani daga rahamar Allah. Lallai Allah yana gafarta zunubai baki daya.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tashin Kiyama",
    summary: "Bayan mutuwa, za a ta da dukan mutane a jiki don su tsaya a gaban Allah.",
    body: [
      "Tashin matattu (al-ba'th) na jiki ne kuma na gaske, ba alama ba ne ko misaltawa. Allah yana amsa wa waɗanda suke shakka cewa ruɓaɓɓen ƙasusuwa na iya sake rayuwa tare da mafi sauƙi: wanda ya halicce su daga kome a karon farko zai iya dawo da su - kuma sake halitta shine, a fahimtarmu, mafi sauƙi daga asali.",
      "Tsakanin mutuwa da tashin matattu akwai barzakh - matsakaicin rayuwar kabari, tare da tambayarsa da sauƙi ko wahala. Sa'an nan a yi busa a cikin ƙaho, kuma a tãyar da dukan talikai, a tãra su zuwa ga Allah, dõmin hisãbi.",
      "Wannan imani shi ne ke ba wa rayuwar dan Adam muhimmancinsa na dabi’a: idan ba a tashi daga matattu ba, azzalumi da ya mutu cikin annashuwa da wanda aka zalunta da ya mutu aka zalunta zai gamu da karshensa. Da shi ake amsa kowane kuskure kuma ana ba da lada ga kowane mai kyau, yana ba da ma'ana ga hakuri da adalci.",
    ],
    quran: [
      {
        excerpt:
          'Ya ce: "Wãne ne yake rãyar da ƙasũsuwa alhãli kuwa sun ruɓaɓɓe?" Ka ce: "Wanda ya ƙãga halittarsu a farkon lõkaci zai rãyar da su."',
      },
      {
        excerpt:
          "Kuma lalle ne Sa'a, haƙĩƙa mai zuwa ce, bãbu shakka a cikinta, kuma Allah Yanã tãyar da waɗanda suke a cikin kaburbura.",
      },
    ],
  },
  {
    title: "Ranar sakamako",
    summary: "Kowane rai yana tsaye ga Allah; Adalcinsa cikakke ne kuma cikakke.",
    body: [
      "A ranar kiyama ana yi wa kowane mutum hisabi - don aiki da niyya, da hakkin Allah da hakkokin sauran mutane - tare da yin adalci ta yadda 'ba za a zalunce wani rai da komai ba,' ko da gwargwadon kwayar zarra.",
      "A ranar, babu zuri’a, ko dukiya, ko daraja, ko ‘yan qasa, ko matsayi na duniya da zai amfanar da kowa; Imani na qwarai da aiki na qwarai, wanda Allah ya yarda da su, zai amfana. Ana rarraba rubuce-rubuce, ana auna ayyuka, hatta munanan ayyukan da aka yi tsakanin mutane ana warware su ta hanyar karkatar da ayyukan alheri da munanan ayyuka.",
      "Wannan tabbacin ana nufin canza hali ne a yanzu: yana kiran mumini zuwa ga gaskiya, da rikon amana, da tsare hakkin wasu, da gyara kurakurai da mayar da abin da ake binsa kafin ranar da ake biyan bashi a ayyuka ba kudi ba.",
    ],
    quran: [
      {
        excerpt:
          "Kuma Mun sanya ma'auni na adalci ga Rãnar ¡iyãma, sabõda haka, bã zã a zãlunce wani rai da kõme ba.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Mizani da Sirat",
    summary: "Ana auna ayyuka akan Mizan, kuma mutane suna haye Sirat da imaninsu da ayyukansu.",
    body: [
      "Ahlus Sunna sun tabbatar da Mizan (Ma'auni) da Sirat (Gadar Jahannama) a matsayin haqiqanin al'amuran Lahira, sun yi imani daidai da yadda aka ruwaito. A kan sikelin kuma ana auna ayyukansu da masu aikata su da adalci: “Kuma wanda sikelinsa ya yi nauyi, to, yana a cikin rayuwa mai dadi; Kuma wanda ma'aunansa suka yi sauƙi, to, makõmarsa ta kasance a cikin rami.",
      "Sirat wata gada ce wadda aka shimfida akan Jahannama wanda dole ne kowa ya wuce. Kur'ani yana cewa: 'Babu wani daga cikinku face mai haye shi,' sa'an nan kuma, 'Za mu kubutar da wadanda suka yi takawa.' Mutane suna haye bisa ga ayyukansu - wasu suna sauri kamar haske ko iska, wasu suna fafitika, wasu kuma suna zamewa - da rahamar Allah da adalci.",
      "Wadannan haqiqanin ba a gaya musu su tsorata ba, sai dai su raya muhimmancin gaske: game da nauyin qananan ayyuka, game da ikhlasi na ibada, da girmama haqqin wasu, tunda duk za a auna su.",
    ],
    quran: [
      {
        excerpt:
          "To, amma wanda ma'auninsa suka yi nauyi, to, zai kasance a cikin rayuwa mai ni'ima. Kuma amma wanda ma'aunansa suka yi sauƙi, to, makõmarsa ta kasance a cikin rami.",
      },
      {
        excerpt:
          "Kuma bãbu kõwa daga cikinku fãce ya shũɗe a kanta… Sa'an nan kuma Mu tsĩrar da waɗanda suka bi Allah da taƙawa.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ceto (Shafa'ah)",
    summary: "Ceto haƙiƙa ne, amma da iznin Allah ga waɗanda Ya yarda da su.",
    body: [
      "Ceto (shafa'ah) ranar kiyama ta tabbata a cikin Alqur'ani da Sunnah. Mafi girman kowa shi ne 'Tasha Mai Yabo' (al-maqam al-mahmud) da aka bai wa Annabi Muhammad SAW, lokacin da zai yi ceto ga talikai su fara hisabi - kuma yana da sauran ceto ga ma'abuta manyan zunubai daga cikin al'ummarsa.",
      'Amma ba mai yin ceto da ikon kansa. Duk wata cẽto ingantacciya tana faruwa ne kawai bayan izninSa, kuma ga waɗanda Allah Ya yarda da su: "Wãne ne wanda yake yin cẽto a wurinSa fãce da izninSa?" Wannan yana kiyaye cikakken ikon Allah akan sakamako.',
      "Malamai sun siffanta nau'o'in ceto da dama - domin a fara hisabi, domin mutane su shiga Aljanna, domin a gafarta wa muminai masu zunubi ko a cire su daga wuta - yayin da suka yarda cewa hukunci na karshe na Allah ne kadai.",
    ],
    quran: [
      {
        excerpt: "Wane ne wanda ke yin cẽto a wurinSa, fãce da izninSa?",
      },
      {
        excerpt:
          "A rãnar nan, cẽto bã ya amfãninsa, fãce wanda Mai rahama Ya yi masa izni, kuma Ya yarda da kalmarsa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Jama'a za su zo wurina, in yi sujada ga Ubangijina; sai a ce: Ka daga kai, ka yi tambaya a ba ka, a yi ceto kuma a karbi cetonka. (Abu Sa'id - babban ceto).",
      },
    ],
    misconceptions: [
      "Rashin fahimta: Ceto yana kawar da bukatar tuba. Gyara: Yana faruwa ne kawai da iznin Allah kuma ba shi da ikon dagewa cikin zunubi.",
      "Rashin fahimta: Mutum na iya kiran annabawa ko salihai yanzu don yin ceto. GYARA: Ibada da addu'a na Allah ne shi kaɗai; cẽto a cikin Lahira da umurninSa ne, ana nẽman yardarSa.",
      "Kuskure: Ceto ya saba wa adalcin Allah. GYARA: Ita ce nunin rahamarSa guda xaya da ke aiki cikin cikakkiyar adalcinsa, kuma da izninSa ne kawai.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Alamomin Ranar Lahira",
    summary:
      "Alamun kanana da manya gaskiya ne; masu hankali sun maida hankali kan shiri akan hasashe.",
    body: [
      "Nassosi ingantattu sun yi bayanin alamomin da suke gabanin Sa’a, sun karkasu zuwa ga qananan alamomi (da yawa daga cikinsu sun riga sun bayyana, kamar aiko Annabi Sallallahu Alaihi Wasallama da kansa, da yaduwar jahilci, da rashin gafala) da manyan alamomin da za su auku a kusa da qarshe.",
      "Manyan alamomi guda goma sun zo tare a cikin hadisin Annabi SAW: daga ciki akwai bayyanar Dajjal, da saukar Annabi Isa (Dan Maryam), da bayyanar Yajuj da Ma’juj, da zabtarewar kasa guda uku, da hayaki, fitowar rana daga yamma, da wuta mai kai mutane zuwa taronsu na karshe.",
      "A wasu lokuta malamai sun yi sabani a kan ainihin jerin alamomin, amma sun yi ittifaqi a kan abubuwa guda biyu: tabbatattu da zuwar Sa’a, kuma ba kowa ne ya san lokacinta sai Allah – ko ga Annabi SAW lokacin da Jibrilu ya tambaye shi. Amsar annabci ga alamun don haka yana da amfani, ba hasashe ba: ƙara bangaskiya, tuba, adalci, da ayyuka masu fa'ida maimakon tsinkaya mara iyaka.",
    ],
    quran: [
      {
        excerpt:
          'Sunã tambayar ka game da Sa\'a, "Yaushe ne makõmarta?" Ka ce: "Abin sani kawai, saninta a wurin Ubangijina yake."',
      },
      {
        excerpt:
          "Shin kuma sunã jiran (wani abu) fãce dõmin Sa'a ta je musu kwatsam? Alamun sa sun riga sun zo.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sa’a ba za ta zo ba, sai kun ga alamomi guda goma: hayaki, Dajjal, Dabba, Rana na fitowa daga yamma, gangarowar Annabi Isa, Yajuj da Ma’juj, da zabtarewar kasa guda uku… (Huzaifa bn Usayd).",
      },
    ],
    misconceptions: [
      "Kuskure: Kowane babban taron duniya tabbas alama ce ta ƙarshe. Gyara: Irin waɗannan ikirari suna buƙatar ingantacciyar shaida da taka tsantsan na ilimi, ba abin mamaki ba.",
      "Kuskure: Sanin alamun yana ba mu kwanan wata Sa'a. GYARA: Ainihin lokacin da Allah Shi kadai ya san shi; Alamun suna kiran mu don mu shirya, ba tsinkaya ba.",
    ],
    appLinks: [{}],
  },
  {
    title: "Aqeedah FAQ",
    summary: "Tambayoyin akida gama gari sun amsa da ma'auni, shaida, da adab mai kyau.",
    body: [
      "Tambaya: Shin duk Ahlus-Sunnah sun yi daidai da kowane batu na akida? A: Ahlul Sunna sun yi tarayya da tushe guda kuma sun yi ittifaqi gaba daya a kan abubuwan da ake bukata; Makarantun tauhidi da aka sani (Athari, Ash’ari, Maturidi) sun bambanta ne kawai a wasu fasahohin fasaha, kuma wannan ya kamata a kusanci shi da ilmantarwa na girmamawa, ba gaba ba.",
      "Tambaya: Shin ina buƙatar falsafar ci gaba don samun ingantacciyar aqida? A: A'a ana buqatar kowane musulmi ya koyi muhimman abubuwa gwargwadon buqatarsa ​​- kasidu shida da tauhidi zalla - yayin da zurfafa nazari yana da fa'ida a qarqashin ƙwararrun malamai.",
      "Tambaya: Shin ya kamata sanin aqida ya sa ni tsangwama da wasu? A: A'a. Ya kamata akida ingantacciya ta kara tawali'u, godiya, jinkai, da magana mai kyau. Yin amfani da akida don kaskantar da musulmi ko kuma yin gaggawar yin takfiri shi kansa kuskure ne babba.",
      "Tambaya: Menene banbancin imani, musulunci, da ihsan? A: A cikin Hadisin Jibrilu, Musulunci shi ne ibadodi na zahiri, imani kuma shi ne akidar badini (kassoshi shida), kuma ihsani shi ne cikar duka biyun – ka bauta wa Allah kamar kana ganinsa.",
    ],
    actions: [
      "Ba da fifikon fayyace, abubuwan da aka yarda da su kafin cikakkun bayanan fasaha masu jayayya.",
      "Tuntuɓi ƙwararrun ƙwararrun malamai na cikin gida lokacin da haƙƙin ƙa'ida ta shafi aikinku.",
    ],
  },
  {
    title: "Nassoshi da Karin Nazari",
    summary: "A fara da Alqur'ani da ingantacciyar Sunnah, sannan amintacce aqidar Sunna.",
    body: [
      "Babban abin da ake nufi da akida ko da yaushe shi ne Alkur'ani da ingantacciyar Sunna, wanda aka fahimta kamar yadda Sahabbai da malaman Ahlus Sunna na farko suka fahimce su - ba ta hanyar dabi'un da suka biyo baya ba a sake komawa cikin nassosi.",
      "Nazarin fa'ida ya haɗa da taƙaitaccen ƙa'idodin akida na gargajiya (kamar al-'Aqidah al-Tahawiyya da ayyukan malaman farko) waɗanda suke koyarwa tare da bayanin da ya dace da matakin ku daga amintattun malamai.",
      "Lokacin da malamai suka yi sabani a kan batutuwa na biyu, ku koyi shaida cikin tawali’u kuma ku guje wa mayar da sabani na fasaha zuwa ƙiyayya ta bangaranci - haɗin kan muminai a kan muhimman abubuwa shi kansa umarni ne na addini.",
    ],
    disclaimer:
      "Wannan tsarin ilimi ne kuma ba na siyasa ba. Don hukunce-hukuncen sirri ko damuwa na akida, tuntuɓi ƙwararrun malamai waɗanda kuka amince da su.",
    actions: [
      "Yi nazarin batun akida guda ɗaya kowane mako tare da malami ko amintaccen firamare.",
      "Ka haddace talifofi shida na bangaskiya kuma ka iya bayyana kowannensu da kalmominka.",
    ],
    appLinks: [{}, {}, {}],
  },
];

export const AQEDAH_GLOSSARY_HA: DeepPartial<AqeedahGlossaryTerm>[] = [
  {
    term: "Aqeedah",
    definition:
      "Aqida – abin da musulmi ya yi imani da Allah, da mala’ikunSa, da littafai, da manzanni, da ranar lahira, da hukunce-hukuncen Allah.",
  },
  {
    term: "Tauhidi",
    definition: "kadaita Allah a cikin ubangijintaka, bauta, da sunaye/sifofi – tushen Musulunci.",
  },
  {
    term: "Shirka",
    definition:
      "Yin shirka da Allah a cikin bauta ko sifofinsa shi kadai ya mallaka - kishiyar tauhidi.",
  },
  {
    term: "Iman",
    definition: "Bangaskiya - imani da zuciya, tabbatarwa ta harshe, da aiki tare da gaɓoɓi.",
  },
  {
    term: "Qadri",
    definition:
      "Sanin Allah madawwami da hukuncin kowane abu - nagari da sharri suna wanzuwa da izininsa da hikimarsa.",
  },
  {
    term: "Nabi",
    definition:
      "Annabi - wanda aka yi wahayi kuma aka umurce shi da isar da shi; na iya bin dokar da ta gabata.",
  },
  {
    term: "Rasulullah",
    definition: "Manzo - Annabi da aka aiko da sabon littafi ko doka zuwa ga mutanensa.",
  },
  {
    term: "Sirat",
    definition: "Gadar Jahannama a Rãnar Ƙiyãma - Muminai suna haye gwargwadon ayyukansu.",
  },
];
