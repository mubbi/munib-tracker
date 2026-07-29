// Bosnian translation overlay for the Learn Salah guide content. Mirrors the order of
// its English source in ../salah-guide*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  SalahGuidePhrase,
  SalahGuideQuizQuestion,
  SalahGuideTopic,
} from "../../types/salah-guide";
import type { DeepPartial } from "./localize";

export const SALAH_GUIDE_TOPICS_BS: DeepPartial<SalahGuideTopic>[] = [
  {
    title: "Šta je Namaz?",
    summary: "Drugi stub islama je vaš dnevni sastanak sa Allahom.",
    body: [
      "Namaz je formalni ibadet koji je Allah propisao svakom vjerniku: naređeni slijed stajanja (kijam), klanjanja (ruku) i sedžde (sudžud), spojenih s fiksnim riječima hvale, Kur'anom i dovom, koji se obavljaju u pet određenih puta svakog dana. Riječ Namaz dolazi od arapskog korijena što znači veza i dova – to je direktna, neposredna linija vjernika prema Stvoritelju, kojoj nije potreban svećenik i zagovornik.",
      "Jedinstvena potpuna jedinica namaza - od jedne do druge sedžde - naziva se rekat. Namaz se broji u rekate: Fadžr je dva, Magrib tri, a Zhur, Asr i Isha četiri. Obavezni namazi se nazivaju farz; Poslanikovi, sallallahu alejhi ve sellem, redovno klanjani dodaci su sunnet, a slobodno klanjane neobavezne dove su nafl.",
      "Jedinstveno među stubovima, namaz nije objavljen preko meleka koji se spustio na zemlju, već je naređen direktno Poslaniku, sallallahu alejhi ve sellem, kada je podignut kroz nebesa na Noćnom putovanju (al-Isra' wa al-Mi'raj). Najprije je određeno pedeset namaza, a zatim - kroz Poslanikove, sallallahu alejhi ve sellem, ponovljene povratke tražeći olakšanje za svoj ummet - smanjeno na pet učinjenih namaza uz zadržavanje nagrade od pedeset.",
      "Zbog toga je namaz u samom središtu islamskog života: ponavlja se pet puta dnevno, prekida rad, odmor i dokolicu kako bi se srce ponovno usidrilo na Allaha, i to je prvo djelo za koje će se rob pozvati na odgovornost na Kijametskom danu. Ako se pronađe zvuk, slijedi ostatak zapisa.",
    ],
    quran: [
      {
        excerpt:
          "Koji vjeruju u nevidljivo, namaz obavljaju i troše od onoga što smo im Mi obezbijedili.",
      },
      {
        excerpt:
          "Recite ono što vam je objavljeno u Knjizi i uspostavite molitvu. Zaista, namaz se suzdržava od nemorala i nedjela, a spominjanje Allaha je veće.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Na noćnom putovanju Allah je naredio pedeset namaza; Poslanik, sallallahu alejhi ve sellem, se stalno vraćao da traži olakšanje sve dok nisu napunili pet godina - 'Ovo je pet, a ovi pedeset, jer se riječ sa Mnom ne mijenja.' (takođe Sahih Musliman 162)",
      },
      {
        excerpt:
          "Prva stvar za koju će sluga biti priveden na odgovornost na Sudnjem danu je njegova molitva; ako je zdravo, ostala su njegova djela zdrava. (takođe Ebu Davud 864, an-Nasa'i 3991)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Zašto Namaz?",
    summary: "Duhovni, moralni, psihološki i vječni plodovi pet dnevnih molitvi.",
    body: [
      "Namaz je direktan razgovor sa Allahom. U njegovom položaju vi Mu se obraćate kroz Njegove vlastite otkrivene riječi; u sedždi - položaju krajnje poniznosti - vi ste Mu najbliži i najverovatnije ćete dobiti odgovor. Nijedan drugi čin ibadeta se ne ponavlja tako često ili tako intimno.",
      "Njegov prvi plod je suzdržana, disciplinovana duša. Sam Allah kaže da namaz, kada je pravilno uspostavljen, 'suzdržava od nemorala i nepravde' (29:45): osoba koja zaista pet puta dnevno stoji pred Allahom teže je pristupiti grijehu. To je također ponavljano pročišćavanje – Poslanik, sallallahu alejhi ve sellem, uporedio je pet namaza sa rijekom koja teče u kojoj se kupa pet puta dnevno, ne ostavljajući za sobom prljavštinu.",
      "Njegov drugi plod je unutrašnji mir. Kur'an obećava da će srca naći odmor u sjećanju na Allaha, a Poslanik, sallallahu alejhi ve sellem, u trenucima brige, bi rekao: 'Utješi nas time, o Bilale', pozivajući na namaz. On je opisao zadovoljstvo svojih očiju kao da je stavljen na namaz.",
      "Njegovi društveni i vječni plodovi upotpunjuju sliku: skupni namaz bogatih i siromašnih u jedan red i izgrađuje bratstvo, dok je čuvanje namaza jedan od najsigurnijih puteva ka Allahovom oprostu i Džennetu. Poslanik, sallallahu alejhi ve sellem, je obećao Džennet onome ko sačuva dvije 'hladne' namaze sabah i asr.",
    ],
    quran: [
      {
        excerpt:
          "Zaista, ja sam Allah. Nema drugog božanstva osim Mene, zato Me obožavajte i uspostavite molitvu za Moj spomen.",
      },
      {
        excerpt: "Zaista su uspješni vjernici - oni koji su ponizni u svojoj molitvi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "'Da je na vratima jednog od vas rijeka u kojoj se kupao pet puta dnevno, da li bi na njemu ostala prljavština?' Rekli su: 'Nijedan.' Rekao je, 'To je sličnost sa pet namaza - Allah briše grijehe njima.' (takođe Sahih Musliman 667)",
      },
      {
        excerpt: "Ko bude klanjao dvije hladne molitve - Fajr i Asr - ući će u Džennet.",
      },
      {
        excerpt:
          "Od tvoga svijeta su mi stvorene voljene žene i parfemi, a hladnoća mojih očiju stavljena je u molitvu.",
      },
    ],
    actions: [
      "Izmolite samo jednu molitvu u potpunosti na vrijeme danas - dosljednost, a ne savršenstvo, je prvi cilj.",
      "Pročitajte značenje Al-Fatihe jednom prije sljedećeg namaza da biste osjetili da vam je odgovoreno.",
      "Uključite podsjetnike za ezan tako da nijedan prozor za molitvu ne prođe nezapaženo.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Njegov rang u islamu",
    summary: "Stub religije - i najteže djelo koje treba zanemariti.",
    body: [
      "Poslanik, sallallahu alejhi ve sellem, uči da je Islam izgrađen na pet stubova, a namaz je drugi, odmah nakon dva svjedočanstva vjere. Svjedočenje vas prima u Islam; molitva je trajni dokaz da svjedočanstvo živi u vašem srcu. Zbog toga učenjaci namaz nazivaju 'stupom religije' - kuća bez centralnog stuba se ruši.",
      "Njegova težina se vidi u tome kako tekstovi govore o njegovom zanemarivanju. Kur'an upozorava na generaciju koja je 'zanemarila namaz i slijedila želje' i predviđa njihovu propast, a Poslanik, sallallahu alejhi ve sellem, je opisao namaz kao zavjet koji razlikuje vjerovanje od nevjerovanja.",
      "U pogledu odluke za onoga ko napusti namaz, postoji dobro poznata razlika među sunitskim učenjacima i poštovanjem. Neki smatraju da namjerno potpuno odustajanje od toga - dok potvrđuju da je to obavezno - predstavlja veliko nevjerstvo koje izbacuje osobu iz islama; većina (Hanefi, Maliki, Šafija) smatra da takva osoba ostaje grešni musliman krivac za jedan od najtežih velikih grijeha, pod uslovom da ne poriče svoju obavezu. Svi se slažu da je napuštanje namaza katastrofa i da je onaj ko negira njegovu obavezu napustio Islam konsenzusom.",
      "Praktična pouka je ista u svakom pogledu: čuvanje pet dnevnih namaza nije izborno niti o čemu se može pregovarati za vjernika. Dobrovoljni namazi (sunnet i nafl) tada djeluju kao sigurnosna mreža, nadoknađujući manjkavosti obaveznih namaza na Sudnjem danu.",
    ],
    quran: [
      {
        excerpt: "Pažljivo održavaj namaz i srednji namaz, i stani pred Allaha, predano poslušan.",
      },
      {
        excerpt:
          "Ali za njima su došli nasljednici koji su zanemarili molitvu i slijedili želje; pa će se susresti sa zlom.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Islam je izgrađen na pet: svjedočenje da nema boga osim Allaha i da je Muhammed Njegov poslanik, uspostavljanje namaza, davanje zekata, hadž i ramazanski post. (takođe Sahih al-Bukhari 8)",
      },
      {
        excerpt:
          "Savez između nas i njih je molitva; ko ga napusti počinio je nevjerovanje. (Buraydah; također en-Nasa'i, Ibn Madže 1079)",
      },
      {
        excerpt:
          "Između čovjeka i nevjerovanja i idolopoklonstva stoji napuštanje molitve. (Jabir)",
      },
    ],
    disclaimer:
      "Učenjaci se razlikuju u tačnoj presudi za onoga ko napusti molitvu iz lijenosti (veliki grijeh za većinu; nevjerovanje za druge) od onoga koji negira njenu obavezu (nevjerovanje konsenzusom). Ova aplikacija ne donosi presudu nijednom pojedincu - konsultujte se sa kvalifikovanim naučnikom za lične slučajeve.",
  },
  {
    title: "Ko se mora moliti?",
    summary: "Svaki zdrav, odrasli musliman — sa jasno definisanim izuzecima i ustupcima.",
    body: [
      "Namaz postaje obavezan za svakog muslimana koji je zdrav i koji je dostigao pubertet (bulugh). Tri grupe su potpuno oslobođene odgovornosti po autentičnom principu: spavači dok se ne probudi, dijete dok ne sazrije i mentalno nesposobni dok se ne vrati zdrav razum.",
      "Djeca još nisu obavezna, ali se postepeno obučavaju. Poslanik, sallallahu alejhi ve sellem, je dao naredbu djeci da klanjaju od sedme godine i nježno disciplinovane za zanemarivanje sa deset godina – tako da je do puberteta namaz već ustaljena navika, a ne iznenadni teret.",
      "Žene u menstruaciji (hayd) ili postporođajnom krvarenju (nifas) ne mole se za to vrijeme; propuštene obavezne namaze se ne nadoknađuju naknadno - milost i odluka slažu se učenjaci. (Propušteni postovi, za razliku od namaza, se nadoknađuju.) Žena nastavlja molitvu kada krvarenje prestane i kada se pročisti guslom.",
      "Istinska nesposobnost donosi ustupak, nikada otkazivanje: teška bolest, nesvjestica i neodoljiv strah mogu na neko vrijeme opravdati osobu, a bolesni se mole u skladu sa svojim mogućnostima - sjedeći, ležeći ili čak pokretima. Putovanje ne uklanja molitvu već je olakšava skraćivanjem (qasr) i kombinovanjem (jam'), što je opisano u Putopisnom vodiču.",
    ],
    hadith: [
      {
        excerpt:
          "Zapovjedite svojoj djeci da se mole kada imaju sedam godina, i disciplinirajte ih za to u deset, i odvojite njihova mjesta za spavanje. ('Amr ibn Šuajb od njegovog oca od njegovog djeda)",
      },
    ],
    quran: [
      {
        excerpt: "I zapovjedi molitvu svojoj porodici, i budi postojan u njoj.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Uslovi prije namaza",
    summary: "Devet preduslova (šuruta) koji moraju postojati da bi namaz bio valjan.",
    body: [
      "Prije nego što namaz uopće postane valjan, moraju biti ispunjeni određeni uvjeti (šurut al-Namaz). Uslov se razlikuje od stuba: uslovi su preduslovi koji dolaze pre nego što počnete i koji se nastavljaju tokom čitavog perioda, dok su stubovi (arkan) delovi samog namaza. Ako nedostaje traženi uslov, namaz se ne prima bez obzira na to koliko je dobro obavljen.",
      "Zamislite ovih devet kao kontrolnu listu prije leta. Većina se povezuje sa potpunijom lekcijom na drugom mestu u ovom vodiču - dodirnite da biste detaljno naučili svaku. Dvojica od njih (suočavanje sa kiblom i tačnim vremenom) mogu se opravdati istinskom nesposobnošću; ostalo je čvrsto potrebno kad god je u mogućnosti.",
    ],
    steps: [
      {
        title: "Islam",
        body: "Namaz je čin muslimana; ne važi za nemuslimana, niti obavezuje, sve dok ne uđu u Islam.",
      },
      {
        title: "zdrav razum ('aql)",
        body: "Osoba mora imati zdrav razum. Onaj ko je izgubio razum ne odgovara dok je u tom stanju.",
      },
      {
        title: "pronicljivost (tamyiz)",
        body: "Sposobnost razlikovanja dostigla je oko sedme godine - doba od koje se djeci govori da se mole.",
      },
      {
        title: "Uklanjanje manjih i velikih nečistoća (tahara iz hadisa)",
        body: "Važeće stanje wudua, ili gusla nakon veće nečistoće, ili tayammuma kada se voda ne može koristiti.",
      },
      {
        title: "Uklanjanje prljavštine (najasah)",
        body: "Tijelo, odjeća i mjesto molitve moraju biti očišćeni od obrednih prljavština kao što su urin, krv u količini i druge navedene supstance.",
      },
      {
        title: "Pokrivanje avra",
        body: "Dijelovi koji moraju biti pokriveni su prekriveni čistom, neprozirnom odjećom — pogledajte lekciju Odjeća i awrah.",
      },
      {
        title: "Vrijeme molitve je ušlo",
        body: "Svaki namaz ima definisan prozor; molitva prije nego što počne vrijeme je nevažeća. Koristite svoj raspored i podsjetnike.",
      },
      {
        title: "Okrenuti se prema kibli",
        body: "Okretanje ka Kabi što bliže možete utvrditi - opravdano samo istinskom nesposobnošću.",
      },
      {
        title: "namjera (niyyah)",
        body: "Odlučite u srcu koju molitvu ćete obaviti. To je unutrašnji čin i ne govori se naglas.",
      },
    ],
    appLinks: [{}, {}, {}],
    disclaimer:
      "Škole malo drugačije govore i broje uslove (neke navode niyyah među stubovima, a ne među uslovima). Supstanca je dogovorena.",
  },
  {
    title: "pročišćavanje (tahara)",
    summary: "Čistoća sebe, odjeće i mjesta - vrata svake molitve.",
    body: [
      "Tahara znači uklanjanje ritualne nečistoće kako biste mogli stajati pred Allahom u stanju čistoće. Allah voli one koji se čiste, a Poslanik, sallallahu alejhi ve sellem, je učio da je 'čišćenje pola vjere.' Bez toga se ne prima namaz.",
      "Nečistoća je dvije vrste. Manja nečistoća (hadath asghar) — uzrokovana stvarima kao što je korištenje toaleta ili prolazni vjetar — uklanja se vuduom. Velika nečistoća (hadath akbar ili dženaba) — nakon intimnosti, ejakulacije ili završetka menstruacije i postnatalnog krvarenja — uklanja se punim ritualnim kupanjem (gusl).",
      "Odvojeno od ovih ritualnih stanja, opipljiva prljavština (najasah) - kao što je urin, izmet, krv koja teče i slično - mora biti fizički uklonjena s tijela, odjeće i mjesta na kojem se molite. Moguće je imati važeći vudu, ali ipak morate očistiti mrlju sa svoje odjeće prije molitve.",
      "Voda je primarni prečistač. Kada je voda zaista nedostupna, ili bi vam naškodila zbog bolesti ili jake prehlade, Islam dopušta tayammum — suho pročišćavanje pomoću čiste zemlje — kao potpunu zamjenu. Pročišćavanje nikada nije zamišljeno kao teškoća; to je sredstvo približavanja.",
    ],
    hadith: [
      {
        excerpt: "Pročišćenje je pola vjere... (Abu Malik al-Ash'ari)",
      },
    ],
    quran: [
      {
        excerpt: "Zaista, Allah voli one koji se neprestano kaju i voli one koji se čiste.",
      },
    ],
    actions: [
      "Naučite vudu korak po korak prije sljedeće molitve kako bi svaki ud bio pravilno opran.",
      "Ostavite čistu odjeću za molitvu ako radite u zaprljanom okruženju.",
      "Prije postavljanja prostirke pogledajte svoje mjesto za molitvu za vidljivu prljavštinu.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Wudu — abdest",
    summary: "Naručeno pranje koje uklanja sitne nečistoće i priprema vas za molitvu.",
    body: [
      "Wudu je ritualno pranje koje uklanja manje nečistoće. To je potrebno prije svakog namaza, osim ako još uvijek niste u ispravnom stanju iz prethodnog, i — prema većini učenjaka — prije dodirivanja fizičkog teksta Kur'ana. Njegova četiri obavezna pranja su imenovana direktno u Kur'anu (5:6): lice, ruke do lakata, brisanje glave i stopala do članaka.",
      "Poslanik, sallallahu alejhi ve sellem, je obavio vudu po utvrđenom redoslijedu, tri puta za oprane udove, temeljno, ali bez trošenja vode - upozoravao je na ekstravaganciju čak i na rijeci koja teče. Osim četiri obavezna čina, ispiranje usta i nosa, prvo pranje ruku i korištenje misvaka su utvrđeni sunneti koji upotpunjuju i uljepšavaju vudu.",
      "Njegova nagrada je ogromna: Poslanik, sallallahu alejhi ve sellem, je učio da dok vjernik pere svaki ud, grijesi koje je počinio tim udom otpadaju s vodom — čak i ispod noktiju — tako da on izlazi očišćen. Wudu stoga nije samo formalnost, već mali čin oprosta prije svake molitve.",
      "Wudu se prekida bilo čim što izlazi iz privatnih prolaza (urin, stolica, vjetar), dubokim snom koji uklanja svijest i gubitkom svijesti. Ako pukne tokom namaza, morate prestati, obnoviti namaz i ponovo započeti namaz.",
    ],
    steps: [
      {
        title: "Namjera & Bismillah",
        body: "Namjerite vudu u svom srcu i počnite s 'Bismillah'. Namjera je unutrašnja i ne mora biti izražena.",
        tip: "Koristite misvak (siwak) unaprijed kada možete – sunnet koji je Poslanik, sallallahu alejhi ve sellem, volio i skoro postao obavezan.",
      },
      {
        title: "Operite ruke",
        body: "Operite obje ruke do zapešća tri puta, radnom vodom između prstiju.",
      },
      {
        title: "Isperite usta",
        body: "Uzmite vodu u usta, zavrtite je i izbacite - tri puta.",
      },
      {
        title: "Isperite nos",
        body: "Desnom rukom uvucite vodu u nozdrve, a lijevom izbacite - tri puta.",
      },
      {
        title: "oprati lice (farz)",
        body: "Operite cijelo lice jednom do tri puta, od linije kose do brade i od uha do uha; čovjek provlači vlažne prste kroz gustu bradu.",
      },
      {
        title: "oprati ruke (farz)",
        body: "Operite desnu ruku, zatim lijevu, od vrhova prstiju do i uključujući laktove - po tri puta.",
      },
      {
        title: "Obriši glavu (farz)",
        body: "Vlažnim rukama obrišite glavu jednom sprijeda prema nazad i opet nazad, a zatim obrišite unutrašnjost i stražnju stranu ušiju istom vlažnošću.",
      },
      {
        title: "oprati noge (farz)",
        body: "Operite desnu nogu, zatim lijevu, do i uključujući gležnjeve - po tri puta, prolazeći prstima između prstiju.",
      },
      {
        title: "Svjedočanstvo vjere",
        body: "Zajedno sa dovom: 'Ashhadu an la ilaha illallah...' — osam kapija raja se otvaraju za onoga ko to izgovori nakon vudua.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kada sluga opere lice u vudu, svaki grijeh koji je pogledao svojim očima odlazi sa vodom... dok ne izađe očišćen od grijeha.",
      },
    ],
    quran: [
      {
        excerpt:
          "O vjernici, kada ustanete na molitvu, operite svoja lica i svoje podlaktice do lakata, obrišite svoje glave i operite noge svoje do članaka.",
      },
    ],
    actions: [
      "Jednom polako obavite vudu dok čitate svaki korak naglas, provjeravajući laktove i pete.",
      "Naučite napamet kratku dovu nakon vudua — vidjeti Riječi namaza.",
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
    title: "Odjeća i awrah",
    summary: "Pokrijte ono što mora biti pokriveno - čisto, skromno i s poštovanjem.",
    body: [
      "Pokrivanje avre — dijelova tijela koji se moraju sakriti — je uslov valjane molitve, izvučen iz Allahove naredbe da 'uzmite svoj ukras na svakom mjestu molitve' (7:31). Odjeća mora biti čista od nadžasa i dovoljno neprozirna da se boja kože ne vidi.",
      "Za muškarce, avra u namazu je, najmanje, od pupka do koljena. Međutim, ne voli se moliti golih grudi kada je odjeća dostupna; Poslanik, sallallahu alejhi ve sellem, je uputio da čovjek ne treba klanjati ni u jednoj odjeći bez dijela preko ramena.",
      "Za žene je cijelo tijelo avra u namazu osim lica i ruku, prema većini učenjaka; žena pokriva kosu, vrat i stopala, obično širokom odjećom i maramom. Učenjaci se razlikuju oko stopala, neki smatraju da su uključena u ono što se može pokazati - molitva s njima pokrivena je sigurnija i praksa većine.",
      "Dva pravila o oblačenju važe i izvan molitve: svila i zlato su zabranjeni muškarcima da nose (dozvoljeno ženama), a odjeća ne bi trebala biti toliko uska, prozirna ili privlačeći pažnju da pobjeđuje skromnost na koju molitva poziva. Kao pravilo, molite se u onome što biste obukli da upoznate nekoga koga poštujete - a ne u spavaćici ili odeći za plažu.",
    ],
    quran: [
      {
        excerpt: "O djeco Adamova, uzmite svoj ukras na svakom mjestu molitve.",
      },
    ],
    actions: [
      "Odvojite jednu čistu, skromnu odjeću ili posvećenu molitvenu odjeću kako biste uvijek bili spremni.",
      "Kada niste sigurni da li nešto pokriva dovoljno, pokrijte više, a ne manje.",
    ],
    disclaimer:
      "Detalji awraha (posebno ženskih stopala) su tačka poštovanja naučnih razlika. Pratite pouzdanu lokalnu stipendiju tamo gdje se razlikujete.",
  },
  {
    title: "Vrijeme molitve",
    summary: "Pet dnevnih prozora — svaki namaz ima početak, kraj i željeni trenutak.",
    body: [
      "Allah je odredio namaz 'u određeno vrijeme' (4:103), podijelivši dan i noć na pet prozora vezanih za kretanje sunca. Molitva prije otvaranja prozora je nevažeća; odlaganje molitve pored prozora bez opravdanja je ozbiljan grijeh. Kad god je moguće, klanjajte rano na prozoru - Poslanik, sallallahu alejhi ve sellem, je namaz prvi put nazvao među najomiljenijim djelima Allahu.",
      "Pet prozora su: Fadžr, od prave zore do izlaska sunca; Dhuhr, od sunca koje prolazi kroz zenit dok senka objekta ne bude jednaka njegovoj sopstvenoj dužini; Asr, od kraja zura do zalaska sunca (najbolje moliti prije nego što sunce požuti); Magrib, od zalaska sunca do nestajanja crvenog sumraka; i Isha, od sumraka do prave zore (najbolje moliti se prije ponoći).",
      "Postoje tri kratka perioda u kojima je dobrovoljni namaz zabranjen, tako da se ibadet nikada ne miješa sa obožavanjem sunca: dok sunce izlazi dok potpuno ne izađe, kada stoji tačno u zenitu u podne, i kako zalazi dok potpuno ne zađe. Nadoknađivanje propuštenog obaveznog namaza je izuzeto od ove zabrane.",
      "Tačna vremena na satu se pomjeraju svakodnevno s vašom geografskom širinom i godišnjim dobima, zbog čega ih je Poslanik, sallallahu alejhi ve sellem, vezao za prirodne znakove, a ne za fiksni sat. Aplikacija ih izračunava za vašu lokaciju – ali poznavanje osnovnih znakova održava vas prizemljenim kada tehnologija nije dostupna.",
    ],
    steps: [
      {
        title: "Fadžr — 2 rekata farz",
        body: "Prava zora do izlaska sunca. Prethodi mu jako naglašen sunnet od 2 rekata.",
      },
      {
        title: "Zur — 4 rekata farz",
        body: "Nakon što sunce prođe svoj zenit do Asr sjene. Sunnet od 4 prije i 2 poslije.",
      },
      {
        title: "Asr — 4 rekata farz",
        body: "Od kraja Dhuhra do zalaska sunca; moli to prije nego sunce požuti. Često se poistovjećuje sa 'srednjom molitvom' iz 2:238.",
      },
      {
        title: "Magrib — 3 rekata farza",
        body: "Od zalaska sunca do sumraka; molite se odmah. Sunnet od 2 poslije.",
      },
      {
        title: "Iša — 4 rekata farza",
        body: "Od sumraka do zore; najbolje prije ponoći. Slijedi Witr.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Tri su puta u kojima nam je Poslanik, sallallahu alejhi ve sellem, zabranio klanjanje: kada sunce izlazi dok ne izađe, kada stoji u podne i kada zalazi dok ne zađe. (Uqbah ibn 'Amir)",
      },
    ],
    quran: [
      {
        excerpt: "Zaista, molitva je vjernicima određena odredbom određenog vremena.",
      },
      {
        excerpt:
          "I uspostavi molitvu na dva kraja dana i na početku noći. Zaista, dobra djela tjeraju zla djela.",
      },
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Početak Asr ima dva prijavljena mišljenja (sjena jednaka ili dvostruko dužini objekta). Oba su važeća; slijedite svoj lokalni proračun i zajednicu.",
  },
  {
    title: "Okrenuti se prema kibli",
    summary: "Okrenite se prema Svetoj kući u Mekki - smjeru koji ujedinjuje ummet.",
    body: [
      "Kibla je smjer ka'be unutar Mesdžid al-Harama u Mekki. Suočavanje s njim je uslov valjane molitve. Rano u islamu muslimani su se molili prema Jerusalemu; tada je Allah objavio naredbu da se okrene prema Svetoj džamiji, i od tada jedan pravac ujedinjuje vjernike svijeta - svakodnevni, fizički izraz jedne zajednice okrenute prema jednom Gospodaru.",
      "Od vas se traži da se suočite s kiblom onoliko precizno koliko možete razumno odrediti - sa kompasom, džamijskim mihrabom, pouzdanom aplikacijom ili suncem i zvijezdama kada putujete. Malo, neizbježno odstupanje se oprašta; ono što je važno je iskreni napor u pravom smjeru.",
      "Ako zaista ne možete da odredite pravac – izgubljeni na moru, u oblaku, u nepoznatoj zemlji noću – nastojte da to rešite i onda se molite za svoju najbolju procenu; namaz je validan čak i ako se kasnije pokaže da je malo pogrešio. U vozilu ili avionu u pokretu gdje je nemoguće okrenuti se prema kibli za obavezni namaz, suočite se sa svime što možete, jer Allah ne opterećuje dušu preko njenih mogućnosti.",
    ],
    quran: [
      {
        excerpt:
          "Zato okrenite svoje lice prema al-Masjid al-Haramu. I gde god da se nalazite, okrenite svoja lica prema tome.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kada ustanete da klanjate, dobro obavite vudu, zatim se suočite sa kiblom i izgovorite tekbir. (iz hadisa čovjeka koji je loše klanjao)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ezan — ezan",
    summary: "Riječi koje prizivaju ummet, njihovo značenje i kako na njih odgovoriti.",
    body: [
      "Ezan je poziv kojim se najavljuje da je došlo vrijeme namaza. To je zajednički sunnet za pet dnevnih namaza (ne za Bajram ili dženazu), koji se daju sa podignutog mjesta kako bi se zajednica okupila da klanja. Nakon toga, neposredno prije početka namaza, slijedi drugi, kraći poziv - ikamet.",
      "Kada čujete ezan, sunnet je ponavljanje svake fraze nakon muazina - osim kod 'Hayya 'ala as-Namaz' i 'Hayya 'ala al-falah', gdje umjesto toga kažete 'La hawla wa la quwwata illa billah' (nema moći ni snage osim kod Allaha). U Fadžr ezanu pozivalac dodaje 'As-salatu khayrun min an-nawm' (namaz je bolji od sna).",
      "Nakon što se ezan završi, pošaljite blagoslov (salawat) na Poslanika, sallallahu alejhi ve sellem, zatim proučite utvrđenu dovu tražeći od Allaha da mu podari hvaljeno mjesto (al-wasilah) - Poslanik, sallallahu alejhi ve sellem, je obećao svoje posredovanje onome ko to kaže. Trenutak između ezana i ikameta je vrijeme kada se dova ne odbija, stoga slobodno činite dovu.",
    ],
    steps: [
      {
        title: "Allahu ekber (×4)",
        body: "Allah je najveći - veći od svega što bi vam moglo odvući pažnju.",
      },
      {
        title: "Ashhadu an la ilaha illallah (×2)",
        body: "Svjedočim da nema boga osim Allaha.",
      },
      {
        title: "Ashhadu anna Muhammadan rasulullah (×2)",
        body: "Svjedočim da je Muhammed Allahov Poslanik.",
      },
      {
        title: "Hayya 'ala as-Namaz (×2)",
        body: "Dođite na molitvu. Odgovorite sa: La hawla wa la quwwata illa billah.",
      },
      {
        title: "Hayya 'ala al-falah (×2)",
        body: "Dođite do uspeha. Odgovorite sa: La hawla wa la quwwata illa billah.",
      },
      {
        title: "Allahu ekber (×2)",
        body: "Allah je Najveći.",
      },
      {
        title: "La ilahe illallah",
        body: "Nema boga osim Allaha - poziv se završava na istoj riječi prema kojoj je otvoren.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ko kaže kad čuje poziv: 'O Allahu, Gospodaru ovog savršenog poziva i utvrđene molitve, daj Muhammedu vasilu i vrlinu...' — moj će zagovor biti njegov na Sudnjem danu. (Jabir)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Namaz korak po korak",
    summary: "Potpuni slijed rekata - svaka recitovana fraza, sa svojom odlukom.",
    body: [
      "Svaki namaz se sastoji od jedne jedinice koja se ponavlja – rekata: stojite i učite, klanjate se, ustajete, klanjate dva puta i (na kraju namaza) sjedite za tešahhud i dajete selam. Dobro naučite jedan rekat i možete klanjati bilo koji namaz, jer duži namazi jednostavno ponavljaju ovu jedinicu. Koraci u nastavku daju redom svaku radnju, tačne riječi koje treba izgovoriti na arapskom sa njihovim značenjem i malu oznaku koja pokazuje da li je radnja stub, obavezna radnja ili preporučena.",
      "Učenjaci razvrstavaju radnje namaza u tri nivoa. Farz (stub / rukn) je neophodan: izostavite ga — čak i greškom — i namaz, ili taj rekat, je nevažeći dok se ne obavi. Vadžib (zahtjev čin) je obavezan, ali ako ga zaboravite, popravljate namaz klanjanjem zaborava (sudžud as-sahw) umjesto da ga ponavljate. Sunnet se preporučuje i nagrađuje, a namaz je bez njega potpun i valjan. Tamo gdje škole fikha stavljaju radnju u drugu kategoriju, savjeti to primjećuju - ova trostruka granica je sama po sebi jedno od klasičnih područja naučnih razlika.",
      "U cijelom, jedina kvaliteta koja se nikada ne smije izgubiti je tuma'ninah — mirnoća: potpuno se smjestiti u svaki položaj, s udovima u mirovanju, prije nego što krene dalje. Poslanik, sallallahu alejhi ve sellem, je poslao čovjeka koji je žurno klanjao namaz tri puta, rekavši: 'Vrati se i moli, jer nisi klanjao', a zatim ga je naučio da bude smiren u svakom položaju. Krećite se između položaja sa tekbirom 'Allahu Akbar' i držite pogled na mjestu sedžde.",
      "Koliko rekata i gdje sjedite: namaz od dva rekata (fadžr i džuma) ima jedno sjedenje — posljednji tešahud nakon drugog rekata — zatim selam. Namaz od tri rekata (Maghrib) i namaz od četiri rekata (Zuhr, Asr, Isha) sjede za prvi, kraći tešehhud nakon drugog rekata, zatim stoje za preostale rekate (rekate) – učeći samo Fatihu u njima, bez dodane sure – i ponovno sjedite za posljednji tešahhud i salahhud.",
      "Glasno ili u tišini: Fatiha i sura se naglas uče (džahri) u Fadžru, džumi i prva dva rekata Magriba i Iše; uče se tiho (sirri) u Dhuhr i Asr, na trećem rekatu Magriba, te na trećem i četvrtom rekatu Isha. Svaki drugi izraz u namazu - tesbih ruku i sujud, teshahhud i tako dalje - izgovara se tiho. Neko ko se moli sam može recitirati naglas u molitvama naglas ili ih držati tiho; sljedbenik iza imama jednostavno sluša dok imam recitira naglas.",
      "Neki dodaci pripadaju određenim molitvama ili trenucima. U Vitr-namazi mnogi uče Kunut na posljednjem rekatu — podižući ruke da mole za vodstvo i zaštitu (dobro poznata formulacija počinje 'Allahumma-hdini fiman hadayt...'). U vremenima teškoća, Kunut an-Nazilah se može dodati obaveznim namazama, a škole se razlikuju u odnosu na stojeći Kunut na Fadžru. Ako se kasno pridružite džematu (masbuk), sve što uhvatite kod imama se računa i nadoknađujete rekate koje ste propustili nakon njegovog selama. A ako dodate ili ispustite nešto greškom, pogledajte vodič za sujud as-sahw.",
    ],
    steps: [
      {
        title: "1. Namjera i stajanje (niyyah & qiyam)",
        body: "Okrenite se licem prema kibli i uspravite se — stajanje je stub svake obavezne molitve za svakoga ko može. Odredite u srcu koju konkretnu molitvu ćete moliti; namjera je unutrašnja odlučnost, a ne rečenica izgovorena naglas.",
        tip: "Usmjerite oči na mjesto sujuda i zadržite ih tamo. Svako ko iskreno ne može da izdrži moli se sedeći, a zatim lažući - sama molitva se nikada ne ispušta.",
      },
      {
        title: "2. Otvaranje tekbira (Takbirat al-Ihram)",
        body: "Podignite ruke do ramena ili ušnih resica i izgovorite tekbir, a zatim stavite desnu ruku preko lijeve na prsa. Ovim počinje namaz, a običan govor i kretanje sada su zabranjeni do selama.",
        translation: "Allah je Najveći.",
        tip: "Podizanje ruku (raf' al-yadayn) sa tekbirom je potvrđeni sunnet, a ne stub.",
      },
      {
        title: "3. Otvaranje dove (Du'a al-Istiftah)",
        body: "Učite tiho kratku uvodnu dovu da smirite srce pred Allahovim riječima. Izvještava se o nekoliko autentičnih formulacija; ovo je jedan od najčešćih.",
        translation:
          "Slava Tebi, Allahu, i hvala. Blagoslovljeno Tvoje ime i uzvišeno Tvoje Veličanstvo. Nema boga osim Tebe.",
      },
      {
        title: "4. Ta'awwudh & Basmalah",
        body: "Potražite utočište kod Allaha od šejtana, a zatim počnite sa Basmalom, prije Al-Fatihe. Oboje se izgovara tiho, čak i u glasnim molitvama.",
        translation:
          "Utječem se Allahu od šejtane, prokletog. U ime Allaha, Potpuno Milostivog, Posebno Milostivog.",
      },
      {
        title: "5. Učiti Al-Fatihu",
        body: "Učite Otvaranje Knjige na svakom rekatu — 'Nema namaza za onoga ko ne uči Otvaranje Knjige.' Imam i usamljeni klanjač ga čitaju naglas u glasnim molitvama; inače se recituje tiho.",
        translation:
          "U ime Allaha, Potpuno Milostivog, Posebno Milostivog. Sva hvala pripada Allahu, Gospodaru svjetova - Potpuno Milostivom, Naročito Milostivom, Vladaru Dana nadoknade. Tebe obožavamo i od Tebe tražimo pomoć. Uputi nas na pravi put - put onih kojima si dao naklonost, a ne onih koji su zaradili ljutnju ili onih koji su zalutali.",
        tip: "Izgovorite 'Amin' nakon toga (naglas u glasnim molitvama). hanefijski razred koji uči neki Kur'an kao stub i Al-Fatihu posebno kao vadžib; većina drži Al-Fatihu sama po sebi stub na svakom rekatu.",
      },
      {
        title: "6. Učite suru ili neke ajete",
        body: "Samo na prva dva rekata slijedite Al-Fatihu sa kratkom surom ili nekoliko ajeta — na primjer sura Al-Ikhlas ('Qul huwa Allahu ahad...'). Na trećem i četvrtom rekatu učite samo Fatihu.",
        tip: "Preporučeno za usamljene klanjače i imama; pratilac sluša. Hanefije smatraju da je dodavanje sure u prva dva rekata vadžib.",
      },
      {
        title: "7. Klanjanje (ruku)",
        body: "Recite 'Allahu Akbar' i naklonite se ravnih, ravnih leđa, rukama držeći koljena, i slavite svog Gospodara tri ili više puta, bez žurbe.",
        translation: "Slava je mome Gospodaru, Veličanstvenom.",
        tip: "Sam luk, koji se drži u miru, je stub; tesbih koji se u njemu uči je sunnet (vadžib u nekim školama).",
      },
      {
        title: "8. Ustajanje sa ruku (i'tidal)",
        body: "Ustanite potpuno uspravno - imam i usamljeni klanjač izgovaraju tasmi', i svi koji govore tahmid - i stanite potpuno mirno prije nego što se spustite.",
        translation: "Allah čuje onoga ko Ga hvali. Gospode naš, Tebi pripada svaka hvala.",
        tip: "Uspravno i opušteno stajanje je stub — nemojte tonuti u sujud dok se ne nastanite ovdje.",
      },
      {
        title: "9. Sedžda (sudžud)",
        body: "Recite 'Allahu Akbar' i klanjajte se na sedam kostiju - čelo zajedno sa nosom, oba dlana, oba koljena i prsti obje noge - veličajući Svevišnjeg tri ili više puta. Ovo je položaj najbliži Allahu, pa izlijte dovu nakon tesbiha.",
        translation: "Slava je mom Gospodu, Svevišnjem.",
        tip: "Držite podlaktice podignute od tla i dalje od bokova, a trbuh od bedara.",
      },
      {
        title: "10. Sjedenje između dvije sedžde (dželsah)",
        body: "Ustanite od prvog sujuda govoreći 'Allahu Akbar', sjedite mirno i uspravno i zamolite svog Gospodara za oprost prije nego što ponovo klanjate.",
        translation: "Gospodaru, oprosti mi.",
        tip: "Sedite dok vam ne bude opušteno — ovo kratko sedenje, sa mirom, predstavlja stub za sebe.",
      },
      {
        title: "11. Druga sedžda",
        body: "Reci 'Allahu Akbar' i klanjaj drugi put isto kao i prvi, sa istim tesbihom i istom tišinom. Ovim je završen jedan puni rekat.",
        translation: "Slava je mom Gospodu, Svevišnjem.",
      },
      {
        title: "12. Stanite za sljedeći rekat",
        body: "Recite 'Allahu Akbar' i ustanite, a zatim ponovite iz Al-Fatihe. Na trećem i četvrtom rekatu učiti samo Fatihu, bez dodane sure.",
        tip: "U namazu od dva rekata ne stojite ponovo nakon drugog rekata – ostajete sjediti za posljednji tešehhud.",
      },
      {
        title: "13. Prvi tešehhud (u 3 i 4 rekata namaza)",
        body: "Nakon drugog rekata Magriba, Zhura, Asra ili Isha, sjednite i recite At-Tahiyyat, a zatim stanite za preostali rekat(e). Namaz od dva rekata nema prvi tešehhud.",
        translation:
          "Svi pozdravi, dove i čiste riječi su za Allaha. Neka je mir na tebe, o Poslaniče, i Allahova milost i Njegovi blagoslovi. Neka je mir na nas i na Allahove pravedne robove. Svjedočim da nema boga osim Allaha, i svjedočim da je Muhamed Njegov rob i Poslanik.",
        tip: "Podignite desni kažiprst u sjedenju. Ako zaboravite prvi tešehhud i počnete da stojite, nastavite i učinite sujud as-sahw prije selama — nemojte se vraćati.",
      },
      {
        title: "14. Završni tašehhud",
        body: "U posljednjem sjedenju svake molitve, recite isti At-Tahiyyat prikazan gore. Sjedenje za posljednji tešehhud i njegovo učenje je stub namaza.",
      },
      {
        title: "15. Blagoslovite Poslanika, sallallahu alejhi ve sellem, (Salawat)",
        body: "Nakon posljednjeg At-Tahiyyjata, pošalji salavat na Poslanika, sallallahu alejhi ve sellem, riječima koje je on sam podučio svojim ashabima.",
        translation:
          "Allahu, pošalji blagoslov na Muhammeda i porodicu Muhammedovu, kao što si blagoslovio Ibrahima i porodicu Ibrahimovu; zaista si hvale dostojan, slavan. O Allahu, daj milost Muhammedu i porodici Muhammedovoj, kao što si dao naklonost Ibrahimu i porodici Ibrahimov; zaista si hvale dostojan, slavan.",
        tip: "Šafijske i hanbelijske škole smatraju da je salavat na završnoj sjednici obavezan.",
      },
      {
        title: "16. Molite se prije selama",
        body: "Prije nego što završite, tražite utočište kod Allaha od četiri iskušenja - zatim učinite dovu koju želite, za ovaj i sljedeći život, na arapskom ili svom jeziku.",
        translation:
          "O Allahu, utječem Ti se od kaburske, od džehennemske kazne, od iskušenja života i smrti, i od zla iskušenja Lažnog Mesije (Dedžala).",
      },
      {
        title: "17. Završni selam (Taslim)",
        body: "Završite molitvu okretanjem lica udesno, zatim ulijevo, svaki put dajući pozdrav mira. Sa selamom namaz je završen.",
        translation: "Mir i Allahova milost neka je na vama.",
        tip: "Prvi taslim (desno) je stub; drugi (lijevo) je sunnet u nekim školama.",
      },
    ],
    hadith: [
      {
        excerpt: "Molite se kao što ste me vidjeli kako se molim. (Malik ibn al-Huwayrith)",
      },
      {
        excerpt:
          "'Vrati se i klanjaj, jer nisi klanjao' — ponovljeno tri puta — a zatim je učio: reci tekbir, uči šta možeš od Kur'ana, zatim se klanjaj dok ne budeš opušten, ustaj dok ne stojiš, klanjaj dok ne budeš opušten... (Čovjek koji je loše klanjao; također Sahih Musliman 397)",
      },
      {
        excerpt:
          "Ne postoji dova za onoga ko ne čita Otvaranje Knjige. (Ubadah ibn as-Samit; također Sahih Musliman 394)",
      },
    ],
    appLinks: [{}, { label: "Glasno i tiho učenje" }, {}, {}, {}],
  },
  {
    title: "Glasno i tiho učenje",
    summary:
      "Koje rekate imam uči naglas, koje tiho, i šta vi činite iza njega ili kada klanjate sami.",
    body: [
      "Jedno od najčešćih pitanja postaje jednostavno kada razumijete dva načela: neki namazi uče se naglas (džehri), a neki tiho (sirri). Poslanik ﷺ klanjao je na oba načina, ashabi su prenijeli taj obrazac, a on je potvrđen u glavnim zbirkama hadisa.",
      "Prva dva rekata svakog namaza su „dugi rekati“: Fatiha pa još jedna sura ili ajeti. Na preostalim rekatima trorekatnog ili četverorekatnog namaza Poslanik ﷺ obično je učio samo Fatihu. Zato glasno učenje u akšamu i jaciji završava nakon drugog rekata, dok su podne i ikindija tihi od početka do kraja.",
      "Allah nije izričito objasnio zašto su neki namazi glasni, a drugi tihi. Učenjaci navode mudrosti, ali muslimani slijede ovaj obrazac zato što je sunnet. Allah kaže: „Vi u Allahovom Poslaniku imate divan uzor“ (33:21).",
      "Iza imama na glasnom namazu postoji saglasnost da se sluša Kur'an i da se druga sura ne uči naglas. Tiho učenje Fatihe dok imam uči poznato je pitanje razilaženja četiri mezheba; sva mišljenja su priznata. Na tihim namazima imam uči tiho, a svaki klanjač postupa prema svom mezhebu.",
      "Kada klanjate sami, učite Fatihu na svakom rekatu i dodatnu suru na prva dva; na kasnijim rekatima samo Fatihu. Na glasnim namazima pohvalno je da pojedinac uči čujno, ali namaz je ispravan i ako uči tiho.",
    ],
    steps: [
      {
        title: "Sabah — oba rekata naglas",
        body: "Imam uči naglas na oba rekata. Slušajte iza njega i ne učite drugu suru naglas. Za Fatihu pogledajte korak o mezhebima.",
      },
      {
        title: "Podne — sva četiri rekata tiho",
        body: "Imam uči tiho na svakom rekatu. Iza njega učite za sebe prema svom mezhebu.",
      },
      {
        title: "Ikindija — sva četiri rekata tiho",
        body: "Kao podne: imam uči potpuno tiho, a klanjač iza njega postupa prema svom mezhebu.",
      },
      {
        title: "Akšam — prvo naglas, zatim tiho",
        body: "Prvi i drugi rekat su glasni, treći je tih. Slušajte prva dva; na trećem učite prema svom mezhebu.",
      },
      {
        title: "Jacija — prvo naglas, zatim tiho",
        body: "Prvi i drugi rekat su glasni, treći i četvrti tihi. Slušajte prva dva; na posljednja dva učite za sebe.",
      },
      {
        title: "Zašto samo prva dva rekata?",
        body: "Ebu Katada prenosi da je Poslanik ﷺ na prva dva rekata podne i ikindije učio Fatihu i suru, a na posljednja dva samo Fatihu. To objašnjava duge i kratke rekate.",
      },
      {
        title: "Iza imama pri glasnom učenju — saglasnost",
        body: "Kada se Kur'an uči naglas, slušajte. Ne nadmećite se s imamom. Allah kaže: „A kad se uči Kur'an, vi ga slušajte i šutite da biste bili pomilovani“ (7:204).",
      },
      {
        title: "Fatiha iza imama — četiri mezheba",
        body: "Hanefije ne uče Fatihu pri glasnom učenju; malikije uglavnom slušaju; šafije je uče na svakom rekatu, i iza imama; kod hanbelija postoje dva predanja, a mnogi je preporučuju kada ima prilike.",
        tip: "Slijedite uputu mezheba koju ste naučili od pouzdanog učitelja. Nijedan mezheb ne dopušta glasno učenje sure preko imama.",
      },
      {
        title: "Iza imama na tihom namazu",
        body: "Hanefije prema pouzdanom stavu tiho slave Allaha i zikre bez Fatihe; malikije čine lagani zikr prema okolnostima; šafije i hanbelije tiho uče Fatihu na svakom rekatu.",
      },
      {
        title: "Kada klanjate sami",
        body: "Tekst se ne mijenja, samo jačina glasa: Fatiha na svakom rekatu, sura na prva dva, zatim samo Fatiha. Glasno učenje na sabahu, akšamu i jaciji je pohvalno.",
      },
    ],
    quran: [
      { excerpt: "Vi u Allahovom Poslaniku imate divan uzor." },
      { excerpt: "A kad se uči Kur'an, vi ga slušajte i šutite da biste bili pomilovani." },
    ],
    hadith: [
      {
        excerpt:
          "Poslanik ﷺ učio je Fatihu i suru na prva dva rekata podne i ikindije, a samo Fatihu na posljednja dva. (Ebu Katada; Sahih Muslim 451)",
      },
      {
        excerpt:
          "Nema namaza onome ko ne prouči Otvaranje Knjige. (Ubada ibn es-Samit; Sahih Muslim 394)",
      },
      {
        excerpt:
          "Davao bi da se primijeti duže učenje na prva dva rekata podne i ikindije, a kraće na posljednja dva. (Ebu Katada)",
      },
    ],
    actions: [
      "Na sljedećem namazu u džematu primijetite koje rekate imam uči naglas.",
      "Pitajte učitelja svog mezheba učite li Fatihu iza imama pri glasnom učenju.",
      "Kada klanjate sami, pokušajte sabah učiti naglas da osjetite ovaj sunnet.",
    ],
    appLinks: [
      { label: "Namaz korak po korak" },
      { label: "Namaz u džematu" },
      { label: "Riječi i značenja" },
    ],
    disclaimer:
      "Četiri mezheba razlikuju se o učenju Fatihe iza imama na glasnim i tihim namazima. Ova lekcija izlaže sva mišljenja bez proglašavanja jednog jedinim ispravnim. Pojedinosti svog mezheba učite od kvalifikovanog učitelja.",
  },
  {
    title: "Svaka pozicija",
    summary: "Kako pravilno držati svoje tijelo u svakom položaju molitve.",
    body: [
      "Svaki položaj u namazu ima tjelesni oblik koji je Poslanik, sallallahu alejhi ve sellem, pokazao, a njegovi ashabi sačuvani. Učenje ispravnog oblika štiti vašu molitvu od uobičajenih fizičkih grešaka i pomaže tijelu da podrži poniznost srca, a ne odvrati pažnju od nje.",
      "Blizina sedžde zaslužuje posebnu pažnju: Poslanik, sallallahu alejhi ve sellem, je rekao: 'Sluga je najbliže svome Gospodaru kada je na sedždi, zato se tada mnogo molite.' Sedžda koja se drži u tišini i iskrenosti je jedan od najmoćnijih trenutaka u danima vjernika.",
    ],
    steps: [
      {
        title: "stojeći (qiyam)",
        body: "Uspravno, stopala otprilike u širini ramena, izbalansirana težina, pogled na mjesto sujuda, desna ruka preko lijeve na grudima.",
      },
      {
        title: "Podizanje ruku (raf' al-yadayn)",
        body: "Dlanovi okrenuti prema kibli, u ravni sa ramenima ili ušnim školjkama - na početnom tekbiru, i (većinom) također ulaze i dižu se sa ruku.",
      },
      {
        title: "klanjanje (ruku)",
        body: "Leđa ravna i ravna, glava nije ni podignuta ni spuštena, prsti rašireni držeći koljena, ruke odmaknute sa strane.",
      },
      {
        title: "sedžda (sudžud)",
        body: "Čelo i nos na tlu, dlanovi ravni blizu ramena ili ušiju, laktovi podignuti i odmaknuti od poda, koljena dolje, prsti savijeni prema kibli.",
      },
      {
        title: "sjedenje (iftiraš)",
        body: "Između dvije sedžde i na prvom tešahudu: sjedite na lijevoj položenoj nozi sa uspravnom desnom nogom, ruke oslonjene na bedra.",
      },
      {
        title: "Završna sjednica (tawarruk)",
        body: "U posljednjem tešehudu namaza od 3 ili 4 rekata (sunnet šafijske i hanbelijske škole): pređite lijevom nogom ispod desne noge i sjednite na zemlju.",
      },
      {
        title: "Okretanje glave za selam (taslim)",
        body: "Okrenite lice potpuno udesno, zatim ulijevo, sa riječima mira - završavajući molitvu dok pozdravljate anđele na svakom ramenu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Najbliže sluga svome Gospodaru dolazi kada je na sedždi, zato se mnogo molite. (Ebu Hurejre)",
      },
    ],
    disclaimer:
      "Manje razlike u postavljanju ruku, načinu sjedenja i podizanju ruku su sve ukorijenjene u autentičnim izvještajima; svaka škola prati valjanu naraciju. Nijedna ne poništava tuđu molitvu.",
  },
  {
    title: "Uobičajene greške",
    summary: "Greške koje tiho slabe molitvu - i kako ispraviti svaku od njih.",
    body: [
      "Većina grešaka u molitvi nisu grijesi srca, već navike žurbe i nepažnje. Imenovanje je prvi korak da ih popravite; sam Poslanik, sallallahu alejhi ve sellem, je strpljivo i direktno ispravljao ashabovu dovu, što nas uči da su ove greške uobičajene i popravljive.",
      "Najveći juri — kljuca kroz ruku i sujud bez mirovanja. Tuma'ninah (umjerena tišina) je stub namaza za većinu učenjaka, tako da žurna molitva nije samo nesavršena već može biti i nevažeća. Prođite jednu po jednu naviku na listi ispod.",
    ],
    steps: [
      {
        title: "Prebrzo moliti",
        body: "Jedva zastajkujući u ruku ili sujudu. Ostanite dok se vaše tijelo ne smiri i dok ne možete izgovoriti zikr najmanje tri puta bez žurbe.",
      },
      {
        title: "Nepotpuni vudu",
        body: "Suhe mrlje na petama, gležnjevima, laktovima ili između prstiju. Poslanik, sallallahu alejhi ve sellem, je upozorio: 'Teško petama od Vatre.' Operite polako i temeljno.",
      },
      {
        title: "Zakrivljena leđa u ruku, tonuća u sujudu",
        body: "Klanjanje sa zaobljenim leđima, ili oslanjanje čela bez nosa, ili puštanje podlaktica da leže ravno na podu. Leđa držite u visini, a laktove podignute.",
      },
      {
        title: "Lutajuće oči i srce",
        body: "Gledam okolo ili provjeravam telefon. Zadržite pogled na mjestu sudžuda i šutite ili uklonite telefon prije tekbira.",
      },
      {
        title: "Trka se ispred imama",
        body: "U džematu, prelazak na ruku ili sujud pred imamom. Slijedite ga – nikad ga ne prethodite – krećite se tek nakon njega.",
      },
      {
        title: "Govoriti, jesti ili se smijati",
        body: "Svaki namjerni govor, jelo, piće ili čujni smeh prekida molitvu. Namaz je razgovor samo sa Allahom.",
      },
      {
        title: "Učenje Al-Fatihe pogrešno",
        body: "Preskakanje riječi ili pravljenje grešaka koje mijenjaju značenje. Naučite ga savršeno - cijela molitva ovisi o tome.",
      },
    ],
    actions: [
      "Izmolite danas jedan namaz upola svoje uobičajene brzine i primijetite koliko je drugačiji osjećaj.",
      "Utišajte telefon ili ga ostavite u drugoj prostoriji prije nego izgovorite početni tekbir.",
      "Zamolite nekoga ko je upućen da pazi na jednu od vaših molitvi i ispravi vaše držanje.",
    ],
    appLinks: [{}],
  },
  {
    title: "Sunnetske prakse",
    summary:
      "Poslanikov, sallallahu alejhi ve sellem, preporučuje radnje koje uljepšavaju i umnožavaju nagradu za namaz.",
    body: [
      "Osim obaveznih radnji, Poslanik, sallallahu alejhi ve sellem, je modelirao mnoge preporučene prakse (sunen) oko namaza. Nisu obavezni, tako da izostavljanje jednog ne poništava namaz - ali svaki vas približava Allahu, zarađuje dodatnu nagradu i popravlja nedostatke u obaveznim namazama.",
      "Glavni među njima su redovni sunnet-namaz (sunen rawatib) koji se klanja prije i poslije farza. Nema svaka dobrovoljna molitva istu težinu: učenjaci razlikuju sunnet mu'akkadah (naglašen, redovno obavlja Poslanik, sallallahu alejhi ve sellem), sunnet ghayr mu'akkada (preporučen, ali manje naglašen) i opći nafl (opciono, bez fiksnog brojanja). Poznavanje razlike pomaže vam da odredite prioritete onoga što treba da pazite svakodnevno.",
      "Najjasniji dnevni raspored sa najjačim dokazima je dvanaest ravatiba: dva prije sabada, četiri prije zura, dva nakon zura, dva nakon magriba i dva nakon iša - dvanaest rekata čija je nagrada kuća izgrađena u raju. Pogledajte Vrste salaha lekcija za potpuni pregled po namazu s dokazima.",
    ],
    actions: [
      "Koristite misvak (siwak) prije vudua i namaza — Poslanik, sallallahu alejhi ve sellem, ga je skoro učinio obaveznim.",
      "Hodajte do džamije mirno i rano - svaki korak podiže čin i briše grijeh.",
      "Čuvajte dvanaest rekata sunneta rawatiba za obećanu kuću u raju.",
      "Desnom nogom ulazite u džamiju, a lijevom izlazite, svaki sa svojom dovom.",
      "Učite utvrđeni adhkar nakon svake molitve — vidjeti Poslije namaza.",
    ],
    hadith: [
      {
        excerpt:
          "Da nisam opterećivao svoj ummet, naredio bih im da koriste sivak prije svakog namaza. (Ebu Hurayrah; također Sahih Muslim 252)",
      },
      {
        excerpt:
          "Poslanik, sallallahu alejhi ve sellem, nikada nije zanemario dva rekata prije Fadžra. (Aishah; također Sahih Muslim 724)",
      },
      {
        excerpt:
          "Ko redovno klanja dvanaest rekata danju i noću, Allah će mu sagraditi kuću u džennetu - dva prije sabaha, četiri prije zura, dva nakon zura, dva nakon magriba i dva poslije iša. (Umm Habibah)",
      },
    ],
    appLinks: [
      {
        label: "Vrste namaza — rawatib vodič",
      },
      {
        label: "Sunnet i post-salah edhkar",
      },
      {
        label: "Džamijske dove",
      },
    ],
  },
  {
    title: "Khushu — prisustvo srca",
    summary: "Cilj cijelog putovanja: moliti se kao da vidite Allaha.",
    body: [
      "Khushu je poniznost, fokus i svijest da zaista stojite pred Allahom. To je ono što pretvara fizičke pokrete molitve u pravo obožavanje. Poslanik, sallallahu alejhi ve sellem, je definisao izvrsnost (ihsan) kao 'obožavati Allaha kao da Ga vidiš, jer iako Ga ne vidiš, On te sigurno vidi' — a to se nigdje ne praktikuje direktnije nego u namazu.",
      "Allah je time otvorio opis uspješnih vjernika: 'oni koji su ponizni u svojoj molitvi' (23:1–2). I oštro je upozorio na njegovu suprotnost - 'jaško onima koji se mole, a ne obaziru se na njihovu molitvu' - ukor koji je usmjeren na one čija se tijela kreću dok su im srca odsutna.",
      "Khushu je izgrađen, nije željen. Naučite značenje onoga što recitujete kako bi vas riječi pokrenule. Uklonite smetnje prije tekbira. Usporite i dajte svakom položaju mir. Razmislite o veličini Onoga kome se obraćate i stvarnosti da bi ova molitva mogla biti vaša posljednja. Svaki namaz klanjajte kao oproštajni namaz, kao što je Poslanik, sallallahu alejhi ve sellem, savjetovao.",
      "Ne dajte se obeshrabriti lutajućim mislima - čak su se i ashabi borili s njima. Borba da vratite fokus, iznova i iznova, sama je dio obožavanja. Khushu raste kroz cijeli život; doslednost je ono što ga neguje.",
    ],
    quran: [
      {
        excerpt: "Zaista su uspješni vjernici - oni koji su ponizni u svojoj molitvi.",
      },
      {
        excerpt: "Pa teško onima koji mole - onima koji ne obaziru se na njihovu molitvu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ihsan je obožavati Allaha kao da Ga vidite, jer iako Ga ne vidite, On vas sigurno vidi. (Džibrilov, Omerov hadis)",
      },
    ],
    actions: [
      "Pročitajte značenje jedne fraze iz Riječi namaza prije svake molitve ove sedmice.",
      "Pauzirajte tri sekunde bez žurbe u svakom položaju prije nego nastavite dalje.",
      "Zabilježite svoj nivo fokusa u dnevniku nakon namaza i gledajte kako se obrazac mijenja.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Stubovi i poništavači",
    summary: "Bez čega molitva ne može postojati — i šta je poništava.",
    body: [
      "Djela namaza dijele se na tri reda. Stubovi (arkan) su bitni dijelovi: izostavljanje namjerno poništava molitvu, a izostavljanje zaboravom mora se ispraviti vraćanjem na nju. Obavezne radnje (vadžibat) su potrebne, ali ako se zaborave popravljaju se sedždom zaborava (sudžud al-sahw). Sunnet upotpunjuje i uljepšava namaz, a napuštanje njih ne nosi kaznu.",
      "Poznavanje ove hijerarhije štiti vas od dvije krajnosti: tretiranja manjeg propusta kao pogubnog ili tretiranja pravog stupa kao opcionog. Kada ste u nedoumici u vezi sa stubom, molitva nije zdrava dok se ne ispuni.",
      "Zasebno, određene stvari poništavaju molitvu odmah u trenutku kada se dogode — jer su u suprotnosti sa stanjem same molitve. Drugi poništavaju vudu, čime se namaz završava. Čuvajte se i jednog i drugog kako se nikada ne biste molili u nevaljanom stanju, a da toga niste svjesni.",
    ],
    steps: [
      {
        title: "stubovi (arkan)",
        body: "Stajanje kad god je u mogućnosti, početni tekbir, učenje Fatihe, ruku, dizanje s nje, dvije sedžde, sjedenje između njih, posljednje sjedenje, tešehhud, selam, tuma'nina u svakom i pridržavanje ispravnog reda.",
      },
      {
        title: "Obavezne radnje (vadžibat)",
        body: "Kao što su drugi tekbiri, riječi zikra u ruku i sujud, i prvi tešahhud — popravljen od strane sujud al-sahw ako se zaboravi (prema hanbelijskim detaljima; škole se razlikuju).",
      },
      {
        title: "Poništavači vudua",
        body: "Bilo šta što izlazi iz prednjih ili stražnjih prolaza, dubokog sna, gubitka svijesti - i, prema nekim naučnicima, direktnog dodirivanja intimnih dijelova. Bilo koji od ovih završava molitvu.",
      },
      {
        title: "Poništavaju samu molitvu",
        body: "Namjerni govor, namjerno jelo ili piće, mnogo neprekidnih nepotrebnih pokreta, glasno smijanje, namjerno okretanje grudi od kible i otkrivanje awrah.",
      },
    ],
    appLinks: [{}],
    disclaimer:
      "Četiri škole različito klasifikuju neka djela - na primjer da li je prvi tešahhud vadžib ili sunnet, ili tačna lista onoga što zahtijeva sujud al-sahw. Saznajte detalje o vašoj školi od kvalifikovanog nastavnika.",
  },
  {
    title: "Sujud al-Sahw — ispravljanje grešaka",
    summary: "Sedžda zaborava koja popravlja izmiče u namazu.",
    body: [
      "Niko nije imun na zaboravljanje u namazu — čak je i Poslanik, sallallahu alejhi ve sellem, zaboravio, a zatim učio: 'Ja sam samo ljudsko biće poput tebe; Zaboravljam kao što ti zaboraviš, pa kad zaboravim, podsjeti me.' Iz njegovog vlastitog primjera dolazi ugrađeni lijek: dvije dodatne sedžde, nazvane sujud al-sahw (sedža zaborava), koje zakrpe male greške tako da se molitva ne mora ponavljati.",
      "Potreban je u tri široke situacije: dodavanje (klanjanje dodatnog rekata ili držanje greškom), izostavljanje (ostavljanje vadžiba kao što je prvi tešahud) ili sumnja (nesiguran koliko ste rekata klanjali). Nije potrebno za napuštanje sunneta, niti za namjerne greške - one imaju svoja pravila.",
      "Kada imate istinsku sumnju, vodeći princip je: odbacite sumnju, gradite na onome u šta ste sigurni (manji broj), završite namaz, a zatim napravite dvije sedžde. Ovo pretvara zbunjenost u ustaljenu, valjanu molitvu, a ne u tjeskobno nagađanje.",
      "Praktično: učinite dvije sedžde baš kao vaš uobičajeni sudžud, sa tekbirom prije i poslije, zatim selamom. Učenjaci se razlikuju oko toga da li dolaze prije ili poslije selama u zavisnosti od vrste greške - obje su autentično prijavljene, tako da je jedno prihvatljivo i nijedno ne poništava namaz.",
    ],
    hadith: [
      {
        excerpt:
          "Ako neko od vas nije siguran u svoju molitvu i ne zna koliko je klanjao – tri ili četiri – neka odbaci sumnju, nadogradi ono u što je siguran, pa klanja dvaput prije selama. (Ebu Sa'id al-Khudri)",
      },
      {
        excerpt:
          "Kada neko od vas posumnja u svoju molitvu, neka traži ono što je ispravno i potpuno na njoj, a zatim dajte selam i klanjajte dvaput. (Ibn Mes'ud; također Sahih Musliman 572)",
      },
    ],
    actions: [
      "Zapamtite pravilo za sumnju: gradite na manjem broju, završite, a zatim klanjajte dvaput.",
      "Ako shvatite da ste usred namaza napustili prvi tešehhud, nastavite i na kraju napravite sujud al-sahw.",
    ],
    appLinks: [{}],
    disclaimer:
      "Da li će dvije sedžde pasti prije ili poslije selama zavisi od greške, a škole se razlikuju. Oba su iz sunneta; ne dozvolite da vas nesigurnost spriječi u molitvi.",
  },
  {
    title: "Vrste namaza",
    summary:
      "Fard, sunnet mu'akkada, sunnet ghayr mu'akkadah, vitr i opći nafl — sa autentičnim dokazima za svaki.",
    body: [
      "Namaz se ocjenjuje po obavezi. Pet dnevnih namaza su farz — stroga obaveza svakog odgovornog muslimana. Oko njih se nalazi bogat svijet dobrovoljne molitve kroz koju se Poslanik, sallallahu alejhi ve sellem, sve više približavao Allahu, a kroz koji možemo i mi.",
      "Za dobro učenje, razlikuju četiri dobrovoljne kategorije utemeljene na autentičnim tekstovima: sunnah mu'akkadah (naglašeno rawatib Poslanik, sallallahu alejhi ve sellem, rijetko ostavlja), sunnah ghayr mu'akkadah (preporučeno, ali manje naglašeno), witr (zadržano u svojoj kategoriji jer ga hanefije računaju kao veći dio wajiba), a generalno ga računaju na sunneta wajib. (fakultativne molitve bez fiksnog, neospornog brojanja). Tamo gdje se učenjaci razlikuju oko fiksnog broja — kao što je šest rekata nakon Magriba kao Salat al-Awwabin — mi predstavljamo opšte ohrabrenje bez tretiranja spornog brojanja kao utvrđenog sunneta.",
      "Dobrovoljni namazi su važni iz dva razloga: to su voljena djela koja podižu rang vjernika i popravljaju obavezne namaze, jer se svaki nedostatak farza nadoknađuje dobrovoljnim namazom na Sudnjem danu.",
      "Dvanaest ravatiba ispod su najjasniji dnevni raspored sunneta sa najjačim konsenzusom. Tabela rekata na čvorištu Learn Salah prati ovih dvanaest naglašenih rekata; opcioni nafl prije Asr-a, prije Maghrib-a ili nakon Isha-a se ohrabruje tamo gdje postoje dokazi, ali nije savijen u taj fiksni broj.",
    ],
    steps: [
      {
        title: "Pet farza dnevno",
        body: "Fajr, Zhuhr, Asr, Maghrib, Isha — obavezni temelj koji se nikada ne napušta.",
      },
      {
        title: "Fadžr — 2 prije (sunnet mu'akkadah)",
        body: "Dva rekata prije farza Fadžra su sunnet mu'akkada - Poslanik, sallallahu alejhi ve sellem, ih nikada nije zanemario. Ne postoji vjerodostojan redovni sunnet nakon sabaha; dobrovoljni namaz je općenito zabranjen nakon sabada do izlaska sunca.",
      },
      {
        title: "Zur — 4 prije i 2 poslije (sunnet mu'akkadah)",
        body: "Četiri rekata prije zura i dva poslije njega dio su dvanaest ravatiba (sunnet mu'akkadah). Zasebno, Umm Habibah je prenijela da onaj ko klanja četiri klanja prije zura i četiri poslije njega, Allah mu zabranjuje Vatru - tako da se dva dodatna rekata nakon obična dva ravatiba preporučuju nafl, a neki učenjaci također preporučuju dva dodatna prije na ukupno šest.",
      },
      {
        title: "Asr — 4 prije (sunnah ghayr mu'akkadah)",
        body: "Četiri rekata prije Asra se široko preporučuju (sunnah ghayr mu'akkadah). Ne postoji vjerodostojan redovni sunnet nakon asra; dobrovoljni namaz je općenito zabranjen nakon asra do zalaska sunca.",
      },
      {
        title: "Maghrib — 2 prije i 2 poslije",
        body: "Dva rekata nakon Magriba su sunnet mu'akkada (dio od dvanaest ravatiba). Prije Magriba, Poslanik, sallallahu alejhi ve sellem, je dvaput rekao 'Molite prije Magriba', a zatim dodao 'za koga god želi' — tako da su dva prije neobavezna nafl, a ne fiksni ravatib. Ohrabruje se opća dobrovoljna molitva nakon Magriba, ali se osporava autentičnost čuvene specifikacije šest rekata kao Salat al-Awwabin; ne predstavljajte fiksnu šesticu kao utvrđeni sunnet.",
      },
      {
        title: "Isha — 2 poslije i opciono prije",
        body: "Dva rekata nakon iše su sunnet mu'akkada (dio od dvanaest ravatiba). Prije iše, hadis 'Između svaka dva poziva ima namaz' dopušta dva ili četiri rekata između ezana i ikameta - opći nafl, a ne ravatib sunnet. Dodatni dobrovoljni namaz nakon Isha je dozvoljen, ali nijedan autentični fiksni sunnet ne navodi dodatna dva osim redovnog ravatiba.",
      },
      {
        title: "Witr — posebna kategorija",
        body: "Vitr se klanja nakon Iše u neparnom broju (1, 3, 5, 7, 9, 11…). Brojni vjerodostojni hadisi nalažu i podstiču ga. Hanefije to smatraju vadžibom; većina to smatra sunnetom mu'akkada. On se drži odvojeno od dvanaest ravatiba zbog ove razlike u mišljenju o njegovoj pravnoj odluci.",
      },
      {
        title: "Dvanaest ravatiba — dogovoreni raspored",
        body: "Prije Fadžra: 2. Prije zura: 4. Nakon zura: 2. Nakon Magriba: 2. Nakon iša: 2. Ukupno: 12 rekata. Ko ih redovno klanja, Allah će sagraditi kuću u Džennetu.",
      },
      {
        title: "Preporučeni nafl — nije fiksni rawatib",
        body: "Prije asra: 4 (hasan). Prije Magriba: 2 opciona (sahih). Prije iše: 2 ili 4 između ezana i ikameta (sahiha). Dodatno prije Dhuhra: 2 preporučeno. Dodatak nakon zura: 2 (hasan/sahih). Nakon Maghrib & Isha: generalni nafl ohrabren - bez spornog fiksnog brojanja.",
      },
      {
        title: "tahadžud (qiyam al-layl)",
        body: "Noćni namaz u posljednjoj trećini noći - najčestitiji dobrovoljni namaz i navika pravednika.",
      },
      {
        title: "Duha",
        body: "Jutarnji namaz (2–8 rekata) — dobročinstvo koje se plaća za svaki tjelesni zglob svakog dana.",
      },
      {
        title: "Tarawih",
        body: "Zbornički noćni namaz Ramazana - oživljavanje noći blagoslovljenog mjeseca.",
      },
      {
        title: "Dva Bajrama",
        body: "Dva rekata Kurban-bajrama i Kurban-bajrama, nakon čega slijedi hutba.",
      },
      {
        title: "Istikharah",
        body: "Namaz od dva rekata tražeći Allahovu uputu prije donošenja odluke.",
      },
      {
        title: "Janazah",
        body: "Dženaza – zajednička obaveza (fard kifaja) koja se klanja stojeći, bez ruku ili sujuda.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Poslanik, sallallahu alejhi ve sellem, nikada nije zanemario dva rekata prije Fadžra. (Aishah; također Sahih Muslim 724)",
      },
      {
        excerpt:
          "Ko redovno klanja dvanaest rekata danju i noću, Allah će mu sagraditi kuću u džennetu - dva prije sabaha, četiri prije zura, dva nakon zura, dva nakon magriba i dva poslije iša. (Umm Habibah)",
      },
      {
        excerpt:
          "Ko klanja četiri rekata prije zura i četiri poslije njega, Allah mu brani od Vatre. (Umm Habibah; mnogi učenjaci ocijenili autentičnim)",
      },
      {
        excerpt: "Neka se Allah smiluje onome ko klanja četiri rekata prije asra.",
      },
      {
        excerpt:
          "Molite se pred Magribom, molite se pred Magribom — tada je rekao: za koga god želi. (Ibn 'Umar)",
      },
      {
        excerpt:
          "Između svaka dva poziva (ezan i ikamet) je namaz. (Anas ibn Malik; također Sahih Muslim 838)",
      },
      {
        excerpt:
          "Vitr je dužnost (haqq), pa ko želi neka klanja pet, ko želi neka klanja tri, a ko želi neka klanja jedan. (Ibn 'Umar)",
      },
      {
        excerpt: "Najbolji namaz nakon obaveznih namaza je noćni namaz. (Ebu Hurejre)",
      },
      {
        excerpt:
          "Moj sluga mi se dobrovoljnim djelima približava sve dok ga ne zavolim. (Hadis Kudsi)",
      },
    ],
    actions: [
      "Počnite s dvanaest rawatiba — izgradite naviku prije dodavanja opcionog nafl-a.",
      "Koristite tabelu rekata na ovom čvorištu da pratite naglašeni sunnet oko svakog farza.",
      "Pročitajte donje kartice sa dokazima i označite hadis koji želite ponovo posjetiti.",
    ],
    appLinks: [
      {
        label: "Sunnetske prakse",
      },
      {
        label: "Tahajjud guide",
      },
      {
        label: "Rakats table",
      },
    ],
    disclaimer:
      "Vitrova pravna odluka (wajib vs sunnah mu'akkadah), tačan broj fakultativnih rekata prije Isha, i Salat al-Awwabin nakon Maghrib-a su predmeti naučnih razlika. Ova lekcija predstavlja samo ono što ima autentičnu tekstualnu osnovu i primećuje neslaganje tamo gde ono postoji.",
  },
  {
    title: "Džuma - namaz petkom",
    summary: "Sedmična obaveza koja okuplja zajednicu i zamjenjuje Dhuhr u petak.",
    body: [
      "Džuma je skupni namaz koji se održava svakog petka poslije podneva, i to je posebna obaveza, koja je poimenično propisana u Kur'anu: 'Kada se u petak poziva na molitvu, požurite na spomen Allaha i prestanite sa trgovinom.' Sastoji se od hutbe (hutbe) u dva dijela, nakon koje slijede dva rekata koji se klanjaju naglas iza imama, i zauzima mjesto zura za one koji prisustvuju.",
      "To je lična obaveza (fard 'ayn) svakog slobodnog, punoljetnog, sposobnog muslimana muslimana. Poslanik, sallallahu alejhi ve sellem, je precizirao da je to 'dužnost svakog muslimana u džematu, osim četvorice: roba, žene, djeteta ili onoga koji je bolestan.' Žene, putnici i bolesnici imaju izvinjenje i umjesto toga mole Zur, iako mogu prisustvovati ako žele.",
      "Njegovo zanemarivanje je velika opasnost: Poslanik, sallallahu alejhi ve sellem, je upozorio da ko napusti tri džume iz nepažnje, Allah mu zapečati srce. Ipak, njegove nagrade su jednako velike - petak je najbolji dan kada sunce izlazi, i ima sat u kojem se odgovara dova.",
      "Pripremite se za to kao što je to učinio Poslanik, sallallahu alejhi ve sellem: obavite gusl, nosite svoju najbolju čistu odjeću, nanesite miris, idite ranije i pažljivo slušajte hutbu u tišini (prazno pričanje tokom nje gubi nagradu). Učenje sure El-Kahf u petak donosi svjetlo između dva petka.",
    ],
    quran: [
      {
        excerpt:
          "O vjernici, kada se u petak uputi ezan, požurite se sjećanju Allaha i ostavite trgovinu. To bi bilo bolje za tebe, samo da znaš.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Namaz u džematu je obavezujuća obaveza svakog muslimana, osim četvorice: roba, žene, djeteta ili bolesnog. (Tarik ibn Šihab)",
      },
      {
        excerpt:
          "Ko napusti tri namaza petkom iz nepažnje, Allah će mu staviti pečat na srce. (Ebu al-Ja'd; također Ebu Davud 1052, at-Tirmizi 500)",
      },
      {
        excerpt: "Gusl u petak je obavezan za svakoga ko je ušao u pubertet. (Ebu Sa'id al-Khudri)",
      },
    ],
    actions: [
      "Napravite gusl, obucite čistu odjeću i mirise i dođite ranije - najraniji polaznici zarađuju najveću nagradu.",
      "Pročitajte suru al-Kahf negdje u petak za svjetlo između dva petka.",
      "Budite potpuno tihi i pažljivi tokom hutbe; držite telefon dalje.",
    ],
    appLinks: [{}],
    disclaimer:
      "Minimalni broj polaznika, te da li je gusl obavezan ili jak sunnet, predstavljaju razlike u učenju. Slijedite pouzdanu praksu vaše lokalne zajednice.",
  },
  {
    title: "Zborna molitva",
    summary: "Molitva iza imama — nagrada umnožena dvadeset i sedam puta.",
    body: [
      "Klanjanje pet dnevnih namaza u džematu (džemata) je jako naglašeno, posebno za muškarce, i obilježje je žive muslimanske zajednice. Poslanik, sallallahu alejhi ve sellem, je učio da je namaz u džematu dvadeset i sedam puta veća nagrada od namaz koji se klanja sam – umnožak koji nijedan pojedinačni napor ne može mjeriti.",
      "Džemat stoji u ravnim redovima bez praznina, rame uz rame, precizno slijedeći imama: svaki pokret počinjete tek nakon njega, nikada prije njega, i nikada u istom trenutku. Ispravljanje redova je samo po sebi dio završetka molitve.",
      "Ako dođete nakon što je imam počeo (zakasnili se zove masbuk), odmah se pridružite u bilo kojem položaju da ga nađete - taj dio se i dalje računa kao molitva s njim. Kada da posljednji selam, ustanite i sami dovršite rekate koje ste propustili, a zatim završite.",
      "Džemat nije samo u džamiji: dvoje ljudi koji zajedno klanjaju čine džemat, pa otac sa djetetom ili dva prijatelja koji putuju mogu dobiti njegovu nagradu. Žene mogu klanjati u džematu i posjećivati ​​džamiju gdje postoje odgovarajući objekti, iako je njihova molitva kod kuće također bogato nagrađena.",
    ],
    hadith: [
      {
        excerpt:
          "Namaz u džematu je dvadeset i sedam stepeni zaslužniji od samog namaza. (Ibn Omer; također Sahih Musliman 650)",
      },
    ],
    quran: [
      {
        excerpt: "I obavljajte namaz i dajte zekat i klanjajte se sa onima koji klanjaju.",
      },
    ],
    actions: [
      "Danas klanjajte barem jedan namaz u džamiji ili okupite svoje ukućane u red kod kuće.",
      "Naučite šta da radite kao zakasnili: pridružite se odmah, a zatim završite propuštene rekate nakon imamskog selama.",
    ],
  },
  {
    title: "Propušteni (qada) namazi",
    summary: "Nadoknaditi propušteno — vrata Allahove milosti ostaju otvorena.",
    body: [
      "Ako se farz namaz propusti — zbog prespavanja, zaborava ili (neka nas Allah zaštiti) nemara — obaveza ne nestaje jednostavno. Mora se nadoknaditi (kada), a Poslanik, sallallahu alejhi ve sellem, je pojasnio odluku: 'Ko zaboravi molitvu ili je prespava, iskupljenje je da je klanja kada se sjeti.' Nema druge otkupnine za to osim moliti ga.",
      "Izmišljena molitva se klanja u istom obliku kao i original: propušteni Zur od četiri rekata se klanja kao četiri rekata čak i ako ga nadoknadite noću ili dok putujete. Onaj ko je propustio molitvu zbog pravog izgovora (poput dubokog sna) ne snosi grijeh za kašnjenje; onaj ko ih je namjerno napustio mora ih nadoknaditi uz iskreno, hitno pokajanje.",
      "Učenjaci podstiču nadoknađivanje propuštenih namaza odmah i po redu gdje je to moguće, ne dopuštajući da se gomilaju - jer teret postaje sve teži s vremenom i zakašnjenjem. Ako je veliki broj propušten godinama, pristupite tome s realističnim dnevnim planom umjesto očaja; Allahova vrata povratka su uvijek otvorena.",
    ],
    hadith: [
      {
        excerpt:
          "Ko zaboravi molitvu ili je prespava, iskupljenje je da je klanja kada je se sjeti. (Anas; također Sahih Musliman 684)",
      },
    ],
    actions: [
      "Iskreno procijenite koliko molitvi dugujete i postavite realan dnevni cilj šminkanja.",
      "Uparite svaki obavezni namaz sa jednim namazom dok se zaostatak ne riješi.",
      "Nikada nemojte odgađati molitvu koja je trenutno dužna da nadoknadite staru – održavajte današnje molitve na vrijeme.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Poslije namaza",
    summary: "Adhkar i dove koje zapečate nagradu svake molitve.",
    body: [
      "Poslanik, sallallahu alejhi ve sellem, nikada nije ustao naglo sa namaza. Ostao bi sjediti, tražeći oprost od Allaha i sjećajući se - i učio je da je trenutak nakon obavezne molitve jedan od trenutaka kada se najlakše odgovara dova. Odmah odlazak gubi neke od najvećih plodova molitve.",
      "Uspostavljena post-namazna rutina je jednostavna i teška: izgovorite 'Astaghfirullah' tri puta; zatim riječi tevhida i hvale; zatim 'SubhanAllah', 'Alhamdulillah' i 'Allahu Akbar' po trideset i tri puta, zapečativši stoti sa 'La ilahe illallah...' — svakome ko to učini opraštaju mu se grijesi iako su poput morske pjene.",
      "Učenje Ajet al-Kursi nakon svake obavezne molitve uklanja samo smrt između osobe i Dženneta, kao što je Poslanik, sallallahu alejhi ve sellem, obećao. Slijedite ga sa tri Qula (Al-Ikhlas, Al-Falaq, An-Nas), i dodajte jutarnji adhkar nakon Fajra i večernji nakon Asra ili Maghriba gdje se primjenjuju.",
    ],
    hadith: [
      {
        excerpt:
          "Ko veliča, hvali i veliča Allaha po trideset i tri puta nakon svake molitve... i upotpuni stotinu riječima tevhida, grijesi su mu oprošteni iako su kao morska pjena. (Ebu Hurejre)",
      },
      {
        excerpt:
          "Ko prouči ajet al-Kursi nakon svake propisane molitve, ništa ne stoji između njega i ulaska u Džennet osim smrti. (Ebu Umama; sahih je ocijenio al-Albanijem)",
      },
    ],
    actions: [
      "Zapamtite tasbih poslije namaza (33 / 33 / 33 + tahlil) ove sedmice.",
      "Proučite Ajet al-Kursi i tri qula prije nego što ustanete.",
      "Ostanite sjediti jednu minutu lične dove nakon svakog farz namaza.",
    ],
    appLinks: [{}, {}],
  },
];

export const SALAH_GUIDE_PHRASES_BS: DeepPartial<SalahGuidePhrase>[] = [
  {
    title: "Nakon završenog vudua",
    when: "Odmah nakon uzimanja abdesta, prije namaza.",
    translation:
      "Svjedočim da nema boga osim samo Allaha, bez partnera, i svjedočim da je Muhamed Njegov rob i Poslanik.",
    meaning:
      "Obnavljanje svjedočanstva vjere dok je vaše tijelo svježe pročišćeno. Poslanik, sallallahu alejhi ve sellem, je obećao da će onome ko ovo izgovori nakon vudua otvoriti osam kapija Dženneta da uđe kroz koju želi.",
  },
  {
    title: "Takbirat al-Ihram",
    when: "Na samom početku namaza i pri kretanju između položaja.",
    translation: "Allah je Najveći.",
    meaning:
      "Namaz počinje ovdje - 'al-ihram' znači da vam čini zabranjenim stvari ovoga svijeta (govor, jelo, okretanje). Proglašavate Allaha većim od svega što bi vam moglo odvratiti pažnju, i potpuno zakoračite u Njegovo prisustvo. Svaki tekbir koji slijedi obnavlja tu predaju.",
  },
  {
    title: "Du'a al-Istiftah (početna molitva)",
    when: "Tiho nakon uvodnog tekbira, prije Al-Fatihe.",
    translation:
      "Slava Tebi, Allahu, i hvala. Blagoslovljeno Tvoje ime i uzvišeno Tvoje Veličanstvo. Nema boga osim Tebe.",
    meaning:
      "Vi otvarate razgovor veličanjem i slavljenjem Allaha i potvrđivanjem Njegove jednote, smirivanjem srca prije nego što izgovorite Njegove riječi. Postoji nekoliko autentičnih molbi za otvaranje — ovo je jedna od najčešće korištenih.",
  },
  {
    title: "Sura Al-Fatiha",
    when: "Stojeći na svakom rekatu — stub bez kojeg je rekat nevažeći.",
    translation:
      "U ime Allaha, Potpuno Milostivog, Posebno Milostivog. Sva hvala pripada Allahu, Gospodaru svjetova - Potpuno Milostivom, Naročito Milostivom, Vladaru Dana nadoknade. Tebe obožavamo i od Tebe tražimo pomoć. Uputi nas na pravi put - put onih kojima si dao naklonost, a ne onih koji su zaradili ljutnju ili onih koji su zalutali.",
    meaning:
      "'Majka Knjige': pola hvale Allaha, a pola molba za uputu, sa 'Tebe obožavamo' kao šarkom između njih. Allah je rekao da je podijelio ovu suru između Sebe i Svoga sluge - dok recituješ svaki red, On odgovara. Poslanik, sallallahu alejhi ve sellem, je rekao da nema dove za onoga ko je ne uči.",
  },
  {
    title: "Dhikr u ruku",
    when: "Dok se klanja, s ravnim, naslonjen.",
    translation: "Slava je mome Gospodaru, Veličanstvenom.",
    meaning:
      "Klanjanje je stav poštovanja, tako da veličate Allahovu veličanstvenost — rečeno tri ili više puta, bez žurbe. Poslanik, sallallahu alejhi ve sellem, je učio da rukujem uzdižemo Gospodara, pa se nadajmo da će tvoja dova biti uslišena.",
  },
  {
    title: "Dizanje sa ruku",
    when: "Stojeći potpuno uspravno nakon naklona.",
    translation: "Allah čuje onoga ko Ga hvali. Gospode naš, Tebi pripada svaka hvala.",
    meaning:
      "Vi tvrdite da Allah zaista čuje onoga koji Ga hvali, a onda Mu uzvratite svu hvalu. Poslanik, sallallahu alejhi ve sellem, je rekao da kada imam ovo kaže, a ljudi odgovore, onome ko se poklapa sa riječima meleka, opraštaju se njegovi prošli grijesi.",
  },
  {
    title: "Dhikr in sujud",
    when: "Na sedždi - položaj najbliži Allahu.",
    translation: "Slava je mom Gospodu, Svevišnjem.",
    meaning:
      "Na najnižoj fizičkoj tački veličate Svevišnjeg - paradoks u srcu obožavanja. Poslanik, sallallahu alejhi ve sellem, je rekao da je sluga najbliži svome Gospodaru dok klanja, pa izlijte dovu ovdje nakon zikra.",
  },
  {
    title: "Između dvije sedžde",
    when: "Sjedeći mirno između prvog i drugog sujuda svakog rekata.",
    translation: "Gospodaru, oprosti mi. Gospodaru, oprosti mi.",
    meaning:
      "Kratka, ali direktna molba za oprost na svakom rekatu — podsjetnik da nam je čak i usred namaza potreban Allahov oprost. Sjedite dok ne budete opušteni prije druge sedžde.",
  },
  {
    title: "At-Tahiyyat (Tashahhud)",
    when: "U srednjem sjedenju i završnom sjedenju namaza.",
    translation:
      "Svi pozdravi, dove i čiste riječi su za Allaha. Neka je mir na tebe, o Poslaniče, i Allahova milost i Njegovi blagoslovi. Neka je mir na nas i na Allahove pravedne robove. Svjedočim da nema boga osim Allaha, i svjedočim da je Muhamed Njegov rob i Poslanik.",
    meaning:
      "Srce namaza koje sjedi: vi klanjate svaku vrstu ibadeta samo Allahu, pošaljite mir na Poslanika, sallallahu alejhi ve sellem, i pravednike, i ponovo objavite dva svjedočanstva. Ibn Mas'ud je to naučio od Poslanika, sallallahu alejhi ve sellem, riječ po riječ, kao što se uči sura.",
  },
  {
    title: "Salawat Ibrahimiyyah",
    when: "U završnom tešahudu, nakon At-Tahiyyata.",
    translation:
      "Allahu, pošalji blagoslov na Muhammeda i porodicu Muhammedovu, kao što si blagoslovio Ibrahima i porodicu Ibrahimovu; zaista si hvale dostojan, slavan. O Allahu, daj milost Muhammedu i porodici Muhammedovoj, kao što si dao naklonost Ibrahimu i porodici Ibrahimov; zaista si hvale dostojan, slavan.",
    meaning:
      "Kada su ashabi upitali kako da se na njega blagoslove, Poslanik, sallallahu alejhi ve sellem, ih je podučio ovim tačnim riječima - najvjerodostojnijim salavatom u Sunnetu. Poštuj Poslanika, sallallahu alejhi ve sellem, kao što je Allah naredio, dovršavajući svoju molitvu ljubavlju prema onome ko te je naučio da klanjaš.",
  },
  {
    title: "Traženje utočišta prije selama",
    when: "Nakon završnog tešahuda i salavata, neposredno prije završetka namaza.",
    translation:
      "O Allahu, utječem Ti se od kaburske, od džehennemske kazne, od iskušenja života i smrti, i od zla iskušenja Lažnog Mesije (Dedžala).",
    meaning:
      "Poslanik, sallallahu alejhi ve sellem, je uputio da nakon završnog tešehuda osoba traži utočište od ove četiri opasnosti prije klanjanja selama - posljednja molba u namazu pokriva ovaj život, kabur, vatru i najveće iskušenje koje dolazi.",
  },
  {
    title: "Taslim (završni selam)",
    when: "Završetak namaza — okretanje lica udesno, pa ulijevo.",
    translation: "Mir i Allahova milost neka je na vama.",
    meaning:
      "Namaz napuštate kao što biste napustili društvo poštovanih — uz pozdrav mira anđelima koji snimaju na svakom ramenu i onima koji se mole pored vas. Selam je stub; time je molitva potpuna.",
  },
];

export const SALAH_GUIDE_QUIZ_BS: DeepPartial<SalahGuideQuizQuestion>[] = [
  {
    prompt: "Koliko sunnet rawatib rekata je dogovoreno svakodnevno?",
    options: ["8", "10", "12", "14"],
    explanation:
      "Dvanaest rawatiba: 2 prije Fajra, 4 prije Dhuhra, 2 poslije Dhuhra, 2 poslije Magriba i 2 poslije Iše (Sahih Muslim 728).",
  },
  {
    prompt: "Prije Fajra, naglašeni (mu'akkadah) sunnet je:",
    options: ["Ništa", "2 rekata", "4 rekata", "Samo 2 rekata poslije"],
    explanation:
      "Dva rekata prije Fajra su sunnet mu'akkadah — Poslanik, sallallahu alejhi ve sellem, ih nikada nije napuštao (Sahih al-Buhari 1169; Sahih Muslim 724).",
  },
  {
    prompt: "Dogovoreni rawatib oko Dhuhra su:",
    options: ["2 prije, 2 poslije", "4 prije, 2 poslije", "4 prije, 4 poslije", "Samo 2 prije"],
    explanation:
      "Četiri prije Dhuhra i dva poslije su dio dvanaest rawatiba. Dodatni rekati su preporučeni nafl, a ne fiksni rawatib.",
  },
  {
    prompt: "Tačno ili netačno: Četiri rekata prije Asra su dio fiksnih dvanaest dnevnih rawatiba.",
    options: ["Tačno", "Netačno"],
    explanation:
      "Četiri prije Asra su sunnet ghayr mu'akkadah (široko preporučeno), ali se ne računaju među dvanaest rawatiba (Jami' at-Tirmidhi 430).",
  },
  {
    prompt: "Zašto je Vitr u praćenju namaza u posebnoj kategoriji?",
    options: [
      "Nije spomenut u hadisu",
      "Hanefije ga smatraju wajibom, većina sunnetom mu'akkadah",
      "Uvijek se klanja prije Iše",
      "Nema određen broj rekata",
    ],
    explanation:
      "Vitr je čvrsto utemeljen, ali učenjaci se razlikuju oko toga da li je wajib ili sunnet mu'akkadah — zato se prati odvojeno od dvanaest rawatiba.",
  },
  {
    prompt: "U džematskom Fajru, imam recituje:",
    options: [
      "Tiho u oba rekata",
      "Glasno u oba rekata",
      "Glasno samo u prvom",
      "Tiho u prvom, glasno u drugom",
    ],
    explanation: "Fajr se recituje glasno (jahri) u oba rekata. Iza imama pažljivo slušate.",
  },
  {
    prompt: "Dhuhr i Asr u džematu se recituju:",
    options: [
      "Glasno u svim rekatima",
      "Tiho u svim rekatima",
      "Glasno u prva dva, tiho poslije",
      "Tiho u prva dva, glasno poslije",
    ],
    explanation:
      "Dhuhr i Asr su potpuno tihi (sirri) — imam recituje tiho i svaki klanjač recituje za sebe.",
  },
  {
    prompt: "U Magribu, imam recituje glasno u:",
    options: [
      "Sva tri rekata",
      "Samo prva dva rekata",
      "Samo trećem rekatu",
      "Nigdje — Magrib je potpuno tih",
    ],
    explanation:
      "Magrib je jahri u prvom i drugom rekatu, sirri u trećem — isti obrazac dugih i kratkih rekata kao kod drugih namaza.",
  },
  {
    prompt: "U Iši, kada prestaje glasna recitacija?",
    options: [
      "Poslije prvog rekata",
      "Poslije drugog rekata",
      "Poslije trećeg rekata",
      "Nikada — sva četiri su glasna",
    ],
    explanation: "Isha je glasna u prva dva rekata i tiho u trećem i četvrtom.",
  },
  {
    prompt: "U glasnim namazima iza imama, svi se slažu da treba:",
    options: [
      "Recitovati drugu suru glasno s imamom",
      "Pažljivo slušati i ne recitovati drugu suru glasno",
      "Napustiti namaz poslije Al-Fatihah",
      "Recitovati samo u posljednjem rekatu",
    ],
    explanation:
      "Allah kaže: 'Kada se recituje Kur'an, slušajte ga pažljivo i budite tihi' (Kur'an 7:204).",
  },
  {
    prompt: "Prema šafiijskom mezhebu, iza imama u glasnom namazu:",
    options: [
      "Ne recituje se Al-Fatihah uopšte",
      "Recituje se Al-Fatihah u svakom rekatu",
      "Recituje se samo u tihim rekatima",
      "Recituje se glasno s imamom",
    ],
    explanation:
      "Šafiijci smatraju da je recitacija Al-Fatihah obavezna za svakog klanjača u svakom rekatu: 'Nema namaza za onoga ko ne recituje Otvorenje Knjige' (Sahih al-Buhari 756).",
  },
  {
    prompt: "Prema hanafijskom mezhebu, u glasnim namazima iza imama:",
    options: [
      "Recitovati Al-Fatihah tiho u svakom rekatu",
      "Pažljivo slušati i ne recitovati Al-Fatihah",
      "Recitovati samo suru poslije Al-Fatihah",
      "Mora se recitovati Al-Fatihah glasno",
    ],
    explanation:
      "Hanafijski oslonjeni stav je slušanje u jahri namazima; imamova recitacija je dovoljna. Sva četiri sunnitska mezheba su validna stajališta.",
  },
  {
    prompt: "U prva dva rekata Dhuhra, Poslanik ﷺ je općenito recitovao:",
    options: ["Samo Al-Fatihah", "Al-Fatihah i drugu suru", "Ništa — potpuno tiho", "Samo tekbir"],
    explanation:
      "Ebu Katada prenosi da je Poslanik ﷺ recitovao Al-Fatihah i drugu suru u prva dva rekata Dhuhra i Asra, a samo Al-Fatihah u posljednja dva (Sahih al-Buhari 776; Sahih Muslim 451).",
  },
  {
    prompt: "Kada klanjate Fajr sami, sunnet je:",
    options: [
      "Recitovati samo tiho",
      "Recitovati glasno (i tiho je validno)",
      "Preskočiti suru poslije Al-Fatihah",
      "Klanjati samo jedan rekat",
    ],
    explanation:
      "Sami recitujete isto kao u džematu; u Fajru, Magribu i Iši sunnet je glasna recitacija.",
  },
  {
    prompt:
      "Tačno ili netačno: Šest fiksnih rekata poslije Magriba kao Salat al-Awwabin je utvrđeni sunnet s jednoglasnim saglasjem učenjaka.",
    options: ["Tačno", "Netačno"],
    explanation:
      "Opći nafl poslije Magriba se podstiče, ali poznata specifikacija tačno šest rekata kao Awwabin je sporna u autentičnosti — ne predstavljajte fiksnu šesticu kao utvrđeni sunnet.",
  },
];
