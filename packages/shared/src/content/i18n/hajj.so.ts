import type { PilgrimageChecklistItem } from "../../types/hajj-guide";
import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// SO overlay for Hajj & Umrah Learn topics + rite checklists.
// Index-aligned with English sources; only human-readable text is translated.

export const HAJJ_GUIDE_TOPICS_SO: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Abaalmarinta xaj la aqbalay",
    summary: "Xaj mabrur wuxuu tirtiraa dembiyada, abaalmarinteeduna waa Jannada.",
    body: [
      'Abu Hurayrah wuxuu sheegay in Rasuulka Ilaahay ﷺ yidhi: "Qofkii u xajiya Ilaah dartiis oo aan galmo samayn ama dembi samayn, wuxuu ku soo noqdaa siduu ahaa maalintii hooyadiis dhashay" (Sahih al-Bukhari 1521; Sahih Muslim 1350).',
      'Wuxuu sidoo kale yidhi: "Xaj la aqbalay (xaj mabrur) ma laha abaalmarin aan ahayn Jannada" (Sahih al-Bukhari 1773; Sahih Muslim 1349). Aqbalaaddu waxay ku xiran tahay daacadnimo iyo in xajka laga ilaaliyo xumaanta iyo dembiga — ma aha oo kaliya dhammaystirka tallaabooyinka dibadda ah.',
    ],
    hadith: [
      {
        excerpt:
          "Qofkii u xajiya Ilaah dartiis oo aan galmo samayn ama dembi samayn, wuxuu ku soo noqdaa siduu ahaa maalintii hooyadiis dhashay.",
      },
      {
        excerpt:
          "Qofkii u xajiya Ilaah dartiis oo aan galmo samayn ama dembi samayn, wuxuu ku soo noqdaa siduu ahaa maalintii hooyadiis dhashay.",
      },
      { excerpt: "Xaj la aqbalay ma laha abaalmarin aan ahayn Jannada." },
      { excerpt: "Xaj la aqbalay ma laha abaalmarin aan ahayn Jannada." },
    ],
    actions: [
      "U niyeyso xajka Ilaah keliya — ilaali afkaaga iyo dabeecaddaada safarka oo dhan.",
      "Isticmaal liiska xajka ee app-ka kaliya xusuusin ahaan; qalbigaaga ku hay aqbalaadda.",
    ],
    appLinks: [{ label: "Liiska manasikka xajka" }],
  },
  {
    title: "Fadliga cumro",
    summary: "Cumro ilaa cumro waxay tirtirtaa dembiyada u dhexeeya.",
    body: [
      'Abu Hurayrah wuxuu sheegay in Nabiga ﷺ yidhi: "Cumro la sameeyo waa kafaaro dembiyada u dhexeeya iyada iyo kan ka horreeyay, xaj la aqbalayna ma laha abaalmarin aan ahayn Jannada" (Sahih al-Bukhari 1773; Sahih Muslim 1349).',
      "Cumro waxaa la samayn karaa wakhti kasta oo sanadka ah. Way ka gaaban tahay xajka laakiin weli waa cibaado weyn: ihram, tawaf, sa'i, iyo goynta ama xiiridda timaha.",
    ],
    hadith: [
      {
        excerpt:
          "Cumro la sameeyo waa kafaaro dembiyada u dhexeeya iyada iyo kan ka horreeyay, xaj la aqbalayna ma laha abaalmarin aan ahayn Jannada.",
      },
      {
        excerpt:
          "Cumro la sameeyo waa kafaaro dembiyada u dhexeeya iyada iyo kan ka horreeyay, xaj la aqbalayna ma laha abaalmarin aan ahayn Jannada.",
      },
    ],
    actions: ["Fur liiska cumro markaad diyaar u tahay inaad manasikka ku socoto si taxaddar leh."],
    appLinks: [{ label: "Liiska manasikka cumro" }],
  },
  {
    title: "Maalinta Carafah",
    summary: "Istaagga Carafah waa qalbiga xajka — waana maalin weyn oo ducada ah.",
    body: [
      "Cabd al-Rahman ibn Ya'mar wuxuu sheegay in Nabiga ﷺ yidhi: \"Xajku waa Carafah\" (Sunan Abi Dawud 1949; Jami' at-Tirmidhi 889). Qofkii ka maqnaado istaagga xuduudaha Carafah waqtigeeda wuxuu ka maqnaaday xajka sannadkaas.",
      "Kuwa aan xajka ku jirin, soonka Maalinta Carafah waa sunno xooggan: Abu Qatadah wuxuu sheegay in soonka Carafah uu kafaaro dembiyada sanadkii hore iyo kan soo socda (Sahih Muslim 1162). Xujeydu ma soomaan si ay maalinta ugu huraan ducada.",
    ],
    hadith: [
      { excerpt: "Xajku waa Carafah." },
      { excerpt: "Xajku waa Carafah." },
      {
        excerpt:
          "Soonka Maalinta Carafah, waxaan Ilaah ka rajaynayaa inuu kafaaro dembiyada sanadkii ka horreeyay iyo kan ka dambeeyay.",
      },
    ],
  },
  {
    title: "Xaj — tiirka shanaad",
    summary: "Waajib hal mar nolosha oo dhan muslim kasta oo awood leh.",
    body: [
      'Ilaah wuxuu yidhi: "Dadka waxaa Ilaah ka saaran xajka Guriga — qofkii awood u leh jid u heliddiisa. Qofkii gaaloobana — Ilaah wuxuu ka qanacsan yahay caalamka" (Qur\'an 3:97).',
      'Baaqii waxaa loo dhawaaqay dadka oo dhan: "U dhawaaq dadka xajka; waxay kuu imaan doonaan lug iyo geel khafiif ah; waxay ka imaan doonaan dariiq kasta oo fog" (Qur\'an 22:27).',
      "Ibn Umar wuxuu sheegay in Nabiga ﷺ yidhi Islaamka waxaa lagu dhisay shan: shahaadada, salaadda, zakada, soonka Ramadaan, iyo xajka Guriga qofkii awooda (Sahih al-Bukhari 8; Sahih Muslim 16). Culimadu waxay isku raaceen inuu waajib yahay hal mar nolosha marka shuruudaha la buuxiyo; ku celcelintu waa fadli ikhtiyaari ah.",
    ],
    quran: [
      {
        excerpt:
          "Dadka waxaa Ilaah ka saaran xajka Guriga — qofkii awood u leh jid u heliddiisa...",
      },
      { excerpt: "U dhawaaq dadka xajka; waxay kuu imaan doonaan lug iyo geel khafiif ah..." },
    ],
    hadith: [
      {
        excerpt:
          "Islaamka waxaa lagu dhisay shan: shahaadada in aan ilaah jirin Ilaah mooyee iyo in Muxammad yahay Rasuulka Ilaah, oogista salaadda, bixinta zakada, soonka Ramadaan, iyo xajka Guriga qofkii awood u leh jid u heliddiisa.",
      },
      {
        excerpt:
          "Islaamka waxaa lagu dhisay shan... iyo xajka Guriga qofkii awood u leh jid u heliddiisa.",
      },
    ],
  },
  {
    title: "Awood (istita'ah)",
    summary:
      "Caafimaad, hanti sharci ah, iyo jid ammaan ah — iyaga la'aantood xaj weli laguma waajibin.",
    body: [
      "Shuruudda Qur'an 3:97 waa awood (istita'ah). Culimada qadiimka ah waxay ku soo koobayaan: caafimaad jireed oo safarka u qalma, hanti sharci ah oo ku filan safarka iyo baahiyaha kuwa aad masuul ka tahay intaad maqan tahay, iyo jid ammaan ah oo furan.",
      "Qofkii sanadkan ka maqan yahay waxyaalahan ma dembaabayo inuu dib u dhigo ilaa uu awoodo. Awoodda waxaa lagu qiimeeyaa kiis kasta — jirro, deyn waajib ah in la bixiyo, ama safar aan ammaan ahayn ayaa ka qaadi kara waajibka degdegga ah. Weydii caalim aqoon leh marka xaaladdaadu aan caddayn.",
    ],
    quran: [{ excerpt: "...qofkii awood u leh jid u heliddiisa." }],
    actions: [
      "Bixi deymaha waajibka ah oo diyaari nafaqada kuwa aad masuul ka tahay ka hor intaadan ballansan.",
      "Hubi baakadaha kaliya kanaalada rasmiga ah (eeg mowduucyada diyaarinta).",
    ],
  },
  {
    title: "Safarka haweenka xajka",
    summary:
      "Jamaacadu badankood waxay shuruud ka dhigaan mahram; aragtiyo dambe qaarkood waxay ogolaadaan koox ammaan ah oo la isku halleyn karo.",
    body: [
      "Ibn Abbas wuxuu sheegay in Nabiga ﷺ yidhi haweeneydu ha u safrin mooyee mahram, ninna ha u gelin iyada mooyee mahram la joogo (Sahih al-Bukhari 1862; Sahih Muslim 1341). Culimo badan ayaa tan ku dabaqaya safarka xajka iyo cumro.",
      "Culimo dambe qaarkood — iyagoo miisaamaya amniga, baahida, iyo safarka casriga ah — waxay ogolaadaan in haweeney u safrto xajka waajibka ah koox la isku halleyn karo marka mahram la waayo. Tani weli waa su'aal fiqh oo muran leh.",
    ],
    hadith: [
      {
        excerpt:
          "Haweeneydu ha u safrin mooyee mahram, ninna ha u gelin iyada mooyee mahram la joogo.",
      },
      {
        excerpt:
          "Ma bannaana haweeney rumaysan Ilaah iyo Maalinta Dambe inay u safrto maalin iyo habeen mooyee mahram.",
      },
    ],
    madhhabNote:
      "Jamaacadu badankood waxay qabaan in haweeney u baahan tahay mahram safarka xajka. Culimo dambe qaarkood waxay ogolaadaan safarka koox haween ah oo ammaan ah xajka waajibka ah. Raac caalim aad aaminayso iyo xeerarka hay'adda xajka.",
  },
  {
    title: "Saddexda nooc ee xajka",
    summary: "Ifrad, Qiran, iyo Tamattu' — go'aanso ka hor intaadan gelin ihram.",
    body: [
      "Ifrad: geli ihram xajka oo keliya, iyada oo aan cumro gooni ah la samayn isla ihramkaas, mana loo baahna allabari sababtoo ah isku darista manasikka.",
      "Qiran: isku dar cumro iyo xaj hal ihram, oo ku sii jir ihram ilaa xajku dhammaado. Allabari (hady) waa waajib.",
      "Tamattu': samee cumro buuxda bilaha xajka, ka bax ihram, ka dibna dib u geli ihram xajka 8 Dhul-Hijjah. Tani waa waxa xujeydu badankood maanta sameeyaan; sidoo kale waxay u baahan tahay hady.",
      "Ilaah wuxuu ku saabsan kuwa isku dara manasikka yidhi: \"...Qofkii ka faa'iidaysanayo cumro si uu u xajiyo, waxa si fudud loo heli karo xoolaha allabariga...\" kuwa aan awoodinna waxay soomaan saddex maalmood xajka gudahiisa iyo toddoba markay soo noqdaan (Qur'an 2:196).",
    ],
    quran: [
      {
        excerpt:
          "O dhammaystira xajka iyo cumro Ilaah dartiis... Qofkii ka faa'iidaysanayo cumro si uu u xajiyo, waxa si fudud loo heli karo xoolaha allabariga. Qofkii aan helin — soon saddex maalmood xajka gudahiisa iyo toddoba markaad soo noqdaan...",
      },
    ],
    actions: [
      "Go'aanso noocaaga hoggaamiyaha kooxda ka hor miqat.",
      "Haddii aad samaynayso Tamattu', dhammaystir cumro si buuxda ka hor intaadan dib u gelin ihram xajka.",
    ],
    appLinks: [{ label: "Liiska cumro" }, { label: "Liiska xajka" }],
  },
  {
    title: "Shanta mawaqit",
    summary: "Ha ka gudbin miqat adigoo u socda Makkah iyada oo aanad gelin ihram xaj ama cumro.",
    body: [
      "Ibn Abbas wuxuu sheegay in Nabiga ﷺ u go'aamiyay miqato dadka: Dhul-Hulayfah reer Madinah, Al-Juhfah reer Shaam, Qarn al-Manazil reer Najd, iyo Yalamlam reer Yemen; reer Ciraaqna Dhat 'Irq. Wuxuu yidhi kuwan waa iyaga iyo qof kasta oo soo mara iyagoo doonaya xaj ama cumro; qofka ku nool gudahooda wuxuu ka galaa ihram meeshuu ka bilaabo, xataa reer Makkah Makkah ka (Sahih al-Bukhari 1524; Sahih Muslim 1181).",
      "Garoomada diyaaradaha iyo dekedaha casriga ah waxay leeyihiin meelo ihram ama habraacyo la shaaciyay — raac tilmaamaha shirkaddaada iyo Wasaaradda Xajka iyo Cumro si aadan xadka uga gudbin adigoon ihram gelin.",
    ],
    hadith: [
      {
        excerpt:
          "Rasuulka Ilaahay ﷺ wuxuu u go'aamiyay Dhul-Hulayfah reer Madinah, Al-Juhfah reer Shaam, Qarn al-Manazil reer Najd, iyo Yalamlam reer Yemen... Miqatadan waa kuwa meelahaas iyo kuwa soo mara iyagoo doonaya xaj ama cumro...",
      },
      {
        excerpt:
          "Rasuulka Ilaahay ﷺ wuxuu cayimay miqato... Qofka ku nool gudahooda wuxuu ka galaa ihram meeshuu ka bilaabo...",
      },
    ],
  },
  {
    title: "Gelitaanka ihram",
    summary: "Ghusl, dharka, niyada, iyo talbiyah ayaa bilaaba xaaladda quduuska ah.",
    body: [
      "Ihram waa xaalad quduus ah oo lagu galo niyada xaj ama cumro. Nabiga ﷺ wuxuu ku dhiirrigeliyay ghusl ka hor ihram. Raggu waxay xidhaan laba maro cad oo aan la tolmin; haweeneydu waxay haystaan dharka caadiga ah ee sharci ah iyada oo aan wajiga daboolin ama gacmaha galoofyo xidhan sida dharka ihram (faahfaahinta niqab iyo galoofyo waa arrimo fiqh).",
      "Raggu waxay ku mari karaan udgoon jirkooda ka hor ihram, ma aha dharka ihram ka dib gelitaanka xaaladda (Sahih al-Bukhari 1539). Kadib samee niyada oo bilow talbiyah.",
      'Talbiyah uu baray Nabiga ﷺ waa: "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni\'mata laka wal-mulk, la sharika lak" — ilaa tawaf bilaabmo cumro, ama ilaa la dhagaxyo Jamrat al-Aqaba xaj sida caadada caanka ah (Sahih al-Bukhari 1549; Sahih Muslim 1184).',
    ],
    hadith: [
      {
        excerpt:
          "Caa'ishah waxay tidhi: Waxaan udgoon u mari jiray Rasuulka Ilaahay ﷺ ihramkiisa ka hor inta uusan gelin ihram...",
      },
      {
        excerpt:
          "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni'mata laka wal-mulk, la sharika lak.",
      },
      { excerpt: "Nabiga ﷺ wuxuu codkiisa kor u qaaday talbiyah: Labbayk Allahumma labbayk..." },
    ],
    actions: [
      "U diyaari ragga ugu yaraan laba xirmo ihram; hayso alaab nadiif ah oo aan udgoon lahayn.",
      "Tababar talbiyah ka hor safarka si ay ugu socoto jidka.",
    ],
  },
  {
    title: "Mamnuucyada ihram",
    summary: "Waxa muhrimku waa inuu ka fogaado ilaa uu ka baxo xaaladda quduuska ah.",
    body: [
      "Intaad ihram ku jirto, ka fogaaw: ragga — dharka la tolmo ama ku habboon iyo madaxa daboolidda; udgoon; goynta timaha ama ciddiyaha; ugaadhsiga dhulka; guurka ama fulinta guurka; iyo galmo. Haweeneydu waxay ka fogaataa udgoon iyo mamnuucyada kale ee la wadaago iyadoo haysta dharka sharci ah.",
      "Jebinta mamnuuc waxay u baahan kartaa kafaaro (fidyah) — sida caadiga ah soon, quudinta masaakiinta, ama allabari — iyadoo ku xiran waxa la sameeyay. Madhhabadu waxay si kala duwan u kala saaraan faahfaahinta. Si taxaddar leh u ilaali mamnuucyada oo weydii hagaha aqoon leh haddii wax aan la filayn dhacaan.",
    ],
    actions: ["Ka fogee udgoon, jarista ciddiyaha, iyo foornada intaad ihram ku jirto."],
    madhhabNote:
      "Liisaska xadgudubyada iyo kafaaratoodu way kala duwan yihiin dugsiyada. U qaado tan liis digniin oo keliya, ka dibna faahfaahinta kula xaqiiji madhhabkaaga ama hagaha xajka.",
  },
  {
    title: "Cumro — ihram iyo talbiyah",
    summary: "Geli xaaladda quduuska ah miqat ama ka hor, ka dibna ka jawaab baaqa Ilaah.",
    body: [
      "Miqat ama ka hor, samee ghusl haddii aad awooddo, xidho dharka ihram, samee niyada cumro, oo bilow talbiyah. Xaaladda quduuska ah waxay bilaabataa niyadaas.",
      "Ku celceli talbiyah intaad u socoto Makkah ilaa aad bilowdo tawaf. Waa bayaan ah inaad keligaa ka jawaabayso baaqa Ilaah.",
    ],
    actions: ["Isticmaal liiska cumro si aad u calaamadeyso manasik kasta markaad dhammayso."],
    appLinks: [{ label: "Liiska cumro" }],
  },
  {
    title: "Tawaf Ka'bah",
    summary: "Toddoba wareeg oo ka soo horjeeda saacadda, laga bilaabo Dhagaxa Madow.",
    body: [
      "Ka wareeg Ka'bah toddoba jeer oo ka soo horjeeda saacadda, laga bilaabo geeska Dhagaxa Madow. Dhunkasho, taabasho, ama tilmaan xaggeeda takbir haddii dad badan yihiin — raac dhaqanka Nabiga ﷺ adigoon waxyeelayn dadka kale.",
      "Raggu waxay sameeyaan raml (socod degdeg ah) saddexda wareeg ee ugu horreeya iyo idtiba' (muujinta garbka midig) tawafkan cumro ee imaatinka, sida Sunnada caanka ah.",
      'Inta u dhexeysa Geeska Yamani iyo Dhagaxa Madow waxaa lagula talinayaa in la yidhaahdo: "Rabbigeenna, na si wanaag adduunkan iyo wanaag aakhiro, oo naga ilaali ciqaabta Naarta" (Qur\'an 2:201).',
    ],
    quran: [
      {
        excerpt:
          "Rabbigeenna, na si wanaag adduunkan iyo wanaag aakhiro, oo naga ilaali ciqaabta Naarta.",
      },
    ],
  },
  {
    title: "Laba rakaco iyo Zamzam",
    summary: "Tukada gadaasha Maqam Ibrahim haddii ay suurtagal tahay, ka dibna cab Zamzam.",
    body: [
      'Tawaf ka dib, tukada laba rakaco gadaasha Maqam Ibrahim haddii meel bannaan tahay, ama meel kale oo masjidka ah haddii dad badan yihiin — raac erayada Ilaah: "...O rumaystayaal, ka qaata meesha Ibraahim taagan yahay meel salaad..." (Qur\'an 2:125).',
      "Kadib cab biyaha Zamzam. Sharaxaadda Jabir ee xajka Nabiga ﷺ waxay ku jirtaa cabitaanka Zamzam ka dib tawaf; Nabiga ﷺ wuxuu yidhi Zamzam waa waxa loo cabbo (warbixinno sax ah oo ay ururiyeen culimada dambe; u niyeyso ujeedada iyo ducada sida lagula taliyay).",
    ],
    quran: [{ excerpt: "...O rumaystayaal, ka qaata meesha Ibraahim taagan yahay meel salaad..." }],
  },
  {
    title: "Sa'i inta u dhexeysa Safa iyo Marwah",
    summary: "Toddoba wareeg xusuus ahaan raadinta biyaha ee Haajar.",
    body: [
      'Ilaah wuxuu yidhi: "Runtii, Safa iyo Marwah waxay ka mid yihiin calaamadaha Ilaah. Qofkii u xajiya Guriga ama sameeya cumro — wax dembi ah kuma saarayo inuu u socdo inta u dhexeysa..." (Qur\'an 2:158).',
      "Socod toddoba jeer inta u dhexeysa Safa iyo Marwah, laga bilaabo Safa. Safa, u jeedso Ka'bah, kor u qaad gacmahaaga takbir iyo ducada sida Nabiga ﷺ sameeyay. Raggu waxay ordaan inta u dhexeysa calaamadaha cagaaran.",
    ],
    quran: [
      {
        excerpt:
          "Runtii, Safa iyo Marwah waxay ka mid yihiin calaamadaha Ilaah. Qofkii u xajiya Guriga ama sameeya cumro — wax dembi ah kuma saarayo inuu u socdo inta u dhexeysa...",
      },
    ],
  },
  {
    title: "Halq ama taqsir — dhammaystirka cumro",
    summary:
      "Raggu waxay xiiraan ama gooyaan; haweeneydu waxay gooyaan qiyaas faraha — ka dib ihram waa baxaa.",
    body: [
      "Raggu waxay xiiraan madaxa (halq) — Nabiga ﷺ wuxuu u duceeyay saddex jeer — ama si siman u gooyaan (taqsir). Haweeneydu waxay ururiyaan timaheeda oo gooyaan qiyaas faraha. Tan kadib cumro waa dhammaatay oo xaddidaadaha ihram way baxaan.",
      'Cabdullah ibn Umar wuxuu sheegay in Rasuulka Ilaahay ﷺ yidhi: "Ilaahow, u naxariiso kuwa madaxa xiira." Waxay yidhaahdeen: "Kuwa gooya, Rasuulkii Ilaahay?" Wuxuu yidhi: "Ilaahow, u naxariiso kuwa madaxa xiira." Waxay yidhaahdeen: "Kuwa gooya, Rasuulkii Ilaahay?" Wuxuu yidhi markii saddexaad: "Iyo kuwa gooya" (Sahih al-Bukhari 1727; Sahih Muslim 1301).',
    ],
    hadith: [
      { excerpt: "Ilaahow, u naxariiso kuwa madaxa xiira... Markii saddexaad: iyo kuwa gooya." },
      {
        excerpt:
          "Ilaahow, cafi kuwa madaxa xiira... markii saddexaad wuxuu yidhi: iyo kuwa timaha gooya.",
      },
    ],
  },
  {
    title: "8 Dhul-Hijjah — Maalinta Tarwiyah",
    summary: "Geli ihram xajka oo ku qaad maalinta Mina.",
    body: [
      "Xujeyda Tamattu': samee niyada xajka oo dib u geli ihram gurigaaga Makkah, oo cusbooneysii talbiyah. Xujeyda Ifrad iyo Qiran horay ayay ihram ku jireen.",
      "U safar Mina oo tukada Dhuhr, Asr, Maghrib, Isha, iyo Fajr ee xigta, mid kasta oo loo gaabiyay laba rakaco waqtigeeda, raac dhaqanka Nabiga ﷺ xajkii Wadaagga sida Jabir sheegay (Sahih Muslim 1218). Ku qaad maalinta iyo habeenka cibaadada, sugaya Carafah.",
    ],
    hadith: [
      {
        excerpt:
          "Sheekada dheer ee Jabir ee xajkii Wadaagga Nabiga ﷺ — oo ay ku jirto joogitaanka Mina iyo taxanaha manasikka.",
      },
    ],
    actions: ["Fur liiska xajka subaxdii 8-aad."],
    appLinks: [{ label: "Liiska xajka" }],
  },
  {
    title: "9 Dhul-Hijjah — Maalinta Carafah",
    summary: "Istaag gudaha Carafah ilaa qorrax dhac; ka dib u guur Muzdalifah.",
    body: [
      'Joog gudaha xuduudaha Carafah laga bilaabo dhexdii maalin ilaa qorrax dhac ducada, zikr, iyo toobadkeen. Nabiga ﷺ wuxuu yidhi "Xajku waa Carafah" (Sunan Abi Dawud 1949). U jeedso qiblada, kor u qaad gacmahaaga, oo baryo Ilaah — waa mid ka mid ah waqtiyada ugu weyn ee ducada.',
      "Tukada Dhuhr iyo Asr wada jir oo la gaabiyay waqtiga Dhuhr (jam' taqdim), ka dibna maalinta inteeda kale u hibee ducada halkii salaad ikhtiyaari ah — raac dhaqanka Nabiga ﷺ (Sahih Muslim 1218).",
      "Qorrax dhac ka dib, si degan ugu safar Muzdalifah. Isku dar Maghrib iyo Isha (Isha la gaabiyay), naso habeenka, oo ururi dhagaxyo dhagaxynta. Kuwa daciifka ah iyo haweenka waxay u bixi karaan Mina ka dib saqdii dhexe sida ogolaanshaha caanka ah ee Sunnada.",
    ],
    hadith: [
      { excerpt: "Xajku waa Carafah." },
      {
        excerpt:
          "Nabiga ﷺ wuxuu isku daray Dhuhr iyo Asr Carafah, ka dibna wuxuu ka baxay qorrax dhac kadib u socda Muzdalifah...",
      },
    ],
  },
  {
    title: "10 Dhul-Hijjah — Maalinta Nahr",
    summary: "Dhagaxayn, allabari, timo, iyo Tawaf al-Ifadah.",
    body: [
      "Ku noqo Mina oo tuur toddoba dhagaxood Jamrat al-Aqaba (tiirka weyn), ku dhawaaq Allahu akbar tuur kasta — waa manasikka ugu horreeya maalinta taxanaha xajkii Wadaagga.",
      "Bixi allabariga looga baahan yahay Tamattu' iyo Qiran (Qur'an 2:196), ama ka diyaari hay'ad la isku halleyn karo. Hilibka waa la cunaa oo masaakiinta waa la siiyaa.",
      "Xiir (halq) ama gooy (taqsir); haweeneydu waxay gooyaan qiyaas faraha. Dhagaxayn iyo xiir/gooy kadib, tahallul awwal ayaa khuseeyaa — xaddidaadaha ihram intooda badan way baxaan marka laga reebo galmo.",
      "Tag Makkah Tawaf al-Ifadah — tiir xaj — iyo sa'i xujeyda Tamattu' (Ifrad/Qiran oo horay sa'i la sameeyay tawafkooda imaatinka waxay raacaan xukunka dugsigooda). Tani waxay dhammaystirtaa bixitaanka buuxda ee ihram.",
    ],
    quran: [
      {
        excerpt:
          "...Qofkii ka faa'iidaysanayo cumro si uu u xajiyo, waxa si fudud loo heli karo xoolaha allabariga...",
      },
    ],
    madhhabNote:
      "Taxanaha manasikka Maalinta Nahr wuxuu leeyahay dabacsanaan Sunnada; dugsiyadu way kala duwan yihiin taxanaha saxda ah iyo goorta sa'i looga baahan yahay nooc kasta oo xaj. Raac hagaha kooxdaada.",
  },
  {
    title: "11–13 Dhul-Hijjah — Maalmaha Tashreeq",
    summary: "Habeeno Mina, dhagaxayn maalinle ah saddexda Jamarat, ka dibna tawaf salaanta.",
    body: [
      "Ku qaad habeenada 11, 12 (iyo 13 haddii aadan hore u bixin) Mina. Kuwani waa maalmo cunto, cabitaan, iyo xusuus Ilaah.",
      "Galab kasta Dhuhr ka dib, tuur toddoba dhagaxood mid kasta oo saddexda tiir — kan yar, ka dhexe, ka weyn — takbir tuur kasta. Qofkii degdegaya wuxuu bixi karaa dhagaxayn 12 (Qur'an 2:203).",
      "Ka hor intaadan ka bixin Makkah, samee Tawaf al-Wada si ficilka ugu dambeeya ee Guriga uu noqdo salaanta. Ibn Abbas wuxuu sheegay in dadka lagu amray in manasikooda ugu dambeeya ay ka ahaato Guriga, marka laga reebo in laga fududeeyay haweeneyda caadada leh (Sahih al-Bukhari 1755; Sahih Muslim 1328).",
    ],
    quran: [
      {
        excerpt:
          "Xusuusta Ilaah maalmaha la tiriyey. Qofkii degdegaya laba maalmood — dembi kuma saarayo; qofkii dib u dhigana — dembi kuma saarayo — qofkii Ilaah ka cabsada...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dadka waxaa lagu amray inay sameeyaan tawaf salaanta Ka'bah sida manasikka ugu dambeeya, marka laga reebo haweeneyda caadada leh oo laga cafiyay.",
      },
      {
        excerpt:
          "Dadka waxaa lagu amray in manasikooda ugu dambeeya ay ka ahaato Guriga, laakiin waxaa laga fududeeyay haweeneyda caadada leh.",
      },
    ],
  },
  {
    title: "Tiirarka iyo waajibaadka",
    summary: "Waxa xajka burin haddii la seego, iyo waxa lagu magdhaw allabari.",
    body: [
      "Tiirarka (arkan) waa asalka xajka. Tiir la seego, xajku waa buraa oo allabari keliya ma hagaajin karo — waa in la sameeyaa. Jamaacadu badankood waxay ku taxdaa: ihram (niyada), istaagga Carafah, Tawaf al-Ifadah, iyo sa'i.",
      "Waajibaadka (wajibat) waxaa ka mid ah gelitaanka ihram miqat, joogitaanka Muzdalifah, dhagaxaynta Jamarat, habeenada Tashreeq ee Mina, iyo Tawaf Salaanta. Ka tagista waajib ma buriso xajka laakiin waxaa lagu magdhaw dam (allabari) sida dugsiyada.",
    ],
    madhhabNote:
      "Liisaska saxda ah ee arkan iyo wajibat way kala duwan yihiin afarta madhhab. Kula xaqiiji hagaha aqoon leh dugsigaaga — gaar ahaan haddii wax la seego cadaadiska dadka.",
  },
  {
    title: "Anshax iyo daacadnimo",
    summary: "Ilaali afka iyo xubnaha — aqbalaaddu waxay ku xiran tahay dabeecadda.",
    body: [
      "Hadiska soo noqoshada aan dembi lahayn (Bukhari 1521; Muslim 1350) wuxuu cadeynayaa in xajka uu burburiyo xumaanta (rafath), dembiga (fusuq), iyo muranka. Samir, jilicsanaan, iyo caawinta xujeyda kale waa qayb cibaado ah.",
      "Ha u oggolaan taleefannada iyo hadalka madhan inay ka taliyaan Carafah iyo masjidka. Ka daa jidka tawaf; ha riixin Dhagaxa Madow. Xaj la aqbalay waa saaxiibka Jannada — ku dadaal anshax wanaagsan safarka oo dhan.",
    ],
    hadith: [
      {
        excerpt:
          "Qofkii u xajiya Ilaah dartiis oo aan galmo samayn ama dembi samayn, wuxuu ku soo noqdaa siduu ahaa maalintii hooyadiis dhashay.",
      },
    ],
    actions: [
      "Samee niyad maalinle ah: hal ficil naxariis iyo hal ducda daacad ah oo ka sarreysa dadka.",
    ],
  },
  {
    title: "Fiiso iyo diiwaangelin",
    summary: "Isticmaal kanaalada rasmiga ah — Nusuk iyo hay'adda xajka qarankaaga.",
    body: [
      "Nusuk (nusuk.sa) waa madal rasmiga ah ee Sacuudi Carabiya xajka iyo cumro — fiisooyin, hoy, gaadiid, iyo baakado diiwaangashan. Dillaali aan rasmiga ahayn waa ilo caadi ah oo khiyaano ah.",
      "Dal kasta wuxuu helaa qoontada xajka sanadlaha ah; xujeydu badankood waxay codsadaan hay'adda xajka qaranka ama wakiil ruqsad leh. Cumro ma laha qoonto waxaana la diyaarin karaa inta badan sanadka kanaalada la ansixiyay.",
    ],
    actions: [
      "Codsashada hore marka xilli ciyaareedku furmo.",
      "Ballansashada kaliya hay'adaha ku qoran Nusuk ama hay'adda qaranka.",
      "Hubi kanaalada lacag bixinta ka hor intaadan lacag u wareejin.",
    ],
  },
  {
    title: "Waxa la xidho",
    summary: "Ihram, alaab aan udgoon lahayn, dukumiintiyo, iyo raaxo socod.",
    body: [
      "Ragga: ugu yaraan laba xirmo ihram oo aan la tolmin iyo suun dukumiintiyo. Haweenka: dhar fidsan oo sharci ah. Sandalo furan oo si fudud loo xidho; boorsada yar iyo dhalo biyo.",
      "Xidho saabuun iyo muraayad qorraxda oo aan udgoon lahayn — udgoon waa mamnuuc ihram. Hayso baasaboor, daabacaadda fiisada, diiwaannada tallaalka, iyo xiriirada degdegga ah boorsada khafiifka ah. Baatariga korontada iyo SIM ama eSIM maxalli ah ayaa ka caawiya dadka badan.",
    ],
    actions: [
      "Liiska: ihram ×2, sandalo, alaab aan udgoon lahayn, boorsada dukumiintiyada, daawo, baatariga korontada.",
      "Qaado balastaraha qanjirka — xujeydu waxay socdaan masaafo fog.",
    ],
  },
  {
    title: "Goobaha quduuska ah ee kooban",
    summary: "Makkah, Madinah, Mina, Carafah, iyo Muzdalifah — faahfaahin wax ku ool ah.",
    body: [
      "Masjid al-Haram wuxuu ku wareegsan yahay Ka'bah — goobta tawaf iyo sa'i; filo dad aad u badan. Masjid an-Nabawi Madinah ma aha qayb xajka laakiin xujeydu badankood way booqdaan; gelitaanka Rawdah waa waqti loo qoondeeyay app-yada rasmiga ah.",
      "Mina waa magaalada teendhooyinka habeenada 8 iyo 11–13 Dhul-Hijjah. Carafah waa bannaanka furan — biyo iyo hadh ayaa muhiim ah 9. Muzdalifah waa meesha xujeydu ku nastaan cirka furan oo ay ururiyaan dhagaxyo — xarumaha waa yar yihiin si ula kac ah.",
    ],
    actions: ["Baro khariidad fudud oo Mina–Carafah–Muzdalifah ka hor safarka."],
  },
  {
    title: "Ilaha rasmiga ah",
    summary: "Nusuk, hay'adda qarankaaga, iyo Visit Saudi.",
    body: [
      "Ka bilow Nusuk fiisooyin, baakado, ruqsadaha Rawdah, iyo hagitaanka dadka. Isticmaal wasaaradda xajka dalkaaga qoontada iyo xeerarka caafimaadka. Visit Saudi waxay daabacdaa talooyin gelitaanka iyo safarka guud.",
      "Haddii heshiis u muuqdo mid aad u jaban ama dillaali uu ka codsado lacag bixin ka baxsan kanaalada rasmiga ah, si toos ah ugu xaqiiji bogga wasaaradda ka hor intaadan bixin.",
    ],
    actions: [
      "Kaydi nusuk.sa iyo bogga hay'adda xajka qaranka.",
      "Kaydi xiriirada degdegga ah hoggaamiyaha kooxda.",
    ],
  },
];

