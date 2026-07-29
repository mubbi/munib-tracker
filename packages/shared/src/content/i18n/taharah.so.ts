// Somali translation overlay for the Learn Taharah content. Mirrors the order of
// its English source in ../taharah*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { TaharahChecklistItem, TaharahTopic } from "../../types/taharah";
import type { DeepPartial } from "./localize";

export const TAHARAH_TOPICS_SO: DeepPartial<TaharahTopic>[] = [
  {
    title: "Hordhac Taharah",
    summary: "Nadiifintu waa albaabka salaadda iyo nuska iimaanka mu’minka.",
    body: [
      "Taharah (طهارة) macneheedu waa daahirin - oo laga xoreeyo jidhka, dharka iyo goobta lagu tukado nijaasta jidheed si qofka muslimka ah uu u istaago Alle hortiisa xaalad uu aqbalay. Waa waxa ugu horreeya ee uu barto arday cibaado ah, sababtoo ah la'aanteed salaad ma ansaxayso: Nabigu ﷺ wuxuu yidhi, 'furaha salaadu waa daahir.'",
      "Nadiifinta Islaamku waxay leedahay laba waji. Dusha sare waa nadaafad la taaban karo - dhaqid, ka saarista wasakhda, nadiifinta. Guduhu waa is-hoosaysiinta, miyir-qabka, iyo u diyaarsanaanta qalbiga in maydhista loogu talagalay in lagu toosiyo. Nebigu ﷺ wuxuu isku xidhay labadooda markii uu ugu yeedhay daahirinta 'iminka badhkii', isagoo ku lammaaniyay nadaafadda jidhka iyo nadiifinta nafta dembiga.",
      "Qaybtani waxa ay dulmaraysaa mawduuca oo dhan sida ay u kala horreeyaan: biyaha aad ku daahirinayso, wuduu (wakado yar), guluus (qubeyska cibaadada oo dhan), taymuum ( daahirinta qalalan marka biyaha aan la isticmaali karin), najasah (saarida wasakhda jidhka), iyo kiisaska gaarka ah iyo tanaasulka. Baro hal mar oo ducadu waxay noqotaa wax aad si kalsooni leh u geli karto halkii aad ka shakin lahayd.",
    ],
    quran: [
      {
        excerpt:
          "Kuwa (xaqa) rumeeyow markaad u kacdaan salaadda ka maydha wajiyadiinna iyo gacmihiinna xagga suxullada, masaxa madaxiinna, cagahana ka maydha ilaa anqawyada.",
      },
      {
        excerpt:
          "Eebbana wuxuu jecel yahay kuwa toobad keena, wuxuuna jecel yahay kuwa is daahiriya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Furaha salaaddu waa daahirnimo; bilawgeedu waa takbiir dhamaadkeeduna waa taslim. (Cali; sidoo kale Jaamic at-Tirmidhi 3)",
      },
    ],
    actions: [
      "Ula dhaqmo nadiifinta sidii u diyaargarowga la kulanka Alle, ee ha u daalin nidaam degdeg ah.",
      "Baro hal mowduuc oo taharah maalin kasta ilaa socodka oo dhan uu dareemo dabiici.",
    ],
    appLinks: [{}],
  },
  {
    title: "Ahmiyada Nadaafadda",
    summary: "Daahirnimadu waa shardi ku adag salaadda iyo calaamadda qofka mu’minka ah.",
    body: [
      "Nadiifintu maaha hal ikhtiyaar oo qaar badan ka mid ah - waxay shardi u tahay ansaxnimada salaadda. Eebbana ma aqbalo ducada qofka nijaasaysan ilaa uu ka daahiriyo. Sidaa darteed waa in salaadda la tukan jiray iyada oo aan wudhu jirin ama dhuuso la soo celin, si kastoo ay daacad u tahay.",
      "Nebigu ﷺ wuxuu kor u qaaday daahirinta sifada mu’minka ah, isaga oo ku tilmaamay ‘iminka badhkii’. Nadiifinta joogtada ahi waxay edbinaysaa qofka, waxayna ku ilaalisaa u diyaargarowga cibaadada ee joogtada ah, iyo - xadiisku wuxuu ina barayaa - waxay macno ahaan biyaha ku maydhisaa dembiyada yaryar.",
      "Sababtoo ah waxay ilaalinaysaa salaadda, sidoo kale tahaaradu waxay ka ilaalisaa qofka mu'minka ah dembiga inuu tukado si aan sax ahayn taxadar la'aan darteed. Haddaba in axkaamteeda si wanaagsan loo barto waa fal lagu ilaalinayo mid ka mid ah camalka ugu waaweyn Islaamka.",
    ],
    hadith: [
      {
        excerpt: "Nadiifintu waa iimaanka badhkiis. (Abuu Maalik Al-ashcari)",
      },
      {
        excerpt: "Eebbana ma aqbalo duco aan daahir ahayn, wax la xadona ma aqbalo. (Ibnu Cumar)",
      },
    ],
    actions: [
      "Salaad kasta ka hor, xaqiiji xaaladaada daahirnimo ka hor inta aanad bilaabin.",
      "Hayso liis hubin maskaxeed oo fudud: jidhka, dharka, goobta, iyo wuduga.",
    ],
  },
  {
    title: "Noocyada Daahirnimada",
    summary: "Saddex dawladood in la ogaado: wasakh yar, wasakh weyn, iyo najaas jidheed.",
    body: [
      "Shareecada Islaamku waxay kala saartaa saddex shay oo laga yaabo inaad u baahato inaad ka nadiifiso, mid walbana wuxuu leeyahay dawo u gaar ah. Ogaanshaha xaalada aad ku sugan tahay ayaa fure u ah doorashada habka saxda ah.",
      "Nijaasta yar ee caadada ah (hadath asghar) waxay ka timaadaa dhacdooyinka caadiga ah sida isticmaalka musqusha, dabaysha oo dhaaftay, ama hurdo dheer. Waxa kor u qaada wudu, ama taymuum marka aan biyaha la isticmaali karin.",
      "Nijaasnimada weyn ee cibaadada (hadath akbar, oo sidoo kale loo yaqaan janabah) waxay ka timaadaa isu dhawaanshaha, dheecaanka galmada, iyo dhamaadka caadada ama dhiigbaxa umusha ka dib. Waxaa kor u qaadaya ghusl, qubayska caadada oo dhan - iyadoo tayammum mar labaad lagu beddelayo marka biyaha la waayo ama waxyeello loo geysto.",
      "Nijaasta jirka (najasah) - sida kaadida, saxarada, ama dhiigga qulqulaya - waa arrin gooni ah: waa in jir ahaan laga saaraa jidhka, dharka, iyo goobta salaadda iyada oo aan loo eegin xaaladdaada cibaadada. Afartan mad-hab ee sunniga ah waxay isku raacsan yihiin saddexdan qaybood, iyagoo ku kala duwan oo kaliya tafaasiisha qaar ka mid ah waxa burinaya daahirnimada ama cadadka raadadka ee cudur daarka ah.",
    ],
    quran: [
      {
        excerpt:
          "Haddaad ku sugan tihiin Janabad, is daahiriya. Laakiin haddaad xanuunsan tahay ama aad safar ku jirto…",
      },
    ],
    actions: [
      "Aqoonso gobolkaaga marka hore (yar, weyn, ama wasakh), dabadeed isticmaal habka saxda ah.",
      "Marka aanad hubin tafaasiisha, si joogto ah ula soco hal macalin oo shahaado leh oo ka socda dugsi la aqoonsan yahay.",
    ],
  },
  {
    title: "Biyaha Islaamka",
    summary:
      "Biyaha saafiga ah waa nadiifiyaha aasaasiga ah - si fiican loo isticmaalo, laakiin waligood lama khasaarin.",
    body: [
      "Macnaha caadiga ah ee nadiifinta waa biyo. Eebe wuxuu ku tilmaamay roobka mid la soo dejiyay 'saah' (tahuur) - oo awood u leh in la nadiifiyo oo loo isticmaalo cibaadada labadaba. Biyo kasta oo dabiici ah oo nadiif ah - roobka, webiga, badda, guga, ceelka, ama tuubada - waxay nadiifinayaan ilaa inta midabkooda, dhadhankooda, ama urta aanay bedelin wasakh la isku daray.",
      "Fiqhigu waxay u kala saarayaan biyaha si faahfaahsan (daafici iyo daahirin, saafi ah laakiin aan nadiifin, iyo nijaasayn), laakiin xeerka la taaban karo ee nolol maalmeedka waa mid fudud: biyuhu waxay ku haraan wuduu iyo dhuuso ilaa najaas ay si cad u beddesho. Marka aad si dhab ah uga shakisan tahay beddelka nadiifka ah ee la heli karo, isticmaal beddelka.",
      "Islaamku wuxuu barayaa si hufan oo aan xad dhaaf lahayn. Nebigu ﷺ wuu maydhay gebi ahaanba, haddana wuxuu isticmaalay biyo aad u yar - qiyaastii hal dhoobo ah (laba koob oo cantoobo ah) oo loogu talagalay wuduuga iyo sa' (qiyaastii afar) oo loogu talagalay gariir buuxa. Biyaha baaba'aya xataa marka ay bataan waa la niyad jabiyaa, waayo dhexdhexaadnimadu lafteedu waa qayb ka mid ah aadaabta cibaadada.",
    ],
    quran: [
      {
        excerpt: "Waxaana ka soo dajinay samada Biyo daahir ah.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Rasuulku ﷺ wuxuu ku samayn jiray bacdi biyo ah iyo sac ilaa shan dhoobo ah. (Anas; sidoo kale Saxiix Muslim 325 - sunnada dhexdhexaadinta)",
      },
    ],
    actions: [
      "Isticmaal biyo ku filan si aad si fiican ugu dhaqdo, laakiin tuubada hoos u dhig oo iska ilaali xad-dhaaf.",
      "Haddii isha biyuhu u muuqdaan ama urayaan ay wasakhdu beddeshay, raadso isha nadiifka ah ee kuugu dhow.",
    ],
    disclaimer:
      "Inta badan ee la soo xigtay ee ah 'ha ku lumin biyaha xitaa webi qulqulaya' (Ibnu Maajah 425) ayaa culimadu intooda badani ku sheegeen daciifnimo (daa'if); sunnada qunyar socodka ah waxa lagu saleeyey halkii ay ka ahayd xadiithka dhoobada/saac ee kor ku xusan.",
  },
  {
    title: "Waa maxay Wudu?",
    summary: "Quruxda caadada ah ee kor u qaada wasakhda yar cibaadada ka hor.",
    body: [
      "Wudu (وضوء) waa dhaqidda addimo gaar ah, si gaar ah, taasoo kor u qaadaysa wasakhda yar ee cibaadada. Afarteeda dhaqid ee waajibka ah waxay si toos ah ugu magacaaban yihiin Qur'aanka (5:6): wejiga, dhudhunka hore ilaa xusullada, masaxidda madaxa, cagahana ilaa anqawyada.",
      "Waxa loo baahan yahay salaad kasta ka hor - ilaa aad ku sugnaato xaalad ansax ah oo salaad hore ah - iyo, sida ay culimadu qabaan, ka hor intaanad tawaaf ku samayn hareeraha Kacbada iyo ka hor intaanad taaban qoraalka jirka (musxafka) ee Quraanka.",
      "Wudu waa cibaado iskeed u gaar ah, ma aha oo kaliya horudhac. Nebigu (scw) waxa uu uga digay ‘‘Ilaahay ma aqbalo ducada midkiin oo jebiya ducada ilaa uu dib u soo celiyo ducada’ –sidaa darteed ilaalinteedu waa ilaalinta salaada lafteeda.",
    ],
    hadith: [
      {
        excerpt:
          "Alle ma aqbalo ducada midkiin oo jebiya ducada ilaa uu ka soo qubo. (Abuu Hureyrah)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Shuruudaha Wudu Saxda ah",
    summary:
      "Ujeedo, biyo saafi ah, iyo maqaar aan cidhiidhi ahayn - waxyaabaha looga baahan yahay wudu dhawaaqa.",
    body: [
      "Shurudaha qaarkood (shurut) waa in ay jiraan si loo tiriyo wudu. Qofku waa inuu noqdaa Muslim maskaxdiisu fayow tahay, oo ku talo jira inuu cibaadada u daahiriyo (niyyah). Dugsiyada qaarkood waxay u kala saaraan niyadda inay tahay tiir ka mid ah falka iyo kuwa kale shuruud, laakiin dhammaan waxay isku raaceen in loo baahan yahay abaalmarinta iyo, inta badan, ansaxnimada.",
      "Biyaha la isticmaalay waa inay noqdaan kuwo nadiif ah oo nadiif ah. Muhiimad ahaan, waa in ay dhab ahaantii gaadho maqaarka - sidaas darteed wax kasta oo ka dhigaya xayndaab aan biyuhu lahayn oo ka sarreeya addinka (Rinjiga qaro weyn, cididaha, dhuka, koollada) waa in marka hore la saaraa, ama dhaqidda hoosteeda ma ansaxayso. Wasaqda caadiga ah ama wasakhda xiinna ee aan xannibin biyaha dhib maaha.",
      "Dugsiyada Shaafici iyo Xanbali waxa kale oo ay u baahan yihiin in maydhista lagu dhaqo sida Qur’aanka kariimka ah oo aan hakad dheer lahayn (muwalaat) taas oo u oggolaanaysa in xubnaha jidhku qallalaan. Mawqifyada Xanafiga iyo Maalikiga ee isku xigxiga iyo sii wadista waa kuwo aad u dabacsan xaaladaha qaarkood. Raac habka hal dugsi oo joogto ah.",
    ],
    quran: [
      {
        excerpt:
          "Maydh wejiyadaada iyo gacmahaaga ilaa suxulada, masax madaxyadaada, cagahana ka maydh ilaa anqawyada.",
      },
    ],
    actions: [
      "Ka saar caarada ciddiyaha, faraantiga biyaha dabinaaya, iyo wax kasta oo maqaarka xidha ka hor wuduuga.",
      "U samee wudu si deggan hal socod si aan xubin la seegin ama looga tegin si ay u engegto.",
    ],
  },
  {
    title: "Falalka waajibka ah ee Wudu",
    summary: "Tiirarka Qur'aanka ah (faraid) oo ay la'aantood uu buray wudu.",
    body: [
      "Waajibaadka waajibka ah ee wuduuga ah waa qaybaha uu Eebbe aayad ku sheegay: dhaqidda wejiga oo dhan; dhaqidda labada gacmood ilaa iyo marka lagu daro xusullada; madaxa tirtiridda; iyo dhaqidda labada cagood ilaa iyo marka lagu daro anqawyada. Mid ka mid ah kuwan seego oo wuduugu ma dhammaystirna.",
      "Kuwaas, dugsiyadu waxay ku daraan waajibaadyo dheeraad ah oo ka mid ah Sunnada iyo caqli-galnimada. Niyada ayaa ku waajib ah inta badan dugsiyada (Xanafiyadu waxay u kala saaraan sunnaha si adag loo xoojiyey si loo qaado wasakh yar). Dalabka (tartib) iyo sii socoshada (muwalat) waa ku waajib Shaaficiyada iyo Xanbaliyiinta. Maalikiyadu waxay ku daraan xoqidda addimada (dalk) oo ah waajib.",
      "Wax kasta oo intaas ka baxsan - luqluqashada afka iyo sanka, dhaqidda gacmaha marka hore, saddex jeer oo la dhaqo - ayaa lagu talinayaa (Sunnah) halkii ay ahayd waajib. Ogaanshaha faraqa waxay ka dhigan tahay inaad garan karto marka uu wuduugu yahay mid aan dhammaystirnayn oo dhab ahaantii aan sax ahayn.",
    ],
    quran: [
      {
        excerpt:
          "Maydh wejiyadaada iyo gacmahaaga ilaa suxulada, masax madaxyadaada, cagahana ka maydh ilaa anqawyada.",
      },
    ],
    disclaimer:
      "Liiska saxda ah ee faraid (tusaale haday ulajeedka, kala dambaynta, iyo xoqiddu ay tahay waajib) way ku kala duwan yihiin afarta dugsi. Baro oo codso hal dugsi oo la isku halayn karo si joogto ah.",
  },
  {
    title: "Falalka Sunnada Wudu",
    summary: "Kuwa lagu taliyay waxay u dhaqmaan si kaamil ah oo badiyo abaalmarinta wuduuga.",
    body: [
      "Ku xeeran xudunta waajibka ah, nabigu ﷺ waxa uu ku dhaqmi jiray falal badan oo lagu taliyay (sunan) kuwaas oo dhamaystiraya oo qurxinaya wuduuga. Ka tagista ma burinayso wuduuga, laakiin ku darida iyaga waxay helaysaa abaal-marin dheeraad ah waxayna raacdaa tusaalihiisa si buuxda.",
      "Falalka sunnaha ah ee la aasaasay waxaa ka mid ah: in la yiraahdo 'Bismillah' bilowga; Gacmaha oo saddex jeer la dhaqo ka hor inta aan la bilaabin; luqluqashada afka (madmadah) iyo sanka (istinshaq); oo faraha qoyan ku ordaya gadh qaro weyn iyo faraha iyo suulasha dhexdooda (takhlil); Mid kasta oo ka mid ah addimada oo dhan ka bilowda midig; iyo ku celcelinta dhaqid kasta ilaa saddex jeer.",
      "Laba sunne ayaa mudan in si gaar ah loo xuso: isticmaalka miswak (siwak) ka hor - oo uu Nebigu ﷺ ku sigtay inuu waajibiyo - iyo akhrinta markhaatiga iimaanka ka dib marka la dhammeeyo, taas oo u furaysa siddeedda albaab ee Jannada qofkii yidhaahda.",
    ],
    hadith: [
      {
        excerpt:
          "Ruuxii si wanagsan u wanaagsa oo yiraahda waxaan ka marag kacayaa inuusan jirin ilaah kale oo aan Allaah ahayn…, Muxammadna uu yahay addoonkiisii ​​iyo Rasuulkiisii, waxaa laga furay siddeedii albaab ee Jannada. (Cumar bin Al-Khattaab)",
      },
    ],
    actions: [
      "Ku celceli isku xigxiga sunnada oo dhan ilaa ay ka noqoto caadadaada dabiiciga ah.",
      "Mar walba akhri wuduu shahadah kadib.",
    ],
    appLinks: [{}],
  },
  {
    title: "Tallaabo-tallaabo Wudu",
    summary: "Taxanaha nebiyada oo dhamaystiran laga bilaabo ulajeedka ilaa xidhitaanka ducada.",
    body: [
      "Rasuulku ﷺ wuxuu baray wuduga si taxane ah oo qulqulaya oo u toleeya waajibaadka iyo ficillada sunnada ah. Habkani waa dariiqii uu Cuthman bin Caffaan dadka u bandhigay, isagoo leh ka dib waxaan arkay Nebigu (scw) oo si sax ah u wud-maday- iyo in qofkii sidaas oo kale ku tukada oo tukada laba rakcadood oo dhan laga dhaafo dembigiisii ​​hore.",
      "Samee tilaabo kasta si degdeg ah, hubi in biyuhu ay gaaraan meel kasta oo loo baahan yahay. Xubnaha la dhaqay (wejiga, gacmaha, cagaha) waa la dhaqay; madaxa uun baa la masaxay.",
    ],
    steps: [
      {
        title: "Niyo daahirin oo dheh Bismillah",
        body: "Ku deji niyada wuduuga qalbigaaga oo ku bilow magaca Allaah.",
        tip: "Ujeedadu waa gudaha - looma baahna qaacido lagu hadlo.",
      },
      {
        title: "Dhaq labada gacmood saddex jeer",
        body: "Ku dhaq gacmaha gacmaha, adigoo u gudbiya biyaha dhexdooda faraha dhexdooda.",
      },
      {
        title: "Biyo raaci afka saddex jeer",
        body: "Biyo afka geli, oo ku wareeji, oo iska saar.",
      },
      {
        title: "Biyo raaci sanka saddex jeer",
        body: "Biyo si tartiib ah u gal sanka oo ka soo bax.",
      },
      {
        title: "Dhaq wajiga saddex jeer (fard)",
        body: "Laga bilaabo timaha ilaa gadhka hoostiisa iyo dhegta ilaa dhegta.",
      },
      {
        title: "Dhaq gacanta midig, ka dibna bidix (fard)",
        body: "Mid kasta laga bilaabo faraha caarada ilaa iyo ay ku jirto xusulka, ilaa saddex jeer.",
      },
      {
        title: "Madaxa mar ka masax (fard)",
        body: "Gacmaha qoyan, ka tirtir xagga hore ilaa dhabarka oo soo noqo, ka dibna ku tirtir dhegaha qoyan isku mid ah.",
      },
      {
        title: "Dhaq cagta midig, ka dibna bidix (fard)",
        body: "Mid kasta oo ku socda oo ay ku jiraan anqawga, faraha dhex mara suulasha dhexdooda.",
        tip: "U fiirso cidhibta iyo anqawyada - meelaha ugu badan ee la seego.",
      },
      {
        title: "Akhri ducada xidhitaanka",
        body: "Ku dheh maragga iimaanka si aad u furto albaabada Jannada.",
        tip: "Sunno gaaban laakiin abaal badan laga helay.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Cuthmaan wuxuu maydhay xubin kasta saddex jeer sidii uu arkay nabiga ﷺ oo samaynaya, dabadeed wuxuu yidhi: Qofkii sidaas oo kale u tukada oo tukada laba rakcadood oo dhan, waxaa loo dhaafaa dembigiisii ​​hore. (Xumraan, ka Cuthmaan)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ducooyin la xidhiidha Wudu",
    summary: "Ducooyinka si dhab ah loo soo sheegay ka hor iyo ka dib ducada.",
    body: [
      "Xusuusta ugu xoogga badan ee laga soo weriyo wuduudu waa laba: in la yiraahdo Bismillaah bilowga, iyo maragga iimaanka ka dib marka la dhammeeyo. Shahaadada xidhitaanka, dheeraad ah oo dhab ah ayaa waydiisanaya Eebe, 'Iga dhig kuwa toobad keena oo iga yeel kuwa isdaahiriya.",
      "Waxaa muhiim ah in la ogaado in ducada tafatiran ee addin kasta (duco gaar ah marka la dhaqayo gacmaha, wejiga, gacmaha, iyo wixii la mid ah) ee ku wareegaya buug-yaraha qaar aan lagu saleynin si dhab ah oo sax ah oo ka timid Nebiga ﷺ. Culimadu waxa ay ku taliyeen in aan isaga loo nisbayn isaga oo sunne ah, iyada oo aanay jirin wax dhib ah oo ku saabsan xuska Alle ee guud ahaan xilliga sacuudiga.",
      "Ubucda arrintu waa joogitaanka: ku dhaq adigoo og in xubin kasta dembigeedu sii dhacayo, kuna dhammaato Shahaadada dib ugu xidhaysa ficilka ujeeddadiisa - rumaysadka Alle oo keliya.",
    ],
    hadith: [
      {
        excerpt:
          "Qofkii si wanagsan u waasicida oo markaas akhriya marag-kaca iimaanka, waxaa laga furay siddeedda albaab ee Jannada, si uu uga galo cidduu doono. (Cumar)",
      },
    ],
    actions: [
      "Xifdi wuduu shahadah ka dib hadii aanad hore u haysan.",
      "Iska ilaali inaad akhrido qaacidooyinka xubinta xubinta ka ah oo aan la xaqiijin sidii iyagoo sunne ah.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Maxaa Jebiya Wudu?",
    summary: "Burburiyeyaasha wudu - iyo xukunka hubaal marka shaki la galo.",
    body: [
      "Heshiska cilmi-nafsiyeedka, suufku waxa uu jabiyaa wax kasta oo ka soo baxa labada marin ee gaarka ah - kaadida, saxarada, dabaysha, ama dheecaanka kale - iyo sidoo kale hurdo dheer oo qofka ka saarta wacyiga, iyo luminta miyir-beelka ee miyir-beelka ama sakhradda.",
      "Arrimaha kale waxay ku xiran yihiin farqi ixtiraam leh oo u dhexeeya dugsiyada: taabashada xubnaha gaarka ah si toos ah, iyo xiriirka maqaarka ee aan maxramka ahayn ee jinsiga ka soo horjeeda, ayaa burinaya dugsiyada qaarkood laakiin kuwa kale maaha, oo ku salaysan akhrin kala duwan oo isku mid ah.",
      "Mabda'a maamul ee muhiimka ah ayaa kaa ilaalinaya welwelka joogtada ah (waswas): hubaal shaki kuma saaro. Haddii aad lahayd wudu oo aadan hubin in aad jebisay, wali waxaa laguu qaddarinayaa in aad leedahay wudu ilaa aad ka hubsato in uu dhacay wax burinaya. Rasuulku ﷺ wuxuu u sheegay nin ka xumaaday dareenkaas inuusan ka bixin salaaddiisa 'ilaa uu dhawaaq ka maqlo ama uu ur ka helo'.",
    ],
    hadith: [
      {
        excerpt:
          "Waa inuusan ka bixin (salaaddiisa) ilaa uu sanqadha maqlo ama uu ur ka helo. (Abbad ibn Tamim, oo abtigiis ka ahaa)",
      },
    ],
    disclaimer:
      "Haddii taabashada jinsiga ka soo horjeeda ama xubintiisa gaarka ah ay jebiso wudu way ku kala duwan tahay dugsiyada. Raac macalin maxali ah oo aqoon u leh iyo habka hal dugsi.",
  },
  {
    title: "Khaladaadka Wudu Caadiga Ah",
    summary: "Khaladaadka soo noqnoqda ee yareeya abaalgudka - ama burinaya wuduuga oo dhan.",
    body: [
      "Inta badan cilladaha wudu waxay ka yimaadaan degdeg. Ku yaacidda si aanay biyuhu u gaadhin addin dhan - meel qalalan oo ku taal ciribta, canqowga, xusulka, ama faraha iyo suulasha dhexdooda - waxay ka tagi kartaa wuduuga mid aan shaqayn, sababtoo ah maydhista Qur'aanku halkaas kuma dhammayn.",
      "Rasuulku ﷺ mar wuxuu arkay dad ciribtoodu ay engegan tahay oo aanay biyuhu soo gaadhin, wuxuuna aad ugu digay, 'Halaag wuxuu u sugnaaday cidhibta Naarta!' Cidhibta, anqawyada, iyo geesaha wejiga ayaa ah meelaha ugu badan ee la dayacay.",
      "Khaladka lidka ku ah waa xad-dhaaf: dhaqid wax ka badan saddex jeer, ama isticmaalka biyaha si xun, taas oo khilaafsan sunnada dhexdhexaadnimada. Kuwo kale waxay ku dhacaan waswas (shaki culus), ku celcelinta wududu marar badan - tani sidoo kale waa qalad, maadaama hubaal uusan shaki ku jirin.",
    ],
    hadith: [
      {
        excerpt:
          "Halaag wuxuu u sugnaaday Cidhibta Naarta. - wuxuu yidhi markuu arkay cidhib qallalan oo wuduuga kaga hadhay. (Abuu Hureyrah)",
      },
    ],
    actions: [
      "Hoos u dhig oo si miyir leh u xaqiiji daboolka buuxa ee addin kasta oo la dhaqay, gaar ahaan cidhibta iyo xusullada.",
      "Isticmaal biyo dhexdhexaad ah; Ha u ogolaanin shakiga waliga ahi kugu riixo ku celcelin aan loo baahnayn.",
    ],
  },
  {
    title: "Fadliga Wudu",
    summary:
      "Wudu waxa uu tirtiraa dambiyada, kor u qaada darajooyinka, wuxuuna ka dhigaa kuwa mu'miniinta ah maalinta qiyaame.",
    body: [
      "Wudu waa dhaqid soo noqnoqda oo dembiyada. Rasuulku ﷺ wuxuu baray in qofka mu’minka ahi uu dhaqo addin kasta, ficillada qaldan ee ay sameeyaan addinkaasi waxay ku dhacaan biyaha - indhaha, gacmaha, cagaha - ilaa uu qofku ka soo baxo isagoo dembi ka daahirsan. Ducada ay ka horreyso wuduhu waxa ka horreeya cafis cusub.",
      "Sidoo kale waa sharaf lagu kala saari karo nolosha soo socota. Maalinta qiyaamaha nabigu ﷺ wuxuu taageerayaashiisa ku aqoonsan doonaa iftiinka wejigooda, gacmahooda, iyo lugaha ka soo baxaya raadadka wuduuga - iftiin u gaar ah ummaddan, oo lagu magacaabo al-Ghurr al-muhajjalun.",
      "Wanaaggaas dartood, in qofku ku sugnaado xaalad uu dudmo ayaa ah caado lagu taliyay: dib u cusboonaysiinta salaad kasta, iyo in la seexdo dushiisa, waxa ay ka mid yihiin hab-dhaqannada ilaalinta mu’minka.",
    ],
    hadith: [
      {
        excerpt:
          "Umadayda waxa loogu yeedhi doonaa maalinta qiyaame iyada oo wajiyo, gacmo iyo lugo ifaya ay ka soo jeedaan raadadka wuduga. (Abuu Hureyrah)",
      },
    ],
    actions: [
      "Cusbooneysii wuduuda daaqad kasta oo salaad ah meesha aad awoodid.",
      "Ka dhig hurdada dusheeda dusheeda sunno habeenle ah.",
    ],
    appLinks: [{}],
  },
  {
    title: "Waa maxay Ghusl?",
    summary: "Qubayska cibaadada oo dhan ee kor u qaada wasakhda wayn (Janabah).",
    body: [
      "Ghusl (غسل) waa dhaqanka dhaqidda jirka oo dhan, iyadoo ulajeedka ah, si kor loogu qaado wasakhda weyn ee cibaadada (Janabah). Meesha uu wudu ka hadlo wasakhda yar, ghusl waxa ay wax ka qabataa xaalada wayn ee soo socota isu dhawaanshaha, dheecaanka galmada, iyo dhamaadka caadada ama dhiigbaxa umusha ka dib.",
      "Nuxurkeedu waa in biyuhu ay gaadhaan qayb kasta oo ka mid ah jidhka kore - meel qalalan ma hadhi karto, oo ay ku jiraan xididada timaha, laalaabka maqaarka, dhegaha gadaashooda, xudunta, iyo suulasha dhexdooda. Biyo luqluqashada afka iyo sanka waxaa ka mid ah xiniinyaha culimo badan.",
      "Hal xabo oo la sameeyo iyada oo la doonayo in janabada la qaado ayaa iyaduna meesha ka saaraysa wasakhda yar, sidaa awgeed qofka suufka dhammaystay waxa laga yaabaa in uu tukado isaga oo aan lahayn wufuud gooni ah (inkasta oo uu ku tukanayo gaaska dhexdiisa waa sunne).",
    ],
    quran: [
      {
        excerpt: "Haddaad ku sugan tihiin Janabad, is daahiriya.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Marka Ghusl loo baahan yahay",
    summary: "Xaaladaha ka dhigaya qubeyska cibaadada buuxda ee waajib ama lagu taliyay.",
    body: [
      "Ghusl wuxuu noqdaa mid waajib ah (fard) dhowr xaaladood oo qeexan: dheecaanka dheecaanka galmada ee rabitaan (ha ahaato mid soo jeeda ama riyo qoyan); galmada lafteeda, xitaa iyada oo aan biyo-baxin - Nabigu ﷺ wuxuu yiri mar haddii labada la isku daro, gulufku waa; iyo dhamaadka caadada (hayd) ama dhiigbaxa umusha kadib (nifas). Geeridu waxa kale oo ay ku waajibinaysaa qofka dhintay in uu ruuxa nool yahay.",
      "Gaalada kale waxa lagu taliyaa (mustaxab) intay waajib ahayn: Jumcada Jimcaha ka hor Jumcada, taas oo aad loogu booriyay in nabigu ﷺ ku tilmaamay 'waajib saaran qof kasta oo qaan gaadhay'; qiirada labada Ciidood; iyo ixraamka xajka ama cumrada ka hor.",
      "Qofka muslimka ah ee cusub waxaa la farayaa inuu sameeyo gaalnimo marka uu soo galo Islaamka - waxaa waajib ku ah culimada qaar iyo kuwa kale oo si adag ugu taliyay.",
    ],
    hadith: [
      {
        excerpt:
          "Marka ninku u dhex fadhiisto afarta addin ee xaaskiisa oo uu u galmoodo, xuubka ayaa ku waajib ah. (Abuu Hureyrah; sidoo kale Saxiix Muslim 348).",
      },
      {
        excerpt:
          "Gusl maalinta jimcaha waa waajib saaran qofkasta oo qaan gaadhay. (Abuu Saciid al-Khudri; sidoo kale Saxiix Muslim 846).",
      },
    ],
    disclaimer:
      "Haddi jimcaha iyo kuwa rogrogaya ghusl ay tahay mid waajib ah ama si adag loogu taliyay way ka duwan tahay dugsiga iyo duruufaha.",
    appLinks: [{}],
  },
  {
    title: "Talaabo-tallaabo Ghusl",
    summary: "Habka nebiyadu - waajibaadka ugu yar oo lagu daray sunnada dhamaystiran.",
    body: [
      "Caa'isha waxay si faahfaahsan u qeexday jahliga Nabiga ﷺ, waxayna culimadu ka soo saareen jahliga ugu yar ee ansaxa ah iyo habka sunnada oo dhammaystiran labadaba. Waxa ugu yar waa si fudud: ulajeedka iyo biyaha oo gaadhaya jidhka oo dhan (iyada oo la luqluqdo afka iyo sanka dad badan). Habka hoose oo dhammaystiran waa sida uu Nebigu ﷺ laftiisa u yeelay.",
      "U samee si degdeg ah, adigoo ku xoqaya biyaha maqaarka si aan waxba looga tagin.",
    ],
    steps: [
      {
        title: "Samee ujeedada",
        body: "Ku talaji qalbigaaga inaad kor u qaaddo wasakhda weyn ee cibaadada (janabah).",
      },
      {
        title: "Bismillah dheh oo gacmaha dhaq",
        body: "Ku billow magaca Alle oo labada gacmood dhaq.",
      },
      {
        title: "Meesha gaarka ah maydh",
        body: "Gacanta bidix ka saar wixii wasakh ah xubnaha gaarka ah.",
      },
      {
        title: "Samee wudu buuxa",
        body: "Samee wudu sida salaadda. Waxaad dib u dhigi kartaa dhaqidda cagaha ilaa dhamaadka haddii aad ku istaagto biyo la ururiyey.",
      },
      {
        title: "Ku shub biyo madaxa saddex jeer",
        body: "Ku shaqee biyaha madaxa madaxa iyo xididdada timaha.",
      },
      {
        title: "Dhaq dhanka midig, ka dibna bidixda",
        body: "Ku shub oo mari biyaha jirka oo dhan, adigoo ka bilaabaya midigta.",
      },
      {
        title: "Hubi caynsanaanta dhamaystiran",
        body: "Ha ka tagin meel engegan - cudud, xudunta, jilbaha iyo dhegaha gadaashooda, iyo suulasha dhexdooda.",
        tip: "Dumarku uma baahna inay ka noqdaan timaha tidcan, waase haddii biyuhu gaadhaan madaxa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Nebigu (scw) markii uu ka soo qubaystay Janada, oo uu maydhay gacmihiisii, oo uu salaadda ku tukaday, ayuu farahiisa ka mariyay timihiisa, ka dibna saddex jeer ayuu madaxa ku shubay biyo iyo jidhka intiisa kale. (Caasha)",
      },
    ],
  },
  {
    title: "Khaladaadka Ghusl ee caadiga ah",
    summary: "Ka fogow meelaha qallalan, ujeedo maqan, iyo in aad u qaldato qubeyska qiiqa.",
    body: [
      "Khaladka ugu muhiimsan waa in qubeyska caadiga ah loola dhaqmo sida ghusl. Ghusl-ku wuxuu u baahan yahay niyadda si kor loogu qaado wasakhda weyn; la'aanteed, si kasta oo aad u dhaqdo, gobolka cibaadada lama qaado. Samee niyada ka hor inta aanad bilaabin.",
      "Khaladka labaad ee caadiga ah waa ka tagista baro engegan. Waajibku waa in biyuhu ay taabtaan dhammaan jirka oo dhan, sidaas darteed dayacaadda xididdada madaxa, dhegaha, xudunta, dhabarka yar, ama inta u dhaxaysa suulasha waxay ka tagtaa cirridka oo aan dhamaystirnayn. Ku xoq biyaha meelahan si aad u hubiso.",
      "Dhanka timaha: haweeneyda timaha tidcan loogama baahna inay timaha ka furto, ilaa inta ay biyuhu gaarayaan xididdada madaxa - nabigu ﷺ wuxuu u sheegay Ummu Salamah in saddex sacab oo farac ah madaxa lagu shubo ay ku filan tahay. Ninka timaha, oo sida caadiga ah dabacsan, waa in laga soo saaraa si ay biyuhu u gaaraan xididdada.",
    ],
    hadith: [
      {
        excerpt:
          "Waxaa kugu filan inaad saddex sacab oo biyo ah madaxaaga ku shubto, oo aad naftaada ku shubto, oo aad daahirsan tahay, oo uma baahnid inaad tidcigaaga furto. (Ummu Salamah)",
      },
    ],
    actions: [
      "U sheeg ujeeddada ka hor shubista ugu horreysa, markaa dhaqiddu waxay u xisaabsan tahay sida gusl.",
      "Ku xoq biyaha meelaha si fudud loo seegay; Marka aan la hubin, dib u dhaq qayb intii aad shaki ku dhammayn lahayd.",
    ],
  },
  {
    title: "Waa maxay Tayamum?",
    summary: "Sifaynta qallalan ee leh dhul nadiif ah marka aan biyaha la isticmaali karin.",
    body: [
      "Tayammum (تيمم) waa raxmada baddalka wudu ama ghusl marka biyaha si dhab ah aan loo heli karin ama aan la isticmaali karin. Halkii laga dhaqi lahaa, qofku wuxuu ku dhuftey dhul nadiif ah calaacasha wuxuuna tirtiraa wejiga iyo gacmaha - tanina waxay si buuxda u qaadataa meesha nadiifinta biyaha, taasoo u oggolaanaysa salaadda saxda ah.",
      "Tayammu waa hadiyad ummaddan si gaar ah loogu deeqay: Nebigu (scw) wuxuu yidhi, “Dhulka waxa la ii yeelay meel lagu tukado iyo wax lagu daahiriyo, isagoo ku taxay mudnaantii gaarka ahayd ee la siiyey ee aan la siin nabiyadii hore. Waxay ka kooban tahay mabda'a udub dhexaad u ah diinta - waajibaadku waa sii jiraa, laakiin dhibka waa la qaaday.",
      "Waa qiyaas ku meel gaar ah: mar haddii ay biyo helaan oo la isticmaali karo, nadiifinta caadiga ah ee biyaha ayaa dib u bilaabanaysa. Waxaa laga yaabaa in qofku u baahdo inuu cusboonaysiiyo taymamka salaad kasta sida ay qabaan dugsiyada qaarkood.",
    ],
    quran: [
      {
        excerpt: ".",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dhulka waxaa la ii yeelay meel lagu tukado iyo wax lagu daahiriyo. (Jaabir - oo ka mid ah shanta shay ee si gaar ah loo siiyey Nabiga ﷺ)",
      },
    ],
  },
  {
    title: "Marka Tayamuum waa la Ogolaaday",
    summary:
      "La oggolaaday marka ay biyuhu maqan yihiin, waxyeello leh, ama si degdeg ah loogu baahan yahay badbaadada.",
    body: [
      "Tayammum waxa lagu ogol yahay saddex xaaladood oo ballaadhan. Marka hore, marka aan biyo la heli karin ka dib baaritaan macquul ah - socotada ee saxaraha, ama qof kasta oo run ah oo aan helin. Midda labaad, marka la isticmaalayo biyaha waxay u horseedi kartaa waxyeelo: kuwa buka ee nabarkooda ama jirradu ay ka sii dari doonaan, ama qabow daran oo aan sinaba loo diirin biyaha iyo khatarta dhabta ah ee waxyeellada.",
      "Seddexaad, marka biyaha yar ee la heli karo loogu baahan yahay baahi aad u adag - sida cabbitaanka, si loo ilaaliyo nolosha, ha ahaato mid tiisa ama mid kale ama xayawaanka. Xaalad kasta shareecadu waxay ku miisaamaysaa ilaalinta nolosha iyo caafimaadka oo ka sarraysa habka la doorbido ee daahirinta.",
      "Sharci-yaqaannadu waxay ku kala duwan yihiin marinnada ugu fiican - inta ay tahay in qofku biyo raadiyo, intee in le'eg ayay cabsida waxyeelladu ku filan tahay - laakiin waxay ku midaysan yihiin naxariista hoose: cibaadada weligeed lama tuurin, kaliya ayaa la fududeeyaa.",
    ],
    hadith: [
      {
        excerpt:
          "Waxaa lagu soo wariyay cutubyada Taymmum: tanaasulka in lagu nadiifiyo dhul nadiif ah iyadoo ay maqan yihiin biyo la isticmaali karo.",
      },
    ],
    actions: [
      "Si macquul ah u raadi biyaha ka hor intaadan taammin.",
      "Haddii uu takhtarku ku taliyo in nabarka ama jirrada la engego, ku samee taas oo samee tayammum.",
    ],
  },
  {
    title: "Tallaabo-tallaabo Tayammum",
    summary: "Tixraaca gaaban, fudud ee nadiifinta qalalan ee saxda ah.",
    body: [
      "Tayammum si ula kac ah ayaa u kooban - ka tarjumaysa ujeeddadeeda sida tanaasulka dhibaatada. Waxaa lagu sameeyaa nadiif, oog dabiici ah oo ciid ah: ciid, ciid, dhagax, ama boodh. Nuxurkeedu, marka laga soo bilaabo mudaaharaadkii Nebiga (scw) ilaa Cammar bin Yaasir, waa hal garaac oo calaacasha ah oo dhulka nadiifka ah saaran, ka dibna masaxaya wejiga iyo gacmaha.",
      "Tani way ka fudud tahay wudu qaab ahaan, markaa ha ku darin dhibaatooyinkeeda.",
    ],
    steps: [
      {
        title: "Samee ujeedada",
        body: "Isku day inaad kor u qaaddo nijaasta cibaadada si aad u cibaadeysato.",
      },
      {
        title: "Bismillah dheh",
        body: "Ku bilow magaca Alle.",
      },
      {
        title: "Dhulka nadiifka ah hal mar ku garaac labada calaacasha",
        body: "Saar calaacasha si khafiif ah oog nadiif ah, boodh leh, oo dabiici ah.",
      },
      {
        title: "Wejiga masar",
        body: "Labada gacmoodba hal mar ku tirtir wejiga oo dhan.",
      },
      {
        title: "Gacmaha masax",
        body: "Masixi gadaasha gacmaha - cududaha inta badan culimada.",
        tip: "Raac habka hal dugsi (gacmaha iyo gacmaha hore) si joogto ah.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Nebigu ﷺ wuxuu ku garaacay dhulka calaacasha, ka dibna ku masaxay wejigiisa iyo gacmihiisa - isagoo baray Cammaar in taasi ku filan tahay. (Cumar ibnu Yaasir)",
      },
    ],
  },
  {
    title: "Maxaa Jebiya Tayamum?",
    summary:
      "Waxaa meesha ka saaray wudu-jabiyeyaasha caadiga ah - iyo soo celinta biyaha la isticmaali karo.",
    body: [
      "Taymmumkii lagu sameeyo wuduuda waxaa buriya wax kasta oo jebiya weyddiinta: is-dejinta, dabaysha oo gudubta, hurdo dheer, iwm. Taymmumka ku jira ghusl waxa kale oo meesha ka saaraya wax kasta oo keena wasakh weyn.",
      "Si gaar ah, tayammum sidoo kale waxay ku dhammaatay soo noqoshada sababteeda oo laga saaray - taas oo ah, helitaanka biyo la isticmaali karo. Marka biyo la helo oo la isticmaali karo, tanaasulku wuu dhammaanayaa oo midkuna wuxuu ku noqonayaa wuduu ama dhuuso.",
      "Qodob raxmad oo la taaban karo: haddii aad si sax ah ugu tukatay taammuum oo aad biyo uun heshay ka dib, badi waxay qabaan in salaadda la dhammeeyey aan loo baahnayn in lagu celiyo - si sax ah ayaa loo fuliyay iyadoo la raacayo xukunkii wakhtigaas. Laakiin haddii biyo ay ka soo baxaan salaadda ka hor, waa inaad isticmaashaa.",
    ],
    actions: [
      "Dib u hubi biyaha la heli karo bilowga wakhtiga salaada kasta.",
      "Isla markii biyaha la isticmaali karo, ku soo celi sifaynta biyo adoon daahin.",
    ],
    disclaimer:
      "Faahfaahinta qaarkood - sida in ducada la soo celiyo ka dib markii biyo la helo waqtigeeda - way ku kala duwan yihiin dugsiga.",
  },
  {
    title: "Najaasaha (Najasah)",
    summary: "wasakhda jirka oo ay tahay in laga saaro jidhka, dharka, iyo goobta lagu tukado.",
    body: [
      "Najasah (نجاسة) waa nijaas la taaban karo oo dhaqan ah, kana duwan xaaladaha dhaqan ee hadath. Tusaalooyinka cad-cad ee lagu heshiiyey waxaa ka mid ah kaadida iyo saxarada dadka, dhiigga qulqulaya, hilibka doofaarka iyo dheecaanka doofaarka, iyo candhuufta eeyga (oo u baahan dhaqid gaar ah). Najaasada oo laga saaro jirka, dharka la xidho, iyo meesha lagu tukado waa shardi salaad sax ah.",
      "Soo saarista waa biyaha halka wasakhdu ay tahay mid la taaban karo, maydhista ilaa walaxda iyo raadkeeda ay ka baxaan. Islaamku wuxuu kaloo si dhab ah ula dhaqmayaa ilaha najaasa: Nebigu ﷺ wuxuu ka digay in inta badan ciqaabta qabriga ay ka timaad taxaddar la'aanta kaadida - oo lagu rusheeyo oo aan si fiican loo nadiifin.",
      "Dugsiyadu way ku kala duwan yihiin kala soocida walxaha qaarkood (tusaale, haddii xaddi yar oo dareere ah la fasaxay iyo in kale) iyo waxa loo dulqaadan karo. Mabda'a la shaqayn karo ee nolol maalmeedka: si fiican u nadiifi, hana soo saarin shaki ku saabsan nadiifnimada meel aanay jirin caddayn wasakh ah.",
    ],
    hadith: [
      {
        excerpt:
          "Nebigu ﷺ wuxuu soo maray laba qabri oo uu sheegay in dadkii ku jiray la ciqaabayo - mid waxay faafinayeen cay, iyo kan kale sababtoo ah ma uusan iska difaacin kaadidiisa. (Ibnu Cabbaas; sidoo kale Saxiix Muslim 292).",
      },
    ],
  },
  {
    title: "Nadiifinta Dharka wasakhda",
    summary: "Sida maro loo dhaqo si salaada loogu tukado u ansaxdo.",
    body: [
      "Marka najaasadu ay soo gasho dharka, ku dhaq meesha ay dhibaatadu saameysey biyo ilaa ay ka baxayaan walaxda lafteeda iyo raadkeeda muuqda. Nabigu (scw) wuxuu faray haweeneyda ay maradeeda dhiiga caadada ku wasakhowday inay iska xoqdo, kadibna ay mariso biyo, kadibna ay maydho, kuna tukato.",
      "Haddii, dadaal daacad ah ka dib, midab daciif ah ama ur yar ayaa hadhsan oo aan soo bixi doonin, culimada intooda badani waxay ka cudurdaartaan waxa dhabta ah ee adag in la saaro - waajibku waa in la saaro walaxda, maaha in la dammaanad qaado dheeha aan cillad lahayn.",
      "Kiisaska qaarkood waxay leeyihiin tafaasiil ay si fiican u yaqaanaan, sida kaadida wiil yar oo naaska la nuujinayo (la rusheeyey halkii si buuxda loo dhaqi lahaa, heshiis la sheegay) - markaa baro xukunnada dhabta ah ee dugsigaaga xaaladaha aad dhab ahaantii la kulanto.",
    ],
    hadith: [
      {
        excerpt:
          "Xaga dhiiga caadada ee marada: xoq, kadibna ku mari biyo, kadibna dhaq, kuna tukada. (Asma bintu Abii Bakar)",
      },
    ],
    actions: [
      "Ugu yaraan hal maro oo nadiif ah u dhig salaadda.",
      "Haddii wasakhdu ay ku taabato dharkaaga meel ka baxsan guriga, biyo raaci waxaad awooddo oo beddel marka ay suurtogal tahay.",
    ],
  },
  {
    title: "Nadiifinta Jirka",
    summary: "In wasakhda laga saaro jirka, iyo aadaabta istinjaha iyo nadaafadda.",
    body: [
      "Wasakhda jidhka ku jirta waa in la maydho salaada ka hor, iyada oo la raacayo awoodda qofka. Kiisaska ugu badan waa is-nadiifinta ka dib isticmaalka musqusha - istinja - kaas oo lagu sameeyo biyo, ama qalab qallalan oo ku habboon, ilaa aagga nadiif yahay. Rasuulku ﷺ wuxuu baray nadaafadda si taxaddar leh ka dib marka la is dejiyo wuxuuna mamnuucay in loo isticmaalo gacanta midig.",
      "Marka laga reebo in wasakhda la saaro, Islaamku waxa uu dhiirri-galiyay aasaaska nadaafadda dabiiciga ah (fitrah) kaas oo jirka ka dhigaya nadiif iyo diyaar u ah cibaadada: gooynta cidiyaha, ka saaridda cududda iyo timaha cawska, iyo wixii la mid ah, si joogto ah.",
      "Dhaqannadani ma aha oo kaliya wanaagga dhaqanka - waa qayb ka mid ah sharafta iyo nadaafadda ee uu mu'minku isu soo bandhigo Eebbe hortiisa salaadda.",
    ],
    hadith: [
      {
        excerpt: "Rasuulku ﷺ wuxuu isku nadiifin jiray biyo ka dib markuu is dejiyo. (Anas)",
      },
    ],
    actions: [
      "Had iyo jeer buuxi istinja ka hor inta aanad musqusha isticmaalin.",
      "Sido unugyo iyo, halka aad awoodid, hab biyo ah markaad safarka ku jirto.",
    ],
  },
  {
    title: "Nadiifinta Goobaha Salaadda",
    summary:
      "Meesha salaaddu waa inay ahaataa mid ka nadiif ah wasakh la yaqaan - iyada oo aan shaki lahayn.",
    body: [
      "Meesha lagu tukanaayo waa in ay ahaataa mid kabaxsan najaasaha la yaqaan. Rasuulku ﷺ wuxuu si cad u baray arrintan: markii nin reer baadiyaha ah uu ku kaadiyay cidhifka masaajidka, wuxuu ka joojiyay asxaabtii inay si adag u canaananayaan, ha dhammeeyaan, ka dibna wuxuu amray baaldi biyo ah in lagu shubo goobta - isagoo baraya nadaafadda iyo dabacsanaanta labadaba.",
      "The governing rule is certainty. Dhulka guud ahaan waxa laga dhigay goob lagu tukado, sidaa awgeed dusha sare waxa loo malaynayaa in uu nadiif yahay haddii aanad caddayn dhab ah u haynin wasakh. Haddii aad ogtahay in wasakhdu ay jirto, ka saar ama u dhaqaaq meel nadiif ah; Haddii aad u malaynayso in ay halkaas ku jirto, iska dhaaf xantu oo sii wad.",
      "Miisaankani waxa uu ilaalinayaa cibaadada laba daraf oo kala ah: in si taxadar la'aan ah loogu tukado dhul wasakhaysan, iyo in la curyaamiyo tuhun aan sal iyo raad toona lahayn oo dusha kasta laga qabo.",
    ],
    hadith: [
      {
        excerpt:
          "Markii nin reer baadiyaha ah uu ku kaadiyay masjidka, nabigu ﷺ wuxuu amray in lagu shubo baaldi biyo ah. (Abuu Hureyrah)",
      },
    ],
    actions: [
      "Ka jaleec sariirtaada iyo sagxadaada salaada ka hor.",
      "Adigoon daliil dhab ah u hayn nijaasta, iska daa xumaanta aan sal iyo raadka lahayn oo duco.",
    ],
  },
  {
    title: "Xayd iyo daahirnimo",
    summary:
      "Caadada iyo dhiig-baxa umusha ka dib waxay wataan xukuno daahirineed oo iyaga u gaar ah.",
    body: [
      "Xilliga caadada (hayd) iyo dhiig-baxa umusha ka dib (nifas), haweeneydu ma tukanayso, iyo - naxariista diinta - ducada ka maqan wakhtigaas lama soo koobo ka dib. Taasna waa la isla qaatay: markii Caa’isha la weydiiyey sababta haweeneyda caadada qabta ay u soomayso salaadda, waxay caddaysay in sidaas la faray.",
      "Soonku wuu ka duwan yahay: Soonka bisha Ramadaan ka baaqda caadada awgeed ayaa la soo xidhaa hadhow, halka salaadaha si fudud loo kor u qaado. Marka uu dhiiggu dhammaado oo ay soo baxdo calaamad daahirsan, haweeneydu way xiisaysaa oo dib u bilawday salaadda iyo soonka.",
      "Inta ugu yar iyo muddada ugu badan ee haydh iyo nifas, iyo sida loo akhriyo calaamadaha daahirsanaanta, ayaa ah arrimo ay dugsiyadu si faahfaahsan ugu kala duwan yihiin. Dumarku waxay ka faa'iidaystaan ​​barashada axkaamta wax ku oolka ah ee hal dugsi oo la isku halayn karo oo leh macalin aqoon leh.",
    ],
    hadith: [
      {
        excerpt:
          "Caa’isha oo la weydiiyey sababta ay haweeneyda caadada qabta ay u soonto oo aysan salaadda u soomin, waxay tiri: waxaa nala faray inaan soonka ka soo baxno, mana na faray inaan salaadda ka soo baxno. (Mucaadah, ka Caaishah; sidoo kale Saxiix Muslim 335)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Su'aalaha Inta Badan La Isweydiiyo",
    summary: "Jawaabo gaagaaban oo ku saabsan walaacyada nadaafadda ee ugu caansan iyo shakiyada.",
    body: [
      "Shakigu miyuu jebiyaa wuduuga? Maya. Haddii aad lahayd suuf oo aanad si fudud u hubin in aad jebisay, wuduugaagu wuu taagan yahay ilaa aad ka hubsato wax burinaya. Ku-dhaqanka shakiga shakigu waa mabda'a nebiyad ee kaa ilaalinaya shakiga waswaaska ah (waswas).",
      "Ka warran kabka, faashado, iyo nabarrada? Waxaa jira tanaasul. Meesha maydhista addimada daboolan ay waxyeelo leedahay, waxaad ku masaxaysaa dhaymada (mash 'ala al-jabirah) meesheeda, tayammumkuna waxay dabooshaa waxa aan la gaadhi karin - tafaasiisha waxay ku kala duwan yihiin dugsiga iyo xaalada.",
      "Maxaa dhacaya haddii aanan isticmaali karin gabi ahaanba biyaha? Tayammum leh carro nadiif ah ayaa si buuxda u shaqaynaysa ilaa awoodda isticmaalka biyaha ay soo noqoto.",
      "Ka warran xaaladaha daba-dheeraada - dhiig-bax joogto ah (istihadah) ama kaadi-la'aan? Qofka waxaa loola dhaqmaa sidii qof cudurdaar joogto ah (Madhur): waa uu is nadiifiyaa oo wuu suufiyaa salaad kasta waqtigeeda, kadibna wuu tukadaa xitaa haddii dheecaanku sii socdo, mana burinayso salaaddaas.",
    ],
    actions: [
      "Ha u ogolaanin shaki joogta ah inuu xannibo cibaadadaada - raac hubaal, ha u ogolaanin shaki.",
      "Xaalado dabadheeraad ah ama xaalado adag, ka hel xukun shaqsiyeysan oo ka yimid aqoonyahan u qalma.",
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Jawaabahaan FAQ waa soo koobid waxbarasho, ma aha fatwo shaqsiyeed. Kiisaska adag ama kuwa dabadheeraada waa in dib loo eego aqoonyahan deegaanka ah.",
  },
  {
    title: "Tixraacyo iyo Daraasad Dheeraad ah",
    summary: "Aayadaha Qur'aanka ee xudunta u ah iyo cutubyada xadiithka ee daahirinta.",
    body: [
      "Qormada aasaasiga ah ee Qur'aanka ee daahirintu waa aayadda suufka, suuradda al-Maa'idah 5:6, taasoo si wada jir ah u qeexaysa wuduuga, gusl, iyo taymuum; agteeda, 2:222 ('Eebbe wuxuu jecel yahay kuwa isdaahiriya') iyo aayadaha daahirka ah ee biyaha (25:48) waxay ku dhejiyaan mawduuca.",
      "Sunnada, ilaha aasaasiga ah waa Kutubta Nadiifinta (Kitaab al-Taharah / al-Wudu / al-Ghusl / al-Xayd) ee furay Saxiix al-Bukhaari iyo Saxiix Muslim, oo ay ku xigto isla cutubyada afarta Sunan (Abu Daawuud, at-Tirmidhi, an-Nasaa'i, Ibn Maajah), oo soo ururinaysa xukunkii finer.",
      "Axkaamta lagu dhaqmo, buug-gacmeedyada fiqhiga qadiimiga ah ee afarta mad-hab ee sunniga ah ayaa bixiya jagooyin tafatiran - khilaafkooduna waa qayb sharci ah oo ka mid ah dhaqanka, ma aha cillad. Isticmaal cutubkan si aad u aragto dulmar habaysan, ka bacdi ku qotomi daraasadaada macalin aqoon leh iyo qoraalada aasaasiga ah.",
    ],
    quran: [{}, {}],
    hadith: [
      {
        excerpt: "Cutubyada dhammaystiran ee wudu, ghusl, tayammum, iyo hayd ee furaya ururinta.",
      },
      {
        excerpt:
          "Buugga Nadiifinta - warbixino dhab ah oo ku saabsan xukunnada taharah, aadaabta, iyo mabaadi'da.",
      },
    ],
    actions: [
      "Raac hal manhaj oo la aamini karo si aad uga fogaato jahawareer ka yimaada xukunnada kala firirsan.",
      "Mawduucyadan mar mar dib u eeg ilaa kalsoonida la taaban karo ay joogto.",
    ],
    appLinks: [{}, {}],
  },
];

export const TAHARAH_CHECKLIST_SO: DeepPartial<TaharahChecklistItem>[] = [
  {
    title: "Wudu ka hor Fajar",
    hint: "Maalinta ku bilow xaalad nadiif ah marka ay suurtogal tahay.",
  },
  {
    title: "Siwak / caday ilkaha",
    hint: "Sunno ka hor inta aan la tukan iyo salaada ka hor.",
  },
  {
    title: "Dharka salaada oo ka maran najaasaha",
    hint: "Iska hubi wasakhda muuqata ka hor Salaadda.",
  },
  {
    title: "Nadiifi goobta salaadda",
    hint: "Meesha aad ku tukanayso ka saar wax kasta oo nijaas ah.",
  },
  {
    title: "Cusboonaysii wuduuga ka dib buriyeyayaasha",
    hint: "Dabayl, hurdo, musqul - ogow waxa jebiya wuduga.",
  },
  {
    title: "Gusl marka loo baahdo",
    hint: "Nijaasnimo weyn ka dib, caadadu way dhammaanaysaa, ama dhiigbaxa umusha ka dib.",
  },
];
