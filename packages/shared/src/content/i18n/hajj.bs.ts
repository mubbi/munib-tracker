import type { PilgrimageChecklistItem } from "../../types/hajj-guide";
import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// BS overlay for Hajj & Umrah Learn topics + rite checklists (Bosnian, Latin).
// Index-aligned with English sources; only human-readable text is translated.

export const HAJJ_GUIDE_TOPICS_BS: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Nagrada prihvaćenog hadža",
    summary: "Hadž mabrur briše grijehe, a nagrada mu je Džennet.",
    body: [
      "Ebu Hurejre prenosi da je Poslanik Allaha ﷺ rekao: «Ko obavi hadž radi Allaha, pa ne učini rafas niti grijeh, vrati se kao na dan kad ga je majka rodila» (Sahih al-Buhari 1521; Sahih Muslim 1350).",
      "Također je rekao: «Prihvaćeni hadž (hadž mabrur) nema druge nagrade osim Dženneta» (Sahih al-Buhari 1773; Sahih Muslim 1349). Prihvatljivost je povezana sa iskrenosti i čuvanjem hadža od nehajnosti i grijeha — ne samo sa završetkom spoljašnjih koraka.",
    ],
    hadith: [
      {
        excerpt:
          "Ko obavi hadž radi Allaha, pa ne učini rafas niti grijeh, vrati se kao na dan kad ga je majka rodila.",
      },
      {
        excerpt:
          "Ko obavi hadž radi Allaha, pa ne učini rafas niti grijeh, vrati se kao na dan kad ga je majka rodila.",
      },
      {
        excerpt: "Prihvaćeni hadž nema druge nagrade osim Dženneta.",
      },
      {
        excerpt: "Prihvaćeni hadž nema druge nagrade osim Dženneta.",
      },
    ],
    actions: [
      "Namjeravaj hadž isključivo radi Allaha — čuvaj jezik i karakter tokom cijelog putovanja.",
      "Koristi aplikacijsku listu hadža samo kao podsjetnik; neka srce ostane usmjereno na prihvat.",
    ],
    appLinks: [
      {
        label: "Lista hadž obreda",
      },
    ],
  },
  {
    title: "Vrijednost umre",
    summary: "Umra do umre briše grijehe između njih.",
    body: [
      "Ebu Hurejre prenosi da je Poslanik ﷺ rekao: «Obavljanje umre iskupljuje grijehe između nje i prethodne, a prihvaćeni hadž nema druge nagrade osim Dženneta» (Sahih al-Buhari 1773; Sahih Muslim 1349).",
      "Umra se može obaviti bilo kada tokom godine. Kraća je od hadža, ali je veliko ibadet: ihram, tavaf, sa'j i brijanje ili skraćivanje kose.",
    ],
    hadith: [
      {
        excerpt:
          "Obavljanje umre iskupljuje grijehe između nje i prethodne, a prihvaćeni hadž nema druge nagrade osim Dženneta.",
      },
      {
        excerpt:
          "Obavljanje umre iskupljuje grijehe između nje i prethodne, a prihvaćeni hadž nema druge nagrade osim Dženneta.",
      },
    ],
    actions: ["Otvori listu umre kad budeš spreman proći obrede redom."],
    appLinks: [
      {
        label: "Lista umra obreda",
      },
    ],
  },
  {
    title: "Dan Arafaha",
    summary: "Stajanje na Arafi je srce hadža — i veliki dan du'a.",
    body: [
      "Abd ar-Rahman ibn Ja'mar prenosi da je Poslanik ﷺ rekao: «Hadž je Arafa» (Sunan Ebu Davud 1949; Džami' et-Tirmizi 889). Ko propusti stajanje unutar granica Arafe u njenom vremenu, propustio je hadž te godine.",
      "Za one koji nisu na hadžu, post na Dan Arafaha je snažno preporučen: Ebu Katade prenosi da post na Arafi iskupljuje grijehe prošle i naredne godine (Sahih Muslim 1162). Sami hodočasnici ne poste kako bi dan posvetili du'a.",
    ],
    hadith: [
      {
        excerpt: "Hadž je Arafa.",
      },
      {
        excerpt: "Hadž je Arafa.",
      },
      {
        excerpt:
          "Post na Dan Arafaha, nadam se od Allaha, iskupljuje grijehe godine prije nje i godine poslije nje.",
      },
    ],
  },
  {
    title: "Hadž — peti stub",
    summary: "Obavezan jednom u životu za svakog sposobnog muslimana.",
    body: [
      "Allah kaže: «A ljudima je dužan hadž Kući — onome ko može naći put do nje. A ko ne vjeruje — Allah je doista neovisan o svjetovima» (Kur'an 3:97).",
      "Poziv je objavljen svim ljudima: «I obavijesti ljude o hadžu; doći će k tebi pješice i na svakom mršavom devu; doći će iz svake duboke doline» (Kur'an 22:27).",
      "Ibn Omar prenosi da je Poslanik ﷺ rekao da je islam izgrađen na pet stvari: svjedočenje, salat, zekat, post u Ramazanu i hadž Kući onome ko je sposoban (Sahih al-Buhari 8; Sahih Muslim 16). Učenjaci se slažu da je obavezan jednom u životu kad su ispunjeni uslovi; ponavljanje je dobrovoljna vrjednoba.",
    ],
    quran: [
      {
        excerpt: "A ljudima je dužan hadž Kući — onome ko može naći put do nje...",
      },
      {
        excerpt: "I obavijesti ljude o hadžu; doći će k tebi pješice i na svakom mršavom devu...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Islam je izgrađen na pet stvari: svjedočenje da nema boga osim Allaha i da je Muhammed Poslanik Allaha, uspostavljanje salata, davanje zekata, post u Ramazanu i hadž Kući onome ko može naći put do nje.",
      },
      {
        excerpt: "Islam je izgrađen na pet stvari... i hadž Kući onome ko može naći put do nje.",
      },
    ],
  },
  {
    title: "Sposobnost (istita'ah)",
    summary: "Zdravlje, halal imetak i siguran put — bez toga hadž još nije dužan.",
    body: [
      "Uslov u Kur'anu 3:97 je sposobnost (istita'ah). Klasični učenjaci to sažimaju kao: tjelesno zdravlje za put, dovoljan halal imetak za putovanje i potrebe uzdržavanih dok ste odsutni, te siguran i otvoren put.",
      "Ko ove godine nema ta sredstva nije griješan ako odgodi dok ne bude sposoban. Sposobnost se procjenjuje slučaj po slučaj — bolest, dug koji se mora vratiti ili nesigurno putovanje mogu ukinuti neposrednu obavezu. Pitaj kvalificiranog učenjaka kad ti situacija nije jasna.",
    ],
    quran: [
      {
        excerpt: "...onome ko može naći put do nje.",
      },
    ],
    actions: [
      "Podmiri obavezne dugove i uredi uzdržavanje za zavisne prije rezervacije.",
      "Provjeri pakete samo kroz službene kanale (vidi teme Priprema).",
    ],
  },
  {
    title: "Putovanje žene na hadž",
    summary: "Većina zahtijeva mahrama; neki kasniji stavovi dopuštaju sigurnu pouzdanu grupu.",
    body: [
      "Ibn Abbas prenosi da je Poslanik ﷺ rekao da žena ne smije putovati osim s mahramom, i da muškarac ne smije ući k njoj osim ako je mahram prisutan (Sahih al-Buhari 1862; Sahih Muslim 1341). Mnogi učenjaci to primjenjuju na put hadža i umre.",
      "Neki kasniji učenjaci — vodeći računa o sigurnosti, nuždi i savremenom putovanju — dopuštaju ženi put za obavezni hadž u pouzdanoj grupi kad mahram nije dostupan. Ovo ostaje sporno fikh pitanje.",
    ],
    hadith: [
      {
        excerpt:
          "Žena ne smije putovati osim s mahramom, i muškarac ne smije ući k njoj osim ako je mahram s njom.",
      },
      {
        excerpt:
          "Nije dopušteno ženi koja vjeruje u Allaha i Posljednji dan da putuje dan i noć osim s mahramom.",
      },
    ],
    madhhabNote:
      "Većina smatra da žena treba mahrama za hadž put. Neki kasniji učenjaci dopuštaju put u sigurnoj grupi žena za obavezni hadž. Slijedi učenjaka kojem vjeruješ i propise tvoje hadž vlasti.",
    disclaimer: "Ovo je opći pregled, a ne lična fetva za tvoje okolnosti.",
  },
  {
    title: "Tri vrste hadža",
    summary: "Ifrad, kiran i tamattu' — odaberi prije ulaska u ihram.",
    body: [
      "Ifrad: ući u ihram samo za hadž, bez odvojene umre u tom ihramu, i bez obavezne žrtve zbog spajanja obreda.",
      "Kiran: spojiti umru i hadž u jednom ihramu, ostati u ihramu dok se hadž ne završi. Potrebna je žrtva (hady).",
      "Tamattu': obaviti punu umru u mjesecima hadža, izaći iz ihrama, zatim ponovo ući u ihram za hadž 8. zul-hidždžeta. To danas radi većina hodočasnika; i ovdje je potreban hady.",
      "Allah kaže o onima koji spoje obrede: «...Ko iskoristi umru za hadž, neka prinese žrtvenu životinju koliko je lako dostupno...» a ko ne može, neka posti tri dana tokom hadža i sedam po povratku (Kur'an 2:196).",
    ],
    quran: [
      {
        excerpt:
          "I dovršite hadž i umru radi Allaha... Ko iskoristi umru za hadž, neka prinese žrtvenu životinju koliko je lako dostupno. A ko je ne nađe — neka posti tri dana tokom hadža i sedam kad se vratite...",
      },
    ],
    actions: [
      "Odluči vrstu s vođom grupe prije mikat.",
      "Ako radiš tamattu', završi umru u potpunosti prije ponovnog ulaska u ihram za hadž.",
    ],
    appLinks: [
      {
        label: "Lista umre",
      },
      {
        label: "Lista hadža",
      },
    ],
  },
  {
    title: "Pet mikat",
    summary: "Ne prelazi mikat prema Mekki bez ulaska u ihram za hadž ili umru.",
    body: [
      "Ibn Abbas prenosi da je Poslanik ﷺ odredio mikate za ljude: Zul-Hulajfu za Medinu, El-Džuhfu za Šam, Karn al-Manazil za Nejd i Jelamlam za Jemen; a za Irak, Dat Irk. Rekao je da su to za njih i za svakoga ko dođe do njih namjeravajući hadž ili umru; a ko živi unutar tih mjesta ulazi u ihram odakle krene, pa čak i Mečani iz Meke (Sahih al-Buhari 1524; Sahih Muslim 1181).",
      "Moderni aerodromi i luke imaju odgovarajuće tačke ihrama ili objavljene procedure — slijedi upute prevoznika i Ministarstva hadža i umre da ne prođeš granicu bez ihrama.",
    ],
    hadith: [
      {
        excerpt:
          "Poslanik Allaha ﷺ odredio je Zul-Hulajfu za Mečane, El-Džuhfu za Šam, Karn al-Manazil za Nejd i Jelamlam za Jemen... Ovi mikati su za ljude na tim mjestima i za one koji dođu do njih namjeravajući hadž ili umru...",
      },
      {
        excerpt:
          "Poslanik Allaha ﷺ odredio je mikate... Ko živi unutar tih granica neka ulazi u ihram od mjesta odakle krene...",
      },
    ],
  },
  {
    title: "Ulazak u ihram",
    summary: "Gusul, odjeća, namjera i telbija započinju sveto stanje.",
    body: [
      "Ihram je sveto stanje u koje se ulazi namjerom za hadž ili umru. Poslanik ﷺ je preporučio gusul prije ihrama. Muškarci nose dvije nesivene bijele tkanine; žene zadržavaju uobičajenu skromnu odjeću bez pokrivanja lica ili rukavica kao ihram odjeće (detalji o nikabu i rukavicama su fikh pitanja).",
      "Muškarci mogu staviti miris na tijelo prije ihrama, ne na ihram odjeću nakon ulaska u stanje (Sahih al-Buhari 1539). Zatim formiraj namjeru i započni telbiju.",
      "Telbija koju je učio Poslanik ﷺ glasi: «Lebbeyk Allāhumma lebbeyk, lebbeyke lā šerīke leke lebbeyk, inne'l-hamde ve'n-ni'mete leke ve'l-mulke, lā šerīke lek» — nastavlja se dok ne počne tavaf za umru, ili do bacanja na Džemrat al-Akaba za hadž prema poznatoj praksi (Sahih al-Buhari 1549; Sahih Muslim 1184).",
    ],
    hadith: [
      {
        excerpt:
          "Aiša je rekla: Mirisala sam Poslanika Allaha ﷺ za njegov ihram prije nego što uđe u ihram...",
      },
      {
        excerpt:
          "Lebbeyk Allāhumma lebbeyk, lebbeyke lā šerīke leke lebbeyk, inne'l-hamde ve'n-ni'mete leke ve'l-mulke, lā šerīke lek.",
      },
      {
        excerpt: "Poslanik ﷺ podigao je glas s telbijom: Lebbeyk Allāhumma lebbeyk...",
      },
    ],
    actions: [
      "Spakuj barem dvije garniture ihrama za muškarce; drži miris-free potrepštine pri ruci.",
      "Vježbaj telbiju prije puta da teče na putu.",
    ],
  },
  {
    title: "Zabrane ihrama",
    summary: "Šta muhrim mora izbjegavati dok ne izađe iz svetog stanja.",
    body: [
      "U ihramu izbjegavaj: za muškarce — šivenu/prilagođenu odjeću i pokrivanje glave; miris; šišanje kose ili noktiju; lov kopnenih životinja; sklapanje ili obavljanje braka; i intimnost. Žene izbjegavaju miris i ostale zajedničke zabrane, zadržavajući skromnu odjeću.",
      "Kršenje zabrane može zahtijevati fidju — obično post, hranjenje siromašnih ili žrtvu — ovisno o učinjenom. Mezhebi različito klasificiraju detalje. Pažljivo se pridržavaj zabrana i pitaj kvalificiranog vodiča ako se nešto neočekivano desi.",
    ],
    madhhabNote:
      "Liste prekršaja i fidija razlikuju se po mezhebima. Ovo tretiraj kao praktičnu listu upozorenja, zatim potvrdi detalje sa svojim mezhebom ili hadž vodičem.",
    disclaimer: "Ovaj opći pregled ne zamjenjuje uputstvo na licu mjesta kad dođe do prekršaja.",
    actions: ["Drži parfem, škare za nokte i makaze van laka dosega dok si u ihramu."],
  },
  {
    title: "Umra — ihram i telbija",
    summary: "Uđi u sveto stanje na mikatu ili prije njega, zatim odgovori Allahovom pozivu.",
    body: [
      "Na mikatu ili prije njega, okupaj se ako možeš, obuci ihram odjeću, namjeri umru i započni telbiju. Sveto stanje počinje tom namjerom.",
      "Često ponavljaj telbiju dok putuješ prema Mekki dok ne počneš tavaf. To je izjava da odgovaraš samo Allahovom pozivu.",
    ],
    actions: ["Koristi listu umre da označiš svaki obred kad ga završiš."],
    appLinks: [
      {
        label: "Lista umre",
      },
    ],
  },
  {
    title: "Tavaf oko Ka'be",
    summary: "Sedam krugova suprotno kazaljci na satu, počevši od Crnog kamena.",
    body: [
      "Kruži oko Ka'be sedam puta suprotno kazaljci na satu, počinjući i završavajući kod ugla Crnog kamena. Poljubi ga, dodirni ili ukaži na njega uz tekbir ako je gužva — slijedeći praksu Poslanika ﷺ bez nanošenja štete drugima.",
      "Muškarci rade raml (brži hod) u prva tri kruga i idtiba' (otkrivanje desnog ramena) tokom ovog tavafa dolaska za umru, prema poznatoj sunnet praksi.",
      "Između Jemenskog ugla i Crnog kamena preporučeno je reći: «Gospodaru naš, daj nam dobro na ovom svijetu i dobro u ahiretu, i zaštiti nas od kazne vatre» (Kur'an 2:201).",
    ],
    quran: [
      {
        excerpt:
          "Gospodaru naš, daj nam dobro na ovom svijetu i dobro u ahiretu, i zaštiti nas od kazne vatre.",
      },
    ],
  },
  {
    title: "Dva rekata i Zemzem",
    summary: "Klanjaj iza Makam Ibrahima ako je moguće, zatim pij Zemzem.",
    body: [
      "Nakon tavafa klanjaj dva rekata iza Makam Ibrahima ako ima mjesta, ili negdje drugdje u džamiji ako je gužva — u skladu s Allahovim riječima: «...I uzmite, o vjernici, od mjesta Ibrahima mjesto za molitvu...» (Kur'an 2:125).",
      "Zatim pij vodu Zemzem. Džabirov opis hadža Poslanika ﷺ uključuje piće Zemzema nakon tavafa; Poslanik ﷺ je rekao da je Zemzem za ono radi čega se pije (autentična izvješća koja su kasniji učenjaci sastavili; namjera i du'a su preporučeni).",
    ],
    quran: [
      {
        excerpt: "...I uzmite, o vjernici, od mjesta Ibrahima mjesto za molitvu...",
      },
    ],
  },
  {
    title: "Sa'j između Safa i Marve",
    summary: "Sedam prolazaka u spomen Hadžerine potrage za vodom.",
    body: [
      "Allah kaže: «Zaista, Safa i Marva su među Allahovim znakovima. Ko obavi hadž Kući ili umru — nema grijeha da hoda između njih...» (Kur'an 2:158).",
      "Hodaj sedam puta između Safa i Marve, počevši od Safe. Na Safi okreni se prema Ka'bi, podigni ruke u tekbir i du'a kao Poslanik ﷺ. Muškarci trče između zelenih markera.",
    ],
    quran: [
      {
        excerpt:
          "Zaista, Safa i Marva su među Allahovim znakovima. Ko obavi hadž Kući ili umru — nema grijeha da hoda između njih...",
      },
    ],
  },
  {
    title: "Halq ili taqsir — završetak umre",
    summary:
      "Muškarci briju ili skraćuju; žene skraćuju za dužinu vrha prsta — zatim ihram prestaje.",
    body: [
      "Muškarci obriju glavu (halq) — za što je Poslanik ﷺ tri puta molio — ili ravnomjerno skrate (taqsir). Žene skupljaju kosu i skrate za otprilike dužinu vrha prsta. Time je umra završena i zabrane ihrama se uklanjaju.",
      "Abdullah ibn Omar prenosi da je Poslanik Allaha ﷺ rekao: «Allahu, smiluj se onima koji obriju glave.» Rekli su: «I onima koji skrate, o Poslanice Allaha?» Rekao je: «Allahu, smiluj se onima koji obriju glave.» Rekli su: «I onima koji skrate?» Treći put rekao: «I onima koji skrate» (Sahih al-Buhari 1727; Sahih Muslim 1301).",
    ],
    hadith: [
      {
        excerpt: "Allahu, smiluj se onima koji obriju glave... I (treći put) onima koji skrate.",
      },
      {
        excerpt:
          "Allahu, oprosti onima koji obriju glave... zatim treći put: i onima koji skrate kosu.",
      },
    ],
  },
  {
    title: "8. zul-hidždža — Dan Tarvije",
    summary: "Uđi u ihram za hadž i provedi dan u Mini.",
    body: [
      "Za tamattu' hodočasnike: namjeri hadž i ponovo uđi u ihram iz svog boravka u Mekki, obnavljajući telbiju. Ifrad i kiran hodočasnici su već u ihramu.",
      "Putuj u Minu i klanjaj Dhuhr, Asr, Magrib, Isha i sljedeći Fajr, svaki skraćen na dva rekata u svom vremenu, slijedeći praksu Poslanika ﷺ u hadžu oproštaja kako prenosi Džabir (Sahih Muslim 1218). Provodi dan i noć u ibadetu, čekajući Arafu.",
    ],
    hadith: [
      {
        excerpt:
          "Džabirovo dugo izvješće o hadžu oproštaja Poslanika ﷺ — uključujući boravak u Mini i redoslijed obreda.",
      },
    ],
    actions: ["Otvori listu hadža ujutro osmog dana."],
    appLinks: [
      {
        label: "Lista hadža",
      },
    ],
  },
  {
    title: "9. zul-hidždža — Dan Arafaha",
    summary: "Stoj unutar Arafe do zalaska sunca; zatim kreni u Muzdelifu.",
    body: [
      "Ostani unutar granica Arafe od poslije podne do zalaska sunca u du'a, zikru i pokajanju. Poslanik ﷺ je rekao: «Hadž je Arafa» (Sunan Ebu Davud 1949). Okreni se prema kibli, podigni ruke i usrdno moli Allahu — među najvećim vremenima za du'a.",
      "Klanjaj Dhuhr i Asr zajedno i skraćeno u vrijeme Dhuhr (džem' takdim), zatim posveti ostatak dana du'a umjesto nafile — slijedeći praksu Poslanika ﷺ (Sahih Muslim 1218).",
      "Nakon zalaska sunca mirno putuj u Muzdelifu. Spoji Magrib i Isha (Isha skraćeno), odmori noć i sakupi kamenčiće za bacanje. Slabi i žene mogu otići u Minu poslije ponoći prema poznatim olakšicama u sunnetu.",
    ],
    hadith: [
      {
        excerpt: "Hadž je Arafa.",
      },
      {
        excerpt:
          "Poslanik ﷺ spojio je Dhuhr i Asr na Arafi, zatim krenuo poslije zalaska sunca u Muzdelifu...",
      },
    ],
  },
  {
    title: "10. zul-hidždža — Dan Nahra",
    summary: "Bacanje, žrtva, brijanje i Tavaf al-Ifada.",
    body: [
      "Vrati se prema Mini i baci sedam kamenčića na Džemrat al-Akaba (veliki stub), govoreći Allahu ekber sa svakim bacanjem — prvi obred dana u redoslijedu hadža oproštaja.",
      "Prinesi žrtvu potrebnu za tamattu' i kiran (Kur'an 2:196), ili je uredi preko pouzdane agencije. Meso se jede i dijeli siromasima.",
      "Obrij (halq) ili skrati (taqsir); žene skraćuju za dužinu vrha prsta. Nakon bacanja i brijanja/skracivanja nastupa prvo oslobođenje (tahallul evvel) — većina zabrana ihrama se uklanja osim intimnosti.",
      "Idi u Mekku za Tavaf al-Ifada — stub hadža — i sa'j za tamattu' hodočasnike (ifrad/kiran koji su već uradili sa'j s tavafom dolaska slijede presudu svog mezheba). Time se završava potpuno oslobođenje iz ihrama.",
    ],
    quran: [
      {
        excerpt:
          "...Ko iskoristi umru za hadž, neka prinese žrtvenu životinju koliko je lako dostupno...",
      },
    ],
    madhhabNote:
      "Redoslijed obreda Dana Nahra ima fleksibilnost u sunnetu; mezhebi se razlikuju o tačnom redoslijedu i kada je sa'j potreban za svaku vrstu hadža. Slijedi vodiča svoje grupe.",
  },
  {
    title: "11–13. zul-hidždža — Dani Tašrika",
    summary: "Noći u Mini, dnevno bacanje tri džemre, zatim oproštajni tavaf.",
    body: [
      "Provodi noći 11., 12. (i 13. ako ne odlaziš ranije) u Mini. To su dani jela, pića i spominjanja Allaha.",
      "Svako poslijepodne poslije Dhuhr baci sedam kamenčića na svaki od tri stuba redom — mali, zatim srednji, zatim veliki — uz tekbir pri svakom bacanju. Ko požuri može otići poslije bacanja 12. (Kur'an 2:203).",
      "Prije odlaska iz Meke obavi Tavaf al-Vada kako bi posljednji čin s Kućom bio oproštaj. Ibn Abbas prenosi da su ljudi naređeni da im posljednji obred bude kod Kuće, osim što je olakšano za menstruirajuću ženu (Sahih al-Buhari 1755; Sahih Muslim 1328).",
    ],
    quran: [
      {
        excerpt:
          "I spominjite Allaha u određenim brojanim danima. Ko požuri u dva dana — nema grijeha na njemu; a ko odgodi — nema grijeha na njemu — za onoga ko se Allaha boji...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ljudima je naređeno da oproštajni tavaf oko Ka'be bude posljednji obred, osim menstruirajućih žena koje su oslobođene.",
      },
      {
        excerpt:
          "Ljudima je naređeno da posljednji obred bude kod Kuće, ali je olakšano za ženu u menstruaciji.",
      },
    ],
  },
  {
    title: "Stubovi i obaveze",
    summary: "Šta poništava hadž ako se propusti, i šta se nadoknađuje žrtvom.",
    body: [
      "Stubovi (arkan) su suština hadža. Ako se stub propusti, hadž je nevažeći i ne može se popraviti samo žrtvom — mora se nadoknaditi. Većina obično navodi: ihram (namjera), stajanje na Arafi, Tavaf al-Ifada i sa'j.",
      "Obaveze (vadžibat) uključuju ulazak u ihram s mikat, boravak u Muzdelifi, bacanje džemara, noći Tašrika u Mini i oproštajni tavaf. Propust obaveze ne poništava hadž, ali se nadoknađuje dam (žrtvom) prema mezhebima.",
    ],
    madhhabNote:
      "Tačne liste arkan i vadžibat razlikuju se među četiri mezheba. Potvrdi s kvalificiranim vodičem za svoj mezheb — posebno ako nešto propustiš pod pritiskom gužve.",
    disclaimer: "Ovo je praktičan sažetak, a ne fetva o propuštenim obredima.",
  },
  {
    title: "Etiketa i iskrenost",
    summary: "Čuvaj jezik i udove — prihvat je povezan s karakterom.",
    body: [
      "Hadis o povratku bez grijeha (Buhari 1521; Muslim 1350) jasno pokazuje da hadž kvare nehajnost (rafas), grijeh (fusuk) i rasprave. Strpljenje, nježnost i pomoć drugim hodočasnicima dio su ibadeta.",
      "Ne dopusti da telefon i prazni razgovori dominiraju Arafom i džamijom. Ustupi mjesto u tavafu; ne guraj prema Crnom kamenu. Prihvaćeni hadž prati Džennet — teži izvrsnom karakteru tokom cijelog puta.",
    ],
    hadith: [
      {
        excerpt:
          "Ko obavi hadž radi Allaha, pa ne učini rafas niti grijeh, vrati se kao na dan kad ga je majka rodila.",
      },
    ],
    actions: ["Postavi dnevnu namjeru: jedan dobar čin i jedan iskren du'a iznad gužve."],
  },
  {
    title: "Viza i registracija",
    summary: "Koristi službene kanale — Nusuk i tvoja nacionalna hadž vlast.",
    body: [
      "Nusuk ( nusuk.sa ) je zvanična saudijska platforma za hadž i umru — vize, smještaj, prevoz i registrirani paketi. Neslužbeni posrednici su čest izvor prevara.",
      "Svaka zemlja dobija godišnju kvotu hadža; većina hodočasnika se prijavljuje preko nacionalne hadž vlasti ili licenciranog agenta. Umra nema kvotu i može se aranžirati veći dio godine kroz odobrene kanale.",
    ],
    actions: [
      "Prijavi se rano kad se sezona otvori.",
      "Rezerviši samo preko agencija na Nusuk listi ili tvoje nacionalne vlasti.",
      "Provjeri kanale plaćanja prije transfera novca.",
    ],
    disclaimer: "Pravila ulaska i platforme se mijenjaju; uvijek provjeri službene web stranice.",
  },
  {
    title: "Šta spakovati",
    summary: "Ihram, miris-free potrepštine, dokumenti i udobnost za hodanje.",
    body: [
      "Muškarci: barem dvije garniture nesivenog ihrama i pojas za dokumente. Žene: labava skromna odjeća. Otvorene sandale koje se lako obuću; mali ruksak i boca vode.",
      "Spakuj miris-free sapun i kremu za sunce — miris je zabranjen u ihramu. Drži pasoš, ispis vize, evidenciju cijepljenja i kontakte za hitne slučajeve u tankom futrolu. Power bank i lokalna SIM ili eSIM pomažu u gužvi.",
    ],
    actions: [
      "Lista: ihram ×2, sandale, miris-free potrepštine, futrola za dokumente, lijekovi, power bank.",
      "Nosi flaster za žuljeve — hodočasnici mnogo hodaju.",
    ],
  },
  {
    title: "Sveta mjesta na prvi pogled",
    summary: "Meka, Medina, Mina, Arafa i Muzdelifa — praktične napomene.",
    body: [
      "Masjid al-Haram okružuje Ka'bu — mjesto tavafa i sa'j; očekuj velike gužve. Masjid an-Nebavi u Medini nije dio samog hadža, ali većina hodočasnika posjeti; ulaz u Rawdu je po vremenu preko službenih aplikacija.",
      "Mina je grad šatora za noći 8. i 11–13. zul-hidždža. Arafa je otvorena ravnica — hidratacija i hladovina su važni devetog dana. Muzdelifa je gdje hodočasnici odmaraju pod otvorenim nebom i skupljaju kamenčiće — sadržaji su namjerno minimalni.",
    ],
    actions: ["Prouči jednostavnu mapu Mina–Arafa–Muzdelifa prije puta."],
  },
  {
    title: "Službeni resursi",
    summary: "Nusuk, tvoja nacionalna vlast i Visit Saudi.",
    body: [
      "Počni s Nusukom za vize, pakete, dozvole za Rawdu i upute o gužvi. Koristi hadž ministarstvo svoje zemlje za kvotu i zdravstvena pravila. Visit Saudi objavljuje opće savjete o ulasku i putovanju.",
      "Ako ponuda izgleda neuobičajeno jeftino ili posrednik traži plaćanje izvan službenih kanala, provjeri direktno na portalu ministarstva prije plaćanja.",
    ],
    actions: [
      "Sačuvaj nusuk.sa i web stranicu nacionalne hadž vlasti u obilježivače.",
      "Sačuvaj kontakte za hitne slučajeve od vođe grupe.",
    ],
    disclaimer: "Praktičan vodič, a ne zamjena za službenog hadž/umra pružaoca.",
  },
];

