import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// bs overlay for janazah-guide. Index-aligned with JANAZAH_GUIDE_TOPICS in ../janazah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const JANAZAH_GUIDE_TOPICS_BS: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Komunalna obaveza",
    summary: "Dženaza je farz kifaja — zajednica ga mora ispuniti.",
    body: [
      "Dženaza (Salat al-Janazah) je zajednička obaveza (fard kifaja): ako je neko od zajednice obavlja, obaveza se ukida sa ostalih; ako niko ne radi, svi dijele krivicu. Moli se stojeći, bez ruku ili sujuda - karakterističnog oblika među namazama.",
      "Ebu Hurejre je prenio da je Allahov Poslanik, sallallahu alejhi ve sellem, rekao: 'Onaj ko prisustvuje dženazi dok se ne klanja namaz imaće kirat (nagrade), a onaj ko prisustvuje do ukopa imat će dva kirata.' Upitan je šta je kirat, a on je rekao: 'Kao dvije velike planine' (Sahih al-Buhari 1325; Sahih Muslim 945).",
      "Nakon dženaze, pomoć oko pranja i sahrane prema vlastitom kapacitetu, te klanjanje dove za umrlog spadaju u prava muslimana nad drugim. Tretirajte tijelo dostojanstveno i izbjegavajte ekstravaganciju ili prakse bez dokaza.",
    ],
    actions: [
      "Brzo odgovorite kada je sahrana najavljena u vašoj zajednici.",
      "Namjerite molitvu i prisustvo za Allaha radi, a ne društveno izlaganje.",
      "Pomozite u praktičnim potrebama porodice kada to možete učiniti s poštovanjem.",
    ],
    hadith: [
      {
        excerpt:
          "Onaj ko prisustvuje dženazi dok ne klanja dženazu imaće jedan kirat, a onaj ko prisustvuje do sahrane imat će dva kirata - svaki kao velika planina.",
      },
      {
        excerpt:
          "Ko prati dženazu muslimana iz vjere i traženja nagrade, i ostane dok se ne klanja namaz i ne završi sahrana, vratit će se sa dva kirata...",
      },
    ],
  },
  {
    title: "Pranje i pokrivanje",
    summary: "Gusl pokojnika i jednostavan kafan — dostojanstvo bez ekstravagancije.",
    body: [
      "Muslimani koji umru (osim mučenika na bojnom polju u klasičnoj vladavini) se operu pročišćujućim pranjem, a zatim obavijaju čistom bijelom tkaninom. Umm Atiyyah je prenijela da je Poslanik, sallallahu alejhi ve sellem, rekao u vezi pranja svoje kćeri: 'Operi je tri ili pet puta, ili više, ako smatraš da je potrebno, vodom i sidrom, i stavi kamfor — ili malo kamfora — u posljednje ' (Sahih al-Buhari 1253).",
      "Aiša je prenijela da je Allahov Poslanik, sallallahu alejhi ve sellem, bio obavijen trima bijelim jemenskim pamučnim odjevnim predmetima, među kojima nije bilo ni košulje ni turbana (Sahih al-Buhari 1264; Sahih Muslim 941). Jednostavnost je sunnet; skupi prikazi su u suprotnosti s proročkim primjerom.",
      "Ko koga pere, koliko krpa za muškarce i žene i povezani detalji imaju mezhebske razlike. Porodice bi trebale pratiti dobrog lokalnog vodiča ili pogrebnu službu koja poznaje praksu škole — ovaj pregled nije priručnik za pranje.",
    ],
    actions: [
      "Imenovati povjerljive osobe istog spola kao i preminuli kada je to moguće.",
      "Neka pokrov bude jednostavan i čist — bela tkanina je proročki model.",
      "Izbjegavajte fotografiranje ili izlaganje tijela bez potrebe.",
    ],
    hadith: [
      {
        excerpt:
          "Operite je tri puta, ili pet, ili više ako vidite da je potrebno, vodom i sidrom, a u posljednje pranje stavite kamfor ili malo kamfora.",
      },
      {
        excerpt:
          "Allahov Poslanik, sallallahu alejhi ve sellem, bio je obavijen u tri bijela jemenska pamučna odjeća; među njima nije bilo ni košulje ni turbana.",
      },
    ],
  },
  {
    title: "Prilikom zatvaranja očiju pokojnika",
    summary: "Proročanska dova u trenutku smrti.",
    body: [
      "Umm Selamah je prenijela da je Allahov Poslanik, sallallahu alejhi ve sellem, došao kod Ebu Seleme kada su mu oči postale fiksirane. Zatvorio ih je i rekao: 'Kada se uzme duša, pogled je prati', a ukućani su plakali. Zatim ih je naučio da govore samo ono što je dobro, jer meleki govore amin na ono što govore, a on je učinio dovu za Ebu Seleme (Sahih Muslim 920).",
      "U paketu Hisnul Muslim unos u nastavku čuva formulaciju korištenu pri zatvaranju očiju. Govorite nježno, izbjegavajte naricanje da je Poslanik, sallallahu alejhi ve sellem, zabranio, i okupirajte jezik dobrim riječima i traženjem oprosta.",
    ],
    actions: [
      "Nežno zatvorite oči i napravite autentičnu dua.",
      "Podsjetite porodicu da govori dobro.",
    ],
    hadith: [
      {
        excerpt:
          "Kada su Abu Selamahove oči postale fiksirane, Poslanik, sallallahu alejhi ve sellem, ih je zatvorio i rekao da kada je duša zauzeta, vid je prati, a zatim je naučio ukućane da govore samo ono što je dobro.",
      },
    ],
  },
  {
    title: "Kako moliti dženazu",
    summary: "Stajaća molitva sa četiri tekbira — bez ruku ili sudžuda.",
    body: [
      "Dženaza se klanja stojeći. Nema ruku, nema sudžuda, nema ezana ili ikameta. Imam stoji na čelu umrlog muškarca ili u sredini umrlice prema izvještajima od Enasa i Samure (vidi Ebu Davud 3194 i povezane predaje), a džemat se pravi u redove iza.",
      "Namaz se sastoji od četiri tekbira. Nakon prve, uči se sura al-Fatiha (Buhari 1335). Nakon kasnijih tekbira, salavati na Poslanika sallallahu alejhi ve sellem, čine se dove za umrlog. Namaz se završava taslimom. Džabir je prenio da je Poslanik sallallahu alejhi ve sellem klanjao dženazu za Negusa (abesinskog kralja) i rekao četiri tekbira (Sahih al-Bukhari 1334).",
      "Zakašnjeli koji propuste tekbir trebaju slijediti imama i dovršiti ono što su propustili prema školskom pravilu za nadoknađivanje - pitajte imama ili lokalnog učitelja ako niste sigurni.",
    ],
    actions: [
      "Stanite u redove; nemojte se klanjati niti klanjati.",
      "Reci četiri tekbira sa imamom.",
      "Učinite iskrenu dovu za umrlog nakon odgovarajućeg tekbira.",
    ],
    hadith: [
      {
        excerpt:
          "Poslanik, sallallahu alejhi ve sellem, klanjao je dženazu za Negusa i rekao četiri tekbira.",
      },
      {
        excerpt: "Ibn Abbas je klanjao dženazu i učio Fatihu, rekavši da je to od sunneta.",
      },
    ],
  },
  {
    title: "Duas u dženazi (odrasli)",
    summary: "Autentične hisnul muslimanske riječi za pokojnika.",
    body: [
      "Nakon tekbira, srce dženaze je dova za umrle - molba Allaha da im oprosti, ukaže im milost i podari im Džennet. Nekoliko vjerodostojnih formulacija sačuvano je u Hisnul Muslimu od Poslanika, sallallahu alejhi ve sellem.",
      "Otvorite donju povezanu dua da recitujete sa arapskim jezikom, transliteracijom i značenjem. Možete naučiti više od jedne autentične formulacije; iskrenost je važnija od dužine.",
    ],
    actions: [
      "Zapamtite barem jednu autentičnu janaza dovu.",
      "Učinite opću dovu za sve umrle muslimane kada prisustvujete.",
    ],
  },
  {
    title: "Više dova za dženazu",
    summary: "Dodatne autentične riječi od Hisnula Muslima.",
    body: [
      "Hisnul Muslim čuva dalje riječi dženaze-namaza koje je učio Poslanik, sallallahu alejhi ve sellem. Koristite ih naizmjenično ili naučite onu koju vaša zajednica najbolje poznaje.",
      "Za preminulo dijete, određene dove traže od Allaha da učini dijete prethodnikom i pohranjenom nagradom za roditelje — pogledajte sljedeću temu.",
    ],
  },
  {
    title: "Dženaza namaz dova #3",
    summary: "Još jedna autentična formulacija za odrasle umrle osobe.",
    body: [
      "Još jedna Hisnul muslimanska formulacija za dženazu. Učite ga nakon odgovarajućeg tekbira kako vam praksa imama dozvoljava.",
    ],
  },
  {
    title: "Dženaza dova #4",
    summary: "Četvrta autentična formulacija iz korpusa sunneta.",
    body: [
      "Hisnul Muslim uključuje ovu dodatnu dovu za dženazu. Odaberite autentičnost i prisutnost srca umjesto prikupljanja svake riječi odjednom.",
    ],
  },
  {
    title: "Duas za preminulo dijete",
    summary: "Specifične proročke dove kada je pokojnik dijete.",
    body: [
      "Kada je pokojnik dijete, vjerodostojne dove traže od Allaha da učini dijete pohranjenim blagom, pretečom i odgovornim zagovornikom za roditelje. Hisnul muslimanski unosi u nastavku čuvaju te formulacije.",
      "Utješite porodicu nadom u Allahovu milost izbjegavajući izmišljene rituale. Primjenjuje se ista struktura dženaze od četiri tekbira; sadržaj dua je ono što se mijenja.",
    ],
    actions: [
      "Koristite dua specifične za dijete kada je to prikladno.",
      "Podržite ožalošćene roditelje uz prisustvo i halal pomoć.",
    ],
  },
  {
    title: "Dua za sahranu djeteta #2",
    summary: "Druga hisnul muslimanska formulacija za umrlo dijete.",
    body: ["Još jedna autentična formulacija za dženazu namaz djeteta, sačuvana u Hisnul Muslim."],
  },
  {
    title: "Ukop i grob",
    summary: "Spuštanje tijela, licem prema kibli i dova nakon ukopa.",
    body: [
      "Pokojnik se sahranjuje u zemlju okrenut prema kibli, dostojanstveno i bez odlaganja izvan onoga što priprema zahtijeva. Poslanik, sallallahu alejhi ve sellem, je rekao: 'Budite brzi sa sahranom...' (Sahih al-Bukhari 1315 — ubrzavanje dženaze).",
      "Prilikom stavljanja pokojnika u mezar, u Hisnul Muslimu se čuva autentična dova. Poslije sahrane, Poslanik, sallallahu alejhi ve sellem, bi stajao na mezaru i govorio: 'Traži oprost za svog brata i zamoli ga da bude nepokolebljiv, jer je sada ispitan' (Sunan Ebi Davud 3221 - ocijenjen sahihom od strane mnogih kasnijih učenjaka, uključujući al-Albanija).",
      "U autentičnim izvještajima upozorava se na izgradnju ukrašenih struktura iznad grobova, malterisanje za dekoraciju ili pisanje koje potiče preuveličavanje. Neka oznaka bude jednostavna tamo gdje zakon i lokalni običaji dozvoljavaju identifikaciju.",
    ],
    hadith: [
      {
        excerpt:
          "Budite brzi sa sahranom: ako je bila pravedna, ubrzavate je na dobro; u suprotnom, skidate zlo sa svojih vrata.",
      },
      {
        excerpt:
          "Zatražite oproštaj za svog brata i zamolite ga da bude nepokolebljiv, jer ga sada ispituju.",
      },
    ],
  },
  {
    title: "Nakon sahrane pokojnika",
    summary: "Dua za postojanost na grobu.",
    body: [
      "Kratko stajanje nakon sahrane u potrazi za oprostom i postojanošću za umrlog je utvrđeno od Poslanika sallallahu alejhi ve sellem (Ebu Davud 3221). Hisnul muslimanska formulacija ispod je za poslije sahrane.",
      "Neprekidna dobročinstva, dove i ispunjavanje legitimnih volje pokojnika koristi im uz Allahovu dozvolu — bez izmišljanja godišnjih ceremonija kojima nedostaju dokazi.",
    ],
    actions: [
      "Učinite dovu na mezaru nakon ukopa.",
      "Nastavite privatnu dovu i sadaku za pokojnika.",
    ],
  },
  {
    title: "Posjeta grobovima",
    summary: "Proročki pozdrav prilikom obilaska grobova.",
    body: [
      "Posjećivanje mezara podsjeća na život na ahiretu. Buraidah je prenio da ih je Allahov Poslanik, sallallahu alejhi ve sellem, učio da kažu kada izađu na mezarje: pozdrav mira stanovnicima nastambi među vjernicima i muslimanima, potvrđujući da ćemo im se - ako Allah da - pridružiti, i tražeći dobro za nas i za njih (Sahih Muslim, također u Ibn word 975);",
      "Hisnul muslimanski unos ispod čuva taj pozdrav. Neka posjete budu bez kukanja, traženja pomoći od mrtvih ili rituala bez dokaza.",
    ],
    actions: [
      "Pozdravite stanovnike grobova autentičnim tekstom.",
      "Razmišljajte o smrti i obnovite pravedna djela.",
    ],
    hadith: [
      {
        excerpt:
          "Neka je mir na vas, o stanovnici nastambi među vjernicima i muslimanima. Mi ćemo vam se – ako Allah da – pridružiti. Molimo Allaha za dobro za nas i za vas.",
      },
    ],
  },
  {
    title: "Podsjetnici i uobičajene greške",
    summary: "Izbjegavajte zapomaganje, odlaganje za emisiju i rituale bez osnova.",
    body: [
      "Poslanik, sallallahu alejhi ve sellem, je zabranio naricanje nad mrtvima dok je dozvolio tugu u suzama. Abdullah ibn Omer je izvijestio da je Sa'd ibn Ubadah plakao na dženazi i da je Poslanik, sallallahu alejhi ve sellem, objasnio da Allah ne kažnjava zbog suze oka ili žalosti srca, već zbog toga — i on je pokazao na svoj jezik (Sahih al-Buhari 1304).",
      "Ne odgađajte sahranu zbog prestižnih skupova, niti trošite raskošno na pokrov i gozbu, zanemarujući siromahe. Nemojte recitirati ili prakticirati inovacije koje se pripisuju sahranama bez autentične osnove. Saučešće, tiha dova i praktična pomoć porodici su sunnet put.",
      "Dolazak žena na molitvu i sahranu tretira se s nijansama u svim školama i epohama; slijedite pouzdano lokalno vodstvo koje poštuje i samilost i proročke granice.",
    ],
    disclaimer:
      "Obrazovni pregled — ne priručnik za pogrebnika ili fetva. Lokalna školska praksa za pranje, pokrivanje i pravila groblja moraju biti potvrđena sa kvalifikovanim ljudima.",
    actions: [
      "Tugujte bez naricanja ili zabranjenog govora.",
      "Požurite dostojanstvenu sahranu.",
      "Pomozite porodici u hrani i poslovima, a da ih ne opterećujete ekstravagancijom.",
    ],
    hadith: [
      {
        excerpt:
          "Allah ne kažnjava zbog suze oka ili žalosti srca, ali za to kažnjava ili pokazuje milost — i pokazao je na svoj jezik.",
      },
    ],
  },
  // --- v2 appended topics (keep index-aligned with English) ---
  {
    title: "Tekbir po tekbir — koraci namaza",
    summary: "Praktična lista četiri tekbira i onoga što dolazi između njih.",
    body: [
      "Prvi tekbir: podignite ruke (prema vašoj školi), recite Allahu ekber, zatim učite suru el-Fatiha. Ibn Abbas je u dženazi učio el-Fatihu i rekao da je to od sunneta (Sahih el-Buhari 1335).",
      "Drugi tekbir: pošaljite salavat na Poslanika ﷺ — isti ibrahimovski salavat koji se koristi u tešehhudu široko se uči za ovaj korak. Treći tekbir: učinite iskrenu dovu za umrlog (Hisnul Muslim formulacije u ovom vodiču). Četvrti tekbir: mnogi učenjaci zatim učine kratku opću dovu, pa završe taslimom desno (i lijevo, prema školi).",
      "Nema ruku, sudžuda ni sjedenja. Stojite cijelo vrijeme. Ako je prisutno više dženaza, u mnogim zajednicama se klanja jedna dženaza s nijetom za sve — slijedite imama. Mjesto salavata naspram dove može se malo razlikovati po mezhebu; okvir od četiri tekbira je zajednički.",
    ],
    madhhabNote:
      "Hanefijski, malikijski, šafijski i hanbelijski priručnici razlikuju se oko toga dižu li se ruke kod svakog tekbira i tačno kada se kaže dova. Slijedite imama ispred sebe.",
    actions: [
      "Naučite redoslijed četiri tekbira prije nego što vam zatreba.",
      "Zapamtite Fatihu, salavat i barem jednu dženaza-dovu.",
    ],
    hadith: [
      {
        excerpt: "Ibn Abbas je klanjao dženazu i učio Fatihu, rekavši da je to od sunneta.",
      },
    ],
  },
  {
    title: "Dove za muškarce, žene i djecu",
    summary: "Iste proročke formulacije — prilagodite arapske zamjenice umrlom.",
    body: [
      "Hisnul Muslim (i klasične zbirke hadisa) bilježe dženaza-dove uglavnom u muškom obliku. To ne znači posebnu 'izmišljenu' dovu za žene. Glavni učenjaci uče da možete zadržati mušku formulaciju s nijetom za osobu, ili — poželjnije i uobičajeno — promijeniti gramatiku da odgovara umrlom: لَهُ / هُ / هِ → لَهَا / هَا; عَبْدُكَ → أَمَتُكَ; ابْنُ أَمَتِكَ → ابْنَةُ أَمَتِكَ; a za djevojčicu اجْعَلْهُ → اجْعَلْهَا, شَفِيعًا مُجَابًا → شَفِيعَةً مُجَابَةً.",
      "Za umrlu ženu neki učenjaci savjetuju oprez s frazom 'bračni drug bolji od njenog bračnog druga' (زَوْجًا خَيْرًا مِنْ زَوْجِهَا), napominjući da se može ponovo sastati sa svojim mužem u Džennetu — tu klauzulu možete izostaviti ili zadržati opću formulaciju. Za djecu koristite Hisnul unose specifične za dijete (hisn-160, hisn-161), a ne samo tekstove za odrasle usmjerene na oprost.",
      "Zajednička formulacija 'oprosti našim muškarcima i našim ženama' (hisn-157) već pokriva oba spola bez promjene. Ne izmišljamo novi arapski izvan gramatičke prilagodbe vjerodostojnih tekstova — otvorite povezanu dovu za odrasle kao osnovu i primijenite gornju mapu zamjenica.",
    ],
    madhhabNote:
      "I zadržavanje muških oblika s nijetom i prilagodba ženskim oblicima prihvaćeni su među glavnim učenjacima. Kad niste sigurni, koristite hisn-157 (muškarci i žene) ili pitajte imama.",
    actions: [
      "Vježbajte zamjene ženskih zamjenica za dovu koju učite napamet.",
      "Koristite dove specifične za djecu za one koji nisu dospeli u pubertet.",
      "Preferirajte vjerodostojnost pred dugim neautentičnim knjižicama.",
    ],
    appLinks: [{ label: "Dova za dženazu odraslih #1" }],
  },
  {
    title: "Šehidi, pobačaj i posebni slučajevi",
    summary: "Kada se propisi pranja ili dženaze razlikuju od uobičajenog slučaja.",
    body: [
      "Šehidi bojnog polja koji poginu u borbi, prema klasičnom propisu iz Uhuda, sahranjuju se u svojoj odjeći bez uobičajenog gusula; Poslanik ﷺ naredio je da se šehidi Uhuda sahrane sa svojom krvlju i bez pranja (Sahih el-Buhari 1346). Ostale kategorije nazvane 'šehidima' u nagradi (npr. kuga, utapanje) obično dobijaju pranje i dženazu — pitajte učenjaka za granične slučajeve.",
      "Za pobačaj ili mrtvorođenče škole se razlikuju oko toga kada se primjenjuje dženaza-namaz i potpuno pranje (često vezano za to da li je nastao prepoznatljiv oblik ili faza udahnjivanja duše). Jedan hadis potiče klanjanje nad pobačajem i traženje oprosta i milosti za roditelje (Ebu Davud 3180). Slijedite dženaza-odbor svog mezheba umjesto nagađanja.",
      "Nemuslimanskim srodnicima ne klanja se muslimanska dženaza; ljubaznost, zakonita pomoć pri ukopu gdje je primjenjivo i lična tuga odvojeni su od ritualnog namaza za vjernike. Posebne slučajeve uvijek potvrdite kod kvalifikovanog lokalnog vodstva.",
    ],
    madhhabNote:
      "Definicije šehadeta na bojnom polju, faza pobačaja i namaza nad mrtvorođenčetom variraju po školi. Ova tema označava pitanja — nije fetva.",
    disclaimer:
      "Posebni propisi su osjetljivi. Potvrdite kod kvalifikovanog učenjaka ili dženaza-službe svoje zajednice prije djelovanja.",
    actions: [
      "Ne perite šehida bojnog polja protivno uputama učenjaka.",
      "Pitajte dženaza-odbor o slučajevima pobačaja ili mrtvorođenja.",
    ],
    hadith: [
      {
        excerpt: "Poslanik ﷺ naredio je da se šehidi Uhuda sahrane sa svojom krvlju, i nisu prani.",
      },
      {
        excerpt: "Dženaza-namaz klanja se nad pobačajem, a za roditelje se moli oprost i milost.",
      },
    ],
  },
  {
    title: "Dženaza u odsustvu",
    summary: "Poslanik ﷺ klanjao je za Negusa kada je tijelo bilo daleko.",
    body: [
      "Džabir je prenio da je Poslanik ﷺ izašao pred ashabe, poredao ih i klanjao četiri tekbira za Negusa (el-Nedžašija), abesinskog kralja koji je umro u inostranstvu (Sahih el-Buhari 1334; Sahih Muslim 952). Ovo je glavni dokaz za Salat el-Dženaza u odsustvu (alā al-ghā'ib).",
      "Škole se razlikuju oko toga koliko široko primijeniti taj presedan: neke ga ograničavaju na slučajeve poput Negusa (nema lokalnog muslimanskog namaza), druge dopuštaju šire kada je tijelo daleko. Ne preskačite lokalnu dženazu kada je tijelo prisutno i zajednica može klanjati. Pitajte pouzdanog lokalnog učenjaka kada je namaz u odsustvu prikladan u vašoj školi.",
      "Oblik je isti namaz od četiri tekbira; nijet je za odsutnog umrlog. Koristite iste vjerodostojne dove, prilagođavajući spol po potrebi.",
    ],
    madhhabNote:
      "Opseg dženaze u odsustvu poznata je tačka razlike. Preferirajte praksu kvalifikovanih imama u svojoj zajednici.",
    actions: [
      "Klanjajte lokalno kad god je tijelo prisutno.",
      "Pitajte prije organizovanja dženaze u odsustvu kao javnog događaja.",
    ],
    hadith: [
      {
        excerpt: "Poslanik ﷺ klanjao je dženazu za Negusa i rekao četiri tekbira.",
      },
      {
        excerpt:
          "Allahov Poslanik ﷺ poredao je ashabe i klanjao za Negusa, rekavši četiri tekbira.",
      },
    ],
  },
  {
    title: "Na samrti — posljednje riječi",
    summary: "Nježno potaknite umirućeg da kaže la ilaha illallah.",
    body: [
      "Poslanik ﷺ je rekao: 'Potaknite svoje umiruće da kažu la ilaha illallah' (Sahih Muslim 916; Ebu Davud 3117). Hisnul Muslim čuva uputu da će onaj čije su posljednje riječi 'Niko nema pravo da se obožava osim Allaha' ući u Džennet (hisn-153, iz Ebu Davuda 3116).",
      "Potičite nježno i bez oštrine; ne silite i ne svađajte se. One blizu smrti možete i utješiti vjerodostojnim riječima nade sačuvanim u Hisnul Muslimu (hisn-150–152). Zatvorite oči kada se duša uzme i koristite dovu za zatvaranje očiju (prethodna tema).",
      "Izbjegavajte glasno zapomaganje i govor koji ljuti Allaha. Domćinstvo treba govoriti ono što je dobro, jer meleki kažu amin na njihove riječi (Sahih Muslim 920).",
    ],
    actions: [
      "Nježno podsjetite umirućeg na šehadet.",
      "Držite sobu mirnom i ispunjenom dobrim govorom.",
    ],
    hadith: [
      {
        excerpt: "Potaknite svoje umiruće da kažu: la ilaha illallah.",
      },
      {
        excerpt:
          "Onaj čije su posljednje riječi 'Niko nema pravo da se obožava osim Allaha' ući će u Džennet.",
      },
    ],
    appLinks: [{ label: "Dove nade života" }, { label: "Zatvaranje očiju" }],
  },
  {
    title: "Saučešće i ožalošćeni",
    summary: "Utješite žive proročkom dovom u nevolji.",
    body: [
      "Umm Seleme je prenijela da je Allahov Poslanik ﷺ rekao: 'Nema muslimana koga zadesi nevolja pa kaže ono što je Allah naredio — „Allahu pripadamo i Njemu se vraćamo. Allahu, nagradi me u mojoj nevolji i zamijeni mi je boljim“ — a da mu Allah ne zamijeni boljim' (Sahih Muslim 918). Hisnul Muslim čuva tu formulaciju (hisn-154).",
      "Izrazite saučešće kratkim, istinitim riječima; pripremite hranu za porodicu umrlog umjesto da ih opterećujete ugošćavanjem (Ebu Davud 3132 — izvještaj o porodici Dža'fera). Izbjegavajte inovativne ceremonije na fiksne dane bez dokaza, uz nastavak privatne dove, sadake i ljubaznosti.",
      "Tuga sa suzama je dopuštena; zapomaganje, udaranje po obrazima i kidanje odjeće zabranjeni su. Podržite udovice, siročad i uzdržavane zakonitom pomoći nakon ukopa.",
    ],
    actions: [
      "Naučite ožalošćene dovu u nevolji.",
      "Pomozite hranom i poslovima umjesto da očekujete gozbu.",
      "Nastavite tihu dovu i sadaku za umrlog.",
    ],
    hadith: [
      {
        excerpt:
          "Nema muslimana koga zadesi nevolja pa kaže naredene riječi povratka Allahu i zamoli zamjenu boljim, a da mu Allah ne zamijeni boljim.",
      },
    ],
    appLinks: [{ label: "Ciljevi sadake" }],
  },
];
