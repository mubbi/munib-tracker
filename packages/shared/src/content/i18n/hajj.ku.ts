import type { PilgrimageChecklistItem } from "../../types/hajj-guide";
import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// KU overlay for Hajj & Umrah Learn topics + rite checklists.
// Index-aligned with English sources; only human-readable text is translated.

export const HAJJ_GUIDE_TOPICS_KU: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Mukofata hajek qebûl kirî",
    summary: "Haj mabrur gunehan jê dike, mukofata wî Cennet e.",
    body: [
      "Ebu Hurayre got ku Peygamberê Xwedê ﷺ got: «Her kes ji bo Xwedê haj bike û ne têkiliya cinsî ne guneh bike, wek roja ku dayika wî jê re dijî vegerîne» (Sahih al-Bukhari 1521; Sahih Muslim 1350).",
      "Her wiha got: «Hajek qebûl kirî (haj mabrur) mukofata wî ji Cennetê bêhtir tiştek nîne» (Sahih al-Bukhari 1773; Sahih Muslim 1349). Qebûlbûn bi dilsozî û parastina hajê ji nebaşî û gunehan ve girêdayî ye — ne tenê bi temamkirina gavên derve.",
    ],
    hadith: [
      {
        excerpt:
          "Her kes ji bo Xwedê haj bike û ne têkiliya cinsî ne guneh bike, wek roja ku dayika wî jê re dijî vegerîne.",
      },
      {
        excerpt:
          "Her kes ji bo Xwedê haj bike û ne têkiliya cinsî ne guneh bike, wek roja ku dayika wî jê re dijî vegerîne.",
      },
      { excerpt: "Hajek qebûl kirî mukofata wî ji Cennetê bêhtir tiştek nîne." },
      { excerpt: "Hajek qebûl kirî mukofata wî ji Cennetê bêhtir tiştek nîne." },
    ],
    actions: [
      "Hajê tenê ji bo Xwedê niyet bike — di hemû rêwîtiyê de ziman û xulqê xwe biparêze.",
      "Lîsteya hajê ya appê tenê wek bîraneke bikar bîne; dil li ser qebûlbûnê bigire.",
    ],
    appLinks: [{ label: "Lîsteya meremiyên hajê" }],
  },
  {
    title: "Fazîleta Umrah",
    summary: "Umrah heta Umrah gunehên di navbera de jê dike.",
    body: [
      "Ebu Hurayre got ku Peygamber ﷺ got: «Umrah kirin keffaret e ji bo gunehên di navbera wê û ya berê, hajek qebûl kirî jî mukofata wî ji Cennetê bêhtir tiştek nîne» (Sahih al-Bukhari 1773; Sahih Muslim 1349).",
      "Umrah dikare her demê salê were kirin. Ji hajê kurtir e, lê hîn jî ibadetek mezin e: ihram, tawaf, sa'i, û birîn an jî tîrjkirin.",
    ],
    hadith: [
      {
        excerpt:
          "Umrah kirin keffaret e ji bo gunehên di navbera wê û ya berê, hajek qebûl kirî jî mukofata wî ji Cennetê bêhtir tiştek nîne.",
      },
      {
        excerpt:
          "Umrah kirin keffaret e ji bo gunehên di navbera wê û ya berê, hajek qebûl kirî jî mukofata wî ji Cennetê bêhtir tiştek nîne.",
      },
    ],
    actions: ["Lîsteya Umrah veke dema ku tu amade yî meremiyan bi rêz bişopînî."],
    appLinks: [{ label: "Lîsteya meremiyên Umrah" }],
  },
  {
    title: "Roja Arafah",
    summary: "Li Arafah man standina hajê ye — û rojek mezin a dua.",
    body: [
      "Abd ar-Rahman ibn Ya'mar got ku Peygamber ﷺ got: «Haj Arafah e» (Sunan Abi Dawud 1949; Jami' at-Tirmidhi 889). Her kes ku li sînorên Arafah di dema xwe de standin winda bike, hajê wê salê winda kiriye.",
      "Ji bo kesên ne li ser hajê, rojî li roja Arafah pîroz e: Ebu Qatada got ku rojîya Arafah sala borî û ya tê keffaret dike (Sahih Muslim 1162). Hacî rojî nakin da ku rojê ji bo dua veqetînin.",
    ],
    hadith: [
      { excerpt: "Haj Arafah e." },
      { excerpt: "Haj Arafah e." },
      {
        excerpt: "Rojî li roja Arafah — ji Xwedê hêvî dikim ku sala berê û ya paşî keffaret bike.",
      },
    ],
  },
  {
    title: "Haj — rukna pêncem",
    summary: "Di jiyanê de carekî li ser her muslimek qadir farz e.",
    body: [
      "Xwedê dibêje: «Li ser mirovan haj a Xwedê ye ji bo malê — ji bo her kes ku rê bibîne. Her kes ku kufr bike — Xwedê ji cîhanan bê pêwîst e» (Qur'an 3:97).",
      "Bang ji bo hemû mirovan hate kirin: «Li mirovan haj bang bike; bi lingan û bi her gemarê têr dê werin; ji her derî dûr dê werin» (Qur'an 22:27).",
      "Ibn Umar got ku Peygamber ﷺ got Îslam li ser pênc tiştan ava ye: şehadet, namaz, zekat, rojîya Remezanê, û haj a malê ji bo kesê qadir (Sahih al-Bukhari 8; Sahih Muslim 16). Alim hevber dibêjin ku carekî di jiyanê de farz e dema şert pêk werin; dubarekirin fazîletek dilxwaz e.",
    ],
    quran: [
      { excerpt: "Li ser mirovan haj a malê ji bo her kes ku rê bibîne..." },
      { excerpt: "Li mirovan haj bang bike; bi lingan û bi her gemarê têr dê werin..." },
    ],
    hadith: [
      {
        excerpt:
          "Îslam li ser pênc tiştan ava ye: şehadet ku ne xwedanê dinê Xwedê ye û Muhammed Peygamberê Xwedê ye, avakirina namazê, dayîna zekatê, rojîya Remezanê, û haj a malê ji bo kesê rê bibîne.",
      },
      { excerpt: "Îslam li ser pênc tiştan ava ye... û haj a malê ji bo kesê rê bibîne." },
    ],
  },
  {
    title: "Qadirî (istita'ah)",
    summary: "Tenduristî, dewlemendiya helal, û rêya ewle — bê van haj hîn farz nîne.",
    body: [
      "Şerta Qur'an 3:97 qadirî ye (istita'ah). Alimên kevn li ser vê dipeyivin: tenduristiya laş ji bo rêwîtiyê, dewlemendiya helal a bes ji bo rêwîtiyê û ji bo hewcedariyên kesên ku tu berpirsiyarî wan di dema nebûna te de, û rêyek ewle û vekirî.",
      "Her kes ku van salê vê salê tune be, guneh nake ku paşve bixe heta qadir bibe. Qadirî li gorî her rewşê tê nirxandin — nexweşî, deyn ku divê were dayîn, an rêwîtiya neewle dikare farza niha rake. Dema rewşa te ne zelal be, ji alimek qebil bipirse.",
    ],
    quran: [{ excerpt: "...ji bo her kes ku rê bibîne." }],
    actions: [
      "Deynên farz berî rezervasyonê bidin û ji bo kesên ku tu berpirsiyarî wan re xercan rêk bixin.",
      "Pakêtan tenê bi kanalên fermî piştrast bike (mijarên amadekariyê binêre).",
    ],
  },
  {
    title: "Rêwîtiya jina ji bo hajê",
    summary: "Piranî mahram dixwazin; hin ramanên paşîn destûr didin koma ewle û pêbawer.",
    body: [
      "Ibn Abbas got ku Peygamber ﷺ got jinek bê mahram ne rêkeve, mêr jî nekeve ser wê heta mahram li cem wê be (Sahih al-Bukhari 1862; Sahih Muslim 1341). Gelek alim vê li ser rêwîtiya haj û Umrah datînin.",
      "Hin alimên paşîn — bi hesabkirina ewlehiyê, hewcedariyê, û rêwîtiya nûjen — destûr didin jinek ji bo haj a farz di komek pêbawer de rêkeve dema mahram tune be. Ev hîn pirs fiqh e.",
    ],
    hadith: [
      { excerpt: "Jinek bê mahram ne rêkeve, mêr jî nekeve ser wê heta mahram li cem wê be." },
      {
        excerpt:
          "Ne helal e ji bo jinek ku bi Xwedê û Roja Dawî bawer dike rojek û şevek bê mahram rêkeve.",
      },
    ],
    madhhabNote:
      "Piranî dibêjin jinek ji bo rêwîtiya hajê mahram hewce dike. Hin alimên paşîn ji bo haj a farz rêwîtiya di koma jinan a ewle de destûr didin. Alimek ku tu bawerî pê dixî û rêgezên rêveberiya hajê bişopîne.",
  },
  {
    title: "Sê cureyên hajê",
    summary: "Ifrad, Qiran, û Tamattu' — berî ihram cureyê xwe hilbijêre.",
    body: [
      "Ifrad: tenê ji bo hajê ihram bike, bê Umrah a cuda di wî ihram de, û ji ber yekkirinê qurbanî ne hewce ye.",
      "Qiran: Umrah û haj di yek ihram de yek bike, heta haj temam bibe di ihram de bimîne. Qurbanî (hady) hewce ye.",
      "Tamattu': Umrah a tevahî di mehên hajê de bike, ji ihram derkeve, paşê li 8 Zul-Hijjah ji bo hajê dîsa ihram bike. Ev tiştê piraniya haciyan îro dikin e; ev jî hady hewce dike.",
      "Xwedê li ser yekkirina meremiyan dibêje: «...Her kes ji Umrah bo hajê sûde werbigire, tiştê qurbanî yê bi asanî hestiyê...» kesên ku nikarin sê roj rojî di hajê de û heft roj piştî vegerê (Qur'an 2:196).",
    ],
    quran: [
      {
        excerpt:
          "Haj û Umrah ji bo Xwedê temam bike... Her kes ji Umrah bo hajê sûde werbigire, tiştê qurbanî yê bi asanî hestiyê. Kesê ku nikare — sê roj rojî di hajê de û heft roj piştî vegerê...",
      },
    ],
    actions: [
      "Cureya xwe bi rêberê komê berî miqat diyar bike.",
      "Heke Tamattu' dikî, Umrah bi tevahî temam bike berî ku ji bo hajê dîsa ihram bikî.",
    ],
    appLinks: [{ label: "Lîsteya Umrah" }, { label: "Lîsteya hajê" }],
  },
  {
    title: "Pênc miqat",
    summary: "Miqat li ser rêya Makkah bê ihram ji bo haj an Umrah derbas nebe.",
    body: [
      "Ibn Abbas got ku Peygamber ﷺ miqat ji bo mirovan diyar kir: Zul-Hulayfa ji bo Medîneyê, Al-Juhfah ji bo Şamê, Qarn al-Manazil ji bo Nejdê, Yalamlam ji bo Yemenê; û ji bo Iraqê Zat 'Irq. Got ev ji bo wan in û ji bo her kes ku bi niyeta haj an Umrah derbas dibin; kesên di nav van sînoran de ji cihê ku dest pê dikin ihram dikin, tewra gelê Makkah ji Makkah (Sahih al-Bukhari 1524; Sahih Muslim 1181).",
      "Firokgeh û benderên nûjen xalên ihram an prosedurên ragihandî hene — rêbernameya hilgirê û Wezareta Haj û Umrah bişopîne da ku sînor bê ihram derbas nebî.",
    ],
    hadith: [
      {
        excerpt:
          "Peygamberê Xwedê ﷺ Zul-Hulayfa ji bo gelê Medîneyê, Al-Juhfah ji bo gelê Şamê, Qarn al-Manazil ji bo gelê Nejdê, Yalamlam ji bo gelê Yemenê diyar kir... Ev miqat ji bo wan in û ji bo her kes ku bi niyeta haj an Umrah derbas dibin...",
      },
      {
        excerpt:
          "Peygamberê Xwedê ﷺ miqat diyar kir... Kesên di nav van sînoran de ji cihê ku dest pê dikin ihram dikin...",
      },
    ],
  },
  {
    title: "Têketina ihram",
    summary: "Ghusl, cil, niyet, û telbiye rewşa pîroz dest pê dikin.",
    body: [
      "Ihram rewşa pîroz e ku bi niyeta haj an Umrah tê ketin. Peygamber ﷺ ghusl berî ihram pêşniyar kir. Mêr du cilên spî yên ne dirêj li xwe dikin; jin cilên normal ên edebdar digire bê ku rû veşêre an destan bi destglov wek cilê ihram bike (hûragahiyên niqab û destglov fiqh e).",
      "Mêr dikare berî ihram li laş xûyî bikar bîne, ne li cilên ihram piştî ketina rewşê (Sahih al-Bukhari 1539). Paşê niyet bike û telbiye dest pê bike.",
      "Telbiyeya ku Peygamber ﷺ fêr kir: «Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni'mata laka wal-mulk, la sharika lak» — heta destpêka tawaf ji bo Umrah, an heta avêtina Jamrat al-Aqaba ji bo haj li gorî pratîka nas (Sahih al-Bukhari 1549; Sahih Muslim 1184).",
    ],
    hadith: [
      { excerpt: "Aisha got: Ez ji bo ihrama Peygamberê Xwedê ﷺ berî ku ihram bike xûyî dikir..." },
      {
        excerpt:
          "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni'mata laka wal-mulk, la sharika lak.",
      },
      { excerpt: "Peygamber ﷺ bi deng bilind telbiye got: Labbayk Allahumma labbayk..." },
    ],
    actions: [
      "Ji bo mêran kêm kêm du set ihram bîne; tiştên bê xûyî amade bike.",
      "Berî rêwîtiyê telbiye pratîk bike da ku li rêyê bi rehet were gotin.",
    ],
  },
  {
    title: "Qedexeyên ihram",
    summary: "Tiştên ku muhrim divê heta rizgarkirinê ji wan dûr bimîne.",
    body: [
      "Di ihram de dûr bibe: mêr — cilên dirêj an guncav û serê niximandin; xûyî; birîn an tîrnok qut kirin; şikara erdê; zewac an pêkanîna wî; têkiliya cinsî. Jin ji xûyî û qedexeyên din ên hevbeş dûr dikeve digel cilên edebdar.",
      "Shikandina qedexeyê dikare keffaret (fidyah) hewce bike — bi gelemperî rojî, xwarina feqîran, an qurbanî — li gorî tiştê hat kirin. Mezheb hûragahiyan cuda dikin. Bi baldarî qedexeyan biparêze; heke tiştek nehêvî bibe, ji rêberek qebil bipirse.",
    ],
    actions: ["Di ihram de xûyî, qutkerê tîrnokê, û qeyçî ji destê dûr bihêle."],
    madhhabNote:
      "Lîsteyên binpêkirin û keffaret li gorî mezheban cuda ne. Vê wek lîsteya hişyariyê bîne, paşê hûragahiyan bi mezheb an rêberê hajê xwe piştrast bike.",
  },
  {
    title: "Umrah — ihram û telbiye",
    summary: "Li miqat an berî wê bikeve rewşa pîroz, paşê bersiva bangê Xwedê bide.",
    body: [
      "Li miqat an berî wê, heke bikarî ghusl bike, cilên ihram li xwe bike, niyeta Umrah bike, û telbiye dest pê bike. Rewşa pîroz bi vê niyetê dest pê dike.",
      "Telbiye gelek caran dubare bike dema ku ber bi Makkah diçî heta destpêka tawaf. Ev eşkere dike ku tu tenê bersiva bangê Xwedê didî.",
    ],
    actions: ["Lîsteya Umrah bikar bîne da ku her meremî piştî temamkirinê nîşan bikî."],
    appLinks: [{ label: "Lîsteya Umrah" }],
  },
  {
    title: "Tawaf a Ka'bah",
    summary: "Heft dor li dij saetê, destpêk li kevirê Reş.",
    body: [
      "Ka'bah heft caran li dij saetê dor bike, destpêk û dawî li keviya kevirê Reş. Heke gelek kes bin, bus, dest lê bike, an bi takbir nîşan bide — li gorî pratîka Peygamber ﷺ bê ziyan li kesên din.",
      "Mêr di sê dorên yekem de raml (gavên bilez) û di vî tawaf a hatina Umrah de idtiba' (milê rast vekirî) dikin, li gorî Sunneta nas.",
      "Di navbera keviya Yemenî û kevirê Reş de tê pêşniyar kirin gotin: «Rabbena, ji me re di vê dinyayê de başî û di ahiretê de başî bide, û me ji cehnema parastin» (Qur'an 2:201).",
    ],
    quran: [
      {
        excerpt:
          "Rabbena, ji me re di vê dinyayê de başî û di ahiretê de başî bide, û me ji cehnema parastin.",
      },
    ],
  },
  {
    title: "Du rekat û Zamzam",
    summary: "Heke gengaz be li pişt Maqam Ibrahim namaz bike, paşê Zamzam vexwe.",
    body: [
      "Piştî tawaf, heke cih hebe du rekat li pişt Maqam Ibrahim bike, an li cih din li mescidê heke gelek kes bin — li gorî gotina Xwedê: «...Ey baweran, ji cihê ku Îbrahîm li wir bû cihê namazê bigirin...» (Qur'an 2:125).",
      "Paşê ava Zamzam vexwe. Di vebêrîna Jabir a haj a Peygamber ﷺ de vexwarina Zamzam piştî tawaf heye; Peygamber ﷺ got Zamzam ji bo tiştê ku ji bo wê tê vexwarin e (raporên rast ku alimên paşîn kom kirine; niyet û dua tê pêşniyar kirin).",
    ],
    quran: [{ excerpt: "...Ey baweran, ji cihê ku Îbrahîm li wir bû cihê namazê bigirin..." }],
  },
  {
    title: "Sa'i di navbera Safa û Marwah",
    summary: "Heft dor bi bîra lêgerîna avê ya Hajar.",
    body: [
      "Xwedê dibêje: «Bi rastî, Safa û Marwah ji nişaneyên Xwedê ne. Her kes ku haj a malê an Umrah bike — guneh nîne ku di navbera wan de biçe...» (Qur'an 2:158).",
      "Heft caran di navbera Safa û Marwah de biçe, ji Safa dest pê bike. Li Safa ber bi Ka'bah ve bibîne, destan ji bo takbir û dua bilind bike wek Peygamber ﷺ kir. Mêr di navbera nîşanên kesk de diherikin.",
    ],
    quran: [
      {
        excerpt:
          "Bi rastî, Safa û Marwah ji nişaneyên Xwedê ne. Her kes ku haj a malê an Umrah bike — guneh nîne ku di navbera wan de biçe...",
      },
    ],
  },
  {
    title: "Halq an taqsir — temamkirina Umrah",
    summary:
      "Mêr ser tije dikin an jî kurt dikin; jin bi qasî tipê tîrjkirin — paşê ihram rizgar dibe.",
    body: [
      "Mêr ser tije dike (halq) — Peygamber ﷺ sê caran ji bo tije kirin dua kir — an bi yekhev kurt dike (taqsir). Jin tîrên xwe kom dike û bi qasî tipê tîrjkirin dike. Bi vê Umrah temam dibe û qedexeyên ihram dikevin.",
      "Abdullah ibn Umar got ku Peygamberê Xwedê ﷺ got: «Xwedêyo, ji bo yên ser tije dikin rehm bike». Gotin: «Û yên kurt dikin, ey Peygamberê Xwedê?» Di cara sêyemîn de got: «Û yên kurt dikin» (Sahih al-Bukhari 1727; Sahih Muslim 1301).",
    ],
    hadith: [
      {
        excerpt:
          "Xwedêyo, ji bo yên ser tije dikin rehm bike... di cara sêyemîn de: û yên kurt dikin.",
      },
      {
        excerpt:
          "Xwedêyo, yên ser tije dikin bibore... di cara sêyemîn de got: û yên tîr kurt dikin.",
      },
    ],
  },
  {
    title: "8 Zul-Hijjah — Roja Tarwiyah",
    summary: "Ji bo hajê ihram bike û rojê li Mina derbas bike.",
    body: [
      "Ji bo haciyên Tamattu': niyeta hajê bike û ji cihê xwe li Makkah dîsa ihram bike, telbiye nû bike. Ifrad û Qiran berê di ihram de ne.",
      "Biçe Mina û Zuhur, Asr, Maghrib, Isha, û Fajr a paşîn bi rêz bike, her yek li dema xwe kurt bike du rekat, li gorî pratîka Peygamber ﷺ di haj a Vedanê de wek Jabir got (Sahih Muslim 1218). Roj û şevê di ibadetê de derbas bike, li benda Arafah be.",
    ],
    hadith: [
      {
        excerpt:
          "Rivayeta dirêj a Jabir a haj a Vedanê ya Peygamber ﷺ — li Mina man û rêza meremiyan.",
      },
    ],
    actions: ["Li sibehê roja 8'an lîsteya hajê veke."],
    appLinks: [{ label: "Lîsteya hajê" }],
  },
  {
    title: "9 Zul-Hijjah — Roja Arafah",
    summary: "Di nav Arafah de bimîne heta rojava; paşê biçe Muzdalifah.",
    body: [
      "Di sînorên Arafah de ji piştî nîvro heta rojava di dua, zikr, û tewbeyê de bimîne. Peygamber ﷺ got «Haj Arafah e» (Sunan Abi Dawud 1949). Ber bi qibla ve bibîne, destan bilind bike, û ji Xwedê daxwaz bike — ji demên mezin ên dua.",
      "Zuhur û Asr bi hev re li dema Zuhur kurt bike (jam' taqdim), paşê beşê mayî ya rojê ji bo dua veqetîne ne ji bo namaza neferz — li gorî pratîka Peygamber ﷺ (Sahih Muslim 1218).",
      "Piştî rojava bi aramî biçe Muzdalifah. Maghrib û Isha yek bike (Isha kurt), şevê bistîne, û keviran ji bo avêtinê berhev bike. Kesên lawaz û jin dikarin piştî nîvê şevê biçin Mina li gorî destûrên nas a Sunnah.",
    ],
    hadith: [
      { excerpt: "Haj Arafah e." },
      {
        excerpt:
          "Peygamber ﷺ li Arafah Zuhur û Asr yek kir, paşê piştî rojava ber bi Muzdalifah ve çû...",
      },
    ],
  },
  {
    title: "10 Zul-Hijjah — Roja Nahr",
    summary: "Avêtin, qurbanî, tîr, û Tawaf al-Ifadah.",
    body: [
      "Vegere Mina û heft kevir li Jamrat al-Aqaba (stûna mezin) bavêje, bi her avêtinê Allahu akbar — yekem meremî rojê di rêza haj a Vedanê de.",
      "Qurbanî ya hewce ji bo Tamattu' û Qiran pêşkêş bike (Qur'an 2:196), an bi rêya ajansek pêbawer rêk bixe. Goşt tê xwarin û ji feqîran re tê dayîn.",
      "Tije bike (halq) an kurt bike (taqsir); jin bi qasî tipê tîrjkirin dike. Piştî avêtin û tije/kurtkirin, tahallul awwal tê — piraniya qedexeyên ihram dikevin, ji têkiliya cinsî bilî.",
      "Biçe Makkah ji bo Tawaf al-Ifadah — rukna hajê — û sa'i ji bo haciyên Tamattu' (Ifrad/Qiran ku berê sa'i bi tawaf a hatina xwe kirine li gorî mezheba xwe). Ev rizgarkirina tevahî ya ihram temam dike.",
    ],
    quran: [
      {
        excerpt: "...Her kes ji Umrah bo hajê sûde werbigire, tiştê qurbanî yê bi asanî hestiyê...",
      },
    ],
    madhhabNote:
      "Rêza meremiyên roja Nahr di Sunnah de flexîbîlîte heye; mezheb li ser rêza tam û dema sa'i ji bo her cure hajê cuda ne. Rêberê komê xwe bişopîne.",
  },
  {
    title: "11–13 Zul-Hijjah — Rojên Tashriq",
    summary: "Şevên li Mina, rojane avêtina sê Jamarat, paşê tawaf a vedanê.",
    body: [
      "Şevên 11, 12 (û 13 heke zû neçî) li Mina derbas bike. Ev rojên xwarin, vexwarin, û bîra Xwedê ne.",
      "Her roj piştî Zuhur heft kevir li her sê stûnan bi rêz bavêje — biçûk, navîn, mezin — bi takbir li her avêtinê. Kesê zû diçe dikare piştî avêtina roja 12 biçe (Qur'an 2:203).",
      "Berî ku Makkah terk bikî Tawaf al-Wada bike da ku dawî bi malê re vedana be. Ibn Abbas got mirov hatin emr kirin ku meremiya wan a dawîn li malê be, ji jina di heyza de re hêsan kirin (Sahih al-Bukhari 1755; Sahih Muslim 1328).",
    ],
    quran: [
      {
        excerpt:
          "Xwedê bi rojên hejmarî bîra bînin. Her kes di du rojan de zû biçe — guneh nîne; her kes paşve bixe — guneh nîne — ji bo kesê ku ji Xwedê ditirse...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mirov hatin emr kirin ku tawaf a vedana Ka'bah meremiya wan a dawîn be, ji jina di heyza de re efû kirin.",
      },
      {
        excerpt:
          "Mirov hatin emr kirin ku meremiya wan a dawîn li malê be, lê ji jina di heyza de re hêsan kirin.",
      },
    ],
  },
  {
    title: "Rukn û wajib",
    summary: "Tiştên ku hajê derxînin heke winda bibin, û tiştên bi qurbanî têne keffaret kirin.",
    body: [
      "Rukn (arkan) bingehê hajê ne. Heke rukn winda bibe, haj derbas nabe û tenê qurbanî nakeve cih — divê were temam kirin. Piranî bi gelemperî dinivîsin: ihram (niyet), li Arafah man, Tawaf al-Ifadah, û sa'i.",
      "Wajib (wajibat) di nav de: ihram ji miqat, li Muzdalifah man, avêtina Jamarat, şevên Tashriq li Mina, û Tawaf a Vedanê. Windakirina wajib hajê derxîne lê bi dam (qurbanî) tê keffaret kirin li gorî mezheban.",
    ],
    madhhabNote:
      "Lîsteyên rast a arkan û wajibat di nav çar mezheban de cuda ne. Bi rêberek qebil ji bo mezheba xwe piştrast bike — bi taybetî heke tiştek winda bibe di bin zexta gel de.",
  },
  {
    title: "Edeb û dilsozî",
    summary: "Ziman û endam biparêze — qebûlbûn bi xulqê ve girêdayî ye.",
    body: [
      "Hadîsa vegera bê guneh (Bukhari 1521; Muslim 1350) diyar dike ku haj bi nebaşî (rafath), guneh (fusuq), û nakokî tê xirab kirin. Sebir, nermî, û alîkariya haciyên din parçeyek ibadetê ne.",
      "Telefon û axaftina vala li Arafah û mescidê serdest nebin. Li tawaf rê bide; ne bi zor ber bi kevirê Reş ve biçe. Hajek qebûl kirî hevparê Cennetê ye — di hemû rêwîtiyê de xulqê baş hewl bide.",
    ],
    hadith: [
      {
        excerpt:
          "Her kes ji bo Xwedê haj bike û ne têkiliya cinsî ne guneh bike, wek roja ku dayika wî jê re dijî vegerîne.",
      },
    ],
    actions: ["Niyetek rojane saz bike: yek kiryarê dilovanî û yek dua dilsoz li ser gel."],
  },
  {
    title: "Vîza û qeydkirin",
    summary: "Kanalên fermî bikar bîne — Nusuk û rêveberiya haj a neteweyî.",
    body: [
      "Nusuk (nusuk.sa) platforma fermî ya Erebistana Siûdî ji bo haj û Umrah e — vîza, cih, veguhastin, û pakêtên qeydkirî. Naverokên nefermî çavkaniya xapandinê ya berbelav in.",
      "Her welat kotayek salane ya hajê distîne; piraniya haciyan bi rêya rêveberiya haj a neteweyî an ajansek lîsansdar daxwaz dikin. Umrah kotayê nîne û di piraniya salê de bi kanalên pejirandî tê rêk xistin.",
    ],
    actions: [
      "Zû daxwaz bike dema ku demsal vedibe.",
      "Tenê bi ajansên li Nusuk an rêveberiya neteweyî rezerv bike.",
      "Kanalên dravdan berî veguhastina dravê piştrast bike.",
    ],
  },
  {
    title: "Tiştên ku divê werin",
    summary: "Ihram, tiştên bê xûyî, belge, û rehetiya gerê.",
    body: [
      "Mêr: kêm kêm du set ihram ne dirêj û kemer ji bo belgeyan. Jin: cilên fireh ên edebdar. Sandaletên vekirî yên hêsan; çanteyek piçûk û tûlek avê.",
      "Sabûn û krema rojê bê xûyî bîne — xûyî di ihram de qedexe ye. Pasaport, çap a vîzayê, tomarên aşî, û têkilîyên acil li qutiyek tenik de bihêle. Power bank û SIM an eSIM a herêmî di gel de alîkar in.",
    ],
    actions: [
      "Lîste: ihram ×2, sandalet, tiştên bê xûyî, qutiya belgeyan, derman, power bank.",
      "Plasterên piyê bîne — hacî gelek diçin.",
    ],
  },
  {
    title: "Cihên pîroz bi kurt",
    summary: "Makkah, Medîne, Mina, Arafah, û Muzdalifah — notên pratîk.",
    body: [
      "Masjid al-Haram Ka'bah di nav xwe de digire — cihê tawaf û sa'i; gelek gel bihêle. Masjid an-Nabawi li Medîneyê parçeyek hajê nîne lê piraniya haciyan serdan dikin; têketina Rawdah bi appên fermî dem tê diyar kirin.",
      "Mina bajarê konan e ji bo şevên 8 û 11–13 Zul-Hijjah. Arafah deşt vekirî ye — av û sîyar li roja 9'an girîng in. Muzdalifah cih e ku hacî li bin ezmanê vekirî dinêrîn û kevir berhev dikin — tesis bi qasd sînordar in.",
    ],
    actions: ["Berî rêwîtiyê nexşeyek hêsan a Mina–Arafah–Muzdalifah fêr bibe."],
  },
  {
    title: "Çavkaniyên fermî",
    summary: "Nusuk, rêveberiya neteweyî, û Visit Saudi.",
    body: [
      "Bi Nusuk dest pê bike ji bo vîza, pakêt, destûrên Rawdah, û rêbernameya gel. Ji wezareta haj a welatê xwe ji bo kotayê û qaîdeyên tenduristiyê bikar bîne. Visit Saudi şîretên giştî yên têketin û rêwîtiyê weşîne.",
      "Heke peyman bi awayek neasayî erzan xuya bibe an broker ji derve kanalên fermî drav bixwaze, berî dravdanê rasterast bi portalê wezaretê piştrast bike.",
    ],
    actions: [
      "nusuk.sa û malpera rêveberiya haj a neteweyî bookmark bike.",
      "Têkilîyên acil ji rêberê komê xwe tomar bike.",
    ],
  },
];

