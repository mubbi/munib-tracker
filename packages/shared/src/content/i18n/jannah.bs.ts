// Bosnian translation overlay for the Learn "Journey to Jannah" content. Mirrors the order of
// its English source in ../jannah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  JannahDuaEntry,
  JannahGate,
  JannahPromisedEntry,
  JannahTopic,
  JannahVerseEntry,
} from "../../types/jannah";
import type { DeepPartial } from "./localize";

export const JANNAH_TOPICS_BS: DeepPartial<JannahTopic>[] = [
  {
    title: "Šta je Jannah?",
    summary: "Vječni vrt je Allah pripremio za pravednike.",
    body: [
      "Džennet (Džennet) je vječna kuća nagrade koju je Allah pripremio za one koji vjeruju u Njega i čine dobra djela. Riječ doslovno znači bujna, zasjenjena bašta - ali Kur'an je koristi za stvarnost daleko veću od bilo kojeg vrta na zemlji: carstvo rijeka, voća, dvora i društva u kojem vjernik živi zauvijek u zadovoljstvu svog Gospodara. To je cilj prema kojem je svaki prorok pozivao ljude i odredište oko kojeg je cijelo ovo putovanje.",
      "Život u Džennetu je drugačiji od bilo čega na ovom svijetu jer je bez svake mane koja kvari zemaljsku sreću. Nema smrti, nema bolesti, nema starenja, nema straha, nema tuge i nema umora. Njegovi ljudi se nikada ne svađaju, nikada se ne umaraju i nikada ne gube ono što vole. Sve što srce poželi biće odobreno, a Allah dodaje još više iz Svoje velikodušnosti - 'Oni će u tome imati šta god požele, a kod nas je više' (Kur'an 50:35).",
      "Užici raja su izvan ljudske mašte. U hadiskom kudsiju, Allah kaže da je pripremio za Svoje pravedne robove ono što nijedno oko nije vidjelo, nijedno uho čulo i nijedno srce nikada nije začelo. Zbog toga Kur'an opisuje Raj u poznatim slikama - baštama, rijekama i hladovini - dok nas podsjeća da je stvarnost veća od bilo kojeg opisa. Najveća nagrada od svih nisu bašče same, već Allahovo zadovoljstvo i, za najviše rangove, čast da gledaju u Njegovo plemenito Lice.",
      "Vjernik treba držati dvije istine zajedno. Prvo, Džennet je stvaran, blizu i vrijedan svakog truda - Kur'an nam govori da se 'trčimo' prema njemu (Kur'an 3:133). Drugo, niko ne zarađuje Džennet samo djelima; ulazak je na kraju Allahovom milošću, a iskrena vjera i dobra djela su sredstva koja je On odabrao prihvatiti. Ova ravnoteža održava nadu živom bez rađanja arogancije: trudimo se maksimalno, a zatim se prepuštamo Njegovoj milosti.",
      "Praktično, dopustite da stvarnost Dženeta oblikuje vaše dnevne izbore. Kada se ibadet učini teškim ili iskušenje postane jako, sjetite se šta vas čeka i šta je u pitanju. Često tražite od Allaha Džennet, dosljedno radite za njega na male održive načine i dopustite da čežnja za njim omekša vaše srce u ovom prolaznom životu.",
    ],
    quran: [
      {
        excerpt:
          "Trči se ka oprostu od Gospodara svoga i vrtu čija je širina nebesa i Zemlje, pripremljenom za pravednike.",
      },
      {
        excerpt:
          "Allah je vjernicima i vjernicima obećao bašče ispod kojih rijeke teku, u kojima oni vječno borave, i ugodne nastambe u baštama vječnog boravka - ali je Allahovo zadovoljstvo veće.",
      },
      {
        excerpt:
          "Nijedna duša ne zna šta je za njih skriveno utjehe kao nagrada za ono što su radili.",
      },
      {
        excerpt: "Oni će u njemu imati šta god požele, a sa Nama je više.",
      },
      {
        excerpt:
          "Oni koji vjeruju i čine dobra djela - za njih su bašte utočišta kao gostoprimstvo.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah je rekao: Pripremio sam Svojim pravednim robovima ono što nijedno oko nije vidjelo, uho nije čulo i nijedno srce nije začelo.",
      },
      {
        excerpt:
          "Uzvišeni Allah je rekao: Pripremio sam Svojim pravednim robovima ono što nijedno oko nije vidjelo, uho nije čulo i nijedno ljudsko srce nikada nije opazilo.",
      },
    ],
  },
  {
    title: "Redovi u raju",
    summary: "Raj ima mnogo stepeni – a ne fiksne lestvice od sedam.",
    body: [
      "Raj nije jedno ravno mjesto; ima mnogo stupnjeva, zvanih darajat, i vjernici se u njemu odgajaju prema svojoj vjeri i djelima. Vrlo česta zabluda je da Džennet ima tačno sedam nivoa. Ovo zbunjuje dvije različite stvari: Kur'an govori o sedam nebesa (samawat) — stvorenom nebu iznad nas — a ne o sedam fiksnih nivoa raja. Tekstovi nikada ne ograničavaju Džennet na sedam redova.",
      "Ono što nam govore autentični izvori je da su redovi brojni i ogromni. Poslanik, sallallahu alejhi ve sellem, je rekao da Džennet ima stotinu nivoa pripremljenih za one koji se bore na Allahovom putu, i da je udaljenost između jednog i drugog nivoa poput udaljenosti između nebesa i Zemlje. Čak i ovaj broj ukazuje na neizmjernost, a ne na krute ljestve na koje možemo da se popnemo označavajući kvadratiće.",
      "Allah uzdiže svakog vjernika prema snazi ​​njihove vjere, iskrenosti njihovih namjera i težini njihovih djela - 'Za sve će biti stepeni prema onome što su radili' (Kur'an 6:132). Tačan rang koji svaka osoba dostiže je poznat samo Allahu. Otkrivenje nam namerno ne daje mehaničku kontrolnu listu 'učinite delo X da biste dostigli nivo N', jer obožavanje treba da bude vođeno ljubavlju i iskrenošću, a ne prebrojavanjem rangova.",
      "Mudrost u tome je predivna. Kada bismo znali svoj tačan položaj, neki bi postali samozadovoljni, a drugi bi očajali. Umjesto toga, naučeni smo da zadržimo oči na Allahu, da nastavimo da se trudimo i da se nadamo. Vjernik se takmiči u dobru — 'za ovo neka se takmiče takmičari' — a konačnu ocjenu prepušta Najpravednijem.",
      "Dakle, umjesto da ciljate na brojčani nivo, ciljajte na najviši i neka vas Allah postavi gdje hoće. Poslanik, sallallahu alejhi ve sellem, je podučio ashabe da se ne zadovoljavaju skromnim zahtjevom, već da traže posebno El-Firdavs, sam vrh Dženneta.",
    ],
    quran: [
      {
        excerpt: "Za sve će postojati stepeni prema onome što su radili.",
      },
      {
        excerpt:
          "Vidite kako smo mi dali prednost nekima od njih u odnosu na druge - a Ahiret je veći po stepenu i veći po razlikama.",
      },
      {
        excerpt:
          "Ko se bude pokoravao Allahu i Poslaniku - oni će biti sa onima kojima je Allah dao naklonost: poslanicima, istinoljubima, šehidima i pravednicima. Kakvi su oni odlični saputnici!",
      },
    ],
    hadith: [
      {
        excerpt:
          "Džennet ima stotinu nivoa koje je Allah pripremio za one koji se bore na Njegovom putu. Udaljenost između svaka dva nivoa je kao udaljenost između neba i zemlje. Dakle, kada tražite od Allaha, tražite od njega El-Firdavs, jer je to najbolji i najviši dio Dženneta.",
      },
      {
        excerpt:
          "Kada tražite od Allaha, tražite od Njega El-Firdevs, jer je to najviši dio Dženneta i sredina Dženneta, a iz njega teku džennetske rijeke, a iznad njega je Arš Najmilostiviji.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Al-Firdaws — najviši",
    summary: "Vrh raja, najbliži tronu.",
    body: [
      "El-Firdaws je najviši i najizvrsniji nivo dženneta koji je naveden u autentičnom sunnetu. Poslanik, sallallahu alejhi ve sellem, ga je opisao kao najbolji u Džennetu i njegovu sredinu – samo njegovo srce – iz kojeg izviru džennetske rijeke, a iznad njega je Arš Najmilosrdnijeg. Doći do El-Firdavsa znači biti što bliže Allahu koliko god stvoreno biće može biti.",
      "Ono što ovu temu čini tako praktičnom je dio poslaničke upute: kada dajemo dovu za Džennet, ne trebamo ciljati nisko. Poslanik, sallallahu alejhi ve sellem, je podučio ashabe da kada traže od Allaha Džennet, trebaju posebno tražiti El-Firdavsa, a ne pristajati na manji zahtjev. Allahova velikodušnost je neograničena, pa je neka vrsta nedostatka tražiti od Njega samo minimum. Ovo nas uči ambiciji u ibadetu: ciljajte na vrh i neka Allah, u svojoj milosti, odluči gdje ćete vas smjestiti.",
      "Kako sluga postaje kandidat za takav čin? Sredstva su ista sredstva koja vode do samog Dženneta, za kojim se slijedi izvrsnost: iskreno vjerovanje (tevhid), pažljivo ispunjavanje obaveza koje je Allah naredio, a zatim sve veći život dobrovoljnog ibadeta povrh toga - noćni namaz, dodatni post, sjećanje, dobročinstvo i dobar karakter. U poznatom hadisu kudsiju, Allah opisuje kako se sluga dobrovoljnim djelima približava sve dok ga Allah ne zavoli.",
      "Ipak, konačni i odlučujući dar je uvijek Allahova milost. U istom dahu u kojem težimo najvišem, sjećamo se Poslanikovih, sallallahu alejhi ve sellem, vlastitih riječi: niko ne ulazi u Džennet samo svojim djelima — čak ni sam Poslanik, sallallahu alejhi ve sellem — osim što ga Allah obavija svojom milošću. Ovo je savršena ravnoteža koju vjernik postiže: velika nada i ambicija s jedne strane, iskrena poniznost s druge.",
      "Zato neka El-Firdav bude redovni dio svoje dove - na sedždi, u posljednjoj trećini noći i prije spavanja - dok tiho svaki dan dajete sve od sebe i u potpunosti se oslanjate na milost svog Gospodara za ostatak.",
    ],
    hadith: [
      {
        excerpt:
          "Kada tražite od Allaha, tražite od Njega El-Firdevs, jer je to najviši dio Dženneta i sredina Dženneta, a iz njega teku džennetske rijeke, a iznad njega je Arš Najmilostiviji.",
      },
      {
        excerpt:
          'Niko od vas neće ući u Džennet samo svojim djelima. Rekli su: "Čak ni ti, o Allahov Poslaniče?" Rekao je: Čak ni ja, osim ako me Allah ne pokrije svojom milošću.',
      },
    ],
    actions: [
      "Zamoli Allaha za El-Firdave u svojoj dovi, posebno u sudžudu i prije spavanja.",
      "Usavršite ono što vam je obavezno, a zatim povećajte dobrovoljno obožavanje.",
      "Često obnavljajte pokajanje i oslanjajte se na Allahovu milost, a ne samo na svoja djela.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Šta ugrožava Ahiret",
    summary: "Veliki grijesi zahtijevaju iskreno pokajanje; Allahov oprost je ogroman.",
    body: [
      "Ovaj odjeljak nema za cilj da vas uplaši u očaj – upravo suprotno. Allah oprašta sve grijehe onome ko Mu se iskreno okrene, i to najsnažnije objavljuje: 'Reci: O robovi Moji koji ste sami sebe prestupili, ne očajavajte u Allahovoj milosti! Zaista, Allah oprašta sve grijehe' (Kur'an 39:53). Ovdje je svrha jednostavno znati na šta tekstovi upozoravaju, kako bismo prepoznali opasnost i požurili se natrag k Njemu prije nego što bude prekasno.",
      "Postoji jedan grijeh koji se izdvaja od svih ostalih: širk – pridruživanje sudruga Allahu u ibadetu. Ovo je jedini grijeh koji Allah neće oprostiti ako osoba umre bez pokajanja, kao što On jasno kaže u Kur'anu 4:48. Sve ostalo potpada pod 'On oprašta ono što je manje od onoga kome hoće.' Zato je ispravan tevhid temelj svakog prihvaćenog djela: kuća sagrađena na napuklom temelju ne može stajati.",
      "Nakon širka, tekstovi daju posebnu težinu napuštanju namaza. Zanemarivanje pet dnevnih namaza, uporno i bez valjanog opravdanja, jedno je od najtežih upozorenja u sunnetu - Poslanik, sallallahu alejhi ve sellem, je nazvao namaz zavjetom koji razlikuje vjernika, toliko da se napuštanje približava nevjerstvu. Drugi veliki grijesi — nepravedno ubijanje, nezakoniti odnosi, trošenje kamata (riba), proždiranje bogatstva siročadi i teško ugnjetavanje — su ozbiljne stvari koje zahtijevaju iskreno pokajanje i mogu donijeti kaznu ako Allah ne oprosti.",
      "Takozvani 'manji' grijesi su takođe važni i nikada ih ne treba shvatati olako. Ogovaranje, laganje, arogancija, kidanje porodičnih veza i nemarnost polako nagrizaju srce i karakter. Poslanik, sallallahu alejhi ve sellem, je upozorio da mali grijesi nagomilani mogu uništiti osobu kao što mali štapići skupljeni mogu skuhati cijeli obrok. Svakom od njih je potrebno vlastito okretanje Allahu.",
      "Zaključak je nada na djelu: nikada ne dozvolite da vas veličina grijeha uvjeri da je pokajanje besmisleno. Vratite se Allahu čim se okliznete, slijedite loše djelo sa dobrim da ga izbrišete, i držite vrata istigfara otvorena svaki dan. Njegova milost je uvijek veća od vaše greške.",
    ],
    quran: [
      {
        excerpt:
          "Zaista, Allah ne oprašta druženje s Njim, ali oprašta ono što je manje od onoga kome hoće.",
      },
      {
        excerpt:
          "Reci: O robovi moji koji ste sami sebe prestupili, ne očajavajte u Allahovoj milosti. Zaista, Allah oprašta sve grijehe.",
      },
    ],
    hadith: [
      {
        excerpt: "Savez između nas i njih je molitva; ko ga napusti počinio je nevjerovanje.",
      },
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Liste velikih grijeha u fikhu razlikuju se od učenjaka, a odluke o pojedincima pripadaju kvalifikovanim ljudima. Ovo je opći podsjetnik na pokajanje - ne lična presuda. Posavjetujte se s pouzdanim učenjakom za vašu situaciju.",
  },
  {
    title: "Oni počašćeni u tekstovima",
    summary:
      "Ljudi i grupe koje je Poslanik, sallallahu alejhi ve sellem, nazvao u vezi s džennetom.",
    body: [
      "Kur'an i Sunnet izdvajaju određene pojedince, kategorije vjernika i djela vezana za radosnu vijest o Džennetu. Važno je da ih ispravno pročitate: to su iskreni izvještaji o tim konkretnim ljudima ili opisi — oni nisu prenosiva garancija za svakoga ko samo čuje njihova imena ili im se divi. Radosna vijest počivala je na njihovoj vjeri i njihovim djelima, a ista vrata su nam otvorena na isti način.",
      "Najpoznatija grupa je Deset obećanih dženneta (al-Asharah al-Mubashsharah), koje je Poslanik, sallallahu alejhi ve sellem, imenovao u jednoj predaji: Ebu Bekr, Omer, Osman, Ali, Talha, Zubayr, Abd al-Rahman ibn Avf, Sa'd ibn Abi Waidqas i Zajdah Abi ibn al-Jarrah (neka je Allah zadovoljan sa svima njima). Ovo su bili najbliži i najpožrtvovniji od Poslanikovih ashaba, a ehli-sunnet ih sve voli i poštuje, a da nijednog od njih nije pretjerao ili omalovažio.",
      "Osim navedenih pojedinaca, tekstovi opisuju kategorije kojima su date radosne vijesti: istinoljubivi i strpljivi, oni koji umiru kao pravi šehidi na Allahovom putu prema islamskom zakonu, i oni čije su posljednje riječi u ovom životu svjedočanstvo vjere, la ilahe illallah. Svaki opis ukazuje na unutrašnju stvarnost – iskrenost, žrtvu ili srce vezano za Allaha u posljednjem dahu – a ne samo na vanjsku etiketu.",
      "Pouka za nas nije da se osjećamo sigurno u društvu, niti da sebi prisvojimo ove činove, već da budemo inspirirani. Neka nas njihov primjer povuče gore: volite ono što su voljeli, trudite se kao što su se trudili i pretvorite to divljenje u dovu i djelovanje, tražeći od Allaha prije svega husn al-khatimah — dobar završetak.",
    ],
    hadith: [
      {
        excerpt:
          "Ebu Bekr je u raju, Omer je u raju, Osman je u raju, Ali je u raju, Talha je u raju, Zubejr je u raju, Abd al-Rahman ibn Avf je u raju, Sad je u raju, Se'id ibn Zeyd je u raju, a Abd al-Rahman ibn Avf je u raju, a Abd al-Rahman ibn Awf je u raju, Se'id ibn Zejd je u raju, a Abd al-Rahman ibn Awf je u raju Raj.",
      },
      {
        excerpt: "Ko god posljednja riječ bude 'Nema boga osim Allaha' ući će u Džennet.",
      },
    ],
    disclaimer:
      "Radosne vijesti u hadisu odnose se na one imenovane ili na opisane kategorije. Oni ne zamjenjuju potrebu za vlastitom vjerom, djelima i dobrim krajem. Allah najbolje zna.",
  },
  {
    title: "Tawheed — ispravno vjerovanje",
    summary: "Nijedno djelo nije prihvaćeno bez iskrenog monoteizma.",
    body: [
      "Tevhid znači izdvajanje samo Allaha za obožavanje – vjerovanje da je samo On Gospodar i Stvoritelj, da samo On zaslužuje da bude obožavan i da je jedinstven po Svojim imenima i svojstvima. To je upravo poruka sa kojom je poslat svaki poslanik i prva stvar po kojoj čovjek ulazi u Islam. Budući da se tiče Onoga koga obožavamo, to je temelj na kojem stoji cjelokupna građevina religije.",
      "Njegovu važnost je nemoguće precijeniti: Allah ne prihvata nikakvo djelo od osobe koja mu pridružuje drugove. 'Ako Allahu pridružujete druge, vaša djela će sigurno propasti' (Kur'an 39:65). Planina dobrih djela izgrađena na širku ne teži ništa na Sudnjem danu, dok najmanje djelo izgrađeno na čistom tevhidu može biti neizmjerno teško. Zbog toga je čuvanje nečijeg vjerovanja još hitnije nego umnožavanje vlastitih postupaka.",
      "Tawheed također zahtijeva iskrenost, koja se zove ikhlas - da obožavamo Allaha 'budući iskreni prema Njemu u vjeri' (Kur'an 98:5). Suptilna opasnost ovdje je rija, vršenje ibadeta da bi ga ljudi vidjeli i hvalili. Poslanik, sallallahu alejhi ve sellem, je upozorio da čak i skriveno razmetanje može tiho pokvariti djelo. Lijek je u stalnom obnavljanju namjere: za koga to zapravo radim? Iskrenost je ono što običan čin pretvara u dragoceni čin odanosti.",
      "Mudrost da tevhid postane temelj je u tome što oslobađa srce. Osoba koja obožava samo Allaha je oslobođena straha od stvaranja, jurnjave za svačijim odobravanjem i iscrpljenosti služenja mnogim gospodarima. Njegov život dobija jedan, jasan pravac: ugoditi Onome koji ga je stvorio.",
      "Praktično, naučite ispravno vjerovanje od pouzdanih učenjaka, očistite svoje obožavanje od širka i licemjerja i provjerite svoju namjeru prije nego što počnete. Ovaj prvi korak nije neobavezan niti napredan – tu počinje svaki put u raj.",
    ],
    quran: [
      {
        excerpt:
          "Tebi i onima prije tebe je objavljeno: Ako Allahu pridružujete druge, vaša djela će sigurno propasti, i sigurno ćete biti među gubitnicima.",
      },
      {
        excerpt:
          "Nije im bilo naređeno osim da obožavaju Allaha, da budu iskreni prema Njemu u vjeri.",
      },
    ],
    hadith: [
      {
        excerpt: "Radnje su samo namjere, i svaka osoba će imati samo ono što je namjeravala.",
      },
    ],
    actions: [
      "Naučite osnove tevhida od pouzdanih učenjaka.",
      "Obnovite svoju namjeru prije ibadeta.",
      "Tražite oprost za skriveno razmetanje (rija).",
    ],
  },
  {
    title: "Pogrešno — stub",
    summary: "Očuvanje pet dnevnih namaza spada među najveća djela.",
    body: [
      "Namaz - pet dnevnih namaza - je drugi stub islama i centralni čin svakodnevnog ibadeta. Poslanik, sallallahu alejhi ve sellem, opisao je namaz kao stub vjere: onaj ko je uspostavi uspostavlja vjeru, a ko je zanemari, srušio je mnogo od onoga što je drži. To je pet dnevnih sastanaka vjernika sa svojim Gospodarom, stajanja, klanjanja i sedžde u direktnoj vezi sa Allahom.",
      "Njegov rang je bez premca među praktičnim djelima zbog onoga što je Poslanik, sallallahu alejhi ve sellem, rekao o Sudnjem danu: prva stvar za koju će sluga biti priveden na odgovornost je namaz. Ako je zdravo, i ostala djela će biti zdrava; ako je manjkav, ostatak je u opasnosti. I u ovom životu namaz je sredstvo za pročišćavanje — Poslanik, sallallahu alejhi ve sellem, uporedio je pet namaza sa rijekom koja teče na nečijim vratima: ko se u njoj okupa pet puta dnevno, ostaje bez prljavštine, i tako namaz spira male grijehe.",
      "Ali molitva treba da bude više od fizičkih pokreta. Kur'an hvali 'one koji su ponizni u svojoj molitvi' (Kur'an 23:1-2) i časti 'one koji su postojani u svojoj molitvi' (Kur'an 70:22-23). Dvije kvalitete su najvažnije: khušu – sadašnje, ponizno srce koje zna da stoji pred Allahom – i dosljednost, čuvanje svake molitve u pravo vrijeme. Molitva u džematu, za one u mogućnosti, višestruko umnožava nagradu.",
      "Dublja mudrost namaza je transformacija. Molitva, obavljena ispravno, sputava osobu od nepristojnosti i nepravde; to je opetovano resetovanje koje vuče srce natrag Allahu tokom napornog dana. Izostanak namaza bez valjanog opravdanja je stoga teška stvar koja zahtijeva iskreno pokajanje i nadoknađivanje (qada). Nafl i ravatib - redovni sunnet-namaz prije i poslije obaveznih - dodaju dodatno svjetlo i podižu nečiji rang.",
      "Praktično: zaštitite pet dnevnih namaza u njihovo vrijeme kao svoj apsolutni prioritet, nadoknadite sve što ste propustili i dodajte sunnet namaze koje možete održati. Ako se vaš namaz poboljša, sve ostalo u vašem ibadetu će se poboljšati s njim.",
    ],
    quran: [
      {
        excerpt: "Zaista su uspješni vjernici - oni koji su ponizni u svojoj molitvi.",
      },
      {
        excerpt: "Osim onih koji se mole — onih koji su postojani u svojoj molitvi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Prva stvar za koju će sluga biti priveden na odgovornost na Kijametskom danu je njegova molitva. Ako je dobro, on je uspio; ako je neispravan, on je propao i izgubio.",
      },
      {
        excerpt:
          "Da je na vratima jednog od vas bila rijeka u kojoj se kupao pet puta dnevno, da li bi na njemu ostala prljavština? Oni su rekli: Ne. On je rekao: To je sličnost sa pet namaza - njima Allah briše grijehe.",
      },
    ],
    actions: [
      "Čuvajte pet dnevnih namaza u njihovo vrijeme.",
      "Iskreno nadoknadite propuštene namaze (qaza).",
      "Dodajte sunnet namaz prije i poslije farza gdje možete.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Iskreno pokajanje",
    summary: "Allah voli one koji Mu se stalno vraćaju.",
    body: [
      "Tawbah je vraćanje Allahu nakon grijeha. Iskreno pokajanje (tawbah nasuh) ima jasne stubove: iskreno žaljenje u srcu za ono što je učinjeno, momentalno zaustavljanje grijeha i čvrstu odluku da mu se više nikada ne vrati – i ako je grijeh uključivao nanošenje nepravde drugoj osobi, vraćanje njenog prava ili traženje oprosta. To nije jedan događaj, već doživotni povratak, vrata koja Allah drži otvorena za svakog vjernika.",
      "Njegova važnost je da nijedno ljudsko biće nije oslobođeno grijeha, tako da pokajanje nije za nekoliko grešnika, već za sve. Poslanik, sallallahu alejhi ve sellem, je rekao da svako Ademovo dijete griješi, a najbolji od onih koji griješe su oni koji se kaju. Allah prihvata pokajanje sluge sve do trenutka kada duša dođe do grla u smrti, a čak i sunce koje izlazi sa zapada je krajnji rok za svijet - do tada poziv stoji.",
      "Začuđujuće, Allah ne samo toleriše slugu koji se vraća – On se raduje. Poslanik, sallallahu alejhi ve sellem, opisao je Allaha kao da je više oduševljen pokajanjem Svoga roba nego čovjek koji, izgubljen u pustinji, očajava život nakon što njegova kamila odluta sa svom hranom i vodom, a onda je iznenada ponovo pronađe. Ta slika silne radosti govori nam koliko je sluga koji se kaje volio svome Gospodaru.",
      "Mudrost je duboka: grijeh ne mora biti kraj nečije priče. 'Allah će njihova zla djela zamijeniti dobrim' (Kur'an 25:70) — iskreno pokajanje može pretvoriti zapis o neuspjehu u uspjeh, i može pretvoriti pad u novi početak koji osobu približava Allahu više nego prije. Očaj nakon grijeha je sam po sebi šejtanova zamka; nada u Allahovu milost je odgovor vjernika.",
      "Praktično: ne odgađajte pokajanje ni za jedan dan – vratite se u trenutku kada ste okliznuli. Prati svako loše djelo dobrim djelom da ga izbrišeš, i nastavi da ti istigfar teče na jeziku tokom cijelog dana, baš kao što je Poslanik, sallallahu alejhi ve sellem, tražio oprost mnogo puta dnevno uprkos tome što mu je oprošteno.",
    ],
    quran: [
      {
        excerpt:
          "O vjernici, obratite se Allahu iskrenim pokajanjem - možda će vaš Gospodar od vas ukloniti vaša nedjela i uvesti vas u bašče ispod kojih rijeke teku.",
      },
      {
        excerpt:
          "Osim onih koji se kaju, vjeruju i čine dobra djela - za njih će Allah njihova zla djela zamijeniti dobrim, a Allah prašta i samilostan je.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah je više zadovoljan pokajanjem Svoga roba nego onaj od vas koji, izgubivši svoju kamilu u neplodnoj zemlji, iznenada je ponovo nađe.",
      },
    ],
    actions: [
      "Pokajte se odmah kada sagriješite – nemojte odlagati.",
      "Slijedite grijeh dobrim djelom da ga izbrišete.",
      "Izgovarajte istighfar tokom dana.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kur'an",
    summary: "Učite, pamtite i živite po Allahovoj Knjizi.",
    body: [
      "Kur'an je doslovan Allahov govor, objavljen kao uputa, milost i lijek za srca. Izgradnja odnosa s njim – recitovanje, razmišljanje o njegovom značenju, djelovanje po njegovim naredbama i podučavanje drugima – jedan je od najvećih i najnagrađivanijih čina obožavanja kojem vjernik može posvetiti cijeli život. To je Allahovo uže pruženo do nas; ko se toga čvrsto drži, vodi se na pravi put.",
      "Nagrade vezane za to su izvanredne. Poslanik, sallallahu alejhi ve sellem, je učio da Allah onima koji čitaju Njegovu Knjigu i uspostavljaju namaz daje veliku nagradu koja nikada ne nestaje (Kur'an 35:29–30), i da za svako slovo koje se prouči dolazi deseterostruka nagrada. Čak i onaj ko se muči i spotiče oko riječi, sve dok se trudi, ima dvostruku nagradu – jednu za recitaciju i drugu za trud.",
      "Kur'an također podiže nečiji rang u sljedećem životu na direktan i živopisan način. Poslanik, sallallahu alejhi ve sellem, je rekao da će ashabu Kur'ana na Kijametskom danu biti rečeno: 'Uči i uzdiži se, i uči kao što si učio na svijetu, jer će tvoj rang biti na posljednjem ajetu koji proučiš.' Drugim riječima, nečije stanje u Raju raste u korak sa nečijim dijelom Knjige — upečatljivo ohrabrenje da se nastavi sa pamćenjem i ponavljanjem.",
      "Dublja svrha, međutim, nije recitacija radi nje same, već transformacija. Allah nam naređuje da 'učimo Kur'an sa odmjerenim učenjem' (Kur'an 73:4) upravo tako da značenja potonu i preoblikuju način na koji mislimo, osjećamo se i ponašamo. Kur'an je poslan da se živi, ​​a ne samo da se uči; ashabi bi naučili deset stihova i ne bi krenuli dalje dok ih ne razumiju i postupe po njima.",
      "Praktično: pročitajte dio svakog dana, čak i samo nekoliko stihova, ali ih čitajte s razmišljanjem. Naučite napamet nove sure ili održavajte ono što već znate, i — što je najvažnije — postupajte prema onome što naučite prije nego što požurite naprijed da naučite više.",
    ],
    quran: [
      {
        excerpt:
          "Oni koji čitaju Allahovu Knjigu, obavljaju namaz i troše od onoga što Mi dajemo - oni se nadaju zanatu koji nikada neće propasti, da bi im On dao njihovu nagradu u potpunosti i uvećao ih iz Svoje blagodati.",
      },
      {
        excerpt: "I učite Kur'an odmjerenim učenjem.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Reći će se ashabu Kur'ana: Uči i uzdiži se, i uči kao što si učio na svijetu, jer će tvoj rang biti na posljednjem ajetu koji učiš.",
      },
    ],
    actions: [
      "Čitajte svakodnevno — čak i nekoliko stihova sa razmišljanjem.",
      "Naučite napamet nove sure ili održavajte ono što znate.",
      "Djelujte na osnovu onoga što naučite prije nego što tražite više.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Dhikr — sjećanje",
    summary: "Lagana na jeziku, teška na vagi.",
    body: [
      "Dhikr znači spominjanje Allaha – održavanje Njega prisutnog u srcu i na jeziku kroz riječi veličanja (SubhanAllah), hvale (Alhamdulillah), veličanja (Allahu Akbar), potvrde Njegove jednote (La ilaha illallah) i traženja oprosta (istighfar). Od svih puteva u Džennet, zikr je među najlakšima za izvođenje, a ipak među najvećom nagradom, jer se može učiniti bilo gdje, u bilo kojem stanju, u svakom trenutku.",
      "Sam Allah to velikodušno zapovijeda — 'O vjernici, spominjite Allaha s velikim sjećanjem' (Kur'an 33:41-42) - i obećava jedinstveni plod za to: smirenost srca. 'Uistinu, u spominjanju Allaha srca nalaze mir' (Kur'an 13:28). U nemirnom, tjeskobnom svijetu, ovo je jedan od zikrovih najvećih darova. Poslanik, sallallahu alejhi ve sellem, je također odmjerio svoju nagradu, rekavši da su dvije riječi lake na jeziku, a teške na Vagi, i voljene Najmilosrdnijem, SubhanAllahi wa bihamdihi, SubhanAllahil-Azeem.",
      "Posebna kategorija je jutarnji i večernji adhkar — vjerodostojne dove koje je Poslanik, sallallahu alejhi ve sellem, učio za dvije granice dana. Oni djeluju kao duhovna tvrđava, čuvajući vjernika od zla i privlačeći Allahovu zaštitu i zadovoljstvo. Samo nekoliko minuta na početku i na kraju svakog dana, izgovoreno prisustvom, tiho preoblikujte srce tokom vremena.",
      "Mudrost zikra je da održava odnos sa Allahom živim između formalnih ibadeta. Jezik koji je vlažan od sjećanja i, što je još važnije, srce koje se prisjeća Allaha u svojim svakodnevnim izborima - zastajkivanje prije ljutnje, prije kupovine, prije odluke - pravi je cilj. Dhikr nije namijenjen da ostane na usnama; ima za cilj da upravlja životom.",
      "Praktično: učinite jutarnji i večernji adhkar svakodnevnu naviku, održavajte jednostavnu porciju tesbiha, istigfara ili salavata da teče tokom praznih trenutaka i sjetite se Allaha posebno prije spavanja i nakon buđenja. Konzistentnost u malom je bolja od naleta punog.",
    ],
    quran: [
      {
        excerpt:
          "Oni koji vjeruju i čija se srca smiruju u spominjanju Allaha - zaista, u spominjanju Allaha srca nalaze mir.",
      },
      {
        excerpt:
          "O vjernici, spominjajte se Allaha s velikim sjećanjem i slavite Ga ujutro i navečer.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dvije riječi su lake na jeziku, teške na Vagi i voljene Najmilosrdnijem: SubhanAllahi wa bihamdihi, SubhanAllahil-Azeem.",
      },
    ],
    actions: [
      "Završite jutarnji i večernji adhkar dnevno.",
      "Koristite tesbeeh brojač za istigfar ili salavat.",
      "Sjetite se Allaha prije spavanja i nakon buđenja.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dobročinstvo i zekat",
    summary: "Trošite od onoga što vam je Allah dao - tajno i otvoreno.",
    body: [
      "Islam naređuje vjerniku da daje od imetka koji mu je Allah povjerio, i obavezno i ​​dobrovoljno. Zekat je obavezna godišnja naknada za kvalificirano bogatstvo — jedan od pet stubova islama — i plaća se, a ne opciono, za one koji ispunjavaju njegove uslove. Iza toga stoji sadaka: dobrovoljno davanje bilo kojeg iznosa, u bilo koje vrijeme, za Allaha.",
      "Nagrade trošenja na Allahovom putu su umnožene izvan uobičajene aritmetike. Allah upoređuje onoga ko troši na svom putu sa jednim zrnom u kojem raste sedam klasova, a svako klasje nosi stotinu zrna — 'a Allah množi kome hoće' (Kur'an 2:261). Daleko od smanjenja bogatstva, dobročinstvo ga pročišćava i povećava u baraki, dok gasi grijehe kao što voda gasi vatru.",
      "Dva oblika dobročinstva zaslužuju poseban spomen. Prva je skrivena dobročinstva, koja se daje tako diskretno da, kako je Poslanik, sallallahu alejhi ve sellem, opisao, lijeva ruka ne zna šta je desna dala - ova iskrenost je posebno voljena Allahu i osjenjuje osobu na Sudnjem danu. Drugi je sadaqah jariyah, stalna dobročinstva čija se korist nastavlja i nakon smrti. Poslanik, sallallahu alejhi ve sellem, je rekao da kada osoba umre, njena djela prestaju osim triju: stalna dobročinstva, znanje koje koristi drugima i pravedno dijete koje moli za njega.",
      "Mudrost dobročinstva je da ono djeluje na davaoca koliko i na primaoca. To oslobađa stisak pohlepe u srcu, gradi saosećanje, jača veze zajednice i podseća bogate da su oni poverenici, a ne pravi vlasnici. A Islam proširuje definiciju dobročinstva tako da niko nije isključen: Poslanik, sallallahu alejhi ve sellem, je učio da su osmijeh tvom bratu, korisna riječ, pa čak i uklanjanje štetnog predmeta sa puta, svi oblici sadake.",
      "Praktično: ako ste odgovorni za zekat, tačno ga izračunajte i platite; dajte neke redovne sadake, koliko god male, tako da davanje postane navika, a ne događaj; i tražite trajnu sadaku jariju – sponzorisanje učenika, finansiranje bunara ili podršku mesdžidu – koji će vas nagrađivati ​​dugo nakon što odete.",
    ],
    quran: [
      {
        excerpt:
          "Primjer onih koji svoj imetak troše na Allahovom putu je kao zrno koje ima sedam klasova, u svakom klasju sto zrna. A Allah množi kome hoće.",
      },
      {
        excerpt:
          'Potrošite od onoga što smo vam dali prije nego što smrt dođe jednom od vas, a on kaže: "Gospodaru moj, kad bi me barem malo odgodio da bih mogao davati milostinju i biti među pravednicima."',
      },
    ],
    hadith: [
      {
        excerpt:
          "Kada osoba umre, njena djela se završavaju osim za tri: stalna dobročinstva, blagotvorno znanje ili pravedno dijete koje se moli za njega.",
      },
    ],
    actions: [
      "Izračunajte i platite zekat ako ste odgovorni.",
      "Dajte redovne milostinje, čak i male.",
      "Potražite prilike za dobrotvorne radnje.",
    ],
    appLinks: [{}],
  },
  {
    title: "Dobar karakter",
    summary: "Najteža stvar na skali mogu biti odlični maniri.",
    body: [
      "Dobar karakter (husn al-khuluq) je skup plemenitih osobina koje vjernik pokazuje u ophođenju sa Allahovim stvorenjem: istinitost, strpljivost, poniznost, milost, velikodušnost, blagost i držanje obećanja. Daleko od toga da bude puka društvena finoća, Islam tretira karakter kao ključnu mjeru vjere i jedno od najtežih djela koje osoba može ponijeti na Sudnjem danu.",
      "Njegov rang je naveden najjasnijim riječima. Poslanik, sallallahu alejhi ve sellem, je rekao da se ništa ne stavlja na vagu teže od dobrog karaktera, i da su vjernici najpotpunije u vjeri oni koji imaju najbolji karakter. Čak je sažeo svoju misiju rekavši da je poslan da bude savršen plemeniti karakter. To znači da način na koji se ponašate prema svojim roditeljima, supružniku, djeci, susjedima, pa čak i strancima nije odvojen od vašeg obožavanja – on je njegov središnji dio.",
      "Lijep karakter je moćan zbog onoga što je Poslanik, sallallahu alejhi ve sellem, obećao da može postići: svojim dobrim manirima vjernik može dostići rang onoga koji posti cijeli dan i klanja cijelu noć. Drugim riječima, odličan karakter može podići običnog čovjeka na nivo najodanijih obožavatelja, jer je težak, postojan i ispituje ego na svakom koraku – obuzdavanje ljutnje, praštanje uvrede i odabir blagosti kada bi grubost bila lakša.",
      "Mudrost je da Islam nije samo privatni odnos između osobe i Allaha; ima za cilj da se pretoči u to kako se neko ophodi prema svima oko sebe. Obožavalac čija molitva ne omekšava njegovo ophođenje je promašio poentu, dok je dobar karakter sam po sebi dawah, privlačeći ljude ka vjeri kroz živi primjer. To je razlog zašto tekstovi uvijek iznova spajaju obožavanje Allaha s izvrsnošću prema Njegovom stvorenju.",
      "Praktično: radite na jednoj po jednoj osobini – ne slušajte jezik kada ste isprovocirani, oprostite onima koji su vam pogriješili, popravite vezu koju ste dopustili da se prekine i držite svoja obećanja čak i kada vas koštaju. Kratko dnevno razmišljanje nakon namaza o tome kako ste se tog dana odnosili prema ljudima je jednostavan način za stabilan rast.",
    ],
    quran: [
      {
        excerpt: "I zaista, vi ste velikog i plemenitog karaktera.",
      },
      {
        excerpt:
          "Oni koji troše u lakoći i nevolji, koji obuzdavaju svoj gnjev i opraštaju ljude - a Allah voli one koji čine dobro.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ništa nije teže na vagi vjernika na Sudnjem danu od dobrog karaktera. Zaista, Allah ne voli nepristojne i grube osobe.",
      },
      {
        excerpt:
          "Najpotpuniji vjernici u vjeri su oni sa najboljim karakterom, a najbolji od vas su oni koji su najbolji prema svojim ženama.",
      },
    ],
    actions: [
      "Vježbajte strpljenje kada ste isprovocirani.",
      "Oprostite drugima i popravite narušene veze.",
      "Razmišljajte o svom karakteru nakon namaza u dnevnom dnevniku.",
    ],
    appLinks: [{}],
  },
  {
    title: "Traženje znanja",
    summary: "Allah olakšava put u Džennet onome ko traži znanje.",
    body: [
      "Traženje korisnog znanja – učenje onome što su Allah i Njegov Poslanik, sallallahu alejhi ve sellem, naučavali, zatim postupati prema tome i prenositi ga dalje – je oblik ibadeta i, u suštini, obaveza svakog muslimana. Ovo je sveto znanje koje razjašnjava vjerovanje, pročišćava obožavanje i razlikuje ispravno od pogrešnog; nije znanje za pokazivanje, već svjetlo koje vodi akciju.",
      "Poslanik, sallallahu alejhi ve sellem, je ovu potragu direktno povezao sa ciljem cijelog ovog putovanja: 'Ko krene putem u potrazi za znanjem, Allah će mu olakšati put u Džennet.' 'Put' je i doslovan i figurativan - Allah olakšava tragaocu put u ovom životu i olakšava njegov put do Dženneta u sljedećem. Takođe je učio da anđeli spuštaju svoja krila u znak odobravanja za tragača za znanjem i da sve na nebu i na zemlji, čak i ribe u moru, traže oprost za onoga koji uči dobru.",
      "Znanje je također jedno od rijetkih djela koje nagrađuje osobu nakon smrti. Poslanik, sallallahu alejhi ve sellem, je imenovao korisno znanje među tri stvari čija se nagrada nastavlja u kaburu, uz stalnu dobročinstvo i pravedno dijete. Dakle, podučavanje jedne korisne stvari – pomaganje nekome da nauči pravilno klanjati, dijeljenje autentičnog hadisa ili usmjeravanje osobe ka istini – može postati tok nagrade koji teče godinama, čak i generacijama.",
      "Mudrost je da je djelovanje bez znanja slijepo, a znanje bez djelovanja besplodno. Ispravno znanje štiti osobu od inovacija i zabluda, produbljuje iskrenost i daje joj sposobnost da koristi drugima, a ne samo sebi. Islamski učenjaci su uvijek upozoravali na dvije opasnosti: djelovanje u neznanju i znanje bez djelovanja.",
      "Praktično: posvetite se redovnom učenju nečeg korisnog - ajet, hadis, odredba koja vam je potrebna za vaš svakodnevni ibadet. Počnite s osnovnim elementima vjerovanja, molitve, pročišćenja i glavnih zabrana, a zatim se postepeno produbljujte. Ponizno podijelite ono što naučite i uvijek to prvo primijenite na sebe.",
    ],
    quran: [
      {
        excerpt:
          "Reci: Jesu li oni koji znaju jednaki onima koji ne znaju? Samo oni sa razumevanjem obraćaju pažnju.",
      },
      {
        excerpt: "I reci: Gospodaru moj, povećaj me znanjem.",
      },
    ],
    hadith: [
      {
        excerpt: "Ko krene putem u potrazi za znanjem, Allah će mu olakšati put u Džennet.",
      },
      {
        excerpt:
          "Kada osoba umre, njena djela se završavaju osim za tri: stalna dobročinstva, blagotvorno znanje ili pravedno dijete koje se moli za njega.",
      },
    ],
    actions: [
      "Svake sedmice naučite nešto korisno.",
      "Dijelite znanje bez arogancije.",
      "Primijenite ono što ste naučili prije nego što prikupite više.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Dobrovoljno bogosluženje",
    summary: "Približite se Allahu kroz nafl mimo obaveznog.",
    body: [
      "Dobrovoljni ibadet (nafl) se odnosi na dodatne radnje predanosti koje vjernik nudi mimo onoga što je Allah učinio obaveznim - dodatne molitve, dodatni postovi, dodatna dobročinstva i sjećanje. Obaveze su na prvom mjestu i o njima se ne može pregovarati, ali nakon što se ispune, nafl je mjesto gdje sluga izražava ljubav, bliskost i čežnju koja prelazi minimum koji je potreban.",
      "Uz to je vezano zapanjujuće obećanje. U hadisi kudsiju Allah kaže: 'Moj rob Mi se ne približava ni sa čim što mi je draže od onoga što sam ga obavezao. I nastavlja mi se približavati dobrovoljnim djelima sve dok ga ne zavolim' — i jednom kada Allah zavoli slugu, njegove molbe su uslišane i njegovi poslovi se popravljaju. Dobrovoljno obožavanje je stoga ljestvica blizine, koja se penje od puke poslušnosti prema božanskoj ljubavi.",
      "Sunnet je bogat njegovim dostupnim oblicima: noćni namaz (tahadžud) u posljednjem dijelu noći, jutarnji namaz (duha), redovni sunnet-namaz prije i poslije obaveznih, te dobrovoljni post poput ponedjeljka i četvrtka ili bijelih dana svakog mjeseca. Ibadet Nafl također tiho popravlja naše nedostatke - Poslanik, sallallahu alejhi ve sellem, je učio da će svaki nedostatak u obaveznim namazama biti upotpunjen nečijim dobrovoljnim namazom na Sudnjem danu.",
      "Mudrost je da nafl održava vjeru živom i da raste. Obaveze održavaju osnovnu liniju, ali dobrovoljna djela su tamo gdje se srce rasteže, gdje privatno obožavanje koje niko ne vidi gradi iskrenost i gdje se osoba obučava za teže životne testove. Također je milost što su ovi postupci fakultativni – Allah otvara mnoga vrata kako bi svako mogao proći kroz ona koja mu odgovaraju.",
      "Praktično, ključ je održivost, a ne intenzitet. Poslanik, sallallahu alejhi ve sellem, je učio da su najdraža djela Allahu najdosljednija, čak i mala. Odaberite nekoliko dobrovoljnih radnji koje možete zaista održati - dva rekata tahadžuda, jedan post sedmično, fiksni dio Kur'ana - umjesto ambicioznog rafala koji izgara za nekoliko dana.",
    ],
    quran: [
      {
        excerpt:
          "Strane njihove napuštaju svoje postelje dok zazivaju Gospodara svoga u strahu i nadi, i troše od onoga što smo im dali. Nijedna duša ne zna koja je utjeha za njih skrivena kao nagrada za ono što su radili.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Moj sluga mi se ne približava ni sa čim što mi je draže od onoga što sam ga obavezao. I Moj sluga nastavlja da mi se približava kroz dobrovoljna djela sve dok ga ne zavolim.",
      },
    ],
    actions: [
      "Klanjajte tehadžud čak i ako samo dva rekata.",
      "Brze dobrovoljne dane kada je u mogućnosti.",
      "Dodajte dosljedne sunnet-namaze prije/poslije farza.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Strpljenje i zahvalnost",
    summary: "Allah voli strpljive i zahvalne.",
    body: [
      "Strpljenje (sabr) i zahvalnost (shukr) su dva krila kojima vjernik leti kroz život. Strpljenje je postojanost na tri područja: ostati čvrst u pokornosti Allahu, uzdržavati se od neposlušnosti i podnositi životne kušnje bez prigovora na Njegovu odredbu. Zahvalnost je prepoznavanje svake blagodati koja dolazi od Allaha i odgovaranje zahvalnošću u srcu, na jeziku i kroz pokorno djelovanje. Zajedno pokrivaju odgovor vjernika i na teškoće i na lakoću.",
      "Njihova važnost je da definišu kako se vjernik susreće sa svime što mu se dešava. Poslanik, sallallahu alejhi ve sellem, se čudio da je cijela stvar vjernika dobra: kada dobro dođe do njega, on je zahvalan i dobro je za njega, a kada ga zadesi teškoća, on je strpljiv i to je također dobro za njega – blagoslov nikome osim vjerniku. Dakle, šta god da dođe, vjernik ima put do nagrade.",
      "Nagrada za strpljenje je jedinstveno neograničena. Dok se većina djela nagrađuje množenjem, Allah kaže: 'Strpljivima će biti dana nagrada bez mjere' (Kur'an 39:10). A zahvalnost nosi svoje vlastito obećanje povećanja: 'Ako ste zahvalni, ja ću vas sigurno povećati' (Kur'an 14:7). Zahvalnost, dakle, nije samo pravi odgovor na blagoslove – to je upravo ono što uzrokuje njihov rast.",
      "Ova mudrost u potpunosti preoblikuje patnju. Suđenja nisu automatski kazne; za vjernika koji dobro reaguje, oni mogu biti pročišćenje koje briše grijehe i uzdizanje koje podiže rang. Poslanik, sallallahu alejhi ve sellem, je učio da muslimana ne zadesi umor, bolest, briga, pa čak ni ubod trna, a da Allah time ne izbriše neke od njegovih grijeha. Ovo pretvara najteže trenutke života u prilike, a ne u čisti gubitak.",
      "Praktično: kada nesreća zadesi, odgovorite riječima koje je Allah učio - 'Inna lillahi wa inna ilayhi raji'un' (Zaista mi pripadamo Allahu, i Njemu se vraćamo) - i držite jezik za zubima od prigovora koji odbacuje Njegovu odredbu. U dobrim vremenima, brojite svoje blagodati naglas i zahvaljujte Allahu na barem nekoliko njih svaki dan; davanje imena održava srce mekim i zahvalnim.",
    ],
    quran: [
      {
        excerpt:
          "Objavite radosne vijesti bolesnicima - onima koji, kada se dogodi nesreća, kažu: Mi smo zaista Allahovi, i zaista ćemo se Njemu vratiti. Na njima su blagoslovi od njihovog Gospodara i milost, i oni su ti koji su na pravi put.",
      },
      {
        excerpt:
          "Ako ste zahvalni, sigurno ću vas povećati; ali ako poričete, zaista je Moja kazna teška.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Čudesna je stvar vjernika, jer su svi njegovi poslovi dobri. Ako dođe olakšanje, on je zahvalan, i to je dobro za njega; a ako dođe do teškoća, on je strpljiv, i to je dobro za njega. Ovo nije ni za koga osim za vjernika.",
      },
    ],
    actions: [
      "Recite 'inna lillahi wa inna ilayhi raji'un' kada se testirate.",
      "Zahvalite Allahu naglas za tri blagoslova dnevno.",
      "Nemojte se žaliti na način koji odbacuje Allahovu odredbu.",
    ],
  },
  {
    title: "Pozivanje Allaha",
    summary: "Ko vodi drugoga, dobija nagradu kao i onaj koji ga slijedi.",
    body: [
      "Da'wah znači pozivanje drugih ka Allahu – dijeljenje poruke islama, učenje osobe da se moli, ohrabrivanje na dobro, nježno obeshrabrivanje pogrešnog ili pomaganje muslimanu koji se bori da se vrati poslušnosti. To je bila misija svakog proroka i zajednička je odgovornost zajednice, svakog prema svojim sposobnostima i znanju. Nije rezervisano za naučnike; svako ko prenese makar jednu korisnu stvar poziva Allaha.",
      "Njegova nagrada je jedna od najvelikodušnijih u cijelom islamu. Poslanik, sallallahu alejhi ve sellem, je rekao da onaj ko nekoga uputi na dobrotu ima nagradu kao i onaj ko postupa po njoj - a u drugoj predaji, onaj ko poziva na uputu dobija nagradu od svih koji je slijede, a da njihova nagrada nije ni najmanje umanjena. To znači da dobro koje pokrenete može nastaviti umnožavati vašu nagradu kroz svaku osobu koju dotakne, dugo nakon što nastavite dalje.",
      "Ali da'wah ima adab - način - koji se mora poštovati da bi uspio. Allah naređuje: 'Pozovi na put Gospodara svoga mudro i dobrom poukom, i raspravljaj se s njima na najbolji način' (Kur'an 16:125). Mudrost znači reći pravu stvar, pravoj osobi, na pravi način i u vrijeme; grubost, arogancija i bodovanje tjeraju ljude i izdaju svrhu. Posao pozivaoca je da prenese i posadi, a ne da prisiljava srca, koja pripadaju samo Allahu.",
      "Mudrost povezivanja tako ogromne nagrade za vođenje drugih je u tome što svakog vjernika čini izvorom stalnog dobra. Također štiti vlastitu vjeru pozivaoca: pozivati ​​druge na molitvu, poštenje i obožavanje znači biti podsjećen da se i sam čvrsto držiš njih. I povezuje zajednicu u međusobnoj brizi, a ne u međusobnom zanemarivanju.",
      "Praktično, počnite blizu kuće. Poboljšajte i poučite svoju porodicu – supružnika, dijete, brata ili sestru – jer su oni vaša prva i najtrajnija odgovornost. Podijelite korisno znanje s ljubaznošću, pomozite nekome da nauči klanjati ili čitati Kur'an i zapamtite da je život dobrog karaktera i postojanog ibadeta često najuvjerljivija da'va od svih.",
    ],
    quran: [
      {
        excerpt:
          "Pozovi na put Gospodara svoga mudro i dobrom poukom, i raspravljaj se s njima na najbolji način.",
      },
      {
        excerpt:
          "A ko je bolji u govoru od onoga koji poziva Allahu, čini dobro i govori: Ja sam, zaista, od muslimana.",
      },
    ],
    hadith: [
      {
        excerpt: "Ko nekoga uputi na dobrotu, imaće nagradu kao i onaj ko to čini.",
      },
    ],
    actions: [
      "Podijelite korisno znanje sa ljubaznošću.",
      "Pomozite nekome da nauči moliti ili čitati Kur'an.",
      "Budite primjer dobrog karaktera u javnosti.",
    ],
  },
  {
    title: "Glavna doživotna djela",
    summary: "Hadž, porodica i trajno dobročinstvo.",
    body: [
      "Pored dnevnih i sedmičnih ibadeta, Islam upućuje vjernika na pregršt velikih, doživotnih djela - velikih ulaganja čija je nagrada ogromna i, u nekim slučajevima, beskrajna. Ovo su projekti vrijedni planiranja života: hodočašće, podizanje pravedne porodice i izgradnja trajnih dobrih djela.",
      "Najznačajniji među njima je hadž, peti stub islama, obavezan jednom u životu za svakog muslimana koji je fizički i finansijski sposoban - 'Hadž u kući je dužnost koju Allahu duguju ljudi koji mogu pronaći put' (Kur'an 3:97). Njegova nagrada je potpuno čišćenje: Poslanik, sallallahu alejhi ve sellem, je rekao da onaj ko obavi hadž radi Allaha i izbjegne nepristojnost i grijeh se vraća bez grijeha, čist kao onog dana kada ga je majka rodila. Prihvaćen hadž, rekao je, nema manje nagrade od Dženneta. Umra, manje hodočašće, također nosi veliku nagradu i briše grijehe između jedne i druge Umre.",
      "Druga velika investicija je sadaqah jariyah — stalna dobrotvorna organizacija koja nastavlja nagrađivati ​​osobu nakon smrti. Poslanik, sallallahu alejhi ve sellem, ga je naveo među tri stvari koje i dalje koriste osobi u kaburu, zajedno sa korisnim znanjem i ispravnim djetetom koje moli za njega. Odgajanje djece na vjeri i dobrom karakteru je možda najveći od njih, ali isto tako je i izgradnja ili održavanje mesdžida, kopanje bunara, sponzoriranje siročeta, sadnja drveta ili finansiranje obrazovanja - svaki tok nagrade koji nadživi onoga koji daje.",
      "Mudrost ovih djela je u tome što ona proširuju nečiji račun izvan njegovog životnog vijeka. Aktivne godine vjernika su kratke, ali bunar koji je iskopao ili dijete koje je dobro odgojio mogu mu vekovima zarađivati ​​nagradu. Islam na taj način potiče dugoročnu viziju: da razmišljate ne samo o današnjoj molitvi, već i o tome šta će dobro tekti od vas nakon što odete.",
      "Praktično: ako ste u mogućnosti, ozbiljno planirajte hadž ili umru umjesto da ih beskonačno odgađate. Uložite pravi trud u vjeru i karakter vaše porodice, jer su oni vaše najtrajnije naslijeđe. I identificirajte barem jedan trajni dobrotvorni projekat za podršku — znanje, vodu, sklonište ili siroče — tako da se vaša dobra djela nastave i nakon smrti.",
    ],
    quran: [
      {
        excerpt:
          "A hadž do kuće je obaveza koju Allahu duguju oni ljudi koji su u stanju da nađu put do toga.",
      },
      {
        excerpt:
          "I objavite ljudima hadž; oni će doći k vama pješice i na svakoj mršavoj devi sa svakog udaljenog prolaza, da mogu sami svjedočiti koristi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ko obavi hadž radi Allaha i ne počini nepristojnost ili prijestup, vraća se bez grijeha, kao dan kada ga je majka rodila.",
      },
      {
        excerpt:
          "Kada osoba umre, njena djela se završavaju osim za tri: stalna dobročinstva, blagotvorno znanje ili pravedno dijete koje se moli za njega.",
      },
    ],
    actions: [
      "Planirajte hadž ili umru ako ste u mogućnosti.",
      "Investirajte u vjeru i karakter vaše porodice.",
      "Podržite trajni dobrotvorni projekat.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Allahova milost — posljednja riječ",
    summary: "Djela su sredstva; ulazak je Njegovom milošću.",
    body: [
      "Nakon svih djela, svih nastojanja i svih puteva, vjernik dolazi do ponizne istine koja je posljednja riječ na ovom putu: niko ne ulazi u Džennet samo zbog svojih djela. Poslanik, sallallahu alejhi ve sellem, je to rekao o sebi — Allahu najomiljenijem od svih stvorenja — rekavši da ni on neće ući u Džennet svojim djelima, osim što ga Allah obavija svojom milošću. Ako je njemu tako, sigurno je tako i nama.",
      "Ovo nikada ne smije biti pogrešno shvaćeno kao dozvola za zanemarivanje bogoslužja. Djela ostaju sredstva koja je Allah izabrao i naredio; Svoju milost je povezao s vjerom i pravednim djelovanjem, a napuštanje njih nije poniznost već nemarnost. Ispravno značenje je proporcionalno: naša djela, ma koliko brojna, nikada ne bi mogla vratiti čak ni djelić Allahovih blagoslova nad nama, niti kupiti vječnost Dženneta. Dakle, nudimo svoja djela kao znak ljubavi i poslušnosti, a zatim se u potpunosti oslanjamo na Njegovu milost da ih prihvati i da nas primi.",
      "Obim te milosti je zapanjujući. Poslanik, sallallahu alejhi ve sellem, je rekao da je Allah podijelio milost na sto dijelova; On je poslao samo jedan dio cijelom stvorenju - i to je jedan dio da je majka nježna prema svom djetetu, a životinje su nježne prema svojim mladuncima - dok je preostalih devedeset i devet dijelova zadržao kod sebe da ih daruje Svojim slugama na Dan uskrsnuća. Kakvo god milosrđe smo ikada bili svjedoci na ovom svijetu, samo je dio od stotinu.",
      "Zato uravnoteženi vjernik živi između nade i straha, kao ptica koja leti sa dva krila. Plaši se Allahove pravde dovoljno da nikada ne postane samozadovoljan ili bezobziran prema grijehu, i dovoljno se nada Allahovoj milosti da nikada ne očajava, bez obzira koliko daleko je zalutao. Potpuno naginjanje prema strahu rađa beznađe; potpuno naginjanje ka nadi rađa aroganciju. Allahova imena - Ar-Rahman (Najmilosrdniji), Ar-Raheem (Najmilosrdniji), Al-Ghafor (Najviše prašta) - učvršćuju krilo nade.",
      "Zato neka ovo bude duh u kojem zatvarate svaki dan: zamolite Allaha za El-Firdavsa, dajte sve od sebe, pokajte se za svoje nedostatke, a zatim svoj posljednji čin prepustite Najpravednijem i Najmilosrdnijem – vjerujući da Onaj koji je zadržao devedeset i devet dijelova milosti za taj Dan neće odbiti slugu koji Mu je došao u nastojanju i nadi.",
    ],
    quran: [
      {
        excerpt:
          "I moja milost obuhvata sve stvari. Pa ću to odrediti onima koji su pravedni i daju zekat, i onima koji vjeruju u ajete Naše.",
      },
      {
        excerpt:
          "Reci: O robovi moji koji ste sami sebe prestupili, ne očajavajte u Allahovoj milosti. Zaista, Allah oprašta sve grijehe.",
      },
    ],
    hadith: [
      {
        excerpt:
          'Niko od vas neće ući u Džennet samo svojim djelima. Rekli su: "Čak ni ti, o Allahov Poslaniče?" Rekao je: „Čak ni mene, osim ako me Allah ne obgrli svojom milošću.',
      },
      {
        excerpt:
          "Allah ima sto dijelova milosti. On je poslao jedan dio među džine, čovječanstvo, životinje i insekte, po čemu su samilosni jedni prema drugima; i zadržao je kod Sebe devedeset devet dijelova, kojima će na Sudnjem danu pokazati milost robovima Svojim.",
      },
    ],
    actions: [
      "Uravnotežite strah od Allaha sa nadom u Njegovu milost.",
      "Nikada ne očajavajte nakon grijeha – pokajte se i nastavite s nastojanjem.",
      "Zamolite Allaha za El-Firdavs i dobar završetak (husn al-khatima).",
    ],
    appLinks: [{}, {}],
  },
];

export const JANNAH_GATES_BS: DeepPartial<JannahGate>[] = [
  {
    name: "Kapija molitve",
    deedSummary: "Za one koji su čuvali i uspostavili pet dnevnih namaza.",
    hadith: [
      {
        excerpt:
          "Ko potroši par stvari na Allahovom putu, biće pozvan sa vrata Dženneta. Ko god je bio među moliteljima, biće pozvan sa Kapije molitve.",
      },
    ],
  },
  {
    name: "Gate of Charity",
    deedSummary: "Za one koji su milostinju davali iskreno za Allaha radi.",
    hadith: [
      {
        excerpt: "Ko god je bio među ljudima milosrđa, biće pozvan sa Vrata milosrđa.",
      },
    ],
  },
  {
    name: "Kapija Ar-Rayyana",
    deedSummary: "Rezervisano za one koji poste - kapiju samo oni ulaze.",
    hadith: [
      {
        excerpt:
          "U Džennetu postoji kapija koja se zove Ar-Rayyan, kroz koju će na Kijametskom danu ući samo oni koji su postili. Kada zadnji od njih uđe, biće zatvoren.",
      },
    ],
  },
  {
    name: "Kapija džihada",
    deedSummary: "Za one koji su se iskreno borili na Allahovom putu.",
    hadith: [
      {
        excerpt: "Ko god je bio među ljudima džihada biće pozvan sa Vrata džihada.",
      },
    ],
  },
  {
    name: "Nagrada za hadž",
    deedSummary: "Za one koji su hadž obavili čisto, vraćajući se bez grijeha.",
    hadith: [
      {
        excerpt:
          "Ko obavi hadž radi Allaha i ne počini nepristojnost ili prijestup, vraća se bez grijeha, kao dan kada ga je majka rodila.",
      },
    ],
  },
  {
    name: "Zvao se sa svake kapije",
    deedSummary: "Neki će, poput Ebu Bekra, biti pozvani da uđu sa svih vrata.",
    hadith: [
      {
        excerpt:
          "Ebu Bekr je upitao: Hoće li neko biti pozvan sa svih ovih kapija? Rekao je: Da, i nadam se da ćeš biti jedan od njih.",
      },
    ],
  },
];

export const JANNAH_VERSES_BS: DeepPartial<JannahVerseEntry>[] = [
  {
    excerpt:
      "Trči se ka oprostu od Gospodara svoga i vrtu širokom kao nebesa i zemlja, pripremljenom za pravednike.",
  },
  {
    excerpt:
      "Bašte ispod kojih teku rijeke i ugodne nastambe u baštama vječnog boravka - ali je Allahovo zadovoljstvo veće.",
  },
  {
    excerpt: "Vrtovi utočišta kao gostoprimstvo za one koji vjeruju i čine dobra djela.",
  },
  {
    excerpt:
      "Nijedna duša ne zna koja je utjeha za njih skrivena kao nagrada za ono što su radili.",
  },
  {
    excerpt: "Oni će u njemu imati šta god požele, a sa Nama je više.",
  },
  {
    excerpt: "Za sve će postojati stepeni prema onome što su radili.",
  },
  {
    excerpt: "Oni su stepeni kod Allaha, a Allah vidi šta rade.",
  },
  {
    excerpt:
      "Gospodaru naš, daj nam dobro na ovom svijetu i dobro na onom svijetu i zaštiti nas od kazne vatre.",
  },
  {
    excerpt: "Ne očajavajte u Allahovoj milosti – Allah, zaista, oprašta sve grijehe.",
  },
  {
    excerpt: "Moje sluge - ovog Dana neće biti straha za vas, niti ćete tugovati.",
  },
  {
    excerpt: "A preteče, preteče - to su oni koji su privedeni.",
  },
  {
    excerpt: "Tako će ih Allah zaštititi od zla toga Dana i dati im sjaj i sreću.",
  },
];

export const JANNAH_DUAS_BS: DeepPartial<JannahDuaEntry>[] = [
  {
    context: "Sveobuhvatna dova za dobro na oba svijeta i zaštitu od Vatre.",
  },
  {
    context: "Sažeta dova nakon tešahhuda: tražite Džennet i utočište od Vatre.",
  },
  {
    context: "Zatražite Džennet koristeći Allahova lijepa imena nakon tešehhuda.",
  },
  {
    context: "Tražite slast viđenja Allaha i žudnje za susretom s Njim.",
  },
];

export const JANNAH_PROMISED_BS: DeepPartial<JannahPromisedEntry>[] = [
  {
    name: "Deset obećanih raja",
    summary:
      "Ebu Bekr, Omer, Osman, Ali, Talha, Zubayr, Abd al-Rahman ibn Awf, Sa'd, Se'id ibn Zeyd i Ebu Ubaydah (neka je Allah zadovoljan njima).",
    note: "Navedeni zajedno u hadisu u Sunan al-Tirmizi (3747, sahih).",
  },
  {
    name: "Istinoljubivi i strpljivi",
    summary: "Allah hvali one koji su istinoljubivi u vjeri i strpljivi u poslušnosti i kušnjama.",
    note: "Vidi Kur'an 4:69 i mnoge stihove o as-sadiqeen i as-sabireen.",
  },
  {
    name: "Šehidi na Allahovom putu",
    summary: "Oni koji umru braneći Islam prema islamskom zakonu dobijaju radosnu vijest o raju.",
    note: "Učenjaci precizno definiraju šehadet; ne kvalifikuje se svaka smrt u bitci automatski.",
  },
  {
    name: "Oni čije su posljednje riječi tevhid",
    summary: "Ko god posljednja riječ bude 'La ilahe illallah' ući će u Džennet.",
    note: "Sunan Ebu Davud 3116 (sahih). Dobar završetak je doživotna potraga.",
  },
  {
    name: "Proroci",
    summary: "Svaki poslanik je u najvišim rangovima Dženneta po Allahovoj odredbi.",
    note: "Njihov položaj se ne dostiže običnim djelima – oni su izabrani i zaštićeni.",
  },
];
