// Hausa translation overlay for the Learn Battles content. Mirrors the order of
// its English source in ../battles*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  BattlesFigure,
  BattlesGlossaryTerm,
  BattlesLessonCard,
  BattlesTimelineEvent,
  BattlesTopic,
  BattlesVerse,
} from "../../types/battles";
import type { DeepPartial } from "./localize";

export const BATTLES_TOPICS_HA: DeepPartial<BattlesTopic>[] = [
  {
    title: "Gabatarwa",
    summary: "Tarihin tarihi, zalunci, Hijira, da lokacin da aka halasta yaki.",
    body: [
      "A cikin shekaru goma sha uku na farkon wahayi a Makkah, an umurci musulmi da su jure zalunci da hakuri - ba a ba su izinin yin yaki ba. Lokacin da sahabbai suka nemi kare kansu, amsar ita ce: “Ku kange hannuwanku, ku tsayar da sallah, kuma ku ba da zakka” (k:4:77). Al'ummar farko sun amsa zalunci da tsayin daka, hijira, da addu'a, ba tawaye da makami ba.",
      "Hijira zuwa Madina (622 Miladiyya/1H) ta canza yanayin al’umma, ba ka’idojinta ba. A cikin Yasriba Musulmai sun zama al'umma masu zaman kansu da Kundin Tsarin Mulki na Madina - rubutaccen alkawari na kare juna da zama tare da kabilun Yahudawa na birnin. A yanzu Annabi SAW ya kasance shugaban siyasar da za a iya kaiwa hari don haka yana iya kare kansa bisa doka.",
      'Daga nan ne kawai, bayan shekaru na zalunci, izinin farko na yaƙi ya sauko - kuma dalilin da ya bayyana shi ne cewa an zalunce muminai kuma an kore su daga gidajensu saboda suna cewa "Ubangijinmu Allah ne" (Alkur\'ani 22:39-40). Izinin ya kasance don karewa da kare yancin addini - ayar guda ta ba da sunan amincin "masufi, coci, majami\'u, da masallatai" kamar abin da irin wannan fada yake kiyayewa - ba don cin nasara ba, tuba ta tilastawa, ko ganima.',
      "Kur’ani ya sanya iyaka ta dindindin a kan wannan izinin: “Ku yãƙi waɗanda suke yaƙe ku a cikin hanyar Allah, amma kada ku ƙetare iyaka” (k:2:190). Yaki yana da nasaba da cin zarafi ga al'umma, kuma ba za a taba wuce iyakokin adalci ba.",
      "Waɗannan yaƙin neman zaɓe tarihi ne: sun faru ne a cikin ƙayyadaddun yanayin Larabawa na ƙarni na bakwai na yaƙin kabilanci, karya yarjejeniyoyin, da kewaye. Gabaɗayan koyarwar Musulunci game da zaman lafiya, da adalci, da rahama, da maƙwabta su ne ginshiƙi; Dole ne a karanta bayanan waɗannan yaƙe-yaƙe a cikin wannan firam ɗin, ba a ruguje su cikin taken da aka yage daga ciki ba.",
    ],
    quran: [
      {
        excerpt:
          "An yi izni ga waɗanda suka yi yãƙi sabõda zãlunci a kansu, kuma lalle ne Allah, haƙĩƙa, Mai ĩkon yi ne a kan taimakon waɗanda aka fitar daga gidãjensu, bã da wani hakki ba, fãce dõmin sun ce: \"Ubangijinmu ne Allah.\" Kuma dã Allah bai tunkuɗe wasu mutãne da sãshe ba, lalle ne, dã an rurrushe dakunan karatu da Majami'u da majami'u da masallatai waɗanda aka ambaci sũnan Allah da yawa a cikinsu.",
      },
      {
        excerpt:
          "Ku yãƙi waɗanda suke yãƙe ku a cikin hanyar Allah, kuma kada ku ƙetare haddi. Lalle ne, Allah bã Ya son azzalumai.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Me yasa fadace-fadace suka faru",
    summary: "Tsananta, keta yarjejeniya, da kare al'umma - ba zalunci ba.",
    body: [
      "Halin da kuma sanadin wadannan yaƙe-yaƙe ya ​​kasance yaƙin gaba na gaba, ba wai son musulmi na son yaƙi ba. A Makka kuwa Kuraishawa sun azabtar da marasa karfi, sun kaurace wa iyalansu baki daya har yunwa ta kashe su, sun kwace dukiyoyin da Muhajirai suka bari, har ma sun kulla makircin kashe Annabi SAW. Hijira zuwa Madina bai kawo karshen barazanar ba; ya mayar dashi.",
      "Badar (2 AH) ya girma ne daga waccan rigimar da ba a warware ta ba. A lokacin da aka samu labarin cewa wani katon ayarin Kuraishawa - dauke da dukiyoyin da aka karbo daga hannun Muhajirai - suna dawowa daga Sham, sai Manzon Allah Sallallahu Alaihi Wasallama ya tashi ya tare ta. Ayarin sun tsere, amma Kuraishawa sun riga sun tara runduna kusan dubu, suka yi tattaki duk da haka, da niyyar murkushe matasan al'umma da karfi. Yakin da aka gwabza a rijiyoyin Badar ne ya haifar da hakan.",
      "A Madina kuwa rayuwa ta dogara ne akan yarjejeniyoyin da aka yi, kuma an sha karya yarjejeniyoyin. Bangarorin da suka yi alkawarin ba da kariya ga juna a karkashin yarjejeniyar birnin a maimakon haka suka hada kai da abokan gaba - ’yan Confederation wadanda suka yiwa Madina kawanya a mahara (5H) sun hadu daidai domin kawar da musulmi gaba daya.",
      "Rashin keta yarjejeniyar ya kasance mai yanke hukunci har zuwa ƙarshe. Kawayen Kuraishawa ne suka kai hari kan kawayen musulmi, wato Banu Khuza'ah, suka warware yarjejeniyar Hudaibiyya, suka kuma jagoranci - abin mamaki - zuwa kusan budewar Makka ba tare da yin kisa ba.",
      "A cikin wannan duka, manufofin sun kasance masu daidaituwa: kare rayuwa da addini, kare masu rauni, da kuma samar da isasshen tsaro wanda za a iya yin tauhidi ba tare da tsanantawa ba. Manufar ita ce ba ta da iyaka don faɗaɗa kanta, kuma majiyoyi sun rubuta cewa Annabi SAW yana son yin sulhu da yarjejeniya a duk lokacin da makiya suka karkata zuwa ga zaman lafiya.",
    ],
    hadith: [
      {
        excerpt:
          "An umurce ni da in yaqi mutane har sai sun shaida cewa, babu abin bautawa da gaskiya sai Allah, kuma Muhammadu Manzon Allah ne, da tsayar da salla, da bayar da zakka. Idan kuma suka yi haka, an kare ni daga gare ni, rayukansu da dukiyoyinsu, sai da hakkin Musulunci, kuma hisabinsu yana wurin Allah. — Malaman gargajiya sun karanta “mutane” a matsayin takamaiman mushrikai na Larabawa sannan suka yi yaƙi da Musulunci bayan saƙon ya iso gare su; magana ce game da wadancan mayaka, ba lasisin kai hari ga wadanda ba musulmi ba masu zaman lafiya ko tilasta imani, wanda Kur'ani 2:256 ya hana kai tsaye.",
      },
    ],
    quran: [
      {
        excerpt: "Babu tilas a addini. Hanya madaidaiciya ta bambanta da bata.",
      },
    ],
    disclaimer:
      "Ana yawan ambato hadisin da ke sama a cire masa saitinsa. Malaman gargajiya sun sanya shi a cikin keɓantattun hukunce-hukuncen lokacinsa da kuma hani da Kur'ani na tilastawa addini (2:256) kuma iyaka cewa yaƙin yana kan waɗanda suke yaƙe ku ne kawai (2:190).",
    appLinks: [{}],
  },
  {
    title: "Ladubban yaki a Musulunci",
    summary:
      "Babu zalunci, tsananin kariya ga farar hula, da ɗabi'a na mutuntaka - wanda ya ginu a cikin Kur'ani da Sunnah.",
    body: [
      "Shari'ar Musulunci ta yaki (siyar) ta girma kai tsaye daga iyakokin Kur'ani da aikin Annabi. Tushenta ƙa’ida ce guda ɗaya wadda ke tafiyar da komai: “Ku yaƙi waɗanda suke yaƙe ku, amma kada ku ketare iyaka” (Alkur’ani 2:190). Yaki shine mayar da martani ga wuce gona da iri, da adalci, kuma dole ne a daina lokacin da makiya suka tsaya.",
      "Wadanda ba mayakan ba suna da kariya sosai. Lokacin da aka samu mace da aka kashe bayan balaguro guda daya, Annabi SAW ya hana kashe mata da yara kai tsaye. Malaman shari’a sun ba da wannan ga tsofaffi, ga sufaye da masu bautar da ke keɓe a ɗakin su, ga ma’aikatan gona da ma’aikata, da duk wanda bai shiga cikin yaƙi ba. Kashe su ba haramun ba ne.",
      "Ko da mayaƙa masu ƙwazo, batu shine gayyata a gaban takobi. Lokacin da Annabi SAW ya nada wani kwamanda sai ya umurce shi da ya fara kiran daya bangaren zuwa ga Musulunci, sannan - in ya ki - zuwa ga sulhu, kuma kawai a yi yaki idan an ki duka biyun, kuma kada ya karya imani, ko yanke jiki, ko kuma ya kashe yaro (Sahih Musulmi 1731).",
      "Ha'inci haramun ne: dole ne a mutunta yarjejeniyoyin har zuwa wa'adinsu, kuma dole ne a ba abokan gaba gargadi mai kyau maimakon a ci amana. Izinin filin yaƙin cewa \"yaƙi yaudara ne\" yana nufin kawai dabarar dabara - feints, mamaki, karkatacciyar hanya - kar a taɓa karya alkawari ko yin ƙarya ga ƙungiya mai kariya.",
      "Dukiya da ita kanta ƙasa ana kiyaye su. Jagoranci gabaɗaya ya haramta sare bishiyar 'ya'yan itace, kona amfanin gona, da yankan dabbobi fiye da bukata. Za a ciyar da fursunoni kamar yadda masu garkuwar ke ci da tufafi kamar yadda suka tufatar da kansu; Kur'ani ya yaba wa waɗanda suke ciyar da fursuna saboda ƙaunar Allah (76:8), kuma da yawa an 'yanta su ta hanyar fansa, musanyawa, ko jinƙai mai sauƙi - wasu a Badar don musanya koyawa musulmai karatu.",
      "Waɗannan su ne koyarwar al'ada na addini. Musulmai daya-daya a cikin tarihi wadanda suka keta su suna keta Musulunci, ba wai suna bayyana shi ba - kamar yadda keta hakkin mabiyan kowane addini ba sa sake rubuta abin da wannan imani ya umarta.",
    ],
    quran: [
      {
        excerpt: "Ku yãƙi waɗanda suke yãƙe ku a cikin hanyar Allah, kuma kada ku ƙetare haddi.",
      },
      {
        excerpt:
          "Kuma idan sun karkata zuwa ga aminci, to, ka karkata zuwa gare ta, kuma ka dõgara ga Allah. Lalle Shĩ, Shĩ ne Mai ji, Masani.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ibn Umar ya ruwaito cewa an samu wata mata da aka kashe a daya daga cikin balaguron da Manzon Allah Sallallahu Alaihi Wasallama ya yi, don haka ya hana kashe mata da yara.",
      },
      {
        excerpt:
          "A lokacin da Annabi SAW ya nada wani kwamanda akan runduna sai ya umurce shi da cewa: “Ya yi yaki da sunan Allah... kada ku yi almubazzaranci da ganima, kada ku warware alkawari, kada ku yanke jiki, kuma kada ku kashe yaro. Idan kuka hadu da abokan gaba, ku fara kiransu zuwa ga Musulunci; Idan sun ƙi, ka ba su salama. To, idan sun ƙi su biyun, sai ku yãƙi.",
      },
      {
        excerpt:
          "Kada ku kashe tsoho, ko ƙaramin yaro, ko mace. - Wasu sassan wannan lafazin daidai gwargwado suna da rauni, amma hukunce-hukuncen da ya zo ya tabbata a hadisin sahihin da ke sama da kuma ijma'in malaman fikihu.",
      },
    ],
    actions: [
      "A rarrabe a fili tsakanin abin da Musulunci ya yi umarni da abin da kowace runduna a tarihi ta yi.",
      "Karanta wannan sashe na ɗabi'a kafin kowane labari na yaƙi - tarihi ba tare da ka'idodin mulkin sa yana gayyatar rashin fahimta ba.",
      "Lokacin da wata majiya ta rubuta wani aiki da alama ya saba wa waɗannan ƙa'idodi, tambaya game da mahallinsa da sahihancinsa kafin yanke hukunci.",
    ],
    appLinks: [{}],
  },
  {
    title: "Yakin Badar",
    summary: "17 Ramadan 2 AH — Yakin Farko babba, Ranar Sakamako.",
    body: [
      "Magana da dalili: Bayan Hijira, Kuraishawa sun kwace gidaje da dukiyoyin da Muhajirai suka bari a Makka, suna ci gaba da barazanarsu. Lokacin da labari ya iso Madina cewa Abu Sufyan yana jagorantar ayarin attajirai suna dawowa daga Sham, sai Manzon Allah Sallallahu Alaihi Wasallama ya tashi da wata runduna masu sassauqa, kusan mutane 313, suna tsammanin za su karbe dukiya, ba wai don su yi yaki ba.",
      "Abin da ya faru: Abu Sufyan ya wuce ta bakin teku, amma ya riga ya aika zuwa Makka don neman taimako, sai Kuraishawa suka fita da mayaka kusan dubu, da dawakai, da abinci, suka kuduri aniyar yin misali da musulmi. Yakin ya zama babu makawa a rijiyoyin Badar, inda - bisa shawarar al-Hubab ibn al-Mundhir - musulmi suka fara kwace ruwan, suna musu makiya.",
      "A wannan daren Annabi ﷺ ya tsaya yana sallah har gari ya waye. Yana fuskantar runduna sau uku, sai ya daga hannayensa ya roki Ubangijinsa da gaske, har mayafinsa ya zube daga kafadarsa, yana mai cewa: \"Ya Allah idan aka halakar da wannan kungiyar muminai, ba za a bauta maka ba a bayan kasa.\" Kur'ani ya rubuta cewa Allah ya amsa da ƙarfafawar mala'iku kuma ya jefa natsuwa a cikin zukatan muminai.",
      "Bayan fafatawa daya tsakanin zakarun uku daga kowane bangare, sojojin sun yi arangama. Kuraishawa sun karye. Kimanin shugabanninsu saba'in ne aka kashe - daga cikinsu akwai Abu Jahal, wanda ya fi kowa tsananta wa al'umma - kuma an kama kusan saba'in; musulmi goma sha hudu ne suka yi shahada. An yi wa ’yan fursuna daraja, wasu kuma sun sayi ’yancinsu ta hanyar koya wa yara Musulmi karatu da rubutu.",
      "Manyan mutane: tare da Annabi ﷺ sun tsaya Abubakar, Umar, Ali, da baffansa Hamza; nasihar al-Hubab akan rijiyoyi da na Sa’ad ibn Mu’adh kan dabarun nuna jagoranci ta hanyar tuntubar juna ko da an yi alkawarin nasara.",
      "Kur’ani ya kira wannan rana da ‘yawm al-furqan’ – ranar rarrabewa – domin ta bambanta gaskiya da karya a gaban dukkan kasashen duniya. Darasinsa mai dorewa shi ne cewa wajibi ne a haxu da qoqari da cikakken shiri domin tawakkali ga Allah: muminai sun tsara darajojinsu, suka zavi qasa, suka yi addu’a, kuma nasarar ta kasance ga Allah ne, ba yawansu ba.",
    ],
    battleDetails: {
      location: "Rijiyoyin Badar, kudu maso yammacin Madina",
      modernLocation: "Kusa da Badar zamani, Saudi Arabia",
      hijriDate: "17 Ramadan 2 AH",
      muslimForces: "~ mayaƙa 313, da dawakai kaɗan da raƙuma (rahotanni sun ɗan bambanta)",
      opposingForces: "~ Kuraishawa 1,000, sun fi makamai da hawa",
      muslimCommander: "Annabi Muhammad ﷺ",
      opposingCommander: "An kashe Amr bn Hisham (Abu Jahl), a yakin",
      weather:
        "Ruwan sama a daren da ya gabata ya tabbatar da yashi ga musulmi; samun ruwa yana da mahimmanci",
      outcome: "Hukuncin nasara na musulmi",
      keyEvents: [
        "Al-Hubab bn al-Mundhir ya ba da shawarar yin zango a rijiyoyin farko, tare da sarrafa ruwan.",
        "Annabi ﷺ ya yi addu'a a cikin dare, yana roƙon Allah ga waɗanda suka fi muminai.",
        "Zakaran Kuraishawa uku Hamza, Ali, da Ubaydah sun hadu a fafatawar guda.",
        "Allah ya ƙarfafa muminai da mala'iku (Alkur'ani 8:9) kuma ya jefar da manyan shugabannin Kuraishawa.",
        "An kashe kusan 70 daga cikin abokan gaba kuma an kama 70; an yi wa fursunoni halin mutuntaka.",
      ],
      leadershipLesson:
        "Ku yi shiri, kuma ku shawarci ma'abuta ilmi, sa'an nan kuma ku dõgara ga Allah gaba ɗaya.",
      spiritualLesson:
        "Ƙungiya kaɗan na gaskiya tare da goyon bayan Allah na iya kawar da rashin daidaituwa na duniya - nasara daga Allah ne.",
      facts: [
        "An ambaci sunan Badar kuma an kwatanta shi a cikin Kur'ani fiye da kowane alkawari guda daya (Suratul Anfal).",
        "An 'yantar da wasu da aka kama domin koyar da 'ya'yan Madina ilmin karatu.",
      ],
    },
    quran: [
      {
        excerpt:
          'A lõkacin da kuke nẽman taimako daga Ubangijinku, sai Ya karɓa muku: "Lalle ne zan ƙarfafa ku da malã\'iku dubu, sunã bin jũna."',
      },
      {
        excerpt:
          "Lalle ne, haƙĩƙa, ãyã ta kasance a gare ku a cikin jama'a biyu waɗanda suka haɗu, ɗayan yana yãƙi a cikin hanyar Allah, kuma ɗayan kãfirai.",
      },
      {
        excerpt:
          "Ba ku kashe su ba, amma Allah ne ya kashe su. Kuma ba ku yi jĩfa ba a lõkacin da kuka yi jĩfa, kuma amma Allah ne Ya yi jĩfa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Umar ya ruwaito cewa, a ranar Badar Annabi s.a.w ya kalli makiyin mutum dubu alhalin sahabbansa sun kai sama da dari uku kadan, sannan ya juya zuwa ga alkibla, ya mika hannayensa, ya roki Ubangijinsa: “Ya Allah ka cika min alkawarin da ka yi mini. Ya Allah idan aka ruguza wannan kungiyar ta muminai, ba za a bauta maka ba a bayan kasa. Ya yi ta roko har alkyabbarsa ta fado daga kafadarsa, sai Abubakar ya musanya shi ya ce: Ya isa ya Manzon Allah – Allah zai cika abin da ya alkawarta maka.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yakin Uhudu",
    summary: "Shawwal 3 AH - darasi mai tsada a cikin biyayya, da'a, da tsayin daka.",
    body: [
      "Maudu'i da sanadi: Shekara guda bayan Badar, kuraishawa ta dawo domin daukar fansar wadanda suka mutu, inda suka tara mayaka kimanin 3,000 - tare da dawakai karkashin jagorancin Khalid bn al-Walid, a lokacin har yanzu makiyi ne, da mata suna kwadaitar da mazaje da ganguna da kawaye. Musulmi, kimanin 700 bayan wasu sun janye, suka dauki matsayi da Dutsen Uhudu a bayansu.",
      "Abin da ya faru: Manzon Allah Sallallahu Alaihi Wasallama ya ajiye maharba hamsin a kan wani tudu suna gadin bayan da rundunar ta fallasa, ya ba su umurni da ya maimaita domin jaddada cewa: “Kada ku bar wannan matsayi ko da kun ga tsuntsaye suna kwace mu, sai na aika a kirawo ku. Da farko shirin ya yi aiki daidai - Musulmai sun kori Kuraishawa baya, abokan gaba suka fara gudu.",
      "Ganin yadda abokan gaba suka watse da ganima a bude, sai akasarin maharba suka watsar da tudun bisa tsari, tabbas an ci nasara a yakin. Khalid bn al-Walid ya kame wannan lokacin, ya kuma tuka dokinsa ta ratar da ba a kare ba, ya buge musulmi daga baya. Oda ya ruguje cikin hargitsi.",
      'Mahimman ƙididdiga da farashi: Hamza bn Abdil-Muttalib, "Zakin Allah" ya yi shahada, tare da wasu sahabbai kusan saba\'in. Manzon Allah SAW da kansa ya samu rauni - hakori ya karye kuma an yanke masa fuska - sai jita-jita ta mamaye filin cewa an kashe shi. Da Muminai suka ga yana raye, sai suka taru zuwa gare shi a kan gangaren dutsen, Kuraishawa ba su gama su ba, suka ja da baya.',
      "Alkur'ani ya yi magana mai tsawo a kan wannan rana a cikin suratu Al Imrana, inda ya dora alhakin sabawa wasu, ba a kan wani gazawar imani ko kuma alkawarin Allah: \"Lalle ne, Allah Ya cika muku wa'adinSa... har sai kun yi karfin hali, kuka yi jayayya a kan tsari, kuma kuka saba bayan Ya nuna muku abin da kuke so\" (3:152). Amma duk da haka wannan nassi yana ta'aziyya ga al'ummar da suka ji rauni kuma ya hana yanke ƙauna.",
      "Don haka Uhudu ba faduwa ce ta Musulunci ba, a'a darasi ne da aka kiyaye: nasarar da aka samu a baya an janye ne a lokacin da horo ya watse, umarni bayyanannu kamar jaruntaka, da jarrabawa suna tace al'umma - ga wadanda suka tuba kuma suka yi tsayin daka, koma baya ya zama tushen ci gaba.",
    ],
    battleDetails: {
      location: "gangaren Dutsen Uhud, arewa da Madina",
      modernLocation: "Uhud, yankin Madina, Saudi Arabia",
      hijriDate: "Shawwal 3 AH",
      muslimForces: "~ 700 (bayan wasu sun janye kafin yakin)",
      opposingForces: "~ Kuraishawa 3,000 da abokansa, tare da dawakai",
      muslimCommander: "Annabi Muhammad ﷺ",
      opposingCommander:
        "Abu Sufyan bn Harb; Khalid bn al-Walid ya jagoranci dakarun dawaki da ke gefe",
      outcome: "Amfanin dabara na kuraishawa; al'ummar musulmi sun tsira",
      keyEvents: [
        "Manzon Allah SAW ya ajiye maharba guda 50 a kan wani tsauni tare da umartar su kada su bar shi.",
        "Musulmai sun karya layin abokan gaba, amma yawancin maharba sun bar wurinsu don tattara ganima.",
        "Dawakan Khalid bn al-Walid suka yi amfani da wannan gibin, suka buge daga baya.",
        "Hamza da sahabbai kusan 70 ne suka yi shahada; Annabi SAW ya ji rauni.",
        "An yada jita-jitan karya na mutuwar Annabi; Muminai suka taru a lokacin da suka gan shi a raye.",
      ],
      leadershipLesson:
        "Bayyanar umarni da aiwatar da aiwatarwa gwargwadon ƙarfin hali; Yin watsi da post ɗinku na iya gyara nasara.",
      spiritualLesson:
        "Jarabawa suna tsarkake muminai; koma baya gamuwa da tuba kuma tsayin daka yana kaiwa ga girma.",
    },
    quran: [
      {
        excerpt:
          "Kuma lalle ne, haƙĩƙa, Allah Yã sãka muku wa'adinSa a lõkacin da kuke kashe su da izninSa, har sai kun yi ƙarfin hali, kuma kuka yi jãyayya a cikin al'amarin, kuma kuka sãɓã a bãyan Ya nũna muku abin da kuke so.",
      },
      {
        excerpt:
          "Sabõda haka kada ku yi rauni kuma kada ku yi baƙin ciki, kuma lalle ne ku, haƙĩƙa, zã ku kasance mafi girma idan kun kasance muminai.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Annabi SAW ya nada Abdullahi bn Jubayr a kan maharba hamsin a ranar Uhudu ya ce: Ku rike matsayinku; Ko da kun ga tsuntsaye suna ƙwace mu, kada ku bar shi sai na aika a kirawo ku, kuma ko kun ga mun ci su, kada ku tafi sai na aika a kirawo ku. Da aka fatattaki makiya, maharba suka ga ganima, suka ce, ganima! kuma suka bar mukaminsu - don haka aka kashe mu saba'in.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yaƙin Ramin",
    summary: "Shawwal 5 AH - Ƙungiyoyin sun kewaye Madina; rami da iska suka karya su.",
    body: [
      "Maudu'i da sanadi: Har ila yau ana kiransa Ghazwat al-Ahzab (Yakin Ƙungiyoyin Ƙungiyoyi), wannan shi ne babban ƙoƙarin makiya na rusa Musulunci gaba ɗaya. Shugabannin Banu Nadir, wadanda aka kora tun da farko saboda ha'inci, suka doki Makkah da Gatafan suka hada kawance - Kuraishawa, Ghatafan, da sauran kabilu - wanda aka kiyasta tsakanin mutane 10,000 zuwa 24,000. Musulmai sun kai kimanin 3,000, kuma hadarin ya kasance.",
      "Abin da ya faru: Fuskantar kawanya babu wani garin larabawa da zai iya jurewa a fili, Annabi SAW ya shawarci sahabbansa. Salman al-Farisi ya ba da shawarar dabarar Farisa da yaƙin Larabawa bai sani ba - ya tona rami mai zurfi a kan hanyar arewa da aka fallasa, gefe ɗaya tilo da filayen lava, gonakin gonaki, ko gidaje masu garu ba su da kariya. Muminai sun yi ta tona tsawon kwanaki cikin tsananin sanyi da yunwa, Annabi SAW ya dauki kasa a bayansa yana daure dutse a cikinsa saboda zafin azumi.",
      "Ramin ya yi aiki. Lokacin da babban mai masaukin baki ya iso sai ya ga ya kasa hayewa; 'yan mahaya da suka yi tsalle aka kora su baya. Sigarin ya zauna cikin kusan makonni biyu zuwa huɗu na sanyi, tashin hankali, da faɗa maimakon faɗa.",
      "An gwada al'umma har takai ga. Munafukai sun ba da uzuri kuma suka nemi zamewa; Kabilar Banu Kuraizah da ke cikin birnin sun karkata zuwa ga makiya; Alkur'ani ya siffanta zukata masu kaiwa ga makogwaro. Amma duk da haka muminai suka yi riko da shi, kuma Nu'aym bn Mas'ud - sabon musulmi a asirce - ya shuka rashin yarda a tsakanin qungiyoyin qungiyoyin qungiyoyin qungiyoyi har sai da suka juya ga juna.",
      "Sa'an nan taimako ya zo daga Allah, ba daga takubba ba. Wata muguwar iska mai tsananin sanyi ta ratsa sansanin abokan gaba, tana jujjuya wutar dafa abinci da tantuna, kuma sojojin da ba a gani ba sun cika su da firgici. Gamayyar dai da tuni ta karye kuma ba ta da kayan aiki, ta watse ta fice cikin dare. Sai Annabi SAW ya ce bayan haka Allah ne kadai ya karya }ungiyoyin.",
      "Darussa masu ɗorewa: Nasiha mai kyau ya kamata a yi amfani da ita a duk inda ta fito - a nan daga sabon tuban Farisa; dole ne a dauki ma'anar zuwa iyakar su - ramin da aka haƙa, matsayi da aka riƙe; Sa'an nan kuma aka wakilta ãkiba ga Allah, Yanã mayar da runduna da iska. Suratul Ahzab ta kiyaye dukkan fitina da saukaka ta.",
    ],
    battleDetails: {
      location: "Arewa ta nufo Madina",
      modernLocation: "Madina, Saudi Arabia",
      hijriDate: "Shawwal 5 AH",
      muslimForces: "~ 3,000",
      opposingForces:
        "Ƙungiyoyin haɗin gwiwa (~ 10,000-24,000; alkaluma sun bambanta a cikin kafofin)",
      muslimCommander: "Annabi Muhammad ﷺ",
      opposingCommander:
        "Abu Sufyan ya jagoranci kuraishawa; sarakunan kawancen Ghatafan da sauransu",
      weather: "Sanyi mai ɗaci yayin tono; wata mummunar iska ta Allah ta kawo karshen kewayen",
      outcome: "Nasarar musulmi ba tare da yakin ba; kawancen ya watse",
      keyEvents: [
        "Salman al-Farisi ya ba da shawarar tono rami a kan titin arewa mai rauni.",
        "Annabi ﷺ ya raba aiki, yana ɗaukar ƙasa da ɗaure dutse daga yunwa.",
        "Ramin ya dakatar da ɗimbin rundunar, wanda ya tilasta wa yaƙi maimakon faɗa.",
        "Nu'aym bn Mas'ud ya haifar da sabani wanda ya raba kan abokan tarayya.",
        "Iska mai tsananin sanyi da rundunonin da ba a gani (Qur'ani 33:9) sun farfasa sansanin abokan gaba; suka janye.",
      ],
      leadershipLesson:
        "Yi shawarwari da yawa kuma ku ɗauki kyawawan ra'ayoyi ba tare da la'akari da asalinsu ba; ka raba wa al'umma wahalar da kanka.",
      spiritualLesson:
        "Ka yi tsayin daka a cikin kewaye, kuma ka dogara ga Allah, wanda zai iya komar da runduna da iska.",
    },
    quran: [
      {
        excerpt:
          "Ya ku waxanda suka yi imani, ku tuna ni’imar Allah a kanku a lokacin da runduna ta zo muku, kuma Muka aika wata iska da rundunonin da ba ku gani ba, a kansu.",
      },
      {
        excerpt:
          "Kuma a lõkacin da mũminai suka ga ƙungiyõyin, suka ce: \"Wannan shĩ ne abin da Allah da ManzonSa Ya yi mana wa'adi, kuma bai ƙãra musu kõme ba fãce ĩmãni da tawali'u.\"",
      },
    ],
    hadith: [
      {
        excerpt:
          "Manzon Allah Sallallahu Alaihi Wasallama ya yi addu’a ga ‘yan qungiya a ranar al-Ahzab, yana cewa: “Ya Allah maxaukakin littafi, mai gaggawar hisabi, ka karya qungiyoyin }ungiyoyin. Ya Allah ka karya su ka girgiza su.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Banu Quraizah",
    summary:
      "5 AH - yarjejeniyar da aka ci amana a lokacin kewaye; hukunci da wanda aka amince da shi.",
    body: [
      "Maudu'i da sanadi: Banu Qurayzah ƙabila ce ta yahudawa ta Madina wacce aka ɗaure ta da musulmi bisa yarjejeniyar kare juna da birnin. A can kololuwar mahara, a lokacin da ‘yan Confederation suka yi wa Madina, kuma rayuwar al’umma ta rataye da zare, sai sarkin Banu Nadir ya rinjayi shugabannin Kuraishah da su yayyaga wannan alkawari, suka bude gaba na biyu daga cikin garin. To a wannan lokacin, wannan ba sabani ba ne na sirri, sai dai cin amanar kasa a lokacin da aka kai hari da zai iya halaka kowa da kowa a Madina.",
      "Abin da ya faru: Bayan da ‘yan Confederation suka janye, sai Annabi SAW ya yi gaba da Banu Quraizah, wadanda suka rufe kansu a cikin kagararsu. Sai da suka kai kimanin kwanaki ashirin da biyar, har sai da suka yarda su mika wuya - amma suka nemi kada Annabi SAW ya yanke makomarsu kai tsaye, sai da wani mai sulhu da suka zaba: Sa'ad bn Mu'adh, shugaban Aws, abokan zamansu na dadewa.",
      "Hukuncin: Sa'd - da kansa yana mutuwa sakamakon raunin da aka samu a mahara - ya yanke hukuncin cewa a kashe mayaƙan da suka yi cin amanar kuma a kwashe mata da yara a matsayin fursuna, hukunci mai tsanani bisa kowane ma'auni har yanzu yana dacewa da dokar yaƙi na lokacin da wurin don cin amanar ƙasa. Annabi SAW ya ce Sa’ad ya yi hukunci daidai da hukuncin Allah.",
      "Yadda za a karanta shi a hankali: Wannan hukunci ne ga takamaiman aikin ha'incin lokacin yaƙi da mayaƙan da suka karya yarjejeniyar tsaro a cikin sa'a mafi rauni a cikin al'umma - ba hukunci a kan mutane don imaninsu ba, kuma a zahiri ba samfuri ba ne na yadda musulmi za su bi da Yahudawa ko wata al'umma ta addini. Kur'ani da Sunnah sun yi umarni da adalci da kyautatawa ga wadanda ba musulmi ba masu aminci (Alkur'ani 60:8), da sauran kabilun Yahudawa da daidaikun mutanen Madina wadanda suka yi imani ba a taba cutar da su ba. Ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararrun ƙwararru ta ɗauki wannan a matsayin wani yanki na tarihi na dokar cin amanar kasa, kuma wasu malaman daga baya sun yi tambaya game da cikakkun bayanai game da lambobin da aka watsa.",
      "Kur'ani ya yi nuni da abin da ya faru cikin hankali a cikin suratu al-Ahzab a sakamakon yakin gamayya, ba tare da cin nasara ba. Darasi mai ɗorewa shine tsananin karya alkawari - cin amanar amana a cikin wani lokaci na haɗarin haɗari yana ɗaukar nauyi mafi girma - a gefe guda ɗaya cewa ko da maƙiyi yana da damar yanke hukunci ta hanyar mai sasantawa da aka amince da shi ba tare da son zuciya ba maimakon ɗaukar fansa ba tare da kariya ba.",
    ],
    battleDetails: {
      location: "Garuruwan Banu Qurayzah, a gefen Madina",
      modernLocation: "Madina, Saudi Arabia",
      hijriDate: "Zul-Qa'dah 5 AH",
      muslimForces: "Dakarun Madina, kai tsaye bayan da aka kewaye mahara",
      opposingForces: "Banu Qurayzah, sun yi garu a cikin kagararsu",
      muslimCommander: "Annabi Muhammad ﷺ",
      outcome: "Mika wuya bayan kewaye; yanke hukunci wanda kabilar ta zaba",
      keyEvents: [
        "Banu Quraizah ya warware alkawarin Madina a lokacin da ‘yan tawaye suka mamaye.",
        "Bayan da 'yan Confederation suka janye, musulmi sun yi wa sansaninsu kawanya na tsawon kwanaki 25.",
        "Kabilar ta bukaci Sa'ad bn Mu'adh, shugaban abokan kawancensu na Aws da suka dade suna yi masa shari'a.",
        "Sa'ad ya yi mulki da dokar yaƙi na zamani don cin amanar ƙasa a kewaye; Annabi ﷺ ya tabbatar da hukuncin.",
      ],
      leadershipLesson:
        "Ko da maƙiyi, ku ƙyale hukunci ta wurin wanda aka amince da shi, marar son kai, maimakon ɗaukar fansa da ba a kula ba.",
      spiritualLesson:
        "Saba alkawarin kare juna a daidai lokacin da ake haduwa da juna yana daga cikin manyan cin amana.",
    },
    quran: [
      {
        excerpt:
          "Kuma Ya saukar da waɗanda suka taimake su daga Mutãnen Littãfi daga birãnensu, kuma Ya jẽfa tsõro a cikin zukãtansu, wata ƙungiya kuka kashe, da wata ƙungiya da kuka kãma. Kuma Ya gãdar da ku ƙasarsu da gidãjensu.",
      },
      {
        excerpt:
          "Kuma Allah bã Ya hana ku daga waɗanda ba su yãƙe ku ba sabõda addini, kuma ba su fitar da ku daga gidãjenku ba, ku yi musu taƙawa, kuma ku yi musu ãdalci. Lalle ne, Allah Yana son masu adalci.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Lokacin da Banu Quraizah ya yarda ya yarda da hukuncin Sa'ad bn Mu'adh, sai Annabi SAW ya aika aka kira shi. Ya zo, sai Annabi SAW ya ce: Ku tsaya ga shugabanku. Sa’ad ya yi hukunci a kashe mayaƙansu, a kuma kwashe mata da ‘ya’yansu zuwa bauta. Annabi SAW ya ce: Kun yi hukunci da hukuncin Allah - ko ya ce, da hukuncin Sarki.",
      },
    ],
    disclaimer:
      "Wannan hukunci ne na wani takamaiman aiki na cin amanar lokacin yaƙi da maharan suka yi, wanda wani mai sasantawa da ƙabilar da kanta ta zaɓa ya yi hukunci. Ba hukunci ba ne a kan wasu mutane don addininsu kuma ba abin koyi ba ne ga dangantaka da Yahudawa ko wata al'umma ta imani, waɗanda Musulunci ya yi umarni da a yi musu adalci da kyautatawa (Qur'ani 60:8). Wasu malaman daga baya sun yi tambaya game da cikakkun bayanai game da lambobin da aka watsa.",
  },
  {
    title: "Yarjejeniyar Hudaibiyyah",
    summary: "6 AH - sulhu mai kama da koma baya kuma ya zama nasara bayyananne.",
    body: [
      "Ma’ana da dalili: A shekara ta 6 bayan hijira Annabi SAW ya tashi da sahabbai kusan 1,400 – ba su da makami amma na takubban matafiya – da nufin yin aikin hajjin karami (umrah) zuwa dakin Ka’aba kawai, ba don yaki ba. Kuraishawa ba su yarda a gan su suna barin musulmi cikin Makka ba, sai suka tare hanya a wani wuri da ake kira Hudaibiyyah a kan iyaka mai alfarma.",
      "Alkawarin Ridwan: A lokacin da wata jita-jita ta isa sansanin cewa Kuraishawa sun kashe manzon Annabi Usman bn Affan, sai Annabi SAW ya kira sahabbai su yi mubaya'a a karkashin bishiyar kurciya cewa ba za su gudu ba. Kimanin ɗari goma sha huɗu ne suka ba da wannan mubaya'a - Bay'at al-Ridwan, Alkawari na yardar Allah - kuma Kur'ani daga baya ya bayyana cewa: \"Allah ya yarda da muminai a lokacin da suka yi maka mubaya'a a ƙarƙashin itace\" (48:18). Uthman ya tabbatar da cewa yana raye, sai kuraishawa suka firgita da azamar da aka nuna, aka aika aka tattauna.",
      "Abin da ya faru: Sharuɗɗan sulhun ya zama kamar abin kunya. Musulmai za su juya baya a wannan shekara ba tare da umrah ba kuma zasu iya dawowa kawai na gaba. Za a yi zaman lafiya na shekaru goma. Duk wanda ya gudu daga Kuraishawa zuwa ga musulmai, za a mayar da shi, amma ba a mayar da shi ba - wani juzu'i da ya yi karo da juna. A lokacin da aka ja da wani musulmi a cikin sarka, Abu Jandal, a gaban idanunsu a karkashin wannan magana, sahabbai sun kusa karya; Umar ya tambaye shi a fili kuma aka tuna masa a hankali ya amince da Manzon Allah.",
      "Dalilin da ya sa aka samu nasara: A karon farko Kuraishawa sun yi mu'amala da Musulmai a matsayin wani iko daidai a cikin rubutacciyar yarjejeniya. Zaman lafiya na shekaru goma ya bude hanyoyi; Musulunci ya yadu cikin sauri da lumana a lokacin sulhu - mafi shigar Musulunci a cikin wadannan shekaru biyu fiye da na duk shekarun da suka gabata. An 'yantar da shi daga gaban Kuraishawa, Annabi SAW yana iya komawa Khaibar ya aika da wasiku na kiran sarakuna da kabilu zuwa ga Musulunci. A kan tafiya ta dawowa aka saukar da Suratul Fath, inda aka bude da cewa: \"Lalle ne, mun ba ku babban rabo bayyananne.\"",
      "Darussa masu dawwama: Wannan shine babban misali na haquri akan shauqi da kuma tawakkali ga Allah da Manzonsa alhalin hikimar yanke hukunci ba ta bayyana ba tukuna. Abin da sahabbai suka fara ji a matsayin shan kaye, Alkur'ani ya bayyana nasara a fili - kuma a cikin shekaru biyu ya bude hanyar Makka da kanta. Yardar yarda da zaman lafiya mai tsanani, girmama yarjejeniya, da jira an nuna a nan a matsayin wani nau'i na ƙarfi, ba rauni ba.",
    ],
    battleDetails: {
      location: "Hudaibiyyah, akan iyaka mai alfarma kusa da Makkah",
      modernLocation: "Al-Shumaisi, kusa da Makkah, Saudi Arabia",
      hijriDate: "Zul-Qa'dah 6 AH",
      muslimForces: "~ Mahajjata 1,400, ba su da kayan yaki",
      opposingForces: "Kuraishawa sun tare hanyar Makkah",
      muslimCommander: "Annabi Muhammad ﷺ",
      outcome:
        "Tsagaita wuta na shekaru goma; babu fada; daga baya aka kira nasara bayyananna a cikin Alkur'ani",
      keyEvents: [
        "Musulmi sun fita aikin umrah, ba yaki ba, aka tsayar da su a Hudaibiyya.",
        "Akan labarin karya na mutuwar Uthman, ~ 1,400 ya ba da Alkawari na Ridwan a karkashin bishiyar.",
        "An rattaba hannu kan yarjejeniyar tsagaita wuta na shekaru goma bisa sharuddan da sahabbai suka samu mai daci (lalacin dawowa, Abu Jandal).",
        "Musulunci ya yadu cikin sauri a lokacin zaman lafiya; Suratul Fath ta kira yarjejeniyar nasara bayyananna.",
      ],
      leadershipLesson:
        "Ka karɓi salama mai ƙarfi, ka girmama shi; Yarjejeniya ta hikima a yau na iya buɗe kofa mafi girma gobe.",
      spiritualLesson:
        "Ku dogara ga Allah da ManzonSa lokacin da hikimar yanke shawara ta ɓoye-haƙuri na iya zama nasara mafi gaskiya.",
    },
    quran: [
      {
        excerpt:
          "Lalle ne Mu, Mun ba ku babban rabo bayyananne, domin Allah Ya gafarta muku abin da ya gabace na zunubinku da abin da zai biyo baya, kuma Ya cika ni'imarSa a kanku, kuma Ya shiryar da ku zuwa ga hanya madaidaiciya.",
      },
      {
        excerpt:
          "Lalle ne, Allah Yã yarda da mũminai a lõkacin da suka yi maka mubaya'a a ƙarƙashin itãciya, kuma Ya san abin da ke cikin zukãtansu, sabõda haka Ya saukar da natsuwa a kansu, kuma Ya saka musu da wani yãƙi kusa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Jabir bn Abdullah ya ce: “A ranar Hudaibiyya mun kasance dari goma sha hudu. Mun yi mubaya'a ga Annabi SAW a karkashin bishiya, kuma shi ne mafificin mutane.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ziyarar Khaybar",
    summary: "7 AH - an rusa kagara mai ƙarfi waɗanda suka goyi bayan Ƙungiyoyin.",
    body: [
      "Maudu'i da sanadi: Khaybar wata sarka ce ta kagara mai albarka a arewacin Madina, mahaifar kabilun da aka kora tun da farko saboda ha'inci - ciki har da sarakunan Banu Nadir wadanda suka shirya hadakar hadin gwiwa a mahara. Daga nan suka ci gaba da hada makiya da Madina. Da hudaibiyya ya daskare gaban Kuraishawa, sai Annabi SAW ya matsa wajen kawar da wannan dandali na gaba.",
      "Abin da ya faru: Musulmai - kimanin 1,600 - sun hau katangar daya bayan daya. Yaƙin neman zaɓe ya kasance mai wahala kuma an fitar da shi cikin makonni da yawa. A wata rana mai wahala Annabi SAW ya ce, “Gobe zan ba da tuta ga mutumin da yake son Allah da Manzonsa, kuma Allah da Manzonsa suke so, wanda Allah zai ba da nasara ta hannunsa. Washe gari sai ya kira Ali bn Abi Talib – wanda yake fama da ciwon ido – ya yi masa addu’a har ya warke, ya ba shi tuta; kagara ya fadi.",
      "Matsugunin: Lokacin da aka ƙwace kagara, ba a kori mazauna. Sun nemi su zauna su ci gaba da noman kasar, suna ba wa musulmi kaso na amfanin gona, kuma Annabi SAW ya yarda. Wannan tsari - manoma da aka ci suka ci gaba da zama a ƙasarsu a ƙarƙashin yarjejeniyar raba kayan amfanin gona - ya zama farkon abin da aka yi nazari a cikin shari'ar Musulunci ta yarjejeniya da haraji.",
      "Mahimman bayanai: an fi tunawa da yaƙin neman zaɓe saboda rawar da Ali ya taka da kuma ɗabi'ar da ke cikin tuta hadisin - cewa shugabanci yana dogara ne akan ikhlasi da son Allah, ba wai kawai matsayi ko ƙarfi ba.",
      "Bayanin kulawa: Khaybar wani lokaci ana jan shi zuwa cikin rigingimun siyasa da yawa daga baya. Anan an kwatanta shi da ƙaƙƙarfan balaguro na ƙarni na bakwai da aka rubuta a cikin seerah na gargajiya - martani ga tushen maƙiya, wanda aka kammala ba tare da korar jama'a ba amma tare da sasantawa.",
    ],
    battleDetails: {
      location: "Kogin Khaybar, arewa da Madina",
      modernLocation: "Khaibar, Saudi Arabia",
      hijriDate: "Muharram–Safar 7 AH",
      muslimForces: "Kimanin 1,600",
      opposingForces: "Garuruwan rundunonin tsaro a kan garu da yawa",
      muslimCommander: "Annabi Muhammad ﷺ; Ali ibn Abi Talib ya jagoranci kai harin",
      outcome:
        "Musulman iko da kagara; yarjejeniyar raba kayayyakin amfanin gona da aka yi shawarwari",
      keyEvents: [
        "An rage kagara daya bayan daya sama da makonni da dama na kewaye.",
        "An bai wa Ali tuta, wanda Manzon Allah Sallallahu Alaihi wa Sallam ya warke da addu’arsa.",
        "Zakaran Marhab ya ci nasara kuma mabuɗin sansanin ya fadi.",
        "Mazaunan sun kasance a filayensu a matsayin masu noma a ƙarƙashin yarjejeniyar raba amfanin gona.",
      ],
      leadershipLesson:
        "Kuma ka dõgara ga waɗanda suka sãɓã wa jũna, kuma ga waɗanda zukãtansu suka tsarkake daga Allah.",
      spiritualLesson:
        "Dagewa ta hanyar tsawaita wahala, hade da ikhlasi, yana kawo taimakon Allah.",
    },
    hadith: [
      {
        excerpt:
          "A ranar Khaibar Manzon Allah (SAW) ya ce: “Gobe zan ba da wannan tuta ga wani mutum mai son Allah da ManzonSa, kuma Allah da ManzonSa suke so, kuma ta hannunsa ne Allah Ya ba da nasara. Washegari ya kira Ali, wanda idonsa ya yi zafi; sai ya tofa albarkacin bakinsa a idonsa yana yi masa addu’a, Ali ya warke kamar bai taba jinya ba, aka ba shi tuta.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Yakin Mu'uta",
    summary: "Jumada al-Ula 8 AH - balaguron kan iyaka inda kwamandoji uku suka yi shahada.",
    body: [
      "Ma’ana da dalili: Annabi SAW ya aika da manzo zuwa yankin arewa masu alaka da Rumawa, kuma aka kashe manzon – babban kuskure, tun da dokar al’ummomi ta kare wakilai. Dangane da martani ya aika dakaru kusan 3,000 zuwa Mu'tah, kusa da iyakar Romawa a gabashin Urdun.",
      "Silsilar umarni: Kafin su tashi, Manzon Allah Sallallahu Alaihi Wasallama ya sanya sunayen magadan magaji – Zaid bn Harithah da zai jagoranci, idan kuma ya fadi, Ja’afar bn Abi Talib, idan kuma ya fadi, Abdullahi bn Rawahah – wani abu mai ban mamaki na hangen nesa da zai tabbatar da hukunci.",
      "Abin da ya faru: A Mu'tah Musulmai sun hadu da wani babban runduna na Rumawa da kabilun Larabawa masu kawance - majiyoyin sun yi maganar dubun-dubatar, kodayake alkaluman ba su da tabbas kuma mai yiwuwa an yi karin gishiri. Zaidu ya fadi, sai Ja’afar – wanda ake tunawa da rike tuta har hannayensa biyu suka yanke – sai Abdullahi bn Rawahah, kamar yadda Annabi SAW ya tsara.",
      'Janyewa: Da dukkan kwamandojin da aka nada su uku suka yi shahada, Sahabbai suka ba Khalid bn al-Walid, sabon Musulmi bayan Hudaibiyyah tuta. Ta hanyar jerin gwano da sake tura sojoji ya kori sojojin da ba su da yawa kuma ya dawo da su gida sosai - abin da Annabi SAW ya girmama, daga baya ya kira Khalid "takobin Allah a cikin takubban Allah." A Madina Annabi s.a.w ya yi kuka ga Zaidu, Ja\'afar, da Ibn Rawahah kuma ya ba da labarin shahadarsu kafin zuwan wani manzo.',
      "Darussa masu ɗorewa: sanya sunayen magada kafin haɗari - ci gaba da jagoranci - a zahiri ceton sojoji; kuma janyewar tarbiyyar da ke kare rayuka ba abin kunya ba ne sai dai hikima. Shahada a tafarkin Allah daraja ce, ba gazawar siyasa ba, kuma yakin ya kuma gabatar da musulmi ga kyautar Khalid, ba da jimawa ba ya koma ga hidimar imani gaba daya.",
    ],
    battleDetails: {
      location: "Mu'tah, gabas da Kogin Urdun",
      modernLocation: "Kusa da Karak, Jordan",
      hijriDate: "Jumada al-Ula 8 AH",
      muslimForces: "~ 3,000",
      opposingForces:
        "Byzantine da sojojin Larabawa masu kawance (ya fi girma; lambobi ba su da tabbas a tushen)",
      muslimCommander:
        "Sai Zaid bn Harithah, sai Ja'afar, sai Ibn Rawahah, sai Khalid bn al-Walid.",
      outcome: "Ficewar musulmi cikin tsari; shahada mai nauyi amma sojojin sun kiyaye",
      keyEvents: [
        "Manzon Allah SAW ya nada wasu kwamandoji guda uku a jere kafin tafiya.",
        "Duk ukun sun fadi a kan Mu'tah, kamar yadda aka annabta.",
        "Khalid bn al-Walid ne ya dauki kwamanda ya jagoranci rundunar zuwa tsira.",
        "Manzon Allah SAW ya yi kuka a Madina, kuma ya yi shelar shahidai kafin labari ya zo.",
      ],
      leadershipLesson: "Sunan magaji kafin hatsari ya afku - ci gaban jagoranci na ceton rayuka.",
      spiritualLesson:
        "Shahada a tafarkin Allah abin girmamawa ne; janyewar hikimar da ke ceton sojoji ba a ci nasara ba.",
    },
    appLinks: [{}],
  },
  {
    title: "Bude Makkah",
    summary: "Ramadan 8 AH - bude Makkah ba tare da jinni ba a karkashin afuwar gaba daya.",
    body: [
      "Maudu'i da sanadi: Yarjejeniyar Hudaibiyya ta kasance har zuwa lokacin da abokan Kuraishawa, Banu Bakr, suka afkawa abokan musulmi, Banu Khuza'ah - sun kashe wasu hatta a cikin harami - tare da Kuraishawa suna ba da makamai a boye. Wannan ya wargaza sulhu. Lokacin da Kuraishawa ta yunƙurin yin facin ta ya ci tura, hanyar Makkah a buɗe take.",
      "Abin da ya faru: Manzon Allah Sallallahu Alaihi Wasallama ya yi tattaki tare da sahabbai kusan 10,000, suna tafiya cikin sauri da asirce, ta yadda Kuraishawa ba su da lokacin shirya turjiya. Abu Sufyan tsohon kwamandan Kuraishawa ya fito ya karbi Musulunci a jajibirin shiga. Sojojin sun shiga Makkah daga bangarori da dama ba tare da wani yaki ba - ginshiki daya ne kawai ya fuskanci gajeriyar turjiya da makami; Annabi Sallallahu Alaihi Wasallama ya umurci kwamandojinsa da kada su yaqi sai da waxanda suka yaqe su.",
      "Afuwa: Wannan shine lokacin da ke bayyana cin nasara. Annabi SAW yana tsaye a dakin Ka'aba tare da garin da ya azabtar da shi, ya kaurace masa, ya kore shi a yanzu saboda rahamarsa, sai ya tambayi Kuraishawa abin da suke tsammani daga gare shi, sannan ya bayyana - yana mai karawa Annabi Yusuf ga 'yan'uwan da suka zalunce shi - \"Babu laifi a kanku a yau, ku tafi, lalle kun 'yantacce.\" An yi afuwa ga jama'a; kadan ne kawai aka barsu da wasu laifuka na musamman, har ma akasarin wadanda aka yafewa lokacin da suka zo wurinsa.",
      "Tsarkakewa: Sai Annabi ﷺ ya tsarkake Ka'aba daga gumakanta guda 360, yana mai karantawa, “Gaskiya ta zo, ƙarya ta ɓace” (k:17:81). Bilal bn Rabah, wanda ya taba azabtar da shi a matsayin bawa a wancan gari, ya hau saman Ka'aba ya kira adhan akan Makka. Suratun Nasr - \"Lokacin da nasarar Allah ta zo da cin nasara\" - ta nuna wannan budewar da taronta na shiga imani.",
      "Darussa masu jurewa: wannan yana cikin mafi girman nunin halayen annabci da aka nuna cikin iko. Girman girma cikin nasara ya sami zukata fiye da kowane hukunci. Manufar ko'ina ita ce jagora, ba fansa ba, kuma an yi iko don hidimar saƙon maimakon kai. Ana kiranta Fath Makkah - Budewa - ba kora ba.",
    ],
    battleDetails: {
      location: "Makkah",
      modernLocation: "Makkah, Saudi Arabia",
      hijriDate: "Ramadan 8 AH",
      muslimForces: "~10,000",
      opposingForces: "Kuraishawa (kusan sun mika wuya ba tare da fada ba)",
      muslimCommander: "Annabi Muhammad ﷺ",
      outcome: "Makka ta bude kusan ba a zubar da jini ba; an ayyana afuwar gaba ɗaya",
      keyEvents: [
        "Wannan sulhu ya barke ne a lokacin da Kuraishawa suka goyi bayan farmakin da aka kai wa abokan kawancen musulmi, wato Khuza’ah.",
        "Abu Sufyan ya musulunta kafin sojoji su shigo; An ayyana gidansa a matsayin wurin tsaro.",
        "Annabi SAW ya yi afuwa gaba daya: Babu laifi a kanku a yau - ku tafi, kuna da 'yanci.",
        "An tsarkake Ka'aba daga gumakanta; Bilal ya kira adhan daga samansa.",
        "Tsofaffin makiya sun musulunta da yawa.",
      ],
      leadershipLesson:
        "Girman girma a cikin nasara yana samun zukata dawwama fiye da tsoro ko ramuwa.",
      spiritualLesson:
        "Manufar ita ce jagora, ba fansa ba - an yi iko don hidimar saƙo, ba na kai ba.",
    },
    quran: [
      {
        excerpt:
          "Idan nasarar Allah ta zo, kuma da buwaya ta zo, kuma ka ga mutane suna shiga addinin Allah da yawa, sai ka yi tasbihi da godiya ga Ubangijinka, kuma ka nemi gafararSa. Lalle Shĩ, Ya kasance Mai karɓar tũba ne.",
      },
      {
        excerpt:
          'Ya ce: "Babu laifi a kanku a yau. Allah ya gafarta maka, kuma shi ne mafi rahamar masu rahama. - Fadin Annabi Yusuf da Annabi ﷺ ya yi wa Kuraishawa a ranar yaki.',
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Yakin Hunayn",
    summary:
      "Shawwal 8 AH - kwanton bauna bayan Makka; an gwada amincewa, sannan aka ba da nasara.",
    body: [
      "Maudu'i da sanadi: Bayan kwana biyu da bude Makkah, kabilun Hawazin da Thaqif masu karfin fada-a-ji sun taru don buge musulmi kafin sabon rinjayensu ya daidaita. Manzon Allah ﷺ ya fita da runduna masu yawan gaske - kimanin 12,000, ciki har da da yawa daga cikin wadanda suka musulunta a Makka na baya-bayan nan - rundunar musulmi mafi girma da ta taru har yanzu. A cikin girmansa, wasu daga cikin mutanen sun ji kwarin gwiwa da ba a san su ba, kuma an ba da rahoton cewa wani ya ce ba za a iya kayar da su ba saboda rashin adadi.",
      "Abin da ya faru: Makiya sun yi kwanton bauna a cikin kunkuntar kwarin Hunain. Yayin da musulmi ke saukowa a cikin rabin wayewar gari, sai guguwar kibau ta fado musu daga tudu, sai gadi ya karye. Firgita ya bazu kuma da yawa daga cikin manyan sojojin sun juya suka gudu - alkaluman da suka haifar da kwarin gwiwa a yanzu sun kai harin.",
      'Juyayin Juya: A cikin hargitsi Annabi ﷺ bai gudu ba. Ya matsa alfadarinsa gaba ga abokan gaba, yana kira da babbar murya, "Ni ne Annabi, wannan ba karya ba ne, ni dan Abd al-Muddalib ne." Wani jigon Muhajirun da Ansar - tare da Abbas yana kiran sahabbai da sunansa - suka taru a kansa. Sai musulmi suka sake kafawa, suka yi wa ‘yan kwanton bauna, suka fatattake su; An kwashe ganima da manyan ganima.',
      "Abin da ya biyo baya: Kamfen din ya ci gaba da mamaye Ta'if, wanda bai fadi lokaci daya ba. Bayan haka, lokacin da Hawazin suka zo suna neman mutanensu, sai Annabi SAW ya mayar da fursunoni - ya zabi sulhu da tausasawar zukata akan ganimar ganima, kuma yana fifita sabbin musulunta na Makka don daure su da imani.",
      "Kur’ani ya yi magana kan wannan rana kai tsaye, yana mai bayyana hadarin dogaro da lambobi: “Kuma a ranar Hunaini, a lokacin da yawan ku ya faranta muku rai amma ba su wadatar muku da komai ba... sai Allah Ya saukar da natsuwarSa” (9:25-26). Darasi mai ɗorewa a bayyane yake - kar a dogara ga lambobi, dukiya, ko nasarar kwanan nan; nasara baiwar Allah ce kadai - kuma tagwayen dabi'un shugaba mai tsayin daka da bayyane lokacin da mabiyansa suka firgita.",
    ],
    battleDetails: {
      location: "Kwarin Hunain, tsakanin Makkah da Ta'if",
      modernLocation: "Kusa da Ta'if, Saudi Arabia",
      hijriDate: "Shawwal 8 AH",
      muslimForces: "~ 12,000 (ciki har da sabbin tubabbun Makkan da yawa)",
      opposingForces: "Hawazin and Thaqif",
      muslimCommander: "Annabi Muhammad ﷺ",
      outcome: "Nasarar musulmi bayan tashin farko",
      keyEvents: [
        "Mafi yawan sojojin musulmi har yanzu sun sami amincewa da adadinsu kafin yaƙin.",
        "Wani kwanton bauna a cikin kwarin ya tarwatsa masu gadin tare da haifar da firgici.",
        "Annabi ﷺ ya tsaya kyam ya kira muminai da baya; wani core ya taru a kusa dashi.",
        "Musulmi suka sake kafa makiya, suka fatattake su; kewaye Ta'if ya biyo baya.",
        "Daga baya an mayar da wadanda aka kama a matsayin wata alamar sulhu.",
      ],
      leadershipLesson:
        "Dole ne jagora ya kasance a bayyane kuma ya tsaya lokacin da masu bi suka firgita - kasancewar ya haɗu da matsayi.",
      spiritualLesson:
        "Kar a taɓa dogara ga lambobi ko nasarar kwanan nan; nasara da natsuwa daga Allah kadai suke.",
    },
    quran: [
      {
        excerpt:
          "Kuma lalle ne, haƙĩƙa, Allah Yã taimake ku a cikin yankuna da yawa, kuma a Rãnar Hunaini, a lõkacin da yawanku ya bã ku sha'awa, kuma bã ya wadãtar muku da kõme, kuma ƙasa ta rufe muku dukan faɗuwarta, kuma kuka jũya bãya. Sai Allah Ya saukar da natsuwarSa ga ManzonSa da kuma a kan Muminai.",
      },
    ],
    hadith: [
      {
        excerpt:
          "An tambayi Al Bara bn Azib ko sun gudu ne a ranar Hunaini? Sai ya ce: Amma Manzon Allah SAW bai gudu ba. Sai mutane suka juya baya, Annabi ﷺ yana kan farin alfadarinsa, yana cewa: Ni ne Annabi, wannan ba qarya ba ne; Ni dan Abd al-Muddalib ne.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ziyarar Tabuka",
    summary: "Rajab 9 AH - tafiya mafi tsanani, a lokacin rani, gwada imani ba tare da yaki ba.",
    body: [
      'Maudu\'i da sanadi: Rahotanni sun iso birnin Madina na wani gagarumin gangamin Rumawa a kan iyakar arewa. Manzon Allah SAW ya yi kira da a yi gangamin zuwa Tabuka - kuma ba a saba ba, ya bayyana inda aka nufa a fili maimakon a boye shi, domin tafiyar zai yi tsayi da wahala ta yadda kowa zai yi shiri da gaskiya. Ya fadi a cikin zafi mai zafi na lokacin rani, a lokacin girbi, lokacin da tafiye-tafiye da kashewa suka kasance mafi nauyi - an san shi da "fitowar wahala."',
      "Gwajin sadaukarwa: Kiran ya barke zukatan al'umma. Uthman ya samar da dimbin runduna daga dukiyarsa; Abubakar ya ba da duk abin da ya mallaka; Umar ya bada rabinsa. Sahabbai mafi talauci waɗanda ba su da abin da za su ba da su sun yi kuka saboda sun kasa shiga - Kur'ani ya rubuta hawayensu (9:92). Munafukai sun tsaya a kansu, waxanda suka qirqiro uzuri na zama a bayansu, kuma suratu at-Tawbah ta fallasa tsawon lokaci.",
      "Abin da ya faru: Sojojin - mafi girma da Annabi ﷺ ya jagoranta, watakila 30,000 - sun isa Tabuka bayan wani tattaki mai tsanani. Babu wani ƙarfin Byzantine da ya bayyana da ya ba da yaƙi. Maimakon a samu sakamako mara kyau, balaguron ya kulla yarjejeniya da kabilun da ke kan iyaka da sarakunan arewa, ya kara wa al'umma tsaro, da kuma nuna shiri wanda shi kansa ya hana ta'addanci.",
      "Su ukun da suka zauna a baya: Daga cikin waxanda suka rage akwai muminai uku na qwarai – Ka’ab xan Malik, da Hilal xan Umayyah, da Murarah xan Rabi’ – waxanda ba su da wani uzuri ingantacce, kuma, mahimmi, ya qi yin qarya a kai. An kaurace musu kwanaki hamsin, duniya ta “fadi” ta rufe su, har sai da aka karbi tubarsu, kuma Alkur’ani ya yi shelar gafararsu (9:118). Gaskiyar su a karkashin shari'a na daya daga cikin abubuwan da suka fi daukar hankali a cikin seerah.",
      "Darussa masu dorewa: shirye-shiryen kare al'umma shi kansa aikin imani ne ko da ba a zare takobi ba; sadaukarwa ba tare da gaggawa ba, lada na bayyane yana cikin mafi girman jarabawa; da kuma gaskiya -Kin Ka'ab ya ceci kansa da karya - ya fi soyuwa a wurin Allah fiye da karya mai dadi. Suratu at-Tawbah ta tsara dukkan balaguro da ke kewaye da waɗannan jigogi.",
    ],
    battleDetails: {
      location: "Tabuk, akan hanyar zuwa iyakar Byzantine",
      modernLocation: "Tabuk, Saudi Arabia",
      hijriDate: "Rajab 9 AH",
      muslimForces: "~ 30,000 (mafi girman rundunan da Annabi SAW ya jagoranta)",
      opposingForces: "An ba da rahoton wata rundunar ta Byzantine amma ba ta bayyana don yaƙi ba",
      muslimCommander: "Annabi Muhammad ﷺ",
      weather: "Tsananin zafi mai zafi, a lokacin girbi",
      outcome: "Babu yaƙi; kulla yarjejeniyar arewa; al'umma sun gwada da tacewa",
      keyEvents: [
        "Manzon Allah Sallallahu Alaihi Wasallama ya bayyana maqoqinsa mai nisa a fili saboda wahalar tafiyar.",
        "Uthman, Abubakar, Umar, da sauransu sun yi kyauta; Talakawa sun yi kuka don ba su da abin bayarwa.",
        "Munafukai sun ba da uzuri don tsayawa a baya kuma an fallasa su a cikin suratu at-Tawbah.",
        "Babu maƙiyi tsunduma; An kulla yarjejeniya da kabilun arewa da sarakuna.",
        "An kaurace wa muminai masu gaskiya guda uku kwanaki 50 har sai da aka karbi tubarsu (Alkur'ani 9:118).",
      ],
      leadershipLesson:
        "Ku kasance masu gaskiya game da wahala da tsadar sa; nuna gaskiya yana gina amana kuma yana karanta masu yarda.",
      spiritualLesson:
        "Hadaya ba tare da lada na bayyane ba, da gaskiya a ƙarƙashin gwaji, suna cikin mafi girman gwajin bangaskiya.",
    },
    quran: [
      {
        excerpt:
          'Wadanda suka saura sun yi murna da zamansu a bayan Manzon Allah, kuma ba su son yin jihadi da dukiyoyinsu da rayukansu a tafarkin Allah, kuma suka ce: “Kada ku fita a cikin zafin rana. Ka ce: "Wutar Jahannama ce mafi tsananin zafi, dã sun kasance suna hankalta."',
      },
      {
        excerpt:
          "Kuma Ya gãfarta wa ukun nan waɗanda aka bari, har ƙasã mai girmanta, Ya rufe a kansu, kuma rãyukansu suka rufe a kansu, kuma suka tabbata bãbu wani tsari daga Allah fãce a gare Shi. Sa'an nan kuma Ya karɓi tũba a kansu, tsammãninsu, zã su tuba.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ka'ab bn Malik ya ruwaito yadda ya tsaya daga Tabuka ba tare da uzuri ba, kuma ba zai yi karya ba; Annabi SAW ya umurci muminai da kada su yi magana da shi da sahabbansa guda biyu har tsawon darare hamsin, har sai kasa ta zama ƙunci a gare su - sai aka saukar da gafarar su, kuma yana cikin mafi farin ciki a cikin kwanakin rayuwarsa.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ghazawat and Saraya",
    summary: "Bambanci tsakanin manyan kamfen da ƙananan ƙungiyoyi.",
    body: [
      "Gazwah wata balaguro ce da Manzon Allah Sallallahu Alaihi Wasallama ya halarta a cikinta - malamai sun kirga kusan ashirin da bakwai, wadanda suka hada da Badar, Uhud, Rarara, Hudaibiyyah, Khaibar, Yakin Makkah, Hunain, da Tabuka.",
      "Sariyyah (jam'i saraya) ƙungiya ce da aka aika ƙarƙashin wani kwamanda mai suna ba tare da Annabi ﷺ ya shiga ba - ana rubuta irin waɗannan ayyuka kusan hamsin, don bincike, amsa hari, rakiya, ko gayyatar qabilu zuwa Musulunci.",
      "Yawancin saraya ba su shiga fada ba kwata-kwata - sun kasance diflomasiyya, sintiri, ko nuna karfi wanda ya sa fada bai zama dole ba. Wasu kuma kamar balaguron zuwa Mu'utah, sun yi mugunyar fada da asara mai yawa.",
      "Fahimtar wannan rarrabuwar kawuna yana kiyaye wuce gona da iri na yawan ‘yakokin’ a farkon Musulunci. A cikin kusan shekaru goma, ainihin fadace-fadacen da aka yi ba su da yawa; yawancin zanga-zangar sun kasance na rigakafi, na diflomasiyya, ko marasa jini, kuma kafofin suna auna duk lokacin annabci a matsayin haske mai ban mamaki a cikin asarar rayuka don zamaninsa.",
    ],
    actions: [
      "Bincika tsarin lokaci don ganin waɗanne abubuwa ne aka yi faɗa, waɗanda suka kasance kewaye, kuma waɗanda aka yi maci ba tare da faɗa ba.",
      "Karanta shigarwar ƙamus na ghazwah da sariyyah don kiyaye nau'ikan a sarari.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yaki bayan Annabi SAW",
    summary: "Manyan ayyuka a ƙarƙashin Halifofi Shiryayyu - dabam da zamanin annabci.",
    body: [
      "Bayan wafatin Manzon Allah SAW a shekara ta 11 bayan hijira (632 miladiyya) al’ummar ta kasance karkashin jagorancin Khalifofi Abubakar da Umar da Usman da Ali (Allah Ya yarda da su) ta yakin Ridda (ridda) da yaduwa zuwa Farisa Sasaniyya da Sham ta Rumawa, kuma daga karshe fitina ta cikin gida.",
      "Wadannan al’amura na cikin tarihin Musulunci ne, amma ba Sunna ba ne kamar yadda ayyukan Annabi suke. Kamata ya yi a yi nazari da su da kayan aikin tarihi da sanin cewa su kansu malaman Musulunci suna tafka muhawara kan bayanansu da dalilansu da darussa.",
      "Yakin al-Qadisiyyah (a shekara ta 636 miladiyya): Sa’ad bn Abi Waqqas ya jagoranci dakarun musulmi a kan sojojin Sasaniya a Iraki – wani juyi da ya bude Farisa.",
      "Yakin Yarmouk (636 CE): kwamandoji ciki har da Khalid bn al-Walid sun gana da Rumawa a Sham a wani gagarumin yakin da ya kawo karshen babban filin Rumawa a Levant - ya yi karatu a matsayin tarihin soja, ba a matsayin sunna na annabci ba.",
      "Yaƙin Nahavand (a. 642 CE): an tuna da shi a cikin larabci a matsayin 'Nasara na Nasara,' ya karya sauran juriyar Sasaniya. Kwanaki da alkaluman sojoji sun bambanta tsakanin masana tarihi.",
    ],
    actions: [
      "Yi nazarin fadace-fadacen annabci da farko - su ne ainihin ma'anar ɗabi'a da ta shari'a.",
      "Ku kusanci cin nasara na baya tare da nuance; ba ya ɗaukaka yaƙi ko kuma karkata wani hadadden tarihi zuwa taken taken.",
    ],
    disclaimer:
      "Lambobi, dalilai, da kimanta ɗabi'a na cin nasara bayan annabci ana muhawara a tsakanin masana tarihi. Wannan bayyani don daidaitawa ne, ba polemic ba.",
  },
  {
    title: "Darussan jagoranci",
    summary: "Hakuri, shura, rahama, da dogaro ga Allah - ba dabara kawai ba.",
    body: [
      "Misalin annabci na jagoranci a cikin rikici ya sanya hali sama da wayo. An dauki manyan yanke shawara ta hanyar tuntuba (shura) - rijiyoyin Badr, ramuka a yakin Confederate, sharuddan Hudaibiyyah - ko da daga baya wahayi zai tabbatar da sakamakon. Shugabanci ya saurari kafin ya yi aiki.",
      "Hakuri ya siffata baka na kowace nasara. Amincin da Hudaibiyya ya yi, ya kai ga buda Makka cikin shekaru biyu. Rahama a Makkah - \"Ku tafi, kuna da 'yanci\" - ya sami nasara a kan mutanen da suka tsananta wa al'umma. Daci da tarbiyyar da aka koya a Uhudu ya hana sake aukuwar wannan bala’i.",
      "An nuna ƙarfin hali kamar yadda aka nuna a kan takobi: tsayuwar daka da bayyane lokacin da sojojin suka gudu a Hunain; ɗauke da ƙasa a cikin rami tare da masu haƙa; kuma - mafi wuya duka - gafartawa a cikin sa'ar ikon duka waɗanda suka taɓa kore ku daga gidanku.",
      "Tawakkali ga Allah (tawakkul) bai taba nufin sakaci da hanyoyin ba. An aika da ’yan leƙen asiri, aka zaɓi ƙasa, aka sa sulke, aka haƙa ramuka, aka ba da sunayen magaji, an girmama yarjejeniyoyin. Muminai sun yi duk abin da ke cikin ikonsu, sa'an nan kuma suka danƙa sakamako ga Allah - cewa haɗin kai na cikakken ƙoƙari da cikakken tawakkali shine zuciyar abin koyi.",
    ],
    actions: [
      "Kafin yanke shawara mai tsauri, tambaya: Shin da gaske na yi shawara da masu ilimi?",
      "Bayan nasara, tambaya: Ina jinƙai, ko kuma ya koma ga girman kai?",
      "A cikin koma baya, tambaya: shin akwai rashin biyayyar gyara, ko darasin da Allah ya nufa na koya?",
    ],
    appLinks: [{}],
  },
  {
    title: "Hadisi ingantacce akan yaqoqa",
    summary:
      "Nassosi da aka zaɓa tare da ƙididdigewa - kan ɗabi'a, haƙuri, da mahimman abubuwan da suka faru.",
    body: [
      "Dole ne a duba ingantaccen hadisin balaguro kafin a dogara da shi. An ciro ruwayoyin da ke kasa ne daga tarin Sahih kuma sun shafi halaye da ruhin wadannan yakin; kowanne yana dauke da darajarsa.",
      "Don ruwayoyin da ke da alaƙa da ƙayyadaddun alkawari, duba batun yaƙin. Yi amfani da burauzar hadisi na Munib don karanta cikakken sarƙoƙi da grading a mahallin.",
    ],
    hadith: [
      {
        excerpt:
          "Kada ku yi nufin haduwa da abokan gaba, kuma ku roki Allah lafiya. To, idan kun haɗu da su, ku yi haƙuri, kuma ku sani Aljanna tana ƙarƙashin inuwar takubba.",
      },
      {
        excerpt:
          "Annabi SAW yace: Yaki yaudara ne. - Malamai sun bayyana wannan a matsayin izini don dabarar dabara a cikin yaƙi (feints, mamaki, karkatacciyar hanya), ba kamar lasisin karya yarjejeniya ko cin amanar wata ƙungiya mai kariya ba.",
      },
      {
        excerpt:
          "Lokacin nada kwamanda Annabi ﷺ ya umarce shi da ya ji tsoron Allah, da kiran makiya zuwa ga Musulunci kafin yaqi, kada ya warware alkawari, kada ya yanke jiki, kuma kada ya kashe yaro.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Nassoshi da tushe",
    summary: "Classical seerah tana aiki da yadda ake karanta su sosai.",
    body: [
      "Tushen seerah na farko sun haɗa da Sirah na Ibn Ishaq (wanda aka kiyaye ta Ibn Hisham), Kitab al-Magazi na al-Waqidi, Tabaqat Ibn Sa'ad, da Ibn Kathir al-Bidayah wan-Nihayah. Kowannensu yana da karfinsa da fa'idarsa na ilimi.",
      "Ibn Ishaq (ta Ibn Hisham) shine riwaya ta asali; al-Waqidi ya ba da cikakkun bayanai na yaƙi amma wasu daga cikin rahotanninsa masu sukar hadisi sun yi sabani a kansu; Ibn Kathir ya hada tarihi tare da sukar hadisi kuma yana taka tsantsan wajen tantancewa.",
      "Nassosin Alkur'ani kan wadannan abubuwan da suka faru su ne nassosin da suka fi kowa iko. Don tambayoyi na ɗabi'a, shari'a, da ɗa'a, hadisin sahihin Bukhari da Musulmi sun riga sun rigaya akan rahotannin seerah da ba a tabbatar da su ba.",
      "Inda masana tarihi suka bambanta - akan ainihin adadin sojojin, wasu ranaku, da kimanta halin ɗabi'a na wasu kamfen na bayan annabci - wannan tsarin yana lura da rashin tabbas maimakon ƙirƙira daidai. Duk hadisin da aka kawo a nan an duba shi da tarin adadinsa da darajarsa.",
    ],
    actions: [
      "Bincika duk wani bayani dalla-dalla game da Kur'ani da farko, sannan hadisin sahihi, sannan seerah.",
      "Ga kowace tambaya ta fatawa ko aikace-aikace na zamani, tuntuɓi ƙwararrun malamai - wannan tsarin ilimi ne, ba hukunci ba.",
    ],
    appLinks: [{}, {}],
  },
];

export const BATTLES_VERSES_HA: DeepPartial<BattlesVerse>[] = [
  {
    excerpt:
      "An yi izni ga waɗanda suka yi yãƙi, sabõda zãlunci a kansu… Kuma dã Allah bai duba wata jama'a da wata ƙungiya ba, dã an rurrushe gidãje, majami'u, majami'u, da masallatai.",
    context:
      "Izinin gama gari na farko na yaƙi - bayan shekaru na zalunci ba tare da makami ba a Makka.",
  },
  {
    excerpt:
      "Ku yãƙi waɗanda suke yãƙe ku a cikin hanyar Allah, kuma kada ku ƙetare haddi. Lalle ne, Allah bã Ya son azzalumai.",
    context: "Iyakar tushe: tsaro kawai, tare da tsauraran haramcin wuce gona da iri.",
  },
  {
    excerpt:
      "A lokacin da ka nemi taimako daga Ubangijinka, sai Ya ce: “Zan karfafa ka da mala’iku dubu, darajoji.",
    context: "Ya bayyana game da Badar - taimakon Allah ga waɗanda suka fi yawa.",
  },
  {
    excerpt:
      "Lalle ne, haƙĩƙa, ãyã tã kasance a gare ku a cikin jama'a biyu waɗanda suka haɗu, ɗayan yana yãƙi a cikin hanyar Allah, kuma ɗayan kãfirai, sunã ganinsu ninki biyu, da idãnunsu.",
    context: "Allah ya sa musulmi sun fi girma ga abokan gaba a Badar, yana karfafa zukata.",
  },
  {
    excerpt:
      "Kuma lalle ne, haƙĩƙa, Allah Yã yi muku gaskiya a lõkacin da kuke kashe su da izninSa, har sai kun yi ƙarfin hali, kuma kuka yi jãyayya a cikin al'amarin, kuma kuka sãɓã a bãyan Ya nũna muku abin da kuke so.",
    context: "Yana magance rashin biyayyar maharba da jujjuyawar Uhudu.",
  },
  {
    excerpt:
      "Ya ku wadanda suka yi imani ku tuna ni'imar Allah a kanku a lokacin da runduna ta zo muku, kuma Muka aika wata iska da rundunonin da ba ku gani ba a kansu.",
    context: "Suratul Ahzab akan kawayen hadin gwiwa da taimakon Ubangiji.",
  },
  {
    excerpt:
      "Kuma Ya saukar da waɗanda suka taimake su daga Mutãnen Littãfi daga birãnensu, kuma Ya jẽfa tsõro a cikin zukãtansu, wata ƙungiya kuka kashe, da wata ƙungiya da kuka kãma. Kuma Ya gãdar da ku ƙasarsu da gidãjensu.",
    context:
      "Suratul Ahzab a kan Banu Qurayzah, wanda ya warware alkawari a lokacin da aka yi wa kawanya - wani yanki mai iyaka na ha'inci na lokacin yaki, ba hukunci a kan imani ba.",
  },
  {
    excerpt:
      "Lalle ne Mu, Mun ba ku babban rabo bayyananne, domin Allah Ya gafarta muku abin da ya gabace na zunubinku da abin da zai biyo baya, kuma Ya cika ni'imarSa a kanku, kuma Ya shiryar da ku zuwa ga hanya madaidaiciya.",
    context:
      "Ya bayyana a dawo daga Hudaibiyyah - suna a matsayin nasara bayyananne abin da sahabbai suka fara ji a matsayin sulhu mai zafi.",
  },
  {
    excerpt:
      "Lalle ne, Allah Yã yarda da mũminai a lõkacin da suka yi maka mubaya'a a ƙarƙashin itãciya, kuma Ya san abin da ke cikin zukãtansu, sabõda haka Ya saukar da natsuwa a kansu, kuma Ya saka musu da wani yãƙi kusa.",
    context:
      "Alkawarin Ridwan - Sahabbai kusan 1,400 ne suka yi alkawari a karkashin itacen karamar hukuma ba za su gudu ba, kuma Allah Ya yarda da su.",
  },
  {
    excerpt:
      "Idan nasarar Allah ta zo, kuma da buwaya ta zo, kuma ka ga mutane suna shiga addinin Allah da yawa, sai ka yi tasbihi da godiya ga Ubangijinka, kuma ka nemi gafararSa. Lalle Shĩ, Ya kasance Mai karɓar tũba ne.",
    context:
      "Suratul Nasr a kan buda Makkah - bugu ba tare da cin nasara ba face da godiya, da neman gafara, da dimbin jama'a masu shiga imani.",
  },
  {
    excerpt:
      "Allah ya riga ya ba ku nasara a yankuna da dama... Sai Allah Ya saukar da natsuwarSa ga ManzonSa da kuma a kan muminai.",
    context:
      "Allah yana tunatar da muminai cewa nasara ita ce baiwarSa, ba sakamakon alfahari da adadi ba.",
  },
  {
    excerpt:
      "Wadanda suka saura sun yi murna da zamansu a bayan Manzon Allah, kuma ba su son yin jihadi da dukiyoyinsu da rayukansu a tafarkin Allah.",
    context: "Suratul Tawbah tana magana ne ga waɗanda suka ba da uzurin tafiya Tabuka mai wahala.",
  },
];

export const BATTLES_TIMELINE_HA: DeepPartial<BattlesTimelineEvent>[] = [
  {
    title: "Wahayi na farko",
    body: "Annabi ﷺ yana karbar ayoyin farko na surar Al'aq a cikin kogon Hira. Shekaru da yawa kiran yana zaman lafiya - babu izinin yin yaƙi.",
    location: "Makkah",
  },
  {
    title: "Kiran jama'a da zalunci",
    body: "Budaddiyar wa'azi tana kawo azabtarwa, kauracewa, da shahada. Musulmai suna jurewa ba tare da ramuwar gayya ba - hakuri da ƙaura sune martanin da aka koyar.",
    location: "Makkah",
  },
  {
    title: "Hijira zuwa Madina",
    body: "Al'ummar Musulmi sun kafa siyasa a Yathrib (Madina). Yarjejeniyoyin da aka yi da qabilun Yahudawa da Kundin Tsarin Mulkin Madina sun kafa dokoki na zaman tare.",
    location: "Madinah",
  },
  {
    title: "Yakin Badar",
    body: "A ranar 17 ga watan Ramadan, kusan musulmi 313 sun yi galaba a kan wata babbar runduna ta Kuraishawa - babban yaki na farko da gagarumin nasara ta ɗabi'a.",
    location: "Badar",
  },
  {
    title: "Yakin Uhudu",
    body: "Da farko Musulmai sun sami nasara, amma maharba sun bar mukaminsu yana haifar da koma baya mai raɗaɗi. Alkur'ani ya yi bayani kan darussan wannan rana.",
    location: "Dutsen Uhud",
  },
  {
    title: "Yaƙin Ramin",
    body: "Sojojin hadaka sun yiwa Madina kawanya. Yin tonon rami - Shawarar Salman - ya karya kewaye ba tare da wani fada ba.",
    location: "Madinah",
  },
  {
    title: "Banu Quraizah",
    body: "Bayan sun karya alkawarin da aka yi a Madina a lokacin da aka kai hari, Banu Qurayzah sun mika wuya, suka ce a yanke musu hukunci a hannun wani mai sulhu da suka zaba, wato Sa’ad bn Mu’az.",
    location: "Madinah",
  },
  {
    title: "Yarjejeniyar Hudaibiyyah",
    body: "Tsawon shekaru goma da aka yi kamar an samu rangwame, ya zama nasara a faxin Alqur’ani mai girma – Wa’adin Ridwan an yi shi a qarqashin bishiyar, aka watsu, aka buxe hanyar Makkah.",
    location: "Hudaibiyyah",
  },
  {
    title: "Yakin Mu'uta",
    body: "Balaguro zuwa iyakar Romawa; wadannan kwamandojin ukun da aka nada sun yi shahada a jere kafin Khalid bn al-Walid ya janye rundunar lafiya.",
    location: "Mu'tah",
  },
  {
    title: "Ziyarar Khaybar",
    body: "Garuruwan yahudawa da ke arewacin Madina sun yi galaba a kansu. An bai wa Ali bin Abi Talib tuta bayan an yi wa Abubakar da Umar shari’a.",
    location: "Khaibar",
  },
  {
    title: "Bude Makkah",
    body: "Kuraishawa sun karya yarjejeniya; Manzon Allah SAW ya yi tattaki tare da sahabbai dubu goma suka shiga Makka kusan ba tare da zubar da jini ba - an yi afuwar gaba daya.",
    location: "Makkah",
  },
  {
    title: "Yakin Hunayn",
    body: "Hawazin da Thaqif sun yi wa musulmi kwanton bauna bayan Makka. Farkon firgici yana ba da hanyar samun nasara lokacin da Annabi SAW ya kira muminai su yi taruwa a kansa.",
    location: "Hunayn",
  },
  {
    title: "Ziyarar Tabuka",
    body: "Tafiyar bazara mai wahala zuwa iyakar Romawa. Babu yaki, amma munafunci ya bayyana kuma suratu at-Tawbah ta yi magana ga wadanda suka zauna a baya.",
    location: "Tabuk",
  },
  {
    title: "Hajjin bankwana",
    body: "Annabi SAW yana aikin Hajji kuma yana gabatar da hudubar bankwana. Ya rasu a Madina ba da jimawa ba - zamanin yakin annabci ya kare.",
    location: "Makkah",
  },
];

export const BATTLES_FIGURES_HA: DeepPartial<BattlesFigure>[] = [
  {
    name: "Abu Bakr al-Siddiq",
    epithet: "Allah Ya kara masa yarda",
    summary: "Mafi kusancin Annabi, Mumini na farko baligi, da sahabinsa a Hijira.",
    role: "Mai ba da shawara, mayaƙi, da ma'auni a cikin yakin farko.",
    lesson:
      "Tsayayyar aminci da gaskiya a cikin matsin lamba - ya kashe dukiyarsa don yantar da musulmin da ake zalunta kafin wata nasara.",
  },
  {
    name: "Umar ibn al-Khattab",
    epithet: "Allah Ya kara masa yarda",
    summary: "Ya shiga musulunci a shekarun zalunci kuma ya zama daya daga cikin masu kare imani.",
    role: "Mai gwagwarmaya kuma daga baya mai tsara adalci a matsayin Halifa na biyu.",
    lesson:
      "Jajircewa tare da hisabi - ya karɓi nasiha a bainar jama'a lokacin da ra'ayinsa ya bambanta da na Annabi a Hudaibiyya.",
  },
  {
    name: "Ali bin Abi Talib",
    epithet: "Allah Ya kara masa yarda",
    summary: "Kani kuma surukin Annabi ﷺ; cikin yara na farko da suka karbi Musulunci.",
    role: "Champion a cikin gwagwarmaya guda kuma mai ɗaukar banner a Khaybar.",
    lesson:
      "Jajircewa da kaskantar da kai - ya kwana a gadon Annabi a daren Hijira, yana kasadar ransa domin aikin ya ci gaba.",
  },
  {
    name: "Hamza bn Abdil-Muddalib",
    epithet: "Allah Ya kara masa yarda",
    summary: "Kawun Manzon Allah, wanda aka fi sani da Asadullah (Zakin Allah) bayan ya musulunta.",
    role: "Fitaccen jarumi kuma shugaban tarbiya a Badar da Uhudu.",
    lesson:
      "Shahada ba cin nasara ba ce - mutuwarsa a Uhudu ya ba wa Annabi baƙin ciki sosai amma ya ƙarfafa ƙudurin kammala aikin.",
  },
  {
    name: "Khalid bin Walid",
    epithet: "Allah Ya kara masa yarda",
    summary:
      "hazikin Janar na kuraishawa wanda ya karbi Musulunci bayan Hudaibiyya ya zama Saifullah (Takobin Allah).",
    role: "Ya jagoranci sojojin dawakai da ke gefe a kan musulmi a Uhudu kafin musuluncinsa; daga baya ya zama kwamanda a Mu'tah kuma ya jajirce a yakin khalifanci.",
    lesson:
      "Adawar da ta gabata ba ta zama hanyar tuba ta gaskiya ba – fasahar da ta bugi musulmi a Uhudu ita ce, da zarar imani ya shiga zuciyarsa, ya karkata gaba daya zuwa tafarkin Allah.",
  },
  {
    name: "Sa'ad bin Abi Waqqas",
    epithet: "Allah Ya kara masa yarda",
    summary: "Daya daga cikin goman da aka yi alkawarin Aljanna; mashahurin maharba na al'umma.",
    role: "Maharba a Uhudu; daga baya ya jagoranci sojojin musulmi a al-Qadisiyyah karkashin halifa Umar.",
    lesson:
      "Ladabi a matsayin mutum - maharba ya ayyana hidimarsa; daga baya ya aiwatar da wannan daidaiton zuwa jagorancin al'umma.",
  },
  {
    name: "Salman al-Farisi",
    epithet: "Allah Ya kara masa yarda",
    summary:
      "Wani mai nema daga Farisa wanda ya shiga cikin musulmi a Madina bayan doguwar tafiya ta ruhi.",
    role: "Shawarar tono mahara - a Farisa dabara wanda ba a sani ba ga Larabawa.",
    lesson:
      "Hikima na iya fitowa daga kowane fanni - shura na nufin gwanintar ji a duk inda Allah ya sanya ta.",
  },
  {
    name: "Zaid bin Harithah",
    epithet: "Allah Ya kara masa yarda",
    summary:
      "Mutumin da Manzon Allah Sallallahu Alaihi Wasallama ya ‘yanta kuma abin so, kuma kwamanda na farko da aka nada a kan rundunar musulmi.",
    role: "Ya jagoranci tattaki zuwa Mu'uta; ya yi shahada a can a matsayin na farko daga cikin manyan kwamandojin nan uku da suka fadi.",
    lesson:
      "Daraja fiye da zuri'a - an zaɓe shi ya jagoranci lokacin da mazaje mafi girma na ƙabila suka halarta.",
  },
  {
    name: "Sa'ad bin Mu'az",
    epithet: "Allah Ya kara masa yarda",
    summary: "Shugaban Aws na Madina, daya daga cikin manya-manyan Ansar kuma mafi daraja.",
    role: "An raunata a Ramin; Banu Quraizah ya zaba a matsayin wanda zai yanke hukunci akan makomarsu.",
    lesson:
      "Adalci ta hanyar alkali da aka amince da shi - ko da abokin gaba da aka ci nasara an ba shi damar yin sulhu mara son kai maimakon daukar fansa da ba a kula ba; ya mutu sakamakon raunin da ya samu jim kadan bayan haka.",
  },
];

export const BATTLES_LESSON_CARDS_HA: DeepPartial<BattlesLessonCard>[] = [
  {
    battleTitle: "Yakin Badar",
    lesson: "Dogara ga Allah yayin shiri sosai.",
    detail:
      "An fi su kusan uku zuwa ɗaya, Musulmi har yanzu sun zaɓi ƙasarsu a rijiyoyi, suka tsara darajoji, kuma suka yi addu'a - Annabi ﷺ yana roƙon Allah cikin dare har alkyabbarsa ta faɗi. Ƙoƙari da tawakkali tare, kuma nasara ta tabbata ga Allah.",
  },
  {
    battleTitle: "Yakin Uhudu",
    lesson: "Biyayya ga umarni yana kare al'umma.",
    detail:
      "Maharba da suka bar wurinsu suna neman ganima sun buɗe wani gefen da ya kusan halaka sojojin. Kur'ani ya rubuta wannan a matsayin darasi ga kowane zamani game da horo.",
  },
  {
    battleTitle: "Yaƙin Ramin",
    lesson: "Tsare-tsare da shawarwari suna haɓaka ƙarfi.",
    detail:
      "Tunanin ramukan Salman, hade da shura na Annabi da aikin muminai, ya kawar da kawancen da ya fi na masu karewa.",
  },
  {
    battleTitle: "Yarjejeniyar Hudaibiyyah",
    lesson: "Haƙuri na iya zama nasara mafi gaskiya.",
    detail:
      "Sahabbai sun ji sulhu a matsayin wulakanci, sai Umar ya tambaye ta a fili; Suratul Fath ya amsa da kiranta da nasara bayyananna. Zaman lafiya na shekaru goma ya bude hanyoyi, Musulunci ya bazu cikin sauri fiye da kowane lokaci, kuma cikin shekaru biyu hanyar Makkah a bude take.",
  },
  {
    battleTitle: "Banu Quraizah",
    lesson: "Saba alkawari na kariya yana daga cikin manyan cin amana.",
    detail:
      "Banu Qurayzah ya yayyaga alƙawarin Madina a daidai lokacin da Ƙungiyoyin Ƙungiyoyin suka kewaye birnin. Duk da haka, Annabi ﷺ ya bari a yi musu hukunci da wani mai sulhu da su da kansu suka zaɓa - adalci ta hanyar alkali da aka yarda da shi, ba ramuwa da ba a tsare ba.",
  },
  {
    battleTitle: "Bude Makkah",
    lesson: "Jinƙai bayan nasara yana ɗaukaka mai nasara.",
    detail:
      'Da garin da ya azabtar da shi kuma ya kore shi a yanzu saboda rahamar sa, Annabi SAW ya nanata fadin Annabi Yusuf cewa: "Babu laifi a kanku a yau - ku tafi, kuna da \'yanci." Afuwa gabaɗaya ya maye gurbin fansa, kuma an sami nasara a zukata cewa babu wani hukunci da zai iya yin nasara.',
  },
  {
    battleTitle: "Yakin Hunayn",
    lesson: "Lambobi da nasarar kwanan nan ba su tabbatar da nasara ba.",
    detail:
      "Girman girman dakaru bayan Makkah ya haifar da firgici da farko. Muminai sun taru ne kawai a lokacin da suka koma ga Annabi SAW da Allah.",
  },
  {
    battleTitle: "Ziyarar Tabuka",
    lesson: "Hadaya cikin wahala tana fallasa bangaskiya ta gaskiya.",
    detail:
      "Tattakin ya gudana cikin zafi mai zafi a kan wani babban abokin gaba. Wadanda suka ba da dukiyarsu da wadanda suka yi tattaki duk da talauci an yaba musu iri daya.",
  },
  {
    battleTitle: "Yakin Mu'uta",
    lesson: "Dole ne a shirya maye gurbin jagoranci.",
    detail:
      "Annabi SAW ya nada kwamandoji guda uku a jere. Lokacin da dukan ukun suka fadi, Khalid ya sake tsara ja da baya - ceton sojojin shi kansa nasara ne.",
  },
];

export const BATTLES_GLOSSARY_HA: DeepPartial<BattlesGlossaryTerm>[] = [
  {
    term: "Ghazwah",
    definition:
      "A military expedition in which the Annabi ﷺ himself participated. Misali sun hada da Badar, Uhudu, da Tabuka.",
  },
  {
    term: "Sariyyah",
    definition:
      "Tawagar da aka aika karkashin wani kwamanda ba tare da Manzon Allah SAW ya shiga tattakin ba. Da yawa sun faru don bincike, diflomasiyya, ko mayar da martani ga farmaki.",
  },
  {
    term: "Muhajirun",
    definition:
      "Muhajirai da suka bar Makka zuwa Madina saboda Allah. Sun kafa jigon al'ummar musulmin farko tare da Ansaru.",
  },
  {
    term: "Ansar",
    definition:
      "Mataimaka – Musulman Madina wadanda suka karbi bakuncin Muhajirun, suka raba dukiyoyinsu, suka kuma kare garin a farkon shekarunsa.",
  },
  {
    term: "Shura",
    definition:
      "Tuntuɓar juna kafin manyan yanke shawara. Dabarar mahara da shirye-shiryen Uhud suna kwatanta shawara a cikin tsarin annabci.",
  },
  {
    term: "Bay'ah",
    definition:
      "Mubaya'a - biyayya ta siyasa da ta ruhaniya ga shugaba. The Pledges of al-Aqabah preceded the Hijra.",
  },
  {
    term: "Hijira",
    definition:
      "Hijira don Allah - daga Makka zuwa Madina a cikin mahallin annabci. Shekara ta 1 AH ta fara da wannan hijira.",
  },
  {
    term: "Ameer",
    definition:
      "Kwamanda ko shugaban da aka nada don sojoji ko balaguro. Annabi SAW ya nada shugabanni ga saraya kuma ya nada magada idan sun fadi.",
  },
  {
    term: "Raya",
    definition:
      "Ma'auni ko tuta da ke ɗauke da shugaban sojoji. Ɗaukar tutar Annabi alama ce ta daraja da nauyi.",
  },
  {
    term: "Liwa",
    definition:
      "Babban ma'aunin sojoji, wani lokacin ya bambanta da na rāyah na sirri. Jagorancin liwa ya nuna umarni akan babban runduna.",
  },
  {
    term: "Jihadi",
    definition:
      "Yin jihadi a tafarkin Allah - da farko gwagwarmayar rai, da kuma tsarinta na soja da aka kayyade, kariya da kawar da zalunci a lokacin da aka nada.",
  },
  {
    term: "Fi sabilillah",
    definition:
      "A tafarkin Allah - niyya da ke bambanta halaltacciyar gwagwarmaya da cin zarafi na kabilanci ko cin duniya.",
  },
  {
    term: "Aman",
    definition:
      "Tsaro ko halayen aminci da aka ba wa wakilai, 'yan kasuwa, ko waɗanda ba mayaƙa ba. keta haddi haramun ne a shari'ar musulunci ta yaki.",
  },
  {
    term: "Sulh",
    definition:
      "Zaman sulhu ko sulhu. Yarjejeniyar Hudaibiyyah ita ce babban misali na zabar zaman lafiya a lokacin da take amfanar da mafi girma.",
  },
  {
    term: "Fath",
    definition:
      "Budewa ko cin nasara - galibi ana amfani da su don buɗe Makkah (Fath Makkah) cikin lumana maimakon ƙawance mai ƙarfi.",
  },
];
