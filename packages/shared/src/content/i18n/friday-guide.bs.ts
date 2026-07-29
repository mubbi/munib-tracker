import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Bosnian translation overlay for the Learn Friday (Jumu'ah) guide. Mirrors the order of
// FRIDAY_GUIDE_TOPICS in ../friday-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const FRIDAY_GUIDE_TOPICS_BS: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Vrline petka",
    summary: "Najbolji dan izlaska sunca — stvaranje Adema i oprost između dva petka.",
    body: [
      "Petak (Jevmul-džuma) je sedmični dan okupljanja ovog Ummeta. Ebu Hurejre prenosi da je Allahov Poslanik ﷺ rekao: 'Najbolji dan u kojem je izašlo sunce je petak; na taj dan je stvoren Adem, na taj dan je uveden u Džennet, na taj dan je iz njega izbačen, i Sudnji dan neće nastupiti ni u koji drugi dan osim u petak' (Sahih Muslim 854).",
      "Njegovo ibadetsko obilježavanje nosi i stalno obećanje oprosta. Ebu Hurejre prenosi da je Poslanik ﷺ rekao: 'Ko se okupa u petak, zatim dođe na džuma-namaz, i sluša i šuti dok imam drži hutbu, biće mu oprošteni grijesi između tog petka i narednog, plus još tri dana' (Sahih Muslim 857).",
      "Ove vrline poziv su da se rano pripremimo, pažljivo slušamo, i petak tretiramo kao sedmični duhovni reset — a ne samo kao slobodan dan.",
    ],
    hadith: [
      {
        excerpt:
          "Najbolji dan u kojem je izašlo sunce je petak; na taj dan je stvoren Adem, na taj dan je uveden u Džennet, na taj dan je iz njega izbačen, i Sudnji dan neće nastupiti ni u koji drugi dan osim u petak.",
      },
      {
        excerpt:
          "Ko se okupa u petak, zatim dođe na džuma-namaz, i sluša i šuti dok imam drži hutbu, biće mu oprošteni grijesi između tog petka i narednog, plus još tri dana.",
      },
    ],
    actions: [
      "Postavite namjeru petkom ujutro: gusul, najbolja odjeća, i dolazak rano.",
      "Tretirajte hutbu kao ibadet — tišina i pažnja su dio nagrade.",
    ],
  },
  {
    title: "Džuma — sedmična obaveza",
    summary:
      "Zajednički petkom namaz naređen u Kur'anu, koji zamjenjuje podne-namaz za one koji mu prisustvuju.",
    body: [
      "Allah naređuje džuma-namaz spomenom njegovog imena: 'O vi koji vjerujete, kada se pozove na namaz u petak, požurite ka spominjanju Allaha i ostavite trgovinu. To je bolje za vas, kad biste znali' (Kur'an, 62:9). Sljedeći ajeti tada vraćaju dozvolu da se raziđete i tražite Allahovu blagodat nakon namaza (Kur'an, 62:10–11).",
      "Džuma se sastoji od hutbe u dva dijela nakon koje slijede dva rekata namaza koji se glasno klanjaju iza imama, i zamjenjuje podne-namaz za one koji joj prisustvuju. Tarik ibn Šihab prenosi da je Poslanik ﷺ rekao da je džuma-namaz u džematu obavezujuća dužnost za svakog muslimana osim četvero: roba, žene, djeteta, ili bolesnog (Sunen Ebu Davud 1067).",
      "Nemar je ozbiljno upozorenje: Ebul-Dža'd prenosi da onome ko izostavi tri džuma-namaza iz nemara, Allah stavlja pečat na srce (Sunen en-Nesai 1369). Tokom hutbe, prazan govor uništava nagradu — Ebu Hurejre prenosi da ako kažete svom drugu 'Ćuti' dok imam govori, govorili ste pogrešno (Sahih Buhari 934).",
      "Nakon džume se preporučuje klanjati četiri rekata: Ebu Hurejre prenosi da je Poslanik ﷺ rekao: 'Kada neko od vas obavi džuma-namaz, neka nakon toga klanja četiri (rekata)' (Sahih Muslim 881).",
    ],
    quran: [
      {
        excerpt:
          "O vi koji vjerujete, kada se pozove na namaz u petak, požurite ka spominjanju Allaha i ostavite trgovinu. To je bolje za vas, kad biste znali. A kada se namaz završi, raziđite se po zemlji i tražite Allahovu blagodat...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Džuma-namaz u džematu je obavezujuća dužnost za svakog muslimana, osim četvero: roba, žene, djeteta, ili bolesnog.",
      },
      { excerpt: "Onome ko izostavi tri džuma-namaza iz nemara, Allah će staviti pečat na srce." },
      {
        excerpt:
          "Ako kažete svom drugu 'Ćuti' u petak dok imam drži hutbu, govorili ste pogrešno (laghawta).",
      },
      { excerpt: "Kada neko od vas obavi džuma-namaz, neka nakon toga klanja četiri (rekata)." },
    ],
    actions: [
      "Planirajte put tako da stignete u džamiju prije početka hutbe.",
      "Držite telefone na nečujno i izbjegavajte razgovor tokom hutbe.",
      "Klanjajte četiri rekata nakon džume kad možete.",
    ],
    appLinks: [{ label: "Naučite Salat — lekcija o Džumi" }, { label: "Otvori Tracker" }],
    disclaimer:
      "Najmanji broj prisutnih za valjanu džumu, i da li se žene i putnici podstiču da prisustvuju, detaljna su fikhska pitanja koja se razlikuju po pravnim školama i lokalnom običaju. Žene, putnici, i bolesni koji ne prisustvuju klanjaju podne-namaz umjesto toga. Ovo je edukativni sadržaj, a ne fetva.",
  },
  {
    title: "Priprema za džumu",
    summary: "Gusul, čista odjeća, mirisi, i dolazak rano za najveću nagradu.",
    body: [
      "Priprema je dio petkovog sunneta. Ebu Seid el-Hudri prenosi da je Allahov Poslanik ﷺ rekao: 'Gusul petkom je obavezan za svakog ko je dostigao punoljetstvo' (Sahih Muslim 846). Paralelna formulacija u Sahih Buhariju (877) također vezuje petkovo kupanje uz one koji su dostigli punoljetstvo.",
      "Osim gusula, Poslanik ﷺ je podsticao da se izgleda najbolje moguće. Selman el-Farisi prenosi da je Poslanik ﷺ rekao: 'Ko se okupa petkom, očisti se koliko može, zatim upotrijebi svoje (kosno) ulje ili miris, zatim izađe, i bez guranja između dvije osobe sjedne na svoje mjesto slušajući imama do kraja, zatim klanja što mu je propisano — njegovi grijesi između tog petka i narednog bivaju oprošteni' (Sahih Buhari 883).",
      "Rani dolazak umnožava nagradu. Ebu Hurejre prenosi da je onaj koji ode u prvom satu kao onaj koji žrtvuje kamilu, zatim kravu, zatim ovna, zatim kokošku, zatim jaje — a kada imam izađe, anđeli sklapaju svoje svitke i slušaju podsjetnik (Sahih Buhari 881).",
    ],
    hadith: [
      { excerpt: "Gusul petkom je obavezan za svakog ko je dostigao punoljetstvo." },
      {
        excerpt:
          "Kupanje petkom je obavezno za svakog muškog muslimana koji je dostigao punoljetstvo.",
      },
      {
        excerpt:
          "Ko se okupa petkom, očisti se koliko može, zatim upotrijebi svoje ulje ili miris, zatim izađe, i bez guranja između dvije osobe sjedne na svoje mjesto slušajući imama do kraja, zatim klanja što mu je propisano — njegovi grijesi između tog petka i narednog bivaju oprošteni.",
      },
      {
        excerpt:
          "Ko se okupa petkom, zatim rano ode (u džamiju), kao da je žrtvovao kamilu... zatim kravu... zatim ovna... zatim kokošku... zatim jaje. Kada imam izađe, anđeli se javljaju da slušaju podsjetnik.",
      },
    ],
    actions: [
      "Uzmite gusul petkom ujutro (ili prije odlaska u džamiju).",
      "Obucite čistu, skromnu najbolju odjeću i nanesite blagi miris ako možete.",
      "Krenite rano — najraniji dolaze zaslužuju najveću nagradu.",
    ],
    appLinks: [{ label: "Naučite čistoću — Gusul" }],
    disclaimer:
      "Da li je petkov gusul strogo obavezan ili snažno naglašen sunnet klasično je pitanje razlike među pravnim školama. Svi se slažu o njegovoj velikoj vrijednosti; slijedite pouzdanu praksu vaše zajednice.",
  },
  {
    title: "Sura El-Kehf petkom",
    summary: "Svjetlo između dva petka, i zaštita u prvih deset ajeta.",
    body: [
      "Učenje sure El-Kehf (Kur'an 18) petkom je omiljena sedmična praksa. Ebu Seid el-Hudri prenosi da je Poslanik ﷺ rekao: 'Ko pročita suru El-Kehf petkom, svjetlo će mu zasvijetliti između dva petka.' Ova formulacija se prenosi putem el-Hakima i el-Bejhekija i ocijenjena je sahih od šejha el-Albanija; mnoge zajednice je slijede kao utvrđeni petkov sunnet.",
      "Posebno, prvih deset ajeta sure El-Kehf su štit protiv iskušenja Dedžala. Ebu Derda prenosi da je Poslanik ﷺ rekao: 'Ko zapamti deset ajeta s početka sure El-Kehf, bit će zaštićen od Dedžala' (Sahih Muslim 809).",
      "Nađite vremena između četvrtak navečer i petkovog akšama da pročitate suru — čak i ako ne možete završiti cijelo poglavlje, počnite s uvodnim ajetima i vraćajte se koliko možete.",
    ],
    quran: [
      {
        excerpt:
          "Sva hvala Allahu koji je poslao Knjigu Svome robu i u njoj nije učinio nikakvu izvitoperenost... Ili si mislio da su stanovnici pećine i natpisa bili čudo među Našim znakovima?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ko pročita suru El-Kehf petkom, svjetlo će mu zasvijetliti između dva petka. (Ocijenjeno sahih od el-Albanija)",
      },
      { excerpt: "Ko zapamti deset ajeta s početka sure El-Kehf, bit će zaštićen od Dedžala." },
    ],
    actions: [
      "Otvorite suru El-Kehf petkom i pročitajte što možete s prisutnošću srca.",
      "Zapamtite ili ponovite prvih deset ajeta za zaštitu od Dedžala.",
    ],
    appLinks: [{ label: "Pročitaj suru El-Kehf" }],
    disclaimer:
      "Predaja o 'svjetlu između petaka' nije u Šest knjiga; široko je prihvaćena na osnovu naknadne autentifikacije. Zaštita prvih deset ajeta (Muslim 809) je sahih bez spora.",
  },
  {
    title: "Salavati na Poslanika ﷺ petkom",
    summary: "Uvećajte blagoslove na Poslanika ﷺ na najbolji dan sedmice.",
    body: [
      "Petak je izdvojen za obilne salavate. Evs ibn Evs prenosi da je Poslanik ﷺ rekao: 'Među najboljim vašim danima je petak; zato uvećajte svoje salavate na mene tog dana, jer će vaši salavati biti mi predstavljeni.' Rekli su: 'O Allahov Poslaniče, kako će nam salavati biti predstavljeni tebi kada se raspadneš?' Rekao je: 'Allah je zabranio zemlji da proždere tijela poslanika' (Sunen Ebu Davud 1047).",
      "Bilo koja autentična formula salavata se računa — durudi koji se uče u namazu, ili duže forme iz sunneta. Bit je u obilju i iskrenosti petkom, a ne u jednom fiksnom broju.",
    ],
    hadith: [
      {
        excerpt:
          "Među najboljim vašim danima je petak; zato uvećajte svoje salavate na mene tog dana, jer će vaši salavati biti mi predstavljeni.",
      },
    ],
    actions: [
      "Postavite lični cilj salavata petkom — čak i skroman, dosljedan broj.",
      "Koristite kolekciju duruda u aplikaciji ako želite spremnu formulu.",
    ],
    appLinks: [{ label: "Durudi" }],
  },
  {
    title: "Sat uslišenja",
    summary: "Sat petkom kada dova nije odbijena — potražite ga posebno nakon ikindije.",
    body: [
      "Ebu Hurejre prenosi da je Allahov Poslanik ﷺ spomenuo petak i rekao: 'Postoji sat petkom u kojem nijedan musliman rob ne stane i traži nešto od Allaha bez da mu On to dâ' — i pokazao je rukom da je kratak (Sahih Buhari 935; također Sahih Muslim 852).",
      "Učenjaci se razlikuju o tome kada taj sat točno pada. Jedno snažno mišljenje ga smješta u posljednji dio petka nakon ikindije: Džabir ibn Abdullah prenosi da je Poslanik ﷺ rekao: 'Petak ima dvanaest sati, i u njemu postoji sat u kojem nijedan musliman rob ne traži nešto od Allaha bez da mu On to dâ — zato ga potražite u posljednjem satu nakon ikindije' (Sunen Ebu Davud 1048).",
      "Koje god mišljenje slijedite, ispunite petak — posebno kasno popodne — iskrenom dovom, istigfarom, i salavatima, vjerujući Allahovom obećanju odgovora.",
    ],
    hadith: [
      {
        excerpt:
          "Postoji sat petkom u kojem nijedan musliman rob ne stane i traži nešto od Allaha bez da mu On to dâ — i pokazao je rukom da je kratak.",
      },
      {
        excerpt:
          "Postoji sat petkom u kojem se nijedan musliman ne nalazi u namazu tražeći nešto od Allaha bez da mu On to dâ.",
      },
      {
        excerpt:
          "Petak ima dvanaest sati, i u njemu postoji sat u kojem nijedan musliman rob ne traži nešto od Allaha bez da mu On to dâ — zato ga potražite u posljednjem satu nakon ikindije.",
      },
    ],
    actions: [
      "Nakon ikindije petkom, sjednite s kratkom listom dova i tražite s prisutnošću.",
      "Kombinujte dovu sa salavatima — oba se naglašavaju ovog dana.",
    ],
    appLinks: [{ label: "Kolekcija dova" }],
    disclaimer:
      "Tačno vrijeme uslišenog sata pitanje je učenjačke razlike (tokom hutbe, nakon ikindije, i drugih mišljenja). Postojanje samog sata je utvrđeno u Buhariju i Muslimu.",
  },
];
