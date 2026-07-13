import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Bosnian translation overlay for the Learn ruqyah guide. Mirrors the order of
// RUQYAH_TOPICS in ../ruqyah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const RUQYAH_TOPICS_BS: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Šta je rukja?",
    summary: "Učenje Kur'ana, Allahovih imena ili poslaničkih dova za izlječenje.",
    body: [
      "Rukja je praksa učenja Kur'ana, Allahovih imena i svojstava, ili vjerodostojnih poslaničkih dova nad sobom ili drugom osobom — često s laganim puhanjem — tražeći izlječenje ili zaštitu samo od Allaha. Postojala je i prije islama kao opći arapski običaj, a Poslanik ﷺ je bio direktno upitan je li dozvoljena.",
      "Avf ibn Malik je prenio da su ashabi rekli: 'Prakticirali smo rukju u predislamskom periodu; šta ti misliš o tome?' Poslanik ﷺ je odgovorio: 'Pokažite mi svoju rukju — nema štete u rukji sve dok ne sadrži širk' (Sahih Muslim 2200). Ovaj jedan hadis je temelj za sve ostalo u ovom vodiču: rukja je sama po sebi dozvoljena; bitan je njen sadržaj.",
    ],
    hadith: [
      {
        excerpt:
          "Prakticirali smo rukju u predislamskom periodu, i rekli smo: O Allahov Poslaniče, šta ti misliš o tome? Rekao je: Pokažite mi svoju rukju — nema štete u rukji sve dok ne sadrži širk.",
      },
    ],
  },
  {
    title: "Dozvoljena i zabranjena rukja",
    summary: "Kur'an, Allahova imena i jasna dova — nikada širk ili nevidljivo.",
    body: [
      "Dozvoljena rukja počiva na uvjetima koje su učenjaci izveli iz hadisa: koristi Kur'an, Allahova imena i svojstva, ili vjerodostojnu poslaničku dovu; na jeziku čije značenje se razumije (ne nepoznati slogovi ili simboli); i osoba koja uči i osoba koja se liječi obje vjeruju da rukja sama po sebi nema moć — izlječenje je samo od Allaha, a riječi su samo sredstvo koje je On dopustio.",
      "Poslanik ﷺ je ovo lično pokazao: Aiša je prenijela da bi svaki put kad bi se razbolio, učio Mu'avvizat (posljednje dvije sure) nad sobom i puhao, a kada se njegova posljednja bolest pogoršala, ona bi radila isto za njega, brišući njegovo tijelo njegovom vlastitom rukom nadajući se njenom blagoslovu (Buhari 5016). Ovo je rukja u svom najjasnijem, najvjerodostojnijem obliku.",
      "Rukja postaje nedozvoljena kada prelazi u širk: pozivanje bilo koga osim Allaha, traženje pomoći od džina, korištenje nepoznatih riječi ili simbola čije značenje nije jasno, vješanje amajlija ili talismana, ili tvrdnja da praktičar rukje ima znanje o nevidljivom ili garantirano izlječenje. Također nikada nije zamjena za pet dnevnih namaza ili za traženje odgovarajućeg medicinskog liječenja — ona nadopunjuje oboje, umjesto da zamjenjuje jedno ili drugo.",
    ],
    hadith: [
      {
        excerpt:
          "Svaki put kad bi se Allahov Poslanik ﷺ razbolio, učio bi Mu'avvizat, a zatim puhao na svoje tijelo. Kad se teško razbolio, ja bih ih učila i brisala njegovo tijelo njegovom rukom, nadajući se njenom blagoslovu.",
      },
    ],
    disclaimer:
      "Rukja je duhovna praksa, a ne medicinski tretman. Ne zamjenjuje posjetu kvalificiranom liječniku zbog fizičke ili mentalne bolesti, niti zamjenjuje pet dnevnih namaza.",
  },
  {
    title: "Sura al-Fatiha kao rukja",
    summary: "Otvarajuća sura — jasno potvrđena kao valjana rukja.",
    body: [
      "Ebu Seid el-Hudri je prenio da je kada je poglavicu plemena ujela zmija, jedan od ashaba Poslanika ﷺ učio Suru al-Fatihu nad njim i on se izliječio. Kada su ashabi kasnije pitali Poslanika ﷺ je li to dozvoljeno, on se nasmiješio i rekao: 'Kako znaš da je to rukja?' — potvrđujući da je al-Fatiha, učena sa iskrenim vjerovanjem i razumijevanjem, sama po sebi valjana rukja (Buhari 5736).",
      "Kur'anski čitač ove aplikacije sadrži potpun tekst i prijevod al-Fatihe; ovaj vodič samo upućuje na nju kao izvor rukje, a ne reproducira je ovdje.",
    ],
    quran: [{ excerpt: "U ime Allaha, Milostivog, Samilosnog..." }],
    hadith: [
      {
        excerpt:
          "Jedan od njih je počeo učiti Suru al-Fatihu... pacijent se izliječio. Kad su pitali Poslanika ﷺ, on se nasmiješio i rekao: Kako znate da je al-Fatiha rukja?",
      },
    ],
    appLinks: [{ label: "Pročitaj Al-Fatihu" }],
  },
  {
    title: "Ajetul-Kursi (2:255)",
    summary: "Ajet o Prijestolju — uči se noću za Allahovu zaštitu.",
    body: [
      "Ajetul-Kursi (Kur'an 2:255) opisuje Allahovu apsolutnu vlast i široko se uči za zaštitu, posebno prije spavanja. Ebu Hurejre je prenio da mu je noćni posjetitelj koji je krao iz zekata koji je čuvao rekao: 'Kad god legneš, uči Ajetul-Kursi — čuvar od Allaha će ostati s tobom, i nikakav šejtan ti se neće približiti do jutra.' Kad je Poslanik ﷺ ovo čuo, potvrdio je: 'Rekao ti je istinu, mada je lažljivac — to je bio šejtan' (Buhari 5010).",
      "Kao i s drugim ajetima u ovom vodiču, ovdje je dat samo kratak izvod; pročitaj cijeli ajet i njegov prijevod u Kur'anskom čitaču aplikacije.",
    ],
    quran: [{ excerpt: "Allah — nema boga osim Njega, Živog, Onog koji održava postojanje." }],
    hadith: [
      {
        excerpt:
          "Kad god legneš u svoj krevet, uči Ajetul-Kursi — čuvar od Allaha će te štititi cijelu noć, i nikakav šejtan ti se neće približiti do jutra.",
      },
    ],
    appLinks: [{ label: "Pročitaj Ajetul-Kursi" }],
  },
  {
    title: "Al-Ihlas, Al-Felek i An-Nas (112–114)",
    summary: "Tri završne sure — Poslanikova ﷺ noćna rukja.",
    body: [
      "Aiša je opisala Poslanikovu ﷺ noćnu rutinu: svake noći prije spavanja bi spojio šake, učio Suru al-Ihlas, Suru al-Felek, i Suru an-Nas, puhnuo u ruke, i brisao njima svoje tijelo — počevši od glave i lica — ponavljajući to tri puta (Buhari 5017). Iste ove tri sure (al-Ihlas potvrđuje Allahovu jednost, a dvije Mu'avvizat traže zaštitu od zla) su i ono što je učio nad sobom tokom bolesti (Buhari 5016).",
      "Zajedno čine jednu od najjednostavnijih i najvjerodostojnijih dnevnih rukja rutina dostupnih — dovoljno kratke za pamćenje, i direktno potvrđene u Sunnetu.",
    ],
    quran: [
      { excerpt: "Reci: On je Allah, Jedan." },
      { excerpt: "Reci: Tražim zaštitu u Gospodara zore." },
      { excerpt: "Reci: Tražim zaštitu u Gospodara ljudi." },
    ],
    hadith: [
      {
        excerpt:
          "Kad god bi Poslanik ﷺ legao, spojio bi svoje šake i puhao u njih nakon što bi učio Suru al-Ihlas, al-Felek i an-Nas, zatim bi trljao rukama po dijelovima svog tijela do kojih je mogao doći, počevši od glave i lica. To je radio tri puta.",
      },
    ],
    actions: [
      "Zapamti Al-Ihlas, Al-Felek, i An-Nas.",
      "Uči ih svake noći prije spavanja, kao što je činio Poslanik ﷺ.",
    ],
    appLinks: [{ label: "Pročitaj tri sure" }],
  },
  {
    title: "Svakodnevna zaštita: jutarnji i večernji zikrovi",
    summary: "Trajni, svakodnevni oblik rukje za zaštitu.",
    body: [
      "Osim rukje za određenu bolest, Poslanik ﷺ je učio skup jutarnjih i večernjih zikrova (adhkar) koji djeluju kao stalna duhovna zaštita — mnogi od njih su iste ajete obrađene u ovom vodiču (Ajetul-Kursi, tri završne sure) zajedno s drugim vjerodostojnim dovama. Njihovo dosljedno učenje, umjesto samo pribjegavanja rukji kada se nešto osjeti pogrešno, je sunnetski način traženja Allahove zaštite svaki dan.",
      "Biblioteka zikrova ove aplikacije sadrži potpunu, izvorno potvrđenu zbirku jutarnjih i večernjih zikrova na jednom mjestu, spremnu za čitanje ili svakodnevno praćenje.",
    ],
    actions: [
      "Uči jutarnje zikrove nakon sabaha.",
      "Uči večernje zikrove prije akšama/zalaska sunca.",
    ],
    appLinks: [{ label: "Jutarnji i večernji zikrovi" }],
  },
  {
    title: "Izbjegavajte vrače i gatare",
    summary: "Traženje nevidljivog od bilo koga osim Allaha je ozbiljno upozorenje.",
    body: [
      "Islam povlači čvrstu granicu između vjerodostojne rukje i konsultacije sa vračarima, gatarama, astrolozima, ili bilo kim ko tvrdi da poznaje nevidljivo (gajb) ili da uklanja duhovnu nevolju nedozvoljenim sredstvima. Poslanik ﷺ je upozorio: 'Ko posjeti vrača (arraf) i pita ga o nečemu, njegov namaz neće biti primljen četrdeset noći' (Sahih Muslim 2230) — ozbiljno upozorenje čak i protiv testiranja takvih tvrdnji iz čiste kurioznosti.",
      "Ako osoba također vjeruje tvrdnjama vrača o nevidljivom, učenjaci ovo smatraju pitanjem nevjerstva, jer samo Allah ima znanje o nevidljivom (Kur'an 27:65). Kakva god teškoća da nekoga navede da razmišlja o takvoj osobi, ispravan odgovor prema poučavanju ovog vodiča je uvijek okrenuti se vjerodostojnoj rukji, dovi, i pouzdanoj medicinskoj ili naučnoj pomoći — nikada onima koji tvrde da imaju skriveno znanje.",
    ],
    hadith: [
      {
        excerpt:
          "Ko posjeti vrača (arraf) i pita ga o nečemu, njegov namaz neće biti primljen četrdeset noći.",
      },
    ],
    actions: [
      "Nikada ne konsultirajte vrače, astrologe, ili one koji tvrde da poznaju nevidljivo.",
    ],
  },
  {
    title: "Tevekkul — pouzdanje samo u Allaha",
    summary: "Rukja je sredstvo; izlječenje i ishod pripadaju Allahu.",
    body: [
      "Posljednja i najvažnija poruka u ovom vodiču je tevekkul: iskreno pouzdanje u Allaha uz korištenje dozvoljenih sredstava koje je On dao. Učenje rukje, traženje medicinske njege, i traženje od drugih da mole za tebe su svi legitimna sredstva — ali povjerenje srca mora ostati samo u Allahu, ne u riječima koje se izgovaraju ili osobi koja ih izgovara. Ovo tačno odražava uvjet iz prvog hadisa ovog vodiča: 'Nema štete u rukji sve dok ne sadrži širk' (Sahih Muslim 2200).",
      "Ovaj vodič je namjerno izostavio narodne 'protokole' i liste simptoma koje se široko širi na internetu — nijedna od njih nema jak temelj u Kur'anu ili vjerodostojnom Sunnetu, a oslanjanje na njih može tiho odvesti povjerenje osobe od Allaha prema ritualu ili listi pretpostavki. Držite se onoga što je tekstualno utemeljeno, i ostavite ostalo Allahovoj odredbi.",
    ],
    hadith: [{ excerpt: "Nema štete u rukji sve dok ne sadrži širk." }],
    disclaimer:
      "Ovo je opći edukativni sadržaj koji sažima mainstream sunnitsko učenje iz Kur'ana i vjerodostojnog hadisa. Nije fetva, i nije medicinski ili psihološki tretman. Za ozbiljnu ili trajnu nevolju, konsultirajte i kvalificiranog lokalnog učenjaka i odgovarajućeg medicinskog stručnjaka.",
  },
];
