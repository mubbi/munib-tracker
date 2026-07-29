// Bosnian translation overlay for the Learn "Prophets" content. Mirrors the order of
// its English source in ../prophets*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { ProphetsTimelineEvent, ProphetsTopic } from "../../types/prophets";
import type { DeepPartial } from "./localize";

export const PROPHETS_TOPICS_BS: DeepPartial<ProphetsTopic>[] = [
  {
    title: "Uvod u proroke",
    summary: "Zašto je Allah poslao poslanike i zašto su njihove priče sada važne.",
    body: [
      "Allah je poslao poslanike kao milost, uputu i dokaz kako bi Ga ljudi mogli upoznati, ispravno Mu obožavati i živjeti s pravdom i svrhom.",
      "Njihove priče u Kur'anu nisu samo daleka historija; oni su praktične lekcije za vjerovanje, strpljenje, porodični život, vodstvo i pokajanje.",
      "Vjerovanje u sve poslanike je dio imana. Muslimani ih sve poštuju, izbjegavaju preuveličavanje i slijede završnu poruku koju je donio Muhammed, sallallahu alejhi ve sellem.",
    ],
    quran: [
      {
        excerpt:
          "Poslanici kao donosioci dobrih vijesti i opomena kako ljudi ne bi imali argument protiv Allaha nakon poslanika.",
      },
      {
        excerpt:
          "Mi smo svakako poslali u svaki narod poslanika: Obožavajte Allaha i izbjegavajte lažne bogove.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Šta je prorok u islamu?",
    summary: "Odabrani čovjek koji prima objavu i poziva ljude Allahu.",
    body: [
      "Poslanik je ljudsko biće koje je Allah odabrao da prima objavu i vodi ljude na tevhid, ibadet i ispravno ponašanje.",
      "Proroci nisu božanski i nikada ih se ne obožava. Oni su najbolji od stvorenja u poslušnosti, karakteru i pouzdanosti, dok ostaju Allahovi robovi.",
      "Njihova misija je jedna u osnovi: obožavati samo Allaha. Određeni pravni detalji mogu se razlikovati od zajednice prema Allahovoj mudrosti.",
    ],
    quran: [
      {
        excerpt:
          'Njihovi poslanici im rekoše: "Mi smo samo ljudi poput vas, ali Allah daje milost kome hoće među robovima Svojim."',
      },
      {
        excerpt:
          "Mi prije tebe nismo poslali nijednog poslanika osim što smo mu objavili: Nema drugog božanstva osim Mene, zato Mi se klanjajte.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Poslanik protiv Glasnika",
    summary: "Korisna razlika u učenosti, dok su obojica poštovani proroci.",
    body: [
      "U islamskoj učenosti, uobičajena razlika je da je svaki rasul nabi, ali nije svaki nabi rasul. Rasul se često opisuje kao poslan s posebnim mandatom narodu, dok nabi nastavlja vođenje putem otkrivenja.",
      "Kur'an koristi oba izraza sa čašću, a muslimani vjeruju u sve poslanike i poslanike, a da nijednog ne odbacuju.",
      "Tačne tehničke definicije mogu varirati ovisno o znanstvenim frazama, ali praktična lekcija je konzistentna: primite objavu sa poniznošću i slijedite Allahovu uputu.",
    ],
    quran: [
      {
        excerpt: "Bio je izabran, bio je glasnik i prorok.",
      },
      {
        excerpt: "Mi ne pravimo razliku između bilo kojeg od Njegovih poslanika.",
      },
    ],
    disclaimer:
      "Detalji terminologije su predstavljeni na širok, neutralan za naučnike; konsultujte kvalifikovane nastavnike za napredne teološke klasifikacije.",
    appLinks: [{}],
  },
  {
    title: "Podijeljene pouke od proroka",
    summary: "Teme koje se ponavljaju: tevhid, strpljenje, pokajanje i moralna hrabrost.",
    body: [
      "Kroz generacije, proroci su pozivali na jedan temelj: obožavajte samo Allaha i izbjegavajte sve oblike širka. Ovo je nepromjenjiva srž otkrivenja.",
      "Njihovi životi također pokazuju sabr pod odbacivanjem, povjerenje u Allaha tokom neizvjesnosti i spremnost da reformišu društvo mudrošću i hrabrošću.",
      "Njihovo proučavanje gradi otpornost: vjernici uče da se brzo pokaju, vode etički i ostaju principijelni čak i kada istina nije popularna.",
    ],
    quran: [
      {
        excerpt: "U njihovim pričama je lekcija za ljude koji razumiju.",
      },
      {
        excerpt: "Oni su oni koje je Allah uputio, pa slijedite njihovu uputu.",
      },
    ],
    actions: [
      "Odaberite jednu proročku lekciju svake sedmice i primijenite je namjerno.",
      "Razmišljajte nakon namaza gdje vam je potrebno više strpljenja ili pokajanja.",
      "Redovno podučavajte jednu autentičnu proročansku priču porodici ili prijateljima.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Čuda i znaci proroštva",
    summary: "Čuda potvrđuju istinu uz Allahovu dozvolu, ali ne prisiljavaju vjerovanje.",
    body: [
      "Allah je poslanicima dao jasne znakove koji odgovaraju njihovim zajednicama: Nuhovu lađu, Musaove znakove pred faraonom, Isaova čuda uz Allahovo dopuštenje, i Kur'an za Muhammeda, sallallahu alejhi ve sellem.",
      "Čuda nisu nezavisne moći proroka; dešavaju se Allahovom voljom da podrže objavu i utvrde dokaze.",
      "Kur'an pokazuje da su neki i dalje odbačeni uprkos znakovima, dok dokazuje da uputa zavisi od iskrenosti i pokornosti, a ne samo od spektakla.",
    ],
    quran: [
      {
        excerpt: "Poslali smo Naše poslanike sa jasnim dokazima i s njima spustili Knjigu i Vagu.",
      },
      {
        excerpt:
          "Reci: Znaci su samo kod Allaha... Zar im nije dovoljno što smo vam objavili Knjigu koja im se čita?",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kur'anski pregled poslanika",
    summary: "Kur'an imenuje dvadeset pet poslanika i predstavlja jednu konzistentnu poruku.",
    body: [
      "Kur'an direktno imenuje dvadeset i pet poslanika i spominje mnogo više poslanika. Njihove priče su raspoređene po surama za razmišljanje i smjernice.",
      "Iako se postavke razlikuju, njihov poziv je jedan: tevhid, ispravnost, odgovornost i milost kroz pokajanje.",
      "Ovaj modul ostaje utemeljen na Kur'anu i drži sekundarne istorijske detalje kratkim osim ako nije potkrijepljen pouzdanim dokazima.",
    ],
    quran: [
      {
        excerpt:
          "Već smo poslali glasnike prije vas; među njima su i oni koje smo vam u vezi, a među njima su i oni koje vam nismo u vezi.",
      },
      {
        excerpt:
          "Vjerujemo u Allaha i ono što je objavljeno... i ono što je dato Musau, Isau i poslanicima od njihovog Gospodara.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Reference i metoda čitanja",
    summary: "Kako proučavati proroke sa autentičnošću, ravnotežom i koristima.",
    body: [
      "Počnite s kur'anskim odlomcima, zatim pročitajte vjerodostojni hadis, a zatim konsultujte pouzdani tefsir za kontekst. Ovaj poredak drži učenje ukorijenjeno u otkrivenju.",
      "Izbjegavajte senzacionalne ili slabe izvještaje koji su u suprotnosti s kur'anskim principima ili proročkim dostojanstvom. Nema svaka popularna priča čvrste dokaze.",
      "Koristite proročke biografije da reformišete svoje obožavanje i karakter, a ne samo da prikupite istorijske činjenice.",
    ],
    quran: [
      {
        excerpt: "Oni koji slušaju govor i slijede ono najbolje od njega - njih je Allah uputio.",
      },
    ],
    hadith: [
      {
        excerpt: "Ko krene putem tražeći znanje, Allah mu olakšava put u Džennet.",
      },
    ],
    actions: [
      "Čitajte jednu prorokovu priču sedmično direktno iz Kur'ana.",
      "Vodite bilješke o praktičnim lekcijama, a ne samo o činjenicama s vremenskog okvira.",
      "Provjerite sekundarne naracije kod pouzdanih učenjaka.",
    ],
    disclaimer:
      "Povijesni datumi i točne lokacije mogu se razlikovati u različitim izvorima; ovaj centar daje prioritet dogovorenim, tekstualnim smjernicama.",
    appLinks: [{}, {}],
  },
];

export const PROPHETS_BIO_TOPICS_BS: DeepPartial<ProphetsTopic>[] = [
  {
    title: "Adam (AS)",
    summary: "Prvi čovjek i prvi prorok, počašćen znanjem i ispitan poslušnošću.",
    body: [
      "Adam (alejhi selam) je mjesto gdje počinje ljudska historija i poslanstvo. Allah ga je stvorio svojim rukama od gline, udahnuo u njega iz svog duha i naučio ga imenima svih stvari. Kada je anđelima naređeno da padnu Adamu na sedždu u čast, oni su poslušali - ali je Iblis odbio iz oholosti, i od tog trenutka je proglašeno njegovo neprijateljstvo prema Adamu i njegovom potomstvu. Ova početna scena postavlja središnju dramu svakog ljudskog života: izbor između ponizne poslušnosti i ponosne pobune (Kur'an 2:30–39).",
      "Allah je Adama i njegovu ženu Hawu smjestio u baštu i dozvolio im sve osim jednog drveta. Šejtan im je šapnuo, jeli su iz nje. Ali primijetite razliku između njih i Iblisa: Iblis je opravdao svoj grijeh, dok su Adam i Hawa odmah požalili i vratili se Allahu riječima koje ih je poučio: 'Gospodaru naš, sami smo sebi učinili nepravdu, i ako nam ne oprostiš i ne smiluješ nam se, sigurno ćemo biti među gubitnicima' (Kur'an 7:23). Allah je prihvatio njihovo pokajanje i poslao ih na Zemlju sa obećanjem upute za sve koji će slijediti.",
      "Adamova lekcija je lekcija nade: ljudsko biće je počašćeno i dostojanstveno, ali je iskušeno i okliznuće. Ono što definiše vjernika nije biti bezgriješan – samo je Allah savršen – već brzo i iskreno vraćanje u tevbu. Adamova priča također uči da je šejtan deklarirani, otvoreni neprijatelj čije je jedino oružje šaputanje; odgovor je sjećanje na Allaha i traženje Njegovog oprosta. Od Adama pa nadalje, silazak na zemlju nije kazna, već pozornica za pravi test čovječanstva.",
    ],
    profile: {
      nation: "Rano čovečanstvo",
      location: "Džennet onda zemlja",
      era: "Početak ljudske istorije",
      mission: "Učite prve ljude tevhidu i pokornosti Allahu.",
      challenges: [
        "Iblisovo neprijateljstvo",
        "Život nakon silaska na zemlju",
        "Vođenje prve ljudske porodice",
      ],
      miracles: ["Stvaranje po Allahovoj naredbi bez roditelja", "Biti naučen imenima svih stvari"],
      majorEvents: [
        "Stvaranje Adama i učenje o imenima",
        "Meleka sedžda i Iblisovo odbijanje",
        "Laganje u bašti, iskreno pokajanje i silazak na zemlju",
      ],
      lessons: [
        "Ljudska čast dolazi zajedno sa odgovornošću",
        "Iskreno pokajanje ponovo otvara vrata nakon svake greške",
        "Šejtan je jasan, trajni neprijatelj",
      ],
      facts: [
        "Adam je prvo ljudsko biće i prvi prorok",
        "Njegovo pokajanje je prvi model tevbe u Kur'anu",
      ],
    },
    quran: [
      {
        excerpt:
          "I [spomenite] kada je vaš Gospodar rekao melekima: Ja ću na Zemlji učiniti uzastopnu vlast... Tada je Adam primio riječi od svog Gospodara, i On je prihvatio njegovo pokajanje.",
      },
      {
        excerpt:
          'Rekoše: "Gospodaru naš, sami sebi smo nepravdu učinili, i ako nam ne oprostiš i ne smiluješ nam se, sigurno ćemo biti među gubitnicima."',
      },
    ],
    hadith: [
      {
        excerpt:
          "Na Sudnjem danu ljudi će doći Adamu i reći: Ti si otac ljudi; zauzmi se za nas kod svog Gospodara.",
      },
      {
        excerpt:
          'Adam i Musa su se svađali. Musa reče: Ti si onaj koga je Allah stvorio svojom rukom. Adam je rekao: "Da li me kriviš za stvar koju mi ​​je Allah odredio prije nego što me je stvorio?" Dakle, Adam je prevagnuo nad Musom u raspravi.',
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Idris (SAD)",
    summary: "Istinoljubiv poslanik hvaljen za strpljenje i uzdignut od Allaha na visoko mjesto.",
    body: [
      "Idris (alejhis-selam) se samo kratko spominje u Kur'anu, ali svaka riječ o njemu je pohvala. Allah ga naziva 'čovjekom istine, prorokom' (Kur'an 19:56) i navodi ga među strpljive i pravedne uz Ismaila i Zul-Kifla (Kur'an 21:85–86). Njegova priča pokazuje da je u očima Allaha, čovjekov karakter – istinitost, strpljivost, postojano obožavanje – važniji od dužine njegove biografije.",
      "Allah za njega kaže: 'I Mi smo ga uzdigli na visoko mjesto' (Kur'an 19:57). Učenjaci su shvatili da se ovo odnosi na njegov uzvišeni položaj kod Allaha. Osim onoga što Kur'an i vjerodostojni izvještaji potvrđuju, popularne priče vezane za Idrisa (kao što je to da je prvi pisao perom ili određene svjetovne profesije) nisu utemeljene čvrstim dokazima, tako da se pažljivi vjernik drži onoga što objava potvrđuje, a ne uljepšava.",
      "Idrisova pouka je da se bliskost s Allahom ne mjeri slavom ili dugom pričom, već iskrenošću i dosljednošću. Tihi, istinoljubivi, nepokolebljivi sluga može držati položaj kod Allaha višim od mnogih čija imena historija pamti glasno.",
    ],
    profile: {
      era: "Rane generacije nakon Adama",
      mission: "Pozovite ljude da obožavaju Allaha sa istinom i pravednošću.",
      lessons: [
        "Istinitost podiže rang sluge",
        "Nije svaka prorokova priča detaljna — i to je zamišljeno",
        "Postojana, vjerna dosljednost je draga Allahu",
      ],
      facts: [
        "Naveden u Kur'anu kao istinit i prorok",
        "Opisano kao da ga je Allah uzdigao na visoku poziciju",
      ],
    },
    quran: [
      {
        excerpt:
          "I spomenuti u Knjizi Idrisa. Zaista, on je bio čovjek istine i prorok. I Mi smo ga uzdigli na visoku stanicu.",
      },
      {
        excerpt:
          "I Ismail i Idris i Dhul-Kifl - svi su bili od pacijenta. I Mi smo ih primili u Svoju milost; zaista, oni su bili od pravednika.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Noa (SAD)",
    summary: "Glasnik izuzetnog strpljenja koji je stoljećima prije potopa pozivao svoj narod.",
    body: [
      "Nuh (alejhi selam) je poslan ljudima koji su napustili tevhid i počeli obožavati idole. Njegova jedina, nepokolebljiva poruka bila je: 'O narode moj, obožavajte Allaha; ti nemaš drugog božanstva osim Njega' (Kur'an 7:59). Kur'an čuva njegov vlastiti izvještaj o misiji u suri Nuh: pozivao ih je noću i danju, javno i u tajnosti, nudeći i ohrabrenje i upozorenje - podsjećajući ih da vraćanje Allahu donosi kišu, bogatstvo, djecu i bašte. Ipak, generacija za generacijom, većina se okretala, stavljala svoje prste u uši i postajala samo arogantnija (Kur'an 71:1–28).",
      "Kur'an naglašava samu dužinu njegovog strpljenja: ostao je među njima 'hiljadu godina manje pedeset' (Kur'an 29:14), a još je samo nekolicina vjerovala. Kada je postalo jasno da više neće prihvatiti vjeru, Allah mu je naredio da sagradi lađu po božanskom uputstvu dok su se nevjernici rugali. Onda su poplavne vode došle kao presuda. Nuhov rođeni sin je odbio da se ukrca, vjerujući planini zbog očevog upozorenja, i bio je među onima koji su se udavili - prodoran podsjetnik da krvne veze ne mogu zamijeniti vjeru (Kur'an 11:42–46).",
      "Nuhova priča je majstorski tečaj Kur'ana u da'wi: dužnost pozivatelja je iskrena, strpljiva, jasna isporuka - rezultati pripadaju samo Allahu. Takođe uči da je vodstvo stvar srca, a ne loze: prorokov sin može biti izgubljen, dok se stranci mogu spasiti. Vjernici koji su se ukrcali u arku postali su sjeme obnovljenog čovječanstva, a Nuh je počastvovan kao jedan od pet najvećih glasnika čvrste odlučnosti (ulul-'azm).",
    ],
    profile: {
      nation: "Njegov narod prije potopa",
      location: "Drevna mezopotamska regija (široko citirana)",
      era: "Veoma rana antika",
      mission: "Pozovi njegov narod na tevhid i pokajanje.",
      challenges: [
        "Ruganje od strane lidera i elite",
        "Vekovi odbacivanja sa malo vernika",
        "Nevjerica i utapanje vlastitog sina",
      ],
      miracles: ["Kovčeg izgrađen po božanskom uputstvu", "Spas vjernika kroz potop"],
      majorEvents: [
        "Poziv na tevhid koji traje skoro hiljadu godina",
        "Izgradnja kovčega po Allahovoj naredbi",
        "Potop i novi početak za vjernike",
      ],
      lessons: [
        "Upornost u da'vi, prepuštanje rezultata Allahu",
        "Porodične veze ne mogu zamijeniti vjeru",
        "Allah uvijek čuva iskrene",
      ],
      facts: [
        "Jedan od pet glasnika čvrste odlučnosti (ulul-'azm)",
        "Njegova priča se pojavljuje u mnogim surama, uključujući i onu nazvanu po njemu",
      ],
    },
    quran: [
      {
        excerpt:
          "I Nuhu je otkriveno da niko od tvog naroda neće vjerovati osim onih koji su već povjerovali, zato se nemoj uznemiravati onim što su radili.",
      },
      {
        excerpt:
          'Rekao je: "Gospodaru moj, ja sam, zaista, pozivao svoj narod noću i danju, ali ga je moj poziv povećao samo u bijegu.',
      },
    ],
    hadith: [
      {
        excerpt:
          "Ljudi će doći Nuhu i reći: O Nuh, ti si prvi od poslanika ljudi na Zemlji, a Allah te je imenovao zahvalnim robom; zauzmite se za nas.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Hud (AS)",
    summary:
      "Poslan u Ad, moćni i moćni narod koji je dopustio da se njihova snaga pretvori u aroganciju.",
    body: [
      "Hud (alejhis-selam) je poslan ljudima iz Ada, civilizacije koju Kur'an opisuje kao fizički moćnu i poznatu po izgradnji visokih, složenih građevina 'kao što nikada nije bilo stvoreno na zemlji' (Kur'an 89:6-8). Ovom ponosnom narodu Hud je donio istu poruku kao i svaki poslanik: 'O narode moj, obožavajte Allaha; ti nemaš drugog božanstva osim Njega. Zar Ga se nećeš bojati?' (Kur'an 7:65). Bio je jedan od njihovih, ne tražeći nikakvu nagradu, samo ih je pozivao na zahvalnost i dalje od ugnjetavanja.",
      "Njihove vođe su odgovorile ruglom, optužujući ga za glupost i laž, držeći se idola svojih predaka. Izazvali su ga da izvede kaznu na koju je upozorio, uvjereni da nijedna sila ne može mjeriti njihovu snagu (Kur'an 46:21-25). Hud ih je jasno upozorio da svjetovna moć i velika civilizacija ne štite nikoga ko poriče Allahove znakove i postaje arogantan na Zemlji.",
      "Presuda je došla kao bijesni vjetar koji je zavijao koji im je Allah 'nametnuo sedam noći i osam dana uzastopno' (Kur'an 69:6-7), ostavljajući nekada moćne ljude pali poput šupljih stabala - dok su Hud i vjernici bili spašeni Allahovom milošću. Priča o Adu se ponavlja kroz Kur'an kao stalno upozorenje: snaga, bogatstvo i postignuće su darovi koje treba dočekati s poniznošću i zahvalnošću, a ne ponosom. Nacija je odgovorna Allahu ma koliko napredovala.",
    ],
    profile: {
      nation: "Ljudi iz 'Ad",
      location: "Regija Al-Ahqaf (južna arapska oblast u klasičnom tefsiru)",
      era: "Nakon Nuh",
      mission: "Vratite tevhid, zahvalnost i pravdu među 'Ad.",
      challenges: [
        "Kolektivna arogancija izgrađena na snazi ​​i bogatstvu",
        "Ruganje otkrivenju i proroku",
        "Prkosan zahtjev za hitnom kaznom",
      ],
      miracles: ["Zaštita vjernika tokom kazne"],
      majorEvents: [
        "Poziv na pokajanje i zahvalnost",
        "Upozorenje na jak vjetar",
        "Uništenje 'Ad-a za sedam noći i osam dana",
      ],
      lessons: [
        "Snaga bez poniznosti vodi u propast",
        "Nacije i civilizacije su odgovorne Allahu",
        "Proročka upozorenja su milost poslana prije presude",
      ],
      facts: ["Priča o Adu se ponavlja u Kur'anu kao upozorenje kasnijim zajednicama"],
    },
    quran: [
      {
        excerpt:
          "A u Ad [Mi smo poslali] njihovog brata Huda. Rekao je: O narode moj, obožavajte Allaha; ti nemaš drugog božanstva osim Njega. Zar ga se nećeš bojati?",
      },
      {
        excerpt:
          "Pa kada su to vidjeli kao oblak koji se približava njihovim dolinama, rekli su: Ovo je oblak koji nam donosi kišu! Umjesto toga, to je ono zbog čega ste bili nestrpljivi: vjetar u njemu bolna kazna.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Salih (SAD)",
    summary: "Poslano Samudu, koji je dobio čudo deve i uništio znak koji su tražili.",
    body: [
      "Salih (alejhis-selam) je poslan Semudu, narodu koji je naslijedio Ada i koji je bio poznat po rezbarenju velikih domova u planinama i životu u lagodnosti (Kur'an 7:74). Pozvao ih je, kao njihovog rođenog brata, da obožavaju samo Allaha i napuste pokvarenost svojih vođa. Kada su tražili znak da dokaže njegovu istinitost, Allah je dao jasan i javan znak: devu, sa utvrđenim dogovorom da će piti jednog dana, a oni drugog (Kur'an 26:155–156).",
      "Salih ih je izričito upozorio: 'Ne dirajte je na štetu, da vas ne bi zadesila skoro kazna' (Kur'an 26:156). Znak je bio test suzdržanosti – da li su mogli poštovati granicu koju je postavio Allah? Ali najprkosniji među njima je u otvorenoj pobuni ubio devu, a zatim izazvao Saliha da donese obećanu kaznu (Kur'an 7:77). Ubistvo kamile je nazvano kao čin nekolicine bijednih, ali je cijeli narod sudjelovao u zločinu pristankom na njega.",
      "Kazna je nastupila u roku od tri dana: jaka eksplozija i zemljotres zahvatili su ih u njihovim domovima, a Semud je ležao beživotan - dok je Allah spasio Saliha i one koji su vjerovali (Kur'an 7:78–79; 91:14). Pouka je oštra: čuda ne smekšaju tvrdoglavo srce; oni samo podižu ulog odgovornosti. Znak koji se traži, a zatim mu prkosi, postaje argument protiv onih koji su ga tražili. A ćutanje pred zlom nije neutralnost – čitava nacija je smatrana odgovornom za djelo nekolicine.",
    ],
    profile: {
      nation: "Ljudi Samuda",
      location: "Al-Hijr / sjeverozapadna Arabija",
      era: "Nakon 'Ad",
      mission: "Pozovite Samuda od idolopoklonstva i korupcije do tevhida.",
      challenges: [
        "Zahtjev za čudom, a zatim odbijanje",
        "Otvoreni prkos nakon jasnog znaka",
        "Prijetnje Salihu i vjernicima",
      ],
      miracles: ["Deva poslana kao vidljivi znak od Allaha"],
      majorEvents: [
        "Izgled deve i zajednička voda",
        "Tetiva koljena i ubijanje deve",
        "Eksplozija koja je uništila one koji ih odbijaju",
      ],
      lessons: [
        "Čuda ne idu na korist tvrdoglavom srcu",
        "Probijanje granice koju je Allah postavio nosi stvarne posljedice",
        "Pristanak na zlo učestvuje u njegovoj krivici",
      ],
      facts: ["Thamud je bio poznat po rezbarenju složenih domova u planinama"],
    },
    quran: [
      {
        excerpt:
          "Ovo je Allahova deva kao znak za vas, zato je ostavite da jede u Allahovoj zemlji i ne dirajte je na zlo, da vas ne zadesi bolna kazna.",
      },
      {
        excerpt:
          "Semud je poricao zbog njihovog prijestupa, kada je najjadniji od njih poslat... Tako je njihov Gospodar obrušio na njih uništenje zbog njihovog grijeha i sravnio ih.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ibrahim (AS)",
    summary:
      "Halilullah, Allahov prijatelj i uzor čistog tevhida, testiran i pobjednik u svakom iskušenju.",
    body: [
      "Ibrahim (alejhi selam) je kur'anski vrhunski primjer čistog monoteizma do kojeg se dolazi kroz razmišljanje i hrabrost. Kao mladić u društvu koje se davilo u obožavanju idola, otvoreno je raspravljao sa svojim narodom, svojim ocem, pa čak i kraljem: sunce, mjesec i zvijezde svi zalaze i blijede, pa kako su oni mogli biti bogovi? (Kur'an 6:75–79). Da bi razotkrio nemoć idola, razbio ih je sve osim najvećeg i rekao svom narodu da pita same idole šta se dogodilo - prisiljavajući ih da priznaju da njihovi bogovi ne mogu ni govoriti ni braniti se (Kur'an 21:57–67).",
      "Zbog toga je bačen u vatru koja je rasplamsala, ali je Allah naredio: 'O vatra, budi hladnoća i sigurnost Ibrahimu' (Kur'an 21:69), i on je izašao nepovrijeđen. Njegov život se pretvorio u lanac iskušenja naišlih na potpunu predaju: napustio je svoju domovinu radi Allaha, molio se za pravedno potomstvo u starosti i bio mu je darovan Ismail i Ishak, bio je testiran naredbom da žrtvuje svog voljenog sina — što su i otac i sin prihvatili u pokornosti prije nego što je Allah otkupio dječaka — i podigao je temelje na Kah-Ismailu na osnovu vjerovanja. i da se među njih pošalje glasnik (Kur'an 2:124–129; 37:100–107).",
      "Zbog ove odanosti bez premca, Allah je uzeo Ibrahima za halila — intimnog prijatelja (Kur'an 4:125) — i učinio ga imamom, vođom cijelog čovječanstva (Kur'an 2:124). Njegovo naslijeđe se proteže kroz poslanike koji su dolazili iz njegove loze, kroz obrede hadža i kroz sam identitet muslimana, kojem je naređeno da slijedi 'Ibrahimovu vjeru, sklon istini' (Kur'an 3:95). Njegova priča uči tawakkul u najtežim iskušenjima, da se pravo vođstvo gradi na žrtvi i da iskrena vjera može preoblikovati čitave generacije.",
    ],
    profile: {
      nation: "Mesopotamske i Levantijske zajednice",
      location: "Irak, Levant i Meka",
      era: "Srednja antika",
      mission: "Oživite čisti tevhid i uspostavite trajno naslijeđe pokornosti.",
      challenges: [
        "Suočavanje s idolopoklonicima, vlastitim ocem i kraljem tiraninom",
        "Seoba daleko iz domovine za Allaha",
        "Suđenje žrtvovanja svog voljenog sina",
      ],
      miracles: [
        "Vatra je postala hladna i sigurna po Allahovoj naredbi",
        "Pravedno potomstvo dato u starosti",
      ],
      majorEvents: [
        "Rasprava i razbijanje idola",
        "Biti bačen u vatru i isporučen",
        "Izgradnja Ka'be sa Ismailom i velika kušnja žrtve",
      ],
      lessons: [
        "Tawakkul (oslanjanje na Allaha) u najtežim iskušenjima",
        "Pravo vođstvo zahteva žrtvu",
        "Iskrena vjera može preoblikovati generacije",
      ],
      facts: [
        "Poznat kao Halilullah, Allahov intimni prijatelj",
        "Praotac proroka preko Ismaila i Ishaka",
      ],
    },
    quran: [
      {
        excerpt:
          "I [spomeni] kada je Ibrahima iskušao njegov Gospodar sa naredbama i on ih je ispunio. Rekao je: Zaista, učiniću te vođom za narod.",
      },
      {
        excerpt:
          "Rekli smo: O vatra, budi hladnoća i sigurnost Ibrahimu. I oni su mu naudili, ali Mi smo ih učinili najvećim gubitnicima.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Bićete okupljeni bosi, goli i neobrezani. Prvi koji će biti obučen na Kijametskom danu biće Ibrahim.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "lut (AS)",
    summary:
      "Prorok koji je upozorio svoj narod na tešku nemoralnost koju nijedna nacija nije počinila prije njih.",
    body: [
      "Lut (alejhi selam) je bio Ibrahimov savremenik i rođak koji je emigrirao s njim, a zatim je poslan ljudima u Sodomi i obližnjim gradovima. Pored poziva da se obožava samo Allaha, njegov narod je bio kriv za besramni nemoral za koji Kur'an kaže da 'niko na svim svjetovima nije počinio prije' - približavanje muškarcima umjesto ženama i otvoreno prakticiranje nepristojnosti na njihovim okupljanjima (Kur'an 7:80–81; 29:28–29). Lut ih je iskreno pozvao na čistoću i na prirodne granice koje je Allah postavio.",
      "Njegovu reformu su dočekali ne argumentovano, već neprijateljski, prijeteći da će ga protjerati i ismijavajući njegov poziv na pristojnost: 'Protjerajte ih iz svog grada; oni su ljudi koji se čuvaju čistim!' (Kur'an 7:82). Čak i unutar njegovog vlastitog domaćinstva iskušenje je bilo teško - njegova žena je stala na stranu pokvarenih i nije vjerovala, dokazujući još jednom da je uputa od Allaha darovana, a ne naslijeđena brakom ili krvlju (Kur'an 66:10).",
      "Kada je došao dekret, Allah je poslao meleke u obliku gostiju. Ljudi su požurili da naude čak i njima, a Lut se osjećao nemoćnim sve dok anđeli nisu otkrili njihov identitet i rekli mu da noću ode s vjernicima. U zoru su gradovi bili prevrnuti i zasuti kamenicama (Kur'an 11:77–83). Lutova priča je jasno upozorenje da se moralna istina ne mijenja zato što društvo odobrava grijeh i javno ga normalizira — i da Allah uvijek spašava iskrene, koliko god malo njih bilo.",
    ],
    profile: {
      nation: "Ljudi iz Sodome i susjednih gradova",
      location: "Region Mrtvog mora (široko citirano)",
      era: "Ibrahimovo vrijeme",
      mission:
        "Pozovi njegov narod od otvorene nepristojnosti i nevjerovanja do tevhida i čistoće.",
      challenges: [
        "Ukorijenjeni javni nemoral",
        "Ruganje i pretnje izbacivanjem",
        "Nevjerica njegove vlastite žene",
      ],
      majorEvents: [
        "Uporna upozorenja protiv nepristojnosti",
        "Posjeta anđela prerušenih u goste",
        "Prevrtanje gradova",
      ],
      lessons: [
        "Moralna istina se ne menja sa društvenim odobravanjem",
        "Vjernika je možda vrlo malo",
        "Allah spašava iskrene od kolektivne propasti",
      ],
      facts: ["Ibrahimov rođak koji je migrirao s njim i poslan u Sodomu"],
    },
    quran: [
      {
        excerpt:
          "Da li prilazite muškarcima među svjetovima i ostavljate li ono što je vaš Gospodar stvorio za vas? Naprotiv, vi ste prestupnik.",
      },
      {
        excerpt:
          "Dakle, kada je stigla Naša naredba, Mi smo najviše dijelove gradova učinili najnižim i kišu na njih obrušili kamenjem od slojevite tvrde gline.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ismail (AS)",
    summary:
      "Poslanik vjeran svojoj riječi, strpljiv u iskušenju i graditelj Ka'be sa svojim ocem Ibrahimom.",
    body: [
      "Ismail a.s. je bio prvorođeni Ibrahimov sin, darovan u starosti. Njegov život je počeo sa zapanjujućim testom povjerenja: po Allahovoj naredbi, Ibrahim je ostavio dijete Ismaila i njegovu majku Hadžer u neplodnoj dolini Mekke, gdje nisu rasli usjevi i nije tekla voda. Tamo je, dok je Hadžer trčao u potrazi za vodom između brda Safa i Merva, Allah izazvao da izvire Zemzem - čin opskrbe koji Hadžarini potomci i svaki hodočasnik ponavljaju u sa'iju hadža i umre do danas.",
      "Kao mladić, Ismail se suočio sa najvećim iskušenjem zajedno sa svojim ocem: kada mu je Ibrahim rekao za viziju da ga žrtvuje, Ismail je odgovorio sa zadivljujućom pokornošću: 'O moj oče, radi kako ti je naređeno; naći ćeš me, ako Allah hoće, od postojanog' (Kur'an 37:102). Obojica su se u potpunosti predali, a Allah je otkupio Ismaila velikom žrtvom, poštujući njihovu pokornost zauvijek. Otac i sin su tada zajedno podigli temelje Kabe, moleći se: 'Gospodaru naš, primi ovo od nas; Ti si, zaista, onaj koji čuje i zna' (Kur'an 2:127).",
      "Kur'an sažima njegov karakter u stihu vrijednom pamćenja: 'Bio je vjeran svom obećanju, i bio je glasnik i prorok. Svojoj porodici je zapovijedao namaz i zekat, i bio je zadovoljan svome Gospodaru' (Kur'an 19:54–55). Ismailov život uči ljepoti držanja riječi, postojanog ibadeta i porodice koja sarađuje u pokornosti Allahu. Preko njega je arapska proročka linija na kraju stigla do konačnog poslanika, Muhammeda, sallallahu alejhi ve sellem.",
    ],
    profile: {
      nation: "Rani ljudi regije Mekke",
      location: "Mekka",
      era: "Nakon Ibrahimove seobe",
      mission: "Podržava tevhid i ibadet, i naredi svojoj porodici namaz i zekat.",
      challenges: [
        "Surovi počeci života u neplodnoj dolini",
        "Suđenje žrtve",
        "Održavanje života usmjerenog na obožavanje i sveto povjerenje",
      ],
      miracles: ["Izvor Zamzam je u pustinji", "Otkupljena od žrtve od strane Allaha"],
      majorEvents: [
        "Ostavio sa svojom majkom Hadžer u dolini Mekke",
        "Suđenje žrtve, naišlo na potpunu pokornost",
        "Izgradnja Ka'be sa Ibrahimom",
      ],
      lessons: [
        "Održavajte svoja obećanja vjerno",
        "Porodica može sarađivati ​​u bogosluženju i poslušnosti",
        "Sveto naslijeđe zahtijeva snažan karakter",
      ],
      facts: [
        "U Kur'anu je opisan kao istinit svom obećanju",
        "Praotac arapskih plemena i konačna proročka linija",
      ],
    },
    quran: [
      {
        excerpt:
          "I spomenuti u Knjizi Ismaila. Zaista, bio je vjeran svom obećanju, i bio je glasnik i prorok. Svojoj porodici je zapovijedao namaz i zekat, i bio je zadovoljan svome Gospodaru.",
      },
      {
        excerpt:
          "I kada je Ibrahim podizao temelje Kuće i Ismaila, [oni su se molili]: Gospodaru naš, primi ovo od nas. Zaista, Vi ste Slušajući, Znajući.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Ishak (AS)",
    summary: "Blagoslovljen prorok dat kao radosnu vijest Ibrahimu, i otac Ja'kuba.",
    body: [
      "Ishak (alejhis-selam) je rođen Ibrahimu i njegovoj ženi Sari u starosti - rođenje koje su meleki najavili kao radosnu vijest kada se Sara, koja je prešla doba rađanja, začuđeno nasmijala. Kur'an bilježi trenutak: 'Mi smo joj dali dobre vijesti o Ishaku i, nakon Ishaka, Ya'kubu' (Kur'an 11:71). Samo njegovo rođenje je bio znak da Allahova moć i milost nisu ograničeni uobičajenim ljudskim granicama, i utjeha svakom vjerniku koji čeka na tešku nadu.",
      "Kur'an dosljedno imenuje Ishaka među pravednim, odabranim i plemenitim prorocima, opisujući njega i Ja'kuba kao da su dobili 'snagu u obožavanju i viziji' (Kur'an 38:45–47). Preko Ishaka je došao Ya'qub (Isra'il), a od Ya'quba je potekao dugi lanac proroka poslanih u Bani Isra'il - tako da Ishak stoji kao otac proročanstva, karika u kontinuitetu vođenja kroz generacije.",
      "Njegova priča, iako je ispričana ukratko, nosi dvije trajne lekcije: zahvalnost za darove koje Allah daje iznad naših očekivanja i svijest da je pravedna loza povjerenje - vjera se mora prenositi, a ne samo naslijeđivati. Blagoslov stavljen u Ibrahimov dom je sačuvan jer su ga nosili Allahu odani robovi.",
    ],
    profile: {
      nation: "Levantske zajednice",
      location: "Levant (šam)",
      era: "Nakon Ibrahima",
      mission: "Nastavite s proročkim vodstvom u Ibrahimovoj blagoslovljenoj porodičnoj liniji.",
      miracles: ["Rođenje najavljeno starim roditeljima kao radosna vijest"],
      majorEvents: ["Radosna vijest data Ibrahimu i Sari", "Nastavak proročke loze preko Ja'kuba"],
      lessons: [
        "Allah daje daleko iznad ljudskih očekivanja",
        "Pravedna loza je povjerenje koje treba sačuvati",
        "Vjerna sukcesija održava vodstvo živim",
      ],
      facts: ["Ya'qubov otac", "Imenovan pored Ibrahima i Ya'quba kao izabrana porodica"],
    },
    quran: [
      {
        excerpt:
          "A njegova žena je stajala i smijala se. Zatim smo joj dali dobre vijesti o Ishaku i, nakon Ishaka, o Ya'kubu.",
      },
      {
        excerpt:
          "I sjetite se robova Naših Ibrahima, Ishaka i Ja'kuba, onih od snage i vizije. Zaista, odabrali smo ih zbog ekskluzivnog kvaliteta: sjećanja na Dom.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ya'qub (AS)",
    summary:
      "Također se naziva Isra'il, prorok čije lijepo strpljenje kroz tugu modelira nepokolebljivo povjerenje u Allaha.",
    body: [
      "Ya'qub (alejhi selam), također zvan Isra'il, bio je Ishakov sin i otac dvanaestorice koja su postala plemena Bani Isra'il - uključujući Jusufa. Svoju djecu je odgajao na tevhidu, a Kur'an čuva zavjet koji je uzeo od njih na samrti: 'Šta ćeš poslije mene klanjati?' Oni su odgovorili: 'Mi ćemo se klanjati vašem Bogu i Bogu vaših očeva... jednom Bogu i Njemu se pokoravamo' (Kur'an 2:132–133). Njegova najdublja briga, do samog kraja, bila je vjera sljedeće generacije.",
      "Njegovo veliko suđenje odvija se u priči o Jusufu. Kada su se njegovi sinovi vratili sa Jusufovom košuljom i lažnom tvrdnjom da ga je vuk progutao, Ja'kub je prozreo prevaru i odgovorio ne s bijesom nego suzdržano: 'Zato je strpljenje najprikladnije, a Allah je onaj čija se pomoć traži protiv onoga što opisuješ' (Kur'an 12:18). Za duge godine razdvojenosti on je tugovao sve dok mu, kako Kur'an dirljivo kaže, oči nisu pobijelile od tuge - ipak je potisnuo svoju tugu i nikada nije očajavao (Kur'an 12:84).",
      "Srž Ya'qubovog primjera je jedna rečenica: 'Ne očajavajte zbog Allahove milosti; Zaista, niko ne očajava u Allahovoj milosti osim ljudi koji ne vjeruju' (Kur'an 12:87). Njegov model je sabr džemil – prelijepo strpljenje – koje nije pasivna rezignacija već aktivno povjerenje pune nade da će se Allahova mudrost u svoje vrijeme otkriti. Kada mu je Jusuf konačno vraćen i vid mu se vratio, to strpljenje je potvrđeno. Ya'qub uči svakog ožalošćenog vjernika da drži i tugu i sigurnost u istom srcu.",
    ],
    profile: {
      nation: "Poreklo Bani Isra'ila",
      location: "Levant, sa migracijom u Egipat",
      era: "Generacija Jusufa",
      mission: "Uputi svoje ukućane i potomke u tevhid.",
      challenges: [
        "Tenzije i ljubomora među njegovim sinovima",
        "Duga razdvojenost od Jusufa",
        "Izdržati duboku tugu bez gubljenja nade",
      ],
      majorEvents: [
        "Njegov savjet i zavjet tevhida njegovim sinovima",
        "Duge godine strpljive tuge zbog Jusufa",
        "Radostan ponovni susret sa Jusufom u Egiptu",
      ],
      lessons: [
        "Lijepo strpljenje (sabr jamil) je aktivna vjera puna nade",
        "Roditelji oblikuju vjeru svoje djece",
        "Nikad ne očajavajte zbog Allahove milosti",
      ],
      facts: ["Također se zove Izrael", "Otac Jusufa i plemena Bani Isra'il"],
    },
    quran: [
      {
        excerpt:
          "On je rekao: Nego, vaše duše su vas namamile na nešto. Dakle, strpljenje je najprikladnije. Možda će mi ih Allah sve zajedno dovesti.",
      },
      {
        excerpt:
          "Oni su rekli: Obožavaćemo tvog Boga i Boga tvojih očeva, Ibrahima, Ismaila i Ishaka - jednog Boga, i Njemu se pokoravamo.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Jusuf (AS)",
    summary:
      "Prorok čije putovanje od bunara do egipatskog prijestolja uči čistoti, strpljenju i praštanju.",
    body: [
      "Jusuf (alejhis-selam) je tema najpotpunije pojedinačne pripovijesti Kur'ana — sure Jusuf, koju Allah naziva 'najboljom pričom' (Kur'an 12:3). Kao dječak vidio je istinit san o jedanaest zvijezda, suncu i mjesecu kako mu se klanjaju. Njegova zavidna braća bacila su ga u bunar i prodala u ropstvo u Egipat, gde je kupljen u kuću moćnog zvaničnika. Kroz svaki preokret, Jusuf je čuvao svoju vjeru i svoj integritet.",
      "Njegova čistoća bila je testirana kada je žena njegovog gospodara pokušala da ga zavede. On je to odbio, rekavši: 'Tražim utočište od Allaha' i više je volio zatvor nego grijeh: 'Zatvor mi je draži od onoga u koji me pozivaju' (Kur'an 12:33). Iako nevin, bio je u zatvoru godinama - a čak je i tamo pozivao svoje kolege zatvorenike na tevhid i tumačio njihove snove. Kada je kraljev san o sedmogodišnjoj gladi zbunio sud, Jusufov Bogom dani dar tumačenja doveo ga je pred kralja, koji ga je postavio za egipatske riznice. On je upravljao nacijom kroz glad mudrošću i pravdom.",
      "Vrhunac priče nije moć nego oprost. Kada su njegova braća, tjerana glađu, stala pred njega ne prepoznajući ga, Jusuf se otkrio i rekao: 'Danas nećeš biti kriv. Allah će vam oprostiti, a On je najmilostiviji od milostivih' (Kur'an 12:92). Pripisao je Allahu zasluge za svako dobro, rekavši da je njegov Gospodar bio ljubazan kada ga je izveo iz zatvora i ponovo spojio porodicu. Jusuf uči da čednost i taqwa štite vjernika, da Allahov plan tiho nadjača svaku ljudsku zavjeru i da je oprost — a ne osveta — obilježje plemenitog.",
    ],
    profile: {
      nation: "Porodična loza Bani Isra'ila u Egiptu",
      location: "Kanaan i Egipat",
      era: "Prije Muse",
      mission: "Podržavajte tevhid, čistoću i pravdu dok služite društvu.",
      challenges: [
        "Izdaja od strane njegove braće",
        "Iskušenje i lažna kleveta",
        "Dugi zatvor uprkos nevinosti",
      ],
      miracles: ["Bogom dani dar istinitog tumačenja snova"],
      majorEvents: [
        "Bunar i odvajanje od oca",
        "Godine zatvora",
        "Uspon do vlasti u Egiptu i ponovno okupljanje sa svojom porodicom",
      ],
      lessons: [
        "Čednost i integritet štite vjeru",
        "Opraštanje liječi porodice",
        "Allahov plan prevazilazi svaku ljudsku zavjeru",
      ],
      facts: [
        "Cijela sura Jusuf, koja se naziva najboljom pričom, usredotočena je na njegov život",
      ],
    },
    quran: [
      {
        excerpt:
          'Rekao je: "Danas neće biti nikakve krivice na vama." Neka ti Allah oprosti; i On je najmilostiviji od milostivih.',
      },
    ],
    hadith: [
      {
        excerpt:
          "Plemeniti, sin plemenitog, sin plemenitog, sin plemenitog: Jusuf, sin Ja'kuba, sin Ishaka, sina Ibrahimovog.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "shu'ayb (AS)",
    summary:
      "Prorok koji je vjeru vezao za poštenje u trgovini i upozorio Madyana na prevaru i nepravdu.",
    body: [
      "Šuajb (alejhis-selam) je poslat narodu Madyana, trgovačkoj zajednici koja je pokvarila svoju ekonomiju varanjem: davanjem kratke mjere i težine, prijevarom ljudi od njihove robe i širenjem nepravde u zemlji. Njegova poruka ujedinila je dvije polovine vjere koje ljudi često pokušavaju razdvojiti — ibadet i etiku: 'O narode moj, obožavajte Allaha; ti nemaš drugog božanstva osim Njega. I dajte punu mjeru i težinu u pravdi, i ne oduzimajte ljudima ono što im pripada' (Kur'an 11:84–85).",
      "Njegov narod se opirao, sarkastično pitajući da li njegove molitve zahtijevaju od njih da napuste prijevarne običaje svojih očeva i rade kako žele sa svojim bogatstvom (Kur'an 11:87). Rugali su mu se, prijetili njemu i vjernicima protjerivanjem, pa čak i blokirali puteve. Šuajb je ustrajao sa saosjećanjem i jasnim podsjetnicima, insistirajući da je tražio reformu samo onoliko koliko je bio u mogućnosti, i da je njegov uspjeh bio samo od Allaha: 'A moj uspjeh je samo preko Allaha. Na Njega sam se pouzdao i Njemu se vraćam' (Kur'an 11:88). Zapamćen je po svojoj elokvenciji u pozivanju svog naroda.",
      "Kada su ustrajali u odbijanju, stigla je kazna i zahvatila prestupnike, dok je Allah spasio Šuajba i vjernike (Kur'an 7:91–93). Njegova biografija donosi lekciju koja se često zanemaruje: ekonomsko poštenje nije odvojeno od religije – ono je dio nje. Varanje na tržištu, iskorištavanje ugroženih i manipuliranje mjerama su pitanja vjere, a društvo koje legalizira nepravdu poziva na Allahovu presudu.",
    ],
    profile: {
      nation: "Narod Madyana",
      location: "Sjeverozapadna arapska/levantinska trgovačka regija",
      era: "Nakon Ibrahimovih generacija",
      mission: "Poziv na tevhid i poštenje i pravdu u trgovini.",
      challenges: [
        "Ukorijenjena tržišna korupcija",
        "Ruganje od strane elite",
        "Prijetnje protjerivanjem",
      ],
      majorEvents: [
        "Poziv na punu mjeru i pošteno postupanje",
        "Javna opozicija i prijetnje",
        "Kazna upornih odbacivača",
      ],
      lessons: [
        "Vjera zahtijeva poštenje u poslu",
        "Javna nepravda poziva na božanski sud",
        "Proroci se bave društvenom i ekonomskom etikom, a ne samo ritualom",
      ],
      facts: ["Poznat po tome što naglašava samo težine i mjere"],
    },
    quran: [
      {
        excerpt:
          "O narode moj, obožavajte Allaha; ti nemaš drugog božanstva osim Njega. Dajte punu mjeru i težinu i ne oduzimajte ljudima pravo i ne izazivajte pokvarenost na zemlji.",
      },
      {
        excerpt: "I moj uspjeh nije samo preko Allaha. Na Njega sam se pouzdao, i Njemu se vraćam.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ayyub (AS)",
    summary:
      "Kur'anski model strpljenja: nepokolebljiv u odanosti kroz dugotrajnu bolest i gubitak.",
    body: [
      "Ayyub (alejhi selam) — Job — je trajni simbol sabra u Kur'anu. Bio je prorok blagoslovljen zdravljem, bogatstvom i porodicom, a potom iskušan gubitkom i dugom, bolnom bolešću. Kroz sve to nikada nije postao ogorčen ili optužio svog Gospodara za nepravdu; čvrsto se držao zahvalnosti i sjećanja. Kur'an ga hvali riječima koje obuhvataju cijelu njegovu priču: 'Zaista, našli smo ga strpljivog, izvrsnog slugu. Zaista, on se stalno vraćao Allahu' (Kur'an 38:44).",
      "Kada je konačno teškoća postala neodoljiva, primijetite savršene manire (adab) njegove dove. On nije zahtijevao niti se žalio na Allahovu odredbu; on je jednostavno i ponizno izložio svoje stanje pred svog Gospodara: 'Zaista, nevolja me je dotakla, a Ti si najmilostiviji od milostivih' (Kur'an 21:83). On je potvrdio Allahovu milost u samom trenutku traženja. Allah mu je odgovorio: 'Udari nogom o zemlju; ovo je hladna kupka i piće', i On je otklonio nevolju i obnovio svoju porodicu i još mnogo toga, kao milost od Njega i podsjetnik za obožavaoce (Kur'an 21:84; 38:41–43).",
      "Ayyub uči da strpljenje nije pasivna izdržljivost, već aktivni oblik ibadeta - kontinuirano vraćanje Allahu dok je pod iskušenjem. Njegov primjer također poboljšava način na koji dajemo dovu: sa poniznošću, bez prigovora na odredbu i sa sigurnošću u Allahovu milost. I njegov kraj uvjerava svakog provjerenog vjernika da kušnje, koje se nose s vjerom, mogu podići rang sluge i da ih uvijek prati olakšanje u Allahovom vremenu.",
    ],
    profile: {
      era: "Post-Ibrahimsko proročko doba (širi kontekst)",
      mission: "Vodi njegov narod dok utjelovljuje strpljenje i obožavanje u teškoćama.",
      challenges: [
        "Duga i bolna bolest",
        "Gubitak bogatstva i porodice",
        "Izdržljivost pod produženim testom",
      ],
      miracles: [
        "Liječenje i olakšanje po Allahovoj naredbi",
        "Obnova porodice i blagoslov nakon suđenja",
      ],
      majorEvents: [
        "Njegova ponizna molitva u nevolji",
        "Božansko olakšanje, iscjeljenje i obnova",
      ],
      lessons: [
        "Strpljenje je aktivan oblik obožavanja",
        "Dova je najljepša kada je skromna i bez prigovora",
        "Iskušenja koja se nose s vjerom mogu podići nečiji rang",
      ],
      facts: ["Citiran u cijeloj islamskoj tradiciji kao model sabra"],
    },
    quran: [
      {
        excerpt:
          "A Ejub, kada je pozvao svog Gospodara: Zaista, nevolja me je dotakla, a Ti si najmilostiviji od milostivih.",
      },
      {
        excerpt:
          "Zaista, našli smo ga strpljivim, odličnim slugom. Zaista, on se stalno vraćao Allahu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "zul-kifl(AS)",
    summary: "Pravedni prorok ubrajan među pacijente, počašćen iako je njegova priča kratka.",
    body: [
      "Zul-Kifl (alejhis-selam) je dva puta imenovan u Kur'anu, oba puta u društvu poštovanih poslanika. Allah ga navodi sa Ismailom i Idrisom — 'svi su bili strpljivi. I Mi smo ih primili u Svoju milost; zaista, oni su bili od pravednih' (Kur'an 21:85-86) - i opet ga spominje među izvrsnima uz Ismaila i Al-Yasa' (Kur'an 38:48). Svako spominjanje je pohvala, iako nije dat detaljan narativ.",
      "Budući da Kur'an i vjerodostojni sunnet ne proširuju njegov život, klasični učenjaci se razlikuju čak i oko osnovnih detalja - neki smatraju da li je bio poslanik ili pravedan čovjek, iako se ubraja među poslanike na glavnim muslimanskim listama. Pažljivi vjernik se opire ispunjavanju tišine neprovjerenim pričama i umjesto toga drži se onoga što Allah potvrđuje: bio je strpljiv i pravedan, i to je dovoljna čast.",
      "Njegovo uključivanje nosi tihu lekciju: ne ostavlja svaki Allahov voljeni rob iza sebe poznatu priču. Dosljedna, vjerna služba – ona vrsta koja nikada nije zabilježena u historiji, ali je u potpunosti poznata Allahu – upravo je vrsta koja zaslužuje Njegovu milost. Skrivena postojanost nije manja; to je suština pravednog života.",
    ],
    profile: {
      era: "Kasniji proročki periodi prije Isae (široko raspoređeni)",
      mission: "Pozovi svoj narod na poslušnost i pravednost.",
      lessons: [
        "Strpljenje je u osnovi proročkog karaktera",
        "Ograničeni detalji još uvijek nose snažne smjernice",
        "Vjerna, nevidljiva služba je voljena Allahu",
      ],
      facts: [
        "Imenovan sa Ismailom i Idrisom među pacijentima",
        "Ubraja se među proroke na glavnim muslimanskim listama",
      ],
    },
    quran: [
      {
        excerpt:
          "I Ismail i Idris i Dhul-Kifl - svi su bili od pacijenta. I Mi smo ih primili u Svoju milost; zaista, oni su bili od pravednika.",
      },
      {
        excerpt: "I zapamtite Ismaila, Al-Yasa'a i Dhul-Kifla, i svi su među istaknutim.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Mojsije (AS)",
    summary: "Veliki glasnik Bani Isra'ila koji se suprotstavio faraonovom tiraniju i primio Toru.",
    body: [
      "Musa a.s. je najčešće spominjani poslanik u Kur'anu, a njegova priča je ispričana do detalja. Rođen po faraonovom dekretu da ubije sinove Bani Isra'ila, njegova majka ga je kao dijete stavila u korpu na Nilu - na Allahovo nadahnuće - i, po Allahovom planu, odgajan u vlastitoj faraonovoj palači (Kur'an 28:7-13). Godinama kasnije, nakon što je napustio Egipat i vjenčao se u Madyanu, pozvao ga je Allah u svetu dolinu Tuwa, gdje mu se Allah direktno obratio, pokazao mu znak štapa i ruke i poslao ga sa svojim bratom Harunom faraonu tiraninu (Kur'an 20:9–36).",
      "Njegova misija je bila da dostavi dvije stvari: poziv da se obožava samo Allah i zahtjev da se oslobode potlačena djeca Izraela. Faraon, koji je tvrdio da je bog, dočekao ga je s prkosom, pa čak i nakon niza jasnih znakova - štapa koji je postao zmija i progutao trikove mađioničara i kuge - odbio je da se pokori. Kada je Musa izveo Bani Isra'ila, faraon ih je progonio do mora. Tamo je Allah naredio: 'Udarite more svojim štapom', i ono se razdvojilo tako da su vjernici prešli po kopnu, dok su faraon i njegova vojska bili utopljeni (Kur'an 26:63-66).",
      "Ali oslobođenje je bilo samo početak. Musa je tada podnio teže, duže iskušenje vođenja teškog i često nezahvalnog naroda: primio je Toru na brdu, da bi se vratio i zatekao ih kako obožavaju zlatno tele; suočio se sa njihovim pritužbama, njihovim zahtjevima i njihovom neposlušnošću sa strpljivim, čvrstim vodstvom. Musin život spaja dvije velike teme — hrabrost da se suprotstavi nepravdi i tiraniji i izdržljivost koja je potrebna da se ljudi vode ka poslušnosti kada budu slobodni. Kao jedan od ulul-'azma, on je uzor i reformatora i pastira zajednice.",
    ],
    profile: {
      nation: "Bani Isra'il (sa pozivom upućenim faraonovom narodu)",
      location: "Egipat i Sinaj",
      era: "Prije Davuda i Sulejmana",
      mission: "Pozovite na tevhid, suprotstavite se faraonovom ugnjetavanju i iznesite Toru.",
      challenges: [
        "Suočavanje s faraonom, koji je tvrdio da je božanstvo",
        "Vodeći otporan i nezahvalan narod",
        "Trajno vodstvo pod stalnim pritiskom",
      ],
      miracles: [
        "Štap koji se pretvorio u zmiju",
        "Rastavljanje mora po Allahovoj naredbi",
        "Mnogi znakovi prikazani pred faraonom",
      ],
      majorEvents: [
        "Allah mu govori u svetoj dolini",
        "Sukob sa faraonom i mađioničarima",
        "Egzodus i otkrivenje Tore",
      ],
      lessons: [
        "Stanite hrabro protiv tiranije",
        "Liderstvo nad ljudima zahtijeva veliko strpljenje",
        "Sloboda se mora spojiti s pokornošću Allahu",
      ],
      facts: [
        "Jedan od pet glasnika čvrste odlučnosti (ulul-'azm)",
        "Zove se Kalimullah - onaj kome se Allah direktno obratio",
      ],
    },
    quran: [
      {
        excerpt:
          "A ja sam tebe izabrao, pa slušaj šta se otkriva. Zaista, ja sam Allah. Nema drugog božanstva osim Mene, zato Me obožavajte i uspostavite molitvu za Moj spomen.",
      },
      {
        excerpt:
          "I Mi smo nadahnuli majku Musaovu: Dojite ga, ali kada se bojite za njega, bacite ga u rijeku i ne boj se i ne tuguj. Zaista, Mi ćemo vam ga vratiti.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Anđeo smrti poslan je Musi. Kada mu je došao, Musa ga je udario, a Allah mu je vratio oko i dao mu izbor u pogledu vremena njegove smrti.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Harun (AS)",
    summary: "Elokventni Musaov brat, imenovan kao pomoćni prorok pred faraonom.",
    body: [
      "Harun (alejhi selam) je bio Musaov stariji brat i sam po sebi poslanik. Kada je Allah poslao Musaa faraonu, Musa je zatražio podršku: 'I odredi mi ministra iz moje porodice - Haruna, mog brata. Povećaj preko njega moju snagu i neka podijeli moj zadatak' (Kur'an 20:29–32). Allah je udovoljio zahtjevu, a Kur'an bilježi Njegov odgovor: 'Mi ćemo ojačati tvoju ruku preko tvoga brata' (Kur'an 28:35). Harun, opisan kao elokventniji u govoru, stajao je pored Muse dok su prenosili Allahovu poruku tiraninu.",
      "Njegov najveći iskusni trenutak došao je u Musinom odsustvu. Kada je Musa otišao da primi Toru na brdu, Bani Isra'il je pao u obožavanje zlatnog teleta. Harun ih je pokušao obuzdati, upozoravajući: 'O narode moj, samo ste time iskušeni, a vaš Gospodar je, zaista, Najmilostiviji, zato me slijedite i poslušajte moju naredbu' — ali su oni nadjačali njegovu vlast i zamalo mu naudili (Kur'an 20:90–94). Kada se Musa vratio u ljutnji, Harun je objasnio da se bojao da bi snažnije djelovanje podijelilo zajednicu na zaraćene frakcije prije nego što se Musa mogao vratiti (Kur'an 7:150).",
      "Harunova biografija ističe vrijednost timskog rada u službi Allaha – misija koju nose dvoje je jača od jednog – i delikatnu mudrost očuvanja jedinstva bez ugrožavanja istine. Ponekad vjerno vođstvo znači držati na okupu raspadnutu zajednicu i obuzdavati štetu dok se stvari ne isprave. Harun je u Kur'anu častan među vođenim, a Allah je njemu i Musau ostavio trajnu hvalu među kasnijim generacijama (Kur'an 37:119–122).",
    ],
    profile: {
      nation: "Bani Isra'il",
      location: "Egipat i Sinaj",
      era: "Musaovo doba",
      mission: "Podržite Musu u pozivanju na tevhid i vođenju djece Izraela.",
      challenges: [
        "Suočavanje sa faraonovim režimom",
        "Upravljanje zajednicom tokom Musinog odsustva",
        "Sprečavanje većeg raskola među ljudima",
      ],
      majorEvents: [
        "Imenovanje za ministra i podrška Musi",
        "Misija pred faraonom",
        "Suđenje zlatnom teletu",
      ],
      lessons: [
        "Timski rad jača poziv Allahu",
        "Liderstvo ponekad znači držati ljude zajedno u krizi",
        "Sačuvajte jedinstvo bez ugrožavanja istine",
      ],
      facts: ["Stariji brat Musa", "Hvaljen u Kur'anu zbog svoje elokvencije"],
    },
    quran: [
      {
        excerpt:
          "I odredi mi ministra iz moje porodice — Haruna, mog brata. Povećaj kroz njega moju snagu i pusti ga da podijeli moj zadatak.",
      },
      {
        excerpt:
          "Rekao je: Sine moje majke, zaista me je narod savladao i hteli su da me ubiju, pa neka se neprijatelji ne raduju nada mnom.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "davud (AS)",
    summary:
      "Prorok-kralj kome je data mudrost, pravda i Zabur, i model vodstva usmjerenog na obožavanje.",
    body: [
      "Davud (mir neka je s njim) — David — počeo je kao mladić u vojsci Taluta (Saula) protiv tiranina Jaluta (Golijata). Davud je bio taj koji je oborio Dželuta, i 'Allah mu je dao suverenitet i mudrost i poučio ga onome što je htio' (Kur'an 2:251). Allah mu je tada dao kraljevstvo, proročanstvo i otkriveni spis, Zabur (Psalmi), čineći ga rijetkim primjerom vladara koji je također bio odani obožavatelj.",
      "Allah mu je dao izuzetne darove: planine i ptice bi mu se pridružile u slavljenju Allaha, a željezo je postalo mekano u njegovim rukama kako bi mogao izraditi oklop (Kur'an 21:79; 34:10–11). Ipak, uz svu ovu moć, Dawud je ostao duboko ponizan i odan. Njegov ibadet je bio toliko intenzivan da je Poslanik, sallallahu alejhi ve sellem, opisao Davudov post – post svaki drugi dan – kao najomiljeniji post Allahu, a njegov noćni namaz kao najomiljeniji namaz. Kur'an također predstavlja epizodu presude u kojoj je Davud, blago ispravljen, odmah pao na sedždu, tražio oprost i vratio se svome Gospodaru (Kur'an 38:24) - njegova snaga ga nikada nije stavljala iznad odgovornosti.",
      "Davudov život uči da je autoritet povjerenje, a ne privilegija. Allah mu se direktno obraća: 'O Davude, Mi smo te učinili nasljednikom na Zemlji, zato sudi ljudima po istini i ne slijedi želje' (Kur'an 38:26). Pravda, stalno spominjanje Allaha, brzo pokajanje i disciplinovan ibadet su ono što održava pravedno vodstvo. Moć je najsigurnija u rukama onoga ko se najviše klanja.",
    ],
    profile: {
      nation: "Bani Isra'il",
      location: "Jerusalem region",
      era: "Prije Sulejmanove vladavine",
      mission: "Vodi po pravdi, sudi u istini i pozivaj svoj narod Allahu.",
      challenges: [
        "Težina sudske odgovornosti",
        "Balansiranje moći sa poniznošću",
        "Javna odgovornost u rukovođenju",
      ],
      miracles: [
        "Planine i ptice slave Allaha s njim",
        "Gvožđe je postalo mekano u njegovim rukama uz Allahovu dozvolu",
      ],
      majorEvents: [
        "Poraz Jaluta u mladosti",
        "Kraljevstvo, proroštvo i otkrivenje Zabura",
        "Naslijeđe je prešlo na njegovog sina Sulaymana",
      ],
      lessons: [
        "Pravda je centralna za pravednu vladavinu",
        "Brzo se pokajte nakon svake greške",
        "Disciplinovan život obožavanja jača vođstvo",
      ],
      facts: ["Primalac zabura (psalma)", "Pobijedio je Jaluta (Golijata) kao mladić"],
    },
    quran: [
      {
        excerpt:
          "O Davude, Mi smo te zaista učinili nasljednikom na Zemlji, zato sudi ljudima u istini i ne slijedi želju, jer će te ona skrenuti s Allahovog puta.",
      },
      {
        excerpt:
          "I Mi smo podvrgli planine da ih veličamo sa Davudom, a i ptice... I naučili smo ga da oblikuje oklope da vas zaštiti od neprijatelja vašeg.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Najomiljenija molitva Allahu je Davudov namaz, a najomiljeniji post Allahu je Davudov post: on bi postio jedan dan, a drugi bi prekinuo.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sulejman (AS)",
    summary:
      "Prorok-kralj koji je dobio autoritet bez premca, ali utemeljen na zahvalnosti i mudrosti.",
    body: [
      "Sulejman (alejhi selam) — Solomon — je naslijedio i kraljevstvo i poslanstvo od svog oca Davuda, a Kur'an ga hvali kao 'odličnog slugu, koji se, zaista, stalno vraća Allahu' (Kur'an 38:30). Molio je za kraljevstvo za razliku od bilo kojeg drugog koji će uslijediti, a Allah mu je dao izvanredna sredstva: komandu nad vjetrom, koji je jurio po njegovoj naredbi; služba džina koji su za njega gradili i golubili uz Allahovu dozvolu; i razumijevanje govora ptica i drugih stvorenja (Kur'an 21:81–82; 34:12–13; 27:16).",
      "Dvije scene prikazuju njegov lik. Kada je mrav upozorio svoju koloniju da se skloni da ih Sulejmanova vojska nesvjesno ne slomi, Sulejman se nasmiješio i zahvalio Allahu na naklonosti razumijevanja, moleći se da bude zahvalan i pravedan (Kur'an 27:18-19) - moć ga je učinila poniznijim, a ne manje. A kada je čuo da kraljica od Sabe (Saba') i njen narod obožavaju sunce, nije ih osvojio silom, već ih je pozvao da se pokore Allahu, na kraju pridobivši je za vjeru kroz mudrost i prikaz onoga što mu je Allah dao (Kur'an 27:22–44). Čak je i svoje ogromne blagoslove predstavio kao test: 'Ovo je od naklonosti mog Gospodara da me iskuša da li ću biti zahvalan ili nezahvalan' (Kur'an 27:40).",
      "Sulejman uči da je moć jedan od najtežih testova i da je zahvalnost (šukr) njen lijek. Vjernik koji ima bogatstvo, sposobnost ili autoritet ima za cilj da ih koristi za pravdu i da poziva druge Allahu, nikada zbog ponosa. Čitavo njegovo kraljevstvo, sa svim svojim čudima, upućuje na Onoga koji ga je dao - i to je razlika između blagoslova koji uzdiže i onog koji kvari.",
    ],
    profile: {
      nation: "Bani Isra'il i okolna kraljevstva",
      location: "Jerusalim i šira regija",
      era: "Nakon Davuda",
      mission: "Vladajte pravedno i pozivajte narode na obožavanje Allaha.",
      challenges: [
        "Upravljanje ogromnim kraljevstvom",
        "Održavanje zahvalnosti usred ogromne moći",
        "Odgovorno usmjeravanje različitih snaga",
      ],
      miracles: [
        "Zapovijedajte vjetrom uz Allahovo dopuštenje",
        "Služba džina u izgradnji i ronjenju",
        "Razumevanje govora ptica i mrava",
      ],
      majorEvents: [
        "Nasljeđivanje Davudovog kraljevstva i proročanstva",
        "Epizoda mrava i njegove zahvalnosti",
        "Prepiska sa kraljicom od Sabe i njeno vjerovanje",
      ],
      lessons: [
        "Moć je dubok test",
        "Zahvalnost štiti od arogancije",
        "Mudrost i poziv mogu preokrenuti srca bolje od sile",
      ],
      facts: ["Među najpotpunije opisanim kraljevima prorocima u Kur'anu"],
    },
    quran: [
      {
        excerpt:
          'Nasmiješio se, zabavljajući se njenim govorom, i rekao: "Gospodaru moj, omogući mi da budem zahvalan za Tvoju naklonost koju si dao meni i mojim roditeljima, i da činim pravednost koju Ti odobravaš."',
      },
      {
        excerpt:
          "A Sulejmanu [Mi smo podvrgli] vjetar - njegov jutarnji tok put od mjesec dana, a njegov popodnevni tok put od mjesec dana.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ilyas (AS)",
    summary:
      "Poslanik koji se suprotstavio obožavanju idola Ba'la i pozvao svoj narod natrag Allahu.",
    body: [
      "Ilijas (mir neka je s njim) - Ilija - je poslan u zajednicu Bani Isra'il koja je pala u idolopoklonstvo, a glavni među njihovim idolima je bio Ba'l. Kur'an bilježi njegov direktni izazov: 'Zar se nećeš bojati Allaha? Da li prizivaš Ba'la i ostavljaš li najboljeg od stvoritelja — Allaha, svog Gospodara i Gospodara tvojih prvih predaka?' (Kur'an 37:124–126). Njegov poziv je bio vječni proročki poziv: skinite lažne bogove i vratite obožavanje samo Stvoritelju.",
      "Kur'an sažima njegovu misiju sa poznatim proročkim obrascem - jasnim pozivom, odbacivanjem od strane većine i očuvanom časti za iskrene. 'Oni su ga uskratili, pa će, zaista, biti dovedeni [za kaznu], osim odabranih Allahovih robova' (Kur'an 37:127–128). Allah ga imenuje među pravednike i ostavlja mu trajni mir i hvalu: 'Mir Ilijas' (Kur'an 37:129–130), i navodi ga pored Zekerije, Jahje i Isaa među vođenim (Kur'an 6:85).",
      "Ilyasova pouka je da istinska reforma počinje ispravljanjem bogosluženja. Društvo se ne može ispraviti dok usmjerava odanost lažnim objektima - bilo bukvalnim idolima ili modernim idolima žudnje, bogatstva i statusa. Tevhid je temelj na kojem se gradi sva trajna moralna obnova, pa čak i kada je grupa vjernika mala i brojčano nadjačana, Allah poštuje one koji se drže istine.",
    ],
    profile: {
      nation: "Zajednica među Bani Isra'il",
      location: "Regija Levant",
      era: "Kasniji izraelski proročki periodi",
      mission: "Pozovi njegov narod iz obožavanja Ba'la na tevhid.",
      challenges: ["Duboko ukorijenjeno obožavanje idola", "Otpor vodstva"],
      majorEvents: ["Javni poziv protiv obožavanja Ba'la", "Odbijanje većine i očuvanje vjernika"],
      lessons: [
        "Tawheed je temelj svake reforme",
        "Mala vjerna grupa je još uvijek bitna Allahu",
        "Proroci govore protiv popularne greške, a ne protiv nje",
      ],
      facts: ["Imenovani među pravednicima", "Suočio se sa obožavanjem idola Ba'la"],
    },
    quran: [
      {
        excerpt:
          "Kada je rekao svom narodu: Zar se nećete bojati Allaha? Da li pozivate Ba'la i ostavljate najbolje kreatore?",
      },
      {
        excerpt: "I Zakarija i Jahja i Isa i Iljas - i svi su bili od pravednih.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Al-Yasa (AS)",
    summary: "Pravedni prorok izraelske loze, koji je u Kur'anu naveden među istaknutim.",
    body: [
      "Al-Yasa' (mir neka je s njim) — Elisha — je imenovan među poslanicima na dva mjesta u Kur'anu, i na oba je hvaljen. Pojavljuje se među vođenim zajedno sa Ismailom, Junusom i Lutom, koje je Allah 'dao prednost iznad svjetova' (Kur'an 6:86–87), i opet među istaknutima uz Ismaila i Zul-Kifla (Kur'an 38:48). Tekst podiže njegov rang umjesto da prepričava detaljnu priču.",
      "Budući da je objava namjerno kratka o njemu, muslimani potvrđuju upravo ono što je sigurno - da je on bio pravi prorok koji je podržavao poziv da se obožava samo Allaha među svojim narodom - i izbjegavaju da mu vezuju priče koje nemaju čvrstu podršku. Ova suzdržanost je sama po sebi dio zdravog vjerovanja: mi poštujemo proroka držeći se istine o njemu, a ne izmišljajući priče oko njega.",
      "Njegovo spominjanje je podsjetnik da je Allah poslao mnogo poslanika i da se vrijednost poslanika ne mjeri koliko dugo je njegova priča sačuvana, već po njegovoj vjernosti misiji. Kao što Kur'an negdje drugdje kaže, postojali su glasnici 'čije smo priče ispričali vama i glasnici čije priče nismo prenijeli' (Kur'an 40:78) - i vjerovanje u sve njih, poznate i nepoznate, dio je vjere muslimana.",
    ],
    profile: {
      nation: "Bani Isra'il",
      location: "Regija Levant",
      era: "Kasniji izraelski proročki periodi",
      mission: "Nastavite poziv na tevhid među njegovim ljudima.",
      lessons: [
        "Poštuj sve proroke podjednako u vjeri",
        "Kratko kur'ansko spominjanje još uvijek prenosi pravu uputu",
        "Pravedni kontinuitet čuva verske zajednice",
      ],
      facts: ["Naveden direktno u Kur'anu među istaknutim i odabranim"],
    },
    quran: [
      {
        excerpt: "I Ismail i Al-Yasa' i Junus i Lut — i sve što smo Mi preferirali nad svjetovima.",
      },
      {
        excerpt: "I zapamtite Ismaila, Al-Yasa'a i Dhul-Kifla, i svi su među istaknutim.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yunus (AS)",
    summary: "Prorok kita, čije je pokajanje u tami postalo bezvremenska lekcija nade.",
    body: [
      "Junus (alejhi selam) — Jonah — je bio poslan stanovnicima Ninive, ali kada su oni uporno odbijali njegov poziv, ostavio ih je u bijesu prije nego što mu je Allah dozvolio da ode. Kur'an opisuje ono što je uslijedilo: 'I [spomeni] čovjeka od ribe, kada je otišao u ljutnji i pomislio da mu nećemo odrediti [nikakvu nevolju]' (Kur'an 21:87). Ukrcajući se na brod, bačen je u more i progutala ga je velika riba, uronjen u slojeve tame - tamu noći, mora i ribljeg trbuha.",
      "U tom silnom mraku Yunus je povikao riječima koje su postale jedna od najomiljenijih dova u islamu: 'Nema božanstva osim Tebe; slava Tebi. Zaista, ja sam bio od onih koji su prestupili (Kur'an 21:87). Nije očajavao; on je potvrdio Allahovo savršenstvo i priznao svoju krivicu. Allah je odgovorio: 'Tako smo mu se odazvali i spasili ga od nevolje. I tako Mi spašavamo vjernike' (Kur'an 21:88). Riba ga je izbacila na obalu, a Allah je dao biljku da izraste kako bi zaklonila njegovo oslabljeno tijelo.",
      "Zatim je uslijedio izvanredan kraj: Yunus se vratio svom narodu, i za razliku od gotovo svih drugih naroda u Kur'anu, oni su vjerovali i bili pošteđeni - 'pa smo im dali uživanje na neko vrijeme' (Kur'an 37:147–148; 10:98). Njegova priča donosi dvije pouke isprepletene: nikada ne očajavajte zbog Allahove milosti, bez obzira koliko duboka tama, jer iskreno pokajanje vraća ono što je izgubljeno; a dova Junus je spas za svakog vjernika u nevolji. Poslanik, sallallahu alejhi ve sellem, je učio da nijedan musliman nikada ne moli s tim osim da mu Allah odgovori.",
    ],
    profile: {
      nation: "Narod Ninive",
      location: "Mesopotamska regija",
      era: "Proročansko razdoblje prije Isae",
      mission: "Pozovi njegov narod na tevhid i pokajanje.",
      challenges: [
        "Napor upornog odbijanja u da'vi",
        "Lično suđenje u tami mora",
        "Povratak u misiju nakon ispravljanja",
      ],
      miracles: [
        "Spasiti ribu iznutra",
        "Nad njim je rasla biljka za zaklon",
        "Vjerovanje cijelog njegovog naroda",
      ],
      majorEvents: [
        "Ostavljajući svoje ljude i pomorsku probu",
        "Molitva u trostrukoj tami",
        "Povratak i vjerovanje u Ninivu",
      ],
      lessons: [
        "Nikad ne očajavajte zbog Allahove milosti",
        "Iskreno pokajanje obnavlja misiju",
        "Dova u teškoćama je transformativna",
      ],
      facts: ["U Kur'anu se naziva i Dhun-Nun (čovjek od ribe)."],
    },
    quran: [
      {
        excerpt:
          "I povika u tamama: Nema božanstva osim Tebe; slava Tebi. Zaista, bio sam među prestupnicima.",
      },
      {
        excerpt:
          "Zar onda nije postojao grad koji je vjerovao tako da mu je njegova vjera koristila osim naroda Yunusa? Kada su povjerovali, Mi smo od njih uklonili kaznu sramote.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dova Dhun-Nuna kada je pozvao Allaha iz trbuha ribe bila je: La ilaha illa Anta, subhanaka, inni kuntu minaz-zalimin. Nijedan musliman se time ne moli ni za šta osim da mu Allah odgovori.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Zakarija (AS)",
    summary:
      "Odani prorok koji se molio za pravednog nasljednika u starosti i bio je uslišen sa Yahyom.",
    body: [
      "Zekerija (mir neka je s njim) — Zeharija — bio je pobožni prorok Bani Isra'ila i čuvar Merjem. Kad god bi ušao kod nje u njenu namazu, pronašao je hranu kod nje i pitao kako je došlo, a ona bi odgovarala: 'To je od Allaha. Zaista, Allah opskrbljuje koga hoće bez računa' (Kur'an 3:37). Svjedočenje Allahove opskrbe Merjem ponovo je probudilo njegovu nadu da bi Allah mogao dati ono što se činilo ljudskim nemogućim.",
      "Iako je ostario, a njegova žena bila nerotkinja, Zekerija se obratio Allahu u tihoj, intimnoj molitvi: 'Gospodaru moj, zaista su moje kosti oslabile i moja glava se pobijelila, i nikad nisam bio nesretan u svojoj dovi Tebi' (Kur'an 19:4). Nije tražio imetak ili ovozemaljski dobitak, već pravednog nasljednika koji će obavljati poslaničku misiju i čuvati obožavanje Allaha. Allah je odgovorio radosnom viješću o sinu, Yahya - ime, Allah je rekao, nikome prije nije dato (Kur'an 19:7). Kao znak, Zakerija se trebao suzdržati od razgovora s ljudima tri dana osim gestom, posvećujući svoj jezik Allahovom sjećanju (Kur'an 19:10-11).",
      "Zekarijjin život uči vjernika da nikada ne prestane da daje dovu, ma koliko se odgovor činio nevjerovatnim, i da posebno traži od Allaha dar pravedne porodice i kontinuitet vjere. Njegova najveća briga nije bio on on sam, već ko će nositi istinu nakon njega. Njegova priča takođe poštuje tihu službu u bogomoljama kao plemenito i voljeno djelo.",
    ],
    profile: {
      nation: "Bani Isra'il",
      location: "Jerusalem region",
      era: "Prije Isa",
      mission: "Vodi njegov narod i čuvaj proročko obožavanje.",
      challenges: [
        "Starost bez djeteta",
        "Briga za naslijeđe vjere",
        "Održavanje bogosluženja u napetom društvu",
      ],
      miracles: ["Radosna vijest o Yahyi u starosti", "Znak uskraćivanja govora tri dana"],
      majorEvents: [
        "Starateljstvo nad Maryam i svjedočenje o njenoj opskrbi",
        "Srdačna molitva za nasljednika",
        "Odgovorena dova i rođenje Yahye",
      ],
      lessons: [
        "Nikad ne gubite nadu u dovu",
        "Zamolite Allaha za pravednu porodicu i lozu",
        "Predano služenje u bogosluženju je časno",
      ],
      facts: ["Čuvar Maryam", "Otac Yahya, čije je rođenje odgovorilo na njegovu molitvu"],
    },
    quran: [
      {
        excerpt:
          "Tamo je Zakarija pozvao svog Gospodara govoreći: Gospodaru moj, daj mi od Sebe dobro potomstvo. Zaista, Ti si Onaj koji čuje molbu.",
      },
      {
        excerpt:
          'Rekao je: "Gospodaru moj, moje kosti su oslabile, a glava se napunila bijelim, i nikada nisam bio nesretan u svojoj molitvi Tebi, Gospodaru moj.',
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Yahya (AS)",
    summary: "Čist, mudar poslanik koji je od mladosti bio ispravan i počašćen mirom od Allaha.",
    body: [
      "Jahja (alejhi selam) - Džon - bio je odgovor na dovu njegovog oca Zakarije, koju je Allah nazvao prije njegovog rođenja. Allah mu se direktno obratio: 'O Jahja, uzmi Pismo odlučno.' I On mu je 'dao mudrost dok je još bio dijete' (Kur'an 19:12) - rijedak opis koji obilježava njegovu ranu duhovnu zrelost. Od mladosti je bio odan Allahu sa ozbiljnošću iznad svojih godina.",
      "Kur'an hvali njegov karakter u prekrasnom nizu: Allah mu je dao 'od Nas nježnost i čistoću, i on je bio svjestan Allaha, i poslušan prema roditeljima, i nije bio tiranin, nepokoran' (Kur'an 19:13–14). Bio je čedan i pobožan, zapamćen među pravednicima. Pozvao je svoj narod na pokornost i istinu i prethodio je Isau, potvrđujući Allahovu riječ i pripremajući srca za uputu (Kur'an 3:39).",
      "Allah je počastio Jahju mirom u tri najranjivija trenutka u životu: 'Mir neka je na njega na dan kada se rodio, na dan kada umre i na dan kada je živ odrastao' (Kur'an 19:15). Njegova biografija je poruka i mladima i starima: blizina Allahu se ne odgađa do kasnijih godina. Čistoća srca, ozbiljnost u ibadetu i ljubaznost prema roditeljima mogu cvjetati u osobi dok je još mlad — a takav život je drag Allahu.",
    ],
    profile: {
      nation: "Bani Isra'il",
      location: "Regija Levant",
      era: "Savremeno sa Zakarijem i blizu Isaovog doba",
      mission: "Pozovite na pravednost i pripremite srca za vodstvo.",
      challenges: ["Javna reforma u moralno nategnutom okruženju", "Održavanje čistoće i principa"],
      majorEvents: [
        "Njegovo rođenje kao uslišena molba",
        "U mladosti mu je data mudrost",
        "Priznanje za njegovu čistoću i odanost",
      ],
      lessons: [
        "Mladi mogu voditi u pravednosti",
        "Čistoća srca je prava snaga",
        "Ljubaznost prema roditeljima je dio pobožnosti",
      ],
      facts: [
        "Imenovan od Allaha prije njegovog rođenja",
        "Počašćen mirom pri rođenju, smrti i uskrsnuću",
      ],
    },
    quran: [
      {
        excerpt:
          "O Yahya, prihvati Sveto pismo odlučno. I Mi smo mu dali mudrost dok je još bio dijete, i nježnost od Nas i čistoću, i on je bio svjestan Allaha.",
      },
      {
        excerpt:
          "Allah vam daje dobre vijesti o Jahiji, potvrđujući Allahovu riječ - časnu, suzdržanu i poslaniku među pravednima.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Isa ibn Merjam (AS)",
    summary:
      "Moćni glasnik koji je čudesno rođen Merjam, pozivajući Allaha jasnim znakovima - sluga, a ne božanski.",
    body: [
      "Isa (alejhi selam) — Isus — je rođen od Merjeme bez oca, po Allahovoj naredbi, kao znak Njegove apsolutne moći: 'Zaista, primjer Isa sa Allahom je kao primjer Adama. On ga je stvorio od prašine, a zatim mu je rekao: Budi, i on je bio' (Kur'an 3:59). Kada je Merjem donijela novorođenče svom narodu, koji su je optužili, dijete Isa je iz kolijevke progovorilo u njenu odbranu: 'Zaista, ja sam Allahov rob. On mi je dao Sveto pismo i učinio me poslanikom' (Kur'an 19:30). Ova prva izjava postavila je ton cjelokupne njegove misije - da je Allahov sluga.",
      "Isa je poslan u Bani Isra'il da potvrdi Toru prije njega i donese Indžil (Evanđelje). Allah ga je podržao jasnim čudima po Svojoj dozvoli: liječio je slijepe i gubavce, oživljavao mrtve i od gline oblikovao pticu koja je letjela uz Allahovo dopuštenje (Kur'an 3:49). Njegova poruka je pozivala ljude na obožavanje 'Allaha, mog i tvog Gospodara' (Kur'an 3:51), te na iskrenost i pravednost. Njegovi bliski učenici, Hawariyyun, vjerovali su mu i podržavali ga.",
      "Kur'an ispravlja dvije krajnosti o Isau. Protiv onih koji su ga odbili i kovali zavjeru da ga ubiju, izjavljuje da nije ubijen niti razapet; nego se samo tako činilo, i Allah ga je uzdigao k sebi (Kur'an 4:157–158). Protiv onih koji su pretjerali, insistira se da je on plemeniti prorok i poslanik, a ne Bog ili sin Božiji - 'Mesija, sin Merjemin, nije bio samo poslanik' (Kur'an 5:75). U sunitskom vjerovanju on će se vratiti prije posljednjeg dana. Njegova priča uči da Allahova moć nadilazi sve prirodne uzroke, da su poslanici časni robovi, a nikada božanski, te da se istina mora zaštititi i od poricanja i od preuveličavanja.",
    ],
    profile: {
      nation: "Bani Isra'il",
      location: "Levant",
      era: "1. vek nove ere",
      mission: "Obnovite tevhid, potvrdite Toru i pozovite na pravednost.",
      challenges: [
        "Protivljenje i spletkarenje onih koji su ga odbili",
        "Kasnije preuveličavanje njegovog statusa",
        "Braneći čisti monoteizam",
      ],
      miracles: [
        "Rođenje bez oca",
        "Govoreći u kolevci",
        "Liječenje i davanje života uz Allahovu dozvolu",
      ],
      majorEvents: [
        "Njegovo čudesno rođenje i odbrana njegove majke",
        "Javni poziv sa jasnim znakovima",
        "Biti uzdignut Allahu, a ne ubijen",
      ],
      lessons: [
        "Allahova moć nadilazi uobičajene uzroke",
        "Poslanici su časni Allahovi robovi, nikada božanski",
        "Istina se mora čuvati i od poricanja i od preterivanja",
      ],
      facts: [
        "S obzirom na indžil (jevanđelje)",
        "Vratit će se prije posljednjeg dana u sunitskom vjerovanju",
      ],
    },
    quran: [
      {
        excerpt:
          "[Isa je rekao]: Zaista, Allah je moj i vaš Gospodar, zato Mu se klanjajte. To je pravi put.",
      },
      {
        excerpt:
          "I nisu ga ubili, niti su ga razapeli; ali im se tako činilo... Umjesto toga, Allah ga je uzdigao k Sebi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ja sam najbliži od svih ljudi Isau, sinu Merjeminu. Proroci su braća različitih majki, ali njihova vjera je jedna, i nije bilo proroka između nas.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Muhammed ﷺ",
    summary: "Posljednji glasnik, poslan kao milost svim svjetovima i pečat proroštva.",
    body: [
      "Muhammed, sallallahu alejhi ve sellem, je posljednji od poslanika, poslat ne jednom narodu već cijelom čovječanstvu, s Kur'anom kao konačnom i sačuvanom objavom. Allah opisuje svoju misiju u jednom ajetu: 'A Mi smo vas poslali samo kao milost svjetovima' (Kur'an 21:107). Rođen u Mekki, prvu objavu je primio sa četrdeset godina u pećini Hira, a naredne dvadeset i tri godine pozivao je ljude da obožavaju samo Allaha, pročiste svoja srca i žive s pravdom i milošću – dovršavajući i potvrđujući poruku svakog poslanika prije njega.",
      "Njegov put je bio jedan od trajnog žrtvovanja. U Mekki su on i prvi vjernici trpjeli sprdnju, mučenje i višegodišnji bojkot. Zatim je došla hidžra, selidba u Medinu, gdje je izgradio prvu muslimansku zajednicu - uspostavljajući namaz, bratstvo između migranata i pomagača, ugovore i društvo ukorijenjeno u tevhidu. Kroz godine teškoća i konačnog trijumfa, njegov karakter se nikada nije pokolebao; Kur'an svjedoči: 'Zaista, ti si visokog moralnog karaktera' (Kur'an 68:4), a on je sam rekao da je poslan da bude savršeno plemenitog karaktera.",
      "Allah ga proglašava 'Allahovim Poslanikom i pečatom poslanika' (Kur'an 33:40) - poslije njega nema poslanika. Njegovo najveće čudo je sam Kur'an, trajni znak koji još uvijek vodi milijarde, a počašćen je Isrom i Miradžom, noćnim putovanjem i uznesenjem. Za vjernika, on je uswah hasana — lijep primjer (Kur'an 33:21) — čiji je sunnet praktični put vjere. Ljubav prema njemu, slijeđenje njegovih uputa i slanje blagoslova na njega leži u srcu muslimanskog života.",
    ],
    profile: {
      nation: "Celo čovečanstvo",
      location: "Meka i Medina",
      era: "7. vek n.e",
      mission: "Prenesite konačno otkrivenje i dovršite proročku poruku za sve narode.",
      challenges: [
        "Progon i bojkot u Mekki",
        "Sukob i izgradnja pravedne zajednice",
        "Prenošenje univerzalne poruke među plemenima i nacijama",
      ],
      miracles: [
        "Kur'an kao trajno čudo",
        "Isra i Mi'radž (noćno putovanje i uzdizanje)",
        "Mnogo znakova datih Allahovom dozvolom",
      ],
      majorEvents: [
        "Početak objave u Mekki",
        "Hidžra u Medinu",
        "Završetak poruke i oproštajne propovijedi",
      ],
      lessons: [
        "Milost i plemenit karakter u vodstvu",
        "Postojanost pod pritiskom",
        "Slijedite objavu i sunnet zajedno",
      ],
      facts: ["Pečat proroka", "Najbolji primjer (uswah hasanah) za vjernike"],
    },
    quran: [
      {
        excerpt:
          "Muhamed nije otac nijednog od vaših ljudi, ali je Allahov Poslanik i pečat poslanika.",
      },
      {
        excerpt: "A Mi vas nismo poslali osim kao milost svjetovima.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Moj primjer i primjer proroka prije mene je primjer čovjeka koji je lijepo i potpuno izgradio kuću, osim mjesta od jedne cigle. Ja sam ta cigla, i ja sam pečat proroka.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
];

export const PROPHETS_TIMELINE_BS: DeepPartial<ProphetsTimelineEvent>[] = [
  {
    era: "Početak",
    title: "Adam — prvi prorok",
    body: "Allah je stvorio Adama, naučio ga imenima i učinio ga Svojim namjesnikom na Zemlji.",
  },
  {
    era: "Antika",
    title: "Idris, Nuh i rani narodi",
    body: "Rani poslanici su pozivali svoj narod nazad na tevhid. Nuh je propovijedao vekovima; kada je odbijanje nastavilo, došao je potop i kovčeg je spasio vjernike kao znak.",
  },
  {
    era: "Mesopotamija / Levant",
    title: "Ibrahim i njegova porodica",
    body: "Halilullah, Allahov prijatelj: razbio je idole, bio spašen od vatre, sagradio Ka'bu sa Ismailom i stvorio niz proroka preko Ismaila i Ishaka.",
  },
  {
    era: "Egipat i Sinaj",
    title: "Musa i Bani Isra'il",
    body: "Oslobođenje od faraona, Tora je otkrila, duga linija proroka do Bani Isra'ila.",
  },
  {
    era: "Egipat",
    title: "Jusufa u Egiptu",
    body: "Strpljenje kroz izdaju, zatvor i uspon do autoriteta — model povjerenja.",
  },
  {
    era: "Jerusalem",
    title: "Davud i Sulejman",
    body: "Kraljevstvo, mudrost, Zabur i kraljevstvo hvaljeno u Kur'anu.",
  },
  {
    era: "1. vek nove ere",
    title: "Isa ibn Maryam",
    body: "Rođen čudesno, govorio u kolijevci, uzdignut Allahu - a ne ubijen na krstu po Kur'anu.",
  },
  {
    era: "7. vek n.e",
    title: "Muhammed ﷺ — pečat poslanika",
    body: "Posljednji glasnik cijelom čovječanstvu; Kur'an sačuvan do posljednjeg dana.",
  },
];
