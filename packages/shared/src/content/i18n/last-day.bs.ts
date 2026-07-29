// Bosnian translation overlay for the Learn "The Last Day" content. Mirrors the order of
// its English source in ../last-day*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  LastDayHadithEntry,
  LastDayQuizQuestion,
  LastDayReferenceEntry,
  LastDayTimelineEvent,
  LastDayTopic,
  LastDayVerseEntry,
} from "../../types/last-day";
import type { DeepPartial } from "./localize";

export const LAST_DAY_TOPICS_BS: DeepPartial<LastDayTopic>[] = [
  {
    title: "Uvod",
    summary: "Šta je posljednji dan i zašto mijenja način na koji živimo danas?",
    body: [
      "Yawm al-Qiyamah — Dan stajanja, proživljenja i Suda — je dan kada se svaka duša vraća Allahu da joj se pokažu svoja djela i da joj se konačno prebiva. To nije neka daleka legenda ili poetska slika. Kur'an ga spominje na gotovo svakoj stranici, a u najranijim mekanskim surama dominira upravo zato što vjerovanje u njega preuređuje cijeli život čovjeka. Kada zaista očekujete da ćete stati pred Allaha, poštenje, molitva, dobrota i suzdržanost prestaju biti neobavezni ukrasi i postaju suština onoga što jeste.",
      "Ovaj modul hoda fazu po etapu: smrt i odlazak duše, interval barzaka u grobu, manji i glavni znakovi koji prethode Satu, duvanje u trubu, vaskrsenje tijela, okupljanje na jednoj prostranoj ravnici, predaja zapisa, skala, vaga, međusobna računanja i profrekvencija. Most, i konačno dva večna doma — raj i pakao. Svaka faza je izvučena iz Kur'ana i vjerodostojnih hadisa.",
      "Ovdje svime upravljaju dva principa. Prvo, stvarnost ovih događaja je izvjesna i stvar je vjere (aqeedah); poricati vaskrsenje ili odgovornost znači poricati samu religiju. Drugo, tačno vrijeme Sata je poznato samo Allahu - nijedan učenjak, kalendar ili proračun to ne mogu predvidjeti, a svaka tvrdnja o datumu je lažna. Poslanik, sallallahu alejhi ve sellem, nikada nije dao svojim drugovima odbrojavanje; dao im je način da žive. Dakle, cilj proučavanja Posljednjeg dana je priprema, a ne predviđanje: omekšati srce, ispraviti prioritete i juriti ka dobru prije nego što dođe određeni trenutak.",
      "Napomena o izvorima: popularni razgovori o 'znakovima kraja vremena' puni su slabih, pa čak i izmišljenih naracija. Ovaj modul uključuje samo ono što je autentično i gdje se iskreni sunitski učenjaci istinski razlikuju - na primjer po redoslijedu nekih glavnih znakova - ta razlika je predstavljena kao razlika, a ne izglađena ili preuveličana.",
    ],
    quran: [
      {
        excerpt:
          "Kada se zemlja potrese svojim posljednjim potresom, i izbacuje svoje breme, a čovjek plače: Šta je s njom? — tog dana će objaviti svoje vijesti, jer ga je vaš Gospodar nadahnuo. Tog Dana ljudi će otići u odvojenim grupama da im pokažu svoja djela; tako da ko god čini atomsku težinu dobra vidjet će to, a ko god čini težinu atoma zla vidjet će to.",
      },
      {
        excerpt:
          "On stavlja nadahnuće Svoje naredbe na koga želi od svojih robova da upozore na Dan sastanka - Dan kada izađu, a od Allaha ništa u vezi s njima nije skriveno. Kome pripada suverenitet ovog dana? Allahu, Jednom, Prevladavajućem.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Zašto vjerovati u posljednji dan?",
    summary: "Jedan od šest članova vjere — motivacija, nada i konačna pravda.",
    body: [
      "Vjerovanje u posljednji dan je jedan od šest članova imana koje je Poslanik, sallallahu alejhi ve sellem, nazvao kada je melek Džibril došao da podučava vjeru: vjerovati u Allaha, Njegove meleke, Njegove knjige, Njegove poslanike, Posljednji dan i u božansku odredbu, njegovu korist i štetu (Sahih Musliman 8). Bez ovog vjerovanja cijela struktura odgovornosti se urušava – jer ako nema povratka Allahu, tada će tiranin i svetac završiti isto, a svaki čin ibadeta postaje navika bez konačnog značenja.",
      "Kur'an se zalaže za posljednji dan i moralno i racionalno. Moralno: to je odgovor na nepravdu, jer svijet u kojem tlačitelji udobno umiru u svojim krevetima, a potlačeni umiru neosvećeni ne može biti kraj priče ako je Allah zaista pravedan. Racionalno: Onaj koji vas je iz ničega stvorio prvi put nije nesposoban da vas obnovi i drugi put (Kur'an 36:78–79). Uskrsnuće je lakše, a ne teže, od prvobitnog stvaranja.",
      "Ovo vjerovanje također disciplinuje dva motora srca - strah i nadu - i održava ih u ravnoteži. Upozorenja su stvarna, tako da vjernik ne postaje arogantan ili nemaran; ipak je Allahova milost ogromna i vrata pokajanja ostaju otvorena do smrti, tako da vjernik nikada ne očajava. Srce koje živi između straha i nade je srce koje neprestano teži bez sloma.",
      "Praktično, posljednji dan daje dostojanstvo nemoćnima i suzdržanost moćnima. Ona poručuje oštećenima da Allah ne zaboravlja nijednu povredu, a jakima poručuje da ih nikakvo bogatstvo, status ili uticaj neće zaštititi od obračuna. Vjerovanje u to stoga nije privatna udobnost, već izvor pravde, strpljenja i integriteta na ovom svijetu.",
    ],
    quran: [
      {
        excerpt:
          "Pravedan je u tome da okrenete lica prema istoku ili zapadu, nego je pravedan onaj koji vjeruje u Allaha, Sudnji dan, meleke, Knjigu i poslanike, i daje imetak, uprkos ljubavi prema njemu, rođacima, siročadi, potrebitima, putnicima i onima koji traže.",
      },
      {
        excerpt:
          "Nikada nemoj misliti da Allah nije svjestan onoga što zulumćari rade. Odgađa ih samo za jedan Dan kada će oči zuriti užasnuto.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Iman je da vjerujete u Allaha, Njegove meleke, Njegove knjige, Njegove poslanike, Posljednji dan, i da vjerujete u božansku odredbu, njenu dobrobit i štetu. - iz hadisa Džibrila, kada je došao da podučava vjeru.",
      },
    ],
    actions: [
      "Obnavljajte svoju namjeru svaki dan: moja djela su za Allaha i za Dan kada ću ga sresti.",
      "Kada vas boli nepravda i nijedan zemaljski sud ne odgovara, povjerite to Sudu posljednjeg dana.",
      "Čuvajte strah i nadu zajedno – nemojte dozvoliti da vas strah zgnječi u očaj niti da vas nada uljuljka u zanemarivanje.",
    ],
    appLinks: [{}],
  },
  {
    title: "Smrt",
    summary: "Svaka duša će okusiti smrt - husn al-khatimah i ono što koristi pokojniku.",
    body: [
      "Smrt je jedan sastanak koji niko ne propušta. Kur'an to jasno kaže: svaka duša će okusiti smrt, a puna nadoknada se daje samo na Kijametskom danu (Kur'an 3:185). Smrt nije uništenje, već transfer – duša napušta tijelo i prelazi na sljedeću fazu svog putovanja. Melek smrti, kojeg je Allah povjerio, uzima dušu, a zatim se vraćate svome Gospodaru (Kur'an 32:11).",
      "Budući da je način smrti bitan, vjernik radi ka dobrom kraju — husn al-khatimah — kroz iskreno pokajanje, postojanu molitvu i dobar karakter, nadajući se da će umrijeti u stanju kojim je Allah zadovoljan. Lošeg završetka — su' al-khatima — se plaši osoba koja ustraje u grijehu i okrene se bez pokajanja. Ipak, milost u tome je ogromna: vrata tevbe ostaju otvorena sve dok samrtni zveckanje ne dođe do grla, tako da niko nikada ne bi trebao zaključiti da je prekasno dok dah ostaje.",
      "Poslanik, sallallahu alejhi ve sellem, učio je često sjećanje na smrt — 'Sjećaj se često razarača zadovoljstava', što znači smrt (Džami' at-Tirmizi 2307, hasan) - ne da bi nas učinio morbidnim, već da bi nas održao budnima. Sjećanje na smrt smanjuje stisak ovog svijeta, rastvara ljutnje i preuređuje ono što je zapravo važno. Pojedinosti o odlasku duše koji se pojavljuju samo u slabim izvještajima najbolje je ostaviti po strani; autentični materijal je dovoljan da unese strahopoštovanje i spremnost.",
      "Smrt takođe zatvara knjigu dela - sa tri izuzetka. Poslanik, sallallahu alejhi ve sellem, je rekao da kada osoba umre njena djela se prekidaju osim tri: stalna dobročinstva (sadaqah jariyah), znanje koje nastavlja da koristi, i pravedno dijete koje moli za njega (Sahih Musliman 1631). Ovo je duboko praktično: to znači da ono što gradite, podučavate i odgajate dok ste živi, ​​može zarađivati ​​za vas dugo nakon što vas nema.",
    ],
    quran: [
      {
        excerpt:
          "Svaka duša će okusiti smrt, a potpuna nadoknada će vam biti data tek na Sudnjem danu. Dakle, onaj ko je odvučen od Vatre i primljen u Džennet je uspio. A život ovog svijeta je samo uživanje u zabludi.",
      },
      {
        excerpt:
          "Reci: Anđeo smrti, koji vam je povjeren, odvest će vas; tada ćete svome Gospodaru biti vraćeni.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kada osoba umre, njena djela se završavaju osim za tri: stalna dobročinstva, znanje iz kojeg se stiče korist ili pravedno dijete koje se moli za njega.",
      },
      {
        excerpt: "Često se setite razarača zadovoljstava - što znači smrti.",
      },
    ],
    actions: [
      "Povećajte istighfar i molite se na vrijeme – posebno dok ste zdravi i zaposleni, a ne samo kada ste bolesni.",
      "Pokajte se danas za bilo šta konkretno što odgađate; ne kockaj se sutra.",
      "Uložite u tri trajna djela: gradite stalnu dobročinstvo, širite korisno znanje i odgajajte djecu na tevhidu i dobrom karakteru.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Barzak (život u grobu)",
    summary: "Interval nakon smrti do uskrsnuća - ispitivanje i njegove posljedice.",
    body: [
      "Barzak znači barijera, i to je naziv za čitav interval između smrti osobe i Dana uskrsnuća. Kur'an koristi riječ kada mrtvi prestupnik moli da se vrati: 'Iza njih je barijera (barzak) do Dana uskrsnuća' (Kur'an 23:100) - čvrsti zid kroz koji nema povratka u ovaj život. Bilo da je tijelo zakopano, spaljeno, utopljeno ili izgubljeno, duša ulazi u barzak; kabur je jednostavno njegov najčešći oblik i prva faza ahireta za svakog čovjeka.",
      "Autentični izvještaji opisuju ispitivanje nakon sahrane. Dolaze dva meleka i pokojniku postavljaju tri pitanja: Ko je tvoj Gospodar? Koja je tvoja religija? Ko je ovaj čovjek koji vam je poslan? Vjernik kojeg Allah drži čvrsto odgovara: Moj Gospodar je Allah, moja vjera je Islam, a ovo je Muhammed, sallallahu alejhi ve sellem; grob je zatim proširen i zapaljen za njega. Onaj koji je bio nepažljiv kaže: 'Ah, ne znam' i naiđe na stezanje (Džami' at-Tirmizi 1071, hasan, gdje se dva meleka zovu Munkar i Nakir). Zbog toga Kur'an hvali Allaha što je vjernike držao čvrstim 'čvrstom riječju na dunjaluku i na ahiretu' (Kur'an 14:27).",
      "Zatim u kaburu slijedi blaženstvo ili kazna, što je potvrđeno u autentičnim tekstovima: 'Kabur je ili bašta iz džennetskih vrtova ili jama iz vatrenih jama' (Džami' at-Tirmizi 2460, hasan sahih). Kur'an aludira na kažnjavanje faraonovog naroda koji je bio izložen vatri 'jutro i uveče' prije nego što Sat i dođe (Kur'an 40:46). Ehli-sunnet potvrđuje realnost teške nagrade i kazne, a prepušta njegovu tačnu prirodu Allahu, budući da pripada nevidljivom i ne može je opaziti živi.",
      "Postoji saglasnost da su grobno ispitivanje i grobno blaženstvo ili muka stvarni; naučnici raspravljaju o finijim tačkama - kao što je da li dodiruje tijelo, dušu ili oboje, i kako dopire do onih koji nemaju običan grob - ne dopuštajući da ta pitanja odvrate pažnju od teme. Barzak je veliki motivator: pretvara grob iz rupe u zemlji u ogledalo sopstvenih dela, i jasno stavlja do znanja da će vas tamo dočekati ono što šaljete unapred.",
    ],
    quran: [
      {
        excerpt:
          'Sve dok jednom od njih ne dođe smrt, ne kaže: "Gospodaru moj, pošalji me nazad, da činim pravednost u onome što sam ostavio." Ne! To je samo riječ koju on izgovara; a iza njih je barijera do Dana uskrsnuća.',
      },
      {
        excerpt:
          "Vatra — izloženi su joj ujutro i uveče. I onog dana kada se pojavi čas reći će se: Pustite faraonov narod na najstrožu kaznu.",
      },
    ],
    hadith: [
      {
        excerpt: "Mezar je ili bašta iz džennetskih vrtova ili jama iz vatrenih jama.",
      },
      {
        excerpt:
          "Kada se pokojnik sahrani, dođu mu dva meleka i pitaju ga: Ko je tvoj Gospodar? Koja je tvoja religija? Ko je tvoj prorok? Vjernik sa sigurnošću odgovara i kabur mu je proširen i osvijetljen.",
      },
    ],
    misconceptions: [
      "Zabluda: Teška kazna je narodno vjerovanje bez osnova. Ispravka: Stvarnost ispitivanja i kaburskog blaženstva ili muke utvrđena je u autentičnom hadisu i aludirana u Kur'anu; to je utvrđena tačka sunitskog vjerovanja.",
      "Zabluda: Trebalo bi da se raspravljamo oko tačnog izgleda i imena anđela. Ispravka: Imena Munkara i Nakira dolazi u hasan izvještaju; osnovno uverenje je samo ispitivanje. Pripremanje da se na njega odgovori istinito je mnogo važnije od rasprave o njegovim detaljima.",
    ],
    actions: [
      "Čvrsto se držite tevhida i sunneta sada - odgovori na kaburu se ne pamte tamo, već su ovdje živjeli.",
      "Čuvajte jutarnji i večernji adhkar, koji je Poslanik, sallallahu alejhi ve sellem, učio kao zaštitu i postojanost.",
    ],
    appLinks: [{}],
  },
  {
    title: "Znakovi posljednjeg dana",
    summary: "Manji i glavni znakovi — izvjesnost sata, nepoznato vrijeme.",
    body: [
      "Dolazak Časa je siguran, ali njegovo vrijeme je tajna koju je Allah zadržao za Sebe. Kada su čak i Poslanika, sallallahu alejhi ve sellem, upitali kada će doći, dat je odgovor da onaj koji je pitan ne zna više od onoga koji pita – njegovo znanje je samo kod Allaha (Kur'an 7:187). Dakle, prva stvar koju treba riješiti prije proučavanja bilo kojeg 'znaka' je ovo: znakovi su dati da nas pripreme, a nikada da nam ne dopuste da izračunamo datum. Svako ko imenuje godinu za Sat je u suprotnosti s Kur'anom.",
      "Naučnici grupišu predznake u dvije vrste. Manji znakovi (al-'alamat al-sughra) su postepene društvene, moralne i svjetovne promjene koje se gomilaju tokom dugih stoljeća prije kraja. Glavni znakovi (al-'alamat al-kubra) su skup izvanrednih, nepogrešivih događaja koji se približavaju pri samom kraju. Kur'an bilježi da su 'neki od njegovih znakova već došli' (Kur'an 47:18) - što se podrazumijeva da uključuje dolazak samog Poslanika, sallallahu alejhi ve sellem, i rascjep mjeseca.",
      "Osnovni tekst za glavne znakove je hadis Huzajfe ibn Usejda, u kojem je Poslanik, sallallahu alejhi ve sellem, naveo deset: dim (Dukhan), Dedžal, Zvijer zemaljska (Dabbat al-Ard), izlazak sunca sa mjesta zalaska (zapad), silazak 'Ibyamsa i Yajsa i Yajsa' Magog), i tri velika klizišta - jedno na istoku, jedno na zapadu i jedno na Arapskom poluostrvu - zapečaćena vatrom koja tjera ljude do mjesta njihovog okupljanja (Sahih Musliman 2901). Al-Mahdi i Dedžal dolaze u drugim vjerodostojnim izvještajima i nalaze se prije silaska Isaa.",
      "Iskren naučni stav je da, iako je svaki znak potvrđen, njihov tačan redosled nije u potpunosti fiksiran u tekstovima, a ugledni sunitski učenjaci se razlikuju oko preciznog niza. Ta razlika je normalan dio tradicije i nema razloga za spor. Proročki odgovor na sve to nije izazivanje straha ili beskrajna spekulacija o trenutnim događajima, već povećan iman, pokajanje i blagotvorno djelovanje.",
    ],
    quran: [
      {
        excerpt:
          "Pitaju vas za Sat: kada dolazi? Reci: Njegovo znanje je samo kod mog Gospodara. Niko neće otkriti svoje vrijeme osim Njega. Teška leži na nebesima i zemlji. Neće vam se dogoditi osim neočekivano.",
      },
      {
        excerpt:
          "Da li čekaju osim da ih čas dođe iznenada? Neki od njegovih znakova su već došli. Ali kako će ih se podsjetiti kada ih to zadesi?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sat neće doći sve dok ne vidite deset znakova pred njim: dim, Dedžala, Zvijer, izlazak sunca sa zapada, silazak Isa, sina Merjemina, Ya'juja i Ma'juja, tri klizišta - jedno na istoku, jedno na zapadu i jedno na Arapskom poluostrvu - i njihovo posljednje od njih tjera na vatru.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Manji znakovi",
    summary:
      "Postepene promjene koje je Poslanik, sallallahu alejhi ve sellem, opisao — priprema nad panikom.",
    body: [
      "Manji znakovi su spore, kumulativne promjene u društvu, moralu i stanju znanja koje je Poslanik, sallallahu alejhi ve sellem, opisao da se povećavaju što se bliži Sat. Njih je mnogo i po svojoj prirodi se odvijaju u dugim vremenskim razmacima, a ne u jednom dramatičnom trenutku. Najveći manji znak od svih se, zapravo, već dogodio: slanje samog Poslanika Muhammeda, sallallahu alejhi ve sellem, koji je rekao: 'Ja i Čas smo poslani kao ova dva', spojivši svoja dva prsta - što znači da je posljednji glasnik i konačno doba počelo.",
      "Među znakovima navedenim u vjerodostojnom hadisu: gubitak pouzdanosti, tako da se poslovi predaju onima koji su za njih nepodobni - 'Kada se povjerenje izgubi, onda čekajte čas', a to se dešava 'kada se vlast daje onima koji je ne zaslužuju' (Sahih al-Buhari 6496). U poznatom hadisu o Džibrilu, Poslanik, sallallahu alejhi ve sellem, je naveo dva živopisna znaka: 'da će robinja roditi svoju gospodaricu i da ćete vidjeti bosonoge, gole, siromašne pastire kako se takmiče u izgradnji visokih zgrada' (Sahih Musliman 8).",
      "Drugi uključuju opće ubrzanje osjećaja vremena, porast zemljotresa i ubijanja i nestanak znanja. Što se tiče znanja, Poslanik, sallallahu alejhi ve sellem, je bio precizan u vezi s mehanizmom: 'Sat neće biti uspostavljen sve dok se znanje ne oduzme, zemljotresi se povećaju, vrijeme brzo prolazi, nevolje se pojavljuju, a ubijanje se povećava' (Sahih al-Bukhari 1036). I objasnio je kako znanje odlazi: 'Allah ne uklanja znanje otimanjem od ljudi, već oduzimanjem učenjaka, sve dok niko ne ostane, a ljudi uzmu neznalice za vođe od kojih se traži i daju presude bez znanja, pa oni zalutaju i druge odvode na krivi put' (Sahih al-Buhari 100). Dakle, 'gubitak znanja' nije nedostatak informacija – doba se može utopiti u podacima – već gubitak zdravih učenjaka i proživljene prakse.",
      "Ovdje je ključna disciplina: interpretativno je, a ne sigurno, izjaviti da je određeni moderni događaj „je“ određeni hadis ispunjen. Takmičenja u neboderima ili rastući kriminal mogu biti eho Poslanikovih riječi, ali pripisivanje otkrovenja naslovima s povjerenjem nije način na koji pažljivi učenjaci. Ispravan odgovor na svaki manji znak je iznutra: čitajte ga kao poziv da se vratite Allahu, da učite i postupate po vjeri, i da se čvrsto držite pouzdanosti i istinitosti - a ne kao materijal za tjeskobu ili spektakl.",
    ],
    hadith: [
      {
        excerpt:
          "Kada se povjerenje izgubi, čekajte Sat. Upitano je: Kako će biti izgubljeno, Allahov Poslaniče? Rekao je: Kada se da vlast onima koji je ne zaslužuju, čekajte Čas.",
      },
      {
        excerpt:
          "Među znakovima Časa: da će robinja roditi svoju gospodaricu i da ćete vidjeti bosonoge, gole, siromašne pastire kako se takmiče u izgradnji visokih zgrada. - iz hadisa Džibrila.",
      },
      {
        excerpt:
          "Allah ne uklanja znanje tako što ga otima, nego ga uklanja uzimajući učenjake, sve dok niko ne ostane i ljudi ne uzmu neznalice za vođe koji donose presude bez znanja, pa zalutaju i odvedu druge na krivi put.",
      },
    ],
    disclaimer:
      "Primjena specifičnih manjih znakova na određene trenutne događaje je interpretativno, a ne sigurno. Ovaj modul predstavlja vjerodostojan hadis bez tvrdnji koje moderne pojave ih definitivno ispunjavaju.",
    actions: [
      "Tražite korisno znanje od kvalifikovanih nastavnika, postupajte na osnovu njega i prenosite ga dalje - ovo se direktno opire znaku znanja koje nestaje.",
      "Čuvajte pouzdanost i istinitost u svom govoru, radu i ophođenju.",
      "Svaki znak u sebi čitajte kao poziv na pokajanje, a ne kao gorivo za paniku ili nagađanja na internetu.",
    ],
  },
  {
    title: "Glavni znakovi",
    summary: "Deset glavnih znakova u Sahihu Muslimu — Mahdi, Dedžal, Isa i drugi.",
    body: [
      "Glavni znakovi su veliki, nepogrešivi događaji koji se skupljaju pred sam kraj vremena. Njihova povelja je hadis Huzajfe ibn Usejda: Poslanik, sallallahu alejhi ve sellem, je gledao na svoje drugove koji su razgovarali o Satu i rekao da neće doći dok ne vide deset znakova - dim (Dukhan), Dedžala, Zemaljsku zvijer (Dabbat al-Ard), izlazak sunca sa zapada Merdžuja, Yab'Isa, Ma'džudž, tri klizišta (istočno, zapadno i u Arabiji), i konačno vatra koja tjera ljude na mjesto okupljanja (Sahih Musliman 2901). Za razliku od manjih znakova, kada ovi počnu, blisko slijede jedan za drugim.",
      "Al-Mahdi dolazi u vjerodostojnim izvještajima kao pravedni vođa iz Poslanikove kuće, sallallahu alejhi ve sellem, koji će ispuniti zemlju pravdom kao što je bila ispunjena ugnjetavanjem (Sunan Ebi Dawud 4282, hasan). On nije zakonodavac ili novi poslanik – on oživljava, on ne izmišlja – i vjerovanje u njega potvrđuje ehli-sunnet dok su dodatni detalji u slabim predajama stavljeni po strani.",
      "Dedžal (lažni mesija) je najveće iskušenje na svijetu. Poslanik, sallallahu alejhi ve sellem, ga je opširno opisao u dugom hadisu al-Nawwas ibn Sam'ana (Sahih Musliman 2937): jednooki varalica sa 'Kafir' ispisanim između očiju, dao moć da testira vjeru, na kojeg je svaki poslanik upozoravao svoj narod. Njegova fitna nije poražena argumentima već čvrstim uvjerenjem, a Poslanik, sallallahu alejhi ve sellem, je podučavao pamćenje početnih ajeta sure El-Kahf kao zaštitu.",
      "Isa ibn Merjam (alejhis-selam) će tada sići - čvrsta tačka sunitskog vjerovanja. Poslanik, sallallahu alejhi ve sellem, je rekao: 'Tako mi Onoga u čijoj je ruci moja duša, Merjemin sin će uskoro sići među vas kao pravedan vladar; on će slomiti krst, ubiti svinje i ukinuti džizju, a bogatstvo će preplaviti sve dok ga niko ne prihvati' (Sahih al-Buhari 3448). On silazi kao sljedbenik Muhammeda sallallahu alejhi ve sellem, klanja iza ummetovog imama (Sahih al-Bukhari 3439), ubija Dedžala i vlada po šerijatu Muhammeda sal. Ya'juj i Ma'juj su tada pušteni, a preostali znakovi se razvijaju do vatre koja okuplja čovječanstvo.",
      "Dvije tačke iskrenosti. Prvo, učenjaci se slažu oko stvarnosti svakog znaka u hadisu od deset znakova, ali se razlikuju u njihovom preciznom redoslijedu, a ta razlika je legitimna i stara. Drugo, Dukhan i Zvijer su dio samog sahih hadisa; neke druge naracije koje ih detaljno opisuju pojedinačno razlikuju se po snazi, tako da ovaj modul počiva na vjerovanju na izvještaj o jakim deset znakova, a ne na slabijim dodacima.",
    ],
    hadith: [
      {
        excerpt:
          "Sat neće doći dok ne vidite deset znakova: dim, Dedžala, Zvijer, izlazak sunca sa zapada, silazak Isa, sina Merjemina, Ya'juja i Ma'juja, i tri klizišta - jedno na istoku, jedno na zapadu i jedno na Arapskom poluostrvu - posljednje od njih tjeraju njihove ljude u vatru.",
      },
      {
        excerpt:
          "Tako mi Onoga u čijoj je ruci moja duša, Merjemin sin će uskoro sići među vas kao pravedan vladar. On će slomiti krst, ubiti svinje i ukinuti džizju, a bogatstvo će postati toliko obilno da ga niko neće prihvatiti.",
      },
      {
        excerpt:
          "Kada bi ostao samo jedan dan na ovom svijetu, Allah bi produžio taj dan sve dok u njemu nije odgojio čovjeka iz moje porodice (Mehdija) koji će ispuniti zemlju pravdom kao što je bila ispunjena nepravdom i ugnjetavanjem.",
      },
    ],
    disclaimer:
      "Realnost glavnih znakova je potvrđena, ali se naučnici ne slažu u potpunosti s njihovim tačnim redoslijedom i vremenom. Izbjegavajte određivanje datuma i izbjegavajte tvrdnju da je bilo koja današnja figura Mehdi, Dedžal ili Isa.",
    appLinks: [{}],
  },
  {
    title: "The Trumpet",
    summary: "Israfil — prva eksplozija, druga eksplozija i uskrsnuće.",
    body: [
      "Kada Allah odredi kraj, melek kome je povjerena truba (Sur) će puhati u nju. Davanje mu imena Israfil dolazi kroz naučnu tradiciju; ono što Kur'an čvrsto fiksira je sam događaj i njegov teror. Poslanik, sallallahu alejhi ve sellem, je prenio koliko je to uvijek neizbježno: 'Kako da budem spokojan kada je nosilac trube stavio na usta, savio čelo i čeka komandu da puhne?' — a kada je to uznemirilo ashabe, on ih je naučio da govore: 'Allah nam je dovoljan, i On je najbolji koji upravlja stvarima' (Džami' at-Tirmizi 2431, hasan).",
      "Postoje dvije eksplozije, a Kur'an ih razlikuje. Na prvom će se 'trubiti u trubu, i ko god je na nebesima i na Zemlji će pasti mrtav, osim koga Allah ne bude htio' (Kur'an 39:68) - eksplozija užasa i smrti koja ukida stvoreni poredak. Zatim dolazi drugi: 'onda će opet puhnuti, i odmah će oni stajati i gledati' (nastavlja se isti stih) - eksplozija vaskrsenja, u kojoj svo stvorenje ustaje iz mrtvih.",
      "Mnogi učenjaci, iz istog ajeta i pratećih izvještaja, govore o izuzetku - onima 'koje Allah hoće' koji nisu oboreni - i o intervalu između dvije eksplozije, iako se njegova dužina i detalji oslanjaju na izvještaje različite jačine i prepušteni su Allahu. Sigurnost je par eksplozija: kraj, pa povišica. Ovo se zove 'Dan upozorenja' (Kur'an 50:20) jer je to posljednji poziv, koji se oglašava kada više nema vremena za pripremu - upravo zbog čega se pozivu mora odgovoriti sada.",
    ],
    quran: [
      {
        excerpt:
          "I u trubu će se puhati, i ko je na nebesima i ko je na Zemlji, mrtav će pasti, osim koga Allah ne bude htio. Onda će ponovo biti duvana, i oni će odmah stajati i gledati.",
      },
      {
        excerpt: "I u trubu će se zatrubiti. To je Dan upozorenja.",
      },
    ],
    hadith: [
      {
        excerpt:
          'Kako da budem spokojan kada je nosilac trube stavio na usta i savio čelo, čekajući komandu da dune? Ashabi su bili uznemireni, pa im je rekao da kažu: "Allah nam je dovoljan i On je najbolji Upravljač stvarima."',
      },
    ],
  },
  {
    title: "Uskrsnuće",
    summary: "Tijela obnovljena - univerzalnost stajanja pred Allahom.",
    body: [
      "Pri drugom eksploziji mrtvi su uskrsnuti, tijelom i dušom, a uskrsnuće je stvarno i fizičko, a ne samo duhovno. Kur'an se susreće sa podsmjehom sumnjača: čovjek podiže kost koja se raspada i pita ko bi joj mogao dati život; odgovor je: 'Reci: On će mu dati život onaj ko ga je stvorio prvi put, a On zna za sve stvorenje' (Kur'an 36:78–79). Ako je stvaranje vas iz ničega bilo u Allahovoj moći, obnoviti vas nije teže.",
      "Vaskrsenje je univerzalno – uskrsnu svaki čovjek od prvog do posljednjeg, svakog naroda. Poslanik, sallallahu alejhi ve sellem, je opisao stanje u kojem se ljudi dižu: 'Ljudi će biti okupljeni bosi, goli i neobrezani.' Kada je Aiša zaprepašteno upitala da li će muškarci i žene gledati jedni u druge, on je rekao da bi pitanje tog Dana bilo previše ozbiljno da bi se to bilo koga ticalo (Sahih al-Bukhari 6527). Također je rekao: 'Bićete okupljeni bosi, goli i neobrezani - a prvi koji će biti odjeven na Kijametskom danu biće Ibrahim' (Sahih al-Buhari 3349).",
      "Poenta doktrine nije spektakl već odgovornost koju nameće. Budući da je povratak Allahu siguran, nijedno djelo nije zaista privatno i nijedna smrt nije zaista bijeg. 'Sat dolazi - nema sumnje - i Allah će oživjeti one u grobovima' (Kur'an 22:7). Vjerovanje u tjelesno uskrsnuće je ono što moralnu težinu ovog života čini stvarnom, a ne privremenom.",
    ],
    quran: [
      {
        excerpt:
          "I on nam daje primjer i zaboravlja svoje stvorenje, govoreći: Ko će oživjeti kosti dok se raspadaju? Reci: On će im dati život onaj koji ih je prvi put stvorio, a On zna za sve stvorenje.",
      },
      {
        excerpt: "I da dolazi Čas - nema sumnje - i da će Allah oživjeti one koji su u grobovima.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Bićete okupljeni bosi, goli i neobrezani. Zatim je recitovao: Kako smo započeli prvo stvaranje, Mi ćemo ga ponoviti. A prvi koji će biti obučen na Kijametskom danu biće Ibrahim.",
      },
      {
        excerpt:
          "Ljudi će biti okupljeni bosi, goli i neobrezani. Ajša je rekla: Hoće li muškarci i žene gledati jedni druge? Rekao je: Stvar će biti preozbiljna za to.",
      },
    ],
  },
  {
    title: "Okupljanje (Mahshar)",
    summary: "Stajanje pred Allahom - sunce blizu, znoj i stanja ljudi.",
    body: [
      "Nakon uskrsnuća, svo stvorenje biva otjerano na jednu ogromnu ravnicu - Mahshar - da čeka presudu. Sama Zemlja se preobražava: 'Onog dana kada će zemlju zamijeniti druga zemlja, a i nebesa, i oni će izaći pred Allaha, Jedinog, koji prevladava' (Kur'an 14:48). Nema orijentira, nema gužve u kojoj se može sakriti, nema statusa na koji se može osloniti – samo svaka duša, izložena i čeka.",
      "Uslovi tog stajanja su teški. Poslanik, sallallahu alejhi ve sellem, je rekao: 'Na Sudnjem danu sunce će se približiti ljudima toliko da će biti udaljeno jednu milju, i oni će potonuti u svom znoju u skladu sa svojim djelima - neko do članaka, neko do koljena, neko do struka, a neke će znoj zauzdati' (Sahih Musliman 2864). Ipak, isti izvještaji opisuju milost koja se dijeli djelima: kategorija koju je Poslanik, sallallahu alejhi ve sellem, imenovao će biti zasjenjena u hladu Allahovog Arša u danu kada nema hlada osim Njegovog - među njima pravedni vođa, omladina odgajana u ibadetu, i onaj koji je milostinju davao tako potajno, njegova lijeva ruka nije znala šta je trošila njegova desna ruka.",
      "Čekanje je dugo - Kur'an govori o 'Danu čija je mjera pedeset hiljada godina' (Kur'an 70:4) - ali njegova dužina nije ista za sve. Autentični izvještaji kažu da će to biti učinjeno lakšim za vjernika, kratko kao vrijeme između dva namaza, dok će druge opterećivati. Dakle, Mahšar je mjesto gdje privatna knjiga života postaje javna stvarnost: isto sunce, ista ravnica i potpuno različita iskustva, izvučena u potpunosti iz onoga što je svaka osoba poslala naprijed.",
    ],
    quran: [
      {
        excerpt:
          "Dana kada će zemlja biti zamijenjena drugom zemljom, a i nebesa, i oni će izaći pred Allaha, Jedinog, koji Prevladava.",
      },
      {
        excerpt: "Anđeli i Duh se uzdižu k Njemu u Danu čija je mjera pedeset hiljada godina.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sunce će se približiti ljudima na Sudnjem danu sve dok ne bude udaljeno oko milju, i oni će potonuti u znoj prema svojim djelima - neko do članaka, neko do koljena, neko do pojasa, a neki će znoj zauzdati.",
      },
    ],
  },
  {
    title: "zagovor (Shafa'ah)",
    summary: "Samo uz Allahovu dozvolu — vrste i najveći zagovor.",
    body: [
      "Šafa je posredovanje - jedna strana govori Allahu u ime druge. Ono je stvarno i milost, ali nikada nije nezavisno: niko se ne zauzima osim uz Allahovu prethodnu dozvolu i samo za koga je On zadovoljan. Kur'an navodi pravilo dva puta: 'Ko je taj koji se može zalagati kod Njega osim s Njegovom dozvolom?' (Kur'an 2:255), i 'Zastupništvo nema koristi kod Njega osim onome kome On dozvoli' (Kur'an 34:23). Ovaj jedini uslov je ono što odvaja islamsku doktrinu posredovanja od svakog njenog iskvarenja.",
      "Najveći od svih je al-Shafa'ah al-'Udhma, jedinstven za poslanika Muhammeda, sallallahu alejhi ve sellem. Na Mahšaru, shrvani dugim stajanjem, čovječanstvo će ići od poslanika do poslanika - Adama, Ibrahima, Musaa, 'Isa - svaki se pravdajući, sve dok ne dođu do Muhammeda, sallallahu alejhi ve sellem. On će klanjati ispod prijestolja i reći mu: 'Podigni glavu, traži i biće ti dato, zauzimaj se i tvoje zauzimanje će biti prihvaćeno' (Sahih al-Buhari 7440; puni lanac poslanika je u Sahihu Musliman 195). Njime on traži od Allaha da započne obračun i razriješi stanje - mjesto hvale koje je obećano samo njemu.",
      "Slijede i drugi autentični oblici: zagovor da neki vjernici uđu u Džennet bez računa; posredovanje koje podiže činove; a prije svega zagovor za teške grješnike među vjernicima, tako da se ljudi izvode iz Vatre uz posredovanje Poslanika sallallahu alejhi ve sellem, drugih poslanika, meleka, vjernika i na kraju milosti Allaha, koji je Najmilostiviji od milostivih. Proroci, mučenici, pravednici, pa čak i djeca koja su umrla mlada mogu se zalagati uz dopuštenje, iako jačina pojedinačnih izvještaja varira.",
      "Suštinski oprez: posredovanje na Ahiretu nikada ne dozvoljava pozivanje u pomoć mrtvima ili odsutnim sada. Zazivati ​​poslanika ili sveca u kaburu, tražeći od njih da oslobode nevolje ili zadovolje potrebe, znači usmjeravanje ibadeta drugome osim Allahu – to je širk, a to je suprotno od ovdje opisanog shafa'a, što je naklonost koju Allah daje na taj Dan kome On hoće. Niti to zamjenjuje potrebu za vjerom i pokajanjem u ovom životu; to je Allahova milost prema onima koji su živjeli i umrli na tevhidu.",
    ],
    quran: [
      {
        excerpt:
          "Ko je to što se može zalagati kod Njega osim uz Njegovu dozvolu? On zna šta je prije njih i šta će biti poslije njih, a oni ne obuhvataju ništa od Njegovog znanja osim onoga što On hoće.",
      },
      {
        excerpt: "A posredovanje kod Njega ne koristi osim onome kome On dozvoli.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ljudi će mi doći i ja ću pasti na sedždu pred Allahom, pa će se reći: O Muhammede, podigni glavu; zamolite i biće vam dato, zauzimajte se i vaše posredovanje će biti prihvaćeno.",
      },
      {
        excerpt:
          "Čovječanstvo će otići Adamu, pa Ibrahimu, pa Musau, pa Isau, i svako će se izvinjavati, sve dok ne dođu kod Muhammeda, sallallahu alejhi ve sellem, i njemu je dat najveći zagovor.",
      },
    ],
    misconceptions: [
      "Zabluda: Traženje posredovanja znači da se obožavaju Poslanik, sallallahu alejhi ve sellem, ili pravednici. Ispravka: Ibadet pripada samo Allahu; Šafa'a na Posljednji dan je milost koju Allah daje po svom dopuštenju i ne opravdava pozivanje mrtvih u ovom životu.",
    ],
  },
  {
    title: "Zapisnik o djelima",
    summary: "Anđeli snimanja — desna ruka, lijeva ruka, ništa nije izostavljeno.",
    body: [
      "Svako ljudsko biće ima dva plemenita pisara zadužena da zabilježe njihova djela: 'Kada dva primaoca primaju, sjede s desne i lijeve strane, on ne izgovara nijednu riječ, ali je s njim posmatrač spreman da zabilježi' (Kur'an 50:17-18). Posljednjeg dana ovi zapisi se dijele, a način primanja knjige je sam po sebi prva presuda - u desnoj ruci za uspješne, u lijevoj ruci ili iza leđa za propalog (Kur'an 84:7–12; 69:19–37).",
      "Ništa nije izostavljeno iz ovih zapisa — ni najmanji čin, ni prolazna misao koja je postala djelo. Zločinci će biti zapanjeni potpunošću toga: 'Reći će: Teško nama! Šta je to knjiga koja ne ostavlja ništa malo ili veliko osim što ju je zabilježila? I naći će sve što su učinili pred njima, a vaš Gospodar nikome ne čini nepravdu' (Kur'an 18:49). Allahovom milošću, dobre namjere i napušteni grijesi se također bilježe u korist vjernika.",
      "Budući da su jezik i udovi ono što ispunjava stranice, čuvanje njih čuva zapis. Poslanik, sallallahu alejhi ve sellem, je jezik učinio centralnim za spasenje: 'Ko meni garantuje ono što mu je između čeljusti i što je između njegovih nogu, ja mu garantujem Džennet' (Sahih al-Buhari 6474) - to jest, ko čuva svoj govor i svoju čednost. Svakodnevna navika iskrenog samopreispitivanja – pitati šta je danas dodano u knjigu – jedna je od najotrežnjujućih i najkorisnijih praksi koje vjernik može zadržati.",
    ],
    quran: [
      {
        excerpt:
          "I zapis će biti postavljen, i vidjet ćete zločince kako se boje onoga što je u njemu, govoreći: Teško nama! Šta je to knjiga koja ne ostavlja ništa malo ili veliko osim što ju je zabilježila? I naći će sve što su učinili, a vaš Gospodar nikome ne čini nepravdu.",
      },
      {
        excerpt:
          "A onaj kome se da njegov zapisnik u desnu ruku, reći će: Evo, pročitajte moj zapisnik! Bio sam siguran da ću ispuniti svoj račun. Tako će biti u ugodnom životu. Ali onaj kome daju svoj dosje u lijevu ruku reći će: Volio bih da mi nisu dali svoj dosije.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ko meni garantuje šta je između njegovih čeljusti i šta je između njegovih nogu, ja mu garantujem raj - znači njegov jezik i njegovu čednost.",
      },
    ],
    actions: [
      "Čuvajte jezik iznad gotovo svega drugog - većina onoga što ispunjava zapise za dobro ili zlo prolazi preko njega.",
      "Pregledajte svoj dan prije spavanja: pitajte šta biste željeli i čega biste se plašili da vidite zapisano u svojoj knjizi.",
    ],
    appLinks: [{}],
  },
  {
    title: "vaga (mizan)",
    summary: "Odmjerena djela - iskrenost, karakter i zikr čine vagu teškom.",
    body: [
      "Mizan je vaga na kojoj se djela odmjeravaju apsolutnom pravdom: 'Postavljamo vagu pravde za Sudnji dan, tako da se nijednoj duši neće nanijeti nepravda; čak i ako je težina zrna gorušice, Mi ćemo ga iznijeti, i dovoljni smo Mi kao računovođe' (Kur'an 21:47). Ehli Sunnet to potvrđuje kao stvarnu vagu, a ne kao puku metaforu – djela ili zapisi o njima se istinski vagaju. Čovjekova sudbina se okreće u zavisnosti od toga koji tiganj tone: 'Što se tiče onoga čija je vaga teška, on će biti u ugodnom životu; a onome čija je vaga lagana, utočište će mu biti bezdan' (Kur'an 101:6–9).",
      "Ono što vagu čini teškom nije sam obim aktivnosti, već njena težina pred Allahom - a težina dolazi od iskrenosti. Poslanik, sallallahu alejhi ve sellem, je ukazao na djela koja su bez napora, ali ogromna: 'Dvije riječi lake na jeziku, teške na vagi, voljene Milostivom: SubhanAllahi wa bihamdih, SubhanAllahil-'Azim' (Sahih al-Buhari 6406). Također je rekao: 'Ništa nije teže na vjernikovoj vagi na Sudnjem danu od dobrog karaktera' (Džami' at-Tirmizi 2002, sahih). Dakle, jednostavno sjećanje koje se iskreno ponavlja, ili strpljivo dobro ponašanje, mogu nadmašiti planine upadljivih aktivnosti.",
      "Obrnuto je opasnost od šupljih djela. Radnje učinjene da bi ih ljudi vidjeli (riya') ili iskvarene licemjerjem mogu stići na Skalu bez težine - spolja velike, iznutra prazne. Zbog toga iskrenost (ikhlas) nije jedna vrlina među mnogima, već upravo ono što svakom drugom djelu daje težinu. Lekcija je da gradimo dan oko malih, iskrenih, dosljednih djela i da pročistimo namjeru iza vidljivih.",
    ],
    quran: [
      {
        excerpt:
          "I Mi postavljamo vagu pravde za Sudnji dan, tako da se nijedna duša neće uvrijediti. A ako je težina zrna gorušice, Mi ćemo ga iznijeti, i dovoljni smo Mi kao računovođe.",
      },
      {
        excerpt:
          "Što se tiče onoga čija je vaga teška, on će biti u ugodnom životu. Ali što se tiče onoga čija je vaga lagana, njegovo će utočište biti ponor.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dvije riječi lake na jeziku, teške na Vagi, voljene Milostivom: SubhanAllahi wa bihamdih, SubhanAllahil-'Azim.",
      },
      {
        excerpt:
          "Ništa nije teže na vjerničkoj vagi na Kijametskom danu od dobrog karaktera. Zaista, onaj dobrog karaktera time dostiže rang onoga koji posti i moli.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "odgovornost (Hisab)",
    summary: "Lako obračunavanje, detaljno obračunavanje i prava koja se duguju drugima.",
    body: [
      "Hisab je obračun, kada je svaka osoba pozvana da odgovara za svoj život. Kur'an opisuje dva vrlo različita iskustva o tome: 'Što se tiče onoga kome je dat njegov zapis u desnu ruku, njemu će se lako suditi i on će se sretan vratiti svom narodu; ali će onaj koji ima dosije iza njegovih leđa tražiti uništenje' (Kur'an 84:7–11). 'Laki račun' je milost, a ne odsustvo ispitivanja — Poslanik, sallallahu alejhi ve sellem, je upozorio da je intenzitet ispitivanja sama po sebi neka vrsta kazne.",
      "Poslanikova, sallallahu alejhi ve sellem, vlastita žena pripovijeda ključnu razliku. Aiša ga je prijavila rekavši: 'Ko god bude pozvan na odgovornost bit će uništen.' Ona reče: Ali zar Allah ne kaže: 'Biće mu suđeno lakom računom'? On je odgovorio: 'To je samo predstavljanje djela; ali ko bude ispitan zbog računa bit će uništen' (Sahih al-Bukhari 6537). Dakle, nada vjernika nije da izbjegne svaki nadzor, već da mu se pokažu njegova djela, da se njegovi grijesi pokriju i da mu budu oprošteni – umjesto da se unakrsno ispituje stavka po stavku.",
      "Postoji kategorija dugova koju čak ni Allahov oprost ne briše jednostavno: prava drugih ljudi (huquq al-'ibad). Poslanik, sallallahu alejhi ve sellem, je upitao: 'Znate li ko je bankrot?' Rekli su: Jedan bez novca. On je rekao: 'Propast mog ummeta je onaj koji na Kijametskom danu dolazi sa namazom, postom i dobročinstvom, ali koji je ovog uvrijedio, onog oklevetao, uzeo imetak drugoga i prolio krv drugoga - pa im se predaju njegova dobra djela, a kada njegova dobra djela ponestane, njihovi grijesi mu se bace u vatru, a on se baci na vatru. 2581). Obožavanje ne poništava nepravdu; samo namirenje nepravde čini.",
      "Praktični zaključak je hitan i konkretan: neplaćeni dugovi, ukradeno bogatstvo, klevete i pokvarena povjerenja moraju se ispraviti u ovom životu - kroz pokajanje Allahu i restituciju i izvinjenje ljudima - jer je daleko jeftinije smjestiti se u valutu novca i poniznosti sada nego u valuti dobrih djela tada. I kroz sve to, Allahova pravda je savršena i Njegova milost obuhvata sve koji su se iskreno borili i pokajali.",
    ],
    quran: [
      {
        excerpt:
          "Što se tiče onoga kome je dat njegov zapis u desnu ruku, biće mu suđeno lakom računom i on će se sretan vratiti svom narodu. Ali onaj kome se da njegov dosje iza leđa će vapiti za uništenjem i ući u Blaze.",
      },
    ],
    hadith: [
      {
        excerpt:
          'Ko god bude pozvan na odgovornost biće uništen. Aiša reče: "Zar Allah ne kaže da će mu se lako suditi?" Rekao je: To je samo predstavljanje djela; ali ko bude ispitan za njegov račun biće uništen.',
      },
      {
        excerpt:
          "Znate li ko je bankrotirao? On je onaj koji dolazi na Sudnjem danu sa molitvom, postom i dobročinstvom, ali koji je druge vrijeđao, klevetao i nepravdu činio – pa im se daju njegova dobra djela, a kada ih ponestane, na njega se stavljaju njihovi grijesi i on biva bačen u vatru.",
      },
    ],
    actions: [
      "Izmirite dugove i vratite sve nepravedno uzeto, koliko god malo bilo, prije nego što dođe ugovoreni dan.",
      "Potražite i izvinite se bilo kome kome ste naneli nepravdu rečju, bogatstvom ili dostojanstvom - restitucija je sada daleko jeftinija od restitucije tada.",
      "Pokajte se Allahu za prava koja Mu duguju, i držite dvije knjige - božansku i ljudsku - obje jasne.",
    ],
    appLinks: [{}],
  },
  {
    title: "Ribnjak (Hawd)",
    summary: "Poslanikov bazen, sallallahu alejhi ve sellem, — ko pije, a ko se odbija.",
    body: [
      "Hawd je veliki umivaonik koji je dat Poslaniku Muhammedu, sallallahu alejhi ve sellem, na Kijametskom danu, milost za njegov žedni ummet tog užarenog, iscrpljujućeg Dana. Njegovi opisi su brojni i autentični: 'Moj Hawd je put od mjesec dana; njegova voda je bjelja od mlijeka, njegov miris slađi od mošusa, a njegove čaše su kao zvijezde na nebu. Onaj ko pije iz njega nikada više neće ožednjeti' (Sahih al-Buhari 6579). Vjerovanje u Hawd dio je sunitskog vjerovanja, ustanovljeno masovno prenošenim izvještajima.",
      "Sam Poslanik, sallallahu alejhi ve sellem, će tamo primiti svoje sljedbenike: 'Ja ću stići do Havda prije vas, a ja ću paziti na one od vas koji mi dođu' (Sahih Musliman 2292). Prepoznaje svoj ummet po svjetlu na njihovim licima, rukama i stopalima po tragovima vudua. Doći do njega znači biti ugašen zauvijek; nju, u razumnom razumjevanju, hrani al-Kawthar, rijeka koju je Allah dao Svom Poslaniku, sallallahu alejhi ve sellem, u džennetu.",
      "Ipak će neki biti otjerani iz Hawda. Poslanik, sallallahu alejhi ve sellem, je opisao da mu je rečeno za neke ljude: 'Oni nisu od vas; promijenili su i promijenili religiju nakon tebe', ili su se vratili za petama za njim. Učenjaci su oprezni s ovim: odnosi se na specifične kategorije u hadisu - kao što su otpadništvo i grob, namjerna inovacija u vjeri nakon jasnih smjernica - i to nije dozvola za obične muslimane da bacaju optužbe jedni na druge. Siguran put do Havda je držati se sunneta, čuvati vudu i namaz i čuvati jedinstvo vjernika.",
    ],
    hadith: [
      {
        excerpt:
          "Moj Hawd je mjesec dana putovanja. Voda mu je bjelja od mlijeka, miris slađi od mošusa, a čaše su brojne kao zvijezde na nebu. Ko pije iz nje, nikada više neće ožednjeti.",
      },
      {
        excerpt:
          "Stići ću do Hawda prije vas, i pazit ću na one od vas koji mi dođu. Neki ljudi će mi biti oduzeti, a ja ću reći: Gospodaru moj, moji drugovi! Reći će se: Ne znaš šta su inovirali poslije tebe.",
      },
    ],
    disclaimer:
      "Izvještaji o onima koji su se odbili od Hawda odnose se na specifične kategorije koje su navedene u hadisu, uglavnom otpadništvo i ozbiljne novotarije u vjeri. Oni nisu dozvola za muslimane da jedni druge proglašavaju stranputicom.",
  },
  {
    title: "Most (Sirat)",
    summary: "Prelazak preko pakla — brzina prema djelima i milosti.",
    body: [
      "Sirat je most koji se proteže preko vrha pakla, preko kojeg mora proći svaka osoba - i vjernik i nevjernik. Kur'an potvrđuje prelazak bez izuzetka: 'Nema nikog od vas osim da će on doći do njega. To je vašem Gospodaru neizbježno određeno. Tada ćemo spasiti one koji su Allaha sjećali, a krivce ćemo u tome ostaviti na koljenima' (Kur'an 19:71–72). Prolaz je univerzalan; siguran dolazak na daleku stranu je cijela stvar, a Allah je dao onima koje On štiti.",
      "Način prelaska je određen djelima koja se donosi. Poslanik, sallallahu alejhi ve sellem, je to opisao: 'Most će biti postavljen iznad Džehennema... i prvi od vas će proći kao munja, zatim kao vjetar, pa kao ptice, pa kao čovjek koji trči – prema njihovim djelima – dok vaš Poslanik stoji na mostu govoreći: O Gospodaru, čuvaj ih, čuvaj ih. Neki su spašeni neozlijeđeni, neki izgrebani i pušteni, a neki bačeni u vatru' (Sahih al-Buhari 6573). Pored mosta, u istom izvještaju, stoje pouzdanost (amanah) i rodbinske veze — upečatljiva slika da vjernost u povjerenjima i porodičnim vezama zapravo prati osobu.",
      "Svjetlost i brzina na Siratu se zarađuju u ovom životu. Molitva obavljena na vrijeme, milosrđe koje se redovno daje, poštenje u ophođenju i dobar karakter postaju, u stvari, oslonac i svjetlo uz koje se prelazi. Poslanik, sallallahu alejhi ve sellem, će se zalagati za tamošnje vjernike, a Allahovom milošću bilo ko uopće stigne na drugu stranu.",
      "Kao i sa drugim nevidljivim stanicama, mudar pravac nije da se spekuliše o fizičkim dimenzijama mosta - koliko je tanak, koliko oštar, koliko dugačak - izvan onoga što otkriva otkriće, već da se u potpunosti fokusira na dela koja prelaz čine lakim. Ono što ne možete zamisliti, možete se pripremiti.",
    ],
    quran: [
      {
        excerpt:
          "I nema nikog od vas osim da će on doći do toga. To je vašem Gospodaru neizbježno određeno. Tada ćemo spasiti one koji su Allaha sjećali, a nepravednike u njemu ostaviti na koljenima.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Most će biti postavljen preko pakla, a ja ću prvi preći. Narod će preći preko njega po svojim djelima — kao munja, kao vjetar, kao ptice, kao čovjek koji trči — dok ja kažem: Gospode, čuvaj ih, čuvaj ih. Neki su spašeni, neki ogrebani i pušteni, a neki padaju u Vatru.",
      },
    ],
    actions: [
      "Izmolite pet namaza na vrijeme - namaz je svjetlo koje vodi preko mosta.",
      "Dajte dobročinstva redovno, čak iu malim količinama.",
      "Čuvajte rodbinske veze i čuvajte svoje amanete - u hadisu oni stoje uz sam Sirat.",
    ],
  },
  {
    title: "Raj",
    summary: "Vječna nagrada - njeno blaženstvo i, iznad svega, viđenje Allaha.",
    body: [
      "Džennet je vječni dom koji je Allah pripremio za vjernike, stvarnost izvan dosega mašte. U svetom hadisu Poslanik, sallallahu alejhi ve sellem, je rekao da Allah o tome kaže: 'Pripremio sam Svojim pravednim robovima ono što nijedno oko nije vidjelo, uho nije čulo, i nijedno ljudsko srce nikada nije začelo' (Sahih al-Buhari 3244). Njegove rijeke, bašte, dvorci i društvo su opisani u Kur'anu da privuku srce, ali opisi ukazuju na radost koja ih u potpunosti prevazilazi.",
      "Najveća od svih njegovih nagrada nije bašta ili rijeka, već Allahovo zadovoljstvo i vizija Njegovog Lica. 'Tog Dana lica će biti ozarena, uperena u Gospodara svoga' (Kur'an 75:22-23) - što shvaća ehli-sunnet kao vjernici koji vide Allaha na Ahiretu, krunu dženneta, darovanog na način koji dolikuje Njegovom veličanstvu i bez sličnosti sa stvorenjem. Allah obećava: 'Za one koji su činili dobro je najbolja nagrada, i još više' (Kur'an 10:26) - a 'više' je objašnjeno u autentičnim hadisima kao ova vizija Njegovog plemenitog Lica.",
      "Ulazak u Džennet je Allahovom milošću, prihvaćen kroz vjeru i dobra djela - to dvoje se nikada ne suprotstavljaju: milost je uzrok, a djela su znak i sredstvo koje je Allah za nju vezao. Posljednji dan završava, za stanovnike Raja, u blaženstvu koje nikad ne blijedi i nikad ne prestaje. Ovaj modul namerno drži svoj tretman Raja kratkim; potpuni vodič Putovanje do Dženneta pokriva njegove kapije, redove, djela koja do njega vode i molbe za njega u dubini.",
    ],
    quran: [
      {
        excerpt:
          "I požuri sa oprostom od Gospodara svoga i džennetom širokom kao nebesa i zemlja, pripremljenom za pravednike.",
      },
      {
        excerpt: "Tog Dana, lica će biti ozarena, gledajući prema svome Gospodaru.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah kaže: Pripremio sam Svojim pravednim robovima ono što nijedno oko nije vidjelo, uho nije čulo, i što nijedno ljudsko srce nije zamislilo.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Pakao",
    summary: "Pravo upozorenje - prava kazna i vrata za bijeg dok je živ.",
    body: [
      "Jahannam je pravo prebivalište kazne, a ne simbol ili metafora za loše stanje uma. Vjerovanje u to je dio vjerovanja u nevidljivo i u Allahovu pravdu. Kur'an sa trijeznom jasnoćom upozorava: 'Za one koji nisu vjerovali u Gospodara svoga kazna je Džehennema, a jadno je odredište' (Kur'an 67:6). Njegova ozbiljnost je opisana da probudi, a ne da zadovolji radoznalost: 'Vatra čije su gorivo ljudi i kamenje' (Kur'an 2:24), koju čuvaju strogi anđeli koji se ne pokoravaju Allahu u onome što On naredi.",
      "Svrha ovih upozorenja je prikrivena milost. Oni postoje da razbiju aroganciju, da zaustave uporno odbacivanje istine i da vrate čoveka unazad pre nego što bude prekasno. Zato su upozorenja u Kur'anu gotovo uvijek uparena sa otvorenim vratima pokajanja — smisao opisivanja Vatre je upravo u tome da je ljudi izbjegavaju dok još mogu. Njegova kazna je pravedna: niko ne ulazi u nju osim svojim vlastitim upornim izborom protiv jasnog uputstva, a Allah nikome ne čini nepravdu.",
      "Za vjernike koji nose grijehe, zdravo sunitsko vjerovanje je ravnoteža između straha i nade: grešnik je pod Allahovom voljom - On može oprostiti, ili može očistiti u Vatri, a zatim, uz posredovanje i milost opisanu ranije, izvući iz nje svakoga ko je imao i djelić vjere. Ovaj modul daje paklu namjerno kratak i odmjeren tretman. Potpuna studija o njegovim upozorenjima, velikim grijesima i ogromnim vratima pokajanja i milosti nalazi se u modulu Razumijevanje Jahannama i srodnim temama akide – kojem se uvijek pristupa s nadom, nikad u očaju.",
    ],
    quran: [
      {
        excerpt:
          "A za one koji nisu vjerovali u Gospodara svoga je kazna Džehennema, a jadno je odredište.",
      },
      {
        excerpt:
          "Reci: O robovi moji koji ste sami sebe prestupili, ne očajavajte u Allahovoj milosti. Zaista, Allah oprašta sve grijehe. Zaista, On je onaj koji prašta i milostiv.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ko ulazi bez računa?",
    summary: "Autentični hadis o onima koji zaobilaze detaljan hisab — naučna rasprava.",
    body: [
      "Među milostima posljednjeg dana je i to što grupa ovog ummeta ulazi u Džennet bez ikakvog računa. Poslanik, sallallahu alejhi ve sellem, je rekao: 'Sedamdeset hiljada mog ummeta će ući u Džennet bez računa', i drugim riječima, 'sa još hiljadu sedamdeset hiljada.' Kada su se ashabi zapitali ko su oni, on ih je opisao: 'To su oni koji ne traže rukju od drugih, ne vjeruju u zla znamenja, ne koriste kauterizaciju i koji se uzdaju u svog Gospodara' (Sahih al-Buhari 6541).",
      "Srž tog opisa je tawakkul - duboko, aktivno oslanjanje na Allaha - zajedno sa slobodom od praznovjerja i tjeskobne ovisnosti o uzrocima. Ne osuđuje traženje dozvoljenog medicinskog tretmana; rukja koja se uči nad samim sobom i zakonita medicina utvrđeni su u sunnetu. Ono što se hvali je osoba čija je oslonac u potpunosti na Allaha da ne idu okolo moleći druge za duhovne čari ili se drže predznaka.",
      "Učenjaci raspravljaju o samom broju: neki smatraju da je sedamdeset hiljada doslovan, drugi da je umnožen dodatnim izvještajima, a treći još uvijek da signalizira neizmjerno obilje Allahove milosti, a ne fiksni broj ljudi. Ono oko čega se slažu je temeljna istina - da Allahova milost daleko premašuje ono što bi ljudsko knjigovodstvo očekivalo, i da je konačni spas po toj milosti.",
      "Ovo je stanica nade, a ne rupa za lijenost. Ona nadahnjuje vjernika da se istinski osloni na Allaha i da se udalji od praznovjerja, dok se i dalje trudi u ibadetu. Niko to ne zarađuje zanemarujući djela; čovjeka privlače iskrenost, povjerenje i srce privrženo Allahu, a ne čarima i strahovima.",
    ],
    hadith: [
      {
        excerpt:
          "Sedamdeset hiljada mog ummeta ući će u Džennet bez polaganja računa: to su oni koji ne traže rukju od drugih, ne vjeruju u zla znamenja, ne peču i koji se uzdaju u svog Gospodara.",
      },
    ],
    disclaimer:
      "Naučnici se razlikuju oko toga da li 'bez računanja' znači fiksnih sedamdeset hiljada ili daleko veći broj koji se ne može izmjeriti. Svi se slažu da je konačni spas Allahovom milošću, i da je to razlog za nadu, a ne za zanemarivanje djela.",
  },
  {
    title: "Priprema za posljednji dan",
    summary: "Praktičan ibadet - povežite svaku naviku sa svojim susretom sa Allahom.",
    body: [
      "Nakon hodanja cijelog puta - smrti, groba, znakova, trube, skupa, zapisa, vaga, obračuna, Mosta i dva doma - jedini razuman odgovor je pripremiti se. Ali priprema nije panika. Poslanik, sallallahu alejhi ve sellem, nikada nije ostavljao svoje drugove uplašene i paralizovane; ostavio ih je da rade. Osnova svega toga je tevhid i iskrenost (ihlas): djelo se prihvata samo kada je učinjeno samo za Allaha iu skladu sa sunnetom, pa prije nego što dodate još djela, očistite namjeru iza onih koje već imate.",
      "Izgradite dan na stubovima koje su tekstovi učinili teškim na Vagi. Namaz na vrijeme je sidro i svjetlo Sirata. Kur'an – recitovan, slušan i razmišljan, čak i nekoliko ajeta dnevno – održava srce živim. Tawbah čisti zapis: 'O vjernici, obratite se Allahu u iskrenom pokajanju' (Kur'an 66:8). Dobročinstvo pročišćava bogatstvo i nadživljava vas kao sadaka jarija. Dhikr drži jezik teškim na Vagi sa riječima laganim na jeziku. A dobar karakter, rekao je Poslanik, sallallahu alejhi ve sellem, je najteža stvar na vagi.",
      "Čuvajte dvije stvari koje je Poslanik, sallallahu alejhi ve sellem, direktno vezao za Džennet — jezik i čednost (Sahih al-Bukhari 6474) — jer su to, više od dramatičnih grijeha, ono što tiho ispunjava ili propada zapis. I podmiri prava ljudi dok još možeš: plati dugove, vrati oduzeto, izvini se za štetu i budi fer u svakom poslu, da nikad ne dođeš kao 'bankrot' čije molitve pojedu potraživanja onih kojima je nepravdu učinio.",
      "Sve počiva na jednoj namjeri, navedenoj u prvom hadisu Sahiha al-Bukharija: 'Djela su samo namjere.' Koristite Munibove tragače ne kao rezultat za nadmetanje, već kao nježnu skelu za ove navike - molitvu, Kur'an, zikr, dobročinstvo, pokajanje - svaki od njih tiho usmjerava vaš dan prema susretu s Allahom. To je cijeli cilj: živjeti sada kao neko ko istinski očekuje da stane pred Njim.",
    ],
    quran: [
      {
        excerpt: "I nisam stvorio džine i ljude osim da Me obožavaju.",
      },
      {
        excerpt:
          "O vjernici, obratite se Allahu u iskrenom pokajanju. Možda će vaš Gospodar ukloniti od vas vaša nedjela i uvesti vas u bašče ispod kojih rijeke teku.",
      },
    ],
    hadith: [
      {
        excerpt: "Radnje su samo namjere, i svako će imati samo ono što je namjeravao.",
      },
      {
        excerpt:
          "Ko meni garantuje šta je između njegovih čeljusti i šta je između njegovih nogu - njegov jezik i njegovu čednost - ja mu garantujem Džennet.",
      },
    ],
    actions: [
      "Na vrijeme klanjajte pet dnevnih namaza.",
      "Čitajte ili slušajte Kur'an svaki dan - čak i nekoliko stihova.",
      "Držite jutarnji i večernji adhkar.",
      "Dajte dobročinstva redovno, čak i male iznose.",
      "Svakodnevno se pokajte i iskreno tražite oprost.",
      "Čuvajte jezik i čednost i držite svako obećanje i povjerenje.",
      "Ispunjavanje prava prema porodici, komšijama i poveriocima.",
      "Razmišljajte u svom molitvenom dnevniku o khušu i iskrenosti namjere.",
    ],
    appLinks: [{}, {}, {}, {}, {}, {}],
  },
];

export const LAST_DAY_HADITH_BS: DeepPartial<LastDayHadithEntry>[] = [
  {
    hadith: {
      excerpt: "Često se setite razarača zadovoljstava - što znači smrti.",
    },
    context:
      "Redovno sjećanje na smrt omekšava srce, otklanja ljutnju i ispravlja prioritete bez izazivanja očaja.",
  },
  {
    hadith: {
      excerpt:
        "Nitko od vas ne bi trebao umrijeti osim dok pretpostavljate najbolje o Allahu - misleći dobro na milost njegovog Gospodara.",
    },
    context:
      "Dobar završetak (husn al-khatima) se nada kroz iskrenu vjeru, pokajanje i dobro očekivanje od Allaha.",
  },
  {
    hadith: {
      excerpt: "Mezar je ili bašta iz džennetskih vrtova ili jama iz vatrenih jama.",
    },
    context:
      "Barzak uključuje nagradu ili kaznu u kaburu, Allahovom mudrošću - kabur odražava vlastita djela osobe.",
  },
  {
    hadith: {
      excerpt:
        "Kada se pokojnik sahrani, dva meleka dolaze i ispituju ga o njegovom Gospodaru, njegovoj vjeri i njegovom poslaniku.",
    },
    context:
      "Ispitivanje u grobu je potvrđeno u autentičnim izvještajima; u ovoj predaji dva meleka se zovu Munkar i Nakir.",
  },
  {
    hadith: {
      excerpt:
        "Kada osoba umre, njena djela se završavaju osim za tri: stalna dobročinstva, znanje iz kojeg se stiče korist ili pravedno dijete koje se moli za njega.",
    },
    context: "Ono što i dalje koristi umrlom – utvrđeno u sahih hadisu.",
  },
  {
    hadith: {
      excerpt:
        "Bićete okupljeni bosi, goli i neobrezani - a prvi koji će biti obučen na Kijametskom danu biće Ibrahim.",
    },
    context: "Poniznost na Dan okupljanja; Allah poštuje koga hoće, kako hoće.",
  },
  {
    hadith: {
      excerpt:
        "Sunce će se približiti ljudima na Sudnjem danu sve dok ne bude udaljeno oko milju, i oni će potonuti u svom znoju prema djelima svojim.",
    },
    context: "Uslovi na Mahšaru — ozbiljnost varira ovisno o djelima u autentičnim pričama.",
  },
  {
    hadith: {
      excerpt:
        "Ljudi će mi doći i ja ću pasti na sedždu pred Allahom, pa će se reći: Podigni glavu svoju; zamolite i biće vam dato, zauzimajte se i vaše posredovanje će biti prihvaćeno.",
    },
    context:
      "Najveći zastupništvo — al-Shafa'ah al-'Udhma, jedinstveno za Poslanika, sallallahu alejhi ve sellem.",
  },
  {
    hadith: {
      excerpt:
        'Ko god bude pozvan na odgovornost biće uništen. Aiša je upitala: Zar Allah ne kaže: "Bit će mu suđeno na lak način?" Rekao je: To je samo predstavljanje djela; ali ko bude ispitan za njegov račun biće uništen.',
    },
    context:
      "'Jednostavan račun' je milost - pokazati mu se djela i oprostiti, a ne unakrsno ispitivati ​​stavku po stavku.",
  },
  {
    hadith: {
      excerpt:
        "Bankrot mog ummeta je onaj koji dolazi sa namazom, postom i dobročinstvom, ali je vrijeđao, klevetao i nepravdu drugima – pa su im njegova dobra djela data, a njihovi grijesi se terete na njega.",
    },
    context:
      "Prava ljudi (huquq al-'ibad) nisu jednostavno poništena ibadetom; moraju se izmiriti ili platiti na Dan.",
  },
  {
    hadith: {
      excerpt:
        "Sedamdeset hiljada mog ummeta ući će u Džennet bez obračuna: oni koji ne traže rukju od drugih, ne vjeruju u zla znamenja, ne peču i koji se uzdaju u svog Gospodara.",
    },
    context:
      "Učenjaci se razlikuju oko toga da li je broj doslovan ili označava daleko veće, neizmjerivo obilje Allahove milosti.",
  },
  {
    hadith: {
      excerpt:
        "Moj Hawd je mjesec dana putovanja. Voda mu je bjelja od mlijeka, miris slađi od mošusa, a čaše su brojne kao zvijezde na nebu. Ko pije iz nje, nikada više neće ožednjeti.",
    },
    context: "Ribnjak — milost za ummet Muhammeda, sallallahu alejhi ve sellem, na Dan žeđi.",
  },
  {
    hadith: {
      excerpt:
        "Most je postavljen iznad pakla. Ljudi ga prelaze po svojim djelima — kao munja, kao vjetar, kao ptice, kao čovjek koji trči — i neki se ogrebu i spasavaju, a neki padaju.",
    },
    context: "Brzina prelaska odražava vjeru i djela; Allahova milost je ogromna.",
  },
  {
    hadith: {
      excerpt:
        "Sat neće doći dok ne vidite deset znakova: dim, Dedžala, Zvijer, izlazak sunca sa zapada, silazak Isa, sina Merjemina, Ya'juja i Madžudža, tri klizišta i vatru koja tjera ljude na njihova okupljanja.",
    },
    context:
      "Deset glavnih znakova, od Hudhayfe ibn Usayda. Naučnici potvrđuju svaki znak, ali se razlikuju u tačnom nizu.",
  },
  {
    hadith: {
      excerpt:
        "Tako mi Onoga u čijoj je ruci moja duša, Merjemin sin će uskoro sići među vas kao pravedan vladar; on će slomiti krst, ubiti svinje i ukinuti džizju, a bogatstvo će preplaviti sve dok ga niko ne prihvati.",
    },
    context:
      "Isaovo porijeklo je čvrsta tačka sunitskog vjerovanja; on vlada po šerijatu Muhammeda ﷺ.",
  },
  {
    hadith: {
      excerpt:
        'Kada se povjerenje izgubi, čekajte Sat. Postavljeno je pitanje: Kako će se izgubiti? Rekao je: "Kada se vlast daje onima koji je ne zaslužuju.',
    },
    context:
      "Dobro poznati manji znak - gubitak povjerenja. Fokusirajte se na pripremu, a ne na paniku.",
  },
  {
    hadith: {
      excerpt:
        "Allah ne uklanja znanje otimanjem, već uzimanjem učenjaka, sve dok niko ne ostane i dok ljudi ne uzmu neznalice za vođe koji donose presude bez znanja, pa zalutaju i odvedu druge na krivi put.",
    },
    context:
      "'Gubitak znanja' znači gubitak zdravih učenjaka i žive prakse - a ne nedostatak informacija.",
  },
];

export const LAST_DAY_VERSES_BS: DeepPartial<LastDayVerseEntry>[] = [
  {
    excerpt:
      "Svaka duša će okusiti smrt, a potpuna nadoknada će vam biti data tek na Sudnjem danu. Dakle, onaj ko je odvučen od Vatre i primljen u Džennet je uspio, a život na ovom svijetu je samo uživanje u zabludi.",
    context:
      "Smrt je univerzalna i ovaj život je privremen; pravo i konačno poravnanje računa dolazi tek Posljednjeg dana.",
    tafsirSummary:
      "Ajet redefiniše uspjeh: ne bogatstvo ili status ovdje, već spasenje od Vatre i ulazak u raj tamo.",
  },
  {
    excerpt:
      "Tog dana ljudi će otići u odvojenim grupama da im se pokažu svoja djela. Dakle, ko god čini atomsku težinu dobra vidjet će to, a ko god čini težinu atoma zla, vidjet će to.",
    context:
      "Savršena i potpuna pravda - najsitnije djelo, dobro ili loše, biva zabilježeno i vraćeno počiniocu.",
    tafsirSummary:
      "Ništa nije premalo da se broji. Ovaj ajet je doživotna opomena protiv odbacivanja 'manjih' grijeha i doživotno ohrabrenje ka 'malim' dobrim djelima.",
  },
  {
    excerpt:
      "I Mi postavljamo vagu pravde za Sudnji dan, tako da se nijedna duša neće uvrijediti. Čak i ako je težina zrna gorušice, Mi ćemo ga iznijeti, i dovoljni smo Mi kao računovođe.",
    context: "Mizan (skala) je stvaran i njegova pravda je apsolutna.",
    tafsirSummary:
      "Nikoga na taj Dan nije manja čak ni težina zrna gorušice; Allahovo računovodstvo je besprijekorno.",
  },
  {
    excerpt:
      "Što se tiče onoga čija je vaga teška, on će biti u ugodnom životu. Ali što se tiče onoga čija je vaga lagana, njegovo će utočište biti ponor.",
    context: "Konačni ishod okreće težinu nečijih pravednih djela na Vagi.",
    tafsirSummary:
      "Težina dolazi od iskrenosti, a ne od pukog volumena - jednostavan zikr za koji se kaže da može nadmašiti planine upadljivih aktivnosti.",
  },
  {
    excerpt:
      "I požuri sa oprostom od Gospodara svoga i džennetom širokom kao nebesa i zemlja, pripremljenom za pravednike.",
    context: "Direktna naredba da se trči ka dobru i ka oprostu prije susreta s Allahom.",
    tafsirSummary:
      "Raj je neizmjeran i ne može se zamisliti, a put do njega je požuriti - ne odlagati pokajanje i dobra djela.",
  },
  {
    excerpt: "Tog Dana, lica će biti ozarena, gledajući prema svome Gospodaru.",
    context: "Najveća nagrada Dženneta nije bašta ili rijeka, već gledanje Allahovog lica.",
    tafsirSummary:
      "Ehli-sunnet potvrđuje da će vjernici svog Gospodara vidjeti na onom svijetu, na način koji dolikuje Njegovom veličanstvu i bez sličnosti sa stvorenjem - krunom svakog blaženstva.",
  },
  {
    excerpt:
      "A za one koji nisu vjerovali u Gospodara svoga je kazna Džehennema, a jadno je odredište.",
    context: "Pakao je istinita i pravedna posljedica - pravo prebivalište, a ne simbol.",
    tafsirSummary:
      "Upozorenje je milost koja ima za cilj da vrati osobu nazad dok još ima vremena; uvijek je uparen u Kur'anu sa otvorenim vratima pokajanja.",
  },
  {
    excerpt:
      "Reci: O robovi moji koji ste sami sebe prestupili, ne očajavajte u Allahovoj milosti. Zaista, Allah oprašta sve grijehe. Zaista, On je onaj koji prašta i milostiv.",
    context: "Koliko god bio veliki grijeh, vrata iskrenog pokajanja ostaju otvorena do smrti.",
    tafsirSummary:
      "Očaj zbog Allahove milosti je sam od šejtana; vjernik balansira strah od Vatre sa neraskidivom nadom u Allahov oprost.",
  },
  {
    excerpt: "I da dolazi Čas - nema sumnje - i da će Allah oživjeti one koji su u grobovima.",
    context: "Uskrsnuće je sigurno, iako je njegovo vrijeme skriveno.",
    tafsirSummary:
      "Izvjesnost u Satu, uparena s nesigurnošću u njegovo vrijeme, upravo je ono što učvršćuje moralnu odgovornost u sadašnjosti.",
  },
  {
    excerpt:
      "Ko je to što se može zalagati kod Njega osim uz Njegovu dozvolu? On zna šta je prije njih i šta će biti poslije njih, a oni ne obuhvataju ništa od Njegovog znanja osim onoga što On hoće.",
    context: "Zastupništvo (shafa'ah) je stvarno, ali nikada nije nezavisno od Allahove dozvole.",
    tafsirSummary:
      "Ovaj jedini uslov - 'osim po Njegovom dopuštenju' - je ono što odvaja istinsko posredovanje od svake njegove pokvarenosti i zabranjuje prizivanje mrtvih u ovom životu.",
  },
  {
    excerpt:
      "I nikada nemojte misliti da Allah nije svjestan onoga što zulumćari rade. Odgađa ih samo za jedan Dan kada će oči zuriti užasnuto.",
    context: "Utjeha za potlačene — očigledno kašnjenje pravde nije njeno odsustvo.",
    tafsirSummary:
      "Allah ne zaboravlja nijednu nepravdu; prestupniku se samo daje predah do Dana kada ništa neće biti zanemareno.",
  },
  {
    excerpt:
      "I nema nikog od vas osim da će on doći do toga. To je vašem Gospodaru neizbježno određeno. Tada ćemo spasiti one koji su Allaha sjećali, a nepravednike u njemu ostaviti na koljenima.",
    context:
      "Prelazak preko Sirata je univerzalan; siguran dolazak je dat Allahovom milošću i taqwa.",
    tafsirSummary:
      "Svi dolaze na prelaz; razlika je u tome ko je spašen, a ko pada - odlučeno je vjerom i djelima poslanim naprijed.",
  },
  {
    excerpt:
      "Pitaju vas za Sat: kada dolazi? Reci: Njegovo znanje je samo kod mog Gospodara. Niko neće otkriti svoje vrijeme osim Njega. Neće vam se dogoditi osim neočekivano.",
    context: "Tačan tajming je poznat samo Allahu - priprema je bitna, predviđanje je uzaludno.",
    tafsirSummary:
      "Čak ni Poslaniku, sallallahu alejhi ve sellem, nije dat datum; svaka ljudska tvrdnja o godini ili odbrojavanju je u suprotnosti sa ovim stihom.",
  },
  {
    excerpt:
      "A onaj kome se da njegov zapisnik u desnu ruku, reći će: Evo, pročitajte moj zapisnik! Bio sam siguran da ću ispuniti svoj račun. Tako će biti u ugodnom životu.",
    context: "Način primanja knjige - desnom ili lijevom - je sam po sebi prva presuda.",
    tafsirSummary:
      "Radost uspješnih je nagrađena radost izvjesnosti: živjeli su očekujući obračun, a ono dolazi kao olakšanje, a ne šok.",
  },
];

export const LAST_DAY_TIMELINE_BS: DeepPartial<LastDayTimelineEvent>[] = [
  {
    title: "Život na ovom svijetu",
    body: "Kratko određeno vrijeme za vjerovanje, obožavanje i pripremu. Ovaj svijet nije konačni dom – to je polje djela.",
  },
  {
    title: "Smrt",
    body: "Svaka duša će okusiti smrt. Vjernik ga susreće sa nadom u Allahovu milost; bezbrižnost ga čini iznenadnim i gorkim.",
  },
  {
    title: "Grob",
    body: "Nakon sahrane, duša ulazi u barzak. Kabur je prva faza Ahireta za svakog čovjeka.",
  },
  {
    title: "Barzakh",
    body: "Život između smrti i uskrsnuća - ispitivanje, blaženstvo ili kazna prema autentičnim izvještajima.",
  },
  {
    title: "Manji znakovi",
    body: "Postepene društvene i moralne promjene je opisao Poslanik, sallallahu alejhi ve sellem. Mnogi naučnici primjećuju da se pojavilo nekoliko; tačno vrijeme pripada samo Allahu.",
  },
  {
    title: "Glavni znakovi",
    body: "Dramatični događaji pri kraju - uključujući al-Mahdija, Dedžala i povratak Isaa (alejhi selam) u autentičnom hadisu. Detalji sekvence se razlikuju među naučnicima.",
  },
  {
    title: "The Trumpet",
    body: "Israfil će zatrubiti. Kreacija umire pri prvom eksploziji i vaskrsava pri drugom.",
  },
  {
    title: "Uskrsnuće",
    body: "Tijela obnovljena od prašine; sve stvorenje stoji pred Allahom.",
  },
  {
    title: "Okupljanje (Mahshar)",
    body: "Svi ljudi su se okupili bosi, goli i neobrezani - kako Allah hoće - čekajući sud.",
  },
  {
    title: "Zapisnik o djelima",
    body: "Knjige date u desnu, lijevu ruku ili iza leđa. Ništa nije izostavljeno iz snimljenog.",
  },
  {
    title: "vaga (mizan)",
    body: "Djela odmjerena savršenom pravdom. Teške vage donose radost; svjetlosne vage donose gubitak.",
  },
  {
    title: "odgovornost (Hisab)",
    body: "Lako računanje za neke; detaljno ispitivanje za druge. Prava koja se duguju ljudima se ne zanemaruju.",
  },
  {
    title: "zagovor (Shafa'ah)",
    body: "Samo uz Allahovu dozvolu — najveći pripada Poslaniku Muhammedu, sallallahu alejhi ve sellem.",
  },
  {
    title: "Ribnjak (Hawd)",
    body: "Ogroman lavor iz kojeg Poslanikov ummet, sallallahu alejhi ve sellem, pije na Kijametskom danu.",
  },
  {
    title: "Most (Sirat)",
    body: "Svaka osoba prelazi preko pakla — brzina varira ovisno o vjeri i djelima u autentičnim pričama.",
  },
  {
    title: "Raj ili pakao",
    body: "Vječno prebivalište — Džennet Allahovom milošću i dobrim djelima; Jahannam kao pravo upozorenje i pravedna posljedica.",
  },
  {
    title: "Vječnost",
    body: "Nema smrti nakon Ahireta. Ljudi iz Raja ostaju zauvijek u blaženstvu; ljudi Džehennema ostaju kako je Allah htio.",
  },
];

export const LAST_DAY_QUIZ_BS: DeepPartial<LastDayQuizQuestion>[] = [
  {
    prompt: "Vjerovanje u posljednji dan je jedno od:",
    options: ["Pet stubova islama", "Šest stavova vjere (Iman)", "Sedam nebesa", "Deset pratilaca"],
    explanation:
      "Iman uključuje vjerovanje u Allaha, meleke, knjige, poslanike, posljednji dan i božansku odredbu (kadr).",
  },
  {
    prompt: "Barzakh se najbolje opisuje kao:",
    options: ["Most preko pakla", "Život između smrti i uskrsnuća", "Razmjera djela", "Zvuk trube"],
    explanation: "Barzak je period nakon smrti do Dana vaskrsenja.",
  },
  {
    prompt: "Tačno ili netačno: Naučnici se slažu oko tačnog slijeda svih glavnih znakova sata.",
    options: ["Istina", "False"],
    explanation:
      "Glavni znakovi su potvrđeni u autentičnim hadisima, ali se učenjaci razlikuju u nekim detaljima redoslijeda. Vrijeme sata je poznato samo Allahu.",
  },
  {
    prompt: "Mizan (skala) posljednjeg dana odnosi se na:",
    options: [
      "Vaganje fizičkih tela",
      "Odmjeravanje djela savršenom pravdom",
      "Mjerenje vremena u grobu",
      "Brojanje anđela",
    ],
    explanation: "Mizan odmerava dela - iskrenost i pravedno delovanje otežavaju vagu.",
  },
  {
    prompt: "Zagovor (šafa'ah) na Posljednji dan:",
    options: [
      "Dešava se bez Allahove dozvole",
      "Samo uz Allahovu dozvolu",
      "Zamjenjuje potrebu za vjerom",
      "Negira se u Kur'anu",
    ],
    explanation: "Kur'an 2:255 i 20:109 potvrđuju posredovanje samo uz Allahovu dozvolu.",
  },
  {
    prompt: "Šta dolazi prvo na ahiretskom putu?",
    options: ["Uskrsnuće", "Smrt", "The Gathering", "The Trumpet"],
    explanation: "Smrt prethodi barzaku, zatim — nakon znakova i trube — vaskrsenju i okupljanju.",
  },
  {
    prompt: "Koju ćete naviku ojačati ove sedmice da se pripremite za susret s Allahom?",
    explanation:
      "Priprema je praktična: namaz, Kur'an, pokajanje, dobročinstvo, dobar karakter i ispunjavanje tuđih prava.",
  },
  {
    prompt: "Tačno ili netačno: Prema Kur'anu 19:71, svaka osoba će preći Sirat.",
    options: ["Istina", "False"],
    explanation:
      "Ajet kaže da će svi preći preko toga; Allah čuva pametne. Naučnici raspravljaju o detaljima o tome ko pada.",
  },
];

export const LAST_DAY_REFERENCES_BS: DeepPartial<LastDayReferenceEntry>[] = [
  {
    title: "Kur'an",
    note: "Primarni izvor za vaskrsenje, odgovornost, raj, pakao i božansku pravdu. Ajeti u ovom modulu se navode surom i ajetom.",
  },
  {
    title: "Sahih al-Bukhari i Sahih Musliman",
    note: "Kanonske zbirke hadisa za smrt, kabur, znakove, polaganje računa, posredovanje, Hawd i Sirat.",
  },
  {
    title: "Sunan al-Tirmizi i Sunan Ebi Davud",
    note: "Dodatni vjerodostojni izvještaji o grobu i manjim znakovima — ocjene se navode gdje je primjenjivo.",
  },
  {
    title: "Ibn Kesir — Komentar",
    note: "Klasični komentar kur'anskih ajeta o ahiretu. Koristi se za kratke sažetke tefsira, a ne kao nezavisni dokaz.",
  },
  {
    title: "Al-'Aqidah al-Tahawiyyah",
    note: "Temeljna sunitska vjera koja potvrđuje vaskrsenje, razmjer, most, raj i pakao.",
  },
  {
    title: "Naučne razlike",
    note: "Gdje se naučnici razlikuju — npr. redoslijed glavnih znakova, detalji Hawda, kategorije koje se ulaze bez računanja — ovaj modul bilježi razliku bez traženja jednog pogleda kao jedinog valjanog mišljenja.",
  },
  {
    title: "Otkrivenje protiv tumačenja",
    note: "Eksplicitni Kur'an i mutevatir ili sahih hadis razlikuju se od tumačenja (idžtihada) i slabijih predaja.",
  },
];
