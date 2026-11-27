import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// bs overlay for islamic-finance. Index-aligned with ISLAMIC_FINANCE_TOPICS in ../islamic-finance.ts.
export const ISLAMIC_FINANCE_TOPICS_BS: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Šta su islamske finansije?",
    summary:
      "Etički pogled na novac, a ne zasebna kategorija proizvoda — ovaj vodič služi isključivo edukaciji.",
    body: [
      "Islamske finansije nisu marka investicijskog proizvoda; one su primjena islamske etike na to kako se novac zarađuje, posuđuje, troši i daje. U njihovoj srži je nekoliko načela: imetak je emanet od Allaha, a ne cilj sam po sebi; transakcije moraju biti slobodne od iskorištavanja i pretjerane neizvjesnosti; a dobit treba biti vezana za stvarnu privrednu aktivnost i podijeljeni rizik, a ne za zagarantovanu naknadu na zajam.",
      "Ovaj vodič predstavlja ta načela na općem, edukativnom nivou: zabranu ribe (kamate/lihve), pošteno postupanje u trgovini, obaveze zekata i dobrovoljne sadake te osnovni pojam tekafula (zadružnog osiguranja). Namjerno ne provjerava fondove, ne navodi dionice ni ETF-ove i ne preporučuje nijedan konkretan proizvod ili pružaoca usluga.",
      "Savremeni finansijski proizvodi (stambeni krediti, kreditne kartice, polise osiguranja, penzioni računi i drugo) strukturirani su na mnogo različitih načina, a propisi o njima mogu zavisiti od tačnih uslova ugovora i vaše jurisdikcije. Ovaj vodič vam daje temeljna načela; za propis o vašoj konkretnoj situaciji obratite se kvalifikovanom, certificiranom učenjaku ili instituciji za islamske finansije.",
    ],
    disclaimer:
      "Isključivo edukativni sadržaj — nije finansijski savjet niti fetva. Ne preporučuje, ne provjerava i ne ocjenjuje nijedan konkretan fond, dionicu, pružaoca usluga ili finansijski proizvod.",
  },
  {
    title: "Imetak kao emanet",
    summary:
      "Sve što posjedujete u konačnici pripada Allahu — vi ste njegov upravitelj, a ne konačni vlasnik.",
    body: [
      "Tema koja se u Kur'anu ponavlja jest da imetak prvenstveno pripada Allahu; čovjek je samo njegov povjerenik (emanetdar) na neko vrijeme, odgovoran za to kako ga je stekao i kako ga koristi. To novac iz čisto lične svojine pretvara u nešto za što ćete biti pitani — odakle je došao i kamo je otišao.",
      "Dvije naredbe učvršćuju kako se taj emanet ostvaruje u odnosima s drugim ljudima: potpuno ispunjavanje ugovora i dogovora, te nikada ne uzimati tuđi imetak nepravdom, prevarom ili iskorištavanjem, nego samo poštenom trgovinom uz obostrani pristanak.",
      "Uzeta zajedno, ova načela su razlog zašto se islamska finansijska etika stalno vraća istim nekolicini pitanja: je li ova dobit stečena stvarnim trudom, rizikom i stvaranjem vrijednosti? Je li se prema drugoj strani postupalo potpuno pošteno? I poštuje li se svaka obaveza koju sam preuzeo?",
    ],
  },
  {
    title: "Zabrana ribe",
    summary: "Riba (kamata/lihva) jedna je od transakcija koje Kur'an najoštrije osuđuje.",
    body: [
      "Riba — obično prevođena kao kamata ili lihva, a u širem smislu svako unaprijed određeno, zagarantovano povećanje koje se naplaćuje na zajam — zabranjena je neuobičajeno oštrim riječima u pet uzastopnih ajeta sure el-Bekare (2:275–279), što je među najstrožim upozorenjima o ijednoj temi u Kur'anu.",
      "Odlomak namjerno pravi kontrast: 'A Allah je dozvolio trgovinu, a zabranio kamatu' (2:275). Trgovina — kupovina, prodaja i ulaganje u kojima obje strane dijele stvarni rizik i trud — hvaljena je; riba, utvrđena naknada koja se duguje bez obzira na ishod, osuđena je. Sura zatim naređuje vjernicima da se potpuno odreknu svake preostale kamate, upozoravajući na ozbiljne posljedice za one koji ustraju, a obećava da onaj ko se pokaje smije zadržati samo svoju glavnicu — ni više ni manje.",
      "Ovo je temeljno učenje kojeg treba biti svjestan, a ne lista za samostalnu provjeru svakog savremenog finansijskog proizvoda. Da bi se utvrdilo uključuje li konkretan ugovor (stambeni kredit, zajam, štedni račun) ribu u praksi, potrebno je pregledati njegove stvarne uslove s nekim ko je kvalifikovan u islamskim finansijama.",
    ],
  },
  {
    title: "Zašto se trgovina razlikuje od kamate",
    summary:
      "Dozvoljena dobit vezana je za rizik i trud; riba je zagarantovana naknada bez obzira na ishod.",
    body: [
      "Jednostavan način da se ta razlika zapamti: u trgovini ili stvarnom ulaganju, osoba koja daje kapital ili robu učestvuje u ishodu — može zaraditi, ali može i izgubiti, jer je izložena stvarnom uspjehu poduhvata. Kod zajma zasnovanog na ribi, zajmodavcu je zagarantovan utvrđeni povrat bez obzira na to da li poduhvat zajmoprimca uspije, posrne ili propadne.",
      "Klasična učenost to postavlja kao pitanje pravde: osoba u hitnoj potrebi koja posudi novac može upasti u zamku da vrati mnogo više nego što je posudila, pri čemu je sav rizik na njoj, a nimalo na zajmodavcu — upravo neravnoteža koju Kur'an osuđuje riječima 'Allah uništava kamatu, a unaprjeđuje milosrđa' (2:276), izravnim kontrastom između imetka stečenog iskorištavanjem i imetka uvećanog darežljivošću.",
      "Ovo je opći edukativni kontrast, a ne propis o bilo kojem konkretnom instrumentu (neke savremene strukture na složene načine brišu granicu između trgovine i kreditiranja). Gdje se konkretan proizvod nalazi na ovom spektru upravo je vrsta pitanja koje treba postaviti kvalifikovanom učenjaku za islamske finansije ili certificiranom savjetniku, umjesto da se odluči samo na osnovu općih načela.",
    ],
  },
  {
    title: "Koliko ozbiljno sunnet tretira ribu",
    summary:
      "Poslanik ﷺ je upozorio da svi koji učestvuju u transakciji s ribom dijele njen grijeh.",
    body: [
      "Pored samih kur'anskih upozorenja, Poslanik ﷺ je jasno dao do znanja da odgovornost za ribu nije ograničena samo na onoga ko je izravno naplaćuje. U vjerodostojnom hadisu prenosi se da je on ﷺ prokleo onoga ko jede ribu, onoga ko je plaća, onoga ko piše ugovor i dvojicu svjedoka — rekavši da su svi oni u tome jednaki.",
      "Pouka koja se iz ovoga obično izvodi jest zajedničko klonjenje, a ne samo pojedinačna krivica: riba se tretira kao nešto čega se treba kloniti cijela transakcija i svako ko u njoj svjesno učestvuje — a ne samo kao privatna stvar između zajmodavca i zajmoprimca.",
      "Kao i kur'anski ajeti, ovaj hadis utvrđuje ozbiljnost načela; sam po sebi vam ne kaže kako klasificirati konkretan savremeni finansijski proizvod. Ta procjena pripada kvalifikovanim učenjacima koji pregledaju stvarni ugovor.",
    ],
  },
  {
    title: "Poštenje u trgovini",
    summary: "Pošteni, povjerljivi trgovac dobija jedan od najviših stepeni na ahiretu.",
    body: [
      "U oštroj suprotnosti s upozorenjima o ribi, poštena trgovina se iznova hvali. Sam Poslanik Muhammed ﷺ bavio se trgovinom prije poslanstva i u Mekki je bio poznat po nadimku el-Emin — 'Povjerljivi' — zbog svog poštenja u poslovanju, dugo prije nego što je postao poznat kao poslanik.",
      "On ﷺ je kasnije učio o Sudnjem danu: 'the truthful, trustworthy merchant will be with the prophets, the truthful, and the martyrs' (značenje na engleskom) — izuzetno visok položaj vezan za nešto tako obično kao što je pošteno poslovanje na tržnici.",
      "U praksi, poštena trgovina znači: tačno opisivati robu i usluge, otkrivati poznate nedostatke umjesto da se skrivaju, poštovati dogovorene cijene i uslove te izbjegavati prevaru, lažno oglašavanje ili iskorištavanje neznanja kupca ili prodavca. To su isti instinkti koji čine dobar, održiv posao u svakoj tradiciji — islam ih jednostavno veže i za vječnu nagradu.",
    ],
  },
  {
    title: "Snalaženje sa savremenim finansijskim proizvodima",
    summary:
      "Stambeni krediti, kartice i osiguranje zaista su složeni — ovaj vodič se zaustavlja na načelima.",
    body: [
      "Savremeni finansijski život uključuje proizvode s kojima se najranije generacije muslimana nikada nisu susrele u današnjem obliku: stambene kredite, kreditne kartice, penzione račune, osiguranje i investicijske fondove strukturirane na mnogo različitih načina. Primjena stoljetnih načela na ove proizvode stvaran je i pažljiv učenjački posao — a ne nešto što se može samostalno zaključiti iz nekoliko općih ajeta.",
      "Zbog toga se savremene institucije islamskih finansija i certificirani učenjaci specijaliziraju upravo za pregled savremenih ugovora u pogledu usklađenosti s ovim načelima, često izdajući detaljne propise o pojedinim proizvodima ili strukturama. Takav specijalizirani pregled izvan je okvira ove aplikacije.",
      "Ako razmatrate stvarnu finansijsku odluku — kupovinu kuće, zajam, ulaganje, policu osiguranja — odgovoran sljedeći korak jest konsultirati kvalifikovanog, certificiranog savjetnika ili učenjaka za islamske finansije koji može pogledati stvarne uslove ugovora, a ne oslanjati se na opći edukativni sadržaj poput ovog vodiča.",
    ],
    disclaimer:
      "Ova aplikacija ne procjenjuje, ne provjerava i ne preporučuje nijedan konkretan finansijski proizvod, fond ili pružaoca usluga, a ovaj vodič nije zamjena za kvalifikovan stručni ili učenjački savjet o vašim stvarnim finansijama.",
  },
  {
    title: "Zekat: ibadet kroz imetak",
    summary: "Zekat je obavezni ibadet koji se obavlja novcem, a ne riječima ili pokretima.",
    body: [
      "Zekat — utvrđeno, obavezno godišnje davanje na imetak koji ispunjava uslove iznad najmanjeg praga (nisaba) — jedan je od pet stubova islama, čime je davanje stavljeno u isti red s namazom i postom, a ne tretirano kao neobavezna darežljivost.",
      "Kur'an dosljedno povezuje zekat s namazom kao znak istinskog vjerovanja i obećava da one koji obavljaju i namaz i zekat 'čeka nagrada kod Gospodara njihova; i ničega se oni neće bojati i ni za čim oni neće tugovati'. U finansijskom smislu, zekat djeluje kao mehanizam čišćenja imetka — raspodjeljujući mali, redovni dio nagomilanog imetka onima u potrebi, umjesto da beskonačno leži neiskorišten u nekoliko ruku.",
      "Budući da izračun zavisi od vaše konkretne ušteđevine, imovine i lokalnih vrijednosti nisaba, ova aplikacija ima poseban vodič i kalkulator za zekat — koristite njih direktno, umjesto procjene na osnovu općih načela ovdje.",
    ],
  },
  {
    title: "Sadaka: dobrovoljno davanje",
    summary:
      "Pored obaveznog zekata, svako dobrovoljno davanje naziva se sadaka — i ona vas nikada zaista ne košta.",
    body: [
      "Sadaka je dobrovoljna milostinja, data u bilo kojem iznosu, u bilo koje vrijeme, Allaha radi — pored utvrđene obaveze zekata. Ona seže od značajnih finansijskih darova do nečeg tako malog kao što je lijepa riječ ili uklanjanje nečega štetnog s nečijeg puta, a sve se to u hadiskoj literaturi ubraja u oblike sadake.",
      "Jedno od najohrabrujućih učenja za svakoga ko oklijeva da daje jest Poslanikova ﷺ izjava da sadaka ne umanjuje imetak — što Kur'an na drugom mjestu potkrepljuje opisujući trošenje na Allahovom putu kao nešto što Allah nadoknađuje i nagrađuje, a ne samo kao nešto što se potroši.",
      "U praksi, ovo mijenja pogled na darežljivost: davanje se ne nadmeće s vašom finansijskom sigurnošću, nego se predstavlja kao nešto što je štiti i uvećava, na načine koji nisu uvijek vidljivi u bilansu.",
    ],
  },
  {
    title: "Tekaful: zadružna podjela rizika",
    summary: "Opći pogled na koncept iza islamskih alternativa konvencionalnom osiguranju.",
    body: [
      "Tekaful (od arapskog korijena koji znači međusobno jamstvo) opći je koncept iza islamskih pristupa zaštiti nalik osiguranju: grupa učesnika uplaćuje u zajednički fond, a taj fond se koristi da se pomogne članovima koji dožive pokriveni gubitak, pri čemu se eventualni višak obično dijeli među učesnicima ili prenosi dalje, umjesto da ga zadrži zasebni osiguravač kao zagarantovanu dobit.",
      "Osnovna ideja je zadružna podjela rizika, a ne prenos rizika za zagarantovanu premiju: učesnici se smatraju onima koji jedni drugima pomažu, dok upravitelj fonda obično djeluje kao menadžer ili zastupnik uz naknadu, a ne kao strana koja sama snosi rizik.",
      "Ovo je samo opći, pojmovni opis. Stvarni tekaful proizvodi uveliko se razlikuju po strukturi među pružaocima i zemljama, a procjena da li je konkretan plan zaista tako strukturiran zahtijeva pregled njegovih stvarnih uslova s kvalifikovanim učenjakom ili institucijom za islamske finansije — ova aplikacija ne preporučuje niti procjenjuje nijednog konkretnog pružaoca ili plan tekafula (ili osiguranja).",
    ],
    disclaimer:
      "Isključivo opća edukacija. Ovo nije preporuka tekafula umjesto konvencionalnog osiguranja, niti bilo kojeg konkretnog pružaoca ili plana — za svoje okolnosti konsultirajte kvalifikovanog savjetnika.",
  },
  {
    title: "Tekaful i konvencionalno osiguranje — opće poređenje",
    summary:
      "Oba imaju istu svrhu — upravljanje rizikom — ali se razlikuju u tome kako je taj rizik strukturiran.",
    body: [
      "Konvencionalno osiguranje obično je strukturirano kao ugovor u kojem osiguranik plaća premiju, a osiguravač, kao zasebna komercijalna strana, snosi rizik u zamjenu za tu naknadu, često ulažući sredstva premija na načine koji mogu uključivati kamatonosne instrumente. Neki klasični učenjaci izrazili su zabrinutost da se ova struktura dotiče ribe, garara (pretjerane neizvjesnosti u pogledu isplate) i prenosa rizika za utvrđenu naknadu umjesto podijeljenog rizika.",
      "Tekaful je razvijen, općenito govoreći, kao pokušaj da se upravo te zabrinutosti riješe kroz međusobnu, zadružnu strukturu — iako se učenjaci i institucije razilaze o tome koje strukture u potpunosti ostvaruju taj cilj, a i sami pružaoci tekafula znatno se razlikuju u izvedbi.",
      "Budući da i zabrinutosti i alternativne strukture uključuju stvarne tehničke pojedinosti (i budući da se lične okolnosti, poput lokacije, potrebnog pokrića i dostupnih pružalaca, ogromno razlikuju), ovo poređenje nudi se samo kao opća pozadina — a ne kao propis o bilo kojoj konkretnoj polisi koju razmatrate.",
    ],
    disclaimer:
      "Isključivo edukativno poređenje, a ne fetva o osiguranju ili tekafulu općenito niti o bilo kojem konkretnom proizvodu. Učenjaci imaju različita mišljenja o savremenim strukturama osiguranja; za svoju situaciju konsultirajte kvalifikovanog savjetnika.",
  },
  {
    title: "Česta pitanja: je li ovo finansijski savjet?",
    summary: "Nije — ovaj vodič uči samo načela i ne može zamijeniti kvalifikovan savjet.",
    body: [
      "P: Mogu li koristiti ovaj vodič da odlučim je li konkretan zajam, ulaganje ili proizvod osiguranja dozvoljen za mene? O: Ne. Ovaj vodič objašnjava opća islamska načela o novcu — ne pregleda ugovore, ne preporučuje proizvode i ne izdaje propise. Konkretne finansijske odluke treba donositi s kvalifikovanim finansijskim stručnjakom, a za pitanja dozvoljenosti s kvalifikovanim učenjakom za islamske finansije.",
      "P: Ocjenjuje li ili navodi li ova aplikacija halal dionice, fondove ili ETF-ove? O: Ne, i nikada neće u okviru ovog vodiča — provjera fondova i investicijske preporuke izvan su njegovog okvira i zahtijevaju licencirano finansijsko stručno znanje koje ovaj sadržaj ne pruža.",
      "P: Je li ovaj vodič fetva? O: Nije. Fetva je konkretan vjerski propis koji izdaje kvalifikovani učenjak kao odgovor na konkretno pitanje i kontekst. Ovaj vodič uči samo opća načela; za stvarni propis o vašoj situaciji obratite se direktno kvalifikovanom učenjaku kojem vjerujete.",
    ],
    disclaimer:
      "Cijeli ovaj vodič je edukativni sadržaj, a ne finansijski savjet niti fetva. Za odluke o vlastitom novcu uvijek se konsultirajte s kvalifikovanim finansijskim i vjerskim stručnjacima.",
  },
  {
    title: "Česta pitanja: kako pronaći opcije usklađene sa šerijatom?",
    summary: "Tražite certificiranu stručnost, a ne listu — ova aplikacija je namjerno ne nudi.",
    body: [
      "P: Gdje mogu pronaći listu halal banaka, fondova ili investicijskih platformi? O: Ne u ovoj aplikaciji, i to namjerno — liste proizvoda stalno se mijenjaju, drastično se razlikuju od zemlje do zemlje i zahtijevaju stalno praćenje usklađenosti koje mogu valjano održavati samo specijalizirane institucije. Umjesto toga tražite institucije sa stvarnim, imenovanim šerijatskim nadzornim odborom i objavljenom metodologijom usklađenosti.",
      "P: Kako da znam je li učenjak ili certifikat legitiman? O: Tražite učenjake ili odbore koje priznaju etablirana tijela za standarde islamskih finansija u vašoj regiji ili međunarodno, a ne neformalne tvrdnje na internetu. Ugledna institucija bit će transparentna o tome ko pregleda njene proizvode i na koji način.",
      "P: Šta da radim ako tamo gdje živim ne mogu pronaći nijednu opciju islamskih finansija? O: To je stvarna i česta situacija. Razgovarajte o tome s upućenim lokalnim imamom ili učenjakom — oni vam mogu pomoći da odmjerite dostupne opcije za vaše konkretne okolnosti, jer smjernice ovdje mogu uveliko zavisiti od toga koje alternative vam zaista postoje.",
    ],
    actions: [
      "Tražite institucije s imenovanim, transparentnim šerijatskim nadzornim odborom, umjesto da se oslanjate na marketinške tvrdnje.",
    ],
  },
  {
    title: "Česta pitanja: stambeni krediti, kartice i zajmovi",
    summary: "Upravo su to pitanja za koja je potreban kvalifikovan učenjak, a ne opći vodič.",
    body: [
      "P: Je li stambeni kredit uvijek riba? O: Strukture se razlikuju — neki konvencionalni stambeni krediti su zajmovi zasnovani na kamati, dok neki pružaoci nude alternativne strukture (kao što su modeli opadajućeg partnerstva ili zakupa s otkupom) namijenjene izbjegavanju kamate. Da li konkretan proizvod to u praksi i postiže učenjačko je pitanje o njegovom stvarnom ugovoru, a ne nešto što treba unaprijed pretpostaviti u bilo kojem smjeru.",
      "P: Smijem li koristiti kreditnu karticu ako uvijek plaćam puni iznos i nikada ne platim kamatu? O: Učenjaci o tome imaju različita mišljenja, dijelom zato što osnovni ugovor tehnički i dalje može sadržavati klauzulu o kamati, čak i ako je u praksi nikada ne aktivirate. Ovo je stvarno područje različitih kvalifikovanih mišljenja — pitajte učenjaka kojem vjerujete, umjesto da pretpostavljate jedan univerzalni odgovor.",
      "P: Šta je sa studentskim kreditima ili drugim zajmovima koji u nekim okolnostima mogu biti neizbježni? O: Nužda i poteškoće stvarni su faktori koje učenjaci pažljivo odmjeravaju, a mišljenja se razlikuju prema okolnostima i jurisdikciji. Ako ste suočeni s ovom odlukom, iznesite svoju konkretnu situaciju kvalifikovanom učenjaku, umjesto da je pokušavate riješiti samo na osnovu općeg čitanja.",
    ],
    disclaimer:
      "Ovo su pitanja o kojima postoji stvarno razilaženje i koja zavise od konkretnog ugovora. Ova česta pitanja samo vam pokazuju kakva je vrsta svakog pitanja — ne odgovaraju ni na jedno od njih za vašu situaciju.",
  },
];
