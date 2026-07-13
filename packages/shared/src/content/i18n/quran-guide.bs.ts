// Bosnian translation overlays for the Learn Qur'an content.
// Each overlay mirrors the order of its English source array in ../quran-guide*.ts
// (index-aligned); untranslated entries fall back to English. Only human-readable
// text is translated — ids, routes, surah/ayah numbers, collections, citations,
// grades, and Qur'an verse-reference labels stay in the English source.
import type {
  QuranGuideApplyChallenge,
  QuranGuideDailyLesson,
  QuranGuideLetter,
  QuranGuideMemorizationPlan,
  QuranGuidePronunciationPair,
  QuranGuideQuizQuestion,
  QuranGuideReadingLevel,
  QuranGuideStory,
  QuranGuideStructureLevel,
  QuranGuideTadabburPrompt,
  QuranGuideTajweedLesson,
  QuranGuideTheme,
  QuranGuideTimelineEvent,
  QuranGuideTopic,
  QuranGuideVocabEntry,
} from "../../types/quran-guide";
import type { DeepPartial } from "./localize";

export const QURAN_GUIDE_TOPICS_BS: DeepPartial<QuranGuideTopic>[] = [
  {
    title: "Uvod",
    summary: "Šta je Kur'an, zašto je objavljen i vrline učenja.",
    body: [
      "Riječ Kur'an dolazi od arapskog korijena qara'a, što znači recitirati ili čitati naglas — tako da Knjiga ima svoju svrhu u samom nazivu: namijenjena je da se iznova i iznova uči na jeziku iu srcu. U glavnom sunitskom vjerovanju Kur'an je doslovan, nestvoreni Allahov govor, objavljen na jasnom arapskom poslaniku Muhammedu, sallallahu alejhi ve sellem, preko meleka Džibrila tokom otprilike 23 godine, od prvih riječi u pećini Hira do malo prije Poslanikove smrti.",
      "To je posljednji spis poslat čovječanstvu, koji potvrđuje istinu u ranijim objavama datim Musau, Davudu i Isau (mir neka je s njima) i upotpunjuje poruku koju su prenijeli. Allah jasno opisuje njenu svrhu: ona je poslana 'kao uputa za čovječanstvo' - da izvede ljude iz tame zbunjenosti i idolopoklonstva u svjetlo tevhida, iskrenog obožavanja jedinog Allaha, poštenog karaktera i ozbiljne pripreme za život koji dolazi. Svaki prorok je pozvao na istu srž; Kur'an je njegov konačni, zaštićeni oblik.",
      "Učenje Kur'ana je samo po sebi ibadet, a ne samo čitanje informacija. Poslanik, sallallahu alejhi ve sellem, je učio da svako pojedinačno izgovoreno slovo zarađuje dobro djelo, a svako dobro djelo se umnožava barem desetostruko – tako da čak i početnik koji izgovori jedan red već akumulira nagradu. Na Kijametskom danu Kur'an će doći kao zagovornik, moleći se u ime onih koji su mu pravili društvo u ovom životu. Onaj ko ga tečno izgovara nalazi se u društvu plemenitih anđela-književnika, a onaj ko se spotakne o nju, boreći se da nauči, zarađuje dvostruku nagradu za trud.",
      "Pomaže da bude jasno šta Kur'an nije. Kur'an je Allahove vlastite doslovne riječi na arapskom jeziku, nepromijenjene od objave. Hadis – Poslanikove ﷺ izreke, postupci i tiha odobravanja – su odvojeni: oni objašnjavaju i demonstriraju Kur'an, ali su Poslanikov izraz, sačuvan kroz imenovane lance prenosilaca i ocjenjen od strane učenjaka kao sahih (vjerodostojan), hasan (dobar) ili da'if (weak). I jedno i drugo je objava i oba su obavezujuća, ali samo Kur'an se uči kao ibadet u namazu, a samo Kur'an je čudesni, neponovljivi Allahov govor.",
    ],
    quran: [
      {
        excerpt: "Mjesec ramazana u kojem je objavljen Kur'an kao uputa za čovječanstvo...",
      },
      {
        excerpt:
          "Reci: Kad bi se ljudi i džini okupili da proizvedu slično ovome Kur'anu, ne bi mogli...",
      },
    ],
    hadith: [
      {
        excerpt: "Ko prouči slovo iz Allahove Knjige dobija hasanu, a hasana se množi sa deset.",
      },
      {
        excerpt: "Čitajte Kur'an, jer će doći kao zagovornik za svoje drugove na Kijametskom danu.",
      },
      {
        excerpt:
          "Onaj ko je vješti u Kur'anu je sa plemenitim, ispravnim pisarima, a onaj ko ga uči s mukom, mucajući nad njim, ima dvostruku nagradu.",
      },
    ],
    actions: [
      "Odredite fiksno dnevno vrijeme za Kur'an — čak i pet fokusiranih minuta gradi baraku i dosljednost.",
      "Pročitajte barem jedan red sa značenjem: recitujte arapski, a zatim polako čitajte prijevod.",
      "Otvorite Munibov čitač Kur'ana i nastavite tačno tamo gdje ste stali.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kako je objavljen Kur'an",
    summary: "Pećina Hira, Džibril, Mekanski i Medinanski periodi, kompilacija, očuvanje.",
    body: [
      "Objava je počela u mjesecu ramazanu, kada je Poslanik, sallallahu alejhi ve sellem, imao četrdeset godina i kada se povukao u pećinu Hira na planini izvan Mekke radi samoće i razmišljanja. Tamo mu je anđeo Džibril došao i naredio: 'Čitaj!' Poslanik, sallallahu alejhi ve sellem, koji nije čitao ni pisao, odgovorio je da ne može - sve dok ga melek nije zagrlio i prenio prvih pet ajeta sure al-Alaq: 'Čitaj u ime Gospodara svoga koji je stvorio.' Potresen, vratio se kući svojoj ženi Hatidži, koja ga je uvjerila i odvela do svog rođaka Waraqah ibn Nawfala, učenog čovjeka koji je prepoznao meleka objave i potvrdio da je to isti glasnik koji je došao Musau.",
      "Uslijedila je kratka pauza u otkrovenju (fatra), period tišine zbog kojeg je Poslanik, sallallahu alejhi ve sellem, čeznuo za još; onda se to nastavilo i nastavilo u fazama do kraja njegovog života. Objava se nije spustila odjednom, već je poslana kao odgovor na događaje, pitanja i rastuće potrebe zajednice – postepeni metod koji Allah opisuje kao jačanje Poslanikovog srca i olakšavanje Knjige u životima ljudi.",
      "Mekanski period je trajao otprilike trinaest godina. Njegove sure su često kratke, ritmične i snažne; oni zabijaju temelje - Allahovu jedinstvo, sigurnost u proživljenje i odgovornost, priče ranijih poslanika koji su odbačeni, a zatim potvrđeni, i široki poziv na moralnu reformu u društvu ogrezlom u idolopoklonstvu i nepravdi.",
      "Nakon hidžre u Medinu 622. godine, muslimani više nisu bili nekolicina progonjenih, već zajednica koja je gradila društvo. Medinanske objave su općenito duže i detaljnije, postavljajući zakon i društveni poredak koji je potreban novom ummetu: specifičnosti namaza, zekata, posta, nasljedstva, braka i razvoda, ugovora, ratovanja i sporazuma, uz čvrste riječi za licemjere koji su potkopavali zajednicu iznutra.",
      "Očuvanje teksta počelo je još za Poslanikovog, sallallahu alejhi ve sellem, života. Ashabi su zapamtili objavu onako kako je došla, a pisari su je zapisivali na pergamentu, palminim stabljikama, kostima i kamenu pod neposrednim Poslanikovim, sallallahu alejhi ve sellem, nadzorom. Nakon što su mnogi ljudi koji sjećaju stradali u bici kod Yamame, Abu Bekr je naredio Zaydu ibn Thabitu da sakupi pisani Kur'an u jednu zbirku (suhuf). Kasnije, kako se carstvo širilo i dijalekti su varirali, Osman je dao izraditi mjerodavne kopije na dijalektu Kurejšija i poslati ih u glavne gradove, standardizirajući jedan pisani tekst za cijeli ummet.",
      "Sam Allah je garantovao zaštitu Kur'ana: 'Zaista, Mi smo podsjetnik spustili i zaista ćemo ga sačuvati.' To obećanje je ispunjeno kroz tri međusobno povezane mjere zaštite — masovno pamćenje u svakoj generaciji, pažljivo pisano prenošenje i neprekinuti lanci recitacije od učitelja do učenika (kiraat) koji sežu do Poslanika, sallallahu alejhi ve sellem. Za vjernika je ovo teološki znak; za historičara je to dokumentirana činjenica: Kur'an koji se danas uči je isti tekst otkriven prije četrnaest stoljeća.",
    ],
    quran: [
      {
        excerpt: "Zaista, Mi smo podsjetnik spustili i zaista, Mi ćemo ga sačuvati.",
      },
      {
        excerpt: "Čitaj u ime Gospodara svoga koji je stvorio…",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Struktura Kur'ana",
    summary: "114 sura, 30 džuzova, ajeta, Meki/Madani, poredak protiv objave.",
    body: [
      "Mus'haf — fizička kopija Kur'ana — sadrži 114 sura (poglavlja), od kojih svaka ima svoje ime, obično preuzeto od upečatljive riječi u sebi. Oni su uglavnom raspoređeni od najdužih do najkraćih, iako ne striktno: Al-Fatiha, kratko uvodno poglavlje, dolazi prvo kao kapija u Knjigu, a slijedi duga Al-Baqarah. Ovaj raspored je tawqifi - redoslijed je podučio Poslanika, sallallahu alejhi ve sellem, od strane Džibrila i nije red kojim su objavljeni ajeti. Dakle, slijed koji čitate u mus'hafu je namjeran i božanski fiksiran, a ne hronološki.",
      "Svaka sura je klasificirana kao Makki (objavljena prije Hidžre) ili Madani (objavljena nakon nje), a nekoliko sadrži stihove oba. Kao pravilo, Makki sure se koncentrišu na vjerovanje — tevhid, uskrsnuće i priče o prorocima — u kraćim, hitnijim odlomcima, dok Madani sure dodaju detaljne zakone i smjernice zajednice koje su potrebne uređenom društvu. Znati šta je ono što vam pomaže da pročitate suru u njenom ispravnom svjetlu.",
      "Za lakše čitanje, Kur'an je također podijeljen na 30 jednakih dijelova koji se zovu džuz (množina ajza), a svaki džuz na dvije polovine koje se zovu hizb, dajući ukupno 60 hizb. To je ono što čini ramazanski hatm - kompletiranje cijelog Kur'ana za mjesec dana - tako prirodnim: jedan džuz dnevno završava Knjigu za trideset dana, a pola džuza dva puta dnevno je još nježniji. Unutar svake sure ajeti (stihovi) su numerirani tako da se svaki odlomak može navesti precizno kao sura: ayah; standardni broj Medine je 6.236 ajeta, sa samo sitnim, dobro dokumentovanim razlikama u tome kako je nekoliko granica ajeta numerisano - sam tekst je identičan.",
      "Razumijevanje ove strukture pretvara nejasne namjere u konkretan plan. Možete se posvetiti fiksnom dnevnom dijelu, ciljati Juz Amma (posljednji, trideseti dio, pun kratkih sura) za pamćenje, pratiti jednu temu kao što je strpljenje u nekoliko sura ili zakazati kompletno čitanje oko Ramazana. Struktura je skela koja čini doživotnu vezu s Kur'anom ostvarivom.",
    ],
    quran: [
      {
        excerpt: "…Knjiga čiji su ajeti detaljno, arapski Kur'an za ljude koji znaju.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Naučite čitati",
    summary: "Sedam nivoa od abecede do tečnog recitovanja — za apsolutne početnike.",
    body: [
      "Gotovo svaki musliman žudi za čitanjem Kur'ana na njegovom izvornom arapskom jeziku, a to je cilj koji je potpuno dosegljiv u bilo kojoj dobi - bezbroj odraslih bez arapskog jezika nauči tečno recitirati. Razumijevanje prijevoda je vrijedno, ali recitovanje stvarnih arapskih riječi je samo po sebi ibadet i vrijedno je truda. Ovaj put vas vodi korak po korak od neprepoznavanja nijednog slova do čitanja stihova s ​​ispravnim izgovorom.",
      "Putovanje se kreće kroz sedam prirodnih faza. Nivoi 1 i 2 grade prepoznavanje slova - prvo 28 slova u njihovom izoliranom obliku, zatim kako se njihovi oblici mijenjaju na početku, sredini i kraju riječi. Nivo 3 uvodi harakat, male oznake (fatha, kasra, damma, sukun, shaddah, tanween) koje vam govore koji samoglasnik nosi svako slovo. Nivoi 4 i 5 su tamo gdje klikne: spajate slova u slogove i izgovarate cijele riječi, uključujući pravila za sunce i mjesec za određeni član 'al-'. Nivoi 6 i 7 prelaze na kratke stihove, a zatim glatko, tečno recitiranje uz primijenjena osnovna pravila tadžvida.",
      "Dvije navike sve ubrzavaju. Prvo, stalno slušajte kvalifikovanog recitatora i imitirajte tačno — Kur'an se prenosio na uho, od usta do usta, tako da je vaše uho vaš najbolji učitelj; kopirajte ritam, dužinu samoglasnika i oblik svakog zvuka. Drugo, ocrtajte i napišite slova, na papiru ili ekranu, jer ruka pojačava ono što oko i jezik uče.",
      "Jedno upozorenje: aplikacije i snimci su odlična podrška, ali vas ne mogu ispraviti na način na koji osoba može. Poslanik, sallallahu alejhi ve sellem, je učio Kur'an direktno od Džibrila i učio ga licem u lice ashabima, a taj živi lanac ispravljanja je način na koji je tačno učenje uvijek sačuvano. Pronađite lokalnog učitelja ili strukturirani internet tajweed program koji će vas saslušati i popraviti greške koje sami ne možete čuti.",
    ],
    actions: [
      "Proučavajte jedno slovo dnevno u odeljku za arapska slova — vidite ga, čujte, recite, napišite.",
      "Slušajte suru el-Fatiha u ponavljanju dok slijedite riječi u mushafu.",
      "Dogovorite učitelja - lokalnog ili online - da vas čuje kako recitujete i ispravljate svake sedmice.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tajweed",
    summary: "Pravila lijepog i ispravnog recitiranja — podnevni sakin, madd, vakuf i drugo.",
    body: [
      "Tajweed dolazi od korijena koji znači napraviti nešto izvrsno ili lijepo. Kao nauka, to znači dati svakom slovu ono što mu pripada — njegovu tačnu artikulaciju u ustima ili grlu (makhraj), njegove inherentne kvalitete (sifat) i pravilno vrijeme za samoglasnike i pauze. Ukratko, tedžvid je umjetnost učenja Kur'ana točno onako kako je objavljen.",
      "Ovo je važno jer Kur'an nije bilo koji tekst koji se može opušteno čitati. Spustio se sa već ugrađenim tedžvidom: Džibril ga je recitovao Poslaniku, sallallahu alejhi ve sellem, sa preciznim izgovorom, Poslanik, sallallahu alejhi ve sellem, ga je recitovao na isti način ashabima, a oni su ga neprekinuto prenijeli nama. Pogrešiti slovo nije mala stvar – pogrešno izgovoriti slovo može u potpunosti promijeniti riječ (na primjer, pobrkati naglašeno ص sa običnim س ili grlena slova ع i ح), a na nekim mjestima to mijenja značenje Allahovih riječi. Nauka o tadžvidu postoji da bi se zaštitila upravo od toga.",
      "Ne morate savladati sve odjednom. Osnovna pravila se uče redom: pravila podne sakine i tanween (izhar, idgham, iqlab, ikhfa), pravila meem sakinah, različite vrste madd (izduženje), qalqalah (svjetlo se odbija od određenih slova), ghunnah (nazalna rezonanca) i gdje se zaustavlja (kako se zaustavlja). Svaki od njih ima jasnu definiciju, svakodnevne primjere i nešto za vježbanje, a ovo središte prolazi kroz njih jedan po jedan.",
      "Čvrsto pravilo: učite tajvid na uho od kvalifikovanog učitelja, a ne samo iz knjiga ili aplikacija. Recituj nekome ko može čuti tvoje greške i ispraviti ih — tako se oduvijek učio tedžvid, i to je jedini pouzdan put do prave tačnosti i, na kraju, idžaze (ovjerenog lanca recitacije).",
    ],
    hadith: [
      {
        excerpt: "Najbolji od vas su oni koji uče Kur'an i podučavaju ga.",
      },
      {
        excerpt:
          "Onaj ko je vješti u Kur'anu je sa plemenitim, ispravnim pisarima, a onaj ko ga uči s mukom, mucajući nad njim, ima dvostruku nagradu.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "arapska slova",
    summary: "Interaktivna abeceda — ime, zvuk, primjeri za svako od 28 slova.",
    body: [
      "Arapsko pismo ima 28 slova, pisanih i čitanih s desna na lijevo. Za razliku od engleskog, većina slova se povezuje sa slovima pored njih, tako da jedno slovo može imati malo drugačiji oblik u zavisnosti od toga da li stoji samostalno ili se nalazi na početku, sredini ili kraju reči. Naučiti uočiti isto slovo u različitim oblicima jedno je od prvih pravih otkrića.",
      "Kur'anski arapski sloj stavlja nekoliko dodatnih značajki povrh osnovnih slova: hamza (glotalna stanica), slova dugih samoglasnika alif, waw i ya koja protežu zvuk, i pravilo slova sunca i mjeseca koje odlučuje da li se 'l' određenog člana 'al-' izgovara ili se nečujno spaja u sljedeće slovo. Ovo je jednostavno kada ih upoznate stvarnim riječima.",
      "Svaka kartica sa slovom u ovom odjeljku daje vam izolirani oblik slova, njegovo ime, transliteraciju, praktičan savjet za izgovor i stvarne kur'anske primjere tako da zvuk naučite u kontekstu, a ne u apstraktnom obliku. Najefikasnija rutina je petlja u četiri koraka za svako slovo: pogledajte ga, slušajte kako se recituje, izgovorite ga sami naglas, a zatim ga napišite.",
      "Usidrite svako novo slovo za riječi koje možda već prepoznajete - Allah, Rabb (Gospodin), ar-Rahman (Najmilosrdniji), Bismillah. Povezivanje nepoznatih oblika sa poznatim značenjem čini da se lepe mnogo brže od bušenja slova u izolaciji.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Pronunciation",
    summary: "Savladajte teška slova - ayn, ha, tužno, tata, qaf i emphatics.",
    body: [
      "Arapski sadrži nekoliko zvukova koji nemaju tačan ekvivalent u engleskom jeziku, i tu najčešće proklizavaju govornici kojima nije maternji jezik. Najčešća zabuna je između slova koja neuvježbanom uhu zvuče slično, ali se izgovaraju s različitih mjesta u ustima ili grlu - a njihovo miješanje može promijeniti značenje riječi, zbog čega zaslužuju posvećeno vježbanje.",
      "Naglašena slova — ṣ (ص), ḍ (ض), ṭ (ط) i ẓ (ظ) — su 'teške' verzije lakših slova. Da biste ih proizveli, podižete stražnji dio jezika i ispunite usta punijim, dubljim zvukom, nešto što izvorni govornici upijaju u djetinjstvu, ali učenici moraju svjesno graditi. Uporedite svaki emfatički direktno sa njegovim lakim parnjakom: س protiv ص, د protiv ض, ت protiv ط, ذ protiv ظ.",
      "Druga velika prepreka su grlena slova. Ayn (ع) je glasovno stezanje iz sredine grla, a ha (ح) je snažno trzanje disanja - ni jedno ni drugo ne postoji na engleskom, i nijedan pisani opis u potpunosti ne zamjenjuje njihovo slušanje. Qaf (ق) je duboko 'k' sa samog stražnjeg dijela jezika, za razliku od prednjeg kafa (ك).",
      "Pouzdan metod je da uporedite parove jedan pored drugog, a zatim proverite da li ste spori i jasni recitaciji muratala. Snimite svoj glas kako recituje kratku reč, odsvirajte je protiv recitatora i prilagodite. Još bolje, neka vas sasluša kvalifikovani nastavnik — neke greške je gotovo nemoguće uhvatiti u vlastitom snimku.",
    ],
    appLinks: [{}],
  },
  {
    title: "Kur'anski vokabular",
    summary: "Riječi visoke frekvencije — razumite više svaki put kada recitujete.",
    body: [
      "Evo jedne ohrabrujuće činjenice: relativno mali skup visokofrekventnih riječi — reda veličine nekoliko stotina — čini veoma veliki udio u tekućem tekstu Kur'ana, jer se iste ključne riječi ponavljaju iznova i iznova. Učenje tog osnovnog vokabulara jedini je korak s najvećim uticajem koji možete poduzeti, jer pretvara recitaciju iz toka zvuka u riječi čije značenje zapravo shvaćate dok čitate.",
      "Vi ne prevodite Kur'an riječ po riječ na ovaj način – to je djelo tefsira i prijevoda – ali počinjete prepoznavati Allahova imena, naredbe, obećanja i upozorenja uživo, u trenutku recitiranja. Počnite s riječima koje se najčešće pojavljuju i imaju najveću težinu: Allah, Rabb (Gospodin), rahmah (milost), iman (vjera), sabr (strpljenje), taqwa (svijest o Bogu), dunya (ovaj svijet) i akhirah (Ahiret). Iz tog seta sidra, širite se prema van malo po jedan.",
      "Koristite razmaknuto ponavljanje umjesto nabijanja. Učenje pet novih riječi sedmično i svakodnevno pregledavanje svih njih odvešće vas daleko dalje za godinu dana nego da ih naučite napamet u jednom dahu i zaboravite ih. Allah obećava da je Kur'an lako uzet k srcu - postepeno pristupajte njegovom rječniku i osjetit ćete tu lakoću iz prve ruke.",
    ],
    quran: [
      {
        excerpt: "A Mi smo svakako učinili Kur'an lakim za pamćenje, pa ima li ko da se sjeća?",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Tafsir",
    summary: "Razumijevanje otkrivenja — pregled, kontekst i priznati naučni izvori.",
    body: [
      "Tefsir znači objašnjenje i tumačenje Kur'ana – pojašnjavanje šta znači ajet, zašto je objavljen i kako se primjenjuje. Budući da su ovo Allahove riječi, učenjaci su uspostavili strogi poredak autoriteta za to kako Kur'an treba objasniti, a ostanak unutar njega štiti vas od grešaka.",
      "Najzvučniji tefsir je Kur'an koji sam sebe objašnjava: ajet koji je kratak na jednom mjestu često se proširuje na drugom mjestu, tako da je Kur'an njegov najbolji komentar. Slijedi objašnjenje od strane Sunneta, budući da je Poslanik, sallallahu alejhi ve sellem, poslan upravo da razjasni objavu, a njegove riječi i praksa nam pokazuju kako se to živjelo. Nakon toga dolazi razumijevanje ashaba, koji su svjedočili otkrovenju i direktno poznavali njegov kontekst, a zatim i velikih učenjaka koji su došli poslije njih. Posljednje i najniže je tumačenje od strane samog arapskog jezika. Ono čemu uopće nije mjesto je bezuslovno lično mišljenje – učitavanje vlastitih ideja u tekst.",
      "Ključno oruđe u tefsiru je asbab al-nuzul, prilike objave: poznavanje događaja ili pitanja koje je potaknulo ajet često otključava njegovo značenje. Ali ti izvještaji moraju sami biti ovjereni, jer nije svaka ispričana 'prilika' pouzdana. Za svaku suru, dobar tefsir vam daje svoje istorijsko okruženje tamo gdje je uspostavljeno, njegove glavne teme, ključne ajete i praktične lekcije koje možete ponijeti.",
      "Među najpriznatijim i najpouzdanijim referencama su Tafsir Ibn Kathir (sveobuhvatan i pažljiv citiranje hadisa i izreka ranih generacija), Tafsir as-Sa'di (jasan, savremeni i fokusiran na praktične smjernice) i klasični Tafsir al-Tabari (enciklopedijski prevoditelj, čuvar enciklopedije). Kad god saznate neko značenje, zabilježite iz kojeg izvora dolazi. Ovo čvorište podučava metodologiju; koristite Munibov čitač Kur'ana, koji povezuje povezani i udaljeni tefsir, za proučavanje stiha po stih.",
    ],
    sources: [
      "Tefsir Ibn Kathir — skraćeni engleski široko dostupan",
      "Tefsir as-Sa'di — dostupni sažeci",
      "Asbab al-Nuzul od al-Wahidija — prilike otkrivenja (provjeriti autentičnost po incidentu)",
    ],
    disclaimer:
      "Tefsir varira u dubini. Kada se učenjaci razlikuju, primijetite razliku bez traženja sigurnosti tamo gdje Allah to nije jasno objasnio.",
    appLinks: [{}],
  },
  {
    title: "Teme Kur'ana",
    summary: "Vjera, molitva, strpljenje, milosrđe, proroci — stihovi grupirani po temama.",
    body: [
      "Kur'an nije postavljen kao udžbenik, jedan predmet po poglavlju. Umjesto toga, njegove velike teme - Allahova jednoća, namaz, strpljenje, dobročinstvo, poslanici, ahiret, pravda, porodica - su protkane svuda, pojavljuju se i ponovo pojavljuju u mnogim surama, svaki put iz novog ugla. Ono što na prvi pogled izgleda kao ponavljanje je zapravo pojačanje: tema se uvodi, zatim produbljuje, a zatim povezuje s drugom, sve dok cijela poruka ne postane kao jedan koherentan poziv.",
      "Proučavanje Kur'ana po temama otkriva to jedinstvo. Kada sakupite ono što Kur'an kaže o, recimo, zahvalnosti ili povjerenju u Allaha iz njegovih sura, odvojeni ajeti osvjetljavaju jedni druge i lekcija postaje živa i potpuna. Svaki unos teme u ovom čvorištu objedinjuje relevantne stihove, podržavajući autentične hadise gdje dodaju jasnoću, osnovne lekcije i konkretne radnje tako da znanje ne ostane teorijsko.",
      "Iznad svega, povežite teme sa svojim životom. Ljubaznost prema roditeljima, poštenje u poslu, poštenje u braku, zalaganje za pravdu čak i protiv vlastitog interesa — ovo nisu apstraktna poglavlja kojima se treba diviti, već svakodnevne odluke koje Kur'an traži od vas. Čitajte svaku temu kao pitanje upućeno vama lično: kako ovo mijenja ono što danas radim?",
    ],
    appLinks: [{}],
  },
  {
    title: "Priče u Kur'anu",
    summary:
      "Poslanici od Adama do Muhammeda sallallahu alejhi ve sellem — lekcije, lokacije, povezani ajeti.",
    body: [
      "Kur'an govori o prorocima - Adamu, Nuhu, Ibrahimu, Jusufu, Musau, Isau i mnogim drugima - i jasno nam govori zašto: 'U njihovim pričama je lekcija za one koji razumiju.' Ovi izvještaji nisu folklor ili zabava. Oni su instrukcija, izabrana i rečeno od Allaha da nauče vjeru, strpljenje i kako se suočiti s istim iskušenjima koja se ponavljaju u svakom dobu.",
      "Obratite pažnju na obrazac koji se provlači kroz njih. Poslanici su pozivali svoj narod na obožavanje samo Allaha; izrugivali su im se, suprotstavljali im se i često su ih isterivali; izdržali su sa strpljenjem i potpunim oslanjanjem na Allaha (tawakkul); i na kraju se Allahovo obećanje ispunilo. Kada čitate o njihovim teškoćama, crpite snagu iz toga kako su reagovali - a da niste ni zamislili da je vaš rang jednak njihovom. Poenta je apsorbirati njihovu postojanost i povjerenje, a ne uspoređivati ​​status.",
      "Sam Kur'an izdvaja jednu pripovijest: suru Jusuf, koju Allah naziva 'najboljom pričom'. Neobično, ispričana je od početka do kraja u jednoj suri, pa je čitajte u jednom dahu kao neprekidno putovanje – izdaju, strpljenje kroz ropstvo i zatvor, i na kraju oprost i ponovno okupljanje – i gledajte kako se Allahov plan odvija iza godina prividne nesreće.",
    ],
    quran: [
      {
        excerpt: "U njihovim pričama je svakako lekcija za one koji razumiju…",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Čuda Kur'ana",
    summary: "Jezička neponovljivost, očuvanje, proročanstva — sa naučnim oprezom.",
    body: [
      "Centralno čudo Kur'ana je sam Kur'an. Otkrivena nepismenom čovjeku u najrječitijem dobu arapske poezije, postavila je otvoreni izazov svojim najžešćim protivnicima - majstorima jezika - da proizvedu čak i jednu jedinu suru poput nje. Četrnaest vekova kasnije taj izazov ostaje nerešen. Njegova retorička snaga, struktura, način na koji se njegove teme prepliću i koherentnost njegovih smjernica i zakona proučavaju se u klasičnoj nauci elokvencije (ilm al-balagha), i oni ostaju, prema vlastitoj tvrdnji Kur'ana, neponovljivi.",
      "Njegovo očuvanje je drugi, provjerljivi znak. Tekst je zaštićen kako u pisanoj formi, kroz pažljivo prenošene rukopise, tako i usmeno, kroz kiraat — neprekinute lance recitatora koji ga tačno pamte i uče, generaciju za generacijom. Ovo je dokumentirana historija, a ne pobožna spekulacija, i ispunjava Allahovo vlastito obećanje da će čuvati Podsjetnik.",
      "Čućete i o 'naučnim čudima' — stihovima koji se dotiču faza embriona, širenja kosmosa i slično. Pažljivo postupajte s njima. Klasični tefsir često je shvaćao takve stihove na način koji je sasvim drugačiji od modernih apologeta, a prisiljavanje Kur'ana da odgovara svakoj promjenjivoj naučnoj hipotezi može se izjaloviti kada se teorije promijene. Čvrsto razlikovati ustaljeno tumačenje i savremena pretpostavka.",
      "Učenjaci također navode historijska proročanstva - prorečena pobjeda Rimljana, mirno otvaranje Mekke - i ona su vrijedna proučavanja, ali kroz trezvene tefsir i serah, a ne senzacionalne video klipove. Najjači argument za Kur'an je uvijek bio njegov tevhid, njegova moralna transformacija naroda i njegov jezik i očuvanje bez premca.",
    ],
    quran: [
      {
        excerpt: "Onda proizvedi suru poput ove... ako si iskren.",
      },
    ],
    disclaimer:
      "Izbjegavajte prenaglašene naučne čudesne tvrdnje koje dovode u neugodnost dawah kada se pažljivo ispitaju. Vodite tevhidom, moralom i lingvističkim i historijskim dokazima Kur'ana.",
  },
  {
    title: "pamćenje (Hifz)",
    summary: "Planovi od Juz Amme do punog hifz-a — revizija, audio, dnevni ciljevi.",
    body: [
      "Učenje Kur'ana napamet (hifz) je jedno od najplemenitijih poslova u životu vjernika, i nije rezervirano za učenjake ili djecu – završavaju ga i odrasli. Poslanik, sallallahu alejhi ve sellem, je učio da će na Kijametskom danu onome ko je nosio Kur'an biti rečeno: 'Uči i uspinji se', uzdižući se u rangu sa svakim ajetom. Počnite tamo gdje svi počinju: Sura al-Fatiha, koju već učite u svakoj namazi, zatim kratke sure na samom kraju mus'hafa, radeći unazad.",
      "Najvažnija lekcija u hifzu je kontraintuitivna: revizija (muraja'ah) je važnija od dodavanja novog materijala. Poslanik, sallallahu alejhi ve sellem, je upozorio da naučeni Kur'an izmiče brže nego što se vezana deva oslobodi – ostavite ga nerevidiranom i nestaje. Dakle, pravilo je jednostavno i strogo: nikada ne dodajte novi dio dok čvrsto ne revidirate ono što već imate. Malo napamet solidno pobeđuje mnogo napamet labavo.",
      "Praktična metoda: koristite razmaknuto ponavljanje, držite se jednog recitatora tako da vam sama melodija bilježi pamćenje, recitirajte iz pamćenja svakodnevno, a ne samo čitajući, i neka nastavnik sluša i označava vaše greške - greške koje sami ne možete čuti. Munibov hifz tracker bilježi napredak sve do pojedinačnog ayata tako da uvijek znate šta je potrebno za reviziju.",
      "Odaberite plan koji odgovara vašoj fazi. Početni: naučite napamet Juz Amma, posljednji dio, pun kratkih sura. Srednji: dodajte deset često recitiranih sura kao što su al-Mulk, Ya-Sin i al-Kahf. Napredno: dovršite potpuni džuz sa jakom revizijom svega prije. I putovanje hafiza: cijeli mus'haf, naučen napamet sa kvalifikovanim učiteljem i, u idealnom slučaju, sanedom — certificirani lanac prijenosa natrag do Poslanika, sallallahu alejhi ve sellem.",
    ],
    hadith: [
      {
        excerpt:
          "Reći će se ashabu Kur'ana: Uči i uzdiži se kao što si učio na svijetu, jer će tvoj rang biti na posljednjem ajetu koji učiš.",
      },
      {
        excerpt:
          "Parabola o ashabi u Kur'anu je ona o vlasniku privezane deve: ako je čuva, on je zadržava, a ako je pusti gubi je.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dnevne lekcije",
    summary: "Jedan stih, kontekst, razmišljanje i radnja — svaki dan.",
    body: [
      "Doživotna privrženost Kur'anu se gradi na isti način na koji se izgrađuje svaka duboka navika - pomalo, svaki dan, bez greške. Poslanik, sallallahu alejhi ve sellem, je učio da su Allahu najdraža djela ona koja se rade dosljedno, čak i ako su mala, i taj princip je cijela ideja iza svakodnevne lekcije. Svaki od njih vam daje jedan stih na arapskom, njegov prijevod, bilješku o svom istorijskom kontekstu, pitanje za razmišljanje s kojim ćete sjediti i jednu konkretnu akciju koju ćete provesti u svom danu.",
      "Tretirajte ove stihove kao živu smjernicu, a ne kao usputno čitanje. Označite one koji vam pogode srce, vratite im se i podijelite ono što vas je pokrenulo sa svojom porodicom - kada neko drugi djeluje na dobro koje ste prenijeli, njegova nagrada stiže i do vas, tako da učenje umnožava korist.",
      "Nemojte dozvoliti da vas mala veličina zavara. Dosljednost nadmašuje intenzitet svaki put: pet iskrenih minuta uz Kur'an svaki dan će vas transformisati mnogo više od rijetkog, herojskog sata jednom mjesečno. Pojavljujte se svakodnevno i pustite da se dani gomilaju.",
    ],
    appLinks: [{}],
  },
  {
    title: "Refleksija (Tadabbur)",
    summary: "Usmjerena pitanja – šta Allah uči i kako ćete to živjeti?",
    body: [
      "Tadabbur znači duboko razmišljati o Kur'anu, okretati ajet u srcu sve dok vas ne potakne da se promijenite. To je direktna naredba, a ne opcioni dodatak: Allah pita: 'Zar oni ne razmišljaju o Kur'anu, ili su im srci zaključani?' Svrha recitovanja nikada nije bila puki zvuk – bilo je doći do srca i preoblikovati život.",
      "Tadabbur nije isto što i tefsir. Tefsir je naučno objašnjenje šta ajet znači; tadabbur je vaš lični, pobožan odgovor na to značenje kada ga jednom shvatite. To dvoje rade zajedno: prvo naučite značenje zvuka od tefsira, a zatim sjedite s njim i pitate kako vam govori. Koristan okvir su tri pitanja — Čemu me Allah ovdje uči? Kako ovo mijenja ono što danas radim? Koju naviku moram izgraditi ili prekinuti zbog toga?",
      "Jedna čvrsta granica čuva tadabbur: razmislite o tome šta stih traži od vas, ali nikada ne izmišljajte nova značenja za sam tekst. Neka autentični tefsir postavi granice tumačenja i neka vaša lična razmišljanja budu na njihovom mjestu - privatni dnevnik, poput Munibovog, idealan je za bilježenje onoga što je neki ajet pokrenuo u vama i kasnije mu se vratite.",
    ],
    quran: [
      {
        excerpt: "Zar ne razmišljaju o Kur'anu, ili su im srca zaključana?",
      },
      {
        excerpt:
          "Pa zar onda ne razmišljaju o Kur'anu? Da je bilo od drugog mimo Allaha, oni bi u tome našli mnogo kontradiktornosti.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Primijenite Kur'an",
    summary: "Današnji izazov iz stiha — dovršite pjesmu, živite ajet.",
    body: [
      "Znanje Kur'ana treba da postane djelovanje. Allah je oštro kritikovao one prije nas koji su čitali Knjigu, ali su živjeli protiv nje: 'Da li naređujete pravednost drugima, a zaboravljate sebe dok čitate Pismo?' Kur'an je savez između vas i vašeg Gospodara, i svaki ajet tiho traži nešto od vas - pitanje je da li odgovarate.",
      "Tome služe ovi izazovi. Svaki od njih povezuje određeni stih sa jednim, izvodljivim ponašanjem za danas: čuvati svoj jezik ljubaznim govorom, davati tihu milostinju, spuštati pogled sa onoga što je zabranjeno, otpuštati ljutnju koju nosiš. Jedan stih, jedna radnja — dovoljno mala da se zaista uradi, dovoljno stvarna da vas promeni.",
      "Označite izazov završenim samo kada ste ga zaista uradili. Smisao praćenja nije prikazivanje – to bi poništilo svrhu – već poštena odgovornost pred Allahom, koji vidi ono što drugi ne vide. Vremenom, stih po stih, tako se recitacija pretvara u karakter.",
    ],
    quran: [
      {
        excerpt: "Da li naređujete pravednost drugima, a zaboravljate sebe dok čitate Sveto pismo?",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Kur'an kviz",
    summary: "Pregledajte nazive sura, strukturu, tadžvid, vokabular i priče.",
    body: [
      "Testiranje sebe je jedan od najefikasnijih načina da se znanje zadrži – prisjećanje odgovora jača pamćenje mnogo više od jednostavnog ponovnog čitanja. Ovaj kviz se oslanja na sve u čvorištu: broj sura i džuza, prvu objavu i način na koji je Kur'an sačuvan, pravila tedžvida kao što su madd i qalqalah, visokofrekventni vokabular i poslanike čije priče Kur'an priča.",
      "Održavajte namjeru ispravno. Skor je samo ogledalo za vaše učenje - to nikada nije mjera vašeg ranga kod Allaha, koji pripada samo Njemu. Iskoristite svako pitanje da otkrijete slabu tačku, a zatim se vratite na odgovarajuću lekciju i proučite upravo tu temu umjesto da jurite za brojem.",
      "Posljednji upit je razmišljanje, a ne pitanje sa ocjenom: odaberite jednu suru ili odlomak za razumijevanje i pamćenje sljedeće, tako da se vaš pregled uvijek završava upućivanjem na samu Knjigu.",
    ],
    appLinks: [{}],
  },
  {
    title: "Reference i izvori",
    summary: "Kako navodimo Kur'an, hadise, tefsir i razlike u učenosti.",
    body: [
      "Zdravo islamsko učenje je izgrađeno na transparentnim dokazima, tako da svaka lekcija u ovom centru ima za cilj da pokaže kako funkcionira. Tvrdnja o Kur'anu je potkrijepljena referencom u obliku surah:ayah; tvrdnja iz Sunneta imenuje zbirku (Buhari, Musliman, Tirmizi i tako dalje), broj hadisa i njenu ocjenu (sahih, hasan ili slabiji); tvrdnja o značenju ajeta imenuje tefsir iz kojeg dolazi; a tamo gdje se naučnici istinski razlikuju, razlika je prije uočena nego skrivena.",
      "Također je važno razlikovati ono što je sigurno od onoga što je interpretativno. Utvrđene činjenice - pet dnevnih namaza, očuvanje Kur'ana, glavni događaji u Sira - su jasno navedeni. Pitanja u kojima su se iskreni naučnici dugo razlikovali, kao što su fini detalji eshatologije ili čitanje naučnih aluzija, predstavljaju se kao tumačenje, a ne kao utvrđena sigurnost. Samopouzdanje treba da odgovara snazi ​​dokaza.",
      "Za dublje proučavanje, oslonite se na utvrđene reference: pouzdane prijevode Kur'ana (kao što su Sahih International ili Pickthall), primarne zbirke hadisa (Sahih al-Buhari i Sahih Musliman prije svega), uvaženi tefsir (Ibn Kethir i as-Sa'di) i pouzdani serah (klasik Ibn Hišama, klasik Ibn Hišama, i Nec'Male Thermad, i za moderan narativ).",
      "Konačno, saznajte ograničenja aplikacije. Munib vas obrazuje i upućuje na izvore, ali ne donosi vjerske odredbe. Za fikh recitacije, za tedžvid idžazu ili za bilo koje pitanje koje utiče na vaše ibadete ili životne odluke, konsultujte se sa kvalifikovanim učenjakom u vašoj školi i mjestu.",
    ],
    sources: [
      "Kur'an — King Fahd Complex print / autentificirani digitalni mushaf",
      "Hadis — unakrsna referenca za ocjenjivanje sunnah.com",
      "Tefsir Ibn Kethir (skraćeno Darussalam)",
      "Tafsir as-Sa'di (engleski)",
    ],
    disclaimer:
      "Munib agregira otvorene obrazovne sadržaje. Provjerite kritične stvari kod kvalificiranih učenjaka u vašem mezhebu i mjestu.",
  },
];

export const QURAN_GUIDE_STRUCTURE_LEVELS_BS: DeepPartial<QuranGuideStructureLevel>[] = [
  {
    count: "1 knjiga",
    detail:
      "Jedna knjiga — kelam Allah, doslovni Allahov govor, objavljen je Muhammedu, sallallahu alejhi ve sellem, preko meleka Džibrila, na jasnom arapskom jeziku, postepeno tokom otprilike 23 godine. To je isti pojedinačni tekst svuda u svijetu.",
  },
  {
    count: "114",
    detail:
      "Kur'an je podijeljen na 114 sura, u rasponu od samo tri ajeta do 286. Svaka ima ime, obično uzeto iz ključne riječi unutar njega, i klasificira se kao Makki ili Madani. Njihov redoslijed u mus'hafu je utvrđen objavom (tevkifi) i razlikuje se od reda objave.",
  },
  {
    count: "30",
    detail:
      "Trideset otprilike jednakih dijelova, osmišljenih da čitanje učini lakšim. Učenjem jednog džuza dnevno kompletira se cijeli Kur'an za mjesec dana - klasičan način da se završi hatm tokom Ramazana.",
  },
  {
    count: "60",
    detail:
      "Svaki džuz se dijeli na dva hizba, dajući ukupno 60, a svaki hizb dalje na četvrtine. Ove manje jedinice vam omogućavaju da postavite blagu dnevnu porciju — pola ili četvrtinu hizb — i da zadržite stalnu naviku.",
  },
  {
    count: "6,236",
    detail:
      "Pojedinačni ajeti, numerirani tako da se svaki odlomak može citirati precizno kao sura: ayah. 6,236 je standardni broj Medine; druge istorijske metode prebrojavanja razlikuju se samo po tome kako su označene granice nekoliko stihova — same riječi su identične.",
  },
  {
    count: "2 ere",
    detail:
      "Svaka sura pripada jednoj od dvije ere objave. Mekijske (prije Hidžre) sure su često kraće i fokusirane su na vjerovanje, tevhid i ahiret. Madani (nakon hidžre) sure su često duže i dodaju zakon i smjernice zajednice. Nekoliko sura sadrži stihove iz oba.",
  },
  {
    count: "Mnogi",
    detail:
      "Kur'an je satkan oko ponavljajućih tema, a ne organiziranih tema po temu. Tevhid, namaz, priče o vjerovjesnicima, porodici, dobročinstvu, strpljenju i ahiretu protežu se kroz Knjigu, potkrepljujući jedni druge u mnogim surama.",
  },
];

export const QURAN_GUIDE_TIMELINE_BS: DeepPartial<QuranGuideTimelineEvent>[] = [
  {
    title: "Život prije otkrivenja",
    body: "U godinama prije poslanstva, Muhammed sallallahu alejhi ve sellem se povlačio u pećinu Hira na dane samoće i kontemplacije, uznemiren idolopoklonstvom i nepravdom mekanskog društva. Iako je svijet oko njega obožavao idole, on to nikada nije činio, a njegovi ljudi su mu toliko vjerovali da su ga zvali al-Amin - pouzdani - mnogo prije nego što je ikada tvrdio da je prorok.",
    location: "Mekka",
  },
  {
    title: "Pećina Hira",
    body: "Tokom mjeseca Ramazana, kada mu je bilo oko četrdeset, melek Džibril mu je došao u pećinu sa jednom naredbom: 'Čitaj!' Poslanik, sallallahu alejhi ve sellem, koji nije znao ni čitati ni pisati, odgovorio je da ne može. Melek ga je čvrsto zagrlio tri puta, a zatim prenio prve riječi sure al-Alaq — 'Čitaj u ime Gospodara svoga koji je stvorio.' Potresen, požurio je kući svojoj ženi Hatidži, koja ga je umotala u ogrtač i uvjerila.",
    location: "Jabal an-Nur, Meka",
  },
  {
    title: "Prva objava — Sura al-Alaq",
    body: "Naredba za čitanje označila je početak proroštva i silaska Kur'ana. Hatidža ga je odvela svom učenom rođaku Waraqah ibn Nawfalu, koji je prepoznao meleka kao istog poslanika koji je došao Musau i prorekao da će ga Poslanikov narod, sallallahu alejhi ve sellem, istjerati. Najranije mekanske objave koje su uslijedile fokusirale su se na Allahovu jedinstvo, sigurnost u ahiret i široki poziv na moralnu reformu.",
  },
  {
    title: "Rani mekanski period",
    body: "Prvih godina poziv je bio privatan, a zatim javni. Kako je rastao, Kurejšije su se okrenule progonu — mučenju slabih i porobljenih među vjernicima — i na kraju su nametnuli oštar trogodišnji bojkot Poslanikovom klanu, sallallahu alejhi ve sellem, Banu Hašimu. Da bi pobjegli od okrutnosti, grupa muslimana migrirala je u Abesiniju, gdje im je pravedni kršćanski kralj pružio utočište. Sure ovog doba obično govore kratkim, snažnim, ritmičnim stihovima.",
    location: "Mekka",
  },
  {
    title: "Hidžra u Medinu",
    body: "Nakon godina progona, i nakon 'godine tuge' u kojoj je izgubio Hatidžu i svog amidžu Ebu Taliba, Poslanik, sallallahu alejhi ve sellem, i njegovi drugovi su migrirali u Medinu. Ova hidžra je bila toliko ključna da je kasnije postala početak islamskog kalendara. U Medini muslimani više nisu bili progonjena manjina, već zajednica koja je uspostavila društvo, a objava je sada počela da se bavi zakonom, porodicom, ekonomijom i odnosima sa ljudima iz Knjige.",
    location: "Medina",
  },
  {
    title: "Medinanski period",
    body: "Medinske sure su generalno duže i detaljnije, postavljaju zakonodavstvo koje je potrebno uređenoj zajednici: specifičnosti namaza, zekata, posta, braka i razvoda, nasljeđivanja, ugovora i ugovora. U ovom periodu su se dogodile i velike bitke — Bedr, Uhud i Konfederati — a Kur'an je sa zapanjujućom jasnoćom obradio suđenja vjernicima i planove licemjera (munafiqun).",
    location: "Medina",
  },
  {
    title: "Oproštajno hodočašće",
    body: "Desete godine nakon Hidžre, Poslanik, sallallahu alejhi ve sellem, je obavio svoj jedini hadž i održao oproštajnu hutbu prije velikog okupljanja na Arefatu, podsjećajući ummet na svetost života i imovine, prava žena, jednakost svih ljudi bez obzira na rasu i dužnost da se čvrsto drže Kur'ana i Sunneta. Tu je objavljen ajet: 'Danas sam usavršio za tebe tvoju vjeru.'",
    location: "Arafat / Mina",
  },
  {
    title: "Kompilacija pod Ebu Bekrom",
    body: "Nedugo nakon Poslanikove smrti, mnogi drugovi koji su naučili cijeli Kur'an napamet ubijeni su u bici kod Yamame. Bojeći se gubitka huffaza, Omar je pozvao halifu Ebu Bekra da sakupi Kur'an na jednom mjestu. Ebu Bekr je imenovao povjerljivog pisara Zeyda ibn Thabita, koji je pažljivo sakupio pisanu objavu - verifikovanu u sjećanju ashaba - u jedan set listova (suhuf).",
  },
  {
    title: "Standardizirani Mushaf — Osman",
    body: "Kako se Islam širio po mnogim zemljama, razlike u recitovanju među novim muslimanima počele su izazivati ​​sporove. Kako bi objedinio ummet na jednom pisanom tekstu, halifa Osman je dao izraditi mjerodavne kopije Abu Bekrovog suhufa na dijalektu Kurejšija i poslao ih u veće gradove, tražeći da se ostale lične kopije odvoje. Ovaj osmanski mushaf je standard kojeg cijeli muslimanski svijet slijedi od tada.",
  },
  {
    title: "Očuvanje do danas",
    body: "Četrnaest stoljeća kasnije, Kur'an ostaje nepromijenjen, čuvan je sa tri međusobno povezana načina: masovnim pamćenjem (hifz) u svakoj generaciji, vjernim pisanim prijenosom i neprekinutim lancima učenja od učitelja do učenika (kiraat) koji sežu do Poslanika, sallallahu alejhi ve sellem. Ovo ispunjava Allahovo vlastito obećanje: 'Zaista, Mi smo podsjetnik spustili i zaista ćemo ga sačuvati.'",
  },
];

export const QURAN_GUIDE_STORIES_BS: DeepPartial<QuranGuideStory>[] = [
  {
    prophetName: "Adame",
    title: "Adam — prvi prorok i otac čovečanstva",
    summary: "Stvaranje, sedžda anđela, ispitivanje drveta, pokajanje prihvaćeno.",
    body: [
      "Allah je stvorio Adama, prvo ljudsko biće, Svojim vlastitim rukama od gline, udahnuo mu svoj duh i dao mu dar koje nije primilo nijedno drugo stvorenje: podučio je Adama imenima svih stvari. Kada je Allah pokazao ovo znanje, meleki su priznali svoje granice i Adamova čast je postala jasna - samo znanje je bilo dio onoga što je čovječanstvo razlikovalo.",
      "Allah je zatim naredio melekima da padnu na sedždu Adamu u čast, i svi su poslušali - osim Iblisa, koji je bio među džinnima. Odbio je iz arogancije, tvrdeći da je napravljen od vatre, a Adam od gline, pa je smatrao sebe superiornijim. Taj ponos, a ne neznanje, bio je njegov pad, i on se zakleo da će odvesti Adamove potomke na krivi put.",
      "Adam i njegova supruga Hawwa stavljeni su u vrt i rekli im da mogu slobodno uživati ​​u svemu, ali ne smiju prilaziti jednom određenom drvetu. Šejtan im je uporno šaputao dok nisu jeli od toga. Odmah im je postala očigledna njihova golotinja i oni su osetili svoju grešku. Ali umjesto da očajavaju ili traže izgovore, oni su se ponizno obratili Allahu: 'Gospodaru naš, mi smo sami sebi nepravdu učinili, i ako nam ne oprostiš i ne smiluješ nam se, sigurno ćemo biti među gubitnicima.'",
      "Allah je prihvatio njihovo pokajanje i poslao ih na zemlju - ne kao proizvoljnu kaznu, već kao početak ljudskog testa, praćenog obećanjem upute: 'Onaj ko slijedi Moju uputu neće zalutati niti pasti u bijedu.' Priča o Adamu je stoga priča o svakom ljudskom biću: stvorenom s čašću, testiranom, sposobnom za grešku i uvijek sposobnom da se vrati.",
    ],
    lessons: [
      "Vrata pokajanja su uvijek otvorena - Adamova tevba, ponuđena bez izgovora ili odlaganja, uzor je za svakog grešnika.",
      "Arogancija je korijen propasti: Iblis je znao istinu, ali ju je odbio iz ponosa, pokazujući da znanje bez poniznosti uništava.",
      "Šejtanov metod je uporno šaputanje, a ne sila - prepoznavanje njegovih prijedloga je pola otpora.",
      "Ljudska vrijednost je vezana za znanje i okretanje Allahu, a ne za bezgrešnost – to je odgovor na grešku koja nas definira.",
    ],
    quran: [
      {
        excerpt: "Stvaranje Adama i sedždu anđela.",
      },
      {
        excerpt: "Test, pad i pokajanje.",
      },
    ],
    location: "Džennet, pa zemlja",
  },
  {
    prophetName: "Nuh",
    title: "Nuh — strpljenje kroz vekove odbacivanja",
    summary: "950 godina da'we, kovčega i potopa kao božanskog suda.",
    body: [
      "Nuh je poslan ljudima koji su pali u obožavanje idola, i pozvao ih je da obožavaju samo Allaha zadivljujuće dugo - u Kur'anu se spominje da je ostao među njima hiljadu godina manje pedeset. Zvao ih je dan i noć, javno i privatno, nudeći im svaki razlog: oprost, kišu, bogatstvo, djecu i bašte. Ipak, generacija za generacijom su se okretala, rugala mu se i začepila svoje uši.",
      "Kada je postalo jasno da više niko neće vjerovati, Allah je naredio Nuhu da sagradi kovčeg. Njegovi ljudi su ga ismijavali dok je gradio veliki brod daleko od mora, ali je on odgovorio da dolazi dan kada će razumjeti. Znak se pojavio kada je pećnica šiknula vodu; Nuh je ukrcao vjernike - samo nekoliko - i parove svih vrsta životinja.",
      "Poplava se podigla i potopila one koji ih odbijaju. U jednom od najprodornijih trenutaka priče, Nuhov sin je odbio da se ukrca, insistirajući da će se popeti na planinu kako bi pobjegao iz vode, a bio je među utopljenicima - očeva tuga nije mogla nadjačati sinovljevu nevjericu. Kada se Nuh zamolio za njega, Allah je učio da je dječakovo nedjelo prekinulo vezu vjere između njih.",
      "Kada je stigla naredba, vode su se povukle i Kovčeg se zaustavio na planini Judi. Kur'an čuva cijeli izvještaj kao 'znak' za svakoga ko razmišlja o tome kako Allah spašava vjernike i kako je strpljenje konačno potvrđeno.",
    ],
    lessons: [
      "Duga, teška misija sa malo sljedbenika nije neuspjeh - Nuh je propovijedao vekovima, a njegova iskrenost, a ne broj, je ono što je Allahu zadovoljno.",
      "Nijedna porodična veza ne spašava osobu bez vjere: Nuhov vlastiti sin se utopio, što dokazuje da se vodstvo ne nasljeđuje.",
      "Upornost u pozivanju Allahu, čak i protiv stalnog izrugivanja, sama je po sebi oblik ibadeta.",
      "Allahovo spasenje dolazi u određeno vrijeme - vjernik gradi 'kovčeg' poslušnosti prije potopa, vjerujući obećanju.",
    ],
    quran: [
      {
        excerpt: "Nuhova priča do detalja.",
      },
      {
        excerpt: "Nuhova molba svom narodu.",
      },
    ],
    location: "Drevna Mesopotamija (naučne procjene)",
  },
  {
    prophetName: "Ibrahim",
    title: "Ibrahim - Allahov prijatelj (Halilullah)",
    summary: "Razbijajući idole, vatra je hladila, žrtvovanje Ismaila, izgradnja Ka'be.",
    body: [
      "Još kao mladić, Ibrahim je obrazložio svoj put do tevhida, odbacujući idole koje su njegov narod i njegov vlastiti otac isklesali i obožavali. Posvađao se s njima, a zatim glumio: dok su bili na festivalu, razbio im je sve idole osim najvećeg, a kada su tražili objašnjenje rekao im je da pitaju samog velikog idola – razotkrivajući bespomoćnost onoga što obožavaju. Bijesni, naložili su veliku vatru i bacili ga unutra, ali je Allah naredio: 'O vatra, budi hladnoća i sigurnost Ibrahimu,' i on je izašao nepovrijeđen.",
      "Allahovom naredbom Ibrahim je ostavio svoju ženu Hadžar i njihovog malog sina Ismaila u neplodnoj dolini Mekke. Kada im je ponestalo vode, Hadžer je u očaju trčao između brda Safa i Marva tražeći pomoć - potragu koju muslimani ponavljaju u sa'iju hadža - sve dok izvor Zemzam nije izbio pred bebinim nogama. Godinama kasnije, Ibrahim je u snu vidio da treba da žrtvuje svog voljenog sina. I otac i sin su se pokorili Allahovoj volji; i baš kad se Ibrahim spremao da to izvede, Allah je otkupio Ismaila veličanstvenim ovnom, koji se obilježava svake godine na Kurban-bajram.",
      "Zajedno, Ibrahim i odrasli Ismail podigli su temelje Kabe u Mekki, moleći se dok su gradili: 'Gospodaru naš, primi ovo od nas.' Ibrahim je također molio da se izaslanik iz reda njihovih potomaka – molba je odgovorena stoljećima kasnije u Poslaniku Muhammedu, sallallahu alejhi ve sellem. Zbog njegove nepokolebljive odanosti, Allah je počastio Ibrahima jedinstvenom titulom: Halilullah, Allahov intimni prijatelj.",
    ],
    lessons: [
      "Tewhid zahtijeva razbijanje lažnih veza, čak i kada je idolopoklonstvo popularna, naslijeđena norma i suprotstavljanje joj je opasno.",
      "Potpuno povjerenje u Allaha blista najjače kada je Njegova naredba najteža - Ibrahim se pokorio čak i žrtvovanju svog sina, a Allah je iskušenje zamijenio milošću.",
      "Oslanjanje na Allaha ne znači pasivnost: Hadžer je trčao i tražio, a Zemzam je došao - trud i tavakuli rade zajedno.",
      "Iskrena djela odanosti odjekuju kroz generacije; obredi hadža i čast Ka'be sežu do Ibrahimove poslušnosti.",
    ],
    quran: [
      {
        excerpt: "Ibrahim, Ismail i kurban.",
      },
      {
        excerpt: "Zavet i nasleđe.",
      },
    ],
    location: "Irak, Levant, Meka",
  },
  {
    prophetName: "Yusuf",
    title: "Jusuf — ljepota strpljenja (sabr jameel)",
    summary: "Izdaja, ropstvo, zatvor, uspon do autoriteta - povjerenje kroz svako iskušenje.",
    body: [
      "Kao dječak, Jusuf je vidio san o jedanaest zvijezda, suncu i mjesecu kako mu se klanjaju - znak velike budućnosti. Njegov otac Jakub, koji je i sam bio prorok, rekao mu je da to sakrije od svoje ljubomorne braće. Nadvladala ih je zavist: bacili su Jusufa na dno bunara i rekli ocu da ga je vuk progutao. Karavan u prolazu pronašao je dječaka i prodao ga u Egiptu.",
      "U jednoj plemićkoj kući izrastao je u čovjeka zapanjujuće ljepote i poštenja. Kada je plemićeva žena pokušala da ga zavede, Jusuf je to odbio, rekavši: 'Tražim utočište kod Allaha' i odabrao je zatvor umjesto grijeha kada mu je ona zaprijetila. Iako nevin, bio je u zatvoru godinama. Tamo je pozvao svoje kolege zatvorenike na tevhid i protumačio njihove snove uz Allahovo dopuštenje.",
      "Kada je kralja uznemirio san o sedam debelih krava koje je progutalo sedam mršavih, Jusuf je to protumačio kao sedam godina izobilja praćenih sedam godina gladi, i savjetovao je skladištenje žita. Konačno prepoznat po svojoj mudrosti i pouzdanosti, stavljen je na čelo egipatskih skladišta.",
      "Glad je na kraju otjerala njegovu braću u Egipat tražeći hranu, ne prepoznajući moćnog ministra prije njih. Nakon što ih je testirao, Jusuf se otkrio i — umjesto da se osveti — potpuno im oprostio: 'Danas vam neće biti krivnje. Neka ti Allah oprosti.' Porodica je ponovo okupljena, njegovi roditelji su počastvovani, a san iz djetinjstva se ostvario.",
    ],
    lessons: [
      "Sabr džemil — prelijepo strpljenje — znači izdržati teškoće bez gorčine ili pritužbi ljudima, odnijeti svoju tugu samo Allahu kao što je to učinio Jakub.",
      "Čednost je vrijedna svake cijene: Jusuf je izabrao zatvor umjesto grijeha, a Allah mu je zbog toga podigao čin.",
      "Allahov plan se često krije iza godina očigledne nesreće - bunar, ropstvo i zatvor bili su koraci ka Jusufovoj časti.",
      "Jaki pokazuju svoju snagu kroz oprost: na vrhuncu svoje moći, Jusuf je pomilovao one koji su mu nanijeli nepravdu.",
    ],
    quran: [
      {
        excerpt: "Najbolje priče — ispričane u jednoj suri.",
      },
    ],
    location: "Kanaan, Egipat",
  },
  {
    prophetName: "Musa",
    title: "Musa — obratio se Allahu i suočio se s faraonom",
    summary: "Gorući grm, znaci protiv faraona, egzodusa, Tore i lutajućeg naroda.",
    body: [
      "Musa je odrastao, po Allahovom naumu, u vlastitoj faraonovoj palati nakon što ga je majka smjestila u rijeku kako bi ga spasila od faraonovog pokolja izraelskih dječaka. Kao mladić pobjegao je iz Egipta nakon ubistva, a godinama kasnije, vraćajući se kroz pustinju, vidio je vatru na planini Tur. Tamo mu se Allah obratio direktno - čast koja je Musau donijela titulu Kalimullah, onaj koji je razgovarao sa Allahom - rekavši: 'Zaista, ja sam tvoj Gospodar.' Poslan je, sa svojim bratom Harunom kao potporom, natrag faraonu tiraninu sa zahtjevom: pusti djecu Izraelovu.",
      "Faraon je tvrdio da je bog i odbio je. Allah je Musau dao jasne znakove - njegov štap se pretvara u živu zmiju i njegova ruka blista blistavo bijelo. Faraon je pozvao svoje najvještije magičare da ga diskredituju, ali kada je Musino štap progutao svoje iluzije, magičari su prepoznali pravu istinu iz puke prevare i pali na sedždu, objavljujući vjeru u Gospodara Muse i Haruna - čak i kada im je faraon prijetio smrću. Uslijedio je niz pošasti, ali je faraon samo očvrsnuo.",
      "Najzad je Allah naredio Musau da izvede svoj narod noću. Faraon ih je progonio do mora; Musa ga je udario svojim štapom i voda se razdvojila, puštajući vjernike da pređu po suhom. Kada su faraon i njegova vojska krenuli za njima, more se zatvorilo nad njima i oni su se utopili. Musa je tada primio Toru, ali se Bani Isra'il pokazao tvrdoglavim - obožavajući zlatno tele u njegovom odsustvu i odbijajući da uđe u obećanu zemlju - i kao posljedica toga lutao je četrdeset godina.",
    ],
    lessons: [
      "Govorite istinu tiraniji dok se u potpunosti oslanjate na Allaha - Musa se suočio s najmoćnijim čovjekom svog doba naoružanim samo vjerom.",
      "Čak se i iskreni vjernici mogu pokolebati: čarobnjaci koji su se suprotstavili Musiu postali su, u jednom trenutku jasnoće, postojaniji od cijelog naroda koji je vidio čuda.",
      "Svjedočenje čudima samo po sebi ne proizvodi vjeru – uputa je dar koji Allah daje poniznom srcu, a ne tvrdoglavom.",
      "Allah spašava potlačene, a ohole smatra odgovornima, ma kako moćni izgledali.",
    ],
    quran: [
      {
        excerpt: "Musa u Turu i pred faraonom.",
      },
      {
        excerpt: "Rođenje i odrastanje.",
      },
    ],
    location: "Egipat, Sinaj",
  },
  {
    prophetName: "Isa",
    title: "Isa ibn Merjam — riječ i duh od Allaha",
    summary: "Čudesno rođenje, znaci, uzdignuti Allahu - ne ubijeni niti razapeti po Kur'anu.",
    body: [
      "Merjem, čedna i pobožna žena koju je Allah izdvojio kao najbolju od žena svog vremena, povukla se iz svoje porodice u jedno mjesto na istoku. Tamo joj se anđeo Džibril pojavio u obliku čovjeka i najavio da će joj Allah podariti čistog sina, iako je nijedan muškarac nije dodirnuo. Ona je začela Allahovom riječju 'Budi', i Isa je stvoren - Kur'an upoređuje njegovo stvorenje sa Adamovim stvorenim bez oca, pokazujući da Allah stvara kako hoće.",
      "Kada se vratila noseći bebu, njeni ljudi su je optužili. U njenu odbranu, beba Isa je progovorila od kolijevke, proglašavajući se Allahovim slugom kojemu je data Knjiga i prorokom – čistivši čast svoje majke čudom. Kao prorok djeci Israiovoj, Isa je uz Allahovu dozvolu dao jasne znakove: liječio je slijepe i gubavce, oživljavao mrtve i formirao pticu od gline koja je letjela - uvijek naglašavajući da su to 'po Allahovoj dozvoli', nikad njegovom vlastitom moći.",
      "Kur'an je izričit da Isa nije bio ni ubijen ni razapet; nego je to tako izgledalo njegovim neprijateljima, a Allah ga je uzdigao k Sebi. Sunitsko vjerovanje smatra da će se vratiti prije posljednjeg dana. Ono što je najvažnije, Kur'an insistira na tome da je Isa bio ljudski prorok i Allahov sluga, a ne božanski i ne Božji sin - poruka koju je on sam objavio od kolijevke do kraja.",
    ],
    lessons: [
      "Allah stvara kako hoće — Isaovo rođenje bez oca, poput Adamovog stvaranja iz prašine, pokazuje da Njegova moć nije vezana nikakvim ovosvjetskim razlogom.",
      "Svako čudo koje je Isa učinio bilo je izričito 'sa Allahovom dozvolom', učeći da proroci kanališu Allahovu moć, oni je ne posjeduju.",
      "Poslanici su poštovani Allahovi robovi, koji se nikada ne obožavaju - Kur'an štiti Isaov pravi status od pretjerivanja.",
      "Marjamina čednost, strpljenje i povjerenje čine je uzorom vjere za sve vjernike, i žene i muškarce.",
    ],
    quran: [
      {
        excerpt: "Govor rođenja i kolevke.",
      },
      {
        excerpt: "Nije ubijen niti razapet; podignuta.",
      },
    ],
    location: "Palestina",
  },
  {
    prophetName: "Muhammed ﷺ",
    title: "Muhammed ﷺ — pečat poslanika",
    summary: "Konačni glasnik; Kur'an objavljen kroz 23 godine; milost svjetovima.",
    body: [
      "Muhammed ﷺ je rođen u Mekki oko 570. godine n.e. u plemenu Kurejš. Mladog siročeta - otac mu je umro prije njegovog rođenja, a majka kada je imao šest godina - prvo su ga odgajali djed, a potom i stric Abu Talib. Mnogo prije poslanstva u njega se toliko vjerovalo zbog svog poštenja da su ga njegovi ljudi zvali al-Amin, 'pouzdani'. U četrdesetoj godini, dok je razmišljao u pećini Hira, primio je prvu objavu Kur'ana preko meleka Džibrila.",
      "Trinaest godina u Mekki on je pozivao ljude da obožavaju samo Allaha i suočio se sa žestokim progonima: izrugivanjem, mučenjem slabih među svojim sljedbenicima i osakaćenim društvenim i ekonomskim bojkotom njegovog klana. U jednoj 'godini tuge' izgubio je i svoju voljenu ženu Hatidžu i svog zaštitnika Ebu Taliba, a kada je potražio podršku u obližnjem Ta'ifu, bio je protjeran i zasuđen kamenjem - ipak se molio za njihovo vodstvo, a ne njihovo uništenje.",
      "Nakon preseljenja u Medinu izgradio je zajednicu i vodio je kroz iskušenja Bedru, Uhudu i Konfederatima. Kada se konačno vratio da osvoji Mekku sa ogromnom snagom, nije se osvetio onima koji su ga mučili i protjerali; on im je oprostio i rekao: 'Idite, jer ste slobodni.' Kur'an sažima njegovu misiju u jednoj frazi - 'milost svjetovima' - i jasno stavlja do znanja da je njegova dužnost bila da jasno prenese poruku, a ne da nikoga prisiljava da vjeruje.",
    ],
    lessons: [
      "Najljepši karakter koji osoba može imati je Poslanikov, sallallahu alejhi ve sellem, lik — pažljivo proučite njegov serah i nastojte da ga utjelovite u svakodnevnom životu.",
      "Milosrđe i oprost su snaga, a ne slabost: na vrhuncu svoje moći pomilovao je svoje najgore neprijatelje.",
      "Pozivalac Allaha prenosi poruku iskreno i strpljivo, ali ishod prepušta Allahu - On treba dati uputu.",
      "Kušnje su put proroka; Podnošenje teškoća radi Allaha, kao što je on to činio, znak je prave vjere.",
    ],
    quran: [
      {
        excerpt: "Nismo te poslali osim kao milost svjetovima.",
      },
      {
        excerpt: "Milostivi među sobom, čvrsti protiv nevjernika.",
      },
    ],
    appLinks: [{}],
  },
];

export const QURAN_GUIDE_THEMES_BS: DeepPartial<QuranGuideTheme>[] = [
  {
    title: "vjera (iman)",
    summary:
      "Vjerovanje u Allaha, Njegove meleke, knjige, poslanike, posljednji dan i božansku odredbu.",
    lessons: [
      "Iman počiva na šest članaka koje Kur'an okuplja na jednom mjestu: vjera u Allaha, Njegove meleke, Njegove objavljene knjige, Njegove poslanike, Posljednji dan i božansku odredbu - dobro i loše.",
      "Iman nije fiksna, jednokratna afirmacija. U mainstream sunitskom vjerovanju ona se povećava s poslušnošću i sjećanjem, a smanjuje se s grijehom i nemarom, tako da je vjera nešto što aktivno rastete.",
      "Poslanik, sallallahu alejhi ve sellem, uči da vjera ima preko sedamdeset grana, u rasponu od najvećeg – svjedočanstva da nema boga osim Allaha – do uklanjanja štete s puta, pokazujući da su i mala dobra djela dio vjere.",
      "Pravi iman je stvar srca prije jezika: istinski upoznati Allaha, voljeti Ga iznad svega, bojati se Njegovog nezadovoljstva i u potpunosti se osloniti na Njega.",
    ],
    quran: [
      {
        excerpt:
          "Poslanik vjeruje u ono što mu je objavljeno od njegovog Gospodara, kao i vjernici...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Vjera ima preko sedamdeset grana; najviši je reći 'Nema drugog boga osim Allaha', a najniži je uklanjanje nečega štetnog sa puta - a skromnost je grana vjere.",
      },
    ],
    actions: [
      "Obnovite svoj shahada danas s punom pažnjom na ono što znači, a ne kao rutinsku frazu.",
      "Naučite jedno od Allahovih imena, razumite ga i zazovite Ga njime u svojoj dovi.",
    ],
  },
  {
    title: "molitva (netačno)",
    summary: "Prvo djelo koje se pitalo na Sudnjem danu - stub koji povezuje slugu sa Gospodom.",
    lessons: [
      "Namaz je drugi stub islama i prvo djelo o kojem će sluga biti upitan na Sudnjem danu - ako je zdrav, ostatak zapisa će slijediti.",
      "Kur'an kaže da molitva, obavljena sa stvarnim prisustvom srca, sputava osobu od nemorala i nedjela; to nije samo ritual već ponavljajuće resetovanje duše pet puta dnevno.",
      "Za razliku od drugih obaveza objavljenih na Zemlji, namaz je propisan ummetu tokom Poslanikovog, sallallahu alejhi ve sellem, uzašašća (al-Isra wal-Mi'radž), označavajući ga kao poseban dar i vjernikov vlastiti način uspona ka Allahu.",
      "Budući da se ponavlja pet puta dnevno, namaz je stabilan ritam koji održava vjeru živom između jednog ibadeta i sljedećeg.",
    ],
    quran: [
      {
        excerpt: "Zaista, namaz zabranjuje nemoral i nedjela, a spominjanje Allaha je veće.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Prvo od djela sluge koje će biti suđeno na Sudnjem danu biće njegova molitva; ako je zdrav, uspio je, a ako je neispravan nije uspio i izgubio.",
      },
    ],
    actions: [
      "Danas klanjajte jedan namaz polako, razumijevajući riječi El-Fatihe dok ih učite.",
      "Otvorite Munibov vodič Learn Namaz da ojačate jedan dio svoje molitve.",
    ],
  },
  {
    title: "Roditelji",
    summary:
      "Dobrota prema roditeljima je uparena sa obožavanjem Allaha - nakon širka upozorava se na nezahvalnost prema njima.",
    lessons: [
      "Allah dobrotu prema roditeljima povezuje direktno sa Svojim ibadetom u istom ajetu – znak koliko je njihovo pravo u islamu značajno.",
      "Kur'an zabranjuje čak i najmanji znak iritacije: ne toliko da im kaže 'uff', niti grubo govori, već da im se obraća blagim, časnim riječima.",
      "Zapovijed dostiže vrhunac u starosti, kada je roditeljima najpotrebnije strpljenje: brini za njih kao što su se nekada brinuli za tebe, i spusti im krilo poniznosti iz milosrđa.",
      "Odanost se ne završava smrću – nastavak davanja dove za roditelje, davanje milostinje u njihovo ime i poštovanje njihovih prijatelja i obećanja su stalna djela lojalnosti.",
    ],
    quran: [
      {
        excerpt:
          "Vaš Gospodar je odredio da ne obožavate nikoga osim Njega i da budete ljubazni prema roditeljima...",
      },
    ],
    actions: [
      "Nazovite ili pošaljite poruku roditelju lijepim riječima danas.",
      "Učinite dovu za svoje roditelje po imenu.",
    ],
  },
  {
    title: "strpljenje (sabr)",
    summary: "Postojanost u poslušnosti, uzdržavanje od grijeha i prihvatanje iskušenja.",
    lessons: [
      "Učenjaci opisuju sabr u tri oblika: strpljenje u poslušnosti Allahu, strpljenje u držanju podalje od grijeha i strpljenje u prihvatanju Njegove odredbe kada dođu iskušenja.",
      "Sabr nije pasivni očaj ili škrgutanje zubima u izolaciji - Kur'an ga spaja sa molitvom kao izvorom pomoći, tako da je strpljenje aktivno i okreće vas ka Allahu, a ne udaljava.",
      "Allah se izjavljuje da je 'sa strpljivim' i obećava pacijentu njihovu nagradu bez mjere - čast koja se ne pridaje gotovo ni jednoj drugoj osobini.",
      "Poslanici su bili najteže iskušeni među ljudima, a Kur'an drži njihovu postojanost - Ajuba u bolesti, Jakuba u tuzi, Jusufa kroz izdaju i zatvor - kao uzor za oponašanje.",
    ],
    quran: [
      {
        excerpt:
          "O vjernici, tražite pomoć kroz strpljenje i molitvu. Zaista, Allah je sa strpljivim.",
      },
    ],
    actions: [
      "Kada iritacija poraste danas, zastanite, udahnite i recite 'Inna lillahi wa inna ilayhi raji'un' prije nego što reagujete.",
      "Pretvorite jedan trenutak nevolje ove sedmice u dva rekata namaza umjesto prigovora.",
    ],
  },
  {
    title: "dobročinstvo (sadaka i zekat)",
    summary: "Pročišćavanje bogatstva i hranjenje potrebitih — znak prave vjere.",
    lessons: [
      "Zekat – godišnje dobročinstvo za pročišćavanje kvalificiranog bogatstva – je treći stub islama i obaveza, dok je sadaka dobrovoljno davanje bez gornje granice i beskrajnih oblika.",
      "Kur'an obećava da se imetak potrošen radi Allaha ne gubi, nego se umnožava: kao jedno sjeme koje izraste sedam klasova, od kojih svaki nosi stotinu zrna, a Allah dalje množi kome hoće.",
      "Dobrotvornost nije samo novac. Poslanik, sallallahu alejhi ve sellem, je učio da je čak i susret sa svojim bratom sa nasmijanim licem dobročinstvo, tako da niko nije previše siromašan da bi ga dao.",
      "Davanje pročišćava i bogatstvo i davaoca, popuštajući stisak pohlepe i izgrađujući suosjećanje — zbog čega sama riječ zekat znači pročišćavanje i rast.",
    ],
    quran: [
      {
        excerpt:
          "Primjer onih koji troše na Allahovom putu je kao zrno koje raste sedam klasova...",
      },
    ],
    actions: [
      "Dajte nešto danas - novac, svoje vrijeme ili iskreno ljubaznu riječ - čak i ako je malo i nevidljivo.",
      "Pregledajte svoje obaveze zekata u Munibu i zabilježite kada dospijeva sljedeća isplata.",
    ],
  },
  {
    title: "pokajanje (tevba)",
    summary: "Allah voli one koji se kaju - vrata su otvorena sve dok duša ne dođe do grla.",
    lessons: [
      "Iskrena tevba ima jasne uslove: istinsko žaljenje za grijehom, odmah ga zaustavljanje i čvrstu odluku da se više nikada ne vrati - i ako je grijeh nanio nepravdu drugoj osobi, vraćanje i njeno pravo.",
      "Allah ne dozvoljava samo pokajanje – On voli one koji Mu se stalno vraćaju, tako da je povratak nakon lapsusa sam po sebi miljen za Njega, a ne znak protiv tebe.",
      "Vrata milosti su zadivljujuće široka: Allah čak i onima koji su sebi nanijeli veliku nepravdu govori da ne očajavaju, jer On oprašta sve grijehe onome ko se iskreno pokaje.",
      "Pokajanje nije rezervisano za velike grijehe ili dramatične trenutke - istighfar (traženje oprosta) tokom cijelog dana održava srce mekim i račun čistim.",
    ],
    quran: [
      {
        excerpt:
          "Reci: O robovi moji koji ste sami sebe prestupili, ne očajavajte u Allahovoj milosti...",
      },
    ],
    actions: [
      "Recite 'Astaghfirullah' 100 puta danas, to znači i osjetite dizanje utega.",
      "Navedite jednu naviku za koju znate da ne voli Allaha i učinite prvi konkretan korak da je napustite.",
    ],
  },
  {
    title: "raj (Jannah)",
    summary:
      "Vječna nagrada pripremljena za muttakina — opisana u živopisnim, motivirajućim detaljima.",
    lessons: [
      "Kur'an opisuje Džennet u živopisnim, motivirajućim detaljima - vrtovima ispod kojih teku rijeke, vječnoj lakoći i ponovnom susretu sa pravednima - upravo da bi vjernik za njim žudio i težio.",
      "Ulazak u Džennet je na kraju Allahovom milošću, a ne samo djelima; vjera i iskreni trud su sredstva, ali ničija djela ne bi mogla zaslužiti vječnu nagradu bez Njegove milosti.",
      "Kur'an podstiče vjernike da se takmiče i požure ka oprostu i vrtu 'širokom kao nebesa i zemlja' — za njim se treba aktivno težiti, a ne pasivno nadati.",
      "Najveća nagrada od svega nisu bašče ili rijeke, već viđenje Allahovog Lica – najveća radost koja je ljudima u Džennetu obećana.",
    ],
    quran: [
      {
        excerpt: "I požuri sa oprostom od Gospodara svoga i džennetom širokom kao nebesa i zemlja…",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "paklena vatra (Jahannam)",
    summary: "Pravo upozorenje — ne da očajavamo vjernike već da probudimo oprez.",
    lessons: [
      "Džehannam je pravo upozorenje, a ne metafora - Kur'an to jasno opisuje tako da ljudi ozbiljno shvataju opasnost i mijenjaju kurs dok još mogu.",
      "Strah od Vatre treba da djeluje zajedno sa nadom u Allahovu milost: vjernik hoda između khawf (straha) i raja (nade), tako da ni očaj ni lažna sigurnost ne preuzimaju vlast.",
      "Jedini grijeh koji Kur'an izdvaja kao neoprostiv ako osoba umre zbog njega je širk – pridruženje partnera Allahu; sve manje od toga da On može oprostiti kome hoće.",
      "Allah upozorava kako bi ljude vratio k sebi, a ne da bi zdrobio onoga koji se kaje — svako upozorenje je u Kur'anu upareno sa otvorenim pozivom na povratak.",
    ],
    quran: [
      {
        excerpt:
          "Zaista, Allah ne oprašta druženje s Njim, ali oprašta ono što je manje od onoga kome hoće.",
      },
    ],
    actions: [
      "Poslije svakog današnjeg namaza, zamolite Allaha iskreno da vas zaštiti od Vatre.",
      "Obnovite svoj tevhid: razmislite o obožavanju samo Allaha, najsigurnije zaštite od Džehannama.",
    ],
  },
  {
    title: "Pravda",
    summary: "Zauzmite se čvrsto za pravdu čak i protiv sebe ili svoje porodice.",
    lessons: [
      "Pravda u Kur'anu je beskompromisna: zauzmite se za nju čak i kada se istina računa protiv vas, vaših roditelja ili najbližih rođaka.",
      "Allah zapovijeda da vas mržnja prema ljudima nikada ne smije tjerati u nepravdu — 'budite pravedni; to je bliže pravednosti (taqwa)' — tako se pravednost duguje čak i neprijateljima.",
      "Ugnjetavanje (dhulm) je ozbiljno upozoreno na; Poslanik, sallallahu alejhi ve sellem, je učio da će se nepravde pojaviti kao tama nad počiniocima na Kijametskom danu.",
      "Pravda nije samo za sudije i vladare – ona živi u poštenom govoru, poštenom postupanju, držanju svoje riječi i davanju svakoj osobi koja joj pripada.",
    ],
    quran: [
      {
        excerpt:
          "Budite čuvari pravde, svjedoci Allaha, čak i protiv sebe ili roditelja i rodbine.",
      },
    ],
    actions: [
      "Dajte nekome pravo koje mu pripada danas - poštenu platu, iskren odgovor ili kredit koji mu dugujete.",
      "Uhvatite trenutak u kojem vas pristrasnost dovodi u iskušenje da budete nepravedni i umjesto toga odaberite pravdu.",
    ],
  },
  {
    title: "Znanje",
    summary: "Pročitajte, razmislite i recite 'Gospodaru moj, uvećaj me u znanju.'",
    lessons: [
      "Prva riječ objavljena u Kur'anu bila je 'Čitaj' — Islam nije započeo ritualom već naredbom da se uči, poštujući i pismenost uma i znanje srca.",
      "Allah je čak i Svom Poslaniku, sallallahu alejhi ve sellem, rekao da traži još: 'Gospodaru moj, povećaj me u znanju' - jedino što ga Kur'an upućuje da traži povećanje.",
      "Korisno znanje je namijenjeno da se na njega djeluje i prenosi; Poslanik, sallallahu alejhi ve sellem, je učio da su učenjaci nasljednici poslanika, koji ne nasljeđuju bogatstvo nego znanje.",
      "Traženje svetog znanja je samo po sebi ibadet, a Kur'an jasno pravi razliku između onih koji znaju i onih koji ne znaju - 'jesu li jednaki?'",
    ],
    quran: [
      {
        excerpt: "I reci: Gospodaru moj, povećaj me znanjem.",
      },
    ],
    actions: [
      "Naučite jednu novu stvar iz Kur'ana danas - ajet, riječ ili odredbu - i podučite je nekome.",
      "Naučite napamet dovu 'Rabbi zidni ilma' i izgovorite je prije učenja.",
    ],
  },
  {
    title: "Proroci",
    summary: "Priče o vodstvu, iskušenju i božanskoj podršci - ne zabava, već pouka.",
    lessons: [
      "Kur'an uči da nijedan narod nije ostao bez uputstva: 'nema zajednice osim što je među njima prošao opominitelj' — svuda je poslana ista poruka tevhida.",
      "Svi poslanici su donijeli jedan suštinski poziv – obožavajte samo Allaha – i njihove priče se ne prepričavaju kao historija zbog same nje, već kao upute za 'one koji razumiju'.",
      "Muhammed, sallallahu alejhi ve sellem, je pečat poslanika, posljednji poslanik, i musliman mora vjerovati u sve poslanike prije njega - Nuha, Ibrahima, Musaa, Isaa i ostale - ne praveći nikakvu razliku među njima.",
      "Poslanici su bili ljudska bića i Allahovi robovi, a ne božanski; Kur'an ih odaje počast, ali ih čvrsto drži na strani stvorenja, nikada ih se ne obožava zajedno sa Stvoriteljem.",
    ],
    quran: [
      {
        excerpt: "U njihovim pričama je lekcija za one koji razumiju...",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Žene",
    summary: "Prava, dostojanstvo i duhovna jednakost — Maryam je među najboljim ženama.",
    lessons: [
      "Kur'an uči o duhovnoj jednakosti muškaraca i žena pred Allahom: ista vjera, ista djela i ista nagrada obećavaju se podjednako 'vjernicima i vjernicama'.",
      "Žene i muškarci su opisani kao partneri i zaštitnici jedni drugima u vjeri, a ne kao imetak - četvrta sura, an-Nisa ('Žene'), se u velikoj mjeri posvećuje zaštiti njihovih prava, dostojanstva, naslijeđa i tretmana.",
      "Kur'an drži Merjem, Isaovu majku, kao uzor za sve vjernike, i poštuje majke tako visoko da dobro poznato učenje stavlja Džennet pred njihova stopala.",
      "Oba pola vuku unazad do jednog porijekla – 'stvorili su vas od jedne duše' – uspostavljajući zajedničku ljudskost i dostojanstvo od samog prvog ajeta sure an-Nisa.",
    ],
    quran: [
      {
        excerpt:
          "Bojte se svog Gospodara, koji vas je stvorio od jedne duše i stvorio od nje njenu drugu...",
      },
    ],
    actions: [
      "Poštujte ženu u svom životu danas - majku, ženu, sestru ili ćerku - sa određenim pravom ili ljubaznošću koja joj duguje.",
    ],
  },
  {
    title: "Djeca",
    summary: "Povjerenje (amana) — koje treba podići na tevhidu i ljubaznosti.",
    lessons: [
      "Djeca su amana — Allahovo povjerenje — i Kur'an čini roditelje odgovornim za njihovo odgajanje: 'zaštitite sebe i svoje porodice od Vatre' počinje tako što ćete ih naučiti tevhidu i dobrom karakteru.",
      "Poslanik, sallallahu alejhi ve sellem, ubrajao je podučavanje i učenje Kur'ana među najbolja djela, tako da vođenje djeteta da recituje makar i malo toga stvara trajno dobro čija se nagrada stalno vraća roditelju.",
      "Često ponavljana roditeljska mudrost savjetuje da se djeca upoznaju u njihovom stadiju – da se igrate s njima u ranim godinama, zatim ih podučavate i nježno disciplinujete, a zatim se sprijateljite s njima dok sazrijevaju.",
      "Odgajanje pravednog djeteta je investicija izvan ovog života: pravedni potomak koji se moli za roditelja nastavlja da im koristi dugo nakon smrti.",
    ],
    quran: [
      {
        excerpt: "O vjernici, zaštitite sebe i svoje porodice od Vatre...",
      },
    ],
    actions: [
      "Naučite dijete jednom kratkom stihu ili jednom lijepom ponašanju danas, strpljivo i s ohrabrenjem.",
      "Učinite dovu za svoju djecu (ili djecu o kojoj brinete) po imenu da budu ispravni i voljeni Allahu.",
    ],
  },
];

export const QURAN_GUIDE_TAJWEED_BS: DeepPartial<QuranGuideTajweedLesson>[] = [
  {
    title: "Podne Sakinah & Tanween",
    summary: "Pravila za ن sa sukunom i tanween — izhar, idgham, iqlab, ikhfa.",
    explanation: [
      "Podnevna sakina je slovo ن koje nosi sukun (bez samoglasnika); tanween je udvojeni samoglasnički završetak (an, in, un) koji zvuči isto kao podne na kraju riječi. Oba slijede ista četiri pravila, u potpunosti određena slovom koje slijedi.",
      "Izhar (jasan izgovor): kada slijedi jedno od šest grlenih slova (ء ه ع ح غ خ), izgovorite podne jasno i razgovijetno, bez nazalnog miješanja.",
      "Idgham (spajanje): prije slova riječi 'yarmaloon' (ي ر م ل و ن), podne se spaja u sljedeće slovo - sa ghunnah (nosnim zvukom) za ي ن م و, i bez ghunnah za ل ر.",
      "Iqlab (konverzija): kada slijedi ب, podne se pretvara u skriveni meem zvuk praćen ghunnah.",
      "Ikhfa (skrivanje): prije preostalih petnaest slova, podne nije ni izgovoreno ni potpuno spojeno — 'skriveno' je laganom nazalnim ghunnah-om dok se jezik priprema za sljedeće slovo.",
    ],
    practice:
      "Učite suru el-Fatiha polako, i svaki put kada se nađete u podne sakine ili tanween, zastanite da navedete koje od četiri pravila vrijedi i zašto.",
  },
  {
    title: "Meem Sakinah",
    summary: "Ikhfaa shafawi, idgham shafawi, i izhar shafawi za m sa sukunom.",
    explanation: [
      "Meem sakinah je slovo م koje nosi sukun. Ima tačno tri pravila, svako se zove 'shafawi' (labijalno) jer se meem proizvodi usnama, a koje se primjenjuje ovisi samo o sljedećem slovu.",
      "Idgham shafawi (labijalno spajanje): kada nakon meem sakina slijedi drugi meem, dva se spajaju u jedan naglašeni meem koji se drži ghunnah.",
      "Ikhfa shafawi (skrivanje usana): kada slijedi ب, meem je lagano sakriven — usne se približavaju, ali se ne pritiskaju u potpunosti — praćeno ghunnah.",
      "Izhar shafawi (labijalna jasnoća): prije svakog drugog slova, meem se izgovara jasno. Posebno pazite ispred slova و i ف, gdje su učenici u najvećem iskušenju da ih zamute.",
    ],
    practice:
      "Pročitajte nekoliko kratkih sura iz Juz Amme i označite svaku meem sakinu, imenujući njeno pravilo prije nego što izgovorite riječ.",
  },
  {
    title: "Madd (izduženje)",
    summary: "Prirodno, sekundarno i neophodno produženje samoglasnika.",
    explanation: [
      "Madd znači rastezanje samoglasničkog zvuka, a to se dešava na tri madd slova - alif (ا), waw (و) i ya (ي) - kada ne nose svoj samoglasnik i prate svoj odgovarajući kratki samoglasnik.",
      "Madd asli (prirodni madd) je osnovno elongacija od oko dva broja, prisutna gdje god se pojavi ludo slovo bez posebnog razloga iza njega. Svaki recitator to drži ravnomjerno.",
      "Madd far'i (sekundarni madd) se pokreće sljedećom hamzom ili sukunom i drži se duže - obično četiri ili šest računanja. Tačna dužina ovisi o vrsti madd-a i recitaciji (riwayah) koju slijedite.",
      "Budući da zaustavljanje na kraju riječi može stvoriti sukun, također može produžiti ludnicu - još jedan razlog više da se trajanje nauči od kvalifikovanog učitelja umjesto nagađanja.",
    ],
    practice:
      "Odaberite poznatu kratku suru i nježno brojite '1-2' na svakom prirodnom ludilu i '1-2-3-4' na sekundarnim, održavajući ravnomjerno vrijeme.",
  },
  {
    title: "Ghunnah",
    summary: "Nosni zvuk koji prati podne i meem u idghamu i ikhfi.",
    explanation: [
      "Ghunnah je nazalna rezonancija proizvedena kroz nos, svojstvena kvaliteta slova podne (ن) i meem (م). U standardnoj recitaciji održava se oko dva brojanja.",
      "To je obavezno i ​​najizraženije u nekoliko pravila koja ste već upoznali: idgham sa ghunnah, ikhfa, iqlab, i kad god podne ili meem nosi shaddah.",
      "Zvuk bi trebao biti uglađen i kontroliran - to nije pjevanje ili pjevušenje melodije, već ujednačen nazalni ton odmjeren na ispravnu dužinu.",
      "Jednostavan test: lagano stisnite nos dok proizvodite slovo ghunnah; ako je zvuk blokiran, rezonancija zaista dolazi kroz nos kako bi trebala.",
    ],
    practice:
      "Recitujte riječ sa shaddahom u podne ili meemom, držeći gunu stabilno dva broja, a zatim snimite sebe i uporedite sa kvalifikovanim recitatorom.",
  },
  {
    title: "Ustani",
    summary: "Odjek odskakuća na ق ط ب ج د kada se sakin ili kada se zaustavi na njima.",
    explanation: [
      "Qalqalah je blagi 'odjek' koji se daje na pet slova — prikupljenih u frazi قُطْبُ جَدٍ, odnosno ق ط ب ج د — kad god nose sukun.",
      "Odbijanje je lagana vibracija tačke artikulacije; ne smijete dodati puni samoglasnik iza slova, samo neka se 'odbije' čisto.",
      "Lakši je (sughra) kada slovo ima sukun u sredini riječi, a jači i jasniji (kubra) kada se zaustavite na tom slovu na kraju riječi.",
      "Držite odbijanje neutralnim — nemojte ga naginjati prema zvuku 'a', 'i' ili 'u'; to je isti oštar eho bez obzira na okolne samoglasnike.",
    ],
    practice:
      "Učite suru al-Ikhlas i čvrsto se zaustavite na svakom slovu qalqalah - د od 'ahad' i 'yulad' - osjećajući čisti odskok.",
  },
  {
    title: "vakuf (zaustavljanje)",
    summary: "Gdje stati, disati i kako zaustavljanje mijenja izgovor.",
    explanation: [
      "Vakuf je umjetnost gdje i kako pauzirati. Mushaf označava tačke zaustavljanja malim simbolima - na primjer م za traženo zaustavljanje, ط i ج za dozvoljena zaustavljanja, i لا što znači ne zaustavljajte se ovdje - da usmjerite recitatora.",
      "Zaustavljanje obično utišava završni samoglasnik, pretvarajući posljednje slovo u sukun. Ta promjena tada može pokrenuti druga pravila, kao što su qalqalah ili izduženo madd, tako da riječ može zvučati drugačije kada se zaustavite na njoj nego kada nastavite.",
      "Gdje pauzirate može utjecati na značenje, tako da nikada ne prekidajte frazu na način koji je iskrivljuje. Poseban slučaj je mu'anaqa (zagrljaj) vakuf, označen sa tri tačke, gdje se možete zaustaviti na jednoj od dvije tačke, ali ne na obje.",
      "Najsigurniji način da naučite ispravne zastoje je mushaf koji pokazuje vakufske oznake uz kvalificiranog recitatora, tako da vaše pauze odgovaraju prenesenoj recitaciji.",
    ],
    practice:
      "Uzmite jednu stranicu sa oznakama vakufa i pročitajte je naglas prateći snimku učitelja tadžvida, zaustavljajući se tačno tamo gdje simboli ukazuju.",
  },
  {
    title: "Hamzat Wasl",
    summary:
      "The connecting hamza that is pronounced only when starting, and dropped when joining.",
    explanation: [
      "Hamzat wasl (ٱ) is a connecting hamza written with a small saddah-like mark above an alif. It appears at the start of many nouns, verbs, and particles — including the definite article ال.",
      "When you begin recitation on a word that starts with hamzat wasl, you pronounce it with a clear hamza sound so the word can open cleanly.",
      "When the word is joined to what comes before it, the hamzat wasl is silent — you glide from the previous letter straight into the following letter and do not sound a separate hamza.",
      "Recognizing hamzat wasl helps you avoid inserting an extra glottal stop mid-phrase, which is a common beginner habit when reading the mushaf slowly.",
    ],
    practice:
      "Recite the basmalah and Surah al-Fatiha, pausing at each ٱ to decide whether you are starting (pronounce) or joining (drop).",
  },
  {
    title: "Lam Shamsiyah",
    summary: "Sun letters that assimilate the لام of ال, versus moon letters that keep it clear.",
    explanation: [
      "When the definite article ال is attached to a noun, the لام may be pronounced clearly or assimilated, depending on the following letter.",
      "Sun letters (huruf shamsiyah) cause the لام to be silent and the next letter to be doubled with a shaddah — as in ٱلرَّحْمَٰن where the ر absorbs the لام.",
      "Moon letters (huruf qamariyah) keep the لام clear — as in ٱلْقَمَر — so you hear both the لام and the following letter.",
      "Learning the sun and moon sets by heart (or by ear from a teacher) prevents over-pronouncing silent لام and under-pronouncing clear لام.",
    ],
    practice:
      "Open Juz Amma and mark ten nouns with ال: for each, name whether the لام is shamsiyah (silent) or qamariyah (clear) before you recite.",
  },
  {
    title: "Silent Letters",
    summary: "Letters written in the mushaf that are not pronounced in continuous recitation.",
    explanation: [
      "Some letters appear in the Uthmani script for historical or orthographic reasons but are not sounded when you recite — they are marked silent in tajweed colorings.",
      "Common cases include certain alifs that are written but not elongated, and letters that are assimilated into a following shaddah so they leave no separate sound.",
      "Silent marking is a reading aid: it keeps the written mushaf faithful while guiding the tongue not to invent an extra sound.",
      "When in doubt, follow a colored tajweed mushaf or a qualified reciter — the goal is fidelity to the transmitted reading, not guessing from spelling alone.",
    ],
    practice:
      "With tajweed colors on, read one page slowly and whisper only the colored (sounded) letters — skip every silent-marked letter deliberately.",
  },
];

export const QURAN_GUIDE_VOCABULARY_BS: DeepPartial<QuranGuideVocabEntry>[] = [
  {
    meaning: "Jedini pravi Bog — pravo ime koje obuhvata sva lijepa imena.",
    frequency: "2.700+ pojavljivanja",
    example: "Bismillah — U ime Allaha",
    quranRef: {
      excerpt: "U ime Allaha, Potpuno Milostivog, Posebno Milostivog.",
    },
  },
  {
    meaning: "Gospodar, Gospodar, Održavatelj — onaj koji stvara, posjeduje, njeguje i upravlja.",
    frequency: "Vrlo često",
    example: "Rabbana—Naš Gospodin",
    quranRef: {
      excerpt: "Sva hvala pripada Allahu, Gospodaru svjetova.",
    },
  },
  {
    meaning: "Milost, samilost, nježnost od Allaha i među stvorenjima.",
    frequency: "Zajednički korijen r-h-m",
    example: "Ar-Rahman, Ar-Rahim",
  },
  {
    meaning: "Vrt, raj — vječno prebivalište nagrade.",
    frequency: "Često",
    example: "Vrtovi ispod kojih teku rijeke",
  },
  {
    meaning: "Vatra — odnosi se na Jahannam kao upozorenje i posljedicu.",
    frequency: "Često",
    example: "Bojte se Vatre pripremljene za nevjernike",
  },
  {
    meaning: "Vjera, vjerovanje, pouzdanje u Allaha i prihvatanje Njegove poruke.",
    frequency: "Vrlo često",
    example: "O vjernici (O Allahov dan)",
  },
  {
    meaning: "Strpljenje, postojanost, izdržljivost za Allaha.",
    frequency: "Često",
    example: "Zaista je Allah sa strpljivim",
  },
  {
    meaning: "Zahvalnost — priznavanje blagoslova srcem, jezikom i udovima.",
    frequency: "Često",
    example: "Ako ste zahvalni, sigurno ću vas povećati",
  },
  {
    meaning: "Svjesnost Boga, bogobojaznost, čuvanje grijeha iz straha od Allaha.",
    frequency: "Vrlo često",
    example: "Najplemenitiji od vas kod Allaha je najpravedniji",
  },
  {
    meaning: "Opskrba, opskrba - ono što Allah odredi za svaku dušu.",
    frequency: "Često",
    example: "Allah je najbolji opskrbljivač",
  },
  {
    meaning: "Svetlost — vođstvo, otkrovenje i prosvetljenje srca.",
    frequency: "Često",
    example: "Allah je svjetlost nebesa i Zemlje",
    quranRef: {
      excerpt: "Allah je svjetlost nebesa i Zemlje...",
    },
  },
  {
    meaning:
      "Ovaj svjetski život — doslovno 'niži/bliži' život. U Kur'anu je to privremeno i test, u suprotnosti sa trajnom akhirom, i nikada nije pravi dom vjernika.",
    frequency: "Često",
    example: "Život na ovome svijetu (al-hayat ad-dunya) je samo zabava i odvraćanje",
  },
  {
    meaning:
      "Ahiret — vječni život nakon smrti, uključujući vaskrsenje, sud, raj i pakao. To je pravi i trajni život za koji Kur'an poziva vjernike da rade.",
    frequency: "Često",
    example: "A Ahiret (al-akhirah) je bolji i trajniji",
  },
  {
    meaning:
      "Obredna molitva, drugi stub islama, obavlja se pet puta dnevno. Riječ također nosi smisao povezanosti i dove Allahu.",
    frequency: "Vrlo često",
    example: "Uspostavi namaz (aqim as-Namaz) za Moj spomen",
  },
  {
    meaning:
      "Knjiga ili spis — najčešće sam Kur'an ('to je Knjiga'), ali i ranije otkriveni spisi i zapis djela. Ukorijenjeno u k-t-b, za pisanje.",
    frequency: "Vrlo često",
    example: "Ovo je Knjiga (dhalika al-kitab) u koju nema sumnje",
  },
];

export const QURAN_GUIDE_LETTERS_BS: DeepPartial<QuranGuideLetter>[] = [
  {
    name: "Alif",
    pronunciation: "Dugo /a/ kao u 'otac' (kada nosi hamzu ili madd)",
  },
  {
    name: "Ba",
    pronunciation: "Kao engleski 'b'",
  },
  {
    name: "Facing",
    pronunciation: "kao engleski 't'",
  },
  {
    name: "Tha",
    pronunciation: "Kao 'th' u 'misliti'",
  },
  {
    name: "Jim",
    pronunciation: "Kao 'j' u 'džem'",
  },
  {
    name: "Ha",
    pronunciation: "Oštro zadahnuto h iz grla - ne englesko 'h'",
  },
  {
    name: "Kha",
    pronunciation: "Kao škotski 'loch' - trenje u grlu",
  },
  {
    name: "Dal",
    pronunciation: "Kao engleski 'd'",
  },
  {
    name: "Dhal",
    pronunciation: "Kao 'th' u 'ovo'",
  },
  {
    name: "Ra",
    pronunciation: "Rolled/trilled 'r'",
  },
  {
    name: "Zay",
    pronunciation: "Kao englesko 'z'",
  },
  {
    name: "Sin",
    pronunciation: "Kao engleski 's'",
  },
  {
    name: "Shin",
    pronunciation: "Kao 'š' u 'brod'",
  },
  {
    name: "Sad",
    pronunciation: "Naglašeno 's' — jezik podignut, potpuniji zvuk",
  },
  {
    name: "tata",
    pronunciation: "Naglašeno 'd' — jedinstveno za arapski",
  },
  {
    name: "Ta (naglašeno)",
    pronunciation: "Naglašeno 't' — dublje u ustima",
  },
  {
    name: "Za (naglašeno)",
    pronunciation: "Naglašena verzija 'dh' zvuka",
  },
  {
    name: "Ayn",
    pronunciation:
      "Glasno stezanje iz sredine grla - nema engleskog ekvivalenta; naučite ga oponašajući recitatora",
  },
  {
    name: "Ghayn",
    pronunciation: "Kao francusko 'r' ili grgljanje 'gh'",
  },
  {
    name: "Fa",
    pronunciation: "kao engleski 'f'",
  },
  {
    name: "Qaf",
    pronunciation: "Duboko 'k' sa stražnje strane jezika - ne englesko 'k'",
  },
  {
    name: "Kupovina",
    pronunciation: "Kao englesko 'k' (naprijed u usta)",
  },
  {
    name: "Lam",
    pronunciation: "kao englesko 'l'",
  },
  {
    name: "Mim",
    pronunciation: "kao engleski 'm'",
  },
  {
    name: "Nun",
    pronunciation: "kao engleski 'n'",
  },
  {
    name: "ha (svjetlo)",
    pronunciation: "Meko 'h' na kraju riječi",
  },
  {
    name: "Waw",
    pronunciation: "Kao 'w' ili dugo 'oo'",
  },
  {
    name: "Of",
    pronunciation: "Kao 'y' ili dugo 'ee'",
  },
];

export const QURAN_GUIDE_PRONUNCIATION_BS: DeepPartial<QuranGuidePronunciationPair>[] = [
  {
    title: "Ayn vs Ha",
    tip: "Oba dolaze iz grla, ali se razlikuju po glasu. Ayn (ع) je glasovno stezanje iz sredine grla - glasne žice vibriraju. Ha (ح) je snažno, bezglasno trenje disanja, poput teškog uzdaha bez vibracije. Ni jedno ni drugo ne postoji na engleskom, pa ih naučite na uho od recitatora.",
  },
  {
    title: "Ha vs Kha",
    tip: "Ha je oštriji i lakši; Kha je dublji sa više trenja — kao 'loch'.",
  },
  {
    title: "Sin vs Sad",
    tip: "Sin (س) je lagano, tanko 's' kao u engleskom 'vidi'. Tužan (ص) je njegov teški, naglašeni blizanac: podignite zadnji dio jezika, lagano zaokružite usta i zvuk se produbljuje. Njihovo miješanje može promijeniti riječi - sabr (strpljenje) u odnosu na čitanje svjetlosnim.",
  },
  {
    title: "Dal protiv tate",
    tip: "Dal (د) je običan 'd'. Tata (ض) je teško, naglašeno 'd' jedinstveno za arapski - pritisnite stranu jezika uz gornje kutnjake i pustite da zvuk ispuni usta. Arapski je čak nadimak „tatin jezik“ zbog ovog karakterističnog slova.",
  },
  {
    title: "Ta vs Ta (naglašeno)",
    tip: "Naglašeno ط je dublje; nemojte zamijeniti samo engleskim 't'.",
  },
  {
    title: "Dhal vs Za (naglašeno)",
    tip: "Oba uključuju zvukove 'th'; ظ je teži i naglašeniji.",
  },
  {
    tip: "Kaf (ك) je 'k' naprijed kao engleski 'ključ'. Qaf (ق) je napravljen mnogo dalje unazad — sam zadnji dio jezika dodiruje uvulu, dajući duboko, grleno 'k' bez engleskog ekvivalenta. Neka budu različiti: qalb (srce) nije kalb (pas).",
    title: "Kaf vs Qaf",
  },
  {
    title: "Ghayn vs Kha",
    tip: "Ghayn ima glas; Kha je bezglasno trenje.",
  },
];

export const QURAN_GUIDE_MEMORIZATION_PLANS_BS: DeepPartial<QuranGuideMemorizationPlan>[] = [
  {
    title: "Početni — Juz Amma",
    summary:
      "Prirodna polazna tačka za sve. Započnite s vrlo kratkim surama na kraju mus'hafa - od an-Nasa radeći unazad - koje su lake, brzo nagrađujuće i korisne u svakom namazu.",
    surahs: ["Više", "Al-Falaq", "Al-Ikhlas", "Al-Masad", "An-Nasr", "Al-Kafirun", "Al-Kawthar"],
    tip: "Zapamtite samo jedan ajet dnevno: slušajte recitatora muratala kako ga ponavlja desetak puta, odjeknite naglas dok ne poteče, a zatim ga spojite s onim što već držite prije nego što krenete dalje.",
  },
  {
    title: "Srednji - Deset osnovnih sura",
    summary:
      "Kada kratke sure postanu čvrste, preuzmite omiljena duža poglavlja koja nose veliku vrlinu i često se recituju petkom i noću - među njima al-Mulk, Ya-Sin, ar-Rahman, al-Waqi'ah i al-Kahf.",
    surahs: [
      "Al-Fatiha",
      "Al-Mulk",
      "Ya-Sin",
      "Ar-Rahman",
      "Al-Waqi'ah",
      "Al-Kahf",
      "Al-Jumu'ah",
      "Al-Hashr",
    ],
    tip: "Pričvrstite novo pamćenje na fiksni dnevni termin — mirno, jasno vrijeme neposredno nakon Fadžra je idealno — tako da dosljednost čini težak zadatak.",
  },
  {
    title: "Napredno — Jedan juz",
    summary:
      "Posvetite se dovršavanju punog džuza, a da sve prije bude čvrsto. Mnogi počinju sa džuzom 29 ili 30, čije sure već djelimično znaju, a zatim se proširuju jedan po jedan džuz.",
    surahs: ["Odaberite džuz — mnogi počinju s džuzom 29 ili 30, a zatim proširuju"],
    tip: "Nikada nemojte dodavati novi dio dok se stari čvrsto ne revidira. Poslanik, sallallahu alejhi ve sellem, je upozorio da naučeni Kur'an izmiče brže nego što se privezana deva oslobodi.",
  },
  {
    title: "Hafisko putovanje",
    summary:
      "Učenje cijelog Kur'ana napamet — doživotna čast koja odgaja onoga ko ga nosi i, Allahovom milošću, njihove roditelje. To je ozbiljna obaveza, koja obično obuhvata nekoliko godina svakodnevnog novog pamćenja i disciplinovane revizije.",
    surahs: ["Cijeli mushaf — obično 3-7 godina sa dnevnom revizijom"],
    tip: "Ne pokušavajte sami: koristite Munibov hifz tracker da upravljate svojim rasporedom revizija i recitujte redovno kvalifikovanom hafizu ili učitelju koji može uhvatiti i ispraviti vaše greške.",
  },
];

export const QURAN_GUIDE_DAILY_LESSONS_BS: DeepPartial<QuranGuideDailyLesson>[] = [
  {
    translation:
      "O vjernici, tražite pomoć kroz strpljenje i molitvu. Zaista, Allah je sa strpljivim.",
    context:
      "Iz sure El-Bekare, objavljene u Medini. Allah spaja dva izvora snage za vjernika koji se suočava s teškoćama – strpljivost i okretanje molitvi – i obećava Svoje posebno društvo onima koji se čvrsto drže.",
    reflection:
      "S kojim se iskušenjem sada suočavam kada posežem za brzim bijegom umjesto strpljenja i molitve na koju me upućuje ovaj stih?",
    action:
      "Izmolite danas jedan namaz bez žurbe, i u svom sudžudu zamolite Allaha poimence za strpljenje u specifičnom testu koji prolazite.",
  },
  {
    translation: "Moja milost obuhvata sve stvari.",
    context:
      "Iz sure al-A'raf, izgovorene u kontekstu Musaa i njegovog naroda. Allah opisuje Svoju milost kao što obuhvata sve – milost toliko ogromna da prethodi i nadmašuje Njegovu kaznu, koja je rezervirana za one koji ustraju u nepravdi.",
    reflection:
      "Čiju grešku odbijam da oprostim, iako sam u potpunosti zavisio od Allahove bezgranične milosti?",
    action:
      "Odaberite jednu osobu kojoj zamjerate, oprostite joj iskreno u svom srcu danas i napravite kratku dovu tražeći od Allaha da uputi i oprosti i njima.",
  },
  {
    translation: "Ako ste zahvalni, sigurno ću vas povećati.",
    context:
      "Od sure Ibrahim, dijela Musaovog podsjetnika do Bani Isra'ila. Allah svoj porast direktno povezuje sa zahvalnošću - zahvalnost za blagoslov je upravo ono što uzrokuje da raste, dok nezahvalnost poziva na njegov gubitak.",
    reflection:
      "Koji od Allahovih darova – svoje zdravlje, porodicu, vjeru ili opskrbu – sam počeo tretirati ovu sedmicu kao običnu i dugu prema meni?",
    action:
      "Prije nego odspavate večeras, izgovorite 'Alhamdulillah' naglas za tri određena blagoslova, imenujući svaki tako da zahvalnost postane svjesna, a ne automatska.",
  },
  {
    translation: "I govori ljudima dobre riječi.",
    context:
      "Iz sure al-Isra. Usred smjernica o tome kako vjernici treba da se nose, Allah naređuje da ljudima - svim ljudima - razgovaramo na najbolji način, jer su teške riječi jedna od vrata kroz koja šejtan sije podjele.",
    reflection:
      "Osvrćući se na današnji dan, da li su moje riječi uglavnom podigle ljude ili ih odbile – i da li sam izgovorio 'dobre riječi' čak i onima koje mi je teško?",
    action:
      "Iskreno ohrabrite ili zahvalite jednoj osobi danas bez skrivene kritike i suzdržite jednu oštru primjedbu koju ste bili u iskušenju.",
  },
  {
    translation: "Ko se oslanja na Allaha - onda mu je On dovoljan.",
    context:
      "Iz sure at-Talaq, koja se nalazi među presudama o razvodu i obezbjeđenju – upravo tamo gdje se ljudi osjećaju financijski najviše zabrinuti. Tamo Allah obećava da će ko se Njega bojati obezbijediti odakle nikada nisu očekivali, a ko se na Njega osloni, naći će Ga dovoljno.",
    reflection:
      "Gdje pravim pažljive planove, a da ne izostavljam Allaha iz njih — ili se oslanjam na pomoć ljudi, a da se nikada ne obratim Njemu u dovi?",
    action:
      "Donesite jednu odluku koja vas brine, klanjajte dva rekata istihare ili uputite iskrenu dovu nad njom, a zatim povjerite rezultat Allahu.",
  },
  {
    translation: "Gospodaru moj, povećaj me u znanju.",
    context:
      "Iz sure Ta-Ha. Ovo je jedina stvar u Kur'anu koju Allah nalaže Poslaniku, sallallahu alejhi ve sellem, da traži više od — znanja — što pokazuje koliko je visoko korisno znanje cijenjeno i da niko, ma koliko učen, nikada nije završio tražeći ga.",
    reflection:
      "Koliko je mog slobodnog vremena danas otišlo na beskonačno listanje, i da li bi čak i djelić toga mogao otići na učenje jednog ajeta ili jednog hadisa umjesto toga?",
    action:
      "Naučite napamet ovu kratku dovu, 'Rabbi zidni ilma', i stvorite naviku da je izgovorite nakon sabaja prije nego što započnete svoj dan.",
  },
  {
    translation:
      "Primjer onih koji svoj imetak troše na Allahovom putu je kao sjeme koje iznikne sedam klasova...",
    context:
      "Iz sure al-Baqarah. Allah crta živopisnu sliku o tome kako dobročinstvo raste: jedno sjeme nikne sedam klasova, od kojih svako nosi stotinu zrna - sedamstostruki povrat, a On još više umnožava kome hoće. Bogatstvo dato radi Njega nikada nije zaista izgubljeno.",
    reflection:
      "Kada dajem, da li se to radi tiho za Allahovo dobro, ili želim da me drugi primjećuju i hvale zbog toga?",
    action:
      "Dajte malu sadaku danas, i ako možete, dajte je tajno - tako da je to čisto između vas i Allaha.",
  },
];

export const QURAN_GUIDE_APPLY_CHALLENGES_BS: DeepPartial<QuranGuideApplyChallenge>[] = [
  {
    verseExcerpt: "I govori ljudima dobre riječi.",
    challenge:
      "Provedite cijeli dan bez ijedne grube, sarkastične ili podrugljive riječi - čak i u šali, čak i kada ste isprovocirani.",
    habit:
      "Kada uzrujanost poraste, zastanite prije nego što odgovorite i odaberite tišinu ili ljubaznu riječ.",
  },
  {
    verseExcerpt: "Reci vjernicima da spuste pogled...",
    challenge:
      "Namjerno spustite pogled od onoga što je Allah danas zabranio - na vašem ekranu, vašem feedu i u javnosti.",
    habit: "Svaki put kada se uhvatite, preusmjerite taj trenutak na pet minuta Kur'ana.",
  },
  {
    verseExcerpt: "Nemojte im govoriti 'uff'...",
    challenge:
      "Razgovarajte danas sa roditeljem ili starješinom s vidljivom nježnošću i strpljenjem, ne pokazujući ni traga iritacije - i učinite nešto da im poslužite.",
    habit: "Ako su živi, ​​posvetite se redovnom pozivu ili posjeti; ako ne, učini dovu za njih.",
  },
  {
    verseExcerpt: "Budite uz istinoljubive.",
    challenge:
      "Govorite istinu ceo dan bez belih laži, bez preterivanja i bez ogovaranja - čak ni u šali.",
    habit: "Ako okliznete, odmah se pokajte i ispravite sve što su vaše riječi uticale.",
  },
  {
    verseExcerpt: "Allah je sa pacijentom.",
    challenge:
      "Sljedeći put kada vas nešto frustrira, suzdržite svaku grubu riječ punih šezdeset sekundi prije nego što odgovorite.",
    habit: "Pretvorite trenutke iritacije u zikr ili dva rekata namaza kad god možete.",
  },
  {
    verseExcerpt: "Ako ste zahvalni, ja ću vas povećati.",
    challenge:
      "Zahvalite tri različite osobe po imenu danas za nešto konkretno što su učinili za vas.",
    habit:
      "Završite svaku noć tako što ćete zabilježiti jedan blagoslov - jedan red u svom Munib dnevniku.",
  },
  {
    verseExcerpt: "Ko oprosti i pomiri se - nagrada mu je kod Allaha.",
    challenge:
      "Oslobodite se jedne zamjerke koju ste nosili - oslobodite je iskreno, barem u svom srcu.",
    habit:
      "Učinite tihu dovu za osobu koja vam je nanijela nepravdu umjesto da ponavljate povredu.",
  },
];

export const QURAN_GUIDE_TADABBUR_PROMPTS_BS: DeepPartial<QuranGuideTadabburPrompt>[] = [
  {
    question: "Šta me Allah uči u ovom ajetu?",
    hint: "Čitajte ajet polako i uočite njegove građevne blokove: da li Allah daje naredbu, upozorenje, obećanje ili priča? Koje od Njegovih imena koristi, i šta to ime otkriva o tome kako se ponaša s nama ovdje?",
  },
  {
    question: "Kako to danas primijeniti u jednoj konkretnoj akciji?",
    hint: "Nejasne rezolucije blijede; specifične štapiće. Pretvorite stih u jedan izvodljiv korak - jedan razgovor koji treba voditi, jednu naviku za početak, jedan izbor koji treba napraviti prije kraja dana.",
  },
  {
    question: "Koju naviku trebam poboljšati ili ukloniti zbog ovog stiha?",
    hint: "Svedite ajet u svoju dnevnu rutinu - svoj san, svoj govor, svoju potrošnju, svoju molitvu, svoje odnose. Na koji od njih ovaj stih tiho stavlja prst?",
  },
  {
    question:
      "Da li me ovaj ajet pokreće ka nadi u Allahovu milost ili strahu od Njegove pravde - i zašto je oboje važno?",
    hint: "Vjernik hoda između khawfa (straha od Allahove kazne) i raje (nade u Njegovu milost), kao dva krila. Pitajte koji od njih ovaj stih trenutno jača u vama i da li je vašem srcu potrebno više toga.",
  },
  {
    question: "Kako je Poslanik, sallallahu alejhi ve sellem, živio ovaj ajet?",
    hint: "Poslanik, sallallahu alejhi ve sellem, je opisan kao 'hodeći Kur'an.' Pogledajte autentične sere i tefsir - Ibn Kathir često citira kako je utjelovio ajet - i uzmite njegov primjer kao praktičan model.",
  },
  {
    question: "Koju dovu nadahnjuje ovaj ajet?",
    hint: "Neka stih postane molitva. Zamolite Allaha, svojim vlastitim riječima tokom sudžuda, za sve što je ajet pokrenuo - zaštitu od upozorenja, udjela u obećanju ili pomoć da se posluša naredba.",
  },
];

export const QURAN_GUIDE_READING_LEVELS_BS: DeepPartial<QuranGuideReadingLevel>[] = [
  {
    title: "arapsko pismo",
    summary:
      "Naučite prepoznati svih 28 slova u njihovom izoliranom obliku i poznajte svako po imenu. Ovo je čista familijarnost — vidjeti slovo i odmah dati naziv njegovom zvuku — i to je temelj na kojem se sve ostalo gradi.",
    topics: ["Imena slova", "Osnovni oblici", "Smjer zdesna nalijevo"],
  },
  {
    title: "Oblici slova",
    summary:
      "Otkrijte da većina slova mijenja oblik ovisno o svom položaju - početku, sredini ili kraju riječi - jer se arapski spaja kao kurziv. Naučite koja se slova nikada ne povezuju s onim poslije njih.",
    topics: ["Povezano pisanje", "Nevezujuća slova", "Alif, waw, ya varijante"],
  },
  {
    title: "harakat (samoglasnici)",
    summary:
      "Savladajte male oznake koje svakom slovu daju samoglasnik: fatha (a), kasra (i), damma (u), sukun bez samoglasnika, udvostručenje shaddah i tanween završetke. Ove oznake su ono što pretvara tiha slova u čitljive riječi.",
    topics: ["Kratki samoglasnici", "Hlebno voće", "Shaddah dupliranje", "Tanween"],
  },
  {
    title: "Spajanje pisama",
    summary:
      "Sastavite to zajedno: spojite slova i njihov harakat u slogove i kratke riječi, čitajući s desna na lijevo. Upoznajte pravilo o slovu sunca i mjeseca koje odlučuje kako se izgovara 'al-' na početku riječi.",
    topics: ["CV obrasci", "Uobičajeni prefiksi", "Slova sunca i mjeseca"],
  },
  {
    title: "Čitanje riječi",
    summary:
      "Počnite polako i ispravno dekodirati pravi kur'anski vokabular - počevši od Bismille i riječi al-Fatihe koje učite u svakoj molitvi - tako da se čitanje poveže sa ibadetom od samog početka.",
    topics: ["Riječi visoke frekvencije", "Bismillah", "Al-Fatiha riječi"],
  },
  {
    title: "Čitanje stihova",
    summary:
      "Pređite na kratke potpune ajete iz Juz Amme, dodajući svijest o osnovnom tedžvidu i mjestu gdje da zastanete za dah (vakuf), uvijek čitajući uz recitatora tako da vam uho vodi jezik.",
    topics: ["Juz Amma sure", "Vakufske oznake", "Prati recitatora"],
  },
  {
    title: "Čitanje tečno",
    summary:
      "Postignite glatko, samouvjereno recitiranje uz primijenjena pravila tajweeda. Uzmite dnevnu porciju i zadržite nastavnika ili kvalifikovanog recitatora da vas provjerava, budući da se tečnost uglađuje kroz stalnu korekciju, a ne postiže se jednom i ostavlja.",
    topics: ["Dnevni dio", "Primijenjena su pravila Tajweeda", "Povratne informacije nastavnika"],
  },
];

export const QURAN_GUIDE_QUIZ_BS: DeepPartial<QuranGuideQuizQuestion>[] = [
  {
    prompt: "Koliko sura (poglavlja) ima u Kur'anu?",
    options: ["99", "114", "124", "144"],
    explanation:
      "Kur'an ima 114 sura, u rasponu od tri ajeta do 286. Njihov redoslijed u mus'hafu je utvrđen objavom (tevkifi).",
  },
  {
    prompt: "Na koliko jednakih dijelova (džuz) je podijeljen Kur'an za svakodnevno čitanje?",
    options: ["7", "12", "30", "60"],
    explanation:
      "Trideset juza. Učenjem jednog džuza dnevno kompletira se cijeli Kur'an za mjesec dana - klasičan način da se završi hatm tokom Ramazana.",
  },
  {
    prompt: "Koja je najduža sura u Kur'anu, sa 286 ajeta?",
    options: ["Al-Fatiha", "Al-Baqarah", "Ya-Sin", "Više"],
    explanation:
      "Sura al-Baqarah je najduža, sa 286 ajeta. To je Madani sura bogata zakonom i smjernicama.",
  },
  {
    prompt: "Tačno ili netačno: Mekki sura je ona objavljena prije hidžre u Medini.",
    options: ["Istina", "False"],
    explanation:
      "Mekijske sure su objavljene prije Hidžre i često se fokusiraju na vjerovanje i tevhid; Madani sure su došle nakon i često dodaju zakon i smjernice zajednice.",
  },
  {
    prompt:
      "Koja sura sadrži prve ajete objavljene Poslaniku sallallahu alejhi ve sellem u pećini Hira?",
    options: ["Al-Fatiha", "Al-'Alaq (Iqra)", "Al-Baqarah", "Al-Ikhlas"],
    explanation:
      "Prva objava su bili početni ajeti sure al-'Alaq (96): 'Iqra' — Čitaj, u ime Gospodara svoga koji je stvorio.'",
  },
  {
    prompt: "Otprilike koliko godina je objavljen Kur'an?",
    options: ["3 godine", "10 godina", "23 godine", "40 godina"],
    explanation:
      "Kur'an je objavljivan postepeno tokom oko 23 godine — 13 u Mekki i 10 u Medini — odgovarajući na događaje i potrebe.",
  },
  {
    prompt:
      "Tačno ili netačno: Kur'an je počeo da se objavljuje u mjesecu Ramazanu, na Lejletul-Kadr.",
    options: ["Istina", "False"],
    explanation:
      "Allah kaže da je Kur'an poslat u Ramazanu (2:185) u Noći Uredbe (97:1). Traženje te noći velika je vrlina.",
  },
  {
    prompt: "Koja se sura uči na svakom rekatu dnevnog namaza?",
    options: ["Al-Ikhlas", "Al-Fatiha", "Al-Kawthar", "An-Nasr"],
    explanation:
      "Sura al-Fatiha - sedam ajeta - uči se u svakoj jedinici namaza. 'Nema molitve za onoga ko ne uči Otvaranje knjige.'",
  },
  {
    prompt: "Koja je sura koja ne počinje sa 'Bismillah ir-Rahman ir-Raheem'?",
    options: ["Al-Fatiha", "At-Tawbah", "Al-Ikhlas", "Više"],
    explanation: "Sura at-Tawbah (9) je jedina sura koja se ne otvara sa Basmala.",
  },
  {
    prompt: "U tadžvidu, čime vlada Mada vladavina?",
    options: [
      "Spajanje dva slova zajedno",
      "Istezanje (izduživanje) samoglasničkog zvuka",
      "Odjek se odbija na određena slova",
      "Gdje stati i udahnuti",
    ],
    explanation:
      "Madd znači razvlačenje samoglasnika na madd slova - alif (ا), waw (و) i ya (ي) - za određeni broj brojanja.",
  },
  {
    prompt: "Qalqalah je 'odbijanje' svjetlosti koja se daje kojem skupu slova kada nose sukun?",
    options: ["ي ر م ل و ن", "ق ط ب ج د", "ء ه ع ح غ خ", "ا و ي"],
    explanation:
      "Pet slova qalqalah sakupljeno je u frazi قُطْبُ جَدٍ — ق ط ب ج د — daje se čist odboj kada nose sukun.",
  },
  {
    prompt: "Česta kur'anska riječ 'Rabb' (رَبّ) znači:",
    options: ["Mercy", "Gospodaru, Gospodaru, Hranitelju", "Book", "Vrt"],
    explanation:
      "'Rabb' znači Gospodar, Gospodar i Održavatelj — Onaj koji stvara, posjeduje, njeguje i upravlja. 'Rabbana' znači 'Naš Gospodin'.",
  },
  {
    prompt: "Riječ 'Jannah' (جَنَّة) odnosi se na:",
    options: ["Vatra", "Rajski vrt", "Molitva", "Posti"],
    explanation:
      "'Jannah' znači bašta — vječno prebivalište nagrade, 'vrtovi ispod kojih teku rijeke'.",
  },
  {
    prompt: "Koji je poslanik podigao temelje Kabe u Mekki zajedno sa svojim sinom Ismailom?",
    options: ["Nuh", "Musa", "Ibrahim", "Yusuf"],
    explanation:
      "Ibrahim (Halilullah, Allahov prijatelj) i Ismail sagradili su Ka'bu, moleći 'Gospodaru naš, primi ovo od nas' (2:127).",
  },
  {
    prompt:
      "Koji je prorok direktno razgovarao s Allahom, suprotstavio se faraonu i poveo Bani Isra'ila preko razdvojenog mora?",
    options: ["Isa", "Musa", "Adame", "Yunus"],
    explanation:
      "Musa (Kalimullah) je razgovarao sa Allahom, bio je poslan faraonu, i po Allahovoj naredbi more se razdvojilo tako da je njegov narod sigurno prešao.",
  },
  {
    prompt: "Koju ćete suru ili kratki odlomak sljedeće razumjeti i zapamtiti, in shaa Allah?",
    explanation:
      "Mali dosljedni koraci grade doživotnu vezu sa Allahovom Knjigom. Odaberite svoj dio, naučite njegovo značenje i često ga revidirajte.",
  },
];
