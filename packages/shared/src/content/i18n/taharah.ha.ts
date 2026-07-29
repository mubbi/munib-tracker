// Hausa translation overlay for the Learn Taharah content. Mirrors the order of
// its English source in ../taharah*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { TaharahChecklistItem, TaharahTopic } from "../../types/taharah";
import type { DeepPartial } from "./localize";

export const TAHARAH_TOPICS_HA: DeepPartial<TaharahTopic>[] = [
  {
    title: "Gabatarwa zuwa Taharah",
    summary: "Tsarkake shi ne kofar sallah kuma rabin imanin mumini.",
    body: [
      "Taharah (طهارة) tana nufin tsarkakewa - 'yanta jiki, tufa, da wurin sallah daga najasa na al'ada da na zahiri domin musulmi ya tsaya a gaban Allah a yanayin da Ya yarda da shi. Shi ne farkon abin da dalibin ibada ya koya, domin idan ba ita ba babu wata sallah da take ingantawa: Manzon Allah SAW yana cewa: ''Mabudin sallah ita ce tsarkakewa''.",
      "Tsarkakewa a Musulunci yana da fuska biyu. Na waje shine tsaftar zahiri - wankewa, cire ƙazanta, tsaftacewa. Na ciki shine tawali'u, tunani, da kuma shirye-shiryen zuciya wanda ake nufi da wankewa. Annabi SAW ya hade su biyun a lokacin da ya kira tsarkakewa ‘rabin imani,’ hade tsaftar jiki da tsarkake rai daga zunubi.",
      "Wannan ma’auni yana tafiya ne cikin dukkan abin da ake nufi da shi: ruwan da kuke tsarkakewa da shi, da alwala (kananan alwala), ghusl (cikakkiyar wankan ibada), da tayamum (bushewar tsarki lokacin da ba za a iya amfani da shi ba), najasa (cire kazanta) da na musamman da rangwame. Koyi sau ɗaya kuma addu'a ta zama abin da za ku iya shigar da shi da tabbaci maimakon shakka.",
    ],
    quran: [
      {
        excerpt:
          "Ya ku waxanda suka yi imani, idan kun tashi yin sallah, to ku wanke fusknakinku da gabbanku zuwa gwiwar hannu, ku shafe kawunanku, kuma ku wanke qafafunku zuwa idon sawu.",
      },
      {
        excerpt: "Lallai Allah yana son masu tuba kuma yana son masu tsarkakewa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Makullin sallah shine tsarkakewa; farkonta shine takbir kuma karshenta taslim. (Ali; da Jami' at-Tirmizi 3).",
      },
    ],
    actions: [
      "Ɗauke tsarkakewa a matsayin shiri don saduwa da Allah, ba aikin gaggawa ba.",
      "Yi nazarin batun taharah guda ɗaya kowace rana har sai duk ruwan ya zama na halitta.",
    ],
    appLinks: [{}],
  },
  {
    title: "Muhimmancin Tsafta",
    summary: "Tsarki sharadi ne mai tsanani ga sallah kuma alamar mumini.",
    body: [
      "Tsarkake ba daya ba ne a tsakanin dayawa - sharadi ne na ingancin sallah. Allah ba ya karbar addu'ar mutumin da yake cikin najasa har sai ya yi tsarki. Don haka dole ne a maimaita sallar da aka yi ba tare da ingantacciya ko alwala ba, komai na gaskiya.",
      "Annabi ﷺ ya daukaka tsarkakewa zuwa ga siffa ta mumini, yana kiranta da 'rabin imani'. Tsarkakewa akai-akai yana horon mutum, yana kiyaye shi a cikin wani yanayi na shirye-shiryen ibada, kuma - hadisi ya koyar - yana kankare kananan zunubai da ruwa.",
      "Domin tana kiyaye sallah, ita ma taharah tana kiyaye mumini daga zunubin yin sallar ba da gafala ba. Don haka koyon hukunce-hukuncensa da kyau aiki ne na kare daya daga cikin manya-manyan ayyuka a Musulunci.",
    ],
    hadith: [
      {
        excerpt: "Tsarkake rabin imani ne. (Abu Malik al-Ash'ari)",
      },
      {
        excerpt:
          "Allah ba Ya karbar addu'a sai da tsarki, kuma ba ya karbar sadaka daga abin da aka sace. (Ibn Umar)",
      },
    ],
    actions: [
      "Kafin kowace sallah, tabbatar da yanayin tsarkin ku kafin farawa.",
      "Ajiye lissafin tunani mai sauƙi: jiki, tufafi, wuri, da wudu.",
    ],
  },
  {
    title: "Nau'in Tsabta",
    summary:
      "Jihohi uku da ya kamata a sani: Karamar kazanta, da kazanta babba, da najasa ta zahiri.",
    body: [
      "Shari'ar Musulunci ta banbanta abubuwa guda uku da za ku iya tsarkakewa daga cikinsu, kuma kowanne yana da nasa maganin. Sanin wane yanayi kuke ciki shine mabuɗin don zaɓar hanyar da ta dace.",
      "Ƙananan ƙazanta na al'ada (hadath asghar) yana samuwa daga al'amuran yau da kullum kamar amfani da bayan gida, wucewar iska, ko barci mai zurfi. Ana dagawa da alwala, ko kuma ta tayamu idan ba a iya amfani da ruwa.",
      "Babban rashin tsarkin al'ada (hadath akbar, wanda kuma ake kira janabah) yana faruwa ne daga kusanci, fitar jima'i, da ƙarewar haila ko zubar jinin haihuwa. An ɗaga shi da ghusl, wanka na al'ada na cikakken jiki - tare da sake maye gurbin lokacin da babu ruwa ko cutarwa.",
      "Najasa (najasa) - kamar fitsari, najasa, ko jini mai gudana - wani abu ne daban: dole ne a cire shi daga jiki, da tufafi, da wurin addu'a ba tare da la'akari da yanayin al'ada ba. Mazhabobin Ahlus-Sunnah guda hudu sun yi ittifaki a kan wadannan rukunai guda uku, sun banbanta ne kawai a cikin wasu bayanai na abin da ke warware tsarki ko kuma abin da aka yi wa uzuri.",
    ],
    quran: [
      {
        excerpt:
          "Kuma idan kun kasance a cikin janaba, to ku tsarkake kanku. Amma idan ba ku da lafiya ko a kan tafiya... kuma ba ku sami ruwa ba, to, ku yi taimiyya da ƙasa mai tsafta.",
      },
    ],
    actions: [
      "Gano jihar ku da farko (ƙanami, babba, ko ƙazanta), sannan a yi amfani da hanyar da ta dace.",
      "Lokacin da babu tabbas game da cikakkun bayanai, bi ƙwararren malami daga makarantar da aka sani akai-akai.",
    ],
  },
  {
    title: "Ruwa a Musulunci",
    summary:
      "Ruwa mai tsabta shine mai tsarkakewa na farko - ana amfani da shi sosai, amma ba a taɓa ɓata ba.",
    body: [
      "Tushen hanyar tsarkakewa shine ruwa. Allah ya siffanta ruwan sama kamar yadda aka saukar da ‘tsarki’ (tahur) – mai ikon wankewa da kuma amfani da shi wajen bauta. Duk wani ruwa mai tsafta na dabi'a - ruwan sama, kogi, teku, marmaro, rijiya, ko famfo - yana tsarkakewa muddin launinsa, ɗanɗanonsa, ko ƙamshinsa bai canza ta hanyar ƙazanta da ke haɗuwa a cikinsa ba.",
      "Malaman fikihu sun karkasa ruwa daki-daki (tsaftace kuma mai tsarkakewa, mai tsafta amma ba mai tsarkakewa ba, da najasa), amma ka’idar aiki ta rayuwar yau da kullum ita ce mai sauki: ruwa ya kasance mai dacewa da alwala da gulma sai dai idan najasa ta canza shi karara. Lokacin da ke cikin shakkar gaske tare da samuwa mai tsabta madadin, yi amfani da madadin.",
      "Musulunci ya koyar da tsafta ba tare da almubazzaranci ba. Annabi SAW ya wanke gaba daya amma ya yi amfani da ruwa kadan kadan - kimanin laka guda (biyu da hannu) don yin alwala da sa' (kimanin hudu) ga cikakkar gulma. Sharar da ruwa ba a hana shi koda ya yi yawa, domin ita kanta tawali’u na daga cikin ladubban ibada.",
    ],
    quran: [
      {
        excerpt: "Kuma Muka saukar da ruwa mai tsarkakẽwa daga sama.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Manzon Allah SAW ya kasance yana yin alwala da laka na ruwa da guzuri da sa'a har guda biyar. (Anas; da kuma Sahih Musulmi 325 - sunnar daidaitawa).",
      },
    ],
    actions: [
      "Yi amfani da isasshen ruwa don wankewa sosai, amma juya famfo ƙasa kuma kauce wa wuce haddi.",
      "Idan tushen ruwa ya yi kama da ƙamshi da ƙazanta ta canza, nemi mafi kusa da tsaftataccen tushe.",
    ],
    disclaimer:
      "Mafi yawan abin da aka nakalto ‘kada ku bata ruwa ko da a kogi mai gudana’ (Ibn Majah 425) mafi yawan malamai sun yi rauni (da’if); sunnah ta tsakaitawa ta tabbata a madadin laka/sa' hadisin da ke sama.",
  },
  {
    title: "Menene Wudu?",
    summary: "Alwalar da take dauke da qananan kazanta kafin ibada.",
    body: [
      "Alwala (وضوء) ita ce wankan gabobin jiki na musamman, a cikin wani tsari na musamman, wanda ke dauke qananan kazanta. Wankansa guda hudu na wajaba an ambaci sunansa kai tsaye a cikin Alkur'ani (5:6): fuska, hannaye zuwa gwiwar hannu, shafa kai, da kafafu zuwa idon sawu.",
      "Ana buqatar ta kafin kowace sallah – sai dai idan kun kasance cikin ingantacciya daga sallar da ta gabata – da kuma a cewar mafi rinjayen malamai kafin yin tawafi a dawafin Ka’aba da kuma kafin tava nassi na zahiri (mushaf) na Alqur’ani.",
      "Alwala ibada ce a cikinta, ba kawai ta farko ba. Manzon Allah (SAW) ya yi gargadin cewa “Allah ba ya karbar addu’ar dayanku wanda ya karya alwala har sai ya sake yin alwala” – don haka kiyaye ta shi ne kiyaye sallar da kanta.",
    ],
    hadith: [
      {
        excerpt:
          "Allah ba ya karbar addu'ar dayanku wanda ya karya alwala har sai ya yi alwala. (Abu Huraira)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Sharuɗɗan Wudu mai inganci",
    summary:
      "Niyya, ruwa mai tsafta, da fatar da ba ta toshe - abubuwan da ake bukata na wudu mai sauti.",
    body: [
      "Wasu sharuɗɗa (shurut) dole ne su kasance a wurin don wudu don ƙidaya. Dole ne mutum ya kasance musulmi mai hankali, mai niyyar tsarkakewa ga ibada (niyyah). Wasu makarantu suna rarraba niyya a matsayin ginshiƙi na aikin wasu kuma a matsayin sharadi, amma duk sun yarda cewa ana buƙatar lada kuma, ga mafi yawan, don inganci.",
      "Ruwan da ake amfani da shi dole ne ya zama mai tsabta da tsarkakewa. Mahimmanci, dole ne a haƙiƙa ya isa fata - don haka duk wani abu da ke samar da shinge mai hana ruwa a jikin wata gaɓa (fanti mai kauri, goge ƙusa, kakin zuma, manne) dole ne a fara cire shi da farko, ko kuma wanke ƙarƙashinsa bai inganta ba. Datti na yau da kullun ko tabon henna da ba ta toshe ruwa ba matsala.",
      "Makarantun Shafi'iyya da Hanbaliyya su ma sun bukaci a yi wankin kamar yadda Alkur'ani ya zo da shi kuma ba tare da tsangwama ba (muwalat) da ke barin gabobi ya bushe. Matsayin Hanafiyya da Malikiyya kan tsauraran matakai da ci gaba sun fi sassauci a wasu yanayi. Bi hanyar makaranta ɗaya don daidaito.",
    ],
    quran: [
      {
        excerpt:
          "Ku wanke fuskokinku da hannayenku zuwa gwiwar hannu, ku shafe kawunanku, sannan ku wanke kafafunku har zuwa idon sawu.",
      },
    ],
    actions: [
      "Cire gashin farce, zoben da ke tarko ruwa, da duk wani abu da ya rufe fata kafin alwala.",
      "Yi alwala cikin nutsuwa a cikin ruwa guda ɗaya don kada wani gaɓoɓi ya ɓace ko a bar shi ya bushe.",
    ],
  },
  {
    title: "Ayyukan Alwala",
    summary: "Rukunan Kur'ani (faraid) wadanda ba tare da su wudu bace.",
    body: [
      "Ayyukan alwala (faraidinta) sune sassan da Allah ya ambata a cikin ayar: wanke fuska baki daya; wanke hannaye biyu har zuwa gwiwar hannu; shafa kai; da wanke ƙafafu biyu har zuwa sawu. Rasa ko ɗaya daga cikin waɗannan kuma alwala bai cika ba.",
      "A kan waxannan, mazhabobi suna qara wajabta wasu wajibai daga Sunnah da hukunce-hukuncen shari’a. Niyya tana wajaba a mafi yawan mazhabobi (Hanafiyawa sun karkasa ta a matsayin sunna da aka fi karfi wajen dauke qananan kazanta). Umarni (tartib) da ci gaba (muwalat) sun wajaba akan Shafi'awa da Hanbaliyya. Malikiyya sun kara shafa gabobi (dalk) a matsayin farilla.",
      "Duk abin da ya wuce wadannan – kurkure baki da hanci, da wanke hannu tukuna, wanke hannu sau uku – mustahabbi ne (sunna) ba wajibi ba. Sanin bambanci yana nufin za ku iya gane lokacin da alwala ta kasance ajizi ne kawai da rashin inganci.",
    ],
    quran: [
      {
        excerpt:
          "Ku wanke fuskokinku da hannayenku zuwa gwiwar hannu, ku shafe kawunanku, sannan ku wanke kafafunku har zuwa idon sawu.",
      },
    ],
    disclaimer:
      "Madaidaicin lissafin faraid (misali ko niyya, tsari, da shafa wajibi ne) ya bambanta a tsakanin mazhabobi hudu. Koyi kuma a yi amfani da ingantaccen makaranta guda ɗaya akai-akai.",
  },
  {
    title: "Sunnah Ayyukan Alwala",
    summary: "Shawarwarin yana aiki masu kamala kuma suna ninka ladan alwala.",
    body: [
      "A wajen farilla, Annabi ﷺ ya aikata ayyuka da yawa na mustahabbi (sunan) wadanda suka cika da kawata alwala. Barin mutum baya bata alwala, amma hada su yana samun karin lada da bin misalinsa sosai.",
      "Ayyukan sunna da aka kafa sun haxa da: “Bismillah” a farkonsa; wanke hannu sau uku kafin farawa; kurkure baki (madmadah) da hanci (istinshaq); gudana rigar yatsu ta gemu mai kauri da tsakanin yatsu da yatsu (takhlil); farawa kowane biyu na gabobin da dama; da maimaita kowane wanka har sau uku.",
      "Sunnoni guda biyu sun cancanci a ambaci sunansu na musamman: yin amfani da miswak (siwak) a gabani - wanda Annabi SAW ya kusa wajabta shi - da karanta shaidar imani bayan kammala, wanda ya bude kofofin Aljanna guda takwas ga wanda ya fadi.",
    ],
    hadith: [
      {
        excerpt:
          "Duk wanda ya kyautata alwala, sannan ya ce: “Na shaida babu abin bautawa da gaskiya sai Allah… kuma Muhammadu bawanSa ne kuma ManzonSa ne.” An bude masa kofofin Aljanna takwas. (Umar ibn al-Khattab)",
      },
    ],
    actions: [
      "Ka yi cikakken jerin sunnah har sai ta zama al'adarka.",
      "Karanta shahadar bayan wudu a kowane lokaci.",
    ],
    appLinks: [{}],
  },
  {
    title: "Wudu mataki-mataki",
    summary: "Cikakken jerin annabci daga niyya zuwa rufe addu'a.",
    body: [
      "Manzon Allah Sallallahu Alaihi Wasallama ya koyar da alwala a matsayin wata hanya mai gudana wacce take sakar wajibai tare da ayyukan sunna. Wannan ita ce hanyar da Usman bn Affan ya nuna wa mutane, inda ya ce daga baya ya ga Annabi Sallallahu Alaihi Wasallama yana yin alwala kamar haka – kuma duk wanda ya yi kuma ya sallaci raka’a biyu cikakku, an gafarta masa abin da ya gabata na zunubansa.",
      "Yi kowane mataki ba tare da gaggawa ba, tabbatar da cewa ruwan ya kai kowane yanki da ake buƙata. Ana wanke gabobin da aka wanke (fuska, hannaye, ƙafafu); kai kawai ake gogewa.",
    ],
    steps: [
      {
        title: "Ku yi nufin tsarki kuma ku ce Bismillah",
        body: "Ka kafa niyyar alwala a zuciyarka ka fara da sunan Allah.",
        tip: "Niyya tana cikin ciki - ba a buƙatar dabarar magana.",
      },
      {
        title: "Wanke hannu biyu sau uku",
        body: "Wanke zuwa wuyan hannu, wucewa ruwa tsakanin yatsunsu.",
      },
      {
        title: "Kurkura baki sau uku",
        body: "Ɗauki ruwa a baki, murɗa shi, sannan a fitar da shi.",
      },
      {
        title: "Kurkura hanci sau uku",
        body: "Zamo ruwa a hankali a cikin hanci kuma a busa shi.",
      },
      {
        title: "A wanke fuska sau uku (fard)",
        body: "Tun daga layin gashi zuwa ƙarƙashin chin kuma daga kunne zuwa kunne.",
      },
      {
        title: "Wanke hannun dama, sannan hagu (fard)",
        body: "Kowanne daga yatsa zuwa gami da gwiwar gwiwar hannu, har sau uku.",
      },
      {
        title: "Goge kai sau ɗaya (fard)",
        body: "Tare da rigar hannaye, shafa daga gaba zuwa baya sannan a dawo, sannan a goge kunnuwa da datti iri ɗaya.",
      },
      {
        title: "Wanke kafar dama, sannan hagu (fard)",
        body: "Kowane zuwa har da idon sawun, yana wucewa tsakanin yatsun kafa.",
        tip: "Kula da sheqa da idon kafa - mafi yawan wuraren da aka rasa.",
      },
      {
        title: "Karanta addu'ar rufewa",
        body: "Ku fadi shaidar imani a bude kofofin Aljannah.",
        tip: "Sunnah gajeru amma mai tarin lada.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Usman ya wanke kowace kafa har sau uku kamar yadda ya ga Annabi SAW yana yi, sannan ya ce: “Duk wanda ya yi alwala kamar haka kuma ya sallaci raka’a biyu yana mai da hankali, an gafarta masa abin da ya gabata na zunubansa. (Humran, daga Usman)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Addu'o'in da suka shafi Wudu",
    summary: "Addu'o'in da aka ruwaito na kwarai kafin alwala da bayanta.",
    body: [
      "Mafi qarfin riwaya a wajen alwala guda biyu ne: Fadin ‘Bismillah’ a farkonsa, da kuma shaidar imani bayan kammala ta. Zuwa ga rufe Shahada, wani ingantaccen Bugu da kari ya tambayi Allah, 'Ka sanya ni a cikin waɗanda suka tuba, kuma Ya sanya ni daga waɗanda suke tsarkake kansu.'",
      "Yana da kyau a san cewa cikakken ‘du’a ga kowane gaɓa’ (wata takamaiman addu’a yayin wanke hannu, fuska, hannaye, da sauransu) da ke yawo a wasu littattafai ba ta tabbata da ingancin ingancin Annabi SAW ba. Malamai suna nasiha da kada a jingina masa wadannan a matsayin sunna, alhali babu cutarwa ga ambaton Allah baki daya yayin alwala.",
      "Zuciyar al'amarin ita ce kasantuwar: a wanke tare da sanin cewa zunubin kowane gaɓawa yana gushewa, kuma a ƙare da shahadar da ta sake haɗa aiki da manufarsa - imani da Allah Shi kaɗai.",
    ],
    hadith: [
      {
        excerpt:
          "Duk wanda ya yi alwala da kyau sannan ya karanta shaidar imani, an bude masa kofofin Aljannah guda takwas ya shiga da duk wanda ya so. (Umar)",
      },
    ],
    actions: [
      "Ku haddace bayan wudu shahadah idan baku riga ba.",
      "Ka nisanci karanta ka'idojin da ba a tabbatar da su ba kamar sunnah ce.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Me Ke Karya Wudu?",
    summary: "Masu warware wudu - da ka'idar tabbatuwa yayin da ake shakka.",
    body: [
      "Ta hanyar yarjejeniya ta ilimi, ana karya alwala da duk wani abu da ya fita na kebantattun hanyoyi guda biyu – fitsari, ko kwandala, iska, ko wani abin fitar da ruwa – haka nan da barci mai zurfi da ke kawar da hankalin mutum, da kuma rashin hayyacinsa ta hanyar suma ko maye.",
      "Sauran al’amura kuma ana samun banbancin mutuntawa a tsakanin makarantu: taba al’aura kai tsaye, da fata-da-fata da wanda ba muharramansa ba, suna warwarewa a wasu makarantu amma ba wasu ba, bisa la’akari da karatun nassi iri daya.",
      "Muhimmiyar ƙa'idar mulki tana kiyaye ku daga damuwa ta yau da kullun (waswas): tabbas ba a cire ta da shakka ba. Idan kana da alwala kuma kawai ba ka da tabbacin ko ka fasa, har yanzu ana ganin kana da alwala har sai an tabbatar da cewa akwai mai warwarewa. Annabi SAW ya gaya wa mutumin da ya damu da wannan tunanin kada ya bar sallarsa 'har sai ya ji sauti ko ya sami wari.'",
    ],
    hadith: [
      {
        excerpt:
          "Kada ya fita (sallarsa) har sai ya ji sauti ko ya samu wari. (Abbad ibn Tamim, daga baffansa)",
      },
    ],
    disclaimer:
      "Ko taba ma'aurata ko al'aurar mutum yana karya alwala ya bambanta a cikin makarantu. Bi ƙwararren malami na gida da tsarin makaranta ɗaya.",
  },
  {
    title: "Kuskuren Wudu gama gari",
    summary: "Kurakurai akai-akai masu rage lada - ko kuma bata wudu gaba daya.",
    body: [
      "Yawancin kurakuran wudu suna fitowa daga gaggawa. Guguwa don kada ruwa ya kai ga gaɓoɓi guda ɗaya - busasshiyar faci a diddige, idon sawu, gwiwar hannu, ko tsakanin yatsu da yatsu - na iya barin alwalar ta lalace, saboda ba a kammala wankin kur'ani a can ba.",
      "Annabi SAW ya tava ganin mutanen da dugadugansu ta bushe kamar yadda ruwan bai kai gare su ba, sai ya yi gargaxi da kakkausar murya cewa, ‘Kaiton dugaduganin wuta! Duga-dugansa, idon sawu, da kusurwoyin fuska sune wuraren da aka fi kulawa da su.",
      "Kuskure sabanin haka shi ne wuce gona da iri: yin wanka da nisa fiye da sau uku, ko amfani da ruwa da almubazzaranci, wanda ya saba wa sunnar daidaitawa. Wasu kuma sukan fada cikin waswas (shakka mai tsauri), suna ta maimaita wudu akai-akai - wannan ma kuskure ne, tunda tabbas ba a soke ta da zato.",
    ],
    hadith: [
      {
        excerpt:
          "Bone ya tabbata ga dugadugansa daga wuta! - ya ce a lokacin da ya ga dugadugan sun bushe a cikin wudu. (Abu Huraira)",
      },
    ],
    actions: [
      "Sannu a hankali tabbatar da cikakken ɗaukar hoto na kowane gaɓar da aka wanke, musamman ma diddige da gwiwar hannu.",
      "Yi amfani da matsakaicin ruwa; Kada ka bari shakku mai ban sha'awa ya tura ka cikin maimaitawar banza.",
    ],
  },
  {
    title: "Falalar Wudu",
    summary:
      "Alwala tana kankare zunubai, tana daukaka darajoji, kuma tana haskakawa muminai ranar kiyama.",
    body: [
      "Alwala tana maimaituwa tana kawar da zunubai. Manzon Allah ﷺ ya koyar da cewa yayin da mumini yake wanke kowane gaɓa, munanan ayyukan da wannan sashin ya aikata yana faɗuwa da ruwa - da idanu, hannaye, ƙafafu - har sai mutum ya fito yana tsarkaka daga zunubi. Sallar da aka yi alwala sai a yi sabon gafara.",
      "Haka nan abin alfahari ne a rayuwa ta gaba. A ranar kiyama Annabi ﷺ zai gane mabiyansa ta hanyar annuri a fuskokinsu, hannayensu, da kafafunsu daga sawun alwala - wani haske da ya kebanta da wannan al'ummah, wanda ake kira al-ghurr al-muhajjalun.",
      "Saboda wadannan kyawawan dabi'u, zama a cikin alwala dabi'a ce mustahabbai: sabuntata ga kowace sallah, da yin barci a kan alwala, suna daga cikin ayyukan kariya na mumini.",
    ],
    hadith: [
      {
        excerpt:
          "Za'a kirayi al'ummata ranar kiyama da fuskoki da hannaye da qafafu masu haske daga sahun alwala. (Abu Huraira)",
      },
    ],
    actions: [
      "Sabunta wudu ga kowace taga sallah inda zaka iya.",
      "Ka sanya yin barci a kan alwala sunna ce ta dare.",
    ],
    appLinks: [{}],
  },
  {
    title: "Menene Ghusl?",
    summary: "Wankan al'ada mai cikakken jiki wanda ke dauke manyan kazanta (janabah).",
    body: [
      "Ghusl (غسل) shine wankan tsarki na dukkan jiki, da niyya, don dauke babbar kazanta (janabah). Inda wudu ta yi magana akan qananan kazanta, ghusl tana magana ne game da mafi girman yanayin da ke biyo bayan kusanci, zubar da jini, da ƙarewar haila ko zubar jinin haihuwa.",
      "Asalinsa shine cewa ruwa yana kaiwa kowane bangare na jikin waje - babu busasshen tabo da zai iya zama, gami da tushen gashin gashi, nannade fata, bayan kunnuwa, cibiya, da tsakanin yatsun kafa. Kurkure baki da hanci yana cikin gyadar malamai da yawa.",
      "Gus guda daya da aka yi da niyyar daga janabah shima yana gusar da karamar kazanta, don haka wanda ya gama alwala zai iya yin sallah ba tare da alwala daban ba (ko da yake yin alwala a cikin janabah ita ce sunna).",
    ],
    quran: [
      {
        excerpt: "Kuma idan kun kasance a cikin janaba, to ku tsarkake kanku.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Lokacin da ake buƙatar Ghusl",
    summary: "Abubuwan da suka sa cikakken wankan ibada ya zama wajibi ko mustahabbi.",
    body: [
      "Ghusl ya zama wajibi (fard) a lokuta da dama da aka ayyana: fitar da ruwan jima'i tare da sha'awa (ko a farke ko ta wurin rigar mafarki); jima'i da kanta, ko da ba fitar maniyyi ba - Manzon Allah SAW ya ce da zarar an hada biyun, za a wayi gari; da kuma qarshen haila (hayd) ko jinin bayan haihuwa (nifas). Mutuwa kuma tana wajabta wa mamaci rayayye.",
      "An so sauran gabbansu (mustahabbai) maimakon wajibci: gulmar juma'a gabanin juma'a, wanda aka kwadaitar da shi sosai har Annabi SAW ya kira ta da cewa 'wajibi ne akan duk wanda ya balaga'; gulmar Idi guda biyu; da gulmar ihrami kafin aikin hajji ko umrah.",
      "An umurci sabon musulmi da ya yi zalinci idan ya shiga Musulunci – wasu malamai suka wajabta musu, wasu kuma suka yi nasiha mai karfi.",
    ],
    hadith: [
      {
        excerpt:
          "Idan mutum ya zauna tsakanin gabobi hudu na matarsa ​​ya sadu da ita, ghusl ya wajaba. (Abu Huraira, da Sahih Musulmi 348).",
      },
      {
        excerpt:
          "Gusl ranar Juma'a wajibi ne akan duk wanda ya balaga. (Abu Sa'id al-Khudri; da kuma Sahih Musulmi 846).",
      },
    ],
    disclaimer:
      "Ko juma'a da masu tuba ghusls na wajaba ne ko nasiha mai karfi ya bambanta ta makaranta da yanayi.",
    appLinks: [{}],
  },
  {
    title: "Mataki-mataki Ghusl",
    summary: "Hanyar annabta - mafi ƙarancin wajibai tare da cikakkiyar sunna.",
    body: [
      "Nana A'ishah ta siffanta zatin Annabi s.a.w daki-daki, kuma daga gare ta ne malamai suka sami mafi qarancin gusli da kuma cikakkiyar tafarkin sunna. Mafi ƙanƙanta shine kawai: niyya da ruwa yana isa ga jiki gaba ɗaya (tare da kurkure baki da hanci ga mutane da yawa). Cikakken hanyar da ke kasa ita ce yadda Annabi SAW da kansa ya yi.",
      "Yi shi ba tare da gaggawa ba, shafa ruwan a saman fata don kada wani abu ya bushe.",
    ],
    steps: [
      {
        title: "Samar da niyya",
        body: "Ka yi nufin a cikin zuciyarka don ɗaga ƙazanta babba (janabah).",
      },
      {
        title: "Tace bismillah a wanke hannu",
        body: "Ku fara da sunan Allah a wanke hannaye biyu.",
      },
      {
        title: "Wanke wuri mai zaman kansa",
        body: "Cire duk wani ƙazanta daga sassa masu zaman kansu da hannun hagu.",
      },
      {
        title: "Yi cikakken alwala",
        body: "Ku yi alwala domin sallah. Kuna iya jinkirta wanke ƙafafu har zuwa ƙarshe idan kuna tsaye a cikin ruwan da aka tattara.",
      },
      {
        title: "Zuba ruwa a kai sau uku",
        body: "Aiki ruwa zuwa fatar kan mutum da tushen gashi.",
      },
      {
        title: "A wanke gefen dama, sannan hagu",
        body: "Zuba ruwa a kan dukkan jiki, farawa da dama.",
      },
      {
        title: "Tabbatar da cikakken ɗaukar hoto",
        body: "Bar wani busassun wuri - underarms, cibiya, bayan gwiwoyi da kunnuwa, da tsakanin yatsun kafa.",
        tip: "Mata ba sa bukatar warware gashin da aka yi masa lanƙwasa, muddin ruwa ya kai ga gashin kai.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Manzon Allah Sallallahu Alaihi Wasallama ya yi wanka daga janabah, sai ya wanke hannunsa, ya yi alwala don yin sallah, sai ya yi ta yatsa a gashin kansa, sannan ya zuba ruwa a kansa sau uku, da sauran sassan jikinsa. ('A'isha)",
      },
    ],
  },
  {
    title: "Kuskuren Ghusl na kowa",
    summary: "Guji busassun wurare, rashin niyya, da kuskuren shawa don ghusl.",
    body: [
      "Babban kuskuren mahimmanci shine ɗaukar shawa na yau da kullun azaman ghusl. Ghusl yana buƙatar niyya don ɗaga manyan ƙazanta; idan ba tare da shi ba, duk tsawon lokacin da kuka wanke, yanayin al'ada ba ya dagawa. Yi niyya kafin farawa.",
      "Kuskuren gama gari na biyu shine barin busassun tabo. Wajibi ne ruwa ya taba jikin gaba daya, don haka rashin kula da saiwar fatar kai, kunnuwa, cibiya, kananun bayansa, ko tsakanin yatsu yana barin hanjin bai cika ba. Shafa ruwan akan waɗannan wuraren don tabbatarwa.",
      "Ga gashi: Ba a buqatar mace mai dunqule gashinta ta warware }awancen, matu}ar ruwa ya kai ga saiwar fatar kai – Manzon Allah Sallallahu Alaihi Wasallama ya gaya wa Ummu Salamah cewa zubar da hannu uku a kai ya wadatar. Gashin mutum, kasancewar yawanci sako-sako ne, yakamata a yi aikin ta yadda ruwa ya kai tushen.",
    ],
    hadith: [
      {
        excerpt:
          "Ya ishe ki ki zuba ruwa kinki uku a kan ki, sa'an nan ki zuba ruwa a kan kanki kina tsarki, ba kwa bukatar ku warware gashin kanki. (Ummu Salamah)",
      },
    ],
    actions: [
      "Fadi niyya kafin zuba na farko, don haka wanke yana ƙidaya a matsayin ƙusa.",
      "Shafa ruwa akan wuraren da aka rasa cikin sauƙi; lokacin da babu tabbas, sake wanke sashe maimakon gamawa cikin shakka.",
    ],
  },
  {
    title: "Menene Tayammum?",
    summary:
      "Busassun tsarkakewa tare da ƙasa mai tsabta lokacin da ba za a iya amfani da ruwa ba.",
    body: [
      "Tayammum (تيمم) shine mai rahama mai maye gurbin wudu ko ghusl a lokacin da ruwa ba ya samuwa ko kuma ba za a iya amfani da shi ba. Maimakon wankewa, mutum ya bugi ƙasa mai tsabta da dabino kuma yana goge fuska da hannaye - kuma wannan yana ɗaukar cikakken wurin tsarkakewar ruwa, yana ba da izinin yin addu'a mai inganci.",
      "Tayammu kyauta ce ga wannan al'ummar musamman: Annabi (SAW) ya ce: \"An sanya min kasa ta zama wurin addu'a da tsarkakewa, ya jera ta a cikin alfarma na musamman da aka ba shi ba ga annabawan farko ba. Ya ƙunshi ka'ida ta tsakiya na addini - wajibi ne ya rage, amma an ɗaga wahala.",
      "Ma'auni ne na wucin gadi: da zarar ruwa ya samu kuma mai amfani, tsarkakewa na yau da kullun tare da ruwa ya dawo. Mutum na iya buqatar sabunta taimiyya a kowace sallah kamar yadda wasu makarantu suka ce.",
    ],
    quran: [
      {
        excerpt:
          "... kuma ba ku sami ruwa ba, sannan ku yi taimiyya da kasa mai tsafta, sannan ku shafe fuskokinku da hannayenku da shi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "An sanya mini ƙasa wurin yin addu'a da abin tsarkakewa. (Jabir - daga cikin abubuwa biyar da aka kebance ga Annabi SAW).",
      },
    ],
  },
  {
    title: "Lokacin da aka halatta Tayamimu",
    summary: "An halatta lokacin da ruwa ba ya nan, mai cutarwa, ko kuma cikin gaggawa don rayuwa.",
    body: [
      "An halatta Tayamum a cikin manyan yanayi guda uku. Na farko, lokacin da ba za a iya samun ruwa ba bayan bincike mai ma'ana - matafiyi a cikin jeji, ko kuma wani da gaske ba tare da samun dama ba. Na biyu, lokacin amfani da ruwa zai haifar da lahani: ga marassa lafiya wanda rauninsa ko rashin lafiyarsa zai yi tsanani, ko kuma cikin tsananin sanyi ba tare da yadda za a dumi ruwa ba da kuma hadarin gaske.",
      "Na uku, lokacin da ake buƙatar ɗan ƙaramin ruwan da ake buƙata don ƙarin larura - kamar sha, don adana rai, ko na mutum ko na wani ko na dabba. A kowane hali shari'a tana auna kiyaye rai da lafiya sama da hanyar tsarkakewa da aka fi so.",
      "Malaman fikihu sun bambanta a kan mafi kyawun ƙofa - nisan da mutum ya kamata ya nemi ruwa, nawa tsoron cutarwa ya isa - amma sun yi ijma'i kan rahamar da ke cikin ƙasa: Ba a taɓa barin ibada, sai dai a sauƙaƙe.",
    ],
    hadith: [
      {
        excerpt:
          "An ruwaito a cikin surori na tayamum: rangwamen tsarkakewa da kasa mai tsafta idan babu ruwa mai amfani.",
      },
    ],
    actions: [
      "Nemo ruwa da kyau kafin tafiya zuwa tayammum.",
      "Idan likita ya ba da shawarar kiyaye rauni ko rashin lafiya a bushe, yi aiki da wannan kuma ku yi tayammum.",
    ],
  },
  {
    title: "Tayamum mataki-mataki",
    summary: "Gajeren, jeri mai sauƙi don ingantaccen bushewa mai inganci.",
    body: [
      "Tayammum gajere ne da gangan - nunin manufarsa a matsayin rangwame cikin wahala. Ana yin shi da tsaftataccen yanayi na ƙasa: ƙasa, yashi, dutse, ko ƙura. Asalinsa tun daga Mujallar Manzon Allah Sallallahu Alaihi Wasallama zuwa ga Ammar bn Yasir, bugun dabino guda ne a doron kasa mai tsafta, sannan a shafa fuska da hannaye.",
      "Wannan ya fi wudu wuta da ƙira, don haka kar a ƙara masa rikitarwa.",
    ],
    steps: [
      {
        title: "Samar da niyya",
        body: "Da nufin dauke kazanta domin ibada.",
      },
      {
        title: "Tace bismillah",
        body: "Ku fara da sunan Allah.",
      },
      {
        title: "Bugi ƙasa mai tsabta sau ɗaya da dabino biyu",
        body: "Sanya dabino a hankali a kan tsabta, ƙura, saman yanayi.",
      },
      {
        title: "Goge fuska",
        body: "Goge fuskar gaba ɗaya sau ɗaya da hannaye biyu.",
      },
      {
        title: "Shafa hannaye",
        body: "Shafa bayan hannayen hannu - zuwa wuyan hannu ta yawancin malamai.",
        tip: "Bi hanyar makaranta ɗaya (hannun hannu da na gaba) akai-akai.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Manzon Allah Sallallahu Alaihi Wasallama ya bugi qasa da tafin hannunsa, sannan ya goge fuskarsa da hannayensa – yana koya wa Ammar cewa wannan ya ishe shi. (Amar bin Yasir)",
      },
    ],
  },
  {
    title: "Me Ke Karya Tayamum?",
    summary:
      "An lalatar da masu karya wudu da aka saba - da kuma ta hanyar dawo da ruwa mai amfani.",
    body: [
      "Taimakon da aka yi a madadin alwala ya lalace da duk wani abu da yake karya alwala: tausasawa da iska da barci mai zurfi da sauransu. Tayammum a madadin ghusl kuma an soke shi da duk wani abu da ke haifar da kazanta babba.",
      "Musamman ma, tayammum yana ƙarewa ta hanyar dawo da abin da aka cire - wato, samun damar samun ruwa mai amfani. Da zarar an sami ruwa ana iya amfani da shi, rangwamen ya ɓace, sai mutum ya koma alwala ko alwala.",
      "Ma'anar rahama a aikace: Idan ka yi sallah da taimama kuma ka sami ruwa daga baya, mafi yawansu suna ganin cewa ba a maimaita sallar da aka kammala ba - an yi ta daidai bisa hukuncin da aka zartar a lokacin. Amma idan ruwa ya bayyana kafin sallah, dole ne a yi amfani da shi.",
    ],
    actions: [
      "Sake duba ruwan da ake samu a farkon kowace lokacin sallah.",
      "Da zaran za a iya amfani da ruwa, komawa zuwa tsarkakewa da ruwa ba tare da bata lokaci ba.",
    ],
    disclaimer:
      "Wasu bayanai - kamar ko ana maimaita addu'a bayan an sami ruwa a cikin lokacinta - sun bambanta da makaranta.",
  },
  {
    title: "Najasa (Najasa)",
    summary: "Najasa ta jiki wacce dole ne a cire daga jiki, tufa, da wurin sallah.",
    body: [
      "Najasah (نجاسة) kazanta ce ta zahiri, wadda ta bambanta da yanayin al'ada na hadath. Misalai bayyanannun da aka amince da su sun haɗa da fitsari da najasa na ɗan adam, da jini mai gudana, nama da fitar alade, da ruwan kare (wanda ke buƙatar takamaiman wanka). Cire najasa daga jiki, da tufafin da ake sawa, da wurin sallah, sharadi ne na sahihin sallah.",
      "Ana cirewa ta hanyar ruwa inda ƙazanta ke iya gani, ana wankewa har sai abin da ya faru ya ɓace. Har ila yau, Musulunci ya dauki mabubbugar najasa da muhimmanci: Annabi SAW ya yi gargadin cewa yawancin azabar kabari na zuwa ne daga rashin kulawa da fitsari - ana fesa shi da rashin tsaftacewa yadda ya kamata.",
      "Makarantun sun bambanta akan rarraba wasu abubuwa (misali, ko an ba da uzuri kaɗan na wasu ruwaye) da kuma abin da aka yarda da su. Ƙa'idar aiki don rayuwar yau da kullum: tsaftacewa sosai, kuma kada ku yi shakka game da tsabta inda babu alamar ƙazanta.",
    ],
    hadith: [
      {
        excerpt:
          "Annabi SAW ya wuce kaburbura guda biyu ya ce ana azabtar da mutanen da ke cikin su - daya saboda yada kazafi, daya kuma saboda bai kare kansa daga fitsarinsa ba. (Ibn Abbas; da Sahih Musulmi 292).",
      },
    ],
  },
  {
    title: "Tsaftace Tufafi daga Najasa",
    summary: "Yadda ake wanke tufa domin yin sallah a cikin sa ya inganta.",
    body: [
      "Idan najasa ta hau kan tufa sai a wanke wurin da abin ya shafa da ruwa har sai an cire abin da ya faru da shi da abin da yake gani. Manzon Allah SAW ya umurci macen da rigarta ya baci da jinin haila da ta goge shi, sannan ta goge shi da ruwa, sannan ta wanke ta, ta yi sallah a cikinsa.",
      "Idan kuma bayan yunƙuri na gaskiya da ƙaƙƙarfan ƙoƙarce-ƙoƙarce, tabon launi ko ƙamshi kaɗan ya rage wanda ba zai fito ba, yawancin malamai suna ba da uzuri ga abin da yake da wuyar cirewa da gaske - wajibi ne a cire abin, ba tabbatar da rini mara tabo ba.",
      "Wasu lokuta suna da nasu sanannun cikakkun bayanai, kamar fitsarin yaro mai shayarwa (wanda aka yayyafawa maimakon a wanke shi gabaɗaya, a cikin rangwamen da aka ruwaito) - don haka koyi hukunce-hukuncen makarantar ku don yanayin da kuke fuskanta.",
    ],
    hadith: [
      {
        excerpt:
          "Dangane da jinin haila akan tufa: a goge shi, sannan a shafa shi da ruwa, sannan a wanke, sannan a yi sallah a cikinsa. (Asma bint Abi Bakr)",
      },
    ],
    actions: [
      "A ajiye aƙalla tufa ɗaya mai tsabta wadda aka keɓe don yin addu'a.",
      "Idan ƙazanta ta taɓa tufafinku daga gida, kurkura abin da za ku iya kuma canza idan zai yiwu.",
    ],
  },
  {
    title: "Tsaftace Jiki",
    summary: "Cire kazanta daga jiki, da ladubban istinja da tsafta.",
    body: [
      "Sai a wanke dattin da ke jikin mutum kafin Sallah, gwargwadon ikonsa. Mafi yawan lokuta shine tsaftacewa bayan yin amfani da bayan gida - istinja - wanda aka yi da ruwa, ko tare da busassun kayan da ya dace, har sai wurin ya kasance mai tsabta. Manzon Allah ﷺ ya koyar da tsaftar tsafta bayan ya huce kuma ya hana amfani da hannun dama akansa.",
      "Bayan gusar da kazanta, Musulunci ya kwadaitar da tushen tsaftar dabi'a (fitrah) da ke sanya jiki tsafta da shirye-shiryen ibada: datse farce, cire gashin hannu da kuma makamantansu, akai-akai.",
      "Wadannan ayyuka ba kyawawan al'adu ba ne kawai - suna daga cikin mutunci da tsafta wanda mumini yake gabatar da kansa a gaban Allah da addu'a.",
    ],
    hadith: [
      {
        excerpt: "Annabi SAW ya kasance yana wanke kansa da ruwa bayan ya huta. (Anas)",
      },
    ],
    actions: [
      "Koyaushe cika istinja kafin alwala bayan amfani da bandaki.",
      "Ɗaukar kyallen takarda da, inda za ku iya, hanyar ruwa yayin tafiya.",
    ],
  },
  {
    title: "Tsaftace Wuraren Sallah",
    summary: "Dole ne wurin sallah ya zama mara ƙazanta sananne - ba tare da shakka mara tushe ba.",
    body: [
      "Lallai ne wurin sallah ya kasance babu najasa da aka sani. Manzon Allah SAW ya koyar da haka karara cewa: A lokacin da wani Badawiyya yayi fitsari a kusurwar masallaci, sai ya hana Sahabbai daga tsawatar masa da kakkausan harshe, ya bar shi ya gama, sannan ya yi umarni da a zuba bokitin ruwa a wurin, yana karantar da tsafta da tausasawa.",
      "Ka'idar mulki ta tabbata. An mayar da ƙasa gabaɗaya wurin addu'a, don haka a ɗauka cewa saman yana da tsabta sai dai idan kuna da ainihin ƙazanta. Idan kun san ƙazanta yana nan, cire shi ko matsa zuwa wuri mai tsabta; idan kawai kuna tunanin zai iya kasancewa a wurin, yi watsi da raɗaɗin kuma ku ci gaba.",
      "Wannan ma'auni yana kiyaye ibada daga bangarori biyu: yin addu'a ba tare da kulawa ba a kan kasa a fili, da gurgunta shi da zato mara tushe game da kowane saman.",
    ],
    hadith: [
      {
        excerpt:
          "A lokacin da wani Badawiyya yayi fitsari a masallaci, Annabi SAW ya yi umarni da a zuba bokitin ruwa a kai. (Abu Huraira)",
      },
    ],
    actions: [
      "Kallan tabarma ka da falon kafin sallah.",
      "Ba tare da ainihin ƙazanta ba, a watsar da ɓarna marar tushe da addu'a.",
    ],
  },
  {
    title: "Hayd da tsarki",
    summary: "Haila da jinin haihuwa suna dauke da hukunce-hukuncen tsarkakewa nasu.",
    body: [
      "Lokacin jinin haila (hayd) da jinin haihuwa (nifas), mace ba ta sallah, kuma - don rahamar addini - ba a yin sallar da aka rasa a wannan lokacin daga baya. Wannan ya tabbata: Lokacin da aka tambayi A’ishah me ya sa mai haila take yin azuminta amma ba sallarta ba, sai ta tabbatar da cewa haka aka umarce su.",
      "Azumi daban-daban: Azumin da aka rasa a watan Ramadan saboda haila ana yin sa ne daga baya, yayin da ake daga sallah. Idan jinin ya kare sai alamar tsarki ta bayyana, sai macen ta yi alwala ta koma sallah da azumi.",
      "Matsakaicin mafi ƙarancin lokacin hayd da nifas, da yadda ake karanta alamomin tsaftar iyaka, batutuwa ne da makarantu suka bambanta dalla-dalla. Mata suna amfana da koyon hukunce-hukunce a aikace na makaranta guda amintacciyar makaranta tare da ƙwararren malami.",
    ],
    hadith: [
      {
        excerpt:
          "Da aka tambaye ta me ya sa mace mai haila ta yi azumi amma ba ta yin sallah, Aisha ta ce: An umarce mu da mu rama azumi, ba a kuma umarce mu da mu rama sallah ba. (Mu'adhah, daga Aishah; da kuma Sahih Musulmi 335).",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Tambayoyin da ake yawan yi",
    summary: "Takaitattun amsoshi ga mafi yawan abubuwan da suka shafi tsarkakewa da shakku.",
    body: [
      "Shakka ya karya alwala? A'a. Idan kana da alwala kuma kawai ba ka da tabbacin ko ka fasa, alwalarka ta tsaya har sai ka tabbatar da mai warwarewa. Yin aiki da yaƙĩni akan zato shine ƙa'idar annabci da ke ba ka kariya daga shakku mai tsauri (waswas).",
      "Me game da simintin gyare-gyare, bandeji, da raunuka? Akwai rangwame. Inda wanke hannu da aka rufe yana da cutarwa, za ku iya shafa kan rigar (mash'ala al-jabirah) a wurinsa, kuma tayammum ta rufe abin da ba za a iya isa ba - bayanan sun bambanta da makaranta da yanayi.",
      "Idan ba zan iya amfani da ruwa ba fa? Tayammu tare da ƙasa mai tsafta ya kasance cikakke aiki har sai ikon amfani da ruwa ya dawo.",
      "Me game da yanayi na yau da kullun - ci gaba da zubar jini (istihadah) ko rashin natsuwa? Ana yi wa mutum uzuri akai-akai (ma'dhur): suna wanke kansu suna yin alwala a lokutan kowace sallah, sannan su yi addu'a ko da fitar ruwa ya ci gaba, kuma ba ta bata wannan sallar ba.",
    ],
    actions: [
      "Kada ka bari shakka akai-akai ya toshe ibadarka - ka bi yakini, ba zato ba.",
      "Don yanayi na yau da kullun ko hadaddun lamura, sami wani keɓaɓɓen hukunci daga ƙwararren malami.",
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Waɗannan amsoshi na FAQ taƙaitaccen bayani ne na ilimi, ba fatawar mutum ba. Yakamata a sake duba shari'o'i masu rikitarwa ko na yau da kullun tare da wani masani na gida.",
  },
  {
    title: "Nassoshi da Karin Nazari",
    summary: "Asalin ayoyin Alqur'ani da surorin hadisi akan tsarkakewa.",
    body: [
      "Asalin nassin Alkur'ani don tsarkakewa shi ne ayar alwala, suratu al-Ma'idah 5:6, wadda ta shimfida alwala da gusl da taimiyya tare; tare da shi, 2:222 ('Allah yana son masu tsarkakewa') da ayoyi a kan tsarkin ruwa (25:48) sun tsayar da batun.",
      "A cikin Sunnah, tushen farko shine Littattafan tsarkakewa (Kitab al-Taharah / al-Wudu / al-Ghusl / al-Hayd) waɗanda suke buɗe Sahihul Bukhari da Sahihu Musulmi, sannan kuma babi iri ɗaya a cikin Sunan huɗu (Abu Dawud, at-Tirmidhi, an-Nasa'i, Ibn Majah), waɗanda suka tattara hukunci mai tsauri.",
      "Dangane da hukunce-hukunce hukunce hukunce hukunce hukunce hukunce-hukuncen fiqhu na mazhabobin Ahlus-Sunnah guda hudu sun ba da cikakken matsayi - kuma bambance-bambancen su wani bangare ne na halal na al'ada, ba aibi ba. Yi amfani da wannan ƙa'idar don ƙayyadaddun tsari, sannan zurfafa nazarin ku tare da ƙwararren malami da matani na farko.",
    ],
    quran: [{}, {}],
    hadith: [
      {
        excerpt: "Cikakken surori akan wudu, ghusl, tayamum, da hayd waɗanda suke buɗe tarin.",
      },
      {
        excerpt:
          "Littafin tsarkakewa - ingantattun rahotanni akan hukunce-hukuncen taharah, da'a, da ka'idoji.",
      },
    ],
    actions: [
      "Bi amintaccen manhaja guda ɗaya don guje wa ruɗani daga tarwatsa hukunce-hukunce.",
      "Sake ziyartan waɗannan batutuwa lokaci-lokaci har sai ingantaccen tabbaci ya tsaya tsayin daka.",
    ],
    appLinks: [{}, {}],
  },
];

export const TAHARAH_CHECKLIST_HA: DeepPartial<TaharahChecklistItem>[] = [
  {
    title: "Alwala kafin Asuba",
    hint: "Fara ranar a cikin yanayin tsarki idan zai yiwu.",
  },
  {
    title: "Siwak / goge hakora",
    hint: "Sunnah kafin alwala da kafin sallah.",
  },
  {
    title: "Tufafin sallah babu najasa",
    hint: "A duba rashin tsarkin da ake iya gani kafin sallah.",
  },
  {
    title: "Tsaftace wurin sallah",
    hint: "Cire duk wani abu mai najasa daga inda kuke sallah.",
  },
  {
    title: "Sabunta wudu bayan masu warwarewa",
    hint: "Iska, barci, bayan gida - san abin da ke karya wudu.",
  },
  {
    title: "Ghusl lokacin da ake buƙata",
    hint: "Bayan babban kazanta, haila ta ƙare, ko zubar jini na haihuwa.",
  },
];
