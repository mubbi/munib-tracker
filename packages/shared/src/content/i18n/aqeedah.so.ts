// Somali translation overlay for the Learn Aqeedah content. Mirrors the order of
// its English source in ../aqeedah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { AqeedahGlossaryTerm, AqeedahTopic } from "../../types/aqeedah";
import type { DeepPartial } from "./localize";

export const AQEDAH_TOPICS_SO: DeepPartial<AqeedahTopic>[] = [
  {
    title: "Hordhac",
    summary: "Caqiidadu waa aasaaska iimaanka ee qaabeeya cibaadada, dabeecadda, iyo ujeedada.",
    body: [
      "Erayga aqidah (عقيدة) waxa uu ka yimid asal macne ah in la xidho ama si adag loo xidho - waa caqiidada uu qofka muslimka ahi si dhab ah u haysto in qalbigu ku xidhan yahay iyaga oo aan shaki ku jirin. Xadiithka caanka ah ee Jibriil, Nabigu ﷺ wuxuu ku soo koobay lix caqiido oo kala ah: Allaah, Malaa'igtiisa, Kutubtiisa, Rusushiisa, Maalinta qiyaamaha, iyo qadarka Ilaahay (Qaadriga) wanaaggeeda iyo qadhaadhkeeda.",
      "Ahlul-Sunnah wal-Jamaaca - waa ururka ugu muhiimsan ee Muslimiinta Sunniga ah - caqiidada waxaa laga soo qaatay marka hore Qur'aanka, ka dibna Sunnada saxda ah, oo la fahmayo habka saxaabada Nabiga iyo jiilasha hore (salaf). Meesha caqliga lagu isticmaalo, waxay u adeegtaa waxyiga intii la xad-gudbin lahaa.",
      "Aqidah ma aha mawduuc siminaar aan la taaban karin; waa xididka ay ka soo baxaan dhammaan cibaadada iyo dabeecadda. Qofku waxa uu aaminsan yahay in Alle yahay, sababta loo abuuray iyo meesha uu u socdo si deggan ayaa u xukunta sida uu u tukado, sida uu ula dhaqmo dadka kale, iyo sida uu ula kulmo dhib iyo dhimasho.",
      "Caqiidada saxda ah waxay ilaalisaa qalbiga isku dheeli tiran ee udhaxeeya cibaadada waaweyn - jacaylka iyo cabsida, rajooyinka iyo cabsida, isku hallaynta iyo dadaalka, mahadnaqa iyo toobada - si aanu mu'minku uga quusan naxariista Eebe ama aanu u dareemin ammaan la xisaabtankiisa.",
    ],
    quran: [
      {
        excerpt:
          "Xaqnimadu waa in qofku rumeeyo Allaah, maalinta qiyaamaha, malaa’igta, kitaabka iyo nabiyada…",
      },
      {
        excerpt:
          "Kuwa xaqa rumeeyow rumeeya Eebe, Rasuulkiisa, Kitaabkii uu ku soo dejiyey Rasuulkiisa, iyo Kitaabkii uu horay u soo dejiyey.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Imaanku waa in la rumeeyo Eebbe, malaa’igtiisa, kutubtiisa, rusushiisa, maalinta aakhiro, iyo in la rumeeyo xukunka Eebbe khayrkiisa iyo khadhaadhkiisaba. (Xadiis Jibriil, waxaa wariyey Cumar)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Waa maxay Aqidah?",
    summary: "Aqidaa maqaa filosoofiyada; waa caqiido nool oo ku qotoma waxyiga.",
    body: [
      "Caqiidadu waa waxa qalbigu si hubaal ah u xaqiijiya oo markaas ka muuqda cibaadada iyo dhaqanka - kaliya maaha aragti la xafiday dood. Quraanku wuxuu ku sifeeyay mu'miniinta sal adag inay yihiin kuwa waxyiga yidhaahda, waan rumaynay; Dhammaan waxay ka ahaatay Eebahanaga (3:7): Waxay u hogaansamaan waxa cad, waxayna u dhiibaan Eebe waxa maqan.",
      "Culimadii hore waxay qoreen qoraallo kooban oo caqiido ah (sida al-Aqidah al-Tahawiyya) si ay si sax ah u dhawraan caddayntan - si ay rumaystayaasha caadiga ah uga ilaaliyaan laba khatarood: buunbuuninta diinta ku soo kordhinaysa, iyo inkiraadda oo meesha ka saaraysa wixii Eebbe caddeeyay.",
      "Ahl al-Sunnah dhexdeeda waxaa jira mad-habta fiqiga oo la aqoonsan yahay - oo ay ugu horreeyaan Athari, Ashcari, iyo Maturidi - kuwaas oo si buuxda ugu heshiiyey waxyaabaha lagama maarmaanka u ah iimaanka iyagoo ku kala duwan hababka farsamada qaarkood ee lagu muujinayo arrimaha qaarkood, gaar ahaan sifaadka rabaaniga ah. Aasaaska ay wadaagaan waa mid keliya oo sugan: Alle kalinimadiisa, runnimada waxyigiisa, iyo xisaabtanka dhabta ah ee aakhiro.",
      "Haddaba caqiidada waxa ugu wanaagsan in loo barto sida rumaysadka nool: qodob kasta oo caqiidada ka mid ahi waxa uu ku xidhaa hab cibaado, hab dhaqan, iyo il raaxo.",
    ],
    quran: [
      {
        excerpt:
          "Waxayna dheheen kuwii ku adkaaday cilmiga waan rumaynay. Dhammaantood waxay ka yimaadeen xagga Rabbigeenna.",
      },
    ],
    actions: [
      "Culumo lagu kalsoonaan karo ka baro iyo qoraallada aasaasiga ah, ee ha ka baranin doodaha baraha bulshada.",
      "Caqiido kasta oo aad barato, weydii: sidee ayay tani u beddeshaa sida aan u caabudo oo aan u noolaado?",
    ],
  },
  {
    title: "Maxaa Aqidah Muhiim u ah",
    summary:
      "Caqiidada wanaagsani waxay siisaa xasillooni ruuxeed waxayna ka ilaalisaa meelaha ugu daran.",
    body: [
      "Marka caqiidadu run noqoto oo la dejiyo, camalku wuxuu noqdaa mid daacad ah oo xasilloon; Marka caqiidadu ay gariirto, cibaadadu waxay u janjeertaa inay noqoto mid aan degganayn, caadifad kaliya, ama si fudud u gilgilan rabitaan iyo shaki. Eebe wuxuu u ballan qaaday inuu ku sugo kuwa rumeeyey hadal sugan - if iyo aakhiroba.",
      "Caqiidada saxda ah sidoo kale waa waxa mu'minka ku sita nolosha oo dhan: waxay baraysaa samir ku kalsoonaanta xukunka Eebe marka lagu jiro dhibaatada, mahadnaqa shucuurta ducada, iyo xasilloonida hubaal la'aanta iyo dhimashada. Qofka qadarka iyo aakhiraba si dhab ah u aaminsan ma burburo marka la imtixaano.",
      "Ugu dambayntii, caqiidada suuban waxay baraysaa Adab — dhaqanka suuban — is khilaafsan: ku adkaysashada aasaaska cad iyadoo xushmad iyo dhawris ku muujinayso arrimaha sare ee ay culimada daacadda ahi ku kala aragti duwanaayeen. Aqoonta caqiidada waa inay kordhisaa khushuuc iyo naxariista, waligeedna kibir.",
    ],
    quran: [
      {
        excerpt:
          "Eebana wuxuu ku sugaa kuwa xaqa rumeeyey hadal sugan nolosha adduun iyo aakhiraba.",
      },
    ],
    hadith: [
      {
        excerpt:
          "U xiiso waxa ku anfacaya, ka warso Allaah, hana noqonin mid tabar daran... (Abuu Hureyrah)",
      },
    ],
  },
  {
    title: "Lixda Qodob Ee Iimaanka",
    summary: "Nabigu ﷺ waxa uu iimaanka ku soo koobay lix caqiido oo aasaasi ah.",
    body: [
      "Lixda qodob waxay ka soo jeedaan axaadiista Jibriil oo ka mid ah xadiisyada ugu muhiimsan Islaamka. Malag Jibriil ayaa u yimid qaab nin oo kale, wuxuuna Nebiga ﷺ ka hor waraystay saxaabada, Islaamka, iimaanka iyo ixsaanka. Markii uu weydiiyay wax ku saabsan iimaanka, nabigu ﷺ wuxuu ku jawaabay lixdaas caqiidadood - Jibriilna wuu xaqiijiyay, ka dibna wuu baxay, isagoo u yimid inuu dadka baro diintooda.",
      "Lixdu waa: rumaynta Alle; Malaa'igtiisa; kutubtiisa soo dajiyay; in rasuuladiisa; maalinta aakhiro; iyo qadarka Ilaahay (qadriga) khayrkiisa iyo qadhaadhkiisa. In la diido mid iyaga ka mid ah waa in laga baxo iimaanka runta ah, waayo waa dhar keliya.",
      "Waxay kaloo si qoto dheer isugu xiran yihiin. Rumayn Kutubta iyo Rasuulku waxay u horseedaa Cilmiga Maalinta Aakhiro iyo Xisaabta. Rumaynta maalinta aakhiro waxay miisaan u yeelataa camal kasta; Rumaynta qadrigana waxa ay baraysaa in Alle la talo saaro iyo khushuucda xikmaddiisa ka horraysa. Barashada sida ay u kala horreeyaan waxay dhistaa aragti adduunyo oo cad oo dheellitiran.",
    ],
    hadith: [
      {
        excerpt:
          "... Inaad rumaysataan Eebe, Malaa'igtiisa, Kutubtiisa, Rusushiisa, Maalinta Dambe, iyo inaad rumaysataan xukunka, Wanaaggiisa iyo khadhaadhkiisa. (Xadiis Jibriil)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Rumaynta Alle",
    summary:
      "Rumaynta Alle waxa ay gaadhsiisan tahay rabitaankiisa, xaqa uu u leeyahay cibaadada oo keliya, iyo magacyadiisa iyo sifooyinkiisa.",
    body: [
      "Rumaynta Alle ayaa ugu weyn caqiidada oo dhan iyo xididka inta kale. Waxay ku bilaabataa si hubaal ah inuu keligiis yahay abuuraha, mulkiilaha, iyo wax walba - Ilaaha runta ah, oo aan lahayn shuraako, siman, iyo baahi mid ka mid ah abuurkiisa.",
      "Waxaa soo baxday in isaga kaliya uu mudan yahay cibaadada nooc kasta oo ay tahay: salaadda, baryada, rajooyinka, cabsida, talinta, kalgacalka macneheeda ugu sarreeya, naf-hurid iyo nadar dhammaan waa xuquuq Alle oo aan cid ka sokoow lagu toosin. Tani waa micnaha maragfurka 'Ilaah kale ma jiro aan Allaah ahayn'.",
      "Ahlu Sunna waxay caddeeyeen magacyada iyo sifaadka sareeyo ee Eebbe nafsaddiisa u caddeeyay, Rasuulkiisuna ﷺ u caddeeyay, si ku habboon haybaddiisa – iyaga oo aan la ekayn makhluuqaadkiisa (Tamthiil) oo aan inkirin ama faaruqin sifooyinkiisa macnaha ah (Taatil). Aayadda hanuunintu waa: ‘La mid isaga ma jiro, waana maqle arka’ (42:11) — oo labaduba beenin isu ekaanshaha, kuna caddaysay maqalkiisa iyo arkigiisa.",
      "In Eebe lagu garto Magacyadiisa – Eebaha Naxariista, wax walba og, noolaha, Boqorka, Dambi dhaafka — waa cunnada qalbiga: mar kasta oo aad taqaanid isaga, ayaa aad jeceshahay, oo aad ka cabsanaysaa, una noqonaysaa.",
    ],
    quran: [
      {
        excerpt:
          "Waxaad dhahdaa waa Eebaha kalida ah… waxna ma dhalin, mana dhalan, wax la mid ahna ma jiro.",
      },
      {
        excerpt: "Eebbana waxaa u sugnaaday magacyo wanaagsan, ee ku barya iyaga.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Rumaynta Malaa'igta",
    summary:
      "Malaa'igta waa la karaameeyay, addoommadii Alle ee aan la arkin ee aan weligood ku caasin.",
    body: [
      "Malaa'iktu ( Mala'ikah) waa abuur aad u wayn oo laga sameeyay iftiinka. Ma laha rabitaan xor ah oo ay ku caasiyaan: waxay u caabudaan Eebe si joogto ah oo ay u fuliyaan amarkiisa si qumman, 'aanay ku caasin Eebe wuxuu farayo, oo falaan waxa la amray'.",
      "Si loo rumaysto iyaga waa in la rumaysto in dunida aan la arki karin ay tahay mid dhab ah oo nagu wareegsan. Malaa’igtu waxyi way soo bandhigtaa, wayna ilaalisaa dadka, wayna qortaa hadal kasta iyo camal kasta, waxayna nafta ka qaadaa marka ay dhintaan, waxayna ku maamulaan arrimaha dhulka iyo samooyinka, idanka Eebbe, sidaas darteed mu’minka ma aha kaligiis iyo la’aanteed.",
      "Dhowr ayaa lagu magacaabay qoraallada oo leh door gaar ah: Jibriil, malaa'igtii waxyiga; Mikaa’iil oo loo igmaday roob iyo arsaaqo; Israafiil, kan dubbatu; Malak al-Mawt, malaa'igtii geerida; iyo culimadii sharafta lahayd (Kiraman Katibin) oo qof walba camalkiisa qora. Munkar iyo Naakir oo qabriga su’aalo ku weydiinaya marxuumka.",
    ],
    quran: [
      {
        excerpt:
          "Korkeeda waxaa ah Malaa'ig adag oo daran oon Eebe ku caasinayn wuxuu faray oo falay waxa la faray.",
      },
      {
        excerpt:
          "Waxaad dhahdaa ruuxii Col u ah Jibriil waa kan ku soo dejiyey Qalbigiinna idanka Eebe.",
      },
    ],
    actions: ["La noolow wacyiga in malaa'igaha wax duuba aysan waligood seegin eray ama fal."],
  },
  {
    title: "Rumaynta Kutubta Rabbaaniga ah",
    summary:
      "Eebbe wuxuu soo dejiyey kutub hanuun ahaan; Qur'aanku wuu xaqiijinayaa oo wuxuu u taagan yahay heerka ugu dambeeya.",
    body: [
      "Muslimiintu waxay rumaysan yihiin in Eebbe u soo dejiyey rusushiisa kutubta hanuun iyo naxariis. Qur'aanku wuxuu magacaabay dhowr: Suxufkii Ibraahim iyo Muuse, Tawrkii la siiyay Muuse, Zabuurkii Daawuud, Injiilka Ciise, iyo ugu dambeyntii Quraanka Muxammad ﷺ - oo la rumeysan yahay guud ahaan, qaabkoodii asalka ahaa.",
      "Qur'aanku wuxuu leeyahay darajo gaar ah. Waa waxyigii ugu dambeeyay, oo la soo diray isagoo xaqiijinaya wixii ka horreeyey iyo sifo lagu kala saaro” (5:48) - taasoo la micno ah inuu xukumo oo saxo, maadaama kutubtii hore aanay ku sii nagaan xaaladdoodii asalka ahayd ee waa la beddelay (tahrif) oo lumay qarniyaal badan.",
      "Kutubta oo dhan si gaar ah ayuu Qur'aanka uga dhawray fasaadka: 'Waxaan soo dajinay Quraanka, annaguna waxaan nahay ilaaliye' (15:9). Rumaynta kutubta waxa ay la macno tahay in la xurmeeyo waxyiga, in qur’aanka lagu akhriyo oo la milicsado, lana hogaansamo hanuunkiisa nolosha.",
    ],
    quran: [
      {
        excerpt:
          "Waxaana kugu soo Dejinay Kitaabka si Xaq ah, isagoo u Rumayn wixii ka Horreeyey oo Kitaabka ah iyo Muujintiisa.",
      },
      {
        excerpt: "Annagaa soo dajinay Quraanka, annagaana wakiil u ah.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Rumaynta Nabiyada",
    summary:
      "Nebiyadii oo dhami waxay soo gudbiyeen xaqiiqo isku mid ah; Muxammad ﷺ waa rasuulkii ugu dambeeyay.",
    body: [
      "Qofka muslimka ah waxa uu rumeeyey dhammaan nabiyada iyo rususha Eebbe soo diray, isagoon midkoodna diidin. Laga soo bilaabo Aadam ilaa Nuux, Ibraahim, Muuse, iyo Ciise ilaa Muxammad ﷺ, dhammaantood waxay ugu yeedheen farriin isku mid ah: Caabuda Eebbe oo keliya, una noolaada si qumman. Shan iyo labaatan ayaa lagu sheegay Quraanka; Tiradooda guud waxaa og Alle oo kaliya.",
      "Nebiyadu waa kuwa ugu khayrka badan khalqiga run ahaan iyo aaminnimo, Allena ka dhawray inay ka been sheegaan farriinta iyo dembiga waaweyn - haddana waxay ku sii ahaadaan bani-aadmi, oo aan ilaahi ahayn, oo aan weligood la caabudin. Shan ka mid ah ayaa lagu tilmaamay inay yihiin rasuuladii 'xakamaysan' (ulu al-cazm): Nuux, Ibraahim, Muuse, Ciise, iyo Muxammad ﷺ.",
      "Muxammad ﷺ waa shaabadda Nabiyada (Khat an-nabiyyin): Nabi kama iman isaga dabadiisa, farriintiisuna waa mid caalami ah - oo loo soo diray dhammaan aadanaha ilaa maalinta qiyaame. Rumaynta isaga waxaa ka mid ah in isaga la jeclaado, oo la addeeco amarradiisa, la rumaysto warbixintiisa, iyo in loo caabudo oo keliya sidii uu wax u baray.",
    ],
    quran: [
      {
        excerpt: "... Ma kala saarno mid ka mid ah Rasuulkiisa…",
      },
      {
        excerpt:
          "Muxammad ma aha aabbaha mid ka mid ah raggiinna, laakiin waa Rasuulkii Eebe iyo shaabadda Nabiyada.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Rumayn maalinta aakhiro",
    summary:
      "Noloshu waxay horseed u tahay la kulanka ugu dambeeya ee Eebbe, caddaalad qumman, iyo natiijooyin waara.",
    body: [
      "Rumaynta maalinta aakhiro waa in la rumeeyo wax kasta oo geerida ka dib: su’aasha iyo nolosha qabriga (Barzakh), afuufi suurka, soo bixin dadka oo dhan, kulmin wayn, xisaabinta, miisaamidda camalka Miisaanka, ka gudubka Buundada, iyo labada daarood ee waarid – Jannada iyo Naarta.",
      "Caqiidadani waxay siinaysaa miisaanka akhlaaqda daqiiqad kasta. Maxaa yeelay Eebbe wuxuu arkaa waxa qarsoon, wuxuuna qoraa camalka ugu yar, wax khayr ahna lama khasaariyo, xumaantana lama illoobo: ‘Ruuxii falta atom miisaankiisa khayr ah wuu arkayaa, ruuxii sameeyana wax atom ah oo xumaan ah wuu arki.",
      "Ahlu Sunna waxay si dhab ah u xaqiijiyaan xaqiiqooyinkaas oo dhan, iyagoo si dhab ah u rumaysan sida loo soo wariyey, iyagoo qiraya in culimadu ku kala duwan yihiin tafsiirrada qaar ka mid ah tafaasiisha qadhaadh ee dhacdooyinka iyo calamadaha gaarka ah. Ujeedada caqiidadu maaha mala-awaal ee waa diyaargarow.",
    ],
    quran: [
      {
        excerpt:
          "...Haddaba ruuxii sameeya wax atom ah oo wanaag ah wuu arki doonaa, ruuxii sameeyana wax xun wuu arki doonaa.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Rumaynta Qadarka (Dikradda Ilaahay)",
    summary:
      "Cilmiga Alle iyo amarkiisu waa dhammaystiran yihiin - haddana bini'aadamku si dhab ah ayey u doortaan oo waa la xisaabtamayaa.",
    body: [
      "Rumaynta Qadarka waxa lagu soo koobaa afar heer oo kala ah: in Alle wax walba og; inuu kulligood ku wada qoray looxa dhawrsan konton kun oo sano ka hor abuurniinta; in aan waxba ku dhicin doonistiisa mooyee; iyo inuu yahay Abuuraha wax kasta oo jira oo ay ku jiraan camalka addoomadiisa.",
      "Isla markaa, bini'aadmigu waxay leeyihiin rabitaan dhab ah iyo doorasho dhab ah oo ku dhex jirta waxa Alle idmo - waana sababta dhabta ah ee amarrada iyo mamnuucidda, abaalmarinta iyo ciqaabta, ay yihiin kuwo caddaalad ah oo macno leh. Qofku wuxuu dooranayaa inuu tukado ama been sheego, waxaana si sax ah loo haystaa mas'uuliyadda; Aqoonta hore ee Alle ee doorashada kuma khasbayso.",
      "Ahlul-Sunnah waxay kala wadaan laba khalad oo kala ah: Diidmada go'aanka (sida haddii ay dhacdodu ka baxsanayso aqoonta iyo dardaaranka Alle), iyo dilid (iyaga oo isticmaalaya wareegtada si ay u baabi'iyaan mas'uuliyadda aadanaha iyo cudur daar dembiga). Mu'minku si fiican buu u wanaajiyaa, dabadeed wuxuu u wakiishay natiijada Eebe.",
      "Dhab ahaantii, qadrigu waa isha ugu weyn ee nabadda: ka dib markaad hawshaada qabato, waxaad ku nasanaysaa inaad ogaatid in wax kasta oo ku soo gaadha uusan waligiis ku seegi karin, wax kasta oo ku seegaanna aysan marnaba ku soo gaadhi karin.",
    ],
    hadith: [
      {
        excerpt:
          "Haddii ay wax kugu dhacaan, ha odhan 'haddaan saas yeeli lahaa', ee waxaad tidhaahdaa 'Ilaahay baa qaddaray, wuxuu doonana wuu falay' - waayo 'hadday uun' albaabbada u furayso Shaydaanka. (Abuu Hureyrah)",
      },
    ],
    quran: [
      {
        excerpt: "Wax walbana waxaan ku abuurray qadar (Qaddar).",
      },
      {
        excerpt: "Eebana ma badalo xaalka qoom intay ka badalaan waxa naftooda ku sugan.",
      },
    ],
    misconceptions: [
      "Fikrad khaldan: Haddii wax walba la xukumo, dadaalku waa macno darro. Sixitaan: Islaamku wuxuu amray dadaalka, qorsheynta, salaadda, iyo towbada - qaadashada dariiqa lafteeda waa qayb ka mid ah xukunka.",
      "Fikirka qaldan: Qadr macnihiisu waa Allaah ayaa dambigeyga eedda leh. Sixitaan: Addoonka ayaa doorta oo la xisaabtama; wareegtada marna marmarsiiyo uma noqonayso caasinimada.",
      "Fikirka khaldan: Dhibku wuxuu caddaynayaa in Eebbe iga cadhooday. Sixitaan: Tijaabooyinku waxay noqon karaan nadiifin, sare u qaadis darajo, digniin, ama baaq ah soo noqoshada - badiyaa calaamad daryeel, ma aha xanaaq.",
    ],
    actions: [
      "Si Wanaagsan u Qaado Macnaha, Kadibna Talo Saaro Xukunka Eebe.",
      "Ku beddel 'haddii kaliya…' qoomamaynta wareegyada 'Qaddar Allah' iyo tallaabo xigta oo wax dhisaysa.",
    ],
  },
  {
    title: "Tawxiid ayaa Sharaxay",
    summary:
      "Tawxiidku waxa ay midaysay rabigii Alle, xaqa uu u leeyahay cibaadada, iyo magacyadiisa iyo sifooyinkiisa.",
    body: [
      "Tawxiid (توحيد) - kalinimada Alle - waa qalbiga Islaamka iyo farriinta nebi kasta. Macnaheedu waa in Alle keligiis lagu sooco wax kasta oo isaga u gaar ah, iyo in la xaqiijiyo kaamilnimadiisa sida uu isagu isu tilmaamay.",
      "Culimadu waxay inta badan ku baraan tawxiidka saddex arrimood oo isku xidhan si ay u fududaato fahamka iyo ilaalinta. Tawxiid al-Rububiyah: in Alle keligii wax walba abuuray, leh, maamulana. Tawxiid al-Uluxiyyah: in Allaah kaliya uu mudan yahay cibaadada oo dhan - tani waa arrinka rasuulladu aad u nuux-nuuxsadeen, gaaladana ay iska caabiyeen. Tawxiid al-Asmaac wal-Sifaat: oo ku xaqiijinaysa magacyada Eebbe iyo sifooyinkiisa sida lagu soo dejiyay, iyadoon qalloocin, inkiranayn, la mid ahayn.",
      "Qaab-dhismeedkan saddexda qaybood ka kooban waa qalab wax lagu baro, ee ma aha isha qaybinta; Ujeeddadeedu waa in lagu caawiyo qofka mu'minka ah inuu ilaaliyo daacadnimada oo uu aqoonsado halka midnimadu wax u dhimi karto. Dhammaanteed waxaa lagu soo qaatay ducada furitaanka ee qof kasta oo Muslim ah ducadiisa: 'Adiga kaliya ayaanu caabudaynaa, adiga keligaa ayaana gargaar waydiisanaynaa.'",
      "Aragti muhim ah: qirashada in Alle uu yahay abuuraha (rububiyah) kuma filna kaligeed. In badan oo nebiyada beeniyey ayaa haddana qirey in Eebbe abuuray samooyinka iyo dhulka – waxa ay diideen waa in ay caabudaan isaga oo keliya (uluhiyyah). Tawxiidka dhabta ah waxa lagu caddeeyaa cibaadada, ma aha oo kaliya in la rumaysto asalka.",
    ],
    quran: [
      {
        excerpt: "Adiga uun baannu ku caabudaynaa, adiga keliya ayaana gargaar waydiisanaynaa.",
      },
      {
        excerpt: "Eebe Ilaah kale ma jiro isaga mooyee. Waxaana u sugnaaday magacyo fiican.",
      },
    ],
    misconceptions: [
      "Fikirka qaldan: Tawxiid waa hal jumlad oo kaliya. Sixitaan: Waa rumaynta qalbiga, odhaah carrabka ah, iyo xaqiiqo lagu noolaado cibaadada.",
      "Fikirka khaldan: Rumaynta Eebbe waa abuuraha waa tawxiidka oo dhan. Sixitaan: Xataa gaalo badan ayaa cadaysay in - imtixaamku waa caabudid Alle kaligii.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shirki Sharaxay",
    summary: "Shirkigu waa ku toosin xaq kasta oo Alle ku leeyahay wax aan isaga ahayn.",
    body: [
      "Shirkiga (شرك) — la wadaajinta Alle — waa lidka tawxiidka, qofkii gafana Qur’aanku wuxuu si gaar ah u tilmaamay in aan la cafin karin haddii uu qof ku dhinto korkeeda isagoon toobad keenin: ‘Eebbe ma dhaafo in lala wadaajiyo, ee wuxuu u dhaafaa wax ka yar cidduu doono’.",
      "Shirkiga weyn (al-shirk al-akbar) waa in cibaadada loo jeediyo cid kale oo aan Alle ahayn - in loo yeedho kuwa dhintay ama ka maqan waxa Alle kaliya uu bixin karo, u hurid ama nidar la galayo makhluuqa, ama wax la jeclaado oo loo hoggaansamo sida ay tahay in uu Alle u hoggaansamo. Waxay kaxaynaysaa qof ka baxsan Islaamka haddii ay ku dhintaan iyagoo aan toobad keenin.",
      "Shirkiga yar (al-shirk al-asghar) kama saarayo Islaamka laakiin aad ayuu khatar u yahay wuxuuna burin karaa abaalka camalka. Qaabkeeda ugu cad waa riya - oofinta cibaadada si ay dadku u arkaan looguna ammaano - taas oo Nebigu ﷺ ku tilmaamay wax uu uga baqi jiray bulshadiisa. In lagu dhaarto Alle ka sokow si uu u sarraysiiyo ayaa halkan ku dhacda.",
      "Ahlu Sunna waxay ka digtoonaadaan luqadda iyo xukunka: guud ahaan in laga digtoonaado shirkiga waa lama huraan waana caddahay, laakiin in qof gaar ah lagu sheego inuu yahay mushrik ama gaal (takfiir) waa arrin culus oo u baahan aqoon, daliil sugan iyo in cudur daar laga saaro - waxaa iska leh culimo aqoon leh, ee maaha mid u gaar ah dadka caadiga ah ama doodaha internetka.",
    ],
    quran: [
      {
        excerpt: "Eebana ma dhaafo la wadaajinta, wuxuuse ka dhaafaa waxa ka yar cidduu doono.",
      },
      {
        excerpt: "Wiilkaygiiyow, ha la wadaajinin Eebbe. Illeen ururku waa dulmi weyn (zulm).",
      },
    ],
    hadith: [
      {
        excerpt:
          "Waxa aan idiinka baqayo waa shirki yar. Markii la weydiiyay waxa ay tahay, wuxuu yiri ﷺ: is tusi (riya). (Maxamuud ibnu Labiid)",
      },
    ],
    misconceptions: [
      "Fikirka khaldan: Simbiriirixasho kasta oo carrabku waa shirki weyn. Sixitaan: Culimadu way kala soocaan weyn iyo kuwa yar waxayna si taxadar leh u xukmiyaan kiis kasta iyagoo wata caddayn.",
      "Fikirka qaldan: Ka digista shirkigu waxay u baahan tahay qallafsanaan xagga dadka. Sixitaan: Habka nebiyadu waxa ay ku lammaaniyaan caddaynta runta iyo naxariista iyo waxbaridda dulqaadka.",
    ],
  },
  {
    title: "Daacadnimo (Ikhlaas)",
    summary: "Camalka waxa la aqbalayaa kaliya marka loo sameeyo Allaah dartiis.",
    body: [
      "Ikhlaas (إخلاص) waa in lagu doondoono raali ahaanshiyaha Alle oo kaliya fal - ma aha mansab, ammaan, maal, ama saameyn dadka. Waa shardiga gudeed ee aqbalaadda camal kasta ay ku xiran tahay: Nebigu ﷺ wuxuu baray in 'ficilku ay tahay niyo, qof walbana uu helayo wixii uu damacsanaa'.",
      "Sababtoo ah abaalgudku waxay ku xidhan yihiin ula kac, camal yar oo aamusan oo si daacad ah loogu sameeyo Allaah wuxuu ka miisaan badnaan karaa camal fagaare ah oo sumcad lagu sameeyo. Isla ficilka dibadda ah - bixinta sadaqo, tukashada, waxbaridda - waxay noqon kartaa cibaadada ama faaruqnimada iyadoo ku xiran qalbiga ka dambeeya.",
      "Daacadnimada hal mar lama gaaro balse si joogto ah ayaa loo cusboonaysiiyaa, sababtoo ah naftu waxay u nugul tahay inay raadiso dareenka. Haddaba mu’miniintu waxay ku celceliyaan inay niyadooda daahiriyaan waxayna Eebbe ka baryayaan inuu ka ilaaliyo shirkiga riyada ee qarsoon iyo is-khiyaanaynta.",
    ],
    quran: [
      {
        excerpt: "lamana faray inay Eebe caabudaan mooyee, iyagoo u kali yeeli Diinta.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ficilku waa niyo, qof kastana wuxuu heli doonaa oo keliya wixii uu damacsanaa. (Cumar bin Al-Khattaab)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Jacaylka iyo Alle ka cabsiga",
    summary:
      "Qalbiga fayow wuxuu Alle ku caabudaa baalasha jacaylka, rajada, iyo cabsida ixtiraamka leh.",
    body: [
      "Cibaadada qalbigu waxay ku taagan tahay saddex dawladood oo waaweyn: jacayl (maxabah), rajo (rajac), iyo cabsi ixtiraam leh (khawf). Jacaylka Eebbe waa aasaaska iyo xoogga cibaadada oo dhan – mu’miniintu waxay ‘ka xoog badan yihiin jacaylka Eebbe’ wax kasta oo kale — halka cabsida laga xumaado ay nafta ka celiso dembiga iyo halmaansanaanta.",
      "Ahlu Sunna waxa ay barayaan in kuwani ay isu dheelli tiraan, sida shimbir duuleysa oo laba baal iyo madax leh. Jacaylka iyo rajada bilaa cabsida ah waxay u dhaadhacaysaa taxadar la'aan iyo qaadashada naxariista Eebe mid la mid ah; baqdin la'aan rajo la'aan waxay ku dhici kartaa quus. Quraanku wuxuu ku daray: 'U barya cabsi iyo rajo.'",
      "Isku-dheelitirkani maaha kaliya dareen; waxay u muuqataa ficil ahaan - ilaalinta salaadda, u degdegista towbad keenka, u adeegida dadka kale, xakamaynta cadhada, iyo ku adkaysiga dhibka jacaylka jacaylka uu u qabo kii xukumay.",
    ],
    quran: [
      {
        excerpt: "... Laakin kuwa rumeeyey waxaa ka xoog badan jacaylka Alle.",
      },
      {
        excerpt:
          "... una barya cabsi iyo rajo. Naxariista Eebe way u dhawdahay kuwa samafalayaasha ah.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Rajo iyo Towbad keen",
    summary:
      "Ma jiro dembi aad uga weyn towbad keenka dhabta ah iyo rajo siinta naxariista ballaaran ee Alle.",
    body: [
      "Caqiidada Ahlul-Sunnah ee qeexeysa waa in qofku uusan ka quusan naxariista Alle, si kasta oo uu dembigiisu u weyn yahay, uusanna u dareemin ammaan la xisaabtankiisa, haba badnaadaan camalkooda wanaagsan. Rajada iyo is toosinta labaduba waxay si joogto ah ugu socdaan nolosha rumaystaha.",
      "Martiqaadka Eebbe waa deeqsinimo: ‘Waxaad dhahdaa addoomadeyda ku xad gudbay naftooda ha ka quusanina naxariista Eebbe. Eebbana wuu dhaafaa dambiyada oo dhan. Albaabka towbada (tawbah) wuu furan yahay ilaa qorraxdu ka soo baxdo galbeedka ama qofka geeridiisu soo dhawaato.",
      "Toobadkeenida daacadda ah waxay leedahay shuruudo cad: ka tagista dembiga isla markiiba, dareento qoomamo dhab ah, iyo si adag u xallinta weligeedba - iyo, halka dembigu ku lug leeyahay xuquuqda qof kale, soo celinta xuquuqdaas ama raadinta cafiskooda. Marka kuwaas la kulmo, jawaabta Eebbe ma aha aqbalid oo keliya ee waa farxad: Wuxuu aad ugu farxaa towbada addoonkiisa, marka loo eego nin ka soo kabanaya buurtii luntay iyo sahaydii uu ku helay meel cidlo ah.",
    ],
    quran: [
      {
        excerpt:
          "Waxaad dhahdaa: Addoomadayda ku xad gudbay Naftooda, ha ka quusanina naxariista Eebe. Illeen Eebbe wuu dhaafaa dambiyada oo dhan.",
      },
      {
        excerpt: "Kuwa xaqa rumeeyow u noqda Eebbe towbadkeen toos ah.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Alle ayaa uga farxiya toobada addoonkiisa nin ka lunsan buurtiisa, oo cuntadiisa iyo cabbitaankiisa sita, dhul abaar ah - haddana helo. (Ibnu Mascuud)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Jannada (Jannah)",
    summary: "Jannadu waa abaal-marin waara oo Eebbe u darbay mu’miniinta naxariistiisa.",
    body: [
      "Jannadu waa dhab, waarta, oo ka baxsan wax kasta oo maskaxda bini'aadamku sawiran karto. Rasuulku (scw) wuxuu gaadhsiiyay kalimadii Alle: 'Waxaan u darbay addoommadayda suubban wax aanay ishu arag, dhegtuna aanay maqlin, qalbiguna aanu uuraysan. Abaalkeeda ugu sarreeya ee dhammaan waa raallinimada Eebbe iyo aragtida wajigiisa.",
      "Gelida Jannada ugu dambaynta waa naxariista Eebbe - qof camalkiisu keligiis ma kasban karo nicmo weligeed ah - hase yeeshee iimaanka dhabta ah iyo ficilka xaqa ah ayaa ah macnaha Eebbe magacaabay oo aqbalay. Labadu iskuma hayaan: naxariistu waa sababta, iimaanka iyo camalkuna waa jidkii uu u furay.",
      "Rumaynta Jannada waxay dib u qaabaysaa sida uu qofku hadda u nool yahay: waxay ku kordhisaa samirka dhibka, deeqsinimada iyo ku adkaysiga cibaadada, sababtoo ah mu'minku waxa uu ka ganacsanayaa adduunyo waagaya oo uu u helo guri waara. Qur'aanku waxa uu inagu baaqayaa in aynu u tartanno.",
    ],
    quran: [
      {
        excerpt:
          "Una degdega dambidhaafka Eebihiin iyo Janno ballaadhkeedu yahay sida Samooyinka iyo Dhulka oo loo darbay kuwa dhawrsada.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Eebbe wuxuu yidhi: waxaan u darbay addoommadayda suubban, wax aanay ishu arag, dhegtuna aanay maqlin, qalbi bani-aadmina aanu u malayn. (Abuu Hureyrah; sidoo kale Saxiix Muslim 2824)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Jahannamo (Jahannamo)",
    summary:
      "Jahannama waa digniin dhab ah, oo loogu talagalay in quluubta Alle loogu celiyo ka hor intaysan goori goor tahay.",
    body: [
      "Rumaynta naarta (Jahannama) waa qayb ka mid ah rumaynta waxa maqan iyo xaqa Alle oo qumman. Waa hoyga ciqaabta dhabta ah, oo si cad Qur’aanka iyo Sunnaha loogu sifeeyey si ay dadku khatarta uga qaataan.",
      "Digniintu waxay u adeegtaa ujeedo naxariis leh: waxay u jiraan inay dadka ka ilaaliyaan natiijada ay ku sifeeyaan - si loo hubiyo kibirka, dulmiga, iyo joogtada, og diidmada runta, iyo in la dhaqaajiyo kuwa halmaansan inay toobad keenaan inta albaabku furan yahay.",
      "Ahlu Sunna waxay isku hayaan digniinta iyo naxariista. Hanjabaadu waa dhab iyo dhabba, haddana naxariista Eebe way ku wayntahay ciddii u soo noqota, dadka towxiidka ah, dambiilayaasha gala naarta kuma waari doonaan halkaas weligood ee ugu dambaynta waxaa soo bixin doona naxariista Eebbe iyo shafeeco uu idmo.",
    ],
    quran: [
      {
        excerpt:
          "Kuwa xaqa rumeeyow ka dhawrsada naftiina iyo ehelkiinna naar lagu shido dad iyo dhagax.",
      },
      {
        excerpt: "... Ha ka quusanina naxariista Eebe. Illeen Eebbe wuu dhaafaa dambiyada oo dhan.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qiyaame",
    summary:
      "Dhimashada ka dib, dadka oo dhan waxay soo sara kicin doonaan jidh si ay u hor istaagaan Eebe.",
    body: [
      "Soo sarakicidda (al-bacth) waa jidh ahaan iyo dhab, ee maaha astaan ​​ama tusaale. Eebe wuxuu u jawaabayaa kuwa ka shakiya in lafaha qudhuntay ay dib u noolaan karaan caqli-gal fudud: Kii iyaga ka abuuray waxba markii ugu horreysay ayaa hubaal ah inuu dib u soo celin karo - iyo dib-u-abuurista, fahamkeenna, way ka sahlan tahay asalka.",
      "Dhimashada iyo sarakicidda waxaa u dhexeeya Barzakh - nolosha dhexe ee qabriga, oo leh su'aalo weydiintiisa iyo fududaynteeda ama dhibkeeda. markaasaa suurkii la afuufo, khalqiga oo dhanna waa la sara kiciyaa, waxaana lagu soo kulmin Eebe agtiisa si loo xisaabiyo.",
      "Caqiidadani waa ta nolosha bini aadamka siisa akhlaaqdeeda culus: qiyaamaha la'aanteed, daalimkii si raaxo leh u dhinta iyo kan dulman ee dhinta isagoo gardaran ayaa isku mid ah. Iyada oo laga jawaabayo khalad kasta, wanaag kastana lagu abaal mariyo, taasoo macneheedu yahay samirka iyo caddaaladda.",
    ],
    quran: [
      {
        excerpt:
          "Wuxuu yidhi, Yaa nooleeya lafaha iyagoo qudhunsan? Waxaad dhahdaa, 'Wuxuu noolayn kuwii iyaga abuuray markii ugu horreysay.",
      },
      {
        excerpt:
          "021-048 Saacadduna way iman Shaki la'aan, Eebana wuu soo bixin kuwa Qubuuraha ku sugan.",
      },
    ],
  },
  {
    title: "Maalinta qiyaame",
    summary:
      "Naf kastaa waxay hor istaagtaa Alle; Caddaaladdiisu waa qumman tahay oo dhammaystiran tahay.",
    body: [
      "Maalinta qiyaamaha, qof kasta waxaa lagula xisaabtamayaa - camalka iyo niyada, xuquuqda Alle iyo xuquuqda dadka kale - iyadoo la eegayo caddaalad si sax ah 'nafta laguma dulmin doono', xitaa atamka miisaankiisa.",
      "Maalintaas nasab, maal, dabaqad, dhalasho iyo darajo adduun midna cidna uma anfacdo; Kaliya iimaan dhab ah iyo camal suuban, oo Eebbe aqbalay, ayaa anfici doona. Diiwaanada waa la qaybiyaa, camalka waa la miisaamaa, xitaa gafafka dadka dhexdooda ayaa lagu xalliyaa iyada oo la wareejinayo wanaagga iyo xumaanta.",
      "Hubintan waxaa loola jeedaa in la beddelo dabeecadda hadda: waxay ugu yeertaa mu'miniinta daacadnimada, kalsoonida, ilaalinta xuquuqda dadka kale, hagaajinta khaladaadka iyo soo celinta wixii lagu lahaa ka hor maalinta deynta lagu bixinayo ficil halkii lacag.",
    ],
    quran: [
      {
        excerpt: "Waxaana u yeellay miisaanka Caddaaladda Maalinta Qiyaame, lamana dulmiyo nafna.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Miisaanka iyo Siraad",
    summary:
      "Camalka waxa lagu miisaamaa Mizan, dadkuna waxay ka gudbaan Siraad iimaankooda iyo camalkooda.",
    body: [
      "Ahlu Sunna waxay caddeeyeen Mizan (Miisaanka) iyo Siraad (Briijka Naarta) inay yihiin dhacdooyin dhab ah oo aakhiro ah, oo la rumeysan yahay sida la sheegay. Miisaankana waxaa lagu miisaamaa camalka iyo camalkooda si qumman, Ruuxiise cuslaado miisaankiisu wuxuu gali nolol wanaagsan. Oo kii miisaankiisu fudaydsanna wuxuu magan geli doonaa yaamays.",
      "Siraadku waa buundada ku fidsan Jahannamada oo ay tahay in dhammaan ay dhaafaan. Qur’aanku wuxuu leeyahay, “Cid idinka mid ah ma jiro oon ka gudbi doonin, markaas waxaan korinaynaa kuwa Eebbe dhawrsada. Dadku waxay u tallaabaan siday camalkoodu u kala horreeyaan--qaar waxay u dheereeyaan iftiinka ama dabaysha, qaarna way halgamayaan, qaarna way siibataan - naxariista iyo caddaaladda Eebbe awgeed.",
      "Xaqiiqooyinkan looma sheego in ay cabsi la'aan, laakiin in ay kobciyaan si dhab ah: oo ku saabsan miisaanka camalka yar yar, oo ku saabsan daacadnimada cibaadada, iyo ku saabsan ixtiraamka xuquuqda dadka kale, mar haddii dhammaan la miisaami doono.",
    ],
    quran: [
      {
        excerpt:
          "Ruuxii Miisaankiisu cuslaado wuxuu gali nolol fiican; Laakiin kii miisaankiisu fududaado, magangalkiisu wuxuu ahaan doonaa yaamays.",
      },
      {
        excerpt:
          "Cid idinka mid ah oo idinka mid ah ma jiro isaga mooyee…. Markaasaan korinaynaa kuwa dhawrsada.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "shafeecada (Shafaax)",
    summary: "Shafeecadu waa dhab-laakin idanka Eebe dartiis, ciddii uu raalli ka yahay.",
    body: [
      "Shafeecada (shafaca) maalinta qiyaame waxay si adag u cadaysay Quraanka iyo sunnada. Midda ugu weyn waa saldhigga la ammaanay (al-maqam al-Maxmuud) ee la siiyay Nebi Muxamed ﷺ, marka uu u shafeeco u shafeeco in makhluuqa la soo ururiyey ay xisaabinta billaabaan - wuxuuna u shafeeco qaadi doonaa dadka dembiyada waaweyn ee ummaddiisa ka mid ah.",
      "Laakiin ninna uma duceeyo amarkiisa. shafeeco kasta oo ansax ah waxay ku dhacdaa idankiisa ka dib, waxaana kaliya ee u shafeeco ah cidda Eebbe ka raalli yahay: 'waa kuma kan u shafeeco Eebe idmo mooyee?' Tani waxay ilaalinaysaa gobannimada buuxda ee Eebe ee ku wajahan natiijada.",
      "Culimadu waxay qeexayaan dhowr nooc oo shafeeco ah oo la xaqiijiyay - xisaabtu inay bilaabato, dadka inay Jannada galaan, rumaystayaasha dembiilayaasha ah in la dhaafo ama laga saaro naarta - iyagoo isku raacay in xukunka ugu dambeeya uu had iyo jeer kaligiis yahay Alle.",
    ],
    quran: [
      {
        excerpt: "Waa kuma kan u shafeeco Eebe idankiisa mooyee.",
      },
      {
        excerpt:
          "Maalintaas shafeeco waxba ma anfacdo ruux Eebaha Raxmaan ah u idmo oo uu ka raalli noqdo hadalkiisa mooyee.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dadku way ii iman doonaan, oo anigu Sayidkayga ayaan u sujuudi doonaa; markaas ayaa la odhan doonaa: Madaxaaga kor u qaad, waydiina waa lagu siinayaa, shafeeco oo shafeecadaada waa la aqbalayaa. (Abuu Saciid - shafeecada weyn)",
      },
    ],
    misconceptions: [
      "Fikirka qaldan: shafeecadu waxa ay meesha ka saartaa baahida loo qabo towbad keenka. Sixitaan: Waxay ku timaadaa idanka Alle oo kaliya mana aha shati lagu sii jiro dembiga.",
      "Fikrad khaldan: Mid ayaa laga yaabaa inuu ugu yeedho nebiyada ama kuwa xaqa ah hadda si ay u shafeecaan. Sixitaan: Cibaadada iyo baryada Allaah kaliya ayaa iska leh; shafeeco aakhiro waxay ku sugnaatay qadarkiisa, lana doonayey raalli-gelintiisa.",
      "Fikirka qaldan: shafeecadu waxay khilaafaysaa xaqa Alle. Sixitaan: Waa hal muujin oo naxariistiisa ah oo ku dhex shaqaynaysa caddaaladdiisa qumman, iyo idankiisa oo keliya.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Calaamadaha Maalinta Aakhiro",
    summary:
      "Calaamadaha yaryar iyo kuwa waaweynba waa run; kuwa caqliga leh waxay diiradda saaraan diyaarinta ka badan malo.",
    body: [
      "Qoraalada saxda ah waxay qeexayaan calamadaha ka horreeya saacadda, oo loo qaybiyay calaamado yaryar (badanaa oo ka mid ah kuwa hore u soo baxay, sida soo dirida Nabiga ﷺ laftiisa, fidinta jahliga, iyo hagar la'aanta baahsan) iyo calaamado waaweyn oo dhici doona dhamaadka dhamaadka.",
      "Tobanka calaamadood ee waaweyn waxa lagu wada magacaabay xadiiskii Nebiga ﷺ: waxaa ka mid ah soo bixidda Dajjal, soo dagidkii Nabi Ciise (ina Maryam), soo bixiddii Yacjuuj iyo Maajuuj, saddex dhul go’ay, qiiq, cadceed ka soo baxday oo galbeed ka soo baxday, iyo dab dadka u kaxeeya kulankoodii ugu dambeeyay.",
      "Culimadu mararka qaar waxay ku kala aragti duwan yihiin sida ay u kala horreeyaan calaamadaha qaar, laakiin waxay isku raacsan yihiin laba arrimood: inay saacadda qiyaame iman waa hubaal, waqtigeeda saxda ahna ma oga cid aan Alle ahayn, xataa Nabigu ﷺ ma garanayo markuu Jibriil weydiiyey. Jawaabta nebiyada ee calamadaha sidaas darteed waa mid wax ku ool ah, ma aha mala-awaal: kordhi iimaanka, towbad keenka, cadaalada, iyo camalka faa'iidada leh ee aan dhammaadka lahayn.",
    ],
    quran: [
      {
        excerpt:
          "Waxayna ku waydiin Saacadda (Qiyaame) goorma. Waxaad dhahdaa cilmigeedu waa uun Eebahay agtiisa.",
      },
      {
        excerpt:
          "Miyey sugi inay Qiyaamadu si kado ah ugu timaaddo mooyee. Calaamadihiisu mar hore ayay yimaaddeen.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Saacaddu ma iman doonto ilaa aad aragto toban calaamo oo kala ah: qiiqa, Dajjal, Bahalka, Qorraxda oo galbeed ka soo baxda, soo degidda Nabi Ciise, Yacjuuj iyo Maajuuj, iyo saddex dhul go'ay... (Xudhayfah bin Usayd)",
      },
    ],
    misconceptions: [
      "Fikrad khaldan: Dhacdo kasta oo adduunka ugu weyni waa hubaal calaamad kama dambays ah. Sixitaan: Sheegashooyinka noocaan ah waxay u baahan yihiin caddayn dhab ah iyo taxadar cilmiyeed, ma aha dareen dareen leh.",
      "Fikirka qaldan: Ogaanshaha calaamadaha waxay noo ogolaanaysaa inaan taariikhda ku qorno Saacadda. Sixitaan: Waqtiga saxda ah eebbe ayaa og; Calaamaduhu waxay noogu yeedhaan si aan u diyaargarowno, ma aha inay saadaaliyaan.",
    ],
    appLinks: [{}],
  },
  {
    title: "Aqidah FAQ",
    summary:
      "Su'aalaha caqiidada guud waxay kaga jawaabeen isku dheelitirnaan, caddayn, iyo adab wanaagsan.",
    body: [
      "S: Dhammaan Sunnigu ma isku mid yihiin qodob kasta oo caqiido ah? J: Ahlu Sunna waxay wadaagaan hal aas aas, waxayna si buuxda ugu heshiiyaan waxyaabaha daruuriga ah; Dugsiyada fiqiga ee la aqoonsan yahay (Athari, Ashcari, Maturidi) waxay ku kala duwan yihiin oo keliya hababka farsamada qaarkood, taasna waa in lagu wajaho barasho ixtiraam leh, ee maaha colaad.",
      "S: Miyaan u baahanahay falsafad horumarsan si aan u helo aqidaad sax ah? J: Maya. Qof kasta oo Muslim ah waxaa laga rabaa inuu barto waxyaabaha lagama maarmaanka ah hadba sida ay u baahan yihiin - lixda qodob iyo tawxiidka saafiga ah - iyadoo daraasad qoto dheer ay faa'iido u leedahay macallimiinta aqoonta leh.",
      "S: Aqoonta caqiidadu miyay iga dhigaysaa inaan dadka kale ku adkeysto? J: Maya. Caqiidada wanaagsani waa inay kordhisaa khushuucsanaanta, mahadnaqa, naxariista, iyo hadalka taxadarka leh. Isticmaalka caqiidada si Muslimiinta loo yareeyo ama loogu degdego takfiir lafteeda waa khalad weyn.",
      "S: Waa maxay farqiga u dhexeeya iimaanka, islaamka iyo ixsaan? J: Xadiithka Jibriil, Islaamku waa cibaadada bannaanka ah, iimaanku waa caqiidada gudaha (lixda qodob), Ixsaankuna waa kaamilnimada labadaba — inaad Eebbe u caabuddo sidii adigoo arkaya.",
    ],
    actions: [
      "Mudnaanta sii si cad, oo aasaaska lagu heshiiyey ka hor tafaasiisha farsamo ee lagu muransan yahay.",
      "La tasho aqoonyahannada deegaanka ee aqoonta u leh marka arrin caqiido adagi ay dhab ahaantii saamayso ku-dhaqankaaga.",
    ],
  },
  {
    title: "Tixraacyo iyo Daraasad Dheeraad ah",
    summary:
      "Ku bilow Qur'aanka iyo Sunnada saxda ah, ka dibna la aamini karo caqiidada Sunniga ah.",
    body: [
      "Tixraaca koowaad ee caqiidada had iyo jeer waa Qur'aanka iyo Sunnada saxda ah, oo loo fahmay sida ay u fahmeen asxaabtii iyo culimadii hore ee Ahlu-Sunnah - ma aha in dib loogu akhriyo qoraallada.",
      "Daraasadda faa'iidada leh waxaa ka mid ah aasaasayaasha caqiidada qadiimiga ah ee kooban (sida al-'Aqidah al-Tahawiyya iyo shuqulladii culimadii hore) oo ay bareen sharraxaad ku habboon heerkaaga oo ay bixiyeen macalimiin lagu kalsoonaan karo.",
      "Marka ay culimadu ku kala aragti duwanaadaan qodobbada labaad, u baro daliilka si is-hoosaysiin ah, iskana ilaali in khilaafyada farsamo loo beddelo cadaawad kooxeed - midnimada Mu'miniinta oo ku salaysan waxyaabaha daruuriga ah lafteeda ayaa ah amarka diinta.",
    ],
    disclaimer:
      "Qaybtani waa mid waxbarasho oo aan siyaasad ahayn. Si aad u hesho xukunno shakhsiyeed ama walaacyo caqiido oo xasaasi ah, la tasho aqoonyahanno aqoon leh oo aad ku kalsoon tahay.",
    actions: [
      "Baro hal mowduuc oo caqiido usbuuc kasta macalin ama rukun la aamini karo.",
      "Xifdi lixda qodob ee iimaanka oo awood inaad mid kasta ku sharaxdo erayadaada.",
    ],
    appLinks: [{}, {}, {}],
  },
];

export const AQEDAH_GLOSSARY_SO: DeepPartial<AqeedahGlossaryTerm>[] = [
  {
    term: "Aqidah",
    definition:
      "Caqiidada - waxa uu qofka Muslimka ah ka aaminsan yahay Eebe, Malaa'igtiisa, Kutubtiisa, Rususha, Maalinta aakhiro, iyo qadarka Eebe.",
  },
  {
    term: "Tawxiid",
    definition:
      "Midnimada Alle ee rabbinimada, cibaadada, iyo magacyada / sifaadka - aasaaska Islaamka.",
  },
  {
    term: "Shirki",
    definition:
      "U shariik yeelida Eebbe cibaadada ama sifaadka uu keligii leeyahay – liddi ku ah tawxiidka.",
  },
  {
    term: "Iimaan",
    definition: "Rumaysadka - rumaynta qalbiga, caddaynta carrabka, iyo ficilka addimada.",
  },
  {
    term: "Qadar",
    definition:
      "Eebbana aqoontiisa daa'imka ah iyo qaddarkiisa wax walba - wanaag iyo xumaanba waxay ku jiraan idankiisa iyo xikmaddiisa.",
  },
  {
    term: "Nabi",
    definition:
      "Nabiga - mid helay waxyi oo la faray inuu gudbiyo; laga yaabaa inay raacaan sharci hore.",
  },
  {
    term: "Rasuulku",
    definition: "Rasuul - nebi loo soo diray kitaab ama sharci cusub dadkiisa.",
  },
  {
    term: "Siraad",
    definition:
      "Buundada korkeeda Jahannamo Maalinta qiyaame-- Mu'miniintu waxay isku gudbaan si waafaqsan camalkooda.",
  },
];
