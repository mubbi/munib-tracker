import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Turkmen translation overlay for the Learn Eid guide. Mirrors the order of
// EID_GUIDE_TOPICS in ../eid-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const EID_GUIDE_TOPICS_TK: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Oraza baýramy — agyz açma baýramy",
    summary: "Şewwal aýynyň birinji güni, Remezan orazasynyň tamamlanmagyny bildirýär.",
    body: [
      "Oraza baýramy Şewwalyň 1-nji güni, Remezandan soň bellenilýär we bütin aý orazaly bolup, ybadat etmäge ýetenlik üçin şatlyk we şükür güni. Gurhan orazanyň tamamlanyşyny gönüden-göni zikir we şükür bilen baglanyşdyrýar: '...sanawy dolduryň we Allany size görkezen ýoly üçin beýgeldiň, şükür etmegiňiz üçin' (Gurhan, 2:185).",
      "Bu günde oraza tutmak diňe halanmajak zat däl, açyk gadagan — Pygamber ﷺ bu güni, Gurban baýramy bilen bilelikde, musulmanlaryň oraza tutman, iýmegi buýrulan iki günden biri diýip belledi (Buhary 1990). Gün pitre zekaty we baýram namazy bilen başlaýar, hem-de garyndaşlary görmek, gowy arzuwlary alyşmak we şerigat çäginde umumy şatlyk bilen dowam edýär.",
    ],
    quran: [
      {
        excerpt:
          "...sanawy dolduryň we Allany size görkezen ýoly üçin beýgeldiň, şükür etmegiňiz üçin.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Bular Allanyň Ilçisi ﷺ oraza tutmagy gadagan eden iki gün: orazaňyzy açýan gün (Remezanyň), we gurbanlygyňyzdan iýýän gün.",
      },
    ],
  },
  {
    title: "Gurban baýramy — gurbanlyk baýramy",
    summary: "Zülhijjäniň 10-njy güni, Ybraýymyň gurbanlygyny ýatlama.",
    body: [
      "Gurban baýramy Zülhijjäniň 10-njy güni, haj wagtyndaky gurban kesme güni bellenilýär we Ybraýymyň Alla boýun bolup ogluny gurban kesmäge taýýarlygyny, hem-de Allanyň ony ýerine uly gurbanlyk bilen halas eden rehimini ýatlaýar (Gurhan, 37:102–107). Köp alymlaryň pikiriçe, bu iki baýramyň ulusy we haj edýänler üçin hajyň tamamlanmagy bilen gabat gelýär.",
      "Oraza baýramy ýaly, bu günde oraza tutmak gadagan (Buhary 1990). Onuň esasy goşmaça ybadaty gurbanlyk (udhiýa), muny başarýanlar Ybraýymyň boýun egişini ýatlamak üçin, hem ybadat, hem sadaka bolup durýan iş hökmünde ýerine ýetirýärler.",
    ],
    quran: [
      {
        excerpt:
          "Ol (çaga) onuň bilen bile ýöräp biljek ýaşa ýetende, [Ybraýym] aýtdy: Eý oglum, men düýşümde seni soýup ýatanymy gördüm... Biz ony uly gurbanlyk bilen halas etdik.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Bular Allanyň Ilçisi ﷺ oraza tutmagy gadagan eden iki gün: orazaňyzy açýan gün (Remezanyň), we gurbanlygyňyzdan iýýän gün.",
      },
    ],
  },
  {
    title: "Baýram namazy nähili okalýar",
    summary: "Azan we kamatsyz, goşmaça tekbirler bilen iki rekaat.",
    body: [
      "Baýram namazy — öňünden hiç azan ýa-da kamat edilmän, jemagat bilen okalýan iki rekaat — Jabir ibn Abdylla we Ibn Abbas ikisi hem Pygamber ﷺ döwründe iki baýramyň hiç birine namaza çakylyk berilmändigini tassykladylar (Sahyh Muslim 886). Namazdan soň huтба okalýar, hutbanyň öň gelýän anna namazyndan tapawutlylykda.",
      "Her rekaatda okamakdan öň, adaty tekbirlere goşmaça tekbirler ('Allahu akbar' diýmek) goşulýar. Aişe Pygamber ﷺ iki baýramda-da birinji rekaatda ýedi gezek, ikinjide bäş gezek tekbir aýdandygyny beýan etdi (Sünen Abu Dawud 1149), bu san Abdylla ibn Amrdan hem rowaýat edildi (Abu Dawud 1151).",
    ],
    hadith: [
      {
        excerpt:
          "Oraza baýramy güni imam çykanda-da, çykandan soň-da azan bolmady; şol gün kamat, çakylyk ýa-da şuňa meňzeş zat ýokdy.",
      },
      {
        excerpt:
          "Allanyň Ilçisi ﷺ agyz açma güni we gurbanlyk güni birinji rekaatda ýedi gezek, ikinjide bäş gezek tekbir aýdardy.",
      },
    ],
    madhhabNote:
      "Mezhepler goşmaça tekbirleriň takyk sanynda tapawutlanýar. Şafygy, Maliki we Hanbaly fakyhlary ýedi-bäş rowaýatyny tutýarlar (Abu Dawud 1149/1151) — Maliki we Hanbaly açylyş tekbirini ýedä goşup, alty-bäş diýýärler. Hanafy mezhebi bolsa birinji rekaatda okamakdan öň 3 we ikinjide egilmezden öň 3 goşmaça tekbir (jemi 6) diýip hasap edýär — bu aýratyn tassyklanan merfu hadisi bolmadyk Kufa fakyhlarynyň pikiri; jemagatyňyzyň imamynyň tekbir sanyna eýeriň.",
    actions: [
      "Wagtynda geliň — namazyň başlanýandygyny bildirýän azan ýa-da kamat ýok.",
      "Imamyňyzyň tekbir sanyna eýeriň; her mezhebiň amaly dogry.",
      "Namazdan soň hutbany diňlemek üçin galyň.",
    ],
  },
  {
    title: "Şol günüň sünnetleri",
    summary: "Ýuwunma, iň gowy egin-eşik, namazdan öň/soň iýmek we iki dürli ýol.",
    body: [
      "Baýram namazyndan öň we soň birnäçe kiçi sünnet maslahat berilýär. Oraza baýramynda Pygamber ﷺ birnäçe hurma, täk sanda iýmezden namaza çykmady (Buhary 953) — Gurban baýramyndan tapawutlylykda, onda namazdan gaýdyp gelenden soň gurbanlykdan iýmegi garaşmak maslahat berilýär.",
      "Bu mynasybetli ýuwunmak we iň gowy (arassa, mynasyp) egin-eşik geýmek sünnet, iki baýramda-da sahabalaryň umumy amalyna eýerip, gerçi bu belli bir rowaýat şu ýerdäki beýlekilerden azrak subut edilen we ýeke-täk sahyh derejeli hadisden köp giňden eýerilen amal.",
      "Aýratyn sünnet — gitmek üçin ulanylan ýoldan başga ýol bilen dolanyp gelmek. Jabir ibn Abdylla beýan etdi: 'Baýram güni Pygamber ﷺ (baýram namazyny okandan soň) giden ýolundan başga ýol bilen dolanardy' (Buhary 986) — bu köplenç onuň ybadatyna şaýatlyk edýän ýerleri köpeltmek we Yslamyň alamatlaryny giňden görkezmek diýip düşündirilýär.",
    ],
    hadith: [
      {
        excerpt:
          "Pygamber ﷺ oraza baýramy güni hiç haçan birnäçe hurma, täk sanda iýmezden (namaza) çykmady.",
      },
      {
        excerpt:
          "Baýram güni Pygamber ﷺ (baýram namazyny okandan soň) giden ýolundan başga ýol bilen dolanardy.",
      },
    ],
    actions: [
      "Ýuwunyň we iň gowy mynasyp egin-eşigiňizi geýiň.",
      "Oraza baýramy namazyndan öň täk sanda hurma iýiň; Gurban baýramy namazyndan soňa çenli iýmegi garaşyň.",
      "Namaza gitmek üçin ulanan ýoluňyzdan başga ýol bilen dolanyň.",
    ],
  },
  {
    title: "Pitre zekaty — esaslary",
    summary: "Oraza baýramy namazyndan öň berilmeli kiçi hökmany sadaka.",
    body: [
      "Pitre zekaty (sadakat-ul-fitr) baýlyga esaslanan zekatdan aýry, kiçi sadaka, her musulmana — kiçi ýa uly, erkek ýa aýal, azat ýa garamagyndaky — hökmany we ony maşgala baştutany olaryň adyndan tölär. Ibn Omar Pygamber ﷺ her musulmana bir sa' (takmynan 2-3 kg) hurma ýa-da arpany hökmany etdi, ol adamlar baýram namazyna gitmezden öň tölenmeli diýip beýan etdi (Buhary 1503).",
      "Onuň maksady sünnetde açyk beýan edilýär: 'oraza tutýany biderek we ýaramaz sözlerden arassalamak we garyplar üçin azyk' (Abu Dawud 1609). Ony baýram namazyndan öň tölemek şol aýratyn zekaty ýerine ýetirmek hasaplanýar; namazdan soň tölemek entek umumy sadaka hasaplanýar, ýöne wagt bilen baglanyşykly aýratyn sylagdan mahrum bolýar.",
      "Şu günki köp jemgyýetler hurma ýa-da arpany göni paýlamagyň deregine, ýerli alymlaryň we zekat edaralarynyň esasy azyk-owkatyň häzirki bahasy barada görkezmelerine eýerip, gymmatyny ýerli pulda hasaplaýarlar — bu amaly ylalaşyk, esasy borjyň üýtgemegi däl.",
    ],
    hadith: [
      {
        excerpt:
          "Allanyň Ilçisi ﷺ her musulmana, gul ýa azat, erkek ýa aýal, kiçi ýa uly, bir Sa' hurma ýa-da bir Sa' arpany Pitre zekaty hökmünde hökmany etdi we adamlar baýram namazyny okamak üçin gitmezden öň tölenmelidigini buýurdy.",
      },
      {
        excerpt:
          "Allanyň Ilçisi ﷺ Pitre zekatyny oraza tutýany biderek we ýaramaz sözlerden arassalamak, hem-de garyplar üçin azyk hökmünde belledi. Ony namazdan öň töleýän kabul edilen zekat; namazdan soň töleýän bolsa (adaty) sadaka.",
      },
    ],
    actions: [
      "Özüňiz we garamagyňyzdakylar üçin pitre zekatyny hasaplaň we aýryň.",
      "Mümkin bolsa, ony oraza baýramy namazyna gitmezden öň töläň.",
    ],
    appLinks: [{ label: "Zekat hasaplaýjy" }],
  },
  {
    title: "Gurbanlyk (udhiýa) — esaslary",
    summary: "Gurban baýramynda kesilen, garyplar bilen paýlaşylan mal gurbanlygy.",
    body: [
      "Gurbanlyk — Gurban baýramy we soňraky Teşrik günlerinde ýaş we saglyk şertlerine laýyk gelýän maly (goýun, geçi, sygyr ýa-da düýe) Ybraýymyň gurbanlygyny ýatlamak üçin soýmak. Enes Pygamberiň ﷺ özi öz eli bilen iki ak-gara goçy soýup, olaryň üstünden Allanyň adyny agzap tekbir aýdandygyny beýan etdi (Buhary 5558) — bu mümkin bolanda soýmagy özi ýerine ýetirmegiň has gowy amal bolýandygyny, ýöne başga birine wekillik etdirmegiň hem dogry bolýandygyny tassyklaýar.",
      "Gurhan gurbanlygy gönüden-göni onuň etini paýlaşmak bilen baglanyşdyrýar: '...olardan iýiň we mätäçe hem soraýana iýdiriň' (Gurhan, 22:36). Et köplenç öz maşgalasy, garyndaşlar we dostlar, hem-de garyplar arasynda paýlanýar, şeýlelik bilen bu pursat ybadat, sahylyk we şükri birleşdirýär.",
      "Soýmak baýram namazyndan soň, öň däl, bolmaly — ir soýan bir sahabä Pygamber ﷺ ony gaýtalamagy buýurdy, sebäbi namazdan öň berlen gurbanlyk udhiýa hasaplanmaýar. Kime takyk hökmandygy we takyk wagt aralygy barada kararlar mezhebe görä üýtgeýär; ýagdaýyňyz üçin ökde ýerli alym bilen maslahatlaşyň.",
    ],
    quran: [
      {
        excerpt:
          "...olarda size ýagşylyk bar. Olary [soýmak üçin] hatara durzanyňyzda Allanyň adyny agzaň; olar gapdallaryna ýykylanda bolsa, olardan iýiň we mätäçe hem soraýana iýdiriň.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Pygamber ﷺ iki ak-gara goçy soýdy, men onuň aýagyny olaryň gapdallaryna goýup, Allanyň Adyny agzap tekbir aýdanyny gördüm. Soňra ol olary öz eli bilen soýdy.",
      },
    ],
    actions: [
      "Mümkinçiligiňiz bolsa we ol size hökmany bolsa, gurbanlygyňyzy Gurban baýramyndan öň taýýarlaň.",
      "Soýmagyň baýram namazyndan soň, öň däldigine göz ýetiriň.",
      "Eti maşgalaňyz, garyndaşlaryňyz/dostlaryňyz we garyplar arasynda paýlaşyň.",
    ],
    disclaimer:
      "Kime takyk gurbanlyk hökmandygy we soýmak üçin takyk dogry wagt aralygy — mezhebe görä üýtgeýän jikme-jik fykh meseleleri. Bu umumy bilim beriji mazmun, fetwa däl — ýagdaýyňyz üçin ökde ýerli alym bilen maslahatlaşyň.",
  },
];