export const HAJJ_CHECKLIST_SO: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Geli ihram xajka",
    hint: "U niyeyso xajka oo geli ihram (Makkah tamattu'); cusbooneysii talbiyah.",
    day: "8 Dhul-Hijjah",
  },
  {
    title: "U safar Mina",
    hint: "Tukada Dhuhr ilaa Fajr Mina, mid kasta la gaabiyay waqtigeeda.",
    location: "Mina",
    day: "8 Dhul-Hijjah",
  },
  {
    title: "Istaag Carafah",
    hint: "Joog gudaha Carafah laga bilaabo dhexdii maalin ilaa qorrax dhac ducada iyo zikr.",
    location: "Carafah",
    day: "9 Dhul-Hijjah",
  },
  {
    title: "Isku dar Dhuhr & Asr",
    hint: "Tukada Dhuhr iyo Asr wada jir oo la gaabiyay waqtiga Dhuhr, ka dibna u hibee ducada.",
    location: "Carafah",
    day: "9 Dhul-Hijjah",
  },
  {
    title: "U guur Muzdalifah",
    hint: "Qorrax dhac ka dib, isku dar Maghrib iyo Isha, naso, oo ururi dhagaxyo.",
    location: "Muzdalifah",
    day: "9 Dhul-Hijjah",
  },
  {
    title: "Dhagax Jamrat al-Aqaba",
    hint: "Tuur toddoba dhagaxood tiirka weyn takbir tuur kasta.",
    location: "Mina",
    day: "10 Dhul-Hijjah",
  },
  {
    title: "Bixi allabariga",
    hint: "Waajib tamattu' iyo qiran — gowrac ama ka diyaari hay'ad la isku halleyn karo.",
    day: "10 Dhul-Hijjah",
  },
  {
    title: "Halq ama taqsir",
    hint: "Raggu waxay xiiraan ama gooyaan; haweeneydu waxay gooyaan qiyaas faraha (tahallul koowaad).",
    day: "10 Dhul-Hijjah",
  },
  {
    title: "Tawaf al-Ifadah",
    hint: "Samee Tawaf al-Ifadah iyo sa'i tamattu' — tiir xaj.",
    location: "Masjid al-Haram",
    day: "10 Dhul-Hijjah",
  },
  {
    title: "Habeen Mina ku qaad",
    hint: "Ku qaad habeenada 11, 12 (iyo 13 haddii aadan hore u bixin) Mina.",
    location: "Mina",
    day: "11–13 Dhul-Hijjah",
  },
  {
    title: "Dhagax saddexda Jamarat",
    hint: "Dhuhr ka dib maalin kasta, tuur yar, dhexe, ka dibna weyn — toddoba mid kasta.",
    location: "Mina",
    day: "11–13 Dhul-Hijjah",
  },
  {
    title: "Tawaf salaanta",
    hint: "Samee Tawaf al-Wada ka hor intaadan ka bixin Makkah (haweeneyda caadada leh waa laga cafiyay).",
    location: "Masjid al-Haram",
    day: "Bixitaanka",
  },
];

