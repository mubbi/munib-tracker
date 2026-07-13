// Somali translation overlays for the Learn Qur'an content.
// Each overlay mirrors the order of its English source array in ../quran-guide*.ts
// (index-aligned); untranslated entries fall back to English. Only human-readable
// text is translated — ids, routes, surah/ayah numbers, collections, citations,
// grades, and Qur'an verse-reference labels stay in the English source.
import type {
  QuranGuideApplyChallenge,
  QuranGuideDailyLesson,
  QuranGuideLetter,
  QuranGuideMemorizationPlan,
  QuranGuidePronunciationPair,
  QuranGuideQuizQuestion,
  QuranGuideReadingLevel,
  QuranGuideStory,
  QuranGuideStructureLevel,
  QuranGuideTadabburPrompt,
  QuranGuideTajweedLesson,
  QuranGuideTheme,
  QuranGuideTimelineEvent,
  QuranGuideTopic,
  QuranGuideVocabEntry,
} from "../../types/quran-guide";
import type { DeepPartial } from "./localize";

export const QURAN_GUIDE_TOPICS_SO: DeepPartial<QuranGuideTopic>[] = [
  {
    title: "Hordhac",
    summary: "Waa maxay Quraanka, sababta loo soo dejiyay, iyo fadliga akhriska.",
    body: [
      "Erayga Qur’aanku waxa uu ka soo jeedaa xididka Carabiga ee qara’a, oo macnihiisu yahay in wax la akhriyo ama kor loo akhriyo — sidaa awgeed kitaabku waxa uu xambaarsan yahay ujeeddadiisa magaciisa oo kale: waxa loogu talo galay in lagu akhriyo, mar kale iyo mar kale, carrabka iyo qalbigaba. Caqiidada guud ee Sunniga Qur'aanku waa hadalka dhabta ah, ee aan la abuurin ee Alle, oo Carabi cad ku soo dejiyay Nebi Muxamed ﷺ isagoo malag Jibriil u soo mariyey ku dhawaad ​​23 sano, laga soo bilaabo erayadii ugu horreeyay ee Cave Hira ilaa wax yar ka hor geeridii Nebigu ﷺ.",
      "Waa kitaabkii u dambeeyay ee loo soo diray bani-aadmiga, isagoo xaqa ku caddaynaya aayadihii hore ee Muuse, Daawuud iyo Nabi Ciise (nabadgelyo korkooda ha yeelee) oo dhammayn tiradoodii ay siday. Eebbe wuxuu ujeeddadiisa si cad u qeexay: waxaa loo soo dejiyey ‘sidii hanuunka loogu hanuunin lahaa dadka’ — in dadka laga saaro mugdiga jaahwareerka iyo sanam caabudidda iftiinka tawxiidka, cibaadada Eebbe oo kali ah, dabeecad toosan, iyo u diyaargarowga nolosha aakhiro. Nebi kasta wuxuu u yeedhay isla xuduntaas; Qur'aanku waa qaabkiisa u dambeeya ee la ilaaliyo.",
      "Qur'aanka oo la akhriyaa laftiisa waa cibaado, ee ma aha akhrinta macluumaadka. Rasuulku ﷺ wuxuu baray in xaraf kasta oo la akhriyo uu kasbado camal wanaagsan, camal kasta oo wanaagsanna la labanlaabo ugu yaraan toban laab - sidaas darteed xitaa bilawga hal sadar ku dhawaaqaya waa ajar urursan. Maalinta Qiyaame Qur'aanku wuu iman isagoo shafeeco ah, isagoo u baryaya kuwii nolosha adduunyo la socday. Qofkii si fiican u akhriya waxa uu la socdaa malaa’igtii sharafta lahayd ee culimmada, kii ku turunturoodo oo u halgama wax-barashada, labanlaab abaalgud buu ka helay dadaalka.",
      "Waxay kaa caawinaysaa in la caddeeyo waxa aanu Quraanku ahayn. Qur'aanku waa ereyada afka Carabiga ah ee Eebbe u gaar ah, oo aan isbeddelin tan iyo waxyiga. Xadiithka - hadallada Nabiga ﷺ, ficilladiisa, iyo oggolaanshaha aamusnaanta - waa kala duwan yihiin: waxay sharraxaan oo muujiyaan Qur'aanka laakiin waa weedha Nabiga ﷺ, oo lagu xafiday silsilado weriyeyaal magacyo leh oo ay culimadu ku qiimeeyeen Saxiix (Saxiix ah), Xasan (wanaagsan), ama Daa'if (daciif). Labaduba waa waxyi oo labaduba waa xidhxidhan yihiin, laakiin Qur'aanka oo kaliya ayaa lagu akhriyaa cibaadada salaadda, Qur'aanka oo keliya ayaa ah mucjisada iyo hadalka Eebbe.",
    ],
    quran: [
      {
        excerpt:
          "Bisha Ramadaan ee Qur’aanka kariimka ah la soo dejiyay isagoo hanuun u ah dadka...",
      },
      {
        excerpt:
          "Waxaad dhahdaa: Hadday u yimaadaan Insi iyo Jinni inay la yimaadaan Quraankan oo kale ma karaan...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qofkii akhriya xaraf kitaabka Alle ah waxa uu helayaa xasanad, xasaanadana waxaa lagu dhuftey toban.",
      },
      {
        excerpt:
          "Qur'aanka akhri, waayo wuxuu u shafeeco u noqon doonaa asxaabtiisa maalinta qiyaame.",
      },
      {
        excerpt:
          "Qofka quraanka ku xeel dheer wuxuu la joogaa culimadii sharafta lahayd ee xaqa ahayd, kii akhriya isagoo dhib ku ah, isagoo ku turunturooday, wuxuu leeyahay laba ajar.",
      },
    ],
    actions: [
      "U deji waqti go'an oo maalinle ah Qur'aanka - xitaa shan daqiiqo oo diirada la saaray waxay dhistaa barakah iyo joogtayn.",
      "Akhri ugu yaraan hal sadar oo macne leh: akhri Carabiga, kadibna si tartiib ah u akhri tarjumaadda.",
      "Fur Muniib Qur'aanka kariimka ah oo sii wad halkii aad ka tagtay.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sida quraanka lagu soo dejiyay",
    summary: "Godka Xiira, Jibril, Makkan iyo Mudooyinkii Madiina, ururinta, ilaalinta.",
    body: [
      "Waxyigu wuxuu bilaabmay bishii Ramadaan, markuu Nebigu (scw) afartan jir ahaa oo uu u baxay godka Xiira ee buurta Makkah ka baxsan si uu kalidiis iyo fikir u galo. Halkaa waxaa u yimid malag Jibriil oo ku amray: Akhri! Nebigu (scw) oo aan waxna akhriyin waxna qorin ayaa ku jawaabay ma awoodo- ilaa uu malaa'igtu soo dhawayso oo ay gaadhsiiso shanta aayadood ee u horreeya suuradda Al-calaq: ' ku akhri magaca Eebahaa abuuray. Wuu gariiray oo gurigiisii ​​ugu noqday xaaskiisii ​​Khadiija, markaasay niyadda u gelisay oo u gaysay qaraabadeedii oo lagu magacaabo Waraqah bin Nawfal, oo ahaa nin caalim ah oo gartay malaa’igta waxyiga, una xaqiijiyey inuu yahay isla rasuulkii u yimid Muuse.",
      "Waxaa xigay nasasho kooban oo waxyi ah (Fatrax), muddo aamusnaan ah oo Nebiga ﷺ ku sii dheeraysay; ka dibna way dib u bilaabatay oo ay sii waday marxalado noloshiisa inta ka dhiman. Waxyigu halmar kuma soo degin ee waxa loo soo dejiyey si looga jawaabo dhacdooyinka, su’aalaha iyo baahiyaha sii kordhaya ee bulshada—hab tartiib tartiib ah ayuu Alle ku tilmaamay inuu yahay xoojinta qalbiga Nabiga ﷺ iyo fududaynta kitaabka nolosha dadka.",
      "Muddada Makkan waxay socotay qiyaastii saddex iyo toban sano. Suuraddeedu inta badan waa kuwo gaaban, qaafiyad iyo awood leh; waxay dubtaan aasaaska - kalinimada Eebe, hubaal qiyaamaha iyo xisaabtanka, qisooyinkii nebiyadii hore ee la diiday ka dibna la caddeeyey, iyo baaq ballaaran oo lagu hagaajinayo akhlaaqda bulshada dhexdeeda oo ku dhex jira sanam caabudid iyo caddaalad darro.",
      "Hijradii Madiina ee sannadkii 622-kii ka dib, Muslimiintu may ahayn kuwo la silciyey ee waxay ahaayeen bulsho dhistay bulsho. Aayadaha Madiina guud ahaan aad bay u dheer yihiin oo aad u faahfaahsan yihiin, oo dejinaya sharciga iyo nidaamka ijtimaaciga ah ee ummadda cusub u baahan tahay: waxyaabaha u gaarka ah salaadda, sakada, soonka, dhaxalka, guurka iyo furriinka, qandaraasyada, dagaalka, iyo axdiyada, iyadoo ay barbar socoto erayo adag oo ay u jeedinayaan munaafiqiinta bulshada dhexdeeda ka duminaya.",
      "Ilaalinta qoraalka waxa ay bilaabantay Nebiga ﷺ noloshiisa. Saxaabadu waxay xifdiyeen waxyigii siduu ku yimid, culimadu waxay ku qoreen xaashida, timirta, lafta iyo dhagaxa iyadoo Nabiga ﷺ si toos ah ula soconayo. Xifiyiin badan oo ku shahiiday dagaalkii Yamaama ka dib, Abuu Bakar wuxuu amray Zayd bin Thabit inuu Qur’aanka oo qoran ka soo ururiyo hal urur (suhuf). Ka dib, markii ay faaftay boqortooyadii iyo lahjadihii kala duwanaa, Cuthmaan waxa uu haystay nuqullo awood leh oo lagu sameeyay lahjadda Quraysh oo loo diray magaalooyinka waaweyn, isagoo halbeeg u sameeyay hal qoraal oo ummadda oo dhan ah.",
      "Eebbana waa u dammaanad qaaday ilaalinta Qur’aanka:- Annagaa soo dejinay Quraanka, waana ilaalinaynaa. Ballan-qaadkaas waxa lagu fuliyay saddex ilaalin oo is-dhex-gal ah - xifdi badan oo jiil walba ah, gudbin qoraal ah oo taxaddar leh, iyo silsilado akhrin ah oo macallin-ilaa arday (qiraat) oo dib loogu soo celinayo Nabiga ﷺ. Qofka rumaysadka leh tani waxay calaamad fiqi ah u tahay; Taariikhyahanku waa xaqiiq la diiwaan galiyay: Qur'aanka maanta la akhriyay waa isla qoraalkii la soo dejiyay afar iyo toban qarni ka hor.",
    ],
    quran: [
      {
        excerpt: "Anagaa soo dajinay Quraanka waana ilaalinaynaa.",
      },
      {
        excerpt: "ku akhri magaca Eebahaa abuuray...",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Structure of the Qur'aanka",
    summary: "114 suuradood, 30 juz, aayadaha, Makki/Madani, amar vs waxyiga.",
    body: [
      "Musxafka - Nuqulka Qur'aanka Kariimka - wuxuu ka kooban yahay 114 suuradood (cutubyo), mid walbana magaciisa, oo inta badan laga soo qaatay kelmad cajiib ah oo ku dhex jirta. Waxay u habaysan yihiin inta badan min ka ugu dheer ilaa kan ugu gaaban, inkasta oo aan si adag loo dhigin: Al-Faatixa, cutubka furitaanka gaaban, ayaa ugu horreeya albaabka kitaabka, iyo Al-Baqarah oo dheer. Habbayntani waa tawqifi - amarka waxaa baray nabiga ﷺ Jibriil ee ma aha sida ay aayadaha u soo degeen. Haddaba tixda aad ku akhriday musxafku waa mid ku talagal ah oo rabbaani ah, ee maaha mid soo taxnaa.",
      "Suurad kasta waxaa loo kala saaraa Makki (waxay soo degtay Hijrada ka hor) ama Madani (soo dagtay ka dib), in yar oo ka mid ah waxay ka kooban tahay Aayado ka kooban. Sida caadiga ah, suuradaha Makki waxay xoogga saaraan rumaynta - tawxiidka, sarakicidda, iyo qisooyinka nebiyada - oo ka kooban tuducyo gaagaaban oo degdeg ah, halka suuradaha Madani ay ku daraan sharciga faahfaahsan iyo hagida bulshada ee bulshadu u baahan tahay. Ogaanshaha kan ku caawinaya inaad akhrido suurad iftiinkeeda ku habboon.",
      "Akhriska la maarayn karo, Qur’aanku waxa kale oo loo qaybiyaa 30 qaybood oo isle’eg oo la yidhaa juz (jacza jamac), juz kastana waxa loo qaybiyaa laba qaybood oo loo yaqaan xizb, isaga oo wadar ahaan bixinaya 60 xizbi. Tani waa waxa ka dhigay khaatka Ramadaan - in Qur'aanka oo dhan lagu dhammeeyo bil gudaheed - si dabiici ah: hal juz maalintii waxay ku dhammaysataa kitaabka soddon maalmood, iyo nus-juz laba jeer maalintii ayaa weli ka sii dabacsan. Suurad kasta dhexdeeda Aayadaha (Aayadaha) ayaa lagu tiriyaa si ay tuduc kasta u qeexdo sida suuradda: Ayah; Tirada caadiga ah ee Madiinah waa 6,236 aayadood, oo leh farqi aad u yar oo si fiican loo diiwaan galiyay oo ku saabsan sida dhowr aayado loo tiriyey - qoraalka laftiisa waa isku mid.",
      "Fahamka qaab-dhismeedkan waxa uu ujeeddooyinka aan caddayn u beddelaa qorshe la taaban karo. Waxaad samayn kartaa qayb maalinle ah oo go'an, bartilmaameedka Juz Ammaa (qaybta u dambaysa, qaybta sodonaad, oo ay ka buuxaan suurado gaagaaban) si aad u xifdiso, raac hal mawduuc sida samirka dhawr suuradood, ama aad jadwal u samayso akhrin dhamaystiran bisha Ramadaan. Qaabdhismeedku waa jaan-goynta ka dhigaysa xidhiidhka nolosha oo dhan ee Qur'aanka la gaadho.",
    ],
    quran: [
      {
        excerpt: "... waa Kitaab aayaadkiisa caddayn, waana Quraan Carabi ah ciddii wax garan.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Learn to read",
    summary:
      "Toddoba heerar laga bilaabo alifbeetada ilaa akhrinta faseexa ah - ee bilawga saxda ah.",
    body: [
      "Ku dhawaad ​​qof kasta oo Muslim ah waxa uu xiiseeyaa in uu Qur'aanka ku akhriyo Carabigiisii ​​asalka ahaa, waana yoolka uu si buuxda u gaadhi karo da' kasta - dadka waaweyn ee aan tira-koobka lahayn ee aan Carabi hore lahayn waxay bartaan inay si fiican wax u akhriyaan. Fahamka tarjumaada waa mid qiimo leh, laakiin akhrinta erayada dhabta ah ee Carabiga lafteeda waa cibaado, waana mid mudan in lagu dadaalo. Jidkani waxa uu talaabo talaabo kaa qaadayaa in aanad aqoonsan hal xaraf oo aad akhrido aayado si sax ah ugu dhawaaqaysa.",
      "Socdaalku waxa uu maraa todoba marxaladood oo dabiici ah. Heerarka 1 iyo 2 waxay dhisaan aqoonsiga xarfaha - marka hore 28 xaraf oo qaabkooda goonida ah, ka dibna sida qaabkoodu isu beddelo bilawga, dhexe, iyo dhammaadka ereyga. Heerka 3aad wuxuu soo bandhigayaa xarakaadka, calaamadaha yaryar (fatha, kasra, damma, sukun, shaddah, taween) ee kuu sheegaya shaqalka xaraf kasta uu sido. Heerarka 4 iyo 5 waa halka ay gujiso: waxaad ku biirtaa xarfaha xarfaha xarfaha oo aad ka dhawaajisay erayo dhan, oo ay ku jiraan xeerarka xarafka qorraxda iyo dayaxa ee qodobka qeexan 'al-'. Heerarka 6 iyo 7 waxay u guuraan aayado gaagaaban ka dibna si habsami leh, akhrin hufan leh oo leh xeerarka aasaasiga ah ee tajwiidka.",
      "Laba caado ayaa wax walba dardargeliya. Marka hore, si joogto ah u dhegayso akhristaha aqoonta leh oo ku daydo sida saxda ah - Qur'aanka waxaa loo gudbin jiray dhegta, afka ilaa afka, markaa dhegtaadu waa macalinkaaga ugu fiican; nuqul ka samee laxanka, dhererka shaqallada, iyo qaabka dhawaaq kasta. Laba, raad raac oo ku qor xarfaha, warqad ama shaashad, sababtoo ah gacantu waxay xoojisaa waxa isha iyo carabku bartaan.",
      "Hal taxaddar: abka iyo duubista ayaa ah taageero aad u fiican, laakiin kuma sixi karaan sida uu qofku awoodo. Rasuulku ﷺ Qur’aanka ayuu si toos ah uga bartay Jibriil, wuxuuna u baray saxaabada waji ka waji, iyo in silsiladda toosan ee nooluhu ay tahay sida akhrinta saxda ah loo ilaalin jiray. Raadi macalin maxali ah ama barnaamij online tajwiid ah oo habaysan si uu ku dhagaysto oo uu u saxo khaladaadka aadan adigu maqli karin.",
    ],
    actions: [
      "Hal xaraf ku baro maalintii xarfaha Carabiga - arag, maqal, dheh, qor.",
      "Dhageyso Suuratu Faatixa oo ku celcelinaysa adigoo raacaya kalimada musxaf.",
      "Diyaarso macalin - maxali ah ama online - si uu kuugu maqlo akhrinta oo ku saxo toddobaad kasta.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tajweed",
    summary:
      "Xeerarka akhrinta qurxoon iyo kuwa saxda ah - duhurkii sakin, madd, waqf, iyo in ka badan.",
    body: [
      "Tajwiidku waxa uu ka soo jeedaa asal micneheedu yahay in la sameeyo wax aad u wanaagsan ama qurux badan. Saynis ahaan waxa ay la macno tahay in xaraf kasta la siiyo mudnaanteeda - barta saxda ah ee hadalka afka ama dhuunta (makhraj), sifooyinkeeda ku jira (sifat), iyo wakhtiga ku habboon ee shaqallada iyo hakadyada. Marka la soo koobo, tajwiidku waa fanka lagu akhriyo Qur’aanka sida uu u soo degay.",
      "Tani waxay khusaysaa sababtoo ah Qur'aanku maaha kaliya qoraal kasta oo si fudud loo akhriyo. Waxay ku soo degtay tajwiid oo hore loogu dhisay: Jibriil ayaa u akhriyay nabiga s.c.w isaga oo si sax ah ugu dhawaaqay, nabigu s.c.w si lamid ah saxaabada ayuu u akhriyay, wayna noogu soo gudbiyeen si aan jabin. In xarafka la qaldama wax yar ma aha - ku dhawaaqida xarafku waxay bedeli kartaa ereyga gebi ahaanba (tusaale ahaan in lagu khaldo ص aadka xoogga leh iyo س cad, ama xuruufta dhuunta ع iyo ح), iyo meelaha qaarkood oo beddela macnaha ereyga Alle. Cilmiga tajwiidku waxa uu u jiraa in uu taas iska ilaaliyo.",
      "Uma baahnid inaad wax walba hal mar qabsato. Xeerarka xudunta u ah waxaa loo bartaa sida ay u kala horreeyaan: axkaamta sakiinah iyo tanween (izhar, idgham, iqlab, ikhfa), xukummada meem sakinah, noocyada kala duwan ee madd (dheeraynta), qalqalah (iftiinka xarfaha qaarkood), ghunnah (sanka resonance), iyo waqf (meesha iyo sida loo joojiyo). Mid kastaa wuxuu leeyahay qeexitaan cad, tusaaleyaal maalinle ah, iyo wax lagu dhaqmo, xuduntana waxay dhex martaa mid mid.",
      "Xeerka suulka adag: ka baro tajwiidka dhegta macalin u qalma, hana ka baran buugaag ama apps kaligiis. U akhri qof khaladkaaga maqli kara oo saxi kara - sidan ayaa mar walba loo baran jiray tajwiidka, waana dariiqa kaliya ee lagu kalsoonaan karo ee lagu gaari karo saxsanaanta dhabta ah iyo, ugu dambeyntii, ijazah (silsilad la xaqiijiyay oo akhris ah).",
    ],
    hadith: [
      {
        excerpt: "Waxaa idiinku kheyr badan kuwa quraanka barta oo bara.",
      },
      {
        excerpt:
          "Qofka quraanka ku xeel dheer wuxuu la joogaa culimadii sharafta lahayd ee xaqa ahayd, kii akhriya isagoo dhib ku ah, isagoo ku turunturooday, wuxuu leeyahay laba ajar.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Arabic letters",
    summary: "Alifbeetada is dhexgalka - magaca, codka, tusaalooyinka mid kasta oo 28 xaraf ah.",
    body: [
      "Alifbeetada Carabiga waxay leedahay 28 xaraf, oo qoran oo akhriya midig ilaa bidix. Si ka duwan Ingiriisida, xarfaha intooda badani waxay ku xidhmaan kuwa agtooda ah, markaa xaraf keli ahi wuxuu yeelan karaa qaab yar oo ka duwan iyadoo ku xidhan haddii uu keligii taagan yahay ama uu fadhiyo bilowga, dhexda, ama dhammaadka ereyga. Barashada in lagu ogaado xaraf isku mid ah qaababkeeda kala duwan waa mid ka mid ah horumarada dhabta ah ee ugu horreeya.",
      "Lakabyada Carabiga Qur'aanku wuxuu dulsaaraa dhowr astaamood oo dheeri ah oo ka mid ah xarfaha aasaasiga ah: hamza (Glottal stop), xarfaha shaqallada dhaadheer ee alif, waw, iyo ya ee dhawaaqa fidiya, iyo xarafka qorraxda iyo dayaxa oo go'aaminaya in 'l' ee qodobka qeexan ee 'al-' lagu dhawaaqo ama si aamusnaan ah loogu daro xarafka xiga. Kuwani waa sahlan yihiin markaad la kulanto ereyo dhab ah.",
      "Kaar kasta oo xaraf ah oo ku jira qaybtan ayaa ku siinaysa qaabka goonida ah ee xarafka, magaciisa, tarjumaad, tilmaamo ku dhawaaqid oo dhab ah, iyo tusaalooyin Qur'aan ah oo dhab ah si aad codka uga barato macnaha guud halkii aad ka baran lahayd nuxurka. Habka ugu waxtarka badan waa afar tallaabo oo loop ah xaraf kasta: arag, maqal iyada oo la akhrinayo, kor u sheeg naftaada, ka dibna qor.",
      "Ku dheji xaraf kasta oo cusub erayada aad hore u aqoonsan karto - Allah, Rabb (Rabbi), ar-Raxman (Raxmaan), Bismillah. Ku xidhida qaababka aan la aqoon macnaha la yaqaan ayaa ka dhigaysa inay aad uga dheereeyaan xarfaha go'doonsan.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ku dhawaaqida",
    summary: "Si fiican u yaqaan xarfaha adag - ayn, ha, murugo, aabe, qaaf, iyo xoojinta.",
    body: [
      "Carabiga waxaa ku jira dhawaqyo dhowr ah oo aan lahayn wax u dhigma oo Ingiriisi ah, waana halka kuwa aan ku hadlin inta badan ay simbiriirixdaan. Jahwareerka ugu caansan waa inta u dhaxaysa xarfo u eg dhegta aan la tababbarin laakiin laga sheego meelo kala duwan oo afka ama dhuunta ah - oo la isku daro waxay bedeli kartaa macnaha ereyga, waana sababta ay u qalmaan ku-dhaqanka gaarka ah.",
      "Xarfaha xoogga leh - ṣ (ص), ḍ (ض), ṭ (ط), iyo ẓ (ظ) - waa noocyada 'culus' ee xarfo fudud. Si aad iyaga u soo saarto waxaad kor u qaadaysaa dhabarka carrabka oo aad afka ka buuxinaysaa cod buuxa oo qoto dheer, wax dadka ku hadla afka hooyo ay nuugaan carruurnimada laakiin ardaydu waa inay si miyir leh u dhistaan. Is barbar dhig mid kasta oo xoogga saaraya si toos ah dhiggiisa iftiinka: س against ص, د against ض, ت against ط, ذ against ظ.",
      "Xarfaha dhuunta ayaa ah caqabadda kale ee weyn. Cayn (ع) waa cidhiidhi laga dhawaajiyey oo ka yimid dhuunta badhtankeeda, ha (ح)na waa is-jiidh xoog leh oo neefsasho leh - midna kuma jiro Ingiriisi, mana jirto sharraxaad qoran oo si buuxda u beddeleysa maqalkooda. Qaf (ق) waa 'k' qoto dheer oo ka soo jeeda dhabarka carrabka, kana duwan kaf hore (ك).",
      "Habka la isku halayn karo waa in la is barbar dhigo lammaane dhinac, ka dibna iska hubi akhrinta murattal si tartiib ah oo cad. Ku duub codkaaga adiga oo ku akhrinaya kelmad gaaban, ku ciyaar kan wax akhriya, oo hagaaji. Xitaa ka sii wanaagsan, ha maqlo macalin aqoon leh - khaladaadka qaar ayaa ku dhow inaan la qabsan karin duubistaada.",
    ],
    appLinks: [{}],
  },
  {
    title: "Erayada Qur'aanka",
    summary: "Erayada soo noqnoqda - aad u fahan mar kasta oo aad akhrido.",
    body: [
      "Halkan waxaa ah xaqiiqo dhiirigelin leh: ereyo aad u yar oo soo noqnoqonaya - oo u socda dhawr boqol - ayaa ka dhigan qayb aad u weyn oo ka mid ah qoraalka socda ee Qur'aanka, sababtoo ah isla ereyada muhiimka ah ayaa soo noqnoqda marar badan. Barashada ereyada xudunta u ah waa tallaabada kaliya ee ugu sareysa ee aad qaadi karto, sababtoo ah waxay ka beddeshaa akhrinta qulqulka dhawaaqa ereyo dhab ahaantii aad macnahooda qabato markaad wax akhrinayso.",
      "Uma turjumi kartid Qur'aanka eray ahaan sidan - taasi waa shaqada tafsiirka iyo tarjumaadda - laakiin waxaad bilaabaysaa inaad aqoonsato magacyada Eebe, amarrada, ballamaha iyo digniinta si toos ah, xilliga akhrinta. Ku bilow kelmadaha ugu muuqda oo xanbaarsan kuwa ugu miisaanka badan: Allaah, Rabb (Rabbi), raxmah (naxariista), iimaanka, sabir (sabir), taqwa (Adduunyada), iyo aakhiro (Aakhiro). Laga soo bilaabo barroosinkaas, u fidi dibadda marba.",
      "Isticmaal ku celcelin meel bannaan halkii aad ka cuni lahayd. Barashada shan kelmadood oo cusub todobaadkii iyo dib u eegista dhamaantood maalin kasta waxay kaa qaadi doontaa wax aad uga sii fog sanad gudaheed intii aad ku xafidi lahayd kontanka hal fadhi oo aad ilowdo. Eebe wuxuu ballan qaaday in Qur'aanka loo fududeeyay in qalbiga lagu qaato - si joogto ah u wajahdo ereybixintiisa oo aad dareemi doonto si fudud.",
    ],
    quran: [
      {
        excerpt: "(44) Waxaan u fududaynay Quraanka xusuus darteed ee ma jirtaa cid wacdoomi.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Tafsiir",
    summary: "Fahamka muujinta - dulmar, macnaha guud, iyo ilaha cilmi ee la aqoonsan yahay.",
    body: [
      "Tafsiir macneheedu waxa weeye sharraxaadda iyo tafsiirkii quraanka - caddaynta macnaha aayad, sababta ay u soo degtay iyo sida ay u khusayso. Maxaa yeelay waa qawlkii Alle, culimadu waxay dejiyeen nidaam adag oo ku saabsan sida Qur’aanka loo fasiri karo, ku joogsashadiisana waxay kaa ilaalinaysaa baadilka.",
      "Tafsiirka ugu codka badan waa Qur'aanka oo is sharaxaya: Aayad kooban oo meel ku taal ayaa inta badan meelo kale lagu sii fidiyaa, markaa Qur'aanku waa tafsiirkiisa ugu wanaagsan. Waxaa ku xiga sharraxaadda sunnaha, maadaama Nabiga ﷺ loo soo diray si sax ah si uu u caddeeyo waxyiga oo hadalkiisa iyo ku dhaqankiisuba ay ina tusaan sidii loo noolaaday. Intaa ka dib waxaa imanaysa fahamkii saxaabadii oo markhaati ka ahaa waxyiga oo si toos ah u yaqaanay nuxurkiisa, waxaana ku xiga culimadii waaweynayd ee iyaga ka dambaysay. Ugu dambeeya iyo kan ugu hooseeya waa tarjumaada luqadda Carabiga lafteeda. Waxa aan meelnaba haysan waa ra'yi shakhsi oo aan u qalmin - ku akhri fikradahaaga qoraalka.",
      "Qalabka muhiimka ah ee tafsiirka waa asbab al-nuzul, waqtiyada waxyiga: ogaanshaha dhacdada ama su'aasha keentay aayad inta badan macnaheeda ayaa furto. Laakiin warbixinnadan laftooda waa in la xaqiijiyaa, mar haddii aan la isku hallayn karin 'dhacdo' kasta oo laga sheekeeyo. Suurad kasta, tafsiirka wanaagsan wuxuu ku siinayaa meesheeda taariikheed halkay ku qotonto, mawduucyadeeda waaweyn, aayadaha muhiimka ah, iyo duruusta wax ku oolka ah ee aad qaadi karto.",
      "Tixraacyada aadka loo aqoonsan yahay ee lagu kalsoonaan karo waxaa ka mid ah Tafsiir Ibnu Kathiir (si faahfaahsan oo taxaddar leh oo loo daliishado xadiiska iyo odhaahyada facii hore), Tafsiir As-Sacdi ( cad, casri ah, oo diiradda saaraya hanuuninta dhabta ah), iyo Tafsiir al-Tabari (encyclopaedic, ilaalinta tafsiirrada ugu horreeya). Mar kasta oo aad macne barato, ogow isha ay ka timid. Xudduntani waxay baraysaa habka; u isticmaal akhristaha Qur'aanka Munib ee isku xidha tafsiirka iyo tafsiirka fog, aayad-aayad.",
    ],
    sources: [
      "Tafsiir Ibn Kathir - af Ingiriis oo la soo koobay oo si weyn loo heli karo",
      "Tafsiir as-Sa'di - kooban oo la heli karo",
      "Asbab al-Nuzul oo uu qoray al-Wahidi - munaasabadaha waxyiga (xaqiiji xaqiiqada dhacdada kasta)",
    ],
    disclaimer:
      "Tafsiirka ayaa si qoto dheer u kala duwan. Marka ay culimadu khilaafaan, bal u fiirsada kala duwanaanshaha idinkoo hubsan meel uusan Alle caddayn.",
    appLinks: [{}],
  },
  {
    title: "Mawduucyada Quraanka",
    summary: "Iimaan, duco, samir, samafal, nebiyada - aayadaha lagu kooxeeyay by mawduuca.",
    body: [
      "Quraanku maaha mid loo dejiyey sida buugaag oo kale, hal maado cutubkiiba. Taa beddelkeeda mawduucyadeeda waaweyn - kalinimada Eebe, salaadda, dulqaadka, sadaqada, nebiyada, aakhiro, caddaaladda, qoyska - waxay ku xidhan yihiin oo dhan, soo muuqda oo dib uga soo muuqanayaan suurado badan, mar kasta oo ka soo jeeda xagal cusub. Waxa u muuqda marka hore sida ku celcelinta dhab ahaantii xoojin: mawduuc ayaa la soo bandhigay, ka dibna la qotomiyey, ka dibna ku xiran mid kale, ilaa fariinta oo dhan ay u taagan tahay hal wicitaan oo isku xiran.",
      "Dulucda Qur'aanka oo lagu barto waxay muujinaysaa midnimadaas. Marka aad soo ururiso waxa uu Quraanku ka sheegay, ku mahad naq ama talo saarta Alle suuradihiisa, aayadaha kala duwan ayaa midba midka kale iftiiminayaa, casharkuna wuxuu noqonayaa mid muuqda oo dhammaystiran. Mawduuc kasta oo laga soo galo xudduntan waxa ay isu keentaa aayadaha khuseeya, iyaga oo taageeraya xadiiska saxeexa ah halkaas oo ay ku darayaan caddayn, duruusta asaasiga ah, iyo ficillada la taaban karo si aanay aqoontu u sii ahaan aragti ahaan.",
      "Waxa ugu sarreeya, ku xidh mawduucyada noloshaada. U roonaanta waalidka, daacadnimada ganacsiga, caddaaladda guurka, u istaagidda caddaaladda xitaa adiga oo ka soo horjeeda dantaada - kuwani maaha cutubyo aan la taaban karin oo lagu majeerto laakiin go'aannada maalinlaha ah ee Qur'aanka ayaa ku weydiinaya inaad qaadato. Mawduuc kasta u akhri sida su'aal adiga shakhsi ahaan kuugu toosan: sidee ayay tani u beddeshaa waxa aan sameeyo maanta?",
    ],
    appLinks: [{}],
  },
  {
    title: "Stories in the Qur'aanka",
    summary:
      "Nabiyada laga soo bilaabo Aadam ilaa Muxammad ﷺ - duruus, goobo, aayadaha la xiriira.",
    body: [
      "Qur'aanku wuxuu ka warramay qisooyinka nebiyada - Aadam, Nuux, Ibraahim, Yuusuf, Muuse, Ciise, iyo kuwo kale oo badan - wuxuuna si cad inoogu sheegay sababta: 'Sheekooyinkooda waxaa ku sugan cashar kuwa wax fahma.' Xisaabaadkani maaha sheeko sheeko ama madadaalo. Waa dardaaran, doortay oo Alle u sheegay inay barayaan iimaanka, samirka, iyo sidii loo wajihi lahaa imtixaannada soo noqnoqda ee xilli kasta.",
      "U fiirso qaabka iyaga dhex mara. Nebiyadu waxay dadkooda ugu yeedhi jireen cibaadada Alle oo keliya; waa la majaajilooday, laga soo horjeeday, inta badana waa la eryi jiray; waxay u samreen samir iyo talo-saar dhammaystiran oo Eebbe (tawakkul); aakhirkiina ballankii Alle wuu rumoobay. Markaad akhrido dhibkooda, ka hel xoog sida ay uga jawaabeen - adigoon waligaa qiyaasin darajadaada inay la mid tahay kooda. Ujeedadu waa in la dhuuxo adkaysigooda iyo kalsoonidooda, ee maaha in la is barbar dhigo heerka.",
      "Qur’aanka qudhiisu wuxuu soo qaatay hal qiso oo ah suuradda Yuusuf oo Eebbe ugu yeedhay ‘sheekooyinka ugu wanaagsan’. Si aan caadi ahayn waxa looga sheekeeyaa min bilow ilaa dhamaad suurad qura, hadaba hal fadhi ku akhri safar joogto ah – khiyaamo, samir addoonnimo iyo xabsi, ugu dambayntiina cafis iyo isu-keenid – bal eeg sida qorshaha Eebbe u dhacayo sannado badan oo musiibo muuqata ah.",
    ],
    quran: [
      {
        excerpt: "Sheekadoodu runtii waxay cashar u tahay kuwa wax fahma…",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Miracles of the Qur'aanka",
    summary: "La'aanta luqadda, ilaalinta, waxsii sheegyada - oo leh taxaddar cilmiyeed.",
    body: [
      "Mucjisada dhexe ee Qur'aanku waa Qur'aanka laftiisa. Waxa daaha ka qaaday nin aan wax qorin oo waagii ugu afka dheeraa ee maansada Carabiga, waxa ay soo saartay caqabad furan oo ku wajahan dadkii ka soo horjeeday ee aadka u yaqaanay - macalimiintii afka - in ay soo saaraan xitaa hal suurad oo la mid ah. Afar iyo toban qarni ka dib caqabadaas waa mid aan la daboolin. Awooddeeda aftahanimo, qaab dhismeedkeeda, sida mawduucadiisu isula falgalaan, isku-xidhnaanta hanuuninteeda iyo sharcigeeda waxa lagu daraaseeyaa cilmiga qadiimiga ah ee aftahanimada (ilm al-balagha), waxayna ku hadhsan yihiin, sheegashada Qur’aanka kariimka ah.",
      "Ilaalinteedu waa calaamad labaad, oo la xaqiijin karo. Qoraalka waxaa lagu ilaaliyay qoraal ahaan, qoraal-gacmeedyo si taxadar leh loo gudbiyay, iyo hadal ahaan, iyadoo loo marayo qiraat - silsilado akhriyeyaal ah oo aan kala go'in oo xafiday oo baraya si sax ah, jiilka ka dambeeya. Taasina waa taariikh qoran, ee ma aha mala-awaal cibaado leh, waxayna oofinaysaa ballankii Eebbe ee ahaa inuu xuska ilaalinayo.",
      "Waxaad sidoo kale maqli doontaa wax ku saabsan 'mucjisooyinka sayniska' - aayadaha taabanaya marxaladaha embriyaha, ballaarinta kosmada, iyo wixii la mid ah. Handle these with care. Tafsiirka qadiimiga ah wuxuu inta badan u fahmi jiray aayadahan siyaalo aad uga duwan rali-galiyayaasha casriga ah, ku qasbida Qur'aanka in uu la jaanqaado mala-awaal cilmiyeed kasta oo isbedelaya waxay dib u noqon kartaa marka ay aragtiyadu isbedelaan. Si adag u kala saar tafsiir sugan iyo malo-awaalka casriga ah.",
      "Waxsii sheegyada taariikhiga ah ayaa sidoo kale soo xigtay culimadu - guushii la sii sheegay ee Roomaanka, furitaanka nabada ee Makkah - waxayna mudan yihiin in la barto, laakiin iyada oo loo marayo tafsiirka miyir-qabka ah iyo seerah, ma aha muuqaallo muuqaal ah. Dacwada ugu adag ee Qur’aanku mar walba waa tawxiidkiisa, akhlaaqda dadka oo beddeshay, iyo af iyo ilaalin aan la isku mid ahayn.",
    ],
    quran: [
      {
        excerpt: "Markaas la yimaada suurad la mid ah... haddaad run sheegaysaan.",
      },
    ],
    disclaimer:
      "Ka fogow sheegashada mucjisooyinka cilmiyeed ee la buunbuuniyay ee ka xishooda daawada marka la eego. Ku hoggaami tawxiidka, akhlaaqda, iyo daliilka quraanka ee af iyo taariikheed.",
  },
  {
    title: "Memorization (Hifz)",
    summary:
      "Qorshayaasha laga bilaabo Juz Amma ilaa hifz buuxa - dib u eegis, maqal, yoolal maalinle ah.",
    body: [
      "Xifdidda Qur'aanka (hifz) waa mid ka mid ah waxyaabaha ugu fadliga badan nolosha qofka mu'minka ah, mana aha mid u gaar ah culimada iyo carruurta - dadka waaweyn ayaa iyaguna dhammaystira. Rasuulku (scw) wuxuu baray in maalinta qiyaame qofkii sitay Qur’aanka lagu odhan doono, ‘Akhri oo kor,’ isagoo aayad kasta darajo u qaadaya. Ka bilow meesha uu qof walba ka bilaabayo: Suuradda al-Faatixa, oo aad horay u akhriday salaad kasta, ka dibna suuradaha gaagaaban ee dhamaadka Musxafka, adoo dib u shaqeynaya.",
      "The most important lesson in hifz is counter-intuitive: revision (muraja'ah) matters more than adding new material. Rasuulku ﷺ wuxuu ka digay in Qur'aanka xifdisan uu si degdeg ah u simbiriirixdo intay geel xidhani jabin - iska daa iyada oo aan dib loo eegin oo uu tagaa. Markaa sharcigu waa mid fudud oo adag: waligaa ha ku darin qayb cusub ilaa aad si adag dib u eegis ugu sameyso waxa aad hore u haysatid. In yar oo la xafiday ayaa si adag u garaaca wax badan oo si dabacsan loo xafiday.",
      "Habka wax ku oolka ah: isticmaal ku celcelinta kala fog, ku dheji hal akhriye si ay laxanka laftiisa u tilmaanto xusuustaada, ka akhri xusuusta maalin kasta halkii aad akhrin lahayd oo keliya, macalinka ha maqlo oo calaamadee khaladaadkaaga - khaladaadka aadan maqli karin naftaada. Rikoorada hifz ee Munib ayaa hoos u socda ilaa aayadda gaarka ah si aad had iyo jeer u ogaato waxa ku habboon dib u eegista.",
      "Dooro qorshe ku habboon marxaladaada. Bilow: xifdi Juz Camma, qaybta u dambaysa, oo ay ka buuxaan suurado gaagaaban. Dhexdhexaad: ku dar toban suuradood oo had iyo jeer la akhriyo sida al-Mulk, Ya-Sin, iyo al-Kahf. Sareeye: buuxi juz buuxa oo leh dib u eegis xoogan wax kasta oo ka horreeya. Iyo Safarkii Xaafiis: Musxafka oo dhan, oo lagu xafiday macalin aqoon leh iyo, ugu fiican, sanad - silsilad la xaqiijiyay oo dib loogu celinayo Nabiga ﷺ.",
    ],
    hadith: [
      {
        excerpt:
          "Saxaabigii Qur’aanka waxa lagu odhan doonaa: akhri oo kor sidaad wax u akhrin jirtay aduunka, darajadaadu waxay ahaan doontaa aayada ugu dambaysa ee aad akhrido.",
      },
      {
        excerpt:
          "Saxaabigii qur’aanku masaalku waa kii geel xidhxidhan lahaa: hadduu dhawro wuu dhawraa, hadduu daayona wuu waayi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Casharrada maalinlaha ah",
    summary: "Hal tuduc, macnaha guud, milicsiga, iyo ficil - maalin kasta.",
    body: [
      "Xidhiidhka nolosha oo dhan ee Qur'aanka waxa loo dhisay si la mid ah hab kasta oo caado qoto dheer loo dhiso - in yar, maalin kasta, iyada oo aan guul darrayn. Rasuulku ﷺ wuxuu baray in camalka Alle loogu jecel yahay ay yihiin kuwa si joogto ah loo sameeyo, xitaa haddii ay yar yihiin, mabda’aasi waa fikradda guud ee ka dambeysa casharka maalinlaha ah. Mid kastaa wuxuu ku siinayaa hal aayad oo Carabi ah, tarjumaaddeeda, qoraal ku saabsan xaaladdeeda taariikheed, su'aal milicsi oo aad la fadhiisato, iyo hal fal oo la taaban karo oo aad maalintaada ku gudato.",
      "Aayadahan ula dhaqan sida hanuun noole, oo aanad akhriyin. Ku calaamadee kuwa qalbigaaga ku dhufanaya, u soo noqo, oo la wadaag wixii ku dhaqaajiyay qoyskaaga - marka qof kale ku sameeyo wanaag aad soo martay, abaalkeeduna adigana wuu soo gaadhayaa, markaa waxbariddu waxay kordhisaa faa'iidada.",
      "Inta yar yaanu ku khiyaanayn. Joogteynta waxay garaacdaa xoogga mar kasta: shan daqiiqo oo daacad ah oo Qur'aanka ah maalin kasta waxay kuu beddeli doontaa wax ka badan saacad dhif ah, geesinimo bishiiba mar. Maalin walba ismuuji, oo maalmuhu ha urursadaan.",
    ],
    appLinks: [{}],
  },
  {
    title: "Milicsi (Tadabbuur)",
    summary: "Su'aalaha la hagayo - muxuu Eebbe baraa, sideese ugu noolaan doontaa?",
    body: [
      "Tadabbuur macneheedu waxa weeye in aad si qoto dheer uga fiirsato Qur'aanka, qalbigana aayad ku rogrogto ilaa ay ku dhaqaajiso in aad wax ka beddesho. Waa amar toos ah, ma aha mid ikhtiyaari ikhtiyaari ah: Eebe wuxuu weydiinayaa, 'Miyayna Quraanka u fiirsanin, mise quluubtooda ayaa ku xiran?' Ujeedada akhrintu weligood may ahayn dhawaaq - waxay ahayd in la gaadho qalbiga oo dib loo qaabeeyo nolosha.",
      "Tadabbuur la mid ma aha tafsiirka. Tafsiirku waa sharraxaadda cilmiyeed ee macnaha aayaddu; tadabbur waa jawaabtaada shakhsi ahaaneed, ixtiraam leh macnahaas markaad fahamto. Labaduba way isla shaqeeyaan: marka hore waxaad ka baranaysaa macnaha dhawaaqa tafsiirka, ka dib waxaad la fadhiisataa oo weydii sida uu kula hadlayo. Qaabka waxtarka leh waa saddex su'aalood - Muxuu Alle halkan igu baraya? Sidee tani u beddeshaa waxa aan sameeyo maanta? Waa maxay hal caado oo ay tahay inaan dhiso ama jebiyo?",
      "Hal xuduud adag ayaa ilaalinaysa tadabbur ammaan: ka fiirso waxa aayaddu ku waydiinayso, laakiin weligaa ha u abuurin macne cusub qoraalka laftiisa. Tafsiirka dhabta ahi ha dejiyo xadka tafsiirkiisa, fikirkaaga shakhsi ahaaneedna halkooda ha dhigo - joornaal gaar ah, sida Muniib, ayaa ku habboon in la soo qabto waxa aayad kugu kicisay oo aad dib ugu soo noqon karto.",
    ],
    quran: [
      {
        excerpt: "Miyayna Quraanka u fiirsanayn mise Quluubtooda quful baa ku sugan.",
      },
      {
        excerpt:
          "Miyayna Quraanka u fiirsanayn. Hadday ka ahaan lahayd mid Eebe ka soo hadhay waxay ka heli lahaayeen khilaaf badan.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qur'aanka ku dhaqan",
    summary: "Caqabadda maanta ee aayadda - dhamaystirka raadraaca, noolow aayadda.",
    body: [
      "Aqoonta Qur'aanka waxaa loola jeedaa inay noqoto ficil. Eebe wuu naqdiyay kuwii naga horreeyey ee kitaabka akhrin jiray, isagoo ku yidhi, “Ma waxaad faraysaan kuwa kale wanaag ood illowdaan naftiinna idinkoo akhrin Kitaabka. Quraanku waa axdi idinka dhexeeya adiga iyo Rabbigiin, aayad walbana si aamusnaan ah ayay wax kuugu waydiinaysaa - su'aashu waxay tahay miyaad ka jawaabtay.",
      "Taasi waa waxa caqabadahaas loogu talagalay. Mid kastaa waxa uu aayad gaar ah ku xidhayaa hal-abuurnimo, dhaqan la samayn karo maanta oo ah: in aad carrabkaaga ku ilaaliso hadal wanaagsan, bixinayso sadaqo deggan, ka fiirsigaaga waxa xaaraanta ah, iska daaya cuqdada aad qaaday. Hal tuduc, hal fal - yar oo ku filan in la sameeyo, dhab ah oo kugu filan in lagu beddelo.",
      "Calaamadee tartanku inuu dhammaystiran yahay kaliya markaad si dhab ah u samaysay. Ujeeddada raadraaca lama soo bandhigayo - taasi waxay jabinaysaa ujeeddada - laakiin la xisaabtanka daacadda ah ee Eebe, kaas oo arka waxaan dadka kale samayn. Muddo ka dib, aayad aayad, sidan ayaa akhrintu isku beddeshaa dabeecad.",
    ],
    quran: [
      {
        excerpt:
          "Ma waxaad faraysaan xaqa dadka od halmaansantihiin naftiinna idinkoo akhrin Kitaabka.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Kedis quraanka",
    summary: "Dib u eeg magacyada suuradda, qaabdhismeedka, tajwiidka, erayada, iyo sheekooyinka.",
    body: [
      "Tijaabi naftaada waa mid ka mid ah siyaabaha ugu waxtarka badan ee looga dhigi karo aqoonta - dib u soo celinta jawaabta waxay xoojisaa xusuusta in ka badan dib-u-akhrinta. Kediskaani wuxuu soo qaadanayaa wax kasta oo ka jira xuddunta: tirada suuradaha iyo juzka, soo dajinta ugu horraysa iyo sida quraanka loo xafiday, tajwiidka axkaamta sida madd iyo qalqalah, erey-bixin aad u badan, iyo nebiyadii uu qur'aanku qisadooda ka waramay.",
      "Ulajeedada sax. Dhibcuhu waa muraayad kaliya ee barashadaada - marna maaha cabbir darajadaada Alle agtiisa, kaas oo isagaa iska leh. Isticmaal su'aal kasta si aad u muujiso meel daciif ah, ka dibna ku soo celi casharka isku midka ah oo si sax ah u darso mawduucaas halkii aad ka raadin lahayd lambar.",
      "Dareenka kama dambaysta ahi waa milicsi ee maaha su'aal la qiimeeyay: dooro hal suurad ama tuduc si aad u fahanto oo aad u xifdiso xiga, markaa dib u eegistaadu had iyo jeer waxay ku dhammaataa adiga oo dib kuugu tilmaamaya kitaabka laftiisa.",
    ],
    appLinks: [{}],
  },
  {
    title: "Tixraacyo & ilo",
    summary:
      "Sida aynu u daliishano Qur’aanka, xadiithka, tafsiirka, iyo kala duwanaanshaha cilmiga.",
    body: [
      "Barashada diinta islaamka ee suubban waxay ku dhisantahay cadaymo hufan, sidaa awgeed cashar kasta oo xaruntan ku yaala waxa uu higsanayaa inuu muujiyo shaqadiisa. Sheegashada Qur'aanka waxaa taageeray tixraac ku jira qaabka suuradda:ayah; sheegashada Sunnadu waxay magacawday ururinta (Bukhaari, Muslim, Tirmidi iyo wixii la mid ah), nambarka xadiiska, iyo darajadiisa (saxiix, xasan, ama daciif); sheegasho ku saabsan aayad macnaheeda waxay magacawday tafsiirka ay ka timid; halka culimadu si dhab ah ugu kala gedisan yihiin, waxa la xusaa kala duwanaanshiyaha halkii la qarin lahaa.",
      "Waxa kale oo muhiim ah in la kala saaro waxa la hubo iyo tan fasiraadda. Xaqiiqooyinka la dejiyay - shanta salaadood, ilaalinta Qur'aanka, dhacdooyinka waaweyn ee seerah - ayaa si cad loo sheegay. Arrimaha ay culimada daacadda ahi muddo dheer ku kala duwanaayeen, sida tafaasiisha wanaagsan ee eschatology ama akhrinta tixraacyada cilmiga ah, ayaa loo soo bandhigay sidii tafsiir, ee looma soo bandhigin sida la hubo. Kalsoonidu waa inay la mid noqotaa xoogga caddaynta.",
      "Si aad u hesho daraasad qoto dheer, ku tiirso tixraacyada la aasaasay: tarjumaadaha Qur'aanka ee la isku halayn karo (sida Sahih International ama Pickthall), ururinta xadiiska aasaasiga ah (Sahih al-Bukhari iyo Sahih Muslim ee ugu horreeya), tafsiirka la ixtiraamo (Ibn Kathir iyo as-Sacdi), iyo seerah aamin ah (Ibn Hisham's classic, and ar-Raxiiq al-Makhtum for Nekhtum).",
      "Ugu dambeyntii, ogow xadka abka. Muniib wax buu ku baraa oo ku tilmaamaa ilaha, laakiin ma soo saaro xukun diineed. Fiqhiga akhriska, tajwiidka ijazah, ama su'aal kasta oo khusaysa cibaadadaada ama go'aannada nolosha, la tasho aqoonyahan aqoon u leh dugsigaaga iyo deegaankaaga.",
    ],
    sources: [
      "Qur'aan — King Fahd Complex print / musxaf dijital ah oo la xaqiijiyay",
      "Xadiith - sunnah.com darajo-tixraac",
      "Tafsiir Ibnu Kathiir (Abriid Darussalam)",
      "Tafsiir as-Sa'di (Ingiriis)",
    ],
    disclaimer:
      "Munib wuxuu isu geeyey nuxur waxbarasho oo furan. Ka xaqiiji arrimaha muhiimka ah culimo aqoon u leh madhhabkaaga iyo deegaankaaga.",
  },
];

export const QURAN_GUIDE_STRUCTURE_LEVELS_SO: DeepPartial<QuranGuideStructureLevel>[] = [
  {
    count: "1 Book",
    detail:
      "Hal Kitaab — Kalam Allah, oo ah hadalka dhabta ah ee Eebbe, oo ku soo dejiyey Muxammad ﷺ isagoo u soo marinaya malaa'ig Jibriil, oo ku qoran af Carabi cad, tartiib tartiib ah 23 sano. Waa isku qoraal meel kasta oo adduunka ah.",
  },
  {
    count: "114",
    detail:
      "Qur’aanka kariimka ah waxa uu u qaybsan yahay 114 suuradood oo u dhexeeya saddex aayadood ilaa 286. Mid kastaa waxa uu leeyahay magac oo inta badan laga soo qaatay kelmad muhiim ah oo ku dhex jirta, waxaana loo kala saaraa Makki ama Madani. Nidaamkooda musxafka waxa lagu hagaajiyay waxyi (tawqifi) oo ka duwan siday u kala horeeyeen.",
  },
  {
    count: "30",
    detail:
      "Soddon qaybood oo qiyaas ahaan le'eg, oo loogu talagalay inay ka dhigaan wax akhris la maamuli karo. Akhrinta hal juz maalintii waxay dhammaystiraysaa Qur'aanka oo dhan bil gudaheed - habka caadiga ah ee lagu dhammeeyo qaadka inta lagu jiro Ramadaanta.",
  },
  {
    count: "60",
    detail:
      "Juz kastaa wuxuu u kala baxaa laba xizbi, isagoo bixinaya 60 wadar ahaan, mid walbana wuxuu u sii gudbayaa afar qaybood. Cutubyadan yaryar waxay kuu oggolaanayaan inaad dejiso qayb maalinle ah oo khafiif ah - nus ama rubuc hizb - oo aad caado joogto ah u yeelato.",
  },
  {
    count: "6,236",
    detail:
      "Aayadaha gaarka ah, oo la tiriyey si tuduc kasta loo tixraaco si sax ah sida suuradda:ayah. 6,236 waa tirinta caadiga ah ee Madiina; Hababka kale ee tirinta taariikhiga ahi waxay ku kala duwan yihiin oo keliya sida dhawr aayad-xudduudaha loo calaamadeeyay - erayada laftoodu waa isku mid.",
  },
  {
    count: "2 eras",
    detail:
      "Suurad kastaa waxay ka mid tahay labada wakhti midkood. Makki (Hijrada ka hor) suuradaha inta badan waa ka gaaban yihiin waxayna diiradda saaraan caqiidada, tawxiidka iyo aakhiro. Madani (Hijrada ka dib) suuradaha badi way dheer yihiin waxayna ku daraan sharci iyo hanuun bulsho. Dhowr suuradood ayaa ka kooban aayado labadoodaba.",
  },
  {
    count: "Qaar badan",
    detail:
      "Qur'aanka kariimka ah waxa lagu todh-xidhay mawduucyo soo noqnoqda halkii mawduuc laga abaabuli lahaa. Tawxiidka, salaadda, qisooyinka nabiyada, qoyska, sadaqada, samirka, iyo aakhiro waxay ku socdaan kitaabka, iyagoo isku xoojinaya suurado badan.",
  },
];

export const QURAN_GUIDE_TIMELINE_SO: DeepPartial<QuranGuideTimelineEvent>[] = [
  {
    title: "Life before revelation",
    body: "Sanadihii nabinimada ka hor, Muxammad ﷺ wuxuu u bixi lahaa godka Hira maalmo kalinimo iyo fikir, oo ay dhibayso sanam caabudka iyo cadaalad darada bulshada Makkan. In kasta oo dunida ku xeeran ay caabudi jireen sanamyo, haddana weligii ma uu yeelin, dadkiisuna isagay si buuxda u aamineen oo waxay ugu yeedhi jireen al-Amiin-Aaamin- waa hore ka hor intuusan nebi sheegan.",
    location: "Makkah",
  },
  {
    title: "Cave of Hira",
    body: "Bishii Ramadaan markuu afartan jir ahaa ayaa waxaa godka ugu yimid Malag Jibriil isagoo wata amar kali ah:- Akhri! Nabiga ﷺ oo aan waxna akhriyin waxna qorin ayaa ku jawaabay ma awoodo. Malaa'igtii ayaa si adag u laabta saddex jeer, ka dibna waxay gaarsiisay kalimadii ugu horreysay ee suuradda Al-calaq — ku akhri magaca Eebahaa abuuray. Intuu gariiray ayuu gurigii ugu degdegay xaaskiisii ​​Khadiija oo go’ ku duudduubtay oo niyadda u galisay.",
    location: "Jabal an-Nur, Makkah",
  },
  {
    title: "Waxyigii ugu horreeyay - Suuradda Al-calaq",
    body: "Amarka in la akhriyo wuxuu calaamad u ahaa bilawga nebinnimada iyo soo degiddii Qur'aanka. Khadiija waxay u gaysay nin ay qaraabo ahaayeen oo la odhan jiray Waraqah bin Nawfal, oo u aqoonsaday malaa’igta isla rasuulkii u yimid Muuse, una sii sheegay in qoomkii Nebiga (scw) ay ka saari doonaan. Waxyigii Makkan ee ugu horeeyey ee daba socday waxay diiradda saareen kalinimada Alle, yaqiinsanaanta aakhiro, iyo baaq ku wajahan hagaajinta akhlaaqda.",
  },
  {
    title: "Early Makkan period",
    body: "Sannadihii ugu horreeyay wicitaanku wuxuu ahaa mid gaar ah, ka dibna mid guud. Markii ay kortay, Qureysh waxay u leexatay cadaadis - inay jirdilaan kuwa daciifka ah iyo kuwa lagu addoonsado mu'miniinta - waxayna ugu dambeyntii ku soo rogeen cunaqabatayn adag oo saddex sano ah qabiilka Nabiga ﷺ, Banu Haashim. Si ay uga badbaadaan naxariista daran, koox Muslimiin ah ayaa u haajiray Xabashida, halkaas oo boqor Kiristaan ​​ah oo caadil ahaa uu magangalyo siiyey. Suuradaha waagani waxay caadi ahaan ku hadlaan aayado gaaban, xoog leh, qaafiyad leh.",
    location: "Makkah",
  },
  {
    title: "Hijrada ilaa Madiina",
    body: "Sanado badan oo dhib ah ka dib, oo daba socotay 'sanadkii murugada' ee uu ku waayay Khadiija iyo adeerkiis Abuu Daalib, Nabiga ﷺ iyo asxaabtiisu waxay u haajireen Madiina. Hijradani waxay ahayd mid aad muhiim u ah oo markii dambe noqotay bilawga tirsiga Islaamka. Madiino muslimiintu ma ahayn dad laga tirade badan yahay oo la ugaarsado ee waa bulsho dhistay bulsho, waxyiguna hadda wuxuu bilaabay inuu ka hadlo sharciga, qoyska, dhaqaalaha iyo xiriirka Ehlu-kitaabka.",
    location: "Madiina",
  },
  {
    title: "Madinan period",
    body: "Suuradaha Madiina guud ahaan aad bay u dhaadheer yihiin oo aad u faahfaahsan yihiin, iyagoo dejinaya sharciga ay u baahan tahay bulshada degta: waxyaabaha u gaarka ah salaadda, sakada, soonka, guurka iyo furriinka, dhaxalka, heshiisyada iyo heshiisyada. Waxa kale oo muddadaas la arkay dagaallo waaweyn oo kala ah Badar, Uxud iyo Jamhuuriyad-Qur’aankuna wuxuu si cad uga hadlay imtixaannada mu’miniinta iyo dhagarta munaafiqiinta (Munafiquun).",
    location: "Madiina",
  },
  {
    title: "Xajka sagootinta",
    body: "Sannadkii tobnaad ee Hijriyada ka dib, Nebigu (scw) waxa uu soo gutay xajkiisii ​​kaliya ee uu ku sugnaa, waxaanu khudbadii sagootinta ka hor jeediyay kulan balaadhan oo ka dhacay Carafa, isaga oo umadda xasuusiyay xurmada nafta iyo maalka, xuquuqda haweenka, sinnaanta dadka oo dhan iyada oo aan loo eegin jinsiyad, iyo waajibka ah in la ilaaliyo Qur’aanka iyo Sunnada. Halkaa ayayna ku soo degtay aayaddii:- Maanta waxaan idiin taam yeelay diintiina.",
    location: "Arafat / Mina",
  },
  {
    title: "Abuu Bakar hoostiisa",
    body: "Wax yar ka bacdi markuu Nebiga ﷺ dhintay, saxaabo badan oo Qur’aanka oo dhan xafiday ayaa lagu dilay dagaalkii Yamaama. Isaga oo ka baqaya in la waayo Huffaz, Cumar waxa uu ku booriyay khaliif Abuu Bakar in Qur’aanka lagu soo ururiyo hal meel. Abuu Bakar wuxuu magacaabay qoraagii lagu kalsoonaa ee Zayd bin Thabit, kaasoo si taxadar leh u soo ururiyay waxyigii qoran - oo laga xaqiijiyay xusuusta saxaabada - hal go' (suhuf).",
  },
  {
    title: "Musxafka halbeegga ah - Cuthmaan",
    body: "Markii Islaamku ku faafay dalal badan, kala duwanaanshiyaha akhriska ee Muslimiinta cusub ayaa bilaabay inuu keeno khilaaf. Si ummadda loogu mideeyo hal qoraal oo qoran, Khaliifkii Cuthmaan waxa uu haystay nuqullo awood leh oo uu ka sameeyay suxufkii Abuu Bakar ee lahjadda Qureysh, wuxuuna u diray magaalooyinka waaweyn, isagoo ka codsanaya in nuqullo kale oo shakhsi ah meel la iska dhigo. Musxafkan Cuthmaanku waa halbeegga ay dunidu Muslimka oo dhami ilaa hadda raacday.",
  },
  {
    title: "Ilaalinta ilaa maanta",
    body: "Afar iyo toban qarni ka dib, Qur'aanku weli waxba kama beddelin, waxaana ilaalinaya saddex siyaabood oo isku xidhan: xifdi badan (hifz) qarni kasta, gudbin qoraal ah oo aamin ah, iyo silsilado akhrin ah oo macalin iyo arday oo aan jabin (qira'at) oo ku soo laabanaya Nabiga ﷺ. Taasina waxay rumaynaysaa yabooha Eebbe ee ahaa: Anagaa soo dajinay Quraanka, waana ilaalinaynaa.",
  },
];

export const QURAN_GUIDE_STORIES_SO: DeepPartial<QuranGuideStory>[] = [
  {
    prophetName: "Aadam",
    title: "Aadam - nebigii ugu horreeyay iyo aabbaha aadanaha",
    summary: "Abuurka, malaa'igta sujuudkeeda, imtixaankii geedka, towbada la aqbalay.",
    body: [
      "Eebe wuxuu ku Abuuray Aadam oo ahaa Bini'aadmigii ugu horreeyey Gacmihiisu Dhoobo, Ruuxiisana wuu ku afuufay, wuxuuna siiyey hadiyad makhluuq kale uusan helin, wuxuuna Eebe baray Aadam Magacyada wax kasta. Markii Eebe soo bandhigay cilmigan, malaa'igtu waxay qiratay xadkeeda, waxaana cadaatay sharafta Aadam - aqoonta lafteedu waxay ahayd qayb ka mid ah waxyaabaha kala sooca aadanaha.",
      "Eebbana wuxuu faray Malaa'igta inay u Sujuuddaan Aadam, wayna wada adeeceen - Ibliis oo Jinni ka mid ahaa mooyee. Isla wayni wuu diiday, wuxuuna ku dooday inuu dab ka samaysan yahay, Aadamna dhoobo yahay, sidaa awgeedna uu isu haysto inuu ka sarreeyo. Kibirkaas, ee ma aha jaahilnimo, waa uu ku hungoobay, oo wuxuu ku dhaartay inuu habaabiyo faracii Aadan.",
      "Aadam iyo xaaskiisa Xaawa waxa la dhigay beerta oo loo sheegay in ay wax walba ku raaxaysan karaan si xor ah laakiin waa in aanay u dhowaan geed gaar ah. Shaydaankuna wuu ku waasqay ilaa ay wax ka cuneen. Kolkiiba waxay u muuqatay cawradoodii, oo waxay dareemeen qaladkoodii. Laakiin intay ka quustaan ​​oo ay cudur daar ka bixiyaan waxay u jeedsadeen iyagoo khushuucsan Eebbe iyagoo leh: Eebow waan dulminay nafteena, haddaadan noo dambi dhaafin oodan noo naxariisan waxaan noqonaynaa kuwa khasaaray.",
      "Eebbana wuu ka toobad aqbalay oo u soo dejiyey dhulka, ma aha ciqaab aan loo baahnayn, ee waa bilawga imtixaamka bani-aadmiga, oo ay la socoto ballan hanuun ah: 'Ruuxii raaca hanuunka ma dhumo, kuma dhaco. Sheekada Aadam sidaas darteed waa qisada qof kasta: lagu abuuray si sharaf leh, la imtixaamay, oo khaldami kara, mar kastana kara inuu soo laabto.",
    ],
    lessons: [
      "Albaabka towbada mar walba waa furan yahay - Tawbah Aadan, oo la bixiyo cudur daar la'aan ama dib u dhac, ayaa tusaale u ah dembiile kasta.",
      "Kibirku waa aasaaska burburka: Ibliis runta wuu gartay, haddana wuu diiday kibir, isagoo tusay in aqoonta aan is-hoosaysiinta lahayni wax baabbi'iso.",
      "Habka Shaydaanku waa xaswaas joogto ah, ma aha xoog - garashada soo jeedintiisa waa kala badh ka hortagga iyaga.",
      "Qiimaha bini'aadmigu wuxuu ku xidhan yahay aqoonta iyo u noqoshada Alle, ee maaha inay noqdaan kuwo aan dembi lahayn - waa jawaabta qaladka ayaa ina qeexaysa.",
    ],
    quran: [
      {
        excerpt: "Abuuridda Aadam iyo Malaa'igta Sujuud.",
      },
      {
        excerpt: "Imtixaanka, dhicitaanka, iyo toobad keenka.",
      },
    ],
    location: "Janno, ka dibna dhulka",
  },
  {
    prophetName: "Nuux",
    title: "Nuux - dulqaad ilaa qarniyo diidmo ah",
    summary: "950 sano oo daawah ah, doontii, iyo daadkii sida xukun rabbaani ah.",
    body: [
      "Nuux waxaa loo diray qoom ku dhacay cibaadada sanamyada, wuxuuna ugu yeedhay inay caabudaan Eebbe kaligiis muddo la yaab leh - Qur'aanku wuxuu sheegay inuu ku dhex nagaaday kun sano oo ka yar konton. Wuxuu ugu yeedhay habeen iyo maalin, meel fagaare ah iyo si qarsoodi ah, isagoo u soo bandhigay sabab kasta: cafis, roob, maal, caruur iyo beero. Oo weliba qarni ka ab ka ab way sii jeesteen oo ku majaajiloodeen, oo dhegahooday fureen.",
      "Markii ay caddaatay in aan mar dambe la rumayn, ayuu Eebbe ku amray Nuux inuu dhiso doonnida, qoomkiisiina way ku qosleen markuu dhisay markab weyn oo badda ka fog, wuxuuse ugu jawaabay inay imanayso maalin ay fahmi doonaan. Calaamaddu waxay timi markii foornada ay ka soo burqanayso biyaha; Nuuxna wuxuu fuulay Mu'miniinta, wax yar oo keliya, iyo xayawaan cayn kasta ah.",
      "Daadka ayaa kacay oo maansheeyay kuwii diiday. Mid ka mid ah daqiiqadihii ugu xiisaha badnaa ee sheekada, ayaa wiil uu dhalay Nuux diiday inuu fuulo, isagoo ku adkaystay inuu buur fuuli doono si uu biyaha uga baxsado, wuxuuna ka mid ahaa dadkii qarqmay - murugada aabbe ma dhaafi karto wiil gaalnimadiisa. Markii uu Nuux u duceeyay, Alle wuxuu baray in wiilka yar xumaantiisa ay ka goysay xiriirkii iimaanka ee ka dhaxeeyay.",
      "Markii amarku yimid, biyihii waa gureen, doontiina waxay ku dul istaagtay buurta Yahuudi. Qur'aanku wuxuu xafiday xisaabta oo dhan si uu 'calaamad' u noqdo qof kasta oo ka fiirsada sida Eebbe u samatabbixiyo mu'miniinta iyo sida ugu dambaynta loogu xaq-yeelo samirka.",
    ],
    lessons: [
      "Hawlgal dheer, oo adag oo leh dad yar oo raacsan maaha guul-darro - Nuux wuxuu wacdiyey qarniyo, iyo daacadnimadiisa, ma aha tirooyinkiisa, waa waxa Eebe ka farxiyey.",
      "Nin rumaysadla'aan ah oo xidhidh qooys ahu ma jiro. Wiilkii Nuux qudhiisuna waa maanshay, isagoo caddaynaya inaan hanuunka la dhaxlin.",
      "Ku adkaysiga in Alle loogu yeedho, xitaa ka-hortagga jees-jeeska, lafteedu waa nooc cibaado ah.",
      "Samatabbixinta Eebe waxay timaaddaa wakhti go'an - rumaystaha wuxuu dhisaa 'doonta' addeecidda daad ka hor, isagoo aaminaya ballanka.",
    ],
    quran: [
      {
        excerpt: "Sheekadii Nuux oo faahfaahsan.",
      },
      {
        excerpt: "Codsigii Nuux dadkiisa.",
      },
    ],
    location: "Mesopotamia qadiimiga ah (qiyaastii cilmiga)",
  },
  {
    prophetName: "Ibraahim",
    title: "Ibraahim - saaxiibkii Alle (Khalillaah)",
    summary: "Sanamyada jabiyay, dabkuna qaboojiyey, Ismaciil u huray, dhistay Kacbada.",
    body: [
      "Ibraahiim isaga oo da’yar xitaa waxa uu u sababeeyay tawxiidka, isaga oo diiday sanamyadii ay dadkiisa iyo aabbihiis xardhay oo caabudi jireen. Wuu la murmay, dabadeed wuxuu falay: intay ku maqnaayeen ciidda, wuxuu jebiyey dhammaan sanamyadoodii, laakiin kuwii ugu waaweynaa, markay sharxeenna wuxuu u sheegay inay waydiiyaan sanamkii weynaa laftiisa - isagoo daaha ka qaadaya cidhiidhi la'aanta waxay caabudi jireen. Iyagoo aad u cadhaysan ayay dab weyn dhiseen markaasay ku tuureen, hase ahaatee Eebbe wuxuu yidhi, “Naayow, qabow iyo ammaan Nabi Ibraahiim korkiisa ha ahaato, wuuna ka baxay isagoo aan waxba gaadhin.",
      "Ilaahay amarkii Ibraahiim wuxuu kaga tagey xaaskiisii ​​Xajar iyo wiilkooda Ismaaciil togga madhalayska ah ee Makkah. Markii ay biyihii ka dhammaadeen, ayay Xajar iyadoo quus ah ku carartay buuraha Safa iyo Marwah dhexdooda iyagoo gargaar raadinayo - baadigoob ay muslimiintu dib ugu soo celiyeen sacii Xajka - ilaa uu ka soo baxay isha Zamzam ee ilmaha cagihiisa. Sannado ka dib, Ibraahim wuxuu riyo ku arkay inuu doonayo inuu allabari u bixiyo wiilkiisa uu jecel yahay. Aabbe iyo wiilba waxay u hoggaansameen doonista Eebbe; oo isla markii uu Ibraahim fulinayey ayaa Alle Ismaaciil ku furtay wan aad u qurux badan, oo sannad walba la xuso Ciidda Carafo.",
      "Ibraahiim iyo Ismaciil kii weynaa ayaa si wada jir ah kor ugu qaaday kacbada Makkah, iyaga oo ku tukanayay intay dhisteen: ‘Eebow kan naga aqbal. Ibraahiim waxa kale oo uu u duceeyey rasuul in laga soo sara kiciyo faracooda - ducadaas qarniyo ka dib loogu jawaabay Nebi Muxamed ﷺ. Cibaado aan leexleexad lahayn awgeed, Eebbe wuxuu Ibraahim ku maamuusay magac gaar ah oo ah: Khaliilullah, saaxiibka ugu dhow ee Eebbe.",
    ],
    lessons: [
      "Tawxiidku waxay dalbanayaan jebinta ku-xidhnaanta been abuurka ah, xitaa marka sanam caabudiddu ay tahay tan caanka ah, ee laga dhaxlo caadada iyo ka-hortagga taas waa khatar.",
      "Kalsoonida buuxda ee Eebe waxay soo iftiimaysaa marka amarkiisu aad u adag yahay - Ibraahim wuxuu u hoggaansamay xitaa inuu allabari u bixiyo wiilkiisa, Eebbena wuxuu ku beddelay imtixaankii naxariis.",
      "Talo-saarashada Alle macnaheedu ma aha badheedhnimo: Xajar ayaa orday oo raadisay, Zamzam-na way timi - dadaal iyo tawakkuba way wada shaqeeyaan.",
      "Ficillada daacadda ah ee cibaadada ayaa ka ab ka ab; Cibaadada xajka iyo karaamada Kacbada waxay ka soo jeedaan adeecidii Ibraahiim.",
    ],
    quran: [
      {
        excerpt: "Ibraahim, Ismaaciil, iyo naf-hurid.",
      },
      {
        excerpt: "Axdi iyo dhaxal.",
      },
    ],
    location: "Ciraaq, Levant, Makkah",
  },
  {
    prophetName: "Yuusuf",
    title: "Yuusuf - quruxda samirka (sabr jameel)",
    summary:
      "Khiyaanada, addoonsiga, xabsiga, kor u kaca maamulka - isku hallaynta iyada oo loo marayo tijaabo kasta.",
    body: [
      "Markii uu yaraa, Yuusuf wuxuu arkay riyo ah kow iyo toban xiddigood, qorraxda, iyo dayaxa oo u sujuuday isaga - calaamad muujinaysa mustaqbal weyn. Aabihiis Yacquub oo qudhiisu nebi ahaa ayaa u sheegay inuu ka qariyo walaalihiis xaasidka ah. Xaasidkoodii baa ka awood batay: waxay Yuusuf ceel guntiisa ku tuureen, waxayna u sheegeen aabbahood yeey cunay. Gaadiid meesha marayey ayaa wiilka helay oo ka iibiyey dalka Masar.",
      "Gurigii nin gobta ahaa wuxuu ku koray nin qurux badan oo daacadnimo leh. Markii ay naagtii odayga ahayd damacday inay sasabto, ayuu Yuusuf diiday, wuxuuna yidhi: “Alle baan ka magan galay”, markii ay u hanjabtayna wuxuu ka doortay xabsi dembi. Inkastoo aanu dambi lahayn, waxa uu xidhnaa sannado. Halkaa waxa uu isugu yeedhay maxaabiistii ay isku xidhnaayeen si ay ugu tawxiid galaan, riyadoodiina idanka Alle ugu fasiray.",
      "Boqorkii markii uu riyo ku riyooday toddoba sac oo buurbuuran oo ay cuneen toddobadii caatada ahayd, Yuusuf wuxuu ku macneeyey toddoba sannadood oo barwaaqaysan oo ay toddobo abaari ka dambaysay, wuxuuna ku taliyey in la kaydiyo hadhuudh. Isaga oo ugu dambayntii loo aqoonsaday caqligiisa iyo aaminnimadiisa, ayaa waxaa loo dhiibay mas'uuliyadda bakhaarradii Masar.",
      "Abaartii aakhirkii waxay walaalihii ku kaxaysay Masar oo cunto u doonan jirtay, iyaga oo aan aqoonsan wasiirkii xoogga badnaa ee iyaga ka horreeyey. Yuusufna wuu is-muujiyay oo intuu ka aargoosan lahaa - si buuxda u cafiyay isagoo leh: Maanta korkiinna dambiile ma aha. Allaah ha ku cafiyo.' Reerkii waa la isu keenay, waalidkiina waa la sharfay, riyadii carruurnimadana way rumowday.",
    ],
    lessons: [
      "Sabr jaameel — samir qurux badan - macneheedu waa inaad u adkaysato dhibka adigoon dadka ka damqan, murugadaadana u qaado Allaah oo keliya sidii Yacquub yeelay.",
      "Dhawrsoonnimadu waxay ku kacaysaa qiimo kasta: Yuusuf wuxuu ka doortay xabsiga dembiga, Eebbana darajadiisa ayuu kor u qaaday.",
      "Qorshaha Alle wuxuu inta badan ku dhuuntaa sanado badan oo nasiib darro ah - ceelka, addoonsiga, iyo xabsigu waxay ahaayeen dhammaan tillaabooyin loo qaaday sharafta Yuusuf.",
      "Kuwa xoogga badan waxay awoodooda ku muujiyaan cafis: Markii uu xooggiisu sarreeyo, Yuusuf wuxuu cafiyey kuwii isaga dulmiyey.",
    ],
    quran: [
      {
        excerpt: "Sheekooyinka ugu wanaagsan - ayaa lagu sheegay hal suurad.",
      },
    ],
    location: "Kanaan, Masar",
  },
  {
    prophetName: "Muuse",
    title: "Muuse-Alle ayuu la hadlay oo ka horyimid Fircoon",
    summary:
      "Duur gubanaya, calaamooyin ka dhan ah Fircoon, Baxniintii, Tawreed, iyo ummadda warwareegay.",
    body: [
      "Nabi Muuse waxa uu ku koray qaabkii Alle, gudaha qasrigii Fircoon ka dib markii ay hooyadii dhex dhigtay wabiga si ay uga badbaadiso gumaadka Fircoon ee wiilashii Israa’iil. Isaga oo dhallinyaro ah ayuu Masar ka soo qaxay dil ka dib, sannado ka dib, isagoo saxaraha ku soo noqday, wuxuu arkay dab ka kacay Buurta Tuur. Halkaas ayuu Eebbe si toos ah ula hadlay - sharaf uu Muuse ku mutaystay magaca Kalimullaah, kii Eebbe la hadlay - isagoo leh, 'Waan ahay Rabbigaagii.' Waxaa loo soo diray isaga iyo walaalkii Haaruun oo taageero u ah, oo loo soo celiyay daalimkii Fircoon isagoo dalbanaya: sii daa Banii Israa'iil.",
      "Fircoon ilaah buu sheegay wuuna diiday. Eebbana wuxuu siiyey Nabi Muuse calaamado cad-cad oo ushiisii ​​isu beddeshay abeeso nool, gacantiisiina waxay iftiimisay cad. Fircoon wuxuu u yeedhay saaxiriintiisi ugu xeel dheeraa si uu u ceebeeyo, laakiin markii Muuse ushiisii ​​ay liqday dhalanteedkoodii, saaxiriintiina waxay garteen xaqiiqada dhabta ah dhagar oo kaliya waxayna ku dhaceen sujuud, iyagoo ku dhawaaqay inay rumeeyeen Eebaha Muuse iyo Haaruun, xataa sidii Fircoon ugu goodiyay inuu dili doono. Waxaa soo raacay belaayooyin isdaba joog ah, hase ahaatee Fircoon waa sii qallafiyey.",
      "Ugu dambayntii waxa uu Alle ku amray Muuse in uu dadkiisa habeenkii hoggaamiyo. Fircoon baa u raacdaystay ilaa badda; Nabi Muuse Ushiisii ​​ayuu ku dhuftay, Biyihiina waa kala tageen, wuxuuna ku daayey Mu’miniintii Dhul Engegan. Fircoon iyo ciidankiisii ​​markay raaceen ayay baddii isku xidh-xidhay oo ay qarqiyeen. Markaasaa Muuse qaatay Tawreed, laakiin Banii Israa'iil way madax-adaygeen - waxay caabudeen weyl dahab ah isaga oo maqan, waxayna diideen inay galaan dalkii loo ballan qaaday - waxayna warwareegeen afartan sannadood.",
    ],
    lessons: [
      "Runta u sheeg dulmiga adigoo si buuxda Alle u tiirsan — Muuse waxa uu la kulmay ninkii ugu awoodda badnaa da'diisa oo hubaysan oo keliya rumaysad.",
      "Xitaa rumaystayaasha daacadda ah way ka warwareegi karaan: saaxiriintii Muuse ka soo horjeeday waxay noqdeen, hal daqiiqo oo cad, ka adag ummad dhan oo arkay mucjisooyin.",
      "Cajiibka markhaatiga keli ahaantiis ma keeno rumaysad - hanuunku waa hibo Eebbe siiyo kuwa is-hoosaysiiya, ee ma aha kuwa madax adag.",
      "Eebbaa u gargaara kuwa dulman, wuuna xisaabin kuwa is-kibriya si kasta oo ay u kala xoog badan yihiin.",
    ],
    quran: [
      {
        excerpt: "Muuse Tuur iyo Fircoon hortiisa.",
      },
      {
        excerpt: "Dhalashada iyo barbaarinta.",
      },
    ],
    location: "Masar, Siinay",
  },
  {
    prophetName: "Isa",
    title: "Isa ibn Maryam - kalimad iyo ruux xagga Eebe ka yimid",
    summary:
      "Dhalasho mucjiso ah, calaamooyin, kor loogu qaaday Alle - aan la dilin, laguna qodbin Qur'aankiisa.",
    body: [
      "Maryam oo ahayd islaan dhawrsoon oo cibaado badan Alle ku tilmaamay dumarkii ugu wacnaa ee waqtigeedii soo maray, ayaa reerkeedii ka baxday oo bari ka dhigtay. Halkaas waxaa uga soo muuqday malag Jibriil oo nin u eg, wuxuuna ugu bishaareeyey inuu Eebbe siin doono wiil daahir ah, iyadoo aan ninna taaban. Waxay ku uuraysatay ereyga Eebbe ee ahow, Ciisena waa la abuuray—Qur’aanku wuxuu la barbar dhigay abuurkiisa iyo kan Aadam, oo laga dhigay aabbe la’aan, taasoo tusinaysa in Eebbe u abuuray siduu doono.",
      "Markii ay soo noqotay iyadoo sida ilmaha yar, ayaa dadkeedii dacweeyeen. Difaaceeda, ilmaha Ciise ayaa ka hadlay sariirta, isaga oo isku sheegaya inuu yahay addoon Eebbe siiyey kitaabka oo uu nabi ka dhigay - isagoo sharaftii hooyadii ku nadiifiyey mucjiso. Isaga oo nebi u ah Banii Israa’iil, Ciise waxa la siiyey calaamado cad idanka Eebbe: wuxuu bogsiiyey indhoolihii iyo kii baras qabay, wuuna nooleeyey kuwii dhintay, wuxuuna ka sameeyey shimbir dhoobo ah oo duuleysa – had iyo jeerna wuxuu ku nuuxnuuxsaday inay kuwani yihiin ‘idamka Eebbe’, marna xooggiisa.",
      "Qur'aanku wuxuu si cad u sheegay in Ciise aan la dilin oo aan iskutallaabta lagu qodbin; balse waxaa loo tusiyey cadawgiisa, Eebbana wuu u sara kiciyey xaggiisa. Sunnida caqiidada guud waxay qabtaa inuu soo laaban doono kahor maalinta aakhiro. Muhiimad ahaan, Qur'aanku wuxuu ku adkaysanayaa in Ciise uu ahaa nebi bini'aadan ah iyo addoon Eebbe, uusan ahayn rabbaani oo uusan ahayn wiil Ilaah - farriinta uu isagu ku dhawaaqay laga soo bilaabo dhalashadii ilaa dhammaadka.",
    ],
    lessons: [
      "Eebbana sida uu doono ayuu u abuuraa - Dhalashada Ciise aabbe la'aan, sida uunka Aadan oo ciidda ka abuuray, waxay tusinaysaa in awooddiisu aanay xidhnayn sabab adduunyo.",
      "Mucjiso kasta oo Isagu sameeyo waxay ahayd mid si cad 'idanka Alle', isagoo baraya in nebiyadu ay ka gudbaan awoodda Alle, ma haystaan.",
      "Nebiyadu waa addoommada Eebbe ee bini'aadamka ah, oo aan weligood la caabudin - Qur'aanku wuxuu ilaalinayaa maqaamkii Ciise ee runta ahaa buunbuunin.",
      "Maryama dhawrsanaanteeda, samirkeeda, iyo aaminaadeeda waxay ka dhigtaa tusaale iimaanka dhammaan mu'miniinta, haween iyo ragba.",
    ],
    quran: [
      {
        excerpt: "Hadalka dhalashada iyo dhalmada.",
      },
      {
        excerpt: "Lama dilin, lamana wadin; kor loo qaaday.",
      },
    ],
    location: "Falastiin",
  },
  {
    prophetName: "Maxamed ﷺ",
    title: "Maxamed ﷺ - shaabadda Nabiyada",
    summary: "Rasuulkii ugu dambeeyay; Qur'aanku wuxuu soo degay 23 sano; naxariista aduunka.",
    body: [
      "Muxammad ﷺ waxa uu ku dhashay magaalada Makkah abbaaraha 570 CE waxa uu ka dhashay qabiilka Quraysh. Isagoo yar oo agoon ah - aabbihii wuxuu dhintay dhalashadiisa ka hor, hooyadiina isagoo lix jir ah - waxaa koriyey awoowgiis, ka dibna adeerkiis Abuu Daalib. Waqti dheer ka hor nabinimadiisa waxaa lagu aaminay daacadnimadiisa oo ay dadkiisu ugu yeeri jireen al-Amiin, 'Aaamin.' Isagoo afartan jir ah, isagoo ku sugan Godka Xiira, wuxuu helay waxyigii ugu horreeyay ee Qur'aanka oo malag Jibriil u soo dhiibay.",
      "Muddo saddex iyo toban sano ah oo uu Makka joogay ayuu dadka ugu yeerayay inay Alle keligii caabudaan, wuxuuna la kulmay cadaadis ba’an: jeesjees, jirdil loo geystay dadkii taagta darnaa ee xertiisa ka mid ahaa, iyo cunaqabateyn bulsho iyo mid dhaqaale oo qabiilkiisa ah. Hal sano oo murugo ah waxa uu waayey xaaskiisii ​​uu jeclaa ee Khadiijah iyo ilaaliyaha Abu-dhaalib, markii uu taageero u doontay Taa’if agteeda ayaa laga saaray oo dhagaxaan lagu tuuray – haddana wuu u duceeyey iyaga oo hanuunsan halkii uu dumin lahaa.",
      "Markii uu Madiina u hijrooday waxa uu dhistay bulsho oo uu u horseeday imtixaanadii Badar, Uxud, iyo Jamhada. Markii uu ugu dambayntii u soo laabtay si uu u qabsado Makkah isaga oo xoog badan, uma uu aargoosan kuwii jirdilay ee ka saaray; wuuna cafiyey, oo wuxuu ku yidhi, Taga, waayo, xor baad tihiin. Qur’aanku waxa uu hawshiisa ku soo koobay hal jumlad — ‘naxariistii adduunyada’—waxana uu caddeeyey in waajibkiisu ahaa in uu farriinta si cad u gudbiyo, ee aanu cidna ku qasbin in uu rumaysto.",
    ],
    lessons: [
      "Dabeecada ugu wanaagsan ee uu qofku yeelan karo waa dabeecadda Nabiga ﷺ - si aad ah u baro seeradiisa oo ku dadaal in aad ku darsato nolol maalmeedka.",
      "Naxariista iyo dembidhaafku waa itaal ee ma aha itaaldarro",
      "Uyeedhaye wuxuu gaadhsiiyaa fariinta si daacadnimo iyo samir leh, wuxuuse ka tagayaa cidhibta Eebbe, hanuunkana isagaa iska leh.",
      "Tijaabooyinku waa jidkii nebiyada; U adkaysiga dhibka Alle dartiis, siduu yeelay, waa astaanta iimaanka dhabta ah.",
    ],
    quran: [
      {
        excerpt: "Kuuma aannaan dirin naxariista Caalamka mooyee.",
      },
      {
        excerpt: "43|11|Ee Naxariista dhexdooda ah, gaaladana ku adag.",
      },
    ],
    appLinks: [{}],
  },
];

export const QURAN_GUIDE_THEMES_SO: DeepPartial<QuranGuideTheme>[] = [
  {
    title: "Iimaan (Imaan)",
    summary:
      "Rumayn Eebe, Malaa'igtiisa, Kutubtiisa, Rusushadiisa, Maalinta Aakhiro iyo Qadarka Eebe.",
    lessons: [
      "Imaanku waxa uu ku fadhiyaa lix qodob oo Qur’aanku isugu soo ururay hal meel oo kala ah: rumaynta Eebbe, malaa’igtiisa, kutubtiisa, rusushiisa, maalinta qiyaamaha, iyo qaddarka Eebbe – wanaaggeeda iyo xumaanteeda.",
      "Iimaanku ma aha mid go'an, oo hal mar la hubo. Caqiidada Sunniga ah ee caadiga ah waxay ku kordhisaa addeecidda iyo xusuusta waxayna ku yaraanaysaa dembiga iyo hagar la'aanta, markaa iimaanku waa shay aad si firfircoon u korto.",
      "Nebigu ﷺ wuxuu baray in iimaanku leeyahay in ka badan toddobaatan laamood, oo ka kooban kuwa ugu waaweyn - marag u ah inaan Ilaah kale jirin oo aan Allaah ahayn - ilaa laga saaro dhibka waddada, isagoo muujinaya in xitaa camalka yar ee wanaagsan ay qayb ka yihiin iimaanka.",
      "Imaanka dhabta ahi waa arrin qalbiga ku jirta carrabka hortiisa: in Eebbe si dhab ah loo ogaado, lagana jeclaado wax kasta, oo laga cabsado cadhadiisa, isagana la talo saaro.",
    ],
    quran: [
      {
        excerpt: "Rasuulkuna wuxuu rumeeyey waxa laga soo dejiyey xagga Eebihiis, mu’miniintana…",
      },
    ],
    hadith: [
      {
        excerpt:
          "Iimaanku wuxuu leeyahay in ka badan toddobaatan laamood; Kan ugu sarreeyana wuxuu yidhi 'Ilaah mooyee Ilaah kale ma jiro', kan ugu hooseeyana wuxuu ka saarayaa wax dhib ah waddada - xishoodkuna waa laan iimaanka.",
      },
    ],
    actions: [
      "Dib u cusboonaysii Shahadaada maanta adigoo si buuxda u fiirsanaya waxa ay ka dhigan tahay, ee ha noqonin odhaah joogto ah.",
      "Baro mid ka mid ah magacyada Alle, fahan, oo ku barya ducadaada.",
    ],
  },
  {
    title: "Salaadda (Saalax)",
    summary:
      "Camalkii ugu horreeyay ee la weyddiiyey maalinta qiyaame - tiirka isku xidha addoonka Rabbiga.",
    lessons: [
      "Saalax waa rukniga labaad ee Islaamka, camalka ugu horreeya ee addoonka ah ayaa la warsan doonaa maalinta qiyaame - haddii ay run tahay, diiwaanka intiisa kale ayaa u janjeera inuu raaco.",
      "Qur’aanku waxa uu leeyahay salaadda oo la oofiyo si dhab ah qalbigu, waxa ay qofka ka celisaa akhlaaqda iyo xumaanta; Ma aha caado kaliya ee waa soo noqnoqonaysa nafta shan jeer maalintii.",
      "Si ka duwan waajibaadka kale ee dhulka lagu soo dejiyey, salaadda waxa loo qoray ummadda intii lagu guda jiray koritaankii Nebiga (scw) (al-Isra wal-Mi'raj), isaga oo ku tilmaamaya hadiyad gaar ah iyo habka uu mu’minku u fuulo Eebbe.",
      "Sababtoo ah shan jeer ayaa lagu celceliyaa maalin kasta, salaadu waa laxanka joogtada ah ee ilaalinaya iimaanka inta u dhaxaysa hal cibaadada iyo cibaadada xigta.",
    ],
    quran: [
      {
        excerpt: "Illeen salaaddu waxay reebtay xumaanta iyo xumaanta, xuska Eebbe ayaana ka weyn.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Addoon camalkiisa waxaa ugu horraysa oo la kala xukumi maalinta qiyaame salaaddiisa; hadday sanqadho tahay wuu liibaanay, hadduu cilladaysanna wuu fashilmay oo wuu khasaaray.",
      },
    ],
    actions: [
      "Tuko hal salaad maanta si tartiib ah, adigoo fahmaya erayada al-Faatixa markaad akhrinayso.",
      "Fur munib's Baro hagaha Saalax si aad u xoojiso qayb ka mid ah salaaddaada.",
    ],
  },
  {
    title: "Waalidiinta",
    summary:
      "U roonaanta waalidka waxaa lagu lammaaniyaa cibaadada Alle - shirkiga ka dib, gaalnimada iyaga ayaa looga digayaa.",
    lessons: [
      "Eebe wuxuu si toos ah ugu biiraa naxariista waalidiinta si toos ah cibaadadiisa gaarka ah isla aayad la mid ah - calaamad muujinaysa sida ay xaqooda ugu culus tahay Islaamka.",
      "Quraanku waxa uu reebay xataa calaamadda ugu yar ee xajiimka ah: in aan la odhanin 'uff', ama aan si qallafsan ula hadlin, balse uu kula hadlo hadal dabacsan oo sharaf leh.",
      "Amarku wuxuu gaaraa da'da ugu sarreysa, marka waalidiintu ay ugu baahida badan yihiin dulqaad: u daryeel iyaga sidii ay mar hore kuugu daryeeli jireen, hoosna ugu deji baalka is-hoosaysiinta naxariis dartiis.",
      "Cibaadadu kuma dhammaanayso geerida - sii wadida ducaada waalidiinta, bixinta sadaqo iyaga oo wakiil ka ah, iyo ixtiraamida saaxiibadooda iyo ballamaha waa ficillo daacadnimo joogto ah.",
    ],
    quran: [
      {
        excerpt:
          "Eebahaana wuxuu faray inaydaan caabudin isaga mooyee, iyo inaad u naxariisataan waalidka...",
      },
    ],
    actions: [
      "Wac ama fariin u dir waalid erayo wanaagsan maanta.",
      "U duca waalidkaa magac ahaan.",
    ],
  },
  {
    title: "Dulqaad (Sabar)",
    summary: "Ku adkaysiga addeecidda, xakamaynta dembiga, iyo aqbalida imtixaannada.",
    lessons: [
      "Culimadu waxay ku sifeeyeen sabar saddex nooc oo kala ah: Sabirka addeecida Alle, samirka ka dheeraanshaha dambiga, iyo dulqaadka qaadashada amarkiisa marka ay timaado fitno.",
      "Sabri maaha quusasho aan toos ahayn ama inaad ilkahaaga isku xoqdo si gooni ah - Qur'aanku wuxuu ku lamaaneeyaa salaadda si ay u noqoto il gargaar, sidaa darteed samirku waa firfircoon yahay oo wuxuu kuu jeedinayaa xagga Alle ee kama foga.",
      "Eebe wuxuu isu sheegaa inuu 'la jiro kuwa samra', wuxuuna u ballan qaaday kuwa bukaanka ah abaal-marintooda xisaab la'aan - sharaf aan ku dhowdahay tayada kale.",
      "Nebiyadu waxay ahaayeen kuwa ugu imtixaan daran dadka, Qur'aankuna wuxuu ku adkaystay - Ayuub buka, Yacquub oo murugaysan, Yuusuf oo khiyaano iyo xabsi ah - oo ah tusaale lagu daydo.",
    ],
    quran: [
      {
        excerpt: "Kuwa xaqa rumeeyow kaalmaysta samir iyo duco. Eebana wuxuu la jiraa kuwa samra.",
      },
    ],
    actions: [
      "Marka xanaaqu maanta yimaado, hakad, neefso, oo dheh 'Innaa lillaahi wa innaa ilayhi raajicuun' ka hor inta aadan falcelin.",
      "Hal daqiiqo oo dhib ah usbuucan u beddel laba rakcadood oo salaad ah beddelkii cabasho.",
    ],
  },
  {
    title: "Sadaqah & Sakada",
    summary: "Sifaynta maalka iyo quudinta saboolka - calaamad rumaysadka runta ah.",
    lessons: [
      "Sakada - sadaqada daahirinta sanadlaha ah ee ku saabsan hantida mudan - waa tiirka saddexaad ee Islaamka iyo waajib, halka sadaqadu tahay wax bixinta iskaa ah oo aan lahayn xad sare iyo qaabab aan dhammaanayn.",
      "Quraanku waxa uu ballan qaaday in hantida Alle dartii lagu bixiyo aan la lumin ee la badiyo: sida iniin keliya oo toddobo sabuul ah oo mid waliba boqol xabo ah dhaliso, Eebbena cidduu doono u sii badsado.",
      "Sadaqadu lacag kaliya maaha. Rasuulku ﷺ wuxuu baray in xitaa la kulanka walaalkaa oo dhoola cadeynaya ay tahay sadaqo, sidaas darteed ma jiro qof faqri ah oo wax bixin kara.",
      "Bixinta waxay daahirisaa maalka iyo kan wax bixiyaba, waxayna debcisaa xajinta hunguriga, waxayna dhistaa naxariista - waana sababta erayga sakada laftiisa loola jeedo daahirin iyo korriin.",
    ],
    quran: [
      {
        excerpt:
          "Kuwa ku wax bixiya Jidka Eebe waxay la midyihiin Hadhuudh ka baxay Todobo Sabuul.",
      },
    ],
    actions: [
      "Wax maanta sii - lacag, wakhtigaaga, ama erey naxariis leh - xitaa haddii ay yar tahay oo aan la arki karin.",
      "Dib u eeg waajibaadkaaga zakada ee Munib oo ogow marka la bixinayo soo socda.",
    ],
  },
  {
    title: "Towbada (Tawbah)",
    summary:
      "Eebe wuxuu jecel yahay kuwa toobad keena - albaabku waa furan yahay ilaa naftu ka gaarto dhuunta.",
    lessons: [
      "Tawbah daacadda ah waxay leedahay shuruudo cad: qoomamo dhab ah dembiga, isla markiiba joojinta, iyo go'aan adag oo aan waligood soo laaban - iyo haddii dembigu qof kale dulmiyo, soo celinta xaqooda sidoo kale.",
      "Eebana ma ogola uun towbada, wuxuuna jecel yahay kuwa u noqon Eebe, soo laabashada simbiriirixa ka dib isagay u jeceshay xaggiisa, mana aha calaamad korkiinna.",
      "Albaabka naxariistu aad buu u ballaadhan yahay: Eebbe wuxuu u sheegaa xataa kuwa naftooda dulmiyey inaanay quusan, illeen wuxuu u dhaafaa dhammaan dembiyada qofka si dhab ah u toobad keena.",
      "Towbada looma hayo dembiyo waaweyn ama waqtiyo cajiib ah - istighfar (cafis doonka) maalinta oo dhan waxa ay ilaalisaa qalbi jilicsan oo xisaabtuna nadiif tahay.",
    ],
    quran: [
      {
        excerpt:
          "Waxaad dhahdaa: Addoomadayda ku xad gudbay Naftooda, ha ka quusanina naxariista Eebe...",
      },
    ],
    actions: [
      "Dheh 'Astaghfirullah' 100 jeer maanta, taasoo la macno ah, oo dareemo kor u qaadista miisaanka.",
      "Waxaad sheegtaa hal caado oo aad garanayso in aanu Alle raali ka ahayn oo qaado talaabada ugu horeysa ee la taaban karo si aad uga tagto.",
    ],
  },
  {
    title: "Jannada (Jannah)",
    summary:
      "Abaalmarin daa'im ah oo loo diyaariyey muttaqin - ayaa lagu sifeeyay tafaasiil muuqda, dhiirigelin leh.",
    lessons: [
      "Qur’aanku wuxuu Jannada ku sifeeyey si cad, oo tifaftiran – Jannooyin ay dureeri dhexdeeda wabiyaal, fududayn weligeed ah, iyo la kulmidda kuwa dhawrsada—si sax ah si uu mu’minka ugu hanuuniyo una dadaalo.",
      "Gelida Jannada ugu dambaynta waa naxariista Eebbe, ee ma aha camal keliya; rumaysad iyo dadaal daacad ah ayaa ah siyaabaha, laakiin ninna shuqulladiisu ma kasban karaan abaalgud weligeed ah nimcadiisa la'aanteed.",
      "Qur'aanku waxa uu ku booriyay mu'miniinta inay u tartamaan oo ay u degdegaan dambi-dhaafka iyo Jannada 'ballaaran sida samooyinka iyo dhulka' - waxaa loola jeedaa in si firfircoon loo raadsado, oo aan rajo laga qabin.",
      "Abaalmarinta ugu weyn ee dhammaan ma aha beero ama wabiyaal ee waa in la arko wejiga Eebe - farxadda kama dambaysta ah ee loo yaboohay ehelka Jannada.",
    ],
    quran: [
      {
        excerpt:
          "Una dagdaysta dambi dhaafka Eebihiin iyo Janno Ballaaran oo la mid ah Samooyinka iyo Dhulka.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Naarta (Jahannam)",
    summary:
      "Digniin dhab ah - maaha in laga quusto rumaystayaasha laakiin in la toosiyo digtoonaan.",
    lessons: [
      "Jahannama waa digniin dhab ah, ma aha tusaale - Qur'aanku si cad ayuu u qeexay si dadku khatarta ugu qaataan si dhab ah oo ay u beddelaan dariiqa inta ay weli awoodaan.",
      "Naarta ka cabsashada waxaa loola jeedaa in lagu garab shaqeeyo rajada naxariista Alle: Mu'minku wuxuu dhex socdaa khawf (cabsi) iyo raja (rajo), sidaas darteed quus iyo ammaan been ah midna kama qaado.",
      "Qofkii dembaabaa Qur’aanku wuxuu tilmaamay in aan la cafin karin haddii uu qofku ku dhinto korkiisa waa shirki – la wadaajinta Eebbe; wax ka yar inuu u dambi dhaafo cidduu doono.",
      "Eebe wuxuu u digay inuu dadka u soo celiyo, ee ma aha inuu burburiyo ruuxii toobad keena - Digniin kastaa wuxuu ku lamaanaa Qur'aanka iyo Casuumad furan.",
    ],
    quran: [
      {
        excerpt: "Eebana ma dhaafo la wadaajinta, wuxuuse ka dhaafaa waxa ka yar cidduu doono.",
      },
    ],
    actions: [
      "Salaad kasta maanta ka bacdi, si dhab ah Alle uga bari inuu naarta kaa ilaaliyo.",
      "Cusbooneysii tawxiidkaaga: ka fiirso cibaadada Alle kaligiis, ilaalinta ugu sugan Jahannamada.",
    ],
  },
  {
    title: "Cadaaladda",
    summary: "Ku adkaysta caddaaladda xataa idinka iyo xigaalkiinna.",
    lessons: [
      "Caddaaladda Qur’aanka kariimka ah waa mid aan tanaasul lahayn: u adkayso xitaa marka ay runtu kugu xisaabtanto naftaada, waalidkaa, ama xigtadaada ugu dhow.",
      "Eebbana wuxuu amray in dadka nacaybka loo qabo waligood aanay idin gelin dulmi. taas ayaa u dhaw xaqnimada (taqwa)' - sidaas darteed caddaaladda waxaa lagu leeyahay xitaa cadawga.",
      "Dulmiga (dhulm) aad baa looga digay; Rasuulku ﷺ wuxuu baray in dulmigu u muuqan doono mugdi qofka daalimiinta ah maalinta qiyaame.",
      "Caddaaladdu ma aha oo keliya garsoorayaasha iyo taliyayaasha - waxay ku nooshahay hadal daacad ah, iyo caddaalad, iyo oofinta eraygaaga, iyo in qof kasta la siiyo xaqiisa.",
    ],
    quran: [
      {
        excerpt:
          "Idinku noqda kuwa xaqa dhawra oo Eebbe marag ka ahaada, xataa idinka iyo waalidkiinna iyo qaraabadaada.",
      },
    ],
    actions: [
      "Sii qof xuquuqdiisa maanta - mushahar cadaalad ah, jawaab daacad ah, ama deyn aad ku leedahay.",
      "Qabo hal daqiiqo oo eexdu kugu duufsato inaad caddaalad-darro noqoto, oo beddelka dooro caddaalad.",
    ],
  },
  {
    title: "Aqoon",
    summary: "Akhri oo milicso, oo waxaad tidhaahdaa 'Eebbow ii kordhi cilmiga.",
    lessons: [
      "Eraygii ugu horreeyay ee Qur'aanka lagu soo dejiyay wuxuu ahaa 'Akhri' - Islaamku kuma furmin caado, laakiin wuxuu ku furay amar ah in wax la barto, iyada oo la ixtiraamayo akhris-qoraalka maskaxda iyo aqoonta qalbiga labadaba.",
      "Eebe wuxuu u sheegay xitaa Nebigiisa ﷺ inuu weydiiyo wax badan: 'Eebbow, ii kordhi cilmiga' - waxa kaliya ee Qur'aanku farayo inuu u kordhiyo.",
      "Aqoonta waxtarka leh waxaa loogu talagalay in lagu dhaqmo oo la gudbiyo; Rasuulku ﷺ wuxuu baray in culimadu yihiin kuwa dhaxli kara nabiyada, iyagoo aan dhaxalsiin xoolo ee ay dhaxlaan cilmi.",
      "Raadinta cilmiga xurmada leh lafteedu waa cibaado, Quraankuna wuxuu si cad u kala saaray kuwa wax yaqaan iyo kuwa aan aqoon - 'ma siman yihiin?'",
    ],
    quran: [
      {
        excerpt: "Waxaad dhahdaa: Eebow ii siyaadi cilmiga.",
      },
    ],
    actions: [
      "Qur'aanka ka baro hal shay maanta - aayad, kelmad, ama xukun - oo qof u baro.",
      "Xifdi du'a 'Rabbi zidni ilma' oo ku dheh intaanad baran.",
    ],
  },
  {
    title: "Nabiyada",
    summary:
      "Sheekooyinka hanuuninta, tijaabinta, iyo taageerada rabbaaniga ah - maaha madadaalo laakiin waa tilmaam.",
    lessons: [
      "Quraanku waxa uu ina barayaa in aan ummad laga tegin hanuun la'aan: 'Ma jirto ummad aan ka ahayn in uu udige dhex maray' - isla farriinta tawxiidka ayaa meel walba la soo diray.",
      "Nebiyadii oo dhami waxay keeneen hal baaq oo udub dhexaad u ah - caabuda Allaah keligiis - sheekadoodana looma tiriyo inay tahay taariikh aawadood, laakiin waxay u tahay tilmaam 'kuwa wax fahma'.",
      "Muxammad ﷺ waa shaabadda Nabiyada, iyo rasuulkii ugu dambeeyay, Muslimkuna waa inuu rumeeyo nabiyadii isaga ka horreeyay oo dhan - Nuux, Ibraahim, Muuse, Ciise iyo inta kale - oo aan kala soocin dhexdooda.",
      "Nebiyadu waxay ahaayeen bani aadam iyo addoomo Alle, ee ma aha kuwo rabbaani ah; Qur'aanku wuu karaameeyay haddana wuxuu ku adkeeyey dhinaca uunka, oo aan waligood la caabudin Abuuraha.",
    ],
    quran: [
      {
        excerpt: "Sheekadooda waxay cashar ugu tahay kuwa wax fahma...",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Haweenka",
    summary:
      "Xuquuqda, sharafta, iyo sinnaanta ruuxiga ah -Maryam waxay ka mid tahay haweenka ugu fiican.",
    lessons: [
      "Qur’aanku waxa uu barayaa sinnaanta ruuxiga ah ee ragga iyo dumarka ee Eebbe agtiisa: isku iimaan, isku camal iyo isku abaal-marin waxa loogu yaboohay ‘mu’miniinta ragga iyo dumarka mu’miniinta ah’ si isku mid ah.",
      "Dumarka iyo ragga waxaa lagu tilmaamaa inay yihiin shuraako iyo ilaaliyeyaasha midba midka kale caqiidada, ma aha hanti ahaan - suuradda afraad, an-Nisa ('Haweenka'), waxay inta badan u heellan tahay ilaalinta xuquuqdooda, sharaftooda, dhaxalkooda iyo daaweyntooda.",
      "Qur'aanku wuxuu kor u qaaday Maryama, hooyadii Ciise, tusaale u ah dhammaan mu'miniinta, wuxuuna u sharfay hooyooyinka si aad u sarreeya taas oo baridda caanka ah ay Jannada ku dhejiso cagahooda.",
      "Labada jinsiba waxay ka soo jeedaan hal asal - 'wuxuu kaa abuuray hal naf' - oo dhidibada u taagay dadnimo iyo sharaf la wadaago oo laga soo bilaabo aayadda ugu horreysa ee suuradda an-Nisa.",
    ],
    quran: [
      {
        excerpt:
          "Ka Dhawrsada Eebihiin Eebaha idinka Abuuray Naf qudha kana Abuuray Xaggeeda Haweenkeeda…",
      },
    ],
    actions: [
      "Ku sharfo naag noloshaada maanta - hooyo, naag, walaashii, ama gabadh - xaq gaar ah ama naxariis ay ku leedahay.",
    ],
  },
  {
    title: "Carruurta",
    summary: "Aamino (amana) - in lagu kor qaado tawxiidka iyo naxariista.",
    lessons: [
      "Carruurtu waa amaana- waa ammaano xagga Eebbe ka timid-- Qur’aankuna wuxuu waalidku mas’uul ka dhigayaa korriintooda: 'ka ilaaliya naftiinna iyo qoysaskiinna naarta' wuxuu ku billaabay in la baro tawxiidka iyo akhlaaqda wanaagsan.",
      "Rasuulku ﷺ wuxuu ku tiriyay baridda iyo barashada qur’aanka mid ka mid ah camalka ugu wanaagsan, sidaa darteed in ubadka lagu hanuuniyo inuu akhriyo xitaa in yar oo ka mid ah wuxuu beeraa wanaag waara oo ajarkiisu u soo noqdo waalidka.",
      "Xikmado barbaarineed oo si weyn loo soo celceliyay ayaa kula talisa la kulanka carruurta marxaladda ay ku jiraan - la ciyaarista sanadaha hore, ka dibna wax bara oo si tartiib ah u edbiya, ka dibna la saaxiib marka ay koraan.",
      "Ilmo xaq ah oo la koriyo waa maal ka baxsan noloshan: Farcankii xaqa ahaa oo u duceeya waalidkii wuxuu sii wadaa inuu ka faa'iidaysto dhimashada ka dib.",
    ],
    quran: [
      {
        excerpt: "Kuwa (Xaqa) rumeeyow ka dhawrsada Naftiina iyo Ehelkiinna Naarta.",
      },
    ],
    actions: [
      "Ilmaha maanta hal aayad gaaban ama hab wanaagsan u bar, samir iyo dhiirigelin.",
      "U duca ubadkiina (ama ubadkiina) magacooda si ay u noqdaan kuwa toosan oo Eebbe jecel yahay.",
    ],
  },
];

export const QURAN_GUIDE_TAJWEED_SO: DeepPartial<QuranGuideTajweedLesson>[] = [
  {
    title: "Duhur Sakinah & Taween",
    summary: "Xeerarka ن leh sukun iyo taween - izhar, idgham, iqlab, ikhfa.",
    explanation: [
      "Duhur sakinah waa xarafka ن oo xambaarsan sukun ( shaqal la'aan); tanween waa shaqal labanlaaban ee dhammeeya (an, in, un) oo u dhawaaqa la mid ah duhurnimada dhamaadka kelmadda. Labaduba waxay raacaan afar xeer oo isku mid ah, oo gebi ahaanba lagu go'aamiyo xarafka soo socda.",
      "Izhar (ku dhawaaqid cad): marka ay raacdo mid ka mid ah lixda xaraf ee cunaha ah (ء ه ع ح غ خ), duhurka si cad oo bayaan ah ugu dhawaaq, iyada oo aan sanku isku darin.",
      "Idgham (isku-darka): ka hor xarfaha ereyga 'yarmaloon' (ي ر م ل و ن), duhurnimadu waxay ku biirtaa xarafka xiga - oo leh ghunnah (sanka sanka) ee ي ن م و, oo aan lahayn ghunnah for ل ر.",
      "Iqlab (rogid): marka la raaco ب, duhurkii waxa loo beddelaa dhawaaq qarsoon oo xuunnah la socda.",
      "Ikhfa (qarin): Shan iyo toban xaraf ka hor, duhurkii si buuxda looguma dhawaaqin, si buuxdana looguma biirin - waxay la 'qarsoon tahay' ghunnah sanka khafiifka ah iyadoo carrabku isu diyaarinayo xarafka xiga.",
    ],
    practice:
      "U akhri suuradda al-Faatixa si tartiib ah, mar kasta oo aad la kulanto duhur sakinah ama taween, ku jooji magaca afarta xeer ee khuseeya iyo sababta.",
  },
  {
    title: "Meem Sakinah",
    summary: "Ikhfaa shafawi, idgham shafawi, iyo izhar shafawi for م with sukun.",
    explanation: [
      "Meem sakinah waa xarafka م xambaarsan sukun. Waxay leedahay saddex xeer oo mid walba loo bixiyay 'shafawi' (labial) sababtoo ah meem waxaa lagu soo saaraa bushimaha, midda ay khusaysona waxay ku xiran tahay oo keliya xarafkan soo socda.",
      "Idgham shafawi (labial merging): marka meem sakinah uu raaco meem kale, labadu waxay ku biiraan hal meel oo walaacsan oo lagu hayo ghunnah.",
      "Ikhfa shafawi (labial dhuumasho): marka uu raaco ب, meerku si fudud ayaa loo qariyaa - bushimaha ayaa soo dhawaada laakiin si buuxda uma cadaadin - waxaa weheliya ghunnah.",
      "Izhar shafawi (labial clarity): xaraf kasta ka hor, meemka si cad ayaa loogu dhawaaqaa. Si gaar ah u taxaddar ka hor xarfaha و iyo ف, halkaas oo ay ardadu aad ugu damcaan in ay qariyaan.",
    ],
    practice:
      "Akhri dhowr suuradood oo gaagaaban oo ka mid ah Juzca Camma oo calaamadi meem sakinah kasta, adoo magacaabaya xukunkeeda ka hor inta aanad akhrin kalimada.",
  },
  {
    title: "Madd (Kordhinta)",
    summary: "Shaqalada dabiiciga ah, sare iyo lama huraanka ah.",
    explanation: [
      "Madd macneheedu waa kala bixinta dhawaaqa shaqalka, waxayna ku dhacdaa saddexda xaraf ee waalan - alif (ا), waw (و), iyo ya (ي) - marka aanay sidan shaqal iyaga u gaar ah oo ay raacaan shaqalkooda gaaban ee u dhigma.",
      "Madd asli (madd-dabiiciga ah) waa dhererka aasaasiga ah ee qiyaastii laba tirinta, oo jooga meel kasta oo warqad waalan ay ka soo baxdo iyada oo aan sabab gaar ah lahayn ka dib. Akhriste kasta si siman buu u hayaa.",
      "Madd far'i (maddka labaad) waxaa kiciyay hamza ama sukun oo soo socda waxaana la hayaa dheer - badiyaa afar ama lix tirinta. Dhererka saxda ah wuxuu ku xiran yahay nooca madd iyo akhrinta (riwaayah) aad raacdo.",
      "Sababtoo ah joogsiga dhamaadka kelmadda waxay abuuri kartaa sukun, waxay sidoo kale dheerayn kartaa waalan - hal sabab oo kale oo lagu baranayo muddada dhegta macalin aqoon leh halkii aad qiyaasi lahayd.",
    ],
    practice:
      "Dooro suurad gaaban oo la yaqaan oo si tartiib ah ku tiri '1-2' waalan kasta oo dabiici ah iyo '1-2-3-4' ee waallida sare, adoo ilaalinaya waqtigaaga xitaa.",
  },
  {
    title: "Gunnah",
    summary: "Dhawaaq sanka oo la socda duhurkii iyo meem ee idgham iyo ikhfa.",
    explanation: [
      "Ghunnah waa sanqadha sanka ka soo baxa sanka, tayada la taaban karo ee xarfaha duhurnimo (ن) iyo meem (م). Akhrinta caadiga ah waxa lagu qabtaa ilaa laba tixood.",
      "Waxaa loo baahan yahay oo ay ugu badan tahay dhowr xeer oo aad horey u baratay: idgham oo leh ghunnah, ikhfa, iqlab, iyo mar kasta oo duhur ama meem uu qaado shadah.",
      "Codku waa inuu noqdaa mid siman oo la kontaroolo - ma aha heeso ama hurin laxan, laakiin codka sanka oo joogto ah ayaa lagu qiyaasaa dhererka saxda ah.",
      "Tijaabo fudud: sankaaga si fudud u qabo marka aad soo saarayso xaraf ghunnah ah; Haddii dhawaaqa la xiro, dhawaaqa ayaa si dhab ah sanka uga soo galaya sidii la rabay.",
    ],
    practice:
      "Ku akhri kelmad shadah ah duhurkii ama meem, adigoo ku haysta ghunnah laba xisaabood oo joogto ah, dabadeed is qor oo barbar dhig akhriste aqoon u leh.",
  },
  {
    title: "Qalqalah",
    summary: "Ku celcelinta ku soo kabashada ق ط ب ج د marka sakiin ama marka uu istaago iyaga.",
    explanation: [
      "Qalqalah waa 'bounce' yar oo soo noqnoqonaysa oo la siiyay shan xaraf - oo lagu soo ururiyay weedha قُطْبُ جَدٍ, taas oo ah ق ط ب ج د - mar kasta oo ay qaadaan sukun.",
      "Bounce waa gariir iftiin ah oo barta articulation; Waa inaadan ku darin shaqal buuxa xarafka ka dib, kaliya u ogolow inuu si nadiif ah 'dib ugu soo noqdo'.",
      "Way ka fududaanaysaa (sughra) marka xarafku leeyahay sukun kelmad dhexda ku jira, wayna ka sii xoog badan tahay oo caddahay (kubra) markaad xarafkaas ku dul istaagto dhammaadka kelmad.",
      "Ka dhig boodboodka dhexdhexaad - ha u jeedin dhinaca 'a', 'i', 'u' dhawaaqa; waa isla dhawaaq qaylo-dhaan leh iyadoon loo eegin shaqallada ku xeeran.",
    ],
    practice:
      "Akhri suuradda al-Ikhlaas oo si adag u dul istaag xaraf kasta oo qalqalah - د of 'aad' iyo 'yulad' - adigoo dareemaya soo kabashada nadiifka ah.",
  },
  {
    title: "Waqf (Joojinta)",
    summary: "Meesha laga joogsado, neefsado, iyo sida joojinta ay isu beddesho dhawaaqa.",
    explanation: [
      "Waqafku waa fanka meesha iyo sida loo hakiyo. Musxafku waxa uu calaamado yar yar ku calaamadiyaa meelaha joogsiga - tusaale ahaan م joogsi loo baahan yahay, ط iyo ج joogsiyada la oggol yahay, iyo لا macnaha halkan ha ku joogsan - si uu u hago akhristaha.",
      "Joojinta badanaa waxay aamusisaa shaqalka u dambeeya, iyada oo u beddeleysa xarafka u dambeeya sukun. Isbeddelkaas ayaa markaa kicin kara xeerar kale, sida qalqaalah ama waalli dheer oo dheer, markaa kelmadu waxay u dhawaaqi kartaa si ka duwan markaad ku joogsato marka loo eego markaad sii waddo.",
      "Meesha aad ku hakado waxay saameyn kartaa macnaha, markaa waligaa ha u jabin jumlada dhexe si ay u rogrogto. Kiis gaar ah waa mucanaqa (isku duubnida) waqaf, oo lagu calaamadeeyay saddex dhibcood, halkaas oo aad ku joogsan karto mid ka mid ah laba dhibcood laakiin ma aha labadaba.",
      "Habka ugu badbaadsan ee lagu baran karo joogsiyada saxda ah waa musxaf ka muuqda calaamado waqaf ah oo ay weheliyaan akhriye aqoon u leh, markaa hakadyadaadu waxay u dhigmaan akhrinta la gudbiyo.",
    ],
    practice:
      "Qaado hal bog oo leh calaamado waqaf ah oo kor u akhri adigoo raacaya duubista macalin tajwiidka, adigoo si sax ah u istaagaya halka calaamaduhu tilmaamayaan.",
  },
  {
    title: "Hamzat Wasl",
    summary:
      "The connecting hamza that is pronounced only when starting, and dropped when joining.",
    explanation: [
      "Hamzat wasl (ٱ) is a connecting hamza written with a small saddah-like mark above an alif. It appears at the start of many nouns, verbs, and particles — including the definite article ال.",
      "When you begin recitation on a word that starts with hamzat wasl, you pronounce it with a clear hamza sound so the word can open cleanly.",
      "When the word is joined to what comes before it, the hamzat wasl is silent — you glide from the previous letter straight into the following letter and do not sound a separate hamza.",
      "Recognizing hamzat wasl helps you avoid inserting an extra glottal stop mid-phrase, which is a common beginner habit when reading the mushaf slowly.",
    ],
    practice:
      "Recite the basmalah and Surah al-Fatiha, pausing at each ٱ to decide whether you are starting (pronounce) or joining (drop).",
  },
  {
    title: "Lam Shamsiyah",
    summary: "Sun letters that assimilate the لام of ال, versus moon letters that keep it clear.",
    explanation: [
      "When the definite article ال is attached to a noun, the لام may be pronounced clearly or assimilated, depending on the following letter.",
      "Sun letters (huruf shamsiyah) cause the لام to be silent and the next letter to be doubled with a shaddah — as in ٱلرَّحْمَٰن where the ر absorbs the لام.",
      "Moon letters (huruf qamariyah) keep the لام clear — as in ٱلْقَمَر — so you hear both the لام and the following letter.",
      "Learning the sun and moon sets by heart (or by ear from a teacher) prevents over-pronouncing silent لام and under-pronouncing clear لام.",
    ],
    practice:
      "Open Juz Amma and mark ten nouns with ال: for each, name whether the لام is shamsiyah (silent) or qamariyah (clear) before you recite.",
  },
  {
    title: "Silent Letters",
    summary: "Letters written in the mushaf that are not pronounced in continuous recitation.",
    explanation: [
      "Some letters appear in the Uthmani script for historical or orthographic reasons but are not sounded when you recite — they are marked silent in tajweed colorings.",
      "Common cases include certain alifs that are written but not elongated, and letters that are assimilated into a following shaddah so they leave no separate sound.",
      "Silent marking is a reading aid: it keeps the written mushaf faithful while guiding the tongue not to invent an extra sound.",
      "When in doubt, follow a colored tajweed mushaf or a qualified reciter — the goal is fidelity to the transmitted reading, not guessing from spelling alone.",
    ],
    practice:
      "With tajweed colors on, read one page slowly and whisper only the colored (sounded) letters — skip every silent-marked letter deliberately.",
  },
];

export const QURAN_GUIDE_VOCABULARY_SO: DeepPartial<QuranGuideVocabEntry>[] = [
  {
    meaning:
      "Ilaaha runta ah oo keliya - magaca saxda ah oo ka kooban dhammaan magacyada quruxda badan.",
    frequency: "2,700+ dhacdooyin",
    example: "Bismillah - Magaca Eebe",
    quranRef: {
      excerpt: "Magaca Eebe yaan ku billaabaynaa ee Naxariis guud iyo mid gaaraba Naxariista.",
    },
  },
  {
    meaning: "Rabbi, Master, Sutainer - kan wax abuura, leh, koriya, oo maamula.",
    frequency: "Aad u badan",
    example: "Rabbana - Rabbigeenna",
    quranRef: {
      excerpt: "Mahad dhamaanteed waxay u sugnaatay Allaah, Eebaha Caalamka.",
    },
  },
  {
    meaning: "Naxariista, naxariista, naxariista Alle iyo khalqiga dhexdooda.",
    frequency: "Xidid guud ر-ح-م",
    example: "Ar-Raxmaan, Ar-Raxiim",
  },
  {
    meaning: "Beerta, Jannada - Hoyga abaalgudka weligeed ah.",
    frequency: "Soo noqnoqda",
    example: "Beero ay maraan wabiyaal hoostooda",
  },
  {
    meaning: "Dab - waxa loola jeedaa Jahannam digniin iyo cawaaqib xumo.",
    frequency: "Soo noqnoqda",
    example: "ka cabsada naarta loo darbay gaalada",
  },
  {
    meaning: "Rumayn, rumayn, talo saarashada Alle iyo aqbalida dhambaalkiisa.",
    frequency: "Aad u badan",
    example: "Kuwa xaqa rumeeyow ( ya ayyuha alladhina amanu)",
  },
  {
    meaning: "Samir, samir, samir Alle dartiis.",
    frequency: "Soo noqnoqda",
    example: "Eebana wuxuu la jiraa kuwa samra",
  },
  {
    meaning: "Mahadnaq - qirashada barakooyinka qalbiga, carrabka, iyo addimada.",
    frequency: "Soo noqnoqda",
    example: "Haddaad mahadisaan, hubaal waan idiin kordhin doonaa",
  },
  {
    meaning: "Alle-ka-war-qabka, Taqwada, Naftada oo laga dhawro dembiga Alle ka cabsi darteed.",
    frequency: "Aad u badan",
    example: "Idinkana waxaa ugu fadli badan Eebbe agtiisa",
  },
  {
    meaning: "Rizqiga, rizqiga - waxa Eebbe u qaddaray naf kasta.",
    frequency: "Soo noqnoqda",
    example: "Eebbana waa kan ugu kheyr badan",
  },
  {
    meaning: "Iftiin - hanuuninta, muujinta, iyo iftiinka wadnaha.",
    frequency: "Soo noqnoqda",
    example: "Alle waa nuurka samooyinka iyo dhulka",
    quranRef: {
      excerpt: "Allaah waa nuurka samooyinka iyo dhulka...",
    },
  },
  {
    meaning:
      "Noloshan adduunyo - macno ahaan 'nolosha ugu dhow'. Qur'aanka kariimka ah waa ku meel gaadh iyo imtixaan, ka duwan aakhiro waarta, mana aha guriga dhabta ah ee mu'miniinta.",
    frequency: "Soo noqnoqda",
    example: "Nolosha adduunku (al-hayat ad-dunya) waa maaweelo iyo dheeldheel",
  },
  {
    meaning:
      "Aakhiro - nolosha weligeed ah dhimashada ka dib, oo ay ku jiraan sarakicidda, xukunka, Jannada, iyo Naarta. Waa nolosha dhabta ah ee waarta ee Qur'aanku ku booriyay mu'miniinta inay ka shaqeeyaan.",
    frequency: "Soo noqnoqda",
    example: "Aakhirana (al-akhirah) ayaa khayr badan oo waari doonta",
  },
  {
    meaning:
      "Salaadda cibaadada, oo ah tiirka labaad ee Islaamka, ayaa la tukan jiray shan jeer maalintii. Erayguna waxa uu xanbaarsan yahay xidhiidhka iyo baryada Alle.",
    frequency: "Aad u badan",
    example: "Ooga salaadda xuskayga",
  },
  {
    meaning:
      "Kitaab ama Qorniin - inta badan Qur'aanka laftiisa ('kaasi waa kitaabka'), laakiin sidoo kale kutubtii hore ee la soo dejiyey iyo diiwaanka camalka. Ku xididaysan k-t-b, si loo qoro.",
    frequency: "Aad u badan",
    example: "Kani waa kitaabka (dhalika al-kitaab) oon shaki ku jirin",
  },
];

export const QURAN_GUIDE_LETTERS_SO: DeepPartial<QuranGuideLetter>[] = [
  {
    name: "Alif",
    pronunciation: "Dheer /a/ sida 'aabbe' (marka aad qaadid hamza ama waalan)",
  },
  {
    name: "Ba",
    pronunciation: "Sida Ingiriisiga 'b'",
  },
  {
    name: "Ta",
    pronunciation: "Sida Ingiriisiga 't'",
  },
  {
    name: "Taa",
    pronunciation: "Sida 'th' ee 'feker'",
  },
  {
    name: "Jim",
    pronunciation: "Sida 'j' ee 'jam'",
  },
  {
    name: "Haa",
    pronunciation: "Neef fiiqan h cunaha - maaha Ingiriisi 'h'",
  },
  {
    name: "Kha",
    pronunciation: "Sida Scottish 'loch' - xanuunka cunaha",
  },
  {
    name: "Dal",
    pronunciation: "Sida Ingiriisiga 'd'",
  },
  {
    name: "Dhal",
    pronunciation: "Sida 'th' in 'kan'",
  },
  {
    name: "Ra",
    pronunciation: "Duubtay/la tijaabiyay 'r'",
  },
  {
    name: "Zay",
    pronunciation: "Sida Ingiriisiga 'z'",
  },
  {
    name: "Dembiga",
    pronunciation: "Sida Ingiriisiga",
  },
  {
    name: "Shin",
    pronunciation: "Sida 'sh' ee 'markab'",
  },
  {
    name: "murugo",
    pronunciation: "Ephatic 's' - carrabka oo kor u kaca, cod buuxa",
  },
  {
    name: "Aabe",
    pronunciation: "Xoojinta 'd' - gaar ah Carabiga",
  },
  {
    name: "Ta (xoog leh)",
    pronunciation: "Xooga saara 't' - qoto dheer oo afka ah",
  },
  {
    name: "Za (xoog leh)",
    pronunciation: "Nooca xoogga leh ee codka 'dh'",
  },
  {
    name: "Cayn",
    pronunciation:
      "Cidhiidhi laga dhawaajiyey oo ka yimid dhuunta dhexe - ma jiro Ingiriis u dhigma; baro adoo ku dayanaya akhriye",
  },
  {
    name: "Ghayn",
    pronunciation: "Sida Faransiiska 'r' ama gargling 'gh'",
  },
  {
    name: "Fa",
    pronunciation: "Sida Ingiriisiga 'f'",
  },
  {
    name: "Qaf",
    pronunciation: "Deep 'k' xagga dambe ee carrabka - maaha Ingiriisi 'k'",
  },
  {
    name: "Kaf",
    pronunciation: "Sida Ingiriisiga 'k' (horay afka)",
  },
  {
    name: "Lam",
    pronunciation: "Like English 'l'",
  },
  {
    name: "Mim",
    pronunciation: "Like English 'm'",
  },
  {
    name: "Nun",
    pronunciation: "Like English 'n'",
  },
  {
    name: "Ha (light)",
    pronunciation: "Soft 'h' at end of words",
  },
  {
    name: "Waw",
    pronunciation: "Like 'w' or long 'oo'",
  },
  {
    name: "Haa",
    pronunciation: "Like 'y' or long 'ee'",
  },
];

export const QURAN_GUIDE_PRONUNCIATION_SO: DeepPartial<QuranGuidePronunciationPair>[] = [
  {
    title: "Ayn vs Ha",
    tip: "Labaduba waxay ka yimaadaan dhuunta laakiin waxay ku kala duwan yihiin cod ahaan. Cayn (ع) waa cidhiidhi laga dhawaajiyey oo ka yimid dhuunta badhtankeeda - xadhkaha codka ayaa gariiraya. Ha (ح) waa iska horimaad neefsan oo xooggan, aan cod lahayn, sida taah culus oo aan gariir lahayn. Midkoodna Ingiriisi kuma jiro, markaa dhegta uga baro akhriyaha.",
  },
  {
    title: "Ha vs Kha",
    tip: "Ha waa ka fiiqan yahay oo ka fudud yahay; Kha wuu ka qoto dheer yahay khilaaf badan - sida 'loch'.",
  },
  {
    title: "Sin vs Sad",
    tip: "Sin (س) waa iftiin, khafiif ah 's' sida Ingiriisiga 'eeg'. Sad (ص) waa mataankeeda culus, xoogga saaraya: kor u qaad dhabarka carrabka, afka wax yar ku wareeji, codkuna wuu sii qoto dheeraa. Isku qasidooda waxay bedeli kartaa erayada - sabar (sabir) iyo akhriska iftiinka.",
  },
  {
    title: "Dal vs Dad",
    tip: "Dal (د) is a plain 'd'. Aabbe (ض) waa 'd' culus oo u gaar ah Carabiga - ku cadaadi dhinaca carrabka oo ka soo horjeeda gowsaha sare oo codka ha buuxiyo afka. Carabiga xitaa waxaa lagu naaneeso 'luqada Aabaha' sababtoo ah xarafkan gaarka ah.",
  },
  {
    title: "Ta vs Ta (emphatic)",
    tip: "Emphatic ط is deeper; Ha ku beddelin Ingiriisiga 't' kaliya.",
  },
  {
    title: "Dhal vs Za (emphatic)",
    tip: "Labaduba waxay ku lug leeyihiin dhawaaqa 'th'; ظ wuu ka culus yahay oo xooga saarayaa.",
  },
  {
    tip: "Kaf (ك) waa hore 'k' sida Ingiriisi 'furaha'. Qaf (ق) ayaa gadaal laga sii wadaa - dhabarka carrabku wuxuu taabtaa uvula, isagoo siinaya qoto dheer, guntuur 'k' oo aan lahayn Ingiriis u dhigma. Kala saar: qalb (qalbi) ma aha kalb (ey).",
    title: "Kaf vs Qaf",
  },
  {
    title: "Ghayn vs Kha",
    tip: "Ghayn has voice; Kha waa khilaaf aan cod lahayn.",
  },
];

export const QURAN_GUIDE_MEMORIZATION_PLANS_SO: DeepPartial<QuranGuideMemorizationPlan>[] = [
  {
    title: "Beginner — Juz Amma",
    summary:
      "Meesha dabiiciga ah ee qof walba. Ku bilow suuradaha aadka u gaagaaban ee dhamaadka musxafka - laga bilaabo an-Nas dib u shaqaynta - kuwaas oo fudud, degdeg ah ajar badan, waxtarna u leh salaad kasta.",
    surahs: ["An-Nas", "Al-Falaq", "Al-Ikhlas", "Al-Masad", "An-Nasr", "Al-Kafirun", "Al-Kawthar"],
    tip: "Xafid kaliya hal aayad maalintii: dhagayso murattal akhriyaha ku celceli toban jeer, kor ugu dhawaaq ilaa uu ka qulqulayo, ka dibna ku biir waxaad hore u haysatid ka hor intaadan dhaqaaqin.",
  },
  {
    title: "Dhexdhexaad - Toban suuradood oo xudun u ah",
    summary:
      "Markay suuradaha gaagaaban ay adag yihiin, qaado cutubyada dhaadheer ee la jecel yahay ee xambaarsan fadliga weyn oo inta badan la akhriyo Jimcaha iyo habeenkii - al-Mulk, Ya-Sin, ar-Rahman, al-Waqicah, al-Kahf.",
    surahs: [
      "Al-Faatixa",
      "Al-Mulk",
      "Yaa-Sin",
      "Ar-Raxmaan",
      "Al-Waaqicah",
      "Al-Kahf",
      "Al-Jumaca",
      "Al-Hashr",
    ],
    tip: "Xusuuso cusub ku dheji meel maalinle ah oo go'an - waqtiga xasilloon, maskax fayow wax yar ka dib Fajr waa ku habboon yahay - sidaas darteed joogteynta ayaa kor u qaada culeyska culus.",
  },
  {
    title: "Sare - Hal juz",
    summary:
      "Go'aanso inaad dhammaystirto juz buuxa adigoo wax walba ilaalinaya ka hor inta aanay dhagax adag ahayn. Qaar badan waxay ku bilaabmaan Juzka 29 ama 30, kuwaas oo ay hore u garanayeen suuraddooda qayb ka mid ah, ka bacdina dibadda hal juz markiiba.",
    surahs: ["Dooro juz - qaar badan ayaa ku bilaaba Juzka 29 ama 30, ka dibna ballaariya"],
    tip: "Weligaa qayb cusub ha ku darin ilaa kii hore si adag dib loo eego. Rasuulku ﷺ wuxuu ka digay in Qur'aanka xifdisan uu si degdeg ah u simbiriirixdo intay geel xirxiran ka jabto.",
  },
  {
    title: "Safarka Xaafid",
    summary:
      "Xifdiga Qur'aanka oo dhan - waa sharaf cimriga oo dhan kor u qaada kii xanbaarsanaa iyo, fadligii Alle waalidkood. Waa go'aan culus, oo sida caadiga ah soconaya dhowr sano oo xusuus maalinle ah iyo dib u eegis edbin leh.",
    surahs: ["Musxaf oo dhan - caadi ahaan 3-7 sano oo leh dib u eegis maalinle ah"],
    tip: "Keligaa ha isku dayin: isticmaal tracker Munib's hifz si aad u maamusho jadwalkaaga dib u eegis, oo si joogto ah ugu akhri Xaafid ama macalin aqoon leh oo qaban kara oo saxi kara khaladaadkaaga.",
  },
];

export const QURAN_GUIDE_DAILY_LESSONS_SO: DeepPartial<QuranGuideDailyLesson>[] = [
  {
    translation: "Kuwa xaqa rumeeyow kaalmaysta samir iyo duco. Eebana wuxuu la jiraa kuwa samra.",
    context:
      "Suuradda al-Baqarah, ee ku soo degtay Madiina. Eebbe wuxuu u lamaaneeyaa laba ilood oo uu mu’minka la kulmo dhibaato – samirka iyo u jeedsashada salaadda – wuxuuna u ballan qaaday wehelkiisa gaarka ah kuwa adkaysta.",
    reflection:
      "Maxaa imminka aan wajahayaa maxkamad aan ku gaarayo si aan uga baxsado halkii aan dulqaadka iyo ducada aayaddani i tilmaami lahayd?",
    action:
      "Ducada hal salaad maanta adigoon degdegin, sujuuddiinnana Allaah uga barya inuu samir ka siiyo imtixaanka gaarka ah ee aad ku jirto.",
  },
  {
    translation: "Naxariistaydu wax walba way koobtay.",
    context:
      "Laga soo bilaabo suuradda al-Acraaf, oo ay kaga hadashay macnaha Muuse iyo qoomkiisa. Eebe wuxuu naxariistiisa ku tilmaamay inay wax walba koobtay - naxariis aad u wayn ayaa ka horraysa oo ka miisaan wayn ciqaabtiisa, taasoo loo gaar yeelay kuwa ku adkaysta xumaanta.",
    reflection:
      "Khaladkee ayaan diidayaa in aan cafiyo, xitaa aniga naftayda oo dhan waxaan ku tiirsanahay naxariista Eebe ee aan xadka lahayn?",
    action:
      "Hal qof oo aad ka cadhooto dooro, maanta qalbigaaga si daacad ah ugu cafi, duco gaabanna Alle uga bari in uu iyagana hanuuniyo oo u dambi dhaaf.",
  },
  {
    translation: "Haddaad mahadisaan, hubaal waan idiin kordhin doonaa.",
    context:
      "Waxaan ka sugnaaday suuradda Ibraahim, waana qayb ka mid ah xusuustii Muuse ee Banii Israa'iil. Eebe wuxuu kordhitaankiisa si toos ah ugu xidhaa mahadnaq - ku shukrinta nimcada waa shayga keena inay koraan, halka ay mahadin la'aantuna ay soo dhawaynayso khasaaradeeda.",
    reflection:
      "Midkee ka mid ah hadiyadaha Alle - caafimaadkayga, qoyskayga, iimaankayga, ama arsaaqdayda - ayaan bilaabay in aan ula dhaqmo usbuucan sidii wax caadi ah oo aniga igu leeyahay?",
    action:
      "Inta aadan seexan caawa, kor u dheh Alxamdulilah saddex barakooyin gaar ah, mid walbana u magacow si ay shukrantu u noqoto mid miyir qabta, ma aha mid toos ah.",
  },
  {
    translation: "Dadkana kula hadal hadal wanaagsan.",
    context:
      "Suuradda al-Israa. Iyada oo ay jirto hanuun ku saabsan sida ay mu'miniintu isu xambaari lahaayeen, Alle waxa uu ina amray in aan ula hadalno dadka - dhammaan dadka - sida ugu wanaagsan, maadaama erayada qallafsan ay yihiin albaab ka mid ah albaabbada uu Shaydaanku ku beero kala qaybinta.",
    reflection:
      "Dib u milicsiga maanta, ereyadaydu inta badan miyay dad dhiseen mise way ka fogaadeen - oo ma ku hadlaa 'ereyo wanaagsan' xitaa kuwa ay igu adag tahay?",
    action:
      "Si kal iyo laab ah u dhiiri geli ama u mahad celi hal qof maanta adigoon dhaleecayn qarsooni jirin, kana celi hal odhaah qallafsan oo aad duufsatay.",
  },
  {
    translation: "Ruuxii Eebe talo Saaro isagaa ka Filan.",
    context:
      "Laga soo bilaabo suurada at-Talaq, oo ka mid ah xukunnada furriinka iyo bixinta - oo ah halka ay dadku dareemaan walaac dhaqaale. Halkaas ayuu Eebe ugu ballan qaaday in ciddii ka cabsata uu ka arzaaqayo meel aanay filayn, ruuxii isaga tala saartana uu ku filan yahay.",
    reflection:
      "Xagee baan ka samaynayaa qorshayaal taxaddar leh oo aan Alle uga tagayo - ama aan ku tiirsanaado caawinta dadka anigoon waligay xaggiisa u soo jeedin ducada?",
    action:
      "Qaado hal go'aan oo ku dhibaya, ku tukado laba rakcadood oo istikhara ah ama ku ducayso duco, ka dibna natiijada Alle ku kalsoonow.",
  },
  {
    translation: "Eebow ii siyaadi cilmiga.",
    context:
      "Suuradda Ta-Ha. Tani waa waxa kaliya ee Qur'aanka ku jira ee uu Alle ku faray Nabiga ﷺ inuu weydiiyo wax badan - aqoonta - taasoo tusinaysa sida aqoonta faa'iidada badan leh loo qaddariyo iyo in qofna, si kastaba ha ahaatee, uusan weligii dhammayn raadinta.",
    reflection:
      "Intee in le'eg ayaan wakhtiga firaaqada ah maanta galay wareegtada aan dhammaadka lahayn, oo xitaa qayb ka mid ah ma u tagi kartaa hal aayad ama hal xadiis beddelkeeda?",
    action:
      "Xafid ducadan gaaban, 'Rabbi zidni ilma', oo caado ka dhig inaad ku dhawaaqdo Fajarka ka dib inta aanad bilaabin maalintaada.",
  },
  {
    translation:
      "Kuwa ku bixiya Xoolahooda Jidka Eebe waxay la mid yihiin iniin ka baxday Todobo Sabuul.",
    context:
      "Suuradda al-Baqarah. Eebbe waxa uu sawir cad ka bixinayaa sida ay sadaqadu u baxdo: iniin qudha oo soo baxday toddobo sabuul, mid walbana boqol xabo ah – oo ay soo noqonayso toddoba boqol oo laab ah, haddana u sii tarmayo cidduu doono. Maalka la siiyey aawadiis lama lumin.",
    reflection:
      "Marka aan bixiyo, ma si aamusnaan ah ayaa loo sameeyaa Allaah dartii, mise waxaan isku arkaa aniga oo raba in dadka kale ay ogaadaan oo ay igu ammaanaan?",
    action:
      "Sadaqo yar maanta bixi, haddaad awooddona si qarsoodi ah u bixi, si ay idiin dhexeyso adiga iyo Alle.",
  },
];

export const QURAN_GUIDE_APPLY_CHALLENGES_SO: DeepPartial<QuranGuideApplyChallenge>[] = [
  {
    verseExcerpt: "Dadkana kula hadal hadal wanaagsan.",
    challenge:
      "Tag maalinta oo dhan adiga oo aan hal kelmad qallafsan, kaftan, ama jeesjees ah u bixin - xitaa kaftan, xitaa marka laga xanaajiyo.",
    habit:
      "Marka xanaaqu kaco, hakad ka hor inta aanad jawaabin oo dooro aamus ama erey naxariis leh.",
  },
  {
    verseExcerpt: "U sheeg ragga mu'miniinta ah inay hoos u dhigaan indhahooda.",
    challenge:
      "Si ula kac ah hoos ugu fiirso indhahaaga waxa Alle ka reebay maanta - shaashadaada, quudintaada, iyo meel fagaare ah.",
    habit:
      "Mar kasta oo aad is qabato, ku beddel daqiiqaddaas shan daqiiqo oo Qur'aanka ah beddelkeeda.",
  },
  {
    verseExcerpt: "Ha odhan iyaga 'uff'...",
    challenge:
      "La hadal waalidka ama odayga maanta si dabacsanaan iyo dulqaad muuqda, adigoon muujin wax cadho ah - oo samee wax aad ugu adeegto.",
    habit:
      "Haddii ay nool yihiin, ballan qaado wac ama booqasho joogto ah; haddii kale duco u samee.",
  },
  {
    verseExcerpt: "Runlowga lajir.",
    challenge:
      "Runta u sheeg maalinta oo dhan adigoon been cad, buunbuunin, iyo xan - xataa kaftan ku jirin.",
    habit:
      "Haddii aad simbiriirixato, isla markiiba toobad keen oo sax wax kasta oo hadalkaagu saameeyo.",
  },
  {
    verseExcerpt: "Eebbana wuxuu la jiraa kuwa samra.",
    challenge:
      "Marka xigta ee ay wax ku niyad jabiyaan, dib u celi kelmad kasta oo qallafsan lixdan ilbiriqsi oo buuxa ka hor intaadan ka jawaabin.",
    habit:
      "U beddel daqiiqadaha xanaaqa dhikr ama laba rakcadood oo salaad ah markasta oo aad awooddo.",
  },
  {
    verseExcerpt: "Haddaad mahadisaan waan idiin kordhin doonaa.",
    challenge:
      "U mahad naq saddex qof oo kala duwan magacyadooda maanta wax gaar ah oo ay kuu qabteen.",
    habit:
      "Ku dhammee habeen kasta adiga oo xusaya hal duco - hal sadar oo ku jira joornaalka Munib.",
  },
  {
    verseExcerpt: "Ruuxii iska cafiya oo wanaajiya ajrigiisa Eebaa iska leh.",
    challenge:
      "Iska daa hal ciil oo aad sidatay - si daacad ah u sii daa, ugu yaraan qalbigaaga dhexdiisa.",
    habit: "Duco aamusan u samee qofkii ku dulmiyay intii aad dhibta ku celin lahayd.",
  },
];

export const QURAN_GUIDE_TADABBUR_PROMPTS_SO: DeepPartial<QuranGuideTadabburPrompt>[] = [
  {
    question: "Muxuu Allaah Aayadan igu barayaa?",
    hint: "Aayaddan si tartiib ah u akhri oo u fiirso dhismaheeda: Eebbe ma amar buu bixinayaa, ma digniin baa, ma ballan buu bixinayaa, mise sheeko buu ka warramayaa? Magacyadiisa keebaa isticmaala, muxuuse magacaasi muujinayaa sida uu halkan inagula dhaqmayo?",
  },
  {
    question: "Sideen maanta tan ugu dabaqi karaa hal fal oo la taaban karo?",
    hint: "Go'aannada aan caddayn; kuwa gaar ah ul. Aayadda u rog hal tallaabo oo la samayn karo - hal sheeko si aad u yeelato, hal caado oo aad bilowdo, hal doorasho oo la sameeyo ka hor inta aan maalinta dhammaan.",
  },
  {
    question: "Waa maxay caado aan wanaajiyo ama ka saaro aayaddan darteed?",
    hint: "U soo deji aayad hawl maalmeedkaaga - hurdadaada, hadalkaaga, kharashkaaga, ducadaada, xidhiidhkaaga. Midkee bay aayaddani si aamusnaan ah far u saaraysaa?",
  },
  {
    question:
      "Aayadan miyay i dhaqaajinaysaa xagga rajada naxariista Eebe ama ka cabsashada caddaaladdiisa - oo maxay labaduba muhiim u yihiin?",
    hint: "Mu'minku wuxuu dhex socdaa khawf (cabsida ciqaabta Alle) iyo raja (naxariistiisa rajada), sida laba baal. Weydii midkee aayaddani kugu xoojinaysaa hadda, iyo in qalbigaagu wax badan uga baahan yahay.",
  },
  {
    question: "Sidee buu Nebigu ﷺ u noolaa aayaddan?",
    hint: "Nabiga ﷺ waxa lagu tilmaamay inuu yahay 'Qur'aan socda'. U fiirso seerah iyo tafsiirka saxda ah - Ibn Kathir wuxuu inta badan soo daliishaa sida uu aayad u qaabeeyay - oo tusaale ahaan u qaado tusaalaha la taaban karo.",
  },
  {
    question: "Waa maxay ducada ay aayadan dhiiri galinaysaa?",
    hint: "Aayaddu duco ha noqoto. Allaah ku warso hadal naftiinna ah inta lagu jiro sujuud, wax kasta oo aayaddu kicisay - ka ilaalinta digniinta, qayb ballan ah, ama kaalmaynta amarka.",
  },
];

export const QURAN_GUIDE_READING_LEVELS_SO: DeepPartial<QuranGuideReadingLevel>[] = [
  {
    title: "Xarfaha Carabiga",
    summary:
      "Baro inaad aqoonsato 28 xaraf oo dhan qaabkooda goonida ah oo mid walba magac u ogow. Tani waa aqoon saafi ah - in la arko xaraf oo isla markiiba la magacaabo dhawaaqeeda - waana aasaaska wax kasta oo kale ayaa ku dhisan.",
    topics: ["Magacyada xarfaha", "Qaababka aasaasiga ah", "Jihada midig-ilaa-bidix"],
  },
  {
    title: "Qaababka xarfaha",
    summary:
      "Ogow in xuruufta badankoodu ay qaab beddelaan iyadoo ku xidhan booskooda - bilawga, dhexda, ama dhammaadka kelmad - maxaa yeelay Carabi waxa ay isugu xidhan tahay sida curis. Baro xarfaha dhawrka ah ee aan weligood ku xidhmin kuwa iyaga ka dambeeya.",
    topics: ["Qoraal ku xidhan", "Xarfaha aan isku xidhnayn", "Alif, waw, ya variants"],
  },
  {
    title: "Xarakat ( shaqal)",
    summary:
      "Si fiican u yaqaan calaamadaha yaryar ee xaraf kasta shaqalkiisa siiya: fatha (a), kasra (i), damma (u), sukun shaqalaawaha ah, shadda labanlaabanaysa, iyo dhammaadka tanweenka. Calaamadahani waa kuwa xarfaha aamusan u beddela erayo la akhriyi karo.",
    topics: ["Shaqaale gaagaaban", "Sukun", "Shaddah labanlaabmay", "Tanween"],
  },
  {
    title: "Ku biirista xarfaha",
    summary:
      "Isku soo wada duuboo: Isku qas xarfaha iyo xarfaha xarfaha iyo erayo gaagaaban, midig ilaa bidixna u akhri. La kulan xeerka xarafka qoraxda iyo dayaxa ee go'aaminaya sida 'al-' ee bilowga kelmad loogu dhawaaqo.",
    topics: ["Qaababka CV", "Horgalayaasha caadiga ah", "Xarfaha qoraxda iyo dayaxa"],
  },
  {
    title: "Akhriska erayada",
    summary:
      "Ku billow inaad si tartiib ah oo saxan u dejiso ereyada Qur'aanka ee dhabta ah - adigoo ku bilaabaya Bismillah iyo kelmadaha al-Faatixa ee aad ku akhrido salaad kasta - si akhrisku ugu xidhmo cibaadada bilowgaba.",
    topics: ["Erayada soo noqnoqda", "Bismillah", "Erayada Al-Faatixa"],
  },
  {
    title: "Aayado akhris",
    summary:
      "U soo gudub aayado gaagaaban oo dhammaystiran oo ka socda Juz Ammaa, adigoo ku daraya wacyigelinta tajwiidka aasaasiga ah iyo halka aad ku joojinayso neefsiga (waqf), had iyo jeer wax akhriya iyada oo la barbar taagan wax akhriya si ay dhegtaadu u hagto carrabkaaga.",
    topics: ["Juz Camma suuradaha", "Calaamadaha Waqf", "Ka daba akhriye"],
  },
  {
    title: "Wax u akhriya si fiican",
    summary:
      "Ku gaadh akhrin hufan, kalsooni leh oo leh xeerarka tajwiidka ee si dabiici ah loo isticmaalo. Joogso qayb maalinle ah oo ku hay macalin ama akhriye aqoon u leh inuu ku hubinayo, maadaama faseexnimada lagu sifeeyay sixid joogto ah, oo aan la gaadhin hal mar oo laga tagay.",
    topics: ["Qaybta maalinlaha ah", "Xeerarka Tajwiidka ayaa lagu dabaqay", "Fikradda macalinka"],
  },
];

export const QURAN_GUIDE_QUIZ_SO: DeepPartial<QuranGuideQuizQuestion>[] = [
  {
    prompt: "Immisa suuradood (cutub) baa ku sugan quraanka?",
    options: ["99", "114", "124", "144"],
    explanation:
      "Qur’aanku waxa uu leeyahay 114 suuradood, oo u dhexeeya saddex aayadood ilaa 286. siday u kala horreeyaan musxafka waxa loo dejiyey waxyi (tawqfi).",
  },
  {
    prompt:
      "Immisa qaybood oo siman (juz) ayaa loo qaybiyaa qur'aanka kariimka ah si loo akhriyo maalin kasta?",
    options: ["7", "12", "30", "60"],
    explanation:
      "Soddon juz. Akhrinta hal juz maalintii waxay dhammaystiraysaa Qur'aanka oo dhan bil gudaheed - habka caadiga ah ee lagu dhammeeyo qaadka inta lagu jiro Ramadaanta.",
  },
  {
    prompt: "Waa kee suuradda ugu dheer quraanka kariimka ah, iyadoo leh 286 aayadood?",
    options: ["Al-Faatixa", "Al-Baqarah", "Yaa-Sin", "An-Nas"],
    explanation:
      "Suuradda al-Baqarah waa tan ugu dheer, waxayna leedahay 286 aayadood. Waa suurad Madani ah oo qani ku ah sharciga iyo hanuunka.",
  },
  {
    prompt: "Run ama been: suuradda Makki waa tii hijriga ka hor lagu soo dajiyay Madiina.",
    options: ["Run", "Been"],
    explanation:
      "Suuradaha Makki waxa ay soo degeen Hijrada ka hor, waxayna inta badan diiradda saaraan caqiidada iyo tawxiidka; Suuradaha Madani ayaa ka daba yimid oo inta badan ku daraa sharci iyo hanuunin bulsho.",
  },
  {
    prompt:
      "Suuraddee ka kooban tahay Aayadaha ugu horreeya ee Nabiga ﷺ lagu soo dejiyey Godka Xiira?",
    options: ["Al-Faatixa", "Al-calaq (Iqra)", "Al-Baqarah", "Al-Ikhlas"],
    explanation:
      "Waxyigii ugu horreeyayna wuxuu ahaa aayadaha furitaanka ee suuradda Al-calaq (96): 'Iqra' — ku akhri magaca Eebahaa abuuray.",
  },
  {
    prompt: "Qiyaastii imisa sano ayaa Qur'aanka la soo dejiyay?",
    options: ["3 sano", "10 sano", "23 sano", "40 sano"],
    explanation:
      "Qur'aanka ayaa si tartiib tartiib ah u soo degay in ka badan 23 sano - 13 Makkah iyo 10 ee Madiina - isagoo ka jawaabaya dhacdooyinka iyo baahiyaha.",
  },
  {
    prompt:
      "Run iyo Been Abuur: Qur’aanku waxa uu bilaabay in la soo dajiyo bisha Ramadaan, Laylatul Qadriga.",
    options: ["Run", "Been"],
    explanation:
      "Alle waxa uu yidhi Qur’aanka waxa la soo dejiyey Ramadaan (2:185) habeenka laylatul qadriga (97:1). Raadinta habeenkaas waa fadli weyn.",
  },
  {
    prompt: "rakco kasta oo ka mid ah salaadda maalin walba suuraddee la akhriyaa?",
    options: ["Al-Ikhlas", "Al-Faatixa", "Al-Kawthar", "An-Nasr"],
    explanation:
      "Suurada al-Faatixah - todobo aayadood - waxa lagu akhriyay cutub kasta oo salaad ah. 'Ma jirto duco loogu talagalay qofka aan akhrin Furitaanka Kitaabka.'",
  },
  {
    prompt: "Waa kee suuradda aan ku billaaban ‘Bismillah ir-Raxman ir-Raxiim’?",
    options: ["Al-Faatixa", "At-Tawbah", "Al-Ikhlas", "An-Nas"],
    explanation: "Suuradda At-Tawbah (9) waa suuradda keliya ee aan ku furmin Basmala.",
  },
  {
    prompt: "Tajwiidka muxuu maamulaa madd?",
    options: [
      "Isku-darka laba xaraf",
      "Fidinta (dheeraynta) codka shaqal",
      "Soo noqnoqoshada xarfaha qaarkood",
      "Meesha lagu joojinayo oo lagu neefsanayo",
    ],
    explanation:
      "Madd macneheedu waa ku fidinta codka shaqalka xarfaha waalan - alif (ا), waw (و), iyo ya (ي) - tiro go'an oo tirinta ah.",
  },
  {
    prompt:
      "Qalqalah waa iftiinka soo noqnoqda 'boodboodka' ee la siiyo xarfaha xarfaha marka ay qaadaan sukun?",
    options: ["ي ر م ل و ن", "ق ط ب ج د", "ء ه ع ح غ خ", "ا و ي"],
    explanation:
      "Shanta xaraf ee qalqalah waxa lagu soo ururiyey weedha قُطْبُ جَدٍ — ق ط ب ج د — dib u celin nadiif ah ayaa loo sameeyaa marka ay sukun sitaan.",
  },
  {
    prompt: "Erayga Qur'aanka ee soo noqnoqda ee 'Rabb' (رَبّ) macnihiisu waa:",
    options: ["Naxariista", "Rabbi, Master, Suge", "Buug", "Beerta"],
    explanation:
      "'Rabb' macneheedu waa Rabbi, sayid, iyo ilaaliyaha - kan wax abuura, leh, koriya, oo xukuma. 'Rabbana' macnaheedu waa 'Rabbigeenna'.",
  },
  {
    prompt: "Erayga 'Jannah' (جَنَّة) waxaa loola jeedaa:",
    options: ["Dabka", "Beerta Jannada", "Ducada", "Soonka"],
    explanation:
      "'Jannah' macneheedu waa Beer - hoyga abaalgudka ah, 'beero ay wabiyadu ku hoos socdaan'.",
  },
  {
    prompt: "Kee baa nabigii kacbada Makka ku dhisay isaga iyo wiilkiisa Ismaaciil?",
    options: ["Nuux", "Muuse", "Ibraahim", "Yuusuf"],
    explanation:
      "Ibraahiim (Khalilullah, saaxiibkii Eebbe) iyo Ismaaciil waxay dhiseen Kacbada, iyagoo ku baryaya ‘Eebow, tan naga aqbal’ (2:127).",
  },
  {
    prompt:
      "Nebigee si toos ah Eebbe ula hadlay, Fircoonna ka horyimid, oo banii Israa’iil ku hoggaamiyey baddii kala qaybsantay?",
    options: ["Isa", "Muuse", "Aadam", "Yuunus"],
    explanation:
      "Muuse (Kalimullah) Eebbe buu la hadlay, Fircoon baa loo soo diray, amarka Eebbena baddii baa kala go’day, markaasay qoomkiisii ​​si nabad ah u gudbeen.",
  },
  {
    prompt:
      "Suuraddee ama tuduc gaaban oo aad dajin doontaa si aad u fahanto oo aad xifdiso marka xigta, in shaa Allaahu?",
    explanation:
      "Tallaabooyinka yaryar ee joogtada ah waxay dhisaan xidhidh nolosha oo dhan ah Kitaabka Alle. Dooro qaybtaada, baro macnaheeda, oo marar badan dib u eeg.",
  },
];
