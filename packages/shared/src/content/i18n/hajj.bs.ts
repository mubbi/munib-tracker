// Bosnian translation overlay for the Learn Hajj & Umrah guide. Mirrors the order of
// its English source in ../hajj-guide.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { HajjGuideSection } from "../../types/hajj-guide";
import type { DeepPartial } from "./localize";

export const HAJJ_GUIDE_SECTIONS_BS: DeepPartial<HajjGuideSection>[] = [
  {
    day: "Prije nego odeš",
    title: "Obaveze i uslovi",
    summary: "Zašto je hadž obavezan i za koga postaje obavezan.",
    steps: [
      {
        title: "Peti stub",
        body: 'Hadž je peti stub islama, obavezan jednom u životu svakom sposobnom muslimanu. Allah kaže: "A Allahu je od ljudi hodočašće u Dom - jer ko može naći put do njega" (Kur\'an 3:97). Svim ljudima je objavljeno: "I najavite ljudima hadž; oni će vam doći pješice i na svakoj mršavoj kamili" (Kur\'an 22:27).',
      },
      {
        title: "sposobnost (istita'ah)",
        body: "Hadž je obavezan samo za one koji su sposobni: fizičko zdravlje za putovanje, dovoljan zakonski imetak da pokrije put i svoje izdržavane osobe dok su odsutni, i siguran, otvoren put. Ko ove godine nema sredstava, nije grešan što odugovlači dok ne bude mogao.",
      },
      {
        title: "Žensko putovanje",
        body: "Većina učenjaka smatra da žena putuje na hadž sa mahremom (mužem ili bliskim nebračnim rođakom); neki kasniji naučnici dozvoljavaju putovanje unutar sigurne grupe žena od povjerenja. Slijedite odluku kvalifikovanog učenjaka u kojeg imate povjerenja i propise vaše vlasti za hadž.",
      },
    ],
  },
  {
    day: "Prije nego odeš",
    title: "Tri vrste hadža",
    summary: "Ifrad, Qiran i Tamattu' — odaberite prije ulaska u ihram.",
    steps: [
      {
        title: "Ifrad",
        body: "Hodočasnik ulazi u ihram samo za hadž, ne obavlja nikakvu posebnu umru i ne prinosi nikakvu žrtvu za to. On ostaje u ihramu do obreda Dana Nahra.",
      },
      {
        title: "Ispovest",
        body: "Hodočasnik kombinuje umru i hadž u jednom ihramu, obavljajući obrede umre i ostaje u ihramu dok se hadž ne završi. Kao i Tamattu', zahtijeva žrtvu (hady).",
      },
      {
        title: "mrtav'",
        body: "Hodočasnik obavlja punu umru u mjesecima hadža, izlazi iz ihrama, a zatim ponovo ulazi u ihram za hadž 8. zul-hidždžeta. To je ono što većina hodočasnika radi; zahtijeva žrtvu, ili post tri dana na hadžu i sedam na povratku ako si to ne može priuštiti (Kur'an 2:196).",
      },
    ],
  },
  {
    day: "Prije nego odeš",
    title: "Mikati i Ihrami",
    summary: "Gdje počinje sveta država i šta zabranjuje.",
    steps: [
      {
        title: "Pet pesnika",
        body: "Poslanik, sallallahu alejhi ve sellem, je odredio pet mikata — graničnih tačaka koje se ne smiju prelaziti bez ihrama: Dhul-Hulayfah (za Medinu), Al-Juhfah (za Siriju/Egipat), Qarn al-Manazil (za Nedžd), Yalamlam (za Jemen) i Dhat 'Irq (za Irak). Oni koji su već unutra ulaze u ihram odakle su.",
        location: "Miqat",
      },
      {
        title: "Šta je ihram",
        body: "Ihram je sveto stanje u koje se ulazi namjerom i talbijom. Muškarci nose dvije nešivene bijele čaršave; žene se drže obične skromne haljine. Unosi se nakon gusla i, za muškarce, prethodno nanošenje parfema na tijelo (ne na odjeću).",
        location: "Miqat",
      },
      {
        title: "Zabrane ihrama",
        body: "Dok ste u ihramu izbjegavajte: šivenu/prikovanu odjeću i pokrivanje glave (muškarcima), parfem, šišanje kose ili noktiju, lov na divljač, sklapanje ili sklapanje braka i bilo kakvu intimnost. Njihovo kršenje može zahtijevati iskupljenje (fidyah), pa ih se pažljivo pridržavajte.",
        location: "Miqat",
      },
    ],
  },
  {
    title: "Umra",
    summary: "Manje hodočašće — može se obaviti u bilo koje doba godine.",
    steps: [
      {
        title: "Unesite ihram",
        body: "Prije ili prije mikata, učinite gusl, obucite ihramske haljine, formirajte namjeru za Umru i započnite talbiju. Namjera je napravljena u srcu, a sveto stanje počinje od tog trenutka.",
        location: "Miqat",
      },
      {
        title: "Recituj talbiju",
        body: 'Ponavljajte "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk..." često dok putujete prema Meki - izjavu da se sami odazivate na Allahov poziv - nastavljajući sve dok ne počnete tavaf.',
      },
      {
        title: "Tavaf Kabe",
        body: "Zaokružite Ka'bu sedam puta u smjeru suprotnom od kazaljke na satu, počevši i završavajući na uglu Crnog kamena, gdje je poljubite, dodirnete ili jednostavno pokažite na nju tekbirom. Muškarci rade raml (brzim tempo) u prva tri kruga i idtiba' (ogolivši desno rame). Između Jemenskog ugla i Crnog kamena recite: \"Gospodaru naš, daj nam dobro na ovom svijetu i dobro na onom svijetu i zaštiti nas od kazne vatre\" (Kur'an 2:201).",
        location: "Al-Haram džamija",
      },
      {
        title: "Klanjati dva rekata",
        body: "Nakon tavafa, klanjajte dva rekata iza Maqam Ibrahima ako je moguće (ili bilo gdje u džamiji ako je gužva), a zatim slobodno pijte Zemzam vodu, jer je Poslanik, sallallahu alejhi ve sellem, rekao da je Zemzam za sve što se pije.",
        location: "Al-Haram džamija",
      },
      {
        title: "Sretno između Safe i Marwah",
        body: "Prošećite sedam puta između Safe i Merve, počevši od Safe, u znak sjećanja na Hadžarinu potragu za vodom za svog sina Ismaila. Allah kaže: \"Es-Safa i El-Merva su, zaista, među Allahovim simbolima\" (Kur'an 2:158). Na Safi, licem prema Ka'bi i podignite ruke u dovi i tekbiru; muškarci trče između zelenih oznaka.",
        location: "Al-Haram džamija",
      },
      {
        title: "Ljudi su krivi",
        body: "Muškarci briju glavu (halq, nagrađeniji) ili je ravnomjerno podrezuju (taqsir); žene skupljaju kosu i šišaju do vrha prsta. Ovim je umra završena i ograničenja ihrama ukidaju.",
      },
    ],
  },
  {
    day: "8. zul-hidže",
    title: "Dan Tarwiyah — Mina",
    summary: "Hodočašće počinje; dan se provodi u Mini.",
    steps: [
      {
        title: "Uđite u ihram za hadž",
        body: "Napravite namjeru za hadž i ponovo uđite u ihram (iz svog prebivališta u Mekki za tamattu'), obnavljajući talbiju. Ovo ponovo započinje sveto stanje, tako da se ihramske zabrane još jednom primjenjuju.",
      },
      {
        title: "Putovanje do Mine",
        body: "Idite na Minu i klanjajte Zhur, Asr, Magrib, Išu i sljedeći sabah, svaki skraćen na dva rekata u svoje vrijeme, slijedeći sunnet Poslanika, sallallahu alejhi ve sellem. Provedite dan i noć u ibadetu, čekajući stajanje na Arefi.",
        location: "Mina",
      },
    ],
  },
  {
    day: "9 zul-hidždžeta",
    title: "Dan Arefata",
    summary: "Najveći dan hadža - stajanje na Arefi.",
    steps: [
      {
        title: "Stanite kod Arafe",
        body: 'Ostanite unutar granica Arefata od poslije podne do zalaska sunca u dovi, zikru i pokajanju. Poslanik, sallallahu alejhi ve sellem, je rekao: "Hadž je Arefa" (Tirmizi 889, Ebu Davud 1949, hasen sahih): ko propusti ovo stajanje, propustio je hadž. Suočite se sa kibli, podignite ruke i molite Allaha - to je najveći dan za dovu.',
        location: "Arafah",
      },
      {
        title: "Kombinirajte Dhuhr & Asr",
        body: "Molite Zhuhr i Asr zajedno i skraćeno u vrijeme Zhura (džem' taqdim), a zatim ostatak dana u potpunosti posvetite molitvi umjesto dodatnoj molitvi.",
        location: "Arafah",
      },
      {
        title: "Pređite u Muzdalifu",
        body: "Nakon zalaska sunca otputujte mirno do Muzdalife, spojite Maghrib i Isha (Isha skraćeno), odmorite noć i skupite kamenčiće za kamenovanje. Slabi i žene mogu otići u Minu nakon ponoći kako bi izbjegli simpatiju.",
        location: "Muzdalifah",
      },
    ],
  },
  {
    day: "10. zul-hidže",
    title: "Dan Nahra — Kurban-bajram",
    summary: "Kamenovanje, žrtvovanje i glavni tavaf.",
    steps: [
      {
        title: "Kamen Džemrat al-Akaba",
        body: 'Vratite se prema Mini i bacite sedam kamenčića na veliki stub (Jamrat al-Aqaba), govoreći "Allahu ekbar" pri svakom bacanju. Ovo ponavlja Ibrahimovo odbacivanje šejtana i predstavlja prvi obred dana.',
        location: "Mina",
      },
      {
        title: "Prinesi žrtvu",
        body: "Zakoljite kurban ili ga organizirajte preko pouzdane agencije, kako se zahtijeva za tamattu' i qiran hadžije (Kur'an 2:196). Njegovo meso se jede i daje siromasima.",
      },
      {
        title: "Ljudi su krivi",
        body: "Obrijati (halq) ili podrezati (taqsir) kosu; žene skrate do vrha prsta. Nakon kamenovanja i brijanja, primjenjuje se prvo otpuštanje (tahallul awwal) — ukidaju se sva ograničenja ihrama osim intimnosti sa supružnikom.",
      },
      {
        title: "Tawaf al-Ifadah",
        body: "Idite u Mekku za Tawaf al-Ifadah — stub hadža — i sa'i (za tamattu'). Ovim je završeno potpuno oslobađanje od ihrama, a onaj ko je izbjegao nepristojnost i grijeh \"vraća se kao dan kada ga je rodila njegova majka\" (Buhari 1521, Musliman 1350).",
        location: "Al-Haram džamija",
      },
    ],
  },
  {
    day: "11–13 zul-hidže",
    title: "Dani Tašrika — Mina",
    summary: "Noći u Mini i svakodnevno kamenovanje tri stuba.",
    steps: [
      {
        title: "Noćenje u Mini",
        body: "Provedite noći 11., 12. (i 13. ako ne krenete ranije) u Mini. Ovo su dani jela, pića i spominjanja Allaha, koji se provodi u ibadetu i tekbiru.",
        location: "Mina",
      },
      {
        title: "Kamenujte tri džemarata",
        body: "Svakog poslijepodneva nakon Zuhra, bacite sedam kamenčića na svaki od tri stuba po redu - mali, zatim srednji, pa veliki - sa tekbirom na svakom bacanju. Onaj ko požuri može otići nakon kamenovanja 12. (Kur'an 2:203).",
        location: "Mina",
      },
      {
        title: "Zbogom Tawaf",
        body: "Prije napuštanja Mekke, obavite Tawaf al-Wada kao završni obred, tako da posljednji čin hadža bude kod kuće. Žene koje imaju menstruaciju su izuzete od toga.",
        location: "Al-Haram džamija",
      },
    ],
  },
  {
    day: "Završetak i odluke",
    title: "Stubovi, obaveze i nagrada",
    summary: "Šta potvrđuje hadž, šta se nadoknađuje i njegova nagrada.",
    steps: [
      {
        title: "Stubovi (arkan)",
        body: "Stubovi su suština hadža: ulazak u ihram, stajanje na Arefi, Tavaf al-Ifade i sa'i (kao što većina drži). Ako se promaši bilo koji stub, hadž je nevažeći i ne može se nadoknaditi žrtvom - mora se ponoviti.",
      },
      {
        title: "Obaveze (vadžibat)",
        body: "Obaveze uključuju ulazak u ihram iz mikata, boravak na Muzdalifi, kamenovanje džemata, provođenje noći tešrika u Mini i oproštajni tavaf. Izostavljanje obaveze ne poništava hadž, ali se nadoknađuje branom (žrtvom). Mezhebi se razlikuju po tačnim listama; konsultujte kvalifikovanog vodiča.",
      },
      {
        title: "Nagrada za hadž Mabrur",
        body: 'Prihvaćen hadž (Hadž mabrur) – oslobođen grijeha i iskreno učinjen – briše prošle grijehe i njegova nagrada je sam Džennet. Poslanik, sallallahu alejhi ve sellem, je rekao: "Prihvaćeni hadž nema nagradu osim dženneta" (Buhari 1773., Musliman 1349.). Težite izvrsnom karakteru i nježnosti u cijelom.',
      },
      {
        title: "Praktični vodič, a ne fetva",
        body: "Ovo je praktičan pregled koji će vam pomoći da pratite obrede po redu. Mezhebi se razlikuju s poštovanjem u mnogim detaljima, a situacija svakog hodočasnika je drugačija — uvijek se obratite kvalifikovanom učenjaku ili svom službenom vodiču za hadž za specifične odluke i neočekivane slučajeve.",
      },
    ],
  },
  {
    day: "Prije nego odeš",
    title: "Viza i registracija",
    summary:
      "Kako se hodočasnici registruju i dobijaju vizu za hadž ili umru putem zvaničnih kanala.",
    steps: [
      {
        title: "Platforma Nusuk",
        body: "Nusuk (nusuk.sa) je zvanična platforma Saudijske Arabije za hadž i umru — koristi se za rezervaciju viza, smještaja, transporta i registrovanih turističkih paketa. Koristite samo Nusuk ili agencije licencirane putem njega; nezvanični posrednici su čest izvor prevara i otkazanih putovanja.",
      },
      {
        title: "Vize za hadž i državne kvote",
        body: "Svaka država dobija godišnju kvotu za hadž, tako da se većina hodočasnika prijavljuje putem svoje nacionalne institucije za hadž ili licenciranog lokalnog agenta, a ne pojedinačno. Prijavite se rano u godini kada se otvori sezona hadža — kvote i mjesta u paketima popune se mjesecima unaprijed.",
      },
      {
        title: "Vize za umru",
        body: "Za razliku od hadža, umra nema kvotu i može se obaviti u bilo koje doba godine. Većina državljanstava može aplicirati za vizu za umru direktno putem Nusuka ili odobrenog putničkog agenta, obično zajedno s rezervacijom leta i hotela.",
      },
    ],
  },
  {
    day: "Prije nego odeš",
    title: "Popis za pakovanje",
    summary: "Praktične stvari koje treba ponijeti prije putovanja.",
    steps: [
      {
        title: "Odjeća za ihram",
        body: "Muškarci bi trebali ponijeti najmanje dva kompleta nešivene odjeće za ihram (pojas i ogrtač) plus širok, nekožni pojas za ihram za novac i dokumente. Žene bi trebale ponijeti široku, skromnu, neukrašenu vanjsku odjeću.",
      },
      {
        title: "Obuća i komfor",
        body: "Otvorene sandale koje se lako navlače i skidaju su neophodne, jer je muškarcima u ihramu zabranjena obuća koja prekriva gležnjeve. Ponesite laganu ruksak, bocu za vodu koja se može puniti i mali molitveni ćilim za duga čekanja.",
      },
      {
        title: "Toaletni pribor bez mirisa",
        body: "Ponesite sapun bez mirisa, kremu za sunčanje i vlažne maramice — parfimisani proizvodi su zabranjeni u ihramu. Kompaktna kutija za prvu pomoć, lični lijekovi s liječničkim uputstvom i flasteri za žuljeve vrijede dodatne težine s obzirom na količinu hodanja.",
      },
      {
        title: "Dokumenti i osnovne stvari",
        body: "Čuvajte pasoš, ispis vize, potvrdu o vakcinaciji (meningitis se često traži) i hitne kontakte u tankoj torbici koja se nosi ispod odjeće. Prijenosna power banka i lokalna SIM kartica ili eSIM znatno olakšavaju kretanje po prepunim mjestima.",
      },
    ],
  },
  {
    day: "Prije nego odeš",
    title: "Vodič kroz sveta mjesta",
    summary: "Kratke praktične napomene o glavnim mjestima koja ćete posjetiti.",
    steps: [
      {
        title: "Al-Haram džamija, Mekka",
        body: "Velika džamija koja okružuje Ka'bu — mjesto tavafa i sa'ija. Radi 24 sata; očekujte veoma velike gužve u blizini Crnog kamena i tokom pet dnevnih namaza, posebno u zadnjih deset noći ramazana i danima hadža.",
        location: "Mekka",
      },
      {
        title: "Džamija Poslanika, Medina",
        body: "Poslanikova, sallallahu alejhi ve sellem, džamija, dom Ravde i njegovog počivališta, nije dio samog hadža, ali gotovo svi hodočasnici posjete Medinu prije ili poslije. Za ulazak u Ravdu potrebna je propusnica s vremenom, rezervisana putem Nusuka ili aplikacije Ravda.",
        location: "Medina",
      },
      {
        title: "Mina",
        body: "Šatorski grad nekoliko kilometara od Mekke gdje hodočasnici provode noći 8., 11., 12. (i 13.) zul-hidžeta. Klimatizovane, protivpožarne šatorske kampove dodjeljuje turoperator; očekujte osnovne zajedničke sadržaje i dugo hodanje do Džemarata.",
        location: "Mina",
      },
      {
        title: "Arefat",
        body: "Otvorena ravnica oko 20 km od Mekke, mjesto najvažnijeg obreda hadža — stajanja 9. zul-hidžeta. Obezbijeđene su sjenice i mjesta s vodom, ali dnevna vrućina je jaka; hidratacija i zaštita od sunca su ključne.",
        location: "Arafah",
      },
      {
        title: "Muzdelifa",
        body: "Otvoreno područje između Arefata i Mine gdje hodočasnici provode noć 9–10. zul-hidžeta pod otvorenim nebom i skupljaju kamenčiće za kamenovanje. Sadržaji su namjerno minimalni — ponesite ćilim i obucite se za hladniji noćni zrak.",
        location: "Muzdalifah",
      },
    ],
  },
  {
    day: "Prije nego odeš",
    title: "Zvanični izvori",
    summary: "Gdje pronaći pouzdane, ažurne zvanične informacije.",
    steps: [
      {
        title: "Nusuk (nusuk.sa)",
        body: "Zvanični portal i aplikacija Saudijskog ministarstva za hadž i umru za vize, akreditovane pakete, dozvole za posjetu Ravdi i smjernice o gužvama i transportu u realnom vremenu — prva stanica za svako zvanično pitanje.",
      },
      {
        title: "Institucija za hadž vaše zemlje",
        body: "Većina zemalja ima nacionalnu instituciju ili ministarski ured za hadž koji upravlja godišnjom kvotom, provjerava lokalne agente i objavljuje raspored polazaka i zdravstvene uslove — provjerite ga prije rezervacije putem bilo kojeg privatnog agenta.",
      },
      {
        title: "Visit Saudi (visitsaudi.com)",
        body: "Zvanični turistički sajt Kraljevine sadrži uslove za ulazak, informacije o e-vizi za državljane koji ispunjavaju uslove i praktične savjete za putovanje u Mekku, Medinu i dalje putovanje unutar Saudijske Arabije.",
      },
      {
        title: "Provjerite prije plaćanja",
        body: "Rezervišite samo putem agencija navedenih na Nusuku ili vaše nacionalne institucije za hadž. Ako se ponuda čini neobično jeftinom ili posrednik traži plaćanje van zvaničnih kanala, smatrajte to upozorenjem i provjerite direktno preko ministarskog portala.",
      },
    ],
  },
];
