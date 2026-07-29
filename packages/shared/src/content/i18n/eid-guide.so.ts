import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Somali translation overlay for the Learn Eid guide. Mirrors the order of
// EID_GUIDE_TOPICS in ../eid-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const EID_GUIDE_TOPICS_SO: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Ciidda Fitrka — dabaaldegga jebinta soonka",
    summary: "Maalinta koowaad ee Shawwaal, oo calaamad u ah dhammaadka soonka Ramadaan.",
    body: [
      "Ciidda Fitrka waxay dhacdaa 1-da Shawwaal, isla marka Ramadaan dhammaado, waana maalin farxad iyo mahadnaqid ah sababtoo ah in la awoodo in la soomo iyo in la caabudo bishii oo dhan. Qur'aanku wuxuu ku xiraa dhammaadka soonka si toos ah xusuusta iyo mahadnaqidda: '...si aad u dhammaystaan tirada, aadna Alle ugu weynaysaan wax uu idinku hanuuniyay, iyo si aad u mahadnaqdaan' (Qur'aanka 2:185).",
      "Soonka maalintan waa mamnuuc si cad ah, mana ahan wax kaliya oo aan la jeclaysan — Nabiga ﷺ wuxuu ku sheegay, oo ay la socoto Ciidda Adxa, mid ka mid ah labada maalmood ee Muslimiinta lagu amray inay cunaan halkii ay soomi lahaayeen (Bukhaari 1990). Maalintu waxay ku bilaabataa Zakada Fitrka iyo salaadda Ciidda, waxaana lagu sii wataa booqashada qoyska, isweydaarsiga rabitaanka wanaagsan, iyo dabaaldegga guud ee ku jira xadka Islaamka.",
    ],
    quran: [
      {
        excerpt:
          "...si aad u dhammaystaan tirada, aadna Alle ugu weynaysaan wax uu idinku hanuuniyay, iyo si aad u mahadnaqdaan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kuwani waa laba maalmood oo Rasuulka Alle ﷺ ka mamnuucay soonka: maalinta aad jebinaysaan soonkiinna (Ramadaan), iyo maalinta aad wax ka cunaysaan allabarigiinna.",
      },
    ],
  },
  {
    title: "Ciidda Adxa — dabaaldegga allabariga",
    summary: "10-ka Zul-Xijjah, xusuusta allabariga Ibraahim.",
    body: [
      "Ciidda Adxa waxay dhacdaa 10-ka Zul-Xijjah, Maalinta Xilliga xagxaajiga, waxayna xusuusataa diyaargaroowga Ibraahim ee ah in uu allabariyo wiilkiisa isagoo addeecaya Alle, iyo naxariista Alle ee ku badbaadiyay xoolo allabari ah halkiisa (Qur'aanka 37:102–107). Marka la eego culimo badan, tani waa tan ka weyn labada Ciid, waxayna la beegantaa dhammaadka xagxaajiga kuwa xagxaaji ah.",
      "Sida Ciidda Fitrka, soonka maalintan waa mamnuuc (Bukhaari 1990). Cibaadadeeda dheeraadka ah oo ugu weyn waa allabariga (udhiyah), oo ay bixiyaan kuwa awoodda leh, iyadoo ah xusuus u ah is-dhiibista Ibraahim, oo ah camal cibaado iyo sadaqad isku mid ah.",
    ],
    quran: [
      {
        excerpt:
          "Markuu (wiilku) gaadhay xilliga uu la socon karo, [Ibraahim] wuxuu yidhi: Wiilkaygiiyow, waxaan riyo ku arkay inaan ku gowracayo... Waxaana ku badbaadinnay allabari weyn.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kuwani waa laba maalmood oo Rasuulka Alle ﷺ ka mamnuucay soonka: maalinta aad jebinaysaan soonkiinna (Ramadaan), iyo maalinta aad wax ka cunaysaan allabarigiinna.",
      },
    ],
  },
  {
    title: "Sida loo tukado salaadda Ciidda",
    summary: "Laba rakac oo leh takbiiro dheeraad ah — la'aanta azaan iyo iqaamo.",
    body: [
      "Salaadda Ciidda waa laba rakac, oo lagu tukado jamaaco iyada oo aan la yeelin azaan iyo iqaamo hore — Jaabir ibnu Cabdullah iyo Ibnu Cabbaas labaduba waxay xaqiijiyeen in aan la yeelin wicitaan wax salaad ah labada Ciid intii Nabiga ﷺ nool ahaa (Saxiix Muslim 886). Salaadda waxaa ka daba socda khudbad, oo ka duwan salaadda Jimcaha oo khudbaddu marka hore timaado.",
      "Takbiiro dheeraad ah (oo ah odhaahda 'Allaahu Akbar') waxaa lagu daraa akhriska ka hor rakac kasta, marka lagu daro takbiirooyinka caadiga ah ee salaadda. Caasha waxay sheegtay in Nabiga ﷺ yidhaahdo takbiirka toddoba jeer rakacii koowaad iyo shan jeer rakacii labaad, labada Ciidba (Sunan Abi Daawuud 1149), tiro laga sheegay Cabdullah ibnu Camr (Abi Daawuud 1151).",
    ],
    hadith: [
      {
        excerpt:
          "Maalinta Ciidda Fitrka ma jirin azaan markuu imaamku soo baxay, iyo mana jirin ka dib soo baxiddiisa; ma jirin iqaamo iyo wicitaan iyo waxba sidaas oo kale maalintaas.",
      },
      {
        excerpt:
          "Rasuulka Alle ﷺ wuxuu yidhaahdaa takbiirka toddoba jeer rakacii koowaad iyo shan jeer rakacii labaad maalinta jebinta soonka iyo maalinta allabariga.",
      },
    ],
    madhhabNote:
      "Madaxda fiqhigu way ku kala duwan yihiin tirada saxda ah ee takbiirada dheeraadka ah. Culimada Shaafi'i, Maaliki, iyo Xanbali waxay raacaan sheekada toddoba-shan (Abi Daawuud 1149/1151) — Maaliki iyo Xanbali waxay ku xisaabiyaan takbiirka furitaanka toddobada dhexdiisa, sidaas darteed waxay dhihi shan-lix. Madaxda Xanafi waxay ku dhaqmaan 3 takbiirood dheeraad ah ka hor akhriska rakacii koowaad iyo 3 ka hor rukuucda rakacii labaad (dhamaan 6) — fikrad culimada Kufa oo aan lahayn hadiith marfuuc gaar ah oo la xaqiijiyay; raac tirada takbiirada imaamka jamaacaadkaaga.",
    actions: [
      "Ku soo xir wakhtiga — ma jiro azaan iyo iqaamo oo calaamadeeya bilowga.",
      "Raac tirada takbiirooyinka imaamkaaga; ficilka mid kasta oo madxafnimo waa sax.",
      "Sii jooga khudbadda salaadda ka dib.",
    ],
  },
  {
    title: "Sunnooyinka maalintaas",
    summary: "Weysashada, dharka ugu wanaagsan, cuntada ka hor/ka dib, iyo laba jid oo kala duwan.",
    body: [
      "Waxaa jira dhowr sunnadood oo yar oo lagula talinayo in la sameeyo ka hor iyo ka dib salaadda Ciidda. Ciidda Fitrka, Nabiga ﷺ ma bixi jirin salaadda ilaa uu cunay dhowr digir, tiro isku dhafan (Bukhaari 953) — taas oo ka duwan Ciidda Adxa, halkaas oo lagula talinayo in la sugo oo la cuno allabariga salaadda ka dib.",
      "Waa sunno in weysasho oo la xirto dharka ugu wanaagsan (nadiif ah, edeb leh) munaasabaddaas, oo la raacayo dhaqanka guud ee saxaabada labada Ciidba, in kastoo sheekadan gaarka ah aysan si adag u xaqiijin marka la barbardhigo kuwa kale halkan, waana dhaqan si ballaaran loo raaco ka badan hadiith kaliya oo saxiix ah.",
      "Sunna gaar ah waa in la soo qaato jid ka duwan kii lagu socday. Jaabir ibnu Cabdullah wuxuu sheegay: 'Maalinta Ciidda Nabiga ﷺ wuxuu soo noqon jiray (salaadda Ciidda ka dib) jid ka duwan kii uu ku socday' (Bukhaari 986) — sida caadiga ah waxaa loo sharaxaa sidii lagu tarayo goobaha markhaatiga u ah cibaadadiisa oo lagu muujinayo dhaqammada Islaamka si ballaaran.",
    ],
    hadith: [
      {
        excerpt:
          "Nabiga ﷺ waligiis ma bixi jirin (salaadda) maalinta Ciidda Fitrka ilaa uu cunay dhowr digir, oo uu ku cuni jiray tiro isku dhafan.",
      },
      {
        excerpt:
          "Maalinta Ciidda Nabiga ﷺ wuxuu soo noqon jiray (salaadda Ciidda ka dib) jid ka duwan kii uu ku socday.",
      },
    ],
    actions: [
      "Weysasho oo xir dharkaaga ugu wanaagsan ee edebta leh.",
      "Ku cun digir tiro isku dhafan ka hor salaadda Ciidda Fitrka; sug cuntada ilaa salaadda Ciidda Adxa ka dib.",
      "Ku soo noqo jid ka duwan kii aad ku socatay xagga salaadda.",
    ],
  },
  {
    title: "Zakada Fitrka — aasaaska",
    summary: "Sadaqad waajib yar, oo waajib ah in la bixiyo ka hor salaadda Ciidda Fitrka.",
    body: [
      "Zakada Fitrka waa sadaqad gaar ah, ka yar zakada hantida, waajib ku ah Muslim kasta — yar iyo weyn, lab iyo dhaddig, xor iyo mid ku tiirsan — oo madaxa qoyska u bixiyo magacooda. Ibnu Cumar wuxuu sheegay in Nabiga ﷺ ku waajibiyay saac (u dhow 2–3 kg) digir ah ama shaciir ah Muslim kasta, oo la bixiyo ka hor inta dadku u baxaan salaadda Ciidda (Bukhaari 1503).",
      "Ujeeddadeeda waxaa si cad loogu sheegay Sunnada: 'nadiifin u ah soomaha erayada macnaha darranaa iyo qashinka, iyo cunto u ah masaakiinta' (Abi Daawuud 1609). Bixinteeda ka hor salaadda Ciidda waxay u tirsan tahay zakadan gaarka ah; bixinteeda salaadda ka dib waxay wali u tirsan tahay sadaqad guud, laakiin waxay lumiyaa abaalmarinta gaarka ah ee la xiriirta wakhtiga.",
      "Bulshooyinka badankoodu maanta waxay ku xisaabiyaan qiimaha lacagta maxalliga ah halkii ay si toos ah u qaybin lahaayeen digir ama shaciir, iyagoo raacaya tilmaanta culimada maxalliga ah iyo hay'adaha zakada ee ku saabsan qiimaha hadda ee cuntada asaasiga ah — waa habaynta wax ku ool ah, mana aha isbeddel waajibaadka aasaasiga ah.",
    ],
    hadith: [
      {
        excerpt:
          "Rasuulka Alle ﷺ wuxuu ku waajibiyay bixinta hal Saac oo digir ah ama hal Saac oo shaciir ah sida Zakada Fitrka Muslim kasta, addoon ama xor, lab ama dhaddig, yar ama weyn, wuxuuna amray in la bixiyo ka hor inta dadku u baxaan inay sameeyaan salaadda Ciidda.",
      },
      {
        excerpt:
          "Rasuulka Alle ﷺ wuxuu ku amray Zakada Fitrka sida nadiifin u ah soomaha erayada macnaha darranaa iyo qashinka, iyo sida cunto u ah masaakiinta. Ku alla kii bixiya ka hor salaadda, waa zakad la aqbalay; ku alla kii bixiya salaadda ka dib, waa sadaqad (caadi ah).",
      },
    ],
    actions: [
      "Xisaabi oo dhig Zakada Fitrka naftaada iyo kuwa ku tiirsan.",
      "Bixi ka hor inta aad u baxdo salaadda Ciidda Fitrka haddii ay suurtogal tahay.",
    ],
    appLinks: [{ label: "Xisaabiyaha zakada" }],
  },
  {
    title: "Allabariga (udhiyah) — aasaaska",
    summary: "Allabari xoolo ah oo la bixiyo Ciidda Adxa, oo lala wadaago masaakiinta.",
    body: [
      "Allabariga waa gowracidda xoolo ku qalma (ari, ido, sac, ama geel, oo buuxinaya shuruudaha da'da iyo caafimaadka) Ciidda Adxa iyo maalmaha Tashriiq ee ka dambeeya, sidii xusuusta allabariga Ibraahim. Anas wuxuu sheegay in Nabiga ﷺ isagu gacmihiisa gowracay laba wan oo madow-cad ah, isagoo ku xusaya magaca Alle iyo takbiirka korkooda (Bukhaari 5558) — tani waxay caddaysaa in gowracidda qofka lafteeda samaynayo, marka la awoodo, ay tahay ficilka aad u wanaagsan, in kastoo in loo wakiil yeesho qof kale magacaaga sax yahay.",
      "Qur'aanku wuxuu si toos ah ugu xiraa allabariga qaybinta hilibkiisa: '...cun waxoogaa ka mid ah oo qarab u sii cunto kan baahan iyo kan wax weydiista' (Qur'aanka 22:36). Hilibka waxaa guud ahaan lagu qaybiyaa qoyska qofka, ehelka iyo saaxiibbada, iyo masaakiinta, si munaasabaddan u isku darto cibaado, deeqsinimo, iyo mahadnaqid.",
      "Gowracidda waa in ay dhacdo salaadda Ciidda ka dib, mana ahan ka hor — sxaabi gowracay hore waxaa Nabiga ﷺ ku amray inuu ku celiyo, sababtoo ah allabari la bixiyay ka hor salaadda uma tirsan udhiyah. Xukummada ku saabsan qofka saxda ah ee waajibka ku ah, iyo waqtiga saxda ah, way ku kala duwan yihiin madaxda fiqhiga; la tashii culimo maxalli ah oo aqoon u leh xaaladdaada.",
    ],
    quran: [
      {
        excerpt:
          "...waxaad u leedihin khayr. Marka ku xusa magaca Alle korkooda markay taagan yihiin [gowracidda]; markayse dhacaan dhabarkooda, cun waxoogaa ka mid ah oo cunto sii kan baahan iyo kan wax weydiista.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Nabiga ﷺ wuxuu gowracay laba wan, oo madow-cad ah, waxaana ku arkay isagoo cagta saaraya dhabarkooda isagoo ku xusaya Magaca Alle oo takbiirka leh. Kadibna wuxuu ku gowracay gacmihiisa.",
      },
    ],
    actions: [
      "Diyaari allabarigaaga ka hor Ciidda Adxa haddii aad awoodo oo ay kuu waajib tahay.",
      "Hubi in gowracidda ay dhacdo salaadda Ciidda ka dib, mana ahan ka hor.",
      "U qaybi hilibka qoyskaaga, ehelka/saaxiibbadaada, iyo masaakiinta.",
    ],
    disclaimer:
      "Qofka saxda ah ee allabariga uu ku waajib yahay, iyo waqtiga sax ee gowracidda, waa su'aalo fiqhi oo faahfaahsan oo ku kala duwan madaxda fiqhiga. Tani waa waxbarasho guud, mana aha fatwo — la tashii culimo maxalli ah oo aqoon u leh xaaladdaada.",
  },
];
