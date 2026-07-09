// Albanian translation overlay for the Learn Hajj & Umrah guide. Mirrors the order of
// its English source in ../hajj-guide.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { HajjGuideSection } from "../../types/hajj-guide";
import type { DeepPartial } from "./localize";

export const HAJJ_GUIDE_SECTIONS_SQ: DeepPartial<HajjGuideSection>[] = [
  {
    day: "Para se të shkoni",
    title: "Detyrimi dhe kushtet",
    summary: "Pse duhet Haxhi dhe kujt i bëhet obligim.",
    steps: [
      {
        title: "Shtylla e pestë",
        body: 'Haxhi është shtylla e pestë e Islamit, obligim një herë në jetë për çdo musliman të aftë. Allahu thotë: "Dhe nga njerëzit [i takon] Allahut një haxhi në Shtëpinë e atij që mund të gjejë rrugën për në të" (Kur\'an 3:97). Të gjithë njerëzve u është shpallur: "Dhe shpallni njerëzve haxhin, ata do të vijnë tek ju në këmbë dhe me çdo deve të dobët" (Kur\'an 22:27).',
      },
      {
        title: "Aftësia (istita'ah)",
        body: "Haxhi është i detyrueshëm vetëm për ata që janë në gjendje: shëndeti fizik për udhëtim, pasuria e mjaftueshme e ligjshme për të mbuluar udhëtimin dhe personat në ngarkim kur janë larg, dhe një rrugë e sigurt dhe e hapur. Kujt i mungojnë mjetet këtë vit, nuk është mëkatar që vonon derisa të jetë në gjendje.",
      },
      {
        title: "Udhëtimi i një gruaje",
        body: "Shumica e dijetarëve mendojnë se një grua udhëton për haxh me një mahrem (burrin ose të afërmin e ngushtë të pamartuar); disa studiues të mëvonshëm lejojnë udhëtimin brenda një grupi grash të sigurta dhe të besueshme. Ndiqni vendimin e një dijetari të kualifikuar të cilit i besoni dhe rregulloret e autoritetit tuaj të haxhit.",
      },
    ],
  },
  {
    day: "Para se të shkoni",
    title: "Tri llojet e haxhit",
    summary: "Ifrad, Qiran dhe Temattu' - zgjidhni para se të hyni në ihram.",
    steps: [
      {
        title: "Ifrad",
        body: "Haxhiu hyn në ihram vetëm për haxh, nuk kryen umre të veçantë dhe nuk ofron kurban për llogari të tij. Ai qëndron në ihram deri në ritet e Ditës së Nahrit.",
      },
      {
        title: "Qiran",
        body: "Haxhiu bashkon Umren dhe Haxhin në një ihram të vetëm, duke kryer ritet e Umres dhe duke qëndruar në ihram derisa të përfundojë Haxhi. Ashtu si Tamattu', ajo kërkon një sakrificë (hady).",
      },
      {
        title: "Tamattu'",
        body: "Haxhiu kryen një Umre të plotë në muajt e Haxhit, del nga ihrami, pastaj hyn sërish në ihram për haxh në 8 Dhul-Hixhe. Kjo është ajo që bëjnë shumica e pelegrinëve; ajo kërkon një kurban, ose agjërim tre ditë në haxh dhe shtatë në kthim, nëse dikush nuk mund ta përballojë atë (Kur'an 2:196).",
      },
    ],
  },
  {
    day: "Para se të shkoni",
    title: "Mikatët dhe Ihrami",
    summary: "Ku fillon gjendja e shenjtë dhe çfarë ndalon.",
    steps: [
      {
        title: "Pesë mevaqit",
        body: "Profeti ﷺ caktoi pesë mikate - pika kufitare që nuk duhet të kalohen pa ihram: Dhul-Hulejfe (për Medine), El-Xhuhfe (për Sirinë/Egjiptin), Karn el-Menazil (për Nexhdin), Jelamlam (për Jemenin) dhe Dhat 'Irq (për Irakun). Ata që janë brenda hyjnë në ihram nga ku janë.",
        location: "Miqat",
      },
      {
        title: "Çfarë është ihrami",
        body: "Ihrami është gjendja e shenjtë në të cilën hyn nijeti dhe telbijah. Burrat veshin dy çarçafë të bardhë të paqepur; gratë mbajnë veshjen e zakonshme modeste. Hyhet pas guslit dhe, për meshkujt, vendosja e parfumit në trup (jo veshje) paraprakisht.",
        location: "Miqat",
      },
      {
        title: "Ndalimet e ihramit",
        body: "Kur jeni në ihram shmangni: rrobat e qepura/të veshura dhe mbulimin e kokës (për meshkujt), parfumin, prerjen e flokëve apo thonjve, gjuetinë, lidhjen apo kryerjen e martesës dhe çdo intimitet. Thyerja e këtyre mund të kërkojë një shlyerje (fidje), prandaj mbajini ato me kujdes.",
        location: "Miqat",
      },
    ],
  },
  {
    title: "Umre",
    summary: "Pelegrinazhi më i vogël - mund të kryhet në çdo kohë të vitit.",
    steps: [
      {
        title: "Fut ihram",
        body: "Në mikat ose para tij, bëni gusl, vishni rrobat e ihramit, bëni nijetin për umren dhe filloni telbijen. Qëllimi bëhet në zemër dhe gjendja e shenjtë fillon nga ai moment.",
        location: "Miqat",
      },
      {
        title: "Lexoni telbijen",
        body: 'Përsëriteni "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk..." shpesh ndërsa udhëtoni drejt Mekës - një deklaratë që ju i përgjigjeni thirrjes së Allahut vetëm - duke vazhduar derisa të filloni tavafin.',
      },
      {
        title: "Tavafi i Qabes",
        body: "Rretho Qaben shtatë herë në drejtim të kundërt të akrepave të orës, duke filluar dhe duke përfunduar në cepin e Gurit të Zi, ku e puthni, e prekni ose thjesht tregoni me tekbir. Burrat bëjnë raml (një ritëm të shpejtë) në tre qarqet e para dhe idtiba' (zhveshje të shpatullës së djathtë). Ndërmjet këndit të Jemenit dhe Gurit të Zi lexoni: \"Zoti ynë, na jep të mira në këtë botë dhe të mira në botën tjetër dhe na ruaj nga dënimi i zjarrit\" (Kur'an 2:201).",
        location: "Mesxhid el-Haram",
      },
      {
        title: "Falni dy rekate",
        body: "Pas tavafit, falni dy rekate pas Mekamit Ibrahim nëse është e mundur (ose kudo në xhami nëse është e mbushur me njerëz), pastaj pini ujë Zemzem lirshëm, sepse Profeti a.s. ka thënë Zemzemi është për çdo gjë që pihet.",
        location: "Mesxhid el-Haram",
      },
      {
        title: "Sa'i ndërmjet Safas dhe Merves",
        body: "Ecni shtatë herë ndërmjet Safa-s dhe Mervesë, duke filluar nga Safa, në kujtim të kërkimit të ujit nga Haxherja për djalin e saj Ismail. Allahu thotë: “Në të vërtetë, es-Safa dhe el-Merwah janë prej simboleve të Allahut” (Kur'an 2:158). Në Safa, përballuni me Qaben dhe ngrini duart në dua dhe tekbir; burrat vrapojnë midis shënuesve të gjelbër.",
        location: "Mesxhid el-Haram",
      },
      {
        title: "Halk ose teksir",
        body: "Burrat rruajnë kokën (halk, aq më i shpërblyer) ose e shkurtojnë atë në mënyrë të barabartë (taksir); gratë mbledhin flokët dhe shkurtojnë gjatësinë e një gishti. Me këtë plotësohet umreja dhe hiqen kufizimet e ihramit.",
      },
    ],
  },
  {
    day: "8 Dhul-Hixhe",
    title: "Dita e Tarwijeh - Mina",
    summary: "Fillon pelegrinazhi; dita kalon në Mina.",
    steps: [
      {
        title: "Fut ihram për haxh",
        body: "Bëje nijetin për haxh dhe rihyre në ihram (nga vendbanimi yt në Mekë për temattu'), duke e ripërtërirë telbijen. Kjo fillon përsëri gjendjen e shenjtë, kështu që ndalesat e ihramit zbatohen edhe një herë.",
      },
      {
        title: "Udhëtoni për në Mina",
        body: "Shkoni në Mina dhe falni namazin e Dhuhrit, ikindisë, akshamit, jacisë dhe sabahut tjetër, secili i shkurtuar në dy rekate në kohën e vet, duke ndjekur Sunetin e Profetit ﷺ. Kaloni ditën dhe natën në adhurim, duke pritur qëndrimin në Arafah.",
        location: "Mina",
      },
    ],
  },
  {
    day: "9 Dhul-Hixhe",
    title: "Dita e Arafatit",
    summary: "Dita më e madhe e Haxhit - qëndrimi në Arafah.",
    steps: [
      {
        title: "Qëndroni në Arafah",
        body: 'Qëndroni brenda kufirit të Arafahut nga pas mesditës deri në perëndim të diellit në dua, dhikër dhe pendim. Pejgamberi ﷺ tha: "Haxhi është Arafah" (Tirmidhiu 889, Ebu Davud 1949, hasen sahih): kujtdo që e humb këtë qëndrim e ka humbur haxhin. Drejtohuni kah kibleja, ngrini duart dhe lutuni Allahut - kjo është dita më e madhe për dua.',
        location: "Arafah",
      },
      {
        title: "Kombinoje Dhuhrin dhe Asr",
        body: "Namazin e Dhuhrit dhe të ikindisë së bashku dhe të shkurtuar në kohën e Dhuhrit (xham'takdim), pastaj pjesën tjetër të ditës ia kushtojini tërësisht lutjeve dhe jo lutjeve shtesë.",
        location: "Arafah",
      },
      {
        title: "Kaloni në Muzdelife",
        body: "Pas perëndimit të diellit udhëtoni me qetësi për në Muzdelife, kombinoni akshamin dhe jacinë (Isha i shkurtuar), pushoni natën dhe mblidhni guralecë për gurëzimin. Të dobëtit dhe gratë mund të nisen për në Mina pas mesnate për të shmangur dërrmimin.",
        location: "Muzdelife",
      },
    ],
  },
  {
    day: "10 Dhul-Hixhe",
    title: "Dita e Nahrit - Kurban Bajrami",
    summary: "Gjuajtja me gurë, kurbani dhe tavafi kryesor.",
    steps: [
      {
        title: "Guri Jamrat al-Akaba",
        body: 'Kthehuni në drejtim të Mina dhe hidhni shtatë guralecë në shtyllën e madhe (Xhemrat al-Akaba), duke thënë "Allahu ekber" me çdo gjuajtje. Kjo e rishfaq refuzimin e shejtanit nga Ibrahimi dhe është riti i parë i ditës.',
        location: "Mina",
      },
      {
        title: "Ofroni sakrificën",
        body: "Therni kurbanin, ose rregulloni atë nëpërmjet një agjencie të besuar, siç kërkohet për pelegrinët tamattu dhe kiran (Kur'an 2:196). Mishi i tij hahet dhe u jepet të varfërve.",
      },
      {
        title: "Halk ose teksir",
        body: "Rruaj (halq) ose shkurtoj (taksir) flokët; gratë shkurtojnë gjatësinë e një gishti. Pas gurëzimit dhe rruajtjes, zbatohet lirimi i parë (tehallul evvel) - të gjitha kufizimet e ihramit hiqen, përveç intimitetit me bashkëshortin.",
      },
      {
        title: "Tavaf el-Ifade",
        body: "Shkoni në Mekë për Tawaf al-Ifadeh - një shtyllë e Haxhit - dhe sa'i (për tamattu'). Kjo e plotëson lirimin e plotë nga ihrami dhe ai që i shmanget turpit dhe mëkatit \"kthehet si dita kur e lindi nëna e tij\" (Buhari 1521, Mysliman 1350).",
        location: "Mesxhid el-Haram",
      },
    ],
  },
  {
    day: "11–13 Dhul-Hixhe",
    title: "Ditët e Tashrikut - Mina",
    summary: "Netët në Mina dhe gurëzimi i përditshëm i tre shtyllave.",
    steps: [
      {
        title: "Qëndroni natën në Mina",
        body: "Kaloni netët e datës 11, 12 (dhe 13 nëse nuk largoheni herët) në Mina. Këto janë ditë të ngrënies, pirjes dhe përmendjes së Allahut, të kaluara në adhurim dhe tekbir.",
        location: "Mina",
      },
      {
        title: "Gurizoni tre Xhemaret",
        body: "Çdo pasdite pas Dhuhrit, hidhni shtatë guralecë në secilën nga tre shtyllat me radhë - të vogla, pastaj të mesme, pastaj të mëdha - me një tekbir në çdo hedhje. Ai që nxiton mund të largohet pas goditjes me gurë në datën 12 (Kur'an 2:203).",
        location: "Mina",
      },
      {
        title: "Lamtumirë Tavaf",
        body: "Para se të largoheni nga Meka, kryeni Tawaf el-Vada si ritin përfundimtar, në mënyrë që akti i fundit i haxhit të jetë me shtëpinë. Femrat me menstruacione janë të përjashtuara prej tij.",
        location: "Mesxhid el-Haram",
      },
    ],
  },
  {
    day: "Përfundimi dhe vendimet",
    title: "Shtyllat, detyrimet dhe shpërblimet",
    summary: "Çfarë e vërteton haxhin, çfarë kompensohet dhe shpërblimi i tij.",
    steps: [
      {
        title: "Shtyllat (arkan)",
        body: "Shtyllat janë thelbi i Haxhit: hyrja në ihram, qëndrimi në Arafah, Tawaf el-Ifadeh dhe sa'i (siç është shumica). Nëse humbet ndonjë shtyllë, Haxhi është i pavlefshëm dhe nuk mund të kompensohet me kurban - ai duhet të përsëritet.",
      },
      {
        title: "Detyrimet (vaxhibat)",
        body: "Obligimet përfshijnë hyrjen në ihram nga mikati, qëndrimin në Muzdelife, gurëzimin e Xhemaratit, kalimin e netëve të Teshrikut në Mina dhe Tavafin e Lamtumirës. Lënia e një detyrimi nuk e zhvlerëson haxhin, por kompensohet me një digë (kurban). Medhhebet ndryshojnë në listat e sakta; konsultohuni me një udhëzues të kualifikuar.",
      },
      {
        title: "Shpërblimi i haxhit mabrur",
        body: 'Haxhi i pranuar (Haxhi mebrur) - pa mëkat dhe i bërë me sinqeritet - fshin mëkatet e kaluara dhe shpërblimi i tij është vetë Xheneti. Pejgamberi ﷺ tha: "Një haxhi i pranuar nuk ka shpërblim tjetër përveç Xhenetit" (Buhari 1773, Mysliman 1349). Përpiquni për karakter të shkëlqyer dhe butësi gjatë gjithë kohës.',
      },
      {
        title: "Një udhëzues praktik, jo një fetva",
        body: "Kjo është një pasqyrë praktike për t'ju ndihmuar të ndiqni ritet në rregull. Medhhebet ndryshojnë me respekt në shumë detaje, dhe situata e çdo haxhiu është e ndryshme - gjithmonë konsultohuni me një dijetar të kualifikuar ose udhëzuesin tuaj zyrtar të Haxhit për vendime specifike dhe raste të papritura.",
      },
    ],
  },
];
