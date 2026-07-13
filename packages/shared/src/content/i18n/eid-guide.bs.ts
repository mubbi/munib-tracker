import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Bosnian translation overlay for the Learn Eid guide. Mirrors the order of
// EID_GUIDE_TOPICS in ../eid-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const EID_GUIDE_TOPICS_BS: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Ramazanski bajram — praznik prekida posta",
    summary: "Prvi dan mjeseca ševvala, koji obilježava kraj ramazanskog posta.",
    body: [
      "Ramazanski bajram pada 1. ševvala, odmah nakon ramazana, i to je dan radosti i zahvalnosti što je vjernik bio u stanju da posti i obavlja ibadet cijeli mjesec. Kur'an direktno povezuje kraj posta sa spominjanjem Allaha i zahvalnošću: '...da napunite određeni broj dana i da veličate Allaha zato što vas je upputio, i da biste bili zahvalni' (Kur'an, 2:185).",
      "Post na ovaj dan je izričito zabranjen, ne samo nepoželjan — Poslanik ﷺ je, zajedno s Kurban-bajramom, naveo ovaj dan kao jedan od dva dana u kojima je muslimanima naređeno da jedu, a ne da poste (Buhari 1990). Dan počinje sadekatul-fitrom i bajram-namazom, a nastavlja se posjetama rodbini, razmjenom čestitki i općim veseljem u islamskim granicama.",
    ],
    quran: [
      {
        excerpt:
          "...da napunite određeni broj dana i da veličate Allaha zato što vas je upputio, i da biste bili zahvalni.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ovo su dva dana u kojima je Allahov Poslanik ﷺ zabranio post: dan kada prekidate svoj post (ramazana), i dan kada jedete od svoje žrtve.",
      },
    ],
  },
  {
    title: "Kurban-bajram — praznik žrtvovanja",
    summary: "10. zul-hidžeta, sjećanje na žrtvu Ibrahima, a.s.",
    body: [
      "Kurban-bajram pada 10. zul-hidžeta, Dan klanja tokom hadždža, i obilježava spremnost Ibrahima, a.s., da žrtvuje svog sina iz pokornosti Allahu, i Allahovu milost time što ga je otkupio velikom žrtvom umjesto toga (Kur'an, 37:102–107). Po mišljenju mnogih učenjaka, ovo je veći od dva bajrama, koji se poklapa sa dovršetkom hadždža za one koji su na hadždžu.",
      "Kao i na Ramazanski bajram, post na ovaj dan je zabranjen (Buhari 1990). Njegov glavni dodatni obred je kurban (udhijja), koji prinose oni koji su u stanju, u znak sjećanja na predanost Ibrahima, a.s., i kao djelo ibadeta i sadake istovremeno.",
    ],
    quran: [
      {
        excerpt:
          "I kad on odraste toliko da mu poče u poslu pomagati, Ibrahim reče: 'O sinko moj, u snu sam vidio da treba da te zakoljem...' I mi ga iskupismo velikom žrtvom.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ovo su dva dana u kojima je Allahov Poslanik ﷺ zabranio post: dan kada prekidate svoj post (ramazana), i dan kada jedete od svoje žrtve.",
      },
    ],
  },
  {
    title: "Kako se klanja bajram-namaz",
    summary: "Dva rekata s dodatnim tekbirima — bez ezana i ikameta.",
    body: [
      "Bajram-namaz se sastoji od dva rekata, klanja se u džematu bez prethodnog ezana i ikameta — Džabir ibn Abdullah i Ibn Abbas su obojica potvrdili da nije bilo pozivanja na namaz za bajrame u vrijeme Poslanika ﷺ (Sahih Muslim 886). Namazu slijedi hutba, za razliku od džuma-namaza gdje hutba prethodi namazu.",
      "Dodatni tekbiri (izgovaranje 'Allahu ekber') se dodaju prije kiraeta u svakom rekatu, pored običnih tekbira namaza. Aiša, r.a., prenosi da je Poslanik ﷺ izgovarao tekbir sedam puta u prvom rekatu i pet puta u drugom, za oba bajrama (Ebu Davud 1149), broj koji se prenosi i od Abdullaha ibn Amra (Ebu Davud 1151).",
    ],
    hadith: [
      {
        excerpt:
          "Na dan Ramazanskog bajrama nije bilo ezana kada je imam izlazio, niti nakon njegovog izlaska; nije bilo ni ikameta, ni pozivanja, ni bilo čega slično tog dana.",
      },
      {
        excerpt:
          "Allahov Poslanik ﷺ je izgovarao tekbir sedam puta u prvom rekatu i pet puta u drugom rekatu na dan prekida posta i na dan klanja žrtve.",
      },
    ],
    madhhabNote:
      "Pravne škole se razlikuju po tačnom broju dodatnih tekbira. Šafijski, malikijski i hanbelijski pravnici slijede predaju sedam-pet (Ebu Davud 1149/1151) — malikije i hanbelije ubrajaju početni tekbir u sedam, pa govore šest-pet. Hanefijska pravna škola pak zastupa 3 dodatna tekbira prije kiraeta u prvom rekatu i 3 prije ruknua u drugom (6 ukupno) — stav kufskih pravnika za koji ne postoji zasebno potvrđen merfu hadis; slijedite broj tekbira imama vaše džemata.",
    actions: [
      "Dođite na vrijeme — nema ezana ni ikameta koji označavaju početak.",
      "Slijedite broj tekbira svog imama; praksa svake škole je valjana.",
      "Ostanite na hutbu nakon namaza.",
    ],
  },
  {
    title: "Sunneti tog dana",
    summary: "Kupanje, najbolja odjeća, jelo prije/nakon, i dva različita puta.",
    body: [
      "Nekoliko malih sunneta se preporučuje prije i nakon bajram-namaza. Na Ramazanski bajram, Poslanik ﷺ nije izlazio na namaz dok ne bi pojeo nekoliko datula, u neparnom broju (Buhari 953) — suprotno Kurban-bajramu, gdje se preporučuje sačekati i jesti od žrtve nakon povratka s namaza.",
      "Sunnet je okupati se i obući najbolju (čistu, dostojnu) odjeću za ovu priliku, slijedeći opću praksu ashaba na oba bajrama, mada ova konkretna predaja nije toliko snažno potvrđena kao ostale ovdje, i predstavlja praksu koja se široko slijedi više nego jedan hadis ocijenjen kao sahih.",
      "Poseban sunnet je vratiti se kući drugim putem od onog kojim se otišlo. Džabir ibn Abdullah prenosi: 'Na dan bajrama Poslanik ﷺ se vraćao (nakon obavljanja bajram-namaza) drugim putem od onog kojim je otišao' (Buhari 986) — obično se objašnjava kao umnožavanje mjesta koja svjedoče o njegovom ibadetu i šire prikazivanje islamskih obreda.",
    ],
    hadith: [
      {
        excerpt:
          "Poslanik ﷺ nikada ne bi izlazio (na namaz) na dan Ramazanskog bajrama osim ako nije pojeo nekoliko datula, koje je jeo u neparnom broju.",
      },
      {
        excerpt:
          "Na dan bajrama Poslanik ﷺ se vraćao (nakon obavljanja bajram-namaza) drugim putem od onog kojim je otišao.",
      },
    ],
    actions: [
      "Okupajte se i obucite svoju najbolju dostojnu odjeću.",
      "Pojedite neparan broj datula prije namaza Ramazanskog bajrama; sačekajte s jelom do nakon namaza Kurban-bajrama.",
      "Vratite se drugim putem od onog kojim ste otišli na namaz.",
    ],
  },
  {
    title: "Sadekatul-fitr — osnove",
    summary: "Mala obavezna sadaka, koja se daje prije namaza Ramazanskog bajrama.",
    body: [
      "Sadekatul-fitr (zekatul-fitr) je zasebna, manja sadaka od zekata na imetak, obavezna za svakog muslimana — mladog ili starog, muškarca ili žene, slobodnog ili uzdržavanog — koju u njegovo ime plaća glava porodice. Ibn Omer, r.a., prenosi da je Poslanik ﷺ propisao jedan sa' (oko 2–3 kg) datula ili ječma za svakog muslimana, koji se plaća prije nego što ljudi izađu na bajram-namaz (Buhari 1503).",
      "Njena svrha je izričito navedena u sunnetu: 'čišćenje posti od ispraznog i pogrdnog govora, i hrana za siromahe' (Ebu Davud 1609). Plaćanje prije bajram-namaza računa se kao ova posebna sadaka; plaćanje nakon namaza se i dalje računa kao opća sadaka, ali gubi posebnu nagradu vezanu za vrijeme.",
      "Većina zajednica danas obračunava vrijednost u lokalnoj valuti umjesto da direktno raspodjeljuje datule ili ječam, slijedeći upute lokalnih učenjaka i zekatskih institucija o trenutnim vrijednostima osnovnih namirnica — praktično prilagođavanje, a ne promjena same obaveze.",
    ],
    hadith: [
      {
        excerpt:
          "Allahov Poslanik ﷺ je propisao davanje jednog Sa'a datula ili jednog Sa'a ječma kao Sadekatul-fitr za svakog muslimana, roba ili slobodnog, muškarca ili žene, mladog ili starog, i naredio je da se plati prije nego što ljudi izađu da obave bajram-namaz.",
      },
      {
        excerpt:
          "Allahov Poslanik ﷺ je propisao Sadekatul-fitr kao čišćenje posti od ispraznog i pogrdnog govora, i kao hranu za siromahe. Ko je plati prije namaza, to je primljeni zekat; ko je plati nakon namaza, to je (obična) sadaka.",
      },
    ],
    actions: [
      "Obračunajte i izdvojite sadekatul-fitr za sebe i svoje uzdržavane članove porodice.",
      "Platite je prije odlaska na namaz Ramazanskog bajrama ako je moguće.",
    ],
    appLinks: [{ label: "Kalkulator zekata" }],
  },
  {
    title: "Kurban (udhijja) — osnove",
    summary: "Žrtvovanje životinje na Kurban-bajram, čije se meso deli siromašnima.",
    body: [
      "Kurban je klanje životinje koja ispunjava uslove (ovca, koza, krava ili kamila, koja ispunjava uslove starosti i zdravlja) na Kurban-bajram i naredne dane tešrika, u znak sjećanja na žrtvu Ibrahima, a.s. Enes, r.a., prenosi da je Poslanik ﷺ sam vlastitim rukama zaklao dva crno-bijela ovna, izgovarajući Allahovo ime i tekbir nad njima (Buhari 5558) — ovo utvrđuje da je lično obavljanje klanja, kada je moguće, bolja praksa, mada je i povjeravanje drugome u svoje ime valjano.",
      "Kur'an direktno povezuje žrtvovanje s podjelom njenog mesa: '...jedite od njih i hranite siromaha i onog koji prosi' (Kur'an, 22:36). Meso se općenito deli između vlastitog domaćinstva, porodice i prijatelja, i siromašnih, tako da ova priilka spaja ibadet, darežljivost i zahvalnost.",
      "Klanje treba obaviti nakon bajram-namaza, a ne prije — jednom ashabu koji je zaklao rano, Poslanik ﷺ je rekao da to ponovi, jer žrtva prinesena prije namaza se ne računa kao kurban. Propisi o tome ko je tačno obavezan, i precizni vremenski okviri, razlikuju se po pravnim školama; konsultujte kvalifikovanog lokalnog učenjaka za vašu situaciju.",
    ],
    quran: [
      {
        excerpt:
          "...u njima za vas ima dobro. Spominjite, zato, Allahovo ime kad budete ove postrojene klali, pa kad padnu na zemlju, jedite od njih i hranite i onoga koji je zadovoljan onim što ima, i onoga koji prosi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Poslanik ﷺ je zaklao dva ovna, crno-bijele boje, i vidio sam ga kako stavlja nogu na njihove bokove izgovarajući Allahovo Ime i tekbir. Zatim ih je zaklao vlastitim rukama.",
      },
    ],
    actions: [
      "Organizirajte svoj kurban prije Kurban-bajrama ako ste u mogućnosti i on vam je obavezan.",
      "Osigurajte da klanje bude nakon bajram-namaza, a ne prije.",
      "Podijelite meso između svog domaćinstva, porodice/prijatelja, i siromašnih.",
    ],
    disclaimer:
      "Ko je tačno obavezan kurbanom, i precizan valjani period za klanje, detaljna su fikhska pitanja koja se razlikuju po pravnim školama. Ovo je opći edukativni sadržaj, a ne fetva — konsultujte kvalifikovanog lokalnog učenjaka za vašu situaciju.",
  },
];
