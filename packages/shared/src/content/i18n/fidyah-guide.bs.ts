import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// bs overlay for fidyah-guide. Index-aligned with FIDYAH_GUIDE_TOPICS in ../fidyah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const FIDYAH_GUIDE_TOPICS_BS: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Qaza, fidyah ili kaffarah?",
    summary: "Tri različita lijeka — nemojte ih miješati.",
    body: [
      "Propušteni ramazanski postovi se ne tretiraju na isti način. Privremena nesposobnost – bolest od koje očekujete da ćete se oporaviti, putovanje, trudnoća ili dojenje kada bi post štetio i slični izgovori – kasnije se nadoknađuju postom drugih dana (qaza). Kur'an kaže: \"...a ko je bolestan ili je na putovanju - onda jednak broj drugih dana\" (Kur'an 2:185).",
      "Fidyah (otkupnina za hranjenje siromašnih) je za one koji ne mogu postiti i nemaju realnu nadu da će nadoknaditi dane - klasično za starije ili hronične bolesnike za koje je post trajna teškoća. Kur'an spominje hranjenje siromaha kao otkupninu za one kojima je post suviše težak (Kur'an 2:184). Taj stih nije dozvola za preskakanje posta dok ste zdravi.",
      "Kaffarah (iskušenje) je teži. Primjenjuje se kada osoba namjerno krši ramazanski post bez valjanog opravdanja na način na koji škole tretiraju kao da zahtijeva iskupljenje - najjasnije seksualni odnos tokom dana Ramazana, kao u dobro poznatoj predaji u Sahihu Muslim. Škole se razlikuju po tome da li namjerno jedenje ili piće također obavezuje istu kafaru. Ovaj pomoćnik procjenjuje samo iznose; kvalifikovani lokalni naučnik mora klasifikovati vaš slučaj.",
    ],
    actions: [
      "Ako još uvijek možete nadoknaditi dane posteći kasnije, planirajte qaza — ne fidyah.",
      "Ako je post trajno nemoguć, pitajte učenjaka o fidji za svaki propušteni dan.",
      "Ako ste namjerno prekršili post, nemojte se oslanjati na procjenu aplikacije – pitajte učenjaka koja se odluka primjenjuje.",
    ],
    quran: [
      {
        excerpt:
          "...A na one koji mogu [da poste, ali s mukom] - otkupnina za hranjenje siromaha... I ko je bolestan ili na putu - onda jednak broj drugih dana.",
      },
    ],
  },
  {
    title: "Šta je fidyah za propuštene postove?",
    summary: "Jedna siromašna osoba nahranjena po propuštenom danu kada qaza nije moguća.",
    body: [
      "Kur'anska otkupnina za one koji ne mogu postiti s trajnim teškoćama je nahraniti siromaha za svaki dan (Kur'an 2:184). Naučnici ovo tretiraju kao fidya jedinicu: jedan dan propuštenog posta odgovara hranjenju jedne potrebite osobe (ili davanju ekvivalentne hrane koja se obično koristi u vašem mjestu).",
      "Tačna mjera hrane (mudd, sa' ili lokalni obrok) i da li je gotovinski ekvivalent prihvaćen zavisi od škole i prakse lokalnih vijeća za fetve. Mnoge zajednice objavljuju godišnji iznos fidye na osnovu troškova prehrane jedne siromašne osobe. Unesite tu lokalnu jedinicu u pomoćnik da biste procijenili ukupni iznos — to je alat za planiranje, a ne obvezujuća procjena.",
      "Fidyah ne zamjenjuje pokajanje ili brigu za siromašne iznad minimuma. Dajte iskreno, a ako vam se kasnije vrati sposobnost da postite, pitajte učenjaka da li je u vašoj situaciji potrebna neka daljnja qaza.",
    ],
    actions: [
      "Potvrdite sa naučnikom da je vaš slučaj fidyah (ne samo qaza).",
      "Koristite stopu fidya vašeg lokalnog mesdžida ili vijeća po danu kada je dostupna.",
      "Pomnožite dane × jedan obrok (ili objavljena fidya jedinica) za procjenu planiranja.",
    ],
    quran: [
      {
        excerpt:
          "...A na one koji su u stanju [da poste, ali s mukom] — otkupnina za hranjenje siromaha. A ko dobro volontira – bolje mu je. A postiti je bolje za tebe, da samo znaš.",
      },
    ],
  },
  {
    title: "Ko obično plaća fidyah?",
    summary: "Trajna nesposobnost — nije svaki promašen brz.",
    body: [
      "Klasični slučajevi za fidju umjesto kasnijeg posta su oni koji ne mogu postiti i ne mogu razumno očekivati ​​da će nadoknaditi dane - kao što su poodmakle godine ili kronična bolest gdje bi post nanio trajnu štetu. Privremena bolest koja kasnije prođe obično se nadoknađuje postom drugih dana (Kur'an 2:185).",
      "Škole pažljivo tretiraju trudnoću i dojenje: neke zahtijevaju samo qaza; drugi raspravljaju o fidji kao dodatak kada bi post naškodio majci ili djetetu. Nemojte odlučivati ​​samo na osnovu kalkulatora.",
      "Ako neko umre sa propuštenim ramazanskim postom koji se još uvijek duguje, nasljednici mogu postiti u njihovo ime ili hraniti siromašne prema autentičnim izvještajima i naučnim detaljima (vidi Buhari 1952. o postu u ime pokojnika). Pitajte učenjaka za slučaj vaše porodice.",
    ],
    disclaimer:
      "Klasifikacija trudnoće, dojenja i hronične bolesti je naučna prosudba. Ova tema je samo obrazovna.",
    quran: [
      {
        excerpt:
          "...Pa ko vidi [mladi mjesec] mjeseca, neka ga posti; a ko je bolestan ili je na putu - onda jednak broj drugih dana. Allah vam želi olakšanje, a ne želi vam teškoću...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Jedan čovjek je rekao: Moja majka je umrla od posta. Da li da postim u njeno ime? Poslanik, sallallahu alejhi ve sellem, je rekao: Da, Allahov dug ima više prava da bude plaćen.",
      },
    ],
  },
  {
    title: "Kaffarah zbog namjernog prekida posta",
    summary:
      "Oslobađanje roba, ili šezdeset uzastopnih postova, ili hranjenje šezdeset siromašnih.",
    body: [
      "Ebu Hurejre je prenio da je neki čovjek došao Poslaniku, sallallahu alejhi ve sellem, i rekao da je propao jer je imao snošaj sa svojom ženom u ramazanu dok je postio. Poslanik, sallallahu alejhi ve sellem, je upitao da li može osloboditi roba; zatim da li je mogao da posti dva uzastopna meseca; zatim da li je mogao nahraniti šezdeset siromašnih ljudi - i pomagao mu kada nije mogao (Sahih Muslim 1111; također Buhari 1936).",
      "Ovo stepenovano popuštanje je tekstualna osnova za kafaru snošaja tokom ramazanskog posta. Redoslijed u naraciji je: emancipacija, pa šezdeset uzastopnih dana posta, pa hranjenje šezdeset siromaha. Nemogućnost na svakom koraku prebacuje osobu na sljedeću opciju prema čitanju izvještaja od strane škola.",
      "Da li namjerno jedenje ili pijenje bez izgovora također obavezuje ovu istu kafaru je dobro poznata tačka razlike među mezhebima. Pomagačeva 'kafara' procjenjuje modele hranjenja šezdeset siromašnih ljudi (ili šezdeset dana posta) po jedinici incidenta - tek nakon što vam učenjak kaže da se kafara primjenjuje.",
    ],
    actions: [
      "Iskreno se pokajte i odmah prekinite sa grešnim činom.",
      "Pitajte kvalifikovanog naučnika koju naknadu – ako postoji – dugujete.",
      "Ako je hranjenje šezdeset siromašnih opcija koju možete ispuniti, koristite lokalni trošak obroka × 60 kao cifru za planiranje.",
    ],
    hadith: [
      {
        excerpt:
          "Jedan čovjek reče: Propao sam, o Allahov Poslaniče, imao sam odnos sa svojom ženom u ramazanu. Pitali su ga da oslobodi roba, da posti dva mjeseca uzastopno i da nahrani šezdeset siromaha...",
      },
      {
        excerpt:
          "Dok smo sjedili sa Poslanikom sallallahu alejhi ve sellem, došao je čovjek i rekao: Propao sam... Imao je odnos sa svojom ženom dok je postio...",
      },
    ],
  },
  {
    title: "Kako koristiti ovaj pomoćnik",
    summary: "Samo procjene — unesite lokalne cijene obroka ili fidya.",
    body: [
      "Fidyah procjena množi broj dana sa troškovima hranjenja jedne siromašne osobe (ili vaše objavljene lokalne fidya jedinice). Kafara procjena se množi sa šezdeset obroka po jedinici incidenta, što odražava opciju hranjenja u Sahihu Muslim 1111 — ili pokazuje šezdeset uzastopnih dana posta ako se umjesto toga odabere ta opcija.",
      "Unesite iznose u svojoj valuti. Preferirajte stopu fidye koju je objavio pouzdan lokalni mesdžid, Islamski centar ili naučno vijeće za tekuću godinu. Ako ništa nije objavljeno, realna cijena osnovnog hranljivog obroka za jednu osobu kojoj je potrebna je uobičajena zamjena za planiranje - još uvijek podliježe naučnoj potvrdi.",
      "Nikada ne tretirajte ukupni iznos na ekranu kao fatvu. Ako niste sigurni da li dugujete qazu, fidyah, kaffarah ili ništa osim pokajanja, zaustavite kalkulator i pitajte učenjaka koji poznaje vaše okolnosti.",
    ],
    disclaimer: "Munib Tracker pruža samo obrazovne procjene. Ne donosi islamske pravne odluke.",
    actions: [
      "Pogledajte ovogodišnju lokalnu stopu fidya prije procjene.",
      "Zabilježite dane i iznose za svoju evidenciju.",
      "Dajte putem pouzdanog kanala koji stiže do siromašnih.",
    ],
  },
];
