// Albanian translation overlays for the Learn Qur'an content.
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

export const QURAN_GUIDE_TOPICS_SQ: DeepPartial<QuranGuideTopic>[] = [
  {
    title: "Hyrje",
    summary: "Çfarë është Kurani, pse është shpallur dhe virtytet e recitimit.",
    body: [
      "Fjala Kuran vjen nga rrënja arabe qara'a, që do të thotë të recitosh ose të lexosh me zë të lartë - kështu që Libri e mbart qëllimin e tij në vetë emrin e tij: ai ka për qëllim të recitohet, përsëri dhe përsëri, në gjuhë dhe në zemër. Në besimin kryesor sunit, Kurani është fjalimi i drejtpërdrejtë, i pakrijuar i Allahut, i shpallur në arabisht të qartë Profetit Muhamed ﷺ nëpërmjet engjëllit Xhibril për rreth 23 vjet, që nga fjalët e para në Shpellën Hira deri pak para vdekjes së Profetit ﷺ.",
      "Ai është shkrimi përfundimtar i dërguar njerëzimit, duke konfirmuar të vërtetën në shpalljet e mëparshme që iu janë dhënë Musait, Davudit dhe Isait (paqja qoftë mbi ta) dhe duke plotësuar mesazhin që ata bartën. Allahu e përshkruan qartë qëllimin e tij: ai u zbrit 'si udhërrëfyes për njerëzimin' - për t'i nxjerrë njerëzit nga errësira e konfuzionit dhe idhujtarisë në dritën e teuhidit, adhurimit të sinqertë të vetëm Allahut, karakterit të drejtë dhe përgatitjes serioze për jetën e ardhshme. Çdo profet thirri në të njëjtën bërthamë; Kurani është forma e tij përfundimtare, e mbrojtur.",
      "Recitimi i Kuranit është në vetvete një akt adhurimi, jo thjesht leximi i informacionit. Profeti ﷺ mësoi se çdo shkronjë e vetme e recituar fiton një vepër të mirë dhe secila vepër e mirë shumëzohet të paktën dhjetëfish – kështu që edhe një fillestar që tingëllon një rresht tashmë po grumbullon shpërblim. Në Ditën e Kijametit, Kur'ani do të vijë si ndërmjetës, duke u lutur në emër të atyre që e mbajtën shoqërinë e tij në këtë jetë. Ai që e reciton rrjedhshëm është në shoqërinë e engjëjve fisnikë-skribë, dhe ai që pengohet mbi të, duke luftuar për të mësuar, fiton një shpërblim të dyfishtë për mundin.",
      "Ndihmon për të qenë i qartë se çfarë nuk është Kur'ani. Kurani është fjalë fjalë për fjalë e vetë Allahut në arabisht, të pandryshuara që nga shpallja. Hadithi - thëniet, veprimet dhe miratimet e heshtura të Profetit - janë të ndara: ato shpjegojnë dhe demonstrojnë Kur'anin, por janë shprehje e Profetit ﷺ, të ruajtura përmes zinxhirëve të emërtuar të transmetuesve dhe të vlerësuar nga dijetarët si sahih (autentike), hasan (i mirë) ose da'if (i dobët). Të dyja janë shpallje dhe të dyja janë të detyrueshme, por vetëm Kur'ani lexohet si adhurim në namaz, dhe vetëm Kur'ani është fjala e mrekullueshme, e paimitueshme e Allahut.",
    ],
    quran: [
      {
        excerpt: "Muaji i Ramazanit në të cilin ka zbritur Kurani si udhërrëfyes për njerëzimin…",
      },
      {
        excerpt:
          "Thuaj: Sikur njerëzit dhe xhinët të mblidheshin për të nxjerrë një Kuran të ngjashëm, ata nuk do të mund…",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kushdo që lexon një shkronjë nga libri i Allahut, merr një hasen, dhe hasenja shumëzohet me dhjetë.",
      },
      {
        excerpt:
          "Lexojeni Kuranin, sepse ai do të vijë ndërmjetësues për shokët e tij në Ditën e Kijametit.",
      },
      {
        excerpt:
          "Ai që është i aftë në Kur'an është me shkruesit fisnikë e të drejtë, dhe ai që e lexon atë me vështirësi, duke belbëzuar mbi të, ka shpërblim të dyfishtë.",
      },
    ],
    actions: [
      "Vendosni një kohë të caktuar ditore për Kuranin – edhe pesë minuta të fokusuara ndërtojnë berake dhe qëndrueshmëri.",
      "Lexoni të paktën një rresht me kuptim: recitoni arabishten, më pas lexoni përkthimin ngadalë.",
      "Hapni lexuesin e Kur'anit të Munibit dhe vazhdoni pikërisht aty ku e latë.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Si u shpall Kur'ani",
    summary: "Shpella e Hirasë, Xhibrilit, periudhave mekase dhe medinase, përmbledhja, ruajtja.",
    body: [
      'Shpallja filloi në muajin e Ramazanit, kur Profeti a.s ishte dyzet vjeç dhe ishte tërhequr në shpellën Hira në një mal jashtë Mekës për vetmi dhe reflektim. Aty i erdhi engjëlli Xhibril dhe i urdhëroi: Lexo! Pejgamberi ﷺ, i cili nuk lexonte e as shkruante, u përgjigj se nuk mundi - derisa engjëlli e përqafoi dhe i përcolli pesë ajetet e para të sures Al-Alak: "Lexo në emër të Zotit tënd që krijoi". I tronditur, ai u kthye në shtëpi te gruaja e tij Hatixheja, e cila e qetësoi dhe e çoi te i afërmi i saj Veraka ibn Naufal, një njeri i ditur që e njohu engjëllin e shpalljes dhe konfirmoi se ishte i njëjti i dërguar që kishte ardhur te Musai.',
      "Pasoi një pauzë e shkurtër në shpallje (fatrah), një periudhë qetësie që e bëri Profetin ﷺ të kishte dëshirë për më shumë; pastaj rifilloi dhe vazhdoi në faza për pjesën tjetër të jetës së tij. Shpallja nuk zbriti e gjitha menjëherë, por u dërgua si përgjigje ndaj ngjarjeve, pyetjeve dhe nevojave në rritje të komunitetit - një metodë graduale që Allahu e përshkruan si forcimin e zemrës së Profetit a.s dhe lehtësimin e Librit në jetën e njerëzve.",
      "Periudha mekase zgjati afërsisht trembëdhjetë vjet. Suret e saj janë shpesh të shkurtra, ritmike dhe të fuqishme; ata vendosin themelet - njëshmërinë e Allahut, sigurinë e ringjalljes dhe llogaridhënies, historitë e profetëve të mëparshëm që u refuzuan dhe më pas u shfajësuan, dhe një thirrje gjithëpërfshirëse për reformë morale në një shoqëri të zhytur në idhujtari dhe padrejtësi.",
      "Pas Hixhrës në Medine në vitin 622 të erës sonë, muslimanët nuk ishin më pak të persekutuar, por një komunitet që ndërtonte një shoqëri. Shpalljet Medinase janë përgjithësisht më të gjata dhe më të hollësishme, duke përcaktuar ligjin dhe rendin shoqëror që i nevojitej ummetit të ri: specifikat e namazit, zekatit, agjërimit, trashëgimisë, martesës dhe divorcit, kontratave, luftës dhe traktateve, krahas fjalëve të forta për hipokritët që minuan bashkësinë nga brenda.",
      "Ruajtja e tekstit filloi që në jetën e vetë Profetit ﷺ. Sahabët e mësuan përmendësh shpalljen ashtu siç vinte dhe skribët e shkruajtën atë në pergamenë, kërcell palme, kocka dhe gurë nën mbikëqyrjen e drejtpërdrejtë të Profetit ﷺ. Pasi shumë kujtues u martirizuan në Betejën e Jemames, Ebu Bekri urdhëroi Zejd ibn Thabit të mblidhte Kur'anin e shkruar në një koleksion të vetëm (suhuf). Më vonë, ndërsa perandoria u përhap dhe dialektet ndryshonin, Uthmani kishte kopje autoritative të bëra në dialektin e kurejshëve dhe dërguar në qytetet kryesore, duke standardizuar një tekst të shkruar për të gjithë umetin.",
      "Vetë Allahu garantoi mbrojtjen e Kuranit: “Ne e zbritëm Përkujtimin dhe vërtet Ne do ta ruajmë atë”. Ky premtim është përmbushur përmes tre masave mbrojtëse të ndërlidhura - memorizimi masiv në çdo gjeneratë, transmetimi i kujdesshëm me shkrim dhe zinxhirët e pandërprerë të recitimit (qiraat) nga mësuesi te nxënësi që arrin deri te Profeti ﷺ. Për besimtarin kjo është një shenjë teologjike; për historianin është një fakt i dokumentuar: Kur'ani i recituar sot është i njëjti tekst i shpallur katërmbëdhjetë shekuj më parë.",
    ],
    quran: [
      {
        excerpt: "Vërtet, Ne e kemi zbritur Përkujtimin dhe vërtet, Ne do ta ruajmë atë.",
      },
      {
        excerpt: "Lexo me emrin e Zotit tënd i cili krijoi…",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Struktura e Kuranit",
    summary: "114 sure, 30 xhuz, ajete, Mekki/Madani, urdhër vs shpallje.",
    body: [
      "Mus'hafi - kopja fizike e Kur'anit - përmban 114 sure (kapituj), secila me emrin e vet, zakonisht të marra nga një fjalë goditëse brenda tij. Ato janë të renditura kryesisht nga më e gjata tek më e shkurtra, por jo në mënyrë rigoroze: El-Fatiha, kapitulli i shkurtër i hapjes, vjen së pari si porta e Librit dhe pason El-Bekareja e gjatë. Ky rregullim është teukifi - urdhri i është mësuar Profetit ﷺ nga Xhibrili dhe nuk është radha në të cilën janë shpallur ajetet. Pra, sekuenca që lexoni në mus'haf është e qëllimshme dhe e fiksuar në mënyrë hyjnore, jo kronologjike.",
      "Çdo sure klasifikohet si Meki (e shpallur para Hixhrës) ose Medani (e shpallur pas saj), dhe disa përmbajnë ajete të të dyjave. Si rregull i madh, suret mekki përqendrohen te besimi - teuhidi, ringjallja dhe historitë e profetëve - në pasazhe më të shkurtra, më urgjente, ndërsa suret Madani shtojnë legjislacionin e detajuar dhe udhëzimet e komunitetit që i nevojiten një shoqërie të vendosur. Të dish se cila është ajo që të ndihmon të lexosh një sure në dritën e duhur.",
      "Për lexim të menaxhueshëm, Kur'ani ndahet gjithashtu në 30 pjesë të barabarta të quajtura xhuz (shumësi ajza'), dhe çdo xhuz në dy gjysma të quajtura hizb, duke dhënë 60 hizb në total. Kjo është ajo që e bën khatm të Ramazanit - plotësimi i të gjithë Kuranit në një muaj - kaq të natyrshëm: një xhuz në ditë përfundon Librin për tridhjetë ditë, dhe një gjysmë xhuz dy herë në ditë është akoma më e butë. Brenda çdo sureje ajetet (ajetet) janë të numëruara, kështu që çdo pasazh mund të citohet saktësisht si sure:ayah; numërimi standard i Medinës është 6,236 ajete, me vetëm dallime të vogla, të mirëdokumentuara në mënyrën se si numërohen disa kufij të vargjeve - vetë teksti është identik.",
      "Kuptimi i kësaj strukture i kthen qëllimet e paqarta në një plan konkret. Ju mund të angazhoheni për një pjesë fikse ditore, të synoni Xhuz Amma (pjesa e fundit, e tridhjetë, plot me sure të shkurtra) për memorizimin, të ndiqni një temë të vetme si durimi në disa sure, ose të planifikoni një lexim të plotë rreth Ramazanit. Struktura është skela që e bën të arritshme një marrëdhënie të përjetshme me Kuranin.",
    ],
    quran: [
      {
        excerpt:
          "…Një libër, vargjet e të cilit janë të detajuara, një Kur'an arabisht për njerëzit që dinë.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Mësoni të lexoni",
    summary: "Shtatë nivele nga alfabeti në recitim rrjedhshëm - për fillestarët absolut.",
    body: [
      "Pothuajse çdo musliman dëshiron të lexojë Kur'anin në arabishten e tij origjinale, dhe ky është një synim plotësisht i arritshëm në çdo moshë - të rritur të panumërt pa arabisht paraprakisht mësojnë të recitojnë rrjedhshëm. Kuptimi i një përkthimi është i vlefshëm, por recitimi i fjalëve aktuale arabe është në vetvete adhurim dhe ia vlen përpjekja. Kjo rrugë të çon hap pas hapi nga mosnjohja e një shkronje të vetme deri te leximi i vargjeve me shqiptim të saktë.",
      "Udhëtimi kalon nëpër shtatë faza natyrore. Nivelet 1 dhe 2 ndërtojnë njohjen e shkronjave - fillimisht 28 shkronjat në formën e tyre të izoluar, pastaj si ndryshojnë format e tyre në fillim, në mes dhe në fund të një fjale. Niveli 3 prezanton harakatin, shenjat e vogla (fatha, kasra, damma, sukun, shaddah, tanween) që ju tregojnë se cilën zanore mbart çdo shkronjë. Nivelet 4 dhe 5 janë aty ku klikon: ju bashkoni shkronjat në rrokje dhe tingëlloni fjalë të tëra, duke përfshirë rregullat e shkronjave të diellit dhe të hënës për artikullin e përcaktuar 'al-'. Nivelet 6 dhe 7 kalojnë në vargje të shkurtra dhe më pas recitim të qetë e të rrjedhshëm me rregullat bazë të texhvidit të zbatuara.",
      "Dy zakone përshpejtojnë gjithçka. Së pari, dëgjoni vazhdimisht një recitues të kualifikuar dhe imitoni saktësisht - Kur'ani është përcjellë me vesh, nga goja në gojë, kështu që veshi juaj është mësuesi juaj më i mirë; kopjoni ritmin, gjatësinë e zanoreve dhe formën e secilit tingull. Së dyti, gjurmoni dhe shkruani shkronjat, në letër ose ekran, sepse dora përforcon atë që syri dhe gjuha po mësojnë.",
      "Një paralajmërim: aplikacionet dhe regjistrimet janë mbështetje e shkëlqyer, por ato nuk mund t'ju korrigjojnë ashtu siç mundet një person. Profeti ﷺ e mësoi Kuranin drejtpërdrejt nga Xhibrili dhe ua mësoi atë ballë për ballë sahabëve, dhe ai zinxhir i gjallë korrigjim është se si është ruajtur gjithmonë recitimi i saktë. Gjeni një mësues lokal ose një program të strukturuar online tajweed për t'ju dëgjuar dhe për të rregulluar gabimet që nuk mund t'i dëgjoni vetë.",
    ],
    actions: [
      "Studioni një shkronjë në ditë në seksionin e shkronjave arabe - shihni, dëgjoni, thoni, shkruani.",
      "Dëgjojeni suren el-Fatiha duke u përsëritur duke ndjekur fjalët në një mushaf.",
      "Organizoni një mësues - lokal ose online - që t'ju dëgjojë të recitoni dhe t'ju korrigjojë çdo javë.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Texhvid",
    summary:
      "Rregullat e recitimit të bukur dhe korrekt - mesditës sakin, madd, vakëf, dhe më shumë.",
    body: [
      "Tajweed vjen nga një rrënjë që do të thotë të bësh diçka të shkëlqyer ose të bukur. Si shkencë do të thotë t'i japësh çdo shkronje që i takon - pikën e saktë të artikulimit në gojë ose në fyt (makhraj), cilësitë e saj të qenësishme (sifat) dhe kohën e duhur të zanoreve dhe pauzave. Shkurtimisht, texhvidi është arti i recitimit të Kuranit pikërisht ashtu siç është shpallur.",
      "Kjo ka rëndësi sepse Kur'ani nuk është thjesht një tekst që duhet lexuar rastësisht. Ai zbriti me texhvid tashmë të ndërtuar: Xhibrili ia recitoi Profetit sal-lAllahu alejhi ue sel-lem me shqiptim të saktë, Pejgamberi a.s. Të gabosh një shkronjë nuk është një gjë e vogël - shqiptimi i gabuar i një shkronje mund të ndryshojë tërësisht një fjalë (për shembull, ngatërrimi i theksit ص me një të thjeshtë س, ose shkronjat në fyt ع dhe ح), dhe në disa vende kjo ndryshon kuptimin e fjalëve të Allahut. Shkenca e texhvidit ekziston për t'u mbrojtur pikërisht nga kjo.",
      "Ju nuk keni nevojë të zotëroni gjithçka menjëherë. Rregullat thelbësore mësohen sipas radhës: vendimet e mesditës sakinah dhe tanween (izhar, idgham, iqlab, ikhfa), rregullat e meem sakinah, llojet e ndryshme të madd-it (zgjatja), qalqalah (kërcimi i dritës në shkronja të caktuara), gunnah (rezonanca nazale) dhe vakëf (waqf). Secili ka një përkufizim të qartë, shembuj të përditshëm dhe diçka për të praktikuar, dhe kjo qendër i kalon ato një nga një.",
      "Një rregull i fortë: mësoni texhvidin me vesh nga një mësues i kualifikuar, jo vetëm nga librat apo aplikacionet. Lexojini dikujt që mund t'i dëgjojë gabimet tuaja dhe t'i korrigjojë ato - kështu është mësuar gjithmonë texhvidi dhe është e vetmja rrugë e besueshme drejt saktësisë së vërtetë dhe, përfundimisht, një ixhaze (një zinxhir i certifikuar recitimi).",
    ],
    hadith: [
      {
        excerpt: "Më të mirët prej jush janë ata që e mësojnë Kuranin dhe e mësojnë atë.",
      },
      {
        excerpt:
          "Ai që është i aftë në Kur'an është me shkruesit fisnikë e të drejtë, dhe ai që e lexon atë me vështirësi, duke belbëzuar mbi të, ka shpërblim të dyfishtë.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Shkronjat arabe",
    summary: "Alfabeti interaktiv — emri, tingulli, shembuj për secilën nga 28 shkronjat.",
    body: [
      "Alfabeti arab ka 28 shkronja, të shkruara dhe të lexuara nga e djathta në të majtë. Ndryshe nga anglishtja, shumica e shkronjave lidhen me ato pranë tyre, kështu që një shkronjë e vetme mund të marrë një formë paksa të ndryshme në varësi të faktit nëse qëndron e vetme apo qëndron në fillim, në mes ose në fund të një fjale. Të mësosh të dallosh të njëjtën shkronjë në format e saj të ndryshme është një nga zbulimet e para reale.",
      "Arabishtja kuranore vendos disa veçori shtesë në krye të shkronjave bazë: hamza (një ndalesë glotale), shkronjat me zanore të gjata alif, waw dhe ya që shtrijnë një tingull dhe rregulli i shkronjës së diellit dhe hënës që vendos nëse 'l' e artikullit të përcaktuar 'al-' shqiptohet apo shkrihet në heshtje në shkronjën tjetër. Këto janë të thjeshta sapo i takoni me fjalë të vërteta.",
      "Çdo kartë shkronjash në këtë seksion ju jep formën e veçuar të shkronjës, emrin e saj, një transliterim, një këshillë praktike shqiptimi dhe shembuj të vërtetë Kur'anorë, në mënyrë që të mësoni tingullin në kontekst dhe jo në abstrakt. Rutina më efektive është një cikli me katër hapa për çdo shkronjë: shikojeni, dëgjoni të recituar, thuani vetë me zë, pastaj shkruani.",
      "Ankoroni çdo shkronjë të re me fjalët që mund t'i njihni tashmë - Allah, Rabb (Zot), ar-Rahman (Më i Mëshirshmi), Bismillah. Lidhja e formave të panjohura me kuptimin e njohur i bën ato të ngjiten shumë më shpejt se shpimi i shkronjave në izolim.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shqiptimi",
    summary: "Përvetësoni shkronjat e vështira - ajn, ha, trishtim, baba, qaf dhe theksim.",
    body: [
      "Arabishtja përmban disa tinguj që nuk kanë ekuivalent të saktë në anglisht, dhe këtu rrëshqasin më shpesh folësit joamtare. Konfuzionet më të zakonshme janë midis shkronjave që tingëllojnë njësoj me një vesh të patrajnuar, por që shqiptohen nga vende të ndryshme në gojë ose në fyt - dhe përzierja e tyre mund të ndryshojë kuptimin e një fjale, kjo është arsyeja pse ato meritojnë praktikë të përkushtuar.",
      "Shkronjat e theksuara - ṣ (ص), ḍ (ض), ṭ (ط) dhe ẓ (ظ) - janë versione 'të rënda' të shkronjave më të lehta. Për t'i prodhuar ato, ju ngrini pjesën e pasme të gjuhës dhe mbushni gojën me një tingull më të plotë e më të thellë, diçka që folësit amtare e thithin në fëmijëri, por nxënësit duhet ta ndërtojnë me vetëdije. Krahasoni çdo theksim drejtpërdrejt me homologun e tij të lehtë: س kundër ص, د kundër ض, ت kundër ط, ذ kundër ظ.",
      "Shkronjat e fytit janë pengesa tjetër e madhe. Ayn (ع) është një shtrëngim i zëshëm nga mesi i fytit, dhe ha (ح) është një fërkim i fortë, që merr frymë - asnjëra nuk ekziston në anglisht dhe asnjë përshkrim i shkruar nuk e zëvendëson plotësisht dëgjimin e tyre. Qaf (ق) është një 'k' e thellë nga pjesa e pasme e gjuhës, e dallueshme nga kaf përpara (ك).",
      "Metoda e besueshme është të krahasoni çiftet krah për krah, pastaj të kontrolloni veten kundër një recitimi të ngadaltë dhe të qartë murattal. Regjistroni zërin tuaj duke recituar një fjalë të shkurtër, luajeni atë kundër recituesit dhe përshtateni. Edhe më mirë, bëni që një mësues i kualifikuar të dëgjojë - disa gabime janë pothuajse të pamundura për t'u kapur në regjistrimin tuaj.",
    ],
    appLinks: [{}],
  },
  {
    title: "Fjalori kuranor",
    summary: "Fjalë me frekuencë të lartë - kuptoni më shumë sa herë që recitoni.",
    body: [
      "Këtu është një fakt inkurajues: një grup relativisht i vogël fjalësh me frekuencë të lartë - në rendin e disa qindra - përbën një pjesë shumë të madhe të tekstit të Kur'anit, sepse të njëjtat fjalë kyçe përsëriten vazhdimisht. Mësimi i këtij fjalori bazë është hapi i vetëm më i rëndësishëm që mund të ndërmerrni, sepse ai e shndërron recitimin nga një rrjedhë tingulli në fjalë, kuptimin e të cilave e kuptoni në të vërtetë ndërsa lexoni.",
      "Ju nuk e përktheni Kur'anin fjalë për fjalë në këtë mënyrë - kjo është puna e tefsirit dhe përkthimit - por filloni të njihni emrat e Allahut, urdhrat, premtimet dhe paralajmërimet drejtpërdrejt, në momentin e recitimit. Filloni me fjalët që shfaqen më shumë dhe kanë peshën më të madhe: Allah, Rabb (Zot), rahmah (mëshirë), iman (besimi), sabr (durim), taqwa (vetëdija ndaj Zotit), dunya (kjo botë) dhe akhirah (Ahireti). Nga ai grup spirancash, zgjeroni pak nga jashtë.",
      "Përdorni përsëritjen e ndarë në vend se të grumbulloni. Të mësosh pesë fjalë të reja në javë dhe t'i rishikosh të gjitha ato çdo ditë do t'ju çojë shumë më larg në një vit sesa të mësoni përmendësh pesëdhjetë në një ulur dhe t'i harroni ato. Allahu premton se Kur'ani është bërë i lehtë për t'u marrë në zemër - afrojuni fjalorit të tij në mënyrë të qëndrueshme dhe ju do ta ndjeni atë lehtësi nga dora e parë.",
    ],
    quran: [
      {
        excerpt:
          "Dhe Ne e bëmë Kur'anin të lehtë për t'u përmendur, e a ka ndokush që të përkujtojë?",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Tefsir",
    summary: "Kuptimi i zbulesës - pasqyrë, konteksti dhe burime të njohura shkencore.",
    body: [
      "Tefsir do të thotë shpjegim dhe interpretim i Kuranit - sqarimi se çfarë do të thotë një ajet, pse është shpallur dhe si zbatohet. Për shkak se këto janë fjalët e Allahut, dijetarët vendosën një rend të rreptë autoriteti për mënyrën se si duhet shpjeguar Kur'ani, dhe qëndrimi brenda tij ju mbron nga gabimet.",
      "Tefsiri më i shëndoshë është vetë shpjegimi i Kur'anit: një ajet që është i shkurtër në një vend shpesh zgjerohet diku tjetër, kështu që Kur'ani është komenti më i mirë i tij. Më pas vjen shpjegimi nga Suneti, meqë Profeti a.s është dërguar pikërisht për ta bërë të qartë shpalljen dhe fjalët dhe praktika e tij na tregojnë se si është jetuar. Pas kësaj vjen mirëkuptimi i sahabëve, të cilët e panë shpalljen dhe e dinin drejtpërdrejt kontekstin e saj, pasuar nga dijetarët e mëdhenj që erdhën pas tyre. I fundit dhe më i ulëti është interpretimi nga vetë gjuha arabe. Ajo që nuk ka fare vend është mendimi personal i pakualifikuar – leximi i ideve tuaja në tekst.",
      "Një mjet kyç në tefsir është asbab el-nuzul, rastet e shpalljes: njohja e ngjarjes ose pyetjes që nxiti një varg shpesh e zhbllokon kuptimin e tij. Por vetë këto raporte duhet të vërtetohen, pasi jo çdo 'rast' i transmetuar është i besueshëm. Për çdo sure, tefsir i mirë ju jep mjedisin e tij historik ku është vendosur, temat e tij kryesore, vargjet e tij kryesore dhe mësimet praktike që duhen marrë.",
      "Ndër referencat më të njohura dhe më të besueshme janë Tefsir Ibn Kethiri (gjithëpërfshirës dhe i kujdesshëm për të cituar hadithin dhe thëniet e gjeneratave të hershme), Tefsir es-Sa'di (i qartë, bashkëkohor dhe i fokusuar në udhëzimet praktike) dhe Tefsir al-Tabari (interpretime enciklopedike, ruajtëse). Sa herë që mësoni një kuptim, vini re nga cili burim ka ardhur. Ky qendër mëson metodologjinë; përdorni lexuesin e Kuranit të Munibit, i cili lidh tefsirin e paketuar dhe të largët, për studim varg pas varg.",
    ],
    sources: [
      "Tefsir Ibn Kethiri - anglisht e shkurtuar e disponueshme gjerësisht",
      "Tefsir es-Sa'di - përmbledhje të arritshme",
      "Asbab al-Nuzul nga al-Wahidi - raste zbulimi (verifikoni autenticitetin për çdo incident)",
    ],
    disclaimer:
      "Tefsiri ndryshon në thellësi. Kur dijetarët ndryshojnë, vini re ndryshimin pa pretenduar siguri ku Allahu nuk e bëri të qartë.",
    appLinks: [{}],
  },
  {
    title: "Temat e Kuranit",
    summary: "Besimi, lutja, durimi, bamirësia, profetët - vargje të grupuara sipas temës.",
    body: [
      "Kurani nuk është i shtruar si një tekst shkollor, një lëndë për kapitull. Në vend të kësaj, temat e saj madhështore – njëshmëria e Allahut, lutja, durimi, bamirësia, profetët, ahireti, drejtësia, familja – thuren kudo, duke u shfaqur dhe rishfaqur nëpër shumë sure, çdo herë nga një këndvështrim i ri. Ajo që në fillim duket si përsëritje është në të vërtetë përforcim: një temë futet, më pas thellohet, më pas lidhet me një tjetër, derisa i gjithë mesazhi të qëndrojë si një thirrje koherente.",
      "Studimi i Kuranit sipas temës zbulon atë unitet. Kur mblidhni atë që thotë Kurani për, thuaj, mirënjohjen ose besimin në Allahun nga të gjitha suret e tij, ajetet e veçanta ndriçojnë njëra-tjetrën dhe mësimi bëhet i gjallë dhe i plotë. Çdo hyrje tematike në këtë qendër mbledh së bashku vargjet përkatëse, duke mbështetur hadithet autentike ku ato shtojnë qartësinë, mësimet thelbësore dhe veprimet konkrete në mënyrë që njohuritë të mos mbeten teorike.",
      "Mbi të gjitha, lidhni temat me jetën tuaj. Mirësia ndaj prindërve, ndershmëria në biznes, drejtësia në martesë, mbrojtja e drejtësisë edhe kundër interesave tuaja - këto nuk janë kapituj abstraktë për t'u admiruar, por vendime të përditshme që Kurani po ju kërkon të merrni. Lexojeni secilën temë si një pyetje që ju drejtohet personalisht: si e ndryshon kjo atë që bëj sot?",
    ],
    appLinks: [{}],
  },
  {
    title: "Tregime në Kuran",
    summary: "Profetët nga Ademi te Muhamedi ﷺ - mësime, vendndodhje, vargje të lidhura.",
    body: [
      "Kur'ani tregon historitë e profetëve - Ademit, Nuhut, Ibrahimit, Jusufit, Musait, Isait dhe shumë të tjerëve - dhe na tregon qartë pse: 'Në tregimet e tyre është një mësim për ata që kuptojnë'. Këto rrëfime nuk janë folklor apo argëtim. Ato janë udhëzime, të zgjedhura dhe të dhëna nga Allahu për të mësuar besimin, durimin dhe se si të përballen me të njëjtat sprova që përsëriten në çdo epokë.",
      "Vini re modelin që kalon nëpër to. Profetët i thirrën njerëzit e tyre në adhurimin vetëm të Allahut; ata u tallën, u kundërshtuan dhe shpesh u dëbuan; ata duruan me durim dhe me mbështetje të plotë në Allahun (tevakkul); dhe në fund premtimi i Allahut u realizua. Kur lexoni për vështirësitë e tyre, nxirrni forcë nga mënyra se si u përgjigjën - pa e imagjinuar kurrë se grada juaj është e barabartë me e tyre. Çështja është të përvetësohet qëndrueshmëria dhe besimi i tyre, jo të krahasohet statusi.",
      "Vetë Kurani veçon një tregim: suren Jusuf, të cilën Allahu e quan 'rrëfimet më të mira'. Në mënyrë të pazakontë, ajo thuhet nga fillimi deri në fund në një sure të vetme, kështu që lexoni atë me një takim si një udhëtim i vazhdueshëm - tradhti, durim përmes skllavërisë dhe burgut, dhe më në fund falje dhe ribashkim - dhe shikoni se si shpaloset plani i Allahut pas viteve të fatkeqësisë së dukshme.",
    ],
    quran: [
      {
        excerpt: "Në tregimet e tyre është sigurisht një mësim për ata që kuptojnë…",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Mrekullitë e Kuranit",
    summary: "Paimitueshmëria gjuhësore, ruajtja, profecitë - me kujdes studiues.",
    body: [
      "Mrekullia qendrore e Kuranit është vetë Kurani. I zbuluar para një njeriu të pashkolluar në epokën më elokuente të poezisë arabe, ai nxori një sfidë të hapur ndaj kundërshtarëve të saj më të ashpër - mjeshtrave të gjuhës - për të prodhuar qoftë edhe një sure të vetme si ajo. Katërmbëdhjetë shekuj më vonë, kjo sfidë mbetet e paplotësuar. Fuqia e saj retorike, struktura e saj, mënyra se si ndërlidhen temat e saj dhe koherenca e udhëzimit dhe ligjit të saj studiohen në shkencën klasike të elokuencës (ilm al-balagha), dhe ato mbeten, sipas pretendimit të vetë Kuranit, të paimitueshme.",
      "Ruajtja e tij është një shenjë e dytë, e verifikueshme. Teksti është mbrojtur si me shkrim, përmes dorëshkrimeve të transmetuara me kujdes, ashtu edhe gojarisht, përmes kiraeteve - zinxhirë të pandërprerë recituesish që e mësojnë përmendësh dhe e mësojnë saktësisht, brez pas brezi. Kjo është histori e dokumentuar, jo spekulim i devotshëm, dhe përmbush premtimin e vetë Allahut për të ruajtur Përkujtimin.",
      "Do të dëgjoni gjithashtu për 'mrekullitë shkencore' - vargje që prekin fazat e embrionit, zgjerimin e kozmosit dhe të ngjashme. Trajtoni këto me kujdes. Tefsiri klasik shpesh i kuptonte vargje të tilla në mënyra krejt të ndryshme nga apologjetët modernë dhe detyrimi i Kuranit që të përputhet me çdo hipotezë shkencore të ndryshueshme mund të dështojë kur teoritë ndryshojnë. Dalloni në mënyrë të vendosur midis interpretimit të vendosur dhe hamendjes bashkëkohore.",
      "Profecitë historike citohen gjithashtu nga studiues - fitorja e parathënë e romakëve, hapja paqësore e Mekës - dhe ato ia vlen të studiohen, por përmes tefsirit dhe serahut të matur, jo videoklipeve sensacionale. Rasti më i fortë për Kuranin ka qenë gjithmonë teuhidi i tij, transformimi moral i një populli dhe gjuha dhe ruajtja e tij e pakrahasueshme.",
    ],
    quran: [
      {
        excerpt: "Pastaj nxirrni një sure si ajo... nëse jeni të sinqertë.",
      },
    ],
    disclaimer:
      "Shmangni pretendimet e mbivlerësuara të mrekullive shkencore që e vënë në siklet davetin kur shqyrtohen. Udhëheq me teuhid, moral dhe prova gjuhësore dhe historike të Kur'anit.",
  },
  {
    title: "Memorizimi (Hifz)",
    summary: "Plane nga Juz Amma në hifz të plotë - rishikim, audio, qëllime ditore.",
    body: [
      "Mësimi përmendësh i Kur'anit (hifz) është një nga punët më fisnike në jetën e një besimtari dhe nuk është i rezervuar për dijetarët apo fëmijët - edhe të rriturit e plotësojnë atë. Profeti ﷺ mësoi se në Ditën e Kijametit atij që ka bartur Kur'anin do t'i thuhet: 'Lexo dhe ngjitu', duke u ngritur në gradë me çdo varg. Filloni aty ku fillojnë të gjithë: suren el-Fatiha, të cilën tashmë e lexoni në çdo namaz, pastaj suret e shkurtra në fund të mus'hafit, duke punuar mbrapsht.",
      "Mësimi më i rëndësishëm në hifz është kundërintuitiv: rishikimi (muraja'ah) ka më shumë rëndësi sesa shtimi i materialit të ri. Pejgamberi ﷺ paralajmëroi se Kur'ani i mësuar përmendësh rrëshqet më shpejt se ç'zgjidhet një deve e lidhur - lëreni të pa rishikuar dhe ikën. Pra, rregulli është i thjeshtë dhe i rreptë: mos shtoni kurrë një pjesë të re derisa të keni rishikuar me vendosmëri atë që keni tashmë. Pak i memorizuar në mënyrë solide rreh shumë të memorizuar lirshëm.",
      "Metoda praktike: përdorni përsëritje në distancë, qëndroni në një recitues të vetëm në mënyrë që vetë melodia të sinjalizojë kujtesën tuaj, recitoni nga kujtesa çdo ditë dhe jo vetëm duke lexuar, dhe kërkoni një mësues të dëgjojë dhe të shënojë gabimet tuaja - gabime që nuk mund t'i dëgjoni vetë. Gjurmuesi hifz i Munibit regjistron përparimin deri në ajetin individual, në mënyrë që të dini gjithmonë se çfarë duhet të rishikohet.",
      "Zgjidhni një plan që i përshtatet skenës tuaj. Fillestar: mësoni përmendësh Xhuz Amma, pjesën e fundit, plot sure të shkurtra. E ndërmjetme: shtoni dhjetë sure të recituara shpesh si el-Mulk, Ja-Sin dhe el-Kehf. E avancuar: plotësoni një xhuz të plotë me rishikim të fortë të gjithçkaje para tij. Dhe udhëtimi i Hafizit: i gjithë mus'hafi, i mësuar përmendësh me një mësues të kualifikuar dhe, në mënyrë ideale, një sened - një zinxhir i vërtetuar transmetimi tek Profeti ﷺ.",
    ],
    hadith: [
      {
        excerpt:
          "Sahabit të Kuranit do t'i thuhet: Lexo dhe ngjitu siç lexoje në këtë botë, sepse grada jote do të jetë në ajetin e fundit që lexon.",
      },
      {
        excerpt:
          "Shëmbëlltyra e shokut të Kuranit është ajo e pronarit të një deveje të lidhur: nëse kujdeset për të e ruan atë, e nëse e lë të shkojë e humb.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Mësime të përditshme",
    summary: "Një varg, kontekst, reflektim dhe veprim - çdo ditë.",
    body: [
      "Lidhja e përjetshme me Kuranin ndërtohet në të njëjtën mënyrë si ndërtohet çdo zakon i thellë – pak, çdo ditë, pa dështuar. Profeti ﷺ mësoi se veprat më të dashura te Allahu janë ato që bëhen vazhdimisht, qoftë edhe të vogla, dhe ky parim është e gjithë ideja që qëndron pas një mësimi të përditshëm. Secili ju jep një varg të vetëm në arabisht, përkthimin e tij, një shënim mbi kontekstin e tij historik, një pyetje reflektimi për t'u ulur dhe një veprim konkret për t'u sjellë në ditët tuaja.",
      "Trajtojini këto vargje si udhërrëfyes të gjallë, jo leximin kalimtar. Shënoni ato që ju godasin zemrën, kthehuni tek ata dhe ndani me familjen tuaj atë që ju ka shtyrë - kur dikush tjetër vepron për një të mirë që keni kaluar, shpërblimi i saj arrin edhe ju, kështu që mësimdhënia e shumëfishon përfitimin.",
      "Mos lejoni që madhësia e vogël t'ju mashtrojë. Konsistenca e mposht intensitetin çdo herë: pesë minuta të sinqerta me Kuranin çdo ditë do t'ju transformojnë shumë më tepër se një orë të rrallë heroike një herë në muaj. Shfaquni çdo ditë dhe lërini ditët të grumbullohen.",
    ],
    appLinks: [{}],
  },
  {
    title: "Reflektim (Tadabbur)",
    summary: "Pyetje të drejtuara - çfarë mëson Allahu dhe si do ta jetoni atë?",
    body: [
      "Tadabbur do të thotë të meditosh thellë Kuranin, duke e kthyer një varg në zemër derisa të të shtyjë të ndryshosh. Ai është një urdhër i drejtpërdrejtë, jo një shtesë fakultative: Allahu pyet: 'A nuk mendojnë ata për Kur'anin, apo ka brava në zemrat e tyre?' Qëllimi i recitimit nuk ishte kurrë thjesht zëri - ishte të arrinte zemrën dhe të riformonte një jetë.",
      "Tedaburi nuk është i njëjtë me tefsir. Tefsir është shpjegimi dijetar i kuptimit të një ajeti; tadabbur është përgjigja juaj personale, nderuese ndaj këtij kuptimi sapo ta kuptoni. Të dyja punojnë së bashku: fillimisht mëson kuptimin tingullor nga tefsir, pastaj ulesh me të dhe pyet se si të flet. Një kornizë e dobishme është tre pyetje - Çfarë po më mëson Allahu këtu? Si e ndryshon kjo atë që bëj sot? Cilin zakon duhet të ndërtoj apo të heq për shkak të tij?",
      "Një kufi i fortë e mban tadaburin të sigurt: reflektoni për atë që ju kërkon një varg, por kurrë mos shpikni kuptime të reja për vetë tekstin. Lëreni tefsirin autentik të përcaktojë kufijtë e interpretimit dhe mbajini reflektimet tuaja personale në vendin e tyre - një ditar privat, si ai i Munibit, është ideal për të kapur atë që një varg nxiti tek ju dhe për t'u kthyer tek ai më vonë.",
    ],
    quran: [
      {
        excerpt: "A nuk mendojnë ata për Kur'anin, apo ka brava në zemrat e tyre?",
      },
      {
        excerpt:
          "Atëherë, a nuk mendojnë ata për Kur'anin? Sikur të ishte prej dikujt tjetër përveç Allahut, ata do të gjenin shumë kundërthënie në të.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Zbatoni Kuranin",
    summary: "Sfida e sotme nga një varg - përfundimi i pista, jetoni ajetin.",
    body: [
      'Njohuria e Kuranit është menduar të bëhet veprim. Allahu i kritikoi ashpër ata para nesh, të cilët e lexuan Librin, por që jetuan kundër tij: "A urdhëroni të tjerët për të mirën dhe e harroni veten ndërsa lexoni Librin?" Kur\'ani është një besëlidhje mes teje dhe Zotit tënd, dhe çdo ajet kërkon diçka në heshtje prej teje - pyetja është nëse përgjigjesh.',
      "Për këtë janë këto sfida. Secili lidh një varg të veçantë me një sjellje të vetme, të mundshme për sot: të ruash gjuhën tënde me të folur të sjellshëm, të japësh një dashuri të qetë, të ulësh shikimin nga ajo që është e ndaluar, të heqësh dorë nga mëria që ke mbajtur. Një varg, një veprim - mjaft i vogël për ta bërë në të vërtetë, mjaft i vërtetë për t'ju ndryshuar.",
      "Shënoni një sfidë të përfunduar vetëm kur e keni bërë vërtet. Pika e gjurmimit nuk është shfaqja – kjo do ta mposhtte qëllimin – por përgjegjësia e ndershme me Allahun, i cili sheh atë që të tjerët nuk e shohin. Me kalimin e kohës, varg për varg, kështu recitimi kthehet në karakter.",
    ],
    quran: [
      {
        excerpt: "A urdhëroni drejtësinë e të tjerëve dhe e harroni veten ndërsa lexoni Shkrimin?",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Kuiz Kur'anor",
    summary: "Rishikoni emrat, strukturën, texhvidin, fjalorin dhe tregimet e sureve.",
    body: [
      "Testimi i vetes është një nga mënyrat më efektive për të mbajtur njohuritë - rikujtimi i një përgjigjeje forcon kujtesën shumë më tepër sesa thjesht rileximi. Ky kuiz bazohet në gjithçka në qendër: numrin e sureve dhe xhuzit, shpalljen e parë dhe mënyrën se si u ruajt Kur'ani, rregullat e texhvidit si madd dhe qalqalah, fjalorin me frekuencë të lartë dhe profetët, historitë e të cilëve tregon Kur'ani.",
      "Mbani qëllimin e duhur. Një pikë është vetëm një pasqyrë për të mësuarit tuaj - ajo kurrë nuk është masë e gradës suaj tek Allahu, e cila i përket vetëm Atij. Përdorni çdo pyetje për të ekspozuar një pikë të dobët, më pas kthehuni në mësimin përkatës dhe studioni pikërisht atë temë në vend që të ndiqni një numër.",
      "Kërkesa e fundit është një reflektim, jo ​​një pyetje e vlerësuar: zgjidhni një sure ose fragment për ta kuptuar dhe mësuar përmendësh më pas, kështu që rishikimi juaj gjithmonë përfundon duke ju drejtuar përsëri te vetë Libri.",
    ],
    appLinks: [{}],
  },
  {
    title: "Referencat dhe burimet",
    summary: "Si e citojmë Kuranin, hadithin, tefsirin dhe dallimet dijetare.",
    body: [
      "Mësimi i shëndoshë Islami është ndërtuar mbi prova transparente, kështu që çdo mësim në këtë qendër synon të tregojë funksionimin e tij. Një pretendim rreth Kuranit mbështetet nga një referencë në formën sure:ayah; një pretendim nga Suneti emërton koleksionin (Buhariu, Muslimi, Tirmidhiu, e kështu me radhë), numrin e hadithit dhe shkallën e tij (sahih, hasen ose më të dobët); një pretendim rreth kuptimit të një ajeti emërton tefsirin nga vjen; dhe aty ku dijetarët vërtet ndryshojnë, dallimi vihet re në vend se fshihet.",
      "Është gjithashtu e rëndësishme të dallojmë atë që është e sigurt nga ajo që është interpretuese. Faktet e vërtetuara – pesë namazet ditore, ruajtja e Kur’anit, ngjarjet kryesore të serasë – janë thënë qartë. Çështjet ku studiuesit e sinqertë kanë qenë prej kohësh dallime, të tilla si detajet e shkëlqyera të eskatologjisë ose leximi i aludimeve shkencore, paraqiten si interpretim, jo ​​si siguri e vendosur. Besimi duhet të përputhet me forcën e provave.",
      "Për studim më të thellë, mbështetuni në referencat e vendosura: përkthime të besueshme të Kur'anit (të tilla si Sahih International ose Pickthall), koleksionet kryesore të haditheve (Sahih al-Bukhari dhe Sahih Mysliman në radhë të parë), tefsiri i respektuar (Ibn Kethiri dhe es-Sa'di) dhe seerah i besueshëm (Klasik i Ibn Hisham-RMakheum, Nektari, për një rrëfim modern).",
      "Më në fund, njihni kufijtë e një aplikacioni. Munib ju edukon dhe ju tregon burimet, por nuk nxjerr vendime fetare. Për fikhun e recitimit, për një ixhaze texhvidi, ose për çdo pyetje që ndikon në adhurimin ose vendimet tuaja për jetën, konsultohuni me një dijetar të kualifikuar në shkollën dhe vendin tuaj.",
    ],
    sources: [
      "Kur'ani - Kompleksi i Mbretit Fahd të shtypur / mushaf dixhital i vërtetuar",
      "Hadithi - referencë e kryqëzuar e notave sunnet.com",
      "Tefsir Ibn Kethiri (i shkurtuar Darussalam)",
      "Tefsir es-Sa'di (Anglisht)",
    ],
    disclaimer:
      "Munib grumbullon përmbajtje të hapur arsimore. Verifikoni çështjet kritike me dijetarë të kualifikuar në medhhebin dhe vendin tuaj.",
  },
];

export const QURAN_GUIDE_STRUCTURE_LEVELS_SQ: DeepPartial<QuranGuideStructureLevel>[] = [
  {
    count: "1 Libër",
    detail:
      "Një Libër - Kelam Allah, fjalimi i mirëfilltë i Allahut, i shpallur Muhamedit ﷺ nëpërmjet engjëllit Xhibril, në arabisht të qartë, gradualisht gjatë rreth 23 viteve. Është i njëjti tekst i vetëm kudo në botë.",
  },
  {
    count: "114",
    detail:
      "Kurani është i ndarë në 114 sure, duke filluar nga vetëm tre ajete deri në 286. Secila ka një emër, zakonisht i marrë nga një fjalë kyçe brenda tij dhe klasifikohet si Makki ose Madani. Rendi i tyre në mus'haf u fiksua me shpallje (teukifi) dhe ndryshon nga radha e shpalljes.",
  },
  {
    count: "30",
    detail:
      "Tridhjetë pjesë afërsisht të barabarta, të krijuara për ta bërë leximin të menaxhueshëm. Recitimi i një xhuzi në ditë plotëson të gjithë Kuranin në një muaj - mënyra klasike për të përfunduar një khatm gjatë Ramazanit.",
  },
  {
    count: "60",
    detail:
      "Çdo xhuz ndahet në dy hizb, duke dhënë 60 gjithsej, dhe çdo hizb më tej në katërshe. Këto njësi më të vogla ju lejojnë të vendosni një pjesë të butë ditore - gjysmë ose çerek hizb - dhe të mbani një zakon të qëndrueshëm.",
  },
  {
    count: "6236",
    detail:
      "Vargjet individuale, të numëruara në mënyrë që çdo pasazh të mund të citohet saktësisht si sure:ajah. 6,236 është numërimi standard i Medinës; Metodat e tjera historike të numërimit ndryshojnë vetëm në mënyrën se si janë shënuar disa kufij vargjesh - vetë fjalët janë identike.",
  },
  {
    count: "2 epoka",
    detail:
      "Çdo sure i përket njërës prej dy epokave të shpalljes. Suret mekki (para hixhretit) janë shpesh më të shkurtra dhe fokusohen në besimin, teuhidin dhe botën tjetër. Suret Medani (pas Hixhrës) shpesh janë më të gjata dhe shtojnë ligjin dhe udhëzimin e komunitetit. Disa sure përmbajnë ajete nga të dyja.",
  },
  {
    count: "Shumë",
    detail:
      "Kurani është thurur rreth temave të përsëritura dhe jo të organizuara temë pas teme. Teuhidi, namazi, historitë e profetëve, familja, bamirësia, durimi dhe bota e përtejme përshkojnë Librin, duke e përforcuar njëri-tjetrin në shumë sure.",
  },
];

export const QURAN_GUIDE_TIMELINE_SQ: DeepPartial<QuranGuideTimelineEvent>[] = [
  {
    title: "Jeta para zbulesës",
    body: "Në vitet para profetësisë, Muhamedi salAllahu alejhi ue selem do të tërhiqej në shpellën Hira për ditë vetmie dhe përsiatjesh, i shqetësuar nga idhujtaria dhe padrejtësia e shoqërisë mekase. Ndonëse bota përreth tij adhuronte idhuj, ai kurrë nuk e bëri këtë, dhe njerëzit e tij i besuan aq plotësisht sa e quanin al-Amin - i besueshmi - shumë kohë përpara se të pretendonte se ishte profet.",
    location: "Meka",
  },
  {
    title: "Shpella e Hirës",
    body: 'Gjatë muajit të Ramazanit, kur ai ishte rreth të dyzetave, engjëlli Xhibril i erdhi në shpellë me një urdhër të vetëm: "Lexo!" Pejgamberi ﷺ, i cili nuk dinte të lexonte apo të shkruante, u përgjigj se nuk ishte në gjendje. Engjëlli e përqafoi fort tri herë dhe pastaj i përcolli fjalët e para të sures Al-Alak: "Lexo në emër të Zotit tënd që krijoi". I tronditur, ai nxitoi në shtëpi te gruaja e tij Hatixheja, e cila e mbështolli me një mantel dhe e qetësoi.',
    location: "Xhebel en-Nur, Meke",
  },
  {
    title: "Shpallja e parë - Surja Al-Alak",
    body: "Urdhri për të lexuar shënoi fillimin e profetësisë dhe të zbritjes së Kur'anit. Hatixheja e çoi te i afërmi i saj i ditur, Ueraka ibn Naufal, i cili e njohu engjëllin si i njëjti lajmëtar që kishte ardhur te Musai dhe i tha se populli i Profetit ﷺ do ta dëbonte atë. Shpalljet më të hershme mekase që pasuan u përqendruan në njëshmërinë e Allahut, sigurinë e Ahiretit dhe një thirrje gjithëpërfshirëse për reformë morale.",
  },
  {
    title: "Periudha e hershme mekase",
    body: "Vitet e para thirrja ishte private, më pas publike. Ndërsa u rrit, kurejshët iu kthyen persekutimit - duke torturuar të dobëtit dhe të skllavëruarit mes besimtarëve - dhe përfundimisht imponuan një bojkot të ashpër tre-vjeçar ndaj fisit të Profetit ﷺ, Benu Hashim. Për t'i shpëtuar mizorisë, një grup myslimanësh migruan në Abisini, ku një mbret i drejtë i krishterë u strehuan. Suret e kësaj epoke zakonisht flasin me vargje të shkurtra, të fuqishme dhe ritmike.",
    location: "Meka",
  },
  {
    title: "Hixhra deri në Medine",
    body: "Pas vitesh persekutimi dhe pas 'vitit të pikëllimit' në të cilin humbi Hatixhen dhe xhaxhain e tij Ebu Talib, Profeti a.s dhe shokët e tij u shpërngulën në Medine. Ky hixhra ishte aq i rëndësishëm sa që më vonë u bë fillimi i kalendarit islamik. Në Medine, muslimanët nuk ishin më një pakicë e gjuajtur, por një komunitet që krijonte një shoqëri, dhe shpallja tani filloi të trajtojë ligjin, familjen, ekonominë dhe marrëdhëniet me ithtarët e librit.",
    location: "Medine",
  },
  {
    title: "Periudha e Medinës",
    body: "Suret Medinase janë përgjithësisht më të gjata dhe më të detajuara, duke përcaktuar legjislacionin që i nevojitet një komuniteti i vendosur: specifikat e namazit, zekatit, agjërimit, martesës dhe shkurorëzimit, trashëgimisë, kontratave dhe traktateve. Kjo periudhë gjithashtu pa betejat kryesore - Bedr, Uhud dhe Konfederatat - dhe Kurani trajtoi sprovat e besimtarëve dhe skemat e hipokritëve (munafiqun) me qartësi të habitshme.",
    location: "Medine",
  },
  {
    title: "Haxhi Lamtumirës",
    body: 'Në vitin e dhjetë pas Hixhrës, Profeti (ﷺ) kreu haxhin e tij të vetëm dhe mbajti Hutben e lamtumirës para një tubimi të gjerë në Arafat, duke i kujtuar ummetit shenjtërinë e jetës dhe pronës, të drejtat e grave, barazinë e të gjithë njerëzve pavarësisht nga raca, dhe detyrën për t\'u mbajtur fort pas Kuranit dhe Sunetit. Pikërisht këtu zbriti ajeti: "Sot përsosa për ju fenë tuaj".',
    location: "Arafat / Mina",
  },
  {
    title: "Përmbledhje nën Ebu Bekrin",
    body: "Jo shumë kohë pas vdekjes së Profetit ﷺ, shumë shokë që kishin mësuar përmendësh të gjithë Kur'anin u vranë në Betejën e Jemames. Nga frika e humbjes së huffazit, Omeri e nxiti halifin Ebu Bekrin që ta mblidhte Kur'anin në një vend. Ebu Bekri e caktoi shkruesin e besuar Zejd ibn Thabit, i cili e mblodhi me kujdes shpalljen e shkruar - të verifikuar në krahasim me kujtimet e sahabëve - në një grup të vetëm fletësh (suhuf).",
  },
  {
    title: "Mushaf i standardizuar - Uthman",
    body: "Ndërsa Islami u përhap në shumë vende, dallimet në recitim midis muslimanëve të rinj filluan të shkaktojnë mosmarrëveshje. Për të bashkuar umetin në një tekst të shkruar, kalifi Uthman bëri kopje autoritare nga suhufi i Ebu Bekrit në dialektin e kurejshëve dhe i dërgoi në qytetet kryesore, duke kërkuar që të liheshin mënjanë kopjet e tjera personale. Ky mushaf osmanik është standardi që e gjithë bota muslimane ka ndjekur që atëherë.",
  },
  {
    title: "Ruajtja deri më sot",
    body: 'Katërmbëdhjetë shekuj më vonë, Kur\'ani mbetet i pandryshuar, i ruajtur nga tre mjete të ndërlidhura: memorizimi masiv (hifz) në çdo brez, transmetimi besnik me shkrim dhe zinxhirët e pandërprerë të recitimit (qiraat) nga mësuesi te nxënësi që arrin deri te Profeti ﷺ. Kjo e përmbush premtimin e vetë Allahut: "Në të vërtetë, Ne e zbritëm Përkujtimin dhe vërtet Ne do ta ruajmë atë".',
  },
];

export const QURAN_GUIDE_STORIES_SQ: DeepPartial<QuranGuideStory>[] = [
  {
    prophetName: "Adami",
    title: "Adami - profeti i parë dhe babai i njerëzimit",
    summary: "Krijimi, sexhdeja e engjëjve, sprova e pemës, pendimi i pranuar.",
    body: [
      "Allahu e krijoi Ademin, qenien e parë njerëzore, me duart e Tij nga balta, i fryu atij nga shpirti i Tij dhe i dha atij një dhuratë që asnjë krijesë tjetër nuk e mori: Ai i mësoi Ademit emrat e të gjitha gjërave. Kur Allahu e shfaqi këtë dituri, engjëjt pranuan kufijtë e tyre dhe nderi i Ademit u bë i qartë – dija në vetvete ishte pjesë e asaj që e veçonte njerëzimin.",
      "Pastaj Allahu i urdhëroi engjëjt që t'i bëjnë sexhde Ademit për nder, dhe ata të gjithë iu bindën - përveç Iblisit, i cili ishte nga xhinët. Ai refuzoi për shkak të mendjemadhësisë, duke argumentuar se ishte prej zjarri dhe Ademi prej balte, dhe kështu e konsideronte veten superior. Ajo krenari, jo injoranca, ishte rënia e tij dhe ai u zotua se do t'i çonte në rrugë të gabuar pasardhësit e Adamit.",
      "Adami dhe gruaja e tij Hawwa u vendosën në Kopsht dhe u thanë se mund të shijonin gjithçka lirisht, por nuk duhet t'i afroheshin një peme të caktuar. Shejtani u pëshpëriste me këmbëngulje derisa ata hëngrën prej saj. Menjëherë u bë e dukshme lakuriqësia e tyre dhe e ndjenë gabimin e tyre. Por, në vend që të dëshpërohen apo të arsyetohen, ata iu drejtuan me përulësi Allahut: “O Zoti ynë, ne i kemi bërë padrejtësi vetes, e nëse nuk na fal dhe nuk na mëshiron, ne me siguri do të jemi prej të humburve”.",
      'Allahu e pranoi pendimin e tyre dhe i zbriti në tokë - jo si një ndëshkim arbitrar, por si fillim i sprovës njerëzore, i shoqëruar me premtimin e udhëzimit: "Kushdo që ndjek udhëzimin Tim nuk do të humbasë dhe as nuk do të bjerë në mjerim." Historia e Ademit është kështu historia e çdo qenieje njerëzore: e krijuar me nder, e sprovuar, e aftë për të gabuar dhe gjithmonë e aftë për t\'u kthyer.',
    ],
    lessons: [
      "Dera e pendimit është gjithmonë e hapur - Teubeja e Ademit, e ofruar pa arsye apo vonesë, është model për çdo mëkatar.",
      "Arroganca është rrënja e shkatërrimit: Iblisi e dinte të vërtetën, por e refuzoi atë nga krenaria, duke treguar se dituria pa përulësi shkatërron.",
      "Metoda e shejtanit është pëshpëritja e vazhdueshme, jo forca – njohja e sugjerimeve të tij është gjysma e rezistencës ndaj tyre.",
      "Vlera njerëzore është e lidhur me diturinë dhe me kthimin tek Allahu, jo me të qenit pa mëkate - është përgjigja ndaj gabimit që na përcakton.",
    ],
    quran: [
      {
        excerpt: "Krijimi i Ademit dhe sexhdeja e engjëjve.",
      },
      {
        excerpt: "Prova, rënia dhe pendimi.",
      },
    ],
    location: "Xheneti, pastaj toka",
  },
  {
    prophetName: "Nuh",
    title: "Nuh - durim gjatë shekujve të refuzimit",
    summary: "950 vjet davet, Arka dhe përmbytja si gjykim hyjnor.",
    body: [
      "Nuhu u dërgua te një popull që kishte rënë në adhurimin e idhujve dhe ai i thirri ata të adhuronin vetëm Allahun për një kohë të mahnitshme - Kurani përmend se ai qëndroi në mesin e tyre një mijë vjet më pak pesëdhjetë. I thërriste ditë e natë, publikisht dhe privatisht, duke u ofruar çdo arsye: falje, shi, pasuri, fëmijë dhe kopshte. Megjithatë brez pas brezi u larguan, u tallën me të dhe ua mbyllën veshët.",
      "Kur u bë e qartë se nuk do të besonte më, Allahu e urdhëroi Nuhun të ndërtonte arkën. Njerëzit e tij e tallën atë pasi ai ndërtoi një anije të madhe larg çdo deti, por ai u përgjigj se po vinte një ditë kur ata do ta kuptonin. Shenja erdhi kur furra shpërtheu ujë; Nuhu mori në bord besimtarët - vetëm disa - dhe çifte nga çdo lloj kafshe.",
      "Përmbytja u ngrit dhe i mbyti refuzuesit. Në një nga momentet më therëse të historisë, vetë djali i Nuhut refuzoi të hipte, duke këmbëngulur se do të ngjitej në një mal për të shpëtuar nga uji dhe ai ishte në mesin e të mbyturve - pikëllimi i një babai nuk mund të kapërcejë mosbesimin e një djali. Kur Nuhu u lut për të, Allahu mësoi se keqbërja e djalit kishte shkëputur lidhjen e besimit mes tyre.",
      "Kur erdhi komanda, ujërat u tërhoqën dhe Arka u ndal në malin Judi. Kur'ani e ruan të gjithë rrëfimin si 'shenjë' për këdo që mendon se si Allahu i shpëton besimtarët dhe se si durimi më në fund shfajësohet.",
    ],
    lessons: [
      "Një mision i gjatë dhe i vështirë me pak ndjekës nuk është dështim - Nuhu predikoi për shekuj dhe sinqeriteti i tij, jo numri i tij, është ajo që e kënaqi Allahun.",
      "Asnjë lidhje familjare nuk e shpëton njeriun pa besim: djali i vetë Nuhut u mbyt, duke dëshmuar se udhëzimi nuk është i trashëguar.",
      "Këmbëngulja në thirrjen drejt Allahut, qoftë edhe kundër talljeve të vazhdueshme, është në vetvete një formë adhurimi.",
      "Shpëtimi i Allahut vjen në kohën e caktuar - besimtari ndërton 'arkën' e bindjes para përmbytjes, duke i besuar premtimit.",
    ],
    quran: [
      {
        excerpt: "Historia e Nuhut në detaje.",
      },
      {
        excerpt: "Lutja e Nuhut drejtuar popullit të tij.",
      },
    ],
    location: "Mesopotamia e lashtë (vlerësime shkencore)",
  },
  {
    prophetName: "Ibrahimi",
    title: "Ibrahimi - miku i Allahut (Khalilullah)",
    summary: "Thyerja e idhujve, zjarri bëri të ftohtë, kurbani i Ismailit, ndërtimi i Qabes.",
    body: [
      'Edhe kur ishte i ri, Ibrahimi arsyetoi rrugën e tij për teuhid, duke refuzuar idhujt që populli i tij dhe babai i tij gdhendën dhe adhuronin. Ai debatoi me ta, pastaj veproi: ndërsa ata ishin larg në një festival, ai theu të gjithë idhujt e tyre, përveç më të madhit, dhe kur ata kërkuan një shpjegim, ai u tha të pyesnin vetë idhullin e madh - duke ekspozuar pafuqinë e asaj që adhuronin. Të zemëruar, ata ndezën një zjarr të madh dhe e hodhën brenda, por Allahu urdhëroi: "O zjarr, qetësi dhe siguri për Ibrahimin", dhe ai doli i padëmtuar.',
      "Me urdhrin e Allahut Ibrahimi la gruan e tij Haxheren dhe djalin e tyre te mitur Ismailin ne luginen djerre te Mekes. Kur u mbaroi uji, Haxheri vrapoi i dëshpëruar midis kodrave të Safas dhe Marwah-ut në kërkim të ndihmës – një kërkim që muslimanët e riorganizojnë në sa’i të Haxhit – derisa pranvera e Zemzemit shpërtheu te këmbët e foshnjës. Vite më vonë, Ibrahimi pa në ëndërr se do të flijonte djalin e tij të dashur. Babai dhe djali iu nënshtruan vullnetit të Allahut; dhe pikërisht kur Ibrahimi ishte gati ta kryente atë, Allahu e shpërbleu Ismailin me një dash të mrekullueshëm, që përkujtohej çdo vit në Kurban Bajramin.",
      "Së bashku, Ibrahimi dhe Ismaili i rritur ngritën themelet e Qabes në Mekë, duke u lutur ndërsa ndërtonin: 'Zoti ynë, pranoje këtë prej nesh'. Ibrahimi gjithashtu u lut që një lajmëtar të ngrihej nga pasardhësit e tyre - një lutje që iu përgjigj shekuj më vonë në Profetin Muhamed ﷺ. Për përkushtimin e tij të palëkundur, Allahu e nderoi Ibrahimin me një titull unik: Halilullah, miku intim i Allahut.",
    ],
    lessons: [
      "Teuhidi kërkon thyerjen e lidhjeve të rreme, edhe kur idhujtaria është normë popullore, e trashëguar dhe qëndrimi kundër tij është i rrezikshëm.",
      "Besimi i plotë në Allahun shkëlqen më së shumti kur urdhri i Tij është më i vështirë - Ibrahimi iu nënshtrua edhe sakrifikimit të djalit të tij dhe Allahu e zëvendësoi sprovën me mëshirë.",
      "Mbështetja në Allahun nuk do të thotë pasivitet: Haxherja vrapoi dhe kërkoi, dhe erdhi Zemzemi - përpjekjet dhe tevakkuli punojnë së bashku.",
      "Aktet e sinqerta të përkushtimit jehojnë ndër breza; ritet e haxhit dhe nderimi i Qabes rrjedhin tek bindja e Ibrahimit.",
    ],
    quran: [
      {
        excerpt: "Ibrahimi, Ismaili dhe kurbani.",
      },
      {
        excerpt: "Besëlidhja dhe trashëgimia.",
      },
    ],
    location: "Iraku, Levanti, Meka",
  },
  {
    prophetName: "Jusufi",
    title: "Jusuf - bukuria e durimit (sabr xhemil)",
    summary: "Tradhtia, skllavëria, burgu, ngritja në autoritet - besim në çdo sprovë.",
    body: [
      "Si djalë, Jusufi pa një ëndërr me njëmbëdhjetë yje, diellin dhe hënën që i përuleshin - një shenjë e një të ardhmeje të madhe. Babai i tij Jakubi, vetë profet, i tha që ta mbante të fshehur nga vëllezërit e tij xhelozë. Zilia e tyre i pushtoi: ata e hodhën Jusufin në fund të një pusi dhe i thanë babait të tyre se një ujk e kishte ngrënë. Një karvan që kalonte e gjeti djalin dhe e shiti në Egjipt.",
      'Në shtëpinë e një fisniku ai u rrit në një burrë me bukuri dhe integritet të mrekullueshëm. Kur gruaja e fisnikut u përpoq ta joshte atë, Jusufi refuzoi duke thënë: "Kërkoj strehim tek Allahu" dhe zgjodhi burgun në vend të mëkatit kur ajo e kërcënoi atë. Edhe pse i pafajshëm, ai u burgos me vite. Atje ai i thirri shokët e tij të burgosur në teuhid dhe ua interpretoi ëndrrat me lejen e Allahut.',
      "Kur mbretin e shqetësoi një ëndërr me shtatë lopë të majme të gëlltitura nga shtatë të dobëta, Jusufi e interpretoi atë si shtatë vite bollëk të ndjekur nga shtatë zi buke dhe këshilloi ruajtjen e grurit. I njohur më në fund për mençurinë dhe besueshmërinë e tij, ai u vu në krye të depove të Egjiptit.",
      "Zia e bukës përfundimisht i çoi vëllezërit e tij në Egjipt duke kërkuar ushqim, duke mos njohur ministrin e fuqishëm përpara tyre. Pasi i testoi ata, Jusufi u shfaq dhe - në vend të hakmarrjes - i fali plotësisht: 'Nuk do të keni asnjë faj sot. Allahu ju faltë.' Familja u ribashkua, prindërit e tij u nderuan dhe ëndrra e fëmijërisë u realizua.",
    ],
    lessons: [
      "Sabr Xhemil - durim i bukur - do të thotë të durosh vështirësitë pa hidhërim apo ankim ndaj njerëzve, duke e çuar pikëllimin tënd vetëm te Allahu siç bëri Jakubi.",
      "Dlirësia ia vlen çdo kusht: Jusufi zgjodhi burgun mbi mëkatin dhe Allahu ia ngriti gradën për shkak të tij.",
      "Plani i Allahut shpesh fshihet pas viteve të fatkeqësisë së dukshme – pusi, skllavëria dhe burgu ishin të gjitha hapa drejt nderit të Jusufit.",
      "Të fortët e tregojnë forcën e tyre përmes faljes: në kulmin e fuqisë së tij, Jusufi i fali ata që i bënë padrejtësi.",
    ],
    quran: [
      {
        excerpt: "Historitë më të mira - të treguara në një sure.",
      },
    ],
    location: "Kanaan, Egjipt",
  },
  {
    prophetName: "Musa",
    title: "Musai - foli me Allahun dhe u përball me Faraonin",
    summary: "Shkurre e djegur, shenja kundër Faraonit, Eksodit, Torës dhe kombit endacak.",
    body: [
      'Musai u rrit, sipas planit të Allahut, brenda pallatit të vetë Faraonit pasi nëna e tij e vendosi në lumë për ta shpëtuar nga masakra e faraonit ndaj djemve izraelitë. Si i ri ai iku nga Egjipti pas një vrasjeje dhe vite më vonë, duke u kthyer nëpër shkretëtirë, pa një zjarr në malin Tur. Atje Allahu i foli drejtpërdrejt - një nder që i dha Musait titullin Kalimullah, ai që foli me Allahun - duke thënë: "Vërtet, unë jam Zoti yt". Ai u dërgua me vëllanë e tij Harunin si mbështetje, tek tirani Faraon me kërkesën: lërini Beni Israilët të shkojnë.',
      "Faraoni pretendoi se ishte zot dhe nuk pranoi. Allahu i dha Musait shenja të qarta – shkopi i tij u shndërrua në një gjarpër të gjallë dhe dora e tij shkëlqente e bardhë rrezatuese. Faraoni thirri magjistarët e tij më të aftë për ta diskredituar, por kur shkopi i Musait gëlltiti iluzionet e tyre, magjistarët e kuptuan të vërtetën e vërtetë nga mashtrimi i thjeshtë dhe ranë në sexhde, duke deklaruar besimin në Zotin e Musait dhe Harunit - edhe kur Faraoni i kërcënoi ata me vdekje. Pasuan një varg murtajash, por Faraoni vetëm u ngurtësua.",
      "Më në fund, Allahu e urdhëroi Musain që ta nxirrte popullin e tij jashtë natës. Faraoni i ndoqi deri në det; Musai e goditi atë me shkopin e tij dhe uji u nda, duke i lënë besimtarët të kalonin në tokë të thatë. Kur faraoni dhe ushtria e tij ndoqën, deti u mbyll mbi ta dhe ata u mbytën. Musai më pas mori Tevratin, por Beni Isra'il u tregua kokëfortë - duke adhuruar një viç të artë në mungesë të tij dhe duke refuzuar të hyjë në tokën e premtuar - dhe si pasojë u endën për dyzet vjet.",
    ],
    lessons: [
      "Thuaji të vërtetën tiranisë duke u mbështetur tërësisht në Allahun – Musai u përball me njeriun më të fuqishëm të moshës së tij të armatosur vetëm me besim.",
      "Edhe besimtarët e sinqertë mund të lëkunden: magjistarët që e kishin kundërshtuar Musain u bënë, në një moment të vetëm qartësie, më të palëkundur se një komb i tërë që kishte parë mrekulli.",
      "Të dëshmosh mrekullitë në vetvete nuk prodhon besim - udhëzimi është një dhuratë që Allahu ia jep zemrës së përulur, jo kokëfortëve.",
      "Allahu i shpëton të shtypurit dhe i kërkon llogari kryelartëve, sado të fuqishëm të duken.",
    ],
    quran: [
      {
        excerpt: "Musai në Tur dhe para Faraonit.",
      },
      {
        excerpt: "Lindja dhe edukimi.",
      },
    ],
    location: "Egjipt, Sinai",
  },
  {
    prophetName: "Isa",
    title: "Isa ibn Merjem - fjalë dhe shpirt nga Allahu",
    summary:
      "Lindje e mrekullueshme, shenja, të ngritura tek Allahu - jo e vrarë e as e kryqëzuar sipas Kur'anit.",
    body: [
      "Merjemja, një grua e dëlirë dhe e devotshme e veçuar nga Allahu si më e mira e grave të kohës së saj, u tërhoq nga familja e saj në një vend në lindje. Aty engjëlli Xhibril iu shfaq asaj në formën e një burri dhe i njoftoi se Allahu do t'i jepte një djalë të pastër, edhe pse askush nuk e kishte prekur atë. Ajo u ngjiz me fjalën e Allahut 'Bëhu' dhe Isa u krijua - Kur'ani e krahason krijimin e tij me atë të Ademit, të bërë pa baba, duke treguar se Allahu krijon si të dojë.",
      'Kur ajo u kthye duke mbajtur foshnjën, njerëzit e saj e akuzuan atë. Në mbrojtje të saj, foshnja Isa foli nga djepi, duke e deklaruar veten një shërbëtor të Allahut të dhënë Librin dhe bëri një profet - duke pastruar nderin e nënës së tij me një mrekulli. Si profet për Beni Israilët, Isait iu dhanë shenja të qarta me lejen e Allahut: ai shëroi të verbërit dhe lebrozët, u dha jetë të vdekurve dhe formoi një zog nga balta që fluturonte - gjithmonë duke theksuar se këto ishin "me lejen e Allahut", asnjëherë me fuqinë e tij.',
      "Kurani është i qartë se Isai as nuk u vra e as nuk u kryqëzua; përkundrazi, kështu iu shfaq armiqve të tij dhe Allahu e ngriti atë pranë Vetes. Besimi kryesor sunit mendon se ai do të kthehet para Ditës së Fundit. Më e rëndësishmja, Kurani këmbëngul se Isa ishte një profet njerëzor dhe shërbëtor i Allahut, jo hyjnor dhe jo bir i Zotit - një mesazh që ai vetë e shpalli nga djepi deri në fund.",
    ],
    lessons: [
      "Allahu krijon si të dojë - lindja e Isait pa baba, sikurse krijimi i Ademit nga dheu, tregon se fuqia e Tij nuk është e kufizuar nga asnjë arsye e kësaj bote.",
      "Çdo mrekulli e kryer nga Isa ishte në mënyrë eksplicite 'me lejen e Allahut', duke mësuar se profetët e kanalizojnë fuqinë e Allahut, ata nuk e zotërojnë atë.",
      "Profetët janë shërbëtorë njerëzorë të nderuar të Allahut, që nuk duhen adhuruar kurrë – Kurani e ruan statusin e vërtetë të Isait kundër ekzagjerimit.",
      "Dlirësia, durimi dhe besimi i Merjemes e bëjnë atë model besimi për të gjithë besimtarët, si për gratë ashtu edhe për burrat.",
    ],
    quran: [
      {
        excerpt: "Fjalimi i lindjes dhe i djepit.",
      },
      {
        excerpt: "Jo i vrarë as i kryqëzuar; i ngritur.",
      },
    ],
    location: "Palestinën",
  },
  {
    prophetName: "Muhamedi ﷺ",
    title: "Muhamedi ﷺ - vula e profetëve",
    summary: "Lajmëtari përfundimtar; Kur'ani i shpallur gjatë 23 viteve; mëshirë për botët.",
    body: [
      "Muhamedi ﷺ lindi në Mekë rreth vitit 570 të erës sonë në fisin Kurejsh. I ri jetim - babai i tij vdiq para lindjes së tij dhe nëna e tij kur ai ishte gjashtë vjeç - ai u rrit fillimisht nga gjyshi i tij dhe më pas xhaxhai i tij Ebu Talibi. Shumë kohë përpara profetësisë, ai ishte aq i besuar për ndershmërinë e tij, saqë populli i tij e quajti atë el-Amin, 'i besueshëm'. Në moshën dyzetvjeçare, duke reflektuar në Shpellën Hira, ai mori shpalljen e parë të Kuranit nëpërmjet engjëllit Xhibril.",
      "Për trembëdhjetë vjet në Mekë ai i thirri njerëzit që të adhuronin vetëm Allahun dhe u përball me persekutim të ashpër: tallje, torturë të të dobëtve në mesin e ndjekësve të tij dhe një bojkot dëmtues social dhe ekonomik të fisit të tij. Në një 'vit të vetëm pikëllimi' ai humbi gruan e tij të dashur Hatixhen dhe mbrojtësin e tij Ebu Talib, dhe kur kërkoi mbështetje në Ta'ifin e afërt, ai u dëbua dhe u qëllua me gurë - megjithatë ai u lut për udhëzimin e tyre dhe jo për shkatërrimin e tyre.",
      "Pas migrimit në Medine, ai ndërtoi një bashkësi dhe e udhëhoqi atë përmes sprovave të Bedrit, Uhudit dhe Konfederatëve. Kur më në fund u kthye për të pushtuar Mekën me forcë dërrmuese, ai nuk u hakmor ndaj atyre që e kishin torturuar dhe dëbuar; ai i fali dhe tha: \"Shkoni, se jeni të lirë\". Kurani e përmbledh misionin e tij në një frazë të vetme - 'mëshirë për botët' - dhe e bën të qartë se detyra e tij ishte të përcillte mesazhin qartë, jo të detyronte askënd të besonte.",
    ],
    lessons: [
      "Karakteri më i mirë që mund të ketë një person është karakteri i Profetit (sal-lAllahu alejhi ue sel-lem).",
      "Mëshira dhe falja janë forcë, jo dobësi: në kulmin e fuqisë së tij ai fali armiqtë e tij më të këqij.",
      "Thirrësi për tek Allahu e përcjell mesazhin me sinqeritet dhe durim, por përfundimin ia lë Allahut - udhëzimi është i Tij.",
      "Sprovat janë rruga e profetëve; durimi i vështirësive për hir të Allahut, siç bëri ai, është shenjë e besimit të vërtetë.",
    ],
    quran: [
      {
        excerpt: "Ne nuk të dërguam ty vetëm si mëshirë për botët.",
      },
      {
        excerpt: "Të mëshirshëm mes tyre, të patundur ndaj jobesimtarëve.",
      },
    ],
    appLinks: [{}],
  },
];

export const QURAN_GUIDE_THEMES_SQ: DeepPartial<QuranGuideTheme>[] = [
  {
    title: "Besimi (Imani)",
    summary:
      "Besimi në Allahun, engjëjt e Tij, librat, të dërguarit, Ditën e Fundit dhe caktimin hyjnor.",
    lessons: [
      "Imani mbështetet në gjashtë artikuj që Kurani i mbledh në një vend: besimi në Allahun, engjëjt e Tij, librat e shpallur të Tij, të dërguarit e Tij, Ditën e Fundit dhe vendimin hyjnor - të mirat e tij dhe të këqijat.",
      "Imani nuk është një pohim fiks, një herë. Në besimin e zakonshëm sunit ai rritet me bindje dhe përkujtim dhe zvogëlohet me mëkatin dhe shkujdesjen, kështu që besimi është diçka që ju e rritni në mënyrë aktive.",
      "Profeti ﷺ mësoi se besimi ka mbi shtatëdhjetë degë, duke filluar nga më të mëdhatë - dëshmia se nuk ka zot tjetër përveç Allahut - deri te heqja e dëmeve nga rruga, duke treguar se edhe veprat e mira të vogla janë pjesë e besimit.",
      "Imani i vërtetë është një çështje e zemrës para gjuhës: të njohësh vërtetë Allahun, ta duash Atë mbi të gjitha, të kesh frikë nga pakënaqësia e Tij dhe të mbështetesh tërësisht tek Ai.",
    ],
    quran: [
      {
        excerpt:
          "I Dërguari i beson asaj që i është shpallur nga Zoti i tij, po ashtu edhe besimtarët…",
      },
    ],
    hadith: [
      {
        excerpt:
          'Besimi ka mbi shtatëdhjetë degë; më e larta është të thuash "Nuk ka Zot tjetër përveç Allahut", dhe më e ulta është heqja e diçkaje të dëmshme nga rruga - dhe modestia është një degë e besimit.',
      },
    ],
    actions: [
      "Rinovoni shehadetin tuaj sot me vëmendje të plotë ndaj asaj që do të thotë, jo si një frazë rutinë.",
      "Mësoni një nga emrat e Allahut, kuptoni atë dhe thirreni Atë me të në duanë tuaj.",
    ],
  },
  {
    title: "Namazi (Namazi)",
    summary: "Vepra e parë e pyetur në Ditën e Gjykimit - shtylla që lidh robin me Zotin.",
    lessons: [
      "Namazi është shtylla e dytë e Islamit dhe vepra e parë për të cilën një rob do të merret në pyetje në Ditën e Gjykimit - nëse është i shëndoshë, pjesa tjetër e të dhënave ka tendencë të ndjekë.",
      "Kurani thotë se namazi, i kryer me prezencë të vërtetë të zemrës, e frenon njeriun nga imoraliteti dhe keqbërja; nuk është thjesht një ritual, por një rivendosje e përsëritur e shpirtit pesë herë në ditë.",
      "Ndryshe nga obligimet e tjera të shpallura në tokë, namazi u përshkrua për ummetin gjatë ngjitjes së Profetit ﷺ (el-Isra uel-Mi'raj), duke e shënuar atë si një dhuratë të veçantë dhe mjetin e vetë besimtarit për t'u ngjitur tek Allahu.",
      "Për shkak se përsëritet pesë herë në ditë, namazi është ritmi i qëndrueshëm që e mban të gjallë besimin ndërmjet një akti të adhurimit dhe adhurimit tjetër.",
    ],
    quran: [
      {
        excerpt:
          "Vërtet, namazi e ndalon imoralitetin dhe keqbërjen, e përmendja e Allahut është më e madhe.",
      },
    ],
    hadith: [
      {
        excerpt:
          "E para nga veprat e një robi që do të gjykohet në Ditën e Kijametit do të jetë namazi i tij; nëse është e shëndoshë ai ka pasur sukses, dhe nëse është me të meta ka dështuar dhe ka humbur.",
      },
    ],
    actions: [
      "Falni një namaz sot ngadalë, duke i kuptuar fjalët e el-Fatihas ndërsa i recitoni ato.",
      "Hapni udhëzuesin Mësoni Namazin e Munibit për të forcuar një pjesë të lutjes suaj.",
    ],
  },
  {
    title: "Prindërit",
    summary:
      "Mirësia ndaj prindërve shoqërohet me adhurimin ndaj Allahut – pas shirkut, paralajmërohet mosmirënjohja ndaj tyre.",
    lessons: [
      "Allahu e bashkon mirësinë ndaj prindërve drejtpërdrejt me adhurimin e Tij në të njëjtin varg - një shenjë se sa e rëndësishme është e drejta e tyre në Islami.",
      "Kur'ani ndalon edhe shenjën më të vogël të acarimit: jo aq sa t'u thuash 'uff', as të flasësh ashpër, por t'u drejtohesh me fjalë të buta dhe të nderuara.",
      "Urdhri arrin kulmin në pleqëri, kur prindërit kanë më shumë nevojë për durim: kujdesu për ta ashtu siç kujdeseshin dikur për ty dhe uli krahun e përulësisë nga mëshira.",
      "Devotshmëria nuk mbaron me vdekjen - vazhdimi i bërjes dua për prindërit, dhënia e bamirësisë në emër të tyre dhe nderimi i miqve dhe premtimeve të tyre janë akte të vazhdueshme besnikërie.",
    ],
    quran: [
      {
        excerpt:
          "Zoti yt ka vendosur që të mos adhuroni tjetër pos Tij dhe të silleni mirë me prindërit…",
      },
    ],
    actions: [
      "Telefononi ose dërgoni një prind me fjalë të mira sot.",
      "Bëni dua për prindërit tuaj me emër.",
    ],
  },
  {
    title: "Durimi (Sabr)",
    summary: "Qëndrueshmëria në bindje, përmbajtja nga mëkati dhe pranimi i sprovave.",
    lessons: [
      "Dijetarët e përshkruajnë sabrin në tri forma: durim në bindjen ndaj Allahut, durim në largimin nga mëkati dhe durim në pranimin e vendimit të Tij kur godasin sprovat.",
      "Sabr nuk është dëshpërim pasiv ose kërcitje dhëmbësh në izolim - Kur'ani e bashkon atë me lutjen si burim ndihme, kështu që durimi është aktiv dhe ju kthen drejt Allahut, jo larg.",
      "Allahu deklaron se është 'me durimtarët' dhe u premton durimtarëve shpërblimin e tyre pa masë - një nder që i lidhet pothuajse asnjë cilësi tjetër.",
      "Profetët ishin njerëzit më të sprovuar dhe Kur'ani e mban qëndrueshmërinë e tyre - Ejubi në sëmundje, Jakubi në pikëllim, Jusufi përmes tradhtisë dhe burgut - si model për t'u imituar.",
    ],
    quran: [
      {
        excerpt:
          "O ju që besuat, kërkoni ndihmë me durim dhe namaz. Vërtet, Allahu është me durimtarët.",
      },
    ],
    actions: [
      "Kur acarimi rritet sot, ndaloni, merrni frymë dhe thoni 'Inna lillahi ue inna ilayhi raji'un' para se të reagoni.",
      "Një moment vështirësie këtë javë kthejeni në dy rekate namaz në vend të ankesës.",
    ],
  },
  {
    title: "Bamirësi (Sadaka dhe Zekat)",
    summary: "Pastrimi i pasurisë dhe ushqyerja e nevojtarëve - një shenjë e besimit të vërtetë.",
    lessons: [
      "Zekati - bamirësia e përvitshme e pastrimit të pasurisë cilësore - është shtylla e tretë e Islamit dhe obligim, ndërsa sadakaja është dhënia vullnetare pa kufi të sipërm dhe forma të pafundme.",
      "Kur'ani premton se pasuria e shpenzuar për hir të Allahut nuk humbet, por shumëfishohet: si një farë e vetme që rriten shtatë kallinj, secili ka njëqind kokrra, dhe Allahu i shumon edhe më shumë kujt të dojë.",
      "Bamirësia nuk është vetëm para. Profeti ﷺ mësoi se edhe ta takosh vëllain tënd me fytyrë të qeshur është sadaka, kështu që askush nuk është shumë i varfër për të dhënë.",
      "Dhënia pastron edhe pasurinë edhe dhuruesin, duke e liruar kontrollin e lakmisë dhe duke krijuar dhembshuri – kjo është arsyeja pse vetë fjala zekat do të thotë pastrim dhe rritje.",
    ],
    quran: [
      {
        excerpt:
          "Shembulli i atyre që shpenzojnë në rrugën e Allahut është si një kokërr që mbijnë shtatë kalli…",
      },
    ],
    actions: [
      "Jepni diçka sot - para, kohën tuaj ose një fjalë vërtet të mirë - edhe nëse është e vogël dhe e padukshme.",
      "Rishikoni detyrimet tuaja të zekatit në Munib dhe shënoni se kur duhet paguar pagesa tjetër.",
    ],
  },
  {
    title: "Pendimi (Teube)",
    summary: "Allahu i do ata që pendohen - dera është e hapur derisa shpirti të arrijë në fyt.",
    lessons: [
      "Teubeja e sinqertë ka kushte të qarta: pendim i sinqertë për mëkatin, ndalimi i menjëhershëm i tij dhe vendosmëri e vendosur për të mos u kthyer kurrë - dhe nëse mëkati i bën keq një personi tjetër, rivendosja e të drejtës së tij gjithashtu.",
      "Allahu nuk e lejon vetëm pendimin - Ai i do ata që kthehen tek Ai vazhdimisht, kështu që kthimi pas një rrëshqitjeje është vetë i dashur tek Ai, jo shenjë kundër jush.",
      "Dera e mëshirës është çuditërisht e gjerë: Allahu u thotë edhe atyre që i kanë bërë keq vetes së tyre të mos dëshpërohen, sepse Ai ia fal të gjitha mëkatet atij që pendohet sinqerisht.",
      "Pendimi nuk është i rezervuar për mëkatet e mëdha apo momentet dramatike - istigfar (kërkimi i faljes) gjatë gjithë ditës e mban zemrën të butë dhe llogarinë të pastër.",
    ],
    quran: [
      {
        excerpt:
          "Thuaj: O robërit e Mi që e keni ngarkuar me shumë gabime veten tuaj, mos e humbni shpresën ndaj mëshirës së Allahut...",
      },
    ],
    actions: [
      "Thuaj 'Astaghfirullah' 100 herë sot, që do të thotë, dhe ndjeje ngritjen e peshës.",
      "Emërtoni një zakon që e dini se nuk e pëlqen Allahun dhe bëni hapin e parë konkret për ta lënë atë.",
    ],
  },
  {
    title: "Parajsa (Xheneti)",
    summary:
      "Shpërblimi i përjetshëm i përgatitur për muttakin - i përshkruar në detaje të gjalla, motivuese.",
    lessons: [
      "Kurani e përshkruan Xhenetin me detaje të gjalla dhe motivuese – kopshte nën të cilët rrjedhin lumenj, lehtësi të përhershme dhe ribashkim me të drejtët – pikërisht për ta bërë besimtarin të dëshirojë dhe të përpiqet për të.",
      "Hyrja në Xhenet është përfundimisht me mëshirën e Allahut, jo vetëm me vepra; besimi dhe përpjekja e sinqertë janë mjetet, por veprat e askujt nuk mund të fitojnë shpërblim të përjetshëm pa hirin e Tij.",
      'Kur\'ani i nxit besimtarët që të garojnë dhe të nxitojnë drejt faljes dhe një kopshti "i gjerë sa qiejt dhe toka" - ai ka për qëllim të ndiqet në mënyrë aktive, jo të shpresohet pasivisht.',
      "Shpërblimi më i madh nga të gjithë nuk janë kopshtet apo lumenjtë, por shikimi i Fytyrës së Allahut – gëzimi i fundit që u premtohet njerëzve të Xhenetit.",
    ],
    quran: [
      {
        excerpt: "Dhe nxitoni në faljen e Zotit tuaj dhe një Xhenet të gjerë sa qiejt dhe toka…",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Zjarri i Ferrit (Jahannam)",
    summary:
      "Një paralajmërim i vërtetë - jo për të dëshpëruar besimtarët, por për të zgjuar vëmendjen.",
    lessons: [
      "Xhehenemi është një paralajmërim i vërtetë, jo një metaforë – Kurani e përshkruan atë qartë, në mënyrë që njerëzit ta marrin seriozisht rrezikun dhe të ndryshojnë kursin ndërsa munden.",
      "Frika nga zjarri ka për qëllim të funksionojë së bashku me shpresën në mëshirën e Allahut: besimtari ecën mes khaufit (frikës) dhe rajas (shpresës), kështu që nuk pushton as dëshpërimi dhe as siguria e rreme.",
      "I vetmi mëkat që Kur'ani e veçon si të pafalshëm nëse një person vdes mbi të është shirku - bërja shok Allahut; çdo gjë më pak se që Ai të falë kujt të dojë.",
      "Allahu paralajmëron për t'i kthyer njerëzit tek Ai, për të mos shtypur atë që pendohet - çdo paralajmërim shoqërohet në Kur'an me një ftesë të hapur për t'u kthyer.",
    ],
    quran: [
      {
        excerpt: "Vërtet, Allahu nuk ia fal shoqërinë Atij, por më pak se kaq ia fal kujt të dojë.",
      },
    ],
    actions: [
      "Pas çdo namazi sot, lutuni Allahut sinqerisht që t'ju mbrojë nga zjarri.",
      "Përtërijeni teuhidin tuaj: reflektoni për adhurimin vetëm ndaj Allahut, mbrojtja më e sigurt nga Xhehenemi.",
    ],
  },
  {
    title: "Drejtësia",
    summary: "Qëndroni të patundur për drejtësi edhe kundër vetes suaj ose të afërmve tuaj.",
    lessons: [
      "Drejtësia në Kur'an është e pakompromis: qëndroni të patundur për të edhe kur e vërteta është kundër vetes, prindërve ose të afërmve tuaj më të afërt.",
      "Allahu urdhëron që urrejtja ndaj një populli nuk duhet të të shtyjë kurrë në padrejtësi - 'Ji i drejtë; kjo është më afër drejtësisë (takva)' - kështu që drejtësia u detyrohet edhe armiqve.",
      "Prej shtypjes (dhulm) paralajmërohet rëndë; Profeti ﷺ mësoi se keqbërja do të shfaqet si errësirë ​​mbi keqbërësin në Ditën e Kiametit.",
      "Drejtësia nuk është vetëm për gjyqtarët dhe sundimtarët - ajo jeton në të folur të ndershëm, sjellje të drejtë, duke mbajtur fjalën tuaj dhe duke i dhënë çdo personi të drejtën e duhur.",
    ],
    quran: [
      {
        excerpt:
          "Bëhuni mbajtës të drejtësisë, dëshmitarë për Allahun, qoftë edhe kundër vetes suaj ose kundër prindërve dhe të afërmve.",
      },
    ],
    actions: [
      "Jepini dikujt të drejtën që i takon sot - një pagë të drejtë, një përgjigje të sinqertë ose kredi që i detyroheni.",
      "Kapni një moment ku paragjykimi ju tundon të jeni të padrejtë dhe zgjidhni drejtësinë në vend të kësaj.",
    ],
  },
  {
    title: "Njohuri",
    summary: 'Lexo, reflekto dhe thuaj "Zoti im, më shto diturinë".',
    lessons: [
      "Fjala e parë e shpallur e Kur'anit ishte 'Lexo' - Islami u hap jo me një ritual, por me një urdhër për të mësuar, duke nderuar si shkrim-leximin e mendjes ashtu edhe diturinë e zemrës.",
      'Allahu i tha edhe Profetit të Tij (ﷺ) që të vazhdojë të kërkojë më shumë: "Zoti im, më shto diturinë" - e vetmja gjë që Kur\'ani e udhëzon atë që të kërkojë shtim.',
      "Njohuria e dobishme është menduar të veprohet dhe të transmetohet; Profeti ﷺ mësoi se dijetarët janë trashëgimtarë të profetëve, të cilët nuk trashëgojnë pasuri, por dituri.",
      "Kërkimi i diturisë së shenjtë është në vetvete adhurim dhe Kur'ani bën dallimin mes atyre që dinë dhe atyre që nuk dinë - 'a janë ata të barabartë?'",
    ],
    quran: [
      {
        excerpt: "Dhe thuaj: Zoti im, më shto diturinë.",
      },
    ],
    actions: [
      "Mësoni një gjë të re nga Kurani sot - një varg, një fjalë ose një vendim - dhe mësojini dikujt.",
      "Mëso përmendësh duanë 'Rabbi zidni ilma' dhe thuaje para se të studiosh.",
    ],
  },
  {
    title: "Profetët",
    summary: "Histori udhërrëfyese, sprovash dhe mbështetjeje hyjnore – jo argëtim, por udhëzim.",
    lessons: [
      "Kur'ani mëson se asnjë popull nuk ka mbetur pa udhëzim: 'nuk ka asnjë bashkësi përveç se një paralajmërues kaloi mes tyre' - i njëjti mesazh teuhid u dërgua kudo.",
      "Të gjithë profetët sollën një thirrje thelbësore - adhuroni vetëm Allahun - dhe historitë e tyre nuk rrëfehen si histori për hir të saj, por si udhëzime për 'ata që kuptojnë'.",
      "Muhamedi ﷺ është vula e profetëve, i dërguari i fundit dhe një musliman duhet të besojë në të gjithë profetët para tij - Nuhun, Ibrahimin, Musain, Isain dhe të tjerët - duke mos bërë asnjë dallim mes tyre.",
      "Profetët ishin qenie njerëzore dhe shërbëtorë të Allahut, jo hyjnorë; Kur'ani i nderon ata, por i mban të vendosur në anën e krijimit, të pa adhuruar kurrë përkrah Krijuesit.",
    ],
    quran: [
      {
        excerpt: "Në tregimet e tyre është një mësim për ata që kuptojnë…",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Gratë",
    summary: "Të drejtat, dinjiteti dhe barazia shpirtërore - Merjem është ndër femrat më të mira.",
    lessons: [
      "Kur'ani mëson barazinë shpirtërore të burrave dhe grave para Allahut: i njëjti besim, të njëjtat vepra dhe i njëjti shpërblim u premtohen 'besimtarëve dhe grave besimtare' njësoj.",
      "Gratë dhe burrat përshkruhen si partnerë dhe mbrojtës të njëri-tjetrit në besim, jo ​​si pasuri - sureja e katërt, an-Nisa ('Gratë'), i kushtohet kryesisht mbrojtjes së të drejtave, dinjitetit, trashëgimisë dhe trajtimit të tyre.",
      "Kurani e mban Merjemen, nënën e Isait, si model për të gjithë besimtarët dhe i nderon aq shumë nënat, saqë mësimet e njohura e vendosin Parajsën në këmbët e tyre.",
      "Të dyja gjinitë e kanë origjinën e vetme - 'të krijoi nga një shpirt' - duke krijuar një humanizëm dhe dinjitet të përbashkët që në ajetin e parë të sures an-Nisa.",
    ],
    quran: [
      {
        excerpt:
          "Kini frikë Zotin tuaj, i cili ju krijoi prej një shpirti dhe prej tij krijoi partnerin e tij…",
      },
    ],
    actions: [
      "Nderojeni një grua në jetën tuaj sot – një nënë, grua, motër ose vajzë – me një të drejtë ose mirësi specifike që i detyrohet.",
    ],
  },
  {
    title: "Fëmijët",
    summary: "Amanet (amana) - të ngrihet mbi teuhidin dhe mirësinë.",
    lessons: [
      "Fëmijët janë një amana - një amanet nga Allahu - dhe Kur'ani i bën prindërit përgjegjës për edukimin e tyre: 'mbroni veten dhe familjet tuaja nga zjarri' fillon me mësimin e teuhidit dhe karakterit të mirë.",
      "Profeti ﷺ e numëroi mësimin dhe mësimin e Kur'anit ndër veprat më të mira, kështu që udhëzimi i një fëmije që të lexojë qoftë edhe pak prej tij mbjell një të mirë të qëndrueshme, shpërblimi i së cilës i kthehet prindit.",
      "Një pjesë e përsëritur gjerësisht e mençurisë prindërore këshillon takimin e fëmijëve në fazën e tyre - të luani me ta në vitet e hershme, më pas t'i mësoni dhe t'i disiplinoni me butësi, më pas t'i miqësoni ndërsa rriten.",
      "Rritja e një fëmije të drejtë është një investim përtej kësaj jete: një pasardhës i drejtë që lutet për një prind vazhdon t'i sjellë dobi shumë kohë pas vdekjes.",
    ],
    quran: [
      {
        excerpt: "O ju që besuat, ruani veten dhe familjen tuaj nga zjarri…",
      },
    ],
    actions: [
      "Mësojini një fëmije një varg të shkurtër ose një sjellje të mirë sot, me durim dhe me inkurajim.",
      "Bëni dua për fëmijët tuaj (apo fëmijët në kujdesin tuaj) me emër që të jenë të drejtë dhe të dashur tek Allahu.",
    ],
  },
];

export const QURAN_GUIDE_TAJWEED_SQ: DeepPartial<QuranGuideTajweedLesson>[] = [
  {
    title: "Mesdita Sakinah & Tanween",
    summary: "Rregullat për ن me sukun dhe tanween - izhar, idgham, iqlab, ikhfa.",
    explanation: [
      "Sakina e mesditës është shkronja ن që mban një sukun (pa zanore); tanween është mbaresa zanore e dyfishuar (an, in, un) që tingëllon njësoj si një mesditë në fund të një fjale. Të dy ndjekin të njëjtat katër rregulla, të vendosura tërësisht nga letra që vjen më pas.",
      "Izhar (shqiptim i qartë): kur pasohet nga një nga gjashtë shkronjat e fytit (ء ه ع ح غ خ خ), shqiptoni mesditën qartë dhe qartë, pa përzierje hundore.",
      "Idgham (bashkim): para shkronjave të fjalës 'yarmaloon' (ي ر م ل و ن), mesdita shkrihet në shkronjën tjetër - me ghunnah (tingull hundor) për ي ن م و, dhe pa ghunnah për ل ر.",
      "Iklab (konvertim): kur ndiqet nga ب, mesdita shndërrohet në një tingull të fshehtë meem të shoqëruar nga gunnah.",
      "Ikhfa (fshehja): para pesëmbëdhjetë shkronjave të mbetura, mesdita as nuk shqiptohet plotësisht dhe as nuk shkrihet plotësisht - ajo 'fshehet' me një gunnah të lehtë hundore ndërsa gjuha përgatitet për shkronjën tjetër.",
    ],
    practice:
      "Recitojeni suren el-Fatiha ngadalë dhe sa herë që takoni një sakine ose tanween të mesditës, ndaloni për të përmendur se cila nga katër rregullat zbatohet dhe pse.",
  },
  {
    title: "Meem Sakinah",
    summary: "Ikhfaa shafawi, idgham shafawi dhe izhar shafawi për م me sukun.",
    explanation: [
      "Një meem sakinah është shkronja م që mban një sukun. Ai ka saktësisht tre rregulla, secila e quajtur 'shafawi' (labial) sepse meem prodhohet me buzë, dhe cili prej tyre zbatohet varet vetëm nga shkronja e mëposhtme.",
      "Idgham shafawi (bashkim labial): kur një meem sakinah pasohet nga një meem tjetër, të dyja bashkohen në një meem të theksuar të mbajtur me gunnah.",
      "Ikhfa shafawi (fshehja labiale): kur ndiqet nga ب, meem fshihet lehtë - buzët afrohen, por nuk shtypen plotësisht - i shoqëruar nga gunnah.",
      "Izhar shafawi (qartësia labiale): para çdo shkronje tjetër, meem shqiptohet qartë. Tregoni kujdes të veçantë përpara shkronjave و dhe ف, ku nxënësit janë më të tunduar për ta turbulluar atë.",
    ],
    practice:
      "Lexoni disa sure të shkurtra nga Xhuz Amma dhe shënoni çdo meem sakinah, duke emërtuar rregullin e saj përpara se të recitoni fjalën.",
  },
  {
    title: "Madd (Zgjatim)",
    summary: "Zgjatje natyrale, dytësore dhe e domosdoshme e zanoreve.",
    explanation: [
      "Madd do të thotë shtrirje e një tingulli zanor, dhe kjo ndodh në tre shkronjat madd - alif (ا), waw (و) dhe ya (ي) - kur ato nuk mbajnë asnjë zanore të tyren dhe ndjekin zanoren e tyre të shkurtër që përputhen.",
      "Madd asli (madd natyral) është zgjatimi bazë i rreth dy numrave, i pranishëm kudo ku shfaqet një shkronjë e çmendur pa ndonjë shkak të veçantë pas saj. Çdo recitues e mban atë në mënyrë të barabartë.",
      "Madd far'i (madd dytësor) shkaktohet nga një hamza ose sukun e mëposhtëm dhe mbahet më gjatë - zakonisht katër ose gjashtë akuza. Gjatësia e saktë varet nga lloji i maddit dhe leximi (riwayah) që ndiqni.",
      "Për shkak se ndalimi në fund të një fjale mund të krijojë një sukun, ai gjithashtu mund të zgjasë një çmenduri - një arsye më shumë për të mësuar kohëzgjatjet me vesh nga një mësues i kualifikuar dhe jo me hamendje.",
    ],
    practice:
      "Zgjidh një sure të shkurtër të njohur dhe numëro butësisht '1-2' në çdo madd natyrale dhe '1-2-3-4' në madds dytësore, duke mbajtur kohën tuaj të barabartë.",
  },
  {
    title: "Ghunah",
    summary: "Tingulli i hundës që shoqëron mesditën dhe meem në idgham dhe ikhfa.",
    explanation: [
      "Ghunnah është një rezonancë hundore e prodhuar përmes hundës, një cilësi e natyrshme e shkronjave noon (ن) dhe meem (م). Në recitimin standard mbahet për rreth dy akuza.",
      "Kërkohet dhe më së shumti shprehet në disa rregulla që i keni plotësuar tashmë: idgami me gunne, ikhfa, iklab dhe sa herë që një mesditë ose meem bart një sheddeh.",
      "Tingulli duhet të jetë i qetë dhe i kontrolluar - nuk është të kënduarit ose gumëzhiturit e një melodie, por një ton i qëndrueshëm i hundës i matur në gjatësinë e duhur.",
      "Një test i thjeshtë: shtrëngoni lehtë hundën ndërsa prodhoni një shkronjë gunnah; nëse zëri është i bllokuar, rezonanca me të vërtetë po kalon përmes hundës ashtu siç duhet.",
    ],
    practice:
      "Recitoni një fjalë me shaddah në mesditë ose meem, duke mbajtur gunën për dy herë të qëndrueshme, më pas regjistrojeni veten dhe krahasoni me një recitues të kualifikuar.",
  },
  {
    title: "Qalqalah",
    summary: "Kërcimi me jehonë në ق ط ب ج د kur sakin ose kur ndalet mbi to.",
    explanation: [
      "Qalqalah është një 'kërcim' i lehtë jehonës i dhënë në pesë shkronja - të mbledhura në frazën قُطْبُ جَدٍ, që është ق ط ب ج د - sa herë që ata mbajnë një sukun.",
      "Kërcimi është një dridhje e lehtë e pikës së artikulimit; ju nuk duhet të shtoni një zanore të plotë pas shkronjës, vetëm lëreni atë të 'rikthehet' pastër.",
      "Është më e lehtë (sughra) kur shkronja ka një sukun në mes të një fjale, dhe më e fortë dhe më e qartë (kubra) kur ndalet në atë shkronjë në fund të një fjale.",
      "Mbajeni kërcimin neutral - mos e anoni drejt një tingulli 'a', 'i' ose 'u'; është e njëjta jehonë e mprehtë pavarësisht nga zanoret përreth.",
    ],
    practice:
      "Recitoni suren el-Ikhlas dhe ndaloni me vendosmëri në secilën shkronjë kalkalah - د e 'ahad' dhe 'julad' - duke ndjerë rikthimin e pastër.",
  },
  {
    title: "Vakëf (ndalim)",
    summary: "Ku të ndaloni, të merrni frymë dhe si ndalimi ndryshon shqiptimin.",
    explanation: [
      "Vakëfi është arti se ku dhe si të ndalosh. Mushafi shënon pikat e ndalimit me simbole të vogla - për shembull م për ndalimin e kërkuar, ط dhe ج për ndalesat e lejuara dhe لا që do të thotë mos ndalo këtu - për të udhëhequr recituesin.",
      "Ndalimi zakonisht mbyll zanoren fundore, duke e kthyer shkronjën e fundit në sukun. Ky ndryshim më pas mund të shkaktojë rregulla të tjera, të tilla si qalqalah ose një madd i zgjatur, kështu që një fjalë mund të tingëllojë ndryshe kur ndaloni në të sesa kur vazhdoni.",
      "Vendi ku ndaloni mund të ndikojë në kuptimin, kështu që mos e prishni frazën në mes në një mënyrë që e shtrembëron atë. Një rast i veçantë është vakëfi mu'anaka (përqafues), i shënuar me tre pika, ku mund të ndalesh në njërën nga dy pikat, por jo në të dyja.",
      "Mënyra më e sigurt për të mësuar ndalesat e sakta është me një mushaf që tregon shenja vakëfi së bashku me një recitues të kualifikuar, kështu që pauzat tuaja përputhen me recitimin e transmetuar.",
    ],
    practice:
      "Merrni një faqe me shenja vakëfi dhe lexoni me zë të lartë pas regjistrimit të një mësuesi të texhvidit, duke ndaluar pikërisht aty ku tregojnë simbolet.",
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

export const QURAN_GUIDE_VOCABULARY_SQ: DeepPartial<QuranGuideVocabEntry>[] = [
  {
    meaning: "Zoti i vetëm i vërtetë - emri i duhur që përfshin të gjithë emrat e bukur.",
    frequency: "2700+ dukuri",
    example: "Bismillah - Në emër të Allahut",
    quranRef: {
      excerpt: "Me emrin e Allahut, Gjithëmëshirshmit, Mëshirëbërësit të Veçantë.",
    },
  },
  {
    meaning: "Zot, Mjeshtër, Mbajtës - ai që krijon, zotëron, ushqen dhe qeveris.",
    frequency: "Shumë e shpeshtë",
    example: "Rabbana - Zoti ynë",
    quranRef: {
      excerpt: "Falënderimi i takon vetëm Allahut, Zotit të botëve.",
    },
  },
  {
    meaning: "Mëshirë, dhembshuri, butësi nga Allahu dhe në mesin e krijimit.",
    frequency: "Rrënja e përbashkët ر-ح-م",
    example: "Er-Rrahman, Er-Rahim",
  },
  {
    meaning: "Kopshti, Parajsa - vendbanimi i përjetshëm i shpërblimit.",
    frequency: "Të shpeshta",
    example: "Kopshtet nën të cilat rrjedhin lumenj",
  },
  {
    meaning: "Zjarri - i referohet Jahannamit si paralajmërim dhe pasojë.",
    frequency: "Të shpeshta",
    example: "Kini frikë zjarrin e përgatitur për jobesimtarët",
  },
  {
    meaning: "Besimi, besimi, besimi në Allahun dhe pranimi i mesazhit të Tij.",
    frequency: "Shumë e shpeshtë",
    example: "O ju që besuat (ya ejjuha alladhina amanu)",
  },
  {
    meaning: "Durim, durim, durim për hir të Allahut.",
    frequency: "Të shpeshta",
    example: "Vërtet Allahu është me durimtarët",
  },
  {
    meaning: "Mirënjohja - pranimi i bekimeve me zemrën, gjuhën dhe gjymtyrët.",
    frequency: "Të shpeshta",
    example: "Nëse jeni mirënjohës, me siguri do t'ju shtoj",
  },
  {
    meaning: "Vetëdija ndaj Zotit, devotshmëria, ruajtja nga mëkati nga frika e Allahut.",
    frequency: "Shumë e shpeshtë",
    example: "Më fisniku prej jush tek Allahu është më i devotshmi",
  },
  {
    meaning: "Furnizimi, furnizimi - ajo që Allahu cakton për çdo shpirt.",
    frequency: "Të shpeshta",
    example: "Allahu është furnizuesi më i mirë",
  },
  {
    meaning: "Drita - udhëzim, shpallje dhe ndriçim i zemrës.",
    frequency: "Të shpeshta",
    example: "Allahu është drita e qiejve dhe e tokës",
    quranRef: {
      excerpt: "Allahu është drita e qiejve dhe e tokës…",
    },
  },
  {
    meaning:
      "Kjo jetë e kësaj bote - fjalë për fjalë 'jeta më e ulët/më e afërt'. Në Kur'an ai është i përkohshëm dhe një sprovë, në kontrast me akhirahun e qëndrueshëm dhe kurrë nuk është shtëpia e vërtetë e besimtarit.",
    frequency: "Të shpeshta",
    example: "Jeta e kësaj bote (el-hajat ad-dunya) nuk është veçse argëtim dhe devijim",
  },
  {
    meaning:
      "Ahiret - jeta e përjetshme pas vdekjes, duke përfshirë ringjalljen, gjykimin, Parajsën dhe Ferrin. Është jeta reale dhe e qëndrueshme për të cilën Kurani i nxit besimtarët të punojnë.",
    frequency: "Të shpeshta",
    example: "Dhe bota tjetër (al-akhirah) është më e mirë dhe më e qëndrueshme",
  },
  {
    meaning:
      "Lutja rituale, shtylla e dytë e Islamit, kryhet pesë herë në ditë. Fjala mbart gjithashtu kuptimin e lidhjes dhe lutjes ndaj Allahut.",
    frequency: "Shumë e shpeshtë",
    example: "Fale namazin (akim es-Namazi) për përkujtimin Tim",
  },
  {
    meaning:
      "Libri ose shkrimi - më së shpeshti vetë Kurani ('ky është Libri'), por edhe shkrimet e shenjta të shpallura më herët dhe regjistrimi i veprave. Me rrënjë në k-t-b, për të shkruar.",
    frequency: "Shumë e shpeshtë",
    example: "Ky është Libri (dhalika el-kitab) për të cilin nuk ka dyshim",
  },
];

export const QURAN_GUIDE_LETTERS_SQ: DeepPartial<QuranGuideLetter>[] = [
  {
    name: "Alif",
    pronunciation: "E gjatë /a/ si në 'baba' (kur mban hamza ose madd)",
  },
  {
    name: "Ba",
    pronunciation: "Si anglishtja 'b'",
  },
  {
    name: "Ta",
    pronunciation: "Ashtu si 't' anglisht",
  },
  {
    name: "Tha",
    pronunciation: "Si 'th' në 'mendoj'",
  },
  {
    name: "Jim",
    pronunciation: "Si 'j' në 'jam'",
  },
  {
    name: "Ha",
    pronunciation: "Frymë e fortë h nga fyti - jo anglisht 'h'",
  },
  {
    name: "Kha",
    pronunciation: "Ashtu si 'loch' skocez - fërkim në fyt",
  },
  {
    name: "Dal",
    pronunciation: "Ashtu si 'd' anglisht",
  },
  {
    name: "Dhal",
    pronunciation: 'Si "th" në "këtë"',
  },
  {
    name: "Ra",
    pronunciation: "'r' i mbështjellë/trilluar",
  },
  {
    name: "Zay",
    pronunciation: "Ashtu si 'z' në anglisht",
  },
  {
    name: "Mëkati",
    pronunciation: "si anglishtja",
  },
  {
    name: "Shin",
    pronunciation: "Si 'sh' në 'anije'",
  },
  {
    name: "E trishtuar",
    pronunciation: "Emphatic 's' - gjuha e ngritur, tingull më i plotë",
  },
  {
    name: "Babai",
    pronunciation: "Emfatik 'd' - unike në arabisht",
  },
  {
    name: "Ta (e theksuar)",
    pronunciation: "'t' e theksuar - më thellë në gojë",
  },
  {
    name: "Za (e theksuar)",
    pronunciation: "Version i theksuar i tingullit 'dh'",
  },
  {
    name: "Ayn",
    pronunciation:
      "Një shtrëngim i zëshëm nga mesi i fytit - nuk ka ekuivalent në anglisht; mësojnë atë duke imituar një recitues",
  },
  {
    name: "Ghayn",
    pronunciation: "Si frëngjisht 'r' ose gargarë 'gh'",
  },
  {
    name: "Fa",
    pronunciation: "Si anglishtja 'f'",
  },
  {
    name: "Qaf",
    pronunciation: '"K" e thellë nga pjesa e pasme e gjuhës - jo "k" angleze',
  },
  {
    name: "Kaf",
    pronunciation: "Ashtu si 'k' në anglisht (përpara në gojë)",
  },
  {
    name: "Lam",
    pronunciation: "Ashtu si 'l' anglisht",
  },
  {
    name: "Mim",
    pronunciation: "Ashtu si 'm' në anglisht",
  },
  {
    name: "Murgesha",
    pronunciation: "Ashtu si 'n' anglisht",
  },
  {
    name: "Ha (dritë)",
    pronunciation: "'h' e butë në fund të fjalëve",
  },
  {
    name: "Ua",
    pronunciation: "Si 'w' ose 'oo' e gjatë",
  },
  {
    name: "Po",
    pronunciation: "Si 'y' ose 'ee' e gjatë",
  },
];

export const QURAN_GUIDE_PRONUNCIATION_SQ: DeepPartial<QuranGuidePronunciationPair>[] = [
  {
    title: "Ayn kundër Ha",
    tip: "Të dyja vijnë nga fyti por ndryshojnë në zë. Ayn (ع) është një shtrëngim i zëshëm nga mesi i fytit - kordat vokale dridhen. Ha (ح) është një fërkim i fortë, pa zë, si një psherëtimë e rëndë pa dridhje. Asnjëra nuk ekziston në anglisht, prandaj mësoni ato me vesh nga një recitues.",
  },
  {
    title: "Ha vs Kha",
    tip: "Ha është më e mprehtë dhe më e lehtë; Kha është më e thellë me më shumë fërkime - si 'loch'.",
  },
  {
    title: "Mëkati kundër Trishtimit",
    tip: "Sin (س) është një 's' e lehtë, e hollë si në anglisht 'shih'. I trishtuar (ص) është binjaku i tij i rëndë dhe i theksuar: ngrini pjesën e pasme të gjuhës, rrethoni pak gojën dhe tingulli thellohet. Përzierja e tyre mund të ndryshojë fjalët - sabr (durim) kundrejt leximit të dritës.",
  },
  {
    title: "Dal kundër babit",
    tip: "Dal (د) është një 'd' e thjeshtë. Babi (ض) është një 'd' e rëndë, e theksuar unike në arabisht - shtypni anën e gjuhës kundër dhëmballëve të sipërm dhe lëreni tingullin të mbushë gojën. Arabishtja është quajtur edhe 'gjuha e babait' për shkak të kësaj shkronje dalluese.",
  },
  {
    title: "Ta vs Ta (e theksuar)",
    tip: "T e theksuar është më e thellë; mos e zëvendësoni vetëm me 't' në anglisht.",
  },
  {
    title: "Dhal vs Za (e theksuar)",
    tip: "Të dyja përfshijnë tinguj 'th'; ظ është më e rëndë dhe e theksuar.",
  },
  {
    tip: "Kaf (ك) është një 'k' përpara si 'çelës' në anglisht. Qaf (ق) është bërë shumë më mbrapa - pjesa e pasme e gjuhës prek uvulën, duke dhënë një 'k' të thellë, gutturale, pa ekuivalent në anglisht. Mbajini ato të dallueshme: qalb (zemra) nuk është kalb (qen).",
    title: "Kaf vs Qaf",
  },
  {
    title: "Ghayn vs Kha",
    tip: "Ghayn ka zë; Kha është fërkim pa zë.",
  },
];

export const QURAN_GUIDE_MEMORIZATION_PLANS_SQ: DeepPartial<QuranGuideMemorizationPlan>[] = [
  {
    title: "Fillestar - Juz Amma",
    summary:
      "Pika e natyrshme e fillimit për të gjithë. Filloni me suret shumë të shkurtra në fund të mus'hafit - nga en-Nas duke punuar mbrapsht - të cilat janë të lehta, të shpejta shpërblyese dhe të dobishme në çdo namaz.",
    surahs: ["En-Nas", "El-Felak", "El-Ikhlas", "Al-Masad", "En-Nasr", "El-Kafirun", "El-Kevther"],
    tip: "Mësoni përmendësh vetëm një ajet në ditë: dëgjoni një recitues murattal që e përsërit atë rreth dhjetë herë, i bën jehonë me zë të lartë derisa të rrjedhë, më pas bashkoje atë me atë që mban tashmë përpara se të vazhdosh.",
  },
  {
    title: "E ndërmjetme - Dhjetë sure thelbësore",
    summary:
      "Sapo suret e shkurtra të jenë të forta, merrni kapitujt më të dashur më të gjatë që kanë virtyt të madh dhe shpesh recitohen të premteve dhe gjatë natës - mes tyre el-Mulk, Ya-Sin, ar-Rahman, al-Waki'ah dhe el-Kehf.",
    surahs: [
      "El-Fatiha",
      "El-Mulk",
      "Ya-Sin",
      "Er-Rrahman",
      "El-Vakiah",
      "El-Kehf",
      "El-Xhuma",
      "Al-Hashr",
    ],
    tip: "Ankoroni memorizimin e ri në një vend të caktuar ditor – koha e qetë dhe me mendje të kthjellët menjëherë pas Sabahut është ideale – kështu që qëndrueshmëria bën edhe ngritja e rëndë.",
  },
  {
    title: "E avancuar - Një xhuz",
    summary:
      "Angazhohuni për të kompletuar një xhuz të plotë duke e mbajtur çdo gjë përpara saj të fortë. Shumë prej tyre fillojnë me Xhuzin 29 ose 30, suret e të cilave tashmë i dinë pjesërisht, pastaj zgjerohen nga një xhuz në një kohë.",
    surahs: ["Zgjidhni një xhuz - shumë fillojnë me Juz 29 ose 30, pastaj zgjerohen"],
    tip: "Asnjëherë mos shtoni një pjesë të re derisa e vjetra të rishikohet fort. Profeti ﷺ paralajmëroi se Kur'ani i mësuar përmendësh rrëshqet më shpejt se sa shkëputet një deve e lidhur.",
  },
  {
    title: "Udhëtimi i Hafizit",
    summary:
      "Mësimi përmendësh i të gjithë Kuranit - një nder i përjetshëm që rrit atë që e mbart atë dhe, me mëshirën e Allahut, prindërit e tyre. Është një angazhim serioz, që zakonisht përfshin disa vite memorizimi të ri ditor dhe rishikim të disiplinuar.",
    surahs: ["Mushafi i plotë - zakonisht 3-7 vjet me rishikim ditor"],
    tip: "Mos e provoni vetëm: përdorni gjurmuesin hifz të Munib për të menaxhuar orarin tuaj të rishikimit dhe recitojini rregullisht një hafizi ose mësuesi të kualifikuar që mund të kapë dhe korrigjojë gabimet tuaja.",
  },
];

export const QURAN_GUIDE_DAILY_LESSONS_SQ: DeepPartial<QuranGuideDailyLesson>[] = [
  {
    translation:
      "O ju që besuat, kërkoni ndihmë me durim dhe namaz. Vërtet, Allahu është me durimtarët.",
    context:
      "Nga sureja el-Bekare, e zbritur në Medine. Allahu bashkon dy burime fuqie për besimtarin që përballet me vështirësi - durimin dhe kthimin në namaz - dhe premton shoqërimin e Tij të veçantë për ata që qëndrojnë të patundur.",
    reflection:
      "Çfarë sprove po përballem tani, ku po përpiqem për një arratisje të shpejtë në vend të durimit dhe lutjes ku më drejton ky varg?",
    action:
      "Falni një namaz sot pa nxitim dhe në suxhudin tuaj kërkoni Allahun me emër për durim në sprovën specifike që po kaloni.",
  },
  {
    translation: "Mëshira ime përfshin të gjitha gjërat.",
    context:
      "Nga sureja el-A'raf, e folur në kontekstin e Musait dhe popullit të tij. Allahu e përshkruan mëshirën e Tij sikur përfshin të gjitha gjërat - një mëshirë kaq e madhe saqë i paraprin dhe e tejkalon dënimin e Tij, e cila është e rezervuar për ata që këmbëngulin në gabime.",
    reflection:
      "Gabimin e kujt po refuzoj ta fal, edhe pse unë vetë varem tërësisht nga mëshira e pakufishme e Allahut?",
    action:
      "Zgjidhni një person për të cilin keni inat, fali sinqerisht në zemrën tuaj sot dhe bëni një dua të shkurtër duke i kërkuar Allahut t'i udhëzojë dhe t'i falë ata gjithashtu.",
  },
  {
    translation: "Nëse jeni mirënjohës, me siguri do t'ju shtoj.",
    context:
      "Nga sureja Ibrahim, pjesë e përkujtimit të Musait për Beni Isra'ilin. Allahu e lidh rritjen e Tij drejtpërsëdrejti me mirënjohjen - falënderimi për një bekim është pikërisht ajo gjë që e bën atë të rritet, ndërsa mosmirënjohja e fton humbjen e tij.",
    reflection:
      "Cilën nga dhuratat e Allahut – shëndetin, familjen, besimin apo furnizimin tim – kam filluar ta trajtoj këtë javë si të zakonshme dhe që më detyrohet?",
    action:
      "Para se të flini sonte, thoni me zë të lartë 'Elhamdulillah' për tre bekime specifike, duke e emërtuar secilën prej tyre në mënyrë që mirënjohja të bëhet e vetëdijshme, jo automatike.",
  },
  {
    translation: "Dhe thuaju njerëzve fjalë të mira.",
    context:
      "Nga sureja el-Isra. Mes udhëzimeve se si duhet të sillen besimtarët, Allahu urdhëron që t'u flasim njerëzve - të gjithë njerëzve - në mënyrën më të mirë, pasi fjalët e ashpra janë një nga dyert nëpër të cilat shejtani mbjell përçarje.",
    reflection:
      "Duke parë sot, a i kanë ndërtuar fjalët e mia më së shumti njerëzit apo i kanë larguar ata – dhe a kam folur 'fjalë të mira' edhe me ata që i kam të vështirë?",
    action:
      "Sinqerisht inkurajoni ose falenderoni një person sot pa kritika të fshehura dhe mbajeni një vërejtje të ashpër që jeni tunduar të bëni.",
  },
  {
    translation: "Kush i mbështetet Allahut, Ai i mjafton atij.",
    context:
      "Nga sureja et-Talak, e vendosur ndër vendimet mbi shkurorëzimin dhe furnizimin - pikërisht aty ku njerëzit ndihen më të shqetësuar financiarisht. Aty Allahu premton se kushdo që i frikësohet Atij, Ai do ta furnizojë atë nga ku nuk e prisnin, dhe kushdo që mbështetet tek Ai do ta gjejë mjaftueshëm.",
    reflection:
      "Ku mund të bëj plane të kujdesshme, veçse ta lë Allahun jashtë tyre – apo të mbështetem në ndihmën e njerëzve pa iu drejtuar asnjëherë Atij në dua?",
    action:
      "Merrni një vendim që ju shqetëson, falni dy rekate istikhare ose bëni një dua të përzemërt mbi të dhe pastaj besojini Allahut përfundimin.",
  },
  {
    translation: "Zoti im, më shto diturinë.",
    context:
      "Nga sureja Ta-Ha. Kjo është e vetmja gjë në Kuran që Allahu e udhëzon Profetin ﷺ që të kërkojë më shumë prej - diturisë - e cila tregon se sa shumë dobiprurëse vlerësohet dija dhe se askush, sado i ditur, të përfundojë së kërkuari atë.",
    reflection:
      "Sa nga koha ime e lirë sot shkoi në lëvizje të pafundme dhe a mund të shkonte edhe një pjesë e saj për të mësuar një varg ose një Hadith në vend të kësaj?",
    action:
      "Mësoni përmendësh këtë dua të shkurtër, 'Rabbi zidni ilma' dhe bëjeni zakon ta thoni atë pas sabahut para se të filloni ditën tuaj.",
  },
  {
    translation:
      "Shembulli i atyre që e shpenzojnë pasurinë e tyre në rrugën e Allahut është si fara që mbijnë shtatë kalli…",
    context:
      "Nga sureja el-Bekare. Allahu vizaton një pamje të gjallë të mënyrës se si rritet bamirësia: një farë e vetme që mbin shtatë kallinj, secili me njëqind kokrra - një kthim shtatëqindfish dhe Ai shumëzon edhe më shumë për kë të dojë. Pasuria e dhënë për hir të Tij nuk humbet kurrë.",
    reflection:
      "Kur jap, a bëhet në heshtje për hir të Allahut, apo e gjej veten duke dashur që të tjerët të më vënë re dhe të më lavdërojnë për këtë?",
    action:
      "Jepni një sadaka të vogël sot, dhe nëse mundeni, jepeni fshehurazi - kështu që është thjesht mes jush dhe Allahut.",
  },
];

export const QURAN_GUIDE_APPLY_CHALLENGES_SQ: DeepPartial<QuranGuideApplyChallenge>[] = [
  {
    verseExcerpt: "Dhe thuaju njerëzve fjalë të mira.",
    challenge:
      "Kaloni gjithë ditën pa asnjë fjalë të vetme të ashpër, sarkastike ose tallëse – qoftë edhe me shaka, edhe kur provokoheni.",
    habit:
      "Kur bezdisja rritet, ndaloni para se të përgjigjeni dhe zgjidhni ose heshtje ose një fjalë të mirë.",
  },
  {
    verseExcerpt: "Thuaju besimtarëve të ulin shikimet e tyre...",
    challenge:
      "Uleni qëllimisht shikimin tuaj larg asaj që Allahu e ka ndaluar sot – në ekranin tuaj, ushqimin tuaj dhe në publik.",
    habit: "Sa herë që kapni veten, ridrejtojeni atë moment në pesë minuta Kur'an.",
  },
  {
    verseExcerpt: "Mos u thuaj atyre 'uff'…",
    challenge:
      "Flisni me një prind ose një të moshuar sot me butësi dhe durim të dukshëm, duke mos treguar asnjë gjurmë acarimi - dhe bëni diçka për t'i shërbyer atyre.",
    habit:
      "Nëse ata janë gjallë, angazhohuni për një telefonatë ose vizitë të rregullt; nëse jo, bëni dua për ta.",
  },
  {
    verseExcerpt: "Jini me të vërtetët.",
    challenge:
      "Thuaj të vërtetën gjatë gjithë ditës pa gënjeshtra të bardha, pa ekzagjerime dhe pa thashetheme - madje as me shaka.",
    habit:
      "Nëse rrëshqitni, pendohuni menjëherë dhe rregulloni çfarëdo që kanë prekur fjalët tuaja.",
  },
  {
    verseExcerpt: "Allahu është me durimtarët.",
    challenge:
      "Herën tjetër që diçka ju zhgënjen, mbajeni çdo fjalë të ashpër për plot gjashtëdhjetë sekonda përpara se të përgjigjeni.",
    habit: "Momentet e acarimit i ktheni në dhikër ose dy rekate namaz sa herë të keni mundësi.",
  },
  {
    verseExcerpt: "Nëse jeni mirënjohës, unë do t'ju shtoj.",
    challenge: "Falënderoni tre njerëz të ndryshëm me emër sot për diçka specifike që bënë për ju.",
    habit:
      "Përfundoni çdo natë duke shënuar një bekim - një rresht të vetëm në ditarin tuaj Munib.",
  },
  {
    verseExcerpt: "Kush fal dhe bën pajtim, shpërblimi i tij është te Allahu.",
    challenge:
      "Hiqni dorë nga një mëri që keni mbajtur - lirojini sinqerisht, të paktën brenda zemrës suaj.",
    habit:
      "Bëni një lutje të qetë për personin që ju ka bërë keq në vend që të përsërisni lëndimin.",
  },
];

export const QURAN_GUIDE_TADABBUR_PROMPTS_SQ: DeepPartial<QuranGuideTadabburPrompt>[] = [
  {
    question: "Çfarë më mëson Allahu në këtë ajet?",
    hint: "Lexojeni ajetin ngadalë dhe vini re elementët e tij ndërtues: a është Allahu duke dhënë një urdhër, një paralajmërim, një premtim apo duke treguar një histori? Cilin prej emrave të Tij përdor Ai dhe çfarë zbulon ai emër për mënyrën se si po trajton Ai me ne këtu?",
  },
  {
    question: "Si mund ta zbatoj këtë sot në një veprim konkret?",
    hint: "Rezolucionet e paqarta zbehen; ato specifike rrinë. Kthejeni vargun në një hap të vetëm të mundshëm - një bisedë për të bërë, një zakon për të filluar, një zgjedhje për të bërë para se të mbarojë dita.",
  },
  {
    question: "Çfarë zakoni duhet të përmirësoj apo heq për shkak të këtij vargu?",
    hint: "Sillni ajetin në rutinën tuaj të përditshme - gjumin tuaj, fjalimin tuaj, shpenzimet tuaja, lutjet tuaja, marrëdhëniet tuaja. Cilin e vë gishtin në heshtje ky varg?",
  },
  {
    question:
      "A më shtyn ky ajet drejt shpresës në mëshirën e Allahut apo frikës nga drejtësia e Tij – dhe pse të dyja kanë rëndësi?",
    hint: "Besimtari ecën mes kaufit (frikës nga ndëshkimi i Allahut) dhe rajas (shpresoj në mëshirën e Tij), si dy krahë. Pyete se cilën prej tyre ju forcon ky varg tani dhe nëse zemra juaj ka nevojë për më shumë prej tij.",
  },
  {
    question: "Si e ka jetuar Pejgamberi ﷺ këtë ajet?",
    hint: 'Profeti ﷺ u përshkrua si një "Kur\'an në këmbë". Shihni siretin dhe tefsirin autentik - Ibn Kethiri shpesh citon se si ai e ka mishëruar një varg - dhe merrni shembullin e tij si model praktik.',
  },
  {
    question: "Çfarë duaje frymëzon ky ajet?",
    hint: "Ajeti le të bëhet lutje. Pyesni Allahun, me fjalët tuaja gjatë suxhudit, për çdo gjë që ka nxitur ajeti - mbrojtje nga paralajmërimi, pjesë në një premtim ose ndihmë për t'iu bindur një urdhri.",
  },
];

export const QURAN_GUIDE_READING_LEVELS_SQ: DeepPartial<QuranGuideReadingLevel>[] = [
  {
    title: "Alfabeti arab",
    summary:
      "Mësoni të njihni të gjitha 28 shkronjat në formën e tyre të veçuar dhe njihni secilën me emër. Ky është një njohje e pastër – të shohësh një shkronjë dhe të emërosh në çast tingullin e saj – dhe është themeli mbi të cilin ndërtohet çdo gjë tjetër.",
    topics: ["Emrat e shkronjave", "Format bazë", "Drejtimi nga e djathta në të majtë"],
  },
  {
    title: "Format e shkronjave",
    summary:
      "Zbuloni se shumica e shkronjave ndryshojnë formën në varësi të pozicionit të tyre - fillimi, mesi ose fundi i një fjale - sepse arabishtja është e bashkuar si kursive. Mësoni cilat pak shkronja nuk lidhen kurrë me atë pas tyre.",
    topics: ["Shkrim i lidhur", "Shkronjat jo lidhëse", "Alif, ua, ja variante"],
  },
  {
    title: "Harakat (zanore)",
    summary:
      "Përvetësoni shenjat e vogla që i japin secilës shkronjë zanoren e saj: fatha (a), kasra (i), damma (u), sukun pa zanore, shaddah dyfishimi dhe mbaresat tanween. Këto shenja janë ato që i kthejnë shkronjat e heshtura në fjalë të lexueshme.",
    topics: ["Zanore të shkurtra", "Sukun", "Shaddah dyfishohet", "Tanween"],
  },
  {
    title: "Bashkimi i letrave",
    summary:
      "Bashkojeni së bashku: përzieni shkronjat dhe harakatin e tyre në rrokje dhe fjalë të shkurtra, duke lexuar nga e djathta në të majtë. Njihuni me rregullin e shkronjës së diellit dhe hënës që vendos se si shqiptohet 'al-' në fillim të një fjale.",
    topics: ["Modelet e CV-së", "Parashtesa të zakonshme", "Shkronjat e diellit dhe të hënës"],
  },
  {
    title: "Leximi i fjalëve",
    summary:
      "Filloni të deshifroni fjalorin e vërtetë Kur'anor ngadalë dhe saktë - duke filluar me Bismillah dhe fjalët e el-Fatihas që recitoni në çdo lutje - në mënyrë që leximi të lidhet me adhurimin që në fillim.",
    topics: ["Fjalë me frekuencë të lartë", "Bismilah", "Fjalët El-Fatiha"],
  },
  {
    title: "Leximi i vargjeve",
    summary:
      "Lëvizni lart te ajetet e shkurtra të plota nga Xhuz Amma, duke shtuar ndërgjegjësimin për texhvidin bazë dhe ku të ndaloni për të marrë frymë (vakëf), duke lexuar gjithmonë përkrah një recituesi në mënyrë që veshi juaj të udhëheqë gjuhën tuaj.",
    topics: ["Suret Xhuz Amma", "Shenjat e vakëfit", "Duke ndjekur një recitues"],
  },
  {
    title: "Duke lexuar rrjedhshëm",
    summary:
      "Arrini recitim të qetë dhe të sigurt me rregullat e tejvidit të zbatuara natyrshëm. Mbani një pjesë ditore dhe mbani një mësues ose recitues të kualifikuar që t'ju kontrollojë, pasi rrjedhshmëria lustrohet përmes korrigjimit të vazhdueshëm, nuk arrihet një herë dhe u largua.",
    topics: ["Pjesë ditore", "U zbatuan rregullat e Texhvidit", "Komentet e mësuesit"],
  },
];

export const QURAN_GUIDE_QUIZ_SQ: DeepPartial<QuranGuideQuizQuestion>[] = [
  {
    prompt: "Sa sure (kapituj) ka në Kur'an?",
    options: ["99", "114", "124", "144"],
    explanation:
      "Kur'ani ka 114 sure, duke filluar nga tre ajete deri në 286. Rendi i tyre në mus'haf u fiksua me shpallje (teukifi).",
  },
  {
    prompt: "Në sa pjesë të barabarta (xhuz) është ndarë Kur'ani për lexim ditor?",
    options: ["7", "12", "30", "60"],
    explanation:
      "Tridhjetë xhuza. Recitimi i një xhuzi në ditë plotëson të gjithë Kuranin në një muaj - mënyra klasike për të përfunduar një khatm gjatë Ramazanit.",
  },
  {
    prompt: "Cila është sureja më e gjatë në Kuran, me 286 ajete?",
    options: ["El-Fatiha", "El-Bekare", "Ya-Sin", "En-Nas"],
    explanation:
      "Surja el-Bekare është më e gjata, me 286 ajete. Është një sure Medani e pasur me ligj dhe udhëzim.",
  },
  {
    prompt: "E vërtetë apo e rreme: Një sure mekki është ajo e shpallur para hixhretit në Medine.",
    options: ["E vërtetë", "E rreme"],
    explanation:
      "Suret mekki janë shpallur para hixhrës dhe shpesh fokusohen në besimin dhe teuhidin; Suret Madani erdhën pas dhe shpesh shtojnë ligjin dhe udhëzimet e komunitetit.",
  },
  {
    prompt: "Cila sure përmban ajetet e para që i zbritën Profetit ﷺ në shpellën Hira?",
    options: ["El-Fatiha", "El-Alak (Iqra)", "El-Bekare", "El-Ikhlas"],
    explanation:
      "Shpallja e parë ishin vargjet hyrëse të sures Al-Alak (96): 'Iqra' — Lexo, në emër të Zotit tënd që krijoi.'",
  },
  {
    prompt: "Përafërsisht për sa vite u shpall Kur'ani?",
    options: ["3 vjet", "10 vjet", "23 vjet", "40 vjet"],
    explanation:
      "Kur'ani u shpall gradualisht gjatë rreth 23 viteve - 13 në Mekë dhe 10 në Medine - duke iu përgjigjur ngjarjeve dhe nevojave.",
  },
  {
    prompt:
      "E vërtetë apo e rreme: Kur'ani filloi të shpallej në muajin e Ramazanit, në Natën e Kadrit.",
    options: ["E vërtetë", "E rreme"],
    explanation:
      "Allahu thotë se Kur'ani u zbrit në Ramazan (2:185) në Natën e Kadrit (97:1). Të kërkosh atë natë është një virtyt i madh.",
  },
  {
    prompt: "Cila sure lexohet në çdo rekat të namazit ditor?",
    options: ["El-Ikhlas", "El-Fatiha", "El-Kevther", "En-Nasr"],
    explanation:
      'Surja el-Fatihah - shtatë ajete - lexohet në çdo njësi të namazit. "Nuk ka lutje për atë që nuk e lexon Hapjen e Librit".',
  },
  {
    prompt: "Cila është sureja e vetme që nuk fillon me 'Bismillah ir-Rrahman ir-Rahim'?",
    options: ["El-Fatiha", "Et-Tevbe", "El-Ikhlas", "En-Nas"],
    explanation: "Surja et-Teube (9) është e vetmja sure që nuk hapet me Besmele.",
  },
  {
    prompt: "Në texhvid, çfarë rregullon sundimi i Medit?",
    options: [
      "Bashkimi i dy shkronjave",
      "Shtrirja (zgjatja) e një tingulli zanor",
      "Kërcimi i jehonës në shkronja të caktuara",
      "Ku të ndalet dhe të marrë frymë",
    ],
    explanation:
      "Madd do të thotë shtrirje e një tingulli të zanoreve në shkronjat madd - alif (ا), waw (و) dhe ya (ي) - për një numër të caktuar numërimesh.",
  },
  {
    prompt:
      "Qalqalah është drita që bën jehonë 'kërcim' që i jepet cilit grup shkronjash kur ato mbajnë një sukun?",
    options: ["ي ر م ل و ن", "ق ط ب ج د", "ء ه ع ح غ خ", "ا و ي"],
    explanation:
      "Pesë shkronjat qalqalah janë mbledhur në frazën قُطْبُ جَدٍ — ق ط ب ج د — jepet një rikthim i pastër kur ato mbajnë një sukun.",
  },
  {
    prompt: "Fjala e shpeshtë kur'anore 'Rabb' (رَبّ) do të thotë:",
    options: ["Mëshirë", "Zot, Mjeshtër, Mbajtës", "Libër", "Kopshti"],
    explanation:
      "'Rabb' do të thotë Zot, Zotërues dhe Mbështetës - Ai që krijon, zotëron, ushqen dhe qeveris. 'Rabbana' do të thotë 'Zoti ynë'.",
  },
  {
    prompt: "Fjala 'Xhenet' (جَنَّة) i referohet:",
    options: ["Zjarri", "Kopshti i Parajsës", "Lutja", "agjërimi"],
    explanation:
      "'Xhenet' do të thotë Kopsht - vendbanimi i përjetshëm i shpërblimit, 'kopshte nën të cilët rrjedhin lumenj'.",
  },
  {
    prompt: "Cili profet ngriti themelet e Qabes në Mekë së bashku me djalin e tij Ismailin?",
    options: ["Nuh", "Musa", "Ibrahimi", "Jusufi"],
    explanation:
      'Ibrahimi (Halilullah, miku i Allahut) dhe Ismaili ndërtuan Qaben, duke u lutur "Zoti ynë, pranoje këtë prej nesh" (2:127).',
  },
  {
    prompt:
      "Cili profet i foli drejtpërdrejt Allahut, u përball me Faraonin dhe e udhëhoqi Beni Israilin përtej detit të ndarë?",
    options: ["Isa", "Musa", "Adami", "Junus"],
    explanation:
      "Musai (Kalimullah) foli me Allahun, u dërgua te Faraoni dhe me urdhrin e Allahut deti u nda dhe njerëzit e tij kaluan të sigurt.",
  },
  {
    prompt:
      "Cilën sure ose pasazh të shkurtër do të vendosni për të kuptuar dhe mësuar përmendësh më pas, in shaa Allah?",
    explanation:
      "Hapat e vegjël të qëndrueshëm ndërtojnë një lidhje të përjetshme me Librin e Allahut. Zgjidhni pjesën tuaj, mësoni kuptimin e saj dhe rishikoni shpesh.",
  },
];