export const HAJJ_CHECKLIST_BS: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Uđi u ihram za hadž",
    hint: "Namjeri hadž i uđi u ihram (iz Meke za tamattu'); obnovi telbiju.",
    day: "8. zul-hidždža",
  },
  {
    title: "Putuj u Minu",
    hint: "Klanjaj Dhuhr do Fajr u Mini, svaki skraćen u svom vremenu.",
    location: "Mina",
    day: "8. zul-hidždža",
  },
  {
    title: "Stoj na Arafi",
    hint: "Ostani unutar Arafe od poslije podne do zalaska sunca u du'a i zikru.",
    location: "Arafa",
    day: "9. zul-hidždža",
  },
  {
    title: "Spoji Dhuhr i Asr",
    hint: "Klanjaj Dhuhr i Asr zajedno i skraćeno u vrijeme Dhuhr, zatim se fokusiraj na du'a.",
    location: "Arafa",
    day: "9. zul-hidždža",
  },
  {
    title: "Kreni u Muzdelifu",
    hint: "Poslije zalaska sunca spoji Magrib i Isha, odmori se i sakupi kamenčiće.",
    location: "Muzdelifa",
    day: "9. zul-hidždža",
  },
  {
    title: "Baci na Džemrat al-Akaba",
    hint: "Baci sedam kamenčića na veliki stub uz tekbir pri svakom bacanju.",
    location: "Mina",
    day: "10. zul-hidždža",
  },
  {
    title: "Prinesi žrtvu",
    hint: "Obavezno za tamattu' i kiran — zakolji ili uredi preko pouzdane agencije.",
    day: "10. zul-hidždža",
  },
  {
    title: "Halq ili taqsir",
    hint: "Muškarci obriju ili skrate; žene skraćuju za dužinu vrha prsta (prvo oslobođenje).",
    day: "10. zul-hidždža",
  },
  {
    title: "Tavaf al-Ifada",
    hint: "Obavi Tavaf al-Ifada i sa'j za tamattu' — stub hadža.",
    location: "Masjid al-Haram",
    day: "10. zul-hidždža",
  },
  {
    title: "Noć u Mini",
    hint: "Provodi noći 11., 12. (i 13. ako ne odlaziš ranije) u Mini.",
    location: "Mina",
    day: "11–13. zul-hidždža",
  },
  {
    title: "Baci na tri džemre",
    hint: "Poslije Dhuhr svaki dan baci na mali, srednji, zatim veliki — po sedam.",
    location: "Mina",
    day: "11–13. zul-hidždža",
  },
  {
    title: "Oproštajni tavaf",
    hint: "Obavi Tavaf al-Vada prije odlaska iz Meke (menstruirajuće žene oslobođene).",
    location: "Masjid al-Haram",
    day: "Odlazak",
  },
];

export const UMRAH_CHECKLIST_BS: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Uđi u ihram",
    hint: "Na mikatu ili prije: gusul, ihram odjeća, namjera za umru, telbija.",
    location: "Mikat",
  },
  {
    title: "Recitiraj telbiju",
    hint: "Ponavljaj Lebbeyk... često dok ne počneš tavaf.",
  },
  {
    title: "Tavaf oko Ka'be",
    hint: "Sedam krugova suprotno kazaljci od Crnog kamena; muškarci: raml i idtiba'.",
    location: "Masjid al-Haram",
  },
  {
    title: "Klanjaj dva rekata",
    hint: "Iza Makam Ibrahima ako je moguće, zatim pij Zemzem.",
    location: "Masjid al-Haram",
  },
  {
    title: "Sa'j između Safa i Marve",
    hint: "Sedam prolazaka počevši od Safe; muškarci trče između zelenih markera.",
    location: "Masjid al-Haram",
  },
  {
    title: "Halq ili taqsir",
    hint: "Muškarci obriju ili skrate; žene skraćuju za dužinu vrha prsta — umra završena.",
  },
];
