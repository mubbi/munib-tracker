// Bosnian translation overlay for the Learn Aqeedah content. Mirrors the order of
// its English source in ../aqeedah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { AqeedahGlossaryTerm, AqeedahTopic } from "../../types/aqeedah";
import type { DeepPartial } from "./localize";

export const AQEDAH_TOPICS_BS: DeepPartial<AqeedahTopic>[] = [
  {
    title: "Uvod",
    summary: "Aqeedah je temelj vjere koji oblikuje obožavanje, karakter i svrhu.",
    body: [
      "Riječ akida (عقيدة) dolazi od korijena koji znači čvrsto vezati ili vezati - to je skup vjerovanja kojih musliman drži s takvom sigurnošću da je srce vezano za njih, neometano sumnjom. U poznatom hadisu o Džibrilu, Poslanik, sallallahu alejhi ve sellem, ga je sažeo u šest vjerovanja: u Allaha, Njegove meleke, Njegove knjige, Njegove poslanike, Posljednji dan i božansku odredbu (kadr), njeno dobro i gorko.",
      "Za Ahl al-Sunnah wa'l-Jama'ah — glavno tijelo sunitskih muslimana — vjerovanje je preuzeto prvo iz Kur'ana, zatim autentičnog sunneta, shvaćenog na način Poslanikovih ashaba i ranih generacija (selef). Tamo gdje se koristi intelekt, on služi otkrovenju, a ne prevladavanju.",
      "Aqeedah nije apstraktna tema seminara; to je korijen iz kojeg rastu svo obožavanje i karakter. Čovjekova vjerovanja o tome ko je Allah, zašto su stvoreni i kuda idu tiho regulišu način na koji se moli, kako se ponaša prema drugima i kako se suočava sa teškoćama i smrću.",
      "Ispravno vjerovanje održava srce u ravnoteži između velikih ibadeta - ljubavi i strahopoštovanja, nade i straha, oslanjanja i truda, zahvalnosti i pokajanja - tako da vjernik niti očajava u Allahovoj milosti niti se osjeća sigurnim od Njegove odgovornosti.",
    ],
    quran: [
      {
        excerpt: "Ispravnost je da se vjeruje u Allaha, Sudnji dan, meleke, Knjigu i poslanike...",
      },
      {
        excerpt:
          "O vjernici, vjerujte u Allaha, Njegovog Poslanika, Knjigu koju je poslao svome Poslaniku i Pismo koje je prije poslao.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Iman je vjerovati u Allaha, Njegove meleke, Njegove knjige, Njegove poslanike, Posljednji dan, i vjerovati u božansku odredbu, njenu dobro i gorku. (Džibrilov hadis, prenosi Omer)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Šta je akida?",
    summary: "Aqeedah nije čas filozofije; to je proživljeno vjerovanje ukorijenjeno u otkrovenju.",
    body: [
      "Akida je ono što srce sa sigurnošću potvrđuje i ono što se onda pokazuje u ibadetu i ponašanju - ne samo teorija napamet za raspravu. Kur'an opisuje čvrsto utemeljene vjernike kao one koji o objavi kažu: 'Mi vjerujemo u nju; sve je od našeg Gospodara' (3:7): oni se pokoravaju onome što je jasno, a nevidljive detalje povjeravaju Allahu.",
      "Rani učenjaci su pisali sažete tekstove vjerovanja (kao što je al-'Aqidah al-Tahawiyya) upravo da bi sačuvali ovu jasnoću - da bi zaštitili obične vjernike od dvije opasnosti: preuveličavanja koje doprinosi vjeri i poricanja koje ukida ono što je Allah potvrdio.",
      "Unutar ehli-sunneta postoje priznate teološke škole – pre svega Athari, Ash'ari i Maturidi pristupi – koje se u potpunosti slažu oko osnova vjere, dok se razlikuju u nekim tehničkim metodama izražavanja određenih stvari, posebno božanskih atributa. Njihov zajednički temelj je jedan i čvrst: Allahova apsolutna jednost, istinitost Njegove objave i stvarna odgovornost na Ahiretu.",
      "Dakle, akidu je najbolje naučiti kao živo vjerovanje: svaka tačka vjerovanja povezuje se s načinom obožavanja, načinom ponašanja i izvorom utjehe.",
    ],
    quran: [
      {
        excerpt: "A oni čvrsti u znanju kažu: 'Vjerujemo u to. Sve je od našeg Gospodara.'",
      },
    ],
    actions: [
      "Naučite akidu od pouzdanih učenjaka i primarnih tekstova, a ne iz debata na društvenim medijima.",
      "Za svako vjerovanje koje proučavate, pitajte: kako to mijenja način na koji obožavam i živim?",
    ],
  },
  {
    title: "Zašto je akida važna",
    summary: "Sound Creed daje duhovnu stabilnost i štiti od ekstrema.",
    body: [
      'Kada je vjerovanje čvrsto i utvrđeno, djela postaju iskrena i postojana; kada je vjerovanje poljuljano, obožavanje ima tendenciju da postane nestabilno, čisto emocionalno ili lako potreseno željom i sumnjom. Allah obećava da će "čvrstom riječju držati one koji vjeruju" - u ovom životu iu strašnom trenutku kabura i budućeg svijeta.',
      "Ispravna vjera je također ono što vjernika vodi kroz cijeli životni raspon: uči strpljivom povjerenju u Allahovu odredbu tokom teškoća, poniznoj zahvalnosti u blagoslovu i smirenoj sigurnosti u suočavanju s neizvjesnošću i smrću. Osoba koja istinski vjeruje u kadr i ahiret se ne sruši kada se testira.",
      "Konačno, zdrava akaida uči adabu — dobrom ponašanju — u neslaganju: čvrsto se držati jasnih osnova uz iskazivanje poštovanja i suzdržanosti u sporednim stvarima u kojima se iskreni učenjaci dugo razlikuju. Poznavanje vjerovanja treba povećati poniznost i milosrđe, a nikada aroganciju.",
    ],
    quran: [
      {
        excerpt: "Allah čvrstom riječju drži one koji vjeruju u dunjaluku i na ahiretu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Budite željni onoga što vam koristi, tražite pomoć od Allaha i ne budite bespomoćni... (Ebu Hurejre)",
      },
    ],
  },
  {
    title: "Šest članova imana",
    summary: "Poslanik, sallallahu alejhi ve sellem, je sažeo iman u šest temeljnih vjerovanja.",
    body: [
      "Šest članaka dolazi iz Džibrilovog hadisa, jednog od najvažnijih hadisa u islamu. Melek Džibril je došao u obliku čovjeka i pitao Poslanika, sallallahu alejhi ve sellem, pred ashabima o islamu, imanu i ihsanu. Kada je upitao o imanu, Poslanik, sallallahu alejhi ve sellem, je odgovorio sa ovih šest vjerovanja - a Džibril ga je potvrdio, a zatim je otišao, pošto je došao da poduči ljude njihovoj vjeri.",
      "Šest su: vjerovanje u Allaha; u Njegovim anđelima; u Njegovim objavljenim knjigama; u Njegovim glasnicima; u posljednji dan; a u božanskoj odredbi (qadr) je dobro i gorko. Odbaciti bilo koji od njih znači ispasti izvan pravog imana, jer su jedno tkivo.",
      "Oni su takođe duboko međusobno povezani. Vjerovanje u knjige i poslanike vodi do znanja o posljednjem danu i obračunu; vjerovanje u posljednji dan daje težinu svakom djelu; a vjerovanje u kadr uči pouzdanju u Allaha i poniznosti pred Njegovom mudrošću. Njihovo učenje po redu gradi jasan i uravnotežen pogled na svijet.",
    ],
    hadith: [
      {
        excerpt:
          "…Da vjerujete u Allaha, Njegove meleke, Njegove knjige, Njegove poslanike, Posljednji dan, i da vjerujete u odredbu, njenu dobro i gorku. (Džibrilov hadis)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Vjerovanje u Allaha",
    summary:
      "Vjerovanje u Allaha obuhvata Njegovo gospodstvo, Njegovo jedino pravo na ibadet, i Njegova imena i svojstva.",
    body: [
      "Vjerovanje u Allaha je najveće od svih vjerovanja i korijen ostalih. Počinje sa sigurnošću da je samo On Stvoritelj, Vlasnik i Održavatelj svega - jedan istinski Bog, bez partnera, ravnog i nema potrebe za Njegovim stvorenjem.",
      "Iz toga slijedi da samo On zaslužuje ibadet u svakom obliku: dova, dova, nada, strah, oslanjanje, ljubav u svom najvišem smislu, žrtva i zavjeti su sva Allahova prava koja se ne smiju uputiti nikome osim Njemu. Ovo je značenje svjedočanstva 'nema boga osim Allaha.'",
      "Ehli-Sunnet potvrđuje lijepa imena i uzvišena svojstva koja je Allah potvrdio za Sebe, i koje je Njegov Poslanik, sallallahu alejhi ve sellem, potvrdio za Njega, na način koji dolikuje Njegovom veličanstvu - bez upoređivanja sa Njegovim stvorenjem (tamthil) i bez poricanja ili ispraznjenja Njegovih atributa značenja (ta'til). Ajet vodilja glasi: 'Nema ničega sličnog Njemu, i On je Svečujući i Svevideći' (42:11) — koji istovremeno poriče sličnost i potvrđuje Njegovo slušanje i gledanje.",
      "Poznavanje Allaha po Njegovim imenima - Milostivi, Sveznajući, Uvijek Živi, Kralj, Koji prašta - hrana je srca: što Ga više poznajete, više volite, bojite se i obraćate mu se.",
    ],
    quran: [
      {
        excerpt:
          "Reci: On je Allah, Jedini… On ne rađa, niti se rađa, i niko se ne može porediti s Njim.",
      },
      {
        excerpt: "A Allahu pripadaju najljepša imena, pa Ga zovite njima.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Vjerovanje u anđele",
    summary: "Meleki su poštovani, nevidljivi Allahovi robovi koji Mu nikada nisu neposlušni.",
    body: [
      "Anđeli (mala'ikah) su ogromna kreacija napravljena od svjetlosti. Oni nemaju slobodnu volju da budu neposlušni: oni neprestano obožavaju Allaha i savršeno izvršavaju svaku Njegovu naredbu, 'ne nepokorni Allahu u onome što im On naredi, i čineći ono što im je naređeno.'",
      "Vjerovati u njih znači vjerovati da je nevidljivi svijet stvaran i aktivan oko nas. Meleki donose otkrovenje, čuvaju ljudska bića, bilježe svaku riječ i djelo, uzimaju duše na smrti i upravljaju poslovima na zemlji i nebesima uz Allahovu dozvolu – tako da vjernik nikada nije istinski sam ili nezapažen.",
      "Nekoliko ih je u tekstovima imenovano sa specifičnim ulogama: Džibril, anđeo otkrivenja; Mika'il, povjerena kiša i opskrba; Israfil, koji će duvati u trubu; Malak al-Mawt, anđeo smrti; i plemeniti pisari (Kiraman Katibin) koji bilježe djela svake osobe. Munkar i Nakir ispituju pokojnika u grobu.",
    ],
    quran: [
      {
        excerpt:
          "Nad njim su meleki, oštri i strogi, koji se ne pokoravaju Allahu u onome što On naredi i čine ono što im je naređeno.",
      },
      {
        excerpt:
          "Reci: ko je neprijatelj Džibrilu, on ga je spustio na vaše srce, uz Allahovu dozvolu.",
      },
    ],
    actions: ["Živite sa sviješću da anđeli koji snimaju nikada ne propuštaju ni riječ ni djelo."],
  },
  {
    title: "Vjerovanje u božanske knjige",
    summary: "Allah je poslao spise kao uputu; Kur'an ih potvrđuje i stoji kao konačni kriterij.",
    body: [
      "Muslimani vjeruju da je Allah objavio svete spise svojim poslanicima kao uputu i milost. Kur'an navodi nekoliko imena: Suhuf Ibrahima i Musaa, Tevra dat Musau, Zabur Davudu, Indžil Isau, i konačno Kur'an Muhammedu, sallallahu alejhi ve sellem - u koji se vjeruje u cjelini, u njihovom izvornom objavljenom obliku.",
      "Kur'an ima jedinstveni rang. To je konačno otkrivenje, poslano 'potvrđujući ono što je bilo prije njega i kao kriterij nad njim' (5:48) - što znači da sudi i ispravlja, budući da raniji spisi nisu ostali u svom izvornom stanju, već su izmijenjeni (tahrif) i izgubljeni tokom generacija.",
      "Jedinstveno među svim svetim spisima, Kur'an je božanski zaštićen od kvarenja: 'Zaista, Mi smo opomenu spustili, i zaista, Mi smo njen Čuvar' (15:9). Vjerovati u knjige stoga znači poštovati objavu, učiti Kur'an s razmišljanjem i podrediti se njegovoj uputi u životu.",
    ],
    quran: [
      {
        excerpt:
          "I Mi smo vam objavili Knjigu u istini, potvrđujući ono što joj je prethodilo od Pisma i kao kriterij nad njom.",
      },
      {
        excerpt: "Zaista, Mi smo ti koji smo spustili Opomenu, i zaista, Mi ćemo biti njen čuvar.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Vjerovanje u proroke",
    summary: "Svi proroci su prenosili istu suštinsku istinu; Muhammed ﷺ je posljednji glasnik.",
    body: [
      "Musliman vjeruje u sve poslanike i poslanike koje je Allah poslao, ne odbacujući nijednog od njih. Od Adama preko Nuha, Ibrahima, Musaa i Isaa do Muhammeda sallallahu alejhi ve sellem, svi su pozivali na istu suštinsku poruku: obožavajte samo Allaha i živite pošteno. Dvadeset pet je imenovano u Kur'anu; njihov ukupan broj je poznat samo Allahu.",
      "Poslanici su najbolji od stvorenja u istinitosti i pouzdanosti, zaštićeni od Allaha od laži o poruci i od velikog grijeha - ipak oni ostaju ljudska bića, a ne božanska, i nikada ih se ne treba obožavati. Petorica su izdvojeni kao 'odlučni' glasnici (ulu al-'azm): Nuh, Ibrahim, Musa, 'Isa i Muhammed, sallallahu alejhi ve sellem.",
      "Muhammed, sallallahu alejhi ve sellem, je Pečat poslanika (khatam an-nabiyyin): nijedan poslanik ne dolazi nakon njega, a njegova poruka je univerzalna – poslana cijelom čovječanstvu do Sudnjeg dana. Vjerovati u njega uključuje ljubav prema njemu, pokoravanje njegovim naredbama, vjerovanje njegovim izvještajima i obožavanje samo na način na koji je učio.",
    ],
    quran: [
      {
        excerpt: "…Mi ne pravimo razliku između bilo kojeg od Njegovih poslanika…",
      },
      {
        excerpt:
          "Muhamed nije otac nijednog od vaših ljudi, već Allahov Poslanik i pečat poslanika.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Vjerovanje u posljednji dan",
    summary: "Život vodi do konačnog susreta sa Allahom, savršene pravde i vječnih ishoda.",
    body: [
      "Vjerovanje u posljednji dan je vjerovanje u sve što slijedi nakon smrti: ispitivanje i život kabura (barzak), duvanje u trubu, vaskrsenje svih ljudi, veliko okupljanje, polaganje računa, odmjeravanje djela na vagi, prelazak Mosta i dva vječna prebivališta — raj i On.",
      "Ovo vjerovanje daje moralnu težinu svakom trenutku. Budući da Allah vidi skriveno i bilježi najsitnije djelo, ništa dobro se nikada ne troši i ništa zlo se nikada ne previđa: 'Ko čini težinu atoma dobra vidjet će to, a onaj ko čini težinu atoma zla će to vidjeti.'",
      "Ehli-sunnet sa sigurnošću potvrđuje sve ove stvarnosti, vjerujući u njih upravo onakve kakve su objavljene, dok priznaju da se učenjaci razlikuju u tumačenju nekih finijih detalja konkretnih događaja i znakova. Poenta vjerovanja nije spekulacija već priprema.",
    ],
    quran: [
      {
        excerpt:
          "…Dakle, ko god radi atomsku težinu dobra, vidjet će to, a ko god čini težinu atoma zla, vidjet će to.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Vjerovanje u Kadr (božanski dekret)",
    summary: "Allahovo znanje i odredba su potpuni - ipak ljudi zaista biraju i odgovorni su.",
    body: [
      "Vjerovanje u kadr je često sažeto u četiri nivoa: da Allah vječno zna sve; da ih je sve napisao na Sačuvanoj ploči pedeset hiljada godina prije stvaranja; da se ništa ne dešava osim Njegovom voljom; i da je On Stvoritelj svega što postoji, uključujući i postupke Njegovih slugu.",
      "U isto vrijeme, ljudska bića imaju stvarnu volju i istinski izbor u okviru onoga što Allah dopušta - upravo zato su naredbe i zabrane, nagrade i kazne pravedne i značajne. Osoba bira moliti se ili lagati i s pravom se smatra odgovornom; Allahovo prethodno znanje o izboru ga ne prisiljava.",
      "Ehli-sunnet se usmjerava između dvije greške: poricanja odredbe (kao da događaji izmiču Allahovom znanju i volji) i fatalizma (koristeći dekret za poništavanje ljudske odgovornosti i opravdanje grijeha). Vjernik izvrsno uzima sredstva, a onda ishod povjerava Allahu.",
      "Praktično, kadr je veliki izvor mira: nakon što obavite svoj dio, počivate u znanju da ono što stigne do vas nikada vas nije moglo promašiti, a ono što ste propustili nikada vas nije moglo stići.",
    ],
    hadith: [
      {
        excerpt:
          "…Ako te nešto zadesi, nemoj reći 'da sam bar tako učinio', već reci 'Allah je odredio i učinio je ono što je htio' — jer 'da samo' otvara vrata šejtanu. (Ebu Hurejre)",
      },
    ],
    quran: [
      {
        excerpt: "Zaista, Mi smo sve stvorili po mjeri (kadar).",
      },
      {
        excerpt:
          "Zaista, Allah ne mijenja stanje ljudi sve dok oni ne promijene ono što je u sebi.",
      },
    ],
    misconceptions: [
      "Zabluda: Ako je sve određeno, trud je besmislen. Ispravka: Islam nalaže trud, planiranje, molitvu i pokajanje - uzimanje sredstava je samo po sebi dio uredbe.",
      "Zabluda: Kadr znači da je Allah kriv za moj grijeh. Ispravka: Sluga bira i odgovara; dekret nikada nije izgovor za neposlušnost.",
      "Zabluda: Teškoća dokazuje da je Allah nezadovoljan mnome. Ispravka: Iskušenja mogu biti pročišćenje, uzdizanje u rangu, upozorenje ili poziv na povratak — često znak brige, a ne ljutnje.",
    ],
    actions: [
      "Uzmite sredstva sa izvrsnošću, a zatim se pouzdajte u Allahovu odredbu.",
      "Zamijenite 'ako samo...' petlje žaljenja sa 'Qaddar Allah' i konstruktivnim sljedećim korakom.",
    ],
  },
  {
    title: "Tawheed Explained",
    summary:
      "Tewhid objedinjuje Allahovo gospodstvo, Njegovo jedino pravo na ibadet, te Njegova imena i svojstva.",
    body: [
      "Tewhid (توحيد) – apsolutna Allahova jedinstvo – je srce islama i poruka svakog poslanika. To znači izdvojiti samo Allaha u svemu što je jedinstveno Njegovo, i potvrditi Njegovo savršenstvo upravo onako kako je On Sebe opisao.",
      "Učenjaci obično podučavaju tevhid kroz tri povezana aspekta kako bi ga lakše razumjeli i zaštitili. Tawheed al-Rububiyyah: da samo Allah stvara, posjeduje i kontrolira sve stvari. Tawheed al-Uluhiyyah: da samo Allah zaslužuje svako obožavanje - to je aspekt koji su poslanici najviše naglašavali, a nevjernici su se najviše opirali. Tawheed al-Asma' wa'l-Sifat: potvrđivanje Allahovih imena i svojstava kao što su otkriveni, bez izobličenja, poricanja ili sličnosti.",
      "Ovaj trodijelni okvir je nastavno sredstvo, a ne izvor podjela; njegova svrha je da pomogne vjerniku da čuva iskrenost i prepozna gdje jedinstvo može biti ugroženo. Sve to je zarobljeno u početnoj dovi svakog muslimanskog namaza: 'Tebe jedinog klanjamo, i samo Tebe tražimo za pomoć.'",
      "Ključni uvid: priznanje da je Allah Stvoritelj (rububiyyah) nije dovoljno samo po sebi. Mnogi koji su poricali poslanike i dalje su priznavali da je Allah stvorio nebesa i Zemlju - ono što su odbijali je da se samo Njemu klanjaju (uluhiyyah). Pravi tevhid se dokazuje u ibadetu, a ne samo u vjerovanju o porijeklu.",
    ],
    quran: [
      {
        excerpt: "Samo Tebe obožavamo, i samo Tebe tražimo za pomoć.",
      },
      {
        excerpt: "Allah — nema božanstva osim Njega. Njemu pripadaju najljepša imena.",
      },
    ],
    misconceptions: [
      "Zabluda: Tawheed izgovara samo jednu rečenicu. Ispravka: To je vjerovanje srca, izjava jezika i stvarnost koja se živi u obožavanju.",
      "Zabluda: Vjerovanje da je Allah Stvoritelj je cijeli tevhid. Ispravka: Čak su i mnogi nevjernici potvrdili da - test je obožavanje samo Allaha.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shirk Explained",
    summary:
      "Širk je usmjeravanje bilo kakvog ekskluzivnog prava Allaha na nešto drugo osim Njega.",
    body: [
      "Širk (شرك) - pridruživanje partnera Allahu - je suprotnost tevhidu i jedinom grijehu koji Kur'an ističe kao neoprostiv ako osoba umre zbog njega bez pokajanja: 'Allah ne oprašta da mu se partneri pridruže, ali oprašta sve manje od onoga za koga hoće.'",
      "Najveći širk (al-shirk al-akbar) je usmjeravanje čina ibadeta drugome osim Allahu - pozivanje mrtvih ili odsutnih za ono što samo Allah može dati, žrtvovanje ili zavjetovanje stvorenim bićima, ili voljenje i pokoravanje nečemu kako treba voljeti i pokoravati se Allahu. Odvodi osobu izvan islama ako umrije na njemu nepokajano.",
      "Manji širk (al-shirk al-asghar) ne izbacuje iz islama, ali je ozbiljno opasan i može poništiti nagradu za djela. Njegov najjasniji oblik je rija – obavljanje ibadeta da bi ga ljudi vidjeli i hvalili – kojeg je Poslanik, sallallahu alejhi ve sellem, nazvao stvarima koje se najviše bojao za svoju zajednicu. Zakleti se drugim osim Allahom na način koji to uzdiže pada i ovdje.",
      "Ehli-sunneti su oprezni s jezikom i rasuđivanjem: upozorenje na širk općenito je bitno i jasno, ali proglašenje određene osobe mušrikom ili nevjernikom (tekfir) je teška stvar koja zahtijeva znanje, valjane dokaze i uklanjanje izgovora - to pripada kvalifikovanim učenjacima, a ne običnim ljudima ili argumentima na internetu.",
    ],
    quran: [
      {
        excerpt:
          "Zaista, Allah ne oprašta druženje s Njim, ali oprašta ono što je manje od onoga kome hoće.",
      },
      {
        excerpt:
          "O sine moj, ne pridružuje Allahu drugove. Zaista, udruživanje je velika nepravda (zulm).",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ono čega se najviše plašim za tebe je manji širk. Upitan šta je to, on je rekao: hvalisanje (rija). (Mahmud ibn Labid)",
      },
    ],
    misconceptions: [
      "Zabluda: Svaki lapsus je veliki širk. Ispravka: Naučnici razlikuju veće od manjeg i pažljivo prosuđuju svaki slučaj sa dokazima.",
      "Zabluda: Upozorenje na širk zahtijeva grubost prema ljudima. Ispravka: Proročki način spaja jasnoću istine s milosrđem i strpljivim učenjem.",
    ],
  },
  {
    title: "Iskrenost",
    summary: "Djela se prihvataju samo kada su učinjena isključivo za Allaha.",
    body: [
      "Ikhlas (إخلاص) je tražiti samo Allahovo zadovoljstvo kroz čin - ne status, pohvalu, bogatstvo ili uticaj na ljude. To je unutrašnje stanje od kojeg zavisi prihvatanje svakog djela: Poslanik, sallallahu alejhi ve sellem, je učio da su 'radnje samo po namjerama i svaka osoba će imati samo ono što je namjeravala.'",
      "Budući da nagrada ovisi o namjeri, malo, tiho djelo učinjeno iskreno za Allaha može nadjačati veliko, javno djelo učinjeno radi ugleda. Isti vanjski čin - davanje milostinje, molitva, učenje - može biti obožavanje ili praznina ovisno o srcu iza toga.",
      "Iskrenost se ne postiže jednom, već se neprestano obnavlja, jer je sopstvo sklono traženju pažnje. Vjernici stoga stalno čiste svoju namjeru i traže od Allaha da ih zaštiti od skrivenog širka rija i od samoobmane.",
    ],
    quran: [
      {
        excerpt: "I nije im bilo naređeno osim da obožavaju Allaha, iskreno prema Njemu u vjeri.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Radnje su samo namjere, i svako će imati samo ono što je namjeravao. ('Omar ibn al-Hattab)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ljubav i strah od Allaha",
    summary: "Zdravo srce obožava Allaha na krilima ljubavi, nade i strahopoštovanja.",
    body: [
      "Obožavanje srca počiva na tri velika stanja: ljubavi (mahabbah), nadi (raja') i strahu poštovanja (khawf). Ljubav prema Allahu je temelj i pokretačka snaga svakog ibadeta - vjernici su 'jači u ljubavi prema Allahu' od bilo čega drugog - dok strah od nezadovoljstva Njemu sputava dušu od grijeha i nepažnje.",
      "Ehli-sunnet uči da oni moraju ostati u ravnoteži, poput ptice koja leti sa dva krila i glavom. Ljubav i nada bez straha mogu utonuti u nemar i uzimanje Allahove milosti zdravo za gotovo; strah bez nade može pasti u očaj. Kur'an im se pridružuje: 'Prizovite Ga u strahu i nadi.'",
      "Ova ravnoteža nije samo osjećaj; pojavljuje se na djelu - u čuvanju molitve, žurbi da se pokaje, služenju drugima, obuzdavanju ljutnje i strpljenju u teškoćama iz ljubavi prema Onome koji je to odredio.",
    ],
    quran: [
      {
        excerpt: "…Ali oni koji vjeruju su jači u ljubavi prema Allahu.",
      },
      {
        excerpt:
          "…I prizovite Ga u strahu i nadi. Zaista, Allahova milost je blizu onih koji čine dobro.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nada i pokajanje",
    summary: "Nijedan grijeh nije prevelik za iskreno pokajanje i nadu u Allahovu ogromnu milost.",
    body: [
      "Definirajuće vjerovanje ehli-sunneta je da osoba nikada ne treba očajavati u Allahovoj milosti, ma koliko veliki bili njeni grijesi, i nikada se ne osjećati sigurnom od Njegove odgovornosti, ma koliko da ima dobrih djela. I nada i samoispravljanje kontinuirano prolaze kroz život vjernika.",
      "Allahov poziv je nevjerovatno velikodušan: 'Reci: O robovi moji koji ste sami sebe prestupili, ne očajavajte u Allahovoj milosti! Allah, zaista, oprašta sve grijehe.' Vrata pokajanja (tevba) ostaju otvorena sve dok sunce ne izađe sa zapada ili dok se ne približi smrt pojedinca.",
      "Iskreno pokajanje ima jasne uslove: odmah napustiti grijeh, osjećati iskreno žaljenje zbog njega i čvrsto odlučiti da se više nikada ne vrati – i, kada je grijeh uključivao prava druge osobe, vraćanje tih prava ili traženje njihovog oproštenja. Kada se oni susreću, Allahov odgovor nije samo prihvatanje, već radost: On je 'više oduševljen pokajanjem Njegovog roba' nego čovjek koji povrati izgubljeno brdo i namirnice u neplodnoj pustinji.",
    ],
    quran: [
      {
        excerpt:
          "Reci: O robovi moji koji ste sami sebe prestupili, ne očajavajte u Allahovoj milosti. Zaista, Allah oprašta sve grijehe.",
      },
      {
        excerpt: "O vjernici, obratite se Allahu u iskrenom pokajanju.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah je više oduševljen pokajanjem Svoga roba nego čovjek koji izgubi svog konja, noseći svoju hranu i piće, u neplodnoj zemlji - pa ga ponovo nađe. (Ibn Mas'ud)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "raj (Jannah)",
    summary: "Džennet je vječna nagrada koju je Allah pripremio vjernicima Svojom milošću.",
    body: [
      "Raj je stvaran, vječan i iznad svega što ljudski um može zamisliti. Poslanik, sallallahu alejhi ve sellem, je prenio Allahove riječi: 'Pripremio sam Svojim pravednim robovima ono što nije oko vidjelo, uho nije čulo i nijedno srce nije začelo.' Njegova najveća nagrada od svih je Allahovo zadovoljstvo i vizija Njegovog Lica.",
      "Ulazak u Džennet je na kraju Allahovom milošću – ničija djela sama ne mogu zaraditi vječno blaženstvo – ali iskrena vjera i ispravan postupak su sredstva koja je Allah odredio i prihvata. Njih dvoje nisu u sukobu: milosrđe je uzrok, a vjera i djela su put koji mu je On otvorio.",
      "Vjerovanje u raj preoblikuje način na koji čovjek sada živi: potiče strpljenje kroz teškoće, velikodušnost prema bogatstvu i istrajnost u ibadetu, jer vjernik mijenja prolazni svijet za vječni dom. Kur'an nas poziva da se 'trčimo' prema tome.",
    ],
    quran: [
      {
        excerpt:
          "I požuri sa oprostom od Gospodara svoga i džennetom širokom kao nebesa i zemlja, pripremljenom za pravednike.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah je rekao: Pripremio sam Svojim pravednim robovima ono što nijedno oko nije vidjelo, uho nije čulo, i nijedno ljudsko srce nije začelo. (Ebu Hurejre; također Sahih Musliman 2824)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "pakao (Jahannam)",
    summary:
      "Džehannam je pravo upozorenje, namijenjeno da se srca vrate Allahu prije nego što bude prekasno.",
    body: [
      "Vjerovanje u pakao (Džehannam) je dio vjerovanja u nevidljivo i u Allahovu savršenu pravdu. To je pravo prebivalište kazne, koje je slikovito opisano u Kur'anu i Sunnetu, tako da ljudi ozbiljno shvataju opasnost.",
      "Upozorenja služe milostivoj svrsi: ona postoje da zaštite ljude od samog ishoda koji opisuju - da spriječe aroganciju, ugnjetavanje i uporno, svesno odbacivanje istine, i da potaknu nepažljive da se pokaju dok su vrata otvorena.",
      "Ehli-sunnet drži upozorenja i milost zajedno. Prijetnje su ozbiljne i stvarne, ali Allahova milost ostaje ogromna za onoga ko se Njemu okrene — a među ljudima tevhida, grešnici koji uđu u Vatru neće ostati tamo zauvijek, već će na kraju biti izvučeni Allahovom milošću i posredovanjem koje On dopusti.",
    ],
    quran: [
      {
        excerpt:
          "O vjernici, zaštitite sebe i svoje porodice od Vatre čije su gorivo ljudi i kamenje.",
      },
      {
        excerpt: "…Ne očajavajte u Allahovoj milosti. Zaista, Allah oprašta sve grijehe.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Uskrsnuće",
    summary: "Nakon smrti, svi ljudi će tjelesno biti podignuti da stanu pred Allaha.",
    body: [
      "Uskrsnuće (al-ba'th) je tjelesno i stvarno, a ne simbol ili metafora. Allah odgovara onima koji sumnjaju da raspadnute kosti mogu ponovo živjeti najjednostavnijom logikom: Onaj koji ih je prvi put stvorio iz ničega sigurno ih može obnoviti - a ponovno stvaranje je, za naše razumijevanje, lakše nego nastajanje.",
      "Između smrti i uskrsnuća nalazi se barzak - srednji život groba, sa njegovim ispitivanjem i njegovom lakoćom ili teškoćom. Zatim se puhne u trubu i sva stvorenja se podižu i okupljaju pred Allahom radi polaganja računa.",
      "Ovo vjerovanje je ono što ljudskom životu daje moralnu ozbiljnost: bez uskrsnuća, tlačitelj koji umire udobno i potlačeni koji umiru nepravedno doživjeli bi isti kraj. Njime se odgovara na svaku nepravdu i svako dobro se nagrađuje, dajući smisao strpljenju i pravdi.",
    ],
    quran: [
      {
        excerpt:
          "On kaže: 'Ko će oživjeti kosti dok se raspadaju?' Reci: 'On će im dati život ko ih je proizveo prvi put...'",
      },
      {
        excerpt: "I zaista, čas dolazi - nema sumnje - i Allah će oživjeti one u grobovima.",
      },
    ],
  },
  {
    title: "Sudnji dan",
    summary: "Svaka duša stoji pred Allahom; Njegova pravda je savršena i potpuna.",
    body: [
      'Na Sudnjem danu, svaka osoba se smatra odgovornom - za djela i namjere, za Allahova prava i prava drugih ljudi - sa tako preciznom pravdom da "ni jednoj duši neće biti učinjena nepravda", čak ni težinom atoma.',
      "Tog Dana nikome neće koristiti nikakva loza, bogatstvo, klasa, nacionalnost ili svjetski položaj; samo iskrena vjera i pravedni postupci, koje je Allah prihvatio, će biti od koristi. Dijele se zapisi, vagaju djela, pa čak i nepravde učinjene među ljudima se namiruju prenošenjem dobrih i loših djela.",
      "Ova sigurnost sada ima za cilj da preobrazi karakter: poziva vjernika na poštenje, pouzdanost, čuvanje prava drugih, popravljanje nepravdi i vraćanje dugovanog prije Dana kada se dugovi plaćaju djelima, a ne novcem.",
    ],
    quran: [
      {
        excerpt:
          "I Mi postavljamo vagu pravde za Sudnji dan, tako da se ni jedna duša neće nepravedno ponašati.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Skala i Sirat",
    summary: "Na Mizanu se vagaju djela, a ljudi po vjeri i djelima prelaze Sirat.",
    body: [
      "Ehli-sunnet potvrđuje Mizan (Vage) i Sirat (Most preko Džehennema) kao stvarne događaje na Ahiretu, koji se vjeruju tačno kako je objavljeno. Na vagi se djela i njihovi počinioci vagaju savršeno pošteno: 'kao onaj čija je vaga teška, on će biti u ugodnom životu; a što se tiče onoga čija je vaga lagana, njegovo utočište će biti ponor.'",
      "Sirat je most koji se proteže preko pakla koji svi moraju proći. Kur'an kaže: 'Nema nikog od vas koji će ga preći', a zatim: 'Mi ćemo spasiti one koji su mislili na Allaha.' Ljudi prelaze u skladu sa svojim djelima - neki su brzi poput svjetlosti ili vjetra, drugi se bore, a neki klizaju - Allahovom milošću i pravdom.",
      "Ovim stvarnostima nije rečeno da se dokono plaše, već da neguju ozbiljnost: o težini malih djela, o iskrenosti ibadeta i o poštovanju prava drugih, jer će sve to biti izvagano.",
    ],
    quran: [
      {
        excerpt:
          "Tada će onaj čija je vaga teška biti u ugodnom životu; ali što se tiče onoga čija je vaga lagana, njegovo utočište će biti ponor.",
      },
      {
        excerpt:
          "I nema nikog od vas osim što će on preći preko njega... Onda ćemo Mi spasiti one koji su se Allaha bojali.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "zagovor (Shafa'ah)",
    summary:
      "Zastupništvo je stvarno - ali samo uz Allahovu dozvolu, za one sa kojima je On zadovoljan.",
    body: [
      "Zastupništvo (shafa'ah) na Sudnjem danu je čvrsto potvrđeno u Kur'anu i Sunnetu. Najveća od svega je 'Hvaljena stanica' (al-maqam al-mahmud) koja je dodijeljena poslaniku Muhammedu, sallallahu alejhi ve sellem, kada će se zalagati za okupljeno stvorenje da započne obračun - i on će imati druge zagovore za ljude koji imaju velike grijehe među njegovim ummetom.",
      "Ali niko se ne zalaže na sopstveni autoritet. Svako valjano posredovanje se dešava samo 'nakon Njegovog dopuštenja' i samo za one sa kojima je Allah zadovoljan: 'Ko je taj koji se može zauzimati kod Njega osim po Njegovoj dozvoli?' Ovo čuva Allahov apsolutni suverenitet nad ishodom.",
      "Učenjaci opisuju nekoliko afirmiranih vrsta posredovanja - da se započne obračun, da ljudi uđu u Džennet, da grešni vjernici budu oprošteni ili uklonjeni iz Vatre - dok se slažu da konačna presuda uvijek ostaje samo Allahova.",
    ],
    quran: [
      {
        excerpt: "Ko je to što se može zalagati kod Njega osim uz Njegovu dozvolu?",
      },
      {
        excerpt:
          "Tog Dana, posredništvo neće koristiti osim onome kome je Milostivi dao dozvolu i čiju riječ odobrava.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ljudi će mi doći, a ja ću klanjati pred svojim Gospodarom; tada će se reći: Podigni glavu, traži i biće ti dato, zauzmi se i tvoje zalaganje će biti prihvaćeno. (Ebu Sa'id — veliko posredovanje)",
      },
    ],
    misconceptions: [
      "Zabluda: posredovanje uklanja potrebu za pokajanjem. Ispravka: To se dešava samo uz Allahovu dozvolu i nikada nije dozvola da se ustraje u grijehu.",
      "Zabluda: Neko može sada pozvati proroke ili pravednike da se zauzmu. Ispravka: Ibadet i dova su samo za Allaha; posredovanje na ahiretu je Njegovom odredbom, traženo kroz udovoljavanje Njemu.",
      "Zabluda: Zastupništvo je u suprotnosti sa Allahovom pravdom. Ispravka: To je jedan izraz Njegove milosti koja djeluje unutar Njegove savršene pravde, i to samo uz Njegovo dopuštenje.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Znakovi posljednjeg dana",
    summary: "Manji i glavni znaci su istiniti; mudar fokus na pripremu a ne na spekulacije.",
    body: [
      "Autentični tekstovi opisuju znakove koji prethode Satu, grupisane u manje znakove (od kojih su se mnogi već pojavili, kao što je slanje samog Poslanika, sallallahu alejhi ve sellem, širenje neznanja i široko rasprostranjena nemarnost) i glavne znakove koji će se pojaviti pred kraj.",
      "Deset glavnih znakova su zajedno imenovani u hadisu Poslanika, sallallahu alejhi ve sellem: među njima pojava Dedžala, silazak Isaa (sin Merjemine), izlazak Ya'juja i Ma'juja, tri velika klizišta, dim, izlazak sunca sa zapada i vatra koja tjera ljude na njihov put.",
      "Učenjaci se ponekad razlikuju oko tačnog slijeda nekih znakova, ali se slažu oko dvije stvari: dolazak Časa je siguran, a njegovo tačno vrijeme ne zna niko osim Allaha — čak ni Poslanik, sallallahu alejhi ve sellem, kada ga je Džibril pitao. Proročki odgovor na znakove je stoga praktičan, a ne spekulativan: povećajte vjeru, pokajanje, pravdu i korisna djela, a ne beskrajno predviđanje.",
    ],
    quran: [
      {
        excerpt: "Pitaju vas za Sat: kada dolazi? Reci: njegovo znanje je samo kod mog Gospodara.",
      },
      {
        excerpt: "Da li čekaju osim da ih čas dođe iznenada? Njegovi znaci su već došli.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sat neće doći dok ne vidite deset znakova: dim, Dedžala, Zvijer, sunce koje izlazi sa zapada, silazak Isa, Ya'juja i Madžudža i tri klizišta... (Huzejfe ibn Usajd)",
      },
    ],
    misconceptions: [
      "Zabluda: Svaki veliki svjetski događaj je definitivno konačni znak. Ispravka: Takve tvrdnje zahtijevaju autentične dokaze i naučni oprez, a ne senzacionalizam.",
      "Zabluda: Poznavanje znakova nam omogućava da datiramo sat. Ispravka: Tačno vrijeme je poznato samo Allahu; znakovi nas pozivaju da se pripremimo, a ne da predviđamo.",
    ],
    appLinks: [{}],
  },
  {
    title: "Aqeedah FAQ",
    summary:
      "Uobičajena pitanja o vjeroispovijesti na koja se odgovara uravnoteženošću, dokazima i dobrim adabom.",
    body: [
      "P: Da li su svi suniti identični u svakoj tački vjere? O: Ehli sunnet dijele jednu osnovu i potpuno se slažu oko bitnih stvari; priznate teološke škole (Athari, Ash'ari, Maturidi) razlikuju se samo u nekim tehničkim formulacijama, i tome treba pristupiti s poštovanjem, a ne s neprijateljstvom.",
      "P: Da li mi je potrebna napredna filozofija da bih imao ispravnu akidu? O: Ne. Od svakog muslimana se traži da nauči osnovne stvari u skladu sa svojim potrebama - šest članaka i čisti tevhid - dok je dublje učenje korisno pod kvalifikovanim učiteljima.",
      "P: Da li poznavanje akide treba da me čini grubim prema drugima? O: Ne. Zdrava vera treba da poveća poniznost, zahvalnost, milosrđe i pažljiv govor. Korištenje vjerovanja za omalovažavanje muslimana ili žurbu na tekfir je samo po sebi ozbiljna greška.",
      "P: Koja je razlika između imana, islama i ihsana? O: U hadisu Džibrila, Islam je vanjski ibadet, iman je unutrašnja vjerovanja (šest članova), a ihsan je savršenstvo oba – obožavati Allaha kao da Ga vidite.",
    ],
    actions: [
      "Dajte prioritet jasnim, dogovorenim osnovama prije spornih tehničkih detalja.",
      "Posavjetujte se s kvalificiranim lokalnim naučnicima kada složeno pitanje vjerovanja zapravo utiče na vašu praksu.",
    ],
  },
  {
    title: "Reference i dalje studije",
    summary:
      "Počnite s Kur'anom i autentičnim sunnetom, a zatim povjerljivim sunitskim početnicima.",
    body: [
      "Primarna referenca za vjeroispovijest uvijek je Kur'an i vjerodostojni sunnet, shvaćeni onako kako su ih razumjeli ashabi i rani učenjaci ehli-sunneta - a ne kroz kasnije trendove čitane natrag u tekstove.",
      "Korisno proučavanje uključuje sažete klasične početke vjeroispovijesti (kao što su al-'Aqidah al-Tahawiyya i djela ranih učenjaka) koje podučavaju pouzdani učitelji uz objašnjenja koja odgovaraju vašem nivou.",
      "Kada se naučnici razlikuju po sporednim pitanjima, ponizno učite dokaze i izbjegavajte pretvaranje tehničkih neslaganja u sektaško neprijateljstvo – jedinstvo vjernika u bitnim stvarima je samo zapovijed religije.",
    ],
    disclaimer:
      "Ovaj modul je edukativan i nepolemičan. Za lične odluke ili osjetljiva pitanja vjerovanja, konsultujte kvalifikovane naučnike kojima vjerujete.",
    actions: [
      "Proučavajte jednu temu vjerovanja svake sedmice s učiteljem ili početnikom od povjerenja.",
      "Naučite napamet šest članova vjere i budite u stanju objasniti svaki svojim riječima.",
    ],
    appLinks: [{}, {}, {}],
  },
];

export const AQEDAH_GLOSSARY_BS: DeepPartial<AqeedahGlossaryTerm>[] = [
  {
    term: "Aqeedah",
    definition:
      "Vjerovanje – ono što musliman vjeruje o Allahu, Njegovim melekima, knjigama, poslanicima, posljednjem danu i božanskoj odredbi.",
  },
  {
    term: "Tawheed",
    definition: "Allahova jednost u gospodstvu, ibadetu i imenima/atributima — temelj islama.",
  },
  {
    term: "Shirk",
    definition:
      "Pridruživanje Allahu partnera u ibadetu ili osobinama koje On jedini posjeduje – suprotno tevhidu.",
  },
  {
    term: "Iman",
    definition: "Vjera — vjerovanje u srce, potvrda jezikom i djelovanje udovima.",
  },
  {
    term: "Qadr",
    definition:
      "Allahovo vječno znanje i odredba o svemu - dobro i zlo postoje Njegovom dozvolom i mudrošću.",
  },
  {
    term: "Nabi",
    definition:
      "Poslanik — onaj koji prima objavu i kome je naređeno da je prenosi; može slijediti prethodni zakon.",
  },
  {
    term: "Rasul",
    definition: "Glasnik — prorok poslat svom narodu sa novim spisom ili zakonom.",
  },
  {
    term: "Sirat",
    definition: "Most preko pakla na Sudnjem danu — vjernici prelaze po svojim djelima.",
  },
];