export const UMRAH_CHECKLIST_SO: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Geli ihram",
    hint: "Miqat ama ka hor: ghusl, dharka ihram, niyada cumro, talbiyah.",
    location: "Miqat",
  },
  {
    title: "Akhriso talbiyah",
    hint: "Ku celceli Labbayk… intaad u socoto ilaa aad bilowdo tawaf.",
  },
  {
    title: "Tawaf Ka'bah",
    hint: "Toddoba wareeg oo ka soo horjeeda saacadda laga bilaabo Dhagaxa Madow; ragga: raml iyo idtiba'.",
    location: "Masjid al-Haram",
  },
  {
    title: "Tukada laba rakaco",
    hint: "Gadaasha Maqam Ibrahim haddii ay suurtagal tahay, ka dibna cab Zamzam.",
    location: "Masjid al-Haram",
  },
  {
    title: "Sa'i Safa & Marwah",
    hint: "Toddoba wareeg laga bilaabo Safa; raggu waxay ordaan inta u dhexeysa calaamadaha cagaaran.",
    location: "Masjid al-Haram",
  },
  {
    title: "Halq ama taqsir",
    hint: "Raggu waxay xiiraan ama gooyaan; haweeneydu waxay gooyaan qiyaas faraha — cumro waa dhammaatay.",
  },
];
