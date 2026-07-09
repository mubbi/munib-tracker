// Somali translation overlay for the Learn "Prophets" content. Mirrors the order of
// its English source in ../prophets*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { ProphetsTimelineEvent, ProphetsTopic } from "../../types/prophets";
import type { DeepPartial } from "./localize";

export const PROPHETS_TOPICS_SO: DeepPartial<ProphetsTopic>[] = [
  {
    title: "Hordhac Nabiyada",
    summary:
      "Waa maxay sababta Eebbe u soo diray nebiyada iyo sababta ay sheekadoodu hadda muhiim u tahay.",
    body: [
      "Eebe wuxuu soo diray nebiyo naxariis, hanuun iyo xujo ah si dadku u ogaadaan isaga, uguna caabudaan si sax ah, uguna noolaadaan cadaalad iyo ujeedo.",
      "Sheekooyinkooda Qur'aanku maaha taariikh fog oo keliya; waa casharo wax ku ool ah oo loogu talagalay caqiidada, dulqaadka, nolosha qoyska, hogaaminta, iyo toobad keenka.",
      "Rumaynta nebiyada oo dhan waa qayb ka mid ah iimaanka. Muslimiintu dhammaantood way ixtiraamaan, ka fogaadaan buunbuuninta, raacaan dhambaalka ugu dambeeya ee uu keenay Muxammad ﷺ.",
    ],
    quran: [
      {
        excerpt:
          "Rasuullo iyagoo ah kuwa bishaaraysan oo u dige si aan dadku xujo ugu yeelan Eebe ka dib rasuullada.",
      },
      {
        excerpt: "Waxaan u Dirray Ummad kasta Rasuul Caabuda Eebe kana Dhawrsada.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Waa maxay nebi Islaamku?",
    summary: "Bashar la doortay oo waxyi helay dadkana Alle ugu yeedha.",
    body: [
      "Nebigu waa bani aadam uu Alle u doortay inuu waxyi ka helo oo dadka ku hanuuniyo tawxiidka, cibaadada iyo akhlaaqda suuban.",
      "Nebiyadu maaha kuwo rabbaani ah oo aan weligood la caabudin. Waa kuwa ugu khayrka badan khalqiga xagga addeecidda, akhlaaqda iyo aaminaadda, iyagoo ka hadhsan addoommadii Alle.",
      "Ujeedadoodu waa hal asaas oo ah in Alle keligii caabudo. Faahfaahinta sharci ee gaarka ahi way ku kala duwanaan kartaa bulshooyinka dhexdooda xikmada Alle.",
    ],
    quran: [
      {
        excerpt:
          "Rasuuladoodii waxay ku dhaheen annagu waxaan nahay rag idinla mid ah, Eebana wuxuu u fadilaa cidduu doono oo addoomadiisa ka mid ah.",
      },
      {
        excerpt:
          "Ma aan dirin hortaa Rasuul waxaan u waxyoonay mooyee Ilaah kale ma jiro aniga mooyee ee i caabuda.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nabi vs Rasuul",
    summary: "A farqi waxtar leh ee deeqda waxbarasho, halka labaduba ay yihiin nebiyo la sharfay.",
    body: [
      "Aqoonta Islaamka, waxa lagu kala duwan yahay waa in rasuul walba uu yahay nabi, laakiin nabi kastaa maaha rasuul. Rasuulku inta badan waxaa lagu tilmaamaa inuu yahay mid si gaar ah loogu soo diray dadka, halka nabi uu ku sii wado hanuuninta waxyiga.",
      "Qur'aanku wuxuu isticmaalaa labada erey si sharaf leh, Muslimiintuna waxay rumaysteen dhammaan nebiyada iyo rususha iyagoon cidna diidin.",
      "Qeexitaannada saxda ah ee farsamada waxay ku kala duwanaan karaan odhaah-cilmiyeedka, laakiin casharka la taaban karo waa mid joogto ah: ku hel waxyi si is-hoosaysiin iyo raac hanuunka Alle.",
    ],
    quran: [
      {
        excerpt: "Isagaa la doortay, wuxuuna ahaa rasuul iyo nabi.",
      },
      {
        excerpt: "Ma kala saarno mid ka mid ah Rasuulkiisa.",
      },
    ],
    disclaimer:
      "Tafaasiisha erey-bixinta waxa loo soo bandhigay si ballaadhan oo dhexdhexaad ah oo cilmi-nafsi ah; la tasho macalimiin aqoon sare leh si aad u heshid kala-soocida fiqiga sare.",
    appLinks: [{}],
  },
  {
    title: "Aadam (CS)",
    summary:
      "Qofkii ugu horreeyey iyo nebigii ugu horreeyey, oo cilmi lagu sharfay, laguna imtixaanay addeecidda.",
    body: [
      "Aadam (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) waa halka ay ka bilaabmaan taariikhda iyo nabinimada aadamuhu. Eebbana wuxuu ku Abuuray Gacmihiisa Dhoobo, wuxuuna ku afuufay Ruuxiisa, wuxuuna baray Magacyada wax kasta. Markii Malaa'igtii lagu amray inay u Sujuuddaan Aadam way adeeceen, hase ahaatee Ibliis wuu diiday isla wayni, markaas wixii ka dambeeyayna waxaa la caddeeyey cadaawadda uu u qabo Aadam iyo faraciisii. Muuqaalkan furitaanku waxa uu dejinayaa riwaayadda udub dhexaad u ah nolosha aadanaha kasta: doorashada u dhaxaysa addeecidda is-hoosaysiinta iyo fallaagada kibirka leh (Qur'aanka 2:30-39).",
      "Eebe wuxuu geliyey Aadam iyo Xaaskiisii ​​Xaawo Jannada wuxuuna u banneeyey wax kasta oo aan geed keliya ahayn. Shayddaan baa hoos u dhigay, wayna ka cuneen. Laakiin bal u fiirso farqiga u dhexeeya iyaga iyo Ibliis: Ibliis wuxuu xaq u yeelay dembigiisii, Adam iyo Xaawana isla markiiba way qoomameen oo u noqdeen Eebbe erayadii uu baray ee ahaa ‘Eebow waan dulminay nafteena, haddaadan noo dambi dhaafin oodan noo naxariisan waxaan ka mid noqonaynaa kuwa khasaaray’ (Qur’an 7:23). Eebbana wuu ka toobad aqbalay, wuxuuna u soo diray dhulka isagoo ballan ah hanuunka cid kasta oo raaci doonta.",
      "Casharka Aadamku waa casharka rajada: qofka bini'aadamka ah waa karaamo iyo karaamo, haddana waa la imtixaamaa oo simbiriirixayaa. Waxa qeexaya mu'minku in aanu dembi lahayn - Allaah kaliya ayaa kaamil ah - laakiin si degdeg ah oo daacad ah ugu soo laabtay tawbah. Sheekada Aadam waxa kale oo ay ina baraysaa in Shaydaanku yahay cadaw la iclaamiyey, cadawgiisa oo keliya oo hubkiisuna uu ku xanto; jawaabtu waa xuska Alle iyo dambi dhaaf waydiistiisa. Laga soo bilaabo Aadan ilaa iyo, soo degitaanka dhulka ma aha ciqaab ee waa marxaladda imtaxaanka dhabta ah ee aadanaha.",
    ],
    profile: {
      nation: "Dadnimada hore",
      location: "Jannada markaas dhulka",
      era: "Billoowga taariikhda aadanaha",
      mission: "Bar tawxiidka iyo adeecida Alle dadka ugu horreeya.",
      challenges: [
        "Colnimada Ibliis",
        "Nolosha dhulka ka dib",
        "Hagidda qoyska ugu horreeya ee aadanaha",
      ],
      miracles: ["Abuur amar Alle oo waalid la'aan", "La baro magacyada wax walba"],
      majorEvents: [
        "Abuuriddii Aadam iyo Barashada Magacyada",
        "Malaa'igtu sujuud iyo diidid Ibliis",
        "Simbiriirixidda Jannada, toobad dhab ah, iyo u soo degid dhulka",
      ],
      lessons: [
        "Sharafta bini'aadmigu waxay ku soo biirtay xilkasnimo",
        "Towbada daacada ah waxay dib u furtaa albaabka qalad kasta ka dib",
        "Shaydaanku waa cadaw cad oo joogto ah",
      ],
      facts: [
        "Aadam waa bini'aadamka ugu horreeya iyo nabigii ugu horreeyay",
        "Towbaddiisu waa tawbah ugu horreeya ee Qur'aanka",
      ],
    },
    quran: [
      {
        excerpt:
          "(Xusuuso) markuu Eebahaa ku yidhi Malaa'igta waxaan ka yeeli Dhulka Xukun isdhaaf ah...Markaasuu ka Aqbalay Nabi Aadam xagga Eebihiis kalimooyin wuuna ka Toobad aqbalay.",
      },
      {
        excerpt:
          "Waxayna dheheen Eebow waan dulminay nafteena, haddaadan noo dambi dhaafin oodan noo naxariisan waxaan noqonaynaa kuwa khasaaray.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Maalinta qiyaame waxay u iman doonaan dadku Aadam, waxayna ku odhan waxaad tahay aabbaha dadka; Eebahaa agtiisa noo shafeeco.",
      },
      {
        excerpt:
          "Aadam iyo Muuse ayaa ku dooday. Muuse wuxuu yidhi: Adigu waxaad tahay kii Eebbe gacantiisa ku abuuray. Aadam wuxuu yidhi: Ma waxaad igu eedaynaysaa arrin Eebbe ii qoray ka hor intuusan i abuurin? Markaa buu Aadan Muuse kaga adkaaday dooddii.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Idiris (CS)",
    summary: "Nebi run ah ayaa lagu ammaanay samirka oo Eebbe kor ugu qaaday maqaam sare.",
    body: [
      "Idiris (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) Qur’aanka kariimka ah ayaa lagu sheegay oo kaliya, balse eray kasta oo isaga ku saabsan waa ammaan. Eebe wuxuu ugu yeedhay 'Nin run ah, nebi' (Qur'aanka 19:56) wuxuuna ku daray kuwa samra iyo kuwa xaqa ah oo ay weheliyaan Ismaaciil iyo Dhul-Kifli (Qur'aanka 21:85-86). Sheekadiisu waxa ay ku tusinaysaa in Alle agtiisa uu qofka dabeecaddiisa – run-sheegnimada, dulqaadka, cibaadada suubban – ay ka badan tahay inta taariikh nololeedkiisa la joogo.",
      "Eebbana wuxuu isaga ka yidhi, 'Waxaan koryeelay meel sare' (Qur'aanka 19:57). Culimadu waxa ay taas u fahmeen in ay ula jeedaan darajada uu Allaah agtiisa sareeyo. Marka laga soo tago sida uu Qur’aanka iyo warbixinnada saxda ah caddeeyey, sheekooyinka caanka ah ee ku xidhan Idiris (sida in uu yahay qofka ugu horreeya ee qalinka wax ku qora ama mihnadaha gaarka ah ee adduunku) kuma dhisna daliil sugan, sidaa awgeed qofka mu’minka ah oo taxaddar leh waxa uu ilaalinayaa waxa waxyigu caddaynayo halkii uu wax ku qurxin lahaa.",
      "Idriis casharkiisu waxa weeye, u dhawaanshiyaha Alle laguma qiyaaso caannimo iyo sheeko dheer, balse waxa lagu qiyaasaa daacadnimo iyo joogtayn. Adoonka aamusan, run sheegga ah, daacadda ah wuxuu qaban karaa mawqif Eebbe agtiisa ka sarreeya kuwa badan oo magacyadooda si weyn loo xuso.",
    ],
    profile: {
      era: "Qarniyadii hore ee Aadan ka dib",
      mission: "Dadka ugu yeedh inay Alle ku caabudaan si run ah oo xaq ah.",
      lessons: [
        "Runtu waxay kor u qaadaa darajada addoonka",
        "Sheekada nebi kasta maaha mid faahfaahsan - taasina waa naqshad",
        "Joogtaynta, joogtaynta aaminka ah waa mid Eebe jecelyahay",
      ],
      facts: [
        "Qur’aanka oo lagu magacaabay run sheeg iyo nabi",
        "Lagu sifeeyey in uu Allah kor u qaaday meel sare",
      ],
    },
    quran: [
      {
        excerpt:
          "kuna sheeg kitaabka Idiris. Illeen wuxuu ahaa nin run sheeg ah oo nabi ah. Waxaana koryeelay meel sare.",
      },
      {
        excerpt:
          "iyo Ismaaciil, Idiris iyo Dul-kifli, dhammaan waxay ahaayeen kuwa samra. Waxaana Galinay Naxariistanada. Waxayna ahaayeen kuwa dhawrsada.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nuux (CS)",
    summary: "Rasuul samir aan caadi ahayn oo dadkiisa u yeedhay qarniyaal ka hor daad.",
    body: [
      "Nabi Nuux (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) waxa loo diray qoom ka tagay tawxiidka oo u galay cibaadada Sanamyada. Farriintiisii ​​kelida ahayd ee aan leexleexanayn waxay ahayd: 'Dadkaygiiyow, caabuda Eebbe; Ilaah kale ma lihid isaga ka sokoow' (Qur'aanka 7:59). Qur’aanku wuxuu xafiday xisaabtiisa gaarka ah ee risaalada ku jirta suuradda Nuux: wuxuu ugu yeedhay habeen iyo dharaar, fagaare iyo sirba, isagoo u soo jeedinaya dhiirigelin iyo digniin labadaba — isagoo xusuusinaya in dib u noqoshada Eebbe ay keento roob, xoolo, carruur iyo beero. Haddana jiilba jiilba, badankoodu way iska jeesteen, oo faraha ayay dhegaha geliyeen, wayna sii kibreen oo keliya (Qur'aanka 71:1-28).",
      "Qur'aanku waxa uu carrabka ku adkeeyey dhererka dulqaadkiisa: waxa uu ku hadhay iyaga 'kun sano oo konton ka yar' (Qur'aanka 29:14), welina in yar ayaa rumaystay. Markii ay caddaatay in aan iimaan dambe la aqbali doonin, ayuu Eebbe faray inuu ku dhiso doonnida amarka Eebbe iyadoo ay gaaladu ku jees jeesi jireen. Dabadeedna daadkii waxay u yimaadeen xukun. Wiilkii Nuux qudhiisu wuu diiday inuu fuulo, isagoo buur ku aaminay digniintii aabbihiis, wuxuuna ka mid ahaa kuwii qarqmay - xusuusin xun oo ah in xidhiidhka dhiiggu aanu ku beddeli karin rumaysadka (Qur'aanka 11:42-46).",
      "Sheekada Nuux waa darajada sare ee Qur'aanka ee dacwa: qofka wacaya waajibaadkiisu waa daacad, samir, bixin cad - natiijadu waxaa iska leh Allaah oo keliya. Waxa kale oo ay baraysaa in hanuunku yahay arrin qalbiga ku jirta, ee ma aha abtirsiin: wiilka nebigu waa lumin karaa, halka shisheeyuhuna badbaadi karaan. Mu’miniintii doonta fuulay waxay noqdeen farcan bini-aadmi ah oo dib loo cusboonaysiiyay, Nuuxna waxa lagu sharfay inuu ka mid yahay shanta rasuul ee ugu waaweyn ee go’aan adag (ulul-cazm).",
    ],
    profile: {
      nation: "Dadkiisa daad ka hor",
      location: "Gobolka Mesobotaamiya qadiimiga ah (si ballaaran loo tixraaco)",
      era: "qadiimiga aad hore",
      mission: "Umaddiisa ugu yeedh tawxiidka iyo towbada.",
      challenges: [
        "Jees-jees ka imanaya madaxda iyo akhyaarta",
        "Qarniyo diidmo ah oo ay ku yar yihiin rumaystayaasha",
        "Gaalnimadii iyo qaraabadii wiilkiisii",
      ],
      miracles: ["doonnidii lagu dhisay dardaaran Eebbe", "Badbaadinta Mu'miniinta ee daadka"],
      majorEvents: [
        "Baaq tawxiid ah oo soconaya ku dhawaad ​​kun sano",
        "Dhismaha Doonta Amarka Alle",
        "Daadka iyo bilowgii cusub ee rumaystayaasha",
      ],
      lessons: [
        "Ku adkeysiga dacwooyinka, natiijada ka soo baxdana Allaah loo daayo",
        "Xidhiidhka qoysku ma beddeli karo iimaanka",
        "Alle had iyo jeer waa badbaadiyaa kuwa daacadda ah",
      ],
      facts: [
        "Mid ka mid ah shanta rasuul ee go'aan adag (ulul-cazm)",
        "Sheekadiisu waxay ku soo aroortay suurado badan oo ay ku jirto mid isaga loogu magac daray",
      ],
    },
    quran: [
      {
        excerpt:
          "Waxaana loo waxyooday (Nabi) Nuux inaan Qoomkaaga midna rumayn kuwii rumeeyey mooyee, ee ha ka welwelin waxay falayeen.",
      },
      {
        excerpt:
          "Wuxuu yidhi: Eebow anigu waxaan u yeedhay habeen iyo maalin qoomkayga, martiqaadkaygiise uma siyaadinin waxaan carar ahayn.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dadku waxay u iman doonaan Nuux, waxayna ku odhan: Nuuxow waxaad tahay kii ugu horreeyey ee u soo diray dadka dhulka, wuxuuna Eebbe kuugu magacaabay addoon shukriya; noo shafeeco.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Huud (CS)",
    summary: "Waxaa loo diray Caad, oo ah qoom xoog badan, oo xooggoodu isu beddelay kibir.",
    body: [
      "Huud (nabadgelyo korkiisa ha ahaatee) waxa loo soo diray reer Caad, ilbaxnimo Qur’aanku ku tilmaamay inay jir ahaan awood badan tahay, caanna ku ahayd dhisidda dhismayaal dhaadheer oo aad loo faahfaahiyey ‘kuwaas oo la mid ah oo aan weligood dhulka lagu abuurin’ (Qur’an 89:6-8). Dadkan isla weyn ee Huud wuxuu u keenay farriin la mid ah farriintii nebi kasta: 'Dadkaygiiyow, caabuda Eebbe; Eebe mooyee ilaah kale ma lihid. Miyaydnaan isaga ka cabsanayn? (Quraanka 7:65). Wuxuu ahaa mid iyaga ka mid ah, oo aan warsan wax abaal ah, kaliya ugu yeedha inay shugriyaan oo ka fogaadaan dulmiga.",
      "Madaxdoodii ayaa ugu jawaabay majaajilo, oo waxay ku eedeeyeen nacasnimo iyo been, oo waxay ku dhegeen sanamyadii awowayaashood. Waxay ku xujeeyeen inuu keeno ciqaabtii uu uga digay, iyagoo ku kalsoon inaan xoog la mid ahayn xooggooda (Qur'aanka 46:21-25). Huud wuxuu si cad ugu digay in awoodda adduun iyo ilbaxnimada weyni aanay ilaalin qof kasta oo beeniya aayaadka Eebbe oo dhulka ku kibriya.",
      "Xukunku wuxuu u yimid sidii dabayl cadho leh oo qaylo ah oo Eebbe korkooda ku soo rogay toddoba habeen iyo siddeed maalmood oo xiriir ah (Qur'aanka 69: 6-7), taasoo ka dhigtay dadkii xoogga badnaa inay u dhaceen sidii jirro godan - halka Huud iyo mu'miniinta ay ku badbaadeen naxariista Eebbe. Sheekada Caad waxay ku soo noqnoqonaysaa Qur'aanka oo dhan iyadoo digniin taagan ah: Xoog, maal, iyo wax qabadku waa hadiyado lagu qaabilo khushuuc iyo mahadnaq, ee maaha kibir. Ummadi waxay la xisaabtamaysaa Alle si kasta oo ay horumar u gaadho.",
    ],
    profile: {
      nation: "Dadka 'Ad",
      location: "Gobolka Al-Axqaaf ( aagga konfureed Carabta ee tafsiirka qadiimiga ah)",
      era: "Nuux ka dib",
      mission: "Soo celinta tawxiidka, mahadnaqa, iyo cadaalada Caad.",
      challenges: [
        "Kibir wadareed oo xoog iyo maal ku dhisan",
        "Jees jeeska waxyiga iyo nabiga",
        "Codsiga diidmada ah ee ciqaab degdeg ah",
      ],
      miracles: ["Ilaalinta Mu'miniinta inta lagu jiro ciqaabta"],
      majorEvents: [
        "Baaqa towbada iyo mahadnaqa",
        "Digniinta dabayl daran",
        "Halaaggii Caad in ka badan toddoba habeen iyo siddeed maalmood",
      ],
      lessons: [
        "Xoog aan is-hoosaysiin la'aanteed waxay keentaa baabba'",
        "Ummadaha iyo ilbaxnimadaba Allaah ayaa la xisaabtama",
        "Digniinta nebiyadu waa naxariis la soo diro xukunka ka hor",
      ],
      facts: [
        "Sheekada Caad waxay ku soo noqnoqonaysaa Qur'aanka oo dhan si ay digniin ugu noqoto bulshooyinka dambe",
      ],
    },
    quran: [
      {
        excerpt:
          "Caadna waxaan u diray walaalkood Huud. Wuxuu yidhi: Qoomkayow Alle caabuda; Eebe mooyee ilaah kale ma lihid. Miyaydnaan isaga ka cabsanayn?",
      },
      {
        excerpt:
          "Markay arkeen Daruur ku soo fool leh Dooxooyinkooda waxay dheheen kani waa Darruur roob noo keeneysa. Saas ma aha ee waa waxaad ka samraysaan, waxaana ku sugan dabayl cadaab daran.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Saalix (CS)",
    summary:
      "Waxaa loo diray Thamuud, oo la siiyey mucjisadii hasha, waxayna burburiyeen calaamaddii ay dalbadeen.",
    body: [
      "Nabi Saalix (nabadgelyo korkiisa ha yeelee) waxaa loo diray Thamuud, oo ahaa qoom ka dambeeyay Caad, waxayna caan ku ahaayeen inay buuraha ku xardhaan guryihii waaweynaa, kuna noolaayeen raaxo (Qur'aanka 7:74). Wuxuu ku tilmaamay inay walaalo yihiin inay Alle kaligii caabudaan oo ay ka tagaan fasaadka madaxdooda. Markay dalbadeen calaamad ay ku caddeeyaan runnimadiisa, wuxuu Eebe siiyey mid cad oo cad: Hashii oo ku amar-ku-taagnayd inay cabto maalin la magacawdo, iyagiina mid kale (Quraan 26:155-156).",
      "Saalix wuxuu si cad ugu digay: 'Ha ku taabanina xumaan, ooy idinku qabtaan cadaab dhaw' (Qur'aanka 26:156). Calaamaddu waxay ahayd imtixaan xakamaynta - miyay ixtiraami karaan xadka Eebbe dhigay? Laakiin kuwii ugu cuslaa oo iyaga ka mid ah ayaa gawracay oo dilay hashii iyagoo fallaagoobaya, ka dibna waxay ku xujeeyeen Saalix inuu keeno cadaabkii loo ballan qaaday (Qur'aanka 7:77). Dilka geela waxaa lagu magacaabaa falkii kuwa yar ee aadka u liita, haddana dadkii oo dhan ayaa dembiga la wadaagay iyagoo raali ka ah.",
      "Cadaabku wuxuu ku dhacay saddex maalmood gudahood, waxaana ku dhacay qarax weyn iyo dhul-gariir guryahoodii, Thamuudna waxay jiifsadeen nolol la'aan, Eebbena wuu badbaadiyey Saalax iyo kuwii rumeeyey (Qur'aanka 7:78-79; 91:14). Casharku waa af badan yahay: mucjisooyinku ma jilciyaan qalbi madax-adayg; kaliya waxay kor u qaadaan saamiga isla xisaabtanka. Calaamad la weyddiistay oo haddana la diiday waxay noqotay dood ka dhan ah kuwii dalbaday. Xumaanta ka hor aamusnaantuna maaha dhexdhexaadnimo - ummad dhan ayaa loo haystaa inay ka masuul tahay falkii dhawr qof.",
    ],
    profile: {
      nation: "Reer Thamuud",
      location: "Al-Hijr/Waqooyi-galbeed Carabta",
      era: "Kadib 'Ad",
      mission: "Reer Thamuud uga yeedha sanam caabudid iyo fasaad xagga tawxiidka.",
      challenges: [
        "Dalbashada mucjiso, ka dibna diidmo",
        "Diidmada furan ka dib markii calaamad cad la bixiyay",
        "Hanjabaadda Nabi Saalax iyo Mu'miniinta",
      ],
      miracles: ["Hashii la soo diray oo calaamo Alle ka timid oo muuqata"],
      majorEvents: [
        "Muuqaalka hasha iyo biyaha la wadaago",
        "Jidh-jarida iyo dilka hasha",
        "Qaraxii burburiyay kuwii diiday",
      ],
      lessons: [
        "Mucjisooyin ma anfacaan qalbi madax adag",
        "Xadka Eebe u dejiyey oo la jebiyo waxay keenaysaa cawaaqib dhab ah",
        "Oggolaanshaha xumaanta qaybteeda dambigeeda",
      ],
      facts: ["Thamuud waxa ay caan ku ahaayeen in ay buuraha ku xardhaan guryo aad u fiican"],
    },
    quran: [
      {
        excerpt:
          "Tani waa hashii Eebe calaamo idinkaa ah ee ka taga ha ku cunaan dhulka Eebbe hana ku taabanina xumaan ooy idin qabto cadaab daran.",
      },
      {
        excerpt:
          "Reer Thamuud waxay beeniyeen Xad-gudubkoodii Dartiis, markii la soo diray kuwii ugu liitay...Markaasuu ku Halaagay Eebahood Dambigooda Dartiis, wuuna simay.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ibraahim (CS)",
    summary:
      "Khaliilullah, saaxiibka Eebbe iyo tusaalaha tawxiidka saafiga ah, imtixaan kasta wuu imtixaanay oo ku liibaanay.",
    body: [
      "Ibraahiim (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) waa tusaalaha ugu sarreeya Qur’aanka kariimka ah ee tawxiidka saafiga ah ee lagu gaadhay fakar iyo geesinnimo. Isagoo dhalinyaro ah oo mujtamaca ka mid ah oo ku hafanaya cibaadada sanamyada, wuxuu si badheedh ah ula xaajooday dadkiisa, aabbihii iyo xitaa boqorka: qorraxdii, dayaxa iyo xiddiguhuba way dhaceen oo way libdheen, haddaba sidee bay ilaahyo u noqonayaan? (Quraanka 6:75-79). Si uu u muujiyo awood la'aanta sanamyada, wuxuu jebiyey dhamaantood, marka laga reebo kii ugu weynaa, wuxuuna u sheegay dadkiisa inay waydiiyaan sanamyada naftooda waxa dhacay - iyaga oo ku qasbay inay qirtaan ilaahyadooda ma hadli karaan mana is difaaci karaan (Qur'aanka 21: 57-67).",
      "Is-taagiddaas darteed waxaa lagu dhex tuuray dab ololaya, laakiin Eebbe wuxuu amray, ‘Naayow, qabow iyo ammaan u ahaato Ibraahim korkiisa’ (Qur’an 21:69), wuuna soo baxay isagoo aan waxba gaarin. Noloshiisii waxa ay noqotay silsilad imtixaanno ah oo uu la kulmay isdhiibid guud: waxa uu ka soo tagay dalkiisii Alle dartiis, u duceeyey awlaad xaqa ah isagoo duq ah, waxaana la siiyay Ismaaciil iyo Isxaaq, waxaana lagu imtixaamay amar ah in uu huro wiilkiisa uu jeclaa - taas oo aabbe iyo wiilba ay aqbaleen iyagoo u hoggaansan ka hor inta uusan Eebbe soo fursanin wiilka - oo uu dhidibbada u taagay Kacbada Makkah isagoo la jooga Ismaaciil, una baryaya umad mu’miniin ah oo u soo diraysa Rasuul (Quraan) iyo Rasuul dhexdooda ah. 2:124–129; 37:100–107).",
      "Ibraahiim cibaado la'aan awgeed, ayuu Eebe Ibraahim u qaatay khaliil - saaxiib dhow (Qur'aanka 4:125) - oo wuxuu ka dhigay imaam, hoggaamiye u ah aadanaha oo dhan (Qur'aanka 2:124). Dhaxalkiisu wuxuu dhex maraa nebiyadii ka soo farcamay, xajka, iyo aqoonsiga qofka muslimka ah, kaas oo la faray inuu raaco 'Diinta Ibraahim, isagoo u janjeedha xagga xaqa' (Qur'aanka 3:95). Sheekadiisu waxay baraysaa tawakkul imtixaannada ugu adag, in hoggaanka dhabta ahi uu ku dhisan yahay naf hurid, iyo in iimaanka daacadda ahi uu dib u qaabayn karo jiilasha oo dhan.",
    ],
    profile: {
      nation: "Bulshada Mesopotamian iyo Levantine",
      location: "Ciraaq, Levant, iyo Makkah",
      era: "Qarniyadii dhexe",
      mission: "Soo noolee tawxiidka saafiga ah oo dhidibbada u yeel dhaxal waara.",
      challenges: [
        "Ka hor imaanaya kuwa sanamyada caabuda, aabbihiis, iyo boqor daalim ah",
        "U hijrooday dalkiisii ​​hooyo Alle dartiis",
        "Tijaabada hurida wiilkiisii ​​uu jeclaa",
      ],
      miracles: [
        "Dabkii ayaa qaboojiyay oo badbaadiyay amar Alle",
        "Farcan xaq ah oo gabow la siiyey",
      ],
      majorEvents: [
        "Ka doodista iyo jabinta sanamyada",
        "Dab lagu tuuro oo la bixiyo",
        "In Kacbada lagu dhiso Ismaaciil iyo imtixaankii weynaa ee naf hurida",
      ],
      lessons: [
        "Tawakkul (Ilaahay talo saarato) imtixaanada ugu daran",
        "Hoggaanka dhabta ah wuxuu u baahan yahay naf hurid",
        "Iimaanka daacadda ah ayaa dib u qaabayn kara jiilalka",
      ],
      facts: [
        "Waxaa loo yaqaan Khaliilullah, saaxiibka dhow ee Alle",
        "Aabbihii nebiyada ee Ismaaciil iyo Isxaaq",
      ],
    },
    quran: [
      {
        excerpt:
          "(Xusuuso) markuu Ibraahiim ku imtixaamay Eebihiis amarro oo uu fuliyay. Wuxuu yidhi:- Illeen waxaan kaa dhigayaa hogaamiye dadka.",
      },
      {
        excerpt:
          "Waxaan ku nidhi: Naaroow qabow iyo ammaan u ahow Ibraahim korkiisa. Waxayna damceen dhib, waxaana ka yeellay kuwa khasaaray.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Waxaa lagu soo ururin doonaa adigoo caga- cad oo qaawan oo buuryoqab ah. Qofka ugu horreeya ee labisan doono maalinta qiyaame waa Ibraahim.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Luud (CS)",
    summary: "Nebi dadkiisa uga digay akhlaaq xumo aad u wayn oo aanay ummad hortooda samaynin.",
    body: [
      "Nabi Luud (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) wuxuu ahaa qaraabadii Nabi Ibraahiim oo la hijrooday, kadibna waxaa loo diray dadkii Sodom iyo magaalooyinkii u dhowaa. Marka laga soo tago baaqa ah in Eebbe keligiis caabudo, dadkiisu waxay ahaayeen kuwa dambiilayaal ah si xun oo aan xishood lahayn Qur'aanku wuxuu yidhi ' caalamkoo dhan cid hore uma yeelin' - inay u dhowaadaan ragga halkii dumarka, oo ay si cad ugu dhaqmaan xumaanta kulankooda (Qur'aanka 7:80-81; 29:28-29). (Nabi) Luud wuxuu ugu yeedhay si daacad ah, daahirnimo iyo xuduudda dabiiciga ah ee Eebbe dejiyey.",
      "Waxay la kulmeen dib u habeyntiisa dood, laakiin waxay kula kulmeen cadaawad, iyagoo ugu hanjabay inay eryi doonaan oo ku jeesjeeseen baaqiisii ​​wacnaa: 'Ka saara magaaladaada; waa dad daahirsan. (Quraanka 7:82). Xataa gurigiisa dhexdiisa dacwaddu waxay ahayd mid aad u adag - naagtiisu waxay la safan tahay kuwa kharriban oo ma rumaysnayn, taasoo caddaynaysa in hanuunku yahay mid Eebbe siiyey oo aan lagu dhaxlin guur iyo dhiig (Qur'aanka 66:10).",
      "Markii amarku yimid, Alle wuxuu soo diray malaa'ig marti ah. Dadku waxay u yaaceen inay xataa iyaga dhibaateeyaan, Nabi Luudna wuxuu dareemay inuu tabar la’aan yahay ilaa ay malaa’igtu ka caddayso cidda ay yihiin oo ay u sheegeen inuu la baxo Mu’miniinta habeenkii. Markii waagu beryay ayaa magaalooyinkii la rogay oo dhagxaan lagu tuuray (Qur'aanka 11:77-83). Sheekada Luud waa digniin cad oo ah in runta akhlaaqda aysan isbedelin sababtoo ah bulshadu way oggolaatay dembiga waxayna caadi ka dhigtaa si cad - iyo in Eebbe had iyo jeer samatabbixiyo kuwa daacadda ah, si kasta oo ay u yar yihiin.",
    ],
    profile: {
      nation: "Dadka reer Sodom iyo magaalooyinka u dhow",
      location: "Gobolka Badda Dhimatay (oo si ballaaran loo soo xigtay)",
      era: "Waqtigii Ibraahim",
      mission: "Umaddiisa uga yeedha xumaanta cad iyo gaalnimada tawxiidka iyo daahirnimada.",
      challenges: [
        "Anshax-xumada guud ee xididdada loo siibay",
        "Jees-jees iyo handadaad eryi",
        "Gaalnimadii xaaskiisa",
      ],
      majorEvents: [
        "Digniin joogto ah oo ka dhan ah anshax-xumada",
        "Booqashadii Malaa'igtu waxay isu ekeysiiyey marti",
        "Gaddoonkii magaalooyinka",
      ],
      lessons: [
        "Runta akhlaaqdu kuma beddesho ogolaanshaha bulshada",
        "Mu'miniinta waxaa laga yaabaa inay aad u yar yihiin",
        "Eebe wuxuu ka samatabbixiyaa kuwa daacadda ah burbur wadareed",
      ],
      facts: ["Ibraahiim qaraabo ahaa oo isaga la tahriibay oo Sodom loo diray"],
    },
    quran: [
      {
        excerpt:
          "Ma waxaad u dhawaanaysaan niman adduunyo ah ood ka tagaysaan wuxuu Eebbe idiin abuuray oo lammaanayaal ah. Saas ma aha ee waxaad tihiin qoom xadgudbay.",
      },
      {
        excerpt:
          "markuu yimid amarkannagii waxaan ka yeellay hoosteeda magaalooyinka waaweyn, waxaana ku soo daadinnay korkooda dhagaxyo dhoobo ah.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ismaaciil (CS)",
    summary: "Nebi run ah hadalkiisa, ku samra fitnada, Kacbadana dhisay aabbihiis Ibraahim.",
    body: [
      "Ismaaciil (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) wuxuu ahaa curadkii Nabi Ibraahiim, waxaana la siiyay da'da. Noloshiisii ​​waxay ku bilaabatay imtixaan kalsooni badan: amar Alle, Nabi Ibraahiim wuxuu uga tagay ilmo yar oo Ismaaciil ah iyo hooyadii Xajar oo ku sugnaa togga Makkah oo cidlo ah, oo aan wax beero ah ka bixin, biyona aan ka soo bixin. Halkaa ayay ahayd markii Xajar uu ku ordayay biyo raadis inta u dhaxaysa buuralayda Safa iyo Marwah, in Alle uu ka soo burqanayay isha Zamzam- waa fal ay reer Xajar iyo xujay kastaaba ay ilaa maantadan ku raaxaystaan ​​sacii Xajka iyo Cumrada.",
      "Ismaaciil markii uu yaraa waxa uu la kulmay imtixaankii ugu waynaa ee uu aabbihii la garab taagnaa: kolkuu Ibraahim u sheegay aragtidii uu ku huri lahaa, Ismaaciil waxa uu ugu jawaabay isaga oo is-hoosaysiin ah, Aabbow yeel waxa lagugu amray; waxaad i heli doontaa hadduu Eebe idmo kuwa samra\" (Qur'aanka 37:102). Labaduba si buuxda ayay isu dhiibeen, Ilaahayna waxa uu Ismaaciil ku furtay allabari weyn, isaga oo ixtiraamaya addeecidooda weligeed ah. Aabbe iyo wiilkiisiiba waxay si wada jir ah u kiciyeen aasaaskii Kacbada, iyagoo baryaya, Rabbiyow, tan naga aqbal; illeen adaa maqle wax og\" (Qur'aanka 2:127).",
      "Qur’aanku waxa uu ku soo koobay akhlaaqdiisa sadar mudan in la xifdiyo: ‘Wuxuu ahaa mid ka run sheegay ballankii, wuxuuna ahaa rasuul iyo nabi. Wuxuu faray ehelkiisa salaadda iyo sakada, wuxuuna ka raalli noqday Eebihiis’ (Qur’an 19:54-55). Nolosha Ismaaciil waxa ay baraysaa quruxda qofka oo la dhawro, cibaadada sugan, iyo qoyska oo iska kaashada addeecidda Alle. Isaga oo sii maraya, xariiqda nebiyadu waxay ugu dambayntii gaadheen Nebigii ugu dambeeyay, Muxammad ﷺ.",
    ],
    profile: {
      nation: "Dadkii hore ee gobolka Makkah",
      location: "Makkah",
      era: "hijradii Ibraahim ka dib",
      mission: "Tawxiidka iyo cibaadada ooda, ehelkiisana ku fara salaadda iyo sakada.",
      challenges: [
        "Bilawgii qallafsanaa ee nolosha dooxa madhalayska ah",
        "Tijaabada allabariga",
        "Ilaalinta nolosha cibaadada ku salaysan iyo kalsoonida xurmada leh",
      ],
      miracles: ["Isha Zamzam ayaa cidlada ka bixisa", "allabari allabari ka furtay"],
      majorEvents: [
        "Hooyadiis Xajar ayuu kaga tagay dooxa Makkah",
        "Tijaabada allabariga, waxay la kulantay soo gudbin buuxda",
        "Kacbada oo la dhisay Ibraahim",
      ],
      lessons: [
        "Si daacad ah u ilaali balamahaaga",
        "Qoysku waxay iska kaashan karaan cibaadada iyo addeecidda",
        "Dhaxal muqadas ah ayaa u baahan dabeecad adag",
      ],
      facts: [
        "Qur'aanku wuxuu ku tilmaamay inuu run yahay ballankiisa",
        "Awoowe ee qabiilooyinka Carabta iyo line nebiyada final",
      ],
    },
    quran: [
      {
        excerpt:
          "kuna sheeg kitaabka Ismaaciil. Eebbana waa rumeeyey ballankii, wuxuuna ahaa rasuul iyo nabi. Ehelkiisana wuxuu faray salaadda iyo sakada, wuxuuna ahaa mid Eebbe ka raalli noqday.",
      },
      {
        excerpt:
          "markuu Nabi Ibraahiimna kor u qaaday Asaaskii Baytka iyo Ismaaciil waxay dheheen Eebow naga aqbal kannaga. 021-047 Adigu waxaad tahay Maqle wax og.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Isxaaq (CS)",
    summary: "Nabi barakeysan oo loogu bishaareeyay Nabi Ibraahiim iyo Yacquub aabbihiis.",
    body: [
      "Isxaaq (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) waxa u dhashay Nabi Ibraahim iyo Xaaskiisa Saarah iyaga oo da’ ah – Dhalasho ay Malaa’igtu ku bishaaraysay, markii Saara oo da’dii dhalmada dhaaftay ay qosol yaabban ku qososhay. Quraanku waxa uu qoray wakhtigan: 'Waxaan ugu bishaaraynnay Isxaaq iyo, Isxaaq dabadii, Yacquub' (Qur'aanka 11:71). Dhalashadiisu waxay calaamad u ahayd in awoodda Alle iyo naxariistiisa aanay ku xidhnayn xuduudaha caadiga ah ee bini'aadamka, iyo nasteexo u ah qof kasta oo mu'min ah oo sugaya rajo adag.",
      "Qur'aanku wuxuu si joogto ah ugu magacaabay Isxaaq kuwa xaqa ah, la doortay, iyo nebiyada sharafta leh, isaga oo ku sifeeyay isaga iyo Yacquub in la siiyay 'xoog cibaadada iyo aragtida' (Qur'aanka 38: 45-47). Isxaaq xaggiisa waxaa ka yimid Yacquub (Israa'iil), Yacquubna waxaa ka soo degay silsilado dheer oo nebiyo ah oo loo soo diray Banii Israa'iil, si uu Isxaaq u noqdo aabbihii wax sii sheegidda, oo xiriiriye u ah hanuuninta joogtada ah ee qarniyada oo dhan.",
      "Sheekadiisu, in kasta oo si kooban loo sheegay, haddana waxa ay xambaarsan tahay laba cashar oo waara: mahadnaqa hibooyinka Alle innagu mannaystay wixii ka baxsan filashadayada, iyo ogaanshaha in nasabka xaqa ahi yahay ammaano - iimaanku waa in la gudbiyaa, ee maaha in la iska dhaxlo oo keliya. Nimcada la dhex dhigay reer Ibraahim waa la dhawray sababtoo ah waxaa qaadi jiray addoomo Alle u go'ay.",
    ],
    profile: {
      nation: "Bulshooyinka Levantine",
      location: "Levant (Sham)",
      era: "Ibraahim ka dib",
      mission: "Sii wad hanuuninta nebinimada ee faraca qoyska barakeysan ee Ibraahim.",
      miracles: ["Dhalasho ayaa loogu bishaareeyay waalidiinta da'da ah bishaaro ahaan"],
      majorEvents: [
        "Ibraahiim iyo Saarah baa loogu bishaareeyey",
        "Sii wadida abtirsiinta nebiyada ee Yacquub",
      ],
      lessons: [
        "Eebe wuxuu bixiyaa wax ka baxsan filashada aadanaha",
        "Nasabka xaqa ah waa ammaano la ilaaliyo",
        "Badbaadinta aaminka ahi waxay ilaalisaa hanuuninta",
      ],
      facts: [
        "Aabihii Yacquub",
        "Waxaa lagu magacaabay Ibraahim iyo Yacquub oo ah qoys la doortay",
      ],
    },
    quran: [
      {
        excerpt:
          "Naagtiisiina way taagnayd, wayna qososhay. Markaasaan ugu bishaaraynay (Nabi) Isxaaq, Isxaaq dabadiisna Yacquub.",
      },
      {
        excerpt:
          "Xusuuso addoomadanada Ibraahim, Isxaaq, iyo Yacquub, kuwii xoogga badnaa. Annagaa ku doorannay si gaar ah, waana xuska guriga.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yacquub (CS)",
    summary:
      "Waxa kale oo loo yaqaan reer binu Israa'iil, oo ah nebi dulqaadkiisa quruxda badan ee murugada uu ku dayanayo kalsoonida aan la dhayalsan karin.",
    body: [
      "Yacquub (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) oo sidoo kale la odhan jiray Israa'iil, wuxuu ahaa ina Isxaaq iyo aabbihii laba-iyo-tobankii ee noqday qabiilooyinka Banii Israa'iil - oo uu ku jiro Yuusuf. Waxa uu caruurtiisii ​​ku barbaariyay tawxiidka, Quraankuna waxa uu ilaalinayaa axdigii uu ka qaaday sariirtii uu ku dhintay ee ahaa maxaad iga daba caabudaysaan? Waxay ugu jawaabeen, 'Waannu caabudaynaa Ilaahiinna iyo Ilaahii awowayaashiin... Ilaah keliya, isagaannu u hoggaansanahay' (Qur'aanka 2:132-133). Dareenkiisa ugu qoto dheer, ilaa ugu dambeyntii, wuxuu ahaa iimaanka jiilka soo socda.",
      "Tijaabooyinkiisii ​​weynaa waxay ka dhex muuqdaan sheekadii Yuusuf. Markay wiilashiisii ​​la soo noqdeen shaadhka Yuusuf iyo been ay ku sheegeen in Yey cunay, Yacquub wuu arkay dhagartii, mana uu jawaabin isagoo xanaaqsan ee wuxuu ku jawaabi waayay isagoo leh: 'Sabar baa ugu habboon, Eebbana waa ka gargaarkiisa laga wardoonayo waxaad ku tilmaamayso' (Qur'aanka 12:18). Sannado badan oo kala maqnaasho ah ayuu murugooday ilaa, sida Qur'aanku si xushmad leh u sheegay, indhihiisu murugada ka caddadeen - haddana wuu demiyey murugadiisa oo marna kama quusan (Qur'aanka 12:84).",
      "Tusaalaha qalbiga Yacquub waa hal jumlad: ' Ha ka quusanina naxariista Eebe; Dhab ahaan, ma jiro qof naxariista Eebbe ka quusto kuwa gaalada ah mooyee.” (Qur’an 12:87). Isagu waa tusaalaha sabar Jamiil - dulqaad qurux badan - taas oo aan ahayn istiqaalad aan toos ahayn laakiin firfircoon, rajo leh oo ku kalsoon in xigmadda Alle ay soo bixi doonto waqtigeeda. Markii Yuusuf ugu dambayntii loo soo celiyey, araggiisiina soo noqday, samirkaas waa la xaqiray. Yacquub waxa uu barayaa qof kasta oo mu’min ah oo murugaysan in uu murugada iyo yaqiinsigaba isku qalbi ku haysto.",
    ],
    profile: {
      nation: "Asalka reer banii Israa'iil",
      location: "Levant, oo la socda socdaalka Masar",
      era: "Qarnigii Yuusuf",
      mission: "Reerkiisa iyo tafiirtiisa ku hogaami.",
      challenges: [
        "Xiisad iyo hinaaso ka dhex aloosan wiilashiisa",
        "Kala fogaanshihii dheeraa ee Yuusuf",
        "U adkaysta murugo qoto dheer oo aan rajo beelin",
      ],
      majorEvents: [
        "Taladiisii ​​iyo axdigii tawxiidka ee wiilashiisa",
        "Sanado badan oo sabar u ahaa Yuusuf",
        "Kulankii farxadda badnaa ee Yuusuf Masar",
      ],
      lessons: [
        "Samir qurux badan (sabr jamil) waa firfircooni, iimaan rajo leh",
        "Waalidiintu waxay qaabeeyaan dhaxalka iimaanka ee carruurtooda",
        "Marna ha ka quusan naxariista Alle",
      ],
      facts: ["Sidoo kale loo yaqaan Israa'iil", "Aabihii Yuusuf iyo Reer Banii Israa'iil"],
    },
    quran: [
      {
        excerpt:
          "Wuxuu yidhi: Saas ma aha, naftiinnu wax bay idin sasabisay. Markaa dulqaadku waxa ugu habboon. Mindhaa Eebbe wuu ii wada keeni doonaa dhammaantood.",
      },
      {
        excerpt:
          "Waxayna dheheen waan caabudaynaa Eebahaa iyo Ilaahii Aabayaashiin Ibraahiim, Ismaaciil, Isxaaq, waana Ilaah kaliya, isagaana u hogaansamay.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yuusuf (CS)",
    summary:
      "Nebi uu ceelka uga soo socdaalay carshigii Masar wuxuu baraa daahirnimo, samir iyo cafis.",
    body: [
      "Yuusuf (nabadgelyo korkiisa ha yeelee) waa mawduuca qisadii Qur’aanka ee ugu dhammaystiran — Suuradda Yuusuf, taasoo Eebbe ugu yeedhay ‘sheekooyinka ugu wanaagsan’ (Quraan 12:3). Isaga oo wiil ah waxa uu arkay riyo dhab ah oo kow iyo toban xiddigood, qorrax iyo dayaxa u sujuudsan. Walaalihiis oo masayrsan ayaa ceel ku tuuray oo waxay ka iibiyeen Masar, markaasaa laga soo iibsaday gurigii nin xoog badan. Dib-u-noqosho kasta, Yuusuf wuxuu ilaalin jiray iimaankiisa iyo daacadnimadiisa.",
      "daahirnimadiisa ayaa la tijaabiyay markii naagtii sayidkiisu ay damacday inay sasabato. Wuu diiday, isagoo leh, 'Alle ayaan magangal u ahay', wuxuuna ka door biday xabsiga dembiga: 'Xabsigu waa iga jecel yahay waxa ay iigu yeedhaan' (Qur'aanka 12:33). In kasta oo aanu dambi lahayn, haddana sannado ayuu xidhnaa - oo xataa halkaas ayuu maxaabiistii saaxiibbadiis ah ugu yeedhay inay tawxiideeyaan oo uu riyooyinkooda fasiro. Markii boqorku ku riyooday toddoba sannadood oo abaar ah ayaa barxaddii ku wareertay, Yuusuf hadiyaddii fasiraada ee Ilaah siiyey ayaa boqorkii hor keenay, oo isna wuxuu u dhiibay madaxii khasnadaha Masar. Waxa uu ummadda abaaro ku maamulay caqli iyo caddaalad.",
      "Sheekadu meesha ugu sarreysa ma aha awood ee waa cafis. Markii walaalihiis oo gaajo dartay ay soo hor istaageen iyaga oo aan garanayn ayaa Yuusuf is muujiyey oo yidhi, Maanta korkiinna dambiile ma aha. Eebbana waa kuu dambi dhaafi, isagaana naxariista ugu naxariista.” (Qur’an 12:92). Wanaag kasta ayuu Alle ku mannaystay, isaga oo sheegay in Rabbigii uu u naxariistay markii uu xabsiga ka soo saaray oo uu reerkii isu keenay. Yuusuf waxa uu barayaa in dhawrsanaanta iyo taqwadu ay ilaaliyaan qofka mu’minka ah, in qorshaha Eebbe uu si deggan u baabi’iyo dhagar kasta oo bani’aadam ah, iyo in dembi-dhaafka-aan ahayn aargoosi- ay tahay astaanta qofka sharafta leh.",
    ],
    profile: {
      nation: "Qoyska reer Banii Israa'iil ee Masar",
      location: "Kanaan iyo Masar",
      era: "Muuse ka hor",
      mission: "Tawxiidka, daahirsanaanta, iyo cadaalada kor u qaad adigoo bulshada u adeegaya.",
      challenges: [
        "Khiyaanada walaalihiis",
        "Jirrabaadda iyo cayda beenta ah",
        "Xabsi dheer inkastoo aan dambi lahayn",
      ],
      miracles: ["Hibada uu Eebbe siiyey ee fasiraada riyada dhabta ah"],
      majorEvents: [
        "Ceelkii iyo kala taggii aabbihii",
        "Sanadihii xabsiga",
        "Masar u sara kacay oo reerkiisii ​​la midoobey",
      ],
      lessons: [
        "Dhowrsoonaanta iyo daacadnimada ayaa ilaaliya iimaanka",
        "Cafisku waxay bogsiisaa qoysaska",
        "Qorshaha Eebbe wuu ka sarreeyaa dhagar kasta oo aadanaha",
      ],
      facts: [
        "Suuratu Yuusuf oo dhan, oo loogu magac daray sheekadii ugu fiicnayd, waxay udub dhexaad u tahay noloshiisa",
      ],
    },
    quran: [
      {
        excerpt:
          "Wuxuu yiri:- maanta wax eed ah idinkuma dhacayso. Allaah ha ku cafiyo; waana kan ugu naxariista badan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Akhyaarta, ibnu gob, ina gob, ibnu gob: Yuusuf bin Yacquub, bin Isxaaq, bin Ibraahim.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shucayb (CS)",
    summary:
      "Nebi iimaanka ku xidhay daacadnimada ganacsiga, ugana digay Madyan khiyaanada iyo caddaalad-darrada.",
    body: [
      "Shucayb (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) waxaa loo diray reer Madyan oo ah bulsho ganacsi oo dhaqaalaheedii kharribtay khiyaamo: oo miisaan iyo miisaan gaaban bixin, dadkana ku xad-gudbi jirtay alaabtoodii, dhulkana ku fidisay dulmi. Farriintiisu waxa ay midaysay labada qaybood ee iimaanka oo ay dadku inta badan isku dayaan inay kala saaraan - cibaadada iyo akhlaaqda: 'Dadkaygow, caabuda Eebbe; Eebe mooyee ilaah kale ma lihid. Oofiyana miisaanka iyo miisaanka si caddaalad ah, dadkana ha ka duwinina xaqooda (Quraan 11:84-85).",
      "Dadkiisii ​​way is hortaageen, iyagoo si jees-jees ah u weydiinaya bal inay salaaddiisu uga baahan tahay inay ka tagaan caadooyinka khiyaanada leh ee aabbayaashood oo ay sameeyaan waxay raalli ka yihiin maalkooda (Qur'aanka 11:87). Way ku jees jeesi jireen, wayna ku hanjabeen isaga iyo mu’miniinta in la eryi doono, xitaa waddooyinka ayay xireen. Shucayb waxa uu ku adkaystay naxariis iyo waano cad, isaga oo ku adkaystay in uu dib u hagaajin doono inta uu awoodo, liibkiisuna waxa uu ahaa mid xagga Alle kaligii ahaa: “Liibaanayguna ma aha waxaan Eebbe ahayn. Xaggiisaan talo Saaray, Xaggiisaana u noqon (Quraan 11:88). Waxaa lagu xasuustaa aftahannimadiisii ​​uu dadkiisa ugu yeeri jiray.",
      "Markay ku adkaysteen diidmadii waxaa u yimid cadaab oo qabtay kuwii dulmi falay, Eebbena wuu badbaadiyay Shucayb iyo mu'miniintii (Qur'aanka 7:91-93). Taariikh-nololeedkiisu waxa uu bixinayaa cashar inta badan la iska indho-tiray: Daacadnimada dhaqaale kama soocna diinta - waa qayb ka mid ah. Khiyaanada suuqa, ka faa’iidaysiga dadka jilicsan iyo wax qabadku waa arimo iimaan leh, bulshada cadaalad darada xalaalaysa waxay u yeedhaa xukun Alle.",
    ],
    profile: {
      nation: "Reer Madyaan",
      location: "Waqooyi-galbeed ee Carabta / gobolka ganacsiga Levantine",
      era: "Ka dib qarniyadii Ibraahim",
      mission: "Tawxiidka ugu baaqa daacadnimada iyo cadaalada ganacsiga.",
      challenges: ["Musuqmaasuqa suuqa ka jira", "Jees-jees ka imanaysa", "Hanjabaadda cayrinta"],
      majorEvents: [
        "Baaqa ku wajahan cabbir buuxa iyo macaamil cadaalad ah",
        "Mucaarad shacab iyo hanjabaad",
        "Cadaabka kuwa xaqa Beeniyey",
      ],
      lessons: [
        "Iimaanku wuxuu dalbanayaa daacadnimada ganacsiga",
        "Cadaalad darada dadweynuhu waxay soo dhawaynaysaa xukun ilaahay",
        "Nebiyadu waxay ka hadlaan anshaxa bulshada iyo dhaqaalaha, maaha caado kali ah",
      ],
      facts: ["Waxaa loo yaqaanaa xoojinta miisaanka iyo cabbirrada"],
    },
    quran: [
      {
        excerpt:
          "Dadkaygoow Alle caabuda; Eebe mooyee ilaah kale ma lihid. Oofiya miisaanka iyo miisaanka dadkana ha ka duwinina dhulka, hana fasaadinina.",
      },
      {
        excerpt:
          "Guushayduna ma aha ee waa xagga Allaah. Isagaan talo saartay, xaggiisaana u noqon.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ayuub (CS)",
    summary:
      "Qaabka Sabirka Qur'aanka: Cibaadada oo aan la gariirin xanuun iyo khasaare daba dheeraatay.",
    body: [
      "Ayuub (nabadgelyo korkiisa ha ahaatee) - Ayuub - waa calaamadda sabir ee Qur'aanka kariimka ah. Waxa uu ahaa nabi ku manaystay caafimaad, maal iyo qoys, ka dibna lagu imtixaamay in ay waayaan, iyo xanuun dheer oo xanuun badan. Waxaas oo dhan kamuusan xanaaqin, mana uu eedayn Eebihiis dulmi; Mahadnaq iyo xusuus ayuu ku dhegay. Qur’aanku wuxuu ku ammaanay erayo soo koobaya sheekadiisa oo dhan:- Waxaan ka helnay samir iyo addoon wanaagsan. Dhab ahaantii, wuxuu ahaa mid si isdaba joog ah ugu soo laabanaya Alle\" (Qur'aanka 38:44).",
      "Markay ugu danbeyn dhibtii noqotay mid xad dhaaf ah, u fiirso hab-dhaqanka qumman ee ducadiisa. Ma uu dalban, kamana cabanin xukunka Alle; wuxuu si fudud oo khushuuc leh u hor dhigay Eebihiis: 'Waxaa i taabtay dhib, adiguna waxaad tahay kan naxariista badane' (Qur'aanka 21:83). Isla markiiba su’aasha la waydiiyey ayuu Alle u naxariistay. Markaasaa Ilaah u jawaabay oo ku yidhi, Dhulka ku dhufo; Kani waa qubays qabow iyo cabbid, wuuna ka saaray dhibkii wuxuuna soo celiyay ehelkiisii ​​iyo in ka badan, naxariis xaggiisa ah iyo waanada kuwa caabuda (Quraanka 21:84; 38:41-43).",
      "Ayuub waxa uu barayaa in sabarku aanu ahayn adkaysi nafsi ah balse uu yahay nooc cibaado oo firfircoon - dib ugu noqosho joogto ah oo Alle loogu noqdo inta lagu jiro tijaabada. Tusaalahiisu waxa kale oo uu sifeeyaa sida aynu u duceyno: si khushuuc leh, iyada oo aan laga cabanaynin xukunka, iyo si yaqiin ah naxariista Eebe. Waxayna u dhammayntiisa u xaqiijinaysaa qof kasta oo rumaystay oo la imtixaamay in imtixaannada oo uu iimaanku kaashado ay kor u qaadi karaan darajada addoonka oo ay mar walba ku xigto nafis waqtiga Alle.",
    ],
    profile: {
      era: "Waagii nebiyadii Ibraahiim kadib (macnaha guud)",
      mission: "Umaddiisa hanuuniyo isagoo sabar iyo cibaado ku sahabsan dhibka.",
      challenges: [
        "Xanuun dheer oo xanuun badan",
        "Xoolo iyo qoys khasaaray",
        "U adkaysiga imtixaan dabadheeraad ah",
      ],
      miracles: [
        "Caafimaad iyo nasteexo Amarka Alle",
        "Soo celinta qoyska iyo ducada ka dib tijaabada",
      ],
      majorEvents: [
        "Baryootankiisa is-hoosaysiinta markuu dhib ku jiro",
        "Caawinta Rabbaaniga ah, bogsiinta, iyo soo celinta",
      ],
      lessons: [
        "Samirku waa cibaado firfircoon",
        "Ducadu waxa ay aad u qurux badan tahay marka ay is-hoosaysiiso oo bilaa cabasho ah",
        "Tijaabooyin lagu qaado iimaanku waxay kor u qaadi karaan darajada qofka",
      ],
      facts: ["Waxaa lagu soo qaatay dhaqanka Islaamka oo dhan inuu yahay tusaalaha sabirka"],
    },
    quran: [
      {
        excerpt:
          "Ayuubna markuu u Dhawaaqay Eebihiis: Waxaa I Taabtay Dhib, Adiguna waxaad Tahay Naxariis badane.",
      },
      {
        excerpt:
          "Waxaan ka helnay samir iyo Addoon wanaagsan. Dhab ahaan, wuxuu ahaa mid si isdaba joog ah u soo laabanaya Eebbe.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dhul-Kifl (CS)",
    summary:
      "Nabi xaq ah oo lagu tirin jiray kuwa samra, la sharfay in kastoo sheekadiisu kooban tahay.",
    body: [
      "Dhul-kifli (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) laba jeer ayuu Qur’aanka ku soo arooray, labada jeerna wuxuu ku dhex jiray Nabiyada sharafta leh. Eebe wuxuu ku qoray Ismaaciil iyo Idiris - 'dhammaantood waxay ahaayeen kuwa samra. Waxaana Galinay Naxariistanada. (Qur'aanka 21: 85-86) - oo haddana wuxuu ku xusay isaga oo ka mid ah kuwa ugu wanaagsan Ismaaciil iyo Al-Yasaa' (Qur'aanka 38: 48). Xusid kastaa waa ammaan, inkastoo aan sheeko tafatiran laga bixin.",
      "Sababtoo ah Qur'aanka iyo Sunnada saxda ah ma sii ballaariyaan noloshiisa, culimada qadiimiga ah waxay ku kala duwan yihiin xitaa faahfaahinta aasaasiga ah - qaar ayaa tixgeliya inuu ahaa nebi ama nin xaq ah, inkastoo lagu tiriyo nabiyada liiska muslimiinta caadiga ah. Mu'minka taxaddarka leh wuxuu diidaa inuu aamusnaanta ka buuxiyo sheekooyin aan la hubin, wuxuuna qabtaa beddelka waxa Eebbe caddeeyey ee ah inuu ahaaday samir iyo caddaalad, taasina waa sharaf ku filan.",
      "Ku daristiisu waxa ay xambaarsan tahay cashar aamusan oo ah: Ma aha addoon kasta oo Alle jecel yahay in uu ka tago sheeko caan ah. Adeeg joogto ah, daacad ah - nooca aan waligiis taariikhda lagu qorin laakiin si buuxda u yaqaan Eebbe - waa nooca saxda ah ee lagu kasbado naxariistiisa. Adkaysi qarsooni ma yara; Waa maaddada nolosha xaqa ah.",
    ],
    profile: {
      era: "Xilliyadii nebiyada ka hor Ciise (si ballaadhan loo dhigay)",
      mission: "Dadkiisa ugu yeedh addeecidda iyo xaqa.",
      lessons: [
        "Samirku waa udub dhexaadka dabeecadda nebiyada",
        "Faahfaahin xaddidan ayaa weli xambaarsan hagitaan xooggan",
        "Aaminnimo, adeeg aan la arkayn waa mid Eebbe jecel yahay",
      ],
      facts: [
        "Waxaa lagu magacaabay Ismaaciil iyo Idiris oo ka mid ahaa bukaannada",
        "Waxaa lagu tiriyaa nabiyada liiska muslimiinta caadiga ah",
      ],
    },
    quran: [
      {
        excerpt:
          "iyo Ismaaciil, Idiris iyo Dul-kifli, dhammaan waxay ahaayeen kuwa samra. Waxaana Galinay Naxariistanada. Waxayna ahaayeen kuwa dhawrsada.",
      },
      {
        excerpt:
          "Xusuuso Ismaaciil, Al-Yasaa', iyo Dul-kifli, dhammaantoodna waxay ka mid yihiin kuwa muuqda.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Muuse (CS)",
    summary:
      "Rasuulkii weynaa wuxuu u diray Banii Israa’iil oo ka horyimid taliskii Fircoon oo qaatay Tawreed.",
    body: [
      "Nabi Muuse (cs) waa nebigii ugu badnaa ee lagu sheegay Qur’aanka kariimka ah, qisadiisana waa mid aad u faahfaahsan. Wuxuu ku dhashay amarkii Fircoon ee ahaa in la laayo wiilasha reer Banii Israa'iil, isaga oo ilmo yar ayaa lagu dhex riday dambiisha webiga Niil hooyadiis - waxyiga Alle - iyo, qorshaha Alle, oo lagu koray qasrigii Fircoon (Qur'aanka 28: 7-13). Sannado ka dib markuu Masar ka dhoofay oo uu ku aqal galay Madyan, ayaa Alle uga yeedhay dooxada xurmada leh ee Tuwa, markaas ayuu Eebbe si toos ah ula hadlay, una tusay calaamadda usha iyo gacanta, una diray walaalkii Haaruun oo u diray daalimkii Fircoon (Qur’an 20:9-36).",
      "Ujeedadiisu waxay ahayd inuu gaarsiiyo laba arrimood: ku baaqidda in Alle keligii la caabudo, iyo in la xoreeyo reer binu Israa'iil ee dulman. Fircoon oo ilaah sheegan jiray ayaa la kulmay is-diiddan, oo xataa calaamooyin cad-cad ka dib-ushii mas noqotay oo liqday dhagartii saaxiriinta, iyo belaayooyinkii, wuu diiday inuu is dhiibo. Nabi Muuse markuu Banii Israa’iil soo saaray ayaa Fircoon ka daba-tagay ilaa badda. Halkaas ayuu Eebbe ku amray, ‘Ku dhufo ushaada badda, wayna kala go’day, markaasay Mu’miniintu u gudbeen dhul engegan iyadoo Fircoon iyo ciidankiisii ​​ay ku qaraqmeen (Qur’an 26:63-66).",
      "Laakin xorayntu waxay ahayd bilow uun. Nabi Muuse waxa uu ku dadaalay in uu hogaamiyo dad adag oo aan inta badan mahadin: waxa uu helay Tawreed buurta, waxa uu soo noqday oo uu arkay iyaga oo caabudaya weyl dahab ah; wuxuu la kulmay cabashooyinkooda, dalabaadkooda, iyo caasinimadooda oo uu la kulmay hoggaan dulqaad leh oo adag. Nolosha Muuse waxay ku biirtay laba mawduuc oo waaweyn - geesinnimada ka hortagga caddaalad-darrada iyo dulmiga, iyo dulqaadka looga baahan yahay inay dadka ku hagto addeecidda marka ay xoroobaan. Isaga oo ka mid ah ulul-cazm, waxa uu tusaale u yahay dib-u-habaynta iyo adhijirka bulsho labadaba.",
    ],
    profile: {
      nation: "Banii Israa'iil (oo ay la socoto baaqa loo jeedinayo qoomkii Fircoon)",
      location: "Masar iyo Siinay",
      era: "Daawuud iyo Sulaymaan ka hor",
      mission: "Tawxiidka u yeedh, oo ka hor taga dulmiga Fircoon, oo Tawreed gaadhsiiya.",
      challenges: [
        "Isagoo ka horyimid Fircoon oo ilaahnimo sheegtay",
        "Hoggaaminta dad iska caabida oo aan la mahadin",
        "Hoggaan joogta ah oo cadaadis joogto ah lagu hayo",
      ],
      miracles: [
        "Ushii oo abeeso isu rogtay",
        "In badda lagu kala tago amar Alle",
        "Calaamadihii badnaa ee Fircoon hortiisa lagu muujiyey",
      ],
      majorEvents: [
        "Allaah isaga oo kula hadlaya dooxada xurmada leh",
        "Iska horimaadkii Fircoon iyo Saaxiriintii",
        "Baxniintii iyo soo dajintii Tawreed",
      ],
      lessons: [
        "Si geesinnimo leh ugu istaaga ka hortagga dulmiga",
        "Hoggaaminta dadka waxay u baahan tahay dulqaad weyn",
        "Xoriyadda waa in lagu biiraa in Alle la adeeco",
      ],
      facts: [
        "Mid ka mid ah shanta rasuul ee go'aan adag (ulul-cazm)",
        "Waxaa la oran jiray Kalimullaah - waa kii Alle si toos ah ula hadlay",
      ],
    },
    quran: [
      {
        excerpt:
          "anna waan idin doortay ee maqla waxa la soo dejiyey. Runtii, anigu waxaan ahay Allaah. Aniga mooyee ilaah kale ma jiro ee i caabud oo ooga salaadda xuskayga.",
      },
      {
        excerpt:
          "Waxaana u Waxyoonay (Nabi) Muuse Hooyadiis Nuuji, haddaad ka Cabsatana ku Tuur Wabiga, hana Cabsan hana Murugoon. Annagaa idiin soo celinaynaa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Malaggii geerida ayaa loo soo diray Muuse. Markuu u yimid ayuu Nabi Muuse wax ku dhuftay, Eebbana wuu u soo celiyey oo ka door biday inuu geeriyoonayo.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Haaruun (CS)",
    summary:
      "Walaalkii codkarnimada badnaa ee Muuse, wuxuu u magacaabay inuu nebigiisa u hiiliyo Fircoon hortiisa.",
    body: [
      "Haaruun (nabadgelyo korkiisa ha yeelee) wuxuu ahaa nabi Muuse walaalkii ka weynaa, nabina isaga qudhiisa. Markii Eebbe u soo diray Muuse Fircoon, Muuse wuxuu weydiistay taageero: 'Iga yeel mid qoyskayga ah wasiir haaruun, walaalkay. Xooggayga ku kordhi isaga, oo ha la qaybsado hawshayda' (Qur'aanka 20:29-32). Eebbe wuu aqbalay codsigii, Quraankuna wuxuu qoray jawaabtiisa: 'Waxaan ku xoojinaynaa cududdaada walaalkaa' (Qur'aanka 28:35). Haaruun oo lagu tilmaamo in uu ka hadallo badan yahay ayaa Muuse garab istaagay markii ay farriinta Alle u gudbinayeen daalimkii.",
      "Waqtigiisii ​​ugu badnaa ee imtixaanku wuxuu yimid markuu Muuse maqnaa. Nabi Muuse markuu u baxay inuu Tawreed ku qaabilo buurta, Banii Israa’iil waxay ku dhaceen inay caabudaan weyl dahab ah. Haaruun wuxuu damcay inuu dib u celiyo, isagoo u digaya, dadkaygow waxaa uun laydin imtixaamayaa, Eebihiinna waa Naxariista ee i raaca oo adeeca amarkayga, laakiin way ka adkaadeen amarkiisii ​​waxayna ku dhawaadeen inay dhib u geystaan ​​(Quraanka 20:90-94). Markii uu Muuse soo noqday isagoo cadhaysan, Haaruun waxa uu sharraxay inuu ka baqay in haddii si xoog leh loo dhaqmo ay bulshada u kala qaybiso kooxo iska soo horjeeda ka hor inta aanu Muuse soo noqon (Qur’aanka 7:150).",
      "Taariikh-nololeedkii Haaruun waxa uu iftiimiyay qiimaha ay u leedahay in la wada shaqeeyo oo loo adeego Eebbe – risaalada ay wadaan laba ayaa ka xoog badan hal-iyo xikmadda jilicsan ee ilaalinta midnimada iyada oo aan marnaba runta la dhimin. Mararka qaarkood hoggaanka daacadda ahi waxa ay la macno tahay in la isku hayo bulsho burbursan oo la xakameeyo waxyeellada ilaa inta arrimaha la saxayo. Haaruun wuxuu Qur'aanka ku karaameeyey kuwa hanuunsan dhexdooda, wuxuuna Eebe uga tagey isaga iyo Muuse ammaan waarta qarniyadii dambe (Qur'aanka 37:119-122).",
    ],
    profile: {
      nation: "Banii Israa'iil",
      location: "Masar iyo Siinay",
      era: "Waagii Muuse",
      mission: "Muuse ku taageer u yeedhida tawxiidka iyo hanuuninta reer binu Israa'iil.",
      challenges: [
        "Iska hor imaadka nidaamka Fircoon",
        "Maareynta bulshada intii Muuse maqan yahay",
        "Ka hortagga kala qaybsanaan weyn oo dadka dhexdooda ah",
      ],
      majorEvents: [
        "Magacaabis wasiir iyo taageero Muuse",
        "Risaalada Fircoon ka hor",
        "Tijaabada kubka dahabka ah",
      ],
      lessons: [
        "Wadashaqeynta kooxdu waxay xoojisaa baaqa Alle",
        "Hoggaaminta mararka qaarkood waxay la macno tahay in dadka la isku hayo marka ay dhibaato jirto",
        "Midnimada la ilaaliyo oo aan marna runta la dhimin",
      ],
      facts: ["Walaalkii ka weynaa Muuse", "Quraanku ku amaanay aftahannimadiisa"],
    },
    quran: [
      {
        excerpt:
          "Oo ii magacaw wasiir reerkayga ah - Haaruun walaalkay. Isaga ku kordhi xooggayga oo ha la qaybsado hawshayda.",
      },
      {
        excerpt:
          "Wuxuu yidhi: Ina Hooyaday dadkii waa iga xoog bateen oo waxay doonayeen inay i dilaan ee yeyna igu farxin cadawgu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Daawuud (CS)",
    summary:
      "Nebi-boqor la siiyay xikmad, caddaalad, iyo Zabuur, iyo tusaale hoggaaminta cibaadada ku salaysan.",
    body: [
      "Daa'uud (nabadgelyo korkiisa ha ahaatee) - Daa'uud - wuxuu bilaabay isagoo dhallinyaro ah oo ka mid ah ciidankii Taluud (Saa'uul) ee ka soo horjeeday Jaluut (Jaaluud). Daawuudna waa kii dilay Jaaluut, ‘Eebe wuxuu siiyey xukun iyo xigmad, kana baray wuxuu doono’ (Qur’an 2:251). Eebbana wuxuu siiyey boqornimo, nabinimo iyo kitaab soo dejiyey oo ah Zabuur (Sabuurrada), taasoo ka dhigtay tusaale naadir ah oo ka mid ah hoggaamiyeyaasha sidoo kale ahaa cibaadada daacadda ah.",
      "Eebe wuxuu siiyey hadiyado cajiib ah: Buuraha iyo Shimbiruhu waxay ku wehelin jireen ammaanta Eebbe, birtana waxaa laga yeelay gacmihiisa si uu u xidho hubka (Qur'aanka 21:79; 34:10-11). Hase yeeshee awooddaas oo dhan, Daawuud wuxuu ahaa mid aad u hooseeya oo daacad ah. Cibaadadiisa aad bay u kululaatay oo uu Nabigu ﷺ ku tilmaamay soonka Daawuud -soon maalin kasta - inuu yahay soonka Alle loogu jeclaaday, salaaddiisa habeenkiina ay tahay salaadda loogu jecelyahay. Quraanku waxa kale oo uu soo bandhigay qiso xukun ah oo Daawuud, si tartiib ah u saxay, isla markiiba u sujuuday, cafis waydiistay, oo u soo noqday Eebihiis (Qur'aanka 38:24) - xooggiisu marna kama sarreynin xisaabtanka.",
      "Dawud noloshiisii ​​waxay baraysaa in maamulku yahay kalsooni, ee aanu ahayn mudnaan. Eebbe wuxuu si toos ah ula hadlayaa: ‘Daa’uudow, waxaanu kaa yeellay beddelka dhulka, ee ku kala xukun dadka si dhab ah, hana raacin niyadda’ (Qur’an 38:26). Cadaaladda, xuska Alle oo joogto ah, towbada degdega ah, iyo nolosha cibaadada oo habaysan ayaa ah waxa lagu hago hoggaanka xaqa ah. Awooddu waxay ugu badbaado badan tahay gacmaha kan ugu rukuucsan.",
    ],
    profile: {
      nation: "Banii Israa'iil",
      location: "Gobolka Jerusalem",
      era: "Kahor taladii Sulaymaan",
      mission: "Cadaalad ku hogaami, xaqana ku kala xukun, dadkiisana Alle ugu yeedh.",
      challenges: [
        "Miisaanka masuuliyadda garsoorka",
        "Isku dheelitirka awoodda iyo is-hoosaysiinta",
        "La xisaabtanka dadweynaha ee hoggaanka",
      ],
      miracles: [
        "Buuraha iyo Shimbiraha oo Eebe la tasbiixsada",
        "Bir baa ku jilcisay gacmihiisa idamkii Alle",
      ],
      majorEvents: [
        "Jabkii Jaaluut ku dhacay yaraantiisii",
        "Boqornimada, Nabinimada, iyo waxyigii Zabuur",
        "Dhaxalku wuxuu u gudbay wiilkiisii ​​Sulayman",
      ],
      lessons: [
        "Cadaaladdu waxay udub dhexaad u tahay xukunka xaqa ah",
        "Si degdeg ah u toobad keen qalad kasta ka dib",
        "Nolosha edaabta leh ee cibaadadu waxay xoojisaa hogaaminta",
      ],
      facts: [
        "Qaata Zabuur (Sabuurradii)",
        "Waa laga adkaaday Jaluut (Jaalaad) isagoo dhallinyaro ah",
      ],
    },
    quran: [
      {
        excerpt:
          "Daawuudoow waxaan kaa yeellay mid Dhulka u hadha, ee ku kala xukun dadka si Xaq ah hana raacin Xumaanta, waxayna kaa dhumin Jidka Eebe.",
      },
      {
        excerpt:
          "Waxaana u sakhirray (ka sakhirray) Buuraha inay la tasbiixsadaan Nabi Daawuud iyo Shimbirahaba... waxaana barraynay gacma-gaabkiinna (Iskaashatada) si uu cadawgiinna idiinka ilaaliyo.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ducada ugu badan ee Alle lagu baryo waa ducada Daawuud, soonka Alle loogu jecel yahayna waa soonka Daawuud: wuxuu soomi jiray maalin, maalinta xigtana wuu afuray.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sulaymaan (CS)",
    summary:
      "Nebi-boqor la siiyay awood aan la qiyaasi karin oo haddana mahad iyo xikmad ku dhisan.",
    body: [
      "Sulaymaan (nabadgelyo korkiisa ha ahaatee) - Sulaymaan - wuxuu ka dhaxlay boqornimada iyo nabinimada labadaba aabbihiis Daawuud, Qur'aankuna wuxuu ku ammaanay 'addoon aad u wanaagsan, oo si isdaba joog ah u soo noqda' (Qur'aanka 38: 30). Waxa uu u duceeyey boqortooyo ka duwan midda iman doonta, Eebbena wuxuu siiyey wax aan caadi ahayn: amar dabaysha, oo ku socota amarkiisa; u adeegida jinka u dhisay oo u qoolay idamkii Alle; iyo fahamka hadalka shimbiraha iyo makhluuqa kale (Qur'aanka 21:81-82; 34:12-13; 27:16).",
      "Laba muuqaal ayaa soo jiitay dabeecadiisa. Markii qudhaanjadu uga digtay gumaysigeeda inay gabbato si aanay ciidanka Sulaymaan u burburin iyaga oo aan ogayn, Sulayman wuu dhoola caddeeyey oo Eebbe uga mahad naqay nicmada fahamka, isagoo ka baryaya inuu noqdo mid mahad leh oo xaqa ah (Qur’aanka 27: 18-19) - Awooddu waxay ka dhigtay mid aad u hooseeya, oo aan ka yarayn. Markii uu maqlay boqoraddii Saba (Sabaa) iyo dadkeeda oo caabudayay qorraxda, muusan xoog ku qabsanin ee wuxuu ku casuumay inay u hoggaansamaan Eebbe, ugu dambayntiina wuxuu ku helay rumaysad xagga xigmadda iyo muujinta wixii Eebbe siiyey (Qur’aanka 27:22-44). Xataa nimcooyinkiisa baaxadda leh wuxuu u sameeyay imtixaan: 'Tani waxay ka timid nicmada Eebahay inuu i imtixaamo inaan shukrin doono iyo inaan gaal ahayn' (Qur'aanka 27:40).",
      "Sulaymaan waxa uu barayaa in awooddu ay ka mid tahay imtixaannada ugu adag, mahad-naqa (shukr) ay dawo u tahay. Qofka mu’minka ah ee la siiyay hanti, karti, ama maamul waxa loola jeedaa in uu u isticmaalo caddaalad iyo in uu dadka kale ugu yeedho Eebbe, isaga oo aan waligii ku faanin. Boqortooyadiisa oo dhan, iyo cajaa'ibkeeda oo dhan, waxay dib u tilmaamaysaa kii wax siiyay - taasina waa farqiga u dhexeeya nimcada sare u qaadaysa iyo tan wax kharriba.",
    ],
    profile: {
      nation: "Banii Israa'iil iyo boqortooyooyinkii ku xeernaa",
      location: "Yeruusaalem iyo gobolka oo dhan",
      era: "Daawuud ka dib",
      mission: "Caddaalad ku xukun, ummadahana ugu yeedh cibaadada Alle.",
      challenges: [
        "Maareynta boqortooyo baaxad leh",
        "Ilaalinta mahadnaqa iyada oo ay jirto awood baaxad leh",
        "U hagida ciidamada kala duwan si masuuliyadi ku jirto",
      ],
      miracles: [
        "Ku amar dabaysha idam Eebe",
        "Adeegga jinniga ee dhismaha iyo quusitaanka",
        "Fahamka hadalka shimbiraha iyo quraanjada",
      ],
      majorEvents: [
        "Dhaxal-sugaha dawuud boqornimadiisa iyo nabinimadiisa",
        "Dhacdadii qudhaanjada iyo mahadnaqiisa",
        "Xidhiidhka Boqorada Saba iyo rumaysnaanteeda",
      ],
      lessons: [
        "Awoodu waa imtixaan qoto dheer",
        "Mahadnadu waxay ka ilaalisaa isla waynida",
        "Xikmad iyo martiqaad quluubtooda way ka roonaan karaan xoog",
      ],
      facts: ["Waxaa ka mid ah boqorrada sida buuxda loogu sifeeyay Qur'aanka"],
    },
    quran: [
      {
        excerpt:
          "Wuu dhoola caddeeyey, isagoo ku maaweelinaya hadalkeeda, wuxuuna yidhi: Eebow i waafaji inaan ku shukriyo Nicmadaada aad igu Nicmaysay aniga iyo Waalidkayba, iyo inaan falo wanaag aad raalli ka tahay.",
      },
      {
        excerpt:
          "Nabi Suleymaanna waxaan u Sakhirray Dabaysha oo Socod Bil ah, Galabkeedana Socod Bil ah.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ilyaas (CS)",
    summary: "Nebi ka horyimid cibaadadii sanamkii Bacal oo dadkiisii ​​ugu yeedhay xagga Alle.",
    body: [
      "Ilyaas (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) – Waxaa loo diray beel ka mid ah reer Banii Israa’iil oo ku dhacay sanamyo, sanamyadoodana waxaa ugu weynaa Bacal. Qur'aanku wuxuu qoray caqabadiisa tooska ah: 'Miyaydaan Allaah ka cabsanayn? Ma waxaad u baryeysaan Bacal ood ka tegaysaan kan ugu wanaagsan abuuraha oo ah Eebihiin iyo Eebaha Aabayaashiin hore. (Quraanka 37:124-126). Wicitaankiisu waxa uu ahaa baaqa nebiyad ee weligeed ah: ka saar ilaahyada beenta ah oo u soo celi cibaadada kan wax abuuray.",
      "Qur'aanku waxa uu hawshiisa ku soo koobayaa hannaankii nebiyadii ee la yaqaanay - martiqaad cad, diidmo badan oo ka timid, iyo sharaf loo ilaaliyo kuwa daacadda ah. Way beeniyeen isaga, markaas waa la keeni [ciqaab], addoommadii Eebbe ee doortay maahee\" (Qur'aanka 37:127-128). Eebe wuxuu ku magacaabay kuwa dhawrsoon, wuxuuna ka tagay nabadgalyo waarta iyo ammaan korkiisa ah: 'Nabadgelyo korkiisa ha ahaato Ilyaas' (Qur'aanka 37: 129-130), wuxuuna ku daray Zakariya, Yaxye, iyo Ciise kuwa hanuunsan (Qur'aanka 6:85).",
      "Casharka Ilyaas waa in dib-u-habaynta dhabta ahi ay ka bilaabato hagaajinta cibaadada. Bulshadu si sax ah looma hagaajin karo marka ay u hoggaansanto u hoggaansanaanta walxaha beenta ah - ha ahaadeen sanamyo sax ah ama sanamyada casriga ah ee rabitaan, maal iyo mansab. Tawxiidku waa asaaska ay ku dhisantahay dib u cusboonaysiinta akhlaaqda ee waarta, xitaa marka ay koox aamin ah yartahay oo laga tiro bato, Alle wuu karaameeyaa kuwa xaqa ku dheggan.",
    ],
    profile: {
      nation: "Beesha Banii Israa'iil",
      location: "Gobolka Levant",
      era: "Xilliyadii nebiyada ee reer binu Israa'iil",
      mission: "Umaddiisa uga yeedha cibaadada Bacal towxiidka.",
      challenges: ["Cibaadada sanamyada oo qoto dheer", "Iska caabinta hogaanka"],
      majorEvents: [
        "Shacabka oo ku baaqay in laga soo horjeedo cibaadada Bacal",
        "Diidmo badan iyo ilaalinta mu'miniinta",
      ],
      lessons: [
        "Tawxiidku waa aasaaska dib u habaynta oo dhan",
        "Koox yar oo aamin ah ayaa weli dan u ah Allaah",
        "Nebiyadu waxay ka hadlaan khaladka caanka ah, ee kuma hadlaan",
      ],
      facts: ["Oo lagu magacaabay kuwa xaqa ah dhexdooda", "Ka horyimid cibaadadii sanamkii Bacal"],
    },
    quran: [
      {
        excerpt:
          "Markuu ku yidhi qoomkiisii ​​miyaydaan Eebe ka cabsanayn. Ma waxaad u yeedha Bacal ood ka tagtaan kan abuuraha wanaagsan?",
      },
      {
        excerpt:
          "iyo Zakariye, Yaxye, Ciise, Ilyaas, Dhammaanna waxay ka mid ahaayeen kuwa Suuban.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Al-Yasaa' (CS)",
    summary:
      "Nebi xaq ah oo reer binu Israa'iil ah, oo lagu magacaabay Quraanka Kariimka oo ka mid ah kuwa ugu wanaagsan.",
    body: [
      "Al-Yasaa' (nabadgelyo korkiisa ha ahaatee) - Eliishaa - wuxuu nebiyada ku dhex magacaabay laba meelood oo Qur'aanka ah, labadabana waa lagu ammaanay. Waxa uu ka soo dhex muuqday kuwa hanuunsan oo ay weheliyaan Ismaaciil, Yuunus, iyo Luud, kuwaas oo Eebe 'uu ka door biday caalamka' (Qur'aanka 6:86-87), iyo mar kale oo ka mid ah kuwa ugu caansan Ismaaciil iyo Dhul-kifl (Qur'aanka 38: 48). Qoraalku wuxuu sare u qaaday darajadiisa halkii uu ka sheegi lahaa sheeko faahfaahsan.",
      "Sababtoo ah waxyigu si badheedh ah ayuu isaga u kooban yahay, Muslimiintu waxay si dhab ah u xaqiijinayaan waxa hubaal ah - inuu ahaa nebi run ah oo u hiiliyay baaqii ah in Eebbe kaligiis caabudo dadkiisa dhexdooda - kana fogaadaan in ay ku xidhaan sheekooyin aan taageero wanaagsan lahayn. Xakamayntan lafteedu waa qayb ka mid ah caqiidada suuban: waxaynu ku ixtiraamnaa nebiga innagoo ilaalinayna runta isaga ku saabsan, ee ma aha innaga oo alifayna sheekooyin isaga ku xeeran.",
      "Xusiddiisu waxa ay xasuusin u tahay in Eebbe soo diray rusullo badan, iyo in aan qiimaha nebigu lagu cabbirin inta sheekadiisa la ilaalinayo, balse lagu qiyaaso daacadnimadiisa risaalada. Sida Quraanku meel kale ka sheegay, waxaa jiray rasuullo ‘aanu kaaga qisoon qisadooda iyo Rasuullo aynaan qisadooda ka warramin’ (Qur’aanka 40:78) — iyo rumaynta dhammaantood, la yaqaan iyo kuwa aan la garanayn, waa qayb ka mid ah iimaanka Muslimka.",
    ],
    profile: {
      nation: "Banii Israa'iil",
      location: "Gobolka Levant",
      era: "Xilliyadii nebiyada ee reer binu Israa'iil",
      mission: "Tawxiidka dadkiisa dhexdiisa ka sii wad.",
      lessons: [
        "Si isku mid ah u ixtiraam nebiyada oo dhan rumaysadka",
        "Xusid kooban oo Qur'aan ah ayaa weli gudbinaysa hanuun dhab ah",
        "Joogitaanka xaqa ah waxay ilaalisaa rumaysadka bulshooyinka",
      ],
      facts: [
        "Oo si toos ah loogu magacaabay Qur'aanka Kariimka oo ka mid ah kuwa ugu wanaagsan oo la doortay",
      ],
    },
    quran: [
      {
        excerpt: "iyo Ismaaciil, Al-Yasac, Yuunus, Luud, dhammaan waxaan ka fadilnay Caalamka.",
      },
      {
        excerpt:
          "Xusuuso Ismaaciil, Al-Yasaa', iyo Dul-kifli, dhammaantoodna waxay ka mid yihiin kuwa muuqda.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yuunus (CS)",
    summary:
      "Nebigii nibiriga, oo towbadkeenkii gudcurka ku jiray waxay noqotay cashar aan wakhti lahayn oo rajo ah.",
    body: [
      "Yuunus (nabadgelyo korkiisa ha ahaatee) - Yuunus - waxaa loo diray reer Nineweh, laakiin markii ay ku adkaysteen baaqiisii, ayuu uga tegey isagoo cadhaysan ka hor inta uusan Eebbe u fasaxin inuu baxo. Qur'aanku wuxuu qeexayaa wixii raacay: \"[xun] ninkii kalluunka lahaa markuu baxay isagoo xanaaqsan oo u maleeyay inaanaan xukumin korkiisa [wax dhib ah]\" (Qur'aanka 21: 87). Markuu doonni fuulay, waxaa lagu tuuray baddii, oo waxaa liqay kalluun weyn, oo wuxuu ku dhex muquurtay lakabyada gudcurka ah, iyo gudcurka habeenka, iyo badda, iyo caloosha kalluunka.",
      "Mugdigaas aadka u daran ayaa Yuunus ku dhawaaqay erayo noqday mid ka mid ah ducooyinka loogu jecelyahay Islaamka: “Adiga mooyee ilaah kale ma jiro; adaa leh. Anigu waxaan ka mid ahaa daalimiinta (Quraanka 21:87). Ma uusan quusan; waxa uu caddeeyey in Alle kaamilo yahay, khaladkiisana wuu qirtay. Eebbana wuxuu ku jawaabay:- Markaasaan ka jawaabnay oo ka korinay cidhiidhi. Saasaana ku korinaynaa Mu'miniinta\" (Qur'aanka 21:88). Kalluunkii ayaa ku tuuray xeebta, wuxuuna Alle ka dhigay in geed u soo baxo si uu u gabbaadiyo jirkiisa daciifka ah.",
      "Kadib waxaa yimid dhamaad cajiib ah: Yuunus wuxuu ku noqday qoomkiisii, si ka duwan ummad kasta oo kale oo Qur'aanka ah, way rumaysteen waana la daayay - ' markaasaan u raaxaynay ilaa muddo' (Qur'aanka 37: 147-148; 10: 98). Sheekadiisu waxay soo jeedinaysaa laba cashar oo isku tol ah: ha ka quusanina naxariista Eebe, si kasta oo mugdigu u sii qoto dheer yahay, maxaa yeelay tawbadkeen daacad ah ayaa soo celisa wixii lumay; ducada Yuunusna waxay u tahay halbowle u ah qofkasta oo mu'min ah oo dhib ku jira. Rasuulku ﷺ wuxuu baray in qof Muslim ah uusan waligiis ku baryin in Allaah u ajiibo mooyee.",
    ],
    profile: {
      nation: "Dadka Nineweh",
      location: "Gobolka Mesopotamian",
      era: "Xilligii Nabi Ciise ka hor",
      mission: "Umaddiisa ugu yeedh tawxiidka iyo towbada.",
      challenges: [
        "Cadaadiska diidmada joogtada ah ee daawaha",
        "Tijaabada shakhsi ahaaneed ee mugdiga badda",
        "Ku soo noqoshada howlgalka ka dib markii la saxo",
      ],
      miracles: [
        "Badbaadinta kalluunka dhexdiisa",
        "Geed gabaad ah oo korkiisa ka baxay",
        "Caqiidada dadkiisa oo dhan",
      ],
      majorEvents: [
        "Inuu dadkiisa iyo badaha ka daayo",
        "Baryada ku jirta gudcurka saddexda ah",
        "Soo noqoshada iyo rumaynta Nineweh",
      ],
      lessons: [
        "Marna ha ka quusan naxariista Alle",
        "Towbad keen daacad ah ayaa soo celisa risaalada",
        "Ducada dhibka ku jirta waa isbedel",
      ],
      facts: ["Sidoo kale Qur’aanka waxaa loogu yeeraa Dhun-Nuun (ninkii kalluunka)."],
    },
    quran: [
      {
        excerpt:
          "Wuxuuna u Dhawaaqay Mugdiyada Dhexdooda isagoo leh: Adigu Ilaah kale ma jiro. adaa leh. Anigu waxaan ka mid ahaa daalimiinta.",
      },
      {
        excerpt:
          "Miyayna jirin magaalo rumaysay oo iimaankeedu u anfacay qoom Yuunus mooyee. Markay Rumeeyeen waxaan ka Faydnay Cadaabkii Dullida.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ducadii Dhun-Nuun markuu Eebbe uga baryay caloosha kalluunka waxay ahayd: La ilaha illa Anta, subxaanaka, inni kuntu minaz-zalimin. Ma jiro qof muslim ah oo ku barya wax kasta oo aan ahayn in Eebbe u jawaabo.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Zakariya (CS)",
    summary: "Nebi daacad ah oo u duceeyey dhaxal suuban isagoo duq ah oo loo jawaabay Yaxye.",
    body: [
      "Zakariya (nabadgelyo korkiisa ha yeelee) - Sakariye - wuxuu ahaa nebi cibaado leh oo reer Banii Israa'iil ah, waana ilaaliye Maryam. Markasta oo u soo galo iyada qolkeeda salaadda wuxuu ka helay sahay agteeda ah, wuxuuna weyddiiyey siday ku timid, markaasay ugu jawaabi jirtay xagga Eebbe xaggee ka timid. Runtii, Eebbe wuxuu arsaaqaa cidduu doono xisaab la'aan' (Qur'aanka 3:37). Markhaatifurka arsaaqda Eebe ee Maryama waxay dib u soo noolaysay rajadiisa ah in Eebbe ku siin karo wax u muuqda mid aan suurtogal ahayn bani-aadmiga.",
      "In kasta oo uu gabow noqday oo ay naagtiisu madhalays ahayd, haddana Sakariya wuxuu u jeestay Eebbe isagoo aamusan oo duco qotodheer leh: ‘Eebbow, runtii lafahaygii way daciifeen, madaxayguna caddaan baa ka buuxsamay, weligay kumaan faraxsanayn baryadaydii adiga’ (Qur’an 19:4). Ma uu waydiisan maal iyo adduun toona balse waxa uu waydiistay dhaxal suuban oo risaalada nebiga sii wadi doona oo ilaalinaya cibaadada Alle. Eebbe wuxuu ugu bishaareeyey wiil, Yaxye - magac, Eebbe wuxuu yidhi, ninna hore looma siin (Qur'aanka 19:7). Astaan ​​ahaan, Zakariya wuxuu ahaa inuu dadka la hadlo saddex maalmood mooyee, isagoo carrabkiisa u go'ay xuska Eebbe (Qur'aanka 19:10-11).",
      "Nolosha Sakariye waxay baraysaa qofka mu’minka ah inuusan waligiis joojin ducada, si kastaba ha ahaatee jawaabtu waxay u ekaan kartaa, iyo inuu Eebbe si gaar ah u weydiiyo hadiyadda qoyska suuban iyo sii wadida iimaanka. Walwalka ugu weyni ma ahayn naftiisa ee yaa runta qaadi doona dabadiis. Sheekadiisu waxay sidoo kale sharfaysaa adeegga aamusnaanta ee meelaha cibaadada sida camal sharaf leh oo la jecel yahay.",
    ],
    profile: {
      nation: "Banii Israa'iil",
      location: "Gobolka Jerusalem",
      era: "Ciise ka hor",
      mission: "Hanuuniyo dadkiisa oo ilaali cibaadada nebiyada.",
      challenges: [
        "Gaaritaanka gabow la'aan ilmo",
        "U fiirsashada iimaanka dhaxalka",
        "Ku ilaalinta cibaadada bulsho qalafsan",
      ],
      miracles: [
        "Bishaarada Yahya ee gabow",
        "Calaamadda hadalka joojinta muddo saddex maalmood ah",
      ],
      majorEvents: [
        "Mas’uuliyadda Maryama iyo ka marqaati kaca sahaydeeda",
        "Ducada laabta leh ee dhaxalka leh",
        "Ducada ka jawaabtay iyo dhalashadii Yaxye",
      ],
      lessons: [
        "Waligaa ha lumin rajo ducada",
        "Ehel iyo abtirsiin toosan Allah ka baryo",
        "Cibaadada cibaadadu waa sharaf",
      ],
      facts: ["ilaaliyaha Maryam", "Aabbihii Yahya, oo dhalashadiisu ka jawaabtay ducadiisii"],
    },
    quran: [
      {
        excerpt:
          "Halkaas ayuu Zakariye kaga baryey Eebihiis isagoo leh: Eebow iga sii agtaada farac wanaagsan. illeen adaa maqle baryada.",
      },
      {
        excerpt:
          "Wuxuu yidhi: Eebow lafahaygii way daciifeen, madaxaygana waxaa ka buuxsamay cad, weligayna kuma aanan faraxsanayn baryadayda Eebow.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Yahya (CS)",
    summary:
      "Nebi daahir ah oo caqli badan oo xaqnimada la siiyey ilaa yaraantiisii, nabadna Eebbe ku mannaystay.",
    body: [
      "Yaxye (nabadgelyo korkiisa ha ahaatee) - John - waxay ahayd jawaabta ducada aabbihiis Zakariya, ee uu Eebbe u magacaabay dhalashadiisa ka hor. Eebbana si toos ah ayuu ula hadlay: 'Yaxye, kitaabka u qaado go'aansan. Oo wuxuu isaga siiyey xigmad intuu weli yar yahay\" (Qur'aanka 19:12) - tilmaan dhif ah oo calaamad u ah qaan-gaarnimadiisii ​​ruuxeed ee hore. Laga soo bilaabo yaraantiisii ​​waxa uu ahaa qof u heellan Eebbe si dhab ah oo ka baxsan sannadihiisii.",
      "Qur’aanku wuxuu si qurux badan u ammaanay dabeecaddiisa: Eebbe wuxuu siiyey ‘dareenka xaggayaga iyo daahirsanaanta, wuxuuna ahaa mid dhawrsada Eebbe, waalidkiina ka dhawrsada, mana ahayn mid dulmi badan oo caasi ah’ (Qur’an 19:13-14). Isagu wuxuu ahaa daahir oo cibaado leh, Oo waxaa lagu xusuustaa kuwa xaqa ah dhexdooda. Wuxuu dadkiisa ugu yeedhay addeecidda iyo xaqa, wuxuuna ka hor maray Nabi Ciise, isagoo rumeeyey kalimadda Eebbe, quluubtana u diyaariyey hanuun (Qur’an 3:39).",
      "Eebe wuxuu Yaxye ku sharfay nabad saddexda waqti ee ugu nugul noloshu: 'Nabadgelyo korkiisa ha ahaato maalinta uu dhashay, maalinta uu dhimanayo iyo maalinta la soo bixin isagoo nool' (Qur'aanka 19:15). Taariikh-nololeedkiisu waa fariin ku socota dhallin-yaro iyo waayeelba si isku mid ah: U-dhowaanshaha Eebbe dib looma dhigo sannadaha dambe. Wadnaha oo nadiif ah, cibaadada oo ay dhab ka tahay, iyo naxariista waalidkiis waxa ay ka soo bixi karaan qofka isaga oo yar - noloshaasna waa mid Alle jecel yahay.",
    ],
    profile: {
      nation: "Banii Israa'iil",
      location: "Gobolka Levant",
      era: "Casri ah oo la socda Sakariya oo u dhow waagii Ciisaha",
      mission: "Xaqa ugu yeedh, quluubtana u diyaari hanuun.",
      challenges: [
        "Dib-u-habaynta dadweynaha ee jawi niyad-jabsan",
        "Ilaalinta nadaafadda iyo mabda'a",
      ],
      majorEvents: [
        "Dhalashadiisa sidii duco looga jawaabay",
        "Oo xikmad lagu siiyay yaraantiisii",
        "Aqoonsiga daahirnimadiisa iyo cibaadadiisa",
      ],
      lessons: [
        "Dhallintu waxay wax ku hoggaamin karaan xaqnimo",
        "Daahirnimada qalbigu waa xoog dhab ah",
        "Naxariista waalidka waa qayb ka mid ah cibaadada",
      ],
      facts: [
        "Magaca Eebe ayaa dhalashadiisa ka hor",
        "Oo nabad lagu sharfay dhalashadii, dhimashadii, iyo sarakicidda",
      ],
    },
    quran: [
      {
        excerpt:
          "Yaxye, kitaabka u qaado si adag. Waxaana Siinay Xigmad isagoo Yar iyo Xigmad iyo naxariis agtanada ah iyo Daahir, wuxuuna ahaa mid Dhawrsan.",
      },
      {
        excerpt:
          "Eebe wuxuu kuugu bishaarayn Yaxye isagoo u rumayn kalimada Eebe ee sharafta iyo karaamada leh, iyo nabi kuwa suubban ka mid ah.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ciise ibnu Maryam (CS)",
    summary:
      "Waana Rasuul wayn oo u dhashay Maryam si mucjiso ah, uguna yeedhi Eebe xujooyin cad- Addoon oon Eebe ahayn.",
    body: [
      "Ciise (nabadgelyo korkiisa ha ahaatee) - Ciise - wuxuu ku dhashay Maryama aabbe la'aan, amarka Eebe, si ay calaamad u tahay awooddiisa buuxda: 'Runtii, Ciise agtiisa Eebe wuxuu la mid yahay kii Aadam. Isagaa ka Abuuray Ciid, markaasuu ku yidhi Ahaw wuuna ahaa (Qur'aanka 3:59). Markii Maryama ilmaheeda u keentay dadkeedii, oo ay dacweeyeen, Ciise ayaa ilmihii yaraa ka hadlay isagoo sariirta is-difaacaya: 'Runtii, anigu waxaan ahay addoonkii Eebbe. Wuxuu i siiyay kitaabka oo wuxuu iga dhigay nabi' (Qur'aanka 19:30). Bayaankan ugu horreeya waxa uu dhigay qaabkii hawshiisa oo dhan - in uu ahaa addoon Alle.",
      "Nabi Ciise waxa loo diray Banii Israa’iil si uu u xaqiijiyo Tawreed hortiisa iyo inuu keeno Injiil ( Injiil). Eebbana wuxuu ku taageeray mucjisooyin cad idankiisa: wuxuu bogsiiyey indhoole iyo kii baras qabay, waxna nooleeyey kuwii dhintay, wuxuuna ka sameeyey shimbir dhoobo ah oo duulaysa idamkii Eebbe (Qur’an 3:49). Farriintiisu waxay dadka ugu yeedhay inay caabudaan 'Eebbe, Rabbiyow iyo Rabbigiinna' (Qur'aanka 3:51), oo ay daacadnimo iyo xaqnimo u yimaadaan. Xertiisii ​​u dhowayd ee Hawaariyuuntu way rumaysteen oo taageereen.",
      "Quraanku wuxuu saxay laba daraf oo Ciise ku saabsan. Kuwii diiday oo ku tashaday inay dilaan, waxay caddaynaysaa inaan la dilin oo aan iskutallaabta lagu qodbin; Laakiin waxay u muuqatay oo keliya, oo Eebbe kor u qaaday isaga (Qur'aanka 4: 157-158). Kuwa buunbuuniyey, waxay ku adkaysanaysaa inuu yahay nebi iyo Rasuul sharaf leh, ee ma aha Ilaah ama ina Eebbe - 'Masiixa ina Maryama, ma ahayn waxaan Rasuul ahayn' (Qur'aanka 5:75). Sunniga caqiidada wuxuu soo laaban doonaa ka hor maalinta aakhiro. Sheekadiisu waxay ina baraysaa in awoodda Alle ay ka sarreyso dhammaan sababaha dabiiciga ah, in nebiyadu yihiin addoomo la karaameeyo oo aan weligood ilaahi ahayn, iyo in runta laga ilaaliyo beenin iyo buunbuunin labadaba.",
    ],
    profile: {
      nation: "Banii Israa'iil",
      location: "Levant",
      era: "Qarnigii 1-aad ee CE",
      mission: "cusboonaysii tawxiidka, oo tawreedna xaqiiji, xaqana ugu yeedh.",
      challenges: [
        "Mucaarad iyo dhagar ay wadaan kuwii isaga diiday",
        "Ka dib buunbuuninta maqaamkiisa",
        "Difaaca tawxiidka saafiga ah",
      ],
      miracles: [
        "Dhalasho la'aan",
        "Isagoo ku hadlaya sariirta",
        "Caawinta iyo noolaynta idanka Alle",
      ],
      majorEvents: [
        "Dhalashadiisii ​​mucjisada ahayd iyo difaacii hooyadii",
        "Baaqa dadweynaha oo leh calaamado cad",
        "In Alle loo sara kiciyo ee aan la dilin",
      ],
      lessons: [
        "Awoodda Alle ayaa ka gudubta sababaha caadiga ah",
        "Nebiyadu waa addoommadii Alle ee la karaameeyay, waligoodna ilaahi",
        "Runta waa in laga ilaaliyaa diidmada iyo buunbuuninta labadaba",
      ],
      facts: [
        "Injiil ( Injiil) la siiyay",
        "Waxay soo noqon doontaa ka hor maalinta aakhiro rumaynta Sunniga",
      ],
    },
    quran: [
      {
        excerpt:
          "(Ciise) wuxuu yidhi: Eebahay waa Eebahay iyo Eebihiin ee caabuda. Taasi waa jid toosan.",
      },
      {
        excerpt:
          "Mana ay dilaan, iskutallaabtana kuma ay qodbin; Laakiin waxaa la isu tusay iyaga... saas ma aha ee Eebe korkiisa u sara kiciyey.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Anigu waxaan ahay kan ugu dhow dadka oo dhan Ciise ina Maryam. Nebiyadu waa walaalo hooyooyin kala duwan, laakiin diintoodu waa mid, nabi na dhexdeenna ma jirin.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Maxamed ﷺ",
    summary:
      "Rasuulkii ugu dambeeyay, oo loo soo diray naxariista adduunka oo dhan iyo shaabadda Nabinimada.",
    body: [
      "Muxammad ﷺ waa nabiyada ugu dambeeya, looma dirin hal qoom laakiin loo soo diray dhammaan aadanaha, iyadoo Qur'aanku yahay waxyigii ugu dambeeyay oo la ilaaliyo. Eebbe wuxuu ku sifeeyey risaladiisii ​​hal aayad: ‘Kuuma aannaan dirin naxariista caalamka mooyee’ (Qur’an 21:107). Wuxuu ku dhashay magaalada Makkah, wuxuuna waxyigii ugu horreeyay ku soo dejiyay godka Xiira isagoo afartan jir ah, saddex iyo labaatankii sano ee xigayna wuxuu dadka ugu yeerayay inay caabudaan Eebbe kaligiis, quluubtoodana nadiifiyaan, caddaalad iyo naxariisna ku noolaadaan – isagoo dhammaystiraya oo xaqiijinaya risaalada nebi kasta oo isaga ka horreeyay.",
      "Jidkiisu waxa uu ahaa mid naf hurid joogto ah. Makkah isaga iyo mu’miniintii hore waxay u samreen jeesjees, jirdil iyo qaadacaada sanado badan. Ka dib waxaa yimid Hijriyadii, u hijradii Madiina, halkaas oo uu ka dhisay bulshadii ugu horreysay ee Muslim ah - oo la dhiso salaadda, walaalaynta muhaajiriinta iyo gargaarayaasha, heshiisyada iyo bulsho ku qotonta tawxiidka. Sanado badan oo dhib iyo guul aakhirka ah, dabeecaddiisu weligeed ma lihin; Quraanku wuxuu ka marag kacay, 'Runtii, waxaad tahay qof akhlaaq wanaagsan leh' (Qur'aanka 68: 4), oo isaga laftiisa ayaa sheegay in loo soo diray si uu u noqdo mid wanaagsan.",
      "Eebe wuxuu ku dhawaaqay isaga 'Rasuulkii Eebe iyo shaabadda Nabiyada' (Qur'aanka 33:40) - isaga dabadiis nabi ma jiro. Mucjisadiisa ugu weyn waa Qur’aanka laftiisa oo ah calaamad waara oo weli haga balaayiin, waxaana lagu sharfay Israa’i iyo Miraaj, safarkii habeenka iyo korkii. Mu'minka, waa uswah hasanah - tusaalaha quruxda badan (Qur'aanka 33:21) - oo Sunnadiisu tahay jidka dhabta ah ee iimaanka. In la jeclaado, hanuunkiisa la raaco, iyo ducadii dushiisa ha ahaatee waxay ku jiiftaa qalbiga nolosha Muslimka.",
    ],
    profile: {
      nation: "Aadminimada oo dhan",
      location: "Maka iyo Madiina",
      era: "Qarnigii 7aad ee CE",
      mission:
        "U gudbi waxyiga kama dambaysta ah oo dhambaal farriinta nebiyada ee dadyowga oo dhan.",
      challenges: [
        "Cadaadiskii iyo Qaadacadii Maka",
        "Isku dhac iyo dhisidda bulsho caadil ah",
        "Gudbinta fariin caalami ah oo ku wajahan qabiilada iyo quruumaha",
      ],
      miracles: [
        "Qur'aanka oo ah mucjiso waara",
        "Israa'iil iyo Mi'raj (safarka habeenka iyo korriinka)",
        "Calaamado badan oo lagu dejiyay idanka Alle",
      ],
      majorEvents: [
        "Bilowgii waxyiga ee Makkah",
        "Hijrada ilaa Madiina",
        "Dhammaystirka dhambaalka iyo khudbadii sagootinta",
      ],
      lessons: [
        "Naxariista iyo akhlaaqda sharafta leh ee hoggaaminta",
        "Ku adkaysiga cadaadiska",
        "Waxyiga iyo Sunnada la wada raac",
      ],
      facts: ["Shaabadda Nabiyada", "Tusaalaha ugu wanaagsan (uswah hasanah) ee mu'miniinta"],
    },
    quran: [
      {
        excerpt:
          "Muxammad ma aha aabbaha mid ka mid ah raggiinna, laakiin waa Rasuulkii Eebe iyo shaabadda Nabiyada.",
      },
      {
        excerpt: "Kuuma aannaan dirin naxariista Caalamka mooyee.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Tusaalahayga iyo tusaalaha nabiyadii iga horreeyey waa nin dhistay guri si qurux badan oo dhammaystiran u dhisan, marka laga reebo hal meel oo leben ah. Anigu waxaan ahay lebenkaas, oo waxaan ahay shaabadda nebiyada.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Duruusta nabiyada la wadaago",
    summary: "Mawduucyada soo noqnoqda: tawxiidka, dulqaadka, towbada, iyo geesinimada akhlaaqda.",
    body: [
      "Qarniyadii oo dhan, nebiyadu waxay ugu yeedheen hal aasaas: Caabuda Alle kaligiis kana fogaada dhammaan noocyada shirkiga. Tani waa udub dhexaadka waxyiga ee aan isbeddelayn.",
      "Noloshoodu waxay sidoo kale muujisaa sabar diidmo ah, oo ay la tashadaan Allaah inta lagu jiro hubanti la'aanta, iyo rabitaanka inay dib u habeyn ku sameeyaan bulshada si caqli iyo geesinimo leh.",
      "Barashada iyaga waxay dhistaa adkeysi: rumaystayaasha waxay bartaan inay si degdeg ah u towbad keenaan, u hoggaansamaan si anshax leh, oo ay ku sii jiraan mabda'a xitaa marka runta aan la jeclayn.",
    ],
    quran: [
      {
        excerpt: "Sheekadoodu waxay cashar ugu tahay dadka wax fahma.",
      },
      {
        excerpt: "Waana kuwa Alle hanuuniyay ee raac hanuunkooda.",
      },
    ],
    actions: [
      "Xulo hal cashar nebiyad usbuuc kasta oo si ula kac ah u isticmaal.",
      "Dib u milicso salaada ka dib meesha aad uga baahan tahay samir badan ama toobad.",
      "Qoyska ama asxaabta si joogto ah u bar hal sheeko nebiyeed oo dhab ah.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Mucjisooyinka iyo calamadaha nabinimada",
    summary:
      "Mucjisooyinku waxay xaq ku xaqiijinayaan idanka Eebbe, laakiin kuma qasbaan rumaynta.",
    body: [
      "Eebe wuxuu nabiyada siiyey calaamado cad cad oo ku haboon bulshadooda: Sanduuqii Nuux, calaamooyinkii Muuse ee Fircoon hortiisa, Mucjisooyinkii Nabi Ciise ee idanka Eebe, iyo Qur'aanka Nabi Muxammad ﷺ.",
      "Mucjisooyinku maaha awoodo madax-bannaan oo nebiyadu leeyihiin; waxay ku dhacaan idamkii Eebe inay u hiiliyaan waxyiga iyo inay cadeeyaan.",
      "Qur'aanku wuxuu muujinayaa in qaar weli la diiday in kasta oo calaamooyinku jiraan, caddaynta hanuunku waxay ku xiran tahay daacadnimo iyo is dhiibid, ee maaha in la daawado oo keliya.",
    ],
    quran: [
      {
        excerpt:
          "Dhab ahaan yaan ugu dirray Rasuuladanadii xujooyin, waxaana ku soo dejinay korkooda Kitaab iyo miisaan.",
      },
      {
        excerpt:
          "Waxaad dhahdaa aayaadku waa Eebe agtiisa...miyayna ku filnayn inaan idiin soo dejinno Kitaabka oo lagu akhriyo.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qur'aanka dulmar nabiyada",
    summary:
      "Quraanku wuxuu magacaabay shan iyo labaatan nebi wuxuuna soo bandhigay hal fariin oo joogto ah.",
    body: [
      "Qur'aanku wuxuu si toos ah u magacaabay shan iyo labaatan nabi wuxuuna tilmaamay rasuul kale oo badan. Sheekadooda waxaa lagu kala qaadaa suuradaha si loo milicsado loona hanuuniyo.",
      "In kasta oo habayntu kala duwan tahay, haddana baaqgoodu waa mid: tawxiid, xaqnimo, xisaabtan, iyo naxariis xagga towbad keenka.",
      "Qaybtani waxa ay ku salaysnaanaysaa Qur'aanka kariimka ah oo waxa ay sii koobaysaa tafaasiisha taariikheed ee labaad haddii aan lagu taageerin caddayn sugan.",
    ],
    quran: [
      {
        excerpt:
          "Dhab ahaan yaan ugu Dirray Hortaa Rasuullo. waxaa ka mid ah kuwaan kugu qisaasinnay, waxaana kamid ah kuwo aanaan ku qaraabin.",
      },
      {
        excerpt:
          "Waxaan rumaynay Eebe iyo waxa la soo dejiyey... iyo wixii laga siiyey Muuse, Ciise iyo Nabiyada xagga Eebahood ka ahaaday.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tixraacyada iyo habka akhriska",
    summary: "Sida loo barto nebiyada si dhab ah, dheelitiran, iyo faa'iido leh.",
    body: [
      "Ku bilow aayado qur’aan ah, kadibna akhri xadiis saxiix ah, kadibna la tasho tafsiirka sugan ee macnaha guud. Amarkani wuxuu ilaalinayaa barashada xididdada muujinta.",
      "Ka fogow wararka dareenka leh ama daciifka ah ee ka hor imaanaya mabaadi'da Qur'aanka ama sharafta nabiga. Sheeko kasta oo caan ah ma laha caddayn cad.",
      "Isticmaal taariikh nololeedka nebiyada si aad u habayso cibaadadaada iyo dabeecadaada, ma aha oo kaliya inaad ururiso xaqiiqooyinka taariikhiga ah.",
    ],
    quran: [
      {
        excerpt: "Kuwa maqla hadalka oo raaca waxa ugu fiican, kuwaasu waa kuwa Eebe hanuuniyey.",
      },
    ],
    hadith: [
      {
        excerpt: "Qofkii mara waddo cilmi raadis ah, Eebbe wuxuu u fududeeyaa jidka Jannada.",
      },
    ],
    actions: [
      "Si toos ah u akhri hal sheeko oo nebi ah toddobaad kasta oo ka mid ah Quraanka.",
      "Ku hayso qoraallada casharrada la taaban karo, ma aha oo kaliya xaqiiqooyinka wakhtiga.",
      "Hubi qisooyinka sare culimo la aamini karo.",
    ],
    disclaimer:
      "Taariikhaha taariikhiga ah iyo goobaha saxda ah way ku kala duwanaan karaan ilo kasta; Xaruntan ayaa mudnaan siinaysa la isku raacay, hagitaan qoraal ku salaysan.",
    appLinks: [{}, {}],
  },
];

export const PROPHETS_BIO_TOPICS_SO: DeepPartial<ProphetsTopic>[] = [
  {
    title: "Aadam (CS)",
    summary:
      "Qofkii ugu horreeyey iyo nebigii ugu horreeyey, oo cilmi lagu sharfay, laguna imtixaanay addeecidda.",
    body: [
      "Aadam (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) waa halka ay ka bilaabmaan taariikhda iyo nabinimada aadamuhu. Eebbana wuxuu ku Abuuray Gacmihiisa Dhoobo, wuxuuna ku afuufay Ruuxiisa, wuxuuna baray Magacyada wax kasta. Markii Malaa'igtii lagu amray inay u Sujuuddaan Aadam way adeeceen, hase ahaatee Ibliis wuu diiday isla wayni, markaas wixii ka dambeeyayna waxaa la caddeeyey cadaawadda uu u qabo Aadam iyo faraciisii. Muuqaalkan furitaanku waxa uu dejinayaa riwaayadda udub dhexaad u ah nolosha aadanaha kasta: doorashada u dhaxaysa addeecidda is-hoosaysiinta iyo fallaagada kibirka leh (Qur'aanka 2:30-39).",
      "Eebe wuxuu geliyey Aadam iyo Xaaskiisii ​​Xaawo Jannada wuxuuna u banneeyey wax kasta oo aan geed keliya ahayn. Shayddaan baa hoos u dhigay, wayna ka cuneen. Laakiin bal u fiirso farqiga u dhexeeya iyaga iyo Ibliis: Ibliis wuxuu xaq u yeelay dembigiisii, Adam iyo Xaawana isla markiiba way qoomameen oo u noqdeen Eebbe erayadii uu baray ee ahaa ‘Eebow waan dulminay nafteena, haddaadan noo dambi dhaafin oodan noo naxariisan waxaan ka mid noqonaynaa kuwa khasaaray’ (Qur’an 7:23). Eebbana wuu ka toobad aqbalay, wuxuuna u soo diray dhulka isagoo ballan ah hanuunka cid kasta oo raaci doonta.",
      "Casharka Aadamku waa casharka rajada: qofka bini'aadamka ah waa karaamo iyo karaamo, haddana waa la imtixaamaa oo simbiriirixayaa. Waxa qeexaya mu'minku in aanu dembi lahayn - Allaah kaliya ayaa kaamil ah - laakiin si degdeg ah oo daacad ah ugu soo laabtay tawbah. Sheekada Aadam waxa kale oo ay ina baraysaa in Shaydaanku yahay cadaw la iclaamiyey, cadawgiisa oo keliya oo hubkiisuna uu ku xanto; jawaabtu waa xuska Alle iyo dambi dhaaf waydiistiisa. Laga soo bilaabo Aadan ilaa iyo, soo degitaanka dhulka ma aha ciqaab ee waa marxaladda imtaxaanka dhabta ah ee aadanaha.",
    ],
    profile: {
      nation: "Dadnimada hore",
      location: "Jannada markaas dhulka",
      era: "Billoowga taariikhda aadanaha",
      mission: "Bar tawxiidka iyo adeecida Alle dadka ugu horreeya.",
      challenges: [
        "Colnimada Ibliis",
        "Nolosha dhulka ka dib",
        "Hagidda qoyska ugu horreeya ee aadanaha",
      ],
      miracles: ["Abuur amar Alle oo waalid la'aan", "La baro magacyada wax walba"],
      majorEvents: [
        "Abuuriddii Aadam iyo Barashada Magacyada",
        "Malaa'igtu sujuud iyo diidid Ibliis",
        "Simbiriirixidda Jannada, toobad dhab ah, iyo u soo degid dhulka",
      ],
      lessons: [
        "Sharafta bini'aadmigu waxay ku soo biirtay xilkasnimo",
        "Towbada daacada ah waxay dib u furtaa albaabka qalad kasta ka dib",
        "Shaydaanku waa cadaw cad oo joogto ah",
      ],
      facts: [
        "Aadam waa bini'aadamka ugu horreeya iyo nabigii ugu horreeyay",
        "Towbaddiisu waa tawbah ugu horreeya ee Qur'aanka",
      ],
    },
    quran: [
      {
        excerpt:
          "(Xusuuso) markuu Eebahaa ku yidhi Malaa'igta waxaan ka yeeli Dhulka Xukun isdhaaf ah...Markaasuu ka Aqbalay Nabi Aadam xagga Eebihiis kalimooyin wuuna ka Toobad aqbalay.",
      },
      {
        excerpt:
          "Waxayna dheheen Eebow waan dulminay nafteena, haddaadan noo dambi dhaafin oodan noo naxariisan waxaan noqonaynaa kuwa khasaaray.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Maalinta qiyaame waxay u iman doonaan dadku Aadam, waxayna ku odhan waxaad tahay aabbaha dadka; Eebahaa agtiisa noo shafeeco.",
      },
      {
        excerpt:
          "Aadam iyo Muuse ayaa ku dooday. Muuse wuxuu yidhi: Adigu waxaad tahay kii Eebbe gacantiisa ku abuuray. Aadam wuxuu yidhi: Ma waxaad igu eedaynaysaa arrin Eebbe ii qoray ka hor intuusan i abuurin? Markaa buu Aadan Muuse kaga adkaaday dooddii.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Idiris (CS)",
    summary: "Nebi run ah ayaa lagu ammaanay samirka oo Eebbe kor ugu qaaday maqaam sare.",
    body: [
      "Idiris (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) Qur’aanka kariimka ah ayaa lagu sheegay oo kaliya, balse eray kasta oo isaga ku saabsan waa ammaan. Eebe wuxuu ugu yeedhay 'Nin run ah, nebi' (Qur'aanka 19:56) wuxuuna ku daray kuwa samra iyo kuwa xaqa ah oo ay weheliyaan Ismaaciil iyo Dhul-Kifli (Qur'aanka 21:85-86). Sheekadiisu waxa ay ku tusinaysaa in Alle agtiisa uu qofka dabeecaddiisa – run-sheegnimada, dulqaadka, cibaadada suubban – ay ka badan tahay inta taariikh nololeedkiisa la joogo.",
      "Eebbana wuxuu isaga ka yidhi, 'Waxaan koryeelay meel sare' (Qur'aanka 19:57). Culimadu waxa ay taas u fahmeen in ay ula jeedaan darajada uu Allaah agtiisa sareeyo. Marka laga soo tago sida uu Qur’aanka iyo warbixinnada saxda ah caddeeyey, sheekooyinka caanka ah ee ku xidhan Idiris (sida in uu yahay qofka ugu horreeya ee qalinka wax ku qora ama mihnadaha gaarka ah ee adduunku) kuma dhisna daliil sugan, sidaa awgeed qofka mu’minka ah oo taxaddar leh waxa uu ilaalinayaa waxa waxyigu caddaynayo halkii uu wax ku qurxin lahaa.",
      "Idriis casharkiisu waxa weeye, u dhawaanshiyaha Alle laguma qiyaaso caannimo iyo sheeko dheer, balse waxa lagu qiyaasaa daacadnimo iyo joogtayn. Adoonka aamusan, run sheegga ah, daacadda ah wuxuu qaban karaa mawqif Eebbe agtiisa ka sarreeya kuwa badan oo magacyadooda si weyn loo xuso.",
    ],
    profile: {
      era: "Qarniyadii hore ee Aadan ka dib",
      mission: "Dadka ugu yeedh inay Alle ku caabudaan si run ah oo xaq ah.",
      lessons: [
        "Runtu waxay kor u qaadaa darajada addoonka",
        "Sheekada nebi kasta maaha mid faahfaahsan - taasina waa naqshad",
        "Joogtaynta, joogtaynta aaminka ah waa mid Eebe jecelyahay",
      ],
      facts: [
        "Qur’aanka oo lagu magacaabay run sheeg iyo nabi",
        "Lagu sifeeyey in uu Allah kor u qaaday meel sare",
      ],
    },
    quran: [
      {
        excerpt:
          "kuna sheeg kitaabka Idiris. Illeen wuxuu ahaa nin run sheeg ah oo nabi ah. Waxaana koryeelay meel sare.",
      },
      {
        excerpt:
          "iyo Ismaaciil, Idiris iyo Dul-kifli, dhammaan waxay ahaayeen kuwa samra. Waxaana Galinay Naxariistanada. Waxayna ahaayeen kuwa dhawrsada.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nuux (CS)",
    summary: "Rasuul samir aan caadi ahayn oo dadkiisa u yeedhay qarniyaal ka hor daad.",
    body: [
      "Nabi Nuux (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) waxa loo diray qoom ka tagay tawxiidka oo u galay cibaadada Sanamyada. Farriintiisii ​​kelida ahayd ee aan leexleexanayn waxay ahayd: 'Dadkaygiiyow, caabuda Eebbe; Ilaah kale ma lihid isaga ka sokoow' (Qur'aanka 7:59). Qur’aanku wuxuu xafiday xisaabtiisa gaarka ah ee risaalada ku jirta suuradda Nuux: wuxuu ugu yeedhay habeen iyo dharaar, fagaare iyo sirba, isagoo u soo jeedinaya dhiirigelin iyo digniin labadaba — isagoo xusuusinaya in dib u noqoshada Eebbe ay keento roob, xoolo, carruur iyo beero. Haddana jiilba jiilba, badankoodu way iska jeesteen, oo faraha ayay dhegaha geliyeen, wayna sii kibreen oo keliya (Qur'aanka 71:1-28).",
      "Qur'aanku waxa uu carrabka ku adkeeyey dhererka dulqaadkiisa: waxa uu ku hadhay iyaga 'kun sano oo konton ka yar' (Qur'aanka 29:14), welina in yar ayaa rumaystay. Markii ay caddaatay in aan iimaan dambe la aqbali doonin, ayuu Eebbe faray inuu ku dhiso doonnida amarka Eebbe iyadoo ay gaaladu ku jees jeesi jireen. Dabadeedna daadkii waxay u yimaadeen xukun. Wiilkii Nuux qudhiisu wuu diiday inuu fuulo, isagoo buur ku aaminay digniintii aabbihiis, wuxuuna ka mid ahaa kuwii qarqmay - xusuusin xun oo ah in xidhiidhka dhiiggu aanu ku beddeli karin rumaysadka (Qur'aanka 11:42-46).",
      "Sheekada Nuux waa darajada sare ee Qur'aanka ee dacwa: qofka wacaya waajibaadkiisu waa daacad, samir, bixin cad - natiijadu waxaa iska leh Allaah oo keliya. Waxa kale oo ay baraysaa in hanuunku yahay arrin qalbiga ku jirta, ee ma aha abtirsiin: wiilka nebigu waa lumin karaa, halka shisheeyuhuna badbaadi karaan. Mu’miniintii doonta fuulay waxay noqdeen farcan bini-aadmi ah oo dib loo cusboonaysiiyay, Nuuxna waxa lagu sharfay inuu ka mid yahay shanta rasuul ee ugu waaweyn ee go’aan adag (ulul-cazm).",
    ],
    profile: {
      nation: "Dadkiisa daad ka hor",
      location: "Gobolka Mesobotaamiya qadiimiga ah (si ballaaran loo tixraaco)",
      era: "qadiimiga aad hore",
      mission: "Umaddiisa ugu yeedh tawxiidka iyo towbada.",
      challenges: [
        "Jees-jees ka imanaya madaxda iyo akhyaarta",
        "Qarniyo diidmo ah oo ay ku yar yihiin rumaystayaasha",
        "Gaalnimadii iyo qaraabadii wiilkiisii",
      ],
      miracles: ["doonnidii lagu dhisay dardaaran Eebbe", "Badbaadinta Mu'miniinta ee daadka"],
      majorEvents: [
        "Baaq tawxiid ah oo soconaya ku dhawaad ​​kun sano",
        "Dhismaha Doonta Amarka Alle",
        "Daadka iyo bilowgii cusub ee rumaystayaasha",
      ],
      lessons: [
        "Ku adkeysiga dacwooyinka, natiijada ka soo baxdana Allaah loo daayo",
        "Xidhiidhka qoysku ma beddeli karo iimaanka",
        "Alle had iyo jeer waa badbaadiyaa kuwa daacadda ah",
      ],
      facts: [
        "Mid ka mid ah shanta rasuul ee go'aan adag (ulul-cazm)",
        "Sheekadiisu waxay ku soo aroortay suurado badan oo ay ku jirto mid isaga loogu magac daray",
      ],
    },
    quran: [
      {
        excerpt:
          "Waxaana loo waxyooday (Nabi) Nuux inaan Qoomkaaga midna rumayn kuwii rumeeyey mooyee, ee ha ka welwelin waxay falayeen.",
      },
      {
        excerpt:
          "Wuxuu yidhi: Eebow anigu waxaan u yeedhay habeen iyo maalin qoomkayga, martiqaadkaygiise uma siyaadinin waxaan carar ahayn.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dadku waxay u iman doonaan Nuux, waxayna ku odhan: Nuuxow waxaad tahay kii ugu horreeyey ee u soo diray dadka dhulka, wuxuuna Eebbe kuugu magacaabay addoon shukriya; noo shafeeco.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Huud (CS)",
    summary: "Waxaa loo diray Caad, oo ah qoom xoog badan, oo xooggoodu isu beddelay kibir.",
    body: [
      "Huud (nabadgelyo korkiisa ha ahaatee) waxa loo soo diray reer Caad, ilbaxnimo Qur’aanku ku tilmaamay inay jir ahaan awood badan tahay, caanna ku ahayd dhisidda dhismayaal dhaadheer oo aad loo faahfaahiyey ‘kuwaas oo la mid ah oo aan weligood dhulka lagu abuurin’ (Qur’an 89:6-8). Dadkan isla weyn ee Huud wuxuu u keenay farriin la mid ah farriintii nebi kasta: 'Dadkaygiiyow, caabuda Eebbe; Eebe mooyee ilaah kale ma lihid. Miyaydnaan isaga ka cabsanayn? (Quraanka 7:65). Wuxuu ahaa mid iyaga ka mid ah, oo aan warsan wax abaal ah, kaliya ugu yeedha inay shugriyaan oo ka fogaadaan dulmiga.",
      "Madaxdoodii ayaa ugu jawaabay majaajilo, oo waxay ku eedeeyeen nacasnimo iyo been, oo waxay ku dhegeen sanamyadii awowayaashood. Waxay ku xujeeyeen inuu keeno ciqaabtii uu uga digay, iyagoo ku kalsoon inaan xoog la mid ahayn xooggooda (Qur'aanka 46:21-25). Huud wuxuu si cad ugu digay in awoodda adduun iyo ilbaxnimada weyni aanay ilaalin qof kasta oo beeniya aayaadka Eebbe oo dhulka ku kibriya.",
      "Xukunku wuxuu u yimid sidii dabayl cadho leh oo qaylo ah oo Eebbe korkooda ku soo rogay toddoba habeen iyo siddeed maalmood oo xiriir ah (Qur'aanka 69: 6-7), taasoo ka dhigtay dadkii xoogga badnaa inay u dhaceen sidii jirro godan - halka Huud iyo mu'miniinta ay ku badbaadeen naxariista Eebbe. Sheekada Caad waxay ku soo noqnoqonaysaa Qur'aanka oo dhan iyadoo digniin taagan ah: Xoog, maal, iyo wax qabadku waa hadiyado lagu qaabilo khushuuc iyo mahadnaq, ee maaha kibir. Ummadi waxay la xisaabtamaysaa Alle si kasta oo ay horumar u gaadho.",
    ],
    profile: {
      nation: "Dadka 'Ad",
      location: "Gobolka Al-Axqaaf ( aagga konfureed Carabta ee tafsiirka qadiimiga ah)",
      era: "Nuux ka dib",
      mission: "Soo celinta tawxiidka, mahadnaqa, iyo cadaalada Caad.",
      challenges: [
        "Kibir wadareed oo xoog iyo maal ku dhisan",
        "Jees jeeska waxyiga iyo nabiga",
        "Codsiga diidmada ah ee ciqaab degdeg ah",
      ],
      miracles: ["Ilaalinta Mu'miniinta inta lagu jiro ciqaabta"],
      majorEvents: [
        "Baaqa towbada iyo mahadnaqa",
        "Digniinta dabayl daran",
        "Halaaggii Caad in ka badan toddoba habeen iyo siddeed maalmood",
      ],
      lessons: [
        "Xoog aan is-hoosaysiin la'aanteed waxay keentaa baabba'",
        "Ummadaha iyo ilbaxnimadaba Allaah ayaa la xisaabtama",
        "Digniinta nebiyadu waa naxariis la soo diro xukunka ka hor",
      ],
      facts: [
        "Sheekada Caad waxay ku soo noqnoqonaysaa Qur'aanka oo dhan si ay digniin ugu noqoto bulshooyinka dambe",
      ],
    },
    quran: [
      {
        excerpt:
          "Caadna waxaan u diray walaalkood Huud. Wuxuu yidhi: Qoomkayow Alle caabuda; Eebe mooyee ilaah kale ma lihid. Miyaydnaan isaga ka cabsanayn?",
      },
      {
        excerpt:
          "Markay arkeen Daruur ku soo fool leh Dooxooyinkooda waxay dheheen kani waa Darruur roob noo keeneysa. Saas ma aha ee waa waxaad ka samraysaan, waxaana ku sugan dabayl cadaab daran.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Saalix (CS)",
    summary:
      "Waxaa loo diray Thamuud, oo la siiyey mucjisadii hasha, waxayna burburiyeen calaamaddii ay dalbadeen.",
    body: [
      "Nabi Saalix (nabadgelyo korkiisa ha yeelee) waxaa loo diray Thamuud, oo ahaa qoom ka dambeeyay Caad, waxayna caan ku ahaayeen inay buuraha ku xardhaan guryihii waaweynaa, kuna noolaayeen raaxo (Qur'aanka 7:74). Wuxuu ku tilmaamay inay walaalo yihiin inay Alle kaligii caabudaan oo ay ka tagaan fasaadka madaxdooda. Markay dalbadeen calaamad ay ku caddeeyaan runnimadiisa, wuxuu Eebe siiyey mid cad oo cad: Hashii oo ku amar-ku-taagnayd inay cabto maalin la magacawdo, iyagiina mid kale (Quraan 26:155-156).",
      "Saalix wuxuu si cad ugu digay: 'Ha ku taabanina xumaan, ooy idinku qabtaan cadaab dhaw' (Qur'aanka 26:156). Calaamaddu waxay ahayd imtixaan xakamaynta - miyay ixtiraami karaan xadka Eebbe dhigay? Laakiin kuwii ugu cuslaa oo iyaga ka mid ah ayaa gawracay oo dilay hashii iyagoo fallaagoobaya, ka dibna waxay ku xujeeyeen Saalix inuu keeno cadaabkii loo ballan qaaday (Qur'aanka 7:77). Dilka geela waxaa lagu magacaabaa falkii kuwa yar ee aadka u liita, haddana dadkii oo dhan ayaa dembiga la wadaagay iyagoo raali ka ah.",
      "Cadaabku wuxuu ku dhacay saddex maalmood gudahood, waxaana ku dhacay qarax weyn iyo dhul-gariir guryahoodii, Thamuudna waxay jiifsadeen nolol la'aan, Eebbena wuu badbaadiyey Saalax iyo kuwii rumeeyey (Qur'aanka 7:78-79; 91:14). Casharku waa af badan yahay: mucjisooyinku ma jilciyaan qalbi madax-adayg; kaliya waxay kor u qaadaan saamiga isla xisaabtanka. Calaamad la weyddiistay oo haddana la diiday waxay noqotay dood ka dhan ah kuwii dalbaday. Xumaanta ka hor aamusnaantuna maaha dhexdhexaadnimo - ummad dhan ayaa loo haystaa inay ka masuul tahay falkii dhawr qof.",
    ],
    profile: {
      nation: "Reer Thamuud",
      location: "Al-Hijr/Waqooyi-galbeed Carabta",
      era: "Kadib 'Ad",
      mission: "Reer Thamuud uga yeedha sanam caabudid iyo fasaad xagga tawxiidka.",
      challenges: [
        "Dalbashada mucjiso, ka dibna diidmo",
        "Diidmada furan ka dib markii calaamad cad la bixiyay",
        "Hanjabaadda Nabi Saalax iyo Mu'miniinta",
      ],
      miracles: ["Hashii la soo diray oo calaamo Alle ka timid oo muuqata"],
      majorEvents: [
        "Muuqaalka hasha iyo biyaha la wadaago",
        "Jidh-jarida iyo dilka hasha",
        "Qaraxii burburiyay kuwii diiday",
      ],
      lessons: [
        "Mucjisooyin ma anfacaan qalbi madax adag",
        "Xadka Eebe u dejiyey oo la jebiyo waxay keenaysaa cawaaqib dhab ah",
        "Oggolaanshaha xumaanta qaybteeda dambigeeda",
      ],
      facts: ["Thamuud waxa ay caan ku ahaayeen in ay buuraha ku xardhaan guryo aad u fiican"],
    },
    quran: [
      {
        excerpt:
          "Tani waa hashii Eebe calaamo idinkaa ah ee ka taga ha ku cunaan dhulka Eebbe hana ku taabanina xumaan ooy idin qabto cadaab daran.",
      },
      {
        excerpt:
          "Reer Thamuud waxay beeniyeen Xad-gudubkoodii Dartiis, markii la soo diray kuwii ugu liitay...Markaasuu ku Halaagay Eebahood Dambigooda Dartiis, wuuna simay.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ibraahim (CS)",
    summary:
      "Khaliilullah, saaxiibka Eebbe iyo tusaalaha tawxiidka saafiga ah, imtixaan kasta wuu imtixaanay oo ku liibaanay.",
    body: [
      "Ibraahiim (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) waa tusaalaha ugu sarreeya Qur’aanka kariimka ah ee tawxiidka saafiga ah ee lagu gaadhay fakar iyo geesinnimo. Isagoo dhalinyaro ah oo mujtamaca ka mid ah oo ku hafanaya cibaadada sanamyada, wuxuu si badheedh ah ula xaajooday dadkiisa, aabbihii iyo xitaa boqorka: qorraxdii, dayaxa iyo xiddiguhuba way dhaceen oo way libdheen, haddaba sidee bay ilaahyo u noqonayaan? (Quraanka 6:75-79). Si uu u muujiyo awood la'aanta sanamyada, wuxuu jebiyey dhamaantood, marka laga reebo kii ugu weynaa, wuxuuna u sheegay dadkiisa inay waydiiyaan sanamyada naftooda waxa dhacay - iyaga oo ku qasbay inay qirtaan ilaahyadooda ma hadli karaan mana is difaaci karaan (Qur'aanka 21: 57-67).",
      "Is-taagiddaas darteed waxaa lagu dhex tuuray dab ololaya, laakiin Eebbe wuxuu amray, ‘Naayow, qabow iyo ammaan u ahaato Ibraahim korkiisa’ (Qur’an 21:69), wuuna soo baxay isagoo aan waxba gaarin. Noloshiisii waxa ay noqotay silsilad imtixaanno ah oo uu la kulmay isdhiibid guud: waxa uu ka soo tagay dalkiisii Alle dartiis, u duceeyey awlaad xaqa ah isagoo duq ah, waxaana la siiyay Ismaaciil iyo Isxaaq, waxaana lagu imtixaamay amar ah in uu huro wiilkiisa uu jeclaa - taas oo aabbe iyo wiilba ay aqbaleen iyagoo u hoggaansan ka hor inta uusan Eebbe soo fursanin wiilka - oo uu dhidibbada u taagay Kacbada Makkah isagoo la jooga Ismaaciil, una baryaya umad mu’miniin ah oo u soo diraysa Rasuul (Quraan) iyo Rasuul dhexdooda ah. 2:124–129; 37:100–107).",
      "Ibraahiim cibaado la'aan awgeed, ayuu Eebe Ibraahim u qaatay khaliil - saaxiib dhow (Qur'aanka 4:125) - oo wuxuu ka dhigay imaam, hoggaamiye u ah aadanaha oo dhan (Qur'aanka 2:124). Dhaxalkiisu wuxuu dhex maraa nebiyadii ka soo farcamay, xajka, iyo aqoonsiga qofka muslimka ah, kaas oo la faray inuu raaco 'Diinta Ibraahim, isagoo u janjeedha xagga xaqa' (Qur'aanka 3:95). Sheekadiisu waxay baraysaa tawakkul imtixaannada ugu adag, in hoggaanka dhabta ahi uu ku dhisan yahay naf hurid, iyo in iimaanka daacadda ahi uu dib u qaabayn karo jiilasha oo dhan.",
    ],
    profile: {
      nation: "Bulshada Mesopotamian iyo Levantine",
      location: "Ciraaq, Levant, iyo Makkah",
      era: "Qarniyadii dhexe",
      mission: "Soo noolee tawxiidka saafiga ah oo dhidibbada u yeel dhaxal waara.",
      challenges: [
        "Ka hor imaanaya kuwa sanamyada caabuda, aabbihiis, iyo boqor daalim ah",
        "U hijrooday dalkiisii ​​hooyo Alle dartiis",
        "Tijaabada hurida wiilkiisii ​​uu jeclaa",
      ],
      miracles: [
        "Dabkii ayaa qaboojiyay oo badbaadiyay amar Alle",
        "Farcan xaq ah oo gabow la siiyey",
      ],
      majorEvents: [
        "Ka doodista iyo jabinta sanamyada",
        "Dab lagu tuuro oo la bixiyo",
        "In Kacbada lagu dhiso Ismaaciil iyo imtixaankii weynaa ee naf hurida",
      ],
      lessons: [
        "Tawakkul (Ilaahay talo saarato) imtixaanada ugu daran",
        "Hoggaanka dhabta ah wuxuu u baahan yahay naf hurid",
        "Iimaanka daacadda ah ayaa dib u qaabayn kara jiilalka",
      ],
      facts: [
        "Waxaa loo yaqaan Khaliilullah, saaxiibka dhow ee Alle",
        "Aabbihii nebiyada ee Ismaaciil iyo Isxaaq",
      ],
    },
    quran: [
      {
        excerpt:
          "(Xusuuso) markuu Ibraahiim ku imtixaamay Eebihiis amarro oo uu fuliyay. Wuxuu yidhi:- Illeen waxaan kaa dhigayaa hogaamiye dadka.",
      },
      {
        excerpt:
          "Waxaan ku nidhi: Naaroow qabow iyo ammaan u ahow Ibraahim korkiisa. Waxayna damceen dhib, waxaana ka yeellay kuwa khasaaray.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Waxaa lagu soo ururin doonaa adigoo caga- cad oo qaawan oo buuryoqab ah. Qofka ugu horreeya ee labisan doono maalinta qiyaame waa Ibraahim.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Luud (CS)",
    summary: "Nebi dadkiisa uga digay akhlaaq xumo aad u wayn oo aanay ummad hortooda samaynin.",
    body: [
      "Nabi Luud (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) wuxuu ahaa qaraabadii Nabi Ibraahiim oo la hijrooday, kadibna waxaa loo diray dadkii Sodom iyo magaalooyinkii u dhowaa. Marka laga soo tago baaqa ah in Eebbe keligiis caabudo, dadkiisu waxay ahaayeen kuwa dambiilayaal ah si xun oo aan xishood lahayn Qur'aanku wuxuu yidhi ' caalamkoo dhan cid hore uma yeelin' - inay u dhowaadaan ragga halkii dumarka, oo ay si cad ugu dhaqmaan xumaanta kulankooda (Qur'aanka 7:80-81; 29:28-29). (Nabi) Luud wuxuu ugu yeedhay si daacad ah, daahirnimo iyo xuduudda dabiiciga ah ee Eebbe dejiyey.",
      "Waxay la kulmeen dib u habeyntiisa dood, laakiin waxay kula kulmeen cadaawad, iyagoo ugu hanjabay inay eryi doonaan oo ku jeesjeeseen baaqiisii ​​wacnaa: 'Ka saara magaaladaada; waa dad daahirsan. (Quraanka 7:82). Xataa gurigiisa dhexdiisa dacwaddu waxay ahayd mid aad u adag - naagtiisu waxay la safan tahay kuwa kharriban oo ma rumaysnayn, taasoo caddaynaysa in hanuunku yahay mid Eebbe siiyey oo aan lagu dhaxlin guur iyo dhiig (Qur'aanka 66:10).",
      "Markii amarku yimid, Alle wuxuu soo diray malaa'ig marti ah. Dadku waxay u yaaceen inay xataa iyaga dhibaateeyaan, Nabi Luudna wuxuu dareemay inuu tabar la’aan yahay ilaa ay malaa’igtu ka caddayso cidda ay yihiin oo ay u sheegeen inuu la baxo Mu’miniinta habeenkii. Markii waagu beryay ayaa magaalooyinkii la rogay oo dhagxaan lagu tuuray (Qur'aanka 11:77-83). Sheekada Luud waa digniin cad oo ah in runta akhlaaqda aysan isbedelin sababtoo ah bulshadu way oggolaatay dembiga waxayna caadi ka dhigtaa si cad - iyo in Eebbe had iyo jeer samatabbixiyo kuwa daacadda ah, si kasta oo ay u yar yihiin.",
    ],
    profile: {
      nation: "Dadka reer Sodom iyo magaalooyinka u dhow",
      location: "Gobolka Badda Dhimatay (oo si ballaaran loo soo xigtay)",
      era: "Waqtigii Ibraahim",
      mission: "Umaddiisa uga yeedha xumaanta cad iyo gaalnimada tawxiidka iyo daahirnimada.",
      challenges: [
        "Anshax-xumada guud ee xididdada loo siibay",
        "Jees-jees iyo handadaad eryi",
        "Gaalnimadii xaaskiisa",
      ],
      majorEvents: [
        "Digniin joogto ah oo ka dhan ah anshax-xumada",
        "Booqashadii Malaa'igtu waxay isu ekeysiiyey marti",
        "Gaddoonkii magaalooyinka",
      ],
      lessons: [
        "Runta akhlaaqdu kuma beddesho ogolaanshaha bulshada",
        "Mu'miniinta waxaa laga yaabaa inay aad u yar yihiin",
        "Eebe wuxuu ka samatabbixiyaa kuwa daacadda ah burbur wadareed",
      ],
      facts: ["Ibraahiim qaraabo ahaa oo isaga la tahriibay oo Sodom loo diray"],
    },
    quran: [
      {
        excerpt:
          "Ma waxaad u dhawaanaysaan niman adduunyo ah ood ka tagaysaan wuxuu Eebbe idiin abuuray oo lammaanayaal ah. Saas ma aha ee waxaad tihiin qoom xadgudbay.",
      },
      {
        excerpt:
          "markuu yimid amarkannagii waxaan ka yeellay hoosteeda magaalooyinka waaweyn, waxaana ku soo daadinnay korkooda dhagaxyo dhoobo ah.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ismaaciil (CS)",
    summary: "Nebi run ah hadalkiisa, ku samra fitnada, Kacbadana dhisay aabbihiis Ibraahim.",
    body: [
      "Ismaaciil (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) wuxuu ahaa curadkii Nabi Ibraahiim, waxaana la siiyay da'da. Noloshiisii ​​waxay ku bilaabatay imtixaan kalsooni badan: amar Alle, Nabi Ibraahiim wuxuu uga tagay ilmo yar oo Ismaaciil ah iyo hooyadii Xajar oo ku sugnaa togga Makkah oo cidlo ah, oo aan wax beero ah ka bixin, biyona aan ka soo bixin. Halkaa ayay ahayd markii Xajar uu ku ordayay biyo raadis inta u dhaxaysa buuralayda Safa iyo Marwah, in Alle uu ka soo burqanayay isha Zamzam- waa fal ay reer Xajar iyo xujay kastaaba ay ilaa maantadan ku raaxaystaan ​​sacii Xajka iyo Cumrada.",
      "Ismaaciil markii uu yaraa waxa uu la kulmay imtixaankii ugu waynaa ee uu aabbihii la garab taagnaa: kolkuu Ibraahim u sheegay aragtidii uu ku huri lahaa, Ismaaciil waxa uu ugu jawaabay isaga oo is-hoosaysiin ah, Aabbow yeel waxa lagugu amray; waxaad i heli doontaa hadduu Eebe idmo kuwa samra\" (Qur'aanka 37:102). Labaduba si buuxda ayay isu dhiibeen, Ilaahayna waxa uu Ismaaciil ku furtay allabari weyn, isaga oo ixtiraamaya addeecidooda weligeed ah. Aabbe iyo wiilkiisiiba waxay si wada jir ah u kiciyeen aasaaskii Kacbada, iyagoo baryaya, Rabbiyow, tan naga aqbal; illeen adaa maqle wax og\" (Qur'aanka 2:127).",
      "Qur’aanku waxa uu ku soo koobay akhlaaqdiisa sadar mudan in la xifdiyo: ‘Wuxuu ahaa mid ka run sheegay ballankii, wuxuuna ahaa rasuul iyo nabi. Wuxuu faray ehelkiisa salaadda iyo sakada, wuxuuna ka raalli noqday Eebihiis’ (Qur’an 19:54-55). Nolosha Ismaaciil waxa ay baraysaa quruxda qofka oo la dhawro, cibaadada sugan, iyo qoyska oo iska kaashada addeecidda Alle. Isaga oo sii maraya, xariiqda nebiyadu waxay ugu dambayntii gaadheen Nebigii ugu dambeeyay, Muxammad ﷺ.",
    ],
    profile: {
      nation: "Dadkii hore ee gobolka Makkah",
      location: "Makkah",
      era: "hijradii Ibraahim ka dib",
      mission: "Tawxiidka iyo cibaadada ooda, ehelkiisana ku fara salaadda iyo sakada.",
      challenges: [
        "Bilawgii qallafsanaa ee nolosha dooxa madhalayska ah",
        "Tijaabada allabariga",
        "Ilaalinta nolosha cibaadada ku salaysan iyo kalsoonida xurmada leh",
      ],
      miracles: ["Isha Zamzam ayaa cidlada ka bixisa", "allabari allabari ka furtay"],
      majorEvents: [
        "Hooyadiis Xajar ayuu kaga tagay dooxa Makkah",
        "Tijaabada allabariga, waxay la kulantay soo gudbin buuxda",
        "Kacbada oo la dhisay Ibraahim",
      ],
      lessons: [
        "Si daacad ah u ilaali balamahaaga",
        "Qoysku waxay iska kaashan karaan cibaadada iyo addeecidda",
        "Dhaxal muqadas ah ayaa u baahan dabeecad adag",
      ],
      facts: [
        "Qur'aanku wuxuu ku tilmaamay inuu run yahay ballankiisa",
        "Awoowe ee qabiilooyinka Carabta iyo line nebiyada final",
      ],
    },
    quran: [
      {
        excerpt:
          "kuna sheeg kitaabka Ismaaciil. Eebbana waa rumeeyey ballankii, wuxuuna ahaa rasuul iyo nabi. Ehelkiisana wuxuu faray salaadda iyo sakada, wuxuuna ahaa mid Eebbe ka raalli noqday.",
      },
      {
        excerpt:
          "markuu Nabi Ibraahiimna kor u qaaday Asaaskii Baytka iyo Ismaaciil waxay dheheen Eebow naga aqbal kannaga. 021-047 Adigu waxaad tahay Maqle wax og.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Isxaaq (CS)",
    summary: "Nabi barakeysan oo loogu bishaareeyay Nabi Ibraahiim iyo Yacquub aabbihiis.",
    body: [
      "Isxaaq (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) waxa u dhashay Nabi Ibraahim iyo Xaaskiisa Saarah iyaga oo da’ ah – Dhalasho ay Malaa’igtu ku bishaaraysay, markii Saara oo da’dii dhalmada dhaaftay ay qosol yaabban ku qososhay. Quraanku waxa uu qoray wakhtigan: 'Waxaan ugu bishaaraynnay Isxaaq iyo, Isxaaq dabadii, Yacquub' (Qur'aanka 11:71). Dhalashadiisu waxay calaamad u ahayd in awoodda Alle iyo naxariistiisa aanay ku xidhnayn xuduudaha caadiga ah ee bini'aadamka, iyo nasteexo u ah qof kasta oo mu'min ah oo sugaya rajo adag.",
      "Qur'aanku wuxuu si joogto ah ugu magacaabay Isxaaq kuwa xaqa ah, la doortay, iyo nebiyada sharafta leh, isaga oo ku sifeeyay isaga iyo Yacquub in la siiyay 'xoog cibaadada iyo aragtida' (Qur'aanka 38: 45-47). Isxaaq xaggiisa waxaa ka yimid Yacquub (Israa'iil), Yacquubna waxaa ka soo degay silsilado dheer oo nebiyo ah oo loo soo diray Banii Israa'iil, si uu Isxaaq u noqdo aabbihii wax sii sheegidda, oo xiriiriye u ah hanuuninta joogtada ah ee qarniyada oo dhan.",
      "Sheekadiisu, in kasta oo si kooban loo sheegay, haddana waxa ay xambaarsan tahay laba cashar oo waara: mahadnaqa hibooyinka Alle innagu mannaystay wixii ka baxsan filashadayada, iyo ogaanshaha in nasabka xaqa ahi yahay ammaano - iimaanku waa in la gudbiyaa, ee maaha in la iska dhaxlo oo keliya. Nimcada la dhex dhigay reer Ibraahim waa la dhawray sababtoo ah waxaa qaadi jiray addoomo Alle u go'ay.",
    ],
    profile: {
      nation: "Bulshooyinka Levantine",
      location: "Levant (Sham)",
      era: "Ibraahim ka dib",
      mission: "Sii wad hanuuninta nebinimada ee faraca qoyska barakeysan ee Ibraahim.",
      miracles: ["Dhalasho ayaa loogu bishaareeyay waalidiinta da'da ah bishaaro ahaan"],
      majorEvents: [
        "Ibraahiim iyo Saarah baa loogu bishaareeyey",
        "Sii wadida abtirsiinta nebiyada ee Yacquub",
      ],
      lessons: [
        "Eebe wuxuu bixiyaa wax ka baxsan filashada aadanaha",
        "Nasabka xaqa ah waa ammaano la ilaaliyo",
        "Badbaadinta aaminka ahi waxay ilaalisaa hanuuninta",
      ],
      facts: [
        "Aabihii Yacquub",
        "Waxaa lagu magacaabay Ibraahim iyo Yacquub oo ah qoys la doortay",
      ],
    },
    quran: [
      {
        excerpt:
          "Naagtiisiina way taagnayd, wayna qososhay. Markaasaan ugu bishaaraynay (Nabi) Isxaaq, Isxaaq dabadiisna Yacquub.",
      },
      {
        excerpt:
          "Xusuuso addoomadanada Ibraahim, Isxaaq, iyo Yacquub, kuwii xoogga badnaa. Annagaa ku doorannay si gaar ah, waana xuska guriga.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yacquub (CS)",
    summary:
      "Waxa kale oo loo yaqaan reer binu Israa'iil, oo ah nebi dulqaadkiisa quruxda badan ee murugada uu ku dayanayo kalsoonida aan la dhayalsan karin.",
    body: [
      "Yacquub (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) oo sidoo kale la odhan jiray Israa'iil, wuxuu ahaa ina Isxaaq iyo aabbihii laba-iyo-tobankii ee noqday qabiilooyinka Banii Israa'iil - oo uu ku jiro Yuusuf. Waxa uu caruurtiisii ​​ku barbaariyay tawxiidka, Quraankuna waxa uu ilaalinayaa axdigii uu ka qaaday sariirtii uu ku dhintay ee ahaa maxaad iga daba caabudaysaan? Waxay ugu jawaabeen, 'Waannu caabudaynaa Ilaahiinna iyo Ilaahii awowayaashiin... Ilaah keliya, isagaannu u hoggaansanahay' (Qur'aanka 2:132-133). Dareenkiisa ugu qoto dheer, ilaa ugu dambeyntii, wuxuu ahaa iimaanka jiilka soo socda.",
      "Tijaabooyinkiisii ​​weynaa waxay ka dhex muuqdaan sheekadii Yuusuf. Markay wiilashiisii ​​la soo noqdeen shaadhka Yuusuf iyo been ay ku sheegeen in Yey cunay, Yacquub wuu arkay dhagartii, mana uu jawaabin isagoo xanaaqsan ee wuxuu ku jawaabi waayay isagoo leh: 'Sabar baa ugu habboon, Eebbana waa ka gargaarkiisa laga wardoonayo waxaad ku tilmaamayso' (Qur'aanka 12:18). Sannado badan oo kala maqnaasho ah ayuu murugooday ilaa, sida Qur'aanku si xushmad leh u sheegay, indhihiisu murugada ka caddadeen - haddana wuu demiyey murugadiisa oo marna kama quusan (Qur'aanka 12:84).",
      "Tusaalaha qalbiga Yacquub waa hal jumlad: ' Ha ka quusanina naxariista Eebe; Dhab ahaan, ma jiro qof naxariista Eebbe ka quusto kuwa gaalada ah mooyee.” (Qur’an 12:87). Isagu waa tusaalaha sabar Jamiil - dulqaad qurux badan - taas oo aan ahayn istiqaalad aan toos ahayn laakiin firfircoon, rajo leh oo ku kalsoon in xigmadda Alle ay soo bixi doonto waqtigeeda. Markii Yuusuf ugu dambayntii loo soo celiyey, araggiisiina soo noqday, samirkaas waa la xaqiray. Yacquub waxa uu barayaa qof kasta oo mu’min ah oo murugaysan in uu murugada iyo yaqiinsigaba isku qalbi ku haysto.",
    ],
    profile: {
      nation: "Asalka reer banii Israa'iil",
      location: "Levant, oo la socda socdaalka Masar",
      era: "Qarnigii Yuusuf",
      mission: "Reerkiisa iyo tafiirtiisa ku hogaami.",
      challenges: [
        "Xiisad iyo hinaaso ka dhex aloosan wiilashiisa",
        "Kala fogaanshihii dheeraa ee Yuusuf",
        "U adkaysta murugo qoto dheer oo aan rajo beelin",
      ],
      majorEvents: [
        "Taladiisii ​​iyo axdigii tawxiidka ee wiilashiisa",
        "Sanado badan oo sabar u ahaa Yuusuf",
        "Kulankii farxadda badnaa ee Yuusuf Masar",
      ],
      lessons: [
        "Samir qurux badan (sabr jamil) waa firfircooni, iimaan rajo leh",
        "Waalidiintu waxay qaabeeyaan dhaxalka iimaanka ee carruurtooda",
        "Marna ha ka quusan naxariista Alle",
      ],
      facts: ["Sidoo kale loo yaqaan Israa'iil", "Aabihii Yuusuf iyo Reer Banii Israa'iil"],
    },
    quran: [
      {
        excerpt:
          "Wuxuu yidhi: Saas ma aha, naftiinnu wax bay idin sasabisay. Markaa dulqaadku waxa ugu habboon. Mindhaa Eebbe wuu ii wada keeni doonaa dhammaantood.",
      },
      {
        excerpt:
          "Waxayna dheheen waan caabudaynaa Eebahaa iyo Ilaahii Aabayaashiin Ibraahiim, Ismaaciil, Isxaaq, waana Ilaah kaliya, isagaana u hogaansamay.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yuusuf (CS)",
    summary:
      "Nebi uu ceelka uga soo socdaalay carshigii Masar wuxuu baraa daahirnimo, samir iyo cafis.",
    body: [
      "Yuusuf (nabadgelyo korkiisa ha yeelee) waa mawduuca qisadii Qur’aanka ee ugu dhammaystiran — Suuradda Yuusuf, taasoo Eebbe ugu yeedhay ‘sheekooyinka ugu wanaagsan’ (Quraan 12:3). Isaga oo wiil ah waxa uu arkay riyo dhab ah oo kow iyo toban xiddigood, qorrax iyo dayaxa u sujuudsan. Walaalihiis oo masayrsan ayaa ceel ku tuuray oo waxay ka iibiyeen Masar, markaasaa laga soo iibsaday gurigii nin xoog badan. Dib-u-noqosho kasta, Yuusuf wuxuu ilaalin jiray iimaankiisa iyo daacadnimadiisa.",
      "daahirnimadiisa ayaa la tijaabiyay markii naagtii sayidkiisu ay damacday inay sasabato. Wuu diiday, isagoo leh, 'Alle ayaan magangal u ahay', wuxuuna ka door biday xabsiga dembiga: 'Xabsigu waa iga jecel yahay waxa ay iigu yeedhaan' (Qur'aanka 12:33). In kasta oo aanu dambi lahayn, haddana sannado ayuu xidhnaa - oo xataa halkaas ayuu maxaabiistii saaxiibbadiis ah ugu yeedhay inay tawxiideeyaan oo uu riyooyinkooda fasiro. Markii boqorku ku riyooday toddoba sannadood oo abaar ah ayaa barxaddii ku wareertay, Yuusuf hadiyaddii fasiraada ee Ilaah siiyey ayaa boqorkii hor keenay, oo isna wuxuu u dhiibay madaxii khasnadaha Masar. Waxa uu ummadda abaaro ku maamulay caqli iyo caddaalad.",
      "Sheekadu meesha ugu sarreysa ma aha awood ee waa cafis. Markii walaalihiis oo gaajo dartay ay soo hor istaageen iyaga oo aan garanayn ayaa Yuusuf is muujiyey oo yidhi, Maanta korkiinna dambiile ma aha. Eebbana waa kuu dambi dhaafi, isagaana naxariista ugu naxariista.” (Qur’an 12:92). Wanaag kasta ayuu Alle ku mannaystay, isaga oo sheegay in Rabbigii uu u naxariistay markii uu xabsiga ka soo saaray oo uu reerkii isu keenay. Yuusuf waxa uu barayaa in dhawrsanaanta iyo taqwadu ay ilaaliyaan qofka mu’minka ah, in qorshaha Eebbe uu si deggan u baabi’iyo dhagar kasta oo bani’aadam ah, iyo in dembi-dhaafka-aan ahayn aargoosi- ay tahay astaanta qofka sharafta leh.",
    ],
    profile: {
      nation: "Qoyska reer Banii Israa'iil ee Masar",
      location: "Kanaan iyo Masar",
      era: "Muuse ka hor",
      mission: "Tawxiidka, daahirsanaanta, iyo cadaalada kor u qaad adigoo bulshada u adeegaya.",
      challenges: [
        "Khiyaanada walaalihiis",
        "Jirrabaadda iyo cayda beenta ah",
        "Xabsi dheer inkastoo aan dambi lahayn",
      ],
      miracles: ["Hibada uu Eebbe siiyey ee fasiraada riyada dhabta ah"],
      majorEvents: [
        "Ceelkii iyo kala taggii aabbihii",
        "Sanadihii xabsiga",
        "Masar u sara kacay oo reerkiisii ​​la midoobey",
      ],
      lessons: [
        "Dhowrsoonaanta iyo daacadnimada ayaa ilaaliya iimaanka",
        "Cafisku waxay bogsiisaa qoysaska",
        "Qorshaha Eebbe wuu ka sarreeyaa dhagar kasta oo aadanaha",
      ],
      facts: [
        "Suuratu Yuusuf oo dhan, oo loogu magac daray sheekadii ugu fiicnayd, waxay udub dhexaad u tahay noloshiisa",
      ],
    },
    quran: [
      {
        excerpt:
          "Wuxuu yiri:- maanta wax eed ah idinkuma dhacayso. Allaah ha ku cafiyo; waana kan ugu naxariista badan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Akhyaarta, ibnu gob, ina gob, ibnu gob: Yuusuf bin Yacquub, bin Isxaaq, bin Ibraahim.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shucayb (CS)",
    summary:
      "Nebi iimaanka ku xidhay daacadnimada ganacsiga, ugana digay Madyan khiyaanada iyo caddaalad-darrada.",
    body: [
      "Shucayb (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) waxaa loo diray reer Madyan oo ah bulsho ganacsi oo dhaqaalaheedii kharribtay khiyaamo: oo miisaan iyo miisaan gaaban bixin, dadkana ku xad-gudbi jirtay alaabtoodii, dhulkana ku fidisay dulmi. Farriintiisu waxa ay midaysay labada qaybood ee iimaanka oo ay dadku inta badan isku dayaan inay kala saaraan - cibaadada iyo akhlaaqda: 'Dadkaygow, caabuda Eebbe; Eebe mooyee ilaah kale ma lihid. Oofiyana miisaanka iyo miisaanka si caddaalad ah, dadkana ha ka duwinina xaqooda (Quraan 11:84-85).",
      "Dadkiisii ​​way is hortaageen, iyagoo si jees-jees ah u weydiinaya bal inay salaaddiisu uga baahan tahay inay ka tagaan caadooyinka khiyaanada leh ee aabbayaashood oo ay sameeyaan waxay raalli ka yihiin maalkooda (Qur'aanka 11:87). Way ku jees jeesi jireen, wayna ku hanjabeen isaga iyo mu’miniinta in la eryi doono, xitaa waddooyinka ayay xireen. Shucayb waxa uu ku adkaystay naxariis iyo waano cad, isaga oo ku adkaystay in uu dib u hagaajin doono inta uu awoodo, liibkiisuna waxa uu ahaa mid xagga Alle kaligii ahaa: “Liibaanayguna ma aha waxaan Eebbe ahayn. Xaggiisaan talo Saaray, Xaggiisaana u noqon (Quraan 11:88). Waxaa lagu xasuustaa aftahannimadiisii ​​uu dadkiisa ugu yeeri jiray.",
      "Markay ku adkaysteen diidmadii waxaa u yimid cadaab oo qabtay kuwii dulmi falay, Eebbena wuu badbaadiyay Shucayb iyo mu'miniintii (Qur'aanka 7:91-93). Taariikh-nololeedkiisu waxa uu bixinayaa cashar inta badan la iska indho-tiray: Daacadnimada dhaqaale kama soocna diinta - waa qayb ka mid ah. Khiyaanada suuqa, ka faa’iidaysiga dadka jilicsan iyo wax qabadku waa arimo iimaan leh, bulshada cadaalad darada xalaalaysa waxay u yeedhaa xukun Alle.",
    ],
    profile: {
      nation: "Reer Madyaan",
      location: "Waqooyi-galbeed ee Carabta / gobolka ganacsiga Levantine",
      era: "Ka dib qarniyadii Ibraahim",
      mission: "Tawxiidka ugu baaqa daacadnimada iyo cadaalada ganacsiga.",
      challenges: ["Musuqmaasuqa suuqa ka jira", "Jees-jees ka imanaysa", "Hanjabaadda cayrinta"],
      majorEvents: [
        "Baaqa ku wajahan cabbir buuxa iyo macaamil cadaalad ah",
        "Mucaarad shacab iyo hanjabaad",
        "Cadaabka kuwa xaqa Beeniyey",
      ],
      lessons: [
        "Iimaanku wuxuu dalbanayaa daacadnimada ganacsiga",
        "Cadaalad darada dadweynuhu waxay soo dhawaynaysaa xukun ilaahay",
        "Nebiyadu waxay ka hadlaan anshaxa bulshada iyo dhaqaalaha, maaha caado kali ah",
      ],
      facts: ["Waxaa loo yaqaanaa xoojinta miisaanka iyo cabbirrada"],
    },
    quran: [
      {
        excerpt:
          "Dadkaygoow Alle caabuda; Eebe mooyee ilaah kale ma lihid. Oofiya miisaanka iyo miisaanka dadkana ha ka duwinina dhulka, hana fasaadinina.",
      },
      {
        excerpt:
          "Guushayduna ma aha ee waa xagga Allaah. Isagaan talo saartay, xaggiisaana u noqon.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ayuub (CS)",
    summary:
      "Qaabka Sabirka Qur'aanka: Cibaadada oo aan la gariirin xanuun iyo khasaare daba dheeraatay.",
    body: [
      "Ayuub (nabadgelyo korkiisa ha ahaatee) - Ayuub - waa calaamadda sabir ee Qur'aanka kariimka ah. Waxa uu ahaa nabi ku manaystay caafimaad, maal iyo qoys, ka dibna lagu imtixaamay in ay waayaan, iyo xanuun dheer oo xanuun badan. Waxaas oo dhan kamuusan xanaaqin, mana uu eedayn Eebihiis dulmi; Mahadnaq iyo xusuus ayuu ku dhegay. Qur’aanku wuxuu ku ammaanay erayo soo koobaya sheekadiisa oo dhan:- Waxaan ka helnay samir iyo addoon wanaagsan. Dhab ahaantii, wuxuu ahaa mid si isdaba joog ah ugu soo laabanaya Alle\" (Qur'aanka 38:44).",
      "Markay ugu danbeyn dhibtii noqotay mid xad dhaaf ah, u fiirso hab-dhaqanka qumman ee ducadiisa. Ma uu dalban, kamana cabanin xukunka Alle; wuxuu si fudud oo khushuuc leh u hor dhigay Eebihiis: 'Waxaa i taabtay dhib, adiguna waxaad tahay kan naxariista badane' (Qur'aanka 21:83). Isla markiiba su’aasha la waydiiyey ayuu Alle u naxariistay. Markaasaa Ilaah u jawaabay oo ku yidhi, Dhulka ku dhufo; Kani waa qubays qabow iyo cabbid, wuuna ka saaray dhibkii wuxuuna soo celiyay ehelkiisii ​​iyo in ka badan, naxariis xaggiisa ah iyo waanada kuwa caabuda (Quraanka 21:84; 38:41-43).",
      "Ayuub waxa uu barayaa in sabarku aanu ahayn adkaysi nafsi ah balse uu yahay nooc cibaado oo firfircoon - dib ugu noqosho joogto ah oo Alle loogu noqdo inta lagu jiro tijaabada. Tusaalahiisu waxa kale oo uu sifeeyaa sida aynu u duceyno: si khushuuc leh, iyada oo aan laga cabanaynin xukunka, iyo si yaqiin ah naxariista Eebe. Waxayna u dhammayntiisa u xaqiijinaysaa qof kasta oo rumaystay oo la imtixaamay in imtixaannada oo uu iimaanku kaashado ay kor u qaadi karaan darajada addoonka oo ay mar walba ku xigto nafis waqtiga Alle.",
    ],
    profile: {
      era: "Waagii nebiyadii Ibraahiim kadib (macnaha guud)",
      mission: "Umaddiisa hanuuniyo isagoo sabar iyo cibaado ku sahabsan dhibka.",
      challenges: [
        "Xanuun dheer oo xanuun badan",
        "Xoolo iyo qoys khasaaray",
        "U adkaysiga imtixaan dabadheeraad ah",
      ],
      miracles: [
        "Caafimaad iyo nasteexo Amarka Alle",
        "Soo celinta qoyska iyo ducada ka dib tijaabada",
      ],
      majorEvents: [
        "Baryootankiisa is-hoosaysiinta markuu dhib ku jiro",
        "Caawinta Rabbaaniga ah, bogsiinta, iyo soo celinta",
      ],
      lessons: [
        "Samirku waa cibaado firfircoon",
        "Ducadu waxa ay aad u qurux badan tahay marka ay is-hoosaysiiso oo bilaa cabasho ah",
        "Tijaabooyin lagu qaado iimaanku waxay kor u qaadi karaan darajada qofka",
      ],
      facts: ["Waxaa lagu soo qaatay dhaqanka Islaamka oo dhan inuu yahay tusaalaha sabirka"],
    },
    quran: [
      {
        excerpt:
          "Ayuubna markuu u Dhawaaqay Eebihiis: Waxaa I Taabtay Dhib, Adiguna waxaad Tahay Naxariis badane.",
      },
      {
        excerpt:
          "Waxaan ka helnay samir iyo Addoon wanaagsan. Dhab ahaan, wuxuu ahaa mid si isdaba joog ah u soo laabanaya Eebbe.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dhul-Kifl (CS)",
    summary:
      "Nabi xaq ah oo lagu tirin jiray kuwa samra, la sharfay in kastoo sheekadiisu kooban tahay.",
    body: [
      "Dhul-kifli (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) laba jeer ayuu Qur’aanka ku soo arooray, labada jeerna wuxuu ku dhex jiray Nabiyada sharafta leh. Eebe wuxuu ku qoray Ismaaciil iyo Idiris - 'dhammaantood waxay ahaayeen kuwa samra. Waxaana Galinay Naxariistanada. (Qur'aanka 21: 85-86) - oo haddana wuxuu ku xusay isaga oo ka mid ah kuwa ugu wanaagsan Ismaaciil iyo Al-Yasaa' (Qur'aanka 38: 48). Xusid kastaa waa ammaan, inkastoo aan sheeko tafatiran laga bixin.",
      "Sababtoo ah Qur'aanka iyo Sunnada saxda ah ma sii ballaariyaan noloshiisa, culimada qadiimiga ah waxay ku kala duwan yihiin xitaa faahfaahinta aasaasiga ah - qaar ayaa tixgeliya inuu ahaa nebi ama nin xaq ah, inkastoo lagu tiriyo nabiyada liiska muslimiinta caadiga ah. Mu'minka taxaddarka leh wuxuu diidaa inuu aamusnaanta ka buuxiyo sheekooyin aan la hubin, wuxuuna qabtaa beddelka waxa Eebbe caddeeyey ee ah inuu ahaaday samir iyo caddaalad, taasina waa sharaf ku filan.",
      "Ku daristiisu waxa ay xambaarsan tahay cashar aamusan oo ah: Ma aha addoon kasta oo Alle jecel yahay in uu ka tago sheeko caan ah. Adeeg joogto ah, daacad ah - nooca aan waligiis taariikhda lagu qorin laakiin si buuxda u yaqaan Eebbe - waa nooca saxda ah ee lagu kasbado naxariistiisa. Adkaysi qarsooni ma yara; Waa maaddada nolosha xaqa ah.",
    ],
    profile: {
      era: "Xilliyadii nebiyada ka hor Ciise (si ballaadhan loo dhigay)",
      mission: "Dadkiisa ugu yeedh addeecidda iyo xaqa.",
      lessons: [
        "Samirku waa udub dhexaadka dabeecadda nebiyada",
        "Faahfaahin xaddidan ayaa weli xambaarsan hagitaan xooggan",
        "Aaminnimo, adeeg aan la arkayn waa mid Eebbe jecel yahay",
      ],
      facts: [
        "Waxaa lagu magacaabay Ismaaciil iyo Idiris oo ka mid ahaa bukaannada",
        "Waxaa lagu tiriyaa nabiyada liiska muslimiinta caadiga ah",
      ],
    },
    quran: [
      {
        excerpt:
          "iyo Ismaaciil, Idiris iyo Dul-kifli, dhammaan waxay ahaayeen kuwa samra. Waxaana Galinay Naxariistanada. Waxayna ahaayeen kuwa dhawrsada.",
      },
      {
        excerpt:
          "Xusuuso Ismaaciil, Al-Yasaa', iyo Dul-kifli, dhammaantoodna waxay ka mid yihiin kuwa muuqda.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Muuse (CS)",
    summary:
      "Rasuulkii weynaa wuxuu u diray Banii Israa’iil oo ka horyimid taliskii Fircoon oo qaatay Tawreed.",
    body: [
      "Nabi Muuse (cs) waa nebigii ugu badnaa ee lagu sheegay Qur’aanka kariimka ah, qisadiisana waa mid aad u faahfaahsan. Wuxuu ku dhashay amarkii Fircoon ee ahaa in la laayo wiilasha reer Banii Israa'iil, isaga oo ilmo yar ayaa lagu dhex riday dambiisha webiga Niil hooyadiis - waxyiga Alle - iyo, qorshaha Alle, oo lagu koray qasrigii Fircoon (Qur'aanka 28: 7-13). Sannado ka dib markuu Masar ka dhoofay oo uu ku aqal galay Madyan, ayaa Alle uga yeedhay dooxada xurmada leh ee Tuwa, markaas ayuu Eebbe si toos ah ula hadlay, una tusay calaamadda usha iyo gacanta, una diray walaalkii Haaruun oo u diray daalimkii Fircoon (Qur’an 20:9-36).",
      "Ujeedadiisu waxay ahayd inuu gaarsiiyo laba arrimood: ku baaqidda in Alle keligii la caabudo, iyo in la xoreeyo reer binu Israa'iil ee dulman. Fircoon oo ilaah sheegan jiray ayaa la kulmay is-diiddan, oo xataa calaamooyin cad-cad ka dib-ushii mas noqotay oo liqday dhagartii saaxiriinta, iyo belaayooyinkii, wuu diiday inuu is dhiibo. Nabi Muuse markuu Banii Israa’iil soo saaray ayaa Fircoon ka daba-tagay ilaa badda. Halkaas ayuu Eebbe ku amray, ‘Ku dhufo ushaada badda, wayna kala go’day, markaasay Mu’miniintu u gudbeen dhul engegan iyadoo Fircoon iyo ciidankiisii ​​ay ku qaraqmeen (Qur’an 26:63-66).",
      "Laakin xorayntu waxay ahayd bilow uun. Nabi Muuse waxa uu ku dadaalay in uu hogaamiyo dad adag oo aan inta badan mahadin: waxa uu helay Tawreed buurta, waxa uu soo noqday oo uu arkay iyaga oo caabudaya weyl dahab ah; wuxuu la kulmay cabashooyinkooda, dalabaadkooda, iyo caasinimadooda oo uu la kulmay hoggaan dulqaad leh oo adag. Nolosha Muuse waxay ku biirtay laba mawduuc oo waaweyn - geesinnimada ka hortagga caddaalad-darrada iyo dulmiga, iyo dulqaadka looga baahan yahay inay dadka ku hagto addeecidda marka ay xoroobaan. Isaga oo ka mid ah ulul-cazm, waxa uu tusaale u yahay dib-u-habaynta iyo adhijirka bulsho labadaba.",
    ],
    profile: {
      nation: "Banii Israa'iil (oo ay la socoto baaqa loo jeedinayo qoomkii Fircoon)",
      location: "Masar iyo Siinay",
      era: "Daawuud iyo Sulaymaan ka hor",
      mission: "Tawxiidka u yeedh, oo ka hor taga dulmiga Fircoon, oo Tawreed gaadhsiiya.",
      challenges: [
        "Isagoo ka horyimid Fircoon oo ilaahnimo sheegtay",
        "Hoggaaminta dad iska caabida oo aan la mahadin",
        "Hoggaan joogta ah oo cadaadis joogto ah lagu hayo",
      ],
      miracles: [
        "Ushii oo abeeso isu rogtay",
        "In badda lagu kala tago amar Alle",
        "Calaamadihii badnaa ee Fircoon hortiisa lagu muujiyey",
      ],
      majorEvents: [
        "Allaah isaga oo kula hadlaya dooxada xurmada leh",
        "Iska horimaadkii Fircoon iyo Saaxiriintii",
        "Baxniintii iyo soo dajintii Tawreed",
      ],
      lessons: [
        "Si geesinnimo leh ugu istaaga ka hortagga dulmiga",
        "Hoggaaminta dadka waxay u baahan tahay dulqaad weyn",
        "Xoriyadda waa in lagu biiraa in Alle la adeeco",
      ],
      facts: [
        "Mid ka mid ah shanta rasuul ee go'aan adag (ulul-cazm)",
        "Waxaa la oran jiray Kalimullaah - waa kii Alle si toos ah ula hadlay",
      ],
    },
    quran: [
      {
        excerpt:
          "anna waan idin doortay ee maqla waxa la soo dejiyey. Runtii, anigu waxaan ahay Allaah. Aniga mooyee ilaah kale ma jiro ee i caabud oo ooga salaadda xuskayga.",
      },
      {
        excerpt:
          "Waxaana u Waxyoonay (Nabi) Muuse Hooyadiis Nuuji, haddaad ka Cabsatana ku Tuur Wabiga, hana Cabsan hana Murugoon. Annagaa idiin soo celinaynaa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Malaggii geerida ayaa loo soo diray Muuse. Markuu u yimid ayuu Nabi Muuse wax ku dhuftay, Eebbana wuu u soo celiyey oo ka door biday inuu geeriyoonayo.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Haaruun (CS)",
    summary:
      "Walaalkii codkarnimada badnaa ee Muuse, wuxuu u magacaabay inuu nebigiisa u hiiliyo Fircoon hortiisa.",
    body: [
      "Haaruun (nabadgelyo korkiisa ha yeelee) wuxuu ahaa nabi Muuse walaalkii ka weynaa, nabina isaga qudhiisa. Markii Eebbe u soo diray Muuse Fircoon, Muuse wuxuu weydiistay taageero: 'Iga yeel mid qoyskayga ah wasiir haaruun, walaalkay. Xooggayga ku kordhi isaga, oo ha la qaybsado hawshayda' (Qur'aanka 20:29-32). Eebbe wuu aqbalay codsigii, Quraankuna wuxuu qoray jawaabtiisa: 'Waxaan ku xoojinaynaa cududdaada walaalkaa' (Qur'aanka 28:35). Haaruun oo lagu tilmaamo in uu ka hadallo badan yahay ayaa Muuse garab istaagay markii ay farriinta Alle u gudbinayeen daalimkii.",
      "Waqtigiisii ​​ugu badnaa ee imtixaanku wuxuu yimid markuu Muuse maqnaa. Nabi Muuse markuu u baxay inuu Tawreed ku qaabilo buurta, Banii Israa’iil waxay ku dhaceen inay caabudaan weyl dahab ah. Haaruun wuxuu damcay inuu dib u celiyo, isagoo u digaya, dadkaygow waxaa uun laydin imtixaamayaa, Eebihiinna waa Naxariista ee i raaca oo adeeca amarkayga, laakiin way ka adkaadeen amarkiisii ​​waxayna ku dhawaadeen inay dhib u geystaan ​​(Quraanka 20:90-94). Markii uu Muuse soo noqday isagoo cadhaysan, Haaruun waxa uu sharraxay inuu ka baqay in haddii si xoog leh loo dhaqmo ay bulshada u kala qaybiso kooxo iska soo horjeeda ka hor inta aanu Muuse soo noqon (Qur’aanka 7:150).",
      "Taariikh-nololeedkii Haaruun waxa uu iftiimiyay qiimaha ay u leedahay in la wada shaqeeyo oo loo adeego Eebbe – risaalada ay wadaan laba ayaa ka xoog badan hal-iyo xikmadda jilicsan ee ilaalinta midnimada iyada oo aan marnaba runta la dhimin. Mararka qaarkood hoggaanka daacadda ahi waxa ay la macno tahay in la isku hayo bulsho burbursan oo la xakameeyo waxyeellada ilaa inta arrimaha la saxayo. Haaruun wuxuu Qur'aanka ku karaameeyey kuwa hanuunsan dhexdooda, wuxuuna Eebe uga tagey isaga iyo Muuse ammaan waarta qarniyadii dambe (Qur'aanka 37:119-122).",
    ],
    profile: {
      nation: "Banii Israa'iil",
      location: "Masar iyo Siinay",
      era: "Waagii Muuse",
      mission: "Muuse ku taageer u yeedhida tawxiidka iyo hanuuninta reer binu Israa'iil.",
      challenges: [
        "Iska hor imaadka nidaamka Fircoon",
        "Maareynta bulshada intii Muuse maqan yahay",
        "Ka hortagga kala qaybsanaan weyn oo dadka dhexdooda ah",
      ],
      majorEvents: [
        "Magacaabis wasiir iyo taageero Muuse",
        "Risaalada Fircoon ka hor",
        "Tijaabada kubka dahabka ah",
      ],
      lessons: [
        "Wadashaqeynta kooxdu waxay xoojisaa baaqa Alle",
        "Hoggaaminta mararka qaarkood waxay la macno tahay in dadka la isku hayo marka ay dhibaato jirto",
        "Midnimada la ilaaliyo oo aan marna runta la dhimin",
      ],
      facts: ["Walaalkii ka weynaa Muuse", "Quraanku ku amaanay aftahannimadiisa"],
    },
    quran: [
      {
        excerpt:
          "Oo ii magacaw wasiir reerkayga ah - Haaruun walaalkay. Isaga ku kordhi xooggayga oo ha la qaybsado hawshayda.",
      },
      {
        excerpt:
          "Wuxuu yidhi: Ina Hooyaday dadkii waa iga xoog bateen oo waxay doonayeen inay i dilaan ee yeyna igu farxin cadawgu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Daawuud (CS)",
    summary:
      "Nebi-boqor la siiyay xikmad, caddaalad, iyo Zabuur, iyo tusaale hoggaaminta cibaadada ku salaysan.",
    body: [
      "Daa'uud (nabadgelyo korkiisa ha ahaatee) - Daa'uud - wuxuu bilaabay isagoo dhallinyaro ah oo ka mid ah ciidankii Taluud (Saa'uul) ee ka soo horjeeday Jaluut (Jaaluud). Daawuudna waa kii dilay Jaaluut, ‘Eebe wuxuu siiyey xukun iyo xigmad, kana baray wuxuu doono’ (Qur’an 2:251). Eebbana wuxuu siiyey boqornimo, nabinimo iyo kitaab soo dejiyey oo ah Zabuur (Sabuurrada), taasoo ka dhigtay tusaale naadir ah oo ka mid ah hoggaamiyeyaasha sidoo kale ahaa cibaadada daacadda ah.",
      "Eebe wuxuu siiyey hadiyado cajiib ah: Buuraha iyo Shimbiruhu waxay ku wehelin jireen ammaanta Eebbe, birtana waxaa laga yeelay gacmihiisa si uu u xidho hubka (Qur'aanka 21:79; 34:10-11). Hase yeeshee awooddaas oo dhan, Daawuud wuxuu ahaa mid aad u hooseeya oo daacad ah. Cibaadadiisa aad bay u kululaatay oo uu Nabigu ﷺ ku tilmaamay soonka Daawuud -soon maalin kasta - inuu yahay soonka Alle loogu jeclaaday, salaaddiisa habeenkiina ay tahay salaadda loogu jecelyahay. Quraanku waxa kale oo uu soo bandhigay qiso xukun ah oo Daawuud, si tartiib ah u saxay, isla markiiba u sujuuday, cafis waydiistay, oo u soo noqday Eebihiis (Qur'aanka 38:24) - xooggiisu marna kama sarreynin xisaabtanka.",
      "Dawud noloshiisii ​​waxay baraysaa in maamulku yahay kalsooni, ee aanu ahayn mudnaan. Eebbe wuxuu si toos ah ula hadlayaa: ‘Daa’uudow, waxaanu kaa yeellay beddelka dhulka, ee ku kala xukun dadka si dhab ah, hana raacin niyadda’ (Qur’an 38:26). Cadaaladda, xuska Alle oo joogto ah, towbada degdega ah, iyo nolosha cibaadada oo habaysan ayaa ah waxa lagu hago hoggaanka xaqa ah. Awooddu waxay ugu badbaado badan tahay gacmaha kan ugu rukuucsan.",
    ],
    profile: {
      nation: "Banii Israa'iil",
      location: "Gobolka Jerusalem",
      era: "Kahor taladii Sulaymaan",
      mission: "Cadaalad ku hogaami, xaqana ku kala xukun, dadkiisana Alle ugu yeedh.",
      challenges: [
        "Miisaanka masuuliyadda garsoorka",
        "Isku dheelitirka awoodda iyo is-hoosaysiinta",
        "La xisaabtanka dadweynaha ee hoggaanka",
      ],
      miracles: [
        "Buuraha iyo Shimbiraha oo Eebe la tasbiixsada",
        "Bir baa ku jilcisay gacmihiisa idamkii Alle",
      ],
      majorEvents: [
        "Jabkii Jaaluut ku dhacay yaraantiisii",
        "Boqornimada, Nabinimada, iyo waxyigii Zabuur",
        "Dhaxalku wuxuu u gudbay wiilkiisii ​​Sulayman",
      ],
      lessons: [
        "Cadaaladdu waxay udub dhexaad u tahay xukunka xaqa ah",
        "Si degdeg ah u toobad keen qalad kasta ka dib",
        "Nolosha edaabta leh ee cibaadadu waxay xoojisaa hogaaminta",
      ],
      facts: [
        "Qaata Zabuur (Sabuurradii)",
        "Waa laga adkaaday Jaluut (Jaalaad) isagoo dhallinyaro ah",
      ],
    },
    quran: [
      {
        excerpt:
          "Daawuudoow waxaan kaa yeellay mid Dhulka u hadha, ee ku kala xukun dadka si Xaq ah hana raacin Xumaanta, waxayna kaa dhumin Jidka Eebe.",
      },
      {
        excerpt:
          "Waxaana u sakhirray (ka sakhirray) Buuraha inay la tasbiixsadaan Nabi Daawuud iyo Shimbirahaba... waxaana barraynay gacma-gaabkiinna (Iskaashatada) si uu cadawgiinna idiinka ilaaliyo.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ducada ugu badan ee Alle lagu baryo waa ducada Daawuud, soonka Alle loogu jecel yahayna waa soonka Daawuud: wuxuu soomi jiray maalin, maalinta xigtana wuu afuray.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sulaymaan (CS)",
    summary:
      "Nebi-boqor la siiyay awood aan la qiyaasi karin oo haddana mahad iyo xikmad ku dhisan.",
    body: [
      "Sulaymaan (nabadgelyo korkiisa ha ahaatee) - Sulaymaan - wuxuu ka dhaxlay boqornimada iyo nabinimada labadaba aabbihiis Daawuud, Qur'aankuna wuxuu ku ammaanay 'addoon aad u wanaagsan, oo si isdaba joog ah u soo noqda' (Qur'aanka 38: 30). Waxa uu u duceeyey boqortooyo ka duwan midda iman doonta, Eebbena wuxuu siiyey wax aan caadi ahayn: amar dabaysha, oo ku socota amarkiisa; u adeegida jinka u dhisay oo u qoolay idamkii Alle; iyo fahamka hadalka shimbiraha iyo makhluuqa kale (Qur'aanka 21:81-82; 34:12-13; 27:16).",
      "Laba muuqaal ayaa soo jiitay dabeecadiisa. Markii qudhaanjadu uga digtay gumaysigeeda inay gabbato si aanay ciidanka Sulaymaan u burburin iyaga oo aan ogayn, Sulayman wuu dhoola caddeeyey oo Eebbe uga mahad naqay nicmada fahamka, isagoo ka baryaya inuu noqdo mid mahad leh oo xaqa ah (Qur’aanka 27: 18-19) - Awooddu waxay ka dhigtay mid aad u hooseeya, oo aan ka yarayn. Markii uu maqlay boqoraddii Saba (Sabaa) iyo dadkeeda oo caabudayay qorraxda, muusan xoog ku qabsanin ee wuxuu ku casuumay inay u hoggaansamaan Eebbe, ugu dambayntiina wuxuu ku helay rumaysad xagga xigmadda iyo muujinta wixii Eebbe siiyey (Qur’aanka 27:22-44). Xataa nimcooyinkiisa baaxadda leh wuxuu u sameeyay imtixaan: 'Tani waxay ka timid nicmada Eebahay inuu i imtixaamo inaan shukrin doono iyo inaan gaal ahayn' (Qur'aanka 27:40).",
      "Sulaymaan waxa uu barayaa in awooddu ay ka mid tahay imtixaannada ugu adag, mahad-naqa (shukr) ay dawo u tahay. Qofka mu’minka ah ee la siiyay hanti, karti, ama maamul waxa loola jeedaa in uu u isticmaalo caddaalad iyo in uu dadka kale ugu yeedho Eebbe, isaga oo aan waligii ku faanin. Boqortooyadiisa oo dhan, iyo cajaa'ibkeeda oo dhan, waxay dib u tilmaamaysaa kii wax siiyay - taasina waa farqiga u dhexeeya nimcada sare u qaadaysa iyo tan wax kharriba.",
    ],
    profile: {
      nation: "Banii Israa'iil iyo boqortooyooyinkii ku xeernaa",
      location: "Yeruusaalem iyo gobolka oo dhan",
      era: "Daawuud ka dib",
      mission: "Caddaalad ku xukun, ummadahana ugu yeedh cibaadada Alle.",
      challenges: [
        "Maareynta boqortooyo baaxad leh",
        "Ilaalinta mahadnaqa iyada oo ay jirto awood baaxad leh",
        "U hagida ciidamada kala duwan si masuuliyadi ku jirto",
      ],
      miracles: [
        "Ku amar dabaysha idam Eebe",
        "Adeegga jinniga ee dhismaha iyo quusitaanka",
        "Fahamka hadalka shimbiraha iyo quraanjada",
      ],
      majorEvents: [
        "Dhaxal-sugaha dawuud boqornimadiisa iyo nabinimadiisa",
        "Dhacdadii qudhaanjada iyo mahadnaqiisa",
        "Xidhiidhka Boqorada Saba iyo rumaysnaanteeda",
      ],
      lessons: [
        "Awoodu waa imtixaan qoto dheer",
        "Mahadnadu waxay ka ilaalisaa isla waynida",
        "Xikmad iyo martiqaad quluubtooda way ka roonaan karaan xoog",
      ],
      facts: ["Waxaa ka mid ah boqorrada sida buuxda loogu sifeeyay Qur'aanka"],
    },
    quran: [
      {
        excerpt:
          "Wuu dhoola caddeeyey, isagoo ku maaweelinaya hadalkeeda, wuxuuna yidhi: Eebow i waafaji inaan ku shukriyo Nicmadaada aad igu Nicmaysay aniga iyo Waalidkayba, iyo inaan falo wanaag aad raalli ka tahay.",
      },
      {
        excerpt:
          "Nabi Suleymaanna waxaan u Sakhirray Dabaysha oo Socod Bil ah, Galabkeedana Socod Bil ah.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ilyaas (CS)",
    summary: "Nebi ka horyimid cibaadadii sanamkii Bacal oo dadkiisii ​​ugu yeedhay xagga Alle.",
    body: [
      "Ilyaas (naxariis iyo nabadgalyo Eebbe korkiisa ha yeelee) – Waxaa loo diray beel ka mid ah reer Banii Israa’iil oo ku dhacay sanamyo, sanamyadoodana waxaa ugu weynaa Bacal. Qur'aanku wuxuu qoray caqabadiisa tooska ah: 'Miyaydaan Allaah ka cabsanayn? Ma waxaad u baryeysaan Bacal ood ka tegaysaan kan ugu wanaagsan abuuraha oo ah Eebihiin iyo Eebaha Aabayaashiin hore. (Quraanka 37:124-126). Wicitaankiisu waxa uu ahaa baaqa nebiyad ee weligeed ah: ka saar ilaahyada beenta ah oo u soo celi cibaadada kan wax abuuray.",
      "Qur'aanku waxa uu hawshiisa ku soo koobayaa hannaankii nebiyadii ee la yaqaanay - martiqaad cad, diidmo badan oo ka timid, iyo sharaf loo ilaaliyo kuwa daacadda ah. Way beeniyeen isaga, markaas waa la keeni [ciqaab], addoommadii Eebbe ee doortay maahee\" (Qur'aanka 37:127-128). Eebe wuxuu ku magacaabay kuwa dhawrsoon, wuxuuna ka tagay nabadgalyo waarta iyo ammaan korkiisa ah: 'Nabadgelyo korkiisa ha ahaato Ilyaas' (Qur'aanka 37: 129-130), wuxuuna ku daray Zakariya, Yaxye, iyo Ciise kuwa hanuunsan (Qur'aanka 6:85).",
      "Casharka Ilyaas waa in dib-u-habaynta dhabta ahi ay ka bilaabato hagaajinta cibaadada. Bulshadu si sax ah looma hagaajin karo marka ay u hoggaansanto u hoggaansanaanta walxaha beenta ah - ha ahaadeen sanamyo sax ah ama sanamyada casriga ah ee rabitaan, maal iyo mansab. Tawxiidku waa asaaska ay ku dhisantahay dib u cusboonaysiinta akhlaaqda ee waarta, xitaa marka ay koox aamin ah yartahay oo laga tiro bato, Alle wuu karaameeyaa kuwa xaqa ku dheggan.",
    ],
    profile: {
      nation: "Beesha Banii Israa'iil",
      location: "Gobolka Levant",
      era: "Xilliyadii nebiyada ee reer binu Israa'iil",
      mission: "Umaddiisa uga yeedha cibaadada Bacal towxiidka.",
      challenges: ["Cibaadada sanamyada oo qoto dheer", "Iska caabinta hogaanka"],
      majorEvents: [
        "Shacabka oo ku baaqay in laga soo horjeedo cibaadada Bacal",
        "Diidmo badan iyo ilaalinta mu'miniinta",
      ],
      lessons: [
        "Tawxiidku waa aasaaska dib u habaynta oo dhan",
        "Koox yar oo aamin ah ayaa weli dan u ah Allaah",
        "Nebiyadu waxay ka hadlaan khaladka caanka ah, ee kuma hadlaan",
      ],
      facts: ["Oo lagu magacaabay kuwa xaqa ah dhexdooda", "Ka horyimid cibaadadii sanamkii Bacal"],
    },
    quran: [
      {
        excerpt:
          "Markuu ku yidhi qoomkiisii ​​miyaydaan Eebe ka cabsanayn. Ma waxaad u yeedha Bacal ood ka tagtaan kan abuuraha wanaagsan?",
      },
      {
        excerpt:
          "iyo Zakariye, Yaxye, Ciise, Ilyaas, Dhammaanna waxay ka mid ahaayeen kuwa Suuban.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Al-Yasaa' (CS)",
    summary:
      "Nebi xaq ah oo reer binu Israa'iil ah, oo lagu magacaabay Quraanka Kariimka oo ka mid ah kuwa ugu wanaagsan.",
    body: [
      "Al-Yasaa' (nabadgelyo korkiisa ha ahaatee) - Eliishaa - wuxuu nebiyada ku dhex magacaabay laba meelood oo Qur'aanka ah, labadabana waa lagu ammaanay. Waxa uu ka soo dhex muuqday kuwa hanuunsan oo ay weheliyaan Ismaaciil, Yuunus, iyo Luud, kuwaas oo Eebe 'uu ka door biday caalamka' (Qur'aanka 6:86-87), iyo mar kale oo ka mid ah kuwa ugu caansan Ismaaciil iyo Dhul-kifl (Qur'aanka 38: 48). Qoraalku wuxuu sare u qaaday darajadiisa halkii uu ka sheegi lahaa sheeko faahfaahsan.",
      "Sababtoo ah waxyigu si badheedh ah ayuu isaga u kooban yahay, Muslimiintu waxay si dhab ah u xaqiijinayaan waxa hubaal ah - inuu ahaa nebi run ah oo u hiiliyay baaqii ah in Eebbe kaligiis caabudo dadkiisa dhexdooda - kana fogaadaan in ay ku xidhaan sheekooyin aan taageero wanaagsan lahayn. Xakamayntan lafteedu waa qayb ka mid ah caqiidada suuban: waxaynu ku ixtiraamnaa nebiga innagoo ilaalinayna runta isaga ku saabsan, ee ma aha innaga oo alifayna sheekooyin isaga ku xeeran.",
      "Xusiddiisu waxa ay xasuusin u tahay in Eebbe soo diray rusullo badan, iyo in aan qiimaha nebigu lagu cabbirin inta sheekadiisa la ilaalinayo, balse lagu qiyaaso daacadnimadiisa risaalada. Sida Quraanku meel kale ka sheegay, waxaa jiray rasuullo ‘aanu kaaga qisoon qisadooda iyo Rasuullo aynaan qisadooda ka warramin’ (Qur’aanka 40:78) — iyo rumaynta dhammaantood, la yaqaan iyo kuwa aan la garanayn, waa qayb ka mid ah iimaanka Muslimka.",
    ],
    profile: {
      nation: "Banii Israa'iil",
      location: "Gobolka Levant",
      era: "Xilliyadii nebiyada ee reer binu Israa'iil",
      mission: "Tawxiidka dadkiisa dhexdiisa ka sii wad.",
      lessons: [
        "Si isku mid ah u ixtiraam nebiyada oo dhan rumaysadka",
        "Xusid kooban oo Qur'aan ah ayaa weli gudbinaysa hanuun dhab ah",
        "Joogitaanka xaqa ah waxay ilaalisaa rumaysadka bulshooyinka",
      ],
      facts: [
        "Oo si toos ah loogu magacaabay Qur'aanka Kariimka oo ka mid ah kuwa ugu wanaagsan oo la doortay",
      ],
    },
    quran: [
      {
        excerpt: "iyo Ismaaciil, Al-Yasac, Yuunus, Luud, dhammaan waxaan ka fadilnay Caalamka.",
      },
      {
        excerpt:
          "Xusuuso Ismaaciil, Al-Yasaa', iyo Dul-kifli, dhammaantoodna waxay ka mid yihiin kuwa muuqda.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yuunus (CS)",
    summary:
      "Nebigii nibiriga, oo towbadkeenkii gudcurka ku jiray waxay noqotay cashar aan wakhti lahayn oo rajo ah.",
    body: [
      "Yuunus (nabadgelyo korkiisa ha ahaatee) - Yuunus - waxaa loo diray reer Nineweh, laakiin markii ay ku adkaysteen baaqiisii, ayuu uga tegey isagoo cadhaysan ka hor inta uusan Eebbe u fasaxin inuu baxo. Qur'aanku wuxuu qeexayaa wixii raacay: \"[xun] ninkii kalluunka lahaa markuu baxay isagoo xanaaqsan oo u maleeyay inaanaan xukumin korkiisa [wax dhib ah]\" (Qur'aanka 21: 87). Markuu doonni fuulay, waxaa lagu tuuray baddii, oo waxaa liqay kalluun weyn, oo wuxuu ku dhex muquurtay lakabyada gudcurka ah, iyo gudcurka habeenka, iyo badda, iyo caloosha kalluunka.",
      "Mugdigaas aadka u daran ayaa Yuunus ku dhawaaqay erayo noqday mid ka mid ah ducooyinka loogu jecelyahay Islaamka: “Adiga mooyee ilaah kale ma jiro; adaa leh. Anigu waxaan ka mid ahaa daalimiinta (Quraanka 21:87). Ma uusan quusan; waxa uu caddeeyey in Alle kaamilo yahay, khaladkiisana wuu qirtay. Eebbana wuxuu ku jawaabay:- Markaasaan ka jawaabnay oo ka korinay cidhiidhi. Saasaana ku korinaynaa Mu'miniinta\" (Qur'aanka 21:88). Kalluunkii ayaa ku tuuray xeebta, wuxuuna Alle ka dhigay in geed u soo baxo si uu u gabbaadiyo jirkiisa daciifka ah.",
      "Kadib waxaa yimid dhamaad cajiib ah: Yuunus wuxuu ku noqday qoomkiisii, si ka duwan ummad kasta oo kale oo Qur'aanka ah, way rumaysteen waana la daayay - ' markaasaan u raaxaynay ilaa muddo' (Qur'aanka 37: 147-148; 10: 98). Sheekadiisu waxay soo jeedinaysaa laba cashar oo isku tol ah: ha ka quusanina naxariista Eebe, si kasta oo mugdigu u sii qoto dheer yahay, maxaa yeelay tawbadkeen daacad ah ayaa soo celisa wixii lumay; ducada Yuunusna waxay u tahay halbowle u ah qofkasta oo mu'min ah oo dhib ku jira. Rasuulku ﷺ wuxuu baray in qof Muslim ah uusan waligiis ku baryin in Allaah u ajiibo mooyee.",
    ],
    profile: {
      nation: "Dadka Nineweh",
      location: "Gobolka Mesopotamian",
      era: "Xilligii Nabi Ciise ka hor",
      mission: "Umaddiisa ugu yeedh tawxiidka iyo towbada.",
      challenges: [
        "Cadaadiska diidmada joogtada ah ee daawaha",
        "Tijaabada shakhsi ahaaneed ee mugdiga badda",
        "Ku soo noqoshada howlgalka ka dib markii la saxo",
      ],
      miracles: [
        "Badbaadinta kalluunka dhexdiisa",
        "Geed gabaad ah oo korkiisa ka baxay",
        "Caqiidada dadkiisa oo dhan",
      ],
      majorEvents: [
        "Inuu dadkiisa iyo badaha ka daayo",
        "Baryada ku jirta gudcurka saddexda ah",
        "Soo noqoshada iyo rumaynta Nineweh",
      ],
      lessons: [
        "Marna ha ka quusan naxariista Alle",
        "Towbad keen daacad ah ayaa soo celisa risaalada",
        "Ducada dhibka ku jirta waa isbedel",
      ],
      facts: ["Sidoo kale Qur’aanka waxaa loogu yeeraa Dhun-Nuun (ninkii kalluunka)."],
    },
    quran: [
      {
        excerpt:
          "Wuxuuna u Dhawaaqay Mugdiyada Dhexdooda isagoo leh: Adigu Ilaah kale ma jiro. adaa leh. Anigu waxaan ka mid ahaa daalimiinta.",
      },
      {
        excerpt:
          "Miyayna jirin magaalo rumaysay oo iimaankeedu u anfacay qoom Yuunus mooyee. Markay Rumeeyeen waxaan ka Faydnay Cadaabkii Dullida.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ducadii Dhun-Nuun markuu Eebbe uga baryay caloosha kalluunka waxay ahayd: La ilaha illa Anta, subxaanaka, inni kuntu minaz-zalimin. Ma jiro qof muslim ah oo ku barya wax kasta oo aan ahayn in Eebbe u jawaabo.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Zakariya (CS)",
    summary: "Nebi daacad ah oo u duceeyey dhaxal suuban isagoo duq ah oo loo jawaabay Yaxye.",
    body: [
      "Zakariya (nabadgelyo korkiisa ha yeelee) - Sakariye - wuxuu ahaa nebi cibaado leh oo reer Banii Israa'iil ah, waana ilaaliye Maryam. Markasta oo u soo galo iyada qolkeeda salaadda wuxuu ka helay sahay agteeda ah, wuxuuna weyddiiyey siday ku timid, markaasay ugu jawaabi jirtay xagga Eebbe xaggee ka timid. Runtii, Eebbe wuxuu arsaaqaa cidduu doono xisaab la'aan' (Qur'aanka 3:37). Markhaatifurka arsaaqda Eebe ee Maryama waxay dib u soo noolaysay rajadiisa ah in Eebbe ku siin karo wax u muuqda mid aan suurtogal ahayn bani-aadmiga.",
      "In kasta oo uu gabow noqday oo ay naagtiisu madhalays ahayd, haddana Sakariya wuxuu u jeestay Eebbe isagoo aamusan oo duco qotodheer leh: ‘Eebbow, runtii lafahaygii way daciifeen, madaxayguna caddaan baa ka buuxsamay, weligay kumaan faraxsanayn baryadaydii adiga’ (Qur’an 19:4). Ma uu waydiisan maal iyo adduun toona balse waxa uu waydiistay dhaxal suuban oo risaalada nebiga sii wadi doona oo ilaalinaya cibaadada Alle. Eebbe wuxuu ugu bishaareeyey wiil, Yaxye - magac, Eebbe wuxuu yidhi, ninna hore looma siin (Qur'aanka 19:7). Astaan ​​ahaan, Zakariya wuxuu ahaa inuu dadka la hadlo saddex maalmood mooyee, isagoo carrabkiisa u go'ay xuska Eebbe (Qur'aanka 19:10-11).",
      "Nolosha Sakariye waxay baraysaa qofka mu’minka ah inuusan waligiis joojin ducada, si kastaba ha ahaatee jawaabtu waxay u ekaan kartaa, iyo inuu Eebbe si gaar ah u weydiiyo hadiyadda qoyska suuban iyo sii wadida iimaanka. Walwalka ugu weyni ma ahayn naftiisa ee yaa runta qaadi doona dabadiis. Sheekadiisu waxay sidoo kale sharfaysaa adeegga aamusnaanta ee meelaha cibaadada sida camal sharaf leh oo la jecel yahay.",
    ],
    profile: {
      nation: "Banii Israa'iil",
      location: "Gobolka Jerusalem",
      era: "Ciise ka hor",
      mission: "Hanuuniyo dadkiisa oo ilaali cibaadada nebiyada.",
      challenges: [
        "Gaaritaanka gabow la'aan ilmo",
        "U fiirsashada iimaanka dhaxalka",
        "Ku ilaalinta cibaadada bulsho qalafsan",
      ],
      miracles: [
        "Bishaarada Yahya ee gabow",
        "Calaamadda hadalka joojinta muddo saddex maalmood ah",
      ],
      majorEvents: [
        "Mas’uuliyadda Maryama iyo ka marqaati kaca sahaydeeda",
        "Ducada laabta leh ee dhaxalka leh",
        "Ducada ka jawaabtay iyo dhalashadii Yaxye",
      ],
      lessons: [
        "Waligaa ha lumin rajo ducada",
        "Ehel iyo abtirsiin toosan Allah ka baryo",
        "Cibaadada cibaadadu waa sharaf",
      ],
      facts: ["ilaaliyaha Maryam", "Aabbihii Yahya, oo dhalashadiisu ka jawaabtay ducadiisii"],
    },
    quran: [
      {
        excerpt:
          "Halkaas ayuu Zakariye kaga baryey Eebihiis isagoo leh: Eebow iga sii agtaada farac wanaagsan. illeen adaa maqle baryada.",
      },
      {
        excerpt:
          "Wuxuu yidhi: Eebow lafahaygii way daciifeen, madaxaygana waxaa ka buuxsamay cad, weligayna kuma aanan faraxsanayn baryadayda Eebow.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Yahya (CS)",
    summary:
      "Nebi daahir ah oo caqli badan oo xaqnimada la siiyey ilaa yaraantiisii, nabadna Eebbe ku mannaystay.",
    body: [
      "Yaxye (nabadgelyo korkiisa ha ahaatee) - John - waxay ahayd jawaabta ducada aabbihiis Zakariya, ee uu Eebbe u magacaabay dhalashadiisa ka hor. Eebbana si toos ah ayuu ula hadlay: 'Yaxye, kitaabka u qaado go'aansan. Oo wuxuu isaga siiyey xigmad intuu weli yar yahay\" (Qur'aanka 19:12) - tilmaan dhif ah oo calaamad u ah qaan-gaarnimadiisii ​​ruuxeed ee hore. Laga soo bilaabo yaraantiisii ​​waxa uu ahaa qof u heellan Eebbe si dhab ah oo ka baxsan sannadihiisii.",
      "Qur’aanku wuxuu si qurux badan u ammaanay dabeecaddiisa: Eebbe wuxuu siiyey ‘dareenka xaggayaga iyo daahirsanaanta, wuxuuna ahaa mid dhawrsada Eebbe, waalidkiina ka dhawrsada, mana ahayn mid dulmi badan oo caasi ah’ (Qur’an 19:13-14). Isagu wuxuu ahaa daahir oo cibaado leh, Oo waxaa lagu xusuustaa kuwa xaqa ah dhexdooda. Wuxuu dadkiisa ugu yeedhay addeecidda iyo xaqa, wuxuuna ka hor maray Nabi Ciise, isagoo rumeeyey kalimadda Eebbe, quluubtana u diyaariyey hanuun (Qur’an 3:39).",
      "Eebe wuxuu Yaxye ku sharfay nabad saddexda waqti ee ugu nugul noloshu: 'Nabadgelyo korkiisa ha ahaato maalinta uu dhashay, maalinta uu dhimanayo iyo maalinta la soo bixin isagoo nool' (Qur'aanka 19:15). Taariikh-nololeedkiisu waa fariin ku socota dhallin-yaro iyo waayeelba si isku mid ah: U-dhowaanshaha Eebbe dib looma dhigo sannadaha dambe. Wadnaha oo nadiif ah, cibaadada oo ay dhab ka tahay, iyo naxariista waalidkiis waxa ay ka soo bixi karaan qofka isaga oo yar - noloshaasna waa mid Alle jecel yahay.",
    ],
    profile: {
      nation: "Banii Israa'iil",
      location: "Gobolka Levant",
      era: "Casri ah oo la socda Sakariya oo u dhow waagii Ciisaha",
      mission: "Xaqa ugu yeedh, quluubtana u diyaari hanuun.",
      challenges: [
        "Dib-u-habaynta dadweynaha ee jawi niyad-jabsan",
        "Ilaalinta nadaafadda iyo mabda'a",
      ],
      majorEvents: [
        "Dhalashadiisa sidii duco looga jawaabay",
        "Oo xikmad lagu siiyay yaraantiisii",
        "Aqoonsiga daahirnimadiisa iyo cibaadadiisa",
      ],
      lessons: [
        "Dhallintu waxay wax ku hoggaamin karaan xaqnimo",
        "Daahirnimada qalbigu waa xoog dhab ah",
        "Naxariista waalidka waa qayb ka mid ah cibaadada",
      ],
      facts: [
        "Magaca Eebe ayaa dhalashadiisa ka hor",
        "Oo nabad lagu sharfay dhalashadii, dhimashadii, iyo sarakicidda",
      ],
    },
    quran: [
      {
        excerpt:
          "Yaxye, kitaabka u qaado si adag. Waxaana Siinay Xigmad isagoo Yar iyo Xigmad iyo naxariis agtanada ah iyo Daahir, wuxuuna ahaa mid Dhawrsan.",
      },
      {
        excerpt:
          "Eebe wuxuu kuugu bishaarayn Yaxye isagoo u rumayn kalimada Eebe ee sharafta iyo karaamada leh, iyo nabi kuwa suubban ka mid ah.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ciise ibnu Maryam (CS)",
    summary:
      "Waana Rasuul wayn oo u dhashay Maryam si mucjiso ah, uguna yeedhi Eebe xujooyin cad- Addoon oon Eebe ahayn.",
    body: [
      "Ciise (nabadgelyo korkiisa ha ahaatee) - Ciise - wuxuu ku dhashay Maryama aabbe la'aan, amarka Eebe, si ay calaamad u tahay awooddiisa buuxda: 'Runtii, Ciise agtiisa Eebe wuxuu la mid yahay kii Aadam. Isagaa ka Abuuray Ciid, markaasuu ku yidhi Ahaw wuuna ahaa (Qur'aanka 3:59). Markii Maryama ilmaheeda u keentay dadkeedii, oo ay dacweeyeen, Ciise ayaa ilmihii yaraa ka hadlay isagoo sariirta is-difaacaya: 'Runtii, anigu waxaan ahay addoonkii Eebbe. Wuxuu i siiyay kitaabka oo wuxuu iga dhigay nabi' (Qur'aanka 19:30). Bayaankan ugu horreeya waxa uu dhigay qaabkii hawshiisa oo dhan - in uu ahaa addoon Alle.",
      "Nabi Ciise waxa loo diray Banii Israa’iil si uu u xaqiijiyo Tawreed hortiisa iyo inuu keeno Injiil ( Injiil). Eebbana wuxuu ku taageeray mucjisooyin cad idankiisa: wuxuu bogsiiyey indhoole iyo kii baras qabay, waxna nooleeyey kuwii dhintay, wuxuuna ka sameeyey shimbir dhoobo ah oo duulaysa idamkii Eebbe (Qur’an 3:49). Farriintiisu waxay dadka ugu yeedhay inay caabudaan 'Eebbe, Rabbiyow iyo Rabbigiinna' (Qur'aanka 3:51), oo ay daacadnimo iyo xaqnimo u yimaadaan. Xertiisii ​​u dhowayd ee Hawaariyuuntu way rumaysteen oo taageereen.",
      "Quraanku wuxuu saxay laba daraf oo Ciise ku saabsan. Kuwii diiday oo ku tashaday inay dilaan, waxay caddaynaysaa inaan la dilin oo aan iskutallaabta lagu qodbin; Laakiin waxay u muuqatay oo keliya, oo Eebbe kor u qaaday isaga (Qur'aanka 4: 157-158). Kuwa buunbuuniyey, waxay ku adkaysanaysaa inuu yahay nebi iyo Rasuul sharaf leh, ee ma aha Ilaah ama ina Eebbe - 'Masiixa ina Maryama, ma ahayn waxaan Rasuul ahayn' (Qur'aanka 5:75). Sunniga caqiidada wuxuu soo laaban doonaa ka hor maalinta aakhiro. Sheekadiisu waxay ina baraysaa in awoodda Alle ay ka sarreyso dhammaan sababaha dabiiciga ah, in nebiyadu yihiin addoomo la karaameeyo oo aan weligood ilaahi ahayn, iyo in runta laga ilaaliyo beenin iyo buunbuunin labadaba.",
    ],
    profile: {
      nation: "Banii Israa'iil",
      location: "Levant",
      era: "Qarnigii 1-aad ee CE",
      mission: "cusboonaysii tawxiidka, oo tawreedna xaqiiji, xaqana ugu yeedh.",
      challenges: [
        "Mucaarad iyo dhagar ay wadaan kuwii isaga diiday",
        "Ka dib buunbuuninta maqaamkiisa",
        "Difaaca tawxiidka saafiga ah",
      ],
      miracles: [
        "Dhalasho la'aan",
        "Isagoo ku hadlaya sariirta",
        "Caawinta iyo noolaynta idanka Alle",
      ],
      majorEvents: [
        "Dhalashadiisii ​​mucjisada ahayd iyo difaacii hooyadii",
        "Baaqa dadweynaha oo leh calaamado cad",
        "In Alle loo sara kiciyo ee aan la dilin",
      ],
      lessons: [
        "Awoodda Alle ayaa ka gudubta sababaha caadiga ah",
        "Nebiyadu waa addoommadii Alle ee la karaameeyay, waligoodna ilaahi",
        "Runta waa in laga ilaaliyaa diidmada iyo buunbuuninta labadaba",
      ],
      facts: [
        "Injiil ( Injiil) la siiyay",
        "Waxay soo noqon doontaa ka hor maalinta aakhiro rumaynta Sunniga",
      ],
    },
    quran: [
      {
        excerpt:
          "(Ciise) wuxuu yidhi: Eebahay waa Eebahay iyo Eebihiin ee caabuda. Taasi waa jid toosan.",
      },
      {
        excerpt:
          "Mana ay dilaan, iskutallaabtana kuma ay qodbin; Laakiin waxaa la isu tusay iyaga... saas ma aha ee Eebe korkiisa u sara kiciyey.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Anigu waxaan ahay kan ugu dhow dadka oo dhan Ciise ina Maryam. Nebiyadu waa walaalo hooyooyin kala duwan, laakiin diintoodu waa mid, nabi na dhexdeenna ma jirin.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Maxamed ﷺ",
    summary:
      "Rasuulkii ugu dambeeyay, oo loo soo diray naxariista adduunka oo dhan iyo shaabadda Nabinimada.",
    body: [
      "Muxammad ﷺ waa nabiyada ugu dambeeya, looma dirin hal qoom laakiin loo soo diray dhammaan aadanaha, iyadoo Qur'aanku yahay waxyigii ugu dambeeyay oo la ilaaliyo. Eebbe wuxuu ku sifeeyey risaladiisii ​​hal aayad: ‘Kuuma aannaan dirin naxariista caalamka mooyee’ (Qur’an 21:107). Wuxuu ku dhashay magaalada Makkah, wuxuuna waxyigii ugu horreeyay ku soo dejiyay godka Xiira isagoo afartan jir ah, saddex iyo labaatankii sano ee xigayna wuxuu dadka ugu yeerayay inay caabudaan Eebbe kaligiis, quluubtoodana nadiifiyaan, caddaalad iyo naxariisna ku noolaadaan – isagoo dhammaystiraya oo xaqiijinaya risaalada nebi kasta oo isaga ka horreeyay.",
      "Jidkiisu waxa uu ahaa mid naf hurid joogto ah. Makkah isaga iyo mu’miniintii hore waxay u samreen jeesjees, jirdil iyo qaadacaada sanado badan. Ka dib waxaa yimid Hijriyadii, u hijradii Madiina, halkaas oo uu ka dhisay bulshadii ugu horreysay ee Muslim ah - oo la dhiso salaadda, walaalaynta muhaajiriinta iyo gargaarayaasha, heshiisyada iyo bulsho ku qotonta tawxiidka. Sanado badan oo dhib iyo guul aakhirka ah, dabeecaddiisu weligeed ma lihin; Quraanku wuxuu ka marag kacay, 'Runtii, waxaad tahay qof akhlaaq wanaagsan leh' (Qur'aanka 68: 4), oo isaga laftiisa ayaa sheegay in loo soo diray si uu u noqdo mid wanaagsan.",
      "Eebe wuxuu ku dhawaaqay isaga 'Rasuulkii Eebe iyo shaabadda Nabiyada' (Qur'aanka 33:40) - isaga dabadiis nabi ma jiro. Mucjisadiisa ugu weyn waa Qur’aanka laftiisa oo ah calaamad waara oo weli haga balaayiin, waxaana lagu sharfay Israa’i iyo Miraaj, safarkii habeenka iyo korkii. Mu'minka, waa uswah hasanah - tusaalaha quruxda badan (Qur'aanka 33:21) - oo Sunnadiisu tahay jidka dhabta ah ee iimaanka. In la jeclaado, hanuunkiisa la raaco, iyo ducadii dushiisa ha ahaatee waxay ku jiiftaa qalbiga nolosha Muslimka.",
    ],
    profile: {
      nation: "Aadminimada oo dhan",
      location: "Maka iyo Madiina",
      era: "Qarnigii 7aad ee CE",
      mission:
        "U gudbi waxyiga kama dambaysta ah oo dhambaal farriinta nebiyada ee dadyowga oo dhan.",
      challenges: [
        "Cadaadiskii iyo Qaadacadii Maka",
        "Isku dhac iyo dhisidda bulsho caadil ah",
        "Gudbinta fariin caalami ah oo ku wajahan qabiilada iyo quruumaha",
      ],
      miracles: [
        "Qur'aanka oo ah mucjiso waara",
        "Israa'iil iyo Mi'raj (safarka habeenka iyo korriinka)",
        "Calaamado badan oo lagu dejiyay idanka Alle",
      ],
      majorEvents: [
        "Bilowgii waxyiga ee Makkah",
        "Hijrada ilaa Madiina",
        "Dhammaystirka dhambaalka iyo khudbadii sagootinta",
      ],
      lessons: [
        "Naxariista iyo akhlaaqda sharafta leh ee hoggaaminta",
        "Ku adkaysiga cadaadiska",
        "Waxyiga iyo Sunnada la wada raac",
      ],
      facts: ["Shaabadda Nabiyada", "Tusaalaha ugu wanaagsan (uswah hasanah) ee mu'miniinta"],
    },
    quran: [
      {
        excerpt:
          "Muxammad ma aha aabbaha mid ka mid ah raggiinna, laakiin waa Rasuulkii Eebe iyo shaabadda Nabiyada.",
      },
      {
        excerpt: "Kuuma aannaan dirin naxariista Caalamka mooyee.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Tusaalahayga iyo tusaalaha nabiyadii iga horreeyey waa nin dhistay guri si qurux badan oo dhammaystiran u dhisan, marka laga reebo hal meel oo leben ah. Anigu waxaan ahay lebenkaas, oo waxaan ahay shaabadda nebiyada.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
];

export const PROPHETS_TIMELINE_SO: DeepPartial<ProphetsTimelineEvent>[] = [
  {
    era: "Bilawga",
    title: "Aadam - nebigii ugu horreeyay",
    body: "Eebbaa abuuray Aadam, baray magacyo, dhulkana uga dhigay ku-xigeen.",
  },
  {
    era: "Qadiimiga",
    title: "Idiris, Nuux, iyo ummadihii hore",
    body: "Nebiyadii hore waxay dadkoodii ugu yeedhi jireen tawxiidka. Nuux qarniyo badan buu wacdiyey; markii diidmo la sii joogey, daadkii baa yimid, doontiina waxay badbaadisay Mu'miniinta calaamad ahaan.",
  },
  {
    era: "Mesopotamia / Levant",
    title: "Ibraahim iyo qoyskiisa",
    body: "Khaliilllaahu, saaxiibkii Alle: sanamyadii wuu jejebiyey, naartana wuu ka badbaadiyey, kacbadana Ismaaciil buu ka dhisay, oo nabiyadii ayuu ka dhalay Ismaaciil iyo Isxaaq.",
  },
  {
    era: "Masar & Siinay",
    title: "Muuse iyo Banii Israa'iil",
    body: "Xoraynta Fircoon, Tawreed ayaa shaaca ka qaaday, safka dheer ee nebiyada Banii Israa'iil.",
  },
  {
    era: "Masar",
    title: "Yuusuf oo Masar jooga",
    body: "Dulqaadka iyada oo loo marayo khiyaamo, xabsi, iyo kor u kaca maamulka - tusaale ahaan kalsoonida.",
  },
  {
    era: "Yeruusaalem",
    title: "Daawuud iyo Sulaymaan",
    body: "Boqornimada, xikmadda, Zabuur, iyo boqortooyadii quraanka lagu ammaanay.",
  },
  {
    era: "Qarnigii 1-aad ee CE",
    title: "Ciise ibnu Maryam",
    body: "Ku dhashay si mucjiso ah, looga hadlay sariirta, oo loo sara kiciyey Alle - Qur'aanba laguma dilin iskutallaabta.",
  },
  {
    era: "Qarnigii 7aad ee CE",
    title: "Muxammad ﷺ - shaabadda nabiyada",
    body: "Rasuulkii ugu dambeeyay ee dhammaan aadanaha; Qur'aanka waa la ilaaliyaa ilaa maalinta qiyaamaha.",
  },
];
