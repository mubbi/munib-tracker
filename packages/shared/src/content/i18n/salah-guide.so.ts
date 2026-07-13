// Somali translation overlay for the Learn Salah guide content. Mirrors the order of
// its English source in ../salah-guide*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { SalahGuidePhrase, SalahGuideTopic } from "../../types/salah-guide";
import type { DeepPartial } from "./localize";

export const SALAH_GUIDE_TOPICS_SO: DeepPartial<SalahGuideTopic>[] = [
  {
    title: "Waa maxay Saalax?",
    summary: "Tiirka labaad ee Islaamka - kulankaaga maalinlaha ah ee aad la leedahay Allaah.",
    body: [
      "Salallahu waa cibaadada rasmiga ah ee Alle ku waajib yeelay qof kasta oo mu’min ah: waa tix-raac la amray oo ah istaagid (qiyam), rukuuc (rukumo), iyo sujuud (sujuud), oo la isku daray kalimada ammaanta, Qur’aanka iyo ducada, oo la guto shan jeer maalin kasta. Erayga saalax waxa uu ka yimid asal Carabi ah oo macneheedu yahay isku xidhid iyo baryo - waa mu’minka khad toos ah, oo aan dhexdhexaad ahayn oo uu u jeedinayo Abuuraha, una baahan wadaad iyo shafeeco toona.",
      "Hal cutub oo dhammays tiran - mid taagan ilaa sujuudda labaad - waxaa loo yaqaannaa rakco. Salaadda waxaa lagu tiriyaa rakcooyin: Fajr waa laba, Maqrib saddex, iyo Dhuxur, Casar, iyo Cisha afar. Salaadaha waajibka ah waxaa la yiraahdaa Fard; Nabiga ﷺ oo si joogta ah loo tukado waa sunne, salaadaha ikhtiyaariga ah ee si xorta ah loo bixiyona waa naf.",
      "Tiirarka si gaar ah uga mid ah, salaadda laguma soo dajin malaa'ig dhulka ku soo degtay, laakiin waxa si toos ah loogu soo dejiyey Nebiga (scw) markii la soo sara kiciyey samooyinka dhexdiis ee Safarka Habeenka (al-Israa' wa al-Mi'raj). Konton salaadood ayaa markii hore la tukaday, ka dibna - iyada oo loo marayo Nebiga ﷺ soo noqnoqda isagoo u fududaynaya umaddiisa - laga dhigay shan camal iyadoo la ilaalinayo ajirka kontonka.",
      "Waana sababta uu salaadku u fadhiyo udub dhexaadka nolosha Islaamka: maalin kasta oo lagu celceliyo shan jeer, waxa uu kala gooyaa shaqada, nasashada, iyo wakhtiga firaaqada si uu qalbiga Alle ugu soo celiyo, waana camalka ugu horreeya ee addoon lagula xisaabtami doono maalinta qiyaame. Haddii cod la helo, diiwaanka intiisa kale waa la raacayaa.",
    ],
    quran: [
      {
        excerpt:
          "Ee ah kuwa rumeeya waxa maqan, oogayna salaadda, waxaan ku arzuqnayna wax ka bixiya.",
      },
      {
        excerpt:
          "Akhri waxa lagugu soo Dejiyey oo Kitaabka ah, Oogna Salaadda. Illeen salaaddu waxay ka reebtaa xumaanta iyo xumaanta, xuska Eebbena waa ka weyn yahay.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Safarka Habeenka Eebbana wuxuu faray Konton salaadood; Rasuulku ﷺ wuu soo laabanayay si uu gargaar u warsado ilaa ay shan ka gaareen - 'Kuwanu waa shan, kuwanuna waa konton, waayo hadalkayga waxba kama beddelo.' (Sidoo kale Saxiix Muslim 162)",
      },
      {
        excerpt:
          "Waxa ugu horreeya ee addoonka lagula xisaabtami doono maalinta qiyaame waa baryadiisa; hadday dhaanto inta kale camalkiisu waa fayow. (Sidoo kale Abuu Daawuud 864, an-Nasaa'i 3991)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Maxaa Saalax?",
    summary: "Midhaha ruuxa, akhlaaqda, nafsiga, iyo daa'imka ah ee shanta salaadood.",
    body: [
      "Saalax waa hadal toos ah oo Allaah lala yeesho. Markay taagan tahay, waxaad isaga kula hadlaysaa erayadiisa; Sujuud ahaan - mawqifka khushuucsan - waxaad u dhowdahay xaggiisa oo u dhawdahay in lagu jawaabo. Ma jiro cibaado kale oo lagu celceliyo marar badan ama si dhow.",
      "Midhihiisa ugu horreeyaa waa ruux dhawrsan oo edeb leh. Alle laftiisu waxa uu sheegay in salaadda marka si habboon loo sugo, ay ‘iska ilaaliso sinada iyo xumaanta’ (29:45): Qofka si dhab ah u istaaga Eebbe hortiisa shan jeer maalintii waxa ku adkaata inuu dembigu u dhawaado. Sidoo kale waa daahirin soo noqnoqota - Nebigu ﷺ wuxuu shanta salaadood barbar dhigay webi qulqulaya oo qofku maydho shan jeer maalintii, isagoo aan wasakh ka tagin.",
      "Midhihii labaad waa nabadda gudaha. Qur’aanku waxa uu ballan qaaday in quluubtu ay ku nastaan ​​xuska Eebbe, Nebiguna ﷺ, markuu werwerka jiro, wuxuu odhan jiray, ‘Bilaalow, nagu raaxayso,’ isagoo u yeedhaya salaadda. Farxad indhihiisa ayuu ku tilmaamay in salaad la geliyay.",
      "Midhaheeda bulsheed iyo kuwa daa'imka ah ayaa dhameeya sawirka: heerarka salaadda ee qani iyo faqiirba hal saf ah waxayna dhistaa walaaltinimo, iyadoo ilaalinta salaadduna ay ka mid tahay waddooyinka ugu sugan dambi-dhaafka Alle iyo Jannada. Rasuulku ﷺ wuxuu u ballan qaaday Jannada ruuxii ilaaliya labada salaadood ee qabow ee Fajar iyo Casar.",
    ],
    quran: [
      {
        excerpt:
          "Runtii, anigu waxaan ahay Allaah. Aniga mooyee ilaah kale ma jiro ee i caabud oo ooga salaadda xuskayga.",
      },
      {
        excerpt: "Waxaa liibaanay kuwa rumeeyey (xaqa) ee salaadda ku khushuucay.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Midkiin albaabkiisa hadduu ku jiri lahaa webi uu ku maydho shan jeer maalintii, wax wasakh ah miyuu ku hadhayaa? Waxay yidhaahdeen, Maya. Wuxuu yidhi ﷺ, 'Taasi waa u ekaanta shanta salaadood - Eebbe wuxuu ku tirtiraa dambiyada. (Sidoo kale Saxiix Muslim 667)",
      },
      {
        excerpt:
          "Qofkii tukada labada salaadood ee qaboobaha – Fajar iyo Casar – wuxuu gelayaa Jannada.",
      },
      {
        excerpt:
          "Adduunyadiina waa layga jeclaaday dumar iyo cadar, oo qabowga indhahayga ayaa la dhigay baryo.",
      },
    ],
    actions: [
      "Duco kaliya hal duco si buuxda wakhtiga loogu talagalay maanta - joogtaynta, ma aha kaamilnimo, waa yoolka koowaad.",
      "Akhri macnaha Al-Faatixa hal mar ka hor salaadaada xigta si aad u dareento in lagugu jawaabay.",
      "Daar xasuusinta adhan si aanay daaqada salaadu u dhaafin iyadoon la dareemin.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Darajada ay ku leedahay Islaamka",
    summary: "Tiirka diinta - iyo camalka ugu daran in la dayaco.",
    body: [
      "Rasuulku ﷺ wuxuu baray in Islaamku ku dhisan yahay shan tiir, salaadduna ay tahay tii labaad, isla markiiba ka dib labada markhaati ee iimaanka. Marqaatigu waxa uu ku qiranayaa Islaamka; Salaaddu waa caddaynta taagan ee ah in maraggu qalbigaaga ku nool yahay. Waana sababta ay culimadu u yaqaaniin Saalax 'Tiirkii Diinta' - Guri aan tiirkiisa udub dhexaad u ahayn wuu dumaa.",
      "Miisaankeeda waxaa lagu arkay sida qoraalladu uga hadlayaan in la dayaco. Qur’aanku waxa uu ka digay qarni ‘ka tagay salaadda oo raaca rabitaankooda’ oo sheegay halaaggooda, Nebiguna ﷺ wuxuu ku tilmaamay salaadda inay tahay axdiga ka sooca iimaanka iyo gaalnimada.",
      "Xukunka qofka salaadda ka taga, waxaa jira farqi caan ah oo ixtiraam leh oo culimada sunniga ah. Qaar baa qaba in si badheedh ah looga tago gebi ahaanba -iyagoo caddeeyey inay waajib tahay - waxay la mid tahay gaalnimo weyn oo qofka ka saaraysa Islaamka; Inta badan (Xanafi, Maaliki, Shaafici) waxay qabaan in qofkaas uu ahaanayo qof Muslim ah oo dembi leh oo galay mid ka mid ah dembiyada waaweyn ee waaweyn, waase haddii uusan diidin waajibka saaran. Dhammaan waxay isku raacsan yihiin in salaadda oo laga tago ay musiibo tahay, qofkii diida waajibkeedana uu Islaamka uga baxay is-afgarad.",
      "Casharka wax ku oolka ah waa isku mid aragti kasta: ilaalinta shanta salaadood maaha mid ikhtiyaari ah ama gorgortan ku ah qofka mu'minka ah. Salaadaha iskaa wax u qabso ah (Sunnaha iyo nafta) ka dib waxay u dhaqmaan sidii shabagga badbaadada, iyagoo ka dhigaya wax ka dhiman salaadaha waajibka ah maalinta qiyaame.",
    ],
    quran: [
      {
        excerpt: "Ooga salaadda iyo salaadda dhexe, una istaaga Eebbe hortiisa idinkoo adeeci.",
      },
      {
        excerpt:
          "Waxaase ka daba yimid kuwo ka dambeeya oo salaadda dayacay oo raaca; si ay xumaan ula kulmaan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Islaamku wuxuu ku dhisan yahay shan: inay ka marag furto inaan Alle mooyee ilaah kale jirin, Muxammadna yahay Rasuulkiisii, oogidda salaadda, bixinta sakada, xajka, soonka Ramadaanka. (sidoo kale Saxiix al-Bukhaari 8)",
      },
      {
        excerpt:
          "Axdiga naga dhexeeya annaga iyo iyaga waa salaadda; Qofkii ka tagana wuu gaaloobay. (Buraydah; sidoo kale an-Nasaaci, Ibnu Maajah 1079).",
      },
      {
        excerpt:
          "Nin iyo gaalnimo iyo sanam caabudid waxa u dhexeeya salaadda oo laga tago. (Jaabir)",
      },
    ],
    disclaimer:
      "Culimadu waxay ku kala aragti duwan yihiin xukunka saxda ah ee lagu xukumayo qofka ka taga salaadda caajisnimo ( dambiga weyn ee aqlabiyadda, gaalnimada dadka kale) iyo kii beeniya waajibkeeda (gaalnimo la isku raacsan yahay). Abkan ma soo saaro xukun shaqsi ah - la tasho aqoonyahan u qalma kiisaska gaarka ah.",
  },
  {
    title: "Yaa waa inuu tukadaa?",
    summary:
      "Qof kasta oo miyir qaba, Muslim ah oo qaan-gaar ah - oo leh ka-dhaafid iyo tanaasul si cad loo qeexay.",
    body: [
      "Saalax waxa uu ku waajibayaa qof kasta oo muslim ah oo miyir qaba oo qaan gaadhay (bulugh). Saddex kooxood ayaa xisaabtanka laga saaray gebi ahaanba mabda'a dhabta ah: qofka hurda ilaa uu ka soo tooso, ilmaha ilaa uu qaangaadho, iyo qofka maskaxiyan daciifka ah ilaa sababta dhabta ah ay soo noqoto.",
      "Carruurtu weli waajib kuma aha, laakiin si tartiib tartiib ah ayaa loo tababaraa. Nebigu ﷺ wuxuu faray in carruurta lagu amro inay tukadaan laga bilaabo da'da toddobo sano oo lagu edbiyo si tartiib ah inay dayacaan tobanka sano - si salaadda baaluqnimada ay horeba u noqoto caado dejisan, ee maaha culays lama filaan ah.",
      "Haweenka ku jira caadada (hayd) ama dhiig baxa dhalmada ka dib (nifas) ma tukadaan muddadaas; salaadaha waajibka ah ee la seegayna lama soo koobi karo – waa naxariis iyo xukun ay culimadu isku raaceen. (Soonka la seegay, si ka duwan salaadda, ayaa loo sameeyaa.) Haweeney ayaa dib u soo ceshatay salaadda mar haddii uu dhiiggu ka dhammaado oo ay ku nadiifiso miyir-beel.",
      "Karti la'aanta dhabta ah waxay keentaa tanaasul, waligiis baajin: jirro daran, miyir la'aan, iyo cabsi xad dhaaf ah ayaa laga yaabaa inay qofka cudur daar u noqoto in muddo ah, iyo kuwa buka waxay ku tukadaan hadba sida ay awoodaan - fadhiga, beenta, ama xitaa dhaqdhaqaaqyada. Socdaalku salaadda kama saaro ee wuxuu ku fududeeyaa gaabin (qasriga) iyo isku-darka (jamka), oo ku xusan hagaha safarka.",
    ],
    hadith: [
      {
        excerpt:
          "Far carruurtaada inay ku tukadaan markay todoba jirsadaan, kuna edbi tobanka, una kala saara meelaha ay seexanayaan. ( Camr bin Shucayb oo ka yimid aabihiis oo ka yimid awoowgiis)",
      },
    ],
    quran: [
      {
        excerpt: "Ehelkaagana fari salaadda kuna samir dhexdeeda.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Shuruudaha salaada ka hor",
    summary: "Sagaalka shardi (shurut) ee ay tahay in ay meesha ku jirto si ay salaadu u ansaxdo.",
    body: [
      "Inta aysan salaadu ansaxin, shuruudo gaar ah (shurut al-Salaadda) waa in la buuxiyaa. Xaaladdu way ka duwan tahay tiirka: shuruuduhu waa shuruudo imanaya ka hor intaadan bilaabin oo aad sii wadato, halka tiirarka (arkan) ay yihiin qaybo ka mid ah salaadda lafteeda. Haddii shuruud la rabo laga waayo, salaadda lama aqbalo si kasta oo loo guto.",
      "Ka fakar sagaalkan sidii liiska hubinta ka hor. Inta badan waxay ku xidhmaan cashar buuxa meel kale oo hagahan -taabo si aad mid walba si qoto dheer u barato. Laba ka mid ah (oo ku wajahan qiblada iyo waqtiga saxda ah) waxaa lagu cudur daaran karaa awood la'aan dhab ah; inta kale si adag ayaa loogu baahan yahay mar kasta oo la awoodo.",
    ],
    steps: [
      {
        title: "Islaamka",
        body: "Ducadu waa camalka qofka muslimka ah; ma ansaxayso - mana aha waajib - qof aan muslim ahayn ilaa ay ka galaan islaamka.",
      },
      {
        title: "Maskaxda wanaagsan ('aql)",
        body: "Qofku waa inuu ahaado sabab macquul ah. Qof miyir beelay lama xisaabtamo inta uu xaaladdaas joogo.",
      },
      {
        title: "Garasho (tamyiz)",
        body: "Awoodda lagu kala saari karo, waxay gaadhay qiyaastii da'da toddobo - da'da laga bilaabo carruurta loo sheegay inay tukadaan.",
      },
      {
        title: "Ka saaritaanka wasakhda yar iyo tan wayn (taharah ee hadath)",
        body: "Xaalad sax ah oo wuduu ah, ama ghusl ka dib wasakh weyn, ama tayammum marka aan biyaha la isticmaali karin.",
      },
      {
        title: "Ka saaritaanka wasakhda (najasah)",
        body: "Jidhka, dharka, iyo goobta lagu tukanayo waa inay ka nadiif ahaadaan wasakhda caamka ah sida kaadida, dhiiga tirada iyo waxyaalaha kale ee liiska ku jira.",
      },
      {
        title: "Cawrada daboolaysa",
        body: "Qaybaha ay tahay in la daboolo waxaa lagu daboolaa dhar nadiif ah, oo aan muuqan - arag casharka Dharka & cawrada.",
      },
      {
        title: "Waqtigii salaadda ayaa galay",
        body: "Salax kastaa waxa uu leeyahay daaqad qeexan; tukashada ka hor intaanay wakhtigeedu bilaabmin waa buray. Isticmaal jadwalkaaga iyo xasuusintaada.",
      },
      {
        title: "Qiblada wajaheysa",
        body: "U soo jeedda dhanka Kacbada sida ugu dhow ee aad go'aamin karto - waxaa lagaaga cudur daartay kaliya karti la'aan dhab ah.",
      },
      {
        title: "Ujeedo (niyyah)",
        body: "Ku xalliso qalbiga ducada aad doonayso inaad qabato. Waa fal gudaha ah oo aan kor loogu hadlin.",
      },
    ],
    appLinks: [{}, {}, {}],
    disclaimer:
      "Dugisyadu waxay erey oo tiriyaa shuruudaha si yar si kala duwan (qaar baa tiirarka ka mid ah niyyah oo aan ka ahayn shuruudaha). Nuxurka waa lagu heshiiyey.",
  },
  {
    title: "Nadiifinta (Taharah)",
    summary: "Daahirnimada nafta, dharka, iyo goobta - albaabka salaad kasta.",
    body: [
      "Taharah macneheedu waxa weeye in aad kor u qaaddo nijaasta cibaadada si aad u istaagto Alle hortiisa adigoo nadiif ah. Eebbe wuxuu jecel yahay kuwa is-daahiriya, nabiguna ﷺ wuxuu baray in 'daahirintu tahay iimaanka badhkii'. Duco la'aanteed lama aqbalo.",
      "Xumaantu waa laba nooc. Nijaasta yar (hadath asghar) - oo ay keento waxyaabo ay ka mid yihiin isticmaalka musqusha ama dabaysha oo gudubta - waxa kor u qaada wudu. wasakhda weyn (hadath akbar ama janabah) - ka dib isu dhawaanshaha, shahwada, ama dhamaadka caadada iyo dhiigbaxa umusha ka dib - ayaa lagu qaadaa qubays dhamaystiran (ghusl).",
      "Si ka duwan kuwan caadooyinka ah, wasakhda la taaban karo (najasah) - sida kaadida, dhibcaha, dhiigga qulqulaya, iyo wixii la mid ah - waa in jir ahaan laga saaraa jidhka, dharka, iyo goobta aad ku tukanayso. Waa suurtagal in aad leedahay suuf sax ah haddana weli waxaad u baahan tahay inaad nadiifiso wasakhda dharkaaga ka hor intaadan tukan.",
      "Biyuhu waa nadiifiyaha aasaasiga ah. Marka biyaha aan si dhab ah loo heli karin, ama ay ku waxyeeloobeen jirro ama qabow daran awgeed, Islaamku wuxuu ogol yahay tayammum - nadiifinta qalalan iyadoo la isticmaalayo dhul nadiif ah - beddel buuxa. Nadiifinta weligeed loolama jeedo inay dhib noqoto; waa hab loo soo dhawaado.",
    ],
    hadith: [
      {
        excerpt: "Daahirintu waa iimaanka badhkii... (Abuu Maalik Al-ashcari)",
      },
    ],
    quran: [
      {
        excerpt:
          "Eebbana wuxuu jecel yahay kuwa toobad keena, wuxuuna jecel yahay kuwa is daahiriya.",
      },
    ],
    actions: [
      "Baro wudu tallaabo tallaabo ka hor salaaddaada xigta si xubin kasta loo dhaqo si sax ah.",
      "Maro nadiif ah gooni u dhig si aad u tukato haddii aad ka shaqeyso deegaan wasakhaysan.",
      "U fiirso meesha aad ku tukanayso wasakhda muuqata ka hor inta aanad gogosha dhigin.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Wudu - wayso",
    summary: "Dhaqitaanka la amray ee kor u qaadaya wasakhda yar oo kuu diyaarinaysa inaad tukato.",
    body: [
      "Wudu waa dhaqidda dhaqanka ee kor u qaada wasakhda yar. Waxa loo baahan yahay salaad kasta ka hor haddii aanad weli ku jirin xaalad sax ah oo ka timid mid hore, iyo - sida ay qabaan inta badan culimada - ka hor inta aanad taaban qoraalka Quraanka. Afarteeda dhaqid ee waajibka ah ayaa si toos ah loogu magacaabay Qur'aanka (5:6): wajiga, gacmaha ilaa xusullada, masaxidda madaxa, iyo cagaha ilaa anqawyada.",
      "Nebigu (scw) waxa uu u sameeyay bakhtiyo hab dejisan, saddex jeer oo uu u sameeyay addimada la maydhay, si fiicana laakiin aan biyo khasaarin - waxa uu uga digay xad-dhaaf xataa webi socda. Marka laga reebo afarta camal ee waajibka ah, luqluqashada afka iyo sanka, dhaqidda gacmaha marka hore, iyo adeegsiga xumaanta waxaa la dejiyay sunno dhameystiran oo qurxinaya ducooyinka.",
      "Abaal-marinteedu waa mid aad u weyn: Nebigu (scw) wuxuu baray in qofka mu’minka ahi uu dhaqo addin kasta, dembiyada ay galaan xubnahaasi ay ku dhacaan biyaha – xitaa cidiyaha hoostooda – si uu u soo baxo isagoo nadiif ah. Sidaa darteed Wudu ma aha oo kaliya sharci ee waa fal yar oo cafis ah ka hor salaad kasta.",
      "Alwaaxdu waxay ku jabtaa wax kasta oo ka soo baxa marinnada gaarka ah ( kaadida, saxarada, dabaysha), hurdo dheer oo ka saarta wacyiga, iyo miyir beelka. Haddii ay jabto inta lagu jiro salaada waa in aad joojisaa, dib u cusbooneysiisaa, oo aad dib u bilawdaa salaadda.",
    ],
    steps: [
      {
        title: "Niyada & Bismillah",
        body: "Qalbigaaga u niydi wuduu oo ku bilow 'Bismillah'. Ujeedadu waa gudaha oo looma baahna in la sheego.",
        tip: "Isticmaal miswak (siwak) ka hor marka aad awooddo - sunne Nebigu ﷺ jeclaa oo ku dhow inuu waajib ka dhigo.",
      },
      {
        title: "Gacmaha dhaq",
        body: "Ku dhaq labada gacmood saddex jeer curcurada, adigoo ka shaqaynaya biyaha faraha dhexdooda.",
      },
      {
        title: "Biyo raaci afka",
        body: "Biyo afka geli, ku wareeji, oo ka saar - saddex jeer.",
      },
      {
        title: "Biyo raaci sanka",
        body: "Biyo ku soo jiid sanka sanka gacanta midig oo ka saar bidix - saddex jeer.",
      },
      {
        title: "Dhaq wajiga (fard)",
        body: "Dhaq wejiga oo dhan hal mar ilaa saddex jeer, laga bilaabo timaha ilaa gadhka iyo dhegta ilaa dhegta; ninku gadh qaro weyn buu faraha qoyan ka ordaa.",
      },
      {
        title: "Dhaq gacmaha (fard)",
        body: "Dhaq gacanta midig, ka dibna bidix, laga bilaabo faraha ilaa iyo oo ay ku jiraan xusullada - saddex jeer midkiiba.",
      },
      {
        title: "Masax madaxa (fard)",
        body: "Gacmaha qoyan, madaxa mar hore iyo gadaal ka masax mar labaad, ka dibna ku masax gudaha iyo dhabarka dhegaha isla qoyan.",
      },
      {
        title: "Dhaq cagaha (fard)",
        body: "Dhaq cagta midig, ka dibna bidix, ilaa iyo ku dar anqawyada - saddex jeer midkiiba, adigoo u gudbaya faraha faraha dhexdooda.",
      },
      {
        title: "Markhaatigii iimaanka",
        body: "Ducada ku dhameey: Ashhadu an laa ilaha illallah... — waxaa laga furay sideeda albaab ee jannada ruuxii dhaho sacbada kadib.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Marka uu addoonku wejigiisa ku maydho wuduu, dembi kasta oo uu indhihiisa ku eego wuxuu ka baxaa biyaha… ilaa uu ka soo baxo isagoo dembi ka daahirsan.",
      },
    ],
    quran: [
      {
        excerpt:
          "Kuwa (xaqa) rumeeyow markaad u kacdaan salaadda ka maydha wajiyadiinna iyo gacmihiinna xagga suxullada, masaxa madaxiinna, cagahana ka maydha ilaa anqawyada.",
      },
    ],
    actions: [
      "Si tartiib ah u samee wudu hal mar markaad tilaabo kasta kor u akhrinayso, adigoo hubinaya suxullada iyo cidhibta.",
      "Xafid ducada gaaban kadib wudu - eeg Erayada Saalax.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tayammum — dry purification",
    summary: "When water cannot be used, clean earth lifts impurity so prayer is not delayed.",
    body: [
      "Tayammum is the dry purification Allah legislated when water is genuinely unavailable, or when using it would cause harm because of illness or severe cold. It is not a lesser workaround for convenience — it is a complete substitute that lifts minor or major impurity for prayer until water can be used again.",
      "The Qur'an names it in the same verse as wudu and ghusl (5:6): wipe the face and hands with clean earth after striking it. The Prophet ﷺ taught the companions this concession as mercy, not as a loophole to skip searching for water when it is reasonably available.",
      "Practically: intend tayammum, say Bismillah, strike clean earth once (or twice according to some schools), wipe the face, then wipe the hands to the wrists (many scholars include up to the elbows in continuity with wudu). What breaks wudu or ghusl also ends the corresponding tayammum; finding usable water ends the concession and you return to ordinary purification.",
      "If you prayed validly with tayammum and only found water afterward, the majority hold that the completed prayer need not be repeated. If water appears before you pray, you must use it. For casts, wounds, and illness, combine wiping over dressings with tayammum as your school and doctor advise — see the full Taharah guide for detail.",
    ],
    steps: [
      {
        title: "Confirm the need",
        body: "Search reasonably for usable water, or confirm that using water would harm you (illness, severe cold, medical advice).",
      },
      {
        title: "Intention & Bismillah",
        body: "Intend tayammum in place of wudu or ghusl, and begin with Bismillah.",
        transliteration: "Bismillah",
      },
      {
        title: "Strike clean earth",
        body: "Strike clean earth (or a clean dusty surface) with both hands once — some schools strike twice.",
      },
      {
        title: "Wipe the face",
        body: "Wipe the entire face with the dust remaining on the hands.",
      },
      {
        title: "Wipe the hands",
        body: "Wipe the hands — at minimum to the wrists; many scholars wipe to the elbows.",
      },
    ],
    quran: [
      {
        excerpt:
          "…and you find no water, then perform tayammum with clean earth and wipe your faces and your hands with it.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Reported in the chapters of tayammum: the concession to purify with clean earth in the absence of usable water.",
      },
    ],
    actions: [
      "Know when tayammum applies before travel or illness so prayer is never skipped for lack of water.",
      "Open the full Taharah tayammum lessons for school differences on striking and wiping.",
    ],
    disclaimer:
      "Schools differ on details (one strike vs two, wrists vs elbows, renewing per prayer). This is a mainstream educational summary — follow reliable local scholarship for your practice.",
  },
  {
    title: "Dhar & awrah",
    summary: "Dabool waxa ay tahay in la daboolo - si nadiif ah, xishood leh, oo ixtiraam leh.",
    body: [
      "Daboolidda cawrada - qaybaha jidhka ee ay tahay in la qariyo - waa shardi salaad ansax ah, oo laga soo qaatay amarka Alle ee ah 'ka qaado qurxintaada meel kasta oo lagu tukado' (7:31). Labbisku waa in ay nadiif ahaadaan najaasaha oo aan mugdi ku jirin oo midabka maqaarku aanu ka muuqan.",
      "Ragga, cawrada lagu tukado, ugu yaraan, waa xudunta ilaa jilibka. Si kastaba ha ahaatee, tukashada laabta oo qaawan marka dhar la helo lama jecla; Nabigu ﷺ waxa uu faray in aanu ninku ku tukan hal maro oo aanay qayb ka mid ahi garbaha saarin.",
      "Dumarka, jirka oo dhan waa cawradu marka laga reebo wejiga iyo gacmaha, sida ay culimadu qabaan; naagtu waxay dabooshaa timaheeda, luqunta, iyo cagaha, sida caadiga ah maro dabacsan iyo xijaab. Culimadu waxay ku kala duwan yihiin cagaha, qaarkood waxay tixgeliyaan inay ku jiraan waxa la muujin karo - in lagu tukado iyaga oo daboolan waa habka badbaadada iyo badiba.",
      "Laba xukun oo lebbis ayaa sidoo kale lagu dabaqayaa salaadda ka baxsan: xariirta iyo dahabka waa ka mamnuuc ragga inay xidhaan (waa la oggol yahay dumarka), iyo dharku waa inuusan noqon mid adag, jilicsan, ama feejignaan si uu u jabiyo salaadda xishoodka ah ee loo baahan yahay. Sida qaanuunka suulka ah, ku tukado waxa aad xidhan lahayd si aad ula kulanto qof aad ixtiraamto -ha ahayn dharka habeenkii ama dharka xeebta.",
    ],
    quran: [
      {
        excerpt: "Banii aadamoow ka qaata Quruxdiinna meel kasta oo lagu tukado.",
      },
    ],
    actions: [
      "Meel iska dhig mid nadiif ah, dhar suubban ama maro duco go'an si aad mar walba diyaar ugu noqoto.",
      "Marka aanad hubin in shay dabooli karo ku filan, dabool in ka badan intii aad ka yarayn lahayd.",
    ],
    disclaimer:
      "Tafaasiisha cawrada (gaar ahaan cagaha dumarka) waa qodob ay ku kala duwan yihiin cilmi ahaan ixtiraam. Raac deeq waxbarasho oo maxalli ah oo lagu kalsoonaan karo oo aad ku kala duwan tahay.",
  },
  {
    title: "Waqtiyada salaadda",
    summary:
      "Shan daaqadood oo maalinle ah - salaad kastaa waxay leedahay bilow, dhammaad, iyo daqiiqad la door biday.",
    body: [
      "Eebe wuxuu u yeelay salaadaha xilliyo go'an (4:103), isagoo maalinta iyo habeenka u qaybiyay shan daaqadood oo ku xidhan dhaqdhaqaaqa qorraxda. Ducada intaan daaqadu furmin waa wax aan ansax ahayn; Salaadda oo la dhaafo daaqadeeda cudur daar la'aan waa dembi culus. Mar kasta oo ay suurtogal tahay, ku tukada goor hore daaqadda - Nebigu ﷺ wuxuu ku magacaabay salaadda markii ugu horreysay camalka Eebbe loogu jecel yahay.",
      "Shanta daaqadood waa: Fajr, laga bilaabo waaberiga runta ah ilaa qorrax ka soo baxa; Dhuxr, laga bilaabo qorraxdu intay dhaafto meel sare ilaa shayga hadhkiisu la siman yahay dhererkiisa; Casar, laga bilaabo dhammaadka Dhuxur ilaa qorraxdu ka dhacdo (sida ugu wanaagsan ayaa loo tukaday ka hor intaanay qorraxdu jaallaha ahayn); Maghrib, laga bilaabo qorrax dhaca ilaa fiid-caduudu ka dhacayso; iyo Isha, laga bilaabo qorrax dhaca ilaa waagu ka beryay.",
      "Waxaa jira saddex xilli oo kooban oo ay reebban tahay salaadda is-xilqaanka ah, si aan cibaadadu marna loogu khaldin cibaadada qorraxda: sida qorraxdu u soo baxdo ilaa ay ka soo baxdo, marka ay si sax ah u istaagto meel sare oo duhur ah, iyo marka ay sii dhacayso ilaa ay ka dhammaato. Samaynta salaadda waajibka ah ee la seegay waa ka reebban tahay xaaraantaas.",
      "Saacadaha saxda ah ee saacada waxay maalin walba u wareegaan ulkaada iyo xilliyadaada, waana sababta uu Nabigu ﷺ ugu xiray calaamado dabiici ah halkii ay ka ahaan lahaayeen saacad go'an. Appku wuxuu u xisaabiyaa goobtaada - laakiin ogaanshaha calaamadaha hoose waxay ku ilaalinaysaa inaad qotonto marka tignoolajiyada la waayo.",
    ],
    steps: [
      {
        title: "Fajr - 2 rakcad fard",
        body: "Waaberiga runta ah ilaa qorrax ka soo baxa. Waxaa ka horeeyay sunne 2-rakco ah oo aad loo adkeeyay.",
      },
      {
        title: "Dhuhr - 4 rakco fard",
        body: "Markay qorraxdu dhaafto meel sare ilaa hadhkii Casar. Sunnada 4 ka hor iyo 2 ka dib.",
      },
      {
        title: "Casr - 4 rakco fard",
        body: "Laga bilaabo dhammaadka Dhuxul ilaa qorraxdu ka dhacdo; ku tukada intaan qorraxdu jaalle noqon. Badanaa waxaa lagu aqoonsaday 'salaadda dhexe' ee 2:238.",
      },
      {
        title: "Maghrib - 3 rakcad fard",
        body: "Laga bilaabo qorrax-dhaca ilaa qorraxdu ka dhacdo; si degdeg ah u tukada. Sunnada 2 ka dib.",
      },
      {
        title: "Isha - 4 rakco fard",
        body: "Tan iyo makhribka ilaa waaberiga; ugu fiican ka hor saqda dhexe. Waxaa ku xiga Witr.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Waxaa jira saddex jeer oo uu nebigu NNKH innaga reebay inaan tukanno: waa marka qorraxdu soo baxdo ilaa ay ka soo baxdo, markay taagan tahay duhurkii, iyo markay dhacayso ilaa ay ka dhacayso. (Cuqbah bin Caamir)",
      },
    ],
    quran: [
      {
        excerpt: "Salaaddana waxaa lagu xukumay Mu'miniinta korkooda muddo cayiman.",
      },
      {
        excerpt:
          "Ooga salaadda labada daraf ee maalinta iyo habeenka agtiisa. Illeen camalka wanaagsani wuxuu fogeeyaa xumaanta.",
      },
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Bilawga Casar waxa uu leeyahay laba fikradood oo la soo sheegay (hadhka la mid ah, ama laba jeer, dhererka shay). Labaduba waa sax; raac xisaabinta deegaankaaga iyo bulshadaada.",
  },
  {
    title: "Qiblada wajaheysa",
    summary: "U leexo Baydka xurmada leh ee Makkah - jihada midaysa ummadda.",
    body: [
      "Qibladu waa jihada Kacbada dhexdeeda Masjid al-Haram ee Makkah. In la wajaho waa shardi salaad sax ah. Bilowgii Islaamka Muslimiintu waxay u tukadeen xagga Yeruusaalem; ka dib Eebbe wuxuu soo dejiyey amarka ah in loo jeedsado xagga Masjidka xurmada leh, hal jiho ayaa midaysay cibaadada adduunka tan iyo markaas - maalin kasta, muuqaal jireed oo bulsho ah oo wajahaysa Rabbi keliya.",
      "Waxaa lagaa rabaa inaad u wajahdo qiblada sida saxda ah ee aad si macquul ah u go'aamin karto - adigoo isticmaalaya kombas, mihraab masaajid, app la isku halayn karo, ama qorraxda iyo xiddigaha markaad safraysid. Weecan yar oo aan laga fursan karin waa la cafiyay; Waxa muhiimka ah waa dadaalka daacadda ah ee jihada saxda ah.",
      "Haddii aadan si dhab ah u go'aamin karin jihada - ku luntay badda, daruuraha, dhul aadan aqoon habeenkii - waxaad ku dadaalaysaa inaad ka shaqeyso oo aad u tukato xagga xukunkaaga ugu fiican; salaaddu way ansaxaysaa xataa hadday hadhow waxyar ka go'do. Baabuur ama diyaarad soconaysa oo u jeedda qiblada salaadda waajibka ah aanay suurtogal ahayn, waxaad la kulmaysaa wax kasta oo aad awooddo, mar haddii Alle aanu naf ku culaysin wax awoodeeda ah.",
    ],
    quran: [
      {
        excerpt:
          "Ee u jeedi wejigaaga xagga al-Masjid al-Xaram. Meel kastoo aad joogtaan u jeedi wejigiinna.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Markaad u kacdo inaad tukato, si fiican u wanaaji, kadibna u waji qiblada oo takbiir ku dheh. (waxaa ku sugnaaday xadiiskii ninkii salaada xumaaday)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Adhan - baaqa salaadda",
    summary: "Erayada Umadda U Yeedhay, Macnahooda Iyo Sida Looga Jawaabo.",
    body: [
      "Adhan waa baaqa ku dhawaaqaya in salaad wakhtigeedii la galay. Waa sunne wadaag ah shanta salaadood (maaha in la tukado ama la tukado janaasada), oo laga soo bixiyo meel sare, si bulshadu isugu timaado si ay u cibaadeysato. Waxa la raacaya, wax yar ka hor intaanay salaadda bilaabmin, waxa loo yeedhaa baaq labaad oo ka gaaban - ictiqaadka.",
      "Markaad maqasho adhanka, sunnadu waa in aad ku celceliso odhaah kasta ka dib mu'addinka - marka laga reebo 'Hayya 'ala as-saalah' iyo 'Xayaa 'ala al-falah', halkaas oo aad tiraahdo 'La xawla wa la quwwata illa billah' ( awood iyo xoog midna ma jiro Alle agtiisa mooyee). Fajr adhan qofka soo wacey wuxuu ku darayaa \"As-salatu khayruun min an-nawm\" (salaada ayaa hurdada ka wanaagsan).",
      "Ka dib markii ay dhammaatay adhan, ku Salli Nabiga (scw) korkiisa, ka dibna akhri ducada la aasaasay oo Alle ka baryay inuu siiyo saldhigga la ammaanay (al-Wasilah) - Nebigu (scw) wuxuu u ballanqaaday inuu u shafeecayo qof kasta oo yiraahda. Waqtiga u dhexeeya aadanka iyo ciqaamada waa xilli aan ducada laga leexin, ee u ducee si xor ah.",
    ],
    steps: [
      {
        title: "Allaahu Akbar (×4)",
        body: "Eebe waa kan ugu weyn - waa ka weyn yahay wax kasta oo ku mashquulin lahaa.",
      },
      {
        title: "Ashhadu an la ilaha illallah (×2)",
        body: "Waxaan ka marag kacayaa in aan Alle mooyee ilaah kale jirin.",
      },
      {
        title: "Ashhadu anna Muhammadan rasulullah (×2)",
        body: "Waxaan markhaati ka ahay in Muxammad yahay Rasuulkii Alle.",
      },
      {
        title: "Xayaa 'ala as-saalah (×2)",
        body: "Kaalay salaada. Ku jawaab: La hawla wa la quwwata illa billah.",
      },
      {
        title: "Xayaa cala al-falah (×2)",
        body: "Guul u imow. Ku jawaab: La hawla wa la quwwata illa billah.",
      },
      {
        title: "Allaahu Akbar (×2)",
        body: "Allaah ayaa u weyn.",
      },
      {
        title: "La ilaha illallah",
        body: "Eebe mooyee ilaah kale ma jiro - baaqu wuxuu ku xidhan yahay isla eraygii uu ku furay.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qofkii yidhaahda markuu maqlo dhawaaqa, 'Ilaahow, Eebaha wacdigan qumman iyo salaadda toosan, sii Muxammad Wasilaah iyo wanaagga...' - shafeecadaydu isagay yeelanaysaa maalinta qiyaame. (Jaabir)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Talaabo-tallaabo Salaadda",
    summary: "Taxanaha buuxa ee rakcada - weedh kasta oo la akhriyo, iyo xukunkeeda.",
    body: [
      "Salaad kasta waxaa laga dhisay hal halbeeg oo soo noqnoqda - rakcada: istaag oo akhri, rukuuc, kac, laba jeer sujuud, (dhammaadka salaadda) u fadhiiso tashahud oo sii salaam. Si fiican u baro hal rakco oo waad tukan kartaa salaad kasta, sababtoo ah salaadaha dhaadheer ayaa si fudud ku celceliya cutubkan. Tallaabooyinka hoose waxay siinayaan fal kasta sida ay u kala horreeyaan, erayada saxda ah ee Carabiga lagu sheegayo macnahooda, iyo calaamad yar oo muujinaysa in falku yahay tiir, fal loo baahan yahay, ama mid lagu talinayo.",
      "Culimadu waxay u kala saaraan ficillada Salaadda saddex heer. Fard (tiir / rukn) waa lama huraan: ka tag - xitaa qalad - iyo salaadda, ama rakcadaas, waa mid aan ansax ahayn ilaa laga soo baxo. Waajibku waa waajib, haddiise aad mid ilowdo waxaad salaadda ku hagaajinaysaa sujuudda illowga (sujud as-sahw) intaad ku celin lahayd. Sunno waa lagu taliyaa oo laga abaal-marin, salaadduna way dhammaystiran tahay wayna ansaxaysaa la’aanteed. Halka dugsiyada fiqhigu ay dhigaan ficil qayb ka duwan, talooyinka ayaa xusaya - xuduudkan saddex-laaban waa laftiisa mid ka mid ah meelaha caadiga ah ee farqiga cilmiga.",
      "Inta lagu guda jiro, tayada kaliya ee ay tahay in aan waligood lumin waa tuma'ninah - xasilloonida: si buuxda u degista meel kasta, iyada oo addimada ay nasanayaan, ka hor intaanad dhaqaaqin. Rasuulku (scw) wuxuu u diray nin ku degdegay inuu tukado saddex jeer, isagoo ku leh, “ka noqo oo tukada, illeen ma aadan tukan”, dabadeed wuxuu baray inuu is dejiyo meel kasta. U dhaqaaq inta udhaxeysa meesha ay taagan tahay takbiirka 'Allaahu Akbar', oo ishaada ku hay goobta sujuudda.",
      "Imisa rakcadood, iyo meesha aad fadhiisato: Salaad laba-rakcadood ah (Fajr, iyo Jumcaah) waxay leedahay fadhi keli ah - tashahudka u dambeeya ka dib rakcada labaad - ka dibna salaam. Salaad saddex rakcadood ah (Maghrib) iyo mid afar rakcadood ah (Dhuxur, Casar, Isha) waxay fadhiistaan ​​tashahuudka koowaad, ka gaaban ka dib rakcada labaad, ka dibna u istaag rakcada soo hadhay - adigoo ku akhriyaya Al-Faatixa oo keliya, iyada oo aan wax suurad ah lagu darin — dibna u fadhiiso tashahuudka u dambeeya",
      "Aamusnaan ama qaylo: Faatixa iyo suuradda waxaa lagu akhriyaa (jahri) Fajar, Jumcada, iyo labada rakcadood ee ugu horreeya Maghrib iyo Isha; waxaa lagu akhriyaa aamusnaan (sirri) Dhuxur iyo Casar, rakcada saddexaad ee Maghrib, iyo rakcada saddexaad iyo afaraad ee Isha. Weedh kasta oo kale oo salaadda ka mid ah - tasbiixda rukummada iyo sujuudda, tashxudka, iyo wixii la mid ah - ayaa hoos loo yidhi. Qofka tukanaya kaligiis waxa laga yaabaa inuu kor u akhriyo salaadaha kor u kaca ama hoos u dhigo; raace ka dambeeya imaamka ayaa si fudud u dhagaysta inta imaamku kor u akhrinayo.",
      "Wax ku darisyada qaar ayaa iska leh duco ama daqiiqado gaar ah. Salaadda Witr-ka qaar badan ayaa akhriya Qunut rakcada u dambaysa - gacmaha kor u taagaya si ay u baryaan hanuun iyo ilaalin (erey caan ah ayaa bilaabmaya 'Allaahumma-hdini fiman hadayt…'). Xiliyada dhibka waxaa laga yaabaa in lagu daro Qunut an-Nazilah salaadaha faralka ah, iskuuladuna waxay ku kala duwan yihiin Qunut taagan oo Fajr ah. Haddii aad jameecada ku soo daahdo (masbuq), wax kasta oo aad imaamka ku qabato ayaa xisaabaya, oo aad samaysato rakcaddii aad ku seegtay salaantiisa ka dib. Haddii aad si qalad ah wax ugu darto ama u tuurto, arag hagaha sujuud as-sahw.",
    ],
    steps: [
      {
        title: "1. Niyada & Joogitaanka (niyyah & qiyam)",
        body: "Qiblada wajaho una istaaga si toosan - istaagiddu waa tiir ka mid ah salaad kasta oo waajib ku ah ruuxii kara. Qalbiga ku deji salaadda gaarka ah ee aad ku tukanayso; Ujeedadu waa go'aan gudaha ah, ee maaha jumlad kor loogu hadlo.",
        tip: "Indhaha ku hagaaji meesha sujuuda oo ku hay. Qofkii aan si run ah u istaagi karin ayaa ku tukanaya isagoo fadhiya, ka dibna been sheegaya - salaadda lafteedu weligeed lama tuuro.",
      },
      {
        title: "2. Takbiirta oo la furo (Takbirat al-Ihram)",
        body: "Gacmaha u taag garbaha ama dhegaha oo ku dheh takbiirta, ka dib gacanta midig ee bidixda saar laabta. Sidaas ayay salaaddu ku bilaabantay, hadalka iyo dhaqdhaqaaqa caadiga ahina hadda waa mamnuuc ilaa salaadda la gaadho.",
        translation: "Allaah ayaa u weyn.",
        tip: "Takbiirta oo gacmaha kor loo qaado (raf'al-yadayn) waa sunne la xaqiijiyay ee ma aha tiir.",
      },
      {
        title: "3. Ducada furitaanka (Duca al-Istiftah)",
        body: "Si deggan u akhri duco gaaban oo furitaan ah si aad qalbiga u dejiso ereyada Alle hortiisa. Dhowr eray oo dhab ah ayaa la soo sheegay; tani waa mid ka mid ah kuwa ugu badan.",
        translation:
          "Subxaanallaah Allow Adiga ayaa Mahad leh. Magacaagu waa barakaysan yahay, oo haybaduhuna waa la sarreeyaa. Ilaah aan adiga ahayn ma jiro.",
      },
      {
        title: "4. Ta'awwudh & Basmalah",
        body: "Allaah ka magan gal Shaydaanka, ka bacdi Basmalah ka hor, Al-Faatixa ka hor. Labadaba si aamusan ayaa loo dhahaa, xitaa salaadaha qeylada leh.",
        translation:
          "Illahay baan ka magan galay shaydaanka la nacladay. Magaca Eebe yaan ku billaabaynaa ee Naxariis guud iyo mid gaaraba Naxariista.",
      },
      {
        title: "5. akhri Al-Faatixa",
        body: "Akhri Furitaanka Kitaabka rakco kasta - 'Ma jiro salaad loogu talagalay qofka aan akhrin Furitaanka Kitaabka.' Imaamka iyo cibaadada keligiis ayaa kor u akhriya salaadaha qeylada ah; haddii kale si hoose ayaa loo akhriyaa.",
        translation:
          "Magaca Eebe yaan ku billaabaynaa ee Naxariis guud iyo mid gaaraba Naxariista. Mahad dhammaanteed waxay u sugnaatay Eebaha Caalamka – Eebaha Naxariista Guud iyo Naxariista Gaarka ah leh, ee Xukunka Maalinta Abaalmarinta. adiga unbaan ku caabudaynaa, adigaana gargaar waydiisanaynaa. Noo hanuuni jidka toosan - Jidka kuwaad u Nimcday, ee ha noqonina kuwa cadhooday iyo kuwa dhunsan.",
        tip: "Waxaad dhahdaa 'Aamiin' ka bacdi Fasalka Xanafiyada oo akhrinaya qaar ka mid ah Qur'aanka oo tiir u ah iyo Al-Faatixa si gaar ah waajib ahaan; inta badan waxay haystaan ​​Al-Faatixa lafteedu waa tiirka rakcad kasta.",
      },
      {
        title: "6. akhri suurad ama aayado",
        body: "Labada rakcadood ee hore oo keliya, ku raac Al-Faatixa suurad gaaban ama dhawr aayad - tusaale ahaan suuradda Al-Ikhlaas ('Qul huwa Allaahu axad…'). Rakcada saddexaad iyo afraad waxaad akhridaa Al-Faatixa oo keliya.",
        tip: "Waxaa lagu taliyaa cibaadada keligiis ah iyo imaamka; raace ayaa dhagaysta. Xanafiyadu waxay qabaan in labada rakcadood ee hore suurad lagu daro inay waajib tahay.",
      },
      {
        title: "7. Rukuuc (ruku)",
        body: "'Allaahu Akbar' dheh, oo u sujuud adigoo fidsan, oo dib u siman, gacmahana jilbaha qabanaya, oo u tasbiixso Rabbigaa saddex jeer ama ka badan, adigoon degdegin.",
        translation: "Nasahan Eebahaybaa wayn.",
        tip: "Qaansada qudheeda, oo aamusnaanta lagu hayo, waa tiirka; tasbiixda lagu akhriyaa waa sunne (wajib dugsiyada qaarkood).",
      },
      {
        title: "8. Ka soo kaca rukuuca (i'tidal)",
        body: "Si toos ah u kaca - imaamka iyo cibaadada keligiis ah oo leh tasmi', iyo qof kasta oo dhahaya tahmid - oo si buuxda u istaag intaadan soo degin.",
        translation: "Eebbana waa maqlaa ciddii ammaanta. Eebbow adigaa mahad oo dhan iska leh.",
        tip: "Inaad si toos ah u istaagto oo aad u fududaato waa tiir - ha ku quusin sujuud ilaa aad ka degto halkan.",
      },
      {
        title: "9. Sujuudda (sujuud)",
        body: "Waxaad dhahdaa 'Allaahu Akbar' oo ku sujuud toddoba lafood - wejiga oo ay weheliyaan sanka, labada calaacasha, labada jilba, iyo suulasha labada cagood - adoo ammaanaya Eebaha Sare saddex jeer ama ka badan. Tani waa mawqifka Alle ugu dhaw ee ku shub ducada tasbiix ka dib.",
        translation: "Nasahana Eebbahaybaa iska leh.",
        tip: "Gacmaha hore ee dhulka ka fogee dhinacyada, calooshana bowdada ka ilaali.",
      },
      {
        title: "10. Fadhiga labada sujuud dhexdooda (jalsa)",
        body: "Ka kac sujuudkii ugu horeeyay ee leh 'Allaahu Akbar', fadhiiso si deggan oo toosan, oo dambi dhaaf weydiiso Eebahaa inta aadan sujuud kale u sujuudin.",
        translation: "Eebbow i cafi.",
        tip: "Fadhiiso ilaa aad ka raaxaysato - fadhigan kooban, ee aamusnaanta leh, waa tiir iskeed u taagan.",
      },
      {
        title: "11. Sujuuda labaad",
        body: "Waxaad dhahdaa 'Allaahu Akbar' oo mar labaad u sujuud sidii markii hore oo kale, adigoo isla tasbiix ah iyo isla aamusnaan leh. Tani waxay dhamaystiraysaa hal rakco oo buuxa.",
        translation: "Nasahana Eebbahaybaa iska leh.",
      },
      {
        title: "12. U istaag rakcada xigta",
        body: "'Allaahu Akbar' dheh oo istaag, dabadeed ku celi Al-Faatixa. rakcadaha saddexaad iyo afraad waxaad akhridaa Al-Faatixa oo keliya, iyadoon suurad lagu darin.",
        tip: "Labada rakcadood ee salaada ah dib ha u istaagin rakcada labaad ka dib - waxaad u fadhiisanaysaa tashahuudka u dambeeya.",
      },
      {
        title: "13. Tashaxudka ugu horaysa (Salaadaha 3-iyo 4-rakcadood)",
        body: "Rakcada labaad ee Maghrib, Dhuxur, Casar ama Isha kadib fadhiiso oo akhri At-Taxiyada, kadibna u istaag rakcada soo hadhay. Salaad laba rakcadood ah ma laha tashahud marka hore.",
        translation:
          "Dhammaan salaan, duco, iyo kalimad saafi ah Allaah ayay u sugnaatay. Asalaamu calaykum, Nabiyow, naxariista Eebe iyo naxariistiisa. Asalaamu Calaykum Waraxmatulaahi Wabarakaatuh. Waxaan ka marag kacayaa inuusan jirin ilaah kale oo aan Allaah ahayn, waxaana ka marag kacayaa in Muxammad yahay addoonkiisii ​​iyo rasuulkiisii.",
        tip: "Kor u qaad farta murdisa midig ee fadhiga. Haddi aad ilowdo tashxudkii hore oo aad bilowday inaad istaagto, sii wad oo sujuud as-sahw salaada ka hor—ha fadhiisanina.",
      },
      {
        title: "14. Final tashahhud",
        body: "Fadhiga ugu dambeeya ee salaad kasta, akhri isla At-Taxiyada kor ku xusan. In loo fadhiisto tashxudka ugu dambeeya, oo la akhriyo, waa tiir ka mid ah salaadda.",
      },
      {
        title: "15. Ku Salliya Nabiga (s.c.w.)",
        body: "At-Taxiyada u dambeeya ka dib, ku soo dir nabiga s.c.w. kalimadii uu isagu baray asxaabtiisa.",
        translation:
          "Allahayow naxariiso korkiisa ha ahaato Muxammad iyo ehelka Muxamed, sidaad ugu barakaysay Ibraahim iyo ehelkii Ibraahim; Adigu waxaad tahay Mahadnaq badane. Allow u naxariiso Muxammad iyo Ehelkii Muxamed, sidaad ugu fadliday Ibraahim iyo Ehelkii Ibraahim; Adigu waxaad tahay Mahadnaq badane.",
        tip: "Dugsiyada Shaafici iyo Xanbali waxay u arkaan salawaat fadhiga u dambeeya inay waajib tahay.",
      },
      {
        title: "16. ku tuko salaada ka hor",
        body: "Kahor intaadan dhammaan, ka magan gal Eebe afar imtixaan - ka dib duco aad rabto adduun iyo aakhiro, Carabi ama luqaddaada.",
        translation:
          "Allahayow waxaan kaa magan galay cadaabka qabriga, cadaabka naarta, imtixaamaadka nolosha iyo dhimashada, iyo sharka fitnada Masiixa beenta ah (Dajjal).",
      },
      {
        title: "17. Xiritaanka salaam (Taslim)",
        body: "Ku dhammee salaadda adigoo wejiga u leexiya midig, ka dibna bidix u rog, adoo salaan nabad ah mar kasta siiya. Salaamu calaykum salaadu way dhammaatay.",
        translation: "Asalaamu calaykum waraxmatulaahi wabarakaatuh.",
        tip: "Taslimka ugu horreeya (midig) waa tiirka; ta labaad (bidix) waa sunne dugsiyada qaar ka mid ah.",
      },
    ],
    hadith: [
      {
        excerpt: "U soo ducee sidaad aragteen anigoo tukanaya. (Maalik ibnu Xuweyrith)",
      },
      {
        excerpt:
          '"ka noqo oo tukada, illeen ma tukan" - saddex jeer ayuu ku celceliyay - markaas ayuu baray: takbiir ku akhri, qur\'aanka ku akhri wixii aad kari karto, ka dibna rukuuc ilaa aad ka raaxaysato, kac ilaa aad istaagto, sujuudna ilaa aad ka raaxaysato..',
      },
      {
        excerpt:
          "Duco ma leh qofka aan akhriyin Furitaanka kitaabka. (Ubadah bin as-Samit; sidoo kale Saxiix Muslim 394)",
      },
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Jago kasta",
    summary: "Sida saxda ah ee jidhkaaga loogu hayo meel kasta oo salaadda ah.",
    body: [
      "Meel kasta oo salaad ah waxa ay leedahay qaab jidheed oo Nabiga ﷺ soo bandhigay, asxaabtiisana la ilaaliyo. Barashada qaabka saxda ah waxay ducadaada ka ilaalinaysaa khaladaadka jireed ee caadiga ah waxayna ka caawisaa jidhku inuu taageero is-hoosaysiinta wadnaha halkii uu ka jeedin lahaa.",
      "U dhowaanshaha sujuudu waxay mudan tahay daryeel gaar ah: Nebigu (scw) wuxuu yidhi, 'Addoonku waxa ugu dhow oo u yimaada Rabbigiis waa markuu sujuudsan yahay, ee barya markaas. Sujuudda oo lagu hayo xasillooni iyo daacad ayaa ka mid ah daqiiqadaha ugu xoogga badan maalinta rumaysadka.",
    ],
    steps: [
      {
        title: "Taagan (qiyam)",
        body: "Mid toosan, cago qiyaas ahaan u kala fogaanayaan garab-ballaadhkeeda, miisaankeedu dheelli-tiran yahay, eeg meesha sujuudka, gacanta midig ee bidixda korkeeda laabta.",
      },
      {
        title: "Gacmaha oo kor loo qaado (raf'al-yadayn)",
        body: "Timirta oo u jeedda qiblada, oo la siman garbaha ama dhegaha - marka la furo takbiirta, iyo (badanaa) sidoo kale galaya kana soo kacaya rukuucda.",
      },
      {
        title: "Rukuuc (ruku)",
        body: "Dhabar siman oo siman, madax aan kor u qaadin mana hoos u dhicin, faraha ayaa kala fidsan iyagoo jilbaha qabsanaya, gacmahana dhinacyada ayaa laga hayaa.",
      },
      {
        title: "Sujuud (Sujuud)",
        body: "Dhafoorka iyo sanka dhulka, calaacalaha oo si fidsan garbaha ama dhegaha agtooda, xusullada kor iyo dhulka ka baxa, jilba hoos, suulasha u leexleexan xagga qiblada.",
      },
      {
        title: "Fadhiga (iftirash)",
        body: "Inta u dhaxaysa labada sujuudood iyo tashahuudka hore: ku fadhiiso lugta bidix adoo si siman u jiifa cagtiisa midigna toosan tahay, gacmahana bowdada ku taagan yihiin.",
      },
      {
        title: "Fadhiga u dambeeya (tawarruk)",
        body: "Tashahudka ugu dambeeya ee salaadda 3- ama 4-rakcadood ( sunnada Shaafici iyo Xanbaliyada): cagta bidix hoos mari lugta midig oo fadhiiso dhulka.",
      },
      {
        title: "Madaxa u roga salaam (taslim)",
        body: "Wejiga si buuxda ugu leexi dhanka midig, ka dibna bidix, adoo wata ereyada nabadda - ku dhammeeya salaadda markaad malaa'igta ku salaamo garab kasta.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Addoon u yimaadda Eebihiis waxaa ugu dhaw markuu sujuudsanyahay ee barya. (Abuu Hureyrah)",
      },
    ],
    disclaimer:
      "Kala duwanaanshiyaha yar yar ee meelaynta gacanta, qaabka loo fadhiisto, iyo kor u qaadida gacmaha ayaa dhamaantood ku qotoma warbixino dhab ah; dugsiyadu mid waliba wuxuu raacayaa sheeko sax ah. Midna ma burinayo salaadda qof kale.",
  },
  {
    title: "Khaladaadka caadiga ah",
    summary: "Khaladaadka si aamusan u daciifiya salaadda - iyo sida loo saxo mid kasta.",
    body: [
      "Inta badan ceebaha salaaddu maaha dembiyada qalbiga ee waa caadooyinka degdegga ah iyo feejignaan la'aanta. Magacaabiddooda waa tallaabada ugu horreysa ee lagu hagaajinayo; Nebigu ﷺ qudhiisu wuu saxay salaaddii saxaabi si sabir iyo toos ahba leh, taas oo ina baraysa in khaladaadkani ay yihiin kuwo caadi ah oo la hagaajin karo.",
      "Qabrigu wuu soo yaacay - isagoo rukuuc iyo sujuud ku dhex wareegaya isagoon xasilloonayn. Tuma'ninah (degnaan la'aan) waa tiir ka mid ah salaadda culimada inteeda badan, sidaa darteed salaadda degdegga ah maaha oo keliya mid aan qummanayn ee waxay noqon kartaa mid bura. Ka shaqee liiska hoos ku qoran hal caado markiiba.",
    ],
    steps: [
      {
        title: "Ducada degdega ah",
        body: "In yar oo rukuuc ama sujuud ku hakad. Joog ilaa jidhkaagu ka degayo oo aad odhan karto dikriga ugu yaraan saddex jeer adigoon degdegin.",
      },
      {
        title: "Wudu aan dhamaystirnayn",
        body: "Baro qallalan oo ku yaal cidhibta, anqawyada, xusullada, ama faraha dhexdooda. Nabigu ﷺ wuxuu ka digay, 'Halaag bay u sugnaatay cidhibta Naarta.' Si tartiib ah oo fiican u dhaq.",
      },
      {
        title: "Dib u qaloocan oo rukuucsan, oo sujuud quusaya",
        body: "Ku foorarsiga dhabarka wareegsan, ama ku nasiyo foodda sanka la'aan, ama u oggolaan in gacmaha hore ay si siman u jiifsadaan dhulka. Ilaali heerka dhabarka iyo kor u qaadida suxullada.",
      },
      {
        title: "Indhaha iyo qalbiga wareegaya",
        body: "Daawashada hareeraha, ama hubinta taleefanka. Indhaha ku hay meesha sujuudka oo aamus ama ka saar teleefankaaga takbiirta ka hor.",
      },
      {
        title: "Tartan ka hor imaamka",
        body: "Jameecada, u guurista rukummada ama sujuud imaamka hortiisa. Raac isaga - waligaa ha ka hor marin - dhaqaaqa kaliya ka dib marka uu sameeyo.",
      },
      {
        title: "Hadalka, cunista, ama qosolka",
        body: "Hadal kasta oo ula kac ah, wax cunaya, cabbid, ama qosol la maqli karo ayaa jebiya salaadda. Saalax waa la sheekeysi Eebbe oo keliya.",
      },
      {
        title: "Inaad si khaldan u akhrido Al-Faatixa",
        body: "Ka boodista erayada, ama samaynta khaladaad macnaha beddela. Baro xaraf qumman - salaadda oo dhan waxay ku xiran tahay iyada.",
      },
    ],
    actions: [
      "Tuko hal Salaadda maanta kala bar xawaarahaaga caadiga ah oo fiirso sida ay u kala duwan tahay.",
      "Aamus teleefankaaga ama ku dhaaf qol kale ka hor intaadan takbiirta furin odhan.",
      "Weydii qof aqoon u leh inuu daawado mid ka mid ah salaaddaada oo uu saxo qaabkaaga.",
    ],
    appLinks: [{}],
  },
  {
    title: "ku dhaqanka sunnada",
    summary: "Rasuulku ﷺ wuxuu ku taliyey ficillo qurxinaya oo badinaya ajarka salaadda.",
    body: [
      "Marka laga soo tago camalka waajibka ah, nabigu ﷺ wuxuu qaabeeyay dhaqamo badan oo lagu taliyay (sunan) salaadda agteeda. Looma baahna, sidaas darteed haddii qofku ka tago ma burinayo salaadda - laakiin mid kasta wuxuu kuu soo dhoweynayaa Eebbe, wuxuuna helayaa ajir dheeraad ah, wuxuuna hagaajinayaa wixii ka dhiman salaadaha faralka ah.",
      "Waxaa ka mid ah salaadaha sunnaha ah ee la tukado ka hor iyo ka dib: laba Fajar ka hor, afar ka hor iyo laba ka dib Duhur, laba ka dib Maghrib, iyo laba ka dib Cisha - laba iyo toban rakcadood oo ajrigooda waa guri Jannada laga dhisay.",
    ],
    actions: [
      "Isticmaal miswak (siwak) ka hor ducada iyo salaadda - Nabiga ﷺ wuxuu ku sigtay inuu waajib ka dhigo.",
      "U soco masaajidka si degan oo hore - tilaabo kasta waxay kor u qaadaysaa darajo waxayna tirtirtaa dembiga.",
      "Ilaali laba iyo tobanka rakcadood ee sunnada rawatib guri ballan ah oo Jannada ah.",
      "Masaajidka ku gala lugta midig oo bidixda kaga bax mid walbana ducadiisa.",
      "Salaad kasta ka dib akhri adhkar la aasaasay - fiiri Salaadda ka dib.",
    ],
    hadith: [
      {
        excerpt:
          "Haddaanan umaddayda culaysin, waxaan amri lahaa inay isticmaalaan siwaak salaad kasta ka hor. (Abuu Hureyrah; sidoo kale Saxiix Muslim 252).",
      },
      {
        excerpt:
          "Qofkii tukada laba iyo toban rakcadood oo salaad ah habeen iyo maalin, waxaa looga dhisayaa guri Jannada ku yaal. (Ummu Xabiibah)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Khushu - joogitaanka wadnaha",
    summary: "Hadafka safarka oo dhan: inaad u tukato sidii adigoo Allaah arkaya.",
    body: [
      "Khushu waa is-hoosaysiinta, diiradda, iyo wacyiga in aad si dhab ah u taagan tahay Ilaah hortiisa. Waa waxa dhaqdhaqaaqa jireed ee salaadda u beddela cibaadada dhabta ah. Nebigu (ﷺ) wuxuu ku qeexay wanaagga “in aad u caabuddo Eebbe sidii adigoo arkaya oo kale, waayo, in kastoo aanad arkin isaga, haddana isagaa ku arkaya.”",
      "Eebbe wuxuu ku furay tilmaanta mu’miniinta liibaanay: ‘Kuwa salaadda ku khushuucsan’ (23:1-2). Wuxuuna aad uga digay casigeeda, waa u hoog kuwa tukada oo halmaansan salaaddooda, waana canaan ku wajahan kuwa jidhkoodu dhaqaaqo iyadoo qalbigoodu maqan yahay.",
      "Khushu waa la dhisay, lama rabo. Baro macnaha waxa aad akhrinayso si ereyadu kuugu dhaqaajiyaan. Ka saar waxyaalaha mashquuliya ka hor takbiirta. Hoos u dhig oo bixi meel kasta xasilloonideeda. Ka fiirso weynaanta uu leeyahay midka aad la hadlayso iyo xaqiiqda ah in ducadani ay noqon karto mid kuugu dambaysa. Tuko salaad kasta salaad sagootin ah, siduu nabigu NNKH ku waaniyay.",
      "Ha ku niyad jabin fikradaha warwareega - xitaa asxaabta ayaa la halgamay iyaga. Halganka lagu soo celinayo diiraddaada, mar kale iyo mar kale, lafteeda waa qayb ka mid ah cibaadada. Khushu waxay koraan inta nool oo dhan; joogtayntu waa waxa kobciya.",
    ],
    quran: [
      {
        excerpt: "Waxaa liibaanay kuwa rumeeyey (xaqa) ee salaadda ku khushuucay.",
      },
      {
        excerpt: "Ee halaag wuxuu u sugnaaday kuwa tukada oo salaadda halmaansan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ixsaanku waa inaad Eebbe u caabuddo sidii adigoo arkaya oo kale, illeen haddaadan arkayn haddana wuu ku arkayaa. (Xadiis Jibriil, Cumar)",
      },
    ],
    actions: [
      "Akhri hal odhaah macnaheeda oo ka mid ah Erayada Saalax ka hor salaad kasta usbuucan.",
      "Haki saddex ilbiriqsi oo aan degdegayn meel kasta ka hor intaadan dhaqaaqin.",
      "U fiirso heerka diiradaada joornaalka ka dib Salaadda oo daawo qaabka oo isbedelaya.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tiirarka & Burinta",
    summary: "Maxaa salaaddu aanay jiri karin la'aanteed - iyo maxaa burinaya.",
    body: [
      "Falalka salax waxay u kala baxaan saddex darajo. Tiirarka (arkan) waa qaybo lama huraan ah: ka tegista si badheedh ah waxay burinaysaa salaadda, illowsiinta midna waa in la saxo iyadoo loo noqonayo. Waajibaat (wajibaat) waa la rabaa, haddiise la iloobo waxaa lagu hagaajiyaa sujuudda hilmaanka (Sujud al-sahw). sunnada oo dhammays tiran oo qurxisa salaadda, ka tagisteedana wax ciqaab ah ma leh.",
      "Ogaanshaha kala sareyntan waxa ay kaa ilaalinaysaa laba daraf: in waxa yar oo la dhaafo loola dhaqmo mid burburay, ama in tiir dhab ah loola dhaqmo sidii ikhtiyaari. Marka laga shakiyo tiir, salaaddu ma fayow ilaa ay ka dhammaato.",
      "Dhanka kale, waxyaabaha qaarkood waxay burinayaan salaadda isla marka ay dhacaan - sababtoo ah waxay ka soo horjeedaan xaaladda salaadda lafteeda. Kuwo kalena way buriya wuduuga, taas oo iyaduna dhamaysa salaadda. Labadaba ka ilaali si aanad waligaa u tukan adigoon ogayn.",
    ],
    steps: [
      {
        title: "Tiirarka (arkan)",
        body: "Isagoo taagan markuu awoodo, takbiirta furitaanka, akhrinta Faatixada, rukuda, ka soo kaca, labada sujuud, fadhi dhexdooda, fadhiga u dambeeya, tashaxudka, salaamaha, tumanaha mid walba, iyo ilaalinta nidaamka saxda ah.",
      },
      {
        title: "Falalka waajibka ah (wajibat)",
        body: "Sida takbiirta kale, ereyada dikriga ee rukuucda iyo sujuuda, iyo tashahuudka ugu horeeya - waxaa dayactiray sujuud al-sahw haddii la iloobo (sida ku xusan tafatirka Xanbalka; dugsiyadu way kala duwan yihiin).",
      },
      {
        title: "Burinaya wudu",
        body: "Wax kasta oo ka soo baxa marinnada hore ama dambe, hurdo qoto dheer, miyir beelid - iyo, culimada qaarkood, si toos ah u taabanaya qaybaha gaarka ah. Mid kasta oo kuwaas ka mid ah ayaa dhameeya salaadda.",
      },
      {
        title: "Wax baabi'iya salaadda lafteeda",
        body: "Hadal ula kac ah, cunno ama cabbid ula kac ah, dhaqdhaqaaq aan loo baahnayn oo badan oo joogto ah, qosol qaylo ah, laabta si badheedh ah uga leexinaya qiblada, iyo qaawinta cawrada.",
      },
    ],
    appLinks: [{}],
    disclaimer:
      "Afarta dugsi waxay u kala soocaan falalka qaar si kala duwan - tusaale ahaan haddii tashaxudka hore ay tahay waajib ama sunne, ama liiska saxda ah ee waxa u baahan sujuud al-sahw. Ka baro faahfaahinta dugsigaaga macalin aqoon leh.",
  },
  {
    title: "Sujud al-Sahw - saxidda khaladaadka",
    summary: "Sujuudda hilmaanka ee hagaajisa salaadda ayay simbiriirixataa.",
    body: [
      "Ma jiro qof ka dhawrsan in uu salaadda ku illoobo - xitaa Nebigu ﷺ wuu illoobay, oo haddana baray, 'waxaan ahay bashar kula mid ah; Sida aad illowdo ayaan u ilaawaa, marka markaan iloobo i xasuusi. Tusaalahiisa waxaa ka soo baxay dawo dhisan: laba sujuud oo dheeri ah, oo la yiraahdo sujud al-sahw (sujuud al-sahw), kuwaas oo daboolaya khaladaadka yaryar si aan salaadda loo soo celin.",
      "Waxa loogu baaqayaa saddex xaaladood oo ballaadhan: wax-is-kordhin (in la tukado rakco dheeraad ah ama si khalad ah), ka tegid (ka tagista waajibka sida tashahuudka hore), ama shaki (adoo aan hubin inta rakcadood ee aad tukatay). Looma baahna in laga tago sunno, ama khaladaad ula kac ah - kuwaas ayaa leh xukun iyaga u gaar ah.",
      "Markaad shaki dhab ah gasho, mabda'a hanuunku waa: iska tuur shakiga, ku dhis waxa aad yaqiinsan tahay (tirada yar), salaadda oo dhammi, ka dibna labada sujuudood. Tani waxay jahawareer u beddeshaa duco deggen oo ansax ah halkii ay ka ahaan lahayd male walaac leh.",
      "Dhab ahaan: u samee laba sujuudood oo u dhig sida sujuudaada caadiga ah, adigoo takbiir ah ka hor iyo ka dib, ka dibna salaam. Culimadu waxay ku kala duwan yihiin inay yimaadaan salaadda ka hor ama ka dib iyadoo ku xidhan nooca baadi-ka-labadaba si dhab ah ayaa loo wariyey, markaa midkoodna waa la aqbalayaa mana burinayo salaadda.",
    ],
    hadith: [
      {
        excerpt:
          "Haddii midkiin shaki ku jiro salaaddiisa oo uusan garanayn inta uu tukaday - saddex ama afar - ha iska tuuro shakiga, ha dhiso waxa uu hubo, ka dibna laba jeer u sujuuday salaadda. (Abuu Saciid Al-Khudri)",
      },
      {
        excerpt:
          "Midkiin markuu ka shakiyo salaaddiisa ha raadiyo xaqa hana u dhammaystiro korkeeda, ka dibna u salaamo oo sujuudo laba jeer. (Ibnu Mascuud; sidoo kale Saxiix Muslim 572).",
      },
    ],
    actions: [
      "U xifdi qaanuunka shakiga: ku dhis tirada yar, dhamee, ka dibna laba jeer sujuud.",
      "Haddaad garato salaadda badhtanka inaad ka tagtay tashxudkii ugu horreeyay, sii wad oo sujuud al-sahw dhammaadka.",
    ],
    appLinks: [{}],
    disclaimer:
      "Labada sujuudood inay soo dhacaan ka hor ama ka dib waxay ku xidhan tahay khaladka, dugsiyaduna way kala duwan yihiin. Labaduba sunnada ayay ka soo jeedaan; yeyna hubaal la'aantu halkan kaa joojin inaad tukato.",
  },
  {
    title: "Noocyada Salaadda",
    summary: "Fard, sunne, witri, iyo salaadaha iskaa wax u qabso ee hodmiya maalinta mu’minka.",
    body: [
      "Salaadda waxa lagu qiimeeyaa waajib. Shanta salaadood waa farad - Waajib adag oo saaran qof kasta oo Muslim ah oo lala xisaabtami karo. Hareerahooda iyo hareerahooda waxaa ku yaal duni qani ah oo duco ikhtiyaari ah oo uu Nebigu ﷺ ugu dhawaaday Alle, annaguna aan awoodno.",
      "Salaadda iskaa wax u qabso ah laba arrimood dartood: waa camal la jecel yahay oo kor u qaadaya darajada qofka mu’minka ah – Eebbe wuxuu yidhi cibaadada dheeraadka ah, ‘Adoonkaygu wuxuu iigu soo dhawaadaa camal mutadawacnimo ah ilaa aan ka jeclaado’ — waxayna hagaajiyaan salaadaha waajibka ah, mar haddii ay ka dhammaato wax kasta oo fardku ku yimaaddo oo laga dhammeeyo salaadda is-xilqaanka ah ee qofka maalinta qiyaame.",
    ],
    steps: [
      {
        title: "Shanta fard ee maalinlaha ah",
        body: "Fajr, Dhuhr, Casr, Maghrib, Isha - aasaaska waajibka ah, oo aan marnaba laga tegin.",
      },
      {
        title: "Sunnah rawatib",
        body: "Rakcooyinka sunnaha ah ee caadiga ah ka hor iyo ka dib Fardka - laba iyo toban maalin kasta waxay kasbadaan guri Jannada dhexdeeda ah.",
      },
      {
        title: "Witr",
        body: "Salaad aan tiro lahayn oo cisha ka dib ah, shaabadda salaadda habeenka - sunnada mucakaddah ee badi, iyo waajibka mad-habka Xanafiyada.",
      },
      {
        title: "Tahajjud (qiyam al-layl)",
        body: "Salaadda habeenka ee saddexaad ee ugu dambeeya habeenka - salaadda iskaa wax u qabso ee ugu fadliga badan, iyo caadada kuwa xaqa ah.",
      },
      {
        title: "Duha",
        body: "Salaadda subaxda (2-8 rakcadood) - waa samafal ku aaddan mid kasta oo ka mid ah xubnaha jirka maalin kasta.",
      },
      {
        title: "Taraawiixda",
        body: "Salaadda habeenka jameecada ee Ramadaan - soo noolaynta habeenada bisha barakeysan.",
      },
      {
        title: "Labada Ciidood",
        body: "Laba rakcadood oo ah Ciidul Fidriga iyo Ciidul-Adxa, waxaa xigay wacdigii.",
      },
      {
        title: "Istikharah",
        body: "Duco laba rakcadood ah oo hanuunka Alle ka hor inta aanad go'aan gaadhin.",
      },
      {
        title: "Janaza",
        body: "Salaadda janaasada - Waajib wadaag ah (fard kifayah) oo la bixiyo taagan, iyada oo aan rukuuc iyo sujuud lahayn.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Salaadda ugu wanaagsan salaadaha faralka ah ka dib waa salaadda habeenka. (Abuu Hureyrah)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Jimcaha - salaadda Jimcaha",
    summary:
      "Waajibaadka toddobaadlaha ah ee bulshada isu keenta oo maalinta Jimcaha beddela Dhuxul.",
    body: [
      "Jumcadu waa salaadda jameecada ee la tukado duhur ka dib maalin kasta oo Jimce ah, waana waajib gaar ah, oo magac ahaan lagu faray Qur’aanka kariimka ah: ‘Marka salaadda la yeedho maalinta jimcaha u degdega xuska Eebbe oo ka taga ganacsiga. Waxay ka kooban tahay muxaadaro (khutbah) oo laba qaybood ah oo ay daba socoto laba rakcadood oo kor loogu tukaday imaamka gadaashiisa, waxayna ka qaadaysaa booska Dhuxul dadka ka soo qaybgalaya.",
      "Waa waajib shaqsiyadeed (fard 'ayn) oo saaran qof kasta oo xor ah, qaangaar ah, degan, oo Muslim ah. Nabigu ﷺ wuxuu qeexay inay waajib ku tahay qof kasta oo muslim ah oo jameeco ah, marka laga reebo afar: addoon, naag, ilmo, ama qof xanuunsan. Haweenka, musaafirka iyo kuwa buka waa loo cudur daaraa oo waxay ku tukadaan Duhur, haddii ay rabaan.",
      "Dayacadeedu waa khatar aad u daran: Nabigu ﷺ wuxuu uga digay ruuxii ka taga saddex jumco halmaan la'aan, in Eebe daboolo qalbigiisa. Haddana ajarkeeda si la mid ah ayaa u weyn - maalinta Jimcaha waa maalinta ugu wanaagsan ee qorraxdu soo baxdo, waxayna haysataa saacad ducada la ajiibo.",
      "U diyaari sidii uu Nabigu ﷺ yeelay oo kale: xidho dharkaaga nadiifka ah, udgoonka mari, wakhti hore u bax, oo si taxadar leh u dhagayso khutbah adigoo aamusan (hadalka bilaa camalka ah inta lagu jiro waxay lumisaa ajarka). In la akhriyo suuradda al-Kahf maalinta jimcaha waxay keenaysaa iftiin u dhexeeya labada jimcaha.",
    ],
    quran: [
      {
        excerpt:
          "Kuwa (Xaqa) rumeeyow, marka la Dhawaaqo Salaadda Jimcaha, u Deg dega Xuska Eebe, Ganacsigana ka taga. saasaa idiin khayr roon haddaad tihiin kuwo wax og.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Salaadda Jimcaha ee Jameecada waa waajib saaran qof kasta oo Muslim ah, marka laga reebo afar: addoon, naag, ilmo iyo qof xanuunsan. (Taariq ibn Shihab)",
      },
      {
        excerpt:
          "Qofkii ka taga saddex salaadood oo jimce ah isagoo halmaansan, Eebbe wuxuu daboolayaa qalbigiisa korkiisa. (Abuu al-Jacd; sidoo kale Abuu Daawuud 1052, at-Tirmidhi 500)",
      },
      {
        excerpt:
          "Gusl maalinta jimcaha waxay ku waajibtay qof kasta oo qaan gaadhay. (Abuu Saciid Al-Khudri)",
      },
    ],
    actions: [
      "Samee ghusl, xidho dhar nadiif ah iyo udgoon, oo goor hore u imow - ka qaybgalayaasha ugu horreeya waxay helayaan abaalmarinta ugu weyn.",
      "Akhri suuradda al-Kahf wakhti maalinta jimcaha si aad nuur u hesho inta u dhaxaysa labada jimce.",
      "Si buuxda u aamus oo u fiirso inta lagu jiro khutbah; telefoonka ka fogee.",
    ],
    appLinks: [{}],
    disclaimer:
      "Tirada ugu yar ee ka soo qaybgalayaasha, iyo haday gulufku tahay mid waajib ah ama sunne adag, waa qodobbo ay ku kala duwan yihiin cilmiga. Raac dhaqanka la isku halayn karo ee bulshada deegaankaaga.",
  },
  {
    title: "Salaada jameecada",
    summary:
      "In lagu tukado imaamka gadaashiisa - abaalgudka waxa la badiyo todoba iyo labaatan jeer.",
    body: [
      "In lagu tukado shanta salaadood ee jameecada (jamacada) aad bay xooga u saartaa, gaar ahaan ragga, waana astaan ​​lagu garto bulshada muslimka ah ee nool. Nebigu ﷺ wuxuu baray in salaadda jameecadu ay todoba iyo labaatan jeer ka badan tahay ajar ka badan kan salaadda la tukaday oo keliya - laba-laabansho ma jiro dadaal shaqsiyeed oo la mid ah.",
      "Jameecadu waxay u taagan tahay saf toosan, oo aan farqi lahayn, garab iyo garbaha, si sax ah u raacaya imaamka: waxaad bilaabaysaa dhaqdhaqaaq kasta ka dib marka uu sameeyo, waligaa isaga ka hor, waligaa isla markiiba isla markiiba. Toosinta safafka lafteedu waa qayb ka mid ah dhamaystirka salaadda.",
      "Haddi aad timaaddo markuu imaamku bilaabay kadib (qofka dambe waxaa loo yaqaan masbuq), isla markiiba ku biir meel kasta oo aad ku aragto - qaybtaas wali waxay ku xidhan tahay inaad la tukato. Marka uu salaadda kama dambaysta ah bixiyo, istaag oo dhammayso rakcooyinkii aad seegtay kaligaa, kadibna dhammayso.",
      "Jameecadu kuma jirto masaajidka oo kaliya: laba qof oo wada tukanaya ayaa jamaaco ah, markaas aabaha iyo ilmahiisa, ama laba saaxiibo ah oo safraya, waxay ku heli karaan ajarkeeda. Dumarku waxa ay ku tukan karaan jamaaco oo ay tagaan masaajidka ay ku yaalaan tas-hiilaadka ku haboon,inkasta oo salaada ay ku tukadaan guriga ay sidoo kale si wayn u ajarayaan.",
    ],
    hadith: [
      {
        excerpt:
          "Salaadda jameecada todoba iyo labaatan darajo ayaa ka fadli badan salaada kaligeed la tukado. (Ibnu Cumar; sidoo kale Saxiix Muslim 650)",
      },
    ],
    quran: [
      {
        excerpt: "Ooga Salaadda, Sakadana bixiya una Rukuuc kuwa Rukuucsan.",
      },
    ],
    actions: [
      "Ugu yaraan hal salaad ku tukado masjidka maanta, ama reerkaaga isugu keen saf guriga.",
      "Baro waxa la sameeyo ka soo daahay: hal mar ku biir, dabadeed dhame rakcadaha kaa seegay salaamaha imaamka ka dib.",
    ],
  },
  {
    title: "Salaadda la waayey (qada).",
    summary: "Samaynta wixii seegay - albaabkii naxariista Eebe wuu furan yahay.",
    body: [
      "Haddii salaad farad la dhaafo - hurdo badan, ilowsho, ama (Alle ha naga ilaaliyo) dayacaad - waajibku si fudud uma baaba'o. Waa in la sameeyaa (qada) , Nabiguna ﷺ wuxuu xukunka ku caddeeyey: 'Ruuxii salaad illoobay ama ku seexday kafaaragoodu waa inuu tukadaa markuu xasuusto''. Madax furasho kale ma jiro in la tukado mooyee.",
      "Salaad la qurxiyey ayaa loo oogaa qaabkii asalka ahaa: Afarta rakcadood ee Dhuxul ka maqan waxaa lagu tukanayaa afar rakcadood xitaa haddii aad habeen iyo safar ku soo kacdo. Ruuxii ku seegay salaadda cudurdaar dhab ah (sida hurdo dheer) ma qaado dembi dib udhigis. Midkii iyaga uga tagay si ula kac ah waa inuu ka dhigaa iyaga oo garab socda toobad dhab ah oo degdeg ah.",
      "Culimadu waxay ku dhiirri-galiyaan in si degdeg ah iyo si habboon loo sameeyo salaadda la seego, iyada oo aan loo oggolaan inay is-dul-saaraan-maxaa yeelay culaysku wuu ka sii cuslaa wakhtiga iyo dib u dhaca. Haddii tiro badan ay seegtay sannado badan, ula xiriir qorshe maalinle oo macquul ah halkii aad ka quusan lahayd; Albaabkii soo noqoshadu mar walba waa furan yahay.",
    ],
    hadith: [
      {
        excerpt:
          "Qofkii halmaamaa salaad ama ku seexday, kafaaragoodu waa inuu tukado markuu xasuusto. (Anas; sidoo kale Saxiix Muslim 684)",
      },
    ],
    actions: [
      "Si daacad ah u qiyaas inta salaadood ee lagugu leeyahay oo samee bartilmaameed maalinle ah oo la isku qurxiyo.",
      "Ku lammaan salaad kasta oo waajib ah iyo hal salaad oo isqurxin ah ilaa ay ka soo baxayso.",
      "Waligaa ha daahin ducada wakhtigan xaadirka ah si aad mid hore uga dhigto - ku ilaali salaada maanta wakhtigeeda.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Salaad kadib",
    summary: "Adkaarta iyo ducooyinka lagu daboolo ajarkeeda salaad kasta.",
    body: [
      "Nebigu ﷺ si lama filaan ah ugama kicin salaadda. Wuxuu ahaan jiray mid fadhiistay, isaga oo dembi-dhaaf waydiisan doona oo ku mashquuli jiray xuska - wuxuuna baray in wakhtiga salaadda waajibka ah ka dib ay ka mid tahay waqtiyada ducada si degdeg ah loo ajiibo. Ka tagista isla markiiba waxay lumisaa qaar ka mid ah midhaha ugu waaweyn ee salaadda.",
      "Nidaamka salaadda ka dib ee la aasaasay waa mid fudud oo miisaan leh: waxaad tidhaahdaa 'Astaghfirullah' saddex jeer; markaas hadalka tawxiidka iyo ammaanta; ka dibna 'SubhanAllaah', 'Alxamdulilah', iyo 'Allaahu Akbar' midkiiba saddex iyo soddon jeer, iyagoo boqolka ku shaabadeynaya 'La ilaha illallah...'",
      "Aayad al-kursi oo la akhriyo salaad kasta oo waajib ah ka dib waxay ka saaraysaa geerida qofka iyo Jannada dhexdooda, siduu Nebigu NNKH u ballan qaaday. Raac saddexda Qul ee (Al-ikhlaas, Al-Falaq, An-Nas), kuna dar aroorta fajar ka dib iyo maqribka casar ama Maghrib ka dib oo ay dalbadaan.",
    ],
    hadith: [
      {
        excerpt:
          "Qofkii tasbiixsada, ammaana, weyneeyana saddex iyo soddon jeer salaad kasta ka dib… oo dhammeeya boqolka tawxiidka, dembigiisa waa loo dhaafaa in kastoo ay la mid yihiin xumbo badda. (Abuu Hureyrah)",
      },
      {
        excerpt:
          "Qofkii akhriya aayatul-kursi salaad kasta ka dib, wax u dhexeeya isaga iyo jannada laguma galo geeri mooyee. (Abuu Umamah; al-Albaani oo darajada saxiix ah soo saaray)",
      },
    ],
    actions: [
      "Xafid salallah tasbih (33/33/33 + tahliil) usbuucan.",
      "Akhri Aayat al-Kursi iyo Saddexda Qul intaadan istaagin.",
      "Ku fadhi hal daqiiqo oo duco gaar ah ka dib salaad kasta oo fard ah.",
    ],
    appLinks: [{}, {}],
  },
];

export const SALAH_GUIDE_PHRASES_SO: DeepPartial<SalahGuidePhrase>[] = [
  {
    title: "Ka dib markii ay dhammeeyeen wudu",
    when: "Isla markiiba ka dib marka la dhammeeyo qumbaha, ka hor salaadda.",
    translation:
      "Waxaan ka marag kacayaa inuusan jirin ilaah kale oo aan Allaah ahayn oo aan la wadaagin, waxaana marag ka ah Muxammad inuu yahay addoonkiisii ​​iyo Rasuulkiisii.",
    meaning:
      "Dib u cusboonaysiinta maragga iimaanka iyadoo jidhkaagu nadiif yahay. Nebigu (scw) wuxuu u ballan qaaday in ruuxii sidaas dhaha sacbada kadib, waxaa laga furay sideeda albaab ee jannada inuu ka galo ciduu doono.",
  },
  {
    title: "Takbiirta al-Ihraam",
    when: "Bilawga salaada, iyo marka loo kala guurayo boosaska.",
    translation: "Allaah ayaa u weyn.",
    meaning:
      "Salaaddu waxay ka bilaabataa halkan - 'al-ixram' macnaheedu waa inay kaa mamnuucday waxyaalaha adduunka (hadalka, cunista, ka jeedsashada). Waxaad sheegtaa in Alle ka weyn yahay wax kasta oo ku mashquulin kara, oo aad si buuxda ugu tallaabsanayso hortiisa. Takbiir kasta oo soo raaca ayaa soo cusboonaysiiya is-dhiibidda.",
  },
  {
    title: "Du'a al-Istiftah (ducada furitaanka)",
    when: "Aamusnaanta ka dib takbiirta furitaanka, ka hor Al-Faatixa.",
    translation:
      "Subxaanallaah Allow Adiga ayaa Mahad leh. Magacaagu waa barakaysan yahay, oo haybaduhuna waa la sarreeyaa. Ilaah aan adiga ahayn ma jiro.",
    meaning:
      "Waxa aad ku furaysaa hadalka adiga oo Alle ku tasbiixsanaya oo u mahad-celinaya, isla markaana caddaynaysa kalinimadiisa, qalbigana dejinaysa ka hor inta aanad akhriyin hadalkiisa. Dhawr ducooyin furitaanka oo dhab ah ayaa jira - tani waa mid ka mid ah kuwa ugu isticmaalka badan.",
  },
  {
    title: "Suuradda Al-Faatixa",
    when: "Ku istaaga rakco kasta - tiir aan la'aanteed rakcadu buray.",
    translation:
      "Magaca Eebe yaan ku billaabaynaa ee Naxariis guud iyo mid gaaraba Naxariista. Mahad dhammaanteed waxay u sugnaatay Eebaha Caalamka – Eebaha Naxariista Guud iyo Naxariista Gaarka ah leh, ee Xukunka Maalinta Abaalmarinta. adiga unbaan ku caabudaynaa, adigaana gargaar waydiisanaynaa. Noo hanuuni jidka toosan - Jidka kuwaad u Nimcday, ee ha noqonina kuwa cadhooday iyo kuwa dhunsan.",
    meaning:
      "Hooyada kitaabka: mahad Alle badhkiis iyo baryo hanuun, iyadoo leh 'Adiga ayaanu caabudaynaa' sida daabka dhexdooda. Eebbe wuxuu yidhi wuxuu u qaybiyey suuraddan isaga iyo addoonkiisa dhexdooda - markaad akhrinayso sadar kasta, wuxuu ku jawaabayaa. Nabigu ﷺ wuxuu yidhi ma jirto duco qof aan akhriyin.",
  },
  {
    title: "Dhikr in ruku",
    when: "Inta rukuucsan, oo guri leh, dib u degtay.",
    translation: "Nasahan Eebahaybaa wayn.",
    meaning:
      "Rukuucdu waa mawqifka xushmada, sidaas darteed waxaad u weynaysaa weynaanta Eebe - saddex jeer ama ka badan, oo aan degdegin. Rasuulku ﷺ wuxuu baray in rukuucda aynu ku sarrayno Rabbi, ee rajee in ducadaada laga jawaabo.",
  },
  {
    title: "Ka kaca rukuucda",
    when: "Isagoo si buuxda u taagan sujuud ka dib.",
    translation: "Eebbana waa maqlaa ciddii ammaanta. Eebbow adigaa mahad oo dhan iska leh.",
    meaning:
      "Waxaad cadaynaysaa in Eebe si dhab ah maqlayo kan ku mahadiya, kadibna isaga u soo celi mahad oo dhan. Rasuulku ﷺ wuxuu yiri markuu imaamku sidaas dhaho dadkiina ay jawaabaan, qofkii hadalkiisa ku beegma malaa'igta waxaa loo dhaafaa dambigiisii ​​hore.",
  },
  {
    title: "Dhikr in sujuud",
    when: "Sujuuda - booska ugu dhow Eebe.",
    translation: "Nasahana Eebbahaybaa iska leh.",
    meaning:
      "Meesha ugu hoosaysa ee jidheed waxaad ku ammaanaysaa Kan ugu sarreeya - is-barbar yaaca qalbiga cibaadada. Nabigu ﷺ wuxuu yidhi addoonku wuxuu u dhaw yahay Rabbigiis isagoo sujuudsan, ee ku shub ducada halkan ka dib markaad tukato.",
  },
  {
    title: "Labada sujuud dhexdooda",
    when: "Si deggan u fadhiiso inta u dhaxaysa sujuudka koowaad iyo labaad ee rakco kasta.",
    translation: "Eebbow i cafi. Eebbow i cafi.",
    meaning:
      "Dambi dhaaf gaaban oo toos ah rakcad kasta - waa xusuusin in xitaa salaadda badhtanka aan u baahanahay cafis Eebbe. Fadhiiso ilaa aad ka raaxaysato ka hor sujuudda labaad.",
  },
  {
    title: "At-Tahiyyat (Tashahhud)",
    when: "Fadhi dhexe iyo fadhigii ugu dambeeyay ee Salaadda.",
    translation:
      "Dhammaan salaan, duco, iyo kalimad saafi ah Allaah ayay u sugnaatay. Asalaamu calaykum, Nabiyow, naxariista Eebe iyo naxariistiisa. Asalaamu Calaykum Waraxmatulaahi Wabarakaatuh. Waxaan ka marag kacayaa inuusan jirin ilaah kale oo aan Allaah ahayn, waxaana ka marag kacayaa in Muxammad yahay addoonkiisii ​​iyo rasuulkiisii.",
    meaning:
      "Qalbiga fadhiya ee salaadda: waxaad u cibaadaysanaysaa dhammaan cibaadada Eebbe oo keliya, nabadgeli nabiga ﷺ iyo kuwa dhawrsada korkiisa, oo ku celceli labada markhaati. Ibnu Mascuud waxa uu ka bartay Nabiga ﷺ kalmad kalmad, sida qofku u barto suurad.",
  },
  {
    title: "Salawaat Ibrahimiyyah",
    when: "Tashahhud kama dambeys ah, At-Tahiyyat ka dib.",
    translation:
      "Allahayow naxariiso korkiisa ha ahaato Muxammad iyo ehelka Muxamed, sidaad ugu barakaysay Ibraahim iyo ehelkii Ibraahim; Adigu waxaad tahay Mahadnaq badane. Allow u naxariiso Muxammad iyo Ehelkii Muxamed, sidaad ugu fadliday Ibraahim iyo Ehelkii Ibraahim; Adigu waxaad tahay Mahadnaq badane.",
    meaning:
      "Markii ay asxaabtu waydiiyeen sida loogu duceeyo, Nabigu ﷺ wuxuu baray kelmadahan saxda ah - salawaatka ugu sugan Sunnada. Waxaad u xurmaysaa Rasuulka ﷺ sidii Alle ku faray, adigoo ku dhammaynaysa jacaylkaaga ruuxii ku baray inaad tukato.",
  },
  {
    title: "In la magan galo salaam ka hor",
    when: "Tashahhudka iyo salawaatka u dambeeya ka dib, wax yar ka hor intaadan dhamayn salaadda.",
    translation:
      "Allahayow waxaan kaa magan galay cadaabka qabriga, cadaabka naarta, imtixaamaadka nolosha iyo dhimashada, iyo sharka fitnada Masiixa beenta ah (Dajjal).",
    meaning:
      "Rasuulku ﷺ waxa uu faray in tashahudka u dambeeya ka dib uu qofku ka magan galo afartan khatar ka hor inta aanu salaamin – baryada u dambaysa ee salaaddu waxa ay dabooshaa nolosha adduun, qabriga, naarta, iyo fitnada ugu wayn ee iman doonta.",
  },
  {
    title: "Taslim (salaanta xidhitaanka)",
    when: "Dhammaadka Salaadda - u leexinta wejiga midig, ka dibna bidix.",
    translation: "Asalaamu calaykum waraxmatulaahi wabarakaatuh.",
    meaning:
      "Waxaad uga tagtaa salaadda sidii aad uga bixi lahayd asxaabta sharafta leh - salaan nabadeed oo ku socota malaa'igta garabka kasta ku duuban iyo kuwa ku ag tukanaya. Salaantu waa tiir; iyada oo ay salaaddu ku dhammaatay.",
  },
];
