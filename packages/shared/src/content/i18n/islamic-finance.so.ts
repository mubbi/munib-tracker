import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// so overlay for islamic-finance. Index-aligned with ISLAMIC_FINANCE_TOPICS in ../islamic-finance.ts.
export const ISLAMIC_FINANCE_TOPICS_SO: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Waa Maxay Dhaqaalaha Islaamiga ah?",
    summary:
      "Aragti akhlaaqeed oo lacagta lagu eego, ee ma aha nooc alaab gaar ah — hagahani waa waxbarasho oo keliya.",
    body: [
      "Dhaqaalaha Islaamiga ah ma aha summad alaab maalgashi ah; waa ku-dabakhidda akhlaaqda Islaamka sida lacagta loo kasbado, loo amaahiyo, loo kharash gareeyo, loona bixiyo. Udub-dhexaadkiisa waxaa ku jira dhowr mabaadi': hantidu waa amaano Alle ka timid ee ma aha hadaf naftiisa ah, macaamilooyinku waa inay ka maran yihiin dhiig-miirad iyo hubanti la'aan xad-dhaaf ah, faa'iidaduna waa inay ku xirnaataa hawl dhaqaale oo dhab ah iyo khatar la wadaago, ee ma aha lacag dammaanad ah oo amaah lagu dul saaro.",
      "Hagahani wuxuu mabaadi'daas ku soo bandhigayaa heer guud oo waxbarasho ah: xaaraannimada ribada (dulsaar/ribo), caddaaladda ganacsiga, waajibaadka sakada iyo sadaqada ikhtiyaariga ah, iyo fikradda aasaasiga ah ee takaafulka (caymis iskaashi ah). Si ula kac ah uma baaro sanduuqyada maalgashiga, uma liis gareeyo saamiyada ama ETF-yada, mana ku taliyo alaab ama bixiye gaar ah.",
      "Alaabta maaliyadeed ee casriga ah (deymaha guriyaha, kaararka deynta, siyaasadaha caymiska, xisaabaadka hawlgabka iyo kuwo kale) siyaabo badan oo kala duwan ayaa loo dhisaa, xukunnadooduna waxay ku xirnaan karaan shuruudaha saxda ah ee heshiiska iyo dalka aad ku nooshahay. Hagahani wuxuu ku siinayaa mabaadi'da aasaasiga ah; xukun ku saabsan xaaladdaada gaarka ah, la hadal caalim ama hay'ad dhaqaale Islaami ah oo u qalma oo shahaado leh.",
    ],
    disclaimer:
      "Waxbarasho oo keliya — ma aha talo maaliyadeed mana aha fatwo. Kuma taliyo, ma baaro, mana qiimeeyo sanduuq, saami, bixiye ama alaab maaliyadeed oo gaar ah.",
  },
  {
    title: "Hantida oo Amaano ah (Amaanah)",
    summary:
      "Wax kasta oo aad leedahay ugu dambayn waa kuwa Alle — adigu waad ilaalisaa, ma aha milkiilaha kama dambaysta ah.",
    body: [
      "Mawduuc Qur'aanka ku soo noqnoqda ayaa ah in hantidu marka hore Alle leeyahay; qofku waa uun ilaaliyeheeda (amaanah) muddo, wuxuuna ka xisaabtamayaa sida loo kasbaday iyo sida loo isticmaalay. Tani lacagta waxay ka beddeshaa hanti shakhsi ah oo keliya oo ka dhigtaa wax lagu weydiin doono — meesha ay ka timid iyo meesha ay u dhaqaaqday.",
      "Laba amar ayaa aasaas u ah sida amaanadaasi uga muuqato macaamilka dadka kale: in heshiisyada iyo ballamaha si buuxda loo oofiyo, iyo in aan weligeed hantida qof kale lagu qaadan dulmi, khiyaano ama dhiig-miirad, balse oo keliya ganacsi caddaalad ah oo is-oggolaansho lagu sameeyay.",
      "Marka la isu geeyo, mabaadi'dan ayaa sabab u ah in akhlaaqda dhaqaalaha Islaamku ay had iyo jeer ku noqoto dhowr su'aalood oo isku mid ah: faa'iidadan ma waxaa lagu kasbaday dadaal dhab ah, khatar iyo abuurid qiime? Qofka kale si daacadnimo buuxda leh ma loola dhaqmay? Waajib kasta oo aan galay ma la oofinayaa?",
    ],
  },
  {
    title: "Xaaraannimada Ribada",
    summary:
      "Ribada (dulsaarka/ribo) waa mid ka mid ah macaamilooyinka sida ugu adag loogu cambaareeyay Qur'aanka.",
    body: [
      "Ribada — oo inta badan loo tarjumo dulsaar ama ribo, si guud waa koror kasta oo horay loo go'aamiyay oo dammaanad ah oo amaah lagu dul saaro — waxaa lagu xaaraameeyay erayo aad u adag shan aayadood oo isku xiga oo Suuratul Baqara ah (2:275–279), oo ka mid ah digniinaha ugu daran ee Qur'aanka ku jira mawduuc keliya.",
      "Qaybtani waxay si ula kac ah u dhigtaa isbarbardhig: 'Allaah wuu xalaaleeyey beecshurada oo xaaraameeyey Ribada' (2:275). Ganacsiga — iibsiga, iibinta iyo maalgashiga ay labada dhinacba wadaagaan khatar iyo dadaal dhab ah — waa la ammaanay; ribada, oo ah lacag go'an oo la bixinayo natiijadu si kastaba ha ahaatee, waa la cambaareeyay. Suuraddu waxay intaas kadib mu'miniinta ku amraysaa inay gebi ahaanba ka tagaan ribo kasta oo weli lagu leeyahay, iyadoo uga digaysa cawaaqib culus kuwa ku adkaysta, isla markaana u ballanqaadaysa in qofkii toobad keenaa uu qaadan karo raasumaalkiisii asalka ahaa oo keliya — wax ka badan iyo wax ka yar midna ma aha.",
      "Tani waa waxbarid aasaasi ah oo la ogaado, ee ma aha liis aad adigu ku hubiso alaab kasta oo maaliyadeed oo casri ah. Go'aaminta in heshiis gaar ah (deyn guri, amaah, xisaab kayd) uu ribo ku jiro iyo in kale waxay u baahan tahay in shuruudihiisa dhabta ah lala eego qof ku takhasusay dhaqaalaha Islaamiga ah.",
    ],
  },
  {
    title: "Sababta Ganacsigu uga Duwan Yahay Dulsaarka",
    summary:
      "Faa'iidada sharciga ah waxay ku xiran tahay khatar iyo dadaal; ribaduna waa lacag dammaanad ah natiijadu si kastaba ha ahaatee.",
    body: [
      "Hab fudud oo kala duwanaanshaha loo xasuusto: ganacsiga ama maalgashiga dhabta ah, qofka bixiya raasumaalka ama alaabtu wuxuu wadaagaa natiijada — wuu faa'iidi karaa, balse sidoo kale wuu khasaari karaa, maxaa yeelay wuxuu u bandhigan yahay waxqabadka dhabta ah ee mashruuca. Amaahda ribada ku salaysan, amaah-bixiyuhu wuxuu dammaanad ku haystaa soo-celin go'an iyadoon loo eegin in mashruuca amaah-qaataha uu guulaysto, uu dhib la kulmo, ama uu fashilmo.",
      "Culimadii hore waxay tan u arkeen arrin caddaalad: qof baahi degdeg ah qaba oo lacag amaahda waxaa laga yaabaa in lagu xiro inuu dib u bixiyo wax aad uga badan intii uu amaahday, iyadoo khatarta oo dhan isaga la saaray, amaah-bixiyahana waxba la saarin — taasi waa isku-dheelitir la'aanta Qur'aanku ku cambaareeyay weedhda 'Allaah ma barakeeyo Ribo, oo sababaa Sadaqooyinka inay bataan' (2:276), oo ah isbarbardhig toos ah oo u dhexeeya hanti lagu dhisay dhiig-miirad iyo hanti ku korta deeqsinimo.",
      "Tani waa isbarbardhig waxbarasho oo guud, ee ma aha xukun ku saabsan qalab gaar ah (qaabab casri ah qaarkood waxay si qalafsan isugu qasaan ganacsi iyo amaah). Halka alaab gaar ahi ka taagan tahay xariijintan waa nooca su'aasha ah ee loo keeno caalim dhaqaalaha Islaamiga ah u qalma ama la-taliye shahaado leh, intii laga go'aamin lahaa mabaadi' guud oo keliya.",
    ],
  },
  {
    title: "Sida Sunnadu u Adkaysay Arrinta Ribada",
    summary:
      "Nabigu ﷺ wuxuu ka digay in qof kasta oo ku lug leh macaamil ribo ah uu wadaago dembigeeda.",
    body: [
      "Digniinaha Qur'aanka laftiisa ka sokow, Nabigu ﷺ wuxuu caddeeyay in mas'uuliyadda ribadu aanay ku koobnayn qofka si toos ah u qaada. Xadiis saxiix ah, waxaa laga weriyay inuu ﷺ habaaray qofka cuna ribada, kan bixiya, kan qora heshiiska, iyo labada markhaati ee ku jira — isagoo yiri dhammaantood way isku mid yihiin arrintan.",
      "Casharka inta badan laga soo qaato waa ka fogaansho wadajir ah, ee ma aha eedaynta qof keliya: ribada waxaa loola dhaqmaa sidii wax ay tahay in macaamilka oo dhan, iyo qof kasta oo ogaal u leh ka qayb galkiisa, uu ka fogaado — ma aha oo keliya arrin gaar ah oo u dhexeysa amaah-bixiyaha iyo amaah-qaataha.",
      "Sida aayadaha Qur'aanka, xadiiskani wuxuu xaqiijinayaa culayska mabda'a; laftiisu kuuma sheegayo sida loo kala saaro alaab maaliyadeed oo casri ah oo gaar ah. Go'aankaas waxaa iska leh culimo u qalma oo dib u eegaya heshiiska dhabta ah.",
    ],
  },
  {
    title: "Daacadnimada Ganacsiga",
    summary:
      "Ganacsadaha daacadda ah ee aaminka ah waxaa la siiyaa mid ka mid ah darajooyinka ugu sarreeya Aakhiro.",
    body: [
      "Si ka duwan digniinaha ribada, ganacsiga daacadda ah si joogto ah ayaa loo ammaanaa. Nabi Muxammad ﷺ laftiisu wuxuu ganacsade ahaa ka hor nabinimadiisa, waxaana Makkah lagu yaqaannay naanaysta al-Amiin — 'Aaminka' — daacadnimadiisa macaamilka ganacsiga awgeed, muddo dheer ka hor intaan loo aqoon nabi ahaan.",
      "Wuxuu ﷺ markii dambe baray in 'the truthful, trustworthy merchant will be with the prophets, the truthful, and the martyrs' (macnaha Ingiriisiga) Maalinta Qiyaamaha — darajo aad u sarraysa oo lagu xiray wax caadi ah sida caddaaladda macaamilka suuqa.",
      "Ficil ahaan, ganacsiga caddaaladda ahi waxa uu ka dhigan yahay: in alaabta iyo adeegyada si sax ah loo sharxo, in ceebaha la yaqaan la sheego intii la qarin lahaa, in qiimayaasha iyo shuruudaha lagu heshiiyay la oofiyo, iyo in laga fogaado khiyaano, xayaysiis been ah, ama ka faa'iidaysiga aqoon la'aanta iibsadaha ama iibiyaha. Kuwani waa isla dareennada ka dhiga ganacsi wanaagsan oo waara dhaqan kasta — Islaamku si fudud ayuu iyaga ugu xiraa ajar weligeed ah.",
    ],
  },
  {
    title: "Maaraynta Alaabta Maaliyadeed ee Casriga ah",
    summary:
      "Deymaha guriyaha, kaararka iyo caymisku runtii waa qalafsan yihiin — hagahani wuxuu ku joogsadaa mabaadi'da.",
    body: [
      "Nolosha maaliyadeed ee casriga ahi waxay ka kooban tahay alaab aanay jiilashii ugu horreeyay ee Muslimiintu weligood la kulmin qaabkooda hadda: deymaha guriyaha, kaararka deynta, xisaabaadka hawlgabka, caymiska, iyo sanduuqyada maalgashiga oo siyaabo badan oo kala duwan loo dhisay. Ku-dabakhidda mabaadi' qarniyo jiray alaabtan waa shaqo cilmiyeed oo dhab ah oo taxaddar leh — ma aha wax qofku keligii ka soo saari karo dhowr aayadood oo guud.",
      "Sababtaas awgeed, hay'adaha dhaqaalaha Islaamiga ah ee casriga ah iyo culimada shahaadada lihi waxay si gaar ah ugu takhasuseen dib-u-eegista heshiisyada casriga ah si loo hubiyo inay mabaadi'dan waafaqsan yihiin, iyagoo inta badan soo saara xukunno faahfaahsan oo ku saabsan alaab ama qaabab gaar ah. Dib-u-eegistaas takhasuska ahi waxay ka baxsan tahay xadka app-kan.",
      "Haddii aad ka fiirsanayso go'aan maaliyadeed oo dhab ah — iibsashada guri, amaah, maalgashi, siyaasad caymis — tallaabada xigta ee mas'uulka ahi waa inaad la tashato la-taliye ama caalim dhaqaalaha Islaamiga ah oo u qalma oo shahaado leh, kaas oo eegi kara shuruudaha dhabta ah ee heshiiska, ee ma aha inaad ku tiirsanaato waxbarasho guud sida hagahan.",
    ],
    disclaimer:
      "App-kani ma qiimeeyo, ma baaro, kumana taliyo alaab maaliyadeed, sanduuq ama bixiye gaar ah, hagahanna ma aha beddelka talo xirfadeed ama cilmiyeed oo u qalanta oo ku saabsan maaliyaddaada dhabta ah.",
  },
  {
    title: "Sakada: Cibaado Hanti Lagu Fuliyo",
    summary: "Sakadu waa cibaado waajib ah oo lagu fuliyo lacag, ee ma aha hadal ama dhaqdhaqaaq.",
    body: [
      "Sakada — oo ah waajib sannadle ah oo go'an oo laga bixiyo hantida u qalanta ee ka badan xadka ugu yar (nisaab) — waa mid ka mid ah shanta tiir ee Islaamka, taas oo bixinta la dhigta heerka salaadda iyo soonka, intii loo arki lahaa deeqsinimo ikhtiyaari ah.",
      "Qur'aanku si joogto ah ayuu sakada ula lammaaneeyaa salaadda sidii calaamad iimaan dhab ah, wuxuuna u ballanqaadayaa kuwa oogay salaadda iyo sakadaba in 'waxay ka heli doonaan abaalgudkooda Rabbigood agti. Cabsi ma qabi doonaan, mana murugoon doonaan.' Dhaqaale ahaan, waxay u shaqaysaa qalab hantida lagu daahiriyo — iyadoo qayb yar oo joogto ah oo hantida la ururiyay loo qaybiyo dadka baahan, intii ay gacmo yar ku jiri lahayd iyadoo aan la isticmaalin weligeed.",
      "Maadaama xisaabtu ku xiran tahay kaydkaaga gaarka ah, hantidaada iyo qiimaha nisaabka deegaankaaga, app-kani wuxuu leeyahay hage Sako iyo xisaabiye gaar ah — si toos ah u isticmaal intii aad ka qiyaasi lahayd mabaadi'da guud ee halkan ku jira.",
    ],
    appLinks: [{ label: "Hagaha iyo xisaabiyaha Sakada" }],
  },
  {
    title: "Sadaqada: Bixinta Ikhtiyaariga ah",
    summary:
      "Sakada waajibka ah ka sokow, bixin kasta oo ikhtiyaari ah waxaa la yiraahdaa sadaqo — runtiina waxba kaama dhimayso.",
    body: [
      "Sadaqadu waa deeq ikhtiyaari ah, qaddar kasta iyo waqti kasta, oo Alle dartiis loo bixiyo — oo ka baxsan waajibka go'an ee sakada. Waxay u dhexeysaa hadiyado maaliyadeed oo waaweyn ilaa wax yar sida erey naxariis leh ama in waddada qof laga qaado wax dhibaya, dhammaantoodna suugaanta xadiiska waxaa loogu tiriyaa noocyo sadaqo ah.",
      "Mid ka mid ah waxbarista ugu qalbi-qaboojinta badan ee qof kasta oo ka labalabeeya bixinta waa hadalka Nabiga ﷺ ee ah in sadaqadu aanay hantida dhimin — qodob uu Qur'aanku meelo kale ku taageero isagoo ku sifeeya kharashka jidka Alle wax Alle beddelo oo abaalmariyo, ee ma aha oo keliya wax dhammaada.",
      "Ficil ahaan, tani deeqsinimada waxay u beddeshaa: bixintu kama horjeedo amnigaaga maaliyadeed, balse waxaa loo soo bandhigaa inay ilaaliso oo kordhiso, siyaabo aan had iyo jeer ka muuqan xisaabaadka.",
    ],
    appLinks: [{ label: "Hagaha Sakada & sadaqada" }, { label: "Hadafyada sadaqada" }],
  },
  {
    title: "Takaafulka: Wadaagidda Khatarta oo Iskaashi ah",
    summary:
      "Jaleeco heer sare ah oo ku saabsan fikradda ka dambeysa beddelaadda Islaamiga ah ee caymiska caadiga ah.",
    body: [
      "Takaafulka (oo ka yimid xidid Carabi ah oo macnihiisu yahay is-dammaanad) waa fikradda guud ee ka dambeysa hababka Islaamiga ah ee ilaalinta u eg caymiska: koox ka qaybgalayaal ah ayaa ku shubta sanduuq la wadaago, sanduuqaasna waxaa loo isticmaalaa in lagu caawiyo xubnaha la kulma khasaare la daboolay, iyadoo wixii ka hara inta badan loo qaybiyo ka qaybgalayaasha ama loo wareejiyo sannadka xiga, intii loo hayn lahaa faa'iido dammaanad ah oo caymis-bixiye gaar ah.",
      "Fikradda salka u ah waa wadaagidda khatarta oo iskaashi ah, ee ma aha u-wareejinta khatarta lacag dammaanad ah: ka qaybgalayaasha waxaa loo arkaa inay is caawinayaan, iyadoo maamulaha sanduuqu inta badan u shaqeeyo maareeye ama wakiil khidmad qaata, ee ma aha dhinaca khatarta qaada laftiisa.",
      "Tani waa sharraxaad guud oo fikradeed oo keliya. Alaabta takaafulka ee dhabta ahi aad bay ugu kala duwan yihiin qaab-dhismeed ahaan bixiyeyaasha iyo dalalka dhexdooda, qiimaynta in qorshe gaar ahi runtii sidan loo dhisay waxay u baahan tahay in shuruudihiisa dhabta ah lala eego caalim ama hay'ad dhaqaale Islaami ah oo u qalma — app-kani kuma taliyo, mana qiimeeyo bixiye ama qorshe takaaful (ama caymis) oo gaar ah.",
    ],
    disclaimer:
      "Waxbarasho guud oo keliya. Tani ma aha talo ah in takaafulka laga doorbido caymiska caadiga ah, ama bixiye ama qorshe gaar ah — la tasho la-taliye u qalma oo ku saabsan xaaladahaaga.",
  },
  {
    title: "Takaafulka iyo Caymiska Caadiga ah, oo Heer Sare lagu Isbarbardhigay",
    summary:
      "Labadoodu waxay wadaagaan ujeedo — maaraynta khatarta — balse way ku kala duwan yihiin sida khatartaas loo qaabeeyo.",
    body: [
      "Caymiska caadiga ah inta badan waxaa loo qaabeeyaa heshiis uu haystaha siyaasaddu bixiyo lacag (premium), caymis-bixiyuhuna, isagoo ah dhinac ganacsi oo gooni ah, qaado khatarta beddelka khidmaddaas, isagoo inta badan lacagaha la ururiyay ku maalgeliya siyaabo ay ku jiri karaan qalab dulsaar leh. Culimo qaar oo hore waxay walaac ka muujiyeen in qaab-dhismeedkani taabanayo ribada, gharar (hubanti la'aan xad-dhaaf ah oo ku saabsan lacag-bixinta), iyo u-wareejinta khatarta khidmad go'an, intii khatar la wadaagi lahaa.",
      "Takaafulka waxaa, si guud, loo sameeyay isku day lagu wajahayo walaacyadaas gaarka ah iyadoo la adeegsanayo qaab-dhismeed is-caawin iyo iskaashi ah — inkastoo culimada iyo hay'aduhu ku kala duwan yihiin qaababka si buuxda hadafkaas u gaara, bixiyeyaasha takaafulka laftoodana aad bay ugu kala duwan yihiin naqshadda.",
      "Maadaama walaacyada iyo qaab-dhismeedyada beddelka ahiba ay ku jiraan faahfaahin farsamo oo dhab ah (iyo maadaama xaaladaha shakhsiga ah sida goobta, baahiyaha daboolka iyo bixiyeyaasha la heli karo ay aad u kala duwan yihiin), isbarbardhiggan waxaa loo bixiyaa oo keliya asal guud — ma aha xukun ku saabsan siyaasad gaar ah oo aad ka fiirsanayso.",
    ],
    disclaimer:
      "Isbarbardhig waxbarasho oo keliya, ma aha fatwo ku saabsan caymiska ama takaafulka guud ahaan ama alaab gaar ah. Culimadu waxay ka qabaan aragtiyo kala duwan qaab-dhismeedyada caymiska casriga ah; la tasho la-taliye u qalma oo ku saabsan xaaladdaada.",
  },
  {
    title: "Su'aalo iyo Jawaabo: Kani Ma Talo Maaliyadeed Baa?",
    summary: "Maya — hagahani wuxuu baraa mabaadi' oo keliya, mana beddeli karo talo u qalanta.",
    body: [
      "S: Ma u isticmaali karaa hagahan inaan ku go'aamiyo in amaah, maalgashi ama alaab caymis oo gaar ahi ii bannaan tahay? J: Maya. Hagahani wuxuu sharxayaa mabaadi' Islaami ah oo guud oo ku saabsan lacagta — dib uma eego heshiisyada, kuma taliyo alaab, mana soo saaro xukunno. Go'aannada maaliyadeed ee gaarka ah waa in lagu gaaro iyadoo lala tashanayo xirfadle maaliyadeed oo u qalma, su'aalaha bannaanaanshahana, caalim dhaqaalaha Islaamiga ah oo u qalma.",
      "S: App-kani ma qiimeeyaa ama ma liis gareeyaa saamiyo, sanduuqyo ama ETF-yo xalaal ah? J: Maya, weligiisna sameyn maayo isagoo qayb ka ah hagahan — baaritaanka sanduuqyada iyo talooyinka maalgashigu waxay ka baxsan yihiin xadkiisa, waxayna u baahan yihiin khibrad maaliyadeed oo shati leh oo aan waxbarashadan bixin.",
      "S: Hagahani ma fatwo baa? J: Maya. Fatwadu waa xukun diimeed oo gaar ah oo caalim u qalma ku bixiyo jawaab su'aal iyo xaalad gaar ah. Hagahani wuxuu baraa mabaadi' guud oo keliya; xukun dhab ah oo ku saabsan xaaladdaada, si toos ah u raadso caalim u qalma oo la isku halleyn karo.",
    ],
    disclaimer:
      "Hagahan oo dhammi waa waxbarasho, ma aha talo maaliyadeed mana aha fatwo. Had iyo jeer la tasho xirfadlayaal maaliyadeed iyo diimeed oo u qalma go'aannada ku saabsan lacagtaada.",
  },
  {
    title: "Su'aalo iyo Jawaabo: Sideen u Helaa Doorashooyin Shareecada Waafaqsan?",
    summary:
      "Raadi khibrad shahaado leh, ee ha raadin liis — app-kani si ula kac ah uma bixiyo mid.",
    body: [
      "S: Halkee ka heli karaa liiska bangiyada, sanduuqyada ama madalaha maalgashiga ee xalaasha ah? J: App-kan kuma jiro, si ula kac ah — liisaska alaabtu si joogto ah ayay isu beddelaan, aad bay ugu kala duwan yihiin dal ilaa dal, waxayna u baahan yihiin la-socod joogto ah oo waafaqsanaan ah oo ay si sax ah u ilaalin karaan oo keliya hay'ado takhasus leh. Taa beddelkeed, raadi hay'ado leh guddi kormeer Shareeco oo dhab ah oo magacyadoodu caddahay iyo hab-raac waafaqsanaan oo la daabacay.",
      "S: Sideen ku ogaadaa in caalim ama shahaado sharci tahay? J: Raadi culimo ama guddiyo ay aqoonsan yihiin hay'adaha dejiya heerarka dhaqaalaha Islaamiga ah ee la aasaasay ee gobolkaaga ama caalamka, intii aad ku kalsoonaan lahayd sheegashooyin aan rasmi ahayn oo internetka ku jira. Hay'ad sumcad leh ayaa daah-furnaan ka muujinaysa cidda dib u eegta alaabteeda iyo sida ay u eegto.",
      "S: Maxaan sameeyaa haddii aanan meesha aan ku noolahay ka helin wax doorasho dhaqaale Islaami ah? J: Tani waa xaalad dhab ah oo caadi ah. Kala hadal imaam ama caalim deegaanka ah oo aqoon leh — wuxuu kaa caawin karaa inaad miisaamato doorashooyinka la heli karo ee xaaladahaaga gaarka ah, maadaama hanuunka halkan uu aad ugu xirnaan karo beddelaadka runtii kuu jira.",
    ],
    actions: [
      "Raadi hay'ado leh guddi kormeer Shareeco oo magacyadoodu caddahay oo daah-furan, intii aad ku tiirsanaan lahayd sheegashooyinka xayaysiiska.",
    ],
  },
  {
    title: "Su'aalo iyo Jawaabo: Deymaha Guriyaha, Kaararka iyo Amaahyada",
    summary: "Kuwani waa su'aalaha saxda ah ee u baahan caalim u qalma, ee ma aha hage guud.",
    body: [
      "S: Deynta guriyuhu had iyo jeer ma ribo baa? J: Qaab-dhismeedyadu way kala duwan yihiin — deymaha guriyaha caadiga ah qaarkood waa amaah dulsaar ku salaysan, halka bixiyeyaal qaar ay bixiyaan qaab-dhismeedyo beddel ah (sida shuraako yaraanaysa ama kiro-ilaa-lahaansho) oo loogu talagalay in dulsaarka laga fogaado. In alaab gaar ahi ficil ahaan taas gaarto iyo in kale waa su'aal cilmiyeed oo ku saabsan heshiiskeeda dhabta ah, ee ma aha wax si kasta loo qiyaaso.",
      "S: Ma isticmaali karaa kaarka deynta haddii aan had iyo jeer bixiyo haraaga oo dhan oo aanan weligay dulsaar galin? J: Culimadu aragtiyo kala duwan ayay arrintan ka qabaan, qayb ahaan maxaa yeelay heshiiska salka ah wuxuu weli farsamo ahaan ku jiri karaa qodob dulsaar ah xitaa haddii aadan ficil ahaan weligaa kicin. Tani waa meel dhab ah oo ay ku kala duwan yihiin aragtiyaha culimada u qalma — weydii caalim aad aaminto intii aad u qaadan lahayd hal jawaab oo guud.",
      "S: Ka warran amaahda waxbarashada ama amaahyo kale oo xaaladaha qaarkood laga maarmi waayo? J: Baahida daruuriga ah iyo dhibaatadu waa tixgelinno dhab ah oo culimadu si taxaddar leh u miisaamaan, aragtiyuhuna way ku kala duwan yihiin xaaladda iyo dalka. Haddii aad go'aankan wajahayso, xaaladdaada gaarka ah u keen caalim u qalma intii aad isku dayi lahayd inaad ku xalliso akhris guud oo keliya.",
    ],
    disclaimer:
      "Kuwani runtii waa su'aalo lagu kala duwan yahay oo ku xiran heshiis gaar ah. Su'aalahan iyo jawaabahan waxay kuu muujinayaan oo keliya nooca su'aal kasta tahay — midkoodna kaagama jawaabayaan xaaladdaada.",
  },
];
