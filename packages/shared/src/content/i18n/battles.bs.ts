// Bosnian translation overlay for the Learn Battles content. Mirrors the order of
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

export const BATTLES_TOPICS_BS: DeepPartial<BattlesTopic>[] = [
  {
    title: "Uvod",
    summary: "Istorijska pozadina, progon, hidžra i kada su borbe bile dozvoljene.",
    body: [
      'Prvih trinaest godina otkrovenja u Mekki, muslimanima je naređeno da strpljivo podnose progon – nikakva dozvola za borbu nije data. Kada su ashabi tražili da se brane, odgovor je bio: "Suzdržite svoje ruke, uspostavite namaz i dajte zekat" (Kur\'an 4:77). Rana zajednica je na ugnjetavanje odgovorila postojanošću, migracijom i molitvom, a ne oružanom pobunom.',
      "Hidžra u Medinu (622. CE / 1. AH) promijenila je situaciju zajednice, a ne njene principe. U Jatribu su muslimani postali staloženo društvo vezano Ustavom Medine — pisanim ugovorom o međusobnoj odbrani i suživotu sa jevrejskim plemenima grada. Poslanik, sallallahu alejhi ve sellem, je sada bio na čelu države koja je mogla biti napadnuta i stoga se mogla zakonito braniti.",
      'Tek tada, nakon godina ugnjetavanja, došlo je do prve dozvole za borbu - a njen navedeni razlog je bio da su vjernici učinjeni nepravdi i protjerani iz svojih domova jer su govorili "Naš Gospodar je Allah" (Kur\'an 22:39-40). Dozvola je bila za odbranu i zaštitu vjerskih sloboda - isti stih navodi sigurnost "manastira, crkava, sinagoga i džamija" kao ono što takve borbe čuvaju - a ne za osvajanje, prisilno preobraćenje ili pljačku.',
      "Kur'an je fiksirao trajnu granicu oko ove dozvole: \"Bori se na Allahovom putu protiv onih koji se bore protiv tebe, ali ne prijestupi\" (Kur'an 2:190). Borbe su bile vezane za agresiju na zajednicu i nikada nisu prelazile granice pravde.",
      "Ove kampanje su istorija: dogodile su se u specifičnom arapskom kontekstu plemenskog ratovanja, prekršenih ugovora i opsade iz sedmog veka. Opća islamska učenja o miru, pravdi, milosti i dobrosusjedstvu su okvir; pojedinosti ovih bitaka moraju se čitati unutar tog okvira, a ne slagati u slogane istrgnute iz njega.",
    ],
    quran: [
      {
        excerpt:
          "Dozvoljava se onima koji se bore jer im je učinjena nepravda - a Allah im je zaista u stanju da ih pobijedi - onima koji su bez prava protjerani iz svojih domova, samo zato što su rekli: Naš Gospodar je Allah. Da Allah nije otjerao neke ljude pomoću drugih, manastiri, crkve, sinagoge i džamije - u kojima se Allahovo ime mnogo spominje - bi sigurno bili srušeni.",
      },
      {
        excerpt:
          "Borite se na Allahovom putu protiv onih koji se bore protiv vas, ali ne prestupite. Zaista, Allah ne voli prestupnike.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Zašto je došlo do bitaka",
    summary: "Progon, kršenje ugovora i odbrana zajednice — ne agresija.",
    body: [
      "Kontekst i uzrok ovih bitaka bila je trajna kampanja neprijateljstva, a ne muslimanski apetit za ratom. U Mekki, Kurejšije su mučili slabe, bojkotirali cijeli klan do ruba gladi, zaplijenili imovinu koju su ostavili emigranti, pa čak su planirali atentat na Poslanika, sallallahu alejhi ve sellem. Migracija u Medinu nije okončala prijetnju; preselio ga je.",
      "Badr (2 AH) je izrastao iz tog neriješenog sukoba. Kada je stigla vijest da se veliki kurejšijski karavan - koji je nosio bogatstvo oduzeto od emigranata - vraća iz Sirije, Poslanik, sallallahu alejhi ve sellem, je krenuo da ga presretne. Karavan je pobjegao, ali Kurejšije su već okupile vojsku od oko hiljadu i svejedno su marširali, odlučni da silom razbiju mladu zajednicu. Rezultat je bila bitka na bunarima u Badru.",
      "U Medini, opstanak je zavisio od sporazuma, a ugovori su stalno kršeni. Frakcije koje su obećale međusobnu odbranu prema gradskom savezu umjesto toga su se uvjerile s neprijateljem - Konfederati koji su opsjedali Medinu kod rova ​​(5. hidžretske) okupljeni su upravo kako bi u potpunosti eliminisali muslimane.",
      "Kršenja ugovora ostala su odlučujuća do kraja. Upravo su Kurejšijevi saveznici koji su napali saveznike muslimana, Banu Khuza'ah, poništili Hudejbijski sporazum i doveli - što je izvanredno - do gotovo beskrvnog otvaranja Mekke, a ne do masakra.",
      "U svemu ovome, ciljevi su bili dosljedni: odbraniti život i vjeru, zaštititi ugrožene i uspostaviti dovoljno sigurnosti da se tevhid može prakticirati bez progona. Cilj nikada nije bio beskonačna ekspanzija zbog samog sebe, a izvori bilježe da je Poslanik, sallallahu alejhi ve sellem, preferirao primirje i sporazum kad god je neprijatelj bio sklon miru.",
    ],
    hadith: [
      {
        excerpt:
          'Naređeno mi je da se borim sa ljudima sve dok oni ne posvjedoče da nema drugog boga osim Allaha i da je Muhammed Allahov poslanik, vršiti namaz i davati zekat. Ako to učine, njihovi životi i imovina su zaštićeni od mene osim po pravu islama, a njihov račun je kod Allaha. — Klasični učenjaci čitaju "narod" kao specifične idolopoklonike u Arabiji koji su tada vodili rat protiv islama nakon što je poruka stigla do njih; to je izjava o tim neprijateljskim borcima, a ne dozvola za napad na mirne nemuslimane ili prisiljavanje na vjerovanje, što Kur\'an 2:256 potpuno zabranjuje.',
      },
    ],
    quran: [
      {
        excerpt: "U religiji nema prisile. Pravi kurs je postao različit od greške.",
      },
    ],
    disclaimer:
      "Gornji hadis se često citira bez svoje postavke. Klasični učenjaci su ga smjestili unutar specifičnih neprijateljstava tog vremena i uz kur'ansku zabranu prisile u vjeri (2:256) i granicu da se bori samo protiv onih koji se bore protiv vas (2:190).",
    appLinks: [{}],
  },
  {
    title: "Etika ratovanja u islamu",
    summary:
      "Bez agresije, stroga zaštita civila i humano ponašanje – utemeljeno na Kur'anu i Sunnetu.",
    body: [
      "Islamsko ratno pravo (siyar) izraslo je direktno iz kur'anskih granica i Poslanikove prakse. Njegov temelj je jedno pravilo koje reguliše sve ostalo: \"Bori se protiv onih koji se bore protiv tebe, ali ne prestupi\" (Kur'an 2:190). Borba je odgovor na agresiju, omeđena pravdom, i mora prestati onog trenutka kada se neprijatelj zaustavi.",
      "Neborci su strogo zaštićeni. Kada je nakon jedne ekspedicije pronađena ubijena žena, Poslanik, sallallahu alejhi ve sellem, je zabranio ubijanje žena i djece. Pravnici su to proširili i na starije, na monahe i bogomolje povučene u svoje ćelije, na radnike na farmama i najamnike i na svakoga ko ne učestvuje u borbama. Njihovo ubijanje nije dozvoljeni eksces – zabranjeno je.",
      "Čak i protiv aktivnih boraca, poenta je bila poziv pred mač. Kada je Poslanik, sallallahu alejhi ve sellem, imenovao komandanta, dao mu je instrukcije da prvo pozove drugu stranu u Islam, a zatim — ako se odbije — na mirovnu nagodbu, i samo da se bori ako su oboje odbijeni, i da nikada ne prekrši vjeru, osakati tijelo ili ubije dijete (Sahih Musliman 1731).",
      'Izdajstvo je kategorički zabranjeno: ugovori se moraju poštovati do svog roka, a neprijatelju se mora dati pošteno upozorenje, a ne izdati. Dozvola na bojnom polju da je "rat prevara" odnosi se samo na taktičku strategiju - finte, iznenađenje, pogrešno usmjerenje - nikada na kršenje saveza ili laganje zaštićene strane.',
      "Imovina i sama zemlja su zaštićeni. Opšte smjernice zabranjivale su bezobzirnu sječu voćaka, spaljivanje usjeva i klanje stoke izvan potrebe. Zarobljenike je trebalo hraniti onako kako su zarobljenici jeli i odijevali kako su se sami oblačili; Kur'an hvali one koji hrane zarobljenike iz ljubavi prema Allahu (76:8), a mnogi su oslobođeni otkupninom, razmjenom ili jednostavnom milošću - neki u Bedru u zamjenu za učenje muslimana da čitaju.",
      "Ovo su normativna učenja religije. Pojedini muslimani kroz historiju koji su ih kršili kršili su Islam, a ne definirali ga – baš kao što kršenja od strane sljedbenika bilo koje vjere ne prepisuju ono što ta vjera nalaže.",
    ],
    quran: [
      {
        excerpt:
          "Borite se na Allahovom putu protiv onih koji se bore protiv vas, ali ne prestupite.",
      },
      {
        excerpt:
          "A ako oni budu skloni miru, onda mu se i ti skloni i osloni se na Allaha. Zaista, On je onaj koji čuje, koji zna.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ibn Omer je prenio da je žena pronađena ubijena u jednoj od ekspedicija Allahovog Poslanika, sallallahu alejhi ve sellem, pa je zabranio ubijanje žena i djece.",
      },
      {
        excerpt:
          "Kada je Poslanik, sallallahu alejhi ve sellem, imenovao komandanta nad vojskom, zapovjedio mu je: Bori se u ime Allaha... ne pronevjeri plijen, ne krši svoj zavjet, ne sakati i ne ubijaj dijete. Kada sretnete neprijatelja, prvo ga pozovite u Islam; ako odbiju, ponudi im mir; samo ako odbiju oboje, onda se bore.",
      },
      {
        excerpt:
          "Nemojte ubiti oronulog starca, ni malo dijete, ni ženu. — Neki lanci ove tačne formulacije ocijenjeni su kao slabi, ali presuda koju ona navodi potvrđena je gore navedenim sahih predanjem i konsenzusom pravnika.",
      },
    ],
    actions: [
      "Jasno pravite razliku između onoga što Islam zapovijeda i onoga što je bilo koja vojska u historiji zapravo radila.",
      "Pročitajte ovaj odjeljak o etici prije bilo kakvog narativa o bitki - historija bez svojih vladajućih principa izaziva nesporazume.",
      "Kada izvor zabilježi čin za koji se čini da je u suprotnosti s ovim pravilima, raspitajte se o njegovom kontekstu i autentičnosti prije nego što donesete zaključke.",
    ],
    appLinks: [{}],
  },
  {
    title: "Bitka kod Badra",
    summary: "17. Ramazan 2. po Hidžri — prva velika bitka, Dan Kriterijuma.",
    body: [
      "Kontekst i uzrok: Nakon hidžre, Kurejšije su zauzeli domove i bogatstvo koje su emigranti ostavili u Mekki i nastavili sa svojim prijetnjama. Kada su vijesti stigle u Medinu da Abu Sufjan vodi bogatu karavan natrag iz Sirije, Poslanik, sallallahu alejhi ve sellem, je krenuo sa laganom silom — otprilike 313 ljudi — očekujući da presretne imovinu, a ne da vodi rat.",
      "Šta se dogodilo: Abu Sufjan je prošao duž obale, ali je već poslao u Mekku po pomoć, a Kurejšije su izašle sa oko hiljadu boraca, konjanika i namirnica, odlučni da budu primjer muslimana. Bitka je postala neizbježna kod bunara Bedra, gdje su - po savjetu al-Hubaba ibn al-Mundhira - muslimani prvi zauzeli vodu, uskrativši je neprijatelju.",
      'Te noći je Poslanik, sallallahu alejhi ve sellem, stajao u molitvi do zore. Suočen sa vojskom koja je tri puta veća od njegove, on je podigao ruke i tako usrdno preklinjao svog Gospodara da mu je ogrtač skliznuo s ramena, govoreći: "O Allahu, ako se uništi ova grupa vjernika, nećeš biti obožavan na Zemlji." Kur\'an bilježi da je Allah odgovorio pojačanjem meleka i bacio mir u srca vjernika.',
      "Nakon borbe između tri šampiona sa svake strane, vojske su se sukobile. Kurejšije su se slomile. Oko sedamdeset njihovih vođa je ubijeno — među njima i Abu Jahl, najžešći progonitelj zajednice — a oko sedamdeset je zarobljeno; četrnaest muslimana je ubijeno. Sa zarobljenicima se postupalo dostojanstveno, a neki su svoju slobodu kupili učeći muslimansku djecu da čitaju i pišu.",
      "Ključne ličnosti: uz Poslanika, sallallahu alejhi ve sellem, stajali su Ebu Bekr, Omer, Ali i njegov stric Hamza; savjet al-Hubaba o bunarima i Sa'da ibn Mu'adha o strategiji pokazuje vodstvo kroz konsultacije čak i kada je pobjeda obećana.",
      "Kur'an ovaj dan naziva yawm al-furqan - Danom kriterija - jer je razlikovao istinu od laži pred cijelim poluostrvom. Njegova trajna pouka je da se iskreni napor i potpuna priprema moraju spojiti s potpunim oslanjanjem na Allaha: vjernici su uredili svoje redove, odabrali svoje tlo i dali dovu, a pobjeda je pripisana Allahu, a ne njihovom broju.",
    ],
    battleDetails: {
      location: "Bunari Bedra, jugozapadno od Medine",
      modernLocation: "U blizini modernog Badra, Saudijska Arabija",
      hijriDate: "17. Ramazana 2. AH",
      muslimForces: "~313 boraca, sa nekoliko konja i deva (izvještaji se malo razlikuju)",
      opposingForces: "~1,000 Kurejšija, bolje naoružanih i jahanih",
      muslimCommander: "Poslanik Muhammed ﷺ",
      opposingCommander: "Amr ibn Hišam (Ebu Džehl), poginuo u borbi",
      weather:
        "Kiša prethodne noći učvrstila je pijesak za muslimane; pristup vodi je bio odlučujući",
      outcome: "Odlučna muslimanska pobjeda",
      keyEvents: [
        "Al-Hubab ibn al-Mundhir savjetovao je prvo kampiranje na bunarima, kontrolirajući vodu.",
        "Poslanik, sallallahu alejhi ve sellem, je molio cijelu noć, moleći Allaha za brojnije vjernike.",
        "Tri kurejšijska prvaka susreli su Hamza, Ali i Ubaydah u pojedinačnoj borbi.",
        "Allah je vjernike ojačao anđelima (Kur'an 8:9) i zbacio ključne vođe Kurejšija.",
        "Oko 70 neprijatelja je ubijeno, a 70 zarobljeno; sa zarobljenicima se postupalo humano.",
      ],
      leadershipLesson:
        "Pripremite se temeljno, konsultujte one koji imaju znanje, a zatim se u potpunosti oslonite na Allaha.",
      spiritualLesson:
        "Mala iskrena grupa sa božanskom podrškom može preokrenuti svjetovne prepreke - pobjeda je od Allaha.",
      facts: [
        "Bedr je imenovan i opisan u Kur'anu više nego bilo koji drugi pojedinačni angažman (sura al-Anfal).",
        "Neki zarobljenici su oslobođeni u zamjenu za podučavanje pismenosti djeci Medine.",
      ],
    },
    quran: [
      {
        excerpt:
          "Kada ste tražili pomoć od svog Gospodara i On vam je odgovorio: Ja ću vas učvrstiti sa hiljadu meleka, koji slijede jedan za drugim.",
      },
      {
        excerpt:
          "Već je postojao znak za vas u dvije vojske koje su se srele - jedna koja se borila na Allahovom putu, a druga protiv nevjernika.",
      },
      {
        excerpt:
          "Vi ih niste ubili, ali ih je ubio Allah. I niste bacili kada ste bacili, nego je Allah bacio.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Omer je prenio da je na dan Bedra Poslanik, sallallahu alejhi ve sellem, pogledao neprijatelja od hiljadu, dok je njegovih ashaba bilo nešto više od tri stotine, a zatim se okrenuo kibli, ispružio ruke i zamolio svog Gospodara: O Allahu, ispuni ono što si mi obećao. O Allahu, ako ova grupa vjernika bude uništena, Ti nećeš biti obožavan na Zemlji. Molio je sve dok mu ogrtač nije pao s ramena, a Ebu Bekr ga je vratio i rekao: Dosta je, o Allahov Poslaniče, Allah će ispuniti ono što ti je obećao.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Bitka kod Uhuda",
    summary: "Shawwal 3 AH — skupa lekcija o poslušnosti, disciplini i postojanosti.",
    body: [
      "Kontekst i uzrok: Godinu dana nakon Bedra, Kurejšije su se vratile da osvete svoje mrtve, sakupivši oko 3.000 boraca - s konjicom koju je predvodio Halid ibn al-Walid, tada još uvijek neprijateljem, i žene koje su tjerale muškarce na bubnjeve i elegije. Muslimani su, oko 700 nakon što su se neki povukli, zauzeli položaj sa planinom Uhud na leđima.",
      'Šta se dogodilo: Poslanik, sallallahu alejhi ve sellem, postavio je pedeset strijelaca na brdo koji su čuvali otvorenu pozadinu vojske i dao im naredbu koju je ponovio radi naglašavanja: "Ne napuštajte ovaj položaj čak i ako vidite da nas otimaju ptice, dok ja ne pošaljem po vas." U početku je plan funkcionirao savršeno - muslimani su otjerali Kurejšije nazad i neprijatelj je počeo bježati.',
      "Videvši kako se neprijatelj raštrka i plen otvoren, većina strelaca je napustila brdo protiv naređenja, sigurni da je bitka dobijena. Khalid ibn al-Walid je iskoristio trenutak, provukao svoju konjicu kroz nebranjeni jaz i udario muslimane s leđa. Red se srušio u haos.",
      'Ključne brojke i cijena: Hamza ibn Abd al-Muttalib, "Allahov lav", je ubijen, zajedno sa sedamdesetak drugova. Sam Poslanik, sallallahu alejhi ve sellem, je bio ranjen – slomljen mu je zub i posječeno na licu – a glasina je pročula polje da je ubijen. Kada su vjernici vidjeli da je živ, okupili su se kod njega na padini planine, a Kurejšije su se, ne mogavši ​​ih dokrajčiti, povukli.',
      'Kur\'an se opširno osvrće na ovaj dan u suri Al Imran, polažući odgovornost na neposlušnost nekih, a ne na neuspjeh u vjeri ili Allahovom obećanju: "Allah je zasigurno ispunio svoje obećanje koje vam je dao... sve dok niste izgubili hrabrost, sporili se oko reda i bili neposlušni nakon što vam je pokazao ono što volite" (3:152). Ipak, isti odlomak tješi ranjenu zajednicu i zabranjuje očaj.',
      "Uhud stoga nije poraz islama, već sačuvana lekcija: pobjeda koja je ranije bila dodijeljena je povučena onog trenutka kada je disciplina slomljena, jasne komande su važne koliko i hrabrost, a iskušenja oplemenjuju zajednicu - za one koji se pokaju i drže čvrsto, nazadovanje postaje klijalište rasta.",
    ],
    battleDetails: {
      location: "Padine planine Uhud, sjeverno od Medine",
      modernLocation: "Uhud, regija Medina, Saudijska Arabija",
      hijriDate: "Shawwal 3 AH",
      muslimForces: "~700 (nakon što su se neki povukli prije bitke)",
      opposingForces: "~3,000 Kurejšija i saveznika, sa konjicom",
      muslimCommander: "Poslanik Muhammed ﷺ",
      opposingCommander: "Abu Sufjan ibn Harb; Khalid ibn al-Walid je predvodio bočnu konjicu",
      outcome: "Kurejšijska taktička prednost na terenu; muslimanska zajednica opstaje netaknuta",
      keyEvents: [
        "Poslanik, sallallahu alejhi ve sellem, postavio je 50 strijelaca na brdu sa strogim naredbama da ga nikada ne napuštaju.",
        "Muslimani su probili neprijateljsku liniju, ali je većina strijelaca napustila svoje položaje da pokupe plijen.",
        "Konjica Halida ibn al-Valida iskoristila je jaz i udarila s leđa.",
        "Hamza i oko 70 drugova su ubijeni; Poslanik, sallallahu alejhi ve sellem, je ranjen.",
        "Širila se lažna glasina o Poslanikovoj smrti; vjernici su se okupili kada su ga vidjeli živog.",
      ],
      leadershipLesson:
        "Jasna naređenja i disciplinovano izvršenje važni su koliko i hrabrost; napuštanje vašeg posta može poništiti pobjedu.",
      spiritualLesson:
        "Kušnje oplemenjuju vjernike; neuspeh koji je naišao na pokajanje i postojanost vodi ka rastu.",
    },
    quran: [
      {
        excerpt:
          "Allah je zasigurno ispunio svoje obećanje vama kada ste ih ubijali uz Njegovu dozvolu - sve dok niste izgubili hrabrost, prepirali se oko naredbe i niste poslušali nakon što vam je pokazao ono što volite.",
      },
      {
        excerpt:
          "Zato nemojte slabiti i ne tugovati, jer ćete biti superiorni ako ste pravi vjernici.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Poslanik, sallallahu alejhi ve sellem, je imenovao Abdullaha ibn Džubejra nad pedeset strijelaca na dan Uhuda i rekao: Držite svoj položaj; čak i ako vidiš da nas otimaju ptice, ne ostavljaj ga dok ja ne pošaljem po tebe — pa čak i ako vidiš da ih pobjeđujemo, ne odlazi dok ja ne pošaljem po tebe. Kada je neprijatelj bio razbijen i strijelci su vidjeli plijen, rekli su: plijen! i napustili su svoje mjesto - pa je nas sedamdeset ubijeno.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Bitka u rovu",
    summary: "Shawwal 5 AH — Konfederati opsjedaju Medinu; razbija ih rov i vjetar.",
    body: [
      "Kontekst i uzrok: Naziva se i Ghazwat al-Ahzab (Bitka Konfederacija), ovo je bio najveći neprijateljski napor da uništi Islam jednom za svagda. Poglavari Banu Nadira, protjerani ranije zbog izdaje, dojahali su do Mekke i Gatafana i okupili koaliciju - Kurejšije, Gatafan i druga plemena - procijenjenu između 10.000 i 24.000 ljudi. Muslimana je bilo oko 3.000, a opasnost je bila egzistencijalna.",
      "Šta se dogodilo: Suočen s opsadom koju nijedan arapski grad nije mogao izdržati u otvorenoj bici, Poslanik, sallallahu alejhi ve sellem, je konsultovao svoje drugove. Salman al-Farisi je predložio perzijsku taktiku nepoznatu arapskom ratovanju - kopanje dubokog rova ​​preko otvorenog sjevernog prilaza, jedine strane koja nije zaklonjena poljima lave, voćnjacima ili utvrđenim kućama. Vjernici su danima kopali u velikoj hladnoći i gladi, a Poslanik, sallallahu alejhi ve sellem, je nosio zemlju na svojim leđima i vezivao kamen za svoj stomak protiv bolova posta.",
      "Rov je radio. Kada je ogromna vojska stigla, nije mogla da pređe; nekoliko konjanika koji su ga preskočili otjerani su nazad. Opsada se pretvorila u otprilike dvije do četiri sedmice hladnoće, napetosti i okršaja, a ne u otvorenu bitku.",
      "Zajednica je testirana do svoje srži. Licemjeri su se opravdavali i pokušavali da izmaknu; pleme Banu Qurayzah unutar grada pokolebalo se prema neprijatelju; Kur'an opisuje srca koja dopiru do grla. Ipak, vjernici su se držali, a Nu'aym ibn Mas'ud - novi musliman u tajnosti - sijao je nepovjerenje između konfederativnih frakcija sve dok se nisu okrenule jedni protiv drugih.",
      "Tada je olakšanje došlo od Allaha, a ne od mačeva. Žestoki, ledeni vjetar razdirao je neprijateljski logor, prevrnuo vatre i šatore, a nevidljive vojske ispunile su ih užasom. Koalicija, koja je već raskomadana i nema dovoljno zaliha, raspala se i povukla u noći. Poslije je Poslanik, sallallahu alejhi ve sellem, rekao da je samo Allah pobijedio Konfederate.",
      "Trajne lekcije: razuman savet treba usvojiti odakle god da dolazi — ovde od perzijskog obraćenika; sredstva moraju biti dovedena do krajnjih granica - iskopani rov, održani redovi; a onda se ishod povjerava Allahu, koji može vratiti vojsku vjetrom. Sura al-Ahzab čuva cijelo suđenje i njegovo olakšanje.",
    ],
    battleDetails: {
      location: "Sjeverni prilazi Medini",
      modernLocation: "Medina, Saudijska Arabija",
      hijriDate: "Shawwal 5 AH",
      muslimForces: "~3,000",
      opposingForces: "Koalicija Konfederacije (~10.000–24.000; brojke se razlikuju u izvorima)",
      muslimCommander: "Poslanik Muhammed ﷺ",
      opposingCommander: "Abu Sufyan predvodi Kurejšije; saveznički poglavice Ghatafana i drugi",
      weather: "Oštra hladnoća tokom kopanja; siloviti božanski vetar je okončao opsadu",
      outcome: "Muslimanska pobjeda bez otvorene bitke; koalicija se raspada",
      keyEvents: [
        "Salman al-Farisi je predložio kopanje rova ​​preko ranjivog sjevernog koridora.",
        "Poslanik, sallallahu alejhi ve sellem, je dijelio posao, noseći zemlju i vezivajući kamen protiv gladi.",
        "Rov je zaustavio ogromnu vojsku, nametnuvši opsadu umjesto otvorene bitke.",
        "Nu'aym ibn Mas'ud je posijao razdor koji je podijelio savezničke saveznike.",
        "Smrznuti vjetar i nevidljive vojske (Kur'an 33:9) razbili su neprijateljski logor; povukli su se.",
      ],
      leadershipLesson:
        "Opširno se konsultujte i usvajajte dobre ideje bez obzira na njihovo poreklo; podijelite sami nevolje zajednice.",
      spiritualLesson:
        "Držite se čvrsto pod opsadom i povjerite rezultat Allahu, koji može vratiti vojsku vjetrom.",
    },
    quran: [
      {
        excerpt:
          "O vjernici, sjetite se blagodati Allahove prema vama kada su vam došle vojske i Mi smo na njih poslali vjetar i vojske koje niste vidjeli... Tu su vjernici bili iskušeni i potreseni od jakog potresa.",
      },
      {
        excerpt:
          "A kada su vjernici vidjeli Konfederate, rekli su: To je ono što su nam Allah i Njegov Poslanik obećali - i to ih je samo povećalo u vjeri i pokornosti.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Poslanik, sallallahu alejhi ve sellem, molio je Konfederate na dan el-Ahzaba, govoreći: O Allahu, objavitelju Knjige, Brzi u obračunu - porazi Konfederate. O Allahu, porazi ih i potresi ih.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Banu Qurayzah",
    summary: "5 AH — ugovor izdat tokom opsade; presuda dogovorenog arbitra.",
    body: [
      "Kontekst i uzrok: Banu Qurayzah su bili jevrejsko pleme u Medini vezano za muslimane sporazumom o međusobnoj odbrani grada. Na vrhuncu rova, kada su Konfederati opkolili Medinu i kada je opstanak zajednice visio o koncu, poglavica Banu Nadira uvjerio je vođe Kurejze da pokidaju taj zavjet i otvore drugi front unutar grada. U tom trenutku, ovo nije bio privatni spor, već izdaja tokom opsade koja je mogla uništiti sve u Medini.",
      "Šta se dogodilo: Nakon što su se Konfederati povukli, Poslanik, sallallahu alejhi ve sellem, je krenuo protiv Benu Kurejze, koji se zatvorio u svoje tvrđave. Opsada je trajala oko dvadeset pet dana dok nisu pristali da se predaju - ali su tražili da o njihovoj sudbini ne odlučuje direktno Poslanik, a.s., već arbitar kojeg su sami izabrali: Sa'd ibn Mu'adh, poglavica Awsa, njihovih dugogodišnjih saveznika.",
      "Presuda: Sa'd — koji je i sam umro od rane zadobivene u rovu — presudio je da borci koji su počinili izdaju budu pogubljeni, a žene i djeca odvedeni kao zarobljenici, što je bila stroga presuda po svim standardima, ali u skladu s ratnim zakonom tog vremena i mjesta za izdaju pod opsadom. Poslanik, sallallahu alejhi ve sellem, je rekao da je Sa'd presudio u skladu s Allahovom presudom.",
      "Kako to pažljivo pročitati: Ovo je bila kazna za konkretan čin ratne izdaje od strane boraca koji su prekršili odbrambeni pakt u najugroženijem trenutku zajednice - a ne presuda protiv naroda zbog njihove vjere, i naglašeno nije obrazac za to kako se muslimani ponašaju prema Jevrejima ili bilo kojoj vjerskoj zajednici. Kur'an i Sunnet nalažu pravdu i dobar tretman prema miroljubivim nemuslimanima (Kur'an 60:8), a druga jevrejska plemena i pojedinci u Medini koji su držali vjeru nikada nisu bili povrijeđeni. Mejnstrim učenjaci ovo tretiraju kao ograničenu istorijsku epizodu zakona o izdaji, a neki kasniji naučnici su čak doveli u pitanje detalje o prenošenim brojevima.",
      "Kur'an se trezveno odnosi na ovu epizodu u suri al-Ahzab kao posljedicu rata Konfederacija, bez trijumfa. Trajna lekcija je ozbiljnost kršenja saveza - izdaja povjerenja u trenutku zajedničke opasnosti nosi najveću težinu - postavljena pored principa da čak i neprijatelj ima pravo na presudu dogovorenog i nepristrasnog arbitra, a ne na nekontroliranu osvetu.",
    ],
    battleDetails: {
      location: "Tvrđave Banu Qurayzah, na rubu Medine",
      modernLocation: "Medina, Saudijska Arabija",
      hijriDate: "Dhul-Qa'dah 5 hidžretskih dana (ubrzo nakon rova)",
      muslimForces: "Vojska Medinana, odmah nakon opsade rova",
      opposingForces: "Banu Qurayzah, utvrđeni unutar svojih uporišta",
      muslimCommander: "Poslanik Muhammed ﷺ",
      outcome: "Predaja nakon opsade; presuda koju je doneo plemenski izabrani arbitar",
      keyEvents: [
        "Banu Qurayzah je prekršio zavjet Medine tokom opsade Konfederacije.",
        "Nakon što su se Konfederati povukli, Muslimani su opsjedali svoje utvrde oko 25 dana.",
        "Pleme je tražilo da mu sudi Sa'd ibn Mu'adh, poglavica njihovih dugogodišnjih saveznika Aws.",
        "Sa'd je vladao po ratnom zakonu doba za izdaju pod opsadom; Poslanik, sallallahu alejhi ve sellem, je potvrdio presudu.",
      ],
      leadershipLesson:
        "Čak i protiv neprijatelja, dozvolite presudu dogovorenom, nepristrasnom arbitru, a ne nekontrolisanu osvetu.",
      spiritualLesson:
        "Kršenje saveza o uzajamnoj zaštiti u trenutku zajedničke opasnosti spada među najteže izdaje.",
    },
    quran: [
      {
        excerpt:
          "I spustio je one od Naroda Svetog pisma koji su ih podržavali iz njihovih tvrđava i bacio teror u njihova srca - stranku koju ste ubili i stranku koju ste zarobili. I učinio je da naslijedite njihovu zemlju i njihove domove.",
      },
      {
        excerpt:
          "Allah vam ne brani od onih koji se ne bore protiv vas zbog vjere i koji vas ne protjeruju iz vaših domova - da budete pravedni prema njima i da se prema njima ponašate pravedno. Zaista, Allah voli one koji postupaju pravedno.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kada je Banu Qurayzah pristao da prihvati presudu Sa'da ibn Muaza, Poslanik, sallallahu alejhi ve sellem, je poslao po njega. On je došao, a Poslanik, sallallahu alejhi ve sellem, je rekao: Zauzmite se za svog poglavara. Sa'd je presudio da njihovi borci budu ubijeni, a njihove žene i djeca zarobljeni. Poslanik, sallallahu alejhi ve sellem, je rekao: Vi ste presudili Allahovom presudom — ili je rekao, presudom kralja.",
      },
    ],
    disclaimer:
      "Ovo je bila kazna za konkretan čin ratne izdaje od strane boraca, ocjenjivan od strane arbitra kojeg je pleme odabralo. To nije presuda protiv bilo kojeg naroda zbog njihove vjere i nije model za odnose sa Jevrejima ili bilo kojom vjerskom zajednicom, prema kojima Islam nalaže da se postupa s pravdom i dobrotom (Kur'an 60:8). Neki kasniji naučnici doveli su u pitanje detalje o prenošenim brojevima.",
  },
  {
    title: "Ugovor iz Hudaybiyyah",
    summary: "6 AH — primirje koje je izgledalo kao nazadovanje i postalo čista pobeda.",
    body: [
      "Kontekst i uzrok: 6. hidžretske godine Poslanik, sallallahu alejhi ve sellem, je krenuo sa oko 1400 drugova — nenaoružanih, ali za putničke mačeve — s namjerom samo da obave manje hodočašće (umru) u Ka'bu, a ne da se bore. Kurejšije, ne želeći da budu viđeni da puštaju muslimane u Mekku, blokirali su put na mjestu zvanom Hudaybiyyah na svetoj granici.",
      "Zakletva Ridwana: Kada je do logora stigla glasina da su Kurejšije ubili Poslanikovog izaslanika Osmana ibn Affana, Poslanik, sallallahu alejhi ve sellem, je pozvao ashabe da se založe ispod drveta bagrema da neće pobjeći. Oko 1400 je dalo tu zakletvu - Bay'at al-Ridwan, zakletvu božanskog zadovoljstva - a Kur'an je kasnije objavio: \"Allah je bio zadovoljan vjernicima kada su ti se zakleli na vjernost pod drvetom\" (48:18). Pokazalo se da je Osman živ, a Kurejšije su, uznemireni prikazanom odlučnošću, poslani da pregovaraju.",
      "Šta se dogodilo: Uslovi primirja izgledali su ponižavajuće. Muslimani bi se ove godine vratili bez umre i mogli bi se vratiti tek sljedeće. Postojao bi desetogodišnji mir. Svako ko bježi od Kurejšija muslimanima bi bio vraćen, ali ne i obrnuto - klauzula koja je bolna. Kada je musliman u lancima, Abu Džandal, vučen nazad pred njihovim očima pod upravom ove klauzule, ashabi su bili skoro slomljeni; Omer je to otvoreno doveo u pitanje i nježno ga je podsjetio da vjeruje Allahovom Poslaniku.",
      'Zašto je to bila pobjeda: Po prvi put su se Kurejšije u pisanom sporazumu pozabavili muslimanima kao ravnopravnom silom. Desetogodišnji mir otvorio je puteve; Islam se brzo i mirno širio tokom primirja — više je ušlo u Islam u te dvije godine nego u svim godinama prije. Oslobođen s fronta Kurejšija, Poslanik, sallallahu alejhi ve sellem, mogao se obratiti Hajberu i slati pisma pozivajući kraljeve i plemena u Islam. Na povratku je objavljena sura el-Fat, koja počinje sa: "Zaista, Mi smo vam dali očitu pobjedu."',
      "Trajne lekcije: Ovo je vrhunski primjer strpljenja nad impulsima i povjerenja u Allaha i Njegovog Poslanika kada mudrost odluke još nije vidljiva. Ono što su ashabi prvo osjetili kao poraz, Kur'an je nazvao čistu pobjedu — i za dvije godine otvorio je put za samu Mekku. Spremnost da se prihvati tvrdi mir, poštuje ugovor i čeka se ovdje pokazuje kao oblik snage, a ne slabosti.",
    ],
    battleDetails: {
      location: "Hudaybiyyah, na svetoj granici u blizini Mekke",
      modernLocation: "Al-Shumaisi, blizu Meke, Saudijska Arabija",
      hijriDate: "Zul-Ka'da 6. AH",
      muslimForces: "~1400 hodočasnika, neopremljenih za rat",
      opposingForces: "Kurejšije, blokiraju put za Mekku",
      muslimCommander: "Poslanik Muhammed ﷺ",
      outcome: "Desetogodišnje primirje; nema tuča; kasnije u Kur'anu nazvan očitom pobjedom",
      keyEvents: [
        "Muslimani su krenuli u umru, a ne u bitku, i zaustavljeni su kod Hudejbije.",
        "Na lažnom izvještaju o Osmanovoj smrti, ~1.400 je dalo zakletvu Ridwana ispod drveta.",
        "Potpisano je desetogodišnje primirje pod uslovima koje su pratioci smatrali gorkim (klauzula o povratku, Abu Jandal).",
        "Islam se brzo širio tokom mira; Sura al-Fath nazvala je sporazum očiglednom pobjedom.",
      ],
      leadershipLesson:
        "Prihvatite tvrdi mir i ispoštujte ga; mudar ustupak danas može otvoriti veća vrata sutra.",
      spiritualLesson:
        "Vjerujte Allahu i Njegovom Poslaniku kada je mudrost odluke skrivena - strpljenje može biti najistinska pobjeda.",
    },
    quran: [
      {
        excerpt:
          "Zaista, Mi smo vam dali očiglednu pobjedu, da vam Allah oprosti ono što je prethodilo vašem grijehu i ono što će uslijediti, da upotpuni svoju naklonost prema vama i uputi vas na pravi put.",
      },
      {
        excerpt:
          "Zaista je Allah bio zadovoljan vjernicima kada su ti se zakleli na vjernost pod drvetom, i znao je šta je u njihovim srcima, pa je spustio mir na njih i nagradio ih neminovnim osvajanjem.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Džabir ibn Abdullah je rekao: Na dan al-Hudejbije bilo nas je četrnaest stotina. Zakleli smo se na vjernost Poslaniku, sallallahu alejhi ve sellem, ispod drveta, a on je bio najbolji od ljudi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ekspedicija Hajbara",
    summary: "7 AH — utvrđena uporišta koja su podržavala Konfederate su pokorena.",
    body: [
      "Kontekst i uzrok: Khaybar je bio lanac plodnih tvrđava oaza sjeverno od Medine, dom plemena koja su ranije protjerana zbog izdaje - uključujući poglavice Banu Nadira koji su organizirali koaliciju Konfederacije kod Rovova. Odatle su nastavili okupljati neprijatelje protiv Medine. Sa kurejšijskim frontom zamrznutim od Hudejbije, Poslanik, sallallahu alejhi ve sellem, je krenuo da neutrališe ovu preostalu bazu neprijateljstva.",
      'Šta se dogodilo: Muslimani — oko 1.600 — napredovali su prema tvrđavama jedan po jedan. Kampanja je bila teška i dugotrajna nekoliko sedmica. Jednog teškog dana Poslanik, sallallahu alejhi ve sellem, je rekao: "Sutra ću dati barjak čovjeku koji voli Allaha i Njegovog Poslanika, i koga vole Allah i Njegov Poslanik, kroz čije ruke će Allah dati pobjedu." Sljedećeg jutra pozvao je Alija ibn Ebi Taliba — koji je patio od bolnih očiju — molio se nad njim dok nije ozdravio i dao mu zastavu; ključna tvrđava je pala.',
      "Naselje: Kada su zauzeta uporišta, stanovnici nisu protjerani. Oni su tražili da ostanu i nastave da obrađuju zemlju, dajući muslimanima dio proizvoda, a Poslanik, sallallahu alejhi ve sellem, je pristao. Ovaj aranžman – pokoreni farmeri zadržani na svojoj zemlji pod paktom o podjeli proizvoda – postao je rani presedan proučavan u kasnijem islamskom pravu o ugovorima i oporezivanju.",
      "Ključne figure: kampanja se pamti prije svega po Alijevoj ulozi i po etici oličenoj u baner hadisu - da je vodstvo povjereno na osnovu iskrenosti i ljubavi prema Allahu, a ne samo na rangu ili snazi.",
      "Napomena o brizi: Khaybar je ponekad uvučen u mnogo kasnije političke kontroverze. Ovdje je to strogo opisano kao ekspedicija iz sedmog vijeka zabilježena u klasičnoj seri - odgovor na aktivnu neprijateljsku bazu, koja nije završena masovnim protjerivanjem, već dogovorom.",
    ],
    battleDetails: {
      location: "Oaza Khaybar, sjeverno od Medine",
      modernLocation: "Khaybar, Saudijska Arabija",
      hijriDate: "Muharem-Safar 7. hidžretske godine",
      muslimForces: "Oko 1.600",
      opposingForces: "Utvrđeni garnizoni preko nekoliko utvrda",
      muslimCommander: "Poslanik Muhammed ﷺ; Ali ibn Abi Talib je predvodio odlučujući napad",
      outcome: "muslimanska kontrola tvrđava; dogovoreno nagodbu o podjeli proizvoda",
      keyEvents: [
        "Utvrde su se smanjivale jedna po jedna tokom nekoliko sedmica opsade.",
        "Zastavu je dobio Ali, čije je Poslanik, sallallahu alejhi ve sellem, izliječio svojom molitvom.",
        "Šampion Marhab je savladan i ključna tvrđava je pala.",
        "Stanovnici su ostali na svojoj zemlji kao kultivatori prema paktu o podjeli proizvoda.",
      ],
      leadershipLesson:
        "Povjerite odgovornost onima koji su najprikladniji — i onima čija su srca iskrena prema Allahu.",
      spiritualLesson:
        "Upornost kroz dugotrajne teškoće, spojena sa iskrenošću, donosi Allahovu pomoć.",
    },
    hadith: [
      {
        excerpt:
          "Na dan Hajbera Poslanik, sallallahu alejhi ve sellem, je rekao: „Sutra ću dati ovu zastavu čovjeku koji voli Allaha i Njegovog Poslanika, i koga vole Allah i Njegov Poslanik, i kroz čije ruke će Allah dati pobjedu. Sutradan je pozvao Alija, koji je imao bolne oči; pljunuo mu je u oči i molio se za njega, a Ali se izliječio kao da nikada nije bio bolestan, i dobio je zastavu.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Bitka kod Mu'taha",
    summary: "Jumada al-Ula 8 AH — granična ekspedicija u kojoj su tri komandanta redom ubijena.",
    body: [
      "Kontekst i uzrok: Poslanik, sallallahu alejhi ve sellem, je poslao izaslanika prema sjeveru orijentisanom prema Vizantiji, a izaslanik je ubijen – teška povreda, budući da su izaslanici bili zaštićeni zakonom naroda. Kao odgovor poslao je vojsku od oko 3.000 ljudi prema Mu'tahu, blizu rimske granice istočno od Jordana.",
      "Lanac komandovanja: Prije nego što su krenuli, Poslanik, sallallahu alejhi ve sellem, je imenovao liniju sukcesije - Zayd ibn Harithah da vodi, a ako padne, Ja'far ibn Ebi Talib, a ako padne, Abdullah ibn Rawahah - upečatljiv čin predviđanja koji će se pokazati odlučujućim.",
      "Šta se dogodilo: Muslimani su na Mu'tahu susreli znatno veću silu Vizantinaca i savezničkih arapskih plemena - izvori govore o desetinama hiljada, iako su brojke nesigurne i vjerovatno pretjerane. Zejd je pao, zatim Džafer — koga se pamti po tome što je držao zastavu sve dok mu obje ruke nisu bile odsječene — zatim Abdullah ibn Rawahah, tačno onim redom koji je Poslanik, sallallahu alejhi ve sellem, postavio.",
      "Povlačenje: Pošto su sva tri imenovana komandanta ubijena, ashabi su dali zastavu Halidu ibn al-Validu, novom muslimanu nakon Hudejbije. Serijom manevara i premještaja on je oslobodio brojčano nadmoćnu vojsku i vratio je kući uglavnom netaknutu – podvig koji je Poslanik, sallallahu alejhi ve sellem, počastio, a kasnije je Halida nazvao „mačem među Allahovim mačevima“. U Medini je Poslanik, sallallahu alejhi ve sellem, plakao za Zejdom, Džaferom i Ibn Ravahom i rekao je o njihovom mučeništvom prije nego što je stigao bilo koji glasnik.",
      "Trajne lekcije: imenovanje nasljednika prije opasnosti — kontinuitet vodstva — bukvalno je spasio vojsku; a disciplinovano povlačenje koje čuva živote nije sramota već mudrost. Mučeništvo na Allahovom putu je čast, a ne politički neuspjeh, a bitka je muslimane upoznala i sa Halidovim darovima, koji su se ubrzo u potpunosti okrenuli služenju vjere.",
    ],
    battleDetails: {
      location: "Mu'tah, istočno od rijeke Jordan",
      modernLocation: "Blizu Karaka, Jordan",
      hijriDate: "Jumada al-Ula 8 AH",
      muslimForces: "~3,000",
      opposingForces:
        "Vizantijske i savezničke arapske snage (daleko veće; brojevi nisu sigurni u izvorima)",
      muslimCommander:
        "Zejd ibn Harithah, zatim Džafer, zatim Ibn Rawahah, zatim Khalid ibn al-Walid",
      outcome: "Uredno muslimansko povlačenje; teško mučeništvo, ali je vojska sačuvana",
      keyEvents: [
        "Poslanik, sallallahu alejhi ve sellem, je imenovao tri komandanta po redoslijedu prije polaska.",
        "Sva trojica su pala redom kod Mu'taha, tačno kako je i predviđeno.",
        "Khalid ibn al-Walid je preuzeo komandu i odveo vojsku na sigurno.",
        "Poslanik, sallallahu alejhi ve sellem, je plakao u Medini i najavio šehide prije nego što su vijesti stigle.",
      ],
      leadershipLesson:
        "Imenujte nasljednike prije nego što nastupi opasnost — jasan kontinuitet vodstva spašava živote.",
      spiritualLesson:
        "Mučeništvo na Allahovom putu je čast; mudro povlačenje koje spašava vojsku nije poraz.",
    },
    appLinks: [{}],
  },
  {
    title: "Osvajanje Mekke",
    summary: "Ramazan 8. po Hidžri — gotovo bezkrvno otvaranje Mekke pod općom amnestijom.",
    body: [
      "Kontekst i uzrok: Sporazum iz Hudejbije važio je sve dok Kurejšijevi saveznici, Banu Bekr, nisu napali saveznike muslimana, Banu Khuza'ah - ubivši neke čak i unutar svetog područja - dok su Kurejšije tajno snabdijevali oružjem. Ovo je srušilo primirje. Kada je Kurejšijev vlastiti pokušaj da ga zakrpi propao, put do Mekke bio je otvoren.",
      "Šta se dogodilo: Poslanik, sallallahu alejhi ve sellem, je marširao sa oko 10.000 drugova, krećući se tako brzo i tajno da Kurejšije nisu imale vremena da organiziraju otpor. Abu Sufjan, stari komandant Kurejšija, izašao je i primio Islam uoči ulaska. Vojska je ušla u Mekku iz nekoliko pravaca bez gotovo nikakvih borbi — samo je jedna kolona naišla na kratak oružani otpor; Poslanik, sallallahu alejhi ve sellem, je izričito naredio svojim zapovjednicima da se ne bore osim protiv onih koji su se borili protiv njih.",
      "Amnestija: Ovo je trenutak koji definiše osvajanje. Stojeći kod Kabe sa gradom koji ga je mučio, bojkotovao i protjerao sada na njegovu milost, Poslanik, sallallahu alejhi ve sellem, upitao je Kurejšije šta očekuju od njega, a zatim je rekao – ponavljajući riječi proroka Jusufa upućene braći koja su mu nanijela nepravdu – „Nemate krivice danas. Idite, jer vi ste slobodni.“ Opšta amnestija je obuhvatila stanovništvo; samo je mali broj izuzetih za određene zločine, a čak je i većina njih pomilovana kada su došli kod njega.",
      'Čišćenje: Poslanik, sallallahu alejhi ve sellem, je očistio Kabu od njenih 360 idola, recitirajući: "Istina je došla i laž je nestala" (Kur\'an 17:81). Bilal ibn Rabah, jednom mučen kao rob u tom gradu, popeo se na Ka\'bu i pozvao ezan nad Mekkom. Sura an-Nasr - "Kada dođe Allahova pobjeda i osvajanje" - označava ovo otvaranje i njegovo mnoštvo ulazak u vjeru.',
      "Trajne lekcije: ovo je jedna od najvećih demonstracija proročkog karaktera koja se ispoljava u moći. Velikodušnost u pobjedi osvojila je više srca nego što bi bilo koja kazna mogla imati; cilj je cijelo vrijeme bio vodstvo, a ne osveta, a moć je stvorena da služi poruci, a ne sebi. Prikladno se zove Fath Meka - Otvaranje - a ne otpuštanje.",
    ],
    battleDetails: {
      location: "Mekka",
      modernLocation: "Meka, Saudijska Arabija",
      hijriDate: "Ramazana 8. po Hidžri",
      muslimForces: "~10.000",
      opposingForces: "Kurejšije (predao se gotovo bez borbe)",
      muslimCommander: "Poslanik Muhammed ﷺ",
      outcome: "Meka je otvorena gotovo bez krvoprolića; proglašena opšta amnestija",
      keyEvents: [
        "Primirje je prekinuto kada su Kurejšije podržale napad na muslimanske saveznike, Khuza'ah.",
        "Abu Sufjan je prihvatio Islam prije ulaska vojske; njegova kuća je proglašena sigurnim mjestom.",
        "Poslanik, sallallahu alejhi ve sellem, je dao opštu amnestiju: Nemate krivicu danas – idite, slobodni ste.",
        "Ka'ba je očišćena od svojih idola; Bilal je pozvao ezan sa vrha.",
        "Bivši neprijatelji su prihvatili Islam u velikom broju.",
      ],
      leadershipLesson: "Velikodušnost u pobjedi osvaja srca mnogo trajnije od straha ili osvete.",
      spiritualLesson:
        "Cilj je bilo vodstvo, a ne osveta - moć je stvorena da služi poruci, a ne sebi.",
    },
    quran: [
      {
        excerpt:
          "Kada dođe Allahova pobjeda i osvajanje, i kada vidite ljude kako u mnoštvu ulaze u Allahovu vjeru, tada se uzvisite hvalom svoga Gospodara i tražite od Njega oprost. Zaista, On uvijek Prihvata pokajanje.",
      },
      {
        excerpt:
          "Rekao je: Danas nemate krivicu. Neka ti Allah oprosti, a On je najmilostiviji od milostivih. — riječi poslanika Jusufa da je Poslanik, sallallahu alejhi ve sellem, odjeknuo Kurejšijama na dan osvajanja.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Bitka kod Hunayna",
    summary:
      "Shawwal 8 AH — zasjeda nakon Mekke; samopouzdanje testirano, a onda pobjeda priznata.",
    body: [
      "Kontekst i uzrok: Jedva dvije sedmice nakon otvaranja Mekke, moćna plemena Hawazin i Thaqif okupila su se da udare muslimane prije nego što se njihova nova dominacija smiri. Poslanik, sallallahu alejhi ve sellem, je krenuo sa velikom vojskom — nekih 12.000, uključujući mnoge nedavne mekanske obraćenike — najvećom muslimanskom snagom koja se do sada okupila. U njegovoj veličini, neki od muškaraca osjećali su nepoznato samopouzdanje, a navodi se da je neko primijetio da ne mogu biti poraženi zbog nedostatka brojeva.",
      "Šta se dogodilo: Neprijatelj je postavio zasedu u uskoj dolini Hunayn. Dok su muslimani silazili u polumraku zore, na njih je pala oluja strijela sa visina i avangarda se slomila. Panika se proširila i veliki deo velike vojske se okrenuo i pobegao - brojevi koji su ulivali poverenje sada su nosili poraz.",
      'Prekretnica: U haosu Poslanik, sallallahu alejhi ve sellem, nije pobjegao. Pritisnuo je svoju mazgu naprijed prema neprijatelju, povikavši naglas: "Ja sam Poslanik, ovo nije laž; ja sam sin Abd al-Muttaliba." Jezgro Muhadžiruna i Ensarija — sa Abasom koji je ashabe zvao po imenu — okupilo se oko njega. Muslimani su se ponovo formirali, okrenuli protiv zasjede i razbili ih; odvedeni su zarobljenici i veliki plijen.',
      "Posljedice: Kampanja se nastavila do opsade Ta'ifa, koja nije pala odmah. Kasnije, kada su Havazini došli da traže svoje ljude, Poslanik, sallallahu alejhi ve sellem, je vratio zarobljenike - birajući pomirenje i omekšavanje srca umjesto čuvanja plijena, i velikodušno dajući prednost novim mekanskim preobraćenicima da ih veže za vjeru.",
      'Kur\'an se direktno osvrće na ovaj dan, navodeći opasnost oslanjanja na brojeve: "a na dan Hunejna, kada su vam vaši brojni bili zadovoljni, ali vam ništa nisu koristili... tada je Allah spustio svoj mir" (9:25-26). Trajna lekcija je jasna - nikada se ne oslanjajte na brojke, bogatstvo ili nedavni uspjeh; pobjeda je samo Allahov dar — i dvostruka vrlina vođe koji stoji čvrsto i vidljivo kada njegovi sljedbenici paniče.',
    ],
    battleDetails: {
      location: "Dolina Hunayn, između Mekke i Ta'ifa",
      modernLocation: "Blizu Ta'ifa, Saudijska Arabija",
      hijriDate: "Shawwal 8 AH",
      muslimForces: "~12.000 (uključujući mnoge nove mekanske preobraćenike)",
      opposingForces: "Hawazin i Thaqif",
      muslimCommander: "Poslanik Muhammed ﷺ",
      outcome: "Muslimanska pobjeda nakon prvog poraza",
      keyEvents: [
        "Najveća muslimanska vojska do sada je stvorila povjerenje u svoju brojnost prije bitke.",
        "Zasjeda u zoru u dolini raspršila je prethodnicu i izazvala široku paniku.",
        "Poslanik, sallallahu alejhi ve sellem, je stajao čvrsto i pozvao vjernike nazad; jezgro se okupilo oko njega.",
        "Muslimani su ponovo formirali i razbili neprijatelja; uslijedila je opsada Ta'ifa.",
        "Zarobljenici su kasnije vraćeni kao gest pomirenja.",
      ],
      leadershipLesson:
        "Vođa mora biti vidljiv i postojan kada sljedbenici paniče – prisustvo okuplja redove.",
      spiritualLesson:
        "Nikada se ne oslanjajte na brojke ili nedavni uspjeh; pobjeda i spokoj dolaze samo od Allaha.",
    },
    quran: [
      {
        excerpt:
          "Allah vam je već dao pobjedu u mnogim krajevima - i na dan Hunejna, kada vam je vaš veliki broj bio zadovoljan, ali vam ništa nije koristilo, i Zemlja se, uprkos svom prostranstvu, zatvorila za vas, a vi ste se vratili u povlačenju. Zatim je Allah spustio svoj mir na Svoga Poslanika i na vjernike.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Al-Bara ibn Aziba su pitali da li su pobjegli na dan Hunejna. Rekao je: Ali Allahov Poslanik, sallallahu alejhi ve sellem, nije pobjegao. Ljudi su se vratili, a Poslanik, sallallahu alejhi ve sellem, je bio na svojoj bijeloj mazgi, i govorio je: Ja sam Poslanik, to nije laž; Ja sam sin Abd al-Muttaliba.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ekspedicija na Tabuku",
    summary: "Radžab 9 AH — najteži marš, po ljetnim vrućinama, ispitujući vjeru bez bitke.",
    body: [
      'Kontekst i uzrok: Do Medine su stigli izvještaji o velikoj vizantijskoj mobilizaciji na sjevernoj granici. Poslanik, sallallahu alejhi ve sellem, je pozvao na pohod na Tabuk — i, neobično, imenovao je odredište otvoreno, a ne skrivajući ga, jer će marš biti tako dug i tako težak da su se svi trebali pošteno pripremiti. Pao je na žestokoj vrućini velikog ljeta, u vrijeme žetve, kada su putovanja i troškovi bili najopterećeniji - postala je poznata kao "ekspedicija teškoća".',
      "Test žrtve: Poziv je razotkrio srca zajednice. Osman je opremio veliki dio vojske iz vlastitog bogatstva; Abu Bekr je dao sve što je posjedovao; Omer je dao pola svog. Najsiromašniji drugovi koji nisu imali šta da daju plakali su jer nisu mogli učestvovati - Kur'an bilježi njihove suze (9:92). Protiv njih su stajali licemjeri, koji su izmišljali izgovore da ostanu i koje sura at-Tawbah naširoko razotkriva.",
      "Šta se dogodilo: Vojska — najveća koju je Poslanik, sallallahu alejhi ve sellem, ikada vodio, možda 30.000 — stigla je do Tabuka nakon napornog marša. Činilo se da nijedna vizantijska sila nije vodila bitku. Umjesto praznog rezultata, ekspedicija je osigurala sporazume sa pograničnim plemenima i vladarima sjevera, povećala sigurnost zajednice i pokazala spremnost koja je sama odvraćala agresiju.",
      "Trojica koja su ostala: Među onima koji su ostali bila su tri iskrena vjernika — Ka'b ibn Malik, Hilal ibn Umayyah i Murarah ibn Rabi' — koji nisu imali valjanog opravdanja i, što je najvažnije, odbili su lagati o tome. Bili su bojkotovani pedeset dana, zemlja \"velika kakva je bila\" zatvarala im se, sve dok njihovo pokajanje nije prihvaćeno i Kur'an im nije objavio oprost (9:118). Njihova iskrenost na suđenju jedna je od najdirljivijih epizoda u serah.",
      "Trajne lekcije: spremnost da se brani zajednica je sama po sebi čin vjere čak i kada mač nije izvučen; žrtva bez trenutne, vidljive nagrade je među najvišim testovima; a istinoljubivost - Ka'bovo odbijanje da se spasi laži - je Allahu draža od udobne laži. Sura at-Tawbah uokviruje cijelu ekspediciju oko ovih tema.",
    ],
    battleDetails: {
      location: "Tabuk, na putu prema vizantijskoj granici",
      modernLocation: "Tabuk, Saudijska Arabija",
      hijriDate: "Radžab 9 AH",
      muslimForces:
        "~30.000 (najveća vojska koju je predvodio Poslanik, sallallahu alejhi ve sellem)",
      opposingForces: "Prijavljene su vizantijske snage, ali se nisu pojavile u bitci",
      muslimCommander: "Poslanik Muhammed ﷺ",
      weather: "Ekstremne ljetne vrućine, u vrijeme berbe",
      outcome: "Nema bitke; osigurani sjeverni ugovori; zajednica testirana i prosijana",
      keyEvents: [
        "Poslanik, sallallahu alejhi ve sellem, je otvoreno imenovao udaljenu destinaciju zbog teškoće marša.",
        "Osman, Ebu Bekr, Omer i drugi su velikodušno davali; najsiromašniji su plakali jer nemaju šta da daju.",
        "Licemjeri su se opravdavali da ostanu i bili su razotkriveni u suri at-Tawbah.",
        "Nema angažovanog neprijatelja; bili su osigurani ugovori sa sjevernim plemenima i vladarima.",
        "Trojica istinitih vjernika bojkotirana su 50 dana dok njihovo pokajanje nije prihvaćeno (Kur'an 9:118).",
      ],
      leadershipLesson:
        "Budite iskreni o teškoćama i njihovim troškovima; transparentnost gradi povjerenje i sprema one koji su spremni.",
      spiritualLesson:
        "Žrtvovanje bez vidljive nagrade i istinitost pod kušnjom su među najvišim testovima vjere.",
    },
    quran: [
      {
        excerpt:
          "Oni koji su ostali radovali su se što su ostali iza Allahovog Poslanika i nisu voljeli da se bore svojim imecima i svojim životima na Allahovom putu, pa su govorili: Ne izlazite po vrućini. Reci: Džehennemska vatra je jača u vrućini, samo kad bi mogli razumjeti.",
      },
      {
        excerpt:
          "I oprostio je trojici koja su ostavljena, sve dok se zemlja, ogromna kakva je bila, nije zatvorila za njih, i njihove vlastite duše se zatvorile u njih, i oni su bili sigurni da nema utočišta od Allaha osim u Njega. Zatim im se obratio u milosti da bi se mogli pokajati.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ka'b ibn Malik je ispričao kako je ostao sa Tabuka bez opravdanja i nije htio lagati o tome; Poslanik, sallallahu alejhi ve sellem, naredio je vjernicima da ne razgovaraju s njim i njegovom dvojicom drugova pedeset noći, sve dok im zemlja ne postane tijesna - tada je došlo otkrivenje njihovog oprosta, i to je bio jedan od najsretnijih dana u njegovom životu.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ghazawat i Saraya",
    summary: "Razlika između velikih kampanja i manjih odreda.",
    body: [
      "Gazva je ekspedicija u kojoj je Poslanik, sallallahu alejhi ve sellem, lično učestvovao - učenjaci broje oko dvadeset sedam, uključujući Bedr, Uhud, Jarak, Hudejbiju, Hajbar, osvajanje Mekke, Hunejna i Tabuka.",
      "Sarija (množina saraya) je odred poslat pod imenovanim komandantom, a da se Poslanik, sallallahu alejhi ve sellem, nije pridružio - zabilježeno je otprilike pedeset takvih misija, za izviđanje, odgovor na napade, pratnju ili pozivanje plemena u Islam.",
      "Mnoge saraje nisu uključivale nikakve borbe - bile su to diplomatija, patrola ili demonstracija snage koja je borbu činila nepotrebnom. Drugi, poput ekspedicije na Mu'tah, uključivali su ozbiljne borbe i teške gubitke.",
      "Razumijevanje ove razlike štiti od preuveličavanja broja 'bitki' u ranom islamu. Tokom otprilike jedne decenije, stvarne borbe su bile rijetke; većina marševa je bila preventivna, diplomatska ili beskrvna, a izvori mjere cijeli proročanski period kao izuzetno lak gubitak života za njegovu eru.",
    ],
    actions: [
      "Pregledajte vremensku liniju kako biste vidjeli koji događaji su bili borbeni, koji su bili opsade, a koji su bili marševi bez borbi.",
      "Pročitajte unose u pojmovniku za gazvu i sariju da bi kategorije bile jasne.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Bitke nakon Poslanika sallallahu alejhi ve sellem",
    summary: "Veliki angažmani pod ispravno vođenim kalifima - različiti od proročke ere.",
    body: [
      "Nakon što je Poslanik, sallallahu alejhi ve sellem, preminuo 11. po Hidžri (632. n.e.), zajednicu su vodili halife Ebu Bekr, Omer, Osman i Ali ra kroz Ridda (otpadničke) ratove, širenje u Sasanidsku Perziju i Vizantijsku Siriju, i na kraju unutarnju fitnu.",
      "Ovi događaji pripadaju islamskoj historiji, ali oni nisu sunnet na način na koji su sami Poslanikovi postupci. Njih treba proučavati pomoću alata istorije i sa svjesnošću da sami muslimanski učenjaci raspravljaju o njihovim detaljima, motivima i poukama.",
      "Bitka kod al-Kadisije (oko 636. CE): Sa'd ibn Abi Waqqas predvodio je muslimanske snage protiv sasanidske vojske u Iraku - prekretnica koja je otvorila Perziju.",
      "Bitka kod Yarmouka (636. n.e.): komandanti uključujući Khalida ibn al-Walida susreli su se sa Vizantijcima u Siriji u odlučujućoj kampanji koja je okončala veliku bizantsku moć na Levantu - proučavana kao vojna historija, a ne kao proročki sunnet.",
      "Bitka kod Nahavanda (oko 642. ne): zapamćena u arapskim izvorima kao 'Pobjeda pobjeda', slomila je preostali otpor Sasanida. Datumi i brojke trupa razlikuju se od istoričara.",
    ],
    actions: [
      "Prvo proučite proročke bitke — one su primarna moralna i pravna referenca.",
      "Pristupite kasnijim osvajanjima sa nijansama; niti veličati rat niti spljoštivati ​​složenu istoriju u slogane.",
    ],
    disclaimer:
      "Brojevi, motivi i moralne ocjene postproročkih osvajanja raspravljaju se među historičarima. Ovaj pregled služi za orijentaciju, a ne za polemiku.",
  },
  {
    title: "Lekcije o liderstvu",
    summary: "Strpljenje, šura, milost i povjerenje u Allaha - ne puka taktika.",
    body: [
      "Proročki model vođenja u sukobu karakter stavlja iznad pameti. Glavne odluke su donesene kroz konsultacije (šura) - bunari u Badru, rov u opsadi Konfederacije, uslovi u Hudaybiyyah - čak i tamo gdje bi otkrivenje kasnije potvrdilo ishod. Rukovodstvo je slušalo prije nego što je djelovalo.",
      "Strpljenje je oblikovalo luk svake pobjede. Teški Hudejbijin mir doveo je, u roku od dvije godine, do otvaranja Mekke. Milost u Mekki — „Idi, slobodan si“ — osvojila je upravo one koji su progonili zajednicu. Gorka disciplina naučena na Uhudu spriječila je ponavljanje te katastrofe.",
      "Hrabrost je bila pokazana koliko na maču, tako i na njemu: čvrsto i vidljivo kada je vojska pobjegla kod Hunayna; nošenje zemlje u rovu uz kopače; i — najteže od svega — oprostiti u času potpune moći onima koji su te jednom otjerali iz tvoje kuće.",
      "Pouzdanje u Allaha (tawakkul) nikada nije značilo zanemarivanje sredstava. Poslani su izviđači, birano je tlo, nošeni su oklopi, kopani su rovovi, imenovani nasljednici i poštovani ugovori. Vjernici su učinili sve što je bilo u njihovoj moći, a zatim su rezultat povjerili Allahu - taj spoj punog truda i punog oslanjanja je srce modela.",
    ],
    actions: [
      "Prije teške odluke, pitajte: da li sam se zaista konsultovao sa onima koji znaju?",
      "Nakon uspjeha, pitajte: pokazujem li milost ili se ona pretvorila u ponos?",
      "U neuspjehu, pitajte: postoji li neposlušnost koju treba ispraviti, ili lekcija koju Allah želi da naučim?",
    ],
    appLinks: [{}],
  },
  {
    title: "Autentični hadis o bitkama",
    summary: "Odabrane naracije sa ocjenjivanjem — o ponašanju, strpljenju i ključnim događajima.",
    body: [
      "Vjerodostojnost hadisa o ekspedicijama mora se provjeriti prije nego što se na njih osloni. Naracije u nastavku su izvučene iz Sahih zbirki i tiču ​​se ponašanja i duha ovih kampanja; svaka nosi svoju ocjenu.",
      "Za naracije vezane za određeni angažman, pogledajte sopstvenu temu te bitke. Koristite Munibov pretraživač hadisa da pročitate pune lance i ocjenjivanje u kontekstu.",
    ],
    hadith: [
      {
        excerpt:
          "Ne zeli da se sretnes s neprijateljem, i zamoli Allaha za sigurnost. Ali kada ih sretnete, budite strpljivi i znajte da je raj pod sjenom mačeva.",
      },
      {
        excerpt:
          "Poslanik, sallallahu alejhi ve sellem, je rekao: Rat je prevara. — Naučnici ovo objašnjavaju kao dozvolu za taktičke strategije u borbi (finte, iznenađenje, pogrešno usmjerenje), nikada kao dozvolu za kršenje sporazuma ili izdaju zaštićene strane.",
      },
      {
        excerpt:
          "Kada je imenovao komandanta, Poslanik, sallallahu alejhi ve sellem, mu je zadužio da se boji Allaha, da poziva neprijatelja u Islam prije borbe, da ne krši zavjet, da ne sakati i ne ubija dijete.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Reference i izvori",
    summary: "Klasična serah djela i kako ih kritički čitati.",
    body: [
      "Primarni izvori sera uključuju Ibn Ishakovu Sirah (sačuvan preko Ibn Hišama), al-Waqidijev Buku al-Maghazi, Ibn Sa'dov Tabaqat i Ibn Kathirov al-Bidayah wan-Nihayah. Svaki od njih ima svoje prednosti i svoja naučna upozorenja.",
      "Ibn Ishaq (preko Ibn Hišama) je temeljni narativ; al-Waqidi daje bogate bitne detalje, ali neke od njegovih izvještaja osporavaju kritičari hadisa; Ibn Kathir sintetizira historiju s kritikom hadisa i oprezan je sa ocjenjivanjem.",
      "Kur'anski odlomci o ovim događajima su najmjerodavniji tekstovi od svih. Što se tiče pitanja ponašanja, zakona i etike, sahih hadis al-Buharija i Muslima ima prednost nad neprovjerenim serah izvještajima.",
      "Tamo gdje se istoričari razlikuju - oko tačnih veličina vojske, nekih datuma i moralne procjene određenih post-proročanskih kampanja - ovaj modul bilježi nesigurnost, a ne izmišljanje preciznosti. Svaki ovdje citirani hadis provjeren je u odnosu na zbirke za njegov broj i ocjenu.",
    ],
    actions: [
      "Unakrsno provjerite svaki detalj bitke u odnosu na Kur'an, zatim sahih hadis, a zatim seriju.",
      "Za bilo koje pitanje fetve ili savremene primjene, konsultujte kvalifikovane naučnike — ovaj modul je edukativan, a ne presuda.",
    ],
    appLinks: [{}, {}],
  },
];

export const BATTLES_VERSES_BS: DeepPartial<BattlesVerse>[] = [
  {
    excerpt:
      "Dozvoljava se onima koji se bore jer im je učinjena nepravda... Da Allah nije kontrolirao jedan skup ljudi drugim, manastiri, crkve, sinagoge i džamije bi bili uništeni.",
    context: "Prva opšta dozvola za borbu — nakon godina nenaoružanog progona u Mekki.",
  },
  {
    excerpt:
      "Borite se na Allahovom putu protiv onih koji se bore protiv vas, ali ne prestupite. Zaista, Allah ne voli prestupnike.",
    context: "Temeljna granica: samo odbrana, sa strogom zabranom prekoračenja granica.",
  },
  {
    excerpt:
      "Kada ste zamolili svog Gospodara za pomoć, On je odgovorio: Ja ću vas učvrstiti sa hiljadu meleka, red po red.",
    context: "Otkriveno u vezi sa Badrom — božanskom pomoći brojnim vjernicima.",
  },
  {
    excerpt:
      "Za vas je već bio znak u dvije vojske koje su se srele - jedna koja se bori na Allahovom putu i druga od nevjernika, vidjevši ih očima dvostruko od njih.",
    context: "Allah je učinio da se muslimani čine veći neprijatelju na Bedru, ojačavajući srca.",
  },
  {
    excerpt:
      "Allah je sigurno ispunio svoje obećanje vama kada ste ih ubijali po Njegovoj dozvoli, sve dok niste izgubili hrabrost i počeli raspravljati o naredbi i prekršili se nakon što vam je pokazao ono što volite.",
    context: "Obrađuje neposlušnost strijelaca i prekretnicu na Uhudu.",
  },
  {
    excerpt:
      "O vjernici, sjetite se Allahove blagodati prema vama kada su vam došle vojske i Mi smo na njih poslali vjetar i vojske koje niste vidjeli.",
    context: "Sura al-Ahzab o opsadi Konfederacije i božanskoj pomoći.",
  },
  {
    excerpt:
      "I spustio je one od Naroda Svetog pisma koji su ih podržavali iz njihovih tvrđava i bacio teror u njihova srca - stranku koju ste ubili i stranku koju ste zarobili. I učinio je da naslijedite njihovu zemlju i njihove domove.",
    context:
      "Sura al-Ahzab o Banu Kurejzi, koji je prekršio savez tokom opsade - ograničena epizoda ratne izdaje, a ne presuda protiv vjere.",
  },
  {
    excerpt:
      "Zaista, Mi smo vam dali očiglednu pobjedu, da vam Allah oprosti ono što je prethodilo vašem grijehu i ono što će uslijediti, da upotpuni svoju naklonost prema vama i uputi vas na pravi put.",
    context:
      "Otkriveno po povratku iz Hudejbije - navodeći kao očitu pobjedu ono što su drugovi prvo osjetili kao gorak kompromis.",
  },
  {
    excerpt:
      "Zaista je Allah bio zadovoljan vjernicima kada su ti se zakleli na vjernost pod drvetom, i znao je šta je u njihovim srcima, pa je spustio mir na njih i nagradio ih neminovnim osvajanjem.",
    context:
      "Zakletva Ridwana — oko 1.400 drugova se zaklelo pod bagremovim drvetom da neće bježati, i Allah je izjavio da je zadovoljan njima.",
  },
  {
    excerpt:
      "Kada dođe Allahova pobjeda i osvajanje, i kada vidite ljude kako u mnoštvu ulaze u Allahovu vjeru, tada se uzvisite hvalom svoga Gospodara i tražite od Njega oprost. Zaista, On uvijek Prihvata pokajanje.",
    context:
      "Sura an-Nasr o otvaranju Mekke — osvajanje krunisano ne trijumfom, već pohvalama, traženjem oprosta i ulaskom mnoštva u vjeru.",
  },
  {
    excerpt:
      "Allah vam je već dao pobjedu u mnogim krajevima... Zatim je Allah spustio svoj mir na Svoga Poslanika i na vjernike.",
    context: "Allah podsjeća vjernike da je pobjeda Njegov dar, a ne rezultat hvalisanja brojem.",
  },
  {
    excerpt:
      "Oni koji su ostali bili su sretni što su ostali iza Allahovog Poslanika i nisu voljeli da se bore sa svojim bogatstvom i životima na Allahovom putu.",
    context: "Sura at-Tawbah se obraća onima koji su se izvinili od teškog tabučkog marša.",
  },
];

export const BATTLES_TIMELINE_BS: DeepPartial<BattlesTimelineEvent>[] = [
  {
    title: "Prvo otkrivenje",
    body: "Poslanik, sallallahu alejhi ve sellem, prima prve ajete sure al-'Alaq u pećini Hira. Godinama poziv je miran - bez dozvole za borbu.",
    location: "Mekka",
  },
  {
    title: "Javni poziv i progon",
    body: "Otvoreno propovijedanje donosi mučenje, bojkot i mučeništvo. Muslimani izdržavaju bez oružane odmazde - strpljenje i migracija su odgovori kojima se podučava.",
    location: "Mekka",
  },
  {
    title: "Hidžra u Medinu",
    body: "Muslimanska zajednica uspostavlja državnu vlast u Jatribu (Madina). Ugovori sa jevrejskim plemenima i ustav Medine postavljaju pravila za suživot.",
    location: "Medina",
  },
  {
    title: "Bitka kod Badra",
    body: "17. Ramazana, oko 313 muslimana porazilo je mnogo veću vojsku Kurejšija - prva velika bitka i odlučujuća moralna pobjeda.",
    location: "Badr",
  },
  {
    title: "Bitka kod Uhuda",
    body: "Muslimani se u početku osvajaju, ali strijelci koji napuštaju svoje mjesto dovode do bolnog nazadovanja. Kur'an se bavi poukama tog dana.",
    location: "Mount Uhud",
  },
  {
    title: "Bitka u rovu",
    body: "Vojska konfederacije opsjeda Medinu. Kopanje rova ​​- Salmanov prijedlog - prekida opsadu bez započete bitke.",
    location: "Medina",
  },
  {
    title: "Banu Qurayzah",
    body: "Nakon što su prekršili zavjet Medine tokom opsade, Banu Qurayzah se predao i zatražio da im sudi arbitar po njihovom vlastitom izboru, Sa'd ibn Mu'adh.",
    location: "Medina",
  },
  {
    title: "Ugovor iz Hudaybiyyah",
    body: "Desetogodišnje primirje koje je izgledalo kao ustupak postalo je, prema riječima Kur'ana, očigledna pobjeda - zakletva Ridwana je data ispod drveta, obraćenja su se proširila i put za Mekku se otvorio.",
    location: "Hudaybiyyah",
  },
  {
    title: "Bitka kod Mu'taha",
    body: "Ekspedicija na rimsku granicu; tri imenovana komandanta su uzastopno ubijeni prije nego što Khalid ibn al-Walid bezbedno povuče vojsku.",
    location: "Mu'tah",
  },
  {
    title: "Ekspedicija Hajbara",
    body: "Jevrejske tvrđave sjeverno od Medine koje su gajile neprijateljstvo su pokorene. Ali ibn Ebi Talib dobija zastavu nakon što se sudi Abu Bekru i Omeru.",
    location: "Khaybar",
  },
  {
    title: "Osvajanje Mekke",
    body: "Kurejšije krše sporazum; Poslanik, sallallahu alejhi ve sellem, maršira sa deset hiljada drugova i ulazi u Mekku gotovo bez krvoprolića - proglašena je opća amnestija.",
    location: "Mekka",
  },
  {
    title: "Bitka kod Hunayna",
    body: "Hawazin i Thaqif upadaju u zasjedu muslimanima nakon Mekke. Prva panika ustupi mjesto pobjedi kada Poslanik, sallallahu alejhi ve sellem, pozove vjernike da se okupe oko njega.",
    location: "Uznemiravanje",
  },
  {
    title: "Ekspedicija na Tabuku",
    body: "Težak ljetni pohod prema rimskoj granici. Ne dolazi do bitke, ali je licemjerje razotkriveno i Sura at-Tawbah se obraća onima koji su ostali.",
    location: "Tabuk",
  },
  {
    title: "Oproštajno hodočašće",
    body: "Poslanik, sallallahu alejhi ve sellem, obavlja hadž i drži oproštajnu hutbu. Ubrzo nakon toga umire u Medini — završava se era proročkih bitaka.",
    location: "Mekka",
  },
];

export const BATTLES_FIGURES_BS: DeepPartial<BattlesFigure>[] = [
  {
    name: "Abu Bekr al-Siddiq",
    epithet: "Neka je Allah zadovoljan njime",
    summary: "Poslanikov najbliži pratilac, prvi odrasli vjernik i njegov pratilac na Hidžri.",
    role: "Savjetnik, borac i zastavnik u ranim kampanjama.",
    lesson:
      "Čvrsta lojalnost i istinoljubivost pod pritiskom - potrošio je svoje bogatstvo da oslobodi progonjene muslimane prije bilo kakve pobjede.",
  },
  {
    name: "Omer ibn al-Hattab",
    epithet: "Neka je Allah zadovoljan njime",
    summary: "Ušao je u Islam u godinama progona i postao jedan od najjačih branitelja vjere.",
    role: "Borac i kasnije arhitekta pravde kao drugi kalif.",
    lesson:
      "Hrabrost u kombinaciji s odgovornošću - javno je prihvatio savjet kada se njegovo mišljenje razlikovalo od Poslanikovog na Hudejbiji.",
  },
  {
    name: "Ali ibn Ebi Talib",
    epithet: "Neka je Allah zadovoljan njime",
    summary:
      "Rođak i zet Poslanika, sallallahu alejhi ve sellem; među prvom djecom koja su prihvatila Islam.",
    role: "Šampion u pojedinačnoj borbi i nosilac zastave kod Khaybara.",
    lesson:
      "Hrabrost sa poniznošću - spavao je u Poslanikovom krevetu u noći Hidžre, rizikujući svoj život kako bi se misija nastavila.",
  },
  {
    name: "Hamza ibn Abd al-Muttalib",
    epithet: "Neka je Allah zadovoljan njime",
    summary: "Poslanikov stric, poznat kao Asadullah (Allahov lav) nakon što je prihvatio Islam.",
    role: "Elitni ratnik i vođa morala na Bedru i Uhudu.",
    lesson:
      "Mučeništvo nije poraz – njegova smrt na Uhudu duboko je ožalostila Poslanika, ali ipak ojačala odlučnost da završi misiju.",
  },
  {
    name: "Khalid ibn al-Walid",
    epithet: "Neka je Allah zadovoljan njime",
    summary:
      "Sjajni general Kurejšija koji je prihvatio Islam nakon Hudejbije i postao Saifullah (Allahov mač).",
    role: "Predvodio je bočnu konjicu protiv muslimana kod Uhuda prije njegovog islama; kasnije preuzeo komandu u Mu'tahu i bio odlučujući u kalifskim pohodima.",
    lesson:
      "Prošlo suprotstavljanje nije prepreka iskrenom pokajanju - sama vještina koja je pogodila muslimane na Uhudu bila je, kada je vjera ušla u njegovo srce, u potpunosti preusmjerena na Allahovu stvar.",
  },
  {
    name: "Sa'd ibn Abi Waqqas",
    epithet: "Neka je Allah zadovoljan njime",
    summary: "Jedan od deset obećanih raja; poznati strijelac zajednice.",
    role: "Archer na Uhudu; kasnije je vodio muslimanske vojske u al-Kadisiji pod kalifom Omerom.",
    lesson:
      "Disciplina u nečijoj ulozi — streljaštvo je definisalo njegovu službu; kasnije je tu preciznost prenio u vodstvo jedne nacije.",
  },
  {
    name: "Salman al-Farisi",
    epithet: "Neka je Allah zadovoljan njime",
    summary:
      "Tragač iz Perzije koji se pridružio muslimanima u Medini nakon dugog duhovnog putovanja.",
    role: "Predloženo kopanje rova ​​- perzijska taktika nepoznata Arapima.",
    lesson:
      "Mudrost može doći iz bilo koje sredine - šura znači čuti stručnost gdje god je Allah postavi.",
  },
  {
    name: "Zejd ibn Haritha",
    epithet: "Neka je Allah zadovoljan njime",
    summary:
      "Poslanikov oslobođeni čovjek i voljeni drug, i prvi komandant postavljen nad muslimanskom vojskom.",
    role: "Predvodio je ekspediciju u Mu'tah; poginuo tamo kao prvi od trojice imenovanih komandanata koji su pali.",
    lesson: "Zasluge nad lozom - izabran je da vodi kada su prisutni ljudi višeg plemenskog ranga.",
  },
  {
    name: "Sa'd ibn Mu'adh",
    epithet: "Neka je Allah zadovoljan njime",
    summary: "Šef Awsa Medine, jedan od najranijih i najcjenjenijih ensarija.",
    role: "Ranjen u rovu; odabrao je Banu Qurayzah za arbitra njihove sudbine.",
    lesson:
      "Pravda preko dogovorenog sudije — čak i poraženom neprijatelju je dozvoljen nepristrasni arbitar, a ne nekontrolisana osveta; ubrzo je preminuo od rane.",
  },
];

export const BATTLES_LESSON_CARDS_BS: DeepPartial<BattlesLessonCard>[] = [
  {
    battleTitle: "Bitka kod Badra",
    lesson: "Vjerujte Allahu dok se potpuno pripremate.",
    detail:
      "Otprilike brojčano veći od tri prema jedan, muslimani su i dalje birali svoje tlo na bunarima, poređali svoje redove i činili dovu – Poslanik, sallallahu alejhi ve sellem, preklinjao Allaha kroz noć dok mu ogrtač nije pao. Napor i oslanjanje zajedno, a pobjeda je pripisana Allahu.",
  },
  {
    battleTitle: "Bitka kod Uhuda",
    lesson: "Poslušnost naredbi štiti zajednicu.",
    detail:
      "Strijelci koji su napustili svoje mjesto tražeći plijen otvorili su bok koji je skoro uništio vojsku. Kur'an ovo bilježi kao lekciju za svaku generaciju o disciplini.",
  },
  {
    battleTitle: "Bitka u rovu",
    lesson: "Planiranje i konsultacije umnožavaju snagu.",
    detail:
      "Salmanova ideja o rovu, u kombinaciji sa Poslanikovom šurom i radom vjernika, neutralizirala je koaliciju daleko veću od branitelja.",
  },
  {
    battleTitle: "Ugovor iz Hudaybiyyah",
    lesson: "Strpljenje može biti najiskrenija pobjeda.",
    detail:
      "Drugovi su primirje osjetili kao poniženje, a Omer ga je otvoreno doveo u pitanje; Sura al-Fath je odgovorila nazvavši to očitom pobjedom. Desetogodišnji mir je otvorio puteve, Islam se širio brže nego ikad, a za dvije godine otvoren je put za Mekku.",
  },
  {
    battleTitle: "Banu Qurayzah",
    lesson: "Kršenje saveza zaštite spada među najteže izdaje.",
    detail:
      "Banu Kurejza je pokidao zavet Medine u trenutku kada su Konfederati opkolili grad. Čak i tako, Poslanik, sallallahu alejhi ve sellem, dozvolio im je da im sudi arbitar kojeg su sami izabrali – pravda preko dogovorenog sudije, a ne neprovjerena osveta.",
  },
  {
    battleTitle: "Osvajanje Mekke",
    lesson: "Milost nakon pobjede uzdiže osvajača.",
    detail:
      "Sa gradom koji ga je mučio i protjerao sada na njegovu milost, Poslanik, sallallahu alejhi ve sellem, ponovio je riječi proroka Jusufa: 'Nemate krivice danas - idite, slobodni ste.' Opšta amnestija zamenila je osvetu, i osvojena su srca koja nijedna kazna nije mogla dobiti.",
  },
  {
    battleTitle: "Bitka kod Hunayna",
    lesson: "Brojevi i nedavni uspjeh ne garantuju pobjedu.",
    detail:
      "Ponos na veličinu vojske nakon Mekke doprinio je početnoj panici. Vjernici su se pregrupisali tek kada su se vratili Poslaniku, sallallahu alejhi ve sellem, i Allahu.",
  },
  {
    battleTitle: "Ekspedicija na Tabuku",
    lesson: "Žrtvovanje u teškoćama razotkriva pravu vjeru.",
    detail:
      "Marš se odigrao u velikoj vrućini protiv strašnog neprijatelja. Podjednako su hvaljeni i oni koji su dali svoje bogatstvo i oni koji su marširali uprkos siromaštvu.",
  },
  {
    battleTitle: "Bitka kod Mu'taha",
    lesson: "Sukcesija rukovodstva se mora planirati.",
    detail:
      "Poslanik, sallallahu alejhi ve sellem, je imenovao tri komandanta po redoslijedu. Kada su sva trojica pala, Halid je reorganizovao povlačenje - spasavanje vojske je samo po sebi bila pobeda.",
  },
];

export const BATTLES_GLOSSARY_BS: DeepPartial<BattlesGlossaryTerm>[] = [
  {
    term: "Ghazwah",
    definition:
      "Vojna ekspedicija u kojoj je učestvovao i sam Poslanik, sallallahu alejhi ve sellem. Primjeri uključuju Badr, Uhud i Tabuk.",
  },
  {
    term: "Sariyyah",
    definition:
      "Odred poslat pod zapovjedništvom, a da se Poslanik, a.s., nije pridružio maršu. Desetine su se pojavile radi izviđanja, diplomatije ili odgovora na racije.",
  },
  {
    term: "Emigranti",
    definition:
      "Iseljenici koji su napustili Mekku za Medinu radi Allaha. Oni su činili jezgro rane muslimanske zajednice uz Ensarije.",
  },
  {
    term: "Ansar",
    definition:
      "Pomagači — muslimani Medine koji su ugostili muhadžirune, dijelili svoje bogatstvo i branili grad u njegovim ranim godinama.",
  },
  {
    term: "Shura",
    definition:
      "Međusobne konsultacije prije važnih odluka. Strategija rova ​​i pripreme za Uhud ilustruju konsultacije u proročkom modelu.",
  },
  {
    term: "Bay'ah",
    definition:
      "Zakletva vjernosti — politička i duhovna poslušnost vođi. Zavjeti al-Aqabe su prethodili hidžri.",
  },
  {
    term: "Hidžra",
    definition:
      "Iseljavanje radi Allaha - iz Mekke u Medinu u proročkom kontekstu. Ovom migracijom počinje 1. hidžretska godina.",
  },
  {
    term: "Ameer",
    definition:
      "Zapovjednik ili vođa određen za vojsku ili ekspediciju. Poslanik, sallallahu alejhi ve sellem, je imenovao vođe za saraje i imenovao nasljednike ako padnu.",
  },
  {
    term: "Rayah",
    definition:
      "Standard ili barjak koji se nosi na čelu vojske. Nošenje Poslanikovog barjaka bilo je znak časti i odgovornosti.",
  },
  {
    term: "Smrt",
    definition:
      "Veći vojni standard, ponekad različit od ličnog rayah. Vođstvo liwa je označavalo komandu nad velikom snagom.",
  },
  {
    term: "Jihad",
    definition:
      "Težnja ka Allahovom cilju — prvenstveno borbi duše, iu njenom uređenom vojnom obliku, odbrani i otklanjanju agresije kada je određeno.",
  },
  {
    term: "Fee sabilillah",
    definition:
      "Na Allahovom putu - namjera koja razlikuje legitimnu borbu od plemenske osvete ili svjetovnog osvajanja.",
  },
  {
    term: "Aman",
    definition:
      "Sigurnost ili sigurno ponašanje dodijeljeno izaslanicima, trgovcima ili neborcima. Kršenje amana je zabranjeno islamskim ratnim pravom.",
  },
  {
    term: "Mir",
    definition:
      "Primirje ili mirovno rešenje. Ugovor iz Hudaybiyyah je najbolji primjer odabira mira kada služi većem dobru.",
  },
  {
    term: "Fath",
    definition:
      "Otvaranje ili osvajanje — često se koristi za mirno otvaranje Mekke (Fath Mekka), a ne za nasilnu opsadu.",
  },
];