export const HAJJ_CHECKLIST_KU: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Ji bo hajê ihram",
    hint: "Niyeta hajê bike û ihram bike (ji Makkah ji bo tamattu'); telbiye nû bike.",
    day: "8 Zul-Hijjah",
  },
  {
    title: "Biçe Mina",
    hint: "Li Mina ji Zuhur heta Fajr bi rêz bike, her yek li dema xwe kurt.",
    location: "Mina",
    day: "8 Zul-Hijjah",
  },
  {
    title: "Li Arafah bimîne",
    hint: "Di nav Arafah de ji piştî nîvro heta rojava di dua û zikr de bimîne.",
    location: "Arafah",
    day: "9 Zul-Hijjah",
  },
  {
    title: "Zuhur û Asr yek bike",
    hint: "Zuhur û Asr bi hev re li dema Zuhur kurt bike, paşê ji bo dua veqetîne.",
    location: "Arafah",
    day: "9 Zul-Hijjah",
  },
  {
    title: "Biçe Muzdalifah",
    hint: "Piştî rojava Maghrib û Isha yek bike, bistîne, û kevir berhev bike.",
    location: "Muzdalifah",
    day: "9 Zul-Hijjah",
  },
  {
    title: "Jamrat al-Aqaba bavêje",
    hint: "Heft kevir li stûna mezin bavêje, bi takbir li her avêtinê.",
    location: "Mina",
    day: "10 Zul-Hijjah",
  },
  {
    title: "Qurbanî pêşkêş bike",
    hint: "Ji bo tamattu' û qiran hewce — xwe an bi ajansek pêbawer.",
    day: "10 Zul-Hijjah",
  },
  {
    title: "Halq an taqsir",
    hint: "Mêr tije an kurt; jin bi qasî tipê (tahallul yekem).",
    day: "10 Zul-Hijjah",
  },
  {
    title: "Tawaf al-Ifadah",
    hint: "Tawaf al-Ifadah û sa'i ji bo tamattu' — rukna hajê.",
    location: "Masjid al-Haram",
    day: "10 Zul-Hijjah",
  },
  {
    title: "Şev li Mina",
    hint: "Şevên 11, 12 (û 13 heke zû neçî) li Mina derbas bike.",
    location: "Mina",
    day: "11–13 Zul-Hijjah",
  },
  {
    title: "Sê Jamarat bavêje",
    hint: "Her roj piştî Zuhur biçûk, navîn, paşê mezin — heft her yek.",
    location: "Mina",
    day: "11–13 Zul-Hijjah",
  },
  {
    title: "Tawaf a vedanê",
    hint: "Berî ku Makkah terk bikî Tawaf al-Wada (jina di heyza de efû ye).",
    location: "Masjid al-Haram",
    day: "Derketin",
  },
];

export const UMRAH_CHECKLIST_KU: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Têkeve ihram",
    hint: "Li miqat an berî wê: ghusl, cilên ihram, niyeta Umrah, telbiye.",
    location: "Miqat",
  },
  { title: "Telbiye bixwîne", hint: "Labbayk… gelek caran dubare bike heta destpêka tawaf." },
  {
    title: "Tawaf a Ka'bah",
    hint: "Heft dor li dij saetê ji kevirê Reş; mêr: raml û idtiba'.",
    location: "Masjid al-Haram",
  },
  {
    title: "Du rekat bike",
    hint: "Li pişt Maqam Ibrahim heke gengaz be, paşê Zamzam vexwe.",
    location: "Masjid al-Haram",
  },
  {
    title: "Sa'i Safa û Marwah",
    hint: "Heft dor ji Safa dest pê bike; mêr di navbera nîşanên kesk de diherikin.",
    location: "Masjid al-Haram",
  },
  { title: "Halq an taqsir", hint: "Mêr tije an kurt; jin bi qasî tipê — Umrah temam e." },
];
