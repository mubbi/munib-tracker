// Hausa translation overlay for the Learn "Prophets" content. Mirrors the order of
// its English source in ../prophets*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { ProphetsTimelineEvent, ProphetsTopic } from "../../types/prophets";
import type { DeepPartial } from "./localize";

export const PROPHETS_TOPICS_HA: DeepPartial<ProphetsTopic>[] = [
  {
    title: "Gabatarwa ga Annabawa",
    summary: "Me yasa Allah ya aiko da annabawa kuma me yasa labaran su ke da muhimmanci a yanzu.",
    body: [
      "Allah ya aiko annabawa a matsayin rahama da shiriya da hujja domin mutane su san shi, su bauta masa daidai, kuma su rayu da adalci da manufa.",
      "Labarunsu a cikin Kur'ani ba tarihi ne mai nisa kawai ba; darasi ne masu amfani na imani, hakuri, rayuwar iyali, jagoranci, da tuba.",
      "Imani da dukkan annabawa bangare ne na imani. Musulmai suna girmama su baki daya, su guji wuce gona da iri, kuma su bi sakon karshe da Muhammadu SAW ya zo da shi.",
    ],
    quran: [
      {
        excerpt:
          "Manzanni mãsu bãyar da bushãra kuma mãsu gargaɗi dõmin kada wata hujja ta kasance ga mutãne a kan Allah bãyan Manzanni.",
      },
      {
        excerpt:
          'Kuma lalle ne, haƙĩƙa, Mun aika a cikin kõwace al\'umma da Manzo: "Ku bauta wa Allah, kuma ku nĩsanci abubuwan shirki."',
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Menene Annabi a Musulunci?",
    summary: "Zaɓaɓɓen mutum wanda yake karɓar wahayi kuma yana kiran mutane zuwa ga Allah.",
    body: [
      "Annabi mutum ne da Allah ya zaba domin ya karbi wahayi da shiryar da mutane zuwa ga tauhidi, ibada, da aiki na gari.",
      "Annabawa ba allahntaka ba ne kuma ba a bauta musu. Sune mafificin halitta wajen xa'a, da xa'a, da rikon amana, tare da sauran bayin Allah.",
      "Aikinsu guda daya ne a asasi: bauta wa Allah Shi kadai. Takaitattun bayanan shari'a na iya bambanta a cikin al'ummomi da hikimar Allah.",
    ],
    quran: [
      {
        excerpt:
          'Manzanninsu suka ce musu: "Ba mu zama ba fãce maza ne misãlanku, kuma amma Allah Yana yin falala a kan wanda Yake so daga cikin bãyinSa."',
      },
      {
        excerpt:
          'Kuma ba Mu aika wani Manzo ba a gabãninka, fãce dai Mun yi wahayi zuwa gare shi cewa: "Bãbu abin bautãwa fãce Ni, sai ku bauta Mini."',
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nabi vs Rasulullahi",
    summary: "Bambanci mai amfani a cikin malanta, yayin da duka biyu annabawa ne masu daraja.",
    body: [
      "A ilimin addinin Musulunci, abin da ya bambanta shi ne kowane rasul nabi ne, amma ba kowane nabi ne rasul ba. Sau da yawa ana bayyana rasul a matsayin wanda aka aiko da wani takamaiman umarni ga mutane, yayin da nabi ya ci gaba da shiriya ta hanyar wahayi.",
      "Kur'ani ya yi amfani da kalmomi guda biyu tare da girmamawa, kuma Musulmai sun yi imani da dukkan annabawa da manzanni ba tare da kin kowa ba.",
      "Daidaitaccen ma'anar fasaha na iya bambanta ta hanyar jimla na ilimi, amma darasin aiki ya yi daidai: karbi wahayi da tawali'u kuma a bi shiriyar Allah.",
    ],
    quran: [
      {
        excerpt: "An zabe shi, kuma ya kasance manzo kuma annabi.",
      },
      {
        excerpt: "Ba Mu rarrabewa a tsakanin daya daga manzanninSa.",
      },
    ],
    disclaimer:
      "An gabatar da cikakkun bayanai na ƙamus ta hanya mai faɗi, na ilimi ba tare da tsangwama ba; tuntuɓi ƙwararrun malamai don ci-gaban ilimin tauhidi.",
    appLinks: [{}],
  },
  {
    title: "Adamu (AS)",
    summary:
      "Mutum na farko kuma na farko, wanda aka girmama da ilimi kuma an jarrabe shi da biyayya.",
    body: [
      "Annabi Adam (a.s) shi ne inda tarihin dan Adam da Annabci yake farawa. Kuma Allah ya halicce shi da hannuwanSa daga yumbu, kuma Ya hura a cikinsa daga ruhinSa, kuma Ya sanar da shi sunayen dukkan kõme. A lokacin da aka umurci mala’iku da su yi sujada ga Adamu don girmamawa, sai suka yi biyayya – amma Iblis ya ki saboda girman kai, kuma daga wannan lokacin aka bayyana kiyayyarsa ga Adamu da zuriyarsa. Wannan fage na buɗewa ya kafa babban wasan kwaikwayo na kowane rayuwar ɗan adam: zaɓi tsakanin biyayya tawali'u da tawaye na fahariya (Alkur'ani 2:30-39).",
      "Allah ya sanya Adamu da matarsa ​​Hawwa a cikin Aljanna kuma ya halatta musu komai sai itace guda. Sai Shaidan ya yi waswasi da shi, suka ci daga gare ta. Amma ku lura da bambancin da ke tsakaninsu da Iblis: Iblis ya baratar da zunubinsa, yayin da Adamu da Hawwa suka yi nadama nan da nan suka koma ga Allah da kalmomin da ya koyar da su — ‘Ya Ubangijinmu! Allah ya karbi tubansu ya aiko su duniya da alkawarin shiriya ga duk wanda zai bi.",
      "Darasi na Adamu shine darasin bege: mutum yana da girma da daraja, duk da haka an gwada shi kuma zai zame. Abin da ke bayyana mumini ba shi da zunubi - Allah ne kawai cikakke - amma yana dawowa da sauri da gaskiya cikin tawbah. Har ila yau, labarin Adamu ya koyar da cewa Shaidan maƙiyi ne bayyananne, bayyani, wanda makaminsa kaɗai ke yin waswasi; amsar ita ce ambaton Allah da neman gafararSa. Tun daga Adamu zuwa gaba, saukowar duniya ba horo ba ne amma matakin gwajin ɗan adam na gaske.",
    ],
    profile: {
      nation: "Farkon ɗan adam",
      location: "Jannah sai kasa",
      era: "Farkon tarihin ɗan adam",
      mission: "Koyar da tauhidi da biyayya ga Allah ga mutanen farko.",
      challenges: ["Kiyayyar Iblis", "Rayuwa bayan saukowa duniya", "Yin ja-gorar iyali na farko"],
      miracles: [
        "Halittu da izinin Allah ba tare da iyaye ba",
        "Ana karantar da sunayen kowane abu",
      ],
      majorEvents: [
        "Halittar Adamu da koyar da sunaye",
        "Sujjadar Mala'iku da kin Iblis",
        "Zamewa a cikin Aljanna, tuba na gaskiya, da saukowa zuwa ga ƙasa",
      ],
      lessons: [
        "Girman mutum yana zuwa tare da alhakin",
        "Tuba ta gaskiya tana sake buɗe kofa bayan kowane kuskure",
        "Shaidan makiyi ne bayyananne, dindindin",
      ],
      facts: [
        "Adamu shine mutum na farko kuma shine annabi na farko",
        "Tubansa ita ce tafarki Alqur'ani na farko na tawbah",
      ],
    },
    quran: [
      {
        excerpt:
          'Kuma (ka ambaci) a lõkacin da Ubangijinka Ya ce wa malã\'iku: "Lalle ne Nĩ, in sanya wani dalĩli a cikin ƙasa madaidaici... Sai Ãdam ya karɓi kalmõmi daga Ubangijinsa, kuma Ya karɓi tũbarsa."',
      },
      {
        excerpt: 'Suka ce: "Ya Ubangijinmu!',
      },
    ],
    hadith: [
      {
        excerpt:
          'Kuma a Rãnar ¡iyãma mutãne zã su je wa Adama, su ce: "Kai ne uban mutãne; Ka yi mana ceto a wurin Ubangijinka.',
      },
      {
        excerpt:
          "Adamu da Musa suka yi gardama. Musa ya ce: Kai ne wanda Allah ya halitta da hannunsa. Adamu ya ce: Shin kuna zargina da wani al'amari da Allah ya rubuta a gare ni kafin ya halicce ni? Don haka Adamu ya yi galaba a kan Musa a jayayya.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Idris (AS)",
    summary:
      "Annabi mai gaskiya yabo da hakuri, kuma Allah ya daukaka shi zuwa ga wani babban matsayi.",
    body: [
      "An ambaci Idris (amincin Allah ya tabbata a gare shi) a taqaice a cikin Alkur’ani, amma duk wata magana game da shi abin yabo ne. Allah ya kira shi 'mutumin gaskiya, Annabi' (Alkur'ani 19:56) kuma ya lissafa shi a cikin masu hakuri da salihai tare da Ismail da Dhul-Kifl (Alkur'ani 21:85-86). Labarinsa ya nuna cewa a wurin Allah, halayen mutum - gaskiya, hakuri, tsayin daka - ya fi tsayin tarihin rayuwarsa.",
      'Allah Ya ce game da shi: "Kuma Muka daukaka shi zuwa ga wani matsayi babba" (k:19:57). Malamai sun fahimci haka ne domin suna nuni zuwa ga daukakar darajarsa a wurin Allah. Bayan abin da Alkur’ani da ingantattun rahotanni suka tabbatar, shahararriyar tatsuniyoyi da aka danganta da Idris (kamar kasancewarsa farkon wanda aka rubuta da alkalami ko wasu sana’o’in duniya) ba a kafa su ta hanyar ingantacciyar hujja ba, don haka mumini mai taka tsantsan ya kiyaye abin da wahayi ya tabbatar da shi maimakon yin ado.',
      "Darasin Idris shi ne kusanci ga Allah ba a auna shi da shahara ko dogon labari, sai dai ta hanyar ikhlasi da daidaito. Bawa mai natsuwa, mai gaskiya, mai tsayin daka zai iya rike tasha a wurin Allah fiye da wadanda tarihi ke tunawa da sunayensu.",
    ],
    profile: {
      era: "Zamanin farko bayan Adamu",
      mission: "Ka kira mutane su bauta wa Allah da gaskiya da adalci.",
      lessons: [
        "Gaskiya tana daukaka darajar bawa",
        "Ba kowane labarin annabi ba ne dalla-dalla - kuma wannan bisa tsari ne",
        "Tsayayye, daidaiton aminci abin so ne ga Allah",
      ],
      facts: [
        "Sunansa a cikin Alkur'ani mai gaskiya kuma Annabi",
        "Wanda aka siffanta da cewa Allah ya daga darajarsa",
      ],
    },
    quran: [
      {
        excerpt:
          "Kuma ka ambaci Idris a cikin Littafi. Lalle shi, ya kasance mai gaskiya kuma Annabi. Kuma Muka ɗaukaka shi zuwa ga matsayi maɗaukaki.",
      },
      {
        excerpt:
          "Da Isma'ila da Idrisu da Zul-kifli dukkansu suna daga masu hakuri. Kuma Muka shigar da su a cikin rahamarMu. Lalle sũ, sun kasance daga sãlihai.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nuhu (AS)",
    summary:
      "Manzo mai haƙuri mai ban mamaki wanda ya kira mutanensa shekaru aru-aru kafin rigyawa.",
    body: [
      "An aika Nuhu (a.s) zuwa ga wasu mutanen da suka bar tauhidi suka tafi da su zuwa ga bautar gumaka. Saƙonsa guda ɗaya, wanda ba ya gushewa shi ne: 'Ya ku mutanena, ku bauta wa Allah; ba ku da wani abin bautãwa waninSa.” (k:7:59). Kur’ani ya adana nasa labarin aikin a cikin suratu Nuhu: ya kira su dare da rana, a bayyane da boye, yana ba da kwadaitarwa da gargadi – yana tunatar da su cewa komawa ga Allah yana kawo ruwan sama, da dukiya, da ‘ya’ya, da gonaki. Amma duk da haka tsara bayan tsara, mafi yawansu sun bijire, suka sa yatsu a cikin kunnuwansu, kuma suka ƙara girman kai kawai (Alkur'ani 71:1-28).",
      "Kur'ani ya nanata girman tsayin hakurinsa: ya zauna a cikinsu 'shekaru dubu kasa da hamsin' (Alkur'ani 29:14), kuma har yanzu 'yan kadan ne suka gaskata. Lokacin da ya bayyana cewa ba zai ƙara yarda da imani ba, sai Allah ya umarce shi da ya gina jirgin bisa ga umarnin Allah, alhali kuwa kafirai suna izgili. Sa'an nan ruwan ambaliya ya zo a matsayin hukunci. Ɗan Nuhu ya ƙi shiga, yana dogara ga dutse bisa gargaɗin ubansa, kuma yana cikin waɗanda aka nutse - abin tunasarwa cewa haɗin jini ba zai iya maye gurbin bangaskiya ba (Qur'ani 11:42-46).",
      "Labarin Nuhu shine babban darasi na Alkur'ani a da'awa: aikin mai kira na gaskiya ne, hakuri, isarwa bayyananne - sakamako na Allah ne Shi kadai. Har ila yau, tana karantar da cewa shiriya al'amari ne na zuciya, ba nasaba ba: an iya rasa ɗan annabi, yayin da baƙi za su iya tsira. Muminai wadanda suka hau jirgin sun zama zuriyar dan Adam da aka sabunta, kuma an girmama Nuhu a matsayin daya daga cikin manya-manyan manzanni biyar masu tabbatar da azama (ulul-'azm).",
    ],
    profile: {
      nation: "Mutanensa kafin rigyawa",
      location: "Yankin Mesopotamiya na da (wanda aka ambata)",
      era: "Da wuri sosai",
      mission: "Ka kira mutanensa zuwa ga tauhidi da tuba.",
      challenges: [
        "Ba'a daga shugabanni da manyan mutane",
        "Ƙarnuka na ƙin yarda tare da masu bi kaɗan",
        "Kafirci da nutsewar dansa",
      ],
      miracles: ["Jirgin ya gina ta bisa koyarwar Allah", "Ceton muminai ta wurin tufana"],
      majorEvents: [
        "Kira zuwa ga tauhidi yana kusan shekaru dubu",
        "Gina jirgin da izinin Allah",
        "Tufana da sabon mafari ga muminai",
      ],
      lessons: [
        "Dagewa da da'awah, barwa Allah sakamako",
        "Dangantakar iyali ba zai iya maye gurbin bangaskiya ba",
        "Allah kullum yana ceton masu gaskiya",
      ],
      facts: [
        "Daya daga cikin manzanni biyar masu tsayuwa (ulul-'azm)",
        "Labarinsa ya zo a cikin surori da yawa, ciki har da wanda aka sanya masa suna",
      ],
    },
    quran: [
      {
        excerpt:
          'Kuma aka yi wahayi zuwa ga Nũhu cewa: "Lalle ne kõwa daga mutãnenka bã zai yi ĩmãni ba fãce waɗanda suka yi ĩmãni, sabõda haka kada abin da suka kasance sunã aikatãwa ya ɓãta maka rai."',
      },
      {
        excerpt:
          'Ya ce: "Ya Ubangijĩna! Lalle ne nã kiran mutãnena dare da yini, kuma amma kirana bai ƙãra musu kõme ba fãce gudu."',
      },
    ],
    hadith: [
      {
        excerpt:
          "Sai mutane su zo wajen Nuhu su ce: Ya Nuhu, kai ne farkon manzanni zuwa ga mutanen kasa, kuma Allah ya sanya maka sunan bawa mai godiya; yi mana roko.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Hudu (AS)",
    summary:
      "An aika zuwa ga Adawa, mutane maɗaukaki ne maɗaukaki waɗanda suka bar ƙarfinsu ya zama girman kai.",
    body: [
      "An aiko da Hud (amincin Allah ya tabbata a gare shi) zuwa ga mutanen Adawa, wayewar da Kur'ani ya kwatanta da ƙarfin jiki kuma ya shahara wajen gina dogayen gine-gine masu ƙayyadaddun abubuwa waɗanda ba a taɓa yin irin su a cikin ƙasa ba (Qur'ani 89:6-8). Zuwa ga wannan mutane masu girman kai, Hud, ya zo da saƙo guda ɗaya da kowane annabi: 'Ya ku mutanena, ku bauta wa Allah; Ba ku da wani abin bautãwa waninSa. Ashe, bã zã ku yi taƙawa ba? (Alkur'ani 7:65). Ya kasance daga nasu, ba ya neman lada, sai dai yana kiran su zuwa ga godiya da nisantar zalunci.",
      "Shugabanninsu suka amsa da ba'a, suna zarginsa da wauta da ƙarya, suna manne da gumaka na kakanninsu. Sun kalubalanci shi da ya kawo hukuncin da ya yi kashedin a kai, da tabbacin cewa babu wani karfi da zai iya kama da karfinsu (Alkur'ani 46:21-25). Hudu ya gargaɗe su a sarari cewa ikon duniya da wayewa mai girma ba su kare wanda ya ƙaryata game da ayoyin Allah, kuma ya yi girman kai a cikin ƙasa.",
      "Hukuncin ya zo ne a matsayin iska mai tsananin zafi, mai hayaniya wadda Allah ‘ya dora musu dare bakwai da yini takwas a jere’ (Alkur’ani 69:6–7), ya bar mutanen da suka taba fada a cikin kututtuka, alhali kuwa Hudu da muminai sun sami tsira da rahamar Allah. An sake maimaita labarin Ad a cikin Alkur'ani a matsayin gargadi na tsaye: karfi, dukiya, da nasara kyauta ne da za a hadu da tawali'u da godiya, ba girman kai ba. Al'umma tana da hisabi ga Allah komai ci gabanta.",
    ],
    profile: {
      nation: "Mutanen 'Ad",
      location: "yankin Al-Ahqaf (yankin kudancin Larabawa a cikin tafsiri na gargajiya)",
      era: "Bayan Nuhu",
      mission: "Dawo da tauhidi, godiya, da adalci a tsakanin Ad.",
      challenges: [
        "Girman kai na gama kai da aka gina bisa ƙarfi da wadata",
        "izgili da wahayi da annabi",
        "Bukatar rashin amincewa da hukuncin gaggawa",
      ],
      miracles: ["Kariyar muminai a lokacin azaba"],
      majorEvents: [
        "Kira zuwa ga tuba da godiya",
        "Gargadi na iska mai tsanani",
        "Halakar Adawa a darare bakwai da kwana takwas",
      ],
      lessons: [
        "Ƙarfi ba tare da tawali'u ba yana kaiwa ga lalacewa",
        "Al'ummai da wayewa suna da hisabi ga Allah",
        "Gargadin annabci rahama ce da aka aiko kafin hukunci",
      ],
      facts: ["Labarin Ad ya sake faruwa a cikin Alkur'ani don gargadi ga al'ummomi na gaba"],
    },
    quran: [
      {
        excerpt:
          "Kuma zuwa ga Ãdãwa (Mun aika) ɗan´uwansu Hũdu. Ya ce: Ya ku mutanena ku bauta wa Allah; Ba ku da wani abin bautãwa waninSa. Ashe, bã zã ku ji tsõronSa ba?",
      },
      {
        excerpt:
          'To, a lõkacin da suka gan shi, kamar girgije yana gabãta kwarurukansu, suka ce: "Wannan girgije ne, Yanã zo mana da ruwa." Ã\'a, shĩ ne abin da kuka yi haƙuri sabõda shi, iska ce a cikinta, azãba mai raɗaɗi.',
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Salih (AS)",
    summary:
      "An aika zuwa ga Samudawa, aka ba su mu'ujizar raƙumar, kuma suka lalatar da alamar da suka nema.",
    body: [
      "An aika Salihu (amincin Allah ya tabbata a gare shi) zuwa ga Samudawa, mutanen da suka gaji Adawa kuma sun shahara wajen sassaka manyan gidaje a cikin duwatsu da zama cikin nutsuwa (Alkur'ani 7:74). Ya kira su, a matsayinsu na ‘yan’uwansu, su bauta wa Allah Shi kadai, su yi watsi da fasadi na shugabanninsu. A lokacin da suka nemi wata aya domin su tabbatar da gaskiyarsa, sai Allah Ya ba da bayyanannen rakumi: Rakumi, da tsari, yana sha a cikin wani yini da aka sani, su kuma a wani yini (Alkur'ani 26:155-156).",
      "Salih ya gargaɗe su da cewa: “Kada ku taɓa ta da cutarwa, har ku kasance a cikin azaba makusanciya.” (k:26:156). Alamar gwaji ce ta kamewa - shin za su iya girmama iyakar da Allah ya kafa? Amma mafi girman kai daga cikinsu, ya sare rakumar a cikin tawaye, sa'an nan kuma ya kalubalanci Salih da ya zo da azabar da aka yi alkawari (Alkur'ani 7:77). Kisan rakumin ana kiransa da aikin miyagu, duk da haka jama'a duka sun yi tarayya cikin aikata laifin ta hanyar yarda da shi.",
      "Azãba ta auku a cikin kwanaki uku: tsãwa mai girma da girgizar ƙasa ta kãma su a cikin gidãjensu, kuma Samũdãwa sun kasance bã su da rai, kuma Allah Ya kuɓutar da Salih da waɗanda suka yi ĩmãni (Alƙur'ãni 7:78-79; 91:14). Darasin yana da kaifi: mu'ujizai ba sa tausasa zuciya mai taurin kai; kawai suna tayar da haƙƙin haƙƙin haƙƙin mallaka. Alamar da aka nema sannan aka bijirewa ta zama hujja akan wadanda suka nema. Kuma yin shiru a gaban mugunta ba tsaka-tsaki ba ne - wata al'umma ce ke da alhakin ayyukan wasu kaɗan.",
    ],
    profile: {
      nation: "Mutanen Samudawa",
      location: "Al-Hijir / arewa maso yammacin Larabawa",
      era: "Bayan 'Ad",
      mission: "Ka kira Samudawa daga shirka da fasadi zuwa ga tauhidi.",
      challenges: [
        "Bukatar mu'ujiza, sannan ƙin yarda da ita",
        "Buɗe ƙin yarda bayan an ba da alamar bayyananne",
        "Barazana ga Salihu da muminai",
      ],
      miracles: ["Rakumar nan ta aiko da wata aya bayyananna daga Allah"],
      majorEvents: [
        "Fitowar rakumi da ruwan raba",
        "Cin duri da kashe rakumin",
        "Harin da ya halaka masu karyatawa",
      ],
      lessons: [
        "Mu'ujiza ba sa amfanar zuciya mai taurin kai",
        "karya iyaka da Allah ya tsara yana da sakamako na hakika",
        "Yarda da mummuna rabo a cikin laifinsa",
      ],
      facts: ["An san Samudawa da sassaƙa gidaje a cikin tsaunuka"],
    },
    quran: [
      {
        excerpt:
          "Waccan rãƙumar Allah ce aya a gare ku, sabõda haka ku bar ta ta ci a cikin ƙasar Allah, kuma kada ku shãfe ta da wata cũta, har azãba mai raɗaɗi ta same ku.",
      },
      {
        excerpt:
          "Samũdãwa sun ƙaryata, sabõda zãluncinsu, a lõkacin da aka aiko mafi shaƙãwa daga gare su... Sai Ubangijinsu Ya halakar da su sabõda zunubinsu, kuma Ya daidaita su.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ibrahim (AS)",
    summary:
      "Khalilullah, abokin Allah kuma abin koyi na tauhidi tsantsa, ya jarrabe shi da nasara a kowace jarrabawa.",
    body: [
      "Ibrahim (amincin Allah ya tabbata a gare shi) shi ne babban misali na Alkur'ani na tsantsar tauhidi da aka samu ta hanyar tunani da jajircewa. Sa’ad da yake matashi a cikin al’umma yana nutsewa cikin bautar gumaka, ya yi magana a fili tare da mutanensa, mahaifinsa, har ma da sarki: rana, wata, da taurari duk sun shuɗe, to ta yaya za su zama alloli? (Alkurani 6:75-79). Don ya fallasa rashin ƙarfi na gumaka, ya karya su duka amma mafi girma kuma ya gaya wa mutanensa su tambayi gumaka da kansu abin da ya faru - tilasta su yarda da gumakansu ba za su iya magana ko kare kansu ba (Alkur'ani 21: 57-67).",
      "Domin wannan tsayuwar aka jefa shi a cikin wata wuta mai tsanani, amma Allah ya yi umarni, 'Ya wuta, ki kasance sanyi da aminci ga Ibrahim' (Alkur'ani 21:69), kuma ya fito ba tare da wani rauni ba. Rayuwarsa ta zama jerin fitintinu da suka hadu da mika wuya gaba daya: ya bar kasarsa saboda Allah, ya yi addu’a ga zuri’a salihai tun yana tsufa kuma aka ba shi Ismail da Ishaq, aka jarrabe shi da umurnin yanka dansa abin kaunarsa – wanda uba da dansa suka yarda da su a mika wuya kafin Allah ya fanshi yaron – kuma ya tayar da harsashin Ka’aba a Makka tare da Isma’ila, yana yi musu addu’a ga al’ummar Muminai (Alkur’ani da za a aiko musu da al’ummar muminai daga cikin muminai). 2:124–129; 37:100–107).",
      "Saboda wannan ibadar da ba ta misaltuwa, Allah ya dauki Ibrahim a matsayin khalil – abokin tarayya na kud-da-kud (Qur’an 4:125) – kuma ya sanya shi limami, shugaba ga dukkan bil’adama (Qur’an 2:124). Gadonsa ya gudana ta hanyar annabawan da suka zo daga zuriyarsa, da ayyukan Hajji, da kuma ainihin musulmi, wanda aka umurce shi da ya bi ‘addinin Ibrahim, yana karkata zuwa ga gaskiya’ (Alkur’ani 3:95). Labarinsa yana koyar da tawakkul a cikin gwaji mafi wuya, cewa jagoranci na gaskiya yana ginu akan sadaukarwa, kuma bangaskiya ta gaskiya tana iya sake fasalin tsararraki.",
    ],
    profile: {
      nation: "Al'ummar Mesopotamiya da Levantine",
      location: "Iraki, Levant, Makkah",
      era: "Tsakanin zamani",
      mission: "Rayar da tauhidi zalla kuma a tabbatar da gadon mika wuya.",
      challenges: [
        "Fuskantar masu bautar gumaka, mahaifinsa, da azzalumin sarki",
        "Ka yi hijira daga mahaifarsa don Allah",
        "Jarabawar sadaukarwa dansa abin so",
      ],
      miracles: [
        "Wutar ta yi sanyi da aminci da izinin Allah",
        "Zuriya masu adalci da aka ba su a cikin tsufa",
      ],
      majorEvents: [
        "Muhawara da karya gumaka",
        "Ana jefa shi cikin wuta kuma a kai",
        "Gina Ka'aba da Isma'il da babbar jarabawar sadaukarwa",
      ],
      lessons: [
        "Tawakkul (tawakkali ga Allah) a cikin mafi tsananin jarrabawa",
        "Jagoranci na gaskiya yana bukatar sadaukarwa",
        "Bangaskiya na gaskiya na iya sake fasalin tsararraki",
      ],
      facts: [
        "Wanda aka fi sani da Khalilullah, aminin Allah na kusa",
        "Kakan annabawa ta hanyar Ismail da Ishaq",
      ],
    },
    quran: [
      {
        excerpt:
          'Kuma (ka ambaci) a lõkacin da Ubangijinsa Ya jarrabe shi da umurni, sai ya cika su. Ya ce: "Lalle ne ni, Mai sanya ka shugaba ga mutãne."',
      },
      {
        excerpt:
          "Muka ce: Ya wuta, ki kasance sanyi da aminci ga Ibrahim. Kuma suka yi nufin cũta a gare shi, sai Muka sanya su mafi hasãra.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Za a tattara ku ba takalmi, tsirara, marasa kaciya. Wanda za a fara tufatar da shi ranar kiyama shi ne Ibrahim.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Lutu (AS)",
    summary:
      "Annabin da ya yi wa mutanensa kashedi a kan wata babbar fasikanci da wata al’umma ba ta yi a gabansu ba.",
    body: [
      "Lutu (amincin Allah ya tabbata a gare shi) na zamani ne kuma dangin Ibrahim wanda ya yi hijira tare da shi sannan aka tura shi zuwa ga mutanen Saduma da garuruwan da ke kusa. Tare da kira zuwa ga bauta wa Allah Shi kaɗai, mutanensa sun kasance da laifin fasikanci marar kunya Kur'ani ya ce 'babu wanda ya taɓa aikatawa a duk duniya a gabani' - kusantar maza maimakon mata, kuma suna aikata alfasha a fili a cikin taronsu (Alkur'ani 7:80-81; 29:28-29). Lutu ya kira su da ikhlasi, zuwa ga tsarki da iyakoki na halitta.",
      "Ba su gamu da gyara nasa da jayayya ba sai da gaba, suna barazanar fitar da shi, kuma suna yin izgili da kiransa zuwa ga ladabi: 'Ku fitar da su daga garinku; Waɗannan mutane ne masu tsarkake kansu. (Alkur'ani 7:82). Ko a cikin gidansa fitinar ta kasance mai tsanani - matarsa ​​​​ta kasance tare da miyagu kuma ba ta yi imani ba, tana sake tabbatar da cewa shiriya ce daga Allah kuma ba a gadonta ta hanyar aure ko jini (Alkur'ani 66:10).",
      "Lokacin da wa'adin ya zo, sai Allah Ya aiko mala'iku a matsayin baqi. Sai mutane suka yi gaggawar cutar da su har ma, Luɗu ya ji ba shi da ƙarfi har sai da mala’iku suka bayyana ainihin su, suka ce masa ya tafi tare da muminai da dare. Da gari ya waye aka kifar da garuruwa aka jefe su da duwatsu (Alkur'ani 11:77-83). Labarin Lutu gargaɗi ne a sarari cewa gaskiyar ɗabi'a ba ta canzawa domin al'umma ta yarda da zunubi kuma tana daidaita shi a fili - kuma Allah koyaushe yana kuɓutar da masu gaskiya, ko da yake kaɗan ne.",
    ],
    profile: {
      nation: "Mutanen Saduma da garuruwan da ke makwabtaka da su",
      location: "Yankin Tekun Matattu (wanda aka ambata)",
      era: "Zaman Ibrahim",
      mission: "Ka kira mutanensa daga alfasha bayyananna da kafirci zuwa ga tauhidi da tsarki.",
      challenges: ["Zubar da mutuncin jama'a", "Ba'a da barazanar korar", "Kafircin matarsa"],
      majorEvents: [
        "Gargadi masu dagewa game da alfasha",
        "Ziyarar Mala'iku sun canza kamar baƙi",
        "Kifar da garuruwa",
      ],
      lessons: [
        "Gaskiyar ɗabi'a ba ta canzawa tare da amincewar jama'a",
        "Mai yiyuwa ne muminai kaɗan ne",
        "Allah yana kubutar da masu gaskiya daga halaka gaba daya",
      ],
      facts: ["Wani dangin Ibrahim wanda ya yi hijira tare da shi aka aika zuwa Saduma"],
    },
    quran: [
      {
        excerpt:
          "Shin, kunã je wa mazaje daga tãlikai, kuma kunã barin abin da Ubangijinku Ya halitta muku, ku zama mata? Ã'a, ku mutãne ne azzalumai.",
      },
      {
        excerpt:
          "To, a lõkacin da umurninMu ya je, Muka sanya mafi ƙasƙantawar alƙaryu, kuma Muka yi ruwan duwãtsu na lãka mai kauri a kansu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ismail (AS)",
    summary:
      "Annabi mai gaskiya ga maganarsa, mai hakuri a jarrabawa, kuma maginin Ka'aba tare da mahaifinsa Ibrahim.",
    body: [
      "Isma'il (amincin Allah ya tabbata a gare shi) shi ne ɗan fari ga Ibrahim, wanda aka ba shi tsufa. Rayuwarsa ta fara ne da jarabawar amana: da izinin Allah Ibrahim ya bar jariri Isma'il da mahaifiyarsa Hajar a cikin kwarin Makkah, inda babu amfanin gona, babu ruwa. A nan ne Hajar ke gudun neman ruwa a tsakanin tsaunukan Safa da Marwah, sai Allah ya sa magudanar ruwan Zamzam ta kwararowa – aikin guzuri ne da zuriyar Hajar da kowane mahajjaci ke yin sa’ayi na Hajji da Umra har yau.",
      "Isma'il yana matashi ya gamu da jarabawa mafi girma tare da mahaifinsa: sa'ad da Ibrahim ya gaya masa hangen nesa na sadaukar da shi, Ismail ya amsa da mika wuya, 'Ya babana, ka aikata yadda aka umarce ka; Za ku same ni, in Allah Ya so, daga masu haƙuri.” (k:37:102). Dukansu sun mika wuya, kuma Allah ya fanshi Isma'il da babbar sadaukarwa, yana girmama biyayyarsu har abada. Uba da dansa suka tayar da harsashin ginin Ka'aba tare, suna addu'a, 'Ya Ubangijinmu, ka karba mana; Lalle ne Kai, Kai ne Mai ji, Masani' (Alkur'ani 2:127).",
      "Alkur'ani ya takaita halayensa a cikin sahu mai daraja: 'Ya kasance mai gaskiya ga alkawarinsa, kuma ya kasance manzo kuma annabi. Ya kasance yana umurtar iyalansa da salla da zakka, kuma ya kasance mai yarda da Ubangijinsa.” (k:19:54-55). Rayuwar Isma'il tana karantar da kyawun kiyaye kalmar, da tsayuwar ibada, da kuma iyali masu ba da haɗin kai ga Allah. Ta hanyarsa, layin annabcin Larabawa ya kai ga Annabin ƙarshe, Muhammad ﷺ.",
    ],
    profile: {
      nation: "Farkon mutanen yankin Makkah",
      location: "Makkah",
      era: "Bayan hijira Ibrahim",
      mission: "Ka riki tauhidi da ibada, kuma ka umarci iyalansa da salla da zakka.",
      challenges: [
        "Mummunan mafarin rayuwa a cikin kwarin da ba kowa",
        "Gwajin sadaukarwa",
        "Tsayar da rayuwa mai tushen ibada da amana mai tsarki",
      ],
      miracles: ["Ruwan Zamzam ya samar a cikin jeji", "Fansa daga hadaya da Allah"],
      majorEvents: [
        "Hagu da mahaifiyarsa Hajar a kwarin Makkah",
        "Gwajin sadaukarwa, ya sadu da cikakkiyar biyayya",
        "Gina Ka'aba tare da Ibrahim",
      ],
      lessons: [
        "Ka cika alkawuranka da aminci",
        "Iyali za su iya ba da haɗin kai wajen bauta da kuma biyayya",
        "Gado mai tsarki yana buƙatar ɗabi'a mai ƙarfi",
      ],
      facts: [
        "An bayyana shi a cikin Alkur'ani da cewa gaskiya ne ga alkawarinsa",
        "Kakan kabilar Larabawa da layin annabci na ƙarshe",
      ],
    },
    quran: [
      {
        excerpt:
          "Kuma ka ambaci Isma'il a cikin Littafi. Lalle ne shi, ya kasance mai gaskiya ga alkawarinsa, kuma ya kasance manzo kuma Annabi. Kuma ya kasance yana umurtar iyalansa da salla da zakka, kuma ya kasance mai yarda da Ubangijinsa.",
      },
      {
        excerpt:
          "Kuma a lõkacin da Ibrãhĩm yake ɗaukaka harsãshin gini ga Ɗãki da Ismã'ĩla, (sun ce): \"Yã Ubangijinmu! Lalle ne Kai, Kai ne Mai ji, Masani.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Ishaq (AS)",
    summary: "Annabi mai albarka wanda aka yi bushara ga Ibrahim, kuma baban Ya'aqub.",
    body: [
      "An haifi Ishaq (amincin Allah ya tabbata a gare shi) ga Ibrahim da matarsa ​​Saratu a cikin tsufansu – haihuwar da mala’iku suka yi shela a matsayin bushara a lokacin da Saratu ta wuce shekarun haihuwa ta yi dariya cikin mamaki. Kur'ani ya rubuta wannan lokacin: 'Mun yi mata bushara game da Ishaq da kuma, bayan Ishaq, Yakubu' (Alkur'ani 11:71). Haihuwarsa ta kasance alamar cewa ikon Allah da rahamarsa ba su da iyaka da iyakokin ɗan adam, kuma ta'aziyya ga kowane mumini da ke jiran bege mai wuyar gaske.",
      "Kur'ani ya ci gaba da kiran sunan Ishak a cikin salihai, zaɓaɓɓu, kuma annabawa maɗaukaki, yana kwatanta shi da Yakubu a matsayin waɗanda aka ba su 'ƙarfi cikin bauta da gani' (Alkur'ani 38: 45-47). Ta wurin Ishaq ne Yakubu (Isra'ila) ya zo, kuma daga Yakubu ya fito da wata doguwar jerin annabawa da aka aika zuwa Bani Isra'ila - don haka Ishak ya tsaya a matsayin uban annabci, hanyar haɗin kai ga ci gaba da shiriya a cikin tsararraki.",
      "Labarinsa, ko da yake an faɗi a taƙaice, yana ɗauke da darussa guda biyu masu ɗorewa: godiya ga baiwar da Allah ya ba mu fiye da yadda muke tsammani, da sanin cewa zuri'ar adalci amana ce - bangaskiya dole ne a ba da ita, ba gada kawai ba. Ni'imar da aka sanya a gidan Ibrahim ta kasance tana kiyaye ta domin bayin Allah ne suke ɗaukar ta.",
    ],
    profile: {
      nation: "Al'ummar Levantine",
      location: "Levant (Sham)",
      era: "Bayan Ibrahim",
      mission: "Ci gaba da jagorar annabci a cikin zuriyar Ibrahim mai albarka.",
      miracles: ["Haihuwar da aka yi wa tsofaffin iyaye albishir ne"],
      majorEvents: [
        "Albishir da aka yiwa Ibrahim da Saratu",
        "Cigaban zuriyar annabci ta hanyar Ya'aqub",
      ],
      lessons: [
        "Allah yana bayarwa fiye da tsammanin ɗan adam",
        "Zuriyar adalai amana ce da za a kiyaye",
        "Magaji mai aminci yana kiyaye jagora a raye",
      ],
      facts: ["Baban Yakubu", "Sunansa tare da Ibrahim da Yakubu a matsayin zaɓaɓɓen iyali"],
    },
    quran: [
      {
        excerpt:
          "Ita kuwa matarsa ​​tana tsaye tana dariya. Sa'an nan Muka yi mata bushãra da Is'hãƙa, kuma a bãyan Is'hãƙa, Yãƙũba.",
      },
      {
        excerpt:
          "Kuma ka ambaci bãyinMu Ibrahim da Is'hãƙa da Ya'aƙũba, ma'abũta ƙarfi da gani. Kuma lalle ne, haƙĩƙa, Mun zãɓe su da wani abu keɓantacce: ambaton Gida.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ya'qub (AS)",
    summary:
      "Har ila yau ana kiransa Isra'ila, annabi wanda kyakkyawan haƙurinsa ta wurin baƙin ciki ya misalta dogara ga Allah marar girgiza.",
    body: [
      "Yakub (amincin Allah ya tabbata a gare shi), kuma ana ce da shi Isra’ila, shi ne dan Ishaq kuma uban sha biyun da suka zama kabilar Bani Isra’ila – ciki har da Yusuf. Ya rene 'ya'yansa akan tauhidi, kuma Alkur'ani ya kiyaye alkawarin da ya dauka daga gare su a kan gadon mutuwarsa: 'Me za ku bauta wa bayana?' Suka ce, 'Za mu bauta wa Ubangijinku, kuma Ubangijin ubanninku... Abin bautawa guda ɗaya, kuma a gare Shi muke sallamawa' (Alkur'ani 2:132-133). Babban damuwarsa, har zuwa ƙarshe, shine bangaskiyar tsara na gaba.",
      "Babbar fitinarsa ta bayyana a cikin labarin Yusuf. Sa’ad da ’ya’yansa suka dawo da rigar Yusufu da ƙaryar cewa kerkeci ne ya cinye shi, Yakubu ya gani ta hanyar yaudara kuma bai amsa da fushi ba sai da kamewa: “Don haka haƙuri ya fi dacewa, kuma Allah ne wanda ake neman taimakonsa a kan abin da kuke siffantawa.” (k:12:18). Tsawon shekaru da yawa na rabuwa yana baƙin ciki har, kamar yadda Kur'ani ya faɗa, idanunsa suka yi fari saboda baƙin ciki - duk da haka ya danne baƙin cikinsa kuma bai yanke ƙauna ba (Qur'ani 12:84).",
      "Zuciyar misalin Yakubu ita ce jumla guda: 'Kada ku yanke tsammani daga rahamar Allah; lalle ne, babu mai yanke tsammani daga rahamar Allah face mutane kafirai.” (k:12:87). Nasa ne abin koyi na sabar jamil - kyakkyawan haƙuri - wanda ba wai murabus ba ne amma mai aiki, mai bege cewa hikimar Allah za ta bayyana a lokacinsa. Lokacin da aka dawo masa da Yusuf, ganinsa ya dawo, wannan hakurin ya tabbata. Yakub yana karantar da duk wani mumini mai bakin ciki da ya rike bakin ciki da yakini a zuciya daya.",
    ],
    profile: {
      nation: "Asalin Bani Isra'ila",
      location: "Levant, tare da ƙaura zuwa Masar",
      era: "Zamanin Yusuf",
      mission: "Ka shiryar da iyalansa da zuriyarsa cikin tauhidi.",
      challenges: [
        "Tashin hankali da kishi a tsakanin yayansa",
        "Tsawon rabuwa da Yusuf",
        "Jurewa baƙin ciki mai zurfi ba tare da rasa bege ba",
      ],
      majorEvents: [
        "Shawararsa da alkawarin tauhidi ga 'ya'yansa maza",
        "Tsawon shekarun hakuri akan Yusuf",
        "Murnar haduwa da Yusuf a Masar",
      ],
      lessons: [
        "Kyakkyawar haƙuri (sabr jamil) yana aiki, bangaskiya mai bege",
        "Iyaye suna tsara gadon bangaskiya na 'ya'yansu",
        "Kada ka yanke kauna daga rahamar Allah",
      ],
      facts: ["Ana kuma kiransa Isra'ila", "Baban Yusuf da kabilar Bani Isra'ila"],
    },
    quran: [
      {
        excerpt:
          'Ya ce: "Ã\'a, rãyukanku sun fitine ku zuwa ga wani abu." Don haka hakuri ya fi dacewa. Tsammãnin Allah Ya zo mini da su gabã ɗaya.',
      },
      {
        excerpt:
          "Suka ce: \"Za mu bauta wa Abin bautawarka, kuma Abin bautawar ubanninka Ibrãhĩm da Ismã'ĩla da Is'hãƙa, abin bautãwa guda ne, kuma a gare Shi mãsu sallamãwa ne.\"",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yusuf (AS)",
    summary:
      "Annabin da tafiyarsa daga rijiya zuwa gadon sarautar Masar tana karantar da tsarki da hakuri da gafara.",
    body: [
      "Yusuf (amincin Allah ya tabbata a gare shi) shi ne batu mafi cikar labari guda na Kur'ani - suratu Yusuf, wadda Allah ya kira 'mafi kyawun labarai' (Alkur'ani 12:3). Yana yaro ya ga mafarki na gaskiya na taurari goma sha daya da rana da wata suna sujjada masa. ’Yan’uwansa masu kishi suka jefa shi cikin rijiya suka sayar da shi bauta a Masar, aka saye shi a gidan wani ma’aikaci mai ƙarfi. Ta kowane juyi, Yusuf ya kiyaye imaninsa da amincinsa.",
      "An gwada tsarkinsa a lokacin da matar maigidansa ta yi kokarin lalata shi. Ya ki, ya ce, ‘Ina neman tsarin Allah,’ kuma ya fifita kurkuku a kan zunubi: ‘Kurkuku ya fi soyuwa a gare ni daga abin da suke kira na zuwa gare shi’ (Qur’an 12:33). Ko da yake ba shi da laifi, an daure shi na tsawon shekaru - har ma a can ya kira ’yan uwansa fursunoni su yi tauhidi da fassara mafarkai. Sa’ad da mafarkin da sarki kansa ya yi game da shekara bakwai na yunwa ya ruɗe kotun, baiwar fassarar da Allah ya yi wa Yusufu ta kai shi gaban sarki, wanda ya sa shi mai kula da baitulmalin Masar. Ya tafiyar da al'umma ta hanyar yunwa da hikima da adalci.",
      "Ƙarshen labarin ba iko bane amma gafara. A lokacin da 'yan'uwansa suka tsaya a gabansa ba su gane shi ba, sai Yusufu ya bayyana kansa, ya ce: \"Babu laifi a kanku a yau. Allah zai gafarta muku, kuma Shi ne Mafi rahamar masu jin kai' (k:12:92). Ya godewa Allah akan kowane alheri, yana mai cewa Ubangijinsa ya kyautata lokacin da ya fitar da shi daga kurkuku kuma ya tara iyali. Yusufu yana karantar da cewa tsafta da takawa suna kare mumini, cewa shirin Allah a natse yana shafe kowane makirci na mutum, kuma gafara - ba fansa ba - ita ce alamar masu daraja.",
    ],
    profile: {
      nation: "Zuriyar Bani Isra'ila a Masar",
      location: "Kan'ana a Misira",
      era: "Kafin Musa",
      mission: "Tsaya tauhidi da tsafta da adalci yayin hidimar al'umma.",
      challenges: [
        "Cin amanar 'yan uwansa",
        "Jaraba da kazafin karya",
        "Tsawon ɗaurin kurkuku duk da rashin laifi",
      ],
      miracles: ["Baiwar Allah ta fassarar mafarki na gaskiya"],
      majorEvents: [
        "Rijiya da rabuwa da mahaifinsa",
        "Shekarun dauri",
        "Tashi zuwa ga mulki a Misira da haɗuwa da iyalinsa",
      ],
      lessons: [
        "Tsafta da mutunci suna kare imani",
        "Gafara yana warkar da iyalai",
        "Makircin Allah ya fi kowane mutum makirci",
      ],
      facts: [
        "Dukan suratu Yusuf, wadda ake kira mafi kyawun labarai, ta dogara ne akan rayuwarsa",
      ],
    },
    quran: [
      {
        excerpt:
          'Ya ce: "Babu laifi a kanku a yau." Allah Ya gafarta muku; Kuma Shĩ ne Mafi rahamar mãsu rahama.',
      },
    ],
    hadith: [
      {
        excerpt:
          "Maɗaukaki ɗan mai daraja ɗan sarki ɗan sarki Yusuf ɗan Yaƙub ɗan Ishaq ɗan Ibrahim.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shu'aibu (AS)",
    summary:
      "Annabin da ya daura imani da gaskiya a cikin ciniki kuma ya gargadi Madyana akan ha'inci da zalunci.",
    body: [
      "An aika da Shu'aibu (amincin Allah ya tabbata a gare shi) zuwa ga mutanen Madyana, wata al'umma ce ta fatauci wadda ta lalatar da tattalin arzikinta ta hanyar ha'inci: takaitaccen mudu da awo, da zaluntar mutane da dukiyoyinsu, da yada zalunci a cikin kasa. Saƙonsa ya haɗa ɓangarori biyu na imani waɗanda mutane sukan yi ƙoƙari su rabu da su - ibada da xa'a: 'Ya mutanena, ku bauta wa Allah; Ba ku da wani abin bautãwa waninSa. Kuma ku cika ma'auni da sikẽli da ãdalci, kuma kada ku hana mutãne hakkinsu' (k:11:84-85).",
      "Jama'arsa suka yi tsayin daka, suna tambayar ko addu'arsa ta bukaci su yi watsi da al'adun ubanninsu na yaudara, su yi abin da suka ga dama da dukiyarsu (Alkur'ani 11:87). Sun yi masa izgili, suka yi masa barazanar korar shi da muminai, har ma sun toshe hanyoyi. Shu’aibu ya dage da tausayawa da tunatarwa bayyananna, yana mai dagewa sai dai ya nemi gyara gwargwadon ikonsa, kuma nasararsa daga Allah ce kadai: ‚Kuma nasarata ba ta kasance ba face ta wurin Allah. A gare Shi na dogara, kuma zuwa gare Shi nake mayarwa.” (k:11:88). Ana tunawa da shi da bajintar da ya yi wajen kiran jama’arsa.",
      "A lokacin da suka dawwama a kan kafirci, azaba ta zo ta kama wadanda suka yi zalunci, alhali kuwa Allah Ya tseratar da Shu'aibu da muminai (k:7:91-93). Tarihinsa yana ba da darasi da sau da yawa ba a kula da shi: gaskiyar tattalin arziki ba ta bambanta da addini - yana cikinsa. Ha'inci a kasuwa, cin gajiyar masu rauni, da aiwatar da matakai al'amura ne na imani, kuma al'ummar da ta halalta zalunci tana kiran hukuncin Allah.",
    ],
    profile: {
      nation: "Mutanen Madyan",
      location: "Yankin kasuwanci na Larabawa / Levantine",
      era: "Bayan zuriyar Ibrahim",
      mission: "Kira zuwa ga tauhidi da gaskiya da adalci a cikin ciniki.",
      challenges: [
        "Cin hanci da rashawar kasuwa ya karu",
        "Ba'a daga manyan mutane",
        "Barazanar kora",
      ],
      majorEvents: [
        "Kira zuwa ga cikakken ma'auni da yin adalci",
        "adawa da barazanar jama'a",
        "Azãbar mãsu kãfirta",
      ],
      lessons: [
        "Bangaskiya tana buƙatar gaskiya a cikin kasuwanci",
        "Zaluncin jama'a yana kiran hukuncin Allah",
        "Annabawa suna magana ne akan ladubban zamantakewa da tattalin arziki, ba na al'ada kadai ba",
      ],
      facts: ["An san shi don jaddada ma'auni da ma'auni kawai"],
    },
    quran: [
      {
        excerpt:
          "Ya ku mutanena, ku bauta wa Allah; Ba ku da wani abin bautãwa waninSa. Ku cika mũdu da sikẽli kuma kada ku hana mutãne hakkinsu, kuma kada ku yi ɓarna a cikin ƙasa.",
      },
      {
        excerpt:
          "Kuma nasarata ba ta kasance ba face ta Allah. A gare Shi na dõgara, kuma zuwa gare Shi nake komawa.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ayyub (AS)",
    summary:
      "Misalin Hakuri na Alkur'ani: Ba a girgiza cikin ibada ta hanyar doguwar jinya da rashi.",
    body: [
      "Ayyub (amincin Allah ya tabbata a gare shi) - Ayuba - shine alamar sabar mai dorewa a cikin Kur'ani. Annabi ne ya albarkace shi da lafiya, dukiya, da iyali, sannan aka jarrabe shi da rasa su, da kuma doguwar jinya mai raɗaɗi. A cikin wannan duka bai yi daci ba ko ya zargi Ubangijinsa da zalunci; ya rike godiya da zikiri. Alkur'ani ya yabe shi da kalmomin da suka dauki labarinsa gaba daya: ‚Lallai ne, mun same shi mai hakuri, kyakkyawan bawa. Lalle shi, ya kasance mai yawan komawa zuwa ga Allah.” (k:38:44).",
      "Idan daga karshe wahala ta yi yawa, sai a lura da kyawawan dabi'u (adab) na addu'arsa. Bai nema ko korafi a kan hukuncin Allah ba; sai kawai da kaskantar da kai ga Ubangijinsa: “Lalle ne, wahala ta shafe ni, kuma Kai ne Mafi rahamar masu rahama.” (k:21:83). Ya tabbatar da rahamar Allah a daidai lokacin da ake tambaya. Allah ya amsa masa ya ce, 'Ka doki kasa da kafarka; Wancan wanka ne mai sanyi da abin sha, kuma Ya tafiyar da cutar, kuma Ya mayar da mutanensa da ƙari, domin rahama daga gare Shi, kuma tunatarwa ga masu bauta (k:21:84; 38:41-43).",
      "Ayyub yana koyar da cewa haƙuri ba juriya ba ne amma nau'i ne na ibada - ci gaba da komawa ga Allah yayin gwaji. Misalinsa kuma yana gyara yadda muke yin addu’a: tare da tawakkali, ba tare da korafe korafe kan hukuncin ba, da kuma yaqini cikin rahamar Allah. Kuma qarshensa yana tabbatar wa duk wani mumini da aka jarrabe shi da cewa jarrabawa da imani za ta iya daga darajar bawa kuma a koda yaushe ana samun sauki a lokacin Allah.",
    ],
    profile: {
      era: "Zamanin annabci bayan Ibrahim (faɗin mahallin)",
      mission: "Ka shiryar da mutanensa alhalin yana mai dawwama da haquri da ibada cikin tsanani.",
      challenges: [
        "Rashin lafiya mai tsawo kuma mai raɗaɗi",
        "Asarar dukiya da iyali",
        "Jimiri a ƙarƙashin gwaji mai tsawo",
      ],
      miracles: ["Waraka da sauki da izinin Allah", "Maida iyali da albarka bayan fitina"],
      majorEvents: [
        "Addu'arsa mai tawali'u a cikin wahala",
        "Taimakon Allah, warkarwa, da maidowa",
      ],
      lessons: [
        "Hakuri ibada ce mai aiki",
        "Addu'a tana da kyau idan tawali'u da rashin korafe-korafe",
        "Gwaje-gwajen da aka ɗauka tare da bangaskiya na iya ɗaukaka darajar mutum",
      ],
      facts: ["An kawo shi a cikin al'adar Musulunci a matsayin abin koyi na sabar"],
    },
    quran: [
      {
        excerpt:
          'Kuma Ayyub, a lokacin da ya kirayi Ubangijinsa: "Lalle ne, cũta ta shãfe ni, kuma Kai ne Mafi rahamar mãsu rahama."',
      },
      {
        excerpt:
          "Lalle Mũ, Mun sãme shi mai haƙuri, madalla da bãwa. Lalle shĩ, yã kasance mai mayar da al'amari ga Allah.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Zul-Kifli (AS)",
    summary:
      "Annabi saliha yana cikin masu haquri, wanda aka girmama ko da yake labarinsa gajere ne.",
    body: [
      "Zul-kifli (amincin Allah ya tabbata a gare shi) an ambaci sunansa sau biyu a cikin Alkur'ani, duka biyun yana cikin tawagar annabawa masu daraja. Allah Ya lissafta shi da Isma'il da Idris - 'duk sun kasance daga masu hakuri. Kuma Muka shigar da su a cikin rahamarMu. lalle ne su, sun kasance daga salihai' (Alkur'ani 21:85-86) - kuma ya sake ambace shi a cikin fitattu tare da Ismaila da Al-Yasa' (Alkur'ani 38:48). Kowane ambaton yabo ne, ko da yake ba a bayar da cikakken bayani ba.",
      "Domin Kur’ani da Sunna ingantattu ba su fadada rayuwarsa ba, malaman gargajiya sun yi sabani a kan hatta dalla-dalla na asali – wasu suna ganin shi Annabi ne ko kuma adali, ko da yake an lissafta shi a cikin annabawa a cikin jerin sunayen Musulmi. Mumini mai hankali yana ƙin cika shirun da tatsuniyoyi da ba a tabbatar da su ba kuma ya riƙe abin da Allah ya tabbatar: ya kasance mai haƙuri da adalci, kuma wannan ya isa ga daraja.",
      "Hada shi yana dauke da darasi mai natsuwa: ba kowane bawa da Allah yake so ya bar wani sanannen labari ba. Hidima mai dorewa, aminci - nau'in da tarihi bai taɓa rubutawa ba amma Allah ya sani sarai - shine ainihin irin wanda ke samun rahamarSa. Amincewar boye ba ta da yawa; shi ne tushen rayuwa ta qwarai.",
    ],
    profile: {
      era: "Daga baya lokuttan annabci kafin Isa (wanda aka sanya shi a fili)",
      mission: "Ka kira mutanensa zuwa ga biyayya da adalci.",
      lessons: [
        "Hakuri shine jigon halin annabci",
        "Ƙididdiga mai iyaka har yanzu yana ɗaukar jagora mai ƙarfi",
        "Imani, gaibu hidima abin so ne ga Allah",
      ],
      facts: [
        "Mai suna tare da Ismail da Idris a cikin majiyyatan",
        "An ƙidaya cikin annabawa a cikin jerin sunayen musulmi na yau da kullun",
      ],
    },
    quran: [
      {
        excerpt:
          "Da Isma'ila da Idrisu da Zul-kifli dukkansu suna daga masu hakuri. Kuma Muka shigar da su a cikin rahamarMu. Lalle sũ, sun kasance daga sãlihai.",
      },
      {
        excerpt:
          "Kuma ka ambaci Ismaila da Al-Yasa'a da Zulkifli, kuma dukkansu suna daga fitattu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Musa (AS)",
    summary:
      "Babban manzo zuwa ga Bani Isra’ila wanda ya fuskanci zaluncin Fir’auna ya karbi Attaura.",
    body: [
      "Musa (amincin Allah ya tabbata a gare shi) shi ne Annabi da aka fi ambata a cikin Alkur’ani, kuma an ba da labarinsa dalla-dalla. An haife shi a ƙarƙashin dokar Fir'auna na kashe 'ya'yan Bani Isra'ila, mahaifiyarsa ta sanya shi yana jariri a cikin kwando a kan kogin Nilu - bisa ga wahayin Allah - kuma, da tsarin Allah, ya tashi a cikin fadar Fir'auna (Alkur'ani 28: 7-13). Bayan shekaru da yawa, bayan ya bar Masar, ya yi aure a Madyana, Allah ya kira shi a kwarin Tuwa, inda Allah ya yi masa magana kai tsaye, ya nuna masa alamar sanda da hannu, ya aika shi tare da dan’uwansa Haruna zuwa ga azzalumi Fir’auna (Alkur’ani 20:9-36).",
      "Manufarsa ita ce isar da abubuwa guda biyu: kira zuwa ga bauta wa Allah Shi kadai, da neman ‘yantar da ‘ya’yan Isra’ila da ake zalunta. Fir’auna, wanda ya yi iƙirarin shi abin bautawa, ya sadu da shi da ƙeƙasasshe, har ma bayan jerin ayoyi bayyanannu - sandar da ta zama maciji, ta haɗiye dabarun masu sihiri, da annoba - ya ƙi sallamawa. Lokacin da Musa ya fitar da Bani Isra’ila, Fir’auna ya bi su har zuwa teku. A nan ne Allah ya yi umarni, ‘Ka bugi teku da sandarka,’ sai ya rabu, sai muminai suka haye kan busasshiyar kasa alhalin Fir’auna da rundunarsa aka nutsar da su (Qur’an 26:63–66).",
      "Amma 'yanci shine kawai mafari. Sai Musa ya daure da jarabawa da ya fi tsayi na jagorantar mutane masu wuya kuma sau da yawa marasa godiya: ya karbi Attaura a kan dutse, sai ya dawo ya same su suna bautar maraƙi na zinariya; ya fuskanci korafe-korafensu, da bukatunsu, da rashin biyayyarsu tare da jagoranci mai hakuri, tsayayye. Rayuwar Musa ta haɗu da manyan jigogi biyu - ƙarfin hali don tsayayya da zalunci da zalunci, da kuma juriyar da ake buƙata don jagorantar mutane zuwa ga biyayya da zarar sun sami 'yanci. A matsayinsa na daya daga cikin ulul-'azm, shi abin koyi ne na masu kawo gyara da kiwo ga al'umma.",
    ],
    profile: {
      nation: "Bani Isra'ila (tare da kiran mutanen Fir'auna).",
      location: "Misira da Sinai",
      era: "Kafin Dawud da Sulaiman",
      mission: "Ku yi kira zuwa ga tauhidi, ku fuskanci zaluncin Fir'auna, ku isar da Attaura.",
      challenges: [
        "Fuskantar Fir'auna, wanda ya yi iƙirarin allahntaka",
        "Jagoranci mutane masu juriya da rashin godiya",
        "Jagoranci mai dorewa a ƙarƙashin matsin lamba",
      ],
      miracles: [
        "Sanda wanda ya koma maciji",
        "Rabewar teku da izinin Allah",
        "Alamu da yawa da aka nuna a gaban Fir'auna",
      ],
      majorEvents: [
        "Allah yana yi masa magana a kwari mai alfarma",
        "Fuskantar Fir'auna da masu sihiri",
        "Fitowa da wahayin Attaura",
      ],
      lessons: [
        "Ku dage da jajircewa wajen yakar zalunci",
        "Jagoranci akan mutane yana buƙatar haƙuri mai girma",
        "Dole ne a haɗa 'yanci zuwa biyayya ga Allah",
      ],
      facts: [
        "Daya daga cikin manzanni biyar masu tsayuwa (ulul-'azm)",
        "Ana ce masa Kalimullah - wanda Allah ya yi magana da shi kai tsaye",
      ],
    },
    quran: [
      {
        excerpt:
          "Kuma Nã zãɓe ku, sai ku saurara ga abin da ake yin wahayi. Lallai ni ne Allah. Bãbu abin bautãwa fãce Ni, sabõda haka ku bauta Mini, kuma ku tsayar da salla dõmin ambatoNa.",
      },
      {
        excerpt:
          "Kuma Muka yi wahayi zuwa ga uwar Mũsã cẽwa ki shãyar da shi, sa'an nan idan kã ji tsõro a kansa, to, ki jẽfa shi a cikin kõgi, kuma kada ki ji tsõro, kuma kada ki yi baƙin ciki. Lalle Mũ, Mãsu mayar da shi zuwa gare ku ne.",
      },
    ],
    hadith: [
      {
        excerpt:
          "An aika mala'ikan mutuwa zuwa ga Musa. Da ya zo masa, sai Musa ya buge shi, sai Allah ya mayar masa da idonsa, kuma Ya ba shi zabi dangane da lokacin mutuwarsa.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Haruna (AS)",
    summary: "hazikin dan'uwan Musa, ya nada shi a matsayin annabin taimakonsa a gaban Fir'auna.",
    body: [
      "Haruna (amincin Allah ya tabbata a gare shi) shi ne babban yayan Musa kuma annabi ne a kansa. A lokacin da Allah Ya aika Musa zuwa ga Fir’auna, Musa ya nemi taimako: “Kuma Ka sanya mini wani waziri daga iyalina – Haruna, dan’uwana. Ka ƙãra mini ƙarfi ta wurinsa, kuma ka bar shi ya raba aikina' (Alkur'ani 20:29-32). Allah ya biya bukata, kuma Kur'ani ya rubuta amsarsa: 'Za mu ƙarfafa hannunka ta wurin ɗan'uwanka' (Alkur'ani 28:35). Haruna, wanda aka bayyana shi da cewa ya fi iya magana, ya tsaya a gefen Musa a lokacin da suke isar da sakon Allah ga azzalumi.",
      "Lokacin jarabawarsa ya zo da rashin Musa. Lokacin da Musa ya je ya karɓi Attaura a kan dutse, Bani Isra’ila ya faɗi cikin bautar maraƙi na zinariya. Haruna ya yi ƙoƙari ya mayar da su, yana mai gargaɗi, ya ce, “Ya mutanena, ba a fitine ku da shi kawai, kuma lalle ne Ubangijinku Mai rahama ne, saboda haka ku bi ni, kuma ku yi ɗa’a ga umurnina.” Amma suka rinjayi ikonsa, kuma suka yi kusa su cutar da shi (Alkur’ani 20:90-94). Lokacin da Musa ya dawo a fusace, Haruna ya bayyana cewa yana jin tsoron cewa yin aiki da ƙarfi zai raba al’umma zuwa ƙungiyoyin yaƙi kafin Musa ya dawo (Alkur’ani 7:150).",
      "Tarihin Haruna ya nuna darajar haɗin kai a cikin bautar Allah - aikin da mutum biyu ke ɗauka ya fi ɗaya ƙarfi - da kuma hikimar kiyaye haɗin kai ba tare da tauye gaskiya ba. Wani lokaci jagoranci mai aminci yana nufin haɗa al'umma mai wargajewa tare da hana cutarwa har sai an daidaita al'amura. Harun yana da daraja a cikin Alkur'ani a cikin shiryayyu, kuma Allah ya bar masa da Musa yabo mai dawwama a tsakanin mutanen baya (k:37:119-122).",
    ],
    profile: {
      nation: "Bani Isra'ila",
      location: "Misira da Sinai",
      era: "Zamanin Musa",
      mission: "Ka taimaki Musa wajen kira zuwa ga tauhidi da shiryar da Bani Isra’ila.",
      challenges: [
        "Fuskantar mulkin Fir'auna",
        "Gudanar da al'umma a lokacin rashin Musa",
        "Hana rarrabuwar kawuna a tsakanin mutane",
      ],
      majorEvents: [
        "Nadin minista da goyon baya ga Musa",
        "Aikin gaban Fir'auna",
        "Gwajin maraƙin zinariya",
      ],
      lessons: [
        "Yin aiki tare yana ƙarfafa kira zuwa ga Allah",
        "Shugabanci wani lokaci yana nufin hada mutane wuri guda a cikin rikici",
        "A kiyaye hadin kai ba tare da bata gaskiya ba",
      ],
      facts: ["Babban yayan Musa", "Yabo a cikin Alkur'ani saboda balaga"],
    },
    quran: [
      {
        excerpt:
          "Kuma ka naɗa mini waziri daga iyalina - Haruna, ɗan'uwana. Ka ƙãra ta wurinsa ƙarfina kuma bari ya raba aikina.",
      },
      {
        excerpt: "Ya ce: “Dan uwata!",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dawud (AS)",
    summary:
      "Annabi-Sarki da aka ba wa hikima, adalci, da Zabur, kuma abin koyi na jagoranci mai karkata zuwa ga ibada.",
    body: [
      "Dawud (amincin Allah ya tabbata a gare shi) - Dauda - ya fara tun yana matashi a cikin sojojin Talut (Saul) a kan azzalumi Jalut (Goliath). Dawud ne ya kashe Jalut, kuma Allah Ya ba shi mulki da hikima, kuma Ya sanar da shi daga abin da Yake so’ (k:2:251). Sai Allah ya ba shi sarauta da Annabci da nassi bayyanannu, Zabur (Zabura), ya mai da shi abin koyi da ba kasafai ba na shugaba wanda shi ma ya kasance mai yawan ibada.",
      "Allah ya ba shi kyauta mai ban mamaki: duwatsu da tsuntsaye suna tare da shi don yin tasbihi ga Allah, kuma baƙin ƙarfe ya yi laushi a hannunsa don ya kera makamai (Alkur'ani 21:79; 34:10-11). Duk da haka da wannan iko, Dawud ya kasance mai tawali'u da sadaukarwa. Ibadarsa ta yi tsanani har Manzon Allah Sallallahu Alaihi Wasallama ya siffanta Azumin Dawud - azumtar kowace rana - a matsayin azumin da ya fi soyuwa ga Allah, kuma sallarsa ta dare a matsayin mafi soyuwa. Kur'ani ya kuma gabatar da wani sashe na hukunci wanda Dawud, a hankali ya gyara, nan da nan ya fadi cikin sujada, ya nemi gafara, ya koma ga Ubangijinsa (Alkur'ani 38:24) - karfinsa bai taba fifita shi a kan hisabi ba.",
      "Rayuwar Dawud ta koyar da cewa hukuma amana ce ba gata ba. Allah Yana yi masa magana kai tsaye: “Ya Dawud, Mun sanya ka magada a bayan kasa, sai ka yi hukunci tsakanin mutane da gaskiya, kuma kada ka bi son zuciya.” (k:38:26). Adalci, da yawaita ambaton Allah, da gaggawar tuba, da rayuwar ibadar da ta dace, su ne ke tabbatar da shugabanci na gari. Iko ya fi aminci a hannun wanda ya fi ruku'u.",
    ],
    profile: {
      nation: "Bani Isra'ila",
      location: "Yankin Kudus",
      era: "Kafin mulkin Sulaimanu",
      mission:
        "Ka yi shugabanci da adalci, ka yi hukunci da gaskiya, kuma ka kira mutanensa zuwa ga Allah.",
      challenges: [
        "Nauyin alhakin shari'a",
        "Daidaita iko da tawali'u",
        "Hukuncin jama'a a cikin jagoranci",
      ],
      miracles: [
        "Duwatsu da tsuntsaye suna tasbihi game da shi",
        "Iron ya yi laushi a hannunsa da iznin Allah",
      ],
      majorEvents: [
        "Kashin da Jalut yayi a kuruciyarsa",
        "Sarauta, Annabci, da wahayin Zabur",
        "Gado ya koma ga dansa Sulaiman",
      ],
      lessons: [
        "Adalci shine jigon mulkin adalci",
        "Tuba da sauri bayan kowane kuskure",
        "Rayuwa mai ladabi ta ibada tana ƙarfafa jagoranci",
      ],
      facts: ["Mai karɓar Zabur (Zabura)", "Ya ci Jalut (Goliath) yana matashi"],
    },
    quran: [
      {
        excerpt:
          "Ya Dãwuda, lalle ne Mũ, Mun sanya ka magada a cikin ƙasa, sabõda haka ka yi hukunci a tsakãnin mutãne da gaskiya, kuma kada ka bi son zuciya, kamar yadda zai ɓatar da kai daga tafarkin Allah.",
      },
      {
        excerpt:
          "Kuma Muka hõre duwãtsu tãre da Dãwũda, da tsuntsãye, kuma... Kuma Muka sanar da shi halittar sulke, dõmin Ya tsare ku daga maƙiyinku.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mafi soyuwar addu'a ga Allah ita ce addu'ar Dawud, kuma mafi soyuwar azumi a wurin Allah shi ne azumin Dawud: ya kan yi azumi wata rana ya yi buda baki a gobe.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sulaiman (AS)",
    summary:
      "Annabi-sarki da aka ba da iko mara misaltuwa duk da haka yana da tushe cikin godiya da hikima.",
    body: [
      "Sulaiman (amincin Allah ya tabbata a gare shi) - Sulaiman - ya gaji sarauta da annabci daga mahaifinsa Dawud, kuma Kur'ani ya yabe shi a matsayin 'bawa na kwarai, hakika mai maimaituwa ga Allah' (Alkur'ani 38:30). Ya yi addu’ar samun mulki ba kamar wanda zai biyo baya ba, kuma Allah Ya ba shi dama ta musamman: Umurni da iskar da ke tafiya da umarninsa; hidimar aljani wanda ya gina masa kurciya da iznin Allah; da fahimtar maganar tsuntsaye da sauran halittu (Alkur'ani 21:81–82; 34:12–13; 27:16).",
      "Fage biyu sun dauki halinsa. Lokacin da tururuwa ta gargadi mazaunanta cewa su fake don kada sojojin Sulaiman su murkushe su ba da saninsu ba, Sulaiman ya yi murmushi ya gode wa Allah don ni’imar fahimta, yana mai addu’a ya zama mai godiya da adalci (Alkur’ani 27:18-19) – iko ya sa ya kara kaskantar da kai, ba kasawa ba. Kuma a lokacin da ya ji labarin Sarauniyar Saba’ (Saba’) da mutanenta suna bautar rana, bai ci su da qarfi ba, amma ya kira su zuwa ga mika wuya ga Allah, daga qarshe ya ba ta imani ta hanyar hikima da nuna abin da Allah Ya ba shi (Alkur’ani 27:22-44). Hatta ni'imominsa masu yawa ya sanya su a matsayin jarrabawa: \"Wannan yana daga ni'imar Ubangijina domin Ya jarrabe ni, shin zan kasance mai godiya ko mai butulci\" (k:27:40).",
      "Sulaiman yana karantar da cewa mulki yana daga cikin mafi tsananin jarabawa, kuma godiya (shukr) shine maganinta. Mumini da aka bai wa dukiya, iyawa, ko mulki ana nufin ya yi amfani da ita ne don yin adalci da kiran wasu zuwa ga Allah, ba don girman kai ba. Dukan mulkinsa, tare da dukan abubuwan al'ajabi, suna komawa ga wanda ya ba shi - kuma wannan shine bambanci tsakanin ni'imar da ke ɗaukaka da wadda ke lalata.",
    ],
    profile: {
      nation: "Bani Isra'ila da masarautun da ke kewaye",
      location: "Kudus da kuma fadin yankin",
      era: "Bayan Dawud",
      mission: "Ku yi mulki da adalci, ku kirayi al'umma zuwa ga bautar Allah.",
      challenges: [
        "Gudanar da babbar masarauta",
        "Kula da godiya a cikin babban iko",
        "Gudanar da runduna dabam-dabam cikin gaskiya",
      ],
      miracles: [
        "Umurni a kan iska da izinin Allah",
        "Hidimar aljani wajen gini da ruwa",
        "Fahimtar maganan tsuntsaye da tururuwa",
      ],
      majorEvents: [
        "Gadon sarautar Dawud da Annabcinsa",
        "Labarin tururuwa da godiya",
        "Wasiku tare da Sarauniyar Saba da imaninta",
      ],
      lessons: [
        "Iko babban gwaji ne",
        "Godiya tana kare girman kai",
        "Hikima da gayyata na iya juyar da zukata fiye da ƙarfi",
      ],
      facts: ["Daga cikin mafi cikakken siffanta sarakunan annabawa a cikin Kur'ani"],
    },
    quran: [
      {
        excerpt:
          "Ya yi murmushi, yana jin dadin maganarta, ya ce: “Ya Ubangiji Ka ba ni ikon gode wa ni’imarKa wadda Ka yi mini ni’ima da iyayena, da aikata aikin kwarai wanda Ka yarda da shi.",
      },
      {
        excerpt:
          "Kuma ga Sulaimãnu (Mun hõre) iska, tafiyarta ta sãfiya wata guda, kuma tafiyar wata guda.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ilyas (AS)",
    summary: "Annabin da ya fuskanci bautar gunki Ba'al ya kira mutanensa zuwa ga Allah.",
    body: [
      "Ilyas (amincin Allah ya tabbata a gare shi) - An aika Iliya - zuwa ga jama'ar Bani Isra'ila da suka fada cikin bautar gumaka, babban daga cikin gumakansu shi ne Ba'al. Kur'ani ya rubuta ƙalubalensa kai tsaye: 'Shin ba za ku ji tsoron Allah ba? Shin, kunã kiran Ba'al, kuma kunã barin mafi kyãwon halitta, Allah, Ubangijinku, kuma Ubangijin ubanninku na farko? (Alkur'ani 37:124-126). Kiransa shine kiran annabci na har abada: kau da gumakan ƙarya kuma a mayar da sujada ga Mahalicci shi kaɗai.",
      "Kur'ani ya taƙaita aikinsa da tsarin annabci da aka saba - gayyata bayyananne, ƙin yarda da mafiya yawa, da kuma girmamawa da aka kiyaye ga masu gaskiya. \"Sun ƙaryata shi, saboda haka, lalle ne waɗanda ake zowa da su, face zaɓaɓɓun bayin Allah.\" (k:37:127-128). Allah ya ambaci sunan sa a cikin salihai kuma ya bar aminci da yabo a gare shi: 'Aminci ya tabbata ga Ilyas' (k:37:129-130), kuma ya lissafta shi tare da Zakariyya da Yahaya da Isa daga shiryayyu (Alkur'ani 6:85).",
      "Darasin Ilyas shi ne, gyara na gaskiya yana farawa da gyara ibada. Ba za a iya daidaita al'umma ba yayin da take ba da kai ga abubuwa na ƙarya - ko gumaka na zahiri ko na zamani na sha'awa, dukiya, da matsayi. Tauhidi shi ne ginshikin da aka gina dukkan sabuntar dabi'u mai dorewa a kansa, kuma ko da kungiya mai imani ta yi kadan kuma ba ta da yawa, Allah yana girmama masu riko da gaskiya.",
    ],
    profile: {
      nation: "Wata al'umma ce daga Bani Isra'ila",
      location: "Yankin Levant",
      era: "Zaman annabci na Isra'ila daga baya",
      mission: "Ka kira mutanensa daga bautar Ba'al zuwa ga tauhidi.",
      challenges: ["Ibadar tsafi mai zurfi", "Juriya daga jagoranci"],
      majorEvents: [
        "Jama'a sun yi kira da a hana bautar Ba'al",
        "Kafirta da mafi rinjaye da tsare muminai",
      ],
      lessons: [
        "Tauhidi shine ginshikin dukkan gyara",
        "Ƙungiya kaɗan masu aminci har yanzu suna da mahimmanci ga Allah",
        "Annabawa suna magana akan kuskuren sananne, ba tare da shi ba",
      ],
      facts: ["Sunansa cikin salihai", "Ya fuskanci bautar gunki Ba'al"],
    },
    quran: [
      {
        excerpt:
          'A lõkacin da ya ce wa mutãnensa: "Shin, bã zã ku yi taƙawa ba?" Shin kuna kira ga Ba\'al, kuma kuna barin mafi kyawun masu halitta?',
      },
      {
        excerpt: "Da Zakariyya da Yahaya da Isa da Ilyas, kuma dukansu suna daga salihai.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Al-Yasa' (AS)",
    summary:
      "Annabin adali na zuriyar Isra'ila, mai suna a cikin Kur'ani daga cikin fitattun mutane.",
    body: [
      "Al-Yasa' (amincin Allah ya tabbata a gare shi) - An ambaci sunan Elisha a cikin annabawa a wurare biyu a cikin Alkur'ani, kuma a cikin duka biyun an yabe shi. Ya bayyana a cikin shiryayyu tare da Ismail, Yunus, da Luɗu, waɗanda Allah ya 'fi fifita su a kan talikai' (Alkur'ani 6:86-87), kuma a cikin fitattun mutane tare da Ismail da Dhul-kifli (Alkur'ani 38:48). Rubutun yana ɗaukaka darajarsa maimakon yin ƙidayar cikakken labari.",
      "Domin a takaice wahayi ne da gangan game da shi, musulmi sun tabbatar da hakikanin abin da ya tabbata - cewa shi annabin gaskiya ne wanda ya tsayar da kira zuwa ga bauta wa Allah shi kadai a cikin mutanensa - da kuma nisantar jingina masa tatsuniyoyi da ba su da inganci. Wannan kame kansa wani bangare ne na sahihiyar imani: muna girmama annabi ta wurin kiyaye gaskiya game da shi, ba ta hanyar kirkiran labarai a kusa da shi ba.",
      "Kuma ambatonsa yana tunatar da cewa Allah ya aiko manzanni da yawa, kuma ba a auna darajar annabi da tsawon lokacin da aka kiyaye labarinsa sai dai a auna amincinsa ga aikin. Kamar yadda Kur’ani ya ce a wani wuri, akwai manzanni ‘da muka ba su labarinsu da manzanni wadanda ba mu ba da labarinsu ba’ (Alkur’ani 40:78) – kuma imani da su baki daya, wanda aka sani da wanda ba a sani ba, yana daga cikin imanin musulmi.",
    ],
    profile: {
      nation: "Bani Isra'ila",
      location: "Yankin Levant",
      era: "Zaman annabci na Isra'ila daga baya",
      mission: "Ci gaba da kira zuwa ga tauhidi a tsakanin mutanensa.",
      lessons: [
        "Ka girmama dukkan annabawa daidai da imani",
        "Takaitacciyar ambaton Kur'ani har yanzu tana isar da shiriya ta gaske",
        "Ci gaba na adalci yana kiyaye al'ummomin imani",
      ],
      facts: ["Sunansa kai tsaye a cikin Alkur'ani a cikin fitattu kuma zababbu"],
    },
    quran: [
      {
        excerpt:
          "Da Isma'ila da Al-Yasa' da Yunusa da Luɗu, kuma dukansu Mun fĩfĩta a kan tãlikai.",
      },
      {
        excerpt:
          "Kuma ka ambaci Ismaila da Al-Yasa'a da Zulkifli, kuma dukkansu suna daga fitattu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yunus (AS)",
    summary: "Annabin whale, wanda tubansa a cikin duhu ya zama darasi maras lokaci a cikin bege.",
    body: [
      "Yunus (amincin Allah ya tabbata a gare shi) - Yunusa - an aika zuwa ga mutanen Nineba, amma da suka nace da kiransa, ya bar su cikin fushi kafin Allah ya ba shi izinin tafiya. Kur’ani ya siffanta abin da ya biyo baya: “Kuma (ka ambaci) mutumin kifi, a lokacin da ya tafi yana fushi, kuma ya yi zaton ba za Mu hukunta shi ba.” (k:21:87). Da ya shiga jirgi, aka jefar da shi cikin teku, wani babban kifi ya haɗiye shi, ya faɗa cikin duhun duhu, duhun dare, da teku, da cikin kifin.",
      "A cikin wannan duhu da ya mamaye Yunus ya yi kira da kalmomin da suka zama daya daga cikin addu'o'i mafi soyuwa a Musulunci: \"Babu abin bautawa face Kai; Tsarki ya tabbata a gare Ka. Lalle ne ni, na kasance daga azzalumai.\" (Alkur'ani 21:87). Bai yanke kauna ba; ya tabbatar da kamalar Allah kuma ya fadi nasa laifin. Sai Allah Ya ce: ‚Sai Muka karɓa masa, kuma Muka tsĩrar da shi daga baƙin ciki. Kuma kamar wancan ne Muke tsĩrar da mũminai.” (k:21:88). Kifin ya jefar da shi zuwa ga gaci, sai Allah ya sa shuka ta tsiro don ta kare jikinsa da ya raunana.",
      "Sai ƙarshe mai ban mamaki ya zo: Yunus ya koma ga mutanensa, kuma ba kamar kowace al'umma a cikin Alƙur'ani ba, sun yi imani kuma aka tsirar da su - 'Saboda haka Muka ji daɗinsu har wani lokaci' (Alkur'ani 37:147-148; 10:98). Labarinsa ya ba da darussa guda biyu waɗanda aka haɗa su: kada ku yanke tsammani daga rahamar Allah, komai zurfin duhu, domin tuba ta gaskiya tana mayar da abin da ya ɓace; kuma addu'ar Yunusa itace hanyar rayuwa ga duk wani mai imani cikin damuwa. Manzon Allah Sallallahu Alaihi Wasallama ya koyar da cewa babu wani musulmi da ya tava yin addu'a da ita face Allah ya amsa masa.",
    ],
    profile: {
      nation: "Mutanen Nineba",
      location: "Yankin Mesopotamian",
      era: "Zaman annabci kafin Isa",
      mission: "Ka kira mutanensa zuwa ga tauhidi da tuba.",
      challenges: [
        "Nauyin dagewar kin a da'awa",
        "Gwajin sirri a cikin duhun teku",
        "Komawa ga manufa bayan an gyara",
      ],
      miracles: [
        "Ceto daga cikin kifi",
        "Wani shuka mai tsari ya girma a kansa",
        "Imani da dukan mutanensa",
      ],
      majorEvents: [
        "Barin mutanensa da fitinar teku",
        "Addu'a a cikin duffai uku",
        "Komawa da bangaskiyar Nineba",
      ],
      lessons: [
        "Kada ka yanke kauna daga rahamar Allah",
        "Tuba ta gaskiya tana mayar da aikin",
        "Addu'a a cikin wahala tana canzawa",
      ],
      facts: ["Kuma ana kiransa Dhun-Nun (mutumin kifi) a cikin Alkur'ani"],
    },
    quran: [
      {
        excerpt:
          'Kuma ya yi kira a cikin duffai: "Bãbu abin bautãwa fãce Kai." Tsarki ya tabbata a gare Ka. Lalle ne nĩ, na kasance daga azzãlumai.',
      },
      {
        excerpt:
          "Shin, kuma bãbu wata alƙarya da ta yi ĩmãni sabõda haka ĩmãninta ya amfãne shi fãce mutãne Yunusa? A lõkacin da suka yi ĩmãni, Muka kuranye azãbar wulãkanci daga gare su.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Addu'ar Dhun-Nun a lokacin da ya yi kira ga Allah daga cikin cikin kifin ita ce: La ilaha illa Anta, subhanaka, inni kuntu minaz-zalimin. Babu wani musulmi da ya tava roqon wani abu da shi face Allah ya karva masa.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Zakariyya (AS)",
    summary:
      "Annabin da ya yi addu’a ga magaji adali a cikin tsufa kuma aka amsa shi tare da Yahaya.",
    body: [
      'Zakariyya (amincin Allah ya tabbata a gare shi) - Zakariyya - ya kasance annabin Bani Isra\'ila mai yawan ibada kuma waliyin Maryam. Kuma idan ya shiga gare ta a cikin ɗakinta, sai ya sãmi abinci a wurinta, sai ya tambayi yadda abin ya kasance, sai ta ce: "Lalle ne daga wurin Allah yake." Lallai ne Allah yana azurta wanda Yake so ba da lissafi ba.” (k:3:37). Shaidar arzikin da Allah ya yiwa Maryam ya sake sanya begensa na cewa Allah zai iya ba da abin da ake ganin ba zai yiwu ba.',
      "Ko da yake ya tsufa kuma matarsa ​​ta kasance bakarariya, Zakariyya ya koma ga Allah cikin nutsuwa da addu’a: ‘Ya Ubangiji, hakika ƙasusuwana sun yi rauni, kaina ya cika da fari, ban taɓa jin daɗin addu’ata zuwa gare Ka ba’ (Qur’an 19:4). Bai roki dukiya ko abin duniya ba sai don magada adali wanda zai ci gaba da aikin annabci kuma ya kiyaye bautar Allah. Allah ya amsa da bushara na ɗa, Yahaya - suna, Allah ya ce, ba a ba kowa a gabanin (Alkur'ani 19:7). A matsayin alama Zakariyya ya daina magana da mutane har tsawon kwanaki uku sai dai ta hanyar ishara, da sadaukar da harshensa ga ambaton Allah (Alkur'ani 19:10-11).",
      "Rayuwar Zakariyya tana karantar da mumini kada ya daina yin addu'a, duk da cewa ba za a iya samun amsa ba, kuma ya roki Allah musamman baiwar iyalai na gari da ci gaba da imani. Babban damuwarsa ba kansa ba ne, amma wanda zai ɗauki gaskiya a bayansa. Har ila yau, labarinsa yana girmama hidimar shiru a wuraren ibada a matsayin aiki mai daraja da ƙauna.",
    ],
    profile: {
      nation: "Bani Isra'ila",
      location: "Yankin Kudus",
      era: "Kafin Isa",
      mission: "Yi ja-gorar mutanensa kuma ku kiyaye bauta ta annabci.",
      challenges: [
        "Isar tsufa ba tare da yaro ba",
        "Damuwa ga magada imani",
        "Tsayar da ibada a cikin al'umma mai takura",
      ],
      miracles: ["Bisharar Yahaya a tsufa", "Alamar hana magana na kwana uku"],
      majorEvents: [
        "Waliyyin maryam da sheda ta tanadi",
        "Addu'a ta zuci ga magaji",
        "Addu'ar amsawa da haihuwar Yahaya",
      ],
      lessons: [
        "Kada a daina fatan addu'a",
        "Ka roki Allah ya baka iyali da zuri'a na gari",
        "Hidimar sadaukarwa a cikin ibada tana da daraja",
      ],
      facts: ["Waliyin Maryam", "Uban Yahaya, wanda haihuwarsa ta amsa addu'arsa"],
    },
    quran: [
      {
        excerpt:
          "A nan ne Zakariyya ya kira Ubangijinsa, ya ce: “Ya Ubangiji! Lalle Kai, Kai ne Mai jin addu'a.",
      },
      {
        excerpt:
          'Ya ce: "Ya Ubangijina, lalle ne ƙasusuwana sun yi rauni, kuma kaina ya cika da fari, kuma ban kasance mai baƙin ciki a cikin addu\'ata zuwa gare Ka ba, Ya Ubangijina."',
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Yahya (AS)",
    summary:
      "Annabi tsantsa, mai hikima da aka bayar tun yana kuruciya kuma Allah ya kara masa lafiya.",
    body: [
      "Yahya (amincin Allah ya tabbata a gare shi) — Yahaya — shi ne amsar addu’ar mahaifinsa Zakariyya, wanda Allah ya sanya masa suna kafin haihuwarsa. Allah Ya yi masa magana kai tsaye: 'Ya Yahaya! Kuma ya 'ba shi hikima tun yana yaro' (Alkur'ani 19:12) - kwatancin da ba kasafai ake yi ba wanda ke nuna farkon balaga na ruhaniya. Tun yana kuruciyarsa ya kasance mai sadaukarwa ga Allah da muhimmancin da ya wuce shekarunsa.",
      "Kur’ani ya yabi halayensa a jeri mai kyau: Allah Ya ba shi ‘tausayi daga gare Mu da tsarki, kuma ya kasance mai takawa ga Allah, kuma mai tsoron Allah, kuma bai kasance azzalumi ba, mai fasikanci’ (Qur’ani 19:13–14). Ya kasance mai kamun kai, mai ibada, ana tunawa da shi cikin salihai. Ya kira mutanensa zuwa ga biyayya da gaskiya, kuma ya rigaye Isa, yana mai gaskatãwa ga kalma daga Allah, kuma yana shirya zukata domin shiriya (Alkur’ani 3:39).",
      "Allah ya girmama Yahya da aminci a lokuta uku mafi rauni na kowace rayuwa: 'Aminci ya tabbata a gare shi ranar da aka haife shi, da ranar da zai mutu, da ranar da aka tayar da shi da rai' (Alkur'ani 19:15). Tarihinsa sako ne ga manya da manya: Ba a jingine kusanci ga Allah sai bayan shekaru. Tsarkakewar zuciya, tsananin ibada, da kyautatawa ga iyaye na iya fitowa a cikin mutum tun yana ƙarami - kuma irin wannan rayuwa abin so ne ga Allah.",
    ],
    profile: {
      nation: "Bani Isra'ila",
      location: "Yankin Levant",
      era: "Na zamani tare da Zakariyya kuma kusa da zamanin Isa",
      mission: "Ku yi kira zuwa ga adalci kuma ku shirya zukata domin shiriya.",
      challenges: ["Gyaran jama'a a cikin yanayi maras kyau", "Tsayar da tsafta da ka'ida"],
      majorEvents: [
        "Haihuwarsa a matsayin amsa addu'a",
        "An ba shi hikima a cikin kuruciyarsa",
        "Sanin tsarkinsa da ibadarsa",
      ],
      lessons: [
        "Matashi na iya yin shugabanci cikin adalci",
        "Tsaftar zuciya karfi ne na gaske",
        "Kyautatawa iyaye yana daga cikin takawa",
      ],
      facts: [
        "Sunan Allah kafin haihuwarsa",
        "An girmama shi da salama a lokacin haihuwa, mutuwa, da tashin matattu",
      ],
    },
    quran: [
      {
        excerpt:
          "Ya Yahaya, ka ɗauki Littafi da azama. Kuma Muka ba shi hikima, tun yana yaro, da tausayi daga gare Mu, da tsarki, kuma ya kasance mai takawa ga Allah.",
      },
      {
        excerpt:
          "Allah Ya yi muku bushara da Yahaya, yana mai gaskatãwa ga kalma daga Allah, maɗaukaki, mai kauracewa, Annabi daga salihai.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Isa bn Maryam (AS)",
    summary:
      "Wani manzo mai girma da aka haifa wa Maryama da mu'ujiza, yana kira zuwa ga Allah da ãyõyi bayyanannu.",
    body: [
      'Isa (amincin Allah ya tabbata a gare shi) — Isa – an haife shi ga Maryama ba shi da uba, bisa ga umurnin Allah, a matsayin alamar cikakken ikonsa: ‘Hakika misalin Isa a wurin Allah kamar misalin Adamu ne. Ya halitta shi daga turɓaya, sa\'an nan ya ce masa: "Kasance, sai ya kasance" (k:3:59). Sa’ad da Maryamu ta kawo jariri ga mutanenta, waɗanda suka tuhume ta, Jariri Isa ya yi magana daga jaririn jaririnta yana kāre ta: ‘Hakika, ni bawan Allah ne. Ya ba ni Littafi, kuma Ya sanya ni Annabi” (Qur’an 19:30). Wannan ikirari na farko ya saita yanayin aikinsa duka - cewa shi bawan Allah ne.',
      "An aika Isa zuwa ga Bani Isra’ila don ya tabbatar da Attaura a gabansa, kuma ya kawo Linjila (Linjila). Allah ya taimake shi da mu’ujizozi mabayyani da izninSa: Ya warkar da makaho da kutare, Ya rayar da matattu, kuma Ya siffata tsuntsu daga yumbu mai tashi da iznin Allah (Alkur’ani 3:49). Saƙonsa ya kira mutane da su bauta wa 'Allah Ubangijina kuma Ubangijinku' (Alkur'ani 3:51), kuma zuwa ga gaskiya da adalci. Almajiransa na kusa, Hawariyyun, sun gaskata shi kuma suka goyi bayansa.",
      "Kur'ani ya gyara gaba biyu game da Isa. A kan waɗanda suka ƙaryata kuma suka yi niyyar kashe shi, ta bayyana cewa ba a kashe shi ba, kuma ba a gicciye shi ba; sai dai ya bayyana haka, kuma Allah ya dauke shi zuwa gare Shi (Alkur'ani 4:157-158). A kan waɗanda suka wuce gona da iri, ta nace cewa shi annabi ne kuma manzo ne mai girma, ba Allah ba, kuma ba dan Allah ba – “Masihu ɗan Maryama bai kasance ba face manzo” (Alkur’ani 5:75). A aqidar Ahlus-Sunnah zai dawo kafin ranar lahira. Labarinsa yana karantar da cewa ikon Allah ya zarce dukkan dalilai na halitta, annabawa bayi ne masu girma da girma ba, kuma lallai ne a kiyaye gaskiya daga qaryata da wuce gona da iri.",
    ],
    profile: {
      nation: "Bani Isra'ila",
      location: "The Levant",
      era: "Karni na 1 CE",
      mission: "Ka sabunta tauhidi, ka tabbatar da Attaura, kuma ka yi kira zuwa ga adalci.",
      challenges: [
        "adawa da makirci daga wadanda suka ki shi",
        "Daga baya wuce gona da iri na matsayinsa",
        "Kare tauhidi tsantsa",
      ],
      miracles: [
        "Haihuwa babu uba",
        "Yana magana a cikin shimfiɗar jariri",
        "Waraka da rayarwa da izinin Allah",
      ],
      majorEvents: [
        "Haihuwarsa ta banmamaki da kare mahaifiyarsa",
        "Kiran jama'a tare da bayyanannun alamun",
        "Ana tayar da shi zuwa ga Allah, ba a kashe shi ba",
      ],
      lessons: [
        "Ikon Allah ya zarce dalilai na yau da kullun",
        "Annabawa bayin Allah ne masu daraja, ba na Ubangiji ba",
        "Lallai ne a kiyaye gaskiya daga qarya da wuce gona da iri",
      ],
      facts: ["An ba da Injila (Linjila)", "Zai dawo gabanin kiyama da akidar Ahlus-Sunnah"],
    },
    quran: [
      {
        excerpt:
          '(Isa) ya ce: "Lalle ne, Allah ne Ubangijina kuma Ubangijinku, sai ku bauta Masa." Wannan ita ce hanya madaidaiciya.',
      },
      {
        excerpt:
          "Kuma ba su kashe shi ba, kuma ba su gicciye shi ba; Sai aka bayyana a gare su kamar haka... Ã'a, Allah Ya ɗaukaka shi zuwa gare Shi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Nine mafi kusanci da Isa dan maryam. Annabawa 'yan uwan ​​uwa ne daban-daban, amma addininsu daya ne, babu wani annabi a tsakaninmu.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Muhammad ﷺ",
    summary: "Manzo na karshe, wanda aka aiko domin rahama ga dukkan talikai da hatimin Annabci.",
    body: [
      "Muhammadu ﷺ shine karshen annabawa, ba a aiko shi zuwa ga mutane ko daya ba sai ga dukkan bil'adama, tare da Alkur'ani a matsayin wahayi na karshe kuma kiyaye shi. Allah ya siffanta manzancinsa a aya guda: “Kuma ba Mu aike ka ba face domin rahama ga talikai.” (k:21:107). An haife shi a Makkah, ya samu wahayi na farko yana da shekaru arba'in a cikin kogon Hira, kuma shekaru ashirin da uku masu zuwa ya yi kira ga mutane zuwa ga bauta wa Allah Shi kadai, da tsarkake zukatansu, da rayuwa da adalci da rahama - yana mai cikawa da tabbatar da sakon duk wani annabi da ya gabace shi.",
      "Hanyarsa ita ce sadaukarwa mai dorewa. A Makka shi da muminai na farko sun hakura da izgili da azabtarwa da kauracewa shekara da shekaru. Sai Hijira, Hijira zuwa Madina, inda ya gina al'ummar Musulmi ta farko - tabbatar da salla, 'yan uwantaka tsakanin hijira da mataimaka, da yarjejeniyoyin da aka samu, da al'umma mai tushe ta tauhidi. A cikin shekarun wahala da nasara daga ƙarshe, halinsa bai taɓa gushewa ba; Kur'ani ya shaida, 'Lalle ne, kana da kyawawan halaye' (Alkur'ani 68: 4), kuma shi da kansa ya ce an aiko shi ne zuwa ga cikakken hali.",
      "Allah ya bayyana shi 'Manzon Allah da hatimin annabawa' (Alkur'ani 33:40) - bayansa babu wani annabi. Mafi girman mu'ujizarsa ita ce Kur'ani da kansa, alama ce mai dawwama wacce har yanzu tana jagorantar biliyoyin mutane, kuma an girmama shi da Isra'i da Mi'iraji, tafiyar dare da hawan sama. Ga mumini, shi ne uswah hasanah - kyakkyawan misali (Alkur'ani 33:21) - wanda Sunnarsa ita ce tafarki na imani a aikace. Son shi, da bin shiriyarsa, da yin salati a gare shi, qarya ce a cikin zuciyar rayuwar musulmi.",
    ],
    profile: {
      nation: "Dukkan bil'adama",
      location: "Makkah da Madinah",
      era: "Karni na 7 CE",
      mission: "Isar da wahayi na ƙarshe kuma ku cika saƙon annabci ga dukan mutane.",
      challenges: [
        "Zalunci da kauracewa Makkah",
        "Rikici da gina al'umma mai adalci",
        "Isar da saƙon duniya a cikin ƙabilu da al'ummai",
      ],
      miracles: [
        "Kur'ani a matsayin mu'ujiza mai dorewa",
        "Isra'i da Mi'raj (tafiyar dare da mi'iraji)",
        "Alamu dayawa da izinin Allah",
      ],
      majorEvents: [
        "Farkon wahayi a Makkah",
        "Hijira zuwa Madina",
        "Kammala sako da hudubar bankwana",
      ],
      lessons: [
        "Jinkai da kyawawan halaye a jagoranci",
        "Juriya a ƙarƙashin matsin lamba",
        "Ku bi wahayi da Sunnah tare",
      ],
      facts: ["Hatimin annabawa", "Mafi kyawun misali (uswah hasanah) ga muminai"],
    },
    quran: [
      {
        excerpt:
          "Muhammadu bai kasance uban kõwa ba daga mazajenku, kuma amma shĩ Manzon Allah ne kuma cikon annabãwa.",
      },
      {
        excerpt: "Kuma ba Mu aike ka ba face domin rahama ga talikai.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Misali na da kuma misalin annabawan da suka gabace ni, shi ne na wani mutum wanda ya gina gida mai kyau da tsafta, sai dai wurin bulo daya. Ni ne tubalin, kuma ni ne hatimin annabawa.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Darussa guda daya daga annabawa",
    summary: "Jigogi masu maimaitawa: tauhidi, haƙuri, tuba, da ƙarfin hali.",
    body: [
      "A cikin al'ummomi, annabawa suna kira zuwa ga tushe guda: ku bauta wa Allah Shi kaɗai, kuma ku nisanci duk wani nau'in shirka. Wannan shine jigon wahayi mara canzawa.",
      "Rayuwarsu kuma tana nuna sabar a cikin ƙin yarda, dogara ga Allah a lokacin rashin tabbas, da son gyara al'umma cikin hikima da jajircewa.",
      "Nazarin su yana ƙarfafa juriya: masu bi suna koyi tuba da sauri, jagoranci bisa ɗabi'a, kuma su kasance masu ƙa'ida koda lokacin da gaskiya ba ta da farin jini.",
    ],
    quran: [
      {
        excerpt: "A cikin labaransu akwai darasi ga masu hankali.",
      },
      {
        excerpt: "Waɗannan ne waɗanda Allah Ya shiryar, saboda haka ka bi shiriyarsu.",
      },
    ],
    actions: [
      "Ɗauki darasin annabci ɗaya kowane mako kuma a yi amfani da shi da gangan.",
      "Kayi tunani bayan sallah akan inda kake bukatar karin hakuri ko tuba.",
      "Koyar da ingantaccen labari na annabci ɗaya ga dangi ko abokai akai-akai.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Mu'ujizozi da alamomin annabta",
    summary: "Mu'ujizozi suna tabbatar da gaskiya da iznin Allah, amma ba sa tilastawa imani.",
    body: [
      "Allah ya bai wa annabawa alamomin da suka dace da al'ummarsu: Jirgin Nuhu, Alamomin Musa a gaban Fir'auna, Mu'ujizar Isa da izinin Allah, da Kur'ani ga Muhammadu SAW.",
      "Mu'ujizozi ba ikon annabawa bane masu zaman kansu; suna faruwa ne da yardar Allah don tallafawa wahayi da kafa hujja.",
      "Kur'ani ya nuna cewa har yanzu wasu sun ƙi duk da alamu, tabbatar da shiriya ya dogara da ikhlasi da biyayya, ba wai kallo kaɗai ba.",
    ],
    quran: [
      {
        excerpt:
          "Kuma lalle ne haƙĩƙa Mun aika ManzanninMu da hujjõji bayyanannu, kuma Muka saukar da Littãfi da sikẽli da su.",
      },
      {
        excerpt:
          'Ka ce: "Abin sani kawai, ãyõyi a wurin Allah suke... Shin bai ishe su ba Mu saukar da Littãfi a kanku ana karanta su?"',
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Bayanin Kur'ani na annabawa",
    summary: "Kur'ani ya ambaci annabawa ashirin da biyar kuma ya gabatar da sako guda daya.",
    body: [
      "Kur'ani ya ambaci annabawa ashirin da biyar kai tsaye kuma ya yi nuni da wasu manzanni da dama. An rarraba labarunsu a cikin surori don tunani da shiriya.",
      "Ko da yake saituna sun bambanta, kiransu ɗaya ne: tauhidi, adalci, hisabi, da rahama ta hanyar tuba.",
      "Wannan tsarin yana tsayawa akan Kur'ani kuma yana adana bayanan tarihi na biyu a taƙaice sai dai in an sami ingantaccen hujja.",
    ],
    quran: [
      {
        excerpt:
          "Lalle ne Mun aika Manzanni a gabãninka. daga cikinsu akwai wanda Muka lãbãri zuwa gare ka, kuma daga cikinsu akwai wanda ba Mu ƙirƙira maka ba.",
      },
      {
        excerpt:
          "Mun yi imani da Allah da abin da aka saukar... da abin da aka bai wa Musa da Isa da annabawa daga Ubangijinsu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nassoshi da hanyar karatu",
    summary: "Yadda ake nazarin annabawa da inganci, daidaito, da fa'ida.",
    body: [
      "A fara da nassosin Alqur'ani, sannan a karanta ingantaccen hadisi, sannan a nemi tafsirin tabbatacciya don mahallin. Wannan tsari yana ci gaba da koyo tushen wahayi.",
      "Ka guji rahotanni masu ban sha'awa ko rauni waɗanda suka ci karo da ka'idodin Kur'ani ko darajar annabci. Ba kowane sanannen labari ne ke da tabbataccen shaida ba.",
      "Yi amfani da tarihin rayuwar annabci don gyara ibada da halayen ku, ba kawai don tattara bayanan tarihi ba.",
    ],
    quran: [
      {
        excerpt:
          "Waɗanda suke sauraren magana, kuma suka bi mafi kyawunta, waɗannan ne Allah Ya shiryar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Duk wanda ya bi tafarki yana neman ilimi, Allah yana saukaka masa hanyar shiga Aljannah.",
      },
    ],
    actions: [
      "Karanta labarin Annabi ɗaya kowane mako kai tsaye daga Kur'ani.",
      "Ajiye bayanin kula akan darussa masu amfani, ba kawai bayanan lokaci ba.",
      "Tabbatar da ruwayoyin na biyu tare da amintattun malamai.",
    ],
    disclaimer:
      "Kwanaki na tarihi da ainihin wurare na iya bambanta daga tushe; wannan cibiya tana ba da fifikon yarda, jagora na tushen rubutu.",
    appLinks: [{}, {}],
  },
];

export const PROPHETS_BIO_TOPICS_HA: DeepPartial<ProphetsTopic>[] = [
  {
    title: "Adamu (AS)",
    summary:
      "Mutum na farko kuma na farko, wanda aka girmama da ilimi kuma an jarrabe shi da biyayya.",
    body: [
      "Annabi Adam (a.s) shi ne inda tarihin dan Adam da Annabci yake farawa. Kuma Allah ya halicce shi da hannuwanSa daga yumbu, kuma Ya hura a cikinsa daga ruhinSa, kuma Ya sanar da shi sunayen dukkan kõme. A lokacin da aka umurci mala’iku da su yi sujada ga Adamu don girmamawa, sai suka yi biyayya – amma Iblis ya ki saboda girman kai, kuma daga wannan lokacin aka bayyana kiyayyarsa ga Adamu da zuriyarsa. Wannan fage na buɗewa ya kafa babban wasan kwaikwayo na kowane rayuwar ɗan adam: zaɓi tsakanin biyayya tawali'u da tawaye na fahariya (Alkur'ani 2:30-39).",
      "Allah ya sanya Adamu da matarsa ​​Hawwa a cikin Aljanna kuma ya halatta musu komai sai itace guda. Sai Shaidan ya yi waswasi da shi, suka ci daga gare ta. Amma ku lura da bambancin da ke tsakaninsu da Iblis: Iblis ya baratar da zunubinsa, yayin da Adamu da Hawwa suka yi nadama nan da nan suka koma ga Allah da kalmomin da ya koyar da su — ‘Ya Ubangijinmu! Allah ya karbi tubansu ya aiko su duniya da alkawarin shiriya ga duk wanda zai bi.",
      "Darasi na Adamu shine darasin bege: mutum yana da girma da daraja, duk da haka an gwada shi kuma zai zame. Abin da ke bayyana mumini ba shi da zunubi - Allah ne kawai cikakke - amma yana dawowa da sauri da gaskiya cikin tawbah. Har ila yau, labarin Adamu ya koyar da cewa Shaidan maƙiyi ne bayyananne, bayyani, wanda makaminsa kaɗai ke yin waswasi; amsar ita ce ambaton Allah da neman gafararSa. Tun daga Adamu zuwa gaba, saukowar duniya ba horo ba ne amma matakin gwajin ɗan adam na gaske.",
    ],
    profile: {
      nation: "Farkon ɗan adam",
      location: "Jannah sai kasa",
      era: "Farkon tarihin ɗan adam",
      mission: "Koyar da tauhidi da biyayya ga Allah ga mutanen farko.",
      challenges: ["Kiyayyar Iblis", "Rayuwa bayan saukowa duniya", "Yin ja-gorar iyali na farko"],
      miracles: [
        "Halittu da izinin Allah ba tare da iyaye ba",
        "Ana karantar da sunayen kowane abu",
      ],
      majorEvents: [
        "Halittar Adamu da koyar da sunaye",
        "Sujjadar Mala'iku da kin Iblis",
        "Zamewa a cikin Aljanna, tuba na gaskiya, da saukowa zuwa ga ƙasa",
      ],
      lessons: [
        "Girman mutum yana zuwa tare da alhakin",
        "Tuba ta gaskiya tana sake buɗe kofa bayan kowane kuskure",
        "Shaidan makiyi ne bayyananne, dindindin",
      ],
      facts: [
        "Adamu shine mutum na farko kuma shine annabi na farko",
        "Tubansa ita ce tafarki Alqur'ani na farko na tawbah",
      ],
    },
    quran: [
      {
        excerpt:
          'Kuma (ka ambaci) a lõkacin da Ubangijinka Ya ce wa malã\'iku: "Lalle ne Nĩ, in sanya wani dalĩli a cikin ƙasa madaidaici... Sai Ãdam ya karɓi kalmõmi daga Ubangijinsa, kuma Ya karɓi tũbarsa."',
      },
      {
        excerpt: 'Suka ce: "Ya Ubangijinmu!',
      },
    ],
    hadith: [
      {
        excerpt:
          'Kuma a Rãnar ¡iyãma mutãne zã su je wa Adama, su ce: "Kai ne uban mutãne; Ka yi mana ceto a wurin Ubangijinka.',
      },
      {
        excerpt:
          "Adamu da Musa suka yi gardama. Musa ya ce: Kai ne wanda Allah ya halitta da hannunsa. Adamu ya ce: Shin kuna zargina da wani al'amari da Allah ya rubuta a gare ni kafin ya halicce ni? Don haka Adamu ya yi galaba a kan Musa a jayayya.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Idris (AS)",
    summary:
      "Annabi mai gaskiya yabo da hakuri, kuma Allah ya daukaka shi zuwa ga wani babban matsayi.",
    body: [
      "An ambaci Idris (amincin Allah ya tabbata a gare shi) a taqaice a cikin Alkur’ani, amma duk wata magana game da shi abin yabo ne. Allah ya kira shi 'mutumin gaskiya, Annabi' (Alkur'ani 19:56) kuma ya lissafa shi a cikin masu hakuri da salihai tare da Ismail da Dhul-Kifl (Alkur'ani 21:85-86). Labarinsa ya nuna cewa a wurin Allah, halayen mutum - gaskiya, hakuri, tsayin daka - ya fi tsayin tarihin rayuwarsa.",
      'Allah Ya ce game da shi: "Kuma Muka daukaka shi zuwa ga wani matsayi babba" (k:19:57). Malamai sun fahimci haka ne domin suna nuni zuwa ga daukakar darajarsa a wurin Allah. Bayan abin da Alkur’ani da ingantattun rahotanni suka tabbatar, shahararriyar tatsuniyoyi da aka danganta da Idris (kamar kasancewarsa farkon wanda aka rubuta da alkalami ko wasu sana’o’in duniya) ba a kafa su ta hanyar ingantacciyar hujja ba, don haka mumini mai taka tsantsan ya kiyaye abin da wahayi ya tabbatar da shi maimakon yin ado.',
      "Darasin Idris shi ne kusanci ga Allah ba a auna shi da shahara ko dogon labari, sai dai ta hanyar ikhlasi da daidaito. Bawa mai natsuwa, mai gaskiya, mai tsayin daka zai iya rike tasha a wurin Allah fiye da wadanda tarihi ke tunawa da sunayensu.",
    ],
    profile: {
      era: "Zamanin farko bayan Adamu",
      mission: "Ka kira mutane su bauta wa Allah da gaskiya da adalci.",
      lessons: [
        "Gaskiya tana daukaka darajar bawa",
        "Ba kowane labarin annabi ba ne dalla-dalla - kuma wannan bisa tsari ne",
        "Tsayayye, daidaiton aminci abin so ne ga Allah",
      ],
      facts: [
        "Sunansa a cikin Alkur'ani mai gaskiya kuma Annabi",
        "Wanda aka siffanta da cewa Allah ya daga darajarsa",
      ],
    },
    quran: [
      {
        excerpt:
          "Kuma ka ambaci Idris a cikin Littafi. Lalle shi, ya kasance mai gaskiya kuma Annabi. Kuma Muka ɗaukaka shi zuwa ga matsayi maɗaukaki.",
      },
      {
        excerpt:
          "Da Isma'ila da Idrisu da Zul-kifli dukkansu suna daga masu hakuri. Kuma Muka shigar da su a cikin rahamarMu. Lalle sũ, sun kasance daga sãlihai.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nuhu (AS)",
    summary:
      "Manzo mai haƙuri mai ban mamaki wanda ya kira mutanensa shekaru aru-aru kafin rigyawa.",
    body: [
      "An aika Nuhu (a.s) zuwa ga wasu mutanen da suka bar tauhidi suka tafi da su zuwa ga bautar gumaka. Saƙonsa guda ɗaya, wanda ba ya gushewa shi ne: 'Ya ku mutanena, ku bauta wa Allah; ba ku da wani abin bautãwa waninSa.” (k:7:59). Kur’ani ya adana nasa labarin aikin a cikin suratu Nuhu: ya kira su dare da rana, a bayyane da boye, yana ba da kwadaitarwa da gargadi – yana tunatar da su cewa komawa ga Allah yana kawo ruwan sama, da dukiya, da ‘ya’ya, da gonaki. Amma duk da haka tsara bayan tsara, mafi yawansu sun bijire, suka sa yatsu a cikin kunnuwansu, kuma suka ƙara girman kai kawai (Alkur'ani 71:1-28).",
      "Kur'ani ya nanata girman tsayin hakurinsa: ya zauna a cikinsu 'shekaru dubu kasa da hamsin' (Alkur'ani 29:14), kuma har yanzu 'yan kadan ne suka gaskata. Lokacin da ya bayyana cewa ba zai ƙara yarda da imani ba, sai Allah ya umarce shi da ya gina jirgin bisa ga umarnin Allah, alhali kuwa kafirai suna izgili. Sa'an nan ruwan ambaliya ya zo a matsayin hukunci. Ɗan Nuhu ya ƙi shiga, yana dogara ga dutse bisa gargaɗin ubansa, kuma yana cikin waɗanda aka nutse - abin tunasarwa cewa haɗin jini ba zai iya maye gurbin bangaskiya ba (Qur'ani 11:42-46).",
      "Labarin Nuhu shine babban darasi na Alkur'ani a da'awa: aikin mai kira na gaskiya ne, hakuri, isarwa bayyananne - sakamako na Allah ne Shi kadai. Har ila yau, tana karantar da cewa shiriya al'amari ne na zuciya, ba nasaba ba: an iya rasa ɗan annabi, yayin da baƙi za su iya tsira. Muminai wadanda suka hau jirgin sun zama zuriyar dan Adam da aka sabunta, kuma an girmama Nuhu a matsayin daya daga cikin manya-manyan manzanni biyar masu tabbatar da azama (ulul-'azm).",
    ],
    profile: {
      nation: "Mutanensa kafin rigyawa",
      location: "Yankin Mesopotamiya na da (wanda aka ambata)",
      era: "Da wuri sosai",
      mission: "Ka kira mutanensa zuwa ga tauhidi da tuba.",
      challenges: [
        "Ba'a daga shugabanni da manyan mutane",
        "Ƙarnuka na ƙin yarda tare da masu bi kaɗan",
        "Kafirci da nutsewar dansa",
      ],
      miracles: ["Jirgin ya gina ta bisa koyarwar Allah", "Ceton muminai ta wurin tufana"],
      majorEvents: [
        "Kira zuwa ga tauhidi yana kusan shekaru dubu",
        "Gina jirgin da izinin Allah",
        "Tufana da sabon mafari ga muminai",
      ],
      lessons: [
        "Dagewa da da'awah, barwa Allah sakamako",
        "Dangantakar iyali ba zai iya maye gurbin bangaskiya ba",
        "Allah kullum yana ceton masu gaskiya",
      ],
      facts: [
        "Daya daga cikin manzanni biyar masu tsayuwa (ulul-'azm)",
        "Labarinsa ya zo a cikin surori da yawa, ciki har da wanda aka sanya masa suna",
      ],
    },
    quran: [
      {
        excerpt:
          'Kuma aka yi wahayi zuwa ga Nũhu cewa: "Lalle ne kõwa daga mutãnenka bã zai yi ĩmãni ba fãce waɗanda suka yi ĩmãni, sabõda haka kada abin da suka kasance sunã aikatãwa ya ɓãta maka rai."',
      },
      {
        excerpt:
          'Ya ce: "Ya Ubangijĩna! Lalle ne nã kiran mutãnena dare da yini, kuma amma kirana bai ƙãra musu kõme ba fãce gudu."',
      },
    ],
    hadith: [
      {
        excerpt:
          "Sai mutane su zo wajen Nuhu su ce: Ya Nuhu, kai ne farkon manzanni zuwa ga mutanen kasa, kuma Allah ya sanya maka sunan bawa mai godiya; yi mana roko.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Hudu (AS)",
    summary:
      "An aika zuwa ga Adawa, mutane maɗaukaki ne maɗaukaki waɗanda suka bar ƙarfinsu ya zama girman kai.",
    body: [
      "An aiko da Hud (amincin Allah ya tabbata a gare shi) zuwa ga mutanen Adawa, wayewar da Kur'ani ya kwatanta da ƙarfin jiki kuma ya shahara wajen gina dogayen gine-gine masu ƙayyadaddun abubuwa waɗanda ba a taɓa yin irin su a cikin ƙasa ba (Qur'ani 89:6-8). Zuwa ga wannan mutane masu girman kai, Hud, ya zo da saƙo guda ɗaya da kowane annabi: 'Ya ku mutanena, ku bauta wa Allah; Ba ku da wani abin bautãwa waninSa. Ashe, bã zã ku yi taƙawa ba? (Alkur'ani 7:65). Ya kasance daga nasu, ba ya neman lada, sai dai yana kiran su zuwa ga godiya da nisantar zalunci.",
      "Shugabanninsu suka amsa da ba'a, suna zarginsa da wauta da ƙarya, suna manne da gumaka na kakanninsu. Sun kalubalanci shi da ya kawo hukuncin da ya yi kashedin a kai, da tabbacin cewa babu wani karfi da zai iya kama da karfinsu (Alkur'ani 46:21-25). Hudu ya gargaɗe su a sarari cewa ikon duniya da wayewa mai girma ba su kare wanda ya ƙaryata game da ayoyin Allah, kuma ya yi girman kai a cikin ƙasa.",
      "Hukuncin ya zo ne a matsayin iska mai tsananin zafi, mai hayaniya wadda Allah ‘ya dora musu dare bakwai da yini takwas a jere’ (Alkur’ani 69:6–7), ya bar mutanen da suka taba fada a cikin kututtuka, alhali kuwa Hudu da muminai sun sami tsira da rahamar Allah. An sake maimaita labarin Ad a cikin Alkur'ani a matsayin gargadi na tsaye: karfi, dukiya, da nasara kyauta ne da za a hadu da tawali'u da godiya, ba girman kai ba. Al'umma tana da hisabi ga Allah komai ci gabanta.",
    ],
    profile: {
      nation: "Mutanen 'Ad",
      location: "yankin Al-Ahqaf (yankin kudancin Larabawa a cikin tafsiri na gargajiya)",
      era: "Bayan Nuhu",
      mission: "Dawo da tauhidi, godiya, da adalci a tsakanin Ad.",
      challenges: [
        "Girman kai na gama kai da aka gina bisa ƙarfi da wadata",
        "izgili da wahayi da annabi",
        "Bukatar rashin amincewa da hukuncin gaggawa",
      ],
      miracles: ["Kariyar muminai a lokacin azaba"],
      majorEvents: [
        "Kira zuwa ga tuba da godiya",
        "Gargadi na iska mai tsanani",
        "Halakar Adawa a darare bakwai da kwana takwas",
      ],
      lessons: [
        "Ƙarfi ba tare da tawali'u ba yana kaiwa ga lalacewa",
        "Al'ummai da wayewa suna da hisabi ga Allah",
        "Gargadin annabci rahama ce da aka aiko kafin hukunci",
      ],
      facts: ["Labarin Ad ya sake faruwa a cikin Alkur'ani don gargadi ga al'ummomi na gaba"],
    },
    quran: [
      {
        excerpt:
          "Kuma zuwa ga Ãdãwa (Mun aika) ɗan´uwansu Hũdu. Ya ce: Ya ku mutanena ku bauta wa Allah; Ba ku da wani abin bautãwa waninSa. Ashe, bã zã ku ji tsõronSa ba?",
      },
      {
        excerpt:
          'To, a lõkacin da suka gan shi, kamar girgije yana gabãta kwarurukansu, suka ce: "Wannan girgije ne, Yanã zo mana da ruwa." Ã\'a, shĩ ne abin da kuka yi haƙuri sabõda shi, iska ce a cikinta, azãba mai raɗaɗi.',
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Salih (AS)",
    summary:
      "An aika zuwa ga Samudawa, aka ba su mu'ujizar raƙumar, kuma suka lalatar da alamar da suka nema.",
    body: [
      "An aika Salihu (amincin Allah ya tabbata a gare shi) zuwa ga Samudawa, mutanen da suka gaji Adawa kuma sun shahara wajen sassaka manyan gidaje a cikin duwatsu da zama cikin nutsuwa (Alkur'ani 7:74). Ya kira su, a matsayinsu na ‘yan’uwansu, su bauta wa Allah Shi kadai, su yi watsi da fasadi na shugabanninsu. A lokacin da suka nemi wata aya domin su tabbatar da gaskiyarsa, sai Allah Ya ba da bayyanannen rakumi: Rakumi, da tsari, yana sha a cikin wani yini da aka sani, su kuma a wani yini (Alkur'ani 26:155-156).",
      "Salih ya gargaɗe su da cewa: “Kada ku taɓa ta da cutarwa, har ku kasance a cikin azaba makusanciya.” (k:26:156). Alamar gwaji ce ta kamewa - shin za su iya girmama iyakar da Allah ya kafa? Amma mafi girman kai daga cikinsu, ya sare rakumar a cikin tawaye, sa'an nan kuma ya kalubalanci Salih da ya zo da azabar da aka yi alkawari (Alkur'ani 7:77). Kisan rakumin ana kiransa da aikin miyagu, duk da haka jama'a duka sun yi tarayya cikin aikata laifin ta hanyar yarda da shi.",
      "Azãba ta auku a cikin kwanaki uku: tsãwa mai girma da girgizar ƙasa ta kãma su a cikin gidãjensu, kuma Samũdãwa sun kasance bã su da rai, kuma Allah Ya kuɓutar da Salih da waɗanda suka yi ĩmãni (Alƙur'ãni 7:78-79; 91:14). Darasin yana da kaifi: mu'ujizai ba sa tausasa zuciya mai taurin kai; kawai suna tayar da haƙƙin haƙƙin haƙƙin mallaka. Alamar da aka nema sannan aka bijirewa ta zama hujja akan wadanda suka nema. Kuma yin shiru a gaban mugunta ba tsaka-tsaki ba ne - wata al'umma ce ke da alhakin ayyukan wasu kaɗan.",
    ],
    profile: {
      nation: "Mutanen Samudawa",
      location: "Al-Hijir / arewa maso yammacin Larabawa",
      era: "Bayan 'Ad",
      mission: "Ka kira Samudawa daga shirka da fasadi zuwa ga tauhidi.",
      challenges: [
        "Bukatar mu'ujiza, sannan ƙin yarda da ita",
        "Buɗe ƙin yarda bayan an ba da alamar bayyananne",
        "Barazana ga Salihu da muminai",
      ],
      miracles: ["Rakumar nan ta aiko da wata aya bayyananna daga Allah"],
      majorEvents: [
        "Fitowar rakumi da ruwan raba",
        "Cin duri da kashe rakumin",
        "Harin da ya halaka masu karyatawa",
      ],
      lessons: [
        "Mu'ujiza ba sa amfanar zuciya mai taurin kai",
        "karya iyaka da Allah ya tsara yana da sakamako na hakika",
        "Yarda da mummuna rabo a cikin laifinsa",
      ],
      facts: ["An san Samudawa da sassaƙa gidaje a cikin tsaunuka"],
    },
    quran: [
      {
        excerpt:
          "Waccan rãƙumar Allah ce aya a gare ku, sabõda haka ku bar ta ta ci a cikin ƙasar Allah, kuma kada ku shãfe ta da wata cũta, har azãba mai raɗaɗi ta same ku.",
      },
      {
        excerpt:
          "Samũdãwa sun ƙaryata, sabõda zãluncinsu, a lõkacin da aka aiko mafi shaƙãwa daga gare su... Sai Ubangijinsu Ya halakar da su sabõda zunubinsu, kuma Ya daidaita su.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ibrahim (AS)",
    summary:
      "Khalilullah, abokin Allah kuma abin koyi na tauhidi tsantsa, ya jarrabe shi da nasara a kowace jarrabawa.",
    body: [
      "Ibrahim (amincin Allah ya tabbata a gare shi) shi ne babban misali na Alkur'ani na tsantsar tauhidi da aka samu ta hanyar tunani da jajircewa. Sa’ad da yake matashi a cikin al’umma yana nutsewa cikin bautar gumaka, ya yi magana a fili tare da mutanensa, mahaifinsa, har ma da sarki: rana, wata, da taurari duk sun shuɗe, to ta yaya za su zama alloli? (Alkurani 6:75-79). Don ya fallasa rashin ƙarfi na gumaka, ya karya su duka amma mafi girma kuma ya gaya wa mutanensa su tambayi gumaka da kansu abin da ya faru - tilasta su yarda da gumakansu ba za su iya magana ko kare kansu ba (Alkur'ani 21: 57-67).",
      "Domin wannan tsayuwar aka jefa shi a cikin wata wuta mai tsanani, amma Allah ya yi umarni, 'Ya wuta, ki kasance sanyi da aminci ga Ibrahim' (Alkur'ani 21:69), kuma ya fito ba tare da wani rauni ba. Rayuwarsa ta zama jerin fitintinu da suka hadu da mika wuya gaba daya: ya bar kasarsa saboda Allah, ya yi addu’a ga zuri’a salihai tun yana tsufa kuma aka ba shi Ismail da Ishaq, aka jarrabe shi da umurnin yanka dansa abin kaunarsa – wanda uba da dansa suka yarda da su a mika wuya kafin Allah ya fanshi yaron – kuma ya tayar da harsashin Ka’aba a Makka tare da Isma’ila, yana yi musu addu’a ga al’ummar Muminai (Alkur’ani da za a aiko musu da al’ummar muminai daga cikin muminai). 2:124–129; 37:100–107).",
      "Saboda wannan ibadar da ba ta misaltuwa, Allah ya dauki Ibrahim a matsayin khalil – abokin tarayya na kud-da-kud (Qur’an 4:125) – kuma ya sanya shi limami, shugaba ga dukkan bil’adama (Qur’an 2:124). Gadonsa ya gudana ta hanyar annabawan da suka zo daga zuriyarsa, da ayyukan Hajji, da kuma ainihin musulmi, wanda aka umurce shi da ya bi ‘addinin Ibrahim, yana karkata zuwa ga gaskiya’ (Alkur’ani 3:95). Labarinsa yana koyar da tawakkul a cikin gwaji mafi wuya, cewa jagoranci na gaskiya yana ginu akan sadaukarwa, kuma bangaskiya ta gaskiya tana iya sake fasalin tsararraki.",
    ],
    profile: {
      nation: "Al'ummar Mesopotamiya da Levantine",
      location: "Iraki, Levant, Makkah",
      era: "Tsakanin zamani",
      mission: "Rayar da tauhidi zalla kuma a tabbatar da gadon mika wuya.",
      challenges: [
        "Fuskantar masu bautar gumaka, mahaifinsa, da azzalumin sarki",
        "Ka yi hijira daga mahaifarsa don Allah",
        "Jarabawar sadaukarwa dansa abin so",
      ],
      miracles: [
        "Wutar ta yi sanyi da aminci da izinin Allah",
        "Zuriya masu adalci da aka ba su a cikin tsufa",
      ],
      majorEvents: [
        "Muhawara da karya gumaka",
        "Ana jefa shi cikin wuta kuma a kai",
        "Gina Ka'aba da Isma'il da babbar jarabawar sadaukarwa",
      ],
      lessons: [
        "Tawakkul (tawakkali ga Allah) a cikin mafi tsananin jarrabawa",
        "Jagoranci na gaskiya yana bukatar sadaukarwa",
        "Bangaskiya na gaskiya na iya sake fasalin tsararraki",
      ],
      facts: [
        "Wanda aka fi sani da Khalilullah, aminin Allah na kusa",
        "Kakan annabawa ta hanyar Ismail da Ishaq",
      ],
    },
    quran: [
      {
        excerpt:
          'Kuma (ka ambaci) a lõkacin da Ubangijinsa Ya jarrabe shi da umurni, sai ya cika su. Ya ce: "Lalle ne ni, Mai sanya ka shugaba ga mutãne."',
      },
      {
        excerpt:
          "Muka ce: Ya wuta, ki kasance sanyi da aminci ga Ibrahim. Kuma suka yi nufin cũta a gare shi, sai Muka sanya su mafi hasãra.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Za a tattara ku ba takalmi, tsirara, marasa kaciya. Wanda za a fara tufatar da shi ranar kiyama shi ne Ibrahim.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Lutu (AS)",
    summary:
      "Annabin da ya yi wa mutanensa kashedi a kan wata babbar fasikanci da wata al’umma ba ta yi a gabansu ba.",
    body: [
      "Lutu (amincin Allah ya tabbata a gare shi) na zamani ne kuma dangin Ibrahim wanda ya yi hijira tare da shi sannan aka tura shi zuwa ga mutanen Saduma da garuruwan da ke kusa. Tare da kira zuwa ga bauta wa Allah Shi kaɗai, mutanensa sun kasance da laifin fasikanci marar kunya Kur'ani ya ce 'babu wanda ya taɓa aikatawa a duk duniya a gabani' - kusantar maza maimakon mata, kuma suna aikata alfasha a fili a cikin taronsu (Alkur'ani 7:80-81; 29:28-29). Lutu ya kira su da ikhlasi, zuwa ga tsarki da iyakoki na halitta.",
      "Ba su gamu da gyara nasa da jayayya ba sai da gaba, suna barazanar fitar da shi, kuma suna yin izgili da kiransa zuwa ga ladabi: 'Ku fitar da su daga garinku; Waɗannan mutane ne masu tsarkake kansu. (Alkur'ani 7:82). Ko a cikin gidansa fitinar ta kasance mai tsanani - matarsa ​​​​ta kasance tare da miyagu kuma ba ta yi imani ba, tana sake tabbatar da cewa shiriya ce daga Allah kuma ba a gadonta ta hanyar aure ko jini (Alkur'ani 66:10).",
      "Lokacin da wa'adin ya zo, sai Allah Ya aiko mala'iku a matsayin baqi. Sai mutane suka yi gaggawar cutar da su har ma, Luɗu ya ji ba shi da ƙarfi har sai da mala’iku suka bayyana ainihin su, suka ce masa ya tafi tare da muminai da dare. Da gari ya waye aka kifar da garuruwa aka jefe su da duwatsu (Alkur'ani 11:77-83). Labarin Lutu gargaɗi ne a sarari cewa gaskiyar ɗabi'a ba ta canzawa domin al'umma ta yarda da zunubi kuma tana daidaita shi a fili - kuma Allah koyaushe yana kuɓutar da masu gaskiya, ko da yake kaɗan ne.",
    ],
    profile: {
      nation: "Mutanen Saduma da garuruwan da ke makwabtaka da su",
      location: "Yankin Tekun Matattu (wanda aka ambata)",
      era: "Zaman Ibrahim",
      mission: "Ka kira mutanensa daga alfasha bayyananna da kafirci zuwa ga tauhidi da tsarki.",
      challenges: ["Zubar da mutuncin jama'a", "Ba'a da barazanar korar", "Kafircin matarsa"],
      majorEvents: [
        "Gargadi masu dagewa game da alfasha",
        "Ziyarar Mala'iku sun canza kamar baƙi",
        "Kifar da garuruwa",
      ],
      lessons: [
        "Gaskiyar ɗabi'a ba ta canzawa tare da amincewar jama'a",
        "Mai yiyuwa ne muminai kaɗan ne",
        "Allah yana kubutar da masu gaskiya daga halaka gaba daya",
      ],
      facts: ["Wani dangin Ibrahim wanda ya yi hijira tare da shi aka aika zuwa Saduma"],
    },
    quran: [
      {
        excerpt:
          "Shin, kunã je wa mazaje daga tãlikai, kuma kunã barin abin da Ubangijinku Ya halitta muku, ku zama mata? Ã'a, ku mutãne ne azzalumai.",
      },
      {
        excerpt:
          "To, a lõkacin da umurninMu ya je, Muka sanya mafi ƙasƙantawar alƙaryu, kuma Muka yi ruwan duwãtsu na lãka mai kauri a kansu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ismail (AS)",
    summary:
      "Annabi mai gaskiya ga maganarsa, mai hakuri a jarrabawa, kuma maginin Ka'aba tare da mahaifinsa Ibrahim.",
    body: [
      "Isma'il (amincin Allah ya tabbata a gare shi) shi ne ɗan fari ga Ibrahim, wanda aka ba shi tsufa. Rayuwarsa ta fara ne da jarabawar amana: da izinin Allah Ibrahim ya bar jariri Isma'il da mahaifiyarsa Hajar a cikin kwarin Makkah, inda babu amfanin gona, babu ruwa. A nan ne Hajar ke gudun neman ruwa a tsakanin tsaunukan Safa da Marwah, sai Allah ya sa magudanar ruwan Zamzam ta kwararowa – aikin guzuri ne da zuriyar Hajar da kowane mahajjaci ke yin sa’ayi na Hajji da Umra har yau.",
      "Isma'il yana matashi ya gamu da jarabawa mafi girma tare da mahaifinsa: sa'ad da Ibrahim ya gaya masa hangen nesa na sadaukar da shi, Ismail ya amsa da mika wuya, 'Ya babana, ka aikata yadda aka umarce ka; Za ku same ni, in Allah Ya so, daga masu haƙuri.” (k:37:102). Dukansu sun mika wuya, kuma Allah ya fanshi Isma'il da babbar sadaukarwa, yana girmama biyayyarsu har abada. Uba da dansa suka tayar da harsashin ginin Ka'aba tare, suna addu'a, 'Ya Ubangijinmu, ka karba mana; Lalle ne Kai, Kai ne Mai ji, Masani' (Alkur'ani 2:127).",
      "Alkur'ani ya takaita halayensa a cikin sahu mai daraja: 'Ya kasance mai gaskiya ga alkawarinsa, kuma ya kasance manzo kuma annabi. Ya kasance yana umurtar iyalansa da salla da zakka, kuma ya kasance mai yarda da Ubangijinsa.” (k:19:54-55). Rayuwar Isma'il tana karantar da kyawun kiyaye kalmar, da tsayuwar ibada, da kuma iyali masu ba da haɗin kai ga Allah. Ta hanyarsa, layin annabcin Larabawa ya kai ga Annabin ƙarshe, Muhammad ﷺ.",
    ],
    profile: {
      nation: "Farkon mutanen yankin Makkah",
      location: "Makkah",
      era: "Bayan hijira Ibrahim",
      mission: "Ka riki tauhidi da ibada, kuma ka umarci iyalansa da salla da zakka.",
      challenges: [
        "Mummunan mafarin rayuwa a cikin kwarin da ba kowa",
        "Gwajin sadaukarwa",
        "Tsayar da rayuwa mai tushen ibada da amana mai tsarki",
      ],
      miracles: ["Ruwan Zamzam ya samar a cikin jeji", "Fansa daga hadaya da Allah"],
      majorEvents: [
        "Hagu da mahaifiyarsa Hajar a kwarin Makkah",
        "Gwajin sadaukarwa, ya sadu da cikakkiyar biyayya",
        "Gina Ka'aba tare da Ibrahim",
      ],
      lessons: [
        "Ka cika alkawuranka da aminci",
        "Iyali za su iya ba da haɗin kai wajen bauta da kuma biyayya",
        "Gado mai tsarki yana buƙatar ɗabi'a mai ƙarfi",
      ],
      facts: [
        "An bayyana shi a cikin Alkur'ani da cewa gaskiya ne ga alkawarinsa",
        "Kakan kabilar Larabawa da layin annabci na ƙarshe",
      ],
    },
    quran: [
      {
        excerpt:
          "Kuma ka ambaci Isma'il a cikin Littafi. Lalle ne shi, ya kasance mai gaskiya ga alkawarinsa, kuma ya kasance manzo kuma Annabi. Kuma ya kasance yana umurtar iyalansa da salla da zakka, kuma ya kasance mai yarda da Ubangijinsa.",
      },
      {
        excerpt:
          "Kuma a lõkacin da Ibrãhĩm yake ɗaukaka harsãshin gini ga Ɗãki da Ismã'ĩla, (sun ce): \"Yã Ubangijinmu! Lalle ne Kai, Kai ne Mai ji, Masani.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Ishaq (AS)",
    summary: "Annabi mai albarka wanda aka yi bushara ga Ibrahim, kuma baban Ya'aqub.",
    body: [
      "An haifi Ishaq (amincin Allah ya tabbata a gare shi) ga Ibrahim da matarsa ​​Saratu a cikin tsufansu – haihuwar da mala’iku suka yi shela a matsayin bushara a lokacin da Saratu ta wuce shekarun haihuwa ta yi dariya cikin mamaki. Kur'ani ya rubuta wannan lokacin: 'Mun yi mata bushara game da Ishaq da kuma, bayan Ishaq, Yakubu' (Alkur'ani 11:71). Haihuwarsa ta kasance alamar cewa ikon Allah da rahamarsa ba su da iyaka da iyakokin ɗan adam, kuma ta'aziyya ga kowane mumini da ke jiran bege mai wuyar gaske.",
      "Kur'ani ya ci gaba da kiran sunan Ishak a cikin salihai, zaɓaɓɓu, kuma annabawa maɗaukaki, yana kwatanta shi da Yakubu a matsayin waɗanda aka ba su 'ƙarfi cikin bauta da gani' (Alkur'ani 38: 45-47). Ta wurin Ishaq ne Yakubu (Isra'ila) ya zo, kuma daga Yakubu ya fito da wata doguwar jerin annabawa da aka aika zuwa Bani Isra'ila - don haka Ishak ya tsaya a matsayin uban annabci, hanyar haɗin kai ga ci gaba da shiriya a cikin tsararraki.",
      "Labarinsa, ko da yake an faɗi a taƙaice, yana ɗauke da darussa guda biyu masu ɗorewa: godiya ga baiwar da Allah ya ba mu fiye da yadda muke tsammani, da sanin cewa zuri'ar adalci amana ce - bangaskiya dole ne a ba da ita, ba gada kawai ba. Ni'imar da aka sanya a gidan Ibrahim ta kasance tana kiyaye ta domin bayin Allah ne suke ɗaukar ta.",
    ],
    profile: {
      nation: "Al'ummar Levantine",
      location: "Levant (Sham)",
      era: "Bayan Ibrahim",
      mission: "Ci gaba da jagorar annabci a cikin zuriyar Ibrahim mai albarka.",
      miracles: ["Haihuwar da aka yi wa tsofaffin iyaye albishir ne"],
      majorEvents: [
        "Albishir da aka yiwa Ibrahim da Saratu",
        "Cigaban zuriyar annabci ta hanyar Ya'aqub",
      ],
      lessons: [
        "Allah yana bayarwa fiye da tsammanin ɗan adam",
        "Zuriyar adalai amana ce da za a kiyaye",
        "Magaji mai aminci yana kiyaye jagora a raye",
      ],
      facts: ["Baban Yakubu", "Sunansa tare da Ibrahim da Yakubu a matsayin zaɓaɓɓen iyali"],
    },
    quran: [
      {
        excerpt:
          "Ita kuwa matarsa ​​tana tsaye tana dariya. Sa'an nan Muka yi mata bushãra da Is'hãƙa, kuma a bãyan Is'hãƙa, Yãƙũba.",
      },
      {
        excerpt:
          "Kuma ka ambaci bãyinMu Ibrahim da Is'hãƙa da Ya'aƙũba, ma'abũta ƙarfi da gani. Kuma lalle ne, haƙĩƙa, Mun zãɓe su da wani abu keɓantacce: ambaton Gida.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ya'qub (AS)",
    summary:
      "Har ila yau ana kiransa Isra'ila, annabi wanda kyakkyawan haƙurinsa ta wurin baƙin ciki ya misalta dogara ga Allah marar girgiza.",
    body: [
      "Yakub (amincin Allah ya tabbata a gare shi), kuma ana ce da shi Isra’ila, shi ne dan Ishaq kuma uban sha biyun da suka zama kabilar Bani Isra’ila – ciki har da Yusuf. Ya rene 'ya'yansa akan tauhidi, kuma Alkur'ani ya kiyaye alkawarin da ya dauka daga gare su a kan gadon mutuwarsa: 'Me za ku bauta wa bayana?' Suka ce, 'Za mu bauta wa Ubangijinku, kuma Ubangijin ubanninku... Abin bautawa guda ɗaya, kuma a gare Shi muke sallamawa' (Alkur'ani 2:132-133). Babban damuwarsa, har zuwa ƙarshe, shine bangaskiyar tsara na gaba.",
      "Babbar fitinarsa ta bayyana a cikin labarin Yusuf. Sa’ad da ’ya’yansa suka dawo da rigar Yusufu da ƙaryar cewa kerkeci ne ya cinye shi, Yakubu ya gani ta hanyar yaudara kuma bai amsa da fushi ba sai da kamewa: “Don haka haƙuri ya fi dacewa, kuma Allah ne wanda ake neman taimakonsa a kan abin da kuke siffantawa.” (k:12:18). Tsawon shekaru da yawa na rabuwa yana baƙin ciki har, kamar yadda Kur'ani ya faɗa, idanunsa suka yi fari saboda baƙin ciki - duk da haka ya danne baƙin cikinsa kuma bai yanke ƙauna ba (Qur'ani 12:84).",
      "Zuciyar misalin Yakubu ita ce jumla guda: 'Kada ku yanke tsammani daga rahamar Allah; lalle ne, babu mai yanke tsammani daga rahamar Allah face mutane kafirai.” (k:12:87). Nasa ne abin koyi na sabar jamil - kyakkyawan haƙuri - wanda ba wai murabus ba ne amma mai aiki, mai bege cewa hikimar Allah za ta bayyana a lokacinsa. Lokacin da aka dawo masa da Yusuf, ganinsa ya dawo, wannan hakurin ya tabbata. Yakub yana karantar da duk wani mumini mai bakin ciki da ya rike bakin ciki da yakini a zuciya daya.",
    ],
    profile: {
      nation: "Asalin Bani Isra'ila",
      location: "Levant, tare da ƙaura zuwa Masar",
      era: "Zamanin Yusuf",
      mission: "Ka shiryar da iyalansa da zuriyarsa cikin tauhidi.",
      challenges: [
        "Tashin hankali da kishi a tsakanin yayansa",
        "Tsawon rabuwa da Yusuf",
        "Jurewa baƙin ciki mai zurfi ba tare da rasa bege ba",
      ],
      majorEvents: [
        "Shawararsa da alkawarin tauhidi ga 'ya'yansa maza",
        "Tsawon shekarun hakuri akan Yusuf",
        "Murnar haduwa da Yusuf a Masar",
      ],
      lessons: [
        "Kyakkyawar haƙuri (sabr jamil) yana aiki, bangaskiya mai bege",
        "Iyaye suna tsara gadon bangaskiya na 'ya'yansu",
        "Kada ka yanke kauna daga rahamar Allah",
      ],
      facts: ["Ana kuma kiransa Isra'ila", "Baban Yusuf da kabilar Bani Isra'ila"],
    },
    quran: [
      {
        excerpt:
          'Ya ce: "Ã\'a, rãyukanku sun fitine ku zuwa ga wani abu." Don haka hakuri ya fi dacewa. Tsammãnin Allah Ya zo mini da su gabã ɗaya.',
      },
      {
        excerpt:
          "Suka ce: \"Za mu bauta wa Abin bautawarka, kuma Abin bautawar ubanninka Ibrãhĩm da Ismã'ĩla da Is'hãƙa, abin bautãwa guda ne, kuma a gare Shi mãsu sallamãwa ne.\"",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yusuf (AS)",
    summary:
      "Annabin da tafiyarsa daga rijiya zuwa gadon sarautar Masar tana karantar da tsarki da hakuri da gafara.",
    body: [
      "Yusuf (amincin Allah ya tabbata a gare shi) shi ne batu mafi cikar labari guda na Kur'ani - suratu Yusuf, wadda Allah ya kira 'mafi kyawun labarai' (Alkur'ani 12:3). Yana yaro ya ga mafarki na gaskiya na taurari goma sha daya da rana da wata suna sujjada masa. ’Yan’uwansa masu kishi suka jefa shi cikin rijiya suka sayar da shi bauta a Masar, aka saye shi a gidan wani ma’aikaci mai ƙarfi. Ta kowane juyi, Yusuf ya kiyaye imaninsa da amincinsa.",
      "An gwada tsarkinsa a lokacin da matar maigidansa ta yi kokarin lalata shi. Ya ki, ya ce, ‘Ina neman tsarin Allah,’ kuma ya fifita kurkuku a kan zunubi: ‘Kurkuku ya fi soyuwa a gare ni daga abin da suke kira na zuwa gare shi’ (Qur’an 12:33). Ko da yake ba shi da laifi, an daure shi na tsawon shekaru - har ma a can ya kira ’yan uwansa fursunoni su yi tauhidi da fassara mafarkai. Sa’ad da mafarkin da sarki kansa ya yi game da shekara bakwai na yunwa ya ruɗe kotun, baiwar fassarar da Allah ya yi wa Yusufu ta kai shi gaban sarki, wanda ya sa shi mai kula da baitulmalin Masar. Ya tafiyar da al'umma ta hanyar yunwa da hikima da adalci.",
      "Ƙarshen labarin ba iko bane amma gafara. A lokacin da 'yan'uwansa suka tsaya a gabansa ba su gane shi ba, sai Yusufu ya bayyana kansa, ya ce: \"Babu laifi a kanku a yau. Allah zai gafarta muku, kuma Shi ne Mafi rahamar masu jin kai' (k:12:92). Ya godewa Allah akan kowane alheri, yana mai cewa Ubangijinsa ya kyautata lokacin da ya fitar da shi daga kurkuku kuma ya tara iyali. Yusufu yana karantar da cewa tsafta da takawa suna kare mumini, cewa shirin Allah a natse yana shafe kowane makirci na mutum, kuma gafara - ba fansa ba - ita ce alamar masu daraja.",
    ],
    profile: {
      nation: "Zuriyar Bani Isra'ila a Masar",
      location: "Kan'ana a Misira",
      era: "Kafin Musa",
      mission: "Tsaya tauhidi da tsafta da adalci yayin hidimar al'umma.",
      challenges: [
        "Cin amanar 'yan uwansa",
        "Jaraba da kazafin karya",
        "Tsawon ɗaurin kurkuku duk da rashin laifi",
      ],
      miracles: ["Baiwar Allah ta fassarar mafarki na gaskiya"],
      majorEvents: [
        "Rijiya da rabuwa da mahaifinsa",
        "Shekarun dauri",
        "Tashi zuwa ga mulki a Misira da haɗuwa da iyalinsa",
      ],
      lessons: [
        "Tsafta da mutunci suna kare imani",
        "Gafara yana warkar da iyalai",
        "Makircin Allah ya fi kowane mutum makirci",
      ],
      facts: [
        "Dukan suratu Yusuf, wadda ake kira mafi kyawun labarai, ta dogara ne akan rayuwarsa",
      ],
    },
    quran: [
      {
        excerpt:
          'Ya ce: "Babu laifi a kanku a yau." Allah Ya gafarta muku; Kuma Shĩ ne Mafi rahamar mãsu rahama.',
      },
    ],
    hadith: [
      {
        excerpt:
          "Maɗaukaki ɗan mai daraja ɗan sarki ɗan sarki Yusuf ɗan Yaƙub ɗan Ishaq ɗan Ibrahim.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shu'aibu (AS)",
    summary:
      "Annabin da ya daura imani da gaskiya a cikin ciniki kuma ya gargadi Madyana akan ha'inci da zalunci.",
    body: [
      "An aika da Shu'aibu (amincin Allah ya tabbata a gare shi) zuwa ga mutanen Madyana, wata al'umma ce ta fatauci wadda ta lalatar da tattalin arzikinta ta hanyar ha'inci: takaitaccen mudu da awo, da zaluntar mutane da dukiyoyinsu, da yada zalunci a cikin kasa. Saƙonsa ya haɗa ɓangarori biyu na imani waɗanda mutane sukan yi ƙoƙari su rabu da su - ibada da xa'a: 'Ya mutanena, ku bauta wa Allah; Ba ku da wani abin bautãwa waninSa. Kuma ku cika ma'auni da sikẽli da ãdalci, kuma kada ku hana mutãne hakkinsu' (k:11:84-85).",
      "Jama'arsa suka yi tsayin daka, suna tambayar ko addu'arsa ta bukaci su yi watsi da al'adun ubanninsu na yaudara, su yi abin da suka ga dama da dukiyarsu (Alkur'ani 11:87). Sun yi masa izgili, suka yi masa barazanar korar shi da muminai, har ma sun toshe hanyoyi. Shu’aibu ya dage da tausayawa da tunatarwa bayyananna, yana mai dagewa sai dai ya nemi gyara gwargwadon ikonsa, kuma nasararsa daga Allah ce kadai: ‚Kuma nasarata ba ta kasance ba face ta wurin Allah. A gare Shi na dogara, kuma zuwa gare Shi nake mayarwa.” (k:11:88). Ana tunawa da shi da bajintar da ya yi wajen kiran jama’arsa.",
      "A lokacin da suka dawwama a kan kafirci, azaba ta zo ta kama wadanda suka yi zalunci, alhali kuwa Allah Ya tseratar da Shu'aibu da muminai (k:7:91-93). Tarihinsa yana ba da darasi da sau da yawa ba a kula da shi: gaskiyar tattalin arziki ba ta bambanta da addini - yana cikinsa. Ha'inci a kasuwa, cin gajiyar masu rauni, da aiwatar da matakai al'amura ne na imani, kuma al'ummar da ta halalta zalunci tana kiran hukuncin Allah.",
    ],
    profile: {
      nation: "Mutanen Madyan",
      location: "Yankin kasuwanci na Larabawa / Levantine",
      era: "Bayan zuriyar Ibrahim",
      mission: "Kira zuwa ga tauhidi da gaskiya da adalci a cikin ciniki.",
      challenges: [
        "Cin hanci da rashawar kasuwa ya karu",
        "Ba'a daga manyan mutane",
        "Barazanar kora",
      ],
      majorEvents: [
        "Kira zuwa ga cikakken ma'auni da yin adalci",
        "adawa da barazanar jama'a",
        "Azãbar mãsu kãfirta",
      ],
      lessons: [
        "Bangaskiya tana buƙatar gaskiya a cikin kasuwanci",
        "Zaluncin jama'a yana kiran hukuncin Allah",
        "Annabawa suna magana ne akan ladubban zamantakewa da tattalin arziki, ba na al'ada kadai ba",
      ],
      facts: ["An san shi don jaddada ma'auni da ma'auni kawai"],
    },
    quran: [
      {
        excerpt:
          "Ya ku mutanena, ku bauta wa Allah; Ba ku da wani abin bautãwa waninSa. Ku cika mũdu da sikẽli kuma kada ku hana mutãne hakkinsu, kuma kada ku yi ɓarna a cikin ƙasa.",
      },
      {
        excerpt:
          "Kuma nasarata ba ta kasance ba face ta Allah. A gare Shi na dõgara, kuma zuwa gare Shi nake komawa.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ayyub (AS)",
    summary:
      "Misalin Hakuri na Alkur'ani: Ba a girgiza cikin ibada ta hanyar doguwar jinya da rashi.",
    body: [
      "Ayyub (amincin Allah ya tabbata a gare shi) - Ayuba - shine alamar sabar mai dorewa a cikin Kur'ani. Annabi ne ya albarkace shi da lafiya, dukiya, da iyali, sannan aka jarrabe shi da rasa su, da kuma doguwar jinya mai raɗaɗi. A cikin wannan duka bai yi daci ba ko ya zargi Ubangijinsa da zalunci; ya rike godiya da zikiri. Alkur'ani ya yabe shi da kalmomin da suka dauki labarinsa gaba daya: ‚Lallai ne, mun same shi mai hakuri, kyakkyawan bawa. Lalle shi, ya kasance mai yawan komawa zuwa ga Allah.” (k:38:44).",
      "Idan daga karshe wahala ta yi yawa, sai a lura da kyawawan dabi'u (adab) na addu'arsa. Bai nema ko korafi a kan hukuncin Allah ba; sai kawai da kaskantar da kai ga Ubangijinsa: “Lalle ne, wahala ta shafe ni, kuma Kai ne Mafi rahamar masu rahama.” (k:21:83). Ya tabbatar da rahamar Allah a daidai lokacin da ake tambaya. Allah ya amsa masa ya ce, 'Ka doki kasa da kafarka; Wancan wanka ne mai sanyi da abin sha, kuma Ya tafiyar da cutar, kuma Ya mayar da mutanensa da ƙari, domin rahama daga gare Shi, kuma tunatarwa ga masu bauta (k:21:84; 38:41-43).",
      "Ayyub yana koyar da cewa haƙuri ba juriya ba ne amma nau'i ne na ibada - ci gaba da komawa ga Allah yayin gwaji. Misalinsa kuma yana gyara yadda muke yin addu’a: tare da tawakkali, ba tare da korafe korafe kan hukuncin ba, da kuma yaqini cikin rahamar Allah. Kuma qarshensa yana tabbatar wa duk wani mumini da aka jarrabe shi da cewa jarrabawa da imani za ta iya daga darajar bawa kuma a koda yaushe ana samun sauki a lokacin Allah.",
    ],
    profile: {
      era: "Zamanin annabci bayan Ibrahim (faɗin mahallin)",
      mission: "Ka shiryar da mutanensa alhalin yana mai dawwama da haquri da ibada cikin tsanani.",
      challenges: [
        "Rashin lafiya mai tsawo kuma mai raɗaɗi",
        "Asarar dukiya da iyali",
        "Jimiri a ƙarƙashin gwaji mai tsawo",
      ],
      miracles: ["Waraka da sauki da izinin Allah", "Maida iyali da albarka bayan fitina"],
      majorEvents: [
        "Addu'arsa mai tawali'u a cikin wahala",
        "Taimakon Allah, warkarwa, da maidowa",
      ],
      lessons: [
        "Hakuri ibada ce mai aiki",
        "Addu'a tana da kyau idan tawali'u da rashin korafe-korafe",
        "Gwaje-gwajen da aka ɗauka tare da bangaskiya na iya ɗaukaka darajar mutum",
      ],
      facts: ["An kawo shi a cikin al'adar Musulunci a matsayin abin koyi na sabar"],
    },
    quran: [
      {
        excerpt:
          'Kuma Ayyub, a lokacin da ya kirayi Ubangijinsa: "Lalle ne, cũta ta shãfe ni, kuma Kai ne Mafi rahamar mãsu rahama."',
      },
      {
        excerpt:
          "Lalle Mũ, Mun sãme shi mai haƙuri, madalla da bãwa. Lalle shĩ, yã kasance mai mayar da al'amari ga Allah.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Zul-Kifli (AS)",
    summary:
      "Annabi saliha yana cikin masu haquri, wanda aka girmama ko da yake labarinsa gajere ne.",
    body: [
      "Zul-kifli (amincin Allah ya tabbata a gare shi) an ambaci sunansa sau biyu a cikin Alkur'ani, duka biyun yana cikin tawagar annabawa masu daraja. Allah Ya lissafta shi da Isma'il da Idris - 'duk sun kasance daga masu hakuri. Kuma Muka shigar da su a cikin rahamarMu. lalle ne su, sun kasance daga salihai' (Alkur'ani 21:85-86) - kuma ya sake ambace shi a cikin fitattu tare da Ismaila da Al-Yasa' (Alkur'ani 38:48). Kowane ambaton yabo ne, ko da yake ba a bayar da cikakken bayani ba.",
      "Domin Kur’ani da Sunna ingantattu ba su fadada rayuwarsa ba, malaman gargajiya sun yi sabani a kan hatta dalla-dalla na asali – wasu suna ganin shi Annabi ne ko kuma adali, ko da yake an lissafta shi a cikin annabawa a cikin jerin sunayen Musulmi. Mumini mai hankali yana ƙin cika shirun da tatsuniyoyi da ba a tabbatar da su ba kuma ya riƙe abin da Allah ya tabbatar: ya kasance mai haƙuri da adalci, kuma wannan ya isa ga daraja.",
      "Hada shi yana dauke da darasi mai natsuwa: ba kowane bawa da Allah yake so ya bar wani sanannen labari ba. Hidima mai dorewa, aminci - nau'in da tarihi bai taɓa rubutawa ba amma Allah ya sani sarai - shine ainihin irin wanda ke samun rahamarSa. Amincewar boye ba ta da yawa; shi ne tushen rayuwa ta qwarai.",
    ],
    profile: {
      era: "Daga baya lokuttan annabci kafin Isa (wanda aka sanya shi a fili)",
      mission: "Ka kira mutanensa zuwa ga biyayya da adalci.",
      lessons: [
        "Hakuri shine jigon halin annabci",
        "Ƙididdiga mai iyaka har yanzu yana ɗaukar jagora mai ƙarfi",
        "Imani, gaibu hidima abin so ne ga Allah",
      ],
      facts: [
        "Mai suna tare da Ismail da Idris a cikin majiyyatan",
        "An ƙidaya cikin annabawa a cikin jerin sunayen musulmi na yau da kullun",
      ],
    },
    quran: [
      {
        excerpt:
          "Da Isma'ila da Idrisu da Zul-kifli dukkansu suna daga masu hakuri. Kuma Muka shigar da su a cikin rahamarMu. Lalle sũ, sun kasance daga sãlihai.",
      },
      {
        excerpt:
          "Kuma ka ambaci Ismaila da Al-Yasa'a da Zulkifli, kuma dukkansu suna daga fitattu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Musa (AS)",
    summary:
      "Babban manzo zuwa ga Bani Isra’ila wanda ya fuskanci zaluncin Fir’auna ya karbi Attaura.",
    body: [
      "Musa (amincin Allah ya tabbata a gare shi) shi ne Annabi da aka fi ambata a cikin Alkur’ani, kuma an ba da labarinsa dalla-dalla. An haife shi a ƙarƙashin dokar Fir'auna na kashe 'ya'yan Bani Isra'ila, mahaifiyarsa ta sanya shi yana jariri a cikin kwando a kan kogin Nilu - bisa ga wahayin Allah - kuma, da tsarin Allah, ya tashi a cikin fadar Fir'auna (Alkur'ani 28: 7-13). Bayan shekaru da yawa, bayan ya bar Masar, ya yi aure a Madyana, Allah ya kira shi a kwarin Tuwa, inda Allah ya yi masa magana kai tsaye, ya nuna masa alamar sanda da hannu, ya aika shi tare da dan’uwansa Haruna zuwa ga azzalumi Fir’auna (Alkur’ani 20:9-36).",
      "Manufarsa ita ce isar da abubuwa guda biyu: kira zuwa ga bauta wa Allah Shi kadai, da neman ‘yantar da ‘ya’yan Isra’ila da ake zalunta. Fir’auna, wanda ya yi iƙirarin shi abin bautawa, ya sadu da shi da ƙeƙasasshe, har ma bayan jerin ayoyi bayyanannu - sandar da ta zama maciji, ta haɗiye dabarun masu sihiri, da annoba - ya ƙi sallamawa. Lokacin da Musa ya fitar da Bani Isra’ila, Fir’auna ya bi su har zuwa teku. A nan ne Allah ya yi umarni, ‘Ka bugi teku da sandarka,’ sai ya rabu, sai muminai suka haye kan busasshiyar kasa alhalin Fir’auna da rundunarsa aka nutsar da su (Qur’an 26:63–66).",
      "Amma 'yanci shine kawai mafari. Sai Musa ya daure da jarabawa da ya fi tsayi na jagorantar mutane masu wuya kuma sau da yawa marasa godiya: ya karbi Attaura a kan dutse, sai ya dawo ya same su suna bautar maraƙi na zinariya; ya fuskanci korafe-korafensu, da bukatunsu, da rashin biyayyarsu tare da jagoranci mai hakuri, tsayayye. Rayuwar Musa ta haɗu da manyan jigogi biyu - ƙarfin hali don tsayayya da zalunci da zalunci, da kuma juriyar da ake buƙata don jagorantar mutane zuwa ga biyayya da zarar sun sami 'yanci. A matsayinsa na daya daga cikin ulul-'azm, shi abin koyi ne na masu kawo gyara da kiwo ga al'umma.",
    ],
    profile: {
      nation: "Bani Isra'ila (tare da kiran mutanen Fir'auna).",
      location: "Misira da Sinai",
      era: "Kafin Dawud da Sulaiman",
      mission: "Ku yi kira zuwa ga tauhidi, ku fuskanci zaluncin Fir'auna, ku isar da Attaura.",
      challenges: [
        "Fuskantar Fir'auna, wanda ya yi iƙirarin allahntaka",
        "Jagoranci mutane masu juriya da rashin godiya",
        "Jagoranci mai dorewa a ƙarƙashin matsin lamba",
      ],
      miracles: [
        "Sanda wanda ya koma maciji",
        "Rabewar teku da izinin Allah",
        "Alamu da yawa da aka nuna a gaban Fir'auna",
      ],
      majorEvents: [
        "Allah yana yi masa magana a kwari mai alfarma",
        "Fuskantar Fir'auna da masu sihiri",
        "Fitowa da wahayin Attaura",
      ],
      lessons: [
        "Ku dage da jajircewa wajen yakar zalunci",
        "Jagoranci akan mutane yana buƙatar haƙuri mai girma",
        "Dole ne a haɗa 'yanci zuwa biyayya ga Allah",
      ],
      facts: [
        "Daya daga cikin manzanni biyar masu tsayuwa (ulul-'azm)",
        "Ana ce masa Kalimullah - wanda Allah ya yi magana da shi kai tsaye",
      ],
    },
    quran: [
      {
        excerpt:
          "Kuma Nã zãɓe ku, sai ku saurara ga abin da ake yin wahayi. Lallai ni ne Allah. Bãbu abin bautãwa fãce Ni, sabõda haka ku bauta Mini, kuma ku tsayar da salla dõmin ambatoNa.",
      },
      {
        excerpt:
          "Kuma Muka yi wahayi zuwa ga uwar Mũsã cẽwa ki shãyar da shi, sa'an nan idan kã ji tsõro a kansa, to, ki jẽfa shi a cikin kõgi, kuma kada ki ji tsõro, kuma kada ki yi baƙin ciki. Lalle Mũ, Mãsu mayar da shi zuwa gare ku ne.",
      },
    ],
    hadith: [
      {
        excerpt:
          "An aika mala'ikan mutuwa zuwa ga Musa. Da ya zo masa, sai Musa ya buge shi, sai Allah ya mayar masa da idonsa, kuma Ya ba shi zabi dangane da lokacin mutuwarsa.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Haruna (AS)",
    summary: "hazikin dan'uwan Musa, ya nada shi a matsayin annabin taimakonsa a gaban Fir'auna.",
    body: [
      "Haruna (amincin Allah ya tabbata a gare shi) shi ne babban yayan Musa kuma annabi ne a kansa. A lokacin da Allah Ya aika Musa zuwa ga Fir’auna, Musa ya nemi taimako: “Kuma Ka sanya mini wani waziri daga iyalina – Haruna, dan’uwana. Ka ƙãra mini ƙarfi ta wurinsa, kuma ka bar shi ya raba aikina' (Alkur'ani 20:29-32). Allah ya biya bukata, kuma Kur'ani ya rubuta amsarsa: 'Za mu ƙarfafa hannunka ta wurin ɗan'uwanka' (Alkur'ani 28:35). Haruna, wanda aka bayyana shi da cewa ya fi iya magana, ya tsaya a gefen Musa a lokacin da suke isar da sakon Allah ga azzalumi.",
      "Lokacin jarabawarsa ya zo da rashin Musa. Lokacin da Musa ya je ya karɓi Attaura a kan dutse, Bani Isra’ila ya faɗi cikin bautar maraƙi na zinariya. Haruna ya yi ƙoƙari ya mayar da su, yana mai gargaɗi, ya ce, “Ya mutanena, ba a fitine ku da shi kawai, kuma lalle ne Ubangijinku Mai rahama ne, saboda haka ku bi ni, kuma ku yi ɗa’a ga umurnina.” Amma suka rinjayi ikonsa, kuma suka yi kusa su cutar da shi (Alkur’ani 20:90-94). Lokacin da Musa ya dawo a fusace, Haruna ya bayyana cewa yana jin tsoron cewa yin aiki da ƙarfi zai raba al’umma zuwa ƙungiyoyin yaƙi kafin Musa ya dawo (Alkur’ani 7:150).",
      "Tarihin Haruna ya nuna darajar haɗin kai a cikin bautar Allah - aikin da mutum biyu ke ɗauka ya fi ɗaya ƙarfi - da kuma hikimar kiyaye haɗin kai ba tare da tauye gaskiya ba. Wani lokaci jagoranci mai aminci yana nufin haɗa al'umma mai wargajewa tare da hana cutarwa har sai an daidaita al'amura. Harun yana da daraja a cikin Alkur'ani a cikin shiryayyu, kuma Allah ya bar masa da Musa yabo mai dawwama a tsakanin mutanen baya (k:37:119-122).",
    ],
    profile: {
      nation: "Bani Isra'ila",
      location: "Misira da Sinai",
      era: "Zamanin Musa",
      mission: "Ka taimaki Musa wajen kira zuwa ga tauhidi da shiryar da Bani Isra’ila.",
      challenges: [
        "Fuskantar mulkin Fir'auna",
        "Gudanar da al'umma a lokacin rashin Musa",
        "Hana rarrabuwar kawuna a tsakanin mutane",
      ],
      majorEvents: [
        "Nadin minista da goyon baya ga Musa",
        "Aikin gaban Fir'auna",
        "Gwajin maraƙin zinariya",
      ],
      lessons: [
        "Yin aiki tare yana ƙarfafa kira zuwa ga Allah",
        "Shugabanci wani lokaci yana nufin hada mutane wuri guda a cikin rikici",
        "A kiyaye hadin kai ba tare da bata gaskiya ba",
      ],
      facts: ["Babban yayan Musa", "Yabo a cikin Alkur'ani saboda balaga"],
    },
    quran: [
      {
        excerpt:
          "Kuma ka naɗa mini waziri daga iyalina - Haruna, ɗan'uwana. Ka ƙãra ta wurinsa ƙarfina kuma bari ya raba aikina.",
      },
      {
        excerpt: "Ya ce: “Dan uwata!",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dawud (AS)",
    summary:
      "Annabi-Sarki da aka ba wa hikima, adalci, da Zabur, kuma abin koyi na jagoranci mai karkata zuwa ga ibada.",
    body: [
      "Dawud (amincin Allah ya tabbata a gare shi) - Dauda - ya fara tun yana matashi a cikin sojojin Talut (Saul) a kan azzalumi Jalut (Goliath). Dawud ne ya kashe Jalut, kuma Allah Ya ba shi mulki da hikima, kuma Ya sanar da shi daga abin da Yake so’ (k:2:251). Sai Allah ya ba shi sarauta da Annabci da nassi bayyanannu, Zabur (Zabura), ya mai da shi abin koyi da ba kasafai ba na shugaba wanda shi ma ya kasance mai yawan ibada.",
      "Allah ya ba shi kyauta mai ban mamaki: duwatsu da tsuntsaye suna tare da shi don yin tasbihi ga Allah, kuma baƙin ƙarfe ya yi laushi a hannunsa don ya kera makamai (Alkur'ani 21:79; 34:10-11). Duk da haka da wannan iko, Dawud ya kasance mai tawali'u da sadaukarwa. Ibadarsa ta yi tsanani har Manzon Allah Sallallahu Alaihi Wasallama ya siffanta Azumin Dawud - azumtar kowace rana - a matsayin azumin da ya fi soyuwa ga Allah, kuma sallarsa ta dare a matsayin mafi soyuwa. Kur'ani ya kuma gabatar da wani sashe na hukunci wanda Dawud, a hankali ya gyara, nan da nan ya fadi cikin sujada, ya nemi gafara, ya koma ga Ubangijinsa (Alkur'ani 38:24) - karfinsa bai taba fifita shi a kan hisabi ba.",
      "Rayuwar Dawud ta koyar da cewa hukuma amana ce ba gata ba. Allah Yana yi masa magana kai tsaye: “Ya Dawud, Mun sanya ka magada a bayan kasa, sai ka yi hukunci tsakanin mutane da gaskiya, kuma kada ka bi son zuciya.” (k:38:26). Adalci, da yawaita ambaton Allah, da gaggawar tuba, da rayuwar ibadar da ta dace, su ne ke tabbatar da shugabanci na gari. Iko ya fi aminci a hannun wanda ya fi ruku'u.",
    ],
    profile: {
      nation: "Bani Isra'ila",
      location: "Yankin Kudus",
      era: "Kafin mulkin Sulaimanu",
      mission:
        "Ka yi shugabanci da adalci, ka yi hukunci da gaskiya, kuma ka kira mutanensa zuwa ga Allah.",
      challenges: [
        "Nauyin alhakin shari'a",
        "Daidaita iko da tawali'u",
        "Hukuncin jama'a a cikin jagoranci",
      ],
      miracles: [
        "Duwatsu da tsuntsaye suna tasbihi game da shi",
        "Iron ya yi laushi a hannunsa da iznin Allah",
      ],
      majorEvents: [
        "Kashin da Jalut yayi a kuruciyarsa",
        "Sarauta, Annabci, da wahayin Zabur",
        "Gado ya koma ga dansa Sulaiman",
      ],
      lessons: [
        "Adalci shine jigon mulkin adalci",
        "Tuba da sauri bayan kowane kuskure",
        "Rayuwa mai ladabi ta ibada tana ƙarfafa jagoranci",
      ],
      facts: ["Mai karɓar Zabur (Zabura)", "Ya ci Jalut (Goliath) yana matashi"],
    },
    quran: [
      {
        excerpt:
          "Ya Dãwuda, lalle ne Mũ, Mun sanya ka magada a cikin ƙasa, sabõda haka ka yi hukunci a tsakãnin mutãne da gaskiya, kuma kada ka bi son zuciya, kamar yadda zai ɓatar da kai daga tafarkin Allah.",
      },
      {
        excerpt:
          "Kuma Muka hõre duwãtsu tãre da Dãwũda, da tsuntsãye, kuma... Kuma Muka sanar da shi halittar sulke, dõmin Ya tsare ku daga maƙiyinku.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mafi soyuwar addu'a ga Allah ita ce addu'ar Dawud, kuma mafi soyuwar azumi a wurin Allah shi ne azumin Dawud: ya kan yi azumi wata rana ya yi buda baki a gobe.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sulaiman (AS)",
    summary:
      "Annabi-sarki da aka ba da iko mara misaltuwa duk da haka yana da tushe cikin godiya da hikima.",
    body: [
      "Sulaiman (amincin Allah ya tabbata a gare shi) - Sulaiman - ya gaji sarauta da annabci daga mahaifinsa Dawud, kuma Kur'ani ya yabe shi a matsayin 'bawa na kwarai, hakika mai maimaituwa ga Allah' (Alkur'ani 38:30). Ya yi addu’ar samun mulki ba kamar wanda zai biyo baya ba, kuma Allah Ya ba shi dama ta musamman: Umurni da iskar da ke tafiya da umarninsa; hidimar aljani wanda ya gina masa kurciya da iznin Allah; da fahimtar maganar tsuntsaye da sauran halittu (Alkur'ani 21:81–82; 34:12–13; 27:16).",
      "Fage biyu sun dauki halinsa. Lokacin da tururuwa ta gargadi mazaunanta cewa su fake don kada sojojin Sulaiman su murkushe su ba da saninsu ba, Sulaiman ya yi murmushi ya gode wa Allah don ni’imar fahimta, yana mai addu’a ya zama mai godiya da adalci (Alkur’ani 27:18-19) – iko ya sa ya kara kaskantar da kai, ba kasawa ba. Kuma a lokacin da ya ji labarin Sarauniyar Saba’ (Saba’) da mutanenta suna bautar rana, bai ci su da qarfi ba, amma ya kira su zuwa ga mika wuya ga Allah, daga qarshe ya ba ta imani ta hanyar hikima da nuna abin da Allah Ya ba shi (Alkur’ani 27:22-44). Hatta ni'imominsa masu yawa ya sanya su a matsayin jarrabawa: \"Wannan yana daga ni'imar Ubangijina domin Ya jarrabe ni, shin zan kasance mai godiya ko mai butulci\" (k:27:40).",
      "Sulaiman yana karantar da cewa mulki yana daga cikin mafi tsananin jarabawa, kuma godiya (shukr) shine maganinta. Mumini da aka bai wa dukiya, iyawa, ko mulki ana nufin ya yi amfani da ita ne don yin adalci da kiran wasu zuwa ga Allah, ba don girman kai ba. Dukan mulkinsa, tare da dukan abubuwan al'ajabi, suna komawa ga wanda ya ba shi - kuma wannan shine bambanci tsakanin ni'imar da ke ɗaukaka da wadda ke lalata.",
    ],
    profile: {
      nation: "Bani Isra'ila da masarautun da ke kewaye",
      location: "Kudus da kuma fadin yankin",
      era: "Bayan Dawud",
      mission: "Ku yi mulki da adalci, ku kirayi al'umma zuwa ga bautar Allah.",
      challenges: [
        "Gudanar da babbar masarauta",
        "Kula da godiya a cikin babban iko",
        "Gudanar da runduna dabam-dabam cikin gaskiya",
      ],
      miracles: [
        "Umurni a kan iska da izinin Allah",
        "Hidimar aljani wajen gini da ruwa",
        "Fahimtar maganan tsuntsaye da tururuwa",
      ],
      majorEvents: [
        "Gadon sarautar Dawud da Annabcinsa",
        "Labarin tururuwa da godiya",
        "Wasiku tare da Sarauniyar Saba da imaninta",
      ],
      lessons: [
        "Iko babban gwaji ne",
        "Godiya tana kare girman kai",
        "Hikima da gayyata na iya juyar da zukata fiye da ƙarfi",
      ],
      facts: ["Daga cikin mafi cikakken siffanta sarakunan annabawa a cikin Kur'ani"],
    },
    quran: [
      {
        excerpt:
          "Ya yi murmushi, yana jin dadin maganarta, ya ce: “Ya Ubangiji Ka ba ni ikon gode wa ni’imarKa wadda Ka yi mini ni’ima da iyayena, da aikata aikin kwarai wanda Ka yarda da shi.",
      },
      {
        excerpt:
          "Kuma ga Sulaimãnu (Mun hõre) iska, tafiyarta ta sãfiya wata guda, kuma tafiyar wata guda.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ilyas (AS)",
    summary: "Annabin da ya fuskanci bautar gunki Ba'al ya kira mutanensa zuwa ga Allah.",
    body: [
      "Ilyas (amincin Allah ya tabbata a gare shi) - An aika Iliya - zuwa ga jama'ar Bani Isra'ila da suka fada cikin bautar gumaka, babban daga cikin gumakansu shi ne Ba'al. Kur'ani ya rubuta ƙalubalensa kai tsaye: 'Shin ba za ku ji tsoron Allah ba? Shin, kunã kiran Ba'al, kuma kunã barin mafi kyãwon halitta, Allah, Ubangijinku, kuma Ubangijin ubanninku na farko? (Alkur'ani 37:124-126). Kiransa shine kiran annabci na har abada: kau da gumakan ƙarya kuma a mayar da sujada ga Mahalicci shi kaɗai.",
      "Kur'ani ya taƙaita aikinsa da tsarin annabci da aka saba - gayyata bayyananne, ƙin yarda da mafiya yawa, da kuma girmamawa da aka kiyaye ga masu gaskiya. \"Sun ƙaryata shi, saboda haka, lalle ne waɗanda ake zowa da su, face zaɓaɓɓun bayin Allah.\" (k:37:127-128). Allah ya ambaci sunan sa a cikin salihai kuma ya bar aminci da yabo a gare shi: 'Aminci ya tabbata ga Ilyas' (k:37:129-130), kuma ya lissafta shi tare da Zakariyya da Yahaya da Isa daga shiryayyu (Alkur'ani 6:85).",
      "Darasin Ilyas shi ne, gyara na gaskiya yana farawa da gyara ibada. Ba za a iya daidaita al'umma ba yayin da take ba da kai ga abubuwa na ƙarya - ko gumaka na zahiri ko na zamani na sha'awa, dukiya, da matsayi. Tauhidi shi ne ginshikin da aka gina dukkan sabuntar dabi'u mai dorewa a kansa, kuma ko da kungiya mai imani ta yi kadan kuma ba ta da yawa, Allah yana girmama masu riko da gaskiya.",
    ],
    profile: {
      nation: "Wata al'umma ce daga Bani Isra'ila",
      location: "Yankin Levant",
      era: "Zaman annabci na Isra'ila daga baya",
      mission: "Ka kira mutanensa daga bautar Ba'al zuwa ga tauhidi.",
      challenges: ["Ibadar tsafi mai zurfi", "Juriya daga jagoranci"],
      majorEvents: [
        "Jama'a sun yi kira da a hana bautar Ba'al",
        "Kafirta da mafi rinjaye da tsare muminai",
      ],
      lessons: [
        "Tauhidi shine ginshikin dukkan gyara",
        "Ƙungiya kaɗan masu aminci har yanzu suna da mahimmanci ga Allah",
        "Annabawa suna magana akan kuskuren sananne, ba tare da shi ba",
      ],
      facts: ["Sunansa cikin salihai", "Ya fuskanci bautar gunki Ba'al"],
    },
    quran: [
      {
        excerpt:
          'A lõkacin da ya ce wa mutãnensa: "Shin, bã zã ku yi taƙawa ba?" Shin kuna kira ga Ba\'al, kuma kuna barin mafi kyawun masu halitta?',
      },
      {
        excerpt: "Da Zakariyya da Yahaya da Isa da Ilyas, kuma dukansu suna daga salihai.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Al-Yasa' (AS)",
    summary:
      "Annabin adali na zuriyar Isra'ila, mai suna a cikin Kur'ani daga cikin fitattun mutane.",
    body: [
      "Al-Yasa' (amincin Allah ya tabbata a gare shi) - An ambaci sunan Elisha a cikin annabawa a wurare biyu a cikin Alkur'ani, kuma a cikin duka biyun an yabe shi. Ya bayyana a cikin shiryayyu tare da Ismail, Yunus, da Luɗu, waɗanda Allah ya 'fi fifita su a kan talikai' (Alkur'ani 6:86-87), kuma a cikin fitattun mutane tare da Ismail da Dhul-kifli (Alkur'ani 38:48). Rubutun yana ɗaukaka darajarsa maimakon yin ƙidayar cikakken labari.",
      "Domin a takaice wahayi ne da gangan game da shi, musulmi sun tabbatar da hakikanin abin da ya tabbata - cewa shi annabin gaskiya ne wanda ya tsayar da kira zuwa ga bauta wa Allah shi kadai a cikin mutanensa - da kuma nisantar jingina masa tatsuniyoyi da ba su da inganci. Wannan kame kansa wani bangare ne na sahihiyar imani: muna girmama annabi ta wurin kiyaye gaskiya game da shi, ba ta hanyar kirkiran labarai a kusa da shi ba.",
      "Kuma ambatonsa yana tunatar da cewa Allah ya aiko manzanni da yawa, kuma ba a auna darajar annabi da tsawon lokacin da aka kiyaye labarinsa sai dai a auna amincinsa ga aikin. Kamar yadda Kur’ani ya ce a wani wuri, akwai manzanni ‘da muka ba su labarinsu da manzanni wadanda ba mu ba da labarinsu ba’ (Alkur’ani 40:78) – kuma imani da su baki daya, wanda aka sani da wanda ba a sani ba, yana daga cikin imanin musulmi.",
    ],
    profile: {
      nation: "Bani Isra'ila",
      location: "Yankin Levant",
      era: "Zaman annabci na Isra'ila daga baya",
      mission: "Ci gaba da kira zuwa ga tauhidi a tsakanin mutanensa.",
      lessons: [
        "Ka girmama dukkan annabawa daidai da imani",
        "Takaitacciyar ambaton Kur'ani har yanzu tana isar da shiriya ta gaske",
        "Ci gaba na adalci yana kiyaye al'ummomin imani",
      ],
      facts: ["Sunansa kai tsaye a cikin Alkur'ani a cikin fitattu kuma zababbu"],
    },
    quran: [
      {
        excerpt:
          "Da Isma'ila da Al-Yasa' da Yunusa da Luɗu, kuma dukansu Mun fĩfĩta a kan tãlikai.",
      },
      {
        excerpt:
          "Kuma ka ambaci Ismaila da Al-Yasa'a da Zulkifli, kuma dukkansu suna daga fitattu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yunus (AS)",
    summary: "Annabin whale, wanda tubansa a cikin duhu ya zama darasi maras lokaci a cikin bege.",
    body: [
      "Yunus (amincin Allah ya tabbata a gare shi) - Yunusa - an aika zuwa ga mutanen Nineba, amma da suka nace da kiransa, ya bar su cikin fushi kafin Allah ya ba shi izinin tafiya. Kur’ani ya siffanta abin da ya biyo baya: “Kuma (ka ambaci) mutumin kifi, a lokacin da ya tafi yana fushi, kuma ya yi zaton ba za Mu hukunta shi ba.” (k:21:87). Da ya shiga jirgi, aka jefar da shi cikin teku, wani babban kifi ya haɗiye shi, ya faɗa cikin duhun duhu, duhun dare, da teku, da cikin kifin.",
      "A cikin wannan duhu da ya mamaye Yunus ya yi kira da kalmomin da suka zama daya daga cikin addu'o'i mafi soyuwa a Musulunci: \"Babu abin bautawa face Kai; Tsarki ya tabbata a gare Ka. Lalle ne ni, na kasance daga azzalumai.\" (Alkur'ani 21:87). Bai yanke kauna ba; ya tabbatar da kamalar Allah kuma ya fadi nasa laifin. Sai Allah Ya ce: ‚Sai Muka karɓa masa, kuma Muka tsĩrar da shi daga baƙin ciki. Kuma kamar wancan ne Muke tsĩrar da mũminai.” (k:21:88). Kifin ya jefar da shi zuwa ga gaci, sai Allah ya sa shuka ta tsiro don ta kare jikinsa da ya raunana.",
      "Sai ƙarshe mai ban mamaki ya zo: Yunus ya koma ga mutanensa, kuma ba kamar kowace al'umma a cikin Alƙur'ani ba, sun yi imani kuma aka tsirar da su - 'Saboda haka Muka ji daɗinsu har wani lokaci' (Alkur'ani 37:147-148; 10:98). Labarinsa ya ba da darussa guda biyu waɗanda aka haɗa su: kada ku yanke tsammani daga rahamar Allah, komai zurfin duhu, domin tuba ta gaskiya tana mayar da abin da ya ɓace; kuma addu'ar Yunusa itace hanyar rayuwa ga duk wani mai imani cikin damuwa. Manzon Allah Sallallahu Alaihi Wasallama ya koyar da cewa babu wani musulmi da ya tava yin addu'a da ita face Allah ya amsa masa.",
    ],
    profile: {
      nation: "Mutanen Nineba",
      location: "Yankin Mesopotamian",
      era: "Zaman annabci kafin Isa",
      mission: "Ka kira mutanensa zuwa ga tauhidi da tuba.",
      challenges: [
        "Nauyin dagewar kin a da'awa",
        "Gwajin sirri a cikin duhun teku",
        "Komawa ga manufa bayan an gyara",
      ],
      miracles: [
        "Ceto daga cikin kifi",
        "Wani shuka mai tsari ya girma a kansa",
        "Imani da dukan mutanensa",
      ],
      majorEvents: [
        "Barin mutanensa da fitinar teku",
        "Addu'a a cikin duffai uku",
        "Komawa da bangaskiyar Nineba",
      ],
      lessons: [
        "Kada ka yanke kauna daga rahamar Allah",
        "Tuba ta gaskiya tana mayar da aikin",
        "Addu'a a cikin wahala tana canzawa",
      ],
      facts: ["Kuma ana kiransa Dhun-Nun (mutumin kifi) a cikin Alkur'ani"],
    },
    quran: [
      {
        excerpt:
          'Kuma ya yi kira a cikin duffai: "Bãbu abin bautãwa fãce Kai." Tsarki ya tabbata a gare Ka. Lalle ne nĩ, na kasance daga azzãlumai.',
      },
      {
        excerpt:
          "Shin, kuma bãbu wata alƙarya da ta yi ĩmãni sabõda haka ĩmãninta ya amfãne shi fãce mutãne Yunusa? A lõkacin da suka yi ĩmãni, Muka kuranye azãbar wulãkanci daga gare su.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Addu'ar Dhun-Nun a lokacin da ya yi kira ga Allah daga cikin cikin kifin ita ce: La ilaha illa Anta, subhanaka, inni kuntu minaz-zalimin. Babu wani musulmi da ya tava roqon wani abu da shi face Allah ya karva masa.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Zakariyya (AS)",
    summary:
      "Annabin da ya yi addu’a ga magaji adali a cikin tsufa kuma aka amsa shi tare da Yahaya.",
    body: [
      'Zakariyya (amincin Allah ya tabbata a gare shi) - Zakariyya - ya kasance annabin Bani Isra\'ila mai yawan ibada kuma waliyin Maryam. Kuma idan ya shiga gare ta a cikin ɗakinta, sai ya sãmi abinci a wurinta, sai ya tambayi yadda abin ya kasance, sai ta ce: "Lalle ne daga wurin Allah yake." Lallai ne Allah yana azurta wanda Yake so ba da lissafi ba.” (k:3:37). Shaidar arzikin da Allah ya yiwa Maryam ya sake sanya begensa na cewa Allah zai iya ba da abin da ake ganin ba zai yiwu ba.',
      "Ko da yake ya tsufa kuma matarsa ​​ta kasance bakarariya, Zakariyya ya koma ga Allah cikin nutsuwa da addu’a: ‘Ya Ubangiji, hakika ƙasusuwana sun yi rauni, kaina ya cika da fari, ban taɓa jin daɗin addu’ata zuwa gare Ka ba’ (Qur’an 19:4). Bai roki dukiya ko abin duniya ba sai don magada adali wanda zai ci gaba da aikin annabci kuma ya kiyaye bautar Allah. Allah ya amsa da bushara na ɗa, Yahaya - suna, Allah ya ce, ba a ba kowa a gabanin (Alkur'ani 19:7). A matsayin alama Zakariyya ya daina magana da mutane har tsawon kwanaki uku sai dai ta hanyar ishara, da sadaukar da harshensa ga ambaton Allah (Alkur'ani 19:10-11).",
      "Rayuwar Zakariyya tana karantar da mumini kada ya daina yin addu'a, duk da cewa ba za a iya samun amsa ba, kuma ya roki Allah musamman baiwar iyalai na gari da ci gaba da imani. Babban damuwarsa ba kansa ba ne, amma wanda zai ɗauki gaskiya a bayansa. Har ila yau, labarinsa yana girmama hidimar shiru a wuraren ibada a matsayin aiki mai daraja da ƙauna.",
    ],
    profile: {
      nation: "Bani Isra'ila",
      location: "Yankin Kudus",
      era: "Kafin Isa",
      mission: "Yi ja-gorar mutanensa kuma ku kiyaye bauta ta annabci.",
      challenges: [
        "Isar tsufa ba tare da yaro ba",
        "Damuwa ga magada imani",
        "Tsayar da ibada a cikin al'umma mai takura",
      ],
      miracles: ["Bisharar Yahaya a tsufa", "Alamar hana magana na kwana uku"],
      majorEvents: [
        "Waliyyin maryam da sheda ta tanadi",
        "Addu'a ta zuci ga magaji",
        "Addu'ar amsawa da haihuwar Yahaya",
      ],
      lessons: [
        "Kada a daina fatan addu'a",
        "Ka roki Allah ya baka iyali da zuri'a na gari",
        "Hidimar sadaukarwa a cikin ibada tana da daraja",
      ],
      facts: ["Waliyin Maryam", "Uban Yahaya, wanda haihuwarsa ta amsa addu'arsa"],
    },
    quran: [
      {
        excerpt:
          "A nan ne Zakariyya ya kira Ubangijinsa, ya ce: “Ya Ubangiji! Lalle Kai, Kai ne Mai jin addu'a.",
      },
      {
        excerpt:
          'Ya ce: "Ya Ubangijina, lalle ne ƙasusuwana sun yi rauni, kuma kaina ya cika da fari, kuma ban kasance mai baƙin ciki a cikin addu\'ata zuwa gare Ka ba, Ya Ubangijina."',
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Yahya (AS)",
    summary:
      "Annabi tsantsa, mai hikima da aka bayar tun yana kuruciya kuma Allah ya kara masa lafiya.",
    body: [
      "Yahya (amincin Allah ya tabbata a gare shi) — Yahaya — shi ne amsar addu’ar mahaifinsa Zakariyya, wanda Allah ya sanya masa suna kafin haihuwarsa. Allah Ya yi masa magana kai tsaye: 'Ya Yahaya! Kuma ya 'ba shi hikima tun yana yaro' (Alkur'ani 19:12) - kwatancin da ba kasafai ake yi ba wanda ke nuna farkon balaga na ruhaniya. Tun yana kuruciyarsa ya kasance mai sadaukarwa ga Allah da muhimmancin da ya wuce shekarunsa.",
      "Kur’ani ya yabi halayensa a jeri mai kyau: Allah Ya ba shi ‘tausayi daga gare Mu da tsarki, kuma ya kasance mai takawa ga Allah, kuma mai tsoron Allah, kuma bai kasance azzalumi ba, mai fasikanci’ (Qur’ani 19:13–14). Ya kasance mai kamun kai, mai ibada, ana tunawa da shi cikin salihai. Ya kira mutanensa zuwa ga biyayya da gaskiya, kuma ya rigaye Isa, yana mai gaskatãwa ga kalma daga Allah, kuma yana shirya zukata domin shiriya (Alkur’ani 3:39).",
      "Allah ya girmama Yahya da aminci a lokuta uku mafi rauni na kowace rayuwa: 'Aminci ya tabbata a gare shi ranar da aka haife shi, da ranar da zai mutu, da ranar da aka tayar da shi da rai' (Alkur'ani 19:15). Tarihinsa sako ne ga manya da manya: Ba a jingine kusanci ga Allah sai bayan shekaru. Tsarkakewar zuciya, tsananin ibada, da kyautatawa ga iyaye na iya fitowa a cikin mutum tun yana ƙarami - kuma irin wannan rayuwa abin so ne ga Allah.",
    ],
    profile: {
      nation: "Bani Isra'ila",
      location: "Yankin Levant",
      era: "Na zamani tare da Zakariyya kuma kusa da zamanin Isa",
      mission: "Ku yi kira zuwa ga adalci kuma ku shirya zukata domin shiriya.",
      challenges: ["Gyaran jama'a a cikin yanayi maras kyau", "Tsayar da tsafta da ka'ida"],
      majorEvents: [
        "Haihuwarsa a matsayin amsa addu'a",
        "An ba shi hikima a cikin kuruciyarsa",
        "Sanin tsarkinsa da ibadarsa",
      ],
      lessons: [
        "Matashi na iya yin shugabanci cikin adalci",
        "Tsaftar zuciya karfi ne na gaske",
        "Kyautatawa iyaye yana daga cikin takawa",
      ],
      facts: [
        "Sunan Allah kafin haihuwarsa",
        "An girmama shi da salama a lokacin haihuwa, mutuwa, da tashin matattu",
      ],
    },
    quran: [
      {
        excerpt:
          "Ya Yahaya, ka ɗauki Littafi da azama. Kuma Muka ba shi hikima, tun yana yaro, da tausayi daga gare Mu, da tsarki, kuma ya kasance mai takawa ga Allah.",
      },
      {
        excerpt:
          "Allah Ya yi muku bushara da Yahaya, yana mai gaskatãwa ga kalma daga Allah, maɗaukaki, mai kauracewa, Annabi daga salihai.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Isa bn Maryam (AS)",
    summary:
      "Wani manzo mai girma da aka haifa wa Maryama da mu'ujiza, yana kira zuwa ga Allah da ãyõyi bayyanannu.",
    body: [
      'Isa (amincin Allah ya tabbata a gare shi) — Isa – an haife shi ga Maryama ba shi da uba, bisa ga umurnin Allah, a matsayin alamar cikakken ikonsa: ‘Hakika misalin Isa a wurin Allah kamar misalin Adamu ne. Ya halitta shi daga turɓaya, sa\'an nan ya ce masa: "Kasance, sai ya kasance" (k:3:59). Sa’ad da Maryamu ta kawo jariri ga mutanenta, waɗanda suka tuhume ta, Jariri Isa ya yi magana daga jaririn jaririnta yana kāre ta: ‘Hakika, ni bawan Allah ne. Ya ba ni Littafi, kuma Ya sanya ni Annabi” (Qur’an 19:30). Wannan ikirari na farko ya saita yanayin aikinsa duka - cewa shi bawan Allah ne.',
      "An aika Isa zuwa ga Bani Isra’ila don ya tabbatar da Attaura a gabansa, kuma ya kawo Linjila (Linjila). Allah ya taimake shi da mu’ujizozi mabayyani da izninSa: Ya warkar da makaho da kutare, Ya rayar da matattu, kuma Ya siffata tsuntsu daga yumbu mai tashi da iznin Allah (Alkur’ani 3:49). Saƙonsa ya kira mutane da su bauta wa 'Allah Ubangijina kuma Ubangijinku' (Alkur'ani 3:51), kuma zuwa ga gaskiya da adalci. Almajiransa na kusa, Hawariyyun, sun gaskata shi kuma suka goyi bayansa.",
      "Kur'ani ya gyara gaba biyu game da Isa. A kan waɗanda suka ƙaryata kuma suka yi niyyar kashe shi, ta bayyana cewa ba a kashe shi ba, kuma ba a gicciye shi ba; sai dai ya bayyana haka, kuma Allah ya dauke shi zuwa gare Shi (Alkur'ani 4:157-158). A kan waɗanda suka wuce gona da iri, ta nace cewa shi annabi ne kuma manzo ne mai girma, ba Allah ba, kuma ba dan Allah ba – “Masihu ɗan Maryama bai kasance ba face manzo” (Alkur’ani 5:75). A aqidar Ahlus-Sunnah zai dawo kafin ranar lahira. Labarinsa yana karantar da cewa ikon Allah ya zarce dukkan dalilai na halitta, annabawa bayi ne masu girma da girma ba, kuma lallai ne a kiyaye gaskiya daga qaryata da wuce gona da iri.",
    ],
    profile: {
      nation: "Bani Isra'ila",
      location: "The Levant",
      era: "Karni na 1 CE",
      mission: "Ka sabunta tauhidi, ka tabbatar da Attaura, kuma ka yi kira zuwa ga adalci.",
      challenges: [
        "adawa da makirci daga wadanda suka ki shi",
        "Daga baya wuce gona da iri na matsayinsa",
        "Kare tauhidi tsantsa",
      ],
      miracles: [
        "Haihuwa babu uba",
        "Yana magana a cikin shimfiɗar jariri",
        "Waraka da rayarwa da izinin Allah",
      ],
      majorEvents: [
        "Haihuwarsa ta banmamaki da kare mahaifiyarsa",
        "Kiran jama'a tare da bayyanannun alamun",
        "Ana tayar da shi zuwa ga Allah, ba a kashe shi ba",
      ],
      lessons: [
        "Ikon Allah ya zarce dalilai na yau da kullun",
        "Annabawa bayin Allah ne masu daraja, ba na Ubangiji ba",
        "Lallai ne a kiyaye gaskiya daga qarya da wuce gona da iri",
      ],
      facts: ["An ba da Injila (Linjila)", "Zai dawo gabanin kiyama da akidar Ahlus-Sunnah"],
    },
    quran: [
      {
        excerpt:
          '(Isa) ya ce: "Lalle ne, Allah ne Ubangijina kuma Ubangijinku, sai ku bauta Masa." Wannan ita ce hanya madaidaiciya.',
      },
      {
        excerpt:
          "Kuma ba su kashe shi ba, kuma ba su gicciye shi ba; Sai aka bayyana a gare su kamar haka... Ã'a, Allah Ya ɗaukaka shi zuwa gare Shi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Nine mafi kusanci da Isa dan maryam. Annabawa 'yan uwan ​​uwa ne daban-daban, amma addininsu daya ne, babu wani annabi a tsakaninmu.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Muhammad ﷺ",
    summary: "Manzo na karshe, wanda aka aiko domin rahama ga dukkan talikai da hatimin Annabci.",
    body: [
      "Muhammadu ﷺ shine karshen annabawa, ba a aiko shi zuwa ga mutane ko daya ba sai ga dukkan bil'adama, tare da Alkur'ani a matsayin wahayi na karshe kuma kiyaye shi. Allah ya siffanta manzancinsa a aya guda: “Kuma ba Mu aike ka ba face domin rahama ga talikai.” (k:21:107). An haife shi a Makkah, ya samu wahayi na farko yana da shekaru arba'in a cikin kogon Hira, kuma shekaru ashirin da uku masu zuwa ya yi kira ga mutane zuwa ga bauta wa Allah Shi kadai, da tsarkake zukatansu, da rayuwa da adalci da rahama - yana mai cikawa da tabbatar da sakon duk wani annabi da ya gabace shi.",
      "Hanyarsa ita ce sadaukarwa mai dorewa. A Makka shi da muminai na farko sun hakura da izgili da azabtarwa da kauracewa shekara da shekaru. Sai Hijira, Hijira zuwa Madina, inda ya gina al'ummar Musulmi ta farko - tabbatar da salla, 'yan uwantaka tsakanin hijira da mataimaka, da yarjejeniyoyin da aka samu, da al'umma mai tushe ta tauhidi. A cikin shekarun wahala da nasara daga ƙarshe, halinsa bai taɓa gushewa ba; Kur'ani ya shaida, 'Lalle ne, kana da kyawawan halaye' (Alkur'ani 68: 4), kuma shi da kansa ya ce an aiko shi ne zuwa ga cikakken hali.",
      "Allah ya bayyana shi 'Manzon Allah da hatimin annabawa' (Alkur'ani 33:40) - bayansa babu wani annabi. Mafi girman mu'ujizarsa ita ce Kur'ani da kansa, alama ce mai dawwama wacce har yanzu tana jagorantar biliyoyin mutane, kuma an girmama shi da Isra'i da Mi'iraji, tafiyar dare da hawan sama. Ga mumini, shi ne uswah hasanah - kyakkyawan misali (Alkur'ani 33:21) - wanda Sunnarsa ita ce tafarki na imani a aikace. Son shi, da bin shiriyarsa, da yin salati a gare shi, qarya ce a cikin zuciyar rayuwar musulmi.",
    ],
    profile: {
      nation: "Dukkan bil'adama",
      location: "Makkah da Madinah",
      era: "Karni na 7 CE",
      mission: "Isar da wahayi na ƙarshe kuma ku cika saƙon annabci ga dukan mutane.",
      challenges: [
        "Zalunci da kauracewa Makkah",
        "Rikici da gina al'umma mai adalci",
        "Isar da saƙon duniya a cikin ƙabilu da al'ummai",
      ],
      miracles: [
        "Kur'ani a matsayin mu'ujiza mai dorewa",
        "Isra'i da Mi'raj (tafiyar dare da mi'iraji)",
        "Alamu dayawa da izinin Allah",
      ],
      majorEvents: [
        "Farkon wahayi a Makkah",
        "Hijira zuwa Madina",
        "Kammala sako da hudubar bankwana",
      ],
      lessons: [
        "Jinkai da kyawawan halaye a jagoranci",
        "Juriya a ƙarƙashin matsin lamba",
        "Ku bi wahayi da Sunnah tare",
      ],
      facts: ["Hatimin annabawa", "Mafi kyawun misali (uswah hasanah) ga muminai"],
    },
    quran: [
      {
        excerpt:
          "Muhammadu bai kasance uban kõwa ba daga mazajenku, kuma amma shĩ Manzon Allah ne kuma cikon annabãwa.",
      },
      {
        excerpt: "Kuma ba Mu aike ka ba face domin rahama ga talikai.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Misali na da kuma misalin annabawan da suka gabace ni, shi ne na wani mutum wanda ya gina gida mai kyau da tsafta, sai dai wurin bulo daya. Ni ne tubalin, kuma ni ne hatimin annabawa.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
];

export const PROPHETS_TIMELINE_HA: DeepPartial<ProphetsTimelineEvent>[] = [
  {
    era: "Farko",
    title: "Adamu - na farko annabi",
    body: "Allah ya halicci Adamu, ya hore masa suna, ya sanya shi mataimakinsa a bayan kasa.",
  },
  {
    era: "Dada",
    title: "Idris, Nuhu, da al'ummar farko",
    body: "Annabawan farko sun kira mutanensu zuwa ga tauhidi. Nuhu ya yi wa’azi na ƙarni; lokacin da aka ci gaba da ƙin yarda, ambaliya ta zo kuma jirgin ya ceci muminai a matsayin alama.",
  },
  {
    era: "Mesopotamiya / Levant",
    title: "Ibrahim da iyalansa",
    body: "Khalilullah abokin Allah: ya farfasa gumaka, ya tsira daga wuta, ya gina Ka'aba da Ismail, ya haifi zuri'ar annabawa ta hannun Isma'il da Ishaq.",
  },
  {
    era: "Misira & Sinai",
    title: "Musa da Bani Isra’ila",
    body: "Kubuta daga Fir'auna, Attaura ta bayyana, dogon layin annabawa zuwa Bani Isra'ila.",
  },
  {
    era: "Masar",
    title: "Yusuf a Misira",
    body: "Hakuri ta hanyar cin amana, kurkuku, da tashi zuwa ga iko - abin koyi na amana.",
  },
  {
    era: "Urushalima",
    title: "Dawud dan Sulaiman",
    body: "Sarauta, hikima, Zabur, da masarauta sun yabe a cikin Alkur'ani.",
  },
  {
    era: "Karni na 1 CE",
    title: "Isa bin Maryam",
    body: "An haife shi ta hanyar mu'ujiza, an yi magana a cikin shimfiɗar jariri, an tashe shi ga Allah - ba a kashe shi a kan giciye kowace Kur'ani ba.",
  },
  {
    era: "Karni na 7 CE",
    title: "Muhammad ﷺ - Hatimin Annabawa",
    body: "Manzo na karshe zuwa ga dukkan bil'adama; Alkur'ani mai girma har zuwa ranar karshe.",
  },
];
