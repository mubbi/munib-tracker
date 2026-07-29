// Somali translation overlay for the Learn "The Last Day" content. Mirrors the order of
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

export const LAST_DAY_TOPICS_SO: DeepPartial<LastDayTopic>[] = [
  {
    title: "Hordhac",
    summary: "Maxay tahay maalinta u dambaysa, maxayse u beddeshaa sida aynu maanta u nool nahay?",
    body: [
      "Yawm al-Qiyaamah - waa maalinta istaagga, qiyaame iyo qiyaamaha - waa maalinta ay naf walba u noqonayso Eebbe si loo tuso camalkeeda, loona siiyo hoygeeda. Ma aha halyey fog ama sawir gabay. Qur'aanku waxa uu ku sheegay bog kasta ku dhawaad, suuradaha Makana ugu horrayn ayaa si sax ah u maamula sababtoo ah rumayntiisa ayaa habaysa nolosha qofka oo dhan. Marka aad si dhab ah u filayso inaad Allaah hor istaagto, daacadnimada, ducada, naxariista iyo xakamaynta jooji inaad noqoto qurxinta ikhtiyaarka ah oo noqo nuxurka qofka aad tahay.",
      "Qaybtani waxay ku socotaa marxaladda safarka marxaladda: dhimashada iyo nafta ee bixitaankeeda, inta u dhaxaysa barzakh ee qabriga, calaamadaha yaryar iyo kuwa waaweyn ee ka horreeya saacadda qiyaame, afuufidda buunka, sarakicidda meydadka, isu imaatinka hal bannaan oo ballaadhan, bixinta diiwaanka, miisaanka, xisaabinta, balli Nabiga iyo iskutallaabta Jannada, labada guri ee Jannada, iyo iskutallaabta Jannada. Jahannamo. Marxalad walba waxaa laga soo qaatay Qur’aanka iyo xadiiska saxiix ah.",
      "Laba mabda' ayaa wax walba xukuma halkan. Ugu horrayn, xaqiiqada dhacdooyinkaas waa la hubaa oo waa arrin caqiido ah (caqiidada); in la diido qiyaamaha ama xisaabtanka waa in la diido diinta lafteeda. Midda labaad, saacadda saxda ah ee saacadda Alle ayaa og – ma jiro caalim, jadwal ama xisaabiye saadaaliya, qof kasta oo la sheegana taariikhda waa been. Rasuulku ﷺ waligiis ma uusan siinin saxaabadiisa xisaab; Wuxuu siiyey hab ay ku noolaadaan. Haddaba ujeeddada barashada maalinta aakhiro waa diyaargarow, ee maaha saadaalin: in qalbiga la jilciyo, la saxo waxa mudnaanta leh, iyo in loo tartan xagga wanaagga ka hor intaanay wakhtiga la cayimin iman.",
      "Qoraal ku saabsan ilaha: 'calaamadaha ugu dambeeya' ee caanka ah wadahadalada waxaa ka buuxa sheekooyin daciif ah oo xitaa la been abuuray. Qeybtaan waxaa ku jira oo kaliya waxa saxda ah, iyo halka culimada sunniga ah ee daacadda ah ay si dhab ah ugu kala duwan yihiin - tusaale ahaan sida ay u kala horreeyaan calaamadaha waaweyn - farqigaas waxaa loo soo bandhigay sida kala duwanaansho, oo aan la sixin ama la buunbuunin.",
    ],
    quran: [
      {
        excerpt:
          "Markii dhulku la gilgilo dhulgariirkii ugu dambeeyay, oo uu soo bixiyo culaabtiisa, oo dadku ay qayliyaan: Maxaa ka jira? - Maalintaas waxay ka warrami warkeeda, maxaa yeelay Eebahaa baa u waxyooday. Maalintaas Dadku way bixi iyagoo koox koox ah si loo tuso camalkooda. sidaas darteed ruuxii sameeya wax atom ah oo khayr ah wuu arki doonaa, ruuxii sameeyana wax xun wuu arki.",
      },
      {
        excerpt:
          "Wuxuuna u waxyoon amarkiisa cidduu doono oo addoommadiisa ka mid ah inuu uga digo maalinta kulanka, maalintay soo bixi, isagoon Eebe ka qarsoonayn wax korkooda ah. Maanta yaa iska leh xukunka? Eebaha kalida ah ee adkaada.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Maxaa loo rumeeyay maalinta aakhiro?",
    summary:
      "Mid ka mid ah lixda qodob ee iimaanka - dhiirigelinta, rajada, iyo caddaaladda ugu dambeysa.",
    body: [
      "Rumaynta maalinta aakhiro waxay ka mid tahay lixda qodob ee uu nebigu ku magacaabay markuu malag Jibriil u yimid inuu diinta baro: in la rumeeyo Eebbe, malaa’igtiisa, kutubtiisa, rusushiisa, maalinta aakhiro, iyo qadarka Ilaahay, khayrkeeda iyo dhibkeeda (Saxiix Muslim 8). Rumayntaas la’aanteed waxaa burbura dhammaan qaab-dhismeedka isla-xisaabtan-waayo, haddii Alle loo soo noqon waayo, daalimkii iyo awliyou isku si bay u dhammaanayaan, cibaado kastana waxay noqotaa caado aan macne sare lahayn.",
      "Quraanku wuxuu ku dooday maalinta aakhiro akhlaaq ahaan iyo caqli ahaanba. Akhlaaq ahaan: waa jawaabta cadaalad darada, waayo adduunyo ay ku dhintaan daalimiintu si raaxo leh oo sariirahooda ku jira, kuwa dulmanna ay u dhintaan iyagoo aan aargoosi lahayn, ma noqon karto mid sheekadu dhammaato haddii Alle run yahay. Caqli ahaan: kan ku abuuray wax aan jirin markii ugu horeysay ma awoodo inuu mar labaad kugu soo celiyo (Qur'aanka 36: 78-79). Qiyaamadu way ka sahlan tahay, ma adka, marka loo eego abuurista asalka ah.",
      "Caqiidadani waxay sidoo kale edbinaysaa labada matoor ee wadnaha - cabsida iyo rajada - waxayna ilaalisaa dheellitirka. Digniintu waa dhab, markaa qofka mu’minka ahi ma kibrin ama iskama fiirsado; haddana naxariista Alle waa weyn tahay, albaabka towbadana wuu furan yahay ilaa geerida, sidaas darteed mu’minku marna ma quusto. Qalbiga cabsi iyo rajo dhexdooda ku nool waa qalbi dadaal badan oo aan jabin.",
      "Dhab ahaantii, maalinta aakhiro waxay siisaa sharaf kuwa aan itaalka lahayn iyo xakamaynta kuwa xoogga leh. Waxay u sheegaysaa kuwa la dulmiyay in aan wax dhaawac ah Eebbe ilaawin, waxayna u sheegaysaa kuwa xoogga leh in aysan jirin xoolo, mansab iyo raad midna aysan ka gabban xisaabtooda. Sidaa darteed rumayntu maaha raaxo gaar ah ee waa isha caddaaladda, dulqaadka iyo daacadnimada adduunkan.",
    ],
    quran: [
      {
        excerpt:
          "Xaqnimadu ma aha inaad u jeedisaan wajigiinna Qorrax iyo Galbeed, laakiin dhawrsada waa ruuxii rumeeyey Eebe, Maalinta Dambe, Malaa'igta, Kitaabka iyo Nabiyada, oo bixiya Xoolo iyo Qaraabada, Agoonta, Masaakiinta, Safarka iyo kuwa warsada.",
      },
      {
        excerpt:
          "Marna ha u malayn in Eebe halmaansan yahay waxay fali daalimiintu. 028-047 wuxuu uun dib u dhigi iyaga maalin ay indhatiraan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Iimaanku waa inaad rumaysataan Eebbe, malaa’igtiisa, kutubtiisa, rusushiisa, maalinta aakhiro, iyo inaad rumaysataan xukunka Eebbe khayrkiisa iyo dhibkiisa. — ka xadiiskii Jibriil, markuu u yimid inuu diinta baro.",
      },
    ],
    actions: [
      "Niyadaada cusboonaysii maalin kasta: camalkaygu wuxuu u sugnaaday Eebbe iyo maalinta aan la kulmi doono.",
      "Markay dulmigu ku xanuujiso oo aanay maxkamad dunidu ka jawaabin, u dhiiba maxkamadda maalinta aakhiro.",
      "Baqdinta iyo rajada wada ilaali - yeyna baqdin kugu burburin rajo-la'aanna yeyna ku caajisin.",
    ],
    appLinks: [{}],
  },
  {
    title: "Geerida",
    summary:
      "Naf kastaa waxay dhadhamin doontaa geerida - husn al-khatimah iyo waxa u anfaca qofka dhintay.",
    body: [
      "Geeridu waa ballan aan cidina seegin. Qur’aanku wuxuu si cad u sheegay: Naf kastaa waxay dhadhaminaysaa Geerida, Ajrigiisana waxaa la bixinayaa oo keliya Maalinta Qiyaame (Qur’an 3:185). Dhimashadu maaha baabi'in ee waa wareejin - naftu waxay ka baxdaa jidhka waxayna u gudubtaa marxaladda xigta ee safarkeeda. Malaa'igta geerida, oo Alle u wakiishay, ayaa nafta qaada, ka dibna xagga Eebahaa ayaa laydiin celinayaa (Qur'aanka 32:11).",
      "Maxaa yeelay, qaabka dhimashadu waa arrin, mu'minku wuxuu u shaqeeyaa xagga dhammaadka wanaagsan - husn al-khatimah - isagoo ka tawbad keenaya toobad dhab ah, duco joogto ah, iyo akhlaaq wanaagsan, isagoo rajeynaya inuu ku dhinto xaalad Alle ka raalli noqday. Dhammaad xun - su' al-Khatimah - waxaa looga baqayaa qofka ku adkaysta dembiga oo ka jeedsada isagoon toobad keenin. Haddana naxariista ku jirta tani waa mid aad u weyn: albaabka tawbah wuu furan yahay ilaa ay dhimashadu ka gaadho dhuunta, markaa qofna yuusan weligii ku soo koobin inay aad u daahday inta ay neeftu hadhayso.",
      "Nebigu ﷺ wuxuu baray xuska dhimashada ee soo noqnoqda - 'Xusuusnow badiyaa kan raaxaysiga baabi'iya, oo macneheedu yahay geerida (Jami' at-Tirmidhi 2307, hasan) - ma aha inay naga dhigaan kuwo jirran laakiin inay naga ilaaliyaan. Xusuusta dhimashadu waxay yaraynaysaa qabsashada adduunkan, waxay baabi'isaa xanaaqa, waxayna dib u habaysaa waxa dhabta ah ee muhiimka ah. Faahfaahinta bixitaanka nafta ee ka muuqda kaliya warbixinnada daciifka ah ayaa ugu fiican in la iska dhaafo; walxaha dhabta ah ayaa ku filan in lagu beero cabsi iyo diyaargarow.",
      "Dhimashadu sidoo kale waxay xirtaa buug-gacmeedka camal - marka laga reebo saddex. Rasuulku (scw) wuxuu yidhi qofku markuu dhinto camalkiisu wuu go’a saddex mooyee: sadaqo joogta ah (sadaqah jariyah), cilmi sii faa’iidayso, iyo ilmo toosan oo u duceeya (Saxiix Muslim 1631). Tani waa mid si qoto dheer loo taaban karo: waxay la macno tahay in waxa aad dhisto, bartid, oo aad koriso intaad nooshahay ay ku sii wadi karaan wax-soosaarkaaga muddo dheer kadib markaad maqan tahay.",
    ],
    quran: [
      {
        excerpt:
          "Naf kastaa waxay dhadhamin Geerida, waxaana laydin dhamayn uun abaalkiinna Maalinta qiyaame. Ee ruuxii Naarta laga fogeeyo oo Jannada la galiyo wuu liibaanay. Nolosha Adduunyana waa uun Raaxo Dhagar.",
      },
      {
        excerpt:
          "Waxaad ku tidhaahdaa: Malaggii Geerida ee laydinku aaminay ayaa idin qaadi; markaas xagga Eebihiin loo soo celin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qofku markuu dhinto camalkiisu wuu dhammaanayaa saddex mooyee: Sadaqo socota, cilmi faa'iido laga helayo, ama ubad suuban oo u barya.",
      },
      {
        excerpt: "Xusuusnow marar badan baabbi'iyaha raaxada - macnaha dhimashada.",
      },
    ],
    actions: [
      "Kordhi istighfarka oo ku tukada wakhtiga - gaar ahaan marka aad caafimaad qabto oo aad mashquul tahay, kaliya maaha marka aad jiran tahay.",
      "Maanta u toobad keena wax kasta oo gaar ah oo aad dib u dhigayso; berri ha ku khamarin.",
      "Maalgeli saddexda camal ee waara: Samee sadaqo joogta ah, faafi cilmi faa'iido leh, ubadkana ku barbaarisa tawxiidka iyo akhlaaqda wanaagsan.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Barzakh (nolosha qabriga)",
    summary: "Inta u dhaxaysa dhimashada ka dib ilaa sarakicidda - su'aalaha iyo cawaaqibkeeda.",
    body: [
      "Barzakh macnaheedu waa xayndaab, waana magaca inta u dhaxaysa dhimashada qofka iyo maalinta qiyaame. Qur'aanku wuxuu adeegsaday ereyga markuu daalimkii dhintay baryay in dib loo celiyo: 'Gadaashooda waxaa ah xijaab (Barzakh) ilaa maalinta la soo bixin' (Qur'aanka 23: 100) - Darbi adag oo nolosha adduun loo soo noqonayn. Haddii mayd la aaso, la gubo, ha la qariyo ama la waayo, naftu waxay gashaa Barzakh; Qabrigu waa qaabkiisa ugu caansan, waana marxaladda koowaad ee aakhiro ee qofkasta oo bini aadamka ah.",
      "Warbixino dhab ah ayaa sharxaya su'aalo aaska ka dib. Labo malag ayaa u yimid oo marxuumka weydiiyey saddex su’aalood: Waa kuma Rabbigaa? Waa maxay diintaadu? Waa kuma ninkan laguu soo diray? Mu’minkii Eebbe sugay wuxuu ku jawaabay: Eebahay waa Eebbe, diintayduna waa Islaam, kanina waa Muxammad ﷺ; qabrigana waa loo waasiciyaa oo loo shidaa. Kii halmaansanay wuxuu dhahaa: 'Ah, ma aqaano', wuxuuna la kulmay cidhiidhi (Jami' at-Tirmidhi 1071, hasan, halkaasoo labada malag lagu kala magacaabo Munkar iyo Naakir). Waana sababta uu Quraanku Eebbe ugu ammaanay inuu ku adkeeyey mu‘miniinta ‘hadal adag nolosha adduun iyo aakhiraba’ (Qur’an 14:27).",
      "Nicmada ama ciqaabtu waxay markaas ku socotaa qabriga, oo ay ku caddeeyeen qoraallo saxiix ah: 'Qabrigu waa beer ka mid ah beeraha Jannada ama god ka mid ah godadka naarta' (Jami' at-Tirmidhi 2460, Xasan Saxiix). Quraanku waxa uu tilmaamayaa cadaabka qoomkii Fircoon ee lagu soo bandhigi lahaa Naarta subax iyo galab ka hor intaanay Qiyaame iman (Qur'aanka 40:46). Ahlu Sunna waxay xaqiijiyaan xaqiiqada abaalgudka qabriga iyo ciqaabta, iyagoo u daaya dabeecadda saxda ah ee Alle, mar haddii ay tahay wax aan la arkayn, oo aanay ogaan karin kuwa nool.",
      "Waxaa la isku raacsan yahay in qabriga la isweyddiiyo iyo nicmada qabriga ama cadaabku ay dhab yihiin; culimadu waxay falanqeeyaan qodobbo fiican - sida inay taabato jidhka, nafta, ama labadaba, iyo sida ay u gaadho kuwa aan qabriga caadiga ah lahayn - iyaga oo aan u oggolaan in su'aalahaas ay ka leexiyaan qodobka. Barzakh waa dhiirigeliyaha ugu weyn: wuxuu ka dhigayaa qabriga godka godka ah muraayad ka mid ah camalkiisa, waxayna caddaynaysaa in waxa aad horay u soo dirto ay tahay waxa halkaas kugu soo salaamaya.",
    ],
    quran: [
      {
        excerpt:
          "Markuu u yimaaddo mid ka mid ah mawdku wuxuu dhahaa: Eebow i celi inaan faliyo waxaan ka tagay. Maya! Waa kelmad uu yidhi; Gadaashoodana waxaa ah xidhid ilaa maalinta la soo bixin.",
      },
      {
        excerpt:
          "Naartana waa loo fidiyaa aroor iyo galabba. (44) Maalinta Qiyaame (Qiyaame) Qiyaame (Qiyaame) kala kulmi gali Fircoon Ehelkiisii ​​Cadaab daran.",
      },
    ],
    hadith: [
      {
        excerpt: "Qabrigu waa beer ka mid ah beeraha Jannada ama god ka mid ah godadka naarta.",
      },
      {
        excerpt:
          "Markii la aasay marxuumka ayaa waxaa u yimid labo malag, markaasay weydiiyeen: waa kuma Rabbigaa? Waa maxay diintaadu? Waa kuma nebigaagu? Mu’minku si dhab ah ayuu ugu jawaabay oo qabrigiisii ​​waa loo waasiciyey oo loo shiday.",
      },
    ],
    misconceptions: [
      "Fikirka qaldan: Ciqaabta qabrigu waa aaminsanaanta dadwaynaha oo aan sal lahayn. Sixitaan: Xaqiiqda su'aasha iyo nicmada qabriga ama cadaabku waxay ku sugan yihiin xadiis saxiix ah oo Qur'aanku tilmaamay; waa meel la dajiyay caqiidada sunniga.",
      "Fikirka qaldan: waa in aan ku doodno muuqaalka saxda ah iyo magacyada malaa'igta. Sixitaan: Magacaabida Munkar iyo Naakir waxay ku soo beegantay warbixin xasan; caqiidada xudunta u ah waa su'aasha lafteeda. U diyaargarowga in si run ah looga jawaabo ayaa aad uga muhiimsan in laga doodo tafaasiilkeeda.",
    ],
    actions: [
      "Hadda ku xaji tawxiidka iyo sunnada - jawaabaha qabriga laguma xafido ee waa ku noolaayeen.",
      "Ilaali aroorta iyo maqribka, taasoo uu Nabigu ﷺ baray ilaalinta iyo adkaysiga.",
    ],
    appLinks: [{}],
  },
  {
    title: "Calaamadaha Maalinta Aakhiro",
    summary: "Calaamadaha yaryar iyo kuwa waaweyn - Hubinta Saacadda, wakhti aan la garanayn.",
    body: [
      "Imaatinka qiyaame waa la hubaa, laakiin waqtigeedu waa sir Eebbe naftiisa ku dhawray. Markii xitaa Nabiga ﷺ la weydiiyay goorta ay imaan doonto, jawaabtii la bixiyay waxay noqotay in kan la weyddiiyey uusan aqoon wax ka badan kan wax weyddiinaya - cilmigeedu waa Allaah agtiisa (Qur'aanka 7:187). Markaa waxa ugu horreeya ee la dejiyo ka hor intaanad baranin 'calaamad' kasta waa tan: calaamado ayaa la bixiyaa si ay noo diyaariyaan, waligaa ha u oggolaan inaan xisaabino taariikhda. Qofkii magacaabay sanad qiyaame wuxuu khilaafay Quraanka.",
      "Culimadu waxay calaamadaha u kala qaybiyaan laba nooc. Calaamadaha yaryar (al-alamat al-sughra) waa isbeddel bulsho, akhlaaq iyo adduun oo si tartiib tartiib ah u dhisma qarniyo dheer ka hor dhammaadka. Calaamadaha waaweyn (al-alamat al-kubra) waa koox dhacdooyin aan caadi ahayn, oo aan la garan karin oo isu soo dhawaada dhammaadka ugu dhow. Qur'aanku wuxuu xusay in 'calaamooyinkiisii ​​qaarkood ay horay u yimaadeen' (Qur'aanka 47:18) - tixraac la fahmay inay ka mid yihiin imaatinka Nabiga ﷺ laftiisa iyo kala go'a dayaxa.",
      "Dulucda calamadaha waaweyn waa xadiiska Xudeyfah ibnu Usayd, ee uu Nabigu ﷺ ku taxay toban: qiiqa (Dukhaan), Dajjal, bahalkii dhulka (Dabbat Al-Ard), qorrax ka soo baxa meeshii ay ku dhacday (galbeedka), ka soo degidii Ciise ibn Maryam, Yacjuuj iyo Majuuj, iyo hal barri ah, iyo hal majuuj (1) Galbeedka, iyo mid Jasiiradda Carabta ah - oo lagu xidhay dab dadka u kaxaynayay goobtii ay ku shirayeen (Sahih Muslim 2901). Al-Mahdi iyo Dajjal waxay ku soo arooreen warar kale oo saxiix ah, waxaana la hordhigayaa soo degitaanka Ciisaha.",
      "Mawqifka cilmiyeed ee daacadda ah ayaa ah in iyada oo calaamad kasta la xaqiijinayo, nidaamkooda saxda ah ma aha mid si buuxda u qeexaya qoraallada, culimada Sunniga ah ee sumcadda leh ayaa ku kala duwan yihiin sida saxda ah. Kala duwanaanshuhu waa qayb caadi ah oo ka mid ah dhaqanka, mana jirto sabab khilaaf. Jawaabta nebiyadu dhammaanteed maaha cabsi-ku-sheeg ama mala-awaal aan dhammaad lahayn oo ku saabsan dhacdooyinka hadda jira, laakiin waa korodhay iimaanka, toobadkeenka, iyo ficil faa'iido leh.",
    ],
    quran: [
      {
        excerpt:
          "Waxayna ku waydiin Saacadda (Qiyaame) goorma. Waxaad dhahdaa cilmigeedu waa uun Eebahay agtiisa. Wax Eebe ka soo hadhayna wax sheegi ma jiro. Waxaa ku cuslan samooyinka iyo dhulka. Kuuma soo degayso si lama filaan ah mooyee.",
      },
      {
        excerpt:
          "Miyey sugi inay Qiyaamadu si kado ah ugu timaaddo mooyee. Astaamihiisii ​​qaar baa mar hore yimi. Sese markuu u yimaaddo loo xusuusto.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Saacadda (Qiyaame) ma imaan doonto intay horteeda ka aragto toban calaamo: qiiqa, Dajjal, Bahal, Qorrax ka soo bax oo galbeed ka yimid, soo degidii Ciise Ibnu Maryama, Yacjuuj iyo Maajuuj, Saddex Dhul-dalool mid Bari, Mid Galbeed iyo Jaziiratul Carab, iyo Midka Jaziiradda Carabta ka mid ah, waxaana ugu dambeeya dab dadka ku kulmin.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Calaamadaha yaryar",
    summary: "Isbeddel tartiib tartiib ah ayuu Nebigu ﷺ ku tilmaamay - u diyaargarowga argagaxa.",
    body: [
      "Calaamadaha yar yar waxaa ka mid ah isbeddelada gaabiska ah ee bulshada dhexdeeda ah, akhlaaqda iyo xaaladda aqooneed ee uu Nebigu ﷺ ku tilmaamay inay kordhinayaan soo dhawaada saacadda. Way badan yihiin, oo dabeecadooda waxay ku soo baxaan wakhti dheer halkii ay hal mar oo riwaayado ah ku jiri lahaayeen. Calaamadda ugu yar ee ugu weyn, dhab ahaantii, waxay horey u dhacday: soo diridii Nebi Muxammad ﷺ laftiisa, oo leh, 'Aniga iyo Saacadda qiyaame waxaa la soo diray sidaan oo kale,' isaga oo isku xiraya labadiisa far - oo macnaheedu yahay rasuulkii ugu dambeeyay iyo da'dii u dambaysay ayaa bilaabatay.",
      "Calaamadaha lagu sheegay xadiithka saxiix ah waxaa ka mid ah: luminta ammaanada, si arrimaha loo dhiibo kuwa aan ku haboonayn - 'Marka la waayo ammaanada, ka dibna sug qiyaamaha, taasna waxay dhacdaa 'marka xukunka la siiyo kuwa aan u qalmin' (Saxiix Al-Bukhaari 6496). Xadiithka caanka ah ee Jibriil, nabigu (scw) wuxuu ku magacaabay laba calaamadood oo muuqda: 'in gabadhu ay dhasho marwadeeda, iyo inaad arki doonto adhijiryo aan kabo-la'aan, qaawan oo caydh ah oo ku tartamaya dhisidda dhismayaal dhaadheer' (Saxiix Muslim 8).",
      "Kuwa kale waxaa ka mid ah dardargelinta guud ee dareenka waqtiga, kororka dhulgariirrada iyo dilka, iyo luminta aqoonta. Cilmiga, nabigu ﷺ wuxuu si sax ah uga hadlay habka: 'Saacaddu ma taagnaan doonto ilaa aqoonta la qaado, dhulgariirkuna bato, waqtigu dhaqso u dhaco, fitnadu u muuqato, dilkuna bato' (Saxiix Al-Bukhaari 1036). Wuxuuna qeexay sida ay cilmigu uga baxdo: \"Ilaahay cilmiga kuma foga inuu dadka ka dhufto, ee wuxuu kaxeeyaa culimo, ilaa aan midna laga tegin, dadkuna waxay ka dhigtaan jaahiliinta madax la warsado oo wax xukunta oo aan cilmi lahayn, markaasay dhumiyaan oo dhumiyaan dadka kale\" (Saxiixul Bukhaari 100). Markaa 'aqoonta luminta' maaha macluumaad yaraan - da'du waxay ku qarqmi kartaa xogta - laakiin waa lumitaanka aqoonyahanno hufan iyo ku-dhaqan nololeed.",
      "Anshaxa muhiimka ah ee halkan: waa tafsiir, lama hubo, in lagu dhawaaqo in dhacdo casri ah oo gaar ah 'ay tahay' xadiis gaar ah oo rumoobay. Tartamada dabaqyada sare ama dambiyada kor u kaca ayaa laga yaabaa in ay ku celceliyaan ereyada Nabiga, laakiin u dhiibista waxyiga ciwaannada si kalsooni leh maaha dariiqa culimada taxadarka leh. Jawaabta saxda ah ee calaamad kasta oo yar waxay ku jirtaa gudaha: u akhri sida loogu yeero u soo noqoshada Alle, si aad u barato oo aad u dhaqanto diinta, iyo inaad ku adkaysato aaminaadda iyo runta - ma aha wax walaac ah ama muuqaal.",
    ],
    hadith: [
      {
        excerpt:
          "Markay lumiso kalsoonida, sug Saacadda (Qiyaame). Waxaa la weydiiyey: Sidee loo luminayaa Rasuul Alloow? Nabiguna wuxuu yidhi: Marka la siiyo xujo kuwaan mutaysanin suga saacadda.",
      },
      {
        excerpt:
          "Waxaa ka mid ah calamadaha qiyaamaha: in gabadhu ay dhasho marwadeeda, oo aad arki doonto adhijirro kabo-la'aan, qaawan oo caydh ah oo ku tartamaya dhismo dhaadheer. - xadiiskii Jibriil.",
      },
      {
        excerpt:
          "Eebbana cilmiga kuma fogeeyo in la duudsiyo, ee wuxuu ku fogeeyaa isagoo culimada kaxaynaya, ilaa aan cidna ka hadhin, dadkuna waxay ka dhigayaan jaahiliinta madax wax xukunta oo aan cilmi lahayn, markaasay dhumiyaan oo dhumiyaan kuwa kale.",
      },
    ],
    disclaimer:
      "Dalbashada calaamado yaryar oo gaar ah dhacdooyinka hadda jira waa tarjumaan, lama hubo. Qaybtani waxa ay soo bandhigaysaa xadiiska saxeexa ah iyada oo aan la caddaynin dhacdooyinka casriga ahi si dhab ah u dhammaystiraan.",
    actions: [
      "Ka raadso aqoon faa'iido leh macalimiin aqoon leh, ku dhaqan oo gudbi - tani waxay si toos ah uga hortagtaa calaamadda aqoonta lumaya.",
      "Ka ilaali aaminnimada iyo runta hadalkaaga, shaqadaada iyo macaamilkaaga.",
      "U akhri calaamad kasta gudaha gudaha sida baaqa towbad keenka, ha ahaan sida dabka argagaxa ama xamaasadda internetka.",
    ],
  },
  {
    title: "Calaamadaha waaweyn",
    summary:
      "Tobanka calaamadood ee ugu waaweyn Saxiix Muslim - Mahdi, Dajjal, Isa, iyo in ka badan.",
    body: [
      "Calaamadaha ugu waaweyni waa dhacdooyinka waaweyn, ee aan la garan karin ee ku urursan dhammaadka wakhtiga. Axdigoodu waa xadiiskii Xudeyfah ibnu Usayd: Nabigu ﷺ wuxuu eegay asxaabtiisa oo ka hadlaya qiyaamaha, wuxuuna yidhi ma imanayso ilaa ay arkaan toban calaamo - qiiqa (Dukhaan), Dajjal, bahalkii dhulka (Dabbat Al-Card), qorrax ka soo baxa oo galbeed ka soo baxa, ciise ibn Maryama, Majuujj, Arab, iyo Yacjuuj (bari) iyo ugu dambayntii dab dadka u kaxeeya oo u kaxeeya goobtii ay ku shirayeen (Saxiix Muslim 2901). Si ka duwan calaamadaha yaryar, marka kuwani bilaabaan waxay si dhow ula socdaan midba midka kale.",
      "Al-Mahdi wuxuu ku soo arooray warbixino dhab ah isagoo ah hoggaamiye caadil ah oo ka yimid qoyska Nebiga (scw) kaasoo dhulka ka buuxin doona caddaalad sidii uu uga buuxsamay dulmiga (Sunan Abi Daawuud 4282, Xasan). Ma aha sharci-dege ama nebi cusub- wuu nooleeyaa, waxna ma hindisaan- rumayntiisana waxaa caddeeyey Ahlu-Sunnah halka tafaasiisha dheeraadka ah ee akhlaaqda daciifka ah la iska fogeeyey.",
      "Dajjal (Masiixgii beenta ahaa) waa tijaabada keliya ee adduunka ugu weyn. Nebigu ﷺ wuxuu ku sifeeyey inuu aad ugu dheeraaday xadiiskii dheeraa ee al-Nawwas ibn Samcaan (Saxiix Muslim 2937): Khaa'in hal il leh oo 'Kafir' ku qoran indhihiisa dhexdooda, siiyey awood uu ku tijaabiyo iimaanka, kaas oo nebi kastaa uga digay dadkiisa. Fitnadiisa laguma jabiyo dood ee waa caqiido sugan, Nabiguna ﷺ wuxuu baray xifdinta aayadaha furitaanka ee Suuratul Kahf si loo ilaaliyo.",
      "Ciise ibn Maryama (cs) ayaa markaa soo degi doona - meel adag oo caqiidada Sunniga ah. Nebigu (scw) wuxuu yidhi: “Ee naftaydu gacantiisa ku jirto waxaan ku dhaartaye ina Maryama wuu soo degi dhexdiina isagoo toosan; wuxuu jabin doonaa iskutallaabta, oo dili doona doofaarka, jizyadana wuu baabi'in doonaa, maalkuna wuu buuxdhaafi doonaa ilaa aan cidina aqbalin' (Saxiixul Bukhaari 3448). Waxa uu soo dago isaga oo raacaya Muxammad ﷺ, waxa uu ku ducaysanayaa imaamka ummadda gadaashiisa (Saxiixul Bukhaari 3439), waxa uu dilay Dajjal, waxa uu ku xukumaa shareecada Muxammad ﷺ. Yacjuuj iyo majuuj waa la soo daayay, calaamooyinka soo harayna waa ay soo baxayaan ilaa naarta dadka soo uruurisa.",
      "Laba qodob oo daacad ah. Marka hore, culimadu waxay isku raacsan yihiin xaqiiqada calaamad kasta oo ku jirta xadiisyada tobanka calamad ah laakiin waxay ku kala duwan yihiin siday u kala horreeyaan, farqigaasina waa xalaal oo waa hore. Midda labaad, Dukhaanku iyo Bahalku waxay ka mid yihiin xadiiskan Saxiixa ah laftiisa; Sheekooyinka kale qaarkood oo si gaar ah u qeexaya way ku kala duwan yihiin xooggooda, sidaas darteed cutubkani wuxuu ku tiirsan yahay rumaysnaanta warbixinta tobanka calaamadood ee xooggan halkii ay ka ahaan lahaayeen kuwa daciifka ah.",
    ],
    hadith: [
      {
        excerpt:
          "Qiyaamadu iman mayso intaad ka aragto toban calaamo: Qiiq, Dajjal, Bahal, Qorrax ka soo bax oo galbeed ka yimid, soo dajintii Ciise ibnu Maryama, Yacjuuj iyo Maajuuj, iyo Saddex Dhul-gariir mid Bari, Mid Galbeed iyo Jaziiradda Carabta dhex taal, Midna waa Jaziirada Carabta, waxaana ugu dambeeya Dab dadka u kaxayn kulmintooda.",
      },
      {
        excerpt:
          "Eebaha ay naftaydu gacantiisa ku jirto waxaan ku dhaartaye inuu idiin soo degi ina Maryama isagoo toosan. Isagu wuxuu jebin doonaa iskutallaabta, oo wuxuu dili doonaa doofaarrada, jizyadana wuu baabbi'in doonaa, oo maalka wuu badnaan doonaa oo ninna kama aqbali doono.",
      },
      {
        excerpt:
          "Hadday dunidan hal maalin ka hadho, Eebbe wuu dheerayn lahaa maalintaas ilaa uu ka soo bixiyo nin reerkayga ah (Mahdi) oo dhulka ka buuxiya caddaalad sidii ay uga buuxsameen dulmi iyo dulmi.",
      },
    ],
    disclaimer:
      "Xaqiiqda calamadaha waaweyn waa la xaqiijiyaa, laakiin sida ay u kala horreeyaan iyo waqtigooda si buuxda uma waafaqsana culimadu. Ka fogow taariikh-dejinta iskana ilaali inaad sheegato qof kasta oo maanta jooga inuu yahay Mahdi, Dajjal, ama Isa.",
    appLinks: [{}],
  },
  {
    title: "Buunka",
    summary: "Israafiil - qarixii koowaad, qarixii labaad, iyo sarakicidda.",
    body: [
      "Marka Eebbe qaddaro cidhibta, waxaa afuufi Malaggii loo wakiishay Suurka (Suur). Magacaabida Israafiil waxay ku imanaysaa dhaqanka culimada; waxa Quraanku si adag u hagaajiyey waa dhacdada lafteeda iyo cabsideeda. Nebigu (scw) wuxuu sheegay sida ay had iyo jeer u dhowdahay: 'Sideen ugu raaxaysanayaa markuu kan buunka sita uu afka saaray, oo foolkiisa foorarsaday, uuna sugayo in amarku afuufo?' - oo markii ay taasi dhibsatay asxaabtii wuxuu baray inay dhahaan, \"Alle ayaa nagu filan, isagaana ugu wanagsan arrimaha\" (Jami' at-Tirmidhi 2431, hasan).",
      "Laba qarax baa jira, Quraankuna wuu kala saaray. Marka hore ‘Suurka waa la afuufi, waxa ku sugan samooyinka iyo dhulkana wuu dhici doonaa isagoo meyd ah cidduu Eebe doono mooyee’ (Qur’aanka 39:68) — argagixinta iyo dhimashada oo dhammaysa amarka la abuuray. Dabadeedna tii labaad ayaa imanaysa: 'Markaasaa haddana la afuufi doonaa, oo kolkiiba way taagnaan doonaan, iyagoo eegaya.",
      "Culumo badan, oo isku aayad ah iyo warbixino taageeraya, waxay ka hadlaan wax ka reeban - kuwa 'kuwa Eebbe doono' ee aan la dhufanin - iyo muddada u dhaxaysa labada qarax, inkastoo dhererkeedu iyo tafaasiilkeedu ay ku xiran yihiin warbixinnada awoodaha kala duwan ee Alle u daayay. Xaqiiqdu waa labada qarax: dhammaad, ka dibna kor u kaca. Tan waxaa loogu yeeraa 'Maalinta Digniinta' (Qur'aanka 50:20) sababtoo ah waa u yeeriddii ugu dambeysay, oo la dhawaaqo marka aysan jirin waqti la isku diyaariyo - waana sababta saxda ah ee ay tahay in hadda looga jawaabo u yeeritaanka.",
    ],
    quran: [
      {
        excerpt:
          "Suurkana waa la afuufi, waxa samooyinka ku sugan iyo waxa Dhulka ku sugani waa dhintay cidduu Eebe doono mooyee. Oo haddana waa la afuufi doonaa, oo markiiba way istaagi doonaan oo fiirin doonaan.",
      },
      {
        excerpt: "Oo buunkana waa la afuufi. Kaasi waa maalintii digniinta.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sideen ugu raaxaystaa markuu kan buunka sita uu afka saaray oo uu foodda foororsaday, oo uu sugayo in la afuufo? Saxaabadii way dhibeen, markaasuu u sheegay inay dhahaan: Alle ayaa nagu filan, isagaana u kheyr badan.",
      },
    ],
  },
  {
    title: "Qiyaame",
    summary: "Jidhka dib loo soo celiyay - caalamnimada istaagida Eebe hortiisa.",
    body: [
      "Qaraxii labaad kuwii dhintay waa la sara kiciyaa, jidh iyo nafba, sarakiciddana waa dhab iyo jidh, ee ma aha oo keliya ruuxa. Qur'aanka kariimka ah wuxuu la kulmay qofka shakiga leh madaxiisa: nin ayaa kor u qaaday laf jaban oo wuxuu waydiiyay yaa wax noolayn kara; Jawaabtu waa, 'Waxaad dhahdaa wuu noolayn kan abuuray markii ugu horreysay, waana wax walba og' (Qur'aanka 36:78-79). Hadday idinka keenin wax aan jirin ay ahayd awoodda Alle, soo celintiina ma dhib badan.",
      "sarakicidda sarakicidda waa mid caalami ah - aadanaha kasta laga bilaabo ugu horreeya ilaa kan ugu dambeeya, oo quruun kasta, waa la sara kiciyaa. Rasuulku ﷺ wuxuu tilmaamay xaaladda ay dadku ku kacaan: 'Dadka waxaa la soo uruurin doonaa iyagoo caga-la'aan, qaawan oo aan gudnayn.' Markii ay Caa’isha weyddiisay in ay rag iyo dumarba is eegi doonaan iyo in kale, waxa uu sheegay in arrintu maalintaas aad u daran tahay oo aanay cidna khusayn (Saxiixul Bukhaari 6527). Wuxuu kaloo yidhi, 'waxaa laydin soo kulmin idinkoo caga-la'aan, qaawan oo aan gudnayn - waxaana ugu horreeya ee labisan doonaa maalinta qiyaame' (Saxiix Al-Bukhaari 3349).",
      "Ujeedka caqiidada ma aha muraayadda ee waa mas'uuliyadda ay fulinayso. Sababtoo ah u soo noqoshada Alle waa la hubaa, ma jiro camal dhab ah oo qarsoon, dhimashaduna run ahaantii waa carar. 'Saacadda Qiyaame way imanaysaa-Shaki kuma jiro-- Eebbana wuu soo noolayn doonaa kuwa Qubuuraha ku jira' (Qur'aanka 22:7). Rumaynta sarakicidda jidhku waa waxa ka dhigaya miisaanka akhlaaqda ee noloshan mid dhab ah oo aan ahayn mid ku meel gaar ah.",
    ],
    quran: [
      {
        excerpt:
          "Wuxuuna noo yeeley tusaale wuuna halmaamay khalqigiisa, wuxuuna yidhi yaa nooleeya lafaha iyagoo burbursan. Waxaad dhahdaa Eebaa noolayn kuwii abuuray markii horaba, Eebana waa oge.",
      },
      {
        excerpt:
          "iyo inay Qiyaamadu iman, shakina kuma jiro, iyo in Eebe soo bixin kuwa qubuuraha ku sugan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Waxaa lagu soo ururin doonaa adigoo caga-cad, qaawan oo buuryoqab ah. Markaasuu yiri: Sidaan ku bilownay abuurkii hore waan ku celinaynaa. Maalinta Qiyaamena waxaa labisan doona Ibraahiim.",
      },
      {
        excerpt:
          "Dadka waxaa lagu soo ururin doonaa caga-la'aan, oo qaawan oo buuryoqab ah. Caa’isha waxay tidhi: Ma ragga iyo dumarka ayaa is eegi doona? Wuxuu yiri: Arrintu aad bay u daran tahay.",
      },
    ],
  },
  {
    title: "Kulanka (Mahshar)",
    summary: "Istaagista Alle hortiisa - qorraxdu waa u dhowdahay, dhididka, iyo xaaladaha dadka.",
    body: [
      "sarakicidda ka dib, uunka oo dhan waxa loo wadaa hal bacaad lagu lisay - Mahshar - si loo sugo xukunka. Dhulka laftiisa ayaa la beddelaa: 'Maalinta dhulka lagu beddeli doono dhul kale, iyo samooyinkana sidoo kale, oo ay ka soo bixi doonaan hortiisa Eebaha kalida ah ee awooda' (Qur'aanka 14:48). Ma jiraan wax calaamado ah, ma jiraan dad badan oo lagu dhuunto, ma jirto xaalad lagu tiirsado - kaliya naf kasta, oo qaawan oo sugaysa.",
      "Xaaladaha taagan ayaa daran. Rasuulku (scw) wuxuu yidhi, “Maalinta qiyaame qorraxdu waa loo soo dhawaynayaa dadka ilaa ay hal mayl u jirto, waxayna u dhididsan doonaan sida camalkoodu yahay, qaar ilaa anqawyada, qaar jilbaha, qaar dhexda, qaarna dhididku wuu xakami doonaa” (Saxiix Muslim 2864). Hase yeeshee isla warbixinnadaas ayaa tilmaamaya naxariista camalka loo qaybiyey: qayb Nabiga ﷺ magacaabay ayaa lagu hadhsan doonaa hooska carshiga Eebbe maalin uusan hadh jirin oon isaga ahayn - waxaa ka mid ah hoggaamiyaha xaqa ah, dhallinyaradii cibaadada lagu koray, iyo mid si qarsoodi ah u bixiyey gacantiisa bidix ma garanayo waxa gacantiisa midig ku bixisay.",
      "Sugitaanku waa dheer yahay - Qur'aanku wuxuu ka hadlayaa 'maalin qiyaaskeedu yahay konton kun oo sano' (Qur'aanka 70: 4) - laakiin dhererkeedu isku mid maaha dhammaan. Warar dhab ah ayaa sheegaya in loo fududayn doono qofka mu’minka ah, iyadoo la kooban yahay inta u dhaxaysa labada salaadood, halka ay dadka kale si weyn u cadaadin doonto. Haddaba Mahshaarku waa halka buug-gacmeedka nolosha ee gaarka ah uu ka noqdo xaqiiqo guud: isku cadceed, isku cad, iyo waayo-aragnimo gebi ahaanba ka duwan, lagana soo qaatay wixii qof kastaa hore u diray.",
    ],
    quran: [
      {
        excerpt:
          "Maalinta Dhulka lagu badalo Dhul kale iyo Samooyinkuna u soo bixi Eebaha kalida ah ee awooda.",
      },
      {
        excerpt:
          "Malaa'igta iyo Malaa'igtu waxay u koraan Maalin qaddarkeedu yahay konton kun oo sano.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qorraxda waxaa loo soo dhawayn dadka maalinta qiyaame intay ka fogaan hal mayl, waxayna u dhididsan sida camal faleen, qaarna anqawgooda, qaarna jilbaha, qaar dhexda ku jira, qaarna dhexda ayuu xakami, dhididkuna wuu xakami.",
      },
    ],
  },
  {
    title: "shafeecada (Shafaax)",
    summary: "Eebe idankiis, noocyada iyo shafeecada ugu wayn.",
    body: [
      "Shafa'ah waa shafeeco - qolo ku hadlaysa magaca qof kale. Waa dhab oo waa naxariis, laakiin marna ma madaxbannaana: qofna wax shafeeco ah ma jiro idankii hore ee Alle mooyee iyo cidduu raalli ka yahay oo keliya. Qur'aanku wuxuu xukunka ku sheegay laba jeer: 'waa kuma kan shafeeci kara idankiisa mooyee? (Qur'aanka 2:255), iyo 'Shafeecadu waxba kuma anfacdo xaggiisa, ruuxuu u idmo mooyee' (Qur'aanka 34:23). Shardigan keliya ayaa ah waxa diinta Islaamka ee shafeecada ka soocaya iyo fasaad kasta oo ka mid ah.",
      "Waxaa ugu weyn al-Shafa'ah al-Udhma, oo u gaar ah Nebi Muxamed ﷺ. Makhshaar, oo ay ku burburtay mawqifkii dheeraa, dadku waxay uga gudbi doonaan nebi ilaa nebi - Aadam, Ibraahim, Muuse, Ciise - mid kastaa wuu cudurdaaranayaa, ilaa ay u yimaadaan Muxammad ﷺ. Wuxuu u sujuudayaa carshiga hoostiisa, waxaana lagu odhanayaa, madaxaaga kor u qaad, waydiina waa lagu siinayaa, shafeeco, shafeecadaadana waa la aqbalayaa (Saxiixul Bukhaari 7440; Silsiladda nabiyada oo dhami waxay ku taal Saxiix Muslim 195). Waxa uu Eebe ku waydiisanayaa inuu bilaabo xisaabinta oo uu u fududeeyo istaagga - saldhig ammaan ah oo loo ballan qaaday isaga oo keliya.",
      "Siyaalo kale oo saxiix ah ayaa raacaya: shafeecada in mu’miniinta qaarkood ay Jannada ku galaan xisaab la’aan; shafeeco darajo sare u qaada; iyo in ka sii badan u shafeecaadda dambiilayaasha waaweyn ee mu’miniinta ah, si dadka looga soo saaro naarta shafeecada Nabiga ﷺ, nabiyada kale, malaa’igta, mu’miniinta, iyo ugu dambaynta naxariista Eebbe oo ah naxariista guud ee naxariista. Nebiyada, shuhadada, kuwa xaqa ah, iyo xataa caruurta yar yar ee dhimatay way ku shafeeco qaadan karaan ogolaansho, inkasta oo awooda warbixinada shakhsi ahaaneed ay kala duwan tahay.",
      "Digniinta lama huraanka ah: shafeecada aakhiro weligeed ma ogola in loogu yeedho kuwa dhintay ama kuwa maqan gargaar hadda. Nebi iyo awliyo lagu baryo qabriga, oo la waydiiyo inay dhibka ka dulqaadaan ama ay baahiyaan, waa in loo toosiyo cibaadada Alle ka sokow - waa shirkiga, waana lidka shaafka lagu tilmaamay, taasoo ah fadli Eebbe maalintaas ku mannaystay cidduu doono. Mana beddeleyso baahida iimaanka iyo towbad keenka noloshan; waa naxariista Alle kuwa nool ee ku dhintay tawxiidka.",
    ],
    quran: [
      {
        excerpt:
          "Waa kuma kan u shafeeco Eebe idankiisa mooyee. Wuxuu ogyahay waxa hortooda ah iyo waxa gadaashooda ah, kuma koobaan cilmigiisa waxaan wuxuu doono mooyee.",
      },
      {
        excerpt: "shafeecaduna waxba kuma anfacdo xaggiisa ruuxuu idmo mooyee.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dadku way ii iman doonaan, waxaanan u sujuudi doonaa Eebbe, waxaana la odhanayaa: Muxammadoow madaxa kor u qaad; weydiiso waa lagu siinayaa, shafeeco oo shafeecadaada waa la aqbalayaa.",
      },
      {
        excerpt:
          "Dadku waxay u tagi Aadam, ka bacdi Ibraahiim, ka dibna Muuse, ka dib Ciise, mid walbana wuu ka cudur daaranayaa, ilaa ay uga yimaadaan Muxammad ﷺ, waxaana la siin shafeeco wayn.",
      },
    ],
    misconceptions: [
      "Fikirka qaldan: Shafeecada oo la raadiyo waxay ka dhigan tahay Nabiga ﷺ ama kuwa xaqa ah ayaa la caabudaa. Sixitaan: Cibaadada waxaa iska leh Allaah kaliya; Shafacada maalinta aakhiro waa naxariis Eebbe idmo ku bixiyo, mana xalaalaynayso in loogu yeedho kuwii dhintay nolosha adduun.",
    ],
  },
  {
    title: "Diiwaanka Camalka",
    summary: "Malaa'igta duubista - gacanta midig, gacanta bidix, waxba laga saaray.",
    body: [
      "Qof kastaa wuxuu leeyahay laba culimmo sharaf leh oo loo xilsaaray inay qoraan camalkooda: 'Markay labada aqbale fadhiistaan ​​midigta iyo bidixda, eray kuma hadlo, laakiin waxaa la jira ilaaliye diyaar u ah inuu wax qoro' (Qur'aanka 50: 17-18). Maalinta aakhiro diiwaanadan waa la bixiyaa, habka loo helo kitaabka laftiisa ayaa ah xukunka ugu horreeya - gacanta midig ee kuwa liibaanay, bidixda ama dhabarka dambe ee kuwa halaagsamay (Qur'aanka 84:7-12; 69:19-37).",
      "Ma jiro wax laga saaray diiwaanadan - ma aha falkii ugu yaraa, ma aha fikirka dagdaga ah ee noqday fal. Waxaana la yaabi kuwii dulmi falay dhammaystiis, waxayna dheheen halaag nagaa ah. Muxuu yahay kitaabkan aan ka tegin wax yar ama weyn oo aan ka ahayn inuu duubay? Waxayna ka heli hortooda waxay falayeen, Eebahaana cidna ma dulmiyo (Quraanka 18:49). Naxariista Eebe awgeed, niyada wanaagsan iyo dembiyada laga tagay waxay sidoo kale ku qoran yihiin fadliga mu'minka.",
      "Maxaa yeelay, carabka iyo addimada waa waxa bogaga buuxiya, ilaalintooda waa ilaalinta diiwaanka. Nebigu (scw) wuxuu carrabka udub dhexaad u ahaa badbaadada: 'Qofkii ii dammaanad qaada waxa u dhexeeya daamankiisa iyo waxa lugihiisa u dhexeeya, waxaan u dammaanad qaadayaa Jannada' (Saxiix al-Bukhaari 6474) - yacni qof kasta oo ilaaliya hadalkiisa iyo dhawrsanaantiisa. Caado maalmeed ee is-eegis daacad ah - weydiinta waxa maanta ku daray buugga - waa mid ka mid ah dhaqamada ugu miyir-qabka iyo faa'iidada badan ee rumaystaha uu haysan karo.",
    ],
    quran: [
      {
        excerpt:
          "Waana la dhigi Kitaabkii, waxaadna arkaysaa Dambiilayaasha oo ka cabsan waxa ku sugan, oy dhaheen halaag nagaa ah. Muxuu yahay kitaabkan aan ka tegin wax yar ama weyn oo aan ka ahayn inuu duubay? Waxayna heli waxay camalfaleen, Eebahaana cidna ma dulmiyo.",
      },
      {
        excerpt:
          "Kii kitaabkiisa midigta laga siiyona wuxuu odhanayaa: Waar bal akhriya kitaabkayga. Waxaan hubay inaan la kulmi doono akoonkayga. Sidaas daraaddeed wuxuu ku jiri doonaa nolol wanaagsan. Laakiin kii kitaabkiisa gacanta bidix laga dhiibo wuxuu odhanayaa: Tolow haddaan kitaabkayga la i siin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qofkii ii dammaanad qaada waxa u dhexeeya daamankiisa iyo waxa lugihiisa u dhexeeya, waxaan u dammaanad qaadayaa Jannada - oo ay ula jeedaan carrabkiisa iyo dhawrsanaantiisa.",
      },
    ],
    actions: [
      "Ka ilaali carrabka in ka badan wax kasta - inta badan waxa buuxiya diiwaanka wanaagga ama buka ayaa dhex mara.",
      "Dib u eeg maalintaada hurdada ka hor: weydii waxa aad rabto, iyo waxa aad ka cabsan lahayd, si aad u aragto oo ku qoran buuggaaga.",
    ],
    appLinks: [{}],
  },
  {
    title: "Miisaanka (Mizan)",
    summary:
      "Camalku waa la miisaamay - daacadnimada, dabeecadda, iyo dhikrigu waxay ka dhigaan miisaan culus.",
    body: [
      "Mizaanku waa Miisaanka Camalka lagu miisaamo si cadaalad ah: 'Waxaan u yeeleynaa Miisanka Caddaaladda Maalinta Qiyaame, lamana Dulmiyo Nafna; xataa hadday miisaankeedu tahay iniin khardal ah, waan soo bixinaynaa, waxaana ku filan xisaabiye (Qur'aanka 21:47). Ahlu al-Sunnah waxay caddeeyeen inay tahay dheellitirnaan dhab ah, ee ma aha tusaale - camal ama diiwaankooda, si dhab ah ayaa loo miisaamay. Qofkii digsigeedii bay ku rogmataa, kii miisaankiisu cuslaado, wuxuu ahaan doonaa nolol raalli ah; Laakin kan miisankiisu fudaydsan yahay, magangalkiisu wuxuu noqon doonaa god dheer. (Quraan 101:6–9).",
      "Waxa miisaanka ka dhigaya mid culus ma aha mugga hawl-qabadka ee waa miisaankiisa Eebbe hortiisa - miisaankuna wuxuu ka yimaadaa daacadnimo. Rasuulku ﷺ wuxuu tilmaamay camalka aan tacabka lahayn ee baaxadda leh: 'Laba kelmadood oo carrabka u fudud, miisaankana ku culus, ee loo jecelyahay Raxmaanka: SubxaanAllahi wa bihamdih, SubhanAllahil-Cazim' (Sahih al-Bukhaari 6406). Waxa kale oo uu yidhi, 'Ma jiro wax ka culus miisaanka qofka mu'minka ah maalinta qiyaame' (Jami' at-Tirmidhi 2002, Saxiix). Markaa xusuus fudud oo si daacad ah loo soo celceliyo, ama hab-dhaqanka wanaagsan ee dulqaadka leh, ayaa ka miisaan badnaan kara buuraha firfircoonida leh.",
      "Dhanka kale waa khatarta falalka godan. Ficilada la sameeyo si ay dadku u arkaan (riya') ama ay u kharribaan munaafaqadu waxay ku iman karaan Miisaanka aan miisaan lahayn - bannaanka weyn, gudaha oo madhan. Sidaa darteed daacadnimadu (ikhlaas) maaha mid ka mid ah kuwa badan oo ku jira laakiin waa shayga siiya camal kasta oo kale miisaankiisa. Casharku waa in la dhiso maalinta ku wareegsan ficillo yaryar, daacad ah, joogto ah, iyo in la nadiifiyo ujeedada ka dambeysa kuwa muuqda.",
    ],
    quran: [
      {
        excerpt:
          "Waxaana u yeellay miisaanka xaqa maalinta qiyaame, lamana dulmiyo nafna. Haddayse miisaankeedu tahay iniin khardal ah waan soo bixin, waxaana ku filan xisaabiye.",
      },
      {
        excerpt:
          "Ruuxii Miisaankiisu Cuslaado wuxuu gali nolol Raalli ah. Laakiin midkii miisaankiisu fudaydsan lahaa, magangalkiisu wuxuu ahaan doonaa bohoma.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Laba kelmadood oo carrabka ku fudud, kuna culus Miisaanka, la jecel yahay Raxmaanka: SubxaanAllahi wa bihamdih, SubhanAllahil-cazim.",
      },
      {
        excerpt:
          "Ma jiro wax ka culus miisaanka qofka mu’minka ah maalinta qiyaame oo aan ahayn dabeecadda wanaagsan. Illeen qofka akhlaaqda wanaagsan wuxuu ku gaadhaa darajada qofka sooman oo tukada.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Xisaabtanka (Hisab)",
    summary: "Xisaabin fudud, xisaabin tafatiran, iyo xuquuqaha lagu leeyahay kuwa kale.",
    body: [
      "Hisabku waa xisaabinta, marka qof walba loogu yeero in lagula xisaabtamo noloshiisa. Qur’aanku wuxuu qeexayaa laba dhacdo oo aad u kala duwan: Ruuxiise Kitaabkiisa midigta laga siiyo waxaa lagu xukumi xisaab fudud, wuxuuna u noqon doonaa qoomkiisii ​​isagoo faraxsan; Laakiin mid dhabarka laga siiyo qoraalkiisa wuxuu u yeedhi doonaa halaag (Qur'aanka 84:7-11). 'Akoonka fudud' waa naxariis, ma aha imtixaan la'aan - Nebigu ﷺ wuxuu ka digay in xoojinta su'aalaha laftiisa ay tahay nooc ciqaab ah.",
      "Nabiga ﷺ naagtiisa ayaa ka sheekaynaysa faraqa muhiimka ah. Caa'isha waxay ka warantay isagoo leh, 'Ruuxii loo yeedho waa la halaagi.' Waxay tidhi: Laakiin miyaanu Eebbe odhan, 'waxaa lagu xukumayaa xisaab fudud'? Wuxuu ugu jawaabay, Kaasi waa uun soo bandhigida camalka; laakiin qofkii xisaabtiisa wax lagu weydiiyo waa la halaagay” (Saxiixul Bukhaari 6537). Haddaba mu'minka rajadiisu maaha inuu ka baxsado dhammaan baaritaannada laakiin waa in la tuso camalkiisa, oo dembigiisa la daboolo, oo la cafiyo - halkii ay ahayd in shayga la isku weyddiiyo.",
      "Waxaa jirta qeyb deyn ah oo xitaa cafiska Alle uusan si fudud u tirtirin: xuquuqda dadka kale (xuquq al-icbaad). Nabigu ﷺ wuxuu weydiiyey, 'ma garanaysaa cidda musalaftay?' Waxay yiraahdeen: Mid aan lacag lahayn. Wuxuu yidhi: “Ummadaydu waa ka faalisay, waa mid ku yimaadda maalinta qiyaame salaad, soon iyo samo-fal, laakiin kan caytamay, middaas caytamay, oo maal mid kale qaatay, oo dhiigga qof kale daadiyey, markaas ayaa camalkiisii ​​wanaagsanaa loo gacan geliyaa, markuu wanaaggiisa dhammaadana dembigoodu waa la raran yahay, oo naarta lagu dhex tuuraa.” (258). Cibaadadu ma tirtirto caddaalad-darrada; oo kaliya in la dejiyo xaqdarrada.",
      "Gabagabada dhabta ah waa mid degdeg ah oo gaar ah: deymaha aan la bixin, hantida la xado, cayda, iyo aaminaadda la jabiyay waa in lagu toosiyaa noloshan - iyada oo loo toobad keenayo Allaah iyo magdhow iyo raaligelinta dadka - sababtoo ah aad bay uga jaban tahay in lagu dejiyo lacag lacag ah iyo khushuuc hadda marka loo eego lacagta camalka wanaagsan ee waagaas. Intaas oo dhanna Alle cadaaladiisu waa taam, naxariistiisuna waxay koobaysaa qof kasta oo u halgamay si dhab ah oo toobad keenay.",
    ],
    quran: [
      {
        excerpt:
          "Ruuxiise kitaabkiisa midigta laga siiyo waxaa lagu xukumi xisaab fudud, wuxuuna u noqon doonaa qoomkiisii ​​isagoo faraxsan. Ruuxii kitaabkiisa laga siiyo gadaashiisa wuu qaylyi halaag, wuxuuna gali Naci.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ciddii la xisaabtantaa waa la halaagay. Caa’isha waxay tidhi: Miyaanu Eebbe odhan, waxaa lagu xukumayaa xisaab fudud? Wuxuu yidhi: Kaasi waa uun soo bandhigida camalka; Laakiin ku alla kii la weyddiiyo aawadiis waa la baabbi'in doonaa.",
      },
      {
        excerpt:
          "Ma garanaysaa cidda musalaftay? Waa kan la yimaadda Maalinta Qiyaame Salaad, Soon iyo Sadaqo, hase-ahaatee wax caaya, wax ka sheega, oo dulmiyey, markaasaa la siin camalkiisii ​​wanaagsanaa, marka ay dhammaystaanna dambigooda la saaro oo naarta lagu tuuro.",
      },
    ],
    actions: [
      "Deymaha daymaha oo soo celi wax alla wixii xaqdarro lagu qaatay, haba yaraatee, ka hor intaanay iman maalinta la ballamay.",
      "Raali noqo qof kasta oo aad ku xad gudubtay hadal, maal ama sharaf - dib u celintu hadda aad bay uga jaban tahay dib u celintii markaas.",
      "U toobad keen Eebbe xaqa uu ku leeyahay, oo kala caddeeya labada hage- rabbaani iyo mid bani-aadmiba.",
    ],
    appLinks: [{}],
  },
  {
    title: "Balliga (Hawd)",
    summary: "Basinka Nabiga ﷺ - yaa cabba iyo yaa dib u celinaya.",
    body: [
      "Hawdku waa berkedda weyn ee la siiyey Nebi Muxamed ﷺ maalinta qiyaame, waana naxariis uu umaddiisa u oomanaa maalintaas kulul ee daalka badan. Sifooyinkiisu aad bay u tiro badan yihiin oo xaqiiq ah: 'Hawdkaygu waa safar bil ah; biyaheedu caano ka cad yihiin, oo udgoonkooduna waa ka udgoonsan yihiin miski, koobabkeeduna waa sida xiddigaha cirka oo kale. Qofkii ka cabba ma harraadi doono mar dambe” (Saxiixul Bukhaari 6579). Rumaynta Hawdku waa qayb ka mid ah caqiidada Sunniga, oo ay dejiyeen warbixinno la isugu gudbiyo.",
      "Nabiga ﷺ laftiisu wuxuu halkaas ku qaabili doonaa xertiisa: 'Waxaan gaari doonaa Hawdka idinka horreeya, waxaana ilaalin doona kuwa ii yimaada' (Saxiix Muslim 2292). Wuxuu umaddiisa ku gartay iftiinka wejigooda, gacmaha iyo cagaha ka muuqda raadadka wuduuga. Si loo gaadho waa in weligeed la demiyo; waxaa lagu quudiyaa, fahamka wanaagsan, al-Kawthar, webiga Alle wuxuu Nebigiisa ﷺ ku siiyay Jannada.",
      "Haddana qaar Hawdka laga eryi doono. Nebigu ﷺ wuxuu tilmaamay in dadka qaar loogu sheegay, 'Iyagu idinka mid ma aha; way badaleen oo idinka gadaashii diinta doorteen ama u jeesteen gadaashiis. Culimadu way ka taxaddaraan arrintan: waxay tilmaamaysaa qaybo gaar ah oo xadiithka ku jira - sida riddada iyo qabriga, bini'aadanimada ula kac ah ee diinta ka dib hanuun cad - iyo si cad maahan shati in Muslimiinta caadiga ah ay isku tuuraan. Waddada nabad gelyada ah ee Hawdka loo maro waa in la sugo sunnaha, la dhawro wudiga iyo salaadda, lana ilaaliyo midnimada mu’miniinta.",
    ],
    hadith: [
      {
        excerpt:
          "Hawdkaygu waa safar bil ah. Biyuhu caano way ka cad yihiin, oo udgoonkoodu waa ka udgoon yihiin miski, koobabkeeduna waxay u badan yihiin sida xiddigaha cirka. Ku alla kii ka cabba mar dambe ma harraadi doono.",
      },
      {
        excerpt:
          "Hawdka idinka horreeyaan gaadhi doonaa, kuwiinna ii yimaadana waan dhawri doonaa. Ragga qaar baa la iga qaadi doona, waxaanan ku idhi: Eebow asxaabtayda! Waxaana lagu odhan: ma garanaysaan waxay beeniyeen idinka gadaashiis.",
      },
    ],
    disclaimer:
      "Warbixinnada ku saabsan kuwa Hawdka ka leexday waxay tilmaamayaan qaybo gaar ah oo xadiithka lagu sheegay, oo ay ugu horreyso riddnimada iyo wax cusub oo diinta ku cusub. Uma aha shati ay Muslimiintu isku caddeeyaan inay baadi yihiin.",
  },
  {
    title: "Buundada (Sirat)",
    summary: "Ka gudubka Jahannamo - xawaaraha sida camalka iyo naxariista.",
    body: [
      "Siraadku waa buundada ku fidsan korkeeda jahannamo, qof kastana waa inuu ka tagaa, mu‘min iyo gaalba. Qur’aanku waxa uu caddeeyey in la goynayo iyada oo aan laga reebo: ‘Ma jiro mid idinka mid ah oo aan ahayn in uu u yimaado. Kaasi waa u sugnaaday Eebahaa wax lama huraan ah. Markaasaan korinaynaa kuwii Eebbe dhawrsaday, waxaana kaga tagaynaa dhexdeeda daalimiinta iyagoo jilba joogsan.” (Qur’an 19:71-72). Marku waa caalami; si badbaado leh oo dhanka fog laga gaaro waa arrinka oo dhan, waxaana ugu deeqay Alle kuwa uu ilaaliyo.",
      "Habka gudniinka waxaa dejiya camalka qofku keeno. Nebigu (scw) wuxuu ku sifeeyay: “Briijka waxaa la dul dhigi doonaa naarta, oo midkiin u horreeyaa wuxuu mari doonaa sida hillaac, ka dibna sida dabaysha, ka dibna sida shimbiraha, ka dibna sida nin ordaaya - sida camalkoodu yahay - iyadoo Nebiguna uu dul taagan yahay buundada isagoo leh: Rabbiyow dhawri oo dhawr. Qaar waa la badbaadiyaa oo aan waxba la yeelin, qaar waa la xagtaa oo la sii daayaa, qaarna waxaa lagu tuuraa naarta.” (Saxiixul Bukhaari 6573). Buundada agteeda, isla warbixintaas, istaag kalsoonida (amanah) iyo xidhiidhka qaraabada - muuqaal cajiib ah oo ah in aaminnimada aaminaadda iyo isku xidhka qoyska ay dhab ahaantii qofka la socoto.",
      "Iftiinka iyo xawaaraha Siraad ayaa lagu kasbaday noloshan. Salaadda oo waqtigeeda la guto, sadaqo la joogteeyo, daacadnimada la macaamilka iyo akhlaaqda wanaagsani waxay noqotaa, sal iyo iftiin uu qofku ka gudbo. Nebigu ﷺ wuu u shafeeco qaadayaa mu’miniinta halkaas ku sugan, waana naxariista Eebbe in qof kastaa dhankiisa kale gaaro haba yaraatee.",
      "Sida saldhigyada kale ee aan la arki karin, koorsada xigmadda leh maaha in la qiyaaso cabbirka jireed ee buundada - sida khafiifka ah, sida fiiqan, intee in le'eg - ka baxsan waxa muujinta sheegay, laakiin in diiradda la saaro gebi ahaanba ficillada ka dhigaya iftiinka isgoyska. Wixii aadan sawiran karin, weli waad isku diyaarin kartaa.",
    ],
    quran: [
      {
        excerpt:
          "Midkiinna ma jiro in uu u yimaado mooyee. Kaasi waa u sugnaaday Eebahaa wax lama huraan ah. Markaasaan korinaynaa kuwii Eebe ka dhawrsaday, waxaana kaga tagi daalimiinta dhexdeeda iyagoo jilba joogsan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Buundada waxaa la dul dhigi doonaa Jahannamo, waxaana noqon doona qofka ugu horreeya ee ka tallaaba. Oo dadku waxay u dul mari doonaan siday falimahooda yihiin, sida hillaaca, iyo sida dabaysha, iyo sida shimbiraha, iyo sida nin ordaya, oo anna waxaan leeyahay, Rabbiyow, dhawr, oo dhawr. Qaar waa la badbaadaa, qaar waa la xagtaa oo la sii daayaa, qaarna waxay ku dhacaan Naarta.",
      },
    ],
    actions: [
      "Ku tukada shanta salaadood wakhtigeeda - salaadu waa iftiinka hogaaminaya buundada.",
      "Si joogto ah u bixi sadaqada, xitaa qadar yar.",
      "Xidhiidhka qaraabada ilaali oo ilaaliso ammaanadaada - xadiithka waxay taagan yihiin Siraad lafteeda.",
    ],
  },
  {
    title: "Jannada",
    summary:
      "Abaalmarinta weligeed ah - farxaddeeda iyo, wax kasta oo ka sarreeya, oo aragnimada Eebe.",
    body: [
      "Jannadu waa guriga daa’imka ah ee Alle u darbay mu’miniinta, waa xaqiiqo ka baxsan male awaalka. Xadiis xurmo leh ayuu Nebigu (scw) ka wariyey in Eebbe ka yidhi: “Waxaan u darbay addoommadayda suubban, wax aanay il ahu arag, dhegna ayan maqal, oo aanu qalbi bini-aadmi wax uuraysan” (Saxiixul Bukhaari 3244). Wabiyadeeda, beeraheega, daaraha waaweyn iyo wehelka waxa lagu tilmaamay Qur’aanka kariimka ah si ay u soo jiitaan qalbiga, laakiin tilmaanta ayaa tilmaamaysa farxad si buuxda uga sareysa.",
      "Ajarkeeda waxaa ugu wayn beer iyo wabi toona ee waa raali ahaanshiyaha Alle iyo aragtida wajigiisa. \"Maalintaas waxaa soo bixi wajiyayaal oo soo ifixi doona xagga Eebahood\" (Qur'aanka 75:22-23) - Waxay u fahmeen Ahlul-Sunnah sida ay u fahmeen Mu'miniinta oo eegaya Eebbe aakhiro, oo ah nicmada jannada, oo la siiyay si ku habboon sharaftiisa oo aan la mid ahayn abuurista. Eebe wuxuu ballan qaaday: 'Kuwa wanaagga falay waxaa u sugnaaday ajir wanaagsan iyo wax ka badan' (Qur'aanka 10:26) - iyo 'ka badan' ayaa lagu sharaxay xadiiska saxiix ah sida aragtidan wajigiisa sharafta leh.",
      "Gelida Jannada waa naxariista Eebbe, waxaana lagu qaabilaa iimaan iyo camal suuban--labadaba lama diidana: naxariistu waa sababta, camalkuna waa calaamadda iyo macnaha Eebbe ku xidhay. Maalinta aakhiro waxay ku dhamaataa ehlu-Janno nicmo aan dhammaanayn oo aan dhammaanayn. Qaybtani waxa ay si kooban ula kacday daawaynta Jannada; Safarka Jannada oo dhammaystiran waxa uu daboolayaa irridihiisa, darajooyinkeeda, camalka u horseedaya, iyo ducada si qoto-dheer.",
    ],
    quran: [
      {
        excerpt:
          "Una degdega dambidhaafka Eebihiin iyo Janno ballaadhkeedu yahay sida samooyinka iyo dhulka oo loo darbay kuwa dhawrsada.",
      },
      {
        excerpt: "Wajiyaal Maalintaas way Nurayaan iyagoo Eebahood u jeeda.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Eebbe wuxuu yidhi: Waxaan u darbay addoommadayda suubban, wax aanay il ahu arag, dhegna ayan maqal, iyo wax aanu qalbiga bini-aadamku ku fakarin.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Jahannamo",
    summary: "Digniinta runta ah - ciqaabta dhabta ah, iyo albaabka baxsadka inta nool.",
    body: [
      "Jahannama waa hoyga ciqaabta dhabta ah, ma aha calaamad ama tusaale u ah xaalad maskaxeed oo xun. Rumayntiisu waa qayb ka mid ah rumaynta waxa maqan iyo xaqa Alle. Quraanku wuxuu si cad ugu digay: 'Kuwii ka gaaloobay Eebahood waxaa u sugnaaday cadaabka Jahannamo, meel loo ahaana iyadaa u xun' (Qur'aanka 67:6). Darrankeeda waxaa lagu tilmaamay in la tooso, oo aan lagu qancin xiisaha: 'Naar lagu shido dad iyo dhagxaan' (Qur'aanka 2:24), oo ay ilaalinayaan malaa'ig adag oo aan ku caasin Eebe wuxuu amrayo.",
      "Ujeeddada digniinahaas laga leeyahay waa naxariis qarsoon. Waxay u jiraan inay kibir jebiyaan, oo ay joojiyaan diidmada runta ah ee joogtada ah, iyo inay qofka dib u celiyaan intaanay goor dambe dhicin. Taasi waa sababta digniinaha Qur'aanku ay had iyo jeer ku lammaan yihiin albaabka towbada ee furan - ujeeddada tilmaamaya naarta waa si sax ah si dadku uga fogaadaan intay weli awoodaan. Cadaabkeeduna waa xaq, mana galo Jannada waxaan ahayn waxay ka doorteen hanuun cad, Eebbana ma dulmiyo cidna.",
      "Mu'miniinta dembiyada xanbaarsan, caqiidada sunniga ah ee suuban waxay u tahay dheellitirka cabsida iyo rajada: dembiiluhu wuxuu ku hoos jiraa doonista Eebbe - wuxuu u dambi dhaafi karaa, ama wuxuu ku daahirin karaa naarta ka dibna, shafeecada iyo naxariista ee hore loo soo sheegay, wuxuu ka soo saarayaa qof kasta oo lahaa xitaa atom ee iimaanka. Qaybtani waxa ay siinaysaa Jahannamo si ula kac ah oo kooban oo daaweyn loo cabbiray. Daraasadda buuxda ee digniinteeda, dembiyada waaweyn, iyo albaabbada toobadda iyo naxariista ballaadhan waxa laga helayaa Fahamka Jahannam moduleka iyo mawduucyada caqiidada ee la xidhiidha - oo had iyo jeer lala yimaado rajo, marna rajo beel.",
    ],
    quran: [
      {
        excerpt:
          "Kuwa ka gaaloobay Eebahood waxaa u sugnaaday cadaabka Jahannamo, meel loo ahaana iyadaa u xun.",
      },
      {
        excerpt:
          "Waxaad dhahdaa: Addoomadayda ku xad gudbay Naftooda, ha ka quusanina naxariista Eebe. Illeen Eebbe wuu dhaafaa dambiyada oo dhan. Eebana waa dambi dhaafe Naxariista.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yaa soo gala xisaab la'aan?",
    summary:
      "Xadiis saxiix ah oo ku saabsan kuwa hareer maray hisab si faahfaahsan - dood cilmiyeed.",
    body: [
      "Raxmada maalinta aakhiro waxaa ka mid ah in koox ummaddan ka mid ah ay jannada galaan iyagoon xisaab lahayn. Nebigu ﷺ wuxuu yidhi, 'Toddobaatan kun oo ummaddayda ka mid ah waxay gelayaan Jannada xisaab la'aan, iyo eray kale, 'kunkiiba toddobaatan kun oo kale'. Markay asxaabtu is waydiiyeen cidday yihiin, wuxuu ku sifeeyey:- Waa kuwa aan ruqya-doonin dadka kale, aan rumayn xumaanta, aan ka warhayn, Eebahoodna tala saarta (Saxiixul Bukhaari 6541).",
      "Qalbiga tilmaantaa waa tawakkul - qoto dheer, talo saarasho firfircoon oo Alle - oo ay weheliso xornimada khuraafaadka iyo ku tiirsanaanta welwelka ee sababaha. Ma cambaaraynayso raadinta daawaynta la oggol yahay; ruqya oo la isku akhriyo iyo dawo xalaal ah labaduba waxay ku sugan yihiin sunnada. Waxa lagu ammaano qofka talasaartiisu dhammaanteed Eebbe korkiisa tahay oo aan ku dawaafsanaynin dawarsiga ruuxiga ah ama ku dheggan calaamadaha.",
      "Culimadu waxay ka hadlayaan tirada lafteeda: qaar waxay qabaan in todobaatanka kun ay dhab tahay, qaar kalena si weyn baa loogu dhuftey warbixinnada dheeraadka ah, qaar kalena waxay weli muujinayaan nimcada Alle oo badan oo aan la qiyaasi karin, halkii ay ka ahaan lahayd madax go'an. Waxa ay ku heshiiyaan waa runta hoose - in naxariista Eebe aad uga badan tahay waxa ay filanayaan xisaab-hayntu, iyo in badbaadada ugu dambeysa ay tahay naxariista.",
      "Tani waa saldhig rajo, maaha daldalool caajisnimo. Waxay u waxyoonaysaa qofka mu’minka ah inuu si dhab ah Alle u talo saaro, ugana fogaado khuraafaadka, isagoo weli ku dadaalaya cibaadada. Qofna kuma kasbado inuu dayaco camalka; qofka waxaa u soo jiitay daacadnimo, kalsooni, iyo qalbi ku xiran Alle oo aan ka ahayn soo jiidashada iyo cabsida.",
    ],
    hadith: [
      {
        excerpt:
          "70 kun ummata keenyaa jaarmummaa jalqabaa jiru: waa kan aangoo ruqqaa ta’uu, rakkoon adda addaa akka ta’e ibsaniiru.",
      },
    ],
    disclaimer:
      "Culimadu waxay ku kala duwan yihiin in ' xisaab la'aan' ay ka dhigan tahay toddobaatan kun oo go'an ama ka badan oo aan la qiyaasi karin. Dhammaan waxay isku raacsan yihiin in badbaadada ugu dambeysa ay tahay naxariista Alle, taasina ay tahay sabab rajo, ee aysan ahayn mid la dayaco camalka.",
  },
  {
    title: "U diyaar garowga Maalinta Aakhiro",
    summary: "Cibaadada wax ku oolka ah - ku xidh caado kasta iyo la kulankaaga Alle.",
    body: [
      "Kadib socodka safarka oo dhan - dhimashada, qabriga, calamadaha, buunka, isu imaatinka, diiwaanada, Miisaanka, xisaabinta, Buundada, iyo labada guri - jawaabta kaliya ee miyir qabta waa in la diyaariyo. Laakiin diyaargarow ma aha argagax. Nebigu ﷺ waligiis kama tegin asxaabtiisa baqdin iyo curyaan; wuu ka tagay iyaga oo shaqaynaya. Aas aaskeeda oo dhan waa tawxiid iyo daacadnimo (ikhlaas): Camalka waxaa la aqbalaa oo kaliya marka loo sameeyo Alle kaligiis oo la waafajiyo sunnada, haddaba intaadan ku darin camalka badan, nadiifi niyada ka dambeeya kuwa aad horey u heysatay.",
      "Ku dhis maalinta tiirarka dushooda qoraallada lagu cusleeyay Miisaanka. Saalax waqtigu waa barroosinka iyo iftiinka Siraad. Qur'aanka - oo la akhriyo, la maqlo, oo laga fiirsado, xitaa dhawr aayadood maalin kasta - wuxuu ilaaliyaa qalbiga. Tawbah waxay nadiifisaa diiwaanka: 'Mu'miniintay, u noqda Eebbe toobad dhab ah' (Qur'aanka 66: 8). Sadaqadu waxay daahirisaa maalka waxayna kaa dheeraynaysaa sida sadaqah jaariyada ah. Dhikrigu waxa uu carrabka ku adkeeyaa Miisaanka iyada oo kelmado ku fudud yihiin carrabka. Dabeecadda wanaagsanna, Nabigu ﷺ wuxuu yidhi, waa shayga ugu cuslaa ee la saaro Miisaanka.",
      "Ilaali labada shay ee uu Nebigu ﷺ si toos ah ugu xidhay Jannada - carrabka iyo dhawrsanaanta (Saxiix al-Bukhaari 6474) - sababtoo ah kuwan, oo ka badan dembiyada la yaabka leh, waa kuwa si deggan u buuxiya ama u buriya diiwaanka. Dadkana xuquuqdooda deji inta aad awooddo: Deyn bixi, wixii lagu qabtay soo celi, dhibta ka raalli geli, wax kastana u cadaalad falan, si aydaan weligiin u iman sidii qof ‘musalafsan’ oo baryadiisii ​​ay ku cuneen sheegashadii kuwii uu dulmiyey.",
      "Wax walba hal niyo ayay ku taagan yihiin, waxaa lagu yiri xadiiska ugu horreeya ee Saxiix Al-Bukhaari: 'Ficilku waa niyo'. U isticmaal raad-raacayaasha Munib dhibco ahaan si aad ugu tartanto balse u isticmaal si tartiib ah caadooyinkan - salaadda, Qur'aanka, dhiqlaha, sadaqada, tawbada - mid kasta oo si aamusan u tilmaamaya maalintaada la kulanka Alle. Taasi waa ujeeddada oo dhan: inaad hadda u noolaato sidii qof si dhab ah u rajaynaya inuu hortiisa istaago.",
    ],
    quran: [
      {
        excerpt: "Jinni iyo Insina uma aan abuurin inay i caabudaan mooyee.",
      },
      {
        excerpt:
          "Kuwa xaqa rumeeyow u noqda Eebbe toobad toosan. Wuxuu u dhawyahay Eebihiin inuu idinka reebo xumaantiinnii oo uu idin galiyo Jannooyin ay dureeri dhexdeeda Wabiyaal.",
      },
    ],
    hadith: [
      {
        excerpt: "Ficilku waa niyo, qof kastana wuxuu heli doonaa oo keliya wixii uu damacsanaa.",
      },
      {
        excerpt:
          "Ruuxii ii dammaanad qaada waxa u dhexeeya daamankiisa iyo waxa u dhexeeya lugihiisa – carabkiisa iyo dhawrsanaantiisa – waxaan u dammaanad qaadayaa Jannada.",
      },
    ],
    actions: [
      "Ku tukada shanta salaadood wakhtigeeda.",
      "Akhri ama dhegayso Qur'aanka maalin kasta - xitaa dhowr aayadood.",
      "Subax iyo galabba ilaali.",
      "Si joogto ah u bixi sadaqo, xataa xaddi yar.",
      "Maalin walba toobad keena oo cafis weydiiso si daacad ah.",
      "Ilaali carrabka iyo dhawrsanaanta, Ballan kastana ilaali.",
      "Buuxi xuquuqda lagu leeyahay qoyska, deriska, iyo deyn bixiyayaasha.",
      "Ka fiirso joornaalka ducadaada khushu iyo daacadnimada niyada.",
    ],
    appLinks: [{}, {}, {}, {}, {}, {}],
  },
];

export const LAST_DAY_HADITH_SO: DeepPartial<LastDayHadithEntry>[] = [
  {
    hadith: {
      excerpt: "Xusuusnow marar badan baabbi'iyaha raaxada - macnaha dhimashada.",
    },
    context:
      "Xusuusta joogtada ah ee geeridu waxay jilcisaa qalbiga, waxay baabi'isaa ciilka, waxayna hagaajisaa mudnaanta iyada oo aan rajo beel la dhalin.",
  },
  {
    hadith: {
      excerpt: "Midkiin yaanu dhiman isagoo ka fikiraya Eebe raxmaddiisa iyo naxariistiisa mooyee.",
    },
    context:
      "Dhammaadkii wanaagsanaa (husn al-khatimah) waxaa lagu rajaynaa iimaan dhab ah, toobad iyo rajo wanaagsan oo Alle.",
  },
  {
    hadith: {
      excerpt: "Qabrigu waa beer ka mid ah beeraha Jannada ama god ka mid ah godadka naarta.",
    },
    context:
      "Barzakh waxa ka mid ah abaalgudka ama ciqaabta qabriga, xikmada Eebe awgeed - qabrigu waxa uu ka tarjumayaa camalka qofka.",
  },
  {
    hadith: {
      excerpt:
        "Markii la aasayo marxuumka ayaa waxaa u yimid labo malag oo ka wareystay Rabbigiis, diintiisa iyo nabigiisa.",
    },
    context:
      "Su'aalaha qabriga dhexdiisa waxaa lagu xaqiijiyay warar sugan; Qisadan labada malag waxaa lagu kala magacaabaa Munkar iyo Naakir.",
  },
  {
    hadith: {
      excerpt:
        "Qofku markuu dhinto camalkiisu wuu dhammaanayaa saddex mooyee: Sadaqo socota, cilmi faa'iido laga helayo, ama ubad suuban oo u barya.",
    },
    context: "Maxaa sii wada faa'iidada qofka dhintay - oo lagu aasaasay xadiis saxih ah.",
  },
  {
    hadith: {
      excerpt:
        "Waxaa laydin soo kulmin idinkoo qaawan oo qaawan oo aan gudnayn, waxaana laydin soo kulmin kuwa ugu horreeya ee la huwiyo maalinta qiyaame Ibraahiim.",
    },
    context: "Khushuucda Maalinta Kulul; Eebbana wuu karaameeyaa ciduu doono siduu doono.",
  },
  {
    hadith: {
      excerpt:
        "Qorraxda waxaa loo soo dhawayn dadka maalinta qiyaame ilaa ay ka jirto wax ku dhow hal mayl, markaasay u dhididsan yihiin sida camalkoodu.",
    },
    context:
      "Shuruudaha Mahsharka - darnaanta waxay ku kala duwan tahay ficillada ku jira sheekooyinka dhabta ah.",
  },
  {
    hadith: {
      excerpt:
        "Dadku way ii iman doonaan, waxaanan u sujuudi doonaa Eebbe, waxaana la odhanayaa: madaxa kor u qaada; weydiiso waa lagu siinayaa, shafeeco oo shafeecadaada waa la aqbalayaa.",
    },
    context: "Shafeecada ugu weyn - al-Shafa'ah al-'Udhma, oo u gaar ah Nabiga ﷺ.",
  },
  {
    hadith: {
      excerpt:
        "Ciddii la xisaabtantaa waa la halaagay. Caa’isha waxay waydiisay: Miyaanu Eebbe odhan, waxaa lagu xukumayaa xisaab fudud? Wuxuu yidhi: Kaasi waa uun soo bandhigida camalka; Laakiin ku alla kii la weyddiiyo aawadiis waa la baabbi'in doonaa.",
    },
    context:
      "'Akoonka fudud' waa naxariis - in qofka la tuso camalkiisa oo la cafiyo, ee ma aha in shayga la isku dhaafiyo.",
  },
  {
    hadith: {
      excerpt:
        "Ummadaydu musaladay waa mid la yimaadda salaad, soon iyo sadaqo, laakiin aflagaadeeyay, aflagaadeeyay, oo dulmiyey cid kale – sidaas darteed camalkiisii ​​wanaagsanaa loo dhiibo, dambigoodiina loo raran yahay.",
    },
    context:
      "Xuquuqda dadka (xuquq al-'ibad) si fudud cibaadada uma baabi'iso; waa in la dejiyaa ama la bixiyaa maalinta.",
  },
  {
    hadith: {
      excerpt:
        "70 kun ummata keenyaa jajjabeessuu akka danda’u, kan rakkoo rakkoo akka ta’e, rakkoon ulfaataa akka ta’e ibsaniiru.",
    },
    context:
      "Culimadu waxa ay ku kala aragti duwan yihiin in tiradu tahay mid toosan ama waxa ay tilmaamaysaa raxmad Alle oo aad uga weyn oo aan la qiyaasi karin.",
  },
  {
    hadith: {
      excerpt:
        "Hawdkaygu waa safar bil ah. Biyuhu caano way ka cad yihiin, oo udgoonkoodu waa ka udgoon yihiin miski, koobabkeeduna waxay u badan yihiin sida xiddigaha cirka. Ku alla kii ka cabba mar dambe ma harraadi doono.",
    },
    context: "Balliga - naxariista ummadda Muxammad ﷺ maalinta haraadka.",
  },
  {
    hadith: {
      excerpt:
        "Buundada waxay dulmartay Jahannamo. Dadku waxay u gudbeen siday falimahoodu ahaayeen - sida hillaaca, iyo dabaysha, iyo sida shimbiraha, iyo sida nin ordaya, oo qaarna waa la xagtaa oo la badbaadiyaa, qaarna way dhacaan.",
    },
    context:
      "Xawaaraha ka gudubka wuxuu ka tarjumayaa iimaanka iyo camalka; Naxariista Eebe waa mid aad u balaadhan.",
  },
  {
    hadith: {
      excerpt:
        "Qiyaamadu iman mayso intaad ka aragtaan toban calaamo oo kala ah: qiiqa, Dajjal, Bahalkii, Qorrax ka soo bax xagga galbeed ka yimid, soo degidii Ciise binu Maryam, Yacjuuj iyo Maajuuj, saddex go' iyo dab dadka u kaxayn kulankooda.",
    },
    context:
      "Tobanka calaamo ee waaweyn, oo ka yimid Xudeyfah ibnu Usayd. Culimadu waxay caddeeyaan calaamad kasta laakiin way ku kala duwan yihiin habka saxda ah.",
  },
  {
    hadith: {
      excerpt:
        "Eebaha ay naftaydu gacantiisa ku jirto wuxuu ku soo degi dhexdiina ina Maryama isagoo toosan. Wuxuu jebin doonaa iskutallaabta, oo dili doona doofaarka, jizyadana wuu baabi'in doonaa, oo maalku wuu buuxdhaafi doonaa ilaa aan cidna aqbalin.",
    },
    context:
      "Soo degitaanka Ciise waa qodob adag oo caqiidada Sunniga ah; wuxuu ku xukumaa shareecada Muxammad ﷺ.",
  },
  {
    hadith: {
      excerpt:
        "Markay lumiso kalsoonida, sug Saacadda (Qiyaame). Waxaa la weydiiyey: Sidee loo waayi doonaa? Wuxuu yidhi: Marka la siiyo maamulka cid aan u qalmin.",
    },
    context:
      "Calaamad yar oo si fiican loo yaqaan - luminta kalsoonida. U fiirso diyaargarow, ha argagixin.",
  },
  {
    hadith: {
      excerpt:
        "Eebbana cilmiga kuma fogeeyo in la duudsiyo, ee waa in uu culimadu kaxeeyo, ilaa aan midna ka hadhin, dadkuna ay jaahiliinta ka dhigteen madax wax xukunta oo aan cilmi lahayn, markaasay dhumiyaan oo dhumiyaan dadka kale.",
    },
    context:
      "'Aqoonta luminta' macneheedu waa luminta aqoonyahanno wanaagsan iyo ku-dhaqan nololeed - ma aha yaraanta macluumaadka.",
  },
];

export const LAST_DAY_VERSES_SO: DeepPartial<LastDayVerseEntry>[] = [
  {
    excerpt:
      "Naf kastaa waxay dhadhamin Geerida, waxaana laydin dhamayn uun abaalkiinna Maalinta qiyaame. Ee ruuxii laga fogeeyo naarta oo jannada la geliyo waa liibaanay, nolosha adduunyona waa uun raaxadan dhagri.",
    context:
      "Geeridu waa caalami, noloshanina waa ku meel gaadh; Xallinta xisaabaadka dhabta ah iyo tan u dambaysa waxay imanaysaa oo keliya maalinta aakhiro.",
    tafsirSummary:
      "Aayadu waxay dib u qeexday guusha: maaha maal iyo mansab halkan, laakiin waa in laga badbaado naarta oo la galo Jannada halkaas.",
  },
  {
    excerpt:
      "Maalintaas Dadku way kala bixi iyagoo koox u socda si loo tuso camalkooda. Haddaba ruuxii sameeya wax atom ah oo khayr ah wuu arki doonaa, ruuxii sameeyana wax xun wuu arki.",
    context:
      "Caddaalad qumman oo dhammaystiran - camalka ugu yar, wanaag iyo xumaanba, waa la duubay oo loo celiyaa falimihiisii.",
    tafsirSummary:
      "Ma jiro wax aad u yar oo la tirin karo. Aayaddani waa digniin nolosha oo dhan ah oo ka dhan ah iska fogaynta dembiyada 'yar' iyo dhiirigelinta cimriga oo dhan ee ku wajahan camalka wanaagsan ee 'yar yar'.",
  },
  {
    excerpt:
      "Waxaana u yeellay miisaanka xaqa maalinta qiyaame, lamana dulmiyo nafna. Hadday culayskeedu tahay iniin khardal ah waan soo bixin, waxaana ku filan xisaabiye.",
    context: "Mizan (Miisaanka) waa dhab, cadaaladiisuna waa mid sugan.",
    tafsirSummary:
      "Maalintaas ninna kuma gaabsana iniin khardal le'eg. Xisaabinta Alle waa mid aan cillad lahayn.",
  },
  {
    excerpt:
      "Ruuxii Miisaankiisu cuslaado wuxuu gali nolol fiican. Laakiin midkii miisaankiisu fudaydsan lahaa, magangalkiisu wuxuu ahaan doonaa bohoma.",
    context:
      "Natiijada kama dambaysta ahi waxay ku soo jeedisaa miisaanka camalka xaqa ah ee qofku ku leeyahay Miisaanka.",
    tafsirSummary:
      "Miisaanku wuxuu ka yimaadaa daacadnimo, ee maaha mug weyn - dhikr fudud ayaa sheegay in kaliya uu ka miisaan badnaan karo buuraha waxqabadka muuqda.",
  },
  {
    excerpt:
      "Una degdega dambidhaafka Eebihiin iyo Janno ballaadhkeedu yahay sida samooyinka iyo dhulka oo loo darbay kuwa dhawrsada.",
    context: "Amarka tooska ah ee u orda wanaagga iyo cafiska ka hor la kulanka Alle.",
    tafsirSummary:
      "Jannadu waa wayn tahay male male, jidkeeduna waa in lagu degdego- yaan dib loo dhigin tawbada iyo camalka wanaagsan.",
  },
  {
    excerpt: "Wajiyaal Maalintaas way Nurayaan iyagoo Eebahood u jeeda.",
    context: "Jannada abaalkeeda ugu wayn maaha beer iyo wabi ee waa in la eego wejigii Alle.",
    tafsirSummary:
      "Ahlu Sunna waxay caddeeyeen in Mu’miniintu ay arki doonaan Eebahood aakhiro, si ku habboon weynaantiisa oo aan la mid ahayn abuurista, waana taajka Nicmada oo dhan.",
  },
  {
    excerpt:
      "Kuwa ka gaaloobay Eebahood waxaa u sugnaaday cadaabka Jahannamo, meel loo ahaana iyadaa u xun.",
    context: "Jahannamo waa natiijo run ah oo xaq ah - hoy dhab ah, ma aha calaamad.",
    tafsirSummary:
      "Digniintu waa raxmad loogu talagalay in qofka dib loo celiyo iyadoo weli waqti ka harsan yahay; had iyo jeer waxa lagu lamaanaa Qur’aanka kariimka ah oo albaabbada toobadda furan yahay.",
  },
  {
    excerpt:
      "Waxaad dhahdaa: Addoomadayda ku xad gudbay Naftooda, ha ka quusanina naxariista Eebe. Illeen Eebbe wuu dhaafaa dambiyada oo dhan. Eebana waa dambi dhaafe Naxariista.",
    context:
      "Si kasta oo dembigu u weynaado, albaabka towbad keenka runta ahi wuu furnaa ilaa dhimashada.",
    tafsirSummary:
      "Naxariista Eebe lafteedu waxay ka Quustaa Shaydaan; Mu’minku waxa uu dheelli-tirayaa cabsida Naarta iyo Rajada aan jabin karin ee Dambi dhaafka Eebe.",
  },
  {
    excerpt:
      "iyo inay Qiyaamadu iman, shakina kuma jiro, iyo in Eebe soo bixin kuwa qubuuraha ku sugan.",
    context: "Qiyaamadu waa hubaal, inkastoo waqtigeedu qarsoon yahay.",
    tafsirSummary:
      "Xaqiiqda ku saabsan saacadda, oo ay weheliso hubanti la'aan ku saabsan waqtigeeda, ayaa dhab ahaan ah waxa ku xidhan mas'uuliyadda akhlaaqda ee hadda.",
  },
  {
    excerpt:
      "Waa kuma kan u shafeeco Eebe idankiisa mooyee. Wuxuu ogyahay waxa hortooda ah iyo waxa gadaashooda ah, kuma koobaan cilmigiisa waxaan wuxuu doono mooyee.",
    context: "Shafeecada (shafaca) waa dhab balse marna kama madaxbanaana idanka Alle.",
    tafsirSummary:
      "Shardigan keli ah - 'Idmankiisa mooyaane' - waa tan kala saarta shafeecada dhabta ah iyo fasaad kasta oo ka mid ah, kana reebaysa in loogu yeedho kuwii dhintay nolosha adduun.",
  },
  {
    excerpt:
      "Hana u malayn in Eebe halmaansan yahay waxay fali daalimiintu. 028-047 wuxuu uun dib u dhigi iyaga maalin ay indhatiraan.",
    context: "Raaxada kuwa dulman - dib u dhaca muuqda ee caddaaladdu maaha maqnaanshihiisa.",
    tafsirSummary:
      "Dulmi ma jiro Allaah illaaway; waxaana uun la sugi daalimiinta ilaa maalin aan la ilmaansiin.",
  },
  {
    excerpt:
      "Midkiinna ma jiro in uu u yimaado mooyee. Kaasi waa u sugnaaday Eebahaa wax lama huraan ah. Markaasaan korinaynaa kuwii Eebe ka dhawrsaday, waxaana kaga tagi daalimiinta dhexdeeda iyagoo jilba joogsan.",
    context:
      "Siraad ka gudubta waa caalami; imaatinka nabad gelyo waa naxariista iyo taqwada eebe.",
    tafsirSummary:
      "Qof kastaa wuxuu yimaadaa isgoyska; Farqiga u dhexeeyaa waa kan badbaaday iyo kan dhaca - waxaa lagu go'aamiyay rumaysad iyo camallo hore loo soo diray.",
  },
  {
    excerpt:
      "Waxayna ku waydiin Saacadda (Qiyaame) goorma. Waxaad dhahdaa cilmigeedu waa uun Eebahay agtiisa. Wax Eebe ka soo hadhayna wax sheegi ma jiro. Kuuma soo degayso si lama filaan ah mooyee.",
    context:
      "Waqtiga saxda ah eebe ayaa og oo kaliya - arrimaha diyaarinta, saadaalintu waa wax aan waxtar lahayn.",
    tafsirSummary:
      "Xataa nabiga ﷺ lama siin taariikhda; Sheegasho kasta oo biniaadmi ah oo ku saabsan sannad ama tirinta waxay ka hor imanaysaa aayaddan.",
  },
  {
    excerpt:
      "Kii kitaabkiisa midigta laga siiyona wuxuu odhanayaa: Waar bal akhriya kitaabkayga. Waxaan hubay inaan la kulmi doono akoonkayga. Sidaas daraaddeed wuxuu ku jiri doonaa nolol wanaagsan.",
    context:
      "Habka loo helo buugga - gacanta midig ama bidix - lafteeda ayaa ah xukunka ugu horreeya.",
    tafsirSummary:
      "Farxadda kuwa guulaysta waa farxadda la hubo ee la abaalmariyey: waxay noolaayeen iyagoo sugaya xisaabinta, waxayna u timaaddaa nafis ee ma aha naxdin.",
  },
];

export const LAST_DAY_TIMELINE_SO: DeepPartial<LastDayTimelineEvent>[] = [
  {
    title: "Nolosha aduunkan",
    body: "Waqti kooban oo loo ballamay in la rumaysto, la caabudo, lana diyaariyo. Dunidani maaha guriga ugu dambeeya - waa beerta camalka.",
  },
  {
    title: "Geerida",
    body: "Naf kastaa waxay dhadhamin doontaa geerida. Mu’minku wuxuu la kulmaa isagoo rajo ka qaba naxariista Eebbe; fiirsasho la'aantu waxay keentaa lama filaan iyo qadhaadh.",
  },
  {
    title: "Qabriga",
    body: "Aaska ka dib, naftu waxay gashaa Barzakh. Qabrigu waa marxaladda koowaad ee aakhiro qofkasta.",
  },
  {
    title: "Barzakh",
    body: "Nolosha u dhaxaysa dhimashada iyo sarakicidda - su'aalo, raynrayn, ama ciqaab sida ay sheegayaan warar sugan.",
  },
  {
    title: "Calaamadaha yaryar",
    body: "Isbeddel bulsho iyo akhlaaq oo tartiib tartiib ah ayuu Nabigu ﷺ ku tilmaamay. Culumo badan ayaa xusay in dhowr ay soo shaac baxeen; waqtiga saxda ah waxaa iska leh Allaah kaliya.",
  },
  {
    title: "Calaamadaha waaweyn",
    body: "Dhacdooyin la yaab leh oo ku dhow dhammaadka - oo ay ku jiraan al-Mahdi, Dajjal, iyo soo noqoshada Ciise (nabadgelyo korkiisa ha ahaatee) oo ku jira xadiis saxiix ah. Faahfaahinta taxanaha ahi way ku kala duwan yihiin culimada.",
  },
  {
    title: "Buunka",
    body: "Israafiil buun buun buuna. Abuurigu wuxuu dhintaa qarixii koowaad oo wuxuu soo sara kiciyaa kan labaad.",
  },
  {
    title: "Qiyaame",
    body: "Meydad laga soo celiyay boodhka; uunka oo dhamina wuxuu taagan yahay Alle hortiisa.",
  },
  {
    title: "Kulanka (Mahshar)",
    body: "Dadka oo dhami waxay isu soo urursadeen iyagoo kabo-la'aan, qaawan, iyo kuwo aan gudnayn - siduu Eebbe doonayo - iyagoo sugaya xukun.",
  },
  {
    title: "Diiwaanka Camalka",
    body: "Buugaag lagu bixiyo gacanta midig, gacanta bidix, ama gadaasha dambe. Ma jiro wax laga saaray wixii la duubay.",
  },
  {
    title: "Miisaanka (Mizan)",
    body: "Camalku wuxuu ku miisaamay caddaalad qumman. Miisaanka culusi farxad buu keenaa; miisaanka iftiinka ayaa keena khasaare.",
  },
  {
    title: "Xisaabtanka (Hisab)",
    body: "Xisaabinta fudud ee qaar ka mid ah; su'aalo faahfaahsan oo kuwa kale. Xuquuqda dadka lagu leeyahay lama ilduufo.",
  },
  {
    title: "shafeecada (Shafaax)",
    body: "Idanka Alle kaliya-- kan ugu weyn waxaa iska leh Nebi Muxammad ﷺ.",
  },
  {
    title: "Balliga (Hawd)",
    body: "Waa ben aad u weyn oo ay ka cabbaan ummadda Rasuulka ﷺ maalinta qiyaame.",
  },
  {
    title: "Buundada (Sirat)",
    body: "Qof kastaa wuxuu ka gudbaa naarta - xawaaraha wuxuu ku kala duwan yahay iimaanka iyo camalka qisooyinka dhabta ah.",
  },
  {
    title: "Jannada ama Naarta",
    body: "Hoy weligeed ah - Jannada by naxariista Eebe iyo camalka xaqa ah; Jahannama waa digniin dhab ah iyo cawaaqib xumo.",
  },
  {
    title: "daa'in",
    body: "Aakhiro ka dib geeri ma jirto. Ehelu Jannuhu waa ku waari dhexdeeda nicmo. Ehlu naartana waxay ku sugnaan doonaan siduu Eebbe doono.",
  },
];

export const LAST_DAY_QUIZ_SO: DeepPartial<LastDayQuizQuestion>[] = [
  {
    prompt: "Rumaynta maalinta aakhiro waa mid ka mid ah:",
    options: [
      "Shanta tiir ee Islaamka",
      "Lix qodob oo iimaanka ah (Imaan)",
      "Toddoba samadood",
      "Toban saxaabi",
    ],
    explanation:
      "Iimaanka waxaa ka mid ah rumaynta Eebbe, malaa’igta, kutubta, rususha, maalinta aakhiro, iyo qadarka Eebbe (qadriga).",
  },
  {
    prompt: "Barzakh waxaa si wanaagsan loogu tilmaamay:",
    options: [
      "Buundada Naarta",
      "Nolosha u dhaxaysa dhimashada iyo sarakicidda",
      "Miisaanka camalka",
      "buunkii buunka",
    ],
    explanation: "Barzakh waa inta u dhaxaysa dhimashada ka dib ilaa maalinta qiyaame.",
  },
  {
    prompt:
      "Run ama been: Culimadu waxay isku raacsan yihiin sida saxda ah ee dhammaan calaamadaha waaweyn ee saacadda.",
    options: ["Run", "Been"],
    explanation:
      "Calaamadaha waaweyn waxay ku sugan yihiin xadiis saxiix ah, laakiin culimadu waxay ku kala duwan yihiin tafaasiisha taxanaha ah. Saacadda saacadda waxaa og Eebbe oo keliya.",
  },
  {
    prompt: "Mizan (Miisaanka) Maalinta Aakhiro waxaa loola jeedaa:",
    options: [
      "Miisaanka jirka jirka",
      "Camalka oo lagu miisaamo caddaalad qumman",
      "Waqtiga lagu qiyaaso qabriga",
      "Malaa'igta tirinaysa",
    ],
    explanation:
      "Mizanku wuxuu miisaamaa camalka - daacadnimada iyo ficilka xaqa ah waxay ka dhigaan miisaan culus.",
  },
  {
    prompt: "Shafeecada (shafaaca) maalinta aakhiro.",
    options: [
      "Waxay dhacdaa idanka Alle la'aanteed",
      "Waa idanka Alle uun",
      "Beddela baahida iimaanka",
      "Quraanku wuu inkiray",
    ],
    explanation: "Qur'aanka 2:255 iyo 20:109 waxay xaqiijinayaan shafeecada idanka Eebe keliya.",
  },
  {
    prompt: "Kee soo horeeya safarka aakhiro?",
    options: ["Qiyaame", "Geerida", "Isu imaatinka", "Buunka"],
    explanation:
      "Geeridu waxay ka horraysaa Barzakh, dabadeed - calaamadaha iyo buunka ka dib - sarakicidda iyo isu imaatinka.",
  },
  {
    prompt:
      "Halkee baad caadaysatay oo aad xoojin doontaa usbuucan si aad ugu diyaargarowdo la kulanka Alle?",
    explanation:
      "Diyaarinta waa wax ku ool ah: Salaadda, Qur'aan, toobad, sadaqo, akhlaaq wanaagsan, iyo buuxinta xuquuqda dadka kale.",
  },
  {
    prompt: "Run ama been: Sida ku cad Qur’aanka 19:71, qof kastaa wuu dhaafi doonaa Siraad.",
    options: ["Run", "Been"],
    explanation:
      "Aayaddu waxay sheegaysaa dhammaan way ka gudbi doonaan; Eebbana waa koriya kuwa wax dhawrsada. Culimadu waxay tafaasiil ka bixiyeen cidda ku dhacda.",
  },
];

export const LAST_DAY_REFERENCES_SO: DeepPartial<LastDayReferenceEntry>[] = [
  {
    title: "Quraanka",
    note: "Isha aasaasiga ah ee sarakicidda, xisaabtanka, Jannada, Naarta, iyo caddaaladda rabaaniga ah. Aayadaha cutubkan waxa inoo daliishaday suurad iyo aayad.",
  },
  {
    title: "Saxiixul Bukhaari & Saxiix Muslim",
    note: "Xadiithka xadiithka ah oo la ururiyay geerida, qabriga, calamadaha, xisaabinta, shafeecada, Hawdka, iyo Siraad.",
  },
  {
    title: "Sunan al-Tirmidhi & Sunan Abii Daawuud",
    note: "Warbixino dheeraad ah oo dhab ah oo ku saabsan qabriga iyo calamadaha yaryar - darajooyinka lagu xusay halka ay khuseyso.",
  },
  {
    title: "Ibn Kathir - Tafsiir",
    note: "Tafsiir qaraami ah oo ku saabsan aayadaha Qur'aanka ee ka hadlaya aakhiro. Loo isticmaalo tafsiir kooban oo kooban, looma isticmaalo caddayn madax bannaan.",
  },
  {
    title: "Al-Aqidah al-Tahawiyyah",
    note: "Caqiidada aasaasiga ah ee Sunniga ah ee caddaynaysa sarakicidda, miisaanka, buundada, Jannada, iyo Naarta.",
  },
  {
    title: "Kala duwanaanshaha cilmiga",
    note: "Halka ay culimadu ku kala duwan yihiin - tusaale; isku xigxiga calaamadaha waaweyn, tafaasiisha Hawdka, qaybaha gelaya xisaab la'aan - cutubkani waxa uu tilmaamayaa kala duwanaansho iyada oo aan la sheegan hal aragti oo ah ra'yi kaliya oo sax ah.",
  },
  {
    title: "Muujintii vs. fasiraadda",
    note: "Qur’aanka cad iyo mutawatirada ama xadiisyada saxixa ah waxa lagu kala soocaa ra’yiga tafsiir ah (ijtihaad) iyo qisooyinka daciifka ah.",
  },
];
