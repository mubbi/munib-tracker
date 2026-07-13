// Swahili translation overlay for the Learn Hajj & Umrah guide. Mirrors the order of
// its English source in ../hajj-guide.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { HajjGuideSection } from "../../types/hajj-guide";
import type { DeepPartial } from "./localize";

export const HAJJ_GUIDE_SECTIONS_SW: DeepPartial<HajjGuideSection>[] = [
  {
    day: "Kabla ya kwenda",
    title: "Wajibu na masharti",
    summary: "Kwa nini Hijja inastahiki, na juu ya nani inakuwa ni wajibu.",
    steps: [
      {
        title: "Nguzo ya tano",
        body: "Hija ni nguzo ya tano ya Uislamu, ambayo ni faradhi mara moja katika maisha kwa kila Muislamu mwenye uwezo. Mwenyezi Mungu anasema: “Na Mwenyezi Mungu anastahiki watu wote kuhiji kwenye Nyumba hiyo, kwa anayeweza kuiendea njia” (Qur’ani 3:97). Ilitangazwa kwa watu wote: “Na watangaze kwa watu Hija, watakujia kwa miguu na juu ya kila ngamia aliyekonda” (Qur’ani 22:27).",
      },
      {
        title: "Uwezo (istita'ah)",
        body: "Hija ni wajibu kwa wale tu wanaoweza: afya ya kimwili kwa ajili ya safari, mali ya halali ya kutosha kugharamia safari na wanaomtegemea wakiwa mbali, na njia salama iliyo wazi. Mwenye kukosa uwezo mwaka huu hana dhambi kwa kuchelewa mpaka aweze.",
      },
      {
        title: "Safari ya mwanamke",
        body: "Wanachuoni walio wengi wanashikilia kuwa mwanamke husafiri kwa ajili ya Hijja na Mahram (mume au jamaa wa karibu asiyeolewa); baadhi ya wasomi wa baadaye wanaruhusu kusafiri ndani ya kundi salama, la kutegemewa la wanawake. Fuata hukumu ya mwanachuoni mwenye sifa unayemwamini na kanuni za mamlaka yako ya Hijja.",
      },
    ],
  },
  {
    day: "Kabla ya kwenda",
    title: "Aina tatu za Hija",
    summary: "Ifrad, Qiran, na Tamattu' — chagua kabla ya kuingia ihram.",
    steps: [
      {
        title: "Ifrad",
        body: "Mwenye kuhiji anaingia kwenye Ihram kwa ajili ya Hija peke yake, hafanyi Umra tofauti, na hatoi kafara kwa ajili yake. Anakaa katika ihramu mpaka ibada ya Siku ya Nahr.",
      },
      {
        title: "Qiran",
        body: "Mwenye kuhiji anachanganya Umra na Hijja katika ihram moja, kutekeleza ibada ya Umra na kukaa katika ihram mpaka Hija ikamilike. Kama Tamattu', inahitaji dhabihu (hady).",
      },
      {
        title: "Tamattu'",
        body: "Hujaji hufanya Umra kamili katika miezi ya Hija, anatoka kwenye ihram, kisha anaingia tena ihram kwa ajili ya Hija tarehe 8 Dhul-Hijjah. Hivi ndivyo wafanyavyo mahujaji wengi; inahitaji dhabihu, au kufunga siku tatu katika Hija na saba kwa kurudi ikiwa mtu hawezi kumudu (Qur'ani 2:196).",
      },
    ],
  },
  {
    day: "Kabla ya kwenda",
    title: "Miqats na Ihram",
    summary: "Ambapo hali takatifu inaanzia, na inakataza nini.",
    steps: [
      {
        title: "Mawaqit tano",
        body: "Mtume (Swalla Allaahu ´alayhi wa sallam) aliweka miqat tano ambazo haziruhusiwi kuvuka bila ihram: Dhul-Hulayfah (kwa ajili ya Madina), Al-Juhfah (kwa Syria/Misri), Qarn al-Manazil (kwa Najd), Yalamlam (kwa Yemen), na Dhat 'Irq (kwa Iraq). Wale ambao tayari wako ndani huingia katika Ihram kutoka hapo walipo.",
        location: "Miqat",
      },
      {
        title: "Ihram ni nini",
        body: "Ihram ni hali tukufu iliyoingia kwa nia na talbiyah. Wanaume huvaa shuka mbili nyeupe ambazo hazijashonwa; wanawake huvaa mavazi ya kawaida ya kawaida. Inaingizwa baada ya ghusl na, kwa wanaume, kupaka manukato kwenye mwili (sio nguo) kabla.",
        location: "Miqat",
      },
      {
        title: "Makatazo ya ihram",
        body: "Ukiwa katika Ihram epuka: nguo zilizoshonwa/zilizowekwa na kufunika kichwa (kwa wanaume), manukato, kukata nywele au kucha, kuwinda wanyamapori, kuambukizwa au kufanya ndoa, na ukaribu wowote. Kuvunja hizi kunaweza kuhitaji kafara (fidyah), kwa hivyo endelea nazo kwa uangalifu.",
        location: "Miqat",
      },
    ],
  },
  {
    title: "Umrah",
    summary: "Hija ndogo - inaweza kufanywa wakati wowote wa mwaka.",
    steps: [
      {
        title: "Ingiza ihram",
        body: "Kabla au kabla ya miqat, fanya ghusl, vaa nguo za ihram, tengeneza nia ya Umrah, na anza talbiyah. Nia inafanywa moyoni, na hali takatifu huanza kutoka wakati huo.",
        location: "Miqat",
      },
      {
        title: "Soma talbiyah",
        body: 'Rudia "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk..." mara nyingi unaposafiri kuelekea Makka - tamko kwamba unaitikia wito wa Mwenyezi Mungu peke yako - endelea hadi uanze tawaf.',
      },
      {
        title: "Tawaf ya Ka'bah",
        body: "Zungusha Ka'ba mara saba kinyume cha saa, kuanzia na kuishia kwenye kona ya Jiwe Jeusi, ambapo unaibusu, kuigusa, au kuielekezea kwa takbir. Wanaume hufanya raml (mwendo wa haraka) katika saketi tatu za kwanza na idtiba' (kuzuia bega la kulia). Baina ya Kona ya Yemen na Jiwe Jeusi husoma: “Mola wetu, tupe mema duniani na Akhera mema, na utulinde na adhabu ya Moto” (Qur’ani 2:201).",
        location: "Masjid al-Haram",
      },
      {
        title: "Omba rakaa mbili",
        body: "Baada ya tawaf, sali rakaa mbili nyuma ya Maqam Ibrahim ikiwezekana (au popote pale msikitini ikiwa kuna watu wengi), kisha unywe maji ya Zamzam bure, kwani Mtume ﷺ amesema Zamzam ni kwa chochote kile kinachonywewa.",
        location: "Masjid al-Haram",
      },
      {
        title: "Sa'i kati ya Safa na Marwah",
        body: "Tembea mara saba kati ya Safa na Marwah, kuanzia Safa, kwa kumbukumbu ya Hajar kutafuta maji kwa ajili ya mtoto wake Isma'il. Mwenyezi Mungu anasema: \"Hakika as-Safa na al-Marwah ni katika alama za Mwenyezi Mungu\" (Qur'ani 2:158). Huko Safa, ielekee Ka'abah na inua mikono yako katika du'a na takbir; wanaume jog kati ya alama za kijani.",
        location: "Masjid al-Haram",
      },
      {
        title: "Halq au taqsir",
        body: "Wanaume hunyoa kichwa (halq, ndivyo thawabu zaidi) au kupunguza sawasawa (taqsir); wanawake hukusanya nywele zao na kupunguza urefu wa ncha ya kidole. Kwa hili Umra imekamilika na vikwazo vya ihram vinaondoka.",
      },
    ],
  },
  {
    day: "8 Dhul-Hijjah",
    title: "Siku ya Tarwiyah - Mina",
    summary: "Hija huanza; siku inatumika Mina.",
    steps: [
      {
        title: "Ingieni ihram kwa ajili ya Hija",
        body: "Tengeneza nia ya Hijja na uingie tena ihram (kutoka kwenye makazi yako ya Makka kwa tamattu'), ukiifanya upya talbiyah. Hii huanza hali takatifu tena, kwa hivyo makatazo ya ihram yanatumika tena.",
      },
      {
        title: "Safiri hadi Mina",
        body: "Nenda Mina na uswali Dhuhr, Asr, Maghrib, Isha, na Alfajiri inayofuata, kila moja imefupishwa hadi rakaa mbili kwa wakati wake, kwa kufuata Sunnah ya Mtume ﷺ. Tumieni mchana na usiku katika ibada, mkingojea kusimama Arafah.",
        location: "Mina",
      },
    ],
  },
  {
    day: "9 Dhul-Hijjah",
    title: "Siku ya Arafah",
    summary: "Siku kuu ya Hija - kusimama Arafah.",
    steps: [
      {
        title: "Simama Arafah",
        body: "Baki ndani ya mpaka wa Arafah kuanzia baada ya adhuhuri hadi kuzama kwa jua katika du'a, dhikr, na toba. Mtume ﷺ amesema, “Hija ni Arafa” (Tirmidhiy 889, Abu Dawud 1949, hasan Sahih): Yeyote atakayekosa kisimamo hiki amekosa Hijja. Ielekee kibla, inua mikono yako, na umuombe Mwenyezi Mungu - hii ndiyo siku kuu ya du'a.",
        location: "Arafah",
      },
      {
        title: "Unganisha Dhuhr na Asr",
        body: "Ombeni Dhuhr na Asr pamoja na mkafupishe wakati wa Dhuhr (jam' taqdim), kisha jitengeni siku nzima kwa dua badala ya sala ya ziada.",
        location: "Arafah",
      },
      {
        title: "Hamisha hadi Muzdalifah",
        body: "Baada ya jua kuzama safiri kwa utulivu hadi Muzdalifah, unganisha Maghrib na Isha (Isha iliyofupishwa), pumzika usiku kucha, na kukusanya kokoto kwa ajili ya kupigwa mawe. Wanyonge na wanawake wanaweza kuondoka kuelekea Mina baada ya saa sita usiku ili kuepuka kuponda.",
        location: "Muzdalifah",
      },
    ],
  },
  {
    day: "10 Dhul-Hijjah",
    title: "Siku ya Nahr - Eid al-Adha",
    summary: "Kupiga mawe, kafara, na tawaf kuu.",
    steps: [
      {
        title: "Jiwe Jamrat al-Aqaba",
        body: 'Rudi kuelekea Mina na utupe kokoto saba kwenye nguzo kubwa (Jamrat al-Aqaba), ukisema "Allahu akbar" kwa kila kurusha. Hii inadhihirisha tena kukataa kwa Ibrahimu kwa Shaytan na ni ibada ya kwanza ya siku hiyo.',
        location: "Mina",
      },
      {
        title: "Toa dhabihu",
        body: "Chinja mnyama wa kuchinjwa, au mpange kupitia wakala anayeaminika, kama inavyotakiwa kwa mahujaji wa tamattu' na qiran (Qur'ani 2:196). Nyama yake inaliwa na kupewa maskini.",
      },
      {
        title: "Halq au taqsir",
        body: "Nywele (halq) au kata (taqsir) nywele; wanawake hupunguza urefu wa ncha ya kidole. Baada ya kupigwa mawe na kunyoa, kutolewa kwa kwanza (tahallul awwal) kunatumika - vikwazo vyote vya ihram huondolewa isipokuwa urafiki na mwenzi wa mtu.",
      },
      {
        title: "Tawaf al-Ifadah",
        body: "Nenda Makka kwa Tawaf al-Ifadah - nguzo ya Hija - na sa'i (kwa tamattu'). Hii inakamilisha kuachiliwa kikamilifu kutoka kwa ihram, na yule ambaye aliepuka uchafu na dhambi \"hurudi kama siku ambayo mama yake alimzaa\" (Bukhari 1521, Muislamu 1350).",
        location: "Masjid al-Haram",
      },
    ],
  },
  {
    day: "11–13 Dhul-Hijjah",
    title: "Siku za Tashreeq - Mina",
    summary: "Usiku katika Mina na kila siku kupigwa mawe nguzo tatu.",
    steps: [
      {
        title: "Kaa usiku kucha huko Mina",
        body: "Tumia usiku wa tarehe 11, 12 (na 13 ikiwa sio kuondoka mapema) huko Mina. Hizi ni siku za kula, kunywa, na kumkumbuka Mwenyezi Mungu, zinazotumika katika ibada na takbir.",
        location: "Mina",
      },
      {
        title: "Wapige mawe Jamarat tatu",
        body: "Kila alasiri baada ya Dhuhr, tupa kokoto saba kwenye kila nguzo tatu kwa mpangilio - ndogo, kisha ya kati, kisha kubwa - na takbir kwenye kila kurusha. Mwenye kufanya haraka anaweza kuondoka baada ya kupigwa mawe siku ya 12 (Qur'ani 2:203).",
        location: "Mina",
      },
      {
        title: "Kwaheri Tawaf",
        body: "Kabla ya kuondoka Makka, fanya Tawaf al-Wada kama ibada ya mwisho, ili kitendo cha mwisho cha Hija kiwe na Nyumba. Wanawake wenye hedhi wamesamehewa humo.",
        location: "Masjid al-Haram",
      },
    ],
  },
  {
    day: "Kukamilika na maamuzi",
    title: "Nguzo, wajibu na malipo",
    summary: "Ni nini kinachohalalisha Hijja, kinacholipwa, na malipo yake.",
    steps: [
      {
        title: "Nguzo (arkan)",
        body: "Nguzo ni asili ya Hija: kuingia Ihram, kusimama Arafah, Tawaf al-Ifadhah, na Sa'i (kama wengi wanavyoshikilia). Ikiwa nguzo yoyote itakosekana, Hijja ni batili na haiwezi kufanywa kwa dhabihu - lazima irudiwe.",
      },
      {
        title: "Wajibu (wajibat)",
        body: "Wajibu ni pamoja na kuingia ihram kutoka kwenye miqat, kukaa Muzdalifah, kupiga mawe Jamarat, kulala usiku wa Tashreeq huko Mina, na Tawaf ya kuaga. Kuacha wajibu hakubatilishi Hija bali kunafidiwa kwa bwawa (sadaka). Madhhab hutofautiana katika orodha kamili; wasiliana na mwongozo wenye sifa.",
      },
      {
        title: "Malipo ya Hija mabrur",
        body: "Hija iliyokubaliwa (Hija mabrur) - isiyo na dhambi na iliyofanywa kwa ikhlasi - inafuta madhambi yaliyopita na malipo yake ni Pepo yenyewe. Mtume (Swalla Allaahu ´alayhi wa sallam) amesema: “Hija iliyokubaliwa haina malipo ila Pepo” (Bukhari 1773, Muislamu 1349). Jitahidi kuwa na tabia bora na upole kote.",
      },
      {
        title: "Mwongozo wa vitendo, sio fatwa",
        body: "Huu ni muhtasari wa vitendo kukusaidia kufuata ibada kwa mpangilio. Madhhab hutofautiana kwa heshima katika maelezo mengi, na hali ya kila hujaji ni tofauti - daima wasiliana na mwanachuoni aliyehitimu au mwongozo wako rasmi wa Hija kwa hukumu maalum na kesi zisizotarajiwa.",
      },
    ],
  },
  {
    day: "Kabla ya kwenda",
    title: "Viza na usajili",
    summary: "Jinsi mahujaji wanavyojisajili na kupata viza ya Hija au Umra kupitia njia rasmi.",
    steps: [
      {
        title: "Jukwaa la Nusuk",
        body: "Nusuk (nusuk.sa) ni jukwaa rasmi la Saudi Arabia kwa ajili ya Hija na Umra — linatumika kuhifadhi viza, malazi, usafiri, na vifurushi vya kitalii vilivyosajiliwa. Tumia Nusuk pekee au mashirika yenye leseni kupitia hilo; wapatanishi wasio rasmi ni chanzo cha kawaida cha udanganyifu na safari zilizoghairiwa.",
      },
      {
        title: "Viza ya Hija na mgao wa kitaifa",
        body: "Kila nchi hupokea mgao wa kila mwaka wa Hija, kwa hivyo mahujaji wengi huomba kupitia mamlaka ya Hija ya nchi yao au wakala wa ndani mwenye leseni badala ya kuomba wenyewe. Omba mapema mwaka msimu wa Hija unapofunguliwa — mgao na nafasi za vifurushi hujaa miezi mingi kabla.",
      },
      {
        title: "Viza ya Umra",
        body: "Tofauti na Hija, Umra haina mgao na inaweza kufanywa wakati wowote wa mwaka. Raia wengi wanaweza kuomba viza ya Umra moja kwa moja kupitia Nusuk au wakala wa utalii walioidhinishwa, mara nyingi pamoja na uhifadhi wa ndege na hoteli.",
      },
    ],
  },
  {
    day: "Kabla ya kwenda",
    title: "Orodha ya vitu vya kubeba",
    summary: "Vitu muhimu vya kubeba kabla ya kuondoka.",
    steps: [
      {
        title: "Mavazi ya ihram",
        body: "Wanaume wanapaswa kubeba angalau seti mbili za mavazi ya ihram yasiyoshonwa (kitambaa cha chini na cha juu) na mkanda mpana wa ihram usio wa ngozi kwa fedha na hati. Wanawake wanapaswa kubeba mavazi ya juu yaliyolegea, ya heshima na yasiyopambwa.",
      },
      {
        title: "Viatu na starehe",
        body: "Sandali wazi zinazovaliwa na kuvuliwa kwa urahisi ni muhimu sana, kwani viatu vinavyofunika kifundo cha mguu vimekatazwa katika ihram kwa wanaume. Beba mkoba mwepesi, chupa ya maji inayoweza kujazwa tena, na msala mdogo kwa ajili ya kusubiri kwa muda mrefu.",
      },
      {
        title: "Vifaa vya usafi visivyo na harufu",
        body: "Beba sabuni isiyo na harufu, losheni ya jua, na leso za mvua — bidhaa zenye manukato zimekatazwa katika ihram. Kisanduku kidogo cha huduma ya kwanza, dawa yoyote ya kibinafsi pamoja na kibali cha daktari, na plasta za malengelenge zinafaa uzito wa ziada kutokana na kiasi kikubwa cha kutembea.",
      },
      {
        title: "Hati na vitu muhimu",
        body: "Weka pasipoti, nakala iliyochapishwa ya viza, cheti cha chanjo (chanjo ya meninjitisi mara nyingi inahitajika), na namba za dharura katika mkoba mwembamba wa kiunoni unaovaliwa chini ya nguo. Betri ya kubebea na simu ya ndani au eSIM huifanya iwe rahisi kusonga mahali penye msongamano mkubwa.",
      },
    ],
  },
  {
    day: "Kabla ya kwenda",
    title: "Orodha ya maeneo matakatifu",
    summary: "Vidokezo vifupi vya vitendo kuhusu maeneo makuu utakayoyatembelea.",
    steps: [
      {
        title: "Masjid al-Haram, Makka",
        body: "Msikiti Mkuu unaozunguka Al-Kaaba — mahali pa tawaf na sa'ai. Unafanya kazi saa ishirini na nne; tarajia msongamano mkubwa sana karibu na Jiwe Jeusi na wakati wa sala tano za kila siku, hasa katika siku kumi za mwisho za Ramadhani na siku za Hija.",
        location: "Makka",
      },
      {
        title: "Masjid an-Nabawi, Madina",
        body: "Msikiti wa Mtume ﷺ, unaokaa na Raudha na mahali pake pa mazishi, si sehemu ya Hija yenyewe lakini karibu mahujaji wote hutembelea Madina kabla au baada ya Hija. Kuingia Raudha kunahitaji kibali cha muda maalum kilichohifadhiwa kupitia Nusuk au programu ya Raudhah.",
        location: "Madina",
      },
      {
        title: "Mina",
        body: "Mji wa mahema kilomita chache kutoka Makka ambapo mahujaji hutumia usiku wa 8, 11, 12 (na 13) Dhul-Hijjah. Kambi za mahema yenye kiyoyozi na yasiyoshika moto hupangwa na wapangaji wa utalii; tarajia vifaa vya kawaida vya pamoja na kutembea kwa mbali kwenda Jamarat.",
        location: "Mina",
      },
      {
        title: "Arafah",
        body: "Uwanja wazi karibu kilomita 20 kutoka Makka, mahali muhimu zaidi pa nguzo ya Hija — kusimama (wuquf) tarehe 9 Dhul-Hijjah. Miundo ya kivuli na sehemu za maji zimewekwa, lakini joto la mchana ni kali sana; unywaji wa maji na kujikinga na jua ni muhimu sana.",
        location: "Arafah",
      },
      {
        title: "Muzdalifah",
        body: "Eneo wazi kati ya Arafah na Mina ambapo mahujaji hutumia usiku wa 9-10 Dhul-Hijjah chini ya anga wazi na kukusanya kokoto kwa ajili ya kurusha jamarat. Vifaa vimepunguzwa kimakusudi — beba msala na uvae kwa ajili ya hewa baridi zaidi ya usiku.",
        location: "Muzdalifah",
      },
    ],
  },
  {
    day: "Kabla ya kwenda",
    title: "Vyanzo rasmi",
    summary: "Mahali pa kupata taarifa rasmi za kutegemewa na za sasa.",
    steps: [
      {
        title: "Nusuk (nusuk.sa)",
        body: "Tovuti na programu rasmi ya Wizara ya Hija na Umra ya Saudi kwa ajili ya viza, vifurushi vilivyoidhinishwa, vibali vya kutembelea Raudhah, na mwongozo wa msongamano na usafiri wa wakati halisi — mahali pa kwanza kwa swali lolote rasmi.",
      },
      {
        title: "Mamlaka ya Hija ya nchi yako",
        body: "Nchi nyingi zina mamlaka ya kitaifa ya Hija au ofisi ya wizara inayosimamia mgao wa kila mwaka, kuthibitisha wakala wa ndani, na kuchapisha ratiba za safari na mahitaji ya afya — angalia kabla ya kuhifadhi kupitia wakala wowote binafsi.",
      },
      {
        title: "Visit Saudi (visitsaudi.com)",
        body: "Tovuti rasmi ya utalii ya serikali ina mahitaji ya kuingia, taarifa za viza ya kielektroniki kwa raia wanaostahili, na ushauri wa vitendo wa safari kwa Makka, Madina, na usafiri mwingine ndani ya Saudi Arabia.",
      },
      {
        title: "Thibitisha kabla ya kulipa",
        body: "Hifadhi kupitia mashirika yaliyoorodheshwa kwenye Nusuk au mamlaka ya Hija ya nchi yako pekee. Iwapo ofa inaonekana nafuu sana au mpatanishi anaomba malipo nje ya njia rasmi, chukulia hilo kama ishara ya tahadhari na thibitisha moja kwa moja kupitia tovuti ya wizara.",
      },
    ],
  },
];
