// Somali translation overlay for the Learn Hajj & Umrah guide. Mirrors the order of
// its English source in ../hajj-guide.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { HajjGuideSection } from "../../types/hajj-guide";
import type { DeepPartial } from "./localize";

export const HAJJ_GUIDE_SECTIONS_SO: DeepPartial<HajjGuideSection>[] = [
  {
    day: "Inta aadan tagin",
    title: "Waajibka & shuruudaha",
    summary: "Maxaa Xajku ku waajibay, iyo cidda uu ku waajibay.",
    steps: [
      {
        title: "Tiirka shanaad",
        body: 'Xajku waa rukunka shanaad ee Islaamka, waana waajib ku waajib ah nolosha hal mar qof kasta oo Muslim ah. Eebe wuxuu yidhi: "Ilaah baa dadka ka ahaaday xajka Baydka, ruuxii karana inuu jid u helo" (Qur\'aanka 3:97). Waxaa lagu naadiyey dadka oo dhan: "Oo u bishaaree dadka xajka, way idiin iman doonaan iyagoo lugaynaya iyo awr kasta oo jilicsan" (Qur\'aanka 22:27).',
      },
      {
        title: "Kartida (istita'ah)",
        body: "Xajku waxa uu ku waajiba kuwa awooda oo kaliya: caafimaadka jidhka ee safarka, xoolo xalaal ah oo ku filan oo lagu dabooli karo safarka iyo kuwa ku tiirsan inta ay maqan yihiin, iyo wado aamin ah oo furan. Kii sanadkan wax ka maqan yahay dembi kuma aha inuu dib u dhigo ilaa uu awoodo.",
      },
      {
        title: "Naag safarkeeda",
        body: "Inta badan culumada waxay qabaan in haweeneydu ay xajka u safreyso iyada iyo maxram (nin ama qaraabo dhow oo aan guursan); Qaar ka mid ah culimada dambe ayaa oggolaaday inay ku safraan koox dumar ah oo ammaan ah, oo la aamini karo. Raac xukunka aqoonyahanka aqoonta leh ee aad ku kalsoon tahay iyo nidaamka u degsan xajka.",
      },
    ],
  },
  {
    day: "Inta aadan tagin",
    title: "Saddexda nooc ee xajka",
    summary: "Ifrad, Qiran, iyo Tamattu' - dooro ka hor inta aanad ixram gelin.",
    steps: [
      {
        title: "Ifrad",
        body: "Xaajigu waxa uu galay ixraamka xajka keligiis, ma soo gudan cumro gaar ah, wax allabarina kuma bixiyo xisaabtiisa. Wuxuu ku sugnaaday ixraam ilaa laga gaarayo cibaadada maalinta Naxr.",
      },
      {
        title: "Qiran",
        body: "Xaajigu waxa uu isku daraa cumro iyo xaj oo keliya hal ixraam, isaga oo soo gudanaya cibaadada cumrada iyo in uu ku sugnaado ilaa inta xajku ka dhammaanayo. Sida Tamattu', waxay u baahan tahay allabari (hady).",
      },
      {
        title: "Tamattu'",
        body: "Xaajigu waxa uu soo gutay cumro dhammaystiran bilaha xajka, waxa uu ka baxayaa ixraamka, ka dibna waxa uu dib u galayaa ixraamka xajka 8da Dul-Hijjah. Tani waa waxa xujaajta badankoodu sameeyaan; waxay u baahan tahay allabari, ama in la soomo saddex maalmood oo xaj ah iyo todoba soo noqosho haddii qofku aanu awoodin (Qur'aanka 2: 196).",
      },
    ],
  },
  {
    day: "Inta aadan tagin",
    title: "Miqaatkii & Ixraamkii",
    summary: "Meesha ay ka bilaabato dawladnimada muqadas ah, iyo waxa ay diidayso.",
    steps: [
      {
        title: "Shanta mawaaqit",
        body: "Nebigu ﷺ wuxuu dejiyay shan mitir oo xuduud ah oo ay tahay inaan la dhaafin ixraam la'aan:Dhul-Xuleyfah (Madiino), Al-Juhfah (oo Suuriya/Masar), Qarn al-Manazil (oo Najd ah), Yalamlam (Yeman), iyo Dhat 'Irq (Ciraaq). Kuwii hore ugu jiray waxay ka soo galaan ixraamka meesha ay joogaan.",
        location: "Miqaat",
      },
      {
        title: "Waa maxay ixraamku",
        body: "Ixraamku waa dawlad xurmo leh oo niyo iyo talbiya lagu galay. Raggu waxay xidhaan laba go' oo cad oo aan tolnayn; Dumarku waxay ilaashadaan labbiska caadiga ah. Waxa la galaa gariir dabadeed, ragga, iyada oo la marsado jidhka (maaha dharka) ka hor.",
        location: "Miqaat",
      },
      {
        title: "Mamnuuca ixraamka",
        body: "Inta aad ixraamka ku jirto iska ilaali: dharka tolan/ku dhejisan iyo daboolka madaxa (ragga), cadarka, jarista timaha ama cidiyaha, ugaarsiga ugaadhsiga, qandaraaska ama qabashada guurka, iyo wixii xidhiidh ah. Jebinta kuwan waxay u baahan kartaa kafaaraggud (fidyah), markaa si taxadar leh u ilaali.",
        location: "Miqaat",
      },
    ],
  },
  {
    title: "Cumrada",
    summary: "Xajka yar - waxaa la samayn karaa wakhti kasta oo sanadka ah.",
    steps: [
      {
        title: "Ixraamka gal",
        body: "Miiqaatka ama ka hor, samee Ghusl, xidho dharka ixraamka, samee niyada Cumrada, oo bilow talbiyah. Ujeeddadu waxay ku jirtaa qalbiga, oo xaaladda quduuska ahi waxay bilaabmaysaa wakhtigaas.",
        location: "Miqaat",
      },
      {
        title: "talbiyah akhri",
        body: 'Ku celi "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk..." inta badan markaad u socoto Makkah - cadeynta inaad ka jawaabto baaqa Alle kaligaa - sii wad ilaa aad ka bilaabayso tawaaf.',
      },
      {
        title: "Tawaafka Kacbada",
        body: "Goobaabi Kacbada todoba jeer dhanka saacada gees ka gees ah, adigoo ka bilaabaya kuna dhamaanaya geeska Dhagaxa Madow, halkaas oo aad dhunkaneyso, taabo, ama si fudud ugu tilmaan takbiir. Raggu waxay sameeyaan raml (xawaaraha degdega ah) ee saddexda wareeg ee hore iyo idtiba' (garabka garabka midig). Inta u dhaxaysa geeska Yaman iyo dhagax madow waxay akhriyaan: \"Eebow, na sii adduunka wanaag, aakhirona wanaag, naga ilaali cadaabka naarta\" (Qur'aanka 2:201).",
        location: "Masjid al-Xaram",
      },
      {
        title: "Tukado laba rakcadood",
        body: "Tawaaf ka dib, ku tukado laba rakcadood Maqam Ibraahim gadaashiisa haddii ay suurtogal tahay (ama meel kasta oo masaajidka ka mid ah haddii ay dadku ku badan yihiin), ka dibna cab biyaha Zamzam si xor ah, waayo nebigu ﷺ wuxuu yidhi Zamzamku wax kasta oo la cabbo.",
        location: "Masjid al-Xaram",
      },
      {
        title: "Saci inta u dhaxaysa Safa & Marwah",
        body: 'Todoba jeer ku lugee inta u dhaxaysa Safa iyo Marwah, ka bilow Safa, si aad u xasuusato raadadkii ay Haajar biyo u raadinaysay wiilkeeda Ismaaciil. Eebe wuxuu yidhi: "Runtii, as-Safa iyo al-Marwah waxay ka mid yihiin calaamadaha Alle" (Qur\'aanka 2:158). Safa, kacbada wajaho oo gacmahaaga kor u qaad duco iyo takbiir; nimanku waxay ku dhex ordaan calamadaha cagaarka ah.',
        location: "Masjid al-Xaram",
      },
      {
        title: "Halq ama taqsiir",
        body: "Raggu madaxa way xiiraan (halq, abaalgud badan) ama si siman bay u gooyaan (taqsiir); dumarku waxay ururiyaan timahooda waxayna gooyaan dhererka caarada. Iyadoo sidaas ay cumradu ku dhammaatay oo ay kor u qaadayso xannibaadihii.",
      },
    ],
  },
  {
    day: "8 Dhul-Hijjah",
    title: "Maalinta Tarwiyah - Mina",
    summary: "Xajka ayaa bilaabmaya; maalintii waxay ku dhammaatay Mina.",
    steps: [
      {
        title: "Gali ixraamka Xajka",
        body: "Niyada u yeel xajka oo dib uga soo gal ixraamka (kaga guuro gurigaaga Makkah si aad u tamattucdo), dib u cusboonaysii talbiyah. Tani waxay mar kale bilaabanaysaa dawladii xurmada leh, sidaas darteed mamnuucida ixramku waxay mar kale marayaan.",
      },
      {
        title: "U safrida Mina",
        body: "Mina aado oo ku tukado Dhuxar, Casar, Magrib, Isha, iyo Fajarka xiga, mid walba wuxuu soo gaabiyey laba rakcadood waqtigiisa, isagoo raacaya sunnaha Rasuulka ﷺ. Habeen iyo dharaar ku bixi cibaadada, idinkoo sugaya istaagida Carrafo.",
        location: "Mina",
      },
    ],
  },
  {
    day: "9 Dhul-Hijjah",
    title: "Maalinta Carafo",
    summary: "Maalinta ugu weyn ee xajka - taagan Carafa.",
    steps: [
      {
        title: "Carafo istaag",
        body: 'Ku nag soohdinta Carafa laga bilaabo duhurkii ka dib ilaa qorraxdu ka dhacayso duco, zikri iyo tawbad. Nebigu ﷺ wuxuu yidhi, "Xaajigu waa Carafa" (Tirmidhi 889, Abuu Daawuud 1949, xasan sahihi): Qofkii ka baaqda mawqifkan waxa uu seegay xajka. Qiblada wajaho, gacmaha kor u taag, Allaahna bari – waa maalinta ducada ugu weyn.',
        location: "Carafa",
      },
      {
        title: "Isku-dar Dhuxul & Casar",
        body: "Ducada Duhur iyo Casar wada jira oo soo gaabiya wakhtiga Dhuxarka (jamc taqdim), ka dibna maalinta inteeda kale ku dadaal ducada halkii aad ka ahaan lahayd salaad dheeraad ah.",
        location: "Carafa",
      },
      {
        title: "U guuro Muzdalifah",
        body: "Qorrax-dhaca ka dib si deggan ugu safar Muzdalifah, isku dar Maghrib iyo Isha (Isha la soo gaabiyay), habeenkii naso, oo ururso dhagaxyo dhagaxyo ah. Kuwa daciifka ah iyo haweenku waxay u bixi karaan Mina saqda dhexe ka dib si ay uga fogaadaan burburka.",
        location: "Muzdalifa",
      },
    ],
  },
  {
    day: "10 Dhul-Hijjah",
    title: "Maalinta Nahr - Ciid al-Adxa",
    summary: "Dhagxaan, allabaryo, iyo tawaafka ugu weyn.",
    steps: [
      {
        title: "Dhagaxa Jamrat al-Aqaba",
        body: 'U soo laabo dhanka Mina oo ku tuur todobo quruurux tiirkii weynaa (Jamrat al-Aqaba), adigoo leh "Allaahu akbar" tuur kasta. Tani waxay dib u soo celinaysaa diidmadii Ibraahim ee shaydaanka waana tii ugu horaysay ee maalintaas.',
        location: "Mina",
      },
      {
        title: "Bixi allabariga",
        body: "Gow neefka allabariga, ama u diyaari hay'ad la aamini karo, sida loogu baahan yahay tamattu' iyo qiraan xujaajta (Qur'aanka 2:196). Hilibkeedana waa la cunaa oo masaakiinta ayaa la siiyaa.",
      },
      {
        title: "Halq ama taqsiir",
        body: "Timaha iska xiirto (halq) ama jar (taqsiir) timaha; dumarku waxay gooyaan caarada faraha. Dhagax-tuurka iyo xiirashada ka dib, sii-deynta ugu horreysa (tahalul awwaal) ayaa khuseysa - dhammaan xannibaadaha ixraamka ayaa kor u qaadaya marka laga reebo xiriirka ka dhexeeya lamaanaha.",
      },
      {
        title: "Tawaaf al-Ifaadah",
        body: "U tag Makkah Tawaf al-Ifadah - tiirka xajka - iyo sacii (tamattu'). Taasi waxay dhamaystiraysaa siidaynta buuxda ee ixraamka, qofkii ka fogaada fisqiga iyo dembigu “wuxuu soo noqdaa sidii maalintii hooyadii dhashay” (Bukhaari 1521, Muslim 1350).",
        location: "Masjid al-Xaram",
      },
    ],
  },
  {
    day: "11–13 Dhul-Xijjah",
    title: "Maalmihii Tashriiq - Mina",
    summary: "Habeennada Mina iyo dhagxaanta maalinlaha ah ee saddexda tiir.",
    steps: [
      {
        title: "Habeen ku hoy Mina",
        body: "Ku bixi habeenada 11-aad, 12-aad (iyo 13-aad haddii aadan horay uga bixin) Mina. Waa maalmo la cuno, la cabbo, laguna xuso Alle, laguna bixiyo cibaadada iyo takbiirta.",
        location: "Mina",
      },
      {
        title: "Dhagxaan saddexda Jamarat",
        body: "Galab kasta oo ka dambeeya Dhuxarka, waxaad ku tuurtaa tiir kasta oo ka mid ah toddoba dhagax oo dhagax ah - mid yar, ka dibna dhexda, ka dibna ka weyn - oo ku yaal takbiir kasta. Ruuxii degdega wuu baxaa markuu dhagax ku dhuftay 12-ka (Quraanka 2:203).",
        location: "Mina",
      },
      {
        title: "Sagootinta Tawaf",
        body: "Kahor intaadan ka tagin Makkah, samee Tawaf al-Wada oo ah cibaadada ugu dambeysa, si ay xajka ugu dambeeyaa uu ugu jiro Baydka. Dumarka caadada qabta waa laga dhaafay.",
        location: "Masjid al-Xaram",
      },
    ],
  },
  {
    day: "Dhamaystirka & axkaamta",
    title: "Tiirarka, waajibaadka & abaalmarinta",
    summary: "Maxaa Xajka Ansixinaya, Maxaa Laga Bixiyay, Iyo Ajrigiisa.",
    steps: [
      {
        title: "Tiirarka (arkan)",
        body: "Tiirarka waa nuxurka xajka: galitaanka ixraamka, istaagida Carafa, Tawaf al-Ifadah, iyo sacii (sida ay badi qabaan). Haddii tiir la waayo, Xajku waa buray oo wax allabari laguma samayn karo - waa in lagu celiyaa.",
      },
      {
        title: "Waajibaadka (wajibat)",
        body: "Waajibaadka waxaa ka mid ah ka soo galitaanka ixraamka ,muzdalifah oo la dego, jamaacada oo la dhagxiyo, habeenada Tashriiqda ee Mina la hoydo, iyo tawaafadda sagootinta. Waajibka oo la iska dhaafaa ma burinayso xajka ee waxa lagu magdhabaa biyo-xidheen (qaraar). Madhhabyadu way ku kala duwan yihiin liiska saxda ah; la tasho hage aqoon leh.",
      },
      {
        title: "Ajarkii xaj mabruur",
        body: "Xajka la aqbalay (Xaj mabruur) - oo aan dembi lahayn oo si dhab ah loo sameeyo - wuxuu tirtiraa dembiyadii hore, abaalkiisuna waa Jannada lafteeda. Rasuulku (scw) wuxuu yidhi, “Xajka la aqbalay ma jiro ajar aan ahayn Jannada” (Bukhaari 1773, Muslim 1349). Ku dadaal dabeecad wanaagsan iyo debacsanaan inta oo dhan.",
      },
      {
        title: "Tilmaan wax ku ool ah, ma aha fatwo",
        body: "Tani waa dulmar wax ku ool ah si ay kaaga caawiso inaad u raacdo hab-dhaqanka. Madhabyadu waxay ku kala duwan yihiin si xushmad leh oo ku saabsan tafaasiil badan, qof kasta oo xaj ah xaaladdiisuna way ka duwan tahay - had iyo jeer la tasho aqoonyahan aqoon leh ama hagahaaga Xajka ee rasmiga ah ee xukunnada gaarka ah iyo kiisaska lama filaanka ah.",
      },
    ],
  },
];
