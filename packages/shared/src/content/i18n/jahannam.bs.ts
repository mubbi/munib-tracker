// Bosnian translation overlay for the Learn "Jahannam" content. Mirrors the order of
// its English source in ../jahannam*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  JahannamDuaEntry,
  JahannamGateEntry,
  JahannamHadithEntry,
  JahannamNameEntry,
  JahannamReferenceEntry,
  JahannamReflectionEntry,
  JahannamTopic,
  JahannamVerseEntry,
} from "../../types/jahannam";
import type { DeepPartial } from "./localize";

export const JAHANNAM_CORE_TOPICS_BS: DeepPartial<JahannamTopic>[] = [
  {
    title: "Uvod",
    summary: "Allah nas obavještava o Džehannemu za uputu - a ne očajanje.",
    body: [
      "Džehannam — koji se često prevodi kao Džehennem ili Vatra — je prebivalište za kaznu na Ahiretu koju Allah opisuje u Kur'anu i preko Svoga Poslanika, sallallahu alejhi ve sellem. On nam govori o tome da srce ne skrši strahom, već da se srca probude, vrate i izaberu put milosrđa dok su vrata još otvorena.",
      "Pomaže razumjeti zašto milostivi Gospodar uopće govori o Vatri. Upozorenje je samo po sebi milost: osobi kojoj je rečeno o litici ispred sebe u mraku je dat dar, a ne prijetnja. Svaki ajet o Džehannamu je Allah, u Svojoj dobroti, pozivajući svoje robove prije nego što je prošlo vrijeme za povratak.",
      "Zbog toga su upozorenja uparena kroz objavu sa pozivima na pokajanje, oprost i nadu u Allahovu ogromnu milost. Kur'an rijetko spominje Vatru, a da u blizini ne spominje baštu, otvorena vrata tevbe i Allahovu ljubav prema onima koji se vraćaju. Cilj je odgovornost koja vodi do pravednosti - nikada ne očajavajte.",
      "Vjerovanje u Džehannam dio je vjerovanja u nevidljivo (al-ghayb), u božansku pravdu i u stvarnost posljednjeg dana. To daje težinu našim izborima i balansira nadu u Džennet sa ozbiljnošću u pogledu grijeha, tako da vjernik hoda između nade i straha - nadajući se Allahovoj milosti, budno pazi na svoje nedostatke.",
      "Točka utjehe koja je centralna za sunitsko vjerovanje prolazi kroz cijeli ovaj modul: oni koji umru vjerujući samo u Allaha, čak i ako su opterećeni grijehom, neće zauvijek ostati u Vatri. Allahovom milošću i posredovanjem koje On dozvoljava, grešni vjernici su na kraju izbačeni; ostaju samo oni koji umiru odbacujući vjeru. Dakle, proučavanje Džehannama je, za vjernika, na kraju učenje o tome kako doći do milosti.",
      "Ovaj modul predstavlja ono što tekstovi jasno navode, iskreno bilježi gdje su se učenjaci razlikovali, citira samo autentične dokaze i dosljedno vas usmjerava ka tevbi, dobrim djelima i povjerenju u Allaha.",
    ],
    quran: [
      {
        excerpt:
          "Bojte se Vatre pripremljene za nevjernike - i pokoravajte se Allahu i Poslaniku da biste bili milosrdni.",
      },
      {
        excerpt:
          "Reci: O robovi moji koji ste sami sebe prestupili, ne očajavajte u Allahovoj milosti. Zaista, Allah oprašta sve grijehe.",
      },
      {
        excerpt:
          "O vjernici, pokajte se Allahu iskrenim pokajanjem – možda će vaš Gospodar otkloniti od vas vaša nedjela i uvesti vas u bašče.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Zašto je Allah stvorio pakao",
    summary: "Božanska pravda, odgovornost i posledice slobodnog izbora.",
    body: [
      "Džehannam postoji kao manifestacija Allahove savršene pravde ('adl). Univerzum u kojem su tlačitelji i potlačeni, iskreni i podmukli, svi sreli isti kraj, ne bi bio pravedan. Budući da je Allah savršeno Pravedan, mora postojati konačni obračun gdje se odgovara na svaku nepravdu i poštuje svako dobro.",
      "Centralno za ovo je da Allah nikome ne čini nepravdu. Svaka duša koja uđe u Vatru ulazi u nju svojim vlastitim utvrđenim, nepokajanim izborima - nikada proizvoljnom odlukom. Kur'an je izričit: 'Allah uopće ne čini nepravdu ljudima, nego ljudi sami sebi nepravdu' (4:40). Niko nije kažnjen za ono što nije uradio, niti preko zasluženog.",
      "Ljudska bića nisu ostavljena u mraku. Allah im je dao razum, poslao glasnike i objavio jasnu uputu, a zatim ih počastio pravom slobodom da je prihvate ili odbace: 'Ko hoće – neka vjeruje; a ko hoće - neka ne vjeruje' (18:29). Ustrajanje u odbacivanju istine, u ugnjetavanju ili u velikom grijehu bez pokajanja nosi posljedice na ahiretu upravo zato što je izbor zaista bio vaš.",
      "Pa ipak, čak i ovdje milost uokviruje pravdu. Allah upozorava prije nego što sudi, odgađa obračun da bi se dao prostor za povratak, spremno oprašta kada se od njega zatraži, i nagrađuje jedno dobro djelo više puta dok bilježi jedan grijeh kao jedan. Njegova pravda nikada nije odvojena od Njegove milosti.",
      "Razmišljanje o tome zašto Jahannam postoji trebalo bi stoga povećati taqwa (svijest o Bogu) i produbiti zahvalnost za svaki dan života koji je još uvijek prilika za pokajanje. Namijenjen je da srce odjednom učini ozbiljnim i punim nade - da ga nikada ne parališe očajem.",
    ],
    quran: [
      {
        excerpt: "Zaista, Allah uopće ne čini nepravdu ljudima, već ljudi sami sebi nepravdu.",
      },
      {
        excerpt: "On nije upitan o tome šta On radi, ali oni će biti ispitani.",
      },
      {
        excerpt:
          "Ko hoće - neka vjeruje; a ko hoće - neka ne vjeruje. Za prestupnike smo pripremili Vatru.",
      },
    ],
    hadith: [
      {
        excerpt:
          'Niko od vas neće ući u Džennet samo svojim djelima. Rekli su: "Čak ni ti, o Allahov Poslaniče?" Rekao je: Čak ni ja, osim ako me Allah ne pokrije svojom milošću.',
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Realnost Ahireta",
    summary: "Od smrti do presude — svaka faza je stvarna i povezana sa akidom.",
    body: [
      "Da bismo ispravno razumjeli Jahannam, pomaže da vidimo gdje se nalazi na širem putovanju. Islam uči o jasnom slijedu nakon smrti: duša napušta tijelo, zatim počinje barzak (interval života u kaburu), zatim uskrsnuće kada se tijela podižu, okupljanje svih stvorenja, sud na kojem se ispituju djela, vaganje djela na vagi (al-Mizan), prelazak preko mosta u Paradisu i konačno prelazak mosta u Paradise (Svaki put). ili Vatra - sve po Allahovoj odredbi, pravdi i milosti.",
      "Svaka od ovih faza je potvrđena u glavnoj sunitskoj akidi na osnovu Kur'ana i autentičnog sunneta. Ova vremenska linija nije simbol ili priča; to je stvarnost u koju treba vjerovati kao dio vjerovanja u posljednji dan, a svjesno poricanje je stvar vjerovanja, a ne samo prakse.",
      "Videti ceo put takođe preoblikuje Vatru. To je jedna moguća destinacija na kraju putovanja kojim svaka duša već putuje — što znači da današnji izbori nisu apstraktni. Oni su stepenice na tom putu, a još uvijek su naši da ih usmjeravamo.",
      "Poznavanje ovog slijeda pomaže vjerniku da se pripremi, a ne da se boji: da živi sa zdravim sjećanjem na smrt (zhikr al-mawt), da popravi nepravde prije nego što se prenesu na Skup, i da popuni izvještaj o dobrim djelima dok su vrata djelovanja još uvijek otvorena. Smrt zatvara ta vrata; posle toga se ništa ne može dodati.",
    ],
    quran: [
      {
        excerpt:
          "Onda zaista, nakon toga treba da umrete. Tada ćete zaista biti uskrsnuti na Sudnjem danu.",
      },
      {
        excerpt:
          "Što se tiče onoga čija je vaga teška - on će biti u ugodnom životu. Što se tiče onoga čija je vaga lagana - njegovo utočište će biti ponor.",
      },
    ],
    actions: [
      "Proučite svaku fazu u Learn Aqeedah i povežite vjerovanje sa svakodnevnim izborima.",
      "Povećajte sjećanje na smrt (dhikr al-mawt) ne zanemarujući nadu u milost.",
    ],
    appLinks: [{}, {}, {}, {}, {}, {}],
  },
  {
    title: "Imena pakla",
    summary:
      "Kur'anska imena sa značenjima — učenjaci se razlikuju oko toga da li je svako zaseban nivo.",
    body: [
      "Kur'an spominje pakao s nekoliko imena, a ovo nije samo ponavljanje. Na arapskom, ime često nosi živopisan opis u sebi, tako da svako ime uči nešto o stvarnosti na koju ukazuje. Među njima su Jahannam, Jaheem, Saqar, Sa'ir, al-Hutamah, al-Hawiyah i Lazaa.",
      "Svako ime otvara prozor za drugačiji aspekt ozbiljnosti. Jaheem i Sa'ir izazivaju žestoko plamteću, zapaljenu vatru; Saqar, ono što gori i ne ostavlja ništa; al-Hutamah, drobilica koja lomi sve što se u nju baci; al-Hawiyah, duboki ponor u koji se pada; i Lazaa, čisti plamen koji ogoljava. Zajedničko čitanje imena gradi trezvenu sliku koju srce ne može lako zanemariti.",
      "Klasični učenjaci tefsira - kao što su Ibn Kathir i al-Tabari - objašnjavaju ova imena iz njihovih arapskih korijena i raspravljaju o svakom u kontekstu ajeta gdje se pojavljuje, umjesto da ih tretiraju kao fiksnu tehničku listu.",
      "Ovdje je vrijedna riječi opreza. Neki kasniji pisci predstavljaju svako ime kao poseban, rangirani 'nivo' pakla, ponekad sa detaljnim dijagramima. To je naučno tumačenje, a ne eksplicitna kontrolna lista navedena u Kur'anu ili u dogovorenom hadisu. Uravnotežen pristup je da se nauči značenja koja tekstovi zapravo daju i da se izbjegne predstavljanje spekulativnih mapa kao izvjesnosti.",
      "Svrha učenja imena nije zadovoljiti radoznalost, već omekšati srce i pokrenuti ga prema milosrđu na koju ovaj modul stalno ukazuje. Pregledajte kompletnu kolekciju imena za svako kur'ansko pojavljivanje, kontekst i sažetak tafsira.",
    ],
    quran: [
      {
        excerpt: "Dosta je pakao kao počivalište — Jahannam.",
      },
      {
        excerpt: "On će biti bačen u al-Hutamu - užasnu vatru.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Nivoi pakla",
    summary:
      "Različiti stepeni kazne — tačna struktura nije u potpunosti detaljno objašnjena u tekstovima.",
    body: [
      "Princip koji Kur'an jasno navodi je da je kazna proporcionalna: ne doživljavaju je svi u Vatri u istoj mjeri. 'Za sve će postojati stepeni prema onome što su radili' (6:132). Ovo je samo po sebi izraz pravde – onaj koji je malo zgrešio ne tretira se kao onaj koji je učinio mnogo.",
      "Autentični sunnet ilustruje isti princip. Poslanik, sallallahu alejhi ve sellem, opisao je najmanje kažnjenu osobu u Vatri kao osobu pod čijim nogama se stavljaju dvije žeravice, od kojih mu ključa mozak — a ipak je najlakši u mukama od svih njenih ljudi (Sahih al-Buhari 6562). Ako je to najmanje, um shvata koliko ozbiljni moraju biti veći stepeni i koliko ima razloga da se danas vratimo nazad.",
      "U isto vrijeme, otkrivenje vjernicima ne daje potpunu, numerisanu kartu strukture pakla koju su dužni zapamtiti. Naučnici su raspravljali o nivoima, dubinama i kategorijama izvučenim iz različitih stihova i izvještaja, ali mnogo toga ostaje tumačenje, a ne dogovoreni, eksplicitni tekst.",
      "Dvije su stvari, međutim, sigurne. Prvo, ugnjetavanje (dhulm), širk i uporni veliki grijeh bez pokajanja nose ozbiljno upozorenje. Drugo — i to nikada ne treba zaboraviti — da Allahova milost i oprost ostaju otvoreni do trenutka smrti za svakoga ko mu se iskreno vrati. Smisao učenja o stepenima je odabrati lakši put dok izbor ostaje.",
      "Praktično, to znači tretirati detaljne liste 'sedam nivoa' ili slične sheme kao mišljenje naučnika, a ne ustaljenu doktrinu, i držanje pažnje na onome što zapravo štiti: vjera, pokajanje i pravedna djela.",
    ],
    quran: [
      {
        excerpt: "Za sve će postojati stepeni prema onome što su radili.",
      },
      {
        excerpt:
          "Zaista, licemjeri će biti u najnižim dubinama Vatre, i nikada im nećete naći pomoćnika.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Najmanje kažnjen od ljudi Vatre će biti čovjek pod čijim nogama se stavljaju dvije žeravice od kojih mu ključa mozak.",
      },
    ],
    disclaimer:
      "Dijagrami nivoa pakla koji se nalaze u nekim knjigama odražavaju naučnu interpretaciju, a ne jednoglasnu saglasnost.",
  },
  {
    title: "Vrata pakla",
    summary: "Sedam kapija — šta Kur'an navodi i gdje se tumačenje razlikuje.",
    body: [
      "Jedan detalj o Džehannemu je eksplicitno i nedvosmisleno naveden u Kur'anu: 'Zaista, Džehennem ima sedam kapija; jer su svaka vrata njihov određeni dio' (15:44). Vjerovanje u sedam kapija stoga počiva na jasnom otkrivenju, a ne na spekulacijama.",
      "Ajet potvrđuje dvije stvari: da ima sedam kapija i da su oni koji ulaze raspoređeni među njima. Klasični učenjaci tefsira raspravljaju o tome šta podjela označava - da li ukazuje na kategorije ljudi, na stepene kazne u skladu sa djelima ili na oboje. Mudrost iza podjele pripada Allahu, čija pravda stavlja svaku dušu tačno tamo gdje joj je mjesto.",
      "Važno je napomenuti gdje prestaje sigurnost. Neki kasniji radovi pripisuju svaku specifičnu kapiju određenom grijehu ili grupi. Ovi posebni zadaci nisu jednoobrazno utvrđeni u najranijim izvorima, pa ih je najbolje prikazati kao gledišta pojedinačnih učenjaka, a ne kao proročke specifikacije.",
      "Kao i kod nivoa, pouka kapija nije arhitektonska već moralna: mnoga su vrata koja vode prema Vatri, a način da budete sigurni od svih njih je isti - iskrena vjera, izbjegavanje velikog grijeha i brzo pokajanje kada se oklizne.",
    ],
    quran: [
      {
        excerpt:
          "I zaista, pakao je obećano mjesto za sve njih. Ima sedam kapija; za svaku kapiju je dodijeljen dio.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Opisi Jahannama",
    summary:
      "Vatra, vrućina, lanci, žaljenje — predstavljeno s poštovanjem, a ne senzacionalizmom.",
    body: [
      "Kur'an i vjerodostojni sunnet opisuju Džehannem živim, konkretnim jezikom, i to čine s razlogom: ljudsko srce više pokreću slike koje može zamisliti nego apstraktne ideje. Opisi - intenzivna vatra, nepodnošljiva vrućina, ograničena hrana i piće, lanci, tama i duboko žaljenje - imaju za cilj da opasnost učine dovoljno stvarnom da nas odvrate od nje.",
      "Među opisima su kipuća voda koja se daje za piće, gorko drvo zaqqum kao hrana, odjeća izrezana iz vatre i odvajanje od svake udobnosti na koju se osoba nekada oslanjala. Poslanik, sallallahu alejhi ve sellem, je prenio koliko ova vrućina prevazilazi sve što znamo, rekavši da je vatra koju palimo na ovom svijetu samo jedan dio od sedamdeset dijelova Ahireta (Sahih al-Buhari 3265).",
      "Ovi opisi su prava upozorenja, a ne samo metafore koje isprazne Ahiret od posljedica. Sunitski učenjaci potvrđuju njihovu stvarnost, a prepuštaju tačan modalitet nevidljivog Allahovom znanju; zadatak vjernika je da upozorenje primi k srcu, a ne da ga secira.",
      "Postoji bonton (adab) za čitanje takvih odlomaka. Njima se pristupa sa poniznošću, strahopoštovanjem prema Allahu i trenutnim porivom da se pokaju i traže utočište - ne sa morbidnom fascinacijom, i nikada s očajem, jer je cijela svrha upozorenja da još uvijek imamo vremena da ga izbjegnemo.",
      "Možda je najteža tema u ovim opisima žaljenje. 'Da sam bar imao...' reći će se kada se vrijeme za akciju već završi. Milosrđe što sada čujemo o tom žaljenju je da danas možemo djelovati po 'ako bi', dok to još uvijek može promijeniti naš kraj.",
    ],
    quran: [
      {
        excerpt:
          "Pred njim je pakao i daće mu se za piće prljava voda. Progutaće ga, ali jedva proguta.",
      },
      {
        excerpt: "Odjeća od ognja će im biti izrezana, a vrela voda će im se politi po glavama.",
      },
      {
        excerpt:
          "Pakao će se toga Dana izroditi - tog dana će se čovjek sjetiti, ali šta će mu biti od toga sjećanje?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Vaša vatra je jedan dio od sedamdeset dijelova vatre pakla. Rečeno je: O Allahov Poslaniče, ova vatra bi bila dovoljna. Rekao je: Njemu je data snaga za šezdeset i devet delova više od njega, a svaki deo je kao njegova toplota.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ko je upozoren?",
    summary: "Kategorije u Kur'anu i Sunnetu — ne osude pojedinaca.",
    body: [
      "Pažljivi čitalac Kur'ana primjećuje da su njegova upozorenja usmjerena na ponašanja i stavove, a ne na imenovane pojedince. Upozorava one koji ustraju u nevjerici nakon što im je istina postala jasna, licemjere koji ispovijedaju vjeru spolja, a iznutra je odbacuju, tlačitelje koji gaze prava drugih, arogantne koji su previše ponosni da bi se pokorili i one koji umiru zbog velikog grijeha a da se nikada nisu pokajali.",
      "Ovaj fokus na kategorije, a ne na osobe, je namjeran i milostiv. Vrata povratka ostaju otvorena za svakog živog čovjeka, bez obzira na njegovu prošlost, jer ničiji dosije nije zatvoren do smrti. Upozorenje opisuje cestu, tako da svako ko još ide njime može sići.",
      "Iz tog razloga, Islam nam ne dozvoljava da proglasimo konačnu sudbinu bilo koje određene osobe - da kažemo 'ova osoba je u vatri' - osim u rijetkim slučajevima kada su Allah ili Njegov Poslanik, sallallahu alejhi ve sellem, to eksplicitno naveli u autentičnoj objavi. Suditi srcima i svršecima pripada samo Allahu; naš zadatak je naše vlastito računanje.",
      "Dakle, pravi način da pročitate svako upozorenje je da ga okrenete prema unutra: a ne 'koga ovo opisuje?' ali 'da li me išta od ovoga opisuje i šta ću danas promijeniti?' Ko god da ste, poziv da se vratite Allahu je otvoren upravo sada - a sutra nikome nije obećano.",
    ],
    quran: [
      {
        excerpt: "Licemjeri će biti u najnižoj dubini Vatre.",
      },
      {
        excerpt: "Ko zaradi grijeh i bude obuzet njime - to su drugovi Vatre, koji vječno ostaju.",
      },
      {
        excerpt:
          "Nemojte misliti da Allah nije svjestan onoga što zulumćari rade. On ih odlaže samo za jedan Dan kada će oči buljiti.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Major Sins",
    summary: "Kabair — teški grijesi koji zahtijevaju iskrenu tevbu.",
    body: [
      "Učenjaci dijele grijehe u dvije kategorije, a razumijevanje razlike donosi i ozbiljnost i olakšanje. Glavni grijesi (al-kaba'ir) su oni za koje su Allah ili Njegov Poslanik, sallallahu alejhi ve sellem, pripisali određenu tešku posljedicu — prijetnju vatrom, kletvu, Allahov gnjev ili propisanu kaznu — kao što su širk, ubistvo i trošenje kamata. Manji grijesi (al-sagha'ir) su manje greške koje su ispod tog praga.",
      "Olakšanje leži u tome kako se njih dvoje odnose. Allah obećava da ako vjernik izbjegava velike grijehe, manji će biti izbrisani običnim ibadetom: 'Ako izbjegavate velike grijehe zabranjeno vam je, Mi ćemo od vas ukloniti vaše manje grijehe' (4:31). Namaz do namaza, džuma do džume, i ramazan do ramazana iskupljuju ono što je između njih, sve dok se izbjegavaju veliki grijesi.",
      "Zbog toga glavni grijesi zaslužuju fokusiranu pažnju: to su oni koji se ne ispiru samo u toku svakodnevnog ibadeta, već pozivaju na namjerno, iskreno pokajanje (tevbah). Uporni bez povratka, ugrožavaju dušu; napušteni i pokajani, oprošteno im je.",
      "I evo horizonta nad svim tim: sa izuzetkom umiranja nakon širka, svaki grijeh – veći ili manji – potpada pod Allahov oprost ako On hoće. 'Zaista, Allah ne oprašta druženje s Njim, ali oprašta ono što je manje od onoga kome hoće' (4:48). Nijedan vjernik nikada ne bi trebao zaključiti da ga njihovi glavni grijesi stavljaju van milosti.",
      "Svaka glavna tema o grijehu u ovom modulu daje svoju definiciju, svoje dokaze, zašto je ozbiljna i konkretan put pokajanja i izbjegavanja – koji se uvijek završava na istim otvorenim vratima.",
    ],
    quran: [
      {
        excerpt:
          "Ako izbjegavate velike grijehe koji su vam zabranjeni, Mi ćemo od vas ukloniti vaše manje grijehe i primiti vas na plemeniti ulaz.",
      },
      {
        excerpt:
          "Zaista, Allah ne oprašta druženje s Njim, ali oprašta ono što je manje od onoga kome hoće.",
      },
      {
        excerpt:
          "Oni koji izbjegavaju velike grijehe i nemorale, samo lake - zaista, vaš Gospodar je ogroman u oprostu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Najveći od najvećih grijeha su: pridruženje Allahu, ubijanje duše, neposlušnost roditeljima i lažno svjedočenje.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Gresi jezika",
    summary: "Ogovaranje, laganje, ruganje — grijesi koje je lako počiniti, a teško poništiti.",
    body: [
      "Jezik je mali, ali njegove posledice su ogromne; sa nekoliko riječi osoba može izgraditi povjerenje ili uništiti reputaciju, utješiti srce ili ga duboko raniti. Zbog toga se Kur'an i Sunnet tako često vraćaju na grijehe govora: klevetanje (ghibah), klevetu (buhtan), nošenje priča (namimah), laž, ruganje i lažne zakletve.",
      "Ogovaranje znači spominjanje o svom bratu ili sestri nečega što im se ne bi svidjelo, čak i ako je to istina - jer da je laž, to bi bio najgori grijeh klevete. Kur'an mu daje jednu od njegovih najupečatljivijih slika: poredi je sa jedenjem mesa nečijeg mrtvog brata ili sestre (49:12). Uokviren na taj način, grijeh gubi svoju ležernost.",
      "Ono što ove grijehe čini tako opasnim je upravo to koliko su laki i uobičajeni. Ljudi se u njih uvlače u običnom razgovoru bez razmišljanja, zbog čega je Poslanik, sallallahu alejhi ve sellem, vezao vjeru za čuvarski govor: 'Ko vjeruje u Allaha i Sudnji dan, neka govori dobro ili neka šuti.' Jednostavna pauza prije govora je pravi čin obožavanja.",
      "Pokajanje od greha jezika prati uobičajene uslove - zaustavi se, požali, odluči da se ne vratiš - sa dodatnom dimenzijom kada je u pitanju pravo druge osobe. Tamo gdje se brisanje njihovog imena ili traženje pomilovanja mogu učiniti bez nanošenja veće štete, to je dio pokajanja; gdje bi njihovo obavještavanje samo produbilo povredu, naučnici umjesto toga savjetuju da se o njima govori lijepo, brani ih u njihovom odsustvu i moli se za njihov oprost.",
    ],
    quran: [
      {
        excerpt:
          "Ne zamjerite jedni drugima. Da li bi neko od vas želeo da jede meso svog mrtvog brata?",
      },
      {
        excerpt: "Teško svakom podrugljivcu i rugaču.",
      },
    ],
    hadith: [
      {
        excerpt: "Ko vjeruje u Allaha i u Sudnji dan neka govori dobro ili neka šuti.",
      },
    ],
    actions: [
      "Prije nego što progovorite, pitajte: Da li je to istina? Da li je potrebno? Da li je ljubazno?",
      "Ako nekoga zamjerite, učinite mu dovu i tražite oprost gdje je to moguće.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Sins Against Others",
    summary: "Prava ljudi zahtijevaju restituciju - ne samo pokajanje Allahu.",
    body: [
      "Islam dijeli prava koja imamo u dvije vrste: prava Allaha (huquq Allah) i prava ljudi (huquq al-'ibad). Ugnjetavanje (dhulm), nepravda, kršenje povjerenja, varanje u trgovini, zadržavanje plata, neplaćeni dugovi i raskid porodičnih veza sve spada u prava ljudi - i ovo je posebno ozbiljno na Ahiretu.",
      "Razlog je prikazan u otrežnjujućem hadisu. Poslanik, sallallahu alejhi ve sellem, opisao je osobu koja je zaista bankrotirala kao osobu koja dolazi na Sudnjem danu sa molitvama, postom i dobročinstvom - a ipak je vrijeđala, klevetala, neopravdano uzimala imetak i prolivala krv. Njegove žrtve se plaćaju od njegovih dobrih djela dok ih ne ponestane, a onda se njihovi grijesi natovare na njega i on biva bačen u vatru (Sahih Musliman 2581). Osoba može biti bogata ibadetom, a ipak biti uništena načinom na koji se ophodio prema drugima.",
      "Ovo uči ključnu lekciju o pokajanju: okretanje Allahu je neophodno, ali kada je ljudsko pravo povrijeđeno, to samo po sebi nije dovoljno. Potraživanje oštećenog ostaje sve dok se ne podmiri ili oprosti. Dakle, pokajanje ovdje ima četvrti uslov osim zaustavljanja, žaljenja i rješavanja - vraćanje onoga što duguje.",
      "U praksi to znači vratiti ono što je oduzeto ili njegovu vrijednost, otplaćivati ​​dugove čak i postupno, vraćati narušenu reputaciju i posegnuti za pomirenjem sa odsječenom rodbinom. I u tome ima milosti: svaki korak nadoknade je sam po sebi dobro djelo, a Allah olakšava iskreno srce koje krene da popravi ono što je slomilo.",
    ],
    quran: [
      {
        excerpt:
          "Ako ne odustanete od riba, onda obratite pažnju na rat od Allaha i Njegovog Poslanika.",
      },
      {
        excerpt: "Pridružili su se oni koji prekrše Allahov savez i prekinu ono što je naredio.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Znate li ko je bankrot? Onaj koji dolazi sa molitvom, postom i dobročinstvom, ali je vrijeđao, klevetao, nezakonito trošio imetak i prolio krv – pa se njegova dobra djela daju drugima.",
      },
    ],
    actions: [
      "Navedite nekoga kome ste možda učinili nepravdu i učinite korak ka popravci ove sedmice.",
      "Plaćajte nepodmirene dugove čak i u malim ratama ako je to sve što možete riješiti.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Licemjerje",
    summary: "Velika hipokrizija u vjerovanju — i crte licemjerja u ponašanju.",
    body: [
      "Učenjaci razlikuju dvije vrste licemjerja, a njihovo razdvajanje sprječava i lažnu utjehu i lažnu paniku. Prvi je veliko licemjerje vjerovanja (nifaq i'tiqadi): ispoljavanje islama spolja dok iznutra odbacuje vjeru. Ovo je licemjerje na koje Kur'an najozbiljnije upozorava, stavljajući takve ljude 'u najniže dubine Vatre' (4:145), jer su u stvarnosti umrli kao nevjernici pod maskom.",
      "Drugo je manje licemjerje u ponašanju (nifaq 'amali): osobine koje liče na ponašanje licemjera čak i kod osobe čija je vjera stvarna. Poslanik, sallallahu alejhi ve sellem, je naveo dobro poznate znakove - 'kada govori laže, kada obećava to prekrši, a kada mu je povjereno izdaje' - a u drugoj predaji dodao je rđavost u sporu. Vjernik može pasti u ove i još uvijek biti vjernik, ali oni su ozbiljno upozorenje kojih se treba čuvati.",
      "Ova razlika je veoma važna za način na koji koristimo temu. Znakovi ponašanja daju se kao ogledalo za sebe, a ne kao etiketa koju treba prikačiti drugima. Poslanik, sallallahu alejhi ve sellem, i njegovi ashabi su se bojali licemjerja u sebi upravo zato što je srce skriveno i može se promijeniti.",
      "Dakle, zdrav odgovor je iznutra: provjeriti vlastito poštenje, vjernost obećanjima i pouzdanost i tražiti od Allaha iskrenost (ikhlas). Samo Allah zna šta se nalazi u čovjeku, a optuživanje određenih pojedinaca za licemjerje je samo po sebi teški prijestup protiv njih.",
    ],
    quran: [
      {
        excerpt: "Licemjeri će biti u najnižoj dubini Vatre.",
      },
      {
        excerpt:
          "Kada vam licemjeri dođu, govore: “Svjedočimo da ste vi Allahov Poslanik, a Allah zna da su oni lažovi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Tri su znaka licemjera: kada govori laže, kada obećava to krši, a kada mu je povjereno, izdaje.",
      },
    ],
    disclaimer:
      "Ne optužujte pojedince za nifaq. Tekstovi upozoravaju zajednicu; pročišćavanje počinje sa samim sobom.",
  },
  {
    title: "Spomenute kazne",
    summary: "Ono što tekstovi opisuju – čitajte sa strahom od Allaha i nadom u Njegovu milost.",
    body: [
      "Kur'an i Sunnet navode konkretne posljedice za određene nepravde - za one koji žderu ribu, koji kleveću čedne žene, koji gomilaju imetak i uskraćuju mu pravo, koji zanemaruju namaz i koji ustraju u velikom grijehu. Specifičnost je oblik jasnoće: ne ostavlja nikoga u stanju da kaže da nije bio upozoren na ono što je radio.",
      "Neke od ovih posljedica su opisane u kaburu (adhab al-qabr), a druge u samom Džehannamu. Glavni sunitski akida potvrđuje realnost i jednog i drugog, dok povjerava tačno 'kako' ovih nevidljivih stvari Allahovom znanju, a ne ljudskoj mašti.",
      "Bitno je kako se vjernik bavi svim tim. Cilj je nikada ne zadržavati se na grafičkim detaljima ili pustiti da srce potonu; to je primiti upozorenje, pokajati se za sve što se odnosi, a zatim usmjeriti energiju ka djelima koja zapravo štite. Zato ovaj modul namjerno daje više prostora zaštiti, pokajanju i milosrđu nego kazni.",
      "Ukratko, pravi zaključak iz bilo koje spomenute kazne je pitanje, a ne strah: 'Radim li ovo — i ako da, kako da zaustavim i ispravim?' Iskreno odgovoreno danas, upozorenje je već obavilo svoje milosrdno djelo.",
    ],
    quran: [
      {
        excerpt:
          "Oni koji optužuju čedne žene i ne dovedu četiri svjedoka - bičujte ih sa osamdeset pruga.",
      },
      {
        excerpt:
          "Oni koji gomilaju zlato i srebro i ne troše ih na Allahovom putu - javi im bolnu kaznu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Zaštita od pakla",
    summary: "Tevhid, namaz, tevba, dobročinstvo, Kur'an i dova — srce ovog modula.",
    body: [
      "Nakon svih upozorenja, ovo je srž stvari: Džehannam je nešto od čega osoba treba biti zaštićena, a Islam je pun sredstava za tu zaštitu. Najveći od njih je zdrav tevhid - obožavanje samo Allaha, bez ičega osim Njega. Svako drugo djelo se prihvata i vaga samo na ovom temelju, zbog čega je čuvanje vjerovanja ispred svega.",
      "Na toj osnovi, praktični štitovi su brojni i nadohvat ruke: uspostavljanje pet dnevnih namaza, iskreno pokajanje, davanje milostinje — za koje je Poslanik, sallallahu alejhi ve sellem, rekao da gasi grijeh kao što voda gasi vatru — post, učenje Kur'ana i djelovanje po njemu, dobar karakter, milost prema drugima, redovno sjećanje (zikr). Ništa od toga ne zahtijeva veliko bogatstvo ili znanje; otvoreni su za sve.",
      "Poslanik, sallallahu alejhi ve sellem, je također podučavao direktne dove za utočište od Vatre i podsticao nas da često tražimo. Rekao je da onaj ko zatraži od Allaha Džennet tri puta, sam Džennet moli za prijem, a ko traži utočište od Vatre tri puta, sama Vatra moli da ga poštedi (Džami' at-Tirmizi 2572). Ove dove imaju posebno mjesto prije selama u namazu i u jutarnjem i večernjem adhkaru.",
      "Obratite pažnju na ravnotežu koju Šerijat postiže. Sredstva zaštite su brojnija, naglašenija i dostižnija od uzroka propasti — a to je samo znak Allahove milosti. Mnogo je lakše spasiti se nego izgubiti.",
      "Ovaj odjeljak je namjerno najveći u modulu, jer tako Islam sam vaga stvar: upozorenje uvijek upareno s nadom, i nikada odvojeno od konkretne akcije, osoba može započeti danas.",
    ],
    quran: [
      {
        excerpt:
          'Oni koji govore: "Gospodaru naš, mi smo vjerovali, pa oprosti nam grijehe naše i zaštiti nas od kazne u ognju."',
      },
      {
        excerpt:
          "Gospodaru naš, daj nam dobro na ovom svijetu i dobro na onom svijetu i zaštiti nas od kazne vatre.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ko tri puta zamoli Allaha za Džennet, Džennet kaže: O Allahu, uvedi ga u Džennet! Ko se tri puta skloni od Vatre, Vatra kaže: O Allahu, zaštiti ga od Vatre!",
      },
    ],
    actions: [
      "Zapamtite dovu koja traži utočište od Džehannama prije selama u namazu.",
      "Molite pet dnevnih namaza na vrijeme - među najjačim štitovima.",
      "Dajte dobročinstva redovno, čak i male iznose.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "pokajanje (tevba)",
    summary: "Allah prihvata iskreno pokajanje - nijedan grijeh nije prevelik prije smrti.",
    body: [
      "Tewbah — pokajanje — je mehanizam koji je Allah ugradio u vjeru tako da nijedan grijeh ne mora biti trajan. U svojoj srži to je okretanje srca natrag prema Allahu, a učenjaci njegove uvjete izvode iz Kur'ana i Sunneta: iskreno zaustaviti grijeh, osjetiti istinsko žaljenje zbog njega i čvrsto odlučiti da se više nikada ne vratite. Kada je grijeh uključivao pravo druge osobe, dodaje se četvrti uvjet — vraćanje tog prava ili traženje njihovog oprosta.",
      "Ono što čini tevbu tolikom nadom je način na koji je Allah prima. On ne samo toleriše slugu koji se vraća; On se raduje. Poslanik, sallallahu alejhi ve sellem, je rekao da se Allah više raduje pokajanju Svoga sluge od čovjeka koji, izgubivši svoje gorje sa svim svojim namirnicama u neplodnoj pustinji i izgubivši nadu, iznenada ga nađe kako stoji pred njim (Sahih al-Buhari 6309). To je dobrodošlica koja čeka svakoga ko se vrati.",
      "Štaviše, njegova vrata se nikada ne zatvaraju tokom života. Poslanik, sallallahu alejhi ve sellem, je rekao da Allah pruža Svoju ruku noću da prihvati pokajanje grešnika tog dana, a pruža svoju ruku danju da prihvati pokajanje noćnog grešnika (Sahih Musliman 2759). Pokajanje je prihvaćeno za pojedinca sve dok duša ne dođe do grla u smrti, a za čovječanstvo dok sunce ne izađe sa zapada - tako da nikada nema razloga da se odgađa.",
      "Ovo važi čak i za onoga ko je pao i pokajao se mnogo puta. Sve dok je povratak iskren svaki put, Allah prihvata; očaj je od šejtana, a ne od religije. Jedina stvar koja se mora riješiti prije smrti je širk, jer osoba koja umre nakon nje umire bez vjere koju zahtijeva pokajanje - upravo je to razlog zašto je potpuno okretanje jedinom Allahu najhitniji povratak od svih.",
      "Praktični zaključak je jednostavan: pokajte se sada, pokajte se često i nikada ne dozvolite da veličina grijeha ili broj prošlih padne ne odugovlače da se vratite. Poziv je uvijek otvoren.",
    ],
    quran: [
      {
        excerpt:
          "Ne očajavajte u Allahovoj milosti. Zaista, Allah oprašta sve grijehe. On je Onaj koji prašta, Milostivi je.",
      },
      {
        excerpt:
          "Osim onih koji se pokaju, vjeruju i čine dobra djela - Allah će njihova zla djela zamijeniti dobrim.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah je više zadovoljan pokajanjem Svoga roba nego onaj od vas koji nađe svoju izgubljenu goru u neplodnoj zemlji.",
      },
      {
        excerpt:
          "Allah pruža Svoju ruku noću da prihvati pokajanje grešnika tog dana, i pruža Svoju ruku danju da prihvati pokajanje noćnog grešnika, sve dok sunce ne izađe sa zapada.",
      },
    ],
    actions: [
      "Izgovarajte Astaghfirullah tokom cijelog dana – težite postojanju, ne samo nakon većih grešaka.",
      "Naučite Sayyid al-Istighfar i recitujte ga ujutro i navečer.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Nadaj se u Allahovu milost",
    summary: "Nikada ne očajavajte - dobra djela brišu grijehe; dosljednost je bitna.",
    body: [
      "Sve u ovom modulu ukazuje ovdje. Allah je ar-Rahman ar-Raheem — Najmilostiviji — i On nam je rekao da Njegova milost nadmašuje Njegov gnjev i 'obuhvata sve stvari' (7:156). Vjerniku je suđeno da živi između nade i straha, kao dva krila ptice: dovoljno uplašen grijeha da ostane na oprezu, dovoljno pun nade u oproštenju da nikada ne odustane.",
      "Zbog toga, očaj sam po sebi nije na mjestu. Koliko god osoba osjećala da je zalutala, vrata su otvorena, a šejtan je – a ne Allah – taj koji šapuće da je prekasno. Očajati od milosti znači premalo misliti o Najmilosrdnijem; posao iskrenog srca je jednostavno da se vrati.",
      "Ovdje leži velika udobnost sunitskog vjerovanja o Vatri. Za one koji umru zbog nevjerovanja, Jahannam je trajno prebivalište. Ali vjernik koji umre potvrđujući samo Allaha, čak i ako je opterećen velikim grijesima, neće ostati u njemu zauvijek. Poslanik, sallallahu alejhi ve sellem, je učio da će ljudi biti izvedeni iz Vatre posredovanjem, a zatim Allahovom vlastitom milošću – bačeni u Rijeku života na rubu Dženneta, gdje će biti vraćeni i u nju ući (Sahih al-Buhari 7439). Rekao je da niko neće ostati u Vatri ko ima čak i gorušičinu težinu vjere u srcu (Sahih Musliman 183). Za monoteistu, dakle, Vatra — ako se uopšte uđe u nju — nikada nije kraj priče.",
      "U međuvremenu, milost se ugrađuje u svakodnevni život: dobra djela brišu ona loša (11:114), a mali, dosljedni ibadeti – jedan namaz klanjan na vrijeme, jedan tihi čin dobročinstva, jedan trenutak strpljenja za Allaha radi – stalno privlači osobu bliže Njemu i dalje od zla. Dosljednost je važnija od intenziteta.",
      "Dakle, neka ovo bude zaključak vaše studije: shvatite upozorenje ozbiljno, ali neka nada bude glasnija od straha. Spoznaj opasnost, izaberi put milosti i idi njime - korak po korak - svaki dan dok ne sretneš Allaha.",
    ],
    quran: [
      {
        excerpt: "Moja milost obuhvata sve stvari.",
      },
      {
        excerpt:
          "Reci: O robovi moji koji ste sami sebe prestupili, ne očajavajte u Allahovoj milosti. Zaista, Allah oprašta sve grijehe.",
      },
      {
        excerpt: "Zaista, dobra djela otklanjaju zla djela. To je podsjetnik za one koji pamte.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah će reći: Meleki su se zauzimali, poslanici su se zauzimali, i vjernici su se zauzimali, i niko ne ostaje osim Najmilostiviji od milostivih. On će uzeti šaku iz Vatre i izvući ljude koji nikada nisu učinili ništa dobro.",
      },
      {
        excerpt: "Ko ima u srcu vjeru težinu zrna gorušice biće izvađena iz Vatre.",
      },
    ],
    actions: [
      "Završite svaki dan istigfarom i zahvalnošću za svaki blagoslov.",
      "Uparite ovaj modul sa Journey to Jannah — upozorenje i nada zajedno.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Uništavajući grijesi",
    summary: "Sedam uništavajućih grijeha, veliki grijesi i upozorenje o pravima ljudi.",
    body: [
      "Kur'an i sunnet težinu grijeha opisuju jezikom upozorenja; to nije rang-lista Mizana.",
      "Poslanik ﷺ naredio je da se klonimo sedam uništavajućih grijeha.",
      "Ko povrijedi prava ljudi može svoje hasenate dati oštećenima.",
      "Ne očajavajte u Allahovu milost; vrata tevbe otvorena su do smrti.",
      "Osim smrti u širku bez tevbe, Allah oprašta kome hoće.",
    ],
    destructiveItems: [
      {
        title: "Širk",
        summary: "Pripisivanje druga Allahu najveći je grijeh.",
      },
      {
        title: "Sihr",
        summary: "Bavljenje sihrom spada među uništavajuće grijehe.",
      },
      {
        title: "Ubistvo bez prava",
        summary: "Oduzimanje života koji je Allah zabranio osim s pravom.",
      },
      {
        title: "Konzumiranje ribe",
        summary: "Kamata i lihva su teški uništavajući grijesi.",
      },
      {
        title: "Jedenje imetka siročeta",
        summary: "Nepravedno prisvajanje imetka siročeta.",
      },
      {
        title: "Bježanje iz bitke",
        summary: "Okretanje leđa kada vojska napreduje.",
      },
      {
        title: "Potvaranje čestitih vjernica",
        summary: "Optuživanje čestitih vjernica za blud.",
      },
      {
        title: "Bankrotirani čovjek",
        summary: "Onaj čija se dobra djela uzimaju radi prava drugih.",
      },
    ],
    quran: [
      {
        excerpt: "Ne očajavajte u Allahovu milost; vrata tevbe otvorena su do smrti.",
      },
      {
        excerpt: "Osim smrti u širku bez tevbe, Allah oprašta kome hoće.",
      },
      {
        excerpt: "Poslanik ﷺ naredio je da se klonimo sedam uništavajućih grijeha.",
      },
    ],
    hadith: [
      {
        excerpt: "Poslanik ﷺ naredio je da se klonimo sedam uništavajućih grijeha.",
      },
      {
        excerpt: "Ko povrijedi prava ljudi može svoje hasenate dati oštećenima.",
      },
      {
        excerpt: "Širk",
      },
      {
        excerpt: "Ubistvo bez prava",
      },
      {
        excerpt: "Onaj čija se dobra djela uzimaju radi prava drugih.",
      },
    ],
    actions: [
      "Poslanik ﷺ naredio je da se klonimo sedam uništavajućih grijeha.",
      "Ko povrijedi prava ljudi može svoje hasenate dati oštećenima.",
      "Ne očajavajte u Allahovu milost; vrata tevbe otvorena su do smrti.",
    ],
    appLinks: [
      {
        label: "Uništavajući grijesi",
      },
      {
        label: "Teško na Vagi",
      },
      {
        label: "Priprema za tešku Vagu",
      },
      {
        label: "Istinoljubivost",
      },
    ],
  },
];

export const JAHANNAM_MAJOR_SIN_TOPICS_BS: DeepPartial<JahannamTopic>[] = [
  {
    title: "Shirk",
    summary: "Družiti drugove sa Allahom - jedini grijeh koji se ne oprašta ako se na njemu umre.",
    body: [
      "Definicija: Širk je pridružiti partnera Allahu – usmjeriti bilo koji čin koji pripada samo Njemu (obožavanje, krajnja ljubav, strah, nada, oslanjanje ili pravo na zakon) na nešto ili nekoga osim Njega. To je sušta suprotnost tevhidu, i pogađa samu svrhu zbog koje stvorenje postoji: obožavanje samo Allaha.",
      "Zašto je to najteži od svih grijeha: svaki drugi grijeh je nepravda učinjena uz priznavanje pravog Gospodina, ali širk je nepravda koja je direktno učinjena protiv Njega – pogrešno stvaranje kreacije za Stvoritelja. Zbog toga Kur'an to naziva 'velikim nedjelom' (31:13). To je jedini grijeh koji, ako čovjek zbog njega umre bez pokajanja, nije oprošten: 'Zaista, Allah ne oprašta druženje s Njim, ali oprašta ono što je manje od onoga kome hoće' (4:48). Milost koja se krije čak i u ovoj strogosti je da sve što je bez širka ostaje pod Allahovim oprostom.",
      "Njegovi oblici: učenjaci razlikuju glavne širke — obožavanje idola, mrtvih, svetaca ili stvorenih stvari; pozivanje drugog osim Allaha za ono što samo On može dati; i usmjeravanje žrtve ili zavjeta nekom drugom osim Njemu — što osobu vodi izvan islama ako se ne pokaje. Postoji i manji i skriveni širk, kao što je razmetanje u ibadetu (rija'), zaklinjanje drugim Allahom, ili oslanjanje na predznake i čari, što je ozbiljan grijeh, ali samo po sebi ne izbacuje iz vjere.",
      "Put od njega: čuvajte i jačajte tevhid učenjem, obožavanjem jedinog Allaha i namjerom čišćenja kako bi djela bila za Njega, a ne za oči ljudi. Onaj ko je pao u širk pokaje se tako što se iskreno odriče toga i vraća se obožavanju samo Allaha - i ta vrata povratka ostaju otvorena sve dok je živ.",
    ],
    quran: [
      {
        excerpt:
          "Zaista, Allah ne oprašta druženje s Njim, ali oprašta ono što je manje od onoga kome hoće.",
      },
      {
        excerpt: "O sine moj, ne pridružujte ništa Allahu. Zaista, udruživanje je velika greška.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Najveći od najvećih grijeha su: pridruženje Allahu, ubijanje duše, neposlušnost roditeljima i lažno svjedočenje.",
      },
    ],
    actions: [
      "Naučite tevhid kroz Naučite Akidu i 99 Allahovih imena.",
      "Očistite namjere u ibadetu - svakodnevno tražite od Allaha iskrenost.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ubistvo",
    summary: "Protivzakonito oduzimanje života nevinih ljudi – među najtežim prekršajima.",
    body: [
      "Definicija: Ubistvo ovdje znači nezakonito, namjerno oduzimanje života koji je Allah učinio svetim. Islam priznaje zakonite slučajeve – kao što je zakonita qisas (pravna odmazda) koju provodi odgovarajući autoritet – ali ubistvo nevine duše van opravdanog razloga spada među najteže zločine.",
      "Zašto je to tako teško: Kur'an teži jednom nepravednom ubistvu na vagi cijelog čovječanstva: 'Ko ubije dušu... kao da je ubio cijelo čovječanstvo' (5:32), jer uništiti jedan život znači narušiti svetost koja štiti svaki život. Ubistvo je bilo prvi grijeh počinjen između djece Ademove, a objava se vraća na njega iznova i iznova kao razarač Ahireta.",
      "Dvostruka nepravda: ubistvo je istovremeno grijeh protiv Allaha, čije je pravo na svetost života pogaženo, i grijeh prema ljudima - žrtvi i onima koje ostavljaju za sobom. Zbog toga je njegovo pokajanje teže od većine: obraćanje Allahu je neophodno, ali prava povrijeđenih također postoje, a tamo gdje zakon zemlje ili islamski zakon propisuje krvavi novac (diyah) ili druge posljedice, one se moraju ispuniti putem odgovarajućih kanala i kvalifikovanih učenjaka.",
      "Put od toga: držite svaki život svetim, smirite ljutnju i neprijateljstvo prije nego što otvrdnu, i rješavajte sporove strpljenjem i pravdom, a ne nasiljem. Čak ni ovaj najveći zločin protiv ljudi nije izvan Allahove milosti za onoga ko se iskreno pokaje, poštuje svoja prava koliko je to moguće, i nikada se ne vrati na takav put.",
    ],
    quran: [
      {
        excerpt:
          "Ko ubije dušu osim za dušu ili za pokvarenost u zemlji – to je kao da je ubio čitavo čovečanstvo.",
      },
      {
        excerpt:
          "Ko namjerno ubije vjernika - njegova naknada je pakao, u kojem će vječno boraviti.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Najveći od najvećih grijeha su: pridruženje Allahu, ubijanje duše, neposlušnost roditeljima i lažno svjedočenje.",
      },
    ],
    actions: ["Cijenite svaki život; rješavajte sporove strpljivo i pravedno."],
    appLinks: [{}],
  },
  {
    title: "Ostalo",
    summary: "Nedozvoljeni seksualni odnosi – destruktivni grijeh protiv duše i društva.",
    body: [
      "Definicija: Zina je svaka nezakonita seksualna veza izvan valjanog braka, koja obuhvata i blud (između nevjenčanih) i preljubu (koja uključuje oženjenu osobu). Islam to ne tretira kao privatnu stvar, već kao kršenje sa velikom štetom.",
      "Zašto je to ozbiljno: zina nagriza stvari na kojima je izgrađeno zdravo društvo — lozu, povjerenje među supružnicima, sigurnost djece i čednost koja dostojanstveno čini osobu. Sama formulacija Kur'ana je poučna: ne samo da zabranjuje čin, već kaže 'ne prilazi mu' (17:32), upozoravajući na poglede, privatnost i korake koji vode ka tome. Ta zabrana pristupa je milost, jer štiti osobu prije nego što iskušenje postane neodoljivo.",
      "Mudrost u barijerama: umjesto da ostavlja ljude da se bore protiv žudnje na njenom vrhuncu, Islam ih okružuje ranijim zaštitama - spuštanjem pogleda, skromnošću u odijevanju i ponašanju, izbjegavanjem izolacije sa suprotnim polom i ohrabrivanjem braka kao zakonitog, počašćenog kanala za ove potrebe. Izgraditi ove granice unaprijed je mnogo lakše nego oduprijeti se na rubu.",
      "Put nazad: za svakoga ko je pao, izlaz je iskrena tevba - potpuno napuštanje grijeha, žaljenje zbog njega, odlučivanje da se više nikada ne vrati, i prikrivanje, a ne objavljivanje svoje prošlosti. Zina je veliki grijeh, ali je naglašeno među onima koje Allah oprašta onome ko Mu se obrati; očaju nema mjesta, a novi početak je uvijek dostupan.",
    ],
    quran: [
      {
        excerpt:
          "Ne pristupajte nezakonitom seksualnom odnosu. Zaista, to je nemoralan i zao način.",
      },
      {
        excerpt:
          "A oni koji ne čine nedozvoljene seksualne odnose... osim onih koji se pokaju, vjeruju i rade pravedno - za njih će Allah njihova zla djela zamijeniti dobrim.",
      },
    ],
    actions: [
      "Čuvajte oči i potrošnju društvenih mreža.",
      "Učinite dovu za pravednog supružnika ako nije oženjen.",
    ],
    appLinks: [{}],
  },
  {
    title: "Riba",
    summary: "Kamate i kamate — rat koji je objavljen u Kur'anu svojim praktikantima.",
    body: [
      "Definicija: Riba je nezakonito povećanje određenih finansijskih poslova – najpoznatije kamate koje se naplaćuju ili plaćaju na kredite, ali također uključuje specifične nejednake ili odložene razmjene sličnih roba. Njegova suština je sticanje bogatstva bez prave vrijednosti ili rizika, na tuđi račun.",
      "Zašto je izuzetno teška: riba je jedinstvena među finansijskim grijesima u jeziku koji Kur'an koristi protiv njega. Allah objavljuje rat od Sebe i od Njegovog Poslanika, sallallahu alejhi ve sellem, onima koji ustraju u tome (2:279) – fraza koja se ne koristi ni za jedan drugi grijeh – jer riba iskorištava potrebu, koncentriše bogatstvo u rukama nekolicine i uništava samilost koju ekonomija treba da nosi. Poslanik, sallallahu alejhi ve sellem, je strogo upozorio da se time ne bavite u bilo kom svojstvu.",
      "Mudrost i milosrđe: zabrana usmjerava ljude ka stvarnoj trgovini, zajedničkom riziku i dobročinstvu, a štiti ugrožene od slomljenog duga. Čak i ovdje je prisutna Allahova milost: kada je stigla naredba, On nije zahtijevao da se već preuzete kamate iz prošlosti vrate, već je rekao vjernicima da jednostavno napuste ono što je preostalo - 'imat ćete svoju glavnicu' (2:279) - što je olakšanje za one koji se od nje okrenu.",
      "Put od toga: revidirajte svoje finansije za proizvode zasnovane na kamatama, tražite halal alternative i konsultujte kvalifikovane naučnike za zaista teške slučajeve kao što su hipoteke u nemuslimanskim zemljama. Napuštanje riba može značiti teške finansijske izbore, ali sigurnost duše nadmašuje svaki privremeni dobitak - a Allah obećava da će obezbijediti za onoga ko Ga se boji odakle ne očekuje.",
    ],
    quran: [
      {
        excerpt:
          "O vjernici, bojte se Allaha i ostavite što je ostalo od riba, ako ste vjernici. Ako to ne učinite, budite obaviješteni o ratu od Allaha i Njegovog Poslanika. Ali ako se pokajete, možda ćete imati svog glavnog – ne činite ništa loše, niti vam je učinjena nepravda.",
      },
      {
        excerpt: "Allah uništava kamate i daje uvećanje za dobrotvorne svrhe.",
      },
    ],
    actions: [
      "Revizija finansija za proizvode zasnovane na kamatama.",
      "Konsultujte se sa kvalifikovanim naučnikom za hipoteke i dugove.",
    ],
    appLinks: [{}],
  },
  {
    title: "Lažno svjedočenje",
    summary: "Laganje pod zakletvom ili lažno svjedočenje – uništava pravdu.",
    body: [
      "Definicija: Lažno svjedočenje (shahadat al-zur) je svjedočenje o nečemu neistinitom — i šire, laganje pod zakletvom, izmišljanje optužbi ili uskraćivanje istinitog svjedočenja kada pravda zavisi od toga.",
      "Zašto je to ozbiljno: kvari sam instrument kojim se ostvaruje pravda. Jedan lažni svjedok može poslati nevinu osobu u propast, oduzeti zakonitom vlasniku njihovu imovinu ili osloboditi tlačitelja - tako da laž nikada nije ograničena na laž; ranjava prave ljude i ceo poredak pravičnosti. Poslanik, sallallahu alejhi ve sellem, ga je ubrajao među najveće velike grijehe, a u jednoj predaji je postao toliko uporan u ponavljanju upozorenja protiv toga da su njegovi ashabi poželjeli da prestane, iz brige za njega.",
      "Njegova veza s jezikom: lažno svjedočanstvo je najoštrija oštrica širih grijeha govora. Budući da su riječi jeftine za izgovoriti, opasno je lako upasti u ovaj grijeh – potpis, preuveličavanje, zgodna šutnja – a ipak je njegova težina na Sudnjem danu ogromna, kada će sami udovi i jezici ljudi istinito svjedočiti protiv njih.",
      "Put od toga: držite se istine čak i kada je to skupo ili protiv vlastitog interesa, odbijte da pozajmite svoju riječ bilo kakvoj laži i govorite pravednim svjedočenjem kada je to potrebno. Onaj ko je lažno svjedočio pokaje se povlačeći laž gdje god je to moguće, nastojeći da poništi štetu i povrati prava svakome kome je nanesena nepravda, i obraćajući se Allahu sa iskrenim žaljenjem.",
    ],
    quran: [
      {
        excerpt:
          "A oni koji ne svjedoče neistinu, i kada prođu blizu lošeg govora, prolaze dostojanstveno.",
      },
      {
        excerpt: "Zato izbjegavajte nečistoću idola i izbjegavajte lažne izjave.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Da vas ne obavijestim o najvećem od velikih grijeha? Druženje partnera sa Allahom, neposlušnost roditeljima — i lažno svjedočenje i lažno svjedočenje.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Čarobnjaštvo",
    summary: "Magija, traženje magičara i okultne prakse - kufr u glavnim oblicima.",
    body: [
      "Definicija: Sihr (čarolija ili magija) je upotreba zabranjenih sredstava – koja često uključuju oslanjanje na đavole ili tvrdnju o moći nad nevidljivim – da se utječe na ljude ili događaje. Prakticiranje, učenje, traženje od drugih i vjerovanje onima koji tvrde da sve to potpadaju pod ovaj grijeh.",
      "Zašto je tako težak: veliki dio sihra ne može se izvesti bez nevjerovanja, kao što je približavanje šejtanima ili ponižavanje Kur'ana, zbog čega Kur'an svoje znanje veže za kufr. Govoreći o magiji naučenoj u vrijeme Sulejmana, Allah kaže da su je šejtani i ta dva meleka učili samo kao iskušenje, upozoravajući 'ne vjerovati' (2:102). Iznad opasnosti od vjeroispovijesti, sihr šteti stvarnim ljudima - sijući podjele među supružnicima, šireći strah i iskorištavajući očajne.",
      "Povezane prakse: isto upozorenje se odnosi na proricanje sudbine, na tretiranje astrologije kao izvjesnog znanja o nevidljivom, te na amajlije i amajlije koje nose širk. Traženje znanja o skrivenoj budućnosti pripada samo Allahu, a okretanje onima koji tvrde da to potkopava tevhid u njegovom korijenu.",
      "Put od toga: za one koji su upleteni u ove prakse, pokajanje znači potpuno ih napustiti, uništiti sve zabranjene stvari, prekinuti veze sa onima koji se njima bave, i obnoviti iskreni tevhid i oslanjanje samo na Allaha. Zaštita se nalazi u vjeri, u svakodnevnom adhkaru i u traženju utočišta kod Allaha - a Njegov oprost je otvoren svakome ko se zaista vrati.",
    ],
    quran: [
      {
        excerpt:
          "Pratili su ono što su đavoli recitirali za vrijeme Solomonove vladavine... i saznali su šta im šteti, a ne koristi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ko god dođe gatari i vjeruje u ono što on kaže, nije vjerovao u ono što je objavljeno Muhammedu.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Konzumiranje bogatstva siročadi",
    summary: "Uzimanje ili nepravedno trošenje imovine siročadi.",
    body: [
      "Definicija: Ovaj grijeh je oduzimanje, trošenje ili zloupotreba imovine siročadi — djece koja su izgubila oca i ne mogu zaštititi svoje interese. Staratelj svoje bogatstvo drži kao amanet (amanah), nikada kao vlasnik.",
      "Zašto je to ozbiljno: kombinuje dve nepravde — izdaju svetog poverenja i ugnjetavanje onih najneodbranjenijih. Slika Kur'ana je oštra: oni koji troše bogatstvo siročadi nepravedno 'troše samo vatru u svoje trbuhe' (4:10), pretvarajući trenutak pohlepe u samonametnutu kaznu. Iskorištavanje onoga ko nema ko da govori u njegovo ime spada među najružnije oblike nepravde, zbog čega je upozorenje tako oštro - i, budući da je oštro, tako milostivo u odvraćanju čuvara od njega.",
      "Šta uključuje: ne samo direktnu krađu, već i suptilnije forme — miješanje imovine siročadi s vlastitim kako bi se zamaglila granica, odgađanje njenog povratka kada siroče postane punoljetno, ili ulaganje ili trošenje bez prava. Allah naređuje suprotno: 'Dajte siročadima njihovu imovinu, a ne zamjenjujte loše za dobro' (4:2).",
      "Put od toga: pažljivo čuvajte bogatstvo siročadi, čuvajte ga odvojeno i vodite računa o njemu, predajte ga u potpunosti kada sazriju, i — za onoga koji nije uspio — pokajte se vraćajući ono što se duguje sa svim dužnim povećanjem i tražeći pomilovanje onih kojima je učinjena nepravda. Na Dan kada nikakvo bogatstvo ili loza neće pomoći osim zdravog srca, vraćanje takvog povjerenja je samo po sebi dragocjeno djelo.",
    ],
    quran: [
      {
        excerpt: "Oni koji nepravedno troše bogatstvo siročadi - troše samo vatru u stomak.",
      },
      {
        excerpt:
          "Dajte siročadima njihovu imovinu i ne mijenjajte loše za dobro, i ne trošite njihovo bogatstvo sa svojim bogatstvom.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Disobeying Parents",
    summary: "Uquq — među glavnim grijesima nakon širka.",
    body: [
      "Definicija: 'Uquq al-walidayn je teška neposlušnost i maltretiranje nečijih roditelja – nanošenje štete njima, ophođenje prema njima s prezirom, zanemarivanje u nevolji ili ranjavanje riječju ili djelom. To je suprotno od birr al-walidayn, poslušne ljubaznosti koju Islam zapovijeda.",
      "Zašto je to tako ozbiljno: u ajetu za ajetom Allah spaja naredbu da se Njemu obožava sa naredbom da budemo dobri prema roditeljima, kao u 'Obožavajte Allaha... i roditeljima činite dobro' (4:36) - stavljajući njihovo pravo odmah iza Njegovog. Roditelji su, poslije Allaha, najbliži izvor čovjekovog bića i odgoja, pa je nezahvalnost prema njima jedna vrsta nezahvalnosti koja seže duboko. Poslanik, sallallahu alejhi ve sellem, naveo je njihovo maltretiranje među najvećim velikim grijesima, na drugom mjestu nakon širka.",
      "Važna ravnoteža: poslušnost ne znači pokoravanje roditeljima u neposlušnosti Allahu – nijedno stvorenje nije poslušano u grijehu protiv Stvoritelja. Ali čak i tamo gdje se mora odbiti, to se radi s blagošću, poštovanjem i kontinuiranom ljubaznošću. Kur'an zabranjuje čak i najmanju riječ ljutnje: 'ne govori im uff' (17:23).",
      "Put povratka: milost je u tome što su roditelji obično i dalje na dohvat ruke. Za onoga ko je pao, pokajanje je uglavnom praktično – nastavite sa dobrotom, tražite od njih pomilovanje, služite im i činite dovu za njih, posebno dok su živi. A ako je roditelj preminuo, poslušnost se nastavlja kroz molitvu za njih, davanje milostinje u njihovo ime i poštovanje njihovih veza i prijatelja.",
    ],
    quran: [
      {
        excerpt:
          "Vaš Gospodar je odredio da ne obožavate nikoga osim Njega, a roditeljima dobar tretman. Nemojte im govoriti 'uff' niti ih odbijati, nego im recite plemenitu riječ.",
      },
      {
        excerpt: "Obožavajte Allaha i ništa Mu ne pridružujte, a roditeljima dobro činite.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Da vas ne obavijestim o najvećem od velikih grijeha? Pridruživanje partnera Allahu i neposlušnost roditeljima.",
      },
    ],
    actions: ["Pozovite ili posjetite roditelje ove sedmice sa lijepom riječju."],
    appLinks: [{}],
  },
  {
    title: "Krađa",
    summary: "Protuzakonito oduzimanje tuđe imovine — narušava povjerenje i poziva na kaznu.",
    body: [
      "Definicija: Krađa (sariqah) je oduzimanje tuđeg bogatstva ili imovine bez prava – bilo da se radi o prikrivanju, pronevjeri, prijevari ili bilo kakvom prikrivenom oduzimanju onoga na što neko nema pravo.",
      "Zašto je to teško: krši i prava ljudi i povjerenje od kojeg zavisi zajednički život. Njenu ozbiljnost naglašava propisana kazna koju Kur'an spominje za kvalificirane slučajeve (5:38) — kazna zaštićena strogim uvjetima i visokim dokaznim standardima, tako da sama njena strogost služi uglavnom kao snažno sredstvo odvraćanja koje čuva imovinu ljudi. Cilj islama je društvo u kojem se ljudi osjećaju sigurno sa svojim stvarima.",
      "Njegova moderna lica: krađa nije ograničena na provalu u kuću. To uključuje oduzimanje od poslodavca, varanje u poslovanju, uskraćivanje plata radnicima, digitalnu pirateriju, plagijat i iskorištavanje onoga što po zakonu nije vlastito. Ono što je skriveno od drugih ljudi nikada nije skriveno od Allaha, koji vidi svako privatno oduzimanje.",
      "Put povratka: budući da se radi o ljudskom pravu, pokajanje zahtijeva više od kajanja pred Allahom. Mora se vratiti sam ukradeni predmet, odnosno njegova vrijednost, njegovom zakonitom vlasniku i tražiti njihov pomilovanje gdje je to moguće; ako se vlasnik ne može pronaći, naučnici savjetuju da iznos daju u dobrotvorne svrhe u njihovo ime. Otpuštena na ovaj način, čak i krađu u potpunosti oprašta Onaj koji voli slugu koji se vratio.",
    ],
    quran: [
      {
        excerpt:
          "Što se tiče lopova, muško i žensko, odsjekli su svoje ruke u nadoknadu za ono što su zaradili - što je odvraćanje od Allaha.",
      },
    ],
    actions: [
      "Vratiti ukradene predmete ili njihovu vrijednost; tražite oprost od onih kojima je učinjena nepravda.",
    ],
    appLinks: [{}],
  },
  {
    title: "Opojna sredstva",
    summary: "Vino i opojna sredstva - progresivno i odlučno zabranjeni u Kur'anu.",
    body: [
      "Definicija: Khamr je sve što opija i zamagljuje intelekt - vino i sav alkohol, a prema Poslanikovom vlastitom principu, svaka opojna supstanca bez obzira na njen oblik ili ime. 'Svako opojno sredstvo je khamr, a svaki khamr je zabranjeno.'",
      "Zašto je to teško: um je sposobnost po kojoj osoba poznaje Allaha, razlikuje dobro od zla i čuva svaku drugu odgovornost. Opojna sredstva upravo to razgrađuju, zbog čega ih Kur'an stavlja u zagrade idolima i kockanjem kao 'skvrnom od djela šejtana' i naređuje, 'izbjegavajte ih' (5:90). Osim pojedinca, oni uništavaju zdravlje, porodice i sigurnost i otvaraju vrata grijesima kojima trezna osoba nikada ne bi pristupila.",
      "Mudrost o tome kako je zabranjeno: Allah nije zabranio khamr u jednom naglom potezu, već ga je zabranio u fazama, nježno odvikujući ranu zajednicu od duboko ukorijenjene navike. Ta postupnost je sama po sebi lekcija o milosrđu - i model nade za svakoga ko se danas bori da je napusti.",
      "Put povratka, sa saosjećanjem: one koji su uhvaćeni u ovisnosti ne treba prezirati već ih podržavati. Pokajanje znači odlučiti napustiti supstancu, ukloniti je i njene okidače iz svog života, tražiti pomoć i liječenje bez stida, i ispuniti prazninu dobrim društvom, zikrom i obožavanjem. Allahova vrata su širom otvorena, i svaki iskreni korak od opojnih droga je korak koji On pozdravlja.",
    ],
    quran: [
      {
        excerpt:
          "O vi koji vjerujete, zaista su vino, kocka, idoli i gatačke strijele nečistoća od djela šejtana - izbjegavajte ih.",
      },
    ],
    hadith: [
      {
        excerpt: "Svako opojno sredstvo je khamr, a svaki khamr je zabranjen.",
      },
    ],
    actions: ["Potražite pomoć ako je potrebno; zamijenite naviku zikrom i dobrim društvom."],
    appLinks: [{}],
  },
];

export const JAHANNAM_NAMES_BS: DeepPartial<JahannamNameEntry>[] = [
  {
    name: "Pakao",
    meaning: "Vatra — najčešće kur'ansko ime za pakao.",
    quran: {
      excerpt: "Bojte se Vatre čije su gorivo ljudi i kamenje, pripremljeno za nevjernike.",
    },
    context:
      "Koristi se u cijelom Kur'anu kao mjesto za kaznu za one koji odbacuju vjeru i ustraju u nedjelima.",
    tafsirNote:
      "Ibn Kathir napominje da je Jahannam sveobuhvatni naziv za Vatru pripremljen kao upozorenje i posljedica.",
    scholarlyNote:
      "Neki naučnici raspravljaju o tome da li je Jahannam cijeli pakao ili određeni nivo - pogledi se razlikuju.",
  },
  {
    name: "Jaheem",
    meaning: "Blazing Fire — intenzivna, žestoka vrućina.",
    quran: {
      excerpt: "Vi i ono čemu se klanjate mimo Allaha ste gorivo za Džehennem - ući ćete u njega.",
    },
    context: "Opisuje jačinu Vatre koja čeka one koji su vodili suparnike sa Allahom.",
    tafsirNote: "Al-Tabari povezuje jaheem sa plamtećom, zapaljenom vatrom koja ne štedi ništa.",
  },
  {
    name: "Saqar",
    meaning: "Ono što prži ili ne ostavlja ništa - jaka vrućina.",
    quran: {
      excerpt: "Ja ću ga odvesti u Saqar. A šta vas može natjerati da znate šta je Saqar?",
    },
    context: "Spominje se u suri al-Muddaththir u vezi sa onim ko se okrenuo od objave.",
    tafsirNote:
      "Klasični tefsir opisuje Saqar kao nivo pakla koji intenzivno gori; detalji se razlikuju među naučnicima.",
    scholarlyNote:
      "Da li je Saqar poseban nivo ili naziv za pakao sveukupno raspravlja se u tefsiru - nije eksplicitno u jednom dogovorenom tekstu.",
  },
  {
    name: "Sa'ir",
    meaning: "Plamteći — zapaljena vatra.",
    quran: {
      excerpt: "Oni će biti u Sa'iru - plamenoj vatri.",
    },
    context: "Upozorenje onima koji nepravedno troše bogatstvo siročad.",
    tafsirNote: "Korijen prenosi gori i paljenje - naglašavajući aktivnu, proždiruću vatru.",
  },
  {
    name: "Hutamah",
    meaning: "Crusher — ono što lomi i drobi.",
    quran: {
      excerpt: "Bit će bačen u al-Hutamu. A šta vas može natjerati da znate šta je al-Hutamah?",
    },
    context: "Kazna za onog ko zagriza i gomila bogatstvo, misleći da će ga to učiniti besmrtnim.",
    tafsirNote: "Ibn Kathir objašnjava da Hutama gnječi i proždire - vatru koju je zapalio Allah.",
  },
  {
    name: "Hawiyah",
    meaning: "Ponor ili jama - dubok pad.",
    quran: {
      excerpt: "Što se tiče onoga čija je vaga lagana - njegovo utočište će biti Havija.",
    },
    context: "Odredište onih čija su dobra djela previše lagana na Sudnjem danu.",
    tafsirNote:
      "Opisan kao duboka jama u Vatri; al-Tabari bilježi stavove o njegovoj dubini i ozbiljnosti.",
    scholarlyNote:
      "Neki tefsir radovi navode Haviju kao poseban nivo - citirajte kao naučnu interpretaciju.",
  },
  {
    name: "Lazaa",
    meaning: "Plamen — plamena vatra.",
    quran: {
      excerpt: "Nikako! To je Allahov plamen, zapaljen.",
    },
    context: "Sura al-Ma'aridž - upozoravajući one koji poriču Čas.",
    tafsirNote: "Povezan sa plamenom koji se skida i sagoreva — Lazaa naglašava aktivno plamtenje.",
  },
];

export const JAHANNAM_GATES_BS: DeepPartial<JahannamGateEntry>[] = [
  {
    quranNote:
      "Allah kaže da Džehennem ima sedam kapija; svaka kapija ima određeni dio onih koji ulaze (15:44).",
    scholarlyNote:
      "Neki kasniji tefsirski radovi povezuju kapije sa kategorijama grešnika. Ovi zadaci nisu ujednačeni u ranim izvorima – prisutni kao interpretacija.",
  },
  {
    quranNote:
      "Kur'an potvrđuje sedam kapija zajedno; ne imenuje svaku kapiju u eksplicitnom otkrovenju.",
    scholarlyNote: "Ibn Kathir govori o tome da je podjela Allahovom mudrošću i pravdom.",
  },
  {
    quranNote:
      "Sedam kapija — jasna tekstualna činjenica. Detalji o stanarima svake kapije su uglavnom naučna rasprava.",
  },
  {
    quranNote: "Stih naglašava proporcionalnu dodjelu - svaka kapija ima svoj određeni udio.",
  },
  {
    quranNote:
      "Vjernici su upozoreni kako bi mogli izbjeći ono što vodi do ovih vrata kroz pokajanje.",
  },
  {
    quranNote: "Pakao je spreman - upozorenje je stvarno. Zaštita je kroz vjeru i pravedna djela.",
  },
  {
    quranNote:
      "Sedam kapija, jedna Vatra — jedinstvo upozorenja sa različitošću u tome kako su grešnici grupirani božanskom mudrošću.",
    scholarlyNote:
      "Izbjegavajte podučavanje specifičnih mapiranja od grijeha do vrata kao proročanske činjenice osim ako ne citirate imenovani naučni rad.",
  },
];

export const JAHANNAM_VERSES_BS: DeepPartial<JahannamVerseEntry>[] = [
  {
    excerpt: "Bojte se Vatre pripremljene za nevjernike.",
    context: "Upućeno vjernicima — strah kao motivacija za poslušnost.",
    tafsirSummary: "Ibn Kathir: poziv na taqwa uparen s pokornošću Poslaniku.",
  },
  {
    excerpt: "Ne očajavajte u Allahovoj milosti. Zaista, Allah oprašta sve grijehe.",
    context: "Otkriveno da utješi one koji su se bojali da su njihovi grijesi preveliki.",
    tafsirSummary: "Stih temeljac nade - milosrđe je ogromno za one koji se vraćaju.",
  },
  {
    excerpt:
      "Pokajte se Allahu iskrenim pokajanjem - možda će vaš Gospodar otkloniti vaša nedjela.",
    context: "Zapovijed vjernicima nakon uputstva o porodici i ponašanju.",
    tafsirSummary: "Nasuh tawbah — iskreno pokajanje bez povratka na grijeh.",
  },
  {
    excerpt: "Za sve će postojati stepeni prema onome što su radili.",
    context: "Božanska pravda - nagrada i kazna srazmerno delima.",
    tafsirSummary: "Stepeni se odnose i na raj i na pakao.",
  },
  {
    excerpt: "Allah uopće ne čini nepravdu ljudima, već ljudi nepravdu sami sebi.",
    context: "Uvjeravanje da je božanska presuda savršeno pravedna.",
  },
  {
    excerpt: "Gospodaru naš, daj nam dobro na oba svijeta i zaštiti nas od vatrene kazne.",
    context: "Dova onih koji spajaju ovosvjetsko i onostrano dobro.",
    tafsirSummary: "Poslanička dova koja se uči u Kur'anu - ravnoteža dunja i akhire.",
  },
  {
    excerpt: "Pakao ima sedam kapija; za svaku kapiju je dodijeljen dio.",
    context: "Obrađeno u kontekstu Ibrahimove rasprave sa svojim narodom.",
    tafsirSummary: "Eksplicitno spominjanje sedam kapija — detalji zadatka su božanska mudrost.",
  },
  {
    excerpt: "Osim onih koji se kaju, vjeruju i čine dobra djela - Allah će zamijeniti zlo dobrim.",
    context: "Izuzetak nakon navođenja teških grijeha.",
    tafsirSummary: "Nada za pokajnika - djela se mogu preobraziti milošću.",
  },
  {
    excerpt: "Za one koji nisu vjerovali u svog Gospodara kazna je Džehennema - zla destinacija.",
    context: "Sura al-Mulk — podsjetnik na nevidljivo.",
  },
  {
    excerpt: "Zaista, dobra djela otklanjaju zla djela.",
    context: "Zapovijed za uspostavljanje molitve na oba kraja dana.",
    tafsirSummary: "Ohrabrenje da dosledno obožavanje briše prošle greške.",
  },
  {
    excerpt: "Gospodaru naš, oprosti nam naše grijehe i zaštiti nas od kazne vatre.",
    context: "Opis muttaqina (svjestan Boga).",
  },
  {
    excerpt: "Što se tiče onoga čija je vaga lagana - njegovo utočište će biti Havija.",
    context: "Sura al-Qari'ah — vaganje djela.",
  },
];

export const JAHANNAM_HADITH_BS: DeepPartial<JahannamHadithEntry>[] = [
  {
    hadith: {
      excerpt:
        "Ko tri puta zamoli Allaha za Džennet, Džennet kaže: O Allahu, uvedi ga u Džennet! Ko se tri puta skloni od Vatre, Vatra kaže: O Allahu, zaštiti ga od Vatre!",
    },
    context: "Ohrabrenje da se redovno čini dova za Džennet i utočište od Džehannama.",
  },
  {
    hadith: {
      excerpt:
        "Allah je više zadovoljan pokajanjem Svoga roba nego onaj od vas koji nađe svoju izgubljenu goru u neplodnoj zemlji.",
    },
  },
  {
    hadith: {
      excerpt:
        "Niko od vas neće ući u Džennet samo svojim djelima - čak ni ja, osim ako me Allah ne pokrije svojom milošću.",
    },
    context: "Ravnoteža: trudite se u djelima, ali se oslonite na milost.",
  },
  {
    hadith: {
      excerpt:
        "Vaša vatra je jedan dio od sedamdeset dijelova vatre pakla, svaki dio je poput svoje topline.",
    },
  },
  {
    hadith: {
      excerpt: "Savez između nas i njih je molitva; ko ga napusti počinio je nevjerovanje.",
    },
    context: "Ozbiljnost zanemarivanja namaza - među najtežim upozorenjima.",
  },
  {
    hadith: {
      excerpt:
        "Onaj bankrot dolazi sa molitvom, postom i dobročinstvom - ali je vređao, klevetao, nezakonito trošio bogatstvo i prolivao krv.",
    },
    context: "Prava ljudi mogu se riješiti prije djela na Sudnji dan.",
  },
  {
    hadith: {
      excerpt:
        "Allah pruža svoju ruku noću da prihvati pokajanje grešnika tog dana, a pruža ruku danju da prihvati pokajanje noćnog grešnika.",
    },
  },
  {
    hadith: {
      excerpt: "Ko vjeruje u Allaha i u Sudnji dan neka govori dobro ili neka šuti.",
    },
    context: "Čuvanje jezika — svakodnevna odgovornost.",
  },
];

export const JAHANNAM_REFLECTIONS_BS: DeepPartial<JahannamReflectionEntry>[] = [
  {
    question: "Jesam li danas nekome učinio nepravdu - govorom, djelima ili zanemarivanjem?",
  },
  {
    question: "Da li sam danas tražio oprost od Allaha – iskreno i više puta?",
  },
  {
    question: "Jesam li čuvao svoj jezik od psovanja, laži i sprdnje?",
  },
  {
    question: "Jesam li se molio na vrijeme i uz prisustvo?",
  },
  {
    question: "Da li sam napravio korak da se pomirim sa nekim koga sam otuđio?",
  },
  {
    question: "Jesam li danas dao milostinju ili dobrotu - čak i nešto malo?",
  },
  {
    question: "Da li sam danas čitao ili slušao Kur'an?",
  },
];

export const JAHANNAM_REFERENCES_BS: DeepPartial<JahannamReferenceEntry>[] = [
  {
    title: "Kur'an",
    note: "Primarni izvor za imena, upozorenja, milost i pokajanje. Prijevodi variraju; konsultujte arapski za preciznost.",
  },
  {
    title: "Sahih al-Bukhari i Sahih Musliman",
    note: "Kanonske zbirke hadisa koje se citiraju u ovom modulu gdje se ocjenjuju sahihom.",
  },
  {
    title: "Tefsir Ibn Kesir",
    note: "Referentno za kontekst o imenima pakla i glavnim stihovima upozorenja — naučna interpretacija.",
  },
  {
    title: "Tafsir al-Tabari",
    note: "Rani sveobuhvatni tefsir — koristan za razumijevanje klasičnih pogleda na Džehannam.",
  },
  {
    title: "Gdje se učenjaci razlikuju",
    note: "Tačni nivoi pakla, zadaci kapija i neka značenja imena raspravljaju se među naučnicima - što nije uvijek eksplicitno u otkrivenju.",
  },
];

export const JAHANNAM_DUAS_BS: DeepPartial<JahannamDuaEntry>[] = [
  {
    context: "Tražite dobro na oba svijeta i zaštitu od Vatre — Kur'anska dova.",
  },
  {
    context: "Poslije tešehhuda: tražite Džennet i utočište od Vatre.",
  },
  {
    context: "Jutarnji spomen: utočište od kaburske i vatrene kazne.",
  },
];

export const JAHANNAM_REFUGE_DUA_BS: { translation: string } = {
  translation:
    "O Allahu, utječem Ti se od džehennemske kazne, kaburske kazne, životnih i smrtnih iskušenja i zla iskušenja Lažnog Mesije.",
};
