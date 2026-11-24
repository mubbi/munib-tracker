import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Albanian translation overlay for the Learn Eid guide. Mirrors the order of
// EID_GUIDE_TOPICS in ../eid-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const EID_GUIDE_TOPICS_SQ: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Bajrami i Fitrit — festa e ndërprerjes së agjërimit",
    summary: "Dita e parë e Shevalit, që shënon fundin e agjërimit të Ramazanit.",
    body: [
      "Bajrami i Fitrit bie më 1 Sheval, menjëherë pas Ramazanit, dhe është një ditë gëzimi dhe falënderimi për faktin që jemi bërë të aftë të agjërojmë dhe të adhurojmë gjatë gjithë muajit. Kurani lidh drejtpërdrejt fundin e agjërimit me përkujtimin dhe falënderimin: '...që të plotësoni numrin (e ditëve) dhe të madhëroni Allahun për udhëzimin që ju ka dhënë, dhe që të jeni falënderues' (Kurani, 2:185).",
      "Agjërimi në këtë ditë është shprehimisht i ndaluar, jo thjesht i papëlqyer — Profeti ﷺ e ka përmendur, bashkë me Bajramin e Kurbanit, si një nga dy ditët në të cilat myslimanëve u urdhërohet të hanë e jo të agjërojnë (Buhariu 1990). Dita fillon me zeqatin e fitrit dhe namazin e bajramit, dhe vazhdon me vizita familjare, shkëmbim urimesh dhe festim të përgjithshëm brenda kufijve islamikë.",
    ],
    quran: [{}],
    hadith: [{}],
  },
  {
    title: "Bajrami i Kurbanit — festa e sakrificës",
    summary: "10 Dhul-Hixhe, përkujtimi i sakrificës së Ibrahimit.",
    body: [
      "Bajrami i Kurbanit bie më 10 Dhul-Hixhe, Dita e Kurbanit gjatë Haxhit, dhe përkujton gatishmërinë e Ibrahimit për të sakrifikuar birin e tij në bindje ndaj Allahut, dhe mëshirën e Allahut duke e shpaguar atë me një kafshë sakrifice në vend të tij (Kurani, 37:102–107). Shumë dijetarë e konsiderojnë atë më i madhi i dy Bajrameve, duke përputhur me përmbylljen e Haxhit për ata që janë në haxh.",
      "Ashtu si në Bajramin e Fitrit, agjërimi në këtë ditë është i ndaluar (Buhariu 1990). Riti i tij kryesor shtesë është kurbani (udhijeh), i ofruar nga ata që kanë mundësi, në përkujtim të nënshtrimit të Ibrahimit, si vepër adhurimi dhe bamirësie së bashku.",
    ],
    quran: [{}],
    hadith: [{}],
  },
  {
    title: "Si të falet namazi i bajramit",
    summary: "Dy rekate me tekbire shtesë — pa ezan e pa ikamet.",
    body: [
      "Namazi i bajramit ka dy rekate, falet me xhemat pa ndonjë ezan ose ikamet paraprakisht — Xhabir ibn Abdullah dhe Ibn Abasi të dy konfirmuan se nuk jepej thirrje për namaz për asnjë Bajram në kohën e Profetit ﷺ (Sahih Muslimi 886). Namazi pasohet nga hutbeja, ndryshe nga namazi i xhumasë ku hutbeja vjen e para.",
      "Tekbire shtesë (thënia 'Allahu Ekber') shtohen para leximit në çdo rekat, përveç tekbireve të zakonshme të namazit. Aisheja tregoi se Profeti ﷺ e thoshte tekbirin shtatë herë në rekatin e parë dhe pesë herë në të dytin, për të dy Bajramet (Sunen ebi Davud 1149), një numër i raportuar gjithashtu nga Abdullah ibn Amri (Ebu Davud 1151).",
    ],
    hadith: [{}, {}],
    madhhabNote:
      "Shkollat juridike ndryshojnë për numrin e saktë të tekbireve shtesë. Juristët shafi'itë, malikitë dhe hanbelitë ndjekin transmetimin shtatë-pesë (Ebu Davud 1149/1151) — malikitë dhe hanbelitë e llogarisin tekbirin hapës brenda shtatë, kështu që thonë gjashtë-pesë. Shkolla hanefite mban qëndrimin e 3 tekbireve shtesë para leximit në rekatin e parë dhe 3 para përuljes në të dytin (6 gjithsej) — një qëndrim i juristëve të Kufas për të cilin nuk ekziston një hadith i vërtetuar veçmas i ngritur; ndiqni numrin e tekbireve të imamit të xhematit tuaj.",
    actions: [
      "Ejani në kohë — nuk ka ezan ose ikamet që sinjalizon fillimin.",
      "Ndiqni numrin e tekbireve të imamit tuaj; praktika e secilës shkollë është e vlefshme.",
      "Qëndroni për hutben pas namazit.",
    ],
  },
  {
    title: "Praktikat sunet të ditës",
    summary: "Gusli, rrobat më të mira, ushqimi para/pas, dhe dy rrugë të ndryshme.",
    body: [
      "Disa suneте të vogla rekomandohen para dhe pas namazit të bajramit. Në Bajramin e Fitrit, Profeti ﷺ nuk niste për namaz para se të hante disa hurma, në numër tek (Buhariu 953) — ndryshe nga Bajrami i Kurbanit, ku rekomandohet të presësh dhe të hash nga kurbani pasi të jesh kthyer nga namazi.",
      "Është sunet të bësh gusël dhe të veshësh rrobat më të mira (të pastra, modeste) për këtë rast, duke ndjekur praktikën e përgjithshme të sahabëve në të dy Bajramet, edhe pse ky transmetim specifik është më pak i fortë se të tjerët këtu, dhe është një praktikë e ndjekur gjerësisht më shumë sesa një hadith i vetëm i gradës sahih.",
      "Një sunet dallues është marrja e një rruge të ndryshme për në shtëpi nga ajo e marrë për të shkuar. Xhabir ibn Abdullahu tregoi: 'Ditën e Bajramit, Profeti ﷺ kthehej (pas kryerjes së namazit të bajramit) nëpër një rrugë të ndryshme nga ajo nëpër të cilën shkoi' (Buhariu 986) — zakonisht shpjegohet si shumëfishim i vendeve që dëshmojnë adhurimin e dikujt dhe shfaqje më e gjerë e riteve të Islamit.",
    ],
    hadith: [{}, {}],
    actions: [
      "Bëni gusël dhe vishni rrobat tuaja më të mira modeste.",
      "Hani hurma në numër tek para namazit të Bajramit të Fitrit; prisni të hani deri pas namazit të Bajramit të Kurbanit.",
      "Merrni një rrugë të ndryshme për kthim nga ajo që morët për të shkuar në namaz.",
    ],
  },
  {
    title: "Zeqati i Fitrit — bazat",
    summary:
      "Një lëmoshë e vogël e detyrueshme, që duhet dhënë para namazit të Bajramit të Fitrit.",
    body: [
      "Zeqati i Fitrit (Sadakatul-Fitr) është një lëmoshë e veçantë, më e vogël se zeqati i pasurisë, e detyrueshme për çdo mysliman — të vogël ose të madh, mashkull ose femër, të lirë ose në ngarkim — e paguar në emër të tyre nga kryefamiljari. Ibn Umeri tregoi se Profeti ﷺ urdhëroi një sa' (rreth 2–3 kg) hurma ose elb për çdo mysliman, që të paguhet para se njerëzit të dalin për namazin e bajramit (Buhariu 1503).",
      "Qëllimi i tij shprehet qartë në sunet: 'pastrim për agjëruesin nga fjalët e kota dhe të pahijshme, dhe ushqim për të varfrit' (Ebu Davud 1609). Pagesa e tij para namazit të bajramit llogaritet si ky zeqat specifik; pagesa pas namazit vazhdon të llogaritet si lëmoshë e përgjithshme, por i humb shpërblimin e veçantë të lidhur me kohën.",
      "Shumica e komuniteteve sot llogarisin vlerën në monedhën lokale në vend të shpërndarjes së drejtpërdrejtë të hurmave ose elbit, duke ndjekur udhëzimet e dijetarëve lokalë dhe autoriteteve të zeqatit për vlerat aktuale të ushqimeve bazë — një përshtatje praktike, jo një ndryshim në detyrimin themelor.",
    ],
    hadith: [{}, {}],
    actions: [
      "Llogaritni dhe veçoni Zeqatin e Fitrit për veten dhe personat në ngarkim.",
      "Paguajeni para se të niseni për namazin e Bajramit të Fitrit nëse është e mundur.",
    ],
    appLinks: [{ label: "Kalkulatori i zeqatit" }],
  },
  {
    title: "Kurbani (udhijeh) — bazat",
    summary: "Sakrificë kafshe e ofruar në Bajramin e Kurbanit, e ndarë me të varfrit.",
    body: [
      "Kurbani është therja e një kafshe të kualifikuar (dele, dhi, lopë ose kamile, që plotëson kushtet e moshës dhe shëndetit) në Bajramin e Kurbanit dhe ditët e Teshrikut që pasojnë, në përkujtim të kurbanit të Ibrahimit. Enesi tregoi se Profeti ﷺ vetë theri me duart e veta dy desh të bardhë-zi, duke përmendur emrin e Allahut dhe tekbirin mbi to (Buhariu 5558) — kjo vërteton se kryerja e vetë therjes, kur është e mundur, është praktika më e mirë, edhe pse edhe ngarkimi i dikujt tjetër në emrin e vet është i vlefshëm.",
      "Kurani e lidh drejtpërdrejt kurbanin me ndarjen e mishit të tij: '...hani prej tyre dhe ushqeni nevojtarin dhe lypësin' (Kurani, 22:36). Mishi zakonisht ndahet mes familjes së vet, të afërmve dhe miqve, dhe të varfërve, kështu që rasti kombinon adhurimin, gjerësinë dhe falënderimin.",
      "Therja duhet të bëhet pas namazit të bajramit, jo para — një shok i Profetit që kishte therur herët u tha nga Profeti ﷺ ta përsëriste, sepse një kurban i ofruar para namazit nuk llogaritet si udhijeh. Kush saktësisht është i detyruar, dhe intervalet e sakta kohore, ndryshojnë sipas shkollave; konsultohuni me një dijetar lokal të kualifikuar për situatën tuaj.",
    ],
    quran: [{}],
    hadith: [{}],
    actions: [
      "Organizoni kurbanin tuaj para Bajramit të Kurbanit nëse keni mundësi dhe ju detyrohet.",
      "Sigurohuni që therja të bëhet pas namazit të bajramit, jo para.",
      "Ndani mishin mes familjes suaj, të afërmve/miqve, dhe të varfërve.",
    ],
    disclaimer:
      "Kush saktësisht detyrohet me kurban, dhe intervali i saktë i vlefshëm për therjen, janë çështje fikhu të detajuara që ndryshojnë sipas shkollave. Ky është përmbajtje edukative e përgjithshme, jo fetva — konsultohuni me një dijetar lokal të kualifikuar për situatën tuaj.",
  },
];
