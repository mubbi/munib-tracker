import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Swahili translation overlay for the Learn ruqyah guide. Mirrors the order of
// RUQYAH_TOPICS in ../ruqyah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const RUQYAH_TOPICS_SW: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Ruqyah ni nini?",
    summary: "Kusoma Qur'an, Majina ya Allah, au dua za kinabii kwa uponyaji.",
    body: [
      "Ruqyah ni desturi ya kusoma Qur'an, Majina na Sifa za Allah, au dua za kinabii zilizothibitishwa juu ya nafsi yako au mtu mwingine — mara nyingi ikiwa na pumzi nyepesi — kutafuta uponyaji au ulinzi kutoka kwa Allah pekee. Ilikuwepo kabla ya Uislamu kama desturi ya kawaida ya Kiarabu, na Mtume ﷺ aliulizwa moja kwa moja kama ilikuwa halali.",
      "Awf ibn Malik alisimulia kwamba masahaba walisema: 'Tulikuwa tukifanya ruqyah katika zama za kabla ya Uislamu; una mtazamo gani kuhusu hilo?' Mtume ﷺ alijibu: 'Nionyesheni ruqyah yenu — hakuna madhara katika ruqyah maadamu haina shirki' (Sahih Muslim 2200). Hadithi hii moja ni msingi wa kila kitu kingine katika mwongozo huu: ruqyah yenyewe inaruhusiwa; kinachohusika ni maudhui yake.",
    ],
    hadith: [
      {
        excerpt:
          "Tulikuwa tukifanya ruqyah katika zama za kabla ya Uislamu, na tulisema: Ee Mjumbe wa Allah, una mtazamo gani kuhusu hilo? Alisema: Nionyesheni ruqyah yenu — hakuna madhara katika ruqyah maadamu haina shirki.",
      },
    ],
  },
  {
    title: "Ruqyah halali dhidi ya haramu",
    summary: "Qur'an, Majina ya Allah, na dua wazi — kamwe si shirki au mambo yasiyoonekana.",
    body: [
      "Ruqyah halali inategemea masharti ambayo wanazuoni wameyachukua kutoka hadithi: hutumia Qur'an, Majina na Sifa za Allah, au dua ya kinabii iliyothibitishwa; iko katika lugha yenye maana inayoeleweka (si silabi au alama zisizojulikana); na mtu anayesoma na mtu anayetibiwa wote wawili wanaamini kwamba ruqyah yenyewe haina nguvu — uponyaji unatoka kwa Allah pekee, na maneno ni njia tu aliyoiruhusu.",
      "Mtume ﷺ mwenyewe alikuwa mfano wa hili: Aisha alisimulia kwamba kila wakati aliugua, alisoma Al-Mu'awwidhat (sura mbili za mwisho) juu ya nafsi yake na kupuliza, na wakati ugonjwa wake wa mwisho ulizidi kuwa mbaya, alifanya vivyo hivyo kwake, akifuta mwili wake kwa mkono wake mwenyewe akitarajia baraka zake (Bukhari 5016). Hii ni ruqyah katika hali yake wazi zaidi, iliyothibitishwa zaidi.",
      "Ruqyah inakuwa haramu inapopita katika shirki: kumwomba mtu yeyote isipokuwa Allah, kutafuta msaada kutoka kwa majini, kutumia maneno au alama zisizojulikana ambazo maana yake si wazi, kuning'iniza hirizi au talasimu, au kudai kwamba mtendaji wa ruqyah ana ujuzi wa mambo yasiyoonekana au uponyaji wa hakika. Pia si mbadala wa sala tano za kila siku au kutafuta matibabu sahihi ya kitiba — inakamilisha vyote viwili badala ya kuchukua nafasi ya kimoja.",
    ],
    hadith: [
      {
        excerpt:
          "Kila wakati Mjumbe wa Allah ﷺ alipougua, alisoma Al-Mu'awwidhat na kisha akapuliza mwili wake. Aliugua sana, mimi nilikuwa nikisoma na kufuta mwili wake kwa mkono wake, kutarajia baraka zake.",
      },
    ],
    disclaimer:
      "Ruqyah ni desturi ya kiroho, sio matibabu ya kitiba. Haichukui nafasi ya kuonana na daktari mwenye sifa kwa ugonjwa wa kimwili au kiakili, wala haichukui nafasi ya sala tano za kila siku.",
  },
  {
    title: "Surat al-Fatiha kama ruqyah",
    summary: "Sura ya ufunguzi — imethibitishwa moja kwa moja kama ruqyah halali.",
    body: [
      "Abu Sa'id al-Khudri alisimulia kwamba mkuu wa kabila alipong'atwa na nyoka, mmoja wa masahaba wa Mtume ﷺ alisoma Surat al-Fatiha juu yake na alipona. Wakati masahaba baadaye walipomwuliza Mtume ﷺ kama hii ilikuwa halali, alitabasamu na kusema: 'Unajuaje kwamba hii ni ruqyah?' — akithibitisha kwamba al-Fatiha, ikisomwa kwa imani na uelewa wa kweli, yenyewe ni ruqyah halali (Bukhari 5736).",
      "Kisoma cha Qur'an cha programu hii kina maandishi kamili na tafsiri ya al-Fatiha; mwongozo huu unaielekeza tu kama chanzo cha ruqyah bila kuizalisha tena hapa.",
    ],
    quran: [{ excerpt: "Kwa jina la Allah, Mwenye rehema, Mwingi wa huruma..." }],
    hadith: [
      {
        excerpt:
          "Mmoja wao alianza kusoma Surat al-Fatiha... mgonjwa akapona. Wakati waliomwuliza Mtume ﷺ, alitabasamu na kusema: Unajuaje kwamba al-Fatiha ni ruqyah?",
      },
    ],
    appLinks: [{ label: "Soma Al-Fatiha" }],
  },
  {
    title: "Ayat al-Kursi (2:255)",
    summary: "Aya ya Kiti cha Enzi — inasomwa usiku kwa ulinzi wa Allah.",
    body: [
      "Ayat al-Kursi (Qur'an 2:255) inaeleza mamlaka kamili ya Allah na inasomwa sana kwa ulinzi, hasa kabla ya kulala. Abu Huraira alisimulia kwamba mgeni wa usiku aliyekuwa akiiba kutoka kwa zaka aliyokuwa akilinda alimwambia: 'Kila wakati unapolala, soma Ayat al-Kursi — mlinzi kutoka kwa Allah atakaa nawe, na hakuna shetani atakayekukaribia hadi asubuhi.' Mtume ﷺ aliposikia hili, alithibitisha: 'Amekwambia ukweli, ingawa yeye ni mwongo — huyo alikuwa shetani' (Bukhari 5010).",
      "Kama na aya nyingine katika mwongozo huu, hapa imetolewa tu nukuu fupi; soma aya kamili na tafsiri yake katika kisoma cha Qur'an cha programu.",
    ],
    quran: [
      { excerpt: "Allah — hakuna mungu isipokuwa Yeye, Aliye hai daima, Msimamishaji wa uwepo." },
    ],
    hadith: [
      {
        excerpt:
          "Kila wakati unapolala, soma Ayat al-Kursi — mlinzi kutoka kwa Allah atakulinda usiku wote, na hakuna shetani atakayekukaribia hadi asubuhi.",
      },
    ],
    appLinks: [{ label: "Soma Ayat al-Kursi" }],
  },
  {
    title: "Al-Ikhlas, Al-Falaq na An-Nas (112–114)",
    summary: "Sura tatu za mwisho — ruqyah ya usiku ya Mtume ﷺ.",
    body: [
      "Aisha alieleza ratiba ya usiku ya Mtume ﷺ: kila usiku kabla ya kulala aliunganisha mikono yake pamoja, akasoma Surat al-Ikhlas, Surat al-Falaq, na Surat an-Nas, akapuliza mikononi mwake, na akaifuta juu ya mwili wake — kuanzia kichwani na usoni — akirudia hili mara tatu (Bukhari 5017). Sura hizi tatu (al-Ikhlas inathibitisha umoja wa Allah, na Al-Mu'awwidhat mbili zinatafuta hifadhi kutoka kwa uovu) pia ni zile alizozisoma juu ya nafsi yake wakati wa ugonjwa (Bukhari 5016).",
      "Kwa pamoja zinaunda mojawapo ya ratiba za ruqyah za kila siku zilizo rahisi zaidi na zilizothibitishwa zaidi zinazopatikana — fupi vya kutosha kukaririwa, na zimethibitishwa moja kwa moja katika Sunnah.",
    ],
    quran: [
      { excerpt: "Sema: Yeye ni Allah, Aliye Mmoja." },
      { excerpt: "Sema: Najikinga kwa Bwana wa mapambazuko." },
      { excerpt: "Sema: Najikinga kwa Bwana wa wanadamu." },
    ],
    hadith: [
      {
        excerpt:
          "Kila wakati Mtume ﷺ alipolala, aliunganisha mikono yake pamoja na kupuliza baada ya kusoma Surat al-Ikhlas, al-Falaq na an-Nas, kisha akasugua mikono yake kwenye sehemu za mwili wake alizoweza kufikia, kuanzia kichwani na usoni. Alifanya hivyo mara tatu.",
      },
    ],
    actions: [
      "Kariri Al-Ikhlas, Al-Falaq, na An-Nas.",
      "Zisome kila usiku kabla ya kulala, kama alivyofanya Mtume ﷺ.",
    ],
    appLinks: [{ label: "Soma sura tatu" }],
  },
  {
    title: "Ulinzi wa kila siku: dhikri za asubuhi na jioni",
    summary: "Aina inayoendelea, ya kila siku ya ruqyah kwa ulinzi.",
    body: [
      "Zaidi ya ruqyah kwa ugonjwa fulani, Mtume ﷺ alifundisha seti ya dhikri za asubuhi na jioni (adhkar) ambazo hufanya kazi kama ulinzi wa kiroho unaoendelea — nyingi zake ni aya hizo hizo zinazoshughulikiwa katika mwongozo huu (Ayat al-Kursi, sura tatu za mwisho) pamoja na dua nyingine zilizothibitishwa. Kuzisoma mara kwa mara, badala ya kutumia ruqyah tu wakati kitu kinapohisi kibaya, ndiyo njia ya Sunnah ya kutafuta ulinzi wa Allah kila siku.",
      "Maktaba ya dhikri ya programu hii ina mkusanyiko kamili, wenye chanzo cha dhikri za asubuhi na jioni mahali pamoja, tayari kusomwa au kufuatiliwa kila siku.",
    ],
    actions: [
      "Soma dhikri za asubuhi baada ya Alfajiri.",
      "Soma dhikri za jioni kabla ya Magharibi/machweo ya jua.",
    ],
    appLinks: [{ label: "Dhikri za asubuhi na jioni" }],
  },
  {
    title: "Epuka waganga na wabashiri",
    summary: "Kutafuta mambo yasiyoonekana kutoka kwa mtu yeyote isipokuwa Allah ni onyo kubwa.",
    body: [
      "Uislamu unachora mstari mkali kati ya ruqyah iliyothibitishwa na kushauriana na waganga, wabashiri, wanajimu, au mtu yeyote anayedai kujua mambo yasiyoonekana (ghaib) au kuondoa tatizo la kiroho kupitia njia zisizo za Kiislamu. Mtume ﷺ alionya: 'Yeyote anayemtembelea mbashiri (arraf) na kumwuliza kuhusu jambo lolote, sala yake haitakubaliwa kwa siku arobaini' (Sahih Muslim 2230) — onyo kali hata dhidi ya kujaribu madai kama hayo kwa udadisi.",
      "Ikiwa mtu pia anaamini madai ya mbashiri kuhusu mambo yasiyoonekana, wanazuoni wanaona hili kama suala la ukafiri, kwani Allah pekee ana ujuzi wa mambo yasiyoonekana (Qur'an 27:65). Ugumu wowote unaomshawishi mtu kufikiria mtu kama huyo, jibu sahihi kulingana na mafundisho ya mwongozo huu ni kila mara kugeuka kwenye ruqyah iliyothibitishwa, dua, na msaada wa kitiba au wa kisayansi unaoaminika — kamwe kwa wale wanaodai ujuzi wa siri.",
    ],
    hadith: [
      {
        excerpt:
          "Yeyote anayemtembelea mbashiri (arraf) na kumwuliza kuhusu jambo lolote, sala yake haitakubaliwa kwa siku arobaini.",
      },
    ],
    actions: [
      "Kamwe usishauriane na waganga, wanajimu, au wale wanaodai ujuzi wa mambo yasiyoonekana.",
    ],
  },
  {
    title: "Tawakkul — kutegemea Allah pekee",
    summary: "Ruqyah ni njia; uponyaji na matokeo ni ya Allah.",
    body: [
      "Ukumbusho wa mwisho na muhimu zaidi katika mwongozo huu ni tawakkul: kutegemea kwa kweli Allah wakati wa kutumia njia zilizoruhusiwa alizozitoa. Kusoma ruqyah, kutafuta huduma za kitiba, na kuwauliza wengine wakuombee ni njia zote halali — lakini imani ya moyo inapaswa kubaki kwa Allah pekee, si kwa maneno yanayosomwa au mtu anayeyasoma. Hii inaonyesha kwa usahihi sharti katika hadithi ya kwanza ya mwongozo huu: 'Hakuna madhara katika ruqyah maadamu haina shirki' (Sahih Muslim 2200).",
      "Mwongozo huu umekusudia kuacha 'taratibu' za kienyeji na orodha za dalili zinazosambaa sana mtandaoni — hakuna moja lao lina msingi mkubwa katika Qur'an au Sunnah iliyothibitishwa, na kutegemea kwake kunaweza kimya kimya kuhamisha imani ya mtu kutoka kwa Allah kwenda kwenye desturi au orodha ya makisio. Shikilia kile kilicho na msingi wa maandishi, na acha yaliyobaki kwa hukumu ya Allah.",
    ],
    hadith: [{ excerpt: "Hakuna madhara katika ruqyah maadamu haina shirki." }],
    disclaimer:
      "Huu ni maudhui ya elimu ya jumla yanayofupisha mafundisho makuu ya Kisunni kutoka kwa Qur'an na hadithi iliyothibitishwa. Sio fatwa, na sio matibabu ya kitiba au kisaikolojia. Kwa tatizo kubwa au la kudumu, shauriana na mwanazuoni wa mahali wenye sifa na mtaalamu wa kitiba anayefaa.",
  },
];
