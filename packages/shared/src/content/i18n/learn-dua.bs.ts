// Bosnian translation overlay for the Learn Dua content. Mirrors the order of
// its English source in ../learn-dua*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { LearnDuaOccasion, LearnDuaTopic } from "../../types/learn-dua";
import type { DeepPartial } from "./localize";

export const LEARN_DUA_TOPICS_BS: DeepPartial<LearnDuaTopic>[] = [
  {
    title: "Šta je dua?",
    summary: "Dova je ibadet: direktno pozivanje Allaha, sa poniznošću i nadom.",
    body: [
      "Dova (دعاء) je pozivanje na Allaha - traženje od Njega koristi, oprosta, upute i zaštite, i obraćanje Mu u potrebi. Daleko od toga da je to manje djelo, Poslanik, sallallahu alejhi ve sellem, je rekao: 'Dova je ibadet', a zatim je izgovorio Allahovu naredbu: 'Zovi me; Ja ću vam odgovoriti.' Pitati Allaha je samo po sebi čin čistog tevhida, jer priznaje da On jedini čuje, posjeduje i kontrolira sve ishode.",
      "Postoje dvije vrste dova koje teku zajedno: dova al-mas'alah, traženje od Allaha za nešto, i dova al-'ibadah, obožavanje Njega kroz namaz, zikr i pokornost - jer svaki čin ibadeta je, u suštini, tihi zahtjev za Njegovim prihvatanjem i nagradom. Zato je upućivanje dove bilo kome osim Allahu oblik širka: ono drugome daje ono što samo Njemu pripada.",
      "Vjernik čini dovu lako i teško, naglas i u tajnosti, siguran da Allah čuje svaki poziv i nikada ne odbija iskrenog praznih ruku. On je toliko blizu da kaže: 'Odgovaram na poziv pozivaoca kada Me on pozove.'",
      "Odgovor ima jedan od tri oblika, koje je učio Poslanik, sallallahu alejhi ve sellem: Allah daje ono što je traženo; ili ga uskrati i spremi jednaku ili veću nagradu za ahiret; ili On odbija štetu jednaku tome. Dakle, nijedna iskrena dova nikada nije zaista neodgovorena - ponekad je najveća milost u odgovoru koji ne vidimo.",
    ],
    quran: [
      {
        excerpt: "I vaš Gospodar kaže: 'Pozovite me; Ja ću vam odgovoriti.'",
      },
      {
        excerpt:
          "I kada vas moje sluge pitaju u vezi sa mnom - zaista sam blizu. Odazivam se na poziv pozivaoca kada Me on pozove.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dova je ibadet. — zatim je proučio: 'A vaš Gospodar kaže: Pozovite me; Ja ću vam odgovoriti.' (an-Nu'man ibn Bashir)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Etiketi dua",
    summary: "Počnite sa pohvalama, šaljite salavate, tražite iskreno i nikada ne odustajte.",
    body: [
      "Dova ima bonton (adab) koji je Poslanik, sallallahu alejhi ve sellem, podučavao i modelirao, a njegovo poštovanje čini prihvatanje vjerovatnijim. Počnite tako što ćete hvaliti Allaha Njegovim lijepim imenima, a zatim pošaljite salavate (blagoslovi) na Poslanika, sallallahu alejhi ve sellem – on je učio da je dova 'obustavljena' sve dok onaj koji moli ne učini oboje – i tek onda iznesite svoj zahtjev.",
      "Pozovite Allaha sa tri unutrašnje kvalitete: poniznošću, sigurnošću da On može i da će odgovoriti, i dobrim mišljenjem o Njemu (husn al-zann). Suočite se s kiblom gdje god možete, podignite ruke, odaberite mubarek vremena i pitajte za poslove na ovom i na budućem svijetu. Preporučljivo je ponoviti važne zahtjeve, a završiti kako ste započeli — pohvalom i salavatom.",
      "Iznad svega, ne žurite. Poslanik, sallallahu alejhi ve sellem, je upozorio da se dova odgovara sve dok osoba ne očajava i ne kaže: 'Zvao sam i zvao, ali mi nije odgovoreno', a zatim je napusti. Upornost u traženju je sama po sebi ibadet, a Allah voli slugu koji stalno kuca na Njegova vrata.",
    ],
    hadith: [
      {
        excerpt:
          "Na sluginu dovu se i dalje odgovara sve dok ne žuri — govoreći: 'Učinio sam dovu, ali nisam odgovorio.' (Ebu Hurejre)",
      },
      {
        excerpt:
          "Kada neko od vas moli, neka počne hvaljenjem i veličanjem svog Gospodara, zatim pošalji blagoslov na Poslanika, sallallahu alejhi ve sellem, a zatim zatraži ono što želi. (Fadalah ibn 'Ubayd)",
      },
    ],
    actions: [
      "Otvorite svaku dovu sa Alhamdulillahom i salavatom na Poslanika, sallallahu alejhi ve sellem.",
      "Pitajte Allaha za imena koja najviše odgovaraju vašim potrebama (npr. Ya Razzaq za opskrbu, Ya Ghafur za oprost).",
      "Neka vam dova bude svakodnevna navika - nakon svake molitve, u sujudu i prije spavanja.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Uslovi za prihvaćenu dovu",
    summary: "Iskrenost, zakonita zarada i odvraćanje od grijeha otvaraju vrata odgovora.",
    body: [
      "Osim bontona, određeni uslovi snažno utiču na to da li se dova prihvati. Najvažniji je ikhlas — iskrenost samo prema Allahu, bez razmetanja i bez pozivanja na druge pored Njega. Srce koje je zaista prisutno u dovi vredi više od jezika koji mehanički recituje.",
      "Zakonito izdržavanje je moćan ključ. Poslanik, sallallahu alejhi ve sellem, je opisao putnika koji je podigao ruke prema nebu vičući 'O Gospodaru, o Gospodaru', ali 'njegova hrana je zabranjena, njegovo piće je zabranjeno, njegova odjeća je nezakonita, a hrani se nedozvoljenim - pa kako mu se može odgovoriti?' Čuvanje nečijeg prihoda, pokajanje od grijeha i ne traženje bilo čega grešnog ili raskid porodičnih veza uklanja prepreke između dove i njenog prihvatanja.",
      "Čak i tako, prihvatanje je na kraju Allahova milost, a ne transakcija koju kontrolišemo. Vjernik stoga kombinuje svoj najbolji trud – iskrenost, halal život, pokajanje – sa poniznim povjerenjem i nikada ne očajava ako odgovor kasni. Slabost i prošli grijesi nisu razlog da prestanete pitati; oni su razlog više da se vratimo Milostivom.",
    ],
    hadith: [
      {
        excerpt:
          "…njegova hrana je nezakonita, njegovo piće nezakonito, njegova odjeća nezakonita, hrani se nezakonitim – pa kako mu se može odgovoriti? (Ebu Hurejre)",
      },
      {
        excerpt:
          "Služinu dovu se odgovara sve dok ne traži nešto grešno ili raskid porodičnih veza. (Ebu Hurejre)",
      },
    ],
    actions: [
      "Pregledajte svoje prihode i potrošnju na zakonitost – to direktno utiče na vašu dovu.",
      "Prethodite dugim molitvama sa istighfarom i iskrenim pokajanjem.",
      "Nikada nemojte izgovarati dovu da tražite štetu, grijeh ili nepravdu.",
    ],
  },
  {
    title: "Najbolja vremena i mjesta za dua",
    summary: "Neki trenuci su posebno blagosloveni za prihvaćenu molitvu.",
    body: [
      "Dok se dova odgovara u bilo koje vrijeme, Poslanik, sallallahu alejhi ve sellem, je izdvojio određene trenutke i navode kada se prihvatanju najviše nadaju. Usidrite svoje zahtjeve na njih umjesto da čekate samo krizu.",
      "Među najjačima su: posljednja trećina noći, kada se Allah spušta (na način koji dolikuje Njegovom veličanstvu) na najniže nebo i poziva: 'Ko će od Mene tražiti da mu dam?'; sedždu u namazu, položaj najbliži Allahu; trenutak između ezana i ikameta; dok osoba posti, posebno u vrijeme prekida posta; tokom kiše; i posljednji sat petka prije zalaska sunca, u kojem postoji sat kada se dova ne odbija.",
      "Blagoslovljena mjesta i stanja uključuju stajanje na Arefatu za vrijeme hadža, boravak u svetim prostorima i dovu putnika, roditelja za njihovo dijete i onoga koji je povrijeđen. Koristite ih kao fiksna sidra za dosljedan vijek molbe.",
    ],
    hadith: [
      {
        excerpt:
          "Naš Gospodar silazi svake noći na najniže nebo u posljednjoj trećini noći i kaže: Ko Me zove da mu odgovorim? Ko od Mene traži da mu dam? (Ebu Hurejre)",
      },
      {
        excerpt:
          "Najbliži je sluga svome Gospodaru dok je na sedždi, zato se u tome mnogo dove. (Ebu Hurejre)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Jutarnji i večernji adhkar",
    summary: "Dnevna 'tvrđava muslimana' — zaštita i veza na oba kraja dana.",
    body: [
      "Jutarnji i večernji adhkar su među najistaknutijim dnevnim sjećanjima u Sunnetu - duhovnoj tvrđavi koju vjernik obnavlja na početku i na kraju svakog dana. Allah naređuje vjernicima da se 'veliko spominju Allaha, i slave Ga ujutro i uveče' (33:41–42).",
      "Dosljedno recitirani, oni se čuvaju od štete i šejtana, obnavljaju oslanjanje na Allaha (tawakkul) i drže srce vezano za Njega kroz sve dnevne promjenjive okolnosti. Dva od najvažnijih su u nastavku; adhkar kolekcija aplikacije sadrži cijeli set.",
    ],
    phrases: [
      {
        title: "Sayyid al-Istighfar (poglavar traženja oprosta)",
        when: "Jednom ujutru i uveče",
        translation:
          "O Allahu, Ti si moj Gospodar; nema boga osim Tebe. Ti si me stvorio i ja sam Tvoj sluga, i držim se Tvog saveza i obećavam koliko god mogu. Tražim utočište u Tebi od zla koje sam učinio. Priznajem Tvoju naklonost prema meni i priznajem svoj grijeh, zato mi oprosti - jer niko ne oprašta grijehe osim Tebe.",
      },
      {
        title: "Hasbijallahu la ilahe illa Huwa",
        when: "Sedam puta svako jutro i veče",
        translation:
          "Allah mi je dovoljan; nema boga osim Njega. Na Njega se oslanjam, i On je Gospodar Moćnog Trona.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nakon buđenja i prije spavanja",
    summary: "Neka vaše prve i posljednje riječi dana povežu sa Allahom.",
    body: [
      "Poslanik, sallallahu alejhi ve sellem, je učio posebne sjećanje za buđenje i ležanje, tako da su prve svjesne riječi vjernika svakog dana zahvalnost, a posljednje predanje. San je, poučavao je, 'manja smrt', a buđenje malo uskrsnuće - tako da adhkar uokviruje cijeli ciklus u svijesti o Allahu.",
      "Njihovo redovno učenje gradi duhovnu postojanost: rutinu zahvalnosti pri buđenju i povjeravanja duše Allahu prije spavanja. Prije spavanja, Poslanik, sallallahu alejhi ve sellem, je posebno podsticao da se uči Ajet al-Kursi, obećavajući da će Allahov čuvar ostati uz učača i da nijedan šejtan ne prilazi do jutra.",
    ],
    phrases: [
      {
        title: "Dva nakon buđenja",
        when: "Odmah po buđenju",
        translation:
          "Sva hvala Allahu koji nam je dao život nakon što nas je umro, a Njemu je proživljenje.",
      },
      {
        title: "Dua prije spavanja",
        when: "Kada legnete na spavanje",
        translation: "U Tvoje ime, Allahu, umirem i živim.",
      },
      {
        title: "Ayat al-Kursi prije spavanja",
        when: "Prije spavanja",
        translation:
          "Allah — nema boga osim Njega, Vječno Živog, Održavatelja svega. Ni pospanost ni san Ga ne obuzimaju. Njemu pripada sve što je na nebesima i na zemlji. Ko može posredovati kod Njega osim uz Njegovu dozvolu? On zna šta leži ispred njih i iza njih, a oni ne obuhvataju ništa od Njegovog znanja osim onoga što On hoće. Njegov se prijesto prostire preko nebesa i zemlje, i njihovo očuvanje Ga ne umara. On je Svevišnji, Veličanstveni.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dom i džamija dva",
    summary: "Nosite sjećanje dok ulazite i izlazite iz svog doma i mesdžida.",
    body: [
      "Poslanik, sallallahu alejhi ve sellem, je upućivao kratke dove uz svakodnevne pragove života. Spominjanje Allahovog imena pri izlasku i ulasku u kuću donosi zaštitu i blagoslov, i zatvara vrata šejtanu; učio je da kada osoba uđe spominjući Allaha, šejtan kaže svojim ashabima: 'Nemate ovdje gdje prenoćiti.'",
      "Mesdžid ima svoj vlastiti bonton: uđite desnom nogom tražeći kapije milosti, a izađite lijevom tražeći Allahovu blagodat – podsjećajući da je džamija mjesto milosti, discipline i poniznosti pred Allahom.",
    ],
    phrases: [
      {
        title: "Dua prilikom odlaska od kuće",
        when: "Kada izađete iz kuće",
        translation: "U ime Allaha; Ja se uzdam u Allaha; nema moći i moći osim kod Allaha.",
      },
      {
        title: "Dova ulazak u džamiju",
        when: "Pri ulasku, zakoračiti desnom nogom",
        translation: "O Allahu, otvori mi vrata svoje milosti.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dove za jelo i piće",
    summary: "Kratki adhkar koji donose baraku i zahvalnost svakom obroku.",
    body: [
      "Islam običan čin jedenja pretvara u ibadet kroz sjećanje. Počnite sa 'Bismillah' — koja poziva na blagoslov i sprječava šejtana da dijeli obrok — i završite hvalom Allahu, trenirajući srce u zahvalnosti i pažljivosti nekoliko puta dnevno.",
      "Sunnet čak daje ispravku za zaborav: ako zaboravite reći 'Bismillah' na početku, recite kada se sjetite, 'Bismillahi awwalahu wa akhirahu' (U ime Allaha, na njegovom početku i njegovom kraju).",
    ],
    phrases: [
      {
        title: "Prije jela",
        when: "Na početku obroka",
        translation: "U ime Allaha.",
      },
      {
        title: "Nakon jela",
        when: "Po završetku obroka",
        translation:
          "Sva hvala Allahu koji me je nahranio ovim i obezbijedio mi bez ikakve moći ili moći s moje strane.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Dove oko vudua i namaza",
    summary: "Dove prije i poslije abdesta, te unutar samog namaza.",
    body: [
      "Vudu i namaz su najveći dnevni otvori za prihvaćeno sjećanje, pa ih sunnet ispunjava dovom. Završetak vudua svjedočenjem vjere otvara osam kapija raja; a unutar namaza — u sudžudu i neposredno prije završnog selama — su dva najprihvatljivija momenta u danu vjernika.",
      "Učenje autentičnih fraza za ove trenutke pretvara ritualne pokrete u svjesni razgovor sa Allahom.",
    ],
    phrases: [
      {
        title: "Nakon vudua",
        when: "Odmah po završetku abdesta",
        translation:
          "Svjedočim da nema boga osim jedinog Allaha, bez partnera, i svjedočim da je Muhamed Njegov sluga i Poslanik.",
      },
      {
        title: "Prije selama u namazu",
        when: "U završnom tešehudu, prije završetka namaza",
        translation:
          "O Allahu, utječem Ti se od džehennemske kazne, kaburske kazne, iskušenja života i smrti, i zla iskušenja Lažnog Mesije (Dedžala).",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dova na ezan i ikamet",
    summary: "Odgovorite na poziv, zamolite Allaha za Poslanikovu ﷺ stanicu, a zatim se molite.",
    body: [
      "Kada se pozove ezan, sunnet treba ponoviti nakon muazina, zatim poslati salavat na Poslanika, sallallahu alejhi ve sellem, zatim proučiti dovu tražeći od Allaha da mu podari el-Wasilah – Poslanik, sallallahu alejhi ve sellem, je obećao svoje posredovanje onome ko to učini.",
      "Prozor između ezana i ikameta je jedno od prihvaćenih vremena za ličnu dovu; Poslanik, sallallahu alejhi ve sellem, je rekao da se dova učinjena tada ne odbija, pa je iskoristite da zamolite Allaha za svoje potrebe.",
    ],
    phrases: [
      {
        title: "Dova nakon ezana",
        when: "Kada se ezan završi",
        translation:
          "O Allahu, Gospodaru ovog savršenog poziva i utvrđene molitve, podari Muhammedu el-Vasilahu i el-Fadilu i uzdigni ga na hvaljeno mjesto koje si mu obećao.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dova između ezana i ikameta se ne odbija. (Anas ibn Malik; također at-Tirmizi 212)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Anksioznost i tuga",
    summary: "Usidrite srce tavakulom i Poslanikovim, sallallahu alejhi ve sellem, molitvama.",
    body: [
      "Islam se suočava sa nevoljama praktičnim duhovnim alatima: dovom, zikrom, molitvom i povjerenjem u Allahovu odredbu. Poslanik, sallallahu alejhi ve sellem, koji se i sam suočio sa tugom i teškoćama, učio je precizne dove za tjeskobu (hamm), tugu (hazan) i strah - riječi koje preusmjeravaju srce od problema prema Onome koji ga kontrolira.",
      "Ove dove ne zamjenjuju traženje pomoći putem zakonitih sredstava, uključujući medicinsku ili profesionalnu njegu kada je to potrebno. Umjesto toga, oni jačaju srce uz ta sredstva, podsjećajući vjernika da je krajnja dovoljnost samo kod Allaha.",
    ],
    phrases: [
      {
        title: "Dua za anksioznost i tugu",
        when: "U nevolji, brizi ili ogromnoj tuzi",
        translation:
          "O Allahu, utječem Ti se od tjeskobe i žalosti, od nesposobnosti i lijenosti, od škrtosti i kukavičluka, od tereta duga i od toga da me drugi savladaju.",
      },
      {
        title: "Allah nam je dovoljan",
        when: "Kada ste uplašeni ili preplavljeni",
        translation: "Allah nam je dovoljan, i On je najbolji raspolagač stvarima.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Bolest i strah",
    summary: "Tražite ozdravljenje od Allaha dok uzimate zakonita sredstva liječenja.",
    body: [
      "Sunnet spaja dovu sa liječenjem: Poslanik, sallallahu alejhi ve sellem, je učio: 'Za svaku bolest postoji lijek' i naredio je traženje liječenja, dok se također liječe srca i tijela kroz rukju - učenje Kur'ana i vjerodostojne dove nad bolesnicima. Vjernik čini oboje: uzima lijek i obraća se iscjelitelju.",
      "Važan je naziv uzroka djelovanja: Allah je eš-Šafi, iscjelitelj, a lijek je samo sredstvo koje je stvorio. I u strahu, srce se obraća Njemu za sigurnost i čvrstinu - jer On jedini daje sigurnost.",
    ],
    phrases: [
      {
        title: "Dva za lečenje",
        when: "Kada je bolestan, ili molitva nad nekim ko je bolestan",
        translation:
          "O Allahu, Gospodaru čovječanstva, otkloni nevolju i daj ozdravljenje - Ti si iscjelitelj; nema lijeka osim Tvog lijeka — lijeka koji ne ostavlja za sobom bolest.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Oprost i vodstvo",
    summary: "Neprestano tražite pomilovanje, postojanost i pravo vodstvo.",
    body: [
      "Traženje oprosta (istighfar) nije rezervisano za velike grijehe – to je svakodnevni ritam vjernika. Poslanik, sallallahu alejhi ve sellem, koji je već bio oprošten, tražio je od Allaha oprost više od sedamdeset puta dnevno, učeći da je srcu potrebno stalno poliranje.",
      "Vođenje je, takođe, stalna potreba, a ne jednokratni događaj. Čak i vjerni vjernici traže od Allaha da njihova srca budu mirna, jer se srca okreću - a Onaj koji ih okreće je Allah. Poslanik, sallallahu alejhi ve sellem, je često molio za srce koje je čvrsto na vjeri.",
    ],
    phrases: [
      {
        title: "Često pokajanje",
        when: "Ponavljano, tokom dana",
        translation: "Tražim oprost od Allaha i obraćam se Njemu u pokajanju.",
      },
      {
        title: "Dua za postojano srce",
        when: "Kada se bojite pogrešnih smjernica ili pokolebanja",
        translation: "O okretaču srca, učini moje srce čvrstim na Tvojoj vjeri.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dove za putovanja i kišu",
    summary: "Molbe za polazak i za milost kiše koja pada.",
    body: [
      "Putovanje je stanje i ranjivosti i pojačanog prihvatanja - Poslanik, sallallahu alejhi ve sellem, je učio da se putnikova dova uslišava, i dao je dovu da se ukrca na vozilo i krene na put koji priznaje Allahovu moć i naš povratak Njemu.",
      "Kiša je milost koja silazi od Allaha, a trenutak njenog pada je vrijeme za molitvu. Poslanik, sallallahu alejhi ve sellem, bi pozdravio kišu kratkom dovom tražeći da ona bude korisna, a ne uzrok štete.",
    ],
    phrases: [
      {
        title: "Dua kada krenete na put",
        when: "O montiranju vašeg transporta i odlasku",
        translation:
          "Neka je slava Onome koji nam je ovo podredio, kada to sami nismo mogli učiniti; i zaista, našem Gospodaru ćemo se sigurno vratiti.",
      },
      {
        title: "Dua kada pada kiša",
        when: "Na početku padavina",
        translation: "O Allahu, učini da pljusak bude blagotvoran.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Opskrba i porodica",
    summary: "Tražite od Allaha zakonitu hranu i pravednost u domu.",
    body: [
      "Opskrba (rizq) je samo od Allaha; vjernik veže svoju kamilu - radeći i zarađujući - zatim traži od Opskrbitelja zakonitu hranu, barakatu u onome što zarađuje, slobodu od dugova i nezavisnost od potrebe za drugima. Poslanik, sallallahu alejhi ve sellem, je učio prelijepu dovu koja traži upravo to.",
      "Za dom, sam Kur'an podučava molitvu pravednika: da se daju supružnici i djeca koji su 'utjeha za oči' i da se vodi kućanstvo povezana vjerom, molitvom i milošću.",
    ],
    quran: [
      {
        excerpt:
          "Gospodaru naš, daj nam iz supružnika i potomstva utjehu našim očima i učini nas vođama pravednih.",
      },
    ],
    phrases: [
      {
        title: "Dua za zakonitu odredbu",
        when: "Ujutro, nakon molitve, iu finansijskom stresu",
        translation:
          "O Allahu, dosta mi je sa onim što si zabranio protiv onoga što si učinio nedozvoljenim, i obogati me Svojom blagodaću da mi niko osim Tebe ne treba.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Kur'anski dva",
    summary: "Molbe koje je učio sam Allah u Kur'anu.",
    body: [
      "Kur'anske dove su riječi koje je Allah stavio na jezike poslanika i vjernika, a zatim ih je sačuvao da ih ponavljamo - sažete, sveobuhvatne i nemoguće ih je poboljšati. Mnogi počinju sa 'Rabbana' (naš Gospodin) i idealni su za pamćenje i stalno recitovanje.",
      "Između njih pokrivaju sve potrebe vjernika: oprost, vodstvo, postojanost, milost, pravedna porodica, zaštita od Vatre i uspjeh na oba svijeta. Dova Allahovim vlastitim riječima je jedan od najsigurnijih oblika dove.",
    ],
    phrases: [
      {
        title: "Dobro u oba svijeta",
        when: "Opća, univerzalna dova — najčešća Poslanikova ﷺ",
        translation:
          "Gospodaru naš, podari nam dobro na ovom svijetu i dobro na onom svijetu i zaštiti nas od kazne vatre.",
      },
      {
        title: "Postojanost u vjeri",
        when: "Kada se bojite odstupanja ili nakon što ste vođeni",
        translation:
          "Gospodaru naš, neka naša srca ne odstupe nakon što si nas uputio, i daj nam milost od Sebe. Zaista, Ti si Darovatelj.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Proročanska dva",
    summary: "Mole koje je vjerodostojno učio Poslanik Muhammed, a.s.",
    body: [
      "Poslaniku, sallallahu alejhi ve sellem, je dat 'najsveobuhvatniji govor' (jawami' al-kalim), i njegove dove to odražavaju: kratke riječi, široke po značenju i savršeno izbalansirane između potreba ovog i budućeg života. Traže vodstvo, čistoću srca, zdravlje, oprost, zaštitu i dobar karakter.",
      "Ključni princip: držite se autentičnih, dobro potvrđenih dua iz pouzdanih zbirki i izbjegavajte kruženje slabih ili izmišljenih s izmišljenim nagradama. Pravo blago sunneta je više nego dovoljno.",
    ],
    phrases: [
      {
        title: "Sveobuhvatna dua od četiri",
        when: "Opća dnevna molitva",
        translation: "O Allahu, molim Te za uputu, bogobojaznost, čednost i zadovoljnu dovoljnost.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Dhikr i tesbeeh",
    summary: "Kratka sjećanja na ogromnu težinu i nagradu.",
    body: [
      "Dhikr — sjećanje na Allaha — uključuje tesbih (SubhanAllah), tahmid (Alhamdulillah), tahlil (La ilaha illallah), tekbir (Allahu Akbar) i istighfar. Ovo su među najlakšim riječima na jeziku, ali i najteže na Skali, i one su odbrana živog srca od bezbrižnosti.",
      "Poslanik, sallallahu alejhi ve sellem, je opisao izraze 'laki na jeziku, teški na vagi, voljeni Najmilostivijem' i podučavao je da onaj ko kaže 'SubhanAllahi wa bihamdih' sto puta dnevno, njegovi grijesi su izbrisani iako su poput morske pjene. Održavan nakon namaza i tokom dana, zikr održava iman živim.",
    ],
    phrases: [
      {
        title: "Voljene riječi koje brišu grijeh",
        when: "Tokom dana; 100 puta briše grijehe",
        translation: "Slavljen neka je Allah, i svaka mu je hvala.",
      },
      {
        title: "Dvije riječi teške na vagi",
        when: "Bilo kada",
        translation: "Neka je slavljen Allah i hvala mu; neka je slava Allahu Veličanstvenom.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Salavat na Poslanika ﷺ",
    summary:
      "Slanje blagoslova Poslaniku, sallallahu alejhi ve sellem, je svakodnevni izvor milosti.",
    body: [
      "Slanje salavata na Poslanika, sallallahu alejhi ve sellem, je naređeno od strane Allaha u Kur'anu: 'Zaista, Allah i Njegovi meleki salju blagoslov na Poslanika; O vjernici, pošaljite mu blagoslov i selam' — i nijedna druga dova ne nosi takav zagarantovan povratak: Poslanik, sallallahu alejhi ve sellem, je rekao da onome ko mu pošalje jedan blagoslov, Allah šalje deset na tu osobu.",
      "Česti salavati donose milost, podižu činove, brišu grijehe i privlače osobu koja je najbliža Poslaniku, sallallahu alejhi ve sellem, na Sudnjem danu. Potpuni Ibrahimov oblik u nastavku - onaj kojem je naučio svoje ashabe kada su pitali kako da mu pošalju blagoslov - uči se u tešahudu svake molitve i odličan je za držanje na jeziku tokom cijelog dana.",
    ],
    quran: [
      {
        excerpt:
          "Zaista, Allah i Njegovi meleki salje blagoslov na Poslanika. O vjernici, pošaljite mu blagoslov i pozdrav mira.",
      },
    ],
    phrases: [
      {
        title: "Kompletan salavat Ibrahimiyyah",
        when: "U tešahudu namaza i tokom cijelog dana",
        translation:
          "Allahu, pošalji blagoslov na Muhammeda i porodicu Muhammedovu, kao što si blagoslovio Ibrahima i porodicu Ibrahimovu; zaista si hvale dostojan, slavan. O Allahu, daj milost Muhammedu i porodici Muhammedovoj, kao što si dao naklonost Ibrahimu i porodici Ibrahimov; zaista si hvale dostojan, slavan.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Izvori i autentičnost",
    summary: "Dajte prednost Kur'anu i vjerodostojnom hadisu sa jasnim citiranjem.",
    body: [
      "Ovaj modul je edukativan i nepristrasan, izgrađen u potpunosti na Kur'anu i široko prihvaćenim autentičnim (sahih/hasan) hadisima, svaki sa sljedivom referencom. Zlatni standard za dnevne due je upravo ovo: provjereni tekst s poznatim izvorom.",
      "Ozbiljna opreznost se odnosi na molitvu: mnoge dove kruže internetom sa izmišljenim formulacijama i preuveličanim nagradama ('recitirajte ovo i svi vaši grijesi nestaju'). Izmišljeni hadisi su teška stvar, stoga provjerite nepoznatu predaju prije nego što je usvojite ili proslijedite.",
      "Za pamćenje i svakodnevnu praksu, dajte prednost kratkim, autentičnim dovama koje zaista možete održati u odnosu na duge koje ćete napustiti - dosljednost je Allahu draža od obima. Gdje se škole razlikuju u formulacijama, učite od kvalifikovanog lokalnog učenjaka.",
    ],
    actions: [
      "Provjerite izvor bilo kojeg nepoznatog dua prije nego što ga podijelite.",
      "Odaberite nekoliko sažetih autentičnih dua i održavajte ih svakodnevno, a ne mnoge koje ne možete izdržati.",
      "Koristite veze na teme u aplikaciji da uparite svaku lekciju sa stvarnom vježbom.",
    ],
    disclaimer:
      "Obrazovni sadržaji ne zamjenjuju personalizirane savjete o fikhu. Pitajte kvalifikovane naučnike za odluke o konkretnim slučajevima.",
    appLinks: [{}, {}, {}, {}],
  },
];

export const LEARN_DUA_OCCASIONS_BS: DeepPartial<LearnDuaOccasion>[] = [
  {
    title: "Jutarnji adhkar",
    summary: "Započnite dan sjećanjem",
  },
  {
    title: "Večernji adhkar",
    summary: "Zaštita prije noći",
  },
  {
    title: "Nakon buđenja",
    summary: "Prve reči po buđenju",
  },
  {
    title: "Prije spavanja",
    summary: "Duas i adhkar za noć",
  },
  {
    title: "Ulazak kući",
    summary: "Bismillah i pozdrav",
  },
  {
    title: "Odlazak od kuće",
    summary: "Tawakkul pri izlasku",
  },
  {
    title: "Džamija",
    summary: "Ulazak i izlazak iz mesdžida",
  },
  {
    title: "Prije i poslije jela",
    summary: "Zahvalnost za obroke",
  },
  {
    title: "Wudu",
    summary: "Prije i poslije abdesta",
  },
  {
    title: "Molitva",
    summary: "Prije, za vrijeme i poslije namaza",
  },
  {
    title: "Anksioznost i briga",
    summary: "Smirite srce dovom",
  },
  {
    title: "Bolest",
    summary: "Liječenje i strpljenje",
  },
  {
    title: "Oprost",
    summary: "Istighfar i pokajanje",
  },
  {
    title: "Putovanja",
    summary: "Polazak i povratak",
  },
  {
    title: "Provizija",
    summary: "Traženje od Allaha za halal rizq",
  },
  {
    title: "Kur'anski dva",
    summary: "Molbe iz Allahove knjige",
  },
];
