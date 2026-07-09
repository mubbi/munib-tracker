// Bosnian translation overlay for the Learn Taharah content. Mirrors the order of
// its English source in ../taharah*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { TaharahChecklistItem, TaharahTopic } from "../../types/taharah";
import type { DeepPartial } from "./localize";

export const TAHARAH_TOPICS_BS: DeepPartial<TaharahTopic>[] = [
  {
    title: "Uvod u Taharu",
    summary: "Očišćenje je ulaz u molitvu i pola vjere vjernika.",
    body: [
      "Tahara (طهارة) znači pročišćenje — oslobađanje tijela, odjeće i mjesta za molitvu od ritualne i fizičke nečistoće kako bi musliman mogao stati pred Allaha u stanju koje On prihvati. To je prva stvar koju učenik ibadeta nauči, jer bez toga nijedna molitva nije valjana: Poslanik, sallallahu alejhi ve sellem, je rekao: 'Ključ namaza je pročišćenje.'",
      "Pročišćenje u islamu ima dvije dimenzije. Spolja je opipljiva čistoća — pranje, uklanjanje prljavštine, održavanje čistoće. Unutrašnjost je poniznost, pažnja i spremnost srca koju pranje treba da probudi. Poslanik, sallallahu alejhi ve sellem, je povezao to dvoje kada je nazvao pročišćenje 'polovinom vjere', uparujući fizičku čistoću sa čišćenjem duše od grijeha.",
      "Ovaj modul prolazi kroz cijelu temu redom: voda kojom čistite, wudu (manji abdest), gusl (potpuno ritualno kupanje), tayammum (suvo pročišćavanje kada se voda ne može koristiti), najasah (uklanjanje fizičke prljavštine) i posebni slučajevi i ustupci. Naučite to jednom i molitva će postati nešto u što možete ući s povjerenjem, a ne sa sumnjom.",
    ],
    quran: [
      {
        excerpt:
          "O vjernici, kada ustanete na molitvu, operite svoja lica i svoje podlaktice do lakata, obrišite svoje glave i operite noge svoje do članaka.",
      },
      {
        excerpt: "Zaista, Allah voli one koji se neprestano kaju i voli one koji se čiste.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ključ molitve je pročišćenje; njegov početak je tekbir, a njegov kraj je taslim. (Ali; također Džami' at-Tirmizi 3)",
      },
    ],
    actions: [
      "Tretirajte čišćenje kao pripremu za susret s Allahom, a ne kao rutinu koja se žuri.",
      "Proučavajte jednu taharu temu svaki dan dok se cijeli tok ne osjeti prirodnim.",
    ],
    appLinks: [{}],
  },
  {
    title: "Važnost čistoće",
    summary: "Čistoća je strogi uvjet za namaz i obilježje vjernika.",
    body: [
      "Pročišćenje nije jedna od mnogih opcija – ono je uslov za valjanost molitve. Allah ne prima dovu osobe koja je u stanju ritualne nečistoće sve dok se ne očisti. Zbog toga se molitva koja se obavlja bez valjanog vudua ili gusla mora ponoviti, koliko god iskrena bila.",
      "Poslanik, sallallahu alejhi ve sellem, uzdigao je pročišćenje do definišne osobine vjernika, nazivajući ga 'polovinom vjere'. Redovno pročišćavanje disciplinira osobu, drži je u gotovo stalnom stanju spremnosti za ibadet, i — uči hadis — bukvalno vodom spira male grijehe.",
      "Budući da čuva namaz, tahara također čuva vjernika od grijeha nevaljanog klanjanja iz nepažnje. Dobro učenje njegovih odluka je stoga čin zaštite jednog od najvećih djela u islamu.",
    ],
    hadith: [
      {
        excerpt: "Pročišćenje je pola vjere. (Ebu Malik al-Ash'ari)",
      },
      {
        excerpt:
          "Allah ne prima namaz bez očišćenja, niti dobročinstvo od onoga što je ukradeno. (Ibn 'Umar)",
      },
    ],
    actions: [
      "Prije svake molitve potvrdite svoje stanje čistoće prije nego što počnete.",
      "Držite jednostavnu mentalnu kontrolnu listu: tijelo, odjeća, mjesto i vudu.",
    ],
  },
  {
    title: "Vrste čistoće",
    summary: "Tri stanja koja treba znati: manja nečistoća, velika nečistoća i fizički nadžasah.",
    body: [
      "Islamski zakon razlikuje tri stvari od kojih ćete se možda morati očistiti, a svaka ima svoj lijek. Znati u kojoj se situaciji nalazite ključno je za odabir prave metode.",
      "Manja ritualna nečistoća (hadath asghar) je rezultat uobičajenih događaja kao što su korištenje toaleta, prolazni vjetar ili dubok san. Podiže se wuduom ili tayammumom kada se voda ne može koristiti.",
      "Velika ritualna nečistoća (hadath akbar, koja se također naziva dženaba) nastaje zbog intimnosti, seksualnog pražnjenja i završetka menstruacije ili postnatalnog krvarenja. Podiže se guslom, ritualnom kupkom cijelog tijela — sa tayammumom koji se ponovo zamjenjuje kada voda nije dostupna ili je štetna.",
      "Fizička prljavština (najasah) — kao što je urin, izmet ili krv koja teče — je zasebna stvar: ona se mora fizički ukloniti s tijela, odjeće i mjesta za molitvu bez obzira na vaše ritualno stanje. Četiri sunitske škole se slažu oko ove tri kategorije, razlikuju se samo u nekim detaljima o tome šta poništava čistoću ili koje količine u tragovima su opravdane.",
    ],
    quran: [
      {
        excerpt:
          "A ako ste u stanju dženabe, onda se očistite. Ali ako ste bolesni ili ste na putovanju... i ne nađete vodu, tada obavite tayammum sa čistom zemljom.",
      },
    ],
    actions: [
      "Prvo odredite svoje stanje (malo, veliko ili prljavo), a zatim primijenite ispravnu metodu.",
      "Kada niste sigurni u detalje, dosljedno pratite jednog kvalifikovanog nastavnika iz priznate škole.",
    ],
  },
  {
    title: "Voda u islamu",
    summary: "Čista voda je primarni pročišćivač - koristi se temeljno, ali se nikada ne troši.",
    body: [
      "Zadano sredstvo za prečišćavanje je voda. Allah opisuje kišu kao 'čistu' (tahur) - sposobnu da očisti i da se koristi za ibadet. Svaka prirodno čista voda - kiša, rijeka, more, izvor, bunar ili česma - pročišćava sve dok joj se boja, okus ili miris ne promijeni nečistoćom koja se u nju umiješa.",
      "Pravnici detaljno kategoriziraju vodu (čista i pročišćavajuća, čista, ali ne pročišćavajuća i nečista), ali praktično pravilo za svakodnevni život je jednostavno: voda ostaje prikladna za vudu i gusl osim ako je nadžasah jasno nije promijenio. Kada sumnjate u dostupnu čistu alternativu, koristite alternativu.",
      "Islam uči temeljitosti bez ekstravagancije. Poslanik, sallallahu alejhi ve sellem, se u potpunosti oprao, ali je koristio izuzetno malo vode — oko mud (dvije šake šake) za vudu i sa' (otprilike četiri) za puni gusl. Trošenje vode je obeshrabreno čak i kada je ima u izobilju, jer je umjerenost sama po sebi dio bontona obožavanja.",
    ],
    quran: [
      {
        excerpt: "I Mi sa neba spuštamo čistu vodu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Poslanik, sallallahu alejhi ve sellem, je obavljao vudu sa blatom vode i gusl sa sa'om do pet muda. (Anas; također Sahih Musliman 325 - sunnet umjerenosti)",
      },
    ],
    actions: [
      "Koristite dovoljno vode za temeljno pranje, ali okrenite slavinu prema dolje i izbjegavajte višak.",
      "Ako izvor vode izgleda ili miriše izmijenjen prljavštinom, potražite najbliži jasno čist izvor.",
    ],
    disclaimer:
      "Često citirani izvještaj 'ne troši vodu čak ni na rijeci koja teče' (Ibn Majah 425) većina učenjaka ocjenjuje slabim (da'if); umjesto toga je sunnet umjerenosti uspostavljen gore navedenim hadisom mudd/sa'.",
  },
  {
    title: "Šta je Wudu?",
    summary: "Ritualni abdest koji uklanja manju nečistoću prije klanjanja.",
    body: [
      "Wudu (وضوء) je ritualno pranje određenih udova, određenim redoslijedom, koje uklanja manju ritualnu nečistoću. Njegova četiri obavezna pranja su navedena direktno u Kur'anu (5:6): lice, podlaktice do laktova, brisanje glave i stopala do članaka.",
      "To je potrebno prije svakog namaza — osim ako ne ostanete u ispravnom stanju od prethodnog namaza — i, prema mišljenju većine učenjaka, prije obavljanja tavafa oko Kabe i prije dodirivanja fizičkog teksta (mushafa) Kur'ana.",
      "Wudu je čin ibadeta sam po sebi, a ne samo preliminarno. Poslanik, sallallahu alejhi ve sellem, je upozorio da 'Allah ne prima namaz bilo koga od vas ko prekrši svoj vudu sve dok ponovo ne obavi vudu' — tako da čuvanje toga znači čuvanje samog namaza.",
    ],
    hadith: [
      {
        excerpt:
          "Allah ne prima dovu onoga od vas ko prekrši svoj vudu sve dok ne obavi vudu. (Ebu Hurejre)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Uslovi za Važeći Wudu",
    summary: "Namjera, čista voda i neometana koža — preduslovi za zvučni vudu.",
    body: [
      "Određeni uslovi (šurut) moraju postojati da bi se vudu računao. Osoba mora biti musliman zdravog uma, s namjerom da se očisti za ibadet (niyyah). Neke škole svrstavaju namjeru kao stub djela, a druge kao uslov, ali sve se slažu da je to potrebno za nagradu i, za većinu, za valjanost.",
      "Voda koja se koristi mora biti čista i pročišćavajuća. Ono što je najvažnije, mora zaista doći do kože - tako da sve što čini vodootpornu barijeru preko ekstremiteta (debela boja, lak za nokte, vosak, ljepilo) mora biti prvo uklonjeno, ili pranje ispod toga nije valjano. Obična prljavština ili mrlja od kane koja ne blokira vodu nije problem.",
      "Šafijske i hanbelijske škole također zahtijevaju da se pranje obavlja po kur'anskom redoslijedu i bez dužeg prekida (muwalat) koji omogućava da se udovi osuše. Hanefijski i malikijski stavovi o strogom slijedu i kontinuitetu su u nekim situacijama blaži. Slijedite metod jedne škole za dosljednost.",
    ],
    quran: [
      {
        excerpt:
          "Operite lica i podlaktice do lakata, obrišite glave i operite stopala do članaka.",
      },
    ],
    actions: [
      "Uklonite lak za nokte, prstenove koji zadržavaju vodu i sve što zapečati kožu prije vudua.",
      "Wudu obavite mirno u jednom toku, tako da nijedan ud ne promakne ili ostavite da se osuši.",
    ],
  },
  {
    title: "Obavezna djela vudua",
    summary: "Kur'anski stubovi (faraid) bez kojih je vudu nevažeći.",
    body: [
      "Obavezna djela vudua (njegovog faraida) su dijelovi koje je Allah imenovao u ajetu: pranje cijelog lica; pranje obje ruke do i uključujući laktove; brisanje glave; i pranje oba stopala do i uključujući gležnjeve. Promašite bilo šta od ovoga i vudu je nepotpun.",
      "Ovome, škole dodaju dodatne obaveze iz sunneta i pravnog obrazloženja. Namjera je obavezna u većini škola (hanefije ga svrstavaju u jako naglašen sunnet za uklanjanje manjih nečistoća). Red (tartib) i kontinuitet (muwalat) su obavezni za šafije i hanbelije. Malikiji dodaju trljanje udova (dalk) kao obavezu.",
      "Sve osim toga - ispiranje usta i nosa, prvo pranje ruku, pranje tri puta - je preporučljivo (sunnet) nego obavezno. Poznavanje razlike znači da možete reći kada je wudu samo nesavršen ili zapravo nevažeći.",
    ],
    quran: [
      {
        excerpt:
          "Operite lica i podlaktice do lakata, obrišite glave i operite stopala do članaka.",
      },
    ],
    disclaimer:
      "Tačna lista faraida (npr. da li su namjera, red i trljanje obavezni) razlikuje se među četiri škole. Učite i primjenjivajte jednu pouzdanu školu dosljedno.",
  },
  {
    title: "Sunnetska djela vudua",
    summary: "Preporučena djela koja usavršavaju i umnožavaju nagradu za vudu.",
    body: [
      "Oko obaveznog jezgra, Poslanik, sallallahu alejhi ve sellem, je praktikovao mnoge preporučene radnje (sunan) koje upotpunjuju i uljepšavaju vudu. Napuštanje jednog ne poništava vudu, ali uključivanje njih zarađuje dodatnu nagradu i potpunije slijedi njegov primjer.",
      "Uspostavljeni sunnetski radnji uključuju: izgovaranje 'Bismillah' na početku; pranje ruku tri puta prije početka; ispiranje usta (madmadah) i nosa (istinshaq); prolazak mokrih prstiju kroz gustu bradu i između prstiju na rukama i nogama (taklil); svaki par udova počinje desnim; i ponavljanje svakog pranja do tri puta.",
      "Dva sunneta zaslužuju posebno spomenuti: korištenje misvaka (siwaka) unaprijed — koji je Poslanik, sallallahu alejhi ve sellem, skoro učinio obaveznim — i učenje svjedočanstva vjere nakon završetka, što otvara osam kapija Dženneta za onoga ko to izgovori.",
    ],
    hadith: [
      {
        excerpt:
          "Ko dobro obavi vudu, a zatim kaže 'Svjedočim da nema drugog boga osim Allaha... i da je Muhammed Njegov rob i Poslanik', otvaraju mu se osam vrata Dženneta. ('Omar ibn al-Hattab)",
      },
    ],
    actions: [
      "Vježbajte cijeli niz sunneta dok to ne postane vaša prirodna rutina.",
      "Svaki put recitujte šehadet nakon vudua.",
    ],
    appLinks: [{}],
  },
  {
    title: "Korak-po-korak Wudu",
    summary: "Potpuni proročki niz od namjere do završne molitve.",
    body: [
      "Poslanik, sallallahu alejhi ve sellem, je učio vudu kao tekuću sekvencu koja povezuje obaveze sa sunnetskim djelima. Ovo je metod koji je 'Osman ibn 'Affan demonstrirao ljudima, rekavši nakon toga da je vidio Poslanika, sallallahu alejhi ve sellem, kako obavlja vudu upravo tako - i da onome ko učini isto i klanja dva rekata sa punim prisustvom, oprošteni su mu prošli grijesi.",
      "Svaki korak izvodite bez žurbe, pazeći da voda dopre do svakog traženog područja. Oprani udovi (lice, ruke, stopala) se peru; glava je samo obrisana.",
    ],
    steps: [
      {
        title: "Namjerite pročišćavanje i recite Bismillah",
        body: "Smjestite namjeru za vudu u svoje srce i počnite s Allahovim imenom.",
        tip: "Namjera je unutra - nije potrebna izgovorena formula.",
      },
      {
        title: "Operite obe ruke tri puta",
        body: "Operite do zapešća, propuštajući vodu između prstiju.",
      },
      {
        title: "Isperite usta tri puta",
        body: "Uzmite vodu u usta, zavrtite je i izbacite.",
      },
      {
        title: "Isperite nos tri puta",
        body: "Lagano uvucite vodu u nozdrve i ispuhnite je.",
      },
      {
        title: "Operite lice tri puta (farz)",
        body: "Od linije kose do ispod brade i od uha do uha.",
      },
      {
        title: "Operite desnu ruku, pa lijevu (farz)",
        body: "Svaki od vrhova prstiju do i uključujući lakat, do tri puta.",
      },
      {
        title: "Obrišite glavu jednom (fard)",
        body: "Vlažnim rukama obrišite od naprijed prema nazad i vratite se, a zatim obrišite uši istom vlažnošću.",
      },
      {
        title: "Operite desnu nogu, pa lijevu (farz)",
        body: "Svaki do i uključujući skočni zglob, prolazeći prstima između nožnih prstiju.",
        tip: "Obratite pažnju na pete i gležnjeve — mesta koja se najčešće propuštaju.",
      },
      {
        title: "Recitirajte završnu molitvu",
        body: "Recite svjedočanstvo vjere da otvorite vrata raja.",
        tip: "Kratak, ali jako nagrađen sunnet.",
      },
    ],
    hadith: [
      {
        excerpt:
          "'Osman je oprao svaki ud tri puta kao što je vidio Poslanika, sallallahu alejhi ve sellem, da radi, a zatim je rekao: Onaj ko ovako obavi vudu i klanja dva rekata sa punim fokusom, oprošteni su mu prošli grijesi. (Humran, od Osmana)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dove vezane za Wudu",
    summary: "Vjerodostojno prijavljene molitve prije i poslije vadua.",
    body: [
      "Dva su najsnažnija ispričana sjećanja oko vudua: izgovaranje 'Bismillah' na početku i svjedočanstvo vjere nakon završetka. Završnom šehadetu, vjerodostojan dodatak traži od Allaha: 'Uvedi me među one koji se kaju i učini me među onima koji se čiste.'",
      "Važno je znati da detaljna 'dova za svaki ud' (posebna dova prilikom pranja ruku, lica, ruku i tako dalje) koja kruži u nekim brošurama nije potvrđena sa čvrstom vjerodostojnošću od Poslanika, sallallahu alejhi ve sellem. Učenjaci savjetuju da mu se ovo ne pripisuje kao sunnet, dok opće spominjanje Allaha tokom vudua nema štete.",
      "Srž stvari je prisustvo: operite se sa sviješću da grijesi svakog uda nestaju, i završite šehadetom koji ponovo povezuje čin s njegovom svrhom - vjerom samo u Allaha.",
    ],
    hadith: [
      {
        excerpt:
          "Ko dobro obavi vudu, a zatim izgovori svjedočanstvo vjere, otvaraju mu se osam kapija Dženneta da uđe kroz koju želi. ('Umar)",
      },
    ],
    actions: [
      "Zapamtite šehadet nakon vudua ako već niste.",
      "Izbjegavajte recitiranje neprovjerenih formula po udovima kao da su utvrđeni sunnet.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Šta razbija Wudu?",
    summary: "Poništavači vudua — i pravilo sigurnosti kada ste u nedoumici.",
    body: [
      "Prema naučnom dogovoru, vudu se prekida bilo čime što izlazi iz dva privatna prolaza - urin, stolica, vjetar ili drugi iscjedak - kao i dubokim snom koji uklanja nečiju svijest, te gubitkom svijesti zbog nesvjestice ili intoksikacije.",
      "Ostale stvari podliježu poštovanju razlika između škola: direktno dodirivanje intimnih dijelova i kontakt koža na kožu s ne-mahramom suprotnog spola, poništavaju u nekim školama, ali ne i u drugim, na osnovu različitog čitanja istih tekstova.",
      "Vitalni vladajući princip štiti vas od stalne anksioznosti (waswas): sigurnost se ne uklanja sumnjom. Ako ste imali vudu i jednostavno niste sigurni da li ste ga prekršili, i dalje se smatra da ste obavili vudu dok ne budete sigurni da je došlo do poništavanja. Poslanik, sallallahu alejhi ve sellem, je rekao čovjeku koji je uznemiren ovim osjećajem da ne napušta namaz 'sve dok ne čuje zvuk ili ne pronađe miris.'",
    ],
    hadith: [
      {
        excerpt:
          "Ne treba da napušta (svoju molitvu) sve dok ne čuje zvuk ili ne pronađe miris. (Abbad ibn Tamim, od svog ujaka)",
      },
    ],
    disclaimer:
      "Bilo da dodirivanje suprotnog spola ili nečije intimne dijelove prekida vadu, razlikuje se u školama. Slijedite kvalifikovanog lokalnog nastavnika i metod jedne škole.",
  },
  {
    title: "Uobičajene Wudu greške",
    summary: "Česte greške koje umanjuju nagradu - ili potpuno poništavaju vudu.",
    body: [
      "Većina grešaka wudua dolazi od žurbe. Požurivanje tako da voda ne dopre do cijelog udova - suhe mrlje na peti, gležnju, laktu ili između prstiju na rukama i nogama - može ostaviti vadu nevažećim, jer kur'ansko pranje nije tamo završeno.",
      "Poslanik, sallallahu alejhi ve sellem, je jednom vidio ljude čije su pete ostale suhe jer voda nije stigla do njih, i oštro je upozorio: 'Teško petama od Vatre!' Pete, gležnjevi i uglovi lica su najčešće zanemarene tačke.",
      "Suprotna greška je pretjeranost: pranje mnogo više od tri puta, ili rasipno korištenje vode, što je u suprotnosti sa sunnetom umjerenosti. Drugi padaju u waswas (opsesivna sumnja), ponavljajući vudu iznova i iznova — i ovo je greška, jer se sumnja ne poništava.",
    ],
    hadith: [
      {
        excerpt:
          "Jao do pete od Vatre! – rekao je kada je vidio da su pete osušene u vudu. (Ebu Hurejre)",
      },
    ],
    actions: [
      "Usporite i svjesno potvrdite potpunu pokrivenost svakog opranog uda, posebno peta i laktova.",
      "Koristite umjerenu vodu; ne dozvolite da vas opsesivna sumnja gurne u bespotrebno ponavljanje.",
    ],
  },
  {
    title: "Vrline Wudua",
    summary: "Vudu briše grijehe, podiže činove i učiniće da vjernici zablistaju na Sudnjem danu.",
    body: [
      "Wudu je ponovljeno pranje grijeha. Poslanik, sallallahu alejhi ve sellem, uči da dok vjernik pere svaki ud, pogrešne radnje koje je počinio taj ud otpadaju sa vodom – očima, rukama, nogama – sve dok osoba ne izađe očišćena od grijeha. Molitvi kojoj prethodi vudu, dakle, prethodi novi oprost.",
      "To je takođe izuzetna čast u sledećem životu. Na Kijametskom danu Poslanik, sallallahu alejhi ve sellem, će prepoznati svoje sljedbenike po sjaju na njihovim licima, rukama i nogama od tragova vudua – svjetla jedinstvenog za ovaj ummet, zvanog al-ghurr al-muhajjalun.",
      "Zbog ovih vrlina, držanje u stanju vudua je preporučena navika: obnavljanje za svaki namaz i spavanje na vudu spadaju u zaštitne rutine vjernika.",
    ],
    hadith: [
      {
        excerpt:
          "Moj ummet će biti pozvan na Kijametskom danu sa svijetlim licima, rukama i nogama od tragova vudua. (Ebu Hurejre)",
      },
    ],
    actions: [
      "Obnovite vudu za svaki molitveni prozor gdje možete.",
      "Neka spavanje na vudu bude noćni sunnet.",
    ],
    appLinks: [{}],
  },
  {
    title: "Šta je Gusl?",
    summary: "Ritualna kupka cijelog tijela koja uklanja veliku nečistoću (džanaba).",
    body: [
      "Gusl (غسل) je ritualno pranje cijelog tijela, s namjerom da se ukloni velika ritualna nečistoća (džanaba). Gdje se vudu odnosi na manju nečistoću, gusl se odnosi na veće stanje koje slijedi nakon intimnosti, seksualnog pražnjenja i završetka menstruacije ili postnatalnog krvarenja.",
      "Njegova suština je da voda dopire do svakog dijela vanjskog tijela - ne smije ostati suha mrlja, uključujući korijene kose, kožne nabore, iza ušiju, pupak i između prstiju na nogama. Mnogi učenjaci uključuju ispiranje usta i nosa u gusl.",
      "Jedan gusl obavljen s namjerom da se podigne dženaba također uklanja manju nečistoću, tako da osoba koja je završila gusl može klanjati bez posebnog vudua (iako je klanjanje vudua unutar gusla sunnet).",
    ],
    quran: [
      {
        excerpt: "A ako ste u stanju dženabe, onda se očistite.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Kada je gusl potreban",
    summary: "Situacije koje čine puno ritualno kupanje obaveznim ili preporučenim.",
    body: [
      "Gusl postaje obavezan (fard) u nekoliko definiranih slučajeva: ispuštanje seksualne tekućine sa željom (bilo budno ili kroz mokri san); sam seksualni odnos, čak i bez ejakulacije — Poslanik, sallallahu alejhi ve sellem, je rekao da kada se to dvoje spoje, dospije gusl; i prestanak menstruacije (hayd) ili postnatalno krvarenje (nifas). Smrt također obavezuje gusl umrlog nad živima.",
      "Drugi gusli su preporučljivi (mustahabb), a ne obavezni: gusl za petak prije džume, koji se toliko snažno potiče da ga je Poslanik, sallallahu alejhi ve sellem, nazvao 'dužnošću za svakoga ko je dostigao pubertet'; gusl za dva Bajrama; i gusl ihrama prije hadža ili umre.",
      "Novom muslimanu je naređeno da obavi gusl po ulasku u Islam – što neki učenjaci smatraju obaveznim, a drugi snažno preporučuju.",
    ],
    hadith: [
      {
        excerpt:
          "Kada muškarac sjedi između četiri uda svoje žene i ima odnos s njom, gusl postaje obavezan. (Ebu Hurejre; također Sahih Musliman 348)",
      },
      {
        excerpt:
          "Gusl u petak je obaveza svakoga ko je navršio pubertet. (Ebu Sa'id al-Khudri; također Sahih Musliman 846)",
      },
    ],
    disclaimer:
      "Da li su gusli petkom i preobraćenje obavezni ili preporučljivi zavisi od škole i okolnosti.",
    appLinks: [{}],
  },
  {
    title: "Korak-po-korak Gusl",
    summary: "Poslanička metoda — minimalna obaveza plus potpuni sunnet.",
    body: [
      "'Aiša je detaljno opisala Poslanikov gusl, a iz njega učenjaci izvode i minimalno važeći gusl i potpuniju sunnetsku metodu. Minimum je jednostavan: namjera plus voda koja dopire do cijelog tijela (uz ispiranje usta i nosa za mnoge). Kompletan metod u nastavku je kako je to učinio sam Poslanik, sallallahu alejhi ve sellem.",
      "Izvodite to bez žurbe, trljajući vodu po koži da ništa ne ostane suho.",
    ],
    steps: [
      {
        title: "Formirajte namjeru",
        body: "Namjerite u svom srcu da uklonite veliku ritualnu nečistoću (džanaba).",
      },
      {
        title: "Reci Bismillah i operi ruke",
        body: "Počnite u ime Allaha i operite obje ruke.",
      },
      {
        title: "Operite privatni prostor",
        body: "Lijevom rukom uklonite sve nečistoće sa intimnih dijelova.",
      },
      {
        title: "Obavite puni vudu",
        body: "Obavljajte vudu kao namaz. Možete odložiti pranje stopala do kraja ako stojite u sakupljenoj vodi.",
      },
      {
        title: "Tri puta prelijte glavu vodom",
        body: "Nanesite vodu na vlasište i korijen kose.",
      },
      {
        title: "Operite desnu stranu, pa lijevu",
        body: "Sipajte i utrljajte vodom cijelo tijelo, počevši od desnog.",
      },
      {
        title: "Osigurajte potpunu pokrivenost",
        body: "Ne ostavljajte suvo mesto - ispod pazuha, pupka, iza kolena i ušiju, i između nožnih prstiju.",
        tip: "Žene ne moraju rasplesti kosu, pod uslovom da voda dopre do vlasišta.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Poslanik, sallallahu alejhi ve sellem, kada se okupao sa dženabe, oprao je ruke, klanjao vudu kao namaz, prošao prstima kroz kosu, a zatim polio vodu tri puta preko glave i po ostatku tijela. ('Aishah)",
      },
    ],
  },
  {
    title: "Uobičajene greške gusla",
    summary: "Izbjegavajte suva područja, propuštenu namjeru i zamijenite tuš za gusl.",
    body: [
      "Najosnovnija greška je tretiranje običnog tuša kao gusla. Gusl zahtijeva namjeru da ukloni veliku nečistoću; bez njega, koliko god dugo pereš, ritualno stanje se ne poništava. Formirajte namjeru prije nego što počnete.",
      "Druga uobičajena greška je ostavljanje suhih mrlja. Obaveza je da voda dodiruje cijelo vanjsko tijelo, tako da zanemarivanje korijena tjemena, ušiju, pupka, donjeg dijela leđa ili između prstiju ostavlja gusl nepotpunim. Utrljajte vodu preko ovih područja da biste bili sigurni.",
      "Za kosu: žena sa ispletenom kosom nije obavezna da rasplete pletenice, sve dok voda dopire do korijena tjemena — Poslanik, sallallahu alejhi ve sellem, je rekao Umm Selamah da je dovoljno preliti tri šake preko glave. Mušku kosu, koja je obično opuštena, treba proraditi tako da voda dođe do korijena.",
    ],
    hadith: [
      {
        excerpt:
          "Dovoljno je da prelijete glavu sa tri šake vode, pa se polite vodom i pročišćeni ste – ne morate raspetljavati pletenice. (Umm Salamah)",
      },
    ],
    actions: [
      "Izgovorite namjeru prije prvog polivanja, tako da se pranje računa kao gusl.",
      "Utrljajte vodu na područja koja se lako propuštaju; kada niste sigurni, ponovo operite deo radije nego završite u nedoumici.",
    ],
  },
  {
    title: "Šta je Tayammum?",
    summary: "Suvo prečišćavanje čistom zemljom kada se voda ne može koristiti.",
    body: [
      "Tayammum (تيمم) je milosrdna zamjena za vudu ili gusl kada je voda zaista nedostupna ili se ne može koristiti. Umjesto pranja, dlanovima se udara po čistu zemlju i briše lice i ruke — i to u potpunosti zamjenjuje pročišćavanje vode, omogućavajući valjanu molitvu.",
      "Tayammum je dar posebno ovom ummetu: Poslanik, sallallahu alejhi ve sellem, je rekao: 'Zemlja je za mene načinjena mjestom molitve i sredstvom za čišćenje', navodeći je među posebnim privilegijama koje su date njemu, a ne ranijim poslanicima. On utjelovljuje centralni princip religije - obaveza ostaje, ali teškoće su uklonjene.",
      "To je privremena mjera: kada voda postane dostupna i upotrebljiva, nastavlja se obično prečišćavanje vodom. Prema nekim školama, osoba će možda morati obnoviti tayammum za svaki namaz.",
    ],
    quran: [
      {
        excerpt:
          "…i ne nađete vodu, onda izvršite tayammum sa čistom zemljom i obrišite njome svoja lica i ruke.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Zemlja je za mene načinjena mjestom molitve i sredstvom za pročišćenje. (Džabir — među pet stvari koje su jedinstveno date Poslaniku sallallahu alejhi ve sellem)",
      },
    ],
  },
  {
    title: "Kada je Tayammum dozvoljen",
    summary: "Dozvoljeno kada voda nema, štetna je ili je hitno potrebna za preživljavanje.",
    body: [
      "Tayammum je dozvoljen u tri široke situacije. Prvo, kada se nakon razumne potrage ne može pronaći voda - putnik u pustinji ili bilo ko istinski bez pristupa. Drugo, upotreba vode bi nanijela štetu: za bolesnike čije bi se rane ili bolest pogoršale, ili u velikoj hladnoći bez sredstava za zagrijavanje vode i stvarni rizik od ozljede.",
      "Treće, kada je malo vode potrebno za hitnije potrebe — kao što je piće, za očuvanje života, bilo sopstvenog ili tuđeg ili životinjskog. U svakom slučaju, šerijat stavlja očuvanje života i zdravlja iznad preferiranog metoda pročišćavanja.",
      "Pravnici se razilaze oko finijih pragova – koliko daleko treba tražiti vodu, koliko je straha od zla dovoljan – ali su jednoglasni oko temeljne milosti: obožavanje se nikada ne napušta, samo olakšava.",
    ],
    hadith: [
      {
        excerpt:
          "Izvještava se u poglavljima tayammum: koncesija za pročišćavanje čistom zemljom u nedostatku upotrebljive vode.",
      },
    ],
    actions: [
      "Pretražujte razumno vodu prije nego što pribjegnete tayamumu.",
      "Ako doktor savjetuje da ranu ili bolest održavate suhom, postupite prema tome i obavite tayammum.",
    ],
  },
  {
    title: "Korak po korak Tayammum",
    summary: "Kratka, jednostavna sekvenca za valjano suho pročišćavanje.",
    body: [
      "Tayammum je namjerno kratak - odraz njegove svrhe kao ustupka u teškoćama. Izvodi se sa čistom, prirodnom zemljanom površinom: zemljom, pijeskom, kamenom ili prašinom. Njegova suština, od Poslanikove, sallallahu alejhi ve sellem, vlastite demonstracije do 'Ammara ibn Yasira, je jedan udarac dlanovima o čistu zemlju, zatim brisanje lica i ruku.",
      "Ovo je po dizajnu lakše od vudua, tako da mu nemojte dodavati komplikacije.",
    ],
    steps: [
      {
        title: "Formirajte namjeru",
        body: "Namjeravaju da uklone ritualnu nečistoću kako bi se klanjali.",
      },
      {
        title: "Reci Bismillah",
        body: "Počnite u ime Allaha.",
      },
      {
        title: "Udari jednom sa oba dlana o čistu zemlju",
        body: "Lagano stavite dlanove na čistu, prašnjavu, prirodnu površinu.",
      },
      {
        title: "Obriši lice",
        body: "Obrišite cijelo lice jednom s obje ruke.",
      },
      {
        title: "Obriši ruke",
        body: "Većina učenjaka obrišite stražnje strane šaka - do zapešća.",
        tip: "Dosljedno slijedite metod jedne škole (ručni zglobovi nasuprot podlakticama).",
      },
    ],
    hadith: [
      {
        excerpt:
          "Poslanik, sallallahu alejhi ve sellem, udario je dlanovima po zemlji, a zatim obrisao lice i ruke – učeći 'Ammara da je ovo dovoljno. ('Ammar ibn Yasir)",
      },
    ],
  },
  {
    title: "Šta lomi Tayammum?",
    summary: "Poništeno uobičajenim razbijanjem vudua — i vraćanjem upotrebljive vode.",
    body: [
      "Tayammum koji se izvodi umjesto vudua poništava se svim onim što narušava vudu: olakšanjem, prolaznim vjetrom, dubokim snom i tako dalje. Tayammum umjesto gusla dodatno je poništen bilo čim što uzrokuje veliku nečistoću.",
      "Jedinstveno, tayammum se također okončava vraćanjem njegovog uzroka koji se uklanja - naime, dobivanjem pristupa upotrebljivoj vodi. Kada se voda nađe i može se koristiti, koncesija prestaje i osoba se vraća na vudu ili gusl.",
      "Praktična stvar milosti: ako ste valjano klanjali sa tayammumom i tek nakon toga našli vodu, većina smatra da obavljenu molitvu ne treba ponavljati – obavljena je ispravno prema rješenju koje je tada važilo. Ali ako se voda pojavi prije molitve, morate je koristiti.",
    ],
    actions: [
      "Ponovo provjerite ima li dostupne vode na početku svake molitve.",
      "Čim se voda može koristiti, vratite se na prečišćavanje vodom bez odlaganja.",
    ],
    disclaimer:
      "Neki detalji - kao što je da li se molitva ponavlja nakon što se voda nađe u svom vremenu - razlikuju se u zavisnosti od škole.",
  },
  {
    title: "nečistoće (Najasah)",
    summary: "Fizička prljavština koja se mora ukloniti sa tijela, odjeće i mjesta za molitvu.",
    body: [
      "Najasah (نجاسة) je opipljiva ritualna prljavština, različita od ritualnih stanja hadisa. Dogovoreni jasni primjeri uključuju ljudski urin i izmet, krv koja teče, meso i iscjedak svinje i pljuvačku psa (koja zahtijeva posebno pranje). Uklanjanje nadžasa sa tijela, nošene odjeće i mjesta namaza je uslov za valjan namaz.",
      "Uklanjanje se vrši vodom gdje je prljavština opipljiva, pranjem dok ne nestane supstanca i njen trag. Islam također ozbiljno tretira izvore nadžasa: Poslanik, sallallahu alejhi ve sellem, je upozorio da veliki dio kazne kabura dolazi od nepažnje s urinom – prskanja mokraćom i neispravnog čišćenja.",
      "Škole se razlikuju oko klasifikacije nekih supstanci (na primjer, da li su male količine određenih tečnosti opravdane) i oko toga koje se količine u tragovima tolerišu. Primjenjiv princip za svakodnevni život: temeljito očistite i ne izazivajte sumnju u čistoću tamo gdje nema tragova prljavštine.",
    ],
    hadith: [
      {
        excerpt:
          "Poslanik, sallallahu alejhi ve sellem, prošao je dva groba i rekao da su njihovi stanovnici kažnjeni - jedan zbog širenja klevete, a drugi zato što se nije zaštitio od svoje mokraće. (Ibn 'Abbas; također Sahih Musliman 292)",
      },
    ],
  },
  {
    title: "Čišćenje odeće od nečistoća",
    summary: "Kako oprati odeću da bi molitva u njoj bila validna.",
    body: [
      "Kada najasah dospije na odjeću, operite zahvaćeno područje vodom dok se sama supstanca i njen vidljivi trag ne uklone. Poslanik, sallallahu alejhi ve sellem, je uputio ženu čija je odjeća bila umrljana menstrualnom krvlju da je ostruže, zatim protrlja vodom, zatim opere i da u njoj klanja.",
      "Ako nakon iskrenog i temeljitog truda ostane slaba mrlja boje ili blagi miris koji neće izaći, većina učenjaka opravdava ono što je zaista teško ukloniti - obaveza je ukloniti supstancu, a ne garantirati besprijekornu boju.",
      "Neki slučajevi imaju svoje dobro poznate detalje, kao što je urin dojenog dječaka (poškropljen, a ne potpuno opran, u prijavljenoj koncesiji) — pa naučite praktična pravila vaše škole za situacije s kojima se zapravo suočavate.",
    ],
    hadith: [
      {
        excerpt:
          "Što se tiče menstrualne krvi na odjeći: ostružite je, zatim istrljajte vodom, zatim je operite i molite u njoj. (Asma bint Abi Bakr)",
      },
    ],
    actions: [
      "Sačuvajte barem jednu čistu odjeću ostavljenu za molitvu.",
      "Ako prljavština dotakne vašu odjeću daleko od kuće, isperite ono što možete i promijenite kad god je to moguće.",
    ],
  },
  {
    title: "Čišćenje tela",
    summary: "Uklanjanje prljavštine iz tijela, te bonton istinja i higijene.",
    body: [
      "Prljavština sa tijela se mora oprati prije namaza, u okviru svojih mogućnosti. Najčešći slučaj je čišćenje nakon korištenja toaleta — istinja — koje se vrši vodom, ili odgovarajućim suhim materijalom, dok se prostor ne očisti. Poslanik, sallallahu alejhi ve sellem, je učio pažljivom čišćenju nakon nužde i zabranio je korištenje desne ruke za to.",
      "Osim uklanjanja prljavštine, Islam potiče osnovnu liniju prirodne higijene (fitrah) koja održava tijelo čistim i spremnim za ibadet: podrezivanje noktiju, uklanjanje dlaka ispod pazuha i stidnih dlačica i slično, na redovnoj osnovi.",
      "Ove prakse nisu samo kulturološke ljepote – one su dio dostojanstva i čistoće s kojima se vjernik predstavlja pred Allahom u molitvi.",
    ],
    hadith: [
      {
        excerpt:
          "Poslanik, sallallahu alejhi ve sellem, se čistio vodom nakon što se olakšao. (Anas)",
      },
    ],
    actions: [
      "Uvijek obavite istinju prije klanjanja nakon korištenja toaleta.",
      "Nosite maramice i, gdje možete, sredstvo za vodu dok putujete.",
    ],
  },
  {
    title: "Čišćenje molitvenih mjesta",
    summary: "Mjesto za molitvu mora biti bez poznate prljavštine - bez neosnovane sumnje.",
    body: [
      "Mjesto molitve mora biti oslobođeno poznatih nadžasa. Poslanik, sallallahu alejhi ve sellem, je ovo slikovito poučavao: kada je jedan beduin urinirao u uglu džamije, spriječio je ashabe da ga oštro ukore, pustio ga da završi, a zatim naredio da se mjesto prolije kantom vode – podučavajući ga čistoći i blagosti.",
      "Glavno pravilo je sigurnost. Zemlja je općenito napravljena mjestom za molitvu, tako da se površina smatra čistom osim ako nemate stvarne dokaze prljavštine. Ako znate da je nečistoća prisutna, uklonite je ili premjestite na čisto mjesto; ako samo zamislite da bi moglo biti tu, zanemarite šapat i nastavite.",
      "Ova ravnoteža čuva obožavanje iz dvije krajnosti: nemarno moliti na očigledno zaprljanom tlu i biti paraliziran neosnovanom sumnjom o svakoj površini.",
    ],
    hadith: [
      {
        excerpt:
          "Kada je beduin urinirao u džamiju, Poslanik, sallallahu alejhi ve sellem, je naredio da se polije preko nje kantom vode. (Ebu Hurejre)",
      },
    ],
    actions: [
      "Prije namaza pogledajte svoju prostirku i pod.",
      "Bez pravih dokaza prljavštine, odbacite neosnovane sumnje i molite se.",
    ],
  },
  {
    title: "Hayd i Purity",
    summary: "Menstruacija i postnatalno krvarenje nose svoja vlastita pravila pročišćavanja.",
    body: [
      "Za vrijeme menstruacije (hayd) i postporođajnog krvarenja (nifas), žena ne klanja, a - milošću vjere - namaza propuštena u tom vremenu se ne nadoknađuje kasnije. Ovo je riješeno: kada su Aišu pitali zašto žena koja ima menstruaciju čini svoje postove, ali ne i namaz, ona je potvrdila da im je to naređeno.",
      "Post je drugačiji: postovi propušteni u ramazanu zbog menstruacije se naknadno nadoknađuju, dok se namaz jednostavno ukida. Kada se krvarenje završi i pojavi se znak čistoće, žena obavlja gusl i nastavlja molitvu i post.",
      "Tačna minimalna i maksimalna trajanja hajda i nifasa, te kako čitati granične znakove čistoće, stvari su po kojima se škole razlikuju u detaljima. Žene imaju koristi od učenja praktičnih pravila jedne pouzdane škole sa kvalifikovanim nastavnikom.",
    ],
    hadith: [
      {
        excerpt:
          "Upitana zašto žena koja ima menstruaciju posti, ali ne i namaz, Aiša je rekla: nama je naređeno da nadoknadimo postove, a nije nam naređeno da nadoknadimo namaz. (Mu'adhah, od Aiše; također Sahih Musliman 335)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Često postavljana pitanja",
    summary: "Kratki odgovori na najčešće nedoumice i nedoumice o pročišćenju.",
    body: [
      "Da li sumnja lomi moj vudu? Ne. Ako ste imali vudu i jednostavno niste sigurni da li ste ga prekršili, vaš vudu stoji sve dok ne budete sigurni u poništaj. Djelovanje na osnovu sigurnosti u odnosu na sumnju je proročki princip koji vas štiti od opsesivne sumnje (waswas).",
      "Šta je sa gipsima, zavojima i ranama? Postoje ustupci. Tamo gdje je pranje pokrivenog uda štetno, možete prebrisati zavoj (mash 'ala al-jabirah) umjesto njega, a tayammum pokriva ono što se ne može dosegnuti - detalji se razlikuju u zavisnosti od škole i situacije.",
      "Šta ako uopće ne mogu koristiti vodu? Tayammum sa čistom zemljom ostaje u potpunosti važeći dok se ne vrati mogućnost korištenja vode.",
      "Šta je sa hroničnim stanjima - kontinuiranim krvarenjem (istihadah) ili inkontinencijom? Osoba se tretira kao jedno sa stalnim izgovorom (ma'dhur): čiste se i čine vudu za vrijeme svakog namaza, zatim klanjaju čak i ako se pražnjenje nastavi, i to ne poništava taj namaz.",
    ],
    actions: [
      "Ne dozvolite da stalna sumnja blokira vaše obožavanje – slijedite sigurnost, a ne sumnju.",
      "Za hronična stanja ili složene slučajeve, zatražite personalizovanu odluku od kvalifikovanog naučnika.",
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Ovi odgovori na najčešća pitanja su obrazovni sažeci, a ne lična fetva. Kompleksne ili hronične slučajeve treba razmotriti lokalni naučnik.",
  },
  {
    title: "Reference i dalje studije",
    summary: "Ključni kur'anski ajeti i poglavlja hadisa o čišćenju.",
    body: [
      "Temeljni kur'anski tekst za čišćenje je ajet za abdest, sura al-Ma'idah 5:6, koji zajedno izlaže vudu, gusl i tayammum; pored toga, 2:222 ('Allah voli one koji se čiste') i stihovi o čistoći vode (25:48) učvršćuju ovu temu.",
      "U Sunnetu, primarni izvori su Knjige o pročišćenju (Kitab al-Taharah / al-Wudu / al-Ghusl / al-Hayd) koje otvaraju Sahih al-Buhari i Sahih Musliman, nakon čega slijede ista poglavlja u četiri sunena (Ebu Davud, at-Tirmizi), koji ga preciziraju sa Ibn-Nesa'ijem. ocjenjivanje.",
      "Za primijenjena pravila, klasični priručnici o fikhu četiri sunitske škole daju detaljne stavove - a njihove razlike su legitimni dio tradicije, a ne nedostatak. Koristite ovaj modul za strukturirani pregled, a zatim produbite svoje učenje sa kvalifikovanim nastavnikom i osnovnim tekstovima.",
    ],
    quran: [{}, {}],
    hadith: [
      {
        excerpt: "Sveobuhvatna poglavlja o vuduu, guslu, tayamumu i hajdu koja otvaraju zbirku.",
      },
      {
        excerpt:
          "Knjiga pročišćenja — autentični izvještaji o tahara pravilima, bontonu i principima.",
      },
    ],
    actions: [
      "Slijedite jedan pouzdani nastavni plan i program kako biste izbjegli zabunu zbog raštrkanih odluka.",
      "Povremeno ponavljajte ove teme dok se praktično samopouzdanje ne učvrsti.",
    ],
    appLinks: [{}, {}],
  },
];

export const TAHARAH_CHECKLIST_BS: DeepPartial<TaharahChecklistItem>[] = [
  {
    title: "Vudu prije sabaja",
    hint: "Započnite dan u stanju čistoće kada je to moguće.",
  },
  {
    title: "Siwak / četkati zube",
    hint: "Sunnet prije vudua i prije namaza.",
  },
  {
    title: "Odjeća za molitvu bez nadžasa",
    hint: "Prije namaza provjerite ima li vidljivih nečistoća.",
  },
  {
    title: "Čisto mjesto za molitvu",
    hint: "Uklonite sve nečisto sa mjesta gdje molite.",
  },
  {
    title: "Obnovite vudu nakon poništavanja",
    hint: "Vjetar, san, toalet — zna se šta kvari vudu.",
  },
  {
    title: "Gusl po potrebi",
    hint: "Nakon veće nečistoće prestaje menstruacija ili postnatalno krvarenje.",
  },
];
